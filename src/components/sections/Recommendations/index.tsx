import { Reveal } from "@/components/motion";
import { wedding } from "@/content/wedding";

const r = wedding.recommendations;

const ICONS = {
  lodging: (
    <path d="M4 26V12m0 8h24a4 4 0 014 4v2M4 26h28M10 16h6a2 2 0 012 2v2H8v-2a2 2 0 012-2z" />
  ),
  transport: <path d="M6 22l3-8h14l3 8M6 22v5h3v-3h14v3h3v-5M6 22h20M11 19h.01M21 19h.01" />,
  adultsOnly: <path d="M16 6a4 4 0 100 8 4 4 0 000-8zM8 27c0-5 3.5-8 8-8s8 3 8 8" />,
  weather: <path d="M10 22a5 5 0 010-10 7 7 0 0113 2 4 4 0 010 8H10z" />,
} as const;

const ORDER = ["lodging", "transport", "adultsOnly", "weather"] as const;

export function Recommendations() {
  return (
    <section className="paper px-gutter py-chapter">
      <div className="mx-auto flex max-w-(--measure) flex-col gap-l">
        <ul className="flex flex-col gap-l">
          {ORDER.map((k, i) => (
            <Reveal as="li" key={k} delay={i * 0.06} className="flex gap-s">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 shrink-0 text-metal-ink"
                aria-hidden
              >
                {ICONS[k]}
              </svg>
              <div>
                <h3 className="display text-xl text-accent">{r.titles[k]}</h3>
                <p className="mt-3xs text-ink">{r[k]}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal className="border-t border-line pt-m text-center">
          <p className="display text-2xl text-accent">{wedding.couple.hashtag}</p>
        </Reveal>
      </div>
    </section>
  );
}
