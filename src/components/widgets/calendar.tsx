"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CalendarDays } from "lucide-react";
import { WidgetShell } from "./widget-shell";

interface CalEvent {
  id: string;
  title: string;
  start: string;
  end: string | null;
  category: string;
}

const TZ = "America/New_York";

function parseDate(iso: string): { day: string; month: string; time: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "", month: "", time: "" };
  const fmtParts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    month: "short",
    day: "numeric",
  }).formatToParts(d);
  const day = fmtParts.find((p) => p.type === "day")?.value ?? "";
  const month = (
    fmtParts.find((p) => p.type === "month")?.value ?? ""
  ).toUpperCase();
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
  });
  return { day, month, time };
}

function isAllDay(start: string): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date(start));
  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  return hour === "00" && minute === "00";
}

export function CalendarWidget() {
  const [events, setEvents] = useState<CalEvent[] | null>(null);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/calendar");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { items: CalEvent[] };
        if (!cancelled) setEvents(data.items || []);
      } catch {
        if (!cancelled) setError(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <WidgetShell
      title="Calendar"
      eyebrow="UPCOMING EVENTS"
      accent="gold"
      href="https://www.stmarksschool.org/about/calendar"
      hrefLabel="Full Calendar"
      scrollable={false}
    >
      {error ? (
        <div className="flex h-full flex-col items-center justify-center text-center" role="alert">
          <AlertCircle className="h-5 w-5 text-sm-danger mb-2" aria-hidden="true" />
          <p className="text-xs font-semibold text-sm-text mb-1">
            Couldn&apos;t load calendar
          </p>
          <button
            onClick={() => {
              setError(false);
              setReloadKey((k) => k + 1);
            }}
            className="focus-ring mt-3 min-h-[40px] rounded-sm px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-sm-navy hover:underline"
          >
            Try again
          </button>
        </div>
      ) : events === null ? (
        <ul className="space-y-2" role="status" aria-label="Loading calendar">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="h-12 animate-pulse rounded bg-sm-cream" />
          ))}
        </ul>
      ) : events.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <CalendarDays
            className="h-7 w-7 text-sm-text-muted/60 mb-2"
            aria-hidden="true"
          />
          <p className="text-sm font-semibold text-sm-text">
            Nothing on the calendar
          </p>
          <p className="text-[11px] text-sm-text-muted mt-1">
            Check back soon for upcoming events.
          </p>
        </div>
      ) : (
        <ul className="space-y-0 flex-1" aria-label="Upcoming calendar events">
          {events.slice(0, 6).map((event, idx) => {
            const { day, month, time } = parseDate(event.start);
            const isFirst = idx === 0;
            const allDay = isAllDay(event.start);
            return (
              <li
                key={event.id + event.start}
                className={`flex items-center gap-4 py-3 border-b border-sm-border/60 last:border-0 ${
                  isFirst ? "border-l-2 border-l-sm-gold pl-3 -ml-3" : ""
                }`}
              >
                <div className="flex-shrink-0 w-12 text-center">
                  <p
                    className="display-number text-2xl text-sm-navy tabular-nums"
                    aria-label={`${month} ${day}`}
                  >
                    {day}
                  </p>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-sm-text-muted mt-0.5">
                    {month}
                  </p>
                </div>
                <div className="flex-1 min-w-0 border-l border-sm-border/60 pl-4">
                  <h4 className="text-xs font-bold text-sm-text leading-snug truncate">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-sm-text-muted leading-snug flex-wrap">
                    <span className="uppercase tracking-wider">
                      {event.category}
                    </span>
                    {!allDay && time && (
                      <>
                        <span className="text-sm-border" aria-hidden="true">
                          ·
                        </span>
                        <span className="tabular">{time}</span>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </WidgetShell>
  );
}
