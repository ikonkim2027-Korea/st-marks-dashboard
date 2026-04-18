"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";

// useSyncExternalStore-based clock: no setState-in-effect, still SSR-safe.
function subscribeMinute(onChange: () => void) {
  const interval = setInterval(onChange, 60_000);
  return () => clearInterval(interval);
}
function getNowMs() {
  return Math.floor(Date.now() / 60_000) * 60_000;
}
function getServerNowMs() {
  // Server render: return a stable value so hydration matches. The first
  // client tick will update it to the real current time.
  return 0;
}

function getGreeting(hour: number): string {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
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

/**
 * Campus-photo + weekday headline hero, full-width above the widget grid.
 *
 * The weather strip that used to live on the right side is intentionally
 * dropped — weather is now its own grid cell (WeatherWidget), so the banner
 * becomes a pure greeting/date/campus shot.
 */
export function HeroBanner() {
  const nowMs = useSyncExternalStore(subscribeMinute, getNowMs, getServerNowMs);
  const now = nowMs > 0 ? new Date(nowMs) : null;

  if (!now) {
    return (
      <section className="mx-auto w-full max-w-full px-6 pt-5 xl:px-10">
        <div className="relative h-[220px] overflow-hidden rounded-[10px] bg-sm-navy">
          <div className="absolute inset-0 animate-pulse bg-white/5" />
        </div>
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
  const greeting = getGreeting(now.getHours());

  return (
    <section className="mx-auto w-full max-w-full px-6 pt-5 xl:px-10">
      <div className="relative h-[220px] overflow-hidden rounded-[10px] border border-sm-navy/10">
        <Image
          src="/photos/campus-aerial-dusk.jpg"
          alt="St. Mark's School campus"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sm-navy-dark/85 via-sm-navy/55 to-sm-navy/25" />

        {/* Gold top accent line — matches CI */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-sm-gold" />

        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
          <span className="label-micro text-white/70">
            {greeting}, Lions
          </span>
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
    </section>
  );
}
