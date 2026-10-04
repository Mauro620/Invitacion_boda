import Link from "next/link";
import { notFound } from "next/navigation";
import { getInvitation, listInvitations } from "@/app/actions/admin";
import { StatusChip } from "@/components/admin/StatusChip";
import { formatWhen } from "@/components/admin/ui";
import { InvitationForm } from "../InvitationForm";
import { SendActions } from "./SendActions";

export const dynamic = "force-dynamic";

function answer(a: boolean | null) {
  return a === true ? "Asiste" : a === false ? "No asiste" : "Sin respuesta";
}

export default async function InvitationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = await getInvitation(id);
  if (!inv) notFound();
  const { tags } = await listInvitations();

  return (
    <div className="flex flex-col gap-l">
      <div className="flex flex-col gap-2xs">
        <Link href="/admin/invitaciones" className="inline-flex min-h-11 items-center self-start text-xs text-accent underline underline-offset-4">
          Volver a invitaciones
        </Link>
        <h1 className="display text-2xl text-ink">{inv.displayName}</h1>
        <div className="flex flex-wrap items-center gap-2xs text-xs text-ink-soft">
          <StatusChip status={inv.status} />
          <span>{inv.tag}</span>
          <span>· {inv.maxGuests} {inv.maxGuests === 1 ? "cupo" : "cupos"}</span>
        </div>
      </div>

      <section aria-labelledby="enviar" className="flex flex-col gap-xs">
        <h2 id="enviar" className="display text-lg text-ink">
          Enviar
        </h2>
        <SendActions id={inv.id} url={inv.url} sent={Boolean(inv.sentAt)} />
        <ul className="text-xs text-ink-soft">
          <li>{inv.sentAt ? `Enviada el ${formatWhen(inv.sentAt)}.` : "Aún no se ha enviado."}</li>
          <li>
            {inv.firstOpenedAt
              ? `Abierta ${inv.openCount} ${inv.openCount === 1 ? "vez" : "veces"}, la última el ${formatWhen(inv.lastOpenedAt)}.`
              : "Todavía no la han abierto."}
          </li>
          {inv.respondedAt ? <li>Respondió el {formatWhen(inv.respondedAt)}.</li> : null}
          {!inv.phone ? <li>Sin teléfono: WhatsApp te dejará elegir el contacto.</li> : null}
        </ul>
      </section>

      <section aria-labelledby="respuestas" className="flex flex-col gap-xs">
        <h2 id="respuestas" className="display text-lg text-ink">
          Invitados y respuestas
        </h2>
        <ul className="divide-y divide-line rounded-l bg-paper">
          {inv.guests.map((g) => (
            <li key={g.id} className="flex flex-col gap-3xs px-s py-xs">
              <div className="flex items-baseline justify-between gap-s">
                <span className="text-ink">
                  {g.name}
                  {g.isPlusOne ? <span className="text-xs text-ink-soft"> (acompañante)</span> : null}
                </span>
                <span className="text-xs text-ink-soft">{answer(g.attending)}</span>
              </div>
              {g.dietaryNotes ? (
                <p className="text-xs text-ink-soft">Alimentación: {g.dietaryNotes}</p>
              ) : null}
            </li>
          ))}
        </ul>
        {inv.noteToCouple ? (
          <figure className="rounded-l bg-accent-soft/30 p-s">
            <blockquote className="text-ink">{inv.noteToCouple}</blockquote>
            <figcaption className="mt-2xs text-xs text-ink-soft">Nota para ustedes</figcaption>
          </figure>
        ) : null}
        {inv.personalMessage ? (
          <p className="text-xs text-ink-soft">Mensaje personal: {inv.personalMessage}</p>
        ) : null}
      </section>

      <section aria-labelledby="editar">
        <details className="group rounded-l bg-paper-deep p-s">
          <summary
            id="editar"
            className="display flex min-h-11 cursor-pointer items-center text-lg text-ink"
          >
            Editar invitación
          </summary>
          <div className="mt-s">
            <InvitationForm initial={inv} tags={tags} />
          </div>
        </details>
      </section>
    </div>
  );
}
