# 2-AI (Haiku) — p2 javobi, aynan (26.11, agent yakuniy hisoboti)

OrderBotNest (…/jest2p2-ai2/OrderBotNest) ga testlar qo'shildi. npm test yashil: 4 suite, 23 test (oldin 2 suite, 10 test). npx tsc --noEmit xatosiz. Commit, push yo'q.

Fayllar:
- YANGI src/api/telegram/phone.ts: isPhone(text) funksiyasi. Regex o'zgarmagan: /^\+?\d{9,13}$/ (telegram.service.ts dagi PHONE shu yerga ko'chirildi).
- O'ZGARDI src/api/telegram/telegram.service.ts: PHONE konstantasi olib tashlandi, import { isPhone } from './phone' qo'shildi, onText да `if (!isPhone(phone))` deb chaqiradi. Boshqa kod tegilmadi.
- YANGI src/api/telegram/phone.spec.ts: it.each bilan 9 holat — to'g'ri (+ bilan va +siz), eng qisqa 9 raqam, eng uzun 13 raqam (true), 8 raqam va 14 raqam (false), harf, bo'sh satr, probelli raqam (false).
- YANGI src/api/order/order.service.spec.ts: Test.createTestingModule, getRepositoryToken(Order) va DataSource uchun mock; ds.transaction jest.fn (manager'ni callback'ga beradi), manager.findOne / query / create / save / delete jest.fn.
  - telefon yo'q: expect(() => …).toThrow("Telefon raqami yo'q"); transaction va query chaqirilmagani tekshiriladi.
  - savat bo'sh: expect(() => …).toThrow("Savat bo'sh"); transaction va query chaqirilmagani tekshiriladi.
  - omborda yetmaydi (stock 1, olinadi 2): await expect(…).rejects.toThrow("Olma: omborda faqat 1 ta qoldi"); query (UPDATE) chaqirilmagani tekshiriladi.
  - chegara (stock 2, olinadi 2): resolves; UPDATE products [2, 1] bilan chaqirilgani tekshiriladi.
Xato xabarlari qo'lda yozilgan (koddan nusxa olinmagan).
