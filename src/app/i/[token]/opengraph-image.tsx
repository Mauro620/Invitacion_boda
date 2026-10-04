import { ImageResponse } from "next/og";
import { wedding } from "@/content/wedding";
import { getInvitationByToken } from "@/lib/invitation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = `${wedding.couple.partnerA} y ${wedding.couple.partnerB}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Inline values mirror src/styles/tokens.css (satori cannot read CSS variables).
const PAPER = "#faf7fb";
const LILAC = "#b79bd3";
const ACCENT = "#7d5aa0";
const INK = "#3a2a44";
const INK_SOFT = "#6a5875";

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await getInvitationByToken(token).catch(() => null);
  const guest = data?.invitation.displayName ?? null;
  const { partnerA, partnerB } = wedding.couple;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: PAPER,
        border: `14px solid ${LILAC}`,
        color: INK,
        fontFamily: "serif",
        textAlign: "center",
      }}
    >
      {guest && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 40, color: ACCENT }}>{wedding.personalMessage.greeting}</div>
          <div style={{ fontSize: 64, marginTop: 8, maxWidth: 1000 }}>{guest}</div>
          <div style={{ width: 160, height: 3, background: LILAC, margin: "36px 0" }} />
        </div>
      )}
      <div style={{ fontSize: guest ? 88 : 112, display: "flex", color: INK }}>
        {partnerA} y {partnerB}
      </div>
      <div style={{ fontSize: 40, marginTop: 28, color: INK_SOFT }}>{wedding.date.text}</div>
    </div>,
    size,
  );
}
