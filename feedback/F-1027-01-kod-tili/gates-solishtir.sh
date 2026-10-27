#!/usr/bin/env bash
# Har fayl: npm run gates; yiqilgan darvoza HEAD nusxasida ham yiqiladimi (eski qarz) — solishtiradi.
SP=${SP:-/tmp/claude-1000/gates-cmp}; mkdir -p "$SP"
for f in "$@"; do
  out=$(npm run -s gates -- "$f" 2>&1 | sed 's/\x1b\[[0-9;]*m//g')
  fails=$(echo "$out" | grep -E "^  🔴 [a-z-]+$" | sed "s/.*🔴 //" | tr '\n' ' ')
  if [ -z "$fails" ]; then echo "✓ $f — hammasi o'tdi"; continue; fi
  base="$SP/$(basename "$f")"; git show "HEAD:$f" > "$base" 2>/dev/null
  verdict=""
  for g in $fails; do
    new=$(npm run -s lint:$g -- "$f" 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | grep -oE "[0-9]+ error" | head -1)
    old=$(npm run -s lint:$g -- "$base" 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | grep -oE "[0-9]+ error" | head -1)
    verdict="$verdict $g(hozir:${new:-?} · oldin:${old:-?})"
  done
  echo "• $f —$verdict"
done
