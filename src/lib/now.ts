"use client";

import { useSyncExternalStore } from "react";

/**
 * useNow — returns the current Date, refreshed every `intervalMs`.
 *
 * Built on `useSyncExternalStore` so it satisfies the
 * `react-hooks/set-state-in-effect` rule introduced in React 19. Per-interval
 * stores are memoized at module scope so `getSnapshot` returns a stable
 * reference between ticks (required to avoid the "infinite loop" warning).
 *
 * Returns `null` during SSR so server-rendered markup stays deterministic;
 * the first client render fills it in.
 */
const stores = new Map<
  number,
  {
    snapshot: Date;
    listeners: Set<() => void>;
    timer: ReturnType<typeof setInterval> | null;
  }
>();

function getStore(intervalMs: number) {
  let s = stores.get(intervalMs);
  if (!s) {
    s = { snapshot: new Date(), listeners: new Set(), timer: null };
    stores.set(intervalMs, s);
  }
  return s;
}

export function useNow(intervalMs: number = 60_000): Date | null {
  return useSyncExternalStore(
    (notify) => {
      const s = getStore(intervalMs);
      s.listeners.add(notify);
      if (!s.timer) {
        s.timer = setInterval(() => {
          s.snapshot = new Date();
          for (const l of s.listeners) l();
        }, intervalMs);
      }
      return () => {
        s.listeners.delete(notify);
        if (s.listeners.size === 0 && s.timer) {
          clearInterval(s.timer);
          s.timer = null;
        }
      };
    },
    () => getStore(intervalMs).snapshot,
    () => null,
  );
}
