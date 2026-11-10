#!/usr/bin/env bash
# Buyurtma boti (OrderBotNest) — haqiqiy yurgizish: vaqtinchalik PostgreSQL 18 klasteri + Nest + Telegraf (Telegram serverisiz).
# Ishlatish: S=<scratchpad> bash drive-orderbot.sh [senariy]   (senariy: baza | xotira)
# Chiqishlar: manba/orderbot-out/
set -u
P=${P:-/home/kali/Desktop/order-bot}
M=$(cd "$(dirname "$0")" && pwd)
OUT=$M/orderbot-out; mkdir -p "$OUT"
S=${S:-/tmp/orderbot-pg}; mkdir -p "$S"
SOCK=/tmp/obpg-sock; mkdir -p "$SOCK"  # socket yo'li qisqa bo'lishi shart (107 bayt)
B=/usr/lib/postgresql/18/bin
PORT=5436
SCEN=${1:-baza}
export LC_MESSAGES=C LANG=C.UTF-8 PAGER=cat PSQL_PAGER=cat
export DATABASE_URL="postgresql://postgres@localhost:$PORT/shop"
export BOT_TOKEN=123:SOXTA ADMIN_TELEGRAM_IDS=111 DB_LOGGING=${DB_LOGGING:-false}
PSQL="$B/psql -h localhost -p $PORT -U postgres"

stop() { [ -d "$S/data" ] && $B/pg_ctl -D "$S/data" -m fast stop >/dev/null 2>&1; }
trap stop EXIT
stop
rm -rf "$S/data"
$B/initdb -D "$S/data" -U postgres --auth=trust --encoding=UTF8 --locale=C.UTF-8 >"$S/initdb.log" 2>&1 || { echo "initdb xato"; cat "$S/initdb.log"; exit 1; }
$B/pg_ctl -D "$S/data" -o "-p $PORT -c listen_addresses=localhost -c unix_socket_directories=$SOCK" -l "$S/pg.log" -w start >/dev/null || { echo "pg start xato"; cat "$S/pg.log"; exit 1; }
$PSQL -d postgres -c "CREATE DATABASE shop TEMPLATE template0;" >/dev/null

cd "$P"
echo "== build =="; npx nest build >/dev/null 2>&1 || { echo "build xato"; exit 1; }
echo "== seed =="; npm run -s seed 2>&1 | tee "$OUT/02-seed.txt"
echo "== psql: jadvallar =="; $PSQL -d shop -c '\dt' -c 'SELECT * FROM products ORDER BY id;' -c 'SELECT * FROM migrations;' | tee "$OUT/03-jadvallar.txt"
echo "== senariy: $SCEN =="; node "$M/orderbot-harness.cjs" "$P" "$SCEN" 2>&1 | tee "$OUT/04-baza-senariy.txt"
echo "== psql: natija =="; $PSQL -d shop \
  -c 'SELECT id, telegram_id, name, phone, role, state FROM users ORDER BY id;' \
  -c 'SELECT * FROM products ORDER BY id;' \
  -c 'SELECT id, user_id, phone, total, status FROM orders ORDER BY id;' \
  -c 'SELECT * FROM order_items ORDER BY id;' \
  -c 'SELECT * FROM cart_items ORDER BY id;' \
  -c "SELECT telegram_id, pg_typeof(telegram_id), telegram_id > 2147483647 AS int4_sigmaydi FROM users;" | tee "$OUT/05-psql-natija.txt"
echo "== SQL log (DB_LOGGING=true), qisqa oqim =="; DB_LOGGING=true node "$M/orderbot-harness.cjs" "$P" sqllog 2>&1 | tee "$OUT/07-sql-log.txt"
echo "== CHECK: 20 ta Planshet to'g'ridan-to'g'ri SQL bilan =="; $PSQL -d shop -c "UPDATE products SET stock = stock - 20 WHERE name = 'Planshet';" 2>&1 | tee "$OUT/06-check-xato.txt"
