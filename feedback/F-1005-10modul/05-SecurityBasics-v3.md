# 10-Modul · 5-dars «Kiberxavfsizlik: zaiflikni topib yopamiz» — MD v3 (yangi dars, TEX)

Fayl: `src/8-Modull/SecurityBasicsLesson.jsx` (kalit `m8-05`) · **18 ekran** (13 dars ekrani + 2 amaliyot bloki + podium, takrorlash, yakun) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. Qolip: texnik dars (QTushuncha, QKod, QTest) + 2 amaliyot bloki repo `maydon` ustida. Kod — `src/skelet/NamunaDars.jsx` dan.
Namuna (tuzilish, hajm): 9-Modul `04-MvpArchitecture-v3.md`; shu modul `02-EventTracking-v3.md` (TEX shakli) — matn ko'chirilmadi.
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Pilot qoidalari (9-Modul pilotlari, 05.10 — `QURUVCHI_SABOQ.md`, majburiy; o'zgargan joylar ✎ bilan): kartochkalar alohida ekran · test yorlig'i yo'q ·
navbatdagi harakat doim ko'rinadi (faol element halqa va yengil pulsatsiya bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «TAXMININGIZ · savol · tanlov» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket · brend nomi o'z rangida, tanish maketda · ekranga kirganda bo'sh, ma'nosiz element yo'q.
Menyu (DE-205, App.jsx `m8-05`): «Kiberxavfsizlik: zaiflikni topib yopamiz» · osti «SQL injection, XSS, maxfiy kalitlar, 2FA» ·
oldingi dars `m8-04` «Ikki variantdan qaysi biri yaxshiroq ishlaydi?» · keyingi `m8-06` «Foydalanuvchi sizga ma'lumotini ishonadimi?».
Vaqt: ≈ 90 daqiqa — 0–12-ekranlar ≈ 50 · A1 ≈ 20 · A2 ≈ 15 · natija va yakun ≈ 5.

---

## A. Darsning tayanchi — tushunchalar, atamalar (bir ma'no — bir so'z), misol-ip, bitta vizual (163/180)

1. **Bitta natija (dastur v9: «zaifliklarni topadi va yopadi»).** Dars oxirida o'quvchining `maydon` repo'sida: ega sahifasidagi uch zaiflik **yopilgan** va ega kirishiga **2FA** qo'shilgan.
   Uch zaiflik (tayanch 3-bo'lim, `m10-dars-05-start` da ataylab qoldirilgan): **SQL injection** (ega qidiruvi) · **XSS** (ega ro'yxatida ism) · **maxfiy kalit kodda** (`JWT_SECRET` zaxira qiymati).
   Teglar: `m10-dars-05-start` → `m10-dars-05-done` (`EGA_2FA_KALITI`). Push — faqat zaifliklar yopilgandan keyin (tayanch 3-bo'lim).
2. **Bugungi asosiy fikr (P-013):** Bu darsda zaiflikni hujum qilmasdan, koddagi xavfli belgilarni o'qib topasiz: foydalanuvchi matni so'rovga qo'shilganmi, HTML bo'lib chiqqanmi, maxfiy kalit kodda turganmi.
3. **Oldingi darslardan keladigan narsa:**
   - 4-Modul `m4-11` «Autentifikatsiya va .env — login, JWT, maxfiy kalitlar»: **login** (parol → token), **maxfiy kalit** `.env` da, `JWT_SECRET` (grep `src/4-Modull/AuthEnvLesson.jsx`: «Butun himoya maxfiy kalitga bog'liq — u GitHub'ga ketsa, hamma soxta token yasaydi»).
   - 9-Modul ega sahifasi (`dars-11-done`, repo'dan o'qildi): `/ega` — `POST /kirish` (`EGA_PAROLI` → token), `GET /bandlar` faqat token bilan; ro'yxatda `soat · ism · telefon`; kod parolni `.env` dan oladi, `GET /bandlar` ni `EgaGuard` tekshiradi.
   - **4-dars A/B natijasi** (tayanch 9.5, bir qatorda eslatiladi): B variant («18:00 ni band qilish») ishga tushdi — birinchi kun A: 9 brauzerdan 3 band, B: 8 dan 4. To'liq yakun — 8-darsda.
4. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2-bo'lim, ta'riflar aynan):**
   - **zaiflik** — kodda begona odam foydalanishi mumkin bo'lgan xato; **yopish** — uni tuzatish. «Teshik», «uyazvimost» ishlatilmaydi. Buzilish ma'nosida — «begona qo'lga o'tdi» (taqiq: «buzilgan»).
   - **SQL injection** — «foydalanuvchi yozgan matn Database so'roviga buyruq bo'lib qo'shilib ketishi» (tayanch ta'rifi, so'zma-so'z). SQL 4–6-Modullarda o'tilgan; «injection» tarjima qilinmaydi (T-033).
   - **XSS** — «foydalanuvchi yozgan matn boshqa odamning sahifasida kod bo'lib ishlab ketishi» (tayanch ta'rifi). Birinchi ko'rinishda qisqartma ochiladi (T-036): «XSS (Cross-Site Scripting)».
   - **maxfiy kalit** — `.env` dagi parol va kalitlar: `JWT_SECRET`, `EGA_PAROLI`, `EGA_2FA_KALITI` (lug'at: secret → maxfiy kalit; T-021 «sir» — taqiq so'z). Umami ID maxfiy emas (tayanch 7.9) — bu darsda ishlatilmaydi.
   - **2FA** — «ikki bosqichli kirish: parol + telefon ilovasidagi 6 xonali kod» (tayanch ta'rifi). Birinchi ko'rinishda ochiladi (T-036): «ikki bosqichli kirish (2FA)». «Ikki faktorli» ishlatilmaydi.
   - **parametrli so'rov** — YANGI: matn so'rovga qo'shilmaydi, alohida uzatiladi (2-ekranda harakatdan keyin tug'iladi, T-011). Kodda TypeORM `find({ where: { telefon } })`.
   - **zaxira qiymat** — kalit topilmasa kodda turgan muqobil qiymat (`|| '…'`). 6-ekranda harakatdan keyin tug'iladi. «Default» ishlatilmaydi.
   - **token** (4-Modul: parol to'g'ri bo'lsa beriladi) · **imzo (signature)** (`m4-11`: token maxfiy kalit bilan imzolanadi) · **ega · ega kirishi · o'yinchi · maydon egasi** (9-Modul) · **band · bandlar ro'yxati** (egallangan katak · egaga ko'rinadigan ro'yxat).
   - **sayt · Backend · Database · jadval · qator** — 9-Modul atamalari; «qator» bu darsda faqat jadval qatori (T-015).
   - **TOTP** — 6 xonali kod; telefon ilovasi uni hisoblaydi, odatda 30 soniyada yangilanadi (tayanch 6-bo'lim). Atama kartochkada bir marta; ekranda «telefon ilovasidagi 6 xonali kod».
   - **agent** — Antigravity; **prompt** — agentga xabar, uch qatori «Qayerda · Nima qilsin · Nima buzilmasin» (9-Modul M-q2). Agent talabga tayanib quradi, taxmin qilishi mumkin — natijani o'quvchi kodni o'qib va saytni ochib o'zi tekshiradi (tayanch 7-bo'lim 2).
   - **Ishlatilmaydi:** «sir» (→ maxfiy kalit) · «hacker/buzg'unchi» (zaiflikni ega o'zi topadi — kerak emas) · «xavfsizlik teshigi» (→ zaiflik) · «uyazvimost» · «sessiya» · «baza».
5. **Mentor misolidagi raqam yo'q — darsda statistika kerak emas.** Namuna ma'lumot: ega ro'yxatida `Ali · +998 90 000 00 01 · 18:00`, `Bek · +998 90 000 00 02 · 17:00` (9-Modul namunasi, jadval ma'lumoti — statistika emas). 2FA kodi namunasi: `284 193` (olti xona, o'ylab topilgan — TAYANCHGA SAVOL 4).
6. **Metafora yo'q. Keyssiz** (TEX — tayanch 5-bo'lim). Qahramon yo'q — vazifani Mentor beradi; odamlar: maydon egasi, o'yinchi.
7. **Xavfsizlik qoidasi (eng muhim — tayanch 3-bo'lim, 00-TAQIQLAR 1):** dars faqat himoya tomonida. Har zaiflik: turi va nomi → nega xavfli (bir gap) → kodda qanday belgidan topiladi → qanday yopiladi.
   Hujum uchun kiritiladigan qatorlar (payload), boshqa saytni tekshirish yo'riqlari va aylanib o'tish usullari **yozilmaydi**. Tekshiruv — kodni o'qish va tuzatilgan kodning oddiy ma'lumot bilan to'g'ri ishlashi.
   Darsda bir marta (11-ekran, QIzoh): «Bu tekshiruvni faqat o'z saytingizda qilasiz. Boshqa saytni egasining ruxsatisiz tekshirmaysiz.»
8. **Kod yozish:** Backend va saytdagi tuzatishlarni Antigravity yozadi (prompt), **parametrli so'rovni o'quvchi qo'lda yozadi** (8-ekran, QKod) — bu darsning asosiy ko'nikmasi. Xato yo'li har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.» Har blok oxirida — «O'z g'oyangiz» (9-Modul M-q1).
9. **Toza yuza (D4):** tugma, variant va maketda emoji yo'q; chizma CSS/SVG bilan, logotip yo'q; rang — faqat holat foni (D3). Zaiflik ochiq — qizil fon; yopilgan — yashil.
10. **Texnik faktlar (manba, 05.10.2026 tekshirildi; o'quvchiga ko'rinmaydi):**
   - TypeORM `find({ where: { telefon } })` qiymatni parametr bo'lib uzatadi, so'rov satriga qo'shmaydi (typeorm.io «Find Options»; raw SQL kerak bo'lsa `query(sql, [param])` — `$1` parametr, Postgres `pg`).
   - React JSX ichidagi `{qiymat}` matnni matn sifatida chiqaradi (HTML belgilarini xavfsiz qiladi); HTML bo'lib chiqishi faqat `dangerouslySetInnerHTML` bilan bo'ladi (react.dev «dangerouslySetInnerHTML»).
   - NestJS: `JWT_SECRET` bo'lmasa `app.module.ts` da token imzolanmaydi; zaxira qiymat olib tashlansa va kalit yo'q bo'lsa — Backend ishga tushmay, xato tashlaydi (`dars-11-done` `kirish.controller.ts` da `JWT_SECRET` yo'q bo'lsa `InternalServerErrorException` bor).
   - 2FA (TOTP): 6 xonali kod, odatda 30 soniyada yangilanadi; telefon ilovasi — Google Authenticator, Microsoft Authenticator yoki shunga o'xshash (tayanch 6-bo'lim). Kutubxona nomi promptda aytilmaydi (P-060 — repo README da; TAYANCHGA SAVOL 2).
   - `EGA_2FA_KALITI` — Backend va telefon ilovasi bir xil koddan foydalanishi uchun umumiy maxfiy kalit; `.env` da turadi, kodda emas.

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon» — mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt. Ega sahifasi (`/ega`) ishlaydi; agent unga uch o'zgarish qo'shdi. Bugun o'quvchi ularni kodni o'qib tekshiradi va xavfsiz qiladi.
- **Hook:** agent uch o'zgarishni «tez» qo'shdi va «ishlayapti» dedi → uchala ekranda oddiy ma'lumot bilan to'g'ri ishlaydi → lekin kodni o'qib ko'rsak, uchtasida bir-bir zaiflik bor → ularni yopamiz va ega kirishiga ikkinchi qadam (2FA) qo'shamiz.
- **Bitta vizual — «Xavfsizlik ro'yxati» (`XAVF_RUYXAT`, dars bo'yi, 163/180):**
  - Chapda **ega sahifasi maketi** (191 ramka, `/ega`): yuqorida parol formasi (kirilganda — bandlar ro'yxati `soat · ism · telefon` va yangi **telefon qidiruv** qatori).
  - O'ngda **Backend kod kartasi** (3–4 qator, `fmtCode`) — joriy ekran tegadigan qism ko'rinadi (qidiruv so'rovi · imzo kaliti) — va **uch zaiflik kartasi** ustma-ust:
    - `1 · SQL injection — ega qidiruvi` · `2 · XSS — ro'yxatdagi ism` · `3 · Maxfiy kalit kodda — JWT_SECRET`
    - Har karta holati: **qizil «ochiq»** (boshida) → **yashil «yopilgan»** (yopilgach). Pastida to'rtinchi qator **`2FA — ega kirishi`** (boshida kulrang «yo'q» → yashil «qo'shildi»).
  - Harakat → holat: 2-ekran 1-kartani, 4-ekran 2-kartani, 6-ekran 3-kartani yashil qiladi; 9-ekran 2FA qatorini yashil qiladi. Kod kartasi har ekranda o'sha zaiflikning «ochiq» va «yopilgan» ikki ko'rinishini ko'rsatadi.
  - Ishlatilishi: 0 (ega sahifasi + uch o'zgarish kartasi) · 1 (ro'yxat tayyor) · 2 · 4 · 6 (kod kartasi + zaiflik) · 8 (QKod oynasi) · 9 (ega kirishi + 2FA qadami) · 11 (uchala yashil + 2FA) · A1/A2 kutilgan natija — kartaning kattasi.
    `prefers-reduced-motion` da rang silliq emas, birdan o'zgaradi (DE-200). Logotip/emoji yo'q (D4).
- **Yakun:** uch zaiflik yopilgan, ega kirishi 2FA bilan · keyingi dars — ma'lumot sizib chiqsa nima bo'ladi: audit va maxfiylik siyosati.

---

## 0 · Kirish — agent uch o'zgarish qo'shdi  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Agent qo'shgan uch o'zgarish xavfsizmi?** (38)
- Mentor: O'tgan darsda B variant («18:00 ni band qilish») ishga tushdi — A: 9 dan 3, B: 8 dan 4. Bugun ega sahifasiga qarang: Antigravity uchta o'zgarish qo'shdi.
- Maket (chap): ega sahifasi (`/ega`), parol bilan kirilgan: bandlar ro'yxati (`18:00 · Ali · +998 90 000 00 01` · `17:00 · Bek · +998 90 000 00 02`) va yangi **telefon qidiruv** qatori. Qidiruvga `+998 90 000 00 01` yozib bosilsa — Ali qatori chiqadi (oddiy ma'lumot bilan ishlaydi).
- O'ngda agent chati, ikki pufak: siz → «Ega sahifasini yaxshila: telefon bo'yicha qidiruv, ism qalinroq ko'rinsin, Backend kalitsiz ham ishga tushaversin.» · Antigravity → «Tayyor! Uchtasi ham ishlayapti.» (T-008 — chat matni)
- **Harakat → Vizual o'zgarish:** qidiruvga `+998 90 000 00 01` yozib bosish → Ali qatori ajralib chiqadi, sahifa to'g'ri ishlaydi. Shundan keyin o'ngdagi variantlar ochiladi (bosilmaguncha xira).
- Savol: **Uchtasi ishlayapti. Xavfsizligini qayerdan bilamiz?**
  - Sinab ko'rib — sahifa ochilsa, demak xavfsiz (40)
  - ✔ Koddagi xavfli joylarni o'qib, tuzatib (38)
  - Agentdan so'rab — u xavfsiz desa, yetadi (38)
- Javob — 2-variant: **Aynan!** Bu misolda uchtasi oddiy ma'lumot bilan ishlaydi. Bu darsda zaiflikni koddagi xavfli joylarni o'qib topamiz va tuzatamiz. (116)
- Javob — 1-variant: **Qiziq fikr!** Sahifa ochilgani kod xavfsizligini bildirmaydi: zaiflik oddiy ma'lumotda ko'rinmasligi mumkin. (112)
- Javob — 3-variant: **Qiziq fikr!** Agent talabga tayanib quradi — kodni baribir o'zingiz o'qib tekshirasiz. (84)
- Javobdan keyin: ega sahifasi yonida uch zaiflik kartasi paydo bo'ladi, hammasi **qizil «ochiq»** (U-041 — bugun yopiladigan joy).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- O'qituvchi eslatmasi: hook javobi «topishmoq» emas — uch karta qizil turadi, dars ularni yashil qiladi. «hacker» yoki hujum so'zi ishlatilmaydi (tayanch 7).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun ega sahifasining uch zaifligini yopasiz.** (42)
- Mentor: Har zaiflikni kodda topib, bitta o'zgarish bilan yopamiz. Oxirida ega kirishiga ikkinchi qadam — telefon ilovasidagi 6 xonali kod qo'shamiz.
- Chap yorliq: Dars oxirida — uch karta yashil, ega kirishi 2FA bilan
- Chap — «Xavfsizlik ro'yxati» boshlang'ich holatda (uch karta qizil «ochiq», 2FA qatori kulrang «yo'q»); yonida ega sahifasi maketi.
- O'ng — qadamlar (tex-karta «01 · matn · teg», bosilmaydi; teglar App.jsx `sub` so'zlari bilan — P-015):
  - 01 · Qidiruv so'rovi matnni qo'shmasin · `SQL injection`
  - 02 · Ism kod emas, matn bo'lib chiqsin · `XSS`
  - 03 · Maxfiy kalit kodda turmasin · `maxfiy kalitlar`
  - 04 · Ega kirishiga ikkinchi qadam · `2FA`
- Pastki qator (mono, kichik): repo `maydon` · boshlanish `m10-dars-05-start` · tayyor namuna `m10-dars-05-done`
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi (dars hajmi): 2, 4, 6-ekranlarga teng vaqt; og'ir qism — 8-ekran (parametrli so'rovni qo'lda) va ikki blok.

## 2 · SQL injection: qidiruv so'rovi  ← QTushuncha (bashorat + ikki ko'rinish)
- Eyebrow: Tushuncha · SQL injection
- Sarlavha: **Qidiruv so'rovi telefon matnini qanday ishlatadi?** (48)
- Mentor: Agent qidiruv so'rovini ikki xil yozishi mumkin. Ikkala ko'rinishni bosib, so'rovga nima tushishiga qarang.
- Bashorat (ballsiz, 181; yorliq «Avval o'zingiz belgilab ko'ring»): **Telefon matni to'g'ridan so'rov ichiga qo'shilsa, u qanday o'qiladi?** · Doim oddiy matn bo'lib · Ba'zan buyruq bo'lib — tanlov saqlanadi.
- Chap — ikki tugma: «Matnni qo'shib yasash» · «Parametrli so'rov».
- O'ng — Backend kod kartasi (`fmtCode`, 3 qator) va ostida bir gap; tepada «Xavfsizlik ro'yxati»ning 1-kartasi (qizil «ochiq»).
  - Matnni qo'shib yasash: `` const sql = `... WHERE telefon = '` + telefon + `'` `` · `db.query(sql)` — ostida: «Telefon matni so'rovga qo'shilib ketadi — matn emas, buyruq bo'lib o'qilishi mumkin.» (qizil)
  - Parametrli so'rov: `bandlar.find({` · `  where: { telefon }` · `})` — ostida: «Telefon qiymati parametr bo'lib uzatiladi — SQL buyruq satriga qo'shilmaydi.» (yashil)
- **Harakat → Vizual o'zgarish:** tugma bosilsa kod kartasi o'sha ko'rinishga almashadi va ostidagi gap o'zgaradi. Ikkala ko'rinish ko'rilgach, oddiy telefon (`+998 90 000 00 01`) bilan sinab ko'riladi:
  ikkala so'rov ham Ali qatorini topadi — lekin birinchisida telefon matni so'rovning bir qismi, ikkinchisida alohida. «Parametrli so'rov» tanlansa 1-karta **yashil «yopilgan»** bo'ladi.
- Joriy qator (ikkala ko'rinish ko'rilgach, bitta): Foydalanuvchi yozgan matn Database so'roviga buyruq bo'lib qo'shilib ketishi — **SQL injection** deyiladi. (118 — ikki gap)
- Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: ba'zan buyruq bo'lib» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Qidiruv so'rovida telefon matnini qo'shmang. Parametrli so'rovda bu qiymat alohida uzatiladi — buyruq bo'lib o'qilmaydi. (110)
- Tugadi (199): tugmalar yopiladi, kod kartasi va 1-karta (yashil) fokusga; vizual ⛶ ichida (q17).
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikki ko'rinishni ko'ring (N/2) → Davom etish

## 3 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **Kodda qaysi belgi SQL injection zaifligini ko'rsatadi?** (8 so'z)
  - So'rov `GET` emas, `POST` bilan yuborilgan (41)
  - ✔ Foydalanuvchi matni so'rov satriga qo'shilgan (41)
  - Qidiruv telefon bo'yicha, ism bo'yicha emas (40)
  - So'rov `bandlar` jadvaliga yuborilgan (37)
- Kalit: **B** (index 1). To'g'ri variant eng uzun emas; «so'rov», «telefon» so'zlari boshqa variantlarda ham bor.
- To'g'ri izohi: Matn so'rovga qo'shilsa, u buyruq bo'lib o'qilishi mumkin — shuni parametr bilan ajratamiz. (85)
- Xato izohlari (≤60):
  - A: `GET` yoki `POST` so'rov turi — zaiflik matnni qo'shishda. (55)
  - C: Qaysi ustun bo'yicha qidirish zaiflik emas — matnni qo'shish. (57)
  - D: Har so'rov bir jadvalga boradi — bu normal. (44)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 4 · XSS: ro'yxatdagi ism  ← QTushuncha (bashorat + ikki ko'rinish)
- Eyebrow: Tushuncha · XSS
- Sarlavha: **Ism ekranda matn bo'lib chiqadimi yoki kod bo'lib?** (50)
- Mentor: Agent ismni «qalinroq» ko'rsatish uchun ikki yo'ldan birini tanlagan. Ikki ko'rinishni bosib, ism qanday chiqishiga qarang.
- Bashorat (ballsiz): **Ism HTML sifatida chiqarilsa, uning ichidagi belgilar nima bo'ladi?** · Oddiy matn bo'lib ko'rinadi · Sahifa kodining bir qismi bo'ladi
- Chap — ikki tugma: «HTML sifatida chiqarish» · «Oddiy matn sifatida».
- O'ng — ega sahifasi maketi (ro'yxatning bir qatori) + kod kartasi; tepada 2-karta (qizil «ochiq»).
  - HTML sifatida: `<li dangerouslySetInnerHTML={{ __html: b.ism }} />` — ostida: «Ism HTML bo'lib qo'yiladi: ichidagi belgilar sahifa kodining bir qismi bo'lib ketishi mumkin.» (qizil)
  - Oddiy matn: `<li>{b.ism}</li>` — ostida: «React ismni matn bo'lib chiqaradi: belgilar ekranda ko'rinadi, kod bo'lib ishlamaydi.» (yashil)
- **Harakat → Vizual o'zgarish:** tugma bosilsa maketdagi ism o'sha yo'l bilan chiqadi va kod kartasi almashadi. Oddiy ism (`Ali`) ikkala yo'lda ham bir xil ko'rinadi — farq ismda belgi bo'lganda bilinadi (payload ko'rsatilmaydi: faqat «belgilar sahifa kodi bo'lib ketishi mumkin» deyiladi).
  «Oddiy matn sifatida» tanlansa 2-karta **yashil «yopilgan»** bo'ladi.
- Joriy qator (ikkala ko'rinish ko'rilgach, bitta): Foydalanuvchi yozgan matn boshqa odamning sahifasida kod bo'lib ishlab ketishi — **XSS (Cross-Site Scripting)** deyiladi. (120 — ikki gap)
- Natija qatori: «Taxminingiz: … · haqiqatda: sahifa kodi bo'ladi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu ro'yxatda xavf ismni HTML bo'lib chiqarishda edi. React matni sifatida chiqarsa, shu zaiflik yopiladi. (106)
- Tugadi (199): tugmalar yopiladi, maket va 2-karta (yashil) fokusga; vizual ⛶ ichida.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikki ko'rinishni ko'ring (N/2) → Davom etish
- O'qituvchi eslatmasi: ismda nima bo'lsa zararli bo'lishi — ko'rsatilmaydi (payload taqiq). Ekranda faqat «belgilar sahifa kodi bo'lib ketishi mumkin» — bu yetadi.

## 5 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **Ega ro'yxatidagi ismni XSS'dan qanday yopasiz?** (7 so'z)
  - Ismni Database'da katta harf bilan saqlab (44)
  - Ismni ro'yxatdan butunlay olib tashlab (40)
  - ✔ Ismni oddiy matn sifatida chiqarib (36)
  - Ism uzunligini o'ttiz belgi bilan cheklab (42)
- Kalit: **C** (index 2). To'g'ri variant eng qisqasi; «ism», «chiqarib» so'zlari boshqa variantlarda ham bor.
- To'g'ri izohi: React matnni matn bo'lib chiqaradi — ichidagi belgilar kod bo'lib ishlamaydi. (79)
- Xato izohlari (≤60):
  - A: Katta harf belgini kod bo'lishdan to'xtatmaydi. (44)
  - B: Ismni olib tashlasak, ega kimligini ko'rmaydi. (50)
  - D: Uzunlik cheklovi belgini matnga aylantirmaydi. (46)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 6 · Maxfiy kalit kodda  ← QTushuncha (bashorat + ikki ko'rinish)
- Eyebrow: Tushuncha · maxfiy kalit
- Sarlavha: **Kalit topilmasa, Backend qayerdan oladi?** (41)
- Mentor: «Autentifikatsiya va .env» darsida ko'rgansiz ✎ (06.10, T-036): butun himoya maxfiy kalitga bog'liq. Agent ikki yo'ldan birini yozgan — ikkisini bosib, kalit qayerdan kelishiga qarang.
- Bashorat (ballsiz): **Kalit kodda zaxira qiymat bo'lib tursa, uni kim ko'radi?** · Faqat Backend · Kodni ochib ko'rgan har kim
- Chap — ikki tugma: «Zaxira qiymat bilan» · «Faqat `.env` dan».
- O'ng — Backend kod kartasi + 3-karta (qizil «ochiq»).
  - Zaxira qiymat bilan: `const kalit = process.env.JWT_SECRET` · `  || 'zaxira-kalit'` — ostida: «Kalit topilmasa kodda turgan qiymat ishlatiladi — kodni o'qigan har kim uni biladi.» (qizil)
  - Faqat `.env` dan: `const kalit = process.env.JWT_SECRET` · `if (!kalit) throw new Error('JWT_SECRET yo\'q')` — ostida: «Kalit faqat `.env` dan olinadi; yo'q bo'lsa Backend ishga tushmaydi.» (yashil)
- **Harakat → Vizual o'zgarish:** tugma bosilsa kod kartasi almashadi. Zaxira qiymatli yo'lda kod kartasida `'zaxira-kalit'` qatori ochiq turadi (ko'rinadi); `.env` yo'lida kalit o'rni `process.env.JWT_SECRET` bo'lib, qiymat kodda ko'rinmaydi. «Faqat `.env` dan» tanlansa 3-karta **yashil «yopilgan»** bo'ladi.
- Joriy qator (ikkala ko'rinish ko'rilgach, bitta): Kalit topilmasa kodda turgan muqobil — **zaxira qiymat** deyiladi; maxfiy kalit uchun u xavfli. (115 — ikki gap)
- Natija qatori: «Taxminingiz: … · haqiqatda: har kim ko'radi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Maxfiy kalitga zaxira qiymat yozmang. U faqat `.env` dan olinsin — yo'q bo'lsa Backend ishga tushmasin. (106)
- Qator (`QIzoh`, xulosadan keyin; 05-FILTR 7): `.env` GitHub'ga chiqmaydi; prodda shu qiymatlar Render sozlamasida beriladi. (91)
- Tugadi (199): tugmalar yopiladi, kod kartasi va 3-karta (yashil) fokusga; vizual ⛶ ichida.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikki ko'rinishni ko'ring (N/2) → Davom etish

## 7 · 3-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **Nega `JWT_SECRET` ga kodda zaxira qiymat yozilmaydi?** (8 so'z)
  - ✔ Kodni o'qigan har kim uni ko'radi (38)
  - Zaxira qiymat juda uzun bo'lib ketadi (39)
  - Backend uni `.env` dan o'qiy olmaydi (37)
  - Zaxira qiymat Database'ga yozib qo'yiladi (40)
- Kalit: **A** (index 0). To'g'ri variant eng uzun emas; «zaxira qiymat» uch variantda — bir xato-sinf (maxfiy kalitni kodda qoldirish).
- To'g'ri izohi: Maxfiy kalit kodda turmasin: u faqat `.env` da bo'lsa, kodni ochgan odam ko'rmaydi. (83)
- Xato izohlari (≤60):
  - B: Uzunlik muhim emas — kalit kodda ko'rinmasligi kerak. (52)
  - C: Backend `.env` dan o'qiydi — «Autentifikatsiya va .env» darsida shunday edi. ✎ (06.10, T-036)
  - D: Kalit Database'ga emas, `.env` ga yoziladi. (43)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 8 · Parametrli so'rovni yozamiz  ← QKod
- Eyebrow: Kod yozish · parametrli so'rov
- Sarlavha: **Telefonni SQL'dan ajratadigan kod yozamiz.** (40) — §19 sarlavha oilasi; 05-FILTR 4
- Mentor: Kod oynasida parametrli so'rovning bir ko'rinishini `$1` bilan yozasiz. «Maydon» repo'sida TypeORM `find({ where: { telefon } })` ham qiymatni xuddi shunday alohida uzatadi.
- Chap — vazifa (3 band):
  1. Matn qo'shib yasalgan `const sql = ...` qatorini o'chiring.
  2. `qidir(telefon)` ichida parametrli so'rov yozing: `db('... WHERE telefon = $1', [telefon])`.
  3. Oddiy telefon bilan sinang — Ali qatori chiqsin.
- Yordam: Telefon matni so'rov satriga qo'shilmaydi. `$1` — so'rovdagi o'rin, qiymat alohida ro'yxatda (`[telefon]`) uzatiladi. Kodni o'zingiz terib yozasiz — qo'lda yozganda o'rganiladi.
- Tugma (o'ngda): Bajardim — shartlar ✓ bo'lgach ochiladi (§19 halol tugma).
- O'ng — platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi; ostida bir qator: «Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.») → `HtmlCompiler`, fayllar:
  - `index.html` — tayyor, o'zgarmaydi: qidiruv maydoni (`id="telefon"`), «Qidirish» tugmasi (`id="qidir"`), natija ro'yxati.
  - `db.js` — tayyor, o'zgarmaydi: namuna `bandlar` ro'yxati (`18:00 · Ali · +998 90 000 00 01`, `17:00 · Bek · +998 90 000 00 02`); `db(sql, qiymatlar)` — faqat parametrli shaklni qabul qiladi (`$1` + ro'yxat); matn qo'shib yasalgan so'rovga «So'rovni parametr bilan yozing» xabarini qaytaradi.
  - `app.js` — o'quvchi yozadi (boshlang'ich holat):
    ```js
    function qidir(telefon) {
      // Eski qator (o'chiring): matn qo'shib yasalgan
      // const sql = "... WHERE telefon = '" + telefon + "'"

      // Shu yerga: parametrli so'rov
      return db('SELECT * FROM bandlar WHERE telefon = $1', [telefon])
    }

    document.querySelector('#qidir').addEventListener('click', function () {
      const telefon = document.querySelector('#telefon').value
      korsat(qidir(telefon))
    })
    ```
- Kod oynasi sarlavhasi: `app.js — qidiruvni parametrli so'rov qiling`
- Shart xabarlari (≤60):
  - 1 — Matn qo'shib yasalgan `const sql` qatori qolmasin. (49)
  - 2 — So'rov `$1` va `[telefon]` bilan yozilsin. (41)
  - 3 — Oddiy telefon bilan Ali qatori chiqsin. (41)
- **Harakat → Vizual o'zgarish:** o'quvchi parametrli so'rovni yozadi → natija ro'yxatida qidirilgan telefonga mos qator chiqadi; matn qo'shib yasalgan so'rov qolsa — «So'rovni parametr bilan yozing». Har shart bajarilganda ✓. «Bajardim» → panel yopiladi, natija oynasi fokusga (199).
- Xulosa: Parametrli so'rovda telefon matni alohida uzatiladi — so'rovga qo'shilmaydi, buyruq bo'lib o'qilmaydi. (108)
- O'qituvchi eslatmasi: kod oynasi raw SQL `$1` bilan ishlaydi (soddaroq); repo'da TypeORM `find({ where: { telefon } })` ham xuddi shunday — qiymatni alohida uzatadi (A1 shuni yozadi). Payload ko'rsatilmaydi: faqat oddiy telefon bilan sinaladi.

## 9 · Ega kirishiga ikkinchi qadam  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Tushuncha · 2FA
- Sarlavha: **Parol begona qo'lga o'tsa, ega sahifasini kim ochadi?** (50)
- Mentor: Hozir ega faqat parol bilan kiradi. Qadamlarni bajaring va kirishga ikkinchi qadam qo'shilsa nima o'zgarishini ko'ring.
- Bashorat (ballsiz): **Paroldan tashqari telefon ilovasidagi 6 xonali kod ham so'ralsa, parolning o'zi kirishga yetadimi?** · Ha, parol yetadi · Yo'q, kod ham kerak
- Chapda qadam-ro'yxati (163.8, o'tgani ✓): 1 Parol bilan kiring · 2 Telefon ilovasidagi kodni yozing · 3 Ichkariga kiring
- O'ngda ega sahifasi maketi (kirish): parol maydoni · (2-qadamdan keyin) 6 xonali kod maydoni; yonida telefon ilovasi ramkasi (6 xonali kod, ostida kichik taymer — odatda 30 soniyada yangilanadi).
- **Harakat → Vizual o'zgarish:**
  1. Parol (namuna `••••••`) → «Davom etish» → sahifa hali ochilmaydi, Backend hali hech narsa bermaydi: 6 xonali kod maydoni chiqadi, telefon ilovasi ramkasida kod ko'rinadi (`284 193` — namuna ko'rinish).
  2. Kodni yozish → «Kirish» → sayt parol va kodni **birga** Backend'ga yuboradi → Backend parolni ham, kodni ham (`EGA_2FA_KALITI` dan hisoblab) tekshiradi → ikkalasi to'g'ri bo'lsa token beriladi, bandlar ro'yxati ochiladi.
     Biri noto'g'ri bo'lsa — token yo'q, «Parol yoki kod noto'g'ri» (qaysi biri ekani aytilmaydi).
  3. 2FA qatori «Xavfsizlik ro'yxati»da **yashil «qo'shildi»** bo'ladi.
- Joriy qator (2-qadamdan keyin, bitta): Parol + telefon ilovasidagi 6 xonali kod — **ikki bosqichli kirish (2FA)** deyiladi. (84)
- Natija qatori: «Taxminingiz: … · haqiqatda: kod ham kerak» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Parol begona qo'lga o'tsa ham, telefon ilovasidagi kodsiz ega sahifasi ochilmaydi. (95)
- Qator (`QIzoh`, xulosadan keyin): Token faqat Backend parolni ham, kodni ham bitta so'rovda tekshirgandan keyin beriladi. (98)
- Qator (`QIzoh`, ostida): Kodni Backend va telefon ilovasi bir xil maxfiy kalitdan (`EGA_2FA_KALITI`) hisoblaydi — kalit `.env` da turadi. (102)
- Tugadi (199): qadamlar yopiladi, ega kirishi va 2FA qatori (yashil) fokusga.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish

## 10 · 4-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol · ✎ test yorlig'i «To'g'ri javobni tanlang» yozilmaydi (SABOQ 6)
- Savol: **2FA ega kirishini nega mustahkamlaydi?** (6 so'z)
  - Parolni telefon ilovasida saqlab qo'yadi (41)
  - Backend'ni so'rovsiz uxlab qolishdan saqlaydi (42)
  - Har kirishda yangi parol o'ylab topadi (39)
  - ✔ Paroldan tashqari telefon ilovasidagi kodni so'raydi (45)
- Kalit: **D** (index 3). To'g'ri variant eng uzun emas, boshqa variantlarga yaqin; «parol», «telefon ilovasi» so'zlari boshqa variantlarda ham bor.
- To'g'ri izohi: Parol begona qo'lga o'tsa ham, telefon ilovasidagi kodsiz kira bo'lmaydi. (73)
- Xato izohlari (≤60):
  - A: 2FA parolni saqlamaydi — qo'shimcha kod so'raydi. (49)
  - B: Backend uxlashi 2FA bilan bog'liq emas. (42)
  - C: Parol o'zgarmaydi — ikkinchi qadam qo'shiladi. (44)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 11 · Qanday tekshiramiz  ← QTushuncha (bashorat + bitta harakat)
- Eyebrow: Tajriba · tekshiruv
- Sarlavha: **Xavfli kod olib tashlanganini qanday bilasiz?** (44) — 05-FILTR
- Mentor: Bu darsda zaiflikni hujum qilmasdan tekshiramiz: kodni o'qiymiz va saytni oddiy ma'lumot bilan sinaymiz. «Tekshiring»ni bosing va uch belgiga qarang.
- Bashorat (ballsiz): **Zaiflik yopilganini qanday bilamiz?** · Saytga hujum qilib ko'rib · Kodni o'qib va oddiy ma'lumot bilan sinab
- Vizual: «Xavfsizlik ro'yxati» (uch karta + 2FA qatori) va yonida uch belgi ro'yxati (boshida kulrang):
  - Qidiruv so'rovida matn qo'shilmagan (parametrli)
  - Ism oddiy matn bo'lib chiqadi
  - `JWT_SECRET` faqat `.env` dan
- **Harakat → Vizual o'zgarish:** «Tekshiring» → uch belgi birin-ketin yashil ✓ bo'ladi; har belgi yonida bir qator: «kodni o'qidik» va «oddiy ma'lumot bilan to'g'ri ishlaydi». Uchala karta va 2FA qatori yashil turadi.
- Qator (`QIzoh`, natijadan keyin — tayanch 7, bir marta): Bu tekshiruvni faqat o'z saytingizda qilasiz. Boshqa saytni egasining ruxsatisiz tekshirmaysiz. (99)
- Natija qatori: «Taxminingiz: … · haqiqatda: kodni o'qib va sinab» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bugungi uch xavfli naqsh olib tashlanganini kodni o'qib va oddiy ma'lumot bilan sinab tekshirdik. (101)
- Qator (`QIzoh`, xulosadan keyin; 05-FILTR 3): Bu butun sayt xavfsiz degani emas — bugun topilgan uch zaiflik haqida. (75)
- Tugadi (199): tugma yopiladi, ro'yxat va uch ✓ fokusga.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Tekshiring → Davom etish
- O'qituvchi eslatmasi: etika qatori darsda aynan bir marta shu yerda (tayanch 3). Hujum usuli, aylanib o'tish — hech bir ekranda yo'q.

## 12 · Yakuniy · ega kirishi 2FA bilan (jonli ball)  ← QTartib (sentinel `0`)
- Eyebrow: Yakuniy · tartib
- Sarlavha: **Ega 2FA bilan qanday kiradi?** (28)
- Mentor: Bo'laklarni sodir bo'lish tartibida joylang.
- Beshta uya — faqat raqam 1–5 va izoh «bu yerga qo'ying» (tartibni ochmaydi).
- Bo'laklar (bu yerda to'g'ri tartibda; ekranda aralash; sudrash yoki bosish — `FINAL_BOLAKLAR`):
  1. Ega parolni yozadi
  2. Ega telefon ilovasidagi 6 xonali kodni yozadi
  3. Sayt parol va kodni birga Backend'ga yuboradi
  4. Backend parolni ham, kodni ham tekshiradi
  5. Ikkalasi to'g'ri bo'lsa token beriladi, ro'yxat ochiladi
- Hamma uya to'lib tartib xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring. (39)
- Yechilgach xulosa (bir marta): Token faqat Backend parolni ham, kodni ham tekshirgandan keyin beriladi. (78)
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## A1 · Amaliyot 1 — uch zaiflikni yopamiz + 2FA kaliti  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq; `screens[13]`)
- Eyebrow: Amaliyot 1 · Backend
- Sarlavha: **Uch zaiflikni yoping va 2FA kalitini qo'shing.** (46)
- Mentor: Tuzatishni Antigravity yozadi — kodni va `.env` ni esa siz o'qib tekshirasiz. «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Terminalda `cd backend`, keyin `npm run start:dev`; brauzerda `localhost:3000` — «Maydon Backend ishlayapti». **Bu teg faqat laptopdagi mashq uchun: uni push qilmang va Render'ga chiqarmang — unda ataylab qoldirilgan zaifliklar bor.**
  2. **Prompt** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `backend/` — ega qidiruvi, imzo kaliti va `app.module.ts`.
     > Nima qilsin: (1) ega telefon qidiruvi parametrli so'rov bo'lsin (TypeORM `find({ where: { telefon } })`), matn qo'shib yasalgan so'rov olib tashlansin. (2) `JWT_SECRET` ning kodda turgan zaxira qiymati olib tashlansin — kalit faqat `.env` dan olinsin, yo'q bo'lsa Backend ishga tushmasin. (3) Ega kirishiga ikkinchi qadam qo'shilsin: `POST /kirish` parol va 6 xonali kodni birga olsin; token faqat ikkalasi Backend'da tekshirilgandan keyin berilsin; kod `.env` dagi `EGA_2FA_KALITI` dan hisoblansin.
     > Nima buzilmasin: `bandlar` va `hodisalar` yo'llari, 4-darsdagi `variant` ustuni o'zgarmasin. O'zgargan fayllarni ayt.
  3. **Ishga tushirish** — `backend/.env` ga qator qo'shing: `EGA_2FA_KALITI=` va README'dagi buyruq bilan kalit yarating (kalitni telefon ilovasiga qo'shish ham README'da — bir martalik). Backend terminali o'zi qayta ishga tushadi, xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Kodni o'qib tekshirish** — uch belgini o'z ko'zingiz bilan ko'ring: (1) qidiruvda matn qo'shib yasalgan so'rov yo'q, `find({ where: { telefon } })` bor; (2) kodda `|| '…'` zaxira kalit yo'q; (3) `POST /kirish` parolni ham, kodni ham tekshiradi — noto'g'ri kod bilan token yo'q (401). Agent nima desa ham, kod shuni ko'rsatsin.
  5. **O'z g'oyangiz** — qavs ichini o'z loyihangiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying — uyda o'z papkangizda yuborasiz:
     > Qayerda: `{loyiha papkasi}/backend`.
     > Nima qilsin: `{aniq qidiruv yoki filtr}` so'rovida foydalanuvchi matni SQL satriga qo'shilmasin — parametrli so'rov bo'lsin; maxfiy kalitlar faqat `.env` dan olinsin (zaxira qiymatsiz); {ega yoki admin} kirishida token faqat parol va 6 xonali kod birga tekshirilgandan keyin berilsin.
     > Nima buzilmasin: boshqa yo'llar va jadvallar o'zgarmasin. O'zgargan fayllarni ayt.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (kod kartasi + «Xavfsizlik ro'yxati», chizmaning kattasi):
  - Qidiruv: `bandlar.find({ where: { telefon } })` · ro'yxat 1-karta **yashil**
  - Kalit: `process.env.JWT_SECRET` (zaxira qiymatsiz) · ro'yxat 3-karta **yashil**
  - Kirish: parol + 6 xonali kod → bitta `POST /kirish` → token · 2FA qatori **yashil**
- Hammasi bajarilgach (yashil): Backend tayyor: qidiruv parametrli, maxfiy kalit faqat `.env` da, kirish ikki qadamli. (82)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-05-start` (`.env` fayllaringiz o'zgarmaydi)
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: 2FA kutubxonasi va kalit yaratish yo'li repo'da oldindan tanlangan va README'da (P-060; agent tanlamaydi — tayanch 9.15). Hujum qatori bu blokda ham yo'q — faqat yopish va kodni o'qib tekshirish.

## A2 · Amaliyot 2 — ega sahifasi va push  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈15 daq; `screens[14]`)
- Eyebrow: Amaliyot 2 · sayt → push
- Sarlavha: **Ega sahifasini xavfsiz qiling va push qiling.** (43)
- Mentor: Ism endi oddiy matn bo'lib chiqsin, kirishda kod so'ralsin — keyin push qilasiz. «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — Backend terminali ishlab tursin. Ikkinchi terminalda `cd web`, keyin `npm run dev`; brauzerda `localhost:5173/ega`.
  2. **Prompt** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `web/src/Ega.jsx` — bandlar ro'yxati va kirish formasi.
     > Nima qilsin: (1) ism oddiy matn sifatida chiqsin — `dangerouslySetInnerHTML` olib tashlansin, `{b.ism}` qolsin. (2) kirish formasi ikki qadamli bo'lsin: avval parol, keyin 6 xonali kod maydoni; «Kirish» parol va kodni birga `POST /kirish` ga yuborsin.
     > Nima buzilmasin: bandlar ro'yxati va kun almashtirgichi o'zgarmasin; kirish muvaffaqiyatsiz bo'lsa ro'yxat ochilmasin va xato ko'rsatilsin. O'zgargan fayllarni ayt.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  3. **Kodni o'qib tekshirish va sinash** — `Ega.jsx` da `dangerouslySetInnerHTML` yo'qligini ko'ring. Saytda parol bilan kiring: 6 xonali kod so'ralsin (telefon ilovasidagi kod). Noto'g'ri kod bilan ro'yxat ochilmasin. Oddiy ism bilan ro'yxat to'g'ri chiqsin.
  4. **Push** — uch zaiflik yopilgani va 2FA ishlaganiga ishonch hosil qilgach: `git add .` yoki `git add -A` bilan hammasini emas — `git status` bilan o'zgargan fayllarni ko'rib, faqat shularni qo'shing, `git commit`, `git push`. Render va Netlify push'dan keyin o'zi yangilanadi. (`.env` push qilinmaydi — `.gitignore` da.)
  5. **O'z g'oyangiz** — qavs ichini to'ldiring, «Nusxalash» — uyda o'z loyihangizda yuborasiz:
     > Qayerda: `{loyiha papkasi}/web` — foydalanuvchi matni ko'rinadigan joy.
     > Nima qilsin: foydalanuvchi yozgan matn oddiy matn sifatida chiqsin (HTML bo'lib emas); {ega yoki admin} kirishi ikki qadamli bo'lsin — parol va kod birga yuborilsin.
     > Nima buzilmasin: qolgan sahifalar ishlayversin; kirish muvaffaqiyatsiz bo'lsa ichkari ochilmasin.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (ega sahifasi maketi + ro'yxat):
  - Kirish: parol → 6 xonali kod maydoni → bandlar ro'yxati
  - Ro'yxat: `18:00 · Ali · +998 90 000 00 01` (ism oddiy matn)
- Hammasi bajarilgach (yashil): Ega sahifasi xavfsiz: ism matn bo'lib chiqadi, kirishda kod so'raladi — endi push qilsa bo'ladi. (97)
- Pastki qator (kichik): Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-05-done` (`.env` fayllaringiz o'zgarmaydi)
- Nishon (bonus): Hardened — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- O'qituvchi eslatmasi: push faqat zaifliklar yopilgandan keyin (tayanch 3). Tekshiruv — o'z saytida; boshqa sayt tekshirilmaydi (11-ekran qoidasi).

## 15 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 4 savol + yakuniy tartib + 2 blok «Bajardim» (`PRACTICE_BASE`). QKod (8) — `practice: -1`.
- Savol yorliqlari (`Q_LABELS`): 3 — «1 — SQL injection belgisi» · 5 — «2 — XSS yopish» · 7 — «3 — Maxfiy kalit» · 10 — «4 — 2FA» · 12 — «Yakuniy — ega kirishi tartibi»

## 16 · Takrorlash  ← QKartochka (12 karta, tepadan — 174)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- ✎ Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil pulsatsiya bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim · hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 17 · Yakun  ← QYakun (texnik darslar standarti, 192/204)
- Yuqori yorliqlar: ✓ Uch zaiflik yopilgan · {N}/5 to'g'ri
- Sarlavha: **Uch zaiflik yopilgan, ega kirishi 2FA bilan.** (46)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, kartochkaga qo'shilmaydi — P-013): Bu darsda zaiflikni hujum qilmasdan, koddagi xavfli belgilarni o'qib topasiz: matn so'rovga qo'shilganmi, HTML bo'lib chiqqanmi, maxfiy kalit kodda turganmi.
- ✓ Endi siz bilasiz (5):
  - SQL injection — foydalanuvchi matni so'rovga qo'shilib ketishi; parametrli so'rov buni yopadi.
  - XSS — foydalanuvchi matni sahifada kod bo'lib ishlab ketishi; bu ro'yxatda ism oddiy matn bo'lib chiqqach, shu zaiflik yopildi.
  - Maxfiy kalit kodda turmasin — faqat `.env` dan olinadi, yo'q bo'lsa Backend ishga tushmaydi.
  - 2FA — parol va telefon ilovasidagi 6 xonali kod; parol begona qo'lga o'tsa ham kod kerak.
  - Zaiflikni kodni o'qib va saytni oddiy ma'lumot bilan sinab tekshiramiz — faqat o'z saytingizda.
- Katta tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda so'zlar: SQL injection · XSS · maxfiy kalit · 2FA)
- Bosilgach karta «Uyda nima qilasiz?» (kim uchun — o'z loyihangiz · nechta — 3 zaiflik + 2FA · muddat — keyingi darsgacha):
  1. **Zaifliklar** — A1 dagi «O'z g'oyangiz» promptini loyihangizda yuboring: foydalanuvchi matnli so'rovlar parametrli, maxfiy kalitlar faqat `.env` da.
  2. **Ism** — A2 dagi promptni yuboring: foydalanuvchi yozgan matn oddiy matn bo'lib chiqsin.
  3. **Ikkinchi qadam** — ega yoki admin kirishiga 6 xonali kod qo'shing, kodni o'qib tekshiring va push qiling.
  - Keyingi dars — «Foydalanuvchi sizga ma'lumotini ishonadimi?». Ma'lumot sizib chiqsa nima bo'ladi: audit va maxfiylik siyosati.
- Nishonlaringiz — N/5
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Nishonlar (5) — inglizcha nom va medal (o'yin qatlami)
- **SQL Shield** — SQL injection belgisini kodda topdingiz (3-ekran, 1-savol — birinchi urinishda)
- **Clean Output** — Ismni XSS'dan qanday yopishni bildingiz (5-ekran, 2-savol)
- **Key Keeper** — Maxfiy kalit nega kodda turmasligini bildingiz (7-ekran, 3-savol)
- **Two Steps** — 2FA ega kirishini nega mustahkamlashini bildingiz (10-ekran, 4-savol)
- **Hardened** — Ikki amaliyot blokini oxirigacha bajardingiz (A2, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q (S-034: tekin bonus bitta)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/` va 10-Modul 01–03 MD lari: SQL Shield, Clean Output, Key Keeper, Two Steps, Hardened — 0; «Secret Safe» 9-Modul 4-darsida band, «Token Keeper» band — shuning uchun «Key Keeper»).

## Qisqa takrorlash oynalari (5) — har ballik testga 3 karta, emoji o'rniga koddan bitta qator (S-026)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «SQL injection belgisi»
   - `"... telefon = '" + telefon` · Matn so'rovga qo'shilgan — zaiflik shu yerda.
   - `find({ where: { telefon } })` · Parametrli so'rov — matn alohida uzatiladi.
   - `SQL injection` · Matn so'rovga buyruq bo'lib qo'shilib ketishi.
   - Sinfga savol: Matn qo'shilgan so'rov nega xavfli?
2. 2-savol (5-ekran) — «XSS yopish»
   - `dangerouslySetInnerHTML` · Ism HTML bo'lib chiqadi — zaiflik shu yerda.
   - `{b.ism}` · React matnni matn bo'lib chiqaradi — kod bo'lib ishlamaydi.
   - `XSS` · Matn boshqa odamning sahifasida kod bo'lib ishlab ketishi.
   - Sinfga savol: Ismni butunlay olib tashlasak, ega nimani yo'qotadi?
3. 3-savol (7-ekran) — «Maxfiy kalit»
   - `|| 'zaxira-kalit'` · Zaxira kalit kodda — kodni o'qigan ko'radi.
   - `process.env.JWT_SECRET` · Kalit faqat `.env` dan olinadi.
   - `if (!kalit) throw` · Kalit yo'q bo'lsa — Backend ishga tushmaydi.
   - Sinfga savol: Umami ID ham maxfiy kalitmi?
4. 4-savol (10-ekran) — «2FA»
   - `EGA_2FA_KALITI` · Backend va telefon ilovasi bir xil koddan foydalanadi.
   - 6 xonali kod · Telefon ilovasida ko'rinadi, odatda 30 soniyada yangilanadi.
   - parol → kod → token · Ikki qadam to'g'ri bo'lsa, token beriladi.
   - Sinfga savol: Parol begona qo'lga o'tsa, kodsiz kira bo'ladimi?
5. Yakuniy (12-ekran) — «Ega kirishi tartibi»
   - `EGA_PAROLI` · Avval parol `.env` bilan tekshiriladi.
   - `EGA_2FA_KALITI` · Keyin 6 xonali kod hisoblab solishtiriladi.
   - token · Ikkisi mos kelsa — token beriladi, ro'yxat ochiladi.
   - Sinfga savol: Parolni o'tkazib, to'g'ridan kodga o'tsa bo'ladimi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Zaiflik nima? | Kodda begona odam foydalanishi mumkin bo'lgan xato | Yopish — uni tuzatish |
| SQL injection nima? | Foydalanuvchi yozgan matn Database so'roviga buyruq bo'lib qo'shilib ketishi | Belgi: matn so'rov satriga qo'shilgan |
| SQL injection qanday yopiladi? | Parametrli so'rov bilan | Matn alohida uzatiladi, so'rovga qo'shilmaydi |
| XSS nima? | Foydalanuvchi yozgan matn boshqa odamning sahifasida kod bo'lib ishlab ketishi | XSS — Cross-Site Scripting |
| Bu ro'yxatdagi XSS qanday yopildi? | Ismni oddiy matn sifatida chiqarib | `dangerouslySetInnerHTML` o'rniga `{b.ism}` |
| XSS belgisi kodda qaysi? | `dangerouslySetInnerHTML` | Foydalanuvchi matni HTML bo'lib chiqadi |
| Maxfiy kalit qayerda turadi? | `.env` faylida, kodda emas | `JWT_SECRET`, `EGA_PAROLI`, `EGA_2FA_KALITI` |
| Zaxira qiymat nega xavfli? | Kodni o'qigan har kim kalitni ko'radi | Belgi: `|| '…'` maxfiy kalit yonida |
| 2FA nima? | Ikki bosqichli kirish: parol + telefon ilovasidagi 6 xonali kod | Token — Backend ikkalasini tekshirgandan keyin |
| 6 xonali kodni nima hisoblaydi? | Telefon ilovasi va Backend — bir xil kalitdan | Kod odatda 30 soniyada yangilanadi |
| Bu darsda zaiflik yopilganini qanday tekshirdik? | Kodni o'qib va saytni oddiy ma'lumot bilan sinab | Faqat o'z saytingizda; bu butun sayt xavfsizligi emas |
| `EGA_2FA_KALITI` qayerda saqlanadi? | `.env` faylida | Backend va telefon ilovasi undan bir xil kod hisoblaydi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. SQL injection nima? ✔ Foydalanuvchi matni so'rovga buyruq bo'lib qo'shilishi · Database'dagi bitta jadvalning noto'g'ri nomlanishi · Backend'ning so'rovga sekin javob berishi · Saytning telefon raqamini xato ko'rsatishi
2. Qidiruvni SQL injection'dan nima yopadi? Telefonni katta harfga aylantirish · ✔ Parametrli so'rov · Qidiruvni butunlay o'chirish · So'rovni `POST` bilan yuborish
3. Kodda SQL injection belgisi qaysi? So'rov `bandlar` jadvaliga borgani · Qidiruv telefon bo'yicha ekani · ✔ Foydalanuvchi matni so'rov satriga qo'shilgani · So'rov javob qaytargani
4. XSS nima? Backend'ning ikki marta ishga tushishi · Parolning kodda qolib ketishi · Database so'rovining sekinlashuvi · ✔ Foydalanuvchi matni sahifada kod bo'lib ishlashi
5. Ega ro'yxatidagi ismni XSS'dan nima yopadi? ✔ Oddiy matn sifatida chiqarish · Ismni Database'dan o'chirish · Ismni katta harf qilish · Ism uzunligini cheklash
6. Kodda XSS belgisi qaysi? Ism Database'da saqlangani · ✔ Ism HTML sifatida chiqarilgani (`dangerouslySetInnerHTML`) · Ism ro'yxatda ko'ringani · Ism token bilan kelgani
7. Maxfiy kalit qayerda turishi kerak? Backend kodining boshida · Sayt kodining ichida · ✔ `.env` faylida, kodda emas · Database'dagi alohida jadvalda
8. `JWT_SECRET` ga zaxira qiymat nega yozilmaydi? Backend uni o'qiy olmaydi · Zaxira qiymat juda uzun bo'ladi · Qiymat Database'ga ko'chadi · ✔ Kodni o'qigan har kim uni ko'radi
9. 2FA nima? ✔ Parol va telefon ilovasidagi 6 xonali kod · Ikki xil parol bilan kirish · Parolni ikki marta yozish · Database'ning ikki nusxasi
10. 6 xonali kodni nima hisoblaydi? Faqat Backend o'zi · ✔ Telefon ilovasi va Backend bir kalitdan · Faqat telefon ilovasi · Database har so'rovda
11. Zaiflik yopilganini qanday tekshiramiz? Boshqa saytni sinab ko'rib · Agentdan so'rab olib · ✔ Kodni o'qib va oddiy ma'lumot bilan sinab · Sahifa ochilishini kutib
12. Push qachon qilinadi? Zaifliklardan oldin, keyin tuzatib · Dars boshida, hammasidan avval · Agent aytganda, tekshirmasdan · ✔ Zaifliklar yopilgandan keyin

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har harf 3 marta).
Har savolda to'g'ri variant eng uzun emas (S-006; qurishdan keyin skript bilan qayta sanaladi). Ballik matnda atama izohi (S-020): XSS — «Cross-Site Scripting» (4-savol), `dangerouslySetInnerHTML` — «ism HTML bo'lib chiqadi» (6-savol).
Ekran testlari bilan takror yo'q (§144): 1-savol (SQL injection belgisi) ↔ arena 1, 3 (ta'rif, belgi) · 2-savol (XSS yopish) ↔ arena 5, 6 · 3-savol (maxfiy kalit) ↔ arena 7, 8 · 4-savol (2FA) ↔ arena 9, 10.
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): SQL injection · XSS · `dangerouslySetInnerHTML` · `find({ where })` · `$1` · `JWT_SECRET` · `EGA_2FA_KALITI` · `.env` · 2FA · token · parol · zaiflik · yopish · parametrli so'rov · maxfiy kalit
Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — qurishda kerak bo'ladigan narsalar (qolipda yo'q yoki qo'shimcha)
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14, pilotdan nusxa yo'q); palitra `qolipRang('tex')`, `qolipCss(T)`; `LESSON_META.lessonId` `m8-05-security-basics-v1`.
   `SCREEN_META` 18: hook · plan · concept · test · concept · test · concept · test · practice(kod) · concept · test · concept · test(final, `scope: 'final'`) · practice(A1) · practice(A2) · stats · flashcards · summary.
   `INLINE_KEYS`: s3 **1 (B)** · s5 **2 (C)** · s7 **0 (A)** · s10 **3 (D)** · s12 sentinel **0**; QKod (8) va bloklar (13, 14) — `practice: -1`, blok signali `PRACTICE_BASE + ekran`.
2. **Bitta manba (180):** `XAVF_KARTALAR` (3 zaiflik + 2FA qatori: `{ id, nom, belgi, yopish, holat }`) · `XAVF_RUYXAT` (chizma) · `KOD_NAMUNA` (har zaiflikning «ochiq»/«yopilgan» kod kartasi, `fmtCode`) ·
   `NAMUNA_BANDLAR` (`Ali · +998 90 000 00 01 · 18:00`, `Bek · +998 90 000 00 02 · 17:00`) · `KOD_2FA` (`284 193`, namuna) · `FINAL_BOLAKLAR` (12-ekran, 5 bo'lak).
3. **`XavfRuyxat`** komponenti: ega sahifasi maketi (191 ramka: parol formasi · bandlar ro'yxati · telefon qidiruv maydoni · 2FA kod maydoni · telefon ilovasi ramkasi 6 xonali kod bilan),
   Backend kod kartasi (`fmtCode`, «ochiq»/«yopilgan» ikki ko'rinish), uch zaiflik kartasi (qizil «ochiq» → yashil «yopilgan») + 2FA qatori (kulrang → yashil). Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: xr-ega xr-kod xr-karta xr-2fa`).
   Maket `prefers-reduced-motion` da rangni birdan o'zgartiradi (DE-200). Logotip/emoji yo'q (D4). **Payload yo'q:** maketda hujum qatori ko'rsatilmaydi (tayanch 7).
4. **0-ekran `QKirish`:** ega sahifasi (qidiruv ishlaydi) + agent chati (2 pufak) + uch o'zgarish; qidiruv ishlatilmaguncha variantlar xira; javobdan keyin uch qizil karta.
5. **`QTushuncha` ekranlari** (`zoom`, `tugadi` majburiy — q17/q18): 2 — ikki tugma (matn qo'shish / parametrli) + kod kartasi · 4 — ikki tugma (HTML / oddiy matn) + maket · 6 — ikki tugma (zaxira / `.env`) + kod kartasi ·
   9 — `QQadamlar` (3) + ega kirishi + telefon ilovasi + 2FA maydoni · 11 — «Tekshiring» + uch ✓ belgi + etika QIzoh.
   Bashorat (`QBashorat`/`QTaxmin`) — 2, 4, 6, 9, 11-ekranlarda, ballsiz, `onAnswer` ga kirmaydi.
6. **QKod (8) → `HtmlCompiler`** (ko'p fayl: `index.html` va `db.js` tayyor · `app.js` o'quvchi). **Yangi runtime tekshiruvlari** (yashirin tekshiruv-iframe'ida):
   matn qo'shib yasalgan `const sql` qatori qolmagan · so'rov `$1` + `[telefon]` bilan yozilgan · «Qidirish» bosilganda oddiy telefon (`+998 90 000 00 01`) bilan Ali qatori chiqadi.
   `db(sql, qiymatlar)` faqat parametrli shaklni qabul qiladi (`$1` + ro'yxat); matn qo'shib yasalgan so'rovga «So'rovni parametr bilan yozing» qaytaradi (payload tekshirilmaydi — faqat shakl va oddiy telefon).
   ⚠️ `app.js` va `db.js` starter `.jsx` ichida shablon-satr — starterda backtik yo'q (string qo'shish bilan yoziladi, CLAUDE.md). `storageKey` — `m8d5-code`.
7. **Testlar** `QTest` + `QuestionScreen` (DE-203): 3 (**B**) · 5 (**C**) · 7 (**A**) · 10 (**D**); yakuniy 12 — `QTartib` (5 bo'lak).
   Variant uzunliklari qurilgandan keyin skript bilan qayta sanaladi (S-006).
8. **`ScreenBlok` ×2** (skeletdagi ulagich) + `QPrompt` — 5 qadam (5-qadam «O'z g'oyangiz», `{…}` joylari accent pill). A1 prompti uch yo'riqli («Qayerda · Nima qilsin · Nima buzilmasin»), «Nima qilsin» uch bandli (uch zaiflik + 2FA).
   `ortda`: A1 `m10-dars-05-start`, A2 `m10-dars-05-done`. A2 4-qadam — push (buyruq o'quvchida, repo push — foydalanuvchi qurganda).
9. `RECAPS` 5 (kalit = 3, 5, 7, 10, 12) · `Q_LABELS` {3, 5, 7, 10, 12} · `ACHIEVEMENTS` 5, `ACH_TRIGGERS`: 3 → SQL Shield, 5 → Clean Output, 7 → Key Keeper, 10 → Two Steps, A2 oxirgi «Bajardim» → Hardened.
10. `QUIZ_BANK` 12 (✔ A·B·C·D ×3) + `QZ_BG_SHAPES` fon so'zlari `{uz, ru}`, emojisiz · `FLASHCARDS` 12 ({front, back, note}) · `HW_TOKENS`.
11. App.jsx `m8-05` qatoriga `comp: SecurityBasicsLesson` — asosiy seans, «qur» bosqichida (nom va `sub` o'zgarmaydi, DE-205 ✓). `narrow` — test ekranlari. App.jsx `m8-05` da `type: 'Kod'` (hozir `comp` yo'q).
12. **Darvozalar:** `npm run gates -- src/8-Modull/SecurityBasicsLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` · `lint:layout` 1280/390 · surat 1280 + 393.

## REPO — `maydon` ga qo'shiladigan narsalar (`m10-dars-05-start` = `m10-dars-04-done` + 3 zaiflik → `m10-dars-05-done`; «qur» bosqichida, 9-Modul repo'si yopilgandan keyin)
**`m10-dars-05-start` (ataylab qoldirilgan uch zaiflik — README: «bu teg prodga chiqarilmaydi»):**
1. `backend/src/bandlar.controller.ts` — yangi `GET /bandlar/qidir?telefon=` (`@UseGuards(EgaGuard)`): so'rov matn qo'shib yasalgan — `query` builder'da `` `... WHERE telefon = '${telefon}'` `` yoki raw SQL (`DataSource.query`) matn bilan. **Zaiflik: SQL injection.**
2. `web/src/Ega.jsx` — ro'yxat qatorida ism `<span dangerouslySetInnerHTML={{ __html: b.ism }} />` (agent «ismni qalin ko'rsatish» uchun qo'shgan). **Zaiflik: XSS.**
3. `backend/src/app.module.ts` (yoki `kirish.controller.ts`) — `secret: process.env.JWT_SECRET || 'zaxira-kalit'`. **Zaiflik: maxfiy kalit kodda.** (`dars-11-done` da bu toza — `JWT_SECRET` yo'q bo'lsa xato tashlaydi; start tegida zaxira qiymat qo'shiladi.)

**`m10-dars-05-done` (uch zaiflik yopilgan + 2FA):**
4. `GET /bandlar/qidir` — `this.bandlar.find({ where: { telefon } })` (parametrli; TypeORM qiymatni alohida uzatadi).
5. `web/src/Ega.jsx` — ism `<li><b>{b.soat}</b> · {b.ism} · <a href={...}>{b.telefon}</a></li>` (ism oddiy matn, `dangerouslySetInnerHTML` yo'q — `dars-11-done` dagi toza shakl).
6. `JWT_SECRET` — faqat `process.env.JWT_SECRET`, zaxira qiymat yo'q; yo'q bo'lsa Backend ishga tushmaydi (`dars-11-done` dagi `InternalServerErrorException` kengaytiriladi: app yuklanishida tekshiradi).
7. **2FA (05-FILTR 1 — bitta so'rov):** `backend/.env` ga `EGA_2FA_KALITI` qo'shiladi; `POST /kirish { parol, kod }` — parol `EGA_PAROLI` bilan va 6 xonali kod `EGA_2FA_KALITI` dan (TOTP) **bitta so'rovda** tekshiriladi;
   token faqat ikkalasi to'g'ri bo'lsa beriladi, aks holda 401 «Parol yoki kod noto'g'ri» (qaysi biri aytilmaydi). Ikki bosqich — faqat saytdagi forma (avval parol maydoni, keyin kod maydoni).
   TOTP kutubxonasi va kalit yaratish yo'li (kriptografik tasodifiy kalit, ilovaga qo'shish uchun QR yoki kalit qatori) — **«qur» dan oldin asosiy seans tanlaydi va rasmiy hujjatdan tekshiradi**, repo agenti tanlamaydi (tayanch 9.15); README'da bitta buyruq.
   ✅ **06.10 QAROR 10M-58 (foydalanuvchi tasdig'i, F-1005-173):** kutubxona — `otpauth` 9.5.2; tekshiruv `new OTPAuth.TOTP({ issuer: 'Maydon', label: 'ega', secret: process.env.EGA_2FA_KALITI })` → `totp.validate({ token: kod, window: 1 }) !== null` (±30 s; `if (totp.validate(...))` — xato: to'g'ri kod `0`). Kalit: `npm run kalit:2fa` — kalit qatori + terminalda QR (`qrcode` 1.5.4), QR o'qilmasa — kalitni ilovada qo'lda kiritish (README zaxira). Manba va sinov: `JURNAL.md` F-1005-172.
   `web/src/Ega.jsx` — parol to'g'ri bo'lgandan keyin 6 xonali kod maydoni. README «Xavfsizlik»: kalitni telefon ilovasiga qo'shish (bir martalik buyruq), tekshiruv faqat o'z saytingizda.
8. README «Darslar va teglar» jadvaliga `m10-dars-05-done` qatori; «Xavfsizlik» bo'limi (uch zaiflik belgisi va yopilishi, 2FA kalitini telefon ilovasiga qo'shish).
9. **Keyingi darslar uchun ochiq qoldi:** `/maxfiylik` sahifasi va `AUDIT.md` (6-dars) · 30 kundan eski bandlarni o'chirish (6-dars) · `/health`, UptimeRobot (7-dars).

---

## TAYANCHGA SAVOL (tayanchda yo'q — o'zim qaror qildim, tasdiq kerak)
1. **SQL injection yopishi — `find({ where: { telefon } })` (TypeORM).** Tayanch «parametrli so'rov (TypeORM)» deydi. QKod'da raw SQL `$1` ishlatdim (kod oynasida TypeORM ishlamaydi) — repo'da esa `find`. Ikkalasi bir g'oya: matn alohida uzatiladi. Kod oynasi TypeORM'ga yaqinlashtirilsinmi yoki raw SQL qolsinmi?
2. ✅ (05-FILTR 9: repo darajasida oldindan tanlanadi — tayanch 9.15) **2FA kutubxona nomi** — promptda aytilmadi (P-060), README'da bo'ladi. Qaysi kutubxona (masalan TOTP uchun keng tarqalgani) — tayanchda yo'q; «qur» bosqichida README'da nomlanadi. Tayanchga qo'shilsinmi?
3. **`EGA_2FA_KALITI` nomi** — tayanch 3-bo'lim shu nomni beradi (va `GATE_M_JAVOB` TEX-q3). `EGA_PAROLI` va `JWT_SECRET` — 9-Modul nomlari. Nomlar aynan shunday.
4. **2FA kodi namunasi `284 193`** — o'ylab topilgan olti xona (statistika emas, 9-ekran va 12-ekran maketida). Boshqa son kerakmi?
5. **`m10-dars-05-start` = `m10-dars-04-done` + 3 zaiflik.** Tayanch «4-dars holati + uch zaiflik» deydi (4-dars `m10-dars-04-done` = A/B test). Start tegi A/B test ustiga zaifliklarni qo'yadi.
6. **Start tegidagi SQL injection zaifligi — yangi `GET /bandlar/qidir` qidiruv yo'li.** Tayanch «ega qidiruvida xom SQL» deydi, ammo `dars-11-done` da telefon qidiruvi yo'q. Shuning uchun start tegida agent qo'shadigan yangi qidiruv yo'li — bu. Alternativa: `GET /bandlar` ga `telefon` filtri qo'shish.
7. **11-ekran etika qatori** — darsda aynan bir marta (tayanch 3). Boshqa darslar (6-dars) ham shu qatorni ishlatsa, modul ichida takrorlanadimi yoki har darsda bir marta? Men bu darsda bir marta qo'ydim.
8. **QKod (8) kod oynasi** — `HtmlCompiler` raw SQL model bilan; TypeORM yo'q. Qurishda og'ir bo'lsa — ekran «ikki so'rovni solishtirish» (QTushuncha) ga aylanadi, qo'lda yozish faqat A1 da qoladi (02-dars shubhali 9 bilan bir xil holat).
9. **Oldingi dars eslatmasi (4-dars A/B natijasi)** — tayanch 9.5 dagi sonlar bilan 0-ekran Mentorida bir qator. 4-dars MD si boshqa son bersa — moslanadi.
10. **Blokda 5 qadam** (4 + «O'z g'oyangiz») — 9-Modul M-q1 va 02-dars bilan bir xil; P-059 dagi 4 qadamdan bittaga ko'p.
11. **A1 «Nima qilsin» uch bandli** (uch zaiflik + 2FA) — bir promptda to'rt ish. P-008 «bir ekran bir ish»ga yaqin chegara; ammo blok qadamlari bitta mavzu (Backend xavfsizligi). Ajratilsa A1 ikki blokka bo'linadi va dars 19 ekran bo'ladi.

## Shubhali joylar (ishonchim komil emas)
1. **QKod raw SQL vs repo TypeORM** — ikki shakl bir g'oyani o'rgatadi, lekin o'quvchi kod oynasida `$1` yozib, repo'da `find({ where })` ko'radi. O'qituvchi eslatmasi (8-ekran) buni bog'laydi; baribir ikki shakl biroz uzilish berishi mumkin.
2. **XSS'ni payloadsiz ko'rsatish** — 4-ekranda «belgilar sahifa kodi bo'lib ketishi mumkin» deyiladi, lekin aniq nima bo'lishi ko'rsatilmaydi (tayanch 7). 13 yoshli o'quvchi «qanaqa belgilar?» deb so'rashi mumkin; javob — bu tekshiruv-emas, himoya darsi. To'g'ri, lekin biroz mavhum.
3. **2FA (TOTP) mexanikasi** — «Backend va telefon ilovasi bir xil kalitdan hisoblaydi» deb soddalashtirdim; vaqt bo'yicha hisoblash (30 soniya) kartochkada. To'liq TOTP algoritmi berilmaydi — 13 yoshga og'ir va kerak emas.
4. **Start tegidagi zaifliklar `dars-11-done` ustiga** — `dars-11-done` da kod toza (parametrli `find`, React matn, `JWT_SECRET` tekshiruvi). Start tegida bu uchtasi ataylab «orqaga buziladi». Bu mexanizm (zaiflik qo'shish) 9-Modul repo'si yopilgandan keyin quriladi; hozir faqat REPO bo'limida tasvirlangan.
5. **6-ekran va 9-ekran joriy qatori ikki gap** (115–120 belgi) — atama ta'rifi (zaxira qiymat / 2FA) ikki gapda. Qisqartirilsa ta'rif to'liq chiqmaydi.
6. ✅ (05-FILTR 8: `'zaxira-kalit'` — haqiqiy kalitga o'xshamaydigan namuna) **`JWT_SECRET` zaxira qiymati `maydon-maxfiy-2026`** — kod kartasida ko'rsatiladigan qiymat (bu maxfiy kalit emas, namuna-zaxira). O'quvchi buni haqiqiy kalit deb o'ylamasligi uchun «zaxira qiymat» deb atadim; baribir ekranda bir maxfiy kalitga o'xshash satr turadi.
7. **A1 3-qadamda kalit yaratish buyrug'i README'da** — buyruq matnini tayanch bermaydi (P-060); «qur» bosqichida README'da yoziladi va tirikligi tekshiriladi (P-028). MD'da umumiy so'z bilan.

---

## Qurilish (06.10.2026, F-1005-180) — kodda MD dan farqlar (ertalab ko'rikda tasdiqlanadi)
- Joylashuv: telefon (ega sahifasi, 172×272, «Sayt · React `/ega`») chapda, kod va zaiflik kartasi o'ngda; 2, 4, 6-ekranlarda ikki tanlov telefon va Backend orasidagi yo'lakda; 9-ekranda tugma telefon ostida (n/3), «noto'g'ri kod → 401» harakati yo'q (natija blokidagi izohda).
- 8-ekran kod oynasi boshlang'ich kodi: MD dagi starter yechimni o'z ichiga olgan edi — starterda eski qator (`const sql = "…'" + telefon + "'"` · `return db(sql)`), izohlar MD dagidek; `db.js` `index.html` ichida (2-dars yo'li); `storageKey` `m8d5-code`.
- Darvoza o'lchovi: 2-ekran xulosasi → «Parametrli so'rovda alohida uzatiladi, buyruq bo'lib o'qilmaydi.» (109) · kirish «Aynan!» javobidan «koddagi» so'zi olindi · arena chalg'ituvchilari tenglashtirildi (to'g'ri javoblar o'zgarmadi).
- Promptlar, kartochkalar, kod shartlarida MD dagi backtiklar olindi (yuzada xom ko'rinardi). A1 kutilgan natijasida `totp.validate({ token: kod, window: 1 }) !== null` (QAROR 10M-58).
- 6-ekran Mentori va 3-savol C izohi: `m4-11` → «Autentifikatsiya va .env» darsi ✎ (T-036) — yuqorida tuzatilgan.

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m8-04` «Ikki variantdan qaysi biri yaxshiroq ishlaydi?» → **`m8-05` «Kiberxavfsizlik: zaiflikni topib yopamiz»** → `m8-06` «Foydalanuvchi sizga ma'lumotini ishonadimi?»
  (App.jsx 332–334-qatorlar, 05.10); reja teglari `sub` so'zlari bilan: `SQL injection` · `XSS` · `maxfiy kalitlar` · `2FA`.
- [x] Bitta misol-ip («Maydon» ega sahifasi, hook → bloklar); metafora yo'q; keyssiz (tayanch 5); bitta vizual — «Xavfsizlik ro'yxati» `XAVF_RUYXAT` (0, 1, 2, 4, 6, 8, 9, 11, A1/A2).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (ikki ko'rinish → 1-karta yashil), 4 (ikki ko'rinish → 2-karta), 6 (ikki ko'rinish → 3-karta), 9 (qadamlar → 2FA qatori), 11 (uch ✓) + 0, 8, 12, A1, A2.
- [x] O'lchov (Python `len()` bilan, skript scratchpad'da): sarlavhalar 25–54 · Mentor ≤2 gap, sarlavha so'zlarini takrorlamaydi · xulosalar 82–108 · hook javoblari 84–112 · xato izohlari 42–60.
  ✗ 2, 4, 6-ekran joriy qatorlari 115–120 (ikki gap, atama ta'rifi — shubhali 5; 02-dars 6-ekrani bilan bir xil holat).
- [x] Atamalar oldingi darslar bilan: maxfiy kalit, `JWT_SECRET`, login, token, imzo (`m4-11`) · ega, ega kirishi, bandlar ro'yxati (9-Modul) · sayt · Backend · Database · jadval · qator · `.env` · siz-forma ·
  SQL injection, XSS, 2FA ta'riflari tayanch 2-bo'limdan aynan · «sir» ishlatilmadi (→ maxfiy kalit) · «qator» faqat jadval qatori · promptlar agentga buyruq shaklida (T-002); tugmalar siz-formada, yorliqlar ot-shaklda.
- [x] Testlar: variantlar uzunligi yaqin (3: 37–41 · 5: 36–44 · 7: 37–40 · 10: 39–45), to'g'ri variant eng uzun emas; kalit so'z/strelka/qavs faqat to'g'rida emas; inkor-savol yo'q ·
  ✔: s3 B · s5 C · s7 A · s10 D · arena A·B·C·D ×3; to'g'ri izoh bitta gap, «To'g'ri!» yo'q.
- [x] Final (12-ekran): uyalarda faqat raqam va «bu yerga qo'ying», Mentor tartibni aytmaydi; tartib 9-ekranda o'rgatilgan (P-063).
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darhol», «darrov» — o'quvchi matnida yo'q, grep).
- [x] Ichki kodlar o'quvchi matnida yo'q (modul raqami, F-ID, `m8-05` — faqat MD izohlarida; o'tgan dars nomi bilan atalgan) · real kompaniya raqami yo'q · texnik faktlar manba bilan (A-10) · «KOD» (12) va «REPO» (9) ro'yxati to'liq.
- [x] **Xavfsizlik qoidasi (tayanch 7, eng muhim):** faqat himoya tomoni — har zaiflik: turi → nega xavfli (bir gap) → kodda belgisi → qanday yopiladi. Payload yo'q · boshqa saytni tekshirish yo'riqi yo'q · aylanib o'tish yo'q.
  Etika qatori aynan bir marta (11-ekran). Tekshiruv — kodni o'qish + oddiy ma'lumot bilan ishlashi. Push zaifliklar yopilgandan keyin (A2 4-qadam).
- [x] Karta T · P · S ko'rildi: T-002 · T-009/010/011 (atama harakatdan keyin; sarlavhalarda yangi atama yo'q — SQL injection/XSS/2FA sarlavhada emas, mavzu nomi) · T-014/015 · T-016/017 (metafora yo'q) · T-021 («sir» yo'q) ·
  T-024 · T-029 · T-033 (XSS/SQL injection/dangerouslySetInnerHTML tarjima qilinmaydi) · T-036 (XSS, 2FA, .env birinchi ko'rinishda ochiladi) · T-039 · T-043 («bu misolda») · T-044 · T-045 (soddalashtirish — shubhali 3) · T-047 · T-052 · T-064 ·
  P-001/004 · P-008 (A1 «Nima qilsin» uch band — shubhali/TAYANCHGA SAVOL 11) · P-010 · P-013 · P-014/015 · P-016 · P-025 · P-026 · P-028 (REPO 7, README tekshiruvi) · P-036 · P-046 · P-052 · P-059 (5 qadam — TAYANCHGA SAVOL 10) · P-062 · P-063 · P-064 · P-065 · P-067 ·
  S-001 (savollar 6–8 so'z) · S-002 · S-004 · S-006 · S-008 · S-010 · S-019 · S-020 (XSS, dangerouslySetInnerHTML glossa) · S-026 · S-031/034 (nishon 4+1 bonus).
