import { User } from '../../core/entity';
import { CartService } from '../cart/cart.service';
import { CatalogService } from '../catalog/catalog.service';
import { OrderService } from '../order/order.service';
import { UserService } from '../user/user.service';
import { TelegramService } from './telegram.service';
import { texts } from './texts';

// Telefon tekshiruvi (PHONE regex) eksport qilinmagan — uni haqiqiy yo'li orqali,
// onText handleri orqali sinaymiz. Bot (Telegraf) ishga tushmaydi: onModuleInit chaqirilmaydi.
const setup = (state: User['state'] = 'WAITING_PHONE') => {
  const user = {
    id: 1,
    telegram_id: '5123456789',
    name: 'Ali',
    phone: null,
    role: 'customer',
    state,
  } as User;
  const users = {
    getOrCreate: jest.fn(async () => user),
    setPhone: jest.fn(async (u: User, phone: string) => {
      u.phone = phone;
      u.state = 'IDLE';
      return u;
    }),
    setState: jest.fn(),
    admins: jest.fn(async () => [] as User[]),
  };
  const cart = { list: jest.fn(async () => []) };
  const orders = {
    place: jest.fn(async () => ({
      id: 7,
      phone: user.phone,
      total: 0,
      status: 'NEW',
      items: [],
    })),
  };
  const service = new TelegramService(
    users as unknown as UserService,
    {} as CatalogService,
    cart as unknown as CartService,
    orders as unknown as OrderService,
  );
  const send = async (text: string) => {
    const ctx = {
      from: { id: 5123456789, first_name: 'Ali' },
      message: { text },
      reply: jest.fn(async () => undefined),
    };
    await (service as any).onText(ctx);
    return ctx.reply;
  };
  return { send, users, orders, user };
};

describe('Telefon raqami — qabul qilinadi', () => {
  it.each([
    ['+998 bilan 12 raqam', '+998901234567'],
    ['+ siz', '998901234567'],
    ['eng qisqa: 9 raqam', '901234567'],
    ['eng uzun: 13 raqam', '+1234567890123'],
  ])('%s: %s', async (_n, phone) => {
    const { send, users, orders } = setup();
    await send(phone);
    expect(users.setPhone).toHaveBeenCalledWith(expect.anything(), phone);
    expect(orders.place).toHaveBeenCalledTimes(1);
  });

  it('chetdagi probel va qator oxiri kesiladi, bazaga toza raqam yoziladi', async () => {
    const { send, users } = setup();
    await send('  +998901234567 \n');
    expect(users.setPhone).toHaveBeenCalledWith(
      expect.anything(),
      '+998901234567',
    );
  });
});

describe('Telefon raqami — rad etiladi', () => {
  it.each([
    ["bo'sh", ''],
    ['faqat probel', '   '],
    ['8 raqam (bittasi kam)', '12345678'],
    ['14 raqam (bittasi ortiq)', '+12345678901234'],
    ['faqat +', '+'],
    ['ikkita +', '++998901234567'],
    ['+ oxirida', '998901234567+'],
    ["o'rtada probel", '+998 90 123 45 67'],
    ['chiziqcha', '+998-90-123-45-67'],
    ['qavs', '+998(90)1234567'],
    ['harf', '+99890123456a'],
    ['matn', "raqamim yo'q"],
    ["o'rtada qator ko'chishi", '+998901\n234567'],
    ['arabcha raqamlar', '٩٩٨٩٠١٢٣٤٥٦٧'],
    ["to'liq kenglikdagi raqamlar", '９９８９０１２３４５６７'],
  ])('%s: %j', async (_n, phone) => {
    const { send, users, orders } = setup();
    const reply = await send(phone);
    expect(reply).toHaveBeenCalledWith(texts.badPhone);
    expect(users.setPhone).not.toHaveBeenCalled();
    expect(orders.place).not.toHaveBeenCalled();
  });

  it("noto'g'ri raqamdan keyin holat o'zgarmaydi — keyingi to'g'ri raqam qabul qilinadi", async () => {
    const { send, users, user } = setup();
    await send('123');
    expect(user.state).toBe('WAITING_PHONE');
    expect(users.setState).not.toHaveBeenCalled();
    await send('+998901234567');
    expect(users.setPhone).toHaveBeenCalledTimes(1);
    expect(user.state).toBe('IDLE');
  });
});

describe('Telefon kutilmayotganda', () => {
  it("raqamga o'xshash matn telefon sifatida saqlanmaydi", async () => {
    const { send, users, orders } = setup('IDLE');
    const reply = await send('+998901234567');
    expect(reply).toHaveBeenCalledWith(texts.unknown);
    expect(users.setPhone).not.toHaveBeenCalled();
    expect(orders.place).not.toHaveBeenCalled();
  });
});

describe("To'g'ri raqam, lekin buyurtma yiqildi", () => {
  it('place xatosi foydalanuvchiga matn bilan qaytadi, bot yiqilmaydi', async () => {
    const { send, orders, users } = setup();
    orders.place.mockRejectedValueOnce(
      new Error('M1: omborda faqat 0 ta qoldi'),
    );
    const reply = await send('+998901234567');
    expect(users.setPhone).toHaveBeenCalledTimes(1);
    expect(reply).toHaveBeenCalledWith(
      texts.orderFailed('M1: omborda faqat 0 ta qoldi'),
    );
  });

  it("savat orada bo'shab qolsa — «Savat bo'sh» xabari", async () => {
    const { send, orders } = setup();
    orders.place.mockImplementationOnce(() => {
      // haqiqiy place() bu xatoni sinxron otadi
      throw new Error("Savat bo'sh");
    });
    const reply = await send('+998901234567');
    expect(reply).toHaveBeenCalledWith(texts.orderFailed("Savat bo'sh"));
  });
});
