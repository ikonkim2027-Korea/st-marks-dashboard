"use client";

import Image from "next/image";

interface SocialLink {
  platform: string;
  url: string;
  handle: string;
  iconPath: string;
}

const socials: SocialLink[] = [
  {
    platform: "Instagram",
    url: "https://www.instagram.com/smlions/",
    handle: "@smlions",
    iconPath: "/icons/brands/instagram.svg",
  },
  {
    platform: "Facebook",
    url: "https://www.facebook.com/smlionsMA/",
    handle: "SM Lions",
    iconPath: "/icons/brands/facebook.svg",
  },
  {
    platform: "X",
    url: "https://x.com/SMLions",
    handle: "@SMLions",
    iconPath: "/icons/brands/x.svg",
  },
  {
    platform: "YouTube",
    url: "https://www.youtube.com/@SMLions",
    handle: "@SMLions",
    iconPath: "/icons/brands/youtube.svg",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/school/smlions/",
    handle: "SM Lions",
    iconPath: "/icons/brands/linkedin.svg",
  },
  {
    platform: "SmugMug",
    url: "https://stmarkslions.smugmug.com/",
    handle: "Campus Photos",
    iconPath: "/icons/brands/smugmug.svg",
  },
];

export default function SocialHub() {
  return (
    <div className="widget-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <span className="divider-gold" />
        <span className="label-micro">Follow SM Lions</span>
      </div>

      <div className="grid grid-cols-3 gap-2 flex-1">
        {socials.map((social) => (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${social.platform} — ${social.handle}`}
            className="group flex items-center gap-2.5 rounded-md border border-sm-border/60 bg-white px-3 py-3 transition-all hover:border-sm-navy hover:bg-sm-navy"
          >
            <Image
              src={social.iconPath}
              alt={social.platform}
              width={16}
              height={16}
              className="opacity-60 transition-all group-hover:opacity-100 group-hover:brightness-0 group-hover:invert flex-shrink-0"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-sm-text-light group-hover:text-white truncate">
              {social.platform}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
