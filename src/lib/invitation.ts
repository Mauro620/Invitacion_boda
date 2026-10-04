import { asc, eq } from "drizzle-orm";
import { cache } from "react";
import { getDb, guests, invitations } from "@/db";
import { isValidTokenShape } from "./tokens";

/** One query per request, shared by the page, metadata and (separately) the OG image. */
export const getInvitationByToken = cache(async (token: string) => {
  if (!isValidTokenShape(token)) return null;
  const db = getDb();
  const [invitation] = await db.select().from(invitations).where(eq(invitations.token, token));
  if (!invitation) return null;
  const rows = await db
    .select()
    .from(guests)
    .where(eq(guests.invitationId, invitation.id))
    .orderBy(asc(guests.isPlusOne), asc(guests.name));
  return { invitation, guests: rows };
});
