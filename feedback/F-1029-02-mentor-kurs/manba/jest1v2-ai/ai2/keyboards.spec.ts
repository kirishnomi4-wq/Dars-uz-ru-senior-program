import { Order, Product } from '../../core/entity';
import { cartKeyboard, catalogKeyboard, orderKeyboard } from './keyboards';
import { som } from './texts';

const product = (over: Partial<Product> = {}): Product => ({
  id: 1,
  name: 'Lavash',
  price: 25000,
  stock: 10,
  ...over,
});

const order = (status: Order['status']): Order =>
  ({ id: 7, status } as unknown as Order);

// Telegraf dodaje "hide: false" — shuning uchun toMatchObject ishlatiladi
const rowsOf = (
  markup: { reply_markup: { inline_keyboard: unknown[][] } } | undefined,
) => markup!.reply_markup.inline_keyboard;

describe('catalogKeyboard', () => {
  it('makes an add button for an in-stock product with its price', () => {
    const kb = rowsOf(catalogKeyboard([product()], 0, 1));
    expect(kb[0]).toMatchObject([
      { text: `Lavash · ${som(25000)}`, callback_data: 'add:1' },
    ]);
  });

  it('makes a noop button for an out-of-stock product', () => {
    const kb = rowsOf(catalogKeyboard([product({ stock: 0 })], 0, 1));
    expect(kb[0]).toMatchObject([{ text: 'Lavash · tugagan', callback_data: 'noop' }]);
  });

  it('puts one row per product, then navigation, then the cart button', () => {
    const items = [product({ id: 1 }), product({ id: 2, name: 'Cola' })];
    const kb = rowsOf(catalogKeyboard(items, 0, 1));
    expect(kb).toHaveLength(4);
    expect(kb[2]).toMatchObject([{ text: '1/1', callback_data: 'noop' }]);
    expect(kb[3]).toMatchObject([{ text: '🛒 Savat', callback_data: 'cart' }]);
  });

  it('shows only the next arrow on the first of several pages', () => {
    const nav = rowsOf(catalogKeyboard([product()], 0, 3))[1];
    expect(nav).toMatchObject([
      { text: '1/3', callback_data: 'noop' },
      { text: '▶', callback_data: 'page:1' },
    ]);
  });

  it('shows both arrows on a middle page', () => {
    const nav = rowsOf(catalogKeyboard([product()], 1, 3))[1];
    expect(nav).toMatchObject([
      { text: '◀', callback_data: 'page:0' },
      { text: '2/3', callback_data: 'noop' },
      { text: '▶', callback_data: 'page:2' },
    ]);
  });

  it('shows only the previous arrow on the last page', () => {
    const nav = rowsOf(catalogKeyboard([product()], 2, 3))[1];
    expect(nav).toMatchObject([
      { text: '◀', callback_data: 'page:1' },
      { text: '3/3', callback_data: 'noop' },
    ]);
  });

  it('has no arrows when there is a single page', () => {
    const nav = rowsOf(catalogKeyboard([product()], 0, 1))[1];
    expect(nav).toMatchObject([{ text: '1/1', callback_data: 'noop' }]);
  });
});

describe('cartKeyboard', () => {
  it('offers checkout, clear and continue shopping', () => {
    expect(rowsOf(cartKeyboard())).toMatchObject([
      [{ text: '✅ Buyurtma berish', callback_data: 'checkout' }],
      [
        { text: '🗑 Tozalash', callback_data: 'cart:clear' },
        { text: '➕ Yana', callback_data: 'page:0' },
      ],
    ]);
  });
});

describe('orderKeyboard', () => {
  it('returns no keyboard for a delivered order', () => {
    expect(orderKeyboard(order('DELIVERED'))).toBeUndefined();
  });

  it('returns no keyboard for a cancelled order', () => {
    expect(orderKeyboard(order('CANCELLED'))).toBeUndefined();
  });

  it('offers confirm and cancel for a new order', () => {
    expect(rowsOf(orderKeyboard(order('NEW')))).toMatchObject([
      [
        { text: '✅ Tasdiqlash', callback_data: 'status:7:CONFIRMED' },
        { text: '❌ Bekor', callback_data: 'status:7:CANCELLED' },
      ],
    ]);
  });

  it('offers delivered and cancel for a confirmed order', () => {
    expect(rowsOf(orderKeyboard(order('CONFIRMED')))).toMatchObject([
      [
        { text: '🚚 Yetkazildi', callback_data: 'status:7:DELIVERED' },
        { text: '❌ Bekor', callback_data: 'status:7:CANCELLED' },
      ],
    ]);
  });
});
