"use server";

import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { auditLog, getDb, guests, invitations } from "@/db";
import { rateKey, rsvpLimiter } from "@/lib/rate-limit";
import { rsvpPayloadSchema } from "@/lib/rsvp-schema";
import { isValidTokenShape } from "@/lib/tokens";

export type ActionResult = { ok: true } | { ok: false };

// Deliberately one generic failure shape: no hint about why.
const FAIL: ActionResult = { ok: false };

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function recordOpen(token: string): Promise<ActionResult> {
  try {
    if (!isValidTokenShape(token)) return FAIL;
    const db = getDb();
    const now = new Date();
    const [row] = await db
      .update(invitations)
      .set({
        firstOpenedAt: sql`coalesce(${invitations.firstOpenedAt}, ${now})`,
        lastOpenedAt: now,
        openCount: sql`${invitations.openCount} + 1`,
      })
      .where(eq(invitations.token, token))
      .returning({ id: invitations.id });
    if (!row) return FAIL;
    await db.insert(auditLog).values({ invitationId: row.id, action: "open", meta: {} });
    return { ok: true };
  } catch {
    return FAIL;
  }
}

export async function submitRsvp(token: string, payload: unknown): Promise<ActionResult> {
  try {
    if (!isValidTokenShape(token)) return FAIL;
    if (!rsvpLimiter.check(rateKey(await clientIp(), token))) return FAIL;
    const parsed = rsvpPayloadSchema.safeParse(payload);
    if (!parsed.success) return FAIL;
    const { guests: input, noteToCouple } = parsed.data;

    const db = getDb();
    return await db.transaction(async (tx) => {
      const [inv] = await tx
        .select()
        .from(invitations)
        .where(eq(invitations.token, token))
        .for("update");
      if (!inv) return FAIL;

      const existing = await tx.select().from(guests).where(eq(guests.invitationId, inv.id));
      const existingIds = new Set(existing.map((g) => g.id));
      const ids = input.map((g) => g.id).filter((x): x is string => !!x);
      // Every referenced guest must belong to this invitation; no duplicates.
      if (new Set(ids).size !== ids.length || ids.some((id) => !existingIds.has(id))) return FAIL;

      const fresh = input.filter((g) => !g.id);
      if (existing.length + fresh.length > inv.maxGuests) return FAIL;
      const attendingCount = input.filter((g) => g.attending).length;
      if (attendingCount > inv.maxGuests) return FAIL;

      const now = new Date();
      for (const g of input.filter((x) => x.id)) {
        await tx
          .update(guests)
          .set({
            name: g.name,
            attending: g.attending,
            dietaryNotes: g.dietaryNotes ?? null,
            updatedAt: now,
          })
          .where(and(eq(guests.id, g.id!), eq(guests.invitationId, inv.id)));
      }
      if (fresh.length) {
        await tx.insert(guests).values(
          fresh.map((g) => ({
            invitationId: inv.id,
            name: g.name,
            isPlusOne: true,
            attending: g.attending,
            dietaryNotes: g.dietaryNotes ?? null,
          })),
        );
      }
      await tx
        .update(invitations)
        .set({ respondedAt: now, noteToCouple: noteToCouple ?? null, updatedAt: now })
        .where(eq(invitations.id, inv.id));
      await tx.insert(auditLog).values({
        invitationId: inv.id,
        action: "rsvp",
        meta: { attending: attendingCount, total: input.length },
      });
      return { ok: true } as ActionResult;
    });
  } catch {
    return FAIL;
  }
}
