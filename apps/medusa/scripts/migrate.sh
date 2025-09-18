#!/usr/bin/env bash
set -euo pipefail
echo "Running Medusa migrations..."
npx medusa migrations run
