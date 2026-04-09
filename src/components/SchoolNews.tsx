"use client";

import { useEffect, useState } from "react";
import { Newspaper, ArrowRight, Bell } from "lucide-react";
import type { NewsItem } from "@/types";

function getMockNews(): NewsItem[] {
  return [
    {
      id: "1",
      title: "Inside the Pride: Weekly Newsletter",
      summary:
        "News and updates for current students and families including Spirit Week details and Groton Day preparations.",
      date: "Apr 9, 2026",
      category: "Newsletter",
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
  ];
}

const categoryColors: Record<string, string> = {
  Newsletter: "bg-sm-navy/10 text-sm-navy",
  Academics: "bg-sm-success/15 text-sm-success",
  Arts: "bg-purple-100 text-purple-700",
  Athletics: "bg-sm-gold/20 text-sm-gold",
  Community: "bg-blue-100 text-blue-700",
};

export default function SchoolNews() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    setNews(getMockNews());
  }, []);

  return (
    <div className="widget-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-sm-gold" />
          <h3 className="text-xs font-semibold text-sm-text-light uppercase tracking-wider">
            School News
          </h3>
        </div>
        <a
          href="https://www.stmarksschool.org/about/news"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-sm-navy hover:text-sm-navy-light transition-colors"
        >
          All News <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      {/* Featured / latest */}
      {news.length > 0 && (
        <a
          href={news[0].link}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl bg-sm-navy/5 p-4 mb-3 hover:bg-sm-navy/8 transition-colors group"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Bell className="h-3.5 w-3.5 text-sm-gold" />
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                categoryColors[news[0].category] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {news[0].category}
            </span>
            <span className="text-[11px] text-sm-text-muted">{news[0].date}</span>
          </div>
          <h4 className="text-sm font-semibold text-sm-text group-hover:text-sm-navy transition-colors">
            {news[0].title}
          </h4>
          <p className="text-xs text-sm-text-muted mt-1 line-clamp-2">
            {news[0].summary}
          </p>
        </a>
      )}

      {/* Other news */}
      <div className="space-y-2">
        {news.slice(1).map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-sm-cream/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-sm-text truncate">
                {item.title}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    categoryColors[item.category] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.category}
                </span>
                <span className="text-[11px] text-sm-text-muted">{item.date}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
