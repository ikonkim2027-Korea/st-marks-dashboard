"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { NewsItem } from "@/types";

const socials = [
  {
    platform: "Instagram",
    url: "https://www.instagram.com/smlions/",
    iconPath: "/icons/brands/instagram.svg",
  },
  {
    platform: "Facebook",
    url: "https://www.facebook.com/smlionsMA/",
    iconPath: "/icons/brands/facebook.svg",
  },
  {
    platform: "X",
    url: "https://x.com/SMLions",
    iconPath: "/icons/brands/x.svg",
  },
  {
    platform: "YouTube",
    url: "https://www.youtube.com/@SMLions",
    iconPath: "/icons/brands/youtube.svg",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/school/smlions/",
    iconPath: "/icons/brands/linkedin.svg",
  },
  {
    platform: "SmugMug",
    url: "https://stmarkslions.smugmug.com/",
    iconPath: "/icons/brands/smugmug.svg",
  },
];

function getMockNews(): NewsItem[] {
  return [
    {
      id: "1",
      title: "Inside the Pride: Weekly Newsletter",
      summary:
        "News and updates for current students and families including Spirit Week details and Groton Day preparations.",
      date: "Apr 9, 2026",
      category: "Newsletter",
      imageUrl: "/photos/campus-flower.jpg",
      link: "https://www.stmarksschool.org",
    },
    {
      id: "2",
      title: "Spring Travel Programs Announced",
      summary:
        "Global Learning in Action — Spring 2026 travel program destinations revealed.",
      date: "Apr 7, 2026",
      category: "Academics",
      link: "https://www.stmarksschool.org",
    },
    {
      id: "3",
      title: "Cutler Jazz Festival This Weekend",
      summary:
        "Annual jazz celebration featuring student performers and guest musicians at PFAC.",
      date: "Apr 5, 2026",
      category: "Arts",
      link: "https://www.stmarksschool.org",
    },
    {
      id: "4",
      title: "Lions Win ISL Championship",
      summary: "Boys varsity squash takes home the title.",
      date: "Apr 2, 2026",
      category: "Athletics",
      link: "https://www.stmarksschool.org",
    },
  ];
}

function formatDate(date: string): string {
  const d = new Date(date);
  const day = d.getDate();
  const month = d
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const year = d.getFullYear().toString().slice(-2);
  return `${day} ${month} ${year}`;
}

export default function SchoolNews() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    setNews(getMockNews());
  }, []);

  if (news.length === 0) {
    return (
      <div className="widget-card p-6 h-full">
        <div className="flex items-center gap-2 mb-5">
          <span className="divider-gold" />
          <span className="label-micro">School News</span>
        </div>
        <div className="h-32 animate-pulse rounded bg-sm-cream" />
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
          href="https://www.stmarksschool.org/about/news"
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
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sm-navy/40 via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2">
              <span className="inline-block px-2 py-0.5 bg-white/95 text-[9px] font-bold uppercase tracking-[0.15em] text-sm-navy">
                {featured.category}
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

      {/* Rest */}
      <div className="mt-5 pt-4 border-t border-sm-border/60 space-y-3 flex-1">
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
              <span className="mx-1.5 text-sm-border">·</span>
              <span className="uppercase">{item.category}</span>
            </p>
            <h4 className="text-xs font-semibold text-sm-text leading-snug group-hover:text-sm-navy transition-colors">
              {item.title}
            </h4>
          </a>
        ))}
      </div>

      {/* Social footer */}
      <div className="mt-5 pt-4 border-t border-sm-border/60">
        <p className="label-micro mb-2.5">Follow SM Lions</p>
        <div className="flex items-center gap-1">
          {socials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              title={social.platform}
              className="group flex items-center justify-center w-8 h-8 rounded border border-sm-border/60 hover:border-sm-navy hover:bg-sm-navy transition-all"
            >
              <Image
                src={social.iconPath}
                alt={social.platform}
                width={14}
                height={14}
                className="opacity-55 transition-all group-hover:opacity-100 group-hover:brightness-0 group-hover:invert"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
