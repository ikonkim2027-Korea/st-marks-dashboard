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
  Link as LinkIcon,
  type LucideIcon,
} from "lucide-react";

/**
 * Whitelist of lucide-react icon names that admins can pick from when
 * editing quick links. Stored in `.data/links.json` as a string and looked
 * up here at render time. New icons get added once to both the imports and
 * `LINK_ICONS` map.
 */
export const LINK_ICONS: Record<string, LucideIcon> = {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Bus,
  CalendarDays,
  Cross,
  FileText,
  Globe2,
  GraduationCap,
  Heart,
  HeartHandshake,
  HelpCircle,
  ImageIcon,
  Languages,
  Lock,
  Mail,
  MapPin,
  Music,
  PartyPopper,
  PenTool,
  Phone,
  School,
  Shield,
  ShoppingBag,
  Stethoscope,
  Trophy,
  Users,
  Utensils,
  Link: LinkIcon,
};

export const LINK_ICON_NAMES = Object.keys(LINK_ICONS).sort();

export function resolveLinkIcon(name: string | undefined): LucideIcon {
  if (!name) return LinkIcon;
  return LINK_ICONS[name] ?? LinkIcon;
}
