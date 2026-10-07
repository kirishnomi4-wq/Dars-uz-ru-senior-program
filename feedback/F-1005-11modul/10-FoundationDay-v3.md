# 11-Modul (kod: `src/9-Modull`) · 10-dars «Loyiha kuni: poydevor — Database, kirish, deploy» — MD v3 (loyiha kuni qolipi)

Fayl: `src/9-Modull/FoundationDayLesson.jsx` · kalit `m9-10` · **8 ekran + 3 amaliyot bloki + kartochkalar = 12** (SABOQ 12: kartochkalar alohida ekran) · faqat o'zbekcha (ru — 6-RU bosqichida)
Asos: dars yangi — hamma ekran noldan · tip AI-PRAKT (dastur: «Vibe-coding: poydevor — Database, autentifikatsiya, deploy — tanlangan stekda» → natija «Mahsulot skeleti ishlaydi») ·
eng yaqin namuna: 9-Modul `09-MvpComplete-v3.md`, `07-MvpFirstScreen-v3.md` va 10-Modul `03-LiveDashboard-v3.md`, ularning FILTR fayllari (tuzilish; matn ko'chirilmadi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hali yo'q.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md`, majburiy): kartochkalar alohida ekran, Mentorsiz · test yorlig'i yo'q · navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan,
Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi · kartada rangli yon chiziq yo'q ·
ko'p elementli mashq ketma-ket · «Maydon Jamoa» nomi o'z rangida, telefon maketida · ekranga kirganda bo'sh, ma'nosiz element yo'q.
⚠️ Testlarda to'g'ri javob O'RNI shu MD da belgilanadi va keyin o'zgarmaydi: 3-ekran **C**, 5-ekran **B**; arena 12 savol — A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa, shundan amaliyot ≈ 60 (A1 · A2 · A3 — har biri ≈ 20; tayanch 9.1).
Menyu nomi (DE-205): App.jsx `m9-10` — «Loyiha kuni: poydevor — Database, kirish, deploy» (osti: «tanlangan stekda: ilova Backend'ga ulanadi») ·
oldingi dars `m9-09` «React Native va Expo: prototip telefonda» · keyingi `m9-11` «Loyiha kuni: 1-asosiy funksiya» (App.jsx 380–382-qatorlar, grep bilan; `comp` — «qur» bosqichida, asosiy seans).

---

## A. Darsning tayanchi — qolip, atamalar, misol-ip

1. **Bitta natija (172.2).** Dars oxirida Mentor misoli «Maydon Jamoa» ilovasi telefonda (Expo Go) internetdagi Backend'ga ulanadi: o'yinchi ro'yxatdan o'tadi va kiradi, token telefonda saqlanadi,
   «O'yinlar» ro'yxati Database'dan keladi. Backend — `backend/` (NestJS, TypeORM, Neon), Render'da. Teg: `m11-dars-10-start` (= `m11-dars-09-done`) → `m11-dars-10-done` (tayanch 3, aynan).
   O'quvchi xuddi shu poydevorni uch blokda o'z repo'sida, o'z mahsuloti va trekida quradi; «Maydon Jamoa» — namuna. Natija 1-ekranda ko'rsatiladi, uch blokda quriladi, podiumda sanaladi.
2. **Bugungi asosiy fikr (P-013):** Har funksiyadan oldin poydevor kerak — ikkala telefon so'raydigan umumiy Database, kim ekanini biladigan kirish va telefon Internet orqali topadigan Backend.
   Telefon parolni bir marta yuboradi, keyin token bilan so'raydi; ilovaga faqat ochiq qiymat (Backend manzili) yoziladi, maxfiy kalit — faqat Backend'da.
   Agent talabga tayanib quradi, aytilmagan joyni taxmin qilishi mumkin (tayanch 7.2) — har blokning 4-qadami shu tekshiruv.
3. **Texnik aniqlik (tayanch 1.6, 1.7, 3, 6 — aynan; taxmin emas):**
   - Jadvallar: `oyinchilar` (`id` · `ism` · `telefon` · `parol_hash`) · `oyinlar` (`id` · `kun` · `soat` · `maydon` · `kerak` · `tashkilotchi_id` · `yaratilgan`) ·
     `ishtirokchilar` (`oyin_id` · `oyinchi_id` · `holat` · `yaratilgan`) — bu darsda bo'sh (qo'shilish — keyingi darslar).
   - Yo'llar: `POST /royxat` (ism, telefon, parol) · `POST /kirish` (telefon, parol → token) · `GET /oyinlar` (faqat token bilan, aks holda `401`).
   - `backend/.env` — `DATABASE_URL`, `JWT_SECRET` (maxfiy kalit) · `mobil/.env` — `EXPO_PUBLIC_API_URL` (maxfiy emas — ilovaga ochiq yoziladi). Render'da Environment: `DATABASE_URL`, `JWT_SECRET`.
   - Token telefonda — `expo-secure-store` («encrypt and securely store key-value pairs locally on the device»; Expo Go'da ishlaydi, web'da yo'q — tayanch 6).
   - `EXPO_PUBLIC_` ogohlantirishi (tayanch 6, aynan): «Do not store sensitive info, such as private keys, in `EXPO_PUBLIC_` variables. These variables will be visible in plain-text in your compiled application» (docs.expo.dev/guides/environment-variables).
     `.env` o'zgarsa — ilovani to'liq qayta yuklash kerak (o'sha sahifa, 06.10 o'qildi); terminalda `r` — «Reload the app on any connected device» (docs.expo.dev/more/expo-cli, 06.10).
   - Telefondagi ilova uchun `localhost` — telefonning o'zi; laptopdagi Backend'ga telefon ulana olmasligi mumkin — shuning uchun Backend shu darsda Render'ga chiqadi (tayanch 1.7).
   - Render (render.com/docs/web-services, 06.10): «New > Web Service» → repo; Root Directory — `backend` (render.com/docs/monorepo-support: build va start buyruqlari shu papkaga nisbatan);
     xizmat `PORT` ga bog'lanadi (default 10000); manzil `….onrender.com`. Bepul xizmat 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈ 1 daqiqa (tayanch 6 → 10-Modul tayanchi 6).
   - Neon (neon.com/docs/connect/connect-from-any-app, 06.10): loyiha sahifasida «Connect» → ulanish satri (`…?sslmode=require…`). Bepul rejada 100 ta loyiha (neon.com/pricing, 06.10) —
     final mahsulot uchun yangi loyiha ochish 9-Moduldagi `maydon` loyihasiga tegmaydi.
   - Mobil ilovaning `fetch` so'rovi brauzer emas — CORS bu yerda kerak emas; web-trekda kerak (`WEB_ORIGIN`, 9-Moduldagidek).
4. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2):**
   - **poydevor** — Database, kirish va deploy: har funksiyadan oldin kerak bo'lgan qism (tayanch 2, so'zma-so'z). 1-ekran Mentorida tug'iladi — hook buning yo'qligini ko'rsatgandan keyin (T-011).
     «fundament», «skelet» — yo'q. Metafora qilib yoyilmaydi («uy», «g'isht» yo'q — TAQIQLAR 2).
   - **kirish** (login, 4-Moduldan) · **ro'yxatdan o'tish** (ekran nomi va harakat) · **token** (4-Modul: parol to'g'ri bo'lsa beriladi, keyingi so'rov u bilan ketadi) — qayta ta'riflanmaydi.
   - **hash** — paroldan yasalgan satr: undan parolni qaytarib bo'lmaydi (4a-Modulda bcrypt bilan tanishgan; 2-ekranda jadval katagidagi yorliq, A1 «Yordam»da, kartochkada). «Shifrlash» — faqat `expo-secure-store` uchun (tayanch 9.4).
   - **Backend** · **Database** · **deploy** (internetga chiqarish) · **agent** (Antigravity) · **prompt** (agentga xabar) · **talab** (qayerda · nima qilsin · nima buzilmasin) · **tekshirish** (o'z ishini ko'rish).
   - **tashkilotchi** · **o'yinchi** · **e'lon** · «Qo'shilaman» — tayanch 2 (bu darsda faqat hookda).
   - **Ishlatilmaydi:** server (prozada), baza, fundament, skelet, login (o'quvchi matnida — «kirish»), sinov (real odam — 12–13-darslar), «ekran» dars ekrani ma'nosida (T-064 — «ekran» faqat ilova ekrani).
5. **Metafora yo'q. Keyssiz** (tayanch 5: loyiha kuni). Real kompaniya raqami yo'q. Raqamlar — faqat Mentor misolidan; namuna ma'lumot (ism, telefon, maydon nomi) — qahramon emas, jadval qatori (tayanch 9.2, 9.8).
6. **Amaliyot bloki (tayanch 4, 9.1):** o'quvchi 4 qadamning **hammasini o'z repo'sida, o'z mahsuloti va trekida** bajaradi (Ochish → Prompt → Ishga tushirish → Tekshirish); 5-qadam yo'q.
   Mentor misoli — namuna: o'ngda kutilgan natija «namuna: Maydon Jamoa» (o'quvchi o'zinikini shunga solishtiradi), «Yordam» ortida — Mentor misolidagi to'liq prompt.
   Talab zinapoyasi: **A1 — tayyor talab + joylar** (`{…}` — mahsulot nomlari, yonida kulrang namuna «masalan: oyinlar», va parol qatori) · **A2 — bitta qator** · **A3 — uch qator**.
   Trek (8-darsdagi tanlov, `pm-m9d8-platforma`) farqi faqat A3 da: 1 va 3-qadamda bir qator, «Yordam» ostida bir gap (9.7); A1, A2 — ikkala trekda bir xil.
   Prompt — agentga buyruq, sen-formada (T-002); har qator o'z yorlig'i bilan, oxirida «Boshqa joyga tegma, o'zgargan fayllarni ayt.» Xato bo'lsa — bitta gap: «Shu xato chiqdi: {xato}. Tuzat.»
   Push odati (10-Moduldan, tayanch 3): `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil · `git add <fayl>` (`git add .` emas).
7. **Real odam bilan ish bu darsda yo'q. Uyga vazifa yo'q** (P-058): ish repo'da.
8. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; telefon, terminal, brauzer maketlari chizilgan (CSS), logotip yo'q; rang — faqat holat foni (D3).
   Matn o'lchovi: sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh ≤60 · xato izohi ≤60 (python bilan sanalgan, qavsda).

## Darsning ipi va bitta vizual

- **Misol-ip:** «Maydon Jamoa» (Mentor misoli, repo `maydon-jamoa`) — mahalladagi mini-futbol uchun jamoa yig'adigan mobil ilova. 9-darsda prototip telefonda ochilgan (Expo Router, uch ekran, namuna ma'lumot);
  bugun unga poydevor qo'yiladi. Kutilgan natija doim «Maydon Jamoa» bilan ko'rsatiladi; o'quvchi har blokni o'z mahsulotida bajaradi.
- **Hook:** ikki telefonda bir xil prototip — o'yinchi «Qo'shilaman»ni bosadi, tashkilotchi telefonida «8 / 10» o'zgarmaydi → ikkala telefon so'raydigan umumiy joy yo'q.
- **Ip (ot-shaklda):** Database va kirish → Internetdagi Backend → Ilova Backend'ga ulanadi.
- **Bitta vizual — «Poydevor xaritasi»** (`POYDEVOR` const → `PoydevorXarita`, dars bo'yi, 163/180):
  - chapda **telefon** — «Maydon Jamoa» (Expo Go), nom o'z rangida; ekranlar: «Ro'yxatdan o'tish» · «Kirish» · «O'yinlar»; telefon ichida kichik qulf-quti `expo-secure-store` (bo'sh / ichida `token`);
  - o'rtada **Backend** qutisi — uch yo'l: `POST /royxat` · `POST /kirish` · `GET /oyinlar` (qulf belgisi bilan); qutining yorlig'i — joyi: `localhost:3000 · laptop` yoki `maydon-jamoa-….onrender.com · Render`;
  - o'ngda **Database · Neon** — uch jadval kartasi: `oyinchilar` · `oyinlar` · `ishtirokchilar`;
  - pastda (4-ekran, A3) **«ilova ichi»** kartasi — `mobil/.env` qatorlari.
  - Holatlar: kulrang (hali yo'q) → oq (ishlaydi) → accent (joriy) → yashil (bugun qurildi) → qizil (ulanmadi / `401`). Konvert — so'rov.
  - Namuna ma'lumot: o'yinlar — Shanba 18:00 · Mahalla maydoni · 10 kishi · Shanba 20:00 · Maktab maydoni · 10 kishi · Yakshanba 10:00 · Park maydoni · 8 kishi · Yakshanba 17:00 · Mahalla maydoni · 10 kishi (tayanch 9.2);
    `oyinchilar` 1-qator — namuna tashkilotchi (`+998 90 000 00 00`); o'yinchi formasi — `Ali · +998 90 000 00 01` (10-Modul namunasi).
  - Ishlatilishi: 0 (ikki telefon, poydevor yo'q) · 1 (tayyor holat) · 2 (kirish yo'li) · 4 (ilova manzili, «ilova ichi») · A1–A3 o'ng (kutilgan natija).
  - `prefers-reduced-motion` da konvert va pulsatsiya harakatsiz, holatlar bir zumda almashadi.
- **Yakun:** ilova internetdagi Backend'ga ulangan · keyingi dars — roadmap'dagi birinchi funksiya.

---

## 0 · Kirish — prototipda «Qo'shilaman»  ← QKirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Qo'shilgan o'yinchini tashkilotchi telefoni ko'radimi?** (54)
- Mentor (bosqichga qarab, SABOQ 11):
  - boshida: Ikki telefonda 9-darsdagi prototip ochiq: chapda o'yinchi, o'ngda tashkilotchi. O'yinchi Shanba 18:00 dagi o'yinga qo'shilmoqchi — avval javobni tanlang.
  - javobdan keyin: «Davom etish»ni bosing — bugungi rejani ko'rasiz.
- Navbatdagi harakat (halqa + yengil pulsatsiya): uchta variant guruhi.
- Maket (chap): ikki telefon yonma-yon — «1-telefon · o'yinchi» va «2-telefon · tashkilotchi»; ikkalasida «Maydon Jamoa» ilovasining «O'yin» ekrani:
  «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · **8 / 10** va qo'shilganlar — ismsiz doiralar · «Qo'shilaman» tugmasi (tayanch 9.15). Telefonlar orasida hech narsa yo'q.
- Savol: **Sizningcha, qaysi biri?**
  - Ko'radi — ikkala telefonda bir xil ilova turibdi (48)
  - Ko'rmaydi — bosish faqat o'yinchi telefonida qoladi (51)
  - Ko'rmaydi — tashkilotchi ilovani qayta ochmaguncha (50)
- Javob — 2-variant: **Aynan!** Prototipda o'yinlar har telefonning o'zida — namuna ma'lumot. Ikkala telefon so'raydigan umumiy joy hali yo'q. (117)
- Javob — 1-variant: **Qiziq fikr!** Ilova bir xil, lekin ma'lumot har telefonning o'zida. Ikkala telefon so'raydigan umumiy joy hali yo'q. (114)
- Javob — 3-variant: **Qiziq fikr!** Qayta ochilsa ham prototip o'z namuna ma'lumotini ko'rsatadi. Ikkala telefonga umumiy joy kerak. (108)
- **Harakat → Vizual o'zgarish:** javob tanlanadi → 1-telefonda «Qo'shilaman» bosiladi → tugma o'chiq «Qo'shildingiz» bo'ladi, doiralarga bittasi qo'shiladi → «8 / 10» → «9 / 10»: son almashadi va bir lahza kattalashib, silliq qaytadi (prototip animatsiyasi, 9.14) →
  2-telefonda «8 / 10» qoladi → telefonlar orasida uzuq chiziq va o'rtada bo'sh kulrang katak paydo bo'ladi, ichida bitta qator: «umumiy joy — hali yo'q».
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish
✎ Hook obyekti — darsning o'qitish obyekti (P-001): poydevor nima uchun kerak. Uchala variant «Ko'radi / Ko'rmaydi — …» shaklida (2 / 1, ✔ juftlikda — §147); uzunlik 48–51.
  3-variant 11-darsdan keyin (Backend bilan) qisman rost bo'ladi — bu darsda prototip haqida (shubhali joylar).

## 1 · Bugun quramiz  ← QReja (172: tayyor natija + 3 qadam + repo teglari)
- Eyebrow: Reja
- Sarlavha: **Dars oxirida ilova internetdagi Backend'ga ulanadi.** (51)
- Mentor: Bugun tanlangan stekda ilova Backend'ga ulanadi. Database, kirish va deploy — har funksiyadan oldin kerak bo'lgan bu qism poydevor deyiladi.
- Chap — «Dars oxirida»: Poydevor xaritasi **tayyor** holatda, bir marta o'zi yuradi (DE-200): telefonda «Kirish» → konvert `POST /kirish` → `token` qulf-qutiga tushadi →
  `GET /oyinlar` + token → Database'dagi to'rt o'yin telefonga keladi (Shanba 18:00 · Shanba 20:00 · Yakshanba 10:00 · Yakshanba 17:00). Backend yorlig'i `maydon-jamoa-….onrender.com · Render`.
- O'ng — bugungi 3 qadam (tex-karta, bosilmaydi; qadam ostida teg yo'q — 172, F-1003-06):
  - 01 · Database va kirish: o'yinchi kiradi va token oladi (50)
  - 02 · Backend Render'da: telefon unga Internet orqali ulanadi (55)
  - 03 · Ilova Backend'ga ulanadi: o'yinlar Database'dan keladi (54)
- Pastki qator (mono, kichik): repo `maydon-jamoa` · boshlang'ich holat `m11-dars-10-start` · namuna `m11-dars-10-done`
- Pastki qator 2 (kichik): «Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda bajarasiz.
- Tugmalar: Orqaga · Boshlaymiz
✎ Mentorning birinchi gapi — App.jsx menyu osti yozuvi (P-015). «poydevor» shu yerda tug'iladi: hook umumiy joy yo'qligini ko'rsatgan (T-011); ta'rif tayanch 2 dan so'zma-so'z.

## 2 · Parol bir marta, keyin token  ← QTushuncha
- Eyebrow: Tushuncha · kirish
- Sarlavha: **Ilova qayta ochilsa, parol yana so'raladimi?** (44)
- Mentor (bosqichga qarab, SABOQ 11):
  - bashoratgacha: Avval taxminingizni belgilang, keyin o'yinchi bo'lib ro'yxatdan o'ting.
  - harakat paytida: Navbatdagi tugmani bosing va Database bilan telefonda nima o'zgarishini kuzating.
  - tugagach: Uchala qadam tugadi — natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181) birinchi keladi, kartasi halqada: **Qayta ochilganda ilova nima ko'rsatadi?** · «Kirish» ekranini · «O'yinlar» ro'yxatini.
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- Chap (harakat): uch tugma navbat bilan (keyingisi halqada): **Ro'yxatdan o'tish** → **Kirish** → **Ilovani qayta ochish**.
- O'ng (vizual): Poydevor xaritasi — telefon «Ro'yxatdan o'tish» ekranida (Ism `Ali` · Telefon `+998 90 000 00 01` · Parol `••••••••`), qulf-quti bo'sh;
  Backend qutisi (yorliq — «Backend», joyi bu ekranda ko'rsatilmaydi); Database `oyinchilar` — bitta qator (namuna tashkilotchi), `oyinlar` — to'rt qator.
- **Harakat → Vizual o'zgarish:**
  - «Ro'yxatdan o'tish» → konvert `POST /royxat { ism, telefon, parol }` Backend'ga → `oyinchilar` ga yangi qator ajralib kiradi `2 · Ali · +998 90 000 00 01 · $2b$10$Qe…` —
    `parol_hash` katagi accent bilan, yonida yorliq «paroldan yasalgan satr — parolning o'zi emas» → telefon «Kirish» ekraniga o'tadi (telefon raqami to'ldirilgan).
  - «Kirish» → konvert `POST /kirish { telefon, parol }` → Backend qutisida «parol ↔ `parol_hash`» solishtiruvi yashil ✓ → javob konverti `token` telefonga qaytadi va qulf-qutiga tushadi (quti yashil) →
    konvert `GET /oyinlar` + token → `GET /oyinlar` qulfi yashil ochiladi → `oyinlar` dagi to'rt qator yonadi → telefonda «O'yinlar»: to'rt karta ajralib kiradi.
  - «Ilovani qayta ochish» → telefon ekrani bir lahza qorayadi va ochiladi → qulf-qutidan `token` chiqadi → `GET /oyinlar` + token → «O'yinlar» ochiladi; «Kirish» ekrani chiqmaydi, parol so'ralmaydi.
- Joriy qator (2/3 dan keyin, bitta): Token telefonda `expo-secure-store` da turadi — u qiymatni shifrlab saqlaydi. (75)
- Natija qatori: «Taxminingiz: … · haqiqatda: «O'yinlar» — token telefonda saqlangan edi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Kirishda parol yoziladi; token telefonda saqlansa, qayta ochganda parol so'ralmaydi. (84) — token yopiq so'rovlarga qo'shiladi (10-FILTR 1, 2)
- Tugadi (199): harakat paneli yopiladi; telefon (qulf-quti bilan), Backend va `oyinchilar` jadvali butun enga, `parol_hash` katagi va qulf-quti fokusda; vizual ⛶ ichida (q17).
- Tugma (pastki): Avval taxminingizni belgilang → Tugmalarni navbat bilan bosing → Davom etish (son yo'q — joriy qadam raqami tugmaning o'zida; pilot ko'rigi 06.10)
✎ Ko'prik (P-020): 9-Modulda parol bitta edi — ega paroli `.env` da; bugun har o'yinchining o'z paroli bor va u Database'da (hash bo'lib) turadi. Bu gap ekranda aytilmaydi — kartochka 4 va A1 «Yordam»da.
  «Ilovani qayta ochish» — bashorat javobini harakat ochadi (P-064); 1-savol shu qoidani boshqa vaziyatda so'raydi (§106).

## A1 · Amaliyot 1 — Database va kirish  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 1 · Database va kirish
- Sarlavha: **Foydalanuvchi ro'yxatdan o'tib, kira oladigan bo'lsin.** (54)
- Mentor: Talab tayyor — kulrang namunalar o'rniga o'z mahsulotingiz nomlarini va parol qatorini yozasiz; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; hammasi o'z repo'ngizda, o'z mahsulotingizda):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching (9-darsdagi holat: ilova papkasi va `prototip/` bor, `backend/` hali yo'q).
     neon.tech'da mahsulotingiz uchun yangi loyiha oching, «Connect»ni bosing va ulanish satrini (connection string) nusxalang.
  2. **Prompt** — joylarni to'ldiring (har joy yonida kulrang namuna — Mentor misolidan), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: repo'da yangi `backend/` — `README.md` dagi arxitektura bo'yicha, port 3000.
     > Nima qilsin: README'dagi jadvallarni yarat (ustunlari README'dagidek).
     > `POST /royxat` (ism, telefon, parol) foydalanuvchini **{foydalanuvchilar jadvali}** ga yozsin; parol jadvalda **{parol jadvalda qanday tursin}**. Bitta telefon ikki marta yozilmasin.
     > `POST /kirish` (telefon, parol) to'g'ri bo'lsa token bersin. `GET /{asosiy ro'yxat}` ro'yxatni faqat token bilan bersin, tokensiz — `401`; eng yangi yozuv tepada (`yaratilgan` bo'yicha kamayib).
     > Tekshirish uchun bitta namuna foydalanuvchi va to'rtta namuna **{asosiy ro'yxat}** yozuvi qo'sh; bor bo'lsa, qayta qo'shma.
     > Nima buzilmasin: **{ilova papkasi}** va `prototip/` papkalari. `DATABASE_URL` va `JWT_SECRET` faqat `backend/.env` da tursin, `.env` — `.gitignore` da. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Joylar yonidagi kulrang namuna: `{foydalanuvchilar jadvali}` — masalan: `oyinchilar` · `{asosiy ro'yxat}` — masalan: `oyinlar` · `{ilova papkasi}` — masalan: `mobil/` ·
     `{parol jadvalda qanday tursin}` — namunasiz (ro'yxatdan o'tish mashqidagi `parol_hash` katagini eslang).
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt):
     > Qayerda: `maydon-jamoa` papkasida yangi `backend/` — `README.md` dagi arxitektura bo'yicha, port 3000.
     > Nima qilsin: uch jadval yarat — `oyinchilar`, `oyinlar`, `ishtirokchilar` (ustunlari README'dagidek).
     > `POST /royxat` (ism, telefon, parol) o'yinchini `oyinchilar` ga yozsin; parol jadvalda o'zi emas, faqat hash'i (`parol_hash`) tursin. Bitta telefon ikki marta yozilmasin.
     > `POST /kirish` (telefon, parol) to'g'ri bo'lsa token bersin. `GET /oyinlar` o'yinlar ro'yxatini faqat token bilan bersin, tokensiz — `401`; eng yangi o'yin tepada (`yaratilgan` bo'yicha kamayib).
     > Tekshirish uchun bitta namuna tashkilotchi va to'rtta namuna o'yin qo'sh; bor bo'lsa, qayta qo'shma.
     > Nima buzilmasin: `mobil/` va `prototip/` papkalari. `DATABASE_URL` va `JWT_SECRET` faqat `backend/.env` da tursin, `.env` — `.gitignore` da. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — `backend/.env` ga ikki qator yozing: `DATABASE_URL=` va Neon'dan nusxa · `JWT_SECRET=` va uzun tasodifiy satr (tokenni imzolaydi).
     Terminalda `cd backend`, `npm run start:dev` — xato yo'q. Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — talabning har qatorini tekshiring:
     (1) Brauzerda `http://localhost:3000/{asosiy ro'yxat}` (masalan `/oyinlar`) — yozuvlar emas, `401` chiqsin: tokensiz yopiq.
     (2) Neon'dagi SQL Editor'da foydalanuvchilar jadvalingizni oching (`SELECT ism, parol_hash FROM …;`) — namuna foydalanuvchi; `parol_hash` ustunida parolning o'zi yo'q — boshqa satr.
     (3) Asosiy ro'yxat jadvalida — to'rtta namuna yozuv. (4) Agent aytgan fayllarda README'dagi jadvallar va uch yo'l bor; `git status` da `backend/.env` ko'rinmaydi. ✎ 10-FILTR 12, 31.
     Mos kelmagan qatorni uch qism bilan agentga yozing.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (terminal + brauzer + jadval kartasi; o'zingiznikini shunga solishtirasiz):
  - `$ npm run start:dev` · `[Nest] LOG Nest application successfully started`
  - brauzer `localhost:3000/oyinlar` → `401 · Unauthorized`
  - Neon · SQL Editor — `oyinchilar`: `Namuna tashkilotchi · $2b$10$…` · `oyinlar`: 4 qator
- Hammasi bajarilgach (yashil): Backend ishlayapti: foydalanuvchi yoziladi, parolning faqat hash'i saqlanadi, ro'yxat token bilan beriladi. (107)
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m11-dars-10-done` —
  qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz (`backend/.env` ga o'z qiymatlaringizni yozasiz).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Blok modeli — tayanch 4 va 9.1 (06.10 01:10): hamma qadam o'z repo'sida, Mentor misoli — namuna (o'ngda va «Yordam»da). Talab zinapoyasi: A1 — tayyor talab, joylar — mahsulot nomlari va parol qatori.
  4-qadam nomi «Brauzerda tekshirish» — Backend hali laptopda (9.9). `POST /royxat` va `POST /kirish` 3-amaliyotda telefondan tekshiriladi.

## 3 · 1-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **O'yinchi ilovani yopib, kechqurun qayta ochdi. Ilova uni qanday taniydi?** (10 so'z)
  - Telefon raqamini Database'dan qidirib topadi
  - Telefonda saqlangan parolni Backend'ga qayta yuboradi
  - ✔ Telefonda saqlangan tokenni so'rovga qo'shadi
  - Database'dagi tokenni o'qib, o'zi tekshirib ko'radi
- Kalit: **C** (index 2). To'rttalasi bir shaklda («nima — qayerdan — fe'l»); «Telefonda saqlangan» B va C da, «token» C va D da, «Database» A va D da (S-003, §204); to'g'ri variant yolg'iz eng uzun emas.
- To'g'ri izohi: Token telefonda saqlangan — ilova uni yopiq so'rovlarga qo'shadi. (65)
- Xato izohlari (≤60):
  - A: Telefon raqami ochiq — u o'yinchi kimligini isbotlamaydi. (57)
  - B: Parol telefonda saqlanmaydi — u kirishda yoziladi. (52)
  - D: Token Database'ga yozilmaydi. Backend uni kimga bergan edi? (59)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD uchun): 2-ekranda «Ilovani qayta ochish» bir zumda bo'ldi; savol boshqa vaqtni (kechqurun) va «qanday taniydi» ni so'raydi — slayddan ko'chirib bo'lmaydi (§106).
  Token muddati shu darsda 30 kun deb olindi (tayanch 9.3) — «kechqurun» shu muddat ichida.

## 4 · Ilova qaysi manzilga so'raydi?  ← QTushuncha
- Eyebrow: Tushuncha · ilova manzili
- Sarlavha: **Ilovaning `.env` fayliga qaysi qator yoziladi?** (44)
- Mentor (bosqichga qarab, SABOQ 11):
  - bashoratgacha: Avval taxminingizni belgilang, keyin qatorlarni bittadan yozib ko'ring.
  - qator paytida: «Yozib ko'rish»ni bosing — telefon va «ilova ichi» kartasida nima bo'lishini kuzating.
  - tugagach: Uchala qator yozib ko'rildi — natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, 181) birinchi keladi, kartasi halqada: **Uch qatordan nechtasi ilovaga yoziladi?** · Bittasi · Ikkitasi · Uchalasi.
  Tanlangach yopilmaydi: ixcham qator «TAXMININGIZ · savol · tanlangan variant» natija chiqquncha turadi.
- O'ng (vizual): Poydevor xaritasi — telefon «O'yinlar» ekranida (kartalar o'rnida kulrang bo'sh joylar); laptop — Backend `localhost:3000 · laptop` (ishlab turibdi, yashil chiroq);
  Render tuguni — Backend `maydon-jamoa-….onrender.com · Render`, ichida qulf belgili `JWT_SECRET` qatori; pastda «ilova ichi» kartasi — `mobil/.env`, hozircha bo'sh.
- Chap (harakat): qatorlar **bittadan** katta karta bo'lib chiqadi (SABOQ 9, 13). Karta: yorliq «Qator N / 3» · qator matni (mono, katta) · bitta tugma «Yozib ko'rish» (navbatdagi harakat — halqa).
  Tartib:
  1. `EXPO_PUBLIC_API_URL=http://localhost:3000`
  2. `EXPO_PUBLIC_JWT_SECRET=k3J9…`
  3. `EXPO_PUBLIC_API_URL=https://maydon-jamoa-….onrender.com`
- **Harakat → Vizual o'zgarish:**
  - 1-qator «Yozib ko'rish» → qator «ilova ichi» kartasiga tushadi → telefondan konvert `GET /oyinlar` chiqadi va laptopga emas, telefonning o'ziga aylanib qaytadi →
    telefonda kartalar o'rnida qizil mono qator `Network request failed` → karta qizil ✗, yorliq: «Telefonda `localhost` — telefonning o'zi.» (39) → qator kartadan o'chadi.
  - 2-qator «Yozib ko'rish» → qator «ilova ichi» kartasiga ochiq matn bo'lib tushadi, `k3J9…` qiymati qizil yonadi, yonida chizilgan ko'z belgisi va yorliq:
    «Ilovani olgan har kim bu qiymatni o'qiy oladi.» (46) → karta qizil ✗; Render tugunidagi `JWT_SECRET` qatori bir lahza accent bilan yonadi (kalit joyi shu) → qator kartadan o'chadi.
  - 3-qator «Yozib ko'rish» → qator «ilova ichi» kartasida qoladi → konvert telefondan Internet orqali Render tuguniga yuradi → `GET /oyinlar` → javob konverti qaytadi →
    telefonda to'rt o'yin kartasi ajralib kiradi → karta yashil ✓, yorliq: «Internetdagi manzil — telefon uni topadi.» (41)
  - Har qator bitta tugma bilan yozib ko'riladi — noto'g'ri tanlov yo'q; qaror bashoratda, natija harakatda (P-046: holat o'quvchi bosgan qatorlardan chiziladi).
- Joriy qator (3/3 dan keyin, bitta): `EXPO_PUBLIC_` bilan boshlangan qiymat ilova ichiga ochiq matn bo'lib yoziladi. (77)
- Natija qatori: «Taxminingiz: … · haqiqatda: bittasi — internetdagi Backend manzili» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Ilovaga faqat internetdagi Backend manzili yoziladi. Maxfiy kalit faqat Backend'da turadi. (90)
- Tugadi (199): harakat paneli yopiladi; «ilova ichi» kartasi (bitta yashil qator), telefon va Render tuguni butun enga, fokusda; vizual ⛶ ichida.
- Tugma (pastki): Avval taxminingizni belgilang → Qatorlarni yozib ko'ring → Davom etish (son yo'q — «Qator N / 3» kartada; pilot ko'rigi 06.10)
✎ Bitta g'oya (P-008): ilova `.env` dagi qiymat telefondagi ilova ichiga yoziladi — shuning uchun u telefondan topiladigan manzil bo'lishi kerak va maxfiy bo'lmasligi kerak.
  Laptopning Wi-Fi manzili bu ekranda ko'rsatilmaydi (9-darsdagi QR bilan aralashmasin); «telefon laptopdagi Backend'ga ulana olmasligi mumkin» — kartochka 10 (tayanch 1.7 so'zi).
  2-savol shu qoidani Backend tomonidan so'raydi — `JWT_SECRET` qayerda turadi (§106).

## A2 · Amaliyot 2 — Backend internetda  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 2 · deploy
- Sarlavha: **Backend internetga chiqsin: telefon uni topsin.** (47)
- Mentor: Endi «Nima buzilmasin» qatorini o'zingiz yozasiz, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar (hammasi o'z repo'ngizda):
  1. **Ochish** — o'z Backend'ingiz laptopda ishlab tursin. render.com'ga GitHub akkauntingiz bilan kiring — 9-Modulda «Maydon»ni shu yerga chiqargansiz.
  2. **Prompt** — `{nima buzilmasin}` qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: `backend/` — Render'ga chiqarish uchun.
     > Nima qilsin: port `PORT` o'zgaruvchisidan olinsin, u bo'lmasa — 3000. `README.md` ga «Internetga chiqarish» bo'limini yoz: Render uchun Root Directory, Build Command, Start Command va kerakli o'zgaruvchilar nomi — qiymatsiz.
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — Mentor misolidagi qator): «Nima buzilmasin: `DATABASE_URL` va `JWT_SECRET` kodda ham, repo'da ham bo'lmasin — faqat `.env` da va Render sozlamasida.
     Laptopda `npm run start:dev` avvalgidek ishlasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
  3. **Ishga tushirish** — (a) `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "backend: Render"`, `git push`.
     (b) Render'da «New > Web Service» → o'z repo'ngiz; Root Directory — `backend`; Build Command va Start Command — `README.md` dagi; tarif **Free**.
     Environment bo'limiga ikki qator: `DATABASE_URL` va `JWT_SECRET` — qiymatlari `backend/.env` dan. Keyin «Create Web Service» — tayyor bo'lgach manzil chiqadi: `….onrender.com`.
     Xato bo'lsa — Render'dagi log qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.» Web-trekda ham Backend shu yo'l bilan chiqadi.
  4. **Telefonda tekshirish** — telefon brauzerida Render manzilingizni va asosiy ro'yxatingiz nomini oching (`https://….onrender.com/…`) — `401` chiqsin: Backend internetda, tokensiz yopiq.
     Mobil internet bo'lsa, Wi-Fi'ni o'chirib ham oching — natija o'sha. Bepul Backend uxlab qolgan bo'lsa, birinchi javob bir daqiqagacha kechikishi mumkin.
     Render manzilingizni `README.md` ning «Internetga chiqarish» bo'limiga yozing — ilovangiz unga ulanadi (manzil — ochiq qiymat). ✎ Ochiq qiymat — A3 push bilan GitHub'ga ketadi (10-FILTR 20).
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa»: telefon brauzeri, manzil qatori `maydon-jamoa-….onrender.com/oyinlar` → `401 · Unauthorized`;
  yonida Render kartasi (chizilgan, logotipsiz): `maydon-jamoa` · Root Directory `backend` · Environment: `DATABASE_URL` · `JWT_SECRET` (qiymatlar yulduzcha bilan yopiq).
- Hammasi bajarilgach (yashil): Backend internetda: telefon uni Render manzili bilan topadi, tokensiz `401` oladi. (80)
- Qator (`QIzoh`, natija ostida): Render bepul xizmatni prod uchun tavsiya qilmaydi. Bu modulda u ilovani tekshirish uchun ishlatiladi. (101)
- Pastki qator: yo'q — «Ortda qoldingizmi» faqat A1 da, darsda bir marta (foydalanuvchi, F-1006-271).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Render nomlari — rasmiy hujjatdan (render.com/docs/web-services, monorepo-support, 06.10; tayanch 9.6). Root Directory, Build va Start buyruqlari taxmin qilinmaydi — agent ularni README'ga yozadi (P-028).
  A2 prompti mahsulotga bog'liq emas — joy faqat zinapoya qatori. Render manzili uchun saqlash kaliti yo'q — manzil o'quvchining o'z `.env` ida (9.11).

## 5 · 2-savol ✅ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol (savol ustida «To'g'ri javobni tanlang» yorlig'i yo'q — SABOQ 6)
- Savol: **Backend Render'ga chiqdi. `JWT_SECRET` qayerda turishi kerak?** (8 so'z)
  - Ilovaning `.env` ida — `EXPO_PUBLIC_` bilan boshlanib
  - ✔ Render'da — Backend'ning Environment bo'limida
  - Talab matnida — agent ham bilib tursin deb
  - `README.md` da — Render uni o'sha yerdan o'qisin deb
- Kalit: **B** (index 1). To'rttalasi «joy — izoh» shaklida, tire hammasida; kod belgisi A va D da (to'g'rida yo'q); to'g'ri variant eng uzun emas.
- To'g'ri izohi: Maxfiy kalit Backend'da turadi: ilova va repo uni ko'rmaydi. (60)
- Xato izohlari (≤60):
  - A: `EXPO_PUBLIC_` qiymati ilova ichida ochiq ko'rinadi. (50)
  - C: Talab README'da va chatda qoladi — kalitga joy emas. (52)
  - D: README'da faqat nomlar turadi — u GitHub'da ochiq. (50)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## A3 · Amaliyot 3 — ilova Backend'ga ulanadi  ← amaliyot bloki (≈20 daq)
- Eyebrow: Amaliyot 3 · ilova → Backend
- Sarlavha: **Ilova Backend'ga ulansin: kirish va asosiy ro'yxat.** (51)
- Mentor: Uch qatorning hammasi sizdan, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar (hammasi o'z repo'ngizda, o'z trekingizda — `pm-m9d8-platforma`):
  1. **Ochish** — ilova papkangizda `.env` fayl yarating, bitta qator: mobil trekda `EXPO_PUBLIC_API_URL=`, web-trekda `VITE_API_URL=` — va Render manzilingiz (oxirida `/` siz).
  2. **Prompt** — vazifa: ilovangizda «Ro'yxatdan o'tish» va «Kirish» bo'lsin, token saqlansin, asosiy ro'yxat Backend'dan kelsin.
     Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     > Qayerda: **{qayerda}**
     > Nima qilsin: **{nima qilsin}**
     > Nima buzilmasin: **{nima buzilmasin}**
     Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt, mobil trek):
     > Qayerda: `mobil/` — yangi «Ro'yxatdan o'tish» va «Kirish» ekranlari; «O'yinlar» ekrani (`src/app/index.tsx`).
     > Nima qilsin: Backend manzilini `.env` dagi `EXPO_PUBLIC_API_URL` dan ol. «Ro'yxatdan o'tish» — `POST /royxat` (ism, telefon, parol), keyin «Kirish» ochilsin.
     > «Kirish» — `POST /kirish`; olingan tokenni `expo-secure-store` ga saqla. Ilova ochilganda token bo'lsa — «O'yinlar», bo'lmasa — «Kirish».
     > «O'yinlar» ro'yxatni `GET /oyinlar` dan token bilan olsin: kartada kun, soat, maydon va nechta odam kerakligi. Javob `401` bo'lsa — tokenni o'chirib, «Kirish»ni och. «O'yinlar» ekranida «Hisobdan chiqish» tugmasi — tokenni o'chirib, «Kirish»ni ochsin.
     > Nima buzilmasin: «O'yin» va «E'lon berish» ekranlari, animatsiyalar. `.env` ga Backend manzilidan boshqa qiymat yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Yordam (web-trek — to'liq prompt, 10-FILTR 21):
     > Qayerda: `prototip/` — yangi «Ro'yxatdan o'tish» va «Kirish» sahifalari; asosiy ro'yxat sahifasi. Backend'da `WEB_ORIGIN`.
     > Nima qilsin: Backend manzilini `.env` dagi `VITE_API_URL` dan ol. «Ro'yxatdan o'tish» — `POST /royxat`, keyin «Kirish». «Kirish» — `POST /kirish`; token `localStorage` da tursin.
     > Sahifa ochilganda token bo'lsa — ro'yxat `GET /{asosiy ro'yxat}` dan token bilan, bo'lmasa — «Kirish». `401` kelsa — tokenni o'chirib «Kirish»ni och. «Hisobdan chiqish» — tokenni o'chirsin.
     > Backend CORS faqat `WEB_ORIGIN` dagi Netlify manziliga ruxsat bersin.
     > Nima buzilmasin: dizayn va animatsiyalar; foydalanuvchi matni sahifaga HTML bo'lib chiqmasin. `.env` ga Backend manzilidan boshqa qiymat yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Render'da Environment'ga `WEB_ORIGIN` — Netlify manzilingiz (9-Moduldagidek).
  3. **Ishga tushirish** — mobil trekda: `npx expo start`, QR'ni telefonda Expo Go bilan oching (9-darsdagidek); QR ochilmasa — telefon va laptop bitta Wi-Fi'dami? Bo'lmasa: `npx expo start --tunnel`.
     Web-trekda: `npm run dev`, keyin push — Netlify o'zi yangilanadi. Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabning har qatorini tekshiring:
     (1) Ro'yxatdan o'ting, keyin kiring — asosiy ro'yxatda to'rtta namuna yozuv (eng yangisi tepada).
     (2) Mobil trekda terminalda `r` ni bosing (web-trekda sahifani yangilang) — ilova qayta yuklanadi: «Kirish» so'ralmaydi, ro'yxat ochiladi.
     (3) «Hisobdan chiqish»ni bosing — «Kirish» ochiladi; qayta kiring (bu — kirish poydevorining qismi, roadmap funksiyasi emas).
     (4) Neon'dagi SQL Editor'da foydalanuvchilar jadvalingiz — sizning qatoringiz, `parol_hash` da parolingiz emas.
     Bepul Backend uxlab qolgan bo'lsa, birinchi javob bir daqiqagacha kechikishi mumkin. Oxirida `git status` → `git add <fayl>` (`.env` emas) → commit → `git push`.
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon maketi, Expo Go, nom o'z rangida; uch kadr bir marta o'zi yuradi):
  - «Ro'yxatdan o'tish»: Ism `Ali` · Telefon `+998 90 000 00 01` · Parol `••••••••`
  - «Kirish» → qulf-quti `expo-secure-store` yashil
  - «O'yinlar» (eng yangisi tepada — tayanch 9.29): Yakshanba, 17:00 · Mahalla maydoni · 10 kishi kerak · Yakshanba, 10:00 · Park maydoni · 8 kishi kerak · Shanba, 20:00 · Maktab maydoni · 10 kishi kerak · Shanba, 18:00 · Mahalla maydoni · 10 kishi kerak
  - ostida jadval-karta (Neon · SQL Editor): `oyinchilar` — `Namuna tashkilotchi · $2b$10$…` · `Ali · $2b$10$…`
- Hammasi bajarilgach (yashil): Ilova internetdagi Backend'ga ulandi: foydalanuvchi kiradi, ro'yxat Database'dan keladi. (88)
- Qator (`QIzoh`, natija ostida): Expo Go'da ilova kodi hozircha laptopdan keladi, o'yinlar esa Render'dagi Backend'dan. (86)
- Pastki qator: yo'q — «Ortda qoldingizmi» faqat A1 da, darsda bir marta (foydalanuvchi, F-1006-271).
- Nishon (bonus): Foundation Ready — oxirgi «Bajardim»da (4-qadam).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
✎ Ilovaga kutish yozuvi («Yuklanmoqda…») qo'shilmadi — Render uyg'onishi uchun bu qadam 15-darsdagi risklardan biri (tayanch 1.9, risk 1); bu darsda faqat halol ogohlantirish.
  Kartada qo'shilganlar soni («8 / 10») yo'q — u 11-darsda Backend'dan keladi (tayanch 9.2). Trek farqi: 1 va 3-qadamda bir qator, «Yordam» ostida bir gap (9.7); `QIzoh` faqat mobil trekda.

## 6 · Natijalar (podium)
- Jonli reyting: 2 savol (skelet infrasi); bloklar «Bajardim» — mentorga signal (`PRACTICE_BASE`, 5-Modul naqshi).
- Savol yorliqlari: 3 — «1 — Token telefonda» · 5 — «2 — Maxfiy kalit joyi».

## Kartochkalar — alohida ekran (`sflash`, 11 / 12)  ← QKartochka
- SABOQ 12 (foydalanuvchining qat'iy qoidasi 05.10): kartochkalar yakun ichida emas — alohida ekran. Tartib: … → podium → **kartochkalar** → yakun.
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16).
- Kartochkalar — 12 ta (jadval — «Kartochkalar (12)» bo'limida) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N ·
  birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
- Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- Tugmalar: Orqaga · Yakunlash →

## 7 · Yakun — keyingi dars  ← QYakun (172; kartochkalar — oldingi alohida ekranda)
- Eyebrow: Yakun · belgi: ✓ Poydevor tayyor (A3 bajarilgan bo'lsa; aks holda belgisiz)
- Sarlavha (holatga qarab, P-046; 10-FILTR 37, 38): A3 — **Poydevor tayyor: ro'yxatingiz Backend'dan keladi.** (49) · A2 bajarilgan, A3 yo'q — **Backend internetda — ilovaga ulash qoldi.** (41) ·
  A1 bajarilgan, A2 yo'q — **Database va kirish tayyor — deploy qoldi.** (41) · A1 yo'q — **Poydevor boshlandi — qolgan qadamni tugating.** (44)
- Natija halqasi: N/2 · to'g'ri javob
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- Endi siz bilasiz (4):
  - Ro'yxatdan o'tgan o'yinchi Database'da turadi; parolning o'zi emas, hash'i saqlanadi.
  - Kirishda parol yoziladi: token telefonda saqlanadi va yopiq so'rovlarga qo'shiladi.
  - Telefon `localhost` bilan laptopdagi Backend'ni topmaydi — bu darsda Backend barqaror manzil uchun internetga chiqadi.
  - `EXPO_PUBLIC_` qiymati ilovada ochiq ko'rinadi: unga faqat Backend manzili yoziladi.
- Uyga vazifa — yo'q (P-058: ish repo'da — uch blok o'z mahsulotingizda bajarildi; ekranda alohida blok yo'q).
- Keyingi dars — «Loyiha kuni: 1-asosiy funksiya»: roadmap'dagi birinchi funksiya — talabni siz yozasiz.
- Nishonlaringiz — N/3
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (3)
- **Token Keeper** — Ilova o'yinchini telefondagi token bilan tanishini topdingiz (3-ekran, 1-savol)
- **Secret Safe** — Maxfiy kalit Backend'da turishini topdingiz (5-ekran, 2-savol)
- **Foundation Ready** — Uch amaliyot blokini oxirigacha bajardingiz (A3 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (2)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Har kartada emoji o'rniga koddan bitta qator (S-026).

1. 1-savol (3-ekran) — «Parol bir marta, keyin token»
   - `POST /kirish` · Kirish — Telefon va parol to'g'ri bo'lsa, Backend token beradi.
   - `SecureStore.setItemAsync('token', token)` · Saqlash — Token telefonda shifrlab saqlanadi.
   - `Authorization: Bearer <token>` · So'rov — Ilova yopiq so'rovlarga tokenni qo'shadi.
   - Sinfga savol: Ilova qayta ochilganda parol nega so'ralmaydi?
2. 2-savol (5-ekran) — «Maxfiy kalit — faqat Backend'da»
   - `EXPO_PUBLIC_API_URL=https://…` · Ilova — Bu qiymat ilova ichida ochiq ko'rinadi.
   - `JWT_SECRET` · Maxfiy kalit — `backend/.env` da va Render sozlamasida turadi.
   - `.gitignore` · Repo — `.env` GitHub'ga chiqmaydi.
   - Sinfga savol: Ilovani olgan odam qaysi qiymatni ko'ra oladi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Poydevor nima? | Database, kirish va deploy — har funksiyadan oldin kerak bo'lgan qism | Mentor misolida: uch jadval, kirish yo'llari, Backend Render'da |
| Prototipda bir telefondagi «Qo'shilaman»ni ikkinchisi nega ko'rmaydi? | Ma'lumot har telefonning o'zida | Ikkala telefon so'raydigan umumiy Database yo'q |
| «Maydon Jamoa» Database'ida qaysi uch jadval bor? | `oyinchilar`, `oyinlar`, `ishtirokchilar` | `ishtirokchilar` — kim qaysi o'yinga qo'shilgani |
| `oyinchilar` jadvalida parol qanday turadi? | Hash bo'lib — parolning o'zi emas | Hash — paroldan yasalgan satr: undan parolni qaytarib bo'lmaydi |
| `POST /kirish` nima qaytaradi? | Token | Telefon va parol to'g'ri bo'lsa |
| Token telefonda qayerda saqlanadi? | `expo-secure-store` da | Qiymatni shifrlab saqlaydi — 8-Moduldagi AsyncStorage'dan farqi shu |
| Ilova qayta ochilganda «Kirish» nega so'ralmaydi? | Token telefonda saqlangan | Ilova uni yopiq so'rovlarga qo'shadi; muddati tugasa — yana «Kirish» |
| `GET /oyinlar` tokensiz nima qaytaradi? | `401` | Ilova tokenni o'chirib, «Kirish»ni ochadi |
| Telefondagi ilova uchun `localhost` nima? | Telefonning o'zi | So'rov laptopdagi Backend'ga yetmaydi |
| Nega Backend shu darsda Render'ga chiqadi? | Telefon unga Internet orqali ulanadi | Laptopdagi Backend'ga telefon ulana olmasligi mumkin |
| `EXPO_PUBLIC_API_URL` ga nima yoziladi? | Render'dagi Backend manzili | Maxfiy emas — ilovada ochiq ko'rinadi |
| `JWT_SECRET` va `DATABASE_URL` qayerda turadi? | `backend/.env` da va Render'da | Ilovada ham, GitHub'da ham emas |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 (3/3/3/3)
1. Ilova kirgan o'yinchini keyingi so'rovlarda qanday taniydi? ✔ Telefonda saqlangan token orqali · Har safar telefon raqamini so'rab · Database'dagi parolni o'qib chiqib · Expo Go akkauntining nomi orqali
2. `oyinchilar` jadvalida parol qanday turadi? Parolning o'zi, ochiq matn bo'lib · ✔ Paroldan yasalgan hash bo'lib · Telefon raqamiga qo'shib yozilib · Token ichiga joylab qo'yilib
3. Tokensiz `GET /oyinlar` so'rovi kelsa, Backend nima qiladi? O'yinlarning to'liq ro'yxatini beradi · Faqat birinchi o'yinni qaytaradi · ✔ 401 qaytaradi, ro'yxatni bermaydi · «Kirish» ekranini o'zi ochib beradi
4. Token telefonda qayerda saqlanadi? Database'dagi `oyinchilar` jadvalida · Ilovaning `.env` faylidagi qatorda · Repo'dagi `README.md` bo'limida · ✔ `expo-secure-store` da, shifrlab
5. Telefondagi ilova uchun `localhost` nimani bildiradi? ✔ Telefonning o'zini · Laptopdagi Backend'ni · Render'dagi Backend'ni · Neon'dagi Database'ni
6. Nega Backend shu darsda Render'ga chiqadi? Laptopda u sekin ishlagani uchun · ✔ Telefon Internet orqali ulanishi uchun · Render Database'ni o'zi yaratgani uchun · Expo Go faqat Render bilan ishlagani uchun
7. Ilovaning `EXPO_PUBLIC_API_URL` qatoriga nima yoziladi? `http://localhost:3000` manzili · `JWT_SECRET` kalitining qiymati · ✔ Render'dagi Backend manzili · Neon'dagi `DATABASE_URL` satri
8. Nega `EXPO_PUBLIC_` qatoriga maxfiy kalit yozilmaydi? Ilova ochilishi sekinlashib qoladi · Expo Go bunday qatorni o'chirib tashlaydi · Render bu qatorni o'qiy olmay qoladi · ✔ U ilova ichida ochiq matn bo'lib turadi
9. Internetdagi Backend uchun `JWT_SECRET` qayerda turadi? ✔ Render'dagi Environment bo'limida · Ilovaning `mobil/.env` faylidagi qatorda · GitHub'dagi `README.md` faylida · Agentga yozilgan talab matnida
10. Telefon brauzerida Render manzili `/oyinlar` — 401 chiqdi. Bu nimani bildiradi? Backend ishlamayapti — Render xato berdi · ✔ Backend internetda va tokensiz yopiq · Database'da o'yinlar hali yozilmagan · Telefonning o'zi Internetga ulanmagan
11. Push'dan oldin fayllarni qanday qo'shasiz? `git add .` bilan hammasini birdan · `.env` ni ham qo'shib, hammasini · ✔ Agent aytgan fayllarni bittadan · Faqat `README.md` faylini qo'shib
12. Ilova `GET /oyinlar` dan `401` oldi. Ilova nima qiladi? O'yinlarni namunadan ko'rsataveradi · Parolni o'zi qayta yuborib turadi · Render'dagi Backend'ni qayta yoqadi · ✔ Tokenni o'chirib, «Kirish»ni ochadi

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har o'rin 3 marta).
Uzunlik (python): to'g'ri variant hech bir savolda yolg'iz eng uzun emas; 3, 10-savollarda `401` kod-bezaksiz (kod belgisi faqat to'g'rida bo'lmasin); 4-savolda kod belgisi to'rttala variantda.
Fon so'zlari (R-008, kodda {uz, ru}): poydevor · Database · Backend · token · hash · `expo-secure-store` · `EXPO_PUBLIC_API_URL` · Render · Neon · `401` · `POST /kirish` · Maydon Jamoa

---

## KOD — razrabotkada quriladigan narsalar (dars yangi, `src/skelet/NamunaDars.jsx` dan)
1. `SCREEN_META` 12: hook · plan · concept · practice · test · concept · practice · test · practice · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` 2: 3-ekran **2 (C)**, 5-ekran **1 (B)**;
   `practice: -1` uch blokda. Final tartib-mashqi yo'q (172).
2. **`POYDEVOR` + `PoydevorXarita`** — bitta manba (180): telefon (ekranlar «Ro'yxatdan o'tish» · «Kirish» · «O'yinlar», qulf-quti `expo-secure-store`), Backend qutisi (uch yo'l, joy yorlig'i `localhost:3000 · laptop` / `maydon-jamoa-….onrender.com · Render`),
   Database (uch jadval kartasi, namuna qatorlar), «ilova ichi» kartasi (`mobil/.env`). Holatlar: kulrang · oq · accent · yashil · qizil. 0, 1, 2, 4-ekran va A1–A3 o'ng tomoni shundan o'qiydi.
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: …`). Logotip/emoji yo'q (D4). «Maydon Jamoa» nomi — telefon maketida, o'z rangida (SABOQ 2).
   Namuna o'yinlar — 7/9-dars `src/namuna.js` bilan bir manba (tayanch 9.2).
3. 0-ekran `QKirish`: maket — ikki telefon («O'yin» ekrani, «8 / 10», ismsiz doiralar, «Qo'shilaman»); javobdan keyin 1-telefonda «Qo'shildingiz» (o'chiq) va son animatsiyasi «8 / 10» → «9 / 10» (9.14), 2-telefon o'zgarmaydi, orada uzuq chiziq va «umumiy joy — hali yo'q» katagi.
4. 2-ekran `QTushuncha`: `QBashorat`/`QTaxmin` (yopilmaydi — `TaxminIxcham`), uch tugma navbat bilan (`.navbat` halqa + pulsatsiya), konvertlar, `oyinchilar` ga qator kirishi, `parol_hash` yorlig'i,
   qulf-quti holati, «ilovani qayta ochish» (ekran qorayib ochiladi), `zoom`, `tugadi`. Holat bosishlar ro'yxatidan chiziladi (P-046).
5. 4-ekran `QTushuncha`: `QBashorat`/`QTaxmin`, uch qator kartasi bittadan (`QKarta` + bitta `QTugma` «Yozib ko'rish»), har qator o'z effekti (konvert telefonga qaytadi / «ilova ichi»da qizil qiymat va ko'z belgisi (chizilgan) /
   konvert Render'ga yetadi), `zoom`, `tugadi`. Telefonda (bir ustun) harakatdan keyin vizual ko'rinadigan joyga suriladi.
6. 3 va 5-ekran `QTest` — matn yuqoridagidek; to'g'ri izoh ≤60, xato izohlari ≤60.
7. **Amaliyot bloklari** — `ScreenBlok` + `QBlok` + `QPrompt` (9-Modul `src/7-Modull/MvpFirstScreenLesson.jsx` naqshi: `yordam`, `XATO_YOLI`). Har blok **4 qadam**, hammasi o'quvchining o'z repo'sida (tayanch 9.1); 5-qadam yo'q.
   - A1 promptida joylar: `{foydalanuvchilar jadvali}` · `{asosiy ro'yxat}` (ikki joyda) · `{ilova papkasi}` — yonida kulrang namuna («masalan: oyinchilar», «masalan: oyinlar», «masalan: mobil/») — va `{parol jadvalda qanday tursin}` (namunasiz).
     A2 — `{nima buzilmasin}` qatori; A3 — uch joy (`A3_JOY` naqshi). «Yordam» — har blokda Mentor misolidagi to'liq prompt (A2 da — qator).
     Qolipda «kulrang namuna» joy turi bo'lmasa — `QPrompt` ga `namuna` maydoni (asosiy seans qarori).
   - Trek `pm-m9d8-platforma` dan: A3 1 va 3-qadamida `mobil` — Expo qatori, `web` — Vite/Netlify qatori; «Yordam» ostidagi web gapi faqat web-trekda.
     Kalit yo'q bo'lsa — ikkala qator ham ko'rinadi (M-q5 naqshi). A3 `QIzoh` (Expo Go) — faqat mobil trekda.
   - 4-qadam nomi: «Brauzerda tekshirish» (A1) · «Telefonda tekshirish» (A2, A3). O'ng: A1 — terminal + brauzer `401` + jadval-karta; A2 — telefon brauzeri `401` + Render kartasi; A3 — telefon maketi (uch kadr) + jadval-karta.
   - `ortda`: faqat A1 da (darsda bir marta, F-1006-271) `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m11-dars-10-done` (tayanch 3 matni; 9.10).
8. `RECAPS` 2 (kalit = 3 va 5); `Q_LABELS` {3, 5}. `ACHIEVEMENTS` 3, `ACH_TRIGGERS`: 3-ekran → Token Keeper, 5-ekran → Secret Safe, A3 oxirgi (4-qadam) «Bajardim» → Foundation Ready.
9. Kartochkalar — alohida `sflash` ekran (`ScreenFlashcards`, `QKartochka`, 12 karta; SABOQ 12, 16). 7-ekran `QYakun`: `uyga` yo'q, `recap` 4 qator, `keyingi` matni yuqoridagidek.
10. `QUIZ_BANK` 12 savol (✔ 0·1·2·3 ×3); `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008).
11. `LESSON_META.lessonId` — `m9-10-v1`, `lessonTitle` — «Loyiha kuni: poydevor — Database, kirish, deploy». App.jsx `m9-10` qatoriga `comp: FoundationDayLesson` — «qur» bosqichida (asosiy seans).
12. `narrow` faqat 3, 5, 6-ekranlarda (171). Darvozalar: `npm run gates -- src/9-Modull/FoundationDayLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:jsx` 0 · `lint:layout` 1280/1366 · surat 1280 + 393.
13. ru — uz tasdiqlangach, bir yo'la (6-RU).

## REPO — `maydon-jamoa` ga qo'shiladigan narsalar (`m11-dars-10-start` → `m11-dars-10-done`; yozish — «qur» da, push — buyruq bilan)
1. **`m11-dars-10-start`** = `m11-dars-09-done` (tayanch 3): `mobil/` (Expo Router, Stack, uch ekran, namuna ma'lumot) · `prototip/` adaptiv + `manifest.webmanifest`.
2. **`m11-dars-10-done`** = start + A1–A3 namunasi:
   - `backend/` — NestJS + TypeORM + PostgreSQL (Neon, `DATABASE_URL`); entity'lar → jadvallar `oyinchilar` (`telefon` noyob) · `oyinlar` · `ishtirokchilar` (tayanch 1.6 ustunlari);
     `POST /royxat` — parol hash bilan (bcrypt — 4a-Modul naqshi), telefon takrorlansa `409`; `POST /kirish` — JWT (`JWT_SECRET`, muddati 30 kun — tayanch 9.3);
     `GET /oyinlar` — guard bilan (tokensiz `401`), javob `[{ id, kun, soat, maydon, kerak }]`, `ORDER BY yaratilgan DESC` — eng yangisi tepada (13-dars sinovi shu tartibni topadi — tayanch 9.29); `kun` — sana, namuna o'yinlar keyingi shanba va yakshanba sanalari bilan (9.30); namuna: bitta tashkilotchi va to'rt o'yin — tayanch 9.2 (bor bo'lsa qayta qo'shilmaydi);
     port `process.env.PORT ?? 3000`; `backend/.env.example` (`DATABASE_URL=`, `JWT_SECRET=`); `.env` — `.gitignore` da.
   - `README.md` «Internetga chiqarish»: Render — Root Directory `backend`, Build Command `npm install && npm run build`, Start Command `npm run start:prod`, Environment `DATABASE_URL`, `JWT_SECRET` (qiymatsiz).
   - `mobil/` — `npx expo install expo-secure-store`; `src/app/royxat.tsx` («Ro'yxatdan o'tish»), `src/app/kirish.tsx` («Kirish»); `src/app/index.tsx` — token bo'lmasa «Kirish»ga, bo'lsa `GET /oyinlar`
     (`Authorization: Bearer …`), `401` da tokenni o'chirib «Kirish»ga; «Hisobdan chiqish» tugmasi (token o'chadi, «Kirish» — 9.34, sinov va ikkinchi akkaunt uchun); karta — «Shanba, 18:00» · maydon · «N kishi kerak» (9.30); Backend manzili `process.env.EXPO_PUBLIC_API_URL` (nuqta bilan — Expo talabi);
     `mobil/.env.example` (`EXPO_PUBLIC_API_URL=`; 9.5). «O'yin», «E'lon berish» ekranlari va animatsiyalar o'zgarmagan.
   - Web-trek namunasi (`prototip/`) bu darsda Backend'ga ulanmaydi — Mentor misoli mobil; web-trek o'quvchisi «Yordam» ostidagi gap bo'yicha yozadi (9.7).
   - README «Xatolar» jadvali: `Network request failed` — `EXPO_PUBLIC_API_URL` da `localhost` turibdi yoki manzil xato · Render'da birinchi javob kechikadi — bepul xizmat uyg'onmoqda ·
     `401` — token eskirgan yoki yo'q, qayta kiring.
3. **Shart:** `m11-dars-10-start` va `m11-dars-10-done` teglari kurs boshlanishidan oldin upstream'da (`yechim` tarmog'ida). Mentor Render xizmati (`maydon-jamoa-….onrender.com`) — «qur» da ochiladi.
4. **Bog'liqlik:** 11-dars `POST /oyinlar`, `POST /oyinlar/:id/qoshilish` va «8 / 10» ni shu Backend'ga qo'shadi; 12, 14-darslar ham shu jadvallarda. Nomlar (yo'llar, jadval, `.env` kalitlari) tayanch bilan bir xil.

---

## TAYANCHGA SAVOL (tayanch 9-bo'lim qarorlari bilan, 06.10 01:10)
1. ~~Blok qadamlari modeli~~ — **yopildi: 9.1** (hamma qadam o'z repo'sida, 5-qadam yo'q, blok ≈ 20 daqiqa). MD shunga keltirildi.
2. ~~Namuna o'yinlar va namuna tashkilotchi~~ — **yopildi: 9.2** (4 o'yin, 7-dars `namuna.js` bilan bir: Shanba 18:00 · Shanba 20:00 · Yakshanba 10:00 · Yakshanba 17:00; asosiy seans tuzatdi).
3. ~~Kartada «8 / 10» yo'q~~ — **yopildi: 9.2** (10-darsda «10 kishi kerak», «8 / 10» Backend'dan — 11-darsdan).
4. ~~`POST /royxat` javobi va `409`~~ — **yopildi: 9.3** («Bu telefon ro'yxatdan o'tgan»).
5. ~~Token muddati~~ — **yopildi: 9.3** (30 kun; `401` da ilova tokenni o'chirib «Kirish»ni ochadi).
6. ~~«hash» va «shifrlash»~~ — **yopildi: 9.4** (hash — paroldan yasalgan satr; «shifrlab saqlash» — faqat `expo-secure-store`).
7. ~~`mobil/.env` repo'gami~~ — **yopildi: 9.5** (`backend/.env.example`, `mobil/.env.example`; `.env` — `.gitignore` da).
8. ~~Render nomlari va buyruqlari~~ — **yopildi: 9.6** («Create Web Service»; buyruqlar — agent README'ga yozadi). REPO dagi `npm install && npm run build` · `npm run start:prod` — «qur» da tekshiriladi.
9. ~~Web-trekda token~~ — **yopildi: 9.7** (`localStorage`; foydalanuvchi matni sahifaga HTML bo'lib chiqmaydi) — A3 «Yordam» ostidagi bir gapda.
10. ~~Namuna forma qiymati `Ali · +998 90 000 00 01`~~ — **yopildi: 9.8**.
11. ~~A1 4-qadam «Brauzerda tekshirish»~~ — **yopildi: 9.9**.
12. ~~Render manzili uchun saqlash kaliti~~ — **yopildi: 9.11** (kalit yo'q, manzil o'quvchining `.env` ida).
13. ~~«Ortda qoldingizmi» tegi~~ — **yopildi: 9.10** (hamma blokda `m11-dars-10-done`).
14. **(yangi) A1 dagi kirish maydonlari** — tayyor talabda `POST /royxat` (ism, telefon, parol) va `POST /kirish` (telefon, parol) — Mentor misolidagidek, joy emas. O'quvchi mahsulotida kirish boshqa maydon bilan bo'lsa
    (masalan email), u shu qatorni o'zi o'zgartiradimi yoki bu ham joy bo'lsinmi? Zinapoya A1 «tayyor talab» bo'lgani uchun joy qilmadim.
15. **(yangi) A1 jadvallari** — tayyor talabda «README'dagi jadvallarni yarat» (8-darsdagi «Arxitektura» bo'limi o'quvchining o'z jadvallarini yozgan deb oldim). 8-dars MD si README'ga jadval va ustunlarni yozdirishi kerak.
16. **(yangi) Web-trekda A3** — `WEB_ORIGIN` va Netlify qadami «Yordam» ostidagi bitta gapda (topshiriq: bir gap). 9-Modulda o'tilgan, lekin o'quvchi uchun qisqa bo'lishi mumkin — kerak bo'lsa 3-qadamga bir qator.

## Shubhali joylar (ishonchim to'liq emas)
- **Render forma nomlari:** «New > Web Service» va «Create Web Service» — render.com/docs/web-services (06.10); Root Directory — monorepo-support sahifasidan. Environment o'zgaruvchilari yaratish formasida «Advanced» ichida bo'lishi mumkin (hujjat) — MD da «Environment bo'limi» deb umumiy. Interfeys «qur» da ko'z bilan tekshirilsin.
- **`Network request failed`** — React Native `fetch` xato matni (keng ma'lum, lekin rasmiy hujjatdan iqtibos topmadim). Agent o'z xabarini chiqarsa, maket matni boshqacha bo'ladi.
- **«Telefonda `localhost` — telefonning o'zi»** — umumiy tarmoq bilimi; Expo hujjatidan aniq iqtibos topilmadi (qidiruv 06.10). Tayanch 1.7 «ulana olmasligi mumkin» deydi — matnda «mumkin» saqlandi.
- **`$2b$10$…`** — bcrypt hash boshi; agent boshqa kutubxona tanlasa, ko'rinish boshqacha (ma'no o'zgarmaydi).
- **Hook 3-varianti** («tashkilotchi ilovani qayta ochmaguncha») — 11-darsdan keyin, Backend bilan, qayta ochganda «9 / 10» ko'rinadi; bu darsda prototip uchun noto'g'ri. Auditor «keyin rost» deyishi mumkin — javob matni «prototip» deb chegaralangan.
- **Terminalda `r`** — Expo CLI hujjati: «Reload the app on any connected device». `expo-secure-store` qiymati qayta yuklashda saqlanadi deb oldim (qurilma xotirasida turadi).
- **Neon «SQL Editor»** — 9-Modulda shu nom bilan ishlatilgan; «Connect» tugmasi — neon.com/docs (06.10) tekshirildi.
- **Mobil internetda tekshirish** (A2 4-qadam) — har o'quvchida mobil internet bo'lmasligi mumkin, shuning uchun ixtiyoriy («bo'lsa»).
- **2-ekranda bir telefondan ro'yxat va kirish** — haqiqiy ilovada «Kirish» ekrani ro'yxatdan keyin ochiladi (tayanch 9.3); agent ro'yxatdan keyin o'zi kirsa, A3 4-qadam (1) sal o'zgaradi.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m9-09` «React Native va Expo: prototip telefonda» → **`m9-10` «Loyiha kuni: poydevor — Database, kirish, deploy»** (osti 1-ekran Mentorida) →
  `m9-11` «Loyiha kuni: 1-asosiy funksiya» (App.jsx 380–382, grep bilan; yakundagi «Keyingi dars» shu nom).
- [x] Bitta misol-ip («Maydon Jamoa», repo `maydon-jamoa`) · metafora yo'q («poydevor» atama, obraz qilib yoyilmagan) · keyssiz · bitta vizual dars bo'yi — `PoydevorXarita` (0, 1, 2, 4; bloklarda uning maketlari).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (uch tugma → jadval qatori, token qulf-qutiga, qayta ochilganda «O'yinlar»), 4 (qatorni yozib ko'rish → konvert yo'li, «ilova ichi»); 0-ekran javobdan keyin o'zgaradi.
- [x] SABOQ 11: harakatli ekranlarda navbatdagi element halqa + pulsatsiya bilan, Mentor bosqichga qarab shu harakatni aytadi; bashorat natijagacha turadi. SABOQ 12/16: kartochkalar alohida, Mentorsiz.
- [x] Sarlavhalar ≤55 bitta qator (25–55) · Mentor ≤2 gap (interaktiv ekran va bloklarda 1), sarlavhani takrorlamaydi · xulosalar ≤110 (79, 90) · hook javobi ≤120 (108–117) ·
  to'g'ri izoh ≤60 (60, 60) · xato izohlari ≤60 (41–59). Sanoq python bilan (`md10/olchov.py`).
- [x] Atamalar tayanch 2 bilan bir xil: poydevor · Backend · Database · token · kirish · talab · agent · tekshirish; «fundament», «skelet», «server», «baza», «sinov» yo'q ·
  siz-forma; Antigravity promptlari sen-formada (T-002) · tugmalar ot-shaklda yoki siz-formada («Yozib ko'rish», «Tugmalarni navbat bilan bosing»).
- [x] Testlar: variantlar bir shaklda, uzunlik yaqin, to'g'ri variant yolg'iz eng uzun emas; kalit so'z kamida ikki variantda (1: «Telefonda saqlangan», «token»; 2: tire hammasida, kod belgisi A, D da) ·
  ✔ o'rni: 3-ekran C, 5-ekran B · arena A·B·C·D ×3.
- [x] Final tartib-mashqi yo'q (172) — uya izohi talabi qo'llanmaydi.
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol» — yo'q; Render uyg'onishi «kechikishi mumkin»).
- [x] Ichki kodlar o'quvchi matnida yo'q («A1», «F1», «m9-10», «11-Modul» yo'q; blok — «Amaliyot 1»; modul raqami LMS bo'yicha: «9-Modulda», «6-Moduldagi») · tarixiy voqea, real kompaniya raqami yo'q · «KOD» (13) va «REPO» (4) ro'yxati to'liq.
- [x] Karta T · P · S: T-002/011/014/015/020/029/039/043/045/047/048/052/064 · P-001/008/013/015/020/026/028/036/046/052/059/062/063/064/067 · S-001/003/004/006/009/010/015/020/026/040 — ko'rildi.
- [ ] (ochiq) P-028: Render forma nomlari va Neon SQL Editor — hujjatdan, lekin interfeys ko'z bilan ko'rilmagan (shubhali joylar); «qur» da tekshiriladi.
- [x] Blok modeli — tayanch 9.1 bo'yicha (hamma qadam o'z repo'sida, 5-qadam yo'q); namuna o'yinlar — 9.2. Ochiq: TAYANCHGA SAVOL 14–16 (yangi).
