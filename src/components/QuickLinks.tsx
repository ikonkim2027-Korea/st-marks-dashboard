"use client";

import {
  BookOpen,
  GraduationCap,
  ShoppingBag,
  CalendarDays,
  Heart,
  Utensils,
  Users,
  MapPin,
  Tv,
  FileText,
  Mail,
  Printer,
  Wifi,
  BookMarked,
  PartyPopper,
  School,
  Shield,
  ExternalLink,
} from "lucide-react";

interface LinkItem {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  category: string;
}

const links: LinkItem[] = [
  // Academic & Learning
  {
    name: "Canvas LMS",
    url: "https://stmarks.instructure.com",
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-red-50 text-red-600",
    category: "Academic",
  },
  {
    name: "Blackbaud (Grades)",
    url: "https://stmarksschool.myschoolapp.com",
    icon: <GraduationCap className="h-5 w-5" />,
    color: "bg-blue-50 text-blue-600",
    category: "Academic",
  },
  {
    name: "College Counseling",
    url: "https://blogs.stmarksschool.org/collegecounseling/",
    icon: <School className="h-5 w-5" />,
    color: "bg-indigo-50 text-indigo-600",
    category: "Academic",
  },
  {
    name: "Library",
    url: "https://www.stmarksschool.org/academics/library",
    icon: <BookMarked className="h-5 w-5" />,
    color: "bg-amber-50 text-amber-700",
    category: "Academic",
  },

  // Campus Life
  {
    name: "Orah (Sign Out)",
    url: "https://www.stmarksschool.org/campus-life/residential-life/boardingware",
    icon: <MapPin className="h-5 w-5" />,
    color: "bg-green-50 text-green-600",
    category: "Campus",
  },
  {
    name: "FLIK Dining Menu",
    url: "https://sms.flikisdining.com/",
    icon: <Utensils className="h-5 w-5" />,
    color: "bg-orange-50 text-orange-600",
    category: "Campus",
  },
  {
    name: "Weekend Activities",
    url: "https://www.stmarksschool.org/community/student-life/weekend-activities",
    icon: <PartyPopper className="h-5 w-5" />,
    color: "bg-pink-50 text-pink-600",
    category: "Campus",
  },
  {
    name: "Health Services",
    url: "https://www.stmarksschool.org/community/student-life/student-handbook",
    icon: <Heart className="h-5 w-5" />,
    color: "bg-rose-50 text-rose-600",
    category: "Campus",
  },

  // Resources
  {
    name: "School Store",
    url: "https://www.stmarksschool.org/community/school-store",
    icon: <ShoppingBag className="h-5 w-5" />,
    color: "bg-purple-50 text-purple-600",
    category: "Resources",
  },
  {
    name: "School Email",
    url: "https://mail.google.com/a/stmarksschool.org",
    icon: <Mail className="h-5 w-5" />,
    color: "bg-sky-50 text-sky-600",
    category: "Resources",
  },
  {
    name: "Athletics Livestream",
    url: "https://www.stmarksschool.org/athletics",
    icon: <Tv className="h-5 w-5" />,
    color: "bg-navy/5 text-navy",
    category: "Resources",
  },
  {
    name: "Student Handbook",
    url: "https://www.stmarksschool.org/community/student-life/student-handbook",
    icon: <FileText className="h-5 w-5" />,
    color: "bg-gray-100 text-gray-600",
    category: "Resources",
  },

  // Tools
  {
    name: "Print (PaperCut)",
    url: "https://print.stmarksschool.org",
    icon: <Printer className="h-5 w-5" />,
    color: "bg-teal-50 text-teal-600",
    category: "Tools",
  },
  {
    name: "WiFi Help",
    url: "https://helpdesk.stmarksschool.org",
    icon: <Wifi className="h-5 w-5" />,
    color: "bg-cyan-50 text-cyan-600",
    category: "Tools",
  },
  {
    name: "Essential Dates",
    url: "https://www.stmarksschool.org/about/calendar",
    icon: <CalendarDays className="h-5 w-5" />,
    color: "bg-gold/10 text-gold",
    category: "Tools",
  },
  {
    name: "Parent Portal",
    url: "https://www.stmarksschool.org/parents",
    icon: <Users className="h-5 w-5" />,
    color: "bg-emerald-50 text-emerald-600",
    category: "Tools",
  },
  {
    name: "IT Help Desk",
    url: "https://helpdesk.stmarksschool.org",
    icon: <Shield className="h-5 w-5" />,
    color: "bg-slate-100 text-slate-600",
    category: "Tools",
  },
];

const categories = ["Academic", "Campus", "Resources", "Tools"];

export default function QuickLinks() {
  return (
    <div className="widget-card p-5 col-span-full" id="links">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ExternalLink className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-semibold text-text-secondary">
            Quick Links
          </h3>
        </div>
        <a
          href="https://www.stmarksschool.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-navy hover:text-navy-light transition-colors"
        >
          School Website <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {categories.map((cat) => {
        const catLinks = links.filter((l) => l.category === cat);
        return (
          <div key={cat} className="mb-4 last:mb-0">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              {cat}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {catLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-xl bg-cream/50 px-3 py-2.5 transition-all hover:bg-cream hover:shadow-sm group"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${link.color} flex-shrink-0`}
                  >
                    {link.icon}
                  </div>
                  <span className="text-xs font-medium text-text-primary group-hover:text-navy truncate">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
