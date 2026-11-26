import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CartItem, Order, Product, User } from '../../core/entity';
import { OrderService } from './order.service';

describe('OrderService.place — xato yo\'llari', () => {
  let service: OrderService;
  let manager: { findOne: jest.Mock; query: jest.Mock; create: jest.Mock; save: jest.Mock; delete: jest.Mock };
  let ds: { transaction: jest.Mock };

  const user = { id: 1, telegram_id: '111', name: 'Ali', phone: '+998901234567' } as unknown as User;
  const noPhoneUser = { ...user, phone: null } as unknown as User;
  const cartItem = (productId: number, name: string, qty: number) =>
    ({ product: { id: productId, name, price: 1000 }, qty }) as unknown as CartItem;

  beforeEach(async () => {
    manager = {
      findOne: jest.fn(),
      query: jest.fn().mockResolvedValue(undefined),
      create: jest.fn((_entity: unknown, data: object) => data),
      save: jest.fn(async (o: object) => o),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    ds = { transaction: jest.fn(async (cb: (m: unknown) => Promise<unknown>) => cb(manager)) };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useValue: {} },
        { provide: DataSource, useValue: ds },
      ],
    }).compile();

    service = moduleRef.get(OrderService);
  });

  it('telefon yo\'q — sinxron xato, tranzaksiya ochilmaydi', () => {
    expect(() => service.place(noPhoneUser, [cartItem(1, 'Olma', 1)])).toThrow(
      'Telefon raqami yo\'q',
    );
    expect(ds.transaction).not.toHaveBeenCalled();
    expect(manager.query).not.toHaveBeenCalled();
  });

  it('savat bo\'sh — sinxron xato, tranzaksiya ochilmaydi', () => {
    expect(() => service.place(user, [])).toThrow('Savat bo\'sh');
    expect(ds.transaction).not.toHaveBeenCalled();
    expect(manager.query).not.toHaveBeenCalled();
  });

  it('omborda yetmaydi — promise xatosi, UPDATE ketmaydi', async () => {
    manager.findOne.mockResolvedValue({ id: 1, name: 'Olma', price: 1000, stock: 1 });

    await expect(service.place(user, [cartItem(1, 'Olma', 2)])).rejects.toThrow(
      'Olma: omborda faqat 1 ta qoldi',
    );
    expect(manager.query).not.toHaveBeenCalled();
  });

  it('chegara: omborda aynan 2 ta, 2 ta olinadi — o\'tadi', async () => {
    manager.findOne.mockResolvedValue({ id: 1, name: 'Olma', price: 1000, stock: 2 });

    await expect(service.place(user, [cartItem(1, 'Olma', 2)])).resolves.toBeDefined();
    expect(manager.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE products'), [2, 1]);
  });
});
