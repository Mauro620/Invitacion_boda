import { wedding } from "@/content/wedding";
import { Reveal } from "@/components/motion";

const { dressCode } = wedding;
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
    "radial-gradient(circle at 32% 28%, color-mix(in oklch, var(--paper) 30%, transparent), transparent 55%), repeating-linear-gradient(45deg, color-mix(in oklch, var(--ink) 7%, transparent) 0 1px, transparent 1px 3px), repeating-linear-gradient(-45deg, color-mix(in oklch, var(--ink) 6%, transparent) 0 1px, transparent 1px 3px), var(--texture-grain)",
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
      <path
        d="M44 38c-14 4-20 12-20 30v56h72V68c0-18-6-26-20-30z"
        fill="var(--ink)"
        fillOpacity="0.88"
        stroke="none"
      />
      <path d="M50 38l10 12 10-12" {...lines} stroke="var(--paper)" />
      <path d="M60 50v74" {...lines} stroke="var(--paper)" strokeWidth={1} />
      {[62, 80, 98].map((y) => (
        <circle key={y} cx="60" cy={y} r="1.6" fill="var(--paper)" />
      ))}
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

function Swatch({ hex, name, className }: { hex: string; name: string; className: string }) {
  return (
    <span
      role="img"
      aria-label={name}
      className={`block rounded-full shadow-lifted ring-2 ring-[var(--paper)] ${className}`}
      style={fabric(hex)}
    />
  );
}

export function DressCode() {
  const { her, him } = dressCode;
  return (
    <section className="paper px-gutter py-chapter text-ink">
      <div className="mx-auto flex max-w-[28rem] flex-col gap-xl">
        <Reveal>
          <h2 className="display text-3xl text-accent">{dressCode.label}</h2>
          <p className="mt-m text-base text-ink-soft">{dressCode.notes}</p>
        </Reveal>

        <Reveal>
          <h3 className="display text-xl">{dressCode.avoidTitle}</h3>
          <ul className="mt-s flex justify-center gap-l border-y border-line py-m" role="list">
            {dressCode.avoid.map((c) => (
              <li key={c.name} className="flex list-none flex-col items-center gap-2xs">
                <span className="relative">
                  <Swatch hex={c.hex} name={c.name} className="h-16 w-16" />
                  <span
                    aria-hidden
                    className="absolute top-1/2 left-1/2 h-0.5 w-20 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-seal"
                  />
                </span>
                <span className="text-lg capitalize text-ink-soft line-through decoration-seal decoration-2">
                  {c.name}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="grid grid-cols-2 gap-m">
          <div className="flex flex-col items-center gap-s text-center">
            <div className="h-48 w-20">
              <Her />
            </div>
            <h3 className="display text-xl text-accent">{her.title}</h3>
            <p className="text-base text-ink-soft">{her.text}</p>
          </div>
          <div className="flex flex-col items-center gap-s text-center">
            <div className="h-48 w-20">
              <Him />
            </div>
            <h3 className="display text-xl text-accent">{him.title}</h3>
            <p className="text-base text-ink-soft">{him.text}</p>
            <ul className="flex -space-x-2" role="list">
              {him.palette.map((c) => (
                <li key={c.name} className="list-none">
                  <Swatch hex={c.hex} name={c.name} className="h-10 w-10" />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default DressCode;
