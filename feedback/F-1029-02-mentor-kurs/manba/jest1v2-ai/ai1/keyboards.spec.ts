import type { Order, OrderStatus, Product } from '../../core/entity';
import { cartKeyboard, catalogKeyboard, orderKeyboard } from './keyboards';

type Btn = { text: string; callback_data: string };

// Markup.inlineKeyboard → { reply_markup: { inline_keyboard: Btn[][] } }
const rows = (kb: { reply_markup: unknown }): Btn[][] =>
  (kb.reply_markup as { inline_keyboard: Btn[][] }).inline_keyboard;
const data = (row: Btn[]) => row.map((b) => b.callback_data);
const norm = (s: string) => s.replace(/[\u00a0\u202f]/g, ' ');

const product = (over: Partial<Product> = {}): Product =>
  ({ id: 1, name: 'Lavash', price: 25000, stock: 10, ...over }) as Product;

const order = (status: OrderStatus, id = 5): Order => ({ id, status }) as Order;

describe('catalogKeyboard', () => {
  const items = [
    product(),
    product({ id: 2, name: 'Cola', price: 10000, stock: 0 }),
  ];

  it('har mahsulot — alohida qator, bitta tugma', () => {
    const r = rows(catalogKeyboard(items, 0, 1));
    expect(r[0]).toHaveLength(1);
    expect(r[1]).toHaveLength(1);
  });

  it("omborda bor mahsulot: narxi ko'rinadi, callback add:<id>", () => {
    const [btn] = rows(catalogKeyboard(items, 0, 1))[0];
    expect(norm(btn.text)).toBe("Lavash · 25 000 so'm");
    expect(btn.callback_data).toBe('add:1');
  });

  it('tugagan mahsulot: «tugagan», callback noop', () => {
    const [btn] = rows(catalogKeyboard(items, 0, 1))[1];
    expect(btn.text).toBe('Cola · tugagan');
    expect(btn.callback_data).toBe('noop');
  });

  it('oxirgi qator — savat tugmasi', () => {
    const r = rows(catalogKeyboard(items, 0, 1));
    expect(r[r.length - 1]).toEqual([
      expect.objectContaining({ text: '🛒 Savat', callback_data: 'cart' }),
    ]);
  });

  describe('sahifalash qatori (oxiridan ikkinchi)', () => {
    const nav = (page: number, pages: number) => {
      const r = rows(catalogKeyboard(items, page, pages));
      return r[r.length - 2];
    };

    it('bitta sahifa: faqat 1/1, strelkasiz', () => {
      expect(nav(0, 1).map((b) => b.text)).toEqual(['1/1']);
      expect(data(nav(0, 1))).toEqual(['noop']);
    });

    it("birinchi sahifa: ◀ yo'q, ▶ page:1", () => {
      expect(nav(0, 3).map((b) => b.text)).toEqual(['1/3', '▶']);
      expect(data(nav(0, 3))).toEqual(['noop', 'page:1']);
    });

    it("o'rtadagi sahifa: ◀ va ▶ ikkalasi", () => {
      expect(nav(1, 3).map((b) => b.text)).toEqual(['◀', '2/3', '▶']);
      expect(data(nav(1, 3))).toEqual(['page:0', 'noop', 'page:2']);
    });

    it("oxirgi sahifa: ▶ yo'q", () => {
      expect(nav(2, 3).map((b) => b.text)).toEqual(['◀', '3/3']);
      expect(data(nav(2, 3))).toEqual(['page:1', 'noop']);
    });
  });

  it("bo'sh sahifa: faqat sahifalash va savat qatorlari", () => {
    const r = rows(catalogKeyboard([], 0, 1));
    expect(r).toHaveLength(2);
    expect(data(r[0])).toEqual(['noop']);
    expect(data(r[1])).toEqual(['cart']);
  });
});

describe('cartKeyboard', () => {
  it("buyurtma berish, tozalash va yana qo'shish tugmalari", () => {
    const r = rows(cartKeyboard());
    expect(r.map(data)).toEqual([['checkout'], ['cart:clear', 'page:0']]);
  });
});

describe('orderKeyboard', () => {
  it('NEW: tasdiqlash yoki bekor qilish', () => {
    const kb = orderKeyboard(order('NEW'));
    expect(kb).toBeDefined();
    expect(rows(kb!).map(data)).toEqual([
      ['status:5:CONFIRMED', 'status:5:CANCELLED'],
    ]);
  });

  it('CONFIRMED: yetkazildi yoki bekor qilish', () => {
    const kb = orderKeyboard(order('CONFIRMED', 12));
    expect(kb).toBeDefined();
    expect(rows(kb!).map(data)).toEqual([
      ['status:12:DELIVERED', 'status:12:CANCELLED'],
    ]);
  });

  it.each<OrderStatus>(['DELIVERED', 'CANCELLED'])(
    "%s: yakuniy status — klaviatura yo'q",
    (status) => {
      expect(orderKeyboard(order(status))).toBeUndefined();
    },
  );
});
