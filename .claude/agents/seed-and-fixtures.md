---
name: seed-and-fixtures
description: Creates demo invitation seeds (10 varied cases), CSV examples, test fixtures, and Playwright screenshots.
model: haiku
tools: Read, Write, Edit, Glob, Grep, Bash
---
Invoke skills caveman:caveman and ponytail first. UI agents also load invitacion-estilo + frontend-design (motion: Emil Kowalski skill) when available.

Generates 10 seed invitations (single guest, family of 5, with personal message, pre-responded, etc.) in migration or seed file. Creates CSV template for bulk import. Produces Playwright screenshots (390×844) of each section and saves to `docs/mockup/` for stakeholder review.

All seeds use placeholder-assets and emotionally resonant copy from copywriter-es. Verifies `docker compose up --build && npm run test` passes.
