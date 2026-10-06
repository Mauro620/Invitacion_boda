import { Reveal } from "@/components/motion";
import { wedding } from "@/content/wedding";

export function Intro() {
  const { lines } = wedding.intro;
  return (
    <section
      className="paper relative isolate flex items-center justify-center overflow-hidden px-gutter py-xl"
    >
      {/* Soft lilac light, sits under the grain-blended paper content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 28%, color-mix(in oklch, var(--accent-soft) 40%, transparent), transparent 70%)",
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
