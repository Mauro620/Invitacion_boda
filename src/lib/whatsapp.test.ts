import { describe, expect, it } from "vitest";
import { buildWhatsAppLink, normalizePhone } from "./whatsapp";

describe("whatsapp", () => {
  it("normalizes phones", () => {
    expect(normalizePhone("+57 (300) 123-4567")).toBe("573001234567");
  });
  it("builds prefilled link", () => {
    expect(buildWhatsAppLink("+57 300 123 4567", "Hola & chao")).toBe(
      "https://wa.me/573001234567?text=Hola%20%26%20chao",
    );
  });
  it("works without phone", () => {
    expect(buildWhatsAppLink(null, "hi")).toBe("https://wa.me/?text=hi");
  });
});
