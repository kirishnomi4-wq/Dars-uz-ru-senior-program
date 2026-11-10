import { Order, User } from '../../core/entity';
import { texts } from './texts';
import { TelegramService } from './telegram.service';

// Telefon tekshiruvi (PHONE regex) onText ichida yashaydi. Bot ishga tushmaydi:
// onText'ni bevosita chaqiramiz, bog'liqliklar soxta.
function setup(state: User['state'] = 'WAITING_PHONE') {
  const user = { id: 1, telegram_id: '42', name: 'Ali', phone: null, role: 'customer', state } as User;
  const users = {
    getOrCreate: jest.fn(async () => user),
    setPhone: jest.fn(async (u: User, phone: string) => {
      u.phone = phone;
      u.state = 'IDLE';
      return u;
    }),
    admins: jest.fn(async () => []),
  };
  const cart = { list: jest.fn(async () => [{ product: { price: 1, id: 1 }, qty: 1 }]) };
  const order = { id: 5 } as Order;
  const orders = { place: jest.fn(async () => order) };
  const service = new TelegramService(users as never, {} as never, cart as never, orders as never);
  const bot = { telegram: { sendMessage: jest.fn(async () => ({})) } };
  (service as unknown as { bot: unknown }).bot = bot;
  const ctx = { from: { id: 42, first_name: 'Ali' }, message: { text: '' }, reply: jest.fn(async () => ({})) };
  const send = (text: string) => {
    ctx.message.text = text;
    return (service as unknown as { onText: (c: unknown) => Promise<unknown> }).onText(ctx);
  };
  return { service, users, orders, ctx, send };
}

describe('TelegramService.onText — telefon raqami tekshiruvi', () => {
  it.each([
    ['+998901234567', 'xalqaro + bilan, 12 raqam'],
    ['998901234567', '+ siz, 12 raqam'],
    ['123456789', 'eng kam — 9 raqam'],
    ['1234567890123', 'eng ko\'p — 13 raqam'],
    ['+123456789', '+ bilan 9 raqam'],
    ['  +998901234567  ', 'boshida va oxirida bo\'sh joy (trim)'],
    ['+998901234567\n', 'oxirida yangi qator (trim)'],
  ])('qabul qilinadi: %s (%s)', async (phone) => {
    const { users, orders, ctx, send } = setup();
    await send(phone);
    expect(users.setPhone).toHaveBeenCalledWith(expect.anything(), phone.trim());
    expect(orders.place).toHaveBeenCalledTimes(1);
    expect(ctx.reply).not.toHaveBeenCalledWith(texts.badPhone);
  });

  it.each([
    ['12345678', '8 raqam — kam'],
    ['12345678901234', '14 raqam — ko\'p'],
    ['+12345678', '+ bilan 8 raqam'],
    ['+', 'faqat +'],
    ['', 'bo\'sh matn'],
    ['   ', 'faqat bo\'shliq'],
    ['++998901234567', 'ikki +'],
    ['+998 90 123 45 67', 'ichida bo\'shliq'],
    ['+998-90-123-45-67', 'ichida defis'],
    ['+998901234abc', 'harf bor'],
    ['tel: +998901234567', 'ortiqcha matn bor'],
  ])('rad etiladi: %j (%s)', async (phone) => {
    const { users, orders, ctx, send } = setup();
    await send(phone);
    expect(users.setPhone).not.toHaveBeenCalled();
    expect(orders.place).not.toHaveBeenCalled();
    expect(ctx.reply).toHaveBeenCalledWith(texts.badPhone);
  });

  it('noto\'g\'ri raqamda foydalanuvchi holati o\'zgarmaydi (WAITING_PHONE qoladi)', async () => {
    const { users, send } = setup('WAITING_PHONE');
    await send('abc');
    expect(users.setPhone).not.toHaveBeenCalled();
  });

  it('telefon kutilmayotgan (IDLE) bo\'lsa matn tekshirilmaydi, «tushunmadim» javobi', async () => {
    const { users, orders, ctx, send } = setup('IDLE');
    await send('+998901234567');
    expect(users.setPhone).not.toHaveBeenCalled();
    expect(orders.place).not.toHaveBeenCalled();
    expect(ctx.reply).toHaveBeenCalledWith(texts.unknown);
  });
});
