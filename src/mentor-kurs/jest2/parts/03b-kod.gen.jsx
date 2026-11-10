
// AVTO: feedback/F-1029-02-mentor-kurs/dev/jest2-kod.py — OrderBotNest teglari va haqiqiy test fayllaridan aynan (qo'lda tahrirlanmaydi)
const KOD_TS_PHONE = {
 "file": "src/api/telegram/telegram.service.ts",
 "tag": "jest2-start",
 "lines": [
  {
   "t": "const PHONE = /^\\+?\\d{9,13}$/;",
   "n": 12
  }
 ]
};
const KOD_TS_ONTEXT = {
 "file": "src/api/telegram/telegram.service.ts",
 "tag": "jest2-start",
 "lines": [
  {
   "t": "  // Matn keldi: telefon kutilayotgan bo'lsa — saqlab buyurtma beramiz",
   "n": 152
  },
  {
   "t": "  private async onText(ctx: Context & { message: { text: string } }) {",
   "n": 153
  },
  {
   "t": "    const user = await this.users.getOrCreate(ctx.from!);",
   "n": 154
  },
  {
   "t": "    if (user.state === 'WAITING_PHONE') {",
   "n": 155
  },
  {
   "t": "      const phone = ctx.message.text.trim();",
   "n": 156
  },
  {
   "t": "      if (!PHONE.test(phone)) return ctx.reply(texts.badPhone);",
   "n": 157
  },
  {
   "t": "      await this.users.setPhone(user, phone);",
   "n": 158
  },
  {
   "t": "      return this.placeOrder(ctx, user);",
   "n": 159
  },
  {
   "t": "    }",
   "n": 160
  }
 ]
};
const KOD_TS_IMPORT_NEW = {
 "file": "src/api/telegram/telegram.service.ts",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "import { cartKeyboard, catalogKeyboard, orderKeyboard } from './keyboards';",
   "n": 9
  },
  {
   "t": "import { isPhone } from './phone';",
   "n": 10
  },
  {
   "t": "import { texts } from './texts';",
   "n": 11
  }
 ]
};
const KOD_TS_ONTEXT_NEW = {
 "file": "src/api/telegram/telegram.service.ts",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "  private async onText(ctx: Context & { message: { text: string } }) {",
   "n": 152
  },
  {
   "t": "    const user = await this.users.getOrCreate(ctx.from!);",
   "n": 153
  },
  {
   "t": "    if (user.state === 'WAITING_PHONE') {",
   "n": 154
  },
  {
   "t": "      const phone = ctx.message.text.replace(/[\\s-]/g, '');",
   "n": 155
  },
  {
   "t": "      if (!isPhone(phone)) return ctx.reply(texts.badPhone);",
   "n": 156
  },
  {
   "t": "      await this.users.setPhone(user, phone);",
   "n": 157
  },
  {
   "t": "      return this.placeOrder(ctx, user);",
   "n": 158
  },
  {
   "t": "    }",
   "n": 159
  }
 ]
};
const KOD_PHONE_OLD = {
 "file": "src/api/telegram/phone.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "// Telefon raqami: + bilan yoki + siz, 9–13 ta raqam",
   "n": 1
  },
  {
   "t": "export const PHONE = /^\\+?\\d{9,13}$/;",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "export const isPhone = (text: string) => PHONE.test(text.trim());",
   "n": 4
  }
 ]
};
const KOD_PHONE_NEW = {
 "file": "src/api/telegram/phone.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "// Telefon raqami: + bilan yoki + siz, 9–13 ta raqam. Mijoz probel yoki chiziqcha bilan yozishi mumkin",
   "n": 1
  },
  {
   "t": "export const PHONE = /^\\+?\\d{9,13}$/;",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "export const isPhone = (text: string) => PHONE.test(text.replace(/[\\s-]/g, ''));",
   "n": 4
  }
 ]
};
const KOD_SPEC_PHONE_02 = {
 "file": "src/api/telegram/phone.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { isPhone } from './phone';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "describe('isPhone', () => {",
   "n": 3
  },
  {
   "t": "  it.each(['+998901234567', '998901234567'])(\"%s — to'g'ri raqam\", (s) => {",
   "n": 4
  },
  {
   "t": "    expect(isPhone(s)).toBe(true);",
   "n": 5
  },
  {
   "t": "  });",
   "n": 6
  },
  {
   "t": "",
   "n": 7
  },
  {
   "t": "  it.each([",
   "n": 8
  },
  {
   "t": "    ['12345678', '8 ta raqam — qisqa'],",
   "n": 9
  },
  {
   "t": "    ['+99890123456789', '14 ta raqam — uzun'],",
   "n": 10
  },
  {
   "t": "    ['abc', 'harf'],",
   "n": 11
  },
  {
   "t": "    ['', \"bo'sh\"],",
   "n": 12
  },
  {
   "t": "  ])('%s — %s', (s) => {",
   "n": 13
  },
  {
   "t": "    expect(isPhone(s)).toBe(false);",
   "n": 14
  },
  {
   "t": "  });",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "  it('mijoz probel bilan yozadi', () => {",
   "n": 17
  },
  {
   "t": "    expect(isPhone('+998 90 123 45 67')).toBe(true);",
   "n": 18
  },
  {
   "t": "  });",
   "n": 19
  },
  {
   "t": "});",
   "n": 20
  }
 ]
};
const KOD_SPEC_PHONE_04 = {
 "file": "src/api/telegram/phone.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { isPhone } from './phone';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "describe('isPhone', () => {",
   "n": 3
  },
  {
   "t": "  it.each(['+998901234567', '998901234567'])(\"%s — to'g'ri raqam\", (s) => {",
   "n": 4
  },
  {
   "t": "    expect(isPhone(s)).toBe(true);",
   "n": 5
  },
  {
   "t": "  });",
   "n": 6
  },
  {
   "t": "",
   "n": 7
  },
  {
   "t": "  it.each([",
   "n": 8
  },
  {
   "t": "    ['12345678', '8 ta raqam — qisqa'],",
   "n": 9
  },
  {
   "t": "    ['+99890123456789', '14 ta raqam — uzun'],",
   "n": 10
  },
  {
   "t": "    ['abc', 'harf'],",
   "n": 11
  },
  {
   "t": "    ['', \"bo'sh\"],",
   "n": 12
  },
  {
   "t": "  ])('%s — %s', (s) => {",
   "n": 13
  },
  {
   "t": "    expect(isPhone(s)).toBe(false);",
   "n": 14
  },
  {
   "t": "  });",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "  it('mijoz probel bilan yozadi', () => {",
   "n": 17
  },
  {
   "t": "    expect(isPhone('+998 90 123 45 67')).toBe(true);",
   "n": 18
  },
  {
   "t": "  });",
   "n": 19
  },
  {
   "t": "});",
   "n": 20
  },
  {
   "t": "",
   "n": 21
  },
  {
   "t": "describe(\"isPhone — qoida nimani o'tkazib yuboradi\", () => {",
   "n": 22
  },
  {
   "t": "  it(\"9 ta nol ham o'tadi\", () => {",
   "n": 23
  },
  {
   "t": "    expect(isPhone('000000000')).toBe(true);",
   "n": 24
  },
  {
   "t": "  });",
   "n": 25
  },
  {
   "t": "});",
   "n": 26
  }
 ]
};
const KOD_ORDER_PLACE = {
 "file": "src/api/order/order.service.ts",
 "tag": "jest2-start",
 "lines": [
  {
   "t": "  place(user: User, cart: CartItem[]): Promise<Order> {",
   "n": 24
  },
  {
   "t": "    if (!user.phone) throw new Error(\"Telefon raqami yo'q\");",
   "n": 25
  },
  {
   "t": "    if (cart.length === 0) throw new Error(\"Savat bo'sh\");",
   "n": 26
  },
  {
   "t": "    return this.ds.transaction(async (m) => {",
   "n": 27
  },
  {
   "t": "      const items: OrderItem[] = [];",
   "n": 28
  },
  {
   "t": "      for (const c of cart) {",
   "n": 29
  },
  {
   "t": "        // 1) Qatorni qulflab o'qiymiz (SELECT ... FOR UPDATE): ikkinchi mijoz shu qatorni biz tugatguncha kutadi",
   "n": 30
  },
  {
   "t": "        const p = await m.findOne(Product, {",
   "n": 31
  },
  {
   "t": "          where: { id: c.product.id },",
   "n": 32
  },
  {
   "t": "          lock: { mode: 'pessimistic_write' },",
   "n": 33
  },
  {
   "t": "        });",
   "n": 34
  },
  {
   "t": "        if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);",
   "n": 35
  },
  {
   "t": "        if (p.stock < c.qty) {",
   "n": 36
  },
  {
   "t": "          throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);",
   "n": 37
  },
  {
   "t": "        }",
   "n": 38
  },
  {
   "t": "        // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.",
   "n": 39
  },
  {
   "t": "        //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi",
   "n": 40
  },
  {
   "t": "        //    («current transaction is aborted») — faqat ROLLBACK qoladi.",
   "n": 41
  },
  {
   "t": "        await m.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [",
   "n": 42
  },
  {
   "t": "          c.qty,",
   "n": 43
  },
  {
   "t": "          p.id,",
   "n": 44
  },
  {
   "t": "        ]);",
   "n": 45
  }
 ]
};
const KOD_ORDER_SETSTATUS = {
 "file": "src/api/order/order.service.ts",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "",
   "n": 66
  },
  {
   "t": "  // Status o'zgaradi; bekor qilinsa mahsulotlar omborga qaytadi — yana tranzaksiya",
   "n": 67
  },
  {
   "t": "  setStatus(id: number, status: OrderStatus): Promise<Order> {",
   "n": 68
  },
  {
   "t": "    return this.ds.transaction(async (m) => {",
   "n": 69
  },
  {
   "t": "      // Buyurtma qatorini qulflaymiz: «Bekor» ikki marta bir vaqtda bosilsa,",
   "n": 70
  },
  {
   "t": "      // ikkinchisi birinchisi tugashini kutadi va CANCELLED ni ko'radi — ombor bir marta qaytadi",
   "n": 71
  },
  {
   "t": "      await m.query('SELECT id FROM orders WHERE id = $1 FOR UPDATE', [id]);",
   "n": 72
  },
  {
   "t": "      const order = await m.findOneBy(Order, { id });",
   "n": 73
  },
  {
   "t": "      if (!order) throw new Error(`Buyurtma topilmadi: #${id}`);",
   "n": 74
  },
  {
   "t": "      if (order.status === 'CANCELLED') {",
   "n": 75
  },
  {
   "t": "        throw new Error(`#${id} allaqachon bekor qilingan`);",
   "n": 76
  },
  {
   "t": "      }",
   "n": 77
  },
  {
   "t": "      if (status === 'CANCELLED') {",
   "n": 78
  },
  {
   "t": "        for (const i of order.items) {",
   "n": 79
  },
  {
   "t": "          await m.increment(Product, { id: i.product.id }, 'stock', i.qty);",
   "n": 80
  },
  {
   "t": "        }",
   "n": 81
  },
  {
   "t": "      }",
   "n": 82
  },
  {
   "t": "      order.status = status;",
   "n": 83
  },
  {
   "t": "      return m.save(order);",
   "n": 84
  },
  {
   "t": "    });",
   "n": 85
  },
  {
   "t": "  }",
   "n": 86
  },
  {
   "t": "}",
   "n": 87
  }
 ]
};
const KOD_SPEC_ORDER_05 = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 1
  },
  {
   "t": "import { getRepositoryToken } from '@nestjs/typeorm';",
   "n": 2
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 3
  },
  {
   "t": "import { Order, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { OrderService } from './order.service';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "// Baza o'rniga soxta (mock) EntityManager: findOne mahsulotni qaytaradi, query va save — yozib qoladi",
   "n": 7
  },
  {
   "t": "const manager = {",
   "n": 8
  },
  {
   "t": "  findOne: jest.fn(),",
   "n": 9
  },
  {
   "t": "  query: jest.fn(),",
   "n": 10
  },
  {
   "t": "  create: jest.fn((_cls, data) => data),",
   "n": 11
  },
  {
   "t": "  save: jest.fn(async (o) => ({ id: 1, ...o })),",
   "n": 12
  },
  {
   "t": "  delete: jest.fn(),",
   "n": 13
  },
  {
   "t": "};",
   "n": 14
  },
  {
   "t": "const dataSource = { transaction: jest.fn((cb) => cb(manager)) };",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "const user = { id: 1, phone: '+998901234567' } as User;",
   "n": 17
  },
  {
   "t": "const cart = [{ product: { id: 4, name: 'Kolonka' }, qty: 2 }] as any;",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "let service: OrderService;",
   "n": 20
  },
  {
   "t": "beforeEach(async () => {",
   "n": 21
  },
  {
   "t": "  jest.clearAllMocks();",
   "n": 22
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 23
  },
  {
   "t": "    providers: [",
   "n": 24
  },
  {
   "t": "      OrderService,",
   "n": 25
  },
  {
   "t": "      { provide: getRepositoryToken(Order), useValue: {} },",
   "n": 26
  },
  {
   "t": "      { provide: DataSource, useValue: dataSource },",
   "n": 27
  },
  {
   "t": "    ],",
   "n": 28
  },
  {
   "t": "  }).compile();",
   "n": 29
  },
  {
   "t": "  service = mod.get(OrderService);",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "describe('OrderService.place', () => {",
   "n": 33
  },
  {
   "t": "  it(\"telefon yo'q — darhol xato\", () => {",
   "n": 34
  },
  {
   "t": "    expect(() => service.place({ id: 1, phone: null } as User, cart)).toThrow(",
   "n": 35
  },
  {
   "t": "      \"Telefon raqami yo'q\",",
   "n": 36
  },
  {
   "t": "    );",
   "n": 37
  },
  {
   "t": "  });",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "  it(\"savat bo'sh — darhol xato\", () => {",
   "n": 40
  },
  {
   "t": "    expect(() => service.place(user, [])).toThrow(\"Savat bo'sh\");",
   "n": 41
  },
  {
   "t": "  });",
   "n": 42
  },
  {
   "t": "",
   "n": 43
  },
  {
   "t": "  it(\"omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\", async () => {",
   "n": 44
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 45
  },
  {
   "t": "      id: 4,",
   "n": 46
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 47
  },
  {
   "t": "      stock: 1,",
   "n": 48
  },
  {
   "t": "      price: 50000,",
   "n": 49
  },
  {
   "t": "    });",
   "n": 50
  },
  {
   "t": "    await expect(service.place(user, cart)).rejects.toThrow(",
   "n": 51
  },
  {
   "t": "      'Kolonka: omborda faqat 1 ta qoldi',",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "    expect(manager.query).not.toHaveBeenCalled();",
   "n": 54
  },
  {
   "t": "  });",
   "n": 55
  },
  {
   "t": "",
   "n": 56
  },
  {
   "t": "  it('yetarli — jami narx hisoblanadi', async () => {",
   "n": 57
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 58
  },
  {
   "t": "      id: 4,",
   "n": 59
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 60
  },
  {
   "t": "      stock: 10,",
   "n": 61
  },
  {
   "t": "      price: 50000,",
   "n": 62
  },
  {
   "t": "    });",
   "n": 63
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 64
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 65
  },
  {
   "t": "    expect(manager.query).toHaveBeenCalledTimes(1);",
   "n": 66
  },
  {
   "t": "  });",
   "n": 67
  },
  {
   "t": "});",
   "n": 68
  }
 ]
};
const KOD_SPEC_ORDER_06 = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 1
  },
  {
   "t": "import { getRepositoryToken } from '@nestjs/typeorm';",
   "n": 2
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 3
  },
  {
   "t": "import { Order, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { OrderService } from './order.service';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "// Baza o'rniga soxta (mock) EntityManager: findOne mahsulotni qaytaradi, query va save — yozib qoladi",
   "n": 7
  },
  {
   "t": "const manager = {",
   "n": 8
  },
  {
   "t": "  findOne: jest.fn(),",
   "n": 9
  },
  {
   "t": "  query: jest.fn(),",
   "n": 10
  },
  {
   "t": "  create: jest.fn((_cls, data) => data),",
   "n": 11
  },
  {
   "t": "  save: jest.fn(async (o) => ({ id: 1, ...o })),",
   "n": 12
  },
  {
   "t": "  delete: jest.fn(),",
   "n": 13
  },
  {
   "t": "};",
   "n": 14
  },
  {
   "t": "const dataSource = { transaction: jest.fn((cb) => cb(manager)) };",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "const user = { id: 1, phone: '+998901234567' } as User;",
   "n": 17
  },
  {
   "t": "const cart = [{ product: { id: 4, name: 'Kolonka' }, qty: 2 }] as any;",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "let service: OrderService;",
   "n": 20
  },
  {
   "t": "beforeEach(async () => {",
   "n": 21
  },
  {
   "t": "  jest.clearAllMocks();",
   "n": 22
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 23
  },
  {
   "t": "    providers: [",
   "n": 24
  },
  {
   "t": "      OrderService,",
   "n": 25
  },
  {
   "t": "      { provide: getRepositoryToken(Order), useValue: {} },",
   "n": 26
  },
  {
   "t": "      { provide: DataSource, useValue: dataSource },",
   "n": 27
  },
  {
   "t": "    ],",
   "n": 28
  },
  {
   "t": "  }).compile();",
   "n": 29
  },
  {
   "t": "  service = mod.get(OrderService);",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "describe('OrderService.place', () => {",
   "n": 33
  },
  {
   "t": "  it(\"telefon yo'q — darhol xato\", async () => {",
   "n": 34
  },
  {
   "t": "    await expect(",
   "n": 35
  },
  {
   "t": "      service.place({ id: 1, phone: null } as User, cart),",
   "n": 36
  },
  {
   "t": "    ).rejects.toThrow(\"Telefon raqami yo'q\");",
   "n": 37
  },
  {
   "t": "  });",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "  it(\"savat bo'sh — darhol xato\", () => {",
   "n": 40
  },
  {
   "t": "    expect(() => service.place(user, [])).toThrow(\"Savat bo'sh\");",
   "n": 41
  },
  {
   "t": "  });",
   "n": 42
  },
  {
   "t": "",
   "n": 43
  },
  {
   "t": "  it(\"omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\", async () => {",
   "n": 44
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 45
  },
  {
   "t": "      id: 4,",
   "n": 46
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 47
  },
  {
   "t": "      stock: 1,",
   "n": 48
  },
  {
   "t": "      price: 50000,",
   "n": 49
  },
  {
   "t": "    });",
   "n": 50
  },
  {
   "t": "    await expect(service.place(user, cart)).rejects.toThrow(",
   "n": 51
  },
  {
   "t": "      'Kolonka: omborda faqat 1 ta qoldi',",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "    expect(manager.query).not.toHaveBeenCalled();",
   "n": 54
  },
  {
   "t": "  });",
   "n": 55
  },
  {
   "t": "",
   "n": 56
  },
  {
   "t": "  it('yetarli — jami narx hisoblanadi', async () => {",
   "n": 57
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 58
  },
  {
   "t": "      id: 4,",
   "n": 59
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 60
  },
  {
   "t": "      stock: 10,",
   "n": 61
  },
  {
   "t": "      price: 50000,",
   "n": 62
  },
  {
   "t": "    });",
   "n": 63
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 64
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 65
  },
  {
   "t": "    expect(manager.query).toHaveBeenCalledTimes(1);",
   "n": 66
  },
  {
   "t": "  });",
   "n": 67
  },
  {
   "t": "});",
   "n": 68
  }
 ]
};
const KOD_SPEC_ORDER_07 = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 1
  },
  {
   "t": "import { getRepositoryToken } from '@nestjs/typeorm';",
   "n": 2
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 3
  },
  {
   "t": "import { Order, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { OrderService } from './order.service';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "// Baza o'rniga soxta (mock) EntityManager: findOne mahsulotni qaytaradi, query va save — yozib qoladi",
   "n": 7
  },
  {
   "t": "const manager = {",
   "n": 8
  },
  {
   "t": "  findOne: jest.fn(),",
   "n": 9
  },
  {
   "t": "  query: jest.fn(),",
   "n": 10
  },
  {
   "t": "  create: jest.fn((_cls, data) => data),",
   "n": 11
  },
  {
   "t": "  save: jest.fn(async (o) => ({ id: 1, ...o })),",
   "n": 12
  },
  {
   "t": "  delete: jest.fn(),",
   "n": 13
  },
  {
   "t": "};",
   "n": 14
  },
  {
   "t": "const dataSource = { transaction: jest.fn((cb) => cb(manager)) };",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "const user = { id: 1, phone: '+998901234567' } as User;",
   "n": 17
  },
  {
   "t": "const cart = [{ product: { id: 4, name: 'Kolonka' }, qty: 2 }] as any;",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "let service: OrderService;",
   "n": 20
  },
  {
   "t": "beforeEach(async () => {",
   "n": 21
  },
  {
   "t": "  jest.clearAllMocks();",
   "n": 22
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 23
  },
  {
   "t": "    providers: [",
   "n": 24
  },
  {
   "t": "      OrderService,",
   "n": 25
  },
  {
   "t": "      { provide: getRepositoryToken(Order), useValue: {} },",
   "n": 26
  },
  {
   "t": "      { provide: DataSource, useValue: dataSource },",
   "n": 27
  },
  {
   "t": "    ],",
   "n": 28
  },
  {
   "t": "  }).compile();",
   "n": 29
  },
  {
   "t": "  service = mod.get(OrderService);",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "describe('OrderService.place', () => {",
   "n": 33
  },
  {
   "t": "  it(\"telefon yo'q — darhol xato\", () => {",
   "n": 34
  },
  {
   "t": "    expect(() => service.place({ id: 1, phone: null } as User, cart)).toThrow(",
   "n": 35
  },
  {
   "t": "      \"Telefon raqami yo'q\",",
   "n": 36
  },
  {
   "t": "    );",
   "n": 37
  },
  {
   "t": "  });",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "  it(\"savat bo'sh — darhol xato\", () => {",
   "n": 40
  },
  {
   "t": "    expect(() => service.place(user, [])).toThrow(\"Savat bo'sh\");",
   "n": 41
  },
  {
   "t": "  });",
   "n": 42
  },
  {
   "t": "",
   "n": 43
  },
  {
   "t": "  it(\"omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\", async () => {",
   "n": 44
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 45
  },
  {
   "t": "      id: 4,",
   "n": 46
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 47
  },
  {
   "t": "      stock: 1,",
   "n": 48
  },
  {
   "t": "      price: 50000,",
   "n": 49
  },
  {
   "t": "    });",
   "n": 50
  },
  {
   "t": "    expect(() => service.place(user, cart)).toThrow(",
   "n": 51
  },
  {
   "t": "      'Kolonka: omborda faqat 1 ta qoldi',",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "    expect(manager.query).not.toHaveBeenCalled();",
   "n": 54
  },
  {
   "t": "  });",
   "n": 55
  },
  {
   "t": "",
   "n": 56
  },
  {
   "t": "  it('yetarli — jami narx hisoblanadi', async () => {",
   "n": 57
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 58
  },
  {
   "t": "      id: 4,",
   "n": 59
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 60
  },
  {
   "t": "      stock: 10,",
   "n": 61
  },
  {
   "t": "      price: 50000,",
   "n": 62
  },
  {
   "t": "    });",
   "n": 63
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 64
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 65
  },
  {
   "t": "    expect(manager.query).toHaveBeenCalledTimes(1);",
   "n": 66
  },
  {
   "t": "  });",
   "n": 67
  },
  {
   "t": "});",
   "n": 68
  }
 ]
};
const KOD_SPEC_ORDER_08 = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 1
  },
  {
   "t": "import { getRepositoryToken } from '@nestjs/typeorm';",
   "n": 2
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 3
  },
  {
   "t": "import { Order, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { OrderService } from './order.service';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "// Baza o'rniga soxta (mock) EntityManager: findOne mahsulotni qaytaradi, query va save — yozib qoladi",
   "n": 7
  },
  {
   "t": "const manager = {",
   "n": 8
  },
  {
   "t": "  findOne: jest.fn(),",
   "n": 9
  },
  {
   "t": "  query: jest.fn(),",
   "n": 10
  },
  {
   "t": "  create: jest.fn((_cls, data) => data),",
   "n": 11
  },
  {
   "t": "  save: jest.fn(async (o) => ({ id: 1, ...o })),",
   "n": 12
  },
  {
   "t": "  delete: jest.fn(),",
   "n": 13
  },
  {
   "t": "};",
   "n": 14
  },
  {
   "t": "const dataSource = { transaction: jest.fn((cb) => cb(manager)) };",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "const user = { id: 1, phone: '+998901234567' } as User;",
   "n": 17
  },
  {
   "t": "const cart = [{ product: { id: 4, name: 'Kolonka' }, qty: 2 }] as any;",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "let service: OrderService;",
   "n": 20
  },
  {
   "t": "beforeEach(async () => {",
   "n": 21
  },
  {
   "t": "  jest.clearAllMocks();",
   "n": 22
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 23
  },
  {
   "t": "    providers: [",
   "n": 24
  },
  {
   "t": "      OrderService,",
   "n": 25
  },
  {
   "t": "      { provide: getRepositoryToken(Order), useValue: {} },",
   "n": 26
  },
  {
   "t": "      { provide: DataSource, useValue: dataSource },",
   "n": 27
  },
  {
   "t": "    ],",
   "n": 28
  },
  {
   "t": "  }).compile();",
   "n": 29
  },
  {
   "t": "  service = mod.get(OrderService);",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "describe('OrderService.place', () => {",
   "n": 33
  },
  {
   "t": "  it(\"telefon yo'q — darhol xato\", () => {",
   "n": 34
  },
  {
   "t": "    expect(() => service.place({ id: 1, phone: null } as User, cart)).toThrow(",
   "n": 35
  },
  {
   "t": "      \"Telefon raqami yo'q\",",
   "n": 36
  },
  {
   "t": "    );",
   "n": 37
  },
  {
   "t": "  });",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "  it(\"savat bo'sh — darhol xato\", () => {",
   "n": 40
  },
  {
   "t": "    expect(() => service.place(user, [])).toThrow(\"Savat bo'sh\");",
   "n": 41
  },
  {
   "t": "  });",
   "n": 42
  },
  {
   "t": "",
   "n": 43
  },
  {
   "t": "  it(\"omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\", async () => {",
   "n": 44
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 45
  },
  {
   "t": "      id: 4,",
   "n": 46
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 47
  },
  {
   "t": "      stock: 1,",
   "n": 48
  },
  {
   "t": "      price: 50000,",
   "n": 49
  },
  {
   "t": "    });",
   "n": 50
  },
  {
   "t": "    expect(service.place(user, cart)).rejects.toThrow(",
   "n": 51
  },
  {
   "t": "      'Planshet: omborda faqat 9 ta qoldi',",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "  });",
   "n": 54
  },
  {
   "t": "",
   "n": 55
  },
  {
   "t": "  it('yetarli — jami narx hisoblanadi', async () => {",
   "n": 56
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 57
  },
  {
   "t": "      id: 4,",
   "n": 58
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 59
  },
  {
   "t": "      stock: 10,",
   "n": 60
  },
  {
   "t": "      price: 50000,",
   "n": 61
  },
  {
   "t": "    });",
   "n": 62
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 63
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 64
  },
  {
   "t": "    expect(manager.query).toHaveBeenCalledTimes(1);",
   "n": 65
  },
  {
   "t": "  });",
   "n": 66
  },
  {
   "t": "});",
   "n": 67
  }
 ]
};
const KOD_SPEC_ORDER_08B = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 1
  },
  {
   "t": "import { getRepositoryToken } from '@nestjs/typeorm';",
   "n": 2
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 3
  },
  {
   "t": "import { Order, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { OrderService } from './order.service';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "// Baza o'rniga soxta (mock) EntityManager: findOne mahsulotni qaytaradi, query va save — yozib qoladi",
   "n": 7
  },
  {
   "t": "const manager = {",
   "n": 8
  },
  {
   "t": "  findOne: jest.fn(),",
   "n": 9
  },
  {
   "t": "  query: jest.fn(),",
   "n": 10
  },
  {
   "t": "  create: jest.fn((_cls, data) => data),",
   "n": 11
  },
  {
   "t": "  save: jest.fn(async (o) => ({ id: 1, ...o })),",
   "n": 12
  },
  {
   "t": "  delete: jest.fn(),",
   "n": 13
  },
  {
   "t": "};",
   "n": 14
  },
  {
   "t": "const dataSource = { transaction: jest.fn((cb) => cb(manager)) };",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "const user = { id: 1, phone: '+998901234567' } as User;",
   "n": 17
  },
  {
   "t": "const cart = [{ product: { id: 4, name: 'Kolonka' }, qty: 2 }] as any;",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "let service: OrderService;",
   "n": 20
  },
  {
   "t": "beforeEach(async () => {",
   "n": 21
  },
  {
   "t": "  jest.clearAllMocks();",
   "n": 22
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 23
  },
  {
   "t": "    providers: [",
   "n": 24
  },
  {
   "t": "      OrderService,",
   "n": 25
  },
  {
   "t": "      { provide: getRepositoryToken(Order), useValue: {} },",
   "n": 26
  },
  {
   "t": "      { provide: DataSource, useValue: dataSource },",
   "n": 27
  },
  {
   "t": "    ],",
   "n": 28
  },
  {
   "t": "  }).compile();",
   "n": 29
  },
  {
   "t": "  service = mod.get(OrderService);",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "describe('OrderService.place', () => {",
   "n": 33
  },
  {
   "t": "  it(\"telefon yo'q — darhol xato\", () => {",
   "n": 34
  },
  {
   "t": "    expect(() => service.place({ id: 1, phone: null } as User, cart)).toThrow(",
   "n": 35
  },
  {
   "t": "      \"Telefon raqami yo'q\",",
   "n": 36
  },
  {
   "t": "    );",
   "n": 37
  },
  {
   "t": "  });",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "  it(\"savat bo'sh — darhol xato\", () => {",
   "n": 40
  },
  {
   "t": "    expect(() => service.place(user, [])).toThrow(\"Savat bo'sh\");",
   "n": 41
  },
  {
   "t": "  });",
   "n": 42
  },
  {
   "t": "",
   "n": 43
  },
  {
   "t": "  it(\"omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\", async () => {",
   "n": 44
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 45
  },
  {
   "t": "      id: 4,",
   "n": 46
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 47
  },
  {
   "t": "      stock: 1,",
   "n": 48
  },
  {
   "t": "      price: 50000,",
   "n": 49
  },
  {
   "t": "    });",
   "n": 50
  },
  {
   "t": "    await expect(service.place(user, cart)).rejects.toThrow(",
   "n": 51
  },
  {
   "t": "      'Planshet: omborda faqat 9 ta qoldi',",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "    expect(manager.query).not.toHaveBeenCalled();",
   "n": 54
  },
  {
   "t": "  });",
   "n": 55
  },
  {
   "t": "",
   "n": 56
  },
  {
   "t": "  it('yetarli — jami narx hisoblanadi', async () => {",
   "n": 57
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 58
  },
  {
   "t": "      id: 4,",
   "n": 59
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 60
  },
  {
   "t": "      stock: 10,",
   "n": 61
  },
  {
   "t": "      price: 50000,",
   "n": 62
  },
  {
   "t": "    });",
   "n": 63
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 64
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 65
  },
  {
   "t": "    expect(manager.query).toHaveBeenCalledTimes(1);",
   "n": 66
  },
  {
   "t": "  });",
   "n": 67
  },
  {
   "t": "});",
   "n": 68
  }
 ]
};
const KOD_SPEC_ORDER_10 = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Test } from '@nestjs/testing';",
   "n": 1
  },
  {
   "t": "import { getRepositoryToken } from '@nestjs/typeorm';",
   "n": 2
  },
  {
   "t": "import { DataSource } from 'typeorm';",
   "n": 3
  },
  {
   "t": "import { Order, User } from '../../core/entity';",
   "n": 4
  },
  {
   "t": "import { OrderService } from './order.service';",
   "n": 5
  },
  {
   "t": "",
   "n": 6
  },
  {
   "t": "// Baza o'rniga soxta (mock) EntityManager: findOne mahsulotni qaytaradi, query va save — yozib qoladi",
   "n": 7
  },
  {
   "t": "const manager = {",
   "n": 8
  },
  {
   "t": "  findOne: jest.fn(),",
   "n": 9
  },
  {
   "t": "  query: jest.fn(),",
   "n": 10
  },
  {
   "t": "  create: jest.fn((_cls, data) => data),",
   "n": 11
  },
  {
   "t": "  save: jest.fn(async (o) => ({ id: 1, ...o })),",
   "n": 12
  },
  {
   "t": "  delete: jest.fn(),",
   "n": 13
  },
  {
   "t": "};",
   "n": 14
  },
  {
   "t": "const dataSource = { transaction: jest.fn((cb) => cb(manager)) };",
   "n": 15
  },
  {
   "t": "",
   "n": 16
  },
  {
   "t": "const user = { id: 1, phone: '+998901234567' } as User;",
   "n": 17
  },
  {
   "t": "const cart = [{ product: { id: 4, name: 'Kolonka' }, qty: 2 }] as any;",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "let service: OrderService;",
   "n": 20
  },
  {
   "t": "beforeEach(async () => {",
   "n": 21
  },
  {
   "t": "  jest.clearAllMocks();",
   "n": 22
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 23
  },
  {
   "t": "    providers: [",
   "n": 24
  },
  {
   "t": "      OrderService,",
   "n": 25
  },
  {
   "t": "      { provide: getRepositoryToken(Order), useValue: {} },",
   "n": 26
  },
  {
   "t": "      { provide: DataSource, useValue: dataSource },",
   "n": 27
  },
  {
   "t": "    ],",
   "n": 28
  },
  {
   "t": "  }).compile();",
   "n": 29
  },
  {
   "t": "  service = mod.get(OrderService);",
   "n": 30
  },
  {
   "t": "});",
   "n": 31
  },
  {
   "t": "",
   "n": 32
  },
  {
   "t": "describe('OrderService.place', () => {",
   "n": 33
  },
  {
   "t": "  it(\"telefon yo'q — darhol xato\", () => {",
   "n": 34
  },
  {
   "t": "    expect(() => service.place({ id: 1, phone: null } as User, cart)).toThrow(",
   "n": 35
  },
  {
   "t": "      \"Telefon raqami yo'q\",",
   "n": 36
  },
  {
   "t": "    );",
   "n": 37
  },
  {
   "t": "  });",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "  it(\"savat bo'sh — darhol xato\", () => {",
   "n": 40
  },
  {
   "t": "    expect(() => service.place(user, [])).toThrow(\"Savat bo'sh\");",
   "n": 41
  },
  {
   "t": "  });",
   "n": 42
  },
  {
   "t": "",
   "n": 43
  },
  {
   "t": "  it(\"omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\", async () => {",
   "n": 44
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 45
  },
  {
   "t": "      id: 4,",
   "n": 46
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 47
  },
  {
   "t": "      stock: 1,",
   "n": 48
  },
  {
   "t": "      price: 50000,",
   "n": 49
  },
  {
   "t": "    });",
   "n": 50
  },
  {
   "t": "    await expect(service.place(user, cart)).rejects.toThrow(",
   "n": 51
  },
  {
   "t": "      'Kolonka: omborda faqat 1 ta qoldi',",
   "n": 52
  },
  {
   "t": "    );",
   "n": 53
  },
  {
   "t": "    expect(manager.query).not.toHaveBeenCalled();",
   "n": 54
  },
  {
   "t": "  });",
   "n": 55
  },
  {
   "t": "",
   "n": 56
  },
  {
   "t": "  it('yetarli — jami narx hisoblanadi', async () => {",
   "n": 57
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 58
  },
  {
   "t": "      id: 4,",
   "n": 59
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 60
  },
  {
   "t": "      stock: 10,",
   "n": 61
  },
  {
   "t": "      price: 50000,",
   "n": 62
  },
  {
   "t": "    });",
   "n": 63
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 64
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 65
  },
  {
   "t": "    expect(manager.query).toHaveBeenCalledTimes(1);",
   "n": 66
  },
  {
   "t": "  });",
   "n": 67
  },
  {
   "t": "",
   "n": 68
  },
  {
   "t": "  it(\"chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi\", async () => {",
   "n": 69
  },
  {
   "t": "    manager.findOne.mockResolvedValue({",
   "n": 70
  },
  {
   "t": "      id: 4,",
   "n": 71
  },
  {
   "t": "      name: 'Kolonka',",
   "n": 72
  },
  {
   "t": "      stock: 2,",
   "n": 73
  },
  {
   "t": "      price: 50000,",
   "n": 74
  },
  {
   "t": "    });",
   "n": 75
  },
  {
   "t": "    const order = await service.place(user, cart);",
   "n": 76
  },
  {
   "t": "    expect(order.total).toBe(100000);",
   "n": 77
  },
  {
   "t": "  });",
   "n": 78
  },
  {
   "t": "});",
   "n": 79
  }
 ]
};
const KOD_APP_CTRL = {
 "file": "src/api/app.controller.ts",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "import { Controller, Get } from '@nestjs/common';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "@Controller()",
   "n": 3
  },
  {
   "t": "export class AppController {",
   "n": 4
  },
  {
   "t": "  // Hosting \"tirikmi?\" deb shu manzilni tekshiradi",
   "n": 5
  },
  {
   "t": "  @Get()",
   "n": 6
  },
  {
   "t": "  health() {",
   "n": 7
  },
  {
   "t": "    return { ok: true, service: 'order-bot' };",
   "n": 8
  },
  {
   "t": "  }",
   "n": 9
  },
  {
   "t": "}",
   "n": 10
  }
 ]
};
const KOD_SPEC_APP = {
 "file": "src/api/app.controller.spec.ts",
 "tag": "chiqish",
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
   "t": "import { AppController } from './app.controller';",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "let app: INestApplication;",
   "n": 6
  },
  {
   "t": "beforeAll(async () => {",
   "n": 7
  },
  {
   "t": "  const mod = await Test.createTestingModule({",
   "n": 8
  },
  {
   "t": "    controllers: [AppController],",
   "n": 9
  },
  {
   "t": "  }).compile();",
   "n": 10
  },
  {
   "t": "  app = mod.createNestApplication();",
   "n": 11
  },
  {
   "t": "  await app.init();",
   "n": 12
  },
  {
   "t": "});",
   "n": 13
  },
  {
   "t": "afterAll(() => app.close());",
   "n": 14
  },
  {
   "t": "",
   "n": 15
  },
  {
   "t": "describe('HTTP: GET /', () => {",
   "n": 16
  },
  {
   "t": "  it('200 va { ok: true }', async () => {",
   "n": 17
  },
  {
   "t": "    const res = await request(app.getHttpServer()).get('/');",
   "n": 18
  },
  {
   "t": "    expect(res.status).toBe(200);",
   "n": 19
  },
  {
   "t": "    expect(res.body).toEqual({ ok: true, service: 'order-bot' });",
   "n": 20
  },
  {
   "t": "  });",
   "n": 21
  },
  {
   "t": "",
   "n": 22
  },
  {
   "t": "  it(\"yo'q manzil — 404\", async () => {",
   "n": 23
  },
  {
   "t": "    const res = await request(app.getHttpServer()).get('/nope');",
   "n": 24
  },
  {
   "t": "    expect(res.status).toBe(404);",
   "n": 25
  },
  {
   "t": "    expect(res.body.message).toBe('Cannot GET /nope');",
   "n": 26
  },
  {
   "t": "  });",
   "n": 27
  },
  {
   "t": "});",
   "n": 28
  }
 ]
};
const KOD_AI1_ORDER = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "    const { service, ds } = setup([product(1, 5)]);",
   "n": 44
  },
  {
   "t": "    await expect(",
   "n": 45
  },
  {
   "t": "      run(service, user(phone), [line(product(1, 5), 1)]),",
   "n": 46
  },
  {
   "t": "    ).rejects.toThrow(\"Telefon raqami yo'q\");",
   "n": 47
  },
  {
   "t": "    expect(ds.transaction).not.toHaveBeenCalled();",
   "n": 48
  }
 ]
};
const KOD_AI1_TEL = {
 "file": "src/api/telegram/telegram.service.phone.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "    ['faqat probel', '   '],",
   "n": 84
  },
  {
   "t": "    ['8 raqam (bittasi kam)', '12345678'],",
   "n": 85
  },
  {
   "t": "    ['14 raqam (bittasi ortiq)', '+12345678901234'],",
   "n": 86
  },
  {
   "t": "    ['faqat +', '+'],",
   "n": 87
  },
  {
   "t": "    ['ikkita +', '++998901234567'],",
   "n": 88
  },
  {
   "t": "    ['+ oxirida', '998901234567+'],",
   "n": 89
  },
  {
   "t": "    [\"o'rtada probel\", '+998 90 123 45 67'],",
   "n": 90
  },
  {
   "t": "    ['chiziqcha', '+998-90-123-45-67'],",
   "n": 91
  },
  {
   "t": "    ['qavs', '+998(90)1234567'],",
   "n": 92
  },
  {
   "t": "    ['harf', '+99890123456a'],",
   "n": 93
  },
  {
   "t": "    ['matn', \"raqamim yo'q\"],",
   "n": 94
  },
  {
   "t": "    [\"o'rtada qator ko'chishi\", '+998901\\n234567'],",
   "n": 95
  },
  {
   "t": "    ['arabcha raqamlar', '٩٩٨٩٠١٢٣٤٥٦٧'],",
   "n": 96
  }
 ]
};
const KOD_AI2_ORDER = {
 "file": "src/api/order/order.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "    const p = product(1, 'Non', 5000, 10);",
   "n": 33
  },
  {
   "t": "    const { service, ds } = setup({ 1: p });",
   "n": 34
  },
  {
   "t": "    expect(() => service.place(user({ phone: null }), [cartItem(p, 1)])).toThrow(",
   "n": 35
  },
  {
   "t": "      \"Telefon raqami yo'q\",",
   "n": 36
  },
  {
   "t": "    );",
   "n": 37
  },
  {
   "t": "    expect(ds.transaction).not.toHaveBeenCalled();",
   "n": 38
  }
 ]
};
const KOD_AI2_TEL = {
 "file": "src/api/telegram/telegram.service.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "  const cart = { list: jest.fn(async () => [{ product: { price: 1, id: 1 }, qty: 1 }]) };",
   "n": 18
  },
  {
   "t": "  const order = { id: 5 } as Order;",
   "n": 19
  },
  {
   "t": "  const orders = { place: jest.fn(async () => order) };",
   "n": 20
  },
  {
   "t": "  const service = new TelegramService(users as never, {} as never, cart as never, orders as never);",
   "n": 21
  },
  {
   "t": "  const bot = { telegram: { sendMessage: jest.fn(async () => ({})) } };",
   "n": 22
  }
 ]
};
const KOD_OUT_00 = "v24.18.0\nHEAD 9d6b947 jest1-done: birinchi unit-testlar — som (bo'l\njest 30.5.2\nts-jest 29.4.15\n@nestjs/testing 11.2.8\ntypescript 5.9.3";
const KOD_OUT_01 = "# telegram.service.ts ichida:\n12:const PHONE = /^\\+?\\d{9,13}$/;\n104:        await this.users.setState(user, 'WAITING_PHONE');\n155:    if (user.state === 'WAITING_PHONE') {\n157:      if (!PHONE.test(phone)) return ctx.reply(texts.badPhone);";
const KOD_OUT_02 = "$ npx jest phone --verbose\nFAIL src/api/telegram/phone.spec.ts\n  isPhone\n    ✓ +998901234567 — to'g'ri raqam (2 ms)\n    ✓ 998901234567 — to'g'ri raqam\n    ✓ 12345678 — 8 ta raqam — qisqa\n    ✓ +99890123456789 — 14 ta raqam — uzun\n    ✓ abc — harf\n    ✓  — bo'sh\n    ✕ mijoz probel bilan yozadi (2 ms)\n\n  ● isPhone › mijoz probel bilan yozadi\n\n    expect(received).toBe(expected) // Object.is equality\n\n    Expected: true\n    Received: false\n\n      16 |\n      17 |   it('mijoz probel bilan yozadi', () => {\n    > 18 |     expect(isPhone('+998 90 123 45 67')).toBe(true);\n         |                                          ^\n      19 |   });\n      20 | });\n      21 |\n\n      at Object.<anonymous> (api/telegram/phone.spec.ts:18:42)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 6 passed, 7 total\nSnapshots:   0 total\nTime:        0.408 s, estimated 1 s\nRan all test suites matching phone.\n[chiqish kodi: 1]";
const KOD_OUT_03 = "$ npx jest phone --verbose\nPASS src/api/telegram/phone.spec.ts\n  isPhone\n    ✓ +998901234567 — to'g'ri raqam (2 ms)\n    ✓ 998901234567 — to'g'ri raqam (1 ms)\n    ✓ 12345678 — 8 ta raqam — qisqa\n    ✓ +99890123456789 — 14 ta raqam — uzun\n    ✓ abc — harf\n    ✓  — bo'sh (1 ms)\n    ✓ mijoz probel bilan yozadi\n\nTest Suites: 1 passed, 1 total\nTests:       7 passed, 7 total\nSnapshots:   0 total\nTime:        0.385 s, estimated 1 s\nRan all test suites matching phone.\n[chiqish kodi: 0]";
const KOD_OUT_04 = "$ npx jest phone --verbose\nPASS src/api/telegram/phone.spec.ts\n  isPhone\n    ✓ +998901234567 — to'g'ri raqam (2 ms)\n    ✓ 998901234567 — to'g'ri raqam (1 ms)\n    ✓ 12345678 — 8 ta raqam — qisqa (1 ms)\n    ✓ +99890123456789 — 14 ta raqam — uzun\n    ✓ abc — harf (1 ms)\n    ✓  — bo'sh\n    ✓ mijoz probel bilan yozadi (1 ms)\n  isPhone — qoida nimani o'tkazib yuboradi\n    ✓ 9 ta nol ham o'tadi\n\nTest Suites: 1 passed, 1 total\nTests:       8 passed, 8 total\nSnapshots:   0 total\nTime:        0.389 s, estimated 1 s\nRan all test suites matching phone.\n[chiqish kodi: 0]";
const KOD_OUT_05 = "$ npx jest order.service --verbose\nPASS src/api/order/order.service.spec.ts\n  OrderService.place\n    ✓ telefon yo'q — darhol xato (19 ms)\n    ✓ savat bo'sh — darhol xato (3 ms)\n    ✓ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (3 ms)\n    ✓ yetarli — jami narx hisoblanadi (3 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       4 passed, 4 total\nSnapshots:   0 total\nTime:        0.791 s, estimated 1 s\nRan all test suites matching order.service.\n[chiqish kodi: 0]";
const KOD_OUT_06 = "$ npx jest order.service -t telefon\nFAIL src/api/order/order.service.spec.ts\n  OrderService.place\n    ✕ telefon yo'q — darhol xato (11 ms)\n    ○ skipped savat bo'sh — darhol xato\n    ○ skipped omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\n    ○ skipped yetarli — jami narx hisoblanadi\n\n  ● OrderService.place › telefon yo'q — darhol xato\n\n    Telefon raqami yo'q\n\n      23 |   // CHECK (stock >= 0) rad etadi — ikki mijoz bir vaqtda bossa ham ortiqcha sotilmaydi.\n      24 |   place(user: User, cart: CartItem[]): Promise<Order> {\n    > 25 |     if (!user.phone) throw new Error(\"Telefon raqami yo'q\");\n         |                            ^\n      26 |     if (cart.length === 0) throw new Error(\"Savat bo'sh\");\n      27 |     return this.ds.transaction(async (m) => {\n      28 |       const items: OrderItem[] = [];\n\n      at OrderService.place (api/order/order.service.ts:25:28)\n      at Object.<anonymous> (api/order/order.service.spec.ts:36:15)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 3 skipped, 4 total\nSnapshots:   0 total\nTime:        0.812 s, estimated 1 s\nRan all test suites matching order.service with tests matching \"telefon\".\n[chiqish kodi: 1]";
const KOD_OUT_07 = "$ npx jest order.service -t omborda\n…/OrderBotNest/src/api/order/order.service.ts:48\n                    throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\n                          ^\n\nError: Kolonka: omborda faqat 1 ta qoldi\n    at …/OrderBotNest/src/api/order/order.service.ts:37:17\n    at processTicksAndRejections (node:internal/process/task_queues:104:5)\n\nNode.js v24.18.0\n[chiqish kodi: 1]";
const KOD_OUT_08 = "$ npx jest order.service -t omborda\n…/OrderBotNest/node_modules/expect/build/index.js:2155\n  const innerErr = new JestAssertionError();\n                   ^\n\nJestAssertionError: expect(received).rejects.toThrow(expected)\n\nExpected substring: \"Planshet: omborda faqat 9 ta qoldi\"\nReceived message:   \"Kolonka: omborda faqat 1 ta qoldi\"\n\n      35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);\n      36 |         if (p.stock < c.qty) {\n    > 37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\n         |                 ^\n      38 |         }\n      39 |         // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.\n      40 |         //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi\n\n      at src/api/order/order.service.ts:37:17\n    at Object.toThrow (…/OrderBotNest/node_modules/expect/build/index.js:2155:20)\n    at Object.<anonymous> (…/OrderBotNest/src/api/order/order.service.spec.ts:51:47)\n    at Promise.finally.completed (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:1834:28)\n    at new Promise (<anonymous>)\n    at callAsyncCircusFn (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:1774:10)\n    at _callCircusTest (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:1167:40)\n    at processTicksAndRejections (node:internal/process/task_queues:104:5)\n    at _runTestInContext (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:1103:3)\n    at runTestWithContext (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:996:5)\n    at _runTestsForDescribeBlockOnce (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:1008:11)\n    at _runTestsForDescribeBlock (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:824:5)\n    at _runTestsForDescribeBlockOnce (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:1003:11)\n    at _runTestsForDescribeBlock (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:824:5)\n    at run (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:789:3)\n    at runAndTransformResultsToJestFormat (…/OrderBotNest/node_modules/jest-circus/build/jestAdapterInit.js:2300:21)\n    at jestAdapter (…/OrderBotNest/node_modules/jest-circus/build/runner.js:111:19)\n    at runTestInternal (…/OrderBotNest/node_modules/jest-runner/build/index.js:247:16)\n    at runTest (…/OrderBotNest/node_modules/jest-runner/build/index.js:315:7) {\n  matcherResult: {\n    message: 'expect(received).rejects.toThrow(expected)\\n' +\n      '\\n' +\n      'Expected substring: \"Planshet: omborda faqat 9 ta qoldi\"\\n' +\n      'Received message:   \"Kolonka: omborda faqat 1 ta qoldi\"\\n' +\n      '\\n' +\n      '      35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);\\n' +\n      '      36 |         if (p.stock < c.qty) {\\n' +\n      '    > 37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\\n' +\n      '         |                 ^\\n' +\n      '      38 |         }\\n' +\n      \"      39 |         // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.\\n\" +\n      \"      40 |         //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi\\n\" +\n      '\\n' +\n      '      at src/api/order/order.service.ts:37:17',\n    pass: false\n  }\n}\n\nNode.js v24.18.0\n[chiqish kodi: 1]";
const KOD_OUT_08B = "$ npx jest order.service -t omborda\nFAIL src/api/order/order.service.spec.ts\n  OrderService.place\n    ✕ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (28 ms)\n    ○ skipped telefon yo'q — darhol xato\n    ○ skipped savat bo'sh — darhol xato\n    ○ skipped yetarli — jami narx hisoblanadi\n\n  ● OrderService.place › omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\n\n    expect(received).rejects.toThrow(expected)\n\n    Expected substring: \"Planshet: omborda faqat 9 ta qoldi\"\n    Received message:   \"Kolonka: omborda faqat 1 ta qoldi\"\n\n          35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);\n          36 |         if (p.stock < c.qty) {\n        > 37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\n             |                 ^\n          38 |         }\n          39 |         // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.\n          40 |         //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi\n\n      at api/order/order.service.ts:37:17\n      at Object.<anonymous> (api/order/order.service.spec.ts:51:5)\n      at Object.<anonymous> (api/order/order.service.spec.ts:51:53)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 3 skipped, 4 total\nSnapshots:   0 total\nTime:        0.733 s, estimated 1 s\nRan all test suites matching order.service with tests matching \"omborda\".\n[chiqish kodi: 1]";
const KOD_OUT_09 = "36:        if (p.stock <= c.qty) {\n\n$ npx jest order.service\nPASS src/api/order/order.service.spec.ts\n  OrderService.place\n    ✓ telefon yo'q — darhol xato (25 ms)\n    ✓ savat bo'sh — darhol xato (3 ms)\n    ✓ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (3 ms)\n    ✓ yetarli — jami narx hisoblanadi (2 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       4 passed, 4 total\nSnapshots:   0 total\nTime:        0.791 s, estimated 1 s\nRan all test suites matching order.service.\n[chiqish kodi: 0]";
const KOD_OUT_09B = "$ npx jest order.service --verbose\nPASS src/api/order/order.service.spec.ts\n  OrderService.place\n    ✓ telefon yo'q — darhol xato (19 ms)\n    ✓ savat bo'sh — darhol xato (2 ms)\n    ✓ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (2 ms)\n    ✓ yetarli — jami narx hisoblanadi (3 ms)\n    ✓ chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi (2 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       5 passed, 5 total\nSnapshots:   0 total\nTime:        0.796 s, estimated 1 s\nRan all test suites matching order.service.\n[chiqish kodi: 0]";
const KOD_OUT_09C = "36:        if (p.stock <= c.qty) {\n\n$ npx jest order.service\nFAIL src/api/order/order.service.spec.ts\n  OrderService.place\n    ✓ telefon yo'q — darhol xato (20 ms)\n    ✓ savat bo'sh — darhol xato (2 ms)\n    ✓ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (2 ms)\n    ✓ yetarli — jami narx hisoblanadi (2 ms)\n    ✕ chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi (2 ms)\n\n  ● OrderService.place › chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi\n\n    Kolonka: omborda faqat 2 ta qoldi\n\n      35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);\n      36 |         if (p.stock <= c.qty) {\n    > 37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\n         |                 ^\n      38 |         }\n      39 |         // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.\n      40 |         //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi\n\n      at api/order/order.service.ts:37:17\n      at Object.<anonymous> (api/order/order.service.spec.ts:76:19)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 4 passed, 5 total\nSnapshots:   0 total\nTime:        0.797 s, estimated 1 s\nRan all test suites matching order.service.\n[chiqish kodi: 1]";
const KOD_OUT_10 = "$ npm i -D supertest @types/supertest\nnpm warn allow-scripts\nnpm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow.\n[chiqish kodi: 0]\nsupertest 7.3.1\n@types/supertest 7.2.1";
const KOD_OUT_11 = "$ npx jest app.controller --verbose\nPASS src/api/app.controller.spec.ts\n  HTTP: GET /\n    ✓ 200 va { ok: true } (39 ms)\n    ✓ yo'q manzil — 404 (12 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       2 passed, 2 total\nSnapshots:   0 total\nTime:        0.766 s, estimated 1 s\nRan all test suites matching app.controller.\n[chiqish kodi: 0]";
const KOD_OUT_12 = "$ npm test -- --verbose\n\n> order-bot-nest@1.0.0 test\n> jest --verbose\n\nPASS src/api/order/order.service.spec.ts\n  OrderService.place\n    ✓ telefon yo'q — darhol xato (20 ms)\n    ✓ savat bo'sh — darhol xato (2 ms)\n    ✓ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (2 ms)\n    ✓ yetarli — jami narx hisoblanadi (2 ms)\n    ✓ chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi (2 ms)\n\nPASS src/api/app.controller.spec.ts\n  HTTP: GET /\n    ✓ 200 va { ok: true } (26 ms)\n    ✓ yo'q manzil — 404 (6 ms)\n\nPASS src/api/telegram/keyboards.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma — Tasdiqlash va Bekor (2 ms)\n    ✓ tasdiqlangan — Yetkazildi va Bekor (1 ms)\n    ✓ yetkazilgan va bekor qilingan — tugma yo'q (1 ms)\n  catalogKeyboard\n    ✓ birinchi sahifada ◀ yo'q (6 ms)\n    ✓ o'rtada ikkalasi bor\n    ✓ oxirgi sahifada ▶ yo'q (1 ms)\n    ✓ bitta sahifa — faqat 1/1\n    ✓ tugagan mahsulot bosilmaydi (1 ms)\n\nPASS src/api/telegram/phone.spec.ts\n  isPhone\n    ✓ +998901234567 — to'g'ri raqam\n    ✓ 998901234567 — to'g'ri raqam\n    ✓ 12345678 — 8 ta raqam — qisqa\n    ✓ +99890123456789 — 14 ta raqam — uzun\n    ✓ abc — harf\n    ✓  — bo'sh\n    ✓ mijoz probel bilan yozadi\n  isPhone — qoida nimani o'tkazib yuboradi\n    ✓ 9 ta nol ham o'tadi\n\nPASS src/api/telegram/texts.spec.ts\n  som\n    ✓ 120000 ni so'mda yozadi (1 ms)\n    ✓ kichik sonda probel yo'q (1 ms)\n\nTest Suites: 5 passed, 5 total\nTests:       25 passed, 25 total\nSnapshots:   0 total\nTime:        1.286 s\nRan all test suites.\n[chiqish kodi: 0]";
const KOD_OUT_13 = " package-lock.json | 277 ++++++++++++++++++++++++++++++++++++++++++++++++++++++\n package.json      |   2 +\n 2 files changed, 279 insertions(+)";
const KOD_OUT_14A = "$ npx jest order.service\nFAIL src/api/order/order.service.spec.ts\n  OrderService.place\n    ✕ telefon yo'q — darhol xato (10 ms)\n    ✕ savat bo'sh — darhol xato (2 ms)\n    ✕ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (2 ms)\n    ✕ yetarli — jami narx hisoblanadi (1 ms)\n\n  ● OrderService.place › telefon yo'q — darhol xato\n\n    Nest can't resolve dependencies of the OrderService (?, DataSource). Please make sure that the argument \"OrderRepository\" at index [0] is available in the RootTestModule module.\n\n    Potential solutions:\n    - Is RootTestModule a valid NestJS module?\n    - If \"OrderRepository\" is a provider, is it part of the current RootTestModule?\n    - If \"OrderRepository\" is exported from a separate @Module, is that module imported within RootTestModule?\n      @Module({\n        imports: [ /* the Module containing \"OrderRepository\" */ ]\n      })\n\n    For more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors\n\n      21 | beforeEach(async () => {\n      22 |   jest.clearAllMocks();\n    > 23 |   const mod = await Test.createTestingModule({\n         |               ^\n      24 |     providers: [\n      25 |       OrderService,\n      26 |       { provide: DataSource, useValue: dataSource },\n\n      at TestingInjector.lookupComponentInParentModules (../node_modules/@nestjs/core/injector/injector.js:327:19)\n          at async Promise.all (index 0)\n          at async Promise.all (index 3)\n          at async Promise.all (index 1)\n      at Object.<anonymous> (api/order/order.service.spec.ts:23:15)\n\n  ● OrderService.place › savat bo'sh — darhol xato\n\n    Nest can't resolve dependencies of the OrderService (?, DataSource). Please make sure that the argument \"OrderRepository\" at index [0] is available in the RootTestModule module.\n\n    Potential solutions:\n    - Is RootTestModule a valid NestJS module?\n    - If \"OrderRepository\" is a provider, is it part of the current RootTestModule?\n    - If \"OrderRepository\" is exported from a separate @Module, is that module imported within RootTestModule?\n      @Module({\n        imports: [ /* the Module containing \"OrderRepository\" */ ]\n      })\n\n    For more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors\n\n      21 | beforeEach(async () => {\n      22 |   jest.clearAllMocks();\n    > 23 |   const mod = await Test.createTestingModule({\n         |               ^\n      24 |     providers: [\n      25 |       OrderService,\n      26 |       { provide: DataSource, useValue: dataSource },\n\n      at TestingInjector.lookupComponentInParentModules (../node_modules/@nestjs/core/injector/injector.js:327:19)\n          at async Promise.all (index 0)\n          at async Promise.all (index 3)\n          at async Promise.all (index 1)\n      at Object.<anonymous> (api/order/order.service.spec.ts:23:15)\n\n  ● OrderService.place › omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\n\n    Nest can't resolve dependencies of the OrderService (?, DataSource). Please make sure that the argument \"OrderRepository\" at index [0] is available in the RootTestModule module.\n\n    Potential solutions:\n    - Is RootTestModule a valid NestJS module?\n    - If \"OrderRepository\" is a provider, is it part of the current RootTestModule?\n    - If \"OrderRepository\" is exported from a separate @Module, is that module imported within RootTestModule?\n      @Module({\n        imports: [ /* the Module containing \"OrderRepository\" */ ]\n      })\n\n    For more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors\n\n      21 | beforeEach(async () => {\n      22 |   jest.clearAllMocks();\n    > 23 |   const mod = await Test.createTestingModule({\n         |               ^\n      24 |     providers: [\n      25 |       OrderService,\n      26 |       { provide: DataSource, useValue: dataSource },\n\n      at TestingInjector.lookupComponentInParentModules (../node_modules/@nestjs/core/injector/injector.js:327:19)\n          at async Promise.all (index 0)\n          at async Promise.all (index 3)\n          at async Promise.all (index 1)\n      at Object.<anonymous> (api/order/order.service.spec.ts:23:15)\n\n  ● OrderService.place › yetarli — jami narx hisoblanadi\n\n    Nest can't resolve dependencies of the OrderService (?, DataSource). Please make sure that the argument \"OrderRepository\" at index [0] is available in the RootTestModule module.\n\n    Potential solutions:\n    - Is RootTestModule a valid NestJS module?\n    - If \"OrderRepository\" is a provider, is it part of the current RootTestModule?\n    - If \"OrderRepository\" is exported from a separate @Module, is that module imported within RootTestModule?\n      @Module({\n        imports: [ /* the Module containing \"OrderRepository\" */ ]\n      })\n\n    For more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors\n\n      21 | beforeEach(async () => {\n      22 |   jest.clearAllMocks();\n    > 23 |   const mod = await Test.createTestingModule({\n         |               ^\n      24 |     providers: [\n      25 |       OrderService,\n      26 |       { provide: DataSource, useValue: dataSource },\n\n      at TestingInjector.lookupComponentInParentModules (../node_modules/@nestjs/core/injector/injector.js:327:19)\n          at async Promise.all (index 0)\n          at async Promise.all (index 3)\n          at async Promise.all (index 1)\n      at Object.<anonymous> (api/order/order.service.spec.ts:23:15)\n\nTest Suites: 1 failed, 1 total\nTests:       4 failed, 4 total\nSnapshots:   0 total\nTime:        0.74 s, estimated 1 s\nRan all test suites matching order.service.\n[chiqish kodi: 1]";
const KOD_OUT_14B = "$ npx jest order.service -t omborda\nFAIL src/api/order/order.service.spec.ts\n  OrderService.place\n    ✕ omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi (29 ms)\n    ○ skipped telefon yo'q — darhol xato\n    ○ skipped savat bo'sh — darhol xato\n    ○ skipped yetarli — jami narx hisoblanadi\n\n  ● OrderService.place › omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi\n\n    expect(received).rejects.toThrow(expected)\n\n    Expected substring: \"Kolonka: omborda faqat 1 ta qoldi\"\n    Received message:   \"Mahsulot topilmadi: Kolonka\"\n\n          33 |           lock: { mode: 'pessimistic_write' },\n          34 |         });\n        > 35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);\n             |                       ^\n          36 |         if (p.stock < c.qty) {\n          37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\n          38 |         }\n\n      at api/order/order.service.ts:35:23\n      at Object.<anonymous> (api/order/order.service.spec.ts:45:5)\n      at Object.<anonymous> (api/order/order.service.spec.ts:45:53)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 3 skipped, 4 total\nSnapshots:   0 total\nTime:        0.807 s, estimated 1 s\nRan all test suites matching order.service with tests matching \"omborda\".\n[chiqish kodi: 1]";
const KOD_AI_DIFF1 = " src/api/order/order.service.spec.ts             | 203 ++++++++++++++++++++++++\n src/api/telegram/telegram.service.phone.spec.ts | 149 +++++++++++++++++\n 2 files changed, 352 insertions(+)";
const KOD_AI_DIFF2 = " src/api/order/order.service.spec.ts       | 142 ++++++++++++++++++++++++++++++\n src/api/telegram/telegram.service.spec.ts |  82 +++++++++++++++++\n 2 files changed, 224 insertions(+)";
const KOD_PROMPT1 = "src/api/order/order.service.ts dagi place funksiyasi va telegram.service.ts dagi telefon raqami tekshiruvi uchun edge case va xato holatlariga jest testlar yozib ber. npm test yashil bo'lsin.";
const KOD_PROMPT2 = "Loyiha: OrderBotNest (NestJS + Telegraf + TypeORM), Jest sozlangan, testlar src/ ichida *.spec.ts; src/api/order/order.service.spec.ts da place uchun mock namunasi bor. Vazifa: OrderService.setStatus(id, status) uchun unit-testlar yoz (src/api/order/order.service.spec.ts ga qo'sh yoki alohida fayl): buyurtma topilmadi → xato; allaqachon CANCELLED bo'lgan buyurtmani yana bekor qilish → xato va increment chaqirilmaydi; CANCELLED qilinganda har mahsulot uchun increment chaqiriladi; CONFIRMED qilinganda increment chaqirilmaydi. Shartlar: baza o'rniga mock (findOneBy, query, increment, save — jest.fn); promise xatosi await expect(…).rejects.toThrow('…') bilan; xato xabarini qo'lda yoz, koddan olma; har it da kamida bitta expect. Tegma: src/ dagi .spec.ts dan boshqa fayllarga. Javobda: qo'shilgan fayllar ro'yxati va npm test natijasi.";
const KOD = { TS_PHONE: KOD_TS_PHONE, TS_ONTEXT: KOD_TS_ONTEXT, TS_IMPORT_NEW: KOD_TS_IMPORT_NEW, TS_ONTEXT_NEW: KOD_TS_ONTEXT_NEW, PHONE_OLD: KOD_PHONE_OLD, PHONE_NEW: KOD_PHONE_NEW, SPEC_PHONE_02: KOD_SPEC_PHONE_02, SPEC_PHONE_04: KOD_SPEC_PHONE_04, ORDER_PLACE: KOD_ORDER_PLACE, ORDER_SETSTATUS: KOD_ORDER_SETSTATUS, SPEC_ORDER_05: KOD_SPEC_ORDER_05, SPEC_ORDER_06: KOD_SPEC_ORDER_06, SPEC_ORDER_07: KOD_SPEC_ORDER_07, SPEC_ORDER_08: KOD_SPEC_ORDER_08, SPEC_ORDER_08B: KOD_SPEC_ORDER_08B, SPEC_ORDER_10: KOD_SPEC_ORDER_10, APP_CTRL: KOD_APP_CTRL, SPEC_APP: KOD_SPEC_APP, AI1_ORDER: KOD_AI1_ORDER, AI1_TEL: KOD_AI1_TEL, AI2_ORDER: KOD_AI2_ORDER, AI2_TEL: KOD_AI2_TEL, OUT: { '00': KOD_OUT_00, '01': KOD_OUT_01, '02': KOD_OUT_02, '03': KOD_OUT_03, '04': KOD_OUT_04, '05': KOD_OUT_05, '06': KOD_OUT_06, '07': KOD_OUT_07, '08': KOD_OUT_08, '08b': KOD_OUT_08B, '09': KOD_OUT_09, '09b': KOD_OUT_09B, '09c': KOD_OUT_09C, '10': KOD_OUT_10, '11': KOD_OUT_11, '12': KOD_OUT_12, '13': KOD_OUT_13, '14a': KOD_OUT_14A, '14b': KOD_OUT_14B }, AI_DIFF1: KOD_AI_DIFF1, AI_DIFF2: KOD_AI_DIFF2, PROMPT1: KOD_PROMPT1, PROMPT2: KOD_PROMPT2 };
