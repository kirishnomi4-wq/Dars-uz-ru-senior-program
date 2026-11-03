# Mentor darsi · Telegraf + PostgreSQL: bot eslab qoladi — PRD v1 (01.11 avtopilot; savollar berilmagan, tasdiqlanmagan)

> PRD Ilova A shabloni · kursdagi ichki tartib №9 (M31: raqam yozilmaydi). Haqiqiy chiqishlar `manba/tgpg-out/` (skript `manba/drive-tgpg.sh`).
> Tartib eslatmasi: kurs tartibida oldingi dars — GitHub Actions (`15-CICD2-PRD.md`), u Actions'ni haqiqiy yurgizish ruxsatini kutyapti; shu sabab avtopilot keyingi mavzuga o'tdi (sifat qarori — maketli dars yozilmadi).

**O'quvchi darsi:** **m5-04** «Bot eslab qoladi — holat va PostgreSQL» (`src/5-Modull/BotStatefulMemoryLesson.jsx`, 21 ekran). Ip: AvtoPizza bot. Holatsiz bot adashadi → holat RAM'da (qayta ishga tushsa yo'qoladi) → PostgreSQL'da (qoladi) → ikki mijoz: umumiy o'zgaruvchi aralashadi, `chat.id` bo'yicha alohida sessiya → `users` jadvali (`telegram_id BIGINT NOT NULL UNIQUE`, `ism`, `holat`, `tanlov`) → oqim SELECT → INSERT/UPDATE → amaliyot: o'quvchi reposi **TelegramBotNest** (`git checkout -f dars-04-done`), Neon (`DATABASE_URL`, `sslmode=require`), Antigravity'ga prompt (TypeORM entity, `database.module.ts`, UserService `topOrYarat/ismQoy/holatQoy`) → Telegram'da /start → ism → qayta ishga tushirish → «Yana salom» · uyga vazifa: o'z bot loyihasida xuddi shu + skrinshotlar.
**Oldin:** (kurs tartibida) GitHub Actions. **Keyin:** WebSocket-1.

1. **Biladi (3 gap):** holat — suhbat bosqichi; RAM'dagi holat qayta ishga tushganda yo'qoladi, PostgreSQL'dagi qoladi; har mijoz `chat.id` bo'yicha alohida, umumiy o'zgaruvchi aralashtiradi. Oqim: SELECT → (yo'q bo'lsa INSERT) → UPDATE. Tuzoqlar: `INTEGER` sig'maydi (Telegram id 32 bitdan katta), node-pg/TypeORM `bigint`ni **matn** qaytaradi, SELECT'siz takror INSERT → UNIQUE xatosi; token xato bo'lsa server «ishlayapti», bot jim.
2. **Qo'li bilan (3 amaliyot):** P1 kichik bot + lokal PostgreSQL (PG-1 dagi) → qayta ishga tushirish → «Yana salom» · P2 buzish: `INTEGER` va takror INSERT → xabarlar · P3 o'quvchi reposi `dars-04-done` lokal PostgreSQL bilan → `psql`da `holat = tayyor`.
3. **Haqiqiy loyiha:** haqiqiy Telegraf 4.16.3 va PostgreSQL 18; Telegram serveri o'rniga `handleUpdate` + javobni ushlash (logika haqiqiy, Telegram ilovasidagi ko'rinish — ⚠ maket). O'quvchi reposi kodining o'zi sinalgan (`tgpg-out/12`). Neon — sinalmagan (⚠).
4. **Buzamiz:** `INTEGER` · BIGINT matn (`===` false) · SELECT'siz INSERT (duplicate key) · token xato (401, server ishlaydi) · `.env` yo'q (`DATABASE_URL topilmadi`).
5. **Ko'prik:** m5-04 xaritasi · o'quvchi tili (holat, sessiya, holatli bot) · sinfdagi holatlar (Neon `sslmode`, 401, `409 Conflict` ⚠, AI kodi).
6. **Tekshiruv 4 + o'z-sinov 8.**
7. **Uyga vazifa:** o'z botiga ikki bosqichli holat (masalan ism → telefon) + qayta ishga tushirishdan keyin davom → GitHub linki (M30).
8. **Hajm (taxmin):** ~25 ekran · ~1 soat.
9. **Ochiq / avtopilot takliflari:**
   - **Q1** — mentor amaliyotida baza: **lokal PostgreSQL** (PG-1 da o'rnatilgan; sinalgan) — Neon emas (sinalmagan, hisob kerak). O'quvchi Neon'da — mentor farqni biladi (`sslmode=require`).
   - **Q2** — Telegram'dagi ko'rinish (chat) — maket ⚠; bot javob matnlari haqiqiy (Telegraf handler'dan).
   - **Q3** — `409 Conflict` (bitta bot ikki joyda) — o'quvchi reposi README'sida bor, sinalmagan (haqiqiy token kerak) — ⚠ bilan aytiladi.
