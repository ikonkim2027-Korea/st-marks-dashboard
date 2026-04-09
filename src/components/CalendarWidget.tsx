"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
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
      date: "Apr 14 – Apr 18",
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
      location: "Dining Hall / Chapel",
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

const categoryStyles: Record<string, { dot: string; bg: string }> = {
  academic: { dot: "bg-sm-navy", bg: "bg-sm-navy/5" },
  athletics: { dot: "bg-sm-gold", bg: "bg-sm-gold/10" },
  arts: { dot: "bg-purple-500", bg: "bg-purple-50" },
  community: { dot: "bg-sm-success", bg: "bg-sm-success/10" },
  break: { dot: "bg-sm-orange", bg: "bg-sm-orange/10" },
};

export default function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    setEvents(getMockEvents());
  }, []);

  return (
    <div className="widget-card p-5" id="calendar">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-sm-gold" />
          <h3 className="text-xs font-semibold text-sm-text-light uppercase tracking-wider">
            Upcoming Events
          </h3>
        </div>
        <a
          href="https://www.stmarksschool.org/about/calendar"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-sm-navy hover:text-sm-navy-light transition-colors"
        >
          Full Calendar <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      <div className="space-y-2">
        {events.map((event) => {
          const style = categoryStyles[event.category] ?? categoryStyles.academic;
          return (
            <div
              key={event.id}
              className={`flex items-start gap-3 rounded-lg px-3 py-2.5 ${style.bg}`}
            >
              <div
                className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${style.dot}`}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-sm-text">
                  {event.title}
                </h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                  <span className="text-xs text-sm-text-muted flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </span>
                  {event.time && (
                    <span className="text-xs text-sm-text-muted flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </span>
                  )}
                  {event.location && (
                    <span className="text-xs text-sm-text-muted flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
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
