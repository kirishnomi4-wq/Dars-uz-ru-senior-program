#!/usr/bin/env bash
# TgPg MD v2 «KOD 3–8» — haqiqiy yurgizishlar (04.11). Tizimga tegmaydi: PG18 klasteri :5437 (scratchpad), mongod :27021 vaqtinchalik.
# ISHLATISH: S=<scratchpad> bash drive-orderbot-kod.sh → manba/orderbot-out/12-*.txt
set -u
S=${S:?S=scratchpad kerak}; M=$(cd "$(dirname "$0")" && pwd); OUT=$M/orderbot-out; P=/home/kali/Desktop/order-bot
B=/usr/lib/postgresql/18/bin; export PGPASSWORD=parol LC_MESSAGES=C LANG=C.UTF-8 PAGER=cat PSQL_PAGER=cat
PSQL="$B/psql -h localhost -p 5437 -U postgres"
W=$S/kod; rm -rf $W; mkdir -p $W
newdb() { $PSQL -d postgres -qc "DROP DATABASE IF EXISTS $1 WITH (FORCE)" -c "CREATE DATABASE $1 TEMPLATE template0" 2>&1 | grep -v NOTICE; }
mk() { rm -rf $W/$1; mkdir -p $W/$1; git -C $P archive $2 | tar -x -C $W/$1; ln -s $P/node_modules $W/$1/node_modules; }

# ---- KOD 3: tgpg-start restartdan keyin Kolonka qoldig'i; tgpg-done telefon so'ralganda state ----
mk start tgpg-start; (cd $W/start && npx nest build >/dev/null 2>&1)
cat > $W/k3.cjs <<'JS'
const path = require('path'); const P = process.argv[2]; const req = (m) => require(require.resolve(m, { paths: [P] }));
process.env.BOT_TOKEN = '1:x'; process.env.ADMIN_TELEGRAM_IDS = '111';
const { Telegraf, Telegram } = req('telegraf'); Telegraf.prototype.launch = async () => {}; const box = [];
Telegram.prototype.callApi = async (m, p = {}) => { if (p.text) box.push(String(p.text)); return { message_id: 1, chat: { id: p.chat_id }, date: 0 }; };
const { NestFactory } = req('@nestjs/core'); let u = 1;
const boot = async () => { const app = await NestFactory.createApplicationContext(require(path.join(P, 'dist/api/app.module')).AppModule, { logger: false });
  const bot = app.get(require(path.join(P, 'dist/api/telegram/telegram.service')).TelegramService).bot;
  const cat = app.get(require(path.join(P, 'dist/api/catalog/catalog.service')).CatalogService);
  const from = { id: 5123456789, is_bot: false, first_name: 'Aziza' }, chat = { id: 5123456789, type: 'private' };
  const say = (t) => bot.handleUpdate({ update_id: u++, message: { message_id: u, from, chat, date: 0, text: t, entities: t[0] === '/' ? [{ type: 'bot_command', offset: 0, length: t.length }] : undefined } });
  const tap = (d) => bot.handleUpdate({ update_id: u++, callback_query: { id: String(u), from, chat_instance: '1', data: d, message: { message_id: 1, chat, date: 0, text: '.' } } });
  return { app, say, tap, cat }; };
(async () => { let x = await boot(); await x.say('/start'); await x.tap('add:4'); await x.tap('add:4'); await x.tap('checkout'); await x.say('+998901234567');
  console.log('1-jarayon: ' + box[box.length - 2].split('\n')[0] + ' · Kolonka stock = ' + (await x.cat.find(4)).stock); await x.app.close();
  x = await boot(); console.log('restartdan keyin: Kolonka stock = ' + (await x.cat.find(4)).stock); await x.app.close(); process.exit(0); })();
JS
node $W/k3.cjs $W/start > $OUT/12-k3-stock-restart.txt 2>&1; cat $OUT/12-k3-stock-restart.txt

# ---- KOD 4: xato chiqishlari (OrderBotNest tgpg-done) ----
mk done tgpg-done; (cd $W/done && npx nest build >/dev/null 2>&1)
newdb shop_k4
{
echo '$ npm run start   # .env yo'"'"'q'; (cd $W/done && env -i PATH=$PATH HOME=$HOME timeout 25 node dist/main 2>&1 | grep -E "Error|topilmadi" | head -2)
echo; echo '$ npm run start   # DATABASE_URL bor, BOT_TOKEN yo'"'"'q'; (cd $W/done && env -i PATH=$PATH HOME=$HOME DATABASE_URL=postgresql://postgres:parol@localhost:5437/shop_k4 timeout 25 node dist/main 2>&1 | grep -E "Error|topilmadi" | head -2)
echo; echo '$ npm run start   # baza yo'"'"'q: .../shop_yoq'; (cd $W/done && env -i PATH=$PATH HOME=$HOME BOT_TOKEN=1:x DATABASE_URL=postgresql://postgres:parol@localhost:5437/shop_yoq timeout 25 node dist/main 2>&1 | grep -iE "error|does not exist" | head -2)
echo; echo '$ npm run start   # parol xato'; (cd $W/done && env -i PATH=$PATH HOME=$HOME BOT_TOKEN=1:x DATABASE_URL=postgresql://postgres:xato@localhost:5437/shop_k4 timeout 25 node dist/main 2>&1 | grep -iE "error|password" | head -2)
} > $OUT/12-k4-xatolar.txt 2>&1
# 401 — haqiqiy Telegram'ga bitta getMe (soxta token)
{ echo '$ npm run start   # BOT_TOKEN=123:SOXTA (haqiqiy Telegram serveri)'; (cd $W/done && env -i PATH=$PATH HOME=$HOME BOT_TOKEN=123:SOXTA ADMIN_TELEGRAM_IDS=111 DATABASE_URL=postgresql://postgres:parol@localhost:5437/shop_k4 PORT=3021 timeout 25 node dist/main 2>&1 | grep -vE "^\[Nest\]|LOG" | head -4); } > $OUT/12-k4-401.txt 2>&1
# INTEGER ustun: migratsiyada BIGINT → INTEGER
newdb shop_k4i; mk int tgpg-done; sed -i 's/"telegram_id" BIGINT NOT NULL UNIQUE/"telegram_id" INTEGER NOT NULL UNIQUE/' $W/int/src/infrastructure/migrations/1762200000000-init.ts; (cd $W/int && npx nest build >/dev/null 2>&1)
cat > $W/k4i.cjs <<'JS'
const path = require('path'); const P = process.argv[2]; const req = (m) => require(require.resolve(m, { paths: [P] }));
process.env.BOT_TOKEN = '1:x'; const { Telegraf, Telegram } = req('telegraf'); Telegraf.prototype.launch = async () => {}; const box = [];
Telegram.prototype.callApi = async (m, p = {}) => { if (p.text) box.push(String(p.text)); return { message_id: 1, chat: { id: p.chat_id }, date: 0 }; };
const { NestFactory } = req('@nestjs/core');
(async () => { const app = await NestFactory.createApplicationContext(require(path.join(P, 'dist/api/app.module')).AppModule, { logger: false });
  const bot = app.get(require(path.join(P, 'dist/api/telegram/telegram.service')).TelegramService).bot; const origErr = console.error; console.error = (...a) => console.log('terminal:', ...a.map(String));
  for (const id of [111, 5123456789]) { box.length = 0; await bot.handleUpdate({ update_id: id % 1000, message: { message_id: 1, from: { id, is_bot: false, first_name: 'U' }, chat: { id, type: 'private' }, date: 0, text: '/start', entities: [{ type: 'bot_command', offset: 0, length: 6 }] } });
    console.log(`/start (id ${id}) → bot: ${box[0] ? box[0].split('\n')[0] : '(javob yo\'q)'}`); }
  await app.close(); process.exit(0); })();
JS
DATABASE_URL=postgresql://postgres:parol@localhost:5437/shop_k4i node $W/k4i.cjs $W/int > $OUT/12-k4-integer.txt 2>&1; cat $OUT/12-k4-integer.txt
(cd $W/done && sed -i 's/"seed": "[^"]*",//' package.json && npm run seed 2>&1 | head -3) > $OUT/12-k4-seed-yoq.txt 2>&1

# ---- KOD 6: ikki marta tez bosish (pg, haqiqiy parallel) ----
newdb shop_k6
cat > $W/k6.cjs <<'JS'
const { Pool } = require(require.resolve('pg', { paths: [process.argv[2]] }));
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const q = (s, p) => pool.query(s, p);
(async () => {
  await q(`CREATE TABLE c1 (id SERIAL PRIMARY KEY, user_id INT, product_id INT, qty INT)`);
  await q(`CREATE TABLE c2 (id SERIAL PRIMARY KEY, user_id INT, product_id INT, qty INT, UNIQUE (user_id, product_id))`);
  const naive = async (t) => { const r = await q(`SELECT id FROM ${t} WHERE user_id = 1 AND product_id = 2`); if (r.rowCount) await q(`UPDATE ${t} SET qty = qty + 1 WHERE id = $1`, [r.rows[0].id]); else await q(`INSERT INTO ${t} (user_id, product_id, qty) VALUES (1, 2, 1)`); };
  console.log('--- avval SELECT, keyin INSERT — UNIQUE yo\'q, ikki bosish bir vaqtda');
  await Promise.all([naive('c1'), naive('c1')]); console.log(JSON.stringify((await q('SELECT user_id, product_id, qty FROM c1')).rows));
  console.log('--- avval SELECT, keyin INSERT — UNIQUE bor');
  const r = await Promise.allSettled([naive('c2'), naive('c2')]); r.forEach((x) => console.log(x.status === 'fulfilled' ? 'ok' : 'ERROR: ' + x.reason.message)); console.log(JSON.stringify((await q('SELECT user_id, product_id, qty FROM c2')).rows));
  await q('DELETE FROM c2');
  console.log('--- INSERT … ON CONFLICT (user_id, product_id) DO UPDATE SET qty = c2.qty + 1');
  const up = () => q(`INSERT INTO c2 (user_id, product_id, qty) VALUES (1, 2, 1) ON CONFLICT (user_id, product_id) DO UPDATE SET qty = c2.qty + 1 RETURNING qty`);
  const rr = await Promise.all([up(), up()]); console.log('RETURNING qty: ' + rr.map((x) => x.rows[0].qty).join(', ')); console.log(JSON.stringify((await q('SELECT user_id, product_id, qty FROM c2')).rows));
  await pool.end(); })();
JS
DATABASE_URL=postgresql://postgres:parol@localhost:5437/shop_k6 node $W/k6.cjs $P > $OUT/12-k6-ikki-bosish.txt 2>&1; cat $OUT/12-k6-ikki-bosish.txt

# ---- KOD 7: "111" === 111 — tsc ----
mk eq tgpg-done; python3 - $W/eq/src/api/telegram/telegram.service.ts <<'PY'
import sys, pathlib; f = pathlib.Path(sys.argv[1]); t = f.read_text()
t = t.replace("if (user.role !== 'admin') return ctx.reply(texts.adminOnly);\n      const list", "if (user.telegram_id !== 111) return ctx.reply(texts.adminOnly);\n      const list", 1); f.write_text(t)
PY
{ echo '$ npx tsc --noEmit   # if (user.telegram_id !== 111) — telegram_id: string'; (cd $W/eq && npx tsc --noEmit -p tsconfig.json 2>&1 | head -3); echo; echo '$ npx nest build'; (cd $W/eq && npx nest build 2>&1 | tail -n 3; ls dist/main.js 2>/dev/null && echo "(dist yaratildi)"); } > $OUT/12-k7-tenglik.txt 2>&1; cat $OUT/12-k7-tenglik.txt

# ---- KOD 8: trigger — order_items'ga yozishda xato → ROLLBACK ----
newdb shop_k8
cat > $W/k8.cjs <<'JS'
const path = require('path'); const P = process.argv[2]; const req = (m) => require(require.resolve(m, { paths: [P] }));
process.env.BOT_TOKEN = '1:x'; const { Telegraf, Telegram } = req('telegraf'); Telegraf.prototype.launch = async () => {}; const box = [];
Telegram.prototype.callApi = async (m, p = {}) => { if (p.text) box.push(String(p.text)); return { message_id: 1, chat: { id: p.chat_id }, date: 0 }; };
const { NestFactory } = req('@nestjs/core'); const { Client } = req('pg');
(async () => { const app = await NestFactory.createApplicationContext(require(path.join(P, 'dist/api/app.module')).AppModule, { logger: false });
  const bot = app.get(require(path.join(P, 'dist/api/telegram/telegram.service')).TelegramService).bot;
  const db = new Client({ connectionString: process.env.DATABASE_URL }); await db.connect(); const q = async (s) => (await db.query(s)).rows;
  const from = { id: 5123456789, is_bot: false, first_name: 'Aziza' }, chat = { id: 5123456789, type: 'private' }; let u = 1;
  const say = (t) => bot.handleUpdate({ update_id: u++, message: { message_id: u, from, chat, date: 0, text: t, entities: t[0] === '/' ? [{ type: 'bot_command', offset: 0, length: t.length }] : undefined } });
  const tap = (d) => bot.handleUpdate({ update_id: u++, callback_query: { id: String(u), from, chat_instance: '1', data: d, message: { message_id: 1, chat, date: 0, text: '.' } } });
  await say('/start'); await q(`UPDATE users SET phone = '+998901234567'`); await tap('add:1'); await tap('add:4');
  await q(`CREATE FUNCTION sinov_xato() RETURNS trigger AS $$ BEGIN RAISE EXCEPTION 'SINOV: order_items yozilmadi'; END $$ LANGUAGE plpgsql`);
  await q(`CREATE TRIGGER sinov BEFORE INSERT ON order_items FOR EACH ROW EXECUTE FUNCTION sinov_xato()`);
  const show = async (t) => console.log(t + ' · products ' + JSON.stringify(await q(`SELECT name, stock FROM products WHERE id IN (1,4) ORDER BY id`)) + ' · orders ' + (await q('SELECT count(*)::int n FROM orders'))[0].n + ' · cart_items ' + (await q('SELECT count(*)::int n FROM cart_items'))[0].n);
  await show('oldin   '); box.length = 0; await tap('checkout'); console.log('bot: ' + box[box.length - 1]); await show('keyin   ');
  await q('DROP TRIGGER sinov ON order_items'); box.length = 0; await tap('checkout'); console.log('trigger olib tashlandi → bot: ' + box[box.length - 1].split('\n')[0]); await show('keyin-2 ');
  await db.end(); await app.close(); process.exit(0); })();
JS
(cd $W/done && git -C $P show tgpg-done:package.json > package.json && DATABASE_URL=postgresql://postgres:parol@localhost:5437/shop_k8 npm run -s seed >/dev/null 2>&1); DATABASE_URL=postgresql://postgres:parol@localhost:5437/shop_k8 node $W/k8.cjs $W/done > $OUT/12-k8-trigger-rollback.txt 2>&1; cat $OUT/12-k8-trigger-rollback.txt
