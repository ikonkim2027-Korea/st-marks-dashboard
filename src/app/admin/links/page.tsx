"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, CheckCircle2, GripVertical } from "lucide-react";
import { LINK_ICON_NAMES, resolveLinkIcon } from "@/lib/link-icons";

type LinkRow = {
  id: string;
  name: string;
  url: string;
  icon: string;
  hint?: string;
};

type Category = { id: string; label: string; links: LinkRow[] };

type Data = { categories: Category[]; updated?: string | null };

export default function LinksAdminPage() {
  const [data, setData] = useState<Data | null>(null);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    fetch("/api/admin/links")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Data>;
      })
      .then((d) => {
        if (cancel) return;
        const cats = d.categories ?? [];
        setData({ categories: cats, updated: d.updated ?? null });
        if (cats[0]) setActiveCat(cats[0].id);
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

  function addCategory() {
    if (!data) return;
    const id = "cat-" + crypto.randomUUID().slice(0, 6);
    const newCat: Category = { id, label: "New Category", links: [] };
    update({ ...data, categories: [...data.categories, newCat] });
    setActiveCat(id);
  }

  function setCategory(id: string, patch: Partial<Category>) {
    if (!data) return;
    update({
      ...data,
      categories: data.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  }

  function removeCategory(id: string) {
    if (!data) return;
    if (!confirm("Remove this category and all its links?")) return;
    const next = data.categories.filter((c) => c.id !== id);
    update({ ...data, categories: next });
    if (activeCat === id) setActiveCat(next[0]?.id ?? null);
  }

  function addLink(catId: string) {
    if (!data) return;
    update({
      ...data,
      categories: data.categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              links: [
                ...c.links,
                {
                  id: crypto.randomUUID(),
                  name: "",
                  url: "",
                  icon: "Link",
                  hint: "",
                },
              ],
            }
          : c,
      ),
    });
  }

  function setLink(catId: string, linkId: string, patch: Partial<LinkRow>) {
    if (!data) return;
    update({
      ...data,
      categories: data.categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              links: c.links.map((l) =>
                l.id === linkId ? { ...l, ...patch } : l,
              ),
            }
          : c,
      ),
    });
  }

  function removeLink(catId: string, linkId: string) {
    if (!data) return;
    update({
      ...data,
      categories: data.categories.map((c) =>
        c.id === catId
          ? { ...c, links: c.links.filter((l) => l.id !== linkId) }
          : c,
      ),
    });
  }

  function moveCategory(idx: number, dir: -1 | 1) {
    if (!data) return;
    const list = [...data.categories];
    const j = idx + dir;
    if (j < 0 || j >= list.length) return;
    [list[idx], list[j]] = [list[j], list[idx]];
    update({ ...data, categories: list });
  }

  async function save() {
    if (!data) return;
    setSaveState("saving");
    setErrorMsg(null);
    try {
      const cleaned = data.categories
        .map((c) => ({
          id: c.id,
          label: c.label.trim(),
          links: c.links
            .filter((l) => l.name.trim() && l.url.trim())
            .map((l) => ({
              id: l.id,
              name: l.name.trim(),
              url: l.url.trim(),
              icon: l.icon || "Link",
              hint: l.hint?.trim() || undefined,
            })),
        }))
        .filter((c) => c.label);
      const res = await fetch("/api/admin/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: cleaned }),
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

  const active = data.categories.find((c) => c.id === activeCat);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-sm-text">Quick Links</h1>
          <p className="text-[12px] text-sm-text-muted">
            Categories appear in the dashboard in the order shown here.
          </p>
        </div>
        <SaveButton state={saveState} onSave={save} error={errorMsg} />
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
        {/* Category sidebar */}
        <aside className="rounded-lg border border-sm-border bg-white p-2">
          <ul className="space-y-0.5">
            {data.categories.map((c, idx) => (
              <li key={c.id} className="group flex items-center gap-1">
                <div className="flex flex-col">
                  <button
                    onClick={() => moveCategory(idx, -1)}
                    disabled={idx === 0}
                    aria-label="Move up"
                    className="text-[8px] text-sm-text-muted disabled:opacity-30 hover:text-sm-navy"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveCategory(idx, 1)}
                    disabled={idx === data.categories.length - 1}
                    aria-label="Move down"
                    className="text-[8px] text-sm-text-muted disabled:opacity-30 hover:text-sm-navy"
                  >
                    ▼
                  </button>
                </div>
                <button
                  onClick={() => setActiveCat(c.id)}
                  className={`flex-1 text-left rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors truncate ${
                    activeCat === c.id
                      ? "bg-sm-navy text-white"
                      : "text-sm-text hover:bg-sm-cream hover:text-sm-navy"
                  }`}
                >
                  {c.label || "(unnamed)"}
                </button>
                <span className="text-[9px] tabular text-sm-text-muted px-1">
                  {c.links.length}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={addCategory}
            className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-sm-border px-2 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-sm-navy hover:border-sm-navy"
          >
            <Plus className="h-3 w-3" aria-hidden="true" />
            Add Category
          </button>
        </aside>

        {/* Active category editor */}
        <section className="rounded-lg border border-sm-border bg-white p-4 space-y-4">
          {!active ? (
            <p className="text-[12px] text-sm-text-muted">
              No category selected.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <input
                  value={active.label}
                  onChange={(e) =>
                    setCategory(active.id, { label: e.target.value })
                  }
                  placeholder="Category name"
                  aria-label="Category name"
                  className="flex-1 rounded-sm border border-sm-border px-2.5 py-1.5 text-[13px] font-bold focus:outline-none focus:border-sm-navy"
                />
                <button
                  onClick={() => removeCategory(active.id)}
                  className="rounded-md border border-sm-danger/40 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-sm-danger hover:bg-sm-danger/5"
                >
                  Delete Category
                </button>
              </div>

              <ul className="space-y-2">
                {active.links.length === 0 && (
                  <li className="text-[11px] text-sm-text-muted py-2">
                    No links in this category yet.
                  </li>
                )}
                {active.links.map((l) => {
                  const Icon = resolveLinkIcon(l.icon);
                  return (
                    <li
                      key={l.id}
                      className="grid grid-cols-12 gap-2 items-center text-[12px]"
                    >
                      <span
                        className="col-span-1 flex items-center justify-center text-sm-text-muted"
                        aria-hidden="true"
                      >
                        <GripVertical className="h-3 w-3" />
                      </span>
                      <input
                        value={l.name}
                        onChange={(e) =>
                          setLink(active.id, l.id, { name: e.target.value })
                        }
                        placeholder="Display name"
                        aria-label="Link name"
                        className="col-span-3 rounded-sm border border-sm-border px-2 py-1.5 focus:outline-none focus:border-sm-navy"
                      />
                      <input
                        value={l.url}
                        onChange={(e) =>
                          setLink(active.id, l.id, { url: e.target.value })
                        }
                        placeholder="https://…"
                        aria-label="URL"
                        className="col-span-4 rounded-sm border border-sm-border px-2 py-1.5 focus:outline-none focus:border-sm-navy"
                      />
                      <div className="col-span-2 flex items-center gap-1.5">
                        <Icon
                          className="h-3.5 w-3.5 text-sm-text-muted shrink-0"
                          aria-hidden="true"
                        />
                        <select
                          value={l.icon}
                          onChange={(e) =>
                            setLink(active.id, l.id, { icon: e.target.value })
                          }
                          aria-label="Icon"
                          className="flex-1 min-w-0 rounded-sm border border-sm-border px-1 py-1.5 text-[11px] focus:outline-none focus:border-sm-navy"
                        >
                          {LINK_ICON_NAMES.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        value={l.hint ?? ""}
                        onChange={(e) =>
                          setLink(active.id, l.id, { hint: e.target.value })
                        }
                        placeholder="Tooltip (opt.)"
                        aria-label="Hint"
                        className="col-span-1 rounded-sm border border-sm-border px-2 py-1.5 text-[11px] focus:outline-none focus:border-sm-navy"
                      />
                      <button
                        onClick={() => removeLink(active.id, l.id)}
                        className="col-span-1 inline-flex items-center justify-center rounded-sm border border-sm-border p-1.5 text-sm-text-muted hover:text-sm-danger hover:border-sm-danger/40"
                        aria-label="Remove link"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <button
                onClick={() => addLink(active.id)}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-sm-navy hover:text-sm-navy-light"
              >
                <Plus className="h-3 w-3" aria-hidden="true" />
                Add Link
              </button>
            </>
          )}
        </section>
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
