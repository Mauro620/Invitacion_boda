import Link from "next/link";
import { listInvitations } from "@/app/actions/admin";
import { InvitationForm } from "../InvitationForm";

export const dynamic = "force-dynamic";

export default async function NewInvitationPage() {
  const { tags } = await listInvitations();
  return (
    <div className="flex flex-col gap-m">
      <Link href="/admin/invitaciones" className="inline-flex min-h-11 items-center text-xs text-accent underline underline-offset-4">
        Volver a invitaciones
      </Link>
      <h1 className="display text-2xl text-ink">Nueva invitación</h1>
      <InvitationForm tags={tags} />
    </div>
  );
}
