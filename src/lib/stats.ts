export type InvitationStatus = "pending" | "confirmed" | "declined" | "opened";

export type StatsGuest = { attending: boolean | null };
export type StatsInvitation = {
  openCount: number;
  respondedAt: Date | string | null;
  guests: StatsGuest[];
};

export type DashboardCounts = {
  totalPeople: number;
  confirmed: number;
  declined: number;
  pending: number;
  openedNoReply: number;
  invitations: number;
};

/**
 * Status of one invitation:
 * - not responded + never opened -> pending
 * - not responded + opened       -> opened
 * - responded, someone attends   -> confirmed
 * - responded, nobody attends    -> declined
 */
export function invitationStatus(inv: StatsInvitation): InvitationStatus {
  if (!inv.respondedAt) return inv.openCount > 0 ? "opened" : "pending";
  return inv.guests.some((g) => g.attending === true) ? "confirmed" : "declined";
}

/** People-level counts (guests), plus invitation-level openedNoReply. */
export function computeStats(list: StatsInvitation[]): DashboardCounts {
  const out: DashboardCounts = {
    totalPeople: 0,
    confirmed: 0,
    declined: 0,
    pending: 0,
    openedNoReply: 0,
    invitations: list.length,
  };
  for (const inv of list) {
    if (!inv.respondedAt && inv.openCount > 0) out.openedNoReply += 1;
    for (const g of inv.guests) {
      out.totalPeople += 1;
      if (g.attending === true) out.confirmed += 1;
      else if (g.attending === false) out.declined += 1;
      else out.pending += 1;
    }
  }
  return out;
}

/** ISO string if `value` parses as a date, else null (e.g. the "TODO" placeholder). */
export function parseDeadline(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return null;
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}
