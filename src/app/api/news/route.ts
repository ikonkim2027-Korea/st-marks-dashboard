import { NextResponse } from "next/server";

// Revalidate once per hour so the dashboard always reflects the latest news
// without hammering stmarksschool.org on every request.
export const revalidate = 3600;

interface NewsItem {
  id: string;
  title: string;
  link: string;
  date: string; // ISO 8601
  imageUrl: string | null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D");
}

export async function GET() {
  try {
    const res = await fetch("https://www.stmarksschool.org/news", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; StMarksDashboard/1.0; +https://stmarksschool.org)",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { items: [], error: `upstream ${res.status}` },
        { status: 502 },
      );
    }

    const html = await res.text();
    const items: NewsItem[] = [];

    const articleRegex =
      /<article[^>]*data-post-id="(\d+)"[^>]*>([\s\S]*?)<\/article>/g;
    let m: RegExpExecArray | null;
    while ((m = articleRegex.exec(html)) !== null) {
      const id = m[1];
      const block = m[2];

      const titleMatch = block.match(
        /<div class="fsTitle[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/,
      );
      if (!titleMatch) continue;
      const link = titleMatch[1];
      const title = decodeEntities(
        titleMatch[2].replace(/<[^>]+>/g, "").trim().replace(/\s+/g, " "),
      );

      const dateMatch = block.match(/datetime="([^"]+)"/);
      const date = dateMatch ? dateMatch[1] : "";

      let imageUrl: string | null = null;
      const imgMatch = block.match(/data-image-sizes="([^"]+)"/);
      if (imgMatch) {
        try {
          const parsed: { url: string; width: number }[] = JSON.parse(
            decodeEntities(imgMatch[1]),
          );
          // Pick ~800px wide image — good quality without being oversized.
          const pick =
            parsed.find((s) => s.width >= 800) ||
            parsed[parsed.length - 1] ||
            parsed[0];
          imageUrl = pick?.url ?? null;
        } catch {
          // ignore malformed JSON
        }
      }

      items.push({ id, title, link, date, imageUrl });
    }

    // Newest first (the page usually renders them that way already, but sort
    // defensively by date desc)
    items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    return NextResponse.json({ items: items.slice(0, 10) });
  } catch (e) {
    return NextResponse.json(
      { items: [], error: e instanceof Error ? e.message : "unknown" },
      { status: 500 },
    );
  }
}
