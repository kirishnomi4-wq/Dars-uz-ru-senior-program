# 14-Modul (kod: `src/12-Modull`) · 11-dars (PM) «Qaysi xalqaro dasturga ariza berasiz?» — MD v3

Fayl: `src/12-Modull/PmProgramsLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m12-11` · **12 ekran** (keyssiz PM — tayanch 4, «PM 12» shakli) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
⚠️ **TAXMIN:** Qaror-0 javobi hali yo'q — `<!-- TAXMIN Tn -->` belgili qatorlar tavsiya (A) variantga tayanadi (ro'yxat — oxirida «TAXMIN belgilari»). Javob boshqacha bo'lsa, aynan shu qatorlar tuzatiladi. Asosiysi — **T14** (Diamond Challenge asosiy, Y Combinator «bugungi yo'l emas», lokal tanlovlar nomsiz).
Pilot qoidalari (9-Modul SABOQ 1–18, 10-Modul SABOQ 19–31, 11-Modul SABOQ D 32–39, **12-Modul SABOQ E 40–55** — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (har variantning o'z chegarasi — E 40; bitta navbatdagi tugma — halqa) · bashorat tanlangach yopilmaydi — natija yashil xulosa qutisining birinchi kichik qatori (E 42) ·
ko'p maydonli ish — bittadan karta (E 53) · yorliq input ichida (E 43) · ekranda ≤ 3 blok · maketda hech narsa kesilmaydi (E 41) · odamlar roli bilan, ismsiz · yakun — E 50 standarti · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 5-ekran — **D** (`3`) · 8-ekran — **A** (`0`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 476–478, grep 08.10.2026, DE-205): `m12-10` «Birinchi buyurtmani qayerdan topasiz?» → **`m12-11` «Qaysi xalqaro dasturga ariza berasiz?»** (osti «Diamond Challenge, Y Combinator: shartlar va ariza», `type: 'PM'`, `comp` hali yo'q) → `m12-12` «Keyingi olti oyda nima qilasiz?». <!-- TAXMIN T20 -->
Tur (PM-005): **2-tur sof PM** — artefakt yozma: o'quvchining **ariza qoralamasi** (dastur · jamoa · maslahatchi · konsept: muammo, kim uchun, yechim); mustaqil ish majburiy (7-ekran). **Keyssiz** (tayanch 5). **Kod ekrani yo'q, REPO yo'q** (tayanch 3: `m14-dars-11-done` = `-start`).
⚠️ **Bu darsning qat'iy chegarasi (TAQIQLAR 1, 3; sinf 9, 17, 18):** dastur haqida faqat **rasmiy sahifadagi** shart (havolasi va sanasi «Manbalar»da) · kafolat yo'q — «qabul qilinasiz», «finalga chiqasiz» deyilmaydi ·
bugun hech qayerga hech narsa yuborilmaydi: ro'yxat va ariza — **uyda, maslahatchi va ota-ona bilan** · O'zbekistondagi tanlovlar — **nomsiz** («Mentordan so'rang») · pul so'ralmaydi, sovrin aytilmaydi · jamoa a'zosi va maslahatchining ismi hech qayerda (forma, kalit) yozilmaydi.
⚠️ Modul raqami o'quvchi matnida — LMS raqami; kod raqami (`m12-11`, `src/12-Modull`) faqat fayl yo'lida. Dars raqami o'quvchi matnida yo'q. Demo Day, keyingi dars mazmuni — o'quvchi matnida va'da qilinmaydi (T-038, tayanch 9.13).
Manba: `00-MODUL-TAYANCH.md` (**1.11 — Diamond Challenge, YC, lokal grantlar, kafolat yo'q, kalit — AYNAN** · 1.0 · 1.1 — Mentor pitchi · 1.12 — Mentor misolida «Diamond Challenge'ga jamoa bilan konsept» · 1.14 · 2 — «xalqaro dastur · ariza · maslahatchi» · 3 · 4 · 6 · 7 — 18 sinf · 8 — `pm-m12d1-pitch`, `pm-m12d11-dastur` · **9 — kelishuvlar**) ·
`00-TAQIQLAR.md` (0–7) · `00-NOMLAR.md` · `00-MANBA.md` (1 — dastur 11-qator · 5 — Diamond Challenge, YC rasmiy iqtiboslari) · `qaror-0.json` (DASTUR — T14) · `MD_TOPSHIRIQ_2.md` (11-qator va 11-eslatma, «Pilotlardan saboq») ·
**rasmiy sahifalar — o'zim qayta ochdim, 08.10.2026** (`diamondchallenge.org/competition`, `ycombinator.com/faq`, `ycombinator.com/early-decision`; iqtiboslar — «Manbalar») ·
namunalar (tuzilish va hajm; matn ko'chirilmadi): 13-Modul `07-PmTerms-v3.md` + `07-FILTR.md` (rasmiy matn bilan ishlash, «sahifada bor / yo'q» mexanikasi) · pilotlar `01-PmInvestorPitch-v3.md` (pitch bo'laklari, QMustaqil — bittadan karta), `07-PmDemoTest-v3.md` (12 ekranli PM shakli) va `NN-OZ-AUDIT.md`.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Darsning bitta natijasi** (dastur: «1 dastur + boshlangan ariza»; tayanch 1.11, 4): o'quvchi **bitta dasturni** tanlaydi (Diamond Challenge yoki boshqa dastur) va **ariza qoralamasini** olti kartaga yozadi —
   dastur (va ro'yxat holati) · jamoa (necha o'quvchi) · maslahatchi (bormi) · **konsept qoralamasi**: muammo · kim uchun · yechim (pitchdan; `pm-m12d1-pitch` dan Muammo va Yechim oldindan qo'yiladi). Bittadan karta (E 53). Saqlanadi `pm-m12d11-dastur` (12-dars o'qiydi — tayanch 8). <!-- TAXMIN T14 -->
   Natija besh holatda bo'lishi mumkin (11-ekran sarlavhasi shunga qarab — sinf 6, E 54): to'liq va shartlar ✓ · konsept tayyor, jamoa yoki maslahatchi qoldi · konsept tayyor, dastur boshqa · qisman · hech narsa. Belgi ✓ va nishon — faqat birinchisida.
   Bugun hech qayerga ariza yuborilmaydi va ro'yxatdan o'tilmaydi (TAQIQLAR 3): ro'yxat — uyda, maslahatchi va ota-ona bilan, xohlasa. Keyingi dars ekranda va'da qilinmaydi (T-038).
2. **Bugungi asosiy fikr** (P-013; darsning ichki o'qi; yakunda KO'RSATILMAYDI, SABOQ E 50): Ariza rasmiy shartlarni o'qishdan boshlanadi: mos dastur tanlanadi, konsept esa pitchdan yoziladi. (101)
3. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052; `00-MANBA.md` 4, tayanch 2):**
   - 14-Modul (1-dars): **pitch** va olti bo'lak — **Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam** (atoqli nomlar, bosh harf bilan) · **Bozor** — «mahsulotga muhtoj odamlar va biz bilgan ularning soni» · **Jamoa** (bo'lak) — «mahsulotni kim qilayotgani» · **hakam** · **qoralama** (pitchning birinchi yozma ko'rinishi). <!-- TAXMIN T1 -->
   - 11–13-Modul: **tashkilotchi** · **o'yinchi** (rol bilan, ismsiz) · «Maydon Jamoa» (o'z yashil rangida, logotipsiz) · **shaxsiy ma'lumot** · **sinov** (faqat real odam bilan).
   - Kurs bo'yi: **ota-ona roziligi** (real odam bilan ish) · **«Yordam»** (tugma) · **taxmin** («Avval o'zingiz belgilab ko'ring»).
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar dars bo'yi so'zma-so'z (T-042):** <!-- TAXMIN T14 -->
   - **xalqaro dastur** — «Jamoalar ariza berib, tanlab olinadigan xalqaro tanlov yoki dastur — xalqaro dastur deyiladi.» (2-ekran oxirgi `QIzoh`; kartochka 1). Dars nomidagi so'zlar (xalqaro, dastur, ariza) — kundalik so'zlar; atama ta'rifi misoldan (Diamond Challenge) keyin.
     Tayanch 2 ta'rifi «startap tanlovi yoki akseleratori» — o'quvchi matnida «startap», «akselerator» so'zlarisiz (TAYANCHGA SAVOL 10).
   - **maslahatchi** — «Jamoaga yordam beradigan katta yoshli odam maslahatchi deyiladi.» (2-ekran, 3-kartadan keyin `QIzoh`; Diamond Challenge'da — 21 yoshdan katta). «Mentor» bu ma'noda ishlatilmaydi (tayanch 2).
   - **ariza** (kundalik so'z) — «dasturga qatnashish uchun topshiriladigan yozuv va fayllar» (kartochka 2). **ariza qoralamasi** — bugungi olti karta (7-ekran).
   - **konsept** — «Muammo, kim uchun va yechimni aytadigan qisqa yozuv konsept deyiladi.» (6-ekran oxirgi `QIzoh`; kartochka 10). Diamond Challenge'dagi «concept narrative» — ingliz tilida 3–5 betlik yozma g'oya; bugungi uch gap — uning qoralamasi.
   - **rasmiy sahifa** (oddiy so'z) — dasturning o'z saytidagi shartlar sahifasi; **taxmin** — sahifada yo'q gap (2-ekran xulosasi).
   - **to'liq vaqt** (oddiy so'z) — «butun ish kunini o'z kompaniyasiga berish» (4-ekran `QIzoh`).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«dastur»** — bu darsda faqat **xalqaro dastur** (Diamond Challenge, Y Combinator, O'zbekistondagi tanlovlar). Kompyuter dasturi ma'nosida ishlatilmaydi.
   - **«tanlov»** — faqat musobaqa ma'nosida (Diamond Challenge — tanlov). «Tanlash» harakati — fe'l bilan («tanlang», «belgilang»); «tanlov» ot sifatida bu ma'noda yo'q.
   - **«jamoa»** — dasturga ariza beradigan o'quvchilar (Diamond Challenge'da 2–4) — pitchdagi **Jamoa** bo'lagi bilan bir ma'no: mahsulotni qiladigan odamlar (TAYANCHGA SAVOL 6). Bo'lak nomi — bosh harf bilan; mahsulot nomi — «Maydon Jamoa» qo'shtirnoqda; futbol ma'nosi — faqat Mentor pitch gapi ichida (olam matni, T-008: «jamoaga odam yig'ishda»).
   - **«shart»** — dastur sahifasida yozilgan talab (yosh, jamoa, maslahatchi, til, muddat). «Talab» — kursda agentga yoziladigan talab, bu darsda ishlatilmaydi; «shart emas» (kerak emas ma'nosida) — yo'q.
   - **«ro'yxat»** — dastur saytida ro'yxatdan o'tish. **«muddat»** — topshirish oxirgi kuni.
   - **«tekshirish»** — o'z holatini sahifa bilan solishtirish; **«sinov»** — o'quvchi matnida yo'q (platforma sarlavhasi «O'zingizni sinab ko'ring» — qolip).
   - **«Mentor»** — kurs o'qituvchisi (vazifa beradi, misol ko'rsatadi; lokal tanlovlar haqida so'raladigan odam). Maslahatchi bilan aralashmaydi.
   - **Ishlatilmaydi:** startap, akselerator, grant (o'quvchi matnida), YC (qisqartma), mentor (maslahatchi ma'nosida), «qabul qilinasiz», «finalga chiqasiz», «albatta», «kafolat», sovrin, investitsiya, «Demo Day», talab (shart ma'nosida), Q&A, keys, pilot, `m12-11`, «Modul 14».
6. **Rasmiy faktlar — bitta manba `DASTUR_SHART` (180-qonun; tayanch 1.11, 6 + `00-MANBA.md` 5 + o'zim qayta ochgan sahifalar, 08.10.2026 — iqtiboslar «Manbalar»da):** <!-- TAXMIN T14 -->

| Dastur · qator | O'quvchi ko'radi (o'zbekcha mazmun) | Rasmiy asl (sahifa, 08.10.2026) |
|---|---|---|
| Diamond Challenge · kim | Jamoa — 2–4 maktab o'quvchisi, topshirish kuni 14–18 yosh | «Teams must consist of 2-4 high school students aged 14-18 at the submission deadline.» |
| · maslahatchi | Jamoaga yordam beradigan, 21 yoshdan katta bitta odam | «Each team is required to have one adult advisor aged 21 or older.» |
| · til | Hamma narsa ingliz tilida topshiriladi | «All submissions are to be written in English.» |
| · birinchi bosqich | Ingliz tilida 3–5 betlik yozma g'oya va 60 soniyalik tanishtiruv videosi | «Written concept narratives and introductory videos serve as a submission requirement solely during the first round…» · «The narrative is limited to 3-5 pages…» (yangi — TAYANCHGA SAVOL 1) |
| · mamlakat | Istalgan mamlakatdan qatnashish mumkin, onlayn ham | «Any Idea, Any Team, Any Country» · «…participants have the option to compete virtually…» (yangi — TAYANCHGA SAVOL 1) |
| · yo'nalish | Ikki yo'nalish: Business Innovation va Social Innovation | tayanch 1.11; ta'riflari — O'qituvchi eslatmasida (TAYANCHGA SAVOL 8) |
| · sanalar (2027-yil tanlovi) | Topshirish muddati — 14-yanvar, 2027 · finalistlar — 9-mart, 2027 | «January 14» «5PM EST» · finalistlar 9-mart · Summit 29–30-aprel (tayanch 1.11) |
| Y Combinator · yosh | Rasmiy savollar sahifasida yosh chegarasi yozilmagan | tayanch 1.11 («rasmiy FAQ da yosh yozilmagan»), 08.10 qayta ko'rildi |
| · kim | O'qiyotgan yoki ishlayotgan odam ham ariza bera oladi | «You can certainly apply when you are a full-time student or employee…» |
| · nima kutiladi | Asoschilar dastur davomida va keyin o'z kompaniyasida to'liq vaqt ishlaydi | «…we expect the founders to commit to working full-time on their company during the batch and afterwards if accepted.» |
| · qayerda | Dastur San-Fransiskoda, yuzma-yuz o'tadi | «The batch takes place in-person in San Francisco.» (yangi — TAYANCHGA SAVOL 1) |
| · Early Decision | O'qishini tugatib, keyin kompaniya ochmoqchi talabalar uchun yo'l | «This program is designed for students who want to finish their degree before starting a company.» |
| O'zbekistondagi tanlovlar | Nomi aytilmaydi — shartlari tekshirilmagan; Mentordan so'raladi | tayanch 1.11 («nom aytilmaydi»; TAYANCHGA SAVOL 2) |

   Bu darsda **aytilmaydi**: sovrin miqdori (sahifada bor — pul, TAYANCHGA SAVOL 12) · qatnashish puli (sahifada aniq yo'q) · Diamond Challenge'ning hamkor shaharlari · Y Combinator bergan pul va ulush · Y Combinator'ning norasmiy yosh gaplari (`00-MANBA.md` 5: ikkinchi darajali manba — da'vo qilinmaydi).
   Sanalar **2027-yil tanlovi uchun**, 08.10.2026 holatida; o'quvchi matnida «sana saytda o'zgarishi mumkin» (sinf 18).
7. **Mentor misoli (tayanch 1.1, 1.12 — AYNAN; yangi tafsilot — TAYANCHGA SAVOL 3, 4; o'quvchiga «Mentor misolida»):** <!-- TAXMIN T14 -->
   - **Pitch** (`JAMOA_PITCH`, 1-dars, tayanch 1.1 aynan — tasmada har bo'lakning birinchi qatori): Muammo «O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.» ·
     Bozor «Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.» · Yechim «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.» ·
     Raqamlar, Jamoa («Men — g'oya, mahsulot va kod (agent bilan). Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.»), Keyingi qadam — 1-dars aynan. <!-- TAXMIN T1, T2 -->
   - **Konsept qoralamasi** (`MENTOR_KONSEPT`; 6-ekran, 7-ekran Yordam): Muammo — pitchdagi Muammo aynan · **Kim uchun — «Mahallada mini-futbol o'ynaydigan o'yinchilar va o'yin e'lon qiladigan tashkilotchilar.»** (yangi gap — tayanch 1.0 dagi mahsulot va rollardan; TAYANCHGA SAVOL 4) · Yechim — pitchdagi Yechim aynan.
   - **Dastur va shartlar** (`MENTOR_ARIZA`; 7-ekran Yordam): dastur — **Diamond Challenge** (tayanch 1.12 «Diamond Challenge'ga jamoa bilan konsept» bilan mos) · jamoa — Jamoa bo'lagida **bitta odam** → «Diamond Challenge'ga yana kamida bitta o'quvchi kerak» (1.1 + rasmiy shartdan; yangi son yo'q) ·
     maslahatchi — **hali aniqlanmagan** · ro'yxat — **hali yo'q**. Mentor misolida yosh ko'rsatilmaydi: yosh — har a'zo o'zi tekshiradigan shart (TAYANCHGA SAVOL 5).
   - Mentor misoli — namuna, majburiy shakl emas (sinf 4): «Mentor misolida …», «Bu misolda …».
8. **Sonlar:** Mentor misolidan — faqat pitch tasmasida (5 dan 4 · 60 · 6 — tayanch 1.14; 6-ekranda sonlar konseptga ko'chmaydi). Rasmiy sonlar — faqat A-6 jadvalidan (2–4 · 14–18 · 21 · 3–5 bet · 60 soniya · sanalar). Boshqa son yo'q.
   Ikkinchi misol (P-002) — testlarda faqat o'quvchining o'z holati (yolg'iz qurilgan mahsulot, yoshi yozilmagan sahifa); boshqa mahsulot yo'q.
9. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › ⛶ — belgilar. Brauzer, varaq, pitch tasmasi — chizilgan (CSS/SVG). Dastur nomlari — o'z rangida, **logotipsiz** (rang — «qur» da rasmiy saytdan, ⛔ — TAYANCHGA SAVOL 9). O'yin qatlami (arena, nishon medali, podium) — mustasno.
10. **Xavfsizlik va halollik (sinf 9, 17, 18; TAQIQLAR 1, 3):** kalit va formada ism, telefon, maktab, email yo'q — jamoa **son** bilan, maslahatchi **bor / hali yo'q** bilan · ro'yxat va ariza — uyda, maslahatchi va ota-ona bilan (7, 8, 11-ekranlar) ·
    Diamond Challenge'ning 60 soniyalik videosi — faqat ota-ona roziligi bilan (TAQIQLAR 1 video qoidasi; bugun video yozilmaydi) <!-- TAXMIN T12 --> · «qabul qilinasiz», «finalga chiqasiz» yo'q — «ariza berish qabul qilinish degani emas» (2, 11-ekranlar, kartochka 12) ·
    norasmiy gap (sinfdosh, chat) — taxmin; rasmiy sahifa — manba (2, 5-ekranlar).
11. **Trek (sinf 11):** bu darsda trek farqi yo'q — dastur shartlari va konsept mahsulot turiga bog'liq emas; matnda «mahsulot» (web yoki mobil). Trek kaliti o'qilmaydi.
12. **Kod mexanikasi:** kod ekrani yo'q. Darsning o'z mexanikalari: «sahifada bor / yo'q» saralash (2) · ikki dastur solishtiruvi (4) · pitchdan konseptga ko'chirish (6) · bittadan karta (7).
13. **Saqlash kaliti (tayanch 8 — shartnoma, sinf 3):**
    - **o'qiydi:** `pm-m12d1-pitch` (`bolaklar.muammo`, `.yechim` — 7-ekran 4, 6-kartalarga oldindan; `.bozor`, `.jamoa` — 7-ekran 5, 2-kartalarda kulrang qator; 0-ekran maketi — olti bo'lak). Yo'q yoki `null` — o'sha karta bo'sh, kulrang qator ko'rinmaydi, 0-ekranda Mentor misoli.
    - **yozadi:** `pm-m12d11-dastur` = `{ dastur, jamoa, maslahatchi, qoralama: { muammo, kimUchun, yechim }, royxat, savedAt }` (tayanch 8 aynan). Maydonlar shartnomasi (TAYANCHGA SAVOL 7):
      `dastur: 'diamond' | 'boshqa' | null` — 1-karta (tanlanmagan — `null`) · `jamoa: 1 | 2 | 3 | 4 | null` — o'quvchi bilan birga necha o'quvchi; «Hali bilmayman» — `null` ·
      `maslahatchi: bool | null` — «Bor» → `true`, «Hali yo'q» → `false`, tanlanmagan → `null` · `qoralama.muammo`, `.kimUchun`, `.yechim`: `string` (≤160, «Saqlash» bosilgan) yoki `null` ·
      `royxat: bool | null` — faqat `dastur === 'diamond'` da so'raladi: «Ha, o'tganman» → `true`, «Hali yo'q» → `false`; boshqa holatda `null` · `savedAt` — har saqlashda.
      Ism, telefon, maktab, email, maslahatchining kimligi, havola — hech qaysi maydonga yozilmaydi. Har «Saqlash»da o'sha karta maydoni yoziladi (birlashtiriladi). Dars boshqa darsning kalitiga yozmaydi.
14. **Vaqt taqsimoti — 90 daqiqa (sinf 1 — reja, o'lchov emas):** kirish va reja (0, 1) ≈ 5 · Diamond Challenge shartlari (2) ≈ 12 · Y Combinator (4) ≈ 10 · pitchdan konsept (6) ≈ 8 · uch ballik test (3, 5, 8) ≈ 8 ·
    ariza qoralamasi (7) ≈ 25 · podium, kartochkalar, arena, yakun (9–11) ≈ 14 → jami ≈ 82; 8 daqiqa zaxira (proyektorda rasmiy sahifani bir marta ochib ko'rsatish — ixtiyoriy).
    **Ulgurmasangiz:** 7-ekran — saqlangan kartalar qoladi, qolgani — uyga vazifa ①; yakun sarlavhasi «hali tugamagan» (E 54) · 6-ekran — jonli darsda Mentor o'zi bosib ko'rsatishi mumkin · arena vaqti qisqarsa — kartochkalar uyda. Amaliy blok yo'q — blok-darajasidagi «Ulgurmasangiz» tegishli emas.
    ⛔ Taqsimot — reja: «qur» pilotida 12–15 o'quvchi bilan taymer (ayniqsa 7-ekran — 25 daqiqa); «sig'adi» deyilmaydi.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.1, 1.10–1.12):** 1-darsda olti bo'lakli pitch qoralamasi yozildi; 10-darsda — tanish doiradagi birinchi buyurtma rejasi. Bugun — o'sha pitchni **xalqaro dasturga** olib chiqish yo'li: rasmiy shartlar va ariza qoralamasi. Yangi funksiya yo'q, repo'ga tegilmaydi.
- **Dars ipi:** 0 — ariza berishdan oldin birinchi nima bilinadi (kim qatnasha oladi) → 2 — Diamond Challenge: eshitilgan olti gap rasmiy sahifa bilan solishtiriladi, to'rttasi bor → shartlar jadvali («maslahatchi», «xalqaro dastur») →
  3 — test (yolg'iz qurilgan mahsulot va jamoa sharti) → 4 — Y Combinator: yosh yozilmagan, lekin to'liq vaqt va San-Fransisko — bugungi yo'l emas → 5 — test (yosh yozilmagan sahifa) →
  6 — Mentor pitchidan konsept: Muammo va Yechim ko'chadi, kim uchun — yangi gap («konsept») → 7 — o'z ariza qoralamasi, olti karta → 8 — yakuniy savol (ariza qanday topshiriladi) → podium → kartochkalar → yakun (holatga qarab).
- **Bitta vizual — `ArizaSahna` (dars bo'yi, 163/180; bitta manba `DASTUR_SHART` + `JAMOA_PITCH` + `MENTOR_KONSEPT` + `MENTOR_ARIZA` + o'quvchi ma'lumoti `pm-m12d1-pitch`, `pm-m12d11-dastur`):**
  - **brauzer** (chapda): manzil satri (`diamondchallenge.org/competition` yoki `ycombinator.com/faq`), tepada dastur nomi (o'z rangida, logotipsiz) va ostida bir qatorli kulrang izoh (S-018), tepada kichik kulrang yorliq «Sahifa ingliz tilida — mazmuni o'zbekcha»;
    sahifa qatorlari — `DASTUR_SHART` (A-6). Holatlar: kulrang qator → yonadi (accent, ~1 s) → ✓. Sahifaning o'zi o'zgarmaydi — u rasmiy manba.
  - **varaq** (o'ngda; oq, soyasiz — jadval «ma'lumot» bo'lib ko'rinadi, E 45): uch rejim — «Shartlar jadvali» (shart · qiymat) · «Solishtirish» (ikki ustun: Diamond Challenge | Y Combinator; qatorlar Kim uchun · Nima kutiladi · Qayerda) ·
    «Ariza qoralamasi» (tepada «Dastur: …», ostida shartlar qatori ✓ / ✕ / ?, pastida «Konsept»: Muammo · Kim uchun · Yechim). Bo'sh joy — uzuq chiziq (U-041); yozilgani sirg'alib kiradi, ~1 s yashil.
  - **pitch tasmasi** (pastda, ixcham): olti bo'lak nomi va bir qatordan matn (o'quvchiniki yoki Mentor misoli — ustida kulrang yorliq «Mentor misoli · Maydon Jamoa», nom o'z yashil rangida). 6, 7-ekranlarda bo'lak matni varaqqa uchadi. <!-- TAXMIN T1 -->
  - Ishlatiladi: 0 (nomsiz brauzer + tasma) · 1 (tayyor holat, bir marta o'zi yuradi) · 2 (Diamond Challenge brauzeri + karta + «Shartlar jadvali») · 4 (Y Combinator brauzeri + «Solishtirish») · 6 (Mentor tasmasi + «Ariza qoralamasi») · 7 (o'quvchi tasmasi + varag'i) · 3, 5, 8 (javobdan keyin kichik ko'rinish).
  - `prefers-reduced-motion` da uchish va yonish yo'q — yakuniy holat birdan. 393 kenglikda brauzer varaq ustida, tasma ostida; hech narsa kesilmaydi (E 41). Vizual ⛶ ichida (q17, E 48).
- **Keyingi bosiladigan joy (E 40, qat'iy):** har bosiladigan variant va tugmaning o'z yengil accent chegarasi, yengil to'lqin navbatma-navbat 2 marta, kattalashishsiz; bitta navbatdagi tugma — halqa, to'lqin 3 marta, `scale` yo'q. `prefers-reduced-motion` da to'lqin yo'q, chegara qoladi.
- **Bashorat (SABOQ 11, 25, E 42):** tanlangach yo'qolmaydi — ixcham qator bo'lib natijagacha turadi; natija — yashil xulosa qutisining birinchi kichik qatori: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: …»; `QIzoh` — o'sha qutining oxirgi kichik qatori.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → karta varaqqa uchadi, brauzer qatori yonadi · yangi qator ~1 s yashil · hisoblagich sanab o'sadi. Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Qaysi xalqaro dasturga ariza berasiz?** (37) — dars nomi (DE-205) <!-- TAXMIN T20 -->
- Mentor: Tasavvur qiling: pitchingiz bilan xalqaro dasturga ariza bermoqchisiz — birinchi nimani bilish kerak?
- Maket (chap; `ArizaSahna` boshlang'ich holati): pastda — pitch tasmasi, olti bo'lak (`pm-m12d1-pitch.bolaklar` dan birinchi qator; yo'q bo'lsa — Mentor misoli, ustida kulrang yorliq «Mentor misoli · Maydon Jamoa»); <!-- TAXMIN T1 -->
  tepada — nomsiz brauzer: sarlavha «Xalqaro dastur», uchta yopiq qator «Kim qatnasha oladi?» · «G'oliblar» · «Muddat» va kulrang tugma «Ariza berish» (bosilmaydi); tasmadan brauzerga uzuq strelka. Dastur nomi bu ekranda yo'q (S-018 — nom 2-ekranda izohi bilan chiqadi).
- Variantlar (radio, o'ng; bir uzunlikda — P-016):
  - Kim ariza bera olishini (23)
  - Oldin kimlar yutganini (22)
  - Muddat qachon tugashini (23)
- Javob — «kim»: **Aynan!** Shartga mos kelmasangiz, qolgan savollar kerak bo'lmaydi — avval shu o'qiladi. (85)
- Javob — «g'oliblar»: **Qiziq fikr!** Bu ham foydali — lekin avval o'zingiz qatnasha olishingizni bilish kerak. (85)
- Javob — «muddat»: **Qiziq fikr!** Muddat ham kerak — lekin avval kim qatnasha olishini bilish kerak. (78)
- **Harakat → Vizual o'zgarish:** variantni tanlash → brauzerdagi mos qator («Kim qatnasha oladi?», «G'oliblar» yoki «Muddat») accent bilan yonadi, ichida «?» qoladi — javob ochilmaydi (2-ekran kashfiyoti, P-036); tanlangan variant ixcham qator bo'lib qoladi.
  Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni; ism yo'q).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: uch variant (har birining o'z chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: Sinfdan so'rang: «Biror tanlov yoki dastur haqida eshitganmisiz? Qayerdan eshitdingiz?» Javoblarni baholamang — 2-ekranda eshitilgan gap rasmiy sahifa bilan solishtiriladi.
  Pitchi saqlanmagan o'quvchi Mentor misolining olti bo'lagini ko'radi. Dastur nomlarini hozir aytmang.
✎ Hook — o'quvchi o'zi beradigan savol (P-016: aniq narsa — o'z pitchi; harakat — ariza berish). Uch javob uch xil savol; payoff hech birini rad etmaydi, faqat tartibni aytadi. «Kim qatnasha oladi?» — 2-ekran sarlavhasi shu savolga javob beradi (T-064).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun dastur shartlarini o'qib, ariza boshlaysiz.** (49)
- Mentor: Bugun hech qayerga ariza yuborilmaydi: shartlar o'qiladi, qoralama yoziladi.
- Chap — «Dars oxirida» + kulrang yorliq **Diamond Challenge, Y Combinator: shartlar va ariza** (App.jsx osti so'zma-so'z, P-015) <!-- TAXMIN T14 -->
  + vizual (`ArizaSahna`, tayyor holat, bir marta o'zi yuradi — DE-200): brauzerda nomsiz sahifa qatorlari birma-bir yonadi → varaqqa kulrang chiziqlar tushadi → tasmadagi ikki bo'lak (nomsiz) varaqning pastki qismiga uchadi. Matnsiz — 2, 6-ekran kashfiyotlarini ochmaydi (P-015).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Dastur shartini rasmiy sahifadan o'qishni bilib olasiz · `rasmiy sahifa`
  - 02 · Qaysi dastur bugun sizga mos ekanini ajratasiz · `Diamond Challenge · Y Combinator` <!-- TAXMIN T14 -->
  - 03 · Pitchdan ariza uchun qisqa qoralama olishni o'rganasiz · `konsept`
  - 04 · Ariza qoralamasini olti kartaga yozasiz · `jamoa · maslahatchi`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz · Keyingi bosiladigan joy: «Boshlaymiz» (vizual tugagach halqada).
- O'qituvchi eslatmasi: Menyu ostidagi «ariza» — bugun boshlanadigan qoralama: dars natijasi — bitta dastur va ariza qoralamasi. Ro'yxatdan o'tish va topshirish — uyda, maslahatchi va ota-ona bilan, xohlasa. Hech kim qabul qilinishga va'da bermaydi.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011) — «konsept», «maslahatchi» faqat kulrang tegda (P-015; 01 pilot naqshi). Chap yorliq App.jsx ostini so'zma-so'z beradi; dastur nomlari menyuda bor — bu yerda nom-yorliq, izoh 2, 4-ekranlarda (S-018).

## 2 · Kim ariza bera oladi  ← QTushuncha (markaziy; ketma-ket 6 karta — SABOQ 9/13, E 53)
- Eyebrow: Tushuncha · rasmiy shartlar
- Sarlavha: **Diamond Challenge'ga kim ariza bera oladi?** (42) — 0-ekran savoliga javob beradigan ekran (T-064) <!-- TAXMIN T14 -->
- Mentor: Har gapni rasmiy sahifa bilan solishtiring: u yerda shunday yozilganmi?
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — bitta o'lchov, o'sish tartibida): **Olti gapdan nechtasi rasmiy sahifada yozilgan?** · 2 · 4 · 6 — tanlangach ixcham qator natijagacha turadi; tugmalar shundan keyin yoqiladi.
- Vizual (≤ 3 blok: brauzer · gap kartasi va tugmalar · varaq): **chapda** — brauzer `diamondchallenge.org/competition`: nom «Diamond Challenge» (o'z rangida, logotipsiz), ostida kulrang izoh «maktab o'quvchilari g'oyasi uchun xalqaro tanlov» (48) (S-018); <!-- TAXMIN T14 -->
  tepada kulrang yorliq «Sahifa ingliz tilida — mazmuni o'zbekcha»; sahifa qatorlari (A-6; kulrang, hali yonmagan):
  1 Jamoa — 2–4 maktab o'quvchisi, topshirish kuni 14–18 yosh · 2 Jamoaga yordam beradigan, 21 yoshdan katta bitta odam · 3 Hamma narsa ingliz tilida topshiriladi ·
  4 Istalgan mamlakatdan qatnashish mumkin, onlayn ham · 5 Topshirish muddati — 14-yanvar, 2027 · 6 Finalistlar e'lon qilinadi — 9-mart, 2027.
  **o'rtada** — joriy gap kartasi («Eshitilgan gap · n / 6») va ostida ikki tugma «Sahifada bor» · «Sahifada yo'q» · **o'ngda** — varaq «Shartlar jadvali» (bo'sh, uzuq qatorlar) va ostida kulrang qator «Taxmin · n».
- Kartalar (navbat bilan; eshitilgan gap — olam matni, T-008):
  1. «Jamoada 2–4 o'quvchi bo'ladi.» ✔ Sahifada bor → 1-qator yonadi; varaqqa «Jamoa — 2–4 o'quvchi»
  2. «Topshirish kuni yoshingiz 14–18 bo'lishi kerak.» ✔ Sahifada bor → 1-qator yana yonadi; varaqqa «Yosh — 14–18, topshirish kuni»
  3. «Jamoaga 21 yoshdan katta bitta odam yordam beradi.» ✔ Sahifada bor → 2-qator yonadi; varaqqa «Maslahatchi — 21 yoshdan katta»
     `QIzoh` (shu kartadan keyin, bir lahza): Jamoaga yordam beradigan katta yoshli odam maslahatchi deyiladi. (64) — atama shu yerda tug'iladi (T-011)
  4. «Ariza ingliz tilida yoziladi.» ✔ Sahifada bor → 3-qator yonadi; varaqqa «Til — ingliz»
  5. «Faqat Amerika maktablari qatnasha oladi.» ✔ Sahifada yo'q → karta «Taxmin» qatoriga tushib chiziladi; 4-qator yonadi va varaqqa «Mamlakat — istalgan, onlayn ham» yoziladi
  6. «Ariza bergan har jamoa finalga chiqadi.» ✔ Sahifada yo'q → karta «Taxmin» qatoriga tushib chiziladi; 6-qator kulrang yonadi (finalistlar tanlanadi)
- **Harakat → Vizual o'zgarish:** «Sahifada bor» to'g'ri → brauzerdagi mos qator ~1 s accent bilan yonadi, karta kichrayib varaqqa uchadi va shart qatori bo'ladi · «Sahifada yo'q» to'g'ri → karta «Taxmin» qatoriga tushib ustidan chiziladi, hisoblagich o'sadi; sahifadagi rost qator yonadi · keyingi karta kiradi.
  Xato → tugma silkinadi, karta bir lahza `err` fon, bitta `QXato` (≤60; javobni aytmaydi):
  - 1–4-gap, «Sahifada yo'q»: Sahifadagi qatorlarni yana bir o'qing. (38)
  - 5-gap, «Sahifada bor»: Sahifada mamlakat haqida nima yozilgan? (39)
  - 6-gap, «Sahifada bor»: Sahifada «finalistlar» qatorini toping. (39)
  6/6 dan keyin: tugmalar va karta yopiladi; varaqqa sahifadan 5-qator bir lahza ajralib kiradi — «Muddat — 14-yanvar, 2027» (ostida kulrang «2027-yil tanlovi; sana saytda o'zgarishi mumkin»). Varaq to'liq: olti shart.
- Natija (bitta blok — E 42; `tugadi`: harakat paneli yopiladi, brauzer va varaq butun enga, ⛶ ichida — q17/q18): yashil xulosa qutisi — birinchi kichik qator taxmin: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: 4».
- Xulosa: Ariza rasmiy sahifadagi shartlarni o'qishdan boshlanadi: sahifada yo'q gap — taxmin. (84)
- `QIzoh` (qutining oxirgi kichik qatori — E 42): Jamoalar ariza berib, tanlab olinadigan xalqaro tanlov yoki dastur — xalqaro dastur deyiladi. (93) <!-- TAXMIN T14 -->
- Tugma (pastki): Avval belgilang → Gaplarni solishtiring (N/6) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Sahifadagi qatorlardan biri shu gapni aytadimi? (47)
- Keyingi bosiladigan joy: bashorat variantlari → ikki tugma (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Source Reader! (olti gap birinchi urinishda).
- O'qituvchi eslatmasi: Rasmiy sahifa — `diamondchallenge.org/competition` (08.10.2026 tekshirilgan); vaqt bo'lsa, proyektorda bir marta ochib ko'rsating — sahifa ingliz tilida. Sanalar 2027-yil tanlovi uchun; topshirish muddati — AQSh sharqiy vaqti bilan 17:00, Toshkentda bu 15-yanvar, 03:00 — oxirgi kunga qoldirmang.
  Yosh topshirish kuniga qarab olinadi: hozir 13 yoshli o'quvchi o'sha kunga 14 ga to'lsa, shartga mos keladi. Sovrin va qatnashish puli haqida gapirmang: bu darsning maqsadi — shartni o'qish va ariza qoralamasi. Finalistlarni dastur tanlaydi — ariza berish qabul qilinish degani emas.
✎ Gaplar tartibi — rasmiy sahifa tartibi; 5, 6-gap — ikki xil taxmin (mamlakat haqida noto'g'ri gap · natija va'dasi). Javob kaliti `[bor, bor, bor, bor, yo'q, yo'q]` — `DASTUR_SHART` dan. «Maslahatchi» kartada emas, `QIzoh` da tug'iladi — karta matni hodisani aytadi (T-011).

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; o'quvchining o'z holati — yolg'iz qurilgan mahsulot)
- Eyebrow: Tekshiruv · jamoa sharti (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Mahsulotni yolg'iz qurdingiz. Diamond Challenge'ga qanday ariza berasiz?** (72) <!-- TAXMIN T14 -->
  - A — Yolg'iz ariza beraman: g'oya o'zimniki (38)
  - ✔ B — Bir-ikki sinfdoshimni jamoaga chaqiraman (40)
  - C — Jamoaga 25 yoshli akamni qo'shib qo'yaman (41)
  - D — Arizada jamoamizni uch kishi deb yozaman (40)
- Kalit: **B** (index 1). To'rttalasi bir shaklda («…-aman», birinchi shaxs); «jamoa» B, C, D da — kalit so'z faqat to'g'rida emas; uzunlik — «O'lchov».
  Distraktorlar uch xil turkum (sinf 8): A — shartni e'tiborsiz qoldirish (2–4 o'quvchi) · C — yosh shartini aralashtirish (a'zo 14–18; 21 yoshdan kattasi — maslahatchi) · D — yolg'on (arizadagi gap rost bo'ladi).
- To'g'ri izohi: Diamond Challenge'da jamoa 2–4 o'quvchidan iborat bo'ladi. (58)
- Xato izohlari (≤60):
  - A: Sahifada jamoada nechta o'quvchi deyilgan? (42)
  - C: Jamoa a'zosi 14–18 yoshda; kattasi maslahatchi bo'ladi. (55)
  - D: Arizadagi har gap rost bo'lishi kerak. (38)
  - (umumiy) Diamond Challenge'da jamoa sharti qanday edi? (45)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): varaqdagi «Jamoa — 2–4 o'quvchi» qatori accent bilan yonadi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Team Rule! — birinchi urinishda to'g'ri.
- Izoh (MD): savol 2-ekrandan ko'chirilmaydi (§106): u yerda shart o'qildi, bu yerda o'z holatiga qo'llanadi. C — «akam» (rol, ismsiz); 25 — mashq soni, shartdagi 21 dan katta: hayotda u maslahatchi bo'lishi mumkin, jamoa a'zosi — yo'q (variant «jamoaga … qo'shib qo'yaman» deydi; distraktor hayotda rost bo'lib qolmaydi).
  B — «bir-ikki» bilan jami 2–3 o'quvchi: shartga mos. Mentor misoli (Jamoa bo'lagida bitta odam) shu savolning javobi bilan bir — 7-ekran Yordamida.

## 4 · Y Combinator  ← QTushuncha (ketma-ket, 3 tugma)
- Eyebrow: Tushuncha · ikki dastur
- Sarlavha: **Y Combinator'ga hozir ariza bera olasizmi?** (42) <!-- TAXMIN T14 -->
- Mentor: Tugmalarni birma-bir bosing: ikki dastur sahifasi bir xil savolga nima deydi?
- Bashorat (ballsiz; S-015 — bitta o'lchov: yosh): **Y Combinator sahifasida yosh chegarasi qanday yozilgan?** · 14 yoshdan · 16 yoshdan · Yozilmagan — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi.
- Vizual (≤ 3 blok: brauzer · varaq «Solishtirish» · tugmalar): **chapda** — brauzer `ycombinator.com/faq`: nom «Y Combinator» (o'z rangida, logotipsiz), ostida kulrang izoh «Amerikadagi, yangi kompaniya asoschilari uchun dastur» (53) (S-018); <!-- TAXMIN T14 -->
  sahifa qatorlari (A-6; kulrang): 1 O'qiyotgan yoki ishlayotgan odam ham ariza bera oladi · 2 Asoschilar dastur davomida va keyin o'z kompaniyasida to'liq vaqt ishlaydi · 3 Dastur San-Fransiskoda, yuzma-yuz o'tadi.
  **o'ngda** — varaq «Solishtirish»: ikki ustun **Diamond Challenge** | **Y Combinator**; uch qator (bo'sh, uzuq): Kim uchun · Nima kutiladi · Qayerda.
- Tugmalar (ixcham, bir qatorda; joriysi accent, bosilgani ✓): 1 Kim uchun · 2 Nima kutiladi · 3 Qayerda
- **Harakat → Vizual o'zgarish:**
  1. «Kim uchun» → brauzerda 1-qator yonadi; varaqqa: Diamond Challenge — «14–18 yoshli 2–4 o'quvchi» · Y Combinator — «yosh yozilmagan; o'qiyotgan odam ham ariza bera oladi». Y Combinator katagi bir lahza yashil (hali to'sqinlik yo'qdek).
  2. «Nima kutiladi» → 2-qator yonadi; varaqqa: Diamond Challenge — «ingliz tilida 3–5 betlik yozma g'oya va 60 soniyalik video» · Y Combinator — «dastur davomida va keyin — to'liq vaqt o'z kompaniyasida»; Y Combinator katagi accent chegarali bo'ladi.
     `QIzoh`: To'liq vaqt — butun ish kunini o'z kompaniyasiga berish. (56)
  3. «Qayerda» → 3-qator yonadi; varaqqa: Diamond Challenge — «istalgan mamlakatdan, onlayn ham» · Y Combinator — «San-Fransiskoda, yuzma-yuz». Varaq ostiga qator qo'shiladi **Bugun maktab o'quvchisi uchun:** Diamond Challenge — «yoshingiz mos bo'lsa — bugungi yo'l» · Y Combinator — «bugungi yo'l emas».
  Natija (yashil xulosa qutisining birinchi kichik qatori): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: yozilmagan».
  Ipucha (40 s): Yoqilgan tugmani bosing — ikki ustun qanday to'lishini ko'ring. (63)
- Xulosa: Yosh yozilmagani ruxsat degani emas: Y Combinator to'liq vaqt kutadi — bu bugungi yo'l emas. (92) <!-- TAXMIN T14 -->
- `QIzoh` (qutining oxirgi kichik qatori): Universitet yillarida Early Decision yo'li bor: u o'qishini tugatmoqchi talabalar uchun. (88) <!-- TAXMIN T14 -->
- Tugma (pastki): Avval belgilang → Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar yo'qoladi, varaq butun enga (DE-199); vizual ⛶ ichida.
- Keyingi bosiladigan joy: bashorat → joriy tugma (to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: Y Combinator sahifasida yosh haqida gap yo'q (08.10.2026 tekshirilgan); internetdagi «18 yoshdan» kabi gaplar — rasmiy qoida emas, darsda aytmang. Rasmiy gap: talaba ham ariza bera oladi, lekin asoschilar dastur davomida va keyin to'liq vaqt ishlashi kutiladi; dastur San-Fransiskoda, yuzma-yuz.
  Maktab o'quvchisi uchun xulosa — tayanch qarori: bugungi yo'l emas. Early Decision — universitetda o'qiyotgan, o'qishini tugatib keyin kompaniya ochmoqchi talabalar uchun. Y Combinator bergan pul va ulush haqida gapirmang (bu darsda pul so'ralmaydi va va'da qilinmaydi).
  Ikki yo'nalish (Diamond Challenge): Business Innovation — mijoz muammosini hal qilib, daromad va foyda topish; Social Innovation — ijtimoiy muammoni hal qilib, odamlar yoki atrof-muhitga foyda berish (rasmiy sahifa) — so'rasalar ayting.
✎ Bashorat — ajablanish nuqtasi: «yozilmagan» → o'quvchi «demak bo'ladi» deb o'ylaydi → 2-tugma rad etadi. Sarlavha savoliga xulosa javob beradi (T-064). Pul va ulush — aytilmaydi (TAQIQLAR 1; T3 ruhi).

## 5 · 2-savol  ← QTest (✔ D, `correctIdx 3`; o'quvchining o'z holati — yoshi yozilmagan sahifa)
- Eyebrow: Tekshiruv · rasmiy shartlar
- Savol: **Dastur sahifasida yosh chegarasi yozilmagan. Endi nima qilasiz?** (63)
  - A — Yosh yo'q ekan, ariza yozishni boshlayman (41)
  - B — Sinfdoshim nima desa, shunga ishonaman (38)
  - C — Yosh yo'q ekan, bu dasturni qoldiraman (38)
  - ✔ D — Qolgan shartlarini ham o'qib chiqaman (37)
- Kalit: **D** (index 3). To'rttalasi bir shaklda (birinchi shaxs fe'li bilan tugaydi); «Yosh yo'q ekan» A va C da — kalit so'z faqat to'g'rida emas; tire va qavs hech birida yo'q.
  Distraktorlar uch xil turkum: A — shoshilib «mumkin» deyish (boshqa shart o'qilmadi) · B — norasmiy manba · C — shoshilib rad etish (sahifa o'qilmadi).
- To'g'ri izohi: Yosh yozilmagani — ruxsat ham, taqiq ham emas. (46)
- Xato izohlari (≤60):
  - A: Sahifada boshqa shartlar ham yozilganmi? (40)
  - B: Bu gap rasmiy sahifada yozilganmi? (34)
  - C: Sahifada sizga mos kelmaydigan shart bormi? (43)
  - (umumiy) Y Combinator sahifasida yoshdan boshqa nima yozilgan edi? (57)
- Javob topilgach (kichik, savol ostida): varaq «Solishtirish» — Y Combinator ustunidagi «to'liq vaqt» va «San-Fransisko» kataklari accent bilan yonadi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol 4-ekran nusxasi emas (§106) — boshqa so'z, umumiy holat («dastur sahifasi»). C distraktor hayotda rost bo'lib qolmaydi: yosh yozilmagani rad etishga sabab emas. B — «sinfdoshim» (rol). S-008: kalit ibora 3-ekran to'g'ri javobi bilan takrorlanmaydi.

## 6 · Pitchdan konsept  ← QTushuncha (ketma-ket, 3 tugma)
- Eyebrow: Tushuncha · konsept
- Sarlavha: **Pitchning qaysi bo'laklari arizaga ko'chadi?** (44)
- Mentor: Tugmalarni birma-bir bosing: Mentor pitchidan arizaga nima ko'chishini ko'ring.
- Bashorat (ballsiz; S-015 — bitta o'lchov: son, o'sish tartibida): **Pitchning nechta bo'lagi arizaga aynan ko'chadi?** · Bitta · Ikkita · Uchta — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi.
- Vizual (≤ 3 blok: tasma · varaq · tugmalar; brauzer bu ekranda yo'q): **pastda** — Mentor pitchi tasmasi (olti bo'lak, bir qatordan; yorliq «Mentor misoli · Maydon Jamoa»; A-7) · <!-- TAXMIN T1, T2 -->
  **o'ngda** — varaq «Ariza qoralamasi · Maydon Jamoa», pastki qismi «Konsept»: uch bo'sh qator (uzuq) — Muammo · Kim uchun · Yechim.
- Tugmalar (ixcham, bir qatorda): 1 Muammo · 2 Kim uchun · 3 Yechim
- **Harakat → Vizual o'zgarish:**
  1. «Muammo» → tasmadagi Muammo bo'lagi accent bilan yonadi, matni varaqdagi «Muammo» qatoriga uchadi (aynan): «O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.»
  2. «Kim uchun» → tasmadagi Bozor bo'lagi yonadi; undagi «60 kishi» va «6 tashkilotchi» kulrang bo'lib tasmada qoladi (uchmaydi); varaqdagi «Kim uchun» qatoriga yangi gap yoziladi: «Mahallada mini-futbol o'ynaydigan o'yinchilar va o'yin e'lon qiladigan tashkilotchilar.» <!-- TAXMIN T2 -->
     `QIzoh`: Kim uchun — qancha emas, kimlar: sonlar pitchdagi Bozor bo'lagida qoladi. (73)
  3. «Yechim» → Yechim bo'lagi yonadi, matni varaqqa uchadi (aynan): «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.»
  3/3 dan keyin: varaq ostida kulrang qator «Diamond Challenge so'raydigan 3–5 betlik yozma g'oya shu uch gapdan boshlanadi.» (79) <!-- TAXMIN T14 -->
  Natija (yashil xulosa qutisining birinchi kichik qatori): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: ikkita».
  Ipucha (40 s): Yoqilgan tugmani bosing — varaqqa nima yozilishini ko'ring. (59)
- Xulosa: Bu misolda Muammo va Yechim pitchdan aynan ko'chdi, kim uchun esa yangi gap. (76)
- `QIzoh` (qutining oxirgi kichik qatori): Muammo, kim uchun va yechimni aytadigan qisqa yozuv konsept deyiladi. (69) — atama shu yerda tug'iladi (T-011, PM-030)
- Tugma (pastki): Avval belgilang → Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar yo'qoladi, varaq fokusga (DE-199); vizual ⛶ ichida.
- Keyingi bosiladigan joy: bashorat → joriy tugma → «Davom etish».
- O'qituvchi eslatmasi: Konsept — ariza uchun qisqa yozuv; Diamond Challenge'da u ingliz tilida 3–5 betlik matn bo'ladi (rasmiy sahifa: «concept narrative»). Bugun — faqat uch gapli qoralama: muammo, kim uchun, yechim. Matnni kengaytirish va ingliz tiliga o'girish — maslahatchi bilan, keyin.
  Kim uchun — odamlar (rol bilan), son emas: son pitchning Bozor bo'lagida qoladi. Mentor misoli — namuna: o'quvchi o'z pitchidan oladi.
✎ Mentor konseptining Muammo va Yechim gaplari — tayanch 1.1 aynan; Kim uchun — yangi gap (TAYANCHGA SAVOL 4). Bashorat kaliti «ikkita» — Muammo va Yechim; Bozor faqat yo'l ko'rsatadi.

## 7 · Ariza qoralamasi  ← QMustaqil (USTAXONA — bittadan karta, 6 karta; SABOQ 9, 13, 17, 29; E 43, E 53)
- Eyebrow: Mustaqil ish
- Sarlavha: **Ariza qoralamasini olti kartaga yozing.** (39)
- Mentor (`pm-m12d1-pitch` bor): Pitchingizdan Muammo va Yechim qo'yildi: har kartani tekshirib, «Saqlash»ni bosing.
  Mentor (yo'q): Har kartadagi savolga javob bering va «Saqlash»ni bosing.
- Kirish (P-046; saqlangan narsa bo'lsa — o'zi qo'yiladi, tahrirlash mumkin; yo'q bo'lsa — bo'sh):
  - `pm-m12d1-pitch.bolaklar.muammo` → 4-karta · `.yechim` → 6-karta · `.bozor` → 5-kartada kulrang qator · `.jamoa` → 2-kartada kulrang qator. Kalit yo'q yoki `null` — karta bo'sh, kulrang qator ko'rinmaydi.
  - `pm-m12d11-dastur` (oldin saqlangan bo'lsa — darsga qaytganda) → hamma karta o'z qiymati bilan.
- **Tepada — ixcham chiziq «Arizam · n/6»:** karta nomlari, saqlangani ✓ (bo'sh uzuq qatorlar yo'q, SABOQ 17).
- **Chapda — varaq «Ariza qoralamasi»** (`ArizaSahna`; o'quvchi ma'lumoti): tepada «Dastur: …», ostida shartlar (Jamoa · Maslahatchi · Ro'yxat — ✓ / ✕ / ?), pastda «Konsept» (Muammo · Kim uchun · Yechim). Ostida o'quvchi pitchi tasmasi (ixcham).
  **O'ngda — bitta katta karta (joriy; karta tugmalari 1–6: Dastur · Jamoa · Maslahatchi · Muammo · Kim uchun · Yechim — joriysi accent, saqlangani ✓)**: karta sarlavhasi — karta nomi; maydon yoki tanlov variantlari (yorliq input ichida — E 43); ostida bitta kulrang qator; tugmalar bir qatorda: «Saqlash» · o'ngda «Yordam».
  1. **Dastur** — savol: Qaysi dasturga ariza tayyorlaysiz? · variantlar «Diamond Challenge» · «Boshqa dastur» <!-- TAXMIN T14 -->
     · kulrang (Diamond Challenge): «Shart: 14-yanvar, 2027 kuni yoshingiz 14–18 bo'lsin — o'zingiz tekshiring.» (74) <!-- TAXMIN T14 -->
     · kulrang (Boshqa dastur): «O'zbekistondagi tanlovlar nomini aytmaymiz — shartini tekshirmadik. Mentordan so'rang.» (86) <!-- TAXMIN T14 -->
     · ikkinchi savol (faqat Diamond Challenge): Saytda ro'yxatdan o'tganmisiz? · variantlar «Hali yo'q» · «Ha, o'tganman» → `royxat`
  2. **Jamoa** — savol: Jamoada necha o'quvchi bo'ladi — siz bilan birga? · variantlar 1 · 2 · 3 · 4 · «Hali bilmayman» → `jamoa`
     · kulrang: Pitchingizdagi Jamoa: «{jamoa}» (bo'lsa) · ostida doimiy kulrang «Ism yozilmaydi — faqat son.» (27)
  3. **Maslahatchi** — savol (Diamond Challenge): 21 yoshdan katta, siz taniydigan maslahatchi bormi? <!-- TAXMIN T14 --> · (Boshqa dastur): Katta yoshli maslahatchi bormi? · variantlar «Bor» · «Hali yo'q» → `maslahatchi`
     · kulrang: «Ismini yozmang — kim bo'lishini ota-onangiz bilan kelishing.» (60)
  4. **Muammo** — maydon (placeholder `Qaysi odamlar nimada qiynaladi?`; belgi sanog'i «n / 160») · kulrang: «Pitchingizdagi Muammo — kerak bo'lsa qisqartiring.» (50)
  5. **Kim uchun** — maydon (placeholder `Mahsulot kimlarga kerak?`) · kulrang: Pitchingizdagi Bozor: «{bozor}» (bo'lsa) · ostida «Sonni emas, odamlarni yozing — rol bilan.» (41)
  6. **Yechim** — maydon (placeholder `Mahsulot nima qiladi?`) · kulrang: «Mahsulot odamga nima beradi — texnologiya nomisiz.» (50)
  «Saqlash» o'ngda (187).
- Tekshiruv (`QXato`, ≤60; javob maydon ostida; «yo'naltiradi» — ikkinchi «Saqlash» bilan o'tadi, «bloklaydi» — o'tmaydi):
  - variant tanlanmagan (1, 2, 3-karta; bloklaydi): Bittasini tanlang. (18)
  - 1-karta, Diamond Challenge, ro'yxat tanlanmagan (bloklaydi): Ro'yxat holatini belgilang: «Hali yo'q» ham javob. (50)
  - 2-karta, Diamond Challenge va 1 (yo'naltiradi): Diamond Challenge'ga kamida yana bitta o'quvchi kerak. (54)
  - maydon bo'sh (4–6; bloklaydi): Bu kartaga bitta-ikkita gap yozing. (35)
  - 160 belgidan uzun (bloklaydi): 160 belgidan oshdi — gapni qisqartiring. (40)
  - «+998», «@», «t.me/», telefon shakli — 9 raqam (bloklaydi): Telefon va akkaunt nomi yozilmaydi. (35)
  - 5-karta: raqam bor (yo'naltiradi): Son pitchda qoladi — bu yerda kimlar ekanini yozing. (52)
  - 5-karta: «hamma odam», «hamma uchun», «butun dunyo», «millionlab» (yo'naltiradi): Hamma uchun emas — aniq kimlarga kerak? (39)
  - 6-karta: «React», «Expo», «NestJS», «Neon», «Render», «Netlify», «socket.io» (yo'naltiradi; 12-Modul `TEXNO_RE`): Bu texnologiya — mahsulot odamga nima beradi? (45)
  - 4–6: «tez orada», «yaqinda», «albatta», «kafolat» (yo'naltiradi; 12-Modul `VADA_RE` naqshi): Va'da emas — bugun bor narsani yozing. (38)
  - Yorliq (yo'naltiruvchi xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam (kartaga qarab bitta qator — Mentor misolidan, A-7 aynan):
  1 — Mentor misolida: Diamond Challenge — «Maydon Jamoa» konsepti uchun; saytda ro'yxat — hali yo'q. <!-- TAXMIN T14 -->
  2 — Mentor misolida: Jamoa bo'lagida bitta odam — Diamond Challenge'ga yana kamida bitta o'quvchi kerak.
  3 — Mentor misolida: maslahatchi hali aniqlanmagan.
  4 — Mentor misolida: «O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.»
  5 — Mentor misolida: «Mahallada mini-futbol o'ynaydigan o'yinchilar va o'yin e'lon qiladigan tashkilotchilar.»
  6 — Mentor misolida: «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.»
- **Harakat → Vizual o'zgarish:** variant yoki maydon → karta ichida tanlangani accent; «Saqlash» → karta kichrayib varaqdagi o'z qatoriga uchadi (~1 s yashil), tepadagi chiziqda ✓; shartlar qatorida belgi o'zgaradi:
  Jamoa 2–4 → ✓, 1 → ✕, «Hali bilmayman» → ? · Maslahatchi «Bor» → ✓, «Hali yo'q» → ✕ · Ro'yxat «Ha» → ✓, «Hali yo'q» → ? (Diamond Challenge bo'lmasa — qator kulrang «saytdan o'qing»); 4, 6-kartada tasmadagi bo'lak bir lahza yonadi (manba).
  Pastdan keyingi karta kiradi. Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`. 6/6 da karta yopiladi; varaq butun enga (uzun matn «…» bilan qisqaradi, karta cho'zilmaydi — SABOQ 29), har qatorda ✎.
- Xulosa (o'quvchi ma'lumotidan, P-046; faqat 6/6 da):
  - Diamond Challenge, jamoa 2–4, maslahatchi bor: Ariza qoralamasi tayyor: ro'yxat va topshirish — uyda, maslahatchi bilan. (73)
  - Diamond Challenge, ✕ yoki ? bor: Konsept tayyor — ✕ va ? qatorlarini uyda hal qilasiz. (53)
  - Boshqa dastur: Konsept tayyor — dastur shartini Mentordan so'rab, varaqqa yozing. (66)
- Tugma (pastki): Olti kartani yozing (N/6) → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: joriy variant yoki maydon (accent, to'lqin) → «Saqlash» (yozilgach halqada) → keyingi karta.
- Artefakt-strip (U-042): shu ekrandan — «Arizam · n/6» (ixcham); test, arena, podium va yakunda yo'q (E 50).
- Nishonlar: Program Picked! (1–3-kartalar saqlanganda) · Concept Draft! (4–6-kartalar saqlanganda).
- Mentor rejimi: forma o'rniga Mentor misolining varag'i (A-7, ochiq); o'quvchilar o'z ekranida yozadi. Mentor statistikasi: «Olti kartani yozganlar».
- Saqlash: `pm-m12d11-dastur` (A-13 shartnomasi) — har «Saqlash»da o'sha karta maydoni.
- O'qituvchi eslatmasi: ≈25 daqiqa. Eng ko'p xato: Kim uchun ga son yozish · Yechim ga texnologiya nomi · jamoa yoki maslahatchi uchun ism yozish (maydon yo'q — og'zaki aytilsa ham yozdirmang).
  Topshirish kuni 14 yoshga to'lmaydigan o'quvchi — «Boshqa dastur»: konsept qoralamasi baribir yoziladi. O'zbekistondagi tanlovlar haqida savol bo'lsa — nomini o'zingiz tekshirib, keyin ayting (dars ularning nomini aytmaydi).
  Ro'yxatdan o'tish darsda qilinmaydi: ariza saytiga shaxsiy ma'lumot — faqat ota-ona xabardorligida, maslahatchi bilan. Videoni yozish va yuborish — ota-ona roziligi bilan. <!-- TAXMIN T12 -->
✎ Olti karta — tayanch 1.11 «konsept qoralamasi + jamoa va maslahatchi kim bo'lishi» va kalit 8 maydonlari; «kim bo'lishi» — kalitda son va `bool` (ism yo'q — sinf 3, 9). Yo'nalish (Business / Social Innovation) — kartada yo'q (kalitda maydon yo'q — TAYANCHGA SAVOL 8).

## 8 · Yakuniy savol  ← QTest (✔ A, `correctIdx 0`; ikki qoida birga — ariza xavfsizligi va rasmiy shart; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv (savol ustida yorliq yo'q)
- Savol: **Konsept qoralamangiz tayyor. Arizani qanday topshirasiz?** (56)
  - ✔ A — Maslahatchi va ota-onam bilan topshiraman (41)
  - B — Ota-onamga aytmasdan, o'zim topshiraman (39)
  - C — Qoralamani o'zbekcha holicha yuboraman (38)
  - D — Hakamlarga yoqishi uchun sonlarni oshiraman (43)
- Kalit: **A** (index 0) <!-- TAXMIN T14 -->. To'rttalasi bir shaklda («…-aman»); «ota-onam» A va B da — kalit so'z faqat to'g'rida emas; tire va qavs hech birida yo'q.
  Distraktorlar uch xil turkum: B — xavfsizlik (shaxsiy ma'lumot ota-onasiz; maslahatchi ham yo'q) · C — rasmiy shart (til — ingliz) · D — halollik (arizadagi son rost bo'ladi).
- To'g'ri izohi: Ariza maslahatchi bilan, ota-ona xabardorligida beriladi. (57)
- Xato izohlari (≤60):
  - B: Ariza saytiga ma'lumot — ota-onangiz bilan. (43)
  - C: Rasmiy sahifada ariza tili qanday edi? (38)
  - D: Arizadagi son ham pitchdagidek rost bo'ladi. (44)
  - (umumiy) Ariza kim bilan va qaysi tilda topshiriladi? (44)
- Javob topilgach (kichik): varaqning «Maslahatchi» qatori accent bilan yonadi, yonida kulrang «uyda, ota-ona bilan».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol ekrandan ko'chirilmaydi (§106): 2-ekranda til va maslahatchi sharti, 7-ekranda xavfsizlik qatori bor — savol ularni bitta harakatga qo'llaydi. B hayotda rost bo'lib qolmaydi: Diamond Challenge'da maslahatchi majburiy (rasmiy sahifa), shaxsiy ma'lumot — ota-ona bilan (TAQIQLAR 3).
  D — «hakamlarga yoqishi uchun» — halollik (1-dars: sonlar faqat o'z mahsulotidan). Arena savollari bilan kalit ibora takrorlanmaydi (S-008).

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 3 savol (3, 5, 8); 2, 4, 6-ekranlar — ballsiz (2 — nishon bilan); 7-ekran «Saqlash» — Mentorga signal (`PRACTICE_BASE`, ball yo'q). Sinfda kim qaysi dasturni tanlagani sanalmaydi (TAQIQLAR 3).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Jamoa sharti» · 5 — «2 — Yosh yozilmagan sahifa» · 8 — «Yakuniy — ariza qanday topshiriladi»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi yengil accent chegara bilan (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/3 to'g'ri
- Sarlavha (holatga qarab — P-046, E 54; ✓ va nishon — faqat birinchi holatda; sarlavha o'quvchi qilgan ishni aytadi):
  - 6/6 saqlangan, Diamond Challenge, jamoa 2–4, maslahatchi bor: **Diamond Challenge uchun ariza qoralamasi yozildi.** (49) <!-- TAXMIN T14 -->
  - 6/6 saqlangan, Diamond Challenge, jamoa 1 yoki noma'lum, yoki maslahatchi yo'q: **Konsept yozildi: jamoa yoki maslahatchi hali aniq emas.** (55)
  - 6/6 saqlangan, boshqa dastur: **Konsept yozildi — dastur shartini aniqlash qoldi.** (49)
  - 1–5 karta saqlangan: **Ariza qoralamasi hali tugamagan: {n} / 6 karta.** (47)
  - birorta karta saqlanmagan: **Ariza qoralamasi hali yozilmagan.** (33)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yo'q (E 50; fikr A-2 da — darsning ichki o'qi).
- Endi siz bilasiz (T-048 — asosiy fikr so'zma-so'z takrorlanmaydi; ta'riflar — T-042):
  - Ariza berishdan oldin rasmiy sahifadagi shartlar o'qiladi; sahifada yo'q gap — taxmin.
  - Diamond Challenge'da jamoa — 2–4 o'quvchi, topshirish kuni 14–18 yosh; maslahatchi — 21 yoshdan katta. <!-- TAXMIN T14 -->
  - Y Combinator sahifasida yosh yozilmagan, lekin to'liq vaqt kutiladi — maktab o'quvchisi uchun bugungi yo'l emas. <!-- TAXMIN T14 -->
  - Muammo, kim uchun va yechimni aytadigan qisqa yozuv konsept deyiladi; u pitchdan olinadi.
  - Ariza berish qabul qilinish degani emas: ariza maslahatchi bilan, ota-ona xabardorligida topshiriladi.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: o'z arizangiz · Nechta: 3 ish · Muddat: keyingi darsgacha
  - ① Yozilmagan kartalar qolgan bo'lsa — ularni to'ldiring. Hammasi yozilgan bo'lsa ① ko'rinmaydi.
  - ② Tanlagan dasturingizning rasmiy sahifasini ota-onangiz bilan oching va shartlarni birga o'qing (Diamond Challenge — `diamondchallenge.org/competition`). <!-- TAXMIN T14 -->
  - ③ Ariza bermoqchi bo'lsangiz — jamoa va maslahatchi bo'lishi mumkin bo'lgan odamlar bilan gaplashing; ularning ismini hech qayerga yozmang.
  - Karta ostida (bitta kulrang qator): Ro'yxatdan o'tish — xohlasangiz, faqat maslahatchi va ota-ona bilan, uyda.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Keyingi olti oyda nima qilasiz?»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib (E 50): belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. «Bugungi asosiy fikr» qutisi, holat belgilari, artefakt-strip — yakunda yo'q. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): uyga vazifada keyingi dars mazmuni aytilmaydi (T-038; «Keyingi dars» qatori — RAD etilgan band, qoladi). ② — tanish doira (ota-ona), rasmiy sahifa; ③ — «ariza bermoqchi bo'lsangiz» (ixtiyoriy narsa majburiydek aytilmaydi — sinf 14); ism yozilmaydi (sinf 9).
  Yakun sarlavhalari kalitdan yig'iladi: saqlangan kartalar soni · `dastur` · `jamoa` · `maslahatchi` (P-046). ✓ va nishon — faqat 1-holatda.

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi, ≤48 belgi)
- **Source Reader!** (2-ekran, olti gap birinchi urinishda) — Rasmiy sahifadagi gapni taxmindan ajratdingiz (45)
- **Team Rule!** (3-ekran, 1-savol birinchi urinishda) — Jamoa shartini o'z holatingizga qo'lladingiz (44)
- **Program Picked!** (7-ekran, 1–3-kartalar saqlanganda) — Dastur, jamoa va maslahatchini belgiladingiz (44)
- **Concept Draft!** (7-ekran, 4–6-kartalar saqlanganda) — Konsept qoralamasini uch gapga yozdingiz (40)
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda. 4, 6-ekranlar (tugmali tushuncha) nishonsiz. Program Picked! — «Hali yo'q», «Hali bilmayman» tanlansa ham beriladi: tavsif belgilashni aytadi, «tayyor» demaydi. Nomlar boshqa darslarda yo'q (grep — «O'lchov»).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **3 · Jamoa sharti** — 1 Diamond Challenge'da jamoa — 2–4 maktab o'quvchisi. · 2 Topshirish kuni har a'zo 14–18 yoshda bo'ladi. · 3 Yordam beradigan 21 yoshdan katta odam — jamoa a'zosi emas, maslahatchi. <!-- TAXMIN T14 -->
  — Sinfga savol: Mahsulotni yolg'iz qurgan bo'lsangiz, jamoaga kimni chaqirasiz?
- **5 · Yosh yozilmagan sahifa** — 1 Sahifada yosh yozilmagani ruxsat ham, taqiq ham emas. · 2 Qolgan shartlar ham o'qiladi: vaqt va joy. · 3 Y Combinator to'liq vaqt va San-Fransiskoda yuzma-yuz ishlashni kutadi. <!-- TAXMIN T14 -->
  — Sinfga savol: Rasmiy sahifada yana qaysi shartlarni qidirasiz?
- **8 · Ariza qanday topshiriladi** — 1 Ariza maslahatchi bilan topshiriladi. · 2 Ariza saytiga shaxsiy ma'lumot — ota-ona xabardorligida. · 3 Diamond Challenge'ga ariza ingliz tilida; undagi har son rost bo'ladi. <!-- TAXMIN T14 -->
  — Sinfga savol: Arizangizni kim bilan topshirasiz?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Xalqaro dastur nima? | Jamoalar ariza berib, tanlab olinadigan xalqaro tanlov yoki dastur | Diamond Challenge — tanlov, Y Combinator — dastur |
| Ariza nima? | Dasturga qatnashish uchun topshiriladigan yozuv va fayllar | Bugun — uning qoralamasi |
| Dastur shartini qayerdan o'qiysiz? | Dasturning rasmiy sahifasidan | Sahifada yo'q gap — taxmin |
| Diamond Challenge'da jamoa qanday bo'ladi? | 2–4 maktab o'quvchisi, topshirish kuni 14–18 yosh | Rasmiy sahifa, 08.10.2026 <!-- TAXMIN T14 --> |
| Maslahatchi kim? | Jamoaga yordam beradigan katta yoshli odam | Diamond Challenge'da — 21 yoshdan katta; ismi hech qayerga yozilmaydi <!-- TAXMIN T14 --> |
| Diamond Challenge'ning birinchi bosqichida nima topshiriladi? | Ingliz tilida 3–5 betlik yozma g'oya va 60 soniyalik video | Video — ota-ona roziligi bilan <!-- TAXMIN T14, T12 --> |
| 2027-yil tanlovida topshirish muddati qachon? | 14-yanvar, 2027 | Sana saytda o'zgarishi mumkin — saytning o'zidan tekshiring <!-- TAXMIN T14 --> |
| Sahifada yosh yozilmagani nimani bildiradi? | Ruxsat ham, taqiq ham emas: qolgan shartlar ham o'qiladi | Y Combinator sahifasida yosh yozilmagan, lekin to'liq vaqt kutiladi <!-- TAXMIN T14 --> |
| Nega Y Combinator maktab o'quvchisi uchun bugungi yo'l emas? | Asoschilar dastur davomida va keyin to'liq vaqt ishlaydi, dastur San-Fransiskoda | Early Decision — o'qishini tugatmoqchi talabalar uchun <!-- TAXMIN T14 --> |
| Konsept nima? | Muammo, kim uchun va yechimni aytadigan qisqa yozuv | Diamond Challenge'da — ingliz tilida, 3–5 bet |
| Konsept qoralamasi qayerdan olinadi? | Pitchdan: Muammo va Yechim ko'chadi, kim uchun — yangi gap | Sonlar pitchning Bozor bo'lagida qoladi |
| Ariza bersangiz, qabul qilinasizmi? | Bunday va'da yo'q: finalistlarni dastur tanlaydi | Ariza maslahatchi bilan, ota-ona xabardorligida topshiriladi |
- §145: har javobdagi so'z darsda bor (xalqaro dastur, maslahatchi, shartlar — 2 · Y Combinator, to'liq vaqt, Early Decision — 4 · konsept — 6 · ariza, ota-ona — 7, 8).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). «Konsept nima?» javobi — 6-ekran `QIzoh` va yakun bilan so'zma-so'z (T-042).

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Diamond Challenge jamoasida nechta o'quvchi bo'ladi? (2) <!-- TAXMIN T14 -->
   - ✔ 2 tadan 4 tagacha
   - 1 tadan 3 tagacha
   - 3 tadan 6 tagacha
   - 5 tadan 10 tagacha
2. Topshirish kuni jamoa a'zolari necha yoshda bo'ladi? (2) <!-- TAXMIN T14 -->
   - 12 yoshdan 16 yoshgacha
   - ✔ 14 yoshdan 18 yoshgacha
   - 16 yoshdan 21 yoshgacha
   - 18 yoshdan 25 yoshgacha
3. Diamond Challenge'da maslahatchi kamida necha yoshda? (2) <!-- TAXMIN T14 -->
   - 16 yoshdan katta
   - 18 yoshdan katta
   - ✔ 21 yoshdan katta
   - 25 yoshdan katta
4. Diamond Challenge'ga ariza qaysi tilda yoziladi? (2) <!-- TAXMIN T14 -->
   - O'zbek tilida
   - Fransuz tilida
   - Istalgan tilda
   - ✔ Ingliz tilida
5. Ariza bergan har jamoa finalga chiqadimi? (2) <!-- TAXMIN T14 -->
   - ✔ Yo'q, finalistlar tanlab olinadi
   - Ha, ariza bergan hamma chiqadi
   - Ha, onlayn qatnashganlar chiqadi
   - Yo'q, faqat Amerika jamoasi chiqadi
6. Y Combinator sahifasida qaysi yosh chegarasi yozilgan? (4) <!-- TAXMIN T14 -->
   - 14 yoshdan
   - ✔ Yozilmagan
   - 16 yoshdan
   - 21 yoshdan
7. Y Combinator asoschilardan nimani kutadi? (4) <!-- TAXMIN T14 -->
   - Faqat ta'tilda ishlashni
   - Faqat onlayn ishlashni
   - ✔ To'liq vaqt ishlashni
   - Haftada bir kun kelishni
8. Y Combinator dasturi qayerda o'tadi? (4) <!-- TAXMIN T14 -->
   - Toshkent shahrida
   - Istalgan shaharda
   - Faqat internetda
   - ✔ San-Fransiskoda
9. Early Decision kim uchun? (4) <!-- TAXMIN T14 -->
   - ✔ O'qishini tugatmoqchi talabalar
   - 14–18 yoshli maktab o'quvchilari
   - Diamond Challenge finalistlari
   - Kompaniyada ishlayotgan kattalar
10. Konsept qaysi uch qismdan iborat? (6)
   - Bozor, Raqamlar va Jamoa
   - ✔ Muammo, kim uchun, yechim
   - Yosh, til va maslahatchi
   - Muddat, mamlakat va video
11. Konseptdagi «Kim uchun» qatoriga nima yoziladi? (6)
   - Guruhdagi odamlarning soni
   - Mahsulotning texnologiyasi
   - ✔ Mahsulotga muhtoj odamlar
   - Jamoa a'zolarining ismlari
12. Sinfdosh aytgan gap rasmiy sahifada yo'q. U nima? (2)
   - Rasmiy shart
   - Ariza qismi
   - Muhim qoida
   - ✔ Faqat taxmin
- Arena yozuvlari — platforma shabloni (namuna 12-Modul YAKUNIY dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — dastur, ariza, shart, jamoa, maslahatchi, konsept, muddat, pitch, sahifa, tanlov · uyga vazifa banneri — ariza, shart, konsept (faqat so'z, emojisiz).
- Izoh (MD): 1–3 — rasmiy sonlar; distraktorlar shu shkalada (son, yosh), «rost, lekin mos emas» · 4 — til (rasmiy: ingliz) · 5 — finalistlar tanlanadi (rasmiy sana bor); «faqat Amerika» — sahifadagi «Any Country» ga zid · 6 — 18 olinmadi (norasmiy manbalarda bor — distraktor hayotda «rost» bo'lib qolmasin) ·
  7 — «haftada bir necha soat» olinmadi (FAQ da boshqa kontekstda bor) · 9 — «14–18 yoshli» — Diamond Challenge sharti, Early Decision emas · 10 — pitch bo'laklari va shartlar — boshqa narsalar · 12 — 2-ekran xulosasi («sahifada yo'q gap — taxmin»), boshqa so'z bilan.

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/12-Modull/PmProgramsLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META` `pm-m12d11-v1` · «Qaysi xalqaro dasturga ariza berasiz?».
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s6 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s7 `QMustaqil` · s9 `QNatija` · s10 `QKartochka` · s11 `QYakun`.
2. **`ArizaSahna`** — bitta vizual (180): `Brauzer` (manzil satri, nom — `Brend` komponenti, rang ⛔ «qur» da rasmiy saytdan, logotip yo'q; S-018 izoh qatori; qatorlar `DASTUR_SHART` dan; holatlar kulrang · yongan · ✓) ·
   `Varaq` (`rejim: 'shartlar' | 'solishtirish' | 'ariza'`; jadval — to'q sarlavha qatori, katak chiziqlari, kulrang fon, soyasiz — E 45; uzuq bo'sh qator — U-041) · `PitchTasma` (olti bo'lak, bir qatordan, `fokus` — bitta bo'lak yonadi; yorliq «Mentor misoli · Maydon Jamoa»).
   Dars ichida yoziladi (K-020); rangli yon chiziq yo'q; `reduced-motion`; 393 da brauzer varaq ustida. Qolip-maket izohi faylda (`// qolip-maket: …`).
3. **Bitta manbalar:** `DASTUR_SHART` (A-6: `diamond` — 6 qator + `yonalish`, `bosqich1`; `yc` — 3 qator + `early`; har qatorda `uz` va `asl` (inglizcha iqtibos — faqat kod izohida, o'quvchiga chiqmaydi)) · `JAMOA_PITCH` (1-dars, tayanch 1.1 aynan) · `MENTOR_KONSEPT` · `MENTOR_ARIZA` (A-7) ·
   `GAP_KARTA` (2-ekran: 6 × `{ matn, javob: 'bor' | 'yoq', qator }`). s0, s2, s4, s6, s7 (Yordam, mentor rejimi) shundan o'qiydi.
4. s0: `QKirish` — javoblar «Aynan!» / «Qiziq fikr!», ballsiz (`correct: false` hammaga — J-026); maket `pm-m12d1-pitch.bolaklar` dan (yo'q bo'lsa `JAMOA_PITCH` + yorliq); tanlovga qarab brauzer qatori yonadi, «?» qoladi.
5. s2: `QBashorat` (2 · 4 · 6) → 6 karta ketma-ket (E 53), tugmalar «Sahifada bor» · «Sahifada yo'q»; to'g'ri — qator yonadi va karta varaqqa uchadi / «Taxmin» qatoriga tushadi; xato — silkinish + `QXato`; 3-kartadan keyin `QIzoh` (maslahatchi); 6/6 da muddat qatori, `tugadi`; nishon `sourceReader` (xato 0).
6. s4: `QBashorat` (14 · 16 · yozilmagan) → 3 tugma; varaq `solishtirish` rejimi; 2-tugmadan keyin `QIzoh`; 3/3 da «Bugun maktab o'quvchisi uchun» qatori; yashil quti — taxmin · xulosa · `QIzoh` (Early Decision).
7. s6: `QBashorat` (bitta · ikkita · uchta) → 3 tugma; `PitchTasma` Mentor misoli; 2-tugmada Bozor bo'lagidagi sonlar uchmaydi (kulrang qoladi), yangi gap yoziladi; 3/3 da kulrang qator (3–5 betlik yozma g'oya); `QIzoh` (konsept).
8. s7: 6 bosqichli forma (ketma-ket karta, E 53): 1 — variantlar `diamond` / `boshqa` (+ Diamond Challenge'da ro'yxat variantlari) · 2 — variantlar 1–4 / «Hali bilmayman» · 3 — variantlar «Bor» / «Hali yo'q» · 4–6 — `textarea` ≤160 (belgi sanog'i).
   O'qiydi `pm-m12d1-pitch` (`bolaklar.muammo`, `.yechim` — oldindan; `.bozor`, `.jamoa` — kulrang qator); kalit yo'q — bo'sh. Tekshiruv funksiyasi (bo'sh · 160 · telefon/@/t.me · 5-kartada raqam · «hamma» so'zlari · `TEXNO_RE` · va'da so'zlari · DC + jamoa 1) —
   PM-108 tartibida kamida 10 namuna bilan `node` da sinaladi (apostrof `normT` bilan — 12-Modul naqshi). Varaqdagi shart belgilari (✓ / ✕ / ?) — A-13 qiymatlaridan. Artefakt-strip «Arizam» (U-042); nishonlar `programPicked`, `conceptDraft`.
9. **Saqlash** `localStorage` `pm-m12d11-dastur` = `{ dastur, jamoa, maslahatchi, qoralama: { muammo, kimUchun, yechim }, royxat, savedAt }` (A-13 shartnomasi: `'diamond' | 'boshqa' | null` · `1–4 | null` · `bool | null` · `string | null` ×3 · `bool | null` — faqat `diamond` da, aks holda `null`).
   Har «Saqlash»da o'sha karta maydoni yoziladi (birlashtiriladi), `savedAt` yangilanadi. Ism, telefon, email, havola hech qaysi maydonga yozilmaydi (sinf 3). Boshqa darsning kalitiga yozmaydi.
10. **App.jsx** (asosiy seans; bu agent tegmaydi): `m12-11` qatoriga `comp: PmProgramsLesson` + import. `sub` — o'zgarmaydi («Diamond Challenge, Y Combinator: shartlar va ariza»).
11. Testlar s3/s5/s8 — `correctIdx` 1/3/0 = `INLINE_KEYS`; `RECAPS` 3/5/8 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6). Kichik vizual — `QuestionScreen` `vizual`, javob topilgach (SABOQ 4).
    Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
12. Jonli ball: `INLINE_KEYS` = { s3: 1, s5: 3, s8: 0, shartlar: -1, solishtirish: -1, konsept: -1, practice: -1 }; `SCREEN_META` == screens; `SCREEN_INTENTS`.
13. `ACHIEVEMENTS` 4 (`sourceReader`, `teamRule`, `programPicked`, `conceptDraft`) · `FLASHCARDS` 12 · s11 `RECAP` 5 band = yakundagi «Endi siz bilasiz» so'zma-so'z · «Bugungi asosiy fikr» — yakunda yo'q (E 50) ·
    yakun sarlavhasi — saqlangan kartalar soni, `dastur`, `jamoa`, `maslahatchi` dan (5 holat) · `HW_TOKENS` — faqat so'z · yordam darajalari (P-033: qulf-yorliq · ipucha 40 s · rescue 110 s).
14. Uyga vazifa — `HwCard` («Kim uchun · Nechta · Muddat», 3 band, ① shartli); alohida `.homework.jsx` yo'q.
15. Tashqi havola: darsda bosiladigan tashqi havola yo'q (manzil satri — maket matni); uyga vazifa ② da manzil matn sifatida. ⛔ «qur» da `diamondchallenge.org/competition` tirikligi qayta tekshiriladi (P-028).
- Darvozalar: `npm run gates -- src/12-Modull/PmProgramsLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).
  ⚠️ CSS izohida va kod namunasi ichida backtik yo'q (CLAUDE.md); qo'shtirnoqli gaplar JS satrida ekranlanadi.

## REPO
Amaliy blok yo'q (PM darsi, kod ekrani yo'q) — o'quvchi repo'siga ham, `maydon-jamoa` ga ham tegilmaydi. <!-- TAXMIN T4 -->

| Teg | Holat |
|---|---|
| `m14-dars-11-start` | = `m14-dars-10-done` (= `07-done`, tayanch 3 jadvali) |
| `m14-dars-11-done` | = `m14-dars-11-start` (tayanch 3: 8…13 — `07-done`; ariza va konsept repo'ga yozilmaydi) |

«Ortda qoldingizmi» bu darsda yo'q (amaliy blok yo'q).

## Manbalar (o'zim tekshirgan fayl, qator va sahifalar, 08.10.2026)
- **diamondchallenge.org/competition** (WebFetch, 08.10.2026) — iqtiboslar aynan: «Teams must consist of 2-4 high school students aged 14-18 at the submission deadline.» · «Each team is required to have one adult advisor aged 21 or older.» · «All submissions are to be written in English.» ·
  «Written concept narratives and introductory videos serve as a submission requirement solely during the first round of the competition.» · «The narrative is limited to 3-5 pages, double-spaced, utilizing a 12-point font and a 1-inch (2.54 cm) margin.» · «Any Idea, Any Team, Any Country» ·
  «Alternatively, participants have the option to compete virtually by uploading a pitch deck and a recorded video pitch for judging.» · «Pitches are strictly limited to 5:00 minutes utilizing a pitch deck recommended to be no more than 15 slides.» (faqat O'qituvchi eslatmasi uchun — darsda ishlatilmadi) ·
  Business Innovation — «a concept's primary purpose is to solve a customer problem, that by doing so will generate revenue and profit.» · Social Innovation — «a concept's primary purpose is to solve a social problem and make a positive impact on people or the environment.» ·
  Sanalar: ro'yxat 16-sentabr, topshirish «January 14» «5PM EST», finalistlar 9-mart, Summit 29–30-aprel (2027-yil tanlovi). Qatnashish puli — sahifada yozilmagan. Tayanch 6 va `00-MANBA.md` 5 bilan mos.
- **ycombinator.com/faq** (WebFetch, 08.10.2026): yosh haqida gap yo'q · «You can certainly apply when you are a full-time student or employee, but we expect the founders to commit to working full-time on their company during the batch and afterwards if accepted.» ·
  «The batch takes place in-person in San Francisco.» **ycombinator.com/early-decision**: «This program is designed for students who want to finish their degree before starting a company.» Tayanch 1.11 va `00-MANBA.md` 5 bilan mos.
- diamondchallenge.org/faq — 404 (08.10.2026); maslahatchi kim bo'lishi mumkinligi (ota-ona, o'qituvchi) rasmiy sahifada topilmadi → darsda «21 yoshdan katta, siz taniydigan odam; kimligini ota-onangiz bilan kelishing» (da'vosiz).
- `feedback/F-1008-14modul/00-MODUL-TAYANCH.md` 1.0, 1.1, 1.11, 1.12, 1.14, 2, 3, 4, 6, 7, 8, 9 · `00-TAQIQLAR.md` · `00-NOMLAR.md` · `00-MANBA.md` 1, 4, 5 · `qaror-0.json` (DASTUR) · `MD_TOPSHIRIQ_2.md` · `01-PmInvestorPitch-v3.md` (A-6 — Mentor pitchi, `HAKAM_SAVOL`, QMustaqil tekshiruvlari).
- `src/App.jsx` 476–478 (`m12-10`, `m12-11` nomi va osti, `m12-12`) — grep 08.10.2026.
- 13-Modul `07-PmTerms-v3.md` + `07-FILTR.md` (shakl), `00-TAQIQLAR.md` 3 (real odamlar) · 12-Modul `QURUVCHI_SABOQ.md` E 40–55 · `src/10-Modull/PmGrowthPitchLesson.jsx` (`TEXNO_RE`, `VADA_RE` — 01 pilot havolasi bilan).
- Tekshirilmagan (darsda da'vo qilinmaydi): O'zbekistondagi tanlov va grantlar · Diamond Challenge va Y Combinator brend ranglari · maslahatchiga qo'shimcha talablar · ro'yxat sahifasining tugma va menyu nomlari.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Rasmiy faktlar qo'shildi (tayanch 6 dan tashqari, 08.10 WebFetch, iqtiboslar «Manbalar»da):** Diamond Challenge — hamma narsa ingliz tilida · birinchi bosqichda 3–5 betlik yozma g'oya (concept narrative) va 60 soniyalik tanishtiruv videosi · istalgan mamlakatdan, onlayn qatnashish ham bor; Y Combinator — dastur San-Fransiskoda, yuzma-yuz.
   Taklif: tayanch 6 va 1.11 ga qo'shish (12-dars reja va 13-dars uchun ham kerak bo'lishi mumkin). Sovrin, hamkor shaharlar, 5:00 pitch qoidasi — darsda yo'q.
2. **«tashkilotchi bilan aniqlanadi» (tayanch 1.11, lokal grantlar):** «tashkilotchi» bu modulda «Maydon Jamoa» roli (T-015) — o'quvchi matnida «Mentordan so'rang» deb yozdim; «grant» so'zi o'quvchi matnida yo'q («O'zbekistondagi tanlovlar»). Tasdiq kerak.
3. **Mentor misolida dastur va shartlar** tayanchda faqat 1.12 da («Diamond Challenge'ga jamoa bilan konsept»): jamoa soni, maslahatchi, ro'yxat yo'q. Yozganim: dastur — Diamond Challenge · jamoa — «Jamoa bo'lagida bitta odam — yana kamida bitta o'quvchi kerak» (1.1 + rasmiy shart; yangi son yo'q) · maslahatchi — «hali aniqlanmagan» · ro'yxat — «hali yo'q». Taklif: tayanch 1.11 ga.
4. **Mentor konseptining «Kim uchun» gapi** — yangi: «Mahallada mini-futbol o'ynaydigan o'yinchilar va o'yin e'lon qiladigan tashkilotchilar.» (1.0 dagi mahsulot va rollardan, son yo'q). Muammo va Yechim — 1.1 aynan. Taklif: tayanch 1.11 ga `MENTOR_KONSEPT`.
5. **Mentor (o'qituvchi) va yosh sharti:** Diamond Challenge 14–18 yoshli o'quvchilar uchun; Mentor misoli — kursdagi namuna mahsulot. Mentor misolida yosh qatori ko'rsatilmaydi (har a'zo o'zi tekshiradi), dastur — «"Maydon Jamoa" konsepti uchun». Shu yetarlimi yoki Mentor misoli faqat konsept bilan cheklansinmi?
6. **«jamoa» ikki joyda:** Diamond Challenge jamoasi (2–4 o'quvchi) va pitchdagi Jamoa bo'lagi — bir ma'no (mahsulotni qiladigan odamlar); bo'lak nomi bosh harf bilan, dastur jamoasi — kichik harf bilan prozada. Tayanch 2 dagi «Jamoa (bo'lak)» qatoriga eslatma taklifi.
7. **`pm-m12d11-dastur` sxemasi aniqlashtirildi** (tayanch 8 da tiplar yo'q): `jamoa` — o'quvchi bilan birga 1–4, «Hali bilmayman» — `null` · `qoralama.*` — `string | null` · `royxat` — faqat `diamond` da so'raladi, aks holda `null` · `dastur` — `'boshqa'` da dastur nomi saqlanmaydi. Tasdiqlansa — tayanch 8 ga.
8. **Yo'nalish (Business Innovation / Social Innovation)** — tayanch 1.11 da bor, kalitda maydon yo'q: darsda faqat O'qituvchi eslatmasida (ta'riflar rasmiy), o'quvchi tanlamaydi. `yonalish: 'business' | 'social' | null` maydoni qo'shilsinmi (1-kartaga bitta qator)?
9. **Brend ranglari** Diamond Challenge va Y Combinator — tayanchda yo'q; «qur» da rasmiy saytdan olinadi (logotipsiz). Taxmin qilmadim.
10. **«xalqaro dastur» ta'rifi** (tayanch 2: «startap tanlovi yoki akseleratori») — o'quvchi matnida: «Jamoalar ariza berib, tanlab olinadigan xalqaro tanlov yoki dastur — xalqaro dastur deyiladi.» («startap», «akselerator» — izohsiz jargon; 01 pilot «startap»ni ishlatmagan). Tasdiq kerak.
11. **Diamond Challenge videosi:** birinchi bosqichda 60 soniyalik video bor — TAQIQLAR 1 video qoidasi qo'llandi («ota-ona roziligi bilan»; bugun video yozilmaydi). 9-dars video-portfolio bilan bog'lanmadi (va'da bo'lib qolmasin). To'g'rimi?
12. **Sovrin fondi** (sahifada bor) va **qatnashish puli** (sahifada aniq yo'q) — o'quvchi matnida aytilmaydi (pul va natija va'dasi xavfi; sinf 17). O'qituvchi eslatmasida «gapirmang». Tasdiq kerak.
13. **Muddat vaqti** — «5PM EST»: O'qituvchi eslatmasida «Toshkentda 15-yanvar, 03:00» (EST = UTC−5, yanvar; Toshkent UTC+5) — o'quvchi matnida faqat sana. To'g'rimi?
14. **Topshirish kuni yoshi:** Diamond Challenge yoshni «at the submission deadline» deb aytadi — 1-kartada «14-yanvar, 2027 kuni yoshingiz 14–18 bo'lsin — o'zingiz tekshiring»; yosh kalitga yozilmaydi (sxemada yo'q). Shu yetarlimi?

## Shubhali joylar (ishonchim komil emas)
- ⛔ **«Qur» darvozasi:** 7-ekran — 25 daqiqa (12–15 o'quvchi bilan taymer) · 7-ekran tekshiruv funksiyasi — `node` da namuna bilan · `ArizaSahna` uch blok 1280×800 va 393 da kesilmasdan sig'ishi (U-006, E 41) · dastur sahifalari (`diamondchallenge.org/competition`, `ycombinator.com/faq`) «qur» kuni qayta ochiladi — sana yoki shart o'zgargan bo'lsa MD va dars birga tuzatiladi · brend ranglari.
- **Sanalar eskiradi:** darsda «2027-yil tanlovi» sanalari; kurs keyingi oqimda o'tilsa yoki 14.01.2027 dan keyin bo'lsa — 2, 7-ekran, kartochka 7 va O'qituvchi eslatmasi yangilanishi kerak. «Sana saytda o'zgarishi mumkin» qatori bor, lekin sonlar qattiq yozilgan.
- **«O'qiyotgan odam ham ariza bera oladi»** (Y Combinator, 4-ekran 1-tugma) — FAQ «full-time student» deydi; maktab o'quvchisi uchun ham to'g'rimi — rasmiy gap aniq emas. Shuning uchun xulosa «to'liq vaqt kutadi — bugungi yo'l emas» (tayanch qarori) va katak «hali to'sqinlik yo'qdek» faqat bir lahza.
- **Arena 6 va bashorat 4-ekran:** «18 yoshdan» variant ataylab olinmadi (norasmiy manbalarda bor). O'quvchi internetda «18» ni ko'rsa, darsdagi «yozilmagan» bilan ziddek tuyulishi mumkin — O'qituvchi eslatmasi buni yopadi.
- **«Bir-ikki sinfdoshimni jamoaga chaqiraman»** (3-ekran ✔ B) — Diamond Challenge'da jamoa bir maktabdan bo'lishi shartmi — rasmiy sahifada ko'rmadim; «sinfdosh» — misol, shart emas deb oldim.
- **Rasmiy iqtiboslar** WebFetch orqali olingan (sahifa matnini kichik model qaytaradi); ikkinchi so'rovda «so'zma-so'z» deb qayta tekshirildi va tayanch 6 / `00-MANBA.md` 5 bilan mos chiqdi. ⛔ «qur» kuni sahifalar brauzerda qo'lda ochilib, A-6 jadvali solishtirilsin.
- **3-ekran C** — «25 yoshli akam»: qarindosh roli bilan, ismsiz — o'ylab topilgan qahramon emas deb oldim (testdagi holat).
- **7-ekran 5-karta raqam detektori** «14–18 yoshli o'smirlar» kabi to'g'ri yozuvni ham ushlaydi (yo'naltiradi, ikkinchi «Saqlash» bilan o'tadi) — soxta signal, qabul qildim.
- **«maktab o'quvchisi»** — rasmiy «high school students» (AQShda 9–12-sinf); O'zbekistondagi qaysi sinflarga to'g'ri kelishi aytilmadi — faqat yosh (14–18) aytiladi.

---

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 18 band)
1. [x] **90 daqiqa — reja** — A-14: taqsimot (≈82 + 8 zaxira), «Ulgurmasangiz» (7 — saqlangani qoladi, uyga vazifa ①, yakun «hali tugamagan»; 6 — Mentor o'zi ko'rsatadi; arena qisqarsa — kartochkalar uyda), ⛔ pilotda taymer; «sig'adi» yo'q. Amaliy blok yo'q.
2. [x] **Tekshirilmagan tashqi qadam** — ro'yxat va topshirish darsda yo'q (uyda, maslahatchi bilan); sayt tugma va menyu nomlari aytilmaydi; rasmiy faktlar — sana va havola bilan (A-6, Manbalar); ⛔ «qur» kuni sahifalar qayta ochiladi; brend ranglari ⛔.
3. [x] **Saqlash kaliti — shartnoma** — `pm-m12d11-dastur` (A-13, KOD 9): har maydon tipi, uch holat (`bool | null`), `royxat` faqat `diamond` da; ism, telefon, maslahatchi kimligi, havola yo'q; boshqa dars kalitiga yozmaydi; o'qiydi faqat `pm-m12d1-pitch` (jadvaldagi kalit).
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor misolida» (7 Yordam), «Bu misolda» (6 xulosa); olti karta — bu darsdagi qolip; «Bugun maktab o'quvchisi uchun» — rasmiy shartlardan (4).
5. [x] **Kafolat va sabab da'vosi yo'q** — «qabul qilinasiz», «finalga chiqasiz» yo'q (2-ekran 6-gap — rad etiladigan taxmin; kartochka 12; yakun 5-qator «qabul qilinish degani emas»); Y Combinator pul va ulushi aytilmaydi.
6. [x] **Yakun, nishon — faqat rost holatda** — 11-ekran 5 holat (hech narsa yozilmagan holati bilan — E 54); ✓ va nishon faqat 1-holatda; Program Picked! tavsifi «belgiladingiz» (natija emas).
7. [x] **Ta'rif sanaladigan** — shartlar sonli va sanali (2–4 · 14–18 topshirish kuni · 21 · 14-yanvar, 2027); «kim uchun» — odamlar, son emas (6, 7); maslahatchi — «katta yoshli» + Diamond Challenge'da 21.
8. [x] **Test: bitta himoyalanadigan javob** — s3 (shartni e'tiborsiz · yosh aralash · yolg'on), s5 (shoshilib «mumkin» · norasmiy manba · shoshilib rad), s8 (xavfsizlik · til · halollik); har testda uch turkum; s3 C va s8 B hayotda rost bo'lib qolmaydi (Izoh MD).
9. [x] **Real odamlar xavfsizligi** — jamoa va maslahatchi ismsiz (7 — son va «Bor / Hali yo'q»); ro'yxat va ariza — uyda, maslahatchi va ota-ona bilan (1, 7, 8, 11); video — ota-ona roziligi bilan; podium — faqat test ballari; Mentor nomidan hech narsa yuborilmaydi.
10. [—] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — bu darsda agent ishlamaydi, tekshiruv akkaunti yo'q.
11. [x] **Web-trek teng yo'l** — dastur shartlari va konsept trekka bog'liq emas (A-11); matnda «mahsulot»; testlar ikkala trekka to'g'ri.
12. [x] **Mentor misoli ichki izchil** — pitch gaplari 1-dars aynan (6, 7 Yordam); Jamoa bo'lagi «bitta odam» → «yana kamida bitta o'quvchi» (3-ekran javobi bilan bir); 12-dars Mentor misoli «Diamond Challenge'ga jamoa bilan konsept» bilan mos; keyingi dars natijasi ochilmaydi.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — 7-ekran: dastur, jamoa, maslahatchi, kim uchun — o'quvchi tanlaydi; Mentor gaplari faqat Yordam'da; oldindan qo'yilgani — o'quvchining o'z pitchi.
14. [x] **Uyga vazifa yengil va aniq** — 3 ish: ① shartli, ② ota-ona bilan sahifani o'qish, ③ «ariza bermoqchi bo'lsangiz» (ixtiyoriy); ro'yxat — kulrang qatorda «xohlasangiz».
15. [x] **Ayb da'vosi yo'q** — xato izohlari va `QXato` lar keyingi qadamni aytadi («Sahifada … deyilgan?», «Ro'yxat holatini belgilang»); «sizning xatongiz emas» yo'q.
16. [x] **Kelajak va'dasi yo'q** — «tez orada», «yaqinda» — faqat 7-ekran detektorida; keyingi dars mazmuni va'da qilinmaydi; video-portfolio bilan bog'lanmadi; «universitet yillarida» — yo'l mavjudligi (rasmiy), va'da emas.
17. [x] **Pul va investitsiya** — pul so'ralmaydi; sovrin, qatnashish puli, Y Combinator puli — o'quvchi matnida yo'q (O'qituvchi eslatmasi: «gapirmang»).
18. [x] **Yosh va rasmiy shartlar** — faqat rasmiy sahifadagi shartlar (A-6, sana bilan); Y Combinator — «yosh yozilmagan» (norasmiy «18» aytilmaydi); O'zbekistondagi tanlovlar — nomsiz, «Mentordan so'rang»; yosh — «topshirish kuni, o'zingiz tekshiring».
+ **RAD etilganlar saqlangan:** hookdagi «Aynan!» / «Qiziq fikr!» (0) · «Keyingi dars — «…»» qatori (11) · reja sarlavhasi — natija-gap (1) · ≤3 blok (2, 4, 6, 7).
+ **SABOQ E:** variant chegarasi (0, 2, 4, 6, 7 variantlari) · maket kesilmaydi (⛔ «qur») · taxmin qatori yashil xulosa ichida (2, 4, 6) · yorliq input ichida (7) · bittadan karta (2, 7) · jadval «ma'lumot» ko'rinishida (varaq — E 45) · yakun standart, «Bugungi asosiy fikr» yo'q (11).

## O'lchov
Skript: `scratchpad/m14/md11/olchov.py` (to'liq chiqish — `md11/olchov-natija.txt`); MD dagi har «(N)» soni `md11/sana.py` bilan matndan sanab qo'yilgan — qo'lda yozilmagan (skript «Yozilgan son xatolari: []»).
| Nima | Soni | Eng qisqa | Eng uzun | Chegara |
|---|---|---|---|---|
| Sarlavha (0, 1, 2, 4, 6, 7, 10) | 7 | 25 | 49 | ≤55, bitta qator |
| Yakun sarlavhalari (11, 5 holat) | 5 | 33 | 55 | ≤55 |
| Hook javobi («Aynan!» · «Qiziq fikr!» ×2, so'z bilan birga) | 3 | 78 | 85 | ≤120 |
| Hook variantlari (0) | 3 | 22 | 23 | farq 4% |
| Mentor (0, 1, 2, 4, 6, 7 ×2) | 7 | 71 | 101 | har biri bitta gap ✓ (interaktivda 1) |
| Xulosa (2, 4, 6) | 3 | 76 | 92 | ≤110 |
| Xulosa — 7-ekran holatlari (3) | 3 | 50 | 73 | ≤110 |
| Bugungi asosiy fikr (A-2; yakunda yo'q) | 1 | 101 | 101 | ≤110 |
| `QIzoh` (2 ×2, 4 ×2, 6 ×2) | 6 | 56 | 93 | bitta qator (≤110) |
| To'g'ri izohi (3, 5, 8) | 3 | 46 | 58 | ≤60, «To'g'ri!» siz |
| Xato izohlari (3, 5, 8 — har biri uch + umumiy) | 12 | 34 | 55 | ≤60 |
| `QXato` va tekshiruv xabarlari (2, 7) | 15 | 18 | 54 | ≤60 |
| Ipucha (2, 4, 6) | 3 | 47 | 63 | — (40 s dan keyin, bitta qator) |
| Test variantlari — s3 (✔ B) | 4 | 38 | 41 | farq 7%; ✔ 40 (C 41 — uzunroq) |
| s5 (✔ D) | 4 | 37 | 41 | farq 10%; ✔ 37 — eng qisqa |
| s8 (✔ A) | 4 | 38 | 43 | farq 12%; ✔ 41 (D 43 — uzunroq) |
| Test savollari (so'z) | 3 | 6 | 8 | ≤12 |
| Arena 1–12 (variantlar) | 48 | 10 (6-savol) | 35 (5-savol) | har savolda farq ≤14%; ✔ hech qayerda yolg'iz eng uzun emas |
| Arena savollari (so'z) | 12 | 4 | 8 | ≤12 |
| Nishon tavsiflari | 4 | 40 | 45 | ≤48 (§63) |

Arena ✔ taqsimoti: A — 1, 5, 9 · B — 2, 6, 10 · C — 3, 7, 11 · D — 4, 8, 12 (3/3/3/3). Ekran testlari: s3 B · s5 D · s8 A (uchtasi har xil o'rinda).
Mentor gaplari «Bu…», «Hammasini…» bilan boshlanmaydi, sarlavhani takrorlamaydi (qo'lda tekshirildi). Nishon nomlari (Source Reader!, Team Rule!, Program Picked!, Concept Draft!) — `src/` va `feedback/` da boshqa joyda yo'q (grep, 08.10.2026).
`npm run -s lint:til -- feedback/F-1008-14modul/11-PmPrograms-v3.md` — **0 error, 0 warn** (TOZA); oxirgi tahrirdan keyin qayta yurgizildi. `vositalar/mdtekshir.py` — ekran 12/12 · arena 3/3/3/3 · uzun yo'q · keyingi dars ✓.

## TAXMIN belgilari (MD dagi `<!-- TAXMIN Tn -->` — 55 qator, 57 belgi: T14 — 43 · T1 — 5 · T2 — 3 · T12 — 3 · T20 — 2 · T4 — 1)
| Tn | Qaror-0 savoli (tavsiya A) | Qayerda |
|---|---|---|
| **T14** | Diamond Challenge — asosiy dastur (rasmiy shartlar, konsept qoralamasi); Y Combinator — «bugungi yo'l emas»; lokal tanlovlar — nomsiz | A-1, A-4, A-6, A-7 · 1 (reja yorlig'i, 02-qadam) · 2 (sarlavha, vizual, `QIzoh`) · 3 (savol) · 4 (sarlavha, vizual, xulosa, `QIzoh`) · 6 (kulrang qator) · 7 (1-karta, kulrang qatorlar, 3-karta, Yordam 1) · 8 (kalit) · 11 (1-holat, «Endi siz bilasiz» 2, 3, uyga vazifa ②) · takrorlash 3, 5, 8 · kartochka 4–9 · arena 1–9 |
| **T1** | Olti bo'lakli pitch tuzilmasi | A-3, A-7 · bitta vizual (pitch tasmasi) · 0 (maket) · 6 (vizual) |
| **T2** | Bozorda faqat bor sonlar | A-7 · 6 (vizual, «Kim uchun» tugmasi — sonlar Bozorda qoladi) |
| **T12** | Video qoidasi (ota-ona roziligi, ommaviy emas) | A-10 · 7 (O'qituvchi eslatmasi — Diamond Challenge videosi) |
| **T20** | Dars nomi «Qaysi xalqaro dasturga ariza berasiz?» | sarlavha qatori (Menyu) · 0 (sarlavha) |
| **T4** | Teglar `m14-dars-NN` (PM: `-done` = `-start`) | REPO |
Javob boshqacha bo'lsa: T14 (B — o'quvchi o'zi tanlaydi va shartlarini darsda tekshiradi) → 2, 4, 7-ekranlar va arena 1–9 qayta yoziladi (7-ekran 1-kartasi — dastur nomi maydoni, 2-ekran — tanlangan dastur sahifasi), kalitdagi `dastur` qiymatlari kengayadi · T12 — 7-ekran eslatmasi · T1, T2 — 6-ekran tasmasi.

## GATE M — o'z tekshiruvim (`konveyer/1-MD.md`)
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 476 `m12-10` «Birinchi buyurtmani qayerdan topasiz?» → 477 **`m12-11` «Qaysi xalqaro dasturga ariza berasiz?»** (osti «Diamond Challenge, Y Combinator: shartlar va ariza» — reja yorlig'i so'zma-so'z) → 478 `m12-12` «Keyingi olti oyda nima qilasiz?» (yakun qatori). Hook sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» (pitch tasmasi, Mentor konsepti, Mentor arizasi); metafora yo'q; bitta vizual — `ArizaSahna` (brauzer · varaq · pitch tasmasi), uch rejim bitta komponentda. Keys yo'q. Ikkinchi misol — faqat testlarda o'quvchining o'z holati (P-002).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 6 (QTushuncha) + 0, 7; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q — har bosish brauzer qatorini, varaq katagini yoki tasma bo'lagini o'zgartiradi.
- [x] O'lchov (skript): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 · to'g'ri izohi ≤60 — jadval yuqorida.
- [x] Atamalar oldingi darslar bilan bir xil: pitch, olti bo'lak nomlari, Bozor, Jamoa, hakam, qoralama (1-dars) · tashkilotchi, o'yinchi, shaxsiy ma'lumot (11–13-Modul). Yangi — xalqaro dastur, maslahatchi, konsept — misoldan keyin (2, 6-ekranlar `QIzoh`).
  Siz-forma; tugmalar ot-shaklda yoki siz-formada («Sahifada bor», «Saqlash», «Hali yo'q», «Yakunlash →»); eshitilgan gaplar va Mentor pitchi — olam matni (T-008).
- [x] Testlar: 4 variant, uzunlik teng (O'lchov), to'g'ri javob yolg'iz eng uzun emas; kalit so'z faqat to'g'rida emas (s3 «jamoa», s5 «Yosh yo'q ekan», s8 «ota-onam»). Dars yangi — ✔ o'rni birinchi marta belgilanmoqda (B · D · A).
- [x] Final tartib-mashqi yo'q (yakuniy — `QTest`); `QTartib` darsda yo'q.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › ⛶ ↻ — belgilar) · kafolat so'zlari («albatta», «kafolat», «har doim», «100%») o'quvchi matnida yo'q — faqat 7-ekran detektor ro'yxatida va A-5 «Ishlatilmaydi» da (MD ichki).
- [x] Ichki kodlar o'quvchi matnida yo'q (`m12-11`, «Modul 14», «TAXMIN», «pilot», «YC» qisqartmasi). Tarixiy voqea yo'q; rasmiy fakt — havola va sana bilan («Manbalar»). «KOD» ro'yxati 15 band, REPO — teglar jadvali.
- [x] Karta T · P · S · PM: T-008 (eshitilgan gaplar, Mentor pitchi — olam matni) · T-011/PM-030 (maslahatchi, xalqaro dastur, konsept — misoldan keyin; sarlavhalarda yangi atama yo'q) · T-014/T-015 (A-5: dastur, tanlov, jamoa, shart, Mentor ↔ maslahatchi) ·
  T-016 (metafora yo'q) · T-029/T-047 (Mentor bashorat yorlig'ini takrorlamaydi) · T-035 (o'quvchi matnida → = + yo'q) · T-038 (keyingi dars mazmuni, Demo Day — yo'q) · T-039 (reja 04 — «ariza qoralamasini», egaliksiz) · T-042 (konsept ta'rifi so'zma-so'z: 6, kartochka 10, yakun) ·
  T-043 («Bu misolda», «Mentor misolida») · T-045 (Y Combinator xulosasi — rasmiy shartlardan; «hali to'sqinlik yo'qdek» faqat bir lahza) · T-064 (2-ekran sarlavhasi 0-ekran savoliga javob) · P-001 · P-002 · P-008 (≤3 blok) · P-012 (testlar 3, 5, 8 — ketma-ket emas) · P-013 · P-014/P-015 ·
  P-016 · P-025 · P-028 (tashqi manzil — ⛔ «qur» kuni qayta) · P-033 · P-036 (0-ekranda javob ochilmaydi) · P-046 (7, 11 — o'quvchi kalitidan) · P-052 · P-062 · P-063 (`DASTUR_SHART`, `JAMOA_PITCH`) · P-064 · P-067 ·
  S-001 (savollar ≤12 so'z) · S-002/S-004/S-010 · S-008 · S-015 (bashoratlar bir o'lchovda; 4-ekranda «yozilmagan» — ajablanish nuqtasi) · S-018 (dastur nomlari izoh qatori bilan — 2, 4) · S-019 · S-020 · S-026 · S-027 · §144/§145 ·
  PM-005 (2-tur) · PM-017 · PM-018 (Y Combinator ichki qarori da'vo qilinmaydi — faqat rasmiy sahifa) · PM-020 · PM-021 · PM-027 · PM-108 (7-ekran tekshiruvi) · J-026 · SABOQ 1–31, D 36, E 40–55.
- [x] **Qaror-0 TAXMIN** — belgilangan qatorlar ro'yxati yuqorida; GATE M sahifasida T14 javobi 1, 2, 4, 7, 11-ekranlarga va arena 1–9 ga to'g'ridan-to'g'ri tegadi.
