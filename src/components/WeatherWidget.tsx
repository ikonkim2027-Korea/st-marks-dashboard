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
  const cls = "h-10 w-10";
  if (icon.includes("01")) return <Sun className={`${cls} text-gold`} />;
  if (icon.includes("02")) return <CloudSun className={`${cls} text-gold`} />;
  if (icon.includes("03") || icon.includes("04"))
    return <Cloud className={`${cls} text-text-muted`} />;
  if (icon.includes("09") || icon.includes("10"))
    return <CloudRain className={`${cls} text-blue-400`} />;
  if (icon.includes("13"))
    return <CloudSnow className={`${cls} text-blue-300`} />;
  return <Cloud className={`${cls} text-text-muted`} />;
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
      <div className="widget-card p-5">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">Weather</h3>
        <p className="text-xs text-text-muted">Unable to load weather data</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="widget-card p-5">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">Weather</h3>
        <div className="h-20 animate-pulse rounded-lg bg-cream" />
      </div>
    );
  }

  return (
    <div className="widget-card p-5 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-text-secondary mb-4">
        Southborough Weather
      </h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getWeatherIcon(weather.icon)}
          <div>
            <p className="text-3xl font-bold text-text-primary">
              {Math.round(weather.temp)}°F
            </p>
            <p className="text-sm capitalize text-text-muted">
              {weather.description}
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-text-muted space-y-1.5">
          <p className="flex items-center justify-end gap-1">
            <Thermometer className="h-3.5 w-3.5" />
            Feels {Math.round(weather.feelsLike)}°F
          </p>
          <p className="flex items-center justify-end gap-1">
            <Wind className="h-3.5 w-3.5" />
            {Math.round(weather.windSpeed)} mph
          </p>
          <p className="flex items-center justify-end gap-1">
            <Droplets className="h-3.5 w-3.5" />
            {weather.humidity}%
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-text-muted">
        <span>H: {Math.round(weather.high)}°F</span>
        <span>L: {Math.round(weather.low)}°F</span>
      </div>
    </div>
  );
}
