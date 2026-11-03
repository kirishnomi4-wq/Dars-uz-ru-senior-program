#!/usr/bin/env bash
# Telegraf + PostgreSQL mentor darsi — haqiqiy chiqishlar (F-1029-02, 01.11 avtopilot). Natija: manba/tgpg-out/NN-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-tgpg.sh
# Usul: HAQIQIY Telegraf (npm) va HAQIQIY PostgreSQL (vaqtinchalik klaster). Telegram serveri ishlatilmaydi:
# xabar — bot.handleUpdate(update) bilan beriladi, botning javobi — bot.telegram.callApi ushlab olinadi (token soxta, tarmoq yo'q).
# Ya'ni handler, ctx.chat.id, SQL, qayta ishga tushirish — haqiqiy; Telegram ilovasidagi ko'rinish — yo'q (⚠ maket).
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/tgpg-out"
R="${S:?S=scratchpad kerak}/tgpg-run"
B=$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)
PORT=5447
mkdir -p "$OUT"; rm -rf "$R"; mkdir -p "$R/bot"
CLEAN=(env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 FORCE_COLOR=0)
run(){ echo "\$ $*"; "${CLEAN[@]}" "$@" 2>&1; echo "[chiqish kodi: $?]"; echo; }
stop_all(){ [ -d "$R/pg" ] && $B/pg_ctl -D "$R/pg" -m fast stop >/dev/null 2>&1; }
trap stop_all EXIT
echo password > "$R/pw"
$B/initdb -D "$R/pg" -U postgres --pwfile="$R/pw" --auth=scram-sha-256 --encoding=UTF8 --locale=C.UTF-8 >/dev/null 2>&1
$B/pg_ctl -D "$R/pg" -o "-p $PORT -k /tmp -c listen_addresses=localhost" -l "$R/pg.log" -w start >/dev/null
export PGPASSWORD=password
psql_(){ $B/psql -h localhost -p $PORT -U postgres "$@"; }
psql_ -c "CREATE DATABASE botdb" >/dev/null
cd "$R/bot"
npm init -y >/dev/null; npm install --no-audit --no-fund telegraf pg >/dev/null 2>&1
{ node --version; for p in telegraf pg; do echo "$p $(node -p "JSON.parse(require('fs').readFileSync('node_modules/$p/package.json')).version")"; done; $B/postgres --version; date; } > "$OUT/00-versiyalar.txt"

# Soxta Telegram: update yasash va javobni ushlash (har skript shu yordamchini ishlatadi)
cat > sinov.js <<'JS'
const { Telegraf, Telegram } = require('telegraf');
// Telegraf har update uchun yangi Telegram obyekti yaratadi — shuning uchun prototipda ushlaymiz (tarmoqqa hech narsa ketmaydi)
Telegram.prototype.callApi = async function (method, payload) { console.log(`  bot → ${payload.chat_id}: ${payload.text}`); return { message_id: 1 }; };
function yangiBot() {
  const bot = new Telegraf('123:SOXTA');
  bot.botInfo = { id: 1, is_bot: true, first_name: 'AvtoPizza', username: 'avtopizza_bot' };
  return bot;
}
let uid = 1;
async function yoz(bot, chatId, ism, text) {
  console.log(`${ism} (${chatId}): ${text}`);
  const message = { message_id: uid++, date: 0, chat: { id: chatId, type: 'private' }, from: { id: chatId, is_bot: false, first_name: ism }, text };
  if (text.startsWith('/')) message.entities = [{ type: 'bot_command', offset: 0, length: text.split(' ')[0].length }];
  await bot.handleUpdate({ update_id: uid, message });
}
module.exports = { yangiBot, yoz };
JS

# 01 holatsiz bot: har xabar alohida (o'quvchi darsi s0/s2 suhbati)
cat > holatsiz.js <<'JS'
const { yangiBot, yoz } = require('./sinov');
const bot = yangiBot();
bot.hears(/pitsa/i, (ctx) => ctx.reply('Ajoyib! Qaysi pitsa?'));
bot.on('text', (ctx) => ctx.reply(`Nima «${ctx.message.text}»? Tushunmadim.`));
(async () => {
  await yoz(bot, 5123456789, 'Aziza', 'Pitsa buyurtma qilaman');
  await yoz(bot, 5123456789, 'Aziza', 'Pepperoni');
})();
JS
{ echo '$ node holatsiz.js'; node holatsiz.js 2>&1; } > "$OUT/01-holatsiz.txt"

# 02 holat dastur xotirasida (obyekt) — ishlaydi; qayta ishga tushsa yo'qoladi (ikki alohida jarayon)
cat > xotira.js <<'JS'
const { yangiBot, yoz } = require('./sinov');
const holat = {}; // har chatning holati — oddiy obyektda (RAM)
const bot = yangiBot();
bot.on('text', (ctx) => {
  const id = ctx.chat.id, t = ctx.message.text;
  if (!holat[id]) { holat[id] = 'PITSA_KUTYAPMAN'; return ctx.reply('Salom! Qaysi pitsa?'); }
  if (holat[id] === 'PITSA_KUTYAPMAN') { holat[id] = 'OLCHAM_KUTYAPMAN'; return ctx.reply(`${t} — yaxshi tanlov! Qaysi o'lchamda?`); }
  if (holat[id] === 'OLCHAM_KUTYAPMAN') { holat[id] = 'MANZIL_KUTYAPMAN'; return ctx.reply('Manzilni yuboring.'); }
  return ctx.reply(`(holat: ${holat[id]})`);
});
(async () => {
  const qism = process.argv[2];
  if (qism === '1') { await yoz(bot, 5123456789, 'Aziza', 'Salom'); await yoz(bot, 5123456789, 'Aziza', 'Pepperoni'); }
  else { await yoz(bot, 5123456789, 'Aziza', 'Katta'); }
  console.log('  [xotiradagi holat]', JSON.stringify(holat));
})();
JS
{ echo '$ node xotira.js 1      # 1-ishga tushirish'; node xotira.js 1 2>&1; echo; echo '# bot to'"'"'xtatildi va qayta ishga tushirildi (yangi jarayon)'; echo '$ node xotira.js 2'; node xotira.js 2 2>&1; } > "$OUT/02-xotira-qayta-ishga.txt"

# 03 bitta umumiy o'zgaruvchi — ikki mijoz aralashadi
cat > umumiy.js <<'JS'
const { yangiBot, yoz } = require('./sinov');
let tanlov = null; // HAMMA UCHUN BITTA
const bot = yangiBot();
bot.hears(/^(Pepperoni|Margarita)$/, (ctx) => { tanlov = ctx.message.text; return ctx.reply(`${tanlov}. O'lcham?`); });
bot.hears(/^(Katta|Kichik)$/, (ctx) => ctx.reply(`Buyurtma: ${tanlov}, ${ctx.message.text.toLowerCase()}`));
(async () => {
  await yoz(bot, 5123456789, 'Aziza', 'Pepperoni');
  await yoz(bot, 6234567890, 'Jasur', 'Margarita');
  await yoz(bot, 5123456789, 'Aziza', 'Katta');
})();
JS
{ echo '$ node umumiy.js'; node umumiy.js 2>&1; } > "$OUT/03-umumiy-aralashdi.txt"

# 04 jadval va PostgreSQL'dagi holat (o'quvchi darsidagi users jadvali) — SELECT → (yo'q bo'lsa INSERT) → UPDATE
psql_ -d botdb -c "CREATE TABLE users (id SERIAL PRIMARY KEY, telegram_id BIGINT NOT NULL UNIQUE, ism TEXT, holat TEXT, tanlov TEXT);" > "$OUT/04-jadval.txt" 2>&1
cat > baza.js <<'JS'
const { Pool } = require('pg');
const { yangiBot, yoz } = require('./sinov');
const pool = new Pool({ host: 'localhost', port: Number(process.env.PGPORT_), user: 'postgres', password: 'password', database: 'botdb' });
const bot = yangiBot();
bot.start(async (ctx) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [ctx.chat.id]);
  if (rows.length === 0) {
    await pool.query('INSERT INTO users (telegram_id, holat) VALUES ($1, $2)', [ctx.chat.id, 'ISM_KUTYAPMAN']);
    return ctx.reply('Ismingiz nima?');
  }
  return ctx.reply(`Yana salom, ${rows[0].ism}!`);
});
bot.on('text', async (ctx) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [ctx.chat.id]);
  const u = rows[0];
  if (u && u.holat === 'ISM_KUTYAPMAN') {
    await pool.query('UPDATE users SET ism = $1, holat = $2 WHERE telegram_id = $3', [ctx.message.text, 'TAYYOR', ctx.chat.id]);
    return ctx.reply(`Tanishganimdan xursandman, ${ctx.message.text}!`);
  }
  return ctx.reply('Buyruqni tanlang: /start');
});
(async () => {
  const qism = process.argv[2];
  if (qism === '1') { await yoz(bot, 5123456789, 'Aziza', '/start'); await yoz(bot, 5123456789, 'Aziza', 'Aziza'); await yoz(bot, 6234567890, 'Jasur', '/start'); }
  else { await yoz(bot, 5123456789, 'Aziza', '/start'); await yoz(bot, 6234567890, 'Jasur', 'Jasur'); }
  await pool.end();
})();
JS
export PGPORT_=$PORT
{ echo '$ node baza.js 1      # 1-ishga tushirish'; node baza.js 1 2>&1; echo; echo '# bot to'"'"'xtatildi va qayta ishga tushirildi'; echo '$ node baza.js 2'; node baza.js 2 2>&1; echo; echo '$ psql -c "SELECT telegram_id, ism, holat FROM users"'; psql_ -d botdb -c "SELECT telegram_id, ism, holat FROM users ORDER BY id"; } > "$OUT/05-baza-qayta-ishga.txt"

# 06 INTEGER ustun — Telegram id 2^31 dan katta (5123456789) → out of range
psql_ -d botdb -c "CREATE TABLE users_int (id SERIAL PRIMARY KEY, telegram_id INTEGER);" >/dev/null
{ echo "\$ INSERT INTO users_int (telegram_id) VALUES (5123456789);"; psql_ -d botdb -c "INSERT INTO users_int (telegram_id) VALUES (5123456789);" 2>&1; } > "$OUT/06-integer-sigmadi.txt"

# 07 BIGINT node-pg'da matn bo'lib keladi: '5123456789' === 5123456789 → false
cat > bigint.js <<'JS'
const { Pool } = require('pg');
const pool = new Pool({ host: 'localhost', port: Number(process.env.PGPORT_), user: 'postgres', password: 'password', database: 'botdb' });
(async () => {
  const { rows } = await pool.query('SELECT telegram_id FROM users WHERE telegram_id = $1', [5123456789]);
  const v = rows[0].telegram_id;
  console.log('rows[0].telegram_id =', JSON.stringify(v), '· typeof:', typeof v);
  console.log('v === 5123456789 →', v === 5123456789);
  console.log('Number(v) === 5123456789 →', Number(v) === 5123456789);
  await pool.end();
})();
JS
{ echo '$ node bigint.js'; node bigint.js 2>&1; } > "$OUT/07-bigint-matn.txt"

# 08 SELECT'siz ikkinchi /start — INSERT takrorlanadi → UNIQUE xatosi
{ echo "\$ INSERT INTO users (telegram_id, holat) VALUES (5123456789, 'ISM_KUTYAPMAN');  -- SELECT'siz, ikkinchi marta"; psql_ -d botdb -c "INSERT INTO users (telegram_id, holat) VALUES (5123456789, 'ISM_KUTYAPMAN');" 2>&1; } > "$OUT/08-unique-takror.txt"

# ================= B: o'quvchi reposi TelegramBotNest, dars-04-done (haqiqiy Nest + TypeORM kodi) =================
psql_ -c "CREATE DATABASE botnest" >/dev/null
cd "$R" && git clone -q https://github.com/Azizbekcrypto/TelegramBotNest.git nest && cd nest && git checkout -q dars-04-done
{ git log --oneline -1; run npm ci; } > "$OUT/10-repo-npm-ci.txt" 2>&1
npm ci --no-audit --no-fund >/dev/null 2>&1; npx nest build >/dev/null 2>&1
# 11 .env yo'q — o'quvchi ko'radigan birinchi xato (DATABASE_URL tekshiruvi modul yuklanganda)
{ echo '$ npm run start   # .env yo'"'"'q'; timeout 60 "${CLEAN[@]}" node dist/main 2>&1 | grep -v "^\s*at \|LOG \[" | head -8; } > "$OUT/11-env-yoq.txt"
# 12 haqiqiy kod, Telegram'siz: launch o'chiriladi, javob ushlanadi; Nest konteksti ikki marta ochiladi (= qayta ishga tushirish)
cat > sinov-nest.js <<'JS'
const { Telegraf, Telegram } = require('telegraf');
Telegraf.prototype.launch = async function (cb) { cb && cb(); }; // Telegram serveriga ulanmaymiz
Telegram.prototype.callApi = async function (method, p) { if (p && p.text) console.log(`  bot → ${p.chat_id}: ${p.text}`); return { message_id: 1 }; };
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/api/app.module');
const { TelegramService } = require('./dist/api/telegram/telegram.service');
let uid = 1;
async function yoz(bot, id, ism, text) {
  console.log(`${ism} (${id}): ${text}`);
  const message = { message_id: uid++, date: 0, chat: { id, type: 'private' }, from: { id, is_bot: false, first_name: ism }, text };
  if (text.startsWith('/')) message.entities = [{ type: 'bot_command', offset: 0, length: text.split(' ')[0].length }];
  await bot.handleUpdate({ update_id: uid, message });
}
async function ishga(qadamlar) {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const bot = app.get(TelegramService).bot; bot.botInfo = { id: 1, is_bot: true, first_name: 'AvtoPizza', username: 'avtopizza_bot' };
  for (const [id, ism, t] of qadamlar) await yoz(bot, id, ism, t);
  await app.close();
}
(async () => {
  console.log('# 1-ishga tushirish');
  await ishga([[5123456789, 'Aziza', '/start'], [5123456789, 'Aziza', 'Aziza'], [6234567890, 'Jasur', '/start']]);
  console.log('# bot to\'xtatildi (app.close) va qayta ishga tushirildi');
  await ishga([[5123456789, 'Aziza', '/start'], [6234567890, 'Jasur', 'Jasur'], [6234567890, 'Jasur', 'salom']]);
})().catch((e) => { console.error('XATO:', e.message); process.exit(1); });
JS
export DATABASE_URL="postgresql://postgres:password@localhost:$PORT/botnest" BOT_TOKEN="123:SOXTA"
{ echo '$ node sinov-nest.js   # dars-04-done kodi, haqiqiy PostgreSQL, Telegram serverisiz'; node sinov-nest.js 2>&1; echo; echo '$ psql botnest -c "\d users"'; psql_ -d botnest -c '\d users'; echo '$ psql botnest -c "SELECT telegram_id, ism, holat FROM users"'; psql_ -d botnest -c "SELECT telegram_id, ism, holat FROM users ORDER BY created_at"; } > "$OUT/12-repo-holat-qayta-ishga.txt"
unset DATABASE_URL BOT_TOKEN
# 13 token noto'g'ri — haqiqiy Telegram serveri bitta getMe so'rovini rad etadi (soxta token, zararsiz)
{ echo '$ npm run start   # BOT_TOKEN=123:SOXTA, DATABASE_URL — lokal PostgreSQL'; env NO_COLOR=1 FORCE_COLOR=0 DATABASE_URL="postgresql://postgres:password@localhost:$PORT/botnest" BOT_TOKEN="123:SOXTA" timeout 25 node dist/main 2>&1 | grep -E "Telegram|Server|ERROR|Error" | head -6; } > "$OUT/13-token-xato.txt"
# 14 TypeORM ham bigint'ni matn qaytaradimi — repo UserService bilan
cat > sinov-typeorm.js <<'JS'
const { Telegraf } = require('telegraf'); Telegraf.prototype.launch = async function () {};
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/api/app.module');
const { UserService } = require('./dist/api/user/user.service');
(async () => {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const u = await app.get(UserService).topOrYarat(5123456789);
  console.log('user.telegram_id =', JSON.stringify(u.telegram_id), '· typeof:', typeof u.telegram_id);
  console.log('user.telegram_id === 5123456789 →', u.telegram_id === 5123456789);
  await app.close();
})();
JS
{ echo '$ node sinov-typeorm.js   # dars-04-done UserService.topOrYarat'; DATABASE_URL="postgresql://postgres:password@localhost:$PORT/botnest" BOT_TOKEN="123:SOXTA" node sinov-typeorm.js 2>&1; } > "$OUT/14-typeorm-bigint.txt"
echo "[$(date +%T)] tayyor: $(ls "$OUT" | wc -l) fayl → $OUT"
