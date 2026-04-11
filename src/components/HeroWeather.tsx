"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudSnow, Sun, CloudSun } from "lucide-react";

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
  const cls = "h-6 w-6";
  if (icon.includes("01")) return <Sun className={`${cls} text-sm-gold`} />;
  if (icon.includes("02")) return <CloudSun className={`${cls} text-sm-gold`} />;
  if (icon.includes("03") || icon.includes("04"))
    return <Cloud className={`${cls} text-white/70`} />;
  if (icon.includes("09") || icon.includes("10"))
    return <CloudRain className={`${cls} text-white/80`} />;
  if (icon.includes("13"))
    return <CloudSnow className={`${cls} text-white/80`} />;
  return <Cloud className={`${cls} text-white/70`} />;
}

export default function HeroWeather() {
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setWeather(data);
      } catch {
        setError(true);
      }
    }
    fetchWeather();
  }, []);

  return (
    <div className="relative h-full bg-sm-navy p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="label-micro text-sm-gold/90">Southborough</span>
        {weather && getWeatherIcon(weather.icon)}
      </div>

      {error ? (
        <p className="text-xs text-white/60">Unable to load weather</p>
      ) : !weather ? (
        <div className="h-16 animate-pulse rounded bg-white/5" />
      ) : (
        <>
          <div>
            <div className="flex items-end gap-1 leading-none">
              <p className="display-number text-[64px] leading-none text-white">
                {Math.round(weather.temp)}
              </p>
              <p className="display-number text-[24px] text-white/60 mb-1.5">
                °F
              </p>
            </div>
            <p className="mt-1 text-[11px] capitalize text-white/60 tracking-wide">
              {weather.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="divider-gold" />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="label-micro text-white/50 mb-0.5">Feels</p>
                <p className="text-[11px] font-bold text-white tabular">
                  {Math.round(weather.feelsLike)}°
                </p>
              </div>
              <div>
                <p className="label-micro text-white/50 mb-0.5">Wind</p>
                <p className="text-[11px] font-bold text-white tabular">
                  {Math.round(weather.windSpeed)}
                  <span className="text-[9px] font-normal text-white/50 ml-0.5">
                    mph
                  </span>
                </p>
              </div>
              <div>
                <p className="label-micro text-white/50 mb-0.5">H / L</p>
                <p className="text-[11px] font-bold text-white tabular">
                  {Math.round(weather.high)}°
                  <span className="text-white/50 font-normal">
                    /{Math.round(weather.low)}°
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
