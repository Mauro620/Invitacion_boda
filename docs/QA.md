# QA pass (phase 6)

Scope: security, accessibility, performance, mobile e2e. Numbers from `next build` + `next start` on this machine.

## Numbers

| Metric | Result | Target |
| --- | --- | --- |
| /i/demo first-load JS (Next report) | 192 kB gzip (modern chunks, measured 192.7 kB; the 39 kB polyfill chunk is `nomodule`) | < 200 kB |
| Lighthouse mobile /i/demo, Performance | 83 / 89 / 90 (3 runs, simulated slow 4G, 4x CPU) | >= 90 |
| Lighthouse mobile /i/demo, Accessibility | 100 (all runs) | >= 90 |
| LCP / TBT / CLS | 2.8-3.0 s / 260-420 ms / 0 | LCP < 2.5 s |
| Playwright (iPhone 13 + Pixel 7, Chromium) | 18/18 (6 demo + 3 token, per project) | green |

## Findings

| Issue | Severity | Status |
| --- | --- | --- |
| `submitRsvp` did not enforce the deadline server-side (UI only) | High | Fixed: `isRsvpOpen(wedding.rsvpDeadline)` in the action; TODO/unparseable = open |
| Envelope button `aria-label` hid its visible text (label-content-name-mismatch) | Medium | Fixed: name is now visible text + sr-only hint |
| RSVP "saved" live region was mounted together with its text (often not announced) | Medium | Fixed: persistent `aria-live` region; e2e adjusted to the `p` |
| Playwright had no phone projects | Low | Fixed: `iphone-13`, `pixel-7` (Chromium with device descriptors; WebKit is not installed) |
| No database-free e2e for /i/demo | Low | Fixed: `e2e/demo.spec.ts` (flow, lang, noindex, no overflow, music not before tap, 44px targets, axe serious/critical, admin redirect) |
| Mobile LCP 2.8-3.0 s and Performance 83-90 on throttled lab | Medium | Not fixed. Cause: script evaluation (~1.6 s throttled; motion ~50 kB gz, React/Next ~59 kB gz). Tried and discarded (no measurable gain): LazyMotion `m`, font preload, modern browserslist, dynamic Story/Gallery. Bigger fix: replace `motion` with CSS/WAAPI for Reveal/Envelope, or split post-open sections into one idle-prefetched chunk |
| Rate-limit key uses `x-forwarded-for`, spoofable without a trusted proxy | Low | Not fixed. Fine behind Railway's proxy; revisit if exposed directly |
| `recordOpen` has no rate limit (inflates open_count) | Low | Not fixed |
| After "Cambiar mi respuesta" focus is lost (button unmounts) | Low | Not fixed |
| Radio buttons are `role=radio` buttons with no arrow-key roving | Low | Not fixed; Tab + Space works |
| Rate limiters are in-memory (reset on restart, single instance) | Info | Documented in code |

## Verified OK (no change needed)

- All 12 exported admin server actions call `requireAdmin()` first; middleware covers `/admin/:path*`; `/admin/login` is exempt so there is no redirect loop; unauthenticated `/admin` returns 307 to `/admin/login` (e2e).
- iron-session cookie: `httpOnly`, `sameSite=lax`, `secure` in production, 7-day ttl; secret length enforced at request time.
- Login limiter: 5 attempts / 15 min / IP. RSVP limiter: 10 / 10 min per IP+token.
- Tokens are never logged by app code (only `db/seed.ts`, a dev script, prints them).
- Catering CSV export and all CSV output go through `csvCell`, which prefixes `'` to cells starting with `= + - @ TAB CR` (unit-tested).
- `noindex`: `X-Robots-Tag` header from middleware on `/admin/*` and `/i/*`, plus `robots` metadata on demo, token page, login, admin and styleguide.
- `lang="es-CO"`; fonts via `next/font/google` only; gallery images `loading="lazy"`; Story uses `next/image`.
- Reduced motion honored in Petals, DrawPath, Parallax, Reveal, SplitText, Hero Ken Burns, Envelope, Flowers, RsvpFab. Music is only started from the envelope tap.
- Env vars are read only in server modules; no secret reaches client bundles (`SESSION_SECRET`, `DATABASE_URL`, `ADMIN_USERS` are not imported by client components).
- Admin pages not axe-scanned here (needs a session); touch targets use `min-h-11` helpers.

## How to run

```
npm run build && npm run start -- -p 3187
E2E_BASE_URL=http://localhost:3187 npx playwright test demo.spec.ts   # no DB
E2E_BASE_URL=http://localhost:3187 npx playwright test                # needs seeded DATABASE_URL
```
