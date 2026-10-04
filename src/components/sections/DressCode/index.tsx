import { wedding } from "@/content/wedding";
import { Reveal } from "@/components/motion";

const { dressCode } = wedding;
const sizes = ["h-24 w-24", "h-28 w-28", "h-20 w-20", "h-24 w-24"];
const lines = {
  fill: "none",
  stroke: "var(--ink)",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const fabric = (hex: string) => ({
  backgroundColor: hex,
  backgroundImage:
    "radial-gradient(circle at 32% 28%, oklch(100% 0 0 / 0.22), transparent 55%), repeating-linear-gradient(45deg, oklch(0% 0 0 / 0.06) 0 1px, transparent 1px 3px), repeating-linear-gradient(-45deg, oklch(0% 0 0 / 0.05) 0 1px, transparent 1px 3px), var(--texture-grain)",
  backgroundBlendMode: "normal, normal, normal, multiply",
});

function Him() {
  return (
    <svg viewBox="0 0 120 220" className="h-full w-full" aria-hidden>
      <circle cx="60" cy="20" r="11" {...lines} />
      <path
        d="M44 38c-14 4-20 12-20 30v56M76 38c14 4 20 12 20 30v56M24 124h24M72 124h24"
        {...lines}
      />
      <path d="M44 38l16 34 16-34M52 40l8 14 8-14" {...lines} />
      <path d="M60 72v52M60 56l-4 8 4 20 4-20z" {...lines} stroke="var(--accent)" />
      <path d="M48 124l-2 88M72 124l2 88M46 212h12M74 212h12M60 124v88" {...lines} />
    </svg>
  );
}

function Her() {
  return (
    <svg viewBox="0 0 120 220" className="h-full w-full" aria-hidden>
      <circle cx="60" cy="20" r="11" {...lines} />
      <path d="M48 36c4 6 20 6 24 0M48 36c-6 8-8 22-6 38M72 36c6 8 8 22 6 38" {...lines} />
      <path d="M42 74c4 6 32 6 36 0M46 80l-14 126M74 80l14 126M32 206c18 8 38 8 56 0" {...lines} />
      <path d="M44 74h32" {...lines} stroke="var(--accent)" />
      <path
        d="M56 100c-2 36-6 70-12 104M64 100c2 36 6 70 12 104"
        {...lines}
        stroke="var(--metal-ink)"
      />
    </svg>
  );
}

export function DressCode() {
  return (
    <section className="paper px-gutter py-chapter text-ink">
      <div className="mx-auto flex max-w-[28rem] flex-col gap-xl">
        <Reveal>
          <h2 className="display text-3xl text-accent">{dressCode.label}</h2>
          <p className="mt-m text-base text-ink-soft">{dressCode.notes}</p>
        </Reveal>

        <Reveal>
          <h3 className="display text-xl">{dressCode.paletteTitle}</h3>
          <ul className="flex items-center justify-center -space-x-3 py-s" role="list">
            {dressCode.palette.map((hex, i) => (
              <li key={hex} className="list-none">
                <span
                  role="img"
                  aria-label={hex}
                  className={`block rounded-full shadow-lifted ring-2 ring-[var(--paper)] ${sizes[i % sizes.length]}`}
                  style={fabric(hex)}
                />
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <h3 className="display text-xl">{dressCode.avoidTitle}</h3>
          <ul
            className="mt-s flex flex-wrap gap-x-m gap-y-2xs border-y border-line py-s text-lg"
            role="list"
          >
            {dressCode.avoid.map((a) => (
              <li
                key={a}
                className="list-none capitalize text-ink-soft line-through decoration-seal decoration-2"
              >
                {a}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="flex items-end justify-center gap-xl">
          <div className="h-56 w-24">
            <Him />
          </div>
          <div className="h-56 w-24">
            <Her />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default DressCode;
