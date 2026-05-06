"use client";

import { useMemo, useState } from "react";
import { Settings, X, Plus, Trash2, Clock } from "lucide-react";
import { useLocalStorage } from "@/lib/storage";
import { useNow } from "@/lib/now";
import { WidgetShell } from "./widget-shell";

type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

interface ClassBlock {
  id: string;
  day: Weekday;
  start: string;
  end: string;
  course: string;
  room?: string;
}

interface ScheduleConfig {
  blocks: ClassBlock[];
}

const STORAGE_KEY = "sm-hub-schedule-v1";
const WEEK: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SEED: Omit<ClassBlock, "id">[] = [
  { day: "Mon", start: "08:00", end: "08:50", course: "English", room: "Room 201" },
  { day: "Mon", start: "09:00", end: "09:50", course: "Mathematics", room: "Room 105" },
  { day: "Mon", start: "10:00", end: "10:50", course: "Chemistry", room: "Coolidge 12" },
  { day: "Mon", start: "11:00", end: "11:50", course: "History", room: "Room 304" },
  { day: "Mon", start: "13:00", end: "13:50", course: "Spanish", room: "Room 220" },
];

const TZ = "America/New_York";

function dayIndexFromDate(d: Date): Weekday | null {
  const tzWeekday = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
  }).format(d);
  const map: Record<string, Weekday | null> = {
    Sun: null,
    Mon: "Mon",
    Tue: "Tue",
    Wed: "Wed",
    Thu: "Thu",
    Fri: "Fri",
    Sat: "Sat",
  };
  return map[tzWeekday] ?? null;
}

function minutesOfDay(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function fmtTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const hour = ((h ?? 0) % 12) || 12;
  const ampm = (h ?? 0) >= 12 ? "PM" : "AM";
  return `${hour}:${String(m ?? 0).padStart(2, "0")} ${ampm}`;
}

function getTzMinutes(d: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(d);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

export function TodayScheduleWidget() {
  const [config, setConfig, hydrated] = useLocalStorage<ScheduleConfig>(
    STORAGE_KEY,
    { blocks: [] },
  );
  const [editing, setEditing] = useState(false);
  const now = useNow(30_000);

  function addBlock() {
    const day = now ? dayIndexFromDate(now) ?? "Mon" : "Mon";
    setConfig({
      blocks: [
        ...config.blocks,
        {
          id: crypto.randomUUID(),
          day,
          start: "09:00",
          end: "09:50",
          course: "New Class",
          room: "",
        },
      ],
    });
  }

  function updateBlock(id: string, patch: Partial<ClassBlock>) {
    setConfig({
      blocks: config.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    });
  }

  function removeBlock(id: string) {
    setConfig({ blocks: config.blocks.filter((b) => b.id !== id) });
  }

  function loadSeed() {
    setConfig({ blocks: SEED.map((b) => ({ ...b, id: crypto.randomUUID() })) });
  }

  const today = useMemo(() => {
    if (!now) return null;
    const dayKey = dayIndexFromDate(now);
    if (!dayKey) return { dayKey: null, blocks: [] as ClassBlock[] };
    return {
      dayKey,
      blocks: config.blocks
        .filter((b) => b.day === dayKey)
        .sort((a, b) => minutesOfDay(a.start) - minutesOfDay(b.start)),
    };
  }, [config.blocks, now]);

  const headerExtra = (
    <button
      onClick={() => setEditing((v) => !v)}
      onMouseDown={(e) => e.stopPropagation()}
      className="focus-ring inline-flex min-h-[28px] min-w-[28px] items-center justify-center rounded text-sm-text-muted hover:text-sm-text transition-colors"
      aria-label={editing ? "Close schedule editor" : "Edit schedule"}
    >
      {editing ? (
        <X className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Settings className="h-3.5 w-3.5" aria-hidden="true" />
      )}
    </button>
  );

  if (!hydrated || !now) {
    return (
      <WidgetShell title="Schedule" eyebrow="TODAY'S CLASSES" accent="navy">
        <div role="status" aria-label="Loading schedule" className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded bg-sm-cream"
            />
          ))}
        </div>
      </WidgetShell>
    );
  }

  if (editing) {
    return (
      <WidgetShell
        title="Schedule"
        eyebrow="EDIT BLOCKS"
        accent="navy"
        headerExtra={headerExtra}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-2 overflow-y-auto pr-1 min-h-0">
            {config.blocks.length === 0 && (
              <div className="text-center py-6">
                <p className="text-[11px] text-sm-text-muted mb-3">
                  No classes yet. Start fresh or load a sample schedule.
                </p>
                <button
                  onClick={loadSeed}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="focus-ring text-[10px] font-bold uppercase tracking-[0.15em] text-sm-navy border-b border-sm-navy"
                >
                  Load Sample →
                </button>
              </div>
            )}
            {config.blocks
              .slice()
              .sort(
                (a, b) =>
                  WEEK.indexOf(a.day) - WEEK.indexOf(b.day) ||
                  minutesOfDay(a.start) - minutesOfDay(b.start),
              )
              .map((b) => (
                <div
                  key={b.id}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="grid grid-cols-12 gap-1.5 items-center text-[11px]"
                >
                  <select
                    value={b.day}
                    onChange={(e) =>
                      updateBlock(b.id, { day: e.target.value as Weekday })
                    }
                    className="col-span-2 border border-sm-border bg-white px-1.5 py-1 text-[10px] focus:outline-none focus:border-sm-navy"
                    aria-label="Day"
                  >
                    {WEEK.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={b.start}
                    onChange={(e) =>
                      updateBlock(b.id, { start: e.target.value })
                    }
                    className="col-span-2 border border-sm-border bg-white px-1 py-1 text-[10px] focus:outline-none focus:border-sm-navy"
                    aria-label="Start time"
                  />
                  <input
                    type="time"
                    value={b.end}
                    onChange={(e) => updateBlock(b.id, { end: e.target.value })}
                    className="col-span-2 border border-sm-border bg-white px-1 py-1 text-[10px] focus:outline-none focus:border-sm-navy"
                    aria-label="End time"
                  />
                  <input
                    value={b.course}
                    onChange={(e) =>
                      updateBlock(b.id, { course: e.target.value })
                    }
                    placeholder="Course"
                    className="col-span-3 border border-sm-border bg-white px-1.5 py-1 text-[10px] focus:outline-none focus:border-sm-navy"
                    aria-label="Course"
                  />
                  <input
                    value={b.room ?? ""}
                    onChange={(e) => updateBlock(b.id, { room: e.target.value })}
                    placeholder="Room"
                    className="col-span-2 border border-sm-border bg-white px-1.5 py-1 text-[10px] focus:outline-none focus:border-sm-navy"
                    aria-label="Room"
                  />
                  <button
                    onClick={() => removeBlock(b.id)}
                    className="focus-ring col-span-1 flex justify-center text-sm-danger hover:text-sm-danger/80"
                    aria-label="Delete block"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              ))}
          </div>

          <button
            onClick={addBlock}
            onMouseDown={(e) => e.stopPropagation()}
            className="focus-ring mt-3 inline-flex items-center justify-center gap-1.5 w-full bg-sm-navy text-white py-2 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-sm-navy-light transition-colors"
          >
            <Plus className="h-3 w-3" aria-hidden="true" />
            Add Block
          </button>
          <p className="mt-2 text-center text-[9px] text-sm-text-muted leading-relaxed">
            Saved locally to your browser.
          </p>
        </div>
      </WidgetShell>
    );
  }

  const minsNow = getTzMinutes(now);
  const todayBlocks = today?.blocks ?? [];
  let currentId: string | null = null;
  let nextId: string | null = null;
  for (const b of todayBlocks) {
    const s = minutesOfDay(b.start);
    const e = minutesOfDay(b.end);
    if (minsNow >= s && minsNow < e) currentId = b.id;
    if (minsNow < s && nextId === null) nextId = b.id;
  }

  const eyebrow =
    todayBlocks.length > 0
      ? `TODAY'S CLASSES · ${String(todayBlocks.length).padStart(2, "0")}`
      : "TODAY'S CLASSES";

  return (
    <WidgetShell
      title="Schedule"
      eyebrow={eyebrow}
      accent="navy"
      headerExtra={headerExtra}
      scrollable={false}
    >
      {config.blocks.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center py-6">
          <Clock
            className="h-7 w-7 text-sm-navy/20 mb-2.5"
            aria-hidden="true"
          />
          <p className="text-sm font-bold text-sm-text mb-1">No Schedule Set</p>
          <p className="text-[11px] text-sm-text-muted max-w-[240px] mb-4 leading-relaxed">
            Add your weekly class blocks once and we&apos;ll show what&apos;s
            happening today.
          </p>
          <button
            onClick={() => setEditing(true)}
            onMouseDown={(e) => e.stopPropagation()}
            className="focus-ring text-[10px] font-bold uppercase tracking-[0.15em] text-sm-navy hover:text-sm-navy-light border-b border-sm-navy pb-0.5 transition-colors"
          >
            Set up Schedule →
          </button>
        </div>
      ) : today?.dayKey === null ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="display-number text-3xl text-sm-navy/30 mb-2">SUN</p>
          <p className="text-[11px] text-sm-text-muted">No classes today</p>
        </div>
      ) : todayBlocks.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="display-number text-2xl text-sm-text mb-1">FREE DAY</p>
          <p className="text-[11px] text-sm-text-muted">
            No classes scheduled for {today?.dayKey}
          </p>
        </div>
      ) : (
        <ul className="flex h-full flex-col space-y-0 overflow-y-auto min-h-0 pr-1" aria-label="Today's classes">
          {todayBlocks.map((b) => {
            const isCurrent = b.id === currentId;
            const isNext = b.id === nextId && currentId === null;
            const isPast = minutesOfDay(b.end) <= minsNow && b.id !== currentId;
            return (
              <li
                key={b.id}
                className={`flex items-center gap-3 py-2.5 border-b border-sm-border/60 last:border-0 ${
                  isCurrent
                    ? "border-l-2 border-l-sm-gold pl-3 -ml-3 bg-sm-gold/5"
                    : isNext
                    ? "border-l-2 border-l-sm-navy pl-3 -ml-3"
                    : ""
                } ${isPast ? "opacity-40" : ""}`}
              >
                <div className="flex-shrink-0 w-14 text-right">
                  <p className="text-[10px] font-bold text-sm-text tabular tracking-wide">
                    {fmtTime(b.start)}
                  </p>
                  <p className="text-[9px] text-sm-text-muted tabular">
                    {fmtTime(b.end)}
                  </p>
                </div>
                <div className="flex-1 min-w-0 border-l border-sm-border pl-3">
                  <h4 className="text-xs font-bold text-sm-text truncate">
                    {b.course}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-sm-text-muted">
                    {b.room && <span className="truncate">{b.room}</span>}
                    {isCurrent && (
                      <span className="text-sm-gold font-bold tracking-[0.15em] uppercase text-[9px]">
                        ● Now
                      </span>
                    )}
                    {isNext && (
                      <span className="text-sm-navy font-bold tracking-[0.15em] uppercase text-[9px]">
                        Next
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </WidgetShell>
  );
}
