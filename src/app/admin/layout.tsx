import type { ReactNode } from "react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { ADMIN_EMAILS } from "@/auth.config";
import { LogOut, Utensils, Hourglass, LinkIcon } from "lucide-react";

export const metadata = {
  title: "Admin · SM Hub",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin/lunch", label: "Lunch Menu", icon: Utensils },
  { href: "/admin/countdown", label: "Countdown", icon: Hourglass },
  { href: "/admin/links", label: "Quick Links", icon: LinkIcon },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  const authorized = !!email && ADMIN_EMAILS.has(email);

  // The login page renders inside this layout but without the chrome —
  // it'll early-return below.
  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sm-offwhite px-4">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-sm-offwhite">
      <header className="bg-sm-navy border-b-[2px] border-sm-gold sticky top-0 z-30">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/admin"
            className="text-white text-[13px] font-bold uppercase tracking-[0.18em]"
          >
            SM Hub <span className="text-sm-gold">·</span> Admin
          </Link>
          <div className="flex items-center gap-3 text-[11px] text-white/80">
            <Link
              href="/"
              className="rounded-md px-2 py-1 hover:bg-white/10 hover:text-white transition-colors uppercase tracking-wide"
            >
              View Site
            </Link>
            <span className="hidden sm:inline">{email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-md border border-white/20 px-2.5 py-1 hover:bg-white/10 hover:text-white transition-colors uppercase tracking-wide"
                aria-label="Sign out"
              >
                <LogOut className="h-3 w-3" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row">
        <aside className="md:w-56 md:flex-shrink-0">
          <nav className="rounded-lg border border-sm-border bg-white p-2">
            <ul className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[12px] font-medium text-sm-text hover:bg-sm-cream hover:text-sm-navy transition-colors"
                    >
                      <Icon
                        className="h-4 w-4 text-sm-text-muted"
                        aria-hidden="true"
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <p className="mt-3 px-2 text-[10px] leading-relaxed text-sm-text-muted">
            Edits save immediately to{" "}
            <code className="rounded bg-sm-cream px-1 py-0.5 text-[9px]">
              .data/*.json
            </code>{" "}
            and the public dashboard reads from the same files. Commit the
            files to git when you want to publish.
          </p>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
