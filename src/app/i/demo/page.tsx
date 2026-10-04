import type { Metadata } from "next";
import { DemoExperience } from "./DemoExperience";

// Fake guest for the database-free preview.
const GUEST_NAME = "Familia Pérez";

export const metadata: Metadata = {
  title: "Invitación de muestra",
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return <DemoExperience guestName={GUEST_NAME} />;
}
