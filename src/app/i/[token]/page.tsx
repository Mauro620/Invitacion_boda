import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { recordOpen, submitRsvp } from "@/app/actions/rsvp";
import { InvitationExperience } from "@/components/experience/InvitationExperience";
import { wedding } from "@/content/wedding";
import { isLikelyBot } from "@/lib/bots";
import { baseUrl } from "@/lib/base-url";
import { getInvitationByToken } from "@/lib/invitation";

// Per-guest data: never prerender or cache.
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ token: string }> };

const { partnerA, partnerB } = wedding.couple;
const names = `${partnerA} y ${partnerB}`;

export const viewport: Viewport = { themeColor: "#faf7fb" }; // --paper

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { token } = await params;
  const data = await getInvitationByToken(token).catch(() => null);
  return {
    metadataBase: new URL(baseUrl()),
    title: data ? `${names} · ${data.invitation.displayName}` : names,
    description: `${wedding.date.text}. ${wedding.envelope.line}`,
    robots: { index: false, follow: false },
    manifest: "/manifest.webmanifest",
  };
}

export default async function InvitationPage({ params }: Params) {
  const { token } = await params;
  const data = await getInvitationByToken(token);
  if (!data) notFound();
  const { invitation, guests } = data;

  // Once per page request, server side; previewers (WhatsApp, crawlers) don't count.
  const ua = (await headers()).get("user-agent");
  if (!isLikelyBot(ua)) await recordOpen(token);

  return (
    <InvitationExperience
      guestName={invitation.displayName}
      personalMessage={invitation.personalMessage}
      guests={guests.map((g) => ({
        id: g.id,
        name: g.name,
        attending: g.attending,
        dietaryNotes: g.dietaryNotes ?? undefined,
      }))}
      respondedAt={invitation.respondedAt?.toISOString() ?? null}
      noteToCouple={invitation.noteToCouple}
      onSubmitRsvp={submitRsvp.bind(null, token)}
    />
  );
}
