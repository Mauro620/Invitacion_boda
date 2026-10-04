import type { InvitationStatus } from "@/app/actions/admin.types";

export const STATUS_LABEL: Record<InvitationStatus, string> = {
  pending: "Sin abrir",
  opened: "Abierta",
  confirmed: "Confirmada",
  declined: "No asiste",
};

const tone: Record<InvitationStatus, string> = {
  pending: "border border-line bg-paper text-ink-soft",
  opened: "border border-accent-soft bg-accent-soft/40 text-ink",
  confirmed: "border border-accent bg-accent text-paper",
  declined: "border border-ink-soft text-ink-soft",
};

export function StatusChip({ status }: { status: InvitationStatus }) {
  return (
    <span className={`inline-block rounded-s px-2xs py-3xs text-xs ${tone[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
