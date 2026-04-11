"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

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

export default function SchoolNews() {
  const [news, setNews] = useState<ApiNewsItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { items: ApiNewsItem[] };
        setNews(data.items || []);
      } catch {
        setError(true);
      }
    }
    load();
  }, []);

  if (error) {
    return (
      <div className="widget-card p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-5">
          <span className="divider-gold" />
          <span className="label-micro">School News</span>
        </div>
        <p className="text-xs text-sm-text-muted">Unable to load news.</p>
      </div>
    );
  }

  if (news === null) {
    return (
      <div className="widget-card p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-5">
          <span className="divider-gold" />
          <span className="label-micro">School News</span>
        </div>
        <div className="aspect-[16/9] w-full animate-pulse rounded bg-sm-cream mb-4" />
        <div className="space-y-3">
          <div className="h-3 w-3/4 animate-pulse rounded bg-sm-cream" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-sm-cream" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-sm-cream" />
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="widget-card p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-5">
          <span className="divider-gold" />
          <span className="label-micro">School News</span>
        </div>
        <p className="text-xs text-sm-text-muted">No news available.</p>
      </div>
    );
  }

  const [featured, ...rest] = news;

  return (
    <div className="widget-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="divider-gold" />
          <span className="label-micro">School News</span>
        </div>
        <a
          href="https://www.stmarksschool.org/news"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-sm-navy hover:text-sm-navy-light transition-colors"
        >
          All
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      {/* Featured */}
      <a
        href={featured.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        {featured.imageUrl && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-md mb-3">
            <Image
              src={featured.imageUrl}
              alt={featured.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sm-navy/40 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2">
              <span className="inline-block px-2 py-0.5 bg-white/95 text-[9px] font-bold uppercase tracking-[0.15em] text-sm-navy">
                Featured
              </span>
            </div>
          </div>
        )}
        <p className="text-[10px] text-sm-text-muted tracking-[0.12em] tabular mb-1">
          {formatDate(featured.date)}
        </p>
        <h4 className="text-sm font-bold text-sm-text leading-snug group-hover:text-sm-navy transition-colors">
          {featured.title}
        </h4>
      </a>

      {/* Rest — fills remaining vertical space */}
      <div className="mt-5 pt-4 border-t border-sm-border/60 space-y-2.5 flex-1 overflow-hidden">
        {rest.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block group border-l border-sm-border/80 hover:border-sm-gold pl-3 transition-colors"
          >
            <p className="text-[9px] text-sm-text-muted tracking-[0.12em] tabular mb-0.5">
              {formatDate(item.date)}
            </p>
            <h4 className="text-xs font-semibold text-sm-text leading-snug group-hover:text-sm-navy transition-colors line-clamp-2">
              {item.title}
            </h4>
          </a>
        ))}
      </div>
    </div>
  );
}
