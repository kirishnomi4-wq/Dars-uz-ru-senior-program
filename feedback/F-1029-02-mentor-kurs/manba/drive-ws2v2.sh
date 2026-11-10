#!/usr/bin/env bash
# WebSocket-2 v2 mentor darsi — haqiqiy chiqishlar OrderBotNest jonli paneli ustida: uzilishdan keyin nima yo'qoladi (F-1104-23, 04.11).
# ISHLATISH (repo ildizidan): S=<scratchpad> [P=<OrderBotNest — ws2-done ishchi nusxasi>] bash feedback/F-1029-02-mentor-kurs/manba/drive-ws2v2.sh [qadam…]
# To'rt nusxa ($S/ws2v2/): start — ws1-done fb8b8b4 (= ws2-start) · done — P ishchi daraxti (ws2-done) ·
#   xato — done, lekin tinglovchi connect ICHIDA (sodda «tuzatish») · tiklash — start + @WebSocketGateway({ connectionStateRecovery }).
# Server — ws2v2-server.cjs (dist + Telegram o'rniga handleUpdate; SIGUSR2 = Bobur buyurtma beradi; «navbat» — server o'chiq
# paytda yozilgan xabar ishga tushishi bilan). Panel — headless Chrome (ws2v2-panel.mjs), klient — loyihaning npm run live.
# Tarmoq uzilishi — ws2v2-proksi.cjs (3101 → 3100). PostgreSQL 18 vaqtinchalik (5439). Natija: manba/ws2v2-out/NN-*.txt (+ png)
set -u
P=${P:-/home/kali/Desktop/order-bot}
M=$(cd "$(dirname "$0")" && pwd); OUT=$M/ws2v2-out; mkdir -p "$OUT"
S="${S:?S=scratchpad kerak}/ws2v2"; mkdir -p "$S"
SOCK=/tmp/ws2v2-sock; mkdir -p "$SOCK"; B=/usr/lib/postgresql/18/bin; PGP=5439
export LC_MESSAGES=C LANG=C.UTF-8 NO_COLOR=1 FORCE_COLOR=0 TERM=dumb
export DATABASE_URL="postgresql://postgres@localhost:$PGP/shop" BOT_TOKEN=123:SOXTA ADMIN_TELEGRAM_IDS=111 DB_LOGGING=false
export ADMIN_PANEL_TOKEN=panel-sir PORT=3100
QADAM=" ${*:-01 02 03 04 05 06 07 08 09 10 11} "
bor(){ [[ "$QADAM" == *" $1 "* ]]; }
pgstop(){ [ -d "$S/data" ] && $B/pg_ctl -D "$S/data" -m fast stop >/dev/null 2>&1; }
SPID=""; XPID=""; PPID2=""
srv_start(){ local n0; n0=$(grep -c ishlayapti "$S/srv.log" 2>/dev/null); n0=${n0:-0}
  ( cd "$D" && exec node "$M/ws2v2-server.cjs" "$@" ) >> "$S/srv.log" 2>&1 & SPID=$!
  for i in $(seq 1 100); do [ "$(grep -c ishlayapti "$S/srv.log")" -gt "$n0" ] && return 0; kill -0 "$SPID" 2>/dev/null || break; sleep 0.2; done
  echo "SERVER KO'TARILMADI ($D):"; tail -20 "$S/srv.log"; exit 1; }
srv_stop(){ [ -n "$SPID" ] && kill "$SPID" 2>/dev/null; [ -n "$SPID" ] && wait "$SPID" 2>/dev/null; SPID=""; }
usr2(){ kill -USR2 "$SPID"; }
srvlog(){ grep -vE "^\s*$" "$S/srv.log" | sed -E 's/^\[Nest\] [0-9]+  - [0-9/,: APM]+ +//; s/ +\+[0-9]+ms$//' | grep -E "Live|Bobur|bazada|ishlayapti|XATO|bot → 5987654321: Buyurtma"; }
prx_start(){ node "$M/ws2v2-proksi.cjs" 3101 3100 > "$S/prx.log" 2>&1 & XPID=$!; sleep 0.5; }
prx_cut(){ kill -USR2 "$XPID"; }
panel(){ rm -f "$S"/.ready "$S"/.end "$S"/.snap-* "$S"/.offline "$S"/.online
  ( cd "$D" && node "$M/ws2v2-panel.mjs" "$1" panel-sir "$S" "$2" "$3" ) > "$S/panel-$2.err" 2>&1 & PPID2=$!
  for i in $(seq 1 80); do [ -e "$S/.ready" ] && return 0; sleep 0.25; done; echo "PANEL OCHILMADI"; cat "$S/panel-$2.err"; exit 1; }
snap(){ touch "$S/.snap-$(date +%s%N)-$1"; sleep 0.6; }
panel_end(){ touch "$S/.end"; wait "$PPID2" 2>/dev/null; PPID2=""; }
cli(){ ( cd "$D" && timeout "$1" node scripts/live-client.js ) > "$S/cli-$2.txt" 2>&1 & CPID=$!; sleep 1; }
qayd(){ echo "$(date +%T) — $*" >> "$S/qayd.txt"; }
db(){ $B/psql -h localhost -p $PGP -U postgres -d shop -Atc "$1"; }
cleanup(){ [ -n "$PPID2" ] && kill "$PPID2" 2>/dev/null; [ -n "$XPID" ] && kill "$XPID" 2>/dev/null; srv_stop; pgstop; }
trap cleanup EXIT

# --- nusxalar ---
R=$S/nusxa; rm -rf "$R"; mkdir -p "$R"
git clone -q "$P" "$R/start" && git -C "$R/start" checkout -q fb8b8b4 || { echo "start klon xato"; exit 1; }
mkdir -p "$R/done"; tar -C "$P" --exclude=./node_modules --exclude=./dist --exclude=./.git --exclude=./.env -cf - . | tar -C "$R/done" -xf -
cp -r "$R/done" "$R/xato"; cp -r "$R/start" "$R/tiklash"; rm -rf "$R/tiklash/.git"
for v in start done xato tiklash; do ln -s "$P/node_modules" "$R/$v/node_modules"; done
python3 - "$R/xato/public/admin.html" "$R/tiklash/src/api/live/live.gateway.ts" <<'PYEOF'
import sys
from pathlib import Path
x = Path(sys.argv[1]); s = x.read_text()
old = """    ulanish.on('connect', () => {
      holatQoy('ulangan');
      yukla();
    });"""
new = """    ulanish.on('connect', () => {
      holatQoy('ulangan');
      yukla();
      ulanish.on('order-changed', () => yukla());
    });"""
assert old in s; s = s.replace(old, new)
o2 = "    // tinglovchi bir marta, connect'dan TASHQARIDA (ichida bo'lsa har qayta ulanishda yana bittasi qo'shiladi)\n    ulanish.on('order-changed', () => yukla());\n  }"
assert o2 in s; s = s.replace(o2, "  }")
x.write_text(s)
g = Path(sys.argv[2]); s = g.read_text()
assert "@WebSocketGateway()" in s
g.write_text(s.replace("@WebSocketGateway()", "@WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 } })"))
PYEOF
for v in start done xato tiklash; do ( cd "$R/$v" && npx nest build >/dev/null 2>&1 ) || { echo "build xato: $v"; exit 1; }; done
{ echo "# nusxalar farqi"; for v in done xato; do echo "## start → $v"; diff -u "$R/start/public/admin.html" "$R/$v/public/admin.html" | tail -n +3; done
  echo "## start → tiklash (live.gateway.ts)"; diff -u "$R/start/src/api/live/live.gateway.ts" "$R/tiklash/src/api/live/live.gateway.ts" | tail -n +3
  echo "## start → done (scripts/live-client.js)"; diff -u "$R/start/scripts/live-client.js" "$R/done/scripts/live-client.js" | tail -n +3; } > "$OUT/00b-nusxalar-farqi.txt"

# --- baza ---
pgstop; rm -rf "$S/data"; : > "$S/srv.log"
$B/initdb -D "$S/data" -U postgres --auth=trust --encoding=UTF8 --locale=C.UTF-8 >"$S/initdb.log" 2>&1 || { echo "initdb xato"; exit 1; }
$B/pg_ctl -D "$S/data" -o "-p $PGP -c listen_addresses=localhost -c unix_socket_directories=$SOCK" -l "$S/pg.log" -w start >/dev/null || { echo "pg xato"; exit 1; }
yangi_baza(){ srv_stop; $B/psql -h localhost -p $PGP -U postgres -d postgres -qc "DROP DATABASE IF EXISTS shop;" -c "CREATE DATABASE shop TEMPLATE template0;"
  D=$R/start srv_start jim; srv_stop; ( cd "$R/start" && npm run -s seed > "$S/seed.log" 2>&1 ); }
{ node --version; npm --version; git -C "$P" log -1 --format='P HEAD %h %s' | cut -c1-90; git -C "$P" status --short
  ( cd "$P" && node -e "for (const k of ['@nestjs/core','@nestjs/websockets','@nestjs/platform-socket.io','socket.io','socket.io-client']) console.log(k, require(k+'/package.json').version)" )
  google-chrome --version; date; } > "$OUT/00-versiyalar.txt"

# 01/04 — server qayta ishga tushdi (01: navbat — haqiqiyga yaqin, buyurtma port ochilgach 0,3 s; 04/10: navbat0 — port ochilishidan oldin, qat'iy); o'chiq paytda Bobur botga yozgan (Telegram navbati) → ishga tushishi bilan buyurtma
qayta(){ local v=$1 f=$2 izoh=$3 rej=${4:-navbat}; D=$R/$v; yangi_baza; : > "$S/qayd.txt"; : > "$S/srv.log"
  srv_start jim; panel http://localhost:3100 "$f" 60; cli 30 "$f"
  usr2; sleep 3; snap "1-buyurtma-ulangan"; qayd "Bobur 1-buyurtma (server ishlayapti) — panel ko'rdi"
  qayd "server to'xtatildi (Ctrl+C)"; srv_stop; sleep 1; snap "2-server-ochiq"
  sleep 4; qayd "server qayta ishga tushirildi — server o'chiq paytda Bobur botga yozgan edi (Telegram navbati)"; srv_start "$rej"
  sleep 8; snap "3-qayta-ulangan"
  qayd "tekshiruv: bazada nechta buyurtma"; local nb; nb=$(db "select count(*)||' ta, eng yangisi #'||max(id) from orders")
  panel_end; wait "$CPID" 2>/dev/null
  { echo "# $izoh"; echo "# Panel (brauzer) va terminal klienti bir vaqtda ochiq; server to'xtatiladi, 5 s dan keyin qayta yoqiladi"
    echo; echo "## Qadamlar"; cat "$S/qayd.txt"; echo; echo "## Brauzer — panel"; cat "$S/$f-panel.txt"
    echo; echo "## Terminal — npm run live"; echo '$ npm run live'; cat "$S/cli-$f.txt"
    echo; echo "## Server logi"; srvlog; echo; echo "## Baza (psql): orders — $nb"
    echo "## Navbatdagi buyurtma hodisasi (#2) panelga keldimi: $(grep -q '"orderId":2' "$S/$f-panel.txt" && echo "HA — panel undan oldin ulangan, bu urinishda xato yuz bermadi" || echo "YO'Q — panel ulanmasdan oldin yuborilgan")"; } > "$OUT/$f.txt"
  srv_stop; }
bor 01 && qayta start 01-qayta-ishga-start "ws2-start (= ws1-done): connect faqat belgini yangilaydi"
bor 04 && qayta done 04-qayta-ishga-done "ws2-done: connect ichida yukla() — har ulanishda ro'yxat qayta so'raladi (navbat0: buyurtma port ochilishidan oldin)" navbat0

# 02 — DevTools «Offline» (brauzer tarmog'i): qisqa (6 s) va uzoq (60 s)
if bor 02; then D=$R/start; yangi_baza; : > "$S/qayd.txt"; : > "$S/srv.log"; srv_start jim
  panel http://localhost:3100 02-offline 120
  qayd "Offline yoqildi"; touch "$S/.offline"; sleep 1.5; usr2; qayd "Bobur buyurtma berdi (Offline paytida)"; sleep 4; snap "1-offline-6s"
  qayd "Offline o'chirildi"; touch "$S/.online"; sleep 4; snap "2-online"
  qayd "Offline yoqildi — 60 s"; touch "$S/.offline"; sleep 5; usr2; qayd "Bobur buyurtma berdi (Offline paytida)"; sleep 55; snap "3-offline-60s"
  qayd "Offline o'chirildi"; touch "$S/.online"; sleep 8; snap "4-online"
  panel_end
  { echo "# ws2-start: brauzer DevTools → Network → Offline (Playwright setOffline — o'sha CDP buyrug'i). Server va bot ishlab turibdi"
    echo; echo "## Qadamlar"; cat "$S/qayd.txt"; echo; echo "## Brauzer — panel"; cat "$S/02-offline-panel.txt"; echo; echo "## Server logi"; srvlog; } > "$OUT/02-offline-start.txt"
  srv_stop; fi

# 03/05 — tarmoq uzildi (proksi): panel boshqa kompyuterda — server ishlaydi, panel 8 s tarmoqsiz
tarmoq(){ local v=$1 f=$2 izoh=$3; D=$R/$v; yangi_baza; : > "$S/qayd.txt"; : > "$S/srv.log"; srv_start jim; prx_start
  panel http://localhost:3101 "$f" 60
  qayd "tarmoq uzildi (proksi)"; prx_cut; sleep 2; snap "1-tarmoq-yoq"; usr2; qayd "Bobur buyurtma berdi (panel tarmoqsiz)"; sleep 4
  qayd "tarmoq qaytdi"; prx_cut; sleep 8; snap "2-qayta-ulangan"
  panel_end; kill "$XPID"; XPID=""
  { echo "# $izoh"; echo "# Panel proksi orqali (localhost:3101 → server 3100). Proksi kesilganda ochiq ulanish uziladi, yangisi qabul qilinmaydi; server va bot ishlab turibdi"
    echo; echo "## Qadamlar"; cat "$S/qayd.txt"; echo; echo "## Brauzer — panel"; cat "$S/$f-panel.txt"; echo; echo "## Server logi"; srvlog
    echo; echo "## Baza (psql): orders — $(db "select count(*)||' ta, eng yangisi #'||max(id) from orders")"; } > "$OUT/$f.txt"
  srv_stop; }
bor 03 && tarmoq start 03-tarmoq-start "ws2-start: tarmoq uzildi"
bor 05 && tarmoq done 05-tarmoq-done "ws2-done: tarmoq uzildi"

# 06 — sodda «tuzatish»: tinglovchi connect ICHIDA — har qayta ulanishda yana bittasi
if bor 06; then D=$R/xato; yangi_baza; : > "$S/qayd.txt"; : > "$S/srv.log"; srv_start jim
  panel http://localhost:3100 06-takror 90
  usr2; qayd "1-buyurtma (birinchi ulanish)"; sleep 3; snap "1-birinchi-ulanish"
  qayd "server qayta ishga tushirildi (1)"; srv_stop; sleep 2; srv_start jim; sleep 7
  usr2; qayd "2-buyurtma (1 qayta ulanishdan keyin)"; sleep 3; snap "2-bir-qayta-ulanish"
  qayd "server qayta ishga tushirildi (2)"; srv_stop; sleep 2; srv_start jim; sleep 7
  usr2; qayd "3-buyurtma (2 qayta ulanishdan keyin)"; sleep 3; snap "3-ikki-qayta-ulanish"
  panel_end
  { echo "# xato nusxa: tinglovchi connect ichida (sodda tuzatish) — 00b-nusxalar-farqi.txt"; echo
    echo "## Qadamlar"; cat "$S/qayd.txt"; echo; echo "## Brauzer — panel"; cat "$S/06-takror-panel.txt"; echo; echo "## Server logi"; srvlog; } > "$OUT/06-takror-tinglovchi.txt"
  srv_stop; fi

# 07 — connectionStateRecovery: tarmoq uzilishida tiklaydi, server qayta ishga tushganda — yo'q
if bor 07; then D=$R/tiklash; yangi_baza; : > "$S/qayd.txt"; : > "$S/srv.log"; srv_start jim; prx_start
  ( cd "$D" && node "$M/ws2v2-recovery-klient.cjs" http://localhost:3101 panel-sir 60 ) > "$S/rk.txt" 2>&1 & RK=$!; sleep 2
  qayd "A) klient hali hech qanday hodisa olmagan — tarmoq uzildi (proksi)"; prx_cut; sleep 1; usr2; qayd "Bobur buyurtma berdi (klient tarmoqsiz)"; sleep 4; qayd "tarmoq qaytdi"; prx_cut; sleep 8
  usr2; qayd "B) Bobur buyurtma berdi — klient hodisani oladi (oxirgi tartib belgisi bor)"; sleep 3
  qayd "B) tarmoq uzildi (proksi)"; prx_cut; sleep 1; usr2; qayd "Bobur buyurtma berdi (klient tarmoqsiz)"; sleep 4; qayd "tarmoq qaytdi"; prx_cut; sleep 8
  qayd "C) server to'xtatildi"; srv_stop; sleep 3; qayd "server qayta ishga tushirildi (navbat — o'chiq paytda yozilgan buyurtma)"; srv_start navbat; sleep 10
  wait "$RK"; kill "$XPID"; XPID=""
  { echo "# tiklash nusxa: @WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 daqiqa } }) — klient socket.recovered ni ko'rsatadi"
    echo; echo "## Qadamlar"; cat "$S/qayd.txt"; echo; echo "## Klient"; cat "$S/rk.txt"; echo; echo "## Server logi"; srvlog; } > "$OUT/07-recovery.txt"
  srv_stop; fi

# 08 — ws2-done: test va smoke (server kodi o'zgarmagan — tuzatish brauzerda)
if bor 08; then D=$R/done; yangi_baza
  { echo '$ npm test'; ( cd "$D" && env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 npx jest 2>&1 | grep -E "^(PASS|FAIL|Tests:|Test Suites:)" ); echo
    echo '$ npm run smoke'; ( cd "$D" && npm run -s smoke 2>&1 | grep -vE "^\s*$|^\[Nest\]" | tail -12 ); } > "$OUT/08-test-smoke.txt"; fi
# 09 — ws2-done: noto'g'ri token va server o'chiq paytda panel ochildi (alohida yukla() yo'q — ro'yxat faqat connect'da)
if bor 09; then D=$R/done; yangi_baza; : > "$S/qayd.txt"; : > "$S/srv.log"; srv_start jim
  rm -f "$S"/.ready "$S"/.end "$S"/.snap-*; ( cd "$D" && node "$M/ws2v2-panel.mjs" http://localhost:3100 notogri "$S" 09-notogri 14 ) > "$S/p9.err" 2>&1 & PPID2=$!
  for i in $(seq 1 80); do [ -e "$S/.ready" ] && break; sleep 0.25; done; sleep 1; snap "1-notogri-token"; panel_end
  { echo "# ws2-done: token «notogri» — alohida yukla() olib tashlangan, ro'yxat faqat connect va order-changed'da"; echo
    echo "## Brauzer — panel"; cat "$S/09-notogri-panel.txt"; echo; echo "## Server logi"; srvlog; } > "$OUT/09-notogri-done.txt"
  srv_stop; fi
# 11 — ws2-done: uzoq Offline (60 s) — 02 ning ikkinchi yarmi tuzatilgan kodda
if bor 11; then D=$R/done; yangi_baza; : > "$S/qayd.txt"; : > "$S/srv.log"; srv_start jim
  panel http://localhost:3100 11-offline-done 100
  usr2; qayd "Bobur 1-buyurtma (ulangan paytda)"; sleep 3; snap "1-ulangan"
  qayd "Offline yoqildi — 60 s"; touch "$S/.offline"; sleep 5; usr2; qayd "Bobur buyurtma berdi (Offline paytida)"; sleep 55; snap "2-offline-60s"
  qayd "Offline o'chirildi"; touch "$S/.online"; sleep 8; snap "3-online"
  panel_end
  { echo "# ws2-done: brauzer DevTools → Network → Offline 60 s (02 ning ikkinchi yarmi, tuzatilgan kod)"
    echo; echo "## Qadamlar"; cat "$S/qayd.txt"; echo; echo "## Brauzer — panel"; cat "$S/11-offline-done-panel.txt"; echo; echo "## Server logi"; srvlog
    echo; echo "## Baza (psql): orders — $(db "select count(*)||' ta, eng yangisi #'||max(id) from orders")"; } > "$OUT/11-offline-done.txt"
  srv_stop; fi

# 10 — AI nusxalari (ws2v2-ai): o'sha qayta ishga tushish tajribasi haqiqiy bazada
if bor 10; then for a in ai1 ai2; do ln -sfn "${S%/ws2v2}/ws2-$a" "$R/$a"; ( cd "$R/$a" && npx nest build >/dev/null 2>&1 ) || { echo "build xato: $a"; exit 1; }
  qayta "$a" "10-qayta-ishga-$a" "AI nusxasi $a (ws2v2-ai/$a/diff.patch): server qayta ishga tushdi + navbatdagi buyurtma (navbat0)" navbat0
  mv "$OUT/10-qayta-ishga-$a.txt" "$M/ws2v2-ai/$a/01-qayta-ishga.txt"; done; fi
echo "TAYYOR: $OUT"; ls "$OUT"
