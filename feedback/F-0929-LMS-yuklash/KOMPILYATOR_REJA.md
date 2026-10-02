# F-1001-91 · Kompilyator to'liq yechimi — ISH-REJASI (avtopilot)

> Ochildi: 2026-10-01 17:15. Bu fayl — yagona yo'l-xarita. Har qadam bajarilgach `[x]` + sana + natija
> yoziladi; jurnal `JURNAL.md`. **[GATE]** belgisi bor joyda to'xtab, foydalanuvchi tasdig'i kutiladi.
> Bu faylni o'zgartirish = rejani o'zgartirish — faqat foydalanuvchi bilan.

## 0. Qabul qilingan qarorlar (o'zgarmaydi)

| № | Qaror | Manba |
|---|---|---|
| Q1 | Yo'l: ro'yxat to'ldirish + «goh-goh» yo'qotish + Emmet asoslari (S14 = B) **+ CSS va JS maslahati ham shu ishda (S14 = C, 01.10 ~17:15)** — tartib HTML → CSS → JS, har biri o'z darvozasi bilan | foydalanuvchi, 01.10 |
| Q2 | Ro'yxat darsga qarab: faqat shu darsgacha o'tilgan teglar (S15 = B); to'liq yozilgan teg Tab bilan baribir yoyiladi | foydalanuvchi, 01.10 |
| Q3 | Ro'yxat **qo'lda yozilmaydi** — teglar xaritasidan yasaladi; xarita qo'lda tasdiqlanadi; darvoza to'liqlikni tekshiradi | foydalanuvchi: «to'liq, vaqtinchalik emas» |
| Q4 | Enter: `<` bilan ochilgan ro'yxatda Enter va Tab tanlaydi; `<`siz so'zdan ochilganda faqat Tab (Enter = yangi qator) | tavsiya qabul |
| Q5 | Emmet (`!`, `>`, `*n`, `.class`, `#id`) VS Code darsidan (m1-15); bitta teg + Tab birinchi HTML darsidan; `.class`/`#id` CSS-1 dan oldin ishlamaydi | tavsiya qabul |
| Q6 | Sensor panelga ⇥ (Tab) tugmasi | tavsiya qabul |
| Q7 | Kompilyator **fayl ichida** (inline) — isbotlangan yo'l. URL/`@shared/html-compiler` — alohida keyingi ish (9-bosqich) | foydalanuvchi: «tavsiyang maqul» |
| Q8 | S12 = A (collide3 regex 1 qator), S13 = B (FullPipeline `code-line` → `ci-line`) | foydalanuvchi, 01.10 |
| Q9 | Paket fayl nomlari `-v2` (hammasi, 88 ta); yuklash — foydalanuvchi qo'lda; avval kompilyatorli darslar emas, tartib ROYXAT'da | foydalanuvchi, 01.10 |
| Q11 | CSS: faqat `{ }` ichida xossa nomi, `:` dan keyin ma'lum qiymat; selektorda jim. JS: faqat ≥2 harf, faqat o'rgatilgan kalit so'z/qisqartma, satr/izoh ichida jim, **faqat Tab tanlaydi (Enter hech qachon)**; qisqartmalar `log` `for` `if` `fn` — o'tilganlari | tavsiya qabul |
| Q12 | **Avtopilot (01.10 ~17:17):** GATE 1/2/2b/2c da to'xtalmaydi — xarita → HTML → CSS → JS → S12/S13 → paket v2 gacha; hammasi kelganda bir yo'la ko'rsatiladi. **GATE 3 (yuklash) va commit — faqat buyruq bilan.** QA sayti chiqariladi: Vercel `coddycamp-kompilyator` (kirishnomi6-9875), ko'rish uchun | foydalanuvchi |
| Q10 | HTML-1 dagi 3 nomzod (`<header>` s0, `<button>` s3, `img` s14) — tegilmaydi | foydalanuvchi, 01.10 |

**Tegilmaydigan narsalar:** D (CodeMirror) · tekshiruv mantiqi (`checks`, linter, iframe) · ball/kalitlar · `src/5-Modull`, `src/6-Modull` (parallel seanslar; kompilyator o'zgarishi ularga ham tushadi — 2.9 da esbuild bilan tekshiriladi, tahrir yo'q) · `gates.mjs`/`package.json` (umumiy fayllar — yangi darvoza alohida skript, ulash parallel tugagach).

## 1. Teglar xaritasi — faqat o'qish, kod tegilmaydi

Chiqish: `TEG_XARITASI.md` (shu papkada) + `teg-xaritasi.json` (mashina o'qiydi; ro'yxat va darvoza shundan).

- [x] 1.1 Dastur tartibi `src/App.jsx` dan: 1-Modul 15 dars (`m1-*`), keyin 2–4c. Har darsga `comp` fayli.
- [x] 1.2 Har HTML/CSS/praktika darsi (m1-03 Html1 · m1-04 Html2 · m1-14 Takrorlash · m1-06 Css1 · m1-07 Css2 · m1-08 HtmlPractice · m1-15 VsCode · m1-10 CssPractice) uchun **o'rgatish ekranlari** qo'lda o'qiladi: qaysi teg/atribut qaysi ekranda birinchi marta TUSHUNTIRILADI (shunchaki kod qutisida ko'ringani emas). Skript faqat nomzod beradi (`vositalar/teg-qidir.py`), hukm qo'lda.
- [x] 1.3 Har tegga: `t` · `d.uz` · `d.ru` (ro'yxat izohi) · `dars` (kalit, masalan `m1-03`) · `ekran` · `void` · `matn` (ichida matn yoziladimi — ro'yxat jimligi uchun). Har atributga: `tag` · `a` · `d.uz/ru` · `dars`.
- [x] 1.4 Qaysi darsdan Emmet (Q5) va `.class/#id` (CSS-1) — xaritada `bosqich` qatorlari.
- [x] 1.5 Kompilyatorli, lekin HTML o'rgatmaydigan darslar (PM `[KIM]` almashtirish, JS darslari, 2–4c): ro'yxat qaysi bosqichda? Qoida: **dastur tartibida o'zidan oldingi oxirgi HTML darsi** (m1-02 PmLesson1 → HTML'dan oldin → ro'yxat bo'sh; 2-Moduldan boshlab — to'liq).
- [x] 1.6 Tekshiruv: har kompilyator topshirig'i so'ragan teg (`requirements`, `starter`) xaritada o'sha darsgacha bormi — jadval, qizil qatorlar bilan.
- [x] 1.6b **CSS xaritasi:** CssLesson1/2, CssPractice, VsCode (4 dars) — xossa (`color`, `font-size`, `display`…), qiymatlar (`display: flex|block|none`…), selektor turi (`.class`, `#id`) qaysi darsda/ekranda o'rgatiladi; `cssProp/cssValue` shartlari bilan solishtirish.
- [x] 1.6c **JS xaritasi:** JsVars/Conditions/Loops/Functions + PracticeLesson1 + PeanStack + 8 PM koding (PmLesson5/6/9/11/13/15/17, PmUserStory) = 14 dars — kalit so'z, API (`console.log`, `document.querySelector`, `addEventListener`…), qisqartma qolipi qaysi darsdan; JS shartlari (`C.js`, `logs`, `eval`) bilan solishtirish.
- [x] 1.7 **[GATE 1]** (Q12 avtopilot: o'tildi, hukmlar TEG_XARITASI §6 da — foydalanuvchi kelganda ko'radi) `TEG_XARITASI.md` foydalanuvchiga: jadval (dars → teglar), qizil qatorlar, savollar. Tasdiqsiz 2-bosqich boshlanmaydi.

## 2. Kompilyator — `src/compilator/HtmlCompiler.jsx` (bitta fayl) + 5 dars sozlamasi

Har qadamdan keyin: `npm run gates -- src/compilator/HtmlCompiler.jsx` · `npm run lint:jsx` · `node feedback/F-0929-LMS-yuklash/vositalar/hc-avto-sinov.mjs` (46 holat, pageerror 0).

- [x] 2.1 **Ro'yxat xaritadan.** `TAG_MENU`/`ATTR_MENU` qo'lda emas: `scripts/gen-teg-royxat.mjs` `teg-xaritasi.json` → kompilyator ichidagi belgilangan blok (`// ⟨TEG-ROYXAT boshi⟩ … ⟨oxiri⟩`, «avto-yig'ilgan, qo'lda tahrirlamang»). Har teg `dars` bilan.
- [x] 2.2 **Darsga qarab filtr (Q2).** Prop `stage` (dars kaliti, masalan `'m1-03'`): ro'yxatda faqat `dars ≤ stage` teglar. `stage` berilmasa — to'liq ro'yxat (2–4c uchun). 1-Modulning HTML'gacha va HTML-oralig'idagi 5 darsi (`PmLesson1`, `Htmllesson1`, `Htmllesson2`, `HtmlTakrorlash`, `PmLesson2`) `<HtmlCompiler stage="…">` beradi — har biri 1 qator.
- [x] 2.3 **`<`siz so'z — `>` dan keyin ham** (`<div>h1|</div>`): `mBare` regex `(?:^[ \t]*|>)`; `inTextTag` kursorgacha; `<p>` ichidagi jimlik SAQLANADI (regressiya: `<p>ol` → ro'yxat yo'q).
- [x] 2.4 **Enter/Tab qoidasi (Q4).** `menu.src = 'lt' | 'bare'`; `bare` da Enter ro'yxatni yopib yangi qator; yorliq matni ikki xil («Tab — tanlash»). Yolg'iz so'z + Tab → `<teg></teg>` (xaritadagi har teg, void'lar `<br>`).
- [x] 2.5 **Emmet (Q5)** — `__emmet(abbr, ind, stage)`: `!` (faqat qatorda yolg'iz), `a>b`, `*n`, `.c`, `#i`; faqat xaritadagi teglar; `stage < m1-15` bo'lsa Emmet o'chiq (teg+Tab qoladi); `.`/`#` `stage < m1-06` da o'chiq. Yangi CSS sinfi yo'q.
- [x] 2.6 **Sensor panel ⇥ (Q6)** — `TOUCH_KEYS.html` ga Tab: `onKeyDown` bilan bir xil yo'l (`handleTab()` ajratiladi, ikki joydan chaqiriladi).
- [x] 2.7 **Atributlar** xaritadan (`for`, `action`, `name`, `button type`, `input type` …).
- [x] 2.8 **Sinov kengaytmasi** `hc-avto-sinov.mjs`: (a) xaritadan avto — har teg: `<` + prefiks → ro'yxatda bor; `teg`+Tab → juft; stage-filtr (m1-03 da `form` yo'q, m1-04 da bor); (b) Q4 holatlari; (c) Emmet 8 holat + `!` qatorda yolg'iz emas → ishlamaydi; (d) `.card` m1-04 da ishlamaydi; (e) regressiya ro'yxati: avto-yopish, juft-nom, Ctrl+/, Enter-chekinish, Esc + tahrir, `<p>` jimligi, `"` juftlash, Shift+Enter, 8+ band surilish. Hammasi pageerror 0. Natija `tekshiruv-2026-10-0X/hc-sinov.txt`.
- [x] 2.9 **Barcha importerlar yig'iladi:** 31 fayl (1–4c 27 + 5-Modul PmLesson19/21 + 6-Modul PmLesson23/25) esbuild toza; `npm run smoke:lms` (kompilyator ochiladi).
- [x] 2.10 **Darvoza-skript** `scripts/lint-teg-royxat.mjs` (gates.mjs ga ULANMAYDI hozir — parallel): (1) ro'yxat bloki json bilan bir xil; (2) har teg/atributda uz+ru izoh; (3) 1–4c kompilyator topshiriqlari so'ragan teglar xaritada o'sha darsgacha; (4) `stage` 5 darsda bor. 0 topilma.
- [x] 2.11 **LMS CSS bilan suratlar** (`vositalar/shot.mjs`, `LMS=1`): Html1 praktika (`<s` → qisqa ro'yxat), Html2 forma praktikasi (`<fo` → form), VsCode (`!`+Tab), planshet rejimi (⇥ tugmasi). uz + ru.
- [x] 2.12 **[GATE 2]** (Q12: o'tildi — suratlar rasm/F-1001-91-*; QA sayti 4-bosqichdan keyin) Foydalanuvchiga: suratlar + sinov natijasi + (xohlasa) QA sayti (`internet-nima` kabi vite config, faqat ko'rish). Tasdiqsiz 3-bosqichga o'tilmaydi.

## 2b. CSS maslahati (Q11) — HTML GATE 2 dan keyin

- [x] 2b.1 Ro'yxat xaritadan (`css` bo'limi) — xossa + qiymat, `stage` filtr (CSS-1 dan).
- [x] 2b.2 Trigger: `{ }` ichida, xossa o'rnida ≥2 harf; `:` dan keyin qiymat ro'yxati (faqat xaritadagi xossalar); `;` ustidan o'tish saqlanadi. Tab va Enter tanlaydi (xossa o'rnida Enter yangi xossa qatori emas — VS Code kabi). Selektor/`@media` da jim.
- [x] 2b.3 Sinov: 12+ holat (xossa, qiymat, selektorda jim, `}` dan keyin jim, stage) + HTML regressiyasi to'liq.
- [x] 2b.4 **[GATE 2b]** (Q12: o'tildi) suratlar (CSS-1 praktikasi).

## 2c. JS maslahati (Q11) — CSS GATE 2b dan keyin

- [x] 2c.1 Ro'yxat xaritadan (`js` bo'limi): kalit so'zlar, API nomlari, qisqartma qoliplari (`log`→`console.log()`, `for`, `if`, `fn`), `stage` filtr.
- [x] 2c.2 Trigger: identifikator ≥2 harf, faqat ro'yxat prefiksi; satr (`'…'`, `"…"`, `` `…` ``), izoh (`//`, `/* */`) ichida jim; **faqat Tab tanlaydi**, Enter ro'yxatni yopib oddiy yangi qator; `.` dan keyin (`console.`) a'zo ro'yxati faqat ma'lum obyektlar uchun.
- [x] 2c.3 Sinov: 15+ holat (kalit so'z, o'z o'zgaruvchisi `salom` → jim, satr ichida jim, Enter teg tushirmaydi, `.`, qisqartma, stage) + HTML/CSS regressiyasi to'liq; `{}` juftlik/Ctrl+/ regressiyasi.
- [x] 2c.4 **[GATE 2c]** (Q12: o'tildi) suratlar (JsVars praktikasi, PM koding ekrani).

## 3. Qolgan ikki tuzatish (Q8)

- [x] 3.1 S12: `vositalar/collide3.py` regex `(^|})` → `()`; 30.09 paketida qayta: 76 moslik kutiladi, buzadigani 0.
- [x] 3.2 S13: `src/4c-Modull/FullPipelineProjectLesson.jsx` `code-line` → `ci-line` (2 className + 1 CSS); gates; LMS CSS bilan surat: oyna 267 px.

## 4. Paket v2

- [x] 4.1 `scripts/yuklash-papka.mjs`: `--suffix v2` (fayl nomi `NN-Nom-v2.jsx`, uyga vazifa `NN-Nom-uyga-vazifa-v2.jsx`; ROYXAT'da ham). `--shared` qo'shilmaydi (Q7).
- [x] 4.2 `node scripts/yuklash-papka.mjs --out yuklash-2026-10-0X --suffix v2 --skip m2-16,m3-17` → 88 fayl.
- [x] 4.3 (✓ `tekshiruv-2026-10-01/TUGADI.txt`) Tekshiruvlar: `sh scripts/yuklash-tekshir.sh <papka>` (uz+ru 176, md5 88, katalog 70) · click-walk uz VA ru (1365 ekran, hw soxta signaldan tashqari 0) · collide3 (tuzatilgan) 0 · `hc-avto-sinov` paket faylida ham (bitta dars, inline nusxa) · LMS CSS suratlar: Html2 praktika, FullPipeline 14-ekran, JsVars test.
- [x] 4.4 `OZGARISH_<oldingi>.md`: 25.09 ga nisbatan nima o'zgardi (is-fixed 15 · izohlar 70 · kompilyator 26 · class HTML-2 · ci-line); 🔴 ustuvorlik: 26 kompilyatorli dars.
- [x] 4.3b (22:07, foydalanuvchi talabi) HAR DARS: fayl ichidagi kompilyator 26×149 ✓ (`hc-paket-sinov.sh`) · dars ekranida yozish uz/ru 26/26 ✓ 381 holat (`hc-dars-ekran.mjs`) → `tekshiruv-2026-10-01/dars-hc/`
- [x] 4.5 **[GATE 3]** ✅ 01.10 20:53 **S16 = A** (foydalanuvchi). Hisobot: https://claude.ai/artifact/4uphUhFerynDeRsrb819nc. Yuklash — foydalanuvchi qo'lda, `OZGARISH_25-09.md` tartibida.

## 5. Yuklash (foydalanuvchi qo'lda) va keyin tekshiruv

- [ ] 5.1 Foydalanuvchi yuklaydi: ROYXAT tartibida, har qatorda `-v2` nomi («v2 siz qator qolmadi» tekshiruvi).
- [ ] 5.2 Foydalanuvchi preview havolalarini (`jsx=`) bersa: LMS'dagi faylni tortib md5 paket bilan solishtirish (`vositalar/lms-md5.py` — 02.10 tayyor, sinalgan), jadval: dars · LMS md5 · paket md5 · mos.
- [ ] 5.3 Ko'z bilan LMS'da: HTML-2 forma praktikasi (`<fo`), HTML Praktika 15-ekran (is-fixed), JsVars 6-ekran, istalgan test izohi.

## 6. Muhr

- [ ] 6.1 `DARS_ETALON.md` 113-qonunga tomon: «taklif-ro'yxati qo'lda yozilmaydi — darslar xaritasidan; to'liqlik darvozada»; `stage` qoidasi (o'tilmagan teg ko'rinmaydi — F-1001-90 bilan bir sinf). Parallel seanslar umumiy qonun-fayllarga yozmaydi → avval `QONUN_NOMZODLARI.md`, muhr parallel tugagach.
- [ ] 6.2 `lint-teg-royxat.mjs` → `gates.mjs` ga ulash (parallel tugagach).
- [ ] 6.3 `.claude/agents/role/darslik-tekshiruvchi.md` ov-bandi: yangi HTML tegi darsga kirsa → xarita yangilanadimi.
- [ ] 6.4 `PIPELINE_STATE.md` raund-yozuvi (F-1001-90/91, S12/S13), memory yangilanadi.
- [ ] 6.5 Commit — **faqat buyruq bilan**; faqat shu ishning fayllari (`src/compilator/`, 5 dars `stage`, Htmllesson2, FullPipeline, scripts/yuklash-papka, feedback/F-0929-LMS-yuklash/, paket). 5/6-Modul, gates.mjs, package.json ARALASHMAYDI.

## 7. Keyinroq (bu ishga kirmaydi)

- CSS/JS fayllarida maslahat (S14-C).
- URL yo'li: CRM → Umumiy modullar → `@shared/html-compiler` ro'yxat → bitta darsda sinov → o'tish. Shundan keyin kompilyator tuzatishi = 1 fayl.
  - ⚠️ 01.10 21:07 sinov (foydalanuvchi): «Kurs artefaktlari» da faylni almashtirish **URL ni o'zgartiradi va eskisini 404 qiladi** → hash-URL bilan «1 fayl» foydasi yo'q, aksincha 26 dars bir zumda sinadi. Shart: faqat barqaror nom (LMS importmap/registry) bilan. Hozirgi artefakt `39605747…` = 17.08 kompilyatori (eski, 19 teg), hech qaysi dars ishlatmaydi.
- HTML-1 dagi 3 nomzod (Q10) — mentor fidbeki kelsa.

## 8. Xavflar va qarshi chora (qisqa)

| Xavf | Chora |
|---|---|
| Matndan Enter bilan teg tushishi (F-0809-02 qaytishi) | Q4 + regressiya holati |
| `.card` HTML-2 da chiqishi (F-1001-90 qaytishi) | `.`/`#` CSS-1 gacha o'chiq + sinov |
| `!` matn ichida tushishi | faqat qatorda yolg'iz + sinov |
| 26 darsni bitta xato buzishi | 46+ holat, smoke:lms, click-walk, LMS CSS suratlar, `hc-` sinflar |
| Yaxshi ishlayotganlar buzilishi | regressiya ro'yxati 2.8(e), har qadamdan keyin |
| Ro'yxat yana eskirishi | 2.10 darvoza + 6.3 ov-bandi |
| Parallel seanslar (5/6-Modul) kompilyator o'zgarishini sezmay qolishi | 2.9 esbuild 31/31; ularning STATE'iga 1 qator xabar |

## 9. Jurnal (har qadam: sana · qadam · natija · dalil-fayl)

| Sana | Qadam | Natija |
|---|---|---|
| 01.10 17:15 | Reja ochildi | — |
| 01.10 22:07 | Har dars kompilyator sinovi: 26×149 ✓ · dars ekranida uz/ru 26/26 ✓ — yuklash boshlanadi | — |
| 01.10 20:53 | [GATE 3] S16 = A — yuklashga ruxsat. Foydalanuvchi savoli: «kompilyatorni alohida yuklab URL beraymi?» → javob: yo'q, bu paket inline (Q7), URL yo'li 7-bo'lim | — |
| 01.10 18:25 | 4.3 tugadi (hammasi toza), hisobot chop etildi — [GATE 3] kutilmoqda | — |
| 01.10 18:03 | 4.1/4.2/4.4 tugadi: paket `yuklash-2026-10-01/` (-v2, 88), OZGARISH; QA sayti coddycamp-kompilyator.vercel.app; 4.3 fon'da | — |
| 01.10 ~17:58 | 2b/2c (CSS+JS) + S12/S13 tugadi: 149 holat ✓, suratlar rasm/ | — |
| 01.10 ~17:50 | 2.1–2.10 tugadi: xarita→blok→darvoza, stage 12 dars, 114 avto-holat ✓, smoke:lms ✓; shot.mjs press-takrori (soxta bug) tuzatildi | — |
| 01.10 17:29 | 1-bosqich tugadi: `TEG_XARITASI.md` + `teg-xaritasi.json` (teg 31 · atribut 12 · CSS 17 · JS 15); 1.6 tekshiruv 5/5 ✓; 11 bahsli hukm §6 | — |
| 01.10 ~17:17 | Q12 avtopilot + QA sayti | foydalanuvchi |
| 01.10 ~17:15 | Q1 kengaydi: CSS+JS ham (S14 = C), 2b/2c bosqichlari, 1.6b/1.6c xarita | foydalanuvchi qarori |
