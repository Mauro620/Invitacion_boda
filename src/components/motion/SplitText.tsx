"use client";

import { motion } from "motion/react";
import { curve, dur, stagger as STAGGER } from "./tokens";
import { useReducedMotion } from "./useReducedMotion";

type Props = {
  text: string;
  className?: string;
  /** Split by word (default) or character. */
  by?: "word" | "char";
  delay?: number;
  stagger?: number;
};

export function SplitText({ text, className, by = "word", delay = 0, stagger = STAGGER }: Props) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{text}</span>;
  const parts = by === "word" ? text.split(" ") : Array.from(text);
  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true }}
      transition={{ delayChildren: delay, staggerChildren: stagger }}
    >
      {parts.map((p, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "105%", opacity: 0 }, shown: { y: 0, opacity: 1 } }}
            transition={{ duration: dur.slow, ease: curve.outExpo }}
          >
            {p}
            {by === "word" && i < parts.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
