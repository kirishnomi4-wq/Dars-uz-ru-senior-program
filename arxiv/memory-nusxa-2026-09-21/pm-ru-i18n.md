---
name: pm-ru-i18n
description: "PM darslar UZ-RU: M1–M4 (PmLesson11–14) + M4a/4b/4c (PmLesson15–18, 2026-08-22); vositalar ru-gate + ru-walk + ru-tm; qolgani M5+"
metadata: 
  node_type: memory
  type: project
  originSessionId: 3cc244f5-e14f-4505-8dd4-8037525c1cbc
  modified: 2026-08-20T08:41:31.319Z
---

PM darslarini UZ-RU qilish: `PmLesson1–6` (M1–M2) tayyor. **3-Modul 2026-08-20 da TO'LIQ
yopildi (14/14):** `PmUserStoryLesson` (M3-D2), `PmLesson8` (M3-D5), `PmLesson9` (M3-D10)
va oxirgisi `PmLesson10` (M3-D14, 402 `ru:`). `PmLesson7.jsx` — **o'lik fayl**, tarjima
shart emas (`App.jsx:45` da P0 uni almashtirgan). **4-Modul PM darslari 2026-08-21 da yopildi:** `PmLesson11` (M4-D2, 411 `ru:`), `PmLesson12` (M4-D7, 398), `PmLesson13` (M4-D12, 442), `PmLesson14` (M4-D15, 403) — 4 ta parallel agent, yangi `tools/ru-gate.mjs` (esbuild-kanonik UZ-regressiya + RU-qoldiq skaneri, salbiy sinov 5/5) va `tools/ru-walk.mjs` (brauzerda ekran × til, `file://` bundle) darvozalari bilan. Baseline: `arxiv/pm11-14-uz-baseline-2026-08-21/`. Qolgani: M5+ (`PmLesson15–34`).

**Yangi takror bug-sinfi (3 darsda ham chiqdi):** matn-normalizator regexlari kirill diapazonini `\u0400-\u04FF` ESCAPE shaklida olishi shart — literal `а-яё` yozilsa til-lint homoglif beradi, umuman qoldirilsa RU javob bo‘sh satrga aylanib «takror/nusxa» deb rad etiladi.

**Why:** RU rejimda modul yarim tilda qolmasin — React ekranlar ruschaga o'tadi,
tarjimasiz PM darsi o'zbekchaligicha ochiladi.

**How to apply (uch vosita):**
1. **Butun-qator avto-ko'chirish**: qardosh tarjimalangan darsdan qatorni olib, uning
   normalizatsiyasi nishon qatoriga MOS kelsa, ko'chiriladi (kafolat: UZ ga qaytadi).
   M3-D14 da 172 infra-qator shunday keldi. Kalit ikki shaklda saqlanadi — `{'Matn'}`
   qavsli va qavssiz JSX-matn ko'rinishida.
2. **🔴 esbuild-kanonik UZ-regressiya darvozasi (eng qimmatlisi)**:
   `esbuild(normalize(tarjima)) === esbuild(etalon)`. `normalize` — JSX-xabardor skaner,
   `tr({uz,ru})` va `{uz,ru}` ni uz-shohiga yig'adi. esbuild haqiqiy parser bo'lgani
   uchun qavs-uslubi farqi shovqin qilmaydi. Ikkala tomonga bir xil kanonizatsiya:
   qo'shni satr-literallarni birlashtirish, `React.Fragment` o'ramini yechish, izohlarni
   tashlash. **Salbiy sinov majburiy**: bitta so'z / «—» tire / «!» olib tashlansa
   tutishi tekshiriladi. Atayin o'zgarishlar etalon-nusxaga SABAB bilan ko'chiriladi.
   Skriptlar: `normalize.mjs` · `gate.mjs` · `port.mjs` · `walk.mjs` (RU_I18N_SPEC'da tavsif).
3. **Brauzer-walk**: `ccProgress:<lessonId>` + `liveSession:<id>={mode:'self'}` bilan
   urug'lantirib har ekranni ikkala tilda ochish (playwright-core + tizim Chrome, file://
   bundle — dev-server shart emas). Interaktiv holatlarni ham bosib chiqish shart.

**PM darsiga xos tuzoqlar:** (a) o'quvchi YOZGAN matnni tekshiruvchi regexlar va
kompilyator shartlari tilga bog'liq — `{uz,ru}` juftligiga ajratib IKKALASINI sinang
(M3-D14 `ekranniTakror`); (b) `<HtmlCompiler lang="uz">` → `lang={__lang}`; (c) qolip-gap
tuzilishi ikki tilda boshqacha; (d) tanlov MATN bilan saqlansa til almashganda yo'qoladi —
`id`/indeks bilan saqlang (obyekt `key` ham `[object Object]` beradi); (e) `x.vaqt === '1 kun'`
kabi solishtiruvlar `.uz` ga o'tadi; (f) `fmtCode(tr(x))` tartibi; (g) matn-normalizatorlar
kirillni tashlaydi; (h) darslararo artefakt MATN saqlashi shart (`tr(ZAXIRA_ISH)`, obyekt emas);
(i) **fon-dekoratsiyasi**: canvas `TOK`, `HW_TOKENS`, `QZ_BG_SHAPES` — esbuild ham, lint ham
ko'rmaydi, faqat walk tutadi; (j) **shablon-satrni bo'lmang** — butun `` `…${n}…` `` ni
`tr()` ichiga oling, aks holda kanonik natija o'zgaradi; (k) kod-namunasida identifikator
nomlari ikkala tilda BIR XIL qoladi, faqat izohlar tarjima qilinadi; (l) til-lint kirillni
faqat `ru:` maydonida oqlaydi — regex-juftligi ham shu kalitlarni ishlatsin.
Aloqador: [[ru-i18n-konvensiya]], [[pm-ikki-tur-etalon]].

**2026-08-22 qo'shimcha:** `PmLesson15–18` ham UZ-RU (605/613/618/610 `ru:`). Har birida ru-gate **TENG**,
ru-walk 32/32 toza. Etalon-nusxalar `arxiv/pm15-18-uz-baseline-2026-08-22/`.
Yangi vosita `tools/ru-tm.mjs` (tarjima-xotira; juftlik faqat UZ-shohi o'zgarmasa qabul qilinadi).
🔴 Yangi majburiy band: **o'quvchi yozgan matnni tekshiradigan regex** RU'da ishlamaydi —
`{uz,ru}` + `anyTest()`; `normX` filtrlariga `Ѐ-ӿ` qo'shiladi; o'lchov-qiymatlari
(`'0,4 s'`, `'ochilmayapti'`) ham matn — ular ham juftlanadi.
Qolgani: `PmLesson1/2`, `PmLesson19–25`.
