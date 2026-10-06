type Tone = "paper" | "tint";

const fill: Record<Tone, string> = { paper: "var(--paper)", tint: "var(--tint)" };

const wave = "M0 14 C 32 2, 65 2, 97 14 S 162 26, 195 14 S 260 2, 292 14 S 357 26, 390 14";

/**
 * Soft wavy edge between two sections: `from` is the section above, `to` the one below.
 * Decorative and static (reduced-motion safe); a thin lilac line rides the crest.
 */
export function SectionDivider({ from, to }: { from: Tone; to: Tone }) {
  return (
    <div aria-hidden="true" className="relative h-7 w-full leading-none" style={{ background: fill[from] }}>
      <svg viewBox="0 0 390 28" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d={`${wave} V 29 H 0 Z`} fill={fill[to]} />
        <path
          d={wave}
          fill="none"
          stroke="var(--accent-soft)"
          strokeWidth="1.25"
          opacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
