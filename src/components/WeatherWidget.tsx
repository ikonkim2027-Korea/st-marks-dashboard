"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudSun,
} from "lucide-react";

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
  const cls = "h-7 w-7";
  if (icon.includes("01")) return <Sun className={`${cls} text-sm-gold`} />;
  if (icon.includes("02")) return <CloudSun className={`${cls} text-sm-gold`} />;
  if (icon.includes("03") || icon.includes("04"))
    return <Cloud className={`${cls} text-sm-text-muted`} />;
  if (icon.includes("09") || icon.includes("10"))
    return <CloudRain className={`${cls} text-sm-navy`} />;
  if (icon.includes("13"))
    return <CloudSnow className={`${cls} text-sm-navy-light`} />;
  return <Cloud className={`${cls} text-sm-text-muted`} />;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setWeather(data);
      } catch {
        setError(true);
      }
    }
    fetchWeather();
  }, []);

  if (error) {
    return (
      <div className="widget-card p-6 h-full">
        <div className="flex items-center gap-2 mb-4">
          <span className="divider-gold" />
          <span className="label-micro">Weather</span>
        </div>
        <p className="text-xs text-sm-text-muted">Unable to load</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="widget-card p-6 h-full">
        <div className="flex items-center gap-2 mb-4">
          <span className="divider-gold" />
          <span className="label-micro">Weather</span>
        </div>
        <div className="h-20 animate-pulse rounded bg-sm-cream" />
      </div>
    );
  }

  return (
    <div className="widget-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="divider-gold" />
          <span className="label-micro">Southborough</span>
        </div>
        {getWeatherIcon(weather.icon)}
      </div>

      <div className="flex items-end gap-1 mb-1">
        <p className="display-number text-[64px] text-sm-navy">
          {Math.round(weather.temp)}
        </p>
        <p className="display-number text-[32px] text-sm-navy/60 mb-2">°F</p>
      </div>

      <p className="text-xs capitalize text-sm-text-muted mb-4">
        {weather.description}
      </p>

      <div className="mt-auto grid grid-cols-3 gap-2 border-t border-sm-border/60 pt-3">
        <div>
          <p className="label-micro mb-1">Feels</p>
          <p className="text-xs font-bold text-sm-text tabular">
            {Math.round(weather.feelsLike)}°
          </p>
        </div>
        <div>
          <p className="label-micro mb-1">Wind</p>
          <p className="text-xs font-bold text-sm-text tabular">
            {Math.round(weather.windSpeed)}
            <span className="text-[9px] font-normal text-sm-text-muted ml-0.5">
              mph
            </span>
          </p>
        </div>
        <div>
          <p className="label-micro mb-1">H / L</p>
          <p className="text-xs font-bold text-sm-text tabular">
            {Math.round(weather.high)}°
            <span className="text-sm-text-muted font-normal">
              /{Math.round(weather.low)}°
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
