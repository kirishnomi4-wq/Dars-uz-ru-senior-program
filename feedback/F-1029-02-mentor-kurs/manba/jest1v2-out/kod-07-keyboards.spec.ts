import { Order } from '../../core/entity';
import { catalogKeyboard, orderKeyboard } from './keyboards';

// Faqat tugmalar matni va callback'i — qolgani bizga kerak emas
const buttons = (kb: ReturnType<typeof orderKeyboard>) =>
  kb?.reply_markup.inline_keyboard.map((row) =>
    row.map((b) => [b.text, 'callback_data' in b ? b.callback_data : '']),
  );

const order = (status: Order['status']) => ({ id: 7, status }) as Order;

describe('orderKeyboard', () => {
  it('yangi buyurtma — Tasdiqlash va Bekor', () => {
    expect(buttons(orderKeyboard(order('NEW')))).toEqual([
      [
        ['✅ Tasdiqlash', 'status:7:CONFIRMED'],
        ['❌ Bekor', 'status:7:CANCELLED'],
      ],
    ]);
  });

  it('tasdiqlangan — Yetkazildi va Bekor', () => {
    expect(buttons(orderKeyboard(order('CONFIRMED')))).toEqual([
      [
        ['🚚 Yetkazildi', 'status:7:DELIVERED'],
        ['❌ Bekor', 'status:7:CANCELLED'],
      ],
    ]);
  });

  it("yetkazilgan va bekor qilingan — tugma yo'q", () => {
    expect(orderKeyboard(order('DELIVERED'))).toBeUndefined();
    expect(orderKeyboard(order('CANCELLED'))).toBeUndefined();
  });
});
