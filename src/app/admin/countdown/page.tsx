"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, CheckCircle2 } from "lucide-react";

type Milestone = { id: string; label: string; date: string; emoji?: string };
type Data = { milestones: Milestone[]; updated?: string | null };

export default function CountdownAdminPage() {
  const [data, setData] = useState<Data | null>(null);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    fetch("/api/admin/milestones")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Data>;
      })
      .then((d) => {
        if (!cancel)
          setData({
            milestones: d.milestones ?? [],
            updated: d.updated ?? null,
          });
      })
      .catch((e) => setErrorMsg(e.message));
    return () => {
      cancel = true;
    };
  }, []);

  function update(next: Data) {
    setData(next);
    setSaveState("idle");
  }

  function setField(idx: number, patch: Partial<Milestone>) {
    if (!data) return;
    const list = [...data.milestones];
    list[idx] = { ...list[idx], ...patch };
    update({ ...data, milestones: list });
  }

  function add() {
    if (!data) return;
    update({
      ...data,
      milestones: [
        ...data.milestones,
        { id: crypto.randomUUID(), label: "", date: "", emoji: "" },
      ],
    });
  }

  function remove(idx: number) {
    if (!data) return;
    update({
      ...data,
      milestones: data.milestones.filter((_, i) => i !== idx),
    });
  }

  async function save() {
    if (!data) return;
    setSaveState("saving");
    setErrorMsg(null);
    try {
      const cleaned = data.milestones
        .filter((m) => m.label.trim() && m.date.trim())
        .map((m) => ({
          id: m.id,
          label: m.label.trim(),
          date: m.date,
          emoji: m.emoji?.trim() || undefined,
        }));
      const res = await fetch("/api/admin/milestones", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestones: cleaned }),
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
          <h1 className="text-xl font-bold text-sm-text">Countdown</h1>
          <p className="text-[12px] text-sm-text-muted">
            Past dates are filtered out automatically by the widget.
          </p>
        </div>
        <SaveButton state={saveState} onSave={save} error={errorMsg} />
      </header>

      <ul className="space-y-2 rounded-lg border border-sm-border bg-white p-4">
        {data.milestones.length === 0 && (
          <li className="text-[12px] text-sm-text-muted py-2">
            No milestones yet. Click &quot;Add Milestone&quot; below.
          </li>
        )}
        {data.milestones
          .map((m, idx) => ({ m, idx }))
          .sort((a, b) =>
            (a.m.date || "9999").localeCompare(b.m.date || "9999"),
          )
          .map(({ m, idx }) => (
            <li
              key={m.id}
              className="grid grid-cols-12 gap-2 items-center text-[12px]"
            >
              <input
                value={m.emoji ?? ""}
                onChange={(e) => setField(idx, { emoji: e.target.value })}
                placeholder="🎓"
                aria-label="Emoji"
                className="col-span-1 rounded-sm border border-sm-border px-2 py-1.5 text-center text-[14px] focus:outline-none focus:border-sm-navy"
                maxLength={4}
              />
              <input
                value={m.label}
                onChange={(e) => setField(idx, { label: e.target.value })}
                placeholder="Last Day of Classes"
                aria-label="Label"
                className="col-span-7 rounded-sm border border-sm-border px-2.5 py-1.5 focus:outline-none focus:border-sm-navy"
              />
              <input
                type="date"
                value={m.date}
                onChange={(e) => setField(idx, { date: e.target.value })}
                aria-label="Date"
                className="col-span-3 rounded-sm border border-sm-border px-2.5 py-1.5 focus:outline-none focus:border-sm-navy"
              />
              <button
                onClick={() => remove(idx)}
                className="col-span-1 inline-flex items-center justify-center rounded-sm border border-sm-border p-1.5 text-sm-text-muted hover:text-sm-danger hover:border-sm-danger/40"
                aria-label="Remove milestone"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
      </ul>

      <button
        onClick={add}
        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-sm-navy hover:text-sm-navy-light"
      >
        <Plus className="h-3 w-3" aria-hidden="true" />
        Add Milestone
      </button>

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
