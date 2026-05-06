import { NextResponse } from "next/server";
import { readLinks } from "@/lib/data-store";

// Re-read the file on every request so admin edits show up immediately.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readLinks();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      {
        updated: null,
        categories: [],
        error: e instanceof Error ? e.message : "unknown",
      },
      { status: 500 },
    );
  }
}
