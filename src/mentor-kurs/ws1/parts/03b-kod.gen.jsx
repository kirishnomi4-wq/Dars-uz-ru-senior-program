
// AVTO: feedback/F-1029-02-mentor-kurs/dev/ws1-kod.py — OrderBotNest ws1-done, maydon-jamoa m12-dars-03-done, haqiqiy chiqishlar (qo'lda tahrirlanmaydi)
const KOD_GATEWAY = {
 "file": "src/api/live/live.gateway.ts",
 "tag": "ws1-done",
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
const KOD_TOKEN = {
 "file": "src/api/live/admin-token.ts",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "import { config } from '../../config';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "// Panel tokeni — .env dagi ADMIN_PANEL_TOKEN. Bitta qoida ikki joyda ishlatiladi:",
   "n": 3
  },
  {
   "t": "// WebSocket ulanishi ochilayotganda (gateway) va GET /admin/orders so'rovida (controller).",
   "n": 4
  },
  {
   "t": "// .env da token yozilmagan bo'lsa — hech kim kira olmaydi (bo'sh token ham rad etiladi).",
   "n": 5
  },
  {
   "t": "export function isAdminToken(token: unknown): boolean {",
   "n": 6
  },
  {
   "t": "  return (",
   "n": 7
  },
  {
   "t": "    typeof token === 'string' &&",
   "n": 8
  },
  {
   "t": "    token !== '' &&",
   "n": 9
  },
  {
   "t": "    token === config.ADMIN_PANEL_TOKEN",
   "n": 10
  },
  {
   "t": "  );",
   "n": 11
  },
  {
   "t": "}",
   "n": 12
  }
 ]
};
const KOD_CTRL = {
 "file": "src/api/live/admin.controller.ts",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "import {",
   "n": 1
  },
  {
   "t": "  Controller,",
   "n": 2
  },
  {
   "t": "  Get,",
   "n": 3
  },
  {
   "t": "  Header,",
   "n": 4
  },
  {
   "t": "  Headers,",
   "n": 5
  },
  {
   "t": "  UnauthorizedException,",
   "n": 6
  },
  {
   "t": "} from '@nestjs/common';",
   "n": 7
  },
  {
   "t": "import { readFileSync } from 'fs';",
   "n": 8
  },
  {
   "t": "import { join } from 'path';",
   "n": 9
  },
  {
   "t": "import { OrderService } from '../order/order.service';",
   "n": 10
  },
  {
   "t": "import { isAdminToken } from './admin-token';",
   "n": 11
  },
  {
   "t": "",
   "n": 12
  },
  {
   "t": "@Controller('admin')",
   "n": 13
  },
  {
   "t": "export class AdminController {",
   "n": 14
  },
  {
   "t": "  constructor(private readonly orders: OrderService) {}",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "  // Panel sahifasi: http://localhost:3000/admin — oddiy HTML. Tokenni sahifa so'raydi va brauzerda saqlaydi.",
   "n": 17
  },
  {
   "t": "  @Get()",
   "n": 18
  },
  {
   "t": "  @Header('Content-Type', 'text/html; charset=utf-8')",
   "n": 19
  },
  {
   "t": "  page(): string {",
   "n": 20
  },
  {
   "t": "    return readFileSync(join(process.cwd(), 'public', 'admin.html'), 'utf8');",
   "n": 21
  },
  {
   "t": "  }",
   "n": 22
  },
  {
   "t": "",
   "n": 23
  },
  {
   "t": "  // Panel shu ro'yxatni ochilganda va har order-changed hodisasidan keyin so'raydi.",
   "n": 24
  },
  {
   "t": "  // Token sarlavhada: Authorization: Bearer <ADMIN_PANEL_TOKEN>",
   "n": 25
  },
  {
   "t": "  @Get('orders')",
   "n": 26
  },
  {
   "t": "  async list(@Headers('authorization') auth?: string) {",
   "n": 27
  },
  {
   "t": "    const token = (auth ?? '').replace(/^Bearer /, '');",
   "n": 28
  },
  {
   "t": "    if (!isAdminToken(token))",
   "n": 29
  },
  {
   "t": "      throw new UnauthorizedException(\"Token noto'g'ri\");",
   "n": 30
  },
  {
   "t": "    const orders = await this.orders.recent(20);",
   "n": 31
  },
  {
   "t": "    return orders.map((o) => ({",
   "n": 32
  },
  {
   "t": "      id: o.id,",
   "n": 33
  },
  {
   "t": "      status: o.status,",
   "n": 34
  },
  {
   "t": "      total: o.total,",
   "n": 35
  },
  {
   "t": "      customer: o.user?.name ?? '',",
   "n": 36
  },
  {
   "t": "      phone: o.phone,",
   "n": 37
  },
  {
   "t": "      items: o.items.map((i) => ({ name: i.product.name, qty: i.qty })),",
   "n": 38
  },
  {
   "t": "      created_at: o.created_at,",
   "n": 39
  },
  {
   "t": "    }));",
   "n": 40
  },
  {
   "t": "  }",
   "n": 41
  },
  {
   "t": "}",
   "n": 42
  }
 ]
};
const KOD_MODULE = {
 "file": "src/api/live/live.module.ts",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "import { Module } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import { OrderModule } from '../order/order.module';",
   "n": 2
  },
  {
   "t": "import { AdminController } from './admin.controller';",
   "n": 3
  },
  {
   "t": "import { LiveGateway } from './live.gateway';",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "// Jonli panel: /admin sahifasi, GET /admin/orders va WebSocket gateway (order-changed hodisasi)",
   "n": 6
  },
  {
   "t": "@Module({",
   "n": 7
  },
  {
   "t": "  imports: [OrderModule],",
   "n": 8
  },
  {
   "t": "  controllers: [AdminController],",
   "n": 9
  },
  {
   "t": "  providers: [LiveGateway],",
   "n": 10
  },
  {
   "t": "  exports: [LiveGateway],",
   "n": 11
  },
  {
   "t": "})",
   "n": 12
  },
  {
   "t": "export class LiveModule {}",
   "n": 13
  }
 ]
};
const KOD_TG = {
 "file": "src/api/telegram/telegram.service.ts",
 "tag": "ws1-done",
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
const KOD_TGMOD = {
 "file": "src/api/telegram/telegram.module.ts",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "import { Module } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import { CartModule } from '../cart/cart.module';",
   "n": 2
  },
  {
   "t": "import { CatalogModule } from '../catalog/catalog.module';",
   "n": 3
  },
  {
   "t": "import { LiveModule } from '../live/live.module';",
   "n": 4
  },
  {
   "t": "import { OrderModule } from '../order/order.module';",
   "n": 5
  },
  {
   "t": "import { UserModule } from '../user/user.module';",
   "n": 6
  },
  {
   "t": "import { TelegramService } from './telegram.service';",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "@Module({",
   "n": 9
  },
  {
   "t": "  imports: [UserModule, CatalogModule, CartModule, OrderModule, LiveModule],",
   "n": 10
  },
  {
   "t": "  providers: [TelegramService],",
   "n": 11
  },
  {
   "t": "})",
   "n": 12
  },
  {
   "t": "export class TelegramModule {}",
   "n": 13
  }
 ]
};
const KOD_HTML = {
 "file": "public/admin.html",
 "tag": "ws1-done",
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
const KOD_CLIENT = {
 "file": "scripts/live-client.js",
 "tag": "ws1-done",
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
   "t": "s.on('connect', () => {",
   "n": 24
  },
  {
   "t": "  console.log(",
   "n": 25
  },
  {
   "t": "    `${t()} connect · ${holat(s)} · transport: ${s.io.engine.transport.name}`,",
   "n": 26
  },
  {
   "t": "  );",
   "n": 27
  },
  {
   "t": "  s.io.engine.once('upgrade', (tr) =>",
   "n": 28
  },
  {
   "t": "    console.log(`${t()} transport: ${tr.name}`),",
   "n": 29
  },
  {
   "t": "  );",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "s.on('disconnect', (reason) =>",
   "n": 32
  },
  {
   "t": "  console.log(",
   "n": 33
  },
  {
   "t": "    `${t()} disconnect: ${reason} · active=${s.active} → ${holat(s)}`,",
   "n": 34
  },
  {
   "t": "  ),",
   "n": 35
  },
  {
   "t": ");",
   "n": 36
  },
  {
   "t": "s.on('connect_error', (e) =>",
   "n": 37
  },
  {
   "t": "  console.log(",
   "n": 38
  },
  {
   "t": "    `${t()} connect_error: ${e.message} · active=${s.active} → ${holat(s)}`,",
   "n": 39
  },
  {
   "t": "  ),",
   "n": 40
  },
  {
   "t": ");",
   "n": 41
  },
  {
   "t": "s.on('order-changed', (p) =>",
   "n": 42
  },
  {
   "t": "  console.log(`${t()} order-changed ${JSON.stringify(p)}`),",
   "n": 43
  },
  {
   "t": ");",
   "n": 44
  }
 ]
};
const KOD_ENV = {
 "file": ".env.example",
 "tag": "ws1-done",
 "lines": [
  {
   "t": "# Bu faylni nusxalab .env deb nomlang. .env git'ga tushmaydi.",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "# @BotFather beradi (Telegramda /newbot)",
   "n": 3
  },
  {
   "t": "BOT_TOKEN=",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "# Admin bo'ladigan Telegram id'lar, vergul bilan (o'zingiznikini @userinfobot dan oling)",
   "n": 6
  },
  {
   "t": "ADMIN_TELEGRAM_IDS=",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "# Jonli panel (http://localhost:3000/admin) va WebSocket ulanishi uchun maxfiy so'z — o'zingiz o'ylab topasiz.",
   "n": 9
  },
  {
   "t": "# Bo'sh qolsa panelga hech kim kira olmaydi.",
   "n": 10
  },
  {
   "t": "ADMIN_PANEL_TOKEN=",
   "n": 11
  },
  {
   "t": "",
   "n": 12
  },
  {
   "t": "# PostgreSQL (lokal: PG-1 darsida o'rnatilgan). Baza oldindan yaratilgan bo'lsin: CREATE DATABASE shop;",
   "n": 13
  },
  {
   "t": "DATABASE_URL=postgresql://postgres:parol@localhost:5432/shop",
   "n": 14
  },
  {
   "t": "",
   "n": 15
  },
  {
   "t": "# true — TypeORM har SQL so'rovni terminalga yozadi (o'rganish uchun qulay)",
   "n": 16
  },
  {
   "t": "DB_LOGGING=true",
   "n": 17
  },
  {
   "t": "",
   "n": 18
  },
  {
   "t": "# Server porti (hosting o'zi beradi, lokalda tegmaysiz)",
   "n": 19
  },
  {
   "t": "PORT=3000",
   "n": 20
  }
 ]
};
const KOD_README = {
 "file": "README.md",
 "tag": "ws1-done",
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
const KOD_MJ_README = {
 "file": "README.md",
 "tag": "m12-dars-03-done",
 "lines": [
  {
   "t": "## Real vaqt",
   "n": 103
  },
  {
   "t": "| Real vaqt nuqtasi | Kim nima qiladi | Hodisa | Kim oladi | Ekranda nima o'zgaradi |",
   "n": 105
  },
  {
   "t": "|---|---|---|---|---|",
   "n": 106
  },
  {
   "t": "| «8 / 10» va qo'shilganlar ro'yxati | o'yinchi «Qo'shilaman» ni bosadi | `oyin-ozgardi` · sabab `qoshildi` | hamma ulangan ilova | «8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi |",
   "n": 107
  },
  {
   "t": "| «8 / 10» va qo'shilganlar ro'yxati | o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa) | `oyin-ozgardi` · sabab `chiqdi` | hamma ulangan ilova | son va ro'yxat yangilanadi |",
   "n": 108
  },
  {
   "t": "| «Kelaman» belgilari | o'yinchi «Kelaman» ni bosadi | `oyin-ozgardi` · sabab `tasdiqladi` | hamma ulangan ilova | «Kelishini tasdiqladi: 7 / 9» → «8 / 9» |",
   "n": 109
  },
  {
   "t": "| «Navbatda: N» | o'yinchi navbatga yoziladi | `oyin-ozgardi` · sabab `navbatga-yozildi` | hamma ulangan ilova | «Navbatda: 1» |",
   "n": 110
  },
  {
   "t": "| o'yinlar ro'yxati | tashkilotchi o'yin e'lon qiladi | `oyin-ozgardi` · sabab `elon-berildi` | hamma ulangan ilova | ro'yxatda yangi karta |",
   "n": 111
  },
  {
   "t": "`oyin-ozgardi` — `{ oyinId, sabab }`. Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi.",
   "n": 113
  },
  {
   "t": "Backend hodisani o'zgarish Database'ga yozib tugatilgandan keyin yuboradi (tranzaksiya bo'lsa — u tugagach); ilova bitta hodisadan keyin `GET /oyinlar` ni bir marta so'raydi — «O'yinlar» va «O'yin» shu javobdan o'qiydi.",
   "n": 114
  }
 ]
};
const KOD_MJ_ULANISH = {
 "file": "mobil/src/ulanish.ts",
 "tag": "m12-dars-03-done",
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
   "t": "import { oyinlarniOl } from '@/oyin';",
   "n": 6
  },
  {
   "t": "",
   "n": 7
  },
  {
   "t": "// Doimiy ulanish (socket.io): ilova Backend'ga bir marta ulanadi, ulanish ochiq turadi.",
   "n": 8
  },
  {
   "t": "// Manzil — o'sha EXPO_PUBLIC_API_URL; ulanayotganda token yuboriladi (auth) — Backend uni shu paytda tekshiradi.",
   "n": 9
  },
  {
   "t": "// Hodisa oyin-ozgardi { oyinId, sabab } kelganda ilova GET /oyinlar ni bir marta qayta so'raydi —",
   "n": 10
  },
  {
   "t": "// «O'yinlar» va «O'yin» shu bitta javobdan yangilanadi (oyin.ts). Hodisa o'zgarish bo'lganini aytadi; yangi holat — Backend'dan.",
   "n": 11
  },
  {
   "t": "",
   "n": 12
  },
  {
   "t": "// Uch ulanish holati:",
   "n": 13
  },
  {
   "t": "// ulangan — hodisalar keladi · ulanmoqda — ulanish yo'q, ilova o'zi ulanishga urinmoqda (birinchi marta yoki uzilgandan keyin) ·",
   "n": 14
  },
  {
   "t": "// ulanmagan — ilova urinmayapti (token yo'q yoki yaroqsiz, yoki hisobdan chiqilgan)",
   "n": 15
  },
  {
   "t": "export type UlanishHolati = 'ulangan' | 'ulanmoqda' | 'ulanmagan';",
   "n": 16
  },
  {
   "t": "",
   "n": 17
  },
  {
   "t": "let ulanish: Socket | null = null;",
   "n": 18
  },
  {
   "t": "let ilovaHolati: NativeEventSubscription | null = null;",
   "n": 19
  },
  {
   "t": "let holat: UlanishHolati = 'ulanmagan';",
   "n": 20
  },
  {
   "t": "const holatniKuzatuvchilar = new Set<(h: UlanishHolati) => void>();",
   "n": 21
  },
  {
   "t": "",
   "n": 22
  },
  {
   "t": "function holatQoy(yangi: UlanishHolati) {",
   "n": 23
  },
  {
   "t": "  holat = yangi;",
   "n": 24
  },
  {
   "t": "  holatniKuzatuvchilar.forEach((k) => k(yangi));",
   "n": 25
  },
  {
   "t": "}",
   "n": 26
  },
  {
   "t": "",
   "n": 27
  },
  {
   "t": "// Uzilish yoki ulanish xatosidan keyin: socket.io o'zi qayta urinayotgan bo'lsa (active) — «ulanmoqda»,",
   "n": 28
  },
  {
   "t": "// Backend yopgan bo'lsa (token yaroqsiz) yoki ilova o'zi yopgan bo'lsa — «ulanmagan»",
   "n": 29
  },
  {
   "t": "function uzilishdanKeyin() {",
   "n": 30
  },
  {
   "t": "  holatQoy(ulanish?.active ? 'ulanmoqda' : 'ulanmagan');",
   "n": 31
  },
  {
   "t": "}",
   "n": 32
  },
  {
   "t": "",
   "n": 33
  },
  {
   "t": "// Ulanishni ochadi — token o'qib bo'lingandan keyingina. Ulanish bor bo'lsa — qayta ochilmaydi:",
   "n": 34
  },
  {
   "t": "// ekran necha marta ochilsa ham ulanish va uning tinglovchilari bitta.",
   "n": 35
  },
  {
   "t": "export async function ulan() {",
   "n": 36
  },
  {
   "t": "  if (ulanish) return;",
   "n": 37
  },
  {
   "t": "  const token = await tokenOl();",
   "n": 38
  },
  {
   "t": "  if (!token || ulanish) return;",
   "n": 39
  },
  {
   "t": "",
   "n": 40
  },
  {
   "t": "  ulanish = io(API, { auth: { token } });",
   "n": 41
  },
  {
   "t": "  holatQoy('ulanmoqda');",
   "n": 42
  },
  {
   "t": "  ulanish.on('connect', () => {",
   "n": 43
  },
  {
   "t": "    holatQoy('ulangan');",
   "n": 44
  },
  {
   "t": "    ulanish?.on('oyin-ozgardi', () => {",
   "n": 45
  },
  {
   "t": "      qaytaSora();",
   "n": 46
  },
  {
   "t": "    });",
   "n": 47
  },
  {
   "t": "  });",
   "n": 48
  },
  {
   "t": "  ulanish.on('disconnect', uzilishdanKeyin);",
   "n": 49
  },
  {
   "t": "  ulanish.on('connect_error', uzilishdanKeyin);",
   "n": 50
  },
  {
   "t": "",
   "n": 51
  },
  {
   "t": "  // Ilova fonda turganda o'zgarish bo'lsa: fondan qaytganda ro'yxat qayta so'raladi",
   "n": 52
  },
  {
   "t": "  let oldingi: string | null | undefined = AppState.currentState;",
   "n": 53
  },
  {
   "t": "  ilovaHolati = AppState.addEventListener('change', (yangi: AppStateStatus) => {",
   "n": 54
  },
  {
   "t": "    if (oldingi === 'background' && yangi === 'active') qaytaSora();",
   "n": 55
  },
  {
   "t": "    oldingi = yangi;",
   "n": 56
  },
  {
   "t": "  });",
   "n": 57
  },
  {
   "t": "}",
   "n": 58
  },
  {
   "t": "",
   "n": 59
  },
  {
   "t": "// Hodisadan keyin — GET /oyinlar bir marta; xato bo'lsa ekranda eski ro'yxat qoladi (pastga tortib yangilash ishlaydi)",
   "n": 60
  },
  {
   "t": "function qaytaSora() {",
   "n": 61
  },
  {
   "t": "  oyinlarniOl().catch(() => {});",
   "n": 62
  },
  {
   "t": "}",
   "n": 63
  },
  {
   "t": "",
   "n": 64
  },
  {
   "t": "// «Hisobdan chiqish»: ulanish yopiladi. Qayta kirilganda ulan() yangi token bilan yangi ulanish ochadi.",
   "n": 65
  },
  {
   "t": "export function uzil() {",
   "n": 66
  },
  {
   "t": "  ilovaHolati?.remove();",
   "n": 67
  },
  {
   "t": "  ilovaHolati = null;",
   "n": 68
  },
  {
   "t": "  ulanish?.removeAllListeners();",
   "n": 69
  },
  {
   "t": "  ulanish?.disconnect();",
   "n": 70
  },
  {
   "t": "  ulanish = null;",
   "n": 71
  },
  {
   "t": "  holatQoy('ulanmagan');",
   "n": 72
  },
  {
   "t": "}",
   "n": 73
  },
  {
   "t": "",
   "n": 74
  },
  {
   "t": "// Ekranda belgi uchun: hozirgi holat va uning o'zgarishi",
   "n": 75
  },
  {
   "t": "export function useUlanishHolati(): UlanishHolati {",
   "n": 76
  },
  {
   "t": "  const [h, setH] = useState(holat);",
   "n": 77
  },
  {
   "t": "  useEffect(() => {",
   "n": 78
  },
  {
   "t": "    holatniKuzatuvchilar.add(setH);",
   "n": 79
  },
  {
   "t": "    setH(holat);",
   "n": 80
  },
  {
   "t": "    return () => {",
   "n": 81
  },
  {
   "t": "      holatniKuzatuvchilar.delete(setH);",
   "n": 82
  },
  {
   "t": "    };",
   "n": 83
  },
  {
   "t": "  }, []);",
   "n": 84
  },
  {
   "t": "  return h;",
   "n": 85
  },
  {
   "t": "}",
   "n": 86
  }
 ]
};
const KOD_OUT_00 = "v24.18.0\n11.16.0\nHEAD fb8b8b4 ws1-done: jonli buyurtmalar paneli — socket.io gateway (order-cha\n@nestjs/core 11.2.8\n@nestjs/websockets 11.2.8\n@nestjs/platform-socket.io 11.2.8\nsocket.io 4.8.4\nsocket.io-client 4.8.4\nWed Nov  4 08:19:08 PM +05 2026";
const KOD_OUT_01 = "# OrderBotNest serveri (PORT=3100), Nest logi — ishga tushish\n$ npm run start\nLOG [NestFactory] Starting Nest application...\nLOG [InstanceLoader] LiveModule dependencies initialized\nLOG [InstanceLoader] TelegramModule dependencies initialized\nLOG [RoutesResolver] AppController {/}:\nLOG [RouterExplorer] Mapped {/, GET} route\nLOG [RoutesResolver] AdminController {/admin}:\nLOG [RouterExplorer] Mapped {/admin, GET} route\nLOG [RouterExplorer] Mapped {/admin/orders, GET} route\nTelegram bot ulandi\nLOG [NestApplication] Nest application successfully started\n20:19:12 Server 3100-portda ishlayapti";
const KOD_OUT_02 = "# GET /admin/orders — Bobur buyurtma berishidan OLDIN va KEYIN (panel o'zi so'ramasa, yangi buyurtmani bilmaydi)\n$ curl -s http://localhost:3100/admin/orders -H 'Authorization: Bearer panel-sir'   # 1-so'rov\n[]\n\n# … 4 soniya: server logi\n20:19:16 — Bobur botda buyurtma beradi (/start → Klaviatura → Buyurtma → telefon)\n20:19:16 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n20:19:16 bot → 5987654321: Buyurtma uchun telefon raqamingizni yozing (masalan, +998901234567):\n20:19:16 bot → 5987654321: Buyurtma #1 qabul qilindi!\n\n$ curl -s http://localhost:3100/admin/orders -H 'Authorization: Bearer panel-sir'   # 2-so'rov\n[{\"id\":1,\"status\":\"NEW\",\"total\":120000,\"customer\":\"Bobur\",\"phone\":\"+998907654321\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1}],\"created_at\":\"2026-11-04T15:19:16.857Z\"}]\n\n$ curl -s -o /dev/null -w '%{http_code}' http://localhost:3100/admin/orders   # tokensiz\n401";
const KOD_OUT_03 = "# Tokensiz\n$ npm run live -- \"\"\n20:19:20 ulanmoqda… http://localhost:3100\n20:19:20 connect · ulangan · transport: websocket\n20:19:20 disconnect: io server disconnect · active=false → ulanmagan\n\n# Noto'g'ri token\n$ npm run live -- notogri\n20:19:20 ulanmoqda… http://localhost:3100\n20:19:20 connect · ulangan · transport: websocket\n20:19:20 disconnect: io server disconnect · active=false → ulanmagan\n\n# Server logi shu paytda ([Live] satri YO'Q — panel ulanmadi)\nLOG [InstanceLoader] LiveModule dependencies initialized\n20:19:19 Server 3100-portda ishlayapti";
const KOD_OUT_04 = "# Token bilan (.env: ADMIN_PANEL_TOKEN=panel-sir) — 3 s dan keyin Bobur buyurtma beradi, 2 s dan keyin admin tasdiqlaydi\n$ npm run live\n20:19:21 ulanmoqda… http://localhost:3100\n20:19:21 connect · ulangan · transport: websocket\n20:19:24 order-changed {\"orderId\":2,\"reason\":\"new\"}\n20:19:26 order-changed {\"orderId\":2,\"reason\":\"status\"}\n\n# Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n20:19:21 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: ihTR2ZPhfzOWYIrXAAAA\n20:19:24 — Bobur botda buyurtma beradi (/start → Klaviatura → Buyurtma → telefon)\n20:19:24 bot → 5987654321: Salom, Bobur! Bu CoddyCamp do'koni boti.\n20:19:24 bot (tugma javobi): Klaviatura savatga qo'shildi (1 ta).\n20:19:24 bot → 5987654321: Buyurtma #2 qabul qilindi!\n20:19:26 — admin (Jasur) #2 ni tasdiqlaydi\n20:19:26 bot → 111: Salom, Jasur! Bu CoddyCamp do'koni boti.\n20:19:26 bot (tugma javobi): #2 → ✅ Tasdiqlangan\n20:19:26 bot → 111: #2 · Bobur · 120 000 so'm · ✅ Tasdiqlangan\n20:19:26 bot → 5987654321: Buyurtmangiz #2: ✅ Tasdiqlangan\nLOG [Live] panel uzildi: ihTR2ZPhfzOWYIrXAAAA\n\n$ curl -s http://localhost:3100/admin/orders -H 'Authorization: Bearer panel-sir'   # hodisadan keyin panel so'raydigan javob\n[{\"id\":2,\"status\":\"CONFIRMED\",\"total\":120000,\"customer\":\"Bobur\",\"phone\":\"+998907654321\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1}],\"created_at\":\"2026-11-04T15:19:24.030Z\"},{\"id\":1,\"status\":\"NEW\",\"total\":120000,\"customer\":\"Bobur\",\"phone\":\"+998907654321\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1}],\"created_at\":\"2026-11-04T15:19:16.857Z\"}]";
const KOD_OUT_05 = "# Klient ochiq turadi; 3-soniyada server to'xtatiladi, 10-soniyada qayta yoqiladi\n20:19:34 — server to'xtatildi (Ctrl+C)\n20:19:41 — server qayta ishga tushirildi\n$ npm run live\n20:19:31 ulanmoqda… http://localhost:3100\n20:19:31 connect · ulangan · transport: websocket\n20:19:34 disconnect: transport close · active=true → ulanmoqda\n20:19:35 connect_error: xhr poll error · active=true → ulanmoqda\n20:19:37 connect_error: xhr poll error · active=true → ulanmoqda\n20:19:40 connect_error: xhr poll error · active=true → ulanmoqda\n20:19:45 connect · ulangan · transport: websocket";
const KOD_OUT_06 = "# Klient ochiq; server jarayoni 52 s muzlatiladi (telefon «uchish rejimi»da yoki Wi-Fi o'chganda shunga o'xshash)\n20:19:56 — server jarayoni muzlatildi (kill -STOP): ulanish uzilmaydi, lekin javob yo'q\n20:20:48 — server davom ettirildi (kill -CONT)\n$ npm run live\n20:19:54 ulanmoqda… http://localhost:3100\n20:19:54 connect · ulangan · transport: websocket\n20:20:39 disconnect: ping timeout · active=true → ulanmoqda\n20:20:48 connect · ulangan · transport: websocket\n\n# 45 s = socket.io (engine.io) standarti: pingInterval 25000 + pingTimeout 20000";
const KOD_OUT_07 = "# live.gateway.ts: client.disconnect(); dan keyingi return; olib tashlandi (dist'da) — tokensiz klient\n$ npm run live -- \"\"\n20:20:57 ulanmoqda… http://localhost:3100\n20:20:57 connect · ulangan · transport: polling\n20:20:57 disconnect: io server disconnect · active=false → ulanmagan\n\n# Server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\n20:20:56 Server 3100-portda ishlayapti\nLOG [Live] panel ulandi: MzXa4MMBOWZg86h7AAAA";
const KOD_OUT_08 = "# ws1-start (= cicd2-done): serverda gateway yo'q — klient (ws1-done dagi live-client.js)\n$ npm run live\n20:21:02 ulanmoqda… http://localhost:3100\n20:21:02 connect_error: xhr poll error · active=true → ulanmoqda\n20:21:03 connect_error: xhr poll error · active=true → ulanmoqda\n20:21:05 connect_error: xhr poll error · active=true → ulanmoqda\n\n$ curl -s http://localhost:3100/admin\n{\"message\":\"Cannot GET /admin\",\"error\":\"Not Found\",\"statusCode\":404}";
const KOD_OUT_09 = "$ npm test -- live\nPASS src/api/live/live.gateway.spec.ts\n  LiveGateway\n    ✓ tokensiz — server ulanishni yopadi, klient qayta urinmaydi\n    ✓ noto'g'ri token — xuddi shunday yopiladi\n    ✓ to'g'ri token — ulanadi va order-changed hodisasini oladi\nPASS src/api/live/admin.controller.spec.ts\n  AdminController\n    ✓ GET /admin/orders tokensiz — 401\n    ✓ GET /admin/orders noto'g'ri token — 401\n    ✓ GET /admin/orders token bilan — 200 va ro'yxat\n    ✓ GET /admin — panel sahifasi (socket.io klienti bilan)\nTest Suites: 2 passed, 2 total\nTests:       7 passed, 7 total\nSnapshots:   0 total\nTime:        1.45 s\nRan all test suites matching live.";
const KOD_OUT_10 = "20:21:13 10a-panel-ulangan — token kiritildi, Kirish bosildi\n  belgi: Ulangan\n  2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:19:24\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 20:19:16\n20:21:15 10b-yangi-buyurtma — bot buyurtma oldi — sahifa yangilanmadi\n  belgi: Ulangan\n  [yangi] 3 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 20:21:15\n  2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:19:24\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 20:19:16\n20:21:17 10c-holat-ozgardi — admin tasdiqladi\n  belgi: Ulangan\n  3 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:21:15\n  2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:19:24\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 20:19:16\n20:21:19 10e-notogri-token — ikkinchi oyna, token «notogri»\n  belgi: Ulanmagan\n  Token noto'g'ri\n20:21:23 10d-server-ochdi — server to'xtatildi\n  belgi: Ulanmoqda…\n  3 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:21:15\n  2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:19:24\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | 20:19:16\n\n# server logi\nLOG [InstanceLoader] LiveModule dependencies initialized\nLOG [Live] panel ulandi: VD6rUcHF4jJ41ZE-AAAA\n20:21:15 — Bobur botda buyurtma beradi (/start → Klaviatura → Buyurtma → telefon)\n20:21:15 bot → 111: 🆕 Yangi buyurtma #3 — Bobur, 120 000 so'm. /orders\n20:21:17 — admin (Jasur) #3 ni tasdiqlaydi\nLOG [Live] panel uzildi: VD6rUcHF4jJ41ZE-AAAA";
const KOD_OUT_11A = "# To'g'ri panel: () => yukla() — hodisadan keyin ro'yxat qayta so'raladi\n$ grep -n \"order-changed\" public/admin.html\n90:    ulanish.on('order-changed', () => yukla());\n\n# brauzer (headless Chrome)\n20:35:41 panel ochildi · belgi: Ulangan\nOLDIN:\n  Hali buyurtma yo'q\n20:35:48 15 s gacha kutildi — ro'yxat O'ZGARDI:\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:35:45\n\n# o'sha paytda terminal klienti (npm run live)\n20:35:37 ulanmoqda… http://localhost:3100\n20:35:37 connect · ulangan · transport: polling\n20:35:37 transport: websocket\n20:35:46 order-changed {\"orderId\":1,\"reason\":\"new\"}\n20:35:48 order-changed {\"orderId\":1,\"reason\":\"status\"}";
const KOD_OUT_11B = "# Buzilgan panel: () => yukla (qavssiz) — funksiya chaqirilmaydi, faqat qaytariladi\n$ grep -n \"order-changed\" public/admin.html\n90:    ulanish.on('order-changed', () => yukla);\n\n# brauzer (headless Chrome)\n20:35:56 panel ochildi · belgi: Ulangan\nOLDIN:\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:35:45\n20:36:14 15 s gacha kutildi — ro'yxat O'ZGARMADI:\n  1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Tasdiqlandi | 20:35:45\n\n# o'sha paytda terminal klienti (npm run live)\n20:35:54 ulanmoqda… http://localhost:3100\n20:35:54 connect · ulangan · transport: websocket\n20:36:02 order-changed {\"orderId\":2,\"reason\":\"new\"}\n20:36:04 order-changed {\"orderId\":2,\"reason\":\"status\"}";
const KOD_OUT_12 = "# ws1-done push → GitHub Actions (main, run 41856397400) — test va smoke (live bilan)\n# https://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41856397400\n\n✓ main CI · 41856397400\nTriggered via push about 1 minute ago\n\nJOBS\n✓ test in 27s (ID 126666088669)\n✓ smoke in 32s (ID 126666387866)\n\nANNOTATIONS\n\n\nsmoke: .github#2\n\nsmoke: .github#1\n\n\nFor more information about a job, try: gh run view --job=<job-id>\nView this run on GitHub: https://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41856397400\n## smoke logi (live)\n  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»\n  ✓ savat restartdan o'tdi → «Savat:»\n  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»\n  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0\n  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1\n— live: jonli panel — tokensiz ulanish, yangi buyurtma va holat o'zgarishi\n  ✓ tokensiz ulanish — server yopdi: io server disconnect\n  ✓ yangi buyurtma → order-changed {\"orderId\":5,\"reason\":\"new\"}\n  ✓ GET /admin/orders 200 — eng yuqorida #5 · Bobur\n  ✓ admin tasdiqladi → order-changed {\"orderId\":5,\"reason\":\"status\"}\nNATIJA: 9/9 ✓";
const KOD_PANEL = [
 {
  "k": "10a",
  "t": "20:21:13",
  "note": "token kiritildi, Kirish bosildi",
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
     "Tasdiqlandi",
     "20:19:24"
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
     "20:19:16"
    ]
   }
  ]
 },
 {
  "k": "10b",
  "t": "20:21:15",
  "note": "bot buyurtma oldi — sahifa yangilanmadi",
  "belgi": "Ulangan",
  "rows": [
   {
    "yangi": true,
    "cells": [
     "3",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Yangi",
     "20:21:15"
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
     "Tasdiqlandi",
     "20:19:24"
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
     "20:19:16"
    ]
   }
  ]
 },
 {
  "k": "10c",
  "t": "20:21:17",
  "note": "admin tasdiqladi",
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
     "Tasdiqlandi",
     "20:21:15"
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
     "Tasdiqlandi",
     "20:19:24"
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
     "20:19:16"
    ]
   }
  ]
 },
 {
  "k": "10e",
  "t": "20:21:19",
  "note": "ikkinchi oyna, token «notogri»",
  "belgi": "Ulanmagan",
  "rows": [
   {
    "msg": "Token noto'g'ri"
   }
  ]
 },
 {
  "k": "10d",
  "t": "20:21:23",
  "note": "server to'xtatildi",
  "belgi": "Ulanmoqda…",
  "rows": [
   {
    "yangi": false,
    "cells": [
     "3",
     "Bobur",
     "+998907654321",
     "Klaviatura × 1",
     "120 000 so'm",
     "Tasdiqlandi",
     "20:21:15"
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
     "Tasdiqlandi",
     "20:19:24"
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
     "20:19:16"
    ]
   }
  ]
 }
];
const KOD_AI_AI1 = {
 "01": "$ npx tsc --noEmit\n[chiqish kodi: 0]\n\n$ npm test\nTests:       35 passed, 35 total",
 "02": "$ npm run smoke   # haqiqiy PostgreSQL 18\n== build ==\n== vaqtinchalik baza: shop_ai1_smoke ==\nTelegram bot ulandi\n  katalogda 6 ta mahsulot\n— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)\n  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»\n  ✓ savat restartdan o'tdi → «Savat:»\n  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»\n— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor\nTelegram bot ulandi\n  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»\n  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0\n  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1\nNATIJA: 5/5 ✓",
 "03": "# Tokensiz: ws://localhost:3100/admin/ws\n20:13:51 ulanmoqda… ws://localhost:3100/admin/ws\n20:13:51 open\n20:13:51 close 4401 bad token\n\n# Noto'g'ri token\n20:13:54 ulanmoqda… ws://localhost:3100/admin/ws?token=notogri\n20:13:54 open\n20:13:54 close 4401 bad token",
 "04": "# To'g'ri token: ws://localhost:3100/admin/ws?token=panel-sir — 2.5 s dan keyin Bobur buyurtma beradi, 2 s dan keyin admin tasdiqlaydi\n20:13:57 ulanmoqda… ws://localhost:3100/admin/ws?token=panel-sir\n20:13:57 open\n20:13:57 xabar snapshot orders: 0 ta\n20:13:59 xabar order/created {\"id\":1,\"customer\":\"Bobur\",\"phone\":\"+998907654321\",\"total\":120000,\"status\":\"NEW\",\"statusText\":\"🆕 Yangi\",\"createdAt\":\"2026-11-04T15:13:59.265Z\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1,\"price\":120000}]}\n20:14:01 xabar order/updated {\"id\":1,\"customer\":\"Bobur\",\"phone\":\"+998907654321\",\"total\":120000,\"status\":\"CONFIRMED\",\"statusText\":\"✅ Tasdiqlangan\",\"createdAt\":\"2026-11-04T15:13:59.265Z\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1,\"price\":120000}]}\n",
 "stat": "17 files changed, 855 insertions(+), 10 deletions(-)"
};
const KOD_AI_AI2 = {
 "01": "$ npx tsc --noEmit\n[chiqish kodi: 0]\n\n$ npm test\nTests:       28 passed, 28 total",
 "02": "$ npm run smoke   # haqiqiy PostgreSQL 18\n== build ==\n== vaqtinchalik baza: shop_ai2_smoke ==\nTelegram bot ulandi\n  katalogda 6 ta mahsulot\n— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)\n  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»\n  ✓ savat restartdan o'tdi → «Savat:»\n  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»\n— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor\nTelegram bot ulandi\n  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»\n  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0\n  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1\nNATIJA: 5/5 ✓",
 "03": "# Tokensiz: ws://localhost:3100/ws/orders\n20:14:23 ulanmoqda… ws://localhost:3100/ws/orders\n20:14:23 open\n20:14:23 close 1008 token\n\n# Noto'g'ri token\n20:14:26 ulanmoqda… ws://localhost:3100/ws/orders?token=notogri\n20:14:26 open\n20:14:26 close 1008 token",
 "04": "# To'g'ri token: ws://localhost:3100/ws/orders?token=panel-sir — 2.5 s dan keyin Bobur buyurtma beradi, 2 s dan keyin admin tasdiqlaydi\n20:14:29 ulanmoqda… ws://localhost:3100/ws/orders?token=panel-sir\n20:14:29 open\n20:14:29 xabar snapshot orders: 0 ta\n20:14:31 xabar created {\"id\":1,\"status\":\"NEW\",\"total\":120000,\"phone\":\"+998907654321\",\"customer\":\"Bobur\",\"createdAt\":\"2026-11-04T15:14:31.271Z\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1,\"price\":120000}]}\n20:14:33 xabar updated {\"id\":1,\"status\":\"CONFIRMED\",\"total\":120000,\"phone\":\"+998907654321\",\"customer\":\"Bobur\",\"createdAt\":\"2026-11-04T15:14:31.271Z\",\"items\":[{\"name\":\"Klaviatura\",\"qty\":1,\"price\":120000}]}\n",
 "stat": "15 files changed, 512 insertions(+), 7 deletions(-)"
};
const KOD_PROMPT1 = "OrderBotNest'ga do'kon admini uchun jonli buyurtmalar paneli kerak: bot yangi buyurtma olganda yoki admin buyurtma holatini o'zgartirganda, brauzerdagi panel sahifani yangilamasdan o'zi yangilansin. WebSocket bilan qilib ber.";
const KOD_PROMPT2 = "Loyiha: OrderBotNest (NestJS + Telegraf + TypeORM), ws1-done tegida jonli panel bor: src/api/live/live.gateway.ts (socket.io, order-changed { orderId, reason }), src/api/live/admin.controller.ts (GET /admin/orders, Bearer token), public/admin.html. Vazifa: 1) panelda CANCELLED holatidagi buyurtma qatori qizil fonli bo'lsin; 2) panel tepasida bugungi buyurtmalar soni chiqsin (GET /admin/orders javobidan hisoblang). Shartlar: socket.io qolsin (xom ws emas); token manzilga yozilmasin (faqat auth va Authorization sarlavhasi); hodisa tarkibi o'zgarmasin ({ orderId, reason }, buyurtma ma'lumoti hodisaga qo'shilmasin); mijoz ismi esc() bilan qolsin; src/api/order/ va src/api/telegram/ ga tegma. Javobda: o'zgargan fayllar ro'yxati va npm test natijasi.";
const KOD = { GATEWAY: KOD_GATEWAY, TOKEN: KOD_TOKEN, CTRL: KOD_CTRL, MODULE: KOD_MODULE, TG: KOD_TG, TGMOD: KOD_TGMOD, HTML: KOD_HTML, CLIENT: KOD_CLIENT, ENV: KOD_ENV, README: KOD_README, MJ_README: KOD_MJ_README, MJ_ULANISH: KOD_MJ_ULANISH, OUT: { '00': KOD_OUT_00, '01': KOD_OUT_01, '02': KOD_OUT_02, '03': KOD_OUT_03, '04': KOD_OUT_04, '05': KOD_OUT_05, '06': KOD_OUT_06, '07': KOD_OUT_07, '08': KOD_OUT_08, '09': KOD_OUT_09, '10': KOD_OUT_10, '11a': KOD_OUT_11A, '11b': KOD_OUT_11B, '12': KOD_OUT_12 }, PANEL: KOD_PANEL, AI: { ai1: KOD_AI_AI1, ai2: KOD_AI_AI2 }, PROMPT1: KOD_PROMPT1, PROMPT2: KOD_PROMPT2 };
