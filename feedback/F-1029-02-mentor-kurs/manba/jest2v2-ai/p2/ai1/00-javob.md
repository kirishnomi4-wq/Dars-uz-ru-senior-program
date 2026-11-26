# 1-AI (Opus) — p2 javobi, aynan (26.11, agent yakuniy hisoboti)

`npm test` yashil: 4 suite, 23 test o'tdi (avval 10 ta edi). `tsc --noEmit` ham xatosiz. Commit va push qilinmadi.

**Qo'shilgan fayllar**
- `src/api/telegram/phone.ts`: `isPhone(text)`, ichida eski `/^\+?\d{9,13}$/` qoidasi.
- `src/api/telegram/phone.spec.ts`: bitta `it.each` jadvalida 9 holat:
  - to'g'ri raqam, «+» bilan va «+»siz;
  - eng qisqa to'g'ri raqam (9 raqam) va eng uzuni (13 raqam);
  - bittaga qisqa (8) va bittaga uzun (14);
  - harf aralashgan, bo'sh satr, probel bilan yozilgan raqam.
- `src/api/order/order.service.spec.ts`: `Test.createTestingModule` ishlatiladi. `DataSource.transaction` mock'i soxta `manager`ni chaqiradi, unda `findOne` va `query` `jest.fn`. Repository o'rniga bo'sh obyekt qo'yildi. Testlar:
  - **telefon yo'q:** `expect(() => …).toThrow("Telefon raqami yo'q")`;
  - **savat bo'sh:** `expect(() => …).toThrow("Savat bo'sh")`;
  - bu ikkalasida tranzaksiya ham, `query` (UPDATE) ham chaqirilmagani `not.toHaveBeenCalled` bilan tekshiriladi;
  - **omborda yetmaydi** (omborda 1, so'raladi 2): `await expect(…).rejects.toThrow('Lavash: omborda faqat 1 ta qoldi')`, keyin `query` va `save` chaqirilmagani tekshiriladi;
  - **chegara** (omborda aynan 2, olinadi 2): buyurtma o'tadi, UPDATE bir marta `[2, 5]` bilan ketadi, natijada `total` 50000 va `status` `'NEW'`.

  Xato matnlari testga qo'lda yozildi, koddan olinmadi.

**O'zgargan fayl**
- `src/api/telegram/telegram.service.ts`: faqat 2 joy. `PHONE` olib tashlanib `./phone` dan import qilindi, `PHONE.test(phone)` o'rniga `isPhone(phone)` chaqiriladi. `.trim()` avvalgidek service ichida qoldi, xatti-harakat o'zgarmadi.

**Qanday tekshirdim**
- Testlar xatoni rostdan ushlashini sinab ko'rdim, kodni vaqtincha buzdim:
  - `p.stock < c.qty` ni `<=` qildim: chegara testi qizardi;
  - telefon qoidasidagi 9 ni 8 qildim: «bittaga qisqa» testi qizardi.
- Ikkala fayl qaytarib tiklandi: `git diff` da faqat `telegram.service.ts` dagi ikki qator bor.
- Telefon sinovi paytida zaxira nusxani bir lahza loyiha papkasidan bir pog'ona yuqoriga (`../phone.bak`) qo'ydim. U darhol o'chirildi, hozir u yerda faqat `OrderBotNest` bor.

**Bilish kerak:** chegara testi muvaffaqiyatli yo'lni oxirigacha bosib o'tadi, shuning uchun `findOne` va `query` dan tashqari `manager.create`, `save` va `delete` ham `jest.fn` qilindi. Busiz bu test ishlamaydi.
