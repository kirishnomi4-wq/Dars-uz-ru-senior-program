#!/usr/bin/env bash
# Webhook v2 — AI nusxalarini HAQIQIY PostgreSQL va server bilan sinash (F-1104-24, 04.11).
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-whv2-ai.sh ai1 ai2
# Har AI: nusxa $S/wh-<ai> (o'z node_modules) · sozlama manba/whv2-ai/<ai>/sozlama.json — manzil va maydon nomlari (AI o'zi tanlagan).
# Server — whv2-server.cjs (AI nusxasining o'z dist/main.js). Natija: manba/whv2-ai/<ai>/01-haqiqiy-baza.txt
set -u
M=$(cd "$(dirname "$0")" && pwd)
S0="${S:?S=scratchpad kerak}"; S="$S0/whv2-ai"; mkdir -p "$S"
SOCK=/tmp/whv2ai-sock; mkdir -p "$SOCK"; B=/usr/lib/postgresql/18/bin; PGP=5440
export LC_MESSAGES=C LANG=C.UTF-8 NO_COLOR=1 TERM=dumb
export DATABASE_URL="postgresql://postgres@localhost:$PGP/shop" BOT_TOKEN=123:SOXTA ADMIN_TELEGRAM_IDS=111 DB_LOGGING=false
export ADMIN_PANEL_TOKEN=panel-sir PAYMENT_WEBHOOK_SECRET=tolov-kalit-sinov PORT=3200
URL=http://localhost:3200
SPID=""
pgstop(){ [ -d "$S/data" ] && $B/pg_ctl -D "$S/data" -m fast stop >/dev/null 2>&1; }
srv_start(){ : > "$S/srv.log"; ( cd "$D" && exec node "$M/whv2-server.cjs" ) >> "$S/srv.log" 2>&1 & SPID=$!
  for i in $(seq 1 100); do grep -q ishlayapti "$S/srv.log" && return 0; kill -0 "$SPID" 2>/dev/null || break; sleep 0.2; done; echo "SERVER KO'TARILMADI"; tail -20 "$S/srv.log"; return 1; }
srv_stop(){ [ -n "$SPID" ] && kill "$SPID" 2>/dev/null; [ -n "$SPID" ] && wait "$SPID" 2>/dev/null; SPID=""; }
order(){ local n; n=$(grep -c "bazada" "$S/srv.log"); kill -USR2 "$SPID"; for i in $(seq 1 50); do [ "$(grep -c bazada "$S/srv.log")" -gt "$n" ] && break; sleep 0.1; done; grep "bazada" "$S/srv.log" | tail -1 | sed -E 's/.*#([0-9]+).*/\1/'; }
sig(){ printf '%s' "$1" | openssl dgst -sha256 -hmac "$PAYMENT_WEBHOOK_SECRET" | sed 's/^.*= //'; }
post(){ curl -s -w " ← %{http_code}" -X POST "$URL$EP" -H 'Content-Type: application/json' ${2:+-H "X-Signature: $2"} -d "$1"; echo; }
cnt(){ $B/psql -h localhost -p $PGP -U postgres -d shop -Atc "SELECT count(*) FROM $TBL"; }
trap 'srv_stop; pgstop' EXIT
pgstop; rm -rf "$S/data"
$B/initdb -D "$S/data" -U postgres --auth=trust --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1 || exit 1
$B/pg_ctl -D "$S/data" -o "-p $PGP -c listen_addresses=localhost -c unix_socket_directories=$SOCK" -l "$S/pg.log" -w start >/dev/null || exit 1
for AI in "$@"; do
  D=$S0/wh-$AI; C=$M/whv2-ai/$AI/sozlama.json
  EP=$(node -e "console.log(require('$C').ep)"); TBL=$(node -e "console.log(require('$C').table)")
  mk(){ node -e "const c=require('$C');const [pid,oid,st,am,pretty]=process.argv.slice(1);const o={};o[c.f.pid]=pid;o[c.f.oid]=Number(oid);o[c.f.st]=c.st[st];o[c.f.am]=Number(am);process.stdout.write(pretty?JSON.stringify(o,null,1):JSON.stringify(o))" "$@"; }
  $B/psql -h localhost -p $PGP -U postgres -d postgres -qc "DROP DATABASE IF EXISTS shop;" -c "CREATE DATABASE shop TEMPLATE template0;"
  OUTF=$M/whv2-ai/$AI/01-haqiqiy-baza.txt
  ( cd "$D" && npx nest build ) > "$S/build.log" 2>&1 || { echo "build xato $AI"; cat "$S/build.log"; continue; }
  srv_start || { { echo "# $AI: server ko'tarilmadi"; tail -30 "$S/srv.log"; } > "$OUTF"; continue; }
  srv_stop; ( cd "$D" && npm run -s seed >/dev/null 2>&1 ); srv_start
  N=$(order); T=$($B/psql -h localhost -p $PGP -U postgres -d shop -Atc "SELECT total FROM orders WHERE id=$N")
  {
    echo "# $AI — haqiqiy PostgreSQL 18, server: AI nusxasining dist/main.js · manzil $EP · buyurtma #$N, total $T"
    grep -E "main.ts:" "$S/srv.log"
    B1=$(mk p_1 $N paid $T); echo; echo "## 1. to'g'ri imzo — to'landi"; echo "\$ $B1"; post "$B1" "$(sig "$B1")"; echo "  $TBL qatorlari: $(cnt)"
    echo; echo "## 2. o'sha xabar yana (takror)"; post "$B1" "$(sig "$B1")"; echo "  $TBL qatorlari: $(cnt)"
    B3=$(mk p_3 $N paid $T); echo; echo "## 3. imzosiz"; post "$B3"; echo "  $TBL qatorlari: $(cnt)"
    echo; echo "## 4. imzo «abc» (qisqa)"; post "$B3" abc; echo "  $TBL qatorlari: $(cnt)"
    N2=$(order); T2=$($B/psql -h localhost -p $PGP -U postgres -d shop -Atc "SELECT total FROM orders WHERE id=$N2")
    B5=$(mk p_5 $N2 paid 1200); echo; echo "## 5. imzo to'g'ri, summa 1200 (buyurtma #$N2 — $T2)"; echo "\$ $B5"; post "$B5" "$(sig "$B5")"; echo "  $TBL qatorlari: $(cnt)"
    B6=$(mk p_6 $N paid $T pretty); echo; echo "## 6. chiroyli JSON (bo'sh joy, qator) — imzo shu baytlardan"; post "$B6" "$(sig "$B6")"; echo "  $TBL qatorlari: $(cnt)"
    B7=$(mk p_7 $N paid $T); S7=$(sig "$B7"); echo; echo "## 7. bir xil xabar bir vaqtda ikki marta"
    ( post "$B7" "$S7" > "$S/c7a" ) & ( post "$B7" "$S7" > "$S/c7b" ) & sleep 2; cat "$S/c7a" "$S/c7b"; echo "  $TBL (p_7) qatorlari: $($B/psql -h localhost -p $PGP -U postgres -d shop -Atc "SELECT count(*) FROM $TBL WHERE $(node -e "console.log(require('$C').col)")='p_7'")"
    echo; echo "## 8. GET /admin/orders — panel nimani ko'radi"
    curl -s "$URL/admin/orders" -H "Authorization: Bearer $ADMIN_PANEL_TOKEN" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{for(const o of JSON.parse(s))console.log('#'+o.id, 'total', o.total, '· payment', JSON.stringify(o.payment ?? o.paymentStatus ?? o.payment_status ?? null))})"
    echo; echo "## Server logi (to'lov)"; grep -vE "^\s*$" "$S/srv.log" | sed -E 's/^\[Nest\] [0-9]+  - [0-9/,: APM]+ +//; s/ +\+[0-9]+ms$//' | grep -iE "payment|to'lov|webhook|imzo|summa|error" | grep -v "InstanceLoader\|RoutesResolver" | head -20
  } > "$OUTF" 2>&1
  srv_stop
done
echo TAYYOR
