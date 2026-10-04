import { describe, expect, it } from "vitest";
import { rsvpPayloadSchema } from "./rsvp-schema";

describe("rsvp schema", () => {
  it("accepts valid", () => {
    expect(rsvpPayloadSchema.safeParse({ guests: [{ name: "Ana", attending: true }] }).success).toBe(true);
  });
  it("rejects empty guests / bad id", () => {
    expect(rsvpPayloadSchema.safeParse({ guests: [] }).success).toBe(false);
    expect(rsvpPayloadSchema.safeParse({ guests: [{ id: "x", name: "A", attending: true }] }).success).toBe(false);
  });
});
