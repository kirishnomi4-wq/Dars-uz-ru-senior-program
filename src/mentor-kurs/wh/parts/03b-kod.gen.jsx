
// AVTO: feedback/F-1029-02-mentor-kurs/dev/wh-kod.py — OrderBotNest wh-start/wh-done, maydon-jamoa m13-dars-03 (manba/wh-out), haqiqiy chiqishlar (qo'lda tahrirlanmaydi)
const KOD_SIG = {
 "file": "src/api/payment/signature.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import { createHmac, timingSafeEqual } from 'crypto';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "// To'lov xizmati har xabarni imzolaydi: X-Signature = HMAC-SHA256(xom tana, PAYMENT_WEBHOOK_SECRET), 64 belgili hex.",
   "n": 3
  },
  {
   "t": "// Biz xuddi shu hisobni qilamiz va solishtiramiz. Kalit faqat bizda va xizmatda — boshqa hech kim to'g'ri imzo yasay olmaydi.",
   "n": 4
  },
  {
   "t": "export function sign(rawBody: Buffer | string, secret: string): string {",
   "n": 5
  },
  {
   "t": "  return createHmac('sha256', secret).update(rawBody).digest('hex');",
   "n": 6
  },
  {
   "t": "}",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "export function isValidSignature(",
   "n": 9
  },
  {
   "t": "  rawBody: Buffer | undefined,",
   "n": 10
  },
  {
   "t": "  header: unknown,",
   "n": 11
  },
  {
   "t": "  secret: string,",
   "n": 12
  },
  {
   "t": "): boolean {",
   "n": 13
  },
  {
   "t": "  // kalit bo'sh bo'lsa hech qanday xabar qabul qilinmaydi (bo'sh kalit bilan imzoni har kim yasaydi)",
   "n": 14
  },
  {
   "t": "  if (!secret || !rawBody || typeof header !== 'string') return false;",
   "n": 15
  },
  {
   "t": "  const expected = Buffer.from(sign(rawBody, secret), 'hex');",
   "n": 16
  },
  {
   "t": "  const got = Buffer.from(header, 'hex');",
   "n": 17
  },
  {
   "t": "  // uzunlik farq qilsa — darhol yo'q; teng bo'lsa timingSafeEqual: javob vaqtidan imzoni taxmin qilib bo'lmaydi",
   "n": 18
  },
  {
   "t": "  return got.length === expected.length && timingSafeEqual(got, expected);",
   "n": 19
  },
  {
   "t": "}",
   "n": 20
  }
 ]
};
const KOD_CTRL = {
 "file": "src/api/payment/payment.controller.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import {",
   "n": 1
  },
  {
   "t": "  Body,",
   "n": 2
  },
  {
   "t": "  Controller,",
   "n": 3
  },
  {
   "t": "  Headers,",
   "n": 4
  },
  {
   "t": "  HttpCode,",
   "n": 5
  },
  {
   "t": "  Logger,",
   "n": 6
  },
  {
   "t": "  Post,",
   "n": 7
  },
  {
   "t": "  Req,",
   "n": 8
  },
  {
   "t": "  UnauthorizedException,",
   "n": 9
  },
  {
   "t": "} from '@nestjs/common';",
   "n": 10
  },
  {
   "t": "import type { RawBodyRequest } from '@nestjs/common';",
   "n": 11
  },
  {
   "t": "import type { Request } from 'express';",
   "n": 12
  },
  {
   "t": "import { config } from '../../config';",
   "n": 13
  },
  {
   "t": "import { parsePayment } from './payment-input';",
   "n": 14
  },
  {
   "t": "import { PaymentService } from './payment.service';",
   "n": 15
  },
  {
   "t": "import { isValidSignature } from './signature';",
   "n": 16
  },
  {
   "t": "",
   "n": 17
  },
  {
   "t": "@Controller('payments')",
   "n": 18
  },
  {
   "t": "export class PaymentController {",
   "n": 19
  },
  {
   "t": "  private readonly log = new Logger('Payment');",
   "n": 20
  },
  {
   "t": "",
   "n": 21
  },
  {
   "t": "  constructor(private readonly payments: PaymentService) {",
   "n": 22
  },
  {
   "t": "    if (!config.PAYMENT_WEBHOOK_SECRET) {",
   "n": 23
  },
  {
   "t": "      this.log.warn(",
   "n": 24
  },
  {
   "t": "        \"PAYMENT_WEBHOOK_SECRET bo'sh — har to'lov xabari 401 bilan rad etiladi (.env)\",",
   "n": 25
  },
  {
   "t": "      );",
   "n": 26
  },
  {
   "t": "    }",
   "n": 27
  },
  {
   "t": "  }",
   "n": 28
  },
  {
   "t": "",
   "n": 29
  },
  {
   "t": "  // To'lov xizmati natijani shu manzilga o'zi yuboradi. Tartib muhim:",
   "n": 30
  },
  {
   "t": "  // 1) imzo (xom tana bilan) → 2) maydonlar → 3) yozuv (takror — bir marta). Imzo yozuvdan OLDIN.",
   "n": 31
  },
  {
   "t": "  @Post('webhook')",
   "n": 32
  },
  {
   "t": "  @HttpCode(200)",
   "n": 33
  },
  {
   "t": "  async webhook(",
   "n": 34
  },
  {
   "t": "    @Req() req: RawBodyRequest<Request>,",
   "n": 35
  },
  {
   "t": "    @Headers('x-signature') signature: string | undefined,",
   "n": 36
  },
  {
   "t": "    @Body() body: unknown,",
   "n": 37
  },
  {
   "t": "  ) {",
   "n": 38
  },
  {
   "t": "    if (",
   "n": 39
  },
  {
   "t": "      !isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)",
   "n": 40
  },
  {
   "t": "    ) {",
   "n": 41
  },
  {
   "t": "      this.log.warn(\"imzo noto'g'ri — xabar rad etildi\");",
   "n": 42
  },
  {
   "t": "      throw new UnauthorizedException(\"imzo noto'g'ri\");",
   "n": 43
  },
  {
   "t": "    }",
   "n": 44
  },
  {
   "t": "    const p = parsePayment(body);",
   "n": 45
  },
  {
   "t": "    const r = await this.payments.record(p);",
   "n": 46
  },
  {
   "t": "    this.log.log(",
   "n": 47
  },
  {
   "t": "      `${p.paymentId} · #${p.orderId} · ${p.status} · ${p.amount}${r.duplicate ? ' — takror, yozilmadi' : ''}`,",
   "n": 48
  },
  {
   "t": "    );",
   "n": 49
  },
  {
   "t": "    return { ok: true, duplicate: r.duplicate };",
   "n": 50
  },
  {
   "t": "  }",
   "n": 51
  },
  {
   "t": "}",
   "n": 52
  }
 ]
};
const KOD_SVC = {
 "file": "src/api/payment/payment.service.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import { BadRequestException, Injectable } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 2
  },
  {
   "t": "import { Order } from '../../core/entity';",
   "n": 3
  },
  {
   "t": "import { LiveGateway } from '../live/live.gateway';",
   "n": 4
  },
  {
   "t": "import type { PaymentInput } from './payment-input';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "@Injectable()",
   "n": 7
  },
  {
   "t": "export class PaymentService {",
   "n": 8
  },
  {
   "t": "  constructor(",
   "n": 9
  },
  {
   "t": "    private readonly ds: DataSource,",
   "n": 10
  },
  {
   "t": "    private readonly live: LiveGateway,",
   "n": 11
  },
  {
   "t": "  ) {}",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "  // Bitta tranzaksiya: payments ga qator va orders.payment_status.",
   "n": 14
  },
  {
   "t": "  // payment_id noyob: takror xabar (xizmat javobimizni olmay qayta yuborgan) — ON CONFLICT, hech narsa o'zgarmaydi.",
   "n": 15
  },
  {
   "t": "  // Rad etilgan to'lov ham yoziladi — lekin oldin to'langan buyurtmani «rad» ga tushirmaydi.",
   "n": 16
  },
  {
   "t": "  async record(p: PaymentInput): Promise<{ duplicate: boolean }> {",
   "n": 17
  },
  {
   "t": "    const res = await this.ds.transaction(async (m) => {",
   "n": 18
  },
  {
   "t": "      const order = await m.findOneBy(Order, { id: p.orderId });",
   "n": 19
  },
  {
   "t": "      if (!order) {",
   "n": 20
  },
  {
   "t": "        throw new BadRequestException(`buyurtma topilmadi: #${p.orderId}`);",
   "n": 21
  },
  {
   "t": "      }",
   "n": 22
  },
  {
   "t": "      if (p.amount !== order.total) {",
   "n": 23
  },
  {
   "t": "        throw new BadRequestException(",
   "n": 24
  },
  {
   "t": "          `summa mos emas: ${p.amount} \u2260 ${order.total}`,",
   "n": 25
  },
  {
   "t": "        );",
   "n": 26
  },
  {
   "t": "      }",
   "n": 27
  },
  {
   "t": "      const rows: unknown[] = await m.query(",
   "n": 28
  },
  {
   "t": "        `INSERT INTO payments (payment_id, order_id, status, amount)",
   "n": 29
  },
  {
   "t": "         VALUES ($1, $2, $3, $4)",
   "n": 30
  },
  {
   "t": "         ON CONFLICT (payment_id) DO NOTHING",
   "n": 31
  },
  {
   "t": "         RETURNING id`,",
   "n": 32
  },
  {
   "t": "        [p.paymentId, p.orderId, p.status, p.amount],",
   "n": 33
  },
  {
   "t": "      );",
   "n": 34
  },
  {
   "t": "      if (rows.length === 0) return { duplicate: true };",
   "n": 35
  },
  {
   "t": "      await m.query(",
   "n": 36
  },
  {
   "t": "        `UPDATE orders SET payment_status = $1",
   "n": 37
  },
  {
   "t": "         WHERE id = $2 AND payment_status IS DISTINCT FROM 'paid'`,",
   "n": 38
  },
  {
   "t": "        [p.status, p.orderId],",
   "n": 39
  },
  {
   "t": "      );",
   "n": 40
  },
  {
   "t": "      return { duplicate: false };",
   "n": 41
  },
  {
   "t": "    });",
   "n": 42
  },
  {
   "t": "    // tranzaksiya tugadi — panel so'raganda to'lov bazada bor (WebSocket-1 qoidasi)",
   "n": 43
  },
  {
   "t": "    if (!res.duplicate) this.live.orderChanged(p.orderId, 'payment');",
   "n": 44
  },
  {
   "t": "    return res;",
   "n": 45
  },
  {
   "t": "  }",
   "n": 46
  },
  {
   "t": "}",
   "n": 47
  }
 ]
};
const KOD_INPUT = {
 "file": "src/api/payment/payment-input.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import { BadRequestException } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import type { PaymentStatus } from '../../core/entity';",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "export type PaymentInput = {",
   "n": 4
  },
  {
   "t": "  paymentId: string;",
   "n": 5
  },
  {
   "t": "  orderId: number;",
   "n": 6
  },
  {
   "t": "  status: PaymentStatus;",
   "n": 7
  },
  {
   "t": "  amount: number;",
   "n": 8
  },
  {
   "t": "};",
   "n": 9
  },
  {
   "t": "",
   "n": 10
  },
  {
   "t": "// Imzo to'g'ri bo'lgandan keyin — maydonlar. Xato bo'lsa 400 va hech narsa yozilmaydi",
   "n": 11
  },
  {
   "t": "export function parsePayment(body: unknown): PaymentInput {",
   "n": 12
  },
  {
   "t": "  const b = (body ?? {}) as Record<string, unknown>;",
   "n": 13
  },
  {
   "t": "  if (typeof b.paymentId !== 'string' || !b.paymentId) {",
   "n": 14
  },
  {
   "t": "    throw new BadRequestException(\"paymentId yo'q\");",
   "n": 15
  },
  {
   "t": "  }",
   "n": 16
  },
  {
   "t": "  if (!Number.isInteger(b.orderId)) {",
   "n": 17
  },
  {
   "t": "    throw new BadRequestException(\"orderId butun son bo'lishi kerak\");",
   "n": 18
  },
  {
   "t": "  }",
   "n": 19
  },
  {
   "t": "  if (b.status !== 'paid' && b.status !== 'failed') {",
   "n": 20
  },
  {
   "t": "    throw new BadRequestException(\"status: 'paid' yoki 'failed'\");",
   "n": 21
  },
  {
   "t": "  }",
   "n": 22
  },
  {
   "t": "  if (!Number.isInteger(b.amount) || (b.amount as number) <= 0) {",
   "n": 23
  },
  {
   "t": "    throw new BadRequestException(\"amount musbat butun son bo'lishi kerak\");",
   "n": 24
  },
  {
   "t": "  }",
   "n": 25
  },
  {
   "t": "  return {",
   "n": 26
  },
  {
   "t": "    paymentId: b.paymentId,",
   "n": 27
  },
  {
   "t": "    orderId: b.orderId as number,",
   "n": 28
  },
  {
   "t": "    status: b.status,",
   "n": 29
  },
  {
   "t": "    amount: b.amount as number,",
   "n": 30
  },
  {
   "t": "  };",
   "n": 31
  },
  {
   "t": "}",
   "n": 32
  }
 ]
};
const KOD_MAIN = {
 "file": "src/main.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import { NestFactory } from '@nestjs/core';",
   "n": 1
  },
  {
   "t": "import { AppModule } from './api/app.module';",
   "n": 2
  },
  {
   "t": "import { config } from './config';",
   "n": 3
  },
  {
   "t": "",
   "n": 4
  },
  {
   "t": "async function main() {",
   "n": 5
  },
  {
   "t": "  // rawBody: to'lov webhook'i imzosi xom baytlardan hisoblanadi — JSON qayta yozilsa imzo mos kelmaydi",
   "n": 6
  },
  {
   "t": "  const app = await NestFactory.create(AppModule, { rawBody: true });",
   "n": 7
  },
  {
   "t": "  await app.listen(config.PORT);",
   "n": 8
  },
  {
   "t": "  console.log(`Server ${config.PORT}-portda ishlayapti`);",
   "n": 9
  },
  {
   "t": "}",
   "n": 10
  },
  {
   "t": "",
   "n": 11
  },
  {
   "t": "void main();",
   "n": 12
  }
 ]
};
const KOD_PAY = {
 "file": "scripts/pay.js",
 "tag": "wh-done",
 "lines": [
  {
   "t": "// npm run pay -- <buyurtma raqami> [ok | rad | ikki | imzosiz | soxta]",
   "n": 1
  },
  {
   "t": "// Soxta to'lov xizmati: haqiqiy xizmat qiladigan ishni qiladi — to'lov natijasini imzolab POST /payments/webhook ga yuboradi.",
   "n": 2
  },
  {
   "t": "// Summa buyurtmaning o'zidan olinadi (GET /admin/orders, ADMIN_PANEL_TOKEN bilan). Kalit — .env dagi PAYMENT_WEBHOOK_SECRET.",
   "n": 3
  },
  {
   "t": "//   ok      — to'landi (paid)",
   "n": 4
  },
  {
   "t": "//   rad     — rad etildi (failed)",
   "n": 5
  },
  {
   "t": "//   ikki    — bitta xabar ikki marta (javob yo'qolgandagi kabi) — ikkinchisi takror",
   "n": 6
  },
  {
   "t": "//   imzosiz — X-Signature sarlavhasisiz",
   "n": 7
  },
  {
   "t": "//   soxta   — boshqa kalit bilan imzolangan (kalitni bilmagan odam)",
   "n": 8
  },
  {
   "t": "const path = require('path');",
   "n": 9
  },
  {
   "t": "const { createHmac, randomBytes } = require('crypto');",
   "n": 10
  },
  {
   "t": "require('dotenv').config({",
   "n": 11
  },
  {
   "t": "  path: path.join(__dirname, '..', '.env'),",
   "n": 12
  },
  {
   "t": "  quiet: true,",
   "n": 13
  },
  {
   "t": "});",
   "n": 14
  },
  {
   "t": "",
   "n": 15
  },
  {
   "t": "const url =",
   "n": 16
  },
  {
   "t": "  process.env.PAY_URL || `http://localhost:${process.env.PORT || 3000}`;",
   "n": 17
  },
  {
   "t": "const [id, mode = 'ok'] = process.argv.slice(2);",
   "n": 18
  },
  {
   "t": "const secret = process.env.PAYMENT_WEBHOOK_SECRET || '';",
   "n": 19
  },
  {
   "t": "const MODES = ['ok', 'rad', 'ikki', 'imzosiz', 'soxta'];",
   "n": 20
  },
  {
   "t": "if (!Number.isInteger(Number(id)) || !MODES.includes(mode)) {",
   "n": 21
  },
  {
   "t": "  console.log(",
   "n": 22
  },
  {
   "t": "    `ishlatish: npm run pay -- <buyurtma raqami> [${MODES.join(' | ')}]`,",
   "n": 23
  },
  {
   "t": "  );",
   "n": 24
  },
  {
   "t": "  process.exit(1);",
   "n": 25
  },
  {
   "t": "}",
   "n": 26
  },
  {
   "t": "const sign = (body, key) =>",
   "n": 27
  },
  {
   "t": "  createHmac('sha256', key).update(body).digest('hex');",
   "n": 28
  },
  {
   "t": "",
   "n": 29
  },
  {
   "t": "async function send(body, signature) {",
   "n": 30
  },
  {
   "t": "  const headers = { 'Content-Type': 'application/json' };",
   "n": 31
  },
  {
   "t": "  if (signature) headers['X-Signature'] = signature;",
   "n": 32
  },
  {
   "t": "  const r = await fetch(`${url}/payments/webhook`, {",
   "n": 33
  },
  {
   "t": "    method: 'POST',",
   "n": 34
  },
  {
   "t": "    headers,",
   "n": 35
  },
  {
   "t": "    body,",
   "n": 36
  },
  {
   "t": "  });",
   "n": 37
  },
  {
   "t": "  console.log(`← ${r.status} ${await r.text()}`);",
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
   "t": "(async () => {",
   "n": 41
  },
  {
   "t": "  const r = await fetch(`${url}/admin/orders`, {",
   "n": 42
  },
  {
   "t": "    headers: { Authorization: `Bearer ${process.env.ADMIN_PANEL_TOKEN}` },",
   "n": 43
  },
  {
   "t": "  });",
   "n": 44
  },
  {
   "t": "  if (!r.ok) {",
   "n": 45
  },
  {
   "t": "    console.log(",
   "n": 46
  },
  {
   "t": "      `GET /admin/orders → ${r.status} (.env dagi ADMIN_PANEL_TOKEN?)`,",
   "n": 47
  },
  {
   "t": "    );",
   "n": 48
  },
  {
   "t": "    process.exit(1);",
   "n": 49
  },
  {
   "t": "  }",
   "n": 50
  },
  {
   "t": "  const order = (await r.json()).find((o) => o.id === Number(id));",
   "n": 51
  },
  {
   "t": "  if (!order) {",
   "n": 52
  },
  {
   "t": "    console.log(`#${id} oxirgi 20 buyurtma ichida yo'q`);",
   "n": 53
  },
  {
   "t": "    process.exit(1);",
   "n": 54
  },
  {
   "t": "  }",
   "n": 55
  },
  {
   "t": "  const body = JSON.stringify({",
   "n": 56
  },
  {
   "t": "    paymentId: `pay_${randomBytes(4).toString('hex')}`,",
   "n": 57
  },
  {
   "t": "    orderId: order.id,",
   "n": 58
  },
  {
   "t": "    status: mode === 'rad' ? 'failed' : 'paid',",
   "n": 59
  },
  {
   "t": "    amount: order.total,",
   "n": 60
  },
  {
   "t": "  });",
   "n": 61
  },
  {
   "t": "  const signature =",
   "n": 62
  },
  {
   "t": "    mode === 'imzosiz'",
   "n": 63
  },
  {
   "t": "      ? ''",
   "n": 64
  },
  {
   "t": "      : sign(body, mode === 'soxta' ? 'boshqa-kalit' : secret);",
   "n": 65
  },
  {
   "t": "  console.log(`→ POST /payments/webhook ${body}`);",
   "n": 66
  },
  {
   "t": "  console.log(",
   "n": 67
  },
  {
   "t": "    `  X-Signature: ${signature ? signature.slice(0, 16) + '…' : \"(yo'q)\"}`,",
   "n": 68
  },
  {
   "t": "  );",
   "n": 69
  },
  {
   "t": "  await send(body, signature);",
   "n": 70
  },
  {
   "t": "  if (mode === 'ikki') {",
   "n": 71
  },
  {
   "t": "    console.log(",
   "n": 72
  },
  {
   "t": "      '→ xuddi shu xabar yana (xizmat javobni olmagan deb qayta yubordi)',",
   "n": 73
  },
  {
   "t": "    );",
   "n": 74
  },
  {
   "t": "    await send(body, signature);",
   "n": 75
  },
  {
   "t": "  }",
   "n": 76
  },
  {
   "t": "})().catch((e) => {",
   "n": 77
  },
  {
   "t": "  console.log(`xato: ${e.message} — server ishlayaptimi? (${url})`);",
   "n": 78
  },
  {
   "t": "  process.exit(1);",
   "n": 79
  },
  {
   "t": "});",
   "n": 80
  }
 ]
};
const KOD_ENV = {
 "file": ".env.example",
 "tag": "wh-done",
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
   "t": "# To'lov xizmati bilan umumiy maxfiy kalit: webhook imzosi (X-Signature) shu bilan tekshiriladi.",
   "n": 13
  },
  {
   "t": "# Bo'sh qolsa har to'lov xabari 401 bilan rad etiladi. Lokal sinov: npm run pay -- <buyurtma raqami>",
   "n": 14
  },
  {
   "t": "PAYMENT_WEBHOOK_SECRET=",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "# PostgreSQL (lokal: PG-1 darsida o'rnatilgan). Baza oldindan yaratilgan bo'lsin: CREATE DATABASE shop;",
   "n": 17
  },
  {
   "t": "DATABASE_URL=postgresql://postgres:parol@localhost:5432/shop",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "# true — TypeORM har SQL so'rovni terminalga yozadi (o'rganish uchun qulay)",
   "n": 20
  },
  {
   "t": "DB_LOGGING=true",
   "n": 21
  },
  {
   "t": "",
   "n": 22
  },
  {
   "t": "# Server porti (hosting o'zi beradi, lokalda tegmaysiz)",
   "n": 23
  },
  {
   "t": "PORT=3000",
   "n": 24
  }
 ]
};
const KOD_CONFIG = {
 "file": "src/config/index.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import * as dotenv from 'dotenv';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "dotenv.config({ quiet: true });",
   "n": 3
  },
  {
   "t": "",
   "n": 4
  },
  {
   "t": "export const config = {",
   "n": 5
  },
  {
   "t": "  PORT: Number(process.env.PORT) || 3000,",
   "n": 6
  },
  {
   "t": "  DATABASE_URL: String(process.env.DATABASE_URL || ''),",
   "n": 7
  },
  {
   "t": "  // true bo'lsa TypeORM har SQL so'rovni terminalga yozadi — o'rganish uchun",
   "n": 8
  },
  {
   "t": "  DB_LOGGING: process.env.DB_LOGGING === 'true',",
   "n": 9
  },
  {
   "t": "  BOT_TOKEN: String(process.env.BOT_TOKEN || ''),",
   "n": 10
  },
  {
   "t": "  // jonli panel (/admin) va WebSocket ulanishi uchun maxfiy so'z — o'zingiz o'ylab topasiz",
   "n": 11
  },
  {
   "t": "  ADMIN_PANEL_TOKEN: String(process.env.ADMIN_PANEL_TOKEN || ''),",
   "n": 12
  },
  {
   "t": "  // to'lov xizmati bilan umumiy maxfiy kalit: webhook imzosi shu bilan tekshiriladi (faqat .env da, kodga yozilmaydi)",
   "n": 13
  },
  {
   "t": "  PAYMENT_WEBHOOK_SECRET: String(process.env.PAYMENT_WEBHOOK_SECRET || ''),",
   "n": 14
  },
  {
   "t": "  // \"123,456\" → [123, 456]",
   "n": 15
  },
  {
   "t": "  ADMIN_TELEGRAM_IDS: String(process.env.ADMIN_TELEGRAM_IDS || '')",
   "n": 16
  },
  {
   "t": "    .split(',')",
   "n": 17
  },
  {
   "t": "    .map((s) => s.trim())",
   "n": 18
  },
  {
   "t": "    .filter(Boolean)",
   "n": 19
  },
  {
   "t": "    .map(Number),",
   "n": 20
  },
  {
   "t": "};",
   "n": 21
  }
 ]
};
const KOD_MIG = {
 "file": "src/infrastructure/migrations/1762300000000-payments.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import { MigrationInterface, QueryRunner } from 'typeorm';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "// To'lov xabarlari: har xabar — bitta qator. payment_id NOYOB — xizmat bitta xabarni ikki marta yuborsa,",
   "n": 3
  },
  {
   "t": "// ikkinchisi yozilmaydi (takror). orders.payment_status — panelda ko'rinadigan oxirgi holat.",
   "n": 4
  },
  {
   "t": "export class Payments1762300000000 implements MigrationInterface {",
   "n": 5
  },
  {
   "t": "  name = 'Payments1762300000000';",
   "n": 6
  },
  {
   "t": "",
   "n": 7
  },
  {
   "t": "  public async up(q: QueryRunner): Promise<void> {",
   "n": 8
  },
  {
   "t": "    await q.query(`CREATE TABLE \"payments\" (",
   "n": 9
  },
  {
   "t": "      \"id\" SERIAL PRIMARY KEY,",
   "n": 10
  },
  {
   "t": "      \"payment_id\" VARCHAR NOT NULL UNIQUE,",
   "n": 11
  },
  {
   "t": "      \"order_id\" INTEGER NOT NULL REFERENCES \"orders\"(\"id\"),",
   "n": 12
  },
  {
   "t": "      \"status\" VARCHAR NOT NULL CHECK (\"status\" IN ('paid', 'failed')),",
   "n": 13
  },
  {
   "t": "      \"amount\" INTEGER NOT NULL,",
   "n": 14
  },
  {
   "t": "      \"created_at\" TIMESTAMP NOT NULL DEFAULT now()",
   "n": 15
  },
  {
   "t": "    )`);",
   "n": 16
  },
  {
   "t": "    await q.query(`ALTER TABLE \"orders\" ADD COLUMN \"payment_status\" VARCHAR`);",
   "n": 17
  },
  {
   "t": "  }",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "  public async down(q: QueryRunner): Promise<void> {",
   "n": 20
  },
  {
   "t": "    await q.query(`ALTER TABLE \"orders\" DROP COLUMN \"payment_status\"`);",
   "n": 21
  },
  {
   "t": "    await q.query(`DROP TABLE \"payments\"`);",
   "n": 22
  },
  {
   "t": "  }",
   "n": 23
  },
  {
   "t": "}",
   "n": 24
  }
 ]
};
const KOD_CSPEC = {
 "file": "src/api/payment/payment.controller.spec.ts",
 "tag": "wh-done",
 "lines": [
  {
   "t": "import { INestApplication } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 2
  },
  {
   "t": "import request from 'supertest';",
   "n": 3
  },
  {
   "t": "import { config } from '../../config';",
   "n": 4
  },
  {
   "t": "import { PaymentController } from './payment.controller';",
   "n": 5
  },
  {
   "t": "import { PaymentService } from './payment.service';",
   "n": 6
  },
  {
   "t": "import { sign } from './signature';",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "// Baza o'rniga mock servis. App rawBody: true bilan — main.ts dagi kabi",
   "n": 9
  },
  {
   "t": "const KEY = 'sinov-kalit';",
   "n": 10
  },
  {
   "t": "const record = jest.fn(async () => ({ duplicate: false }));",
   "n": 11
  },
  {
   "t": "const body = JSON.stringify({",
   "n": 12
  },
  {
   "t": "  paymentId: 'pay_1',",
   "n": 13
  },
  {
   "t": "  orderId: 5,",
   "n": 14
  },
  {
   "t": "  status: 'paid',",
   "n": 15
  },
  {
   "t": "  amount: 120000,",
   "n": 16
  },
  {
   "t": "});",
   "n": 17
  },
  {
   "t": "",
   "n": 18
  },
  {
   "t": "describe('PaymentController — POST /payments/webhook', () => {",
   "n": 19
  },
  {
   "t": "  let app: INestApplication;",
   "n": 20
  },
  {
   "t": "  const post = (b: string, sig?: string) => {",
   "n": 21
  },
  {
   "t": "    const r = request(app.getHttpServer())",
   "n": 22
  },
  {
   "t": "      .post('/payments/webhook')",
   "n": 23
  },
  {
   "t": "      .set('Content-Type', 'application/json');",
   "n": 24
  },
  {
   "t": "    return (sig ? r.set('X-Signature', sig) : r).send(b);",
   "n": 25
  },
  {
   "t": "  };",
   "n": 26
  },
  {
   "t": "",
   "n": 27
  },
  {
   "t": "  beforeAll(async () => {",
   "n": 28
  },
  {
   "t": "    config.PAYMENT_WEBHOOK_SECRET = KEY;",
   "n": 29
  },
  {
   "t": "    const mod = await Test.createTestingModule({",
   "n": 30
  },
  {
   "t": "      controllers: [PaymentController],",
   "n": 31
  },
  {
   "t": "      providers: [{ provide: PaymentService, useValue: { record } }],",
   "n": 32
  },
  {
   "t": "    }).compile();",
   "n": 33
  },
  {
   "t": "    app = mod.createNestApplication({ rawBody: true, logger: false });",
   "n": 34
  },
  {
   "t": "    await app.init();",
   "n": 35
  },
  {
   "t": "  });",
   "n": 36
  },
  {
   "t": "",
   "n": 37
  },
  {
   "t": "  beforeEach(() => record.mockClear());",
   "n": 38
  },
  {
   "t": "  afterAll(() => app.close());",
   "n": 39
  },
  {
   "t": "",
   "n": 40
  },
  {
   "t": "  it('imzosiz — 401, yozuvga yetmaydi', async () => {",
   "n": 41
  },
  {
   "t": "    const res = await post(body);",
   "n": 42
  },
  {
   "t": "    expect(res.status).toBe(401);",
   "n": 43
  },
  {
   "t": "    expect(record).not.toHaveBeenCalled();",
   "n": 44
  },
  {
   "t": "  });",
   "n": 45
  },
  {
   "t": "",
   "n": 46
  },
  {
   "t": "  it('boshqa kalit bilan — 401', async () => {",
   "n": 47
  },
  {
   "t": "    const res = await post(body, sign(body, 'boshqa-kalit'));",
   "n": 48
  },
  {
   "t": "    expect(res.status).toBe(401);",
   "n": 49
  },
  {
   "t": "    expect(record).not.toHaveBeenCalled();",
   "n": 50
  },
  {
   "t": "  });",
   "n": 51
  },
  {
   "t": "",
   "n": 52
  },
  {
   "t": "  it(\"imzodan keyin tana o'zgargan — 401\", async () => {",
   "n": 53
  },
  {
   "t": "    const res = await post(body.replace('120000', '1200'), sign(body, KEY));",
   "n": 54
  },
  {
   "t": "    expect(res.status).toBe(401);",
   "n": 55
  },
  {
   "t": "    expect(record).not.toHaveBeenCalled();",
   "n": 56
  },
  {
   "t": "  });",
   "n": 57
  },
  {
   "t": "",
   "n": 58
  },
  {
   "t": "  it(\"to'g'ri imzo — 200, servisga aynan shu to'lov\", async () => {",
   "n": 59
  },
  {
   "t": "    const res = await post(body, sign(body, KEY));",
   "n": 60
  },
  {
   "t": "    expect(res.status).toBe(200);",
   "n": 61
  },
  {
   "t": "    expect(res.body).toEqual({ ok: true, duplicate: false });",
   "n": 62
  },
  {
   "t": "    expect(record).toHaveBeenCalledWith({",
   "n": 63
  },
  {
   "t": "      paymentId: 'pay_1',",
   "n": 64
  },
  {
   "t": "      orderId: 5,",
   "n": 65
  },
  {
   "t": "      status: 'paid',",
   "n": 66
  },
  {
   "t": "      amount: 120000,",
   "n": 67
  },
  {
   "t": "    });",
   "n": 68
  },
  {
   "t": "  });",
   "n": 69
  },
  {
   "t": "",
   "n": 70
  },
  {
   "t": "  it(\"imzo to'g'ri, maydon xato — 400, yozilmaydi\", async () => {",
   "n": 71
  },
  {
   "t": "    const bad = JSON.stringify({",
   "n": 72
  },
  {
   "t": "      paymentId: 'pay_2',",
   "n": 73
  },
  {
   "t": "      orderId: 5,",
   "n": 74
  },
  {
   "t": "      status: 'ok',",
   "n": 75
  },
  {
   "t": "      amount: 120000,",
   "n": 76
  },
  {
   "t": "    });",
   "n": 77
  },
  {
   "t": "    const res = await post(bad, sign(bad, KEY));",
   "n": 78
  },
  {
   "t": "    expect(res.status).toBe(400);",
   "n": 79
  },
  {
   "t": "    expect(record).not.toHaveBeenCalled();",
   "n": 80
  },
  {
   "t": "  });",
   "n": 81
  },
  {
   "t": "",
   "n": 82
  },
  {
   "t": "  it(\"kalit bo'sh — to'g'ri ko'rinadigan imzo ham 401\", async () => {",
   "n": 83
  },
  {
   "t": "    config.PAYMENT_WEBHOOK_SECRET = '';",
   "n": 84
  },
  {
   "t": "    const res = await post(body, sign(body, ''));",
   "n": 85
  },
  {
   "t": "    config.PAYMENT_WEBHOOK_SECRET = KEY;",
   "n": 86
  },
  {
   "t": "    expect(res.status).toBe(401);",
   "n": 87
  },
  {
   "t": "  });",
   "n": 88
  },
  {
   "t": "});",
   "n": 89
  }
 ]
};
const KOD_CTRL_TARTIB = {
 "file": "src/api/payment/payment.controller.ts",
 "tag": "tartib nusxa",
 "lines": [
  {
   "t": "import {",
   "n": 1
  },
  {
   "t": "  Body,",
   "n": 2
  },
  {
   "t": "  Controller,",
   "n": 3
  },
  {
   "t": "  Headers,",
   "n": 4
  },
  {
   "t": "  HttpCode,",
   "n": 5
  },
  {
   "t": "  Logger,",
   "n": 6
  },
  {
   "t": "  Post,",
   "n": 7
  },
  {
   "t": "  Req,",
   "n": 8
  },
  {
   "t": "  UnauthorizedException,",
   "n": 9
  },
  {
   "t": "} from '@nestjs/common';",
   "n": 10
  },
  {
   "t": "import type { RawBodyRequest } from '@nestjs/common';",
   "n": 11
  },
  {
   "t": "import type { Request } from 'express';",
   "n": 12
  },
  {
   "t": "import { config } from '../../config';",
   "n": 13
  },
  {
   "t": "import { parsePayment } from './payment-input';",
   "n": 14
  },
  {
   "t": "import { PaymentService } from './payment.service';",
   "n": 15
  },
  {
   "t": "import { isValidSignature } from './signature';",
   "n": 16
  },
  {
   "t": "",
   "n": 17
  },
  {
   "t": "@Controller('payments')",
   "n": 18
  },
  {
   "t": "export class PaymentController {",
   "n": 19
  },
  {
   "t": "  private readonly log = new Logger('Payment');",
   "n": 20
  },
  {
   "t": "",
   "n": 21
  },
  {
   "t": "  constructor(private readonly payments: PaymentService) {",
   "n": 22
  },
  {
   "t": "    if (!config.PAYMENT_WEBHOOK_SECRET) {",
   "n": 23
  },
  {
   "t": "      this.log.warn(",
   "n": 24
  },
  {
   "t": "        \"PAYMENT_WEBHOOK_SECRET bo'sh — har to'lov xabari 401 bilan rad etiladi (.env)\",",
   "n": 25
  },
  {
   "t": "      );",
   "n": 26
  },
  {
   "t": "    }",
   "n": 27
  },
  {
   "t": "  }",
   "n": 28
  },
  {
   "t": "",
   "n": 29
  },
  {
   "t": "  // To'lov xizmati natijani shu manzilga o'zi yuboradi. Tartib muhim:",
   "n": 30
  },
  {
   "t": "  // 1) imzo (xom tana bilan) → 2) maydonlar → 3) yozuv (takror — bir marta). Imzo yozuvdan OLDIN.",
   "n": 31
  },
  {
   "t": "  @Post('webhook')",
   "n": 32
  },
  {
   "t": "  @HttpCode(200)",
   "n": 33
  },
  {
   "t": "  async webhook(",
   "n": 34
  },
  {
   "t": "    @Req() req: RawBodyRequest<Request>,",
   "n": 35
  },
  {
   "t": "    @Headers('x-signature') signature: string | undefined,",
   "n": 36
  },
  {
   "t": "    @Body() body: unknown,",
   "n": 37
  },
  {
   "t": "  ) {",
   "n": 38
  },
  {
   "t": "    const p = parsePayment(body);",
   "n": 39
  },
  {
   "t": "    const r = await this.payments.record(p);",
   "n": 40
  },
  {
   "t": "    if (",
   "n": 41
  },
  {
   "t": "      !isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)",
   "n": 42
  },
  {
   "t": "    ) {",
   "n": 43
  },
  {
   "t": "      this.log.warn(\"imzo noto'g'ri — xabar rad etildi\");",
   "n": 44
  },
  {
   "t": "      throw new UnauthorizedException(\"imzo noto'g'ri\");",
   "n": 45
  },
  {
   "t": "    }",
   "n": 46
  },
  {
   "t": "    this.log.log(",
   "n": 47
  },
  {
   "t": "      `${p.paymentId} · #${p.orderId} · ${p.status} · ${p.amount}${r.duplicate ? ' — takror, yozilmadi' : ''}`,",
   "n": 48
  },
  {
   "t": "    );",
   "n": 49
  },
  {
   "t": "    return { ok: true, duplicate: r.duplicate };",
   "n": 50
  },
  {
   "t": "  }",
   "n": 51
  },
  {
   "t": "}",
   "n": 52
  }
 ]
};
const KOD_CTRL_JSON = {
 "file": "src/api/payment/payment.controller.ts",
 "tag": "json nusxa",
 "lines": [
  {
   "t": "import {",
   "n": 1
  },
  {
   "t": "  Body,",
   "n": 2
  },
  {
   "t": "  Controller,",
   "n": 3
  },
  {
   "t": "  Headers,",
   "n": 4
  },
  {
   "t": "  HttpCode,",
   "n": 5
  },
  {
   "t": "  Logger,",
   "n": 6
  },
  {
   "t": "  Post,",
   "n": 7
  },
  {
   "t": "  Req,",
   "n": 8
  },
  {
   "t": "  UnauthorizedException,",
   "n": 9
  },
  {
   "t": "} from '@nestjs/common';",
   "n": 10
  },
  {
   "t": "import type { RawBodyRequest } from '@nestjs/common';",
   "n": 11
  },
  {
   "t": "import type { Request } from 'express';",
   "n": 12
  },
  {
   "t": "import { config } from '../../config';",
   "n": 13
  },
  {
   "t": "import { parsePayment } from './payment-input';",
   "n": 14
  },
  {
   "t": "import { PaymentService } from './payment.service';",
   "n": 15
  },
  {
   "t": "import { isValidSignature } from './signature';",
   "n": 16
  },
  {
   "t": "",
   "n": 17
  },
  {
   "t": "@Controller('payments')",
   "n": 18
  },
  {
   "t": "export class PaymentController {",
   "n": 19
  },
  {
   "t": "  private readonly log = new Logger('Payment');",
   "n": 20
  },
  {
   "t": "",
   "n": 21
  },
  {
   "t": "  constructor(private readonly payments: PaymentService) {",
   "n": 22
  },
  {
   "t": "    if (!config.PAYMENT_WEBHOOK_SECRET) {",
   "n": 23
  },
  {
   "t": "      this.log.warn(",
   "n": 24
  },
  {
   "t": "        \"PAYMENT_WEBHOOK_SECRET bo'sh — har to'lov xabari 401 bilan rad etiladi (.env)\",",
   "n": 25
  },
  {
   "t": "      );",
   "n": 26
  },
  {
   "t": "    }",
   "n": 27
  },
  {
   "t": "  }",
   "n": 28
  },
  {
   "t": "",
   "n": 29
  },
  {
   "t": "  // To'lov xizmati natijani shu manzilga o'zi yuboradi. Tartib muhim:",
   "n": 30
  },
  {
   "t": "  // 1) imzo (xom tana bilan) → 2) maydonlar → 3) yozuv (takror — bir marta). Imzo yozuvdan OLDIN.",
   "n": 31
  },
  {
   "t": "  @Post('webhook')",
   "n": 32
  },
  {
   "t": "  @HttpCode(200)",
   "n": 33
  },
  {
   "t": "  async webhook(",
   "n": 34
  },
  {
   "t": "    @Req() req: RawBodyRequest<Request>,",
   "n": 35
  },
  {
   "t": "    @Headers('x-signature') signature: string | undefined,",
   "n": 36
  },
  {
   "t": "    @Body() body: unknown,",
   "n": 37
  },
  {
   "t": "  ) {",
   "n": 38
  },
  {
   "t": "    if (",
   "n": 39
  },
  {
   "t": "      !isValidSignature(",
   "n": 40
  },
  {
   "t": "        Buffer.from(JSON.stringify(body)),",
   "n": 41
  },
  {
   "t": "        signature,",
   "n": 42
  },
  {
   "t": "        config.PAYMENT_WEBHOOK_SECRET,",
   "n": 43
  },
  {
   "t": "      )",
   "n": 44
  },
  {
   "t": "    ) {",
   "n": 45
  },
  {
   "t": "      this.log.warn(\"imzo noto'g'ri — xabar rad etildi\");",
   "n": 46
  },
  {
   "t": "      throw new UnauthorizedException(\"imzo noto'g'ri\");",
   "n": 47
  },
  {
   "t": "    }",
   "n": 48
  },
  {
   "t": "    const p = parsePayment(body);",
   "n": 49
  },
  {
   "t": "    const r = await this.payments.record(p);",
   "n": 50
  },
  {
   "t": "    this.log.log(",
   "n": 51
  },
  {
   "t": "      `${p.paymentId} · #${p.orderId} · ${p.status} · ${p.amount}${r.duplicate ? ' — takror, yozilmadi' : ''}`,",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "    return { ok: true, duplicate: r.duplicate };",
   "n": 54
  },
  {
   "t": "  }",
   "n": 55
  },
  {
   "t": "}",
   "n": 56
  }
 ]
};
const KOD_MAIN_NORAW = {
 "file": "src/main.ts",
 "tag": "norawbody nusxa",
 "lines": [
  {
   "t": "import { NestFactory } from '@nestjs/core';",
   "n": 1
  },
  {
   "t": "import { AppModule } from './api/app.module';",
   "n": 2
  },
  {
   "t": "import { config } from './config';",
   "n": 3
  },
  {
   "t": "",
   "n": 4
  },
  {
   "t": "async function main() {",
   "n": 5
  },
  {
   "t": "  // rawBody: to'lov webhook'i imzosi xom baytlardan hisoblanadi — JSON qayta yozilsa imzo mos kelmaydi",
   "n": 6
  },
  {
   "t": "  const app = await NestFactory.create(AppModule);",
   "n": 7
  },
  {
   "t": "  await app.listen(config.PORT);",
   "n": 8
  },
  {
   "t": "  console.log(`Server ${config.PORT}-portda ishlayapti`);",
   "n": 9
  },
  {
   "t": "}",
   "n": 10
  },
  {
   "t": "",
   "n": 11
  },
  {
   "t": "void main();",
   "n": 12
  }
 ]
};
const KOD_README = {
 "file": "README.md",
 "tag": "wh-done",
 "lines": [
  {
   "t": "## To'lov webhook'i",
   "n": 65
  },
  {
   "t": "To'lov xizmati (Payme, Click kabi) mijoz to'laganini **o'zi** serverga xabar qiladi: `POST /payments/webhook`. Ilova yoki mijozning «to'ladim» degani dalil emas — dalil faqat xizmatning imzoli xabari.",
   "n": 67
  },
  {
   "t": "| Qadam | Nima tekshiriladi | Xato bo'lsa |",
   "n": 69
  },
  {
   "t": "|---|---|---|",
   "n": 70
  },
  {
   "t": "| 1 · imzo | `X-Signature` = HMAC-SHA256(**xom tana**, `PAYMENT_WEBHOOK_SECRET`) | `401`, hech narsa yozilmaydi |",
   "n": 71
  },
  {
   "t": "| 2 · maydonlar | `paymentId`, `orderId`, `status: 'paid' \\| 'failed'`, `amount` | `400` |",
   "n": 72
  },
  {
   "t": "| 3 · buyurtma | buyurtma bor va `amount` = `total` | `400` |",
   "n": 73
  },
  {
   "t": "| 4 · yozuv | `payments` ga qator — `payment_id` noyob | takror: `200 { duplicate: true }`, ikkinchi qator yo'q |",
   "n": 74
  },
  {
   "t": "| 5 · panel | `order-changed { orderId, reason: 'payment' }` | — |",
   "n": 75
  },
  {
   "t": "- Imzo **yozuvdan oldin** tekshiriladi. Kalit faqat `.env` da (va hostingda) — kodga, git'ga, chatga yozilmaydi; bo'sh bo'lsa har xabar `401`.",
   "n": 77
  },
  {
   "t": "- Imzo baytlardan hisoblanadi: server `rawBody: true` bilan ishga tushadi (`main.ts`). JSON qayta yozilsa (bo'sh joy, kalitlar tartibi) imzo mos kelmaydi.",
   "n": 78
  },
  {
   "t": "- Rad etilgan to'lov ham yoziladi (`status: 'failed'`); oldin to'langan buyurtmani «rad» ga tushirmaydi. Panelda «To'lov» ustuni.",
   "n": 79
  },
  {
   "t": "- Lokal sinov (haqiqiy xizmatsiz): `npm run pay -- <buyurtma raqami> [ok | rad | ikki | imzosiz | soxta]` — xabarni xizmat kabi imzolab yuboradi.",
   "n": 80
  },
  {
   "t": "- Telegram'siz tekshirish: `npm run smoke -- payment`.",
   "n": 81
  }
 ]
};
const KOD_OUT_00 = "v24.18.0\n11.16.0\nP HEAD 71c72a4 ws2-done: qayta ulanish — panel va npm run live har connect'da ro'yxatni \n M .env.example\n M README.md\n M package.json\n M public/admin.html\n M scripts/smoke.js\n M src/api/app.module.ts\n M src/api/live/admin.controller.spec.ts\n M src/api/live/admin.controller.ts\n M src/api/live/live.gateway.ts\n M src/config/index.ts\n M src/core/entity/index.ts\n M src/core/entity/order.entity.ts\n M src/infrastructure/data-source.ts\n M src/main.ts\n?? scripts/pay.js\n?? src/api/payment/\n?? src/core/entity/payment.entity.ts\n?? src/infrastructure/migrations/1762300000000-payments.ts\n@nestjs/core 11.2.8\n@nestjs/platform-express 11.2.8\nGoogle Chrome 148.0.7778.96 \nWed Nov  4 10:23:37 PM +05 2026";
const KOD_OUT_00B = "# nusxalar farqi (done → buzilgan)\n## main.ts: done → norawbody\n@@ -4,7 +4,7 @@\n \n async function main() {\n   // rawBody: to'lov webhook'i imzosi xom baytlardan hisoblanadi — JSON qayta yozilsa imzo mos kelmaydi\n-  const app = await NestFactory.create(AppModule, { rawBody: true });\n+  const app = await NestFactory.create(AppModule);\n   await app.listen(config.PORT);\n   console.log(`Server ${config.PORT}-portda ishlayapti`);\n }\n## payment.controller.ts: done → tartib\n@@ -36,14 +36,14 @@\n     @Headers('x-signature') signature: string | undefined,\n     @Body() body: unknown,\n   ) {\n+    const p = parsePayment(body);\n+    const r = await this.payments.record(p);\n     if (\n       !isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)\n     ) {\n       this.log.warn(\"imzo noto'g'ri — xabar rad etildi\");\n       throw new UnauthorizedException(\"imzo noto'g'ri\");\n     }\n-    const p = parsePayment(body);\n-    const r = await this.payments.record(p);\n     this.log.log(\n       `${p.paymentId} · #${p.orderId} · ${p.status} · ${p.amount}${r.duplicate ? ' — takror, yozilmadi' : ''}`,\n     );\n## payment.controller.ts: done → json\n@@ -37,7 +37,11 @@\n     @Body() body: unknown,\n   ) {\n     if (\n-      !isValidSignature(req.rawBody, signature, config.PAYMENT_WEBHOOK_SECRET)\n+      !isValidSignature(\n+        Buffer.from(JSON.stringify(body)),\n+        signature,\n+        config.PAYMENT_WEBHOOK_SECRET,\n+      )\n     ) {\n       this.log.warn(\"imzo noto'g'ri — xabar rad etildi\");\n       throw new UnauthorizedException(\"imzo noto'g'ri\");";
const KOD_OUT_01 = "# wh-start (= ws2-done): to'lov xizmati xabar yubordi — server bunday manzilni bilmaydi\n$ curl -s -X POST http://localhost:3100/payments/webhook -H 'Content-Type: application/json' -d '{\"paymentId\":\"pay_1\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}'\n{\"message\":\"Cannot POST /payments/webhook\",\"error\":\"Not Found\",\"statusCode\":404}\n\n$ psql: SELECT id, status, total FROM orders\n id | status | total  \n----+--------+--------\n  1 | NEW    | 120000\n(1 row)";
const KOD_OUT_02 = "# wh-done: npm run start — main.ts rawBody bilan, yangi yo'l POST /payments/webhook\n22:21:41 main.ts: NestFactory.create(AppModule, {\"rawBody\":true})\nLOG [RoutesResolver] PaymentController {/payments}:\nLOG [RouterExplorer] Mapped {/payments/webhook, POST} route\nServer 3100-portda ishlayapti\n\n$ psql: \\d payments\n                                        Table \"public.payments\"\n   Column   |            Type             | Collation | Nullable |               Default                \n------------+-----------------------------+-----------+----------+--------------------------------------\n id         | integer                     |           | not null | nextval('payments_id_seq'::regclass)\n payment_id | character varying           |           | not null | \n order_id   | integer                     |           | not null | \n status     | character varying           |           | not null | \n amount     | integer                     |           | not null | \n created_at | timestamp without time zone |           | not null | now()\nIndexes:\n    \"payments_pkey\" PRIMARY KEY, btree (id)\n    \"payments_payment_id_key\" UNIQUE CONSTRAINT, btree (payment_id)\nCheck constraints:";
const KOD_OUT_03 = "# wh-done: Bobur buyurtma berdi (#1) — to'lov xizmati xabar yuboradi\n$ npm run pay -- 1\n→ POST /payments/webhook {\"paymentId\":\"pay_0005d844\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: 5c73334670107a1f…\n← 200 {\"ok\":true,\"duplicate\":false}\n\n## Server logi\nLOG [InstanceLoader] PaymentModule dependencies initialized\nLOG [RoutesResolver] PaymentController {/payments}:\nLOG [Payment] pay_0005d844 · #1 · paid · 120000\n\n$ psql: SELECT payment_id, order_id, status, amount FROM payments\n  payment_id  | order_id | status | amount \n--------------+----------+--------+--------\n pay_0005d844 |        1 | paid   | 120000\n(1 row)\n$ psql: SELECT id, total, payment_status FROM orders\n id | total  | payment_status \n----+--------+----------------\n  1 | 120000 | paid\n(1 row)";
const KOD_OUT_04 = "# wh-done: xizmat javobni olmadi deb bitta xabarni qayta yubordi\n$ npm run pay -- 1 ikki\n→ POST /payments/webhook {\"paymentId\":\"pay_b96e99d4\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: e95d82d564f7b419…\n← 200 {\"ok\":true,\"duplicate\":false}\n→ xuddi shu xabar yana (xizmat javobni olmagan deb qayta yubordi)\n← 200 {\"ok\":true,\"duplicate\":true}\n\n## Server logi\nLOG [Payment] pay_b96e99d4 · #1 · paid · 120000\nLOG [Payment] pay_b96e99d4 · #1 · paid · 120000 — takror, yozilmadi\n\n$ psql: SELECT payment_id, order_id, status FROM payments\n  payment_id  | order_id | status \n--------------+----------+--------\n pay_0005d844 |        1 | paid\n pay_b96e99d4 |        1 | paid\n(2 rows)";
const KOD_OUT_05 = "# wh-done: imzosiz va boshqa kalit bilan (kalitni bilmagan odam) — xabar rad etiladi\n$ npm run pay -- 1 imzosiz\n→ POST /payments/webhook {\"paymentId\":\"pay_d4dd85bf\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: (yo'q)\n← 401 {\"message\":\"imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401}\n\n$ npm run pay -- 1 soxta\n→ POST /payments/webhook {\"paymentId\":\"pay_233cc12f\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: b42930c1ee36e342…\n← 401 {\"message\":\"imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401}\n\n## Server logi\nWARN [Payment] imzo noto'g'ri — xabar rad etildi\nWARN [Payment] imzo noto'g'ri — xabar rad etildi\n\n$ psql: SELECT count(*) AS payments_qatorlari FROM payments\n payments_qatorlari \n--------------------\n                  2\n(1 row)";
const KOD_OUT_06 = "# wh-done: ikkinchi buyurtma (#2) — to'lov RAD etildi (karta rad etdi): xabar keladi va yoziladi\n$ npm run pay -- 2 rad\n→ POST /payments/webhook {\"paymentId\":\"pay_9cef5e2f\",\"orderId\":2,\"status\":\"failed\",\"amount\":120000}\n  X-Signature: 58869dd5151fbf84…\n← 200 {\"ok\":true,\"duplicate\":false}\n\n## Server logi\nLOG [Payment] pay_9cef5e2f · #2 · failed · 120000\n\n$ psql: SELECT payment_id, order_id, status FROM payments\n  payment_id  | order_id | status \n--------------+----------+--------\n pay_0005d844 |        1 | paid\n pay_b96e99d4 |        1 | paid\n pay_9cef5e2f |        2 | failed\n(3 rows)\n$ psql: SELECT id, payment_status FROM orders ORDER BY id\n id | payment_status \n----+----------------\n  1 | paid\n  2 | failed\n(2 rows)";
const KOD_OUT_07DONE = "# nusxa: done — xizmat JSON'ni bo'sh joy bilan yubordi, imzo shu baytlardan (to'g'ri)\n$ curl -s -X POST http://localhost:3100/payments/webhook -H 'X-Signature: 88e7dfffff6a3624…' -d '{ \"paymentId\": \"pay_bosh_joy\", \"orderId\": 1, \"status\": \"paid\", \"amount\": 120000 }'\n{\"ok\":true,\"duplicate\":false}\n← 200\n\n## Server logi\nLOG [InstanceLoader] PaymentModule dependencies initialized\nLOG [RoutesResolver] PaymentController {/payments}:\nLOG [Payment] pay_bosh_joy · #1 · paid · 120000\n\n$ psql: SELECT payment_id, status FROM payments\n  payment_id  | status \n--------------+--------\n pay_bosh_joy | paid\n(1 row)";
const KOD_OUT_07JSON = "# nusxa: json — xizmat JSON'ni bo'sh joy bilan yubordi, imzo shu baytlardan (to'g'ri)\n$ curl -s -X POST http://localhost:3100/payments/webhook -H 'X-Signature: 88e7dfffff6a3624…' -d '{ \"paymentId\": \"pay_bosh_joy\", \"orderId\": 1, \"status\": \"paid\", \"amount\": 120000 }'\n{\"message\":\"imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401}\n← 401\n\n## Server logi\nLOG [InstanceLoader] PaymentModule dependencies initialized\nLOG [RoutesResolver] PaymentController {/payments}:\nWARN [Payment] imzo noto'g'ri — xabar rad etildi\n\n$ psql: SELECT payment_id, status FROM payments\n payment_id | status \n------------+--------\n(0 rows)";
const KOD_OUT_08 = "# nusxa: norawbody — main.ts da { rawBody: true } yo'q\n22:22:16 main.ts: NestFactory.create(AppModule)\n\n$ npm run pay -- 1\n→ POST /payments/webhook {\"paymentId\":\"pay_fda9f50b\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: 4cfe76e89b38a3ab…\n← 401 {\"message\":\"imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401}\n\n## Server logi\nLOG [InstanceLoader] PaymentModule dependencies initialized\nLOG [RoutesResolver] PaymentController {/payments}:\nWARN [Payment] imzo noto'g'ri — xabar rad etildi\n\n$ psql: SELECT count(*) AS payments_qatorlari FROM payments\n payments_qatorlari \n--------------------\n                  0\n(1 row)";
const KOD_OUT_09 = "# nusxa: tartib — parsePayment va record imzo tekshiruvidan OLDIN\n$ npm run pay -- 1 imzosiz\n→ POST /payments/webhook {\"paymentId\":\"pay_e714112c\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: (yo'q)\n← 401 {\"message\":\"imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401}\n\n## Server logi\nLOG [InstanceLoader] PaymentModule dependencies initialized\nLOG [RoutesResolver] PaymentController {/payments}:\nWARN [Payment] imzo noto'g'ri — xabar rad etildi\n\n$ psql: SELECT payment_id, order_id, status FROM payments\n  payment_id  | order_id | status \n--------------+----------+--------\n pay_e714112c |        1 | paid\n(1 row)\n$ psql: SELECT id, payment_status FROM orders\n id | payment_status \n----+----------------\n  1 | paid\n(1 row)";
const KOD_OUT_09B = "22:22:23.603 brauzer: WebSocket ochildi\n22:22:23.605 brauzer: GET /admin/orders (1)\n22:22:24.217 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n22:22:24.504 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n22:22:24.504 brauzer: GET /admin/orders (2)\n22:22:27.484 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"payment\"}]\n22:22:27.485 brauzer: GET /admin/orders (3)\n22:22:29.776 SURAT 09-panel-1 (1-imzosiz-keyin) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | ✅ To'landi | 22:22:24\n22:22:30.543 tugadi — belgi «Ulangan» · ro'yxat: #1 · jami GET: 3";
const KOD_OUT_10 = "# wh-done, .env da PAYMENT_WEBHOOK_SECRET bo'sh\nWARN [Payment] PAYMENT_WEBHOOK_SECRET bo'sh — har to'lov xabari 401 bilan rad etiladi (.env)\n\n$ npm run pay -- 1\n→ POST /payments/webhook {\"paymentId\":\"pay_1882a443\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n  X-Signature: 7226e09e00a6ba28…\n← 401 {\"message\":\"imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401}\n\n$ psql: SELECT count(*) AS payments_qatorlari FROM payments\n payments_qatorlari \n--------------------\n                  0\n(1 row)";
const KOD_OUT_11 = "$ curl -s -X POST http://localhost:3100/payments/webhook -H 'X-Signature: c0effd6168cee3e1…' -d '{\"paymentId\":\"pay_kam\",\"orderId\":1,\"status\":\"paid\",\"amount\":1200}'\n{\"message\":\"summa mos emas: 1200 \u2260 120000\",\"error\":\"Bad Request\",\"statusCode\":400}\n← 400\n\n$ curl -s -X POST http://localhost:3100/payments/webhook -H 'X-Signature: a29b2134353000bd…' -d '{\"paymentId\":\"pay_st\",\"orderId\":1,\"status\":\"ok\",\"amount\":120000}'\n{\"message\":\"status: 'paid' yoki 'failed'\",\"error\":\"Bad Request\",\"statusCode\":400}\n← 400\n\n$ psql: SELECT count(*) AS payments_qatorlari FROM payments\n payments_qatorlari \n--------------------\n                  0\n(1 row)";
const KOD_OUT_12 = "# wh-done: brauzerdagi panel — buyurtma, to'landi, rad (sahifa yangilanmadi)\n22:21:48.215 brauzer: WebSocket ochildi\n22:21:48.217 brauzer: GET /admin/orders (1)\n22:21:48.830 panel ochildi — belgi «Ulangan» · ro'yxat: Hali buyurtma yo'q\n22:21:49.107 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"new\"}]\n22:21:49.108 brauzer: GET /admin/orders (2)\n22:21:51.773 SURAT 03-panel-1 (1-buyurtma) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | — | 22:21:49\n22:21:52.768 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"payment\"}]\n22:21:52.768 brauzer: GET /admin/orders (3)\n22:21:55.022 SURAT 03-panel-2 (2-tolandi) — belgi «Ulangan» · ro'yxat: #1\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | ✅ To'landi | 22:21:49\n22:21:55.951 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":1,\"reason\":\"payment\"}]\n22:21:55.951 brauzer: GET /admin/orders (4)\n22:21:58.433 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":2,\"reason\":\"new\"}]\n22:21:58.433 brauzer: GET /admin/orders (5)\n22:22:01.411 brauzer: kadr keldi 42[\"order-changed\",{\"orderId\":2,\"reason\":\"payment\"}]\n22:22:01.411 brauzer: GET /admin/orders (6)\n22:22:03.631 SURAT 03-panel-3 (3-rad) — belgi «Ulangan» · ro'yxat: #2, #1\n    2 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | ❌ Rad etildi | 22:21:58\n    1 | Bobur | +998907654321 | Klaviatura × 1 | 120 000 so'm | Yangi | ✅ To'landi | 22:21:49\n22:22:04.247 tugadi — belgi «Ulangan» · ro'yxat: #2, #1 · jami GET: 6";
const KOD_OUT_13 = "$ npm test\nPASS src/api/payment/signature.spec.ts\nPASS src/api/telegram/phone.spec.ts\nPASS src/api/telegram/texts.spec.ts\nPASS src/api/telegram/keyboards.spec.ts\nPASS src/api/app.controller.spec.ts\nPASS src/api/order/order.service.spec.ts\nPASS src/api/payment/payment.service.spec.ts\nPASS src/api/live/live.gateway.spec.ts\nPASS src/api/live/admin.controller.spec.ts\nPASS src/api/payment/payment.controller.spec.ts\nTests:       48 passed, 48 total\n\n$ npm run smoke -- payment\n== vaqtinchalik baza: shop_smoke ==\n  katalogda 6 ta mahsulot\n— payment: to'lov webhook'i — imzo, takror, rad va panelga hodisa\n  ✓ imzosiz — 401, payments da qator yo'q\n  ✓ imzoli to'lov — 200 {\"ok\":true,\"duplicate\":false} · #1 payment_status=paid\n  ✓ panelga → order-changed {\"orderId\":1,\"reason\":\"payment\"}\n  ✓ takror — 200 {\"ok\":true,\"duplicate\":true} · payments da 1 qator\n  ✓ keyingi rad — yozildi, lekin to'langan buyurtma «paid» qoldi (paid)\nNATIJA: 5/5 ✓";
const KOD_OUT_14 = "# nusxa: tartib (yozuv imzodan OLDIN) — npm test\n$ npm test -- payment.controller\nFAIL src/api/payment/payment.controller.spec.ts\n    ✕ imzosiz — 401, yozuvga yetmaydi\n    ✕ boshqa kalit bilan — 401\n    ✕ imzodan keyin tana o'zgargan — 401\n    ✓ to'g'ri imzo — 200, servisga aynan shu to'lov\n    ✓ imzo to'g'ri, maydon xato — 400, yozilmaydi\n    ✓ kalit bo'sh — to'g'ri ko'rinadigan imzo ham 401\n  ● PaymentController — POST /payments/webhook › imzosiz — 401, yozuvga yetmaydi\n  ● PaymentController — POST /payments/webhook › boshqa kalit bilan — 401\n  ● PaymentController — POST /payments/webhook › imzodan keyin tana o'zgargan — 401\nTests:       3 failed, 3 passed, 6 total";
const KOD_OUT_15 = "# wh-done: bir xil xabar bir vaqtda ikki marta (ikki curl parallel)\n$ curl … & curl … &   # body: {\"paymentId\":\"pay_birdan\",\"orderId\":1,\"status\":\"paid\",\"amount\":120000}\n{\"ok\":true,\"duplicate\":true} ← 200\n{\"ok\":true,\"duplicate\":false} ← 200\n\n## Server logi\nLOG [Payment] pay_birdan · #1 · paid · 120000\nLOG [Payment] pay_birdan · #1 · paid · 120000 — takror, yozilmadi\n\n$ psql: SELECT payment_id, order_id, status FROM payments\n payment_id | order_id | status \n------------+----------+--------\n pay_birdan |        1 | paid\n(1 row)";
const KOD_OUT_16 = "# GitHub Actions — main 17be79e (wh-done), run 41877680202\n✓ main CI · 41877680202\n✓ test in 22s (ID 126741522165)\n✓ smoke in 36s (ID 126741726686)\n\n## smoke job — payment\n— payment: to'lov webhook'i — imzo, takror, rad va panelga hodisa\n  ✓ imzosiz — 401, payments da qator yo'q\n  ✓ imzoli to'lov — 200 {\"ok\":true,\"duplicate\":false} · #6 payment_status=paid\n  ✓ panelga → order-changed {\"orderId\":6,\"reason\":\"payment\"}\n  ✓ takror — 200 {\"ok\":true,\"duplicate\":true} · payments da 1 qator\n  ✓ keyingi rad — yozildi, lekin to'langan buyurtma «paid» qoldi (paid)\nNATIJA: 14/14 ✓";
const KOD_OUT_AI1 = "# ai1 — haqiqiy PostgreSQL 18, server: AI nusxasining dist/main.js · manzil /payments/webhook · buyurtma #1, total 120000\n22:31:50 main.ts: NestFactory.create(AppModule, {\"rawBody\":true})\n\n## 1. to'g'ri imzo — to'landi\n$ {\"payment_id\":\"p_1\",\"order_id\":1,\"status\":\"paid\",\"amount\":120000}\n{\"ok\":true,\"result\":\"applied\",\"order_id\":1,\"payment_status\":\"PAID\"} ← 200\n  payments qatorlari: 1\n\n## 2. o'sha xabar yana (takror)\n{\"ok\":true,\"result\":\"duplicate\",\"order_id\":1,\"payment_status\":\"PAID\"} ← 200\n  payments qatorlari: 1\n\n## 3. imzosiz\n{\"message\":\"Imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401} ← 401\n  payments qatorlari: 1\n\n## 4. imzo «abc» (qisqa)\n{\"message\":\"Imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401} ← 401\n  payments qatorlari: 1\n\n## 5. imzo to'g'ri, summa 1200 (buyurtma #2 — 120000)\n$ {\"payment_id\":\"p_5\",\"order_id\":2,\"status\":\"paid\",\"amount\":1200}\n{\"ok\":true,\"result\":\"applied\",\"order_id\":2,\"payment_status\":\"AMOUNT_MISMATCH\"} ← 200\n  payments qatorlari: 2\n\n## 6. chiroyli JSON (bo'sh joy, qator) — imzo shu baytlardan\n{\"ok\":true,\"result\":\"applied\",\"order_id\":1,\"payment_status\":\"PAID\"} ← 200\n  payments qatorlari: 3\n\n## 7. bir xil xabar bir vaqtda ikki marta\n{\"ok\":true,\"result\":\"duplicate\",\"order_id\":1,\"payment_status\":\"PAID\"} ← 200\n{\"ok\":true,\"result\":\"applied\",\"order_id\":1,\"payment_status\":\"PAID\"} ← 200\n  payments (p_7) qatorlari: 1\n\n## 8. GET /admin/orders — panel nimani ko'radi\n#2 total 120000 · payment \"AMOUNT_MISMATCH\"\n#1 total 120000 · payment \"PAID\"\n\n## Server logi (to'lov)\nLOG [RouterExplorer] Mapped {/payments/webhook, POST} route\nLOG [Payment] p_1 · #1 · paid 120000 → applied, PAID\nLOG [Payment] p_1 · #1 · paid 120000 → duplicate, PAID\nWARN [Payment] imzo noto'g'ri yoki yo'q (::1)\nWARN [Payment] imzo noto'g'ri yoki yo'q (::1)\nWARN [Payment] #2: to'langan 1200, buyurtma jami 120000\nLOG [Payment] p_5 · #2 · paid 1200 → applied, AMOUNT_MISMATCH\nLOG [Payment] p_6 · #1 · paid 120000 → applied, PAID\nLOG [Payment] p_7 · #1 · paid 120000 → applied, PAID\nLOG [Payment] p_7 · #1 · paid 120000 → duplicate, PAID";
const KOD_OUT_AI2 = "# ai2 — haqiqiy PostgreSQL 18, server: AI nusxasining dist/main.js · manzil /webhooks/payment · buyurtma #1, total 120000\n22:26:48 main.ts: NestFactory.create(AppModule, {\"rawBody\":true})\n\n## 1. to'g'ri imzo — to'landi\n$ {\"payment_id\":\"p_1\",\"order_id\":1,\"status\":\"paid\",\"amount\":120000}\n{\"ok\":true,\"status\":\"PAID\"} ← 200\n  payments qatorlari: 1\n\n## 2. o'sha xabar yana (takror)\n{\"ok\":true,\"status\":\"PAID\"} ← 200\n  payments qatorlari: 1\n\n## 3. imzosiz\n{\"message\":\"Imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401} ← 401\n  payments qatorlari: 1\n\n## 4. imzo «abc» (qisqa)\n{\"message\":\"Imzo noto'g'ri\",\"error\":\"Unauthorized\",\"statusCode\":401} ← 401\n  payments qatorlari: 1\n\n## 5. imzo to'g'ri, summa 1200 (buyurtma #2 — 120000)\n$ {\"payment_id\":\"p_5\",\"order_id\":2,\"status\":\"paid\",\"amount\":1200}\n{\"ok\":true,\"status\":\"PAID\"} ← 200\n  payments qatorlari: 2\n\n## 6. chiroyli JSON (bo'sh joy, qator) — imzo shu baytlardan\n{\"ok\":true,\"status\":\"PAID\"} ← 200\n  payments qatorlari: 3\n\n## 7. bir xil xabar bir vaqtda ikki marta\n{\"ok\":true,\"status\":\"PAID\"} ← 200\n{\"ok\":true,\"status\":\"PAID\"} ← 200\n  payments (p_7) qatorlari: 1\n\n## 8. GET /admin/orders — panel nimani ko'radi\n#2 total 120000 · payment {\"status\":\"PAID\",\"amount\":1200,\"external_id\":\"p_5\",\"received_at\":\"2026-11-04T17:26:49.312Z\"}\n#1 total 120000 · payment {\"status\":\"PAID\",\"amount\":120000,\"external_id\":\"p_7\",\"received_at\":\"2026-11-04T17:26:49.578Z\"}\n\n## Server logi (to'lov)\nLOG [RouterExplorer] Mapped {/webhooks/payment, POST} route\nLOG [Payment] #1: to'lov p_1 → PAID\nLOG [Payment] #1: to'lov p_1 → PAID\nWARN [Payment] #2: to'lov summasi 1200, buyurtma summasi 120000 — tekshiring\nLOG [Payment] #2: to'lov p_5 → PAID\nLOG [Payment] #1: to'lov p_6 → PAID\nLOG [Payment] #1: to'lov p_7 → PAID\nLOG [Payment] #1: to'lov p_7 → PAID";
const KOD_OUT_MJ01 = "$ curl localhost:3000/tolov-mashq?oyinchi=11\nMashq to'lov\nBu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.\nMaydon Jamoa — Pro, 30 kun · 10 000 so'm\nTo'lash (mashq)\nRad etish (mashq)\nIkki marta yuborish\nImzosiz yuborish";
const KOD_OUT_MJ02 = "$ curl -X POST localhost:3000/tolov-mashq/yubor -d '{\"tur\":\"tolash\",\"oyinchi\":11,\"summa\":10000}'   # «tolash» tugmasi\n{\"tolovRaqami\":\"m-1793494239802\",\"javoblar\":[{\"holat\":200,\"tana\":{\"ok\":true}}]}";
const KOD_OUT_MJ05 = "$ curl -X POST localhost:3000/tolov-mashq/yubor -d '{\"tur\":\"imzosiz\",\"oyinchi\":11,\"summa\":10000}'   # «imzosiz» tugmasi\n{\"tolovRaqami\":\"m-1793494243179\",\"javoblar\":[{\"holat\":401,\"tana\":{\"message\":\"Imzo mos emas\",\"error\":\"Unauthorized\",\"statusCode\":401}}]}";
const KOD_OUT_MJ13 = "# tolov.controller.ts — imzo tekshiruvi insert'dan keyin:\n  async webhook(@Req() sorov: RawBodyRequest<Request>, @Headers('x-imzo') imzo: string | undefined) {\n    const tana = (sorov.body ?? {}) as Record<string, unknown>;\n    const tolovRaqami = typeof tana.tolovRaqami === 'string' ? tana.tolovRaqami.trim() : '';\n    const holat = tana.holat;\n    const summa = tana.summa;\n    const oyinchiId = tana.oyinchiId;\n    if (!tolovRaqami || tolovRaqami.length > 40) throw new BadRequestException(\"tolovRaqami bo'sh\");\n    if (typeof holat !== 'string' || !HOLATLAR.includes(holat)) throw new BadRequestException('holat — tolandi yoki rad');\n    if (typeof summa !== 'number' || !Number.isInteger(summa) || summa <= 0) {\n      throw new BadRequestException(\"summa — musbat butun son (so'm)\");\n    }\n    if (typeof oyinchiId !== 'number' || !Number.isInteger(oyinchiId) || !(await this.oyinchilar.existsBy({ id: oyinchiId }))) {\n      throw new BadRequestException('oyinchiId — mavjud hisob');\n    }\n\n    if (await this.tolovlar.existsBy({ tolov_raqami: tolovRaqami })) return { takror: true };\n    try {\n      await this.tolovlar.insert({ tolov_raqami: tolovRaqami, oyinchi_id: oyinchiId, summa, holat });\n    } catch (e) {\n      // Ikki bir xil xabar bir vaqtda keldi: ikkinchisini jadvaldagi noyoblik to'xtatdi — u ham takror (500 emas)\n      if ((e as { code?: string }).code === '23505') return { takror: true };\n      throw e;\n    }\n    if (!imzoTogrimi(sorov.rawBody, imzo)) throw new UnauthorizedException(\"Imzo mos emas\");\n    return { ok: true };\n  }\n\n$ … tolov-mashq/yubor {\"tur\":\"imzosiz\"}\n{\"tolovRaqami\":\"m-1793494254980\",\"javoblar\":[{\"holat\":401,\"tana\":{\"message\":\"Imzo mos emas\",\"error\":\"Unauthorized\",\"statusCode\":401}}]}\n$ psql: oxirgi qator\n  tolov_raqami   |  holat  \n-----------------+---------\n m-1793494254980 | tolandi\n(1 row)";
const KOD_PANEL = [
 {
  "k": "09b-1",
  "t": "22:22:29",
  "note": "1-imzosiz-keyin",
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
     "✅ To'landi",
     "22:22:24"
    ]
   }
  ]
 },
 {
  "k": "12-1",
  "t": "22:21:51",
  "note": "1-buyurtma",
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
     "—",
     "22:21:49"
    ]
   }
  ]
 },
 {
  "k": "12-2",
  "t": "22:21:55",
  "note": "2-tolandi",
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
     "✅ To'landi",
     "22:21:49"
    ]
   }
  ]
 },
 {
  "k": "12-3",
  "t": "22:22:03",
  "note": "3-rad",
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
     "❌ Rad etildi",
     "22:21:58"
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
     "✅ To'landi",
     "22:21:49"
    ]
   }
  ]
 }
];
const KOD_AI_AI1 = {
 "stat": "24 files changed, 789 insertions(+), 19 deletions(-)"
};
const KOD_AI_AI2 = {
 "stat": "20 files changed, 551 insertions(+), 11 deletions(-)"
};
const KOD_PROMPT1 = "OrderBotNest'ga onlayn to'lov qo'shmoqchimiz. To'lov xizmati mijoz to'lagandan keyin natijani bizning serverga webhook bilan yuboradi: POST so'rov, JSON tanada to'lov raqami, buyurtma raqami, holat (to'landi yoki rad etildi) va summa. Har xabar HMAC-SHA256 bilan imzolangan, imzo X-Signature sarlavhasida, kalit bizda .env da. Shu webhook'ni qo'shib ber: to'lov holati admin panelida ko'rinsin.";
const KOD = { SIG: KOD_SIG, CTRL: KOD_CTRL, SVC: KOD_SVC, INPUT: KOD_INPUT, MAIN: KOD_MAIN, PAY: KOD_PAY, ENV: KOD_ENV, CONFIG: KOD_CONFIG, MIG: KOD_MIG, CSPEC: KOD_CSPEC, CTRL_TARTIB: KOD_CTRL_TARTIB, CTRL_JSON: KOD_CTRL_JSON, MAIN_NORAW: KOD_MAIN_NORAW, README: KOD_README, OUT: { '00': KOD_OUT_00, '00b': KOD_OUT_00B, '01': KOD_OUT_01, '02': KOD_OUT_02, '03': KOD_OUT_03, '04': KOD_OUT_04, '05': KOD_OUT_05, '06': KOD_OUT_06, '07done': KOD_OUT_07DONE, '07json': KOD_OUT_07JSON, '08': KOD_OUT_08, '09': KOD_OUT_09, '09b': KOD_OUT_09B, '10': KOD_OUT_10, '11': KOD_OUT_11, '12': KOD_OUT_12, '13': KOD_OUT_13, '14': KOD_OUT_14, '15': KOD_OUT_15, '16': KOD_OUT_16, 'ai1': KOD_OUT_AI1, 'ai2': KOD_OUT_AI2, 'mj01': KOD_OUT_MJ01, 'mj02': KOD_OUT_MJ02, 'mj05': KOD_OUT_MJ05, 'mj13': KOD_OUT_MJ13 }, PANEL: KOD_PANEL, AI: { ai1: KOD_AI_AI1, ai2: KOD_AI_AI2 }, PROMPT1: KOD_PROMPT1 };
