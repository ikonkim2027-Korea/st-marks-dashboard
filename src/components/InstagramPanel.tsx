"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const socials = [
  {
    platform: "Instagram",
    url: "https://www.instagram.com/smlions/",
    iconPath: "/icons/brands/instagram.svg",
  },
  {
    platform: "Facebook",
    url: "https://www.facebook.com/smlionsMA/",
    iconPath: "/icons/brands/facebook.svg",
  },
  {
    platform: "X",
    url: "https://x.com/SMLions",
    iconPath: "/icons/brands/x.svg",
  },
  {
    platform: "YouTube",
    url: "https://www.youtube.com/@SMLions",
    iconPath: "/icons/brands/youtube.svg",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/school/smlions/",
    iconPath: "/icons/brands/linkedin.svg",
  },
  {
    platform: "SmugMug",
    url: "https://stmarkslions.smugmug.com/",
    iconPath: "/icons/brands/smugmug.svg",
  },
];

const posts = [
  {
    id: "1",
    img: "/photos/campus-aerial-dusk.jpg",
    caption: "Campus at golden hour",
  },
  {
    id: "2",
    img: "/photos/athletics-action.jpg",
    caption: "Lions on the field",
  },
  {
    id: "3",
    img: "/photos/campus-quad.jpg",
    caption: "The Quad in spring",
  },
  {
    id: "4",
    img: "/photos/campus-flower.jpg",
    caption: "Blossoms on campus",
  },
  {
    id: "5",
    img: "/photos/campus-aerial-dusk.jpg",
    caption: "Evening at St. Mark's",
  },
  {
    id: "6",
    img: "/photos/athletics-action.jpg",
    caption: "Game day energy",
  },
];

export default function InstagramPanel() {
  return (
    <div className="widget-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="divider-gold" />
          <span className="label-micro">Instagram</span>
        </div>
        <a
          href="https://www.instagram.com/smlions/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-sm-navy hover:text-sm-navy-light transition-colors"
        >
          @smlions
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>

      {/* Post grid — stretches to fill available height, no wasted space */}
      <div className="grid grid-cols-3 grid-rows-2 gap-1 flex-1 min-h-0">
        {posts.map((post) => (
          <a
            key={post.id}
            href="https://www.instagram.com/smlions/"
            target="_blank"
            rel="noopener noreferrer"
            title={post.caption}
            className="relative overflow-hidden group block"
          >
            <Image
              src={post.img}
              alt={post.caption}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 33vw, 16vw"
            />
            <div className="absolute inset-0 bg-sm-navy/0 group-hover:bg-sm-navy/30 transition-colors" />
          </a>
        ))}
      </div>

      {/* Social footer */}
      <div className="mt-5 pt-4 border-t border-sm-border/60">
        <p className="label-micro mb-2.5">Follow SM Lions</p>
        <div className="flex items-center gap-1">
          {socials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              title={social.platform}
              className="group flex items-center justify-center w-8 h-8 rounded border border-sm-border/60 hover:border-sm-navy hover:bg-sm-navy transition-all"
            >
              <Image
                src={social.iconPath}
                alt={social.platform}
                width={14}
                height={14}
                className="opacity-55 transition-all group-hover:opacity-100 group-hover:brightness-0 group-hover:invert"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
