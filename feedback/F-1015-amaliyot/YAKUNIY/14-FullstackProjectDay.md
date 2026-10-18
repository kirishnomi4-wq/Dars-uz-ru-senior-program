# 4-Modul m4-13 «Praktika: Loyiha kuni — AvtoStoyanka» — yakuniy matn

Fayl: `src/4-Modull/FullstackProjectDayLesson.jsx` · 9 ekran · Oldingi: «Ilova nimani yozib qoladi?» (m4-12, PM) · Keyingi: «Praktika: Feedback bilan yaxshilash — AvtoStoyanka» (m4-14)
Ip: AvtoStoyanka — yangi loyiha (AvtoIjara'dan keyin): 8 joy (A1…B4), qorovul paneli, to'lov 10 000 so'm · AI: Gemini (a2, a3); baza va JOIN — o'zingiz
Holat: 2026-10-17 23:1x — kodga mos (F-1015-350 tungi qurish → 385 yig'iq prompt → 392 kirish javobi + a1 Qadamlar oynasi; foydalanuvchi «manga yoqdi m4-13», tasdiq). `lessonId` = `fullstack-projectday-p3-v18` (o'zgarmagan). «Mustaqil ish» QO'SHILMAGAN (foydalanuvchi: 75–90 daqiqa yetadi).
Zaxira: `arxiv/F-1015-fullstackprojectday-oldin/` (350 dan oldin, 25 ekran) · `arxiv/F-1015-386-oldin/` (392 dan oldin). Qurish: `qurish/f350.py` + `f350-blok.jsx` → 385 → 392 (joyida).

## 0 · Kirish (hook, ballsiz)
- Sarlavha: Qorovul qaysi joy bo'shligini **qog'ozda** kuzatib bo'ladimi?
- Mentor: Tasavvur qiling: siz **qorovulsiz**. Mashinalar kirib-chiqyapti, siz hammasini qog'ozga yozyapsiz. Bitta joyga ikki mashina yozilib qolyapti, kim to'laganini esdan chiqaryapsiz. Qog'ozni bosib ko'ring — u yordam beradimi?
- Chapda «Qorovulning qog'ozi» (bosiladi, silkinadi): A2 — 01A123BC — to'ladi? ... · B1 — 01B456DE — ✎ o'chirilgan · ?? — 30K500AA — qaysi joy? · A2 — yana?! ikki marta? · «— qaysi joy bo'sh??? —». Bosilgach: «Qog'oz chalkash — qaysi joy bo'sh, kim to'ladi, bilib bo'lmaydi!»
- O'ngda savol «Qorovulga eng ko'p nima yordam beradi?» (qog'oz bosilgach ochiladi):
  Yana bir qog'oz va ikkinchi qorovul — ikkalasi yozsin · ✔ Bo'sh/band joyni bir qarashda ko'rsatadigan ilova · Joylarni kamaytirish — 8 emas, 4 ta qolsin
- Javob (216-qonun, ≤120 belgi): a «Ikkinchi yozuvchi — ikki baravar chalkashlik.» · b «Aynan!» · c «Joy kamaysa — pul ham kamayadi.» + «Bugun qorovul uchun panel quramiz: bo'sh joy — yashil, band — qizil.»
- Tugma «Davom etish».

## 1 · Reja
- Sarlavha: Qorovul uchun **stoyanka paneli**.
- Mentor: Loyiha kuni: AvtoIjara'da o'rganganingizni yangi loyihada qo'llaysiz. Qorovul bir qarashda ko'rishi kerak: qaysi joy bo'sh, qaysi band va bugun qancha pul yig'ildi. **Baza, server va panel** — hammasini bugun yig'asiz.
- «Avval tayyorlaning · 3 qadam ▾» (oyna): 1. Ikki papka: `avto-stoyanka-server` (`npm init -y`, `npm install express pg cors`) va `avto-stoyanka` (`npm create vite@latest avto-stoyanka`, React). · 2. PostgreSQL ishlayotganini tekshiring: `psql -U postgres` ochiladimi? · 3. Boshqa oynada gemini.google.com'ni oching. · «Tayyor bo'lsa — «Boshlaymiz».»
- Chapda «Dars oxirida · qorovul paneli»: 8 joy (A2, B1 band — qizil; qolgani yashil), tushum 30 000.
- O'ngda «Ikki jadval — bitta bog'lanish»: `joylar` — A1…B4, bo'sh yoki band · `sessiyalar` — kim, qachon, qancha — joy_id orqali. «Bugungi 4 blok»: 01 Baza: 2 jadval (o'zingiz · psql) · 02 Server: kirish va chiqish (Gemini) · 03 Qorovul paneli (Gemini) · 04 Tarix: JOIN (o'zingiz).
- Tugma «Boshlaymiz».

## 2 · Amaliyot 1 · AI'siz — baza (a1)
- Sarlavha: Bazani — **ikki jadvalni** — yozing.
- Mentor: Bitta joyda kun bo'yi ko'p mashina turadi — bu «bitta → ko'p». `sessiyalar.joy_id` har yozuvni o'z joyiga bog'laydi (`REFERENCES joylar(id)`). Joyni bosing — uning sessiyalari chiqadi.
- Chapda: qorovul paneli (joyni bosish = tanlash) · jadval `sessiyalar` (id, joy_id, mashina, tolov — tanlangan joy qatorlari yoritiladi; 4 qator: A2 ×2, B1, A1) · kod oynasi: `SELECT * FROM sessiyalar WHERE joy_id = 2;` + `// A2 (id 2) — 2 ta sessiya`.
- O'ngda «SQL · psql uchun» + «Nusxalash»:
```
CREATE TABLE joylar (id SERIAL PRIMARY KEY, raqam TEXT, bandmi BOOLEAN DEFAULT false);
CREATE TABLE sessiyalar (id SERIAL PRIMARY KEY, joy_id INTEGER REFERENCES joylar(id), mashina TEXT, kirgan TIMESTAMP DEFAULT now(), chiqqan TIMESTAMP, tolov INTEGER);
INSERT INTO joylar (raqam) VALUES ('A1'), ('A2'), ('A3'), ('A4'), ('B1'), ('B2'), ('B3'), ('B4');
SELECT * FROM joylar;
```
- «Qadamlar · 4 ▾» (oyna, F-1015-392): 1. Terminalda: `psql -U postgres`, keyin `CREATE DATABASE stoyanka;` va `\c stoyanka`. · 2. «Nusxalash» → SQL'ni psql'ga qo'ying, Enter. · 3. Oxirgi `SELECT` 8 ta joyni ko'rsatdimi? · 4. Sinab ko'ring: `INSERT INTO sessiyalar (joy_id, mashina) VALUES (99, 'X');` — baza rad etadimi? (99-joy yo'q)
- «Davom etish»da nishon «Schema Master!» 🏗️.

## 3 · Amaliyot 2 · Gemini — server (a2)
- Sarlavha: Server: **kirish va chiqish**.
- Mentor: Har amal ikki jadvalga tegadi: kirishda joy band bo'ladi va yangi sessiya yoziladi, chiqishda joy bo'shaydi va sessiyaga to'lov yoziladi. Joylarni bosing — kod oynasida ikkala SQL'ni ko'rasiz.
- Chapda: qorovul paneli (bo'sh joy bosilsa — mashina kiradi, band joy bosilsa — chiqadi, tushum +10 000) · kod oynasi: kirishda `UPDATE joylar SET bandmi = true WHERE id = N;` + `INSERT INTO sessiyalar (joy_id, mashina) VALUES (N, '…');`; chiqishda `UPDATE joylar SET bandmi = false …` + `UPDATE sessiyalar SET chiqqan = now(), tolov = 10000 WHERE joy_id = N AND chiqqan IS NULL;`.
- O'ngda PromptKarta («Ko'rish» — oyna, «Promptni nusxalash»):
```
Node.js + Express loyiham (avto-stoyanka-server): express, pg va cors o'rnatilgan. PostgreSQL'da stoyanka bazasi: joylar (id, raqam, bandmi) va sessiyalar (id, joy_id → joylar.id, mashina, kirgan, chiqqan, tolov).
server.js yoz (Pool, express.json, cors, port 3000):
1. GET /api/joylar — hamma joylar, id tartibida.
2. POST /api/kirish — body: { joy_id, mashina }. Joy bandmi = true bo'lsin va sessiyalarga yangi qator qo'shilsin.
3. PUT /api/chiqish/:joy_id — joy bandmi = false; shu joyning ochiq sessiyasiga (chiqqan IS NULL) chiqqan = now() va tolov = 10000 yozilsin.
4. GET /api/tushum — bugungi tolov yig'indisi (SUM).
Qiymatlar faqat $1, $2 bilan. Xato bo'lsa status 500. Har bo'limga qisqa izoh yoz. Faylni to'liq yoz.
```
- «Qadamlar · 4 ▾»: 1. Chapda bo'sh joyni bosing (kirish), keyin band joyni (chiqish) — kod oynasida ikkala SQL'ni ko'ring. · 2. «Promptni nusxalash» → gemini.google.com; javobni `server.js` ga qo'ying, parolni yozing, `Ctrl+S`. · 3. `node server.js`; brauzerda localhost:3000/api/joylar — 8 ta joy chiqdimi? · 4. Postman'da POST /api/kirish va PUT /api/chiqish/2 ni yuboring, keyin /api/tushum ni oching.

## 4 · Amaliyot 3 · Gemini — qorovul paneli (a3)
- Sarlavha: Qorovul **paneli**.
- Mentor: Qorovul kod ko'rmaydi — unga katta, rangli panel kerak. Bo'sh joyni bosing va mashina raqamini yozing, band joyni bosib chiqaring: panel serverga `fetch` yuboradi va qayta yuklanadi.
- Chapda: qorovul paneli (tushum 20 000) · bo'sh joy tanlansa forma «A3 · mashina raqami» (placeholder 01A123BC) + «Kirgizish»; band joy tanlansa «A2 · 01A123BC» + «Chiqarish · 10 000 so'm» · kod oynasi: `fetch('http://localhost:3000/api/joylar')` → `fetch('/api/kirish', { method: 'POST', body: … })` / `fetch('/api/chiqish/N', { method: 'PUT' })` + `// bo'sh: 6, band: 2, tushum: 20000`.
- O'ngda PromptKarta:
```
Vite + React loyiham (avto-stoyanka) uchun qorovul paneli qur. Server: http://localhost:3000.
1. Sahifa ochilganda GET /api/joylar va GET /api/tushum ni fetch qilsin.
2. Joylar to'ri: har joy katta kartochka — bo'sh bo'lsa yashil «BO'SH», band bo'lsa qizil «BAND» va mashina raqami.
3. Bo'sh joy bosilsa — mashina raqami yoziladigan kichik forma; «Kirgizish» POST /api/kirish ga { joy_id, mashina } yuborsin.
4. Band joy bosilsa — «Chiqarish» tugmasi; PUT /api/chiqish/:joy_id.
5. Har amaldan keyin joylar va tushum qayta yuklansin. Tepada: bo'sh va band soni, bugungi tushum.
Qorovul uchun: katta yozuv, kam matn, rang bilan tushunarli. Har bo'limga qisqa izoh yoz. Barcha fayllarni to'liq yoz.
```
- «Qadamlar · 4 ▾»: 1. Chapdagi panelda mashina kirgizing va chiqaring — qorovul ko'radigan hamma narsa shu. · 2. «Promptni nusxalash» → gemini.google.com; fayllarni `avto-stoyanka/src` ga qo'ying, `npm run dev`. · 3. Server ham ishlab turishi kerak (`node server.js`) — CORS'ni eslang. · 4. Mashina kirgizib-chiqaring: rang, soni va tushum o'zgaradimi? F5 dan keyin ham saqlanadimi?
- «Davom etish»da nishon «Wired Up!» 🔌.

## 5 · Amaliyot 4 · JOIN (s12, o'zingiz)
- Sarlavha: Qorovul **kunlik tarix**ni ochdi — lekin joy "2" deb chiqyapti, A2 qayerda?
- Mentor: Qorovul kunlik tarixni ko'rmoqchi: kim, qaysi joy, qancha. Lekin sessiyalarda faqat `joy_id` bor (mas. 2) — joy belgisi (**A2**) esa `joylar` jadvalida. **JOIN** ikki jadvalni `joy_id = id` bo'yicha birlashtiradi — shunda tarix o'qiladigan bo'ladi.
- Chapda «sessiyalar — joy_id raqam» (joy_id, mashina, tolov) → bosilgach silliq almashadi «JOIN natijasi — o'qiladi» (`sessiyalar JOIN joylar`: raqam A2/A2/B1/A1, mashina, tolov).
- O'ngda kod: `SELECT raqam, mashina, tolov FROM sessiyalar JOIN joylar ON sessiyalar.joy_id = joylar.id;` · tugma «▶ JOIN bilan birlashtirish» → «Endi **A2** ko'rinadi! JOIN `joy_id` va `id` ni moslab, ikki jadvaldan birga ma'lumot oldi. Bog'lanish shuning uchun kerak edi.»
- Tugma: «JOIN bilan birlashtiring» (bosilmagan) → «Davom etish». Nishon «Join Champ!» 🔗. Eslatma (RECAPS 6): «JOIN — ikki jadvalni birlashtirish» 3 karta.

## 6 · Yakuniy · amaliy (s16, ballik, final)
- Sarlavha: Oxirgi qadam: **bog'lanish** shartini o'zingiz yozing.
- Mentor: Tarixni o'qiladigan qilish uchun JOIN kerak — ikki jadval **qaysi ustunlar bo'yicha** bog'lanadi? `ON` dan keyin shu ikki ustunni tenglang.
- Chapda VS Code `tarix.sql`: 1 `SELECT raqam, mashina, tolov` · 2 `FROM sessiyalar` · 3 `JOIN joylar` · 4 `ON` [kiritish maydoni, placeholder `jadval.ustun = jadval.ustun`]. Holat-teglar: «1 sessiyalar — bog'lovchi ustun» · «2 joylar — asosiy kalit» (✓ bo'ladi). To'g'ri (`sessiyalar.joy_id = joylar.id`, teskarisi va s./j. qisqartmalar ham): «✓ Mukammal! Ikki jadval bog'landi — tarix endi joy belgisi bilan o'qiladi. Loyihangiz to'liq tayyor!»
- O'ngda (javobdan keyin) «natija — tarix»: `sessiyalar JOIN joylar` — A2 · 01A123BC · 10 000 / B1 · 01B456DE · 10 000.
- Tugma: «Bog'lanish shartini yozing» → «Davom etish». Nishon «Grand Opening!» 🚦.

## 7 · Podium (spodium)
- Standart: sinf natijalari / yakka rejim.

## 8 · Yakun (s17)
- Chiplar: «✓ Fullstack loyiha kuni tugadi» · «N/1 to'g'ri». Sarlavha: AvtoStoyanka panelini **o'zingiz qurdingiz**.
- «Endi siz bilasiz»: PM: avval foydalanuvchini (qorovul) o'ylab, unga mos sodda panel qurdik · Baza: 2 jadval — joylar ◄ joy_id sessiyalar (foreign key bog'lanishi) · Server: kirish (POST) joyni band qiladi, chiqish (PUT) bo'shatib to'lovni yozadi · Front: 🟩/🟥 panel — rang to'g'ridan-to'g'ri bandmi ustunidan chiqadi · JOIN: ikki jadvalni joy_id = id bo'yicha birlashtirdik — tarix o'qiladigan bo'ldi.
- «Uyga vazifa» kapsulasi → «📝 Uyga vazifa» · «VS Code'da, avto-stoyanka loyihangizda (Gemini bilan):» **Yangi joy qo'shing** — stoyankaga C1, C2 joylarini qo'shib, panelda ko'rining · **Vaqtga qarab to'lov** — 1 soat = 5 000 so'm qilib, to'lovni turgan vaqtdan hisoblang · **Tushum hisoboti** — kunlik jami tushumni chiqaring (SUM to'lovlarni qo'shib jamlaydi).
- «🚀 Loyihangiz tayyor! Keyingi praktikada — uni sinfdoshlaringizga ko'rsatamiz, fikr (feedback) yig'amiz va yaxshilaymiz.»
- «🏅 Nishonlaringiz» · Arena (12 savol, QUIZ_BANK) · tugmalar «Qaytadan» · «Yakunlash ✓».

## Arena (12 savol, to'g'risi ✔)
1. Baza (2 jadval) nima uchun kerak? — ✔ Ma'lumotni saqlash va bog'lash uchun
2. Joy bandligi qaysi turda saqlanadi? — ✔ `BOOLEAN` (true/false)
3. Sessiyani joyga qaysi ustun bog'laydi? — ✔ `joy_id`
4. `REFERENCES joylar(id)` nima beradi? — ✔ Foreign key bog'lanishi beradi
5. Mashina kirganda qaysi amal ishlaydi? — ✔ `POST`
6. Mashina chiqqanida qaysi amal ishlaydi? — ✔ `PUT`
7. Ikki jadvalni birga o'qish uchun? — ✔ `JOIN`
8. JOIN `ON` sharti qanday yoziladi? — ✔ `joy_id = id`
9. Joylarni panelga qanday olamiz? — ✔ `GET`
10. Panel rangi nimaga qarab o'zgaradi? — ✔ `bandmi`
11. Qorovulga eng yaxshi panel qanday? — ✔ Rang + katta tugma + kam matn
12. Fullstack loyiha nimalardan iborat? — ✔ Front + server + baza

## Sinov
`node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m413.mjs <OUT>` — 34/34 · `ru-m413.mjs` toza (17.10 20:1x). `npm run gates -- src/4-Modull/FullstackProjectDayLesson.jsx` — eski holat (tell/emoji/qolip — baza, zaxirada ham).
