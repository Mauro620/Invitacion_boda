import type { InvitationStatus } from "@/lib/stats";

export type { InvitationStatus };

export type StatusFilter = "all" | InvitationStatus;

export type DashboardStats = {
  /** Guests across all invitations. */
  totalPeople: number;
  /** Guests with attending === true. */
  confirmed: number;
  /** Guests with attending === false. */
  declined: number;
  /** Guests with attending === null. */
  pending: number;
  /** Invitations opened at least once with no response. */
  openedNoReply: number;
  invitations: number;
  /** RSVP deadline as ISO string, or null while wedding.rsvpDeadline is a placeholder. */
  deadlineIso: string | null;
};

export type GuestRow = {
  id: string;
  name: string;
  isPlusOne: boolean;
  attending: boolean | null;
  dietaryNotes: string | null;
};

/** All dates are ISO strings (safe to pass to client components). */
export type InvitationRow = {
  id: string;
  token: string;
  /** Full guest link: PUBLIC_BASE_URL + /i/ + token. */
  url: string;
  displayName: string;
  maxGuests: number;
  phone: string | null;
  tag: string;
  personalMessage: string | null;
  sentAt: string | null;
  firstOpenedAt: string | null;
  lastOpenedAt: string | null;
  openCount: number;
  respondedAt: string | null;
  noteToCouple: string | null;
  status: InvitationStatus;
  guests: GuestRow[];
};

export type ListInvitationsFilter = {
  /** Case-insensitive match on group name or guest name. */
  q?: string;
  tag?: string;
  status?: StatusFilter;
};

export type ListInvitationsResult = {
  rows: InvitationRow[];
  /** Distinct tags across all invitations (for the filter control). */
  tags: string[];
};

/** Input for saveInvitation. Pass `id` to update, omit to create. */
export type SaveInvitationInput = {
  id?: string;
  displayName: string;
  maxGuests: number;
  phone?: string | null;
  tag: string;
  personalMessage?: string | null;
  /** Existing guests keep their `id` (and RSVP answers); guests missing from the list are deleted. */
  guests: { id?: string; name: string; isPlusOne?: boolean }[];
};

export type SaveInvitationResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export type RegenerateTokenResult =
  | { ok: true; token: string; url: string }
  | { ok: false; error: string };

export type SimpleResult = { ok: true } | { ok: false; error: string };

export type ImportPreviewRow = {
  /** 1-based line in the file (header = line 1). */
  line: number;
  displayName: string;
  phone: string | null;
  tag: string;
  guests: string[];
  errors: string[];
  /** Duplicate of an earlier row or of an existing invitation: skipped on commit. */
  duplicate: boolean;
  /** true when no errors and not duplicate: will be created on commit. */
  willImport: boolean;
};

export type ImportPreview = {
  fileError: string | null;
  rows: ImportPreviewRow[];
  importCount: number;
  errorCount: number;
  duplicateCount: number;
};

export type ImportCommitResult =
  | { ok: true; created: number; skipped: number; errors: { line: number; errors: string[] }[] }
  | { ok: false; error: string };

export type CommentRow = {
  id: string;
  displayName: string;
  note: string;
  respondedAt: string | null;
};

export type WhatsAppLink = {
  /** wa.me link with greeting + guest URL. */
  whatsapp: string;
  /** Guest URL (for "Copiar enlace"). */
  url: string;
};
