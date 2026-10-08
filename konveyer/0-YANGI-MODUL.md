# 0 · Yangi modul — dasturdan darsgacha (yangi seans uchun yo'riqnoma, 05.10.2026)

Bu fayl yangi modulni NOLDAN qurish tartibi: dastur (`CoddyCamp_Senior_2026_v9_14modul .html`) → MD v3 → foydalanuvchi auditi → MD tuzatish → «qur» → darslar → yopish.
Bosqichlarning o'zi `README.md` zanjirida; bu yerda — yangi modulga xos qadamlar, raqamlash va seans chegarasi.

## 1. Raqamlash (LMS ↔ kod)
| LMS (dastur v9) | Kod papkasi | App.jsx | Kalit | QA sayti |
|---|---|---|---|---|
| 7-modul Botlar | `src/5-Modull` | `id: '5'` | `m5-NN` | coddycamp-5modul |
| 8-modul Tizimni to'liq yig'aman | `src/6-Modull` | `id: '6'` | `m6-NN` | coddycamp-8modul |
| **9-modul Loyiham kim uchun + animatsiya** | **`src/7-Modull`** | **`id: '7'`** | **`m7-NN`** | yangi (masalan coddycamp-9modul) |
| 10-modul Gipoteza + texnik MVP | `src/8-Modull` | `id: '8'` | `m8-NN` | — |
Qoida: kod raqami = LMS raqami − 2 (9 → 7, 10 → 8 …). Suhbatda foydalanuvchiga **LMS raqami** bilan gapiriladi («9-Modul 3-darsi»), fayl va kalit — kod raqami bilan.
Eski 7-Modul darslari (git `363759e` va oldin) — **ishlatilmaydi** (foydalanuvchi 04.10 da o'chirgan: «eskisi kerak emas»).

## 2. Seans chegarasi (asosiy seans bilan parallel ishlaganda)
**Yangi modul seansi o'zgartiradi (faqat):** `src/7-Modull/*` · App.jsx dagi **faqat** `// ---- 7-Modul` import bloki va `id: '7'` modul bloki ·
`feedback/F-1005-9modul/*` (MD, jurnal, DAVOM, YAKUNIY, rasm) · QA sayti fayllari (`modul7.html`, `src/m7-demo/*`, `vite.m7.config.js`, `dist-m7/`).
**Tegmaydi:** `konveyer/*` · `src/qolip/*` · `src/skelet/*` · `src/live/*` · `scripts/*` · `lint-*.mjs` · `layout-lint.mjs` · `tools/*` · `package.json` ·
`QOIDALAR.md` · `DARS_ETALON.md` · `PM_DARS_ETALON.md` · `MATN_KORPUS.md` · `MATN_ETALONI.md` · `RU_I18N_SPEC.md` · `CLAUDE.md` · `KATTA_TOZALASH.md` · boshqa modullar.
Mexanizmga (qolip, darvoza, qonun) o'zgarish kerak bo'lsa — o'z jurnalida **«MEXANIZM-TAKLIF»** bo'limiga yozadi (nima, nega, qaysi fayl); asosiy seans qo'llaydi
yoki foydalanuvchi qaror qiladi. Yangi qolip turi kerak bo'lsa ham shunday.
**F-ID:** `F-MMDD-NN` — yangi modul seansi NN **50 dan** (F-1005-50, -51 …), asosiy seans 01–49. **Commit:** faqat foydalanuvchi buyrug'i bilan, faqat o'z fayllari (`git add <aniq yo'l>`).

## 3. Bosqichlar
**0 · Manba** (asosiy seansning o'zi, agentsiz):
- Dastur: `python3` bilan HTML → matn, «9-modul · …» bo'limi: har dars — tip (TEX · AI-PRAKT · PM · PM+PRAKT · REZERV), mavzu, mazmun, natija.
- Oldingi modul oxiri: 6-Modul (LMS 8) oxirgi darsi `m6-14` va YAKUNIY (`feedback/F-0929-QA-6modul/YAKUNIY/`); o'tilgan atamalar — 5 va 6-Modul YAKUNIY (grep).
- Dars turi → qonun: TEX — `DARS_ETALON.md` · PM — `PM_DARS_ETALON.md` + `PM_Prompt_v8.md` · AI-PRAKT / PM+PRAKT — amaliyot bloki (`QBlok`, 172/173) · REZERV — dars qurilmaydi (App.jsx da `comp` siz qator).
- Foydalanuvchi bilan **bitta qaror sahifasi** (savollar faqat bitta artifact sahifada): misol-ip (bitta ip modul bo'yi), repo (yangi MVP repo'si yoki boshqa), dars nomlari.
**1 · MD v3** — `1-MD.md` (format, qolip turlari, GATE M ro'yxati). Matn yozishdan oldin `MATN_KORPUS.md`. Namuna: `feedback/F-0929-QA-6modul/01-SystemArchitecture-v3.md`.
Har dars — bitta agent (**avval foydalanuvchidan qisqa ruxsat**: nechta agent, qaysi fayllar). Natija: `feedback/F-1005-9modul/NN-<Nom>-v3.md`.
**2 · GATE M** — bitta sahifa: `python3 konveyer/vositalar/gatem/sahifa.py <config.json> feedback/F-1005-9modul <scratchpad>/gatem.html` → Artifact.
Foydalanuvchi auditi (o'zi yoki ChatGPT) → `1-MD.md` «Filtr» (Qabul/Qisman/Rad + sabab) → MD tuzatiladi → yana sahifa, toki «tasdiq».
Javob qatori → `GATE_M_JAVOB.md` (agentlar uchun majburiy). **GATE M tasdig'i — agent yuborishga ruxsat emas.**
**3 · «Qur»** (foydalanuvchi aytgach, ruxsat bilan): har dars `cp src/skelet/NamunaDars.jsx src/7-Modull/<Nom>Lesson.jsx` → `2-QURUVCHI.md`;
App.jsx 7-Modul bloki: `const <Nom>Lesson = L(() => import('./7-Modull/<Nom>Lesson.jsx'))` + `{ key: 'm7-NN', …, comp: <Nom>Lesson }` (menyu nomi = dars nomi, DE-205).
**4–8** — `3-SADOQAT` · `4-VIZUAL` · `5-TUZATUVCHI` · `6-RU` · `7-YAKUNIY` (`feedback/F-1005-9modul/YAKUNIY/`).
**9 · Yopish** — `npm run modul:yopish -- src/7-Modull --yakuniy feedback/F-1005-9modul/YAKUNIY` (uzoq — fon vazifa + Monitor, muddati tugasa qayta yoqing).

## 4. QA sayti (yopishdan keyin, foydalanuvchi buyrug'i bilan)
6-Modul naqshidan nusxa: `modul6.html` → `modul7.html` (sarlavha, `src/m7-demo/M7DemoMain.jsx`) · `src/m6-demo/*` → `src/m7-demo/*` (katalog: `L('m7-NN', …)` qatorlari) ·
`vite.m6.config.js` → `vite.m7.config.js` (`outDir: 'dist-m7'`, `input: modul7.html`). Build → `cp dist-m7/modul7.html dist-m7/index.html` →
Vercel'da **yangi loyiha** (akkaunt `kirishnomi6-9875`; yaratish — foydalanuvchi roziligi bilan) → `npx vercel deploy --prod --yes --cwd dist-m7` →
`SAYT_URL=… KEYS=m7-01,… node konveyer/vositalar/sayt-smoke.mjs` (uz+ru, ru kirish tugmasi ruscha bo'lishi kerak).
LMS ga yuklanmaydi (LMS — faqat 1–4-Modul).

## 5. Esda tuting (05.10 saboqlari)
Agentlar — faqat ruxsat bilan · Tashxis avval, yechim keyin · Savollar — bitta sahifada, javob qatori bilan · Jurnal vaqti — `date` ·
Har brauzer sinovida vaqt chegarasi · Darvoza: har dars `npm run gates -- <fayl>` 12/12, `npm run lint:jsx` 0, matn tegilsa `npm run lint:til` ·
CSS izohida backtik yo'q · Dars `setLiveLang(lang)` chaqiradi (skeletda bor — o'chirmang) · Bir ma'no — bir so'z (uz va ru) ·
yakuniy MD agentlarining «shubhali joylar»i — supurish va foydalanuvchiga ro'yxat.
