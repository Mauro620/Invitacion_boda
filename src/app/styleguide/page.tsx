import type { Metadata } from "next";
import { DrawPath, Parallax, Reveal, SplitText } from "@/components/motion";
import { wedding } from "@/content/wedding";
import { PetalsDemo } from "./PetalsDemo";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const tokens = [
  "paper",
  "paper-deep",
  "table",
  "ink",
  "ink-soft",
  "accent",
  "accent-soft",
  "metal",
  "metal-ink",
  "seal",
  "line",
] as const;

const steps = [-1, 0, 1, 2, 3, 4, 5, 6, 7] as const;

const { partnerA, partnerB } = wedding.couple;
const initial = (n: string) => n.replace(/^TODO:/, "").charAt(0);

function Cover() {
  return (
    <svg viewBox="0 0 400 560" className="block w-full" aria-hidden>
      <rect width="400" height="560" className="fill-paper-deep" />
      <circle cx="270" cy="170" r="64" className="fill-accent-soft" />
      <path d="M0 360 C90 290 180 330 260 300 S370 270 400 300 V560 H0Z" className="fill-accent-soft" opacity="0.7" />
      <path d="M0 420 C110 370 200 410 300 380 S380 370 400 380 V560 H0Z" className="fill-accent" opacity="0.35" />
    </svg>
  );
}

function Block() {
  return (
    <section className="paper pb-xl">
      <h2 className="sticky top-0 z-20 border-b border-line bg-paper-deep px-gutter py-2xs text-xs text-ink-soft">
        Jardín boho
      </h2>

      <div className="flex flex-col gap-l px-gutter pt-m">
        <div className="grid grid-cols-3 gap-2xs">
          {tokens.map((t) => (
            <div key={t} className="flex flex-col gap-3xs text-xs">
              <span className="h-12 rounded-s border border-line" style={{ background: `var(--${t})` }} />
              {t}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-xs overflow-hidden">
          <p className="display text-3xl">{partnerA}</p>
          <p className="font-script text-3xl text-accent">{partnerB}</p>
          <p className="font-body">{wedding.quote}</p>
          {steps.map((s) => (
            <p key={s} className="display flex items-baseline gap-xs leading-none text-ink" style={{ fontSize: `var(--step-${s})` }}>
              Aa
              <span className="font-body text-xs normal-case text-ink-soft">step {s}</span>
            </p>
          ))}
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-m border border-line shadow-paper">
          <Parallax className="absolute inset-x-0 -top-7">
            <Cover />
          </Parallax>
          <h3 className="display absolute inset-x-0 top-1/3 px-gutter text-center text-3xl break-words">
            <SplitText text={`${partnerA} & ${partnerB}`} />
          </h3>
          <DrawPath className="absolute inset-x-gutter bottom-s h-10" viewBox="0 0 300 40" d="M0 20 C50 0 100 40 150 20 S250 0 300 20" />
        </div>

        <Reveal>
          <p className="max-w-(--measure) text-lg">{wedding.intro.lines.join(" ")}</p>
        </Reveal>

        <div className="flex items-center gap-m">
          <span
            aria-hidden
            className="grid size-20 shrink-0 place-items-center rounded-full border-2 border-metal bg-seal text-2xl text-paper shadow-lifted display"
          >
            {initial(partnerA)}&amp;{initial(partnerB)}
          </span>
          <div className="paper min-h-20 flex-1 rounded-m border border-line p-s shadow-paper text-xs">paper</div>
        </div>

        <PetalsDemo />
      </div>
    </section>
  );
}

export default function Styleguide() {
  return (
    <main className="bg-table">
      <Block />
    </main>
  );
}
