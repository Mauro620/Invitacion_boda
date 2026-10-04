"use client";

import { AnimatePresence, motion } from "motion/react";
import { curve, useReducedMotion } from "@/components/motion";
import { wedding } from "@/content/wedding";

type MusicButtonProps = { playing: boolean; onToggle: () => void };

export function MusicButton({ playing, onToggle }: MusicButtonProps) {
  const label = wedding.music.label;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={label}
      className="fixed top-s right-s z-40 grid size-11 place-items-center rounded-full border border-line bg-paper text-accent shadow-paper transition-transform duration-[var(--dur-quick)] ease-[var(--curve-out-quart)] active:scale-95"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 18V6l10-2v12" />
        <circle cx="7" cy="18" r="2.5" />
        <circle cx="17" cy="16" r="2.5" />
        {!playing && <path d="M3 3l18 18" />}
      </svg>
    </button>
  );
}

type ChapterProgressProps = { progress: number };

export function ChapterProgress({ progress }: ChapterProgressProps) {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(p * 100)}
      aria-label={`${wedding.couple.partnerA} & ${wedding.couple.partnerB}`}
      className="fixed inset-x-0 top-0 z-40 h-0.5 bg-line/50"
    >
      <div
        className="h-full origin-left bg-accent"
        style={{ transform: `scaleX(${p})`, transition: "transform 240ms var(--curve-out-quart)" }}
      />
    </div>
  );
}

type RsvpFabProps = { visible: boolean; href?: string };

export function RsvpFab({ visible, href = "#rsvp" }: RsvpFabProps) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={href}
          className="fixed bottom-m left-1/2 z-40 rounded-full bg-accent px-l py-xs text-base font-medium text-paper shadow-lifted"
          initial={reduced ? false : { opacity: 0, y: 24, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={reduced ? { opacity: 0, x: "-50%" } : { opacity: 0, y: 24, x: "-50%" }}
          transition={{ duration: reduced ? 0.01 : 0.6, ease: curve.outExpo }}
        >
          {wedding.rsvp.confirm}
        </motion.a>
      )}
    </AnimatePresence>
  );
}
