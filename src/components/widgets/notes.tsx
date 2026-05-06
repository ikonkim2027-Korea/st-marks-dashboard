"use client";

import { useState } from "react";
import { Plus, Check, Trash2, Square } from "lucide-react";
import { useLocalStorage } from "@/lib/storage";
import { WidgetShell } from "./widget-shell";

interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

const STORAGE_KEY = "sm-hub-notes-v1";

export function NotesWidget() {
  const [todos, setTodos, hydrated] = useLocalStorage<Todo[]>(STORAGE_KEY, []);
  const [draft, setDraft] = useState("");

  function add() {
    const text = draft.trim();
    if (!text) return;
    setTodos([
      { id: crypto.randomUUID(), text, done: false, createdAt: Date.now() },
      ...todos,
    ]);
    setDraft("");
  }

  function toggle(id: string) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function remove(id: string) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  function clearDone() {
    setTodos(todos.filter((t) => !t.done));
  }

  if (!hydrated) {
    return (
      <WidgetShell title="Notes" eyebrow="TO-DO" accent="navy">
        <div role="status" aria-label="Loading notes" className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 w-2/3 animate-pulse rounded bg-sm-cream" />
          ))}
        </div>
      </WidgetShell>
    );
  }

  const open = todos.filter((t) => !t.done).length;
  const done = todos.length - open;

  const headerExtra =
    done > 0 ? (
      <button
        onClick={clearDone}
        onMouseDown={(e) => e.stopPropagation()}
        className="focus-ring rounded-sm px-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-sm-text-muted hover:text-sm-danger transition-colors"
        aria-label={`Clear ${done} completed item${done === 1 ? "" : "s"}`}
      >
        Clear Done
      </button>
    ) : null;

  return (
    <WidgetShell
      title="Notes"
      eyebrow={
        open > 0
          ? `TO-DO · ${String(open).padStart(2, "0")}`
          : "TO-DO"
      }
      accent="navy"
      headerExtra={headerExtra}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 mb-4 border-b border-sm-border pb-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") add();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            placeholder="Add a note or task…"
            aria-label="New note or task"
            className="focus-ring flex-1 bg-transparent border-0 px-0 py-1 text-xs text-sm-text placeholder:text-sm-text-muted focus:outline-none"
          />
          <button
            onClick={add}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={!draft.trim()}
            className="focus-ring inline-flex items-center justify-center h-6 w-6 bg-sm-navy text-white hover:bg-sm-navy-light disabled:opacity-30 transition-colors rounded-sm"
            aria-label="Add note"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <ul className="flex-1 space-y-0 overflow-y-auto min-h-0 pr-1">
          {todos.length === 0 ? (
            <li className="flex h-full flex-col items-center justify-center text-center py-8">
              <p className="display-number text-3xl text-sm-navy/15 mb-2">00</p>
              <p className="text-[11px] text-sm-text-muted leading-relaxed max-w-[200px]">
                Nothing here. Drop a quick note, reminder, or to-do above.
              </p>
            </li>
          ) : (
            todos.map((t) => (
              <li
                key={t.id}
                className="group flex items-start gap-2.5 py-2 border-b border-sm-border/60 last:border-0"
              >
                <button
                  onClick={() => toggle(t.id)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="focus-ring flex-shrink-0 mt-0.5 rounded-sm"
                  aria-label={t.done ? "Mark incomplete" : "Mark complete"}
                  aria-pressed={t.done}
                >
                  {t.done ? (
                    <span className="flex items-center justify-center h-3.5 w-3.5 bg-sm-success text-white">
                      <Check
                        className="h-2.5 w-2.5"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    </span>
                  ) : (
                    <Square
                      className="h-3.5 w-3.5 text-sm-text-muted group-hover:text-sm-navy transition-colors"
                      aria-hidden="true"
                    />
                  )}
                </button>
                <p
                  className={`flex-1 text-xs leading-relaxed break-words ${
                    t.done
                      ? "line-through text-sm-text-muted"
                      : "text-sm-text"
                  }`}
                >
                  {t.text}
                </p>
                <button
                  onClick={() => remove(t.id)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="focus-ring flex-shrink-0 rounded-sm text-sm-text-muted opacity-0 group-hover:opacity-100 hover:text-sm-danger transition-all"
                  aria-label={`Delete: ${t.text}`}
                >
                  <Trash2 className="h-3 w-3" aria-hidden="true" />
                </button>
              </li>
            ))
          )}
        </ul>

        <p className="mt-3 pt-3 border-t border-sm-border/60 text-[9px] text-sm-text-muted tracking-[0.15em] uppercase text-center">
          Saved locally · {todos.length} item{todos.length === 1 ? "" : "s"}
        </p>
      </div>
    </WidgetShell>
  );
}
