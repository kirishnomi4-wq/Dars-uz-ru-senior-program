#!/usr/bin/env bash
# ISHLATISH (repo ildizidan): S=<scratchpad> OUT=feedback/F-1029-02-mentor-kurs/manba/pg2-out bash feedback/F-1029-02-mentor-kurs/manba/drive-pg2-v2b.sh
# PG-2 v2b: 3–11-ekranlar BITTA uzluksiz demo-bazada, ekran tartibida (F-1103-05: v2 da ekranlar uch xil yurgizishdan edi)
set -u
S="${S:?}"; R="$S/pg2v2b/run"; N="$S/pg2v2b/node"; OUT="${OUT:?}"
B=/usr/lib/postgresql/18/bin; PW=mentor123; PORT=5438
export LC_MESSAGES=C LANG=C.UTF-8 PAGER=cat PSQL_PAGER=cat
rm -rf "$R"; mkdir -p "$R" "$N" "$OUT"
A(){ PGPASSWORD=$PW psql -h localhost -p $PORT -U postgres "$@" 2>&1; }
trap '$B/pg_ctl -D "$R/a" -m fast stop >/dev/null 2>&1' EXIT
echo "$PW" > "$R/pw"
$B/initdb -D "$R/a" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$B/pg_ctl -D "$R/a" -o "-p $PORT -k /tmp -c listen_addresses=localhost" -l "$R/a.log" -w start >/dev/null
{ psql --version; $B/postgres --version; echo "node $(node --version)"; date; } > "$OUT/v2b-00-versiyalar.txt"
A -c "CREATE DATABASE shop;" >/dev/null
A -d shop -e <<'SQL' > "$OUT/v2b-01-ekran3-7.txt"
-- 3-ekran
CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);
INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5), ('Kolonka', 50000, 10);
SELECT * FROM products;
-- 4-ekran
SELECT name, price FROM products;
SELECT * FROM products WHERE price < 100000;
SELECT * FROM products WHERE stock < 6;
-- 5-ekran
UPDATE products SET price = 99000 WHERE id = 1;
DELETE FROM products WHERE id = 3;
UPDATE products SET price = 1 WHERE id = 99;
DELETE FROM products WHERE id = 99;
UPDATE products SET stock = stock - 1 WHERE id = 1 RETURNING id, name, stock;
UPDATE products SET stock = stock - 1 WHERE id = 99 RETURNING id, name, stock;
-- 6-ekran
SELECT * FROM products;
SELECT ctid, id, name, price FROM products;
SELECT * FROM products ORDER BY id;
-- 7-ekran (tekshiruv isboti)
SELECT * FROM products WHERE id = 99;
SQL
A -d shop -e <<'SQL' > "$OUT/v2b-02-ekran9.txt"
-- 9-ekran
BEGIN;
UPDATE products SET price = 99000;
SELECT * FROM products;
DELETE FROM products;
SELECT * FROM products;
ROLLBACK;
SELECT * FROM products;
SQL
cd "$N" && { [ -f package.json ] || npm init -y >/dev/null 2>&1; } && { [ -d node_modules/pg ] || npm i pg@8.23.1 >/dev/null 2>&1; }
cat > izolyatsiya.js <<'JS'
const { Client } = require('pg');
const cfg = { user: 'postgres', password: 'mentor123', host: 'localhost', port: 5438, database: 'shop' };
(async () => {
  const a = new Client(cfg), b = new Client(cfg); await a.connect(); await b.connect();
  const show = async (who, c) => { const r = await c.query('SELECT name, price FROM products WHERE id = 1'); console.log(`${who}: ${JSON.stringify(r.rows[0])}`); };
  await show("Boshida, A seansi", a); await show("Boshida, B seansi", b);
  await a.query('BEGIN'); console.log('A: BEGIN;');
  await a.query('UPDATE products SET price = 89000 WHERE id = 1'); console.log("A: UPDATE products SET price = 89000 WHERE id = 1;  (COMMIT hali yo'q)");
  await show("A ko'radi", a); await show("B ko'radi", b);
  await a.query('COMMIT'); console.log('A: COMMIT;');
  await show("B endi ko'radi", b);
  await a.query('BEGIN'); console.log('A: BEGIN;');
  try { await a.query('SELECT 1/0'); } catch (e) { console.log('A: SELECT 1/0;  →  ERROR: ' + e.message); }
  try { await a.query('SELECT name FROM products WHERE id = 1'); } catch (e) { console.log('A: SELECT name FROM products WHERE id = 1;  →  ERROR: ' + e.message); }
  const r = await a.query('COMMIT'); console.log('A: COMMIT;  →  baza javobi: ' + r.command);
  await a.end(); await b.end();
})().catch((e) => { console.error('XATO', e.message); process.exit(1); });
JS
{ echo '$ node izolyatsiya.js  (10-ekran)'; node izolyatsiya.js; } > "$OUT/v2b-03-ekran10.txt" 2>&1
A -d shop -e <<'SQL' > "$OUT/v2b-04-ekran11.txt"
-- 11-ekran
ALTER TABLE products ADD CONSTRAINT stock_nonneg CHECK (stock >= 0);
CREATE TABLE orders (id SERIAL PRIMARY KEY, product_id INTEGER NOT NULL REFERENCES products(id), qty INTEGER NOT NULL CHECK (qty > 0), created_at TIMESTAMP DEFAULT now());
BEGIN;
UPDATE products SET stock = stock - 1 WHERE id = 2 RETURNING name, stock;
INSERT INTO orders (product_id, qty) VALUES (2, 1) RETURNING *;
COMMIT;
BEGIN;
INSERT INTO orders (product_id, qty) VALUES (4, 12) RETURNING id, product_id, qty;
UPDATE products SET stock = stock - 12 WHERE id = 4;
SELECT * FROM orders;
ROLLBACK;
SELECT * FROM orders;
SELECT id, name, stock FROM products ORDER BY id;
SQL
echo "TAYYOR: $(ls "$OUT"/v2b-*.txt | wc -l) fayl"
