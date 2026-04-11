"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { CalendarEvent } from "@/types";

function getMockEvents(): CalendarEvent[] {
  return [
    {
      id: "1",
      title: "III & IV Form Saturday Program",
      date: "Apr 12",
      time: "9:00 AM",
      category: "academic",
    },
    {
      id: "2",
      title: "Instrumental Music Concert",
      date: "Apr 14",
      time: "1:00 PM",
      location: "PFAC",
      category: "arts",
    },
    {
      id: "3",
      title: "Spirit Week",
      date: "Apr 14–18",
      category: "community",
    },
    {
      id: "4",
      title: "Groton Day",
      date: "Apr 19",
      category: "athletics",
    },
    {
      id: "5",
      title: "Seated Meal & Evening Chapel",
      date: "Apr 22",
      time: "6:00 PM",
      location: "Dining Hall",
      category: "community",
    },
    {
      id: "6",
      title: "Spring Break Begins",
      date: "May 3",
      category: "break",
    },
  ];
}

function parseDatePart(dateStr: string): { day: string; month: string } {
  const [month, day] = dateStr.split(" ");
  const dayNum = day?.split("–")[0] || "";
  return { day: dayNum, month: month?.toUpperCase() || "" };
}

export default function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    setEvents(getMockEvents());
  }, []);

  return (
    <div className="widget-card p-6 h-full flex flex-col" id="calendar">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="divider-gold" />
          <span className="label-micro">Upcoming Events</span>
        </div>
        <a
          href="https://www.stmarksschool.org/about/calendar"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-sm-navy hover:text-sm-navy-light transition-colors"
        >
          Full Calendar
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      <div className="space-y-0 flex-1">
        {events.map((event, idx) => {
          const { day, month } = parseDatePart(event.date);
          const isFirst = idx === 0;
          return (
            <div
              key={event.id}
              className={`flex items-center gap-4 py-3 border-b border-sm-border/60 last:border-0 ${
                isFirst ? "border-l-2 border-l-sm-gold pl-3 -ml-3" : ""
              }`}
            >
              {/* Date column */}
              <div className="flex-shrink-0 w-12 text-center">
                <p className="display-number text-2xl text-sm-navy">{day}</p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-sm-text-muted mt-0.5">
                  {month}
                </p>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 border-l border-sm-border pl-4">
                <h4 className="text-xs font-bold text-sm-text leading-snug">
                  {event.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-sm-text-muted">
                  <span className="uppercase tracking-wider">
                    {event.category}
                  </span>
                  {event.time && (
                    <>
                      <span className="text-sm-border">·</span>
                      <span className="tabular">{event.time}</span>
                    </>
                  )}
                  {event.location && (
                    <>
                      <span className="text-sm-border">·</span>
                      <span className="truncate">{event.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
