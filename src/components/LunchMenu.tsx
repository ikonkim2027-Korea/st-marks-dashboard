"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

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

export default function LunchMenu() {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [activeTab, setActiveTab] = useState<"diningHall" | "lionsDen">(
    "diningHall"
  );

  useEffect(() => {
    setMenu(getMockMenu());
  }, []);

  if (!menu) {
    return (
      <div className="widget-card p-6 h-full">
        <div className="flex items-center gap-2 mb-4">
          <span className="divider-gold" />
          <span className="label-micro">Today&apos;s Menu</span>
        </div>
        <div className="h-32 animate-pulse rounded bg-sm-cream" />
      </div>
    );
  }

  const items = activeTab === "diningHall" ? menu.diningHall : menu.lionsDen;

  return (
    <div className="widget-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="divider-gold" />
          <span className="label-micro">Today&apos;s Menu</span>
        </div>
        <a
          href="https://sms.flikisdining.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-sm-navy hover:text-sm-navy-light transition-colors"
        >
          Full Menu
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      {/* Underline tabs */}
      <div className="flex gap-6 border-b border-sm-border mb-4">
        <button
          onClick={() => setActiveTab("diningHall")}
          className={`pb-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors relative ${
            activeTab === "diningHall"
              ? "text-sm-navy"
              : "text-sm-text-muted hover:text-sm-text-light"
          }`}
        >
          Dining Hall
          {activeTab === "diningHall" && (
            <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-sm-navy" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("lionsDen")}
          className={`pb-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors relative ${
            activeTab === "lionsDen"
              ? "text-sm-navy"
              : "text-sm-text-muted hover:text-sm-text-light"
          }`}
        >
          Lion&apos;s Den
          {activeTab === "lionsDen" && (
            <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-sm-navy" />
          )}
        </button>
      </div>

      <ul className="space-y-0 flex-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between py-2 border-b border-sm-border/50 last:border-0"
          >
            <span className="text-sm text-sm-text">{item.name}</span>
            {item.isVegetarian && (
              <span className="text-[9px] font-bold tracking-[0.1em] text-sm-success border border-sm-success/40 rounded-sm px-1 py-0.5">
                V
              </span>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-4 pt-3 border-t border-sm-border/60 text-[9px] text-sm-text-muted tracking-[0.15em] uppercase text-center">
        Powered by FLIK Dining
      </p>
    </div>
  );
}
