/** Digits only, no leading zeros/plus, as wa.me requires. */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").replace(/^0+/, "");
}

export function buildWhatsAppLink(phone: string | null | undefined, message: string): string {
  const text = encodeURIComponent(message);
  const digits = phone ? normalizePhone(phone) : "";
  return digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function buildInviteMessage(name: string, url: string): string {
  return `Hola ${name}, te compartimos tu invitación personal a nuestra boda: ${url}`;
}
