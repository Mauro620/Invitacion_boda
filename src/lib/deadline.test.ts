import { describe, expect, it } from "vitest";
import { formatDeadline, isRsvpOpen, parseDeadline } from "./deadline";

describe("parseDeadline", () => {
  it("treats placeholders and junk as no deadline", () => {
    for (const v of ["TODO", "todo: fecha", "", "  ", null, undefined, "pronto", "2026-02-30"]) {
      expect(parseDeadline(v)).toBeNull();
    }
  });
  it("closes date-only values at the end of the day in Bogota", () => {
    expect(parseDeadline("2026-11-05")?.toISOString()).toBe("2026-11-06T04:59:59.999Z");
  });
  it("accepts full ISO timestamps", () => {
    expect(parseDeadline("2026-11-05T12:00:00-05:00")?.toISOString()).toBe(
      "2026-11-05T17:00:00.000Z",
    );
  });
});

describe("isRsvpOpen", () => {
  it("is open without a real deadline", () => {
    expect(isRsvpOpen("TODO", new Date("2030-01-01"))).toBe(true);
  });
  it("is open through the deadline day and closed after", () => {
    expect(isRsvpOpen("2026-11-05", new Date("2026-11-06T04:00:00Z"))).toBe(true);
    expect(isRsvpOpen("2026-11-05", new Date("2026-11-06T05:00:00Z"))).toBe(false);
  });
});

describe("formatDeadline", () => {
  it("hides placeholders and formats real dates", () => {
    expect(formatDeadline("TODO")).toBeNull();
    expect(formatDeadline("2026-11-05")).toBe("5 de noviembre de 2026");
    expect(formatDeadline("a fin de mes")).toBe("a fin de mes");
  });
});
