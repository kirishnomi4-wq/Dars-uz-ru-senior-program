// 5 xaridor, 1 ta Planshet, bir vaqtda checkout. Ishlatish: node race5.cjs <loyiha> <takror>
const path = require('path'); const P = path.resolve(process.argv[2]); const N = Number(process.argv[3] || 5);
const req = (m) => require(require.resolve(m, { paths: [P] }));
process.env.BOT_TOKEN = '1:x'; process.env.ADMIN_TELEGRAM_IDS = '111'; process.env.DB_LOGGING = 'false';
const { Telegraf, Telegram } = req('telegraf'); Telegraf.prototype.launch = async () => {};
const inbox = []; let mid = 1;
Telegram.prototype.callApi = async (m, p = {}) => { if (p.text) inbox.push({ to: Number(p.chat_id), text: String(p.text) }); return { message_id: ++mid, chat: { id: p.chat_id }, date: 0, text: p.text }; };
const { NestFactory } = req('@nestjs/core'); const { Client } = req('pg');
(async () => {
  const app = await NestFactory.createApplicationContext(require(path.join(P, 'dist/api/app.module')).AppModule, { logger: false });
  const bot = app.get(require(path.join(P, 'dist/api/telegram/telegram.service')).TelegramService).bot;
  const db = new Client({ connectionString: process.env.DATABASE_URL }); await db.connect();
  let uid = 1; const ids = [5100000001, 5100000002, 5100000003, 5100000004, 5100000005];
  const from = (id) => ({ id, is_bot: false, first_name: 'U' + String(id).slice(-1) });
  const say = (id, text) => bot.handleUpdate({ update_id: uid++, message: { message_id: ++mid, from: from(id), chat: { id, type: 'private' }, date: 0, text, entities: [{ type: 'bot_command', offset: 0, length: text.length }] } });
  const tap = (id, data) => bot.handleUpdate({ update_id: uid++, callback_query: { id: String(uid), from: from(id), chat_instance: '1', data, message: { message_id: mid, from: { id: 1, is_bot: true, first_name: 'b' }, chat: { id, type: 'private' }, date: 0, text: '.' } } });
  for (const id of ids) await say(id, '/start');
  await db.query(`UPDATE users SET phone = '+998900000000' WHERE telegram_id = ANY($1)`, [ids.map(String)]);
  const pid = (await db.query(`SELECT id FROM products WHERE name = 'Planshet'`)).rows[0].id;
  const out = [];
  for (let r = 0; r < N; r++) {
    await db.query(`UPDATE products SET stock = 1 WHERE id = $1`, [pid]);
    await db.query(`DELETE FROM cart_items`);
    for (const id of ids) await tap(id, `add:${pid}`);
    inbox.length = 0;
    await Promise.all(ids.map((id) => tap(id, 'checkout')));
    const sold = inbox.filter((m) => /qabul qilindi/.test(m.text)).length;
    const stock = (await db.query(`SELECT stock FROM products WHERE id = $1`, [pid])).rows[0].stock;
    out.push(`${sold}/${stock}`);
  }
  console.log(`sotildi/ombor (1 ta Planshet, 5 xaridor) × ${N}: ${out.join('  ')}`);
  await db.end(); await app.close(); process.exit(0);
})().catch((e) => { console.error('XATO', e.message); process.exit(1); });
