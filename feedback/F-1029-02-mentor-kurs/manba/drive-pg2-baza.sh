#!/usr/bin/env bash
# PG-2 3-ekran (F-1103-09, 03.11): CREATE DATABASE shop → \c shop — psql'ning haqiqiy javobi.
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-pg2-baza.sh → manba/pg2-out/v2c-baza.txt
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/pg2-out/v2c-baza.txt"
R="${S:?}/pg2baza-$(date +%s)"; B=/usr/lib/postgresql/18/bin; PW=mentor123; PORT=5439
export LC_MESSAGES=C LANG=C.UTF-8 PAGER=cat PSQL_PAGER=cat
mkdir -p "$R"; echo "$PW" > "$R/pw"
$B/initdb -D "$R/a" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$B/pg_ctl -D "$R/a" -o "-p $PORT -k /tmp -c listen_addresses=localhost" -l "$R/a.log" -w start >/dev/null
trap '$B/pg_ctl -D "$R/a" -m fast stop >/dev/null 2>&1' EXIT
PGPASSWORD=$PW psql -h localhost -p $PORT -U postgres -e 2>&1 <<'SQL' > "$OUT"
CREATE DATABASE shop;
\c shop
SELECT current_database();
SQL
echo "TAYYOR: $OUT"
