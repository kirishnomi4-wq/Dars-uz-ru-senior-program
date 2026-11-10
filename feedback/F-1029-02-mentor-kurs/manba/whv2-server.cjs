// Webhook v2 (F-1104-24) tajriba serveri: OrderBotNest'ning HAQIQIY dist/main.js — main.ts o'zi NestFactory.create(…) qiladi
// (rawBody bor-yo'qligi loyiha kodida). Bu fayl faqat: Telegram o'rniga smoke'dagi usul (launch/callApi soxta) va
// NestFactory.create ni o'rab, ilova obyektini ushlaydi — SIGUSR2 da Bobur botda buyurtma beradi (bot.handleUpdate).
// ISHLATISH (cwd = OrderBotNest, oldin `npx nest build`): node <bu-fayl.cjs>   · SIGTERM — to'xtaydi
const path = require('path');
const ROOT = process.cwd();
const req = (m) => require(path.join(ROOT, 'node_modules', m));
const { Telegraf, Telegram } = req('telegraf');
const t = () => new Date().toTimeString().slice(0, 8);
Telegraf.prototype.launch = async function (cb) { if (cb) cb(); };
let mid = 1000;
const lastTo = {};
Telegram.prototype.callApi = async function (method, p = {}) {
  if (method === 'sendMessage' || method === 'editMessageText') {
    console.log(`${t()} bot → ${p.chat_id}: ${String(p.text).split('\n')[0]}`);
    lastTo[Number(p.chat_id)] = String(p.text);
    return { message_id: ++mid, chat: { id: p.chat_id }, date: 0, text: p.text };
  }
  return true;
};
const core = req('@nestjs/core');
const orig = core.NestFactory.create.bind(core.NestFactory);
let app = null;
core.NestFactory.create = async (...a) => {
  console.log(`${t()} main.ts: NestFactory.create(AppModule${a[1] ? ', ' + JSON.stringify(a[1]) : ''})`);
  app = await orig(...a);
  return app;
};
require(path.join(ROOT, 'dist/main.js'));
const BOBUR = 5987654321;
let uid = 1;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let band = Promise.resolve();
const buyurtma = () => (band = band.then(async () => {
  const { TelegramService } = require(path.join(ROOT, 'dist/api/telegram/telegram.service'));
  const { OrderService } = require(path.join(ROOT, 'dist/api/order/order.service'));
  const bot = app.get(TelegramService).bot;
  const from = { id: BOBUR, is_bot: false, first_name: 'Bobur' };
  const chat = { id: BOBUR, type: 'private' };
  const say = (text) => { const m = text.match(/^\/\w+/); return bot.handleUpdate({ update_id: uid++, message: { message_id: ++mid, from, chat, date: 0, text, entities: m ? [{ type: 'bot_command', offset: 0, length: m[0].length }] : undefined } }); };
  const tap = (data) => bot.handleUpdate({ update_id: uid++, callback_query: { id: String(uid), from, chat_instance: '1', data, message: { message_id: mid, from: { id: 1, is_bot: true, first_name: 'bot' }, chat, date: 0, text: '…' } } });
  console.log(`${t()} — Bobur botda buyurtma beradi`);
  await say('/start'); await tap('add:1'); await tap('checkout');
  if (/raqamingizni yozing/i.test(lastTo[BOBUR] || '')) await say('+998907654321');
  const [o] = await app.get(OrderService).recent(1);
  console.log(`${t()} — buyurtma #${o.id} bazada · ${o.total}`);
}).catch((e) => console.error('BUYURTMA XATO:', e.message)));
process.on('SIGUSR2', () => buyurtma());
process.on('SIGTERM', async () => { if (app) await app.close(); process.exit(0); });
(async () => { for (let i = 0; i < 200 && !(app && app.getHttpServer().listening); i++) await sleep(100); if (!app) { console.error('SERVER XATO: ilova yaratilmadi'); process.exit(1); } })();
