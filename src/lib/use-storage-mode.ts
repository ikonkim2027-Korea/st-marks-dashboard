"use client";

import { useEffect, useState } from "react";

export type StorageMode = "github" | "filesystem";

/**
 * Tells the admin pages whether saves go to a local file (instant) or
 * trigger a GitHub commit + Vercel redeploy (~30s lag). The save-success
 * message uses this to set expectations.
 */
export function useStorageMode(): StorageMode | null {
  const [mode, setMode] = useState<StorageMode | null>(null);
  useEffect(() => {
    let cancel = false;
    fetch("/api/admin/storage-mode")
      .then((r) => r.json())
      .then((d) => {
        if (!cancel) setMode((d?.mode as StorageMode) ?? null);
      })
      .catch(() => {
        if (!cancel) setMode(null);
      });
    return () => {
      cancel = true;
    };
  }, []);
  return mode;
}
