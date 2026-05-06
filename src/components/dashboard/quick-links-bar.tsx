"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
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
        <div className="-mx-1 flex items-center gap-1 overflow-x-auto py-2 [scrollbar-width:thin]">
          {links === null
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 shrink-0 animate-pulse rounded-full bg-sm-cream"
                />
              ))
            : links.map((link) => {
                const Icon = resolveLinkIcon(link.icon);
                const isExternal = link.url.startsWith("http");
                return (
                  <a
                    key={`${link.categoryId}-${link.id}`}
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
                    className="focus-ring group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sm-border bg-white px-3 py-1.5 text-[11px] font-medium text-sm-text-light transition-colors hover:border-sm-navy/40 hover:text-sm-navy"
                  >
                    <Icon
                      className="h-3.5 w-3.5 text-sm-text-muted group-hover:text-sm-navy transition-colors"
                      aria-hidden="true"
                    />
                    <span className="whitespace-nowrap">{link.name}</span>
                    {isExternal && (
                      <ExternalLink
                        className="h-3 w-3 text-sm-text-muted/60 group-hover:text-sm-navy/70 transition-colors"
                        aria-hidden="true"
                      />
                    )}
                  </a>
                );
              })}
        </div>
      </div>
    </nav>
  );
}
