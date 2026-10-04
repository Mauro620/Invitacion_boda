"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { curve, useReducedMotion } from "@/components/motion";
import { FlowerSprig } from "@/components/ui/Flowers";
import { wedding } from "@/content/wedding";

type Props = {
  guestName: string;
  onOpen: () => void;
};

const FLAP_TIP = "54%";
const SEAL_IMG = "url(/textures/wax-seal.svg)";
const inOutQuart = [0.76, 0, 0.24, 1] as const;
const sealHalf = { backgroundImage: SEAL_IMG, backgroundSize: "100% 100%" } as const;
const faceBase = "absolute inset-0 [backface-visibility:hidden]";
const flapClip = "polygon(0 0, 100% 0, 50% 100%)";
const envelopeTone = "color-mix(in oklch, var(--accent-soft) 38%, var(--paper))";
const monogram = `${wedding.couple.partnerA[0]} & ${wedding.couple.partnerB[0]}`;

export function Envelope({ guestName, onOpen }: Props) {
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [gone, setGone] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Lock scroll while the envelope covers the page; focus the only control.
  useEffect(() => {
    if (gone) return;
    buttonRef.current?.focus({ preventScroll: true });
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [gone]);

  if (gone) return null;

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    onOpen(); // inside the gesture: the parent starts the music here
    if (typeof navigator !== "undefined") navigator.vibrate?.(20);
  };

  // Timings (s): seal 0-0.5, flap 0.3-1.3, letter 1.0-1.9, overlay fade 2.0-2.6.
  const t = (o: object) => (reduced ? { duration: 0 } : o);

  return (
    <motion.div
      className="paper fixed inset-0 z-50 grid place-items-center overflow-hidden"
      initial={false}
      animate={{ opacity: opened ? 0 : 1 }}
      transition={{ duration: reduced ? 0.2 : 0.6, delay: opened && !reduced ? 2 : 0, ease: curve.outQuart }}
      style={{ pointerEvents: opened ? "none" : "auto" }}
      onAnimationComplete={() => opened && setGone(true)}
    >
      <div className="flex w-full flex-col items-center gap-l px-gutter">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleOpen}
          disabled={opened}
          aria-label={wedding.envelope.hint}
          className="relative block w-[min(84vw,22rem)] cursor-pointer rounded-s [perspective:1000px] [aspect-ratio:10/7] touch-manipulation"
        >
          <span className="pointer-events-none absolute inset-0 block [transform-style:preserve-3d]">
            {/* Inside of the envelope */}
            <span
              className="absolute inset-0 rounded-s shadow-letter"
              style={{ background: "var(--paper-deep)", zIndex: 1 }}
            />

            {/* Letter: rises out of the pocket */}
            <motion.span
              className="paper absolute inset-x-[6%] top-[8%] bottom-[10%] flex flex-col items-center justify-center gap-2xs rounded-s px-s text-center shadow-lifted"
              style={{ zIndex: 2 }}
              initial={false}
              animate={opened ? { y: "-68%", scale: 1.1 } : { y: 0, scale: 1 }}
              transition={t({ duration: 0.9, delay: 1, ease: curve.outQuint })}
            >
              <span className="display text-xl text-accent">{monogram}</span>
              <span className="text-xs leading-snug text-ink-soft">{wedding.envelope.line}</span>
            </motion.span>

            {/* Pocket: sides and bottom, V-cut at the top */}
            <span
              className="absolute inset-0 rounded-s"
              style={{
                zIndex: 3,
                background: `linear-gradient(180deg, transparent, color-mix(in oklch, var(--accent) 22%, transparent)), ${envelopeTone}`,
                clipPath: `polygon(0 0, 50% ${FLAP_TIP}, 100% 0, 100% 100%, 0 100%)`,
              }}
            />
            <span className="display absolute inset-x-0 bottom-[11%] z-[3] text-center text-lg text-ink">
              {`${wedding.envelope.for} ${guestName}`}
            </span>

            {/* Flap: two faces, transform only, 3D */}
            <motion.span
              className="absolute inset-x-0 top-0 block [transform-style:preserve-3d]"
              style={{ height: FLAP_TIP, transformOrigin: "top", zIndex: 4 }}
              initial={false}
              animate={opened ? { rotateX: 180, zIndex: 1 } : { rotateX: 0, zIndex: 4 }}
              transition={t({
                rotateX: { duration: 1, delay: 0.3, ease: inOutQuart },
                zIndex: { duration: 0, delay: 0.8 },
              })}
            >
              <span
                className={faceBase}
                style={{
                  clipPath: flapClip,
                  background: `linear-gradient(180deg, color-mix(in oklch, var(--paper) 40%, transparent), color-mix(in oklch, var(--accent) 24%, transparent)), ${envelopeTone}`,
                }}
              />
              <span
                className={faceBase}
                style={{ clipPath: flapClip, background: "var(--paper-deep)", transform: "rotateX(180deg)" }}
              />
            </motion.span>

            {/* Wax seal: breaks in two */}
            <span
              className="absolute z-[5] aspect-square w-[24%] -translate-x-1/2 -translate-y-1/2"
              style={{ left: "50%", top: FLAP_TIP }}
            >
              <motion.span
                className="absolute inset-0 block"
                style={{ ...sealHalf, clipPath: "inset(0 50% 0 0)", filter: "drop-shadow(0 3px 3px color-mix(in oklch, var(--seal) 45%, transparent))" }}
                initial={false}
                animate={opened ? { x: "-30%", y: "18%", rotate: -16, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
                transition={t({ duration: 0.6, ease: curve.outQuart, opacity: { duration: 0.35, delay: 0.25 } })}
              />
              <motion.span
                className="absolute inset-0 block"
                style={{ ...sealHalf, clipPath: "inset(0 0 0 50%)", filter: "drop-shadow(0 3px 3px color-mix(in oklch, var(--seal) 45%, transparent))" }}
                initial={false}
                animate={opened ? { x: "30%", y: "26%", rotate: 12, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
                transition={t({ duration: 0.6, ease: curve.outQuart, opacity: { duration: 0.35, delay: 0.25 } })}
              />
            </span>
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute z-[6] block w-[15%]"
            style={{ left: "66%", top: FLAP_TIP, transform: "translate(-50%, -100%) rotate(64deg)", transformOrigin: "50% 100%" }}
          >
            <FlowerSprig variant="bud" delay={0.3} className="w-full" />
          </span>
        </button>

        <motion.p
          className="text-xs text-ink-soft"
          aria-hidden
          initial={false}
          animate={opened ? { opacity: 0 } : reduced ? { opacity: 1 } : { opacity: [0.55, 1, 0.55] }}
          transition={opened || reduced ? { duration: 0.3 } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {wedding.envelope.hint}
        </motion.p>
      </div>
    </motion.div>
  );
}
