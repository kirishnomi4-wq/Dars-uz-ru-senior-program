#!/usr/bin/env bash
# PostgreSQL-2 mentor darsi — haqiqiy chiqishlar (F-1029-02, 01.11 avtopilot). Natija: manba/pg2-out/NN-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-pg2.sh
# Tizimga tegmaydi: PostgreSQL 18 vaqtinchalik klaster ($S/pg2-run, port 5436, Windows o'rnatuvchisi kabi — postgres + parol),
# Node loyiha $S/pg2-node (express + pg). Oxirida server va klaster to'xtatiladi.
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/pg2-out"
R="${S:?S=scratchpad kerak}/pg2-run"
N="$S/pg2-node"
B=/usr/lib/postgresql/18/bin
PW=mentor123
PORT=5436
export LC_MESSAGES=C LANG=C.UTF-8 PAGER=cat PSQL_PAGER=cat
mkdir -p "$OUT"; rm -rf "$R"; mkdir -p "$R"
A(){ PGPASSWORD=$PW psql -h localhost -p $PORT -U postgres "$@" 2>&1; }
Q(){ db=$1; shift; for q in "$@"; do echo "$db=# $q"; A -d "$db" -c "$q"; echo; done; }
stop_all(){ [ -f "$R/node.pid" ] && kill "$(cat "$R/node.pid")" 2>/dev/null; sleep 0.3; [ -d "$R/a" ] && $B/pg_ctl -D "$R/a" -m fast stop >/dev/null 2>&1; }
trap stop_all EXIT

echo "$PW" > "$R/pw"
$B/initdb -D "$R/a" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$B/pg_ctl -D "$R/a" -o "-p $PORT -k /tmp -c listen_addresses=localhost" -l "$R/a.log" -w start >/dev/null
{ psql --version; $B/postgres --version; echo "node $(node --version)"; date; } > "$OUT/00-versiyalar.txt"

# ---------- 01 m4-06: shop bazasi va products (o'quvchi darsidagi DDL aynan — NOT NULL yo'q) ----------
A -c 'CREATE DATABASE shop;' >/dev/null
{ Q shop "CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);" \
    "INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5);" \
    "INSERT INTO products (name, price, stock) VALUES ('Kolonka', 50000, 10);" \
    "SELECT * FROM products;" "SELECT name, price FROM products;"
} > "$OUT/01-create-insert-select.txt"
# 02 WHERE
{ Q shop "SELECT * FROM products WHERE price < 100000;" "SELECT * FROM products WHERE stock < 6;"; } > "$OUT/02-where.txt"
# 03 UPDATE va DELETE (WHERE bilan) + yo'q id
{ Q shop "UPDATE products SET price = 99000 WHERE id = 1;" "DELETE FROM products WHERE id = 3;" "SELECT * FROM products;" \
    "UPDATE products SET price = 1 WHERE id = 99;" "DELETE FROM products WHERE id = 99;"; } > "$OUT/03-update-delete.txt"
# 04 WHERE'siz — tranzaksiya ichida, oxirida ROLLBACK (xavfsiz sinash usuli). Bitta psql seansi — -f, prompt bilan ko'rinishi uchun -a
cat > "$R/04.sql" <<'SQL'
BEGIN;
UPDATE products SET price = 99000;
SELECT * FROM products;
DELETE FROM products;
SELECT * FROM products;
ROLLBACK;
SELECT * FROM products;
SQL
A -d shop -a -f "$R/04.sql" > "$OUT/04-wheresiz-rollback.txt"
# 05 sinfda tez-tez: jadval nomi (AI xatosi) · ustun nomi · matn o'rniga son · apostrof · ustun/qiymat soni · NULL nom
{ Q shop "SELECT * FROM product WHERE price < 100000;" \
    "SELECT * FROM products WHERE narx < 100000;" \
    "INSERT INTO products (name, price, stock) VALUES ('Planshet', 'arzon', 3);" \
    "INSERT INTO products (name, price, stock) VALUES ('O'yinchoq', 30000, 4);" \
    "INSERT INTO products (name, price, stock) VALUES ('Planshet', 300000);" \
    "INSERT INTO products (price, stock) VALUES (30000, 4);" \
    "SELECT * FROM products WHERE name IS NULL;"; } > "$OUT/05-xatolar.txt"
# 05b — apostrofni ikki marta yozish (tuzatish)
{ Q shop "INSERT INTO products (name, price, stock) VALUES ('O''yinchoq', 30000, 4) RETURNING *;"; } > "$OUT/05b-apostrof-tuzatish.txt"

# ---------- 10 m4-08: car_rental + cars (o'quvchi tanlaydigan to'rt ustun) ----------
A -c 'CREATE DATABASE car_rental;' >/dev/null
{ Q car_rental "CREATE TABLE cars (id SERIAL PRIMARY KEY, model TEXT, daily_price INTEGER, year INTEGER, is_rented BOOLEAN);" \
    "INSERT INTO cars (model, daily_price, year, is_rented) VALUES ('Chevrolet Cobalt', 280000, 2022, false), ('Chevrolet Malibu', 520000, 2023, false), ('Kia K5', 610000, 2023, false);" \
    "SELECT * FROM cars;"; } > "$OUT/10-cars.txt"

# ---------- Node: express + pg ----------
if [ ! -d "$N/node_modules/pg" ] || [ ! -d "$N/node_modules/express" ]; then
  mkdir -p "$N" && (cd "$N" && npm init -y >/dev/null && npm i express pg --no-audit --no-fund >/dev/null 2>&1)
fi
( cd "$N" && echo "express $(node -p 'require("express/package.json").version') · pg $(node -p 'require("pg/package.json").version')" ) >> "$OUT/00-versiyalar.txt"
# server.js — Gemini promptidagi talablarga to'liq mos BITTA NAMUNA (Gemini har safar boshqacha yozadi)
write_server(){ # $1 — PASSWORD qiymati (JS ifoda), $2 — DATABASE, $3 — INSERT ustuni (daily_price | price), $4 — json (1|0), $5 — DELETE usuli (param|concat)
cat > "$N/server.js" <<JS
// server.js — AvtoIjara backend (Express + PostgreSQL)
const express = require('express');
const { Pool } = require('pg');

// Bazaga ulanish sozlamalari
const USER = 'postgres';
const PASSWORD = $1; // o'z parolingizni yozing
const DATABASE = '$2';

const pool = new Pool({ user: USER, password: PASSWORD, database: DATABASE, host: 'localhost', port: $PORT });
const app = express();
$( [ "$4" = 1 ] && echo "app.use(express.json());" || echo "// app.use(express.json());  ← unutilgan" )

// GET — hamma mashinalar
app.get('/api/cars', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cars');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST — yangi mashina
app.post('/api/cars', async (req, res) => {
  try {
    const { model, daily_price, year } = req.body;
    const result = await pool.query('INSERT INTO cars (model, $3, year) VALUES (\$1, \$2, \$3) RETURNING *', [model, daily_price, year]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT — narxni yangilash
app.put('/api/cars/:id', async (req, res) => {
  try {
    const { daily_price } = req.body;
    const result = await pool.query('UPDATE cars SET daily_price = \$1 WHERE id = \$2 RETURNING *', [daily_price, req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Mashina topilmadi' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE — mashinani o'chirish
app.delete('/api/cars/:id', async (req, res) => {
  try {
$( [ "$5" = concat ] && echo "    const result = await pool.query('DELETE FROM cars WHERE id = ' + req.params.id);  // ← qiymat SQL matniga yopishtirilgan" || echo "    const result = await pool.query('DELETE FROM cars WHERE id = \$1', [req.params.id]);" )
    if (result.rowCount === 0) return res.status(404).json({ error: 'Mashina topilmadi' });
    res.json({ message: "O'chirildi", deleted: result.rowCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server 3000-portda ishlayapti'));
JS
}
port_bosh(){ ! ss -ltn 2>/dev/null | grep -q ":3000 "; }
# exec — $! node jarayonining o'zi bo'ladi (01.11: avval subshell PID'i olinib, server o'chmay qolgan — natijalar yaroqsiz edi)
start_server(){ port_bosh || { echo "XATO: 3000-port band — skript to'xtadi" >&2; exit 3; }; ( cd "$N" && exec node server.js > "$R/node.log" 2>&1 ) & echo $! > "$R/node.pid"; for i in $(seq 1 40); do ss -ltn 2>/dev/null | grep -q ":3000 " && break; grep -q "Error" "$R/node.log" 2>/dev/null && break; sleep 0.2; done; }
stop_server(){ [ -f "$R/node.pid" ] && kill "$(cat "$R/node.pid")" 2>/dev/null; for i in $(seq 1 40); do port_bosh && break; sleep 0.2; done; rm -f "$R/node.pid"; port_bosh || { echo "XATO: server o'chmadi" >&2; exit 4; }; }
req(){ m=$1; u=$2; d=${3:-}; echo "\$ $m $u ${d:+$d}"; if [ -n "$d" ]; then curl -s -o "$R/body" -w '%{http_code}' -X "$m" -H 'Content-Type: application/json' -d "$d" "http://localhost:3000$u" > "$R/code"; else curl -s -o "$R/body" -w '%{http_code}' -X "$m" "http://localhost:3000$u" > "$R/code"; fi; echo "→ $(cat "$R/code")"; cat "$R/body"; echo; echo; }
term(){ echo '--- server terminali'; cat "$R/node.log"; echo; }

# 11 to'g'ri server: GET, POST, PUT, DELETE, yo'q id
write_server "'$PW'" car_rental daily_price 1 param; cp "$N/server.js" "$OUT/11-server.js"
start_server
{ echo '$ node server.js'; head -1 "$R/node.log"; echo
  req GET /api/cars
  req POST /api/cars '{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }'
  req PUT /api/cars/2 '{ "daily_price": 480000 }'
  req DELETE /api/cars/1
  req PUT /api/cars/99 '{ "daily_price": 1 }'
  req DELETE /api/cars/99
  req GET /api/cars
  echo '--- psql'; Q car_rental "SELECT * FROM cars;"; } > "$OUT/11-crud-sorovlar.txt"
stop_server

# 12 column "price" does not exist (m4-08 AI xatosi) → 500; terminal
write_server "'$PW'" car_rental price 1 param; start_server
{ req POST /api/cars '{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }'; term; } > "$OUT/12-price-xato.txt"
stop_server
# 13 express.json() unutilgan → req.body undefined
write_server "'$PW'" car_rental daily_price 0 param; start_server
{ req POST /api/cars '{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }'; term; } > "$OUT/13-express-json-yoq.txt"
stop_server
# 14 parol noto'g'ri · parol bo'sh (process.env o'qilmagan) · baza yo'q — server ishga tushadi, xato birinchi so'rovda
write_server "'notogri'" car_rental daily_price 1 param; start_server
{ echo '=== parol noto'"'"'g'"'"'ri'; echo '$ node server.js'; head -1 "$R/node.log"; req GET /api/cars; term; } > "$OUT/14-ulanish-xatolari.txt"
stop_server
write_server "process.env.DB_PASSWORD" car_rental daily_price 1 param; start_server
{ echo '=== parol undefined (process.env.DB_PASSWORD yo'"'"'q)'; req GET /api/cars; term; } >> "$OUT/14-ulanish-xatolari.txt"
stop_server
write_server "'$PW'" carrental daily_price 1 param; start_server
{ echo '=== baza nomi xato (carrental)'; req GET /api/cars; term; } >> "$OUT/14-ulanish-xatolari.txt"
stop_server
# 15 PostgreSQL o'chiq — server ishga tushadi, so'rovda ECONNREFUSED
write_server "'$PW'" car_rental daily_price 1 param
$B/pg_ctl -D "$R/a" -m fast stop >/dev/null; start_server
{ echo '=== PostgreSQL to'"'"'xtatilgan'; echo '$ node server.js'; head -1 "$R/node.log"; req GET /api/cars; term; } > "$OUT/15-postgres-ochiq-emas.txt"
stop_server
# 15b xuddi shu holat, lekin terminalga butun xato obyekti: console.error(err) — ECONNREFUSED ko'rinadimi
sed -i 's/console.error(err.message);/console.error(err);/' "$N/server.js"; start_server
{ echo; echo '=== console.error(err.message) o'"'"'rniga console.error(err)'; req GET /api/cars; echo '--- server terminali (birinchi 12 satr)'; head -12 "$R/node.log"; } >> "$OUT/15-postgres-ochiq-emas.txt"
stop_server
$B/pg_ctl -D "$R/a" -o "-p $PORT -k /tmp -c listen_addresses=localhost" -l "$R/a.log" -w start >/dev/null
# 16 port band: birinchi server ishlab turibdi, ikkinchisi xuddi shu faylda (Express 5: app.listen xatoni callback'ga beradi)
write_server "'$PW'" car_rental daily_price 1 param; start_server
{ echo '$ node server.js   (ikkinchi oynada, birinchisi ishlab turibdi)'; (cd "$N" && timeout 4 node server.js 2>&1; echo "[chiqish kodi: $?]"); } > "$OUT/16-port-band.txt"
stop_server
# 17 SQL injection: yopishtirilgan DELETE — '1 OR 1=1' (avval nusxa, oxirida tiklanadi) va $1 bilan
A -d car_rental -c "CREATE TABLE cars_zaxira AS SELECT * FROM cars;" >/dev/null
write_server "'$PW'" car_rental daily_price 1 concat; start_server
{ echo '=== yopishtirilgan: DELETE FROM cars WHERE id = '"'"' + req.params.id'
  echo '--- oldin'; A -d car_rental -c 'SELECT id, model FROM cars;'
  req DELETE '/api/cars/1%20OR%201=1'
  echo '--- keyin'; A -d car_rental -c 'SELECT id, model FROM cars;'; } > "$OUT/17-injection.txt"
stop_server
A -d car_rental -c "INSERT INTO cars SELECT * FROM cars_zaxira; DROP TABLE cars_zaxira;" >/dev/null
write_server "'$PW'" car_rental daily_price 1 param; start_server
{ echo; echo '=== $1 bilan: DELETE FROM cars WHERE id = $1'; req DELETE '/api/cars/1%20OR%201=1'; term
  echo '--- jadval joyida'; A -d car_rental -c 'SELECT id, model FROM cars;'; } >> "$OUT/17-injection.txt"
stop_server

# ---------- 18 (01.11) MD «KOD 5» — ⚠ belgili da'volar ----------
A -c "CREATE ROLE sotuvchi LOGIN PASSWORD 'sot123';" >/dev/null; A -d shop -c "GRANT SELECT ON products TO sotuvchi;" >/dev/null
{ echo '--- 5-ekran: huquqi yo'"'"'q foydalanuvchi (faqat SELECT berilgan)'
  echo 'shop=> UPDATE products SET price = 1 WHERE id = 1;'; PGPASSWORD=sot123 psql -h localhost -p $PORT -U sotuvchi -d shop -c 'UPDATE products SET price = 1 WHERE id = 1;' 2>&1; echo
  echo '--- 9-ekran: BEGIN siz ROLLBACK'; Q shop "ROLLBACK;"
  echo '--- 12-ekran: qo'"'"'shtirnoqli matn'; Q shop "INSERT INTO products (name, price, stock) VALUES (\"O'yinchoq\", 30000, 4);"
  echo '--- 25-ekran: kichik harf va katta harfli jadval nomi'; Q shop "select name, price from PRODUCTS where price < 60000;"
} > "$OUT/18-qoshimcha.txt"
# 19 tuzatilgan kod (daily_price) bilan POST — 17-ekran natijasi
write_server "'$PW'" car_rental daily_price 1 param; start_server
{ echo '=== price → daily_price tuzatildi, server qayta ishga tushdi'; req POST /api/cars '{ "model": "Hyundai Elantra", "daily_price": 450000, "year": 2022 }'; } > "$OUT/19-price-tuzatildi.txt"
# 20 port band — xatoni o'qiydigan listen callback bilan (22-ekran)
sed -i "s/app.listen(3000, () => console.log('Server 3000-portda ishlayapti'));/app.listen(3000, (err) => { if (err) { console.error(err.message); process.exit(1); } console.log('Server 3000-portda ishlayapti'); });/" "$N/server.js"
{ echo "=== callback xatoni o'qiydi: app.listen(3000, (err) => { if (err) … })"; echo '$ node server.js   (ikkinchi oynada, birinchisi ishlab turibdi)'; (cd "$N" && timeout 4 node server.js 2>&1; echo "[chiqish kodi: $?]"); } > "$OUT/20-port-band-callback.txt"
stop_server

echo "[$(date +%T)] tayyor: $(ls "$OUT" | wc -l) fayl → $OUT"
stop_all; trap - EXIT; rm -rf "$R"
