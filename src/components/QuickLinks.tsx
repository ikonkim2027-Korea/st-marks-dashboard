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
  BookMarked,
  PartyPopper,
  School,
  Shield,
  ArrowUpRight,
} from "lucide-react";

interface LinkItem {
  name: string;
  url: string;
  icon: React.ReactNode;
  category: string;
}

const links: LinkItem[] = [
  // Academic
  {
    name: "Canvas LMS",
    url: "https://stmarksschool.instructure.com",
    icon: <BookOpen className="h-4 w-4" />,
    category: "Academic",
  },
  {
    name: "Blackbaud Portal",
    url: "https://www.stmarksschool.org/login",
    icon: <GraduationCap className="h-4 w-4" />,
    category: "Academic",
  },
  {
    name: "College Counseling",
    url: "https://www.stmarksschool.org/academics/college-counseling",
    icon: <School className="h-4 w-4" />,
    category: "Academic",
  },
  {
    name: "Library",
    url: "https://www.stmarksschool.org/academics/library",
    icon: <BookMarked className="h-4 w-4" />,
    category: "Academic",
  },

  // Campus
  {
    name: "Orah (Sign Out)",
    url: "https://www.stmarksschool.org/community/residential-life/orah",
    icon: <MapPin className="h-4 w-4" />,
    category: "Campus",
  },
  {
    name: "FLIK Dining",
    url: "https://sms.flikisdining.com/",
    icon: <Utensils className="h-4 w-4" />,
    category: "Campus",
  },
  {
    name: "Weekend Activities",
    url: "https://www.stmarksschool.org/community/student-life/weekend-activities",
    icon: <PartyPopper className="h-4 w-4" />,
    category: "Campus",
  },
  {
    name: "Student Handbook",
    url: "https://www.stmarksschool.org/community/student-life/student-handbook",
    icon: <FileText className="h-4 w-4" />,
    category: "Campus",
  },

  // Resources
  {
    name: "School Store",
    url: "https://www.stmarksschool.org/community/school-store",
    icon: <ShoppingBag className="h-4 w-4" />,
    category: "Resources",
  },
  {
    name: "Gmail",
    url: "https://mail.google.com/a/stmarksschool.org",
    icon: <Mail className="h-4 w-4" />,
    category: "Resources",
  },
  {
    name: "Athletics",
    url: "https://www.stmarksschool.org/athletics",
    icon: <Tv className="h-4 w-4" />,
    category: "Resources",
  },
  {
    name: "SmugMug Photos",
    url: "https://stmarkslions.smugmug.com/",
    icon: <Printer className="h-4 w-4" />,
    category: "Resources",
  },

  // Tools
  {
    name: "Essential Dates",
    url: "https://www.stmarksschool.org/about/calendar",
    icon: <CalendarDays className="h-4 w-4" />,
    category: "Tools",
  },
  {
    name: "Parent Portal",
    url: "https://www.stmarksschool.org/parents",
    icon: <Users className="h-4 w-4" />,
    category: "Tools",
  },
  {
    name: "Offices & Depts",
    url: "https://www.stmarksschool.org/about/offices-and-departments",
    icon: <Shield className="h-4 w-4" />,
    category: "Tools",
  },
  {
    name: "Health Services",
    url: "https://www.stmarksschool.org/community/health-services-and-wellness/health-and-counseling-services",
    icon: <Heart className="h-4 w-4" />,
    category: "Tools",
  },
];

const categories = ["Academic", "Campus", "Resources", "Tools"];

export default function QuickLinks() {
  return (
    <div className="widget-card p-6" id="links">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="divider-gold" />
          <span className="label-micro">Quick Links Index</span>
        </div>
        <a
          href="https://www.stmarksschool.org"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-sm-navy hover:text-sm-navy-light transition-colors"
        >
          School Website
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
        {categories.map((cat) => {
          const catLinks = links.filter((l) => l.category === cat);
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-sm-border/60">
                <span className="text-[9px] font-bold text-sm-gold">●</span>
                <h4 className="text-[10px] font-bold text-sm-navy uppercase tracking-[0.2em]">
                  {cat}
                </h4>
              </div>
              <ul className="space-y-1">
                {catLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 py-1.5 text-sm-text hover:text-sm-navy transition-colors"
                    >
                      <span className="text-sm-text-muted group-hover:text-sm-navy transition-colors">
                        {link.icon}
                      </span>
                      <span className="text-[12px] font-medium flex-1 truncate">
                        {link.name}
                      </span>
                      <ArrowUpRight className="h-3 w-3 text-sm-text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex-shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
