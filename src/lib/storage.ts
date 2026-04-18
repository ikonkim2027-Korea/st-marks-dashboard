"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useLocalStorage<T>(key, initial)
 *
 * - Hydrates from localStorage after mount (SSR-safe).
 * - Persists on change.
 * - Subscribes to the `storage` event so when one tab / component writes,
 *   other tabs and other hook instances for the same key sync automatically.
 *   This is what keeps the global header °C/°F toggle and any WeatherWidget
 *   unit toggle in lockstep.
 *
 * Returns: [value, setValue, hydrated]
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  // Track the last serialized value this hook wrote so we can ignore
  // storage events that echo our own writes.
  const lastWrittenRef = useRef<string | null>(null);

  // Hydrate on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
        lastWrittenRef.current = raw;
      }
    } catch {
      // ignore — fall back to initial
    }
    setHydrated(true);
  }, [key]);

  // Persist on change.
  useEffect(() => {
    if (!hydrated) return;
    try {
      const serialized = JSON.stringify(value);
      if (lastWrittenRef.current === serialized) return;
      window.localStorage.setItem(key, serialized);
      lastWrittenRef.current = serialized;
    } catch {
      // ignore quota / serialization errors
    }
  }, [key, value, hydrated]);

  // Cross-tab / cross-instance sync.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      if (event.storageArea !== window.localStorage) return;
      if (event.newValue === null) {
        // Key was cleared — fall back to initial.
        lastWrittenRef.current = null;
        setValue(initial);
        return;
      }
      if (event.newValue === lastWrittenRef.current) return;
      try {
        const parsed = JSON.parse(event.newValue) as T;
        lastWrittenRef.current = event.newValue;
        setValue(parsed);
      } catch {
        // ignore malformed external writes
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // `initial` is intentionally excluded — we want a stable fallback per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Stable wrapper around setValue so consumers can treat it like a normal setter.
  const setStored = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) =>
      typeof next === "function"
        ? (next as (prev: T) => T)(prev)
        : next,
    );
  }, []);

  return [value, setStored, hydrated] as const;
}
