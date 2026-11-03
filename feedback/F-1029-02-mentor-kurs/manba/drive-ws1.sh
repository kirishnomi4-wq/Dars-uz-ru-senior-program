#!/usr/bin/env bash
# WebSocket-1 mentor darsi — haqiqiy chiqishlar (F-1029-02, 01.11 avtopilot). Natija: manba/ws1-out/NN-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-ws1.sh
# O'quvchi loyihasi maydon-jamoa (m12-dars-02-done): backend (NestJS 12 + socket.io gateway) — HAQIQIY, lokal PostgreSQL bilan.
# Ilova (Expo) o'rniga — Node'dagi socket.io-client (ilovadagi ulanish.ts bilan bir xil: io(API, { auth: { token } }) va holat qoidasi).
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/ws1-out"
R="${S:?S=scratchpad kerak}/ws1-run"
B=$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)
PGP=5448; API_PORT=3456
mkdir -p "$OUT"; rm -rf "$R"; mkdir -p "$R/klient"
stop_all(){ [ -f "$R/be.pid" ] && kill "$(cat "$R/be.pid")" 2>/dev/null; [ -d "$R/pg" ] && $B/pg_ctl -D "$R/pg" -m fast stop >/dev/null 2>&1; }
trap stop_all EXIT
echo postgres > "$R/pw"
$B/initdb -D "$R/pg" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$B/pg_ctl -D "$R/pg" -o "-p $PGP -k /tmp -c listen_addresses=localhost" -l "$R/pg.log" -w start >/dev/null
PGPASSWORD=postgres $B/psql -h localhost -p $PGP -U postgres -c "CREATE DATABASE maydon_jamoa" >/dev/null
cd "$R" && git clone -q https://github.com/Azizbekcrypto/maydon-jamoa mj && cd mj && git checkout -q m12-dars-02-done
cd backend && npm ci --no-audit --no-fund >/dev/null 2>&1 && npx nest build >/dev/null 2>&1
export DATABASE_URL="postgresql://postgres:postgres@localhost:$PGP/maydon_jamoa" JWT_SECRET="namuna-jwt-kalit-faqat-laptop-uchun-almashtiring" PORT=$API_PORT
be_start(){ ( exec env NO_COLOR=1 node dist/main.js >> "$R/be.log" 2>&1 ) & echo $! > "$R/be.pid"; for i in $(seq 1 60); do curl -s -o /dev/null "http://localhost:$API_PORT/" && return 0; sleep 0.5; done; return 1; }
be_stop(){ kill "$(cat "$R/be.pid")" 2>/dev/null; sleep 1; }
be_start
{ git -C .. log --oneline -1; node --version; node -p "'@nestjs/websockets ' + require('./node_modules/@nestjs/websockets/package.json').version"; node -p "'socket.io ' + require('./node_modules/socket.io/package.json').version"; date; } > "$OUT/00-versiyalar.txt"

# 01 ro'yxat, kirish va oddiy so'rov (11-Modul usuli: so'ramasa yangilanmaydi)
H='Content-Type: application/json'
{ echo '$ curl -X POST /royxat {"ism":"Ali","telefon":"+998 90 000 00 01","parol":"parol123"}'; curl -s -w ' [HTTP %{http_code}]\n' -X POST -H "$H" -d '{"ism":"Ali","telefon":"+998 90 000 00 01","parol":"parol123"}' "http://localhost:$API_PORT/royxat"
  curl -s -X POST -H "$H" -d '{"ism":"Vali","telefon":"+998 90 000 00 02","parol":"parol123"}' "http://localhost:$API_PORT/royxat" >/dev/null
  echo '$ curl -X POST /kirish {"telefon":"+998 90 000 00 01","parol":"parol123"}'; curl -s -w ' [HTTP %{http_code}]\n' -X POST -H "$H" -d '{"telefon":"+998 90 000 00 01","parol":"parol123"}' "http://localhost:$API_PORT/kirish" | sed -E 's/("token":")[^"]{20}[^"]*/\1eyJ…(qisqartirildi)/'; } > "$OUT/01-royxat-kirish.txt"
TOKEN=$(curl -s -X POST -H "$H" -d '{"telefon":"+998 90 000 00 01","parol":"parol123"}' "http://localhost:$API_PORT/kirish" | node -pe "JSON.parse(require('fs').readFileSync(0)).token")
TOKEN2=$(curl -s -X POST -H "$H" -d '{"telefon":"+998 90 000 00 02","parol":"parol123"}' "http://localhost:$API_PORT/kirish" | node -pe "JSON.parse(require('fs').readFileSync(0)).token")
export TOKEN TOKEN2 API="http://localhost:$API_PORT"

# Klient — ilovadagi ulanish.ts qoidasi bilan: connect → ulangan; disconnect/connect_error → active ? ulanmoqda : ulanmagan
cd "$R/klient" && npm init -y >/dev/null && npm install --no-audit --no-fund socket.io-client@4 >/dev/null 2>&1
cat > klient.js <<'JS'
const { io } = require('socket.io-client');
const t0 = Date.now(); const vaqt = () => ((Date.now() - t0) / 1000).toFixed(1).padStart(4) + 's';
function ulan(nom, token, opts = {}) {
  const u = io(process.env.API, { auth: token === undefined ? {} : { token }, ...opts });
  const holat = (h, s) => console.log(`${vaqt()}  [${nom}] ${h}${s ? '  (' + s + ')' : ''}`);
  holat('ulanmoqda', 'io() chaqirildi');
  u.on('connect', () => { holat('ulangan', 'connect'); setTimeout(() => u.connected && console.log(`${vaqt()}  [${nom}] transport: ${u.io.engine.transport.name}`), 500); });
  u.on('disconnect', (r) => holat(u.active ? 'ulanmoqda' : 'ulanmagan', `disconnect: ${r} · active=${u.active}`));
  u.on('connect_error', (e) => holat(u.active ? 'ulanmoqda' : 'ulanmagan', `connect_error: ${e.message} · active=${u.active}`));
  u.on('oyin-ozgardi', (d) => console.log(`${vaqt()}  [${nom}] HODISA oyin-ozgardi ${JSON.stringify(d)}`));
  return u;
}
module.exports = { ulan, vaqt };
JS
cat > tokensiz.js <<'JS'
const { ulan } = require('./klient');
const a = ulan('tokensiz', undefined); const b = ulan('soxta token', 'abc.def.ghi');
setTimeout(() => { a.close(); b.close(); process.exit(0); }, 3000);
JS
cat > tokenli.js <<'JS'
const { ulan } = require('./klient');
const u = ulan('Ali', process.env.TOKEN);
setTimeout(() => { u.close(); process.exit(0); }, 2500);
JS
# 02 tokensiz va soxta token — Backend ulanishni yopadi
{ echo '$ node tokensiz.js'; node tokensiz.js 2>&1; } > "$OUT/02-tokensiz-soxta.txt"
# 03 token bilan — ulangan, transport websocket; Backend logi
: > "$R/be.log"; { echo '$ node tokenli.js'; node tokenli.js 2>&1; sleep 0.5; echo; echo '# Backend terminali:'; grep -E "Ulanish|ulandi|uzildi" "$R/be.log" | sed -E 's/^\[Nest\] [0-9]+  - [^ ]+ [^ ]+ [AP]M +//'; } > "$OUT/03-token-bilan.txt"

# 04 Backend to'xtadi va qayta yondi — ilova o'zi qayta ulanadi
cat > uzilish.js <<'JS'
const { ulan, vaqt } = require('./klient');
const u = ulan('Ali', process.env.TOKEN, { reconnectionDelayMax: 2000 });
process.on('SIGUSR1', () => console.log(`${vaqt()}  --- Backend to'xtatildi ---`));
process.on('SIGUSR2', () => console.log(`${vaqt()}  --- Backend qayta yoqildi ---`));
setTimeout(() => { u.close(); process.exit(0); }, 14000);
JS
cd "$R/klient"; ( node uzilish.js > "$R/uz.txt" 2>&1 ) & KP=$!; sleep 3
cd "$R/mj/backend"; kill -USR1 $KP; be_stop; sleep 4; be_start; kill -USR2 $KP; wait $KP
{ echo '$ node uzilish.js   # 3 s da Backend to'"'"'xtatildi, ~4 s dan keyin qayta yoqildi'; cat "$R/uz.txt"; } > "$OUT/04-uzilish-qayta-ulanish.txt"

cd "$R/klient"
# 05 ikkinchi akkaunt o'yinga qo'shildi — Ali'ga hodisa kelmaydi (m12-dars-02: hodisa hali yuborilmaydi); Ali o'zi so'rasa — yangi son
cat > hodisa-yoq.js <<'JS'
const { ulan, vaqt } = require('./klient');
const u = ulan('Ali', process.env.TOKEN);
const sora = async (izoh) => { const r = await fetch(process.env.API + '/oyinlar', { headers: { Authorization: 'Bearer ' + process.env.TOKEN } }); const o = (await r.json()).find((x) => x.kerak === 10 && x.qoshilgan >= 8); console.log(`${vaqt()}  [Ali] GET /oyinlar (${izoh}) → ${o.maydon} ${o.kun} ${o.soat}: ${o.qoshilgan} / ${o.kerak}`); return o; };
(async () => {
  await new Promise((r) => setTimeout(r, 1000));
  const o = await sora('ochilganda');
  const res = await fetch(`${process.env.API}/oyinlar/${o.id}/qoshilish`, { method: 'POST', headers: { Authorization: 'Bearer ' + process.env.TOKEN2 } });
  console.log(`${vaqt()}  [Vali] POST /oyinlar/${o.id}/qoshilish → ${res.status}`);
  await new Promise((r) => setTimeout(r, 2500));
  console.log(`${vaqt()}  [Ali] 2,5 s kutdi — hodisa kelmadi, ekrandagi son o'zgarmadi`);
  await sora('pastga tortildi');
  u.close(); process.exit(0);
})();
JS
cd "$R/klient"; { echo '$ node hodisa-yoq.js'; node hodisa-yoq.js 2>&1; } > "$OUT/05-hodisa-yoq.txt"

# 06 m12-dars-03-done: hodisa yuboriladi — Vali qo'shilsa, Ali'ga oyin-ozgardi keladi va u qayta so'raydi
cd "$R/mj/backend"; be_stop; git -C .. checkout -q m12-dars-03-done && npm ci --no-audit --no-fund >/dev/null 2>&1 && npx nest build >/dev/null 2>&1; be_start
cd "$R/klient"
cat > hodisa-bor.js <<'JS'
const { ulan, vaqt } = require('./klient');
const H = (t) => ({ headers: { Authorization: 'Bearer ' + t } });
const sora = async (izoh, id) => { const o = (await (await fetch(process.env.API + '/oyinlar', H(process.env.TOKEN))).json()).find((x) => (id ? x.id === id : x.kerak === 10 && x.qoshilgan < 10)); console.log(`${vaqt()}  [Ali] GET /oyinlar (${izoh}) → ${o.maydon} ${o.kun} ${o.soat}: ${o.qoshilgan} / ${o.kerak}`); return o; };
const u = ulan('Ali', process.env.TOKEN);
let oyin;
u.on('oyin-ozgardi', (d) => { if (oyin && d.oyinId === oyin.id) sora('hodisa kelgach', oyin.id); });
(async () => {
  await new Promise((r) => setTimeout(r, 1000));
  oyin = await sora('ochilganda');
  const res = await fetch(`${process.env.API}/oyinlar/${oyin.id}/qoshilish`, { method: 'POST', ...H(process.env.TOKEN2) });
  console.log(`${vaqt()}  [Vali] POST /oyinlar/${oyin.id}/qoshilish → ${res.status}`);
  await new Promise((r) => setTimeout(r, 1500));
  u.close(); process.exit(0);
})();
JS
{ git -C "$R/mj" log --oneline -1 | cut -c1-90; echo '$ node hodisa-bor.js'; node hodisa-bor.js 2>&1; } > "$OUT/06-hodisa-bor-m12-03.txt"

# 07 «uchish rejimi»: Backend jarayoni muzlatiladi (SIGSTOP) — TCP yopilmaydi, javob kelmaydi; klient uzilishni qachon sezadi (socket.io ping)
cd "$R/klient"
cat > muzlash.js <<'JS'
const { ulan, vaqt } = require('./klient');
const u = ulan('Ali', process.env.TOKEN);
process.on('SIGUSR1', () => console.log(`${vaqt()}  --- Backend muzlatildi (javob bermaydi, ulanish yopilmagan) ---`));
process.on('SIGUSR2', () => console.log(`${vaqt()}  --- Backend davom etdi ---`));
setTimeout(() => { u.close(); process.exit(0); }, 75000);
JS
( node muzlash.js > "$R/muz.txt" 2>&1 ) & KP=$!; sleep 3
kill -USR1 $KP; kill -STOP "$(cat "$R/be.pid")"; sleep 60; kill -CONT "$(cat "$R/be.pid")"; kill -USR2 $KP; wait $KP
{ echo '$ node muzlash.js   # 3 s da Backend muzlatildi (SIGSTOP), 60 s dan keyin davom etdi (SIGCONT)'; cat "$R/muz.txt"; } > "$OUT/07-muzlash-ping.txt"

# 08 gateway'da disconnect() dan keyin return unutildi — tokensiz ulanish: Backend «ulandi: o'yinchi null» yozadi
cd "$R/mj/backend"; be_stop
python3 - <<'PY'
p='src/oyinlar.gateway.ts'; s=open(p).read()
a="      ulanish.disconnect();\n      return;\n"
assert a in s; open(p,'w').write(s.replace(a,"      ulanish.disconnect();\n",1))
PY
{ echo '# src/oyinlar.gateway.ts — handleConnection (return olib tashlandi):'; sed -n '/handleConnection/,/^  }/p' src/oyinlar.gateway.ts; } > "$OUT/08-return-yoq.txt"
npx nest build >/dev/null 2>&1; : > "$R/be.log"; be_start
cd "$R/klient"; { echo; echo '$ node tokensiz.js'; node tokensiz.js 2>&1; sleep 0.5; echo; echo '# Backend terminali:'; grep -E "Ulanish" "$R/be.log" | sed -E 's/^\[Nest\] [0-9]+  - [^ ]+ [^ ]+ [AP]M +//'; } >> "$OUT/08-return-yoq.txt"
cd "$R/mj/backend"; be_stop; git checkout -q -- src/oyinlar.gateway.ts; npx nest build >/dev/null 2>&1; be_start
echo "[$(date +%T)] tayyor: $(ls "$OUT" | wc -l) fayl → $OUT"
