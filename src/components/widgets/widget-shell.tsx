"use client";

import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export type WidgetAccent = "navy" | "gold" | "orange";

export type WidgetShellProps = {
  title: string;
  eyebrow?: string;
  accent?: WidgetAccent;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
  bodyClassName?: string;
  headerExtra?: React.ReactNode;
};

const accentBarClass: Record<WidgetAccent, string> = {
  navy: "bg-sm-navy",
  gold: "bg-sm-gold",
  orange: "bg-sm-orange",
};

export function WidgetShell({
  title,
  eyebrow,
  accent = "navy",
  href,
  hrefLabel,
  children,
  bodyClassName,
  headerExtra,
}: WidgetShellProps) {
  return (
    <article
      className={cn(
        "group/widget relative flex h-full w-full flex-col overflow-hidden",
        // Matches existing `.widget-card` from globals.css but composed in JSX
        // for consistency with the new shell primitives.
        "rounded-[10px] border border-sm-navy/10 bg-white transition-colors",
        "hover:border-sm-navy/25",
      )}
    >
      {/* The entire header is the drag handle — mirrors YISS UX. */}
      <header className="drag-handle relative flex items-start justify-between gap-2 pl-3 pr-3 pt-3.5 pb-2.5 select-none sm:pl-4 sm:pr-4">
        {/* Left accent bar in St. Mark's CI */}
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full",
            accentBarClass[accent],
          )}
        />
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <p className="label-micro truncate">{eyebrow}</p>
          )}
          <h3 className="truncate font-semibold leading-tight text-sm-navy text-[15px] tracking-tight">
            {title}
          </h3>
        </div>
        <div
          className="flex shrink-0 items-center gap-1.5 sm:gap-2"
          // Prevent drag when user clicks controls / external link inside the header.
          onPointerDown={(e) => e.stopPropagation()}
        >
          {headerExtra}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-transparent px-2 py-1 text-[11px] font-medium text-sm-text-muted transition-colors hover:border-sm-border hover:text-sm-navy"
            >
              {hrefLabel ?? "Open"}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </header>
      <div
        className={cn(
          "relative flex-1 overflow-auto px-3 pb-4 sm:px-4",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </article>
  );
}
