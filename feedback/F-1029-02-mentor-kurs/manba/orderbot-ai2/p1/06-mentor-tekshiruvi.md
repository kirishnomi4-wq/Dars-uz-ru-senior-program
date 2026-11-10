# Mentor tekshiruvi — 2-tajriba, Prompt 1 (Haiku)
- tsc ✓ · build ✓ · `npm run seed` YO'Q (mahsulotlar migratsiya ichida INSERT) · typeorm 0.3.31 (1-tajriba va tgpg-done: 1.1.x).
- Senariy: restartdan keyin savat ✓, buyurtma #1 ✓; state-restart ✓; race: 1 sotildi, Bobur «omborda faqat 0 ta qoldi», bekor bir marta qaytdi ✓.
- Sxema: users.telegram_id BIGINT PK ✓, CHECK role/state ✓, cart_items UNIQUE(telegram_id, product_id) ✓, CHECK qty>0 ✓; **cart_items → users FOREIGN KEY YO'Q** (faqat products'ga, ON DELETE CASCADE — mahsulot o'chsa savatlardan jim yo'qoladi).
- **Asosiy topilma: SCOPE.** «Katalogni ko'chir» → 22 fayl, 1145 qator: hamma servis, tranzaksiya, FOR UPDATE. Kod to'g'ri, lekin mentor bitta diffda 1145 qatorni ko'rib chiqa olmaydi; AI chetga chiqqanini alohida aytmadi (1-tajribadagi Opus aytgan edi).
