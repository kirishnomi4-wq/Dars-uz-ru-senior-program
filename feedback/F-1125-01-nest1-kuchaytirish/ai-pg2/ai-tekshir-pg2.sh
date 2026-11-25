#!/bin/bash
# F-1125-01 · PG-2 AI bloki — AI yozgan SQL'ni mentor kabi tekshirish (haqiqiy PostgreSQL 18, vaqtinchalik klaster).
# Ishlatish: S=<scratchpad> [PORT=5441] bash ai-tekshir-pg2.sh <AI papkasi>
#   <AI papkasi>/sorovlar.sql — AI javobidagi SQL (aynan, o'zgartirmasdan; javobdagi tartibda)
# Baza: PG-2 darsining shop/products holati (1-bosqich): 4 qator. Natija: <AI papkasi>/natija.txt — har buyruq va javobi (psql -e),
# oxirida SELECT * FROM products ORDER BY id — kutilgan holat bilan solishtirish uchun. Klaster ish oxirida to'xtatiladi.
set -u
S=${S:?scratchpad papkasi kerak}; D="${1:?AI papkasi}"; B=/usr/lib/postgresql/18/bin
R="$S/pg2-ai/$(basename "$D")"; PORT=${PORT:-5441}
rm -rf "$R"; mkdir -p "$R"
$B/initdb -D "$R/pg" -U postgres --auth=trust --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
# Unix-soket yo'li 107 baytdan oshadi (scratchpad uzun) — faqat 127.0.0.1 TCP, soketsiz
$B/pg_ctl -D "$R/pg" -o "-p $PORT -k '' -c listen_addresses=127.0.0.1" -l "$R/pg.log" -w start >/dev/null
P() { psql -h 127.0.0.1 -p "$PORT" -U postgres -X "$@"; }
P -q -c 'CREATE DATABASE shop;'
P -q -d shop -c "CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);
INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5), ('Kolonka', 50000, 10);"
{
  echo '--- boshlang'"'"'ich holat (PG-2 1-bosqich)'
  P -d shop -c 'SELECT * FROM products ORDER BY id;'
  echo '--- psql -U postgres -d shop -f sorovlar.sql   (AI SQL, aynan)'
  P -d shop -e -f "$D/sorovlar.sql" 2>&1 | sed "s#$D/##"
  echo '--- yakuniy holat'
  P -d shop -c 'SELECT * FROM products ORDER BY id;'
  echo '--- kutilgan: Klaviatura 120000 8 · Sichqoncha 75000 15 · Quloqchin 90000 5 · Monitor 1500000 3 · Kolonka yo'"'"'q'
} > "$D/natija.txt"
$B/pg_ctl -D "$R/pg" -m fast stop >/dev/null
echo "tayyor: $D/natija.txt"
