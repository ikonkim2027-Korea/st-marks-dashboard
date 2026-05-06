"use client";

import { useEffect, useRef, useState } from "react";
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
  const railRef = useRef<HTMLUListElement | null>(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
  });

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

  function handlePointerDown(event: React.PointerEvent<HTMLUListElement>) {
    if (event.button !== 0) return;

    const rail = railRef.current;
    if (!rail) return;

    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: rail.scrollLeft,
    };
    rail.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLUListElement>) {
    const drag = dragRef.current;
    const rail = railRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId || !rail) return;

    const deltaX = event.clientX - drag.startX;
    if (Math.abs(deltaX) > 4) {
      drag.moved = true;
    }

    if (drag.moved) {
      event.preventDefault();
      rail.scrollLeft = drag.startScrollLeft - deltaX;
    }
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLUListElement>) {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (rail?.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }

    drag.active = false;
  }

  function handleClickCapture(event: React.MouseEvent<HTMLUListElement>) {
    if (!dragRef.current.moved) return;

    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  }

  function preventNativeDrag(event: React.DragEvent<HTMLUListElement>) {
    event.preventDefault();
  }

  return (
    <nav
      aria-label="Quick links"
      className="sticky top-14 z-40 border-b border-sm-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
    >
      <div className="mx-auto max-w-full px-4 sm:px-6 xl:px-10">
        <ul
          ref={railRef}
          className="-mx-1 flex cursor-grab touch-pan-y select-none items-start gap-1 overflow-x-auto px-1 py-2 active:cursor-grabbing [scrollbar-width:thin]"
          role="list"
          onClickCapture={handleClickCapture}
          onDragStart={preventNativeDrag}
          onPointerCancel={handlePointerEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
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
                      draggable={false}
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
                      className="focus-ring group flex w-[88px] touch-pan-y select-none flex-col items-center gap-1.5 rounded-xl px-1 py-1 transition-colors hover:bg-sm-cream/50 [-webkit-user-drag:none]"
                    >
                      <span
                        className="pointer-events-none flex h-11 w-11 items-center justify-center rounded-2xl bg-sm-navy/5 text-sm-navy ring-1 ring-inset ring-sm-navy/10 transition-all group-hover:bg-sm-navy group-hover:text-white group-hover:ring-sm-navy group-active:scale-95"
                        aria-hidden="true"
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <span className="pointer-events-none line-clamp-2 min-h-[24px] w-full break-words text-center text-[10px] font-medium leading-[1.2] text-sm-text-light group-hover:text-sm-navy">
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
