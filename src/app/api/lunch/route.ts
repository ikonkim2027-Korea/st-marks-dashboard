import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const revalidate = 1800;

interface MenuItem {
  name: string;
  isVegetarian?: boolean;
}

interface DayMenu {
  diningHall: MenuItem[];
  lionsDen: MenuItem[];
}

const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), ".data", "lunch.json");
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as {
      updated?: string;
      menus?: Record<string, DayMenu>;
    };

    const day = WEEK[new Date().getDay()];
    const dayMenu = parsed.menus?.[day];

    if (!dayMenu) {
      return NextResponse.json({
        day,
        updated: parsed.updated ?? null,
        diningHall: [],
        lionsDen: [],
        empty: true,
      });
    }

    return NextResponse.json({
      day,
      updated: parsed.updated ?? null,
      diningHall: dayMenu.diningHall ?? [],
      lionsDen: dayMenu.lionsDen ?? [],
    });
  } catch (e) {
    return NextResponse.json(
      {
        day: WEEK[new Date().getDay()],
        updated: null,
        diningHall: [],
        lionsDen: [],
        error: e instanceof Error ? e.message : "unknown",
      },
      { status: 500 },
    );
  }
}
