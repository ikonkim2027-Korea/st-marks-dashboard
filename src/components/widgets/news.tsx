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

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = d.getFullYear().toString().slice(-2);
  return `${day} ${month} ${year}`;
}

const NEWS_HREF = "https://www.stmarksschool.org/about/news-and-stories";

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
        <div className="flex h-full flex-col items-center justify-center text-center" role="alert">
          <AlertCircle className="h-5 w-5 text-sm-danger mb-2" aria-hidden="true" />
          <p className="text-xs font-semibold text-sm-text mb-1">Couldn’t load news</p>
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
        <div role="status" aria-label="Loading news">
          <div className="aspect-[16/9] w-full animate-pulse rounded bg-sm-cream mb-4" />
          <div className="h-2 w-16 animate-pulse rounded bg-sm-cream mb-2" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-sm-cream mb-4" />
          <div className="border-t border-sm-border/60 pt-4 space-y-2.5">
            <div className="h-2 w-10 animate-pulse rounded bg-sm-cream" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-sm-cream" />
            <div className="h-2 w-10 animate-pulse rounded bg-sm-cream" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-sm-cream" />
          </div>
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
          <Newspaper className="h-7 w-7 text-sm-text-muted/60 mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold text-sm-text">No stories yet</p>
          <p className="text-[11px] text-sm-text-muted mt-1">Fresh St. Mark’s news will show up here.</p>
        </div>
      </WidgetShell>
    );
  }

  const [featured, ...rest] = news;

  return (
    <WidgetShell
      title="School News"
      eyebrow="ST. MARK'S"
      accent="navy"
      href={NEWS_HREF}
      hrefLabel="All"
    >
      <div className="flex h-full flex-col">
        {/* Featured */}
        <a
          href={featured.link}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring block group rounded-sm"
          aria-label={`Featured: ${featured.title}`}
        >
          {featured.imageUrl && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-md mb-3">
              <Image
                src={featured.imageUrl}
                alt=""
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sm-navy/40 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute bottom-2 left-2">
                <span className="inline-block px-2 py-0.5 bg-white/95 text-[9px] font-bold uppercase tracking-[0.15em] text-sm-navy rounded-sm">
                  Featured
                </span>
              </div>
            </div>
          )}
          <p className="label-micro tabular mb-1">
            {formatDate(featured.date)}
          </p>
          <h4 className="text-sm font-bold text-sm-text leading-snug group-hover:text-sm-navy transition-colors">
            {featured.title}
          </h4>
        </a>

        {/* Rest — fills remaining vertical space */}
        <ul className="mt-5 pt-4 border-t border-sm-border/60 space-y-2.5 flex-1 overflow-hidden">
          {rest.map((item) => (
            <li key={item.id}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring block group border-l border-sm-border/80 hover:border-sm-gold pl-3 transition-colors rounded-sm"
              >
                <p className="text-[9px] text-sm-text-muted tracking-[0.12em] tabular mb-0.5">
                  {formatDate(item.date)}
                </p>
                <h4 className="text-xs font-semibold text-sm-text leading-snug group-hover:text-sm-navy transition-colors line-clamp-2">
                  {item.title}
                </h4>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </WidgetShell>
  );
}
