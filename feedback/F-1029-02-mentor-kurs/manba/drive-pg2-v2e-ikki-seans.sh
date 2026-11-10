#!/usr/bin/env bash
# PG-2 v2 10-ekran (GATE M 2-savol: C, 03.11): IKKI HAQIQIY psql seansi (A va B) — BEGIN ichidagi o'zgarish B ga COMMIT'gacha ko'rinmaydi;
# aborted holat (=!#); aborted'da COMMIT → ROLLBACK. Promptlar haqiqiy (pty orqali), ikki seans galma-gal.
# Baza holati = 9-ekrandan keyin (3→9 ekranlar v2b tartibida qayta yurgiziladi). Oxirida 11-ekran ham qayta yurgizilib v2b-04 bilan solishtiriladi.
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-pg2-v2e-ikki-seans.sh → manba/pg2-out/v2e-ikki-seans.txt
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUTD="$ROOT/feedback/F-1029-02-mentor-kurs/manba/pg2-out"
R="${S:?S=scratchpad kerak}/pg2v2e-$(date +%s)"; B=/usr/lib/postgresql/18/bin; PW=mentor123; PORT=5440
export LC_MESSAGES=C LANG=C.UTF-8 PAGER=cat PSQL_PAGER=cat TERM=dumb PGPASSWORD=$PW
mkdir -p "$R"; echo "$PW" > "$R/pw"
$B/initdb -D "$R/a" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$B/pg_ctl -D "$R/a" -o "-p $PORT -k /tmp -c listen_addresses=localhost" -l "$R/a.log" -w start >/dev/null
trap '$B/pg_ctl -D "$R/a" -m fast stop >/dev/null 2>&1' EXIT
P(){ psql -h localhost -p $PORT -U postgres "$@" 2>&1; }
P -c "CREATE DATABASE shop;" >/dev/null
# 3→9 ekranlar (v2b bilan bir xil ketma-ketlik)
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
SQL
# Ikki haqiqiy psql seansi (pty)
python3 - "$PORT" "$OUTD/v2e-ikki-seans.txt" <<'PY'
import os, pty, re, select, sys, time, subprocess
port, out = sys.argv[1], sys.argv[2]
PROMPT = re.compile(r'shop[=\-][*!]?#\s$')
class Seans:
    def __init__(self, name):
        self.name = name
        self.m, s = pty.openpty()
        self.p = subprocess.Popen(['psql', '-X', '-h', 'localhost', '-p', port, '-U', 'postgres', '-d', 'shop'], stdin=s, stdout=s, stderr=s, close_fds=True)
        os.close(s); self.buf = ''
        self.read_until_prompt()
    def read_until_prompt(self, timeout=10):
        t0 = time.time(); chunk = ''
        while time.time() - t0 < timeout:
            r, _, _ = select.select([self.m], [], [], 0.2)
            if r:
                try: data = os.read(self.m, 65536).decode('utf-8', 'replace')
                except OSError: break
                chunk += data
                if PROMPT.search(chunk): break
        return chunk
    def run(self, cmd):
        os.write(self.m, (cmd + '\n').encode())
        time.sleep(0.15)
        raw = self.read_until_prompt()
        txt = re.sub(r'\x1b\[[0-9;?]*[A-Za-z]|\r', '', raw)
        return txt
    def close(self):
        try: os.write(self.m, b'\\q\n')
        except OSError: pass
        self.p.wait(timeout=5)
log = []
def step(s, cmd):
    txt = s.run(cmd)
    log.append((s.name, txt))
A, B = Seans('A'), Seans('B')
step(A, "SELECT name, price FROM products WHERE id = 1;")
step(B, "SELECT name, price FROM products WHERE id = 1;")
step(A, "BEGIN;")
step(A, "UPDATE products SET price = 89000 WHERE id = 1;")
step(A, "SELECT name, price FROM products WHERE id = 1;")
step(B, "SELECT name, price FROM products WHERE id = 1;")
step(A, "COMMIT;")
step(B, "SELECT name, price FROM products WHERE id = 1;")
step(A, "BEGIN;")
step(A, "SELECT 1/0;")
step(A, "SELECT name FROM products WHERE id = 1;")
step(A, "COMMIT;")
step(A, "SELECT name, price FROM products WHERE id = 1;")
A.close(); B.close()
# Transkript: har qadam — qaysi seans; psql echo'si bilan prompt+buyruq+natija; oxirgi prompt keyingi qadamga qoldiriladi
lines = ['# Ikki haqiqiy psql seansi (A va B), psql 18 · pty · 03.11. Har blok: [A] yoki [B] — qaysi oynada yozildi.', '']
pending = {'A': 'shop=# ', 'B': 'shop=# '}
for name, txt in log:
    body = txt.rstrip()
    m = re.search(r'(shop[=\-][*!]?# )$', body)
    tail = m.group(1) if m else ''
    body = body[: -len(tail)] if tail else body
    lines.append(f'[{name}] ' + pending[name] + body.strip('\n').replace('\n', f'\n[{name}] '))
    lines.append('')
    pending[name] = tail or pending[name]
open(out, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
print('yozildi', out)
PY
# 11-ekran qayta — v2b-04 bilan solishtirish uchun
P -d shop -e <<'SQL' > "$R/ekran11.txt"
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
if diff <(sed -E 's/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9:.]+/VAQT/' "$R/ekran11.txt") <(sed -E 's/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9:.]+/VAQT/' "$OUTD/v2b-04-ekran11.txt") >/dev/null; then echo "11-ekran: v2b-04 bilan AYNAN (vaqtdan tashqari)"; else echo "11-ekran: FARQ BOR"; diff "$R/ekran11.txt" "$OUTD/v2b-04-ekran11.txt" | head -20; fi
