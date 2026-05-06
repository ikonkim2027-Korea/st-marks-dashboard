"use client";

import { useState } from "react";
import { Menu, X, ExternalLink, RotateCcw } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { name: "Dashboard", href: "#" },
  { name: "Athletics", href: "#athletics" },
  { name: "Calendar", href: "#calendar" },
  { name: "Links", href: "#links" },
];

export function DashboardHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleResetLayout = () => {
    (window as unknown as { __stmarksReset?: () => void }).__stmarksReset?.();
  };

  return (
    <header className="bg-sm-navy sticky top-0 z-50 border-b-[2px] border-sm-gold">
      <div className="mx-auto max-w-full px-4 sm:px-6 xl:px-10">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#"
            className="focus-ring-invert flex items-center gap-3 rounded-md"
            aria-label="St. Mark's School — return to top"
          >
            <Image
              src="/sm-logo.svg"
              alt="St. Mark's School"
              width={160}
              height={28}
              className="h-7 w-auto brightness-0 invert"
              priority
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Primary">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="focus-ring-invert rounded-md px-2.5 py-1.5 text-[12px] font-medium text-white/75 tracking-wide uppercase transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://www.stmarksschool.org"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring-invert ml-1.5 flex items-center gap-1 rounded-md border border-white/20 px-2.5 py-1.5 text-[12px] font-medium text-white/75 tracking-wide uppercase transition-colors hover:bg-white/10 hover:text-white"
            >
              SMS.org
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </nav>

          {/* Right-side controls */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handleResetLayout}
              className="focus-ring-invert inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-transparent px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-white/75 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Reset dashboard widget layout to default"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Reset
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="focus-ring-invert rounded-md p-2 text-white/80 hover:bg-white/10 md:hidden min-h-[40px] min-w-[40px] inline-flex items-center justify-center"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav
            className="border-t border-white/10 pb-3 pt-2 md:hidden"
            aria-label="Mobile"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="focus-ring-invert block rounded-md px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white min-h-[40px]"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://www.stmarksschool.org"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="focus-ring-invert flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white min-h-[40px]"
            >
              <span>SMS.org</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
            </a>
            <div className="mt-2 border-t border-white/10 px-3 pt-3">
              <button
                onClick={() => {
                  handleResetLayout();
                  setMobileOpen(false);
                }}
                className="focus-ring-invert inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-md border border-white/20 bg-transparent px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Reset dashboard widget layout to default"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset Layout
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
