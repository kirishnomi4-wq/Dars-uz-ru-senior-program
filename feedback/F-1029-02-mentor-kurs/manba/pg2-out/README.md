# PostgreSQL-2 — haqiqiy chiqishlar (01.11.2026, avtopilot)

Yasash: `S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-pg2.sh` (repo ildizidan). Tizimga tegmaydi: PG18 klaster vaqtinchalik (port **5436**, Windows o'rnatuvchisi kabi — `postgres` + parol), Node loyiha scratchpad'da. Versiyalar `00`: PostgreSQL 18.4 · Node 24.18 · **express 5.3.0 · pg 8.23.1** (o'quvchi `npm install express pg` qilsa — shu avlod).
Ma'lumotlar o'quvchi darslaridan aynan: m4-06 `products` (Klaviatura 120 000 · Sichqoncha 75 000 · Quloqchin 95 000 · Kolonka 50 000; DDL'da NOT NULL yo'q) · m4-08 `cars` (Cobalt 280 000 · Malibu 520 000 · K5 610 000 · Spark 190 000).

| Fayl | Nima |
|---|---|
| 01–03 | CREATE/INSERT/SELECT · WHERE (`price < 100000` → 3, `stock < 6` → Quloqchin) · UPDATE 1 / DELETE 1 · yo'q id → `UPDATE 0` / `DELETE 0` · **UPDATE'dan keyin Klaviatura `SELECT *` da oxiriga tushdi** (ORDER BY yo'q — tartib kafolatlanmaydi) |
| 04 | `BEGIN` → WHERE'siz `UPDATE 3` (hammasi 99000) → WHERE'siz `DELETE 3` (0 qator) → `ROLLBACK` → hammasi joyida |
| 05, 05b | `relation "product" does not exist` (m4-06 AI xatosi) · `column "narx" does not exist` + **HINT noto'g'ri ustunni taklif qiladi** (`products.name`) · `invalid input syntax for type integer: "arzon"` · apostrof → `syntax error at or near "yinchoq"` → `''` bilan tuzatish · `INSERT has more target columns than expressions` · nomsiz mahsulot **jim saqlanadi** (`INSERT 0 1`, NOT NULL yo'q) |
| 10 | `car_rental`, `cars` (m4-08: model TEXT, daily_price INTEGER, year INTEGER, is_rented BOOLEAN) |
| 11 | `11-server.js` — Gemini promptiga mos **bitta namuna** (shartli); GET 200 · POST 201 (`is_rented: null` — POST'da berilmagan) · PUT 200 · DELETE 200 · yo'q id → 404 (kodda shunday yozilgan) |
| 12 | `price` ustuni → 500 `column "price" of relation "cars" does not exist` (o'quvchi darsida qisqa: `column "price" does not exist`) |
| 13 | `express.json()` yo'q → 500 `Cannot destructure property 'model' of 'req.body' as it is undefined.` |
| 14 | server **ishga tushadi**, xato birinchi so'rovda: parol xato → `password authentication failed for user "postgres"` · parol `undefined` → `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string` · baza nomi xato → `database "carrental" does not exist` |
| 15 | PostgreSQL o'chiq → 500 `{"error":""}`, terminalda **bo'sh qator** (`err.message` bo'sh — AggregateError) · `console.error(err)` bilan → `AggregateError [ECONNREFUSED]`, `connect ECONNREFUSED ::1:5436` |
| 16 | port band: ikkinchi `node server.js` ham **«Server 3000-portda ishlayapti»** deb chiqadi, chiqish kodi 0, xato yo'q (Express 5: `app.listen` xatoni callback'ga beradi) — so'rovlarga **eski** server javob beradi |
| 17 | yopishtirilgan `'DELETE … WHERE id = ' + req.params.id` + `/api/cars/1 OR 1=1` → 200 `deleted: 3`, jadval bo'sh · `$1` bilan → 500 `invalid input syntax for type integer: "1 OR 1=1"`, jadval joyida |
| 18 | (MD KOD 5) huquqsiz foydalanuvchi → `permission denied for table products` · `BEGIN`siz `ROLLBACK` → `WARNING:  there is no transaction in progress` · `"O'yinchoq"` → `column "O'yinchoq" does not exist` · kichik harf `select … from PRODUCTS` ishlaydi |
| 19 | `price` tuzatilgan server → POST 201 (`id: 5`) |
| 20 | xatoni o'qiydigan `listen` callback → `listen EADDRINUSE: address already in use :::3000`, chiqish kodi 1 |

**Darsga ko'chirishda farqlar:** port 5436 → ekranda 5432; `15` dagi yo'llar scratchpad'dan — ekranda qisqartiriladi. Postman bu kompyuterda yo'q: javoblar `curl` bilan olingan (status + tana bir xil).
**Tuzatish (01.11):** birinchi yurgizishda server to'xtatilmagan (subshell PID) — 12–17 natijalari eski serverdan kelgan, yaroqsiz; `exec` + port tekshiruvi bilan qayta yurgizildi (shu fayllar).
