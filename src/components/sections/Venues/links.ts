export const isLiveUrl = (u: string) => /^https?:\/\//i.test(u);
export const isPlaceholder = (s: string) => s.trim().startsWith("TODO");

export function mapsHref(mapsUrl: string): string | null {
  return isLiveUrl(mapsUrl) ? mapsUrl : null;
}

export function wazeHref(address: string, mapsUrl: string): string | null {
  if (isLiveUrl(mapsUrl)) {
    // Prefer coordinates when the Maps URL carries them.
    const m = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (m) return `https://waze.com/ul?ll=${m[1]},${m[2]}&navigate=yes`;
  }
  if (isPlaceholder(address) || !address.trim()) return null;
  return `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;
}
