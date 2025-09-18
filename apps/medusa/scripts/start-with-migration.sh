#!/usr/bin/env bash
set -euo pipefail
echo "Running Medusa migrations..."
npx medusa migrations run
echo "Starting Medusa..."
exec node ./dist/main.js
