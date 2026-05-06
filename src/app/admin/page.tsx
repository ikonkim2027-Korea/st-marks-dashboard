import Link from "next/link";
import { Utensils, Hourglass, LinkIcon, ArrowRight } from "lucide-react";

const cards = [
  {
    href: "/admin/lunch",
    icon: Utensils,
    title: "Lunch Menu",
    blurb:
      "Edit Dining Hall and Lion's Den menus by day. Toggle vegetarian items.",
  },
  {
    href: "/admin/countdown",
    icon: Hourglass,
    title: "Countdown",
    blurb:
      "Manage milestones (last day, breaks, commencement). Past dates auto-hide.",
  },
  {
    href: "/admin/links",
    icon: LinkIcon,
    title: "Quick Links",
    blurb:
      "Add or remove links by category. Pick from a curated icon set.",
  },
];

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-sm-text">Dashboard Admin</h1>
        <p className="mt-1 text-[13px] text-sm-text-muted leading-relaxed">
          Pick what you want to update. Changes save immediately to the
          dashboard&apos;s data files.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group block rounded-lg border border-sm-border bg-white p-5 transition-colors hover:border-sm-navy/40"
            >
              <Icon
                className="h-6 w-6 text-sm-navy mb-3"
                aria-hidden="true"
              />
              <h2 className="text-[14px] font-bold text-sm-text mb-1 flex items-center gap-1.5">
                {c.title}
                <ArrowRight
                  className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  aria-hidden="true"
                />
              </h2>
              <p className="text-[11.5px] leading-relaxed text-sm-text-muted">
                {c.blurb}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
