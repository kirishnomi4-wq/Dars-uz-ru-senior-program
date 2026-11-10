
// AVTO: feedback/F-1029-02-mentor-kurs/dev/jest1-kod.py — OrderBotNest teglari va haqiqiy test fayllaridan aynan (qo'lda tahrirlanmaydi)
const KOD_TX_SOM = {
 "file": "src/api/telegram/texts.ts",
 "tag": "jest1-start",
 "lines": [
  {
   "t": "import { CartItem, Order, OrderStatus, Product } from '../../core/entity';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "// 120000 → \"120 000 so'm\"",
   "n": 3
  },
  {
   "t": "export const som = (n: number) => `${n.toLocaleString('ru-RU')} so'm`;",
   "n": 4
  }
 ]
};
const KOD_TX_STATUS = {
 "file": "src/api/telegram/texts.ts",
 "tag": "jest1-start",
 "lines": [
  {
   "t": "export const STATUS_UZ: Record<OrderStatus, string> = {",
   "n": 6
  },
  {
   "t": "  NEW: '🆕 Yangi',",
   "n": 7
  },
  {
   "t": "  CONFIRMED: '✅ Tasdiqlangan',",
   "n": 8
  },
  {
   "t": "  DELIVERED: '🚚 Yetkazilgan',",
   "n": 9
  },
  {
   "t": "  CANCELLED: '❌ Bekor qilingan',",
   "n": 10
  },
  {
   "t": "};",
   "n": 11
  }
 ]
};
const KOD_KB_NAV = {
 "file": "src/api/telegram/keyboards.ts",
 "tag": "jest1-start",
 "lines": [
  {
   "t": "  const nav: ReturnType<typeof Markup.button.callback>[] = [];",
   "n": 18
  },
  {
   "t": "  if (page > 0) nav.push(Markup.button.callback('◀', `page:${page - 1}`));",
   "n": 19
  },
  {
   "t": "  nav.push(Markup.button.callback(`${page + 1}/${pages}`, 'noop'));",
   "n": 20
  },
  {
   "t": "  if (page < pages - 1)",
   "n": 21
  },
  {
   "t": "    nav.push(Markup.button.callback('▶', `page:${page + 1}`));",
   "n": 22
  },
  {
   "t": "  rows.push(nav);",
   "n": 23
  },
  {
   "t": "  rows.push([Markup.button.callback('🛒 Savat', 'cart')]);",
   "n": 24
  },
  {
   "t": "  return Markup.inlineKeyboard(rows);",
   "n": 25
  }
 ]
};
const KOD_KB_ORDER = {
 "file": "src/api/telegram/keyboards.ts",
 "tag": "jest1-start",
 "lines": [
  {
   "t": "// Admin: har buyurtma ostida status tugmalari (\"status:<id>:<STATUS>\")",
   "n": 37
  },
  {
   "t": "export const orderKeyboard = (o: Order) => {",
   "n": 38
  },
  {
   "t": "  if (o.status === 'DELIVERED' || o.status === 'CANCELLED') return undefined;",
   "n": 39
  },
  {
   "t": "  const row =",
   "n": 40
  },
  {
   "t": "    o.status === 'NEW'",
   "n": 41
  },
  {
   "t": "      ? [",
   "n": 42
  },
  {
   "t": "          Markup.button.callback('✅ Tasdiqlash', `status:${o.id}:CONFIRMED`),",
   "n": 43
  },
  {
   "t": "          Markup.button.callback('❌ Bekor', `status:${o.id}:CANCELLED`),",
   "n": 44
  },
  {
   "t": "        ]",
   "n": 45
  },
  {
   "t": "      : [",
   "n": 46
  },
  {
   "t": "          Markup.button.callback('🚚 Yetkazildi', `status:${o.id}:DELIVERED`),",
   "n": 47
  },
  {
   "t": "          Markup.button.callback('❌ Bekor', `status:${o.id}:CANCELLED`),",
   "n": 48
  },
  {
   "t": "        ];",
   "n": 49
  },
  {
   "t": "  return Markup.inlineKeyboard([row]);",
   "n": 50
  },
  {
   "t": "};",
   "n": 51
  }
 ]
};
const KOD_PKG_TEST = {
 "file": "package.json",
 "tag": "jest1-start",
 "lines": [
  {
   "t": "    \"test\": \"jest\",",
   "n": 14
  }
 ]
};
const KOD_PKG = {
 "file": "package.json",
 "tag": "jest1-start",
 "lines": [
  {
   "t": "  \"jest\": {",
   "n": 45
  },
  {
   "t": "    \"moduleFileExtensions\": [",
   "n": 46
  },
  {
   "t": "      \"js\",",
   "n": 47
  },
  {
   "t": "      \"json\",",
   "n": 48
  },
  {
   "t": "      \"ts\"",
   "n": 49
  },
  {
   "t": "    ],",
   "n": 50
  },
  {
   "t": "    \"rootDir\": \"src\",",
   "n": 51
  },
  {
   "t": "    \"testRegex\": \".*\\\\.spec\\\\.ts$\",",
   "n": 52
  },
  {
   "t": "    \"transform\": {",
   "n": 53
  },
  {
   "t": "      \"^.+\\\\.ts$\": \"ts-jest\"",
   "n": 54
  },
  {
   "t": "    },",
   "n": 55
  },
  {
   "t": "    \"testEnvironment\": \"node\"",
   "n": 56
  },
  {
   "t": "  }",
   "n": 57
  }
 ]
};
const KOD_SPEC02 = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { som } from './texts';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "describe('som', () => {",
   "n": 3
  },
  {
   "t": "  it(\"120000 ni so'mda yozadi\", () => {",
   "n": 4
  },
  {
   "t": "    expect(som(120000)).toBe(\"120 000 so'm\");",
   "n": 5
  },
  {
   "t": "  });",
   "n": 6
  },
  {
   "t": "});",
   "n": 7
  }
 ]
};
const KOD_SPEC04 = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { som } from './texts';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "describe('som', () => {",
   "n": 3
  },
  {
   "t": "  it(\"120000 ni so'mda yozadi\", () => {",
   "n": 4
  },
  {
   "t": "    // toLocaleString('ru-RU') minglarni bo'linmas probel (U+00A0) bilan ajratadi",
   "n": 5
  },
  {
   "t": "    expect(som(120000)).toBe(\"120\\u00a0000 so'm\");",
   "n": 6
  },
  {
   "t": "  });",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "  it(\"kichik sonda probel yo'q\", () => {",
   "n": 9
  },
  {
   "t": "    expect(som(500)).toBe(\"500 so'm\");",
   "n": 10
  },
  {
   "t": "  });",
   "n": 11
  },
  {
   "t": "});",
   "n": 12
  }
 ]
};
const KOD_SPEC05 = {
 "file": "src/api/telegram/yolgon.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { som } from './texts';",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "describe('som', () => {",
   "n": 3
  },
  {
   "t": "  it(\"120000 ni so'mda yozadi\", () => {",
   "n": 4
  },
  {
   "t": "    console.log(som(120000));",
   "n": 5
  },
  {
   "t": "  });",
   "n": 6
  },
  {
   "t": "});",
   "n": 7
  }
 ]
};
const KOD_SPEC06 = {
 "file": "src/api/telegram/savat.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { CartItem } from '../../core/entity';",
   "n": 1
  },
  {
   "t": "import { som, texts } from './texts';",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "const items = [",
   "n": 4
  },
  {
   "t": "  { product: { name: 'Kolonka', price: 50000 }, qty: 2 },",
   "n": 5
  },
  {
   "t": "] as CartItem[];",
   "n": 6
  },
  {
   "t": "",
   "n": 7
  },
  {
   "t": "describe('texts.cart', () => {",
   "n": 8
  },
  {
   "t": "  it('etalon koddan', () => {",
   "n": 9
  },
  {
   "t": "    const t = texts.cart(items, 100000);",
   "n": 10
  },
  {
   "t": "    expect(t).toContain(`Jami: ${som(100000)}`);",
   "n": 11
  },
  {
   "t": "  });",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "  it(\"etalon qo'lda\", () => {",
   "n": 14
  },
  {
   "t": "    const t = texts.cart(items, 100000);",
   "n": 15
  },
  {
   "t": "    expect(t).toContain(\"Jami: 100\\u00a0000 so'm\");",
   "n": 16
  },
  {
   "t": "  });",
   "n": 17
  },
  {
   "t": "});",
   "n": 18
  }
 ]
};
const KOD_SPEC06B = {
 "file": "src/api/telegram/tobe.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "describe('toBe va toEqual', () => {",
   "n": 1
  },
  {
   "t": "  it('toBe', () => {",
   "n": 2
  },
  {
   "t": "    expect([['◀', '2/3', '▶']]).toBe([['◀', '2/3', '▶']]);",
   "n": 3
  },
  {
   "t": "  });",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "  it('toEqual', () => {",
   "n": 6
  },
  {
   "t": "    expect([['◀', '2/3', '▶']]).toEqual([['◀', '2/3', '▶']]);",
   "n": 7
  },
  {
   "t": "  });",
   "n": 8
  },
  {
   "t": "});",
   "n": 9
  }
 ]
};
const KOD_SPEC_KB = {
 "file": "src/api/telegram/keyboards.spec.ts",
 "tag": "jest1-done",
 "lines": [
  {
   "t": "import { Order } from '../../core/entity';",
   "n": 1
  },
  {
   "t": "import { catalogKeyboard, orderKeyboard } from './keyboards';",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "// Faqat tugmalar matni va callback'i — qolgani bizga kerak emas",
   "n": 4
  },
  {
   "t": "const buttons = (kb: ReturnType<typeof orderKeyboard>) =>",
   "n": 5
  },
  {
   "t": "  kb?.reply_markup.inline_keyboard.map((row) =>",
   "n": 6
  },
  {
   "t": "    row.map((b) => [b.text, 'callback_data' in b ? b.callback_data : '']),",
   "n": 7
  },
  {
   "t": "  );",
   "n": 8
  },
  {
   "t": "",
   "n": 9
  },
  {
   "t": "const order = (status: Order['status']) => ({ id: 7, status }) as Order;",
   "n": 10
  },
  {
   "t": "",
   "n": 11
  },
  {
   "t": "describe('orderKeyboard', () => {",
   "n": 12
  },
  {
   "t": "  it('yangi buyurtma — Tasdiqlash va Bekor', () => {",
   "n": 13
  },
  {
   "t": "    expect(buttons(orderKeyboard(order('NEW')))).toEqual([",
   "n": 14
  },
  {
   "t": "      [",
   "n": 15
  },
  {
   "t": "        ['✅ Tasdiqlash', 'status:7:CONFIRMED'],",
   "n": 16
  },
  {
   "t": "        ['❌ Bekor', 'status:7:CANCELLED'],",
   "n": 17
  },
  {
   "t": "      ],",
   "n": 18
  },
  {
   "t": "    ]);",
   "n": 19
  },
  {
   "t": "  });",
   "n": 20
  },
  {
   "t": "",
   "n": 21
  },
  {
   "t": "  it('tasdiqlangan — Yetkazildi va Bekor', () => {",
   "n": 22
  },
  {
   "t": "    expect(buttons(orderKeyboard(order('CONFIRMED')))).toEqual([",
   "n": 23
  },
  {
   "t": "      [",
   "n": 24
  },
  {
   "t": "        ['🚚 Yetkazildi', 'status:7:DELIVERED'],",
   "n": 25
  },
  {
   "t": "        ['❌ Bekor', 'status:7:CANCELLED'],",
   "n": 26
  },
  {
   "t": "      ],",
   "n": 27
  },
  {
   "t": "    ]);",
   "n": 28
  },
  {
   "t": "  });",
   "n": 29
  },
  {
   "t": "",
   "n": 30
  },
  {
   "t": "  it(\"yetkazilgan va bekor qilingan — tugma yo'q\", () => {",
   "n": 31
  },
  {
   "t": "    expect(orderKeyboard(order('DELIVERED'))).toBeUndefined();",
   "n": 32
  },
  {
   "t": "    expect(orderKeyboard(order('CANCELLED'))).toBeUndefined();",
   "n": 33
  },
  {
   "t": "  });",
   "n": 34
  },
  {
   "t": "});",
   "n": 35
  },
  {
   "t": "",
   "n": 36
  },
  {
   "t": "const p = (id: number, stock = 5) =>",
   "n": 37
  },
  {
   "t": "  ({ id, name: `M${id}`, price: 1000, stock }) as any;",
   "n": 38
  },
  {
   "t": "",
   "n": 39
  },
  {
   "t": "// Oxirgidan oldingi qator — sahifalash: ◀ · 2/3 · ▶",
   "n": 40
  },
  {
   "t": "const nav = (kb: ReturnType<typeof catalogKeyboard>) => {",
   "n": 41
  },
  {
   "t": "  const rows = kb.reply_markup.inline_keyboard;",
   "n": 42
  },
  {
   "t": "  return rows[rows.length - 2].map((b) => b.text);",
   "n": 43
  },
  {
   "t": "};",
   "n": 44
  },
  {
   "t": "",
   "n": 45
  },
  {
   "t": "describe('catalogKeyboard', () => {",
   "n": 46
  },
  {
   "t": "  it(\"birinchi sahifada ◀ yo'q\", () => {",
   "n": 47
  },
  {
   "t": "    expect(nav(catalogKeyboard([p(1), p(2)], 0, 3))).toEqual(['1/3', '▶']);",
   "n": 48
  },
  {
   "t": "  });",
   "n": 49
  },
  {
   "t": "",
   "n": 50
  },
  {
   "t": "  it(\"o'rtada ikkalasi bor\", () => {",
   "n": 51
  },
  {
   "t": "    expect(nav(catalogKeyboard([p(3), p(4)], 1, 3))).toEqual(['◀', '2/3', '▶']);",
   "n": 52
  },
  {
   "t": "  });",
   "n": 53
  },
  {
   "t": "",
   "n": 54
  },
  {
   "t": "  it(\"oxirgi sahifada ▶ yo'q\", () => {",
   "n": 55
  },
  {
   "t": "    expect(nav(catalogKeyboard([p(5)], 2, 3))).toEqual(['◀', '3/3']);",
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
   "t": "  it('bitta sahifa — faqat 1/1', () => {",
   "n": 59
  },
  {
   "t": "    expect(nav(catalogKeyboard([p(1)], 0, 1))).toEqual(['1/1']);",
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
   "t": "  it('tugagan mahsulot bosilmaydi', () => {",
   "n": 63
  },
  {
   "t": "    const row = catalogKeyboard([p(9, 0)], 0, 1).reply_markup",
   "n": 64
  },
  {
   "t": "      .inline_keyboard[0];",
   "n": 65
  },
  {
   "t": "    expect(row[0]).toMatchObject({",
   "n": 66
  },
  {
   "t": "      text: 'M9 · tugagan',",
   "n": 67
  },
  {
   "t": "      callback_data: 'noop',",
   "n": 68
  },
  {
   "t": "    });",
   "n": 69
  },
  {
   "t": "  });",
   "n": 70
  },
  {
   "t": "});",
   "n": 71
  }
 ]
};
const KOD_SPEC_OP = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Order } from '../../core/entity';",
   "n": 1
  },
  {
   "t": "import { texts } from './texts';",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "const order = {",
   "n": 4
  },
  {
   "t": "  id: 42,",
   "n": 5
  },
  {
   "t": "  phone: '+998901234567',",
   "n": 6
  },
  {
   "t": "  total: 50000,",
   "n": 7
  },
  {
   "t": "  status: 'NEW',",
   "n": 8
  },
  {
   "t": "  items: [{ product: { name: 'Kolonka', price: 50000 }, qty: 1, price: 50000 }],",
   "n": 9
  },
  {
   "t": "} as unknown as Order;",
   "n": 10
  },
  {
   "t": "",
   "n": 11
  },
  {
   "t": "describe('texts.orderPlaced', () => {",
   "n": 12
  },
  {
   "t": "  it('buyurtma qatori va jami', () => {",
   "n": 13
  },
  {
   "t": "    const t = texts.orderPlaced(order);",
   "n": 14
  },
  {
   "t": "    expect(t).toContain('Buyurtma #42 qabul qilindi!');",
   "n": 15
  },
  {
   "t": "    expect(t).toContain(\"Jami: 50\\u00a0000 so'm\");",
   "n": 16
  },
  {
   "t": "    expect(t).toContain('Telefon: +998901234567');",
   "n": 17
  },
  {
   "t": "  });",
   "n": 18
  },
  {
   "t": "});",
   "n": 19
  }
 ]
};
const KOD_AI1_STATUS = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "describe('STATUS_UZ', () => {",
   "n": 41
  },
  {
   "t": "  it('har bir status uchun matn bor', () => {",
   "n": 42
  },
  {
   "t": "    const all: OrderStatus[] = ['NEW', 'CONFIRMED', 'DELIVERED', 'CANCELLED'];",
   "n": 43
  },
  {
   "t": "    expect(Object.keys(STATUS_UZ).sort()).toEqual([...all].sort());",
   "n": 44
  },
  {
   "t": "    for (const s of all) expect(STATUS_UZ[s]).toBeTruthy();",
   "n": 45
  },
  {
   "t": "  });",
   "n": 46
  },
  {
   "t": "});",
   "n": 47
  }
 ]
};
const KOD_AI1_NORM = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "// toLocaleString('ru-RU') guruhlarni oddiy probel bilan emas, NBSP (U+00A0)",
   "n": 4
  },
  {
   "t": "// yoki ICU versiyasiga qarab U+202F bilan ajratadi — solishtirishdan oldin",
   "n": 5
  },
  {
   "t": "// shu ikki belgini oddiy probelga keltiramiz (\\n tegilmaydi).",
   "n": 6
  },
  {
   "t": "const norm = (s: string) => s.replace(/[\\u00a0\\u202f]/g, ' ');",
   "n": 7
  }
 ]
};
const KOD_OUT_00 = "v24.18.0\n11.16.0\nWed Nov  4 01:42:57 PM +05 2026\nHEAD f2eca2f tgpg-done: bekor qilishda buyurtma qatori qulfl\njest 30.5.2\nts-jest 29.4.15\ntypescript 5.9.3\ntelegraf 4.16.3";
const KOD_OUT_01 = "{\n  \"test\": \"jest\",\n  \"jest\": {\n    \"moduleFileExtensions\": [\n      \"js\",\n      \"json\",\n      \"ts\"\n    ],\n    \"rootDir\": \"src\",\n    \"testRegex\": \".*\\\\.spec\\\\.ts$\",\n    \"transform\": {\n      \"^.+\\\\.ts$\": \"ts-jest\"\n    },\n    \"testEnvironment\": \"node\"\n  }\n}\n\n$ npm test\n\n> order-bot-nest@1.0.0 test\n> jest\n\nNo tests found, exiting with code 1\nRun with `--passWithNoTests` to exit with code 0\nIn …/OrderBotNest/src\n  27 files checked.\n  testMatch:  - 0 matches\n  testPathIgnorePatterns: /node_modules/ - 27 matches\n  testRegex: .*\\.spec\\.ts$ - 0 matches\nPattern:  - 0 matches\n[chiqish kodi: 1]";
const KOD_OUT_02 = "$ npx jest texts\nFAIL src/api/telegram/texts.spec.ts\n  som\n    ✕ 120000 ni so'mda yozadi (18 ms)\n\n  ● som › 120000 ni so'mda yozadi\n\n    expect(received).toBe(expected) // Object.is equality\n\n    Expected: \"120 000 so'm\"\n    Received: \"120 000 so'm\"\n\n      3 | describe('som', () => {\n      4 |   it(\"120000 ni so'mda yozadi\", () => {\n    > 5 |     expect(som(120000)).toBe(\"120 000 so'm\");\n        |                         ^\n      6 |   });\n      7 | });\n      8 |\n\n      at Object.<anonymous> (api/telegram/texts.spec.ts:5:25)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 1 total\nSnapshots:   0 total\nTime:        0.396 s, estimated 1 s\nRan all test suites matching texts.\n[chiqish kodi: 1]";
const KOD_OUT_03 = "$ node -e \"…JSON.stringify(som) + belgilar kodi\"\n\"120 000 so'm\"\n0031 0032 0030 00a0 0030 0030 0030 0020 0073 006f 0027 006d\n[chiqish kodi: 0]";
const KOD_OUT_04 = "$ npx jest texts\nPASS src/api/telegram/texts.spec.ts\n  som\n    ✓ 120000 ni so'mda yozadi (16 ms)\n    ✓ kichik sonda probel yo'q (1 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       2 passed, 2 total\nSnapshots:   0 total\nTime:        0.37 s, estimated 1 s\nRan all test suites matching texts.\n[chiqish kodi: 0]";
const KOD_OUT_05 = "$ npx jest yolgon\n  console.log\n    120 000 so'm\n\n      at Object.<anonymous> (api/telegram/yolgon.spec.ts:5:13)\n\nPASS src/api/telegram/yolgon.spec.ts\n  som\n    ✓ 120000 ni so'mda yozadi (31 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       1 passed, 1 total\nSnapshots:   0 total\nTime:        0.392 s, estimated 1 s\nRan all test suites matching yolgon.\n[chiqish kodi: 0]";
const KOD_OUT_06 = "# som() buzildi: ru-RU → en-US\n4:export const som = (n: number) => `${n.toLocaleString('en-US')} so'm`;\n\n$ npx jest savat --verbose\nFAIL src/api/telegram/savat.spec.ts\n  texts.cart\n    ✓ etalon koddan (17 ms)\n    ✕ etalon qo'lda (1 ms)\n\n  ● texts.cart › etalon qo'lda\n\n    expect(received).toContain(expected) // indexOf\n\n    Expected substring: \"Jami: 100 000 so'm\"\n    Received string:    \"Savat:\n    • Kolonka × 2 = 100,000 so'm·\n    Jami: 100,000 so'm\"\n\n      14 |   it(\"etalon qo'lda\", () => {\n      15 |     const t = texts.cart(items, 100000);\n    > 16 |     expect(t).toContain(\"Jami: 100\\u00a0000 so'm\");\n         |               ^\n      17 |   });\n      18 | });\n      19 |\n\n      at Object.<anonymous> (api/telegram/savat.spec.ts:16:15)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 1 passed, 2 total\nSnapshots:   0 total\nTime:        0.388 s, estimated 1 s\nRan all test suites matching savat.\n[chiqish kodi: 1]";
const KOD_OUT_06A = "$ npx jest savat --verbose\nPASS src/api/telegram/savat.spec.ts\n  texts.cart\n    ✓ etalon koddan (15 ms)\n    ✓ etalon qo'lda (1 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       2 passed, 2 total\nSnapshots:   0 total\nTime:        0.388 s, estimated 1 s\nRan all test suites matching savat.\n[chiqish kodi: 0]";
const KOD_OUT_06B = "$ npx jest tobe --verbose\nFAIL src/api/telegram/tobe.spec.ts\n  toBe va toEqual\n    ✕ toBe (6 ms)\n    ✓ toEqual (1 ms)\n\n  ● toBe va toEqual › toBe\n\n    expect(received).toBe(expected) // Object.is equality\n\n    If it should pass with deep equality, replace \"toBe\" with \"toStrictEqual\"\n\n    Expected: [[\"◀\", \"2/3\", \"▶\"]]\n    Received: serializes to the same string\n\n      1 | describe('toBe va toEqual', () => {\n      2 |   it('toBe', () => {\n    > 3 |     expect([['◀', '2/3', '▶']]).toBe([['◀', '2/3', '▶']]);\n        |                                 ^\n      4 |   });\n      5 |\n      6 |   it('toEqual', () => {\n\n      at Object.<anonymous> (api/telegram/tobe.spec.ts:3:33)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 1 passed, 2 total\nSnapshots:   0 total\nTime:        0.382 s, estimated 1 s\nRan all test suites matching tobe.\n[chiqish kodi: 1]";
const KOD_OUT_07 = "$ npx jest keyboards --verbose\nPASS src/api/telegram/keyboards.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma — Tasdiqlash va Bekor (3 ms)\n    ✓ tasdiqlangan — Yetkazildi va Bekor\n    ✓ yetkazilgan va bekor qilingan — tugma yo'q (1 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total\nSnapshots:   0 total\nTime:        0.417 s, estimated 1 s\nRan all test suites matching keyboards.\n[chiqish kodi: 0]";
const KOD_OUT_08 = "39:  if (o.status === 'DELIVERED') return undefined;\n\n$ npx jest keyboards\nFAIL src/api/telegram/keyboards.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma — Tasdiqlash va Bekor (4 ms)\n    ✓ tasdiqlangan — Yetkazildi va Bekor (1 ms)\n    ✕ yetkazilgan va bekor qilingan — tugma yo'q (2 ms)\n\n  ● orderKeyboard › yetkazilgan va bekor qilingan — tugma yo'q\n\n    expect(received).toBeUndefined()\n\n    Received: {\"reply_markup\": {\"inline_keyboard\": [[{\"callback_data\": \"status:7:DELIVERED\", \"hide\": false, \"text\": \"🚚 Yetkazildi\"}, {\"callback_data\": \"status:7:CANCELLED\", \"hide\": false, \"text\": \"❌ Bekor\"}]]}}\n\n      31 |   it(\"yetkazilgan va bekor qilingan — tugma yo'q\", () => {\n      32 |     expect(orderKeyboard(order('DELIVERED'))).toBeUndefined();\n    > 33 |     expect(orderKeyboard(order('CANCELLED'))).toBeUndefined();\n         |                                               ^\n      34 |   });\n      35 | });\n      36 |\n\n      at Object.<anonymous> (api/telegram/keyboards.spec.ts:33:47)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 2 passed, 3 total\nSnapshots:   0 total\nTime:        0.417 s, estimated 1 s\nRan all test suites matching keyboards.\n[chiqish kodi: 1]";
const KOD_OUT_09 = "$ npx jest keyboards --verbose\nPASS src/api/telegram/keyboards.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma — Tasdiqlash va Bekor (3 ms)\n    ✓ tasdiqlangan — Yetkazildi va Bekor\n    ✓ yetkazilgan va bekor qilingan — tugma yo'q (1 ms)\n  catalogKeyboard\n    ✓ birinchi sahifada ◀ yo'q (14 ms)\n    ✓ o'rtada ikkalasi bor (1 ms)\n    ✓ oxirgi sahifada ▶ yo'q\n    ✓ bitta sahifa — faqat 1/1\n    ✓ tugagan mahsulot bosilmaydi (1 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       8 passed, 8 total\nSnapshots:   0 total\nTime:        0.422 s, estimated 1 s\nRan all test suites matching keyboards.\n[chiqish kodi: 0]";
const KOD_OUT_10 = "21:  if (page <= pages - 1)\n\n$ npx jest keyboards\nFAIL src/api/telegram/keyboards.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma — Tasdiqlash va Bekor (3 ms)\n    ✓ tasdiqlangan — Yetkazildi va Bekor\n    ✓ yetkazilgan va bekor qilingan — tugma yo'q (1 ms)\n  catalogKeyboard\n    ✓ birinchi sahifada ◀ yo'q (15 ms)\n    ✓ o'rtada ikkalasi bor\n    ✕ oxirgi sahifada ▶ yo'q (3 ms)\n    ✕ bitta sahifa — faqat 1/1 (1 ms)\n    ✓ tugagan mahsulot bosilmaydi (1 ms)\n\n  ● catalogKeyboard › oxirgi sahifada ▶ yo'q\n\n    expect(received).toEqual(expected) // deep equality\n\n    - Expected  - 0\n    + Received  + 1\n\n      Array [\n        \"◀\",\n        \"3/3\",\n    +   \"▶\",\n      ]\n\n      54 |\n      55 |   it(\"oxirgi sahifada ▶ yo'q\", () => {\n    > 56 |     expect(nav(catalogKeyboard([p(5)], 2, 3))).toEqual(['◀', '3/3']);\n         |                                                ^\n      57 |   });\n      58 |\n      59 |   it('bitta sahifa — faqat 1/1', () => {\n\n      at Object.<anonymous> (api/telegram/keyboards.spec.ts:56:48)\n\n  ● catalogKeyboard › bitta sahifa — faqat 1/1\n\n    expect(received).toEqual(expected) // deep equality\n\n    - Expected  - 0\n    + Received  + 1\n\n      Array [\n        \"1/1\",\n    +   \"▶\",\n      ]\n\n      58 |\n      59 |   it('bitta sahifa — faqat 1/1', () => {\n    > 60 |     expect(nav(catalogKeyboard([p(1)], 0, 1))).toEqual(['1/1']);\n         |                                                ^\n      61 |   });\n      62 |\n      63 |   it('tugagan mahsulot bosilmaydi', () => {\n\n      at Object.<anonymous> (api/telegram/keyboards.spec.ts:60:48)\n\nTest Suites: 1 failed, 1 total\nTests:       2 failed, 6 passed, 8 total\nSnapshots:   0 total\nTime:        0.453 s, estimated 1 s\nRan all test suites matching keyboards.\n[chiqish kodi: 1]";
const KOD_OUT_11 = "$ npm test -- --verbose\n\n> order-bot-nest@1.0.0 test\n> jest --verbose\n\nPASS src/api/telegram/keyboards.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma — Tasdiqlash va Bekor (3 ms)\n    ✓ tasdiqlangan — Yetkazildi va Bekor (1 ms)\n    ✓ yetkazilgan va bekor qilingan — tugma yo'q (1 ms)\n  catalogKeyboard\n    ✓ birinchi sahifada ◀ yo'q (14 ms)\n    ✓ o'rtada ikkalasi bor\n    ✓ oxirgi sahifada ▶ yo'q\n    ✓ bitta sahifa — faqat 1/1\n    ✓ tugagan mahsulot bosilmaydi\n\nPASS src/api/telegram/texts.spec.ts\n  som\n    ✓ 120000 ni so'mda yozadi (1 ms)\n    ✓ kichik sonda probel yo'q\n\nTest Suites: 2 passed, 2 total\nTests:       10 passed, 10 total\nSnapshots:   0 total\nTime:        0.462 s, estimated 1 s\nRan all test suites.\n[chiqish kodi: 0]";
const KOD_OUT_12 = "$ ls -a | grep env\n.env.example\n\n$ npm test 2>&1 | tail -5\nTest Suites: 2 passed, 2 total\nTests:       10 passed, 10 total\nSnapshots:   0 total\nTime:        0.451 s, estimated 1 s\nRan all test suites.";
const KOD_OUT_13 = "$ npm test\n\n> order-bot-nest@1.0.0 test\n> jest\n\nNo tests found, exiting with code 1\nRun with `--passWithNoTests` to exit with code 0\nIn …/OrderBotNest/src\n  28 files checked.\n  testMatch:  - 0 matches\n  testPathIgnorePatterns: /node_modules/ - 28 matches\n  testRegex: .*\\.spec\\.ts$ - 0 matches\nPattern:  - 0 matches\n[chiqish kodi: 1]";
const KOD_OUT_14 = "$ npm test\n\n> order-bot-nest@1.0.0 test\n> jest\n\nNo tests found, exiting with code 1\nRun with `--passWithNoTests` to exit with code 0\nIn …/OrderBotNest/src\n  27 files checked.\n  testMatch:  - 0 matches\n  testPathIgnorePatterns: /node_modules/ - 27 matches\n  testRegex: .*\\.spec\\.ts$ - 0 matches\nPattern:  - 0 matches\n[chiqish kodi: 1]";
const KOD_OUT_20 = "$ git checkout jest1-start\nerror: pathspec 'jest1-start' did not match any file(s) known to git\n[chiqish kodi: 1]\n\n$ git status --short\n M src/api/order/order.service.ts\n\n$ git checkout tgpg-done\nerror: Your local changes to the following files would be overwritten by checkout:\n\tsrc/api/order/order.service.ts\nPlease commit your changes or stash them before you switch branches.\nAborting\n[chiqish kodi: 1]";
const KOD_OUT_21 = "# texts.spec.ts boshqa papkada: src/api/ (texts.ts esa src/api/telegram/ da)\n$ npx jest texts\nFAIL src/api/texts.spec.ts\n  ● Test suite failed to run\n\n    Cannot find module './texts' from 'api/texts.spec.ts'\n\n    However, Jest was able to find:\n    \t'./texts.spec.ts'\n\n    You might want to include a file extension in your import, or update your 'moduleFileExtensions', which is currently ['js', 'json', 'ts'].\n\n    See https://jestjs.io/docs/configuration#modulefileextensions-arraystring\n\n    > 1 | import { som } from './texts';\n        | ^\n      2 |\n      3 | describe('som', () => {\n      4 |   it(\"120000 ni so'mda yozadi\", () => {\n\n      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/index.js:1031:11)\n      at Object.<anonymous> (api/texts.spec.ts:1:1)\n\nTest Suites: 1 failed, 1 total\nTests:       0 total\nSnapshots:   0 total\nTime:        0.694 s\nRan all test suites matching texts.\n[chiqish kodi: 1]";
const KOD_OUT_22 = "# yordamchisiz: b.callback_data to'g'ridan-to'g'ri\n$ npx jest kb\nPASS src/api/telegram/kb.spec.ts\n  orderKeyboard\n    ✓ yangi buyurtma (6 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       1 passed, 1 total\nSnapshots:   0 total\nTime:        0.991 s, estimated 1 s\nRan all test suites matching kb.\n[chiqish kodi: 0]";
const KOD_OUT_23 = "# LineCheck fayli (satr raqamlari):\n     1\timport { Order } from '../../core/entity';\n     2\timport { som, texts } from './texts';\n     3\t\n     4\tconst order = {\n     5\t  id: 42,\n     6\t  phone: '+998901234567',\n     7\t  total: 50000,\n     8\t  status: 'NEW',\n     9\t  items: [{ product: { name: 'Kolonka', price: 50000 }, qty: 1, price: 50000 }],\n    10\t} as unknown as Order;\n    11\t\n    12\tdescribe('texts.orderPlaced', () => {\n    13\t  it('buyurtma qatori va jami', () => {\n    14\t    const t = texts.orderPlaced(order);\n    15\t    expect(t).toContain('Buyurtma #42 qabul qilindi!');\n    16\t    expect(t).toContain(`Jami: ${som(50000)}`);\n    17\t    expect(t).toContain('Telefon: +998901234567');\n    18\t  });\n    19\t});\n\n$ npx jest texts\nPASS src/api/telegram/texts.spec.ts\n  texts.orderPlaced\n    ✓ buyurtma qatori va jami (25 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       1 passed, 1 total\nSnapshots:   0 total\nTime:        0.791 s, estimated 1 s\nRan all test suites matching texts.\n[chiqish kodi: 0]\n\n# som() buzildi: ru-RU → en-US\n$ npx jest texts\nPASS src/api/telegram/texts.spec.ts\n  texts.orderPlaced\n    ✓ buyurtma qatori va jami (29 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       1 passed, 1 total\nSnapshots:   0 total\nTime:        0.677 s, estimated 1 s\nRan all test suites matching texts.\n[chiqish kodi: 0]";
const KOD_OUT_24 = "# Tuzatilgan (satr raqamlari):\n     1\timport { Order } from '../../core/entity';\n     2\timport { texts } from './texts';\n     3\t\n     4\tconst order = {\n     5\t  id: 42,\n     6\t  phone: '+998901234567',\n     7\t  total: 50000,\n     8\t  status: 'NEW',\n     9\t  items: [{ product: { name: 'Kolonka', price: 50000 }, qty: 1, price: 50000 }],\n    10\t} as unknown as Order;\n    11\t\n    12\tdescribe('texts.orderPlaced', () => {\n    13\t  it('buyurtma qatori va jami', () => {\n    14\t    const t = texts.orderPlaced(order);\n    15\t    expect(t).toContain('Buyurtma #42 qabul qilindi!');\n    16\t    expect(t).toContain(\"Jami: 50\\u00a0000 so'm\");\n    17\t    expect(t).toContain('Telefon: +998901234567');\n    18\t  });\n    19\t});\n\n$ npx jest texts\nPASS src/api/telegram/texts.spec.ts\n  texts.orderPlaced\n    ✓ buyurtma qatori va jami (30 ms)\n\nTest Suites: 1 passed, 1 total\nTests:       1 passed, 1 total\nSnapshots:   0 total\nTime:        0.709 s, estimated 1 s\nRan all test suites matching texts.\n[chiqish kodi: 0]\n\n# som() buzildi: ru-RU → en-US\n$ npx jest texts\nFAIL src/api/telegram/texts.spec.ts\n  texts.orderPlaced\n    ✕ buyurtma qatori va jami (26 ms)\n\n  ● texts.orderPlaced › buyurtma qatori va jami\n\n    expect(received).toContain(expected) // indexOf\n\n    Expected substring: \"Jami: 50 000 so'm\"\n    Received string:    \"Buyurtma #42 qabul qilindi!\n    • Kolonka × 1 = 50,000 so'm·\n    Jami: 50,000 so'm\n    Telefon: +998901234567\n    Holati: 🆕 Yangi\"\n\n      14 |     const t = texts.orderPlaced(order);\n      15 |     expect(t).toContain('Buyurtma #42 qabul qilindi!');\n    > 16 |     expect(t).toContain(\"Jami: 50\\u00a0000 so'm\");\n         |               ^\n      17 |     expect(t).toContain('Telefon: +998901234567');\n      18 |   });\n      19 | });\n\n      at Object.<anonymous> (api/telegram/texts.spec.ts:16:15)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 1 total\nSnapshots:   0 total\nTime:        0.692 s, estimated 1 s\nRan all test suites matching texts.\n[chiqish kodi: 1]";
const KOD_OUT_25 = "## ai1 buzilmagan: Tests:       36 passed, 36 total\n10:  CANCELLED: '🆕 Yangi',\n## ai1 CANCELLED → «🆕 Yangi»: Tests:       36 passed, 36 total\n\n## ai2 buzilmagan: Tests:       33 passed, 33 total\n10:  CANCELLED: '🆕 Yangi',\n## ai2 CANCELLED → «🆕 Yangi»: Tests:       1 failed, 32 passed, 33 total\n  ● STATUS_UZ › maps statuses to their Uzbek labels";
const KOD_SPEC_OP_BUZUQ = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "chiqish",
 "lines": [
  {
   "t": "import { Order } from '../../core/entity';",
   "n": 1
  },
  {
   "t": "import { som, texts } from './texts';",
   "n": 2
  },
  {
   "t": "",
   "n": 3
  },
  {
   "t": "const order = {",
   "n": 4
  },
  {
   "t": "  id: 42,",
   "n": 5
  },
  {
   "t": "  phone: '+998901234567',",
   "n": 6
  },
  {
   "t": "  total: 50000,",
   "n": 7
  },
  {
   "t": "  status: 'NEW',",
   "n": 8
  },
  {
   "t": "  items: [{ product: { name: 'Kolonka', price: 50000 }, qty: 1, price: 50000 }],",
   "n": 9
  },
  {
   "t": "} as unknown as Order;",
   "n": 10
  },
  {
   "t": "",
   "n": 11
  },
  {
   "t": "describe('texts.orderPlaced', () => {",
   "n": 12
  },
  {
   "t": "  it('buyurtma qatori va jami', () => {",
   "n": 13
  },
  {
   "t": "    const t = texts.orderPlaced(order);",
   "n": 14
  },
  {
   "t": "    expect(t).toContain('Buyurtma #42 qabul qilindi!');",
   "n": 15
  },
  {
   "t": "    expect(t).toContain(`Jami: ${som(50000)}`);",
   "n": 16
  },
  {
   "t": "    expect(t).toContain('Telefon: +998901234567');",
   "n": 17
  },
  {
   "t": "  });",
   "n": 18
  },
  {
   "t": "});",
   "n": 19
  }
 ]
};
const KOD_AI_DIFF1 = " src/api/telegram/keyboards.spec.ts | 113 +++++++++++++++++++++++\n src/api/telegram/texts.spec.ts     | 177 +++++++++++++++++++++++++++++++++++++\n 2 files changed, 290 insertions(+)";
const KOD_AI_DIFF2 = " src/api/telegram/keyboards.spec.ts | 111 +++++++++++++++++++++\n src/api/telegram/texts.spec.ts     | 193 +++++++++++++++++++++++++++++++++++++\n 2 files changed, 304 insertions(+)";
const KOD_AI2_LINES = {
 "file": "src/api/telegram/texts.spec.ts",
 "tag": "ai2",
 "lines": [
  {
   "t": "    expect(som(120000)).toBe(`120 000 so'm`);",
   "n": 33
  },
  {
   "t": "    expect(t).toContain(`Jami: ${som(50000)}`);",
   "n": 134
  }
 ]
};
const KOD_PROMPT1 = "src/api/telegram/texts.ts va keyboards.ts uchun jest testlar yozib ber. npm test yashil bo'lsin.";
const KOD_PROMPT2 = "Loyiha: OrderBotNest (NestJS + Telegraf), Jest sozlangan, testlar `src/` ichida `*.spec.ts`. Vazifa: `src/api/telegram/texts.ts` dagi `texts.cart`, `texts.orderPlaced`, `texts.orderLine` va `STATUS_UZ` uchun unit-testlar yoz. Shartlar: etalonni qo'lda yoz — `som()`, `STATUS_UZ` yoki boshqa sinalayotgan kodni etalonda ishlatma; bo'linmas probelni `\\u00a0` bilan ochiq yoz; `toBeTruthy` bilan matn tekshirma — aniq qiymat yoz; har `it` da kamida bitta `expect`. Tegma: `src/` dagi `.spec.ts` dan boshqa fayllarga. Javobda: qo'shilgan fayllar ro'yxati va `npm test` natijasi.";
const KOD = { TX_SOM: KOD_TX_SOM, TX_STATUS: KOD_TX_STATUS, KB_NAV: KOD_KB_NAV, KB_ORDER: KOD_KB_ORDER, PKG_TEST: KOD_PKG_TEST, PKG: KOD_PKG, SPEC02: KOD_SPEC02, SPEC04: KOD_SPEC04, SPEC05: KOD_SPEC05, SPEC06: KOD_SPEC06, SPEC06B: KOD_SPEC06B, SPEC_KB: KOD_SPEC_KB, SPEC_OP: KOD_SPEC_OP, AI1_STATUS: KOD_AI1_STATUS, AI1_NORM: KOD_AI1_NORM, OUT: { '00': KOD_OUT_00, '01': KOD_OUT_01, '02': KOD_OUT_02, '03': KOD_OUT_03, '04': KOD_OUT_04, '05': KOD_OUT_05, '06': KOD_OUT_06, '06a': KOD_OUT_06A, '06b': KOD_OUT_06B, '07': KOD_OUT_07, '08': KOD_OUT_08, '09': KOD_OUT_09, '10': KOD_OUT_10, '11': KOD_OUT_11, '12': KOD_OUT_12, '13': KOD_OUT_13, '14': KOD_OUT_14, '20': KOD_OUT_20, '21': KOD_OUT_21, '22': KOD_OUT_22, '23': KOD_OUT_23, '24': KOD_OUT_24, '25': KOD_OUT_25 }, SPEC_OP_BUZUQ: KOD_SPEC_OP_BUZUQ, AI_DIFF1: KOD_AI_DIFF1, AI_DIFF2: KOD_AI_DIFF2, AI2_LINES: KOD_AI2_LINES, PROMPT1: KOD_PROMPT1, PROMPT2: KOD_PROMPT2 };
