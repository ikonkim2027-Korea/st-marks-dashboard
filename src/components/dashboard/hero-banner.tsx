"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudSun,
  Wind,
  Droplets,
  Leaf,
} from "lucide-react";
import { useTemperatureUnit, convertTemp } from "@/lib/temperature";
import { cn } from "@/lib/utils";

interface WeatherState {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  high: number;
  low: number;
}

interface AqiState {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  updated: string;
}

function subscribeMinute(onChange: () => void) {
  const interval = setInterval(onChange, 60_000);
  return () => clearInterval(interval);
}
function getNowMs() {
  return Math.floor(Date.now() / 60_000) * 60_000;
}
function getServerNowMs() {
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

function weatherIcon(icon: string, cls = "h-5 w-5") {
  if (icon.includes("01")) return <Sun className={cn(cls, "text-sm-gold")} />;
  if (icon.includes("02"))
    return <CloudSun className={cn(cls, "text-sm-gold")} />;
  if (icon.includes("03") || icon.includes("04"))
    return <Cloud className={cn(cls, "text-white/80")} />;
  if (icon.includes("09") || icon.includes("10"))
    return <CloudRain className={cn(cls, "text-white/85")} />;
  if (icon.includes("13"))
    return <CloudSnow className={cn(cls, "text-white/85")} />;
  return <Cloud className={cn(cls, "text-white/80")} />;
}

function aqiBand(aqi: number): { label: string; hex: string } {
  if (aqi <= 50) return { label: "Good", hex: "#7ea77b" };
  if (aqi <= 100) return { label: "Moderate", hex: "#e0b84a" };
  if (aqi <= 150) return { label: "USG", hex: "#e8994a" };
  if (aqi <= 200) return { label: "Unhealthy", hex: "#e87070" };
  if (aqi <= 300) return { label: "Very Unhealthy", hex: "#b467d4" };
  return { label: "Hazardous", hex: "#c95a7a" };
}

export function HeroBanner() {
  const nowMs = useSyncExternalStore(
    subscribeMinute,
    getNowMs,
    getServerNowMs,
  );
  const now = nowMs > 0 ? new Date(nowMs) : null;
  const [unit, setUnit] = useTemperatureUnit();
  const toggleUnit = () => setUnit(unit === "F" ? "C" : "F");
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [aqi, setAqi] = useState<AqiState | null>(null);
  const [aqiError, setAqiError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadWeather() {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error("weather_failed");
        const data = (await res.json()) as WeatherState;
        if (!cancelled) setWeather(data);
      } catch {
        if (!cancelled) setWeatherError(true);
      }
    }
    async function loadAqi() {
      try {
        const res = await fetch("/api/air-quality");
        if (!res.ok) throw new Error("aqi_failed");
        const data = await res.json();
        if (data && !data.error && !cancelled) setAqi(data as AqiState);
        else if (data?.error && !cancelled) setAqiError(true);
      } catch {
        if (!cancelled) setAqiError(true);
      }
    }
    loadWeather();
    loadAqi();
    return () => {
      cancelled = true;
    };
  }, []);

  const toUnit = (valueF: number) =>
    unit === "F" ? valueF : convertTemp(valueF, "F", "C");
  const aqBand = aqi ? aqiBand(aqi.aqi) : null;

  if (!now) {
    return (
      <section className="mx-auto w-full max-w-full px-4 pt-4 sm:px-6 sm:pt-5 xl:px-10">
        <div className="relative h-[200px] overflow-hidden rounded-[10px] bg-sm-navy sm:h-[220px]">
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
    <section className="mx-auto w-full max-w-full px-4 pt-4 sm:px-6 sm:pt-5 xl:px-10">
      <div className="relative h-[200px] overflow-hidden rounded-[10px] border border-sm-navy/10 sm:h-[220px]">
        <Image
          src="/photos/campus-aerial-dusk.jpg"
          alt="St. Mark's School campus"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sm-navy-dark/90 via-sm-navy/65 to-sm-navy-dark/80" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-sm-gold" />

        <div className="absolute inset-0 flex items-stretch gap-4 p-5 sm:p-6 md:p-8">
          {/* Left: weekday hero */}
          <div className="flex flex-1 flex-col justify-between min-w-0">
            <span className="label-micro text-white/70">
              {greeting}, Lions
            </span>
            <div>
              <h1 className="text-[48px] sm:text-[64px] md:text-[68px] lg:text-[88px] font-black text-white leading-[0.82] tracking-[-0.035em] break-words">
                {weekday}
              </h1>
              <p className="mt-2 text-[10px] sm:text-[11px] font-medium text-white/75 tracking-[0.18em] sm:tracking-[0.2em] tabular">
                {monthDay}
                <span className="mx-2 sm:mx-3 text-white/40">·</span>
                {time}
              </p>
              {/* Mobile-only compact weather + AQ strip */}
              <div className="mt-2 flex items-center gap-3 text-[11px] text-white/80 tabular md:hidden">
                {weather && !weatherError ? (
                  <span className="inline-flex items-center gap-1.5">
                    {weatherIcon(weather.icon, "h-3.5 w-3.5")}
                    <span className="font-semibold text-white">
                      {Math.round(toUnit(weather.temp))}°
                    </span>
                    <button
                      type="button"
                      onClick={toggleUnit}
                      aria-label={`Switch to °${unit === "F" ? "C" : "F"}`}
                      className="rounded px-1 text-[10px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      {unit}
                    </button>
                  </span>
                ) : null}
                {aqi && aqBand && !aqiError ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Leaf
                      className="h-3.5 w-3.5"
                      style={{ color: aqBand.hex }}
                    />
                    <span className="font-semibold text-white">
                      AQI {aqi.aqi}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: aqBand.hex }}
                    >
                      {aqBand.label}
                    </span>
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right: weather + AQ panel */}
          <aside className="hidden w-[280px] shrink-0 flex-col justify-between gap-2 md:flex">
            {/* Weather */}
            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              {weatherError ? (
                <p className="text-[11px] text-white/60">
                  Weather unavailable
                </p>
              ) : !weather ? (
                <div className="space-y-2">
                  <div className="h-8 w-20 animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1 leading-none">
                        <span className="display-number text-[36px] text-white">
                          {Math.round(toUnit(weather.temp))}
                        </span>
                        <button
                          type="button"
                          onClick={toggleUnit}
                          aria-label={`Switch to °${unit === "F" ? "C" : "F"}`}
                          title={`Switch to °${unit === "F" ? "C" : "F"}`}
                          className="rounded px-1 text-[13px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          °{unit}
                        </button>
                      </div>
                      <p className="mt-1 truncate text-[10px] capitalize tracking-wide text-white/70">
                        {weather.description}
                        <span className="mx-1.5 text-white/30">·</span>
                        <span className="tabular">
                          {Math.round(toUnit(weather.high))}° /{" "}
                          {Math.round(toUnit(weather.low))}°
                        </span>
                      </p>
                    </div>
                    <div className="flex-shrink-0 rounded-full bg-white/10 p-2">
                      {weatherIcon(weather.icon, "h-5 w-5")}
                    </div>
                  </div>
                  <div className="mt-2 flex gap-3 text-[10px] text-white/70 tabular">
                    <span className="inline-flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-sm-gold/80" />
                      {Math.round(weather.humidity)}%
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Wind className="h-3 w-3 text-sm-gold/80" />
                      {Math.round(weather.windSpeed)} mph
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="text-sm-gold/80">Feels</span>
                      {Math.round(toUnit(weather.feelsLike))}°
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Air Quality */}
            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              {aqiError ? (
                <p className="text-[11px] text-white/60">AQI unavailable</p>
              ) : !aqi || !aqBand ? (
                <div className="space-y-2">
                  <div className="h-6 w-20 animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1 leading-none">
                      <span className="display-number text-[28px] text-white">
                        {aqi.aqi}
                      </span>
                      <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50">
                        AQI · US EPA
                      </span>
                    </div>
                    <p
                      className="mt-1 text-[11px] font-semibold tracking-wide"
                      style={{ color: aqBand.hex }}
                    >
                      {aqBand.label}
                      <span className="ml-2 font-normal text-white/55 tabular">
                        PM2.5 {Math.round(aqi.pm25)} · O₃{" "}
                        {Math.round(aqi.o3)}
                      </span>
                    </p>
                  </div>
                  <Leaf
                    className="h-5 w-5 flex-shrink-0"
                    style={{ color: aqBand.hex }}
                  />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
