import type { CartItem, Order, OrderStatus, Product } from '../../core/entity';
import { STATUS_UZ, som, texts } from './texts';

// toLocaleString('ru-RU') guruhlarni oddiy probel bilan emas, NBSP (U+00A0)
// yoki ICU versiyasiga qarab U+202F bilan ajratadi — solishtirishdan oldin
// shu ikki belgini oddiy probelga keltiramiz (\n tegilmaydi).
const norm = (s: string) => s.replace(/[\u00a0\u202f]/g, ' ');

const product = (over: Partial<Product> = {}): Product =>
  ({ id: 1, name: 'Lavash', price: 25000, stock: 10, ...over }) as Product;

const order = (over: Partial<Order> = {}): Order =>
  ({
    id: 7,
    phone: '+998901234567',
    total: 70000,
    status: 'NEW',
    user: { name: 'Ali' },
    items: [
      { product: product(), qty: 2, price: 25000 },
      {
        product: product({ id: 2, name: 'Cola', price: 10000 }),
        qty: 2,
        price: 10000,
      },
    ],
    ...over,
  }) as Order;

describe('som', () => {
  it.each([
    [0, "0 so'm"],
    [999, "999 so'm"],
    [120000, "120 000 so'm"],
    [1234567, "1 234 567 so'm"],
  ])('%d → %s', (n, expected) => {
    expect(norm(som(n))).toBe(expected);
  });
});

describe('STATUS_UZ', () => {
  it('har bir status uchun matn bor', () => {
    const all: OrderStatus[] = ['NEW', 'CONFIRMED', 'DELIVERED', 'CANCELLED'];
    expect(Object.keys(STATUS_UZ).sort()).toEqual([...all].sort());
    for (const s of all) expect(STATUS_UZ[s]).toBeTruthy();
  });
});

describe('texts', () => {
  describe('start', () => {
    it("oddiy foydalanuvchiga /orders ko'rsatilmaydi", () => {
      const t = texts.start('Ali', false);
      expect(t).toContain('Salom, Ali!');
      expect(t).toContain('/catalog');
      expect(t).toContain('/cart');
      expect(t).toContain('/help');
      expect(t).not.toContain('/orders');
    });

    it("admin uchun /orders qatori qo'shiladi", () => {
      const t = texts.start('Vali', true);
      expect(t).toContain('Salom, Vali!');
      expect(t.split('\n').pop()).toBe('/orders — buyurtmalar (admin)');
    });
  });

  it('help asosiy buyruqlarni sanaydi', () => {
    expect(texts.help).toContain('/catalog');
    expect(texts.help).toContain('/cart');
    expect(texts.help).toContain('/start');
  });

  describe('catalogTitle', () => {
    it('sahifa raqami 1 dan boshlanadi (0-indeks → 1)', () => {
      expect(texts.catalogTitle(0, 3)).toContain('(1/3-sahifa)');
    });

    it('oxirgi sahifa', () => {
      expect(texts.catalogTitle(2, 3)).toContain('(3/3-sahifa)');
    });
  });

  it('added — mahsulot nomi va soni', () => {
    expect(texts.added(product(), 3)).toBe("Lavash savatga qo'shildi (3 ta).");
  });

  describe('cart', () => {
    it('har qator mahsulot narxi × soni, oxirida jami', () => {
      const items = [
        { product: product(), qty: 2 },
        { product: product({ id: 2, name: 'Cola', price: 10000 }), qty: 1 },
      ] as CartItem[];
      const t = norm(texts.cart(items, 60000));
      expect(t).toBe(
        'Savat:\n' +
          "• Lavash × 2 = 50 000 so'm\n" +
          "• Cola × 1 = 10 000 so'm\n" +
          '\n' +
          "Jami: 60 000 so'm",
      );
    });
  });

  describe('orderPlaced', () => {
    it('buyurtma raqami, qatorlar, jami, telefon va status', () => {
      const t = norm(texts.orderPlaced(order()));
      expect(t).toContain('Buyurtma #7 qabul qilindi!');
      expect(t).toContain("• Lavash × 2 = 50 000 so'm");
      expect(t).toContain("• Cola × 2 = 20 000 so'm");
      expect(t).toContain("Jami: 70 000 so'm");
      expect(t).toContain('Telefon: +998901234567');
      expect(t).toContain(`Holati: ${STATUS_UZ.NEW}`);
    });

    it('qatorda buyurtma paytidagi narx ishlatiladi, mahsulotning hozirgi narxi emas', () => {
      const o = order({
        items: [{ product: product({ price: 30000 }), qty: 1, price: 25000 }],
      } as Partial<Order>);
      const t = norm(texts.orderPlaced(o));
      expect(t).toContain("• Lavash × 1 = 25 000 so'm");
      expect(t).not.toContain('30 000');
    });
  });

  it("orderFailed — sababni ko'rsatadi", () => {
    expect(texts.orderFailed('omborda yetarli emas')).toBe(
      'Buyurtma berilmadi: omborda yetarli emas',
    );
  });

  it('adminNewOrder — raqam, mijoz va jami', () => {
    const t = norm(texts.adminNewOrder(order(), 'Ali'));
    expect(t).toContain('#7');
    expect(t).toContain('Ali');
    expect(t).toContain("70 000 so'm");
    expect(t).toContain('/orders');
  });

  describe('orderLine', () => {
    it('birinchi qator — sarlavha, keyin har mahsulot alohida qatorda', () => {
      const lines = norm(texts.orderLine(order({ status: 'CONFIRMED' }))).split(
        '\n',
      );
      expect(lines).toEqual([
        `#7 · Ali · 70 000 so'm · ${STATUS_UZ.CONFIRMED}`,
        '   Lavash × 2',
        '   Cola × 2',
      ]);
    });
  });

  it.each<OrderStatus>(['NEW', 'CONFIRMED', 'DELIVERED', 'CANCELLED'])(
    'statusChanged / customerStatus — %s',
    (status) => {
      const o = order({ status });
      expect(texts.statusChanged(o)).toBe(`#7 → ${STATUS_UZ[status]}`);
      expect(texts.customerStatus(o)).toBe(
        `Buyurtmangiz #7: ${STATUS_UZ[status]}`,
      );
    },
  );

  it("o'zgarmas matnlar bo'sh emas", () => {
    for (const key of [
      'cartEmpty',
      'cartCleared',
      'askPhone',
      'badPhone',
      'adminOnly',
      'noOrders',
      'unknown',
    ] as const) {
      expect(typeof texts[key]).toBe('string');
      expect(texts[key].length).toBeGreaterThan(0);
    }
  });
});
