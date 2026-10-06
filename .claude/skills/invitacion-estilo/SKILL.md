---
name: invitacion-estilo
description: Visual and verbal style for the immersive wedding invitation. Use whenever building or reviewing any invitation section, motion, copy, placeholder asset, or the styleguide in this repo. Covers design tokens for the chosen boho direction, fonts, voice in neutral Colombian Spanish, motion rules, the immersion checklist, and the never-do list.
---

# Invitación: estilo

Source of truth: `src/styles/tokens.css` (values), `DESIGN.md` (rationale), `PRODUCT.md` (strategy, anti-references). Read them before designing. Never hardcode a color, font, duration, or easing that a token already covers.

## Direction and tokens

The couple chose **boho** (boho layout and typography with a white and lilac palette; motif: illustrated lilac flowers (line/flat), never pink pastel watercolor). Tokens live in `:root`; no wrapper or `data-direction` needed.

| Paper / ink | Accent / metal | Display + body | Script |
|---|---|---|---|
| warm white / plum ink | lilac / lilac-gray silver | Alegreya | Allura |

Tailwind utilities (mapped in `src/app/globals.css` via `@theme inline`):

- Color: `bg-paper`, `bg-paper-deep`, `bg-table`, `text-ink`, `text-ink-soft`, `text-accent`, `bg-accent-soft`, `text-metal`, `text-metal-ink`, `bg-seal`, `border-line`.
  - `metal` is for ornaments, rules, and large display only. Body-size text in the metal tone uses `text-metal-ink` (>=4.5:1).
- Type: `font-display`, `font-body`, `font-script`; sizes `text-xs` .. `text-5xl`, `text-hero` (fluid `clamp`, ratio >=1.25). The `display` utility applies family, weight, tracking, case, and balance.
- Space: `p-gutter`, `gap-s`, `mt-xl`, `py-chapter` and the rest of `3xs..2xl`. Tight inside a group, `chapter` between chapters.
- Surface: `paper` utility = paper color + grain + fibers. Use it instead of flat fills.
- Shape and depth: `rounded-s|m|l`, `shadow-paper|lifted|letter` (lilac-plum tinted, never gray).
- Motion: `ease-out-expo|out-quint|out-quart|in-out-quart`; durations via `duration-(--dur-reveal)`, `--dur-reveal-slow`, `--dur-cinematic`, `--dur-quick`, stagger `--stagger`.

Raw CSS uses the variables directly: `var(--paper)`, `var(--type-display)`, `var(--curve-out-expo)`, `var(--elev-letter)`.

## Voice

- Warm, poetic, personal, as if the couple wrote each guest a letter by hand.
- Neutral Colombian Spanish. **Tuteo by default** ("te esperamos", "confirma tu asistencia"); switch to usted only if the couple asks.
- Speak to the guest by name. Never the tone of an event platform ("Evento", "Registro", "Enviar formulario").
- Short, sincere, unhurried sentences. Poetry belongs to emotional chapters (00 to 04, 13); functional text (dates, addresses, RSVP labels, errors) stays plain and clear.
- Placeholders carry feeling too. No lorem ipsum. Mark unknown facts with `TODO:` in `src/content/wedding.ts`, never in visible prose that pretends to be real.
- Punctuation: no em dashes (and no `--`). Use commas, periods, colons, or parentheses. Spanish opening marks (¿ ¡) always.

## Motion rules

- Reveals last 600 to 1200 ms (`--dur-reveal`, `--dur-reveal-slow`, `--dur-cinematic`). Only taps and focus use `--dur-quick`.
- Exponential ease-out (`expo`, `quint`, `quart`). `in-out-quart` only for the envelope flap and page turns. No bounce, no elastic, no springs with overshoot.
- Animate `transform`, `opacity`, `clip-path`, `filter` and SVG `pathLength`. Never animate layout properties (width, height, top, margin).
- One orchestrated entrance per chapter beats scattered micro-interactions. Stagger with `--stagger`.
- `prefers-reduced-motion`: every reveal, parallax, Ken Burns, 3D flap, petals, and smooth scroll has a static or fade alternative with the full content. The tokens collapse durations automatically; JS-driven motion must also check `useReducedMotion`.
- Audio only after the guest's gesture on the seal; always one tap from mute. Vibration is optional and short.

## Immersion checklist (from PLAN section 6)

- [ ] Designed at **390x844** first. Desktop is the same letter centered over a `bg-table` backdrop (pale lilac), not a stretched layout.
- [ ] Max **2 type families**; palette of 4 to 5 tones plus lilac-gray as the metallic.
- [ ] Reveals 600 to 1200 ms, smooth curves, no bounce, all disabled under `prefers-reduced-motion`.
- [ ] Paper or grain texture instead of flat color; lilac-plum shadows, never pure gray.
- [ ] The guest's name appears **at least 3 times**: envelope, personal message, RSVP.
- [ ] Each chapter fills at least one mobile screen and has its own transition.
- [ ] Order holds: emotion, then information, then action, then farewell.
- [ ] Performance: LCP < 2.5 s on 4G, invitation JS < 200 KB gzip, music and gallery load only after the envelope opens.
- [ ] Contrast WCAG 2.2 AA (4.5:1 body, 3:1 large display), including text over photos and textures. Touch targets >= 44px.

## Never do

- Side-stripe borders (colored `border-left`/`border-right` > 1px on cards, callouts, list items).
- Gradient text (`background-clip: text` with a gradient).
- Glassmorphism, backdrop blur cards, neon glows, decorative gradients.
- Bounce, elastic, or springy overshoot; confetti; emoji; gamified countdowns.
- Script fonts for key information: dates, times, addresses, dress code, RSVP labels, buttons. Script is for names, signatures, and the personal note only, and always paired with a readable version nearby when it carries meaning.
- Em dashes or `--` in any copy.
- `#000`, `#fff`, pure grays, or cool gray shadows. Use tokens.
- Hero-metric layouts, identical card grids, icon-above-every-heading, pill-button SaaS energy, "Get started" tone.
- Modals as a first answer (lightbox for the gallery is the exception).
- Repeated tiny uppercase tracked labels above every section heading.
- Pink pastel watercolor florals, cartoon roses, stock botanical corners, Canva/Zola template look.
- Fonts on the reflex-reject list (Cormorant, Playfair Display, Fraunces, Lora, Inter, DM Serif, and the rest in impeccable's brand reference).
- Autoplay audio, or any audio before the seal gesture.
