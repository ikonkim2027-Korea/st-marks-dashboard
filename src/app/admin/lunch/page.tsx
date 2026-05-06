"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, CheckCircle2 } from "lucide-react";

type Item = { name: string; isVegetarian?: boolean };
type DayMenu = { diningHall: Item[]; lionsDen: Item[] };
type Lunch = { menus: Record<string, DayMenu>; updated?: string | null };

const DAYS: { key: string; label: string }[] = [
  { key: "Mon", label: "Monday" },
  { key: "Tue", label: "Tuesday" },
  { key: "Wed", label: "Wednesday" },
  { key: "Thu", label: "Thursday" },
  { key: "Fri", label: "Friday" },
  { key: "Sat", label: "Saturday" },
  { key: "Sun", label: "Sunday" },
];

const LOCATIONS: { key: keyof DayMenu; label: string }[] = [
  { key: "diningHall", label: "Dining Hall" },
  { key: "lionsDen", label: "Lion's Den" },
];

function emptyDay(): DayMenu {
  return { diningHall: [], lionsDen: [] };
}

export default function LunchAdminPage() {
  const [data, setData] = useState<Lunch | null>(null);
  const [activeDay, setActiveDay] = useState("Mon");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    fetch("/api/admin/lunch")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Lunch>;
      })
      .then((d) => {
        if (cancel) return;
        const menus = d.menus ?? {};
        for (const day of DAYS) {
          if (!menus[day.key]) menus[day.key] = emptyDay();
          menus[day.key].diningHall ??= [];
          menus[day.key].lionsDen ??= [];
        }
        setData({ menus, updated: d.updated ?? null });
      })
      .catch((e) => setErrorMsg(e.message));
    return () => {
      cancel = true;
    };
  }, []);

  function update(next: Lunch) {
    setData(next);
    setSaveState("idle");
  }

  function setItem(
    day: string,
    loc: keyof DayMenu,
    idx: number,
    patch: Partial<Item>,
  ) {
    if (!data) return;
    const items = [...data.menus[day][loc]];
    items[idx] = { ...items[idx], ...patch };
    update({
      ...data,
      menus: { ...data.menus, [day]: { ...data.menus[day], [loc]: items } },
    });
  }

  function addItem(day: string, loc: keyof DayMenu) {
    if (!data) return;
    update({
      ...data,
      menus: {
        ...data.menus,
        [day]: {
          ...data.menus[day],
          [loc]: [...data.menus[day][loc], { name: "" }],
        },
      },
    });
  }

  function removeItem(day: string, loc: keyof DayMenu, idx: number) {
    if (!data) return;
    update({
      ...data,
      menus: {
        ...data.menus,
        [day]: {
          ...data.menus[day],
          [loc]: data.menus[day][loc].filter((_, i) => i !== idx),
        },
      },
    });
  }

  async function save() {
    if (!data) return;
    setSaveState("saving");
    setErrorMsg(null);
    try {
      // Strip empty-name items so they don't pollute the JSON.
      const cleaned: Record<string, DayMenu> = {};
      for (const [day, m] of Object.entries(data.menus)) {
        cleaned[day] = {
          diningHall: m.diningHall.filter((i) => i.name.trim()),
          lionsDen: m.lionsDen.filter((i) => i.name.trim()),
        };
      }
      const res = await fetch("/api/admin/lunch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menus: cleaned }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (e) {
      setSaveState("error");
      setErrorMsg(e instanceof Error ? e.message : "Save failed");
    }
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-sm-border bg-white p-6">
        {errorMsg ? (
          <p className="text-sm text-sm-danger">{errorMsg}</p>
        ) : (
          <p className="text-sm text-sm-text-muted">Loading…</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-sm-text">Lunch Menu</h1>
          <p className="text-[12px] text-sm-text-muted">
            Edit by day. Empty rows are dropped on save.
          </p>
        </div>
        <SaveButton state={saveState} onSave={save} error={errorMsg} />
      </header>

      {/* Day tabs */}
      <div
        role="tablist"
        aria-label="Day"
        className="flex flex-wrap gap-1 border-b border-sm-border"
      >
        {DAYS.map((d) => (
          <button
            key={d.key}
            role="tab"
            aria-selected={activeDay === d.key}
            onClick={() => setActiveDay(d.key)}
            className={`relative px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors ${
              activeDay === d.key
                ? "text-sm-navy"
                : "text-sm-text-muted hover:text-sm-text-light"
            }`}
          >
            {d.label}
            {activeDay === d.key && (
              <span
                className="absolute -bottom-px left-0 right-0 h-[2px] bg-sm-navy"
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {LOCATIONS.map((loc) => (
          <section
            key={loc.key}
            className="rounded-lg border border-sm-border bg-white p-4"
            aria-label={`${loc.label} for ${activeDay}`}
          >
            <h2 className="text-[12px] font-bold text-sm-navy uppercase tracking-[0.2em] mb-3">
              {loc.label}
            </h2>
            <ul className="space-y-2">
              {data.menus[activeDay][loc.key].length === 0 && (
                <li className="text-[11px] text-sm-text-muted py-2">
                  No items yet. Click &quot;Add Item&quot; below.
                </li>
              )}
              {data.menus[activeDay][loc.key].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      setItem(activeDay, loc.key, idx, { name: e.target.value })
                    }
                    placeholder="e.g. Herb-Roasted Chicken"
                    aria-label="Item name"
                    className="flex-1 rounded-sm border border-sm-border px-2.5 py-1.5 text-[13px] focus:outline-none focus:border-sm-navy"
                  />
                  <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 text-[11px] text-sm-text">
                    <input
                      type="checkbox"
                      checked={!!item.isVegetarian}
                      onChange={(e) =>
                        setItem(activeDay, loc.key, idx, {
                          isVegetarian: e.target.checked,
                        })
                      }
                      aria-label="Vegetarian"
                    />
                    Veg
                  </label>
                  <button
                    onClick={() => removeItem(activeDay, loc.key, idx)}
                    className="rounded-sm border border-sm-border p-1.5 text-sm-text-muted hover:text-sm-danger hover:border-sm-danger/40"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => addItem(activeDay, loc.key)}
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-sm-navy hover:text-sm-navy-light"
            >
              <Plus className="h-3 w-3" aria-hidden="true" />
              Add Item
            </button>
          </section>
        ))}
      </div>

      {data.updated && (
        <p className="text-[10px] text-sm-text-muted">
          Last saved: {data.updated}
        </p>
      )}
    </div>
  );
}

function SaveButton({
  state,
  onSave,
  error,
}: {
  state: "idle" | "saving" | "saved" | "error";
  onSave: () => void;
  error: string | null;
}) {
  return (
    <div className="flex items-center gap-3">
      {state === "error" && error && (
        <p className="text-[12px] text-sm-danger">{error}</p>
      )}
      {state === "saved" && (
        <span className="inline-flex items-center gap-1 text-[12px] text-sm-success">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          Saved
        </span>
      )}
      <button
        onClick={onSave}
        disabled={state === "saving"}
        className="inline-flex items-center gap-1.5 rounded-md bg-sm-navy px-4 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-white hover:bg-sm-navy-light disabled:opacity-50 transition-colors"
      >
        {state === "saving" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        Save
      </button>
    </div>
  );
}
