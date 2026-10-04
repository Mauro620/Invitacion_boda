import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const invitations = pgTable("invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  token: text("token").notNull().unique(),
  displayName: text("display_name").notNull(),
  maxGuests: integer("max_guests").notNull().default(1),
  phone: text("phone"),
  tag: text("tag").notNull().default("amigos"),
  personalMessage: text("personal_message"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  firstOpenedAt: timestamp("first_opened_at", { withTimezone: true }),
  lastOpenedAt: timestamp("last_opened_at", { withTimezone: true }),
  openCount: integer("open_count").notNull().default(0),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
  noteToCouple: text("note_to_couple"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const guests = pgTable(
  "guests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invitationId: uuid("invitation_id")
      .notNull()
      .references(() => invitations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    isPlusOne: boolean("is_plus_one").notNull().default(false),
    attending: boolean("attending"),
    dietaryNotes: text("dietary_notes"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("guests_invitation_id_idx").on(t.invitationId)],
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invitationId: uuid("invitation_id").references(() => invitations.id, {
      onDelete: "cascade",
    }),
    action: text("action", { enum: ["open", "rsvp", "edit"] }).notNull(),
    meta: jsonb("meta").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("audit_log_invitation_id_idx").on(t.invitationId)],
);

export type Invitation = typeof invitations.$inferSelect;
export type Guest = typeof guests.$inferSelect;
