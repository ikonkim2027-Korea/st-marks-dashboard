"use client";

import Image from "next/image";
import { DashboardHeader } from "./header";
import { HeroBanner } from "./hero-banner";
import { QuickLinksBar } from "./quick-links-bar";
import { DashboardGrid } from "./grid";

/**
 * Full-page shell. Assembles header + hero + drag-swap grid + footer.
 * `page.tsx` renders `<DashboardShell />` and nothing else.
 *
 * The footer (address + developer credit) is moved out of `page.tsx` into
 * the shell so the entry page stays minimal, per the Stage 1 contract.
 */
export function DashboardShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1">
        <HeroBanner />
        <QuickLinksBar />
        <DashboardGrid />
      </main>
      <DashboardFooter />
    </div>
  );
}

function DashboardFooter() {
  return (
    <footer className="mt-6 border-t border-sm-border bg-white">
      <div className="mx-auto max-w-full px-4 py-6 sm:px-6 xl:px-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Image
              src="/sm-logo.svg"
              alt="St. Mark's School"
              width={120}
              height={21}
              className="h-5 w-auto shrink-0 opacity-70"
            />
            <div className="hidden h-8 w-px shrink-0 bg-sm-border sm:block" />
            <div className="min-w-0">
              <p className="label-micro mb-0.5">Student Dashboard</p>
              <p className="text-[10px] leading-snug text-sm-text-muted">
                25 Marlboro Road · Southborough, MA 01772 · 508.786.6000
              </p>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 text-[10px] text-sm-text-muted md:w-auto md:gap-4">
            <a
              href="https://www.stmarksschool.org"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-sm uppercase tracking-[0.15em] hover:text-sm-navy transition-colors"
            >
              School Website
            </a>
            <span className="hidden h-3 w-px bg-sm-border sm:block" aria-hidden="true" />
            <div className="md:text-right">
              <p className="uppercase tracking-[0.15em]">
                Developed by{" "}
                <span className="font-semibold text-sm-text-light">
                  Ikon Kim
                </span>
              </p>
              <a
                href="mailto:ikonkim@stmarksschool.org"
                className="focus-ring rounded-sm break-all hover:text-sm-navy transition-colors"
              >
                ikonkim@stmarksschool.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
