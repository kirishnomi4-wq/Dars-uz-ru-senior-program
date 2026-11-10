# AI javobi — Prompt 3 (04.11)
- Migratsiya 1793733685607-CreateCartItems: id, telegram_id BIGINT, product_id, qty DEFAULT 1, created_at; UQ (telegram_id, product_id); CHECK qty > 0; FK users(telegram_id) va products(id) ON DELETE CASCADE.
- cart.service add = INSERT … ON CONFLICT (telegram_id, product_id) DO UPDATE SET qty = qty + 1 RETURNING qty (bitta so'rov); add endi shu mahsulot qty'sini qaytaradi — parallel bosishda «9 ta» ikki marta chiqqan xatoni o'zi topib tuzatdi.
- telegram.service: add: dan oldin users.getOrCreate — /start bosmagan mijoz tugmani bossa FK xatosi chiqardi (o'zi topdi).
- Tarmoq qo'riqchisi (dns/tls/net + callApi soxta) — avval o'zini sinadi; hamma yurishda Telegram'ga 0 urinish.
- Sinovlar: parallel 2/10/5 bosish → 1 qator; restartdan keyin /cart saqlandi; CHECK/UNIQUE/FK psql'da; ombor yetmasa savat o'chmadi.
- Tozalash: test users o'chirildi (CASCADE), stock qaytarildi; tashqaridagi psql.sh ham o'chirildi.
