"use client";

import { motion, type Variants } from "motion/react";
import type { CSSProperties } from "react";
import { curve, useReducedMotion } from "@/components/motion";

/**
 * Hand-built lilac blossoms. Flat illustrated line style, colors only via tokens.
 * Decorative: always aria-hidden. Grows in once on view; static under reduced motion.
 */

const INK = "var(--accent)";
const PETAL = "var(--accent-soft)";
const LEAF = "color-mix(in oklch, var(--accent) 22%, var(--paper))";

type Floret = { x: number; y: number; s: number; r: number };
type Bud = { x: number; y: number; r: number };

type Shape = {
  viewBox: string;
  stem: string;
  leaves: string[];
  florets: Floret[];
  buds: Bud[];
};

const SHAPES = {
  // Upright panicle, tapering to the tip, leaning slightly right.
  upright: {
    viewBox: "0 0 100 160",
    stem: "M46 158 C44 126 52 98 49 62 C48 46 52 30 54 14",
    leaves: [
      "M46 146 C30 142 20 128 16 114 C32 116 44 128 46 146Z",
      "M47 132 C62 128 74 116 80 100 C64 102 50 114 47 132Z",
    ],
    florets: [
      { x: 43, y: 66, s: 1.05, r: 12 },
      { x: 58, y: 70, s: 0.95, r: 40 },
      { x: 49, y: 52, s: 1.1, r: 70 },
      { x: 38, y: 50, s: 0.8, r: 25 },
      { x: 62, y: 52, s: 0.85, r: 55 },
      { x: 52, y: 37, s: 1, r: 8 },
      { x: 43, y: 34, s: 0.75, r: 60 },
      { x: 60, y: 33, s: 0.8, r: 30 },
      { x: 55, y: 21, s: 0.85, r: 48 },
    ],
    buds: [
      { x: 51, y: 9, r: 8 },
      { x: 47, y: 24, r: -20 },
      { x: 66, y: 42, r: 25 },
    ],
  },
  // Soft arching spray, heavier on one side.
  drooping: {
    viewBox: "0 0 100 160",
    stem: "M30 158 C28 120 40 84 66 62 C78 52 86 52 90 66",
    leaves: [
      "M31 142 C16 138 8 126 6 112 C20 114 30 126 31 142Z",
      "M34 120 C48 118 58 108 62 94 C48 94 37 104 34 120Z",
    ],
    florets: [
      { x: 56, y: 68, s: 1.05, r: 20 },
      { x: 70, y: 60, s: 0.95, r: 50 },
      { x: 82, y: 62, s: 1, r: 10 },
      { x: 88, y: 76, s: 0.9, r: 35 },
      { x: 66, y: 76, s: 0.8, r: 65 },
      { x: 79, y: 80, s: 0.85, r: 15 },
      { x: 86, y: 92, s: 0.75, r: 45 },
    ],
    buds: [
      { x: 90, y: 104, r: 5 },
      { x: 47, y: 78, r: -30 },
      { x: 76, y: 94, r: 15 },
    ],
  },
  // Single short stem: one open blossom and a few buds.
  bud: {
    viewBox: "0 0 100 160",
    stem: "M52 158 C54 130 48 106 51 80",
    leaves: ["M52 138 C66 134 76 122 80 108 C64 110 54 122 52 138Z"],
    florets: [
      { x: 51, y: 76, s: 1.35, r: 18 },
      { x: 43, y: 100, s: 0.8, r: 50 },
    ],
    buds: [
      { x: 60, y: 92, r: 20 },
      { x: 52, y: 58, r: 0 },
      { x: 62, y: 68, r: 35 },
    ],
  },
} satisfies Record<string, Shape>;

export type SprigVariant = keyof typeof SHAPES;

const stemV: Variants = {
  hidden: { pathLength: 0 },
  shown: (d: number) => ({
    pathLength: 1,
    transition: { duration: d ? 1.6 : 0, ease: curve.outExpo },
  }),
};

const leafV: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  shown: (d: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: d ? 0.9 : 0, delay: d ? 0.35 : 0, ease: curve.outExpo },
  }),
};

const bloomV: Variants = {
  hidden: { opacity: 0, scale: 0.2 },
  shown: (c: { on: boolean; i: number }) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: c.on ? 0.8 : 0, delay: c.on ? 0.7 + c.i * 0.09 : 0, ease: curve.outExpo },
  }),
};

const fillBox: CSSProperties = { transformBox: "fill-box", transformOrigin: "center" };
const baseBox: CSSProperties = { transformBox: "fill-box", transformOrigin: "0% 100%" };

function FloretShape() {
  return (
    <g stroke={INK} strokeWidth={0.8} strokeLinejoin="round" fill={PETAL}>
      {[0, 90, 180, 270].map((a) => (
        <ellipse key={a} cx={0} cy={-4.4} rx={3.1} ry={4.6} transform={`rotate(${a})`} />
      ))}
      <circle r={1.1} fill={INK} stroke="none" />
    </g>
  );
}

type SprigProps = {
  variant?: SprigVariant;
  /** Mirror horizontally. */
  flip?: boolean;
  className?: string;
  /** Seconds before growth starts. */
  delay?: number;
};

/** A lilac stem with blossoms, buds and leaves. Size it with className (aspect 5:8). */
export function FlowerSprig({ variant = "upright", flip = false, className, delay = 0 }: SprigProps) {
  const reduced = useReducedMotion();
  const on = !reduced;
  const d = on ? 1 : 0;
  const sh: Shape = SHAPES[variant];
  return (
    <motion.svg
      aria-hidden
      focusable="false"
      viewBox={sh.viewBox}
      fill="none"
      className={className}
      style={{ display: "block", overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, pointerEvents: "none" }}
      initial={on ? "hidden" : "shown"}
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ delayChildren: delay }}
    >
      <motion.path d={sh.stem} stroke={INK} strokeWidth={1.4} strokeLinecap="round" variants={stemV} custom={d} />
      {sh.leaves.map((p) => (
        <motion.path
          key={p}
          d={p}
          fill={LEAF}
          stroke={INK}
          strokeWidth={0.9}
          strokeLinejoin="round"
          variants={leafV}
          custom={d}
          style={baseBox}
        />
      ))}
      {sh.buds.map((b, i) => (
        <g key={`b${i}`} transform={`translate(${b.x} ${b.y}) rotate(${b.r})`}>
          <motion.ellipse
            cx={0}
            cy={0}
            rx={2.1}
            ry={3.6}
            fill={PETAL}
            stroke={INK}
            strokeWidth={0.8}
            variants={bloomV}
            custom={{ on, i: i + 6 }}
            style={fillBox}
          />
        </g>
      ))}
      {sh.florets.map((f, i) => (
        <g key={`f${i}`} transform={`translate(${f.x} ${f.y}) rotate(${f.r}) scale(${f.s})`}>
          <motion.g variants={bloomV} custom={{ on, i }} style={fillBox}>
            <FloretShape />
          </motion.g>
        </g>
      ))}
    </motion.svg>
  );
}

type CornerProps = {
  /** Which page corner it hangs from; mirrors and rotates accordingly. */
  position?: "tl" | "tr" | "bl" | "br";
  className?: string;
  delay?: number;
};

const CORNER_TRANSFORM: Record<NonNullable<CornerProps["position"]>, string> = {
  tl: "none",
  tr: "scaleX(-1)",
  bl: "scaleY(-1)",
  br: "scale(-1, -1)",
};

/** Two overlapping sprigs fanning from a corner. Place absolutely; pass a width (e.g. w-28). */
export function FlowerCorner({ position = "tl", className = "", delay = 0 }: CornerProps) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute block aspect-square ${className}`}
      style={{ transform: CORNER_TRANSFORM[position] }}
    >
      <FlowerSprig
        variant="upright"
        delay={delay}
        className="absolute top-[-6%] left-[8%] h-[88%] w-auto -rotate-[28deg] origin-top"
      />
      <FlowerSprig
        variant="drooping"
        flip
        delay={delay + 0.25}
        className="absolute top-[-14%] left-[34%] h-[70%] w-auto rotate-[62deg] origin-top"
      />
    </span>
  );
}

const DIV_STEM = "M6 20 C46 18 80 22 114 20";
const DIV_STEM_R = "M234 20 C194 22 160 18 126 20";

const lineV: Variants = {
  hidden: { pathLength: 0 },
  shown: (on: boolean) => ({ pathLength: 1, transition: { duration: on ? 1.4 : 0, ease: curve.outExpo } }),
};

/** Hairline with a small blossom and two buds in the middle. Full width of its container. */
export function FlowerDivider({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const on = !reduced;
  return (
    <motion.svg
      aria-hidden
      focusable="false"
      viewBox="0 0 240 40"
      fill="none"
      className={`pointer-events-none mx-auto block h-auto w-full max-w-xs ${className}`}
      initial={on ? "hidden" : "shown"}
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
    >
      <motion.path d={DIV_STEM} stroke={INK} strokeWidth={1} strokeLinecap="round" variants={lineV} custom={on} />
      <motion.path d={DIV_STEM_R} stroke={INK} strokeWidth={1} strokeLinecap="round" variants={lineV} custom={on} />
      <path d="M114 20 C108 12 102 12 98 16 C102 22 110 24 114 20Z" fill={LEAF} stroke={INK} strokeWidth={0.8} />
      <path d="M126 20 C132 28 140 28 144 24 C140 18 130 16 126 20Z" fill={LEAF} stroke={INK} strokeWidth={0.8} />
      <g transform="translate(120 20) scale(1.6)">
        <motion.g variants={bloomV} custom={{ on, i: 0 }} style={fillBox}>
          <FloretShape />
        </motion.g>
      </g>
      {[
        { x: 104, y: 9, r: -30 },
        { x: 137, y: 32, r: 150 },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.r})`}>
          <motion.ellipse
            rx={2.1}
            ry={3.6}
            fill={PETAL}
            stroke={INK}
            strokeWidth={0.8}
            variants={bloomV}
            custom={{ on, i: i + 3 }}
            style={fillBox}
          />
        </g>
      ))}
    </motion.svg>
  );
}
