import { describe, expect, it } from "vitest";
import { isLikelyBot } from "./bots";

describe("isLikelyBot", () => {
  it("flags previewers and empty agents", () => {
    expect(isLikelyBot("WhatsApp/2.23.20 A")).toBe(true);
    expect(isLikelyBot("facebookexternalhit/1.1")).toBe(true);
    expect(isLikelyBot(null)).toBe(true);
  });
  it("lets real browsers through", () => {
    expect(
      isLikelyBot(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1",
      ),
    ).toBe(false);
  });
});
