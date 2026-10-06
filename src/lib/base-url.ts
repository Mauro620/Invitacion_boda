/** PUBLIC_BASE_URL without trailing slash; adds https:// when the scheme is missing. */
export function baseUrl(): string {
  const raw = (process.env.PUBLIC_BASE_URL ?? "http://localhost:3000").trim();
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withScheme.replace(/\/+$/, "");
}
