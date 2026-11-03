#!/usr/bin/env bash
# Webhook mentor darsi — AMALIYOT qadamlarini mentor yo'lida aynan yurgizish (F-1029-02, 01.11 avtopilot).
# .env.example → .env (TOLOV_KALITI — node -e bilan), npm run start, /royxat (login), brauzerda «Mashq to'lov» sahifasi —
# tugmalar haqiqiy bosiladi (headless Chrome), sahifadagi javob satrlari olinadi. Ctrl+C = SIGINT jarayon guruhiga.
# Natija: manba/wh-amal-out/NN-*.txt. ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-wh-amaliyot.sh
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/wh-amal-out"
R="${S:?S=scratchpad kerak}/wh-amal"
PGB=$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)
PGP=5453
mkdir -p "$OUT"; rm -f "$OUT"/*.txt; rm -rf "$R"; mkdir -p "$R"
be_stop(){ [ -f "$R/be.pgid" ] && kill -INT -- "-$(cat "$R/be.pgid")" 2>/dev/null; for i in $(seq 1 40); do ss -ltn | grep -q ':3000 ' || return 0; sleep 0.25; done; }
be_start(){ : > "$R/be.log"; ( cd "$R/maydon-jamoa/backend" && exec setsid bash -c 'exec env NO_COLOR=1 npm run start' >> "$R/be.log" 2>&1 < /dev/null ) & echo $! > "$R/be.pgid"
  for i in $(seq 1 240); do grep -q 'successfully started' "$R/be.log" && return 0; sleep 0.5; done; return 1; }
stop_all(){ be_stop; [ -d "$R/pg" ] && $PGB/pg_ctl -D "$R/pg" -m fast stop >/dev/null 2>&1; }
trap stop_all EXIT
echo postgres > "$R/pw"
$PGB/initdb -D "$R/pg" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$PGB/pg_ctl -D "$R/pg" -o "-p $PGP -k /tmp -c listen_addresses=localhost" -l "$R/pg.log" -w start >/dev/null
PGPASSWORD=postgres $PGB/psql -h localhost -p $PGP -U postgres -c "CREATE DATABASE maydon_jamoa;" >/dev/null
SQL(){ PGPASSWORD=postgres $PGB/psql -h localhost -p $PGP -U postgres -d maydon_jamoa -c "$1" 2>&1; }
cd "$R" && git clone -q https://github.com/Azizbekcrypto/maydon-jamoa || exit 1
cd maydon-jamoa && git checkout -qf m13-dars-03-done && cd backend || exit 1
npm ci --no-audit --no-fund >/dev/null 2>&1; cp .env.example .env; sed -i "s#localhost:5432/maydon_jamoa#localhost:$PGP/maydon_jamoa#" .env
KALIT=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"); sed -i "s#^TOLOV_KALITI=.*#TOLOV_KALITI=$KALIT#" .env
J='Content-Type: application/json'
be_start
ROY=$(curl -s -X POST localhost:3000/royxat -H "$J" -d '{"ism":"Ali","login":"ali","parol":"parol123"}'); OID=$(echo "$ROY" | node -pe "JSON.parse(require('fs').readFileSync(0)).id")
{ echo '$ node -e "console.log(require('"'"'crypto'"'"').randomBytes(32).toString('"'"'hex'"'"'))"   # → .env: TOLOV_KALITI=<64 belgi>'; echo "# kalit uzunligi: ${#KALIT}"
  echo '$ npm run start'; grep -c 'successfully started' "$R/be.log" | sed 's/^/# successfully started: /'
  echo "\$ curl -X POST localhost:3000/royxat -H \"$J\" -d '{\"ism\":\"Ali\",\"login\":\"ali\",\"parol\":\"parol123\"}'"; echo "$ROY"; } > "$OUT/01-tayyorlov.txt"

bos(){ cat > "$R/bos.mjs" <<'JS'
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [url, ...tugmalar] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage();
await p.goto(url);
for (const t of tugmalar) { await p.click(`button[data-tur="${t}"]`); await p.waitForTimeout(1200); }
console.log((await p.$$eval('#javoblar li', (l) => l.map((x) => x.textContent))).join('\n'));
await b.close();
JS
node "$R/bos.mjs" "http://localhost:3000/tolov-mashq?oyinchi=$OID&summa=10000" "$@"; }

# Amaliyot 1 — «To'lash» va «Rad etish»
{ echo "# brauzer: localhost:3000/tolov-mashq?oyinchi=$OID&summa=10000 — «To'lash (mashq)», keyin «Rad etish (mashq)»"; bos tolash rad
  echo '$ psql -c "SELECT tolov_raqami, holat FROM tolovlar;"'; SQL "SELECT tolov_raqami, holat FROM tolovlar ORDER BY id;"; } > "$OUT/02-tolash-rad.txt"
# Amaliyot 2 — «Ikki marta yuborish» va «Imzosiz yuborish»
{ echo "# brauzer: «Ikki marta yuborish», keyin «Imzosiz yuborish»"; bos ikki imzosiz
  echo '$ psql -c "SELECT count(*) FROM tolovlar;"'; SQL "SELECT count(*) FROM tolovlar;"; } > "$OUT/03-ikki-imzosiz.txt"
# Amaliyot 3 — buzamiz: main.ts da rawBody olib tashlandi → «To'lash» ham 401; qaytarildi → 200
be_stop; cp src/main.ts "$R/main.asl"; sed -i 's/NestFactory.create(AppModule, { rawBody: true })/NestFactory.create(AppModule)/' src/main.ts; be_start
{ echo "# src/main.ts:"; grep -n "NestFactory.create" src/main.ts; echo "# brauzer: «To'lash (mashq)»"; bos tolash; } > "$OUT/04-rawbody-yoq.txt"
be_stop; cp "$R/main.asl" src/main.ts; be_start
{ echo "# src/main.ts qaytarildi:"; grep -n "NestFactory.create" src/main.ts; echo "# brauzer: «To'lash (mashq)»"; bos tolash; } > "$OUT/05-rawbody-qaytdi.txt"
date > "$OUT/00-sana.txt"; git -C "$R/maydon-jamoa" log --oneline -1 | cut -c1-60 >> "$OUT/00-sana.txt"
echo done
