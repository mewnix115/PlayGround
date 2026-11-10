#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$project_dir"

: "${OPENCODE_WEB_DIR:?OPENCODE_WEB_DIR must point to the worker metadata directory}"
PORT="${PORT:-3000}"
dist_dir="$project_dir/dist"

/usr/bin/time -p mkdir -p "$dist_dir" "$OPENCODE_WEB_DIR"
# This project is a dependency-free static app; copying its runtime files is its build.
/usr/bin/time -p cp index.html game.js style.css "$dist_dir/"
/usr/bin/time -p node -e 'const fs = require("node:fs"); const [file, project, directory] = process.argv.slice(1); fs.writeFileSync(file, JSON.stringify({ project, directory }));' \
  "$OPENCODE_WEB_DIR/deployment-output.json" "$project_dir" "$dist_dir"

export PORT STATIC_DIR="$dist_dir"
echo "Serving built static files from $STATIC_DIR on port $PORT"
exec /usr/bin/time -p node server.mjs
