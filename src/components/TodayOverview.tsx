"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getDayType(date: Date): { label: string; color: string } {
  const day = date.getDay();
  if (day === 0 || day === 6) {
    return { label: "Weekend", color: "bg-sm-gold/20 text-sm-gold" };
  }
  return { label: "School Day", color: "bg-sm-success/20 text-sm-success" };
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
      <div className="hero-gradient rounded-xl p-5 text-white h-full">
        <div className="h-20 animate-pulse rounded-lg bg-white/10" />
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
    <div className="hero-gradient rounded-xl p-5 text-white h-full flex flex-col justify-between">
      <div>
        <p className="text-xs font-medium text-white/50 uppercase tracking-widest mb-1">
          {getGreeting(now.getHours())}, Lions
        </p>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          St. Mark&apos;s School
        </h2>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {dateStr}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {timeStr}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${dayType.color}`}
          >
            {dayType.label}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] text-white/60">
            <MapPin className="h-3 w-3" />
            Southborough, MA
          </span>
        </div>
      </div>
    </div>
  );
}
