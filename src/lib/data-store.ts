import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Tiny filesystem-backed data store for the dashboard's editable JSON
 * (lunch menu, milestones, quick links). Reads/writes `<repo>/.data/<file>.json`
 * on the local filesystem — fine for `npm run dev` and self-hosted setups.
 *
 * NOTE: serverless platforms like Vercel mount a read-only filesystem, so
 * the admin's "Save" buttons will fail there. If/when we deploy, swap this
 * for a KV store or commit-via-GitHub-API and only this file needs to change.
 */

const DATA_DIR = path.join(process.cwd(), ".data");

export type LunchItem = { name: string; isVegetarian?: boolean };
export type LunchDay = { diningHall: LunchItem[]; lionsDen: LunchItem[] };
export type LunchData = {
  updated?: string;
  menus: Record<string, LunchDay>;
};

export type Milestone = {
  id: string;
  label: string;
  date: string;
  emoji?: string;
};
export type MilestonesData = {
  updated?: string;
  milestones: Milestone[];
};

export type LinkItem = {
  id: string;
  name: string;
  url: string;
  icon: string;
  hint?: string;
};
export type LinkCategory = {
  id: string;
  label: string;
  links: LinkItem[];
};
export type LinksData = {
  updated?: string;
  categories: LinkCategory[];
};

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, value: T): Promise<void> {
  // Ensure dir exists; first-time writes on a fresh checkout would fail otherwise.
  await fs.mkdir(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, file);
  // Pretty-printed JSON so diffs in `git log` stay readable.
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

// ---- Lunch ----------------------------------------------------------------

export async function readLunch(): Promise<LunchData> {
  const data = await readJson<LunchData>("lunch.json", {
    updated: undefined,
    menus: {},
  });
  return { updated: data.updated, menus: data.menus ?? {} };
}

export async function writeLunch(next: LunchData): Promise<void> {
  await writeJson("lunch.json", {
    updated: today(),
    menus: next.menus,
  });
}

// ---- Milestones -----------------------------------------------------------

export async function readMilestones(): Promise<MilestonesData> {
  const data = await readJson<MilestonesData>("milestones.json", {
    updated: undefined,
    milestones: [],
  });
  return { updated: data.updated, milestones: data.milestones ?? [] };
}

export async function writeMilestones(next: MilestonesData): Promise<void> {
  await writeJson("milestones.json", {
    updated: today(),
    milestones: next.milestones,
  });
}

// ---- Links ----------------------------------------------------------------

export async function readLinks(): Promise<LinksData> {
  const data = await readJson<LinksData>("links.json", {
    updated: undefined,
    categories: [],
  });
  return { updated: data.updated, categories: data.categories ?? [] };
}

export async function writeLinks(next: LinksData): Promise<void> {
  await writeJson("links.json", {
    updated: today(),
    categories: next.categories,
  });
}

// ---- helpers --------------------------------------------------------------

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
