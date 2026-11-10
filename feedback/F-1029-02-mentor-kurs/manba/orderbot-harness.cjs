// Buyurtma botini Telegram serverisiz yurgizish (haqiqiy Nest + Telegraf + servislar).
// Xabar — bot.handleUpdate(update); botning javobi — Telegram.prototype.callApi ushlanadi.
// Ishlatish: node orderbot-harness.cjs <loyiha-papkasi> <senariy: xotira|baza>
const path = require('path');
const P = path.resolve(process.argv[2] || '.');
const SCEN = process.argv[3] || 'xotira';
process.env.BOT_TOKEN = process.env.BOT_TOKEN || '123:SOXTA';
process.env.ADMIN_TELEGRAM_IDS = process.env.ADMIN_TELEGRAM_IDS || '111';
const req = (m) => require(require.resolve(m, { paths: [P] }));
const { Telegraf, Telegram } = req('telegraf');
Telegraf.prototype.launch = async function (cb) { cb && cb(); }; // Telegram serveriga ulanmaymiz
let mid = 100;
const WHO = { 5123456789: 'Aziza', 111: 'Jasur(admin)', 5987654321: 'Bobur' };
Telegram.prototype.callApi = async function (method, p) {
  if (method === 'sendMessage' || method === 'editMessageText') {
    const to = WHO[p.chat_id] || p.chat_id;
    console.log(`  bot → ${to}${method === 'editMessageText' ? ' (tahrir)' : ''}: ${String(p.text).replace(/\n/g, '\n      ')}`);
    const kb = p.reply_markup && p.reply_markup.inline_keyboard;
    if (kb) kb.forEach((row) => console.log('      [' + row.map((b) => `${b.text} → ${b.callback_data}`).join(' | ') + ']'));
    return { message_id: ++mid, chat: { id: p.chat_id }, date: 0, text: p.text };
  }
  if (method === 'answerCallbackQuery') { if (p.text) console.log(`  bot → (popup): ${p.text}`); return true; }
  return true;
};
const { NestFactory } = req('@nestjs/core');
let uid = 1;
const from = (id) => ({ id, is_bot: false, first_name: WHO[id] ? WHO[id].replace('(admin)', '') : 'User' });
const chat = (id) => ({ id, type: 'private' });
async function boot() {
  const { AppModule } = require(path.join(P, 'dist/api/app.module'));
  const { TelegramService } = require(path.join(P, 'dist/api/telegram/telegram.service'));
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });
  const bot = app.get(TelegramService).bot;
  const say = async (id, text) => {
    console.log(`${WHO[id] || id}: ${text}`);
    const m = text.match(/^\/(\w+)/);
    const entities = m ? [{ type: 'bot_command', offset: 0, length: m[0].length }] : undefined;
    await bot.handleUpdate({ update_id: uid++, message: { message_id: ++mid, from: from(id), chat: chat(id), date: 0, text, entities } });
  };
  const tap = async (id, data) => {
    console.log(`${WHO[id] || id}: [tugma ${data}]`);
    await bot.handleUpdate({ update_id: uid++, callback_query: { id: String(uid), from: from(id), chat_instance: '1', data, message: { message_id: mid, from: { id: 1, is_bot: true, first_name: 'bot' }, chat: chat(id), date: 0, text: '…' } } });
  };
  return { app, say, tap };
}
const A = 5123456789, J = 111; // Aziza (32 bitdan katta id), Jasur admin
async function senariy() {
  console.log(`=== 1-jarayon: server ishga tushdi (${SCEN}) ===`);
  let { app, say, tap } = await boot();
  await say(J, '/start');
  await say(A, '/start');
  await say(A, '/catalog');
  await tap(A, 'page:1');
  await tap(A, 'add:1');
  await tap(A, 'add:4');
  await tap(A, 'add:4');
  await say(A, '/cart');
  await tap(A, 'checkout');
  await say(A, 'salom');
  await say(A, '+998901234567');
  await say(J, '/orders');
  await tap(J, 'status:1:CONFIRMED');
  await say(A, '/orders');
  console.log('--- ombordan ko‘p so‘rash: Planshet 3 ta bor, 4 ta so‘raymiz ---');
  for (let i = 0; i < 4; i++) await tap(A, 'add:5');
  await tap(A, 'checkout');
  await say(A, '/cart');
  await tap(A, 'cart:clear');
  await tap(A, 'add:2');
  await say(A, '/cart');
  await app.close();
  console.log('\n=== server QAYTA ishga tushdi (2-jarayon) ===');
  ({ app, say, tap } = await boot());
  await say(A, '/start');
  await say(A, '/cart');
  await say(J, '/orders');
  await app.close();
}
async function sqllog() {
  // Qisqa oqim, DB_LOGGING=true bilan: har qadamning haqiqiy SQL'i terminalda
  const { app, say, tap } = await boot();
  await say(A, '/start');
  await tap(A, 'add:1');
  await say(A, '/cart');
  await tap(A, 'checkout');
  await app.close();
}
async function stateRestart() {
  // Telefon so'raldi → server qayta ishga tushdi → mijoz raqamni yozadi. Bot uni telefon deb tushunadimi?
  const Bo = 5987654321;
  console.log('=== state senariysi: 1-jarayon ===');
  let { app, say, tap } = await boot();
  await say(Bo, '/start');
  await say(Bo, '/start');
  await tap(Bo, 'add:2');
  await tap(Bo, 'checkout');
  await app.close();
  console.log('\n=== server QAYTA ishga tushdi ===');
  ({ app, say, tap } = await boot());
  await say(Bo, '+998935554433');
  await say(Bo, '/cart');
  await app.close();
}
async function race() {
  // Omborda 1 ta Planshet. Aziza va Bobur bir vaqtda «Buyurtma berish» bosadi. Keyin admin g'olib buyurtmani bekor qiladi.
  const { Client } = req('pg');
  const db = new Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  const q = async (sql, p) => (await db.query(sql, p)).rows;
  const Bo = 5987654321;
  let { app, say, tap } = await boot();
  await say(A, '/start'); await say(Bo, '/start'); await say(J, '/start');
  await q(`UPDATE users SET phone = '+998900000001' WHERE telegram_id = $1`, [A]);
  await q(`UPDATE users SET phone = '+998900000002' WHERE telegram_id = $1`, [Bo]);
  await q(`UPDATE products SET stock = 1 WHERE name = 'Planshet'`);
  console.log('ombor oldin:', JSON.stringify(await q(`SELECT name, stock FROM products WHERE name = 'Planshet'`)));
  await tap(A, 'add:5'); await tap(Bo, 'add:5');
  console.log('--- ikkalasi bir vaqtda checkout ---');
  await Promise.all([tap(A, 'checkout'), tap(Bo, 'checkout')]);
  console.log('ombor keyin:', JSON.stringify(await q(`SELECT name, stock FROM products WHERE name = 'Planshet'`)));
  const orders = await q(`SELECT id, status, total FROM orders ORDER BY id`);
  console.log('orders:', JSON.stringify(orders));
  console.log('cart_items:', JSON.stringify(await q(`SELECT * FROM cart_items`)));
  const last = orders[orders.length - 1];
  if (last) {
    console.log(`--- admin #${last.id} ni bekor qiladi ---`);
    await tap(J, `status:${last.id}:CANCELLED`);
    console.log('ombor bekordan keyin:', JSON.stringify(await q(`SELECT name, stock FROM products WHERE name = 'Planshet'`)));
    await tap(J, `status:${last.id}:CANCELLED`);
    console.log('ombor 2-bekordan keyin:', JSON.stringify(await q(`SELECT name, stock FROM products WHERE name = 'Planshet'`)));
  }
  await app.close(); await db.end();
}
(SCEN === 'race' ? race() : SCEN === 'sqllog' ? sqllog() : SCEN === 'state' ? stateRestart() : senariy()).then(() => process.exit(0)).catch((e) => { console.error('XATO:', e); process.exit(1); });
