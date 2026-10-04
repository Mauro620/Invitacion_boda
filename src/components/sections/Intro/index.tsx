import { Reveal } from "@/components/motion";
import { wedding } from "@/content/wedding";

export function Intro() {
  const { lines } = wedding.intro;
  return (
    <section
      className="paper relative isolate flex min-h-[844px] items-center justify-center overflow-hidden px-gutter py-chapter"
    >
      {/* Warm morning light, sits under the grain-blended paper content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 28%, oklch(90% 0.07 75 / 0.65), transparent 70%)",
        }}
      />
      <div className="mx-auto flex max-w-[var(--measure)] flex-col gap-l text-center">
        {lines.map((line, i) => (
          <Reveal key={line} as="p" delay={i === 0 ? 0 : 0.05} y={18}
            className={
              i === lines.length - 1
                ? "text-lg leading-snug text-ink-soft italic"
                : "display text-2xl text-ink"
            }
          >
            {line}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
