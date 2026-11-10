import { CartItem, Order, OrderItem, Product, User } from '../../core/entity';
import { OrderService } from './order.service';

// Tranzaksiya ichidagi EntityManager'ni soxtalaymiz: findOne, create, save, delete, query
function setup(products: Record<number, Product | null>) {
  const manager = {
    findOne: jest.fn(async (_entity: unknown, opts: { where: { id: number } }) =>
      products[opts.where.id] ?? null,
    ),
    query: jest.fn(async () => []),
    create: jest.fn((_entity: unknown, data: object) => ({ ...data })),
    save: jest.fn(async (entity: object) => ({ id: 99, ...entity })),
    delete: jest.fn(async () => ({ affected: 1 })),
  };
  const ds = {
    transaction: jest.fn((cb: (m: typeof manager) => Promise<unknown>) => cb(manager)),
  };
  const repo = {};
  const service = new OrderService(repo as never, ds as never);
  return { service, manager, ds };
}

const user = (over: Partial<User> = {}): User =>
  ({ id: 1, telegram_id: '42', name: 'Ali', phone: '+998901234567', role: 'customer', state: 'IDLE', ...over }) as User;

const product = (id: number, name: string, price: number, stock: number): Product =>
  ({ id, name, price, stock }) as Product;

const cartItem = (p: Product, qty: number): CartItem => ({ product: p, qty }) as CartItem;

describe('OrderService.place', () => {
  it("telefon raqami yo'q bo'lsa xato beradi va tranzaksiya boshlanmaydi", () => {
    const p = product(1, 'Non', 5000, 10);
    const { service, ds } = setup({ 1: p });
    expect(() => service.place(user({ phone: null }), [cartItem(p, 1)])).toThrow(
      "Telefon raqami yo'q",
    );
    expect(ds.transaction).not.toHaveBeenCalled();
  });

  it("telefon matn bo'sh bo'lsa ham «yo'q» deb hisoblanadi", () => {
    const p = product(1, 'Non', 5000, 10);
    const { service, ds } = setup({ 1: p });
    expect(() => service.place(user({ phone: '' }), [cartItem(p, 1)])).toThrow(
      "Telefon raqami yo'q",
    );
    expect(ds.transaction).not.toHaveBeenCalled();
  });

  it("savat bo'sh bo'lsa xato beradi va tranzaksiya boshlanmaydi", () => {
    const { service, ds } = setup({});
    expect(() => service.place(user(), [])).toThrow("Savat bo'sh");
    expect(ds.transaction).not.toHaveBeenCalled();
  });

  it('telefon tekshiruvi savat tekshiruvidan oldin turadi', () => {
    const { service } = setup({});
    expect(() => service.place(user({ phone: null }), [])).toThrow(
      "Telefon raqami yo'q",
    );
  });

  it("mahsulot bazada topilmasa «Mahsulot topilmadi» xatosi", async () => {
    const p = product(1, 'Non', 5000, 10);
    const { service, manager } = setup({});
    await expect(service.place(user(), [cartItem(p, 1)])).rejects.toThrow(
      'Mahsulot topilmadi: Non',
    );
    expect(manager.query).not.toHaveBeenCalled();
    expect(manager.save).not.toHaveBeenCalled();
  });

  it('omborda yetarli bo\'lmasa xato, ombor ayrilmaydi', async () => {
    const p = product(1, 'Non', 5000, 2);
    const { service, manager } = setup({ 1: p });
    await expect(service.place(user(), [cartItem(p, 3)])).rejects.toThrow(
      'Non: omborda faqat 2 ta qoldi',
    );
    expect(manager.query).not.toHaveBeenCalled();
  });

  it('qoldiq savatdagi miqdorga aynan teng bo\'lsa buyurtma qabul qilinadi (chegara)', async () => {
    const p = product(1, 'Non', 5000, 3);
    const { service, manager } = setup({ 1: p });
    await expect(service.place(user(), [cartItem(p, 3)])).resolves.toBeDefined();
    expect(manager.query).toHaveBeenCalledWith(
      'UPDATE products SET stock = stock - $1 WHERE id = $2',
      [3, 1],
    );
  });

  it('bir nechta mahsulotda jami summa narx × miqdor yig\'indisi bo\'ladi', async () => {
    const a = product(1, 'Non', 5000, 10);
    const b = product(2, 'Sut', 12000, 10);
    const { service, manager } = setup({ 1: a, 2: b });
    const order = await service.place(user(), [cartItem(a, 2), cartItem(b, 3)]);
    expect(order.total).toBe(2 * 5000 + 3 * 12000);
    expect(order.items).toHaveLength(2);
    expect(manager.query).toHaveBeenCalledTimes(2);
  });

  it('buyurtma IDLE-holatdagi foydalanuvchi telefoni bilan NEW status oladi', async () => {
    const p = product(1, 'Non', 5000, 10);
    const { service, manager } = setup({ 1: p });
    const u = user({ phone: '+998901234567' });
    const order = await service.place(u, [cartItem(p, 1)]);
    expect(manager.create).toHaveBeenCalledWith(
      Order,
      expect.objectContaining({ user: u, phone: '+998901234567', status: 'NEW' }),
    );
    expect(order.status).toBe('NEW');
  });

  it('OrderItem narx buyurtma paytidagi mahsulot narxidan olinadi', async () => {
    const p = product(1, 'Non', 5000, 10);
    const { service, manager } = setup({ 1: p });
    await service.place(user(), [cartItem(p, 2)]);
    expect(manager.create).toHaveBeenCalledWith(
      OrderItem,
      expect.objectContaining({ product: p, qty: 2, price: 5000 }),
    );
  });

  it('muvaffaqiyatli buyurtmadan keyin savat foydalanuvchi uchun o\'chiriladi', async () => {
    const p = product(1, 'Non', 5000, 10);
    const { service, manager } = setup({ 1: p });
    await service.place(user({ id: 7 }), [cartItem(p, 1)]);
    expect(manager.delete).toHaveBeenCalledWith(CartItem, { user: { id: 7 } });
  });

  it('ikkinchi mahsulot yetishmasa xato tranzaksiyadan yuqoriga chiqadi', async () => {
    const a = product(1, 'Non', 5000, 10);
    const b = product(2, 'Sut', 12000, 0);
    const { service, manager, ds } = setup({ 1: a, 2: b });
    await expect(service.place(user(), [cartItem(a, 1), cartItem(b, 1)])).rejects.toThrow(
      'Sut: omborda faqat 0 ta qoldi',
    );
    expect(ds.transaction).toHaveBeenCalledTimes(1);
    expect(manager.save).not.toHaveBeenCalled();
    expect(manager.delete).not.toHaveBeenCalled();
  });
});
