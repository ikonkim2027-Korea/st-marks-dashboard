"use client";

import { useState } from "react";
import { WidgetShell } from "./widget-shell";

interface MenuItem {
  name: string;
  isVegetarian?: boolean;
}

interface MenuData {
  date: string;
  diningHall: MenuItem[];
  lionsDen: MenuItem[];
}

function getMockMenu(): MenuData {
  return {
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    diningHall: [
      { name: "Herb-Roasted Chicken with Pan Gravy" },
      { name: "Pasta Primavera", isVegetarian: true },
      { name: "Caesar Salad Bar" },
      { name: "Tomato Basil Soup", isVegetarian: true },
      { name: "Fresh Fruit & Yogurt Bar" },
    ],
    lionsDen: [
      { name: "Build Your Own Burger" },
      { name: "Loaded Fries" },
      { name: "Grilled Cheese", isVegetarian: true },
    ],
  };
}

export function LunchWidget() {
  const [menu] = useState<MenuData>(() => getMockMenu());
  const [activeTab, setActiveTab] = useState<"diningHall" | "lionsDen">(
    "diningHall"
  );

  const items = activeTab === "diningHall" ? menu.diningHall : menu.lionsDen;

  return (
    <WidgetShell
      title="Lunch"
      eyebrow="TODAY'S MENU"
      accent="gold"
      href="https://sms.flikisdining.com/"
      hrefLabel="Full Menu"
      scrollable={false}
    >
      <div className="flex h-full flex-col">
        {/* Underline tabs */}
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
              <p className="text-[11px] text-sm-text-muted">No menu posted for today yet.</p>
            </li>
          ) : (
            items.map((item, i) => (
              <li
                key={i}
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
          Powered by FLIK Dining
        </p>
      </div>
    </WidgetShell>
  );
}
