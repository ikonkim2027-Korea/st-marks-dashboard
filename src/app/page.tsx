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
import LionsCorner from "@/components/LionsCorner";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-full px-8 xl:px-10 py-4">
        {/* Dashboard Grid — optimized for MacBook 1440x900 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Row 1: Hero (compact) + Weather side-by-side on lg */}
          <div className="col-span-full lg:col-span-2">
            <TodayOverview />
          </div>
          <div className="lg:col-span-1">
            <WeatherWidget />
          </div>

          {/* Row 2: Canvas Assignments + News + Athletics */}
          <CanvasAssignments />
          <SchoolNews />
          <Athletics />

          {/* Row 3: Lunch + Calendar + Social */}
          <LunchMenu />

          <CalendarWidget />
          <SocialHub />

          {/* Row 4: Lion's Corner spans into Quick Links row */}
          <LionsCorner />

          {/* Row 4: Quick Links - Full Width */}
          <QuickLinks />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-sm-border bg-white py-4">
        <div className="mx-auto max-w-full px-8 xl:px-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🦁</span>
              <div>
                <p className="text-sm font-semibold text-sm-navy">SM Hub</p>
                <p className="text-[11px] text-sm-text-muted">
                  St. Mark&apos;s School &middot; 25 Marlboro Road, Southborough,
                  MA 01772
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-4 text-xs text-sm-text-muted">
                <a
                  href="https://www.stmarksschool.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sm-navy transition-colors"
                >
                  School Website
                </a>
                <span>&middot;</span>
                <span>508.786.6000</span>
              </div>
              <p className="text-[10px] text-sm-text-muted">
                Developed by{" "}
                <span className="font-medium text-sm-text-light">Ikon Kim</span>
                {" "}&middot;{" "}
                <a
                  href="mailto:ikonkim@stmarksschool.org"
                  className="hover:text-sm-navy transition-colors underline underline-offset-2"
                >
                  ikonkim@stmarksschool.org
                </a>
                {" "}for questions, issues &amp; suggestions
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
