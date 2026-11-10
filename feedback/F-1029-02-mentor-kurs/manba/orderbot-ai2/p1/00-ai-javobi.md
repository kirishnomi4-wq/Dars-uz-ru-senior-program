# AI javobi — 2-tajriba, Prompt 1 (Haiku, oddiy prompt «Katalogni postgresqlga ko'chirib ber, TypeORM ishlat»)
- SCOPE: so'ralgani faqat katalog — AI HAMMASINI ko'chirdi (users, products, cart_items, orders, order_items, tranzaksiya, FOR UPDATE, bekor → ombor). O'zi «katalog va holat» deb atadi, chetga chiqqanini alohida aytmadi.
- Bitta migratsiya 1762000000000-Init: 5 jadval + CHECK + 6 mahsulot INSERT migratsiya ichida (seed skript yo'q).
- database.module (synchronize false, migrationsRun true), bigint.transformer, entity'lar.
- O'zi: «servis darajasida 14 tekshiruv», bot oqimlari Telegram orqali sinalmagan deb tan oldi.
