#!/usr/bin/env bash
# drive-nest2-extra.sh — drive-nest2.sh dan keyin: 18 (ManyToOne: mavjud bo'lmagan categoryId → FK xatosi),
# 19 (ParseUUIDPipe: /car/1 → 400), 20 (kuchli, lekin noto'g'ri parol). Alohida fayl — pkill naqshi o'z shellini
# o'ldirmasin (inline buyruq qatorida «nest start» so'zi bor edi → exit 144).
# Ishlatish: bash drive-nest2-extra.sh <ish-papka> <out-papka>   (ish-papka ichida IntroNestArxitechture/ bo'lishi kerak)
set -u
WORK=${1:?}; OUT=${2:?}; cd "$WORK/IntroNestArxitechture" || exit 1
port_pid(){ ss -ltnp 'sport = :3000' 2>/dev/null | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2; }
stop(){ pkill -f "nest start" 2>/dev/null; local p; p=$(port_pid); [ -n "$p" ] && kill "$p" 2>/dev/null; sleep 1; p=$(port_pid); [ -n "$p" ] && kill -9 "$p" 2>/dev/null; sleep 1; }
up(){ for _ in $(seq 1 100); do curl -s -o /dev/null localhost:3000/api/v1 && return 0; sleep 0.5; done; return 1; }
req(){ local f="$OUT/$1" m=$2 p=$3 b=${4:-}; { echo "### $m $p${b:+   body: $b}"
  if [ -n "$b" ]; then curl -s -X "$m" "localhost:3000$p" -H 'Content-Type: application/json' -d "$b" -w '\n-- status: %{http_code}\n'
  else curl -s -X "$m" "localhost:3000$p" -w '\n-- status: %{http_code}\n'; fi; echo; } >> "$f" 2>&1; }
srvgrep(){ { echo "--- server log:"; sed 's/\x1b\[[0-9;]*m//g' "$OUT/$1" | grep -v "^\s*at " | grep -m3 -i "$2"; echo; } >> "$OUT/$3"; }
start(){ : > "$OUT/$1"; ( npx nest start >> "$OUT/$1" 2>&1 ) & up; echo "   $1 → port pid $(port_pid)"; }

stop
# ---------- 18 ManyToOne: mavjud bo'lmagan (lekin to'g'ri formatdagi) categoryId ----------
start 18-book-fk.log; F=18-book-fk-requests.txt; : > "$OUT/$F"
req $F POST /api/v1/book '{"title":"Kitob","author":"Muallif","price":1000,"categoryId":"aa8481e7-08eb-4b4d-a756-f0f378b2b108"}'
req $F GET /api/v1/book
srvgrep 18-book-fk.log "foreign key\|QueryFailedError" $F
stop

# ---------- 20 kuchli, lekin noto'g'ri parol ----------
start 20-signin-wrong.log; F=20-signin-wrong.txt; : > "$OUT/$F"
req $F POST /api/v1/admin/signin '{"username":"superadmin","password":"Notogri1!"}'
req $F POST /api/v1/admin/signin '{"username":"superadmin","password":"notogri"}'
stop

# ---------- 19 ParseUUIDPipe — /car/1 ga 500 o'rniga 400 ----------
cp src/api/car/car.controller.ts "$WORK/car.controller.bak"
python3 - <<'EOF'
p='src/api/car/car.controller.ts'; s=open(p).read()
s=s.replace("import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';","import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';")
s=s.replace("  findOne(@Param('id') id: string) {","  findOne(@Param('id', ParseUUIDPipe) id: string) {")
open(p,'w').write(s)
EOF
start 19-parseuuid.log; F=19-parseuuid.txt; : > "$OUT/$F"
{ echo "--- car.controller.ts findOne (ParseUUIDPipe bilan):"; grep -n "ParseUUIDPipe" src/api/car/car.controller.ts; echo "--- dist ichida:"; grep -rl "ParseUUIDPipe" dist | head -2; echo; } >> "$OUT/$F"
req $F GET /api/v1/car/1
req $F GET /api/v1/car/abc
req $F GET /api/v1/car/1746997c-5bde-46eb-8917-5b974105fac8
srvgrep 19-parseuuid.log "Validation failed\|BadRequest" $F
stop
cp "$WORK/car.controller.bak" src/api/car/car.controller.ts; rm -f "$WORK/car.controller.bak"
echo "TUGADI (extra)"
