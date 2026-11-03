# Telegraf + PostgreSQL — haqiqiy chiqishlar (01.11.2026, avtopilot)

Yasash: `S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-tgpg.sh`. **Usul:** haqiqiy Telegraf 4.16.3 va haqiqiy PostgreSQL 18.4 (vaqtinchalik klaster). Telegram serveri **ishlatilmaydi**: xabar `bot.handleUpdate(update)` bilan beriladi, botning javobi `Telegram.prototype.callApi` da ushlanadi (token soxta). Ya'ni handler, `ctx.chat.id`, SQL va qayta ishga tushirish — haqiqiy; Telegram ilovasidagi ko'rinish — ⚠ maket.
⚠ O'z xatoyim (01.11 02:53): 1-yurgizishda ushlash `bot.telegram` da edi — Telegraf har update uchun yangi `Telegram` obyekti yaratadi, so'rovlar haqiqiy serverga soxta token bilan ketib `401 Unauthorized` qaytgan; natijalar tashlandi, ushlash prototipga ko'chirildi va qayta olindi.

| Fayl | Nima |
|---|---|
| 00 | Node 24.18 · telegraf 4.16.3 · pg 8.23.1 · PostgreSQL 18.4 |
| 01 | holatsiz bot: «Pitsa…» → «Ajoyib! Qaysi pitsa?» → «Pepperoni» → «Nima «Pepperoni»? Tushunmadim.» |
| 02 | holat obyektda (RAM): 1-jarayonda `OLCHAM_KUTYAPMAN`; qayta ishga tushgach «Katta» → «Salom! Qaysi pitsa?» — holat yo'qolgan |
| 03 | bitta umumiy `tanlov` o'zgaruvchisi: Aziza Pepperoni, Jasur Margarita → Azizaga «Buyurtma: Margarita, katta» — aralashdi |
| 04–05 | `users` jadvali (o'quvchi darsidagi aynan: `telegram_id BIGINT NOT NULL UNIQUE`); SELECT → INSERT/UPDATE; qayta ishga tushgach «Yana salom, Aziza!», Jasur alohida davom etdi; jadvalda 2 qator |
| 06 | `telegram_id INTEGER` → `ERROR: integer out of range` (5123456789) |
| 07 | node-pg BIGINT'ni **matn** qaytaradi: `"5123456789"`, `=== 5123456789` → `false`, `Number(v) ===` → `true` |
| 08 | SELECT'siz ikkinchi INSERT → `duplicate key value violates unique constraint "users_telegram_id_key"` |
| 09 | Telegram Bot API: id 32 bitdan oshishi mumkin, 52 bitgacha — BIGINT sababi |
| 10 | **o'quvchi bot reposi** `TelegramBotNest` (`dars-04-done`, 46c67e7): `npm ci` — **ishlaydi** (394 paket; IntroNestArxitechture'dan farqli) |
| 11 | `.env` yo'q: `Error: DATABASE_URL topilmadi. .env ga Neon bergan URL ni yozing (README, 4-dars).` |
| 12 | repo kodining o'zi (Nest + TypeORM `synchronize`), haqiqiy PostgreSQL, Telegram serverisiz (`launch` o'chirilgan, javob ushlangan): /start → «Salom! Ismingiz nima?» → «Xush kelibsiz, Aziza! …»; **qayta ishga tushirilgach** /start → «Yana salom, Aziza! Menyu uchun /menu ni bosing.»; Jasur alohida; jadval TypeORM yaratgan: `id uuid`, `telegram_id bigint UNIQUE`, `holat` default `'yangi'` |
| 13 | token soxta (`123:SOXTA`): `Server 3000-portda ishlayapti` **va** `Telegram ulanmadi: 401: Unauthorized — README, «Xatolar» jadvali` — server ishlaydi, bot jim (haqiqiy Telegram serveri, bitta getMe so'rovi) |
| 14 | TypeORM ham: repo `UserService.topOrYarat(5123456789)` → `user.telegram_id = "5123456789"` · `typeof: string` · `=== 5123456789` → `false` (14-ekrandagi «TypeORM ham bigint'ni matn qaytaradi» da'vosining isboti) |
