import { expect, it } from "vitest";
import { clampPetals } from "./petals";

it("clamps petal count to 0..60", () => {
  expect(clampPetals(500)).toBe(60);
  expect(clampPetals(-3)).toBe(0);
  expect(clampPetals(NaN)).toBe(0);
  expect(clampPetals(12.9)).toBe(12);
});
