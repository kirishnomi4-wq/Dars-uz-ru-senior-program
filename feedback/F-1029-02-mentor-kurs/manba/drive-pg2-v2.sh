#!/usr/bin/env bash
# PostgreSQL-2 MD v2 (M41 «avval mentor o'rganadi», 03.11) — qo'shimcha haqiqiy chiqishlar: qator tartibi (UPDATE'dan keyin), ORDER BY,
# RETURNING, orders jadvali + CHECK + DEFAULT + UNIQUE, tranzaksiya ichidagi xato (aborted), \d, Pool bitta ulanishni qayta ishlatishi.
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-pg2-v2.sh   → manba/pg2-out/v2-*.txt
# Tizimga tegmaydi: PG18 vaqtinchalik klaster ($S/pg2v2-run, port 5437), Node loyiha $S/pg2v2-node (pg). Oxirida klaster to'xtatiladi.
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/pg2-out"
R="${S:?S=scratchpad kerak}/pg2v2-run"; N="$S/pg2v2-node"
B=/usr/lib/postgresql/18/bin; PW=mentor123; PORT=5437
export LC_MESSAGES=C LANG=C.UTF-8 PAGER=cat PSQL_PAGER=cat
rm -rf "$R"; mkdir -p "$R" "$N"
A(){ PGPASSWORD=$PW psql -h localhost -p $PORT -U postgres "$@" 2>&1; }
stop_all(){ [ -d "$R/a" ] && $B/pg_ctl -D "$R/a" -m fast stop >/dev/null 2>&1; }
trap stop_all EXIT
echo "$PW" > "$R/pw"
$B/initdb -D "$R/a" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$B/pg_ctl -D "$R/a" -o "-p $PORT -k /tmp -c listen_addresses=localhost" -l "$R/a.log" -w start >/dev/null
{ psql --version; $B/postgres --version; echo "node $(node --version)"; date; } > "$OUT/v2-00-versiyalar.txt"
A -c "CREATE DATABASE shop;" >/dev/null

A -d shop -e <<'SQL' > "$OUT/v2-01-crud-tartib-returning.txt"
CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);
INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5), ('Kolonka', 50000, 10);
SELECT * FROM products;
UPDATE products SET price = 99000 WHERE id = 1;
SELECT * FROM products;
SELECT * FROM products ORDER BY id;
SELECT ctid, id, name, price FROM products;
UPDATE products SET price = 90000 WHERE id = 1 RETURNING id, name, price;
UPDATE products SET price = 1 WHERE id = 99;
UPDATE products SET price = 1 WHERE id = 99 RETURNING *;
DELETE FROM products WHERE id = 99;
SELECT * FROM products WHERE id = 99;
SQL

A -d shop -e <<'SQL' > "$OUT/v2-02-tranzaksiya-orders-check.txt"
ALTER TABLE products ADD CONSTRAINT stock_nonneg CHECK (stock >= 0);
CREATE TABLE orders (id SERIAL PRIMARY KEY, product_id INTEGER NOT NULL REFERENCES products(id), qty INTEGER NOT NULL CHECK (qty > 0), created_at TIMESTAMP DEFAULT now());
\d products
\d orders
BEGIN;
UPDATE products SET stock = stock - 1 WHERE id = 2 RETURNING name, stock;
INSERT INTO orders (product_id, qty) VALUES (2, 1) RETURNING *;
COMMIT;
SELECT id, name, stock FROM products ORDER BY id;
SELECT * FROM orders;
BEGIN;
INSERT INTO orders (product_id, qty) VALUES (3, 7) RETURNING id, product_id, qty;
UPDATE products SET stock = stock - 7 WHERE id = 3;
SELECT * FROM orders;
ROLLBACK;
SELECT * FROM orders;
SELECT id, name, stock FROM products ORDER BY id;
UPDATE products SET stock = stock - 7 WHERE id = 3;
SQL

A -d shop -e <<'SQL' > "$OUT/v2-03-default-notnull-unique.txt"
INSERT INTO products (price, stock) VALUES (30000, 4);
SELECT * FROM products WHERE name IS NULL;
ALTER TABLE products ALTER COLUMN name SET NOT NULL;
DELETE FROM products WHERE name IS NULL;
ALTER TABLE products ALTER COLUMN name SET NOT NULL;
INSERT INTO products (price, stock) VALUES (30000, 4);
ALTER TABLE products ALTER COLUMN stock SET DEFAULT 0;
INSERT INTO products (name, price) VALUES ('Planshet', 300000) RETURNING *;
ALTER TABLE products ADD CONSTRAINT products_name_unique UNIQUE (name);
INSERT INTO products (name, price, stock) VALUES ('Kolonka', 1, 1);
\d products
SELECT * FROM products ORDER BY id;
SQL

# Pool: bitta ulanish qayta ishlatiladi; xato parol — faqat birinchi so'rovda
cd "$N" && [ -f package.json ] || npm init -y >/dev/null 2>&1
[ -d node_modules/pg ] || npm i pg@8.23.1 >/dev/null 2>&1
cat > pool-pid.js <<'JS'
const { Pool } = require('pg');
const cfg = { user: 'postgres', password: 'mentor123', host: 'localhost', port: 5437, database: 'shop' };
const pool = new Pool(cfg);
(async () => {
  console.log('Pool yaratildi · ulanishlar:', pool.totalCount);
  for (let i = 1; i <= 3; i++) {
    const r = await pool.query("SELECT pg_backend_pid() AS pid, (SELECT count(*) FROM pg_stat_activity WHERE datname = 'shop') AS faol");
    console.log(`so'rov ${i}: baza jarayoni pid ${r.rows[0].pid} · bazadagi faol ulanishlar ${r.rows[0].faol} · Pool ulanishlari ${pool.totalCount}`);
  }
  const r2 = await pool.query('SELECT name, price FROM products WHERE price < $1 ORDER BY id', [100000]);
  console.log('rowCount:', r2.rowCount, '· rows:', JSON.stringify(r2.rows));
  const r3 = await pool.query('UPDATE products SET price = $1 WHERE id = $2', [1, 99]);
  console.log('UPDATE id=99 → rowCount:', r3.rowCount, '· rows:', JSON.stringify(r3.rows));
  const bad = new Pool({ ...cfg, password: 'xato' });
  console.log("xato parol bilan Pool yaratildi — xato yo'q (hali ulanmadi)");
  try { await bad.query('SELECT 1'); } catch (e) { console.log("birinchi so'rovda:", e.message); }
  await pool.end(); await bad.end();
})();
JS
{ echo '$ node pool-pid.js'; node pool-pid.js; } > "$OUT/v2-04-pool-pid.txt" 2>&1
# Ikki seans: BEGIN ichidagi o'zgarish boshqa seansga COMMIT'gacha ko'rinmaydi; aborted holat; aborted'da COMMIT → ROLLBACK
cat > izolyatsiya.js <<'JS'
const { Client } = require('pg');
const cfg = { user: 'postgres', password: 'mentor123', host: 'localhost', port: 5437, database: 'shop' };
(async () => {
  const a = new Client(cfg), b = new Client(cfg); await a.connect(); await b.connect();
  const show = async (who, c) => { const r = await c.query('SELECT name, price FROM products WHERE id = 1'); console.log(`${who}: ${JSON.stringify(r.rows[0])}`); };
  await show("Boshida, A seansi", a); await show("Boshida, B seansi", b);
  await a.query('BEGIN'); console.log('A: BEGIN;');
  await a.query('UPDATE products SET price = 1 WHERE id = 1'); console.log("A: UPDATE products SET price = 1 WHERE id = 1;  (COMMIT hali yo'q)");
  await show("A ko'radi", a); await show("B ko'radi", b);
  await a.query('COMMIT'); console.log('A: COMMIT;');
  await show("B endi ko'radi", b);
  await a.query('BEGIN'); console.log('A: BEGIN;');
  try { await a.query('SELECT 1/0'); } catch (e) { console.log('A: SELECT 1/0;  →  ERROR: ' + e.message); }
  try { await a.query('SELECT name FROM products WHERE id = 1'); } catch (e) { console.log('A: SELECT name FROM products WHERE id = 1;  →  ERROR: ' + e.message); }
  const r = await a.query('COMMIT'); console.log('A: COMMIT;  →  baza javobi: ' + r.command);
  await a.query('UPDATE products SET price = 99000 WHERE id = 1');
  await a.end(); await b.end();
})().catch((e) => { console.error('XATO', e.message); process.exit(1); });
JS
{ echo '$ node izolyatsiya.js'; node izolyatsiya.js; } > "$OUT/v2-05-izolyatsiya-aborted.txt" 2>&1
echo "TAYYOR: $(ls "$OUT"/v2-*.txt | wc -l) fayl"
