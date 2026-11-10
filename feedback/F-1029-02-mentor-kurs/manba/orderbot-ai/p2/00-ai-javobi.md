# AI javobi — Prompt 2 (04.11)
- Yangi migratsiya 1793733435828-CreateUsers: telegram_id BIGINT PRIMARY KEY (INTEGER chegarasi 2 147 483 647 deb o'zi tushuntirdi), name, phone NULL, role DEFAULT 'customer', state DEFAULT 'IDLE', created_at TIMESTAMPTZ; CHECK role IN (…), state IN (…).
- user.entity.ts: BIGINT matn bo'lib keladi → transformer bilan number (52 bit — JS uchun xavfsiz deb asosladi). [Mening tgpg-done: string — ikki yo'l, darsda solishtirish]
- user.service: getOrCreate = INSERT … ON CONFLICT DO NOTHING + SELECT (parallel 5 ta → 1 qator); rol har murojaatda .env dan yangilanadi; find() qo'shildi.
- telegram.service: await; **customerName getOrCreate o'rniga find — tgpg-start dagi xatoni topdi (admin /orders boshqa id uchun soxta user ochardi).**
- O'zi sinagan: avtomigratsiya; /start 2 marta → 1 qator; restartdan keyin «salom» → «Raqam noto'g'ri» (state bazada); savat bo'sh (kutilgan); CHECK 'HECH' rad.
- Qoida buzilishi (o'zi aytdi): 1-sinovda bitta sendMessage soxta token bilan api.telegram.org'ga ketdi → 401. Keyin hammasi soxta.
- Sinovdan keyin bazani tozaladi (users bo'sh, Sichqoncha stock 15 ga qaytarildi).
