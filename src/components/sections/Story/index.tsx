"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Fragment } from "react";
import { DrawPath, Reveal, curve, dur, useReducedMotion } from "@/components/motion";
import { FlowerDivider } from "@/components/ui/Flowers";
import { wedding } from "@/content/wedding";

const THREAD = "M20 0 C 40 24, 0 44, 20 66 S 0 100, 20 120";

function Photo({ src, alt }: { src: string; alt: string }) {
  const reduced = useReducedMotion();
  const img = (
    <Image
      src={src}
      alt={alt}
      width={640}
      height={800}
      sizes="(min-width: 640px) 28rem, 100vw"
      className="aspect-[4/5] w-full object-cover"
    />
  );
  if (reduced) return <div className="overflow-hidden rounded-l shadow-lifted">{img}</div>;
  return (
    <motion.div
      className="overflow-hidden rounded-l shadow-lifted"
      initial={{ clipPath: "inset(0 0 100% 0 round 20px)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0 round 20px)" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: dur.cinematic, ease: curve.outExpo }}
    >
      {img}
    </motion.div>
  );
}

export function Story() {
  const items = wedding.story;
  return (
    <section className="paper min-h-[844px] px-gutter py-chapter">
      <FlowerDivider className="mb-l" />
      <ol className="mx-auto flex max-w-md flex-col items-center">
        {items.map((m, i) => (
          <Fragment key={m.title}>
            <li className="flex w-full flex-col gap-m">
              <Photo src={m.photo} alt={m.title} />
              <Reveal className="text-center">
                <p className="text-xs tracking-widest text-metal-ink uppercase">{m.year}</p>
                <h3 className="display mt-3xs text-2xl">{m.title}</h3>
                <p className="mt-2xs text-ink-soft">{m.text}</p>
              </Reveal>
            </li>
            {i < items.length - 1 && (
              <DrawPath d={THREAD} viewBox="0 0 40 120" className="my-m h-[120px] w-[40px]" />
            )}
          </Fragment>
        ))}
      </ol>
    </section>
  );
}
