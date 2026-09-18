# KATTA §41 — B TO'LQIN: TO'LIQ REJA (2026-09-19)

Maqsad: 151-qonun («topshiriq nishoni — faqat birinchi urinishga») va 152-qonun («bonus — o'quvchini qismaymiz») ni
HAMMA darsda halol va sifatli joriy qilish. Muddat — mezon emas (foydalanuvchi, 19.09: «dushanbani o'ylama, sifatni o'yla»).
Bu fayl — REJA va QAROR-RO'YXAT. Kodga tegilmagan.

## 0. Bu reja nimaga tayanadi (halol)

- 178 ta topshiriq-trigger (75 dars) **bittalab ochib o'qildi** — 6 ta parallel inventar (`inventar-P1…P6.json/.md`,
  birlashmasi `inventar-JAMI.json`). Har yozuvda: mexanika · xato yo'li (qator + kod) · «bitta urinish» ta'rifi ·
  `miss` nuqtasi taklifi · `AchRule` joyi · hukm · yon-topilma · hajm.
- **Chegara:** hammasi KODDA o'qilgan, BRAUZERDA hech biri ochilmagan. Shuning uchun reja har ekranga brauzer-sinovni
  majburiy qiladi (4-bo'lim).
- **Avtomatik saralash ishonchsiz chiqdi:** «A challenge» deb belgilangan ekranlarning taxminan 40% i aslida tekin yoki
  mehnat (skript `tries`, `tekshir`, `miss`, `hint` so'zlarini xato-belgi deb olgan). «C' halol» savatidan ham kamida
  6 tasi to'liq halol emas. Xulosa: bu ishda skriptga emas, faqat ochib o'qishga ishoniladi.

## 1. Katta rasm (sonlar)

| Hukm | Soni | Ma'nosi | Nima qilinadi |
|---|---|---|---|
| A — qo'l ishi | 62 | xato yo'li bor, ekran o'ziga xos yozilgan | `miss(screen)` 1–3 qator + `AchRule` + brauzer-sinov |
| A — umumiy komponent | 21 | `DragDropOrder` · `DebugChallenge` · `PickLines` · `NightShift` | komponentga `onWrong` ilgagi (pilotdagi 2 qator) + ekranda ulash |
| C — halol | 21 | nishon allaqachon birinchi urinishga hisoblanadi | `AchRule` + `miss()` (F5-teshikni yopadi) |
| **Ishlanadigan jami** | **104 ekran · 65 dars** | | taxminan 540 qator + har darsga `AchRule` komponenti va CSS |
| MEHNAT | 39 | erkin yozma ish (23) · VS Code «Bajardim» (6) · koding va boshq. (10) | kodga tegilmaydi; 152-qonun 5-band + reyestr |
| TEKIN | 24 | xato qilib bo'lmaydi | 152-qonun: bonus / ko'chirish / «haqiqiy topshiriqqa aylantirish» — **qaror** |
| NOANIQ | 9 | asosan PM «koding» ekranlari (sinf-qaror) | **qaror** (Q1) |
| Pilot | 2 | bajarilgan | — |

Mexanika (104 ekran): tanlov/o'yin 39 · debug-qator 15 · pickKod-darvoza 10 · sudrab-tartiblash 9 · sudrab-moslash 9 ·
«Tekshirish» tugmasi 5 · boshqa 17.

**Inventardan tashqarida topilgan uch teshik (rejaga kiritildi):**
1. **Ball halolligi.** 143 ta «custom test» ekranidan 80 tasi `QuestionScreen` (halol), 18 tasi hisoblaydi, **45 tasi
   (44 dars, asosan yakuniy `s15`) natijani DOIM `correct: true` yozadi** — 13 tasi `DragDropOrder`, qolgani yozma/regex.
   Bu nishon emas, **LMS'ga ketadigan ball** (`correctAnswers`, `finalScore`). Ro'yxat: `ball-custom-ekranlar.json`.
2. **`ACH_TRIGGERS` dan tashqaridagi nishonlar:** 16 darsda to'g'ridan-to'g'ri `earn('…')` + PmLesson25 `ACH_EXTRA` —
   17 nishon hech qaysi o'lchovga kirmagan.
3. **34 ekranda Mentor / audio / maslahat javobni urinishdan OLDIN aytadi** — bunday ekranda «birinchi urinishda to'g'ri»
   sharti ma'nosiz (Ilova 2).

## 2. QARORLAR (foydalanuvchi) — har birida variantlar va tavsiya

**Q1 — «Koding» nishonlari (PM `ScreenCoding` / pickKod, ~15 ekran + kompilyatorli koding).** Ekran ikki qism: avval bitta
darvoza-savol (xato qilsa bo'ladi), keyin kod yozish (`HtmlCompiler` shartlarni JONLI tekshiradi — «Tekshirish» hodisasi
yo'q; yoki VS Code + «Bajardim»). Nishon tavsifi — kod yozish haqida.
- **A (tavsiya):** MEHNAT nishoni. 152-qonun 5-bandga aniqlik: «kompilyatorda yoki VS Code'da kod yozish — mehnat».
  Sabab: tavsif kod haqida, kodda esa diskret urinish yo'q; nishonni darvoza-savolga bog'lash tavsifni yolg'on qiladi.
  Pretsedent: PmMetrics s10.
- B: darvoza-savoldagi birinchi xato = `miss`. (Tavsif o'zgarishi kerak bo'ladi.)

**Q2 — «To'g'ri javobi yo'q, o'z qarori» mashqlari** (PmLesson5 «tarozi», «ochilish ro'yxati» va o'xshashlar).
- **A (tavsiya):** MEHNAT; 5-band kengayadi: «…va yagona to'g'ri javobi bo'lmagan o'z-qaror mashqi».
- B: bonus hisobiga (darsda bonus bo'lsa — ko'chirish kerak bo'ladi).

**Q3 — Ko'p-bandli topshiriqda qattiqlik** (6 karta, 5 qadam: 151-jadval bo'yicha BITTA xato bosish nishonni oladi).
- **A (tavsiya):** qoida bir xil qoladi — bitta xato = nishon yo'q. Sabab: o'quvchi uchun bitta tushunarli qoida;
  «🏅 Birinchi urinishda to'g'ri bajarsangiz» matni rost qoladi; yumshoqlikni 152-qonun allaqachon beradi (darsda
  2 kafolatli nishon). Sirpanish (zonadan tashqariga tashlash, «qator band») urinish sanalmaydi — har ekranda ajratiladi.
- B: 5+ bandli topshiriqda bitta xatoga ruxsat (matn: «…ko'pi bilan bitta xato bilan»). Yangi matn + har ekranda sanagich.

**Q4 — 24 TEKIN ekran (Ilova 1).** Sinf-siyosat taklifi:
- (a) **PM darslarda s4 (induktiv ochilish) — darsning BONUSI** (PmLesson9/10/11/14/16/18/22/23/24/25 va b.): bu darslarda
  `graduate` yo'q, bonus bitta bo'ladi, tavsiflar asosan rost, kod o'zgarishi ≈ 0. **Tavsiya: ha.**
- (b) Darsda bonus ALLAQACHON bor bo'lsa (CssLesson1 s13, JsConditions s14, DbSql s3, PmLesson19 s9, BotApiButtons s11/s12)
  → testga ko'chirish yoki Q5. Har biri dars-badars [GATE] da ko'rsatiladi.
- (c) PmLesson20 (s4 + s9) — senariyga tegadi: alohida qaror.

**Q5 — «Faqat xato qator bosiladigan» debug ekranlari** (CssLesson1/2 s14 · Htmllesson2 s14 · JsConditions s14 ·
ApiPostman s14): kod qatorlaridan faqat xatolisida `onClick` bor → xato qilib bo'lmaydi.
- **A (tavsiya):** haqiqiy topshiriqqa aylantirish — hamma qator bosiladigan, xato qator bosilsa qisqa fidbek + `miss`
  (~10 qator/dars + 1 yangi jumla uz/ru — matn tasdiq bilan). Sabab: debug darsining butun ma'nosi — xatoni TOPISH.
- B: bonus / testga ko'chirish (arzon, lekin ekran tomosha bo'lib qoladi).

**Q6 — 34 ekranda javob oldindan aytiladi (Ilova 2).**
- **A (tavsiya):** `AchRule` qo'yiladigan ekranlarda Mentor/audio/maslahat qayta yoziladi: muammoni qo'yadi, javobni
  aytmaydi; maslahat faqat birinchi xatodan KEYIN ochiladi. 150-qonun: har matn ro'yxat bilan tasdiqqa; KORPUS avval.
- B: tegilmaydi (unda bu ekranlarda nishon baribir deyarli kafolatli — qoida qog'ozda qoladi).

**Q7 — BALL halolligi (45 ekran, 44 dars).**
- **A (tavsiya):** `DragDropOrder` va tanlov asosidagi testlarda `correct` = birinchi TO'LIQ urinish (MCQ bilan bir xil
  o'lchov); yozma/regex testlarda diskret urinish yo'q → «bajarildi» bo'lib qoladi va bu 151-qonunga ochiq yoziladi.
  Avval 45 ekran bittalab ochiladi (mini-inventar), keyin ro'yxat bilan [GATE].
- B: tegilmaydi (ball «oxir-oqibat yechdi» ma'nosida qoladi).
- ⚠ Bu o'quvchi bahosiga tegadi → qaror faqat sizniki. Haqiqiy darslar hali boshlanmagan — tarixiy ma'lumot buzilmaydi.

**Q8 — §183 ga uchinchi matn** (bir martalik, qayta urinishi YO'Q ekranlar — masalan PmLesson6 «Tinglovchi kursisi»):
xatodan keyin «…endi bemalol to'g'risini toping» yolg'on bo'ladi. Taklif: «Nishon birinchi urinish uchun edi.» (uz) ·
«Значок давался за первую попытку.» (ru). **Matn tasdig'i kerak.**

Mayda, dars-darajasidagi savollar (GithubActions s17 bo'sh xarita, BotIntro s7 Mentor jumlasi, PmLesson25 `proofFinder` …)
hozir emas — o'sha darsning [GATE] ida, ekran nomi bilan so'raladi.

## 3. TO'LQINLAR (tartib)

| # | To'lqin | Nima | Usul | Darvoza |
|---|---|---|---|---|
| W0 | Tayyorgarlik | A to'lqinni COMMIT (toza qaytish nuqtasi) · Q1–Q8 qarorlar · 3 mini-inventar: 17 «tashqi» nishon, 45 ball-ekran, 9 NOANIQ | o'qish | [GATE] qarorlar |
| W1 | Infratuzilma | `AchRule` komponenti + 3 qator CSS — 65 darsga (9 tasi faqat o'zbekcha → uz-variant; VsCode va FullSystemProject — `<style>` qo'lda) | skript (quruq → yozish) | gates · `lint:jsx` · ekranlarda hech narsa o'zgarmaganini ko'rish (qator hali ulanmagan) |
| W2 | Umumiy komponentlar (21 ekran) | `DragDropOrder`/`DebugChallenge`/`PickLines`/`NightShift` ga `onWrong`; ekranda `miss` + `AchRule` | yarim-mexanik | har komponent turiga skriptli brauzer-sinov, HAR ekranda yuritiladi |
| W3 | PM qolipi (~25 ekran) | `setMissedOnce(true)` / `setXatoBor(true)` langari yonida `achMiss.miss(screen)` (mahalliy `miss` nomi band → `achMiss`) | qo'lda, qolip bo'yicha | ekran-probi (4-bo'lim) |
| W4 | C-halol (21 ekran) | xato nuqtasida `miss()` (F5-teshik) + `AchRule`; AuthEnv s7/s13 `restart` teshigi; ClaudeSkills s7/s13 | qo'lda | ekran-probi + F5 holati |
| W5 | Qolgan A-qo'l ishi (~40 ekran) | modul-modul; sirpanish ↔ bilim xatosi ajratiladi | qo'lda | ekran-probi |
| W6 | TEKIN (24) + Q5 | bonus reyestri · ko'chirishlar · debug ekranlarni haqiqiy qilish | qo'lda + matn | [GATE] matnlar · ekran-probi |
| W7 | Matn to'lqini (34 + rost bo'lmagan tavsiflar) | KORPUS → taklif-ro'yxat → tasdiq → metodist → 👦 2-o'qish | rol-zanjir | `lint:til` · 👦 hisobot |
| W8 | Ball halolligi (Q7 bo'yicha) | 45 ekran | qo'lda + `DragDropOrder` qolipi | `smoke:onfinished` invariantlari yangilanadi |
| W9 | Yakun | 151/152-qonun va §183 yangilash · KORPUS juftliklar · katalog · to'liq gates · `--seal` smoke · `vite build` · tekshiruvchi → verifikator → qabulchi · `lms/` qayta yig'ish + md5 + CRM ro'yxati · server-deploy (katalog) | | qabulchi imzosi |

Tartib mantig'i: avval umumiy va qolipli ish (kam xavf, ko'p ekran), keyin o'ziga xos ekranlar, eng oxirida matn va ball
(qaror va tasdiq talab qiladi). Har to'lqin — alohida commit; har to'lqin oxirida jurnal + [GATE] hisobot.
Parallel ishlash mumkin (modul bo'yicha fork'lar), lekin «bir fayl — bir muharrir»: bir dars bir vaqtda faqat bitta qo'lda.

## 4. SIFAT: har ekran qanday isbotlanadi

1. **Statik:** `npm run gates -- <fayl>` (yangi topilma 0 — HEAD bilan `lintcmp.py`) · `lint:jsx` · `lint-keys`.
2. **Umumiy brauzer-smoke — yangi `scripts/smoke-achrule.mjs` (HAMMA ulangan ekran):** ekranga urug'lanadi →
   (a) boshida qator ko'rinadi, matni §183 bilan harfma-harf; (b) `missed:[sid]` bilan — «lost» matni; (c) mentor
   rejimida yo'q; (d) mashq-o'tishida yo'q; (e) nishon olingan bo'lsa yo'q; (f) qator topshiriq OSTIDA (skrinshot).
3. **Ekran-probi — yangi `ach-probe.mjs` + har ekranga kichik JSON-spetsifikatsiya** (ulash paytida yoziladi: xato harakat
   selektori, to'g'ri yakunlash qadamlari): xato → `progress.missed` da sid, «lost» qator, **F5 dan keyin ham** turibdi →
   to'g'ri yakun → nishon YO'Q · toza holat → birinchi urinishda to'g'ri → nishon + bayram · sirpanish → `missed` BO'SH.
   **Qamrov maqsadi — 104 ekranning 100% i** (namuna emas). Probni yoza olmagan ekran hisobotda ochiq aytiladi.
4. **Rol-zanjir (har to'lqin):** tekshiruvchi (adversarial, maks 2 aylanish) → verifikator → qabulchi. Matn o'zgargan
   ekranlarda 👦 o'quvchi 1- va 2-o'qish.
5. **Regress:** `smoke:onfinished -- --seal` (I1–I11) ikki tilda · pilotning olti holati · `vite build`.

## 5. HAJM (halol baho — muddat emas, ko'lam)

| To'lqin | Ekran | Taxminiy sof ish |
|---|---|---|
| W0 mini-inventarlar | 71 | 3–4 soat |
| W1 | 65 dars | 2–3 soat |
| W2 | 21 | 6–8 soat |
| W3 | ~25 | 8–10 soat |
| W4 | 21 | 6–8 soat |
| W5 | ~40 | 18–24 soat |
| W6 | 24 + 5 | 8–10 soat |
| W7 | 34+ | 10–14 soat + sizning tasdiqlaringiz |
| W8 | 45 | 8–12 soat |
| W9 | — | 6–8 soat |
| **Jami** | | **≈ 75–100 soat sof ish** — bir necha kunlik, bir seansda 1–2 to'lqin |

Eng katta noaniqlik: W5 (o'ziga xos ekranlar) va ekran-problari — 100% qamrov qimmat, lekin «maksimal sifat» shu.

## 6. XAVFLAR

- **Teskari xato:** inventar ham kod o'qigan — brauzerda boshqacha chiqishi mumkin → 4-bo'lim 3-band shuning uchun 100%.
- **Nom to'qnashuvi:** PM ekranlarida mahalliy `miss`/`setMiss` bor → kontekst o'zgaruvchisi doim `achMiss`.
- **Bir qatorli funksiyalar** (`mark`, `pick`, `reset`): ichiga `//` izoh yozilmaydi (F-0802-15) · **CSS izohiga backtik
  yozilmaydi** (oq ekran; uch marta tutilgan).
- **`setTimeout` ichidagi `miss`** (PmLesson1 s11) va holat-mashinalari — prob ikki rad-yo'lini ham bosadi.
- **Sirpanish ↔ bilim xatosi** bitta shartda qo'shilgan joylar (PmLesson4 s4, PmLesson13 s4, ApiPostman s3, CssLesson2 s7).
- **Server-progress `missed`/`firstPass` ni tashimaydi** — boshqa qurilmadan davom etilsa belgi yo'qoladi (151-qonunda
  yozilgan chegara; yopish — alohida server ishi, bu rejaga kirmaydi).
- **Katalog:** nishon kaliti/tavsifi o'zgarsa — server-deploy bilan birga.
- **Toza baza yo'q:** A to'lqin (119 fayl) commit qilinmagan — W1 dan OLDIN commit shart.
- **9 dars faqat o'zbekcha** — `AchRule` uz-variant; ruschaga o'girilganda `tr()` ga o'tadi.
## Ilova 1 — TEKIN va NOANIQ ekranlar (qaror kerak)

| # | Dars · ekran · nishon | O'quvchi nima qiladi | Inventar taklifi (152-qonun) |
|---|---|---|---|
| 1 | DbSqlNosqlLesson · s3 · `packageMaster` (NOANIQ) | Post kartalarini SQL quti yoki NoSQL paketga taqsimlaydi. Kartani BOSSA — u o'zi to'g'ri joyga tushadi (`autoHome`, 807/822). Sudrasa: 🎵 mus… | Darsda allaqachon bonus bor: `connector` s5 (152-qonun reyestri). Bosish avto-joylagani uchun bu nishon amalda ikkinchi kafolatli nishon (graduate yo'q). Variantlar: (1) `onWrong` qo'shiladi… |
| 2 | PmLesson12 · s4 · `eyesOpen` (NOANIQ) | Avval uch kirishni (siz / sinfdosh / …) ochib ko'radi, keyin 5 qatordan sinfdoshdan yopilishi keraklarini (3 ta) bosadi. Ochiq qolishi kerak… | Darsda bonus ham, `graduate` ham yo'q. Tavsiyam: BONUS (tavsif rost — «yopdingiz»; ekran pedagogikasi «xato — foydali» ustiga qurilgan, nishonni shu xato uchun olib qo'yish muallif niyatiga … |
| 3 | PmLesson17 · s10 · `weekPlanner` (NOANIQ) | Avval bitta kod-savoliga javob beradi (xato variant silkinadi), keyin kodni yozadi. | (a) tanlansa — mehnat nishoni, PmMetrics s10 pretsedenti (152-qonun 5-band). |
| 4 | PmLesson18 · s10 · `siteChecker` (NOANIQ) | Avval bitta kod-savoliga javob beradi (xato variant silkinadi), keyin kodni yozadi. | (a) tanlansa — mehnat nishoni, PmMetrics s10 pretsedenti (152-qonun 5-band). |
| 5 | PmLesson20 · s4 · `goodListener` (NOANIQ) | To'rt savol-kartasini bosib, suhbatdosh javoblarini «eshitadi» (yozilib chiqadi); keyin uch qatordan qaysi biri varaqqa yozilishi kerakligin… | IKKI yo'l bor, qaror foydalanuvchida: (A) 151-naqsh — yakuniy tanlovga `miss` + AchRule; unda tavsif o'zgaradi («…odamning o'z gapini topdingiz» kabi), chunki hozirgi tavsif tinglashni aytad… |
| 6 | PmLesson20 · s9 · `sharpSifter` (NOANIQ) | To'rt savolning har biri uchun «elak» yo'lini bir marta tanlaydi (o'tadi / kelajak / yopiq…); tanlov qotadi, tuzatish-qatori va sababi darho… | Bu — senariy qarori bilan ATAYLAB ishtirok nishoni (tavsif rost: «…tanladingiz»). 152-qonun bo'yicha u kafolatli = bonus o'rnini egallaydi. Darsda s4 ham kafolatli → ikkitadan BITTASI halol … |
| 7 | PmLesson22 · s10 · `codeCheck` (NOANIQ) | Avval bitta kod-savoliga javob beradi (xato variant silkinadi), keyin kodni yozadi. | (a) tanlansa — mehnat nishoni, PmMetrics s10 pretsedenti (152-qonun 5-band). |
| 8 | PmLesson23 · s10 · `limitCoder` (NOANIQ) | Avval bitta kod-savoliga javob beradi (xato variant silkinadi), keyin kodni yozadi. | (a) tanlansa — mehnat nishoni, PmMetrics s10 pretsedenti (152-qonun 5-band). |
| 9 | PmLesson24 · s10 · `codePlanner` (NOANIQ) | Avval bitta kod-savoliga javob beradi (xato variant silkinadi), keyin kodni yozadi. | (a) tanlansa — mehnat nishoni, PmMetrics s10 pretsedenti (152-qonun 5-band). |
| 10 | CssLesson1 · s13 · `bezak` (TEKIN) | 6 ta xususiyat-chipidan istalgan 3 tasini yoqadi; karta va CSS kodi o'zi o'zgaradi. 3-chip yoqilishi bilan nishon. | Darsda bonus ALLAQACHON bor (`rang` s5 — 152-reyestr) va s14 `debugger` ham TEKIN chiqdi → darsda 3 tekin + graduate. Taklif: `bezak` → s15 yakuniy yozma testga (`h1` ni qizil qilish — CSS q… |
| 11 | CssLesson1 · s14 · `debugger` (TEKIN) | 4 qatorli CSS dan faqat bittasi bosiladi (`color: blue`); qolgan uchtasida `cursor: default`, onClick yo'q. Bosadi → «🔧 tuzatish» tugmasi → … | Darsda bonus bor (`rang`). Taklif (b) SHART QO'YISH: qolgan qatorlarni ham bosiladigan qilish (xato → silkinish + «Bu qator to'g'ri» + miss) — ~10 qator + 1 yangi matn (uz+ru). Muqobil: s12 … |
| 12 | CssLesson2 · s14 · `debugger` (TEKIN) | 4 qatordan faqat `display: block` bosiladi (u `btn-pulse` bilan pulsatsiya ham qiladi); keyin «display: flex ga tuzatish». | Bu darsda bonus HALI YO'Q (flexbox — A, markaz — A) → 152 bo'yicha bonus bo'lib qolishi MUMKIN; lekin tavsif «topib tuzatdingiz» + pulsatsiya qiluvchi yagona qator — bonus uchun ham zaif. Ta… |
| 13 | Htmllesson2 · s14 · `debugger` (TEKIN) | 2 qatordan faqat <img src=""> qatori bosiladi; keyin «src ga fayl nomini qo'shib tuzatish». | Darsda bonus ALLAQACHON bor (`forma` s7, 152-reyestr) → joyida qola olmaydi. Taklif: (b) qatorlarni bosiladigan qilish (CssLesson1/2 s14 bilan BIR qolipda) yoki s12 testga ko'chirish. Qaror … |
| 14 | VsCodeLesson · s3 · `pilot` (TEKIN) | VS Code maketidagi 4 nuqtani bosib, izohini o'qiydi. | Darsda bonus yo'q (`installed` — mehnat, `cardmaster` — praktika-kompilyator yakunida `earn('cardmaster')`, 3093) → `pilot` BONUS bo'lib qolishi mumkin: o'quvchi ish qildi (4 nuqtani ochdi),… |
| 15 | JsConditionsLesson · s14 · `debugger` (TEKIN) | Ikki qatorli kodda xato qatorni bosadi, keyin «= ni == ga almashtirish» tugmasini bosadi. | Darsda bonus ALLAQACHON bor (s13 builder, 152-reyestr) + graduate → bu uchinchi kafolatli nishon. Taklif: shart qo'yish — `let pin = 1111` qatorini ham bosiladigan qilish (xato tanlov: «bu y… |
| 16 | PmLesson10 · s4 · `silentWatch` (TEKIN) | To'rt kadrni bosib ochadi; har kadr ostida sinfdosh gapi va hukm (✅/⚪) chiqadi. To'rttasi ochilgach nishon. | Darsda `graduate` yo'q, boshqa bonus yo'q (152-reyestrda yo'q) → BONUS bo'lib qoladi: o'quvchi ish qildi (4 kadrni ochdi), tavsif rost («ochib chiqdingiz»). Kafolatli nishon: 1. |
| 17 | PmLesson9 · s4 · `bugHunter` (TEKIN) | Buyurtma oynasini o'zi sinaydi: taomsiz, 0 dona, ikki marta tez bosish va oddiy yuborish — har harakat bitta shartni «sinaldi» deb belgilayd… | Darsda `graduate` ham, boshqa bonus ham yo'q → BONUS. O'quvchi haqiqiy izlanish qiladi (ikki marta tez bosishni topish oson emas), tavsif rost. Kafolatli nishon: 1. |
| 18 | ReactIntroLesson · s13 · `builder` (TEKIN) | To'rt blok-tugmadan istalganini bosib sahifa yig'adi; istalgan 3 blok qo'shilgach nishon. «↺ Tozalash» bor. | Darsda `graduate` bor, boshqa bonus yo'q → BONUS (kafolatli 2 ta: `graduate` + `builder` — 152-chegara ichida). Tavsif rost. |
| 19 | ReactRouterPracticeLesson · s9 · `builder` (TEKIN) | Uch buyruqdan istalganini tanlaydi, agent rejasini tasdiqlaydi, 1,3 s dan keyin natija chiqadi. | Darsda `graduate` bor, boshqa bonus yo'q → BONUS (kafolatli 2). Bir sinf: ReactCrudPractice s11 (reyestrda bonus). |
| 20 | ApiPostmanLesson · s14 · `stampReader` (TEKIN) | AI so'rovidagi `/api/produts` qatorini bosadi → «🔧 produts → products» → «▶ Qaytadan Send». Boshqa qator (GET) bosilmaydi (`cursor: default`… | Darsda hozir bonus yo'q, `graduate` ham yo'q (4 nishon: s3 topshiriq · s12 test · s14 · s15 test). Taklif-1 (kam ish): bonus bo'lib qoladi, tavsif rostlanadi — «topib» so'zi da'vo (masalan «… |
| 21 | PmLesson11 · s4 · `memoryMaker` (TEKIN) | Besh tugmani yoqib-o'chirib, qaysi maydon qaysi bo'limni ochishini ko'radi; hammasi sinalgach va bittasi o'chirib ko'rilgach ekran yopiladi. | Darsda bonus ham, `graduate` ham yo'q (s8 mehnat · s9, s10 topshiriq). Taklif: BONUS bo'lib qoladi — tavsif allaqachon rost («sinab ko'rdingiz»), `AchRule` qo'yilmaydi. O'zgarish 0. |
| 22 | PmLesson14 · s4 · `threeFloors` (TEKIN) | Uch qavatni bosib ochadi va «yo'lni ko'rish» animatsiyasini ishga tushiradi. | Darsda bonus ham, `graduate` ham yo'q. Taklif: BONUS — tavsif rost («ochib chiqdingiz»). O'zgarish 0. |
| 23 | PmLesson16 · s4 · `cheapFix` (TEKIN) | Yo'ldagi uch nuqtani birma-bir tanlab «Chiqaramiz»ni bosadi va har nuqtada nosozlik narxini ko'radi. | Darsda bonus YO'Q, `graduate` ham yo'q → `cheapFix` shu darsning yagona BONUSI bo'lishi mumkin (152-qonun 1–2-band: o'quvchi ish qiladi — 3 marta tanlab chiqaradi). Tavsif allaqachon rost («… |
| 24 | CiCdIntroLesson · s9 · `clearedForTakeoff` (TEKIN) | 5 buyumdan xohlaganini chamadonga solib lentani yuboradi; buzuq buyum lentani to'xtatadi, tuzatib qayta yuboradi. Birinchi yashil yurishda n… | Darsda bonus ham, `graduate` ham yo'q (s10 test · s13 C-halol · s15 test) → BONUS bo'lib qolishi 152 ga mos (1 kafolatli). |
| 25 | PmLesson18 · s4 · `eagleEye` (TEKIN) | «Kunni boshlash»ni bosadi, keyin uch chegara qiymatining har birini bosib, signal soni qanday o'zgarishini ko'radi. | Darsda boshqa bonus yo'q, `graduate` yo'q → BONUS; tavsif rost. PmLesson17/19/21 s4 bilan bir qolip (ular 152 reyestrida bonus). |
| 26 | BotApiButtonsLesson · s9 · `buttonMaster` (TEKIN) | Uch signalni sinaydi (ulanmagan holda hech narsa bo'lmaydi), keyin har birini qoidalar varag'iga «ulaydi» va qayta sinaydi. | Darsda `graduate` YO'Q va 152-reyestrda bonus yo'q; lekin shu darsda UCHTA tekin nishon bor (s9, s11, s12). 152-qonun 1-band: ko'pi bilan bitta bonus. TAKLIF: s9 `buttonMaster` — BONUS bo'li… |
| 27 | BotApiButtonsLesson · s11 · `rightEnvelope` (TEKIN) | «Signalni sinash» → javob Valiga ketganini ko'radi → «tuzatish» tugmasini bosadi → «Qayta sinash». | TAKLIF: nishon `s10` test savoliga (module-mikro, s9–s11 blokining tekshiruvi) ko'chirilsin — `ACH_TRIGGERS` 1 qator + tavsif uz/ru. Muqobil (b): xatoni o'quvchi o'zi topsin — kod qatorlarid… |
| 28 | BotApiButtonsLesson · s12 · `neverSilent` (TEKIN) | Noma'lum xabar yuboradi → bot jim → «fallback qo'shish» tugmasi → qayta yuboradi; yonida rate-limit o'yinchog'i (🍕 ni tez bosish). | TAKLIF: nishon `s14` test savoliga ko'chirilsin (s12–s13 blokidan keyingi mikro-test) — 1 qator + tavsif uz/ru. Tavsif hozir rost («fallback qo'shdingiz»), lekin darsda bonus o'rni s9 ga ber… |
| 29 | PmLesson19 · s9 · `fullHouse` (TEKIN) | To'rt joydan istalganini bosadi: har joy «eshitdi → ochdi → ishlatdi» sonlarini ko'rsatadi; ishlatganlar yig'indisi 20 ga yetgach tugaydi. | Darsda allaqachon BONUS bor: s4 `innerCircle` (152-reyestr). Demak bu ikkinchi tekin — bonus bo'lib qola olmaydi. TAKLIF (b): tabiiy shart allaqachon kodda bor — `kamKordi`: nishon faqat kam… |
| 30 | PmLesson22 · s4 · `rightQuestion` (TEKIN) | To'rt katakni bosib, har birining javob-qatorini ochadi; 2-bosqich o'zi ochiladi. | Darsda boshqa bonus yo'q, `graduate` yo'q → BONUS; tavsif rost. PmLesson17/19/21 s4 bilan bir qolip (ular 152 reyestrida bonus). |
| 31 | PmLesson23 · s4 · `mirrorCheck` (TEKIN) | Uch ishda AI-rejimni bosib, o'ngdagi odamga ta'sirini ko'radi; so'ng uch ishdan birini «odamga qaytaradi» — qaysi birini tanlasa ham o'z nat… | Darsda boshqa bonus yo'q, `graduate` yo'q → BONUS; tavsif rost. PmLesson17/19/21 s4 bilan bir qolip (ular 152 reyestrida bonus). |
| 32 | PmLesson24 · s4 · `roadBuilder` (TEKIN) | Olti ishni birma-bir «boshlaydi» (har birida fakt chiqadi), so'ng bitta savolga istalgan variantni tanlaydi. | Darsda boshqa bonus yo'q, `graduate` yo'q → BONUS; tavsif rost. PmLesson17/19/21 s4 bilan bir qolip (ular 152 reyestrida bonus). |
| 33 | PmLesson25 · s4 · `slideTalker` (TEKIN) | Slaydning uch qatorini birma-bir ochadi, so'ng ikki rost raqamdan birini tanlaydi. | Darsda boshqa bonus yo'q, `graduate` yo'q → BONUS; tavsif rost. PmLesson17/19/21 s4 bilan bir qolip (ular 152 reyestrida bonus). |

## Ilova 2 — Mentor / audio / maslahat javobni urinishdan OLDIN aytadigan ekranlar (matn to'lqini)

| # | Dars · ekran | Hukm | Yon-topilma |
|---|---|---|---|
| 1 | CssLesson1 · s14 | TEKIN | Mentor va audio javobni OLDINDAN aytadi: «bir qatordan nuqta-vergul tushib qolgan» (1406, 1414-qatorlar) + o'ngdagi maslahat «Har CSS qatori ; bilan tugashi kerak. Qaysi qatorda u yo'q?». Tavsifdagi «topib» yarim-rost: topish uchu… |
| 2 | CssLesson2 · s14 | TEKIN | Audio va Mentor javobni aytadi («display flex yo'q — display block yozilgan»); to'g'ri qator pulsatsiya qiladi. |
| 3 | HtmlPractice · s2 | A-umumiy | HALOLLIK XAVFI: uchta <section> ning tartibi (Men haqimda → Loyihalar → Aloqa) mantiqdan kelib chiqmaydi — «Skeletni ko'rsatish» ko'rinishida yorliqlar «…» bilan yashirilgan (542–546), katak-maslahatlari esa «birinchi/ikkinchi/uch… |
| 4 | JsFunctionsLesson · s3 | A-umumiy | Slot-maslahatlari (hints: «funksiya e'loni kaliti», «mashina nomi»…) tartibni deyarli aytib turadi — pilotda ham shunday. `coder` nishoni ikki yo'ldan beriladi: s13 triggeri va praktika-kompilyator (2675 `earn('coder')`). |
| 5 | PracticeLesson3 · s5 | A-umumiy | Atigi 3 bo'lak va slot-maslahatlari javobni aytadi («poydevor — eng avval», «eng oxirida — bezak») — birinchi urinishda xato qilish qiyin. Meta'da turi `exploration`. |
| 6 | PmLesson8 · s9 | A-qol | Birinchi xatodan keyingi maslahat javobni deyarli aytadi («yon katakka») — bu xatodan KEYIN, qonunga zid emas. |
| 7 | ReactBuildSiteLesson · s10 | A-qol | JAVOB OLDINDAN AYTILGAN: ekranda qizil «⚠ Kartochkalarda narx ko'rinmayapti!» yozuvi turadi, to'g'ri variant esa aynan «narxni qo'sh» — nishon halol bo'lishi uchun topshiriq juda oson (matn-topilma, tuzatilmaydi — qayd). |
| 8 | ReactCrudPracticeLesson · s13 | A-qol | MASLAHAT JAVOBNI URINISHDAN OLDIN AYTADI: o'ng ustundagi boshlang'ich `hint` (1283) — «push o'sha eski ro'yxatning o'ziga qo'shadi, yangi ro'yxat yasamaydi»; xato qatorning o'z izohi ham «o'sha ro'yxatning o'ziga qo'shdi». Matn-to… |
| 9 | ReactFirstComponentLesson · s14 | A-umumiy | Boshlang'ich maslahat («JSX'da bitta so'z band edi…») yo'naltiradi, javobni aytmaydi — joiz. |
| 10 | ReactIntroLesson · s14 | A-umumiy | MASLAHAT JAVOBNI URINISHDAN OLDIN AYTADI: boshlang'ich `hint` — ««Qolgan hammasi» degani esa bitta ulkan monolit» — xato qatorning o'z izohi esa «qolgan HAMMASI shu yerda». Matn-topilma (qayd). |
| 11 | ReactRouterPracticeLesson · s13 | A-umumiy | MASLAHAT JAVOBNI URINISHDAN OLDIN AYTADI: boshlang'ich `hint` — «Ikkitasi <Link>, bittasi boshqacha. Qayta yuklash — <a href> ning belgisi»; Mentor (s9) ham «<Link> … (<a> emas)» degan. Matn-topilma (qayd). |
| 12 | ApiPostmanLesson · s14 | TEKIN | Mentor matni javobni aytadi («URL'ga diqqat bilan qarang: bir harf tushib qolgan») + `_tip` ipuchasi («Manzilda bitta harf yetishmaydi»). |
| 13 | BackendCrudPracticeLesson · s10 | A-qol | Xato qatorda `price` so'zi `<At>` bilan rangli ajratilgan (1210) va Mentor xato matnini («column "price" does not exist») oldindan o'qib beradi — topshiriq deyarli javob bilan beriladi. Alohida matn/dizayn topilma. |
| 14 | NodeServerLesson · s13 | A-qol | «Keyingi: <ipucha>» qatori (1138) HAR qadamdan OLDIN keyingi bo'lakning ma'nosini aytib turadi («serverni yarat» → `const app = express()`), Mentor ham tartibni to'liq sanaydi — topshiriq deyarli javob bilan. Nishon qiymatli bo'li… |
| 15 | NodeServerLesson · s14 | A-qol | B savat tahlilida aytilgan: Mentor va audio javobni oldindan aytadi («server umuman yoqilmagan», to'g'ri variant yozuvida ham izoh). Matn-topilma. |
| 16 | PostgresCrudLesson · s14 | A-umumiy | Mentor javobni aytadi: «Jadval nomi products (ko'plik)» — xato qator (`FROM product`) shu bilan ma'lum; audio ham «jadval nomida bitta harf xato». Matn-topilma. |
| 17 | RoutingLesson · s11 | A-umumiy | Audio javobni to'liq aytadi: «eshik tabelkasi boshqa shtampga sozlangan, @Get turibdi» — xato qator oldindan ma'lum. Matn-topilma. |
| 18 | NestArchPracticeLesson · s19 | A-qol | Ekran ikki xil o'qiladi: bosilgan to'g'ri da'vo «✓ tekshirildi» deb belgilanadi va hali bosilmaganlari `tap-hint` bilan yonadi — bu «hammasini bittalab tekshirib chiq» degan taassurot beradi. Shunda `miss` nohaq tuyulishi mumkin. … |
| 19 | AiPipelineProjectLesson · s9 | C-halol | `useStuckValve` qutqaruvi (`_resc`) «Davom etish»ni topshiriqsiz ochadi — `onAnswer` chaqirilmaydi, nishon yo'q (to'g'ri). Mentor «Yordamchi bu safar adashishi mumkin» deb tuzoqni sezdiradi (javobni aytmaydi — maqbul). |
| 20 | FullPipelineProjectLesson · s6 | A-umumiy | `hints` har slot ostida yo'naltiruvchi maslahat beradi — javobni to'g'ridan-to'g'ri aytmaydi. |
| 21 | BotAiAgentLesson · s5 | C-halol | Mentor (944) «Noto'g'ri variant ham bor — diqqat bilan tanlang» — shartni sezdiradi, javobni aytmaydi. Nishon tavsifi «idrok → qaror → amal» deydi, ekran esa «maqsad · asboblar · chegara» ni yig'diradi — tavsif ekranga aniq mos em… |
| 22 | BotAiProjectLesson · s7 | A-qol | Birinchi xato tashxisdan keyin chiqadigan maslahat javobni deyarli aytadi — bu xatodan KEYIN, shuning uchun halollikka zid emas. BotAiProject da yana 3 nishon test ekranlariga bog'langan (s4, s10, s15) — ular bu partiyada emas. |

## Ilova 3 — Ishlanadigan ekranlar (A + C-halol) dars bo'yicha

| Dars | Ekranlar (hukm · mexanika) |
|---|---|
| AiPipelineProjectLesson | s9 (C-halol · boshqa) · s13 (C-halol · boshqa) |
| ApiPostmanLesson | s3 (A-qol · dragdrop-moslash) |
| ArchPatternsLesson | s6 (A-qol · tanlov-oyin) · s12 (A-qol · tanlov-oyin) |
| AuthEnvLesson | s7 (A-qol · tanlov-oyin) · s13 (A-qol · tanlov-oyin) · s14 (A-qol · debug-qator-topish) |
| BackendCrudPracticeLesson | s5 (A-qol · tanlov-oyin) · s10 (A-qol · debug-qator-topish) |
| BotAiAgentLesson | s5 (C-halol · tanlov-oyin) · s7 (C-halol · tanlov-oyin) · s9 (C-halol · boshqa) · s11 (C-halol · boshqa) |
| BotAiBrainLesson | s5 (C-halol · tanlov-oyin) · s7 (C-halol · boshqa) · s9 (C-halol · boshqa) · s11 (C-halol · boshqa) |
| BotAiProjectLesson | s7 (A-qol · kop-qadam-builder) |
| BotApiButtonsLesson | s13 (C-halol · tanlov-oyin) |
| BotFullProjectLesson | s5 (C-halol · tanlov-oyin) · s7 (C-halol · boshqa) · s9 (C-halol · boshqa) · s11 (C-halol · boshqa) |
| BotIntroLesson | s7 (A-qol · dragdrop-moslash) · s13 (C-halol · tanlov-oyin) |
| BotStatefulMemoryLesson | s13 (C-halol · tanlov-oyin) |
| CiCdIntroLesson | s13 (C-halol · boshqa) |
| ClaudeSkillsLesson | s7 (A-qol · tanlov-oyin) · s13 (A-qol · tanlov-oyin) |
| CssLesson2 | s3b (A-umumiy · dragdrop-tartib) · s7 (A-qol · tanlov-oyin) |
| DbSqlNosqlLesson | s14 (A-qol · tanlov-oyin) |
| EdgeCasesTestLesson | s9 (A-qol · dragdrop-moslash) · s15 (A-umumiy · tanlov-oyin) |
| FullPipelineProjectLesson | s3 (A-umumiy · debug-qator-topish) · s6 (A-umumiy · dragdrop-tartib) · s10 (A-qol · tanlov-oyin) |
| FullstackFeedbackLesson | s5 (A-qol · dragdrop-moslash) |
| GithubActionsLesson | s17 (A-qol · tekshirish-tugmasi) |
| HtmlPractice | s2 (A-umumiy · dragdrop-tartib) · s14 (A-umumiy · debug-qator-topish) |
| HtmlTakrorlashLesson | s6 (A-qol · debug-qator-topish) |
| Htmllesson1 | s5 (A-umumiy · dragdrop-tartib) · s6 (A-umumiy · debug-qator-topish) |
| JestUnitTestLesson | s9 (A-qol · dragdrop-moslash) · s15 (A-umumiy · tanlov-oyin) |
| JsFunctionsLesson | s3 (A-umumiy · dragdrop-tartib) |
| JsLoopsLesson | s14 (A-qol · debug-qator-topish) |
| NestArchAliveLesson | s9 (A-qol · boshqa) |
| NestArchPracticeLesson | s10 (A-umumiy · tanlov-oyin) · s14 (A-qol · debug-qator-topish) · s19 (A-qol · tanlov-oyin) |
| NodeServerLesson | s13 (A-qol · tartib-bosish) · s14 (A-qol · tanlov-oyin) |
| PeanStackLesson | s13 (A-qol · tekshirish-tugmasi) |
| PmJtbdLesson | s10 (A-qol · pickKod) |
| PmLesson1 | s11 (A-qol · tekshirish-tugmasi) |
| PmLesson10 | s9 (A-qol · tanlov-oyin) |
| PmLesson11 | s9 (A-qol · tekshirish-tugmasi) · s10 (A-qol · pickKod) |
| PmLesson12 | s9 (A-qol · tanlov-oyin) · s10 (A-qol · pickKod) |
| PmLesson13 | s4 (A-qol · dragdrop-moslash) · s9 (A-qol · tanlov-oyin) · s10 (A-qol · pickKod) |
| PmLesson14 | s9 (A-qol · tanlov-oyin) · s10 (A-qol · pickKod) |
| PmLesson15 | s4 (A-qol · tanlov-oyin) · s9 (A-qol · tanlov-oyin) · s10 (A-qol · pickKod) |
| PmLesson16 | s9 (A-qol · tanlov-oyin) · s10 (A-qol · pickKod) |
| PmLesson17 | s9 (A-qol · tanlov-oyin) |
| PmLesson18 | s9 (C-halol · tanlov-oyin) |
| PmLesson19 | s10 (A-qol · pickKod) |
| PmLesson2 | s11 (A-umumiy · dragdrop-tartib) |
| PmLesson20 | s10 (A-qol · pickKod) |
| PmLesson21 | s9 (A-qol · tekshirish-tugmasi) · s10 (A-qol · pickKod) |
| PmLesson22 | s9 (A-qol · tanlov-oyin) |
| PmLesson23 | s9 (A-qol · tanlov-oyin) |
| PmLesson24 | s9 (A-qol · tanlov-oyin) |
| PmLesson25 | s9 (A-qol · tanlov-oyin) |
| PmLesson4 | s4 (A-qol · dragdrop-moslash) |
| PmLesson5 | s11 (A-qol · tanlov-oyin) |
| PmLesson6 | s2 (A-qol · tanlov-oyin) · s10 (C-halol · boshqa) |
| PmLesson8 | s4 (A-qol · dragdrop-moslash) · s9 (A-qol · dragdrop-moslash) |
| PmLesson9 | s9 (A-qol · dragdrop-tartib) |
| PostgresCrudLesson | s10 (A-qol · tanlov-oyin) · s14 (A-umumiy · debug-qator-topish) |
| PracticeLesson3 | s5 (A-umumiy · dragdrop-tartib) |
| ReactApiPostLesson | s13 (A-umumiy · kop-qadam-builder) |
| ReactBuildSiteLesson | s10 (A-qol · tanlov-oyin) |
| ReactCrudPracticeLesson | s13 (A-qol · debug-qator-topish) |
| ReactFirstComponentLesson | s14 (A-umumiy · debug-qator-topish) |
| ReactIntroLesson | s14 (A-umumiy · debug-qator-topish) |
| ReactPropsReuseLesson | s14 (A-umumiy · debug-qator-topish) |
| ReactRouterPracticeLesson | s13 (A-umumiy · debug-qator-topish) |
| RoutingLesson | s11 (A-umumiy · debug-qator-topish) · s13 (A-umumiy · dragdrop-tartib) |
| WriteSkillLesson | s13 (C-halol · boshqa) |

Jami: 104 ekran · 65 dars.