#!/bin/bash
# F-1125-01 · Nest-2 AI bloki — AI qo'shgan customer resursini mentor kabi tekshirish (haqiqiy server + PostgreSQL).
# Ishlatish: [RES=customer NF=name PF=phone AF=age] bash ai-tekshir2.sh <repo papkasi> <chiqish papkasi> [port]
# RES — Controller yo'li (AI tanlagan), NF/PF/AF — maydon nomlari (AI tanlagan). Token: superadmin (baza.sh .env).
set -u
P="${1:?repo}"; OUT="${2:?chiqish}"; PORT="${3:-3000}"
RES="${RES:-customer}"; NF="${NF:-name}"; PF="${PF:-phone}"; AF="${AF:-age}"
mkdir -p "$OUT"; cd "$P" || exit 1
{ git status --short; echo; git diff; for f in $(git ls-files --others --exclude-standard); do echo "=== yangi: $f"; cat -n "$f"; done; } > "$OUT/01-diff.txt"
rm -rf dist; npm run build > "$OUT/02-build.txt" 2>&1; echo "build exit: $?" >> "$OUT/02-build.txt"
fuser -k $PORT/tcp >/dev/null 2>&1; sleep 0.5
PORT=$PORT setsid npx nest start > "$OUT/03-start.log" 2>&1 &
PG=$!
for i in $(seq 1 160); do curl -s -o /dev/null "localhost:$PORT/api/v1" && break; kill -0 $PG 2>/dev/null || break; sleep 0.5; done; sleep 1
U="http://localhost:$PORT/api/v1"
TOKEN=$(curl -s -X POST "$U/admin/signin" -H 'Content-Type: application/json' -d '{"username":"superadmin","password":"Superadmin1!"}' | python3 -c 'import sys,json
try: print(json.load(sys.stdin)["data"]["token"])
except Exception: print("")')
H=(-H "Authorization: Bearer $TOKEN")
body() { printf '{"%s":"%s","%s":"%s","%s":%s%s}' "$NF" "$1" "$PF" "$2" "$AF" "$3" "${4:-}"; }
req() { local m=$1 p=$2 b=${3:-} t=${4:-}; local A=(); [ -n "$t" ] && A=("${H[@]}"); echo "### $m /api/v1$p${b:+  $b}${t:+  [token]}"
  if [ -n "$b" ]; then curl -s -m 8 -w '\n← %{http_code}\n' -X "$m" "$U$p" -H 'Content-Type: application/json' "${A[@]}" -d "$b"
  else curl -s -m 8 -w '\n← %{http_code}\n' -X "$m" "$U$p" "${A[@]}"; fi; echo; }
{
  echo "token olindi: $([ -n "$TOKEN" ] && echo ha || echo YO\'Q)"; echo
  req GET "/$RES"
  req POST "/$RES" "$(body Bobur +998901112233 20)"
  req POST "/$RES" "$(body Bobur +998901112233 20)" t
  req POST "/$RES" "$(body Kichik +998901112244 15)" t
  req POST "/$RES" '{}' t
  req POST "/$RES" "$(body Sardor +998901112255 30 ',"id":"00000000-0000-0000-0000-000000000001"')" t
  req POST "/$RES" "$(body Takror +998901112233 25)" t
  req POST "/$RES" "$(printf '{"%s":"Matn","%s":"+998901112266","%s":"20"}' "$NF" "$PF" "$AF")" t
  ID=$(curl -s "$U/$RES" "${H[@]}" | python3 -c 'import sys,json
try:
  d=json.load(sys.stdin)["data"]; d=d if isinstance(d,list) else d.get("data", d.get("items", []))
  print(d[0]["id"])
except Exception: print("")')
  echo "birinchi id: ${ID:-YOQ}"; echo
  req GET "/$RES"
  req GET "/$RES/abc"
  req GET "/$RES/00000000-0000-0000-0000-000000000000"
  [ -n "$ID" ] && req GET "/$RES/$ID"
  [ -n "$ID" ] && req PATCH "/$RES/$ID" "$(printf '{"%s":31}' "$AF")"
  [ -n "$ID" ] && req PATCH "/$RES/$ID" "$(printf '{"%s":12}' "$AF")" t
  [ -n "$ID" ] && req DELETE "/$RES/$ID"
  [ -n "$ID" ] && req DELETE "/$RES/$ID" "" t
} > "$OUT/04-sorovlar.txt" 2>&1
sleep 0.5; kill -- -$PG >/dev/null 2>&1; fuser -k $PORT/tcp >/dev/null 2>&1
sed -i 's/\x1b\[[0-9;]*m//g' "$OUT/03-start.log"
echo "tayyor: $OUT"
