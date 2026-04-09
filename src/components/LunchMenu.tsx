"use client";

import { useEffect, useState } from "react";
import { UtensilsCrossed, Leaf, ExternalLink } from "lucide-react";

interface MenuItem {
  name: string;
  isVegetarian?: boolean;
}

interface MenuData {
  date: string;
  diningHall: MenuItem[];
  lionsDen: MenuItem[];
}

// Mock data for initial build — will be replaced with FLIK Nutrislice API
function getMockMenu(): MenuData {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return {
    date: today,
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
    // TODO: Replace with /api/lunch fetch
    setMenu(getMockMenu());
  }, []);

  if (!menu) {
    return (
      <div className="widget-card p-5">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">
          Today&apos;s Menu
        </h3>
        <div className="h-32 animate-pulse rounded-lg bg-cream" />
      </div>
    );
  }

  const items = activeTab === "diningHall" ? menu.diningHall : menu.lionsDen;

  return (
    <div className="widget-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-semibold text-text-secondary">
            Today&apos;s Menu
          </h3>
        </div>
        <a
          href="https://sms.flikisdining.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-navy hover:text-navy-light transition-colors"
        >
          Full Menu <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-cream p-0.5 mb-4">
        <button
          onClick={() => setActiveTab("diningHall")}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            activeTab === "diningHall"
              ? "bg-white text-navy shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          Dining Hall
        </button>
        <button
          onClick={() => setActiveTab("lionsDen")}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            activeTab === "lionsDen"
              ? "bg-white text-navy shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          Lion&apos;s Den
        </button>
      </div>

      {/* Menu items */}
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between rounded-lg bg-cream/50 px-3 py-2"
          >
            <span className="text-sm text-text-primary">{item.name}</span>
            {item.isVegetarian && (
              <Leaf className="h-3.5 w-3.5 text-success flex-shrink-0" />
            )}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[11px] text-text-muted text-center">
        Powered by FLIK Dining Services
      </p>
    </div>
  );
}
