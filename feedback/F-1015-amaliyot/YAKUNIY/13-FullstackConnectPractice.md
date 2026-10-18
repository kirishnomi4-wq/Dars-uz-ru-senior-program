# 4-Modul m4-10 «Praktika: Fullstack ulash — AvtoIjara» — yakuniy matn

Fayl: `src/4-Modull/FullstackConnectPracticeLesson.jsx` · 10 ekran · Oldingi: «API va Postman — front backend bilan qanday gaplashadi» (m4-09) · Keyingi: «Autentifikatsiya va .env — login, JWT, maxfiy kalitlar» (m4-11)
Ip: AvtoIjara — 3-moduldagi sayt (:5173) + o'tgan praktikadagi server (:3000); P1'da bazaga qo'shilgan Chevrolet Spark · AI: Gemini
Holat: 2026-10-17 — kodga mos (F-1015-386 → 387 → 388 → 390 → 391 dan keyin; foydalanuvchi «bo'ladi normalne», tasdiq). `lessonId` = `fullstack-connect-practice-p2-v18` (o'zgarmagan)
Zaxira: `arxiv/F-1015-386-oldin/` (386 dan oldin) · `FullstackConnectPracticeLesson.f390keyin.jsx` (391 dan oldin). Qurish: `qurish/f386…f388.py` → `f390.py` + `f390-ekran.jsx` → 391 (joyida).

## 0 · Kirish (213-qonun «bittadan» — ikki bosqich, F-1015-386)
- Sarlavha: Bazaga mashina qo'shdik — lekin saytda **ko'rinmayapti**. Nega?
- 1-bosqich — Mentor: Praktika 1'da Postman orqali bazaga **Chevrolet Spark**'ni qo'shgan edingiz — bazada u bor. Lekin AvtoIjara saytida Spark **yo'q**!
  - Jonli sahna: «Sayt — vitrina» (localhost:5173 · Cobalt, Malibu, K5 · «? Spark — yo'q» · 3 ta mashina) ✂ «SIM UZILGAN» (Spark yo'lda to'xtaydi) «Baza — ombor» (localhost:3000 · 🗄️ cars · 4 ta, Spark «yangi»).
  - Ostida: «Sim uzilgan — vitrina omborni ko'rmayapti: bazadagi Spark saytga yetib bormaydi.» · tugma «Saytni ochamiz →».
- 2-bosqich: «Sayt — front (localhost:5173)» + «Yangilash» → «Yangiladingiz — lekin baribir 3 ta mashina. Spark yo'q!» · «Baza — back (localhost:3000)» · savol (bazaning ostida) «Sayt 3 ta, baza 4 ta. Nega ular bir xil emas?» (ballsiz, yangilashdan keyin ochiladi):
  Sayt buzilgan — qaytadan yozish kerak · ✔ Sayt baza bilan ulanmagan — gaplashmaydi · Spark mashinasi yomon — o'chirish kerak
  - To'g'ri: «Aynan! Sayt hali eski ro'yxatdan o'qiydi — **bazaga ulanmagan**. Bugun uni serverga ulaymiz.» · Noto'g'ri: «Aslida sayt **buzilmagan** — u shunchaki **bazaga ulanmagan**. Bugun uni serverga ulaymiz.»

## 1 · Reja
- Sarlavha: Sayt va server gaplashadi.
- Mentor: Sizda ikki yarim bor: 3-moduldagi AvtoIjara sayti (:5173) va o'tgan praktikadagi server (:3000). Bugun sayt mashinalarni `cars.json` dan emas, serverdan oladi — bazaga qo'shilgan mashina darrov saytda chiqadi.
- «Avval tayyorlaning · 3 qadam ▾» (oyna): 1. 1-terminal: `cd avto-ijara-server` va `node server.js` — server :3000 da ishlasin (o'tgan praktikadagi). · 2. 2-terminal: `cd avto-ijara` va `npm run dev` — sayt :5173 da (3-moduldagi AvtoIjara). · 3. Boshqa oynada gemini.google.com'ni oching. · «Tayyor bo'lsa — «Boshlaymiz».»
- Chapda «Dars oxirida · sayt serverdan» — 4 kartochka (Spark «yangi» bilan).
- O'ngda «Ikki dastur»: `:5173` sayt (front) — so'raydi · `:3000` server (back) — javob beradi · «Bugungi 5 blok»: 01 Saytni serverga ulash (o'zingiz) · 02 CORS xatosini tuzatish (o'zingiz) · 03 Maydonlar va 3 holat (Gemini) · 04 Qo'shish formasi (Gemini) · 05 Mustaqil ish: o'chirish va narx (siz + Gemini)

## 2 · Amaliyot 1 · AI'siz — ulash (a1)
- Sarlavha: Saytni **serverga** ulang.
- Mentor: Ulanish — bitta qator: `fetch` endi faylni emas, server manzilini so'raydi. Almashtirib ko'ring — birinchi urinishda brauzer so'rovni to'sib qo'yadi. Bu normal: har dasturchi ko'radigan birinchi xato.
- Chapda: Terminal (`$ node server.js` → «Server :3000 da ishlayapti» · `$ npm run dev` → `➜ Local: http://localhost:5173/`) · `fetch('/cars.json')` → `fetch('http://localhost:3000/api/cars')` almashtirgich · sayt (3 kartochka) · «Hozir sayt eski fayldan o'qiydi — bazadagi Chevrolet Spark yo'q.»
- O'ngda «Yangi qator · Home.jsx»: `fetch('http://localhost:3000/api/cars')` + «Nusxalash» · «Qadamlar · 4 ▾» (oyna, F-1015-387): 1-terminalda server, 2-terminalda sayt ishlab tursin (yuqoridagi «Avval tayyorlaning»). · `src/pages/Home.jsx` da `fetch('/cars.json')` qatorini toping. · Uni yangi qator bilan almashtiring (nusxalang), `Ctrl+S`. · Brauzerda F12 → Console: qizil xato chiqdimi? Bu — CORS, keyingi qadamda tuzatamiz.
- Nishon «Connected!».

## 3 · Amaliyot 2 · CORS (s10)
- Sarlavha: Saytni ochdik — konsoldagi qizil xato nimani aytmoqchi?
- Mentor (2 gap): Brauzer xavfsizlik uchun :5173 dan :3000 ga ketayotgan so'rovni to'sadi — bu CORS, har dasturchi ko'radigan birinchi xato. Uni serverdagi bitta qator ochadi: `app.use(cors())`.
- Chapda: «Front — sayt» 📦 «So'rov hali yuborilmagan» → «Back — server» · ⛶ · «▶ Saytni ishga tushirish» · Console («— konsol bo'sh —» → «⛔ CORS policy — brauzer so'rovni to'sdi…» → «✓ GET /api/cars → 200 OK (4 mashina yuklandi)»).
- O'ngda `server.js`: `// CORS hali ruxsat berilmagan` · `const app = express();` → «app.use(cors()) qo'shish» → `// ✓ :5173 ga ruxsat` · «Sayt — front (localhost:5173)»: «Ma'lumotni yuklab bo'lmadi / serverga ulanib bo'lmadi» → 4 mashina.
- Nishon «Both Online!».

## 4 · Amaliyot 3 · Gemini — maydonlar va 3 holat (a3)
- Sarlavha: Maydonlar va **holatlar**.
- Mentor: Ulandi — lekin server mashinani `nom, narx, yil` deb qaytaradi, sayt esa `name, price` ni kutadi: kartochkalarda «undefined» chiqadi. Gemini maydonlarni moslaydi va uch holatni qo'shadi.
- Chapda «Natija · holatni tanlang»: Yuklanmoqda · Xato · Tayyor (4 kartochka) · «Tekshiring»: Kartochkalarda nom, narx va yil ko'rinadimi (undefined emas)? · Serverni to'xtatib (Ctrl+C) saytni yangilang — «yuklab bo'lmadi» chiqadimi?
- O'ngda PromptKarta («Ko'rish» — oyna, «Promptni nusxalash»):
```
AvtoIjara saytimni (React, avto-ijara) server ma'lumotiga moslashtir. Server http://localhost:3000/api/cars mashinalarni { id, nom, narx, yil } ko'rinishida qaytaradi (cars.json'dagi name/price emas).
1. Kartochkalar va mashina sahifasi shu maydonlarni ko'rsatsin: nom, narx (so'm/kun), yil.
2. Uch holat: yuklanayotganda «Yuklanmoqda...», server javob bermasa «Ma'lumotni yuklab bo'lmadi», aks holda ro'yxat.
Har bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.
Mana kodim:
{Home.jsx va mashina sahifasi kodini shu yerga qo'ying}
```
- «Qadamlar · 4 ▾»: Chapda holatlarni almashtiring — kod oynasida qaysi qator ishlashini ko'ring. · «Promptni nusxalash» → gemini.google.com, oxiriga `Home.jsx` va mashina sahifasi kodini qo'shing. · Javobdagi fayllarni almashtiring, `Ctrl+S`. · «Tekshiring» ro'yxatini o'ting.
- «avto-ijara · oxirgi so'rov»: `fetch('http://localhost:3000/api/cars')` · `cars[0] = { nom: "Chevrolet Cobalt", narx: 280000, yil: 2022 };` · `// cars.length = 4`

## 5 · Amaliyot 4 · Gemini — qo'shish formasi (a4)
- Sarlavha: Saytdan turib **qo'shish**.
- Mentor: Forma mashinani `POST` bilan serverga yuboradi, server bazaga yozadi, sayt esa ro'yxatni qayta oladi — yangi mashina darrov chiqadi.
- Chapda «Natija · mashina qo'shing»: sayt + forma (nom · narx · «Qo'shish») · «Tekshiring»: Forma bilan qo'shilgan mashina F5 dan keyin ham turibdimi? · psql'da `SELECT * FROM cars;` — yangi qator bormi?
- O'ngda PromptKarta:
```
AvtoIjara saytimga qo'shish formasini qo'sh (kodim pastda):
Bosh sahifada forma: nom, narx, yil. «Qo'shish» bosilganda POST http://localhost:3000/api/cars ga JSON yuborsin (Content-Type: application/json), keyin ro'yxatni qayta fetch qilsin.
Har bo'limga qisqa izoh yoz. O'zgargan faylni to'liq qaytar.
Mana kodim:
{Home.jsx kodini shu yerga qo'ying}
```
- «Qadamlar · 4 ▾»: Chapda forma bilan mashina qo'shing — kod oynasida POST so'rovini ko'ring. · «Promptni nusxalash» → gemini.google.com, oxiriga `Home.jsx` kodini qo'shing. · Javobdagi faylni almashtiring, `Ctrl+S`. · «Tekshiring» ro'yxatini o'ting.
- Nishon «Full Stack!» (F-1015-387).

## 6 · Mustaqil ish (F-1015-390 pilot · F-1015-391 — 6 blok → 3)
- Sarlavha: Endi **o'zingiz**: o'chirish va narxni o'zgartirish.
- Mentor: Tayyor prompt yo'q: uchta savolga qisqa javob yozing — prompt shundan yig'iladi. Gemini bilan quring, ustoz **qabul shartlari** bo'yicha tekshiradi.
- Chapda «Vazifa»: «Har kartochkaga ✕ (o'chirish) va «Narx» (narxni o'zgartirish) qo'shing — o'zgarish bazada saqlansin.» + namuna ro'yxat (4 mashina; ✕ o'chiradi, «Narx» → 480 000; hammasi o'chsa «↺ Boshidan») · «Qabul shartlari · 3 ▾» (oyna):
  - ✕ bosilsa mashina saytdan ham, bazadan ham o'chadi (psql'da `SELECT * FROM cars;`).
  - Narx o'zgartirilsa, F5 dan keyin ham yangi narx turadi.
  - Server o'chiq bo'lsa, sayt xato xabarini ko'rsatadi — oq ekran emas.
  - **Tez tugatganlarga:** o'chirishdan oldin «Rostdan o'chirilsinmi?» deb so'rasin.
- O'ngda «Promptni o'zingiz yig'ing»: Nima qo'shamiz? · Qayerda? · Qanday ishlashi kerak? (har biri kamida 2 so'z, 8 harf — to'lgani ✓; placeholder «masalan: …») · ixcham qator «Prompt · N/3 tayyor» → «✓ Prompt tayyor» · «Ko'rish» (oyna) · «Nusxalash» (3/3 gacha yopiq) · «Har savolga kamida ikki so'z yozing.» (chala bo'lsa).
- Yig'iladigan prompt:
```
AvtoIjara saytimga (React, avto-ijara) qo'sh: {nima}.
Qayerda: {qayerda}.
Qanday ishlashi kerak: {qanday}.
Server: http://localhost:3000/api/cars — DELETE /api/cars/:id va PUT /api/cars/:id (narx) serverda bor.
O'zgargan fayllarni to'liq qaytar.
Mana kodim:
{Home.jsx kodini shu yerga qo'ying}
```
- Yozganlari `ccAvtoMustaqil` (localStorage) da saqlanadi. Katta prompt qutisi va «Qadamlar» yo'q — takror edi.

## 7 · Test (yagona ballik)
- «Ulangandan keyin katalog mashinalarni qayerdan oladi?»: ✔ Serverdan — `fetch(GET /api/cars)` orqali bazadan · Kodga qo'lda yozilgan `const cars` massivi ichidan · CSS faylidan — uslublar bilan birga · Hech qayerdan — katalog bo'sh qoladi
- Izohlar: Katalog har ochilganda serverdan so'raydi, server — bazadan. · `const cars` — eski usul, u bazadan yangilanmaydi. · CSS faqat bezak, ichida mashinalar yo'q. · Katalog bo'sh qolmaydi — ulangandan keyin to'ladi.
- Nishon «Full Circle!» (birinchi urinishda to'g'ri).
- Eslatma (RECAPS 7): «Ulangandan keyin — serverdan»: 🗄️ Ma'lumot bazadan · 🔄 Jonli ulanish · 🚗 Spark paydo bo'ldi.

## 8 · Podium · 9 · Yakun
- «Kim g'olib?» (mustaqil rejimda izoh).
- «✓ Birinchi fullstack ilovangiz» · «N/1 to'g'ri» · Front va backni o'zingiz uladingiz.
- «Endi siz bilasiz»: Front (:5173) va back (:3000) — 2 alohida dastur, bir vaqtda ishlaydi · fetch ↔ API: `const cars` o'rniga useEffect + fetch + useState · loading / error holatlari — foydalanuvchini o'ylab · CORS — boshqa portga so'rov to'silsa, serverga `app.use(cors())` · To'liq yo'l: forma → POST → baza → GET → ekran (refresh'da saqlanadi)
- Uyga vazifa (VS Code'da, `avto-ijara` loyihangizda): **Qidiruv** — nom bo'yicha qidiruv maydoni: yozilgan so'z bor mashinalargina ko'rinsin (filter) · **Mashina sahifasi** — `/car/:id` sahifasi ma'lumotni serverdagi `GET /api/cars/:id` dan olsin · **Tekshiring** — har o'zgarishdan keyin F5: ma'lumot bazadan qayta keladimi? · «🚀 Front, back va baza endi bitta bo'lib ishlaydi! Keyingi praktikada — Loyiha kuni: shu ko'nikmalarni (CRUD, fetch, baza) yangi loyiha — AvtoStoyanka'da qo'llaymiz va noldan to'liq quramiz.»
- Nishonlar (4): Connected! · Both Online! · Full Circle! · Full Stack!

## Sinov (17.10)
gates 11/12 (tell — oldin ham) · `tekshir-m410` 43/43 (Mustaqil ish 1280 da aylantirishsiz; «Qabul shartlari» oynada 3 band) · `ru-m410` 10/10 · tekislik 0 px · `f374-nan` 0 · matn `sinov/uz-matn-umumiy.mjs`.
