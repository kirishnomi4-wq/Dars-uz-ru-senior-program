#!/usr/bin/env bash
# WebSocket-2 mentor darsi — AMALIYOT qadamlarini mentor yo'lida aynan yurgizish (F-1029-02, 01.11 avtopilot).
# .env.example → .env, npm run start (nest start), MD dagi curl'lar, klient.js (manba/ws2-klient.js — m12-04 qoidasi),
# keyin tuzatilgan klient (manba/ws2-klient-tuzatilgan.js — m12-05 qoidasi). Ctrl+C = SIGINT jarayon guruhiga.
# Natija: manba/ws2-amal-out/NN-*.txt. ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-ws2-amaliyot.sh
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
M="$ROOT/feedback/F-1029-02-mentor-kurs/manba"
OUT="$M/ws2-amal-out"
R="${S:?S=scratchpad kerak}/ws2-amal"
B=$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)
PGP=5451
mkdir -p "$OUT"; rm -f "$OUT"/*.txt; rm -rf "$R"; mkdir -p "$R/ws-klient"
be_stop(){ [ -f "$R/be.pgid" ] && kill -INT -- "-$(cat "$R/be.pgid")" 2>/dev/null; for i in $(seq 1 40); do ss -ltn | grep -q ':3000 ' || return 0; sleep 0.25; done; }
be_start(){ ( cd "$R/maydon-jamoa/backend" && exec setsid bash -c 'exec env NO_COLOR=1 npm run start' >> "$R/be.log" 2>&1 < /dev/null ) & echo $! > "$R/be.pgid"
  for i in $(seq 1 240); do grep -q 'successfully started' "$R/be.log" && return 0; sleep 0.5; done; return 1; }
KA=; KV=
stop_all(){ be_stop; for p in $KA $KV; do kill $p 2>/dev/null; done; [ -d "$R/pg" ] && $B/pg_ctl -D "$R/pg" -m fast stop >/dev/null 2>&1; }
trap stop_all EXIT
echo postgres > "$R/pw"
$B/initdb -D "$R/pg" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$B/pg_ctl -D "$R/pg" -o "-p $PGP -k /tmp -c listen_addresses=localhost" -l "$R/pg.log" -w start >/dev/null
PGPASSWORD=postgres $B/psql -h localhost -p $PGP -U postgres -c "CREATE DATABASE maydon_jamoa;" >/dev/null
cd "$R" && git clone -q https://github.com/Azizbekcrypto/maydon-jamoa || exit 1
cd maydon-jamoa && git checkout -qf m12-dars-04-done && cd backend || exit 1
npm ci --no-audit --no-fund >/dev/null 2>&1; cp .env.example .env; sed -i "s#localhost:5432/maydon_jamoa#localhost:$PGP/maydon_jamoa#" .env
: > "$R/be.log"; be_start
H='Content-Type: application/json'
for u in "Ali:01" "Vali:02"; do n=${u%%:*}; t=${u##*:}; curl -s -o /dev/null -X POST localhost:3000/royxat -H "$H" -d "{\"ism\":\"$n\",\"telefon\":\"+998 90 000 00 $t\",\"parol\":\"parol123\"}"; done
tok(){ curl -s -X POST localhost:3000/kirish -H "$H" -d "{\"telefon\":\"+998 90 000 00 $1\",\"parol\":\"parol123\"}" | node -pe "JSON.parse(require('fs').readFileSync(0)).token"; }
TA=$(tok 01); TV=$(tok 02)
{ echo "\$ git checkout -f m12-dars-04-done · npm ci · cp .env.example .env · npm run start"; grep -c 'successfully started' "$R/be.log" | sed 's/^/# successfully started: /'
  echo "\$ curl localhost:3000/oyinlar -H \"Authorization: Bearer <Ali>\"   # 3-o'yin"; curl -s localhost:3000/oyinlar -H "Authorization: Bearer $TA" | node -e "const o=JSON.parse(require('fs').readFileSync(0)).find(x=>x.id===3); console.log(JSON.stringify({id:o.id,maydon:o.maydon,qoshilgan:o.qoshilgan,kerak:o.kerak}))"; } > "$OUT/01-tayyorlov.txt"
cd "$R/ws-klient"; npm i --no-audit --no-fund socket.io-client >/dev/null 2>&1; cp "$M/ws2-klient.js" klient.js
kl(){ ( exec env TOKEN="$1" OYIN=3 node klient.js > "$R/$2" 2>&1 ) & echo $!; }

# Amaliyot 1 — takror tinglovchi: klient → Ctrl+C → npm run start → Vali qo'shiladi
KA=$(kl "$TA" a1.txt); sleep 2
be_stop; sleep 3; : > "$R/be.log"; be_start; sleep 6
{ echo "\$ curl -X POST localhost:3000/oyinlar/3/qoshilish -H \"Authorization: Bearer <Vali>\""; curl -s -w ' [HTTP %{http_code}]\n' -X POST localhost:3000/oyinlar/3/qoshilish -H "Authorization: Bearer $TV"; } > "$R/q1.txt"; sleep 2
# Amaliyot 2 — xona: ikkinchi telefon (Vali) o'yinni ochadi
KV=$(kl "$TV" v1.txt); sleep 3
kill $KA $KV 2>/dev/null; wait $KA $KV 2>/dev/null; KA=; KV=
{ echo '$ TOKEN=<Ali tokeni> OYIN=3 node klient.js   # 2 s da Backend terminalida Ctrl+C, 3 s dan keyin npm run start'; cat "$R/a1.txt"; echo; echo '# ikkinchi terminal:'; cat "$R/q1.txt"; } > "$OUT/02-takror-tinglovchi.txt"
{ echo '$ TOKEN=<Vali tokeni> OYIN=3 node klient.js   # Ali klienti ham ishlab turibdi, 3-o'"'"'yin ochiq'; cat "$R/v1.txt"; } > "$OUT/03-xona.txt"

# Amaliyot 3 — tuzatilgan klient: xuddi shu ketma-ketlik, o'zgarish — Vali chiqadi (chiqish)
cp "$M/ws2-klient-tuzatilgan.js" klient.js
KA=$(kl "$TA" a3.txt); sleep 2
be_stop; sleep 3; : > "$R/be.log"; be_start; sleep 6
KV=$(kl "$TV" v3.txt); sleep 2
{ echo "\$ curl -X POST localhost:3000/oyinlar/3/chiqish -H \"Authorization: Bearer <Vali>\""; curl -s -w ' [HTTP %{http_code}]\n' -X POST localhost:3000/oyinlar/3/chiqish -H "Authorization: Bearer $TV"; } > "$R/q3.txt"; sleep 2
kill $KA $KV 2>/dev/null; wait $KA $KV 2>/dev/null; KA=; KV=
{ echo '$ TOKEN=<Ali tokeni> OYIN=3 node klient.js   # tuzatilgan klient; 2 s da Ctrl+C, 3 s dan keyin npm run start'; cat "$R/a3.txt"; echo; echo '# ikkinchi terminal:'; echo '$ TOKEN=<Vali tokeni> OYIN=3 node klient.js'; cat "$R/v3.txt"; echo; cat "$R/q3.txt"; } > "$OUT/04-tuzatilgan.txt"
date > "$OUT/00-sana.txt"; node -v >> "$OUT/00-sana.txt"; node -pe "'socket.io-client ' + require('socket.io-client/package.json').version" >> "$OUT/00-sana.txt"
echo done
