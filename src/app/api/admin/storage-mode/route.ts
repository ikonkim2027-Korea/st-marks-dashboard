import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { getStorageMode } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json({ mode: getStorageMode() });
}
