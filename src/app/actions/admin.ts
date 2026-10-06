"use server";

import { and, asc, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { z } from "zod";
import { auditLog, getDb, guests, invitations, type Guest, type Invitation } from "@/db";
import { wedding } from "@/content/wedding";
import { requireAdmin } from "@/lib/auth";
import { normalizeName, parseImport, toCsv } from "@/lib/csv";
import { generateToken } from "@/lib/tokens";
import { computeStats, invitationStatus, parseDeadline } from "@/lib/stats";
import { baseUrl } from "@/lib/base-url";
import { buildInviteMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import type {
  CommentRow,
  DashboardStats,
  GuestRow,
  ImportCommitResult,
  ImportPreview,
  InvitationRow,
  ListInvitationsFilter,
  ListInvitationsResult,
  RegenerateTokenResult,
  SaveInvitationInput,
  SaveInvitationResult,
  SimpleResult,
  WhatsAppLink,
} from "./admin.types";

const urlFor = (token: string) => `${baseUrl()}/i/${token}`;
const iso = (d: Date | null) => (d ? d.toISOString() : null);
const idSchema = z.string().uuid();

function toGuestRow(g: Guest): GuestRow {
  return {
    id: g.id,
    name: g.name,
    isPlusOne: g.isPlusOne,
    attending: g.attending,
    dietaryNotes: g.dietaryNotes,
  };
}

function toRow(inv: Invitation, gs: Guest[]): InvitationRow {
  return {
    id: inv.id,
    token: inv.token,
    url: urlFor(inv.token),
    displayName: inv.displayName,
    maxGuests: inv.maxGuests,
    phone: inv.phone,
    tag: inv.tag,
    personalMessage: inv.personalMessage,
    sentAt: iso(inv.sentAt),
    firstOpenedAt: iso(inv.firstOpenedAt),
    lastOpenedAt: iso(inv.lastOpenedAt),
    openCount: inv.openCount,
    respondedAt: iso(inv.respondedAt),
    noteToCouple: inv.noteToCouple,
    status: invitationStatus({ openCount: inv.openCount, respondedAt: inv.respondedAt, guests: gs }),
    guests: gs.map(toGuestRow),
  };
}

async function loadAll(): Promise<InvitationRow[]> {
  const db = getDb();
  const [invs, gs] = await Promise.all([
    db.select().from(invitations).orderBy(asc(invitations.displayName)),
    db.select().from(guests).orderBy(asc(guests.name)),
  ]);
  const byInv = new Map<string, Guest[]>();
  for (const g of gs) {
    const list = byInv.get(g.invitationId);
    if (list) list.push(g);
    else byInv.set(g.invitationId, [g]);
  }
  return invs.map((inv) => toRow(inv, byInv.get(inv.id) ?? []));
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();
  const db = getDb();
  const [invs, gs] = await Promise.all([
    db.select().from(invitations),
    db.select().from(guests),
  ]);
  const byInv = new Map<string, Guest[]>();
  for (const g of gs) byInv.set(g.invitationId, [...(byInv.get(g.invitationId) ?? []), g]);
  const counts = computeStats(
    invs.map((i) => ({
      openCount: i.openCount,
      respondedAt: i.respondedAt,
      guests: byInv.get(i.id) ?? [],
    })),
  );
  return { ...counts, deadlineIso: parseDeadline(String(wedding.rsvpDeadline)) };
}

export async function listInvitations(
  filter: ListInvitationsFilter = {},
): Promise<ListInvitationsResult> {
  await requireAdmin();
  const all = await loadAll();
  const q = filter.q ? normalizeName(filter.q) : "";
  const status = filter.status ?? "all";
  const rows = all.filter((r) => {
    if (filter.tag && r.tag !== filter.tag) return false;
    if (status !== "all" && r.status !== status) return false;
    if (q) {
      const hay = [r.displayName, ...r.guests.map((g) => g.name)].map(normalizeName);
      if (!hay.some((h) => h.includes(q))) return false;
    }
    return true;
  });
  return { rows, tags: [...new Set(all.map((r) => r.tag))].sort() };
}

export async function getInvitation(id: string): Promise<InvitationRow | null> {
  await requireAdmin();
  if (!idSchema.safeParse(id).success) return null;
  const db = getDb();
  const [inv] = await db.select().from(invitations).where(eq(invitations.id, id));
  if (!inv) return null;
  const gs = await db.select().from(guests).where(eq(guests.invitationId, id));
  return toRow(inv, gs);
}

const saveSchema = z
  .object({
    id: z.string().uuid().optional(),
    displayName: z.string().trim().min(1, "Escribe el nombre del grupo.").max(120),
    maxGuests: z.number().int().min(1, "Mínimo 1 cupo.").max(20, "Máximo 20 cupos."),
    phone: z
      .string()
      .trim()
      .max(30)
      .regex(/^[+\d][\d\s()-]{5,24}$/, "Teléfono no válido.")
      .optional()
      .nullable()
      .or(z.literal("").transform(() => null)),
    tag: z.string().trim().toLowerCase().min(1, "Elige una etiqueta.").max(30),
    personalMessage: z.string().trim().max(1000).optional().nullable(),
    guests: z
      .array(
        z.object({
          id: z.string().uuid().optional(),
          name: z.string().trim().min(1, "Falta un nombre.").max(120),
          isPlusOne: z.boolean().optional(),
        }),
      )
      .min(1, "Agrega al menos un invitado.")
      .max(20),
  })
  .refine((v) => v.guests.length <= v.maxGuests, {
    path: ["guests"],
    message: "Hay más invitados que cupos.",
  });

export async function saveInvitation(input: SaveInvitationInput): Promise<SaveInvitationResult> {
  await requireAdmin();
  const parsed = saveSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, error: "Revisa los datos.", fieldErrors };
  }
  const v = parsed.data;
  const values = {
    displayName: v.displayName,
    maxGuests: v.maxGuests,
    phone: v.phone || null,
    tag: v.tag,
    personalMessage: v.personalMessage || null,
  };
  try {
    return await getDb().transaction(async (tx): Promise<SaveInvitationResult> => {
      const now = new Date();
      if (!v.id) {
        const [inv] = await tx
          .insert(invitations)
          .values({ ...values, token: generateToken() })
          .returning({ id: invitations.id });
        await tx.insert(guests).values(
          v.guests.map((g) => ({
            invitationId: inv.id,
            name: g.name,
            isPlusOne: g.isPlusOne ?? false,
          })),
        );
        await tx.insert(auditLog).values({ invitationId: inv.id, action: "edit", meta: { op: "create" } });
        return { ok: true, id: inv.id };
      }
      const [inv] = await tx
        .select({ id: invitations.id })
        .from(invitations)
        .where(eq(invitations.id, v.id))
        .for("update");
      if (!inv) return { ok: false, error: "No encontramos esa invitación." };
      const existing = await tx.select().from(guests).where(eq(guests.invitationId, v.id));
      const existingIds = new Set(existing.map((g) => g.id));
      const keep = v.guests.filter((g) => g.id);
      const keepIds = keep.map((g) => g.id!);
      if (new Set(keepIds).size !== keepIds.length || keepIds.some((id) => !existingIds.has(id))) {
        return { ok: false, error: "Invitados no válidos." };
      }
      const drop = existing.filter((g) => !keepIds.includes(g.id)).map((g) => g.id);
      if (drop.length) await tx.delete(guests).where(inArray(guests.id, drop));
      for (const g of keep) {
        await tx
          .update(guests)
          .set({ name: g.name, isPlusOne: g.isPlusOne ?? false, updatedAt: now })
          .where(and(eq(guests.id, g.id!), eq(guests.invitationId, v.id)));
      }
      const fresh = v.guests.filter((g) => !g.id);
      if (fresh.length) {
        await tx.insert(guests).values(
          fresh.map((g) => ({
            invitationId: v.id!,
            name: g.name,
            isPlusOne: g.isPlusOne ?? false,
          })),
        );
      }
      await tx
        .update(invitations)
        .set({ ...values, updatedAt: now })
        .where(eq(invitations.id, v.id));
      await tx.insert(auditLog).values({ invitationId: v.id, action: "edit", meta: { op: "update" } });
      return { ok: true, id: v.id };
    });
  } catch {
    return { ok: false, error: "No pudimos guardar. Inténtalo de nuevo." };
  }
}

export async function regenerateToken(id: string): Promise<RegenerateTokenResult> {
  await requireAdmin();
  if (!idSchema.safeParse(id).success) return { ok: false, error: "Invitación no válida." };
  try {
    const db = getDb();
    const token = generateToken();
    const [row] = await db
      .update(invitations)
      .set({ token, updatedAt: new Date() })
      .where(eq(invitations.id, id))
      .returning({ id: invitations.id });
    if (!row) return { ok: false, error: "No encontramos esa invitación." };
    await db.insert(auditLog).values({ invitationId: id, action: "edit", meta: { op: "regenerate_token" } });
    return { ok: true, token, url: urlFor(token) };
  } catch {
    return { ok: false, error: "No pudimos regenerar el enlace." };
  }
}

export async function markSent(id: string): Promise<SimpleResult> {
  await requireAdmin();
  if (!idSchema.safeParse(id).success) return { ok: false, error: "Invitación no válida." };
  try {
    const db = getDb();
    const [row] = await db
      .update(invitations)
      .set({ sentAt: new Date(), updatedAt: new Date() })
      .where(eq(invitations.id, id))
      .returning({ id: invitations.id });
    if (!row) return { ok: false, error: "No encontramos esa invitación." };
    await db.insert(auditLog).values({ invitationId: id, action: "edit", meta: { op: "mark_sent" } });
    return { ok: true };
  } catch {
    return { ok: false, error: "No pudimos marcarla como enviada." };
  }
}

async function buildPreview(text: string): Promise<ImportPreview> {
  const parsed = parseImport(text);
  if (parsed.fileError) {
    return { fileError: parsed.fileError, rows: [], importCount: 0, errorCount: 0, duplicateCount: 0 };
  }
  const existing = await getDb().select({ name: invitations.displayName }).from(invitations);
  const existingKeys = new Set(existing.map((e) => normalizeName(e.name)));
  const rows = parsed.rows.map((r) => {
    const duplicate = r.duplicateInFile || existingKeys.has(normalizeName(r.displayName));
    return {
      line: r.line,
      displayName: r.displayName,
      phone: r.phone,
      tag: r.tag,
      guests: r.guests,
      errors: r.errors,
      duplicate,
      willImport: r.errors.length === 0 && !duplicate,
    };
  });
  return {
    fileError: null,
    rows,
    importCount: rows.filter((r) => r.willImport).length,
    errorCount: rows.filter((r) => r.errors.length > 0).length,
    duplicateCount: rows.filter((r) => r.duplicate).length,
  };
}

const MAX_CSV_CHARS = 500_000;

export async function importCsvPreview(text: string): Promise<ImportPreview> {
  await requireAdmin();
  if (typeof text !== "string" || text.length > MAX_CSV_CHARS) {
    return { fileError: "Archivo no válido o muy grande.", rows: [], importCount: 0, errorCount: 0, duplicateCount: 0 };
  }
  return buildPreview(text);
}

export async function importCsvCommit(text: string): Promise<ImportCommitResult> {
  await requireAdmin();
  if (typeof text !== "string" || text.length > MAX_CSV_CHARS) {
    return { ok: false, error: "Archivo no válido o muy grande." };
  }
  const preview = await buildPreview(text);
  if (preview.fileError) return { ok: false, error: preview.fileError };
  const toCreate = preview.rows.filter((r) => r.willImport);
  try {
    await getDb().transaction(async (tx) => {
      for (const r of toCreate) {
        const [inv] = await tx
          .insert(invitations)
          .values({
            token: generateToken(),
            displayName: r.displayName,
            maxGuests: r.guests.length,
            phone: r.phone,
            tag: r.tag,
          })
          .returning({ id: invitations.id });
        await tx.insert(guests).values(r.guests.map((name) => ({ invitationId: inv.id, name })));
      }
      if (toCreate.length) {
        await tx.insert(auditLog).values({ action: "edit", meta: { op: "import", count: toCreate.length } });
      }
    });
  } catch {
    return { ok: false, error: "No pudimos importar. No se guardó nada." };
  }
  return {
    ok: true,
    created: toCreate.length,
    skipped: preview.rows.length - toCreate.length,
    errors: preview.rows
      .filter((r) => r.errors.length > 0)
      .map((r) => ({ line: r.line, errors: r.errors })),
  };
}

/** Catering list: attending guests only, with dietary notes. */
export async function exportCateringCsv(): Promise<string> {
  await requireAdmin();
  const rows = await getDb()
    .select({
      group: invitations.displayName,
      tag: invitations.tag,
      name: guests.name,
      notes: guests.dietaryNotes,
    })
    .from(guests)
    .innerJoin(invitations, eq(guests.invitationId, invitations.id))
    .where(eq(guests.attending, true))
    .orderBy(asc(invitations.displayName), asc(guests.name));
  return toCsv(
    ["grupo", "etiqueta", "nombre", "restricciones_alimentarias"],
    rows.map((r) => [r.group, r.tag, r.name, r.notes]),
  );
}

export async function listMessages(): Promise<CommentRow[]> {
  await requireAdmin();
  const rows = await getDb()
    .select({
      id: invitations.id,
      displayName: invitations.displayName,
      note: invitations.noteToCouple,
      respondedAt: invitations.respondedAt,
    })
    .from(invitations)
    .where(isNotNull(invitations.noteToCouple))
    .orderBy(desc(invitations.respondedAt));
  return rows
    .filter((r) => r.note && r.note.trim() !== "")
    .map((r) => ({
      id: r.id,
      displayName: r.displayName,
      note: r.note!,
      respondedAt: iso(r.respondedAt),
    }));
}

export async function whatsappLinkFor(id: string): Promise<WhatsAppLink | null> {
  await requireAdmin();
  if (!idSchema.safeParse(id).success) return null;
  const [inv] = await getDb().select().from(invitations).where(eq(invitations.id, id));
  if (!inv) return null;
  const url = urlFor(inv.token);
  return { url, whatsapp: buildWhatsAppLink(inv.phone, buildInviteMessage(inv.displayName, url)) };
}
