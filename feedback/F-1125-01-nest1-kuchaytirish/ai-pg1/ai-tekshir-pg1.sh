#!/bin/bash
# F-1125-01 · PG-1 AI bloki — AI yozgan sxemani mentor kabi tekshirish (haqiqiy PostgreSQL 18, vaqtinchalik klaster).
# Ishlatish: S=<scratchpad> bash ai-tekshir-pg1.sh <AI papkasi>
#   <AI papkasi>/schema.sql — AI javobidagi sxema (aynan, o'zgartirmasdan)
#   <AI papkasi>/sinov.sql  — mentor yozgan odatiy + kutilmagan yozuvlar (AI tanlagan ustun nomlari bilan)
# Natija: <AI papkasi>/natija.txt (psql -e: har buyruq va uning javobi). Klaster ish oxirida to'xtatiladi.
set -u
S=${S:?scratchpad papkasi kerak}; D="${1:?AI papkasi}"; B=/usr/lib/postgresql/18/bin
R="$S/pg1-ai/$(basename "$D")"; PORT=${PORT:-5437}
rm -rf "$R"; mkdir -p "$R"
$B/initdb -D "$R/pg" -U postgres --auth=trust --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
# Unix-soket yo'li 107 baytdan oshadi (scratchpad uzun) — faqat 127.0.0.1 TCP, soketsiz
$B/pg_ctl -D "$R/pg" -o "-p $PORT -k '' -c listen_addresses=127.0.0.1" -l "$R/pg.log" -w start >/dev/null
P() { psql -h 127.0.0.1 -p "$PORT" -U postgres -X "$@"; }
{
  echo '--- psql -U postgres -c "CREATE DATABASE chat;"'
  P -c 'CREATE DATABASE chat;' 2>&1
  echo; echo '--- psql -U postgres -d chat -f schema.sql   (AI sxemasi, aynan)'
  P -d chat -e -f "$D/schema.sql" 2>&1 | sed "s#$D/##"
  echo; echo '--- \d (jadvallar)'
  P -d chat -c '\d' 2>&1
  echo; echo '--- psql -U postgres -d chat -f sinov.sql   (mentor: odatiy + kutilmagan)'
  P -d chat -e -f "$D/sinov.sql" 2>&1 | sed "s#$D/##"
} > "$D/natija.txt"
$B/pg_ctl -D "$R/pg" -m fast stop >/dev/null
echo "tayyor: $D/natija.txt"
