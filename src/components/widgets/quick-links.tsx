"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { resolveLinkIcon } from "@/lib/link-icons";
import { WidgetShell } from "./widget-shell";

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

export function QuickLinksWidget() {
  const [categories, setCategories] = useState<LinkCategory[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/links");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { categories: LinkCategory[] };
        if (!cancelled) setCategories(data.categories || []);
      } catch {
        if (!cancelled) setError(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <WidgetShell
      title="Quick Links"
      eyebrow="INDEX"
      accent="navy"
      href="https://www.stmarksschool.org"
      hrefLabel="Website"
    >
      {error ? (
        <p className="text-xs text-sm-text-muted">
          Couldn&apos;t load links.
        </p>
      ) : categories === null ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 pt-1 sm:gap-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-sm-cream" />
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="h-3 w-3/4 animate-pulse rounded bg-sm-cream"
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 pt-1 sm:gap-x-4">
          {categories.map((cat) => (
            <section key={cat.id} className="min-w-0" aria-label={cat.label}>
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-sm-border/60">
                <span
                  className="text-[9px] font-bold text-sm-gold"
                  aria-hidden="true"
                >
                  ●
                </span>
                <h4 className="text-[9px] font-bold text-sm-navy uppercase tracking-[0.2em] truncate">
                  {cat.label}
                </h4>
              </div>
              <ul className="space-y-0.5">
                {cat.links.map((link) => {
                  const Icon = resolveLinkIcon(link.icon);
                  const isExternal = link.url.startsWith("http");
                  return (
                    <li key={link.id} className="min-w-0">
                      <a
                        href={link.url}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        title={link.hint || link.name}
                        className="focus-ring group flex min-w-0 items-center gap-2 py-1.5 rounded-sm text-sm-text hover:text-sm-navy transition-colors"
                        onMouseDown={(e) => e.stopPropagation()}
                        aria-label={
                          isExternal
                            ? `${link.name} (opens in new tab)`
                            : link.name
                        }
                      >
                        <span
                          className="shrink-0 text-sm-text-muted group-hover:text-sm-navy transition-colors"
                          aria-hidden="true"
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[11px] font-medium">
                          {link.name}
                        </span>
                        {isExternal && (
                          <ArrowUpRight
                            className="h-3 w-3 text-sm-text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex-shrink-0"
                            aria-hidden="true"
                          />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </WidgetShell>
  );
}
