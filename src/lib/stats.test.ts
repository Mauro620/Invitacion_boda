import { describe, expect, it } from "vitest";
import { computeStats, invitationStatus, parseDeadline } from "./stats";

const inv = (openCount: number, respondedAt: string | null, ...att: (boolean | null)[]) => ({
  openCount,
  respondedAt,
  guests: att.map((attending) => ({ attending })),
});

describe("invitationStatus", () => {
  it("covers every state", () => {
    expect(invitationStatus(inv(0, null, null))).toBe("pending");
    expect(invitationStatus(inv(2, null, null))).toBe("opened");
    expect(invitationStatus(inv(1, "2026-01-01", true, false))).toBe("confirmed");
    expect(invitationStatus(inv(1, "2026-01-01", false, false))).toBe("declined");
  });
});

describe("computeStats", () => {
  it("counts people and opened-without-reply", () => {
    const s = computeStats([
      inv(1, "2026-01-01", true, false),
      inv(3, null, null, null),
      inv(0, null, null),
    ]);
    expect(s).toEqual({
      totalPeople: 5,
      confirmed: 1,
      declined: 1,
      pending: 3,
      openedNoReply: 1,
      invitations: 3,
    });
  });
  it("handles empty", () => {
    expect(computeStats([]).totalPeople).toBe(0);
  });
});

describe("parseDeadline", () => {
  it("returns null for placeholders", () => {
    expect(parseDeadline("TODO")).toBeNull();
  });
  it("returns ISO for dates", () => {
    expect(parseDeadline("2026-11-15")).toBe("2026-11-15T00:00:00.000Z");
  });
});
