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
  FileText,
  Mail,
  Globe2,
  BookMarked,
  PartyPopper,
  School,
  Shield,
  ArrowUpRight,
  HeartHandshake,
  Bus,
  Phone,
  Cross,
  HelpCircle,
  Music,
  Trophy,
  Image as ImageIcon,
  PenTool,
  Stethoscope,
  Languages,
  Lock,
} from "lucide-react";
import { WidgetShell } from "./widget-shell";

interface LinkItem {
  name: string;
  url: string;
  icon: React.ReactNode;
  category: string;
  hint?: string;
}

const ICON = "h-4 w-4";

const links: LinkItem[] = [
  // Academic
  { name: "Canvas LMS", url: "https://stmarksschool.instructure.com", icon: <BookOpen className={ICON} />, category: "Academic", hint: "Coursework" },
  { name: "Blackbaud Portal", url: "https://www.stmarksschool.org/login", icon: <Lock className={ICON} />, category: "Academic", hint: "Grades · forms" },
  { name: "College Counseling", url: "https://www.stmarksschool.org/academics/college-counseling", icon: <GraduationCap className={ICON} />, category: "Academic" },
  { name: "Library", url: "https://www.stmarksschool.org/academics/library", icon: <BookMarked className={ICON} />, category: "Academic" },
  { name: "Academic Support", url: "https://www.stmarksschool.org/academics/learning-services", icon: <PenTool className={ICON} />, category: "Academic", hint: "Learning services" },
  { name: "Course Catalog", url: "https://www.stmarksschool.org/academics/curriculum", icon: <FileText className={ICON} />, category: "Academic" },

  // Campus Life
  { name: "Orah Sign-Out", url: "https://www.stmarksschool.org/community/residential-life/orah", icon: <MapPin className={ICON} />, category: "Campus" },
  { name: "FLIK Dining", url: "https://sms.flikisdining.com/", icon: <Utensils className={ICON} />, category: "Campus" },
  { name: "Weekend Activities", url: "https://www.stmarksschool.org/community/student-life/weekend-activities", icon: <PartyPopper className={ICON} />, category: "Campus" },
  { name: "Student Handbook", url: "https://www.stmarksschool.org/community/student-life/student-handbook", icon: <FileText className={ICON} />, category: "Campus" },
  { name: "Residential Life", url: "https://www.stmarksschool.org/community/residential-life", icon: <School className={ICON} />, category: "Campus" },
  { name: "Chapel", url: "https://www.stmarksschool.org/community/student-life/chapel", icon: <Cross className={ICON} />, category: "Campus" },

  // Health & Wellness
  { name: "Health Services", url: "https://www.stmarksschool.org/community/health-services-and-wellness/health-and-counseling-services", icon: <Stethoscope className={ICON} />, category: "Health" },
  { name: "Counseling", url: "https://www.stmarksschool.org/community/health-services-and-wellness/health-and-counseling-services", icon: <Heart className={ICON} />, category: "Health" },
  { name: "Crisis Text Line", url: "sms:741741?body=HOME", icon: <Phone className={ICON} />, category: "Health", hint: "Text HOME to 741741" },
  { name: "988 Lifeline", url: "tel:988", icon: <HeartHandshake className={ICON} />, category: "Health", hint: "Call or text 988" },

  // International
  { name: "International Students", url: "https://www.stmarksschool.org/admission/international-students", icon: <Globe2 className={ICON} />, category: "International" },
  { name: "Google Translate", url: "https://translate.google.com", icon: <Languages className={ICON} />, category: "International" },
  { name: "Korean Consulate (Boston)", url: "https://overseas.mofa.go.kr/us-boston-en/index.do", icon: <Globe2 className={ICON} />, category: "International", hint: "Passport · visa" },
  { name: "Logan Airport", url: "https://www.massport.com/logan-airport/", icon: <Globe2 className={ICON} />, category: "International" },

  // Transportation
  { name: "MBTA Worcester Line", url: "https://www.mbta.com/schedules/CR-Worcester", icon: <Bus className={ICON} />, category: "Transit" },
  { name: "Uber", url: "https://m.uber.com/", icon: <Bus className={ICON} />, category: "Transit" },
  { name: "Lyft", url: "https://ride.lyft.com/", icon: <Bus className={ICON} />, category: "Transit" },
  { name: "Hourly Weather", url: "https://forecast.weather.gov/MapClick.php?lat=42.3056&lon=-71.5245", icon: <Globe2 className={ICON} />, category: "Transit" },

  // Resources
  { name: "Gmail", url: "https://mail.google.com/a/stmarksschool.org", icon: <Mail className={ICON} />, category: "Resources" },
  { name: "Google Drive", url: "https://drive.google.com/a/stmarksschool.org", icon: <FileText className={ICON} />, category: "Resources" },
  { name: "School Store", url: "https://www.stmarksschool.org/community/school-store", icon: <ShoppingBag className={ICON} />, category: "Resources" },
  { name: "SmugMug Photos", url: "https://stmarkslions.smugmug.com/", icon: <ImageIcon className={ICON} />, category: "Resources" },
  { name: "Athletics Page", url: "https://www.stmarksschool.org/athletics", icon: <Trophy className={ICON} />, category: "Resources" },
  { name: "Performing Arts", url: "https://www.stmarksschool.org/academics/arts", icon: <Music className={ICON} />, category: "Resources" },

  // Tools & Contacts
  { name: "School Calendar", url: "https://www.stmarksschool.org/about/calendar", icon: <CalendarDays className={ICON} />, category: "Tools" },
  { name: "Parent Portal", url: "https://www.stmarksschool.org/parents", icon: <Users className={ICON} />, category: "Tools" },
  { name: "Offices & Depts", url: "https://www.stmarksschool.org/about/offices-and-departments", icon: <Shield className={ICON} />, category: "Tools" },
  { name: "IT Help Desk", url: "mailto:helpdesk@stmarksschool.org", icon: <HelpCircle className={ICON} />, category: "Tools", hint: "Tech support" },
  { name: "Main Office", url: "tel:5087866000", icon: <Phone className={ICON} />, category: "Tools", hint: "508.786.6000" },
];

const CATEGORIES = [
  "Academic",
  "Campus",
  "Health",
  "International",
  "Transit",
  "Resources",
  "Tools",
];

export function QuickLinksWidget() {
  return (
    <WidgetShell
      title="Quick Links"
      eyebrow="INDEX"
      accent="navy"
      href="https://www.stmarksschool.org"
      hrefLabel="Website"
    >
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 pt-1 sm:gap-x-4">
        {CATEGORIES.map((cat) => {
          const catLinks = links.filter((l) => l.category === cat);
          if (catLinks.length === 0) return null;
          return (
            <section key={cat} className="min-w-0" aria-label={cat}>
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-sm-border/60">
                <span
                  className="text-[9px] font-bold text-sm-gold"
                  aria-hidden="true"
                >
                  ●
                </span>
                <h4 className="text-[9px] font-bold text-sm-navy uppercase tracking-[0.2em] truncate">
                  {cat}
                </h4>
              </div>
              <ul className="space-y-0.5">
                {catLinks.map((link) => {
                  const isExternal = link.url.startsWith("http");
                  return (
                    <li key={link.name} className="min-w-0">
                      <a
                        href={link.url}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        title={link.hint || link.name}
                        className="focus-ring group flex min-w-0 items-center gap-2 py-1.5 rounded-sm text-sm-text hover:text-sm-navy transition-colors"
                        onMouseDown={(e) => e.stopPropagation()}
                        aria-label={
                          isExternal
                            ? `${link.name} (opens in new tab)`
                            : link.name
                        }
                      >
                        <span
                          className="shrink-0 text-sm-text-muted group-hover:text-sm-navy transition-colors"
                          aria-hidden="true"
                        >
                          {link.icon}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[11px] font-medium">
                          {link.name}
                        </span>
                        {isExternal && (
                          <ArrowUpRight
                            className="h-3 w-3 text-sm-text-muted opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex-shrink-0"
                            aria-hidden="true"
                          />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </WidgetShell>
  );
}
