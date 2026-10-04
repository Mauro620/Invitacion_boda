"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { curve, dur } from "./tokens";
import { useReducedMotion } from "./useReducedMotion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Seconds. */
  delay?: number;
  duration?: number;
  /** Start offset in px (translateY). */
  y?: number;
  as?: "div" | "span" | "p" | "li" | "section";
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = dur.slow,
  y = 24,
  as = "div",
}: Props) {
  const reduced = useReducedMotion();
  const M = motion[as];
  if (reduced) return <M className={className}>{children}</M>;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration, delay, ease: curve.outExpo }}
    >
      {children}
    </M>
  );
}
