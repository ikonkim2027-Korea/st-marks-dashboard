"use client";

import { GripVertical, ExternalLink } from "lucide-react";
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
      <header className="drag-handle relative flex items-start justify-between gap-3 px-4 pt-3.5 pb-2.5 select-none">
        {/* Left accent bar in St. Mark's CI */}
        <span
          aria-hidden
          className={cn(
            "absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full",
            accentBarClass[accent],
          )}
        />
        <div className="flex min-w-0 items-start gap-2 pl-3">
          <div
            aria-hidden
            className={cn(
              "mt-0.5 -ml-1 rounded px-0.5 py-0.5 text-sm-text-muted",
              "opacity-0 transition-opacity",
              "group-hover/widget:opacity-70",
            )}
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            {eyebrow && (
              <p className="label-micro">{eyebrow}</p>
            )}
            <h3 className="font-semibold leading-tight text-sm-navy text-[15px] tracking-tight">
              {title}
            </h3>
          </div>
        </div>
        <div
          className="flex items-center gap-2"
          // Prevent drag when user clicks controls / external link inside the header.
          onPointerDown={(e) => e.stopPropagation()}
        >
          {headerExtra}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-1 text-[11px] font-medium text-sm-text-muted transition-colors hover:border-sm-border hover:text-sm-navy"
            >
              {hrefLabel ?? "Open"}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </header>
      <div
        className={cn(
          "relative flex-1 overflow-auto px-4 pb-4",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </article>
  );
}
