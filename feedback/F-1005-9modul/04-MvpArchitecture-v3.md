# 9-Modul · 4-dars «Mini-MVP arxitekturasi» — MD v3 (yangi dars, TEX + 2 amaliyot bloki)

Fayl: `src/7-Modull/MvpArchitectureLesson.jsx` (kalit `m7-04`) · **18 ekran** (13 dars ekrani + 2 amaliyot bloki + podium, takrorlash, yakun) · faqat o'zbekcha (ru — 6-RU bosqichida)
Namuna: `feedback/F-0929-QA-6modul/01-SystemArchitecture-v3.md` (tuzilish) · blok: `08-PipelineProject-v3.md` (A1–A3) · kod: `src/skelet/NamunaDars.jsx` dan.
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Menyu (DE-205, App.jsx `m7-04`): «Mini-MVP arxitekturasi» · osti «qismlar, ma'lumot, kirish, deploy — sxema» (TAYANCHGA SAVOL 1) ·
oldingi dars `m7-03` «Besh suhbatdan qaysi muammo chiqdi?» · keyingi `m7-05` «Animatsiya: interfeys javob beradi».
Vaqt: ≈ 90 daqiqa — 0–12-ekranlar ≈ 50 · A1 ≈ 20 · A2 ≈ 15 · natija va yakun ≈ 5.

---

Tashqi audit (ChatGPT) Filtri: `04-FILTR.md` — 05.10.2026 qo'llandi.

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Bitta natija.** Dars oxirida o'quvchida ikki narsa bor: **«Maydon» chizmasi** (qismlar · `bandlar` jadvali · to'rt yo'l · ega kirishi · deploy joyi) va **skelet**:
   `maydon` papkasida `backend/` (NestJS) Database'ga (Neon) ulangan, `web/` (React) da statik vaqt kataklari ko'rinadi. Mentor repo'sidagi teg — `dars-04-done` (tayanch 3-bo'lim).
   Chizma 1-ekranda tayyor holatda ko'rsatiladi, 2–11-ekranlarda bo'lakma-bo'lak yozilib boradi, bloklarda papkaga aylanadi.
2. **Bugungi asosiy fikr (P-013):** Kod yozishdan oldin har funksiya chizmada o'z qismini, ma'lumotini va yo'lini oladi — shunda agentga aniq prompt yozasiz. (121)
3. **3-darsdan keladigan narsa** (tayanch 1-bo'lim, aynan): «Maydon» MVP ro'yxati — **qilamiz:** kun bo'yicha vaqt kataklari (bo'sh / band) · katakni band qilish (ism + telefon) ·
   egasi uchun bandlar ro'yxati · **keyin:** to'lov · jamoa yig'ish · eslatma · **qilmaymiz:** baho · chat. Darsda ro'yxat qatorlari **«funksiya»** deb ataladi
   («band» so'zi bu darsda faqat «egallangan katak» ma'nosida — T-015).
4. **Atamalar (bir ma'no — bir so'z, T-014):**
   - **sayt** — React ilova (`web/`, `localhost:5173`); tugunda «Sayt · React». «frontend» ishlatilmaydi.
   - **Backend** — NestJS (`backend/`, `localhost:3000`); tugunda «Backend · NestJS». Prozada «server» yo'q.
   - **Database** — PostgreSQL (Neon); tugunda «Database · PostgreSQL». «baza» yo'q.
   - **qism** — sayt · Backend · Database (8-Modul 1-dars «Komponentlardan tizim» so'zi: «qism», «tizim», «arxitektura»).
   - **chizma** — qismlar, jadval va yo'llar chizilgan rasm; **arxitektura** — shu chizma ko'rsatadigan tuzilish (m6-01: «Kod yozishdan oldin tizimni chizing», «arxitektura chizmasi»).
     «sxema» ishlatilmaydi: kursda «sxema» — Database jadvallari tuzilishi (m4-01 «JSON, jadval, sxema») — TAYANCHGA SAVOL 1.
   - **vaqt katagi · katak** — bitta soatlik oraliq (18:00 — 18:00–19:00); **band qilish · band** — katakni egallash · egallangan katak; **bo'sh** — egallanmagan katak. Boshqa nom yo'q (tayanch 2-bo'lim).
   - **o'yinchi · maydon egasi (ega)** — ikki foydalanuvchi; ismsiz.
   - **jadval `bandlar`** · **ustun** · **qator** («Jadvaldagi har qator — bitta band»). «Qator» faqat jadval ma'nosida; saytdagi kun tanlovi — «kun tugmalari».
   - **yo'l (route)** — Backend'dagi method + manzil: `GET /vaqtlar?kun=` · `POST /bandlar` · `POST /kirish` · `GET /bandlar` (tayanch 3-bo'lim, aynan).
     Kursdagi «route = method + path» (m4-05) bilan 5-ekranda bir gapda tenglashtiriladi (T-052). «Yo'l» boshqa ma'noda (sayohat, kirish yo'li) bu darsda ishlatilmaydi.
   - **ega kirishi** — ega parol bilan `POST /kirish` ga kiradi, **token** oladi (m4-11 «login», «token», «401», «`.env`» — 7-ekranda tenglashtiriladi).
   - **stack** — birga ishlaydigan texnologiyalar to'plami (m2-10 «PERN Stack» so'zi, ta'rif aynan) — TAYANCHGA SAVOL 2.
   - **deploy** — internetga chiqarish (KORPUS §196 izohi, dars bo'yi shu). **skelet (shablon)** — birinchi ko'rinishda qavs bilan, keyin «skelet» (KORPUS §213).
   - **agent** — Antigravity; **prompt** — agentga yuboriladigan matn (blok qolipi so'zi). Bu darsda «talab» ishlatilmaydi — TAYANCHGA SAVOL 12.
5. **Metafora yo'q.** Chizma — haqiqiy arxitektura rasmi; o'xshatish kerak bo'lmadi.
6. **Kod yozish — Antigravity** (6-Moduldan tanish). Prompt faqat *qayerda · nima qilsin · nima buzilmasin* (173.4). Xato bo'lsa — har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.»
   Har blok oxirida bitta qadam — **«O'z g'oyangiz»**: o'sha promptning `{…}` li nusxasi o'quvchi MVP siga (qaror 8); u uyda yuboriladi.
7. **Toza yuza (D4):** tugma va variantlarda emoji yo'q; chizma CSS/SVG bilan chiziladi, logotip yo'q; rang — faqat holat foni (D3).
8. **Real odam bilan ish** bu darsda yo'q (TEX). Uyda — o'z MVP chizmasi va skeleti.

## Darsning ipi va bitta vizual

- **Misol-ip — «Maydon»** (tayanch 1-bo'lim): mahalladagi mini-futbol maydonchasining bo'sh vaqtini ko'rsatadigan va band qiladigan sayt. Hamma ekran — shu bitta sayt.
- **Hook:** 3-darsdagi ro'yxat agentga bitta gapda berilgan → o'yinchi band qildi, ega ko'rmadi → «Kod yozishdan oldin qismlar chiziladi».
- **Bitta vizual — «Maydon» chizmasi (`MAYDON_NODES`, dars bo'yi, 163/180):**
  - Chapda ikki odam: **O'yinchi** · **Maydon egasi** (belgi + so'z, ismsiz).
  - **Sayt · React** — ichida kichik sayt maketi (`localhost:5173`): sarlavha «Maydon» · kun almashtirgichi «‹ **Shanba** ›» · olti vaqt katagi 16:00 · 17:00 · 18:00 · 19:00 · 20:00 · 21:00 ·
    forma (Ism · Telefon · «Band qilish») · ega sahifasi («Bandlar», parol katagi, «Kirish»).
  - **Backend · NestJS** (`localhost:3000`) — ichida `.env` belgisi (`DATABASE_URL` · `EGA_PAROLI` · `JWT_SECRET`, qiymatlari yashirin).
  - **Database · PostgreSQL** (Neon) — kichik jadval kartasi `bandlar`: `id` · `kun` · `soat` · `ism` · `telefon` · `yaratilgan`.
  - Sayt ↔ Backend orasida **to'rt yo'l qatori** (bo'sh paytda uzuq chiziq, ochilgani — mono yozuv + chiziq): `GET /vaqtlar?kun=` · `POST /bandlar` · `POST /kirish` · `GET /bandlar` (qulf belgisi).
  - Pastda ikki zona (11-ekranda yonadi): **Kompyuteringizda** (Sayt, Backend) · **Internetda** (Database — boshidan shu yerda).
  - Holatlar — tugun: kulrang (hali ochilmagan) → oq karta (ochilgan) → accent chegara (joriy) → yashil (ishladi) · qizil (rad etdi, 401). So'rov — yo'l yorlig'i yozilgan kichik konvert.
    `prefers-reduced-motion` da konvert sakraydi.
  - Namuna ma'lumot: `kun` — sana (Shanba = `2026-10-10`, Yakshanba = `2026-10-11`); qatorlar `Ali · +998 90 000 00 01 · 18:00` va `Bek · +998 90 000 00 02 · 17:00` (TAYANCHGA SAVOL 3–5).
  - Ishlatilishi: 0 (sayt maketi — ikki telefonda) · 1 (tayyor) · 2 (qismlar) · 4 (jadval) · 5 (o'yinchi yo'llari) · 7 (ega kirishi) · 9 (stack nomlari) · 11 (zonalar) · A1/A2 kutilgan natija — tugunlarning kattasi.
- **Yakun:** chizma va skelet tayyor · keyingi dars — shu statik kataklar bosilganda javob beradi (animatsiya).

---

## 0 · Kirish — o'yinchi band qildi, ega ko'rmadi  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **O'yinchi band qilgan vaqtni egasi nega ko'rmadi?** (48)
- Mentor: O'tgan darsdagi ro'yxatni agentga bitta gapda berdik. O'yinchi telefonida 18:00 katagini bosing.
- Maket (chap):
  - tepada agent chati, ikki pufak: siz → «Maydon saytini qil: bo'sh vaqt kataklari, band qilish va egasi uchun bandlar ro'yxati.» · Antigravity → «Tayyor! Sayt ochiladi, kataklar ishlaydi.» (T-008 — chat matni)
  - ostida ikki telefon ramkasi yonma-yon: **O'yinchi telefoni** — «Maydon» · Shanba · olti katak, hammasi bo'sh · «Band qilish» ·
    **Ega telefoni** — «Bandlar» · «Hali band yo'q».
- **Harakat → Vizual o'zgarish:** 18:00 katagini bosish → o'yinchi telefonida katak band rangga o'tadi, ostida «Band qilindi»; ega telefonida hech narsa o'zgarmaydi — «Hali band yo'q».
  Shundan keyin o'ngdagi variantlar ochiladi (bosilmaguncha xira).
- Savol: **Egasi nega bandni ko'rmayapti?**
  - Egasi sahifani hali qayta yuklamagan (36)
  - ✔ Band faqat o'yinchi telefonida qolgan (37)
  - Ega telefonida internet ishlamayapti (36)
- Javob — 2-variant: **Aynan!** Bu misolda band faqat o'yinchida qoldi. Umumiy Backend va Database bo'lmasa, egasiga hech narsa yetmaydi. (112, «Aynan!» bilan — F-1005-94 A)
- Javob — 1 yoki 3: **Qiziq fikr!** Yangilash yordam bermaydi: bu misolda ikkalasi ishlatadigan umumiy ma'lumot hali yo'q. (86)
- Javobdan keyin: ikki telefon orasida uzuq chiziqli bo'sh joy paydo bo'ladi — bugun chiziladigan qismlar o'rni (U-041).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun MVP ro'yxatini chizmaga aylantirasiz.** (43)
- Mentor: Kod yozishdan oldin har funksiyaning joyini chizmada belgilaymiz. Dars oxirida shu chizma bo'yicha loyiha skeleti (shablon) ishga tushadi.
- Chap yorliq: Dars oxirida — shu chizma va uning skeleti
- Chap — «Maydon» chizmasi **tayyor** holatda (hammasi oq, konvert bir marta o'zi yuradi — DE-200): O'yinchi · Maydon egasi → Sayt · React ↔ Backend · NestJS → Database · PostgreSQL (`bandlar`);
  Sayt–Backend orasida to'rtta chiziq (yorliqsiz — yo'l nomlari 5 va 7-ekranda ochiladi, P-015).
- O'ng yorliq: Bugungi 4 qadam (tex-karta, bosilmaydi, o'ngda mono teg):
  - 01 · Qismlar va stack · `sayt · Backend · Database`
  - 02 · Ma'lumot jadvali · `bandlar`
  - 03 · Yo'llar va ega kirishi · `GET · POST`
  - 04 · Deploy va skelet · `maydon`
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Uch qism  ← QTushuncha
- Eyebrow: Tushuncha · qismlar
- Sarlavha: **Har ishni qaysi qism bajaradi?** (30)
- Mentor: Har ish bitta qismda bajariladi — shunda agentga qayerga yozishni aniq aytasiz. Kartadagi ish qaysi qismda bajarilsa, o'sha qismni bosing. (F-1005-95 A: ishlar bittadan karta)
- Bashorat (ballsiz, yorliq «Avval o'zingiz belgilab ko'ring»): **«Maydon» MVP siga nechta qism kerak?** · Bitta · Uchta · Beshta — tanlov saqlanadi.
- Chap — MVP kartasi (kichik, 3-darsdan): Kun bo'yicha vaqt kataklari · Katakni band qilish · Egasi uchun bandlar ro'yxati. Ostida 6 ish-tugmasi (aralash):
  Kataklarni ko'rsatadi · Band katakni boshqa rangda chizadi · Katak bo'shligini tekshiradi · Ega parolini tekshiradi · Bandni saqlaydi · Eslatma yuboradi
- O'ng — chizma: Sayt · Backend · Database kulrang (texnologiya nomisiz — 9-ekranda yoziladi) + chetda uzuq chiziqli **«Keyin»** qutisi (joylash zonasi).
- **Harakat → Vizual o'zgarish:** ish-tugmasini tanlab, qismni bosish → to'g'ri bo'lsa tugun kulrangdan oq kartaga aylanadi, ichiga ish qatori yoziladi va tugun belgisi chiqadi:
  Sayt — kataklar maketi chiqadi, band katak rangli · Backend — `bo'shmi? ✓` va `parol ✓` qatorlari · Database — jadval belgisi. «Eslatma yuboradi» — «Keyin» qutisiga tushadi va kulrang qoladi.
  Noto'g'ri qism → tugma silkinib qaytadi, bir qator (≤60):
  - Kataklarni ko'rsatadi: Kataklar ekranda ko'rinadi — bu saytning ishi. (46)
  - Band katakni boshqa rangda chizadi: Rang ekranda o'zgaradi — bu saytning ishi. (42)
  - Katak bo'shligini tekshiradi: Bir katakni ikki kishi olmasin — buni Backend tekshiradi. (57)
  - Ega parolini tekshiradi: Parolni brauzerda tekshirish xavfli — bu Backend ishi. (54)
  - Bandni saqlaydi: Sahifa yopilsa ham band qolsin — bu Database ishi. (50)
  - Eslatma yuboradi (uch qismdan biriga): Eslatma «keyin» ro'yxatida — bugungi chizmaga kirmaydi. (55)
- Natija qatori: «Taxminingiz: … · haqiqatda: uchta» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa (6/6): Bu MVP da uch qism yetadi: sayt ko'rsatadi, Backend qoidani tekshiradi, Database bandlarni saqlaydi. (100)
- Tugadi (199): harakat paneli yopiladi, chizma butun enga chiqadi; vizual ⛶ ichida (q17).
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → 6 ishni joylang (N/6) → Davom etish

## 3 · 1-savol (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol · yorliq «To'g'ri javobni tanlang»
- Savol: **Ikki o'yinchi bir vaqtda 18:00 ni bosdi. Kim hal qiladi?** (10 so'z)
  - Sayt — birinchi bosgan telefonga beradi (39)
  - ✔ Backend — katak bo'shligini tekshiradi (38)
  - Database — ikkala bandni ham saqlaydi (37)
  - Ega — qo'ng'iroq qilib o'zi tanlaydi (36)
- Kalit: **B** (index 1). To'g'ri variant eng uzun emas; to'rttasi «qism — ish» shaklida (§204).
- To'g'ri izohi: Backend avval tekshiradi, Database esa bir xil kun va soatni ikki marta yozdirmaydi. (84) — audit 1: bir lahzadagi ikki so'rovga yakuniy himoya — jadvaldagi `kun + soat` noyobligi
- Xato izohlari (≤60):
  - A: Har telefon o'zini ko'radi — ikkinchisini qayerdan biladi? (58)
  - C: Ikkala band yozilsa, maydonga ikki jamoa keladi. (48)
  - D: Egasiga qo'ng'iroq — aynan biz hal qilayotgan muammo. (53)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 4 · Jadval `bandlar`  ← QTushuncha
- Eyebrow: Tushuncha · ma'lumot
- Sarlavha: **Bitta band uchun nimani yozib qo'yamiz?** (39)
- Mentor: Egasi har bandda kim va qachon kelishini bilishi kerak. Formaga va katakka qarab, kerakli ustunlarni bosing.
- Chap — sayt maketi (chizmadagi Sayt tugunining kattasi): Shanba · 18:00 tanlangan · forma: Ism «Ali» · Telefon «+998 90 000 00 01» · «Band qilish» (hozircha xira).
  Ostida 6 ustun-tugmasi: `kun` · `soat` · `ism` · `telefon` · `baho` · `tolov`
- O'ng — Database tugunidagi jadval kartasi `bandlar`: `id` va `yaratilgan` kulrang turibdi, yonida izoh «Database o'zi to'ldiradi»; to'rtta bo'sh ustun uzuq chiziqli (hisoblagich N/4).
- **Harakat → Vizual o'zgarish:** ustun-tugmasini bosish → to'g'ri bo'lsa ustun jadval sarlavhasiga kiradi va sayt maketida mos joy bir lahza yonadi
  (`kun` → «‹ Shanba ›» · `soat` → 18:00 katagi · `ism`, `telefon` → forma qatorlari). Noto'g'ri → tugma silkinadi, bir qator:
  - `baho`: Baho «qilmaymiz» ro'yxatida — jadvalga kirmaydi. (48)
  - `tolov`: To'lov «keyin» ro'yxatida — bugun ustun ochilmaydi. (51)
  4/4 da «Band qilish» yonadi → o'quvchi bosadi → jadvalga birinchi qator tushadi: `1 · 2026-10-10 · 18:00 · Ali · +998 90 000 00 01 · 2026-10-05 14:02`;
  sayt maketida 18:00 katagi band rangga o'tadi.
- Joriy qator (qator tushgach, bitta): Jadvaldagi har qator — bitta band.
- Xulosa: Ustunlar bugungi funksiyalardan chiqadi: kun, soat, ism, telefon. Baho va to'lov jadvalga kirmaydi. (99)
- Qator (`QIzoh`, xulosadan keyin; audit 1, 3): `kun` — sana, `telefon` — matn (+998 va bo'shliq son emas). Bir xil kun va soat jadvalda ikki marta turmaydi. (109)
- Tugadi: tugmalar paneli yopiladi, jadval va maket fokusga; vizual ⛶ ichida.
- Tugmalar: Orqaga · Ustunlarni tanlang (N/4) → Band qiling → Davom etish

## 5 · O'yinchining ikki yo'li  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Tajriba · o'yinchi yo'llari
- Sarlavha: **Bo'sh kataklar ham Database'da turadimi?** (40)
- Mentor: Sayt kataklarni har ochilganda Backend'dan so'raydi. Qadamlarni bajaring va jadvalga qarang.
- Bashorat (ballsiz): **Database'da qaysi kataklar saqlanadi?** · Hamma kataklar — bo'shi ham, bandi ham · Faqat band qilingan kataklar
- Chapda qadam-ro'yxati (163.8, o'tgani ✓): 1 Shanbani oching · 2 17:00 ni band qiling · 3 Yakshanbaga o'ting
- O'ngda chizma: Sayt (maket) ↔ Backend → Database (`bandlar`: 4-ekrandagi bitta qator, 18:00 · Ali).
- **Harakat → Vizual o'zgarish:** har qadamda o'quvchi maketda bosadi, keyin ikki yo'l-tugmasidan birini tanlaydi: `GET /vaqtlar?kun=` · `POST /bandlar` →
  1. Shanba + `GET /vaqtlar?kun=` → konvert `GET /vaqtlar?kun=2026-10-10` Sayt → Backend; Backend → Database: shu kunning qatori yonadi (18:00); javob qaytadi —
     olti katak, 18:00 band, qolgani bo'sh. Sayt–Backend orasida birinchi yo'l qatori yoziladi.
  2. 17:00 → forma (Bek · +998 90 000 00 02) → «Band qilish» + `POST /bandlar` → konvert (`kun`, `soat`, `ism`, `telefon`) → Backend'da `bo'shmi? ✓` →
     jadvalga ikkinchi qator → saytda 17:00 band. Ikkinchi yo'l qatori yoziladi.
  3. Yakshanba + `GET /vaqtlar?kun=` → konvert `?kun=2026-10-11`; jadvaldagi ikki qator kulrang qoladi (ikkalasi shanba) → olti katak, hammasi bo'sh.
  Noto'g'ri yo'l-tugmasi → silkinadi, bir qator: kun ochishda `POST` — «Kunni ochish hech narsa yozmaydi — bu o'qish.» (45) · band qilishda `GET` — «Band qilish yangi qator yozadi — bu yozish.» (43)
- Joriy qator (2-qadamdan keyin, bitta): Har yo'l (route) — method va manzil: GET o'qiydi, POST yozadi. (62)
- Natija qatori: «Taxminingiz: hamma kataklar · haqiqatda: faqat bandlar» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Jadvalda faqat bandlar turadi. Ish vaqti Backend kodida — bo'sh kataklarni u shundan hisoblaydi. (96)
- Tugadi: qadam-ro'yxati yopiladi, chizma (ikki yo'l qatori bilan) fokusga.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish

## 6 · 2-savol (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol · yorliq «To'g'ri javobni tanlang»
- Savol: **Juma kuni oltita katakdan bittasi bo'sh. Jadvalda juma uchun nechta qator?** (11 so'z; kalitdagi son savolda yo'q — S-019)
  - Oltita — har katak uchun bitta qator (36)
  - Bitta — faqat bo'sh katak uchun qator (37)
  - ✔ Beshta — har band uchun bitta qator (35)
  - Hech biri — kataklar saytning o'zida (36)
- Kalit: **C** (index 2). Ma'lumot 5-ekrandan farq qiladi (u yerda olti katakdan ikkitasi band) — slayddan ko'chirib bo'lmaydi (§106).
- To'g'ri izohi: Jadvalda faqat bandlar turadi: besh band — besh qator, bo'sh katak yozilmaydi. (78)
- Xato izohlari (≤60):
  - A: Bo'sh katakni yozish shart emas — Backend uni hisoblaydi. (57)
  - B: Bo'sh katakda ism ham, telefon ham yo'q — nimani yozasiz? (57)
  - D: Sayt kataklarni Backend'dan oladi — ma'lumot jadvalda. (54)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 7 · Ega kirishi  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Tushuncha · ega kirishi
- Sarlavha: **Bandlar ro'yxatini kim ochib ko'ra oladi?** (41)
- Mentor: Ro'yxatda o'yinchilarning telefoni bor — uni begona ko'rmasligi kerak. Ega sahifasida qadamlarni bajaring.
- Bashorat (ballsiz): **Tokensiz `GET /bandlar` nima qaytaradi?** · Bandlar ro'yxatini · Bo'sh ro'yxatni · 401 xatosini
- Chapda qadam-ro'yxati (o'tgani ✓): 1 Ro'yxatni oching · 2 Parol bilan kiring · 3 Ro'yxatni qayta oching
- O'ngda chizma: Maydon egasi → Sayt (ega sahifasi: «Bandlar» tugmasi · parol katagi · «Kirish») ↔ Backend (`.env` belgisi) → Database (`bandlar`, 2 qator).
- **Harakat → Vizual o'zgarish:**
  1. «Bandlar» → konvert `GET /bandlar` (tokensiz) → Backend tuguni qizil yonadi, javob `401` → saytda «Avval kiring». Chizmada uchinchi yo'l qatori — qulf belgisi bilan.
  2. Parol (namuna «••••••») → «Kirish» → konvert `POST /kirish` → Backend parolni `.env` dagi `EGA_PAROLI` bilan solishtiradi, `✓` → javob — token
     (sayt maketida kichik yorliq `token: eyJhbGci…`). To'rtinchi yo'l qatori yoziladi.
  3. «Bandlar» → `GET /bandlar` + token → Backend tokenni tekshiradi `✓` → Database'dan ikki qator → saytda ro'yxat:
     «Shanba 17:00 · Bek · +998 90 000 00 02» · «Shanba 18:00 · Ali · +998 90 000 00 01». Qulf ochiladi, yo'l qatori yashil.
- Joriy qator (2-qadamdan keyin): Ega kirishi — oldingi darslardagi login: parol to'g'ri bo'lsa, Backend token beradi. (84)
- Natija qatori: «Taxminingiz: … · haqiqatda: 401 xatosi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: O'yinchi yo'llari hammaga ochiq. `GET /bandlar` esa faqat ega tokeni bilan ochiladi. (82)
- Qator (`QIzoh`, xulosadan keyin; audit 4): Bu — bitta egali MVP uchun sodda kirish. Katta tizimda har kimning paroli alohida va yashirin saqlanadi. (100)
- Tugadi: qadamlar yopiladi, chizma to'rt yo'l qatori bilan fokusga.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish

## 8 · 3-savol (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol · yorliq «To'g'ri javobni tanlang»
- Savol: **Agent ega parolini kodga yozib qo'ydi. Qayerga ko'chirasiz?** (8 so'z)
  - ✔ Backend'ning `.env` fayliga (25)
  - Saytning `App.jsx` fayliga (24)
  - `bandlar` jadvalining ustuniga (28)
  - Repo'dagi README fayliga (24)
- Kalit: **A** (index 0). Fayl/jadval nomi to'rtala variantda bor — kalit so'z faqat to'g'rida emas.
- To'g'ri izohi: `.env` `.gitignore` da — repo'ga qo'shilmaydi, kodni o'qigan odam parolni ko'rmaydi. (84)
- Xato izohlari (≤60):
  - B: Sayt kodi brauzerga boradi — parolni har kim ko'radi. (53)
  - C: `bandlar` — o'yinchilar bandi uchun, parol uchun emas. (52)
  - D: README — repo'ni ochgan hamma o'qiydigan fayl. (46)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 9 · Stack tanlovi  ← QTushuncha (bashorat + bitta solishtirish; audit 5 — uch qatordan bittaga qisqardi)
- Eyebrow: Tushuncha · stack
- Sarlavha: **Yangi stack kerakmi?** (21)
- Mentor: Kodni agent yozadi, uni tekshirish esa sizning ishingiz. Ikki variantni bosib, qaysi kodni o'qiy olishingizga qarang.
- Bashorat (ballsiz): **MVP uchun qaysi texnologiyalarni tanlaysiz?** · Yangilarini — shu loyihada o'rganaman · Tanishlarini — tez qurib, sinayman
- Chap — bitta qator, ikki tugma: **Backend:** NestJS · Django (bitta funksiya — kataklar yo'li).
- O'ng — kod kartasi (3–4 qator, P-065) va ostida bir qator; tepada chizma tugunlari: «Sayt · React» va «Database · PostgreSQL (Neon)» oldindan yozilgan (tanish), «Backend · ?».
  - NestJS: `@Get('vaqtlar')` · `vaqtlar(@Query('kun') kun: string) {` · `  return this.bandlar.kataklar(kun)` · `}`
  - Django: `def vaqtlar(request):` · `    kun = request.GET['kun']` · `    return JsonResponse(kataklar(kun), safe=False)`
  Kod ostidagi qator: NestJS — «Bu kodni oldingi loyihalarda ko'rgansiz — o'qiy olasiz.» (55) · Django — «Bu shaklni hali loyihada ishlatmagansiz.» (40)
- **Harakat → Vizual o'zgarish:** tugma bosilsa kod kartasi o'sha texnologiya kodiga almashadi va ostidagi qator o'zgaradi; NestJS da Backend tuguniga nom yoziladi va tugun oq bo'ladi,
  Django da tugun kulrang «?» bilan qoladi. Ikkala tugma ko'rilgach ✓, tugunlar: **Sayt · React** · **Backend · NestJS** · **Database · PostgreSQL (Neon)**.
- Joriy qator (ko'rilgach): Birga ishlaydigan texnologiyalar to'plami — stack.
- Natija qatori: «Taxminingiz: yangilari · MVP uchun: tanishlari» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Maqsad — MVP ni tez qurib sinash. Stack tanish bo'lsa, agent kodini o'zingiz tekshirasiz. (88)
- Tugadi: tugmalar paneli yopiladi, chizma texnologiya nomlari bilan fokusga.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikki variantni ko'ring (N/2) → Davom etish
- Izoh (MD uchun): Vue va MongoDB solishtiruvi olindi (audit 5 — dars yuki). «Nega tanish?» savoli — 10-ekranda (4-savol). Django kursda loyihada ishlatilmagan (grep `src/` — 0) — qator rost.

## 10 · 4-savol (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol · yorliq «To'g'ri javobni tanlang»
- Savol: **Agent kodni yozadi. Nega baribir tanish stack tanlaysiz?** (9 so'z)
  - Yangi stack'da agent kodni yoza olmaydi (39)
  - Yangi stack internetga chiqa olmaydi (36)
  - Tanish stack'da Database kerak emas (35)
  - ✔ Tanish stack'da agent kodini o'qiysiz (37)
- Kalit: **D** (index 3). «Yangi» — 2 ta, «Tanish» — 2 ta (shakl-telli yo'q, §147); to'g'ri variant eng uzun emas.
- To'g'ri izohi: Kodni siz tekshirasiz: tanish shaklda xato qayerdaligini ko'rasiz. (66)
- Xato izohlari (≤60):
  - A: Agent ikkala stack'da ham yozdi — kodga qarang. (47)
  - B: Har qanday stack internetga chiqadi — gap unda emas. (52)
  - C: Bandlar baribir saqlanadi — Database har stack'da kerak. (56)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 11 · Deploy — qism qayerda turadi?  ← QTushuncha (bashorat + qadamlar)
- Eyebrow: Tajriba · deploy
- Sarlavha: **Do'stingiz «Maydon»ni telefonidan ocha oladimi?** (47)
- Mentor: Hozir sayt va Backend sizning kompyuteringizda ishlaydi. Qadamlarni bajaring va natijaga qarang.
- Bashorat (ballsiz): **Do'st telefonida `localhost:5173` nima ko'rsatadi?** · «Maydon» sahifasini · Hech narsa — sahifa ochilmaydi
- Chapda qadam-ro'yxati: 1 Do'st telefonida oching · 2 Saytni internetga chiqaring · 3 Backend'ni internetga chiqaring
- O'ngda chizma ikki zonada: **Kompyuteringizda** — Sayt (`localhost:5173`), Backend (`localhost:3000`) · **Internetda** — Database · PostgreSQL (Neon), ostida «Neon — boshidan internetda».
  Chetda do'st telefoni ramkasi (191).
- **Harakat → Vizual o'zgarish:**
  1. «Ochish» → do'st telefonida «Sahifa ochilmadi». Joriy qator: `localhost` — har qurilmaning o'zi. Do'st telefoni sizning kompyuteringizni ko'rmaydi. (84)
  2. Sayt tugunini bosish → u «Internetda» zonasiga suriladi, manzili `localhost:5173` o'rniga «internetdagi manzil» bo'ladi → do'st telefonida «Maydon» sahifasi ochiladi,
     kataklar o'rnida «Kataklar yuklanmadi». Joriy qator: Saytni internetga chiqarish — deploy. Sahifa ochildi, kataklar esa yuklanmadi. (78)
     (Sayt hali `localhost:3000` dan so'rayapti — konvert do'st telefonidan chiqib, qizil uziladi.)
  3. Backend tugunini bosish → u ham «Internetda»ga suriladi, sayt–Backend chizig'i internet zonasi ichida yashil → do'st telefonida olti katak chiqadi.
- Natija qatori: «Taxminingiz: … · haqiqatda: sahifa ochilmadi» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Do'stingiz to'liq ishlatishi uchun sayt ham, Backend ham internetdan ochiladigan manzilda ishlasin. (99)
- Tugadi: qadamlar yopiladi, chizma ikki zona bilan fokusga (xizmat nomlari yo'q — TAYANCHGA SAVOL 9).
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish

## 12 · Yakuniy · band tartibi (jonli ball)  ← QTartib
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Bitta band chizma bo'ylab qanday yuradi?** (40)
- Mentor: O'yinchi shanba kuni 18:00 ni band qiladi. Bo'laklarni to'g'ri tartibda joylang.
- Beshta uya — faqat raqam 1–5 va izoh «bu yerga qo'ying» (tartibni ochmaydi).
- Bo'laklar (bu yerda to'g'ri tartibda; ekranda aralash; sudrash yoki bosish):
  1. O'yinchi 18:00 katagini bosadi
  2. Sayt `POST /bandlar` yuboradi
  3. Backend katak bo'shligini tekshiradi
  4. Database yangi qator yozadi
  5. Sayt katakni band qilib ko'rsatadi
- Hamma uya to'lib tartib xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Yechilgach xulosa: Band shu tartibda o'tadi: o'yinchi → sayt → Backend → Database → ekran. (71)
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## A1 · Amaliyot 1 — Backend va Database  ← amaliyot bloki (QBlok, ≈20 daq)
- Eyebrow: Amaliyot 1 · Backend → Database
- Sarlavha: **«Maydon» Backend'ini oching va Database'ga ulang.** (49)
- Mentor: Chizmadagi ikki qism bugun `maydon` papkasida paydo bo'ladi — «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — GitHub'da `github.com/Azizbekcrypto/maydon` → «Fork» (o'z nusxangiz). Terminalda: `git clone https://github.com/{sizning login}/maydon.git` · `cd maydon`, papkani Antigravity'da oching. neon.tech da New project oching (nom: `maydon`) va «Connection string» ni nusxalang.
  2. **Prompt** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > `maydon` papkasida `backend/` yarat — `README.md` dagi stack bo'yicha, port 3000.
     > `backend/.env` dagi `DATABASE_URL` bilan PostgreSQL'ga ulan. `.env` ni `.gitignore` ga qo'sh.
     > `bandlar` jadvalini yarat: `id`, `kun` (sana), `soat`, `ism`, `telefon` (matn), `yaratilgan`. Bitta `kun` + `soat` juftligi ikki marta yozilmasin.
     > `GET /` «Maydon Backend ishlayapti» deb javob bersin. Boshqa yo'l yozma.
  3. **Ishga tushirish** — `backend/.env` ga qator yozing: `DATABASE_URL=` va Neon'dan nusxa (oxiridagi `?sslmode=require` qoladi). Terminalda `cd backend`, `npm run start:dev` — xato yo'q.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — brauzerda `localhost:3000`: «Maydon Backend ishlayapti». Neon'da jadvallar bo'limida `bandlar` jadvali paydo bo'ldi — 6 ustun, 0 qator.
  5. **O'z g'oyangiz** — qavs ichini o'z MVP ingiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying — uyda o'z papkangizda yuborasiz:
     > `{loyiha papkasi}` da `backend/` yarat: NestJS va TypeORM, port 3000.
     > `backend/.env` dagi `DATABASE_URL` bilan PostgreSQL'ga ulan. `.env` ni `.gitignore` ga qo'sh.
     > `{jadval nomi}` jadvalini yarat: `{ustunlar}`.
     > `GET /` «{loyiha nomi} Backend ishlayapti» deb javob bersin. Boshqa yo'l yozma.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (terminal + jadval kartasi):
  - `$ npm run start:dev`
  - `[Nest] LOG Nest application successfully started`
  - `localhost:3000` → Maydon Backend ishlayapti
  - Neon · `bandlar` — `id · kun · soat · ism · telefon · yaratilgan` · 0 qator
- Hammasi bajarilgach (yashil): Backend ishlayapti va Database'ga ulandi: `bandlar` jadvali tayyor. (65)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-04-done` (keyin `backend/.env` ga `DATABASE_URL`)
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## A2 · Amaliyot 2 — sayt va statik kataklar  ← amaliyot bloki (QBlok, ≈15 daq)
- Eyebrow: Amaliyot 2 · sayt
- Sarlavha: **Saytda shanba kunining vaqt kataklari ko'rinsin.** (48)
- Mentor: Kataklar hozircha namuna ma'lumotdan, Backend'ga 7-darsda ulanadi — «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — Backend terminali ishlab tursin. Ikkinchi terminalni `maydon` papkasida oching.
  2. **Prompt** — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > `maydon` papkasida `web/` yarat: React + Vite, port 5173.
     > `web/src/App.jsx`: sarlavha «Maydon», kun almashtirgichi «‹ Shanba ›» (strelkalar hozircha ishlamaydi) va olti vaqt katagi: 16:00 dan 21:00 gacha.
     > Kataklar namuna ma'lumotdan: 17:00 va 20:00 band, qolgani bo'sh. Band katak boshqa rangda, ustida «band» yozuvi.
     > Backend'ga hali so'rov yuborma. `backend/` papkasiga tegma.
  3. **Ishga tushirish** — terminalda `cd web`, `npm install`, `npm run dev` — xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — `localhost:5173`: «Maydon», «‹ Shanba ›», olti katak, 17:00 va 20:00 band rangda. Strelkalar hozircha hech narsani o'zgartirmaydi.
  5. **O'z g'oyangiz** — qavs ichini o'z MVP ingiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying:
     > `{loyiha papkasi}` da `web/` yarat: React + Vite, port 5173.
     > `web/src/App.jsx`: sarlavha «{loyiha nomi}», asosiy ekranda {nima ko'rinsin}.
     > Ma'lumot hozircha namuna: {namuna ma'lumot}. Backend'ga hali so'rov yuborma.
- O'ng tomon — «kutilgan natija · namuna: Maydon» (brauzer maketi `localhost:5173`, chizmadagi sayt maketining kattasi):
  - Maydon
  - ‹ **Shanba** ›
  - 16:00 · 17:00 band · 18:00 · 19:00 · 20:00 band · 21:00
- Hammasi bajarilgach (yashil): Skelet tayyor: sayt, Backend va Database ishga tushdi. (54)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-04-done`
- Nishon (bonus): Skeleton Ready — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 15 · Natijalar (podium) — jonli reyting
- Jonli reyting: 4 savol + yakuniy tartib + 2 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari: 3 — «1 — Kim hal qiladi» · 6 — «2 — Jadval qatorlari» · 8 — «3 — Parol joyi» · 10 — «4 — Tanish stack» · 12 — «Yakuniy — band tartibi».

## 16 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim · hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 17 · Yakun  ← QYakun
- Eyebrow: Tayyor · belgilar: ✓ Chizma va skelet tayyor · N/5 to'g'ri
- Sarlavha: **Chizma va loyiha skeleti tayyor.** (32)
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- ✓ Endi siz bilasiz (5):
  - Bu MVP da sayt ko'rsatadi, Backend qoidani tekshiradi, Database bandlarni saqlaydi.
  - Jadvalda faqat bandlar turadi; ish vaqti Backend kodida, bo'sh kataklarni u hisoblaydi.
  - Bandlar ro'yxati faqat ega tokeni bilan ochiladi.
  - Tanish stack'da agent yozgan kodni o'zingiz tekshirasiz.
  - Do'stingiz to'liq ishlatishi uchun sayt ham, Backend ham internetdan ochiladigan manzilda ishlashi kerak.
- Katta tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda so'zlar: chizma · stack · skelet · deploy)
- Bosilgach karta «Uyga vazifa» (muddat — keyingi darsgacha):
  - Chizma — o'z MVP ingiz chizmasini chizing: qismlar, jadval ustunlari va yo'llar.
  - Skelet — bloklarda yozgan ikki promptingizni o'z loyihangiz papkasida yuboring.
  - Tekshirish — `localhost:5173` va `localhost:3000` ochiladi, jadval Neon'da ko'rinadi.
  - Keyingi dars — «Animatsiya: interfeys javob beradi». Bugungi statik kataklar bosilganda javob beradigan bo'ladi.
- Nishonlaringiz — N/5
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Nishonlar (5)
- **Booking Guard** — Katakni Backend tekshirishini bildingiz (3-ekran, 1-savol — birinchi urinishda)
- **Lean Table** — Jadvalda faqat bandlar turishini bildingiz (6-ekran, 2-savol)
- **Secret Safe** — Parolni `.env` ga ko'chirishni bildingiz (8-ekran, 3-savol)
- **Known Stack** — Tanish stack nega to'g'ri ekanini bildingiz (10-ekran, 4-savol)
- **Skeleton Ready** — Ikki amaliyot blokini oxirigacha bajardingiz (A2 oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q (§184)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Nomlar boshqa darslarda yo'q (grep `src/`: Keeper/Stack/Table nomlari tekshirildi — Data Keeper, Token Keeper, Full Stack Explorer, Table Linker band).

## Qisqa takrorlash oynalari (5 — har ballik testga 3 karta)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Katakni Backend tekshiradi»
   - `POST /bandlar` · Ikki so'rov ham Backend'ga keladi — Har telefon o'zicha hal qila olmaydi.
   - `bo'shmi? → ha` · Birinchisi yoziladi — Katak band bo'ladi.
   - `kun + soat` noyob · Database ham himoya qiladi — Ikki so'rov bir lahzada kelsa ham ikkinchisi yozilmaydi.
   - Sinfga savol: Nega buni sayt hal qila olmaydi?
2. 2-savol (6-ekran) — «Jadvalda faqat bandlar»
   - `INSERT INTO bandlar …` · Band qilinganda — Jadvalga bitta qator qo'shiladi.
   - `SELECT soat FROM bandlar WHERE kun = …` · Backend o'qiydi — Shu kunning band soatlari.
   - `16:00 … 21:00` · Ish vaqti Backend kodida — Band bo'lmaganlari saytda bo'sh ko'rinadi.
   - Sinfga savol: Bo'sh katakni nega yozib qo'ymaymiz?
3. 3-savol (8-ekran) — «Parol `.env` da»
   - `EGA_PAROLI=…` · `.env` da turadi — Kodni o'qigan odam ko'rmaydi.
   - `.gitignore` → `.env` · Repo'ga qo'shilmaydi — Sirni kodga va README'ga yozmaymiz.
   - `process.env.EGA_PAROLI` · Backend shundan o'qiydi — Sayt kodida parol yo'q.
   - Sinfga savol: Sayt kodiga parol yozsak nima bo'ladi?
4. 4-savol (10-ekran) — «Tanish stack»
   - `@Get('vaqtlar')` · Tanish shakl — Kodni o'qib, tekshira olasiz.
   - `def vaqtlar(request):` · Yangi shakl — Avval o'rganishga to'g'ri keladi.
   - `agent → kod → siz` · Tekshiruv sizda — Tanish shaklda xatoni o'zingiz topasiz.
   - Sinfga savol: Agent xato qilsa, qaysi stack'da tezroq topasiz?
5. Yakuniy (12-ekran) — «Band tartibi»
   - `18:00` · O'yinchi bosadi — Sayt so'rov yuboradi.
   - `POST /bandlar` · Backend tekshiradi — Database qator yozadi.
   - `band` · Ekranda natija — Katak band rangda.
   - Sinfga savol: Backend tekshirmasa nima bo'ladi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Kod yozishdan oldin nima chiziladi? | Chizma (arxitektura) | Qismlar, jadval va yo'llar |
| Katak bo'shligini qaysi qism tekshiradi? | Backend; Database esa bir xil kun va soatni ikki marta yozdirmaydi | Masalan: 18:00 ni ikki kishi bosdi |
| Bandlar qayerda saqlanadi? | `bandlar` jadvalida | Database — PostgreSQL (Neon) |
| Bo'sh kataklar jadvalga yoziladimi? | Yo'q | Ish vaqti Backend kodida — bo'shini u bandlardan hisoblaydi |
| Kataklarni qaysi yo'l olib keladi? | `GET /vaqtlar?kun=` | GET — o'qish |
| Yangi bandni qaysi yo'l yozadi? | `POST /bandlar` | POST — yozish |
| Ega qaysi yo'l bilan kiradi? | `POST /kirish` | Parol to'g'ri bo'lsa — token |
| Tokensiz `GET /bandlar` nima qaytaradi? | 401 (ruxsat yo'q) | Ro'yxat faqat egaga ochiladi |
| Ega paroli qayerda turadi? | Backend'ning `.env` faylida | `.env` `.gitignore` da — repo'ga qo'shilmaydi |
| «Maydon» qaysi stack'da quriladi? | React · NestJS · PostgreSQL | Tanish stack — agent kodini o'qiysiz |
| Do'stlar ochishi uchun «Maydon» bilan nima qilinadi? | Deploy (internetga chiqarish) | Sayt ham, Backend ham internetga |
| Loyiha skeleti (shabloni) nima? | Qismlari ulangan boshlang'ich loyiha | Funksiyalar keyingi darslarda qo'shiladi |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni qurilgandan keyin o'zgarmaydi
1. «Maydon» MVP siga qaysi qismlar yetadi? ✔ Sayt, Backend va Database · Faqat sayt — hammasi brauzerda · Sayt, Backend, AI va Bot · Faqat Database va bitta jadval
2. Vaqt kataklarini ekranda qaysi qism chizadi? Backend — u kataklarni hisoblaydi · ✔ Sayt — u o'yinchiga ko'rsatadi · Database — u bandlarni saqlaydi · Agent — u kodni yozib bergan
3. Yangi band qilinganda `bandlar` jadvaliga nima qo'shiladi? Yangi ustun · Yangi jadval · ✔ Yangi qator · Yangi yo'l
4. `baho` ustuni nega jadvalda yo'q? Database bahoni saqlay olmaydi · Bahoni sayt o'zi hisoblab chiqadi · Jadvalda ustunlar soni cheklangan · ✔ Baho «qilmaymiz» ro'yxatida
5. Sayt kataklarni qaysi yo'ldan oladi? ✔ `GET /vaqtlar` · `POST /bandlar` · `POST /kirish` · `GET /bandlar`
6. Dushanba uchun jadvalda qator yo'q. Saytda nima ko'rinadi? Kataklar umuman chiqmaydi · ✔ Olti katak, hammasi bo'sh · Olti katak, hammasi band · Sayt xatoni ko'rsatib qo'yadi
7. Kimdir tokensiz bandlar ro'yxatini so'radi. Backend nima qiladi? Ro'yxatni to'liq qaytaradi · Bo'sh ro'yxat qaytaradi · ✔ 401 bilan rad etadi · Saytni yopib qo'yadi
8. Ega to'g'ri parol yozdi. `POST /kirish` nima qaytaradi? Bandlar ro'yxatini · Parolning o'zini · Kataklar ro'yxatini · ✔ Ega uchun tokenni
9. `.env` repo'ga qo'shilmasligi uchun nima qilinadi? ✔ U `.gitignore` ga yoziladi · Fayl nomi o'zgartiriladi · Fayl `web/` ga ko'chiriladi · Ichidagi qatorlar o'chiriladi
10. Stack nima? Bitta katta dastur fayli · ✔ Birga ishlaydigan texnologiyalar · Saytdagi tugmalar va sahifalar · Database'dagi jadvallar ro'yxati
11. Sayt internetda, Backend kompyuteringizda. Do'st nimani ko'radi? Hamma kataklarni ko'radi · Hech narsa — sahifa ochilmaydi · ✔ Sahifani, lekin kataklarsiz · Faqat band kataklarni
12. Kod yozishdan oldin chizma nega kerak? Kod o'zi ancha tezroq ishlay boshlaydi · Saytning dizayni ancha chiroyli chiqadi · Keyin deploy qilish umuman shart bo'lmaydi · ✔ Agentga qism va yo'llarni aniq aytasiz

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D (har harf 3 marta).
Fon so'zlari: React · NestJS · PostgreSQL · Neon · `bandlar` · `GET /vaqtlar` · `POST /bandlar` · `POST /kirish` · token · `.env` · `localhost:5173` · deploy · stack · chizma
Ekran testlari bilan takror yo'q (§144): 1-savol (kim hal qiladi) ↔ arena 2 (kim chizadi) · 2-savol (juma, nechta qator) ↔ arena 6 (dushanba, nima ko'rinadi) ·
3-savol (parol joyi) ↔ arena 9 (`.gitignore`) · 4-savol (nega tanish) ↔ arena 10 (stack nima).

---

## KOD — qurishda kerak bo'ladigan narsalar (qolipda yo'q)
1. **`MAYDON_NODES` + `MaydonChizma`** — bitta manba (180): 2 odam, 3 qism, 4 yo'l qatori (uzuq → ochilgan → qulf/qizil/yashil), «Keyin» qutisi, ikki zona («Kompyuteringizda» · «Internetda»),
   konvert + yo'l yorlig'i, `.env` belgisi. Ekranlar 0, 1, 2, 4, 5, 7, 9, 11 shundan o'qiydi; A1/A2 kutilgan natija — tugunlarning kattasi. Bosiladigan qismlar `// qolip-maket: …` bilan e'lon qilinadi.
2. **`SaytMock`** holatlari: kataklar (bo'sh · band · tanlangan), kun tugmalari, forma (Ism · Telefon · «Band qilish»), «Band qilindi», ega sahifasi («Bandlar», parol, «Kirish», ro'yxat, «Avval kiring»),
   «Kataklar yuklanmadi», «Sahifa ochilmadi». **`TelefonMock`** (191 ramka) — 0-ekranda ikkita, 11-ekranda do'st telefoni. **`JadvalMock`** `bandlar` — kulrang ustunlar, qator qo'shilishi, o'qilgan qator yonishi.
3. 0-ekran `QKirish`: agent chati (2 pufak) + ikki telefon; 18:00 bosilmaguncha variantlar xira; javobdan keyin uzuq bo'sh joy.
4. `QTushuncha` ekranlari (`zoom`, `tugadi` majburiy): 2 — saralash (6 tugma + «Keyin» zona, N/6) · 4 — ustun-tanlash (6 tugma, N/4) + «Band qilish» · 5 — `QQadamlar` + har qadamda 2 yo'l-tugmasi ·
   7 — `QQadamlar` (401 → token → ro'yxat) · 9 — 3 qator × 2 tugma + kod kartasi (6 namuna, `fmtCode`) · 11 — `QQadamlar` + zonaga surish.
   Bashorat (`QBashorat`/`QTaxmin`) — 2, 5, 7, 9, 11-ekranlarda, ballsiz, `onAnswer` ga kirmaydi.
5. Testlar `QTest` + `QuestionScreen`: 3 (**B**, index 1) · 6 (**C**, 2) · 8 (**A**, 0) · 10 (**D**, 3); yakuniy 12 — `QTartib` (5 bo'lak). `INLINE_KEYS` shu indekslar bilan.
6. **`ScreenBlok` ×2** (`NamunaDars.jsx`): **5 qadam** — 5-qadam «O'z g'oyangiz» (prompt `{…}` + «Nusxalash», qaror 8). `QBlok` 5 qadamni ko'taradimi — tekshiriladi (TAYANCHGA SAVOL 11).
   `ortda` ikkala blokda: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f dars-04-done`.
7. `RECAPS` 5 (kalit = 3, 6, 8, 10, 12) · `Q_LABELS` shu 5 · `ACHIEVEMENTS` 5, `ACH_TRIGGERS`: 3 → Booking Guard, 6 → Lean Table, 8 → Secret Safe, 10 → Known Stack, A2 oxirgi «Bajardim» → Skeleton Ready.
8. `QUIZ_BANK` 12 (✔ A·B·C·D ×3) · `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emojisiz.
9. `SCREEN_META` 18: hook · plan · concept · test · concept · concept · test · concept · test · concept · test · concept · final · practice · practice · stats · flashcards · summary.
10. `LESSON_META.lessonId` `mvp-architecture-07-04-v1` · App.jsx `m7-04` ga `comp: MvpArchitectureLesson` (asosiy seans, «qur» bosqichi).
11. Darvozalar: `npm run gates -- src/7-Modull/MvpArchitectureLesson.jsx` 12/12 · `lint:jsx` · `lint:olchov` · `lint:emoji` · surat 1280 + 393.

✎ Qurilishda kodda chetlashishlar (quruvchi, 05.10.2026; o'quvchi matni o'zgartirilmadi — takliflar hisobotda):
- ✎ 0-ekran javobi «Aynan! …» — `lint:olchov` 124 belgi sanaydi (chegara 120; MD dagi 117 «Aynan!»siz sanalgan). Matn aynan qoldi, darvoza olchov qizil.
- ✎ 2-ekran: 6 ish-tugmasi bir vaqtda emas — bittadan katta karta («1 / 6»), tugun bosiladi (SABOQ 9, 13). Mentor gapi aynan qoldi.
- ✎ 3, 6, 8, 10-ekranlar: «To'g'ri javobni tanlang» yorlig'i yozilmadi (SABOQ 6).
- ✎ `LESSON_META.lessonId` — `m7-04-v1` (topshiriq va 7-dars naqshi), KOD 10 dagi nom emas.
- ✎ 5-ekran ikkinchi qator (Bek) `yaratilgan` — `2026-10-05 14:05` (MD da yo'q edi). Konvert javob yorliqlari: «6 katak», «✓», «401», «token», «2 qator».
- ✎ Blok promptlarida backtick ko'rsatilmaydi (7-dars naqshi); A1 «Ortda qoldingizmi» uchinchi qatori — `keyin backend/.env ga DATABASE_URL`.

## REPO — `maydon` (yangi; «qur» bosqichida yoziladi, push — buyruq bilan)
1. **`dars-04-done`** (A1 + A2 namunasi):
   - `README.md` — «Maydon» nima, papkalar (`web/` sayt · `backend/` Backend), ikki terminal, `.env` eslatmasi, «Darslar va teglar» jadvali (4-dars qatori).
   - `.gitignore` — `.env`, `node_modules`, `dist`.
   - `backend/` — NestJS, port 3000; TypeORM + PostgreSQL (`DATABASE_URL`, `synchronize: true`); entity `Band` → jadval `bandlar`: `id` (serial) · `kun` (date) · `soat` (varchar, `18:00`) ·
     `ism` · `telefon` (varchar) · `yaratilgan` (default now); `@Unique(['kun', 'soat'])` (audit 1); ish vaqti — Backend konstantasi `KATAKLAR` (16:00 … 21:00, 7-darsda `GET /vaqtlar` o'qiydi);
     upstream `main` dagi `README.md` — «Stack: sayt — React (Vite) · Backend — NestJS + TypeORM · Database — PostgreSQL (Neon)» (A1 prompti shunga tayanadi, P-060); `GET /` → «Maydon Backend ishlayapti»; `backend/.env.example` — `DATABASE_URL=` izoh bilan («Neon → Connection string»).
   - `web/` — Vite + React, port 5173; `App.jsx`: «Maydon», kun almashtirgichi «‹ Shanba ›» (strelkalar 7-darsda ishlaydi), olti katak 16:00–21:00, namuna ma'lumotda 17:00 va 20:00 band; Backend'ga so'rov yo'q.
2. **Keyingi darslar uchun ochiq qoldi:** `GET /vaqtlar` (7-dars) · `POST /bandlar`, `POST /kirish`, `GET /bandlar`, `EGA_PAROLI`, `JWT_SECRET` (9-dars) · CORS (7-dars) — chizmada bor, kodda yo'q.
3. Boshlang'ich teg (`dars-04-start`) yo'q — A1 bo'sh papkadan boshlanadi; ortda qolgan o'quvchi `dars-04-done` ni oladi (TAYANCHGA SAVOL 7).

---

## TAYANCHGA SAVOL (tayanchda yo'q — o'zim qaror qildim)
1. **«chizma» — «sxema» emas.** Nega: 8-Modul 1-dars «Komponentlardan tizim» va 13-darsda «chizma» (arxitektura chizmasi); kursda «sxema» — Database jadvallari tuzilishi (m4-01 «JSON, jadval, sxema»).
   Topshiriqdagi «Maydon» sxemasi = darsda «Maydon» chizmasi. App.jsx `m7-04` osti yozuvi «… — sxema» → «… — chizma» bo'lishi kerakmi (P-015: reja ↔ App.jsx so'zma-so'z)? Qaror asosiy seansda.
2. **«stack» — «stek» emas.** Nega: kursda o'rgatilgan so'z — m2-10 «PERN Stack», ta'rif «Birga ishlaydigan texnologiyalar». Dastur matnidagi «stek» o'quvchiga yangi yozuv bo'lardi.
3. **Kataklar oralig'i — 16:00 dan 21:00 gacha, olti soatlik katak** (oxirgisi 21:00–22:00). Tayanchda soatlar yo'q; 5, 7, 10-darslar ham shu oraliqni ishlatishi kerak.
4. **`kun` — sana (`2026-10-10`), hafta kuni nomi emas.** Nega: «shanba» yozilsa band har shanbaga tegib qoladi (T-045 — yolg'on model). Saytda «Shanba» ko'rinadi, `?kun=2026-10-10` yuboriladi.
5. **Namuna qatorlar:** `Ali · +998 90 000 00 01 · 18:00`, `Bek · +998 90 000 00 02 · 17:00` — qahramon emas, jadvaldagi ma'lumot; telefon ataylab soxta (`000 00 0N`). Boshqa ism kerakmi?
6. **`.env` nomlari:** `EGA_PAROLI` (ega paroli) va `JWT_SECRET` (m4-11 dagi nom). 9-dars shu nomlar bilan qurishi kerak.
7. **Repo manzili `github.com/Azizbekcrypto/maydon`** — taxmin (TelegramBotNest egasi bo'yicha). Boshlang'ich teg yo'q: A1 bo'sh papka + `git init`; «Ortda qoldingizmi» ikkala blokda `dars-04-done`.
8. **`GET /vaqtlar` 4-darsda yozilmaydi** — tayanch jadvalida u `dars-07-done` da. 4-dars Backend'ida faqat `GET /` (holat matni) va `bandlar` jadvali; yo'llar faqat chizmada. 7-dars MD si bilan kelishish kerak.
9. **Deploy joylari** (sayt va Backend qaysi xizmatga — masalan Vercel, Render) tayanchda yo'q; bu darsda nomsiz «Internetda» zonasi. 9-dars MD si nomlaydi.
10. **Eyebrow «Dars · kirish»** (platforma standarti, 6-Modulda 6 dars) va «ega kirishi» / `POST /kirish` — bitta darsda «kirish» ikki ma'noda (T-015). Eyebrowni «Dars · boshlanish» qilaymi?
11. **Blokda 5 qadam** (4 + «O'z g'oyangiz», qaror 8) — P-059 dagi 4 qadamdan bittaga ko'p; 6, 7, 8, 9, 11-darslar bloklari ham shunday bo'ladimi, `QBlok` 5 qadamni sig'diradimi.
12. **«prompt», «talab» emas.** Tayanch «talab»ni o'quvchi agentga yozadigan matn deydi; blok qolipi va qaror 8 «prompt» deydi. Bu darsda faqat «prompt» — 7-dars «talab»ni boshlasa, ikkalasi bitta tushuncha bo'lib qoladi.

## Shubhali joylar (ishonchim komil emas)
- 0-ekran: ~~«Agent bandni o'yinchining telefonida saqladi»~~ — audit bilan «Bu misolda …» qilindi (T-043). Mentor buni «bitta gapda berdik» bilan bog'laydi.
- 3-ekran to'g'ri izohi «ikkinchisida katak allaqachon band» — bir vaqtdagi ikki so'rovning soddalashtirilgan modeli (aslida Database cheklovi ham kerak); 13 yoshga yolg'on emas, lekin to'liq ham emas.
- (audit 5 bilan qisqardi — faqat NestJS/Django) 9-ekran kod namunalari — o'quvchi o'qimaydi, faqat «tanish emas»ligini ko'radi; kod to'g'ri, lekin ekran kodga boy (P-052 — bitta vizual: kod kartasi + chizma tugunlari).
- 11-ekran «Saytni internetga chiqaring» — darsda simulyatsiya; haqiqiy deploy 9-darsda. Xulosa buni aytadi.
- A1 1-qadam ikki ish (papka + Neon) — bitta qadamga og'ir; ajratilsa 6 qadam bo'ladi.

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m7-03` «Besh suhbatdan qaysi muammo chiqdi?» → **`m7-04` «Mini-MVP arxitekturasi»** → `m7-05` «Animatsiya: interfeys javob beradi».
  Osti yozuvi «— sxema» bilan chizma so'zi farqi — TAYANCHGA SAVOL 1.
- [x] Bitta misol-ip («Maydon», tayanch 1-bo'lim) · metafora yo'q · bitta vizual dars bo'yi — «Maydon» chizmasi `MAYDON_NODES` (0, 1, 2, 4, 5, 7, 9, 11; bloklarda uning maketlari).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2 (saralash), 4 (ustun), 5 (yo'l tanlash), 7 (401 → token), 9 (kod solishtirish), 11 (zonaga surish); 0-ekran ham harakatli.
- [x] Sarlavhalar ≤55 bitta qator (25–50) · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosalar ≤110 (54–100) · hook javobi ≤120 (118/101) · xato izohlari ≤60 (42–58).
  Belgilar soni Python `len()` bilan sanaldi (skript scratchpad'da).
- [x] Atamalar oldingi darslar bilan: qism · tizim · arxitektura · chizma (m6-01) · route = method + path (m4-05) · login · token · 401 · `.env` (m4-11) · stack (m2-10) · deploy — internetga chiqarish (§196) ·
  Neon «Connection string», `?sslmode=require` (5-Modul 4-dars) · skelet (shablon) (§213) · siz-forma; Antigravity promptlari — T-002 istisnosi · tugma ot-shaklda.
- [x] Testlar: variantlar uzunligi yaqin (3: 36–39 · 6: 35–37 · 8: 24–28 · 10: 35–39), to'g'ri variant eng uzun emas; kalit so'z/strelka/qavs faqat to'g'rida emas · ✔: 3 — B, 6 — C, 8 — A, 10 — D ·
  arena A·B·C·D ×3 · inkor-savol yo'q (arena 4 «nega yo'q?» — sabab-savol, rad etishga majburlamaydi).
- [x] Final (12-ekran): uyalarda faqat raqam va «bu yerga qo'ying», Mentor tartibni aytmaydi.
- [x] Emoji yo'q (nishon medali, arena — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov» — grep 0).
- [x] Ichki kodlar o'quvchi matnida yo'q (T6, P1, «Modul 9», m4-11 — faqat MD izohlarida) · real kompaniya raqami yo'q · tarixiy voqea yo'q · «KOD» (11) va «REPO» (3) ro'yxati to'liq.
- [x] Karta T · P · S — ko'rildi: T-002/011/014/015/029/039/047/052/064 · P-001/010/013/015/036/046/052/059/062/064/065/067 · S-001/004/006/008/010/015/019/026.
  ✗ P-059 (blok 4 qadam) — qaror 8 bilan 5 qadam (TAYANCHGA SAVOL 11) · ✗ T-015 «kirish» ikki ma'noda (TAYANCHGA SAVOL 10) · P-028 neon.tech yozuvlari 5-Moduldagidek, «jadvallar bo'limida» (aniq menyu nomisiz, 08-q1 kabi).
