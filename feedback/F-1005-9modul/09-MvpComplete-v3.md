# 9-Modul · 9-dars «Loyiha kuni: MVP tayyor» — MD v3 (172-qonun qolipi)

Fayl: `src/7-Modull/MvpCompleteLesson.jsx` · kalit `m7-09` · **8 ekran + 3 amaliyot bloki + kartochkalar = 12** (F-1005-88: kartochka alohida ekran, P-058 dan farq — foydalanuvchi qarori 05.10) · faqat o'zbekcha (ru — 6-RU bosqichida)
Namuna: `feedback/F-0929-QA-6modul/13-FullSystemProject-v3.md` (tuzilish) · blok ulagichi: `src/skelet/NamunaDars.jsx` (`ScreenBlok`).
Fidbek: qator yoniga `>> ...` yozing. Tasdiqlangach (GATE M) dars shu holatga keltiriladi — `.jsx` hali yo'q, hamma ekran noldan.
⚠️ Dars yangi: ballik testlarda to'g'ri javob o'rni shu MD'da belgilanadi (3-ekran **B**, 5-ekran **C**) va keyin o'zgarmaydi.
Menyu nomi (205): «Loyiha kuni: MVP tayyor» — App.jsx `m7-09` bilan bir xil. Oldingi: 8-dars PM + amaliyot «Yaxshi interfeysdan nimani olasiz?» ·
keyingi: 10-dars PM «Odam ilovangizda qayerda to'xtab qoladi?».
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 60 (A1 · A2 · A3 — har biri ≈ 20). Sarlavha yonidagi `(NN)` — belgilar soni.

---

Tashqi audit (ChatGPT) Filtri: `09-FILTR.md` — 05.10.2026 qo'llandi.

## A. Darsning tayanchi

1. **Bitta natija.** Dars oxirida «Maydon» internetda ishlaydi: o'yinchi telefondan bo'sh katakni band qiladi, maydon egasi bandlar ro'yxatini parol bilan
   ko'radi, Umami uch qadamni sanaydi (ochdi → vaqtni tanladi → band qildi). Natija 1-ekranda ko'rsatiladi, 3 blokda quriladi, 6-ekranda sanaladi.
2. **Dasturdagi o'rni** — «MVP ishlab chiqish — 2-qism». 7-darsda talab yozilib birinchi ekran qurilgan (kataklar Backend'dan, `dars-07-done`),
   8-darsda bitta interfeys usuli va animatsiyalar qo'shilgan (`dars-08-done`). Bugun — MVP ro'yxatidagi qolgan ikki funksiya va internetga chiqarish (`dars-09-done`).
3. **MVP ro'yxati** (3-dars, tayanch 1): «qilamiz» — kun bo'yicha vaqt kataklari · katakni band qilish (ism + telefon) · ega uchun bandlar ro'yxati;
   «keyin» — to'lov · jamoa yig'ish · eslatma; «qilmaymiz» — baho · chat. Bugun faqat «qilamiz».
   **«Yana funksiya qo'shamiz» istagiga qarshi bitta joy — 0-ekran:** agent to'lov tugmasini taklif qiladi, savol «MVP qachon tayyor?», javob «keyin» qutisiga
   qaytaradi. MVP ro'yxati qatori dars bo'yi vizual tepasida turadi, «keyin» qutisi kulrang (qayta gapirilmaydi — faqat ko'rinadi).
4. **Atamalar (bir ma'no — bir so'z, tayanch 2):** sayt · Backend · Database · vaqt katagi · band qilish / band · o'yinchi · maydon egasi · hodisa · talab ·
   agent (Antigravity) · token (4-Modul ta'rifi: parol to'g'ri bo'lsa beriladi, keyingi so'rov u bilan ketadi) · `.env` · deploy (1-Modul: saytni internetga chiqarish).
   **Ishlatilmaydi:** server (prozada), frontend, baza, slot, bron, buyurtma, mijoz, admin · «sinov / sinash» — 10-dars atamasi (real odam), bugun «tekshirish» ·
   «maydon» forma qismi ma'nosida (T-015, mahsulot nomi bilan to'qnashadi) · «band» ro'yxat qismi ma'nosida — o'rniga «funksiya» · «katak» jadval qismi ma'nosida — o'rniga «qator».
5. **Texnik aniqlik (tayanch 3, taxmin emas):** `GET /vaqtlar?kun=` — soat + holat (ism va telefon yo'q) · `POST /bandlar` — `kun`, `soat`, `ism`, `telefon` ·
   `POST /kirish` — ega paroli → token · `GET /bandlar` — faqat token bilan, aks holda `401`. Jadval `bandlar`: `id · kun · soat · ism · telefon · yaratilgan`.
   Hodisalar: sahifa ochilishi (avtomatik) · `vaqt-tanladi` (6-dars) · `band-qildi` (bugun). Darsning uch g'oyasi shundan chiqadi:
   (a) bo'sh katakni Backend tekshiradi — telefondagi sahifa eskirgan bo'lishi mumkin; (b) `band-qildi` faqat band saqlangach yoziladi;
   (c) ism va telefon faqat ega sahifasida, token bilan; parol — `.env` da.
6. **Talab (7-darsdagidek):** uch qator — «Qayerda» · «Nima qilsin» · «Nima buzilmasin» — va oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.» (§221, 173.4).
   Prompt — agentga buyruq, sen-formada (T-002). O'quvchi `{...}` joylarni o'zi to'ldiradi — javobi oldingi tushuncha ekranida.
7. **Amaliyot bloki (173 + qaror 8):** 4 qadam (Ochish → Prompt → Ishga tushirish → Tekshirish) + **5-qadam «O'z g'oyangiz»** — shu talabni o'quvchi o'z MVP'siga yozadi;
   o'z MVP'si uyda davom etadi. Kutilgan natija — «Maydon» namunasi. **Uyga vazifa bloki yo'q (172.4).**
8. **Deploy yo'li — o'tilgandan, yangi xizmat yo'q:** Backend — Render (5-Modul bot darslari: «New → Web Service», «Environment»; 6-Modulda ham Backend serverga chiqqan) ·
   sayt — Netlify, GitHub'dan (1-Modul «Netlify va deploy» da tanishgan). Ikkalasi GitHub'dan oladi: push qilinsa o'zi yangilanadi (GATE M M-q7; 11-dars shunga tayanadi). Database — Neon (4-darsdan, bir xil `DATABASE_URL`).
   6-Modulda web laptopda qolgan edi; bu yerda sayt ham chiqadi — 10-darsda boshqa odam MVP'ni o'z telefonida ochadi → **TAYANCHGA SAVOL 1**.
9. **Metafora yo'q.** Qahramon yo'q — vazifani Mentor beradi; jadvaldagi ism va telefon — namuna ma'lumot (TAYANCHGA SAVOL 9).
   Matn o'lchovi (162/164, §225): sarlavha ≤55 · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60. Yuzada emoji yo'q (185); ✓ ✗ → — belgilar.

---

## Darsning ipi va bitta vizual

- **Hook:** kataklar bor, lekin hali hech kim band qila olmaydi; agent esa to'lov tugmasini taklif qiladi → «MVP qachon tayyor?».
- **Ip (ot-shaklda, §224):** Band qilish → Ega sahifasi → Internetga chiqarish.
- **Namuna:** «Maydon» — repo `maydon`, `dars-08-done` → `dars-09-done`. O'quvchi darsda «Maydon»ni quradi, har blok oxirida talabni o'z g'oyasiga yozadi.
- **Bitta vizual — «Maydon» xaritasi** (4-dars chizmasining davomi; to'plam bitta manbada — 180):
  - tepada **MVP ro'yxati qatori**: «qilamiz» — Vaqt kataklari ✓ · Band qilish ○ · Ega uchun bandlar ro'yxati ○ · yonida «keyin» qutisi kulrang (To'lov · Jamoa yig'ish · Eslatma);
  - chapda **sayt** — telefon ramkasi: kun tanlagich (Shanba), vaqt kataklari 16:00–22:00 (bo'sh — oq, band — to'q), katak bosilganda forma (ism, telefon) va «Band qilish» tugmasi;
  - o'rtada **Backend** — qutida to'rt yo'l: `GET /vaqtlar` · `POST /bandlar` · `POST /kirish` · `GET /bandlar` (qulf belgisi bilan);
  - pastda **Database** — `bandlar` jadvali (`kun · soat · ism · telefon`);
  - o'ngda **ega sahifasi** — brauzer `/ega`: parol qatori va bandlar ro'yxati;
  - burchakda **Umami'dagi uch qadam** — ochdi → vaqtni tanladi → band qildi (har qadam ostida son).
  - Holatlar: kulrang (hali yo'q) → oq (ishlaydi) → accent (joriy) → yashil (bugun qurildi) → qizil (rad etildi / qulf). Konvert — so'rov.
  - Ishlatiladi: 0 (sayt + MVP ro'yxati) · 1 (tayyor holat: hammasi yashil, manzil `....netlify.app`) · 2 (band yo'li, ikki telefon) · 4 (ega yo'li) · A1–A3 (kutilgan natija).

---

## 0 · Kirish  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **«Maydon»ni qachon tayyor deyish mumkin?** (39)
- Mentor: Kataklar Backend'dan keladi, lekin hali hech kim maydonni band qila olmaydi. Agent esa to'lov tugmasini ham qo'shishni taklif qilyapti.
- Maket (chap): telefon ramkasida «Maydon» — Shanba, kataklar 16:00–22:00, hammasi bo'sh; katak ostida «Band qilish» tugmasi xira.
  Ostida MVP ro'yxati qatori: «qilamiz» — Vaqt kataklari ✓ · Band qilish ○ · Ega uchun bandlar ro'yxati ○ · «keyin» — To'lov · Jamoa yig'ish · Eslatma (kulrang).
- Variantlar (radio):
  - To'lov va jamoa yig'ish ham qo'shilganda
  - «Qilamiz» qutisidagi funksiyalar ishlaganda
  - Ko'rinishi namunadagidek mukammal bo'lganda
- Javob — 2-variant: **Aynan!** Biz belgilagan shu versiya «qilamiz» qutisi ishlaganda tayyor. Bugun qolgan ikkitasini quramiz. (95)
- Javob — 1-variant: **Qiziq fikr!** To'lov va jamoa yig'ish — «keyin» qutisida. Avval odam maydonni band qila olishi kerak.
- Javob — 3-variant: **Qiziq fikr!** Ko'rinishni 8-darsda tanladingiz. Tayyorlikni esa «qilamiz» qutisi o'lchaydi.
- **Harakat → Vizual o'zgarish:** variant tanlanadi → maketda 18:00 katagi bosiladi, «Band qilish» xira qoladi — hech narsa o'zgarmaydi;
  MVP ro'yxatida «Band qilish» va «Ega uchun bandlar ro'yxati» accent bo'lib yonadi (bugungi ish), «keyin» qutisi kulrangligicha qoladi.
- Jonli: sof so'rovnoma — `correct: false` hammaga, maqtov yo'q (J-026).

## 1 · Bugun quramiz  ← QReja
- Eyebrow: Reja
- Sarlavha: **Dars oxirida «Maydon» telefonda shunday ishlaydi.** (49)
- Mentor: «Maydon»ni birga quramiz, har blok oxirida esa shu talabni o'z g'oyangizga yozasiz.
- Chapda «Dars oxirida ...»: telefon maketi, manzil `maydon-....netlify.app` — Shanba, 19:00 band, «Band qilindi» belgisi; yonida ega sahifasi «Shanba · bandlar»:
  - 19:00 · Jasur · +998 90 000 00 03
  - 21:00 · Bekzod · +998 90 000 00 04
  - Tepada MVP ro'yxati qatori: «qilamiz» uchala funksiya ✓, «keyin» qutisi kulrang — tegilmagan.
- O'ngda 3 qadam (bosilmaydi, teg yo'q — 172 tuzatish F-1003-06, P-015):
  - 01 · Band qilish — o'yinchi bo'sh katakni bosadi, band Database'ga yoziladi
  - 02 · Ega sahifasi — bandlar ro'yxati faqat parol bilan ochiladi
  - 03 · Internetga chiqarish — sayt va Backend internetda, telefondan ochiladi
- Pastki qator (mono, kichik): repo `maydon` · boshlang'ich holat `dars-08-done` · tayyor namuna `dars-09-done`
- **Harakat → Vizual o'zgarish:** bosiladigan narsa yo'q (reja); telefonda 19:00 bosiladi → konvert Backend'ga, undan Database'ga yuradi →
  katak band rangiga silliq o'tadi, «Band qilindi» paydo bo'ladi → ega ro'yxatiga 19:00 qatori ajralib kiradi (jonli maket, DE-200).
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Tushuncha 1 — bo'sh katakni kim tekshiradi  ← QTushuncha
- Eyebrow: Tushuncha · band qilish
- Sarlavha: **Ikki o'yinchi bitta katakni band qilsa, kim oladi?** (50)
- Mentor: Ikkala telefonda 18:00 hozir bo'sh ko'rinadi. Avval birinchisidan, keyin ikkinchisidan band qiling.
- Bashorat (ballsiz, 181): **Ikkinchi band ham Database'ga yoziladimi?** · Ha, ikkalasi ham yoziladi · Yo'q, bittasi rad etiladi
- Vizual: «Maydon» xaritasining chap va o'rta qismi — ikki telefon yonma-yon («1-telefon», «2-telefon»), ikkalasida Shanba 18:00 bo'sh;
  Backend qutisida `POST /bandlar`; Database `bandlar` bo'sh; burchakda Umami: band qildi — 0.
- **Harakat → Vizual o'zgarish:**
  - 1-telefonda «Band qilish» (ism va telefon to'ldirilgan) → konvert `{ kun, soat, ism, telefon }` Backend'ga yuradi → Backend Database'dan 18:00 ni so'raydi —
    bo'sh, yashil ✓ → jadvalga qator ajralib kiradi `2026-10-10 · 18:00 · Jasur` → javob qaytadi → 1-telefonda katak band rangiga silliq o'tadi,
    «Band qilindi» belgisi chiqadi → Umami: band qildi — 1.
  - 2-telefonda 18:00 hali bo'sh ko'rinadi — katak ustida kichik kulrang yorliq «eski holat» (sahifa yangilanmagan).
  - 2-telefonda «Band qilish» → konvert Backend'ga → Database'da 18:00 band — Backend qutisi qizil yonadi, javob `409 · Bu vaqt band` →
    jadvalga qator qo'shilmaydi → 2-telefonda «Bu vaqt band — boshqa vaqtni tanlang», katak band rangiga o'tadi → Umami soni o'zgarmaydi (1).
- Natija qatori: «Taxminingiz: ... · haqiqatda: ikkinchi band yozilmadi — Backend rad etdi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Backend tekshiradi, Database bir katakni ikki marta yozdirmaydi. `band-qildi` faqat band saqlangach yoziladi. (109)
- Tugma (pastki): Ikkala telefondan band qiling (N/2) → Davom etish
- Tugagach (199): harakat paneli yopiladi, xarita butun enga chiqadi, Backend qutisidagi tekshiruv va Umami soni fokusda.

## A1 · Amaliyot 1 — band qilish  `(≈20 daq)`  ← amaliyot bloki
- Eyebrow: Amaliyot 1 · band qilish
- Sarlavha: **Bo'sh katakni bosgan o'yinchi uni band qila olsin.** (50)
- Mentor: Talabdagi ikki qavsni o'zingiz to'ldirasiz — ikki telefonni eslang. «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Ikki terminal: `cd backend && npm run start:dev` · `cd web && npm run dev`.
     Brauzerda `localhost:5173` — shanba kataklari ko'rinsin.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: saytdagi vaqt kataklari va Backend'dagi `POST /bandlar`.
     > Nima qilsin: bo'sh katak bosilsa, **{o'yinchidan nima so'ralsin}** so'rasin va bandni `bandlar` jadvaliga yozsin; javob kelgach katak band bo'lsin.
     > Band saqlangach `band-qildi` hodisasini yuborsin.
     > Nima buzilmasin: **{band katak uchun qoida}** — buni Backend tekshirsin. Animatsiyalar va `vaqt-tanladi` hodisasi qolsin.
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — Antigravity o'zgargan fayllarni aytadi: ular `backend/` va `web/` ichida bo'lsin. Ikkala terminal xatosiz, sahifa o'zi yangilanadi.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — saytni ikki oynada oching. Birinchisida shanba 19:00 ni o'z ismingiz bilan band qiling (18:00 ni band qilmang — 10-darsdagi sinov vazifasi shu vaqt uchun); ikkinchisida sahifani yangilamasdan o'sha katakni
     band qilib ko'ring — «Bu vaqt band» chiqsin. Neon'dagi **SQL Editor**'da: `SELECT kun, soat, ism FROM bandlar WHERE soat = '19:00';` — bitta qator (17:00 va 20:00 — 7-darsdagi namuna bandlar). Umami'da `band-qildi` — bitta.
  5. **O'z g'oyangiz** — MVP'ingizning asosiy harakati uchun shu talabni yozing: qayerda, nima qilsin, nima buzilmasin. Uyda o'z loyihangizda Antigravity'ga yuborasiz.
- O'ng tomon — «Kutilgan natija (namuna: «Maydon»)»: ikki brauzer oynasi yonma-yon — 1-oyna: 19:00 band, «Band qilindi»; 2-oyna: «Bu vaqt band — boshqa vaqtni tanlang».
  Ostida jadval-karta (Neon · SQL Editor):
  | kun | soat | ism |
  |---|---|---|
  | 2026-10-10 | 19:00 | Jasur |
- **Harakat → Vizual o'zgarish:** «Bajardim» → chapdagi qadam ✓, keyingisi ochiladi; 5/5 da qadam paneli yopiladi, kutilgan natija fokusga (199).
- Hammasi bajarilgach (yashil): Band qilish ishlayapti: bitta katakka faqat bitta band yoziladi. (64)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-09-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 3 · 1-savol ✅ (jonli ball)  ← QTest · kalit **B**
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Ikki o'yinchi bir vaqtda 18:00 ni bosdi. Qaysi qism hal qiladi?** (`h-ask`, 10 so'z — S-001)
  - Sayt — qaysi telefon birinchi bosganini ko'rib
  - ✔ Backend — yozishdan oldin Database'ni ko'rib
  - Umami — har `vaqt-tanladi` hodisasini sanab
  - Maydon egasi — Database'dagi ro'yxatni ko'rib
- To'g'ri izohi: Backend tekshiradi; ikki so'rov bir lahzada kelsa ham Database ikkinchisini yozdirmaydi.
- Xato izohlari (≤60):
  - A: Har telefon faqat o'zini biladi — boshqasini ko'rmaydi.
  - C: Umami hodisani sanaydi, bandni to'xtatmaydi.
  - D: Ega ro'yxatni keyin ko'radi — o'shanda ikkalasi yozilgan.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 4 · Tushuncha 2 — ega sahifasi  ← QTushuncha
- Eyebrow: Tushuncha · ega sahifasi
- Sarlavha: **O'yinchilarning telefon raqamini kim ko'ra oladi?** (49)
- Mentor: Ism va telefon `bandlar` jadvalida turadi, o'yinchi sahifasiga esa faqat soat va holat boradi. Ega sahifasiga uch xil kirib ko'ring.
- Bashorat (ballsiz, 181): **Ega sahifasi manzilini bilgan odam bandlar ro'yxatini ko'radimi?** · Ha, manzil yetadi · Yo'q, yana nimadir kerak
- Vizual: «Maydon» xaritasining o'rta va o'ng qismi — brauzer `localhost:5173/ega` (parol qatori, ro'yxat joyi bo'sh); Backend qutisida `POST /kirish` va
  `GET /bandlar` (qulf); Database `bandlar` — uch qator (17:00, 18:00, 20:00); chetda o'yinchi telefoni — `GET /vaqtlar` javobi: `18:00 · band`.
- **Harakat → Vizual o'zgarish** (uch tugma: «Parolsiz», «Noto'g'ri parol», «To'g'ri parol»):
  - Parolsiz → sahifa `GET /bandlar` ga tokensiz so'rov yuboradi → qulf qizil yonadi → javob `401` → sahifada «Avval parolni kiriting», ro'yxat bo'sh qoladi.
  - Noto'g'ri parol → `POST /kirish` → Backend parolni `.env` dagi `EGA_PAROLI` bilan solishtiradi → mos emas, qizil → `401` → «Parol noto'g'ri».
  - To'g'ri parol → `POST /kirish` → token konvertda sahifaga qaytadi → `GET /bandlar` + token → qulf yashil ochiladi → Database'dan uch qator →
    ro'yxatga `soat · ism · telefon` qatorlari ajralib kiradi.
  - 3/3 da o'yinchi telefonidagi `18:00 · band` qatori bir lahza yonadi — unda ism ham, telefon ham yo'q.
- Natija qatori: «Taxminingiz: ... · haqiqatda: manzil yetmadi — ro'yxat faqat token bilan keldi».
- Xulosa: Ega sahifasi manzili sir emas. Ro'yxatni Backend faqat token bilan beradi, parol `.env` da turadi. (96)
- Tugma (pastki): Uch xil kiring (N/3) → Davom etish
- Tugagach (199): harakat paneli yopiladi, xarita butun enga; `GET /bandlar` qulfi fokusda.

## A2 · Amaliyot 2 — ega sahifasi  `(≈20 daq)`  ← amaliyot bloki
- Eyebrow: Amaliyot 2 · ega sahifasi
- Sarlavha: **Bandlar ro'yxati faqat maydon egasiga ochilsin.** (47)
- Mentor: Parolni talabga yozmaysiz — u faqat `.env` da turadi. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — `backend/.env` ga ikki qator qo'shing: `EGA_PAROLI=` (o'zingiz o'ylagan parol) va `JWT_SECRET=` (tokenni imzolaydigan uzun tasodifiy qator). Ikkala terminal ishlab tursin.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: saytda yangi `/ega` sahifasi; Backend'da `POST /kirish` va `GET /bandlar`.
     > Nima qilsin: `POST /kirish` parolni `.env` dagi `EGA_PAROLI` bilan solishtirsin, to'g'ri bo'lsa token bersin; `/ega` sahifasi **{egaga nima ko'rinsin}** ko'rsatsin.
     > Nima buzilmasin: `GET /bandlar` tokensiz javob bermasin. Parol va `JWT_SECRET` kodda ham, repo'da ham bo'lmasin. **{o'yinchi sahifasida nima ko'rinmasin}**.
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — Backend yangi `.env` qatorini o'qishi uchun uni qayta ishga tushiring: Ctrl+C, keyin `npm run start:dev`.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — `localhost:5173/ega`: avval noto'g'ri parol — «Parol noto'g'ri»; keyin to'g'risi — shanba ro'yxatida 19:00 va sizning ismingiz.
     Brauzerda `localhost:3000/bandlar` ni oching — ro'yxat emas, `401` chiqsin.
  5. **O'z g'oyangiz** — MVP'ingizda faqat bir kishi ko'radigan ma'lumot bormi? Bor bo'lsa, shu talabni unga yozing; yo'q bo'lsa, «Bajardim»ni bosing.
- O'ng tomon — «Kutilgan natija (namuna: «Maydon»)»: brauzer `localhost:5173/ega` — «Shanba · bandlar»: `19:00 · Jasur · +998 90 000 00 03`;
  ostida ikkinchi brauzer qatori `localhost:3000/bandlar` → `{"statusCode":401,"message":"Unauthorized"}`.
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam ✓; 5/5 da panel yopiladi, o'ngdagi ega sahifasi fokusga, ro'yxat qatori ajralib kiradi (199).
- Hammasi bajarilgach (yashil): Ro'yxat faqat egada: token bilan ochiladi, tokensiz — `401`. (58)
- Qator (`QIzoh`, natija ostida; audit): Bu — bitta egali MVP uchun sodda kirish. Ko'p foydalanuvchili mahsulotda kirish boshqacha quriladi. (99)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-09-done` (parolni `.env` ga o'zingiz yozasiz)
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 5 · 2-savol ✅ (jonli ball)  ← QTest · kalit **C**
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Ega sahifasi kodini kimdir GitHub'da o'qidi. Bandlar ro'yxatini ocha oladimi?** (`h-ask`, ikki qism, 10 so'z — S-001)
  - Ha — sahifa kodida token ham yozilgan
  - Ha — kodda `GET /bandlar` manzili bor
  - ✔ Yo'q — tokensiz `GET /bandlar` 401 qaytaradi
  - Yo'q — `.env` fayli kodni yashirib turadi
- To'g'ri izohi: Kodni o'qish yetmaydi: Backend ro'yxatni faqat to'g'ri token bilan beradi.
- Xato izohlari (≤60):
  - A: Token kodda turmaydi — u kirgandan keyin beriladi.
  - B: Manzilni bilish yetmaydi — tokensiz `401` qaytadi.
  - D: `.env` parol kabi qiymatlarni saqlaydi, kodni emas.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## A3 · Amaliyot 3 — deploy  `(≈20 daq)`  ← amaliyot bloki
- Eyebrow: Amaliyot 3 · deploy
- Sarlavha: **«Maydon»ni internetga chiqaring, telefondan oching.** (51)
- Mentor: `localhost` faqat sizning laptopingizda ochiladi, boshqa odamning telefonida emas. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — avval `git push`. render.com → «New → Web Service» → `maydon` repo'ngiz; Root Directory — `backend`, tarif **Free**.
     «Environment» bo'limiga `DATABASE_URL`, `EGA_PAROLI` va `JWT_SECRET` — qiymatlari `.env` dan. «Deploy Web Service» — tayyor bo'lgach manzil chiqadi: `....onrender.com`.
  2. **Prompt** — Render manzilini yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: saytdagi Backend manzili va Backend'ning ruxsat ro'yxati (CORS).
     > Nima qilsin: sayt Backend manzilini `VITE_API_URL` dan olsin (laptopda `http://localhost:3000`, Netlify'da **{Render manzilingiz}**);
     > Backend `localhost:5173` dan va `WEB_ORIGIN` dagi Netlify manzilidan kelgan so'rovga ruxsat bersin.
     > Nima buzilmasin: sayt Netlify'da turganda `/ega` sahifasi to'g'ridan ochilsa ham ishlasin.
     > Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — app.netlify.com → yangi loyiha → GitHub'dan import → o'z `maydon` repo'ngiz. Base directory `web`, build `npm run build`,
     publish `dist` (base'ga nisbatan); sozlamada `VITE_API_URL` (Render manzili) va `VITE_UMAMI_ID`. Netlify manzilini Render'da `WEB_ORIGIN` ga yozing. Havola chiqadi: `....netlify.app`; keyin har push'da sayt o'zi yangilanadi. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — telefonda `....netlify.app` ni oching: shanba 21:00 ni band qiling, keyin `/ega` da parol bilan kirib, bandni ko'ring.
     Umami'da uch qadam: sahifa ochildi → `vaqt-tanladi` → `band-qildi`. Bepul Backend 15 daqiqa ishlatilmasa uxlab qolishi mumkin — keyingi birinchi so'rov sekinroq javob beradi.
  5. **O'z g'oyangiz** — shu talabni o'z MVP'ingizga yozing: Render manzili o'rniga o'zingizniki. Uyda o'z loyihangizni ham shu yo'l bilan chiqarasiz.
- O'ng tomon — «Kutilgan natija (namuna: «Maydon»)»: telefon maketi `maydon-....netlify.app` — Shanba · 21:00 band · «Band qilindi»;
  ostida Umami'dagi uch qadam: sahifa ochildi 1 → `vaqt-tanladi` 1 → `band-qildi` 1.
- **Harakat → Vizual o'zgarish:** «Bajardim» → qadam ✓; 5/5 da panel yopiladi, telefon maketi fokusga, Umami sonlari navbat bilan yonadi (199).
- Hammasi bajarilgach (yashil): «Maydon» internetda: telefondan band qilinadi, ega ro'yxatni parol bilan ko'radi. (81)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-09-done` (Render manzilini o'zingiznikiga almashtiring) ·
  bepul Render 15 daqiqa jimlikdan keyin uxlaydi, so'rov kelganda uyg'onadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 6 · Natijalar (podium)
- Jonli reyting: 2 savol + 3 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari: 1 — Bo'sh katakni kim tekshiradi · 2 — Parol qayerda turadi

## 7 · Takrorlash  ← QKartochka (alohida ekran — F-1005-88, foydalanuvchi qarori 05.10)
- Sarlavha: O'zingizni sinab ko'ring.
- 12 karta — «Kartochkalar» jadvali.
- Mentor yo'q (KORPUS §61). Karta ostida, birinchi bosishgacha: Kartani bosing — javob ochiladi · karta yuzi halqada (F-1005-91 B).
- Tugmalar: Orqaga · Yakunlash → (platforma shakli)

## 8 · Yakun  ← QYakun
- Eyebrow: Loyiha kuni · yakun
- Belgi: ✓ MVP internetda
- Sarlavha: **MVP tayyor: boshqa odam ishlata oladi.** (37)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz:
  - Biz belgilagan shu MVP versiyasi «qilamiz» qutisidagi funksiyalar ishlaganda tayyor bo'ladi.
  - Backend avval tekshiradi, Database esa bir katakni ikki marta yozdirmaydi.
  - Hodisa harakat haqiqatan saqlangandan keyin yoziladi.
  - Shaxsiy ma'lumotni Backend faqat token bilan beradi; parol va sirlar `.env` da turadi.
- Uyga vazifa — **yo'q** (172.4): ish repo'da; o'z MVP'ingiz har blokning 5-qadamidagi talablar bilan davom etadi (ekranda alohida blok yo'q).
- Keyingi dars — «Odam ilovangizda qayerda to'xtab qoladi?»: MVP ni boshqa odam ishlatadi, siz esa tushuntirmasdan kuzatasiz.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

### Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Shu MVP versiyasi qachon tayyor? | «Qilamiz» qutisidagi funksiyalar ishlaganda | To'lov va jamoa yig'ish — «keyin» qutisida |
| Bo'sh katak bosilganda band qayerga ketadi? | `POST /bandlar` ga | Backend uni `bandlar` jadvaliga yozadi |
| Bo'sh katakni kim tekshiradi? | Backend | Telefondagi sahifa eskirgan bo'lishi mumkin |
| Katak band bo'lsa, Backend nima qaytaradi? | «Bu vaqt band» | Ikkinchi band jadvalga yozilmaydi |
| `band-qildi` hodisasi qachon yoziladi? | Band saqlangandan keyin | Rad etilgan urinish sanalmaydi |
| Umami qaysi uch qadamni sanaydi? | Ochdi → vaqtni tanladi → band qildi | Oxirgi qadam bugun qo'shildi |
| Ega parolni kiritsa, Backend nima beradi? | Token | `POST /kirish` — parol to'g'ri bo'lsa |
| `GET /bandlar` tokensiz nima qaytaradi? | `401` | Ro'yxat faqat egaga ochiladi |
| O'yinchi sahifasida bandlar haqida nima ko'rinadi? | Soat va holat | Ism va telefon — faqat ega sahifasida |
| Ega paroli qayerda turadi? | `.env` va Render'da | Kodda ham, GitHub'da ham emas |
| Talab qaysi uch qismdan iborat? | Qayerda · nima qilsin · nima buzilmasin | Oxirida: «Boshqa joyga tegma» |
| MVP'ni internetga chiqarish nima deyiladi? | Deploy | Bizda: Backend — Render, sayt — Netlify |

---

## Nishonlar (3)
- **One Booking** — Bitta katakka bitta band yozilishini topdingiz (3-ekran, 1-savol)
- **Safe Password** — Parol kodda emas, `.env` da turishini topdingiz (5-ekran, 2-savol)
- **MVP Live** — Uch amaliyot blokini oxirigacha bajardingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Har kartada emoji o'rniga koddan bitta qator (S-026).

1. 1-savol (3-ekran) — «Bo'sh katakni Backend tekshiradi»
   - `POST /bandlar` · Band yo'li — Sayt bandni Backend'ga yuboradi, Backend uni Database'ga yozadi.
   - `409 · Bu vaqt band` · Rad javobi — Katak band bo'lsa, ikkinchi band yozilmaydi.
   - `band-qildi` · Hodisa — Band saqlangandan keyin Umami'ga yoziladi.
   - Sinfga savol: Nega telefondagi katak rangiga qarab tekshirib bo'lmaydi?
2. 2-savol (5-ekran) — «Parol `.env` da, ro'yxat token bilan»
   - `POST /kirish` · Kirish — Parol to'g'ri bo'lsa, Backend token beradi.
   - `GET /bandlar` · Qulf — Tokensiz so'rovga `401` qaytadi.
   - `EGA_PAROLI=...` · Parol joyi — `.env` da turadi: kodda ham, GitHub'da ham emas.
   - Sinfga savol: Ega sahifasi kodini o'qigan odam ro'yxatni ocha oladimi?

## Jonli viktorina (arena, 12 savol) — ✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3)
1. MVP qachon tayyor deyiladi? ✔ «Qilamiz» qutisidagi funksiyalar ishlaganda · «Keyin» qutisidagi funksiyalar ham qo'shilganda · Har bir tugma va rang mukammal bo'lganda · Birinchi o'yinchi pul to'lab bo'lganda
2. Agent «To'lovni ham qo'shaymi?» desa, nima deysiz? Ha — o'yinchiga qulayroq bo'ladi · ✔ Yo'q — to'lov «keyin» qutisida · Ha — to'lovsiz band qilib bo'lmaydi · Yo'q — to'lov «qilmaymiz» qutisida
3. Bo'sh katakni band qilishdan oldin kim tekshiradi? Sayt — telefondagi katak rangiga qarab · Umami — `vaqt-tanladi` soniga qarab · ✔ Backend — Database'dagi bandlarga qarab · Maydon egasi — bandlar ro'yxatiga qarab
4. Katak band bo'lsa, `POST /bandlar` nima qiladi? Ikkinchi bandni ham jadvalga yozadi · Eski bandni o'chirib, yangisini yozadi · Ikkala o'yinchiga «Band qilindi» deydi · ✔ «Bu vaqt band» deb, bandni yozmaydi
5. `band-qildi` hodisasi qachon yoziladi? ✔ Band Database'ga saqlangandan keyin · «Band qilish» tugmasi bosilishi bilan · Sahifa birinchi marta ochilganda · Maydon egasi ro'yxatni ochganda
6. O'yinchi sahifasida bandlar haqida nima ko'rinadi? Har bandning ismi va telefoni · ✔ Har katakning soati va holati · Ega paroli va kirish tokeni · Hamma o'yinchining telefon raqami
7. `GET /bandlar` ga tokensiz so'rov kelsa, nima bo'ladi? Ro'yxatni to'liq qaytaradi · Faqat ismlarni qaytaradi · ✔ `401` qaytaradi, ro'yxat bermaydi · Ega sahifasini o'zi ochadi
8. Maydon egasining paroli qayerda turadi? Saytning kodida, tugma yonida · GitHub'dagi README faylida · Talab matnida, agentga berilib · ✔ `.env` da va Render sozlamasida
9. Talab qaysi uch qismdan iborat? ✔ Qayerda · nima qilsin · nima buzilmasin · Kim · qachon · qancha vaqt oladi · Muammo · yechim · foydalanuvchi · Rang · shrift · animatsiya turi
10. Talabdagi «nima buzilmasin» qatoriga nima yoziladi? Yangi qo'shiladigan funksiya · ✔ O'zgarmay qolishi kerak bo'lgan ish · Terminalda chiqqan xato matni · Ertaga qilinadigan ishlar rejasi
11. MVP nega internetga chiqariladi? Laptopda tezroq ishlashi uchun · Kodi qisqaroq bo'lishi uchun · ✔ Boshqa odam telefonda ochishi uchun · Umami hodisalarni yozishi uchun
12. Bepul Render'da birinchi javob nega kechikadi? Neon Database'da joy tugab qolgan · Sayt kodi juda katta bo'lib ketgan · Netlify havolasi eskirib qolgan · ✔ Jimlikdan keyin Backend uyg'onadi

**Fon so'zlari** (R-008; kodda {uz, ru}): arena — sayt · Backend · Database · vaqt katagi · band · token · `.env` · deploy · hodisa · talab · MVP · Umami
(o'yin qatlami belgilari qoladi) · uyga vazifa banneri yo'q (172.4).

---

## KOD — razrabotkada qilinadigan narsalar (qolipda yo'q yoki darsga xos)
1. `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards · summary (F-1005-88). `INLINE_KEYS` 2: 3-ekran **1** (B) · 5-ekran **2** (C).
   `RECAPS`, `Q_LABELS`, `ACH_TRIGGERS` — shu indekslar bilan (S-025).
2. **«Maydon» xaritasi** — darsning bitta vizuali: `MAYDON` const (kataklar, to'rt yo'l, `bandlar` jadvali, ega ro'yxati, Umami'dagi uch qadam, MVP ro'yxati qatori) → `MaydonXarita`.
   4-dars kodi bor bo'lsa, chizma o'shandan olinadi (bitta manba — 180). `// qolip-maket:` e'loni. Holat o'quvchi bosishidan chiziladi (P-046).
3. **Tushuncha 1:** ikki telefon maketi (bitta komponent, ikki nusxa) + `POST /bandlar` tekshiruvi + `409` + Umami hisoblagichi; «eski holat» yorlig'i.
4. **Tushuncha 2:** brauzer `/ega` maketi + `POST /kirish` / `GET /bandlar` qulfi; uch tugma (Parolsiz · Noto'g'ri parol · To'g'ri parol); o'yinchi telefonidagi `GET /vaqtlar` qatori.
5. **Amaliyot bloki A1–A3:** skelet `ScreenBlok` + `QBlok`, **5 qadam** (4 + «O'z g'oyangiz», qaror 8) — `steps.length` 5 bilan ishlashi, «5/5» va qulf tekshiriladi.
   Kutilgan natija maketlari: A1 — ikki brauzer oynasi + jadval-karta · A2 — ega sahifasi + `401` qatori · A3 — telefon maketi + Umami'dagi uch qadam.
   «Ortda qoldingizmi»: A1 `dars-09-start`, A2 va A3 `dars-09-done` (skelet qoidasi: birinchi blok — boshlanish holati, keyingilari — tayyor).
   `git fetch <maydon repo> --tags` qatori — repo manzili ma'lum bo'lgach (TAYANCHGA SAVOL 5).
6. Ekran turlari: 0 `QKirish` (maket + radio) · 1 `QReja` · 2, 4 `QTushuncha` (`zoom`, `tugadi`, `QBashorat`, `QTaxmin`) · 3, 5 `QTest` · 7 `QKartochka` (alohida ekran) · 8 `QYakun`.
7. `QYakun` **`uyga` siz** (172.4) — qolip bo'sh `uyga` bilan to'g'ri chizishini tekshirish; bo'lmasa qolipga kichik shart (KOD, asosiy seans).
8. Nishonlar 3 (`ACHIEVEMENTS`): One Booking (3-ekran) · Safe Password (5-ekran) · MVP Live (A3 oxirgi «Bajardim», bonus).
9. `QUIZ_BANK` 12 — shu MD'dan; ✔ 3/3/3/3 (q23). `FLASHCARDS` 12; `QZ_BG_SHAPES` so'zlari {uz, ru}.
10. App.jsx `m7-09` qatoriga `comp: MvpCompleteLesson` — «qur» bosqichida (asosiy seans).
11. `narrow` faqat 3, 5, 6-ekranlarda (171).
12. Darvozalar: `npm run gates -- src/7-Modull/MvpCompleteLesson.jsx` 12/12 · `lint:olchov` 0 warn · `lint:emoji` (qolip) 0 · `lint:jsx` 0 · surat 1280 + 390.
13. ru — uz tasdiqlangach, bir yo'la (6-RU).

✎ **Kodda chetlashishlar (quruvchi, 05.10 — o'quvchi matni o'zgarmagan; MD ga taklif sifatida):**
- 1-ekran repo qatori: `dars-08-done` o'rniga `dars-09-start` (tayanch 3-jadval, K10 — eski teg nomi yozilmaydi).
- 0-ekran maketi: telefon yonida agent pufagi «Antigravity · To'lovni ham qo'shaymi?» (SABOQ 3 — Mentor aytgan taklif sahnada ko'rinsin; matn arenaning 2-savolidan).
- 4-ekran namuna qatorlari: 17:00 · Sardor · +998 90 000 00 01 va 20:00 · Otabek · +998 90 000 00 02 (MD da ism yo'q edi); 18:00 · Jasur · …03 (2-ekrandan).
- 2/4-ekran xaritasidagi qisqa yorliqlar (MD da yo'q): konvert ustida `{ kun, soat, ism, telefon }`, `18:00 ?`, «javob», `token`, `GET /bandlar + token`, «uch qator»; Backend qutisida «18:00 — bo'sh ✓» / «18:00 — band ✕», `.env · EGA_PAROLI` qatori; katakda «band», o'yinchi kartasida «o'yinchi telefoni».
- 4-ekran: uch kirish navbat bilan (Parolsiz → Noto'g'ri parol → To'g'ri parol), keyingisi halqada (SABOQ 11, 13).
- Arena 7-savol: `401` kod-bezaksiz yozildi (lint-tell: kod belgisi faqat to'g'ri variantda edi); so'zlar o'zgarmagan.
- Prompt satrlari nusxalanadigan oddiy matn — `…` belgilarisiz; A1 4-qadamda «SQL Editor» qalin emas.

## REPO — `maydon` ga nima qo'shiladi (`dars-08-done` → `dars-09-done`)
1. **Boshlanish = `dars-08-done`:** kataklar `GET /vaqtlar` dan, kun almashtiriladi, uch animatsiya, `vaqt-tanladi` hodisasi, bitta tanlangan namuna.
2. **A1:** `POST /bandlar` (`kun`, `soat`, `ism`, `telefon`) → `bandlar`; o'sha kun va soat band bo'lsa `409` «Bu vaqt band» va yozilmaydi (Backend tekshiradi;
   jadvalda `kun + soat` noyob — ikki so'rov bir lahzada kelsa ham); saytda katak bosilganda forma (ism, telefon) + «Band qilish»; javob kelgach kataklar yangilanadi,
   «Band qilindi» (5-dars elementi); faqat muvaffaqiyatda `band-qildi` hodisasi; rad bo'lsa xabar va kataklar yangilanadi.
3. **A2:** `backend/.env` — `EGA_PAROLI`, `JWT_SECRET` (`.env.example` da bo'sh qatorlar); `POST /kirish` → token; `GET /bandlar?kun=` faqat token bilan, aks holda `401`;
   saytda `/ega` sahifasi (parol, kun bo'yicha `soat · ism · telefon`); `GET /vaqtlar` javobida ism va telefon yo'qligi tekshiriladi.
4. **A3:** `backend/` Render uchun tayyor (Dockerfile yoki build/start buyruqlari — TAYANCHGA SAVOL 6); saytda Backend manzili `VITE_API_URL` da
   (`web/.env` — `http://localhost:3000`, Netlify — Render manzili); Backend CORS: `localhost:5173` + `WEB_ORIGIN` (Render Environment); `web/public/_redirects` (`/* /index.html 200`) — `/ega` Netlify'da to'g'ridan ochiladi;
   README «Internetga chiqarish» bo'limi (Render: `DATABASE_URL`, `EGA_PAROLI`, `JWT_SECRET`, `WEB_ORIGIN` · Netlify: base `web`, publish `dist`, `VITE_API_URL`, `VITE_UMAMI_ID`).
5a. **Ataylab qoldiriladigan kamchiliklar (10–11-darslar shunga tayanadi; tayanch 3-bo'lim):** `dars-09-done` da telefonda «Band qilish» tugmasi forma ostida —
   ekrandan pastda, surmasa ko'rinmaydi; «Band qilindi» belgisi 3 soniyada yo'qoladi (5-dars); kun almashtirgichi — kichik strelkalar (K3). 11-dars faqat tugmani tuzatadi.
5. Teg `dars-09-done` — A1–A3 oxiri (shu MD'dagi «Maydon» namunasi); MD tasdiqlangach yoziladi, push — buyruq bilan.

---

## TAYANCHGA SAVOL (tayanchda yo'q — o'zim qaror qildim, tasdiq kerak)
1. **Deploy xizmatlari** — GATE M M-q7: Backend — Render, sayt — Netlify, ikkalasi GitHub'dan (push → o'zi yangilanadi). Netlify tugma nomlari «qur» da tekshiriladi.
   10-darsda boshqa odam MVP'ni o'z telefonida ochishi uchun sayt ham internetda bo'lishi kerak. Yangi xizmat yo'q. 4-dars chizmasidagi deploy tugunlari bilan bir xil bo'lsin.
2. **Nomlar:** parol o'zgaruvchisi `EGA_PAROLI`, ega sahifasi yo'li `/ega`, rad javobi `409 · Bu vaqt band` — o'zim qo'ydim. 4-dars (kirish chizmasi) va 11-dars bilan bir xil bo'lishi kerak.
3. **`kun` formati** — GATE M K2: sana (`2026-10-10`), ekranda «Shanba».
4. **`dars-09-start` tegi yo'q:** A1 «ortda» — `dars-08-done`, A2 va A3 — `dars-09-done` (skelet `ScreenBlok` izohi bo'yicha).
5. **O'quvchi `maydon` ni o'z GitHub'iga oladimi (fork, 4-dars)?** A3 1-qadam (`git push`, Render o'z repo'sidan) shunga tayanadi. Repo manzili (`git fetch ... --tags` qatori uchun).
6. **Render uchun `backend/`:** Dockerfile 4-dars skeletida bormi yoki 9-darsda qo'shiladimi; Root Directory `backend`. `.env` joyi — `backend/.env` deb yozildi.
7. **Talab ko'rinishi** — uch yorliqli qator («Qayerda» / «Nima qilsin» / «Nima buzilmasin») + «Boshqa joyga tegma, o'zgargan fayllarni ayt.» — 7 va 11-dars bilan bir xil bo'lsin.
8. **«O'z g'oyangiz» qadami** — o'quvchi talabni qayerga yozadi (o'z repo'sidagi fayl nomi)? Boshqa darslarga tegadigan nom o'ylab topmadim — MD'da joy aytilmagan.
9. **Namuna ma'lumot:** jadval qatorlaridagi ism va telefon (`Jasur`, `Bekzod`, `+998 90 000 00 03`) — qahramon emas, ma'lumot qatori. Ruxsat bormi yoki ismsiz namuna kerakmi.
10. **10-darsda qaysi MVP sinaladi** — «Maydon» (Mentor misoli, sinov vazifasi «Shanba 18:00») yoki o'quvchining o'z MVP'si? «Keyingi dars» qatori neytral yozildi.
11. **Umami:** sayt internetga chiqqanda 6-darsdagi o'sha Umami sayti ishlatiladimi yoki domen qo'shiladimi (6-dars sozlamasiga bog'liq).
12. **MVP ro'yxati nomlari** — «MVP ro'yxati» va «qilamiz / keyin / qilmaymiz» «qutisi» — 3-dars bilan bir xil bo'lsin.

## Shubhali joylar (ishonchim komil emas)
- Render forma yozuvi «Root Directory» — 5-Modulda ishlatilmagan; Render hujjatida tekshirish kerak (§182: UI-yozuv taxmin qilinmaydi).
- 0-ekran hook: «Qilamiz» so'zi faqat 2-variantda — sof so'rovnoma bo'lgani uchun qoldirildi; ko'rikda shakl belgisi bo'lib tuyulsa, variantlar qayta yoziladi.
- 5-ekran B-varianti («kodda `GET /bandlar` manzili bor») — o'zi rost fakt; yanglish tasavvur «manzil yetadi» ekanini izoh aytadi (S-004 chegarasida).

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (`m7-08` «Yaxshi interfeysdan nimani olasiz?» · `m7-10` «Odam ilovangizda qayerda to'xtab qoladi?»; `m7-09` «Loyiha kuni: MVP tayyor»)
- [x] Bitta misol-ip («Maydon», tayanch 1) · metafora yo'q · bitta vizual dars bo'yi — «Maydon» xaritasi (0, 1, 2, 4, A1–A3)
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» (2 — ikki telefon, 4 — uch kirish; hook, reja va bloklarda ham) — matn-karta yo'q
- [x] Sarlavhalar 39–51 (≤55), bitta qator · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosalar 58–96 · hook javoblari ≤120 · xato izohlari ≤60
  (test savollari `h-ask`, sarlavha emas — S-001 bo'yicha 10 so'z) — sonlar skript bilan sanaldi, yakuniy hukm `lint:olchov` da
- [x] Atamalar tayanch 2 bilan bir xil (sayt · Backend · Database · vaqt katagi · band · hodisa · talab); «server / baza / slot / bron / sinov» yo'q; token va deploy — 4 va 1-Modul ta'rifi ·
  siz-forma; ip va zanjir ot-shaklda; prompt sen-formada (T-002)
- [x] Testlar: variantlar bir shaklda («Qism — qanday» · «Ha/Yo'q — sabab», Ha va Yo'q 2/2), uzunligi yaqin; kalit so'z faqat to'g'rida emas
  (1-savolda «Database» B va D da · 2-savolda `.env` C va D da, «token» A da) · ✔ o'rni yangi dars uchun belgilandi: B va C
- [x] Final DnD yo'q (172 qolipi) — uya izohi masalasi yo'q; arena tartib-savolisiz
- [x] Emoji yo'q (arena, nishon medali — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov» — yo'q; «faqat» — Backend qoidasi, kafolat emas)
- [x] Ichki kodlar o'quvchi matnida yo'q («1-Modulda», «8-darsda» — modul raqamisiz o'quvchi tilida) · tarixiy voqea / real raqam yo'q · «KOD» (13) va «REPO» (5) ro'yxati to'liq
- [x] Karta T · P · S ko'rildi: T-002 (prompt sen-forma) · T-011 (deploy/token — o'tilgan, qayta ta'riflanmadi) · T-014/T-015 («maydon», «band», «katak», «sinov» bir ma'noda) ·
  T-039 (o'quvchi MVP'si «sizning g'oyangiz» — 5-qadamda) · T-047 (Mentor ekranni ta'riflamaydi) · T-064 (dars ekrani «sahifa» deb atalmadi; sahifa — saytniki) ·
  P-001 (bitta ip) · P-015 (reja teglarsiz, App.jsx `sub` bilan mos) · P-026/P-028 (tashqi qadamlarda xato yo'li bitta gap; Render/Netlify yo'li 5 va 1-Modulda o'tilgan) ·
  P-036 (Mentor javobni aytmaydi; qavslar javobi — tushunchada) · P-046 (vizual holat bosishdan) · P-052/P-067 (bitta vizual, harakat) · P-059 (blok 4 qadam + qaror 8 qadami) ·
  P-062 (son bir marta) · P-064 (bashorat 2, 4) · S-001/S-004/S-006/S-010 (savol qisqa, har xato alohida tasavvur, Ha/Yo'q teng, izoh javobni aytmaydi) · S-026 (recap — kod qatori) ·
  P-025 — qo'llanmaydi (uyga vazifa yo'q, 172.4)
- [ ] (ochiq) TAYANCHGA SAVOL 1, 2, 5, 6 — deploy yo'li va nomlar 4/7/11-dars MD'lari bilan solishtirilmagan (ular parallel yozilmoqda); asosiy seans bitta jadvalda tekshiradi
- [ ] (ochiq) Sarlavha/Mentor uzunligi kodda `lint:olchov` bilan o'lchanadi; ru — 6-RU bosqichida
