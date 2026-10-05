# 6-Modul (LMS: 8-Modul) · 11-dars «Loyiha kuni: mobil ilova» — MD v3 (172-qonun qolipi)

Fayl: `src/6-Modull/MobileAppPracticeLesson.jsx` · **8 ekran + 3 amaliyot bloki = 11** (20 edi) · faqat o'zbekcha (ru — kod bosqichida, RU_TARJIMON_SHABLON bilan)
Asos: `11-MobileAppPractice-v2.md` (matn) · namuna: `feedback/F-1002-mexanizm/05-BotAiProject-v2.md` (172 qolip) va `01-SystemArchitecture-v3.md` (harakat-ekran).
Menyu nomi: App.jsx da hozir «Praktika: mobil ilova (mini-do'kon)» — **KOD: App.jsx nom** → «Loyiha kuni: mobil ilova» (ip endi AvtoPizza; 13-dars «Loyiha kuni: to'liq tizim» bilan bir shakl — S2 savol).
Oldingi dars — m6-10 «RN: komponent, navigatsiya, API» · keyingi — m6-12 PM «Bugun qaysi ish boshlanadi?».
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatga keltiriladi — `.jsx` ga hozir tegilmaydi.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi: 1-savol ✔ D (eski s12 o'rni) · 2-savol ✔ B (eski s9) · arena 12 savol — kodda qanday bo'lsa.
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 55.

---

## A. Darsning tayanchi

1. **Bitta natija.** Dars oxirida o'quvchining telefonidagi AvtoPizza ilovasida savat bor, «Yuborish» bosilsa buyurtma backend'ga ketadi, bot sizga
   «Yangi buyurtma (mobil)» xabarini yuboradi. Natija 1-ekranda ko'rsatiladi, 3 blokda quriladi, 7-ekranda sanaladi.
2. **Bitta ip — AvtoPizza** (bot darslari → 9–10-darsdagi ilova → bugun). Menyu repo'dan (`src/api/menyu.ts`): Margarita 45 000 · Pepperoni 55 000 · Pishloqli 50 000 so'm.
   Namuna savat dars bo'yi bitta: **Pepperoni va Margarita → jami 100 000 so'm**, manzil «Chilonzor, 12-uy» (8-dars va bot darslaridagi namuna bilan bir xil).
3. **Repo oldindan bor:** `TelegramBotNest` — bot (bot darslari); `web/` sayt, `POST /buyurtma` va adminga xabar (8-dars); `mobile/` — 10-darsdagi Expo ilova
   (Menyu + Tafsilot, `GET /menyu`, backend manzili `BACKEND` — `mobile/config.js`).
   Promptda texnologiya aytilmaydi — u repo'da; prompt faqat **nima qilsin** deydi. Kodni AI Antigravity'da yozadi (bot darslaridagi kabi).
4. **Xato bo'lsa — bitta yo'l** (har blok 3-qadamida bir xil): «Shu xato chiqdi: {xato}. Tuzat.»
5. **Atamalar (bir ma'no — bir so'z, T-014):**
   - **savat** — tanlangan pitsalar; kodda `savat`. **savat soni** — sarlavhadagi son (`savat.length`); «badge», «savat soni belgisi» olinadi.
   - **jami** — narxlar yig'indisi (`reduce`); «umumiy summa» yo'q (§225).
   - **state** — React darslari va 9-darsdagi nom (`useState`); «holat (state)» olinadi — «holat» repo'da `users.holat` (bot suhbati) uchun band (T-015).
   - **backend** — `TelegramBotNest` serveri; **`POST /buyurtma`** · **`buyurtmalar` jadvali** — repo nomlari (`/orders`, `/products` olinadi).
     Backend bitta so'rovda bitta taom oladi (`{ taom, manzil }`, 8-dars) — savatdagi har pitsa alohida `POST` bo'lib ketadi.
   - **ekranlar:** Menyu · Tafsilot · Savat · Buyurtma (10-dars bilan bir xil: kodda `Menyu`, `Tafsilot`).
   - **kirish yo'li** — 1-dars atamasi (sayt · bot · mobil ilova). **ulashish** — Expo Go va QR bilan boshqa telefonda ochish («deploy» emas). **sayqal** — `StyleSheet` bilan.
6. **Metafora yo'q** (teatr, «direktor» — v2 da olingan). **Kafolat yo'q:** «asosiy oqim ishladi», «App Store'ga joylash emas».
7. **Ortda qolgan o'quvchi:** har blok ostida — mentor bilan `git checkout -f dars-6-11-done` (o'z kodi o'chadi).
8. **Tushib qolganlar yo'qolmaydi:** sikl, sayqal, sinov, ulashish — blok qadamlarida; ekran nomlari, `navigation.navigate`, «nega telefonda» — arena va kartochkalarda (jadval pastda).

## Darsning ipi va bitta vizual (163/180)

- **Hook:** 10-darsdagi ilova menyuni ko'rsatadi, lekin pitsani buyurtma qilib bo'lmaydi → «Nima yetishmaydi?».
- **Bitta vizual — «AvtoPizza ilovasi + tizim tasmasi»** (manba bitta: `ILOVA` — ekranlar, menyu, tizim tugunlari):
  - **telefon ramkasi** (191: 196:348, 9:41, kamera-orol) — ichida joriy ilova ekrani; tepasida yo'lak `Menyu → Tafsilot → Savat → Buyurtma`
    (o'tilgani ✓, joriysi accent);
  - **tizim tasmasi** (telefon yonida): `Backend` → `buyurtmalar` jadvali (sayt va bot qatorlari bilan) → `Bot` (Telegram chat, «siz» — admin);
  - holatlar: hali yo'q qism — kulrang uzuq skelet (U-041) → oq (qurildi) → accent (joriy) → yashil (ishladi); so'rov — konvert (1-dars `SysMap` kabi).
- 0, 1, 2, 4-ekranlar shu vizualni o'zgartiradi; A1–A3 «kutilgan natija» — o'sha telefon va o'sha chat.
- **Yakun:** ilovadan buyurtma sayt va bot buyurtmalari turgan jadvalga tushadi · keyingi dars — PM «Bugun qaysi ish boshlanadi?».

---

## 0 · Kirish  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Ilovangizga buyurtma uchun nima yetishmaydi?** (44)
- Mentor: 10-darsdagi ilova menyuni backend'dan oladi, lekin mijoz pitsani tanlagach to'xtab qoladi. Pitsani bosib ko'ring.
- Maket (chapda): telefon — Menyu (Margarita 45 000 · Pepperoni 55 000 · Pishloqli 50 000 so'm). Pitsa bosiladi → Tafsilot: «Pepperoni · 55 000 so'm»,
  pastda faqat «Orqaga»; ostida mijoz pufagi: «Pepperoni olmoqchiman. Qayerni bosaman?»
- Savol (o'ngda, radio): **Nima yetishmaydi?**
  - Yangi backend va yangi baza
  - ✔ Savat va buyurtma ekrani
  - Ilovani App Store'ga joylash
- Javob — 2-variant: **Aynan!** Backend tayyor — ilovaga savat va buyurtma ekrani yetishmaydi. (69)
- Javob — 1-variant: **Qiziq fikr!** Backend va baza tayyor — sayt ham, bot ham ularga yozadi. Yetishmagani telefonda. (93)
- Javob — 3-variant: **Qiziq fikr!** Do'konga joylash keyinroq — avval ilovaning o'zida buyurtma berib bo'lsin. (86)
- **Harakat → Vizual o'zgarish:** pitsani bosish → Tafsilot ochiladi, buyurtma tugmasi yo'q (mijoz pufagi chiqadi); variant tanlash → telefonda yetishmayotgan
  qismlar kulrang uzuq skelet bo'lib chiziladi: sarlavhada savat soni, «Savatga qo'shish», Savat ekrani, «Yuborish» — bugun to'ldiriladigan joylar.
- Tugma: Davom etish
✎ Eski hook (sayt telefonda ↔ mobil ilova) — 9-darsda javob berilgan savol edi; endi 10-dars ilovasidan o'sadi (P-021) · mini-do'kon (Olma, Non, Sut) → AvtoPizza (repo ipi, F-1004 Q5 A) · javoblar 2 gapgacha (162)

## 1 · Bugun quramiz  ← QReja
- Eyebrow: Reja
- Sarlavha: **Dars oxirida ilovangiz shunday ishlaydi.** (40)
- Mentor: Saytdagi buyurtma 8-darsda backend'ga ulangan; bugun telefon ham shu yo'ldan keladi.
- Chapda «Dars oxirida …» + chizma (o'zi aylanadi, bosilmaydi): telefon Menyu → Tafsilot → Savat (savat soni 2, jami 100 000 so'm) → Buyurtma
  («Qabul qilindi») → konvert tizim tasmasi bo'ylab `Backend` → `buyurtmalar` → `Bot` → chatda pufak «Yangi buyurtma (mobil)». Sikl 6 soniyada qaytadi.
- O'ngda qadamlar («01 · matn · teg»):
  - 01 · Savat — tanlangan pitsalar, savat soni va jami · `useState`
  - 02 · Buyurtma — telefondan backend'ga, bot sizga xabar beradi · `POST /buyurtma`
  - 03 · Sinash va ulashish — xatoni topib tuzatish, do'st telefonida ochish · `Expo Go`
- Pastki qator (mono, kichik): repo `TelegramBotNest` · boshlang'ich holat `dars-6-11-start` · tayyor namuna `dars-6-11-done`
- Tugmalar: Orqaga · Boshlaymiz →
✎ Eski 1 (5 qadam) + eski 3 «Ilova xaritasi» (4 ekran tugmalari) → tayyor natija chizmasi + 3 qadam; ekran nomlari yo'lakda ko'rinadi (matn ro'yxati emas)

## 2 · Tushuncha 1 — savat state'da  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · savat
- Sarlavha: **Savatga pitsa tushganini ekran qanday biladi?** (45)
- Mentor: AI savat kodini yozganda shu farqni bilsangiz, xatoni o'qiyotganda topasiz. Ikkala pitsani savatga qo'shing.
- Bashorat (ballsiz, 181): **Qaysi telefonda savat soni o'zgaradi?** · Ikkalasida · Faqat `useState` bilan yozilganida · Hech birida — tanlov saqlanadi.
- Vizual (o'ngda, ⛶): ikki telefon yonma-yon, ikkalasida Savat ekrani: sarlavhada savat soni 0, ro'yxat bo'sh, «Jami: 0 so'm». Har telefon ostida bitta kod qatori:
  chapda `let savat = []` · o'ngda `const [savat, setSavat] = useState([])`.
- Harakat (chapda): ikki tugma «Pepperoni qo'shish» · «Margarita qo'shish» — har biri ikkala telefonga bir vaqtda qo'shadi.
- **Harakat → Vizual o'zgarish:** har bosishda —
  - chap telefon: savat soni 0, ro'yxat bo'sh qoladi; ostidagi qator yonadi: `savat.length → 1` (keyin 2) — massiv o'zgardi, ekran bilmadi;
  - o'ng telefon: savat soni 0 → 1 → 2 (bir lahza kattalashadi), ro'yxatga pitsa qo'shiladi, «Jami: 55 000 → 100 000 so'm»; ostida ikki qator yonadi:
    `savat.length → 2` · `savat.reduce((s, p) => s + p.narx, 0) → 100 000`.
  2/2 da harakat paneli yopiladi, ikki telefon butun enga chiqadi (199).
- Natija qatori: «Taxminingiz: Ikkalasida · haqiqatda: faqat `useState` bilan yozilganida» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Savat state'da tursa, savat soni (`savat.length`) va jami (`reduce`) o'zi yangilanadi. (82)
- Tugma (pastki): Ikkala pitsani qo'shing (N/2) → Davom etish
✎ Eski 8 «Savat va jami» (matn + bitta telefon) → solishtirish-tajriba; eski 12 «Telefonda sinov · xato» dagi «savat soni eski qiymatda» xatosi shu yerda ko'rinadi (sababi bilan) ·
`cart` → `savat`, «holat (state)» → «state» (React darslari bilan bir nom) · `useState` React darslarida (State va Effect), `reduce` JavaScript funksiyalar darsida o'tilgan

## A1 · Amaliyot 1 — savat  `(≈15 daq)`  ← amaliyot bloki
- Eyebrow: Amaliyot 1 · savat
- Sarlavha: **Ilovangizga savat qo'shing.** (27)
- Mentor: Savat faqat telefonda yashaydi, shuning uchun bu blokda backend'ga tegmaysiz. «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `TelegramBotNest` papkasini oching. 1-terminal: `npm run start:dev` — «Server 3000-portda ishlayapti».
     2-terminal: `cd mobile` → `npx expo start`. Telefonda Expo Go bilan QR'ni skanerlang — 10-darsdagi Menyu ochiladi.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > `mobile/` ilovasiga savat qo'sh. Savat — `useState` dagi massiv `savat`, hamma ekranlar uchun bitta.
     > Tafsilot ekranida «Savatga qo'shish» tugmasi pitsani `savat` ga qo'shsin.
     > Sarlavhada savat soni: `savat.length`. Uni bosganda Savat ekrani ochilsin.
     > Savat ekrani: pitsalar ro'yxati, ostida «Jami: … so'm» (`reduce` bilan) va «Buyurtma berish» tugmasi (hozircha hech narsa qilmasin).
     > Savat bo'sh bo'lsa: «**{bo'sh savat matni}**». Backend'ga tegma.
  3. **Ishga tushirish** — saqlaganda telefon o'zi yangilanadi. AI kodini o'qing: `savat` `useState` da turibdimi? Xato bo'lsa (terminalda yoki telefonda qizil oyna):
     «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — Pepperoni va Margarita'ni qo'shing: savat soni 2, Savat ekranida «Jami: 100 000 so'm».
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza)», telefon:
  - sarlavha «Savat» · savat soni 2
  - Pepperoni — 55 000 so'm · Margarita — 45 000 so'm
  - Jami: 100 000 so'm
  - tugma «Buyurtma berish» (xira — keyingi blokda ishlaydi)
- **Harakat → Vizual o'zgarish:** har «Bajardim» → o'ngdagi telefon shu qadamga o'tadi: 1 — Menyu ochildi · 2 — prompt kartasida «Nusxalandi» ·
  3 — Expo terminalida xatosiz qayta yuklash (yashil) · 4 — Savat ekrani (son 2, jami 100 000). 4/4 da blok yashil.
- Hammasi bajarilgach (yashil): Savat ishladi: savat soni va jami state'dan hisoblanadi. (56)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan `git checkout -f dars-6-11-done`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Eski 7 «Ilovani AI bilan yig'ing» (simulyatsiya: 4 tugma → kod paydo bo'ladi) → haqiqiy prompt va haqiqiy telefon; eski 5 «Ritm» sikli = blokning 4 qadami
(topshiriq → AI kod → telefonda sinov → tuzatish) — alohida ekran kerak emas

## 3 · 1-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Pitsa qo'shildi, savat soni 0 da qoldi. Sabab nima?** (51)
  - Pitsa narxi backend'dan kelmadi (31)
  - `savat.length` noto'g'ri sanadi (29)
  - Telefon internetga ulanmagan (28)
  - ✔ Savat `let` da, state'da emas (27)
- To'g'ri izohi: Ekran faqat state o'zgarganda qayta chiziladi.
- Xato izohlari (≤60):
  - A: Savat soni narxni emas, pitsalar sonini ko'rsatadi. (51)
  - B: Sanoq to'g'ri — lekin ekran buni bilmadi. (41)
  - C: Savat telefonning o'zida — internet kerak emas. (47)
- Kalit: `correctIdx = 3` (D) · `explainWrong` kalitlari {0, 1, 2}.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Eski s12 «Mobil ilovani qanday sinaymiz?» o'rni (✔ D o'zgarmadi), savol 2-ekran va A1 ga moslandi; eski savol arenada qoladi (8-savol) · eski s4 «Manba» (✔ A) va s5b
«Vazifangiz» (✔ C) — arenada (1, 2-savol) va kartochkalarda

## 4 · Tushuncha 2 — buyurtma yo'li  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · bitta backend
- Sarlavha: **Telefondan buyurtma qaysi jadvalga tushadi?** (43)
- Mentor: Buyurtmani o'zingiz yo'naltiring: har qadamda keyingi qismni bosing.
- Bashorat (ballsiz): **Mobil buyurtma qayerga yoziladi?** · Telefonning o'ziga · Mobil uchun yangi jadvalga · Sayt va bot buyurtmalari turgan jadvalga
- Qadam-ro'yxati (chapda, 163.8): 1 «Yuborish» bosildi · 2 Backend qabul qildi · 3 Jadvalga yozildi · 4 Bot sizga xabar berdi · 5 Javob telefonga qaytdi
- Vizual (o'ngda, ⛶): telefon (Buyurtma ekrani: Pepperoni, Margarita · Jami 100 000 so'm · Chilonzor, 12-uy · «Yuborish») → tizim tasmasi:
  `Backend` · `buyurtmalar` jadvali (2 qator: `sayt · Pepperoni · Yunusobod, 4-uy`, `bot · Pishloqli · Sergeli, 7-uy`) · `Bot` (bo'sh chat).
- **Harakat → Vizual o'zgarish:** «Yuborish» → ikki konvert telefonda turadi (har pitsa — alohida `POST`); o'quvchi tasmadagi KEYINGI qismni bosadi →
  konvertlar ketma-ket o'sha qismga uchadi, chiziq yashil,
  chapdagi qadam ✓:
  - Backend → ichida qator `POST /buyurtma` yonadi;
  - jadval → ikki yangi qator ajralib tushadi: `mobil · Pepperoni · Chilonzor, 12-uy`, `mobil · Margarita · Chilonzor, 12-uy` — sayt va bot qatorlari ostida;
  - Bot → chatda ikki pufak: «Yangi buyurtma (mobil): Pepperoni — 55 000 so'm · Chilonzor, 12-uy» va Margarita'niki;
  - 5-qadamda konvertlar (yashil) telefonga qaytadi, telefonda «Qabul qilindi».
  Noto'g'ri qism (masalan, telefondan to'g'ridan jadvalga) — qism silkinadi, bir qator: «Telefon bazaga to'g'ridan yozmaydi — so'rov backend orqali.» (55)
  5/5 da qadam-ro'yxati yopiladi, tasma butun enga chiqadi (199).
- Joriy qadam kartasi (o'ngda, bitta qator): masalan «Backend buyurtmani qabul qildi va tekshirdi.»
- Natija qatori: «Taxminingiz: Mobil uchun yangi jadvalga · haqiqatda: sayt va bot buyurtmalari turgan jadvalga»
- Xulosa: Sayt, bot va telefon bitta backend'ga yozadi — buyurtmalar bitta jadvalda. (74)
- Tugma (pastki): Buyurtmani yo'naltiring (N/5) → Davom etish
✎ Eski 2 «Tayyor backend — yangi kirish yo'li» (bitta «ULASH» tugmasi + matn) va eski 9 «Buyurtma → backend» (5 qadam «Keyingi») bitta harakat-ekranga:
o'quvchi yo'lni o'zi tanlaydi (184, 1-dars 3-ekran mexanikasi) · uch kirish yo'li: sayt (8-dars), bot, mobil · `POST /orders` → `POST /buyurtma`

## A2 · Amaliyot 2 — buyurtma  `(≈20 daq)`  ← amaliyot bloki
- Eyebrow: Amaliyot 2 · buyurtma
- Sarlavha: **Buyurtmani telefondan backend'ga yuboring.** (42)
- Mentor: `POST /buyurtma` 8-darsdan beri saytdan buyurtma oladi — telefon ham shu yo'ldan keladi. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — ikkala terminal ishlayapti (`npm run start:dev` va `mobile` da `npx expo start`), telefonda ilova ochiq, savatda Pepperoni va Margarita.
  2. **Prompt** — qavs ichini to'ldiring, «Nusxalash», Antigravity'ga:
     > `mobile/` ga Buyurtma ekranini qo'sh. Savat ekranidagi «Buyurtma berish» shu ekranni ochsin.
     > Buyurtma ekrani: savatdagi pitsalar, jami, manzil maydoni va «Yuborish» tugmasi.
     > «Yuborish» → savatdagi har pitsa uchun `BACKEND + '/buyurtma'` ga `POST`: `{ taom: pitsa.nom, manzil, manba: 'mobil' }`.
     > Hammasi o'tsa: «**{tasdiq matni}**», savat tozalansin. Xato kelsa: «Buyurtma ketmadi, qayta urinib ko'ring».
     > Backend'da `POST /buyurtma` `manba` ni body'dan olsin (bo'lmasa — «sayt»); adminga xabarda ham shu manba chiqsin.
  3. **Ishga tushirish** — telefon o'zi yangilanadi. AI kodini o'qing: so'rov `BACKEND` manziliga ketyaptimi, har pitsaga bittadan `POST` bormi.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda va Telegramda tekshirish** — manzil yozib «Yuborish»ni bosing: telefonda tasdiq, Telegramda ikki admin xabari «Yangi buyurtma (mobil): …».
     Neon'da `buyurtmalar` jadvalini oching — ikki yangi qator, manba «mobil».
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza)»:
  - telefon (Buyurtma ekrani): «Qabul qilindi» · Pepperoni — 55 000 so'm · Margarita — 45 000 so'm · Jami: 100 000 so'm · Chilonzor, 12-uy
  - ostida admin chati (bot → siz, `TgChat`): «Yangi buyurtma (mobil): Pepperoni — 55 000 so'm · Chilonzor, 12-uy» ·
    «Yangi buyurtma (mobil): Margarita — 45 000 so'm · Chilonzor, 12-uy»
- **Harakat → Vizual o'zgarish:** har «Bajardim» → 1 — telefonda Savat · 2 — «Nusxalandi» · 3 — Expo terminalida xatosiz qayta yuklash (yashil) ·
  4 — telefonda «Qabul qilindi», chatga ikki pufak tushadi. 4/4 da blok yashil.
- Hammasi bajarilgach (yashil): Telefondan buyurtma sayt va bot buyurtmalari bilan bitta jadvalga tushdi. (73)
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-6-11-done`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Eski 7 «Buyurtma» qadami (simulyatsiya «✅ Buyurtma yuborildi!») va eski 9 → haqiqiy so'rov; F-1004-30: telefonda haqiqiy buyurtma ekrani (pitsalar, jami, «Qabul qilindi»),
emojisiz. «№1042» olinadi — repo'da `id` uuid, o'ylab topilgan raqam ko'rsatilmaydi (T-043) · admin xabari shakli 8-dars bilan bir xil ·
backend'da bitta o'zgarish: `manba` body'dan (8-darsda faqat «sayt» edi)

## 5 · 2-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Buyurtma ekranida «Yuborish» bosilsa, nima bo'ladi?** (51)
  - Buyurtma telefondagi `savat` da qolib ketadi (41)
  - ✔ Backend'ga `POST /buyurtma` so'rovi ketadi (40)
  - Mobil uchun yangi backend ishga tushadi (39)
  - Hech narsa — ilova buyurtma qabul qilmaydi (42)
- To'g'ri izohi: Ilova so'rov yuboradi, backend uni sayt va bot buyurtmalari turgan jadvalga yozadi.
- Xato izohlari (≤60):
  - A: `savat` faqat telefonda — admin uni ko'rmaydi. (44)
  - C: Backend bitta — sayt, bot va telefon uchun umumiy. (50)
  - D: Qabul qiladi — buni Telegramdagi xabar ko'rsatdi. (49)
- Kalit: `correctIdx = 1` (B) · `explainWrong` kalitlari {0, 2, 3}.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
✎ Eski s9 (3-savol), ✔ B o'zgarmadi · «Buyurtma qil» → «Yuborish» (A2 dagi tugma nomi, T-024) · A-variantda ham kod (`savat`) — kod faqat to'g'rida emas (8.4) ·
to'g'ri izoh 2 gapdan 1 ga, «To'g'ri!» so'zisiz

## A3 · Amaliyot 3 — sinash va ulashish  `(≈20 daq)`  ← amaliyot bloki
- Eyebrow: Amaliyot 3 · sinash va ulashish
- Sarlavha: **Ilovani buzib ko'ring, keyin qo'shningizga bering.** (50)
- Mentor: Haqiqiy mijoz siz kutmagan tugmani bosadi — avval shuni qiling. Keyin ilovangiz boshqa telefonda ham ishlashini ko'ring.
- Qadamlar:
  1. **Sinash** — telefonda: bo'sh savat bilan «Buyurtma berish», manzilsiz «Yuborish», «Yuborish»ni ikki marta tez bosing.
     Ilova noto'g'ri ishlagan joyni toping (masalan, ikki bosishda — buyurtmalar ikki baravar).
  2. **Tuzatish prompti** — topilgan joyni aniq yozing, «Nusxalash», Antigravity'ga:
     > «**{tugma yoki ekran}**» da ilova **{nima qildi}**. Kerak: **{nima qilishi kerak}**. Tuzat, boshqa joyga tegma.
  3. **Sayqal** — bitta o'z o'zgarishingiz: `StyleSheet` bilan rang, bo'shliq yoki tugma o'lchami. Promptni o'zingiz yozing.
  4. **Ulashish** — qo'shningiz `npx expo start` dagi QR'ni Expo Go bilan skanerlasin (ikkalangiz bitta Wi-Fi'da). U buyurtma bersin —
     Telegramda bot sizga uning buyurtmasini yuboradi. Bu — sinash uchun ulashish, App Store'ga joylash emas.
- O'ng tomon — «Kutilgan natija (namuna: AvtoPizza)»:
  - telefon (Savat, bo'sh): «Savat bo'sh — menyudan tanlang» · «Buyurtma berish» o'chiq
  - admin chati (bot → siz): «Yangi buyurtma (mobil): Pishloqli — 50 000 so'm · Yunusobod, 4-uy» (qo'shningiz telefonidan)
- **Harakat → Vizual o'zgarish:** 1 — chatdagi takror xabarlar (xato) qizil belgilanadi · 2 — tuzatilgach bittadan · 3 — telefonda yangi rang ·
  4 — chatga ikkinchi telefondan pufak tushadi. 4/4 da blok yashil.
- Hammasi bajarilgach (yashil): Ilova boshqa telefonda ham ishladi — buyurtma o'sha jadvalga tushdi. (68)
- Pastki qator: Ortda qoldingizmi — mentor bilan `git checkout -f dars-6-11-done`
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Eski 11 «Sayqal» (chala/sayqallangan solishtirish), eski 12 «Telefonda sinov · xato» (simulyatsiya) va eski 14 «Expo Go bilan ulashing» (simulyatsiya QR) → haqiqiy
telefonda uch ish · «App Store'ga joylash emas» fakti saqlandi (v2) · bitta Wi-Fi sharti 9-dars bilan bir xil

## 6 · Natijalar (podium)  ← o'zgarmaydi
- Savol yorliqlari: 1 — Savat state'i · 2 — Buyurtma
- Jonli reyting: 2 savol + 3 blok «Bajardim» (`PRACTICE_BASE`).
✎ Eski 5 yorliq (Manba · Vazifa · Buyurtma · Sinov · Xarid oqimi) → 2

## 7 · Yakun  ← QKartochka + QYakun (bitta ekranda, 05-dars namunasi)
- Eyebrow: Tayyor
- Belgi: ✓ Loyiha kuni tugadi · natija halqasi: N/2 to'g'ri javob
- Sarlavha: **Ilovangizdan berilgan buyurtma o'sha tizimga tushadi.** (53)
- Arena tugmasi CODE STRIKE (jonli darsda: «Mentorni kuting»)
- Endi siz bilasiz:
  - Savat state'da turadi: o'zgarsa, savat soni (`savat.length`) va jami (`reduce`) o'zi yangilanadi
  - Telefon buyurtmani `POST /buyurtma` bilan backend'ga yuboradi — savatdagi har pitsa alohida
  - Bitta backend — ko'p kirish yo'li: sayt, bot va mobil ilova bitta jadvalga yozadi
  - Kutilmagan bosishlar xatoni ochadi; tuzatish prompti faqat o'sha joyni tuzatadi
  - Expo Go va QR — ilovani boshqa telefonda sinash usuli, App Store'ga joylash emas
- Kartochkalar (eyebrow «Takrorlash», tepadan — 174): jadval pastda.
- Uyga vazifa:
  - **Ulashing** — ilovani uydagilardan biriga Expo Go bilan bering: u qayerda to'xtaganini yozib oling
  - **Tuzating** — topilgan bitta joyni tuzatish prompti bilan tuzating va telefonda qayta sinang
  - **Saqlang** — o'zgarishlarni GitHub'dagi nusxangizga yuboring: commit va push
- Keyingi dars — PM: **Bugun qaysi ish boshlanadi?** Loyihangizdagi ishlarni uch ufqqa ajratamiz: hozir, uch oydan keyin, olti oydan keyin.
- Nishonlaringiz — N/3
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
✎ Eski 18 (kartochkalar) + 19 (yakun) bitta ekranda · sarlavha «Mini-do'kon mobil ilovangizning asosiy oqimi ishladi» → AvtoPizza ipiga · uyga vazifa «ustoz bergan tayyor loyiha»
→ o'z repo'si (B-1 qarori endi repo bilan bajariladi) · «🚀» olindi (185)

---

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Savatdagi pitsalar qayerda turadi? | State'da (`useState`) | State o'zgarsa, ekran o'zi yangilanadi |
| Savat soni qayerdan olinadi? | `savat.length` | Savatdagi pitsalar soni |
| Jami narxni qaysi usul hisoblaydi? | `reduce` | Narxlarni bitta songa yig'adi |
| Pitsa qo'shildi, savat soni 0 da qoldi — nega? | Savat oddiy o'zgaruvchida | Ekran faqat state o'zgarganda yangilanadi |
| Savatda 2 pitsa — nechta `POST /buyurtma` ketadi? | 2 ta | Backend bitta so'rovda bitta taom oladi |
| Telefon buyurtmani qaysi so'rov bilan yuboradi? | `POST /buyurtma` | Backend uni jadvalga yozadi |
| Mobil buyurtma qaysi jadvalga tushadi? | `buyurtmalar` — sayt va bot buyurtmalari bilan | Bitta backend — ko'p kirish yo'li |
| Telefon bazaga to'g'ridan yoza oladimi? | Yo'q — backend orqali | Baza manzili (`DATABASE_URL`) faqat backend'da |
| Loyiha kunida sizning vazifangiz? | Topshiriq berish, kodni o'qish, sinash | AI kod taklif qiladi — siz tekshirasiz |
| Xato topilsa, butun ilovani qayta yozasizmi? | Yo'q — faqat o'sha joy | «Tuzat, boshqa joyga tegma» |
| Ilovani qo'shningiz telefonida qanday ochasiz? | Expo Go va QR bilan | Bitta Wi-Fi; App Store'ga joylash emas |
| Ilovaga rang va bo'shliq nima orqali beriladi? | `StyleSheet` | Sayqal — ilova ishlagandan keyin |

✎ «Holatda (state)» → «State'da» · `cart` → `savat` · `GET /products`, `POST /orders` → repo nomlari · «navigation.navigate» va «Nega telefonda ham sinash» kartalari olindi
(9–10-dars mavzusi; arenada 11 va 12-savol), «Menyu qayerdan» — arenada (1-savol) · yangi: «Pitsa qo'shildi, son 0» (2-ekran), «Nechta `POST`» (A2),
«Telefon bazaga to'g'ridan» (4-ekran)

## Nishonlar (3)
- 📱 **Mobile Test** — savat soni nega o'zgarmaganini topdingiz (3-ekran, 1-savol)
- 🧾 **Checkout Done** — buyurtma backend'ga `POST /buyurtma` bilan ketishini bildingiz (5-ekran, 2-savol)
- 🧑‍💻 **Project Builder** — uch amaliyot blokini oxirigacha bajardingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
✎ 4 → 3: **API Connected** olindi (uning testi — eski s4 — arenaga ketdi); Project Builder — amaliyot uchun (memory `nishon-bonus-qismaslik`)

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Savat — state'da»
   - `let savat = []` · Oddiy o'zgaruvchi — massiv o'zgaradi, lekin ekran buni bilmaydi.
   - `const [savat, setSavat] = useState([])` · State — `setSavat` chaqirilsa, ekran qayta chiziladi.
   - `savat.length` · `savat.reduce(…)` · Savat soni va jami state'dan o'qiladi.
   - Sinfga savol: Pitsa qo'shildi, savat soni 0 da qoldi — sabab nima?
2. 2-savol (5-ekran) — «Buyurtma — o'sha backend'ga»
   - `fetch(BACKEND + '/buyurtma', { method: 'POST', … })` · Telefon so'rov yuboradi.
   - `buyurtmalar` · Backend uni sayt va bot buyurtmalari turgan jadvalga yozadi.
   - `manba: 'mobil'` · Admin xabari va jadval qatori buyurtma qayerdan kelganini ko'rsatadi.
   - Sinfga savol: «Yuborish» bosilganda nima bo'ladi?
✎ 4 → 2 (S-026: emoji o'rniga kod qatori) · kalit = kod indeksi 4 va 7 (pastda KOD)

## Jonli viktorina (arena, 12 savol) — ✔ o'rni o'zgarmaydi (0·1·2·3·1·0·3·2·0·3·2·1 → 3/3/3/3)
1. Mobil ilova menyuni qayerdan oladi? ✔ Tayyor backend'dan (`GET /menyu`) · Ilova ichiga qo'lda yozilgan ro'yxatdan · Faqat mobil uchun yozilgan yangi backend'dan · Hech qayerdan — baza bo'lmaydi
2. Loyiha kunida sizning vazifangiz nima? Kodni o'qimasdan shundoq ishlatish · ✔ Topshiriq berish, kodni o'qish, sinash · Hamma kodni o'zingiz qo'lda yozish · Faqat ranglar va dizaynni tanlash
3. React Native'da ro'yxatni ko'rsatish uchun qaysi komponent? `<div>` · `<table>` · ✔ `<FlatList>` · `<ScrollView>`
4. «Yuborish» bosilganda nima bo'ladi? Buyurtma faqat telefonda saqlanadi · Umuman hech narsa bo'lmaydi · Yangi mobil backend ishga tushadi · ✔ Backend'ga `POST /buyurtma` ketadi
5. Sarlavhadagi savat soni nimadan olinadi? Backend fayl nomidan · ✔ `savat.length` dan · Rasm o'lchamidan (`width`) · Sahifa sarlavhasidan
6. Jami narxni hisoblash uchun qaysi usul qulay? ✔ reduce · map · filter · sort
7. Expo Go asosan nima uchun kerak? Kodni boshqa tilga tarjima qilish uchun · Yangi backend qurish uchun · Ilovaga rasm chizish uchun · ✔ Ilovani telefonda sinash va ulashish uchun
8. Mobil ilovani qanday sinaymiz? Umuman sinamaymiz · Faqat kompyuterda kodga qarab · ✔ Kodni o'qib, telefonda oqimni bosib · Faqat ranglarni tekshirib
9. Sayt, bot va mobil bir xil buyurtmalarni qanday ko'radi? ✔ Bitta backend va bazaga ulanadi · Har biriga alohida baza quriladi · Ma'lumot qo'lda nusxalanadi · Buni umuman qilib bo'lmaydi
10. Ilova ishlagandan keyin yana nima kerak? Boshqa hech narsa kerak emas · Backend'ni o'chirish — endi kerak emas · Hamma kodni boshidan qayta yozish · ✔ Sayqal — `StyleSheet` bilan
11. Tafsilot ekraniga o'tish uchun nima ishlatiladi? reduce · fetch · ✔ navigation.navigate · StyleSheet.create
12. Nega telefonda ham sinash kerak? Kodni ancha tezroq yuklaydi · ✔ Qurilmaga xos xatolar ko'rinadi · Kod yozish umuman kerak emas · Ulanish uchun internet kerak emas
✎ Faqat matn: 1, 4 — repo endpointlari (`/menyu`, `/buyurtma`), «API server» → «backend» · 4 — «Buyurtma qil» → «Yuborish» · 5 — `cart.length` (holat) → `savat.length` · 9 — «Web» → «Sayt» (8-dars nomi) · 10 — «API endi kerak emas» → «endi kerak emas» (bir so'z: backend)

**Fon so'zlari** (R-008; kod bosqichida {uz, ru}):
- arena: FlatList · Expo Go · fetch · state · reduce · POST /buyurtma · savat · navigate · QR (📱 🛒 olinadi)
- uyga vazifa banneri: amaliyot · loyiha · mashq · natija (o'zgarmaydi)

---

## Eski 20 ekran → yangi 11

| Eski | Nima edi | Qayerga |
|---|---|---|
| 0 | Hook: sayt telefonda ↔ mobil ilova | 0 (qayta: 10-dars ilovasi, nima yetishmaydi) |
| 1 | Reja, 5 qadam | 1 (3 qadam + tayyor natija) |
| 2 | Tayyor backend — yangi kirish yo'li | 4 (harakat-ekran) |
| 3 | Ilova xaritasi (4 ekran) | 1 va bitta vizual yo'lagi |
| 4 | 1-savol: manba (✔ A) | arena 1 |
| 5 | Loyiha kuni ritmi (sikl) | blok qadamlari (4 qadam = sikl) |
| 6 | 2-savol: vazifangiz (✔ C) | arena 2 · kartochka |
| 7 | Ilovani AI bilan yig'ing (simulyatsiya) | A1 + A2 (haqiqiy) |
| 8 | Savat va jami | 2 (harakat-ekran) |
| 9 | Buyurtma → backend (5 qadam) | 4 |
| 10 | 3-savol: POST (✔ B) | 5 (2-savol, ✔ B) |
| 11 | Sayqal | A3 3-qadam · kartochka |
| 12 | Telefonda sinov · xato | 2 (sababi) + A3 1–2-qadam |
| 13 | 4-savol: sinov (✔ D) | 3 o'rni (✔ D, savol yangilandi) · arena 8 |
| 14 | Expo Go bilan ulashing | A3 4-qadam · kartochka |
| 15 | Qoida «4 narsani unutmang» | olindi (F-1004-38) — yakun «Endi siz bilasiz» |
| 16 | Final: xarid oqimini yig'ing | olindi (172: tartibni o'quvchi bloklarda o'zi bosib o'tadi; arena 11) |
| 17 | Podium | 6 |
| 18–19 | Kartochkalar · Yakun | 7 |

---

## KOD — razrabotkada (konveyer 2-QURUVCHI)
1. `SCREEN_META` 20 → 11: hook · plan · concept · practice · test · concept · practice · test · practice · stats · summary. `INLINE_KEYS` 5 → 2:
   kod indeksi 4 → **3 (D)**, 7 → **1 (B)**. Final `s15` (DragDrop) va `ScreenFinalDD` olinadi.
2. Qolip turlari: 0 `QKirish` · 1 `QReja` · 2, 4 `QTushuncha` (`zoom`, `tugadi`, `QBashorat`, `QTaxmin`; 4-ekranda `QQadamlar`) · 3, 5 `QTest` + `QuestionScreen` mantig'i ·
   A1–A3 amaliyot bloki — `ScreenBlok` + `PromptBox` (5-Modul `BotAiProjectLesson.jsx` dan; 08 va 13-dars ham ishlatadi → `src/qolip/` ga bitta nusxa — S3) ·
   7 `QKartochka` + `QYakun`.
3. **Bitta vizual:** `ILOVA` const (ekranlar `Menyu · Tafsilot · Savat · Buyurtma`, `MENYU` repo narxlari, tizim tugunlari `Backend · buyurtmalar · Bot`) →
   `Telefon` (mavjud `Phone`, 191 ramka) + `TizimTasma` (konvert, chiziq, jadval qatori, chat pufagi; `prefers-reduced-motion` — sakrash). `// qolip-maket:` e'loni.
4. `PRODUCTS` (Olma · Non · Sut) → `MENYU` (Margarita 45 000 · Pepperoni 55 000 · Pishloqli 50 000); namuna savat bitta const
   (Pepperoni + Margarita = 100 000 so'm), narx formati «100 000 so'm»; admin xabari shakli 8-dars bilan bir xil.
5. Olinadi: `BUILD_STEPS`, `CHECKOUT_FLOW`, eski `Screen2…Screen14`, alohida `ScreenFlashcards`, `cart-badge` ichidagi 🛒, telefondagi ✅ (F-1004-30).
6. `ACHIEVEMENTS` 4 → 3 (`ACH_TRIGGERS`: 3-ekran → Mobile Test, 5-ekran → Checkout Done; Project Builder — A3 oxirgi «Bajardim»).
7. `RECAPS` 4 → 2, kalit = kod indeksi **4** va **7** (S-025, `SCORED_IDX` bilan mos).
8. `explainWrong`: 3-ekran {0, 1, 2}, 5-ekran {0, 2, 3} — to'g'ri indeks ostida izoh yo'q.
9. `QUIZ_BANK` — 1, 4, 5, 9, 10-savollar matni (✔ o'rni tegilmaydi; q23 3/3/3/3).
10. Arena fon tokenlari `TOK` → {uz, ru} juftlik (R-008).
11. `LESSON_META.lessonTitle` va **App.jsx nom** (DE-205) bir xil: «Loyiha kuni: mobil ilova» (S2); App.jsx `sub` «eski loyihaning mobil versiyasi» → «savat, buyurtma, Expo Go».
12. `narrow` faqat 3, 5, 6-ekranlarda (171). Yakun: `HOMEWORK`, `RECAP`, keyingi dars matni — yuqoridagidek; «🚀», «📝» olinadi (185).
13. Darvozalar: `npm run gates` 12/12 · `lint:olchov` 0 warn · `lint:emoji` qolip 0 · `lint:qolip` q15–q21 · `lint:layout` 1280/1366/390 · surat.

## REPO — `TelegramBotNest` (`/home/kali/Desktop/TelegramBotNest`)
**Boshlang'ich holat `dars-6-11-start` (= `dars-6-10-done`):**
- 8-dars MD v3 dan: `web/` sayt · `GET /menyu` · `POST /buyurtma` (body `taom`, `manzil`; taom `menyu.ts` da bo'lmasa — 400 «Bunday taom yo'q») ·
  `buyurtmalar.manba` («bot» · «sayt») · `/id` buyrug'i · `.env` da `ADMIN_CHAT_ID` · admin xabari «Yangi buyurtma (sayt): Pepperoni — 55 000 so'm · Chilonzor, 12-uy».
- 9–10-dars MD v3 dan: `mobile/` — Expo ilova, `Menyu` (FlatList, `fetch(BACKEND + '/menyu')`) + `Tafsilot` (Stack, `navigate('Tafsilot', { pitsa: item })`),
  `mobile/config.js` da `BACKEND = http://{kompyuter IP}:3000`.

**11-dars qo'shadi (`dars-6-11-done` = shu MD dagi namuna):**
- `mobile/`: `savat` state'i (bitta, hamma ekranlar uchun), sarlavhada savat soni (`savat.length`), `Savat` ekrani (ro'yxat, jami `reduce`, bo'sh savat matni
  «Savat bo'sh — menyudan tanlang»), `Buyurtma` ekrani (pitsalar, jami, manzil, «Yuborish» → har pitsa uchun `POST /buyurtma`
  `{ taom, manzil, manba: 'mobil' }`, tasdiq «Qabul qilindi», savat tozalanadi, xato matni).
- A3 tuzatishlari namunada: bo'sh savatda «Buyurtma berish» o'chiq · yuborilayotganda «Yuborish» o'chiq (ikki bosish — bitta buyurtma) · `StyleSheet` sayqali.
- backend (bitta o'zgarish): `POST /buyurtma` `manba` ni body'dan oladi (bo'lmasa — «sayt»); admin xabarida «(mobil)».
- `README.md` «Darslar va teglar» jadvaliga 6-Modul qatorlari (`dars-6-11-done` — «mobil: savat va buyurtma»), «Papkalar» ga `mobile/`.
- Teglar `dars-6-11-start`, `dars-6-11-done` — origin'ga push (P-028: dars aytgan teg repo'da bo'lishi shart).

---

## Foydalanuvchi hal qiladigan savollar
- **S1 · G3/G2 nomlari bitta bo'lsin.** 11-dars 8 va 10-dars MD v3 ga ergashdi. Qo'shnilar orasida farq bor: body maydoni `taom` (08) ↔ `pitsa` (13);
  ustun `manba` «sayt» (08) ↔ `kirish` «web» (13); manzil `BACKEND` (10) ↔ `API_URL` (09); `GET /menyu` 08 da ham, 09 da ham quriladi.
  **Tavsiya:** `taom` · `manba` (sayt · bot · mobil) · `BACKEND` · `GET /menyu` 8-darsda; 13-dars `kirish` ustunini qo'shmaydi — `manba` ni ishlatadi.
  Savat bitta so'rovda (massiv) ketishi to'g'riroq, lekin 8-dars endpointini o'zgartiradi — hozircha har pitsa alohida `POST` (backend'ga bitta qator tegadi).
- **S2 · Dars nomi.** «Praktika: mobil ilova (mini-do'kon)» — ip endi AvtoPizza. **Tavsiya:** «Loyiha kuni: mobil ilova» (13-dars va 5-Modul loyiha kunlari bilan bir shakl);
  minimal variant — «Praktika: mobil ilova».
- **S3 · Amaliyot bloki qolipda.** `ScreenBlok` hozir faqat 5-Modulda (3 nusxa). **Tavsiya:** 08/11/13 dan oldin `src/qolip/` ga `QBlok` bo'lib ko'chsin (bitta manba).

## Yo'l-yo'lakay topilma (bu dars tashqarisida)
- 5-Modul 5, 7, 9-darslar blok ostida `git checkout -f dars-05-start` / `dars-07-start` / `dars-09-start` deydi — bu teglar repo'da **yo'q** (local va origin tekshirildi:
  faqat `dars-03-start` bor). O'quvchi buyruqni bajarsa — xato. Yechim: teglarni qo'shish (`dars-05-start` = `dars-04-done` va h.k.) yoki `-done` ga almashtirish.

---

## GATE M — o'z tekshiruvim
- [✓] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205) — m6-10 → m6-12 tekshirildi; nom o'zgarishi «KOD: App.jsx nom» + S2.
- [✓] Bitta misol-ip (AvtoPizza, repo menyusi, bitta namuna savat 100 000 so'm); metafora yo'q; bitta vizual — telefon + tizim tasmasi (`ILOVA`).
- [✓] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» (0, 2, 4) — bloklarda ham; matn-karta yo'q; 2 va 4-ekranda ballsiz bashorat.
- [✓] Sarlavha/savol ≤55 (27–53) · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 (46–83) · hook javobi ≤120 (69–93) · xato izohi ≤60 (41–51, blok-xato 55).
- [✓] Atamalar: `state` (React darslari, 9-dars), `reduce` (JS funksiyalar), `GET /menyu` · `POST /buyurtma` · `buyurtmalar` · `manba` · `ADMIN_CHAT_ID` (repo, 08 v3), `BACKEND` · `Menyu` · `Tafsilot` (10 v3),
  «kirish yo'li» (1-dars);
  siz-forma; zanjir/yorliq ot-shaklda («Sinash va ulashish»), tugmalar siz-formada; AI-prompt ichida buyruq shakli (T-002 istisno).
- [✓] Testlar: variant uzunligi 27–31 va 39–42 (to'g'ri variant eng uzun emas); kod-chip to'g'ridan tashqari variantda ham bor; ✔ o'rni: D (eski s12), B (eski s9); arena tegilmagan.
- [✓] Final: 172 qolipida yo'q (olindi) — uya izohi masalasi yo'q.
- [✓] Emoji yo'q (nishon medali — istisno); kafolat gaplari yo'q («asosiy oqim», «App Store'ga joylash emas»).
- [✓] Ichki kodlar yo'q (T6, Modul N) — faqat «10-darsdagi», «bot darslari»; o'ylab topilgan son yo'q (№1042 olindi); «KOD» 13 band, «REPO» 2 + 5 band.
- [✓] Karta T · P · S ko'rildi: T-014/015 (state ↔ holat), T-024 (tugma nomi «Yuborish» matnda aynan), T-043 (raqam), P-001 (ip), P-028 (teglar), P-059 (blok 4 qadam),
  P-064 (bashorat), P-067 (harakat), S-001 (savol ≤12 so'z), S-010 (xato izohi javobni aytmaydi), S-025/026 (recap).
- [ ] Ochiq: S1–S3 javobi. Infratuzilma xavfi (P-026): telefon `BACKEND = http://{kompyuter IP}:3000` ga bitta Wi-Fi orqali yetadi; sinf Wi-Fi'i
  qurilmalarni bir-biridan ajratsa — A1–A3 va qo'shni telefoni ishlamaydi (10-dars bilan umumiy; mentor oldindan tekshiradi).
