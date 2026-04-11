import Image from "next/image";
import Header from "@/components/Header";
import TodayOverview from "@/components/TodayOverview";
import WeatherWidget from "@/components/WeatherWidget";
import CanvasAssignments from "@/components/CanvasAssignments";
import LunchMenu from "@/components/LunchMenu";
import Athletics from "@/components/Athletics";
import SchoolNews from "@/components/SchoolNews";
import CalendarWidget from "@/components/CalendarWidget";
import QuickLinks from "@/components/QuickLinks";
import SocialHub from "@/components/SocialHub";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-full px-6 xl:px-10 py-5">
        {/* 12-col Bento Grid — optimized for MacBook 1440x900 */}
        <div className="grid grid-cols-12 gap-3 auto-rows-min">
          {/* Row 1 — Hero strip (full width) */}
          <div className="col-span-12">
            <TodayOverview />
          </div>

          {/* Row 2 — Canvas (5) + Weather (3) + News (4) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <CanvasAssignments />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <WeatherWidget />
          </div>
          <div className="col-span-12 md:col-span-12 lg:col-span-4 lg:row-span-2">
            <SchoolNews />
          </div>

          {/* Row 3 — Athletics (5) + Lunch (3) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <Athletics />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <LunchMenu />
          </div>

          {/* Row 4 — Calendar (8) + Social (4) */}
          <div className="col-span-12 md:col-span-12 lg:col-span-8">
            <CalendarWidget />
          </div>
          <div className="col-span-12 md:col-span-12 lg:col-span-4">
            <SocialHub />
          </div>

          {/* Row 5 — Quick Links full width */}
          <div className="col-span-12">
            <QuickLinks />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-6 border-t border-sm-border bg-white">
        <div className="mx-auto max-w-full px-6 xl:px-10 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/sm-logo.svg"
                alt="St. Mark's School"
                width={120}
                height={21}
                className="h-5 w-auto opacity-70"
              />
              <div className="h-8 w-px bg-sm-border" />
              <div>
                <p className="label-micro mb-0.5">Student Dashboard</p>
                <p className="text-[10px] text-sm-text-muted">
                  25 Marlboro Road · Southborough, MA 01772 · 508.786.6000
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] text-sm-text-muted">
              <a
                href="https://www.stmarksschool.org"
                target="_blank"
                rel="noopener noreferrer"
                className="uppercase tracking-[0.15em] hover:text-sm-navy transition-colors"
              >
                School Website
              </a>
              <span className="h-3 w-px bg-sm-border" />
              <div className="text-right">
                <p className="uppercase tracking-[0.15em]">
                  Developed by{" "}
                  <span className="font-semibold text-sm-text-light">
                    Ikon Kim
                  </span>
                </p>
                <a
                  href="mailto:ikonkim@stmarksschool.org"
                  className="hover:text-sm-navy transition-colors"
                >
                  ikonkim@stmarksschool.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
