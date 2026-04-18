"use client";

import Image from "next/image";
import { WidgetShell } from "./widget-shell";

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

export function InstagramWidget() {
  return (
    <WidgetShell
      title="@smlions"
      eyebrow="INSTAGRAM"
      accent="orange"
      href="https://www.instagram.com/smlions/"
      hrefLabel="Follow"
      scrollable={false}
    >
      <div className="flex h-full flex-col">
        {/* Post grid — stretches to fill available height */}
        <ul className="grid grid-cols-3 grid-rows-2 gap-1 flex-1 min-h-0" aria-label="Recent Instagram posts">
          {posts.map((post) => (
            <li key={post.id} className="relative overflow-hidden rounded-[2px]">
              <a
                href="https://www.instagram.com/smlions/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram: ${post.caption}`}
                className="focus-ring block h-full w-full group"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Image
                  src={post.img}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 33vw, 16vw"
                />
                <div
                  className="absolute inset-0 bg-sm-navy/0 group-hover:bg-sm-navy/30 transition-colors"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Social footer */}
        <div className="mt-3 pt-3 border-t border-sm-border/60">
          <p className="label-micro mb-2">Follow SM Lions</p>
          <ul className="flex items-center gap-1.5" aria-label="St. Mark's social channels">
            {socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.platform} — SM Lions`}
                  className="focus-ring group flex items-center justify-center min-h-[40px] min-w-[40px] sm:min-h-0 sm:min-w-0 sm:w-7 sm:h-7 rounded border border-sm-border/60 hover:border-sm-navy hover:bg-sm-navy transition-all"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Image
                    src={social.iconPath}
                    alt=""
                    width={12}
                    height={12}
                    aria-hidden="true"
                    className="opacity-55 transition-all group-hover:opacity-100 group-hover:brightness-0 group-hover:invert"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </WidgetShell>
  );
}
