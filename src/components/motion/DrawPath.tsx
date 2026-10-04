"use client";

import { motion, useScroll } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

type Props = {
  /** SVG path `d`. */
  d: string;
  viewBox: string;
  className?: string;
  /** Stroke color; defaults to the metal token. */
  stroke?: string;
  strokeWidth?: number;
};

/** Stroke is drawn as the element scrolls through the viewport. Fully drawn under reduced motion. */
export function DrawPath({
  d,
  viewBox,
  className,
  stroke = "var(--metal)",
  strokeWidth = 1.5,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "center 50%"] });
  return (
    <span ref={ref} className={className} aria-hidden style={{ display: "block" }}>
      <svg viewBox={viewBox} width="100%" height="100%" fill="none">
        <motion.path
          d={d}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={reduced ? 1 : undefined}
          style={reduced ? undefined : { pathLength: scrollYProgress }}
        />
      </svg>
    </span>
  );
}
