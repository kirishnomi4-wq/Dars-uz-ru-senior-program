import { DataSource, Repository } from 'typeorm';
import { CartItem, Order, Product, User } from '../../core/entity';
import { OrderService } from './order.service';

// Baza yo'q: DataSource.transaction callback'ni soxta EntityManager bilan chaqiradi.
// Ombor — oddiy Map (id → mahsulot). Shu Map bazadagi "products" jadvali o'rnida.
const setup = (stock: Product[]) => {
  const db = new Map(stock.map((p) => [p.id, { ...p }]));
  const m = {
    findOne: jest.fn(async (_e: unknown, opts: { where: { id: number } }) => {
      const p = db.get(opts.where.id);
      return p ? { ...p } : null;
    }),
    query: jest.fn(async () => undefined),
    create: jest.fn((_e: unknown, data: object) => ({ ...data })),
    save: jest.fn(async (o: object) => ({ id: 101, ...o })),
    delete: jest.fn(async () => undefined),
  };
  const ds = {
    transaction: jest.fn((fn: (mgr: typeof m) => Promise<unknown>) => fn(m)),
  } as unknown as DataSource;
  const service = new OrderService({} as Repository<Order>, ds);
  return { service, m, ds };
};

const product = (id: number, stock: number, price = 10000) =>
  ({ id, name: `M${id}`, price, stock }) as Product;

const user = (phone: string | null = '+998901234567') =>
  ({ id: 1, telegram_id: '5123456789', name: 'Ali', phone }) as User;

const line = (p: Product, qty: number) => ({ product: p, qty }) as CartItem;

// place() xatoni sinxron otadi (async emas). async o'ram ikkala holatni ham
// rejected promise'ga aylantiradi — test ichki ko'rinishga bog'lanmaydi.
const run = (s: OrderService, u: User, cart: CartItem[]) =>
  (async () => s.place(u, cart))();

describe('OrderService.place — kirish tekshiruvi', () => {
  it.each([
    ['null', null],
    ["bo'sh satr", ''],
  ])('telefon %s — rad, tranzaksiya ochilmaydi', async (_n, phone) => {
    const { service, ds } = setup([product(1, 5)]);
    await expect(
      run(service, user(phone), [line(product(1, 5), 1)]),
    ).rejects.toThrow("Telefon raqami yo'q");
    expect(ds.transaction).not.toHaveBeenCalled();
  });

  it("savat bo'sh — rad, tranzaksiya ochilmaydi", async () => {
    const { service, ds } = setup([]);
    await expect(run(service, user(), [])).rejects.toThrow("Savat bo'sh");
    expect(ds.transaction).not.toHaveBeenCalled();
  });

  it("telefon ham, savat ham yo'q — avval telefon xatosi", async () => {
    const { service } = setup([]);
    await expect(run(service, user(null), [])).rejects.toThrow(
      "Telefon raqami yo'q",
    );
  });
});

describe('OrderService.place — ombor', () => {
  it('mahsulot bazada topilmasa — nomi bilan xato, hech narsa yozilmaydi', async () => {
    const { service, m } = setup([]);
    const ghost = {
      id: 9,
      name: "O'chirilgan choy",
      price: 1,
      stock: 1,
    } as Product;
    await expect(run(service, user(), [line(ghost, 1)])).rejects.toThrow(
      "Mahsulot topilmadi: O'chirilgan choy",
    );
    expect(m.query).not.toHaveBeenCalled();
    expect(m.save).not.toHaveBeenCalled();
    expect(m.delete).not.toHaveBeenCalled();
  });

  it('qoldiq yetmasa — bazadagi qoldiq bilan xato', async () => {
    const { service, m } = setup([product(1, 2)]);
    await expect(
      run(service, user(), [line(product(1, 2), 3)]),
    ).rejects.toThrow('M1: omborda faqat 2 ta qoldi');
    expect(m.query).not.toHaveBeenCalled();
    expect(m.save).not.toHaveBeenCalled();
  });

  it('qoldiq 0 — bitta ham sotilmaydi', async () => {
    const { service } = setup([product(1, 0)]);
    await expect(
      run(service, user(), [line(product(1, 0), 1)]),
    ).rejects.toThrow('M1: omborda faqat 0 ta qoldi');
  });

  it("chegara: qty === stock — o'tadi (oxirgi donalar sotiladi)", async () => {
    const { service, m } = setup([product(1, 3)]);
    await expect(
      run(service, user(), [line(product(1, 3), 3)]),
    ).resolves.toBeDefined();
    expect(m.query).toHaveBeenCalledWith(
      'UPDATE products SET stock = stock - $1 WHERE id = $2',
      [3, 1],
    );
  });

  it('savatdagi eski stock emas, bazadagisi tekshiriladi', async () => {
    // Savatga qo'shilganda 10 ta bor edi, hozir bazada 1 ta qoldi
    const { service } = setup([product(1, 1)]);
    await expect(
      run(service, user(), [line(product(1, 10), 2)]),
    ).rejects.toThrow('M1: omborda faqat 1 ta qoldi');
  });

  it("qator qulflab o'qiladi (SELECT ... FOR UPDATE)", async () => {
    const { service, m } = setup([product(1, 5)]);
    await run(service, user(), [line(product(1, 5), 1)]);
    expect(m.findOne).toHaveBeenCalledWith(Product, {
      where: { id: 1 },
      lock: { mode: 'pessimistic_write' },
    });
  });

  it('ikkinchi mahsulot yetmasa — butun buyurtma yiqiladi, saqlanmaydi, savat qoladi', async () => {
    const { service, m, ds } = setup([product(1, 5), product(2, 1)]);
    const p = run(service, user(), [
      line(product(1, 5), 2),
      line(product(2, 1), 4),
    ]);
    await expect(p).rejects.toThrow('M2: omborda faqat 1 ta qoldi');
    // Birinchisi ayirilgan — shuning uchun hammasi bitta tranzaksiyada:
    // xato tranzaksiyadan tashqariga chiqsa, TypeORM ROLLBACK qiladi
    expect(ds.transaction).toHaveBeenCalledTimes(1);
    expect(m.query).toHaveBeenCalledTimes(1);
    expect(m.save).not.toHaveBeenCalled();
    expect(m.delete).not.toHaveBeenCalled();
  });

  it('UPDATE yiqilsa (masalan CHECK stock >= 0) — xato yuqoriga chiqadi, saqlanmaydi', async () => {
    const { service, m } = setup([product(1, 5)]);
    m.query.mockRejectedValueOnce(
      new Error('new row violates check constraint "products_stock_check"'),
    );
    await expect(
      run(service, user(), [line(product(1, 5), 1)]),
    ).rejects.toThrow('check constraint');
    expect(m.save).not.toHaveBeenCalled();
    expect(m.delete).not.toHaveBeenCalled();
  });

  it('save yiqilsa — savat tozalanmaydi', async () => {
    const { service, m } = setup([product(1, 5)]);
    m.save.mockRejectedValueOnce(new Error('connection lost'));
    await expect(
      run(service, user(), [line(product(1, 5), 1)]),
    ).rejects.toThrow('connection lost');
    expect(m.delete).not.toHaveBeenCalled();
  });
});

describe('OrderService.place — muvaffaqiyatli buyurtma', () => {
  it('jami, telefon, status, qatorlar va savat tozalash', async () => {
    const { service, m } = setup([product(1, 5, 12000), product(2, 9, 3500)]);
    const u = user();
    const order = await service.place(u, [
      line(product(1, 5, 12000), 2),
      line(product(2, 9, 3500), 3),
    ]);

    expect(order).toMatchObject({
      id: 101,
      user: u,
      phone: '+998901234567',
      status: 'NEW',
      total: 2 * 12000 + 3 * 3500,
    });
    expect(order.items.map((i) => [i.product.id, i.qty, i.price])).toEqual([
      [1, 2, 12000],
      [2, 3, 3500],
    ]);
    expect(m.query).toHaveBeenNthCalledWith(1, expect.any(String), [2, 1]);
    expect(m.query).toHaveBeenNthCalledWith(2, expect.any(String), [3, 2]);
    expect(m.delete).toHaveBeenCalledWith(CartItem, { user: { id: 1 } });
  });

  it("narx savatdan emas, bazadan olinadi (narx o'zgargan bo'lsa)", async () => {
    // Savatdagi nusxada eski narx 9000, bazada hozir 11000
    const { service } = setup([product(1, 5, 11000)]);
    const order = await service.place(user(), [line(product(1, 5, 9000), 2)]);
    expect(order.items[0].price).toBe(11000);
    expect(order.total).toBe(22000);
  });

  it('savat buyurtma saqlangandan KEYIN tozalanadi', async () => {
    const { service, m } = setup([product(1, 5)]);
    await service.place(user(), [line(product(1, 5), 1)]);
    const saveAt = m.save.mock.invocationCallOrder[0];
    const deleteAt = m.delete.mock.invocationCallOrder[0];
    expect(saveAt).toBeLessThan(deleteAt);
  });
});
