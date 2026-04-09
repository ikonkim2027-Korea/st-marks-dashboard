"use client";

import { useEffect, useState } from "react";
import { Trophy, MapPin, Calendar, ArrowRight } from "lucide-react";
import type { AthleticsEvent } from "@/types";

// Mock data — will be replaced with stmarksschool.org scraping
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
    <div className="widget-card p-5" id="athletics">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-sm-gold" />
          <h3 className="text-xs font-semibold text-sm-text-light uppercase tracking-wider">
            Athletics — ISL
          </h3>
        </div>
        <a
          href="https://www.stmarksschool.org/athletics/schedule"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-sm-navy hover:text-sm-navy-light transition-colors"
        >
          Full Schedule <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between rounded-lg bg-sm-cream/50 px-3 py-2.5"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-sm-text truncate">
                  {event.sport}
                </span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    event.location === "home"
                      ? "bg-sm-navy/10 text-sm-navy"
                      : "bg-sm-gold/20 text-sm-gold"
                  }`}
                >
                  {event.location === "home" ? "HOME" : "AWAY"}
                </span>
              </div>
              <p className="text-xs text-sm-text-muted mt-0.5">
                vs {event.opponent}
              </p>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              {event.result ? (
                <span
                  className={`text-sm font-bold ${
                    event.result.won ? "text-sm-success" : "text-sm-danger"
                  }`}
                >
                  {event.result.won ? "W" : "L"} {event.result.smScore}-
                  {event.result.opponentScore}
                </span>
              ) : (
                <>
                  <p className="text-xs font-medium text-sm-text flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </p>
                  <p className="text-[11px] text-sm-text-muted flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.time}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
