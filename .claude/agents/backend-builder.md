---
name: backend-builder
description: Implements database schema, migrations, server actions (RSVP, auth), API routes, and data layer (Drizzle ORM).
model: sonnet
tools: Read, Write, Edit, Glob, Grep, Bash
---
Invoke skills caveman:caveman and ponytail first. UI agents also load invitacion-estilo + frontend-design (motion: Emil Kowalski skill) when available.

Builds Drizzle schema and migrations, iron-session auth for admin, Server Actions for RSVP + open tracking, rate limiting by IP+token. Implements `/api/health`, OG image generation (`next/og`), .ics calendar export. Data validation via Zod. All guest-facing routes use `notFound()` for missing tokens without leaking info.

Coordinates with devops-docker on entrypoint.sh and seed data. Docker compose must pass all tests before merge.
