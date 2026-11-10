import { CartItem, Order, Product } from '../../core/entity';
import { STATUS_UZ, texts } from './texts';

// Etalon qo'lda yozilgan: som() va STATUS_UZ kabi sinalayotgan kod bu yerda ishlatilmaydi.
// Mingliklar orasidagi bo'linmas probel —   (ru-RU formatidagi NBSP).

const non: Product = { id: 1, name: 'Non', price: 5000, stock: 10 };
const tort: Product = { id: 2, name: 'Tort', price: 120000, stock: 3 };

describe('STATUS_UZ', () => {
  it('har holat uchun aniq matnni qaytaradi', () => {
    expect(STATUS_UZ).toEqual({
      NEW: '🆕 Yangi',
      CONFIRMED: '✅ Tasdiqlangan',
      DELIVERED: '🚚 Yetkazilgan',
      CANCELLED: '❌ Bekor qilingan',
    });
  });

  it('NEW holati — "🆕 Yangi"', () => {
    expect(STATUS_UZ.NEW).toBe('🆕 Yangi');
  });

  it('CONFIRMED holati — "✅ Tasdiqlangan"', () => {
    expect(STATUS_UZ.CONFIRMED).toBe('✅ Tasdiqlangan');
  });

  it('DELIVERED holati — "🚚 Yetkazilgan"', () => {
    expect(STATUS_UZ.DELIVERED).toBe('🚚 Yetkazilgan');
  });

  it('CANCELLED holati — "❌ Bekor qilingan"', () => {
    expect(STATUS_UZ.CANCELLED).toBe('❌ Bekor qilingan');
  });
});

describe('texts.cart', () => {
  it('savat qatorlarini, jami summani aniq matn sifatida chiqaradi', () => {
    const items = [
      { product: non, qty: 2 },
      { product: tort, qty: 1 },
    ];

    expect(texts.cart(items as unknown as CartItem[], 130000)).toBe(
      "Savat:\n" +
        "• Non × 2 = 10 000 so'm\n" +
        "• Tort × 1 = 120 000 so'm\n" +
        "\n" +
        "Jami: 130 000 so'm",
    );
  });

  it('qator narxi mahsulot narxidan (price × qty) hisoblanadi', () => {
    const items = [{ product: non, qty: 3 }];

    expect(texts.cart(items as unknown as CartItem[], 15000)).toBe(
      "Savat:\n• Non × 3 = 15 000 so'm\n\nJami: 15 000 so'm",
    );
  });

  it('jami qiymati parametr sifatida olinadi (qayta hisoblanmaydi)', () => {
    const items = [{ product: tort, qty: 1 }];

    expect(texts.cart(items as unknown as CartItem[], 99999)).toBe(
      "Savat:\n• Tort × 1 = 120 000 so'm\n\nJami: 99 999 so'm",
    );
  });
});

describe('texts.orderPlaced', () => {
  it('qabul xabarini qator narxi (buyurtma paytidagi) va holat bilan chiqaradi', () => {
    const order = {
      id: 7,
      phone: '+998901234567',
      total: 129000,
      status: 'NEW',
      items: [
        { product: non, qty: 2, price: 4500 },
        { product: tort, qty: 1, price: 120000 },
      ],
    } as unknown as Order;

    expect(texts.orderPlaced(order)).toBe(
      "Buyurtma #7 qabul qilindi!\n" +
        "• Non × 2 = 9 000 so'm\n" +
        "• Tort × 1 = 120 000 so'm\n" +
        "\n" +
        "Jami: 129 000 so'm\n" +
        "Telefon: +998901234567\n" +
        "Holati: 🆕 Yangi",
    );
  });

  it('holat CONFIRMED bo\'lsa — "✅ Tasdiqlangan" chiqadi', () => {
    const order = {
      id: 8,
      phone: '+998901112233',
      total: 5000,
      status: 'CONFIRMED',
      items: [{ product: non, qty: 1, price: 5000 }],
    } as unknown as Order;

    expect(texts.orderPlaced(order)).toBe(
      "Buyurtma #8 qabul qilindi!\n" +
        "• Non × 1 = 5 000 so'm\n" +
        "\n" +
        "Jami: 5 000 so'm\n" +
        "Telefon: +998901112233\n" +
        "Holati: ✅ Tasdiqlangan",
    );
  });
});

describe('texts.orderLine', () => {
  it('buyurtma sarlavhasi va mahsulot qatorlarini aniq chiqaradi', () => {
    const order = {
      id: 3,
      user: { name: 'Ali' },
      total: 129000,
      status: 'DELIVERED',
      items: [
        { product: non, qty: 2 },
        { product: tort, qty: 1 },
      ],
    } as unknown as Order;

    expect(texts.orderLine(order)).toBe(
      "#3 · Ali · 129 000 so'm · 🚚 Yetkazilgan\n" +
        "   Non × 2\n" +
        "   Tort × 1",
    );
  });

  it('bekor qilingan buyurtma — "❌ Bekor qilingan" holati chiqadi', () => {
    const order = {
      id: 4,
      user: { name: 'Dilnoza' },
      total: 120000,
      status: 'CANCELLED',
      items: [{ product: tort, qty: 1 }],
    } as unknown as Order;

    expect(texts.orderLine(order)).toBe(
      "#4 · Dilnoza · 120 000 so'm · ❌ Bekor qilingan\n" +
        "   Tort × 1",
    );
  });
});
