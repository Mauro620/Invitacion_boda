# Deploy

## Local (Docker, parity with Railway)

```bash
cp .env.example .env   # optional; compose has defaults
docker compose up --build
curl localhost:3000/api/health   # 200
```

Set `SEED=1` to run `npm run db:seed` after migrations (if the script exists).
The entrypoint runs `drizzle-kit migrate` and then `node server.js`.

## Railway

1. New project, **Add Postgres** (managed service).
2. **New Service**, **GitHub repo**. Railway detects the `Dockerfile`.
3. Variables on the app service:
   - `DATABASE_URL=${{Postgres.DATABASE_URL}}`
   - `SESSION_SECRET` (32+ random chars, e.g. `openssl rand -base64 32`)
   - `ADMIN_USERS` (`email:bcryptHash,email:bcryptHash`)
   - `PUBLIC_BASE_URL` (the public URL, no trailing slash)
   - `NODE_ENV=production`
4. Settings: healthcheck path `/api/health`. Leave **App Sleeping** disabled so the invitation always answers instantly.
5. Domain: free `*.up.railway.app` or a custom domain (CNAME to the Railway target).
6. Uploads from the admin: add a **Volume** to the app service mounted at `/app/uploads`.
7. Migrations run automatically on each deploy (entrypoint). Set `SEED=1` only for the first demo deploy, then remove it.

Notes: Railway sets `PORT`; the standalone server honors it. The container runs as non-root (uid 1001); Railway volumes may need `RAILWAY_RUN_UID=0` if the mount is not writable.
