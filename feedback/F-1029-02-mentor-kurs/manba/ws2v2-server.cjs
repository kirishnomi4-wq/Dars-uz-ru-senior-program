// WebSocket-2 v2 (F-1104-23) tajriba serveri — ws1v2-server.cjs asosida: OrderBotNest'ning HAQIQIY kodi (dist), faqat Telegram o'rniga
// smoke'dagi usul — Telegraf launch va callApi soxta, mijoz/admin xabarlari bot.handleUpdate bilan beriladi (Telegram serverisiz).
// ISHLATISH (cwd = OrderBotNest, oldin `npx nest build`): node <bu-fayl.cjs> <senariy>
//   jim     — server ishlaydi; har SIGUSR2 da Bobur bitta buyurtma beradi (tajriba skripti istalgan paytda «buyurtma» qiladi)
//   navbat0 — xuddi navbat, lekin buyurtma app.listen dan OLDIN (qat'iy: panel ulanishga ulgurmaydi — tuzatishni tekshirish uchun)
//   navbat  — server o'chiq paytda Bobur yozgan xabar Telegram navbatida turgan holat: bot ulanishi bilan (launch, 0,3 s —
//             getUpdates javobi) buyurtma bajariladi; keyin ham SIGUSR2 ishlaydi
// Server SIGTERM gacha ishlaydi. Har qadam vaqt belgisi bilan stdout'ga.
const path = require('path');
const ROOT = process.cwd();
const req = (m) => require(path.join(ROOT, 'node_modules', m));
const { Telegraf, Telegram } = req('telegraf');
const t = () => new Date().toTimeString().slice(0, 8);
let onLaunch = null;
Telegraf.prototype.launch = async function (cb) {
  if (cb) cb();
  // haqiqiy Telegraf: launch → getUpdates → navbatdagi xabarlar darhol (app.listen kutilmaydi)
  if (onLaunch) setTimeout(onLaunch, 300);
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
  const scen0 = process.argv[2] || 'jim';
  let app;
  let navbatTayyor;
  const navbat = new Promise((r) => (navbatTayyor = r));
  if (scen0 === 'navbat') onLaunch = () => navbatTayyor();
  app = await NestFactory.create(AppModule);
  // AI nusxalari main.ts da WsAdapter qo'yadi (xom ws) — tajriba serveri ham shuni qo'llaydi (ADAPTER=ws)
  if (process.env.ADAPTER === 'ws') {
    const { WsAdapter } = req('@nestjs/platform-ws');
    app.useWebSocketAdapter(new WsAdapter(app));
  }
  // bot onModuleInit da yaratiladi — u app.init() (yoki listen) ichida ishlaydi, shuning uchun har chaqiruvda olinadi
  const bot = () => app.get(TelegramService).bot;
  const from = (id) => ({ id, is_bot: false, first_name: NAME[id] });
  const say = (id, text) => {
    const m = text.match(/^\/\w+/);
    return bot().handleUpdate({ update_id: uid++, message: { message_id: ++mid, from: from(id), chat: { id, type: 'private' }, date: 0, text, entities: m ? [{ type: 'bot_command', offset: 0, length: m[0].length }] : undefined } });
  };
  const tap = (id, data) => bot().handleUpdate({ update_id: uid++, callback_query: { id: String(uid), from: from(id), chat_instance: '1', data, message: { message_id: mid, from: { id: 1, is_bot: true, first_name: 'bot' }, chat: { id, type: 'private' }, date: 0, text: '…' } } });
  const scen = process.argv[2] || 'jim';
  let band = Promise.resolve();
  const buyurtma = (izoh) => (band = band.then(async () => {
    console.log(`${t()} — Bobur botda buyurtma beradi${izoh ? ' (' + izoh + ')' : ''}`);
    await say(BOBUR, '/start');
    await tap(BOBUR, 'add:1');
    await tap(BOBUR, 'checkout');
    if (/raqamingizni yozing/i.test(lastTo[BOBUR] || '')) await say(BOBUR, '+998907654321');
    const [o] = await app.get(OrderService).recent(1);
    console.log(`${t()} — buyurtma #${o.id} bazada`);
  }).catch((e) => console.error('BUYURTMA XATO:', e.message)));
  // navbat0 — qat'iy variant: navbatdagi buyurtma server port OCHISHIDAN OLDIN bajariladi (panel hech qachon ulgurmaydi)
  if (scen === 'navbat0') await app.init();
  if (scen === 'navbat0') await buyurtma("server o'chiq paytda yozgan — Telegram navbatidan, port ochilishidan oldin");
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`${t()} Server ${port}-portda ishlayapti`);
  process.on('SIGUSR2', () => buyurtma());
  if (scen === 'navbat') navbat.then(() => buyurtma("server o'chiq paytda yozgan — Telegram navbatidan"));
  process.on('SIGTERM', async () => {
    await app.close();
    process.exit(0);
  });
})().catch((e) => {
  console.error('SERVER XATO:', e.message);
  process.exit(1);
});
