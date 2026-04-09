"use client";

import { useState } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { name: "Dashboard", href: "#" },
  { name: "Athletics", href: "#athletics" },
  { name: "Calendar", href: "#calendar" },
  { name: "Links", href: "#links" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-sm-navy sticky top-0 z-50">
      <div className="mx-auto max-w-full px-8 xl:px-10">
        <div className="flex h-14 items-center justify-between">
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

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-white/80 hover:bg-white/10 md:hidden"
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
          </nav>
        )}
      </div>
    </header>
  );
}
