"use client";

import { useEffect, useRef } from "react";
import { clampPetals } from "./petalCount";
import { useReducedMotion } from "./useReducedMotion";

type Props = {
  /** Clamped to 60. */
  count?: number;
  /** Any CSS color; defaults to the accent-soft token. */
  color?: string;
  className?: string;
  /** One-shot burst from a point (fractions of the canvas, 0-1): petals fly out, then fall and fade. */
  burst?: { x: number; y: number };
};

type Petal = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  rot: number;
  vr: number;
  ph: number;
  life?: number;
};

/** Slow falling petals on a canvas. Renders nothing under reduced motion. */
export function Petals({ count = 24, color = "var(--accent-soft)", className, burst }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx || reduced) return;
    const fill = getComputedStyle(cv).getPropertyValue("--petal").trim() || "oklch(80% 0.07 305)";
    let w = 0,
      h = 0,
      raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    if (burst) {
      const ox = burst.x * w;
      const oy = burst.y * h;
      const ps: Petal[] = Array.from({ length: clampPetals(count) }, () => {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5;
        const sp = 3 + Math.random() * 6;
        return {
          x: ox, y: oy, r: 4 + Math.random() * 5,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.18,
          ph: Math.random() * 6.28, life: 0,
        };
      });
      const start = performance.now();
      const frame = (t: number) => {
        const k = (t - start) / 2200;
        ctx.clearRect(0, 0, w, h);
        if (k >= 1) return;
        ctx.fillStyle = fill;
        for (const p of ps) {
          p.vx *= 0.97;
          p.vy = p.vy * 0.97 + 0.09;
          p.x += p.vx + Math.sin(t / 400 + p.ph) * 0.3;
          p.y += p.vy;
          p.rot += p.vr;
          ctx.globalAlpha = 0.85 * Math.min(1, (1 - k) * 2.5);
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.28);
          ctx.fill();
          ctx.restore();
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      window.addEventListener("resize", resize);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
      };
    }
    const mk = (initial: boolean): Petal => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : -20,
      r: 4 + Math.random() * 5,
      vy: 0.3 + Math.random() * 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      rot: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 0.02,
      ph: Math.random() * 6.28,
    });
    const ps = Array.from({ length: clampPetals(count) }, () => mk(true));
    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = fill;
      ctx.globalAlpha = 0.75;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.y += p.vy;
        p.rot += p.vr;
        p.x += p.vx + Math.sin(t / 1500 + p.ph) * 0.4;
        if (p.y > h + 20) ps[i] = mk(false);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.28);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count, reduced, burst]);

  if (reduced) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ ["--petal" as string]: color, pointerEvents: "none", width: "100%", height: "100%" }}
    />
  );
}
