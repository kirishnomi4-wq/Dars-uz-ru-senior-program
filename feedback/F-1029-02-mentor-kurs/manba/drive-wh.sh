#!/usr/bin/env bash
# Webhook mentor darsi — haqiqiy chiqishlar (F-1029-02, 01.11 avtopilot). Natija: manba/wh-out/NN-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-wh.sh
# O'quvchi loyihasi maydon-jamoa m13-dars-03-done: Backend (POST /tolov/webhook + «Mashq to'lov» sahifasi) — HAQIQIY, lokal PostgreSQL.
# To'lov xizmati — repo'dagi mashq sahifasining o'zi (POST /tolov-mashq/yubor); qo'lda xabarlar — curl + node (HMAC SHA-256).
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/wh-out"
R="${S:?S=scratchpad kerak}/wh-run"
B=$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)
PGP=5452
mkdir -p "$OUT"; rm -f "$OUT"/*.txt; rm -rf "$R"; mkdir -p "$R"
be_stop(){ [ -f "$R/be.pid" ] && kill "$(cat "$R/be.pid")" 2>/dev/null; for i in $(seq 1 40); do ss -ltn | grep -q ':3000 ' || return 0; sleep 0.25; done; }
be_start(){ : > "$R/be.log"; ( cd "$R/mj/backend" && exec env NO_COLOR=1 node dist/main.js >> "$R/be.log" 2>&1 ) & echo $! > "$R/be.pid"
  for i in $(seq 1 60); do grep -q 'successfully started\|Error' "$R/be.log" && break; sleep 0.5; done; }
stop_all(){ be_stop; [ -d "$R/pg" ] && $B/pg_ctl -D "$R/pg" -m fast stop >/dev/null 2>&1; }
trap stop_all EXIT
echo postgres > "$R/pw"
$B/initdb -D "$R/pg" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$B/pg_ctl -D "$R/pg" -o "-p $PGP -k /tmp -c listen_addresses=localhost" -l "$R/pg.log" -w start >/dev/null
PGPASSWORD=postgres $B/psql -h localhost -p $PGP -U postgres -c "CREATE DATABASE maydon_jamoa" >/dev/null
SQL(){ PGPASSWORD=postgres $B/psql -h localhost -p $PGP -U postgres -d maydon_jamoa -c "$1" 2>&1; }
cd "$R" && git clone -q https://github.com/Azizbekcrypto/maydon-jamoa mj || exit 1
cd mj && git checkout -qf m13-dars-03-done && cd backend && npm ci --no-audit --no-fund >/dev/null 2>&1 && npx nest build >/dev/null 2>&1 || exit 1
KALIT=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
export DATABASE_URL="postgresql://postgres:postgres@localhost:$PGP/maydon_jamoa" JWT_SECRET="namuna-jwt-kalit-faqat-laptop-uchun-almashtiring" PORT=3000 TOLOV_KALITI="$KALIT"
J='Content-Type: application/json'
imzo(){ printf '%s' "$1" | node -e "const c=require('crypto');let d='';process.stdin.on('data',x=>d+=x).on('end',()=>console.log(c.createHmac('sha256',process.argv[1]).update(d).digest('hex')))" "$2"; }
hook(){ curl -s -w ' [HTTP %{http_code}]\n' -X POST localhost:3000/tolov/webhook -H "$J" "$@"; }

be_start
ROYXAT=$(curl -s -X POST localhost:3000/royxat -H "$J" -d '{"ism":"Ali","login":"ali","parol":"parol123"}'); OID=$(echo "$ROYXAT" | node -pe "JSON.parse(require('fs').readFileSync(0)).id")
{ git -C "$R/mj" log --oneline -1 | cut -c1-110; node -v; echo "TOLOV_KALITI: 64 belgili tasodifiy hex (qiymat yozilmaydi)"; echo "royxat → $ROYXAT"; grep -E 'successfully started' "$R/be.log" | sed -E 's/^\[Nest\] [0-9]+  - [^ ]+ [^ ]+ [AP]M +//'; } > "$OUT/00-versiyalar.txt"

# 01 — mashq sahifasi (HTML): sarlavha va to'rt tugma
{ echo "$ curl "localhost:3000/tolov-mashq?oyinchi=$OID&summa=10000""; curl -s "localhost:3000/tolov-mashq?oyinchi=$OID&summa=10000" | grep -oE '<h1>[^<]*</h1>|<p class="(test|nima)">.*</p>|<button[^>]*>[^<]*</button>' | sed -E 's/<[^>]+>//g'; } > "$OUT/01-mashq-sahifa.txt"

# 02–05 — mashq sahifasining to'rt tugmasi (sahifa POST /tolov-mashq/yubor ga yozadi; Backend imzolab o'z webhook'iga yuboradi)
n=2
for t in tolash ikki rad imzosiz; do
  { echo "\$ curl -X POST localhost:3000/tolov-mashq/yubor -d '{\"tur\":\"$t\",\"oyinchi\":$OID,\"summa\":10000}'   # «$t» tugmasi"; curl -s -X POST localhost:3000/tolov-mashq/yubor -H "$J" -d "{\"tur\":\"$t\",\"oyinchi\":$OID,\"summa\":10000}"; echo; } > "$OUT/0$n-tugma-$t.txt"; n=$((n+1)); sleep 1.1
done
{ echo '$ psql -c "SELECT tolov_raqami, oyinchi_id, summa, holat FROM tolovlar ORDER BY id;"'; SQL "SELECT tolov_raqami, oyinchi_id, summa, holat FROM tolovlar ORDER BY id;"; } > "$OUT/06-tolovlar.txt"

# 07 — soxta xabarlar: imzo yo'q / shakli noto'g'ri / boshqa kalit bilan / to'g'ri kalit, lekin tana boshqa
T='{"tolovRaqami":"soxta-1","holat":"tolandi","summa":10000,"oyinchiId":'"$OID"'}'
{ echo "# tana: $T"
  echo '$ curl … (X-Imzo yo'"'"'q)'; hook -d "$T"
  echo '$ curl … -H "X-Imzo: abc"'; hook -H "X-Imzo: abc" -d "$T"
  echo '$ curl … -H "X-Imzo: <boshqa kalit bilan imzo>"'; hook -H "X-Imzo: $(imzo "$T" boshqa-kalit)" -d "$T"
  T2='{"tolovRaqami":"soxta-1","holat":"tolandi","summa":1,"oyinchiId":'"$OID"'}'
  echo "\$ curl … -H \"X-Imzo: <to'g'ri kalit, summa 10000 bilan imzo>\" -d '$T2'   # summa o'zgartirildi"; hook -H "X-Imzo: $(imzo "$T" "$KALIT")" -d "$T2"
  echo '$ psql: soxta-1 yozildimi?'; SQL "SELECT count(*) FROM tolovlar WHERE tolov_raqami='soxta-1';"; } > "$OUT/07-soxta-imzo.txt"

# 08 — xom tana: imzo bir xil ma'noli, lekin boshqa yozilgan JSON (bo'sh joylar) — imzo matndan hisoblanadi
TA='{"tolovRaqami":"m-xom-1","holat":"tolandi","summa":10000,"oyinchiId":'"$OID"'}'
TB='{ "tolovRaqami": "m-xom-1", "holat": "tolandi", "summa": 10000, "oyinchiId": '"$OID"' }'
{ echo "# imzo shu matndan: $TA"; echo "# yuborilgan matn: $TB"; hook -H "X-Imzo: $(imzo "$TA" "$KALIT")" -d "$TB"
  echo "# xuddi o'sha matn yuborildi:"; hook -H "X-Imzo: $(imzo "$TA" "$KALIT")" -d "$TA"; } > "$OUT/08-xom-tana.txt"

# 09 — maydonlar (imzo to'g'ri, maydon xato) → 400
{ for BB in '{"tolovRaqami":"m-x2","holat":"ok","summa":10000,"oyinchiId":'"$OID"'}' '{"tolovRaqami":"m-x3","holat":"tolandi","summa":"10000","oyinchiId":'"$OID"'}' '{"tolovRaqami":"m-x4","holat":"tolandi","summa":10000,"oyinchiId":999}'; do
  echo "\$ … -d '$BB'"; hook -H "X-Imzo: $(imzo "$BB" "$KALIT")" -d "$BB"; done; } > "$OUT/09-maydonlar.txt"

# 10 — bir vaqtda ikki bir xil xabar (UNIQUE → ikkinchisi takror, 500 emas)
TC='{"tolovRaqami":"m-bir-vaqtda","holat":"tolandi","summa":10000,"oyinchiId":'"$OID"'}'; IC=$(imzo "$TC" "$KALIT")
{ echo "# ikki curl bir vaqtda: $TC"; ( hook -H "X-Imzo: $IC" -d "$TC" > "$R/c1" ) & P1=$!; ( hook -H "X-Imzo: $IC" -d "$TC" > "$R/c2" ) & P2=$!; wait $P1 $P2; cat "$R/c1" "$R/c2" | sort
  SQL "SELECT count(*) FROM tolovlar WHERE tolov_raqami='m-bir-vaqtda';"; } > "$OUT/10-bir-vaqtda.txt"

# 11 — .env da TOLOV_KALITI bo'sh (sinf holati): «To'lash» ham 401
be_stop; TOLOV_KALITI= be_start
{ echo "# TOLOV_KALITI= (bo'sh) bilan Backend"; echo '$ … tolov-mashq/yubor {"tur":"tolash"}'; curl -s -X POST localhost:3000/tolov-mashq/yubor -H "$J" -d '{"tur":"tolash","oyinchi":'"$OID"',"summa":10000}'; echo; } > "$OUT/11-kalitsiz.txt"
be_stop

# 12 — main.ts da rawBody: true unutilgan: haqiqiy «To'lash» ham 401
cp src/main.ts "$R/main.ts.asl"; sed -i 's/NestFactory.create(AppModule, { rawBody: true })/NestFactory.create(AppModule)/' src/main.ts; npx nest build >/dev/null 2>&1; be_start
{ echo "# src/main.ts: NestFactory.create(AppModule) — rawBody yo'q"; grep -n "NestFactory.create" src/main.ts; echo '$ … tolov-mashq/yubor {"tur":"tolash"}'; curl -s -X POST localhost:3000/tolov-mashq/yubor -H "$J" -d '{"tur":"tolash","oyinchi":'"$OID"',"summa":10000}'; echo; } > "$OUT/12-rawbody-yoq.txt"
be_stop; cp "$R/main.ts.asl" src/main.ts

# 13 — imzo tekshiruvi YOZUVDAN KEYIN (tartib buzilgan): imzosiz xabar 401 oladi, lekin jadvalga yozilib bo'ladi
cp src/tolov/tolov.controller.ts "$R/ctrl.asl"
python3 - <<'PY'
p='src/tolov/tolov.controller.ts'; s=open(p).read()
a='    if (!imzoTogrimi(sorov.rawBody, imzo)) throw new UnauthorizedException("Imzo mos emas");\n\n'
assert a in s; s=s.replace(a,'',1)
b='    return { ok: true };\n'
assert b in s; s=s.replace(b,'    if (!imzoTogrimi(sorov.rawBody, imzo)) throw new UnauthorizedException("Imzo mos emas");\n    return { ok: true };\n',1)
open(p,'w').write(s)
PY
npx nest build >/dev/null 2>&1; be_start
{ echo "# tolov.controller.ts — imzo tekshiruvi insert'dan keyin:"; sed -n '/async webhook/,/^  }/p' src/tolov/tolov.controller.ts
  echo; echo '$ … tolov-mashq/yubor {"tur":"imzosiz"}'; curl -s -X POST localhost:3000/tolov-mashq/yubor -H "$J" -d '{"tur":"imzosiz","oyinchi":'"$OID"',"summa":10000}'; echo
  echo '$ psql: oxirgi qator'; SQL "SELECT tolov_raqami, holat FROM tolovlar ORDER BY id DESC LIMIT 1;"; } > "$OUT/13-tartib-buzilgan.txt"
be_stop; cp "$R/ctrl.asl" src/tolov/tolov.controller.ts
echo done
