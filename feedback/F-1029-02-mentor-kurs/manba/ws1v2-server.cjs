// WebSocket-1 v2 (F-1104-22) tajriba serveri: OrderBotNest'ning HAQIQIY kodi (dist), faqat Telegram o'rniga smoke'dagi usul —
// Telegraf launch va callApi soxta, mijoz/admin xabarlari bot.handleUpdate bilan beriladi (Telegram serverisiz, token kerak emas).
// ISHLATISH (cwd = OrderBotNest, oldin `npx nest build`): node <bu-fayl.cjs> <senariy> [kechikish-ms]
//   jim       — server ishlaydi, hech narsa qilmaydi (klient ulanishlari uchun)
//   buyurtma  — <kechikish> dan keyin Bobur buyurtma beradi, 2 s dan keyin admin tasdiqlaydi
// Server SIGTERM gacha ishlaydi. Har qadam vaqt belgisi bilan stdout'ga.
const path = require('path');
const ROOT = process.cwd();
const req = (m) => require(path.join(ROOT, 'node_modules', m));
const { Telegraf, Telegram } = req('telegraf');
const t = () => new Date().toTimeString().slice(0, 8);
Telegraf.prototype.launch = async function (cb) {
  if (cb) cb();
};
let mid = 1000;
const lastTo = {}; // har chat'ga oxirgi bot xabari
Telegram.prototype.callApi = async function (method, p = {}) {
  if (method === 'sendMessage' || method === 'editMessageText') {
    console.log(`${t()} bot → ${p.chat_id}: ${String(p.text).split('\n')[0]}`);
    lastTo[Number(p.chat_id)] = String(p.text);
    return { message_id: ++mid, chat: { id: p.chat_id }, date: 0, text: p.text };
  }
  if (method === 'answerCallbackQuery') {
    if (p.text) console.log(`${t()} bot (tugma javobi): ${p.text}`);
    return true;
  }
  return true;
};
const { NestFactory } = req('@nestjs/core');
const { AppModule } = require(path.join(ROOT, 'dist/api/app.module'));
const { TelegramService } = require(path.join(ROOT, 'dist/api/telegram/telegram.service'));
const { OrderService } = require(path.join(ROOT, 'dist/api/order/order.service'));
const ADMIN = 111, BOBUR = 5987654321;
const NAME = { [ADMIN]: 'Jasur', [BOBUR]: 'Bobur' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let uid = 1;

(async () => {
  const app = await NestFactory.create(AppModule);
  // AI nusxalari main.ts da WsAdapter qo'yadi (xom ws) — tajriba serveri ham shuni qo'llaydi (ADAPTER=ws)
  if (process.env.ADAPTER === 'ws') {
    const { WsAdapter } = req('@nestjs/platform-ws');
    app.useWebSocketAdapter(new WsAdapter(app));
  }
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`${t()} Server ${port}-portda ishlayapti`);
  const bot = app.get(TelegramService).bot;
  const from = (id) => ({ id, is_bot: false, first_name: NAME[id] });
  const say = (id, text) => {
    const m = text.match(/^\/\w+/);
    return bot.handleUpdate({ update_id: uid++, message: { message_id: ++mid, from: from(id), chat: { id, type: 'private' }, date: 0, text, entities: m ? [{ type: 'bot_command', offset: 0, length: m[0].length }] : undefined } });
  };
  const tap = (id, data) => bot.handleUpdate({ update_id: uid++, callback_query: { id: String(uid), from: from(id), chat_instance: '1', data, message: { message_id: mid, from: { id: 1, is_bot: true, first_name: 'bot' }, chat: { id, type: 'private' }, date: 0, text: '…' } } });
  const scen = process.argv[2] || 'jim';
  if (scen === 'buyurtma') {
    await sleep(Number(process.argv[3]) || 3000);
    console.log(`${t()} — Bobur botda buyurtma beradi (/start → Klaviatura → Buyurtma → telefon)`);
    await say(BOBUR, '/start');
    await tap(BOBUR, 'add:1');
    await tap(BOBUR, 'checkout');
    // telefon faqat bot so'rasa yuboriladi (oldingi tajribada saqlangan bo'lsa — buyurtma darhol)
    if (/raqamingizni yozing/i.test(lastTo[BOBUR] || '')) await say(BOBUR, '+998907654321');
    const [o] = await app.get(OrderService).recent(1);
    await sleep(2000);
    console.log(`${t()} — admin (Jasur) #${o.id} ni tasdiqlaydi`);
    await say(ADMIN, '/start');
    await tap(ADMIN, `status:${o.id}:CONFIRMED`);
  }
  process.on('SIGTERM', async () => {
    await app.close();
    process.exit(0);
  });
})().catch((e) => {
  console.error('SERVER XATO:', e.message);
  process.exit(1);
});
