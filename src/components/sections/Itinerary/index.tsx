import type { ReactNode } from "react";
import { wedding } from "@/content/wedding";
import { Reveal } from "@/components/motion";

type IconKey = (typeof wedding.itinerary)[number]["icon"];

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const icons: Record<IconKey, ReactNode> = {
  rings: (
    <>
      <circle cx="19" cy="31" r="11" {...S} />
      <circle cx="33" cy="31" r="11" {...S} />
      <path d="M16 15l3-5 3 5-3 4z" {...S} />
    </>
  ),
  glass: (
    <>
      <path d="M16 8h20l-2 16a8 8 0 0 1-16 0z" {...S} />
      <path d="M26 32v12M19 46h14M17 17h18" {...S} />
    </>
  ),
  plate: (
    <>
      <circle cx="26" cy="27" r="16" {...S} />
      <circle cx="26" cy="27" r="9" {...S} />
      <path d="M5 10v14M9 10v14M5 24h4M7 24v20M47 10c-4 4-4 12 0 14v20" {...S} />
    </>
  ),
  dance: (
    <>
      <circle cx="17" cy="10" r="4" {...S} />
      <circle cx="35" cy="10" r="4" {...S} />
      <path
        d="M17 16c-2 8-6 12-6 18M17 16c3 6 6 8 8 12l-2 14M35 16c2 8 6 12 6 18M35 16c-3 6-6 8-8 12l2 14"
        {...S}
      />
      <path d="M22 26h8" {...S} />
    </>
  ),
};

export function Itinerary() {
  const items = wedding.itinerary;
  return (
    <section className="paper overflow-hidden py-chapter text-ink">
      <Reveal className="px-gutter pb-m">
        <h2 className="display text-3xl text-accent">{wedding.itineraryTitle}</h2>
      </Reveal>
      <Reveal>
        <ol
          tabIndex={0}
          className="relative flex snap-x snap-mandatory gap-l overflow-x-auto px-gutter pb-m [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-offset-[-3px]"
          style={{ scrollPaddingInline: "var(--gutter)" }}
        >
          {items.map((it, i) => (
            <li
              key={it.time}
              className={`relative w-[68vw] max-w-[17rem] shrink-0 snap-start ${i % 2 ? "mt-l" : ""}`}
            >
              <span
                aria-hidden
                className="absolute left-0 top-[3.4rem] h-px w-[calc(100%+var(--space-l))] bg-line"
              />
              <svg
                viewBox="0 0 52 52"
                className="relative h-16 w-16 bg-[var(--paper)] pr-s text-metal-ink"
                aria-hidden
              >
                {icons[it.icon]}
              </svg>
              <p className="display mt-m text-3xl tabular-nums text-accent">{it.time}</p>
              <h3 className="display mt-3xs text-xl">{it.label}</h3>
              <p className="mt-2xs text-base text-ink-soft">{it.note}</p>
            </li>
          ))}
          <li aria-hidden className="w-px shrink-0" />
        </ol>
      </Reveal>
    </section>
  );
}

export default Itinerary;
