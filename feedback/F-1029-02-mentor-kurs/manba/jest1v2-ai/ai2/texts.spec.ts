import { CartItem, Order, Product } from '../../core/entity';
import { som, STATUS_UZ, texts } from './texts';

const product = (over: Partial<Product> = {}): Product => ({
  id: 1,
  name: 'Lavash',
  price: 25000,
  stock: 10,
  ...over,
});

const order = (over: Partial<Order> = {}): Order => ({
  id: 42,
  user: {
    id: 1,
    telegram_id: '5123456789',
    name: 'Azizbek',
    phone: null,
    role: 'customer',
    state: 'IDLE',
    created_at: new Date(0),
  },
  phone: '+998901234567',
  total: 50000,
  status: 'NEW',
  items: [{ id: 1, order: {} as Order, product: product(), qty: 2, price: 25000 }],
  created_at: new Date(0),
  ...over,
});

describe('som', () => {
  it('formats thousands with a space and appends "so\'m"', () => {
    expect(som(120000)).toBe(`120 000 so'm`);
  });

  it('formats small numbers without separators', () => {
    expect(som(500)).toBe(`500 so'm`);
  });

  it('formats zero', () => {
    expect(som(0)).toBe(`0 so'm`);
  });
});

describe('STATUS_UZ', () => {
  it('has a label for every order status', () => {
    expect(Object.keys(STATUS_UZ).sort()).toEqual(
      ['CANCELLED', 'CONFIRMED', 'DELIVERED', 'NEW'],
    );
  });

  it('maps statuses to their Uzbek labels', () => {
    expect(STATUS_UZ.NEW).toBe('🆕 Yangi');
    expect(STATUS_UZ.CONFIRMED).toBe('✅ Tasdiqlangan');
    expect(STATUS_UZ.DELIVERED).toBe('🚚 Yetkazilgan');
    expect(STATUS_UZ.CANCELLED).toBe('❌ Bekor qilingan');
  });
});

describe('texts.start', () => {
  it('greets the user without the admin line', () => {
    const t = texts.start('Azizbek', false);
    expect(t).toContain('Salom, Azizbek!');
    expect(t).toContain('/catalog');
    expect(t).toContain('/cart');
    expect(t).toContain('/help');
    expect(t).not.toContain('/orders');
  });

  it('adds the /orders line for admins', () => {
    expect(texts.start('Admin', true)).toContain('/orders — buyurtmalar (admin)');
  });
});

describe('texts.help', () => {
  it('lists the commands', () => {
    expect(texts.help).toContain('/catalog');
    expect(texts.help).toContain('/cart');
    expect(texts.help).toContain('/start');
  });
});

describe('texts.catalogTitle', () => {
  it('uses 1-based page numbers', () => {
    expect(texts.catalogTitle(0, 3)).toBe(
      "Katalog (1/3-sahifa). Qo'shish uchun mahsulotni bosing:",
    );
  });
});

describe('texts.added', () => {
  it('names the product and quantity', () => {
    expect(texts.added(product({ name: 'Cola' }), 3)).toBe(
      "Cola savatga qo'shildi (3 ta).",
    );
  });
});

describe('texts.cart', () => {
  it('lists items with price × qty and the total', () => {
    const items: CartItem[] = [{ id: 1, product: product(), qty: 2 } as CartItem];
    const t = texts.cart(items, 50000);
    expect(t).toBe(
      `Savat:\n• Lavash × 2 = ${som(50000)}\n\nJami: ${som(50000)}`,
    );
  });

  it('lists several items on separate lines', () => {
    const items = [
      { id: 1, product: product({ name: 'A', price: 1000 }), qty: 1 },
      { id: 2, product: product({ id: 2, name: 'B', price: 2000 }), qty: 3 },
    ] as CartItem[];
    const t = texts.cart(items, 7000);
    expect(t).toContain(`• A × 1 = ${som(1000)}`);
    expect(t).toContain(`• B × 3 = ${som(6000)}`);
  });
});

describe('texts.cartEmpty / cartCleared / askPhone / badPhone / unknown', () => {
  it('has fixed messages', () => {
    expect(texts.cartEmpty).toBe("Savat bo'sh. /catalog dan mahsulot tanlang.");
    expect(texts.cartCleared).toBe('Savat tozalandi.');
    expect(texts.askPhone).toContain('+998901234567');
    expect(texts.badPhone).toBe("Raqam noto'g'ri. Masalan: +998901234567");
    expect(texts.unknown).toBe('Tushunmadim. /help ni bosing.');
  });
});

describe('texts.orderPlaced', () => {
  it('shows id, items, total, phone and status', () => {
    const t = texts.orderPlaced(order());
    expect(t).toContain('Buyurtma #42 qabul qilindi!');
    expect(t).toContain(`• Lavash × 2 = ${som(50000)}`);
    expect(t).toContain(`Jami: ${som(50000)}`);
    expect(t).toContain('Telefon: +998901234567');
    expect(t).toContain(`Holati: ${STATUS_UZ.NEW}`);
  });

  it('uses the price stored on the order item, not the current product price', () => {
    const o = order({
      items: [
        { id: 1, order: {} as Order, product: product({ price: 99000 }), qty: 1, price: 25000 },
      ],
    });
    expect(texts.orderPlaced(o)).toContain(`• Lavash × 1 = ${som(25000)}`);
  });
});

describe('texts.orderFailed', () => {
  it('includes the reason', () => {
    expect(texts.orderFailed('omborda yetarli emas')).toBe(
      'Buyurtma berilmadi: omborda yetarli emas',
    );
  });
});

describe('texts.adminNewOrder', () => {
  it('names the order, customer and total', () => {
    expect(texts.adminNewOrder(order(), 'Azizbek')).toBe(
      `🆕 Yangi buyurtma #42 — Azizbek, ${som(50000)}. /orders`,
    );
  });
});

describe('texts.adminOnly / noOrders', () => {
  it('has fixed messages', () => {
    expect(texts.adminOnly).toBe('Bu buyruq faqat admin uchun.');
    expect(texts.noOrders).toBe("Hozircha buyurtma yo'q.");
  });
});

describe('texts.orderLine', () => {
  it('shows id, customer, total, status and item names with qty', () => {
    const t = texts.orderLine(order());
    expect(t).toBe(
      `#42 · Azizbek · ${som(50000)} · ${STATUS_UZ.NEW}\n   Lavash × 2`,
    );
  });
});

describe('texts.statusChanged / customerStatus', () => {
  it('shows the new status for admin', () => {
    expect(texts.statusChanged(order({ status: 'CONFIRMED' }))).toBe(
      `#42 → ${STATUS_UZ.CONFIRMED}`,
    );
  });

  it('shows the new status for the customer', () => {
    expect(texts.customerStatus(order({ status: 'DELIVERED' }))).toBe(
      `Buyurtmangiz #42: ${STATUS_UZ.DELIVERED}`,
    );
  });
});
