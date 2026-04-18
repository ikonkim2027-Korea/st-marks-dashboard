"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Info,
  Settings,
  X,
} from "lucide-react";
import { WidgetShell } from "./widget-shell";

interface Assignment {
  id: number;
  name: string;
  due_at: string | null;
  course_name: string;
  html_url: string;
  points_possible: number | null;
  submission?: {
    submitted_at: string | null;
    workflow_state: string;
  };
}

interface CanvasConfig {
  token: string;
  domain: string;
}

const STORAGE_KEY = "sm-hub-canvas-config";

function getTimeLeft(dueDate: string): { label: string; urgent: boolean } {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) return { label: "PAST DUE", urgent: true };
  if (diffHours < 6) return { label: `${diffHours}H LEFT`, urgent: true };
  if (diffHours < 24)
    return { label: `${diffHours}H LEFT`, urgent: diffHours < 12 };
  if (diffDays === 1) return { label: "TOMORROW", urgent: false };
  return { label: `${diffDays} DAYS`, urgent: false };
}

function formatDueDate(dueDate: string): string {
  const d = new Date(dueDate);
  return d
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
    .toUpperCase();
}

export function CanvasWidget() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [config, setConfig] = useState<CanvasConfig | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [domainInput, setDomainInput] = useState("stmarks.instructure.com");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const fetchAssignments = useCallback(async (cfg: CanvasConfig) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/canvas?domain=${encodeURIComponent(cfg.domain)}&token=${encodeURIComponent(cfg.token)}`
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch");
      }
      const data = await res.json();
      setAssignments(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load assignments"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (config) fetchAssignments(config);
  }, [config, fetchAssignments]);

  function saveConfig() {
    if (!tokenInput.trim()) return;
    const cfg: CanvasConfig = {
      token: tokenInput.trim(),
      domain: domainInput.trim() || "stmarks.instructure.com",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    setConfig(cfg);
    setShowSetup(false);
    setTokenInput("");
  }

  function clearConfig() {
    localStorage.removeItem(STORAGE_KEY);
    setConfig(null);
    setAssignments([]);
    setShowSetup(false);
  }

  const pending = assignments.filter(
    (a) => a.due_at && a.submission?.workflow_state !== "graded"
  );

  // Header "settings" button only shows when we have a saved config (to match legacy UX).
  const headerExtra = config ? (
    <button
      onClick={() => setShowSetup(true)}
      onMouseDown={(e) => e.stopPropagation()}
      className="text-sm-text-muted hover:text-sm-text transition-colors"
      aria-label="Canvas settings"
    >
      <Settings className="h-3.5 w-3.5" />
    </button>
  ) : null;

  const eyebrowLabel = showSetup ? "CANVAS SETUP" : "ASSIGNMENTS";
  const titleLabel = "Canvas";

  // Connect prompt (no config, not in setup)
  if (!config && !showSetup) {
    return (
      <WidgetShell
        title={titleLabel}
        eyebrow={eyebrowLabel}
        accent="orange"
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
            <p className="display-number text-[44px] text-sm-navy/20 mb-3">00</p>
            <p className="text-sm font-bold text-sm-text mb-1">Not Connected</p>
            <p className="text-[11px] text-sm-text-muted max-w-[260px] mb-5 leading-relaxed">
              View upcoming assignments from Canvas.
              <br />
              Requires an API token from the school.
            </p>
            <button
              onClick={() => setShowSetup(true)}
              className="text-[10px] font-bold uppercase tracking-[0.15em] text-sm-navy hover:text-sm-navy-light border-b border-sm-navy pb-0.5 transition-colors"
            >
              Enter API Token →
            </button>
          </div>

          <div className="flex items-start gap-2 pt-4 border-t border-sm-border/60">
            <Info className="h-3 w-3 text-sm-gold mt-0.5 flex-shrink-0" />
            <p className="text-[9px] text-sm-text-muted leading-relaxed">
              Student token generation is disabled. Contact{" "}
              <a
                href="mailto:ikonkim@stmarksschool.org"
                className="underline underline-offset-2 hover:text-sm-navy"
              >
                ikonkim@stmarksschool.org
              </a>
              {" "}or IT Help Desk.
            </p>
          </div>
        </div>
      </WidgetShell>
    );
  }

  // Setup form
  if (showSetup) {
    return (
      <WidgetShell
        title={titleLabel}
        eyebrow={eyebrowLabel}
        accent="orange"
        headerExtra={
          <button
            onClick={() => setShowSetup(false)}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-sm-text-muted hover:text-sm-text transition-colors"
            aria-label="Close setup"
          >
            <X className="h-4 w-4" />
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label-micro block mb-1.5">Canvas Domain</label>
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="stmarks.instructure.com"
              className="w-full border-0 border-b border-sm-border bg-transparent px-0 py-2 text-xs text-sm-text placeholder:text-sm-text-muted focus:outline-none focus:border-sm-navy transition-colors"
            />
          </div>
          <div>
            <label className="label-micro block mb-1.5">API Token</label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste token from IT"
              className="w-full border-0 border-b border-sm-border bg-transparent px-0 py-2 text-xs text-sm-text placeholder:text-sm-text-muted focus:outline-none focus:border-sm-navy transition-colors"
            />
            <p className="text-[9px] text-sm-text-muted mt-1.5">
              Stored locally in browser only
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={saveConfig}
              disabled={!tokenInput.trim()}
              className="flex-1 bg-sm-navy px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white hover:bg-sm-navy-light transition-colors disabled:opacity-40"
            >
              Connect
            </button>
            {config && (
              <button
                onClick={clearConfig}
                className="border border-sm-danger/40 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-sm-danger hover:bg-sm-danger/5 transition-colors"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </WidgetShell>
    );
  }

  return (
    <WidgetShell
      title={titleLabel}
      eyebrow={
        pending.length > 0
          ? `ASSIGNMENTS · ${String(pending.length).padStart(2, "0")}`
          : "ASSIGNMENTS"
      }
      accent="orange"
      headerExtra={headerExtra}
    >
      {loading ? (
        <div className="space-y-2 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-sm-cream" />
          ))}
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center h-full">
          <AlertCircle className="h-5 w-5 text-sm-danger mb-2" />
          <p className="text-xs text-sm-danger">{error}</p>
          <button
            onClick={() => config && fetchAssignments(config)}
            className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-sm-navy hover:underline"
          >
            Retry
          </button>
        </div>
      ) : pending.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center h-full">
          <CheckCircle2 className="h-8 w-8 text-sm-success mb-3" />
          <p className="display-number text-2xl text-sm-text mb-1">
            ALL CAUGHT UP
          </p>
          <p className="text-[11px] text-sm-text-muted">
            No upcoming assignments due
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-0">
          {pending.slice(0, 6).map((a) => {
            const timeLeft = a.due_at
              ? getTimeLeft(a.due_at)
              : { label: "NO DATE", urgent: false };
            return (
              <a
                key={a.id}
                href={a.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between gap-3 py-3 border-b border-sm-border/60 last:border-0 group ${
                  timeLeft.urgent
                    ? "border-l-2 border-l-sm-gold pl-3 -ml-3"
                    : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-sm-text truncate group-hover:text-sm-navy transition-colors">
                    {a.name}
                  </h4>
                  <p className="label-micro mt-1 truncate">
                    {a.course_name}
                    {a.due_at && (
                      <span className="text-sm-text-muted normal-case tracking-normal">
                        <span className="mx-1.5">·</span>
                        <span className="tabular">{formatDueDate(a.due_at)}</span>
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-[10px] font-bold tracking-[0.1em] tabular ${
                      timeLeft.urgent ? "text-sm-danger" : "text-sm-navy"
                    }`}
                  >
                    {timeLeft.label}
                  </span>
                  <ArrowUpRight className="h-3 w-3 text-sm-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </WidgetShell>
  );
}
