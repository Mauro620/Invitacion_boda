import { describe, expect, it } from "vitest";
import { buildIcs, escapeIcsText, toIcsDate } from "./ics";

describe("ics", () => {
  it("formats UTC dates", () => {
    expect(toIcsDate(new Date("2027-03-06T20:30:00Z"))).toBe("20270306T203000Z");
  });
  it("escapes text", () => {
    expect(escapeIcsText("a,b;c\nd\\")).toBe("a\\,b\;c\\nd\\\\");
  });
  it("builds a CRLF calendar", () => {
    const out = buildIcs(
      { uid: "x@y", title: "Boda", start: new Date("2027-03-06T20:00:00Z"), end: new Date("2027-03-07T02:00:00Z"), location: "Lugar, Ciudad" },
      new Date("2026-01-01T00:00:00Z"),
    );
    expect(out.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(out).toContain("SUMMARY:Boda\r\n");
    expect(out).toContain("LOCATION:Lugar\\, Ciudad\r\n");
    expect(out.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });
  it("folds long lines", () => {
    const out = buildIcs({ uid: "u", title: "x".repeat(200), start: new Date(0), end: new Date(1000) });
    expect(out.split("\r\n").every((l) => l.length <= 75)).toBe(true);
  });
});
