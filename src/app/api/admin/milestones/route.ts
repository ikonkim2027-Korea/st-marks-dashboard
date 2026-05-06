import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import {
  readMilestonesFresh,
  writeMilestones,
  type MilestonesData,
} from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await readMilestonesFresh());
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await req.json()) as Partial<MilestonesData>;
    if (!body || !Array.isArray(body.milestones)) {
      return NextResponse.json(
        { error: "invalid payload: missing 'milestones' array" },
        { status: 400 },
      );
    }
    // Light validation — reject obviously bad shapes.
    for (const m of body.milestones) {
      if (
        !m ||
        typeof m.id !== "string" ||
        typeof m.label !== "string" ||
        typeof m.date !== "string"
      ) {
        return NextResponse.json(
          { error: "invalid milestone entry" },
          { status: 400 },
        );
      }
    }
    await writeMilestones({ milestones: body.milestones });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "save failed" },
      { status: 500 },
    );
  }
}
