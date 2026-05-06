import { NextResponse } from "next/server";

export const revalidate = 1800;

interface AthEvent {
  id: string;
  sport: string;
  level: string | null;
  opponent: string;
  location: "home" | "away" | "unknown";
  start: string;
  end: string | null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "’")
    .replace(/&rsquo;/g, "’");
}

function parseTitle(raw: string): {
  sport: string;
  level: string | null;
  opponent: string;
  location: "home" | "away" | "unknown";
} {
  const t = decodeEntities(raw).trim();
  // Pattern: "Sport - Level vs. Opponent (Home|Away)"
  const m = t.match(/^([^-]+?)\s*-\s*(.+?)\s+vs\.?\s+(.+?)(?:\s*\((Home|Away)\))?\s*$/i);
  if (m) {
    const [, sport, level, opp, loc] = m;
    return {
      sport: sport.trim(),
      level: level.trim() || null,
      opponent: opp.trim(),
      location: loc?.toLowerCase() === "home"
        ? "home"
        : loc?.toLowerCase() === "away"
        ? "away"
        : "unknown",
    };
  }
  // Fallback: "Sport vs. Opponent"
  const m2 = t.match(/^(.+?)\s+vs\.?\s+(.+?)(?:\s*\((Home|Away)\))?\s*$/i);
  if (m2) {
    const [, sport, opp, loc] = m2;
    return {
      sport: sport.trim(),
      level: null,
      opponent: opp.trim(),
      location: loc?.toLowerCase() === "home"
        ? "home"
        : loc?.toLowerCase() === "away"
        ? "away"
        : "unknown",
    };
  }
  return { sport: t, level: null, opponent: "", location: "unknown" };
}

export async function GET() {
  try {
    const res = await fetch("https://www.stmarksschool.org/athletics/schedule", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; StMarksDashboard/1.0; +https://stmarksschool.org)",
      },
      next: { revalidate: 1800 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { items: [], error: `upstream ${res.status}` },
        { status: 502 },
      );
    }
    const html = await res.text();

    const events: AthEvent[] = [];
    const seen = new Set<string>();
    const articleRe =
      /<article aria-labelledby="fsArticle_\d+_(\d+)"[^>]*>([\s\S]*?)<\/article>/g;
    let m: RegExpExecArray | null;
    while ((m = articleRe.exec(html)) !== null) {
      const id = m[1];
      const block = m[2];
      const startMatch = block.match(/<time datetime="([^"]+)"[^>]*class="fsDate"/);
      const titleMatch = block.match(
        /<a[^>]*class="fsCalendarEventLink"[^>]*data-occur-id="\d+"[^>]*>([\s\S]*?)<\/a>/,
      );
      if (!startMatch || !titleMatch) continue;
      const title = titleMatch[1].replace(/<[^>]+>/g, "").trim();
      if (!title) continue;
      const start = startMatch[1];
      const key = `${id}-${start}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const startTimeMatch = block.match(
        /<time datetime="([^"]+)"[^>]*class="fsStartTime"/,
      );
      const endTimeMatch = block.match(
        /<time datetime="([^"]+)"[^>]*class="fsEndTime"/,
      );
      const parsed = parseTitle(title);
      events.push({
        id,
        ...parsed,
        start: startTimeMatch ? startTimeMatch[1] : start,
        end: endTimeMatch ? endTimeMatch[1] : null,
      });
    }

    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    const upcoming = events
      .filter((e) => new Date(e.start).getTime() >= cutoff.getTime())
      .sort((a, b) => a.start.localeCompare(b.start))
      .slice(0, 10);

    return NextResponse.json({ items: upcoming });
  } catch (e) {
    return NextResponse.json(
      { items: [], error: e instanceof Error ? e.message : "unknown" },
      { status: 500 },
    );
  }
}
