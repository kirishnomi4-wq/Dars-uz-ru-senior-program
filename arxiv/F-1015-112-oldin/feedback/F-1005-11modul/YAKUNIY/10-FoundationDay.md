# 10-dars «Loyiha kuni: poydevor — Database, kirish, deploy» — yakuniy matn

Fayl: `src/9-Modull/FoundationDayLesson.jsx` · 12 ekran · Keyingi dars: «Loyiha kuni: 1-asosiy funksiya»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — «Poydevor xaritasi»: chapda telefon (ustida «Expo Go», ichida «Maydon Jamoa» nomi o'z rangida, pastda qulf-quti `expo-secure-store` — bo'sh yoki ichida `token`) → o'rtada **Backend** qutisi (`POST /royxat` · `POST /kirish` · `GET /oyinlar` qulf belgisi bilan; joyi: `localhost:3000 · laptop` yoki `maydon-jamoa-….onrender.com · Render`) → o'ngda **Database · Neon** (jadvallar `oyinchilar` · `oyinlar` · `ishtirokchilar`; `ishtirokchilar` — bo'sh, kulrang). So'rovlar — uchib yuradigan konvert.

Telefon ekranlari: **Ro'yxatdan o'tish** (Ism `Ali` · Telefon `+998 90 000 00 01` · Parol `••••••••`, tugma «Ro'yxatdan o'tish») · **Kirish** (Telefon · Parol, tugma «Kirish») · **O'yinlar** (to'rt karta, eng yangisi tepada).
Database'dagi namuna ma'lumot (dars bo'yi bir xil):
- `oyinchilar` (id · ism · telefon · parol_hash): 1 · Namuna tashkilotchi · +998 90 000 00 00 · $2b$10$…
- `oyinlar` (id · kun · soat · maydon · kerak): 1 · 2026-10-10 · 18:00 · Mahalla maydoni · 10 · 2 · 2026-10-10 · 20:00 · Maktab maydoni · 10 · 3 · 2026-10-11 · 10:00 · Park maydoni · 8 · 4 · 2026-10-11 · 17:00 · Mahalla maydoni · 10
- Telefondagi «O'yinlar» ro'yxati: Yakshanba, 17:00 · Mahalla maydoni · Yakshanba, 10:00 · Park maydoni · Shanba, 20:00 · Maktab maydoni · Shanba, 18:00 · Mahalla maydoni

## 0 · Kirish — prototipda «Qo'shilaman»
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: Qo'shilgan o'yinchini *tashkilotchi telefoni* ko'radimi?
- Mentor:
  - boshida: Ikki telefonda 9-darsdagi prototip ochiq: chapda o'yinchi, o'ngda tashkilotchi. O'yinchi Shanba 18:00 dagi o'yinga qo'shilmoqchi — avval javobni tanlang.
  - javobdan keyin: «Davom etish»ni bosing — bugungi rejani ko'rasiz.
- Maket: ikki telefon yonma-yon — «1-telefon · o'yinchi» va «2-telefon · tashkilotchi»; ikkalasida «Maydon Jamoa», O'yin ekrani: «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · **8 / 10** · qo'shilganlar — ismsiz doiralar (10 ta joy) · tugma «Qo'shilaman».
- Savol: Sizningcha, qaysi biri? (ballsiz)
  - Ko'radi — ikkala telefonda bir xil ilova turibdi
  - Ko'rmaydi — bosish faqat o'yinchi telefonida qoladi
  - Ko'rmaydi — tashkilotchi ilovani qayta ochmaguncha
- Javob tanlangach: 1-telefonda «Qo'shilaman» bosiladi → tugma «Qo'shildingiz» bo'ladi, son «8 / 10» → «9 / 10»; 2-telefonda «8 / 10» qoladi; telefonlar orasida bo'sh katak: «umumiy joy — hali yo'q».
- Javob izohlari:
  - «Ko'rmaydi — bosish faqat o'yinchi telefonida qoladi» tanlansa: **Aynan!** Prototipda o'yinlar har telefonning o'zida — namuna ma'lumot. Ikkala telefon so'raydigan umumiy joy hali yo'q.
  - «Ko'radi — ikkala telefonda bir xil ilova turibdi» tanlansa: **Qiziq fikr!** Ilova bir xil, lekin ma'lumot har telefonning o'zida. Ikkala telefon so'raydigan umumiy joy hali yo'q.
  - «Ko'rmaydi — tashkilotchi ilovani qayta ochmaguncha» tanlansa: **Qiziq fikr!** Qayta ochilsa ham prototip o'z namuna ma'lumotini ko'rsatadi. Ikkala telefonga umumiy joy kerak.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Dars oxirida ilova *internetdagi Backend'ga* ulanadi.
- Mentor: Bugun tanlangan stekda ilova Backend'ga ulanadi. Database, kirish va deploy — har funksiyadan oldin kerak bo'lgan bu qism poydevor deyiladi.
- Chap — Dars oxirida: Poydevor xaritasi bir marta o'zi yuradi (Backend `maydon-jamoa-….onrender.com · Render`): telefonda «Kirish» bosiladi → konvert `POST /kirish` → `token` qulf-qutiga tushadi → `GET /oyinlar + token` → `oyinlar` jadvali yonadi → telefonda «O'yinlar» ochiladi.
- O'ng — Bugungi 3 qadam:
  1. Database va kirish: o'yinchi kiradi va token oladi
  2. Backend Render'da: telefon unga Internet orqali ulanadi
  3. Ilova Backend'ga ulanadi: o'yinlar Database'dan keladi
- Pastki qator: repo `maydon-jamoa` · boshlang'ich holat `m11-dars-10-start` · namuna `m11-dars-10-done`
- Ostida: «Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda bajarasiz.
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Parol bir marta, keyin token
- Eyebrow: Tushuncha · kirish
- Sarlavha: Ilova qayta ochilsa, *parol yana so'raladimi*?
- Mentor:
  - bashoratgacha: Avval taxminingizni belgilang, keyin o'yinchi bo'lib ro'yxatdan o'ting.
  - harakat paytida: Navbatdagi tugmani bosing va Database bilan telefonda nima o'zgarishini kuzating.
  - tugagach: Uchala qadam tugadi — natijani taxminingiz bilan solishtiring.
- Bashorat (Avval o'zingiz belgilab ko'ring): Qayta ochilganda ilova nima ko'rsatadi?
  - «Kirish» ekranini
  - «O'yinlar» ro'yxatini
  - Tanlangach ixcham qator: Taxminingiz · savol · tanlangan variant
- Telefon ostida uch tugma navbat bilan (tugmada «N/3»): Ro'yxatdan o'tish → Kirish → Ilovani qayta ochish
  - «Ro'yxatdan o'tish»: konvert `POST /royxat { ism, telefon, parol }` → `oyinchilar` ga yangi qator `2 · Ali · +998 90 000 00 01 · $2b$10$Qe…`, `parol_hash` katagi yonida: paroldan yasalgan satr — parolning o'zi emas → telefon Kirish ekraniga o'tadi.
  - «Kirish»: konvert `POST /kirish { telefon, parol }` → Backend'da «parol ↔ `parol_hash` ✓» → `token` qulf-qutiga tushadi → `GET /oyinlar + token` → telefonda O'yinlar ro'yxati.
  - Shu qadamdan keyin: Token telefonda `expo-secure-store` da turadi — u qiymatni shifrlab saqlaydi.
  - «Ilovani qayta ochish»: telefon bir lahza qorayadi → qulf-qutidan `GET /oyinlar + token` → «O'yinlar» ochiladi; Kirish ekrani chiqmaydi.
- Natija:
  - Taxmin to'g'ri bo'lsa: ✓ Taxminingiz to'g'ri chiqdi
  - Aks holda: Taxminingiz: «Kirish» ekranini · haqiqatda: «O'yinlar» — token telefonda saqlangan edi
  - Xulosa: Kirishda parol yoziladi; token telefonda saqlansa, qayta ochganda parol so'ralmaydi.
- Tugma: Avval taxminingizni belgilang → Tugmalarni navbat bilan bosing → Davom etish

## 3 · Amaliyot 1 — Database va kirish
- Eyebrow: Amaliyot 1 · Database va kirish
- Sarlavha: Foydalanuvchi ro'yxatdan o'tib, *kira oladigan* bo'lsin.
- Mentor: Talab tayyor — kulrang namunalar o'rniga o'z mahsulotingiz nomlarini va parol qatorini yozasiz; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching (9-darsdagi holat: ilova papkasi va `prototip/` bor, `backend/` hali yo'q). neon.tech'da mahsulotingiz uchun yangi loyiha oching, «Connect»ni bosing va ulanish satrini (connection string) nusxalang.
  2. **Prompt** — joylarni to'ldiring (har joy yonida kulrang namuna — Mentor misolidan), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: repo'da yangi backend/ — README.md dagi arxitektura bo'yicha, port 3000.
       > Nima qilsin: README'dagi jadvallarni yarat (ustunlari README'dagidek).
       > POST /royxat (ism, telefon, parol) foydalanuvchini {foydalanuvchilar jadvali} ga yozsin; parol jadvalda {parol jadvalda qanday tursin}. Bitta telefon ikki marta yozilmasin.
       > POST /kirish (telefon, parol) to'g'ri bo'lsa token bersin. GET /{asosiy ro'yxat} ro'yxatni faqat token bilan bersin, tokensiz — 401; eng yangi yozuv tepada (yaratilgan bo'yicha kamayib).
       > Tekshirish uchun bitta namuna foydalanuvchi va to'rtta namuna {asosiy ro'yxat} yozuvi qo'sh; bor bo'lsa, qayta qo'shma.
       > Nima buzilmasin: {ilova papkasi} va prototip/ papkalari. DATABASE_URL va JWT_SECRET faqat backend/.env da tursin, .env — .gitignore da. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Joy yonida kulrang namuna (birinchi uchrashda):
       - {foydalanuvchilar jadvali} — masalan: `oyinchilar`
       - {parol jadvalda qanday tursin} — ro'yxatdan o'tish mashqidagi `parol_hash` katagini eslang
       - {asosiy ro'yxat} — masalan: `oyinlar`
       - {ilova papkasi} — masalan: `mobil/`
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `maydon-jamoa` papkasida yangi `backend/` — `README.md` dagi arxitektura bo'yicha, port 3000.
       > Nima qilsin: uch jadval yarat — `oyinchilar`, `oyinlar`, `ishtirokchilar` (ustunlari README'dagidek).
       > `POST /royxat` (ism, telefon, parol) o'yinchini `oyinchilar` ga yozsin; parol jadvalda o'zi emas, faqat hash'i (`parol_hash`) tursin. Bitta telefon ikki marta yozilmasin.
       > `POST /kirish` (telefon, parol) to'g'ri bo'lsa token bersin. `GET /oyinlar` o'yinlar ro'yxatini faqat token bilan bersin, tokensiz — `401`; eng yangi o'yin tepada (`yaratilgan` bo'yicha kamayib).
       > Tekshirish uchun bitta namuna tashkilotchi va to'rtta namuna o'yin qo'sh; bor bo'lsa, qayta qo'shma.
       > Nima buzilmasin: `mobil/` va `prototip/` papkalari. `DATABASE_URL` va `JWT_SECRET` faqat `backend/.env` da tursin, `.env` — `.gitignore` da. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — `backend/.env` ga ikki qator yozing: `DATABASE_URL=` va Neon'dan nusxa · `JWT_SECRET=` va uzun tasodifiy satr (tokenni imzolaydi). Terminalda `cd backend`, `npm run start:dev` — xato yo'q.
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — talabning har qatorini tekshiring:
     - (1) Brauzerda `http://localhost:3000/{asosiy ro'yxat}` (masalan `/oyinlar`) — yozuvlar emas, `401` chiqsin: tokensiz yopiq.
     - (2) Neon'dagi SQL Editor'da foydalanuvchilar jadvalingizni oching (`SELECT ism, parol_hash FROM …;`) — namuna foydalanuvchi; `parol_hash` ustunida parolning o'zi yo'q — boshqa satr.
     - (3) Asosiy ro'yxat jadvalida — to'rtta namuna yozuv.
     - (4) Agent aytgan fayllarda README'dagi jadvallar va uch yo'l bor; `git status` da `backend/.env` ko'rinmaydi.
     - Mos kelmagan qatorni uch qism bilan agentga yozing.
- O'ng — kutilgan natija · namuna: Maydon Jamoa:
  - terminal: `$ npm run start:dev` · `[Nest] LOG Nest application successfully started`
  - brauzer `localhost:3000/oyinlar` → **401** · Unauthorized
  - Neon · SQL Editor: `oyinchilar` (ism · parol_hash) — Namuna tashkilotchi · $2b$10$… · `oyinlar` — to'rt qator
- Ostida: Ortda qoldingizmi — Mentor misolini oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m11-dars-10-done` — qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz (`backend/.env` ga o'z qiymatlaringizni yozasiz).
- Hammasi bajarilgach: Backend ishlayapti: foydalanuvchi yoziladi, parolning faqat hash'i saqlanadi, ro'yxat token bilan beriladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: O'yinchi ilovani yopib, kechqurun qayta ochdi. Ilova uni *qanday taniydi*?
  - Telefon raqamini Database'dan qidirib topadi
  - Telefonda saqlangan parolni Backend'ga qayta yuboradi
  - ✔ Telefonda saqlangan tokenni so'rovga qo'shadi
  - Database'dagi tokenni o'qib, o'zi tekshirib ko'radi
- Javob izohlari:
  - To'g'ri: Token telefonda saqlangan — ilova uni yopiq so'rovlarga qo'shadi.
  - A: Telefon raqami ochiq — u o'yinchi kimligini isbotlamaydi.
  - B: Parol telefonda saqlanmaydi — u kirishda yoziladi.
  - D: Token Database'ga yozilmaydi. Backend uni kimga bergan edi?
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: C — <variant> · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 5 · Ilova qaysi manzilga so'raydi?
- Eyebrow: Tushuncha · ilova manzili
- Sarlavha: Ilovaning `.env` fayliga *qaysi qator* yoziladi?
- Mentor:
  - bashoratgacha: Avval taxminingizni belgilang, keyin qatorlarni bittadan yozib ko'ring.
  - qator paytida: «Yozib ko'rish»ni bosing — telefon va «ilova ichi» kartasida nima bo'lishini kuzating.
  - tugagach: Uchala qator yozib ko'rildi — natijani taxminingiz bilan solishtiring.
- Bashorat (Avval o'zingiz belgilab ko'ring): Uch qatordan nechtasi ilovaga yoziladi?
  - Bittasi
  - Ikkitasi
  - Uchalasi
- O'ng: telefon «O'yinlar» (kartalar o'rnida kulrang bo'sh joylar) → Backend `localhost:3000 · laptop` (yashil chiroq) · Backend `maydon-jamoa-….onrender.com · Render`, ichida qulf belgili `JWT_SECRET` · pastda «ilova ichi» kartasi `mobil/.env` (hozircha bo'sh).
- Qatorlar bittadan katta karta bo'lib chiqadi (yorliq «Qator N / 3», tugma «Yozib ko'rish»):
  1. `EXPO_PUBLIC_API_URL=http://localhost:3000` — konvert `GET /oyinlar` telefonning o'ziga qaytadi, telefonda `Network request failed` → ✗ Telefonda `localhost` — telefonning o'zi.
  2. `EXPO_PUBLIC_JWT_SECRET=k3J9…` — qator «ilova ichi» kartasida ochiq ko'rinadi, ko'z belgisi → ✗ Ilovani olgan har kim bu qiymatni o'qiy oladi.
  3. `EXPO_PUBLIC_API_URL=https://maydon-jamoa-….onrender.com` — konvert Render'dagi Backend'ga boradi va qaytadi, telefonda to'rt o'yin → ✓ Internetdagi manzil — telefon uni topadi.
- Natija:
  - Taxmin to'g'ri bo'lsa: ✓ Taxminingiz to'g'ri chiqdi
  - Aks holda: Taxminingiz: <tanlov> · haqiqatda: bittasi — internetdagi Backend manzili
  - `EXPO_PUBLIC_` bilan boshlangan qiymat ilova ichiga ochiq matn bo'lib yoziladi.
  - Xulosa: Ilovaga faqat internetdagi Backend manzili yoziladi. Maxfiy kalit faqat Backend'da turadi.
- Tugma: Avval taxminingizni belgilang → Qatorlarni yozib ko'ring → Davom etish

## 6 · Amaliyot 2 — Backend internetda
- Eyebrow: Amaliyot 2 · deploy
- Sarlavha: Backend internetga chiqsin: *telefon uni topsin*.
- Mentor: Endi «Nima buzilmasin» qatorini o'zingiz yozasiz, namuna «Yordam»da; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — o'z Backend'ingiz laptopda ishlab tursin. render.com'ga GitHub akkauntingiz bilan kiring — 9-Modulda «Maydon»ni shu yerga chiqargansiz.
  2. **Prompt** — `{nima buzilmasin}` qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: backend/ — Render'ga chiqarish uchun.
       > Nima qilsin: port PORT o'zgaruvchisidan olinsin, u bo'lmasa — 3000. README.md ga «Internetga chiqarish» bo'limini yoz: Render uchun Root Directory, Build Command, Start Command va kerakli o'zgaruvchilar nomi — qiymatsiz.
       > Nima buzilmasin: {nima buzilmasin}
     - Yordam (ochiladigan) — Mentor misolidagi qator:
       > Nima buzilmasin: `DATABASE_URL` va `JWT_SECRET` kodda ham, repo'da ham bo'lmasin — faqat `.env` da va Render sozlamasida. Laptopda `npm run start:dev` avvalgidek ishlasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — (a) `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "backend: Render"`, `git push`.
     - (b) Render'da «New > Web Service» → o'z repo'ngiz; Root Directory — `backend`; Build Command va Start Command — `README.md` dagi; tarif **Free**. Environment bo'limiga ikki qator: `DATABASE_URL` va `JWT_SECRET` — qiymatlari `backend/.env` dan. Keyin «Create Web Service» — tayyor bo'lgach manzil chiqadi: `….onrender.com`.
     - Xato bo'lsa — Render'dagi log qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.» Web-trekda ham Backend shu yo'l bilan chiqadi.
  4. **Telefonda tekshirish** — telefon brauzerida Render manzilingizni va asosiy ro'yxatingiz nomini oching (`https://….onrender.com/…`) — `401` chiqsin: Backend internetda, tokensiz yopiq. Mobil internet bo'lsa, Wi-Fi'ni o'chirib ham oching — natija o'sha. Bepul Backend uxlab qolgan bo'lsa, birinchi javob bir daqiqagacha kechikishi mumkin.
     - Render manzilingizni `README.md` ning «Internetga chiqarish» bo'limiga yozing — ilovangiz unga ulanadi (manzil — ochiq qiymat).
- O'ng — kutilgan natija · namuna: Maydon Jamoa: telefon brauzeri `maydon-jamoa-….onrender.com/oyinlar` → **401** · Unauthorized · yonida Render kartasi: Render `maydon-jamoa` · Root Directory `backend` · Environment `DATABASE_URL` `********` · `JWT_SECRET` `********`
- Hammasi bajarilgach: Backend internetda: telefon uni Render manzili bilan topadi, tokensiz `401` oladi.
- Ostida: Render bepul xizmatni prod uchun tavsiya qilmaydi. Bu modulda u ilovani tekshirish uchun ishlatiladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Backend Render'ga chiqdi. `JWT_SECRET` *qayerda turishi* kerak?
  - Ilovaning `.env` ida — `EXPO_PUBLIC_` bilan boshlanib
  - ✔ Render'da — Backend'ning Environment bo'limida
  - Talab matnida — agent ham bilib tursin deb
  - `README.md` da — Render uni o'sha yerdan o'qisin deb
- Javob izohlari:
  - To'g'ri: Maxfiy kalit Backend'da turadi: ilova va repo uni ko'rmaydi.
  - A: `EXPO_PUBLIC_` qiymati ilova ichida ochiq ko'rinadi.
  - C: Talab README'da va chatda qoladi — kalitga joy emas.
  - D: README'da faqat nomlar turadi — u GitHub'da ochiq.
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: B — <variant> · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 8 · Amaliyot 3 — ilova Backend'ga ulanadi
- Eyebrow: Amaliyot 3 · ilova → Backend
- Sarlavha: Ilova Backend'ga ulansin: *kirish va asosiy ro'yxat*.
- Mentor: Uch qatorning hammasi sizdan, namuna «Yordam»da; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; trek — 8-darsdagi tanlov, tanlanmagan bo'lsa ikkala qator ham):
  1. **Ochish** — ilova papkangizda `.env` fayl yarating, bitta qator: mobil trekda `EXPO_PUBLIC_API_URL=`, web-trekda `VITE_API_URL=` — va Render manzilingiz (oxirida `/` siz).
  2. **Prompt** — vazifa: ilovangizda «Ro'yxatdan o'tish» va «Kirish» bo'lsin, token saqlansin, asosiy ro'yxat Backend'dan kelsin. Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: {qayerda}
       > Nima qilsin: {nima qilsin}
       > Nima buzilmasin: {nima buzilmasin}
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab; ikkala trek bo'lsa yorliqlar «mobil trek» va «web-trek»:
       - mobil trek:
         > Qayerda: `mobil/` — yangi «Ro'yxatdan o'tish» va «Kirish» ekranlari; «O'yinlar» ekrani (`src/app/index.tsx`).
         > Nima qilsin: Backend manzilini `.env` dagi `EXPO_PUBLIC_API_URL` dan ol. «Ro'yxatdan o'tish» — `POST /royxat` (ism, telefon, parol), keyin «Kirish» ochilsin.
         > «Kirish» — `POST /kirish`; olingan tokenni `expo-secure-store` ga saqla. Ilova ochilganda token bo'lsa — «O'yinlar», bo'lmasa — «Kirish».
         > «O'yinlar» ro'yxatni `GET /oyinlar` dan token bilan olsin: kartada kun, soat, maydon va nechta odam kerakligi. Javob `401` bo'lsa — tokenni o'chirib, «Kirish»ni och. «O'yinlar» ekranida «Hisobdan chiqish» tugmasi — tokenni o'chirib, «Kirish»ni ochsin.
         > Nima buzilmasin: «O'yin» va «E'lon berish» ekranlari, animatsiyalar. `.env` ga Backend manzilidan boshqa qiymat yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
       - web-trek:
         > Qayerda: `prototip/` — yangi «Ro'yxatdan o'tish» va «Kirish» sahifalari; asosiy ro'yxat sahifasi. Backend'da `WEB_ORIGIN`.
         > Nima qilsin: Backend manzilini `.env` dagi `VITE_API_URL` dan ol. «Ro'yxatdan o'tish» — `POST /royxat`, keyin «Kirish». «Kirish» — `POST /kirish`; token `localStorage` da tursin.
         > Sahifa ochilganda token bo'lsa — ro'yxat `GET /{asosiy ro'yxat}` dan token bilan, bo'lmasa — «Kirish». `401` kelsa — tokenni o'chirib «Kirish»ni och. «Hisobdan chiqish» — tokenni o'chirsin.
         > Backend CORS faqat `WEB_ORIGIN` dagi Netlify manziliga ruxsat bersin.
         > Nima buzilmasin: dizayn va animatsiyalar; foydalanuvchi matni sahifaga HTML bo'lib chiqmasin. `.env` ga Backend manzilidan boshqa qiymat yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
         - Render'da Environment'ga `WEB_ORIGIN` — Netlify manzilingiz (9-Moduldagidek).
  3. **Ishga tushirish** — mobil trekda: `npx expo start`, QR'ni telefonda Expo Go bilan oching (9-darsdagidek); QR ochilmasa — telefon va laptop bitta Wi-Fi'dami? Bo'lmasa: `npx expo start --tunnel`.
     - Web-trekda: `npm run dev`, keyin push — Netlify o'zi yangilanadi.
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabning har qatorini tekshiring:
     - (1) Ro'yxatdan o'ting, keyin kiring — asosiy ro'yxatda to'rtta namuna yozuv (eng yangisi tepada).
     - (2) Mobil trekda terminalda `r` ni bosing (web-trekda sahifani yangilang) — ilova qayta yuklanadi: «Kirish» so'ralmaydi, ro'yxat ochiladi.
     - (3) «Hisobdan chiqish»ni bosing — «Kirish» ochiladi; qayta kiring (bu — kirish poydevorining qismi, roadmap funksiyasi emas).
     - (4) Neon'dagi SQL Editor'da foydalanuvchilar jadvalingiz — sizning qatoringiz, `parol_hash` da parolingiz emas.
     - Bepul Backend uxlab qolgan bo'lsa, birinchi javob bir daqiqagacha kechikishi mumkin. Oxirida `git status` → `git add <fayl>` (`.env` emas) → commit → `git push`.
- O'ng — kutilgan natija · namuna: Maydon Jamoa: telefon uch kadr bir marta o'zi yuradi — Ro'yxatdan o'tish (Ism `Ali` · Telefon `+998 90 000 00 01` · Parol `••••••••`) → Kirish (qulf-quti `expo-secure-store` ichida `token`) → O'yinlar: Yakshanba, 17:00 · Mahalla maydoni · 10 kishi kerak · Yakshanba, 10:00 · Park maydoni · 8 kishi kerak · Shanba, 20:00 · Maktab maydoni · 10 kishi kerak · Shanba, 18:00 · Mahalla maydoni · 10 kishi kerak · yonida Neon · SQL Editor: `oyinchilar` (ism · parol_hash) — Namuna tashkilotchi · $2b$10$… · Ali · $2b$10$…
- Hammasi bajarilgach: Ilova internetdagi Backend'ga ulandi: foydalanuvchi kiradi, ro'yxat Database'dan keladi.
- Ostida (faqat mobil trekda): Expo Go'da ilova kodi hozircha laptopdan keladi, o'yinlar esa Render'dagi Backend'dan.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 9 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 10 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.
- Birinchi bosishgacha: Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon | Izoh |
|---|---|---|
| Poydevor nima? | Database, kirish va deploy — har funksiyadan oldin kerak bo'lgan qism | Mentor misolida: uch jadval, kirish yo'llari, Backend Render'da |
| Prototipda bir telefondagi «Qo'shilaman»ni ikkinchisi nega ko'rmaydi? | Ma'lumot har telefonning o'zida | Ikkala telefon so'raydigan umumiy Database yo'q |
| «Maydon Jamoa» Database'ida qaysi uch jadval bor? | oyinchilar, oyinlar, ishtirokchilar | `ishtirokchilar` — kim qaysi o'yinga qo'shilgani |
| `oyinchilar` jadvalida parol qanday turadi? | Hash bo'lib — parolning o'zi emas | Hash — paroldan yasalgan satr: undan parolni qaytarib bo'lmaydi |
| `POST /kirish` nima qaytaradi? | Token | Telefon va parol to'g'ri bo'lsa |
| Token telefonda qayerda saqlanadi? | expo-secure-store da | Qiymatni shifrlab saqlaydi — 8-Moduldagi AsyncStorage'dan farqi shu |
| Ilova qayta ochilganda «Kirish» nega so'ralmaydi? | Token telefonda saqlangan | Ilova uni yopiq so'rovlarga qo'shadi; muddati tugasa — yana «Kirish» |
| `GET /oyinlar` tokensiz nima qaytaradi? | 401 | Ilova tokenni o'chirib, «Kirish»ni ochadi |
| Telefondagi ilova uchun `localhost` nima? | Telefonning o'zi | So'rov laptopdagi Backend'ga yetmaydi |
| Nega Backend shu darsda Render'ga chiqadi? | Telefon unga Internet orqali ulanadi | Laptopdagi Backend'ga telefon ulana olmasligi mumkin |
| `EXPO_PUBLIC_API_URL` ga nima yoziladi? | Render'dagi Backend manzili | Maxfiy emas — ilovada ochiq ko'rinadi |
| `JWT_SECRET` va `DATABASE_URL` qayerda turadi? | backend/.env da va Render'da | Ilovada ham, GitHub'da ham emas |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni
- Eyebrow: Yakun
- Yuqori yorliq: ✓ Poydevor tayyor (3-amaliyot bajarilgan bo'lsa; aks holda yorliq yo'q) · N/2 to'g'ri
- Sarlavha (holatga qarab):
  - 3-amaliyot bajarilgan: Poydevor tayyor: ro'yxatingiz Backend'dan keladi.
  - 2-amaliyot bajarilgan, 3-si yo'q: Backend internetda — ilovaga ulash qoldi.
  - 1-amaliyot bajarilgan, 2-si yo'q: Database va kirish tayyor — deploy qoldi.
  - 1-amaliyot bajarilmagan: Poydevor boshlandi — qolgan qadamni tugating.
- CODE STRIKE arenasi (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Ro'yxatdan o'tgan o'yinchi Database'da turadi; parolning o'zi emas, hash'i saqlanadi.
  - Kirishda parol yoziladi: token telefonda saqlanadi va yopiq so'rovlarga qo'shiladi.
  - Telefon `localhost` bilan laptopdagi Backend'ni topmaydi — bu darsda Backend barqaror manzil uchun internetga chiqadi.
  - `EXPO_PUBLIC_` qiymati ilovada ochiq ko'rinadi: unga faqat Backend manzili yoziladi.
- Keyingi dars — **«Loyiha kuni: 1-asosiy funksiya»**: roadmap'dagi birinchi funksiya — talabni siz yozasiz.
- Nishonlaringiz — N/3 (uchta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Nishonlar
- **Token Keeper** — Ilova o'yinchini telefondagi token bilan tanishini topdingiz (4-ekran, birinchi urinishda to'g'ri)
- **Secret Safe** — Maxfiy kalit Backend'da turishini topdingiz (7-ekran, birinchi urinishda to'g'ri)
- **Foundation Ready** — Uch amaliyot blokini oxirigacha bajardingiz (8-ekran, oxirgi «Bajardim»; bonus)
- Nishon olinganda: nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 4-ekran (1-savol) — **Parol bir marta, keyin token**
   - `POST /kirish` · Kirish — Telefon va parol to'g'ri bo'lsa, Backend token beradi.
   - `SecureStore.setItemAsync('token', token)` · Saqlash — Token telefonda shifrlab saqlanadi.
   - `Authorization: Bearer <token>` · So'rov — Ilova yopiq so'rovlarga tokenni qo'shadi.
   - Sinfga savol: Ilova qayta ochilganda parol nega so'ralmaydi?
2. 7-ekran (2-savol) — **Maxfiy kalit — faqat Backend'da**
   - `EXPO_PUBLIC_API_URL=https://…` · Ilova — Bu qiymat ilova ichida ochiq ko'rinadi.
   - `JWT_SECRET` · Maxfiy kalit — `backend/.env` da va Render sozlamasida turadi.
   - `.gitignore` · Repo — `.env` GitHub'ga chiqmaydi.
   - Sinfga savol: Ilovani olgan odam qaysi qiymatni ko'ra oladi?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Testni qayta ishlash — mashq (jadvalga yozilmaydi) · mustaqil rejimda: Keyingi → · Natijani ko'rish · jonli dars tugasa: «Jonli dars yakunlandi — testni o'zingiz davom ettiring:» · Mashq rejimida davom etish

1. Ilova kirgan o'yinchini keyingi so'rovlarda qanday taniydi?
   - ✔ Telefonda saqlangan token orqali
   - Har safar telefon raqamini so'rab
   - Database'dagi parolni o'qib chiqib
   - Expo Go akkauntining nomi orqali
2. `oyinchilar` jadvalida parol qanday turadi?
   - Parolning o'zi, ochiq matn bo'lib
   - ✔ Paroldan yasalgan hash bo'lib
   - Telefon raqamiga qo'shib yozilib
   - Token ichiga joylab qo'yilib
3. Tokensiz `GET /oyinlar` so'rovi kelsa, Backend nima qiladi?
   - O'yinlarning to'liq ro'yxatini beradi
   - Faqat birinchi o'yinni qaytaradi
   - ✔ 401 qaytaradi, ro'yxatni bermaydi
   - «Kirish» ekranini o'zi ochib beradi
4. Token telefonda qayerda saqlanadi?
   - Database'dagi `oyinchilar` jadvalida
   - Ilovaning `.env` faylidagi qatorda
   - Repo'dagi `README.md` bo'limida
   - ✔ `expo-secure-store` da, shifrlab
5. Telefondagi ilova uchun `localhost` nimani bildiradi?
   - ✔ Telefonning o'zini
   - Laptopdagi Backend'ni
   - Render'dagi Backend'ni
   - Neon'dagi Database'ni
6. Nega Backend shu darsda Render'ga chiqadi?
   - Laptopda u sekin ishlagani uchun
   - ✔ Telefon Internet orqali ulanishi uchun
   - Render Database'ni o'zi yaratgani uchun
   - Expo Go faqat Render bilan ishlagani uchun
7. Ilovaning `EXPO_PUBLIC_API_URL` qatoriga nima yoziladi?
   - `http://localhost:3000` manzili
   - `JWT_SECRET` kalitining qiymati
   - ✔ Render'dagi Backend manzili
   - Neon'dagi `DATABASE_URL` satri
8. Nega `EXPO_PUBLIC_` qatoriga maxfiy kalit yozilmaydi?
   - Ilova ochilishi sekinlashib qoladi
   - Expo Go bunday qatorni o'chirib tashlaydi
   - Render bu qatorni o'qiy olmay qoladi
   - ✔ U ilova ichida ochiq matn bo'lib turadi
9. Internetdagi Backend uchun `JWT_SECRET` qayerda turadi?
   - ✔ Render'dagi Environment bo'limida
   - Ilovaning `mobil/.env` faylidagi qatorda
   - GitHub'dagi `README.md` faylida
   - Agentga yozilgan talab matnida
10. Telefon brauzerida Render manzili `/oyinlar` — 401 chiqdi. Bu nimani bildiradi?
    - Backend ishlamayapti — Render xato berdi
    - ✔ Backend internetda va tokensiz yopiq
    - Database'da o'yinlar hali yozilmagan
    - Telefonning o'zi Internetga ulanmagan
11. Push'dan oldin fayllarni qanday qo'shasiz?
    - `git add .` bilan hammasini birdan
    - `.env` ni ham qo'shib, hammasini
    - ✔ Agent aytgan fayllarni bittadan
    - Faqat `README.md` faylini qo'shib
12. Ilova `GET /oyinlar` dan `401` oldi. Ilova nima qiladi?
    - O'yinlarni namunadan ko'rsataveradi
    - Parolni o'zi qayta yuborib turadi
    - Render'dagi Backend'ni qayta yoqadi
    - ✔ Tokenni o'chirib, «Kirish»ni ochadi

## Kartochkalar
10-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 11-ekrandagi 4 qator.
- Keyingi dars — «Loyiha kuni: 1-asosiy funksiya».
