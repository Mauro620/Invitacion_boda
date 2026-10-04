const TIMEZONE = "America/Bogota";
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Parses the RSVP deadline. Date-only values close at the end of that day in
 * Bogota. Placeholders ("TODO", empty) or unparseable text return null,
 * which callers treat as "still open".
 */
export function parseDeadline(raw: string | null | undefined): Date | null {
  const s = raw?.trim();
  if (!s || /todo/i.test(s)) return null;
  const m = DATE_ONLY.exec(s);
  if (m) {
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const check = new Date(Date.UTC(y, mo - 1, d));
    if (check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d) return null;
    return new Date(`${s}T23:59:59.999-05:00`);
  }
  const date = new Date(s);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isRsvpOpen(raw: string | null | undefined, now: Date = new Date()): boolean {
  const deadline = parseDeadline(raw);
  return deadline === null || now.getTime() <= deadline.getTime();
}

/** Human label for the deadline, or null when there is nothing real to show. */
export function formatDeadline(raw: string | null | undefined): string | null {
  const s = raw?.trim();
  if (!s || /todo/i.test(s)) return null;
  const date = parseDeadline(s);
  if (!date) return s;
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeZone: TIMEZONE }).format(date);
}
