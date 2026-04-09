"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Sun } from "lucide-react";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getDayType(date: Date): { label: string; color: string } {
  const day = date.getDay();
  if (day === 0 || day === 6) {
    return { label: "Weekend", color: "bg-gold/20 text-gold" };
  }
  return { label: "School Day", color: "bg-success/20 text-success" };
}

export default function TodayOverview() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!now) {
    return (
      <div className="hero-gradient rounded-2xl p-8 text-white">
        <div className="h-24 animate-pulse rounded-lg bg-white/10" />
      </div>
    );
  }

  const dayType = getDayType(now);
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="hero-gradient rounded-2xl p-5 sm:p-6 text-white h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white/60 mb-1">
            {getGreeting(now.getHours())}, Lions
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            St. Mark&apos;s School
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {dateStr}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {timeStr}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${dayType.color}`}
          >
            {dayType.label}
          </span>
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs">
            <Sun className="h-3.5 w-3.5 text-gold" />
            <span>Southborough, MA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
