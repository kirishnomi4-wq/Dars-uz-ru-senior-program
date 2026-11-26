import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CartItem, Order, Product, User } from '../../core/entity';
import { OrderService } from './order.service';

// Baza yo'q: tranzaksiya ichidagi manager — jest.fn'lardan yig'ilgan soxta obyekt
const user = (phone: string | null) =>
  ({ id: 1, name: 'Ali', phone }) as User;
const product = (stock: number) =>
  ({ id: 5, name: 'Lavash', price: 25000, stock }) as Product;
const cartItem = (qty: number) =>
  ({ id: 1, product: product(10), qty }) as CartItem;

describe('OrderService.place', () => {
  let service: OrderService;
  let ds: { transaction: jest.Mock };
  let manager: {
    findOne: jest.Mock;
    query: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    manager = {
      findOne: jest.fn(),
      query: jest.fn(),
      create: jest.fn((_entity, data) => data),
      save: jest.fn(async (order) => ({ id: 42, ...order })),
      delete: jest.fn(),
    };
    ds = { transaction: jest.fn((work) => work(manager)) };

    const moduleRef = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useValue: {} },
        { provide: DataSource, useValue: ds },
      ],
    }).compile();
    service = moduleRef.get(OrderService);
  });

  it("telefon yo'q — sinxron xato, UPDATE ketmaydi", () => {
    expect(() => service.place(user(null), [cartItem(1)])).toThrow(
      "Telefon raqami yo'q",
    );
    expect(ds.transaction).not.toHaveBeenCalled();
    expect(manager.query).not.toHaveBeenCalled();
  });

  it("savat bo'sh — sinxron xato, UPDATE ketmaydi", () => {
    expect(() => service.place(user('+998901234567'), [])).toThrow(
      "Savat bo'sh",
    );
    expect(ds.transaction).not.toHaveBeenCalled();
    expect(manager.query).not.toHaveBeenCalled();
  });

  it('omborda yetmaydi — promise rad etiladi, UPDATE ketmaydi', async () => {
    manager.findOne.mockResolvedValue(product(1));

    await expect(
      service.place(user('+998901234567'), [cartItem(2)]),
    ).rejects.toThrow('Lavash: omborda faqat 1 ta qoldi');
    expect(manager.query).not.toHaveBeenCalled();
    expect(manager.save).not.toHaveBeenCalled();
  });

  it("chegara: omborda aynan 2 ta, 2 ta olinadi — o'tadi", async () => {
    manager.findOne.mockResolvedValue(product(2));

    const order = await service.place(user('+998901234567'), [cartItem(2)]);

    expect(manager.query).toHaveBeenCalledTimes(1);
    expect(manager.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE products SET stock = stock -'),
      [2, 5],
    );
    expect(order).toMatchObject({
      id: 42,
      phone: '+998901234567',
      status: 'NEW',
      total: 50000,
    });
  });
});
