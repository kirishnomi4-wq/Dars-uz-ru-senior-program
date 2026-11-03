#!/usr/bin/env bash
# WebSocket-2 mentor darsi — haqiqiy chiqishlar (F-1029-02, 01.11 avtopilot). Natija: manba/ws2-out/NN-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-ws2.sh
# O'quvchi loyihasi maydon-jamoa: Backend m12-dars-04-done (5-darsda Backend o'zgarmagan) — HAQIQIY, lokal PostgreSQL bilan.
# Ilova o'rniga Node klient (manba/ws2-sinov.js): mobil/src/ulanish.ts ning m12-04 (xatoli) va m12-05 (tuzatilgan) versiyalari.
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
M="$ROOT/feedback/F-1029-02-mentor-kurs/manba"
OUT="$M/ws2-out"
R="${S:?S=scratchpad kerak}/ws2-run"
B=$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)
PGP=5450
mkdir -p "$OUT"; rm -f "$OUT"/*.txt; rm -rf "$R"; mkdir -p "$R/klient"
stop_all(){ [ -d "$R/pg" ] && $B/pg_ctl -D "$R/pg" -m fast stop >/dev/null 2>&1; }
trap stop_all EXIT
echo postgres > "$R/pw"
$B/initdb -D "$R/pg" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$B/pg_ctl -D "$R/pg" -o "-p $PGP -k /tmp -c listen_addresses=localhost" -l "$R/pg.log" -w start >/dev/null
PGPASSWORD=postgres $B/psql -h localhost -p $PGP -U postgres -c "CREATE DATABASE maydon_jamoa" >/dev/null
cd "$R" && git clone -q https://github.com/Azizbekcrypto/maydon-jamoa mj || exit 1
cd mj && git checkout -q m12-dars-04-done && cd backend && npm ci --no-audit --no-fund >/dev/null 2>&1 && npx nest build >/dev/null 2>&1 || exit 1
export DATABASE_URL="postgresql://postgres:postgres@localhost:$PGP/maydon_jamoa" JWT_SECRET="namuna-jwt-kalit-faqat-laptop-uchun-almashtiring" PORT=3000
export BE="$R/mj/backend" TOKFILE="$R/tokenlar.json"
cd "$R/klient" && npm init -y >/dev/null && npm install --no-audit --no-fund socket.io-client@4 >/dev/null 2>&1 && cp "$M/ws2-sinov.js" .

# 00 — versiyalar va ilova kodining farqi (m12-04 → m12-05)
{ git -C "$R/mj" log --oneline -1 m12-dars-04-done | cut -c1-100; git -C "$R/mj" log --oneline -1 m12-dars-05-done | cut -c1-100
  node -v; node -pe "'socket.io-client ' + require('socket.io-client/package.json').version"
  echo "# m12-04 → m12-05: Backend o'zgarmagan:"; git -C "$R/mj" diff --stat m12-dars-04-done m12-dars-05-done -- backend | tail -1; echo "(bo'sh — o'zgarish yo'q)"
  git -C "$R/mj" diff --stat m12-dars-04-done m12-dars-05-done | tail -6; date; } > "$OUT/00-versiyalar.txt" 2>&1
git -C "$R/mj" diff m12-dars-04-done m12-dars-05-done -- mobil/src/ulanish.ts > "$OUT/00b-ulanish-farq.txt"

node ws2-sinov.js tayyorla
n=1
for s in uzilish versiya xona; do for r in eski yangi; do
  f=$(printf '%02d' $n)-$s-$r.txt
  { echo "\$ node ws2-sinov.js $s $r"; node ws2-sinov.js $s $r 2>&1; } > "$OUT/$f"; n=$((n+1))
done; done
echo done
