import Link from "next/link";
import { getDashboardStats } from "@/app/actions/admin";
import { primaryBtn } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const dayFmt = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" });

export default async function DashboardPage() {
  const s = await getDashboardStats();

  if (s.invitations === 0) {
    return (
      <section className="flex flex-col gap-s">
        <h1 className="display text-2xl text-ink">Aún no hay invitaciones</h1>
        <p className="text-ink-soft">Crea la primera o importa la lista completa desde un archivo.</p>
        <div className="flex flex-wrap gap-xs">
          <Link href="/admin/invitaciones/nueva" className={primaryBtn}>
            Crear invitación
          </Link>
          <Link href="/admin/importar" className="inline-flex min-h-11 items-center px-xs text-accent underline underline-offset-4">
            Importar lista
          </Link>
        </div>
      </section>
    );
  }

  const pct = (n: number) => (s.totalPeople ? (n / s.totalPeople) * 100 : 0);
  const answered = s.confirmed + s.declined;
  const parts = [
    { key: "confirmed", label: "Confirmados", n: s.confirmed, bar: "bg-accent", dot: "bg-accent" },
    { key: "declined", label: "No asisten", n: s.declined, bar: "bg-ink-soft", dot: "bg-ink-soft" },
    { key: "pending", label: "Pendientes", n: s.pending, bar: "bg-accent-soft/50", dot: "border border-metal bg-accent-soft/50" },
  ];

  let daysLeft: number | null = null;
  if (s.deadlineIso) {
    daysLeft = Math.ceil((Date.parse(s.deadlineIso) - Date.now()) / 86_400_000);
  }

  return (
    <div className="flex flex-col gap-l">
      <section aria-labelledby="resumen">
        <h1 id="resumen" className="display text-2xl text-ink">
          {s.confirmed} de {s.totalPeople} personas vienen
        </h1>
        <p className="mt-3xs text-ink-soft">
          {s.invitations} {s.invitations === 1 ? "invitación" : "invitaciones"} en total.
        </p>

        <div
          className="mt-s flex h-3 w-full overflow-hidden rounded-s bg-paper-deep"
          role="img"
          aria-label={`${s.confirmed} confirmados, ${s.declined} no asisten, ${s.pending} pendientes`}
        >
          {parts.map((p) => (
            <div key={p.key} className={p.bar} style={{ width: `${pct(p.n)}%` }} />
          ))}
        </div>

        <dl className="mt-s divide-y divide-line">
          {parts.map((p) => (
            <div key={p.key} className="flex min-h-11 items-center justify-between gap-s">
              <dt className="flex items-center gap-2xs text-ink">
                <span aria-hidden className={`size-3 rounded-s ${p.dot}`} />
                {p.label}
              </dt>
              <dd className="display text-xl text-ink">{p.n}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="seguimiento" className="rounded-l bg-paper-deep p-s">
        <h2 id="seguimiento" className="display text-lg text-ink">
          Para dar seguimiento
        </h2>
        {s.openedNoReply > 0 ? (
          <p className="mt-2xs text-ink-soft">
            {s.openedNoReply} {s.openedNoReply === 1 ? "invitación se abrió" : "invitaciones se abrieron"} y todavía no{" "}
            {s.openedNoReply === 1 ? "responde" : "responden"}.
          </p>
        ) : (
          <p className="mt-2xs text-ink-soft">Nadie se ha quedado sin responder tras abrir su invitación.</p>
        )}
        <Link
          href="/admin/invitaciones?status=opened"
          className="mt-2xs inline-flex min-h-11 items-center text-accent underline underline-offset-4"
        >
          Ver abiertas sin responder
        </Link>
      </section>

      {s.deadlineIso && daysLeft !== null ? (
        <section aria-labelledby="plazo">
          <h2 id="plazo" className="display text-lg text-ink">
            Fecha límite para responder
          </h2>
          <p className="mt-3xs text-ink-soft">
            {dayFmt.format(new Date(s.deadlineIso))}.{" "}
            {daysLeft > 1
              ? `Faltan ${daysLeft} días.`
              : daysLeft === 1
                ? "Falta 1 día."
                : daysLeft === 0
                  ? "Es hoy."
                  : "Ya pasó."}
          </p>
          <progress
            value={answered}
            max={s.totalPeople}
            aria-label="Personas que ya respondieron"
            className="mt-xs block h-3 w-full overflow-hidden rounded-s [&::-moz-progress-bar]:bg-accent [&::-webkit-progress-bar]:bg-paper-deep [&::-webkit-progress-value]:bg-accent"
          />
          <p className="mt-2xs text-xs text-ink-soft">
            Han respondido {answered} de {s.totalPeople} personas.
          </p>
        </section>
      ) : null}
    </div>
  );
}
