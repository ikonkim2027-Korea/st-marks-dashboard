"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Settings,
  X,
} from "lucide-react";

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

  if (diffMs < 0) return { label: "Past due", urgent: true };
  if (diffHours < 6) return { label: `${diffHours}h left`, urgent: true };
  if (diffHours < 24)
    return { label: `${diffHours}h left`, urgent: diffHours < 12 };
  if (diffDays === 1) return { label: "Tomorrow", urgent: false };
  return { label: `${diffDays} days`, urgent: false };
}

function formatDueDate(dueDate: string): string {
  const d = new Date(dueDate);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CanvasAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [config, setConfig] = useState<CanvasConfig | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [domainInput, setDomainInput] = useState("stmarks.instructure.com");

  // Load config from localStorage
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

  // Fetch when config is available
  useEffect(() => {
    if (config) {
      fetchAssignments(config);
    }
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

  // No config — show setup prompt
  if (!config && !showSetup) {
    return (
      <div className="widget-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-sm-orange" />
            <h3 className="text-xs font-semibold text-sm-text-light uppercase tracking-wider">
              Assignments Due
            </h3>
          </div>
        </div>
        <div className="rounded-xl bg-sm-navy/5 p-4 text-center">
          <BookOpen className="h-8 w-8 text-sm-navy/30 mx-auto mb-2" />
          <p className="text-sm font-medium text-sm-text mb-1">
            Connect Your Canvas
          </p>
          <p className="text-xs text-sm-text-muted mb-3">
            See upcoming assignments from all your courses
          </p>
          <button
            onClick={() => setShowSetup(true)}
            className="rounded-lg bg-sm-navy px-4 py-2 text-xs font-medium text-white hover:bg-sm-navy-light transition-colors"
          >
            Set Up Canvas
          </button>
        </div>
      </div>
    );
  }

  // Setup form
  if (showSetup) {
    return (
      <div className="widget-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-sm-gold" />
            <h3 className="text-xs font-semibold text-sm-text-light uppercase tracking-wider">
              Canvas Setup
            </h3>
          </div>
          <button
            onClick={() => setShowSetup(false)}
            className="text-sm-text-muted hover:text-sm-text transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-sm-text-light block mb-1">
              Canvas Domain
            </label>
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="stmarks.instructure.com"
              className="w-full rounded-lg border border-sm-border bg-sm-offwhite px-3 py-2 text-xs text-sm-text placeholder:text-sm-text-muted focus:outline-none focus:ring-2 focus:ring-sm-navy/20"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-sm-text-light block mb-1">
              Access Token
            </label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Paste your Canvas access token"
              className="w-full rounded-lg border border-sm-border bg-sm-offwhite px-3 py-2 text-xs text-sm-text placeholder:text-sm-text-muted focus:outline-none focus:ring-2 focus:ring-sm-navy/20"
            />
            <p className="text-[10px] text-sm-text-muted mt-1">
              Canvas &rarr; Account &rarr; Settings &rarr; New Access Token
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveConfig}
              disabled={!tokenInput.trim()}
              className="flex-1 rounded-lg bg-sm-navy px-3 py-2 text-xs font-medium text-white hover:bg-sm-navy-light transition-colors disabled:opacity-40"
            >
              Connect
            </button>
            {config && (
              <button
                onClick={clearConfig}
                className="rounded-lg border border-sm-danger/30 px-3 py-2 text-xs font-medium text-sm-danger hover:bg-sm-danger/5 transition-colors"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="widget-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-sm-orange" />
          <h3 className="text-xs font-semibold text-sm-text-light uppercase tracking-wider">
            Assignments Due
          </h3>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-sm-cream" />
          ))}
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="widget-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-sm-orange" />
            <h3 className="text-xs font-semibold text-sm-text-light uppercase tracking-wider">
              Assignments Due
            </h3>
          </div>
          <button
            onClick={() => setShowSetup(true)}
            className="text-sm-text-muted hover:text-sm-text transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-xl bg-sm-danger/5 p-3 text-center">
          <AlertCircle className="h-5 w-5 text-sm-danger mx-auto mb-1" />
          <p className="text-xs text-sm-danger">{error}</p>
          <button
            onClick={() => config && fetchAssignments(config)}
            className="mt-2 text-xs text-sm-navy hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Assignments list
  const pending = assignments.filter(
    (a) =>
      a.due_at && a.submission?.workflow_state !== "graded"
  );

  return (
    <div className="widget-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-sm-orange" />
          <h3 className="text-xs font-semibold text-sm-text-light uppercase tracking-wider">
            Assignments Due
          </h3>
          {pending.length > 0 && (
            <span className="rounded-full bg-sm-orange/15 px-1.5 py-0.5 text-[10px] font-bold text-sm-orange">
              {pending.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowSetup(true)}
          className="text-sm-text-muted hover:text-sm-text transition-colors"
        >
          <Settings className="h-3.5 w-3.5" />
        </button>
      </div>

      {pending.length === 0 ? (
        <div className="rounded-xl bg-sm-success/5 p-4 text-center">
          <CheckCircle2 className="h-6 w-6 text-sm-success mx-auto mb-1" />
          <p className="text-sm font-medium text-sm-text">All caught up!</p>
          <p className="text-xs text-sm-text-muted">
            No upcoming assignments due
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {pending.map((a) => {
            const timeLeft = a.due_at
              ? getTimeLeft(a.due_at)
              : { label: "No date", urgent: false };
            return (
              <a
                key={a.id}
                href={a.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between rounded-lg bg-sm-cream/50 px-3 py-2.5 hover:bg-sm-cream transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-sm-text truncate group-hover:text-sm-navy transition-colors">
                    {a.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-sm-text-muted truncate">
                      {a.course_name}
                    </span>
                    {a.due_at && (
                      <span className="text-[11px] text-sm-text-muted flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />
                        {formatDueDate(a.due_at)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      timeLeft.urgent
                        ? "bg-sm-danger/10 text-sm-danger"
                        : "bg-sm-navy/10 text-sm-navy"
                    }`}
                  >
                    {timeLeft.label}
                  </span>
                  <ExternalLink className="h-3 w-3 text-sm-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
