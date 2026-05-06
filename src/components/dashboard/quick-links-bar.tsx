"use client";

import { useEffect, useState } from "react";
import { resolveLinkIcon } from "@/lib/link-icons";

interface LinkItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  hint?: string;
}

interface LinkCategory {
  id: string;
  label: string;
  links: LinkItem[];
}

interface FlatLink extends LinkItem {
  category: string;
  categoryId: string;
}

function flatten(categories: LinkCategory[]): FlatLink[] {
  const out: FlatLink[] = [];
  for (const cat of categories) {
    for (const l of cat.links) {
      out.push({ ...l, category: cat.label, categoryId: cat.id });
    }
  }
  return out;
}

export function QuickLinksBar() {
  const [links, setLinks] = useState<FlatLink[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/links")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { categories: LinkCategory[] }) => {
        if (!cancelled) setLinks(flatten(data.categories || []));
      })
      .catch(() => {
        if (!cancelled) setLinks([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <nav
      aria-label="Quick links"
      className="sticky top-14 z-40 border-b border-sm-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
    >
      <div className="mx-auto max-w-full px-4 sm:px-6 xl:px-10">
        <ul
          className="-mx-1 flex items-start gap-1 overflow-x-auto px-1 py-2 [scrollbar-width:thin]"
          role="list"
        >
          {links === null
            ? Array.from({ length: 10 }).map((_, i) => (
                <li key={i} className="shrink-0">
                  <div className="flex w-[88px] flex-col items-center gap-1.5 px-1 py-1">
                    <div className="h-11 w-11 animate-pulse rounded-2xl bg-sm-cream" />
                    <div className="h-2 w-14 animate-pulse rounded bg-sm-cream" />
                  </div>
                </li>
              ))
            : links.map((link) => {
                const Icon = resolveLinkIcon(link.icon);
                const isExternal = link.url.startsWith("http");
                return (
                  <li key={`${link.categoryId}-${link.id}`} className="shrink-0">
                    <a
                      href={link.url}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      title={
                        link.hint ? `${link.name} — ${link.hint}` : link.name
                      }
                      aria-label={
                        isExternal
                          ? `${link.name} — ${link.category} (opens in new tab)`
                          : `${link.name} — ${link.category}`
                      }
                      className="focus-ring group flex w-[88px] flex-col items-center gap-1.5 rounded-xl px-1 py-1 transition-colors hover:bg-sm-cream/50"
                    >
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sm-navy/5 text-sm-navy ring-1 ring-inset ring-sm-navy/10 transition-all group-hover:bg-sm-navy group-hover:text-white group-hover:ring-sm-navy group-active:scale-95"
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <span className="line-clamp-2 min-h-[24px] w-full break-words text-center text-[10px] font-medium leading-[1.2] text-sm-text-light group-hover:text-sm-navy">
                        {link.name}
                      </span>
                    </a>
                  </li>
                );
              })}
        </ul>
      </div>
    </nav>
  );
}
