"use client";

import { useState } from "react";
import { Trophy, Minus, Home, Plane } from "lucide-react";
import type { AthleticsEvent } from "@/types";
import { WidgetShell } from "./widget-shell";

function getMockEvents(): AthleticsEvent[] {
  return [
    {
      id: "1",
      sport: "Baseball",
      opponent: "Groton School",
      date: "Apr 12",
      time: "3:30 PM",
      location: "home",
      venue: "Lion Field",
    },
    {
      id: "2",
      sport: "Tennis",
      opponent: "Middlesex School",
      date: "Apr 11",
      time: "4:00 PM",
      location: "away",
    },
    {
      id: "3",
      sport: "Golf",
      opponent: "Nobles & Greenough",
      date: "Apr 10",
      time: "2:30 PM",
      location: "away",
      venue: "Whitinsville Golf Club",
    },
    {
      id: "4",
      sport: "Softball",
      opponent: "Brooks School",
      date: "Apr 14",
      time: "4:00 PM",
      location: "home",
    },
    {
      id: "5",
      sport: "Lacrosse",
      opponent: "St. Paul's School",
      date: "Apr 15",
      time: "3:00 PM",
      location: "away",
      result: { smScore: 8, opponentScore: 5, won: true },
    },
  ];
}

export function AthleticsWidget() {
  const [events] = useState<AthleticsEvent[]>(() => getMockEvents());

  return (
    <WidgetShell
      title="Athletics"
      eyebrow="ISL"
      accent="navy"
      href="https://www.stmarksschool.org/athletics/schedule"
      hrefLabel="Full Schedule"
      scrollable={false}
    >
      {events.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <Trophy className="h-7 w-7 text-sm-text-muted/60 mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold text-sm-text">No games scheduled</p>
          <p className="text-[11px] text-sm-text-muted mt-1">Check back for the next ISL matchup.</p>
        </div>
      ) : (
        <ul className="space-y-0 flex-1" aria-label="Upcoming athletics events">
          {events.map((event, idx) => {
            const isNext = idx === 0 && !event.result;
            return (
              <li
                key={event.id}
                className={`flex items-center justify-between py-3 border-b border-sm-border/60 last:border-0 ${
                  isNext ? "border-l-2 border-l-sm-gold pl-3 -ml-3" : ""
                }`}
                aria-label={
                  event.result
                    ? `${event.sport} vs ${event.opponent}, ${event.result.won ? "won" : "lost"} ${event.result.smScore} to ${event.result.opponentScore}`
                    : `${event.sport} vs ${event.opponent}, ${event.location === "home" ? "home" : "away"} game on ${event.date} at ${event.time}`
                }
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-bold text-sm-text">
                      {event.sport}
                    </span>
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
                      {event.location === "home" ? "HOME" : "AWAY"}
                    </span>
                  </div>
                  <p className="text-[11px] text-sm-text-muted tracking-wide truncate">
                    vs {event.opponent}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  {event.result ? (
                    <div className="flex items-center justify-end gap-1.5">
                      {event.result.won ? (
                        <Trophy
                          className="h-4 w-4 text-sm-success"
                          aria-hidden="true"
                        />
                      ) : (
                        <Minus
                          className="h-4 w-4 text-sm-danger"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={`display-number text-lg tabular-nums ${
                          event.result.won ? "text-sm-success" : "text-sm-danger"
                        }`}
                      >
                        {event.result.won ? "W" : "L"} {event.result.smScore}–
                        {event.result.opponentScore}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-sm-text tabular tracking-wide">
                        {event.date.toUpperCase()}
                      </p>
                      <p className="text-[10px] text-sm-text-muted tabular mt-0.5">
                        {event.time}
                      </p>
                    </div>
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
