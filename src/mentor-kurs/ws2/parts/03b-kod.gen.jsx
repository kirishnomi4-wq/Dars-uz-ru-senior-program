
// AVTO: feedback/F-1029-02-mentor-kurs/dev/ws2-kod.py — OrderBotNest ws2-start/ws2-done, maydon-jamoa m12-dars-05, haqiqiy chiqishlar (qo'lda tahrirlanmaydi)
const KOD_HTML = {
 "file": "public/admin.html",
 "tag": "ws2-done",
 "lines": [
  {
   "t": "<!doctype html>",
   "n": 1
  },
  {
   "t": "<html lang=\"uz\">",
   "n": 2
  },
  {
   "t": "<head>",
   "n": 3
  },
  {
   "t": "<meta charset=\"utf-8\">",
   "n": 4
  },
  {
   "t": "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
   "n": 5
  },
  {
   "t": "<title>Buyurtmalar — jonli panel</title>",
   "n": 6
  },
  {
   "t": "<style>",
   "n": 7
  },
  {
   "t": "  :root { --ink: #1f2328; --mute: #57606a; --line: #d0d7de; --ok: #1a7f37; --wait: #9a6700; --bad: #cf222e; --bg: #f6f8fa; }",
   "n": 8
  },
  {
   "t": "  * { box-sizing: border-box; }",
   "n": 9
  },
  {
   "t": "  body { margin: 0; font: 15px/1.45 system-ui, sans-serif; color: var(--ink); background: var(--bg); }",
   "n": 10
  },
  {
   "t": "  header { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: #fff; border-bottom: 1px solid var(--line); }",
   "n": 11
  },
  {
   "t": "  h1 { margin: 0; font-size: 18px; }",
   "n": 12
  },
  {
   "t": "  #holat { margin-left: auto; padding: 4px 10px; border-radius: 999px; font-weight: 600; font-size: 13px; color: #fff; background: var(--mute); }",
   "n": 13
  },
  {
   "t": "  #holat.ulangan { background: var(--ok); }",
   "n": 14
  },
  {
   "t": "  #holat.ulanmoqda { background: var(--wait); }",
   "n": 15
  },
  {
   "t": "  #holat.ulanmagan { background: var(--bad); }",
   "n": 16
  },
  {
   "t": "  main { padding: 16px 20px; max-width: 1000px; margin: 0 auto; }",
   "n": 17
  },
  {
   "t": "  form { display: flex; gap: 8px; margin-bottom: 14px; }",
   "n": 18
  },
  {
   "t": "  input { flex: 1; padding: 8px 10px; border: 1px solid var(--line); border-radius: 6px; font: inherit; }",
   "n": 19
  },
  {
   "t": "  button { padding: 8px 14px; border: 0; border-radius: 6px; background: var(--ink); color: #fff; font: inherit; cursor: pointer; }",
   "n": 20
  },
  {
   "t": "  table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }",
   "n": 21
  },
  {
   "t": "  th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--line); vertical-align: top; }",
   "n": 22
  },
  {
   "t": "  th { background: var(--bg); font-size: 13px; color: var(--mute); }",
   "n": 23
  },
  {
   "t": "  tr.yangi td { background: #fff8c5; }",
   "n": 24
  },
  {
   "t": "  .izoh { color: var(--mute); font-size: 13px; margin: 10px 0 0; }",
   "n": 25
  },
  {
   "t": "</style>",
   "n": 26
  },
  {
   "t": "</head>",
   "n": 27
  },
  {
   "t": "<body>",
   "n": 28
  },
  {
   "t": "<header>",
   "n": 29
  },
  {
   "t": "  <h1>Buyurtmalar — jonli panel</h1>",
   "n": 30
  },
  {
   "t": "  <span id=\"holat\">Ulanmagan</span>",
   "n": 31
  },
  {
   "t": "</header>",
   "n": 32
  },
  {
   "t": "<main>",
   "n": 33
  },
  {
   "t": "  <form id=\"kirish\">",
   "n": 34
  },
  {
   "t": "    <input id=\"token\" type=\"password\" placeholder=\".env dagi ADMIN_PANEL_TOKEN\" autocomplete=\"off\">",
   "n": 35
  },
  {
   "t": "    <button>Kirish</button>",
   "n": 36
  },
  {
   "t": "  </form>",
   "n": 37
  },
  {
   "t": "  <table>",
   "n": 38
  },
  {
   "t": "    <thead><tr><th>#</th><th>Mijoz</th><th>Telefon</th><th>Mahsulotlar</th><th>Jami</th><th>Holat</th><th>Vaqt</th></tr></thead>",
   "n": 39
  },
  {
   "t": "    <tbody id=\"royxat\"><tr><td colspan=\"7\">Token kiriting</td></tr></tbody>",
   "n": 40
  },
  {
   "t": "  </table>",
   "n": 41
  },
  {
   "t": "  <p class=\"izoh\">Yangi buyurtma yoki holat o'zgarsa, ro'yxat o'zi yangilanadi — sahifani qayta ochish shart emas.</p>",
   "n": 42
  },
  {
   "t": "</main>",
   "n": 43
  },
  {
   "t": "<!-- socket.io klienti: server o'zi beradi (/socket.io/socket.io.js) -->",
   "n": 44
  },
  {
   "t": "<script src=\"/socket.io/socket.io.js\"></script>",
   "n": 45
  },
  {
   "t": "<script>",
   "n": 46
  },
  {
   "t": "  // Uch holat: ulangan — hodisalar keladi · ulanmoqda — ulanish yo'q, klient o'zi qayta urinmoqda ·",
   "n": 47
  },
  {
   "t": "  // ulanmagan — klient urinmayapti (token noto'g'ri — server ulanishni yopdi)",
   "n": 48
  },
  {
   "t": "  const HOLAT = { ulangan: 'Ulangan', ulanmoqda: 'Ulanmoqda…', ulanmagan: 'Ulanmagan' };",
   "n": 49
  },
  {
   "t": "  const STATUS = { NEW: 'Yangi', CONFIRMED: 'Tasdiqlandi', DELIVERED: 'Yetkazildi', CANCELLED: 'Bekor' };",
   "n": 50
  },
  {
   "t": "  const el = (id) => document.getElementById(id);",
   "n": 51
  },
  {
   "t": "  // Telegram'dan kelgan ism va mahsulot nomi — matn sifatida (ichida HTML bo'lsa ham ishlamaydi)",
   "n": 52
  },
  {
   "t": "  const esc = (v) => String(v).replace(/[&<>\"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#39;' })[c]);",
   "n": 53
  },
  {
   "t": "  let token = localStorage.getItem(\u0027adminToken') || '';",
   "n": 54
  },
  {
   "t": "  let ulanish = null;",
   "n": 55
  },
  {
   "t": "  let oxirgiId = 0;",
   "n": 56
  },
  {
   "t": "",
   "n": 57
  },
  {
   "t": "  function holatQoy(h) {",
   "n": 58
  },
  {
   "t": "    el('holat').className = h;",
   "n": 59
  },
  {
   "t": "    el('holat').textContent = HOLAT[h];",
   "n": 60
  },
  {
   "t": "  }",
   "n": 61
  },
  {
   "t": "",
   "n": 62
  },
  {
   "t": "  // Ro'yxat — har doim Backend'dan (GET /admin/orders). Hodisa faqat «nimadir o'zgardi» deydi.",
   "n": 63
  },
  {
   "t": "  // Ikki joyda chaqiriladi: connect (birinchi va har qayta ulanish) va order-changed.",
   "n": 64
  },
  {
   "t": "  async function yukla() {",
   "n": 65
  },
  {
   "t": "    const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });",
   "n": 66
  },
  {
   "t": "    if (r.status === 401) {",
   "n": 67
  },
  {
   "t": "      el('royxat').innerHTML = \"<tr><td colspan='7'>Token noto'g'ri</td></tr>\";",
   "n": 68
  },
  {
   "t": "      return;",
   "n": 69
  },
  {
   "t": "    }",
   "n": 70
  },
  {
   "t": "    const list = await r.json();",
   "n": 71
  },
  {
   "t": "    const eng = list.length ? list[0].id : 0;",
   "n": 72
  },
  {
   "t": "    el('royxat').innerHTML = list.length",
   "n": 73
  },
  {
   "t": "      ? list.map((o) => `<tr class=\"${o.id > oxirgiId && oxirgiId ? 'yangi' : ''}\">",
   "n": 74
  },
  {
   "t": "          <td>${o.id}</td><td>${esc(o.customer)}</td><td>${esc(o.phone)}</td>",
   "n": 75
  },
  {
   "t": "          <td>${o.items.map((i) => `${esc(i.name)} × ${i.qty}`).join('<br>')}</td>",
   "n": 76
  },
  {
   "t": "          <td>${o.total.toLocaleString('ru-RU')} so'm</td><td>${STATUS[o.status] || o.status}</td>",
   "n": 77
  },
  {
   "t": "          <td>${new Date(o.created_at).toLocaleTimeString('ru-RU')}</td></tr>`).join('')",
   "n": 78
  },
  {
   "t": "      : \"<tr><td colspan='7'>Hali buyurtma yo'q</td></tr>\";",
   "n": 79
  },
  {
   "t": "    oxirgiId = eng;",
   "n": 80
  },
  {
   "t": "  }",
   "n": 81
  },
  {
   "t": "",
   "n": 82
  },
  {
   "t": "  function ulan() {",
   "n": 83
  },
  {
   "t": "    if (ulanish) ulanish.close();",
   "n": 84
  },
  {
   "t": "    ulanish = io({ auth: { token } });",
   "n": 85
  },
  {
   "t": "    holatQoy('ulanmoqda');",
   "n": 86
  },
  {
   "t": "    // connect — birinchi ulanishda HAM har qayta ulanishda: uzilish paytidagi hodisa kelmaydi, shuning uchun ro'yxat qayta so'raladi",
   "n": 87
  },
  {
   "t": "    ulanish.on('connect', () => {",
   "n": 88
  },
  {
   "t": "      holatQoy('ulangan');",
   "n": 89
  },
  {
   "t": "      yukla();",
   "n": 90
  },
  {
   "t": "    });",
   "n": 91
  },
  {
   "t": "    // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»",
   "n": 92
  },
  {
   "t": "    ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));",
   "n": 93
  },
  {
   "t": "    ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));",
   "n": 94
  },
  {
   "t": "    // tinglovchi bir marta, connect'dan TASHQARIDA (ichida bo'lsa har qayta ulanishda yana bittasi qo'shiladi)",
   "n": 95
  },
  {
   "t": "    ulanish.on('order-changed', () => yukla());",
   "n": 96
  },
  {
   "t": "  }",
   "n": 97
  },
  {
   "t": "",
   "n": 98
  },
  {
   "t": "  el('kirish').addEventListener('submit', (e) => {",
   "n": 99
  },
  {
   "t": "    e.preventDefault();",
   "n": 100
  },
  {
   "t": "    token = el('token').value.trim();",
   "n": 101
  },
  {
   "t": "    localStorage.setItem(\u0027adminToken', token);",
   "n": 102
  },
  {
   "t": "    ulan();",
   "n": 103
  },
  {
   "t": "  });",
   "n": 104
  },
  {
   "t": "",
   "n": 105
  },
  {
   "t": "  if (token) {",
   "n": 106
  },
  {
   "t": "    el('token').value = token;",
   "n": 107
  },
  {
   "t": "    ulan();",
   "n": 108
  },
  {
   "t": "  }",
   "n": 109
  },
  {
   "t": "</script>",
   "n": 110
  },
  {
   "t": "</body>",
   "n": 111
  },
  {
   "t": "</html>",
   "n": 112
  }
 ]
};
const KOD_CLIENT = {
 "file": "scripts/live-client.js",
 "tag": "ws2-done",
 "lines": [
  {
   "t": "// npm run live [-- <token>]",
   "n": 1
  },
  {
   "t": "// Terminal klienti: jonli panel nima ko'rsa — shu yerda satr bo'lib chiqadi (brauzer kerak emas).",
   "n": 2
  },
  {
   "t": "// Manzil: LIVE_URL yoki http://localhost:<PORT>. Token: buyruqdagi argument yoki .env dagi ADMIN_PANEL_TOKEN.",
   "n": 3
  },
  {
   "t": "//   npm run live                  — .env dagi token bilan",
   "n": 4
  },
  {
   "t": "//   npm run live -- notogri       — noto'g'ri token bilan (server ulanishni yopadi)",
   "n": 5
  },
  {
   "t": "//   npm run live -- \"\"            — tokensiz",
   "n": 6
  },
  {
   "t": "const path = require('path');",
   "n": 7
  },
  {
   "t": "require('dotenv').config({",
   "n": 8
  },
  {
   "t": "  path: path.join(__dirname, '..', '.env'),",
   "n": 9
  },
  {
   "t": "  quiet: true,",
   "n": 10
  },
  {
   "t": "});",
   "n": 11
  },
  {
   "t": "const { io } = require('socket.io-client');",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "const url =",
   "n": 14
  },
  {
   "t": "  process.env.LIVE_URL || `http://localhost:${process.env.PORT || 3000}`;",
   "n": 15
  },
  {
   "t": "const token =",
   "n": 16
  },
  {
   "t": "  process.argv.length > 2 ? process.argv[2] : process.env.ADMIN_PANEL_TOKEN;",
   "n": 17
  },
  {
   "t": "const t = () => new Date().toTimeString().slice(0, 8);",
   "n": 18
  },
  {
   "t": "const holat = (s) =>",
   "n": 19
  },
  {
   "t": "  s.connected ? 'ulangan' : s.active ? 'ulanmoqda' : 'ulanmagan';",
   "n": 20
  },
  {
   "t": "",
   "n": 21
  },
  {
   "t": "const s = io(url, { auth: { token } });",
   "n": 22
  },
  {
   "t": "console.log(`${t()} ulanmoqda… ${url}`);",
   "n": 23
  },
  {
   "t": "// Panel kabi: har connect'da (birinchi va qayta) ro'yxat qayta so'raladi — uzilish paytidagi hodisa kelmaydi",
   "n": 24
  },
  {
   "t": "async function royxat() {",
   "n": 25
  },
  {
   "t": "  const r = await fetch(`${url}/admin/orders`, {",
   "n": 26
  },
  {
   "t": "    headers: { Authorization: `Bearer ${token}` },",
   "n": 27
  },
  {
   "t": "  });",
   "n": 28
  },
  {
   "t": "  if (!r.ok) return console.log(`${t()} GET /admin/orders → ${r.status}`);",
   "n": 29
  },
  {
   "t": "  const list = await r.json();",
   "n": 30
  },
  {
   "t": "  console.log(",
   "n": 31
  },
  {
   "t": "    `${t()} GET /admin/orders → ${list.length} ta` +",
   "n": 32
  },
  {
   "t": "      (list.length ? `, eng yangisi #${list[0].id}` : ''),",
   "n": 33
  },
  {
   "t": "  );",
   "n": 34
  },
  {
   "t": "}",
   "n": 35
  },
  {
   "t": "s.on('connect', () => {",
   "n": 36
  },
  {
   "t": "  console.log(",
   "n": 37
  },
  {
   "t": "    `${t()} connect · ${holat(s)} · transport: ${s.io.engine.transport.name}`,",
   "n": 38
  },
  {
   "t": "  );",
   "n": 39
  },
  {
   "t": "  s.io.engine.once('upgrade', (tr) =>",
   "n": 40
  },
  {
   "t": "    console.log(`${t()} transport: ${tr.name}`),",
   "n": 41
  },
  {
   "t": "  );",
   "n": 42
  },
  {
   "t": "  royxat().catch((e) => console.log(`${t()} GET xato: ${e.message}`));",
   "n": 43
  },
  {
   "t": "});",
   "n": 44
  },
  {
   "t": "s.on('disconnect', (reason) =>",
   "n": 45
  },
  {
   "t": "  console.log(",
   "n": 46
  },
  {
   "t": "    `${t()} disconnect: ${reason} · active=${s.active} → ${holat(s)}`,",
   "n": 47
  },
  {
   "t": "  ),",
   "n": 48
  },
  {
   "t": ");",
   "n": 49
  },
  {
   "t": "s.on('connect_error', (e) =>",
   "n": 50
  },
  {
   "t": "  console.log(",
   "n": 51
  },
  {
   "t": "    `${t()} connect_error: ${e.message} · active=${s.active} → ${holat(s)}`,",
   "n": 52
  },
  {
   "t": "  ),",
   "n": 53
  },
  {
   "t": ");",
   "n": 54
  },
  {
   "t": "s.on('order-changed', (p) =>",
   "n": 55
  },
  {
   "t": "  console.log(`${t()} order-changed ${JSON.stringify(p)}`),",
   "n": 56
  },
  {
   "t": ");",
   "n": 57
  }
 ]
};
const KOD_TG = {
 "file": "src/api/telegram/telegram.service.ts",
 "tag": "ws2-done",
 "lines": [
  {
   "t": "import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import { Context, Telegraf } from 'telegraf';",
   "n": 2
  },
  {
   "t": "import { config } from '../../config';",
   "n": 3
  },
  {
   "t": "import { OrderStatus, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { CartService } from '../cart/cart.service';",
   "n": 5
  },
  {
   "t": "import { CatalogService } from '../catalog/catalog.service';",
   "n": 6
  },
  {
   "t": "import { LiveGateway } from '../live/live.gateway';",
   "n": 7
  },
  {
   "t": "import { OrderService } from '../order/order.service';",
   "n": 8
  },
  {
   "t": "import { UserService } from '../user/user.service';",
   "n": 9
  },
  {
   "t": "import { cartKeyboard, catalogKeyboard, orderKeyboard } from './keyboards';",
   "n": 10
  },
  {
   "t": "import { isPhone } from './phone';",
   "n": 11
  },
  {
   "t": "import { texts } from './texts';",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "@Injectable()",
   "n": 14
  },
  {
   "t": "export class TelegramService implements OnModuleInit, OnModuleDestroy {",
   "n": 15
  },
  {
   "t": "  private bot: Telegraf;",
   "n": 16
  },
  {
   "t": "",
   "n": 17
  },
  {
   "t": "  constructor(",
   "n": 18
  },
  {
   "t": "    private readonly users: UserService,",
   "n": 19
  },
  {
   "t": "    private readonly catalog: CatalogService,",
   "n": 20
  },
  {
   "t": "    private readonly cart: CartService,",
   "n": 21
  },
  {
   "t": "    private readonly orders: OrderService,",
   "n": 22
  },
  {
   "t": "    private readonly live: LiveGateway,",
   "n": 23
  },
  {
   "t": "  ) {}",
   "n": 24
  },
  {
   "t": "",
   "n": 25
  },
  {
   "t": "  async onModuleInit() {",
   "n": 26
  },
  {
   "t": "    if (!config.BOT_TOKEN) {",
   "n": 27
  },
  {
   "t": "      throw new Error(",
   "n": 28
  },
  {
   "t": "        'BOT_TOKEN topilmadi. .env faylini oching va @BotFather bergan tokenni yozing (README).',",
   "n": 29
  },
  {
   "t": "      );",
   "n": 30
  },
  {
   "t": "    }",
   "n": 31
  },
  {
   "t": "    this.bot = new Telegraf(config.BOT_TOKEN);",
   "n": 32
  },
  {
   "t": "    this.registerCustomer();",
   "n": 33
  },
  {
   "t": "    this.registerAdmin();",
   "n": 34
  },
  {
   "t": "    this.bot.on('text', (ctx) => this.onText(ctx));",
   "n": 35
  },
  {
   "t": "    this.bot.catch(async (err, ctx) => {",
   "n": 36
  },
  {
   "t": "      console.error('Bot xatosi:', (err as Error).message);",
   "n": 37
  },
  {
   "t": "      await ctx.reply(texts.unknown).catch(() => undefined);",
   "n": 38
  },
  {
   "t": "    });",
   "n": 39
  },
  {
   "t": "",
   "n": 40
  },
  {
   "t": "    this.bot",
   "n": 41
  },
  {
   "t": "      .launch(() => console.log('Telegram bot ulandi'))",
   "n": 42
  },
  {
   "t": "      .catch((e: Error) =>",
   "n": 43
  },
  {
   "t": "        console.error(",
   "n": 44
  },
  {
   "t": "          'Telegram ulanmadi:',",
   "n": 45
  },
  {
   "t": "          e.message,",
   "n": 46
  },
  {
   "t": "          '— README, «Xatolar» jadvali',",
   "n": 47
  },
  {
   "t": "        ),",
   "n": 48
  },
  {
   "t": "      );",
   "n": 49
  },
  {
   "t": "  }",
   "n": 50
  },
  {
   "t": "",
   "n": 51
  },
  {
   "t": "  onModuleDestroy() {",
   "n": 52
  },
  {
   "t": "    try {",
   "n": 53
  },
  {
   "t": "      this.bot?.stop('shutdown');",
   "n": 54
  },
  {
   "t": "    } catch {",
   "n": 55
  },
  {
   "t": "      /* allaqachon to'xtagan */",
   "n": 56
  },
  {
   "t": "    }",
   "n": 57
  },
  {
   "t": "  }",
   "n": 58
  },
  {
   "t": "",
   "n": 59
  },
  {
   "t": "  // ---------- mijoz ----------",
   "n": 60
  },
  {
   "t": "  private registerCustomer() {",
   "n": 61
  },
  {
   "t": "    this.bot.start(async (ctx) => {",
   "n": 62
  },
  {
   "t": "      const user = await this.users.getOrCreate(ctx.from);",
   "n": 63
  },
  {
   "t": "      await ctx.reply(texts.start(user.name, user.role === 'admin'));",
   "n": 64
  },
  {
   "t": "    });",
   "n": 65
  },
  {
   "t": "",
   "n": 66
  },
  {
   "t": "    this.bot.help((ctx) => ctx.reply(texts.help));",
   "n": 67
  },
  {
   "t": "",
   "n": 68
  },
  {
   "t": "    this.bot.command('catalog', (ctx) => this.showCatalog(ctx, 0));",
   "n": 69
  },
  {
   "t": "",
   "n": 70
  },
  {
   "t": "    this.bot.action(/^page:(\\d+)$/, async (ctx) => {",
   "n": 71
  },
  {
   "t": "      await ctx.answerCbQuery();",
   "n": 72
  },
  {
   "t": "      await this.showCatalog(ctx, Number(ctx.match[1]), true);",
   "n": 73
  },
  {
   "t": "    });",
   "n": 74
  },
  {
   "t": "",
   "n": 75
  },
  {
   "t": "    this.bot.action(/^add:(\\d+)$/, async (ctx) => {",
   "n": 76
  },
  {
   "t": "      const p = await this.catalog.find(Number(ctx.match[1]));",
   "n": 77
  },
  {
   "t": "      if (!p) return ctx.answerCbQuery('Mahsulot topilmadi');",
   "n": 78
  },
  {
   "t": "      const user = await this.users.getOrCreate(ctx.from);",
   "n": 79
  },
  {
   "t": "      const qty = await this.cart.add(user, p.id);",
   "n": 80
  },
  {
   "t": "      await ctx.answerCbQuery(texts.added(p, qty));",
   "n": 81
  },
  {
   "t": "    });",
   "n": 82
  },
  {
   "t": "",
   "n": 83
  },
  {
   "t": "    this.bot.action('noop', (ctx) => ctx.answerCbQuery());",
   "n": 84
  },
  {
   "t": "",
   "n": 85
  },
  {
   "t": "    this.bot.command('cart', (ctx) => this.showCart(ctx));",
   "n": 86
  },
  {
   "t": "    this.bot.action('cart', async (ctx) => {",
   "n": 87
  },
  {
   "t": "      await ctx.answerCbQuery();",
   "n": 88
  },
  {
   "t": "      await this.showCart(ctx);",
   "n": 89
  },
  {
   "t": "    });",
   "n": 90
  },
  {
   "t": "",
   "n": 91
  },
  {
   "t": "    this.bot.action('cart:clear', async (ctx) => {",
   "n": 92
  },
  {
   "t": "      const user = await this.users.getOrCreate(ctx.from);",
   "n": 93
  },
  {
   "t": "      await this.cart.clear(user);",
   "n": 94
  },
  {
   "t": "      await ctx.answerCbQuery();",
   "n": 95
  },
  {
   "t": "      await ctx.reply(texts.cartCleared);",
   "n": 96
  },
  {
   "t": "    });",
   "n": 97
  },
  {
   "t": "",
   "n": 98
  },
  {
   "t": "    this.bot.action('checkout', async (ctx) => {",
   "n": 99
  },
  {
   "t": "      await ctx.answerCbQuery();",
   "n": 100
  },
  {
   "t": "      const user = await this.users.getOrCreate(ctx.from);",
   "n": 101
  },
  {
   "t": "      const items = await this.cart.list(user);",
   "n": 102
  },
  {
   "t": "      if (items.length === 0) return ctx.reply(texts.cartEmpty);",
   "n": 103
  },
  {
   "t": "      if (!user.phone) {",
   "n": 104
  },
  {
   "t": "        await this.users.setState(user, 'WAITING_PHONE');",
   "n": 105
  },
  {
   "t": "        return ctx.reply(texts.askPhone);",
   "n": 106
  },
  {
   "t": "      }",
   "n": 107
  },
  {
   "t": "      await this.placeOrder(ctx, user);",
   "n": 108
  },
  {
   "t": "    });",
   "n": 109
  },
  {
   "t": "  }",
   "n": 110
  },
  {
   "t": "",
   "n": 111
  },
  {
   "t": "  private async showCatalog(ctx: Context, page: number, edit = false) {",
   "n": 112
  },
  {
   "t": "    const { items, pages } = await this.catalog.page(page);",
   "n": 113
  },
  {
   "t": "    const text = texts.catalogTitle(page, pages);",
   "n": 114
  },
  {
   "t": "    const kb = catalogKeyboard(items, page, pages);",
   "n": 115
  },
  {
   "t": "    if (edit) {",
   "n": 116
  },
  {
   "t": "      try {",
   "n": 117
  },
  {
   "t": "        await ctx.editMessageText(text, kb);",
   "n": 118
  },
  {
   "t": "        return;",
   "n": 119
  },
  {
   "t": "      } catch {",
   "n": 120
  },
  {
   "t": "        /* xabar o'zgarmagan bo'lsa Telegram xato beradi — yangisini yuboramiz */",
   "n": 121
  },
  {
   "t": "      }",
   "n": 122
  },
  {
   "t": "    }",
   "n": 123
  },
  {
   "t": "    await ctx.reply(text, kb);",
   "n": 124
  },
  {
   "t": "  }",
   "n": 125
  },
  {
   "t": "",
   "n": 126
  },
  {
   "t": "  private async showCart(ctx: Context) {",
   "n": 127
  },
  {
   "t": "    const user = await this.users.getOrCreate(ctx.from!);",
   "n": 128
  },
  {
   "t": "    const items = await this.cart.list(user);",
   "n": 129
  },
  {
   "t": "    if (items.length === 0) return ctx.reply(texts.cartEmpty);",
   "n": 130
  },
  {
   "t": "    const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);",
   "n": 131
  },
  {
   "t": "    await ctx.reply(texts.cart(items, total), cartKeyboard());",
   "n": 132
  },
  {
   "t": "  }",
   "n": 133
  },
  {
   "t": "",
   "n": 134
  },
  {
   "t": "  private async placeOrder(ctx: Context, user: User) {",
   "n": 135
  },
  {
   "t": "    try {",
   "n": 136
  },
  {
   "t": "      const order = await this.orders.place(user, await this.cart.list(user));",
   "n": 137
  },
  {
   "t": "      // tranzaksiya tugadi — buyurtma bazada; ochiq panellarga xabar beramiz",
   "n": 138
  },
  {
   "t": "      this.live.orderChanged(order.id, 'new');",
   "n": 139
  },
  {
   "t": "      await ctx.reply(texts.orderPlaced(order));",
   "n": 140
  },
  {
   "t": "      for (const admin of await this.users.admins()) {",
   "n": 141
  },
  {
   "t": "        if (admin.telegram_id === user.telegram_id) continue;",
   "n": 142
  },
  {
   "t": "        await this.bot.telegram",
   "n": 143
  },
  {
   "t": "          .sendMessage(",
   "n": 144
  },
  {
   "t": "            Number(admin.telegram_id),",
   "n": 145
  },
  {
   "t": "            texts.adminNewOrder(order, user.name),",
   "n": 146
  },
  {
   "t": "          )",
   "n": 147
  },
  {
   "t": "          .catch(() => undefined);",
   "n": 148
  },
  {
   "t": "      }",
   "n": 149
  },
  {
   "t": "    } catch (e) {",
   "n": 150
  },
  {
   "t": "      await ctx.reply(texts.orderFailed((e as Error).message));",
   "n": 151
  },
  {
   "t": "    }",
   "n": 152
  },
  {
   "t": "  }",
   "n": 153
  },
  {
   "t": "",
   "n": 154
  },
  {
   "t": "  // Matn keldi: telefon kutilayotgan bo'lsa — saqlab buyurtma beramiz",
   "n": 155
  },
  {
   "t": "  private async onText(ctx: Context & { message: { text: string } }) {",
   "n": 156
  },
  {
   "t": "    const user = await this.users.getOrCreate(ctx.from!);",
   "n": 157
  },
  {
   "t": "    if (user.state === 'WAITING_PHONE') {",
   "n": 158
  },
  {
   "t": "      const phone = ctx.message.text.replace(/[\\s-]/g, '');",
   "n": 159
  },
  {
   "t": "      if (!isPhone(phone)) return ctx.reply(texts.badPhone);",
   "n": 160
  },
  {
   "t": "      await this.users.setPhone(user, phone);",
   "n": 161
  },
  {
   "t": "      return this.placeOrder(ctx, user);",
   "n": 162
  },
  {
   "t": "    }",
   "n": 163
  },
  {
   "t": "    await ctx.reply(texts.unknown);",
   "n": 164
  },
  {
   "t": "  }",
   "n": 165
  },
  {
   "t": "",
   "n": 166
  },
  {
   "t": "  // ---------- admin ----------",
   "n": 167
  },
  {
   "t": "  private registerAdmin() {",
   "n": 168
  },
  {
   "t": "    this.bot.command('orders', async (ctx) => {",
   "n": 169
  },
  {
   "t": "      const user = await this.users.getOrCreate(ctx.from);",
   "n": 170
  },
  {
   "t": "      if (user.role !== 'admin') return ctx.reply(texts.adminOnly);",
   "n": 171
  },
  {
   "t": "      const list = await this.orders.recent(5);",
   "n": 172
  },
  {
   "t": "      if (list.length === 0) return ctx.reply(texts.noOrders);",
   "n": 173
  },
  {
   "t": "      for (const o of list)",
   "n": 174
  },
  {
   "t": "        await ctx.reply(texts.orderLine(o), orderKeyboard(o));",
   "n": 175
  },
  {
   "t": "    });",
   "n": 176
  },
  {
   "t": "",
   "n": 177
  },
  {
   "t": "    this.bot.action(",
   "n": 178
  },
  {
   "t": "      /^status:(\\d+):(NEW|CONFIRMED|DELIVERED|CANCELLED)$/,",
   "n": 179
  },
  {
   "t": "      async (ctx) => {",
   "n": 180
  },
  {
   "t": "        const user = await this.users.getOrCreate(ctx.from);",
   "n": 181
  },
  {
   "t": "        if (user.role !== 'admin') return ctx.answerCbQuery(texts.adminOnly);",
   "n": 182
  },
  {
   "t": "        try {",
   "n": 183
  },
  {
   "t": "          const order = await this.orders.setStatus(",
   "n": 184
  },
  {
   "t": "            Number(ctx.match[1]),",
   "n": 185
  },
  {
   "t": "            ctx.match[2] as OrderStatus,",
   "n": 186
  },
  {
   "t": "          );",
   "n": 187
  },
  {
   "t": "          this.live.orderChanged(order.id, 'status');",
   "n": 188
  },
  {
   "t": "          await ctx.answerCbQuery(texts.statusChanged(order));",
   "n": 189
  },
  {
   "t": "          await ctx.editMessageText(",
   "n": 190
  },
  {
   "t": "            texts.orderLine(order),",
   "n": 191
  },
  {
   "t": "            orderKeyboard(order),",
   "n": 192
  },
  {
   "t": "          );",
   "n": 193
  },
  {
   "t": "          await this.bot.telegram",
   "n": 194
  },
  {
   "t": "            .sendMessage(",
   "n": 195
  },
  {
   "t": "              Number(order.user.telegram_id),",
   "n": 196
  },
  {
   "t": "              texts.customerStatus(order),",
   "n": 197
  },
  {
   "t": "            )",
   "n": 198
  },
  {
   "t": "            .catch(() => undefined);",
   "n": 199
  },
  {
   "t": "        } catch (e) {",
   "n": 200
  },
  {
   "t": "          await ctx.answerCbQuery((e as Error).message);",
   "n": 201
  },
  {
   "t": "        }",
   "n": 202
  },
  {
   "t": "      },",
   "n": 203
  },
  {
   "t": "    );",
   "n": 204
  },
  {
   "t": "  }",
   "n": 205
  },
  {
   "t": "}",
   "n": 206
  }
 ]
};
const KOD_GATEWAY = {
 "file": "src/api/live/live.gateway.ts",
 "tag": "ws2-done",
 "lines": [
  {
   "t": "import { Logger } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import {",
   "n": 2
  },
  {
   "t": "  OnGatewayConnection,",
   "n": 3
  },
  {
   "t": "  OnGatewayDisconnect,",
   "n": 4
  },
  {
   "t": "  WebSocketGateway,",
   "n": 5
  },
  {
   "t": "  WebSocketServer,",
   "n": 6
  },
  {
   "t": "} from '@nestjs/websockets';",
   "n": 7
  },
  {
   "t": "import type { Server, Socket } from 'socket.io';",
   "n": 8
  },
  {
   "t": "import { isAdminToken } from './admin-token';",
   "n": 9
  },
  {
   "t": "",
   "n": 10
  },
  {
   "t": "// gateway — doimiy ulanishlarni qabul qiladigan klass (socket.io). HTTP server bilan bitta portda turadi (PORT).",
   "n": 11
  },
  {
   "t": "// Panel bir marta ulanadi va ulanayotganda tokenni yuboradi: io(manzil, { auth: { token } }).",
   "n": 12
  },
  {
   "t": "// Token ulanish ochilayotganda tekshiriladi: yo'q yoki noto'g'ri bo'lsa — server ulanishni yopadi",
   "n": 13
  },
  {
   "t": "// (server yopgan ulanishga klient o'zi qayta ulanmaydi — panelda «Ulanmagan»).",
   "n": 14
  },
  {
   "t": "// Hodisa order-changed — { orderId, reason }: qaysi buyurtma va nega o'zgargani.",
   "n": 15
  },
  {
   "t": "// Yangi holatni panel GET /admin/orders dan qayta so'raydi — hodisa ichida ro'yxat ham, son ham yo'q.",
   "n": 16
  },
  {
   "t": "export type OrderChangeReason = 'new' | 'status';",
   "n": 17
  },
  {
   "t": "",
   "n": 18
  },
  {
   "t": "@WebSocketGateway()",
   "n": 19
  },
  {
   "t": "export class LiveGateway implements OnGatewayConnection, OnGatewayDisconnect {",
   "n": 20
  },
  {
   "t": "  private readonly log = new Logger('Live');",
   "n": 21
  },
  {
   "t": "",
   "n": 22
  },
  {
   "t": "  @WebSocketServer()",
   "n": 23
  },
  {
   "t": "  server?: Server;",
   "n": 24
  },
  {
   "t": "",
   "n": 25
  },
  {
   "t": "  handleConnection(client: Socket) {",
   "n": 26
  },
  {
   "t": "    if (!isAdminToken(client.handshake.auth?.token)) {",
   "n": 27
  },
  {
   "t": "      client.disconnect();",
   "n": 28
  },
  {
   "t": "      return;",
   "n": 29
  },
  {
   "t": "    }",
   "n": 30
  },
  {
   "t": "    client.data.admin = true;",
   "n": 31
  },
  {
   "t": "    this.log.log(`panel ulandi: ${client.id}`);",
   "n": 32
  },
  {
   "t": "  }",
   "n": 33
  },
  {
   "t": "",
   "n": 34
  },
  {
   "t": "  handleDisconnect(client: Socket) {",
   "n": 35
  },
  {
   "t": "    if (client.data.admin) this.log.log(`panel uzildi: ${client.id}`);",
   "n": 36
  },
  {
   "t": "  }",
   "n": 37
  },
  {
   "t": "",
   "n": 38
  },
  {
   "t": "  // Bazadagi o'zgarish tugagandan keyin chaqiriladi (tranzaksiya yopilgach). Oladi — hamma ulangan panel.",
   "n": 39
  },
  {
   "t": "  // server yo'q bo'lsa (masalan, smoke HTTP'siz ishga tushirganda) — hodisa yuborilmaydi, bot ishlayveradi.",
   "n": 40
  },
  {
   "t": "  orderChanged(orderId: number, reason: OrderChangeReason) {",
   "n": 41
  },
  {
   "t": "    this.server?.emit('order-changed', { orderId, reason });",
   "n": 42
  },
  {
   "t": "  }",
   "n": 43
  },
  {
   "t": "}",
   "n": 44
  }
 ]
};
const KOD_BUZISH = {
 "file": "BUZISH.md",
 "tag": "ws2-done",
 "lines": [
  {
   "t": "# Buzish yozuvi",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "Mahsulot: OrderBotNest — jonli buyurtmalar paneli (`/admin`). Da'vo — README «Jonli panel»: «ro'yxat o'zi yangilanadi» (`ws2-start` = `ws1-done`).",
   "n": 3
  },
  {
   "t": "Har urinish: nima qildim · nima kutdim · nima bo'ldi → belgi. Brauzer — Chrome; «Bobur» — sinov mijozi (Telegram o'rniga `bot.handleUpdate`, `npm run smoke` dagi usul), baza — haqiqiy PostgreSQL.",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "| № | Usul | Nima qildim | Nima kutdim | Nima bo'ldi | Belgi | Tuzatish | Qayta tekshiruv |",
   "n": 6
  },
  {
   "t": "|---|---|---|---|---|---|---|---|",
   "n": 7
  },
  {
   "t": "| 1 | Server qayta ishga tushdi | Panel ochiq, ro'yxatda #1. Server terminalida Ctrl+C; server o'chiq paytda Bobur botga yozdi; serverni qayta yoqdim — bot ishga tushishi bilan xabarni bajardi (#2). | Belgi «Ulangan» bo'lgach ro'yxatda #2. | Belgi «Ulangan», ro'yxatda faqat #1; bazada 2 ta. `npm run live` da ham `order-changed` kelmadi. | buzildi | tuzatish qilindi | qayta tekshiruvda takrorlanmadi |",
   "n": 8
  },
  {
   "t": "| 2 | Brauzer Offline, qisqa | DevTools → Network → Offline, ~6 s; shu payt Bobur buyurtma berdi; Offline'ni o'chirdim. | Online'dan keyin ro'yxatda yangi buyurtma. | Belgi o'zgarmadi («Ulangan»); hodisa Online bo'lgan zahoti keldi, ro'yxat yangilandi. | buzilmadi | — | — |",
   "n": 9
  },
  {
   "t": "| 3 | Brauzer Offline, uzoq | Offline ~60 s (33-soniyada belgi «Ulanmoqda…»); shu payt Bobur buyurtma berdi; Offline'ni o'chirdim. | Belgi «Ulangan» bo'lgach ro'yxatda yangi buyurtma. | Belgi «Ulangan», ro'yxatda yo'q; bazada bor. | buzildi | tuzatish qilindi | qayta tekshiruvda takrorlanmadi |",
   "n": 10
  },
  {
   "t": "",
   "n": 11
  },
  {
   "t": "«buzilmadi» (2-urinish) — shu kompyuterda, shu urinishda.",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "## Topilgan muammo va tuzatish",
   "n": 14
  },
  {
   "t": "",
   "n": 15
  },
  {
   "t": "1. **Uzilishdan keyin yangi buyurtma ko'rinmaydi** (1 va 3-urinish). Sabab: `order-changed` faqat hozir ulangan panellarga yuboriladi; ulanish yo'q paytdagi hodisa qayta ulangach kelmaydi. 1-urinishda bot Telegram navbatidagi xabarni panel qayta ulanishidan oldin bajardi (panel 1–5 s da qayta urinadi).",
   "n": 16
  },
  {
   "t": "   Tuzatish (`public/admin.html`): `connect` ichida `yukla()` — birinchi va har qayta ulanishda ro'yxat `GET /admin/orders` dan qayta so'raladi; Kirish va sahifa ochilishidagi alohida `yukla()` olib tashlandi (ro'yxat ikki joyda: `connect` va `order-changed`). `scripts/live-client.js` ham har `connect` da `GET /admin/orders → N ta` chiqaradi.",
   "n": 17
  },
  {
   "t": "",
   "n": 18
  },
  {
   "t": "Server kodi o'zgarmagan.",
   "n": 19
  },
  {
   "t": "",
   "n": 20
  },
  {
   "t": "## Tuzatishda tuzoq",
   "n": 21
  },
  {
   "t": "",
   "n": 22
  },
  {
   "t": "`order-changed` tinglovchisini ham `connect` ichiga ko'chirsa, har qayta ulanishda yana bittasi qo'shiladi: ikki qayta yonishdan keyin bitta buyurtmaga 3 ta `GET`, sariq belgi yo'qoladi. Tinglovchi bir marta, `connect` dan tashqarida.",
   "n": 23
  },
  {
   "t": "",
   "n": 24
  },
  {
   "t": "## `connectionStateRecovery` haqida",
   "n": 25
  },
  {
   "t": "",
   "n": 26
  },
  {
   "t": "Sinab ko'rildi (`@WebSocketGateway({ connectionStateRecovery: … })`): tarmoq qisqa uzilganda o'tkazilgan hodisa qayta keladi (`socket.recovered = true`), lekin server qayta yonganda (holat server xotirasida) va klient uzilishdan oldin birorta hodisa olmagan bo'lsa — yo'q. Eng ko'p holat — server qayta yonishi (deploy, xato), shuning uchun yoqilmadi: `connect` da qayta so'rash yetadi.",
   "n": 27
  },
  {
   "t": "",
   "n": 28
  },
  {
   "t": "«Tuzatish qilindi» — kodda o'zgartirish qilindi (ish fakti). «Qayta tekshiruvda takrorlanmadi» — o'sha usul bilan qayta buzib ko'rilgan natija: shu kompyuterda, shu urinishda — hamma holat uchun isbot emas.",
   "n": 29
  }
 ]
};
const KOD_HTML_START = {
 "file": "public/admin.html",
 "tag": "ws2-start",
 "lines": [
  {
   "t": "<!doctype html>",
   "n": 1
  },
  {
   "t": "<html lang=\"uz\">",
   "n": 2
  },
  {
   "t": "<head>",
   "n": 3
  },
  {
   "t": "<meta charset=\"utf-8\">",
   "n": 4
  },
  {
   "t": "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
   "n": 5
  },
  {
   "t": "<title>Buyurtmalar — jonli panel</title>",
   "n": 6
  },
  {
   "t": "<style>",
   "n": 7
  },
  {
   "t": "  :root { --ink: #1f2328; --mute: #57606a; --line: #d0d7de; --ok: #1a7f37; --wait: #9a6700; --bad: #cf222e; --bg: #f6f8fa; }",
   "n": 8
  },
  {
   "t": "  * { box-sizing: border-box; }",
   "n": 9
  },
  {
   "t": "  body { margin: 0; font: 15px/1.45 system-ui, sans-serif; color: var(--ink); background: var(--bg); }",
   "n": 10
  },
  {
   "t": "  header { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: #fff; border-bottom: 1px solid var(--line); }",
   "n": 11
  },
  {
   "t": "  h1 { margin: 0; font-size: 18px; }",
   "n": 12
  },
  {
   "t": "  #holat { margin-left: auto; padding: 4px 10px; border-radius: 999px; font-weight: 600; font-size: 13px; color: #fff; background: var(--mute); }",
   "n": 13
  },
  {
   "t": "  #holat.ulangan { background: var(--ok); }",
   "n": 14
  },
  {
   "t": "  #holat.ulanmoqda { background: var(--wait); }",
   "n": 15
  },
  {
   "t": "  #holat.ulanmagan { background: var(--bad); }",
   "n": 16
  },
  {
   "t": "  main { padding: 16px 20px; max-width: 1000px; margin: 0 auto; }",
   "n": 17
  },
  {
   "t": "  form { display: flex; gap: 8px; margin-bottom: 14px; }",
   "n": 18
  },
  {
   "t": "  input { flex: 1; padding: 8px 10px; border: 1px solid var(--line); border-radius: 6px; font: inherit; }",
   "n": 19
  },
  {
   "t": "  button { padding: 8px 14px; border: 0; border-radius: 6px; background: var(--ink); color: #fff; font: inherit; cursor: pointer; }",
   "n": 20
  },
  {
   "t": "  table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }",
   "n": 21
  },
  {
   "t": "  th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--line); vertical-align: top; }",
   "n": 22
  },
  {
   "t": "  th { background: var(--bg); font-size: 13px; color: var(--mute); }",
   "n": 23
  },
  {
   "t": "  tr.yangi td { background: #fff8c5; }",
   "n": 24
  },
  {
   "t": "  .izoh { color: var(--mute); font-size: 13px; margin: 10px 0 0; }",
   "n": 25
  },
  {
   "t": "</style>",
   "n": 26
  },
  {
   "t": "</head>",
   "n": 27
  },
  {
   "t": "<body>",
   "n": 28
  },
  {
   "t": "<header>",
   "n": 29
  },
  {
   "t": "  <h1>Buyurtmalar — jonli panel</h1>",
   "n": 30
  },
  {
   "t": "  <span id=\"holat\">Ulanmagan</span>",
   "n": 31
  },
  {
   "t": "</header>",
   "n": 32
  },
  {
   "t": "<main>",
   "n": 33
  },
  {
   "t": "  <form id=\"kirish\">",
   "n": 34
  },
  {
   "t": "    <input id=\"token\" type=\"password\" placeholder=\".env dagi ADMIN_PANEL_TOKEN\" autocomplete=\"off\">",
   "n": 35
  },
  {
   "t": "    <button>Kirish</button>",
   "n": 36
  },
  {
   "t": "  </form>",
   "n": 37
  },
  {
   "t": "  <table>",
   "n": 38
  },
  {
   "t": "    <thead><tr><th>#</th><th>Mijoz</th><th>Telefon</th><th>Mahsulotlar</th><th>Jami</th><th>Holat</th><th>Vaqt</th></tr></thead>",
   "n": 39
  },
  {
   "t": "    <tbody id=\"royxat\"><tr><td colspan=\"7\">Token kiriting</td></tr></tbody>",
   "n": 40
  },
  {
   "t": "  </table>",
   "n": 41
  },
  {
   "t": "  <p class=\"izoh\">Yangi buyurtma yoki holat o'zgarsa, ro'yxat o'zi yangilanadi — sahifani qayta ochish shart emas.</p>",
   "n": 42
  },
  {
   "t": "</main>",
   "n": 43
  },
  {
   "t": "<!-- socket.io klienti: server o'zi beradi (/socket.io/socket.io.js) -->",
   "n": 44
  },
  {
   "t": "<script src=\"/socket.io/socket.io.js\"></script>",
   "n": 45
  },
  {
   "t": "<script>",
   "n": 46
  },
  {
   "t": "  // Uch holat: ulangan — hodisalar keladi · ulanmoqda — ulanish yo'q, klient o'zi qayta urinmoqda ·",
   "n": 47
  },
  {
   "t": "  // ulanmagan — klient urinmayapti (token noto'g'ri — server ulanishni yopdi)",
   "n": 48
  },
  {
   "t": "  const HOLAT = { ulangan: 'Ulangan', ulanmoqda: 'Ulanmoqda…', ulanmagan: 'Ulanmagan' };",
   "n": 49
  },
  {
   "t": "  const STATUS = { NEW: 'Yangi', CONFIRMED: 'Tasdiqlandi', DELIVERED: 'Yetkazildi', CANCELLED: 'Bekor' };",
   "n": 50
  },
  {
   "t": "  const el = (id) => document.getElementById(id);",
   "n": 51
  },
  {
   "t": "  // Telegram'dan kelgan ism va mahsulot nomi — matn sifatida (ichida HTML bo'lsa ham ishlamaydi)",
   "n": 52
  },
  {
   "t": "  const esc = (v) => String(v).replace(/[&<>\"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#39;' })[c]);",
   "n": 53
  },
  {
   "t": "  let token = localStorage.getItem(\u0027adminToken') || '';",
   "n": 54
  },
  {
   "t": "  let ulanish = null;",
   "n": 55
  },
  {
   "t": "  let oxirgiId = 0;",
   "n": 56
  },
  {
   "t": "",
   "n": 57
  },
  {
   "t": "  function holatQoy(h) {",
   "n": 58
  },
  {
   "t": "    el('holat').className = h;",
   "n": 59
  },
  {
   "t": "    el('holat').textContent = HOLAT[h];",
   "n": 60
  },
  {
   "t": "  }",
   "n": 61
  },
  {
   "t": "",
   "n": 62
  },
  {
   "t": "  // Ro'yxat — har doim Backend'dan (GET /admin/orders). Hodisa faqat «nimadir o'zgardi» deydi.",
   "n": 63
  },
  {
   "t": "  async function yukla() {",
   "n": 64
  },
  {
   "t": "    const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });",
   "n": 65
  },
  {
   "t": "    if (r.status === 401) {",
   "n": 66
  },
  {
   "t": "      el('royxat').innerHTML = \"<tr><td colspan='7'>Token noto'g'ri</td></tr>\";",
   "n": 67
  },
  {
   "t": "      return;",
   "n": 68
  },
  {
   "t": "    }",
   "n": 69
  },
  {
   "t": "    const list = await r.json();",
   "n": 70
  },
  {
   "t": "    const eng = list.length ? list[0].id : 0;",
   "n": 71
  },
  {
   "t": "    el('royxat').innerHTML = list.length",
   "n": 72
  },
  {
   "t": "      ? list.map((o) => `<tr class=\"${o.id > oxirgiId && oxirgiId ? 'yangi' : ''}\">",
   "n": 73
  },
  {
   "t": "          <td>${o.id}</td><td>${esc(o.customer)}</td><td>${esc(o.phone)}</td>",
   "n": 74
  },
  {
   "t": "          <td>${o.items.map((i) => `${esc(i.name)} × ${i.qty}`).join('<br>')}</td>",
   "n": 75
  },
  {
   "t": "          <td>${o.total.toLocaleString('ru-RU')} so'm</td><td>${STATUS[o.status] || o.status}</td>",
   "n": 76
  },
  {
   "t": "          <td>${new Date(o.created_at).toLocaleTimeString('ru-RU')}</td></tr>`).join('')",
   "n": 77
  },
  {
   "t": "      : \"<tr><td colspan='7'>Hali buyurtma yo'q</td></tr>\";",
   "n": 78
  },
  {
   "t": "    oxirgiId = eng;",
   "n": 79
  },
  {
   "t": "  }",
   "n": 80
  },
  {
   "t": "",
   "n": 81
  },
  {
   "t": "  function ulan() {",
   "n": 82
  },
  {
   "t": "    if (ulanish) ulanish.close();",
   "n": 83
  },
  {
   "t": "    ulanish = io({ auth: { token } });",
   "n": 84
  },
  {
   "t": "    holatQoy('ulanmoqda');",
   "n": 85
  },
  {
   "t": "    ulanish.on('connect', () => holatQoy('ulangan'));",
   "n": 86
  },
  {
   "t": "    // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»",
   "n": 87
  },
  {
   "t": "    ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));",
   "n": 88
  },
  {
   "t": "    ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));",
   "n": 89
  },
  {
   "t": "    ulanish.on('order-changed', () => yukla());",
   "n": 90
  },
  {
   "t": "  }",
   "n": 91
  },
  {
   "t": "",
   "n": 92
  },
  {
   "t": "  el('kirish').addEventListener('submit', (e) => {",
   "n": 93
  },
  {
   "t": "    e.preventDefault();",
   "n": 94
  },
  {
   "t": "    token = el('token').value.trim();",
   "n": 95
  },
  {
   "t": "    localStorage.setItem(\u0027adminToken', token);",
   "n": 96
  },
  {
   "t": "    yukla();",
   "n": 97
  },
  {
   "t": "    ulan();",
   "n": 98
  },
  {
   "t": "  });",
   "n": 99
  },
  {
   "t": "",
   "n": 100
  },
  {
   "t": "  if (token) {",
   "n": 101
  },
  {
   "t": "    el('token').value = token;",
   "n": 102
  },
  {
   "t": "    yukla();",
   "n": 103
  },
  {
   "t": "    ulan();",
   "n": 104
  },
  {
   "t": "  }",
   "n": 105
  },
  {
   "t": "</script>",
   "n": 106
  },
  {
   "t": "</body>",
   "n": 107
  },
  {
   "t": "</html>",
   "n": 108
  }
 ]
};
const KOD_HTML_XATO = {
 "file": "public/admin.html",
 "tag": "xato nusxa",
 "lines": [
  {
   "t": "<!doctype html>",
   "n": 1
  },
  {
   "t": "<html lang=\"uz\">",
   "n": 2
  },
  {
   "t": "<head>",
   "n": 3
  },
  {
   "t": "<meta charset=\"utf-8\">",
   "n": 4
  },
  {
   "t": "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
   "n": 5
  },
  {
   "t": "<title>Buyurtmalar — jonli panel</title>",
   "n": 6
  },
  {
   "t": "<style>",
   "n": 7
  },
  {
   "t": "  :root { --ink: #1f2328; --mute: #57606a; --line: #d0d7de; --ok: #1a7f37; --wait: #9a6700; --bad: #cf222e; --bg: #f6f8fa; }",
   "n": 8
  },
  {
   "t": "  * { box-sizing: border-box; }",
   "n": 9
  },
  {
   "t": "  body { margin: 0; font: 15px/1.45 system-ui, sans-serif; color: var(--ink); background: var(--bg); }",
   "n": 10
  },
  {
   "t": "  header { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: #fff; border-bottom: 1px solid var(--line); }",
   "n": 11
  },
  {
   "t": "  h1 { margin: 0; font-size: 18px; }",
   "n": 12
  },
  {
   "t": "  #holat { margin-left: auto; padding: 4px 10px; border-radius: 999px; font-weight: 600; font-size: 13px; color: #fff; background: var(--mute); }",
   "n": 13
  },
  {
   "t": "  #holat.ulangan { background: var(--ok); }",
   "n": 14
  },
  {
   "t": "  #holat.ulanmoqda { background: var(--wait); }",
   "n": 15
  },
  {
   "t": "  #holat.ulanmagan { background: var(--bad); }",
   "n": 16
  },
  {
   "t": "  main { padding: 16px 20px; max-width: 1000px; margin: 0 auto; }",
   "n": 17
  },
  {
   "t": "  form { display: flex; gap: 8px; margin-bottom: 14px; }",
   "n": 18
  },
  {
   "t": "  input { flex: 1; padding: 8px 10px; border: 1px solid var(--line); border-radius: 6px; font: inherit; }",
   "n": 19
  },
  {
   "t": "  button { padding: 8px 14px; border: 0; border-radius: 6px; background: var(--ink); color: #fff; font: inherit; cursor: pointer; }",
   "n": 20
  },
  {
   "t": "  table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }",
   "n": 21
  },
  {
   "t": "  th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--line); vertical-align: top; }",
   "n": 22
  },
  {
   "t": "  th { background: var(--bg); font-size: 13px; color: var(--mute); }",
   "n": 23
  },
  {
   "t": "  tr.yangi td { background: #fff8c5; }",
   "n": 24
  },
  {
   "t": "  .izoh { color: var(--mute); font-size: 13px; margin: 10px 0 0; }",
   "n": 25
  },
  {
   "t": "</style>",
   "n": 26
  },
  {
   "t": "</head>",
   "n": 27
  },
  {
   "t": "<body>",
   "n": 28
  },
  {
   "t": "<header>",
   "n": 29
  },
  {
   "t": "  <h1>Buyurtmalar — jonli panel</h1>",
   "n": 30
  },
  {
   "t": "  <span id=\"holat\">Ulanmagan</span>",
   "n": 31
  },
  {
   "t": "</header>",
   "n": 32
  },
  {
   "t": "<main>",
   "n": 33
  },
  {
   "t": "  <form id=\"kirish\">",
   "n": 34
  },
  {
   "t": "    <input id=\"token\" type=\"password\" placeholder=\".env dagi ADMIN_PANEL_TOKEN\" autocomplete=\"off\">",
   "n": 35
  },
  {
   "t": "    <button>Kirish</button>",
   "n": 36
  },
  {
   "t": "  </form>",
   "n": 37
  },
  {
   "t": "  <table>",
   "n": 38
  },
  {
   "t": "    <thead><tr><th>#</th><th>Mijoz</th><th>Telefon</th><th>Mahsulotlar</th><th>Jami</th><th>Holat</th><th>Vaqt</th></tr></thead>",
   "n": 39
  },
  {
   "t": "    <tbody id=\"royxat\"><tr><td colspan=\"7\">Token kiriting</td></tr></tbody>",
   "n": 40
  },
  {
   "t": "  </table>",
   "n": 41
  },
  {
   "t": "  <p class=\"izoh\">Yangi buyurtma yoki holat o'zgarsa, ro'yxat o'zi yangilanadi — sahifani qayta ochish shart emas.</p>",
   "n": 42
  },
  {
   "t": "</main>",
   "n": 43
  },
  {
   "t": "<!-- socket.io klienti: server o'zi beradi (/socket.io/socket.io.js) -->",
   "n": 44
  },
  {
   "t": "<script src=\"/socket.io/socket.io.js\"></script>",
   "n": 45
  },
  {
   "t": "<script>",
   "n": 46
  },
  {
   "t": "  // Uch holat: ulangan — hodisalar keladi · ulanmoqda — ulanish yo'q, klient o'zi qayta urinmoqda ·",
   "n": 47
  },
  {
   "t": "  // ulanmagan — klient urinmayapti (token noto'g'ri — server ulanishni yopdi)",
   "n": 48
  },
  {
   "t": "  const HOLAT = { ulangan: 'Ulangan', ulanmoqda: 'Ulanmoqda…', ulanmagan: 'Ulanmagan' };",
   "n": 49
  },
  {
   "t": "  const STATUS = { NEW: 'Yangi', CONFIRMED: 'Tasdiqlandi', DELIVERED: 'Yetkazildi', CANCELLED: 'Bekor' };",
   "n": 50
  },
  {
   "t": "  const el = (id) => document.getElementById(id);",
   "n": 51
  },
  {
   "t": "  // Telegram'dan kelgan ism va mahsulot nomi — matn sifatida (ichida HTML bo'lsa ham ishlamaydi)",
   "n": 52
  },
  {
   "t": "  const esc = (v) => String(v).replace(/[&<>\"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#39;' })[c]);",
   "n": 53
  },
  {
   "t": "  let token = localStorage.getItem(\u0027adminToken') || '';",
   "n": 54
  },
  {
   "t": "  let ulanish = null;",
   "n": 55
  },
  {
   "t": "  let oxirgiId = 0;",
   "n": 56
  },
  {
   "t": "",
   "n": 57
  },
  {
   "t": "  function holatQoy(h) {",
   "n": 58
  },
  {
   "t": "    el('holat').className = h;",
   "n": 59
  },
  {
   "t": "    el('holat').textContent = HOLAT[h];",
   "n": 60
  },
  {
   "t": "  }",
   "n": 61
  },
  {
   "t": "",
   "n": 62
  },
  {
   "t": "  // Ro'yxat — har doim Backend'dan (GET /admin/orders). Hodisa faqat «nimadir o'zgardi» deydi.",
   "n": 63
  },
  {
   "t": "  // Ikki joyda chaqiriladi: connect (birinchi va har qayta ulanish) va order-changed.",
   "n": 64
  },
  {
   "t": "  async function yukla() {",
   "n": 65
  },
  {
   "t": "    const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });",
   "n": 66
  },
  {
   "t": "    if (r.status === 401) {",
   "n": 67
  },
  {
   "t": "      el('royxat').innerHTML = \"<tr><td colspan='7'>Token noto'g'ri</td></tr>\";",
   "n": 68
  },
  {
   "t": "      return;",
   "n": 69
  },
  {
   "t": "    }",
   "n": 70
  },
  {
   "t": "    const list = await r.json();",
   "n": 71
  },
  {
   "t": "    const eng = list.length ? list[0].id : 0;",
   "n": 72
  },
  {
   "t": "    el('royxat').innerHTML = list.length",
   "n": 73
  },
  {
   "t": "      ? list.map((o) => `<tr class=\"${o.id > oxirgiId && oxirgiId ? 'yangi' : ''}\">",
   "n": 74
  },
  {
   "t": "          <td>${o.id}</td><td>${esc(o.customer)}</td><td>${esc(o.phone)}</td>",
   "n": 75
  },
  {
   "t": "          <td>${o.items.map((i) => `${esc(i.name)} × ${i.qty}`).join('<br>')}</td>",
   "n": 76
  },
  {
   "t": "          <td>${o.total.toLocaleString('ru-RU')} so'm</td><td>${STATUS[o.status] || o.status}</td>",
   "n": 77
  },
  {
   "t": "          <td>${new Date(o.created_at).toLocaleTimeString('ru-RU')}</td></tr>`).join('')",
   "n": 78
  },
  {
   "t": "      : \"<tr><td colspan='7'>Hali buyurtma yo'q</td></tr>\";",
   "n": 79
  },
  {
   "t": "    oxirgiId = eng;",
   "n": 80
  },
  {
   "t": "  }",
   "n": 81
  },
  {
   "t": "",
   "n": 82
  },
  {
   "t": "  function ulan() {",
   "n": 83
  },
  {
   "t": "    if (ulanish) ulanish.close();",
   "n": 84
  },
  {
   "t": "    ulanish = io({ auth: { token } });",
   "n": 85
  },
  {
   "t": "    holatQoy('ulanmoqda');",
   "n": 86
  },
  {
   "t": "    // connect — birinchi ulanishda HAM har qayta ulanishda: uzilish paytidagi hodisa kelmaydi, shuning uchun ro'yxat qayta so'raladi",
   "n": 87
  },
  {
   "t": "    ulanish.on('connect', () => {",
   "n": 88
  },
  {
   "t": "      holatQoy('ulangan');",
   "n": 89
  },
  {
   "t": "      yukla();",
   "n": 90
  },
  {
   "t": "      ulanish.on('order-changed', () => yukla());",
   "n": 91
  },
  {
   "t": "    });",
   "n": 92
  },
  {
   "t": "    // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»",
   "n": 93
  },
  {
   "t": "    ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));",
   "n": 94
  },
  {
   "t": "    ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));",
   "n": 95
  },
  {
   "t": "  }",
   "n": 96
  },
  {
   "t": "",
   "n": 97
  },
  {
   "t": "  el('kirish').addEventListener('submit', (e) => {",
   "n": 98
  },
  {
   "t": "    e.preventDefault();",
   "n": 99
  },
  {
   "t": "    token = el('token').value.trim();",
   "n": 100
  },
  {
   "t": "    localStorage.setItem(\u0027adminToken', token);",
   "n": 101
  },
  {
   "t": "    ulan();",
   "n": 102
  },
  {
   "t": "  });",
   "n": 103
  },
  {
   "t": "",
   "n": 104
  },
  {
   "t": "  if (token) {",
   "n": 105
  },
  {
   "t": "    el('token').value = token;",
   "n": 106
  },
  {
   "t": "    ulan();",
   "n": 107
  },
  {
   "t": "  }",
   "n": 108
  },
  {
   "t": "</script>",
   "n": 109
  },
  {
   "t": "</body>",
   "n": 110
  },
  {
   "t": "</html>",
   "n": 111
  }
 ]
};
const KOD_GATEWAY_TIKLASH = {
 "file": "src/api/live/live.gateway.ts",
 "tag": "tiklash nusxa",
 "lines": [
  {
   "t": "import { Logger } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import {",
   "n": 2
  },
  {
   "t": "  OnGatewayConnection,",
   "n": 3
  },
  {
   "t": "  OnGatewayDisconnect,",
   "n": 4
  },
  {
   "t": "  WebSocketGateway,",
   "n": 5
  },
  {
   "t": "  WebSocketServer,",
   "n": 6
  },
  {
   "t": "} from '@nestjs/websockets';",
   "n": 7
  },
  {
   "t": "import type { Server, Socket } from 'socket.io';",
   "n": 8
  },
  {
   "t": "import { isAdminToken } from './admin-token';",
   "n": 9
  },
  {
   "t": "",
   "n": 10
  },
  {
   "t": "// gateway — doimiy ulanishlarni qabul qiladigan klass (socket.io). HTTP server bilan bitta portda turadi (PORT).",
   "n": 11
  },
  {
   "t": "// Panel bir marta ulanadi va ulanayotganda tokenni yuboradi: io(manzil, { auth: { token } }).",
   "n": 12
  },
  {
   "t": "// Token ulanish ochilayotganda tekshiriladi: yo'q yoki noto'g'ri bo'lsa — server ulanishni yopadi",
   "n": 13
  },
  {
   "t": "// (server yopgan ulanishga klient o'zi qayta ulanmaydi — panelda «Ulanmagan»).",
   "n": 14
  },
  {
   "t": "// Hodisa order-changed — { orderId, reason }: qaysi buyurtma va nega o'zgargani.",
   "n": 15
  },
  {
   "t": "// Yangi holatni panel GET /admin/orders dan qayta so'raydi — hodisa ichida ro'yxat ham, son ham yo'q.",
   "n": 16
  },
  {
   "t": "export type OrderChangeReason = 'new' | 'status';",
   "n": 17
  },
  {
   "t": "",
   "n": 18
  },
  {
   "t": "@WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 } })",
   "n": 19
  },
  {
   "t": "export class LiveGateway implements OnGatewayConnection, OnGatewayDisconnect {",
   "n": 20
  },
  {
   "t": "  private readonly log = new Logger('Live');",
   "n": 21
  },
  {
   "t": "",
   "n": 22
  },
  {
   "t": "  @WebSocketServer()",
   "n": 23
  },
  {
   "t": "  server?: Server;",
   "n": 24
  },
  {
   "t": "",
   "n": 25
  },
  {
   "t": "  handleConnection(client: Socket) {",
   "n": 26
  },
  {
   "t": "    if (!isAdminToken(client.handshake.auth?.token)) {",
   "n": 27
  },
  {
   "t": "      client.disconnect();",
   "n": 28
  },
  {
   "t": "      return;",
   "n": 29
  },
  {
   "t": "    }",
   "n": 30
  },
  {
   "t": "    client.data.admin = true;",
   "n": 31
  },
  {
   "t": "    this.log.log(`panel ulandi: ${client.id}`);",
   "n": 32
  },
  {
   "t": "  }",
   "n": 33
  },
  {
   "t": "",
   "n": 34
  },
  {
   "t": "  handleDisconnect(client: Socket) {",
   "n": 35
  },
  {
   "t": "    if (client.data.admin) this.log.log(`panel uzildi: ${client.id}`);",
   "n": 36
  },
  {
   "t": "  }",
   "n": 37
  },
  {
   "t": "",
   "n": 38
  },
  {
   "t": "  // Bazadagi o'zgarish tugagandan keyin chaqiriladi (tranzaksiya yopilgach). Oladi — hamma ulangan panel.",
   "n": 39
  },
  {
   "t": "  // server yo'q bo'lsa (masalan, smoke HTTP'siz ishga tushirganda) — hodisa yuborilmaydi, bot ishlayveradi.",
   "n": 40
  },
  {
   "t": "  orderChanged(orderId: number, reason: OrderChangeReason) {",
   "n": 41
  },
  {
   "t": "    this.server?.emit('order-changed', { orderId, reason });",
   "n": 42
  },
  {
   "t": "  }",
   "n": 43
  },
  {
   "t": "}",
   "n": 44
  }
 ]
};
const KOD_README_START = {
 "file": "README.md",
 "tag": "ws2-start",
 "lines": [
  {
   "t": "## Jonli panel (WebSocket)",
   "n": 40
  },
  {
   "t": "Do'kon kompyuterida ochiq turadigan sahifa: **http://localhost:3000/admin** → `.env` dagi `ADMIN_PANEL_TOKEN` ni kiriting.",
   "n": 42
  },
  {
   "t": "Bot yangi buyurtma olganda yoki admin holatni o'zgartirganda ro'yxat **o'zi yangilanadi** — sahifani qayta ochish shart emas.",
   "n": 43
  },
  {
   "t": "| Real vaqt nuqtasi | Kim nima qiladi | Hodisa | Kim oladi | Panelda nima o'zgaradi |",
   "n": 45
  },
  {
   "t": "|---|---|---|---|---|",
   "n": 46
  },
  {
   "t": "| buyurtmalar ro'yxati | mijoz botda buyurtma beradi | `order-changed` · `reason: 'new'` | hamma ulangan panel | yangi qator (sariq) |",
   "n": 47
  },
  {
   "t": "| buyurtma holati | admin botda «Tasdiqlash / Yetkazildi / Bekor» bosadi | `order-changed` · `reason: 'status'` | hamma ulangan panel | «Holat» ustuni |",
   "n": 48
  },
  {
   "t": "`order-changed` — `{ orderId, reason }`: faqat qaysi buyurtma va nega. Yangi ro'yxatni panel `GET /admin/orders` dan qayta so'raydi (token — `Authorization: Bearer …`).",
   "n": 50
  },
  {
   "t": "Hodisa tranzaksiya tugagandan keyin yuboriladi: panel so'raganda buyurtma bazada bor.",
   "n": 51
  },
  {
   "t": "- Ulanish — socket.io (`@nestjs/websockets`, `@nestjs/platform-socket.io`), HTTP bilan bitta portda. Token ulanish ochilayotganda tekshiriladi (`auth: { token }`); noto'g'ri bo'lsa server ulanishni yopadi.",
   "n": 53
  },
  {
   "t": "- Panel belgisi: **Ulangan** — hodisalar keladi · **Ulanmoqda…** — server javob bermayapti, klient o'zi qayta urinmoqda · **Ulanmagan** — token noto'g'ri, klient urinmaydi.",
   "n": 54
  },
  {
   "t": "- Brauzersiz tekshirish: `npm run live` — terminal klienti (`npm run live -- notogri` — noto'g'ri token bilan).",
   "n": 55
  },
  {
   "t": "- Telegram'siz tekshirish: `npm run smoke -- live`.",
   "n": 56
  }
 ]
};
const KOD_README = {
 "file": "README.md",
 "tag": "ws2-done",
 "lines": [
  {
   "t": "## Jonli panel (WebSocket)",
   "n": 40
  },
  {
   "t": "Do'kon kompyuterida ochiq turadigan sahifa: **http://localhost:3000/admin** → `.env` dagi `ADMIN_PANEL_TOKEN` ni kiriting.",
   "n": 42
  },
  {
   "t": "Bot yangi buyurtma olganda yoki admin holatni o'zgartirganda ro'yxat **o'zi yangilanadi** — sahifani qayta ochish shart emas.",
   "n": 43
  },
  {
   "t": "| Real vaqt nuqtasi | Kim nima qiladi | Hodisa | Kim oladi | Panelda nima o'zgaradi |",
   "n": 45
  },
  {
   "t": "|---|---|---|---|---|",
   "n": 46
  },
  {
   "t": "| buyurtmalar ro'yxati | mijoz botda buyurtma beradi | `order-changed` · `reason: 'new'` | hamma ulangan panel | yangi qator (sariq) |",
   "n": 47
  },
  {
   "t": "| buyurtma holati | admin botda «Tasdiqlash / Yetkazildi / Bekor» bosadi | `order-changed` · `reason: 'status'` | hamma ulangan panel | «Holat» ustuni |",
   "n": 48
  },
  {
   "t": "`order-changed` — `{ orderId, reason }`: faqat qaysi buyurtma va nega. Yangi ro'yxatni panel `GET /admin/orders` dan qayta so'raydi (token — `Authorization: Bearer …`).",
   "n": 50
  },
  {
   "t": "Hodisa tranzaksiya tugagandan keyin yuboriladi: panel so'raganda buyurtma bazada bor.",
   "n": 51
  },
  {
   "t": "- Ulanish — socket.io (`@nestjs/websockets`, `@nestjs/platform-socket.io`), HTTP bilan bitta portda. Token ulanish ochilayotganda tekshiriladi (`auth: { token }`); noto'g'ri bo'lsa server ulanishni yopadi.",
   "n": 53
  },
  {
   "t": "- Panel belgisi: **Ulangan** — hodisalar keladi · **Ulanmoqda…** — server javob bermayapti, klient o'zi qayta urinmoqda · **Ulanmagan** — token noto'g'ri, klient urinmaydi.",
   "n": 54
  },
  {
   "t": "- Brauzersiz tekshirish: `npm run live` — terminal klienti (`npm run live -- notogri` — noto'g'ri token bilan).",
   "n": 55
  },
  {
   "t": "- Telegram'siz tekshirish: `npm run smoke -- live`.",
   "n": 56
  },
  {
   "t": "### Qayta ulanish: uzilish paytidagi hodisa kelmaydi",
   "n": 58
  },
  {
   "t": "socket.io ulanishni o'zi tiklaydi, lekin **ulanish yo'q paytda yuborilgan `order-changed` qayta kelmaydi**: server uni faqat hozir ulangan panellarga yuboradi. Shuning uchun panel **har `connect` da** (birinchi va har qayta ulanishda) ro'yxatni `GET /admin/orders` dan qayta so'raydi. `npm run live` ham shunday: `connect` dan keyin `GET /admin/orders → N ta, eng yangisi #…`.",
   "n": 60
  },
  {
   "t": "- Ro'yxat ikki joyda so'raladi: `connect` va `order-changed`. Tinglovchi **bir marta, `connect` dan tashqarida** qo'shiladi — ichida bo'lsa har qayta ulanishda yana bittasi qo'shiladi va bitta hodisaga bir nechta `GET` ketadi.",
   "n": 62
  },
  {
   "t": "- Qanday buziladi va qanday tekshiriladi — `BUZISH.md`.",
   "n": 63
  }
 ]
};
const KOD_MJ_UL_START = {
 "file": "mobil/src/ulanish.ts",
 "tag": "m12-dars-05-start",
 "lines": [
  {
   "t": "import { useEffect, useState } from 'react';",
   "n": 1
  },
  {
   "t": "import { AppState, type AppStateStatus, type NativeEventSubscription } from 'react-native';",
   "n": 2
  },
  {
   "t": "import { io, type Socket } from 'socket.io-client';",
   "n": 3
  },
  {
   "t": "",
   "n": 4
  },
  {
   "t": "import { API, tokenOl } from '@/api';",
   "n": 5
  },
  {
   "t": "import { kunNomi } from '@/kun';",
   "n": 6
  },
  {
   "t": "import { oxirgiRoyxat, oyinlarniOl, type Oyin } from '@/oyin';",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "// Doimiy ulanish (socket.io): ilova Backend'ga bir marta ulanadi, ulanish ochiq turadi.",
   "n": 9
  },
  {
   "t": "// Manzil — o'sha EXPO_PUBLIC_API_URL; ulanayotganda token yuboriladi (auth) — Backend uni shu paytda tekshiradi.",
   "n": 10
  },
  {
   "t": "// Hodisa oyin-ozgardi { oyinId, sabab } kelganda ilova GET /oyinlar ni bir marta qayta so'raydi —",
   "n": 11
  },
  {
   "t": "// «O'yinlar» va «O'yin» shu bitta javobdan yangilanadi (oyin.ts). Hodisa o'zgarish bo'lganini aytadi; yangi holat — Backend'dan.",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "// Uch ulanish holati:",
   "n": 14
  },
  {
   "t": "// ulangan — hodisalar keladi · ulanmoqda — ulanish yo'q, ilova o'zi ulanishga urinmoqda (birinchi marta yoki uzilgandan keyin) ·",
   "n": 15
  },
  {
   "t": "// ulanmagan — ilova urinmayapti (token yo'q yoki yaroqsiz, yoki hisobdan chiqilgan)",
   "n": 16
  },
  {
   "t": "export type UlanishHolati = 'ulangan' | 'ulanmoqda' | 'ulanmagan';",
   "n": 17
  },
  {
   "t": "",
   "n": 18
  },
  {
   "t": "let ulanish: Socket | null = null;",
   "n": 19
  },
  {
   "t": "let ilovaHolati: NativeEventSubscription | null = null;",
   "n": 20
  },
  {
   "t": "let holat: UlanishHolati = 'ulanmagan';",
   "n": 21
  },
  {
   "t": "const holatniKuzatuvchilar = new Set<(h: UlanishHolati) => void>();",
   "n": 22
  },
  {
   "t": "",
   "n": 23
  },
  {
   "t": "// «Hozir ko'ryapti»: Backend xonaga yuborgan son — o'yin bo'yicha (korayotganlar-ozgardi { oyinId, soni })",
   "n": 24
  },
  {
   "t": "const korayotganlar = new Map<number, number>();",
   "n": 25
  },
  {
   "t": "const korayotganlarniKuzatuvchilar = new Set<() => void>();",
   "n": 26
  },
  {
   "t": "",
   "n": 27
  },
  {
   "t": "function holatQoy(yangi: UlanishHolati) {",
   "n": 28
  },
  {
   "t": "  holat = yangi;",
   "n": 29
  },
  {
   "t": "  holatniKuzatuvchilar.forEach((k) => k(yangi));",
   "n": 30
  },
  {
   "t": "}",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "// Uzilish yoki ulanish xatosidan keyin: socket.io o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda»,",
   "n": 33
  },
  {
   "t": "// Backend yopgan bo'lsa (token yaroqsiz) yoki ilova o'zi yopgan bo'lsa — «ulanmagan»",
   "n": 34
  },
  {
   "t": "function uzilishdanKeyin() {",
   "n": 35
  },
  {
   "t": "  holatQoy(ulanish?.active ? 'ulanmoqda' : 'ulanmagan');",
   "n": 36
  },
  {
   "t": "}",
   "n": 37
  },
  {
   "t": "",
   "n": 38
  },
  {
   "t": "// Ulanishni ochadi — token o'qib bo'lingandan keyingina. Ulanish bor bo'lsa — qayta ochilmaydi:",
   "n": 39
  },
  {
   "t": "// ekran necha marta ochilsa ham ulanish va uning tinglovchilari bitta.",
   "n": 40
  },
  {
   "t": "export async function ulan() {",
   "n": 41
  },
  {
   "t": "  if (ulanish) return;",
   "n": 42
  },
  {
   "t": "  const token = await tokenOl();",
   "n": 43
  },
  {
   "t": "  if (!token || ulanish) return;",
   "n": 44
  },
  {
   "t": "",
   "n": 45
  },
  {
   "t": "  ulanish = io(API, { auth: { token } });",
   "n": 46
  },
  {
   "t": "  holatQoy('ulanmoqda');",
   "n": 47
  },
  {
   "t": "  ulanish.on('connect', () => {",
   "n": 48
  },
  {
   "t": "    holatQoy('ulangan');",
   "n": 49
  },
  {
   "t": "    ulanish?.on('oyin-ozgardi', async () => {",
   "n": 50
  },
  {
   "t": "      const oldingi = oxirgiRoyxat();",
   "n": 51
  },
  {
   "t": "      const yangi = await qaytaSora();",
   "n": 52
  },
  {
   "t": "      if (oldingi && yangi) jonliXabarlar(oldingi, yangi).forEach(jonliXabarQosh);",
   "n": 53
  },
  {
   "t": "    });",
   "n": 54
  },
  {
   "t": "  });",
   "n": 55
  },
  {
   "t": "  ulanish.on('disconnect', uzilishdanKeyin);",
   "n": 56
  },
  {
   "t": "  ulanish.on('connect_error', uzilishdanKeyin);",
   "n": 57
  },
  {
   "t": "  ulanish.on('korayotganlar-ozgardi', (m: { oyinId: number; soni: number }) => {",
   "n": 58
  },
  {
   "t": "    korayotganlar.set(m.oyinId, m.soni);",
   "n": 59
  },
  {
   "t": "    korayotganlarniKuzatuvchilar.forEach((k) => k());",
   "n": 60
  },
  {
   "t": "  });",
   "n": 61
  },
  {
   "t": "",
   "n": 62
  },
  {
   "t": "  // Ilova fonda turganda o'zgarish bo'lsa: fondan qaytganda ro'yxat qayta so'raladi",
   "n": 63
  },
  {
   "t": "  let oldingi: string | null | undefined = AppState.currentState;",
   "n": 64
  },
  {
   "t": "  ilovaHolati = AppState.addEventListener('change', (yangi: AppStateStatus) => {",
   "n": 65
  },
  {
   "t": "    if (oldingi === 'background' && yangi === 'active') qaytaSora();",
   "n": 66
  },
  {
   "t": "    oldingi = yangi;",
   "n": 67
  },
  {
   "t": "  });",
   "n": 68
  },
  {
   "t": "}",
   "n": 69
  },
  {
   "t": "",
   "n": 70
  },
  {
   "t": "// Hodisadan keyin — GET /oyinlar bir marta; xato bo'lsa ekranda eski ro'yxat qoladi (pastga tortib yangilash ishlaydi)",
   "n": 71
  },
  {
   "t": "function qaytaSora(): Promise<Oyin[] | null> {",
   "n": 72
  },
  {
   "t": "  return oyinlarniOl().catch(() => null);",
   "n": 73
  },
  {
   "t": "}",
   "n": 74
  },
  {
   "t": "",
   "n": 75
  },
  {
   "t": "// Jonli xabar — ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar (_layout.tsx ko'rsatadi).",
   "n": 76
  },
  {
   "t": "// Qaysi xabar — sababga qarab emas: hodisadan keyingi javob oldingisi bilan solishtiriladi.",
   "n": 77
  },
  {
   "t": "// Faqat o'ziga tegishli o'yin uchun (qo'shilgan, navbatda yoki o'zi e'lon qilgan); o'z harakati uchun chiqmaydi; ism yo'q.",
   "n": 78
  },
  {
   "t": "// O'z harakati — javobdagi o'z maydonlarim (menQoshilganman, menNavbatdaman, menTasdiqlaganman) o'zgargan",
   "n": 79
  },
  {
   "t": "// (navbatdan o'yinga o'tish bundan mustasno). Hodisaga yangi maydon qo'shilmagan.",
   "n": 80
  },
  {
   "t": "export function jonliXabarlar(oldingi: Oyin[], yangi: Oyin[]): string[] {",
   "n": 81
  },
  {
   "t": "  const xabarlar: string[] = [];",
   "n": 82
  },
  {
   "t": "  for (const y of yangi) {",
   "n": 83
  },
  {
   "t": "    const o = oldingi.find((x) => x.id === y.id);",
   "n": 84
  },
  {
   "t": "    if (!o) continue; // yangi e'lon — ro'yxatda jim paydo bo'ladi",
   "n": 85
  },
  {
   "t": "    const nom = `${kunNomi(y.kun)}, ${y.soat}`;",
   "n": 86
  },
  {
   "t": "    if (o.menNavbatdaman && y.menQoshilganman) {",
   "n": 87
  },
  {
   "t": "      xabarlar.push(`Navbatdan o'yinga o'tdingiz: ${nom}`);",
   "n": 88
  },
  {
   "t": "      continue;",
   "n": 89
  },
  {
   "t": "    }",
   "n": 90
  },
  {
   "t": "    const tegishli = y.menQoshilganman || y.menNavbatdaman || y.menTashkilotchiman;",
   "n": 91
  },
  {
   "t": "    const ozim =",
   "n": 92
  },
  {
   "t": "      o.menQoshilganman !== y.menQoshilganman ||",
   "n": 93
  },
  {
   "t": "      o.menNavbatdaman !== y.menNavbatdaman ||",
   "n": 94
  },
  {
   "t": "      o.menTasdiqlaganman !== y.menTasdiqlaganman;",
   "n": 95
  },
  {
   "t": "    if (!tegishli || ozim) continue;",
   "n": 96
  },
  {
   "t": "    if (y.qoshilgan > o.qoshilgan) {",
   "n": 97
  },
  {
   "t": "      xabarlar.push(",
   "n": 98
  },
  {
   "t": "        y.qoshilgan >= y.kerak",
   "n": 99
  },
  {
   "t": "          ? `${nom} — o'yin to'ldi: ${y.qoshilgan} / ${y.kerak}`",
   "n": 100
  },
  {
   "t": "          : `${nom} — yana bir o'yinchi qo'shildi: ${y.qoshilgan} / ${y.kerak}`,",
   "n": 101
  },
  {
   "t": "      );",
   "n": 102
  },
  {
   "t": "    } else if (y.qoshilgan < o.qoshilgan) {",
   "n": 103
  },
  {
   "t": "      xabarlar.push(`${nom} — joy bo'shadi: ${y.qoshilgan} / ${y.kerak}`);",
   "n": 104
  },
  {
   "t": "    }",
   "n": 105
  },
  {
   "t": "    // Son o'zgarmasa (chiqqan o'rniga navbatdagi kirdi) — boshqalarga xabar yo'q",
   "n": 106
  },
  {
   "t": "    if (y.tasdiqlagan !== null && o.tasdiqlagan !== null && y.tasdiqlagan > o.tasdiqlagan) {",
   "n": 107
  },
  {
   "t": "      xabarlar.push(`${nom} — kelishini tasdiqladi: ${y.tasdiqlagan} / ${y.qoshilgan}`);",
   "n": 108
  },
  {
   "t": "    }",
   "n": 109
  },
  {
   "t": "  }",
   "n": 110
  },
  {
   "t": "  return xabarlar;",
   "n": 111
  },
  {
   "t": "}",
   "n": 112
  },
  {
   "t": "",
   "n": 113
  },
  {
   "t": "// Ekrandagi jonli xabarlar: har biri bir necha soniyadan keyin o'zi yo'qoladi",
   "n": 114
  },
  {
   "t": "export type JonliXabar = { id: number; matn: string };",
   "n": 115
  },
  {
   "t": "const JONLI_XABAR_SONIYA = 4;",
   "n": 116
  },
  {
   "t": "let jonli: JonliXabar[] = [];",
   "n": 117
  },
  {
   "t": "let keyingiId = 1;",
   "n": 118
  },
  {
   "t": "const jonliKuzatuvchilar = new Set<(x: JonliXabar[]) => void>();",
   "n": 119
  },
  {
   "t": "",
   "n": 120
  },
  {
   "t": "function jonliYangila(yangi: JonliXabar[]) {",
   "n": 121
  },
  {
   "t": "  jonli = yangi;",
   "n": 122
  },
  {
   "t": "  jonliKuzatuvchilar.forEach((k) => k(jonli));",
   "n": 123
  },
  {
   "t": "}",
   "n": 124
  },
  {
   "t": "",
   "n": 125
  },
  {
   "t": "function jonliXabarQosh(matn: string) {",
   "n": 126
  },
  {
   "t": "  const xabar = { id: keyingiId++, matn };",
   "n": 127
  },
  {
   "t": "  jonliYangila([...jonli, xabar]);",
   "n": 128
  },
  {
   "t": "  setTimeout(() => jonliYangila(jonli.filter((x) => x.id !== xabar.id)), JONLI_XABAR_SONIYA * 1000);",
   "n": 129
  },
  {
   "t": "}",
   "n": 130
  },
  {
   "t": "",
   "n": 131
  },
  {
   "t": "export function useJonliXabarlar(): JonliXabar[] {",
   "n": 132
  },
  {
   "t": "  const [x, setX] = useState(jonli);",
   "n": 133
  },
  {
   "t": "  useEffect(() => {",
   "n": 134
  },
  {
   "t": "    jonliKuzatuvchilar.add(setX);",
   "n": 135
  },
  {
   "t": "    return () => {",
   "n": 136
  },
  {
   "t": "      jonliKuzatuvchilar.delete(setX);",
   "n": 137
  },
  {
   "t": "    };",
   "n": 138
  },
  {
   "t": "  }, []);",
   "n": 139
  },
  {
   "t": "  return x;",
   "n": 140
  },
  {
   "t": "}",
   "n": 141
  },
  {
   "t": "",
   "n": 142
  },
  {
   "t": "// Backend'ga hodisa yuborish (masalan, «O'yin» ekrani ochildi / yopildi). Ulanish bo'lmasa — hech narsa qilmaydi.",
   "n": 143
  },
  {
   "t": "export function xabarYubor(nom: string, malumot: unknown) {",
   "n": 144
  },
  {
   "t": "  ulanish?.emit(nom, malumot);",
   "n": 145
  },
  {
   "t": "}",
   "n": 146
  },
  {
   "t": "",
   "n": 147
  },
  {
   "t": "// «O'yin» ekrani uchun: shu o'yin ekranini hozir ochib turgan ulanishlar soni (hali kelmagan bo'lsa — null)",
   "n": 148
  },
  {
   "t": "export function useKorayotganlar(oyinId: number): number | null {",
   "n": 149
  },
  {
   "t": "  const [soni, setSoni] = useState(korayotganlar.get(oyinId) ?? null);",
   "n": 150
  },
  {
   "t": "  useEffect(() => {",
   "n": 151
  },
  {
   "t": "    const k = () => setSoni(korayotganlar.get(oyinId) ?? null);",
   "n": 152
  },
  {
   "t": "    korayotganlarniKuzatuvchilar.add(k);",
   "n": 153
  },
  {
   "t": "    return () => {",
   "n": 154
  },
  {
   "t": "      korayotganlarniKuzatuvchilar.delete(k);",
   "n": 155
  },
  {
   "t": "    };",
   "n": 156
  },
  {
   "t": "  }, [oyinId]);",
   "n": 157
  },
  {
   "t": "  return soni;",
   "n": 158
  },
  {
   "t": "}",
   "n": 159
  },
  {
   "t": "",
   "n": 160
  },
  {
   "t": "// «Hisobdan chiqish»: ulanish yopiladi. Qayta kirilganda ulan() yangi token bilan yangi ulanish ochadi.",
   "n": 161
  },
  {
   "t": "export function uzil() {",
   "n": 162
  },
  {
   "t": "  ilovaHolati?.remove();",
   "n": 163
  },
  {
   "t": "  ilovaHolati = null;",
   "n": 164
  },
  {
   "t": "  ulanish?.removeAllListeners();",
   "n": 165
  },
  {
   "t": "  ulanish?.disconnect();",
   "n": 166
  },
  {
   "t": "  ulanish = null;",
   "n": 167
  },
  {
   "t": "  korayotganlar.clear();",
   "n": 168
  },
  {
   "t": "  holatQoy('ulanmagan');",
   "n": 169
  },
  {
   "t": "}",
   "n": 170
  },
  {
   "t": "",
   "n": 171
  },
  {
   "t": "// Ekranda belgi uchun: hozirgi holat va uning o'zgarishi",
   "n": 172
  },
  {
   "t": "export function useUlanishHolati(): UlanishHolati {",
   "n": 173
  },
  {
   "t": "  const [h, setH] = useState(holat);",
   "n": 174
  },
  {
   "t": "  useEffect(() => {",
   "n": 175
  },
  {
   "t": "    holatniKuzatuvchilar.add(setH);",
   "n": 176
  },
  {
   "t": "    setH(holat);",
   "n": 177
  },
  {
   "t": "    return () => {",
   "n": 178
  },
  {
   "t": "      holatniKuzatuvchilar.delete(setH);",
   "n": 179
  },
  {
   "t": "    };",
   "n": 180
  },
  {
   "t": "  }, []);",
   "n": 181
  },
  {
   "t": "  return h;",
   "n": 182
  },
  {
   "t": "}",
   "n": 183
  }
 ]
};
const KOD_MJ_UL = {
 "file": "mobil/src/ulanish.ts",
 "tag": "m12-dars-05-done",
 "lines": [
  {
   "t": "import { useEffect, useState } from 'react';",
   "n": 1
  },
  {
   "t": "import { AppState, type AppStateStatus, type NativeEventSubscription } from 'react-native';",
   "n": 2
  },
  {
   "t": "import { io, type Socket } from 'socket.io-client';",
   "n": 3
  },
  {
   "t": "",
   "n": 4
  },
  {
   "t": "import { API, tokenOl } from '@/api';",
   "n": 5
  },
  {
   "t": "import { kunNomi } from '@/kun';",
   "n": 6
  },
  {
   "t": "import { oxirgiRoyxat, oyinlarniOl, type Oyin } from '@/oyin';",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "// Doimiy ulanish (socket.io): ilova Backend'ga bir marta ulanadi, ulanish ochiq turadi.",
   "n": 9
  },
  {
   "t": "// Manzil — o'sha EXPO_PUBLIC_API_URL; ulanayotganda token yuboriladi (auth) — Backend uni shu paytda tekshiradi.",
   "n": 10
  },
  {
   "t": "// Hodisa oyin-ozgardi { oyinId, sabab } kelganda ilova GET /oyinlar ni bir marta qayta so'raydi —",
   "n": 11
  },
  {
   "t": "// «O'yinlar» va «O'yin» shu bitta javobdan yangilanadi (oyin.ts). Hodisa o'zgarish bo'lganini aytadi; yangi holat — Backend'dan.",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "// Uch ulanish holati:",
   "n": 14
  },
  {
   "t": "// ulangan — hodisalar keladi · ulanmoqda — ulanish yo'q, ilova o'zi ulanishga urinmoqda (birinchi marta yoki uzilgandan keyin) ·",
   "n": 15
  },
  {
   "t": "// ulanmagan — ilova urinmayapti (token yo'q yoki yaroqsiz, yoki hisobdan chiqilgan)",
   "n": 16
  },
  {
   "t": "export type UlanishHolati = 'ulangan' | 'ulanmoqda' | 'ulanmagan';",
   "n": 17
  },
  {
   "t": "",
   "n": 18
  },
  {
   "t": "let ulanish: Socket | null = null;",
   "n": 19
  },
  {
   "t": "let ilovaHolati: NativeEventSubscription | null = null;",
   "n": 20
  },
  {
   "t": "// Hozir ochiq turgan «O'yin» ekrani (yo'q bo'lsa — null)",
   "n": 21
  },
  {
   "t": "let ochiqOyin: number | null = null;",
   "n": 22
  },
  {
   "t": "let holat: UlanishHolati = 'ulanmagan';",
   "n": 23
  },
  {
   "t": "const holatniKuzatuvchilar = new Set<(h: UlanishHolati) => void>();",
   "n": 24
  },
  {
   "t": "",
   "n": 25
  },
  {
   "t": "// «Hozir ko'ryapti»: Backend xonaga yuborgan son — o'yin bo'yicha (korayotganlar-ozgardi { oyinId, soni })",
   "n": 26
  },
  {
   "t": "const korayotganlar = new Map<number, number>();",
   "n": 27
  },
  {
   "t": "const korayotganlarniKuzatuvchilar = new Set<() => void>();",
   "n": 28
  },
  {
   "t": "",
   "n": 29
  },
  {
   "t": "function holatQoy(yangi: UlanishHolati) {",
   "n": 30
  },
  {
   "t": "  holat = yangi;",
   "n": 31
  },
  {
   "t": "  holatniKuzatuvchilar.forEach((k) => k(yangi));",
   "n": 32
  },
  {
   "t": "}",
   "n": 33
  },
  {
   "t": "",
   "n": 34
  },
  {
   "t": "// Uzilish yoki ulanish xatosidan keyin: socket.io o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda»,",
   "n": 35
  },
  {
   "t": "// Backend yopgan bo'lsa (token yaroqsiz) yoki ilova o'zi yopgan bo'lsa — «ulanmagan»",
   "n": 36
  },
  {
   "t": "function uzilishdanKeyin() {",
   "n": 37
  },
  {
   "t": "  holatQoy(ulanish?.active ? 'ulanmoqda' : 'ulanmagan');",
   "n": 38
  },
  {
   "t": "}",
   "n": 39
  },
  {
   "t": "",
   "n": 40
  },
  {
   "t": "// Ulanishni ochadi — token o'qib bo'lingandan keyingina. Ulanish bor bo'lsa — qayta ochilmaydi:",
   "n": 41
  },
  {
   "t": "// ekran necha marta ochilsa ham ulanish va uning tinglovchilari bitta.",
   "n": 42
  },
  {
   "t": "export async function ulan() {",
   "n": 43
  },
  {
   "t": "  if (ulanish) return;",
   "n": 44
  },
  {
   "t": "  const token = await tokenOl();",
   "n": 45
  },
  {
   "t": "  if (!token || ulanish) return;",
   "n": 46
  },
  {
   "t": "",
   "n": 47
  },
  {
   "t": "  ulanish = io(API, { auth: { token } });",
   "n": 48
  },
  {
   "t": "  holatQoy('ulanmoqda');",
   "n": 49
  },
  {
   "t": "  // connect birinchi ulanishda VA har qayta ulanishda ishlaydi — shuning uchun ichida tinglovchi qo'shilmaydi",
   "n": 50
  },
  {
   "t": "  // (aks holda har qayta ulanishda yana bittasi qo'shilib, bitta hodisa ikki marta ishlaydi — takror hodisa).",
   "n": 51
  },
  {
   "t": "  // Ichida faqat: qayta so'rash (uzilish paytida yuborilgan hodisa keyin kelmaydi) va ochiq o'yin xonasiga qayta kirish",
   "n": 52
  },
  {
   "t": "  // (uzilganda ulanish hamma xonadan chiqqan).",
   "n": 53
  },
  {
   "t": "  ulanish.on('connect', () => {",
   "n": 54
  },
  {
   "t": "    holatQoy('ulangan');",
   "n": 55
  },
  {
   "t": "    qaytaSora();",
   "n": 56
  },
  {
   "t": "    if (ochiqOyin !== null) ulanish?.emit('oyin-ochildi', { oyinId: ochiqOyin });",
   "n": 57
  },
  {
   "t": "  });",
   "n": 58
  },
  {
   "t": "  // Tinglovchi bir marta — connect dan tashqarida",
   "n": 59
  },
  {
   "t": "  ulanish.on('oyin-ozgardi', async () => {",
   "n": 60
  },
  {
   "t": "    const oldingi = oxirgiRoyxat();",
   "n": 61
  },
  {
   "t": "    const yangi = await qaytaSora();",
   "n": 62
  },
  {
   "t": "    if (oldingi && yangi) jonliXabarlar(oldingi, yangi).forEach(jonliXabarQosh);",
   "n": 63
  },
  {
   "t": "  });",
   "n": 64
  },
  {
   "t": "  ulanish.on('disconnect', uzilishdanKeyin);",
   "n": 65
  },
  {
   "t": "  ulanish.on('connect_error', uzilishdanKeyin);",
   "n": 66
  },
  {
   "t": "  ulanish.on('korayotganlar-ozgardi', (m: { oyinId: number; soni: number }) => {",
   "n": 67
  },
  {
   "t": "    korayotganlar.set(m.oyinId, m.soni);",
   "n": 68
  },
  {
   "t": "    korayotganlarniKuzatuvchilar.forEach((k) => k());",
   "n": 69
  },
  {
   "t": "  });",
   "n": 70
  },
  {
   "t": "",
   "n": 71
  },
  {
   "t": "  // Ilova fonda turganda o'zgarish bo'lsa: fondan qaytganda ro'yxat qayta so'raladi",
   "n": 72
  },
  {
   "t": "  let oldingi: string | null | undefined = AppState.currentState;",
   "n": 73
  },
  {
   "t": "  ilovaHolati = AppState.addEventListener('change', (yangi: AppStateStatus) => {",
   "n": 74
  },
  {
   "t": "    if (oldingi === 'background' && yangi === 'active') qaytaSora();",
   "n": 75
  },
  {
   "t": "    oldingi = yangi;",
   "n": 76
  },
  {
   "t": "  });",
   "n": 77
  },
  {
   "t": "}",
   "n": 78
  },
  {
   "t": "",
   "n": 79
  },
  {
   "t": "// Hodisadan keyin — GET /oyinlar bir marta; xato bo'lsa ekranda eski ro'yxat qoladi (pastga tortib yangilash ishlaydi)",
   "n": 80
  },
  {
   "t": "function qaytaSora(): Promise<Oyin[] | null> {",
   "n": 81
  },
  {
   "t": "  return oyinlarniOl().catch(() => null);",
   "n": 82
  },
  {
   "t": "}",
   "n": 83
  },
  {
   "t": "",
   "n": 84
  },
  {
   "t": "// Jonli xabar — ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar (_layout.tsx ko'rsatadi).",
   "n": 85
  },
  {
   "t": "// Qaysi xabar — sababga qarab emas: hodisadan keyingi javob oldingisi bilan solishtiriladi.",
   "n": 86
  },
  {
   "t": "// Faqat o'ziga tegishli o'yin uchun (qo'shilgan, navbatda yoki o'zi e'lon qilgan); o'z harakati uchun chiqmaydi; ism yo'q.",
   "n": 87
  },
  {
   "t": "// O'z harakati — javobdagi o'z maydonlarim (menQoshilganman, menNavbatdaman, menTasdiqlaganman) o'zgargan",
   "n": 88
  },
  {
   "t": "// (navbatdan o'yinga o'tish bundan mustasno). Hodisaga yangi maydon qo'shilmagan.",
   "n": 89
  },
  {
   "t": "export function jonliXabarlar(oldingi: Oyin[], yangi: Oyin[]): string[] {",
   "n": 90
  },
  {
   "t": "  const xabarlar: string[] = [];",
   "n": 91
  },
  {
   "t": "  for (const y of yangi) {",
   "n": 92
  },
  {
   "t": "    const o = oldingi.find((x) => x.id === y.id);",
   "n": 93
  },
  {
   "t": "    if (!o) continue; // yangi e'lon — ro'yxatda jim paydo bo'ladi",
   "n": 94
  },
  {
   "t": "    const nom = `${kunNomi(y.kun)}, ${y.soat}`;",
   "n": 95
  },
  {
   "t": "    if (o.menNavbatdaman && y.menQoshilganman) {",
   "n": 96
  },
  {
   "t": "      xabarlar.push(`Navbatdan o'yinga o'tdingiz: ${nom}`);",
   "n": 97
  },
  {
   "t": "      continue;",
   "n": 98
  },
  {
   "t": "    }",
   "n": 99
  },
  {
   "t": "    const tegishli = y.menQoshilganman || y.menNavbatdaman || y.menTashkilotchiman;",
   "n": 100
  },
  {
   "t": "    const ozim =",
   "n": 101
  },
  {
   "t": "      o.menQoshilganman !== y.menQoshilganman ||",
   "n": 102
  },
  {
   "t": "      o.menNavbatdaman !== y.menNavbatdaman ||",
   "n": 103
  },
  {
   "t": "      o.menTasdiqlaganman !== y.menTasdiqlaganman;",
   "n": 104
  },
  {
   "t": "    if (!tegishli || ozim) continue;",
   "n": 105
  },
  {
   "t": "    if (y.qoshilgan > o.qoshilgan) {",
   "n": 106
  },
  {
   "t": "      xabarlar.push(",
   "n": 107
  },
  {
   "t": "        y.qoshilgan >= y.kerak",
   "n": 108
  },
  {
   "t": "          ? `${nom} — o'yin to'ldi: ${y.qoshilgan} / ${y.kerak}`",
   "n": 109
  },
  {
   "t": "          : `${nom} — yana bir o'yinchi qo'shildi: ${y.qoshilgan} / ${y.kerak}`,",
   "n": 110
  },
  {
   "t": "      );",
   "n": 111
  },
  {
   "t": "    } else if (y.qoshilgan < o.qoshilgan) {",
   "n": 112
  },
  {
   "t": "      xabarlar.push(`${nom} — joy bo'shadi: ${y.qoshilgan} / ${y.kerak}`);",
   "n": 113
  },
  {
   "t": "    }",
   "n": 114
  },
  {
   "t": "    // Son o'zgarmasa (chiqqan o'rniga navbatdagi kirdi) — boshqalarga xabar yo'q",
   "n": 115
  },
  {
   "t": "    if (y.tasdiqlagan !== null && o.tasdiqlagan !== null && y.tasdiqlagan > o.tasdiqlagan) {",
   "n": 116
  },
  {
   "t": "      xabarlar.push(`${nom} — kelishini tasdiqladi: ${y.tasdiqlagan} / ${y.qoshilgan}`);",
   "n": 117
  },
  {
   "t": "    }",
   "n": 118
  },
  {
   "t": "  }",
   "n": 119
  },
  {
   "t": "  return xabarlar;",
   "n": 120
  },
  {
   "t": "}",
   "n": 121
  },
  {
   "t": "",
   "n": 122
  },
  {
   "t": "// Ekrandagi jonli xabarlar: har biri bir necha soniyadan keyin o'zi yo'qoladi",
   "n": 123
  },
  {
   "t": "export type JonliXabar = { id: number; matn: string };",
   "n": 124
  },
  {
   "t": "const JONLI_XABAR_SONIYA = 4;",
   "n": 125
  },
  {
   "t": "let jonli: JonliXabar[] = [];",
   "n": 126
  },
  {
   "t": "let keyingiId = 1;",
   "n": 127
  },
  {
   "t": "const jonliKuzatuvchilar = new Set<(x: JonliXabar[]) => void>();",
   "n": 128
  },
  {
   "t": "",
   "n": 129
  },
  {
   "t": "function jonliYangila(yangi: JonliXabar[]) {",
   "n": 130
  },
  {
   "t": "  jonli = yangi;",
   "n": 131
  },
  {
   "t": "  jonliKuzatuvchilar.forEach((k) => k(jonli));",
   "n": 132
  },
  {
   "t": "}",
   "n": 133
  },
  {
   "t": "",
   "n": 134
  },
  {
   "t": "function jonliXabarQosh(matn: string) {",
   "n": 135
  },
  {
   "t": "  const xabar = { id: keyingiId++, matn };",
   "n": 136
  },
  {
   "t": "  jonliYangila([...jonli, xabar]);",
   "n": 137
  },
  {
   "t": "  setTimeout(() => jonliYangila(jonli.filter((x) => x.id !== xabar.id)), JONLI_XABAR_SONIYA * 1000);",
   "n": 138
  },
  {
   "t": "}",
   "n": 139
  },
  {
   "t": "",
   "n": 140
  },
  {
   "t": "export function useJonliXabarlar(): JonliXabar[] {",
   "n": 141
  },
  {
   "t": "  const [x, setX] = useState(jonli);",
   "n": 142
  },
  {
   "t": "  useEffect(() => {",
   "n": 143
  },
  {
   "t": "    jonliKuzatuvchilar.add(setX);",
   "n": 144
  },
  {
   "t": "    return () => {",
   "n": 145
  },
  {
   "t": "      jonliKuzatuvchilar.delete(setX);",
   "n": 146
  },
  {
   "t": "    };",
   "n": 147
  },
  {
   "t": "  }, []);",
   "n": 148
  },
  {
   "t": "  return x;",
   "n": 149
  },
  {
   "t": "}",
   "n": 150
  },
  {
   "t": "",
   "n": 151
  },
  {
   "t": "// «O'yin» ekrani ochildi / yopildi: Backend o'yin xonasiga qo'shadi / chiqaradi («Hozir ko'ryapti»).",
   "n": 152
  },
  {
   "t": "// Ochiq o'yin eslab qolinadi — qayta ulanganda o'sha xonaga qayta kiriladi.",
   "n": 153
  },
  {
   "t": "export function oyinniOch(oyinId: number) {",
   "n": 154
  },
  {
   "t": "  ochiqOyin = oyinId;",
   "n": 155
  },
  {
   "t": "  ulanish?.emit('oyin-ochildi', { oyinId });",
   "n": 156
  },
  {
   "t": "}",
   "n": 157
  },
  {
   "t": "",
   "n": 158
  },
  {
   "t": "export function oyinniYop(oyinId: number) {",
   "n": 159
  },
  {
   "t": "  if (ochiqOyin === oyinId) ochiqOyin = null;",
   "n": 160
  },
  {
   "t": "  ulanish?.emit('oyin-yopildi', { oyinId });",
   "n": 161
  },
  {
   "t": "}",
   "n": 162
  },
  {
   "t": "",
   "n": 163
  },
  {
   "t": "// «O'yin» ekrani uchun: shu o'yin ekranini hozir ochib turgan ulanishlar soni (hali kelmagan bo'lsa — null)",
   "n": 164
  },
  {
   "t": "export function useKorayotganlar(oyinId: number): number | null {",
   "n": 165
  },
  {
   "t": "  const [soni, setSoni] = useState(korayotganlar.get(oyinId) ?? null);",
   "n": 166
  },
  {
   "t": "  useEffect(() => {",
   "n": 167
  },
  {
   "t": "    const k = () => setSoni(korayotganlar.get(oyinId) ?? null);",
   "n": 168
  },
  {
   "t": "    korayotganlarniKuzatuvchilar.add(k);",
   "n": 169
  },
  {
   "t": "    return () => {",
   "n": 170
  },
  {
   "t": "      korayotganlarniKuzatuvchilar.delete(k);",
   "n": 171
  },
  {
   "t": "    };",
   "n": 172
  },
  {
   "t": "  }, [oyinId]);",
   "n": 173
  },
  {
   "t": "  return soni;",
   "n": 174
  },
  {
   "t": "}",
   "n": 175
  },
  {
   "t": "",
   "n": 176
  },
  {
   "t": "// «Hisobdan chiqish»: ulanish yopiladi. Qayta kirilganda ulan() yangi token bilan yangi ulanish ochadi.",
   "n": 177
  },
  {
   "t": "export function uzil() {",
   "n": 178
  },
  {
   "t": "  ilovaHolati?.remove();",
   "n": 179
  },
  {
   "t": "  ilovaHolati = null;",
   "n": 180
  },
  {
   "t": "  ulanish?.removeAllListeners();",
   "n": 181
  },
  {
   "t": "  ulanish?.disconnect();",
   "n": 182
  },
  {
   "t": "  ulanish = null;",
   "n": 183
  },
  {
   "t": "  korayotganlar.clear();",
   "n": 184
  },
  {
   "t": "  holatQoy('ulanmagan');",
   "n": 185
  },
  {
   "t": "}",
   "n": 186
  },
  {
   "t": "",
   "n": 187
  },
  {
   "t": "// Ekranda belgi uchun: hozirgi holat va uning o'zgarishi",
   "n": 188
  },
  {
   "t": "export function useUlanishHolati(): UlanishHolati {",
   "n": 189
  },
  {
   "t": "  const [h, setH] = useState(holat);",
   "n": 190
  },
  {
   "t": "  useEffect(() => {",
   "n": 191
  },
  {
   "t": "    holatniKuzatuvchilar.add(setH);",
   "n": 192
  },
  {
   "t": "    setH(holat);",
   "n": 193
  },
  {
   "t": "    return () => {",
   "n": 194
  },
  {
   "t": "      holatniKuzatuvchilar.delete(setH);",
   "n": 195
  },
  {
   "t": "    };",
   "n": 196
  },
  {
   "t": "  }, []);",
   "n": 197
  },
  {
   "t": "  return h;",
   "n": 198
  },
  {
   "t": "}",
   "n": 199
  }
 ]
};
const KOD_OUT_00 = "v24.18.0\n11.16.0\nP HEAD fb8b8b4 ws1-done: jonli buyurtmalar paneli — socket.io gateway (order-changed), /\n M README.md\n M public/admin.html\n M scripts/live-client.js\n@nestjs/core 11.2.8\n@nestjs/websockets 11.2.8\n@nestjs/platform-socket.io 11.2.8\nsocket.io 4.8.4\nsocket.io-client 4.8.4\nGoogle Chrome 148.0.7778.96 \nWed Nov  4 09:37:19 PM +05 2026";
const KOD_OUT_00B = "# nusxalar farqi\n## start → done\n@@ -61,6 +61,7 @@\n   }\n \n   // Ro'yxat — har doim Backend'dan (GET /admin/orders). Hodisa faqat «nimadir o'zgardi» deydi.\n+  // Ikki joyda chaqiriladi: connect (birinchi va har qayta ulanish) va order-changed.\n   async function yukla() {\n     const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });\n     if (r.status === 401) {\n@@ -83,10 +84,15 @@\n     if (ulanish) ulanish.close();\n     ulanish = io({ auth: { token } });\n     holatQoy('ulanmoqda');\n-    ulanish.on('connect', () => holatQoy('ulangan'));\n+    // connect — birinchi ulanishda HAM har qayta ulanishda: uzilish paytidagi hodisa kelmaydi, shuning uchun ro'yxat qayta so'raladi\n+    ulanish.on('connect', () => {\n+      holatQoy('ulangan');\n+      yukla();\n+    });\n     // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»\n     ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));\n     ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));\n+    // tinglovchi bir marta, connect'dan TASHQARIDA (ichida bo'lsa har qayta ulanishda yana bittasi qo'shiladi)\n     ulanish.on('order-changed', () => yukla());\n   }\n \n@@ -94,13 +100,11 @@\n     e.preventDefault();\n     token = el('token').value.trim();\n     localStorage.setItem(\u0027adminToken', token);\n-    yukla();\n     ulan();\n   });\n \n   if (token) {\n     el('token').value = token;\n-    yukla();\n     ulan();\n   }\n </script>\n## start → xato\n@@ -61,6 +61,7 @@\n   }\n \n   // Ro'yxat — har doim Backend'dan (GET /admin/orders). Hodisa faqat «nimadir o'zgardi» deydi.\n+  // Ikki joyda chaqiriladi: connect (birinchi va har qayta ulanish) va order-changed.\n   async function yukla() {\n     const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });\n     if (r.status === 401) {\n@@ -83,24 +84,26 @@\n     if (ulanish) ulanish.close();\n     ulanish = io({ auth: { token } });\n     holatQoy('ulanmoqda');\n-    ulanish.on('connect', () => holatQoy('ulangan'));\n+    // connect — birinchi ulanishda HAM har qayta ulanishda: uzilish paytidagi hodisa kelmaydi, shuning uchun ro'yxat qayta so'raladi\n+    ulanish.on('connect', () => {\n+      holatQoy('ulangan');\n+      yukla();\n+      ulanish.on('order-changed', () => yukla());\n+    });\n     // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»\n     ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));\n     ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));\n-    ulanish.on('order-changed', () => yukla());\n   }\n \n   el('kirish').addEventListener('submit', (e) => {\n     e.preventDefault();\n     token = el('token').value.trim();\n     localStorage.setItem(\u0027adminToken', token);\n-    yukla();\n     ulan();\n   });\n \n   if (token) {\n     el('token').value = token;\n-    yukla();\n     ulan();\n   }\n </script>\n## start → tiklash (live.gateway.ts)\n@@ -16,7 +16,7 @@\n // Yangi holatni panel GET /admin/orders dan qayta so'raydi — hodisa ichida ro'yxat ham, son ham yo'q.\n export type OrderChangeReason = 'new' | 'status';\n \n-@WebSocketGateway()\n+@WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 } })\n export class LiveGateway implements OnGatewayConnection, OnGatewayDisconnect {\n   private readonly log = new Logger('Live');\n \n## start → done (scripts/live-client.js)\n@@ -21,6 +21,18 @@\n \n const s = io(url, { auth: { token } });\n console.log(`${t()} ulanmoqda… ${url}`);\n+// Panel kabi: har connect'da (birinchi va qayta) ro'yxat qayta so'raladi — uzilish paytidagi hodisa kelmaydi\n+async function royxat() {\n+  const r = await fetch(`${url}/admin/orders`, {\n+    headers: { Authorization: `Bearer ${token}` },\n+  });\n+  if (!r.ok) return console.log(`${t()} GET /admin/orders → ${r.status}`);\n+  const list = await r.json();\n+  console.log(\n+    `${t()} GET /admin/orders → ${list.length} ta` +\n+      (list.length ? `, eng yangisi #${list[0].id}` : ''),\n+  );\n+}\n s.on('connect', () => {\n   console.log(\n     `${t()} connect · ${holat(s)} · transport: ${s.io.engine.transport.name}`,\n@@ -28,6 +40,7 @@\n   s.io.engine.once('upgrade', (tr) =>\n     console.log(`${t()} transport: ${tr.name}`),\n   );\n+  royxat().catch((e) => console.log(`${t()} GET xato: ${e.message}`));\n });\n s.on('disconnect', (reason) =>\n   console.log(";
const KOD_OUT_01 = "# ws2-start (= ws1-done): connect faqat belgini yangilaydi\n# Panel (brauzer) va terminal klienti bir vaqtda ochiq; server to'xtatiladi, 5 s dan keyin qayta yoqiladi\n\n## Qadamlar\n21:37:30 — Bobur 1-buyurtma (server ishlayapti) — panel ko'rdi\n21:37:30 — server to'xtatildi (Ctrl+C)\n21:37:36 — server qayta ishga tushirildi — server o'chiq paytda Bobur botga yozgan edi (Telegram navbati)\n21:37:45 — tekshiruv: bazada nechta buyurtma\n\n## Brauzer — panel\n21:37:25.006 brauzer: GET /admin/orders (1)\n21:37:25.026 brauzer: WebSocket ochildi\n21:37:25.642 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:37:26.893 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:37:26.894 brauzer: GET /admin/orders (2)\n21:37:29.966 SURAT 01-qayta-ishga-start-1 (1-buyurtma-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:37:26\n21:37:30.471 brauzer: WebSocket yopildi\n21:37:30.579 belgi: «Ulangan» → «Ulanmoqda…»\n21:37:31.529 SURAT 01-qayta-ishga-start-2 (2-server-ochiq) — belgi «Ulanmoqda…» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:37:26\n21:37:39.237 brauzer: WebSocket ochildi\n21:37:39.325 belgi: «Ulanmoqda…» → «Ulangan»\n21:37:44.863 SURAT 01-qayta-ishga-start-3 (3-qayta-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:37:26\n21:37:45.480 tugadi — belgi «Ulangan» · ro'yxat: #1 · jami GET: 2\n\n## Terminal — npm run live\n$ npm run live\n21:37:26 ulanmoqda… http://localhost:3100\n21:37:26 connect · ulangan · transport: websocket\n21:37:26 order-changed {\"orderId\":1,\"reason\":\"new\"}\n21:37:30 disconnect: transport close · active=true → ulanmoqda\n21:37:31 connect_error: xhr poll error · active=true → ulanmoqda\n21:37:34 connect_error: xhr poll error · active=true → ulanmoqda\n21:37:37 connect · ulangan · transport: websocket\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:37:22 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: d7Bg0BEV__qvrHg1AAAA\nLOG [Live] panel ulandi: LFvF9HD52kXfuq8BAAAB\n21:37:26 — Bobur botda buyurtma beradi\n21:37:26 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:37:26 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:37:26 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:37:26 — buyurtma #1 bazada\nLOG [Live] panel uzildi: d7Bg0BEV__qvrHg1AAAA\nLOG [Live] panel uzildi: LFvF9HD52kXfuq8BAAAB\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:37:36 Server 3100-portda ishlayapti\n21:37:36 — Bobur botda buyurtma beradi (server o'chiq paytda yozgan — Telegram navbatidan)\n21:37:37 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:37:37 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:37:37 — buyurtma #2 bazada\nLOG [Live] panel ulandi: qpS-Amj3qpAfODi2AAAA\nLOG [Live] panel ulandi: Qm-5I_79EmmnLLc6AAAB\nLOG [Live] panel uzildi: Qm-5I_79EmmnLLc6AAAB\nLOG [Live] panel uzildi: qpS-Amj3qpAfODi2AAAA\n\n## Baza (psql): orders — 2 ta, eng yangisi #2\n## Navbatdagi buyurtma hodisasi (#2) panelga keldimi: YO'Q — panel ulanmasdan oldin yuborilgan";
const KOD_OUT_02 = "# ws2-start: brauzer DevTools → Network → Offline (Playwright setOffline — o'sha CDP buyrug'i). Server va bot ishlab turibdi\n\n## Qadamlar\n21:38:39 — Offline yoqildi\n21:38:41 — Bobur buyurtma berdi (Offline paytida)\n21:38:45 — Offline o'chirildi\n21:38:50 — Offline yoqildi — 60 s\n21:38:55 — Bobur buyurtma berdi (Offline paytida)\n21:39:51 — Offline o'chirildi\n\n## Brauzer — panel\n21:38:38.933 brauzer: GET /admin/orders (1)\n21:38:38.961 brauzer: WebSocket ochildi\n21:38:39.573 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:38:39.883 — brauzer: Offline yoqildi (DevTools → Network → Offline)\n21:38:45.410 SURAT 02-offline-1 (1-offline-6s) — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n    Hali buyurtma yo'q\n21:38:46.025 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:38:46.026 brauzer: GET /admin/orders (2)\n21:38:46.026 — brauzer: Offline o'chirildi\n21:38:50.025 SURAT 02-offline-2 (2-online) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:41\n21:38:50.641 — brauzer: Offline yoqildi (DevTools → Network → Offline)\n21:39:24.086 belgi: «Ulangan» → «Ulanmoqda…»\n21:39:50.655 SURAT 02-offline-3 (3-offline-60s) — belgi «Ulanmoqda…» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:41\n21:39:51.268 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":2,\"reason\":\"new\"}]\n21:39:51.268 — brauzer: Offline o'chirildi\n21:39:51.268 brauzer: WebSocket yopildi\n21:39:54.219 brauzer: WebSocket ochildi\n21:39:54.322 belgi: «Ulanmoqda…» → «Ulangan»\n21:39:59.240 SURAT 02-offline-4 (4-online) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:41\n21:39:59.854 tugadi — belgi «Ulangan» · ro'yxat: #1 · jami GET: 2\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:38:36 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: laiEowve-I2iSZw3AAAA\n21:38:41 — Bobur botda buyurtma beradi\n21:38:41 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:38:41 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:38:41 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:38:41 — buyurtma #1 bazada\n21:38:55 — Bobur botda buyurtma beradi\n21:38:55 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:38:55 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:38:55 — buyurtma #2 bazada\nLOG [Live] panel uzildi: laiEowve-I2iSZw3AAAA\nLOG [Live] panel ulandi: -8pdx3IUvuj7Sem3AAAB\nLOG [Live] panel uzildi: -8pdx3IUvuj7Sem3AAAB";
const KOD_OUT_03 = "# ws2-start: tarmoq uzildi\n# Panel proksi orqali (localhost:3101 → server 3100). Proksi kesilganda ochiq ulanish uziladi, yangisi qabul qilinmaydi; server va bot ishlab turibdi\n\n## Qadamlar\n21:40:05 — tarmoq uzildi (proksi)\n21:40:08 — Bobur buyurtma berdi (panel tarmoqsiz)\n21:40:12 — tarmoq qaytdi\n\n## Brauzer — panel\n21:40:04.849 brauzer: GET /admin/orders (1)\n21:40:04.870 brauzer: WebSocket ochildi\n21:40:05.483 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:40:05.604 brauzer: WebSocket yopildi\n21:40:05.640 belgi: «Ulangan» → «Ulanmoqda…»\n21:40:07.658 SURAT 03-tarmoq-start-1 (1-tarmoq-yoq) — belgi «Ulanmoqda…» · ro'yxat: Hali buyurtma yo'q\n    Hali buyurtma yo'q\n21:40:13.613 brauzer: WebSocket ochildi\n21:40:13.619 belgi: «Ulanmoqda…» → «Ulangan»\n21:40:20.389 SURAT 03-tarmoq-start-2 (2-qayta-ulangan) — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n    Hali buyurtma yo'q\n21:40:20.852 tugadi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q · jami GET: 1\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:40:03 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: Y2whZ46rcEXlodQqAAAA\nLOG [Live] panel uzildi: Y2whZ46rcEXlodQqAAAA\n21:40:08 — Bobur botda buyurtma beradi\n21:40:08 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:40:08 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:40:08 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:40:08 — buyurtma #1 bazada\nLOG [Live] panel ulandi: FxbJ0MjfHWCjRxaGAAAB\nLOG [Live] panel uzildi: FxbJ0MjfHWCjRxaGAAAB\n\n## Baza (psql): orders — 1 ta, eng yangisi #1";
const KOD_OUT_04 = "# ws2-done: connect ichida yukla() — har ulanishda ro'yxat qayta so'raladi (navbat0: buyurtma port ochilishidan oldin)\n# Panel (brauzer) va terminal klienti bir vaqtda ochiq; server to'xtatiladi, 5 s dan keyin qayta yoqiladi\n\n## Qadamlar\n21:38:07 — Bobur 1-buyurtma (server ishlayapti) — panel ko'rdi\n21:38:07 — server to'xtatildi (Ctrl+C)\n21:38:13 — server qayta ishga tushirildi — server o'chiq paytda Bobur botga yozgan edi (Telegram navbati)\n21:38:22 — tekshiruv: bazada nechta buyurtma\n\n## Brauzer — panel\n21:38:01.999 brauzer: WebSocket ochildi\n21:38:02.011 brauzer: GET /admin/orders (1)\n21:38:02.624 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:38:03.888 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:38:03.888 brauzer: GET /admin/orders (2)\n21:38:06.946 SURAT 04-qayta-ishga-done-1 (1-buyurtma-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:03\n21:38:07.462 brauzer: WebSocket yopildi\n21:38:07.559 belgi: «Ulangan» → «Ulanmoqda…»\n21:38:08.660 SURAT 04-qayta-ishga-done-2 (2-server-ochiq) — belgi «Ulanmoqda…» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:03\n21:38:15.516 brauzer: WebSocket ochildi\n21:38:15.523 brauzer: GET /admin/orders (3)\n21:38:15.544 belgi: «Ulanmoqda…» → «Ulangan»\n21:38:21.995 SURAT 04-qayta-ishga-done-3 (3-qayta-ulangan) — belgi «Ulangan» · ro'yxat: #2 [sariq], #1\n    [yangi] 2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:13\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:38:03\n21:38:22.610 tugadi — belgi «Ulangan» · ro'yxat: #2 [sariq], #1 · jami GET: 3\n\n## Terminal — npm run live\n$ npm run live\n21:38:03 ulanmoqda… http://localhost:3100\n21:38:03 connect · ulangan · transport: websocket\n21:38:03 GET /admin/orders → 0 ta\n21:38:03 order-changed {\"orderId\":1,\"reason\":\"new\"}\n21:38:07 disconnect: transport close · active=true → ulanmoqda\n21:38:08 connect_error: xhr poll error · active=true → ulanmoqda\n21:38:11 connect_error: xhr poll error · active=true → ulanmoqda\n21:38:13 connect_error: xhr poll error · active=true → ulanmoqda\n21:38:18 connect · ulangan · transport: websocket\n21:38:18 GET /admin/orders → 2 ta, eng yangisi #2\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:37:59 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: 48kR4MXvY3S1MA3RAAAA\nLOG [Live] panel ulandi: U8-1nrpgyX9PioJJAAAB\n21:38:03 — Bobur botda buyurtma beradi\n21:38:03 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:38:03 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:38:03 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:38:03 — buyurtma #1 bazada\nLOG [Live] panel uzildi: 48kR4MXvY3S1MA3RAAAA\nLOG [Live] panel uzildi: U8-1nrpgyX9PioJJAAAB\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:38:13 — Bobur botda buyurtma beradi (server o'chiq paytda yozgan — Telegram navbatidan, port ochilishidan oldin)\n21:38:13 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:38:13 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:38:13 — buyurtma #2 bazada\n21:38:13 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: NJfgBgr7CIwVQh10AAAA\nLOG [Live] panel ulandi: B62ZzdxKkgWhnrLXAAAB\nLOG [Live] panel uzildi: NJfgBgr7CIwVQh10AAAA\nLOG [Live] panel uzildi: B62ZzdxKkgWhnrLXAAAB\n\n## Baza (psql): orders — 2 ta, eng yangisi #2\n## Navbatdagi buyurtma hodisasi (#2) panelga keldimi: YO'Q — panel ulanmasdan oldin yuborilgan";
const KOD_OUT_05 = "# ws2-done: tarmoq uzildi\n# Panel proksi orqali (localhost:3101 → server 3100). Proksi kesilganda ochiq ulanish uziladi, yangisi qabul qilinmaydi; server va bot ishlab turibdi\n\n## Qadamlar\n21:40:26 — tarmoq uzildi (proksi)\n21:40:29 — Bobur buyurtma berdi (panel tarmoqsiz)\n21:40:33 — tarmoq qaytdi\n\n## Brauzer — panel\n21:40:25.633 brauzer: WebSocket ochildi\n21:40:25.635 brauzer: GET /admin/orders (1)\n21:40:26.246 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:40:26.407 brauzer: WebSocket yopildi\n21:40:26.557 belgi: «Ulangan» → «Ulanmoqda…»\n21:40:28.572 SURAT 05-tarmoq-done-1 (1-tarmoq-yoq) — belgi «Ulanmoqda…» · ro'yxat: Hali buyurtma yo'q\n    Hali buyurtma yo'q\n21:40:37.473 brauzer: WebSocket ochildi\n21:40:37.477 brauzer: GET /admin/orders (2)\n21:40:37.588 belgi: «Ulanmoqda…» → «Ulangan»\n21:40:41.137 SURAT 05-tarmoq-done-2 (2-qayta-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:40:29\n21:40:41.753 tugadi — belgi «Ulangan» · ro'yxat: #1 · jami GET: 2\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:40:24 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: 0zMOutxyWCkHtkd5AAAA\nLOG [Live] panel uzildi: 0zMOutxyWCkHtkd5AAAA\n21:40:29 — Bobur botda buyurtma beradi\n21:40:29 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:40:29 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:40:29 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:40:29 — buyurtma #1 bazada\nLOG [Live] panel ulandi: SGH-4_OFP1ab9t_AAAAB\nLOG [Live] panel uzildi: SGH-4_OFP1ab9t_AAAAB\n\n## Baza (psql): orders — 1 ta, eng yangisi #1";
const KOD_OUT_06 = "# xato nusxa: tinglovchi connect ichida (sodda tuzatish) — 00b-nusxalar-farqi.txt\n\n## Qadamlar\n21:40:46 — 1-buyurtma (birinchi ulanish)\n21:40:50 — server qayta ishga tushirildi (1)\n21:41:00 — 2-buyurtma (1 qayta ulanishdan keyin)\n21:41:03 — server qayta ishga tushirildi (2)\n21:41:13 — 3-buyurtma (2 qayta ulanishdan keyin)\n\n## Brauzer — panel\n21:40:46.232 brauzer: WebSocket ochildi\n21:40:46.234 brauzer: GET /admin/orders (1)\n21:40:46.845 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:40:47.032 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:40:47.032 brauzer: GET /admin/orders (2)\n21:40:50.089 SURAT 06-takror-1 (1-birinchi-ulanish) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:40:47\n21:40:50.609 brauzer: WebSocket yopildi\n21:40:50.700 belgi: «Ulangan» → «Ulanmoqda…»\n21:40:53.765 brauzer: WebSocket ochildi\n21:40:53.775 brauzer: GET /admin/orders (3)\n21:40:53.908 belgi: «Ulanmoqda…» → «Ulangan»\n21:41:00.271 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":2,\"reason\":\"new\"}]\n21:41:00.271 brauzer: GET /admin/orders (4)\n21:41:00.271 brauzer: GET /admin/orders (5)\n21:41:03.428 SURAT 06-takror-2 (2-bir-qayta-ulanish) — belgi «Ulangan» · ro'yxat: #2, #1\n    2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:41:00\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:40:47\n21:41:03.860 brauzer: WebSocket yopildi\n21:41:03.889 belgi: «Ulangan» → «Ulanmoqda…»\n21:41:11.262 brauzer: WebSocket ochildi\n21:41:11.271 brauzer: GET /admin/orders (6)\n21:41:11.369 belgi: «Ulanmoqda…» → «Ulangan»\n21:41:13.523 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":3,\"reason\":\"new\"}]\n21:41:13.524 brauzer: GET /admin/orders (7)\n21:41:13.524 brauzer: GET /admin/orders (8)\n21:41:13.524 brauzer: GET /admin/orders (9)\n21:41:16.604 SURAT 06-takror-3 (3-ikki-qayta-ulanish) — belgi «Ulangan» · ro'yxat: #3, #2, #1\n    3 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:41:13\n    2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:41:00\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:40:47\n21:41:17.220 tugadi — belgi «Ulangan» · ro'yxat: #3, #2, #1 · jami GET: 9\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:40:45 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: _akFI5auzjkZmwDNAAAA\n21:40:46 — Bobur botda buyurtma beradi\n21:40:47 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:40:47 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:40:47 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:40:47 — buyurtma #1 bazada\nLOG [Live] panel uzildi: _akFI5auzjkZmwDNAAAA\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:40:53 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: 9a5dXu0kfb_SE12YAAAA\n21:41:00 — Bobur botda buyurtma beradi\n21:41:00 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:41:00 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:41:00 — buyurtma #2 bazada\nLOG [Live] panel uzildi: 9a5dXu0kfb_SE12YAAAA\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:41:06 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: WK5Rw7L7zjZbSSbRAAAA\n21:41:13 — Bobur botda buyurtma beradi\n21:41:13 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:41:13 bot → 5987654321: Buyurtma #3 qabul qilindi!\n21:41:13 — buyurtma #3 bazada\nLOG [Live] panel uzildi: WK5Rw7L7zjZbSSbRAAAA";
const KOD_OUT_07 = "# tiklash nusxa: @WebSocketGateway({ connectionStateRecovery: { maxDisconnectionDuration: 2 daqiqa } }) — klient socket.recovered ni ko'rsatadi\n\n## Qadamlar\n21:41:23 — A) klient hali hech qanday hodisa olmagan — tarmoq uzildi (proksi)\n21:41:24 — Bobur buyurtma berdi (klient tarmoqsiz)\n21:41:28 — tarmoq qaytdi\n21:41:36 — B) Bobur buyurtma berdi — klient hodisani oladi (oxirgi tartib belgisi bor)\n21:41:39 — B) tarmoq uzildi (proksi)\n21:41:40 — Bobur buyurtma berdi (klient tarmoqsiz)\n21:41:44 — tarmoq qaytdi\n21:41:52 — C) server to'xtatildi\n21:41:55 — server qayta ishga tushirildi (navbat — o'chiq paytda yozilgan buyurtma)\n\n## Klient\n21:41:21 connect · recovered=false · id 0BGx0Q…\n21:41:23 disconnect: transport close\n21:41:23 connect_error: xhr poll error\n21:41:26 connect_error: xhr poll error\n21:41:29 connect · recovered=false · id hIhhHg…\n21:41:36 order-changed {\"orderId\":2,\"reason\":\"new\"}\n21:41:39 disconnect: transport close\n21:41:40 connect_error: xhr poll error\n21:41:42 connect_error: xhr poll error\n21:41:47 order-changed {\"orderId\":3,\"reason\":\"new\"}\n21:41:47 connect · recovered=true · id hIhhHg…\n21:41:52 disconnect: transport close\n21:41:52 connect_error: xhr poll error\n21:41:54 connect_error: xhr poll error\n21:41:57 connect · recovered=false · id RPfAIC…\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:41:20 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: 0BGx0QzTjkH_PZrPAAAA\nLOG [Live] panel uzildi: 0BGx0QzTjkH_PZrPAAAA\n21:41:24 — Bobur botda buyurtma beradi\n21:41:24 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:41:24 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:41:24 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:41:24 — buyurtma #1 bazada\nLOG [Live] panel ulandi: hIhhHg2kU6QO_lHsAAAC\n21:41:36 — Bobur botda buyurtma beradi\n21:41:36 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:41:36 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:41:36 — buyurtma #2 bazada\nLOG [Live] panel uzildi: hIhhHg2kU6QO_lHsAAAC\n21:41:40 — Bobur botda buyurtma beradi\n21:41:40 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:41:40 bot → 5987654321: Buyurtma #3 qabul qilindi!\n21:41:40 — buyurtma #3 bazada\nLOG [Live] panel ulandi: hIhhHg2kU6QO_lHsAAAC\nLOG [Live] panel uzildi: hIhhHg2kU6QO_lHsAAAC\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:41:55 Server 3100-portda ishlayapti\n21:41:56 — Bobur botda buyurtma beradi (server o'chiq paytda yozgan — Telegram navbatidan)\n21:41:56 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:41:56 bot → 5987654321: Buyurtma #4 qabul qilindi!\n21:41:56 — buyurtma #4 bazada\nLOG [Live] panel ulandi: RPfAICbTunu2GtS2AAAA\nLOG [Live] panel uzildi: RPfAICbTunu2GtS2AAAA";
const KOD_OUT_08 = "$ npm test\nPASS src/api/live/admin.controller.spec.ts\nPASS src/api/live/live.gateway.spec.ts\nPASS src/api/app.controller.spec.ts\nPASS src/api/order/order.service.spec.ts\nPASS src/api/telegram/keyboards.spec.ts\nPASS src/api/telegram/phone.spec.ts\nPASS src/api/telegram/texts.spec.ts\nTest Suites: 7 passed, 7 total\nTests:       32 passed, 32 total\n\n$ npm run smoke\n— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor\nTelegram bot ulandi\n  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»\n  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0\n  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1\n— live: jonli panel — tokensiz ulanish, yangi buyurtma va holat o'zgarishi\nTelegram bot ulandi\n  ✓ tokensiz ulanish — server yopdi: io server disconnect\n  ✓ yangi buyurtma → order-changed {\"orderId\":5,\"reason\":\"new\"}\n  ✓ GET /admin/orders 200 — eng yuqorida #5 · Bobur\n  ✓ admin tasdiqladi → order-changed {\"orderId\":5,\"reason\":\"status\"}\nNATIJA: 9/9 ✓";
const KOD_OUT_09 = "# ws2-done: token «notogri» — alohida yukla() olib tashlangan, ro'yxat faqat connect va order-changed'da\n\n## Brauzer — panel\n21:42:40.194 brauzer: WebSocket ochildi\n21:42:40.197 brauzer: GET /admin/orders (1)\n21:42:40.198 brauzer: WebSocket yopildi\n21:42:50.793 panel ochildi — belgi «Ulanmagan» · ro'yxat: Token noto'g'ri\n21:42:52.050 SURAT 09-notogri-1 (1-notogri-token) — belgi «Ulanmagan» · ro'yxat: Token noto'g'ri\n    Token noto'g'ri\n21:42:52.514 tugadi — belgi «Ulanmagan» · ro'yxat: Token noto'g'ri · jami GET: 1\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:42:37 Server 3100-portda ishlayapti";
const KOD_OUT_11 = "# ws2-done: brauzer DevTools → Network → Offline 60 s (02 ning ikkinchi yarmi, tuzatilgan kod)\n\n## Qadamlar\n21:42:57 — Bobur 1-buyurtma (ulangan paytda)\n21:43:01 — Offline yoqildi — 60 s\n21:43:06 — Bobur buyurtma berdi (Offline paytida)\n21:44:01 — Offline o'chirildi\n\n## Brauzer — panel\n21:42:56.960 brauzer: WebSocket ochildi\n21:42:56.963 brauzer: GET /admin/orders (1)\n21:42:57.575 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:42:57.760 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:42:57.760 brauzer: GET /admin/orders (2)\n21:43:00.817 SURAT 11-offline-done-1 (1-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:42:57\n21:43:01.433 — brauzer: Offline yoqildi (DevTools → Network → Offline)\n21:43:42.039 belgi: «Ulangan» → «Ulanmoqda…»\n21:44:01.447 SURAT 11-offline-done-2 (2-offline-60s) — belgi «Ulanmoqda…» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:42:57\n21:44:02.061 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":2,\"reason\":\"new\"}]\n21:44:02.061 — brauzer: Offline o'chirildi\n21:44:02.062 brauzer: WebSocket yopildi\n21:44:03.192 brauzer: WebSocket ochildi\n21:44:03.194 brauzer: GET /admin/orders (3)\n21:44:03.282 belgi: «Ulanmoqda…» → «Ulangan»\n21:44:10.031 SURAT 11-offline-done-3 (3-online) — belgi «Ulangan» · ro'yxat: #2 [sariq], #1\n    [yangi] 2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:43:06\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:42:57\n21:44:10.645 tugadi — belgi «Ulangan» · ro'yxat: #2 [sariq], #1 · jami GET: 3\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:42:55 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: EAtnTU0aL8t1rP-KAAAA\n21:42:57 — Bobur botda buyurtma beradi\n21:42:57 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:42:57 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:42:57 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:42:57 — buyurtma #1 bazada\n21:43:06 — Bobur botda buyurtma beradi\n21:43:06 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:43:06 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:43:06 — buyurtma #2 bazada\nLOG [Live] panel uzildi: EAtnTU0aL8t1rP-KAAAA\nLOG [Live] panel ulandi: kfan4IpOmFIR_GIVAAAB\nLOG [Live] panel uzildi: kfan4IpOmFIR_GIVAAAB\n\n## Baza (psql): orders — 2 ta, eng yangisi #2";
const KOD_OUT_12 = "# GitHub Actions — main e10d0d9 (ws2-done), run 41870843765\n✓ main CI · 41870843765\nTriggered via push about 8 minutes ago\nJOBS\n✓ test in 23s (ID 126717144206)\n✓ smoke in 42s (ID 126717520031)\nANNOTATIONS\n! Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/\ntest: .github#2\n- \"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\"\ntest: .github#1\n! Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/\nsmoke: .github#2\n- \"The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026. For more information, see https://github.com/actions/runner-images/issues/14748\"\nsmoke: .github#1\nFor more information about a job, try: gh run view --job=<job-id>\nView this run on GitHub: https://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41870843765";
const KOD_OUT_AI1 = "# AI nusxasi ai1 (ws2v2-ai/ai1/diff.patch): server qayta ishga tushdi + navbatdagi buyurtma (navbat0)\n# Panel (brauzer) va terminal klienti bir vaqtda ochiq; server to'xtatiladi, 5 s dan keyin qayta yoqiladi\n\n## Qadamlar\n21:44:24 — Bobur 1-buyurtma (server ishlayapti) — panel ko'rdi\n21:44:24 — server to'xtatildi (Ctrl+C)\n21:44:29 — server qayta ishga tushirildi — server o'chiq paytda Bobur botga yozgan edi (Telegram navbati)\n21:44:39 — tekshiruv: bazada nechta buyurtma\n\n## Brauzer — panel\n21:44:18.938 brauzer: GET /admin/orders (1)\n21:44:18.963 brauzer: WebSocket ochildi\n21:44:18.965 brauzer: GET /admin/orders (2)\n21:44:19.576 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:44:20.752 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:44:20.752 brauzer: GET /admin/orders (3)\n21:44:23.897 SURAT 10-qayta-ishga-ai1-1 (1-buyurtma-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:44:20\n21:44:24.323 brauzer: WebSocket yopildi\n21:44:24.357 belgi: «Ulangan» → «Ulanmoqda…»\n21:44:25.462 SURAT 10-qayta-ishga-ai1-2 (2-server-ochiq) — belgi «Ulanmoqda…» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:44:20\n21:44:31.438 brauzer: WebSocket ochildi\n21:44:31.448 brauzer: GET /admin/orders (4)\n21:44:31.576 belgi: «Ulanmoqda…» → «Ulangan»\n21:44:38.885 SURAT 10-qayta-ishga-ai1-3 (3-qayta-ulangan) — belgi «Ulangan» · ro'yxat: #2 [sariq], #1\n    [yangi] 2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:44:30\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:44:20\n21:44:39.512 tugadi — belgi «Ulangan» · ro'yxat: #2 [sariq], #1 · jami GET: 4\n\n## Terminal — npm run live\n$ npm run live\n21:44:19 ulanmoqda… http://localhost:3100\n21:44:19 connect · ulangan · transport: websocket\n21:44:20 order-changed {\"orderId\":1,\"reason\":\"new\"}\n21:44:24 disconnect: transport close · active=true → ulanmoqda\n21:44:25 connect_error: xhr poll error · active=true → ulanmoqda\n21:44:27 connect_error: xhr poll error · active=true → ulanmoqda\n21:44:32 connect · ulangan · transport: websocket\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:44:17 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: GtBPm42auee8yqRvAAAA\nLOG [Live] panel ulandi: 6VPkJdAEWRQUM1zjAAAB\n21:44:20 — Bobur botda buyurtma beradi\n21:44:20 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:44:20 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:44:20 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:44:20 — buyurtma #1 bazada\nLOG [Live] panel uzildi: GtBPm42auee8yqRvAAAA\nLOG [Live] panel uzildi: 6VPkJdAEWRQUM1zjAAAB\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:44:30 — Bobur botda buyurtma beradi (server o'chiq paytda yozgan — Telegram navbatidan, port ochilishidan oldin)\n21:44:30 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:44:30 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:44:30 — buyurtma #2 bazada\n21:44:30 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: 4A3yppa6aOF6ykarAAAA\nLOG [Live] panel ulandi: iNLqARshQbBc0fqRAAAB\nLOG [Live] panel uzildi: 4A3yppa6aOF6ykarAAAA\nLOG [Live] panel uzildi: iNLqARshQbBc0fqRAAAB\n\n## Baza (psql): orders — 2 ta, eng yangisi #2\n## Navbatdagi buyurtma hodisasi (#2) panelga keldimi: YO'Q — panel ulanmasdan oldin yuborilgan";
const KOD_OUT_AI2 = "# AI nusxasi ai2 (ws2v2-ai/ai2/diff.patch): server qayta ishga tushdi + navbatdagi buyurtma (navbat0)\n# Panel (brauzer) va terminal klienti bir vaqtda ochiq; server to'xtatiladi, 5 s dan keyin qayta yoqiladi\n\n## Qadamlar\n21:45:10 — Bobur 1-buyurtma (server ishlayapti) — panel ko'rdi\n21:45:10 — server to'xtatildi (Ctrl+C)\n21:45:16 — server qayta ishga tushirildi — server o'chiq paytda Bobur botga yozgan edi (Telegram navbati)\n21:45:26 — tekshiruv: bazada nechta buyurtma\n\n## Brauzer — panel\n21:45:05.167 brauzer: GET /admin/orders (1)\n21:45:05.208 brauzer: WebSocket ochildi\n21:45:05.214 brauzer: GET /admin/orders (2)\n21:45:05.837 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:45:07.009 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:45:07.009 brauzer: GET /admin/orders (3)\n21:45:10.084 SURAT 10-qayta-ishga-ai2-1 (1-buyurtma-ulangan) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:45:06\n21:45:10.542 brauzer: WebSocket yopildi\n21:45:10.551 belgi: «Ulangan» → «Ulanmoqda…»\n21:45:11.681 SURAT 10-qayta-ishga-ai2-2 (2-server-ochiq) — belgi «Ulanmoqda…» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:45:06\n21:45:21.676 brauzer: WebSocket ochildi\n21:45:21.686 brauzer: GET /admin/orders (4)\n21:45:21.715 belgi: «Ulanmoqda…» → «Ulangan»\n21:45:25.934 SURAT 10-qayta-ishga-ai2-3 (3-qayta-ulangan) — belgi «Ulangan» · ro'yxat: #2 [sariq], #1\n    [yangi] 2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:45:17\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 21:45:06\n21:45:26.558 tugadi — belgi «Ulangan» · ro'yxat: #2 [sariq], #1 · jami GET: 4\n\n## Terminal — npm run live\n$ npm run live\n21:45:06 ulanmoqda… http://localhost:3100\n21:45:06 connect · ulangan · transport: websocket\n21:45:07 order-changed {\"orderId\":1,\"reason\":\"new\"}\n21:45:10 disconnect: transport close · active=true → ulanmoqda\n21:45:11 connect_error: xhr poll error · active=true → ulanmoqda\n21:45:14 connect_error: xhr poll error · active=true → ulanmoqda\n21:45:19 connect · ulangan · transport: websocket\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:45:02 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: HB5cAN5c4q3l5JaAAAAA\nLOG [Live] panel ulandi: fWW9YI5KfzLNnTp0AAAB\n21:45:06 — Bobur botda buyurtma beradi\n21:45:06 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:45:06 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:45:07 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:45:07 — buyurtma #1 bazada\nLOG [Live] panel uzildi: HB5cAN5c4q3l5JaAAAAA\nLOG [Live] panel uzildi: fWW9YI5KfzLNnTp0AAAB\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:45:17 — Bobur botda buyurtma beradi (server o'chiq paytda yozgan — Telegram navbatidan, port ochilishidan oldin)\n21:45:17 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:45:17 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:45:17 — buyurtma #2 bazada\n21:45:17 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: isLrqSw9Ej_8dBO3AAAA\nLOG [Live] panel ulandi: VhTttmk-vv5qxmHTAAAB\nLOG [Live] panel uzildi: VhTttmk-vv5qxmHTAAAB\nLOG [Live] panel uzildi: isLrqSw9Ej_8dBO3AAAA\n\n## Baza (psql): orders — 2 ta, eng yangisi #2\n## Navbatdagi buyurtma hodisasi (#2) panelga keldimi: YO'Q — panel ulanmasdan oldin yuborilgan";
const KOD_OUT_AI1A = "# AI nusxasi ai1 (ws2v2-ai/ai1/diff.patch): server qayta ishga tushdi + navbatdagi buyurtma\n# Panel (brauzer) va terminal klienti bir vaqtda ochiq; server to'xtatiladi, 5 s dan keyin qayta yoqiladi\n\n## Qadamlar\n21:19:33 — Bobur 1-buyurtma (server ishlayapti) — panel ko'rdi\n21:19:33 — server to'xtatildi (Ctrl+C)\n21:19:39 — server qayta ishga tushirildi — server o'chiq paytda Bobur botga yozgan edi (Telegram navbati)\n21:19:48 — tekshiruv: bazada nechta buyurtma\n\n## Brauzer — panel\n21:19:28.215 brauzer: GET /admin/orders (1)\n21:19:28.234 brauzer: WebSocket ochildi\n21:19:28.236 brauzer: GET /admin/orders (2)\n21:19:28.849 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n21:19:29.927 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n21:19:29.927 brauzer: GET /admin/orders (3)\n21:19:33.058 SURAT 10-qayta-ishga-ai1-1 (1-buyurtma-ulangan) — belgi «Ulangan» · ro'yxat: #1\n21:19:33.506 brauzer: WebSocket yopildi\n21:19:33.519 belgi: «Ulangan» → «Ulanmoqda…»\n21:19:34.657 SURAT 10-qayta-ishga-ai1-2 (2-server-ochiq) — belgi «Ulanmoqda…» · ro'yxat: #1\n21:19:40.139 brauzer: WebSocket ochildi\n21:19:40.147 brauzer: GET /admin/orders (4)\n21:19:40.196 belgi: «Ulanmoqda…» → «Ulangan»\n21:19:40.361 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":2,\"reason\":\"new\"}]\n21:19:40.361 brauzer: GET /admin/orders (5)\n21:19:48.258 SURAT 10-qayta-ishga-ai1-3 (3-qayta-ulangan) — belgi «Ulangan» · ro'yxat: #2 [sariq], #1\n21:19:48.878 tugadi — belgi «Ulangan» · ro'yxat: #2 [sariq], #1 · jami GET: 5\n\n## Terminal — npm run live\n$ npm run live\n21:19:29 ulanmoqda… http://localhost:3100\n21:19:29 connect · ulangan · transport: websocket\n21:19:29 order-changed {\"orderId\":1,\"reason\":\"new\"}\n21:19:33 disconnect: transport close · active=true → ulanmoqda\n21:19:34 connect_error: xhr poll error · active=true → ulanmoqda\n21:19:35 connect_error: xhr poll error · active=true → ulanmoqda\n21:19:38 connect_error: xhr poll error · active=true → ulanmoqda\n21:19:43 connect · ulangan · transport: websocket\n\n## Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:19:25 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: rMWZF8xoSJRTjN6yAAAA\nLOG [Live] panel ulandi: 8IQANn3bNcg1htzMAAAB\n21:19:29 — Bobur botda buyurtma beradi\n21:19:29 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:19:29 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n21:19:29 bot → 5987654321: Buyurtma #1 qabul qilindi!\n21:19:29 — buyurtma #1 bazada\nLOG [Live] panel uzildi: rMWZF8xoSJRTjN6yAAAA\nLOG [Live] panel uzildi: 8IQANn3bNcg1htzMAAAB\nLOG [InstanceLoader] LiveModule dependencies initialized\n21:19:40 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: P1R_0G1DJCH2NAVvAAAA\n21:19:40 — Bobur botda buyurtma beradi (server o'chiq paytda yozgan — Telegram navbatidan)\n21:19:40 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n21:19:40 bot → 5987654321: Buyurtma #2 qabul qilindi!\n21:19:40 — buyurtma #2 bazada\nLOG [Live] panel ulandi: dWN_sXGnO0-PYXasAAAB\nLOG [Live] panel uzildi: P1R_0G1DJCH2NAVvAAAA\nLOG [Live] panel uzildi: dWN_sXGnO0-PYXasAAAB\n\n## Baza (psql): orders — 2 ta, eng yangisi #2";
const KOD_OUT_MJ05 = "$ node ws2-sinov.js xona eski\n# ilova: ulanish.ts — m12-dars-04-done (agent «bajardim» degan holat) · o'yin 1 «Mahalla maydoni»\n  0.9s  [Ali] ulangan\n  1.3s  [Ali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }\n  1.3s  [Ali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {\"oyinId\":1,\"soni\":1})\n  2.3s  --- Backend yangi versiyasi: qayta ishga tushirildi ---\n  2.3s  [Ali] ulanmoqda  (disconnect: transport close)\n  3.1s  [Ali] ulanmoqda  (connect_error: xhr poll error) …\n  6.1s  [Ali] ulangan\n  7.2s  [Vali] ulangan\n  7.2s  [Vali] GET /oyinlar (qayta ulanganda) → Mahalla maydoni: 8 / 10\n  7.5s  [Vali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }\n  7.5s  [Vali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {\"oyinId\":1,\"soni\":1})\n  9.0s  NATIJA: ikkala telefonda shu o'yin ochiq — kutilgan «Hozir ko'ryapti: 2»\n  9.0s  [Ali] ulanmagan  (disconnect: io client disconnect)\n  9.0s  [Vali] ulanmagan  (disconnect: io client disconnect)";
const KOD_OUT_MJ06 = "$ node ws2-sinov.js xona yangi\n# ilova: ulanish.ts — m12-dars-05-done (tuzatilgan) · o'yin 1 «Mahalla maydoni»\n  0.9s  [Ali] ulangan\n  0.9s  [Ali] GET /oyinlar (qayta ulanganda) → Mahalla maydoni: 8 / 10\n  1.3s  [Ali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }\n  1.3s  [Ali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {\"oyinId\":1,\"soni\":1})\n  2.3s  --- Backend yangi versiyasi: qayta ishga tushirildi ---\n  2.3s  [Ali] ulanmoqda  (disconnect: transport close)\n  3.7s  [Ali] ulangan\n  3.7s  [Ali] Hozir ko'ryapti: 1  (korayotganlar-ozgardi {\"oyinId\":1,\"soni\":1})\n  3.8s  [Ali] GET /oyinlar (qayta ulanganda) → Mahalla maydoni: 8 / 10\n  4.7s  [Vali] ulangan\n  4.7s  [Vali] GET /oyinlar (qayta ulanganda) → Mahalla maydoni: 8 / 10\n  5.1s  [Vali] «O'yin» ekrani ochildi → oyin-ochildi { oyinId: 1 }\n  5.1s  [Ali] Hozir ko'ryapti: 2  (korayotganlar-ozgardi {\"oyinId\":1,\"soni\":2})\n  5.1s  [Vali] Hozir ko'ryapti: 2  (korayotganlar-ozgardi {\"oyinId\":1,\"soni\":2})\n  6.6s  NATIJA: ikkala telefonda shu o'yin ochiq — kutilgan «Hozir ko'ryapti: 2»\n  6.6s  [Ali] ulanmagan  (disconnect: io client disconnect)\n  6.6s  [Vali] ulanmagan  (disconnect: io client disconnect)";
const KOD_PANEL = [
 {
  "k": "01-1",
  "t": "21:37:29",
  "note": "1-buyurtma-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:37:26"
    ]
   }
  ]
 },
 {
  "k": "01-2",
  "t": "21:37:31",
  "note": "2-server-ochiq",
  "belgi": "Ulanmoqda…",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:37:26"
    ]
   }
  ]
 },
 {
  "k": "01-3",
  "t": "21:37:44",
  "note": "3-qayta-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:37:26"
    ]
   }
  ]
 },
 {
  "k": "02-1",
  "t": "21:38:45",
  "note": "1-offline-6s",
  "belgi": "Ulangan",
  "rows": [
   {
    "msg": "Hali buyurtma yo'q"
   }
  ]
 },
 {
  "k": "02-2",
  "t": "21:38:50",
  "note": "2-online",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:38:41"
    ]
   }
  ]
 },
 {
  "k": "02-3",
  "t": "21:39:50",
  "note": "3-offline-60s",
  "belgi": "Ulanmoqda…",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:38:41"
    ]
   }
  ]
 },
 {
  "k": "02-4",
  "t": "21:39:59",
  "note": "4-online",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:38:41"
    ]
   }
  ]
 },
 {
  "k": "03-1",
  "t": "21:40:07",
  "note": "1-tarmoq-yoq",
  "belgi": "Ulanmoqda…",
  "rows": [
   {
    "msg": "Hali buyurtma yo'q"
   }
  ]
 },
 {
  "k": "03-2",
  "t": "21:40:20",
  "note": "2-qayta-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "msg": "Hali buyurtma yo'q"
   }
  ]
 },
 {
  "k": "04-1",
  "t": "21:38:06",
  "note": "1-buyurtma-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:38:03"
    ]
   }
  ]
 },
 {
  "k": "04-2",
  "t": "21:38:08",
  "note": "2-server-ochiq",
  "belgi": "Ulanmoqda…",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:38:03"
    ]
   }
  ]
 },
 {
  "k": "04-3",
  "t": "21:38:21",
  "note": "3-qayta-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": true,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:38:13"
    ]
   },
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:38:03"
    ]
   }
  ]
 },
 {
  "k": "05-1",
  "t": "21:40:28",
  "note": "1-tarmoq-yoq",
  "belgi": "Ulanmoqda…",
  "rows": [
   {
    "msg": "Hali buyurtma yo'q"
   }
  ]
 },
 {
  "k": "05-2",
  "t": "21:40:41",
  "note": "2-qayta-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:40:29"
    ]
   }
  ]
 },
 {
  "k": "06-1",
  "t": "21:40:50",
  "note": "1-birinchi-ulanish",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:40:47"
    ]
   }
  ]
 },
 {
  "k": "06-2",
  "t": "21:41:03",
  "note": "2-bir-qayta-ulanish",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:41:00"
    ]
   },
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:40:47"
    ]
   }
  ]
 },
 {
  "k": "06-3",
  "t": "21:41:16",
  "note": "3-ikki-qayta-ulanish",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "3",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:41:13"
    ]
   },
   {
    "yangi": false,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:41:00"
    ]
   },
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:40:47"
    ]
   }
  ]
 },
 {
  "k": "09-1",
  "t": "21:42:52",
  "note": "1-notogri-token",
  "belgi": "Ulanmagan",
  "rows": [
   {
    "msg": "Token noto'g'ri"
   }
  ]
 },
 {
  "k": "11-1",
  "t": "21:43:00",
  "note": "1-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:42:57"
    ]
   }
  ]
 },
 {
  "k": "11-2",
  "t": "21:44:01",
  "note": "2-offline-60s",
  "belgi": "Ulanmoqda…",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:42:57"
    ]
   }
  ]
 },
 {
  "k": "11-3",
  "t": "21:44:10",
  "note": "3-online",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": true,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:43:06"
    ]
   },
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:42:57"
    ]
   }
  ]
 },
 {
  "k": "ai1-1",
  "t": "21:44:23",
  "note": "1-buyurtma-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:44:20"
    ]
   }
  ]
 },
 {
  "k": "ai1-2",
  "t": "21:44:25",
  "note": "2-server-ochiq",
  "belgi": "Ulanmoqda…",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:44:20"
    ]
   }
  ]
 },
 {
  "k": "ai1-3",
  "t": "21:44:38",
  "note": "3-qayta-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": true,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:44:30"
    ]
   },
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:44:20"
    ]
   }
  ]
 },
 {
  "k": "ai2-1",
  "t": "21:45:10",
  "note": "1-buyurtma-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:45:06"
    ]
   }
  ]
 },
 {
  "k": "ai2-2",
  "t": "21:45:11",
  "note": "2-server-ochiq",
  "belgi": "Ulanmoqda…",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:45:06"
    ]
   }
  ]
 },
 {
  "k": "ai2-3",
  "t": "21:45:25",
  "note": "3-qayta-ulangan",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": true,
    "cells": [
     "2",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:45:17"
    ]
   },
   {
    "yangi": false,
    "cells": [
     "1",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "21:45:06"
    ]
   }
  ]
 },
 {
  "k": "ai1a-1",
  "t": "21:19:33",
  "note": "1-buyurtma-ulangan",
  "belgi": "Ulangan",
  "rows": []
 },
 {
  "k": "ai1a-2",
  "t": "21:19:34",
  "note": "2-server-ochiq",
  "belgi": "Ulanmoqda…",
  "rows": []
 },
 {
  "k": "ai1a-3",
  "t": "21:19:48",
  "note": "3-qayta-ulangan",
  "belgi": "Ulangan",
  "rows": []
 }
];
const KOD_AI_AI1 = {
 "stat": "2 files changed, 22 insertions(+), 3 deletions(-)",
 "diff": "diff --git a/README.md b/README.md\nindex 9946cbe..5753f72 100644\n--- a/README.md\n+++ b/README.md\n@@ -52,6 +52,7 @@ Hodisa tranzaksiya tugagandan keyin yuboriladi: panel so'raganda buyurtma bazada\n \n - Ulanish — socket.io (`@nestjs/websockets`, `@nestjs/platform-socket.io`), HTTP bilan bitta portda. Token ulanish ochilayotganda tekshiriladi (`auth: { token }`); noto'g'ri bo'lsa server ulanishni yopadi.\n - Panel belgisi: **Ulangan** — hodisalar keladi · **Ulanmoqda…** — server javob bermayapti, klient o'zi qayta urinmoqda · **Ulanmagan** — token noto'g'ri, klient urinmaydi.\n+- Har ulanishda (uzilishdan keyingi qayta ulanishda ham) panel ro'yxatni `GET /admin/orders` dan qayta so'raydi: ulanish yo'q paytda yuborilgan `order-changed` hech kimga yetmaydi (server uni saqlamaydi), shuning uchun server qayta ishga tushganda yoki internet uzilib qaytganda tushgan buyurtma ham ro'yxatda chiqadi.\n - Brauzersiz tekshirish: `npm run live` — terminal klienti (`npm run live -- notogri` — noto'g'ri token bilan).\n - Telegram'siz tekshirish: `npm run smoke -- live`.\n \ndiff --git a/public/admin.html b/public/admin.html\nindex 1101aa4..8ff2b5a 100644\n--- a/public/admin.html\n+++ b/public/admin.html\n@@ -61,13 +61,25 @@\n   }\n \n   // Ro'yxat — har doim Backend'dan (GET /admin/orders). Hodisa faqat «nimadir o'zgardi» deydi.\n+  // Bir vaqtda bir nechta so'rov ketishi mumkin (qayta ulanish + hodisa). Javoblar istalgan tartibda\n+  // qaytadi — eskisi yangisining ustiga yozmasligi uchun faqat ENG OXIRGI so'rov javobi chiziladi.\n+  let soroqRaqami = 0;\n   async function yukla() {\n-    const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });\n+    const men = ++soroqRaqami;\n+    let r, list;\n+    try {\n+      r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });\n+      if (r.ok) list = await r.json();\n+    } catch {\n+      // tarmoq yo'q — ro'yxat qanday bo'lsa qoladi; ulanish qaytganda «connect» qayta so'raydi\n+      return;\n+    }\n+    if (men !== soroqRaqami) return; // shu orada yangiroq so'rov ketgan — o'sha chizadi\n     if (r.status === 401) {\n       el('royxat').innerHTML = \"<tr><td colspan='7'>Token noto'g'ri</td></tr>\";\n       return;\n     }\n-    const list = await r.json();\n+    if (!list) return;\n     const eng = list.length ? list[0].id : 0;\n     el('royxat').innerHTML = list.length\n       ? list.map((o) => `<tr class=\"${o.id > oxirgiId && oxirgiId ? 'yangi' : ''}\">\n@@ -83,7 +95,13 @@\n     if (ulanish) ulanish.close();\n     ulanish = io({ auth: { token } });\n     holatQoy('ulanmoqda');\n-    ulanish.on('connect', () => holatQoy('ulangan'));\n+    // Har ulanishda (birinchi ham, uzilishdan keyingi ham) ro'yxat qayta so'raladi: ulanish yo'q paytda\n+    // yuborilgan order-changed hech kimga yetmaydi — server uni saqlamaydi. Faqat hodisaga ishonsak,\n+    // server qayta ishga tushganda yoki internet uzilib qaytganda tushgan buyurtma ro'yxatda chiqmay qoladi.\n+    ulanish.on('connect', () => {\n+      holatQoy('ulangan');\n+      yukla();\n+    });\n     // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»\n     ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));\n     ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));"
};
const KOD_AI_AI2 = {
 "stat": "1 file changed, 8 insertions(+), 1 deletion(-)",
 "diff": "diff --git a/public/admin.html b/public/admin.html\nindex 1101aa4..6e4342d 100644\n--- a/public/admin.html\n+++ b/public/admin.html\n@@ -61,13 +61,18 @@\n   }\n \n   // Ro'yxat — har doim Backend'dan (GET /admin/orders). Hodisa faqat «nimadir o'zgardi» deydi.\n+  // So'rovlar ustma-ust kelsa (uzilish-qayta ulanish), faqat oxirgisi ekranga chiqadi.\n+  let sorovSoni = 0;\n   async function yukla() {\n+    const bu = ++sorovSoni;\n     const r = await fetch('/admin/orders', { headers: { Authorization: 'Bearer ' + token } });\n+    if (bu !== sorovSoni) return;\n     if (r.status === 401) {\n       el('royxat').innerHTML = \"<tr><td colspan='7'>Token noto'g'ri</td></tr>\";\n       return;\n     }\n     const list = await r.json();\n+    if (bu !== sorovSoni) return;\n     const eng = list.length ? list[0].id : 0;\n     el('royxat').innerHTML = list.length\n       ? list.map((o) => `<tr class=\"${o.id > oxirgiId && oxirgiId ? 'yangi' : ''}\">\n@@ -83,7 +88,9 @@\n     if (ulanish) ulanish.close();\n     ulanish = io({ auth: { token } });\n     holatQoy('ulanmoqda');\n-    ulanish.on('connect', () => holatQoy('ulangan'));\n+    // Ulanish (birinchi marta yoki qayta ulanish) — ro'yxatni qayta so'raymiz: uzilib turgan paytda kelgan\n+    // buyurtma hodisasi qaytmaydi, shuning uchun server «Ulangan» bo'lganda ham ro'yxat eskirgan bo'lishi mumkin.\n+    ulanish.on('connect', () => { holatQoy('ulangan'); yukla(); });\n     // uzilish yoki ulanish xatosi: klient o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda», server yopgan bo'lsa — «ulanmagan»\n     ulanish.on('disconnect', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));\n     ulanish.on('connect_error', () => holatQoy(ulanish.active ? 'ulanmoqda' : 'ulanmagan'));"
};
const KOD_PROMPT1 = "OrderBotNest'dagi jonli buyurtmalar paneli (/admin) ba'zan yangi buyurtmani ko'rsatmaydi: server qayta ishga tushganda yoki internet uzilib qaytganda belgi «Ulangan» bo'ladi, lekin bot olgan buyurtma ro'yxatda yo'q — sahifani yangilasam chiqadi. Tuzatib ber.";
const KOD = { HTML: KOD_HTML, CLIENT: KOD_CLIENT, TG: KOD_TG, GATEWAY: KOD_GATEWAY, BUZISH: KOD_BUZISH, HTML_START: KOD_HTML_START, HTML_XATO: KOD_HTML_XATO, GATEWAY_TIKLASH: KOD_GATEWAY_TIKLASH, README_START: KOD_README_START, README: KOD_README, MJ_UL_START: KOD_MJ_UL_START, MJ_UL: KOD_MJ_UL, OUT: { '00': KOD_OUT_00, '00b': KOD_OUT_00B, '01': KOD_OUT_01, '02': KOD_OUT_02, '03': KOD_OUT_03, '04': KOD_OUT_04, '05': KOD_OUT_05, '06': KOD_OUT_06, '07': KOD_OUT_07, '08': KOD_OUT_08, '09': KOD_OUT_09, '11': KOD_OUT_11, '12': KOD_OUT_12, 'ai1': KOD_OUT_AI1, 'ai2': KOD_OUT_AI2, 'ai1a': KOD_OUT_AI1A, 'mj05': KOD_OUT_MJ05, 'mj06': KOD_OUT_MJ06 }, PANEL: KOD_PANEL, AI: { ai1: KOD_AI_AI1, ai2: KOD_AI_AI2 }, PROMPT1: KOD_PROMPT1 };
