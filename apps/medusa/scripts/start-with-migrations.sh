#!/usr/bin/env bash
set -euo pipefail

# 1) ensure TypeScript is compiled
npm run build -- --silent || pnpm run build --filter medusa --silent

# 2) run custom supplier migration helper (safe to run repeatedly)
node ./dist/scripts/run-supplier-migration.js || true

# 3) start Medusa API (will respect $PORT on Railway/Heroku)
exec npx medusa start
