#!/usr/bin/env bash
# Copy latest mobile marketing assets into the Next.js public folder.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEST="$ROOT/web/public/images/landing"
mkdir -p "$DEST"
cp "$ROOT/assets/scan/guide-hero-v2.png" "$DEST/guide-hero-v2.png"
cp "$ROOT/assets/welcome/slide-1-v2.png" "$DEST/slide-1-v2.png"
cp "$ROOT/assets/welcome/slide-2-v2.png" "$DEST/slide-2-v2.png"
cp "$ROOT/assets/welcome/slide-3-v2.png" "$DEST/slide-3-v2.png"
cp "$ROOT/assets/icon-skinsense-v3.png" "$DEST/app-icon-v3.png"
echo "Synced landing images to $DEST"
