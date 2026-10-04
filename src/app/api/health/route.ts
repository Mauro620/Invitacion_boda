import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Lazy import: keeps the route alive even if the DB layer is not wired yet.
    // @ts-ignore - module is provided by the backend layer
    const mod = await import("@/db").catch(() => null);
    if (!mod?.db) {
      return NextResponse.json({ status: "ok", db: "skipped" });
    }
    const { sql } = await import("drizzle-orm");
    await mod.db.execute(sql`select 1`);
    return NextResponse.json({ status: "ok", db: "up" });
  } catch {
    return NextResponse.json({ status: "error", db: "down" }, { status: 503 });
  }
}
