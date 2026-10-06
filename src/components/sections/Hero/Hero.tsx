"use client";

import { motion } from "motion/react";
import { Parallax, Reveal, SplitText, curve, useReducedMotion } from "@/components/motion";
import { FlowerCorner } from "@/components/ui/Flowers";
import { wedding } from "@/content/wedding";

type Props = {
  guestName?: string;
};

export function Hero({ guestName }: Props) {
  const reduced = useReducedMotion();
  const { partnerA, partnerB } = wedding.couple;

  return (
    <section
      aria-label={`${partnerA} & ${partnerB}`}
      data-guest={guestName}
      className="paper relative flex min-h-svh flex-col items-center overflow-hidden px-gutter pt-l pb-m text-center"
    >
      <FlowerCorner position="tl" className="top-0 left-0 z-10 w-28" delay={0.4} />
      <FlowerCorner position="tr" className="top-0 right-0 z-10 w-28" delay={0.6} />

      {/* Vertical print in an arched frame */}
      <Parallax distance={48} className="w-[min(78vw,21rem)]">
        <div
          className="relative aspect-[3/4] overflow-hidden shadow-letter"
          style={{ borderRadius: "999px 999px var(--round-m) var(--round-m)" }}
        >
          <motion.div
            role="img"
            aria-label={`${partnerA} y ${partnerB}`}
            className="absolute inset-0 bg-cover bg-[center_30%]"
            style={{ backgroundImage: `url(${wedding.hero.photo})` }}
            initial={false}
            animate={reduced ? { scale: 1.04 } : { scale: [1.04, 1.16] }}
            transition={{ duration: 24, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{ background: "linear-gradient(180deg, transparent, color-mix(in oklch, var(--paper) 88%, transparent))" }}
          />
        </div>
      </Parallax>

      {/* Names overlap the print's lower edge */}
      <h1 className="display relative -mt-[4.5rem] flex flex-col items-center text-hero text-ink">
        <SplitText text={partnerA} by="char" delay={0.2} stagger={0.07} />
        <span className="font-script -my-2xs text-5xl leading-none text-accent">
          <Reveal as="span" delay={0.9}>
            &amp;
          </Reveal>
        </span>
        <SplitText text={partnerB} by="char" delay={0.6} stagger={0.07} />
      </h1>

      <Reveal delay={1.2} className="mt-m">
        <p className="display text-xl text-metal-ink">{wedding.date.text}</p>
      </Reveal>

      {/* Scroll cue */}
      <div className="mt-auto flex flex-col items-center gap-2xs pt-l">
        <p className="max-w-[16rem] text-xs text-ink-soft">{wedding.hero.scroll}</p>
        <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 block h-1/2 bg-accent"
            initial={false}
            animate={reduced ? { y: "50%" } : { y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: curve.outQuart }}
          />
        </span>
      </div>
    </section>
  );
}
