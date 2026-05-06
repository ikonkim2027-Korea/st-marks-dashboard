import { NextResponse } from "next/server";

export const revalidate = 3600;

interface CalEvent {
  id: string;
  title: string;
  start: string;
  end: string | null;
  category: string;
  allDay: boolean;
}

interface CalendarFeed {
  calendarid: number;
  calendarname: string;
  liveURL?: string;
}

function inferCategory(title: string): string {
  const t = title.toLowerCase();
  if (/(athletic|game|tournament|vs\.|home|away)/.test(t)) return "athletics";
  if (/(concert|recital|theater|art|gallery|music)/.test(t)) return "arts";
  if (/(chapel|seated|community|reunion|grandparents)/.test(t))
    return "community";
  if (/(break|holiday|vacation|spring|winter|thanksgiving)/.test(t))
    return "break";
  if (/(exam|class|saturday program|seminar)/.test(t)) return "academic";
  return "school";
}

const FEEDS_URL =
  "https://www.stmarksschool.org/cf_endpoints/routes.cfm/calendars.json?calendar_ids=387,382";

const FALLBACK_ICS_URLS = [
  "https://calendar.google.com/calendar/ical/web-alleventscalendar%40stmarksschool.org/public/basic.ics",
  "https://calendar.google.com/calendar/ical/web-admissioncalendar%40stmarksschool.org/public/basic.ics",
];

const SCHOOL_TIME_ZONE = "America/New_York";

function cleanIcsText(value: string): string {
  return value
    .replace(/\\n/g, " ")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .replace(/\s+/g, " ")
    .trim();
}

function unfoldIcs(text: string): string[] {
  return text.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
}

function getIcsValue(line: string): string {
  const idx = line.indexOf(":");
  return idx === -1 ? "" : cleanIcsText(line.slice(idx + 1));
}

function parseIcsDate(line: string): { value: string; allDay: boolean } | null {
  const raw = getIcsValue(line);
  const allDay = /(^|;)VALUE=DATE(;|:)/.test(line);

  if (allDay && /^\d{8}$/.test(raw)) {
    return {
      value: `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(
        6,
        8,
      )}T00:00:00-04:00`,
      allDay: true,
    };
  }

  if (/^\d{8}T\d{6}Z$/.test(raw)) {
    const date = new Date(
      raw.replace(
        /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,
        "$1-$2-$3T$4:$5:$6Z",
      ),
    );
    return { value: date.toISOString(), allDay: false };
  }

  if (/^\d{8}T\d{6}$/.test(raw)) {
    return {
      value: `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(
        6,
        8,
      )}T${raw.slice(9, 11)}:${raw.slice(11, 13)}:${raw.slice(13, 15)}-04:00`,
      allDay: false,
    };
  }

  return null;
}

async function fetchIcsUrls(): Promise<string[]> {
  const res = await fetch(FEEDS_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; StMarksDashboard/1.0; +https://stmarksschool.org)",
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return FALLBACK_ICS_URLS;

  const calendars = (await res.json()) as CalendarFeed[];
  const urls = calendars
    .map((calendar) => calendar.liveURL)
    .filter((url): url is string => Boolean(url));

  return urls.length > 0 ? urls : FALLBACK_ICS_URLS;
}

async function fetchCalendar(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; StMarksDashboard/1.0; +https://stmarksschool.org)",
      Accept: "text/calendar,text/plain;q=0.9,*/*;q=0.8",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return "";
  return res.text();
}

function parseEvents(ics: string): CalEvent[] {
  const events: CalEvent[] = [];
  let current: Partial<CalEvent> | null = null;

  for (const line of unfoldIcs(ics)) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }

    if (line === "END:VEVENT") {
      if (current?.id && current.title && current.start) {
        events.push({
          id: current.id,
          title: current.title,
          start: current.start,
          end: current.end ?? null,
          category: inferCategory(current.title),
          allDay: current.allDay ?? false,
        });
      }
      current = null;
      continue;
    }

    if (!current) continue;

    if (line.startsWith("UID")) {
      current.id = getIcsValue(line);
    } else if (line.startsWith("SUMMARY")) {
      current.title = getIcsValue(line);
    } else if (line.startsWith("DTSTART")) {
      const parsed = parseIcsDate(line);
      if (parsed) {
        current.start = parsed.value;
        current.allDay = parsed.allDay;
      }
    } else if (line.startsWith("DTEND")) {
      current.end = parseIcsDate(line)?.value ?? null;
    }
  }

  return events;
}

function dateKeyInSchoolTime(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SCHOOL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function eventDateKey(event: CalEvent): string {
  return event.allDay ? event.start.slice(0, 10) : dateKeyInSchoolTime(new Date(event.start));
}

export async function GET() {
  try {
    const urls = await fetchIcsUrls();
    const calendars = await Promise.all(urls.map(fetchCalendar));
    const seen = new Set<string>();
    const events: CalEvent[] = [];
    for (const calendar of calendars) {
      for (const ev of parseEvents(calendar)) {
        const key = `${ev.id}-${ev.start}`;
        if (seen.has(key)) continue;
        seen.add(key);
        events.push(ev);
      }
    }

    const todayKey = dateKeyInSchoolTime(new Date());
    // Athletics events live in a dedicated widget — keep this calendar focused
    // on school-wide events (concerts, chapel, breaks, fairs, programs).
    const upcoming = events
      .filter((e) => eventDateKey(e) >= todayKey)
      .filter((e) => e.category !== "athletics")
      .sort((a, b) => a.start.localeCompare(b.start))
      .slice(0, 12);

    return NextResponse.json({ items: upcoming });
  } catch (e) {
    return NextResponse.json(
      {
        items: [],
        error: e instanceof Error ? e.message : "unknown",
      },
      { status: 500 },
    );
  }
}
