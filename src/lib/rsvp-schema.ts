import { z } from "zod";

export const rsvpGuestSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  isPlusOne: z.boolean().default(false),
  attending: z.boolean(),
  dietaryNotes: z.string().trim().max(300).optional().nullable(),
});

export const rsvpPayloadSchema = z.object({
  guests: z.array(rsvpGuestSchema).min(1).max(20),
  noteToCouple: z.string().trim().max(1000).optional().nullable(),
});

export type RsvpPayload = z.input<typeof rsvpPayloadSchema>;
