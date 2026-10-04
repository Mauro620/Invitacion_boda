// Link-preview and crawler fetches must not count as a guest opening the invitation.
const BOT =
  /bot|crawl|spider|preview|facebookexternalhit|whatsapp|telegram|slack|discord|embedly|curl|wget/i;

export function isLikelyBot(userAgent: string | null | undefined): boolean {
  return !userAgent || BOT.test(userAgent);
}
