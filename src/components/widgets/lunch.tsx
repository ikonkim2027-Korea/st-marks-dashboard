"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Utensils } from "lucide-react";
import { WidgetShell } from "./widget-shell";

interface MenuItem {
  name: string;
  section: string | null;
  isVegetarian: boolean;
}

interface MenuBlock {
  slug: string;
  name: string;
  items: MenuItem[];
}

interface MenuData {
  date: string;
  weekday: string;
  source: string;
  meals: MenuBlock[];
  error?: string;
}

const DAY_LABEL: Record<string, string> = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

const FLIK_HREF = "https://sms.flikisdining.com/menu/saint-marks-school";

interface SectionGroup {
  section: string | null;
  items: MenuItem[];
}

function groupBySection(items: MenuItem[]): SectionGroup[] {
  const out: SectionGroup[] = [];
  for (const it of items) {
    const last = out[out.length - 1];
    if (last && last.section === it.section) {
      last.items.push(it);
    } else {
      out.push({ section: it.section, items: [it] });
    }
  }
  return out;
}

export function LunchWidget() {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/lunch");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as MenuData;
        if (!cancelled) setMenu(data);
      } catch {
        if (!cancelled) setError(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Pin the active tab to the first available meal once data lands.
  useEffect(() => {
    if (!menu || activeSlug) return;
    const first = menu.meals[0]?.slug ?? null;
    if (first) setActiveSlug(first);
  }, [menu, activeSlug]);

  const dayName = menu ? DAY_LABEL[menu.weekday] ?? menu.weekday : "";
  const activeMeal = useMemo(() => {
    if (!menu) return null;
    return (
      menu.meals.find((x) => x.slug === activeSlug) ?? menu.meals[0] ?? null
    );
  }, [menu, activeSlug]);

  const eyebrow = activeMeal
    ? `${dayName.toUpperCase()} · ${activeMeal.name.toUpperCase()}`
    : dayName
      ? `${dayName.toUpperCase()}'S MENU`
      : "TODAY'S MENU";

  if (error) {
    return (
      <WidgetShell
        title="Lunch"
        eyebrow="TODAY'S MENU"
        accent="gold"
        href={FLIK_HREF}
        hrefLabel="Full Menu"
        scrollable={false}
      >
        <div
          className="flex h-full flex-col items-center justify-center text-center"
          role="alert"
        >
          <AlertCircle
            className="h-5 w-5 text-sm-danger mb-2"
            aria-hidden="true"
          />
          <p className="text-xs font-semibold text-sm-text mb-1">
            Couldn&apos;t load menu
          </p>
          <button
            onClick={() => {
              setError(false);
              setReloadKey((k) => k + 1);
            }}
            className="focus-ring mt-3 min-h-[40px] rounded-sm px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-sm-navy hover:underline"
          >
            Try again
          </button>
        </div>
      </WidgetShell>
    );
  }

  if (!menu) {
    return (
      <WidgetShell
        title="Lunch"
        eyebrow="TODAY'S MENU"
        accent="gold"
        href={FLIK_HREF}
        hrefLabel="Full Menu"
        scrollable={false}
      >
        <div role="status" aria-label="Loading menu" className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-3 w-3/4 animate-pulse rounded bg-sm-cream"
            />
          ))}
          <span className="sr-only">Loading menu…</span>
        </div>
      </WidgetShell>
    );
  }

  const groups = activeMeal ? groupBySection(activeMeal.items) : [];

  return (
    <WidgetShell
      title="Lunch"
      eyebrow={eyebrow}
      accent="gold"
      href={FLIK_HREF}
      hrefLabel="Full Menu"
    >
      <div className="flex h-full flex-col">
        {menu.meals.length > 1 && (
          <div
            className="flex gap-6 border-b border-sm-border/60 mb-3"
            role="tablist"
            aria-label="Meal selection"
          >
            {menu.meals.map((meal) => {
              const selected = activeSlug === meal.slug;
              return (
                <button
                  key={meal.slug}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`lunch-panel-${meal.slug}`}
                  id={`lunch-tab-${meal.slug}`}
                  onClick={() => setActiveSlug(meal.slug)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={`focus-ring relative min-h-[40px] pb-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${
                    selected
                      ? "text-sm-navy"
                      : "text-sm-text-muted hover:text-sm-text-light"
                  }`}
                >
                  {meal.name}
                  {selected && (
                    <span
                      className="absolute -bottom-px left-0 right-0 h-[2px] bg-sm-navy"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div
          className="flex-1 min-h-0 overflow-y-auto pr-1"
          role="tabpanel"
          id={`lunch-panel-${activeMeal?.slug ?? "none"}`}
          aria-labelledby={`lunch-tab-${activeMeal?.slug ?? "none"}`}
        >
          {!activeMeal || activeMeal.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-8">
              <Utensils
                className="h-6 w-6 text-sm-text-muted/60 mb-2"
                aria-hidden="true"
              />
              <p className="text-[11px] text-sm-text-muted">
                No menu posted for {dayName} yet.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {groups.map((g, gi) => (
                <li key={`${g.section ?? "_"}-${gi}`}>
                  {g.section && (
                    <p className="label-micro mb-1.5">{g.section}</p>
                  )}
                  <ul className="space-y-0">
                    {g.items.map((item, i) => (
                      <li
                        key={`${item.name}-${i}`}
                        className="flex items-center justify-between gap-3 py-1.5 border-b border-sm-border/40 last:border-0"
                      >
                        <span className="text-[13px] text-sm-text leading-snug">
                          {item.name}
                        </span>
                        {item.isVegetarian && (
                          <span
                            className="text-[9px] font-bold tracking-[0.1em] text-sm-success border border-sm-success/40 rounded-sm px-1 py-0.5 flex-shrink-0"
                            aria-label="Vegetarian"
                            title="Vegetarian"
                          >
                            V
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-3 pt-2 border-t border-sm-border/60 text-[9px] text-sm-text-muted tracking-[0.15em] uppercase text-center shrink-0">
          FLIK Dining · Live
        </p>
      </div>
    </WidgetShell>
  );
}
