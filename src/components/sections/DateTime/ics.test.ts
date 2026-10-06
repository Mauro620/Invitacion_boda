import { describe, expect, it } from "vitest";
import { buildIcs, countdown, googleCalendarUrl, monthGrid, toUtcStamp, zonedParts } from "./ics";

const start = new Date("2027-01-01T16:00:00-05:00");

describe("countdown", () => {
  it("splits days, hours, minutes and seconds", () => {
    const now = new Date(
      start.getTime() - (3 * 86_400_000 + 4 * 3_600_000 + 5 * 60_000 + 30_000 + 400),
    );
    expect(countdown(start, now)).toEqual({
      past: false,
      days: 3,
      hours: 4,
      minutes: 5,
      seconds: 30,
    });
  });
  it("flags a past date with zeros", () => {
    expect(countdown(start, new Date(start.getTime() + 1))).toEqual({
      past: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    expect(countdown(start, start).past).toBe(true);
  });
});

describe("monthGrid", () => {
  it("pads January 2027 (starts Friday) to full weeks", () => {
    const g = monthGrid(2027, 1);
    expect(g.every((w) => w.length === 7)).toBe(true);
    expect(g[0].indexOf(1)).toBe(5);
    expect(g.flat().filter(Boolean)).toHaveLength(31);
  });
});

describe("zonedParts", () => {
  it("uses the wedding timezone, not the runtime one", () => {
    expect(zonedParts(new Date("2027-01-01T02:00:00Z"), "America/Bogota")).toMatchObject({
      month: 12,
      day: 31,
    });
  });
});

describe("ics", () => {
  it("formats UTC stamps", () => {
    expect(toUtcStamp(start)).toBe("20270101T210000Z");
  });
  it("builds a valid, escaped VEVENT", () => {
    const ics = buildIcs(
      { title: "A & B", start, location: "Sitio, Calle 1; Bogotá", durationHours: 2 },
      new Date("2026-10-04T00:00:00Z"),
    );
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("DTSTART:20270101T210000Z");
    expect(ics).toContain("DTEND:20270101T230000Z");
    expect(ics).toContain("LOCATION:Sitio\\, Calle 1\; Bogotá");
  });
  it("builds a Google Calendar URL", () => {
    const url = new URL(googleCalendarUrl({ title: "A & B", start }));
    expect(url.searchParams.get("dates")).toBe("20270101T210000Z/20270102T030000Z");
    expect(url.searchParams.get("text")).toBe("A & B");
  });
});
