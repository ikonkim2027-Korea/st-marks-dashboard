"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
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
  const cls = "h-9 w-9";
  if (icon.includes("01")) return <Sun className={`${cls} text-sm-gold`} />;
  if (icon.includes("02")) return <CloudSun className={`${cls} text-sm-gold`} />;
  if (icon.includes("03") || icon.includes("04"))
    return <Cloud className={`${cls} text-sm-text-muted`} />;
  if (icon.includes("09") || icon.includes("10"))
    return <CloudRain className={`${cls} text-blue-400`} />;
  if (icon.includes("13"))
    return <CloudSnow className={`${cls} text-blue-300`} />;
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
      <div className="widget-card p-4 h-full">
        <h3 className="text-xs font-semibold text-sm-text-light uppercase tracking-wider mb-3">Weather</h3>
        <p className="text-xs text-sm-text-muted">Unable to load weather data</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="widget-card p-4 h-full">
        <h3 className="text-xs font-semibold text-sm-text-light uppercase tracking-wider mb-3">Weather</h3>
        <div className="h-16 animate-pulse rounded-lg bg-sm-offwhite" />
      </div>
    );
  }

  return (
    <div className="widget-card p-4 h-full flex flex-col">
      <h3 className="text-xs font-semibold text-sm-text-light uppercase tracking-wider mb-3">
        Southborough Weather
      </h3>
      <div className="flex items-center justify-between flex-1">
        <div className="flex items-center gap-3">
          {getWeatherIcon(weather.icon)}
          <div>
            <p className="text-2xl font-bold text-sm-text">
              {Math.round(weather.temp)}°F
            </p>
            <p className="text-xs capitalize text-sm-text-muted">
              {weather.description}
            </p>
          </div>
        </div>
        <div className="text-right text-[11px] text-sm-text-muted space-y-1">
          <p className="flex items-center justify-end gap-1">
            <Thermometer className="h-3 w-3" />
            Feels {Math.round(weather.feelsLike)}°F
          </p>
          <p className="flex items-center justify-end gap-1">
            <Wind className="h-3 w-3" />
            {Math.round(weather.windSpeed)} mph
          </p>
          <p className="flex items-center justify-end gap-1">
            <Droplets className="h-3 w-3" />
            {weather.humidity}%
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-sm-border pt-2 text-[11px] text-sm-text-muted">
        <span>H: {Math.round(weather.high)}°F</span>
        <span>L: {Math.round(weather.low)}°F</span>
      </div>
    </div>
  );
}
