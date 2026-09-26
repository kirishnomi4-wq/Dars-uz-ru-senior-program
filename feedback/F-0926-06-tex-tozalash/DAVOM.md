# DAVOM — F-0926-06 texnik darslar tozalash (yangi seans SHU YERDAN)

**Yangilandi:** 2026-09-27 kech. Seans shu yerda yopildi (foydalanuvchi: «qolgani ertaga, yangi sesiyada yozaman»).

## 🔴 ERTALAB BIRINCHI ISH
`ERTALAB_SAVOLLAR.md` — **28 ta** javobsiz 1-Modul savoli + 1 ta 2-Modul savoli (M2-0, JsIntro «miya/yurak»).
Foydalanuvchi ertalab javob beradi. Javobni kutib, avval shu ro'yxatni eslat — javobsiz boshqa ishga o'tma.
Ko'rik-sahifa (rasmlar): https://claude.ai/artifact/WRiWKbvExzWt3AZQBU99Em

## Nima qilindi (26–27.09)
1. **Reja** `REJA.md` + foydalanuvchi qarorlari (etalonlar ham — modul oxirida · homework keyin · har modulda rasmli ko'rik · pilot CssLesson1).
2. **Tayyorlov:** snapshot `arxiv/tex-tozalash-oldin-2026-09-26/` (52 fayl, lokal, commitga kirmaydi) · `KALIT_OLDIN.txt` + `keytok.py`
   (INLINE_KEYS/correctIdx/correct/lessonId/answerKey/SCREEN_META) · `OLCHOV_OLDIN.md` · `TOZALASH_PROMPT.md` (agent yo'riqnomasi).
3. **Pilot CssLesson1** → GATE P ikki versiya, foydalanuvchi tasdiqladi («Ha, davom etamiz»). `PILOT_CssLesson1.html`.
4. **3-bosqich — codemodlar 51 darsda** (1–4c hammasi): stripe 541 · dark-btn 104 · dark-dead (o'lik 32, mp-demo 15) · frame-dash 91 ·
   ico 90 · ui-clean 450. Kalit 51/51 AYNAN · ru-walk 51/51 crash 0.
5. **4-bosqich — 1-Modul 11/11 dars** agentlar bilan (2 to'lqin + etalon Htmllesson1). Har biri bosh-agent qayta tekshirgan:
   gates 6/6 · kalit AYNAN · lint:jsx TOZA · ru-walk crash 0. Natija (11 dars): stripe 143→0 · dark 65→0 · til 20→0 · INP 10→3 ·
   DUP 56→31 · LOUD 9→6 · kesilish →0.
6. **GATE M1 javoblari (4):** T2 · T4 · V3 («VS Code») · E4 («Skelet (shablon)», 17 joy uz+ru, KORPUS 213).
7. **Qonun:** DARS_ETALON 159/16 (yonma-yon qutilar bir balandlikda — imkon bo'lsa, EQH) · 159/17 (javobni oldindan aytadigan yozuv yo'q) ·
   MATN_ETALONI lug'ati (skelet) · KORPUS 213 · tekshiruvchi ov-bandlari (oldingi seans).
8. **Vositalar:** page-audit — ALIGN birinchi-kontent tekshiruvi, **EQH** o'lchovi, SCROLL `.h-title` filtri · ru-walk/page-audit
   `domcontentloaded` · `scripts/codemod-dark-dead.py` (yangi) · dark-lint: `.sk-chip`, `.hl-chip`, `.cmp2-chip` istisnolari,
   brend-rangida `data-dark-ok` · til-lint `anatomiya-metaforasi` (skelet chiqdi, istisno `Skel[A-Z]`).

## Nima qoldi
1. **28 savol** (`ERTALAB_SAVOLLAR.md`) → javoblarni 1-Modulga qo'llash.
2. **2-Modul (10 dars)**: JsConditions · JsFunctions · JsIntro · JsLoops · JsVars · PeanStack · Practice1–4 — codemodlar yurgan,
   agent to'lqinlari qoldi. Avval M2-0 savoli (miya/yurak metaforasi). Qolgan dark/til qarzi: `tex-lint` (bosh-agent o'lchaydi).
3. **3-Modul (10) · 4-Modul (11) · 4a/4b/4c (10, etalon CiCdIntro oxirida)** — shu tartibda, har modul oxirida rasmli ko'rik.
4. `.homework.jsx` — alohida bosqich (keyin).
5. Yakunda: demo-sayt (`npx vercel login`) · `yuklash-<sana>/` (CRM 5→7-M, 6→8-M).

## Ish tartibi (ishladi)
- Agent: 1 fayl, `TOZALASH_PROMPT.md` + o'lchov papkasi + holat raqamlari + kalit qiymati; 100–173k token. Parallel 4–5 ta.
- Har agentdan keyin bosh-agent: `npm run gates -- F` · `keytok.py F` = `KALIT_OLDIN.txt` · o'chirilgan o'zgaruvchi grep ·
  to'lqin oxirida ru-walk + page-audit `--shots` (bir-biridan KEYIN, parallel yuk timeout beradi).
- Agent «istisno kerak» desa — o'zing tekshir (onClick bormi, CODE.bg mi), keyin dark-lint'ga izoh bilan.
- Ko'rik-sahifa: juftlar piksel-farq bilan tanlanadi, bo'sh/qoplamali kadrlar filtri (stddev>28, mean>170), keyin KO'Z bilan.

## Tuzoqlar (27.09 tutildi)
- `grep` aslida **ugrep** — murakkab naqshni rad etadi, NUL baytli faylni o'tkazadi → python yoki `grep -a`.
- zsh'da `sed '…'` ichida apostrof («ko'rik») qo'shtirnoqni buzadi → python bilan yoz.
- page-audit ALIGN/DUP/EQH — NOMZOD; animatsiya o'rtasida olingan kadr yolg'on signal beradi (qayta yurgiz).
- ru-walk `CHROME_PATH=/usr/bin/google-chrome` SHART.

## Git
Shu seans oxirida commit + push qilindi (commit xabari: «F-0926-06 …»). Kirmaganlar: boshqa seanslarning fayllari
(`JSX_NATIJA_*`, `ANALITIKA_*`, `JAVOB_DARS_*`, `CoddyCamp_Senior_*.html`, `yuklash-2026-09-2x/`, `feedback/F-0924-lms-payload/`,
`feedback/F-0925-01-crud-ligatura.png`, bridge `FIDBEK_2026-09-24.md` qatori) va `arxiv/*` snapshotlar (lokal).
