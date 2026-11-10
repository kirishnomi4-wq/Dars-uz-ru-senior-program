import { Order } from '../../core/entity';
import { texts } from './texts';

const order = {
  id: 42,
  phone: '+998901234567',
  total: 50000,
  status: 'NEW',
  items: [{ product: { name: 'Kolonka', price: 50000 }, qty: 1, price: 50000 }],
} as unknown as Order;

describe('texts.orderPlaced', () => {
  it('buyurtma qatori va jami', () => {
    const t = texts.orderPlaced(order);
    expect(t).toContain('Buyurtma #42 qabul qilindi!');
    expect(t).toContain("Jami: 50\u00a0000 so'm");
    expect(t).toContain('Telefon: +998901234567');
  });
});
