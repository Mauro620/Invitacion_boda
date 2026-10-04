"use client";

import {
  InvitationExperience,
  type ExperienceGuest,
  type RsvpPayload,
} from "@/components/experience/InvitationExperience";

const MOCK_GUESTS: ExperienceGuest[] = [
  { id: "g1", name: "Carlos Pérez", attending: null },
  { id: "g2", name: "Marta Pérez", attending: null },
  { id: "g3", name: "Sofía Pérez", attending: null },
];

// No database: pretend the save worked after a short wait.
async function mockSubmit(payload: RsvpPayload) {
  void payload;
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true };
}

export function DemoExperience({ guestName }: { guestName: string }) {
  return (
    <InvitationExperience guestName={guestName} guests={MOCK_GUESTS} onSubmitRsvp={mockSubmit} />
  );
}
