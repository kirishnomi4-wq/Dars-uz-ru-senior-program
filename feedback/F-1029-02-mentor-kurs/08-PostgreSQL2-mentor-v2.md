# Mentor kursi · PostgreSQL-2 «CRUD so'rovlar va Express'dan bazaga» — MD v2 (M41: avval mentor o'rganadi)

F-ID: F-1029-02 (PostgreSQL-2) · F-1103-03 (qayta yozuv) · Sana: 2026-11-03 · Holat: **GATE M O'TDI 03.11 kech** (1A · 2C · 3A · 4A) → qurilmoqda · Fidbek: qator yoniga `>> …`
Oldingi: `08-PostgreSQL2-mentor-v1.md` (01.11, qurilgan, foydalanuvchi: «juda o'quvchi darsiga kirishamiz») · PRD: `07-PostgreSQL2-PRD.md`
Fayl (qayta quriladi): `src/mentor-kurs/PgCrudMentorLesson.jsx` · bo'laklar `src/mentor-kurs/pg2/parts/` · dvigatel — umumiy `parts/01–02` · generator `dev/pg2-matn.py` (v2: kalitdagi qizil bo'lak `==…==` bilan, `Demak:` maydoni)
Qonun: `MENTOR_DARS_ETALON.md` M1–M42 · Haqiqiy chiqishlar: `manba/pg2-out/` — v1 fayllari `01…20` + **v2 yangi yurgizish 03.11: `v2-00…v2-04`** (`manba/drive-pg2-v2.sh`)

**v1 → v2 nima o'zgardi (M41):**
- Dars tanasi faqat mavzu, mentorning o'zi uchun. «O'quvchi darsida», «o'quvchiga ayting» gaplari tanadan chiqdi; o'quvchi darslari faqat 6-bosqichdagi ikki ekranda.
- Uch yangi «ichida nima bo'ladi» ekrani: qator tartibi va `ctid` (6), tranzaksiya ichi va `aborted` holati (10), ikki jadval bitta ish — `orders` + `CHECK` (11); `Pool` ekrani haqiqiy o'lchov bilan (17: bitta ulanish, pid bir xil).
- Tekshiruvlar mentor tilida va M42 ko'rinishida: material savoldan oldin (`above`), isbot javobdan keyin (`after`), bitta `Demak`. «O'quvchi: … yozdim» yo'q.
- Baza qoidalari alohida ekran: `NOT NULL` qo'shish, `DEFAULT`, `UNIQUE`, `CHECK` — haqiqiy xabarlar bilan (14).
- Misol — darsning o'z do'koni (`shop`: `products` + `orders`) va o'z serveri (`car_rental`: `cars`). Ma'lumotlar o'quvchi darslaridagi bilan bir xil (haqiqiy yurgizish shu ma'lumotda), lekin tanada o'quvchi darsi tilga olinmaydi; mosligi 28-ekranda aytiladi.

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | PostgreSQL-1 ni o'tgan mentor: o'rnatgan, `psql` bilan ulangan, `blog` bazasida jadval, tashqi kalit, JOIN, tranzaksiyani ko'rgan. Express'ni biladi. |
| Dars oxirida mentor | 1) CRUD'ning to'rt buyrug'ini `psql`da o'zi yozadi; javobdagi son va `RETURNING` nimani berishini biladi · 2) nega qator tartibi o'zgarishini tushuntiradi (`ctid`, `ORDER BY`) · 3) tranzaksiya ichida nima bo'lishini biladi: autocommit, `BEGIN … COMMIT/ROLLBACK`, `shop=*#` va `shop=!#`, «aborted», ikki jadval bitta ish · 4) baza qoidalarini o'zi qo'yadi va xabarini o'qiydi: `NOT NULL`, `DEFAULT`, `UNIQUE`, `CHECK` · 5) `Pool` nima, qachon ulanadi, nega bitta ulanish yetadi; `pool.query` → `rows`, `rowCount` · 6) `$1` nega: injection'ni o'zi ko'rgan · 7) server xatolarini (ustun, `req.body`, parol, baza, port) o'qiydi va tuzatadi · 8) m4-06 va m4-08 ni o'tishga tayyor (2 ekran) |
| O'quvchi darslari (faqat 6-bosqich) | **m4-06** «PostgreSQL so'rovlar — CRUD + AI bilan» (21 ekran) · **m4-08** «Praktika: Backend CRUD — AvtoIjara» (9 ekran). Oldingi mentor darsi: PostgreSQL-1. |
| Kursdagi o'rni | PostgreSQL-1 → **shu** → NestJS arxitekturasi (M31: raqam yozilmaydi) |
| Til | PG-1 bilan bir xil (M9). Yangi atamalar: CRUD, `RETURNING`, `ctid`, autocommit, aborted, `CHECK`, `DEFAULT`, `UNIQUE`, endpoint, `Pool`, `rowCount`, parametr (`$1`), status (200 · 201 · 404 · 500). |
| Misol-ip | **Do'kon `shop`:** `products` (Klaviatura 120 000 · Sichqoncha 75 000 · Quloqchin 95 000 · Kolonka 50 000) + 2-bosqichda `orders` (buyurtma). **Server `car_rental`:** `cars` (Cobalt · Malibu · K5 · Spark), `server.js`. |
| Gemini kodi | `server.js` — `pg2-out/11-server.js` **bitta namuna** (ekranda: «namuna — Gemini har safar boshqacha yozadi, mazmuni shu»). |
| Postman | bu kompyuterda yo'q: javoblar `curl` bilan olingan (status + tana bir xil); ekranda Postman ko'rinishidagi karta + belgi «haqiqiy javob». |
| Haqiqiylik (M10) | 01.11 (v1 `01…20`) va **03.11 (`v2-00…04`)** yurgizish: PostgreSQL 18 · Node 24 · express 5.3 · pg 8.23. Sinov porti 5436/5437 → ekranda 5432. |
| Hajm | **31 ekran** · 6 bosqich · 4 amaliyot · 4 tekshiruv · 8 savol · ovoz ≈ 27 daq · amaliyot ≈ 45–55 daq · jami ≈ 1 s 20 daq |
| Me'yor | PG-1 bilan bir xil (≤ 5 segment, ≤ 60 so'z, ko'prik M17, «Xulosa», kalit 8–14 so'z, M32 to'liq gap) |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **CRUD** — Create · Read · Update · Delete = `INSERT` · `SELECT` · `UPDATE` · `DELETE`; serverda `POST` · `GET` · `PUT` · `DELETE`.
- **javobdagi son** — `UPDATE 1`, `DELETE 0`, `INSERT 0 4`: nechta qator tegildi (`INSERT`dagi o'rtadagi `0` — eski versiyalardan qolgan, ma'nosi yo'q).
- **`RETURNING`** — o'zgargan qatorning o'zini qaytaradi; mos qator bo'lmasa `(0 rows)`.
- **qator tartibi** — `ORDER BY`siz `SELECT *` fayldagi tartibda o'qiydi; `UPDATE` qatorni joyida o'zgartirmaydi, yangi nusxasini bo'sh joyga yozadi (`ctid` — fayldagi manzil).
- **tranzaksiya** — autocommit: har buyruq o'zi saqlanadi; `BEGIN` → o'zgarishlar faqat shu seansda (`shop=*#`) → `COMMIT` / `ROLLBACK`; ichida xato bo'lsa — `shop=!#`, «aborted», faqat `ROLLBACK` qutqaradi. **Atomik**: ikki jadvalga bitta ish — yo ikkalasi, yo hech biri.
- **qoida** — baza faqat yozilgan qoidani qo'riqlaydi: `NOT NULL`, `DEFAULT`, `UNIQUE`, `CHECK (stock >= 0)`; har xabar ichida jadval, ustun yoki qoida nomi bor.
- **Pool** — `pg` paketidagi ulanishlar to'plami; yaratilganda ulanmaydi, **birinchi so'rovda** ulanadi, keyin shu ulanishni qayta ishlatadi (sinovda uch so'rov — bitta pid).
- **`pool.query`** → `rows` (qatorlar) va `rowCount` (terminaldagi `UPDATE 1` ning o'zi).
- **parametr** — `$1, $2` + qiymatlar massivi; qiymat SQL matniga yopishtirilmaydi (yopishtirilsa — `1 OR 1=1`, jadval bo'sh).
- **endpoint** — method + path: `GET /api/cars` → `SELECT`, `POST` → `INSERT … RETURNING *` (201), `PUT /:id` → `UPDATE`, `DELETE /:id` → `DELETE`; `rowCount` 0 → 404.
- **xato o'qish** — server javobi (status + `error`) **va** server terminali; bo'sh xabar bo'lsa — `console.error(err)`.

**Darsning ipi:** do'kon jadvali → to'rt buyruq va ularning ichi (son, tartib, `RETURNING`) → tranzaksiya: xavfsiz sinash, aborted, ikki jadval bitta ish → baza qoidalari va xabarlar → o'sha CRUD Express ichida (`Pool`, `rows`, `$1`) → serverni buzib tuzatasiz → oxirida ikki ekran: sinfga tayyorgarlik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | CRUD: to'rt amal — to'rt buyruq — to'rt endpoint | Lesson | 1 · CRUD terminalida |
| 3 | `shop` bazasi: jadval va `INSERT` | Lesson | 1 |
| 4 | `SELECT` va `WHERE` | Lesson | 1 |
| 5 | `UPDATE`, `DELETE` va javobdagi son | Lesson | 1 |
| 6 | Nega Klaviatura oxiriga tushdi — qator tartibi, `ctid`, `ORDER BY` | Lesson | 1 · ichida |
| 7 | Tekshiruv 1 — `UPDATE 0` | MCRetry | 1 |
| 8 | Amaliyot 1 — do'konni o'zingiz boshqaring | Practice | 1 |
| 9 | `WHERE`'siz — hamma qator; `BEGIN … ROLLBACK` | Lesson | 2 · tranzaksiya |
| 10 | Tranzaksiya ichida nima bo'ladi: autocommit, `*#`, `!#`, aborted | Lesson | 2 · ichida |
| 11 | Ikki jadval, bitta ish: `orders`, `CHECK`, atomik | Lesson | 2 · ichida |
| 12 | Tekshiruv 2 — `ROLLBACK`dan keyin | MCRetry | 2 |
| 13 | Amaliyot 2 — `BEGIN … ROLLBACK` | Practice | 2 |
| 14 | Qoida yozilmasa — qo'riqlamaydi: `NOT NULL`, `DEFAULT`, `UNIQUE` | Lesson | 3 · baza qo'riqlaydi |
| 15 | Xabarni o'qish: beshta xato | Lesson | 3 |
| 16 | Tekshiruv 3 — apostrof | MCRetry | 3 |
| 17 | `Pool` nima va qachon ulanadi — o'lchab ko'rdik | Lesson | 4 · Express · ichida |
| 18 | `GET`: `pool.query` → `rows`, `rowCount` → `res.json` | Lesson | 4 |
| 19 | `POST`, `PUT`, `DELETE`: `RETURNING *`, statuslar, 404 | Lesson | 4 |
| 20 | Nega `$1` — injection'ni o'zimiz qildik | Lesson | 4 · ichida |
| 21 | Amaliyot 3 — AvtoIjara server | Practice | 4 |
| 22 | Buzamiz 1: `price` ustuni | Lesson | 5 · buzamiz |
| 23 | Buzamiz 2: `express.json()` yo'q | Lesson | 5 |
| 24 | Ulanish xatolari — birinchi so'rovda | Lesson | 5 |
| 25 | Port band — «ishlayapti», lekin eski server | Lesson | 5 |
| 26 | Tekshiruv 4 — qaysi satr 500 beradi | LineCheck | 5 |
| 27 | Amaliyot 4 — o'zingiz buzing | Practice | 5 |
| 28 | Sinfga tayyorgarlik: m4-06 va m4-08 xaritasi | Lesson | 6 · sinfga tayyorgarlik |
| 29 | O'quvchilar xato qiladigan olti joy va savollari | Lesson | 6 |
| 30 | O'z-sinov — 8 savol | Screen27 | — |
| 31 | Yakun | Screen28 | — |

**Sahna turlari:** `psql` — terminal oynasi (PG-1 dagidek, Explorer'siz); «ichida» ekranlarda yonida chizma kartasi (fayl sahifasi, tranzaksiya holatlari, Pool); Express — VS Code oynasi `avto-ijara-server` (Explorer: `node_modules/` yopiq · `package.json` · `server.js`) + terminal + Postman ko'rinishidagi karta. **Tekshiruv (M42):** chapda savol va variantlar, o'ngda material savoldan oldin, isbot javobdan keyin, ostida `Demak`.

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · PostgreSQL` · Sarlavha: **Jadval tayyor. Endi uni boshqaramiz — PostgreSQL terminalida va Express ichida**
- Sahna: chapda reja (6 bosqich); o'ngda ikki natija: terminal `UPDATE 1` va Postman kartasi `POST /api/cars` → `201`.
- Reja: 01 CRUD terminalida · 02 Tranzaksiya: xavfsiz sinash va atomik ish · 03 Baza qo'riqlaydi · 04 Express'dan bazaga · 05 Buzamiz va tuzatamiz · 06 Sinfga tayyorgarlik
1. **PostgreSQL-1 da jadval yaratdingiz — bugun undagi ma'lumotni ==to'rt buyruq bilan boshqarasiz==**
   Ovoz: «Assalomu alaykum. Oldingi darsda PostgreSQL'ni o'rnatdingiz, jadval yaratdingiz va bog'ladingiz. Bugun jadvaldagi ma'lumotni boshqaramiz: qo'shish, ko'rish, o'zgartirish va o'chirish. Buni CRUD deyishadi, uning nimaligini keyingi ekranda aniq ko'ramiz.»
2. **Avval buyruqlar terminalda — va har birining ==ichida nima bo'lishi==: son, tartib, tranzaksiya**
   Ovoz: «Avval buyruqlarni terminalda qo'lda yozamiz va har birining ichida nima bo'lishini ko'ramiz: javobdagi son nimani sanaydi, nega qatorlar tartibi o'zgaradi, tranzaksiya ichida baza nima qiladi. Misolimiz kichik do'kon: klaviatura, sichqoncha, quloqchin, kolonka.» · reja 01–03
3. **Keyin o'sha so'rovlar Express ichida: ==`Pool` nima, nega `$1`==, server nega 500 beradi**
   Ovoz: «Keyin xuddi shu so'rovlarni Express serveri ichiga qo'yamiz. Pool nimaligini, nega qiymatlar dollar bir bilan berilishini, server qachon va nega besh yuz qaytarishini o'zingiz sinab ko'rasiz. Serverni ataylab buzamiz va tuzatamiz.» · reja 04–05
4. **Olti bosqich, to'rt amaliyot; oxirida ==ikki ekran sinfga tayyorgarlik==. Shoshilmang**
   Ovoz: «Dars olti bosqichdan iborat, orasida to'rtta amaliyot bor. Oxirgi ikki ekran sinfga tayyorgarlik: o'quvchi darslari xaritasi va o'quvchilar xato qiladigan joylar. Shoshilmang: har ekranni boshidan eshitish va matnini o'qish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.» · reja 06
- Manba: `pg2-out/03-update-delete.txt` (`UPDATE 1`), `11-crud-sorovlar.txt` (POST → 201).

---

## 2 · CRUD: to'rt amal — to'rt buyruq — to'rt endpoint  ← `Lesson`
- Kicker: `1-bosqich · CRUD terminalida` · Sarlavha: **CRUD — ma'lumot bilan qilinadigan to'rt amal: bazada buyruq, serverda endpoint**
- Sahna (M39; galma-gal): to'rt qatorli jadval — ustunlar: CRUD · ma'nosi · PostgreSQL buyrug'i · baza javobi · siz bilgan Mongoose · Express endpoint · status. 1-segmentda dastlabki ikki ustun; 2-segmentda SQL va Mongoose ustunlari (Mongoose ustuni xira, «siz bilgan» belgisi bilan); 3-segmentda Express ustunlari; 4-segmentda butun jadval.
  | CRUD | ma'nosi | PostgreSQL | baza javobi | siz bilgan Mongoose | Express | status |
  |---|---|---|---|---|---|---|
  | Create | yaratish | `INSERT` | `INSERT 0 4` | `Product.create(…)` | `POST /api/cars` | `201` |
  | Read | o'qish | `SELECT` | `(4 rows)` | `Product.find(…)` | `GET /api/cars` | `200` |
  | Update | o'zgartirish | `UPDATE` | `UPDATE 1` | `Product.updateOne(…)` → `matchedCount: 1` | `PUT /api/cars/2` | `200` |
  | Delete | o'chirish | `DELETE` | `DELETE 1` | `Product.deleteOne(…)` → `deletedCount: 1` | `DELETE /api/cars/1` | `200` |
1. **CRUD — to'rtta inglizcha so'zning ==bosh harfi==: yaratish, o'qish, o'zgartirish, o'chirish**
   Ovoz: «Bugungi darsning poydevori bitta so'z: CRUD. Bu to'rtta inglizcha so'zning bosh harfi: Create, Read, Update va Delete, ya'ni yaratish, o'qish, o'zgartirish va o'chirish. Har qanday ilova ma'lumot bilan aynan shu to'rt ishni qiladi: onlayn do'kon ham, Telegram ham.»
2. **PostgreSQL'da har amalning ==o'z buyrug'i bor==: `INSERT`, `SELECT`, `UPDATE`, `DELETE`**
   Ovoz: «PostgreSQL'da har amalning o'z buyrug'i bor: insert, select, update va delete. Siz bilgan Mongoose'da bular create, find, updateOne va deleteOne edi. Ma'nosi bir xil, faqat yozilishi boshqa. Har buyruqdan keyin baza qisqa javob qaytaradi, masalan update bir. Mongo'da uning o'rnida matchedCount bir chiqardi.»
3. **Serverda xuddi shu to'rt amal ==endpoint bo'ladi==: `POST`, `GET`, `PUT`, `DELETE`**
   Ovoz: «Serverda xuddi shu to'rt amal endpoint bo'ladi. Yaratish POST, o'qish GET, o'zgartirish PUT, o'chirish DELETE. Har endpoint ichida o'sha SQL buyrug'i turadi. Javobda status chiqadi: yaratilganda ikki yuz bir, qolganlarida ikki yuz.»
4. **Xulosa: har amalning bazada ==bitta buyrug'i==, serverda bitta endpoint'i bor**
   Ovoz: «Xulosa: CRUD to'rtta amal. Har amalning PostgreSQL'da bitta buyrug'i va serverda bitta endpoint'i bor. Bugun avval buyruqlarni terminalda qo'lda yozamiz va ichini ko'ramiz, keyin xuddi shularni Express serveri ichiga qo'yamiz.»
- Manba: `pg2-out/v2b-01-ekran3-7.txt` (`INSERT 0 4`, `(4 rows)`, `UPDATE 1`, `DELETE 1`), `v2d-mongoose.txt` (03.11, Mongoose 9.11.4 · MongoDB 6.0.27: `Product.create`, `find`, `updateOne` → `matchedCount: 1`, `deleteOne` → `deletedCount: 1`), `11-crud-sorovlar.txt` (POST 201 · GET/PUT/DELETE 200).

## 3 · `shop` bazasi: jadval va `INSERT`  ← `Lesson`
- Kicker: `1-bosqich · CRUD terminalida` · Sarlavha: **`products` — to'rt ustun, to'rt mahsulot; `id` ni baza o'zi beradi**
- Sahna: terminal: `CREATE DATABASE shop` → `\c shop` → `CREATE TABLE`, bitta `INSERT` (to'rt qator), `SELECT *`; yonida jadval chizmasi kartasi (ustun · tur). 1-segmentda kartaning ostida xira «Mongoose'da» bloki: `mongoose.connect('mongodb://localhost/shop')` dan keyin ham baza yo'q, birinchi `Product.create` dan keyingina paydo bo'ladi (haqiqiy: `v2d-mongoose.txt`). 2-segmentda `INSERT 0 4` ostida xira qator (`.mk-pair`): `await Product.create([ …4 ta… ])` → 4 ta hujjat.
1. **Mongo'da baza va kolleksiya o'zi paydo bo'lardi — bu yerda ==avval `CREATE DATABASE`, keyin jadval==**
   Ovoz: «Siz bilgan Mongoose'da connect yetardi: baza ham, kolleksiya ham birinchi create'da o'zi paydo bo'lardi. PostgreSQL'da avval create database bilan baza, keyin create table bilan jadval yaratiladi. Jadval products, to'rt ustun: id o'zi o'sadi, name matn, price va stock butun son. Hozircha ustunlarda qoida yo'q, bu ataylab.»
   ```
   postgres=# CREATE DATABASE shop;
   CREATE DATABASE
   postgres=# \c shop
   You are now connected to database "shop" as user "postgres".
   shop=# CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);
   CREATE TABLE
   ```
   Mongoose'da (xira, «siz bilgan»):
   ```
   await mongoose.connect('mongodb://localhost/shop')
   bazalar: admin · config · local          (shop hali yo'q)
   await Product.create([ …4 ta… ])         → 4 ta hujjat
   bazalar: admin · config · local · shop
   ```
2. **Bitta `INSERT` bilan to'rt qator; javob `INSERT 0 4` — ==oxirgi raqam qo'shilgan qatorlar soni==**
   Ovoz: «Bitta insert bilan to'rtta mahsulot qo'shamiz. Baza javobi insert, nol, to'rt. Oxirgi raqam nechta qator qo'shilganini aytadi. O'rtadagi nol eski versiyalardan qolgan, u hech narsani bildirmaydi, unga qaramang.»
   ```
   shop=# INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5), ('Kolonka', 50000, 10);
   INSERT 0 4
   ```
   Ostida xira qator: **Mongoose'da:** `await Product.create([ …4 ta… ])` → 4 ta hujjat.
3. **`SELECT *` — hamma ustun; `id` larni biz yozmadik, ==baza o'zi berdi==: `SERIAL`**
   Ovoz: «Select yulduzcha hamma ustunni ko'rsatadi. id ustunini biz yozmadik, baza o'zi bir, ikki, uch, to'rt deb berdi. Buni serial qiladi: ichida alohida hisoblagich bor, har yangi qatorga keyingi sonni beradi. Qator o'chirilsa ham hisoblagich orqaga qaytmaydi.»
   ```
    id |    name    | price  | stock
   ----+------------+--------+-------
     1 | Klaviatura | 120000 |     8
     2 | Sichqoncha |  75000 |    15
     3 | Quloqchin  |  95000 |     5
     4 | Kolonka    |  50000 |    10
   (4 rows)
   ```
4. **Xulosa: jadval tayyor — ==hech qanday qoidasiz==; baza faqat yozilgan qoidani qo'riqlaydi**
   Ovoz: «Xulosa: bazangizda to'rt mahsulotli do'kon bor. Bitta narsani eslab qoling: bu jadvalda hozircha not null ham, boshqa qoida ham yo'q. Baza faqat yozilgan qoidani qo'riqlaydi. Nima bo'lishini uchinchi bosqichda o'z ko'zingiz bilan ko'rasiz.»
- Manba: `pg2-out/v2b-01-ekran3-7.txt`; `CREATE DATABASE` / `\c shop` — `v2c-baza.txt`; Mongoose — `v2d-mongoose.txt`.

## 4 · `SELECT` va `WHERE`  ← `Lesson`
- Kicker: `1-bosqich · CRUD terminalida` · Sarlavha: **`WHERE` — minglab qatordan faqat keraklisi**
- Sahna: terminal: `SELECT name, price` → `WHERE price < 100000` (3 qator) → `WHERE stock < 6` (1 qator); jadval kartasida mos qatorlar yonadi.
1. **Hamma ustun kerak bo'lmasa — `SELECT`dan keyin ==faqat kerakli ustunlar== yoziladi**
   Ovoz: «Jadval bor, endi undan o'qiymiz. Hamma ustun kerak bo'lmasa, select'dan keyin faqat keraklisini yozasiz: nom va narx. Ma'lumot o'zgarmaydi, select faqat ko'rsatadi.»
2. **`WHERE price < 100000` — yuz mingdan arzonlari: ==uchta mahsulot==**
   Ovoz: «Minglab mahsulotdan faqat keraklisini olish uchun where yoziladi. Narxi yuz mingdan kam bo'lganlarini so'raymiz: sichqoncha, quloqchin va kolonka, uchta qator. Where har qatorni shartga solishtiradi va faqat to'g'ri chiqqanlarini qaytaradi. Mongoose'da bu find ichidagi dollar lt shart edi.»
   ```
   shop=# SELECT * FROM products WHERE price < 100000;
    id |    name    | price | stock
   ----+------------+-------+-------
     2 | Sichqoncha | 75000 |    15
     3 | Quloqchin  | 95000 |     5
     4 | Kolonka    | 50000 |    10
   (3 rows)
   ```
   Ostida xira qator: **Mongoose'da:** `await Product.find({ price: { $lt: 100000 } })` → 3 ta hujjat.
3. **`WHERE stock < 6` — tugayotgan mahsulot: ==faqat quloqchin==**
   Ovoz: «Ikkinchi filtr qoldig'i oltidan kam, ya'ni tugayotgan mahsulotlarni topadi. Natijada faqat quloqchin chiqdi, undan beshta qolgan. Do'kon menejeri aynan shu so'rov bilan nimani buyurtma qilishni biladi.»
4. **Xulosa: `SELECT` faqat o'qiydi; ==`WHERE` qatorlarni tanlaydi== — `UPDATE` va `DELETE`da ham aynan shu**
   Ovoz: «Xulosa: select hech narsani o'zgartirmaydi, faqat o'qiydi. Where qaysi qatorlar kerakligini aytadi. Keyingi ekranda update va delete'ni ko'rasiz: ularda ham aynan shu where ishlaydi, faqat endi u qaysi qatorlar o'zgarishini hal qiladi.»
- Manba: `pg2-out/01-create-insert-select.txt` (`SELECT name, price`), `02-where.txt`; Mongoose — `v2d-mongoose.txt`.

## 5 · `UPDATE`, `DELETE` va javobdagi son  ← `Lesson`
- Kicker: `1-bosqich · CRUD terminalida` · Sarlavha: **`UPDATE 1`, `DELETE 1`, `UPDATE 0` — javobdagi son nechta qator tegilganini aytadi**
- Sahna: terminal: `UPDATE … WHERE id = 1` → `UPDATE 1` · `DELETE … WHERE id = 3` → `DELETE 1` · `WHERE id = 99` → `UPDATE 0` / `DELETE 0` · `UPDATE … RETURNING` → yangi qoldiq.
1. **Klaviatura arzonladi: `UPDATE … WHERE id = 1` — javob ==`UPDATE 1`==, bitta qator**
   Ovoz: «Klaviatura narxi to'qson to'qqiz mingga tushdi. Buyruq: update products set price, where id bir. Baza javobi update bir: bitta qator o'zgardi. Javobdagi son doim nechta qator tegilganini aytadi, bu update'da ham, delete'da ham shunday.»
   ```
   shop=# UPDATE products SET price = 99000 WHERE id = 1;
   UPDATE 1
   ```
   Ostida xira qator: **Mongoose'da:** `await Product.updateOne({ _id: 1 }, { price: 99000 })` → `matchedCount: 1, modifiedCount: 1`.
2. **Quloqchin sotuvdan chiqdi: `DELETE … WHERE id = 3` — ==`DELETE 1`==**
   Ovoz: «Quloqchin sotuvdan chiqdi, uni o'chiramiz: delete from products, where id uch. Baza javobi delete bir. Qator butunlay ketdi, uning id'si esa qayta ishlatilmaydi.»
   ```
   shop=# DELETE FROM products WHERE id = 3;
   DELETE 1
   ```
   Ostida xira qator: **Mongoose'da:** `await Product.deleteOne({ _id: 3 })` → `deletedCount: 1`.
3. **Bunday `id` yo'q bo'lsa — ==xato emas==, `UPDATE 0` va `DELETE 0`**
   Ovoz: «To'qson to'qqizinchi mahsulotni o'zgartirib ko'ramiz. Xato chiqmaydi, javob update nol. Delete ham nol qaytaradi. Baza «bunday qator yo'q» demaydi: where hech qaysi qatorga mos kelmadi, shuning uchun hech narsaga tegmadi. Mongo'dagi matchedCount nol ham xuddi shu. Bu xato emas, bu javob.»
   ```
   shop=# UPDATE products SET price = 1 WHERE id = 99;
   UPDATE 0
   shop=# DELETE FROM products WHERE id = 99;
   DELETE 0
   ```
   Ostida xira qator: **Mongoose'da:** `await Product.updateOne({ _id: 99 }, { price: 1 })` → `matchedCount: 0`.
4. **`RETURNING` — baza o'zgargan ==qatorning o'zini qaytaradi==; mos qator bo'lmasa `(0 rows)`**
   Ovoz: «Bitta klaviatura sotildi: qoldiqni bittaga kamaytiramiz. Yangi qoldiq nechta bo'lganini siz hisoblamaysiz, buyruq oxiriga returning yozasiz va baza o'zgargan qatorni qaytaradi: klaviatura, yetti. To'qson to'qqizinchi id bilan returning nol qator beradi. Serverda aynan shu returning ishlatiladi.»
   ```
   shop=# UPDATE products SET stock = stock - 1 WHERE id = 1 RETURNING id, name, stock;
    id |    name    | stock
   ----+------------+-------
     1 | Klaviatura |     7
   (1 row)
   UPDATE 1
   ```
5. **Xulosa: har `UPDATE` va `DELETE`dan keyin ==javobdagi sonni o'qing==**
   Ovoz: «Xulosa: update va delete'dan keyin javobdagi sonni o'qing. Bir bo'lsa, kutganingiz bo'ldi. Nol bo'lsa, where hech narsaga mos kelmadi. Kutilmagan katta son bo'lsa, where noto'g'ri yoki umuman yozilmagan. Buni ikkinchi bosqichda xavfsiz ko'ramiz.»
- Manba: `pg2-out/v2b-01-ekran3-7.txt` (03.11, 3–7-ekranlar bitta bazada ketma-ket: `UPDATE 1`, `DELETE 1`, `UPDATE 0`, `DELETE 0`, `RETURNING` → 7, `(0 rows)`); Mongoose — `v2d-mongoose.txt`.

## 6 · Nega Klaviatura oxiriga tushdi — qator tartibi, `ctid`, `ORDER BY`  ← `Lesson`
- Kicker: `1-bosqich · ichida nima bo'ladi` · Sarlavha: **`UPDATE`dan keyin qator joyi o'zgardi — baza yangilangan qatorni yangi joyga yozadi**
- Sahna: terminal: `SELECT *` (Klaviatura oxirida) → `SELECT ctid, …` (`(0,6)`) → `SELECT … ORDER BY id`; yonida «fayl sahifasi» chizmasi: 1-o'rin (birinchi nusxa) va 5-o'rin (narx o'zgargandagi nusxa) chizilgan, 3-o'rin bo'sh (Quloqchin o'chirilgan), 6-o'rinda hozirgi Klaviatura.
1. **`SELECT *` — Klaviatura ==ro'yxat oxiriga tushdi==. Bu xato emas, lekin sababini bilish kerak**
   Ovoz: «Oldingi ekrandagi buyruqlardan keyin select qilamiz va natijaga qarang: uchta mahsulot qoldi, klaviatura esa birinchi emas, oxirida turibdi. Bu xato emas. Lekin «tasodif» deb qo'ya qolmaymiz: nega shunday bo'lganini bilish kerak, chunki bu savol albatta beriladi.»
   ```
   shop=# SELECT * FROM products;
    id |    name    | price | stock
   ----+------------+-------+-------
     2 | Sichqoncha | 75000 |    15
     4 | Kolonka    | 50000 |    10
     1 | Klaviatura | 99000 |     7
   (3 rows)
   ```
2. **Sabab: PostgreSQL yangilangan qatorni ==joyida o'zgartirmaydi== — yangi nusxasini bo'sh joyga yozadi**
   Ovoz: «Sabab bazaning ichida. PostgreSQL update'da qatorni joyida o'zgartirmaydi: eski nusxani «eskirgan» deb belgilaydi, yangisini fayldagi bo'sh joyga, bu yerda oxiriga yozadi. Eski nusxa keyinroq tozalanadi. Select yulduzcha esa qatorlarni fayldagi tartibda o'qiydi.»
3. **Isbot: `ctid` — qatorning fayldagi manzili; Klaviatura endi `(0,6)`: ==ikki o'zgarish — ikki yangi nusxa==**
   Ovoz: «Buni ko'rsa bo'ladi. Har qatorning ctid degan yashirin ustuni bor: bu uning fayldagi manzili, sahifa va o'rin. Select ctid qilsak, klaviatura nol vergul olti, ya'ni oltinchi o'rinda. Klaviatura ikki marta o'zgardi: avval narxi, keyin qoldig'i. Har safar baza yangi nusxa yozdi: beshinchi, keyin oltinchi o'rinda. Shuning uchun u oxirida chiqdi.»
   ```
   shop=# SELECT ctid, id, name, price FROM products;
    ctid  | id |    name    | price
   -------+----+------------+-------
    (0,2) |  2 | Sichqoncha | 75000
    (0,4) |  4 | Kolonka    | 50000
    (0,6) |  1 | Klaviatura | 99000
   (3 rows)
   ```
4. **Xulosa: tartib kerak bo'lsa — ==`ORDER BY id`==; usiz tartib hech qachon kafolatlanmaydi**
   Ovoz: «Xulosa: order by yozilmasa, baza qatorlarni fayldagi tartibda beradi, bu tartib esa har update'dan keyin o'zgarishi mumkin. Tartib kerak bo'lsa, oxiriga order by id yoziladi, shunda klaviatura yana birinchi. «Mahsulot o'rni o'zgardi» degan savolning javobi shu: order by yo'q edi.»
   ```
   shop=# SELECT * FROM products ORDER BY id;
    id |    name    | price | stock
   ----+------------+-------+-------
     1 | Klaviatura | 99000 |     7
     2 | Sichqoncha | 75000 |    15
     4 | Kolonka    | 50000 |    10
   (3 rows)
   ```
- Manba: `pg2-out/v2b-01-ekran3-7.txt` (5-ekrandagi buyruqlardan keyin: 3 qator, `ctid (0,6)`, `ORDER BY id`).

## 7 · Tekshiruv 1 — `UPDATE 0`  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Buyruq xatosiz o'tdi, javob `UPDATE 0`. Bu nimani bildiradi?**
- Material (`above`, M42): terminal `psql — shop`: `shop=# UPDATE products SET price = 1 WHERE id = 99;` → `UPDATE 0`.
- Ovoz: «Javobdagi sonni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Ekrandagi terminalda to'qson to'qqizinchi mahsulot narxi o'zgartirilmoqchi bo'ldi. Xato yo'q, javob: update nol. Bu nimani bildiradi? Variantni tanlang.»
- Variantlar (to'g'risi — 1): 1 `id = 99` yo'q — `WHERE` hech qatorga mos kelmadi · 2 Narxni o'zgartirishga foydalanuvchida ruxsat yo'q · 3 Jadval bo'shab qoldi — qator o'chirildi · 4 Narx o'zgardi, lekin hali `COMMIT` bo'lmadi
- To'g'ri (ovoz): «To'g'ri. Where id to'qson to'qqiz hech qanday qatorga mos kelmadi, shuning uchun nol qator o'zgardi. Baza buni xato deb hisoblamaydi. Ishonch hosil qilish uchun select bilan bunday id bor-yo'qligini tekshiring, ekranda shu select turibdi. Demak, update nol xato emas: where hech qaysi qatorga mos kelmaganini bildiradi.» · qisqa: «`UPDATE 0` — `WHERE` hech bir qatorga mos kelmadi. Xato emas: `SELECT … WHERE id = 99` ham bo'sh qaytaradi.»
- Isbot (`after`): terminal davomi: `shop=# SELECT * FROM products WHERE id = 99;` → `(0 rows)`.
- Demak: «`UPDATE 0` xato emas: `WHERE` hech qaysi qatorga mos kelmaganini bildiradi.»
- Xato izohlari: 2 — «Ruxsat yo'q bo'lsa `ERROR:  permission denied for table products` chiqardi; bu yerda xato yo'q.» · 3 — «Jadval joyida: `UPDATE 0` hech narsani o'chirmaydi.» · 4 — «Tranzaksiyasiz `UPDATE` darhol saqlanadi; son esa nechta qator tegilganini aytadi.»
- Maslahat: «Javobdagi son nimani sanaydi? `WHERE` qaysi qatorni topishi kerak edi?»
- Manba: `pg2-out/v2b-01-ekran3-7.txt` (`UPDATE 0`; `SELECT … WHERE id = 99` → `(0 rows)`); `18-qoshimcha.txt` (faqat SELECT huquqli foydalanuvchi → `permission denied`).

## 8 · Amaliyot 1 — do'konni o'zingiz boshqaring  ← `Practice`
- Kicker: `Amaliyot 1 / 4` · Eyebrow: `Hozir o'zingizda · 10–15 daqiqa` · Sarlavha: **`shop` bazasi va CRUD — to'rt buyruq, har javobdagi son** · `tableAt: 3`
1. **Endi siz: ==o'z bazangizda== jadval, to'rt mahsulot, ikki filtr, narx va o'chirish**
   Ovoz: «Endi navbat sizga. O'z bazangizda shu ishlarni qilasiz: jadval yaratasiz, to'rt mahsulot qo'shasiz, ikki filtr yozasiz, keyin narxni o'zgartirib, bitta mahsulotni o'chirasiz. Bunga o'n-o'n besh daqiqa ketadi.»
2. **1–3-qadam: baza, jadval, mahsulotlar va ==ikki filtr==**
   Ovoz: «Birinchi qadamda shop bazasi va products jadvalini yaratasiz. Ikkinchisida to'rtta mahsulotni bitta insert bilan qo'shasiz va javobdagi to'rtni ko'rasiz. Uchinchisida ikkita filtr yozasiz: arzonlarini va tugayotganlarini. Har buyruqdan keyin javob satrini o'qing.»
3. **4-qadam: narx va o'chirish; isbot — ==oxirgi `SELECT`dagi qatorlar soni==**
   Ovoz: «To'rtinchi qadamda klaviatura narxini o'zgartiring, quloqchinni o'chiring va select yulduzcha qiling. Klaviatura qayerda turganiga e'tibor bering. Isbot maydoniga oxirgi select natijasi ostidagi qatorlar sonini yozing.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz CRUD'ning to'rt buyrug'ini o'z bazangizda yozgan va har javobdagi sonni o'qigan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Baza va jadval | `psql -U postgres` · `CREATE DATABASE shop;` · `\c shop` · `CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);` | `CREATE DATABASE` · `CREATE TABLE` |
  | 2 | Mahsulotlar | `INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5), ('Kolonka', 50000, 10);` | `INSERT 0 4` |
  | 3 | Filtrlar | `SELECT * FROM products WHERE price < 100000;` · `SELECT * FROM products WHERE stock < 6;` | 3 qator · 1 qator (Quloqchin) |
  | 4 | Narx va o'chirish | `UPDATE products SET price = 99000 WHERE id = 1;` · `DELETE FROM products WHERE id = 3;` · `SELECT * FROM products;` | `UPDATE 1` · `DELETE 1` · `(3 rows)`, Klaviatura oxirida |
- Isbot: «Oxirgi `SELECT *` natijasidagi qatorlar soni» · placeholder: «natija ostidagi sonni yozing» · KOD: `/^\s*\(?\s*3\b/` · xato: «To'rt mahsulotdan bittasi o'chirilgach nechta qoladi? Natija ostidagi qavsdagi sonni yozing.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `ERROR:  database "shop" already exists` | baza oldin yaratilgan — `\c shop` |
  | `ERROR:  relation "products" does not exist` | boshqa bazadasiz (prompt `postgres=#`) — `\c shop` |
  | `INSERT 0 4` ikki marta | mahsulotlar ikki marta qo'shilgan — `id` lar 1–8; 4-qadamda `id`ni `SELECT` bo'yicha tanlang |
  | `UPDATE 0` / `DELETE 0` | bunday `id` yo'q — avval `SELECT *` bilan `id`ni ko'ring |
  | Klaviatura oxirida | xato emas — 6-ekran: `ORDER BY id` bilan tartiblang |
  | `ERROR:  syntax error at or near "…"` | `^` ko'rsatgan joydan oldin vergul, qavs yoki tirnoq tushib qolgan |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `pg2-out/v2-01`, `02`, `03`; PG-1 `pg1-out/10-relation-yoq.txt`, `22-tuzatishlar.txt` (`already exists`).

---

## 9 · `WHERE`'siz — hamma qator; `BEGIN … ROLLBACK`  ← `Lesson`
- Kicker: `2-bosqich · tranzaksiya` · Sarlavha: **`WHERE` unutilsa — `UPDATE 3`, `DELETE 3`. Xavfsiz sinash: `BEGIN … ROLLBACK`**
- Sahna: terminal (bitta seans): `BEGIN` → `UPDATE` (WHERE'siz) → `UPDATE 3` + jadval (hammasi 99000) → `DELETE FROM products;` → `DELETE 3` + `(0 rows)` → `ROLLBACK` → jadval joyida; yonida jadval kartasi rangini o'zgartiradi.
1. **`WHERE`'siz `UPDATE` yoki `DELETE` — ==hamma qator==. Buni ko'rish kerak, lekin bazani buzmasdan**
   Ovoz: «Javobdagi son kutilmagan katta bo'lsa, where yo'q edi, degandim. Buni o'z ko'zingiz bilan ko'rishingiz kerak, lekin bazani buzmasdan. Usul: avval begin, ya'ni tranzaksiya ochamiz. Undan keyingi hamma narsa vaqtincha bo'ladi.»
2. **`WHERE`'siz `UPDATE` — `UPDATE 3`: ==hamma mahsulot to'qson to'qqiz ming==**
   Ovoz: «Begin'dan keyin where'siz update. Baza javobi update uch. Select qilsak, hamma mahsulot to'qson to'qqiz ming so'm: sichqoncha ham, kolonka ham. Bitta unutilgan where butun narx ro'yxatini buzdi. Mongo'dan kelganlar aynan shu yerda xato qiladi: u yerda updateOne bitta hujjatga tegardi, bu yerda where yo'q bo'lsa hamma qator o'zgaradi.»
   ```
   BEGIN;
   UPDATE products SET price = 99000;
   UPDATE 3
    id |    name    | price | stock
     2 | Sichqoncha | 99000 |    15
     4 | Kolonka    | 99000 |    10
     1 | Klaviatura | 99000 |     7
   ```
   Yonida qizil chegarali karta (F-1103-09, Mongo'dan kelganlar tuzog'i):
   ```
   Mongoose'da:  await Product.updateOne({}, { price: 99000 })   → matchedCount: 1   (shartsiz ham BITTA hujjat)
                 hammasi uchun alohida: updateMany({}, …)        → matchedCount: 3
   PostgreSQL'da: WHERE'siz UPDATE — HAMMASI. Alohida «many» yo'q.
   ```
   (haqiqiy: `v2d-mongoose.txt`; `modifiedCount` u yerda 0 — Klaviatura 5-ekranda allaqachon 99 000 bo'lgan, shuning uchun kartada `matchedCount`.)
3. **`WHERE`'siz `DELETE` — `DELETE 3`, ==jadval bo'sh==**
   Ovoz: «Undan ham yomoni where'siz delete. Baza javobi delete uch, select esa nol qator qaytaradi. Haqiqiy do'konda bu butun katalog yo'qolgani. Lekin biz tranzaksiya ichidamiz.»
   ```
   DELETE FROM products;
   DELETE 3
   (0 rows)
   ```
4. **`ROLLBACK` — hammasi joyida: ==tranzaksiya ichidagi o'zgarish bekor bo'ldi==**
   Ovoz: «Endi rollback yozamiz va select qilamiz: uchala mahsulot joyida, narxlari ham eski. Tranzaksiya ichida qilingan hamma narsa bekor bo'ldi. PostgreSQL-1 da tranzaksiya do'konni himoya qilgan edi, bu yerda u sizning sinov maydoningiz.»
   ```
   ROLLBACK;
   ROLLBACK
    2 | Sichqoncha | 75000 |    15
    4 | Kolonka    | 50000 |    10
    1 | Klaviatura | 99000 |     7
   ```
5. **Xulosa: xavfli `UPDATE`/`DELETE`ni avval ==`BEGIN` ichida sinang==, `SELECT` bilan ko'ring**
   Ovoz: «Xulosa: xavfli update yoki delete'ni avval begin ichida yurgizing, select bilan natijani ko'ring. To'g'ri bo'lsa commit, noto'g'ri bo'lsa rollback. Bu bitta qator, lekin butun jadvalni saqlab qoladi. Keyingi ekranda tranzaksiya ichida baza aslida nima qilishini ko'ramiz.»
- Manba: `pg2-out/v2b-02-ekran9.txt` (o'sha baza, 6-ekrandan keyin); Mongoose tuzog'i — `v2d-mongoose.txt`.

## 10 · Tranzaksiya ichida nima bo'ladi: autocommit, `*#`, `!#`, aborted  ← `Lesson`
- Kicker: `2-bosqich · ichida nima bo'ladi` · Sarlavha: **Har buyruq o'zi saqlanadi; `BEGIN`dan keyin — faqat sizning seansingizda, `COMMIT`gacha**
- Sahna: ikki HAQIQIY psql seansi yonma-yon (A va B oynalari, `v2e-ikki-seans.txt`, GATE M 2C): A da `BEGIN` → `UPDATE` (89 000) → A `SELECT` yangi narx, B `SELECT` eski narx → A `COMMIT` → B yangi narx; keyin A da `SELECT 1/0` → `shop=!#` → `COMMIT` → `ROLLBACK`. Har segmentda har oyna ≤ 9 qator (yonma-yon qoladi, M43). Yonida «uch holat» kartasi: `shop=#` oddiy · `shop=*#` tranzaksiya ochiq · `shop=!#` xato bo'ldi.
1. **Oddiy holatda PostgreSQL ==autocommit==da: har buyruq bajarilishi bilan saqlanadi**
   Ovoz: «Oddiy holatda PostgreSQL autocommit rejimida ishlaydi: har buyruq bajarilishi bilan darhol saqlanadi, uni qaytarib bo'lmaydi. Birinchi bosqichdagi update va delete'lar aynan shunday saqlandi. Shuning uchun where'siz delete haqiqiy bazada halokat.»
2. **`BEGIN`dan keyin prompt `shop=*#` — ==yulduzcha: tranzaksiya ochiq==, o'zgarish faqat sizga ko'rinadi**
   Ovoz: «Begin yozganingizda prompt o'zgaradi: teng, yulduzcha, panjara. Yulduzcha tranzaksiya ochiqligini bildiradi. Endi o'zgarishlar faqat sizning seansingizda ko'rinadi. Sinab ko'rdik: A seansida klaviaturaga chegirma qildik, sakson to'qqiz ming. B seansi hali to'qson to'qqiz mingni ko'radi. Commit'dan keyingina B yangi narxni ko'rdi.»
   A oynasi:
   ```
   shop=# BEGIN;
   BEGIN
   shop=*# UPDATE products SET price = 89000 WHERE id = 1;
   UPDATE 1
   shop=*# SELECT name, price FROM products WHERE id = 1;
    Klaviatura | 89000
   shop=*# COMMIT;
   COMMIT
   ```
   B oynasi (A COMMIT qilguncha → keyin):
   ```
   shop=# SELECT name, price FROM products WHERE id = 1;
    Klaviatura | 99000
   shop=# SELECT name, price FROM products WHERE id = 1;
    Klaviatura | 89000
   ```
3. **Tranzaksiya ichida xato chiqsa — prompt `shop=!#`: ==aborted==, keyingi buyruqlar rad etiladi**
   Ovoz: «Tranzaksiya ichida biror buyruq xato bersa, prompt undov belgisiga o'zgaradi va baza «current transaction is aborted» deydi: keyingi buyruqlar bajarilmaydi, hatto oddiy select ham. Bu holatdan faqat rollback chiqaradi. Commit yozsangiz ham baza rollback qiladi, javobida shunday yozadi.»
   ```
   shop=*# SELECT 1/0;
   ERROR:  division by zero
   shop=!# SELECT name FROM products WHERE id = 1;
   ERROR:  current transaction is aborted, commands ignored until end of transaction block
   shop=!# COMMIT;
   ROLLBACK
   ```
4. **Xulosa: `BEGIN` — vaqtincha, `COMMIT` — saqla, `ROLLBACK` — bekor; ==`!#` ko'rsangiz — `ROLLBACK`==**
   Ovoz: «Xulosa: begin'dan keyin hamma narsa vaqtincha va faqat sizga ko'rinadi, commit saqlaydi, rollback bekor qiladi. Promptdagi yulduzcha tranzaksiya ochiqligini, undov belgisi xato bo'lganini aytadi. Undov belgisini ko'rsangiz, boshqa buyruq yozmang: rollback.»
- Manba: `pg2-out/v2e-ikki-seans.txt` (03.11, GATE M 2C: ikki haqiqiy psql seansi pty orqali, promptlar haqiqiy; 11-ekran qayta yurgizilib `v2b-04` bilan aynan); promptlar — `pg1-out/25-psql-promptlar.txt` (`=*#`, `=!#`; sinovda `postgres` bazasi, ekranda `shop`).

## 11 · Ikki jadval, bitta ish: `orders`, `CHECK`, atomik  ← `Lesson`
- Kicker: `2-bosqich · ichida nima bo'ladi` · Sarlavha: **Sotuv — ikki buyruq: qoldiqni kamaytirish va buyurtma yozish. Yo ikkalasi, yo hech biri**
- Sahna: terminal: `CHECK` va `CREATE TABLE orders` → muvaffaqiyatli sotuv (`BEGIN … COMMIT`) → muvaffaqiyatsiz (o'n ikki kolonka: `CHECK` xatosi → `!#` → `ROLLBACK`); yonida ikki jadval kartasi: `products.stock` va `orders` qatorlari segment bilan o'zgaradi.
1. **Do'konga qoida va ikkinchi jadval: ==`CHECK (stock >= 0)`== va `orders` — buyurtmalar**
   Ovoz: «Tranzaksiya faqat sinov uchun emas. Do'konga qoida qo'shamiz: qoldiq manfiy bo'lmasin, check stock katta yoki teng nol. Va ikkinchi jadval: orders, buyurtmalar: qaysi mahsulot, nechta va qachon. Created at ustuniga default now yozdik, vaqtni baza o'zi qo'yadi.»
   ```
   shop=# ALTER TABLE products ADD CONSTRAINT stock_nonneg CHECK (stock >= 0);
   ALTER TABLE
   shop=# CREATE TABLE orders (id SERIAL PRIMARY KEY, product_id INTEGER NOT NULL REFERENCES products(id), qty INTEGER NOT NULL CHECK (qty > 0), created_at TIMESTAMP DEFAULT now());
   CREATE TABLE
   ```
2. **Bitta sotuv — ikki buyruq: `UPDATE` qoldiqni kamaytiradi, `INSERT` buyurtma yozadi — ==`BEGIN … COMMIT` ichida==**
   Ovoz: «Bitta sichqoncha sotildi. Bu ikki buyruq: qoldiqni bittaga kamaytirish va buyurtma yozish. Ikkalasi begin va commit orasida. Returning qoldiq o'n to'rt bo'lganini, buyurtma esa bir raqam va vaqt bilan yozilganini ko'rsatdi. Commit'dan keyin ikkalasi ham saqlandi.»
   ```
   shop=# BEGIN;
   shop=*# UPDATE products SET stock = stock - 1 WHERE id = 2 RETURNING name, stock;
    Sichqoncha |    14
   shop=*# INSERT INTO orders (product_id, qty) VALUES (2, 1) RETURNING *;
     1 |          2 |   1 | 2026-11-03 14:32:57
   shop=*# COMMIT;
   COMMIT
   ```
3. **O'n ikki kolonka so'raldi, bor-yo'g'i o'nta: ==`CHECK` rad etdi==, tranzaksiya aborted — `ROLLBACK`**
   Ovoz: «Endi o'n ikkita kolonka so'raldi, omborda o'nta. Buyurtma yozildi, keyin update qoldiqni minus ikki qilmoqchi bo'ldi. Check rad etdi: new row violates check constraint stock nonneg. Tranzaksiya aborted. Rollback qilamiz: buyurtma ham yo'qoldi, qoldiq ham o'nta. Yolg'on buyurtma qolmadi.»
   ```
   shop=# BEGIN;
   shop=*# INSERT INTO orders (product_id, qty) VALUES (4, 12) RETURNING id, product_id, qty;
     2 |          4 |  12
   shop=*# UPDATE products SET stock = stock - 12 WHERE id = 4;
   ERROR:  new row for relation "products" violates check constraint "stock_nonneg"
   DETAIL:  Failing row contains (4, Kolonka, 50000, -2).
   shop=!# ROLLBACK;
   ROLLBACK
   shop=# SELECT * FROM orders;
     1 |          2 |   1 | 2026-11-03 14:32:57
   (1 row)
   ```
4. **Xulosa: bir ishga tegishli buyruqlar ==bitta tranzaksiyada==; qoida bazada bo'lsa, yarim ish qolmaydi**
   Ovoz: «Xulosa: bir ishga tegishli buyruqlar bitta tranzaksiyada bo'ladi: yo hammasi saqlanadi, yo hech biri. Buni atomik deyishadi. Qoida bazaning o'zida bo'lsa, kod xato qilsa ham yarim ish qolmaydi. PostgreSQL-1 dagi «oxirgi telefon» masalasining javobi aynan shu: tranzaksiya va qoida.»
- Manba: `pg2-out/v2b-04-ekran11.txt` (o'sha baza, 10-ekrandan keyin).

## 12 · Tekshiruv 2 — `ROLLBACK`dan keyin  ← `MCRetry`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4`
- Sarlavha: **`BEGIN;` → `DELETE FROM products;` (`DELETE 3`) → `ROLLBACK;`. Endi `SELECT * FROM products;` nima qaytaradi?**
- Material (`above`): terminal `psql — shop`: `shop=# BEGIN;` · `shop=*# DELETE FROM products;` → `DELETE 3` · `shop=*# ROLLBACK;` → `ROLLBACK` · `shop=#`.
- Ovoz: «Tranzaksiya ichini ko'rdingiz, tekshirib olaylik. Ikkinchi tekshiruv. Ekranda: begin, where'siz delete, javob delete uch, keyin rollback. Endi select qilsak, jadvalda nima bor? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Nol qator — `DELETE 3` allaqachon bajarilgan · 2 Faqat bitta qator — oxirgisi qaytib keladi · 3 Uchalasi — `ROLLBACK` o'chirishni bekor qildi · 4 `ERROR` — o'chirilgan jadvaldan o'qib bo'lmaydi
- To'g'ri (ovoz): «To'g'ri. Delete tranzaksiya ichida edi, rollback uni bekor qildi. Uchala mahsulot joyida, ekranda select shuni ko'rsatdi. Commit yozilmaguncha hech qanday o'zgarish saqlanmaydi. Demak, begin va rollback xavfli buyruqni bazani buzmasdan sinash imkonini beradi.» · qisqa: «`ROLLBACK` — tranzaksiya ichidagi hamma o'zgarish bekor: uch qator joyida.»
- Isbot (`after`): `shop=# SELECT * FROM products;` → uch qator (Sichqoncha · Kolonka · Klaviatura).
- Demak: «`COMMIT` yozilmaguncha tranzaksiya ichidagi o'zgarish saqlanmaydi; `ROLLBACK` hammasini bekor qiladi.»
- Xato izohlari: 1 — «`DELETE 3` tranzaksiya ichida edi va `COMMIT` qilinmadi.» · 2 — «`ROLLBACK` bitta qatorni emas, butun tranzaksiyani bekor qiladi.» · 4 — «`DELETE` qatorlarni o'chiradi, jadvalni emas; jadval doim joyida.»
- Maslahat: «`ROLLBACK` tranzaksiya ichidagi o'zgarishlar bilan nima qiladi?»
- Manba: `pg2-out/04-wheresiz-rollback.txt`.

## 13 · Amaliyot 2 — `BEGIN … ROLLBACK`  ← `Practice`
- Kicker: `Amaliyot 2 / 4` · Eyebrow: `Hozir o'zingizda · 5–10 daqiqa` · Sarlavha: **`WHERE`'siz `UPDATE`ni xavfsiz sinang — promptdagi yulduzchani kuzating** · `tableAt: 3`
1. **Endi siz: `WHERE`'siz `UPDATE`ni o'z bazangizda, lekin ==tranzaksiya ichida== qilasiz**
   Ovoz: «Endi o'zingiz: where'siz update'ni o'z bazangizda qilasiz, lekin tranzaksiya ichida. Bunga besh-o'n daqiqa ketadi. Bundan keyin har xavfli buyruqni shu usulda sinaysiz.»
2. **1–2-qadam: `BEGIN` (prompt `shop=*#`), `WHERE`'siz `UPDATE` va `SELECT` — ==hamma narx bir xil==**
   Ovoz: «Birinchi qadamda begin yozasiz va promptda yulduzcha paydo bo'lganini ko'rasiz. Ikkinchisida where'siz update qilib, select bilan hamma narx bir xil bo'lganini ko'rasiz. Commit yozmang.»
3. **3–4-qadam: `ROLLBACK` va `SELECT`; isbot — ==klaviaturaning narxi==**
   Ovoz: «Uchinchi qadamda rollback yozasiz, prompt oddiy holatga qaytadi. To'rtinchisida yana select qilasiz. Isbot maydoniga klaviaturaning hozirgi narxini yozing, rollback'dan keyingisini.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz where'siz update qanday xavfli ekanini ko'rdingiz va rollback bilan hammasini qaytarishni o'rgandingiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Tranzaksiya | `BEGIN;` | `BEGIN` · prompt `shop=*#` |
  | 2 | WHERE'siz | `UPDATE products SET price = 1;` · `SELECT * FROM products;` | `UPDATE 3` · hamma narx 1 |
  | 3 | Bekor | `ROLLBACK;` | `ROLLBACK` · prompt `shop=#` |
  | 4 | Tekshirish | `SELECT * FROM products;` | narxlar eski |
- Isbot: «`ROLLBACK`dan keyingi Klaviatura narxi» · placeholder: «klaviatura narxini yozing» · KOD: `/^\s*99\s?000\s*$/` · xato: «`ROLLBACK`dan keyin narx 1-amaliyotdagidek bo'ladi. `SELECT` natijasidan Klaviatura qatorini o'qing.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `WARNING:  there is no transaction in progress` (ROLLBACK'da) | `BEGIN` yozilmagan — o'zgarish allaqachon saqlangan; narxlarni 1-amaliyotdagi `UPDATE`lar bilan tiklang |
  | narx 120000 | 1-amaliyotning 4-qadami (99 000) bajarilmagan — 1-amaliyotni tugating |
  | prompt `shop=!#` | tranzaksiya ichida xato bo'ldi — `ROLLBACK;` yozing (10-ekran) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `pg2-out/04`, `18-qoshimcha.txt` (`BEGIN`siz `ROLLBACK`); promptlar — `pg1-out/25-psql-promptlar.txt`.

---

## 14 · Qoida yozilmasa — qo'riqlamaydi: `NOT NULL`, `DEFAULT`, `UNIQUE`  ← `Lesson`
- Kicker: `3-bosqich · baza qo'riqlaydi` · Sarlavha: **Nomsiz mahsulot xato bermay saqlandi — qoidani o'zimiz qo'shamiz, baza rad eta boshlaydi**
- Sahna: terminal segmentma-segment; yonida `\d products` kartasi — qoidalar qo'shilib boradi (`not null`, `0`, `UNIQUE`, `CHECK`).
1. **Nomsiz `INSERT` — `INSERT 0 1`, ==xato yo'q==: jadvalda `NOT NULL` yo'q edi**
   Ovoz: «Uchinchi bosqich: baza qanday qo'riqlaydi. Nomsiz mahsulot qo'shamiz: faqat narx va qoldiq. Xato chiqmadi, insert nol bir. Where name is null bilan qidirsak, beshinchi qator: nomi bo'sh. Baza faqat yozilgan qoidani qo'riqlaydi, biz esa qoida yozmagan edik.»
   ```
   shop=# INSERT INTO products (price, stock) VALUES (30000, 4);
   INSERT 0 1
   shop=# SELECT * FROM products WHERE name IS NULL;
     5 |      | 30000 |     4
   ```
2. **`NOT NULL` qo'shmoqchimiz — baza rad etdi: ==ustunda bo'sh qiymat bor==. Avval tozalaymiz, keyin qoida**
   Ovoz: «Endi qoida qo'shamiz: alter table, name set not null. Baza rad etdi: column name contains null values. Mantiqli: bo'sh nom bor ekan, qoidani qo'yib bo'lmaydi. Nomsiz qatorni o'chiramiz va qoidani qayta qo'shamiz. Endi nomsiz insert xato beradi: violates not-null constraint.»
   ```
   shop=# ALTER TABLE products ALTER COLUMN name SET NOT NULL;
   ERROR:  column "name" of relation "products" contains null values
   shop=# DELETE FROM products WHERE name IS NULL;
   DELETE 1
   shop=# ALTER TABLE products ALTER COLUMN name SET NOT NULL;
   ALTER TABLE
   shop=# INSERT INTO products (price, stock) VALUES (30000, 4);
   ERROR:  null value in column "name" of relation "products" violates not-null constraint
   ```
3. **`DEFAULT 0` — berilmagan qoldiq nol bo'ladi; ==`UNIQUE`== — ikkinchi «Kolonka» rad etiladi**
   Ovoz: «Yana ikki qoida. Default: stock berilmasa nol bo'lsin, planshet nol qoldiq bilan saqlandi. Unique: nom takrorlanmasin. Ikkinchi kolonka qo'shmoqchi bo'lsak, baza duplicate key value deydi va qaysi qiymat takrorlanganini aytadi.»
   ```
   shop=# ALTER TABLE products ALTER COLUMN stock SET DEFAULT 0;
   shop=# INSERT INTO products (name, price) VALUES ('Planshet', 300000) RETURNING *;
     7 | Planshet | 300000 |     0
   shop=# ALTER TABLE products ADD CONSTRAINT products_name_unique UNIQUE (name);
   shop=# INSERT INTO products (name, price, stock) VALUES ('Kolonka', 1, 1);
   ERROR:  duplicate key value violates unique constraint "products_name_unique"
   DETAIL:  Key (name)=(Kolonka) already exists.
   ```
4. **Xulosa: `\d products` — hamma qoida bir joyda; ==qoida bazada bo'lsa==, xatoni kod emas, baza ushlaydi**
   Ovoz: «Xulosa: backslash d products jadvalning hamma qoidasini ko'rsatadi: not null, default, unique, check va tashqi kalit. Qoida bazada bo'lsa, xatoni kod emas, baza ushlaydi, va har xabar ichida qoidaning nomi turadi. Keyingi ekranda shu xabarlarni o'qishni mashq qilamiz.»
   ```
   shop=# \d products
    Column |  Type   | Nullable | Default
    name   | text    | not null |
    stock  | integer |          | 0
   Indexes: "products_name_unique" UNIQUE CONSTRAINT, btree (name)
   Check constraints: "stock_nonneg" CHECK (stock >= 0)
   Referenced by: TABLE "orders" CONSTRAINT "orders_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id)
   ```
- Manba: `pg2-out/v2f-ekran14.txt` (03.11, 3→11-ekran holatidan keyin: nomsiz qator id 5, Planshet id 7 — v2-03 bilan bir xil).

## 15 · Xabarni o'qish: beshta xato  ← `Lesson`
- Kicker: `3-bosqich · baza qo'riqlaydi` · Sarlavha: **Beshta xato — har birida xabarning o'zi nimani tuzatishni aytadi**
- Sahna: terminal, har segmentda bitta xato (qizil) va tuzatish (yashil); tepada PG-1 formulasi «qaysi jadval · qaysi qoida/ustun · qaysi qiymat».
1. **`relation "product" does not exist` — jadval nomi: ==bitta `s` yetmaydi==**
   Ovoz: «Endi eng ko'p uchraydigan xatolar. Birinchisi jadval nomida: products o'rniga product yozilgan. Baza relation product does not exist deydi. Relation — bazaning jadvalga beradigan nomi. Jadval bor, faqat nomi bitta harfga farq qiladi.»
   ```
   shop=# SELECT * FROM product WHERE price < 100000;
   ERROR:  relation "product" does not exist
   ```
2. **`column "narx" does not exist` — ustun nomi; `HINT` esa ==noto'g'ri ustunni taklif qiladi==**
   Ovoz: «Ikkinchisi ustun nomida: narx deb yozilgan. Baza column narx does not exist deydi, ostida hint: perhaps you meant name. Diqqat: hint taxmin qiladi va bu yerda adashgan, kerakli ustun price. Hint'ga emas, backslash d ga ishoning.»
   ```
   ERROR:  column "narx" does not exist
   HINT:  Perhaps you meant to reference the column "products.name".
   ```
3. **Son o'rniga matn va tushib qolgan qiymat — `invalid input syntax`, ==`more target columns`==**
   Ovoz: «Uchinchisi: narx ustuniga arzon degan so'z yozilgan, baza invalid input syntax for type integer deydi. To'rtinchisi: uchta ustun yozilgan, qiymat esa ikkita, baza insert has more target columns than expressions deydi. Ikkalasida ham strelka xato joyni ko'rsatadi.»
   ```
   ERROR:  invalid input syntax for type integer: "arzon"
   ERROR:  INSERT has more target columns than expressions
   ```
4. **O'zbekcha apostrof satrni yopadi: `syntax error at or near "yinchoq"` — ==ikki marta yoziladi==**
   Ovoz: «Beshinchisi, o'zbekcha matnda eng ko'p uchraydigani: apostrof. O'yinchoq so'zidagi apostrof matnni erta yopib qo'yadi, baza yinchoq so'zida adashadi. Tuzatish: so'z ichidagi apostrof ikki marta yoziladi, saqlanganda bitta bo'ladi.»
   ```
   ERROR:  syntax error at or near "yinchoq"
   shop=# INSERT INTO products (name, price, stock) VALUES ('O''yinchoq', 30000, 4) RETURNING *;
     9 | O'yinchoq | 30000 |     4
   ```
5. **Xulosa: xabar ichidagi nomni ==`\d products`== bilan solishtiring; `^` xato joyni ko'rsatadi**
   Ovoz: «Xulosa: bu xatolarning hammasida xabar ichida nom yoki qiymat turadi. Uni jadval tuzilishi bilan solishtiring, backslash d products. Strelka xato joyni ko'rsatadi. Apostrof uchun bitta qoida: so'z ichidagi apostrof ikki marta.»
- Manba: `pg2-out/v2f-ekran15-16.txt` (03.11, uzluksiz holat: O'yinchoq id 9).

## 16 · Tekshiruv 3 — apostrof  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **`VALUES ('O'yinchoq', 30000, 4)` → `syntax error at or near "yinchoq"`. Tuzatish qaysi?**
- Material (`above`): terminal `psql — shop`: `shop=# INSERT INTO products (name, price, stock) VALUES ('O'yinchoq', 30000, 4);` → `ERROR:  syntax error at or near "yinchoq"` + `LINE 1: …` + `^`.
- Ovoz: «Xabarlarni o'qidingiz, tekshirib olaylik. Uchinchi tekshiruv. Ekranda o'yinchoq degan mahsulot qo'shilmoqchi, baza syntax error, yinchoq so'zida deydi. Nima bo'ldi va tuzatish qaysi? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 Nomni kirillda yozish — apostrof kerak emas · 2 Apostrofni ikki marta yozish: `'O''yinchoq'` · 3 Nomni qo'shtirnoqqa olish: `"O'yinchoq"` · 4 `name` ustunini `VARCHAR` emas, `TEXT` qilish
- To'g'ri (ovoz): «To'g'ri. SQL'da matn bir tirnoq ichida, so'z ichidagi apostrof uni erta yopadi. Ikki marta yozilsa, baza uni bitta apostrof deb tushunadi. Ekranda tuzatilgan insert: mahsulot o'yinchoq nomi bilan saqlandi. Demak, SQL matnidagi har apostrof ikki marta yoziladi.» · qisqa: «`'O''yinchoq'` — so'z ichidagi apostrof ikki marta. Saqlanganda bitta bo'ladi: `O'yinchoq`.»
- Isbot (`after`): `shop=# INSERT … VALUES ('O''yinchoq', 30000, 4) RETURNING *;` → `9 | O'yinchoq | 30000 | 4`.
- Demak: «SQL matnidagi apostrof ikki marta yoziladi: `'O''yinchoq'`.»
- Xato izohlari: 1 — «Muammo harfda emas, apostrofda: u matnni erta yopyapti.» · 3 — «Qo'shtirnoq SQL'da ustun yoki jadval nomi uchun — sinab ko'rdik: `column "O'yinchoq" does not exist`.» · 4 — «Ustun turi bu xatoga aloqasiz: xato matn yozilishida.»
- Maslahat: «Matn qaysi belgi bilan boshlanib, qaysi belgi bilan tugaydi? Apostrof shu belgining o'zi.»
- Manba: `pg2-out/v2f-ekran15-16.txt` (03.11: `"O'yinchoq"` → `column "O'yinchoq" does not exist`; tuzatilgan insert → id 9).

---

## 17 · `Pool` nima va qachon ulanadi — o'lchab ko'rdik  ← `Lesson`
- Kicker: `4-bosqich · Express · ichida nima bo'ladi` · Sarlavha: **`Pool` — ulanishlar to'plami: yaratilganda ulanmaydi, birinchi so'rovda ulanadi, keyin shu ulanishni qayta ishlatadi**
- Sahna: VS Code `avto-ijara-server` → `server.js` tepasi (`require('pg')`, `new Pool({…})`) + terminal `node pool-pid.js` chiqishi (segment bilan qatorlar); yonida chizma: server ↔ Pool (bitta ulanish) ↔ PostgreSQL jarayoni (`pid`).
1. **Express'da bazaga `pg` paketi orqali boriladi; kod tepasida ==`new Pool({ user, password, database, host, port })`==**
   Ovoz: «Terminalda qilganlaringizni endi server ichiga ko'chiramiz. Node'da PostgreSQL bilan pg paketi gaplashadi. Kodning tepasida pg'dan Pool olinadi va unga foydalanuvchi, parol, baza nomi, host va port beriladi. Pool so'zi «hovuz», ya'ni ulanishlar to'plami degani. Nega to'plam, hozir ko'rasiz.»
   ```js
   const { Pool } = require('pg');
   const pool = new Pool({ user: 'postgres', password: '…', database: 'car_rental', host: 'localhost', port: 5432 });
   ```
2. **O'lchab ko'rdik: `Pool` yaratilganda ulanish ==nol==; birinchi so'rovda ulanadi, keyingi so'rovlar o'sha ulanishda**
   Ovoz: «Buni o'lchab ko'rdik. Pool yaratilgan zahoti ulanishlar soni nol: u hali bazaga bormagan. Birinchi so'rovda ulanadi. Keyin yana ikki so'rov yubordik: bazadagi jarayon raqami, pid, uchalasida bir xil, faol ulanish bitta. Ya'ni Pool har so'rovga yangi ulanish ochmaydi, borini qayta ishlatadi.»
   ```
   Pool yaratildi · ulanishlar: 0
   so'rov 1: baza jarayoni pid 378069 · bazadagi faol ulanishlar 1 · Pool ulanishlari 1
   so'rov 2: baza jarayoni pid 378069 · bazadagi faol ulanishlar 1 · Pool ulanishlari 1
   so'rov 3: baza jarayoni pid 378069 · bazadagi faol ulanishlar 1 · Pool ulanishlari 1
   ```
3. **Nega muhim: ulanish ochish qimmat; va ==xato faqat birinchi so'rovda== — parol xato bo'lsa ham server «ishlayapti» deydi**
   Ovoz: «Bu ikki narsani tushuntiradi. Birinchisi: bazaga ulanish qimmat ish, shuning uchun uni bir marta ochib, qayta ishlatish to'g'ri. Ikkinchisi: Pool yaratilganda ulanmagani uchun parol xato bo'lsa ham server xatosiz ishga tushadi, xato faqat birinchi so'rovda chiqadi. Sinab ko'rdik: xato parol bilan Pool yaratildi, xato yo'q; birinchi so'rovda password authentication failed.»
   ```
   xato parol bilan Pool yaratildi — xato yo'q (hali ulanmadi)
   birinchi so'rovda: password authentication failed for user "postgres"
   ```
4. **Xulosa: `Pool` bir marta sozlanadi, ==birinchi so'rovda ulanadi==, ulanishni qayta ishlatadi; «server ishlayapti» — baza haqida emas**
   Ovoz: «Xulosa: Pool bir marta sozlanadi, birinchi so'rovda ulanadi va ulanishni qayta ishlatadi. Terminaldagi «server ishlayapti» faqat Express haqida, baza haqida hech narsa demaydi. Buni beshinchi bosqichda, ulanish xatolarida yana ko'rasiz. Endi Pool orqali birinchi so'rovni yuboramiz.»
- Manba: `pg2-out/v2f-pool.txt` (03.11, demo-baza holatida; pid 378069), `11-server.js`.

## 18 · `GET`: `pool.query` → `rows`, `rowCount` → `res.json`  ← `Lesson`
- Kicker: `4-bosqich · Express` · Sarlavha: **`pool.query` so'rovni bazaga olib boradi; javobda `rows` — qatorlar, `rowCount` — terminaldagi son**
- Sahna: `server.js` GET bo'lagi (yoritish segment bilan) + Postman kartasi `GET /api/cars` → 200 JSON + terminal `rowCount: 4 · rows: [...]`.
1. **`GET /api/cars`: `pool.query('SELECT * FROM cars')` — ==natijaning `rows` qismi== `res.json` bilan qaytadi**
   Ovoz: «GET api cars endpoint'i. Pool query select'ni bazaga olib boradi. Natija obyektida bir nechta narsa bor, bizga ikkitasi kerak: rows, ya'ni qatorlar massivi, va rowCount. Rows res json bilan qaytariladi. Postman'da ikki yuz va uchta mashina. Bu terminaldagi select'ning o'zi, faqat javob JSON ko'rinishida.»
   Postman: `GET localhost:3000/api/cars` → **200** `[{"id":1,"model":"Chevrolet Cobalt","daily_price":280000,"year":2022,"is_rented":false}, …]`
2. **`rowCount` — terminaldagi `UPDATE 1` ning o'zi: o'lchadik, ==`WHERE id = 99` → `rowCount: 0`==, `rows: []`**
   Ovoz: «Rowcount nechta qator tegilganini aytadi, bu terminaldagi update bir yoki select'dagi qatorlar sonining o'zi. Sinab ko'rdik: shop bazasida where price kichik yuz ming bilan rowcount uch. Update where id to'qson to'qqiz bilan rowcount nol va rows bo'sh massiv. Birinchi bosqichdagi update nol aynan shu yerga keladi.»
   ```
   rowCount: 3 · rows: [{"name":"Klaviatura","price":89000},{"name":"Sichqoncha","price":75000},{"name":"Kolonka","price":50000}]
   UPDATE id=99 → rowCount: 0 · rows: []
   ```
3. **`async`/`await` va `try`/`catch`: so'rov kutiladi; xato bo'lsa ==status 500 va xato matni==**
   Ovoz: «Pool query va'da qaytaradi, shuning uchun await bilan kutiladi, funksiya esa async. Hammasi try ichida. Xato bo'lsa catch ishlaydi: server besh yuz status va xato matnini qaytaradi. Beshinchi bosqichda xatolarning hammasini aynan shu catch orqali ko'rasiz.»
   ```js
   app.get('/api/cars', async (req, res) => {
     try { const result = await pool.query('SELECT * FROM cars'); res.json(result.rows); }
     catch (err) { res.status(500).json({ error: err.message }); }
   });
   ```
4. **Xulosa: ==`Pool` → `pool.query` → `rows` / `rowCount` → `res.json`== — so'rov serverdan bazaga shu to'rt qadamda boradi**
   Ovoz: «Xulosa: so'rov serverdan bazaga to'rt qadamda boradi. Pool ulanadi, pool query so'rov yuboradi, natijadan rows yoki rowcount olinadi, res json javob qaytaradi. Keyingi ekranda qolgan uch endpoint: ularda ham shu to'rt qadam, faqat SQL boshqa.»
- Manba: `pg2-out/11-server.js`, `11-crud-sorovlar.txt` (GET 200), `v2f-pool.txt` (`rowCount` — 3→11-ekran holatidagi shop bazasida, 03.11).

## 19 · `POST`, `PUT`, `DELETE`: `RETURNING *`, statuslar, 404  ← `Lesson`
- Kicker: `4-bosqich · Express` · Sarlavha: **Uch yozuvchi endpoint — uch SQL buyruq; javob statusi va `rowCount` bilan**
- Sahna: `server.js` (POST/PUT/DELETE bo'laklari navbat bilan yonadi) + Postman kartalari (status rangli).
1. **`POST` — `INSERT … RETURNING *`: ==yangi qator javobda==, status 201**
   Ovoz: «GET o'qiydi, qolgan uchtasi yozadi. POST'da insert, oxirida returning yulduzcha, birinchi bosqichda ko'rgansiz: baza yangi qatorni, id bilan, qaytaradi. Shu qator rows nol bo'lib javobga ketadi. Status ikki yuz bir, ya'ni yaratildi. Chevrolet Spark to'rtinchi id bilan qo'shildi.»
   Postman: `POST /api/cars` `{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }` → **201** `{"id":4,…,"is_rented":null}`
2. **`is_rented: null` — `POST`da berilmagan ustun bo'sh qoldi: ==jadvalda `DEFAULT` yo'q==**
   Ovoz: «Javobga qarang: is rented null. POST'da bu ustun berilmadi, jadvalda esa default qiymat yo'q. Uchinchi bosqichni eslang: baza faqat yozilgan qoidani bajaradi. Yechim jadvalda: alter table, is rented set default false. Shunda yangi mashina doim bo'sh deb yoziladi.»
3. **`PUT` — `UPDATE … WHERE id = $2`, `DELETE` — `WHERE id = $1`: 200; ==`rowCount` nol bo'lsa — 404==**
   Ovoz: «PUT ikkinchi mashina narxini yangiladi, ikki yuz va yangilangan qator. DELETE birinchi mashinani o'chirdi. Ikkalasida where bor, id URL'dan keladi. To'qson to'qqizinchi mashina: baza update nol qaytaradi, xato emas. Bu namunada kod rowcount nolmi deb tekshiradi va to'rt yuz to'rt beradi: mashina topilmadi. Rowcount'siz javob ikki yuz bo'lardi, ya'ni yolg'on «o'zgardi».»
   Postman: `PUT /api/cars/2` `{ "daily_price": 480000 }` → **200** · `DELETE /api/cars/1` → **200** `{"message":"O'chirildi","deleted":1}` · `PUT /api/cars/99` → **404** `{"error":"Mashina topilmadi"}`
4. **Xulosa: GET — 200, POST — 201, PUT/DELETE — 200, ==topilmasa — 404==, xato — 500; 404 ni `rowCount` hal qiladi**
   Ovoz: «Xulosa: GET ikki yuz, POST ikki yuz bir, PUT va DELETE ikki yuz; qator topilmasa to'rt yuz to'rt, xato bo'lsa besh yuz. To'rt yuz to'rtni kim hal qiladi? Rowcount, ya'ni terminaldagi update nol. Endi eng muhim savol: nega qiymatlar dollar bir bilan beriladi.»
- Manba: `pg2-out/11-crud-sorovlar.txt`, `11-server.js` (`rowCount === 0` → 404).

## 20 · Nega `$1` — injection'ni o'zimiz qildik  ← `Lesson`
- Kicker: `4-bosqich · Express · ichida nima bo'ladi` · Sarlavha: **Yopishtirilgan SQL: `1 OR 1=1` — uchala mashina o'chdi. `$1` bilan — 500, jadval joyida**
- Sahna: ikki ustun: chapda yopishtirilgan `DELETE` satri (qizil) + Postman `DELETE /api/cars/1 OR 1=1` → 200 `deleted: 3` + jadval `(0 rows)`; o'ngda `$1` satri (yashil) + 500 + jadval joyida.
1. **Qiymatni SQL matniga yopishtirish: `'… WHERE id = ' + req.params.id` — ==ishlaydi, lekin==**
   Ovoz: «Kodda qiymatni SQL matniga qo'shib yuborish oson: where id teng, plyus, req params id. Oddiy so'rovda bu ishlaydi: delete api cars bir, birinchi mashina o'chadi. Muammo shundaki, URL'dagi matn SQL'ning bir qismiga aylanadi. Sinab ko'rdik.»
2. **URL'ga `1 OR 1=1` yozildi — so'rov «hammasi» bo'lib qoldi: ==`deleted: 3`==, jadval bo'sh**
   Ovoz: «URL'da id o'rniga bir or bir teng bir yubordik. Yopishtirilgan satr shunday SQL bo'ldi: where id bir, yoki bir teng bir. Bir teng bir doim to'g'ri. Javob ikki yuz, deleted uch: jadval bo'sh qoldi. Buni SQL injection deyishadi, va buni istalgan foydalanuvchi brauzerdan qila oladi.»
   ```
   $ DELETE /api/cars/1%20OR%201=1
   → 200  {"message":"O'chirildi","deleted":3}
    id | model
   ----+-------
   (0 rows)
   ```
3. **`$1` bilan xuddi shu so'rov: qiymat alohida boradi — ==`invalid input syntax for type integer`==, 500, jadval joyida**
   Ovoz: «Endi dollar bir bilan: pool query'ning ikkinchi argumenti massiv, qiymat shu massivda, SQL matniga kirmaydi. Baza bir or bir teng bir'ni son sifatida o'qishga urinadi va rad etadi: invalid input syntax for type integer. Besh yuz, lekin jadval joyida, uchala mashina bor.»
   ```
   DELETE FROM cars WHERE id = $1        [req.params.id]
   → 500  {"error":"invalid input syntax for type integer: \"1 OR 1=1\""}
   (3 rows)
   ```
4. **Xulosa: foydalanuvchidan kelgan har qiymat ==`$1, $2` bilan==, SQL matniga hech qachon yopishtirilmaydi**
   Ovoz: «Xulosa: foydalanuvchidan kelgan har qiymat dollar bir, dollar ikki bilan beriladi, SQL matniga hech qachon yopishtirilmaydi. Bu uslub masalasi emas, xavfsizlik masalasi: bitta plyus belgisi butun jadvalni o'chirishga yo'l ochadi. Endi serverni o'zingiz ko'tarasiz.»
- Manba: `pg2-out/17-injection.txt` (sinovdan oldin `cars_zaxira` nusxa olingan va tiklangan).

## 21 · Amaliyot 3 — AvtoIjara server  ← `Practice`
- Kicker: `Amaliyot 3 / 4` · Eyebrow: `Hozir o'zingizda · 15–20 daqiqa` · Sarlavha: **`car_rental` va `server.js` — o'z serveringiz, Postman bilan sinov** · `tableAt: 3`
1. **Endi siz: jadval qo'lda, server — ==namunadan yoki Gemini bilan==, sinov Postman'da**
   Ovoz: «Endi o'zingiz server ko'tarasiz. Jadvalni terminalda qo'lda yozasiz. Server kodini namunadan yozing yoki Gemini'dan oling: Express, pg, to'rt endpoint, qiymatlar dollar bir bilan. O'n besh-yigirma daqiqa.»
2. **1–2-qadam: `car_rental` va `cars`; papka, ==`express` va `pg`==**
   Ovoz: «Birinchi qadamda car rental bazasi va cars jadvalini yaratib, uchta mashina qo'shasiz. Ikkinchisida avto ijara server papkasini ochib, npm init qilasiz va express bilan pg paketlarini o'rnatasiz.»
3. **3–4-qadam: `server.js`, `node server.js`, Postman; isbot — ==`POST` javobining statusi==**
   Ovoz: «Uchinchi qadamda server js faylini yozasiz, unga parolingizni qo'yib, node server js bilan ishga tushirasiz. To'rtinchisida Postman'da GET va POST yuborasiz. Isbot maydoniga POST javobining statusini yozing.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Beshinchi bosqichda bu xatolarning hammasini ataylab chiqarib tuzatamiz. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizda ishlab turgan server bor va siz uni Postman bilan sinagan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Jadval | `CREATE DATABASE car_rental;` · `\c car_rental` · `CREATE TABLE cars (id SERIAL PRIMARY KEY, model TEXT, daily_price INTEGER, year INTEGER, is_rented BOOLEAN);` · `INSERT … ('Chevrolet Cobalt', 280000, 2022, false), …` | `INSERT 0 3` |
  | 2 | Loyiha | `mkdir avto-ijara-server` · `cd avto-ijara-server` · `npm init -y` · `npm install express pg` | `added … packages` |
  | 3 | Server — `server.js`: «Kodni ochish» (namuna) yoki Gemini (Express + pg, to'rt endpoint, `$1`, topilmasa 404); parolni yozing | `node server.js` | `Server 3000-portda ishlayapti` |
  | 4 | Postman | `GET localhost:3000/api/cars` · `POST localhost:3000/api/cars` body `{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }` | 200 · 3 mashina · POST — `id` bilan |
- Kod (qadam 3): `server.js` — `pg2-out/11-server.js` (port 5432), «namuna — o'zingiz yozing yoki Gemini'dan oling».
- Isbot: «`POST` javobining statusi» · placeholder: «Postman ko'rsatgan statusni yozing» · KOD: `/^\s*201\b/` · xato: «Muvaffaqiyatli `POST` statusi uch xonali son. Postman'da javob ustida yozilgan.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 500 `password authentication failed for user "postgres"` | `PASSWORD` — o'rnatishda berilgan parol (24-ekran) |
  | 500 `client password must be a string` | parol bo'sh / `process.env` o'qilmagan (24-ekran) |
  | 500 `database "…" does not exist` | `DATABASE` nomi xato yoki baza yaratilmagan (24-ekran) |
  | 500 `{"error":""}` | PostgreSQL ishlamayapti — `console.error(err)` bilan `ECONNREFUSED` ko'rinadi (24-ekran) |
  | 500 `Cannot destructure property 'model' of 'req.body'` | `app.use(express.json())` yo'q (23-ekran) |
  | 500 `column "price" of relation "cars" does not exist` | kodda ustun nomi xato (22-ekran) |
  | kod o'zgardi, javob o'zgarmadi | eski server ishlab turibdi — 25-ekran |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `pg2-out/10…16`.

---

## 22 · Buzamiz 1: `price` ustuni  ← `Lesson`
- Kicker: `5-bosqich · buzamiz va tuzatamiz` · Sarlavha: **`column "price" of relation "cars" does not exist` — kodda `price`, jadvalda `daily_price`**
- Sahna: `server.js` POST satri (`price` qizil) → Postman 500 → terminal → tuzatish (`daily_price` yashil) → Postman 201.
1. **Birinchi buzish — Gemini'ning odatiy xatosi: `INSERT`da ==ustun nomini o'zi o'ylab topadi==, `price`**
   Ovoz: «Buzishni eng ko'p uchraydigan xatodan boshlaymiz. Gemini insert'da daily price o'rniga price yozgan: ustun nomini jadvaldan emas, o'z taxminidan olgan. Serverni ishga tushiramiz: xato yo'q, server ishlayapti deb yozadi. Xato faqat POST yuborilganda chiqadi.»
2. **POST → 500, xabarda jadval va ustun: ==`"price"` · `"cars"`==**
   Ovoz: «POST yuboramiz, javob besh yuz. Xabarni o'qiymiz: column price of relation cars does not exist. Ustun price, jadval esa cars. Relation so'zi uchinchi bosqichdan tanish: bu jadval. Xabar nimani tuzatishni o'zi aytdi.»
   Postman: **500** `{"error":"column \"price\" of relation \"cars\" does not exist"}` · terminal: `column "price" of relation "cars" does not exist`
3. **Tuzatish: kodda `daily_price` — serverni ==qayta ishga tushirib==, POST → 201**
   Ovoz: «Jadval tuzilishiga qaraymiz: ustun daily price. Kodda tuzatamiz, serverni to'xtatib, qayta ishga tushiramiz. POST yuboramiz: javob ikki yuz bir, yangi mashina id bilan qaytdi.»
   Postman: **201** `{"id":5,"model":"Hyundai Elantra","daily_price":450000,"year":2022,"is_rented":null}`
4. **Xulosa: 500 bo'lsa — `error` matnidagi nomni ==`\d cars`== bilan solishtiring; kod o'zgarsa server qayta**
   Ovoz: «Xulosa: besh yuz chiqsa, xato matnini o'qing, ichida ustun va jadval nomi bor. Uni terminaldagi backslash d cars bilan solishtiring. Kod o'zgargandan keyin serverni albatta qayta ishga tushiring, aks holda eski kod ishlayveradi.»
- Manba: `pg2-out/12-price-xato.txt`, `19-price-tuzatildi.txt` (tuzatilgan kod → 201, `id: 5`).

## 23 · Buzamiz 2: `express.json()` yo'q  ← `Lesson`
- Kicker: `5-bosqich · buzamiz va tuzatamiz` · Sarlavha: **`Cannot destructure property 'model' of 'req.body'` — so'rov tanasi o'qilmagan**
- Sahna: `server.js` — `app.use(express.json())` satri chizilgan → Postman 500 → satr qaytariladi (yashil) → 201.
1. **Bitta satrni olib tashlaymiz: `app.use(express.json())` — ==server baribir ishga tushadi==**
   Ovoz: «Ikkinchi buzish. Gemini ba'zan bitta satrni unutadi: app use express json. Shu satrni olib tashlaymiz. Server xatosiz ishga tushadi, GET ham ishlaydi. Muammo faqat tanasi bor so'rovlarda.»
2. **POST → 500: `req.body` — ==`undefined`==, `model`ni olib bo'lmaydi**
   Ovoz: «POST yuboramiz, javob besh yuz. Xabar shunday: cannot destructure property model of req body as it is undefined. Ya'ni req body umuman yo'q: Express so'rov tanasini o'qimagan, chunki JSON'ni o'qiydigan qism ulanmagan.»
   Postman: **500** `{"error":"Cannot destructure property 'model' of 'req.body' as it is undefined."}`
3. **Tuzatish: satr qaytariladi, `app` yaratilgandan keyin, ==endpoint'lardan oldin== — POST → 201**
   Ovoz: «Tuzatish uchun app use express json satrini app yaratilgandan keyin, endpoint'lardan oldin qaytaramiz. Tartib muhim: bu satr har so'rovdan oldin ishlaydi. Server qayta ishga tushadi, POST ikki yuz bir.»
4. **Xulosa: `req.body` `undefined` bo'lsa — birinchi qaraladigan joy ==`express.json()`==**
   Ovoz: «Xulosa: req body undefined degan xato chiqsa, birinchi qaraladigan joy app use express json. GET ishlab, POST va PUT ishlamasa ham shu satr. Bitta satr, lekin usiz tanasi bor hech bir so'rov ishlamaydi.»
- Manba: `pg2-out/13-express-json-yoq.txt`; tuzatilgan holat — `11-crud-sorovlar.txt` (POST 201).

## 24 · Ulanish xatolari — birinchi so'rovda  ← `Lesson`
- Kicker: `5-bosqich · buzamiz va tuzatamiz` · Sarlavha: **Server «ishlayapti» deydi — parol, baza va PostgreSQL xatosi birinchi so'rovda chiqadi**
- Sahna: terminal `node server.js` → «Server 3000-portda ishlayapti» (har holatda); to'rt karta: holat · Postman javobi · tuzatish.
1. **`Pool` darhol ulanmaydi (17-ekran): server ishga tushadi, ==xato birinchi so'rovda==**
   Ovoz: «Pool ekranida ko'rgan edingiz: Pool server ishga tushganda bazaga ulanmaydi, birinchi so'rovda ulanadi. Shuning uchun parol xato bo'lsa ham terminalda server ishlayapti deb yoziladi. «Server ishlayapti, lekin besh yuz» degan holatda xabarni o'qing: to'rt xil bo'ladi.»
2. **Parol xato — `password authentication failed`; parol bo'sh — ==`client password must be a string`==**
   Ovoz: «Parol xato bo'lsa: password authentication failed for user postgres. Parol umuman berilmasa, masalan process env'dan o'qilmagan bo'lsa: client password must be a string. Ikkinchisi g'alati ko'rinadi, lekin ma'nosi oddiy: parol o'zgaruvchisi bo'sh.»
   `500 password authentication failed for user "postgres"` · `500 SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`
3. **Baza nomi xato — `database "carrental" does not exist`: ==pastki chiziq tushib qolgan==**
   Ovoz: «Baza nomida pastki chiziq tushib qolsa: database carrental does not exist. Baza bor, faqat nomi car pastki chiziq rental. Terminaldagi backslash l bilan aniq nomni ko'ring.»
4. **PostgreSQL o'chiq — xato matni bo'sh; ==`console.error(err)`== — `ECONNREFUSED` ko'rinadi**
   Ovoz: «Eng chalkashi: PostgreSQL ishlamasa, javob besh yuz, lekin error bo'sh, terminalda ham bo'sh qator. Sinab ko'rdik: console error'ga err message emas, err'ning o'zini bersak, ECONNREFUSED chiqadi, ya'ni ulanish rad etildi. Yechim: PostgreSQL'ni ishga tushiring.»
   `500 {"error":""}` → `console.error(err)` → `AggregateError [ECONNREFUSED]` · `connect ECONNREFUSED ::1:5432`
5. **Xulosa: «ishlayapti» — faqat Express; ==baza xatosini birinchi so'rov va terminal aytadi==**
   Ovoz: «Xulosa: terminaldagi ishlayapti degan satr faqat Express haqida. Bazaga ulanish birinchi so'rovda tekshiriladi. Xabar bo'sh bo'lsa, console error'ga butun xatoni bering. PostgreSQL'ni ishga tushirish: Windows'da Services, Mac'da Postgres.app.»
- Manba: `pg2-out/14-ulanish-xatolari.txt`, `15-postgres-ochiq-emas.txt` (sinovda port 5436 → ekranda 5432).

## 25 · Port band — «ishlayapti», lekin eski server  ← `Lesson`
- Kicker: `5-bosqich · buzamiz va tuzatamiz` · Sarlavha: **Ikkinchi `node server.js` ham «ishlayapti» deydi — javobni esa eski server beradi**
- Sahna: ikki terminal (1-oyna: eski server; 2-oyna: yangi `node server.js` → «Server 3000-portda ishlayapti», chiqish kodi 0); Postman — eski kod javobi; pastda Express manbasidan 3 satr.
1. **Eng chalkash holat: ==«kodni tuzatdim, hech narsa o'zgarmadi»==**
   Ovoz: «Eng chalkash holat: kodni tuzatasiz, serverni yana ishga tushirasiz, lekin javob o'zgarmaydi. Sabab ko'pincha bitta: birinchi server boshqa terminalda hali ishlab turibdi.»
2. **Sinab ko'rdik: ikkinchi server ham «ishlayapti» deb yozdi va ==xato bermay chiqib ketdi==**
   Ovoz: «Sinab ko'rdik. Birinchi server ishlab turganda ikkinchi oynada node server js. Kutganimiz port band degan xato edi. Haqiqatda ikkinchi server ham ishlayapti deb yozdi va xato bermay chiqib ketdi. So'rovlarga birinchi, eski server javob beradi.»
   ```
   $ node server.js   (ikkinchi oynada, birinchisi ishlab turibdi)
   Server 3000-portda ishlayapti
   [chiqish kodi: 0]
   ```
3. **Sabab Express 5 da: xato `listen` callback'iga beriladi, ==namunadagi callback uni o'qimaydi==**
   Ovoz: «Sabab Express beshinchi versiyasida: listen xatoni callback'ga beradi. Gemini yozgan callback esa xatoni o'qimaydi, faqat ishlayapti deb chiqaradi. Callback xatoni o'qisa, address already in use chiqadi va server to'xtaydi. Bu namuna kodidagi kamchilik, Express'niki emas.»
   Express manbasi: `server.once('error', done)` → `app.listen(3000, () => console.log('Server 3000-portda ishlayapti'))`
4. **Xulosa: ==bitta loyiha — bitta terminal==; qayta ishga tushirishdan oldin `Ctrl+C`**
   Ovoz: «Xulosa: bitta loyiha uchun bitta terminal. Qayta ishga tushirishdan oldin Ctrl C bilan eski serverni to'xtating. Javob o'zgarmasa, birinchi savol: boshqa terminalda server ochiq qolmadimi?»
- Manba: `pg2-out/16-port-band.txt`, `20-port-band-callback.txt` (`EADDRINUSE`, chiqish kodi 1); Express 5.3.0 `lib/application.js` (`app.listen`: `server.once('error', done)`).

## 26 · Tekshiruv 4 — qaysi satr 500 beradi  ← `LineCheck`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4 — qaysi satr xato?` · Sarlavha: **POST 500: `column "price" of relation "cars" does not exist`. Xato satrni toping**
- Shart (`task`): «Qoida: SQL'dagi ustun nomlari jadvaldagi bilan aynan bir xil bo'ladi — `cars`: `id, model, daily_price, year, is_rented`. Bu POST bo'lagida bitta satr jadvalda yo'q ustunni so'rayapti. **O'sha satrni bosing.**»
- Ovoz (`q`): «Buzishni ko'rdingiz, endi o'zingiz toping. To'rtinchi tekshiruv. Jadval ustunlarini eslang: id, model, daily price, year, is rented. Bu POST bo'lagida bitta satr jadvalda yo'q ustunni so'rayapti. O'sha satrni bosing.»
- Fayl: `server.js` (Explorer faol), POST bo'lagi — fayldagi haqiqiy satrlar 32–43 (`pg2-out/11-server-80.js`, Prettier 80 belgi, M43):
  ```js
  32  app.post('/api/cars', async (req, res) => {
  33    try {
  34      const { model, daily_price, year } = req.body;
  35      const result = await pool.query(
  36        'INSERT INTO cars (model, price, year) VALUES ($1, $2, $3) RETURNING *',   ← xato satr
  37        [model, daily_price, year],
  38      );
  39      res.status(201).json(result.rows[0]);
  40    } catch (err) {
  41      console.error(err.message);
  42      res.status(500).json({ error: err.message });
  43    }
  ```
- Tuzatilgan (`fixed`): 36-satr `price` → `daily_price` (eski chizilgan, yangisi yashil, satr raqamlari haqiqiy — F-1103-01); `fixedExtra`: Postman 201.
- To'g'ri (ovoz, `ok`): «To'g'ri. O'ttiz oltinchi satrda insert'da price yozilgan, jadvalda esa daily price. O'ttiz to'rtinchi satrdagi daily price faqat JavaScript o'zgaruvchisi, baza uni ko'rmaydi, u SQL matnidagi nomni ko'radi. Ekranda tuzatilgan holat: daily price, POST ikki yuz bir. Demak, besh yuz chiqsa, SQL matnidagi har nomni jadval ustunlari bilan solishtiring.»
- Qisqa (`okShort`): «36-satr: SQL'da `price` — jadvalda `daily_price`. 34-satrdagi `daily_price` — JS o'zgaruvchisi, baza ko'rmaydi.»
- Maslahat (`hint`): «Baza JavaScript o'zgaruvchilarini ko'rmaydi — faqat qo'shtirnoq ichidagi SQL matnini. O'sha matndagi ustun nomlarini qidiring.»
- Manba: `pg2-out/12-price-xato.txt` (buzuq kod — `11-server.js` dan bitta so'z farq), `11-server-80.js` (satr raqamlari), `11-crud-sorovlar.txt` (201).

## 27 · Amaliyot 4 — o'zingiz buzing  ← `Practice`
- Kicker: `Amaliyot 4 / 4` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **Ikki buzish, ikki tuzatish — o'z serveringizda** · `tableAt: 3`
1. **Endi siz: o'z serveringizda ikkita xatoni ==ataylab chiqarasiz va tuzatasiz==**
   Ovoz: «Oxirgi amaliyot: o'z serveringizda ikkita xatoni ataylab chiqarasiz va tuzatasiz. O'n daqiqa. Bu xatolar haqiqiy loyihada ham chiqadi; ularni bir marta o'zingiz chiqarsangiz, keyin xabardan darhol taniysiz.»
2. **1–2-qadam: `price` xatosi — 500, ==xabarni o'qing==, tuzating, 201**
   Ovoz: «Birinchi qadamda insert'dagi daily price'ni price qilib, serverni qayta ishga tushirasiz va POST yuborasiz. Ikkinchisida xabarni o'qib, xatoni tuzatasiz va qayta ishga tushirasiz: javob ikki yuz bir bo'lishi kerak.»
3. **3–4-qadam: eski serverni yopmasdan yangisini yoqing; isbot — ==500 xabarining matni==**
   Ovoz: «Uchinchi qadamda birinchi server ishlab turganda ikkinchi terminalda yana node server js qilasiz va ishlayapti satrini ko'rasiz. To'rtinchisida ikkalasini ham Ctrl C bilan to'xtatasiz. Isbot maydoniga birinchi qadamdagi besh yuz xabarini nusxalang.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, bu ikki xato chiqqanda siz ularni birinchi marta ko'rayotgan bo'lmaysiz va xabardan sababini darhol topasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Buzish | `server.js`: `INSERT INTO cars (model, price, year)` · `Ctrl+C` · `node server.js` · Postman POST | 500 `column "price" of relation "cars" does not exist` |
  | 2 | Tuzatish | `price` → `daily_price` · `Ctrl+C` · `node server.js` · POST | 201 |
  | 3 | Ikki server | 1-terminal ishlab turibdi · 2-terminalda `node server.js` | ikkinchisi ham «Server 3000-portda ishlayapti» |
  | 4 | To'xtatish | ikkala terminalda `Ctrl+C` | Postman: `GET` — javob yo'q (server yo'q) |
- Isbot: «1-qadamdagi 500 xabari» · placeholder: «Postman'dagi error matnini qo'ying» · KOD: `/column\s+"?price"?\s+of relation\s+"?cars"?\s+does not exist/i` · xato: «Xabar to'liq bo'lsin: qaysi ustun va qaysi jadval (of relation …). Postman'dagi error qiymatini nusxalang.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 1-qadamda 201 | server qayta ishga tushmagan — eski kod ishlayapti (25-ekran) |
  | `column "price" does not exist` (`of relation`siz) | `SELECT`/`UPDATE`da xato qilingan — `INSERT`dagi ustunni o'zgartiring |
  | 3-qadamda `listen EADDRINUSE: address already in use :::3000` | sizning `server.js`ingizda callback xatoni o'qiydi (Gemini boshqacha yozgan) — bu yaxshi; ikkala terminalni ham to'xtating |
  | 4-qadamda javob bor | yana bir terminal ochiq qolgan — hammasini `Ctrl+C` |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `pg2-out/12`, `16`, `20-port-band-callback.txt`.

---

## 28 · Sinfga tayyorgarlik: m4-06 va m4-08 xaritasi  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Eyebrow: `m4-06 · m4-08` · Sarlavha: **Ikki o'quvchi darsi: nimani ko'radi, siz nimani qo'shasiz, nimaga tayyor turasiz**
- Sahna: ikki karta (m4-06 · 21 ekran · tugmalar + haqiqiy psql amaliyoti; m4-08 · 9 ekran · jadval qo'lda, Gemini server, Postman) → 3-segmentda «Siz qo'shasiz» ro'yxati va «To'rt farq» → 4-segmentda «Darsdan oldin» uch band (galma-gal).
1. **m4-06 (21 ekran): do'kon tugmalar bilan, amaliyotda — ==haqiqiy PostgreSQL terminali==; jadval bugungi `products` ning o'zi**
   Ovoz: «Endi sinfga tayyorgarlik, ikki ekran. Birinchi o'quvchi darsi m4-06, yigirma bir ekran: o'quvchi do'konni tugmalar bilan boshqaradi, insert, select, where, update, delete. Jadval bugun siz yaratgan products'ning aynan o'zi. Amaliyotda esa u haqiqiy PostgreSQL terminalida yoki VS Code'da AI bilan o'z do'konini yaratadi, shuning uchun PostgreSQL har kompyuterda ishlab turishi shart.»
2. **m4-08 (9 ekran): `cars` jadvali qo'lda, `server.js` Gemini'dan, Postman bilan sinov — ==bugungi serveringizning o'zi==**
   Ovoz: «Ikkinchisi m4-08, AvtoIjara, to'qqiz ekran: o'quvchi cars jadvalini terminalda o'zi yozadi, server kodini Gemini'dan oladi, Postman bilan sinaydi va AI xatosini topadi. Bu bugun siz ko'targan serverning o'zi. Farqi: o'quvchi Pool'ning ichini, tranzaksiyani va injection'ni bilmaydi, siz bilasiz.»
3. **Siz qo'shasiz: javobdagi son · `BEGIN … ROLLBACK` · `ORDER BY` · apostrof · `NOT NULL` · ==`HINT` ham adashadi==; to'rt farqni oldindan ayting**
   Ovoz: «Darsga siz qo'shadigan narsalar: har update'dan keyin javobdagi sonni so'rang, where'siz update'ni proyektorda begin ichida ko'rsating, order by va apostrofni ayting, o'z do'konini yaratayotganda not null'ni maslahat bering, hint ham adashishini eslating. To'rt farqni oldindan ayting: darsdagi xato matni qisqa, Gemini har kimga boshqacha kod yozadi, POST'dan keyin is rented null, port band bo'lsa ham «ishlayapti».»
   | Siz qo'shasiz | Qayerda |
   |---|---|
   | javobdagi son (`UPDATE 1` / `0`) | m4-06 CRUD bloki |
   | `WHERE`'siz — proyektorda `BEGIN … ROLLBACK` | m4-06 UPDATE/DELETE |
   | `ORDER BY` — «o'rni o'zgardi» savoli | m4-06 SELECT |
   | apostrof `''`, `NOT NULL` maslahati | m4-06 amaliyoti (o'z do'koni) |
   | `HINT` ham adashadi | m4-06 AI xatosi bloki |
   | To'rt farq: xato matni qisqa · Gemini kodi har xil · `is_rented: null` · port band «ishlayapti» | m4-08 |
4. **Xulosa: darsdan oldin — har kompyuterda PostgreSQL va Postman, ==sinf paroli==, bitta loyiha — bitta terminal; vaqt amaliyotga**
   Ovoz: «Xulosa: darsdan oldin uch narsani tekshiring: har kompyuterda PostgreSQL terminali ochiladi va Postman o'rnatilgan, sinf paroli hammaga ma'lum, qoida: bitta loyiha, bitta terminal. Vaqt bo'yicha taklif: m4-06 da to'qson daqiqaning yigirma beshi amaliyotga, m4-08 da qirqi server va Postman'ga, chunki o'quvchilar eng ko'p xato qiladigan joy shu.»
- Manba: `src/4-Modull/PostgresCrudLesson.jsx` (`SCREEN_META` 21, amaliyot topshirig'i «VS Code yoki psql'da AI bilan…», `PRODUCTS`), `BackendCrudPracticeLesson.jsx` (`SCREEN_META` 9, Gemini promptlari, xato `column "price" does not exist`); `pg2-out/11`, `12`, `16`.

## 29 · O'quvchilar xato qiladigan olti joy va savollari  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Sarlavha: **Olti holat va tayyor javoblar — hammasini bugun o'zingiz ko'rdingiz**
- Sahna: 6 karta (holat · xabar · yechim) segment bilan yonadi; pastda «O'quvchi so'rasa» — 5 ochiladigan karta (ovozsiz).
- Kartalar:
  | # | Holat | Xabar | Yechim |
  |---|---|---|---|
  | 1 | Jadval/ustun nomi | `relation "product"` · `column "narx"` (+ HINT) | `\d jadval` bilan solishtirish |
  | 2 | Apostrof | `syntax error at or near "yinchoq"` | `''` |
  | 3 | WHERE'siz | `UPDATE 3` / `DELETE 3` | `BEGIN … ROLLBACK`; o'chgan bo'lsa — qayta `INSERT` |
  | 4 | Parol/baza | `password authentication failed` · `client password must be a string` · `database … does not exist` | `Pool` sozlamalari, sinf paroli |
  | 5 | Bo'sh xato | `{"error":""}` | `console.error(err)` → `ECONNREFUSED` → PostgreSQL'ni ishga tushiring |
  | 6 | O'zgarmadi | javob eski | ikkinchi terminal; `Ctrl+C` |
- O'quvchi so'rasa:
  - «Nega mahsulot o'rni o'zgardi?» → `ORDER BY` yo'q — baza yangilangan qatorni yangi joyga yozadi (6-ekran); `ORDER BY id`.
  - «`$1` nima?» → qiymat alohida beriladi, SQL matniga kirmaydi; `1 OR 1=1` misoli (20-ekran).
  - «Postman shartmi?» → yo'q, so'rov yuboradigan istalgan dastur; darsda Postman, chunki sinf uchun qulay.
  - «NestJS'da ham shunday yozamizmi?» → yo'q: Nest'da Repository bu so'rovlarni o'zi yozadi (`find`, `save`…). Xavotir olmang: buni kursdagi keyingi mentor darslarida to'liq, kodi bilan o'rganasiz (M8-5).
  - «SQL katta harfda yozilishi shartmi?» → yo'q, kalit so'zlar kichik harfda ham ishlaydi; katta harf — o'qish oson bo'lishi uchun odat (sinab ko'rdik: `select name, price from PRODUCTS` ishladi).
1. **Darsda albatta chiqadigan olti holat — ==hammasini bugun o'zingiz ko'rdingiz==**
   Ovoz: «Ikki o'quvchi darsini bilasiz. Endi darsda albatta chiqadigan oltita holatni ko'ramiz. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman.»
2. **Nom xatosi va apostrof — ==`\d` bilan solishtiring==, apostrof ikki marta**
   Ovoz: «Birinchi holat jadval yoki ustun nomidagi xato: xabar ichidagi nomni backslash d bilan solishtiring, hint'ga ishonmang. Ikkinchisi apostrof: u ikki marta yoziladi.» · 1–2-karta
3. **`WHERE`'siz va ulanish xatolari — ==`BEGIN`, parol va bo'sh xabar==**
   Ovoz: «Uchinchisi where'siz update yoki delete: uning oldi begin bilan olinadi. To'rtinchisi parol yoki baza nomidagi xato: uni Pool sozlamalarida qidiring. Beshinchisi: xabar bo'sh bo'lsa, console error'ga butun xatoni bering va PostgreSQL'ni tekshiring.» · 3–5-karta
4. **Xulosa: o'zgarmasa — ikkinchi terminal; ==xabarni o'quvchi bilan birga o'qing==, javobni darhol aytmang**
   Ovoz: «Oltinchisi: o'quvchi «o'zgarmadi» desa, ikkinchi terminalda eski server qolganini tekshiring. Xulosa va usul bitta: javobni darhol aytmang, xabarni o'quvchi bilan birga o'qing. Pastda o'quvchi savollariga tayyor javoblar bor.» · 6-karta + QA
- Manba: `pg2-out/03`, `05`, `14`, `15`, `16`, `17`, `18`.

## 30 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | `UPDATE products SET price = 99000;` — `WHERE` yo'q. Javob? | `UPDATE 1` — faqat birinchi qator o'zgaradi · `ERROR` — `WHERE`'siz `UPDATE` taqiqlangan · `UPDATE 3` — hamma qator yangi narxni oldi · `UPDATE 0` — shart yo'q, hech narsa | 3 | `WHERE`'siz — jadvaldagi hamma qator. | 9 |
  | 2 | `BEGIN;` → `DELETE FROM products;` → `ROLLBACK;` → `SELECT *`. Natija? | Hamma mahsulot joyida — `DELETE` bekor bo'ldi · `(0 rows)` — `DELETE` allaqachon diskka yozilgan · Faqat birinchi qator qaytib keladi, xolos · `ERROR` — `ROLLBACK`'dan keyin jadval yopiq | 1 | `ROLLBACK` tranzaksiyani bekor qiladi. | 12 |
  | 3 | Tranzaksiya ichida buyruq xato berdi, prompt `shop=!#`. Endi `SELECT 1;` yozsangiz? | Oddiy ishlaydi — xato o'tib ketgan · `current transaction is aborted` xatosi · Baza o'zi `COMMIT` qilib, natija beradi · Prompt o'zi oddiy holatga qaytadi | 2 | Aborted holat: `ROLLBACK`gacha hamma buyruq rad etiladi. | 10 |
  | 4 | `UPDATE`dan keyin `SELECT *` da qator ro'yxat oxiriga tushdi. Sabab? | Bu xato — qator buzilgan, qayta yozing · `id` o'zgardi — `UPDATE` yangi id berdi · Tranzaksiya yopilmagan — qator vaqtincha · `ORDER BY` yo'q — tartib kafolatlanmaydi | 4 | `ctid` o'zgardi; tartib `ORDER BY` bilan. | 6 |
  | 5 | `new Pool({…})` yaratildi, parol xato. Server ishga tushganda nima bo'ladi? | Darhol xato beradi, server tushadi · Server yonadi, xato birinchi so'rovda · `Pool` to'g'ri parolni o'zi topib oladi · Hech qachon xato chiqmaydi — parol keshda | 2 | `Pool` birinchi so'rovda ulanadi. | 17 |
  | 6 | Server «ishlayapti», GET ishlaydi, POST — `Cannot destructure property 'model' of 'req.body'`. Sabab? | Parol xato — baza so'rovni rad etdi · Jadval yo'q — `INSERT` bajarilmadi · Port band — `POST` boshqa serverga ketdi · `express.json()` ulanmagan — tana bo'sh | 4 | `req.body` o'qilmagan. | 23 |
  | 7 | POST 500, `{"error":""}`, terminalda bo'sh qator. Birinchi qadam? | Serverni o'chirib, qaytadan yoqib ko'rish · Gemini'dan butunlay yangi kod so'rash · `console.error(err)` bilan xatoni ko'rish · `npm install` bilan paketlarni yangilash | 3 | Bo'sh xabar — `ECONNREFUSED` yashiringan. | 24 |
  | 8 | `'DELETE … WHERE id = ' + req.params.id` va URL `1 OR 1=1`. Nima bo'ladi? | Hamma qator o'chadi va javob 200 qaytadi · Baza bunday so'rovni rad etadi — 500 · 404 — `1 OR 1=1` degan id topilmadi · Faqat birinchi mashina o'chadi, qolgani qoladi | 1 | Yopishtirilgan matn SQL bo'ldi; `$1` bilan — 500, jadval joyida. | 20 |
- `passed = ball ≥ 6 && 4 amaliyot isbot bilan`.

## 31 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13.
- Xulosa 6 band:
  1. CRUD = `INSERT` · `SELECT` · `UPDATE` · `DELETE`; javobdagi son — nechta qator tegildi; `RETURNING` — qatorning o'zi; `ORDER BY`siz tartib kafolatlanmaydi (`ctid`).
  2. Tranzaksiya: autocommit · `BEGIN` → faqat sizning seansingizda → `COMMIT` / `ROLLBACK`; `!#` — aborted, faqat `ROLLBACK`; ikki jadval bitta ish — atomik.
  3. Baza faqat yozilgan qoidani qo'riqlaydi: `NOT NULL`, `DEFAULT`, `UNIQUE`, `CHECK`; xabar ichida nom bor — `\d` bilan solishtiring; apostrof `''`.
  4. Express: `Pool` birinchi so'rovda ulanadi va ulanishni qayta ishlatadi → `pool.query(sql, [$1…])` → `rows` / `rowCount` → `res.json`; 200 · 201 · 404 · 500.
  5. `$1` — xavfsizlik: yopishtirilgan `1 OR 1=1` jadvalni bo'shatdi; server xatolari: ustun nomi · `express.json()` · parol/baza birinchi so'rovda · bo'sh xabar → `console.error(err)` · ikkinchi server «ishlayapti».
  6. Sinf: m4-06 amaliyoti haqiqiy psql'da; m4-08 dan oldin parol, Postman, bitta terminal; olti holat va savollarga javoblar tayyor.
- **Uyga vazifa** (M14): «O'z do'koningiz uchun shop-api: schema faylida ikki jadval — mahsulotlar not null va check stock katta yoki teng nol bilan, buyurtmalar tashqi kalit bilan. Server js'da mahsulotlar uchun to'rt endpoint, hamma qiymat dollar bir bilan, topilmasa to'rt yuz to'rt. README'da har endpoint uchun bitta so'rov va javobi. Terminalda bitta sotuvni begin, update, insert, commit bilan qiling va yetmagan qoldiqda check xatosini oling: ikkalasini README'ga yozing. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Jadvallar | `schema.sql`: `products` (`NOT NULL` nom va narx, `CHECK (stock >= 0)`, `DEFAULT 0`), `orders` (`REFERENCES products(id)`, `CHECK (qty > 0)`, `created_at DEFAULT now()`) · `psql -U postgres -d <baza> -f schema.sql` | `CREATE TABLE` ×2 |
  | 2 | Server | `server.js`: GET · POST (201, `RETURNING *`) · PUT · DELETE (`rowCount` → 404), `$1` | `node server.js` |
  | 3 | Sinov | Postman: 4 so'rov + yo'q `id` | 200 · 201 · 200 · 200 · 404 |
  | 4 | Tranzaksiya | psql: `BEGIN` → `UPDATE … stock - 1 … RETURNING` → `INSERT INTO orders` → `COMMIT`; keyin yetmagan qoldiq → `CHECK` xatosi → `ROLLBACK` | README'da ikkala chiqish |
  | 5 | Topshirish | `git add . && git commit -m "shop-api"` · `git push` → repo linki platformadagi uyga vazifaga (M30) | — |
  Vaqt: 50–70 daqiqa. Tekshiruvchi qaraydi: `NOT NULL`/`CHECK` · `$1` (yopishtirish yo'q) · 404 · README'da 5 so'rov, `COMMIT` va `CHECK` xatosi.
- **Eslatma:** CRUD va javobdagi son · `RETURNING` · `ctid` va `ORDER BY` · tranzaksiya holatlari (`=#`, `=*#`, `=!#`) · atomik sotuv · qoidalar jadvali (`NOT NULL`, `DEFAULT`, `UNIQUE`, `CHECK`) · xatolar jadvali (SQL) · `Pool` faktlari · Express yo'li va status jadvali · `$1` misoli · server xatolari jadvali · sinfga tayyorgarlik · o'z uyga vazifangiz.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **NestJS arxitekturasi — Module, Controller, Service** — Express'dagi shu CRUD Nest'da qanday tartib bilan yoziladi».

---

## «KOD» — qurishda
1. Generator `dev/pg2-matn.py` v2: MD yo'li `08-PostgreSQL2-mentor-v2.md`; kalitdagi qizil bo'lak `==…==` dan (EMPH lug'ati bekor); tekshiruvlarda yangi maydonlar — `Material (above)`, `Isbot (after)`, `Demak:` → `sc.demak`; LineCheck o'zgarmaydi.
2. Tekshiruv ekranlari (M42): `MCRetry above={…} after={…} demak={…}`; `after` ichida `mk-rule` yo'q.
3. **Kodli sahnalar (F-1103-04, qonun-nomzod M43):** har segmentda faqat o'sha bo'lak (8–12 satr, haqiqiy raqamlar, `wrap`siz), natija kartasi (Postman/terminal) kod TAGIDA; oxirgi «Xulosa» segmentida kod emas, xulosa kartalari. Sahna 1920 va 1280 da aylantirmasdan sig'adi — `dev/sahna-olchov.mjs` 0 px. 18, 19, 22, 23-ekranlar shu qolipda; 17-ekran kod + o'lchov chiqishi + chizma.
4. Yangi sahnalar: 6 — «fayl sahifasi» chizmasi (`ctid`); 10 — ikki terminal (A/B) + «uch holat» kartasi; 11 — ikki jadval kartasi (`stock`, `orders`) segment bilan; 14 — `\d` kartasi qoidalar qo'shilib boradi; 17 — Pool chizmasi (server ↔ Pool ↔ pid).
5. Chiqishlar `pg2-out/` dan aynan: 3→11-ekran `v2b-*`, 10-ekran `v2e-ikki-seans.txt` (ikki haqiqiy psql seansi, GATE M 2C), 14–16 va 18 `v2f-*` (uzluksiz holat), Mongoose `v2d-mongoose.txt`, Express `10…20`; port 5436/5437/5441 → 5432.
6. Isbotlar: 8 — `/^\s*\(?\s*3\b/` · 13 — `/^\s*99\s?000\s*$/` · 21 — `/^\s*201\b/` · 27 — `/column\s+"?price"?\s+of relation\s+"?cars"?\s+does not exist/i`.
7. LineCheck (26-ekran): fayl satri 36 → `target={4}` (bo'lak 32–43); `fixed`da haqiqiy satr raqamlari (`n`). Server kodi hamma ekranda `11-server-80.js` (Prettier 80) — satr raqamlari shu fayldan: Pool 10–16 · GET 21–29 · POST 32–44 · PUT 47–61 · DELETE 64–76.

- Mongoose xira qatori (3, 4, 5-ekran) — dvigatel `.mk-pair` (03.11), yorliq rangi `PG.mongo`; 9-ekran tuzoq kartasi — `mk-card`, chegara `T.accent` (F-1103-09).

## Ochiq savollar ([GATE M])
1. Hajm: 31 ekran (v1 da 28), ovoz ≈ 27 daqiqa — ma'qulmi, yoki 10/11-ekranlardan biri qisqartirilsinmi?
2. 10-ekran: A/B seanslar va aborted holati node orqali olingan (`v2-05`), ekranda `psql` prompt ko'rinishida beriladi (promptlar `pg1-out/25` dan haqiqiy) — ma'qulmi?
3. Misol ma'lumotlari o'quvchi darslaridagi bilan bir xil qoldi (haqiqiy yurgizish shu ma'lumotda), tanada o'quvchi darsi tilga olinmaydi, mosligi 28-ekranda aytiladi — ma'qulmi, yoki boshqa do'kon kerakmi (qayta yurgizish kerak bo'ladi)?
4. Uyga vazifa kattalashdi (ikki jadval + tranzaksiya, 50–70 daqiqa) — ma'qulmi?
5. Kodli sahnalar qolipi (M43) — alohida suratli sahifada tasdiqlanadi (F-1103-04).
