// Mirrors --dur-* / --curve-* / --stagger in src/styles/tokens.css (seconds, bezier tuples).
export const dur = { reveal: 0.6, slow: 0.9, cinematic: 1.2 } as const;
export const curve = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuint: [0.22, 1, 0.36, 1],
  outQuart: [0.25, 1, 0.5, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;
export const stagger = 0.08;
