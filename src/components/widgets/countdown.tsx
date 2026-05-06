"use client";

import { useEffect, useMemo, useState } from "react";
import { useNow } from "@/lib/now";
import { WidgetShell } from "./widget-shell";

interface Milestone {
  id: string;
  label: string;
  date: string;
  emoji?: string;
}

function daysBetween(a: Date, b: Date): number {
  const ms = b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function fmt(d: Date): string {
  return d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    .toUpperCase();
}

export function CountdownWidget() {
  const now = useNow(60_000 * 5);
  const [milestones, setMilestones] = useState<Milestone[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/milestones");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { milestones: Milestone[] };
        if (!cancelled) setMilestones(data.milestones || []);
      } catch {
        if (!cancelled) setError(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcoming = useMemo(() => {
    if (!now || !milestones) return [];
    return milestones
      .map((m) => {
        const target = new Date(m.date + "T00:00:00");
        return { ...m, target, days: daysBetween(new Date(now), target) };
      })
      .filter((m) => m.days >= 0)
      .sort((a, b) => a.days - b.days);
  }, [now, milestones]);

  if (!now || milestones === null) {
    return (
      <WidgetShell title="Countdown" eyebrow="MILESTONES" accent="orange">
        <div role="status" aria-label="Loading countdown" className="space-y-2">
          <div className="h-12 animate-pulse rounded bg-sm-cream" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-sm-cream" />
        </div>
      </WidgetShell>
    );
  }

  if (error || upcoming.length === 0) {
    return (
      <WidgetShell title="Countdown" eyebrow="MILESTONES" accent="orange">
        <p className="text-[11px] text-sm-text-muted">
          {error
            ? "Couldn't load milestones."
            : "No milestones in the calendar yet."}
        </p>
      </WidgetShell>
    );
  }

  const [headline, ...rest] = upcoming;

  return (
    <WidgetShell
      title="Countdown"
      eyebrow="MILESTONES"
      accent="orange"
      scrollable={false}
    >
      <div className="flex h-full flex-col">
        <div className="flex flex-col justify-center py-4 border-b border-sm-border/60">
          <p className="label-micro text-sm-text-muted mb-1">
            {headline.emoji && (
              <span className="not-italic mr-1.5">{headline.emoji}</span>
            )}
            Up Next
          </p>
          <div className="flex items-end gap-2 leading-none mb-1.5">
            <p className="display-number text-[56px] text-sm-navy">
              {headline.days}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sm-text-muted mb-3">
              day{headline.days === 1 ? "" : "s"}
            </p>
          </div>
          <p className="text-sm font-bold text-sm-text">{headline.label}</p>
          <p className="text-[10px] text-sm-text-muted tabular tracking-[0.12em]">
            {fmt(headline.target)}
          </p>
        </div>

        <ul
          className="flex-1 mt-3 space-y-1.5 overflow-y-auto min-h-0"
          aria-label="Upcoming milestones"
        >
          {rest.slice(0, 5).map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between text-[11px]"
            >
              <span className="text-sm-text truncate flex-1">
                {m.emoji && <span className="mr-1">{m.emoji}</span>}
                {m.label}
              </span>
              <span className="text-sm-text-muted tabular ml-3 flex-shrink-0">
                {m.days}d
              </span>
            </li>
          ))}
        </ul>
      </div>
    </WidgetShell>
  );
}
