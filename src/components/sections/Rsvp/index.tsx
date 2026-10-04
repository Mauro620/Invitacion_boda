"use client";

import { useState, useTransition } from "react";
import { Reveal } from "@/components/motion";
import { FlowerSprig } from "@/components/ui/Flowers";
import { wedding } from "@/content/wedding";

type GuestIn = { id: string; name: string; attending: boolean | null; dietaryNotes?: string };
type Payload = {
  guests: { id: string; name: string; attending: boolean; dietaryNotes?: string }[];
  noteToCouple?: string;
};
type Props = {
  guestName: string;
  guests: GuestIn[];
  /** Display label for the deadline, or null when none is set yet. */
  deadline: string | null;
  /** False once the deadline has passed: answers stay visible but read-only. */
  open?: boolean;
  /** The invitation already has a saved response. */
  responded?: boolean;
  noteToCouple?: string;
  onSubmit: (payload: Payload) => Promise<{ ok: boolean; error?: string }>;
};
type Answer = { attending: boolean | null; dietaryNotes: string };

const t = wedding.rsvp;
const NOTE_MAX = 500;
const DIET_MAX = 200;

const toAnswers = (gs: GuestIn[]): Record<string, Answer> =>
  Object.fromEntries(
    gs.map((g) => [g.id, { attending: g.attending, dietaryNotes: g.dietaryNotes ?? "" }]),
  );

export function Rsvp({
  guestName,
  guests,
  deadline,
  open = true,
  responded = false,
  noteToCouple = "",
  onSubmit,
}: Props) {
  const [answers, setAnswers] = useState(() => toAnswers(guests));
  const [note, setNote] = useState(noteToCouple);
  const [saved, setSaved] = useState(
    guests.length > 0 && (responded || guests.every((g) => g.attending !== null)),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const setAnswer = (id: string, patch: Partial<Answer>) =>
    setAnswers((a) => ({ ...a, [id]: { ...a[id], ...patch } }));

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!open || pending) return;
    if (guests.some((g) => answers[g.id].attending === null)) {
      setError(t.errorChoose);
      return;
    }
    const payload: Payload = {
      guests: guests.map((g) => {
        const a = answers[g.id];
        const d = a.attending ? a.dietaryNotes.trim().slice(0, DIET_MAX) : "";
        return {
          id: g.id,
          name: g.name,
          attending: a.attending as boolean,
          ...(d && { dietaryNotes: d }),
        };
      }),
      ...(note.trim() && { noteToCouple: note.trim().slice(0, NOTE_MAX) }),
    };
    setError(null);
    setSaved(true); // optimistic
    start(async () => {
      let res: { ok: boolean; error?: string };
      try {
        res = await onSubmit(payload);
      } catch {
        res = { ok: false };
      }
      if (!res.ok) {
        setSaved(false);
        setError(res.error || t.error);
      }
    });
  }

  return (
    <section className="paper px-gutter py-chapter">
      <div className="mx-auto flex max-w-(--measure) flex-col gap-m">
        {/* Persistent live region: announces the saved state (a region mounted with its text is often skipped). */}
        <div aria-live="polite" className="sr-only">
          {saved && !pending ? t.success : ""}
        </div>
        <Reveal className="text-center">
          <FlowerSprig variant="drooping" className="mx-auto mb-xs h-16 w-auto" />
          <h2 className="display text-3xl text-accent">{t.title}</h2>
          <p className="mt-xs text-ink-soft">{guestName}</p>
        </Reveal>

        {saved ? (
          <div className="flex flex-col gap-s">
            <p className="text-center text-ink">{pending ? t.intro : t.success}</p>
            <ul className="flex flex-col divide-y divide-line rounded-m border border-line bg-paper-deep">
              {guests.map((g) => (
                <li key={g.id} className="flex items-baseline justify-between gap-s p-s">
                  <span className="text-ink">{g.name}</span>
                  <span className="text-accent">
                    {answers[g.id].attending ? t.attending : t.notAttending}
                  </span>
                </li>
              ))}
            </ul>
            {note && <p className="text-center whitespace-pre-line text-ink-soft">{note}</p>}
            {open && (
              <button
                type="button"
                onClick={() => setSaved(false)}
                disabled={pending}
                className="min-h-11 self-center rounded-m border border-line px-m text-accent transition-colors duration-(--dur-quick) hover:bg-paper-deep disabled:opacity-50"
              >
                {t.edit}
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-m">
            <p className="text-center text-ink-soft">{t.intro}</p>
            {guests.map((g) => {
              const a = answers[g.id];
              return (
                <fieldset
                  key={g.id}
                  className="flex flex-col gap-xs rounded-m border border-line p-s"
                >
                  <legend className="px-2xs text-lg text-ink">{g.name}</legend>
                  <div role="radiogroup" aria-label={g.name} className="grid grid-cols-2 gap-xs">
                    {([true, false] as const).map((v) => (
                      <button
                        key={String(v)}
                        type="button"
                        role="radio"
                        aria-checked={a.attending === v}
                        onClick={() => {
                          setAnswer(g.id, { attending: v });
                          setError(null);
                        }}
                        className="min-h-12 rounded-m border border-line px-xs text-ink transition-colors duration-(--dur-quick) aria-checked:border-accent aria-checked:bg-accent aria-checked:text-paper"
                      >
                        {v ? t.attending : t.notAttending}
                      </button>
                    ))}
                  </div>
                  {a.attending && (
                    <label className="flex flex-col gap-2xs text-ink-soft">
                      {t.dietaryLabel}
                      <input
                        type="text"
                        value={a.dietaryNotes}
                        maxLength={DIET_MAX}
                        placeholder={t.dietaryPlaceholder}
                        onChange={(e) => setAnswer(g.id, { dietaryNotes: e.target.value })}
                        className="min-h-11 rounded-m border border-line bg-paper px-xs text-ink"
                      />
                    </label>
                  )}
                </fieldset>
              );
            })}
            <label className="flex flex-col gap-2xs text-ink-soft">
              {t.messageLabel}
              <textarea
                value={note}
                maxLength={NOTE_MAX}
                rows={4}
                placeholder={t.messagePlaceholder}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-m border border-line bg-paper p-xs text-ink"
              />
            </label>
            {deadline && (
              <p className="text-center text-ink-soft">
                {t.deadlineLabel} <strong className="text-ink">{deadline}</strong>
              </p>
            )}
            <div role="alert" className="min-h-6 text-center text-seal">
              {error}
            </div>
            <button
              type="submit"
              disabled={pending || !open}
              className="min-h-12 rounded-m bg-accent px-m text-paper shadow-paper transition-transform duration-(--dur-quick) ease-out-quart active:scale-[0.97] disabled:opacity-60"
            >
              {t.submit}
            </button>
          </form>
        )}
        {saved && deadline && (
          <p className="text-center text-ink-soft">
            {t.deadlineLabel} <strong className="text-ink">{deadline}</strong>
          </p>
        )}
      </div>
    </section>
  );
}
