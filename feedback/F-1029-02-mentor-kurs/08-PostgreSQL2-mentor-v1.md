# Mentor kursi · PostgreSQL-2 «CRUD so'rovlar va Express'dan bazaga» — MD v1

F-ID: F-1029-02 (PostgreSQL-2) · Sana: 2026-11-01 (avtopilot) · Holat: **KO'RIKDA** ([GATE M] kutilmoqda) · Fidbek: qator yoniga `>> …`
PRD: `07-PostgreSQL2-PRD.md` v1 (savollar berilmagan — avtopilot takliflari Q1–Q4)
Fayl (quriladi): `src/mentor-kurs/PgCrudMentorLesson.jsx` · bo'laklar `src/mentor-kurs/pg2/parts/` · dvigatel — umumiy `parts/01–02`
Qonun: `MENTOR_DARS_ETALON.md` M1–M31 · Haqiqiy chiqishlar: `manba/pg2-out/` (skript `manba/drive-pg2.sh`)

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | PostgreSQL-1 ni o'tgan mentor: o'rnatgan, `psql` bilan ulangan, `blog` bazasida jadval, tashqi kalit, JOIN, tranzaksiyani ko'rgan. Express'ni biladi. |
| Dars oxirida mentor | 1) CRUD ning to'rt buyrug'ini `psql`da o'zi yozadi va `WHERE` narxini biladi · 2) xavfsiz sinashni biladi (`BEGIN … ROLLBACK`) · 3) sinfdagi SQL xatolarini xabaridan taniydi · 4) Express'dan bazaga yo'lni tushuntiradi: `Pool` → `pool.query(sql, [qiymatlar])` → `rows` → `res.json`; nega `$1` · 5) server xatolarini (ustun, `req.body`, parol, baza, port) o'qiydi va tuzatadi · 6) m4-06 va m4-08 ni o'tishni biladi |
| O'quvchi darslari | **m4-06** «PostgreSQL so'rovlar — CRUD + AI bilan» (21 ekran) · **m4-08** «Praktika: Backend CRUD — AvtoIjara» (9 ekran). Oldingi mentor darsi: PostgreSQL-1. |
| Kursdagi o'rni | PostgreSQL-1 → **shu** → Nest-1 (M31: raqam yozilmaydi) |
| Til | PG-1 bilan bir xil (M9). Yangi atamalar: CRUD, endpoint, Pool, parametr (`$1`), status (200 · 201 · 404 · 500). |
| Misol-ip | **m4-06 ning do'koni:** `shop` bazasi, `products` (Klaviatura 120 000 · Sichqoncha 75 000 · Quloqchin 95 000 · Mishka 50 000) — o'quvchi darsidagi ma'lumot aynan. **m4-08 ning AvtoIjara'si:** `car_rental`, `cars` (Cobalt · Malibu · K5 · Spark). |
| Gemini kodi | `server.js` — m4-08 promptlariga to'liq mos **bitta namuna** (`pg2-out/11-server.js`). Ekranda: «shartli namuna — Gemini har safar boshqacha yozadi, mazmuni shu». |
| Postman | bu kompyuterda yo'q: javoblar `curl` bilan olingan (status + tana bir xil); ekranda Postman ko'rinishidagi karta + belgi «haqiqiy javob». |
| Haqiqiylik (M10) | 01.11.2026 yurgizish: PostgreSQL 18.4 · Node 24.18 · **express 5.3.0 · pg 8.23.1**. Sinov porti 5436 → ekranda 5432. |
| Hajm | **28 ekran** · 6 bosqich · 4 amaliyot · 4 tekshiruv · 8 savol · ovoz ≈ 23 daq (2486 so'z, sanaldi) · amaliyot ≈ 40–50 daq · jami ≈ 1 s 10 daq |
| Me'yor | PG-1 bilan bir xil (≤ 5 segment, ≤ 60 so'z, ko'prik, «Xulosa», kalit 8–14 so'z) |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **CRUD** — Create · Read · Update · Delete = `INSERT` · `SELECT` · `UPDATE` · `DELETE`.
- **`WHERE`** — qaysi qatorlar; `UPDATE`/`DELETE`da unutilsa — **hamma qator**. Javobdagi son (`UPDATE 1`, `DELETE 0`) — nechta qator tegildi.
- **xavfsiz sinash** — `BEGIN` → sinov → `SELECT` bilan ko'rish → `ROLLBACK` (PG-1 dagi tranzaksiya, endi sinov usuli sifatida).
- **tartib** — `ORDER BY` yozilmasa, `SELECT *` qator tartibini kafolatlamaydi.
- **Pool** — `pg` paketidagi ulanishlar to'plami; sozlamalar (user, password, database, host, port) bir marta yoziladi; **birinchi so'rovda** ulanadi.
- **parametr** — `$1, $2` + qiymatlar massivi; qiymat SQL matniga yopishtirilmaydi.
- **endpoint** — method + path: `GET /api/cars` → `SELECT`, `POST` → `INSERT … RETURNING *` (201), `PUT /:id` → `UPDATE`, `DELETE /:id` → `DELETE`.
- **xato o'qish** — server javobi (status + `error`) **va** server terminali; bo'sh xabar bo'lsa — `console.error(err)`.

**Darsning ipi:** o'quvchi m4-06 da ko'radigan do'kon jadvali → siz uni `psql`da qo'lda boshqarasiz → xavfsiz sinaysiz → sinfdagi xatolar → o'sha CRUD Express ichida (m4-08 AvtoIjara) → serverni buzib tuzatasiz → ikki o'quvchi darsiga ko'prik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | CRUD: to'rt amal — to'rt SQL buyruq — to'rt endpoint | Lesson | 1 · CRUD PostgreSQL terminalida |
| 3 | `shop` bazasi: jadval va `INSERT` | Lesson | 1 |
| 4 | `SELECT` va `WHERE` | Lesson | 1 |
| 5 | `UPDATE` va `DELETE` | Lesson | 1 |
| 6 | Tekshiruv 1 — `UPDATE 0` | MCRetry | 1 |
| 7 | Amaliyot 1 — do'konni o'zingiz boshqaring | Practice | 1 |
| 8 | `WHERE`'siz — hamma qator | Lesson | 2 · xavfsiz sinash |
| 9 | Tekshiruv 2 — `ROLLBACK`dan keyin | MCRetry | 2 |
| 10 | Amaliyot 2 — `BEGIN … ROLLBACK` | Practice | 2 |
| 11 | Sinfdagi SQL xatolari | Lesson | 3 · xatolar |
| 12 | `NOT NULL` yo'q — nomsiz mahsulot | Lesson | 3 |
| 13 | Tekshiruv 3 — apostrof | MCRetry | 3 |
| 14 | Express'dan bazaga: `Pool` va `GET` | Lesson | 4 · Express |
| 15 | `POST`, `PUT`, `DELETE` | Lesson | 4 |
| 16 | Nega `$1` | Lesson | 4 |
| 17 | Amaliyot 3 — AvtoIjara server | Practice | 4 |
| 18 | Buzamiz 1: `price` ustuni | Lesson | 5 · buzamiz |
| 19 | Buzamiz 2: `express.json()` yo'q | Lesson | 5 |
| 20 | Ulanish xatolari — birinchi so'rovda | Lesson | 5 |
| 21 | Port band — «ishlayapti», lekin eski server | Lesson | 5 |
| 22 | Tekshiruv 4 — qaysi satr 500 beradi | LineCheck | 5 |
| 23 | Amaliyot 4 — o'zingiz buzing | Practice | 5 |
| 24 | m4-06 xaritasi | Lesson | 6 · ko'prik |
| 25 | m4-08 xaritasi va o'quvchi darsidagi farqlar | Lesson | 6 |
| 26 | Sinfdagi holatlar va o'quvchi savollari | Lesson | 6 |
| 27 | O'z-sinov — 8 savol | Screen27 | — |
| 28 | Yakun | Screen28 | — |

**Sahna turlari:** `psql` — terminal oynasi (PG-1 dagidek, Explorer'siz); Express — VS Code oynasi `avto-ijara-server` (Explorer: `node_modules/` yopiq · `package.json` · `server.js`) + terminal + Postman ko'rinishidagi karta.

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · PostgreSQL` · Sarlavha: **Jadval tayyor. Endi uni boshqaramiz — PostgreSQL terminalida va Express ichida.**
- Sahna: chapda reja (6 bosqich); o'ngda natija — Postman ko'rinishidagi karta: `POST /api/cars` → `201` va JSON.
- Reja: 01 CRUD PostgreSQL terminalida · 02 WHERE va xavfsiz sinash · 03 Sinfdagi SQL xatolari · 04 Express'dan bazaga · 05 Buzamiz · 06 O'quvchi darslarini o'tish
1. **PostgreSQL-1 da jadval yaratdingiz — bugun undagi ma'lumotni to'rt buyruq bilan boshqaramiz**
   Ovoz: «Assalomu alaykum. Oldingi darsda PostgreSQL'ni o'rnatdingiz, jadval yaratdingiz va bog'ladingiz. Bugun jadvaldagi ma'lumotni boshqaramiz: qo'shish, ko'rish, o'zgartirish va o'chirish. Buni CRUD deyishadi, uning nimaligini keyingi ekranda aniq ko'ramiz.»
2. **Avval PostgreSQL terminalida qo'lda: o'quvchi m4-06 dagi do'konning o'zi bilan**
   Ovoz: «Avval bu buyruqlarni PostgreSQL terminalida qo'lda yozamiz. Misol o'quvchi m4-06 darsidagi do'konning aynan o'zi: klaviatura, sichqoncha, quloqchin. Sinfda o'quvchi ekranda ko'radigan narsani siz bazada ko'rgan bo'lasiz.» · reja 01–03
3. **Keyin o'sha so'rovlar Express ichida — o'quvchi m4-08 da AvtoIjara serverini quradi**
   Ovoz: «Keyin xuddi shu so'rovlarni Express serveri ichiga qo'yamiz. O'quvchi m4-08 darsida AvtoIjara uchun server quradi, kodini Gemini yozadi. Siz bu serverni o'zingiz ishga tushirasiz, ataylab buzasiz va tuzatasiz.» · reja 04–05
4. **Olti bosqich, to'rt amaliyot. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi**
   Ovoz: «Dars olti bosqichdan iborat, orasida to'rtta amaliyot bor. Oxirida ikki o'quvchi darsini qanday o'tishni ko'ramiz. Shoshilmang: har ekranni boshidan eshitish va matnini o'qish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.» · reja 06
- Manba: `pg2-out/11-crud-sorovlar.txt` (POST → 201).

---

## 2 · CRUD: to'rt amal — to'rt SQL buyruq — to'rt endpoint  ← `Lesson`
- Kicker: `1-bosqich · CRUD PostgreSQL terminalida` · Sarlavha: **CRUD — ma'lumot bilan qilinadigan to'rt amal: bazada buyruq, serverda endpoint**
- Sahna (F-1102-21, M39; galma-gal): to'rt qatorli jadval — ustunlar: CRUD · ma'nosi · PostgreSQL buyrug'i · baza javobi · Express endpoint · status. 1-segmentda faqat dastlabki ikki ustun (Create · Read · Update · Delete — yaratish · o'qish · o'zgartirish · o'chirish); 2-segmentda SQL ustunlari ochiladi; 3-segmentda Express ustunlari; 4-segmentda butun jadval va qoida-chiziq.
  | CRUD | ma'nosi | PostgreSQL | baza javobi | Express | status |
  |---|---|---|---|---|---|
  | Create | yaratish | `INSERT` | `INSERT 0 1` | `POST /api/cars` | `201` |
  | Read | o'qish | `SELECT` | `(4 rows)` | `GET /api/cars` | `200` |
  | Update | o'zgartirish | `UPDATE` | `UPDATE 1` | `PUT /api/cars/2` | `200` |
  | Delete | o'chirish | `DELETE` | `DELETE 1` | `DELETE /api/cars/1` | `200` |
1. **CRUD — to'rtta inglizcha so'zning bosh harfi: yaratish, o'qish, o'zgartirish, o'chirish**
   Ovoz: «Bugungi darsning poydevori bitta so'z: CRUD. Bu to'rtta inglizcha so'zning bosh harfi: Create, Read, Update va Delete, ya'ni yaratish, o'qish, o'zgartirish va o'chirish. Har qanday ilova ma'lumot bilan aynan shu to'rt ishni qiladi: onlayn do'kon ham, Telegram ham.»
2. **PostgreSQL'da har amalning o'z buyrug'i bor: `INSERT`, `SELECT`, `UPDATE`, `DELETE`**
   Ovoz: «PostgreSQL'da har amalning o'z buyrug'i bor. Yaratish insert, o'qish select, o'zgartirish update, o'chirish esa delete. Har buyruqdan keyin baza qisqa javob qaytaradi, masalan insert nol bir yoki update bir. Bu javobni o'qishni bugun alohida o'rganamiz.»
3. **Serverda xuddi shu to'rt amal endpoint bo'ladi: `POST`, `GET`, `PUT`, `DELETE`**
   Ovoz: «Serverda xuddi shu to'rt amal endpoint bo'ladi. Yaratish POST, o'qish GET, o'zgartirish PUT, o'chirish DELETE. Har endpoint ichida o'sha SQL buyrug'i turadi. Postman javobida esa status chiqadi: yaratilganda ikki yuz bir, qolganlarida ikki yuz.»
4. **Xulosa: har amalning bazada bitta buyrug'i, serverda bitta endpoint'i bor**
   Ovoz: «Xulosa: CRUD to'rtta amaldan iborat. Har amalning PostgreSQL'da bitta buyrug'i va serverda bitta endpoint'i bor. Demak, bugun avval buyruqlarni PostgreSQL terminalida qo'lda yozamiz, keyin xuddi shularni Express serveri ichiga qo'yamiz.»
- Manba: `pg2-out/01-create-insert-select.txt` (`INSERT 0 1` — Mishka, `(4 rows)`), `03-update-delete.txt` (`UPDATE 1`, `DELETE 1`), `11-crud-sorovlar.txt` (POST 201 · GET/PUT/DELETE 200). Haqiqiy natijalar — yangi yurgizish shart emas.

---

## 3 · `shop` bazasi: jadval va `INSERT`  ← `Lesson`
- Kicker: `1-bosqich · CRUD PostgreSQL terminalida` · Sarlavha: **`products` — o'quvchi darsidagi jadval aynan**
- Sahna: terminal: `CREATE TABLE`, ikki `INSERT`, `SELECT *`; yonida o'quvchi darsidagi jadval «chizmasi» kartasi.
1. **O'quvchi m4-06 da shu jadvalni ko'radi: id, nom, narx va qoldiq**
   Ovoz: «Jadvaldan boshlaymiz. O'quvchi m4-06 darsida aynan shu jadvalni ko'radi. Uning nomi products, unda to'rtta ustun bor: id o'zi o'sadi, nomi matn, narxi va qoldig'i esa butun son. Siz shop degan bazada uni PostgreSQL terminalida yaratasiz.»
   ```
   shop=# CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);
   CREATE TABLE
   ```
2. **Bitta `INSERT` bilan uch qator; javobdagi oxirgi raqam — qo'shilgan qatorlar soni**
   Ovoz: «Bitta insert bilan uchta mahsulot qo'shamiz, xuddi o'quvchi darsidagidek. Baza javobi insert, nol, uch. Oxirgi raqam nechta qator qo'shilganini aytadi. Keyin to'rtinchi mahsulotni qo'shamiz: Mishka, narxi ellik ming so'm.»
   ```
   shop=# INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5);
   INSERT 0 3
   shop=# INSERT INTO products (name, price, stock) VALUES ('Mishka', 50000, 10);
   INSERT 0 1
   ```
3. **`SELECT *` — hamma ustun; `id` larni biz yozmadik, baza o'zi berdi**
   Ovoz: «Select yulduzcha hamma ustunni ko'rsatadi. id ustunini biz yozmadik, baza o'zi bir, ikki, uch, to'rt deb berdi. O'quvchi «id'ni qayerdan oldik?» desa, javob shu: serial.»
   ```
    id |    name    | price  | stock
   ----+------------+--------+-------
     1 | Klaviatura | 120000 |     8
     2 | Sichqoncha |  75000 |    15
     3 | Quloqchin  |  95000 |     5
     4 | Mishka     |  50000 |    10
   (4 rows)
   ```
4. **Xulosa: jadval va ma'lumot o'quvchi darsidagidek — lekin ustunlarda `NOT NULL` yo'q**
   Ovoz: «Xulosa: bazangizda o'quvchi darsidagi do'konning aynan o'zi bor. Bitta narsani eslab qoling: bu jadvalda not null qoidasi yo'q. Nima bo'lishini uchinchi bosqichda ko'ramiz.»
- Manba: `pg2-out/01-create-insert-select.txt`; o'quvchi darsi `PostgresCrudLesson.jsx` (`PRODUCTS`, DDL 773-satr).

## 4 · `SELECT` va `WHERE`  ← `Lesson`
- Kicker: `1-bosqich · CRUD PostgreSQL terminalida` · Sarlavha: **`WHERE` — minglab qatordan faqat keraklisi**
- Sahna: terminal: `SELECT name, price` → `WHERE price < 100000` (3 qator) → `WHERE stock < 6` (1 qator); jadval kartasida mos qatorlar yonadi.
1. **Hamma ustun kerak bo'lmasa — `SELECT`dan keyin faqat kerakli ustunlar yoziladi**
   Ovoz: «Jadval bor, endi undan o'qiymiz. Hamma ustun kerak bo'lmasa, select'dan keyin faqat keraklisini yozasiz: nom va narx. Ma'lumot o'zgarmaydi, select faqat ko'rsatadi.»
2. **`WHERE price < 100000` — yuz mingdan arzonlari: uchta mahsulot**
   Ovoz: «Minglab mahsulotdan faqat keraklisini olish uchun where yoziladi. Narxi yuz mingdan kam bo'lganlarini so'raymiz: sichqoncha, quloqchin va mishka, ya'ni uchta qator. O'quvchi darsida bu filtr tugma bilan, siz esa uni so'rovda yozdingiz.»
   ```
   shop=# SELECT * FROM products WHERE price < 100000;
    id |    name    | price | stock
   ----+------------+-------+-------
     2 | Sichqoncha | 75000 |    15
     3 | Quloqchin  | 95000 |     5
     4 | Mishka     | 50000 |    10
   (3 rows)
   ```
3. **`WHERE stock < 6` — tugayotgan mahsulot: faqat quloqchin**
   Ovoz: «Ikkinchi filtr qoldig'i oltidan kam, ya'ni tugayotgan mahsulotlarni topadi. Natijada faqat quloqchin chiqdi, undan beshta qolgan. Do'kon menejeri aynan shu so'rov bilan nimani buyurtma qilishni biladi.»
4. **Xulosa: `SELECT` faqat o'qiydi; `WHERE` qatorlarni tanlaydi**
   Ovoz: «Xulosa: select hech narsani o'zgartirmaydi, faqat o'qiydi. Where qaysi qatorlar kerakligini aytadi. Bu ikkisini yaxshi tushungan o'quvchi update va delete'ni ham oson tushunadi, chunki ularda ham aynan shu where ishlaydi.»
- Manba: `pg2-out/01-create-insert-select.txt` (`SELECT name, price`), `02-where.txt`.

## 5 · `UPDATE` va `DELETE`  ← `Lesson`
- Kicker: `1-bosqich · CRUD PostgreSQL terminalida` · Sarlavha: **`UPDATE 1`, `DELETE 1` — javobdagi son nechta qator tegilganini aytadi**
- Sahna: terminal: `UPDATE … WHERE id = 1` → `UPDATE 1` · `DELETE … WHERE id = 3` → `DELETE 1` · `SELECT *` (Klaviatura oxirida!) · `WHERE id = 99` → `UPDATE 0` / `DELETE 0`.
1. **Klaviatura arzonladi: `UPDATE … WHERE id = 1` — javob `UPDATE 1`, bitta qator**
   Ovoz: «O'quvchi darsidagi voqea: klaviatura narxi to'qson to'qqiz mingga tushdi. Buyruq shunday: update, set price, where id bir. Baza javobi update bir, ya'ni bitta qator o'zgardi. Javobdagi son doim nechta qator tegilganini aytadi.»
   ```
   shop=# UPDATE products SET price = 99000 WHERE id = 1;
   UPDATE 1
   ```
2. **Quloqchin sotuvdan chiqdi: `DELETE … WHERE id = 3` — `DELETE 1`**
   Ovoz: «Quloqchin sotuvdan chiqdi, uni o'chiramiz: delete from products, where id uch. Baza javobi delete bir. Endi select bilan jadvalni ko'ramiz.»
   ```
   shop=# DELETE FROM products WHERE id = 3;
   DELETE 1
   ```
3. **Diqqat: Klaviatura ro'yxat oxiriga tushdi — `ORDER BY` bo'lmasa tartib kafolatlanmaydi**
   Ovoz: «Natijaga qarang: klaviatura birinchi emas, oxirida turibdi. Bu xato emas. Order by yozilmasa, baza qatorlarni istalgan tartibda qaytarishi mumkin. Sinfda o'quvchi «mahsulot o'rni o'zgardi» desa, javob shu. Tartib kerak bo'lsa, oxiriga order by id yoziladi.»
   ```
   shop=# SELECT * FROM products;
    id |    name    | price | stock
   ----+------------+-------+-------
     2 | Sichqoncha | 75000 |    15
     4 | Mishka     | 50000 |    10
     1 | Klaviatura | 99000 |     8
   (3 rows)
   ```
4. **Bunday `id` yo'q bo'lsa — xato emas, `UPDATE 0` va `DELETE 0`**
   Ovoz: «To'qson to'qqizinchi mahsulotni o'zgartirib ko'ramiz. Xato chiqmaydi, javob update nol. Delete ham nol qaytaradi. Baza «bunday qator yo'q» deb aytmaydi, shunchaki hech narsaga tegmaydi. Shuning uchun javobdagi sonni o'qish kerak.»
   ```
   shop=# UPDATE products SET price = 1 WHERE id = 99;
   UPDATE 0
   shop=# DELETE FROM products WHERE id = 99;
   DELETE 0
   ```
5. **Xulosa: har `UPDATE` va `DELETE`dan keyin javobdagi sonni o'qing**
   Ovoz: «Xulosa: update va delete'dan keyin javobdagi sonni o'qing. Bir bo'lsa, kutganingiz bo'ldi. Nol bo'lsa, where hech narsaga mos kelmadi. Kutilmagan katta son bo'lsa, where noto'g'ri yoki umuman yozilmagan. Buni keyingi bosqichda ko'ramiz.»
- Manba: `pg2-out/03-update-delete.txt`.

## 6 · Tekshiruv 1 — `UPDATE 0`  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **O'quvchi: «`UPDATE products SET price = 1 WHERE id = 99;` yozdim — xato chiqmadi, `UPDATE 0`». Nima bo'ldi?**
- Ovoz: «Javobdagi sonni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. O'quvchi to'qson to'qqizinchi mahsulot narxini o'zgartirmoqchi bo'ldi. Xato yo'q, javob: update nol. Nima bo'ldi? Variantni tanlang.»
- Variantlar (to'g'risi — 1): 1 `id = 99` qator yo'q — `WHERE` hech narsaga mos kelmadi · 2 Narxni o'zgartirishga ruxsat yo'q · 3 Jadval bo'shab qoldi · 4 Narx o'zgardi, lekin hali saqlanmadi
- To'g'ri (ovoz): «To'g'ri. Where id to'qson to'qqiz hech qanday qatorga mos kelmadi, shuning uchun nol qator o'zgardi. Baza buni xato deb hisoblamaydi. O'quvchiga ayting: avval select bilan bunday id bor-yo'qligini tekshirsin. Demak, update nol xato emas: bu where hech qaysi qatorga mos kelmaganini bildiradi.» · qisqa: «`UPDATE 0` — `WHERE` hech bir qatorga mos kelmadi. Xato emas: avval `SELECT … WHERE id = 99` bilan tekshiring.»
- Xato izohlari: 2 — «Ruxsat yo'q bo'lsa `ERROR:  permission denied for table products` chiqardi; bu yerda xato yo'q.» · 3 — «Jadval joyida: `UPDATE 0` hech narsani o'chirmaydi.» · 4 — «Tranzaksiyasiz `UPDATE` darhol saqlanadi; son esa nechta qator tegilganini aytadi.»
- Maslahat: «Javobdagi son nimani sanaydi? `WHERE` qaysi qatorni topishi kerak edi?»
- Manba: `pg2-out/03-update-delete.txt`; `18-qoshimcha.txt` (faqat SELECT huquqli foydalanuvchi → `ERROR:  permission denied for table products`).

## 7 · Amaliyot 1 — do'konni o'zingiz boshqaring  ← `Practice`
- Kicker: `Amaliyot 1 / 4` · Eyebrow: `Hozir o'zingizda · 10–15 daqiqa` · Sarlavha: **`shop` bazasi va CRUD — o'quvchi darsidagi to'rt voqea** · `tableAt: 3`
1. **Endi siz: o'quvchi darsidagi to'rt voqeani o'z bazangizda bajarasiz**
   Ovoz: «Endi navbat sizga. O'quvchi darsidagi to'rt voqeani o'z bazangizda bajarasiz: jadval yaratasiz, mahsulot qo'shasiz, filtrlaysiz, keyin narxni o'zgartirib, bitta mahsulotni o'chirasiz. Bunga o'n-o'n besh daqiqa ketadi.»
2. **1–3-qadam: baza, jadval, mahsulotlar va ikki filtr**
   Ovoz: «Birinchi qadamda shop bazasi va products jadvalini yaratasiz. Ikkinchisida to'rtta mahsulot qo'shasiz. Uchinchisida ikkita filtr yozasiz: arzonlarini va tugayotganlarini. Har buyruqdan keyin javob satrini o'qing.»
3. **4-qadam: narx va o'chirish; isbot — oxirgi `SELECT`dagi qatorlar soni**
   Ovoz: «To'rtinchi qadamda klaviatura narxini o'zgartiring va quloqchinni o'chiring, keyin select yulduzcha. Isbot maydoniga oxirgi select natijasi ostidagi qatorlar sonini yozing.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz CRUD'ning to'rt buyrug'ini o'z bazangizda yozgan va har javobdagi sonni o'qigan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Baza va jadval | `psql -U postgres` · `CREATE DATABASE shop;` · `\c shop` · `CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);` | `CREATE DATABASE` · `CREATE TABLE` |
  | 2 | Mahsulotlar | `INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5);` · `INSERT INTO products (name, price, stock) VALUES ('Mishka', 50000, 10);` | `INSERT 0 3` · `INSERT 0 1` |
  | 3 | Filtrlar | `SELECT * FROM products WHERE price < 100000;` · `SELECT * FROM products WHERE stock < 6;` | 3 qator · 1 qator (Quloqchin) |
  | 4 | Narx va o'chirish | `UPDATE products SET price = 99000 WHERE id = 1;` · `DELETE FROM products WHERE id = 3;` · `SELECT * FROM products;` | `UPDATE 1` · `DELETE 1` · `(… rows)` |
- Isbot: «Oxirgi `SELECT *` natijasidagi qatorlar soni» · placeholder: «natija ostidagi sonni yozing» · KOD: `/^\s*\(?\s*3\b/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `ERROR:  database "shop" already exists` | baza oldin yaratilgan — `\c shop` |
  | `ERROR:  relation "products" does not exist` | boshqa bazadasiz (prompt `postgres=#`) — `\c shop` |
  | `INSERT 0 3` ikki marta | mahsulotlar ikki marta qo'shilgan — `id` lar 1–8; 4-qadamda `id`ni `SELECT` bo'yicha tanlang |
  | `UPDATE 0` / `DELETE 0` | bunday `id` yo'q — avval `SELECT *` bilan `id`ni ko'ring |
  | `ERROR:  syntax error at or near "…"` | `^` ko'rsatgan joydan oldin vergul, qavs yoki tirnoq tushib qolgan |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `pg2-out/01…03`; PG-1 `pg1-out/10-relation-yoq.txt`, `22-tuzatishlar.txt` (`already exists`).

---

## 8 · `WHERE`'siz — hamma qator  ← `Lesson`
- Kicker: `2-bosqich · xavfsiz sinash` · Sarlavha: **`WHERE` unutilsa — `UPDATE 3`, `DELETE 3`. Xavfsiz sinash: `BEGIN … ROLLBACK`**
- Sahna: terminal (bitta seans): `BEGIN` → `UPDATE … ` (WHERE'siz) → `UPDATE 3` + jadval (hammasi 99000) → `DELETE FROM products;` → `DELETE 3` + `(0 rows)` → `ROLLBACK` → jadval joyida; yonida jadval kartasi rangini o'zgartiradi.
1. **O'quvchi darsi ogohlantiradi: `WHERE`'siz — hamma qator. Buni xavfsiz ko'ramiz**
   Ovoz: «O'quvchi darsida qizil ogohlantirish bor: update yoki delete'da where unutilsa, hamma qator o'zgaradi. Siz buni o'z ko'zingiz bilan ko'rishingiz kerak, lekin bazani buzmasdan. Usul: avval begin, ya'ni tranzaksiya ochamiz.»
2. **`WHERE`'siz `UPDATE` — `UPDATE 3`: hamma mahsulot to'qson to'qqiz ming**
   Ovoz: «Begin'dan keyin where'siz update. Baza javobi update uch. Select qilsak, hamma mahsulot to'qson to'qqiz ming so'm: sichqoncha ham, mishka ham. Mana o'quvchi darsidagi ogohlantirishning o'zi.»
   ```
   BEGIN;
   UPDATE products SET price = 99000;
   UPDATE 3
    id |    name    | price | stock
     2 | Sichqoncha | 99000 |    15
     4 | Mishka     | 99000 |    10
     1 | Klaviatura | 99000 |     8
   ```
3. **`WHERE`'siz `DELETE` — `DELETE 3`, jadval bo'sh**
   Ovoz: «Undan ham yomoni where'siz delete. Baza javobi delete uch, select esa nol qator qaytaradi. Haqiqiy do'konda bu butun katalog yo'qolgani.»
   ```
   DELETE FROM products;
   DELETE 3
   (0 rows)
   ```
4. **`ROLLBACK` — hammasi joyida: tranzaksiya ichidagi o'zgarish bekor bo'ldi**
   Ovoz: «Endi rollback yozamiz va select qilamiz: uchala mahsulot joyida, narxlari ham eski. Tranzaksiya ichida qilingan hamma narsa bekor bo'ldi. PostgreSQL-1 da tranzaksiya do'konni himoya qilgan edi, bu yerda u sizning sinov maydoningiz.»
   ```
   ROLLBACK;
   ROLLBACK
    2 | Sichqoncha | 75000 |    15
    4 | Mishka     | 50000 |    10
    1 | Klaviatura | 99000 |     8
   ```
5. **Xulosa: xavfli `UPDATE`/`DELETE`ni avval `BEGIN` ichida sinang, `SELECT` bilan ko'ring**
   Ovoz: «Xulosa: xavfli update yoki delete'ni avval begin ichida yurgizing, select bilan natijani ko'ring. To'g'ri bo'lsa commit, noto'g'ri bo'lsa rollback. Sinfda o'quvchiga ham shuni o'rgating: bu bitta qator, lekin butun jadvalni saqlab qoladi.»
- Manba: `pg2-out/04-wheresiz-rollback.txt`.

## 9 · Tekshiruv 2 — `ROLLBACK`dan keyin  ← `MCRetry`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4`
- Sarlavha: **`BEGIN;` → `DELETE FROM products;` (`DELETE 3`) → `ROLLBACK;` → `SELECT * FROM products;`. Nima chiqadi?**
- Ovoz: «Xavfsiz sinashni ko'rdingiz, tekshirib olaylik. Ikkinchi tekshiruv. Begin, where'siz delete, javob delete uch. Keyin rollback va select. Jadvalda nima bor? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Nol qator — `DELETE 3` bajarilgan edi · 2 Faqat bitta qator — oxirgisi qaytadi · 3 Uchala mahsulot — `ROLLBACK` o'chirishni bekor qildi · 4 `ERROR` — o'chirilgan jadvaldan o'qib bo'lmaydi
- To'g'ri (ovoz): «To'g'ri. Delete tranzaksiya ichida edi, rollback uni bekor qildi. Uchala mahsulot joyida. Commit yozilmaguncha o'zgarish saqlanmaydi. Demak, begin va rollback xavfli buyruqni bazani buzmasdan sinash imkonini beradi.» · qisqa: «`ROLLBACK` — tranzaksiya ichidagi hamma o'zgarish bekor: uch qator joyida.»
- Xato izohlari: 1 — «`DELETE 3` tranzaksiya ichida edi va `COMMIT` qilinmadi.» · 2 — «`ROLLBACK` bitta qatorni emas, butun tranzaksiyani bekor qiladi.» · 4 — «`DELETE` qatorlarni o'chiradi, jadvalni emas; jadval doim joyida.»
- Maslahat: «`ROLLBACK` tranzaksiya ichidagi o'zgarishlar bilan nima qiladi?»
- Manba: `pg2-out/04-wheresiz-rollback.txt`.

## 10 · Amaliyot 2 — `BEGIN … ROLLBACK`  ← `Practice`
- Kicker: `Amaliyot 2 / 4` · Eyebrow: `Hozir o'zingizda · 5–10 daqiqa` · Sarlavha: **`WHERE`'siz `UPDATE`ni xavfsiz sinang** · `tableAt: 3`
1. **Endi siz: `WHERE`'siz `UPDATE`ni o'z bazangizda, lekin tranzaksiya ichida qilasiz**
   Ovoz: «Endi o'zingiz: where'siz update'ni o'z bazangizda qilasiz, lekin tranzaksiya ichida. Bunga besh-o'n daqiqa ketadi. Bu mashqni sinfda o'quvchilarga ham ko'rsatasiz.»
2. **1–2-qadam: `BEGIN`, `WHERE`'siz `UPDATE` va `SELECT` — hamma narx bir xil**
   Ovoz: «Birinchi qadamda begin yozasiz. Ikkinchisida where'siz update qilib, select bilan hamma narx bir xil bo'lganini ko'rasiz. Commit yozmang.»
3. **3–4-qadam: `ROLLBACK` va `SELECT`; isbot — klaviaturaning narxi**
   Ovoz: «Uchinchi qadamda rollback yozasiz, to'rtinchisida yana select qilasiz. Isbot maydoniga klaviaturaning hozirgi narxini yozing, rollback'dan keyingisini.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz where'siz update qanday xavfli ekanini ko'rdingiz va rollback bilan hammasini qaytarishni o'rgandingiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Tranzaksiya | `BEGIN;` | `BEGIN` · prompt `shop=*#` |
  | 2 | WHERE'siz | `UPDATE products SET price = 1;` · `SELECT * FROM products;` | `UPDATE 3` · hamma narx 1 |
  | 3 | Bekor | `ROLLBACK;` | `ROLLBACK` · prompt `shop=#` |
  | 4 | Tekshirish | `SELECT * FROM products;` | narxlar eski |
- Isbot: «`ROLLBACK`dan keyingi Klaviatura narxi» · placeholder: «klaviatura narxini yozing» · KOD: `/^\s*99\s?000\s*$/` (1-amaliyotdan keyin 99 000).
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `WARNING:  there is no transaction in progress` (ROLLBACK'da) | `BEGIN` yozilmagan — o'zgarish allaqachon saqlangan; narxlarni 1-amaliyotdagi `UPDATE`lar bilan tiklang |
  | narx 120000 | 1-amaliyotning 4-qadami (99 000) bajarilmagan — isbotga ko'ringan narxni emas, 99000 kutiladi: 1-amaliyotni tugating |
  | prompt `shop=!#` | tranzaksiya ichida xato bo'ldi — `ROLLBACK;` yozing |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `pg2-out/04`, `18-qoshimcha.txt` (`BEGIN`siz `ROLLBACK`); promptlar — `pg1-out/25-psql-promptlar.txt`.

---

## 11 · Sinfdagi SQL xatolari  ← `Lesson`
- Kicker: `3-bosqich · xatolar` · Sarlavha: **Beshta xato — har birini xabarning o'zi aytadi**
- Sahna: terminal, har segmentda bitta xato (qizil) va tuzatish (yashil); tepada PG-1 formulasi «qaysi jadval · qaysi qoida/ustun · qaysi qiymat».
1. **AI xatosi o'quvchi darsida bor: `product` — bitta `s` yetmaydi, jadval «yo'q»**
   Ovoz: «Endi sinfda chiqadigan xatolar. Birinchisi o'quvchi darsida ham bor: AI products o'rniga product deb yozgan. Baza relation product does not exist deb javob beradi. Jadval bor, faqat nomi bitta harfga farq qiladi.»
   ```
   shop=# SELECT * FROM product WHERE price < 100000;
   ERROR:  relation "product" does not exist
   ```
2. **Ustun nomi xato: `narx` — `HINT` esa noto'g'ri ustunni taklif qiladi**
   Ovoz: «Ikkinchisi ustun nomida. O'quvchi narx deb yozdi. Baza column narx does not exist deb javob beradi, ostida esa hint: perhaps you meant name. Diqqat: hint taxmin qiladi va bu yerda adashgan, kerakli ustun price. Hint'ni emas, jadval tuzilishini teskari chiziqcha d bilan tekshiring.»
   ```
   ERROR:  column "narx" does not exist
   HINT:  Perhaps you meant to reference the column "products.name".
   ```
3. **Son o'rniga matn va tushib qolgan qiymat — `invalid input syntax`, `more target columns`**
   Ovoz: «Uchinchisi: narx ustuniga arzon degan so'z yozilgan, baza invalid input syntax for type integer deydi. To'rtinchisi: uchta ustun yozilgan, qiymat esa ikkita, baza insert has more target columns than expressions deydi. Ikkalasida ham strelka xato joyni ko'rsatadi.»
   ```
   ERROR:  invalid input syntax for type integer: "arzon"
   ERROR:  INSERT has more target columns than expressions
   ```
4. **O'zbekcha apostrof satrni yopadi: `syntax error at or near "yinchoq"` — ikki marta yoziladi**
   Ovoz: «Beshinchisi, o'zbek sinfida eng ko'p uchraydigani: apostrof. O'yinchoq so'zidagi apostrof satrni yopib qo'yadi, baza yinchoq so'zida adashadi. Tuzatish: apostrofni ikki marta yozish. Shunda mahsulot saqlanadi.»
   ```
   ERROR:  syntax error at or near "yinchoq"
   shop=# INSERT INTO products (name, price, stock) VALUES ('O''yinchoq', 30000, 4) RETURNING *;
     6 | O'yinchoq | 30000 |     4
   ```
5. **Xulosa: xabar ichidagi nomni jadval tuzilishi bilan solishtiring — `\d products`**
   Ovoz: «Xulosa: bu xatolarning hammasida xabar ichida nom yoki qiymat turadi. Uni jadval tuzilishi bilan solishtiring, teskari chiziqcha d products. Apostrof uchun bitta qoida: so'z ichidagi apostrof ikki marta yoziladi.»
- Manba: `pg2-out/05-xatolar.txt`, `05b-apostrof-tuzatish.txt`.

## 12 · `NOT NULL` yo'q — nomsiz mahsulot  ← `Lesson`
- Kicker: `3-bosqich · xatolar` · Sarlavha: **Qoida yozilmagan bo'lsa, baza qo'riqlamaydi: nomsiz mahsulot xato bermay saqlandi**
- Sahna: terminal: nomsiz `INSERT` → `INSERT 0 1` → `WHERE name IS NULL` → bo'sh nomli qator; yonida PG-1 `users` jadvali (`NOT NULL` bilan) kartasi.
1. **PostgreSQL-1 da baza bo'sh nomni rad etgan edi — bu jadvalda esa xato yo'q**
   Ovoz: «PostgreSQL-1 da bo'sh username'ni baza rad etgan edi. Bu jadvalda sinab ko'ramiz: nomsiz mahsulot qo'shamiz. Xato chiqmadi, baza javobi insert nol bir.»
   ```
   shop=# INSERT INTO products (price, stock) VALUES (30000, 4);
   INSERT 0 1
   ```
2. **`WHERE name IS NULL` — bo'sh nomli qator do'kon katalogida turibdi**
   Ovoz: «Where name is null bilan qidiramiz. Beshinchi qator chiqdi: nomi bo'sh, narxi o'ttiz ming. Saytda bu nomsiz mahsulot bo'lib chiqadi.»
   ```
    id | name | price | stock
     5 |      | 30000 |     4
   ```
3. **Sabab: o'quvchi darsidagi jadvalda `NOT NULL` yo'q — baza faqat yozilgan qoidani qo'riqlaydi**
   Ovoz: «Sabab jadvalning o'zida: o'quvchi darsidagi products'da not null yo'q. Baza faqat yozilgan qoidani qo'riqlaydi. PostgreSQL-1 dagi «baza o'zi tekshiradi» degan gap qoida yozilgandagina to'g'ri.»
4. **Xulosa: o'quvchi darsini o'zgartirmaysiz, lekin o'z jadvalida `NOT NULL` yozishni maslahat berasiz**
   Ovoz: «Xulosa: o'quvchi darsidagi jadvalni o'zgartirmaysiz, u sodda bo'lishi uchun shunday. Lekin amaliyotda o'quvchi o'z do'koni jadvalini yaratadi. O'shanda maslahat bering: nom va narxga not null yozsin.»
- Manba: `pg2-out/05-xatolar.txt` (nomsiz `INSERT`, `IS NULL`); PG-1 `pg1-out/08-tekshiruv-xatolari.txt`.

## 13 · Tekshiruv 3 — apostrof  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **O'quvchi `VALUES ('O'yinchoq', 30000, 4)` yozdi va `syntax error at or near "yinchoq"` oldi. Nima deysiz?**
- Ovoz: «Xatolarni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi o'yinchoq degan mahsulot qo'shmoqchi, baza syntax error, yinchoq so'zida. Unga nima deysiz? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 Mahsulot nomini lotincha emas, kirillda yozing · 2 So'z ichidagi apostrofni ikki marta yozing: `'O''yinchoq'` · 3 Nomni qo'shtirnoqqa oling: `"O'yinchoq"` · 4 `name` ustunining turini `VARCHAR` qiling
- To'g'ri (ovoz): «To'g'ri. SQL'da matn bir tirnoq ichida, so'z ichidagi apostrof uni erta yopadi. Ikki marta yozilsa, baza uni bitta apostrof deb tushunadi va mahsulot o'yinchoq nomi bilan saqlanadi. Demak, SQL matnidagi har bir apostrof ikki marta yoziladi.» · qisqa: «`'O''yinchoq'` — so'z ichidagi apostrof ikki marta. Saqlanganda bitta bo'ladi: `O'yinchoq`.»
- Xato izohlari: 1 — «Muammo harfda emas, apostrofda: u matnni erta yopyapti.» · 3 — «Qo'shtirnoq SQL'da ustun yoki jadval nomi uchun — sinab ko'rdik: `column "O'yinchoq" does not exist`.» · 4 — «Ustun turi bu xatoga aloqasiz: xato matn yozilishida.»
- Maslahat: «Matn qaysi belgi bilan boshlanib, qaysi belgi bilan tugaydi? Apostrof shu belgining o'zi.»
- Manba: `pg2-out/05-xatolar.txt`, `05b-apostrof-tuzatish.txt`, `18-qoshimcha.txt` (`"O'yinchoq"` → `column "O'yinchoq" does not exist`).

---

## 14 · Express'dan bazaga: `Pool` va `GET`  ← `Lesson`
- Kicker: `4-bosqich · Express` · Sarlavha: **m4-08: `cars` jadvali o'quvchining o'zi yozadi, `server.js` ni Gemini**
- Sahna: VS Code oynasi `avto-ijara-server` (Explorer: `node_modules/` · `package.json` · `server.js`), `server.js` 1–21-satr (yoritish bo'laklari); pastda terminal (`node server.js`) va Postman kartasi (`GET /api/cars` → 200, JSON). Belgi: «shartli namuna — Gemini har safar boshqacha yozadi».
1. **PostgreSQL terminalidagi CRUD endi server ichida: o'quvchi m4-08 da AvtoIjara uchun quradi**
   Ovoz: «PostgreSQL terminalida qo'lda qildingiz, endi xuddi shu so'rovlar server ichida. O'quvchi m4-08 darsida avval cars jadvalini PostgreSQL terminalida o'zi yozadi: model, kunlik narx, yil va ijaradami. Keyin server kodini Gemini yozadi.»
2. **`Pool` — bazaga ulanish sozlamalari: foydalanuvchi, parol, baza nomi bir joyda**
   Ovoz: «Kodning tepasida pg paketidan Pool olinadi. Unga foydalanuvchi, parol, baza nomi, host va port beriladi. Parolni o'quvchi o'zi yozadi, PostgreSQL o'rnatilganda berilgan parol. Shuning uchun sinf paroli hammada bir xil bo'lsa, ishingiz oson.»
3. **`GET /api/cars`: `pool.query` so'rovni bazaga olib boradi, `rows` — javobga ketadi**
   Ovoz: «Endi GET api cars endpoint'i. Pool query select'ni bazaga olib boradi, natijaning rows qismi, ya'ni qatorlar, res json bilan qaytadi. Postman'da ikki yuz va uchta mashina. Bu PostgreSQL terminalidagi select'ning o'zi, faqat javob JSON ko'rinishida.»
   Postman: `GET localhost:3000/api/cars` → **200** `[{"id":1,"model":"Chevrolet Cobalt","daily_price":280000,"year":2022,"is_rented":false}, …]`
4. **Xatoda `catch`: status 500 va xato matni — o'quvchi uni Postman'da ko'radi**
   Ovoz: «Pastda catch turibdi: xato bo'lsa, server besh yuz status va xato matnini qaytaradi. Bu muhim: sinfdagi xatolarning ko'pini o'quvchi aynan shu javobda ko'radi. Beshinchi bosqichda shu yo'l bilan buzamiz.»
5. **Xulosa: `Pool` → `pool.query` → `rows` → `res.json` — server bazaga shu yo'l bilan ulanadi**
   Ovoz: «Xulosa: so'rov serverdan bazaga to'rt qadamda boradi. Pool ulanadi, pool query so'rov yuboradi, rows qatorlarni oladi, res json javob qaytaradi. O'quvchi darsidagi test savoli ham shu haqda: serverni bazaga pool query ulaydi.»
- Kod (`pg2-out/11-server.js`, 1–21-satr): `require('express')` · `const { Pool } = require('pg')` · `USER`, `PASSWORD`, `DATABASE` o'zgaruvchilari · `new Pool({ user, password, database, host: 'localhost', port: 5432 })` · `app.get('/api/cars', async …)` → `pool.query('SELECT * FROM cars')` → `res.json(result.rows)` · `catch` → `res.status(500).json({ error: err.message })`.
- Manba: `pg2-out/10-cars.txt`, `11-server.js`, `11-crud-sorovlar.txt` (GET 200); o'quvchi darsi `BackendCrudPracticeLesson.jsx` (Gemini promptlari, `cars` ustunlari, test «pool.query — ko'prik»).

## 15 · `POST`, `PUT`, `DELETE`  ← `Lesson`
- Kicker: `4-bosqich · Express` · Sarlavha: **To'rt endpoint — to'rt SQL buyruq; javob statusi bilan**
- Sahna: `server.js` (POST/PUT/DELETE bo'laklari navbat bilan yonadi) + Postman kartalari (status rangli).
1. **`POST` — `INSERT … RETURNING *`: yangi qator javobda, status 201**
   Ovoz: «GET o'qiydi, qolgan uchtasi yozadi. POST'da insert, oxirida returning yulduzcha: baza yangi qatorni, id bilan, qaytaradi. Status ikki yuz bir, ya'ni yaratildi. Chevrolet Spark to'rtinchi id bilan qo'shildi.»
   Postman: `POST /api/cars` `{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }` → **201** `{"id":4,…,"is_rented":null}`
2. **`is_rented: null` — `POST`da berilmagan ustun bo'sh qoladi, `DEFAULT` yo'q**
   Ovoz: «Javobga qarang: is rented null. POST'da bu ustun berilmadi, jadvalda esa default qiymat yo'q. Sinfda o'quvchi «nega null?» desa, javob shu. Kerak bo'lsa, jadvalda default false yoziladi.»
3. **`PUT` — `UPDATE … WHERE id = $2`, `DELETE` — `WHERE id = $1`: 200**
   Ovoz: «PUT ikkinchi mashina narxini yangiladi, ikki yuz va yangilangan qator. DELETE birinchi mashinani o'chirdi, ikki yuz. Ikkalasida ham where bor, faqat id endi URL'dan keladi.»
   Postman: `PUT /api/cars/2` `{ "daily_price": 480000 }` → **200** · `DELETE /api/cars/1` → **200** `{"message":"O'chirildi","deleted":1}`
4. **Yo'q `id`: kod `rowCount`ni tekshiradi va 404 qaytaradi — bu namunaning to'g'ri qarori**
   Ovoz: «To'qson to'qqizinchi mashina: to'rt yuz to'rt, mashina topilmadi. Nega? Baza update nol qaytaradi, xato emas. Bu namunada kod rowCount nolmi deb tekshiradi va to'rt yuz to'rt beradi. To'g'ri qaror: aks holda o'quvchi ikki yuz ko'rib, «o'zgardi» deb o'ylaydi. Gemini buni har doim ham yozmaydi.»
   Postman: `PUT /api/cars/99` → **404** `{"error":"Mashina topilmadi"}`
5. **Xulosa: GET — 200, POST — 201, PUT/DELETE — 200, topilmasa — 404, xato — 500**
   Ovoz: «Xulosa: GET ikki yuz, POST ikki yuz bir, PUT va DELETE ikki yuz qaytaradi; qator topilmasa to'rt yuz to'rt, xato bo'lsa besh yuz. Har biri PostgreSQL terminalidagi bitta buyruq. Javobdagi son, ya'ni rowCount, PostgreSQL terminalidagi update bir yoki update nol'ning o'zi.»
- Manba: `pg2-out/11-crud-sorovlar.txt`, `11-server.js` (`rowCount === 0` → 404).

## 16 · Nega `$1`  ← `Lesson`
- Kicker: `4-bosqich · Express` · Sarlavha: **Yopishtirilgan SQL: `1 OR 1=1` — uchala mashina o'chdi. `$1` bilan — 500, jadval joyida**
- Sahna: ikki ustun: chapda yopishtirilgan `DELETE` satri (qizil) + Postman `DELETE /api/cars/1 OR 1=1` → 200 `deleted: 3` + jadval `(0 rows)`; o'ngda `$1` satri (yashil) + 500 + jadval joyida.
1. **O'quvchi testida savol bor: «Nega `$1`?». Sinab ko'rdik — javob ekranda**
   Ovoz: «O'quvchi darsining testida savol bor: nega dollar bir ishlatamiz? Javob: matn kod bo'lib qolmasin. Bu quruq gap emas, sinab ko'rdik. Delete'da id'ni SQL matniga to'g'ridan-to'g'ri yopishtirdik.»
2. **URL'ga `1 OR 1=1` yozildi — so'rov «hammasi» bo'lib qoldi: `deleted: 3`**
   Ovoz: «Endi URL'da id o'rniga bir or bir teng bir yuborildi. Yopishtirilgan satr shunday SQL bo'ldi: where id bir, yoki bir teng bir. Bir teng bir doim to'g'ri. Javob ikki yuz, deleted uch, ya'ni jadval bo'sh qoldi. Buni SQL injection deyishadi.»
3. **`$1` bilan xuddi shu so'rov: `invalid input syntax for type integer` — 500, jadval joyida**
   Ovoz: «Endi dollar bir bilan. Qiymat SQL matniga kirmaydi, alohida beriladi. Baza bir or bir teng bir'ni son sifatida o'qishga urinadi va rad etadi: invalid input syntax for type integer. Besh yuz, lekin jadval joyida, uchala mashina bor.»
4. **Xulosa: qiymat doim `$1, $2` bilan — Gemini promptida ham shunday yozilgan**
   Ovoz: «Xulosa: foydalanuvchidan kelgan har qiymat dollar bir, dollar ikki bilan beriladi. O'quvchi darsidagi Gemini promptida ham shunday talab bor: qiymatlarni SQL matniga yopishtirma. Gemini boshqacha yozsa, o'quvchi buni tekshirishi kerak, siz esa shu misolni ko'rsatasiz.»
- Manba: `pg2-out/17-injection.txt` (sinovdan oldin `cars_zaxira` nusxa olingan va tiklangan).

## 17 · Amaliyot 3 — AvtoIjara server  ← `Practice`
- Kicker: `Amaliyot 3 / 4` · Eyebrow: `Hozir o'zingizda · 15–20 daqiqa` · Sarlavha: **`car_rental` va `server.js` — o'quvchi m4-08 dagi ish** · `tableAt: 3`
1. **Endi siz: m4-08 dagi ishni o'zingiz qilasiz — jadval qo'lda, server Gemini bilan yoki namunadan**
   Ovoz: «Endi o'zingiz qilasiz, o'quvchi m4-08 da qiladigan ishni. Jadvalni PostgreSQL terminalida qo'lda yozasiz. Server kodini o'quvchi promptlari bilan Gemini'dan oling yoki namunani o'zingiz yozing. O'n besh-yigirma daqiqa.»
2. **1–2-qadam: `car_rental` va `cars`; papka, `express` va `pg`**
   Ovoz: «Birinchi qadamda car rental bazasi va cars jadvalini yaratib, uchta mashina qo'shasiz. Ikkinchisida avto ijara server papkasini ochib, npm init qilasiz va express bilan pg paketlarini o'rnatasiz.»
3. **3–4-qadam: `server.js`, `node server.js`, Postman; isbot — `POST` javobining statusi**
   Ovoz: «Uchinchi qadamda server js faylini yozasiz, unga parolingizni qo'yib, node server js bilan ishga tushirasiz. To'rtinchisida Postman'da GET va POST yuborasiz. Isbot maydoniga POST javobining statusini yozing.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Beshinchi bosqichda bu xatolarning hammasini buzib ko'ramiz. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizda o'quvchi m4-08 da quradigan server ishlab turadi va siz uni Postman bilan sinagan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Jadval | `CREATE DATABASE car_rental;` · `\c car_rental` · `CREATE TABLE cars (id SERIAL PRIMARY KEY, model TEXT, daily_price INTEGER, year INTEGER, is_rented BOOLEAN);` · `INSERT … ('Chevrolet Cobalt', 280000, 2022, false), …` | `INSERT 0 3` |
  | 2 | Loyiha | `mkdir avto-ijara-server` · `cd avto-ijara-server` · `npm init -y` · `npm install express pg` | `added … packages` |
  | 3 | Server | `server.js` — «Kodni ochish» (namuna) yoki Gemini (m4-08 promptlari) · parol · `node server.js` | `Server 3000-portda ishlayapti` |
  | 4 | Postman | `GET localhost:3000/api/cars` · `POST localhost:3000/api/cars` body `{ "model": "Chevrolet Spark", "daily_price": 190000, "year": 2021 }` | 200 · 3 mashina · POST — `id` bilan |
- Kod (qadam 3): `server.js` — `pg2-out/11-server.js` (port 5432), «namuna — o'zingiz yozing yoki Gemini'dan oling».
- Isbot: «`POST` javobining statusi» · placeholder: «Postman ko'rsatgan statusni yozing» · KOD: `/^\s*201\b/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 500 `password authentication failed for user "postgres"` | `PASSWORD` — o'rnatishda berilgan parol (20-ekran) |
  | 500 `client password must be a string` | parol bo'sh / `process.env` o'qilmagan (20-ekran) |
  | 500 `database "…" does not exist` | `DATABASE` nomi xato yoki baza yaratilmagan (20-ekran) |
  | 500 `{"error":""}` | PostgreSQL ishlamayapti — `console.error(err)` bilan `ECONNREFUSED` ko'rinadi (20-ekran) |
  | 500 `Cannot destructure property 'model' of 'req.body'` | `app.use(express.json())` yo'q (19-ekran) |
  | 500 `column "price" of relation "cars" does not exist` | kodda ustun nomi xato (18-ekran) |
  | kod o'zgardi, javob o'zgarmadi | eski server ishlab turibdi — 21-ekran |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `pg2-out/10…16`.

---

## 18 · Buzamiz 1: `price` ustuni  ← `Lesson`
- Kicker: `5-bosqich · buzamiz` · Sarlavha: **`column "price" of relation "cars" does not exist` — kodda `price`, jadvalda `daily_price`**
- Sahna: `server.js` POST satri (`price` qizil) → Postman 500 → terminal → tuzatish (`daily_price` yashil) → Postman 201.
1. **O'quvchi darsidagi AI xatosini o'zimiz takrorlaymiz: `INSERT`da `price`**
   Ovoz: «Buzishni o'quvchi darsidagi xatodan boshlaymiz. Gemini insert'da daily price o'rniga price yozgan. Serverni ishga tushiramiz: xato yo'q, server ishlayapti deb yozadi. Xato faqat POST yuborilganda chiqadi.»
2. **POST → 500, xabarda jadval va ustun: `"price"` · `"cars"`**
   Ovoz: «POST yuboramiz, javob besh yuz. Xabarni o'qiymiz: column price of relation cars does not exist. Ustun price, jadval esa cars. O'quvchi darsida xabar qisqaroq yozilgan, haqiqiysi shu, relation cars bilan.»
   Postman: **500** `{"error":"column \"price\" of relation \"cars\" does not exist"}` · terminal: `column "price" of relation "cars" does not exist`
3. **Tuzatish: kodda `daily_price` — serverni qayta ishga tushirib, POST → 201**
   Ovoz: «Jadval tuzilishiga qaraymiz: ustun daily price. Kodda tuzatamiz, serverni to'xtatib, qayta ishga tushiramiz. POST yuboramiz: javob ikki yuz bir, yangi mashina id bilan qaytdi.»
   Postman: **201** `{"id":5,"model":"Hyundai Elantra","daily_price":450000,"year":2022,"is_rented":null}`
4. **Xulosa: 500 bo'lsa — `error` matnidagi nomni `\d cars` bilan solishtiring**
   Ovoz: «Xulosa: besh yuz chiqsa, xato matnini o'qing, ichida ustun va jadval nomi bor. Uni PostgreSQL terminalidagi teskari chiziqcha d cars bilan solishtiring. Kod o'zgargandan keyin serverni albatta qayta ishga tushiring.»
- Manba: `pg2-out/12-price-xato.txt`, `19-price-tuzatildi.txt` (tuzatilgan kod, qayta ishga tushirilgan server → 201, `id: 5`).

## 19 · Buzamiz 2: `express.json()` yo'q  ← `Lesson`
- Kicker: `5-bosqich · buzamiz` · Sarlavha: **`Cannot destructure property 'model' of 'req.body'` — so'rov tanasi o'qilmagan**
- Sahna: `server.js` — `app.use(express.json())` satri chizilgan → Postman 500 → satr qaytariladi (yashil) → 201.
1. **Bitta satrni olib tashlaymiz: `app.use(express.json())` — server baribir ishga tushadi**
   Ovoz: «Endi ikkinchi buzish. Gemini ba'zan bitta satrni unutadi: app use express json. Shu satrni olib tashlaymiz. Server xatosiz ishga tushadi, GET ham ishlaydi. Muammo faqat tanasi bor so'rovlarda.»
2. **POST → 500: `req.body` — `undefined`, `model`ni olib bo'lmaydi**
   Ovoz: «POST yuboramiz, javob besh yuz. Xabar shunday: cannot destructure property model of req body as it is undefined. Ya'ni req body umuman yo'q: Express so'rov tanasini o'qimagan, chunki json'ni o'qiydigan qism ulanmagan.»
   Postman: **500** `{"error":"Cannot destructure property 'model' of 'req.body' as it is undefined."}`
3. **Tuzatish: satr qaytariladi, `app` yaratilgandan keyin — POST → 201**
   Ovoz: «Tuzatish uchun app use express json satrini app yaratilgandan keyin, endpoint'lardan oldin qaytaramiz. Server qayta ishga tushadi, POST ikki yuz bir.»
4. **Xulosa: `req.body` `undefined` bo'lsa — birinchi qaraladigan joy `express.json()`**
   Ovoz: «Xulosa: req body undefined degan xato chiqsa, birinchi qaraladigan joy app use express json. GET ishlab, POST va PUT ishlamasa ham shu satr. O'quvchi darsidagi Gemini promptining birinchi bandi aynan shu.»
- Manba: `pg2-out/13-express-json-yoq.txt`; tuzatilgan holat — `11-crud-sorovlar.txt` (POST 201).

## 20 · Ulanish xatolari — birinchi so'rovda  ← `Lesson`
- Kicker: `5-bosqich · buzamiz` · Sarlavha: **Server «ishlayapti» deydi — parol, baza va PostgreSQL xatosi birinchi so'rovda chiqadi**
- Sahna: terminal `node server.js` → «Server 3000-portda ishlayapti» (har holatda); to'rt karta: holat · Postman javobi · tuzatish.
1. **`Pool` darhol ulanmaydi: server ishga tushadi, xato birinchi so'rovda**
   Ovoz: «Parol xatosini ko'rdik, endi uning g'alati tomoni. Pool server ishga tushganda bazaga ulanmaydi, birinchi so'rovda ulanadi. Shuning uchun parol xato bo'lsa ham terminalda server ishlayapti deb yoziladi. O'quvchi «server ishlayapti, lekin besh yuz» desa, xabarni o'qing.»
2. **Parol xato — `password authentication failed`; parol bo'sh — `client password must be a string`**
   Ovoz: «Parol xato bo'lsa: password authentication failed for user postgres. Parol umuman berilmasa, masalan process env'dan o'qilmagan bo'lsa: client password must be a string. Ikkinchisi g'alati ko'rinadi, lekin ma'nosi oddiy: parol o'zgaruvchisi bo'sh.»
   `500 password authentication failed for user "postgres"` · `500 SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`
3. **Baza nomi xato — `database "carrental" does not exist`: pastki chiziq tushib qolgan**
   Ovoz: «Baza nomida pastki chiziq tushib qolsa: database carrental does not exist. Baza bor, faqat nomi car pastki chiziq rental. PostgreSQL terminalidagi teskari chiziqcha l bilan aniq nomni ko'ring.»
4. **PostgreSQL o'chiq — xato matni bo'sh; `console.error(err)` — `ECONNREFUSED` ko'rinadi**
   Ovoz: «Eng chalkashi: PostgreSQL ishlamasa, javob besh yuz, lekin error bo'sh, terminalda ham bo'sh qator. Sinab ko'rdik: console error'ga err message emas, err'ning o'zini bersak, ECONNREFUSED chiqadi, ya'ni ulanish rad etildi. Yechim: PostgreSQL'ni ishga tushiring.»
   `500 {"error":""}` → `console.error(err)` → `AggregateError [ECONNREFUSED]` · `connect ECONNREFUSED ::1:5432`
5. **Xulosa: «ishlayapti» — faqat Express; baza xatosini birinchi so'rov va terminal aytadi**
   Ovoz: «Xulosa: terminaldagi ishlayapti degan satr faqat Express haqida. Bazaga ulanish birinchi so'rovda tekshiriladi. Xabar bo'sh bo'lsa, console error'ga butun xatoni bering. PostgreSQL'ni ishga tushirish: Windows'da Services, Mac'da Postgres.app.»
- Manba: `pg2-out/14-ulanish-xatolari.txt`, `15-postgres-ochiq-emas.txt` (sinovda port 5436 → ekranda 5432).

## 21 · Port band — «ishlayapti», lekin eski server  ← `Lesson`
- Kicker: `5-bosqich · buzamiz` · Sarlavha: **Ikkinchi `node server.js` ham «ishlayapti» deydi — javobni esa eski server beradi**
- Sahna: ikki terminal (1-oyna: eski server; 2-oyna: yangi `node server.js` → «Server 3000-portda ishlayapti», chiqish kodi 0); Postman — eski kod javobi; pastda Express manbasidan 3 satr.
1. **Sinfdagi eng chalkash holat: «kodni tuzatdim, hech narsa o'zgarmadi»**
   Ovoz: «Sinfdagi eng chalkash holat: o'quvchi kodni tuzatadi, serverni yana ishga tushiradi, lekin javob o'zgarmaydi. Sabab ko'pincha bitta: birinchi server boshqa terminalda hali ishlab turibdi.»
2. **Sinab ko'rdik: ikkinchi server ham «ishlayapti» deb yozdi va xato bermay chiqib ketdi**
   Ovoz: «Sinab ko'rdik. Birinchi server ishlab turganda ikkinchi oynada node server js. Kutganimiz port band degan xato edi. Haqiqatda ikkinchi server ham ishlayapti deb yozdi va xato bermay chiqib ketdi. So'rovlarga birinchi, eski server javob beradi.»
   ```
   $ node server.js   (ikkinchi oynada, birinchisi ishlab turibdi)
   Server 3000-portda ishlayapti
   [chiqish kodi: 0]
   ```
3. **Sabab Express 5 da: xato `listen` callback'iga beriladi, namunadagi callback uni o'qimaydi**
   Ovoz: «Sabab Express beshinchi versiyasida: listen xatoni callback'ga beradi. Gemini yozgan callback esa xatoni o'qimaydi, faqat ishlayapti deb chiqaradi. Bu namuna kodidagi kamchilik, Express'niki emas, lekin sinfda aynan shunday ko'rinadi.»
   Express manbasi: `server.once('error', done)` → `app.listen(3000, () => console.log('Server 3000-portda ishlayapti'))`
4. **Xulosa: bitta loyiha — bitta terminal; qayta ishga tushirishdan oldin `Ctrl+C`**
   Ovoz: «Xulosa: sinfda qoida qo'ying, bitta loyiha uchun bitta terminal. Qayta ishga tushirishdan oldin Ctrl C bilan eski serverni to'xtating. O'quvchi «o'zgarmadi» desa, birinchi savol: boshqa terminalda server ochiq qolmadimi?»
- Manba: `pg2-out/16-port-band.txt`; Express 5.3.0 `lib/application.js` (`app.listen`: `server.once('error', done)`).

## 22 · Tekshiruv 4 — qaysi satr 500 beradi  ← `LineCheck`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4 — qaysi satr xato?` · Sarlavha: **POST 500: `column "price" of relation "cars" does not exist`. Xato satrni toping**
- Shart (`task`): «Qoida: SQL'dagi ustun nomlari jadvaldagi bilan aynan bir xil bo'ladi — `cars`: `id, model, daily_price, year, is_rented`. Bu POST bo'lagida bitta satr jadvalda yo'q ustunni so'rayapti. **O'sha satrni bosing.**»
- Ovoz (`q`): «Buzishni ko'rdingiz, endi o'zingiz toping. To'rtinchi tekshiruv. Jadval ustunlarini eslang: id, model, daily price, year, is rented. Bu POST bo'lagida bitta satr jadvalda yo'q ustunni so'rayapti. O'sha satrni bosing.»
- Fayl: `server.js` (Explorer faol), POST bo'lagi (8 satr):
  ```js
  1  app.post('/api/cars', async (req, res) => {
  2    try {
  3      const { model, daily_price, year } = req.body;
  4      const result = await pool.query('INSERT INTO cars (model, price, year) VALUES ($1, $2, $3) RETURNING *', [model, daily_price, year]);   ← xato satr
  5      res.status(201).json(result.rows[0]);
  6    } catch (err) {
  7      res.status(500).json({ error: err.message });
  8    }
  ```
- Tuzatilgan (`fixed`): 4-satr `price` → `daily_price` (eski chizilgan, yangisi yashil); `fixedExtra`: Postman 201.
- To'g'ri (ovoz, `ok`): «To'g'ri. To'rtinchi satrda insert'da price yozilgan, jadvalda esa daily price. Uchinchi satrdagi daily price faqat JavaScript o'zgaruvchisi, baza uni ko'rmaydi, u SQL matnidagi nomni ko'radi. Ekranda tuzatilgan holat: daily price, POST ikki yuz bir. Demak, besh yuz chiqsa, SQL matnidagi har nomni jadval ustunlari bilan solishtiring.»
- Qisqa (`okShort`): «4-satr: SQL'da `price` — jadvalda `daily_price`. 3-satrdagi `daily_price` — JS o'zgaruvchisi, baza ko'rmaydi.»
- Maslahat (`hint`): «Baza JavaScript o'zgaruvchilarini ko'rmaydi — faqat qo'shtirnoq ichidagi SQL matnini. O'sha matndagi ustun nomlarini qidiring.»
- Manba: `pg2-out/12-price-xato.txt` (buzuq kod — `11-server.js` dan bitta so'z farq), `11-crud-sorovlar.txt` (201).

## 23 · Amaliyot 4 — o'zingiz buzing  ← `Practice`
- Kicker: `Amaliyot 4 / 4` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **Ikki buzish, ikki tuzatish — o'z serveringizda** · `tableAt: 3`
1. **Endi siz: o'z serveringizda ikkita xatoni ataylab chiqarasiz va tuzatasiz**
   Ovoz: «Oxirgi amaliyot: o'z serveringizda ikkita xatoni ataylab chiqarasiz va tuzatasiz. O'n daqiqa. Sinfda xuddi shu xatolar chiqqanda, ularni birinchi marta ko'rayotgan bo'lmaysiz.»
2. **1–2-qadam: `price` xatosi — 500, xabarni o'qing, tuzating, 201**
   Ovoz: «Birinchi qadamda insert'dagi daily price'ni price qilib, serverni qayta ishga tushirasiz va POST yuborasiz. Ikkinchisida xabarni o'qib, xatoni tuzatasiz va qayta ishga tushirasiz: javob ikki yuz bir bo'lishi kerak.»
3. **3–4-qadam: eski serverni yopmasdan yangisini yoqing; isbot — 500 xabarining matni**
   Ovoz: «Uchinchi qadamda birinchi server ishlab turganda ikkinchi terminalda yana node server js qilasiz va ishlayapti satrini ko'rasiz. To'rtinchisida ikkalasini ham Ctrl C bilan to'xtatasiz. Isbot maydoniga birinchi qadamdagi besh yuz xabarini nusxalang.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, sinfda bu ikki xato chiqqanda siz ularni birinchi marta ko'rayotgan bo'lmaysiz va xabardan sababini darhol topasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Buzish | `server.js`: `INSERT INTO cars (model, price, year)` · `Ctrl+C` · `node server.js` · Postman POST | 500 `column "price" of relation "cars" does not exist` |
  | 2 | Tuzatish | `price` → `daily_price` · `Ctrl+C` · `node server.js` · POST | 201 |
  | 3 | Ikki server | 1-terminal ishlab turibdi · 2-terminalda `node server.js` | ikkinchisi ham «Server 3000-portda ishlayapti» |
  | 4 | To'xtatish | ikkala terminalda `Ctrl+C` | Postman: `GET` — javob yo'q (server yo'q) |
- Isbot: «1-qadamdagi 500 xabari» · placeholder: «Postman'dagi error matnini qo'ying» · KOD: `/column\s+"?price"?\s+of relation\s+"?cars"?\s+does not exist/i`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 1-qadamda 201 | server qayta ishga tushmagan — eski kod ishlayapti (21-ekran) |
  | `column "price" does not exist` (`of relation`siz) | `SELECT`/`UPDATE`da xato qilingan — `INSERT`dagi ustunni o'zgartiring |
  | 3-qadamda `listen EADDRINUSE: address already in use :::3000` | sizning `server.js`ingizda callback xatoni o'qiydi (Gemini boshqacha yozgan) — bu yaxshi; ikkala terminalni ham to'xtating |
  | 4-qadamda javob bor | yana bir terminal ochiq qolgan — hammasini `Ctrl+C` |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `pg2-out/12`, `16`, `20-port-band-callback.txt` (xatoni o'qiydigan callback → `EADDRINUSE`, chiqish kodi 1).

---

## 24 · m4-06 xaritasi  ← `Lesson`
- Kicker: `6-bosqich · o'quvchi darsini o'tish` · Eyebrow: `m4-06 · «PostgreSQL so'rovlar — CRUD + AI bilan»` · Sarlavha: **m4-06: o'quvchi do'konni tugmalar bilan boshqaradi, amaliyotda — haqiqiy PostgreSQL terminalida**
- Sahna: 5 blok kartasi, har birida «Siz qo'shasiz».
  | Blok | O'quvchi ekranlari | Siz qo'shasiz |
  |---|---|---|
  | 1 Kirish | s0 «mahsulotlar qayerda saqlanadi?» → baza · s1 reja (5 qadam) | — |
  | 2 CRUD | s2 jadval chizmasi · s3 INSERT · s4 test · s5 SELECT · s5b test · s6 WHERE · s7 UPDATE (WHERE'siz ogohlantirish) · s8 DELETE · s9 test | javobdagi son (5-ekran) · `BEGIN … ROLLBACK` (8-ekran) · tartib va `ORDER BY` |
  | 3 Menejer navbati | s10 to'rt hodisa → to'g'ri buyruq | — |
  | 4 AI bilan | s11 vazifa → SQL → tekshirish · s12 test · s13 `users` jadvali · s14 AI xatosi `product` | `HINT` ham adashadi (11-ekran) |
  | 5 Yakun | s15 o'z INSERT'i · amaliyot: **VS Code yoki psql'da AI bilan o'z do'koni jadvali + CRUD** · kartochkalar · yakun | apostrof (11-ekran) · `NOT NULL` maslahati (12-ekran) |
1. **m4-06 da o'quvchi do'konni tugmalar bilan boshqaradi — amaliyotda esa haqiqiy PostgreSQL terminali**
   Ovoz: «Endi o'quvchi darslarini ko'ramiz. Birinchisi m4-06, unda yigirma bir ekran bor. Ko'p qismida o'quvchi do'konni tugmalar bilan boshqaradi: insert, select, where, update, delete. Lekin amaliyotda u haqiqiy PostgreSQL terminali yoki VS Code'da AI bilan o'z do'koni jadvalini yaratadi. Demak bu darsda PostgreSQL har kompyuterda ishlab turishi shart.»
2. **CRUD bloki — siz bugun qo'lda qilgan ish; har `UPDATE`da javobdagi sonni so'rang**
   Ovoz: «CRUD bloki siz bugun qo'lda qilgan ishning o'zi. Qo'shimcha gapingiz: javobdagi son va begin, rollback. O'quvchi where'siz update'ni faqat ogohlantirishda ko'radi, siz uni proyektorda xavfsiz ko'rsating.»
3. **AI bloki: o'quvchi AI yozgan SQL'ni tekshiradi — sizning misollaringiz `product` va noto'g'ri `HINT`**
   Ovoz: «AI bloki: o'quvchi AI yozgan SQL'ni tekshirishni o'rganadi, o'quvchi darsidagi misol product xatosi. Sizda yana bir misol bor: hint ham adashadi. Xulosa bitta: AI yozadi, o'quvchi tekshiradi.»
4. **Xulosa: amaliyot oldidan har kompyuterda PostgreSQL terminali ochilishini tekshiring; apostrof va `NOT NULL`ni ayting**
   Ovoz: «Xulosa: amaliyot oldidan har kompyuterda PostgreSQL terminali ochilishini tekshiring. O'quvchi o'z do'konini yaratayotganda ikki narsani ayting: so'z ichidagi apostrof ikki marta yoziladi, nom va narxga not null qo'yiladi. Vaqt, taklif: to'qson daqiqaning yigirma beshi amaliyotga.»
- Manba: `src/4-Modull/PostgresCrudLesson.jsx` — `SCREEN_META` (21), ekran matnlari, amaliyot topshirig'i («VS Code yoki psql'da AI bilan…»), `PRODUCTS`.

## 25 · m4-08 xaritasi va o'quvchi darsidagi farqlar  ← `Lesson`
- Kicker: `6-bosqich · o'quvchi darsini o'tish` · Eyebrow: `m4-08 · «Praktika: Backend CRUD — AvtoIjara»` · Sarlavha: **m4-08: jadval qo'lda, server Gemini bilan — darsdagi to'rt farqni oldindan biling**
- Sahna: 9 ekran kartasi (s0 · s1 · a1 jadval · a2 GET · a3 POST/PUT/DELETE · a4 AI xatosi · test · podium · yakun); 2–4-segmentda «farqlar» ro'yxati.
1. **m4-08 — to'qqiz ekran: jadvalni o'quvchi yozadi, serverni Gemini, Postman bilan sinaladi**
   Ovoz: «Ikkinchi dars m4-08, AvtoIjara, unda to'qqiz ekran bor. O'quvchi cars jadvalini PostgreSQL terminalida o'zi yozadi, server kodini Gemini'dan oladi, Postman bilan sinaydi va AI xatosini topadi. Siz bugun xuddi shuni qildingiz.»
2. **Farq 1: darsdagi xato matni qisqartirilgan; Farq 2: Gemini kodi har kimda boshqacha**
   Ovoz: «Darsdagi to'rt farqni oldindan biling. Birinchisi: xato matni darsda qisqaroq, haqiqiysida relation cars ham bor. Ikkinchisi: Gemini har o'quvchiga boshqacha kod yozadi. Topilmasa nima qaytishi, bitta yoki ikkita satr har xil bo'ladi. Promptdagi talablar bajarilganini tekshiring, satrma-satr bir xillikni emas.»
3. **Farq 3: `is_rented` — `null`; Farq 4: port band bo'lsa ham «ishlayapti»**
   Ovoz: «Uchinchisi: POST'dan keyin is rented null chiqadi, chunki u berilmaydi. To'rtinchisi: ikki terminalda ikki server ochilsa, xato chiqmaydi, eski server javob beradi. Ikkalasini ham o'quvchilarga oldindan ayting.»
4. **Xulosa: darsdan oldin — parol, Postman va bitta terminal qoidasi**
   Ovoz: «Xulosa: m4-08 dan oldin uch narsani tayyorlang. Sinf paroli hammaga ma'lum, Postman o'rnatilgan, va qoida: bitta loyiha, bitta terminal. Vaqt, taklif: to'qson daqiqaning qirqi server va Postman'ga, chunki eng ko'p qoqiladigan joy shu.»
- Manba: `src/4-Modull/BackendCrudPracticeLesson.jsx` — `SCREEN_META` (9), Gemini promptlari, xato `column "price" does not exist`; `pg2-out/11`, `12`, `16`.

## 26 · Sinfdagi holatlar va o'quvchi savollari  ← `Lesson`
- Kicker: `6-bosqich · sinfda` · Sarlavha: **Olti holat va tayyor javoblar**
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
  - «Nega mahsulot o'rni o'zgardi?» → `ORDER BY` yo'q — tartib kafolatlanmaydi; `ORDER BY id`.
  - «`$1` nima?» → qiymat alohida beriladi, SQL matniga kirmaydi; `1 OR 1=1` misoli.
  - «Postman shartmi?» → yo'q, so'rov yuboradigan istalgan dastur; darsda Postman, chunki sinf uchun qulay.
  - «NestJS'da ham shunday yozamizmi?» → yo'q: Nest'da Repository bu so'rovlarni o'zi yozadi (`find`, `save`…). Xavotir olmang: buni kursdagi keyingi mentor darslarida to'liq, kodi bilan o'rganasiz (M8-5).
  - «SQL katta harfda yozilishi shartmi?» → yo'q, kalit so'zlar kichik harfda ham ishlaydi; katta harf — o'qish oson bo'lishi uchun odat (sinab ko'rdik: `select name, price from PRODUCTS` ishladi).
1. **Sinfda albatta chiqadigan olti holat — hammasini bugun o'zingiz ko'rdingiz**
   Ovoz: «Ikki o'quvchi darsini bilasiz. Endi sinfda albatta chiqadigan oltita holatni ko'ramiz. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman.»
2. **Nom xatosi va apostrof — `\d` bilan solishtiring, apostrof ikki marta**
   Ovoz: «Birinchi holat jadval yoki ustun nomidagi xato: xabar ichidagi nomni teskari chiziqcha d bilan solishtiring, hint'ga ishonmang. Ikkinchisi apostrof: u ikki marta yoziladi.» · 1–2-karta
3. **`WHERE`'siz va ulanish xatolari — `BEGIN`, parol va bo'sh xabar**
   Ovoz: «Uchinchisi where'siz update yoki delete: uning oldi begin bilan olinadi. To'rtinchisi parol yoki baza nomidagi xato: uni Pool sozlamalarida qidiring. Beshinchisi: xabar bo'sh bo'lsa, console error'ga butun xatoni bering va PostgreSQL'ni tekshiring.» · 3–5-karta
4. **Xulosa: o'zgarmasa — ikkinchi terminal; avval xabarni o'quvchi bilan birga o'qing**
   Ovoz: «Oltinchisi: o'quvchi «o'zgarmadi» desa, ikkinchi terminalda eski server qolganini tekshiring. Xulosa va usul bitta: javobni darhol aytmang, xabarni o'quvchi bilan birga o'qing. Pastda o'quvchi savollariga tayyor javoblar bor.» · 6-karta + QA
- Manba: `pg2-out/03`, `05`, `14`, `15`, `16`, `17`.

## 27 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | `UPDATE products SET price = 99000;` — `WHERE` yo'q. Javob? | `UPDATE 1` · `ERROR` · `UPDATE 3` — hamma qator · `UPDATE 0` | 3 | `WHERE`'siz — jadvaldagi hamma qator. | 8 |
  | 2 | `BEGIN;` → `DELETE FROM products;` → `ROLLBACK;` → `SELECT *`. Natija? | Hamma mahsulot joyida · `(0 rows)` · Faqat birinchi qator · `ERROR` | 1 | `ROLLBACK` tranzaksiyani bekor qiladi. | 8 |
  | 3 | `WHERE id = 99` — bunday qator yo'q. `UPDATE` javobi? | `ERROR: not found` · `UPDATE 0` · `UPDATE 1` · `DELETE 0` | 2 | Mos qator yo'q — 0, xato emas. | 5 |
  | 4 | `VALUES ('O'yinchoq', 30000, 4)` → `syntax error`. Tuzatish? | `"O'yinchoq"` · `VARCHAR` qilish · Kirillda yozish · `'O''yinchoq'` | 4 | So'z ichidagi apostrof ikki marta. | 11 |
  | 5 | Express'da bazaga SQL nima bilan yuboriladi? | `pool.query(sql, [qiymatlar])` · `res.json` · `app.listen` · `console.log` | 1 | `Pool` — server bazaga shu yo'l bilan ulanadi. | 14 |
  | 6 | Server «ishlayapti», GET ishlaydi, POST — `Cannot destructure property 'model' of 'req.body'`. Sabab? | Parol xato · `app.use(express.json())` yo'q · Jadval yo'q · Port band | 2 | `req.body` o'qilmagan. | 19 |
  | 7 | POST 500, `{"error":""}`, terminalda bo'sh qator. Birinchi qadam? | Serverni o'chirish · Gemini'dan yangi kod · `console.error(err)` — butun xatoni ko'rish · `npm install` | 3 | Bo'sh xabar — `ECONNREFUSED` yashiringan. | 20 |
  | 8 | O'quvchi: «Kodni tuzatdim, `node server.js` qildim — javob o'zgarmadi». Birinchi savolingiz? | Gemini'dan qayta so'radingmi? · Bazani o'chirdingmi? · Postman yangilandimi? · Boshqa terminalda server ochiq qolmadimi? | 4 | Express 5 da ikkinchi server ham «ishlayapti» deydi. | 21 |
- `passed = ball ≥ 6 && 4 amaliyot isbot bilan`.

## 28 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13.
- Xulosa 6 band:
  1. CRUD = `INSERT` · `SELECT` · `UPDATE` · `DELETE`; javobdagi son — nechta qator tegildi; `ORDER BY`siz tartib kafolatlanmaydi.
  2. `WHERE`'siz — hamma qator; xavfli so'rov `BEGIN … ROLLBACK` ichida sinaladi.
  3. Xatolar: nom (`\d`), apostrof (`''`), son o'rniga matn; `NOT NULL` yo'q — baza qo'riqlamaydi.
  4. Express: `Pool` → `pool.query(sql, [$1…])` → `rows` → `res.json`; 200 · 201 · 404 · 500.
  5. Server xatolari: ustun nomi · `express.json()` · parol/baza birinchi so'rovda · bo'sh xabar → `console.error(err)` · ikkinchi server «ishlayapti».
  6. Sinf: m4-06 amaliyoti haqiqiy psql'da; m4-08 dan oldin parol, Postman, bitta terminal.
- **Uyga vazifa** (M14): «O'z do'koningiz uchun shop-api: schema faylida o'z jadvalingiz, not null bilan. Server js'da to'rt endpoint, hamma qiymat dollar bir bilan, topilmasa to'rt yuz to'rt. README'da har endpoint uchun bitta so'rov va uning javobi. Bir marta where'siz update'ni begin ichida sinab, rollback qiling va natijani README'ga yozing. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Jadval | `schema.sql`: o'z do'koni jadvali, `NOT NULL` (nom, narx) · `psql -U postgres -d <baza> -f schema.sql` | `CREATE TABLE` |
  | 2 | Server | `server.js`: GET · POST (201, `RETURNING *`) · PUT · DELETE (`rowCount` → 404), `$1` | `node server.js` |
  | 3 | Sinov | Postman: 4 so'rov + yo'q `id` | 200 · 201 · 200 · 200 · 404 |
  | 4 | Xavfsiz sinash | psql: `BEGIN` → WHERE'siz `UPDATE` → `SELECT` → `ROLLBACK` | README'da `UPDATE n` va `ROLLBACK` |
  | 5 | Topshirish | `git add . && git commit -m "shop-api"` · `git push` → repo linki platformadagi uyga vazifaga (M30) | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi qaraydi: `NOT NULL` · `$1` (yopishtirish yo'q) · 404 · README'da 5 so'rov va `ROLLBACK`.
- **Eslatma:** CRUD va javobdagi son · `WHERE` · `BEGIN … ROLLBACK` · `ORDER BY` · xatolar jadvali (SQL) · Express yo'li va status jadvali · `$1` misoli · server xatolari jadvali · m4-06 va m4-08 tayyorgarligi · o'z uyga vazifangiz.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **NestJS arxitekturasi — Module, Controller, Service** — Express'dagi shu CRUD Nest'da qanday tartib bilan yoziladi».

---

## «KOD» — qurishda
1. PG-1 dvigateli va yordamchilari (`psql()`, `Psql`, `MiniTable`, generator) — PG-2 o'z bo'laklarida nusxa (dvigatelga tegmay); generator `dev/pg2-matn.py`.
2. Express sahnasi: `Ide` `root: 'avto-ijara-server'`, fayllar `node_modules/` · `package.json` · `server.js`; Postman kartasi — `Browser` emas, alohida karta (method rangli, status rangli, belgi «haqiqiy javob»).
3. Chiqishlar `pg2-out/` dan aynan; port 5436 → 5432; `15` dagi uzun yo'llar qisqartiriladi.
4. LineCheck (22-ekran): MD'dagi 4-satr → `target={3}`.
5. **✅ 01.11 yurgizildi** (`drive-pg2.sh` 18–20 → `pg2-out/18…20`; bitta tuzatish: 18-ekrandagi `id` 6 emas, 5). Avvalgi ro'yxat: `permission denied` (6-ekran izohi — yurgizilmasa izoh qayta yoziladi) · `ROLLBACK` `BEGIN`siz → `WARNING: there is no transaction in progress` (10-ekran) · qo'shtirnoqli `"O'yinchoq"` xatosi (13-ekran) · tuzatilgan `price` kod bilan POST 201 (18-ekran `id`) · kichik harfli `select * from PRODUCTS` (26-ekran QA) · `EADDRINUSE` xatoni o'qiydigan callback bilan (23-ekran).
6. Isbotlar: 6 — `/^\s*\(?\s*3\b/` · 9 — `/^\s*99\s?000\s*$/` · 16 — `/^\s*201\b/` · 22 — `/column\s+"?price"?\s+of relation\s+"?cars"?\s+does not exist/i`.

## Ochiq savollar ([GATE M])
1. Ikki o'quvchi darsi bitta mentor darsida (PRD Q1) — taklif: ha.
2. Postman maketi + curl natijasi (PRD Q2) — taklif: shunday.
3. 21-ekran (port band) — Express 5 ning xususiyati; o'quvchi darsiga bir satr qo'shilsinmi (m4-08: «qayta ishga tushirishdan oldin Ctrl+C»)? — alohida qaror.
4. 12-ekran — o'quvchi darsidagi `products` jadvalida `NOT NULL` yo'qligi: o'quvchi darsini o'zgartirmaymiz, mentor aytadi — tasdiqlang.

## O'quvchi darslari uchun alohida ish (qaror kerak; tegilmadi)
1. **m4-08** a4: xato matni `column "price" does not exist` — haqiqiysi `column "price" of relation "cars" does not exist`.
2. **m4-08**: port band holati (Express 5) — «Ctrl+C» eslatmasi yo'q.
3. **m4-06** s13: `users` jadvali «bazada bor» deb ko'rsatiladi — o'quvchi bazasida yo'q.
