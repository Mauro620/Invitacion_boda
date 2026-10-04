# Product

## Register

brand

## Users

**Wedding guests.** Family, friends, and coworkers of the couple, spanning every age from young cousins to grandparents. Most arrive by tapping a personal link someone sent them on WhatsApp, so the first encounter happens on a phone (designed at 390x844), often on mobile data and sometimes in a distracted moment. Many are not technical; some read with reading glasses or larger system fonts.

Their job to be done:
1. Feel personally invited: this was made for *them*, not mass-mailed.
2. Learn when, where, and how to dress without hunting for it.
3. Confirm attendance for everyone in their group in seconds.

**The couple.** They use a mobile-first admin panel to load the guest list, send each personalized link via WhatsApp, follow who has opened and responded, export catering data, and read the notes guests leave them. Their job: manage the invitation list calmly from their phone without spreadsheets or follow-up calls.

## Product Purpose

An immersive, personalized web invitation that feels like opening a handwritten letter. Each guest receives a unique link that opens an envelope addressed to them by name; one gesture breaks the wax seal, starts the music, and unfolds the story of the couple in chapters: emotion first (cover, introduction, story, personal message), then information (date, venues, itinerary, dress code, gallery, gifts, recommendations), then action (RSVP), then a farewell.

It exists because a paper invitation cannot carry music, motion, or a per-guest message at scale, and a generic digital template cannot carry the couple's feeling. The full experience must also work as a moving mockup with placeholders before the real date, venues, and photos exist.

Success looks like:
- Guests reply to the couple saying they were moved, not just informed.
- Nearly every invited group confirms through the RSVP, before the deadline, without needing help.
- The couple knows the final headcount and dietary needs without chasing anyone.

## Brand Personality

**Intimate, elegant, cinematic.**

The voice is warm, poetic, and personal, written in neutral Colombian Spanish, as if the couple were writing each guest a letter by hand. It speaks to the guest directly and by name, never in the impersonal tone of an event platform. Copy is short, sincere, and unhurried; even placeholder text must carry feeling, never lorem ipsum.

Emotional arc: "This is for me" at the envelope, wonder at the cover, tenderness and complicity through the story, calm clarity in the practical details, ease at the RSVP, and a lingering emotional close. The pace is slow and deliberate, like turning pages, never like scrolling a feed.

## Anti-references

- **Template marketplaces** (Canva, Zola, and similar invitation builders): interchangeable layouts, stock ornaments, the feeling that the couple picked theme #47.
- **Pink pastel watercolor florals**: the default wedding cliché of blush washes, cartoon roses, and generic botanical corners.
- **SaaS landing page aesthetics**: hero-plus-feature-grid structure, card mosaics, pill buttons, icon rows, "Get started" energy.
- **Generic digital gloss**: decorative gradients, glassmorphism, neon glows, flat untextured color fields, cool gray shadows.
- **Party-app noise**: confetti bursts, emoji, bouncy springy animations, gamified countdowns.
- **Information dumps**: a single page that lists date, address, and RSVP form with no narrative, like an event ticket.

## Design Principles

1. **The guest's name is the protagonist.** Personalization is the core of the product, not a mail-merge field. The guest's name appears on the envelope, in the personal message, and at the RSVP, and every section should feel addressed to one person.
2. **Emotion first, information second, action last.** The narrative order is the product. Practical details earn their place after the guest feels invited, and the RSVP arrives when they already want to say yes. Never front-load logistics or forms.
3. **One gesture opens the world.** A single, unmistakable touch on the seal turns a still envelope into a living experience: motion, music, story. Interactions after that stay few and obvious; nobody should have to learn the interface.
4. **Restraint beats decoration.** Elegance comes from pacing, space, texture, and a few precise details, not from ornaments piled on. If an element does not deepen the feeling or clarify the information, it goes.
5. **Placeholders must also move you.** The mockup is a real product state, not a draft. Missing photos, dates, and venues are filled with beautiful, emotional stand-ins so the couple and early viewers feel the final experience before the content exists.

## Accessibility & Inclusion

- **WCAG 2.2 AA** as the floor: text contrast at least 4.5:1 (3:1 for large display type), including text over photos and paper textures.
- **Readable for older relatives**: generous body text sizes, comfortable line height, support for browser and OS text scaling without breaking layout, large touch targets, and decorative script type never used for essential information (dates, addresses, RSVP labels).
- **prefers-reduced-motion honored everywhere**: every reveal, parallax, 3D envelope opening, petal effect, and scroll smoothing has a calm static or fade alternative that preserves the full content and story.
- **Music and vibration are never imposed**: audio starts only after the guest's explicit gesture, is always one tap from muted, and haptics are optional enhancements.
- **Performance is inclusion**: mid-range Android phones on 4G are the baseline. LCP under 2.5 s, invitation JavaScript under 200 KB gzip, music and gallery loaded only after the envelope opens.
- **Semantic, operable RSVP**: real form controls with visible labels, clear per-person attending choices, keyboard and screen reader support, visible deadline, and plain-language error and confirmation states.
- **Language**: neutral Colombian Spanish with `lang="es-CO"`, plain wording in all functional text, and the poetic voice reserved for emotional moments.
