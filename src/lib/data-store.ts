import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Dual-mode JSON store for the dashboard's editable data
 * (lunch menu, milestones, quick links).
 *
 * - Local dev: read & write `<repo>/.data/<file>.json` on the filesystem.
 *   Convenient for `npm run dev` — the same files the public widgets read.
 *
 * - Vercel / serverless: read from filesystem (the bundled deploy artifact),
 *   write via the GitHub Contents API. Each save is a commit on the
 *   configured branch which auto-triggers a Vercel redeploy. Public widgets
 *   serve the freshly deployed JSON within ~30s; admin GETs go through the
 *   GitHub API so the editor sees the just-saved value immediately without
 *   waiting for the redeploy.
 *
 * Mode is selected by the presence of GITHUB_TOKEN. No code branches need
 * to know which mode is active beyond this file.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const REPO = process.env.GITHUB_REPO; // "owner/name"
const BRANCH = process.env.GITHUB_BRANCH ?? "main";
const TOKEN = process.env.GITHUB_TOKEN;
const USE_GITHUB = Boolean(REPO && TOKEN);

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

// ---- filesystem layer -----------------------------------------------------

async function readJsonFs<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFs<T>(file: string, value: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, file);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

// ---- GitHub Contents API layer -------------------------------------------

interface GhFile {
  content: string;
  sha: string;
}

async function ghRead(filePath: string): Promise<GhFile | null> {
  if (!REPO || !TOKEN) throw new Error("GitHub mode not configured");
  const r = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(filePath)}?ref=${BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );
  if (r.status === 404) return null;
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    throw new Error(`GitHub read ${r.status}: ${body.slice(0, 200)}`);
  }
  const data = (await r.json()) as { content: string; sha: string; encoding?: string };
  // GitHub returns base64 with newlines; Buffer.from handles that fine.
  const decoded = Buffer.from(data.content, "base64").toString("utf8");
  return { content: decoded, sha: data.sha };
}

async function ghWrite(
  filePath: string,
  content: string,
  message: string,
): Promise<void> {
  if (!REPO || !TOKEN) throw new Error("GitHub mode not configured");
  // We need the current SHA to update an existing file; a missing SHA means
  // we're creating it for the first time.
  const existing = await ghRead(filePath);
  const r = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${encodeURIComponent(filePath)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content, "utf8").toString("base64"),
        branch: BRANCH,
        sha: existing?.sha,
        committer: {
          name: "SM Hub Admin",
          email: "admin@stmarksschool.org",
        },
      }),
    },
  );
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    throw new Error(`GitHub write ${r.status}: ${body.slice(0, 200)}`);
  }
}

// ---- shared read/write ----------------------------------------------------

async function readFresh<T>(file: string, fallback: T): Promise<T> {
  if (USE_GITHUB) {
    try {
      const f = await ghRead(`.data/${file}`);
      if (!f) return fallback;
      return JSON.parse(f.content) as T;
    } catch {
      // Fall back to filesystem so admin reads still surface the last
      // deployed snapshot if the GitHub API hiccups.
      return readJsonFs(file, fallback);
    }
  }
  return readJsonFs(file, fallback);
}

async function writeAny<T>(file: string, value: T, message: string): Promise<void> {
  if (USE_GITHUB) {
    const json = JSON.stringify(value, null, 2) + "\n";
    await ghWrite(`.data/${file}`, json, message);
    return;
  }
  await writeJsonFs(file, value);
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ---- Lunch ----------------------------------------------------------------

/**
 * For public consumers (the LunchWidget). Reads the bundled JSON — fast,
 * no API quota. After an admin save on Vercel, the new value lands here
 * once the redeploy finishes (~30s).
 */
export async function readLunch(): Promise<LunchData> {
  const data = await readJsonFs<LunchData>("lunch.json", {
    updated: undefined,
    menus: {},
  });
  return { updated: data.updated, menus: data.menus ?? {} };
}

/** For the admin UI — sees the just-saved value immediately. */
export async function readLunchFresh(): Promise<LunchData> {
  const data = await readFresh<LunchData>("lunch.json", {
    updated: undefined,
    menus: {},
  });
  return { updated: data.updated, menus: data.menus ?? {} };
}

export async function writeLunch(next: LunchData): Promise<void> {
  await writeAny(
    "lunch.json",
    { updated: today(), menus: next.menus },
    "chore(admin): update lunch menu",
  );
}

// ---- Milestones -----------------------------------------------------------

export async function readMilestones(): Promise<MilestonesData> {
  const data = await readJsonFs<MilestonesData>("milestones.json", {
    updated: undefined,
    milestones: [],
  });
  return { updated: data.updated, milestones: data.milestones ?? [] };
}

export async function readMilestonesFresh(): Promise<MilestonesData> {
  const data = await readFresh<MilestonesData>("milestones.json", {
    updated: undefined,
    milestones: [],
  });
  return { updated: data.updated, milestones: data.milestones ?? [] };
}

export async function writeMilestones(next: MilestonesData): Promise<void> {
  await writeAny(
    "milestones.json",
    { updated: today(), milestones: next.milestones },
    "chore(admin): update countdown milestones",
  );
}

// ---- Links ----------------------------------------------------------------

export async function readLinks(): Promise<LinksData> {
  const data = await readJsonFs<LinksData>("links.json", {
    updated: undefined,
    categories: [],
  });
  return { updated: data.updated, categories: data.categories ?? [] };
}

export async function readLinksFresh(): Promise<LinksData> {
  const data = await readFresh<LinksData>("links.json", {
    updated: undefined,
    categories: [],
  });
  return { updated: data.updated, categories: data.categories ?? [] };
}

export async function writeLinks(next: LinksData): Promise<void> {
  await writeAny(
    "links.json",
    { updated: today(), categories: next.categories },
    "chore(admin): update quick links",
  );
}

// ---- mode introspection ---------------------------------------------------

/** Surfaced in the admin UI so the editor knows redeploy lag is expected. */
export function getStorageMode(): "github" | "filesystem" {
  return USE_GITHUB ? "github" : "filesystem";
}
