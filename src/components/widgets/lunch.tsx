"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Utensils } from "lucide-react";
import { WidgetShell } from "./widget-shell";

interface MenuItem {
  name: string;
  isVegetarian?: boolean;
}

interface MenuData {
  day: string;
  updated: string | null;
  diningHall: MenuItem[];
  lionsDen: MenuItem[];
  empty?: boolean;
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

export function LunchWidget() {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"diningHall" | "lionsDen">(
    "diningHall",
  );

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

  if (error) {
    return (
      <WidgetShell
        title="Lunch"
        eyebrow="TODAY'S MENU"
        accent="gold"
        href="https://sms.flikisdining.com/"
        hrefLabel="Full Menu"
        scrollable={false}
      >
        <div className="flex h-full flex-col items-center justify-center text-center" role="alert">
          <AlertCircle className="h-5 w-5 text-sm-danger mb-2" aria-hidden="true" />
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
        href="https://sms.flikisdining.com/"
        hrefLabel="Full Menu"
        scrollable={false}
      >
        <div role="status" aria-label="Loading menu" className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 w-3/4 animate-pulse rounded bg-sm-cream" />
          ))}
          <span className="sr-only">Loading menu…</span>
        </div>
      </WidgetShell>
    );
  }

  const items = activeTab === "diningHall" ? menu.diningHall : menu.lionsDen;
  const dayName = DAY_LABEL[menu.day] ?? menu.day;

  return (
    <WidgetShell
      title="Lunch"
      eyebrow={`${dayName.toUpperCase()}'S MENU`}
      accent="gold"
      href="https://sms.flikisdining.com/"
      hrefLabel="Full Menu"
      scrollable={false}
    >
      <div className="flex h-full flex-col">
        <div
          className="flex gap-6 border-b border-sm-border/60 mb-4"
          role="tablist"
          aria-label="Lunch location"
        >
          <button
            role="tab"
            aria-selected={activeTab === "diningHall"}
            aria-controls="lunch-panel-diningHall"
            id="lunch-tab-diningHall"
            onClick={() => setActiveTab("diningHall")}
            onMouseDown={(e) => e.stopPropagation()}
            className={`focus-ring min-h-[40px] pb-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors relative ${
              activeTab === "diningHall"
                ? "text-sm-navy"
                : "text-sm-text-muted hover:text-sm-text-light"
            }`}
          >
            Dining Hall
            {activeTab === "diningHall" && (
              <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-sm-navy" aria-hidden="true" />
            )}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "lionsDen"}
            aria-controls="lunch-panel-lionsDen"
            id="lunch-tab-lionsDen"
            onClick={() => setActiveTab("lionsDen")}
            onMouseDown={(e) => e.stopPropagation()}
            className={`focus-ring min-h-[40px] pb-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors relative ${
              activeTab === "lionsDen"
                ? "text-sm-navy"
                : "text-sm-text-muted hover:text-sm-text-light"
            }`}
          >
            Lion&apos;s Den
            {activeTab === "lionsDen" && (
              <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-sm-navy" aria-hidden="true" />
            )}
          </button>
        </div>

        <ul
          className="space-y-0 flex-1"
          role="tabpanel"
          id={`lunch-panel-${activeTab}`}
          aria-labelledby={`lunch-tab-${activeTab}`}
        >
          {items.length === 0 ? (
            <li className="flex flex-col items-center justify-center text-center py-8">
              <Utensils className="h-6 w-6 text-sm-text-muted/60 mb-2" aria-hidden="true" />
              <p className="text-[11px] text-sm-text-muted">
                No menu posted for {dayName} yet.
              </p>
            </li>
          ) : (
            items.map((item, i) => (
              <li
                key={`${item.name}-${i}`}
                className="flex items-center justify-between gap-3 py-2 border-b border-sm-border/50 last:border-0"
              >
                <span className="text-sm text-sm-text leading-snug">{item.name}</span>
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
            ))
          )}
        </ul>

        <p className="mt-4 pt-3 border-t border-sm-border/60 text-[9px] text-sm-text-muted tracking-[0.15em] uppercase text-center">
          FLIK Dining
          {menu.updated && (
            <span className="text-sm-text-muted/70"> · Updated {menu.updated}</span>
          )}
        </p>
      </div>
    </WidgetShell>
  );
}
