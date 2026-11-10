#!/usr/bin/env bash
# Webhook v2 mentor darsi — haqiqiy chiqishlar OrderBotNest to'lov webhook'i ustida (F-1104-24, 04.11).
# ISHLATISH (repo ildizidan): S=<scratchpad> [P=<OrderBotNest — wh-done ishchi nusxasi>] bash feedback/F-1029-02-mentor-kurs/manba/drive-whv2.sh [qadam…]
# Nusxalar ($S/whv2/nusxa/): start — ws2-done 71c72a4 (= wh-start) · done — P ishchi daraxti (wh-done) ·
#   norawbody — main.ts da rawBody yo'q · tartib — yozuv imzodan OLDIN · json — imzo JSON.stringify(body) dan (xom tana emas).
# Server — whv2-server.cjs: loyihaning o'z dist/main.js (rawBody shu yerda), Telegram o'rniga handleUpdate, SIGUSR2 = buyurtma.
# To'lov xizmati — loyihaning o'z `npm run pay` (HMAC bilan imzolaydi) va curl. Panel — headless Chrome (ws2v2-panel.mjs).
# PostgreSQL 18 vaqtinchalik (5439). Natija: manba/whv2-out/NN-*.txt (+ png)
set -u
P=${P:-/home/kali/Desktop/order-bot}
M=$(cd "$(dirname "$0")" && pwd); OUT=$M/whv2-out; mkdir -p "$OUT"
S="${S:?S=scratchpad kerak}/whv2"; mkdir -p "$S"
SOCK=/tmp/whv2-sock; mkdir -p "$SOCK"; B=/usr/lib/postgresql/18/bin; PGP=5439
export LC_MESSAGES=C LANG=C.UTF-8 NO_COLOR=1 FORCE_COLOR=0 TERM=dumb
export DATABASE_URL="postgresql://postgres@localhost:$PGP/shop" BOT_TOKEN=123:SOXTA ADMIN_TELEGRAM_IDS=111 DB_LOGGING=false
export ADMIN_PANEL_TOKEN=panel-sir PAYMENT_WEBHOOK_SECRET=tolov-kalit-sinov PORT=3100 PAY_URL=http://localhost:3100
URL=http://localhost:3100
QADAM=" ${*:-01 02 03 04 05 06 07 08 09 10 11 12} "
bor(){ [[ "$QADAM" == *" $1 "* ]]; }
pgstop(){ [ -d "$S/data" ] && $B/pg_ctl -D "$S/data" -m fast stop >/dev/null 2>&1; }
SPID=""; PPID2=""
srv_start(){ local n0; n0=$(grep -c ishlayapti "$S/srv.log" 2>/dev/null); n0=${n0:-0}
  ( cd "$D" && exec node "$M/whv2-server.cjs" ) >> "$S/srv.log" 2>&1 & SPID=$!
  for i in $(seq 1 100); do [ "$(grep -c ishlayapti "$S/srv.log")" -gt "$n0" ] && return 0; kill -0 "$SPID" 2>/dev/null || break; sleep 0.2; done
  echo "SERVER KO'TARILMADI ($D):"; tail -20 "$S/srv.log"; exit 1; }
srv_stop(){ [ -n "$SPID" ] && kill "$SPID" 2>/dev/null; [ -n "$SPID" ] && wait "$SPID" 2>/dev/null; SPID=""; }
order(){ local n; n=$(grep -c "bazada" "$S/srv.log"); kill -USR2 "$SPID"; for i in $(seq 1 50); do [ "$(grep -c bazada "$S/srv.log")" -gt "$n" ] && break; sleep 0.1; done; grep "bazada" "$S/srv.log" | tail -1 | sed -E 's/.*#([0-9]+).*/\1/'; }
srvlog(){ grep -vE "^\s*$" "$S/srv.log" | sed -E 's/^\[Nest\] [0-9]+  - [0-9/,: APM]+ +//; s/ +\+[0-9]+ms$//' | grep -E "main.ts|Payment|payments|ishlayapti|bazada|XATO|Mapped \{/payments|bot → 5987654321: Buyurtma"; }
pay(){ ( cd "$D" && echo "\$ npm run pay -- $*" && npm run -s pay -- "$@" ) 2>&1; }
db(){ $B/psql -h localhost -p $PGP -U postgres -d shop -Atc "$1"; }
dbt(){ echo "\$ psql: $1"; $B/psql -h localhost -p $PGP -U postgres -d shop -c "$1" | sed '/^$/d'; }
panel(){ rm -f "$S"/.ready "$S"/.end "$S"/.snap-* "$S"/.offline "$S"/.online
  ( cd "$D" && node "$M/ws2v2-panel.mjs" "$URL" panel-sir "$S" "$1" "$2" ) > "$S/panel-$1.err" 2>&1 & PPID2=$!
  for i in $(seq 1 80); do [ -e "$S/.ready" ] && return 0; sleep 0.25; done; echo "PANEL OCHILMADI"; cat "$S/panel-$1.err"; exit 1; }
snap(){ touch "$S/.snap-$(date +%s%N)-$1"; sleep 0.7; }
panel_end(){ touch "$S/.end"; wait "$PPID2" 2>/dev/null; PPID2=""; }
cleanup(){ [ -n "$PPID2" ] && kill "$PPID2" 2>/dev/null; srv_stop; pgstop; }
trap cleanup EXIT

# --- nusxalar ---
R=$S/nusxa; rm -rf "$R"; mkdir -p "$R"
git clone -q "$P" "$R/start" && git -C "$R/start" checkout -q 71c72a4 || { echo "start klon xato"; exit 1; }
mkdir -p "$R/done"; tar -C "$P" --exclude=./node_modules --exclude=./dist --exclude=./.git --exclude=./.env -cf - . | tar -C "$R/done" -xf -
for v in norawbody tartib json; do cp -r "$R/done" "$R/$v"; done
for v in start done norawbody tartib json; do ln -s "$P/node_modules" "$R/$v/node_modules"; done
python3 - "$R" <<'PYEOF'
import sys
from pathlib import Path
R = Path(sys.argv[1])
m = R / 'norawbody/src/main.ts'; s = m.read_text()
a = "  const app = await NestFactory.create(AppModule, { rawBody: true });"
assert a in s; m.write_text(s.replace(a, "  const app = await NestFactory.create(AppModule);"))
c = R / 'tartib/src/api/payment/payment.controller.ts'; s = c.read_text()
a = """    if (
      !isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)
    ) {
      this.log.warn("imzo noto'g'ri — xabar rad etildi");
      throw new UnauthorizedException("imzo noto'g'ri");
    }
    const p = parsePayment(body);
    const r = await this.payments.record(p);
"""
b = """    const p = parsePayment(body);
    const r = await this.payments.record(p);
    if (
      !isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)
    ) {
      this.log.warn("imzo noto'g'ri — xabar rad etildi");
      throw new UnauthorizedException("imzo noto'g'ri");
    }
"""
assert a in s; c.write_text(s.replace(a, b))
j = R / 'json/src/api/payment/payment.controller.ts'; s = j.read_text()
a = "      !isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)"
assert a in s; j.write_text(s.replace(a, "      !isValidSignature(\n        Buffer.from(JSON.stringify(body)),\n        signature,\n        config.PAYMENT_WEBHOOK_SECRET,\n      )"))
PYEOF
for v in start done norawbody tartib json; do ( cd "$R/$v" && npx nest build >/dev/null 2>&1 ) || { echo "build xato: $v"; exit 1; }; done
{ echo "# nusxalar farqi (done → buzilgan)"; echo "## main.ts: done → norawbody"; diff -u "$R/done/src/main.ts" "$R/norawbody/src/main.ts" | tail -n +3
  for v in tartib json; do echo "## payment.controller.ts: done → $v"; diff -u "$R/done/src/api/payment/payment.controller.ts" "$R/$v/src/api/payment/payment.controller.ts" | tail -n +3; done; } > "$OUT/00b-nusxalar-farqi.txt"

# --- baza ---
pgstop; rm -rf "$S/data"; : > "$S/srv.log"
$B/initdb -D "$S/data" -U postgres --auth=trust --encoding=UTF8 --locale=C.UTF-8 >"$S/initdb.log" 2>&1 || { echo "initdb xato"; exit 1; }
$B/pg_ctl -D "$S/data" -o "-p $PGP -c listen_addresses=localhost -c unix_socket_directories=$SOCK" -l "$S/pg.log" -w start >/dev/null || { echo "pg xato"; exit 1; }
yangi_baza(){ srv_stop; $B/psql -h localhost -p $PGP -U postgres -d postgres -qc "DROP DATABASE IF EXISTS shop;" -c "CREATE DATABASE shop TEMPLATE template0;"
  D=$R/done srv_start; srv_stop; ( cd "$R/done" && npm run -s seed > "$S/seed.log" 2>&1 ); : > "$S/srv.log"; }
{ node --version; npm --version; git -C "$P" log -1 --format='P HEAD %h %s' | cut -c1-90; git -C "$P" status --short
  ( cd "$P" && node -e "for (const k of ['@nestjs/core','@nestjs/platform-express','typeorm','pg']) console.log(k, require(k+'/package.json').version)" ); google-chrome --version; date; } > "$OUT/00-versiyalar.txt"
yoz(){ cat > "$OUT/$1.txt"; }

# 01 — wh-start: webhook yo'q (404) — buyurtma to'langanini server bilmaydi
if bor 01; then yangi_baza; D=$R/start; srv_start; N=$(order)
  { echo "# wh-start (= ws2-done): to'lov xizmati xabar yubordi — server bunday manzilni bilmaydi"
    echo "\$ curl -s -X POST $URL/payments/webhook -H 'Content-Type: application/json' -d '{\"paymentId\":\"pay_1\",\"orderId\":$N,\"status\":\"paid\",\"amount\":120000}'"
    curl -s -X POST "$URL/payments/webhook" -H 'Content-Type: application/json' -d "{\"paymentId\":\"pay_1\",\"orderId\":$N,\"status\":\"paid\",\"amount\":120000}"; echo
    echo; dbt "SELECT id, status, total FROM orders"; } | yoz 01-start-404
  srv_stop; fi

# 02 — wh-done: server ishga tushdi — yo'l va rawBody (main.ts)
if bor 02; then yangi_baza; D=$R/done; srv_start; sleep 0.5
  { echo "# wh-done: npm run start — main.ts rawBody bilan, yangi yo'l POST /payments/webhook"; grep -vE "^\s*$" "$S/srv.log" | sed -E 's/^\[Nest\] [0-9]+  - [0-9/,: APM]+ +//; s/ +\+[0-9]+ms$//' | grep -E "main.ts|PaymentController|payments/webhook|Payment\]|ishlayapti"
    echo; dbt "\\d payments" | head -14; } | yoz 02-done-start
  srv_stop; fi

# 03–06 + 12 — wh-done: to'lov, takror, imzosiz/soxta, rad — panel brauzerda ochiq
if bor 03; then yangi_baza; D=$R/done; srv_start; panel 03-panel 80
  N1=$(order); sleep 2.5; snap "1-buyurtma"
  { echo "# wh-done: Bobur buyurtma berdi (#$N1) — to'lov xizmati xabar yuboradi"; pay "$N1"; sleep 2; echo; echo "## Server logi"; srvlog | grep -E "Payment"; echo
    dbt "SELECT payment_id, order_id, status, amount FROM payments"; dbt "SELECT id, total, payment_status FROM orders"; } | yoz 03-tolov-ok
  snap "2-tolandi"
  { echo "# wh-done: xizmat javobni olmadi deb bitta xabarni qayta yubordi"; pay "$N1" ikki; sleep 1; echo; echo "## Server logi"; srvlog | grep -E "Payment" | tail -2; echo
    dbt "SELECT payment_id, order_id, status FROM payments"; } | yoz 04-takror
  { echo "# wh-done: imzosiz va boshqa kalit bilan (kalitni bilmagan odam) — xabar rad etiladi"; pay "$N1" imzosiz; echo; pay "$N1" soxta; sleep 0.5; echo; echo "## Server logi"; srvlog | grep -E "Payment" | tail -2; echo
    dbt "SELECT count(*) AS payments_qatorlari FROM payments"; } | yoz 05-imzosiz-soxta
  N2=$(order); sleep 2.5
  { echo "# wh-done: ikkinchi buyurtma (#$N2) — to'lov RAD etildi (karta rad etdi): xabar keladi va yoziladi"; pay "$N2" rad; sleep 2; echo; echo "## Server logi"; srvlog | grep -E "Payment" | tail -1; echo
    dbt "SELECT payment_id, order_id, status FROM payments"; dbt "SELECT id, payment_status FROM orders ORDER BY id"; } | yoz 06-rad
  snap "3-rad"; panel_end
  { echo "# wh-done: brauzerdagi panel — buyurtma, to'landi, rad (sahifa yangilanmadi)"; cat "$S/03-panel-panel.txt"; } | yoz 12-panel
  srv_stop; fi

# 07 — xom tana: chiroyli JSON (bo'sh joy bilan) — done qabul qiladi, json nusxa rad etadi
if bor 07; then for v in done json; do yangi_baza; D=$R/$v; srv_start; N=$(order)
  BODY="{ \"paymentId\": \"pay_bosh_joy\", \"orderId\": $N, \"status\": \"paid\", \"amount\": 120000 }"
  SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$PAYMENT_WEBHOOK_SECRET" | sed 's/^.*= //')
  { echo "# nusxa: $v — xizmat JSON'ni bo'sh joy bilan yubordi, imzo shu baytlardan (to'g'ri)"
    echo "\$ curl -s -X POST $URL/payments/webhook -H 'X-Signature: ${SIG:0:16}…' -d '$BODY'"
    curl -s -w '\n← %{http_code}\n' -X POST "$URL/payments/webhook" -H 'Content-Type: application/json' -H "X-Signature: $SIG" -d "$BODY"
    sleep 0.5; echo; echo "## Server logi"; srvlog | grep -E "Payment"; echo; dbt "SELECT payment_id, status FROM payments"; } | yoz "07-xom-tana-$v"
  srv_stop; done; fi

# 08 — rawBody yo'q (main.ts): to'g'ri imzoli haqiqiy to'lov ham 401
if bor 08; then yangi_baza; D=$R/norawbody; srv_start; N=$(order)
  { echo "# nusxa: norawbody — main.ts da { rawBody: true } yo'q"; srvlog | grep -E "main.ts"; echo; pay "$N"; sleep 0.5; echo; echo "## Server logi"; srvlog | grep -E "Payment"; echo
    dbt "SELECT count(*) AS payments_qatorlari FROM payments"; } | yoz 08-rawbody-yoq
  srv_stop; fi

# 09 — tartib buzilgan: yozuv imzodan OLDIN — imzosiz xabar 401 oladi, lekin buyurtma «to'landi» bo'lib qoldi
if bor 09; then yangi_baza; D=$R/tartib; srv_start; panel 09-panel 30; N=$(order); sleep 2.5
  { echo "# nusxa: tartib — parsePayment va record imzo tekshiruvidan OLDIN"; pay "$N" imzosiz; sleep 2; echo; echo "## Server logi"; srvlog | grep -E "Payment"; echo
    dbt "SELECT payment_id, order_id, status FROM payments"; dbt "SELECT id, payment_status FROM orders"; } | yoz 09-tartib
  snap "1-imzosiz-keyin"; panel_end; { cat "$S/09-panel-panel.txt"; } | yoz 09b-tartib-panel
  srv_stop; fi

# 10 — kalit bo'sh: server ogohlantiradi, har xabar 401
if bor 10; then yangi_baza; D=$R/done; PAYMENT_WEBHOOK_SECRET= srv_start; N=$(order)
  { echo "# wh-done, .env da PAYMENT_WEBHOOK_SECRET bo'sh"; grep -vE "^\s*$" "$S/srv.log" | sed -E 's/^\[Nest\] [0-9]+  - [0-9/,: APM]+ +//; s/ +\+[0-9]+ms$//' | grep -E "PAYMENT_WEBHOOK_SECRET"; echo
    ( cd "$D" && echo "\$ npm run pay -- $N" && PAYMENT_WEBHOOK_SECRET= npm run -s pay -- "$N" ) 2>&1; echo; dbt "SELECT count(*) AS payments_qatorlari FROM payments"; } | yoz 10-kalit-bosh
  srv_stop; fi

# 11 — summa mos emas va noto'g'ri maydon (imzo to'g'ri)
if bor 11; then yangi_baza; D=$R/done; srv_start; N=$(order)
  { for BODY in "{\"paymentId\":\"pay_kam\",\"orderId\":$N,\"status\":\"paid\",\"amount\":1200}" "{\"paymentId\":\"pay_st\",\"orderId\":$N,\"status\":\"ok\",\"amount\":120000}"; do
      SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$PAYMENT_WEBHOOK_SECRET" | sed 's/^.*= //')
      echo "\$ curl -s -X POST $URL/payments/webhook -H 'X-Signature: ${SIG:0:16}…' -d '$BODY'"
      curl -s -w '\n← %{http_code}\n' -X POST "$URL/payments/webhook" -H 'Content-Type: application/json' -H "X-Signature: $SIG" -d "$BODY"; echo; done
    dbt "SELECT count(*) AS payments_qatorlari FROM payments"; } | yoz 11-summa-maydon
  srv_stop; fi

# 12 — test va smoke (wh-done)
if bor 12; then
  { echo '$ npm test'; ( cd "$R/done" && env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 npx jest 2>&1 | grep -E "^(PASS|FAIL|Tests:)" ); echo
    echo '$ npm run smoke -- payment'; ( cd "$R/done" && npm run -s smoke -- payment 2>&1 | grep -vE "^\s*$|^\[Nest\]|^== build|^Telegram bot" | tail -9 ); } | yoz 13-test-smoke; fi
# 14 — tartib buzilgan nusxada testlar: controller testi buzilishni ushlaydimi (3-amaliyot)
if bor 14; then
  { echo "# nusxa: tartib (yozuv imzodan OLDIN) — npm test"; echo '$ npm test -- payment.controller'
    ( cd "$R/tartib" && env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 npx jest payment.controller 2>&1 | grep -E "^(PASS|FAIL|Tests:)|✓|✕|●.*›" | sed -E 's/ \([0-9]+ ms\)$//' | awk '!seen[$0]++' ); } | yoz 14-tartib-test; fi

# 15 — bir vaqtda ikki bir xil xabar (xizmat timeout'dan keyin qayta yubordi, birinchisi hali tugamagan)
if bor 15; then yangi_baza; D=$R/done; srv_start; N=$(order)
  BODY="{\"paymentId\":\"pay_birdan\",\"orderId\":$N,\"status\":\"paid\",\"amount\":120000}"
  SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$PAYMENT_WEBHOOK_SECRET" | sed 's/^.*= //')
  for i in 1 2; do ( curl -s -w " ← %{http_code}\n" -X POST "$URL/payments/webhook" -H 'Content-Type: application/json' -H "X-Signature: $SIG" -d "$BODY" > "$S/c15-$i.txt" ) & done; wait $(jobs -p | grep -v "^$SPID$") 2>/dev/null; sleep 0.5
  { echo "# wh-done: bir xil xabar bir vaqtda ikki marta (ikki curl parallel)"; echo "\$ curl … & curl … &   # body: $BODY"; cat "$S/c15-1.txt" "$S/c15-2.txt"
    echo; echo "## Server logi"; srvlog | grep -E "Payment\]"; echo; dbt "SELECT payment_id, order_id, status FROM payments"; } | yoz 15-bir-vaqtda
  srv_stop; fi
echo "TAYYOR: $OUT"; ls "$OUT"
