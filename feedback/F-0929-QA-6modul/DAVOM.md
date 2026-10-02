# 6-Modul — DAVOM (QA fidbekini kutish nuqtasi)

Yozildi: 2026-09-29 23:33. Keyingi seans SHU fayldan boshlanadi.

## 1. Holat

- 6-Modul (LMS'da «8-Modul», kod `src/6-Modull`) — 14/14 dars: uz = MD v2, ru = yangi uz tarjimasi (~3 110 juft).
- Sayt: https://coddycamp-8modul.vercel.app (14:54 deploy, UZ+RU). 17:36 da QA'ga to'liq vizual ko'rikka berildi.
- 23:28 seansida QA fidbeki KELMADI (shablon bo'sh yuborildi). Hech narsa tuzatilmagan.
- Hammasi UNCOMMITTED.
- Darvozalar oxirgi holati: gates 9/9 ×14 · ru-gate TENG ×13 · 7-dars (WriteSkillLesson) FARQ — ataylab (arena canvas TOK dekori) · kalitlar HEAD bilan bir xil · uyga vazifa bloklari md5 bir xil.

## 2. Noaniq (birinchi xabarda so'raladi)

- **HAL (30.09 07:06):** `~/Pictures/Screenshots/` 29.09 19:41–20:27 skrinshotlari ko'rildi — Coursera testlari (Git, UX/UI, data structures), QA fidbeki EMAS. 30.09 06:51 dagi 2 tasi — Claude kredit oynasi, u ham emas.
- 30.09 07:06 seansida ham shablon bo'sh keldi (2-marta). Hech narsa tuzatilmagan.

## 3. Fidbek kelganda — tartib (CLAUDE.md retsept B)

1. **F-ID:** 29.09 sanasida F-0929-32…49 (6-Modul oralig'i; 01–31 band). Boshqa sanada — `F-<MMDD>-01` dan; o'sha kuni parallel seans (5-Modul / LMS) bo'lsa, raqam oralig'i oldindan bo'linadi.
2. **Rasm** → `feedback/F-0929-QA-6modul/qa/` (public/ EMAS).
3. **Tashxis avval:** har band → qaysi dars, qaysi ekran, `fayl:qator`, sabab, yechim-taklif. uz yoki ru ekanini ajrat. Qaror-savoli bo'lsa — suratli artifact (memory `qaror-vizual-artifact`).
4. **[GATE]** — foydalanuvchi tasdig'isiz hech narsaga tegilmaydi.
5. **Tuzatish** (tasdiqdan keyin), har fayldan keyin:
   - `npm run gates -- src/6-Modull/<Fayl>.jsx` (9/9)
   - `npm run lint:jsx` (0 topilma)
   - uz TEGILMAGAN bo'lsa: `node tools/ru-gate.mjs arxiv/m6-v2-uz-baseline-2026-09-29/<Fayl>.jsx src/6-Modull/<Fayl>.jsx` → TENG shart
   - uz O'ZGARGAN bo'lsa: diffni ko'rib, etalonni SABAB bilan yangilash (`cp` → arxiv/m6-v2-uz-baseline-2026-09-29/), JURNAL'ga yozish
   - uz matn o'zgarsa — tegishli `NN-*-v2.md` ham ✎ (MD = manba-haqiqat)
6. **Deploy:** memory `m8-qa-deploy-tartibi` (build → index.html → project.json tiklash → vercel deploy). Auto-mode deploy'ni rad etishi mumkin — unda foydalanuvchiga buyruqni beraman.
7. **Jurnal:** `feedback/F-0929-QA-6modul/JURNAL.md` ga F-ID bilan (nima topildi → nima qilindi → qayerga muhrlandi).
8. **Muhr:** B/4 marshruti. Umumiy qonun-fayllarga (MATN_KORPUS, DARS_ETALON, rol-fayllar) faqat parallel seans yo'qligi aniq bo'lganda.

## 4. Commit'dan oldin (commit — faqat buyruq bilan)

- 7-dars etaloni: TOK farqini ko'rib → `cp src/6-Modull/WriteSkillLesson.jsx arxiv/m6-v2-uz-baseline-2026-09-29/`.
- Faqat o'z fayllari: `src/6-Modull/*` (14), `src/m6-demo/`, `modul6.html`, `vite.m6.config.js`, `feedback/F-0929-QA-6modul/*`, `arxiv/m6-v2-uz-baseline-2026-09-29/`. `git add -A` YO'Q, `dist-m6` commit qilinmaydi.

## 5. Ochiq qaror-savollar (QA'dan mustaqil)

- 12-dars `HW_TOKENS` «yo'l» — uyga vazifa bloki, faqat xabar qilinadi (tegilmaydi).
- lint-tell warn: to'g'ri javob uzunroq (×1.26–1.42) — 1-dars #2/#3, 2-dars #11, 3-dars #5/#9, 4-dars #9, 5-dars #7/#12, 8-dars #12, 10-dars #9, 12-dars #9, 13-dars #10/#11.

## 6. Qonun-nomzodlar (umumiy fayllarga, 5-Modul seansi bilan kelishib)

- DnD katak izohi raqamni takrorlamaydi («bu yerga qo'ying») + keng ekranda ikki ustun.
- Metafora olib tashlanganda DEKOR qatlami ham tozalanadi (7, 9-dars).
- MD'dagi kod-namuna ishlaydigan bo'lishi shart (10-dars AsyncStorage).
- RU: ish-ro'yxati usuli (worklist → tarjimon JSON → apply → ru-gate) — `RU_TARJIMON_SHABLON.md`.
