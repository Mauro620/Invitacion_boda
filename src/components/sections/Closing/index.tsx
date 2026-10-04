"use client";

import { Petals, Reveal } from "@/components/motion";
import { wedding } from "@/content/wedding";

type Props = { attending: boolean | null; guestName: string };

const c = wedding.closing;
const initials = `${wedding.couple.partnerA[0]} & ${wedding.couple.partnerB[0]}`;

export function Closing({ attending, guestName }: Props) {
  const msg = attending === true ? c.attending : attending === false ? c.notAttending : null;
  return (
    <section className="paper relative flex min-h-dvh items-center justify-center overflow-hidden px-gutter py-chapter">
      {attending === true && (
        <div className="pointer-events-none absolute inset-0">
          <Petals count={40} />
        </div>
      )}
      <div className="relative mx-auto flex max-w-(--measure) flex-col items-center gap-m text-center">
        <Reveal as="p" className="text-ink-soft">
          {guestName}
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display text-4xl text-accent">{msg ? msg.title : c.final}</h2>
        </Reveal>
        {msg && (
          <>
            <Reveal delay={0.2}>
              <p className="text-ink-soft">{msg.text}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-ink">{c.final}</p>
            </Reveal>
          </>
        )}
        <Reveal delay={0.4} className="mt-m">
          <p
            role="img"
            aria-label={`${wedding.couple.partnerA} y ${wedding.couple.partnerB}`}
            className="display border-y border-metal px-l py-xs text-3xl text-metal-ink"
          >
            <span aria-hidden>{initials}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
