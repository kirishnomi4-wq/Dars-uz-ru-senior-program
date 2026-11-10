# ai2 (kuchsizroq model — Haiku) javobi, aynan (04.11, 160 s, 13 vosita chaqiruvi)

OrderBotNest'ga to'lov webhook'i qo'shildi. Commit va push qilinmadi. Server ishga tushirilmadi, shuning uchun hech qanday jarayon ochilmadi va to'xtatish kerak emas.

WEBHOOK
- Manzil: POST /webhooks/payment
- Sarlavha: X-Signature = HMAC-SHA256(PAYMENT_WEBHOOK_SECRET, xom tana), hex. Imzo tana baytlari bo'yicha tekshiriladi.
- Tana (JSON): { "payment_id": "P-100", "order_id": 12, "status": "paid" | "rejected", "amount": 100000 }
- Javoblar: 200 { ok: true, status: "PAID"|"REJECTED" } · 401 imzo yo'q/noto'g'ri (kalit bo'sh bo'lsa ham) · 400 maydon noto'g'ri · 404 buyurtma yo'q · 409 payment_id boshqa buyurtmaga tegishli.
- Takror xabar (xuddi shu payment_id) ikkinchi qator yaratmaydi, holatini yangilaydi.
- Buyurtma holati (NEW/CONFIRMED...) o'zgarmaydi; to'lov alohida saqlanadi.

FAYLLAR
- Yangi: src/api/payment/{payment-webhook.ts, payment.service.ts, payment.controller.ts, payment.module.ts} + spec'lar (payment-webhook.spec.ts, payment.controller.spec.ts); src/core/entity/payment.entity.ts; src/infrastructure/migrations/1762300000000-payments.ts (payments jadvali, external_id UNIQUE).
- O'zgargan: src/main.ts (NestFactory rawBody: true — imzo uchun xom tana), src/api/app.module.ts (PaymentModule), src/config/index.ts + .env.example (PAYMENT_WEBHOOK_SECRET), src/core/entity/order.entity.ts + index.ts (payments relatsiyasi), src/infrastructure/data-source.ts (entity va migratsiya ro'yxati), src/api/order/order.service.ts (recent() payments'ni yuklaydi), src/api/live/live.gateway.ts (OrderChangeReason'ga 'payment'), src/api/live/admin.controller.ts (+ payment: eng so'nggi to'lov yoki null), src/api/live/admin.controller.spec.ts, public/admin.html (8-ustun «To'lov»: «To'landi · 100 000 so'm» / «Rad etildi»; panel order-changed'da yangilanadi).

TEKSHIRUV
- npx tsc --noEmit: toza. npx jest: 56/56 (baseline 32 + yangi testlar). prettier: toza.
- admin.html ichidagi skript node --check dan o'tdi.
- Webhook HTTP darajasida supertest bilan (rawBody yoqilgan ilova, haqiqiy HTTP) sinaldi: to'g'ri imzo, imzo yo'q, tana o'zgargan, noto'g'ri kalit, maydon xatosi, 404, takror, 409.

TEKSHIRIB BO'LMAGANLAR
- PostgreSQL yo'q: migratsiya SQL'i haqiqiy bazada ishlamadi, admin ro'yxatining DB orqali yuklanishi va GET /admin/orders real bazada sinalmadi (testlarda mock). Birinchi ishga tushirishda migratsiya o'zi yuradi (migrationsRun).
- To'liq ilova (main.ts, PORT=3202) bu mashinada ishga tushirilmadi — DB ulanishi yo'q.
- Jonli panelda real order-changed (reason 'payment') brauzerda ko'rilmadi.

OCHIQ SAVOLLAR (to'lov xizmati bilan kelishing)
1. Maydon nomlari (payment_id, order_id, status, amount) va status qiymatlari («paid»/«rejected») — taxmin. Xizmat boshqacha nomlar yuborsa, parsePaymentEvent ni shunga moslash kerak.
2. X-Signature faqat hex deb qabul qilinadi; xizmat «sha256=...» prefiksi yuborsa, tekshiruv rad etadi.
3. Summa buyurtma jamidan farq qilsa, xabar qabul qilinadi (200), faqat log'da ogohlantirish yoziladi. Rad etish yoki boshqacha ish kerakmi — siz hal qiling.
4. Ikki xil to'lov (rad, keyin to'landi) bo'lsa, panelda eng so'nggi natija ko'rsatiladi.
