# DAVOM — LMS yuklash 1–4c (holat 2026-10-01 20:53)

## ▶ YANGI SEANS SHU YERDAN (02.10 02:22) — foydalanuvchi 88 faylni prodga chiqardi (02.10); 5.2 md5 solishtiruv havolalarni kutmoqda

- **02.10 02:22:** 5.2 vositasi tayyor: `python3 vositalar/lms-md5.py <havolalar.txt>` — kirish: LMS preview/`jsx=`/lesson_runner havolalari (nom `=>` bilan), chiqish: jadval + paketda-bor-LMS'da-yo'q ro'yxati; exit 1 nomos bo'lsa. Havolalar manbai: foydalanuvchi (VIDEO ustuni) yoki Chrome kengaytmasi ulansa — kurs sahifasidan o'zim yig'aman. Tortilgan nusxalar `tekshiruv-2026-10-01/lms-md5/`.

- **20:53:** S16 = A. Foydalanuvchi URL-yo'lni so'radi — javob: bu paket inline (Q7), URL keyin (REJA 7). Yuklash tartibi: `yuklash-2026-10-01/OZGARISH_25-09.md` (🔴 26 kompilyatorli avval), nomlar `-v2`. Preview havolalar kelsa → 5.2 md5 solishtiruv.
- **22:07:** har dars sinovi (26×149 fayl ichida · dars ekranida uz/ru 26/26 ✓) — `tekshiruv-2026-10-01/dars-hc/`; vositalar: `hc-paket-sinov.sh`, `hc-dars-ekran.mjs` (ONLY=… filtr). Yuklash boshlanadi.
- **21:07:** URL-yo'l sinovi (foydalanuvchi): artefaktni almashtirish → yangi URL + eski 404 → URL yo'li bu LMS'da foydasiz (JURNAL 21:07). Qaror: inline qoladi.

- **Reja:** `KOMPILYATOR_REJA.md` (qarorlar Q1–Q12, qadamlar `[x]`). Jurnal: `JURNAL.md` 01.10 qatorlari. Xarita: `TEG_XARITASI.md` + `src/compilator/teg-xaritasi.json`.
- **Qilindi:** F-1001-90 (HTML-2 `class` olindi) · F-1001-91 kompilyator to'liq (HTML ro'yxat xaritadan + `stage` + Enter/Tab + Emmet + ⇥, CSS xossa/qiymat, JS faqat Tab) — `hc-avto-sinov` 149 ✓ · S12 collide3 · S13 ci-line · paket **`yuklash-2026-10-01/`** (-v2, 88 fayl, `OZGARISH_25-09.md`) · QA sayti **https://coddycamp-kompilyator.vercel.app**.
- **Tekshiruvlar TUGADI** (`tekshiruv-2026-10-01/TUGADI.txt`: hammasi toza). Hisobot + GATE 3 savoli (S16): https://claude.ai/artifact/4uphUhFerynDeRsrb819nc
- (eski) Fon-tekshiruvlar: `yuklash-tekshir.sh` → `yuklash-2026-10-01/TEKSHIRUV.log`; click-walk uz → `/tmp/lms-tekshir/all-1001-uz.json`, ru → `all-1001-ru.json` (scratchpad `cw-uz.txt`/`cw-ru.txt`). Tugamagan bo'lsa: TEKSHIRUV.log oxirini o'qi; click-walk qayta: `PAR=4 CHROME=/usr/bin/google-chrome node feedback/F-0929-LMS-yuklash/vositalar/click-walk.mjs /tmp/lms-tekshir/all-1001-uz.json yuklash-2026-10-01/*/*.jsx` (ru: `LANG_=ru`).
- **Keyin (buyruq bilan):** [GATE 3] → foydalanuvchi qo'lda yuklaydi (ROYXAT tartibi, avval 🔴 26 kompilyatorli) → 5.2 LMS md5 solishtiruv → 6-bosqich muhr (QONUN_NOMZODLARI §5 → DARS_ETALON 113-qonun, `lint-teg-royxat` → gates.mjs, ov-bandi) → commit.
- Parallel seanslar: kompilyator o'zgarishi 5/6-Modul darslariga ham tushadi (PmLesson19/21/23/25 esbuild ✓) — ularning jurnaliga yozilmadi, foydalanuvchi aytadi.
- HTML-1 nomzodlari (Q10) tegilmadi. URL/`@shared` yo'li — keyingi ish (REJA 7).

## (oldingi) holat 2026-09-30 19:34

## ▶ YANGI SEANS SHU YERDAN (30.09 19:34) — paket `yuklash-2026-09-30/` YUKLASHGA TAYYOR, S12–S13 javobi kutilmoqda

- Paket hali eng so'nggi (qayta yig'ish 88/88 + ROYXAT 7/7 bayt-ma-bayt bir xil; `src` 15:20 dan beri o'zgarmagan). 15:47 tekshiruvlari toza (`tekshiruv-2026-09-30/`). `yuklash-2026-09-29/` diskda yo'q.
- LMS CSS bugun almashdi: `index.Cxf12j0x.css` (+10 sinf). Surati: `vositalar/lms-host-Cxf12j0x.css` (md5 `e74562fc…`). `vositalar/lms-host.css` hali ESKI (CZbPLoYi) — S12=A bo'lsa yangisi bilan almashtiriladi.
- F-0929-94: `vositalar/collide3.py` regex `(^|})([^{}]+)\{…\}` yopuvchi `}` ni yeydi → 401/812 sinf. Tuzatish: `(^|})` → `()` (1 qator). Tuzatilgan natija: 76 moslik, hammasi o'lchangan — buzadigani 0.
- F-0929-95: 4c-M 04 FullPipeline 14-ekran `.code-line` (LMS'ning o'z sinfi) → oyna +15 px, faqat ko'rinish. Taklif: `code-line` → `ci-line` (3 joy: 2 className + 1 CSS).
- Qaror-sahifa (o'sha URL, v2): https://claude.ai/artifact/Vqjn5YYNCNMvLFV4VfomNJ — S12 (vosita: A hozir / B S5 bilan), S13 (A bugun shunday / B hozir tuzatish + paket qayta). Tavsiya: S12-A, S13-A.
- Keyin: S5 darvozalar (tuzatilgan collide3 bilan) · muhr QONUN_NOMZODLARI §1–4 (§1 ro'yxatiga `visible`, `code-line`) · commit — buyruq bilan.

### (oldingi) 30.09 15:50 — YANGI PAKET `yuklash-2026-09-30/` TAYYOR VA TEKSHIRILGAN, foydalanuvchiga topshirildi

Qolgan (faqat buyruq bilan): S5 darvozalar (collide3 + izoh.py lint → gates, click-walk LMS CSS varianti) · muhr QONUN_NOMZODLARI §1–4 → DARS_ETALON/MATN_KORPUS/PIPELINE/MD-birinchi (KORPUS §6 «xato» ni arena bilan chegaralash) · commit (15 is-fixed + 70 izoh fayli + scripts/yuklash-papka.mjs + feedback/F-0929-LMS-yuklash/ + arxiv zaxira) · yuklagach LMS'da ko'z bilan: HTML Praktika 15-ekran, JS o'zgaruvchilar 6-ekran, istalgan test «✓/✗» qatori · eski `yuklash-2026-09-29/` o'chirish — foydalanuvchi bilan.

### (oldingi qadam) 30.09 15:25 holati — test izohlari qisqartirildi

Foydalanuvchi qarori S8=A S9=A S10=B **S11=B (bugungi yuklash kutadi — avval izohlar qisqaradi, keyin YANGI paket)**.
Qaror-sahifa: https://claude.ai/artifact/Vqjn5YYNCNMvLFV4VfomNJ · yo'riqnoma `IZOH_QISQA_BRIEF.md` · jurnal 30.09 14:40.
- Zaxira: `arxiv/izoh-qisqa-oldin-2026-09-30/` (70 fayl, izohdan OLDINGI holat, 15 is-fixed tuzatish bilan).
- KOD (70/70): `vositalar/codemod-izoh.py` — «✓ To'g'ri.»/«✗ Xato.», «📖 Eslatma», «Tushunarli», «Sinfga savol» faqat mentor-jonli.
- MATN (70/70): 10 agent, `vositalar/izoh.py put`; `izoh.py lint` 70/70 ✓; `vositalar/faqat-izoh.py` 69/70 ✓ (Htmllesson2 — ataylab: 4 testga
  `0:` A-variant izohi qo'shildi; kalitlar 1 dan boshlangan edi → o'quvchi boshqa variant izohini ko'rardi, eski bug).
- Keyin: gates 70 (fon, `scratchpad/gates70.txt`) → `yuklash-papka.mjs --out yuklash-2026-09-30 --skip m2-16,m3-17` (eski 30.09 papka = 29.09 bilan bir xil, ustiga yoziladi)
  → `OZGARISH_25-09.md` (scratchpad/OZGARISH_25-09.base.md + 30.09 bo'limi) → yuklash-tekshir + click-walk uz/ru + collide3 + LMS CSS surat → topshirish.

## (eski) 30.09 07:29 holati

**Yuklashga tayyor papka: `yuklash-2026-09-30/`** (88 fayl, 29.09 paketi bilan 88/88 bayt-ma-bayt bir xil — tunda
1–4c manbasi o'zgarmagan). Almashtirish varag'i: `yuklash-2026-09-30/OZGARISH_25-09.md` (🔴 15 ustuvor fayl).
Hamma tekshiruv toza — `tekshiruv-2026-09-30/`: uz+ru 176/176 · md5 88/88 · katalog 70/70 · click-walk **uz va ru**
har biri 70 dars · 1365 ekran · xato 0 · collide3 0 · LMS CSS o'zgarmagan (md5 = `vositalar/lms-host.css`) ·
gates 15 fayl 7 asosiy toza (tell/emoji = HEAD). `yuklash-2026-09-29/` — eskirgan nusxa (bir xil), o'chirish foydalanuvchi bilan.
Yuklash — foydalanuvchi qo'lda (30.09 kechqurun). Qolgan: 4-bo'lim 7–9 (S5 darvozalar, muhr, commit) — buyruq bilan.
**Tekshiruv bo'shliqlari (30.09 tahlili, foydalanuvchiga aytildi):** (a) click-walk uyga vazifani tanimaydi (`.hw-root`, 0 ekran) —
18 hw ichi bosib-yurilmagan (25.09 bilan bayt-ma-bayt bir xil); (b) click-walk LMS CSS'siz, faqat yiqilishni ko'radi — Tailwind preflight
ta'siri 1365 ekranda solishtirilmagan (surat-farq kerak); (c) tell-lint 1–4c: 58 darsda ❌220, emoji 68 darsda ❌345 — KATTA_TOZALASH nomzodi.
Jonli-qatlam/kompilyator 25.09 dan beri o'zgarmagan (git log bo'sh).
**Yangi seansda paket qayta kerak bo'lsa:** avval `find src server/data -newer yuklash-2026-09-30/1-Modul` — bo'sh bo'lsa paket hali eng so'nggi.

## (eski) 29.09 23:40 holati

**Qilindi (seans C davomi, 23:28–23:40):** S6=A, S7=A olindi.
- S7: `ReactIntroLesson.jsx:1711` → `// ikki blok` / `// два блока`. gates 7/7, verify-fixed LMS CSS bilan uz+ru OK (✓ qirqilmagan).
- `scripts/yuklash-papka.mjs` ga `--skip <kalit,…>` qo'shildi (F-0929-93). `verify-fixed.mjs` ga `LANG_=ru`.
- Paket: `node scripts/yuklash-papka.mjs --out yuklash-2026-09-29 --skip m2-16,m3-17` → **88 fayl**,
  lesson_id to'plami 25.09 bilan aynan bir xil; 70 yangilangan, 18 bayt-ma-bayt bir xil; 2-/3-Modulda 03 bo'sh → 28 fayl nomi +1.
  `yuklash-2026-09-29/OZGARISH_25-09.md` — foydalanuvchi uchun almashtirish varag'i (☐, 🔴 15 ustuvor fayl).
- collide3 (Tailwind to'qnashuvi) paketda **0** (25.09 paketida 14). 15 faylning tell/emoji qizili HEAD bilan aynan bir xil (eski qarz).
- Katalog: yangi id yo'q, hammasi prodda. 5 darsda faqat yutuq matni / VS Code sarlavhasi farq qiladi (ID'lar bir xil) → server-sync keyin, bugun shart emas.
- UNCOMMITTED (bizniki): 15 dars + `scripts/yuklash-papka.mjs` + `feedback/F-0929-LMS-yuklash/` + `yuklash-2026-09-29/`.

**Tekshiruvlar — HAMMASI TUGADI (23:50), paket yuklashga TAYYOR:**
- `sh scripts/yuklash-tekshir.sh yuklash-2026-09-29` — ✅ TUGADI 23:4x: 7 modul uz+ru 176/176 ok, md5 88/88 mos, katalog 70/70 dars prodda. Qayta yurgizish SHART EMAS.
- click-walk — ✅ TUGADI: 70 dars ok, **1365 ekran**, haqiqiy XATO **0** (25.09 dagi JsVars s5 yiqilishi yo'qoldi); 18 ta `uyga-vazifa … lesson-root chizilmadi` = soxta signal (`.hw-root`). Qayta yurgizish SHART EMAS.
- Tugasa natija o'zi ko'chiriladi: `feedback/F-0929-LMS-yuklash/tekshiruv-2026-09-29/` (`TUGADI.txt` bo'lsa — to'liq).

**Yangi seans BIRINCHI ISH:**
1. `ls feedback/F-0929-LMS-yuklash/tekshiruv-2026-09-29/` — `TUGADI.txt` bormi?
   - Bor → `TEKSHIRUV.log` (har modul `fail=0 nomos=0`, KATALOG hammasi katalogda) va `click-walk.out` (uyga-vazifa soxta signalidan tashqari XATO yo'q) ni o'qi.
   - Yo'q (jarayon seans bilan o'lgan) → faqat click-walk'ni qayta yurgiz (yuklash-tekshir allaqachon toza):
     `PAR=6 node feedback/F-0929-LMS-yuklash/vositalar/click-walk.mjs /tmp/lms-tekshir/all-0929.json yuklash-2026-09-29/*/*.jsx` (~15 daq).
     Yiqilgan bo'lsa — faylni YOLG'IZ qayta yurgiz (memory: tekshiruv-vositalari-tuzoqlari), keyin tashxis.
2. Hammasi toza bo'lsa → foydalanuvchiga topshir (4-bo'lim 6-qadam): papka `yuklash-2026-09-29/`, `OZGARISH_25-09.md`, raqam siljishi, natijalar.
3. Keyin 4-bo'lim 7–9 (S5 darvozalar, muhr, commit) — faqat buyruq bilan.

Yangi seans: **shu faylni to'liq o'qi**, keyin `JURNAL.md`. Qaror-sahifa (suratli, S1–S7):
https://claude.ai/artifact/X27nW6dwUguq7joMPQq1KV — `Artifact action:read` bilan o'qiladi (sahifa manbasi: bu seans
scratchpad'ida edi; qayta chop etish kerak bo'lsa read → saqlangan faylni tahrirlab `url` bilan publish).

## 0. Maqsad
Foydalanuvchi **bugun kechqurun** LMS'ga 1-2-3-4-4a-4b-4c modullarni **eng so'nggi versiyada** qo'lda yuklaydi
(oxirgi yuklash 25.09 — `yuklash-2026-09-25/`, 88 fayl). Bizdan: toza, tekshirilgan yangi paket papkasi.

## 1. Topilgan buglar (hammasi tashxislangan)
| F-ID | Nima | Holat |
|---|---|---|
| F-0929-90 | JsVars 6-ekran `score is not defined` (LMS'dagi 25.09 fayli) | Manbada 28.09 da tuzatilgan (0ff0a8e) — yangi paketda o'zi yo'qoladi |
| F-0929-91 | LMS Tailwind `.fixed{position:fixed}` × dars sinfi `fixed` → qatorlar ustma-ust / ekranni kesgan yashil chiziq, 15 fayl | ✅ TUZATILDI (S1, S2) — UNCOMMITTED |
| F-0929-92 | 3-M «React nima» 16-ekran: tuzatilgan qator uzun → kod qutisi 472/504 px, aylantirgich, ✓ ko'rinmaydi | ⏳ S7 javobi kutilmoqda |
| F-0929-93 | Yangi darslar m2-16 Muammo (`pm-m2d3-v1`), m3-17 JTBD (`pm-m3d3-v1`): GATE 2 kutmoqda, RU tayyor emas (ru-walk 101/98 qoldiq; JTBD 413/540 ruschasiz, `lessonTitle.ru` yo'q), katalogda yo'q | ⏳ S6 javobi kutilmoqda |

Foydalanuvchi LMS'dan yana «qatorlar ustma-ust / yashil ramka chiqib ketgan» rasmi yuborsa — bu F-0929-91 (LMS'da
hali 25.09 fayli). Masalan 17:30 da HtmlPractice 15-ekran rasmi keldi — ro'yxatda bor, manbada tuzatilgan.

## 2. Foydalanuvchi javoblari (sahifadan, 14:24)
- **S1: A** — `fixed` → `is-fixed` dars tomonda (LMS jamoasiga so'rov YO'Q). ✅ bajarildi
- **S2: Boshqa** — «tuzatildi so'zi kerak emas, ptichka o'zi tursa bo'ldi, yashil rangi ham turibdi». ✅ bajarildi (11 fayl, `✓` qoldi)
- **S3: A** — avval tuzatish, keyin paket yig'ish + tekshiruvlar
- **S4: A** — 2 yangi darsni yuklash (katalog + server). ⚠️ Bu javob F-0929-93 faktlari AYTILMASDAN berilgan → **to'xtatildi, S6 so'raldi**
- **S5: A** — ikki darvoza: gates'ga LMS-CSS sinf-to'qnashuvi + yuklash-tekshiruviga bosib-yurish LMS CSS bilan
- **S6, S7: JAVOB HALI YO'Q** (sahifada tepada). Tavsiyalar: S6-A (bugun faqat 88 mavjud material; 2 yangi dars GATE 2 → RU → GATE 3 dan keyin), S7-A (`// ikki blok` / `// два блока`).

## 3. Qilingan tahrirlar (UNCOMMITTED — commit faqat buyruq bilan, `git add -A` YO'Q)
15 fayl, 47+/47−: `src/1-Modull/{Htmllesson1,HtmlTakrorlashLesson,HtmlPractice}.jsx` ·
`src/3-Modull/{ReactIntroLesson,ReactFirstComponentLesson,ReactPropsReuseLesson,ReactApiPostLesson,ReactRouterPracticeLesson}.jsx` ·
`src/4-Modull/{PmLesson11,RoutingLesson,PostgresCrudLesson,PmLesson13}.jsx` · `src/4a-Modull/NestArchPracticeLesson.jsx` ·
`src/4c-Modull/FullPipelineProjectLesson.jsx` · `src/pm/PmJtbdLesson.jsx`
- 16 className: `? 'fixed' :` → `? 'is-fixed' :` (va `' fixed'` → `' is-fixed'`); 21 CSS: `.dbg-line|tbl-row|sxm-row|ev-row|vsc-line.dbg .fixed` → `.is-fixed`.
  JS o'zgaruvchilari (`fixed` prop, `fixed.has(i)`, `stage === 'fixed'`) TEGILMAGAN.
- 11 debug-darsda `<span className="dbg-badge">✓</span>}{/* F-0929-91 … */}` («tuzatildi» so'zi olindi).
- Darvozalar: gates 7/7 ✓ (esbuild·undef·jsx·keys·dark·til·prompt). `tell`/`emoji` (parallel seans qo'shgan) yiqiladi —
  HEAD bilan AYNAN bir xil (emoji 77/77, tell 39/39) → oldindan bor qarz, bizniki emas.
- Brauzerda LMS CSS bilan (verify-fixed/vf2): 16 joy — 13 tasi bosib (Html1·Takrorlash·HtmlPractice·ReactIntro·FirstComp·PropsReuse·
  Router·PmLesson11·Routing·Postgres·PmLesson13·NestArch s19·FullPipeline), 3 tasi CSS darajasida (ReactApiPost·NestArch s3·PmJtbd):
  hammasi `static`, ustma-ust yo'q, ✓ qirqilmagan (ReactIntro'dan tashqari → F-0929-92).
- Yangi fayllar (untracked): `feedback/F-0929-LMS-yuklash/{DAVOM,JURNAL,QONUN_NOMZODLARI}.md`, `vositalar/`.

## 4. KEYINGI QADAMLAR (tartib bilan)
1. **Foydalanuvchidan S6 va S7 javobini ol** (u yangi seansda prompt ichida berishi mumkin).
2. **S7=A bo'lsa:** `src/3-Modull/ReactIntroLesson.jsx:1711` — `// ikki alohida blok` → `// ikki blok`, ru `// два отдельных блока` → `// два блока`.
   Keyin `npm run gates -- src/3-Modull/ReactIntroLesson.jsx` + `node feedback/F-0929-LMS-yuklash/vositalar/verify-fixed.mjs src/3-Modull/ReactIntroLesson.jsx 15` (belgi qirqilgan=false bo'lishi kerak).
3. **S6 ga qarab paket:**
   - `node scripts/yuklash-papka.mjs --out yuklash-2026-09-29` (App.jsx registridan; `--moduls` sukut 1,2,3,4,4a,4b,4c).
   - S6=A: skriptda dars chiqarib tashlash bayrog'i YO'Q — m2-16 va m3-17 chiqmasligi uchun yo `--skip` qo'shiladi (skript bizniki, LMS-yuklash vositasi), yo papkadan
     ikki fayl + ROYXAT qatori olib tashlanadi. NN `App.jsx` dagi `n` dan: 2- va 3-Modulda **03 bo'sh** qoladi (JsVars 04, ReactFirstComponent 04). Buni foydalanuvchiga ayt.
   - S6=B/C: avval katalog (5-band), C bo'lsa oldin GATE 2 (artifact 37jh2S7SprcbgXGKpikdvY) + RU tarjima (`feedback/F-0928-06-yangi-darslar/DAVOM.md`).
4. **Paket tekshiruvi:** `bash scripts/yuklash-tekshir.sh <papka>` (smoke-lms uz+ru, md5, katalog) + bosib-yurish:
   `node feedback/F-0929-LMS-yuklash/vositalar/click-walk.mjs /tmp/lms-tekshir/all.json yuklash-2026-09-29/*/*.jsx` (PAR=6, ~15 daq; `uyga-vazifa … lesson-root chizilmadi` = soxta signal, `.hw-root`)
   + to'qnashuv: `python3 feedback/F-0929-LMS-yuklash/vositalar/collide3.py yuklash-2026-09-29/1-Modul …` → 0 bo'lishi shart.
   Kutilgan: crash 0 (JsVars endi toza), `fixed` 0.
5. **Katalog (faqat S6=B/C):** `gen-lesson-catalog.mjs` ni TO'G'RIDAN yurgizma — u butun `src/` ni yig'adi (7 bridge qo'shadi, 5–6-Modul 16 yozuvini
   o'zgartiradi, `pm-m7d2-v2`/`pm-m8d1-v2` ni o'chiradi). Vaqtinchalik papkada yig'ish: `mkdir -p T/server/data; ln -s $PWD/src T/src; ln -s $PWD/node_modules T/node_modules; cd T && node <repo>/scripts/gen-lesson-catalog.mjs`,
   so'ng `server/data/lesson-catalog.json` ga FAQAT 1–4c qismini birlashtir (2 yangi + matn yangilangan 5 ta: vscode-start-01-v1, html-01-v17,
   html-practice-portfolio-v2, js-vars-01-v18, pm-m2d2-v1). JTBD `title_ru: null` — darsda ru nom kerak. Serverga chiqarish: `bash scripts/sync-dars-api.sh staging`
   → staging-check → main (prod, qo'lda) — **har qadam foydalanuvchi buyrug'i bilan** (memory: coddycamp-integratsiya-sirlari).
6. **Foydalanuvchiga topshir:** papka yo'li, ROYXAT, tekshiruv natijalari, qaysi 15 dars tuzatilgani (LMS'da almashtirish kerak bo'lganlar).
7. **S5 (paketdan keyin):** `vositalar/collide3.py` → `scripts/lint-lms-css.mjs`, `click-walk` ga LMS CSS varianti → `yuklash-tekshir.sh` ga ulash.
   `gates.mjs`/`package.json` — umumiy fayllar: parallel seanslar (A=6-Modul, B=5-Modul) tugagach ulanadi. `vositalar/lms-host.css` — LMS CSS surati (29.09).
8. **Muhr (parallel tugagach):** `QONUN_NOMZODLARI.md` → DARS_ETALON (is- prefiksi qonuni), tekshiruvchi ov-bandi, PIPELINE.
9. **Commit** — faqat buyruq bilan, faqat shu 15 fayl + `feedback/F-0929-LMS-yuklash/` (+ agar bo'lsa katalog/skript). Boshqa seanslar fayllari (6-Modull, gates.mjs, package.json …) ARALASHMASIN.

## 5. Vositalar (`feedback/F-0929-LMS-yuklash/vositalar/`, chiqish `/tmp/lms-tekshir`, `LMS_OUT` bilan o'zgaradi)
- `click-walk.mjs <out.json> <fayl…>` — har ekranda 6 tagacha tugma bosib, pageerror/ErrorBoundary yig'adi (LMS CSS'SIZ).
- `verify-fixed.mjs <src.jsx> <idx> …` — LMS CSS bilan ochib, `.is-fixed` holatiga yetkazib o'lchaydi (static/ustma-ust/✓).
- `vf2.mjs <src.jsx> <idx> act|css <arg>` — aniq harakat-ketma-ketligi yoki CSS-darajali sinov (avval verify-fixed bundle yig'gan bo'lishi kerak).
- `shot.mjs <fayl> <idx> <prefiks> '<actions>'` — LMS CSS bilan/usiz skrinshot (`LANG_=ru`).
- `collide3.py <papka|fayl…>` — className tokenlari ∩ LMS Tailwind sof sinflari (italic istisno).
- Ekran indeksi = SCREEN_META tartibi (0 dan); dars hisoblagichidagi «08 / 18» = idx 7.

## 6. Muhim faktlar
- LMS runner (`lms.coddycamp.uz/assets/LessonRunner.*.js`) darsni o'z React daraxtida chizadi — iframe/shadow yo'q → host CSS (Tailwind + preflight) darsga ta'sir qiladi. Bizning barcha vositalar (page-audit, ru-walk, smoke-lms, Vercel) LMS CSS'SIZ.
- LMS'dagi fayl URL: `go.coddycamp.uz/uploads/lessons/lesson_runner/<hash>.jsx` (preview URL'dagi `jsx=` parametri) — md5 bilan paketga solishtiriladi.
- `smoke-lms` faqat birinchi ekranni ochadi, bosmaydi (F-0929-90 shu teshikdan o'tgan).
- 88 fayl · 1365 ekran bosib-yurish (25.09 paketi): yagona crash JsVars s5; `no-undef` ham faqat shu.
