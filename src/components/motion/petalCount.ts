export const MAX_PETALS = 60;
export const clampPetals = (n: number) =>
  Math.max(0, Math.min(MAX_PETALS, Math.floor(Number.isFinite(n) ? n : 0)));
