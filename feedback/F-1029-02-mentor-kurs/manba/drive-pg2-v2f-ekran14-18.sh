#!/usr/bin/env bash
# PG-2 v2 14, 15, 16, 18-ekranlar (03.11, F-1103-05 sinfi): 3→11 ekranlar ketma-ketligidan KEYINGI haqiqiy holatda —
# qoidalar (NOT NULL/DEFAULT/UNIQUE), beshta xato, apostrof tuzatish, Pool o'lchovi (rowCount) — id va narxlar demo-bazaga mos bo'lsin.
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-pg2-v2f-ekran14-18.sh → pg2-out/v2f-*.txt
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/pg2-out"
R="${S:?S=scratchpad kerak}/pg2v2f-$(date +%s)"; N="$S/pg2v2-node"; B=/usr/lib/postgresql/18/bin; PW=mentor123; PORT=5441
export LC_MESSAGES=C LANG=C.UTF-8 PAGER=cat PSQL_PAGER=cat PGPASSWORD=$PW
mkdir -p "$R" "$N"; echo "$PW" > "$R/pw"
$B/initdb -D "$R/a" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$B/pg_ctl -D "$R/a" -o "-p $PORT -k /tmp -c listen_addresses=localhost" -l "$R/a.log" -w start >/dev/null
trap '$B/pg_ctl -D "$R/a" -m fast stop >/dev/null 2>&1' EXIT
P(){ psql -h localhost -p $PORT -U postgres "$@" 2>&1; }
P -c "CREATE DATABASE shop;" >/dev/null
# 3→11 (v2b + 10-ekran COMMIT 89000)
P -d shop -q <<'SQL' >/dev/null
CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);
INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5), ('Kolonka', 50000, 10);
UPDATE products SET price = 99000 WHERE id = 1;
DELETE FROM products WHERE id = 3;
UPDATE products SET price = 1 WHERE id = 99;
DELETE FROM products WHERE id = 99;
UPDATE products SET stock = stock - 1 WHERE id = 1 RETURNING id, name, stock;
UPDATE products SET stock = stock - 1 WHERE id = 99 RETURNING id, name, stock;
BEGIN; UPDATE products SET price = 99000; DELETE FROM products; ROLLBACK;
BEGIN; UPDATE products SET price = 89000 WHERE id = 1; COMMIT;
ALTER TABLE products ADD CONSTRAINT stock_nonneg CHECK (stock >= 0);
CREATE TABLE orders (id SERIAL PRIMARY KEY, product_id INTEGER NOT NULL REFERENCES products(id), qty INTEGER NOT NULL CHECK (qty > 0), created_at TIMESTAMP DEFAULT now());
BEGIN; UPDATE products SET stock = stock - 1 WHERE id = 2; INSERT INTO orders (product_id, qty) VALUES (2, 1); COMMIT;
BEGIN; INSERT INTO orders (product_id, qty) VALUES (4, 12); UPDATE products SET stock = stock - 12 WHERE id = 4; ROLLBACK;
SQL
P -d shop -e <<'SQL' > "$OUT/v2f-ekran14.txt"
SELECT * FROM products ORDER BY id;
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
SQL
# 15–16: har buyruq ALOHIDA (ochiq apostrof butun skriptni yutib yubormasin — birinchi urinishda shunday bo'ldi)
: > "$OUT/v2f-ekran15-16.txt"
while IFS= read -r q; do { echo "shop=# $q"; P -d shop -c "$q"; } >> "$OUT/v2f-ekran15-16.txt"; done <<'SQL'
SELECT * FROM product WHERE price < 100000;
SELECT * FROM products WHERE narx < 100000;
INSERT INTO products (name, price, stock) VALUES ('Planshet2', 'arzon', 3);
INSERT INTO products (name, price, stock) VALUES ('Planshet2', 300000);
INSERT INTO products (name, price, stock) VALUES ('O'yinchoq', 30000, 4);
INSERT INTO products (name, price, stock) VALUES ("O'yinchoq", 30000, 4);
INSERT INTO products (name, price, stock) VALUES ('O''yinchoq', 30000, 4) RETURNING *;
SELECT * FROM products ORDER BY id;
SQL
# 18-ekran: Pool o'lchovi shu bazada
cd "$N" && { [ -f package.json ] || npm init -y >/dev/null 2>&1; } && { [ -d node_modules/pg ] || npm i pg@8.23.1 --no-audit --no-fund >/dev/null 2>&1; }
cat > pool-pid-v2f.js <<JS
const { Pool } = require('pg');
const cfg = { user: 'postgres', password: 'mentor123', host: 'localhost', port: ${PORT}, database: 'shop' };
const pool = new Pool(cfg);
(async () => {
  console.log('Pool yaratildi · ulanishlar:', pool.totalCount);
  for (let i = 1; i <= 3; i++) {
    const r = await pool.query("SELECT pg_backend_pid() AS pid, (SELECT count(*) FROM pg_stat_activity WHERE datname = 'shop') AS faol");
    console.log(\`so'rov \${i}: baza jarayoni pid \${r.rows[0].pid} · bazadagi faol ulanishlar \${r.rows[0].faol} · Pool ulanishlari \${pool.totalCount}\`);
  }
  const r2 = await pool.query('SELECT name, price FROM products WHERE price < \$1 ORDER BY id', [100000]);
  console.log('rowCount:', r2.rowCount, '· rows:', JSON.stringify(r2.rows));
  const r3 = await pool.query('UPDATE products SET price = \$1 WHERE id = \$2', [1, 99]);
  console.log('UPDATE id=99 → rowCount:', r3.rowCount, '· rows:', JSON.stringify(r3.rows));
  const bad = new Pool({ ...cfg, password: 'xato' });
  console.log("xato parol bilan Pool yaratildi — xato yo'q (hali ulanmadi)");
  try { await bad.query('SELECT 1'); } catch (e) { console.log("birinchi so'rovda:", e.message); }
  await pool.end(); await bad.end();
})();
JS
{ echo '$ node pool-pid.js'; node pool-pid-v2f.js; } > "$OUT/v2f-pool.txt" 2>&1
echo "TAYYOR: v2f-ekran14 · v2f-ekran15-16 · v2f-pool"
