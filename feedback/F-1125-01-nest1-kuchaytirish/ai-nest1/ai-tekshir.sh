#!/bin/bash
# F-1125-01 · 3-ish · AI yozgan users modulini mentor kabi tekshirish (haqiqiy server + so'rovlar).
# Ishlatish: [RES=customers] bash ai-tekshir.sh <cars-api papkasi> <chiqish papkasi> <port>
# RES=users (1-yurgizish: email) · RES=customers (2-yurgizish: phone) — so'rovlar shu resursga yuboriladi
set -u
RES="${RES:-users}"; if [ "$RES" = customers ]; then K=phone; V1=+998901112233; V2=+998901112244; V3=+998901112255; V4=+998901112266; else K=email; V1=bobur@mail.uz; V2=kichik@mail.uz; V3=sardor@mail.uz; V4=soxta@mail.uz; fi
P="${1:?loyiha}"; OUT="${2:?chiqish}"; PORT="${3:-3301}"
mkdir -p "$OUT"; cd "$P" || exit 1
git diff baza --stat > "$OUT/00-diff-stat.txt" 2>&1 || git diff HEAD --stat > "$OUT/00-diff-stat.txt"
{ git status --short; echo; git diff; for f in $(git ls-files --others --exclude-standard); do echo "=== yangi: $f"; cat -n "$f"; done; } > "$OUT/01-diff.txt"
rm -rf dist; npm run build > "$OUT/02-build.txt" 2>&1; echo "build exit: $?" >> "$OUT/02-build.txt"
fuser -k $PORT/tcp >/dev/null 2>&1; sleep 0.5
PORT=$PORT setsid npx nest start > "$OUT/03-start.log" 2>&1 &
PG=$!
for i in $(seq 1 120); do grep -q -E "successfully started|error TS|Error" "$OUT/03-start.log" && break; sleep 0.5; done; sleep 1
sed -i 's/\x1b\[[0-9;]*m//g' "$OUT/03-start.log"
req() { echo "### $1 $2 ${3:-}"; if [ "$1" = POST ]; then curl -s -m 5 -w '\n← %{http_code}\n' -X POST -H 'Content-Type: application/json' -d "${3:-}" "http://localhost:$PORT$2"; else curl -s -m 5 -w '\n← %{http_code}\n' "http://localhost:$PORT$2"; fi; echo; }
{
  req GET /$RES
  req GET /$RES/1
  req GET /$RES/99
  req GET /$RES/abc
  req POST /$RES "{\"name\":\"Bobur\",\"$K\":\"$V1\",\"age\":20}"
  req POST /$RES "{\"name\":\"Kichik\",\"$K\":\"$V2\",\"age\":15}"
  req POST /$RES '{}'
  req POST /$RES "{\"name\":\"Sardor\",\"$K\":\"$V3\",\"age\":\"16\"}"
  req POST /$RES "{\"id\":1,\"name\":\"Soxta\",\"$K\":\"$V4\",\"age\":30}"
  req GET /$RES
  req GET /$RES/1
} > "$OUT/04-sorovlar.txt" 2>&1
sleep 0.5; kill -- -$PG >/dev/null 2>&1; fuser -k $PORT/tcp >/dev/null 2>&1
sed -i 's/\x1b\[[0-9;]*m//g' "$OUT/03-start.log"
echo "tayyor: $OUT"
