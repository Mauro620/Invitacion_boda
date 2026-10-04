import Link from "next/link";
import { listInvitations } from "@/app/actions/admin";
import type { StatusFilter } from "@/app/actions/admin.types";
import { StatusChip, STATUS_LABEL } from "@/components/admin/StatusChip";
import { fieldClass, labelClass, primaryBtn, secondaryBtn } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const STATUSES: StatusFilter[] = ["all", "pending", "opened", "confirmed", "declined"];

type Search = { q?: string; tag?: string; status?: string };

export default async function InvitationsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const tag = sp.tag ?? "";
  const status = STATUSES.includes(sp.status as StatusFilter) ? (sp.status as StatusFilter) : "all";
  const { rows, tags } = await listInvitations({ q, tag: tag || undefined, status });
  const filtered = Boolean(q || tag || status !== "all");

  return (
    <div className="flex flex-col gap-m">
      <div className="flex items-center justify-between gap-s">
        <h1 className="display text-2xl text-ink">Invitaciones</h1>
        <Link href="/admin/invitaciones/nueva" className={primaryBtn}>
          Nueva
        </Link>
      </div>

      <form method="get" role="search" className="flex flex-col gap-xs">
        <label className={labelClass}>
          Buscar por grupo o invitado
          <input name="q" type="search" defaultValue={q} className={fieldClass} />
        </label>
        <div className="grid grid-cols-2 gap-xs">
          <label className={labelClass}>
            Estado
            <select name="status" defaultValue={status} className={fieldClass}>
              <option value="all">Todos</option>
              {STATUSES.filter((s) => s !== "all").map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s as keyof typeof STATUS_LABEL]}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Etiqueta
            <select name="tag" defaultValue={tag} className={fieldClass}>
              <option value="">Todas</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex gap-xs">
          <button type="submit" className={secondaryBtn}>
            Filtrar
          </button>
          {filtered ? (
            <Link href="/admin/invitaciones" className="inline-flex min-h-11 items-center px-xs text-accent underline underline-offset-4">
              Quitar filtros
            </Link>
          ) : null}
        </div>
      </form>

      <p role="status" className="text-xs text-ink-soft">
        {rows.length} {rows.length === 1 ? "resultado" : "resultados"}
      </p>

      {rows.length === 0 ? (
        <p className="text-ink-soft">
          {filtered ? "Ninguna invitación coincide con esos filtros." : "Todavía no hay invitaciones."}
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-l bg-paper">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={`/admin/invitaciones/${r.id}`}
                className="flex min-h-16 items-center justify-between gap-s px-s py-xs"
              >
                <span className="min-w-0">
                  <span className="block truncate text-base text-ink">{r.displayName}</span>
                  <span className="block text-xs text-ink-soft">
                    {r.guests.length} {r.guests.length === 1 ? "persona" : "personas"} · {r.tag}
                    {r.openCount > 0 ? ` · abierta ${r.openCount} ${r.openCount === 1 ? "vez" : "veces"}` : ""}
                  </span>
                </span>
                <StatusChip status={r.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
