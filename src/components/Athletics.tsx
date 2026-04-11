"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { AthleticsEvent } from "@/types";

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

export default function Athletics() {
  const [events, setEvents] = useState<AthleticsEvent[]>([]);

  useEffect(() => {
    setEvents(getMockEvents());
  }, []);

  return (
    <div className="widget-card p-6 h-full flex flex-col" id="athletics">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="divider-gold" />
          <span className="label-micro">Athletics — ISL</span>
        </div>
        <a
          href="https://www.stmarksschool.org/athletics/schedule"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-sm-navy hover:text-sm-navy-light transition-colors"
        >
          Full Schedule
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      <div className="space-y-0 flex-1">
        {events.map((event, idx) => {
          const isNext = idx === 0 && !event.result;
          return (
            <div
              key={event.id}
              className={`flex items-center justify-between py-3 border-b border-sm-border/60 last:border-0 ${
                isNext ? "border-l-2 border-l-sm-gold pl-3 -ml-3" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold text-sm-text">
                    {event.sport}
                  </span>
                  <span
                    className={`text-[9px] font-bold tracking-[0.15em] ${
                      event.location === "home"
                        ? "text-sm-navy"
                        : "text-sm-gold"
                    }`}
                  >
                    {event.location === "home" ? "HOME" : "AWAY"}
                  </span>
                </div>
                <p className="text-[11px] text-sm-text-muted tracking-wide">
                  vs {event.opponent}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                {event.result ? (
                  <div>
                    <span
                      className={`display-number text-lg ${
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
