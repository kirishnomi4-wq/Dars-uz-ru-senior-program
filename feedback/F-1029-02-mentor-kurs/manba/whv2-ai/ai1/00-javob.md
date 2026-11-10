# ai1 (kuchli model — Opus) javobi — qisqartirilmagan asosiy qismlar (04.11, 564 s, 32 vosita chaqiruvi)

Manzil: `POST /payments/webhook` · `X-Signature: <HMAC-SHA256(PAYMENT_WEBHOOK_SECRET, tananing xom baytlari)> — hex, 64 belgi ("sha256=" old qo'shimchasi ham qabul qilinadi)` · tana `{ "payment_id": "pay_123", "order_id": 15, "status": "paid" | "rejected", "amount": 120000 }`.
Javoblar: 200 (takrorga ham — `result: "duplicate"`) · 401 imzo yo'q/noto'g'ri, bazaga tegilmaydi · 400 tana noto'g'ri · 404 buyurtma yo'q · 409 `payment_id` boshqa buyurtmaga tegishli · 5xx — xizmat qayta yuboradi.
- «Imzo: so'rov tanasining xom baytlaridan tekshiriladi. Buning uchun main.ts da rawBody: true yoqildi. Solishtirish timingSafeEqual bilan.»
- «Takror xabar: payments.payment_id — UNIQUE, buyurtma qatori esa FOR UPDATE bilan qulflanadi. Bir xil xabar bir vaqtda 5 marta kelsa ham bazada bitta qator qoladi.»
- «to'lov "to'landi" bo'lgach, shu payment_id ga kelgan "rad etildi" uni o'zgartirmaydi (ignored).»
- orders.payment_status: To'landi (summa = jami) · **Summa mos emas** · Rad etildi · Kutilmoqda.
- Tekshiruv: tsc, prettier; jest 32 → 57; «PostgreSQL uchun loyiha ichida vaqtinchalik baza ko'tardim (npm install --no-save embedded-postgres, port 54329)»; smoke 9/9 → 15/15; dist/main PORT=3201 curl: 5 bir xil xabar bir vaqtda → 1 applied, 4 duplicate; bitta probel qo'shilsa → 401.
- Tekshira olmadi: brauzerda panel; haqiqiy xizmat (maydon nomlari, summa so'mda yoki tiyinda, imzo hex yoki base64); bot mijozga to'lov havolasini bermaydi; xabarda vaqt belgisi yo'q; bekor qilingan buyurtmaga to'lov — «Bekor» va «To'landi» birga.
- Ogohlantirish (o'zi yozgan): «Doiradan bir marta chiqib ketdim. Ish boshida package.json va package-lock.json nusxasini xato bilan scratchpad'ning ildiz papkasiga … ko'chirdim … Ikkalasini darhol o'chirdim.» · «Mashinada PostgreSQL 17 ishlab turibdi (5432-port) … unga tegmadim.»
