#!/bin/sh
set -e

echo "[entrypoint] running migrations"
./node_modules/.bin/drizzle-kit migrate

if [ "${SEED:-0}" = "1" ]; then
  if grep -q '"db:seed"' package.json 2>/dev/null; then
    echo "[entrypoint] seeding"
    npm run --silent db:seed
  else
    echo "[entrypoint] SEED=1 but no db:seed script; skipping"
  fi
fi

echo "[entrypoint] starting server"
exec node server.js
