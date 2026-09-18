# KATTA §41 — B savat: 19 «tekin nishon» ekrani bo'yicha takliflar (2026-09-18)

Manba: `saralash.json` (B savat — 19 trigger, 18 fayl). Har ekran kodda ochib ko'rildi (komponent to'liq o'qildi).
Bu fayl — TAKLIF. Kodga, qonunga, STATE'ga tegilmagan. Qaror foydalanuvchida.

## Xulosa

| Tavsiya | Soni | Qaysilar |
|---|---|---|
| **a — KO'CHIRISH** (nishon xato qilish mumkin bo'lgan ekranga yoki mavzu-testiga o'tadi) | 5 | 1, 3, 4, 5, 11 |
| **b — SHART QO'YISH** (shu ekranning o'zida halol shart) | 2 | 7, 16 |
| **c-graduate — ISHTIROK NISHONI** (tekin nishon darsning `graduate` nishoniga aylanadi) | 6 | 8, 9, 13, 15, 17, 18 |
| **c-mehnat — MEHNAT NISHONI** (ijodiy / ekrandan tashqaridagi ish; «to'g'ri javob» yo'q) | 2 | 6, 19 |
| **Aslida B EMAS** — xato qilsa bo'ladi, A savatga o'tadi (151-naqsh: `miss(screen)` + `AchRule`) | 4 | 2, 10, 12, 14 |

Izohlar:

- **«c-graduate» nima.** Oltita darsda (8, 9, 13, 15, 17, 18) 4 ta nishon bor va ularning ichida `graduate` YO'Q —
  to'rtinchisi aynan shu «tekin» nishon (kartani ochish, tugmani bosish). 151-qonun (DARS_ETALON 620-qator) esa
  «kafolatli yagona nishon — `graduate`» deydi, 618-qator: «4 ta = 3 bosqich-nishoni + `graduate`». Demak tekin nishonni
  yashirmasdan, ochiq ishtirok nishoniga aylantirish qonunga eng mos yo'l: u yakun ekranida beriladi, soni 4 ta qoladi,
  darsni tugatgan har o'quvchi kamida bitta nishon oladi (qolgan uchtasi — birinchi urinishga). Etalon:
  `src/pm/PmUserStoryLesson.jsx:2751` (`if (screen === SUMMARY_IDX) earn('graduate')`).
  Eslatma: `graduate` siz PM dars ko'p — `src/*/PmLesson*.jsx` dan 47 tasida yo'q; bu yerda faqat B savatdagi
  oltitasi haqida gap ketyapti.
- **«c-mehnat» qonunga tegadi.** 6 va 19 da nishon «kafolatli» emas (yozmasa / bajarmasa ololmaydi), lekin «birinchi
  urinish» tushunchasi ham yo'q. Tasdiqlansa, 151-qonunning «Tegilmaydigan joylar» ro'yxatiga bitta band kerak:
  «ijodiy yozma ish va ekrandan tashqarida bajariladigan ish — mehnat nishoni; `AchRule` qatori bu ekranda
  ko'rsatilmaydi (va'da yolg'on bo'lardi)».
- **Mikro-testga ko'chirish (1, 4, 5, 11)** eng arzon halol yo'l: test savoli azaldan faqat birinchi urinishga nishon
  beradi (`firstAttemptCorrect`), yangi mexanika kerak emas — `ACH_TRIGGERS` da kalit almashadi. Lekin nishon tavsifi
  (`desc`) yangi ekranga mos kelmay qoladi → **matn o'zgaradi (uz + ru), sizning tasdig'ingiz kerak** (150-qonun).
- **Yon ta'sir — katalog.** `scripts/gen-lesson-catalog.mjs` `ACHIEVEMENTS` blokini o'qiydi (hozir 110 dars · 391 yutuq).
  Nishon kaliti, nomi yoki `desc` o'zgarsa — katalog qayta yaratiladi va server bilan birga chiqadi. Faqat
  `ACH_TRIGGERS` kaliti almashsa — katalog o'zgarmaydi.
- **Hammasiga umumiy:** 151-qonunning 6-bandi («Qaytadan» = mashq) bu yerda hisobga olinmagan — u 98 darsga
  codemod bilan kiradi, bu takliflarga bog'liq emas.

---

## Dars-badars

### 1. CssLesson1 — «Matn va fonni qanday bo'yaymiz?» (s5)

- **Joy:** `src/1-Modull/CssLesson1.jsx:1112` (Screen5), trigger 1120-qator; `ACH_TRIGGERS` 2316-qator.
- **Nishon:** `rang` — 🎨 Painted It! — «Matn va fon ranglarini o'zgartirdingiz».
- **Hozirgi trigger:** `const set = (kind, v) => { ...; if (storedAnswer === undefined) onAnswer(screen, { correct: true, ... }) }`
- **O'quvchi nima qiladi:** 8 ta rang-doirachadan istalgan bittasini bosadi — karta bo'yaladi. Birinchi bosishdayoq nishon.
- **Tasdiq:** B — to'g'ri. Xato qilib bo'lmaydi (har rang «to'g'ri»).
- **TAVSIYA: a** → `s5b` «Tekshiruv» test savoliga («Matnning rangini qaysi xususiyat o'zgartiradi?», 1145-qator).
  Sabab: darsdagi boshqa ekranlar ham tugma-almashtirgich (s2, s3, s6–s8, s10, s11 — hammasida `correct: true`);
  xato qilsa bo'ladigan ikki ekran (s13 `bezak`, s14 `debugger`) band. s5b — aynan shu mavzuning tekshiruvi.
- **Hajm:** 1 qator (`s5` → `s5b`) + `desc` matni uz/ru (masalan «color va background-color ni ajratdingiz» — matn siz bilan).

### 2. CssLesson2 — «Menyuni namunaga moslang» (s7) — **B EMAS**

- **Joy:** `src/1-Modull/CssLesson2.jsx:1168` (Screen7), trigger 1180-qator.
- **Nishon:** `markaz` — 🎯 Bullseye!
- **Hozirgi trigger:** `if (v === TARGET && !solved) { ...; onAnswer(screen, { correct: true, jc: v }) }` (TARGET = `space-between`).
- **O'quvchi nima qiladi:** 4 qiymatdan (`flex-start` · `center` · `space-between` · `flex-end`) namunaga mosini topadi.
  Xato qiymat bosilsa ekran «Menyu hali namunaga mos emas» deydi.
- **Tasdiq:** bu haqiqiy topshiriq — 3 ta xato tanlov bor. Skript «xato» so'zini topmagani uchun B ga tushgan.
- **TAVSIYA: A savatga** — 151-naqsh: `set()` ichida `v !== TARGET && !solved` bo'lsa `achMiss.miss(screen)`; topshiriq
  ostida `AchRule`. Fayldagi izoh (2227-qator) ham buni «ma'noli challenge» deb yozgan.
- **Hajm:** ~4 qator + `AchRule`.
- **Yo'l-yo'lakay:** `desc` «Elementlarni to'liq markazga qo'ydingiz» deydi, topshiriq esa chetdan-chetga tarqatish
  (`space-between`) — tavsif vazifaga mos emas (alohida matn-topilma, bu yerda tuzatilmaydi).

### 3. HtmlTakrorlashLesson — ««Chempionlar» sahifasi tayyor! 🏆» (s12b)

- **Joy:** `src/1-Modull/HtmlTakrorlashLesson.jsx:1599` (ScreenParty), trigger 1601-qator; `ACH_TRIGGERS` 2571.
- **Nishon:** `built` — 🧱 Built It! — ««Chempionlar» sahifasini oxirigacha yasadingiz».
- **Hozirgi trigger:** `useEffect(() => { if (storedAnswer === undefined) onAnswer(screen, { correct: true, picked: true }); }, [])`
- **O'quvchi nima qiladi:** HECH NARSA — ekran ochilishi bilan nishon beriladi (konfetti ekrani). 19 tadan eng «tekin»i.
- **Tasdiq:** B — to'g'ri. Mohiyatan ikkinchi `graduate` (yakundan 3 ekran oldin).
- **TAVSIYA: a** → `s10` «Jamoaga qo'shilish formasi» (ScreenForm, 1446-qator): `DragDropOrder` — label → input → button
  tartibini yig'ish; tartib xato chiqishi mumkin, hozir hech qaysi nishonga bog'lanmagan.
- **Hajm:** `ACH_TRIGGERS` 1 qator; bu fayldagi `DragDropOrder` (1084) da `onWrong` yo'q — etalondagidek 2 qator qo'shiladi
  (`InternetLesson.jsx:2655–2674`); ScreenForm'da `miss` + `AchRule` ~4 qator; `desc` uz/ru; **s12b Mentor matni
  (1607-qator: «🧱 nishoni sizniki»)** — o'chadi yoki o'zgaradi (uz + ru). Jami ~10 qator + 3 matn.

### 4. Htmllesson2 — «Sahifa qanday bo'limlarga bo'linadi?» (s5)

- **Joy:** `src/1-Modull/Htmllesson2.jsx:1013` (Screen5), trigger 1026-qator; `ACH_TRIGGERS` 2287.
- **Nishon:** `struktura` — 🧱 Room by Room! — «Sahifani header, main, footerga ajratdingiz».
- **Hozirgi trigger:** `useEffect(() => { if (done && ...) onAnswer(screen, { correct: true, picked: true }); }, [done])` — `done = clicked.size === 3`.
- **O'quvchi nima qiladi:** chizmadagi 3 bo'limni birma-bir bosib, izohini o'qiydi.
- **Tasdiq:** B — to'g'ri.
- **TAVSIYA: a** → `s5b` «Tekshiruv» savoli («Logotip va menyu qaysi bo'limga joylanadi?», 1066-qator). Sabab: bu darsda
  xato qilsa bo'ladigan amaliy ekran bitta (s14 `debugger`, band); qolganlari — s6, s8, s10, s11 va hatto s13
  «sahifa quramiz» — hammasi xatosiz (s13: istalgan 3 bo'lak qo'shilsa bo'ldi).
- **Hajm:** 1 qator + `desc` uz/ru.

### 5. Htmllesson2 — «Foydalanuvchidan ma'lumotni qanday olamiz?» (s7)

- **Joy:** `src/1-Modull/Htmllesson2.jsx:1118` (Screen7), trigger 1124-qator.
- **Nishon:** `forma` — 📮 Sent It! — «Formani to'ldirib yubordingiz».
- **Hozirgi trigger:** `const submit = (e) => { ...; if (name.trim()) setSent(true); }` → `done` → `onAnswer({ correct: true })`.
- **O'quvchi nima qiladi:** ism katagiga istalgan matn yozib «Yuborish»ni bosadi.
- **Tasdiq:** B — to'g'ri.
- **TAVSIYA: a** → `s9` «Mashq · 2-savol» («Foydalanuvchi matn yozadigan maydonni qaysi teg yasaydi?», 1192-qator) —
  formalar blokining (s7, s8) tekshiruvi.
- **Hajm:** 1 qator + `desc` uz/ru. (4 va 5 bitta faylda — birga qilinadi.)

### 6. PmLesson1 — «O'z saytingiz uchun auditoriya-karta yozing» (s6)

- **Joy:** `src/1-Modull/PmLesson1.jsx:1159` (Screen6), trigger 1172 va 1191-qatorlar; `ACH_TRIGGERS` 2710.
- **Nishon:** `audience` — 🎯 Audience Found! — «O'z auditoriya-kartangizni yozdingiz».
- **Hozirgi trigger:** `saveDraft()` → `onAnswer(screen, { practice: 'audience-card', cards, solved: true, correct: true })`.
- **O'quvchi nima qiladi:** uch maydonni (KIM · MUAMMO · YECHIM) o'z so'zi bilan yozadi va «✓ Saqlash»ni bosadi.
  Darvoza bor (uzunlik; KIM «hamma…» bilan boshlansa saqlash qulf + maslahat), lekin «tekshirilgan xato urinish» yo'q —
  tugma to'g'ri bo'lmaguncha bosilmaydi.
- **Tasdiq:** B — to'g'ri (erkin matn, yagona to'g'ri javob yo'q). Lekin «tekin» emas — nishon yozma mehnat evaziga.
- **TAVSIYA: c-mehnat** — mehnat nishoni bo'lib qoladi; `AchRule` qatori bu ekranda ko'rsatilmaydi. Sabab: PM darsining o'zagi —
  o'z artefaktini yozish; «birinchi urinishda to'g'ri» sharti bu yerda ma'nosiz. Qonunga bitta band kerak (yuqorida).
- **Muqobil (b):** uchala maydon to'lgan paytda KIM «hamma…» bo'lsa — shu «xato urinish» (`miss`). Texnik jihatdan
  mumkin (~5 qator), lekin yozish jarayonini jazolashga o'xshaydi — tavsiya qilmayman.
- **Hajm (c-mehnat):** kod 0 qator; qonun-hujjatga 1 band.

### 7. JsConditionsLesson — «Zaryad shartini o'zingiz tuzing» (s13)

- **Joy:** `src/2-Modull/JsConditionsLesson.jsx:1195` (Screen13), trigger 1205-qator; `ACH_TRIGGERS` 1615.
- **Nishon:** `builder` — 🔋 Rule Maker — «Zaryad shartini o'zingiz tuzdingiz».
- **Hozirgi trigger:** `const ready = op && num; ... if (done && ...) onAnswer(screen, { correct: true, picked: true })`.
- **O'quvchi nima qiladi:** 3 operatordan (`<` · `<=` · `>`) va 3 sondan (10 · 20 · 50) istalganini tanlaydi; ikkalasi
  tanlangan zahoti nishon. `battery > 50` ham «to'g'ri» hisoblanadi.
- **Tasdiq:** B — to'g'ri.
- **TAVSIYA: b** — ekranga aniq maqsad qo'yiladi (masalan: «Telefon zaryad 20% va undan kam bo'lganda ogohlantirsin») +
  «Tekshirish» tugmasi: `<=` va `20` → to'g'ri; boshqa juftlik → xato urinish (`miss`) + maslahat, keyin qayta tanlaydi.
  Pastdagi «🔋 15% · 20% · 80%» sinov-tugmalari o'z joyida qoladi va xatoni o'zi ko'rsatib beradi (20% da telefon jim
  tursa — shart noto'g'ri). Sabab: nishon nomi va tavsifi aynan shu ekranga yozilgan; darsdagi boshqa yozma ekranlar
  (`selse`, `s15`) harf terilishi bilan avto-o'tadi — ularda ham «urinish» yo'q, ko'chirishga joy yo'q.
- **Hajm:** ~15–20 qator (maqsad-holat, tugma, `miss`, `AchRule`) + yangi matnlar: topshiriq jumlasi, xato-maslahat,
  Mentor/audio qatoriga bir jumla (uz + ru) — **matn siz bilan**. Mexanika buzilmaydi, erkin sinov saqlanadi.

### 8. PmLesson4 — «Bu imkoniyat kimning qaysi qiyinchiligini yo'qotadi?» (s2)

- **Joy:** `src/2-Modull/PmLesson4.jsx:897` (Screen2), trigger 906-qator; `ACH_TRIGGERS` 190.
- **Nishon:** `pairFinder` — 🔎 Pair Finder! — «Imkoniyatlarni qiyinchiliklarga bog'ladingiz».
- **Hozirgi trigger:** `if (allSeen && storedAnswer === undefined) onAnswer(screen, { stage: 'exploration', seen, correct: true })`.
- **O'quvchi nima qiladi:** 4 kartani bosib ochadi (ostidagi izoh chiqadi). Bog'lash ishini o'quvchi emas, ekran qiladi.
- **Tasdiq:** B — to'g'ri.
- **TAVSIYA: c-graduate** — `pairFinder` o'rniga `graduate` (yakun ekranida beriladi). Sabab: darsda 4 nishon bor
  (`pairFinder`, `matchMaster`, `cardWriter`, `pageMaker`), `graduate` yo'q; haqiqiy bog'lash topshirig'i — s4 `matchMaster`
  («Uchala imkoniyatni o'z qiyinchiligiga qo'ydingiz») — aynan shu ko'nikmani xato qilish mumkin bo'lgan holda tekshiradi,
  `pairFinder` esa uning tekin nusxasi. Ishtirok nishoni ochiq nom bilan bo'lgani halol.
- **Zaxira (rad etilsa): a** → `s3` test (944-qator).
- **Hajm:** `ACHIEVEMENTS` da 1 qator (kalit → `graduate`, nom «Level Up!», `desc` uz/ru — matn siz bilan); `ACH_TRIGGERS`
  dan 1 kalit o'chadi; ildizda 2–3 qator (yakun ekraniga kelganda `earn('graduate')`; etalon `PmUserStoryLesson.jsx:2751`. Bu olti faylda
  `SUMMARY_IDX` o'zgaruvchisi yo'q — indeks `SCREEN_META` dagi `summary` qatoridan olinadi);
  katalog qayta yaratiladi (eski kalit chiqadi, `graduate` kiradi).

### 9. PmLesson5 — «Bitta ish yoki oltita ish?» (s2)

- **Joy:** `src/2-Modull/PmLesson5.jsx:850` (ScrSplit), trigger 857-qator; `ACH_TRIGGERS` 69.
- **Nishon:** `splitter` — 🧩 Splitter! — «Katta ishni oltita bo'lakka bo'ldingiz».
- **Hozirgi trigger:** `const done = split && seen.size >= FALLBACK_FEATURES.length; ... onAnswer(screen, { stage: 'split', correct: true })`.
- **O'quvchi nima qiladi:** katta kartani bosadi (u o'zi 6 bo'lakka ajraladi), keyin 6 bo'lakni bosib ochadi. Bo'lishni
  ekran bajaradi.
- **Tasdiq:** B — to'g'ri.
- **TAVSIYA: c-graduate** — `splitter` o'rniga `graduate`. Sabab: 4 nishon (`splitter`, `weigher`, `launcher`, `sharpeye`),
  `graduate` yo'q; qolgan uchtasi (s8, s9, s11) — haqiqiy topshiriqlar.
- **Zaxira: a** → `s4` test.
- **Hajm:** `ACHIEVEMENTS` da 1 qator (kalit → `graduate`, nom «Level Up!», `desc` uz/ru — matn siz bilan); `ACH_TRIGGERS`
  dan 1 kalit o'chadi; ildizda 2–3 qator (yakun ekraniga kelganda `earn('graduate')`; etalon `PmUserStoryLesson.jsx:2751`. Bu olti faylda
  `SUMMARY_IDX` o'zgaruvchisi yo'q — indeks `SCREEN_META` dagi `summary` qatoridan olinadi);
  katalog qayta yaratiladi (eski kalit chiqadi, `graduate` kiradi).

### 10. PmLesson8 — «Oltita ishni 4 katakka joylashtiring» (s4) — **B EMAS**

- **Joy:** `src/3-Modull/PmLesson8.jsx:993` (Screen4), trigger 1002-qator; xato-yo'l 1012-qator.
- **Nishon:** `boardMaster` — 🧩 Board Master!
- **Hozirgi trigger:** `if (ish.katak === k) { joylaydi } else { setSt(p => ({ ...p, hint: true })); }` — hamma ish joylangach `correct: true`.
- **O'quvchi nima qiladi:** ish-kartani tanlab, 4 katakdan biriga qo'yadi. Noto'g'ri katak — karta joylashmaydi,
  «Kartadagi ikki javobni qayta o'qing…» maslahati chiqadi.
- **Tasdiq:** xato qilsa bo'ladi (6 karta × 3 noto'g'ri katak). Skript `hint` so'zini xato-belgi deb tanimagan.
- **TAVSIYA: A savatga** — `tryCell` ning `else` tarmog'ida (1012) `achMiss.miss(screen)` + `AchRule`.
  151-qonun 2-band: «o'yin / tanlov — ekran qaytargan har xato qadam».
- **Hajm:** ~4 qator + `AchRule`.

### 11. ReactCrudPracticeLesson — «Endi o'zingiz — loyihani to'liq boshqaring» (s11)

- **Joy:** `src/3-Modull/ReactCrudPracticeLesson.jsx:1174` (Screen11), trigger 1184-qator; `ACH_TRIGGERS` 1649.
- **Nishon:** `builder` — 🧱 Full CRUD! — «Qo'shdingiz, o'zgartirdingiz, o'chirdingiz».
- **Hozirgi trigger:** `const done = didAdd && didTop && didDel; ... onAnswer(screen, { correct: true, picked: true })`.
- **O'quvchi nima qiladi:** tayyor ilovada uch tugmani bosadi: «+ o'yin», «🔥 TOP», «✕». Tartib ixtiyoriy, xato yo'q.
- **Tasdiq:** B — to'g'ri. Darsdagi boshqa amaliy ekranlar ham xatosiz: s9 «AI bilan quramiz» (buyruq tanlash →
  tasdiqlash), `sp1–sp3` VS Code amaliyoti («Bajardim» — vijdon asosida).
- **TAVSIYA: a** → `s12` test («O'yinning like sonini oshirish — bu CRUD'ning qaysi amali?», 1223-qator) — s11 dan keyingi
  ekran, mavzusi aynan shu uch amal.
- **Hajm:** 1 qator + `desc` uz/ru.

### 12. ApiPostmanLesson — konvert yig'ish (s3) — **B EMAS**

- **Joy:** `src/4-Modull/ApiPostmanLesson.jsx:806` (Screen3), trigger 818-qator; xato-yo'l 823-qator.
- **Nishon:** `envelopeBuilder` — 📮 Envelope Builder!
- **Hozirgi trigger:** `if (piece.zone !== zone) { setSel(null); setReject(k); ... return; }` — hamma bo'lak joylangach `correct: true`.
- **O'quvchi nima qiladi:** so'rov bo'laklarini konvertlarga sudraydi / bosib qo'yadi. Noto'g'ri konvert — bo'lak
  silkinib qaytadi.
- **Tasdiq:** xato qilsa bo'ladi. `ACH_TRIGGERS` yonidagi izoh (1514, F-0820-212) ham shuni aytadi: nishon ataylab
  «noto'g'ri zona rad etiladigan» ekranga ko'chirilgan. Skript `reject` so'zini tanimagan.
- **TAVSIYA: A savatga** — 823-qatordagi rad-tarmoqda `achMiss.miss(screen)` + `AchRule`.
- **Ehtiyot:** sudrashda bo'lakni konvertdan tashqariga tashlash (zona topilmadi) — urinish EMAS (151-qonun 2-band:
  qo'l sirpanishi); faqat `piece.zone !== zone` holati sanaladi. Kod shunday ajratgan, lekin brauzerda tekshirilsin.
- **Hajm:** ~4 qator + `AchRule`.

### 13. DbSqlNosqlLesson — «SQL kuchi · JOIN» (s5)

- **Joy:** `src/4-Modull/DbSqlNosqlLesson.jsx:901` (Screen5), trigger 909-qator; `ACH_TRIGGERS` 1656.
- **Nishon:** `connector` — 🔗 The Connector — «Ikki jadvalni id orqali bog'lab JOIN qildingiz».
- **Hozirgi trigger:** `const clickPk = () => { if (joined || !armed) return; setJoined(true); }` → `onAnswer({ correct: true })`.
- **O'quvchi nima qiladi:** yonib turgan ikki katakni navbat bilan bosadi (avval `user_id`, keyin `id`). Boshqa kataklar
  bosilmaydi — noto'g'ri bosish imkoni yo'q.
- **Tasdiq:** B — to'g'ri.
- **TAVSIYA: c-graduate** — `connector` o'rniga `graduate`. Sabab: 4 nishon (`packageMaster` s3, `connector` s5,
  `mythBuster` s14, `compassReader` s15), `graduate` yo'q; qolgan uchtasi xato qilsa bo'ladigan ekranlarda.
- **Zaxira: a** → `s5b` test. (b ham mumkin — hamma ustunni bosiladigan qilib «qaysi ustun bog'laydi?» deb so'rash —
  lekin bu ekranni qayta qurish: ~30 qator + matn.)
- **Hajm:** `ACHIEVEMENTS` da 1 qator (kalit → `graduate`, nom «Level Up!», `desc` uz/ru — matn siz bilan); `ACH_TRIGGERS`
  dan 1 kalit o'chadi; ildizda 2–3 qator (yakun ekraniga kelganda `earn('graduate')`; etalon `PmUserStoryLesson.jsx:2751`. Bu olti faylda
  `SUMMARY_IDX` o'zgaruvchisi yo'q — indeks `SCREEN_META` dagi `summary` qatoridan olinadi);
  katalog qayta yaratiladi (eski kalit chiqadi, `graduate` kiradi).

### 14. NodeServerLesson — «AI server yozdi, lekin brauzer "ulanib bo'lmadi" deyapti. Nega?» (s14) — **B EMAS**

- **Joy:** `src/4-Modull/NodeServerLesson.jsx:1162` (Screen14), trigger 1172-qator; tanlov 1202-qator.
- **Nishon:** `bugHunter` — 🔧 Bug Hunter!
- **Hozirgi trigger:** 3 variant (`app.get yo'q` · `app.listen yo'q` · `res.send yo'q`); xato tanlovda «Bu qator kodda bor.
  Yana qarang…» chiqadi; to'g'ri tanlov → «🔧 qo'shish» tugmasi → `correct: true`.
- **Tasdiq:** xato qilsa bo'ladi (2 noto'g'ri variant). Skript xato-belgini topmagan (`frame-warn`).
- **TAVSIYA: A savatga** — `setPicked(o.id)` da `o.id !== 'listen'` bo'lsa `achMiss.miss(screen)` + `AchRule`.
- **Yo'l-yo'lakay (alohida matn-topilma):** Mentor va audio javobni oldindan aytib qo'yadi («app.listen qatori yo'q»),
  to'g'ri variant yozuvida ham izoh bor («— server yoqilmagan»). Nishon halol bo'lishi uchun bu ham ko'rilishi kerak.
- **Hajm:** ~4 qator + `AchRule`.

### 15. PmLesson17 — «Haftani o'tkazing — ikki saytni solishtiring» (s4)

- **Joy:** `src/4c-Modull/PmLesson17.jsx:842` (Screen4), trigger 857-qator; `ACH_TRIGGERS` 1866.
- **Nishon:** `paceSetter` — 🏁 Pace Setter! — «Poygani oxirigacha o'tkazdingiz».
- **Hozirgi trigger:** `const done = h >= HAFTA_SONI; ... onAnswer(screen, { stage: 'poyga', solved: true, correct: true })`.
- **O'quvchi nima qiladi:** «Keyingi hafta» tugmasini 6 marta bosadi.
- **Tasdiq:** B — to'g'ri.
- **TAVSIYA: c-graduate** — `paceSetter` o'rniga `graduate`. Sabab: 4 nishon (`paceSetter`, `fastShipper`, `gateKeeper`,
  `weekPlanner`), `graduate` yo'q; qolgan uchtasi (s8, s9, s10) — haqiqiy topshiriq.
- **Zaxira: a** → `s5` test.
- **Hajm:** `ACHIEVEMENTS` da 1 qator (kalit → `graduate`, nom «Level Up!», `desc` uz/ru — matn siz bilan); `ACH_TRIGGERS`
  dan 1 kalit o'chadi; ildizda 2–3 qator (yakun ekraniga kelganda `earn('graduate')`; etalon `PmUserStoryLesson.jsx:2751`. Bu olti faylda
  `SUMMARY_IDX` o'zgaruvchisi yo'q — indeks `SCREEN_META` dagi `summary` qatoridan olinadi);
  katalog qayta yaratiladi (eski kalit chiqadi, `graduate` kiradi).

### 16. BotIntroLesson — «Kalit kimda — Botjon o'shaniki» (s6)

- **Joy:** `src/5-Modull/BotIntroLesson.jsx:948` (Screen6), trigger 956-qator; tanlov 994–995-qatorlar; `ACH_TRIGGERS` 1536.
- **Nishon:** `keyMaster` — 🔑 Key Master — «Kalitni bekor qilib, yangisini qo'ydingiz».
- **Hozirgi trigger:** `if (done && !fired.current) { ...; onAnswer(screen, { correct: true, picked: true }); }` — ikkala yo'l ham `done` ga olib boradi.
- **O'quvchi nima qiladi:** kalitni qayerda saqlashni tanlaydi: «A — bot.js ochiq kod ichida» yoki «B — .env qulfli
  tortmada». A tanlansa — oqibat-hikoya (kalit o'g'irlanadi) + 3 qadamli tuzatish; B tanlansa — darhol yakun.
  Qaysi birini tanlasa ham nishon beriladi.
- **Tasdiq:** B — to'g'ri (hozirgi kodda). Lekin tanlovning o'zi ma'noli: bittasi xavfsiz, bittasi yo'q.
- **TAVSIYA: b** — `correct: choice === 'B'` (birinchi tanlov qotadi). Bu 5-moduldagi qardosh darslarda ALLAQACHON
  ishlayotgan naqsh (`saralash-xulosa.md`: BotAiBrain, BotFullProject, BotAiAgent s9). `.env` avvalgi modulda o'tilgan
  (AuthEnvLesson), demak bu — bilimni tekshirish, taxmin emas.
- **Ishonch PAST — qaror sizniki.** Qarshi dalil: A yo'li pedagogik jihatdan boyroq (o'quvchi oqibatni ko'radi va
  tuzatadi), nishon tavsifi ham aynan A yo'lini tasvirlaydi («bekor qilib, yangisini qo'ydingiz» — B yo'lida hech narsa
  bekor qilinmaydi). Shart qo'yilsa: `desc` o'zgaradi (uz + ru), `AchRule` tanlovdan OLDIN ko'rinadi, A ni tanlagan
  o'quvchi hikoyani odatdagidek ko'radi — faqat nishonsiz. Muqobil: **c-graduate** — bu darsda ham `graduate` yo'q,
  nishonlar 4 ta (`keyMaster`, `sheetMaster`, `sheetWriter` + s7 ichidagi bonus `neverSilent`, 2464-qator).
- **Hajm (b):** ~5 qator + `AchRule` + `desc` uz/ru.

### 17. PmLesson19 — uch halqa xaritasi (s4)

- **Joy:** `src/5-Modull/PmLesson19.jsx:856` (Screen4), trigger 891-qator; `ACH_TRIGGERS` 1899.
- **Nishon:** `innerCircle` — 🎯 Map Pro! — «Uch halqani ochib solishtirdingiz».
- **Hozirgi trigger:** `const done = picked.length === HALQA.length; ... onAnswer(screen, { stage: 'halqa', picked, solved: true, correct: true })`.
- **O'quvchi nima qiladi:** uch halqani bosib ochadi, keyin har birida «bir hafta»ni ishga tushirib natijani tomosha
  qiladi. Tartib ixtiyoriy, xato yo'q.
- **Tasdiq:** B — to'g'ri.
- **TAVSIYA: c-graduate** — `innerCircle` o'rniga `graduate`. Sabab: 4 nishon (`innerCircle`, `twentyPlan`, `fullHouse`,
  `headCount`), `graduate` yo'q.
- **Zaxira: a** → `s5` test.
- **Hajm:** `ACHIEVEMENTS` da 1 qator (kalit → `graduate`, nom «Level Up!», `desc` uz/ru — matn siz bilan); `ACH_TRIGGERS`
  dan 1 kalit o'chadi; ildizda 2–3 qator (yakun ekraniga kelganda `earn('graduate')`; etalon `PmUserStoryLesson.jsx:2751`. Bu olti faylda
  `SUMMARY_IDX` o'zgaruvchisi yo'q — indeks `SCREEN_META` dagi `summary` qatoridan olinadi);
  katalog qayta yaratiladi (eski kalit chiqadi, `graduate` kiradi).

### 18. PmLesson21 — kunlarni ochish (s4)

- **Joy:** `src/5-Modull/PmLesson21.jsx:837` (Screen4), trigger 857-qator; `ACH_TRIGGERS` 1835.
- **Nishon:** `dayTwo` — 🗓 Day Two! — «Kunlarni ochib ikki sonni yonma-yon ko'rdingiz».
- **Hozirgi trigger:** `const done = n >= KUNLAR.length; ... onAnswer(screen, { stage: 'kun', solved: true, correct: true })`.
- **O'quvchi nima qiladi:** bitta tugmani ketma-ket bosib kunlarni ochadi.
- **Tasdiq:** B — to'g'ri.
- **TAVSIYA: c-graduate** — `dayTwo` o'rniga `graduate`. Sabab: 4 nishon (`dayTwo`, `countKeeper`, `twoInARow`,
  `codeCounter`), `graduate` yo'q.
- **Zaxira: a** → `s5` test.
- **Hajm:** `ACHIEVEMENTS` da 1 qator (kalit → `graduate`, nom «Level Up!», `desc` uz/ru — matn siz bilan); `ACH_TRIGGERS`
  dan 1 kalit o'chadi; ildizda 2–3 qator (yakun ekraniga kelganda `earn('graduate')`; etalon `PmUserStoryLesson.jsx:2751`. Bu olti faylda
  `SUMMARY_IDX` o'zgaruvchisi yo'q — indeks `SCREEN_META` dagi `summary` qatoridan olinadi);
  katalog qayta yaratiladi (eski kalit chiqadi, `graduate` kiradi).
  (15, 17, 18 — bitta qolipdagi uch dars, birga qilinadi.)

### 19. PmMetricsLesson — «Retention foizini hisoblab beradigan kod yozamiz» (s10) — ETALON-dars

- **Joy:** `src/pm/PmMetricsLesson.jsx:1830` (ScreenCoding), trigger 1865-qator; `ACH_TRIGGERS` 2011.
- **Nishon:** `calcMaster` — 🛠️ Calc Master! — «Retention foizini kodda hisobladingiz».
- **Hozirgi trigger:** `const complete = () => { if (done || !calcOk) return; ...; onAnswer(screen, { stage: 'koding', solved: true, correct: true }); }`.
- **O'quvchi nima qiladi:** kodni VS Code'da o'zi teradi (ekrandan tashqarida), ekrandagi «jonli sinov»ga istalgan ikki
  son kiritadi va «✅ Bajardim»ni bosadi. Kod yozilgani ekranda tekshirilmaydi — vijdon asosida.
- **Tasdiq:** B — to'g'ri: xato qilib bo'lmaydi, lekin ish ham ekranda emas.
- **TAVSIYA: c-mehnat** — mehnat nishoni; `AchRule` ko'rsatilmaydi. Sabab: darsda halol nishonlar allaqachon bor (`dataEye` —
  3 testdan 3 tasi, `panelPro` — tekshiriladigan amaliyot); bu ekranni tekshiriladigan qilish = yangi PM darslardagi
  `pickKod` qolipini (PmLesson10 va keyingilar) etalon-darsga ko'chirish — katta ish.
- **Ishonch PAST.** Muqobil: **b-katta** — o'sha `pickKod` qolipi (~60+ qator, matn, etalon-dars uchun to'liq zanjir).
  Hozir emas, KATTA ro'yxatiga yozib qo'yish to'g'riroq.
- **Hajm (c-mehnat):** kod 0 qator; qonunga 1 band (6-raqamli taklif bilan bir xil band).

---

## Qaror-ro'yxat (tez javob uchun)

Tavsiyam bo'yicha: **1 — a · 2 — A savat · 3 — a · 4 — a · 5 — a · 6 — c-mehnat · 7 — b · 8 — c-graduate ·
9 — c-graduate · 10 — A savat · 11 — a · 12 — A savat · 13 — c-graduate · 14 — A savat · 15 — c-graduate ·
16 — b (ishonch past) · 17 — c-graduate · 18 — c-graduate · 19 — c-mehnat (ishonch past)**

«Hammasi tavsiya bo'yicha» desangiz — shu ro'yxat ketadi. Boshqacha bo'lsa, faqat o'zgarganini yozing (masalan:
«16 — c-graduate, 6 — b»).

Alohida uchta «ha / yo'q»:

1. **«c-graduate» ga ruxsat** — 6 darsda tekin nishon `graduate` (yakun ekranidagi ishtirok nishoni) ga aylansinmi?
   (Yo'q bo'lsa — oltitasi ham zaxira «a» ga, ya'ni yonidagi mikro-testga o'tadi.)
2. **«c-mehnat» uchun qonun-band** — 151-qonunga «ijodiy yozma ish va ekrandan tashqaridagi ish — mehnat nishoni,
   `AchRule` siz» qo'shilsinmi?
3. **Matnlar** — `desc` lar (1, 3, 4, 5, 11, 16), 3-dagi Mentor qatori, 7-dagi yangi topshiriq jumlasi va oltita
   `graduate` tavsifi: yangi matnlarni men taklif qilib, sizga ko'rsataymi? (Yozishdan oldin `MATN_KORPUS.md`
   o'qiladi; uz + ru.)

## Bu ro'yxatdan tashqarida ko'zga tashlangani (tuzatilmagan, faqat qayd)

- **C savat («test — halol») ichida ham tekin trigger bor:** `JsConditionsLesson` s15 (`firstif`) meta'da `type: 'test'`,
  lekin mexanika — harf terilishi bilan avto-o'tish, `onAnswer({ correct: true })` (1290–1308-qatorlar); `selse` ham
  shunday. «Birinchi urinish» tushunchasi yo'q. C savatdagi 148 trigger orasida shu turdagi yozma «test»lar alohida
  grep bilan ajratilishi kerak (`type: 'test'` + `QuestionScreen` EMAS).
- `saralash-xulosa.md` dagi C' ro'yxat (VsCodeLesson s2/s3, PmLesson6 s9/s10, PmLesson18 s9, PmLesson22 s4,
  PmLesson25 s4 — «tugatdi» sharti) bu yerda ko'rilmadi — ular ham shu uch variant bo'yicha qaror kutadi.
- Skript B/A ni ajratishda `hint`, `reject`, `frame-warn`, `!== TARGET` kabi xato-belgilarni tanimaydi (4 ta noto'g'ri B
  shundan). A savatdagi 146 trigger ichida teskari xato (aslida B) ham bo'lishi mumkin — A ni ochib tasdiqlashda
  e'tiborda tutilsin.
