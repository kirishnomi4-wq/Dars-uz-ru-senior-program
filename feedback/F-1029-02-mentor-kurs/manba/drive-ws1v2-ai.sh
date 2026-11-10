#!/usr/bin/env bash
# WebSocket-1 v2 — AI yozgan jonli panellarni HAQIQIY baza bilan sinash (F-1104-22). AI'lar o'zi bazasiz (mock) sinagan edi.
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-ws1v2-ai.sh
# Har nusxa: diff · tsc · npm test · npm run smoke (vaqtinchalik PostgreSQL 18) · server (ws adapter) + xom ws klienti:
# tokensiz, noto'g'ri token, to'g'ri token + bot buyurtma oladi va admin tasdiqlaydi. Natija: manba/ws1v2-ai/<ai>/*.txt
set -u
M=$(cd "$(dirname "$0")" && pwd); AIO=$M/ws1v2-ai
S="${S:?S=scratchpad kerak}"; W=$S/ws1v2-ai-run; mkdir -p "$W"
SOCK=/tmp/ws1v2ai-sock; mkdir -p "$SOCK"; B=/usr/lib/postgresql/18/bin; PGP=5440
export LC_MESSAGES=C LANG=C.UTF-8 NO_COLOR=1 FORCE_COLOR=0 TERM=dumb
export BOT_TOKEN=123:SOXTA ADMIN_TELEGRAM_IDS=111 DB_LOGGING=false PORT=3100 ADAPTER=ws
export ADMIN_PANEL_TOKEN=panel-sir PANEL_TOKEN=panel-sir
pgstop(){ [ -d "$W/data" ] && $B/pg_ctl -D "$W/data" -m fast stop >/dev/null 2>&1; }
SPID=""
srv_start(){ node "$M/ws1v2-server.cjs" "$@" > "$W/srv.log" 2>&1 & SPID=$!; for i in $(seq 1 100); do grep -q "ishlayapti" "$W/srv.log" && return 0; kill -0 "$SPID" 2>/dev/null || break; sleep 0.2; done; echo "SERVER KO'TARILMADI:"; cat "$W/srv.log"; return 1; }
srv_stop(){ [ -n "$SPID" ] && kill "$SPID" 2>/dev/null; wait "$SPID" 2>/dev/null; SPID=""; }
srvlog(){ grep -vE "^\s*$" "$W/srv.log" | sed -E 's/^\[Nest\] [0-9]+  - [0-9/,: APM]+ +//; s/ +\+[0-9]+ms$//'; }
trap 'srv_stop; pgstop' EXIT
pgstop; rm -rf "$W/data"
$B/initdb -D "$W/data" -U postgres --auth=trust --encoding=UTF8 --locale=C.UTF-8 >"$W/initdb.log" 2>&1 || exit 1
$B/pg_ctl -D "$W/data" -o "-p $PGP -c listen_addresses=localhost -c unix_socket_directories=$SOCK" -l "$W/pg.log" -w start >/dev/null || exit 1
declare -A WSP=([ai1]=/admin/ws [ai2]=/ws/orders)
for n in ai1 ai2; do
  C=$S/ws1-$n; O=$AIO/$n; mkdir -p "$O"; cd "$C"
  $B/psql -h localhost -p $PGP -U postgres -d postgres -qc "DROP DATABASE IF EXISTS shop_$n WITH (FORCE);" -c "CREATE DATABASE shop_$n TEMPLATE template0;"
  export DATABASE_URL="postgresql://postgres@localhost:$PGP/shop_$n"
  git status --short > "$O/git-status.txt"; git add -A -N . ; git diff --stat > "$O/diff-stat.txt"; git diff > "$O/diff.patch"; git reset -q
  { echo '$ npx tsc --noEmit'; npx tsc --noEmit 2>&1 | tail -5; echo "[chiqish kodi: ${PIPESTATUS[0]}]"; echo; echo '$ npm test'; npx jest 2>&1 | grep -E "^(PASS|FAIL)|^Tests:|●" ; } > "$O/01-tsc-test.txt"
  { echo "\$ npm run smoke   # haqiqiy PostgreSQL 18"; npm run -s smoke 2>&1 | grep -vE "^\s*$|^>" | tail -14; } > "$O/02-smoke.txt"
  npx nest build >/dev/null 2>&1; srv_start jim && srv_stop; npm run -s seed >/dev/null 2>&1
  URL="ws://localhost:3100${WSP[$n]}"
  srv_start jim || continue
  { echo "# Tokensiz: $URL"; node "$M/ws1v2-ai-klient.cjs" "$URL" 2; echo; echo "# Noto'g'ri token"; node "$M/ws1v2-ai-klient.cjs" "$URL?token=notogri" 2; } > "$O/03-tokensiz-notogri.txt"
  srv_stop; srv_start buyurtma 2500 || continue
  { echo "# To'g'ri token: $URL?token=panel-sir — 2.5 s dan keyin Bobur buyurtma beradi, 2 s dan keyin admin tasdiqlaydi"; node "$M/ws1v2-ai-klient.cjs" "$URL?token=panel-sir" 7
    echo; echo "# Server logi"; srvlog | grep -vE "InstanceLoader|RoutesResolver|RouterExplorer|Starting Nest|successfully started"; } > "$O/04-token-hodisa.txt"
  srv_stop
  echo "$n tayyor"; head -3 "$O/01-tsc-test.txt"; tail -2 "$O/02-smoke.txt"
done
