# Mentor tekshiruvi — Prompt 2
- tsc ✓ · build ✓ · migrations 2 qator · `\d users`: telegram_id bigint PRIMARY KEY, CHECK role/state ✓.
- state senariysi (04b): Bobur /start ×2 → 1 qator; checkout → telefon so'raldi → RESTART → «+998935554433» → bot telefon deb qabul qildi (placeOrder'ga o'tdi) ✓; «Savat bo'sh» — savat hali xotirada (kutilgan, 3-bosqich).
- Dizayn farqi (darsda solishtirish): AI `telegram_id` ni PRIMARY KEY + transformer→number qildi; tgpg-done da surrogate `id SERIAL` + `telegram_id BIGINT UNIQUE`, tip string. Ikkalasi to'g'ri; savol mentor uchun: «BIGINT nega matn bo'lib keladi va kodda nima qilamiz?».
- AI tgpg-start dagi xatoni topdi (customerName → soxta user qatori). tgpg-done da bu yo'q (o.user.name) — tgpg-start da qoladi, darsda «AI eski kodda xato topdi» lahzasi bo'lishi mumkin.
- Halollik: AI sinovida 1 so'rov api.telegram.org'ga ketdi (soxta token, 401) — darsda «AI sinov qilganda tarmoqqa chiqishi mumkin» eslatmasi.
