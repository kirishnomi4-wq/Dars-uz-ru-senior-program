#!/usr/bin/env bash
# WebSocket-1 v2 · qo'shimcha tajriba 11 (F-1104-22): panelda `() => yukla` (qavssiz) — hodisa keladi, ro'yxat yangilanmaydi.
# ISHLATISH (repo ildizidan, drive-ws1v2.sh dan keyin): S=<scratchpad> P=<ws1-done klon> bash feedback/F-1029-02-mentor-kurs/manba/drive-ws1v2-extra.sh
# Taqqoslash: o'sha oqim to'g'ri panel bilan (11a) va buzilgan panel bilan (11b); yonida terminal klienti hodisani ko'radi.
set -u
P=${P:?P=ws1-done klon}; M=$(cd "$(dirname "$0")" && pwd); OUT=$M/ws1v2-out
S="${S:?S=scratchpad kerak}/ws1v2x"; mkdir -p "$S"
SOCK=/tmp/ws1v2x-sock; mkdir -p "$SOCK"; B=/usr/lib/postgresql/18/bin; PGP=5441
export LC_MESSAGES=C LANG=C.UTF-8 NO_COLOR=1 FORCE_COLOR=0 TERM=dumb
export DATABASE_URL="postgresql://postgres@localhost:$PGP/shop" BOT_TOKEN=123:SOXTA ADMIN_TELEGRAM_IDS=111 DB_LOGGING=false
export ADMIN_PANEL_TOKEN=panel-sir PORT=3100 LIVE_URL=http://localhost:3100
URL=http://localhost:3100; SPID=""
srv_start(){ ( cd "$P" && exec node "$M/ws1v2-server.cjs" "$@" ) > "$S/srv.log" 2>&1 & SPID=$!; for i in $(seq 1 100); do grep -q "ishlayapti" "$S/srv.log" && return 0; kill -0 "$SPID" 2>/dev/null || break; sleep 0.2; done; cat "$S/srv.log"; exit 1; }
srv_stop(){ [ -n "$SPID" ] && kill "$SPID" 2>/dev/null; wait "$SPID" 2>/dev/null; SPID=""; }
pgstop(){ [ -d "$S/data" ] && $B/pg_ctl -D "$S/data" -m fast stop >/dev/null 2>&1; }
H="$P/public/admin.html"; cp "$H" "$S/admin.bak"
trap 'srv_stop; cp "$S/admin.bak" "$H"; pgstop' EXIT
pgstop; rm -rf "$S/data"
$B/initdb -D "$S/data" -U postgres --auth=trust --encoding=UTF8 --locale=C.UTF-8 >"$S/initdb.log" 2>&1 || exit 1
$B/pg_ctl -D "$S/data" -o "-p $PGP -c listen_addresses=localhost -c unix_socket_directories=$SOCK" -l "$S/pg.log" -w start >/dev/null || exit 1
$B/psql -h localhost -p $PGP -U postgres -d postgres -qc "CREATE DATABASE shop TEMPLATE template0;"
cd "$P"; srv_start jim; srv_stop; npm run -s seed >/dev/null 2>&1
run(){ # $1 nom, $2 izoh
  srv_start buyurtma 9000   # buyurtma panel ochilgandan keyin (Chrome ~3–5 s)
  ( cd "$P" && timeout 16 node scripts/live-client.js panel-sir > "$S/cli.txt" 2>&1 ) & CP=$!
  node "$M/ws1v2-panel-bir.mjs" "$URL" panel-sir "$OUT/$1.png" "$S/p.txt"
  wait "$CP"  # faqat klientni — argumentsiz wait fondagi serverni ham kutib osilib qoladi
  { echo "# $2"; echo "\$ grep -n \"order-changed\" public/admin.html"; grep -n "order-changed" "$H"; echo; echo "# brauzer (headless Chrome)"; cat "$S/p.txt"; echo; echo "# o'sha paytda terminal klienti (npm run live)"; cat "$S/cli.txt"; } > "$OUT/$1.txt"
  srv_stop
}
run 11a-panel-togri "To'g'ri panel: () => yukla() — hodisadan keyin ro'yxat qayta so'raladi"
python3 - "$H" <<'PY'
import sys
p = sys.argv[1]; s = open(p).read()
a = "ulanish.on('order-changed', () => yukla());"; assert s.count(a) == 1
open(p, 'w').write(s.replace(a, "ulanish.on('order-changed', () => yukla);"))
PY
run 11b-panel-qavssiz "Buzilgan panel: () => yukla (qavssiz) — funksiya chaqirilmaydi, faqat qaytariladi"
cp "$S/admin.bak" "$H"
echo tayyor; tail -4 "$OUT/11b-panel-qavssiz.txt"
