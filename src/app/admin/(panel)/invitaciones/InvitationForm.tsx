"use client";

import { useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveInvitation } from "@/app/actions/admin";
import type { InvitationRow } from "@/app/actions/admin.types";
import { errorText, fieldClass, labelClass, primaryBtn, secondaryBtn } from "@/components/admin/ui";

type GuestDraft = { key: number; id?: string; name: string; isPlusOne: boolean };

export function InvitationForm({
  initial,
  tags = [],
}: {
  initial?: InvitationRow;
  tags?: string[];
}) {
  const router = useRouter();
  const listId = useId();
  const nextKey = useRef(100);
  const [pending, start] = useTransition();
  const [displayName, setDisplayName] = useState(initial?.displayName ?? "");
  const [maxGuests, setMaxGuests] = useState(String(initial?.maxGuests ?? 2));
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [tag, setTag] = useState(initial?.tag ?? "");
  const [personalMessage, setPersonalMessage] = useState(initial?.personalMessage ?? "");
  const [guests, setGuests] = useState<GuestDraft[]>(
    initial?.guests.length
      ? initial.guests.map((g, i) => ({ key: i, id: g.id, name: g.name, isPlusOne: g.isPlusOne }))
      : [{ key: 0, name: "", isPlusOne: false }],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const patch = (key: number, p: Partial<GuestDraft>) =>
    setGuests((gs) => gs.map((g) => (g.key === key ? { ...g, ...p } : g)));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    start(async () => {
      const res = await saveInvitation({
        id: initial?.id,
        displayName,
        maxGuests: Number(maxGuests),
        phone: phone.trim() || null,
        tag,
        personalMessage: personalMessage.trim() || null,
        guests: guests.map((g) => ({ id: g.id, name: g.name, isPlusOne: g.isPlusOne })),
      });
      if (res.ok) {
        setErrors({});
        setFormError(null);
        if (initial) {
          setSaved(true);
          router.refresh();
        } else {
          router.push(`/admin/invitaciones/${res.id}`);
        }
        return;
      }
      setErrors(res.fieldErrors ?? {});
      setFormError(res.error);
    });
  }

  const err = (k: string) =>
    errors[k] ? (
      <span id={`${listId}-${k}`} className={errorText}>
        {errors[k]}
      </span>
    ) : null;
  const aria = (k: string) =>
    errors[k] ? { "aria-invalid": true, "aria-describedby": `${listId}-${k}` } : {};

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-s">
      <label className={labelClass}>
        Nombre del grupo
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={fieldClass}
          autoComplete="off"
          {...aria("displayName")}
        />
        {err("displayName")}
      </label>

      <div className="grid grid-cols-2 gap-xs">
        <label className={labelClass}>
          Cupos
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={20}
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            className={fieldClass}
            {...aria("maxGuests")}
          />
          {err("maxGuests")}
        </label>
        <label className={labelClass}>
          Etiqueta
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            list={`${listId}-tags`}
            className={fieldClass}
            autoComplete="off"
            {...aria("tag")}
          />
          <datalist id={`${listId}-tags`}>
            {tags.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
          {err("tag")}
        </label>
      </div>

      <label className={labelClass}>
        Celular (opcional, con código de país, para WhatsApp)
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={fieldClass}
          placeholder="+57 300 000 0000"
          {...aria("phone")}
        />
        {err("phone")}
      </label>

      <label className={labelClass}>
        Mensaje personal (opcional)
        <textarea
          rows={4}
          value={personalMessage}
          onChange={(e) => setPersonalMessage(e.target.value)}
          className={fieldClass}
          {...aria("personalMessage")}
        />
        {err("personalMessage")}
      </label>

      <fieldset className="flex flex-col gap-xs">
        <legend className="mb-2xs text-base text-ink">Invitados</legend>
        <ul className="flex flex-col gap-xs">
          {guests.map((g, i) => (
            <li key={g.key} className="flex flex-col gap-2xs rounded-m bg-paper-deep p-xs">
              <label className={labelClass}>
                Invitado {i + 1}
                <input
                  value={g.name}
                  onChange={(e) => patch(g.key, { name: e.target.value })}
                  className={fieldClass}
                  autoComplete="off"
                />
              </label>
              <div className="flex items-center justify-between gap-s">
                <label className="flex min-h-11 items-center gap-2xs text-xs text-ink-soft">
                  <input
                    type="checkbox"
                    checked={g.isPlusOne}
                    onChange={(e) => patch(g.key, { isPlusOne: e.target.checked })}
                    className="size-5 accent-[var(--accent)]"
                  />
                  Es acompañante
                </label>
                <button
                  type="button"
                  onClick={() => setGuests((gs) => gs.filter((x) => x.key !== g.key))}
                  disabled={guests.length === 1}
                  aria-label={`Quitar invitado ${i + 1}`}
                  className="min-h-11 px-xs text-xs text-seal underline underline-offset-4 disabled:opacity-40"
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div role="alert">{err("guests")}</div>
        <button
          type="button"
          className={secondaryBtn}
          onClick={() =>
            setGuests((gs) => [...gs, { key: nextKey.current++, name: "", isPlusOne: false }])
          }
        >
          Agregar invitado
        </button>
        {initial ? (
          <p className="text-xs text-ink-soft">
            Quitar un invitado borra también su respuesta.
          </p>
        ) : null}
      </fieldset>

      <div aria-live="polite" role="status" className="min-h-[1.5em] text-xs">
        {formError ? <span className="text-seal">{formError}</span> : null}
        {saved ? <span className="text-ink">Cambios guardados.</span> : null}
      </div>

      <button type="submit" disabled={pending} className={primaryBtn}>
        {pending ? "Guardando..." : initial ? "Guardar cambios" : "Crear invitación"}
      </button>
    </form>
  );
}
