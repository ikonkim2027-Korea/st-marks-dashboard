"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function getDayType(date: Date): string {
  const day = date.getDay();
  if (day === 0 || day === 6) return "Weekend";
  return "School Day";
}

const weekdayFull: Record<number, string> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

export default function TodayOverview() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!now) {
    return (
      <section className="relative h-[220px] overflow-hidden rounded-[10px] bg-sm-navy">
        <div className="absolute inset-0 animate-pulse bg-white/5" />
      </section>
    );
  }

  const weekday = weekdayFull[now.getDay()];
  const monthDay = now
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
  const time = now
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
    .toUpperCase();
  const dayType = getDayType(now);
  const greeting = getGreeting(now.getHours());

  return (
    <section className="relative grid grid-cols-12 h-[220px] overflow-hidden rounded-[10px] border border-sm-navy/10">
      {/* Left — Photo with large day display */}
      <div className="relative col-span-12 md:col-span-8">
        <Image
          src="/photos/campus-aerial-dusk.jpg"
          alt="St. Mark's School campus"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 66vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sm-navy-dark/85 via-sm-navy/60 to-sm-navy/30" />

        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-sm-gold" />

        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
          <span className="label-micro text-white/70">{greeting}, Lions</span>
          <div>
            <h1 className="text-[72px] md:text-[88px] font-black text-white leading-[0.82] tracking-[-0.035em]">
              {weekday}
            </h1>
            <p className="mt-2 text-[11px] font-medium text-white/75 tracking-[0.2em] tabular">
              {monthDay}
              <span className="mx-3 text-white/40">·</span>
              {time}
            </p>
          </div>
        </div>
      </div>

      {/* Right — Navy block with school info */}
      <div className="relative col-span-12 md:col-span-4 bg-sm-navy p-6 flex flex-col justify-between">
        <div>
          <span className="label-micro text-sm-gold/90">
            St. Mark&apos;s School
          </span>
          <p className="mt-2 text-[11px] text-white/55 leading-relaxed tracking-wide">
            Southborough, Massachusetts
            <br />
            Founded 1865 · Episcopal
          </p>
        </div>

        <div className="space-y-3">
          <div className="divider-gold" />
          <div className="flex items-baseline justify-between">
            <span className="label-micro text-white/60">Today</span>
            <span className="text-[11px] font-bold tracking-[0.15em] text-white uppercase">
              {dayType}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="label-micro text-white/60">Motto</span>
            <span className="text-[11px] font-medium italic text-white/85">
              Age Quod Agis
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
