#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$project_dir"
: "${RUNTIME_DIR:?RUNTIME_DIR must point to the worker runtime directory}"
: "${CAPTURE_URL:?CAPTURE_URL must be the exact preview URL to capture}"
: "${CAPTURE_DIR:?CAPTURE_DIR must point to an evidence directory outside the source tree}"

/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
# The runtime capture runner configures Chromium, validates page errors, writes both viewports,
# and closes the browser it launches. Strict mode makes page/rendering errors fail the capture.
CAPTURE_STRICT=1 CAPTURE_READY_SELECTOR='main#game' /usr/bin/time -p \
  node "$RUNTIME_DIR/scripts/default-capture.mjs"
