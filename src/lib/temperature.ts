"use client";

import { useLocalStorage } from "./storage";

export type TempUnit = "C" | "F";

export const TEMP_UNIT_STORAGE_KEY = "stmarks-temp-unit";

/**
 * Convert a temperature between Fahrenheit and Celsius.
 * Returns a number rounded to 1 decimal place to avoid floating-point noise.
 * If `from === to` the input is returned unchanged.
 */
export function convertTemp(value: number, from: TempUnit, to: TempUnit): number {
  if (!Number.isFinite(value)) return value;
  if (from === to) return value;
  const converted =
    from === "F" && to === "C"
      ? ((value - 32) * 5) / 9
      : // C → F
        (value * 9) / 5 + 32;
  // Round to 1 decimal place to keep the number stable across repeated
  // conversions (e.g., 72°F → 22.222°C → rendering uses Math.round anyway).
  return Math.round(converted * 10) / 10;
}

/**
 * Shared temperature-unit preference. Defaults to "F" because St. Mark's
 * (Southborough, MA) uses Fahrenheit in all local context and the current
 * `/api/weather` route returns °F.
 *
 * Backed by `useLocalStorage` so the Header toggle and WeatherWidget toggle
 * stay in sync via the cross-tab `storage` event.
 */
export function useTemperatureUnit() {
  return useLocalStorage<TempUnit>(TEMP_UNIT_STORAGE_KEY, "F");
}
