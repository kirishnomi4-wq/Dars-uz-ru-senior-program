import { CartItem, Order, OrderItem, Product, User } from '../../core/entity';
import { STATUS_UZ, texts } from './texts';

// Etalonlar qo'lda yozilgan: som(), STATUS_UZ va texts ichidagi boshqa kod
// bu yerda ishlatilmaydi. Ming ajratgichi — bo'linmas probel
// (toLocaleString('ru-RU') shuni qo'yadi), oddiy probel emas.

const product = (id: number, name: string, price: number): Product =>
  ({ id, name, price, stock: 10 }) as Product;

const cartItem = (p: Product, qty: number): CartItem =>
  ({ id: p.id, product: p, qty }) as CartItem;

const orderItem = (p: Product, qty: number, price: number): OrderItem =>
  ({ id: p.id, product: p, qty, price }) as OrderItem;

const user = (name: string): User =>
  ({
    id: 1,
    telegram_id: '5123456789',
    name,
    phone: '+998901234567',
    role: 'customer',
    state: 'IDLE',
  }) as User;

const order = (over: Partial<Order>): Order =>
  ({
    id: 7,
    user: user('Ali'),
    phone: '+998901234567',
    total: 0,
    status: 'NEW',
    items: [],
    created_at: new Date('2026-11-04T10:00:00Z'),
    ...over,
  }) as Order;

const lavash = product(1, 'Lavash', 32000);
const cola = product(2, 'Cola', 9000);
const burger = product(3, 'Burger', 1250000);

describe('STATUS_UZ', () => {
  it('NEW — «🆕 Yangi»', () => {
    expect(STATUS_UZ.NEW).toBe('🆕 Yangi');
  });

  it('CONFIRMED — «✅ Tasdiqlangan»', () => {
    expect(STATUS_UZ.CONFIRMED).toBe('✅ Tasdiqlangan');
  });

  it('DELIVERED — «🚚 Yetkazilgan»', () => {
    expect(STATUS_UZ.DELIVERED).toBe('🚚 Yetkazilgan');
  });

  it('CANCELLED — «❌ Bekor qilingan»', () => {
    expect(STATUS_UZ.CANCELLED).toBe('❌ Bekor qilingan');
  });

  it('aynan 4 ta holat, ortiqcha kalit yo‘q', () => {
    expect(STATUS_UZ).toEqual({
      NEW: '🆕 Yangi',
      CONFIRMED: '✅ Tasdiqlangan',
      DELIVERED: '🚚 Yetkazilgan',
      CANCELLED: '❌ Bekor qilingan',
    });
  });
});

describe('texts.cart', () => {
  it('bitta mahsulot: qator, bo‘sh qator va jami', () => {
    expect(texts.cart([cartItem(lavash, 2)], 64000)).toBe(
      'Savat:\n• Lavash × 2 = 64 000 so\'m\n\nJami: 64 000 so\'m',
    );
  });

  it('bir nechta mahsulot — har biri alohida qatorda, oxirida \\n yo‘q', () => {
    expect(texts.cart([cartItem(lavash, 1), cartItem(cola, 3)], 59000)).toBe(
      'Savat:\n' +
        '• Lavash × 1 = 32 000 so\'m\n' +
        '• Cola × 3 = 27 000 so\'m\n' +
        '\n' +
        'Jami: 59 000 so\'m',
    );
  });

  it('millionda ikkita bo‘linmas probel bo‘ladi', () => {
    expect(texts.cart([cartItem(burger, 2)], 2500000)).toBe(
      'Savat:\n• Burger × 2 = 2 500 000 so\'m\n\nJami: 2 500 000 so\'m',
    );
  });

  it('1000 dan kichik summada ajratgich yo‘q', () => {
    const choy = product(4, 'Choy', 500);
    expect(texts.cart([cartItem(choy, 1)], 500)).toBe(
      'Savat:\n• Choy × 1 = 500 so\'m\n\nJami: 500 so\'m',
    );
  });

  it('ajratgich oddiy probel emas', () => {
    const text = texts.cart([cartItem(lavash, 2)], 64000);
    expect(text).not.toContain('64 000');
    expect(text).toContain('64 000');
  });

  it('«Jami» — chaqiruvchi bergan total (qatorlardan qayta hisoblanmaydi)', () => {
    expect(texts.cart([cartItem(lavash, 1)], 1000)).toBe(
      'Savat:\n• Lavash × 1 = 32 000 so\'m\n\nJami: 1 000 so\'m',
    );
  });
});

describe('texts.orderPlaced', () => {
  it('to‘liq matn: raqam, qatorlar, jami, telefon, holat', () => {
    const o = order({
      id: 42,
      total: 91000,
      phone: '+998901112233',
      status: 'NEW',
      items: [orderItem(lavash, 2, 32000), orderItem(cola, 3, 9000)],
    });
    expect(texts.orderPlaced(o)).toBe(
      'Buyurtma #42 qabul qilindi!\n' +
        '• Lavash × 2 = 64 000 so\'m\n' +
        '• Cola × 3 = 27 000 so\'m\n' +
        '\n' +
        'Jami: 91 000 so\'m\n' +
        'Telefon: +998901112233\n' +
        'Holati: 🆕 Yangi',
    );
  });

  it('qator summasi buyurtma paytidagi narxdan (item.price), product.price dan emas', () => {
    // Mahsulot narxi keyin 35 000 ga oshgan, buyurtmada esa 30 000 qolgan
    const qimmatLavash = product(1, 'Lavash', 35000);
    const o = order({
      id: 5,
      total: 60000,
      items: [orderItem(qimmatLavash, 2, 30000)],
    });
    expect(texts.orderPlaced(o)).toBe(
      'Buyurtma #5 qabul qilindi!\n' +
        '• Lavash × 2 = 60 000 so\'m\n' +
        '\n' +
        'Jami: 60 000 so\'m\n' +
        'Telefon: +998901234567\n' +
        'Holati: 🆕 Yangi',
    );
  });

  it('holat matni o‘zbekcha chiqadi (CONFIRMED)', () => {
    const o = order({
      id: 9,
      total: 9000,
      status: 'CONFIRMED',
      items: [orderItem(cola, 1, 9000)],
    });
    expect(texts.orderPlaced(o)).toBe(
      'Buyurtma #9 qabul qilindi!\n' +
        '• Cola × 1 = 9 000 so\'m\n' +
        '\n' +
        'Jami: 9 000 so\'m\n' +
        'Telefon: +998901234567\n' +
        'Holati: ✅ Tasdiqlangan',
    );
  });
});

describe('texts.orderLine', () => {
  it('bitta mahsulot: sarlavha va 3 probelli qator', () => {
    const o = order({
      id: 12,
      user: user('Vali'),
      total: 64000,
      status: 'NEW',
      items: [orderItem(lavash, 2, 32000)],
    });
    expect(texts.orderLine(o)).toBe(
      '#12 · Vali · 64 000 so\'m · 🆕 Yangi\n   Lavash × 2',
    );
  });

  it('bir nechta mahsulot — har biri alohida qatorda, narxsiz', () => {
    const o = order({
      id: 13,
      user: user('Ali'),
      total: 2527000,
      status: 'DELIVERED',
      items: [orderItem(burger, 2, 1250000), orderItem(cola, 3, 9000)],
    });
    expect(texts.orderLine(o)).toBe(
      '#13 · Ali · 2 527 000 so\'m · 🚚 Yetkazilgan\n' +
        '   Burger × 2\n' +
        '   Cola × 3',
    );
  });

  it('bekor qilingan buyurtma holati', () => {
    const o = order({
      id: 14,
      user: user('Ali'),
      total: 9000,
      status: 'CANCELLED',
      items: [orderItem(cola, 1, 9000)],
    });
    expect(texts.orderLine(o)).toBe(
      '#14 · Ali · 9 000 so\'m · ❌ Bekor qilingan\n   Cola × 1',
    );
  });
});
