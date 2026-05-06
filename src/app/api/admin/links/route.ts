import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import {
  readLinksFresh,
  writeLinks,
  type LinksData,
} from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await readLinksFresh());
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = (await req.json()) as Partial<LinksData>;
    if (!body || !Array.isArray(body.categories)) {
      return NextResponse.json(
        { error: "invalid payload: missing 'categories' array" },
        { status: 400 },
      );
    }
    for (const c of body.categories) {
      if (
        !c ||
        typeof c.id !== "string" ||
        typeof c.label !== "string" ||
        !Array.isArray(c.links)
      ) {
        return NextResponse.json(
          { error: "invalid category entry" },
          { status: 400 },
        );
      }
      for (const l of c.links) {
        if (
          !l ||
          typeof l.id !== "string" ||
          typeof l.name !== "string" ||
          typeof l.url !== "string" ||
          typeof l.icon !== "string"
        ) {
          return NextResponse.json(
            { error: "invalid link entry" },
            { status: 400 },
          );
        }
      }
    }
    await writeLinks({ categories: body.categories });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "save failed" },
      { status: 500 },
    );
  }
}
