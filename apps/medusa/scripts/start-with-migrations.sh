#!/usr/bin/env bash
set -euo pipefail

# 1) spustí čekající migrace (bez interakce)
npx medusa db:migrate

# (volitelně) pokud používáš linky v jádře/pluginu:
npx medusa db:sync-links || true

# 2) nastartuj server – vezme si $PORT od Railway
exec npx medusa start
