import Link from "next/link";
import { listMessages } from "@/app/actions/admin";
import { formatWhen } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await listMessages();
  return (
    <div className="flex flex-col gap-m">
      <div>
        <h1 className="display text-2xl text-ink">Mensajes</h1>
        <p className="mt-3xs text-ink-soft">Lo que sus invitados les escribieron al responder.</p>
      </div>
      {messages.length === 0 ? (
        <p className="text-ink-soft">Todavía nadie dejó un mensaje. Aparecerán aquí al llegar.</p>
      ) : (
        <ul className="flex flex-col gap-m">
          {messages.map((m) => (
            <li key={m.id}>
              <figure className="paper rounded-l p-s shadow-paper">
                <blockquote className="whitespace-pre-line text-lg leading-relaxed text-ink">
                  {m.note}
                </blockquote>
                <figcaption className="mt-xs flex flex-wrap items-baseline justify-between gap-2xs text-xs text-ink-soft">
                  <Link href={`/admin/invitaciones/${m.id}`} className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">
                    {m.displayName}
                  </Link>
                  <span>{formatWhen(m.respondedAt)}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
