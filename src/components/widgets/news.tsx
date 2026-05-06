"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertCircle, Newspaper } from "lucide-react";
import { WidgetShell } from "./widget-shell";

interface ApiNewsItem {
  id: string;
  title: string;
  link: string;
  date: string; // ISO
  imageUrl: string | null;
}

const MAX_ITEMS = 5;
const NEWS_HREF = "https://www.stmarksschool.org/about/news-and-stories";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = d.getFullYear().toString().slice(-2);
  return `${day} ${month} ${year}`;
}

export function NewsWidget() {
  const [news, setNews] = useState<ApiNewsItem[] | null>(null);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { items: ApiNewsItem[] };
        if (!cancelled) setNews(data.items || []);
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
        title="School News"
        eyebrow="ST. MARK'S"
        accent="navy"
        href={NEWS_HREF}
        hrefLabel="All"
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
            Couldn’t load news
          </p>
          <p className="text-[11px] text-sm-text-muted leading-relaxed max-w-[240px]">
            Try refreshing the page or check your connection.
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

  if (news === null) {
    return (
      <WidgetShell
        title="School News"
        eyebrow="ST. MARK'S"
        accent="navy"
        href={NEWS_HREF}
        hrefLabel="All"
      >
        <div role="status" aria-label="Loading news" className="space-y-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 animate-pulse rounded-md bg-sm-cream" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-2 w-12 animate-pulse rounded bg-sm-cream" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-sm-cream" />
                <div className="h-3 w-3/5 animate-pulse rounded bg-sm-cream" />
              </div>
            </div>
          ))}
          <span className="sr-only">Loading news…</span>
        </div>
      </WidgetShell>
    );
  }

  if (news.length === 0) {
    return (
      <WidgetShell
        title="School News"
        eyebrow="ST. MARK'S"
        accent="navy"
        href={NEWS_HREF}
        hrefLabel="All"
      >
        <div className="flex h-full flex-col items-center justify-center text-center">
          <Newspaper
            className="h-7 w-7 text-sm-text-muted/60 mb-2"
            aria-hidden="true"
          />
          <p className="text-sm font-semibold text-sm-text">No stories yet</p>
          <p className="text-[11px] text-sm-text-muted mt-1">
            Fresh St. Mark’s news will show up here.
          </p>
        </div>
      </WidgetShell>
    );
  }

  const items = news.slice(0, MAX_ITEMS);

  return (
    <WidgetShell
      title="School News"
      eyebrow="ST. MARK'S"
      accent="navy"
      href={NEWS_HREF}
      hrefLabel="All"
    >
      <ul className="-mr-1 flex h-full flex-col divide-y divide-sm-border/60 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.id} className="first:pt-0 last:pb-0">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group flex items-center gap-3 rounded-sm py-2.5"
              aria-label={`${item.title} — ${formatDate(item.date)}`}
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-sm-cream">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="56px"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center text-sm-text-muted/50"
                    aria-hidden="true"
                  >
                    <Newspaper className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="label-micro tabular mb-0.5">
                  {formatDate(item.date)}
                </p>
                <h4 className="line-clamp-2 text-[13px] font-semibold leading-snug text-sm-text transition-colors group-hover:text-sm-navy">
                  {item.title}
                </h4>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </WidgetShell>
  );
}
