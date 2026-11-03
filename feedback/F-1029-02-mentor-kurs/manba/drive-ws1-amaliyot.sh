#!/usr/bin/env bash
# WebSocket-1 mentor darsi — AMALIYOT qadamlarini mentor yo'lida aynan yurgizish (F-1029-02, 01.11 avtopilot).
# Farqi drive-ws1.sh dan: `.env.example` → `.env`, `npm run start` (nest start), MD dagi curl'lar, bitta `klient.js`
# (socket.io standart sozlamasi — ilovadagi ulanish.ts kabi, reconnectionDelayMax o'zgartirilmagan), Ctrl+C = SIGINT.
# Natija: manba/ws1-amal-out/NN-*.txt. ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-ws1-amaliyot.sh
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/ws1-amal-out"
R="${S:?S=scratchpad kerak}/ws1-amal"
B=$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)
PGP=5449
mkdir -p "$OUT"; rm -f "$OUT"/*.txt; rm -rf "$R"; mkdir -p "$R/klient"
be_stop(){ [ -f "$R/be.pgid" ] && kill -INT -- "-$(cat "$R/be.pgid")" 2>/dev/null; for i in $(seq 1 40); do ss -ltn | grep -q ':3000 ' || return 0; sleep 0.25; done; }
stop_all(){ be_stop; [ -n "${KP:-}" ] && kill "$KP" 2>/dev/null; [ -d "$R/pg" ] && $B/pg_ctl -D "$R/pg" -m fast stop >/dev/null 2>&1; }
trap stop_all EXIT
echo postgres > "$R/pw"
$B/initdb -D "$R/pg" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$B/pg_ctl -D "$R/pg" -o "-p $PGP -k /tmp -c listen_addresses=localhost" -l "$R/pg.log" -w start >/dev/null

# 01 — 1-qadam va 2-qadam (Amaliyot 1)
cd "$R" && git clone -q https://github.com/Azizbekcrypto/maydon-jamoa || exit 1
cd maydon-jamoa
{ echo '# main tarmog'"'"'ida backend/ yo'"'"'q:'; echo '$ ls'; ls; echo '$ git checkout -f m12-dars-02-done'; git checkout -f m12-dars-02-done 2>&1 | tail -1
  echo '$ cd backend'; cd backend || exit 1
  echo '$ npm ci'; npm ci --no-audit --no-fund 2>&1 | grep -E '^added'
  echo "\$ psql -U postgres -c \"CREATE DATABASE maydon_jamoa;\""; PGPASSWORD=postgres $B/psql -h localhost -p $PGP -U postgres -c "CREATE DATABASE maydon_jamoa;" 2>&1
  echo '$ cp .env.example .env'; cp .env.example .env
  sed -i "s#localhost:5432/maydon_jamoa#localhost:$PGP/maydon_jamoa#" .env   # bu kompyuterda PostgreSQL boshqa portda — o'quvchi parolni almashtiradi
  echo '# .env: DATABASE_URL — faqat port o'"'"'zgartirildi (bu kompyuterda 5449), qolgani namunadagidek'; } > "$OUT/01-repo-env.txt"
be_start(){ ( cd "$R/maydon-jamoa/backend" && exec setsid bash -c 'exec env NO_COLOR=1 npm run start' >> "$R/be.log" 2>&1 < /dev/null ) & echo $! > "$R/be.pgid"
  for i in $(seq 1 240); do grep -q 'successfully started' "$R/be.log" && return 0; sleep 0.5; done; return 1; }
: > "$R/be.log"; T=$(date +%s.%N); be_start; T2=$(date +%s.%N)
{ echo '$ npm run start'; sed -E 's/^\[Nest\] [0-9]+  - [^ ]+ [^ ]+ [AP]M +//' "$R/be.log" | grep -vE '^$' | grep -E 'Starting|Ulanish|successfully'; printf '# start: %.1f s (nest start — avval TypeScript build)\n' "$(echo "$T2 - $T" | bc)"; } >> "$OUT/01-repo-env.txt"

# 02 — 3-qadam: ro'yxat va kirish (MD dagi buyruqlar aynan)
H='Content-Type: application/json'
{ for u in "Ali:01" "Vali:02"; do n=${u%%:*}; t=${u##*:}
    echo "\$ curl -X POST localhost:3000/royxat -H \"$H\" -d '{\"ism\":\"$n\",\"telefon\":\"+998 90 000 00 $t\",\"parol\":\"parol123\"}'"
    curl -s -w ' [HTTP %{http_code}]\n' -X POST localhost:3000/royxat -H "$H" -d "{\"ism\":\"$n\",\"telefon\":\"+998 90 000 00 $t\",\"parol\":\"parol123\"}"; done
  echo "\$ curl -X POST localhost:3000/kirish -H \"$H\" -d '{\"telefon\":\"+998 90 000 00 01\",\"parol\":\"parol123\"}'"
  curl -s -w ' [HTTP %{http_code}]\n' -X POST localhost:3000/kirish -H "$H" -d '{"telefon":"+998 90 000 00 01","parol":"parol123"}' | sed -E 's/("token":")[^"]{20}[^"]*/\1eyJ…(qisqartirildi)/'
  echo '# takror ro'"'"'yxat (sinf holati):'; curl -s -w ' [HTTP %{http_code}]\n' -X POST localhost:3000/royxat -H "$H" -d '{"ism":"Ali","telefon":"+998 90 000 00 01","parol":"parol123"}'; } > "$OUT/02-royxat-kirish.txt"
tok(){ curl -s -X POST localhost:3000/kirish -H "$H" -d "{\"telefon\":\"+998 90 000 00 $1\",\"parol\":\"parol123\"}" | node -pe "JSON.parse(require('fs').readFileSync(0)).token"; }
TA=$(tok 01); TV=$(tok 02)

# 03 — 4-qadam: klient.js (mentor nusxasi — darsdagi «Kodni ochish» aynan shu fayl)
cd "$R/klient"
{ echo '$ npm i socket.io-client'; npm i --no-audit --no-fund socket.io-client 2>&1 | grep -E '^added'; node -pe "'socket.io-client ' + require('socket.io-client/package.json').version"; } > "$OUT/03-klient-ornatish.txt"
cp "$ROOT/feedback/F-1029-02-mentor-kurs/manba/ws1-klient.js" klient.js
kl_start(){ ( exec env TOKEN="$1" node klient.js > "$R/$2" 2>&1 ) & KP=$!; }
: > "$R/be.log"; kl_start "$TA" k1.txt; sleep 3
{ echo '$ TOKEN=<Ali tokeni> node klient.js'; cat "$R/k1.txt"; echo; echo '# Backend terminali:'; grep -E 'Ulanish' "$R/be.log" | sed -E 's/^\[Nest\] [0-9]+  - [^ ]+ [^ ]+ [AP]M +//'; } > "$OUT/04-ulanish.txt"

# 05 — Amaliyot 2: Ctrl+C (SIGINT) Backend'ga → standart qayta urinish → npm run start → o'zi ulangan
echo "$(date +%s.%N)" > "$R/t-stop"; be_stop; sleep 15
: > "$R/be.log"; T=$(date +%s.%N); be_start; T2=$(date +%s.%N); sleep 8
kill $KP 2>/dev/null; wait $KP 2>/dev/null; KP=
{ echo '$ TOKEN=<Ali tokeni> node klient.js   # 3 s da Backend terminalida Ctrl+C, 15 s dan keyin npm run start'; cat "$R/k1.txt"
  printf '# Backend qayta yoqildi: Ctrl+C dan %.1f s keyin (npm run start ~%.1f s davom etdi)\n' "$(echo "$T - $(cat "$R/t-stop")" | bc)" "$(echo "$T2 - $T" | bc)"; } > "$OUT/05-ctrlc-qayta.txt"

# 06 — Amaliyot 2, 4-qadam: tokensiz
kl_start "" k2.txt; sleep 3; kill $KP 2>/dev/null; wait $KP 2>/dev/null; KP=
{ echo '$ TOKEN= node klient.js'; cat "$R/k2.txt"; } > "$OUT/06-tokensiz.txt"

# 07 — Amaliyot 3: m12-dars-03-done, Vali qo'shiladi — Ali'ga hodisa
cd "$R/maydon-jamoa/backend"; be_stop
{ echo '$ git checkout -f m12-dars-03-done'; git checkout -f m12-dars-03-done 2>&1 | tail -1; echo '$ npm ci'; npm ci --no-audit --no-fund 2>&1 | grep -E '^added'; ls .env >/dev/null && echo '# .env joyida qoldi (gitignore)'; } > "$OUT/07-m12-03.txt"
: > "$R/be.log"; be_start; echo '$ npm run start' >> "$OUT/07-m12-03.txt"; grep -c 'successfully started' "$R/be.log" | sed 's/^/# successfully started: /' >> "$OUT/07-m12-03.txt"
cd "$R/klient"; kl_start "$TA" k3.txt; sleep 2
{ echo "\$ curl localhost:3000/oyinlar -H \"Authorization: Bearer <Ali>\"   # 2-o'yin"; curl -s localhost:3000/oyinlar -H "Authorization: Bearer $TA" | node -e "const o=JSON.parse(require('fs').readFileSync(0)).find(x=>x.id===2); console.log(JSON.stringify({id:o.id,maydon:o.maydon,qoshilgan:o.qoshilgan,kerak:o.kerak}))"
  echo "\$ curl -X POST localhost:3000/oyinlar/2/qoshilish -H \"Authorization: Bearer <Vali>\""; curl -s -w ' [HTTP %{http_code}]\n' -X POST localhost:3000/oyinlar/2/qoshilish -H "Authorization: Bearer $TV"; sleep 1
  echo "# takror (sinf holati):"; curl -s -w ' [HTTP %{http_code}]\n' -X POST localhost:3000/oyinlar/2/qoshilish -H "Authorization: Bearer $TV"; sleep 1
  echo; echo '# Ali klienti (TOKEN=<Ali> node klient.js):'; cat "$R/k3.txt"; } > "$OUT/08-hodisa.txt"
kill $KP 2>/dev/null; wait $KP 2>/dev/null; KP=
date > "$OUT/00-sana.txt"; node -v >> "$OUT/00-sana.txt"; git -C "$R/maydon-jamoa" log --oneline -1 m12-dars-02-done | cut -c1-60 >> "$OUT/00-sana.txt"
echo done
