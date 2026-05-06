import { NextResponse } from "next/server";

export const revalidate = 3600;

interface CalEvent {
  id: string;
  title: string;
  start: string;
  end: string | null;
  category: string;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "’")
    .replace(/&rsquo;/g, "’")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”");
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

async function fetchMonth(year: number, month: number): Promise<string> {
  // School site uses MM/DD/YYYY format for cal_date
  const url = `https://www.stmarksschool.org/about/calendar?cal_date=${String(
    month,
  ).padStart(2, "0")}/01/${year}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; StMarksDashboard/1.0; +https://stmarksschool.org)",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return "";
  return res.text();
}

function parseEvents(html: string): CalEvent[] {
  const out: CalEvent[] = [];
  const blockRegex =
    /<div class="fsCalendarInfo">([\s\S]*?)(?=<div class="fsCalendarInfo">|<\/div>\s*<\/div>\s*<\/div>)/g;
  let m: RegExpExecArray | null;
  while ((m = blockRegex.exec(html)) !== null) {
    const block = m[1];
    const titleMatch = block.match(
      /<a[^>]*class="fsCalendarEventTitle[^"]*"[^>]*data-occur-id="(\d+)"[^>]*>([\s\S]*?)<\/a>/,
    );
    if (!titleMatch) continue;
    const id = titleMatch[1];
    const title = decodeEntities(
      titleMatch[2].replace(/<[^>]+>/g, "").trim().replace(/\s+/g, " "),
    );
    if (!title) continue;

    const startMatch = block.match(
      /<time datetime="([^"]+)"[^>]*class="fsStartTime"/,
    );
    const endMatch = block.match(
      /<time datetime="([^"]+)"[^>]*class="fsEndTime"/,
    );
    if (!startMatch) continue;
    out.push({
      id,
      title,
      start: startMatch[1],
      end: endMatch ? endMatch[1] : null,
      category: inferCategory(title),
    });
  }
  return out;
}

export async function GET() {
  try {
    const now = new Date();
    const months: Promise<string>[] = [];
    for (let i = 0; i < 2; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push(fetchMonth(d.getFullYear(), d.getMonth() + 1));
    }
    const htmls = await Promise.all(months);
    const seen = new Set<string>();
    const events: CalEvent[] = [];
    for (const html of htmls) {
      for (const ev of parseEvents(html)) {
        const key = `${ev.id}-${ev.start}`;
        if (seen.has(key)) continue;
        seen.add(key);
        events.push(ev);
      }
    }

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    // Athletics events live in a dedicated widget — keep this calendar focused
    // on school-wide events (concerts, chapel, breaks, fairs, programs).
    const upcoming = events
      .filter((e) => new Date(e.start).getTime() >= todayMidnight.getTime())
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
