"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Trophy, Home, Plane } from "lucide-react";
import { WidgetShell } from "./widget-shell";

interface AthEvent {
  id: string;
  sport: string;
  level: string | null;
  opponent: string;
  location: "home" | "away" | "unknown";
  start: string;
  end: string | null;
}

// School schedule is published in Eastern Time. Pin the timezone so the
// games render correctly even when the student is studying abroad.
const TZ = "America/New_York";

function formatDate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: iso, time: "" };
  const date = d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: TZ,
    })
    .toUpperCase();
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
  });
  return { date, time };
}

export function AthleticsWidget() {
  const [events, setEvents] = useState<AthEvent[] | null>(null);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/athletics");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { items: AthEvent[] };
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
      title="Athletics"
      eyebrow="ISL"
      accent="navy"
      href="https://www.stmarksschool.org/athletics/schedule"
      hrefLabel="Full Schedule"
      scrollable={false}
    >
      {error ? (
        <div className="flex h-full flex-col items-center justify-center text-center" role="alert">
          <AlertCircle className="h-5 w-5 text-sm-danger mb-2" aria-hidden="true" />
          <p className="text-xs font-semibold text-sm-text mb-1">
            Couldn&apos;t load schedule
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
        <ul className="space-y-2" role="status" aria-label="Loading athletics">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="h-12 animate-pulse rounded bg-sm-cream" />
          ))}
        </ul>
      ) : events.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <Trophy className="h-7 w-7 text-sm-text-muted/60 mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold text-sm-text">
            No games scheduled
          </p>
          <p className="text-[11px] text-sm-text-muted mt-1">
            Check back for the next ISL matchup.
          </p>
        </div>
      ) : (
        <ul className="space-y-0 flex-1" aria-label="Upcoming athletics events">
          {events.slice(0, 6).map((event, idx) => {
            const isNext = idx === 0;
            const { date, time } = formatDate(event.start);
            const venueWord =
              event.location === "home"
                ? "home"
                : event.location === "away"
                ? "away"
                : "";
            return (
              <li
                key={event.id}
                className={`flex items-center justify-between gap-3 py-3 border-b border-sm-border/60 last:border-0 ${
                  isNext ? "border-l-2 border-l-sm-gold pl-3 -ml-3" : ""
                }`}
                aria-label={`${event.sport}${event.level ? ` ${event.level}` : ""} vs ${event.opponent || "TBD"}${venueWord ? `, ${venueWord} game` : ""} on ${date} at ${time}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-bold text-sm-text">
                      {event.sport}
                    </span>
                    {event.level && (
                      <span className="text-[9px] font-semibold tracking-[0.1em] text-sm-text-muted uppercase">
                        {event.level}
                      </span>
                    )}
                    {event.location !== "unknown" && (
                      <span
                        className={`inline-flex items-center gap-0.5 text-[9px] font-bold tracking-[0.15em] ${
                          event.location === "home"
                            ? "text-sm-navy"
                            : "text-sm-gold"
                        }`}
                      >
                        {event.location === "home" ? (
                          <Home className="h-2.5 w-2.5" aria-hidden="true" />
                        ) : (
                          <Plane className="h-2.5 w-2.5" aria-hidden="true" />
                        )}
                        {event.location.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-sm-text-muted tracking-wide truncate">
                    vs {event.opponent || "—"}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-xs font-bold text-sm-text tabular tracking-wide">
                    {date}
                  </p>
                  {time && (
                    <p className="text-[10px] text-sm-text-muted tabular mt-0.5">
                      {time}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </WidgetShell>
  );
}
