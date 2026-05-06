import { NextResponse } from "next/server";

export const revalidate = 1800;

const SCHOOL_SLUG = "saint-marks-school";
const FLIK_HOST = "https://sms.api.flikisdining.com";
const TZ = "America/New_York";

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

interface NutrisliceFood {
  name?: string;
  food_category?: string;
  description?: string;
  icons?: { food_icons?: Array<{ synced_name?: string; name?: string }> };
}

interface NutrisliceItem {
  is_section_title?: boolean;
  text?: string;
  food?: NutrisliceFood | null;
}

interface NutrisliceDay {
  date?: string;
  menu_items?: NutrisliceItem[];
}

interface NutrisliceWeek {
  days?: NutrisliceDay[];
}

const WEEKDAY_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function todayInTz(): { y: number; m: number; d: number; weekday: number } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(now);
  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const wmap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return { y, m, d, weekday: wmap[wd] ?? 1 };
}

function isVegetarian(food: NutrisliceFood | null | undefined): boolean {
  if (!food) return false;
  for (const ic of food.icons?.food_icons ?? []) {
    const tag = (ic.synced_name || ic.name || "").toLowerCase();
    if (tag.includes("vegetarian") || tag.includes("vegan")) return true;
  }
  const cat = (food.food_category || "").toLowerCase();
  return cat.includes("vegetarian") || cat.includes("vegan");
}

async function fetchMenuForDate(
  slug: string,
  y: number,
  m: number,
  d: number,
): Promise<MenuItem[]> {
  const yy = String(y);
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  const url = `${FLIK_HOST}/menu/api/weeks/school/${SCHOOL_SLUG}/menu-type/${slug}/${yy}/${mm}/${dd}/`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; StMarksDashboard/1.0; +https://stmarksschool.org)",
      Accept: "application/json",
    },
    next: { revalidate: 1800 },
  });
  if (!res.ok) return [];

  const data = (await res.json()) as NutrisliceWeek;
  const target = `${yy}-${mm}-${dd}`;
  const day = data.days?.find((x) => x.date === target);
  if (!day || !day.menu_items) return [];

  const items: MenuItem[] = [];
  let currentSection: string | null = null;
  for (const it of day.menu_items) {
    if (it.is_section_title) {
      currentSection = (it.text || "").trim() || null;
      continue;
    }
    const food = it.food;
    const name = food?.name?.trim();
    if (!name) continue;
    items.push({
      name,
      section: currentSection,
      isVegetarian: isVegetarian(food),
    });
  }
  return items;
}

export async function GET() {
  const { y, m, d, weekday } = todayInTz();
  const isWeekend = weekday === 0 || weekday === 6;
  const primarySlug = isWeekend ? "brunch" : "lunch";
  const primaryName = isWeekend ? "Brunch" : "Lunch";
  const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  try {
    const [primaryItems, dinnerItems] = await Promise.all([
      fetchMenuForDate(primarySlug, y, m, d),
      fetchMenuForDate("dinner", y, m, d),
    ]);

    const meals: MenuBlock[] = [];
    if (primaryItems.length > 0) {
      meals.push({ slug: primarySlug, name: primaryName, items: primaryItems });
    }
    if (dinnerItems.length > 0) {
      meals.push({ slug: "dinner", name: "Dinner", items: dinnerItems });
    }

    return NextResponse.json({
      date: dateStr,
      weekday: WEEKDAY_LABEL[weekday],
      source: "flik",
      meals,
    });
  } catch (e) {
    return NextResponse.json(
      {
        date: dateStr,
        weekday: WEEKDAY_LABEL[weekday],
        source: "flik",
        meals: [],
        error: e instanceof Error ? e.message : "unknown",
      },
      { status: 500 },
    );
  }
}
