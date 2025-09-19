#!/usr/bin/env bash
set -euo pipefail
npx medusa migrations run
exec npx medusa start
