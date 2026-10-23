# 🔴🔴🔴 DAVOM — F-1022-01 yangi seans shu yerdan boshlanadi

Yozilgan: 2026-10-22 20:05 (chorshanba). Muddat: **yakshanba 26.10 prodga (LMS)**.

## Holat
| Dars | Fayl | Holat |
|---|---|---|
| m3-10 «Qachon «tayyor» deb ayta olamiz?» | `src/3-Modull/PmLesson9.jsx` | ✅ KOD (22.10 19:30) — gates 12/13 (`emoji` eski qarz 6) |
| m3-05 «Qaysi ishni birinchi qilasiz?» | `src/3-Modull/PmLesson8.jsx` | ✅ KOD (22.10 20:05) — gates 12/13 (`emoji` eski qarz 8) |
| m6-02 «Bitta gapni uch kishi…» | `src/6-Modull/PmLesson22.jsx` | 📋 JADVAL yozildi — `PmLesson22-v2-EKRANLAR.md` — **foydalanuvchi tasdig'i kutilmoqda** |
| m4-12 · m4b-02 · m4c-06 · m4-07 | PmLesson13 · 16 · 18 · 12 | 📋 JADVAL yozildi — `PmLesson13-16-18-12-v2-EKRANLAR.md` — **tasdiq kutilmoqda** |
| 1-o'tish «Nima quramiz» | `src/bridge/lessons/BridgeNimaQuramiz.jsx` | ⏳ yakshanbadan keyin (alohida sayt) |

Foydalanuvchi: «1-2 soatda yozaman, keyin yangi seansdan davom etamiz» — jadvallarga fikr/tasdiq xabar bilan keladi.

## Yangi seans qadamlari
1. Foydalanuvchi fikrini o'qi → jadvalga tuzatish (bo'lsa) → tasdiq.
2. **m6-02 kod** (katta: dasturchi 20 + murabbiy 10 → ustoz; PRD kuchayadi; s0 reveal; MENTOR_WHY 16). Naqsh: PmLesson9/PmLesson8 da qilingan mexanizm — `ScreenIdxCtx` (Stage provider), `MENTOR_WHY`, `MentorNote` why-qatori, bo'sh `<MentorNote />` s2/QuestionScreen/s6/s14, s0 `mReveal` + `mstats-reveal` tugma + `NavNext mentorLock`, CSS `.mnote-why`. Python-skript bilan aniq string almashtirish (har old 1 marta — assert), oldin nusxa scratchpad'ga.
3. **m4-12, m4b-02, m4c-06, m4-07 kod** — qisqa (20 joy), har biriga shu mexanizm.
4. Har darsdan keyin `npm run gates -- <fayl>`; `emoji` yiqilsa HEAD nusxasi bilan solishtir (`git show HEAD:<fayl>` → `node lint-emoji.mjs`), eski qarz bo'lsa jurnalga yoz, tegma. `tell` lint: to'g'ri variantda tire/qavs/texnik so'z yolg'iz qolmasin.
5. `til-lint-rules.json` `allowFiles` dan tuzatilgan darsni chiqar (PmLesson8 22.10 chiqarildi; PmLesson22, PmLesson13, PmLesson16, PmLesson12 — kod bo'lgach). Chiqargach `node til-lint.mjs <fayl>` → `dasturchi-topshiriq` 0.
6. Skrinshot: `CLICK='.hopt' node scripts/shot-screen.mjs <fayl> 0` (o'quvchi), `node scripts/shot-mentor-panel.mjs <fayl> 0 --wrong 1` (mentor; skript reveal'ni o'zi bosadi), `CHROME=$(command -v google-chrome)`.
7. Jurnal: `JURNAL.md` + `PM_PIPELINE_STATE.md` + EKRANLAR faylining Holat qatori.
8. Shanba 25.10: 7 dars `smoke`, QA sayt; yakshanba: `lms-farq` → paket → `YUKLASH_PROTOKOLI` → `lms-farq muhrla`; commit faqat buyruq bilan.

## Qoidalar (o'zgarmas)
- Uy vazifalari `*.homework.jsx` — TEGILMAYDI. `KATTA_TOZALASH.md` ga hozir yozilmaydi (foydalanuvchi 22.10).
- Atama qoladi (PRD, qabul shartlari, prioritet) — 110-qonun. Gap aytuvchi — ustoz. Keys-olamidagi uchinchi shaxslar o'z nomida.
- Test/arena to'g'ri javob o'rinlari, ekran soni, keyslar o'zgarmaydi.
- Ochiq qaror: yakshanba yig'ish `previewMode` (F-1021-10 adapter) — IT javobi (`feedback/F-1015-preview/`).
