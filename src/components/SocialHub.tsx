"use client";

import { ExternalLink } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
  handle: string;
  icon: string;
  color: string;
  hoverColor: string;
}

const socials: SocialLink[] = [
  {
    platform: "Instagram",
    url: "https://www.instagram.com/stmarksschool/",
    handle: "@stmarksschool",
    icon: "📸",
    color: "bg-gradient-to-br from-purple-50 to-pink-50",
    hoverColor: "hover:from-purple-100 hover:to-pink-100",
  },
  {
    platform: "Facebook",
    url: "https://www.facebook.com/smlionsMA/",
    handle: "St. Mark's Lions",
    icon: "📘",
    color: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
  },
  {
    platform: "X (Twitter)",
    url: "https://twitter.com/staborough",
    handle: "@staborough",
    icon: "🐦",
    color: "bg-sky-50",
    hoverColor: "hover:bg-sky-100",
  },
  {
    platform: "YouTube",
    url: "https://www.youtube.com/channel/UCstmarksschool",
    handle: "St. Mark's School",
    icon: "🎬",
    color: "bg-red-50",
    hoverColor: "hover:bg-red-100",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/school/st-mark's-school/",
    handle: "St. Mark's School",
    icon: "💼",
    color: "bg-blue-50",
    hoverColor: "hover:bg-blue-100",
  },
  {
    platform: "SmugMug Photos",
    url: "https://stmarksschool.smugmug.com/",
    handle: "Campus Photos",
    icon: "📷",
    color: "bg-green-50",
    hoverColor: "hover:bg-green-100",
  },
];

export default function SocialHub() {
  return (
    <div className="widget-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-secondary">
          Follow SM Lions
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {socials.map((social) => (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-3 transition-all group ${social.color} ${social.hoverColor}`}
          >
            <span className="text-xl">{social.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-text-primary">
                {social.platform}
              </p>
              <p className="text-[11px] text-text-muted truncate">
                {social.handle}
              </p>
            </div>
            <ExternalLink className="h-3 w-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
