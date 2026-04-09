import Header from "@/components/Header";
import TodayOverview from "@/components/TodayOverview";
import WeatherWidget from "@/components/WeatherWidget";
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

      <main className="flex-1 mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-4">
        {/* Dashboard Grid — optimized for MacBook 1440x900 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Row 1: Hero (compact) + Weather side-by-side on lg */}
          <div className="col-span-full lg:col-span-2">
            <TodayOverview />
          </div>
          <div className="lg:col-span-1">
            <WeatherWidget />
          </div>

          {/* Row 2: Lunch + News + Athletics */}
          <LunchMenu />
          <SchoolNews />
          <Athletics />

          {/* Row 3: Calendar + Social + Lion's Corner */}
          <CalendarWidget />
          <SocialHub />
          <LionsCorner />

          {/* Row 4: Quick Links - Full Width */}
          <QuickLinks />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-4">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🦁</span>
              <div>
                <p className="text-sm font-semibold text-navy">SM Hub</p>
                <p className="text-[11px] text-text-muted">
                  St. Mark&apos;s School &middot; 25 Marlboro Road, Southborough,
                  MA 01772
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-text-muted">
              <a
                href="https://www.stmarksschool.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-navy transition-colors"
              >
                School Website
              </a>
              <span>&middot;</span>
              <a
                href="tel:5087866000"
                className="hover:text-navy transition-colors"
              >
                508.786.6000
              </a>
              <span>&middot;</span>
              <span>Made with pride by SM students</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
