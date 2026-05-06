import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { readLunch, writeLunch, type LunchData } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await readLunch());
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await req.json()) as Partial<LunchData>;
    if (!body || typeof body.menus !== "object" || body.menus === null) {
      return NextResponse.json(
        { error: "invalid payload: missing 'menus' object" },
        { status: 400 },
      );
    }
    await writeLunch({ menus: body.menus });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "save failed" },
      { status: 500 },
    );
  }
}
