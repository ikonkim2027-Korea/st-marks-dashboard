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
          <a href="#" className="flex items-center gap-3">
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
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="rounded-md px-2.5 py-1.5 text-[12px] font-medium text-white/75 tracking-wide uppercase transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://www.stmarksschool.org"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1.5 flex items-center gap-1 rounded-md border border-white/20 px-2.5 py-1.5 text-[12px] font-medium text-white/75 tracking-wide uppercase transition-colors hover:bg-white/10 hover:text-white"
            >
              SMS.org
              <ExternalLink className="h-3 w-3" />
            </a>
          </nav>

          {/* Right-side controls */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={handleResetLayout}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-transparent px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-white/75 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Reset dashboard layout"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-white/80 hover:bg-white/10 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="border-t border-white/10 pb-3 pt-2 md:hidden">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://www.stmarksschool.org"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              <span>SMS.org</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
            <div className="mt-2 border-t border-white/10 px-3 pt-3">
              <button
                onClick={() => {
                  handleResetLayout();
                  setMobileOpen(false);
                }}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-white/20 bg-transparent px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white/85 transition-colors hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Layout
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
