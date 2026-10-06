# 12-Modul · 10-dars (PM) «50 foydalanuvchiga yetdingizmi?» — MD v3

Fayl: `src/10-Modull/PmUsersCheckLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m10-10` · **16 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta) · «Maydon Jamoa» o'z rangida — hisobot varag'i tepasida va telefon maketida; Neon — chizilgan oyna, logotipsiz ·
ekranga kirganda bo'sh, ma'nosiz element yo'q · ekranda ≤ 3 blok · maket chapda, karta o'ngda · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **C** (`correctIdx 2`) · 5-ekran — **A** (`0`) · 7-ekran — **D** (`3`) · 12-ekran — **B** (`1`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 406–408, o'qib tekshirildi 06.10; DE-205): `m10-09` «Loyiha kuni: foydalanuvchini qaytaradigan eslatma» → **`m10-10` «50 foydalanuvchiga yetdingizmi?»** (osti: «Mentor tekshiruvi: metrika hisoboti va zaxira reja») → `m10-11` «Raqamlaringiz pitchni qanday o'zgartiradi?».
Tur (PM-005): **2-tur sof PM** — artefakt yozma (metrika hisoboti, tekshiruv natijasi, zaxira reja), mustaqil ish majburiy (10, 11-ekranlar). Keys — **K5 Duolingo** (tayanch 5, faqat bank matni).
Kod mexanikasi (tayanch 4, 1.10): **Neon SQL Editor** — ro'yxatdan o'tganlarni kunlar bo'yicha sanash (9-ekran, `QKod` Neon varianti; 10-Modul 1-dars naqshi). Agent bilan blok yo'q; repo'ga darsda yozilmaydi (uyga vazifa — zaxira rejadagi ish).
Vaqt: ≈ 90 daqiqa — kirish va reja (0–1) ≈ 5 · tushuncha, keys va testlar (2–8) ≈ 30 · SQL (9) ≈ 12 · hisobot (10) ≈ 12 · tekshiruv va zaxira reja (11) ≈ 16 · yakuniy savol, podium, kartochkalar, arena (12–15) ≈ 15.
  Ulgurmagan o'quvchi yo'li: 9-ekranda SQL qolsa — 1-qatorga sanoq sahifasidagi son yoziladi (manba — sanoq sahifasi), kunlar — uyga vazifa ③ · 10-ekranda qator sanalmasa — «Hali sanalmagan» (halol qator), uyda sanaladi ·
  11-ekranda tuzatish — «Uyda tuzataman», zaxira reja yozilmasa — uyda · yakun sarlavhasi holatga qarab (15-ekran, besh holat).
  ⛔ Taqsimot — reja: «qur» pilotida 9 → 10 → 11-ekranlar taymer bilan (10-FILTR 10); 7–9-darslardan `namuna`, sanoq sahifasi yoki qaytganlar soni yetishmasa — «Hali sanalmagan» yo'li.
10-FILTR (F-1006-364, 06.10.2026) dan keyingi holat: uchinchi savol — «Oldingi son bormi?» · «eng kam bo'g'in» yo'q — bitta bo'g'in dalil bilan tanlanadi · `qaytgan` da ikki son va davr saqlanadi · manba — haqiqiy yo'lga qarab · 8-darsdagi tuzatishdan keyingi sonlar 8-ekranda.
Manba: `00-MODUL-TAYANCH.md` (1.0 · **1.10 — hisobot, tekshiruv, zaxira reja aynan** · 1.13 — sonlar jadvali · 1.7, 1.8, 1.9 — o'tilgan sanoqlar · 2 — atamalar · 3 — teg 10 · 4 — tuzilish · 5 — K5 · 6 — Neon · 7 — sinflar · 8 — `pm-m10d10-hisobot` · **9.5, 9.6, 9.23 — sanoq SQL lari va sinfdoshlar**) ·
`GATE_M_JAVOB.md` (Qaror-0 2, 13, 15, 16, 22) · `00-TAQIQLAR.md` · `00-NOMLAR.md` · 11-Modul tayanchi (1.4 Mentor tekshiruvi, 9.66 muhr) · 11-Modul `05-PmPrd-v3.md` (tekshiruv ekranlari shakli) · 10-Modul `01-PmOkr-v3.md` (Neon ekrani shakli).
⚠️ Modul raqami o'quvchi matnida — LMS raqami: «11-Modul» (PRD va Mentor tekshiruvi), «10-Modul» (gipoteza shakli), «7-Modul» (Duolingo, qaytganlar foizi). Kod raqami faqat fayl yo'lida. Modul ichidagi darslar — «6-darsdagi», «ishga tushirish kuni», «o'tgan darsdagi».

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (tayanch 4: «metrika hisoboti; Mentor tekshiruvi; yetmagan bo'lsa — zaxira reja»):** o'quvchi o'z Database'idan ro'yxatdan o'tganlarni kunlar bo'yicha SQL bilan sanaydi (9),
   to'rt qatorli metrika hisobotini manba va sana bilan yozadi (10), uni sherik bilan uch savolda tekshiradi va 50 ga yetmagan bo'lsa — zaxira reja yozadi (11). Saqlanadi: `pm-m10d10-hisobot` (11, 12-darslar o'qiydi).
   Natija besh holatda bo'lishi mumkin (15-ekran sarlavhasi shunga qarab): hammasi bajarildi · tuzatish qoldi · zaxira reja qoldi · tekshiruv qoldi · hisobot boshlandi. Belgi ✓ va nishon — faqat birinchi holatda (sinf 1).
   **50 ga yetmaslik — baho emas** (Qaror-0 15, TAQIQLAR 1): Mentor misoli ham yetmaydi (38). Yakun sarlavhasi sonni emas, o'quvchi qilgan ishni aytadi; o'quvchi o'z sonini sinfga aytishga majbur emas.
2. **Bugungi asosiy fikr (P-013):** Hisobotdagi son manbasi va sanasi bilan tekshiriladi; maqsadga yetmasa — bitta bo'g'in tanlanib, unga bitta ish yoziladi. (Yakunda ScoreRing ostida; kartochkalarda so'zma-so'z yo'q.)
3. **Yangi atamalar — misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042; tayanch 2):**
   - **metrika hisoboti** — «Bizda to'rt son, har birining manbasi va sanasi bilan — metrika hisoboti deyiladi.» (2-ekran, to'rt qator to'lgandan so'ng; tayanch 2 ta'rifi + «Bizda» — sinf 2a, kurs qolipi). Sarlavhada 2-ekrandan keyin.
     To'rt qator (1.10): ro'yxatdan o'tgan (shundan sinfdosh) · asosiy harakatni qilgan · bosh raqam · qaytganlar foizi. Pastda — qadamlar sanog'i (va lending sonlari).
   - **Mentor tekshiruvi** — 11-Modulda o'tilgan (PRD ni uch savol bilan ko'rish; javob qabul yoki tuzatish). Bugun — sonlar uchun uchta yangi savol (1.10, 9.42 a): «Son qayerdan?» · «Kimlar sanalgan?» · «Oldingi son bormi?» (10-FILTR 2: tekshiruv o'sishni emas, solishtirsa bo'lishini ko'radi; o'sish yo'qligi — zaxira reja sababi).
     Ko'prik bir gap (T-052; 4-ekran `QIzoh`): «11-Modulda PRD ni shunday tekshirgansiz — bugungi uch savol sonlar uchun. Javob — qabul yoki tuzatish.» Yakka rejimda muhr — «Tuzatish topilmadi» (11-Modul 9.66).
   - **zaxira reja** — «Maqsadga yetilmaganda yoziladigan bu uch qator — zaxira reja deyiladi.» (8-ekran, uch qator to'lgandan so'ng); kurs qolipi — «Bizda zaxira reja uch qator: qaysi bo'g'inda odam kam, bitta gipoteza va bir haftada bajariladigan bitta ish.» (8-ekran xulosasi, kartochka 11, yakun).
     **«Eng kam bo'g'in» deyilmaydi (10-FILTR 1):** bo'g'inlarning birligi har xil — sonlari bir-biri bilan solishtirilmaydi; bo'g'in o'z ichidagi son yoki fakt bilan tanlanadi (Mentor: «post faqat ikki joyga yetdi»), 11-ekranda dalil qatori majburiy.
   - **bo'g'in** — tayanch 1.10 so'zi (zaxira reja ta'rifida); atama jadvalida yo'q — 8-ekranda bo'g'in kartalari ustidagi kulrang izoh: «Bu darsda bo'g'in — odam postdan asosiy harakatgacha o'tadigan yo'lning alohida joyi.» (tayanch 9.42 b; 10-FILTR 9). To'rtta: **kanal · lending · o'rnatish va ro'yxat · asosiy harakat**.
4. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - **ro'yxatdan o'tgan · asosiy harakatni qilgan** (7-dars; ikki sanoq yonma-yon). Asosiy harakat — o'quvchi matnida: «hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan» (9.23; navbatda turgani — qo'shilgan emas). 50 maqsadi — ro'yxatdan o'tganlar soni.
   - **namuna va tekshiruv akkauntlari** (7-dars; `namuna = true`) — sanalmaydi · **sinfdoshlar** — sanaladi, lekin alohida aytiladi; Database ajratmaydi — o'quvchi bilsa, o'zi yozadi (ixtiyoriy; 9.6, 9.39 e).
   - **qadamlar** (ochdi → ro'yxatdan o'tdi → qo'shildi → kelishini tasdiqladi; har qadamda turli qurilmalar) va **sanoq sahifasi** (8-dars, `lending/sanoq.html`, maxfiy kalit bilan yopiq) · **qurilma ID** (7-dars).
   - **qaytganlar foizi** (7-Modul so'zi; ta'rif so'zma-so'z: «bir davrda ilovani ochganlardan keyingi davrda ham ochganlari foizi») · **bosh raqam** (11-Modul; Mentor misolida — haftada to'lgan o'yinlar) · **gipoteza** (10-Modul 4-darsi shakli: «Agar …, …, chunki …»).
   - **Database** · **SQL** (`SELECT`, `WHERE`, `COUNT(*)` — SQL darslaridan; `GROUP BY` va `date()` — 9-ekran Yordamida bir qatordan) · **Neon SQL Editor**, tugma «Run» (11-Modul, tayanch 6) · **Umami** (9-Modul; lending sonlari) · **kanal**, **post** (6-dars) · **foiz**.
   - **«hodisa»** — bu darsda (tayanch 2: 7, 8, 10) faqat analitika ma'nosida; o'quvchi matnida deyarli ishlatilmaydi (jadval nomi `hodisalar` — mono). `eslatmadan-ochdi` — **«sanoq yozuvi»** (tayanch 2, TAQIQLAR 7).
   - **tekshirish** (o'z ishi; Mentor tekshiruvi ham) va **sinov** (faqat real odam bilan) — bu darsda «sinov» yo'q.
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«hisobot»** — faqat metrika hisoboti (bir sahifa). **«varaq»** — o'sha sahifaning vizual nomi (`HisobotVaraq`, o'quvchiga «hisobot» deyiladi). **«qator»** — hisobotning to'rt qatoridan biri; SQL natijasidagi qatorlar — «Neon ko'rsatgan qatorlar».
   - **«manba»** — son qayerdan olingani (Database · sanoq sahifasi · Umami; 1.11 ro'yxati bilan bir). **«sana»** — son qachon sanalgani. **«birlik»** — nima sanalgani: hisob · qurilma (web-trekda — brauzer) · tashrif · bosish · o'yin.
   - **«qadam»** — faqat foydalanuvchi yo'li (tayanch 2); rejaning bo'lagi — «bosqich» (7-dars, faqat «rejaning 3-bosqichi» iborasida); zaxira rejadagi — **«ish»**. **«bo'g'in»** — zaxira rejadagi to'rt joy. «qadam» va «bo'g'in» aralashmaydi: «O'rnatish va ro'yxat» bo'g'ini qadamlardagi «ochdi → ro'yxatdan o'tdi» sonlariga qaraydi.
   - **«qabul» / «tuzatish» / «Tuzatish topilmadi»** — faqat Mentor tekshiruvi javobi; «tasdiq», «tasdiqlash» — faqat «kelishini tasdiqladi» qadami (11-Modul 9.41).
   - **«e'lon»** — faqat o'yin e'loni. **«post»** — kanalga yoziladigan matn. **«eslatma»** — telefonga chiqadigan xabar (Duolingo kadrida va «o'tgan darsdagi qoida» qatorida). «push» — yo'q.
   - **Ishlatilmaydi:** antikrizis reja · B reja · otchyot · dashboard (bu ma'noda) · retention (prozada; kartochkada ham yo'q — 9-darsda bir marta) · user · faol foydalanuvchi · voronka · drop-off · chekpoint · ulush · konversiya · «Modul 12» · K5 · A1.
6. **Mentor misoli — «Maydon Jamoa» metrika hisoboti (`MENTOR_HISOBOT`, tayanch 1.10 va 1.13 aynan; «ishga tushirilganidan bir hafta keyin»):**

| Qator | Son | Birlik | Manba | Sana | Kulrang izoh (varaqda) | Oldin (4-ekran dalili; 1.13) |
|---|---|---|---|---|---|---|
| 1 · Ro'yxatdan o'tgan | 38 / 50 | hisob | Database | 7 kun keyin | 11 tasi — sinfdosh · namuna va tekshiruv akkauntlarisiz | 27 — 3 kun keyin |
| 2 · Asosiy harakatni qilgan | 19 | hisob | Database | 7 kun keyin | hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan | 13 — 3 kun keyin |
| 3 · Bosh raqam | 1 | o'yin | Database | 7 kun keyin | birinchi haftada to'lgan o'yinlar | birinchi o'lchov |
| 4 · Qaytganlar foizi | 37% | qurilma | Database | 5 kun keyin | birinchi 3 kunda ochgan 46 qurilmadan 17 tasi keyingi 2 kunda ham ochdi | birinchi o'lchov |
| Pastda · Qadamlar | ochdi 61 · ro'yxatdan o'tdi 38 · qo'shildi 18 · kelishini tasdiqladi 14 — va alohida: eslatmadan ochdi 9 | qurilma | sanoq sahifasi | 7 kun keyin | «eslatmadan ochdi» — qadam emas: eslatma bosilib ilova ochilgan qurilmalar | — |
| Pastda · Lending | tashriflar 74 · «Qo'shilmoqchiman» 41 | tashrif · bosish | Umami | 7 kun keyin | ilova sonlaridan ayirilmaydi | — |

   - 4-qator (1.9, 9-dars sanog'i): 1.10 Mentor hisobotida qaytganlar foizi soni yo'q — 1.9 dagi «46 qurilmadan 17 tasi» olindi, foiz (17 / 46 ≈ 37%) va sana «5 kun keyin» — tayanch 9.41 a, 9.42 (17 — o'sha 46 qurilmaning ichidan). «Oldin» ustuni — 1.13 ning 8-dars qatori; birinchi marta sanalgan qatorda — «birinchi o'lchov» (tayanch 9.42 a).
   - «eslatmadan ochdi 9» — ilovaning istalgan eslatmasi bosilib ochilgani (tayanch 9.41 d); «eslatma shuncha odamni qaytardi» deyilmaydi. Mentor 9-darsdagi tekshiruv yozuvlarini o'chirgan (09-FILTR 6) — 9 ichida tekshiruv qurilmasi yo'q.
   - Sanalar nisbiy («7 kun keyin» — ishga tushirilganidan); kalendar sanasi tayanchda yo'q (tayanch 9.42 d). O'quvchining o'z hisobotida — haqiqiy sana.
   - **Mentor tekshiruvi (1.10):** uch savoldan o'tadi → **qabul**. 38 / 50 — tuzatish sababi emas: «tekshiruv sonning halolligini ko'radi, kattaligini emas» (4-ekran xulosasi).
   - **Mentor zaxira rejasi (`MENTOR_ZAXIRA`, 1.10 aynan):** tanlangan bo'g'in — kanal: «post faqat ikki joyga yetdi (60 kishilik guruh va sinf chati)» ·
     gipoteza: «Agar har o'yin e'loni bilan birga havola yuborilsa, yangi odamlar keladi, chunki tashkilotchi o'z jamoasini o'zi chaqiradi» · ish: ilovada e'lon berilgach «Havolani ulashish» tugmasi (rejaning 3-bosqichi oldinga suriladi).
   - **Bo'g'inlar kartasidagi Mentor sonlari (8-ekran; faqat 1.10 va 1.13 dan, birligi bilan):** Kanal — post 2 joyga yetdi: 60 kishilik guruh va sinf chati · Lending — tashrif 74 · «Qo'shilmoqchiman» 41 (Umami) ·
     O'rnatish va ro'yxat — ochdi 61 · ro'yxatdan o'tdi 38 (qurilma, sanoq sahifasi); ostida ikkinchi qator (tayanch 1.8, 9.40 e — 8-dars auditidan beri shu darsga qarz edi): «8-darsdagi tuzatishdan keyin birinchi marta ochgan qurilmalar — 15, ulardan ro'yxatdan o'tgani — 11 (73%; oldin 59%)»,
     kulrang: «15 ta qurilma — kam: farq bor, lekin bu isbot emas.» (Database: birinchi `ochdi` yozuvi tuzatish chiqqan vaqtdan keyin bo'lgan qurilmalar; arifmetika: 61 − 46 = 15, 38 − 27 = 11) ·
     Asosiy harakat — ro'yxatdan o'tgan 38 · asosiy harakatni qilgan 19 (hisob, Database). Bo'g'inlar orasida foiz chiqarilmaydi va sonlar solishtirilmaydi (birligi har xil); foiz faqat bitta bo'g'in ichida, bir xil birlikda.
   - **Kunlar bo'yicha SQL (9-ekran, tayanch 9.5 aynan):** `SELECT date(yaratilgan) AS kun, COUNT(*) FROM oyinchilar WHERE namuna = false GROUP BY kun ORDER BY kun;`
     Mentor misolining kun-ma-kun qatorlari tayanchda yo'q — maketda faqat «bir haftada jami — 38» (tayanch 9.42 d — kun-ma-kun son to'qilmaydi). Jami tekshiruvi: `SELECT COUNT(*) FROM oyinchilar WHERE namuna = false;` (9.23).
   - **Asosiy harakat SQL (10-ekran Yordami, tayanch 9.23 aynan):** `SELECT COUNT(*) FROM oyinchilar o WHERE o.namuna = false AND (EXISTS (SELECT 1 FROM ishtirokchilar i WHERE i.oyinchi_id = o.id AND i.holat IN ('qoshildi', 'keladi')) OR EXISTS (SELECT 1 FROM oyinlar g WHERE g.tashkilotchi_id = o.id));`
   - **Uyga vazifa ishi (tayanch 3, 4):** Mentor misolida — teg `m12-dars-10-done`: e'lon berilgach «Havolani ulashish» tugmasi. Ulashiladigan narsa — lending manzili, oxirida `?kanal=ilova` (6-darsdagi kanal belgisi — natija Umami'da kanal bo'yicha ko'rinadi; tayanch 9.42 e);
     qanday ulashilishi (telefonning ulashish oynasi yoki nusxalash) — «qur» da Mentor repo'sida, rasmiy hujjat bilan; MD buni va'da qilmaydi (10-FILTR 14).
7. **Raqamlar (faqat tayanchdan, «Mentor misolida»):** 1.10 hisoboti (38 / 50, 11, 19, 1, qadamlar 61 · 38 · 18 · 14, `eslatmadan-ochdi` 9, Umami 74 · 41) · 1.13 (20 · 27 · 38; 8 · 13 · 19; mahalla futbol guruhi 60 kishi; sinf 12, sinfdosh 11) ·
   1.9 (46 dan 17) · 50 — dastur maqsadi. 37% — tayanch 9.41 a; 15 · 11 · 73% — tayanch 1.8. Testdagi «31 / 50», «90 tashrif · 6 bosish» — ikkinchi misol, savol ichida (P-002), Mentor soni emas. K5 — raqamsiz (sahnada ham son yo'q).
8. **Keys — K5 Duolingo (tayanch 5, bank matni aynan):** «Asosiy qaytarish mexanikasi — ketma-ket kunlar: seriyani yo'qotib qo'yish qo'rquvi odamlarni har kuni qaytaradi; atrofida — eslatmalar va «muzlatish». Raqamsiz.»
   Brend izohi (S-018): «Duolingo — til o'rganish ilovasi» (7-Modul: «olov belgili raqam ketma-ket dars qilingan kunlarni sanaydi» — 6-ekranda «olov belgisi … sanaydi» shaklida, raqamsiz).
   Ko'prik (umumiy joy, tenglik emas; tayanch 5): qaytgan-qaytmaganini son ko'rsatadi — hisobotning 4-qatori. **Bosim usuli tavsiya qilinmaydi** — 9-darsdagi foydali eslatma qoidasi (6-ekran 3/3 kulrang qatori, O'qituvchi eslatmasi).
   Bankdan tashqari fakt (eslatma matni, «muzlatish» qanday ishlashi, son, yil) yo'q. 7-Modul `PmLesson21` da K5 boshqa savol bilan bo'lgan («raqam nimani sanaydi») — O'qituvchi eslatmasida.
9. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** boshqa bir hisobot (5-ekran: «31 / 50, uch savolga ham «ha»») · arena 12 (lending: 90 tashrif, 6 bosish). Ikkalasi — bitta gapda, qahramonsiz, kimningdir hisoboti deb aytilmaydi.
10. **Toza yuza (185, D-qoidalar):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › — belgilar; olov va qor parchasi — chizilgan belgi (emoji emas). O'yin qatlami (arena, nishon medali, podium) — mustasno.
    Kafolat so'zlari yo'q («har doim», «darhol», «100%»); sonlar haqida — «odatda», «bo'lishi mumkin», «bu misolda».
11. **Xavfsizlik va halollik (sinf 14, TAQIQLAR 1–2):** SQL faqat son qaytaradi — `SELECT *` yo'q (jadvalda ism va login bor; 9-ekran Yordami) · hisobotda faqat sonlar (arena 7) · hisobotda ism, login, guruh nomi yo'q · `DELETE` yo'q ·
    soxta akkaunt, o'zi qayta ro'yxatdan o'tish, sovg'a va'dasi — yo'q (11-ekran kulrang qatori, 12-ekran testi) · zaxira ishi post bo'lsa — 6-darsdagi olti bandli ro'yxat (`XAVFSIZLIK`, so'zma-so'z; 11-ekran, uyga vazifa ②) ·
    sonlar sinfga e'lon qilinmaydi (0, 10, 11-ekran O'qituvchi eslatmalari; Mentor ekranida — holat).
12. **Trek (tayanch 4):** `pm-m9d8-platforma.trek` — 9-ekran (web-trek qatori), 10-ekran (qadamlar birligi «brauzer»), 11-ekran («O'rnatish va ro'yxat» bo'g'inining web-trek izohi), 15-ekran ①. Kalit yo'q bo'lsa — ikkala qator ko'rinadi.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.0):** 11-Modul 15-darsidagi risk «50 foydalanuvchi kerak, hozir 3 sinovchi» shu modulda yopiladi (6, 7, 10-darslar). 7-darsda ilova odamlarga chiqdi (20), 8-darsda qadamlar sanaldi (27), 9-darsda qaytaradigan eslatma qurildi.
  Bugun — bir hafta o'tib: sonlar bir sahifaga yig'iladi, Mentor tekshiruvidan o'tadi; 50 ga yetmagan bo'lsa — zaxira reja. 11-dars shu hisobotdan pitchga dalil oladi.
- **Dars ipi:** 0 — «Nechta foydalanuvchi?»ga uch javob: qaysi biriga ishonasiz → 2 — Mentor hisoboti qatorma-qator: son + manba + sana (atama «metrika hisoboti») → 3 — test: qurilma va hisob — har xil o'lchov →
  4 — Mentor hisobotiga uch savol, dalilni varaqdan topish; 38 / 50 — qabul → 5 — test: halol, lekin 31 / 50 → 6 — Duolingo: odamni nima qaytaradi; qaytdimi — buni son ko'rsatadi → 7 — test: qaysi qator →
  8 — Mentorning bo'g'inlari: qayerda kam → gipoteza → bir haftalik ish (atama «zaxira reja») → 9 — o'z Database'ingizdan kunlar bo'yicha SQL → 10 — o'z hisobotingiz → 11 — sherik bilan uch savol; yetmagan bo'lsa — zaxira reja →
  12 — yakuniy test: 50 ga yetmaganda nima qilasiz → podium → kartochkalar → yakun; uyda — zaxira rejadagi ish.
- **Bitta vizual — `HisobotVaraq` (metrika hisoboti varag'i; dars bo'yi, 163/180; bitta manba `MENTOR_HISOBOT` + o'quvchi ma'lumoti `pm-m10d10-hisobot`):**
  - Oq varaq (A4 nisbatiga yaqin, bitta ustun): tepada kichik nom (o'z rangida) va «metrika hisoboti» yorlig'i · to'rt qator (chapda qator nomi, o'rtada katta son va kichik birlik yorlig'i, o'ngda ikki yorliq — manba va sana; son ostida bitta kulrang izoh qatori; 1, 2-qatorlarda «oldin: …») ·
    pastda ikki ingichka qator — «Qadamlar · sanoq sahifasi» va «Lending · Umami» · varaq tepasida muhr joyi (yumaloq, ichida «Qabul» / «Tuzatish topilmadi» / «Tuzatish: …»).
  - **Holatlar (bitta komponentdan):** **qoralama** (0, 2-ekran boshida: faqat yalang'och sonlar, manba va sana joyi uzuq chiziq — U-041) → **to'lib boradi** (2-ekran: yorliq uchib keladi, ~1 s yashil) → **to'liq** (3, 6-ekran 3/3) →
    **tekshiruv** (4, 11-ekran: joriy savolga tegishli joy accent halqada, topilgani yashil; oxirida muhr bir lahza kattalashib tushadi) → **ixcham** («Hisobot · n / 4», artefakt-strip — 9–11, 15-ekran) → **o'quvchi varag'i** (10, 11-ekran; nom — `pm-m9d4-final.goya`, yo'q bo'lsa kulrang «mahsulot nomi»).
  - Qator holatlari: yalang'och son → joriy (accent chegara) → to'liq (son + yorliqlar, ~1 s yashil) → sanalmagan (kulrang «sanalmagan», yorliq joyi kulrang) → tuzatish (accent nuqta) → xato (`err` fon, bir lahza).
  - Varaq yonida kontekstga qarab bitta maket (SABOQ 21 — maket chapda, karta o'ngda): 2-ekranda — uch manba maketi · 8-ekranda — bo'g'in kartalari · 9-ekranda — Neon oynasi · 0, 8-ekranlarda — `JamoaTelefon` (≈170×272, 11-Modul ko'rinishi).
  - `prefers-reduced-motion` da harakat to'xtaydi, yakuniy holat birdan qo'yiladi. Vizual ⛶ ichida (q17).
- **Brend o'z maketida (PM-028/029, S-018, SABOQ 2–3):** «Maydon Jamoa» — varaq tepasida va telefon maketida, o'z rangida; «Duolingo» — telefon maketida o'z rangida (6-ekran); Neon — chizilgan SQL Editor oynasi, nom kulrang yorliqda. Logotip chizilmaydi (Duolingo boyqushi ham).
- **Keyingi bosiladigan joy (SABOQ 11, qat'iy):** har bosqichda bitta faol element — accent halqa doim, yengil to'lqin 2–3 marta; tanlov guruhida har variantda yumshoq halqa; yoqilgan pastki tugma ham halqada. `prefers-reduced-motion` da to'lqin o'chadi, halqa qoladi.
- **Bashorat (SABOQ 11, 25):** tanlangach karta yo'qolmaydi — savol va «Taxminingiz: …» ixcham qator bo'lib natijagacha turadi; natija chiqqach taxmin qatori xulosaning birinchi qatori bo'ladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → yorliq manba maketidan varaqqa uchadi, son sanab o'sadi · topilgan dalil yashil yonadi va savol kartasiga ingichka chiziq tortiladi · muhr «tushadi» · bo'g'in kartasi ochilib sonlar sanab chiqadi.
  Bezak-harakat (to'xtovsiz miltillash, aylanayotgan nuqtalar) yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **50 foydalanuvchiga yetdingizmi?** (31) — dars nomi (DE-205)
- Mentor: Mentor misolida ilova odamlarga chiqqaniga bir hafta bo'ldi: «Nechta foydalanuvchi bor?» deb so'rashsa, qaysi javobga ishonasiz?
- Maket (chap): telefon `JamoaTelefon` — «Maydon Jamoa» (o'z rangida), «O'yinlar» ekrani, namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10»; telefon tepasida kulrang chat pufagi «Nechta foydalanuvchi bor?».
- Variantlar (radio, o'ng; uch javob — Mentor misolidagi mumkin gaplar, olam ichidagi matn — T-008; bir uzunlikda):
  - «Ko'p — har kuni yangi odam qo'shilyapti» (41)
  - «38 kishi — bugun Database'dan sanadim» (39)
  - «Deyarli 50 — chatda hamma yozyapti» (36)
- Javob — «38 kishi…»: **Aynan!** Bu javobda son bor — u qayerdan olingani va qachon sanalgani ham aytilgan. (81)
- Javob — «Ko'p…»: **Qiziq fikr!** Har kuni odam kelishi — yaxshi belgi. Lekin «ko'p» — nechta ekani bilinmaydi. (89)
- Javob — «Deyarli 50…»: **Qiziq fikr!** Chatda yozganlar ilovada ro'yxatdan o'tganmi — bu javobdan bilinmaydi. (82)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan javob chat pufagi bo'lib savol ostiga tushadi, qolgan ikkitasi ixcham kulrang qatorga yig'iladi; telefon yonida kichik varaq-skelet chiqadi: katta «38» va ostida uchta bo'sh kulrang qator (yorliqsiz — 2-ekran kashfiyoti, P-036).
  Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni). Uchala javob ekrandagi dalilni ko'rsatadi (T-067): son, manba va sana faqat bitta javobda bor.
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (navbatma-navbat to'lqin); tanlovdan so'ng «Davom etish».
- O'qituvchi eslatmasi: Sinfdan so'rang: o'z ilovangizda hozir nechta odam borligini qayerdan bilasiz? Javobni muhokama qilmang — 2-ekran varaqni to'ldiradi. O'quvchilar o'z sonini sinfga aytishi shart emas: bugun son baho emas.
  9-darsda o'rnatish fayli navbatda qolgan o'quvchilar (yakunda «O'rnatish fayli navbatda» yorlig'i) dars boshida lendingdagi havolani almashtiradi — bir necha daqiqa; 9-dars loyiha kuni, uyga vazifa bo'lmagan (tayanch 9.41 h). Sinf ularni kutmaydi: bu ish 0–1-mashqlar paytida bajariladi, kirish savoli ballsiz.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun sonlaringizni hisobotga yig'ib, tekshirasiz.** (50)
- Mentor: Ishga tushirish kunidan beri Database'da sonlar yig'ildi. Bugun ularni bitta sahifaga yozib, Mentor tekshiruvidan o'tkazasiz.
- Chap — «Dars oxirida: metrika hisoboti va zaxira reja» + kulrang yorliq `Mentor tekshiruvi` (App.jsx osti «Mentor tekshiruvi: metrika hisoboti va zaxira reja» — so'zlari aynan, P-015) + vizual: varaq-skelet —
  to'rt kulrang qator 0.4 s oraliqda yoziladi (matnsiz), har qator yonida ikki kichik kulrang yorliq; pastda ingichka qator; oxirida varaq tepasida bo'sh yumaloq muhr joyi.
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Hisobotga sonni qanday yozishni bilib olasiz · `hisobot`
  - 02 · Sonlarni uch savol bilan tekshirasiz · `tekshiruv`
  - 03 · Duolingo odamlarni nima bilan qaytarishini ko'rasiz · `voqea`
  - 04 · O'z sonlaringizni Database'dan olib, reja yozasiz · `SQL`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada yangi atama yo'q (T-011) — «metrika hisoboti», «zaxira reja» faqat chap qatorda (App.jsx osti so'zma-so'z) va kulrang yorliqda; ta'riflar 2 va 8-ekranda (P-014).
  01 «manba va sana»ni aytmaydi — 2-ekran bashorati shu (P-015). «sonlaringizni» — 7-darsdan beri o'quvchi Database'ida sonlar bor (kamida sinfdoshlar; T-039). 04 «reja» — zaxira reja (atama 8-ekranda).

## 2 · Metrika hisoboti  ← QTushuncha (markaziy; ketma-ket, 4 qator)
- Eyebrow: Tushuncha · hisobot
- Sarlavha: **Songa ishonish uchun yonida nima turadi?** (40) — 0-ekran savoliga («qaysi javobga ishonasiz») javob beradigan ekran (T-064)
- Mentor: Mentor hisobotidagi qatorlarni tepadan pastga birma-bir bosing.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — bitta o'lchov: yonidagi ma'lumot, kam → ko'p): **Mentor «38» ni hisobotga qanday yozadi?** ·
  Faqat sonning o'zi (18) · Son va manbasi (14) · Son, manbasi va sanasi (22) — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; qatorlar shundan keyin yoqiladi.
- Qadam qatori (`QQadamlar`, ixcham): 1 Ro'yxatdan o'tgan · 2 Asosiy harakat · 3 Bosh raqam · 4 Qaytganlar foizi
- Vizual (SABOQ 21 — maket chapda, karta o'ngda):
  - **chapda — uch manba maketi** (chizilgan, logotipsiz, bir xil kenglikda, ustma-ust): «Neon · Database» (kichik jadval belgisi) · «sanoq sahifasi» (brauzer oynasi `lending/sanoq.html`, kulrang «kalit bilan») · «Umami» (hisoblagich ko'rinishi).
  - **o'ngda — `HisobotVaraq` qoralama:** tepada «Maydon Jamoa» (o'z rangida) · «metrika hisoboti» yorlig'i hali yo'q; to'rt qator — nomi va yalang'och son (38 · 19 · 1 · 37%), manba va sana joyi — uzuq chiziq. Pastki qatorlar hali yo'q.
- **Harakat → Vizual o'zgarish:** joriy qator (halqada) bosiladi → tegishli manba maketi yonadi, undan manba yorlig'i varaqqa uchib keladi, sana yorlig'i yoziladi, son ostida kulrang izoh paydo bo'ladi (A-6 jadvali aynan):
  1. «Ro'yxatdan o'tgan · 38» → «Neon · Database» yonadi; son «38 / 50» bo'ladi, birlik «hisob»; yorliqlar «Database» · «7 kun keyin»; kulrang: «11 tasi — sinfdosh · namuna va tekshiruv akkauntlarisiz»; ostida «oldin: 27 — 3 kun keyin».
  2. «Asosiy harakatni qilgan · 19» → «Database» · «7 kun keyin», birlik «hisob»; kulrang: «hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan»; «oldin: 13 — 3 kun keyin».
  3. «Bosh raqam · 1» → «Database» · «7 kun keyin», birlik «o'yin»; kulrang: «birinchi haftada to'lgan o'yinlar»; ostida «birinchi o'lchov».
  4. «Qaytganlar foizi · 37%» → «Database» · «5 kun keyin», birlik «qurilma»; kulrang: «birinchi 3 kunda ochgan 46 qurilmadan 17 tasi keyingi 2 kunda ham ochdi»; ostida «birinchi o'lchov».
  4/4 dan so'ng (o'zi, navbat bilan): «sanoq sahifasi» yonadi → varaq pastiga qator sirg'alib kiradi: «Qadamlar · sanoq sahifasi · 7 kun keyin — ochdi 61 · ro'yxatdan o'tdi 38 · qo'shildi 18 · kelishini tasdiqladi 14», birlik «qurilma»; shu qator oxirida ajratilgan kichik yozuv: «eslatmadan ochdi 9 — qadam emas: eslatma bosilib ilova ochilgan qurilmalar»;
  so'ng «Umami» yonadi → «Lending · Umami · 7 kun keyin — tashriflar 74 · «Qo'shilmoqchiman» 41», birlik «tashrif · bosish», kulrang «ilova sonlaridan ayirilmaydi».
  Varaq tepasida yorliq **metrika hisoboti** paydo bo'ladi (atama — misoldan keyin), `QIzoh`: Bizda to'rt son, har birining manbasi va sanasi bilan — metrika hisoboti deyiladi. (82)
  Natija qatori (`QTaxmin`, xulosaning birinchi qatori): «Taxminingiz: … · haqiqatda: son, manbasi va sanasi» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu misolda har son yonida manba va sana bor: kim ko'rsa, qayerdan olinganini tekshira oladi. (92)
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Varaqdagi yoqilgan qatorni bosing — chap tomonda nima yonishini ko'ring.
- Tugma (pastki): Qatorlarni bosing (N/4) → Davom etish · `tugadi`: qadam qatori va manba maketlari yo'qoladi, varaq butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy qator (to'lqin 2–3 marta) → «Davom etish».
- O'qituvchi eslatmasi: «Database» — `oyinchilar` jadvali, SQL bilan sanaladi (9-ekranda o'zlari qiladi). 4-qator boshqa kunda sanalgan — har sonning o'z sanasi bor, ular bir kunda bo'lishi shart emas.
  «Qo'shildi 18» (qurilma) va «asosiy harakatni qilgan 19» (hisob; e'lon berganlar ham kiradi) — har xil o'lchov: bir-biridan ayirilmaydi va teng bo'lishi shart emas (3-ekran testi). 50 maqsadi — ro'yxatdan o'tganlar soni.

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`; har xil o'lchov — tayanch 1.13 oxiri)
- Eyebrow: Tekshiruv · o'lchov
- Savol: **Mentor hisobotida: qadam «qo'shildi» — 18, asosiy harakatni qilgan — 19. Qaysi gap to'g'ri?** (12 so'z) · savol ustida yorliq yo'q (SABOQ 6)
  - A — Bittasi xato: hisob va qadam teng chiqishi kerak (48)
  - B — 19 dan 18 ni ayirsak, bitta odam ortiqcha chiqadi (49)
  - ✔ C — Ikkalasi boshqa narsani sanaydi: qurilma va hisob (49)
  - D — 18 to'g'riroq: qurilmalar sanog'i aniqroq bo'ladi (49)
- To'g'ri izohi: Qadamlar qurilmani, asosiy harakat esa hisobni sanaydi. (55)
- Xato izohlari: A — Teng chiqishi mumkin, lekin shartmi? Birligiga qarang. (54) · B — Ayirish uchun ikkalasi bir narsani sanaydimi? (45) ·
  D — Ikkala son ham Database'dan — qaysi biri nimani sanaydi? (56) · (umumiy) Har son yonidagi birlik yorlig'iga qarang. (42)
- Javob topilgach (QuestionScreen `vizual`, jonli darsda — natija ochilgandan keyin; SABOQ 4): savol ostida kichik varaq bo'lagi — «qo'shildi 18» yonida «qurilma», «asosiy harakatni qilgan 19» yonida «hisob» yorlig'i ajraladi.
- Izoh (MD): A — teng bo'lishi kerak degan yanglish (tayanch 1.13: «bir-biridan ayirilmaydi»), B — ayirish, D — biri «aniqroq» degan da'vo; har biri dars qoidasi bo'yicha noto'g'ri (S-004).
  Ikki nuqta A, C, D da, B da vergul — belgi faqat to'g'rida emas (S-003); «qurilma» C va D da, «hisob» A va C da (kalit so'z faqat to'g'rida emas). Kalitda savoldagi son yo'q (S-019).
  Ikkinchi o'qish: «asosiy harakat» qadamlar sanog'iga kirmaydi — «qadam» bu yerda «qo'shildi» qadami (T-015 bo'yicha bitta ma'no: foydalanuvchi yo'li).

## 4 · Mentor tekshiruvi  ← QTushuncha (ketma-ket, 3 savol; dalilni varaqdan bosib topish)
- Eyebrow: Tushuncha · Mentor tekshiruvi
- Sarlavha: **Hisobotni qaysi savollar bilan tekshirasiz?** (43)
- Mentor: Har savolning javobini Mentor hisobotidan bosib toping.
  (Birinchi harakat — bashorat; yo'rig'i `QBashorat` yorlig'ida.)
- Bashorat (ballsiz; S-015 — bitta o'lchov: hisobot qanchalik o'tadi, kam → ko'p): **38 / 50 — Mentor tekshiruvi javobi qanday bo'ladi?** ·
  Tuzatish: 50 ga yetmagan (24) · Bitta tuzatishdan keyin qabul (29) · Qabul (5) — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi.
- Qadam qatori (`QQadamlar`, bitta manba `TEKSHIRUV_SAVOLLAR` — 11-ekran ham shundan): 1 Son qayerdan? · 2 Kimlar sanalgan? · 3 Oldingi son bormi?
- **Chapda — `HisobotVaraq` to'liq** (2-ekrandan) · **o'ngda — bitta savol kartasi** (navbat bilan): savol · «Nimaga qarang» bir qatori · ostida kulrang «Varaqdan bosib toping». Tugma yo'q — javob varaqdagi bosish.
  1. **Son qayerdan?** — Nimaga qarang: har son yonida manba va sana bormi? → dalil: istalgan qatorning manba yoki sana yorlig'i; bosilgach to'rttala qatorning yorliqlari navbat bilan yashil yonadi.
  2. **Kimlar sanalgan?** — Nimaga qarang: namuna va tekshiruv akkauntlari chiqarilganmi, sinfdoshlar alohida aytilganmi? → dalil: 1-qator ostidagi «11 tasi — sinfdosh · namuna va tekshiruv akkauntlarisiz»; ikki bo'lagi ham yashil yonadi.
  3. **Oldingi son bormi?** — Nimaga qarang: son yonida oldingi son va sanasi turibdimi — solishtirsa bo'ladimi? → dalil: «oldin: 27 — 3 kun keyin» (yoki 2-qatordagi «oldin: 13»); bosilgach ikkala «oldin» qatori yashil, yonida kichik ✓;
     3 va 4-qatordagi «birinchi o'lchov» yozuvi ham yashil yonadi (oldingi son yo'qligi ochiq aytilgan).
- `QXato` (≤60; noto'g'ri joy bosilsa, joy bir lahza silkinadi): 1 — Bu sonning o'zi — u qayerdan olingani qayerda yozilgan? (55) · 2 — «/ 50» bosilsa: Bu maqsad — u kimlar sanalganini aytmaydi. (42) ·
  3 — Oldingi son qayerda? Kulrang qatorlarga qarang. (47) · (umumiy) Nimaga qarang qatorini qayta o'qing. (36)
- **Harakat → Vizual o'zgarish:** dalil bosiladi → u yashil yonadi, savol kartasiga ingichka chiziq tortiladi, karta ostida ✓ «Ha», qadam belgisi ✓, keyingi savol kartasi kiradi.
  3/3 dan so'ng varaq tepasiga yashil muhr **«Qabul»** bir lahza kattalashib tushadi, ostida kulrang qator: Qabul — bugungi tekshiruv natijasi: sonlar keyin yangilanadi.
  Varaq ostida yorliq **Mentor tekshiruvi** paydo bo'ladi, `QIzoh`: 11-Modulda PRD ni shunday tekshirgansiz — bugungi uch savol sonlar uchun. Javob — qabul yoki tuzatish. (102)
  Natija qatori (`QTaxmin`): «Taxminingiz: … · haqiqatda: qabul» yoki «Taxminingiz to'g'ri chiqdi».
- Xulosa: Bu misolda 38 / 50 — qabul: tekshiruv sonning halolligini ko'radi, kattaligini emas. (84)
- Ipucha (40 s): O'ngdagi savolni o'qing va javobini chapdagi varaqdan bosing.
- Natija (`tugadi`): savol kartasi va qadam qatori yo'qoladi; varaq butun enga, tepada «Qabul».
- Tugma (pastki): Savollarni bering (N/3) → Davom etish · vizual ⛶ ichida.
- Keyingi bosiladigan joy: bashorat variantlari → varaqdagi dalil joylari (joriy savolga tegishlisi yumshoq halqada, to'lqin 2–3 marta) → «Davom etish».
- Nishon: Evidence Finder! (uch dalilni birinchi urinishda).
- O'qituvchi eslatmasi: «Oldingi son bormi?» — hisobot oldingi o'lchov bilan solishtirsa bo'ladigan qilib yozilganmi. Son o'sdimi-yo'qmi — tekshiruv savoli emas: o'smagan, lekin halol yozilgan hisobot ham — qabul.
  O'sish yo'qligi — zaxira reja uchun sabab (dastur: «o'sish bo'lmasa — reja»). Birinchi marta sanalgan sonda oldingisi bo'lmaydi — «birinchi o'lchov» deb yoziladi: bu ham «ha».
  Tuzatish — yomon belgi emas: son qayta sanaladi yoki manbasi yoziladi. «Tasdiq» so'zi bu darsda faqat «kelishini tasdiqladi» qadamida — tekshiruv javobi «qabul».

## 5 · 2-savol  ← QTest (✔ A, `correctIdx 0`; ikkinchi misol — boshqa hisobot, P-002)
- Eyebrow: Tekshiruv · Mentor tekshiruvi
- Savol: **Bir hisobotda 31 / 50, uch savolga ham «ha». Mentor tekshiruvi nima deydi?** (12 so'z) · savol ustida yorliq yo'q
  - ✔ A — Qabul, chunki son halol sanalgan (32)
  - B — Tuzatish, chunki 50 ga yetmagan (31)
  - C — Qabul, chunki 50 ga yaqin qolgan (32)
  - D — Tuzatish, chunki son juda kichik (32)
- To'g'ri izohi: Uch savolga «ha» — son halol: 50 ga yetmagani tuzatish emas. (60)
- Xato izohlari: B — Tekshiruv sonning kattaligiga qaraydimi? (40) · C — «Yaqinlik» uch savolning biri edimi? (36) · D — Kichik son ham halol bo'lishi mumkin — savollarni eslang. (57) ·
  (umumiy) Uch savol nimaga qaraydi — shuni eslang. (40)
- Javob topilgach (kichik, savol ostida): kichik varaq «31 / 50», tepasida yashil muhr «Qabul».
- Izoh (MD): «Qabul» ikki, «Tuzatish» ikki variantda (S-006); «chunki» to'rttalasida; «50» B va C da (kalit so'z faqat to'g'rida emas); C — sabab noto'g'ri (yaqinlik mezon emas), D — 50 sababining boshqa so'zi (S-004).
  31 — savoldagi son kalitda yo'q (S-019). Ikkala trekka to'g'ri (sinf 12).

## 6 · Duolingo  ← QVoqea (PM keys K5; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **Duolingo odamlarni qanday qaytaradi?** (36)
- Nuqtalar (3) · yorliq **Duolingo · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 sahna ustidagi bitta qator, S-018): **Duolingo** (o'z rangida) — til o'rganish ilovasi. Logotip yo'q.
- Mentor — bosqich gapini aytadi, har kadrda almashadi (≤2 gap; SABOQ 8). Sahnada faqat kadr nomi va jonli maket; takror matn yo'q.
- Sahna (`DuolingoSahna`, chizilgan CSS/SVG telefon maketi; bankda yo'q narsa chizilmaydi — son, eslatma matni, «muzlatish» qanday ishlashi yo'q):
  - 1/3 **Ketma-ket kunlar** — Mentor: 7-Modulda ko'rgansiz: olov belgisi ketma-ket dars qilingan kunlarni sanaydi. Bu voqeada asosiy qaytarish mexanikasi — shu ketma-ket kunlar.
    · sahna: telefon, tepada «Duolingo» (o'z rangida); ekranda chizilgan olov belgisi (raqamsiz) va hafta kataklari «Du · Se · Ch · Pa · Ju · Sh · Ya» — kataklar navbat bilan belgilanadi, oxirgisi bo'sh, yumshoq halqada.
    · bashorat (sahna ostida, bitta qator; S-015 — bitta o'lchov: qanchalik tez-tez, kam → ko'p): **Ketma-ket kunlar odamni qanchalik tez-tez qaytaradi?** · Haftada bir marta (17) · Ikki kunda bir marta (20) · ✔ Har kuni (8)
      — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; sahna javobni ochmaydi (P-053 `pre` kadr).
  - 2/3 **Seriya, eslatma, «muzlatish»** — Mentor: Seriyani yo'qotib qo'yish qo'rquvi odamlarni har kuni qaytaradi. Uning atrofida — eslatmalar va «muzlatish».
    · sahna: telefon qulf ekrani — eslatma kartochkasi: «Duolingo» nomi va ikki kulrang matnsiz qator (matn bankda yo'q); eslatma bosiladi → ilova ochiladi, oxirgi katak belgilanadi; kataklar qatori yonida chizilgan qor parchasi belgisi va kichik yozuv «muzlatish».
  - 3/3 **Son ko'rsatadi** — Mentor: Qaytarish mexanikasi bor — lekin odam qaytdimi-yo'qmi, buni son ko'rsatadi: qaytganlar foizi.
    · sahna: telefon kichrayib chapga suriladi; o'ngda «Maydon Jamoa» hisobotining 4-qatori (2-ekrandan) — «Qaytganlar foizi · 37% · Database · 5 kun keyin» accent halqada; ostida kulrang qator: Sizning eslatmangiz — o'tgan darsdagi qoida bilan: foyda aytadi, qo'rqitmaydi.
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: har kuni» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Voqea davomi» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, kadr nomi va sahna almashadi (yangi element bir lahza ajralib kiradi).
- Xulosa (3/3 dan so'ng, pastda, yashil): Bu voqeada odamlarni seriyani yo'qotish qo'rquvi qaytaradi. Qaytgan-qaytmaganini esa son ko'rsatadi. (100)
- Tugma (pastki): Voqea davomi (N/3) → Davom etish
- O'qituvchi eslatmasi: Duolingo 7-Modulning qaytganlar foizi darsida bo'lgan («raqam nimani sanaydi?») — eslating; bugungi savol boshqa: odam qaytdimi — buni qaysi son ko'rsatadi. Ko'prik — umumiy joy: mahsulotingiz Duolingo emas.
  Xavotir — Duolingo'ning usuli; o'quvchi mahsulotida bosim, qo'rqitish va uyaltirish yo'q (9-darsdagi foydali eslatma qoidasi: o'z ishiga tegishli, rost, bosimsiz; hafta ikkitaga to'lsa, ilova o'zidan qo'shmaydi; «Eslatmalar» o'chirgichi — tayanch 9.41 b).
  Bankda raqam yo'q — sahnaga son qo'ymang; «muzlatish» qanday ishlashini bank aytmaydi — so'ralsa, «bu voqeada aytilmagan» deng.
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K5 (193-qator, ruscha asl: «стрик (серия дней без пропуска)… страх потерять серию возвращает людей каждый день; вокруг стрика — напоминания и «заморозки»», «Без цифр») · tayanch 5 (o'zbekcha matn va brend izohi) · `src/5-Modull/PmLesson21.jsx` (7-Modul shakli).

## 7 · 3-savol  ← QTest (✔ D, `correctIdx 3`; keys ko'prigi — o'quvchining o'z hisoboti, ikkala trek)
- Eyebrow: Tekshiruv · qaytganlar foizi
- Savol: **Ilovangizga odamlar qaytyaptimi — hisobotning qaysi qatori ko'rsatadi?** (7 so'z) · savol ustida yorliq yo'q
  - A — Ro'yxatdan o'tganlar, sinfdoshlar bilan (39)
  - B — Asosiy harakatni qilganlar va sanasi (36)
  - C — Lendingda tugmani bosganlarning foizi (37)
  - ✔ D — Keyingi davrda ham ochganlarning foizi (38)
- To'g'ri izohi: Bu qator ikki davrni solishtiradi: kim keyin ham ochdi. (55)
- Xato izohlari: A — Ro'yxatdan o'tgan odam keyin yana ochdimi — bu son aytadimi? (60) · B — Bu son hozirgi holatni aytadi — ikki davrni solishtiradimi? (59) ·
  C — Bu lendingga kelganlar — ilovani yana ochganini aytadimi? (57) · (umumiy) Qaysi qator ikki davrni solishtiradi? (37)
- Javob topilgach (kichik, savol ostida): 6-ekran 3/3 kadri — hisobotning 4-qatori halqada.
- Izoh (MD): savolda «eslatma» yo'q — web-trekda ham to'g'ri (sinf 12). ✔ yolg'iz eng uzun emas (O'lchov); A–C — rost sonlar, lekin «qaytish»ni ko'rsatmaydi (S-004); B izohi — asosiy harakat hozirgi holatni sanaydi (9.39 c), «bir marta qo'shilgan» emas (10-FILTR 7 supurishida topildi). «foiz» C va D da (kalit so'z faqat to'g'rida emas); C — lending foizi (2-ekran pastki qatori sonlari), ilovaga qaytish emas.

## 8 · Zaxira reja  ← QTushuncha (ketma-ket: bo'g'inlar → tanlov → gipoteza → ish)
- Eyebrow: Tushuncha · zaxira reja
- Sarlavha: **50 ga yetmasa, bir haftada nima qilasiz?** (40)
- Mentor: Mentor misolidagi bo'g'inlarni birma-bir oching va odam qayerda kam ekanini tanlang.
- Qadam qatori (`QQadamlar`): 1 Bo'g'inlar · 2 Tanlov · 3 Gipoteza · 4 Ish
- Vizual:
  - **chapda — bo'g'in kartalari** (`BoginKartalar`, to'rt karta ustma-ust, orasida ingichka chiziq — strelka emas): «Kanal» · «Lending» · «O'rnatish va ro'yxat» · «Asosiy harakat»; kartalar tepasida kulrang izoh: Bu darsda bo'g'in — odam postdan asosiy harakatgacha o'tadigan yo'lning alohida joyi. (85)
    Kartalar yopiq (faqat nomi), joriysi halqada.
  - **o'ngda — reja kartasi:** uch bo'sh uzuq qator (yorliqsiz — P-036); ostida «Maydon Jamoa» telefon bo'lagi hali yo'q.
- **Harakat → Vizual o'zgarish:**
  1. Bo'g'in kartasini bosish → karta ochiladi, Mentor sonlari sanab chiqadi, birligi kulrang yorliqda (A-6): Kanal — «post 2 joyga yetdi: 60 kishilik guruh va sinf chati» · Lending — «tashrif 74 · «Qo'shilmoqchiman» 41 · Umami» ·
     O'rnatish va ro'yxat — «ochdi 61 · ro'yxatdan o'tdi 38 · qurilma», ostida ikkinchi qator sirg'alib kiradi: «8-darsdagi tuzatishdan keyin birinchi marta ochgan qurilmalar — 15, ulardan ro'yxatdan o'tgani — 11 (73%; oldin 59%)»,
     kulrang: 15 ta qurilma — kam: farq bor, lekin bu isbot emas. · Asosiy harakat — «ro'yxatdan o'tgan 38 · asosiy harakatni qilgan 19 · hisob».
  2. 4/4 ochilgach har kartada kichik tugma «Shu yerda kam» (yumshoq halqada) → tanlov (ballsiz) → tanlangan karta accent chegarada; Mentor tanlovi — «Kanal» kartasi yashil chegarada;
     reja kartasining 1-qatoriga uchib yoziladi: **Kanal: post faqat ikki joyga yetdi (60 kishilik guruh va sinf chati).** — yorliq «qaysi bo'g'inda kam».
     Natija qatori (`QTaxmin`): «Tanlovingiz: … · Mentor tanlovi: kanal» yoki «Mentor ham kanalni tanladi»; ostida kulrang, ikki qator: Boshqa bo'g'inlarda ham odam kamayadi — bir haftaga bittasi tanlanadi. · Bo'g'inlarning birligi har xil: sonlari solishtirilmaydi — har birining ichiga qaraladi. (88)
  3. «Gipoteza» tugmasi (halqada) → 2-qator yoziladi: **Agar har o'yin e'loni bilan birga havola yuborilsa, yangi odamlar keladi, chunki tashkilotchi o'z jamoasini o'zi chaqiradi.** — yorliq «gipoteza».
  4. «Ish» tugmasi → 3-qator: **E'lon berilgach ilovada «Havolani ulashish» tugmasi — rejaning 3-bosqichi oldinga suriladi.** — yorliq «bir haftalik ish»; reja kartasi ostida telefon bo'lagi chiqadi:
     e'lon berilgandan keyingi «O'yin» ekrani, tugmalar ostida yangi tugma «Havolani ulashish» bir lahza ajralib kiradi (accent).
  4/4 dan so'ng reja kartasi ustida yorliq **zaxira reja**, `QIzoh`: Maqsadga yetilmaganda yoziladigan bu uch qator — zaxira reja deyiladi. (70)
- Xulosa: Bizda zaxira reja uch qator: qaysi bo'g'inda odam kam, bitta gipoteza va bir haftada bajariladigan bitta ish. (109)
- Ipucha (40 s): Chapdagi yoqilgan bo'g'inni bosing — Mentor sonlari ochiladi.
- Natija (`tugadi`): qadam qatori va «Shu yerda kam» tugmalari yo'qoladi; bo'g'in kartalari ixcham (Kanal yashil), reja kartasi va telefon bo'lagi fokusda.
- Tugma (pastki): Bo'g'inlarni oching (N/4) → Davom etish · vizual ⛶ ichida.
- Keyingi bosiladigan joy: joriy bo'g'in kartasi → «Shu yerda kam» (to'rttasi navbatma-navbat to'lqin) → «Gipoteza» → «Ish» → «Davom etish».
- O'qituvchi eslatmasi: Mentor tanlovi — fikr, yagona javob emas: lending va ro'yxat bo'g'inlarida ham odam kamayadi. Mentor kanalni «2 — eng kichik son» bo'lgani uchun emas, post faqat ikki joyga yetgani uchun tanladi — sahifaga keladiganlar kam.
  Bo'g'inlarning birligi har xil (post joyi, tashrif, qurilma, hisob) — sonlarni bir-biridan ayirmang, bo'g'inlarni son bo'yicha «eng kam» deb saralamang; har bo'g'inning o'z ichiga qarang.
  «O'rnatish va ro'yxat»dagi ikkinchi qator — 8-darsdagi tuzatishning birinchi natijasi: 15 qurilmadan 11 tasi (oldin 46 dan 27). Son kichik — «tuzatish ishladi» deyilmaydi; Mentor bu bo'g'inga yana vaqt beradi, shuning uchun bugun kanalni tanladi.
  Gipoteza shakli — 10-Modul 4-darsidan. «Rejaning 3-bosqichi» — 7-darsdagi rejaning oxirgisi (har e'lon bilan havola).
  Mentor misolining ishi — uyga vazifa namunasi (teg `m12-dars-10-done`). Tanlovni «xato» demang: «Siz qaysi sonni ko'rib tanladingiz?» deb so'rang.

## 9 · Kod yozish: SQL  ← QKod (Neon varianti — kod oynasi o'rnida Neon maketi; 10-Modul 1-dars naqshi, PM_DARS_ETALON 26)
- Eyebrow: Kod yozish · Neon
- Sarlavha: **Ro'yxatdan o'tganlarni sanaydigan SQL yozamiz.** (46) — PM-082(a) sarlavha oilasi
- Mentor: Hisobotning birinchi qatori Database'dan olinadi — Neon'dagi SQL Editor'da uni kunlar bo'yicha o'zingiz sanang.
- Darvoza-mashq (PM-082 c/e, SQL oldidan, ballsiz): **Namuna va tekshiruv akkauntlarini qaysi ustun ajratadi?** · `login` · `yaratilgan` · ✔ `namuna`
  - xato `login`: `login` — o'zi tanlagan nom: namuna akkauntda ham bor. (52) (belgisiz)
  - xato `yaratilgan`: `yaratilgan` — qachon ro'yxatdan o'tgani: u kunni beradi. (55) (belgisiz)
- Chap (vazifa, 3 band; bosiladigan katakcha emas — qadam ro'yxati):
  1 Neon'da loyihangizni oching va SQL Editor'ga o'ting.
  2 Bo'sh joyni to'ldirib, SQL'ni o'zingiz yozing va «Run»ni bosing.
  3 Neon ko'rsatgan qatorlarni pastga yozing: kun va son.
  Web-trek qatori (trek `web` bo'lsa yoki kalit yo'q bo'lsa; kulrang): Web-trekda — saytingizning foydalanuvchilar jadvali; unda vaqt ustuni bo'lmasa, kunlarsiz jami: `SELECT COUNT(*) FROM {jadval} WHERE namuna = false;`
- SQL (ekranda; nusxalash tugmasi yo'q — qo'lda yozganda o'rganiladi, korpus §19):
```sql
SELECT date(yaratilgan) AS kun, COUNT(*)
FROM oyinchilar
WHERE ______ = false
GROUP BY kun
ORDER BY kun;
```
  ostida kulrang: `oyinchilar` — Mentor misolidagi jadval. Sizda — ishga tushirishdan oldin `namuna` ustuni qo'shilgan jadval.
- Maydon (vazifa ostida): kichik jadval-forma — «Kun» (sana) · «Son» · tugma «+ Qator»; ostida **Jami: N** (o'zi sanaladi). Tekshiruv (`QXato`, bloklaydi):
  - son bo'sh yoki son emas: Neon ko'rsatgan sonni shu yerga yozing. (39) · kun bo'sh: Qaysi kun? Neon'dagi `kun` ustunidan oling. (41) · takror kun: Bu kun yuqorida bor — sonini o'sha qatorga yozing. (50)
- Yordam (bosilsa ochiladi): Eslatma (SQL darslaridan): `date(…)` — vaqtdan faqat kunni oladi · `AS kun` — ustunga nom beradi · `COUNT(*)` — qatorlarni sanaydi · `WHERE` — qaysi qatorlar olinadi · `GROUP BY kun` — har kun uchun alohida sanaydi · `ORDER BY kun` — kunlar tartibida chiqaradi.
  Jadval nomini bilmasangiz — agentga yozing: «Ro'yxatdan o'tganlar qaysi jadvalda? Faqat nomini ayt, hech narsani o'zgartirma.» `SELECT *` yozmang: jadvalda ism va login bor — hisobotga faqat son kerak.
- O'ng — Neon maketi (`NeonMaket`, chizilgan; logotip yo'q; 10-Modul 1-dars bilan bitta naqsh): tepada «SQL Editor» oynasi — SQL matni (bo'sh joy bilan), o'ng burchakda «Run»; ostida jadval: ustunlar `kun` · `count`, uchta kulrang qator «?».
  Maket ostida (`QIzoh`): Sizning qatorlaringiz shu yerda chiqadi. Mentor misolida bir haftada jami — 38. (79)
- **Harakat → Vizual o'zgarish:** darvozada `namuna` tanlanadi → SQL dagi bo'sh joyda `namuna` bir lahza ajralib turadi (maketda ham); har kiritilgan qator maketdagi «?» o'rniga chiqadi (~1 s yashil), «Jami» sanab o'sadi;
  jami yozilgach u artefakt-stripdagi «Hisobot · 1 / 4» ga uchadi. Ostida kulrang qator: Sanoq sahifasidagi «ro'yxatdan o'tgan» bilan solishtiring — odatda bir xil; farq bo'lsa, qaysi biri qachon sanalganini qarang.
- Tugma: **Bajardim — SQL ishladi, qatorlar yozildi** (qulf: darvoza yechilmagan bo'lsa — «Avval ustun savolini yeching»; qator yo'q bo'lsa — «Avval Neon ko'rsatgan qatorlarni yozing»). Bitta halol tugma (korpus §19).
- Hammasi bajarilgach (yashil): Birinchi qator Database'dan olindi — namuna va tekshiruv akkauntlarisiz. (72)
- Pastki qator (kichik, kulrang): Vaqt tugasa — keyingi mashqda 1-qatorga sanoq sahifasidagi sonni yozing va manbani «sanoq sahifasi» deb belgilang; kunlar — uyda.
- Saqlanadi («Bajardim» bosilganda): `pm-m10d10-hisobot.kunlar = [{ sana, soni }]` (`sana` — `YYYY-MM-DD`; `soni` — **shu kuni** yangi ro'yxatdan o'tganlar, jami emas; namuna va tekshiruv akkauntlarisiz — 12-dars grafigi haftalik jamini shundan hisoblaydi, tayanch 9.44 b), `royxat.soni` (jami; 10-ekranda tahrirlanadi) va `royxat.manba = 'Database'`. «Vaqt tugasa» yo'lida bu ekran hech narsa yozmaydi —
  10-ekranda son sanoq sahifasidan yoziladi va manbani o'quvchi tanlaydi («sanoq sahifasi»); `'Database'` oldindan qo'yilmaydi (10-FILTR 4: manba — haqiqiy yo'l).
- Nishon: SQL Counter! (darvoza birinchi urinishda va kamida bitta qator yozilganda).
- O'qituvchi eslatmasi: 12 daqiqa. Kun Database vaqt mintaqasi bo'yicha olinadi: `SHOW timezone;` uni ko'rsatadi. U Toshkent vaqti bo'lmasa (Neon'da odatda UTC — Shubhali joylar), tunda ro'yxatdan o'tganlar oldingi kunga tushishi mumkin; jami o'zgarmaydi.
  `namuna` ustuni bo'lmasa — 7-darsdagi birinchi blok qolgan: bugun 1-qatorga «Hali sanalmagan», ustun uyda qo'shiladi (namuna akkauntlar bilan sanalgan son hisobotga yozilmaydi).
  Faqat `SELECT` — jadval o'zgarmaydi; `DELETE`, `UPDATE` yo'q. Son Mentornikidan farq qilishi tabiiy. Telefon va login ekranga chiqmasin.
- Manba (o'quvchiga ko'rinmaydi): neon.com/docs/get-started/query-with-neon-sql-editor (06.10: «SQL Editor», «Run») · tayanch 9.5 (SQL aynan), 9.23 (jami) · postgresql.org/docs/current/datatype-datetime.html (vaqt mintaqasi).

## 10 · Metrika hisobotingiz  ← QMustaqil (USTAXONA — ketma-ket karta, 4 qator + pastki qator; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish · metrika hisoboti
- Sarlavha: **Metrika hisobotingizni qatorma-qator yozing.** (44)
- Mentor: Birinchi qator SQL'dan keldi — qolganini sanoq sahifasi, Database va Umami'dan bittalab yozing.
  (9-ekranda jami yozilmagan bo'lsa — Mentor: Birinchi qatordan boshlang: sonni sanoq sahifasidan yozing.)
- **Tepada — ixcham strip «Hisobot · n / 4»** (qator nomlari, yozilgani ✓; bitta qator, tahrirlanmaydi — SABOQ 17).
- **Chapda — `HisobotVaraq` o'quvchi holatida:** nom — `pm-m9d4-final.goya` (yo'q bo'lsa kulrang «mahsulot nomi»); qatorlar jonli to'lib boradi.
- **O'ngda — bitta katta karta (joriy),** ketma-ket (placeholder qisqa, tayyor javobsiz — §32). Har kartada: **Son** · **Manba** (yorliqlar: Database · sanoq sahifasi · Umami — bittasi) · **Sana** (bugungi sana o'zi qo'yiladi, tahrirlanadi) · kichik ikkinchi tugma **Hali sanalmagan**.
  1. **Ro'yxatdan o'tgan** — son (9-ekrandagi jami bilan to'ldirilgan — shunda manba «Database» belgilangan; 9-ekran bajarilmagan bo'lsa — son ham, manba ham bo'sh) · «/ 50» o'zi yoziladi · **shundan sinfdosh** — son (oldindan `pm-m10d7-reja.sinfdosh`, ostida kulrang «ishga tushirish kunidagi son — bilsangiz, yangilang (ixtiyoriy)»).
     Ostida kulrang qator: Namuna va tekshiruv akkauntlari sanalmaydi; sinfdoshlar sanaladi, lekin alohida aytiladi.
     «Oldin» — `pm-m10d7-reja.royxat` va `.sana` bo'lsa o'zi chiqadi («oldin: {n} — {sana}»); yo'q bo'lsa — kichik maydon «Oldingi son va sanasi» va yonida belgi «Birinchi o'lchov» (oldingi son yo'q bo'lsa — halol yozuv; 11-ekran 3-savoli shunga qaraydi).
  2. **Asosiy harakatni qilgan** — son, manba, sana, «oldin» (`pm-m10d7-reja.asosiy`, bo'lsa; yo'q bo'lsa — maydon yoki «Birinchi o'lchov»). Ostida kulrang: Mentor misolida — hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan; navbatda turgani — qo'shilgan emas.
  3. **Bosh raqam** — **Nimani sanaydi** (oldindan `pm-m9d5-prd.boshRaqam`, tahrirlanadi; yo'q bo'lsa placeholder «Qaysi bitta raqam mahsulot ishini ko'rsatadi?») · son, manba va sana.
  4. **Qaytganlar foizi** — «Birinchi davrda ochgan» (son) · «Keyingi davrda ham ochgan» (son) → foiz avtomatik hisoblanadi (butun songa yaxlitlab) · «Davrlar» (qisqa qator, placeholder «masalan: 1–3 kun · 4–5 kun») · manba va sana.
     Birlik yorlig'i: «qurilma» (web-trekda — «brauzer»). Ikki son va davr hisobotda qoladi — foiz qayerdan chiqqani ko'rinib turadi (10-FILTR 3).
     Kulrang: Keyingi davrga faqat birinchi davrda ochgan qurilmalar kiradi — yangi kelganlar emas.
  5. **Pastda: qadamlar va lending** (hisoblagich n / 4 ga kirmaydi) — qadamlar nomi `pm-m10d8-qadamlar.qadamlar[].nom` dan (yo'q bo'lsa — Mentor qadamlari kulrang placeholder), har biriga son · lending: tashriflar · tugma bosilishi.
     Birlik: qadam — qurilma (web-trekda — brauzer), lending — tashrif · bosish. Kulrang: Bo'sh qoldirsangiz bo'ladi — zaxira rejada qayerda kamligini shu sonlar ko'rsatadi.
     Ixtiyoriy alohida maydon: «eslatmadan ochdi» (web-trekda «xabardan ochdi») — 9-darsdagi sanoq qatori; kulrang: 9-darsdagi tekshiruv yozuvlarini o'chirmagan bo'lsangiz — yoniga «o'z qurilmam ham bor» deb yozing.
  «Saqlash» o'ngda (187).
- Tekshiruv (`QXato`, ≤60; javob maydon ostida; «yumshoq» belgilanganlari ikkinchi «Saqlash» bilan o'tadi):
  - son ham, «Hali sanalmagan» ham yo'q (bloklaydi): Son yozing yoki «Hali sanalmagan»ni bosing. (43)
  - manba tanlanmagan (bloklaydi): Bu son qayerdan olindi? Manbani tanlang. (40)
  - sana bo'sh (bloklaydi): Qachon sanalgan? Sanani yozing. (31)
  - sinfdosh ro'yxatdan o'tgandan ko'p (bloklaydi): Sinfdoshlar jami sondan ko'p bo'lolmaydi. (41)
  - asosiy harakat ro'yxatdan o'tgandan ko'p (bloklaydi): Asosiy harakatni qilganlar ro'yxatdan o'tganlar ichida. (55)
  - keyingi davr birinchidan ko'p (bloklaydi): Yana ochganlar birinchi davrdagidan ko'p bo'lolmaydi. (53)
  - bosh raqamning «Nimani sanaydi» qatori bo'sh (bloklaydi): Bosh raqam nimani sanaydi? Bir qatorda yozing. (46)
  - 1–4-qatorda manba «Umami» (yumshoq): Umami — lending sonlari; ilova sonini Database beradi. (54)
  - Yorliq (yumshoq xatodan so'ng): Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam (qatorga qarab bitta blok — Mentor misolidan, A-6 jadvali):
  1 — Mentor misolida: «38 / 50 · 11 tasi — sinfdosh · Database · 7 kun keyin».
  2 — Ishga tushirish kunida ishlatgan so'rovingizni Neon'da qayta «Run» qiling. Mentor misolidagi so'rov (9.23):
     `SELECT COUNT(*) FROM oyinchilar o WHERE o.namuna = false AND (EXISTS (SELECT 1 FROM ishtirokchilar i WHERE i.oyinchi_id = o.id AND i.holat IN ('qoshildi', 'keladi')) OR EXISTS (SELECT 1 FROM oyinlar g WHERE g.tashkilotchi_id = o.id));` — natija: 19.
  3 — Mentor misolida: «birinchi haftada to'lgan o'yinlar: 1 · Database». So'rov kerak bo'lsa — agentga: «Neon SQL Editor uchun bitta `SELECT` yoz, o'zing ishga tushirma: {bosh raqam nimani sanaydi}. Faqat `namuna = false` akkauntlar, natijada faqat son. Jadvallarni o'zgartirma.»
  4 — Mentor misolida: «birinchi 3 kunda ochgan 46 qurilmadan 17 tasi keyingi 2 kunda ham ochdi — 37%». Sanash uchun agentga: «Neon SQL Editor uchun bitta `SELECT` yoz, o'zing ishga tushirma: `hodisalar` dagi `ochdi` yozuvlaridan {1-davr} da ochgan turli qurilmalar soni va **faqat shu qurilmalar ichidan** {2-davr} da ham ochganlari soni — 2-davrda birinchi marta ochgan qurilmalar kirmasin. Natijada faqat ikki son. Jadvallarni o'zgartirma.»
     Tekshiring: ikkinchi son birinchisidan katta bo'lolmaydi.
     Ulgurmasangiz — «Hali sanalmagan»: halol qator ham hisobotning bir qismi.
  5 — Sanoq sahifangizni kalit bilan oching va qadamlar sonini yozing; lending sonlari — Umami'da lending saytingiz sahifasida.
- **Harakat → Vizual o'zgarish:** «Saqlash» → son, manba yorlig'i va sana kartadan varaqdagi o'z qatoriga uchadi (~1 s yashil), strip n / 4 sanab o'sadi, pastdan keyingi karta kiradi · «Hali sanalmagan» → qator kulrang «sanalmagan» bo'lib yoziladi ·
  5-karta → varaq pastiga qadamlar va lending qatorlari sirg'alib kiradi. Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`.
  Tugagach karta yopiladi; varaq butun enga — har qator yonida ✎ (bosilsa o'sha qator katta karta bo'lib ochiladi, qolgani joyida — SABOQ 29).
- Xulosa (tanlovdan, P-046):
  - to'rttasi sanalgan: Hisobotingiz tayyor: har son yonida manba va sana bor. (54)
  - kamida bittasi «sanalmagan»: Hisobot yozildi: {k} ta qator hali sanalmagan — halol belgilandi, uyda sanaysiz. (80)
- Tugma (pastki): Yana N ta qator yozing → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: joriy maydon (accent, to'lqin) → manba yorlig'i → «Saqlash» (maydonlar to'lgach halqada).
- Artefakt-strip (U-042): shu ekrandan — «Hisobot · n/4» (ixcham); 11, 15-ekranlarda ko'rinadi; test, arena, podiumda yo'q.
- Saqlash: `pm-m10d10-hisobot = { royxat: { soni, sinfdosh, manba, sana, oldin }, asosiy: { soni, manba, sana, oldin }, bosh: { nima, soni, manba, sana }, qaytgan: { birinchi, keyingi, foiz, davr, manba, sana } | null, kunlar }`
  (tayanch 8 — 10-FILTR 3 dan keyin yangilandi; `oldin`: `{ soni, sana }` | `'birinchi'` | `null`; `manba`: `'Database'` | `'sanoq sahifasi'` | `'Umami'` — o'quvchi tanlagani; «Hali sanalmagan» → shu qator `null` yoki `soni: null` — KOD 9).
  Dars ichida (ccProgress, kalitga kirmaydi): qadamlar, lending va «eslatmadan ochdi» sonlari — 11-ekran zaxira rejasi uchun (11 va 12-darslar ularni o'qimaydi — grep 06.10).
- Nishon: Report Ready! (1–3-qatorda son, manba va sana; 4-qatorda son yoki «Hali sanalmagan»).
- Mentor rejimi: forma o'rniga Mentor hisoboti to'liq (2-ekran holati). Mentor statistikasi: «To'rt qatorni yozganlar» · «Sanalmagan qatori borlar» (sonlarning o'zi emas). **KOD:** Mentor ekranida har o'quvchi — ism · n / 4 (sonlar faqat bosilganda).
- O'qituvchi eslatmasi: 12 daqiqa. Sinfdoshlar soni — ixtiyoriy: 7-darsdagi son qoladi, o'quvchi o'zi bilsa — yangilaydi. Sinfda «kim ro'yxatdan o'tgan — qo'l ko'taring» deb so'ralmaydi (bosim va noaniq son; tayanch 9.39 e, 10-FILTR 8).
  Sonlar sinf oldida aytilmaydi; kichik son — baho emas. Eng ko'p xato — manbani tanlamaslik yoki qadamdagi «qo'shildi»ni asosiy harakat deb yozish: «Bu son nimani sanaydi — qurilmanimi, hisobnimi?» deb so'rang.

## 11 · Tekshiruv va zaxira reja  ← QMustaqil (juftlik + yakka rejim; 3 savol, so'ng shartli zaxira reja — P-008: ikkinchi topshiriq shartli ochiladi)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Hisobotingiz tekshiruvdan o'tadimi?** (35)
- Mentor: Sherigingiz hisobotingizni o'qib, savollarni birma-bir beradi — javobni birga belgilang.
  Yakka rejimda: Savollarni o'zingizga bering va javobini hisobotdan toping.
  Zaxira qismida (Mentor gapi almashadi): Endi zaxira reja: avval sonlaringizga qarab, odam qayerda kam ekanini tanlang.
- Qadam qatori (`QQadamlar`, `TEKSHIRUV_SAVOLLAR`): 1 Son qayerdan? · 2 Kimlar sanalgan? · 3 Oldingi son bormi? · 4 Zaxira reja (faqat ro'yxatdan o'tgan < 50 yoki son yo'q bo'lsa)
- **Chapda — o'quvchining varag'i** (to'liq, 10-ekrandan); joriy savolga tegishli joy accent halqada (1 → manba va sana yorliqlari · 2 → 1-qator ostidagi sinfdosh va namuna qatori · 3 → «oldin» qatorlari).
- **O'ngda — savol kartasi:** savol · «Nimaga qarang» bir qatori · ikki tugma «Ha» · «Yo'q — tuzataman»:
  1. Son qayerdan? — Nimaga qarang: har son yonida manba va sana bormi?
  2. Kimlar sanalgan? — Nimaga qarang: namuna va tekshiruv akkauntlari chiqarilganmi, sinfdoshlar alohida aytilganmi?
  3. Oldingi son bormi? — Nimaga qarang: 1 va 2-qator yonida oldingi son va sanasi turibdimi (yoki «birinchi o'lchov» deb yozilganmi)?
  Karta ostida doimiy kulrang qator: 50 ga yetmaslik — tuzatish sababi emas.
- «Yo'q — tuzataman» → o'sha qator katta karta bo'lib ochiladi (10-ekran maydonlari va tekshiruvlari bilan; 3-savolda — «Oldingi son va sanasi» maydoni va «Birinchi o'lchov» belgisi) + «Saqlash»; saqlangach savol qaytadi va «Ha» faol.
  Hozir tuzatib bo'lmasa (masalan son uyda sanaladi) — kartada kichik tugma «Uyda tuzataman»: qator «tuzatish» holatida qoladi.
- Muhr (3/3 dan so'ng, varaq tepasiga tushadi): yashil **«Qabul»** (juftlikda yoki jonli darsda Mentor ko'rganda) · yakka rejimda — yashil **«Tuzatish topilmadi»** · accent **«Tuzatish: {qator}»** («Uyda tuzataman» bosilgan bo'lsa).
  Ostida kulrang: Qabul — bugungi tekshiruv natijasi: sonlar keyin yangilanadi.
- **4 · Zaxira reja** (ro'yxatdan o'tgan < 50 yoki son yo'q) — ketma-ket uch karta (bir vaqtda bitta; SABOQ 29):
  a) **Qaysi bo'g'inda odam kam?** — to'rt yorliq: Kanal · Lending · O'rnatish va ro'yxat · Asosiy harakat; har yorliq ostida o'quvchining sonlari (bor bo'lsa, birligi bilan):
     Kanal — 6-darsda tanlangan kanallar (`pm-m10d6-kanallar.kanallar[].nom`, `yuborildi`; yo'q bo'lsa «—») · Lending — tashrif · tugma (10-ekran 5) · O'rnatish va ro'yxat — birinchi qadam · ro'yxatdan o'tdi (10-ekran 5; web-trekda — saytni ochib ro'yxatdan o'tish) ·
     Asosiy harakat — ro'yxatdan o'tgan · asosiy harakatni qilgan (10-ekran 1–2). Yorliqlar ostida kulrang: Bo'g'inlarning birligi har xil: sonlari solishtirilmaydi — har birining ichiga qaraladi. (88)
     Ostida majburiy maydon **Qaysi son yoki fakt buni ko'rsatadi?** (placeholder «masalan: tashrif 74, tugma 41») — bo'g'in «eng kichik son» bo'yicha emas, shu dalil bilan tanlanadi (10-FILTR 1).
     «O'rnatish va ro'yxat» yorlig'i ostida, `pm-m10d8-qadamlar.chiqarildi` bo'lsa — kulrang qator: 8-darsda tuzatish chiqargansiz — undan keyin kelgan qurilmalarni alohida sanash mumkin (Yordam).
  b) **Gipoteza** — bitta maydon, placeholder «Agar …, …, chunki …».
  c) **Bir haftada bajariladigan bitta ish** — bitta maydon, placeholder «Nima qilasiz?».
     Kanal tanlangan bo'lsa — ostida ixcham qator «Post yozsangiz — 6-darsdagi xavfsizlik ro'yxati» (bosilsa olti band ochiladi — `XAVFSIZLIK`, so'zma-so'z; U-013 toggle).
  Uchala karta ostida doimiy kulrang qator: Soxta akkaunt, o'zingiz qayta ro'yxatdan o'tish va sovg'a va'dasi — yo'q.
  Ro'yxatdan o'tgan ≥ 50: karta «50 ga yetdingiz — zaxira reja shart emas.» + ikkinchi tugma «Baribir bitta ish yozaman» (ixtiyoriy; o'sha uch karta).
- Tekshiruv (`QXato`, ≤60):
  - bo'g'in tanlanmagan (bloklaydi): Bitta bo'g'inni tanlang — sonlarga qarab. (41)
  - dalil qatori bo'sh (bloklaydi): Qaysi son yoki fakt buni ko'rsatadi? Bir qatorda yozing. (56)
  - gipotezada «agar» yoki «chunki» yo'q (yumshoq): Gipoteza shakli: «Agar …, …, chunki …». (39)
  - ish bo'sh (bloklaydi): Bir haftada nima qilasiz? Bitta ish yozing. (43)
  - ish matnida «sovg'a», «soxta», «sotib ol» (yumshoq): Sovg'a va soxta akkaunt bilan odam yig'ilmaydi. (47)
  - Yorliq (yumshoq xatodan so'ng): Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam (zaxira kartalarida — Mentor misoli, A-6 aynan): «Kanal: post faqat ikki joyga yetdi (60 kishilik guruh va sinf chati).» · «Agar har o'yin e'loni bilan birga havola yuborilsa, yangi odamlar keladi, chunki tashkilotchi o'z jamoasini o'zi chaqiradi.» ·
  «E'lon berilgach ilovada «Havolani ulashish» tugmasi.»
  «O'rnatish va ro'yxat» tanlanganda, 8-darsda tuzatish chiqqan bo'lsa — agentga: «Neon SQL Editor uchun bitta `SELECT` yoz, o'zing ishga tushirma: `hodisalar` da birinchi `ochdi` yozuvi {tuzatish chiqqan vaqt} dan keyin bo'lgan turli qurilmalar soni va ulardan ro'yxatdan o'tgan qadami borlari soni. Natijada faqat ikki son. Jadvallarni o'zgartirma.»
  ({tuzatish chiqqan vaqt} — `pm-m10d8-qadamlar.chiqarildiVaqt` dan o'zi qo'yiladi.) Mentor misolida: 15 qurilmadan 11 tasi — kam son: farq bor, lekin bu isbot emas.
- **Harakat → Vizual o'zgarish:** «Ha» → varaqdagi tegishli joy yashil ✓, qadam ✓, keyingi savol kartasi kiradi · «Yo'q — tuzataman» → qator kartasi chiqadi, saqlangach varaqqa uchib qaytadi (~1 s yashil) ·
  3/3 → muhr tushadi · zaxira kartalari: tanlangan bo'g'in yorlig'i accent, «Saqlash» → matn varaq ostidagi «Zaxira reja» blokiga uchadi (uch qator, bittalab) · hammasi tugagach savol va zaxira kartalari yopiladi, varaq va zaxira bloki butun enga.
- Xulosa (tanlovdan, P-046):
  - muhr «Qabul» yoki «Tuzatish topilmadi» + zaxira yozilgan: Hisobotingiz tekshirildi, zaxira reja yozildi: bir haftada — bitta ish. (71)
  - muhr «Qabul» yoki «Tuzatish topilmadi», ≥ 50, zaxira yozilmagan: Hisobotingiz tekshirildi: ro'yxatdan o'tganlar 50 ga yetdi. (59)
  - «Tuzatish: {qator}»: Tuzatish: {qator} qatori. Uni uyda tuzatasiz. (45) — `{qator}` o'rnida qator nomi; eng uzuni «Asosiy harakatni qilgan» bilan — 61
- Saqlash: `pm-m10d10-hisobot.tekshiruv` = `'qabul'` | `'tuzatish'` | `'topilmadi'` · `tuzatishQator` = `'royxat'` | `'asosiy'` | `'bosh'` | `'qaytgan'` | `null` (muhr «Tuzatish: {qator}» dagi qator — 11-dars o'sha sonni dalil qilib qo'ydirmaydi; 11-FILTR 17) · `pm-m10d10-hisobot.zaxira` = `{ boginda: 'kanal' | 'lending' | 'royxat' | 'asosiy', dalil, gipoteza, ish }` yoki `null` (tayanch 8; `dalil` — «Qaysi son yoki fakt buni ko'rsatadi?» qatori, 11-dars dalil sifatida o'qishi mumkin).
- Tugma (pastki): Savollarni bering (N/3) → Davom etish (`optionalLive`; zaxira qismi ham ixtiyoriy o'tkaziladi — yakun holati «zaxira reja qoldi»).
- Keyingi bosiladigan joy: joriy savol kartasidagi «Ha» / «Yo'q — tuzataman» → (tuzatishda) maydon → «Saqlash» → (zaxirada) bo'g'in yorlig'i → maydon → «Saqlash» → «Davom etish».
- Nishon: Report Checked! (uch savol javoblanganda — juftlikda ham, yakka rejimda ham rost).
- Jonli darsda: o'qituvchi — Mentor. **KOD:** Mentor ekranida har o'quvchi muhri («Qabul» / «Tuzatish: …») va zaxira reja holati (bor / yo'q); o'qituvchi 2–3 hisobotni (o'quvchi roziligi bilan) sinf bilan uch savol orqali tekshiradi.
  Mentor statistikasi: «Qabul» · «Tuzatish» (qaysi qator bo'yicha) · «Zaxira reja yozganlar» · bo'g'inlar bo'yicha tanlov soni.
- O'qituvchi eslatmasi: 8 daqiqa tekshiruv (4 daqiqadan so'ng «O'rin almashing» deng), 8 daqiqa zaxira reja. Sherik o'quvchining ekranida savol beradi; sonni sinfga aytmaydi.
  «Tuzatish» — yaxshi natija: son qayta sanaladi. Zaxira ishi bosim bo'lmasin: «do'stingni taklif qil — sovg'a», bir xabarni ko'p guruhga tashlash, notanish odamga yozish — yo'q (6-darsdagi ro'yxat).
  50 ga yetgan o'quvchi kam bo'lishi mumkin — ularni alohida maqtamang, boshqalarni ham solishtirmang.

## 12 · Yakuniy savol  ← QTest (✔ B, `correctIdx 1`; halollik va zaxira reja birga — ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Sonlaringiz 50 ga yetmadi. Bugun nima qilasiz?** (7 so'z) · savol ustida yorliq yo'q
  - A — Sinfdoshlardan ikkinchi akkaunt so'rayman (41)
  - ✔ B — Bitta bo'g'inni tanlab, bitta ish yozaman (41)
  - C — Namuna akkauntlarni ham sanoqqa qo'shaman (41)
  - D — Hamma bo'g'inni bir haftada birdan tuzataman (44)
- To'g'ri izohi: Son halol qoladi, bir hafta esa bitta bo'g'inga ketadi. (55)
- Xato izohlari: A — Ikkinchi akkaunt — bitta odam ikki marta sanaladi. (50) · C — Namuna akkaunt — haqiqiy odammi? Kim sanaladi? (46) ·
  D — Bir haftaga hammasi sig'adimi? Rejada nechta ish bor edi? (57) · (umumiy) Son halol qolsin — keyin qayerda kamligini qidiring. (52)
- Javob topilgach (kichik, savol ostida): 8-ekrandagi zaxira reja kartasi ixcham — uch qator, «Kanal» yashil.
- Izoh (MD): A — soxta akkaunt (TAQIQLAR 1), C — namuna sanalmaydi (9.5), D — bir haftada bitta ish (kurs qolipi, 8-ekran xulosasi «Bizda …»); har biri darsning o'z qoidasi bo'yicha noto'g'ri (S-004).
  «bo'g'in» B va D da, «akkaunt» A va C da (kalit so'z faqat to'g'rida emas); ✔ yolg'iz eng uzun emas (O'lchov). Savol «50 ga yetmadi» — holat, baho emas; sinfdoshlar va «hamma» — A, D da.

## 13 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Har xil o'lchov · 2 — Mentor tekshiruvi · 3 — Qaytganlar foizi · 4 — Zaxira reja

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| Bizda metrika hisobotida qaysi to'rt qator bor? | Ro'yxatdan o'tgan, asosiy harakatni qilgan, bosh raqam va qaytganlar foizi |
| Hisobotdagi har son yonida nima turadi? | Manbasi va sanasi |
| Mentor tekshiruvi qaysi uch savolni beradi? | Son qayerdan? Kimlar sanalgan? Oldingi son bormi? |
| 50 ga yetmagan hisobot tuzatishga qaytadimi? | Yo'q: tekshiruv sonning halolligini ko'radi, kattaligini emas |
| Namuna va tekshiruv akkauntlari sanaladimi? | Yo'q — SQL'dagi `namuna = false` ularni chiqarib qo'yadi |
| Sinfdoshlar sanaladimi? | Ha, lekin alohida aytiladi |
| Qadamdagi «qo'shildi» va «asosiy harakatni qilgan» nimasi bilan farq qiladi? | Biri turli qurilmalarni, biri hisoblarni sanaydi — ular ayirilmaydi |
| SQL'dagi `GROUP BY kun` nima beradi? | Har kun uchun alohida son |
| Qaytganlar foizi nimani ko'rsatadi? | Bir davrda ochganlardan keyingi davrda ham ochganlari foizini |
| Duolingo'da odamlarni har kuni nima qaytaradi? | Seriyani yo'qotib qo'yish qo'rquvi |
| Bizda zaxira reja qaysi uch qatordan iborat? | Qaysi bo'g'inda odam kam, bitta gipoteza va bir haftada bajariladigan bitta ish |
| Mentor qaysi bo'g'inni tanladi va nega? | Kanal: post faqat ikki joyga yetdi |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (to'rt qator — 2 · manba va sana (2) · uch savol — 4 · halollik — 4 · `namuna = false` — 9 · sinfdosh — 2, 10 · qurilma va hisob — 2, 3 · `GROUP BY` — 9 · qaytganlar foizi — 6, 10 · Duolingo — 6 · zaxira reja — 8 · kanal — 8).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). «retention» — kartochkada yo'q (9-darsda bir marta — tayanch 1.9).

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha (holatga qarab — sinf 1; belgi ✓ va nishon faqat birinchisida; ikkinchi-beshinchi — ish fakti, baho emas):
  - hisobot 4/4, muhr «Qabul» yoki «Tuzatish topilmadi», zaxira yozilgan (yoki ≥ 50): **Hisobotingizni yozdingiz va tekshiruvdan o'tkazdingiz.** (54)
  - hisobot 4/4, muhr «Tuzatish: …»: **Hisobot tayyor — bitta tuzatish qoldi.** (38)
  - hisobot 4/4, muhr bor, < 50, zaxira yozilmagan: **Hisobot tekshirildi — zaxira reja qoldi.** (40)
  - hisobot 4/4, tekshiruv boshlanmagan: **Hisobot tayyor — tekshiruv qoldi.** (33)
  - hisobot 4/4 dan kam: **Hisobot boshlandi — qolgan qatorlarni yozing.** (45)
  («4/4» — to'rt qatorning har birida son yoki «Hali sanalmagan» bor.) Sarlavha ostida bitta yorliq (bo'lsa): «Sanalmagan qator: {k} ta — uyda».
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Hisobotdagi son manbasi va sanasi bilan tekshiriladi; maqsadga yetmasa — bitta bo'g'in tanlanib, unga bitta ish yoziladi.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Bizda metrika hisoboti — to'rt son, har birining manbasi va sanasi bilan. (73)
  - Mentor tekshiruvi uch savol beradi: son qayerdan, kimlar sanalgan, oldingi son bormi. (85)
  - Qurilma, hisob va tashrif — har xil o'lchov: ular bir-biridan ayirilmaydi. (74)
  - Odam qaytdimi-yo'qmi — buni qaytganlar foizi ko'rsatadi. (56)
  - Bizda zaxira reja uch qator: qaysi bo'g'inda odam kam, bitta gipoteza va bir haftada bajariladigan bitta ish. (109)
- Uyga vazifa (`HwCard`, yangi — P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: foydalanuvchilaringiz · Nechta: bitta ish · Muddat: keyingi darsgacha
  - ① Zaxira rejangizdagi ishni bajaring. Ilovada o'zgarish bo'lsa — agentga talab yozing (qayerda · nima qilsin · nima buzilmasin): nima o'zgarishi va foydalanuvchini qayerga olib borishini o'zingiz yozing — agent o'zi tanlamasin. Keyin push qiling;
    mobil trekda APK o'zi yangilanmaydi — yangi o'rnatish fayli tayyorlanadi va lendingdagi havola almashtiriladi.
    50 ga yetgan va zaxira reja yozmagan bo'lsangiz — bu band ixtiyoriy: xohlasangiz, hisobotdan yaxshilamoqchi bo'lgan bitta bo'g'inni tanlab, unga bitta ish qiling.
    Mentor misolini ko'rmoqchi bo'lsangiz (majburiy emas): «Havolani ulashish» tugmasi — `git checkout -f m12-dars-10-done` (Mentor repo'si, alohida yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi).
  - ② Ish post yoki xabar bo'lsa — 6-darsdagi olti bandli ro'yxat bilan tekshiring: guruhga — egasidan ruxsat so'rab, ota-onangizga ko'rsatib.
  - ③ Neon'da sonlarni qayta sanang va hisobotdagi «sanalmagan» qatorlarni sanasi bilan to'ldiring. Bir hafta — kam vaqt: o'sish bo'lmasa ham halol yozing.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Raqamlaringiz pitchni qanday o'zgartiradi?»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · sanalmagan yorlig'i · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): «Kim uchun» — HwCard yorlig'i (P-025). ① — bitta ish (kurs qolipi), APK o'zi yangilanmaydi (tayanch 1.8, 9.3); 50 ga yetganlarga — ixtiyoriy (10-FILTR 13: dars ichidagi «zaxira reja shart emas» bilan bir); Mentor tegini ko'rish — majburiy emas (10-FILTR, TS 18) · ② — real odamlar (sinf 14, `XAVFSIZLIK`) · ③ — o'sish va'da qilinmaydi (sinf 2d).
  «Endi siz bilasiz» 1 va 5 — 2-ekran ta'rifi va 8-ekran xulosasi bilan so'zma-so'z bir (T-042).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Evidence Finder!** (4-ekran, uch dalil birinchi urinishda) — Mentor hisobotida uch savolning dalilini birinchi urinishda topdingiz
- **SQL Counter!** (9-ekran, darvoza birinchi urinishda va kamida bitta qator) — Ro'yxatdan o'tganlarni Database'dan o'zingiz sanadingiz
- **Report Ready!** (10-ekran, to'rt qator) — Metrika hisobotingizni yozdingiz: har son yonida manba va sana bor
- **Report Checked!** (11-ekran, uch savol javoblanganda) — Hisobotingizni uch savol bilan tekshirdingiz (juftlikda ham, yakka rejimda ham rost)
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda. Zaxira reja uchun nishon yo'q — u shartli (≥ 50 o'quvchida shart emas), nishon esa hammaga teng bo'lsin.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Har xil o'lchov** — 1 Qadamlar har qadamda turli qurilmalarni sanaydi. · 2 Asosiy harakat — hisoblarni: hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan. · 3 Har xil birlikdagi sonlar bir-biridan ayirilmaydi.
  — Sinfga savol: Bitta odam ilovani ikki telefonda ochsa, «ochdi» qadamida nechta sanaladi?
- **5 · Tekshiruv halollikni ko'radi** — 1 Son qayerdan? — manba va sana bormi. · 2 Kimlar sanalgan? — namunasiz, sinfdoshlar alohida. · 3 Oldingi son bormi? — yonida, sanasi bilan.
  — Sinfga savol: 50 ga yetmagan, lekin halol hisobot qanday javob oladi?
- **7 · Qaytganlar foizi** — 1 Bir davrda ilovani ochganlar sanaladi. · 2 Ulardan keyingi davrda ham ochganlari sanaladi. · 3 Ikkinchisi birinchisining necha foizi — shu qaytganlar foizi.
  — Sinfga savol: Duolingo'dagi qo'rquv sizning mahsulotingizga kerakmi — yoki foydali eslatma?
- **12 · Zaxira reja** — 1 Sonlarga qarab — qaysi bo'g'inda odam kam. · 2 Bitta gipoteza: «Agar …, …, chunki …». · 3 Bir haftada bajariladigan bitta ish.
  — Sinfga savol: Soxta akkaunt sonni oshirsa ham, nega yordam bermaydi?

## Jonli viktorina — 12 savol (✔ o'rni: A 2·7·9 · B 1·5·12 · C 4·8·11 · D 3·6·10 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Mentor hisobotida «ro'yxatdan o'tgan» soni qayerdan olingan? (7 so'z) (2)
   - Umami'dagi lending tashriflaridan (33)
   - ✔ Database'dan, namuna akkauntsiz (31)
   - Sinf chatidagi javoblar sonidan (31)
   - Lendingdagi tugma bosilishlaridan (33)
2. Sanoq sahifasidagi qadamlar nimani sanaydi? (5 so'z) (2)
   - ✔ Har qadamda turli qurilmalarni (30)
   - Har qadamda turli akkauntlarni (30)
   - Har qadamda lending tashriflarini (33)
   - Har qadamda tugma bosilishlarini (32)
3. Hisobotda sinfdoshlar qanday aytiladi? (4 so'z) (2, 10)
   - Sanalmaydi, chiqarib tashlanadi (31)
   - Birga sanaladi, alohida aytilmaydi (34)
   - Faqat sinfdoshlar soni yoziladi (31)
   - ✔ Sanaladi, lekin alohida aytiladi (32)
4. SQL'dagi `WHERE namuna = false` qatori nima qiladi? (7 so'z) (9)
   - Faqat sinfdoshlarni qoldiradi (29)
   - Kunlarni tartib bilan chiqaradi (31)
   - ✔ Namuna akkauntlarni sanamaydi (29)
   - Ism va loginni yashirib qo'yadi (31)
5. SQL'ga `GROUP BY kun` qo'shilsa, Neon nima ko'rsatadi? (8 so'z) (9)
   - Hamma kunlar uchun bitta son (28)
   - ✔ Har kun uchun alohida son (25)
   - Faqat bugungi kunning soni (26)
   - Eng ko'p ro'yxat bo'lgan kun (28)
6. Mentor tekshiruvining uchinchi savoli nimaga qaraydi? (6 so'z) (4)
   - 50 maqsadiga qancha qolganiga (29)
   - Sinfdoshlar soni qancha o'sganiga (33)
   - Lendingdagi tashriflar soniga (29)
   - ✔ Oldingi son yonida turganiga (28)
7. Hisobotda foydalanuvchilar haqida nima yoziladi? (5 so'z) (9, 10)
   - ✔ Faqat sonlar, ism va loginsiz (29)
   - Har bir odamning ismi va sanasi (31)
   - Sinfdoshlarning ismlari alohida (31)
   - Har birining logini va sanasi (29)
8. Bu voqeada Duolingo'ning asosiy qaytarish mexanikasi qaysi? (7 so'z) (6)
   - Seriya atrofidagi eslatmalar (28)
   - Seriya yonidagi «muzlatish» (27)
   - ✔ Ketma-ket kunlarning seriyasi (29)
   - Har kuni yangi so'z o'rganish (29)
9. Qaytganlar foizi nimani ko'rsatadi? (4 so'z) (6, 10)
   - ✔ Bir davrda ochganlardan nechtasi yana ochdi (43)
   - Haftada nechta yangi odam ro'yxatdan o'tdi (42)
   - Lendingga kelganlardan nechtasi tugmani bosdi (45)
   - Ro'yxatdan o'tganlardan nechtasi qo'shildi (42)
10. Zaxira rejada bir haftaga nechta ish yoziladi? (7 so'z) (8)
    - Har bo'g'inga bittadan ish (26)
    - Iloji boricha ko'proq ishlar (28)
    - Ish yo'q, gipotezaning o'zi (27)
    - ✔ Bitta bo'g'inga bitta ish (25)
11. Mentor zaxira reja uchun qaysi bo'g'inni tanladi? (7 so'z) (8)
    - Lending: tugmani kam bosishgan (30)
    - Ro'yxat: ochganlar o'tmagan (27)
    - ✔ Kanal: post ikki joyga yetgan (29)
    - Asosiy harakat: qo'shilish kam (30)
12. Lendingga 90 tashrif, tugma 6 marta bosildi. Qaysi bo'g'inda kam? (10 so'z) (8, 11)
    - Kanal: post odamlarga yetib bormagan (36)
    - ✔ Lending: kirganlar tugmani bosmadi (34)
    - Ro'yxat: ilovani ochganlar o'tmagan (35)
    - Asosiy harakat: o'yinga qo'shilmagan (36)
- Arena yozuvlari — platforma shabloni (namuna 6-Modul YAKUNIY 14-dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — hisobot · manba · qabul · tuzatish · bo'g'in · gipoteza · SQL · uyga vazifa banneri — hisobot · bo'g'in · bitta ish.
- Izoh (MD): 2 — 3-ekran testi nusxasi emas (qadamlar birligi — boshqa savol); 4, 5 — 9-ekrandan, kartochka 5, 8 bilan bir mavzu, boshqa shakl (S-021); 7 — xavfsizlik (sinf 14): B–D — shaxsiy ma'lumot (ism, login), hisobotga yozilmaydi; tashqi xizmat haqida da'vo yo'q (sinf 8); 8 — bank so'zi: asosiy — ketma-ket kunlar, eslatmalar va «muzlatish» — atrofida; D — mahsulot mazmuni, mexanika emas; 9 — B, C, D — boshqa sonlar (yangi odam, lending, qo'shilish);
  12 — ikkinchi misol (P-002), sonlar faqat savolda, kalitda yo'q (S-019).

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/10-Modull/PmUsersCheckLesson.jsx` — skeletdan. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s8 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s7/s12 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s6 `QVoqea` · s9 `QKod` (Neon varianti — 10-Modul `m8-01` naqshi, PM_DARS_ETALON 26) · s10/s11 `QMustaqil` · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`; palitra `qolipRang('pm')`.
2. **`HisobotVaraq`** — bitta vizual (180): holatlar `qoralama · toladi · toliq · tekshiruv · ixcham · oquvchi`; qator holatlari (yalang'och/joriy/to'liq/sanalmagan/tuzatish/xato); muhr (`Qabul` / `Tuzatish topilmadi` / `Tuzatish: …`); pastki qatorlar (qadamlar, lending); zaxira bloki (11-ekran).
   Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. Qolip-maket izohi faylda e'lon qilinadi. Ichida **`JamoaTelefon`** (0, 8-ekran; 11-Modul ko'rinishi, ≈170×272; 8-ekranda «O'yin» ekrani + «Havolani ulashish» tugmasi).
3. **`MENTOR_HISOBOT`** — `{ nom, qatorlar: [{ id, nom, son, birlik, manba, sana, izoh, oldin }] × 4, qadamlar: [{ nom, son }] × 4, eslatmadanOchdi: 9 (qadamlar ichida emas — alohida yozuv, ekranda «eslatmadan ochdi»), tuzatishdanKeyin: { ochdi: 15, royxat: 11 }, lending: { tashrif: 74, bosish: 41 } }` (A-6 aynan). **`TEKSHIRUV_SAVOLLAR`** — 3 × `{ savol, qarang, dalil }` (4 va 11-ekran — bitta manba, P-063).
   **`BOGINLAR`** — 4 × `{ id: 'kanal' | 'lending' | 'royxat' | 'asosiy', nom, mentor: { matn, birlik } }` (8 va 11-ekran). **`MENTOR_ZAXIRA`** — `{ boginda: 'kanal', sabab, gipoteza, ish }` (1.10 aynan).
4. s0: `QKirish` — javoblar «Aynan!» / «Qiziq fikr!», ballsiz (`correct: false` hammaga — J-026); `HookMaket` = `JamoaTelefon` + chat pufagi; tanlovda javob pufak bo'lib tushadi, varaq-skelet («38» + uch bo'sh qator).
5. s2: `QBashorat` → qator bosish; `ManbaMaketlar` (Neon · sanoq sahifasi · Umami — chizilgan, logotipsiz); yorliq uchishi (bitta `transform`); 4/4 dan so'ng pastki qatorlar navbat bilan; yorliq «metrika hisoboti» + `QIzoh` + `QTaxmin` + xulosa bitta natija blokida (SABOQ 25); 40 s ipucha.
6. s4: `QBashorat` → savol kartasi (tugmasiz) + varaqdagi bosiladigan dalil joylari (`// qolip-maket: hv-dalil`); noto'g'ri bosish — silkinish + `QXato`; muhr animatsiyasi; nishon `evidenceFinder` (birinchi urinish ×3).
7. s6: `K5_KADR` 3 × `{ h — kadr nomi, m — Mentor gapi }` (SABOQ 8); `DuolingoSahna` — telefon: olov belgisi (SVG, raqamsiz) + hafta kataklari «Du…Ya» → qulf ekrani eslatma kartochkasi (matnsiz qatorlar) + qor parchasi belgisi va «muzlatish» yozuvi → telefon chapga, `HisobotVaraq` 4-qatori o'ngda;
   bashorat 1/3 da (ballsiz, ixcham qator, `QTaxmin`); tugma «Voqea davomi (N/3)»; manba izohi faylda. «Duolingo» — `Brend` komponenti, o'z rangida.
8. s8: `BoginKartalar` (4 karta, ochilish → Mentor sonlari sanab o'sadi) · «Shu yerda kam» tanlov (ballsiz) · reja kartasi uch qator (uchib yoziladi) · `JamoaTelefon` bo'lagi «Havolani ulashish»; `QTaxmin` («Tanlovingiz: … · Mentor tanlovi: kanal»).
9. s9: Neon varianti — `NeonMaket` (chizilgan; 10-Modul 1-dars bilan bitta naqsh), darvoza (uch ustun), SQL bo'sh joy bilan (nusxasiz), kunlar formasi (`kun` — `date`, `soni` — `/^\d+$/`, takror kun tekshiruvi, «+ Qator»), «Jami» sanagich, «Bajardim» qulfi (`ScreenLivePractice` naqshi);
   `pm-m10d10-hisobot.kunlar`, `royxat.soni`, `royxat.manba = 'Database'` — faqat «Bajardim»da (aks holda yozilmaydi); web-trek qatori (`pm-m9d8-platforma.trek`); nishon `sqlCounter`; `koding: -1`, `PRACTICE_BASE+screen`.
10. s10 artefakt: `localStorage` `pm-m10d10-hisobot` = `{ royxat: { soni, sinfdosh, manba, sana, oldin }, asosiy: { soni, manba, sana, oldin }, bosh: { nima, soni, manba, sana }, qaytgan: { birinchi, keyingi, foiz, davr, manba, sana } | null, kunlar, tekshiruv, tuzatishQator, zaxira: { boginda, dalil, gipoteza, ish } | null, savedAt }`
    (tayanch 8, 9.42 c; `oldin` — `{ soni, sana }` | `'birinchi'` | `null`, 11-ekran 3-savoli uchun; `manba` — o'quvchi tanlagan haqiqiy yo'l; «Hali sanalmagan» → `soni: null`, `qaytgan: null`). O'qiydi: `pm-m10d7-reja` (`royxat`, `sinfdosh`, `asosiy`, `sana`), `pm-m10d8-qadamlar` (`qadamlar[].nom`), `pm-m9d5-prd.boshRaqam`, `pm-m9d4-final.goya`, `pm-m9d8-platforma.trek`.
    Dars ichida (ccProgress): `pastki` (`{ qadamlar: [son], lending: { tashrif, bosish }, eslatmadanOchdi }`). O'qiydi qo'shimcha: `pm-m10d8-qadamlar.chiqarildi`, `.chiqarildiVaqt` (11-ekran Yordami). Tekshiruvlar — yuqoridagi ro'yxat (PM-032 — ≥8 namuna sinovi «qur» da). Ketma-ket karta (SABOQ 29); ✎; nishon `reportReady`; artefakt-strip «Hisobot».
11. s11: juftlik/yakka (`LiveGate` rejimi) — `TEKSHIRUV_SAVOLLAR`; «Yo'q — tuzataman» → s10 kartasi qayta ishlatiladi; «Uyda tuzataman»; muhr; `tekshiruv` yoziladi; zaxira qismi sharti — `royxat.soni == null || royxat.soni < 50` (≥ 50 — «Baribir bitta ish yozaman»);
    `BOGINLAR` yorliqlari ostida o'quvchi sonlari (`pastki`, `royxat`, `asosiy`, `pm-m10d6-kanallar.kanallar[].nom`); `XAVFSIZLIK` — 6-dars bilan bitta manba (tayanch 9.42 f: 06-FILTR dan keyingi matn bilan); `zaxira` yoziladi; `optionalLive`; nishon `reportChecked`; Mentor statistikasi.
12. Testlar s3/s5/s7/s12 — `correctIdx` 2/0/3/1 = `INLINE_KEYS`; `RECAPS` 3/5/7/12 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6). Kichik vizual — `QuestionScreen` `vizual`, javob topilgach (SABOQ 4). Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
13. `ACHIEVEMENTS` 4 (`evidenceFinder`, `sqlCounter`, `reportReady`, `reportChecked`); s15 `RECAP` 5 band = yakundagi «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» — ScoreRing ostida (P-013); yakun sarlavhasi — `pm-m10d10-hisobot` (qatorlar, `tekshiruv`, `zaxira`, `royxat.soni`) dan, 5 holat; `HW_TOKENS` — faqat so'z.
14. Uyga vazifa — yangi `HwCard` («Kim uchun · Nechta · Muddat», 3 band, ① ichida ≥ 50 holati gapi); alohida `.homework.jsx` yo'q.
15. App.jsx: `m10-10` qatoriga `comp: PmUsersCheckLesson` + import — asosiy seans (bu agent tegmaydi). Nom «50 foydalanuvchiga yetdingizmi?» va osti «Mentor tekshiruvi: metrika hisoboti va zaxira reja» — App.jsx 407-qatori bilan bir (06.10 o'qildi).
16. **REPO (Mentor misoli, «qur» da, buyruq bilan):** `maydon-jamoa` → e'lon berilgach «Havolani ulashish» tugmasi — lending manzilini `?kanal=ilova` belgisi bilan ulashadi (tayanch 9.42 e; ulashish usuli — React Native yoki Expo rasmiy hujjatidan, «qur» da tanlanadi va jurnalga yoziladi), teg `m12-dars-10-done` (tayanch 3; 12-dars jonli demosi shu tegdan).
    Mentor sonlari uchun SQL lar (qaytganlar foizi — kesishma; tuzatishdan keyin birinchi marta ochganlar) «qur» da Mentor Database'ida yuritilib, natija jurnalga yoziladi. Darsning o'zi repo'ga yozmaydi.
- Darvozalar: `npm run gates -- src/10-Modull/PmUsersCheckLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).
  ⚠️ SQL va Yordam promptlari ichidagi backtik — kod belgisi sifatida, template-satr ichida emas (CLAUDE.md tuzog'i).

## Manbalar (o'zim tekshirgan rasmiy sahifalar, 06.10.2026)
- neon.com/docs/get-started/query-with-neon-sql-editor (06.10, WebFetch xulosasi orqali o'qildi — so'zma-so'z iqtibos emas): yo'l «Postgres database» > «SQL Editor»; so'rov tugmasi — «Run»; bir nechta so'rov — har biriga alohida natija; «Save», «History» — o'quvchi matnida ishlatilmadi.
  O'quvchi matnida faqat «SQL Editor» va «Run» (tayanch 6 — 11-Modul fakti bilan bir).
- postgresql.org/docs/current/datatype-datetime.html (06.10, WebFetch orqali) — «When a timestamp with time zone value is output, it is always converted from UTC to the current timezone zone, and displayed as local time in that zone»; boshqa mintaqa uchun `AT TIME ZONE`.
  Xulosa: `date(yaratilgan)` kunni sessiya vaqt mintaqasi bo'yicha oladi (`yaratilgan` — `timestamptz` bo'lsa) — 9-ekran O'qituvchi eslatmasi.
- Neon'ning sukutdagi vaqt mintaqasi — rasmiy Neon hujjatida topilmadi (06.10, qidiruv); faqat jamoa forumi sahifasi (ochilmadi, 522) — Shubhali joylar.
- Tayanch 6 (06.10, asosiy seans): Neon SQL Editor — «Run» (11-Modul tayanchi 6) · tayanch 9.5, 9.23 — SQL matnlari · `PM_Prompt_v8.md` K5 (193-qator) — bank asli.

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
**10-FILTR (F-1006-364) dan keyingi holat — hammasi tayanch 9.42 ga yozildi:**
1. ✅ **Mentor hisobotining 4-qatori** — 37% (17 / 46), «5 kun keyin», Database: tasdiq (tayanch 9.41 a). Ikki son va davr o'quvchi kalitida ham saqlanadi (10-FILTR 3).
2. ✅ **«Oldin» qatori** (27 va 13 — 3 kun keyin) — tasdiq va kerak; birinchi marta sanalgan qatorda — «birinchi o'lchov».
3. ✅ **Mentor sanalari nisbiy** — tasdiq; o'quvchida haqiqiy sana.
4. 🔁 **Uchinchi savol** — «O'sish bormi?» **rad etildi** (savolga «yo'q» javobi tuzatish bo'lmasa — savol noto'g'ri qo'yilgan): endi **«Oldingi son bormi?»** — solishtirsa bo'lishi tekshiriladi; o'sish yo'qligi — zaxira reja sababi (tayanch 1.10, 9.42 a).
5. ✅ **Mentor kunlar bo'yicha qatorlari yo'q** — kerak emas, to'qilmaydi; 12-dars grafigi haftalik.
6. ✅ **Ekran tartibi** — tasdiq (11-ekran vaqti — pilotda).
7. ✅ **Qo'shimcha o'qiladigan kalitlar** — tasdiq; + `pm-m10d8-qadamlar.chiqarildi`, `.chiqarildiVaqt` (11-ekran Yordami).
8. 🔁 **Kalit maydonlari** — `royxat.oldin`, `asosiy.oldin`, `qaytgan.birinchi / keyingi / davr`, `zaxira.dalil` kalitga kirdi (tayanch 8); qadamlar, lending va «eslatmadan ochdi» — dars ichida (11 va 12-darslar o'qimaydi).
9. ✅ **`zaxira.boginda` qiymatlari** — tasdiq; ekrandagi qaror «eng kam» emas — dalil bilan.
10. 🔁 **«bo'g'in» izohi** — «Bu darsda bo'g'in — odam postdan asosiy harakatgacha o'tadigan yo'lning alohida joyi.» (auditor so'zi «foydalanuvchi yo'lidagi joy» olinmadi: «foydalanuvchi yo'li» — qadamlarning ta'rifi, tayanch 2).
11. ✅ **50 ga yetganlar** — zaxira reja shart emas; uyga vazifa ① ham ularga ixtiyoriy.
12. ✅ **Qaytganlar foizini sanash** — agent `SELECT` yozadi, shart — kesishma (faqat birinchi davr qurilmalari ichidan); «Hali sanalmagan» — halol yo'l.
13. ✅ **Web-trek** — vaqt ustuni bo'lmasa kunlarga bo'linmaydi, jami halol yoziladi.
14. ✅ **Ikkinchi misollar, nishon nomlari, hook javoblari** — tasdiq («Qiziq fikr!» — qonun).
15. ✅ **Duolingo sahnasi** — tasdiq; bankdan tashqari fakt yo'q.
16. ✅ **Bosh raqamni sanash** — agent faqat `SELECT` yozadi; nimani sanashni o'quvchi aytadi.
17. ✅ **`XAVFSIZLIK`** — 6-dars bilan bitta manba, 06-FILTR dan keyingi matn (tayanch 9.38 d, 9.42 f); fayl joyi — «qur» da.
18. ✅ **Uyga vazifadagi Mentor tegi** — qoladi, «majburiy emas» deb.

## Shubhali joylar (ishonchim komil emas)
- **Neon vaqt mintaqasi:** sukutdagi qiymat (odatda UTC deyiladi) rasmiy Neon hujjatida topilmadi; `yaratilgan` turi (`timestamptz` yoki `timestamp`) Mentor repo'sida tekshirilmagan (7-dars A1 hali qurilmagan). Toshkent bo'yicha kun chegarasi siljishi mumkin — 9-ekran O'qituvchi eslatmasida, o'quvchi matnida yo'q.
- ✅ tayanch 9.23 tuzatildi (`holat IN ('qoshildi', 'keladi')`, ta'rif «hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan») — **9.23 SQL va `chiqdi` holati:** `i.holat IN ('qoshildi', 'keladi')` — `chiqdi` ni ham «qo'shilgan» sanaydi; 11-Modul 9.93 bo'yicha navbatdagi o'yinchi ham «O'yindan chiqish» bilan `chiqdi` bo'ladi — hech qachon qo'shilmagan odam asosiy harakatga kirib qolishi mumkin. Tayanch so'zi bilan yozdim, o'zgartirmadim.
- ✅ **37%** — tayanch 9.41 a ga kirdi.
- ✅ **Sanoq sahifasidagi «ro'yxatdan o'tgan»** — 8-dars MD si (A1 talabi): «`oyinchilar` dagi `namuna = false` akkauntlar soni» — Database soni bilan bir o'lchov; shuning uchun «sanoq sahifasi» — 1-qator uchun halol manba (10-FILTR 4).
- **Qaytganlar foizi uchun agent so'rovi** — davrlar va qurilmalar bo'yicha `SELECT` (kesishma sharti bilan) o'quvchiga murakkab; 12 daqiqaga ulgurilmasligi mumkin — «Hali sanalmagan» yo'li shu uchun. Agent yozgan so'rov to'g'riligini o'quvchi faqat «ikkinchi son birinchisidan katta emas» bilan tekshira oladi.
- **Tuzatishdan keyingi sonlar (15 · 11)** — Mentor misolida arifmetika mos (61 − 46, 38 − 27), lekin «ro'yxatdan o'tgan 11» ning hammasi yangi 15 qurilmadan ekani — Mentor Database'ida «qur» da tekshiriladi. 8-darsdagi sanoq `?dan=` yo'li bu sonni bermaydi: u shu vaqtdan keyingi **yozuvlarni** sanaydi, qaytgan eski qurilmalar ham kiradi — shuning uchun 10-dars `?dan=` dan foydalanmaydi (tayanch 9.42 g).
- **«Havolani ulashish» qanday ulashadi** — manzil va kanal belgisi tayanchda (9.42 e), usuli — «qur» da.
- **Sinfdosh soni** (9.6, 9.39 e) — ixtiyoriy; sinfda hech kim majburlanmaydi.
- **«bo'g'in» so'zi** (T-070) — maktab grammatikasidagi «bo'g'in» bilan aralashishi mumkin; tayanch so'zi bo'lgani uchun qoldirdim, kartalar ustidagi izoh bilan.
- ⛔ **90 daqiqa** — 9 → 10 → 11-ekranlar (12 + 12 + 16) pilotda taymer bilan («qur» darvozasi, tayanch 9.42 h); 11-ekranga majburiy dalil qatori qo'shildi — vaqtni oshirishi mumkin.
- **Duolingo «o'z rangi»** — rasmiy rang manbasi tekshirilmadi; quruvchi 7-Modul `PmLesson21` dagi sahna bilan bir xil qiladi.
- ✅ bank so'zi bo'yicha «qo'rquv» ga almashtirildi (tayanch 5 ham) — **Bank so'zi «xavotir»** — ruscha aslida «qo'rquv» ma'nosidagi so'z (6-ekran Manba qatori); tayanch 5 tarjimasi «xavotir» — tayanch so'zi bilan yozdim, o'zim kuchaytirmadim ham, yumshatmadim ham. Auditor so'rasa — tayanch qarori.
- **«Muzlatish» kadri** — bankda faqat so'z; sahnada belgi va yozuv, ishlashi ko'rsatilmaydi. O'quvchi so'rasa, javob O'qituvchi eslatmasida.
- **Mentor teg `m12-dars-10-done`** hozir yo'q («qur» da yoziladi).

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 14 band)
1. [x] **Yakun holatga qarab** — 15-ekran: besh sarlavha (hammasi · tuzatish qoldi · zaxira reja qoldi · tekshiruv qoldi · hisobot boshlandi); ✓ va nishon faqat birinchisida; sarlavha o'quvchi ishini aytadi, son va Mentor natijasini emas; 10, 11-ekran xulosalari ham holatga qarab.
2. [x] **Da'vo isbot emas** — (a) «Bizda to'rt son…» (2), «Bizda zaxira reja uch qator…» (8, kartochka 1, 11, yakun) — kurs qolipi; (b) «Mentor misolida», «Mentor tanlovi — fikr, yagona javob emas» (8 O'qituvchi eslatmasi, 10 Yordam), «Bu misolda 38 / 50 — qabul» (4);
   (c) «odatda bir xil» (9), «bo'lishi mumkin» (2 O'qituvchi), «o'sish bo'lmasa ham halol yozing» (15 ③); (d) «Bir hafta — kam vaqt» (15 ③), bitta Mentor tanlovi umumiy qoida qilinmagan (8).
3. [x] **Maxfiy qiymat chiqmaydi** — SQL faqat son, `SELECT *` yo'q (9 Yordam); hisobotda ism va login yo'q (arena 7); agentga faqat jadval nomi savoli va «faqat son» so'rovlari (9, 10 Yordam); sanoq sahifasi kaliti agentga berilmaydi (10 Yordam 5 — «kalit bilan oching», kalit yozilmaydi); hisobotda ism/login yo'q.
4. [x] **Tashqi xizmat — faqat rasmiy hujjat** — Neon «SQL Editor», «Run» (Manbalar, tayanch 6); vaqt mintaqasi — PostgreSQL hujjati; Neon sukuti tekshirilmagan — Shubhali joylar, o'quvchi matnida yo'q. Umami — faqat «lending sonlari» (yangi UI nomi yo'q).
5. [x] **Har sonning manbasi va o'lchovi** — Mentor sonlari «Mentor misolida», har biri manba, sana va birlik bilan (A-6, 2-ekran); hisob · qurilma · tashrif · bosish · o'yin — yorliqda; ayirilmaydi (3-ekran, 8 O'qituvchi eslatmasi, yakun 3);
   37% — ikki soni va davri bilan (kalitda ham); 15 dan 11 — «kam son: farq bor, isbot emas»; bo'g'inlar son bo'yicha saralanmaydi; «Bir hafta — kam vaqt» (N kichik).
6. [x] **Tayanchda yo'q narsa to'qilmadi** — hisobot, tekshiruv uch savoli, zaxira reja, SQL lar, K5 so'zlari, brend izohi — aynan; o'zim qaror qilganlar (37%, «oldin» qatori, nisbiy sanalar, ekran tartibi, «bo'g'in» izohi, ikkinchi misollar, sahna chizmalari, kalit maydonlari) — TAYANCHGA SAVOL 1–18, 10-FILTR dan keyin tayanch 9.42 da.
7. [x] **Saqlash kaliti — o'qiydigan darsning ehtiyojidan** — `pm-m10d10-hisobot` tayanch 8 aynan (11, 12-darslar: son, manba va sana, `kunlar`; `oldin`, `qaytgan` ning ikki soni va davri, `zaxira.dalil` — 10-FILTR 3 dan keyin); manba — haqiqiy yo'l (9-ekran bajarilmasa `'Database'` yozilmaydi); `tekshiruv` uch qiymat; «Hali sanalmagan» → `null` (ish fakti va natija ajratilgan);
   o'qiydigan kalit yo'q bo'lsa — o'quvchi o'zi yozadi (10-ekran placeholderlar, «Oldingi son va sanasi» maydoni).
8. [x] **Test: bitta himoyalanadigan javob** — s3 (A teng, B ayirish, D «aniqroq»), s5 (B, D — kattalik, C — yaqinlik), s7 (A–C boshqa sonlar), s12 (A soxta, C namuna, D bitta ish qoidasi); «Hech qayerda» tipi yo'q; ✔ yolg'iz eng uzun emas (O'lchov);
   son savolda — kalitda takrorlanmaydi (s3, s5, arena 12); tashqi xizmat haqida yolg'on distraktor yo'q (arena 7 — 06.10 qayta yozildi: «Neon faqat son ko'rsata oladi» kabi variantlar olib tashlandi); arena 8 — bank so'zi bo'yicha.
9. [x] **Keys: bank so'zi aynan** — 6-ekran 2/3 bank matni so'zma-so'z, 1/3 va 3/3 — bank va tayanch ko'prigi; brend izohi tayanch 5; ko'prik «Bu voqeada …» (xulosa, 3/3); natija, son va «muzlatish» mexanikasi qo'shilmagan; bosim usuli tavsiya qilinmaydi (3/3 kulrang qator).
10. [~] **90 daqiqa** — A-bo'limda taqsimot (reja, pilotda o'lchanadi); 9-ekran «Vaqt tugasa …» va O'qituvchi eslatmasi; 10-ekran «Hali sanalmagan» va `optionalLive`; 11-ekran «Uyda tuzataman», zaxira — yakun holati; tashqi kutish yo'q (agent bloki yo'q); yakun holatga qarab.
11. [x] **Bir ma'no — bir so'z** — A-5: «hodisa» o'quvchi matnida deyarli yo'q (`eslatmadan-ochdi` — sanoq yozuvi), «qadam» — faqat foydalanuvchi yo'li, «bosqich» — faqat «rejaning 3-bosqichi», «ish» — zaxira rejadagi, «bo'g'in» — zaxira rejadagi joy,
    «qabul / tuzatish» — tekshiruv, «tasdiq» — faqat qadam nomi, «e'lon» — o'yin, «sinov» — yo'q, «push» — faqat `git push` (uyga vazifa ①).
12. [x] **Web-trek teng yo'l** — 9-ekran web-trek qatori (jadval, vaqt ustuni yo'q bo'lsa — jami); 10-ekran birligi «brauzer»; 11-ekran «O'rnatish va ro'yxat» web izohi; 7-ekran savolida «eslatma» yo'q; 5, 12-ekran — ikkala trek; uyga vazifa ① — APK faqat mobil trekda.
13. [x] **Agent va o'quvchi ishi ajratilgan** — SQL ni o'quvchi o'zi yozadi (9); qaysi bo'g'in, gipoteza, ish — o'quvchi qarori (11); agentga faqat «`SELECT` yoz, o'zing ishga tushirma, jadvallarni o'zgartirma» (10 Yordam) — natijani o'quvchi Neon'da ko'radi; `DELETE` yo'q; tekshiruv yozuvi yaratilmaydi.
14. [x] **O'smir xavfsizligi** — shaxsiy ma'lumot ekranga chiqmaydi (9-ekran, arena 7); sonlar sinfga e'lon qilinmaydi (0, 10, 11 eslatmalari); soxta akkaunt, qayta ro'yxatdan o'tish, sovg'a — yo'q (11, 12, takrorlash 12); post — 6-darsdagi olti band (11, uyga vazifa ②); namuna akkauntlar sanalmaydi (9.5).

## O'lchov (`scratchpad/md10/olchov.py` natijasi — har o'lchangan matn yonida qavsda; jadval skript chiqishidan)
| Nima | Soni | Eng qisqa | Eng uzun | Chegara |
|---|---|---|---|---|
| Sarlavha (0–2, 4, 6, 8–11, 14, 15 ×5) | 15 | 25 | 54 | ≤55 |
| Hook variantlari (0) | 3 | 36 | 41 | hisobot |
| Hook javobi («Aynan!» · «Qiziq fikr!» ×2, so'z bilan birga) | 3 | 81 | 89 | ≤120 |
| Xulosa (2, 4, 6, 8, 10 ×2, 11 ×3) | 9 | 45 | 109 | ≤110 |
| To'g'ri izohi (3, 5, 7, 12) | 4 | 55 | 60 | ≤60 |
| 10-FILTR dan keyin qayta sanalgan (`olchov10.py`): s7 B izohi 59 · s12 ✔ 41, to'g'ri izohi 55, D izohi 57 · 11-ekran dalil `QXato` 56 · «Endi siz bilasiz» 2 — 85 | — | — | — | chegarada |
| Xato izohi va `QXato` (3, 4, 5, 7, 9, 10, 11, 12) | 37 | 31 | 60 | ≤60 |
| `QIzoh` va yashil yakun (2, 4, 8, 9 ×2) | 5 | 70 | 102 | hisobot |
| Bashorat variantlari (2, 4, 6) | 9 | 5 | 29 | hisobot |
| Endi siz bilasiz (15) | 5 | 56 | 109 | hisobot |
| Test variantlari — s3 | 4 | 48 | 49 | farq 2%, ✔ 49 |
| Test variantlari — s5 | 4 | 31 | 32 | farq 3%, ✔ 32 |
| Test variantlari — s7 | 4 | 36 | 39 | farq 8%, ✔ 38 |
| Test variantlari — s12 | 4 | 41 | 44 | farq 7%, ✔ 41 |
| Arena 1–12 (har savolda farq; eng kattasi — 6-savol) | 48 | 25 | 45 | har savolda farq ≤14%; ✔ yolg'iz eng uzun — 0 ta |
| Test savoli (so'z) — s3, s5, s7, s12 | 4 | 7 | 12 | ≤12 so'z |
| Arena savoli (so'z) | 12 | 4 | 10 | ≤12 so'z |

Arena ✔ taqsimoti: A — 2, 7, 9 · B — 1, 5, 12 · C — 4, 8, 11 · D — 3, 6, 10 (3/3/3/3). Ekran testlari: s3 C · s5 A · s7 D · s12 B.

Mentor gaplari: 0, 2, 4, 8, 9, 10, 11 (va uning yakka, zaxira variantlari) — bitta gap (interaktiv); 1 — ikki gap; 6 — har kadrda ko'pi bilan ikki gap (3/3 — bitta). «Bu…», «Hammasini…» bilan boshlanmaydi; sarlavhani takrorlamaydi (qo'lda tekshirildi).
`{qator}` li 11-ekran xulosasi — eng uzuni 61; `{k}` li 10-ekran xulosasi — 80. 9-ekran O'qituvchi eslatmasi va Yordam — o'lchanmaydi (o'quvchi yuzasida qisqa qatorlar o'lchangan).
`npm run lint:til` — 0 error, 1 warn — «kirill-lotin-matnda»: 6-ekran Manba qatoridagi bank asli (ruscha iqtibos, o'quvchi ko'rmaydi), ataylab qoldirildi (06.10, yakuniy faylda yurgizildi).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 406–408 (06.10 o'qildi, `00-NOMLAR.md` bilan bir) — `m10-09` «Loyiha kuni: foydalanuvchini qaytaradigan eslatma» → **`m10-10` «50 foydalanuvchiga yetdingizmi?»** (osti «Mentor tekshiruvi: metrika hisoboti va zaxira reja» — reja chap qatori so'zma-so'z) → `m10-11` «Raqamlaringiz pitchni qanday o'zgartiradi?» (yakun qatori).
  App.jsx ga yozilmadi — faqat o'qildi (`m10-10` — `type: 'PM'`, `comp` hali yo'q).
- [x] Bitta misol-ip: «Maydon Jamoa» hisoboti (1.10, 1.13 aynan); metafora yo'q; bitta vizual — `HisobotVaraq` (qoralama · to'liq · tekshiruv · ixcham · o'quvchi) + kontekst maketlari (manbalar, bo'g'in kartalari, Neon, telefon). Ikkinchi misol faqat testda (5-ekran, arena 12 — P-002). Duolingo — keys sahnasi.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 8 (QTushuncha) + 0, 6, 9, 10, 11; testlarda javobdan keyingi kichik vizual. «bosish va matn-karta» naqshi yo'q — har bosish varaqni, bo'g'in kartalarini, telefonni yoki Neon maketini o'zgartiradi.
- [x] O'lchov (skript): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktiv ekranlarda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 · to'g'ri izoh ≤60 — jadval yuqorida.
- [x] Atamalar: ro'yxatdan o'tgan, asosiy harakat (9.23 so'zi), namuna, sinfdosh (7-dars), qadamlar, sanoq sahifasi (8-dars), qaytganlar foizi (7-Modul ta'rifi so'zma-so'z), Mentor tekshiruvi (11-Modul), gipoteza (10-Modul), Neon «Run» (11-Modul) — so'zma-so'z;
  yangi «metrika hisoboti», «zaxira reja» — misoldan keyin; siz-forma; tugmalar ot-shaklda yoki siz-formada («Saqlash», «Davom etish», «Shu yerda kam», «Yo'q — tuzataman», «Hali sanalmagan»); agentga prompt — T-002 istisnosi (agentga buyruq).
- [x] Testlar: 4 variant, uzunlik teng (O'lchov jadvali, farq ≤15%); to'g'ri javob hech qayerda yolg'iz eng uzun emas; kalit so'z / ikki nuqta faqat to'g'rida emas (s3 — ikki nuqta A, C, D; s5 — «chunki» to'rttasida, Qabul/Tuzatish 2/2; s7 — «foiz» C, D; s12 — «bo'g'in» B, D).
  Arena 12 — farq ≤15%, ✔ A3 B3 C3 D3. Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno; olov va qor parchasi — chizilgan belgi) · kafolat so'zlari yo'q («darrov», «darhol», «har doim», «100%», «albatta» — grep 0; «odatda», «mumkin», «bu misolda», «bu voqeada» bilan chegaralangan).
- [x] Ichki kodlar yo'q (o'quvchi matnida `m10-NN`, «Modul 12», K5, A1 yo'q; modul raqami LMS raqamida — «11-Modul», «10-Modul», «7-Modul»). Keys — faqat bank matni, manba qatori bilan. «KOD» ro'yxati 16 band. Manbalar — havola va sana bilan.
- [x] Karta T · P · S · PM: T-002 (agent prompti — buyruq shaklida, istisno) · T-008 (hook javoblari, Mentor gaplari — olam ichida) · T-011/PM-030 (atamalar misoldan keyin, sarlavhada 2-ekrandan oldin yo'q) · T-014/T-015 (A-5) · T-016 (metafora yo'q) · T-020 (kafolat yo'q) ·
  T-029 (Mentor «Bu…» bilan boshlanmaydi, ekrandagini ta'riflamaydi) · T-035 (strelka matnda yo'q — bo'g'in kartalari orasida chiziq) · T-038 (keyingi dars faqat yakun qatorida; «keyingi darsgacha» — muddat) · T-039 · T-042 (ta'riflar 2, 8, kartochka, yakun) · T-043 («bu misolda») ·
  T-047/T-048 · T-052 (11-Modul ko'prigi 4-ekranda) · T-064 (2-ekran 0-ekran savoliga javob) · T-070 (Shubhali: «bo'g'in») · P-001 · P-002 · P-008 (11-ekran — shartli ikkinchi topshiriq) · P-013 · P-014/P-015 · P-016 (hook javoblari teng, dalil ekranda) ·
  P-025 (uyga vazifa karta) · P-026/P-028 (Neon nomlari hujjatdan, xato yo'li) · P-033 · P-036 (0, 1, 8-ekranlarda yorliqlar oldindan aytilmaydi) · P-046 (10, 11, 15 — o'quvchi ma'lumotidan) · P-052 · P-053 (keys sahnasi, `pre` kadr) · P-062 · P-063 (`TEKSHIRUV_SAVOLLAR`, `BOGINLAR`) · P-064 · P-067 ·
  S-001 (savollar ≤12 so'z) · S-002/S-004 · S-006 (s5 Qabul/Tuzatish 2/2) · S-009 · S-010 (xato izohlari javobni aytmaydi) · S-015 · S-018 (Duolingo izohi) · S-019 · S-020 (`GROUP BY`, `namuna` — 9-ekranda tushuntirilgan) · S-021 · S-026 · S-027 · S-034 ·
  PM-005 (2-tur) · PM-017 · PM-018 (Duolingo — faqat bank; ichki qaror da'vo qilinmaydi) · PM-020 (`{qator}`, `{k}` qolip-gaplari o'qib tekshirildi) · PM-021 · PM-028/029 · J-026 · SABOQ 1–31 (A-bo'limda va har ekranda).
