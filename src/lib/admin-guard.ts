import "server-only";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ADMIN_EMAILS } from "@/auth.config";

/**
 * Used by /api/admin/* routes. Resolves the current session and 401s if the
 * caller isn't on the allowlist. Middleware already redirects browser
 * navigations to /admin/login, but API mutations need their own check —
 * the matcher doesn't run on /api routes, and even if it did, we'd want a
 * proper 401 here rather than a redirect.
 */
export async function requireAdmin(): Promise<Response | null> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email || !ADMIN_EMAILS.has(email)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401 },
    );
  }
  return null;
}
