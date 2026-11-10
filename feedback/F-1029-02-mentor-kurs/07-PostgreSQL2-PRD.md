# Mentor darsi · PostgreSQL-2: CRUD so'rovlar va Express'dan bazaga — PRD v1 (01.11 avtopilot: haqiqiy chiqishlar olindi; tasdiqlanmagan)

> 01.11.2026, avtopilot (foydalanuvchi 08:30 da ko'radi) · PRD Ilova A shabloni · kursdagi ichki tartib №2 (M31: o'quvchi ko'radigan matnda raqam yo'q).
> **Savollar foydalanuvchiga berilmadi** (u zalda) — har ochiq qaror pastda «Avtopilot taklifi» bilan; ertalab tasdiqlanadi yoki o'zgaradi.

**Haqiqiy yurgizishdan topilmalar (`manba/pg2-out/`, README):**
- `SELECT *` tartibi kafolatlanmaydi — UPDATE'dan keyin Klaviatura oxiriga tushdi (sinf savoli: «nega o'rni o'zgardi?» → `ORDER BY id`).
- m4-06 jadvalida NOT NULL yo'q → nomsiz mahsulot jim saqlanadi (PG-1 dagi «baza o'zi qo'riqlaydi» faqat qoida yozilganda).
- `column "narx" does not exist` + HINT **noto'g'ri** ustunni taklif qiladi (`name`) — HINT ham taxmin.
- m4-08 xatosining haqiqiy matni: `column "price" of relation "cars" does not exist` (o'quvchi darsida qisqartirilgan).
- **Express 5.3:** port band bo'lsa ikkinchi server ham «Server 3000-portda ishlayapti» deb chiqadi (callback xatoni yutadi, manba: `application.js` `server.once('error', done)`) — so'rovga eski server javob beradi: «kodni tuzatdim, o'zgarmadi».
- PostgreSQL o'chiq → 500 `{"error":""}`, terminalda bo'sh qator; `console.error(err)` → `ECONNREFUSED`.
- Parol/baza xatolari server ishga tushganda emas, **birinchi so'rovda** chiqadi (Pool dangasa ulanadi).
- Yopishtirilgan SQL + `1 OR 1=1` → hamma qator o'chdi; `$1` → 500 `invalid input syntax for type integer`.

**O'quvchi darslari:**
- **m4-06** «PostgreSQL so'rovlar — CRUD + AI bilan» (`src/4-Modull/PostgresCrudLesson.jsx`, 21 ekran). Ip: zakaz-shop.uz, `products` (id SERIAL PK, name TEXT, price INTEGER, stock INTEGER — **NOT NULL yo'q**); Klaviatura 120 000 · Sichqoncha 75 000 · Quloqchin 95 000 → CREATE TABLE → INSERT (Kolonka 50 000) → SELECT (`*`, ustunlar) → WHERE (`price < 100000`, `stock < 6`) → UPDATE (Klaviatura 99 000; «WHERE'ni unutsangiz — HAMMA qator») → DELETE (Quloqchin id=3) → «Menejer navbati» (4 hodisa → to'g'ri buyruq) → AI bilan 1 (vazifa → SQL → tekshir) → AI bilan 2 (`users` jadvali) → AI xatosi `product` → `relation "product" does not exist` → yakuniy: INSERT yozish → amaliyot **«VS Code yoki psql'da AI bilan O'Z do'koningiz jadvali + CRUD»** (haqiqiy baza!) · uyga vazifa 5-6 (test, 5).
- **m4-08** «Praktika: Backend CRUD — AvtoIjara» (`BackendCrudPracticeLesson.jsx`, 9 ekran). `psql -U postgres` («parol — PostgreSQL o'rnatilganda berilgan») → `car_rental` bazasi, `cars` (model TEXT, daily_price INTEGER, year INTEGER, is_rented BOOLEAN) — o'zi yozadi → Gemini: `server.js` (pg `Pool`, GET /api/cars) → Gemini: POST/PUT/DELETE (`$1, $2`, 201) → Postman → AI xatosi `column "price" does not exist` (500 → 201) → test.
**Oldin:** PostgreSQL-1 (o'rnatish, psql, jadval, FK, JOIN). **Keyin:** Nest-1 (m4a-01). Modul 5 da NestJS shu 4 amalni qiladi (o'quvchi darsida aytilgan).

1. **Biladi (3 gap):** CRUD ning to'rt buyrug'ini va `WHERE` ning narxini (UPDATE/DELETE'da unutilsa — hamma qator) bazada o'z ko'zi bilan ko'rgan; xavfsiz sinash usulini biladi (`BEGIN … ROLLBACK`). Express'dan bazaga yo'lni tushuntiradi: `Pool` → `pool.query(sql, [qiymatlar])` → `rows` → `res.json`; nega `$1` (yopishtirilgan matn — SQL injection). Sinfda chiqadigan xatolarni xabaridan taniydi: ustun/jadval nomi, ulanish (parol, baza, server), `req.body` bo'sh, raqam o'rniga matn.
2. **Qo'li bilan (taklif — 4 amaliyot):** P1 `shop` + `products` CRUD psql'da (isbot: `UPDATE 1`/`DELETE 1` emas — `SELECT` natijasidagi qatorlar soni) · P2 `BEGIN` → WHERE'siz `UPDATE` → `ROLLBACK` (isbot: ROLLBACK'dan keyingi Klaviatura narxi) · P3 Express server GET + POST (isbot: POST javobidagi `id`) · P4 `price` xatosini o'zi keltirib, tuzatish (isbot: xato xabari satri).
3. **Haqiqiy loyiha:** noldan — PG18 vaqtinchalik klaster (Windows o'rnatuvchisi kabi, parol bilan) + Node 24 + `express` + `pg` scratchpad'da · `manba/drive-pg2.sh` → `manba/pg2-out/`: psql CRUD (o'quvchi ma'lumotlari aynan) · WHERE'siz UPDATE/DELETE tranzaksiyada + ROLLBACK · `product` xatosi · `UPDATE 0` (yo'q id) · NULL nom (NOT NULL yo'q) · apostrof · raqam o'rniga matn · Express server: GET/POST/PUT/DELETE curl bilan (status va JSON) · xatolar: noto'g'ri parol, bo'sh parol, baza yo'q, server o'chiq, `column "price"`, `express.json()` unutilgan, `$1` o'rniga yopishtirish (`1 OR 1=1`).
4. **Buzamiz (3–4):** `column "price" does not exist` (500 → kodda `price`, sxemada `daily_price` → tuzatish → 201) · `express.json()` yo'q → `req.body` undefined → 500 · `password authentication failed` / `client password must be a string` (parol o'zgaruvchisi bo'sh) · yopishtirilgan SQL → `1 OR 1=1` hammasini o'chiradi (tranzaksiyada, ROLLBACK) → `$1` bilan → `invalid input syntax for type integer`.
5. **Ko'prik:** m4-06 xaritasi (21 ekran → «siz qo'shasiz») · m4-08 xaritasi (9 ekran) · o'quvchi tili («chizma», «menejer navbati», «ko'prik — pool») · sinfdagi holatlar (parol, `\c` unutilgan, `product`/`price`, WHERE'siz, port band) · vaqt rejasi · NestJS'ga ko'prik bir gap bilan (M8-5 tinchlantirish).
6. **Tekshiruv 4 + o'z-sinov 8.**
7. **Uyga vazifa:** GitHub repo `shop-api` — `schema.sql` (o'z do'koni jadvali) + `server.js` (4 endpoint, `$1`) + README (4 so'rov va javobi) → faqat GitHub linki (M30).
8. **Hajm (taxmin):** ~26 ekran · ovoz ~30 daq · amaliyot ~45 daq · jami ~1 s 15 daq.
9. **Ochiq / avtopilot takliflari:**
   - **Q1 (ikki o'quvchi darsi bitta mentor darsida?)** — PRD §4: «m4-06 (+ m4-08 praktika)». Taklif: ha, bitta dars; 1–4-bosqich psql, 5-bosqich Express.
   - **Q2 (Postman yoki curl?)** — o'quvchi Postman ishlatadi. Bu kompyuterda Postman yo'q; haqiqiy chiqish `curl` bilan olinadi, ekranda Postman maketi + «haqiqiy javob curl bilan olingan» belgisi. Taklif: shunday.
   - **Q3 (Gemini kodi)** — Gemini har safar boshqacha yozadi; darsdagi `server.js` — bitta namuna (promptdagi talablarga to'liq mos), ekranda «shartli namuna» deb aytiladi.
   - **Q4 (`users` jadvali, m4-06 AI-2)** — o'quvchi darsida `users` jadvali bazada «bor» deb ko'rsatiladi, lekin o'quvchi o'zida yaratmagan → sinfda «relation "users" does not exist» chiqishi mumkin. Mentor darsida aytiladi; o'quvchi darsini tuzatish — alohida qaror.
