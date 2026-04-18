// Lightweight classname helper — no external deps.
// Accepts strings, arrays, objects (truthy key → className), and falsy values.
// Later entries override earlier ones only by position, not by Tailwind merge
// semantics (we don't ship tailwind-merge). If a conflict arises, callers
// should write class logic in a single `cn(...)` per node, filtered by
// conditions, rather than relying on merge-aware dedupe.

type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[]
  | { [key: string]: unknown };

function flatten(value: ClassValue, acc: string[]): void {
  if (!value) return;
  if (typeof value === "string" || typeof value === "number") {
    acc.push(String(value));
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) flatten(v, acc);
    return;
  }
  if (typeof value === "object") {
    for (const key of Object.keys(value)) {
      if ((value as Record<string, unknown>)[key]) acc.push(key);
    }
  }
}

export function cn(...inputs: ClassValue[]): string {
  const acc: string[] = [];
  for (const input of inputs) flatten(input, acc);
  return acc.join(" ");
}

export function formatTime(date: Date, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    ...opts,
  }).format(date);
}

export function formatDate(date: Date, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...opts,
  }).format(date);
}
