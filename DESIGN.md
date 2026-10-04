# Design

Seed design system for the immersive wedding invitation. Three directions are built as interchangeable token sets so the couple can choose one at the Phase 1 checkpoint. Values live in `src/styles/tokens.css`; usage rules live in `.claude/skills/invitacion-estilo/SKILL.md`; strategy lives in `PRODUCT.md`.

**Scene.** A guest opens a WhatsApp link on a phone, at home in the evening or in a quiet moment at work, warm indoor light, wanting to feel personally invited. That forces a light theme: paper in hand, never a screen in the dark.

**Switching.** `data-direction="classic" | "boho" | "editorial"` on any wrapper. `:root` falls back to classic.

## Directions

### 1. Romántico clásico

- **Physical object:** an engraved invitation from an old stationer, cream cotton card, sepia ink, a gold-edged border, an oxblood wax seal.
- **Color strategy:** Restrained. Cream paper and sepia ink carry the surface; sage is the quiet secondary; old gold appears only as ornament, rules, and seal rim.
- **Type:** EB Garamond for display and reading (a true book Garamond: the voice Cormorant borrowed, with real text weights so older relatives read comfortably) + Pinyon Script for names, signatures, and the personal note.
- **Shape:** near-square corners (2 to 8px), soft paper shadows.

### 2. Jardín boho

- **Physical object:** a handbound garden journal on sun-faded cotton paper, pressed dried flowers, terracotta pots, a brass clip, a clay-red seal.
- **Color strategy:** Committed. Sand paper with terracotta carrying headlines, dividers, and the seal; brass as the metallic.
- **Type:** Alegreya for display and reading (calligraphic, written-by-hand rhythm in a serif built for long literature; replaces Playfair's high contrast with warmth that survives body sizes) + Mrs Saint Delafield as the handwritten accent.
- **Shape:** softer, hand-cut corners (4 to 20px), deeper warm shadows, stronger grain.

### 3. Minimal editorial

- **Physical object:** exhibition title lettering on an ivory gallery wall, a couture house label, one burgundy ribbon.
- **Color strategy:** Restrained, strictly. Ivory and warm ink black, burgundy as the single accent under 10% of the surface.
- **Type:** Italiana, uppercase, very large and lightly tracked, as the only display voice; Hanken Grotesk for reading. No script, no italic serif headlines, no mono labels, no ruled columns. The voice is scale and air.
- **Shape:** square corners, almost no shadow: depth comes from space.

## Color

All colors are OKLCH. Neutrals are tinted toward each direction's hue; `#000`, `#fff`, and pure grays are never used.

| Role | Token | Use |
|---|---|---|
| Paper | `--paper`, `--paper-deep` | Page and quiet panels |
| Backdrop | `--table` | Desktop surface around the centered letter |
| Ink | `--ink`, `--ink-soft` | Text, secondary text |
| Accent | `--accent`, `--accent-soft` | Emphasis, links, active states (text-safe on paper) |
| Metal | `--metal`, `--metal-ink` | Ornament and rules; `metal-ink` when gold must be read at body size |
| Seal | `--seal` | Wax seal, one deep warm red per direction |
| Line | `--line` | Hairlines, input borders |

Contrast floor: WCAG 2.2 AA. Accent and `metal-ink` were set to reach at least 4.5:1 on paper.

## Typography

- Fluid modular scale `--step--1` to `--step-7` with `clamp()`: ratio 1.25 at 390px, about 1.333 at desktop. Body starts at 17px for older readers.
- Max two families per direction. Script never carries key information (dates, addresses, RSVP labels, buttons).
- Line length capped at `--measure` (about 65ch). `text-wrap: balance` on display.
- Display tracking and case are tokens (`--display-tracking`, `--display-case`), so the same markup reads correctly in each direction.

## Elevation

Warm-tinted, layered shadows that imitate paper on a table: `--elev-paper` (resting), `--elev-lifted` (card raised by touch), `--elev-letter` (letter rising from the envelope). Editorial nearly removes shadow. Texture comes from `--texture-grain` and `--texture-fibers` blended over paper (`paper` utility), never flat fills.

## Motion

- Durations: `--dur-reveal` 600ms, `--dur-reveal-slow` 900ms, `--dur-cinematic` 1200ms; `--dur-quick` 240ms for taps only; `--stagger` 80ms.
- Curves: `--curve-out-expo`, `--curve-out-quint`, `--curve-out-quart`; `--curve-in-out-quart` only for the envelope flap and page turns. No bounce or elastic.
- Transform, opacity, clip-path, and SVG path drawing only. `prefers-reduced-motion` collapses durations to near zero; JS motion must also honor it.
- Pacing is page-turning: one orchestrated entrance per chapter.

## Components principles

- **The letter, not the page.** Mobile at 390x844 first; desktop is the same letter centered over the `table` backdrop.
- **Chapters, not sections.** Each chapter fills at least one screen, with its own transition and generous `--space-chapter` separation.
- **No cards by reflex.** Venues, itinerary, and gifts are typographic compositions on paper; a card appears only when it is truly an object (a ticket, a note).
- **Controls stay quiet.** Music toggle, chapter progress, and the sticky "Confirmar" button are small, warm, and never glassy.
- **Forms are plain and generous.** Real labels, large targets, per-person attending choices, plain-language errors.
- **Imagery is real or a beautiful stand-in.** Photos (or SVG placeholders) are framed like prints on paper, never colored blocks.
