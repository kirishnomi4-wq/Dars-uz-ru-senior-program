#!/usr/bin/env bash
# WebSocket-1 v2 mentor darsi — haqiqiy chiqishlar OrderBotNest jonli paneli ustida (F-1104-22, 04.11).
# ISHLATISH (repo ildizidan): S=<scratchpad> [P=<OrderBotNest papkasi>] [START=<ws1-start klon papkasi>] bash feedback/F-1029-02-mentor-kurs/manba/drive-ws1v2.sh
# Vaqtinchalik PostgreSQL 18 klasteri (port 5439) · server — ws1v2-server.js (OrderBotNest dist + Telegram o'rniga handleUpdate) ·
# (internetLesson package.json "type": "module" — server fayli .cjs; server ko'tarilmasa skript darhol to'xtaydi)
# klient — OrderBotNest'ning o'z scripts/live-client.js (npm run live). Natija: manba/ws1v2-out/NN-*.txt
set -u
P=${P:-/home/kali/Desktop/order-bot}
M=$(cd "$(dirname "$0")" && pwd); OUT=$M/ws1v2-out; mkdir -p "$OUT"
S="${S:?S=scratchpad kerak}/ws1v2"; mkdir -p "$S"
SOCK=/tmp/ws1v2-sock; mkdir -p "$SOCK"; B=/usr/lib/postgresql/18/bin; PGP=5439
export LC_MESSAGES=C LANG=C.UTF-8 NO_COLOR=1 FORCE_COLOR=0 TERM=dumb
export DATABASE_URL="postgresql://postgres@localhost:$PGP/shop" BOT_TOKEN=123:SOXTA ADMIN_TELEGRAM_IDS=111 DB_LOGGING=false
export ADMIN_PANEL_TOKEN=panel-sir PORT=3100 LIVE_URL=http://localhost:3100
URL=http://localhost:3100
SRV="node $M/ws1v2-server.cjs"
pgstop(){ [ -d "$S/data" ] && $B/pg_ctl -D "$S/data" -m fast stop >/dev/null 2>&1; }
SPID=""
srv_start(){ ( cd "${D:-$P}" && exec $SRV "$@" ) > "$S/srv.log" 2>&1 & SPID=$!; for i in $(seq 1 100); do grep -q "ishlayapti" "$S/srv.log" && return 0; kill -0 "$SPID" 2>/dev/null || break; sleep 0.2; done; echo "SERVER KO'TARILMADI:"; cat "$S/srv.log"; exit 1; }
srv_stop(){ [ -n "$SPID" ] && kill "$SPID" 2>/dev/null; wait "$SPID" 2>/dev/null; SPID=""; }
srvlog(){ grep -vE "^\s*$" "$S/srv.log" | sed -E 's/^\[Nest\] [0-9]+  - [0-9/,: APM]+ +//; s/ +\+[0-9]+ms$//'; }
cli(){ ( cd "${D:-$P}" && timeout "$2" node scripts/live-client.js "$1" ) 2>&1; }
cleanup(){ srv_stop; pgstop; }
trap cleanup EXIT

pgstop; rm -rf "$S/data"
$B/initdb -D "$S/data" -U postgres --auth=trust --encoding=UTF8 --locale=C.UTF-8 >"$S/initdb.log" 2>&1 || { echo "initdb xato"; exit 1; }
$B/pg_ctl -D "$S/data" -o "-p $PGP -c listen_addresses=localhost -c unix_socket_directories=$SOCK" -l "$S/pg.log" -w start >/dev/null || { echo "pg xato"; exit 1; }
$B/psql -h localhost -p $PGP -U postgres -d postgres -qc "CREATE DATABASE shop TEMPLATE template0;"
cd "$P"; npx nest build >/dev/null 2>&1 || { echo "build xato"; exit 1; }
{ node --version; npm --version; git log -1 --format='HEAD %h %s' | cut -c1-80; git status --short | head -20
  node -e "for (const k of ['@nestjs/core','@nestjs/websockets','@nestjs/platform-socket.io','socket.io','socket.io-client']) console.log(k, require(k+'/package.json').version)"; date; } > "$OUT/00-versiyalar.txt"
srv_start jim; srv_stop; npm run -s seed > "$S/seed.log" 2>&1

# 01 — server ishga tushdi: yo'llar va gateway (Nest logi)
srv_start jim; sleep 1
{ echo "# OrderBotNest serveri (PORT=3100), Nest logi — ishga tushish"; echo '$ npm run start'; srvlog | grep -E "Starting|RoutesResolver|RouterExplorer|InstanceLoader\] (LiveModule|TelegramModule)|NestApplication|ishlayapti|Telegram bot"; } > "$OUT/01-server.txt"
srv_stop

# 02 — so'rov–javob: panel so'ramaguncha yangilanmaydi (hodisa yo'q holat — oddiy HTTP)
srv_start buyurtma 2500
{ echo "# GET /admin/orders — Bobur buyurtma berishidan OLDIN va KEYIN (panel o'zi so'ramasa, yangi buyurtmani bilmaydi)"
  echo "\$ curl -s $URL/admin/orders -H 'Authorization: Bearer panel-sir'   # 1-so'rov"; curl -s "$URL/admin/orders" -H "Authorization: Bearer panel-sir"; echo
  sleep 4; echo; echo "# … 4 soniya: server logi"; srvlog | grep -E "— Bobur|bot → 5987654321"
  echo; echo "\$ curl -s $URL/admin/orders -H 'Authorization: Bearer panel-sir'   # 2-so'rov"; curl -s "$URL/admin/orders" -H "Authorization: Bearer panel-sir"; echo
  echo; echo "\$ curl -s -o /dev/null -w '%{http_code}' $URL/admin/orders   # tokensiz"; curl -s -o /dev/null -w '%{http_code}' "$URL/admin/orders"; echo; } > "$OUT/02-sorov-javob.txt"
srv_stop

# 03 — tokensiz va noto'g'ri token: server yopadi, klient qayta urinmaydi
srv_start jim; sleep 0.5
{ echo "# Tokensiz"; echo '$ npm run live -- ""'; cli "" 4; echo; echo "# Noto'g'ri token"; echo '$ npm run live -- notogri'; cli notogri 4; echo
  echo "# Server logi shu paytda ([Live] satri YO'Q — panel ulanmadi)"; srvlog | grep -E "Live|ishlayapti"; } > "$OUT/03-tokensiz-notogri.txt"
srv_stop

# 04 — token bilan: ulangan, transport, buyurtma va holat hodisasi
srv_start buyurtma 3000
{ echo "# Token bilan (.env: ADMIN_PANEL_TOKEN=panel-sir) — 3 s dan keyin Bobur buyurtma beradi, 2 s dan keyin admin tasdiqlaydi"; echo '$ npm run live'
  cli panel-sir 9; echo; echo "# Server logi"; srvlog | grep -E "Live|— Bobur|— admin|bot →|bot \(|ishlayapti"
  echo; echo "\$ curl -s $URL/admin/orders -H 'Authorization: Bearer panel-sir'   # hodisadan keyin panel so'raydigan javob"; curl -s "$URL/admin/orders" -H "Authorization: Bearer panel-sir"; echo; } > "$OUT/04-token-hodisa.txt"
srv_stop

# 05 — server to'xtadi va qayta yondi: ulanmoqda → ulangan
srv_start jim
( cli panel-sir 22 > "$S/c05.txt" ) & CP=$!
sleep 3; echo "$(date +%T) — server to'xtatildi (Ctrl+C)" >> "$S/m05.txt"; srv_stop
sleep 7; echo "$(date +%T) — server qayta ishga tushirildi" >> "$S/m05.txt"; srv_start jim
wait $CP
{ echo "# Klient ochiq turadi; 3-soniyada server to'xtatiladi, 10-soniyada qayta yoqiladi"; cat "$S/m05.txt"; echo '$ npm run live'; cat "$S/c05.txt"; } > "$OUT/05-server-ochdi-yondi.txt"
rm -f "$S/m05.txt"; srv_stop

# 06 — «muzlash» (uchish rejimiga o'xshash): TCP yopilmaydi, javob yo'q — ping timeout
srv_start jim
( cli panel-sir 62 > "$S/c06.txt" ) & CP=$!
sleep 3; echo "$(date +%T) — server jarayoni muzlatildi (kill -STOP): ulanish uzilmaydi, lekin javob yo'q" >> "$S/m06.txt"; kill -STOP "$SPID"
sleep 52; echo "$(date +%T) — server davom ettirildi (kill -CONT)" >> "$S/m06.txt"; kill -CONT "$SPID"
wait $CP
{ echo "# Klient ochiq; server jarayoni 52 s muzlatiladi (telefon «uchish rejimi»da yoki Wi-Fi o'chganda shunga o'xshash)"; cat "$S/m06.txt"; echo '$ npm run live'; cat "$S/c06.txt"
  echo; echo "# 45 s = socket.io (engine.io) standarti: pingInterval 25000 + pingTimeout 20000"; } > "$OUT/06-muzlash-ping.txt"
rm -f "$S/m06.txt"; srv_stop

# 07 — buzamiz: gateway'da disconnect() dan keyin return yo'q — server logi yolg'on gapiradi
G="$P/dist/api/live/live.gateway.js"; cp "$G" "$S/gw.bak"
python3 - "$G" <<'PY'
import sys, re
p = sys.argv[1]; s = open(p).read()
s2 = re.sub(r"(client\.disconnect\(\);)\s*\n\s*return;", r"\1", s, count=1)
assert s2 != s, 'return topilmadi'; open(p, 'w').write(s2)
PY
srv_start jim; sleep 0.5
{ echo "# live.gateway.ts: client.disconnect(); dan keyingi return; olib tashlandi (dist'da) — tokensiz klient"; echo '$ npm run live -- ""'; cli "" 4; echo
  echo "# Server logi"; srvlog | grep -E "Live|ishlayapti"; } > "$OUT/07-return-yoq.txt"
srv_stop; cp "$S/gw.bak" "$G"

# 08 — ws1-start: WebSocket hali yo'q (cicd2-done) — klient nima ko'radi
if [ -n "${START:-}" ] && [ -d "$START" ]; then
  ( cd "$START" && npx nest build >/dev/null 2>&1 )
  D="$START" srv_start jim; sleep 0.5
  { echo "# ws1-start (= cicd2-done): serverda gateway yo'q — klient (ws1-done dagi live-client.js)"; echo '$ npm run live'; cli panel-sir 6
    echo; echo "\$ curl -s $URL/admin"; curl -s "$URL/admin"; echo; } > "$OUT/08-ws1-start-gateway-yoq.txt"
  srv_stop
fi

# 10 — brauzerdagi haqiqiy panel (headless Chrome): ulangan → yangi buyurtma o'zi → holat → noto'g'ri token → server o'chdi
rm -f "$OUT"/10*.png "$OUT/.kill"; srv_start buyurtma 6000
( node "$M/ws1v2-panel.mjs" "$URL" panel-sir "$OUT" > "$S/p10.log" 2>&1 ) & PP=$!
for i in $(seq 1 200); do [ -f "$OUT/.kill" ] && break; sleep 0.2; done; srv_stop; rm -f "$OUT/.kill"
wait $PP; cat "$S/p10.log"; { echo; echo "# server logi"; srvlog | grep -E "Live|— Bobur|— admin"; } >> "$OUT/10-panel.txt"

# 09 — testlar
{ echo '$ npm test -- live'; env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 npx jest live --verbose 2>&1 | grep -vE "^\s*$" | sed -E 's/ \([0-9]+ ms\)$//'; } > "$OUT/09-test-live.txt"
echo "tayyor: $OUT"; ls "$OUT"
