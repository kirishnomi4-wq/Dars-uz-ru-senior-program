# F-1022-01 — O'quvchi roli: PM emas, startapchi (22.10.2026)

**Manba:** mentor, real dars (LMS preview, m3-10 «Qachon «tayyor» deb ayta olamiz?» `src/3-Modull/PmLesson9.jsx`, 1/16 ekran): «shu slaydni ma'nosini tushunmadim» · «PM dars slaydlarini tushuntirib bersangiz».
**Foydalanuvchi (22.10):** «o'quvchimiz PM emas, qo'lida 10 ta dasturchisi yo'q; startap qilib muammoga yechim topib o'rganishi va saytini AI'da qilishi kerak. «Dasturchi tayyor dedi» emas — «AI saytingiz tayyor dedi». Haqiqiy PM'dagidek o'rgatmaymiz — o'quvchiga mos yondashuv. To'liq qonun qilib yoz.»

## Tashxis
1. Rol: dars o'quvchini «dasturchiga ish beradigan PM» qiladi — «dasturchi» 22 joy (dars) + 5 (homework); qabul tartibi «dasturchiga beramiz → dasturchi yozadi».
2. Mentor ekrani: s0 natija tanlovdan OLDIN ochiq (`opened = picked !== null || isMentor`), bo'sh buyurtma yashil «yuborildi ✓». Sinf: 32 fayl.
3. Mentorga slayd maqsadi yo'q — `MentorNote` faqat o'tkazish-yo'rig'i, hamma ekranda ham emas; `SCREEN_INTENTS` kodda bor, mentorga chiqmaydi.
Ildiz-sabab: `PM_Prompt_v8.md` РОЛЬ — o'quvchining darsdagi roli yozilmagan («Ученики уже пишут код» xolos).

## 22.10 — muhrlangan (kodga tegilmagan)
- `PM_DARS_ETALON.md` 110 (o'quvchi — startapchi, almashtirish qoidasi, ruxsatlar, tekshiruv) · 111 («Bu slayd nima uchun» qatori).
- `PM_Prompt_v8.md` РОЛЬ: o'quvchi roli (ru).
- `MATN_KORPUS.md` §O'QUVCHI-STARTAPCHI — 7 juftlik ❌→✅.
- `til-lint.mjs` `onlyFiles` + `til-lint-rules.json` `dasturchi-topshiriq` (PM+bridge, error; `allowFiles` = KATTA §31 ro'yxati). O'lchov: butun src 64 qator → PM/bridge'da 16 fayl; texnik darslar (o'quvchi = dasturchi) tegilmaydi.
- `.claude/agents/pm/pm-auditor.md` 33-band · `pm-tekshiruvchi.md` F-1022-01 ov-bandi.
- `OQUVCHI_DARVOZA.md` «Rol-moslik» mezoni · `konveyer/1-MD.md` manba-band (rol + mentor qatori).
- `KATTA_TOZALASH.md` §31 (16 fayl) · 31-b (mentor-reveal 32 fayl) · 31-c (MentorNote umumiy).
- Pilot qoralama: `PmLesson9-v2-EKRANLAR.md` (16 ekran + homework, ❌→✅).

## 22.10 19:30 — PmLesson9 kodga o'tkazildi (pilot)
- Foydalanuvchi tasdig'i: 6 dars rejasi «qolgani yoqdi»; aniqlashtiruvlar: **atama qoladi** (PRD, qabul shartlari — o'quvchi nomini bilsin), m6-02 gap aytuvchi **ustoz** («murabbiy» emas), m3-05 sodda (prioritet, AI o'q emas). 110-qonunga «ATAMA DARSDAN CHIQARILMAYDI» + «ustoz» qatori qo'shildi; `REJA.md` yangilandi (2-qaror yopildi).
- Kod: 31 matn-almashtirish (uz+ru) — «dasturchi» 22 → 0; qabul tartibi «promptga qo'shamiz → AI kodni yozadi → o'zimiz bosib tekshiramiz»; arena 11-savol «qayerga qo'shasiz?» (to'g'ri javob o'rni 0 qoldi), 3/8/12-savol xato variantlari; kartalar 2/3/8; yakun RECAP 2-qator atama bilan.
- Mexanika: s0 mentor `mReveal` + «Natijani ochish» tugmasi (`mstats-reveal` naqshi), `NavNext mentorLock` — «Avval natijani oching»; ovoz-diagrammasi mentorda tanlov paytida ko'rinadi; bo'sh buyurtma qatori `h0log-bad` qizil «yuborildi ⚠» (`T.err/errSoft`).
- 111-qonun mexanizmi: `ScreenIdxCtx` (Stage beradi) → `MentorNote` `MENTOR_WHY[sid]` dan «Bu slayd nima uchun:» birinchi qatorni o'zi oladi; eslatmasi yo'q ekranlarga (s2, test-ekranlar `QuestionScreen`, s6, s14) bo'sh `<MentorNote />` qo'yildi — 16/16.
- Darvozalar: 12/13 ✓; `emoji` 6 error — HEAD'da ham aynan 6 (eski qarz, 161-qonun), bu tahrirdan emas. `lint-tell` bitta yangi topilma («prompt» faqat to'g'ri variantda) → xato variantlarga ham texnik so'z qo'shildi, 0. Skrinshot: s0 (o'quvchi, qizil qator), s9 (yangi qadamlar) — toza.
- Tegilmadi: `PmLesson9.homework.jsx`.

## 22.10 20:05 — PmLesson8 (m3-05) kodga o'tkazildi
- Jadval `PmLesson8-v2-EKRANLAR.md` tasdiqlandi («xa kodga o'tkaz»). Sodda variant: vaqtni o'quvchi o'zi chamalaydi, AI faqat kirish iborasi + yakun 5-qatori; atama «prioritet (navbat belgilash)» RECAP 2-qatorida.
- Kod: «dasturchi» 9 → 0 (s0 yorliq «⏱ Taxminan», s2 gloss, s8 mentor ×2, s9 mentor/ipucha/natija/eslatma, RECAPS 11 3-karta, arena 9-savol «kim chamalaydi?» → «Ishni o'zi qiladigan odam», o'rni 2 qoldi).
- Mexanika: s0 mentor `mReveal` + «Natijani ochish», `mentorLock`; diagramma tanlov paytida; 111-qonun `ScreenIdxCtx` + `MENTOR_WHY` 17/17 (s4b ham), bo'sh `<MentorNote />` s2/testlar/s6/s14.
- Gates 12/13 (`emoji` 8 — HEAD'da ham 8). Skrinshot s0 (o'quvchi, «Taxminan 3 hafta»), s8 mustaqil ish, s0 mentor (reveal'dan keyin diagramma) — toza. Uy vazifasi tegilmadi.

## 22.10 20:10 — qolgan 5 dars jadvali yozildi, SEANS YOPILMOQDA
- `PmLesson22-v2-EKRANLAR.md` (m6-02: ustoz + Gemini uch urinish + PRD kuchayadi; dasturchi 20 → 0, murabbiy 10 → ustoz, 11 basseyn xodimi qoladi) · `PmLesson13-16-18-12-v2-EKRANLAR.md` (m4-12 9 joy, m4b-02 6, m4c-06 4, m4-07 1).
- `til-lint-rules.json` `allowFiles` dan PmLesson8 chiqarildi → `dasturchi-topshiriq` PmLesson8/9 da 0 (haqiqiy).
- Foydalanuvchi: «1-2 soatda yozaman, keyin yangi seansdan davom etamiz». **Yangi seans → `DAVOM.md`.**

## Ochiq
- [ ] m6-02 + 4 qisman dars jadvallari — foydalanuvchi tasdig'i → kod (DAVOM.md 2–3-qadam).
- [x] PmLesson8 (uz+ru) → gates. (22.10 20:05)
- [x] PmLesson9 (uz+ru) → gates → `dasturchi-topshiriq` 0. (22.10 19:30)
- [ ] Mentor-rejimda jonli ko'rik (s0 «Natijani ochish» → natija; har ekranda eslatma birinchi qatori) — QA saytga chiqarilgach, o'sha mentorga ko'rsatish.
- [ ] `emoji` darvozasi — PmLesson9 6 blok (eski qarz; PmLesson8 da 8) — alohida qaror, bu to'lqinda tegilmaydi.
- 22.10: foydalanuvchi — «PM darsi uyga vazifasini umuman o'ylama» → homework tegilmaydi, lint `.homework` istisno, KATTA §31 11 fayl.
- [ ] s0 mentor-reveal + qizil bo'sh qator (pilot) → qolgan 32 fayl qarori.
- [ ] MentorNote «Bu slayd nima uchun» mexanizmi (umumiy komponent?) → pilot → skelet.
- [ ] KATTA §31 darslari — har biri ekranma-ekran jadval + tasdiq.
- Keyingi: jadvallar tasdig'i → m6-02 kod → 4 qisman dars kod (DAVOM.md). Keyingi F-ID: F-1022-02.

**24.10 18:30 · F-1022-01 davomi — 4 qisman dars kodga o'tkazildi** (m4-12 `PmLesson13`, m4b-02 `PmLesson16`, m4c-06 `PmLesson18`, m4-07 `PmLesson12`). Foydalanuvchi: «taklifing maqul — boshla; qurib bo'lgach LMS'ga mexanizm bo'yicha yuklaymiz». Jadval `PmLesson13-16-18-12-v2-EKRANLAR.md` bo'yicha: «dasturchi» 10+6+4+1 → 0 (uz+ru; PmLesson16'da Cyberpunk jamoasi — uchinchi shaxs, qoldi). Mexanizm (PmLesson8 naqshi): `ScreenIdxCtx` + `MENTOR_WHY` 16/16 (SCREEN_INTENTS'dan mentor tilida) + bo'sh `<MentorNote />` (QuestionScreen, Screen2, Flashcards; PmLesson13'da Screen6 ham) + s0 «Natijani ochish» / `mentorLock` / diagramma tanlov paytida + CSS `.mnote-why`. Test to'g'ri javob o'rinlari, ekran soni, ballar o'zgarmagan. Skript: aniq string almashtirish, har biri 1 marta (assert); nusxa scratchpad `f1022-oldin/`. `til-lint-rules.json` `dasturchi-topshiriq` allowFiles'dan PmLesson13/16/12 chiqarildi (PmLesson18 ro'yxatda yo'q edi). Darvozalar: 4 darsda esbuild · undef · jsx · keys · dark · til · prompt ✓; `emoji` yiqiladi — o'zgarishdan oldingi nusxada ham aynan shu (eski qarz, tegilmadi); PmLesson16 `tell` QUIZ_BANK #7 — eski qarz, tegilmadi. lint:jsx 258 toza. Brauzer (mentor, uz + ru): s0 ochishdan oldin natija yopiq, «Avval natijani oching» bloklangan → ochgach «Davom etish»; s0/s2/s3/s14 eslatmaning 1-qatori «Bu slayd nima uchun» — 4/4 dars, xato 0. O'quvchi rejimi: o'zgargan 10 ekran ochildi, xato 0. Commit yo'q. Keyingi: m6-02 (PmLesson22) jadval tasdig'i → kod → LMS (lms-farq).

**24.10 18:33 · F-1022-01 davomi — m6-02 `PmLesson22` kodga o'tkazildi** (jadval `PmLesson22-v2-EKRANLAR.md`, foydalanuvchi 24.10: «taklifing maqul — boshla»). «Dasturchi» 25 → 0 (uz+ru); gap aytuvchi «murabbiy» → «ustoz» / «наставник» (s0, s4, s4 eslatmasi, nishon «Right Question!»); basseyn xodimlari (s5 «Uch murabbiy», s9 varaqlari, arena «Basseyn murabbiysi») — keys-olam, qoldi. s0: «siz uni Gemini'ga uch marta yozdingiz» · s2 kartalari AI bilan · s3 xato variant «AI'ga eslab qolganimcha yozaman» · s4: PRD + «Siz uchun bu ikki narsa birdan: startapchining PRD'si va AI'ga beriladigan to'liq prompt», tugma «▶ Endi AI nima quradi?» (+ nav-yozuv «② Endi AI nima qurishini oching» — jadvalda yo'q, tugma bilan bir xil bo'lsin deb) · s11/RECAPS/s12 qoida/karta 7/RECAP 4: «AI taxmin qiladi» · RECAP 2 «AI'ga beriladigan to'liq prompt ham» · arena 6 savol jadval bo'yicha (#5 ru variantlari «urinish»ga moslandi: «Каждый раз — своё»…). **Jadvaldan og'ish (tell-darvoza):** arena #12 «Varaq bo'sh qolsa, kim taxmin qiladi?» — to'g'ri «Kod yozadigan AI» yagona katta-harfli atama bo'lib qoldi (`lint-tell` error) → xato variant «Sinov o'tkazuvchi» → «PRD'ni yozgan odam» / «Тот, кто писал PRD»; to'g'ri javob o'rni (3) o'zgarmagan. Mexanizm: `ScreenIdxCtx` + `MENTOR_WHY` 16 (jadvaldagi qatorlar) + bo'sh `<MentorNote />` (QuestionScreen, Screen2, Screen6, Flashcards) + s0 «Natijani ochish». allowFiles'dan PmLesson22 chiqarildi. Gates **13/13** (emoji ham toza). lint:jsx 258 toza. Brauzer: mentor s0–s12, s14 — «Bu slayd nima uchun» 14/14, s0 ochishdan oldin yopiq (uz + ru), xato 0; o'quvchi s2 (kartalar ochilgan), s4 (varaq to'lib, «AI har safar bir xil quradi», nishon «ustozdan»), s11 — xato 0. Commit yo'q. **F-1022-01 LMS darslari 7/7 KOD** (m3-10, m3-05 — 23.10 prodda; m4-12, m4b-02, m4c-06, m4-07, m6-02 — 24.10). Keyingi: LMS_DEPLOY (G) — lms-farq → paket → yuklash → muhrla.
