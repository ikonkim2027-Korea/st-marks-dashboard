"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudSnow, Sun, CloudSun } from "lucide-react";
import { WidgetShell } from "./widget-shell";
import { useTemperatureUnit, convertTemp, type TempUnit } from "@/lib/temperature";
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

function getWeatherIcon(icon: string) {
  // Dashboard-cell variant: icons tinted against a white card, not the hero.
  const cls = "h-5 w-5";
  if (icon.includes("01")) return <Sun className={cn(cls, "text-sm-gold")} />;
  if (icon.includes("02")) return <CloudSun className={cn(cls, "text-sm-gold")} />;
  if (icon.includes("03") || icon.includes("04"))
    return <Cloud className={cn(cls, "text-sm-text-muted")} />;
  if (icon.includes("09") || icon.includes("10"))
    return <CloudRain className={cn(cls, "text-sm-navy")} />;
  if (icon.includes("13"))
    return <CloudSnow className={cn(cls, "text-sm-navy")} />;
  return <Cloud className={cn(cls, "text-sm-text-muted")} />;
}

// Two tiny pill buttons rendered in the WidgetShell header.
// stopPropagation on mousedown so a click on the toggle never starts a drag.
function UnitToggle({
  unit,
  onChange,
}: {
  unit: TempUnit;
  onChange: (next: TempUnit) => void;
}) {
  const base =
    "inline-flex h-[20px] min-w-[24px] items-center justify-center rounded-full border px-1.5 text-[10px] font-semibold leading-none transition-colors";
  const active = "border-sm-navy bg-sm-navy text-white";
  const inactive =
    "border-sm-border bg-white text-sm-text-muted hover:border-sm-navy/40 hover:text-sm-navy";

  return (
    <div
      className="inline-flex items-center gap-1"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        aria-pressed={unit === "C"}
        onClick={() => onChange("C")}
        className={cn(base, unit === "C" ? active : inactive)}
      >
        °C
      </button>
      <button
        type="button"
        aria-pressed={unit === "F"}
        onClick={() => onChange("F")}
        className={cn(base, unit === "F" ? active : inactive)}
      >
        °F
      </button>
    </div>
  );
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [error, setError] = useState(false);
  const [unit, setUnit] = useTemperatureUnit();

  useEffect(() => {
    let cancelled = false;
    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error("Failed");
        const data = (await res.json()) as WeatherState;
        if (!cancelled) setWeather(data);
      } catch {
        if (!cancelled) setError(true);
      }
    }
    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, []);

  // API returns °F; convert only at render time.
  const toUnit = (valueF: number) =>
    unit === "F" ? valueF : convertTemp(valueF, "F", "C");

  return (
    <WidgetShell
      title="Weather"
      eyebrow="SOUTHBOROUGH"
      accent="navy"
      headerExtra={<UnitToggle unit={unit} onChange={setUnit} />}
    >
      {error ? (
        <p className="mt-2 text-[12px] text-sm-text-muted">Unable to load weather</p>
      ) : !weather ? (
        <div className="mt-2 space-y-3">
          <div className="h-16 w-28 animate-pulse rounded bg-sm-navy/5" />
          <div className="h-3 w-40 animate-pulse rounded bg-sm-navy/5" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-8 animate-pulse rounded bg-sm-navy/5" />
            <div className="h-8 animate-pulse rounded bg-sm-navy/5" />
            <div className="h-8 animate-pulse rounded bg-sm-navy/5" />
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between pt-1">
          {/* Top: icon + description */}
          <div className="flex items-start justify-between">
            <p className="text-[11px] capitalize text-sm-text-muted tracking-wide">
              {weather.description}
            </p>
            {getWeatherIcon(weather.icon)}
          </div>

          {/* Middle: big temperature */}
          <div>
            <div className="flex items-end gap-1 leading-none">
              <p className="display-number text-[64px] leading-none text-sm-navy">
                {Math.round(toUnit(weather.temp))}
              </p>
              <p className="display-number text-[22px] text-sm-text-muted mb-1.5">
                °{unit}
              </p>
            </div>
          </div>

          {/* Bottom: stats */}
          <div className="space-y-2">
            <div className="divider-gold" />
            <div className="grid grid-cols-4 gap-2">
              <div>
                <p className="label-micro mb-0.5">Feels</p>
                <p className="text-[11px] font-bold text-sm-navy tabular">
                  {Math.round(toUnit(weather.feelsLike))}°
                </p>
              </div>
              <div>
                <p className="label-micro mb-0.5">Humidity</p>
                <p className="text-[11px] font-bold text-sm-navy tabular">
                  {Math.round(weather.humidity)}
                  <span className="text-[9px] font-normal text-sm-text-muted ml-0.5">
                    %
                  </span>
                </p>
              </div>
              <div>
                <p className="label-micro mb-0.5">Wind</p>
                <p className="text-[11px] font-bold text-sm-navy tabular">
                  {Math.round(weather.windSpeed)}
                  <span className="text-[9px] font-normal text-sm-text-muted ml-0.5">
                    mph
                  </span>
                </p>
              </div>
              <div>
                <p className="label-micro mb-0.5">H / L</p>
                <p className="text-[11px] font-bold text-sm-navy tabular">
                  {Math.round(toUnit(weather.high))}°
                  <span className="text-sm-text-muted font-normal">
                    /{Math.round(toUnit(weather.low))}°
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </WidgetShell>
  );
}
