"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "./useReducedMotion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Total px travelled across the viewport pass; negative moves against scroll. */
  distance?: number;
};

export function Parallax({ children, className, distance = 60 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance / 2, -distance / 2]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
