# 4-Modul m4-08 «Praktika: Backend CRUD — AvtoIjara» — yakuniy matn

Fayl: `src/4-Modull/BackendCrudPracticeLesson.jsx` · **9 ekran** · Oldingi: «Sinfdoshingiz sahifangizni ochsa, nimani ko'radi?» (m4-07, PM) · Keyingi: «API va Postman — front backend bilan qanday gaplashadi» (m4-09)
⚠️ Ochiq (nazorat): praktika Postman maketini ishlatadi, Postman darsi (m4-09) esa undan KEYIN — m4-08 ↔ m4-09 almashtirish `NAZORAT-TOPSHIRIQ-m4-tartib.md` (App.jsx + mentor/lessons.jsx; LMS — foydalanuvchi). 212-qonun.
Ip: `avto-ijara-server` (Node.js + Express + pg) — m3-12 AvtoIjara'ning backendi; Chevrolet/Kia, so'mda (m4-10 da shu server frontga ulanadi) · AI: Gemini (Antigravity olindi)
Holat: 2026-10-17 — kodga mos (F-1015-348 → 352 → 370…372 → 381 → 382…385 dan keyin; foydalanuvchi «zo'r bo'pti … yopsang bo'ladi», tasdiq). `lessonId` = `backend-crud-practice-p1-v18` (o'zgarmagan; total 8 → 9 — saqlangan holat tozalanadi)
Zaxira: 19 ekranli — `arxiv/F-1015-backendcrud-oldin/` · 8 ekranli — `arxiv/F-1015-382-oldin/`. Qurish: `qurish/f348.py` → … → `f382.py` + `f382-ekranlar.jsx` (joyida).

## 0 · Kirish
- Sarlavha: Saytdagi mashinalar ro'yxatini nega **o'zgartirib bo'lmaydi**?
- Mentor: Mana Modul 3'da qurgan **AvtoIjara** saytingiz. Lekin mashinalar ro'yxati `App.jsx` faylining **ichiga to'g'ridan-to'g'ri yozib qo'yilgan** — hech qayerda saqlanmagan. Yangi mashina **qo'shmoqchi** bo'lib ko'ring yoki bittasini **o'chiring** — nima sezasiz?
- Chapda (⛶ faqat shu vizual — 214): «localhost:5173 — AvtoIjara» (Cobalt · Malibu · Kia K5, «+ Mashina qo'shish», ✕) · `const cars = [ { nom: "Cobalt", ... }, ... ];` `// ↑ ro'yxat kod ichida — bazada saqlanmagan` · bosilsa: «Tugma bor — lekin hech narsa o'zgarmadi.»
- O'ngda «Haqiqiy AvtoIjara ilovasiga faqat ko'rsatish yetarli emas. Yana nima kerak?» (ballsiz): Hech narsa — ko'rsatgani yetadi · ✔ Ma'lumot doimiy saqlanadigan joy — server va baza · Ko'proq rang va animatsiya
- Javob (216-qonun, F-1015-394): hech narsa → «Yangilasangiz, o'zgarish yo'qoladi.» · server va baza → «Aynan!» · rang → «Rang emas — ma'lumot saqlanmayapti.» + «Bugun ma'lumotni bazada saqlaydigan backend quramiz.»

## 1 · Reja
- Sarlavha: Bugun AvtoIjara **backendini** qurasiz. (F-1015-383: «bazada yashaydi» olindi)
- Mentor: Bugun AvtoIjara'ning orqa qismini qurasiz: **cars jadvali** PostgreSQL'da, **Express server** esa unga `pool.query` orqali so'rov yuboradi. Jadvalni o'zingiz yozasiz, serverni Gemini bilan.
- «Avval tayyorlaning · 3 qadam ▾» (oyna): 1. Ish stolida `avto-ijara-server` papkasini yarating, VS Code'da oching. Terminalda: `npm init -y` va `npm install express pg`. · 2. PostgreSQL ishlayotganini tekshiring: terminalda `psql -U postgres` ochiladimi? (SQL darsidagidek) · 3. Boshqa oynada gemini.google.com'ni oching.
- Chapda «Dars oxirida · server javobi» — Postman `GET localhost:3000/api/cars` → `● 200 OK` + ixcham JSON (har mashina bitta satr).
- O'ngda «So'rov yo'li»: Postman → Express → pool.query → PostgreSQL · «Bugungi 4 blok»: 01 cars jadvali (o'zingiz · psql) · 02 Server va o'qish — GET (Gemini) · 03 Yozish — POST, PUT, DELETE (Gemini) · 04 AI xatosini topish (siz)

## 2 · Amaliyot 1 · AI'siz — cars jadvali
- Sarlavha: **cars** jadvalini o'zingiz yozing.
- Mentor: AI kod yozishidan oldin siz qaror qilasiz: mashina haqida nimani saqlaymiz? Ustunlarni tanlang — SQL o'zi yig'iladi. `id` har doim bor: u har mashinaning takrorlanmas raqami.
- Chapda «Ustunlar»: ✓ id — SERIAL PRIMARY KEY · ✓ nom — mashina nomi · ✓ narx — kunlik narx, so'm · + yil — ishlab chiqarilgan yili · + bandmi — ijarada yoki bo'sh (nom/narx olib bo'lmaydi: «‹narx›siz mashinani ijaraga berib bo'lmaydi — bu ustun shart.») · `cars · 3 qator` jadvali.
- O'ngda «SQL · psql uchun» + «Nusxalash» (tanlangan ustunlar bilan `CREATE TABLE cars (…)` · `INSERT INTO cars (…) VALUES …` · `SELECT * FROM cars;`) · «Qadamlar · 4» (oyna, F-1015-384): Terminalda: `psql -U postgres` (parol — PostgreSQL o'rnatilganda berilgan). · `CREATE DATABASE avtoijara;` keyin `\c avtoijara` — bazaga ulanasiz. · «Nusxalash» → SQL'ni psql'ga qo'ying, Enter. · Oxirgi `SELECT` 3 ta mashinani ko'rsatdimi?
- Nishon «Blueprint!».

## 3 · Amaliyot 2 · Gemini — Server va o'qish
- Sarlavha: Server va **o'qish**.
- Mentor: Server bazaga `Pool` orqali ulanadi. Birinchi endpoint — `GET /api/cars`: ichida `pool.query` SQL'ni bazaga olib boradi va qatorlarni qaytaradi. (bosishda yig'iladi)
- Chapda «Postman · so'rov yuboring» — `GET localhost:3000/api/cars` · Send → `● 200 OK` + ixcham JSON · `cars · 3 qator` · «Tekshiring»: `node server.js` xatosiz ishga tushdimi? · Brauzerda localhost:3000/api/cars — 3 ta mashina chiqdimi?
- O'ngda **Prompt** (yig'iq karta — birinchi qator + «Ko'rish» oynada + «Promptni nusxalash», 215-qonun):
```
Node.js + Express loyiham (avto-ijara-server) bor, express va pg o'rnatilgan. PostgreSQL'da avtoijara bazasida cars jadvali bor.
server.js yoz:
1. pg'dan Pool bilan bazaga ulan (user, password, database: avtoijara — tepada o'zgaruvchilarda, parolni o'zim yozaman).
2. GET /api/cars — SELECT * FROM cars, natijani res.json bilan qaytar. Xato bo'lsa status 500 va xato matni.
Port 3000. Har bo'limga qisqa izoh yoz. Faylni to'liq yoz.
```
  «Qadamlar · 4»: Chapda GET'ni yuboring — javob jadvaldagi qatorlarning o'zi. · «Promptni nusxalash» → gemini.google.com; javobni `server.js` ga qo'ying, parolni yozing, `Ctrl+S`. · Terminalda `node server.js` — server ishga tushdi. · «Tekshiring» ro'yxatini o'ting.
  «server.js · oxirgi so'rov»: `pool.query('SELECT * FROM cars')` · `// cars: 3 qator` (Send da yonadi)

## 4 · Amaliyot 3 · Gemini — Qo'shish, o'zgartirish va o'chirish
- Sarlavha: Qo'shish, o'zgartirish va **o'chirish**.
- Mentor: `POST` qo'shadi, `PUT` o'zgartiradi, `DELETE` o'chiradi. Qiymatlar SQL matniga yopishtirilmaydi — `$1, $2` bilan beriladi.
- Chapda Postman: POST · PUT · DELETE (POST tanasi `{ "nom": "Chevrolet Spark", "narx": 190000, "yil": 2021 }` → 201 Created; PUT `/api/cars/2` `{ "narx": 480000 }`; DELETE `/api/cars/1`, ikkinchi marta → 404) · jadval (5 qatordan ko'p bo'lsa: 3 qator + «… yana N qator» + oxirgisi) · «Tekshiring»: POST'dan keyin psql'da `SELECT * FROM cars;` — yangi mashina bormi? · PUT'dan keyin o'sha mashinaning narxi o'zgardimi? · DELETE'dan keyin o'sha qator yo'qoldimi?
- O'ngda **Prompt** (yig'iq):
```
server.js ga yozish endpointlarini qo'sh (kodim pastda):
1. app.use(express.json()).
2. POST /api/cars — req.body dan nom, narx, yil; INSERT ... VALUES ($1, $2, $3) RETURNING *, status 201.
3. PUT /api/cars/:id — narxni yangilasin: UPDATE ... SET narx = $1 WHERE id = $2.
4. DELETE /api/cars/:id — shu mashinani o'chirsin.
Qiymatlarni SQL matniga yopishtirma — faqat $1, $2 bilan. O'zgargan faylni to'liq qaytar.
Mana kodim:
{server.js kodini shu yerga qo'ying}
```
  «Qadamlar · 4»: Chapda POST, PUT va DELETE'ni yuboring — jadval qanday o'zgarishini ko'ring. · «Promptni nusxalash» → gemini.google.com, oxiriga `server.js` kodini qo'shing; javobni almashtiring, `Ctrl+S`. · Serverni qayta ishga tushiring: `Ctrl+C`, keyin `node server.js`. · Postman'da uchala so'rovni yuboring va «Tekshiring» ro'yxatini o'ting.
  Kod oynasi: `pool.query('INSERT INTO cars (nom, narx, yil) VALUES ($1, $2, $3) RETURNING *', [nom, narx, yil])` · `UPDATE cars SET narx = $1 WHERE id = $2 …` · `DELETE FROM cars WHERE id = $1` · `// cars: N qator`
- Nishon «Director's Cut!».

## 5 · Amaliyot 4 · AI xatosi
- Sarlavha: Server xato qaytardi — bu bizga **nimani aytmoqchi**?
- Mentor: POST yuborganda server **500** qaytardi: *column "price" does not exist*. Bunday xatolar — kod yozishning **tabiiy qismi**; hatto AI ham adashishi mumkin, shuning uchun biz doim tekshiramiz. Eng yaxshisi: xato matni nima noto'g'ri ekanini **o'zi aytib beradi** — uni diqqat bilan o'qing. Qaysi qatorda shu nom xato? Bosing.
- AI kodi: `const { nom, narx, yil } = req.body;` · ✔ `pool.query('INSERT INTO cars (nom, price, yil)...');` · `res.json({ status: "qo'shildi" });` · «Server javobi»: `POST localhost:3000/api/cars` → `● 500 Server Error` `{ "error": "column \"price\" does not exist" }` → tuzatilgach 201.
- Nishon «Nice Catch!».

## 6 · Test (yagona ballik)
- «To'g'ri javobni tanlang» · **Express ichida bazaga SQL yuborish uchun?** ✔ A `pool.query('...')` · B `res.send(...)` · C `app.listen(3000, callback)` · D `console.log(...)`
- Xato javobda «📖 Eslatma» → **«Ko'prik va xavfsizlik»**: pool.query — ko'prik · $1, $2 — xavfsiz o'rin · :id + WHERE id=$1 (RECAPS 6; F-1015-384 — eski kalit «O'qish — GET» chiqardi, tuzatildi).
- Nishon «Ship It!» · podium yorlig'i «1 — Ko'prik (pool)».

## 7 · Podium · 8 · Yakun
- «✓ Birinchi backend'ingiz tayyor» · «N/1 to'g'ri» · AvtoIjara backend'ini o'zingiz qurdingiz.
- «Endi siz bilasiz»: Sxemani siz loyihalaysiz: `CREATE TABLE cars (id SERIAL PRIMARY KEY, ...)` · Express bazaga `pool.query` orqali ulanadi — ko'prik · CRUD ↔ HTTP ↔ SQL: GET/SELECT · POST/INSERT · PUT/UPDATE · DELETE/DELETE · Aniq qator: `:id` manzilda + `WHERE id = $1` bazada · Xavfsizlik: qiymatlar `$1, $2` o'rinlariga qo'yiladi — SQL'ga yopishtirilmaydi
- Uyga vazifa (VS Code'da, `avto-ijara-server` loyihangizda): O'z jadvalingiz — AvtoIjara'ga 'rang' yoki 'transmissiya' ustunini qo'shing (ALTER TABLE) · Bitta mashina — `GET /api/cars/:id` endpointini qo'shing: topilmasa 404 qaytarsin · Postman test — har endpointni o'zingiz sinang: status kod to'g'rimi (200/201)? · «🚀 Backend tayyor, lekin u hozircha yolg'iz. Keyingi praktikada Modul 3'dagi React frontni aynan shu serverga ulaymiz — to'liq fullstack!»
- Nishonlar (4): Blueprint! · Director's Cut! · Nice Catch! · Ship It!

## Sinov (17.10)
gates 10/12 (tell 5, emoji 1 — oldin ham) · `tekshir-m408` (9 ekranga qayta yozilgan) 39/39 · `ru-m408` 9/9 · `f385-ru` (2 prompt oynasi, ru) ✓ · tekislik 0 px · `f374-nan` 0 · matn `sinov/uz-matn-umumiy.mjs` (prompt oynasi bilan).
