"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Home,
  Plane,
  Trophy,
} from "lucide-react";
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

type SportIconSpec = {
  type: SportGlyphType;
  className: string;
  bgClassName: string;
};

type SportGlyphType =
  | "baseball"
  | "basketball"
  | "crew"
  | "cycling"
  | "field-hockey"
  | "football"
  | "golf"
  | "lacrosse"
  | "running"
  | "skiing"
  | "soccer"
  | "softball"
  | "squash"
  | "swimming"
  | "tennis"
  | "volleyball"
  | "wrestling"
  | "generic";

function getSportIcon(sport: string): SportIconSpec {
  const normalized = sport.toLowerCase();
  if (normalized.includes("golf")) {
    return {
      type: "golf",
      className: "text-sm-success",
      bgClassName: "bg-sm-success/10 border-sm-success/20",
    };
  }
  if (normalized.includes("baseball")) {
    return {
      type: "baseball",
      className: "text-sm-orange",
      bgClassName: "bg-sm-orange/10 border-sm-orange/20",
    };
  }
  if (normalized.includes("softball")) {
    return {
      type: "softball",
      className: "text-sm-gold",
      bgClassName: "bg-sm-gold/12 border-sm-gold/25",
    };
  }
  if (normalized.includes("tennis") || normalized.includes("squash")) {
    return {
      type: normalized.includes("squash") ? "squash" : "tennis",
      className: "text-sm-gold",
      bgClassName: "bg-sm-gold/12 border-sm-gold/25",
    };
  }
  if (normalized.includes("soccer")) {
    return {
      type: "soccer",
      className: "text-sm-navy",
      bgClassName: "bg-sm-navy/8 border-sm-navy/15",
    };
  }
  if (normalized.includes("basketball")) {
    return {
      type: "basketball",
      className: "text-sm-orange",
      bgClassName: "bg-sm-orange/10 border-sm-orange/20",
    };
  }
  if (normalized.includes("volleyball")) {
    return {
      type: "volleyball",
      className: "text-sm-navy-light",
      bgClassName: "bg-sm-navy/8 border-sm-navy/15",
    };
  }
  if (normalized.includes("football")) {
    return {
      type: "football",
      className: "text-sm-navy",
      bgClassName: "bg-sm-navy/8 border-sm-navy/15",
    };
  }
  if (normalized.includes("hockey")) {
    return {
      type: "field-hockey",
      className: "text-sm-navy",
      bgClassName: "bg-sm-navy/8 border-sm-navy/15",
    };
  }
  if (normalized.includes("lacrosse")) {
    return {
      type: "lacrosse",
      className: "text-sm-navy",
      bgClassName: "bg-sm-navy/8 border-sm-navy/15",
    };
  }
  if (normalized.includes("cross country") || normalized.includes("track")) {
    return {
      type: "running",
      className: "text-sm-success",
      bgClassName: "bg-sm-success/10 border-sm-success/20",
    };
  }
  if (normalized.includes("crew")) {
    return {
      type: "crew",
      className: "text-sm-navy-light",
      bgClassName: "bg-sm-navy/8 border-sm-navy/15",
    };
  }
  if (normalized.includes("swim")) {
    return {
      type: "swimming",
      className: "text-sm-navy-light",
      bgClassName: "bg-sm-navy/8 border-sm-navy/15",
    };
  }
  if (normalized.includes("ski")) {
    return {
      type: "skiing",
      className: "text-sm-gold",
      bgClassName: "bg-sm-gold/12 border-sm-gold/25",
    };
  }
  if (normalized.includes("cycling")) {
    return {
      type: "cycling",
      className: "text-sm-success",
      bgClassName: "bg-sm-success/10 border-sm-success/20",
    };
  }
  if (normalized.includes("wrestling")) {
    return {
      type: "wrestling",
      className: "text-sm-orange",
      bgClassName: "bg-sm-orange/10 border-sm-orange/20",
    };
  }
  return {
    type: "generic",
    className: "text-sm-text-muted",
    bgClassName: "bg-sm-cream border-sm-border",
  };
}

function SportGlyph({
  type,
  className,
}: {
  type: SportGlyphType;
  className: string;
}) {
  const glyphs: Record<SportGlyphType, string> = {
    baseball: "⚾",
    basketball: "🏀",
    crew: "🚣",
    cycling: "🚴",
    "field-hockey": "🏑",
    football: "🏈",
    generic: "🏆",
    golf: "⛳",
    lacrosse: "🥍",
    running: "👟",
    skiing: "⛷️",
    soccer: "⚽",
    softball: "🥎",
    squash: "🎾",
    swimming: "🏊",
    tennis: "🎾",
    volleyball: "🏐",
    wrestling: "🤼",
  };

  return (
    <span
      aria-hidden="true"
      className={`block text-[17px] leading-none ${className}`}
    >
      {glyphs[type]}
    </span>
  );
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
            const icon = getSportIcon(event.sport);
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
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-[8px] border ${icon.bgClassName}`}
                  aria-hidden="true"
                >
                  <SportGlyph type={icon.type} className={icon.className} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex min-w-0 items-baseline gap-2">
                    <span className="text-sm font-bold text-sm-text">
                      {event.sport}
                    </span>
                    {event.level && (
                      <span className="truncate text-[9px] font-semibold uppercase tracking-[0.1em] text-sm-text-muted">
                        {event.level}
                      </span>
                    )}
                  </div>
                  <div className="flex min-w-0 items-center gap-1.5">
                    {event.location !== "unknown" ? (
                      <span
                        className={`inline-flex shrink-0 items-center gap-0.5 text-[8px] font-bold tracking-[0.12em] ${
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
                    ) : null}
                    <p className="min-w-0 truncate text-[11px] tracking-wide text-sm-text-muted">
                      vs {event.opponent || "—"}
                    </p>
                  </div>
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
