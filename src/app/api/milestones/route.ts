import { NextResponse } from "next/server";
import { readMilestones } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readMilestones();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      {
        updated: null,
        milestones: [],
        error: e instanceof Error ? e.message : "unknown",
      },
      { status: 500 },
    );
  }
}
