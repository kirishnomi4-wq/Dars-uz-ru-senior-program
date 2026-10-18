# DAVOM — F-1013 amaliyot qolipi (yangi seans shu fayldan boshlaydi)

> Oxirgi yangilanish: 2026-10-14 09:31. Foydalanuvchi: «yangi sessiyada davom etamiz» deganda — shu fayl + `JURNAL.md` + `GATE_M_JAVOB.md` o'qiladi.
> Qoida: har qadamdan oldin reja aytiladi, «ha»dan keyin bajariladi (memory `sorovsiz-hech-narsa-qilma`). Commit — faqat buyruq bilan. Agentlar — faqat ruxsat bilan.

## Kelishuvlar (13.10)
- Ish tartibi: kod **VS Code**'da, aniq prompt **gemini.google.com**'ga (13+, O'zbekistonda bor), natija **Live Server**'da.
- **Antigravity** — faqat ixtiyoriy qator (rasmiy FAQ: 18 yoshdan kichiklarga yopiq). Darsda «18 yoshman deb yozing» qadami YO'Q.
- 2-Modul tartibi: m1-07 CSS layout → **m1-15 VS Code** → **m1-08 HTML Praktika** → m1-10 CSS Praktika (LMS'da foydalanuvchi almashtiradi, umumiy yuklash kuni).
- Hamma ish tayyor bo'lgach — bitta yuklash papkasi, birdaniga.

## Bosqichlar holati
| # | Bosqich | Holat |
|---|---|---|
| 1 | 2-Modul tartibi (App.jsx, teg-xaritasi, mentor sayti, HtmlPractice «keyingi dars») | ✅ |
| 2 | VS Code darsi (m1-15): yangi 13-ekran «AI bilan: aniq prompt», 20 ekran | ✅ qurildi, sinovdan o'tdi (gates 11/12 — emoji eski qism → KATTA F-1013-E) |
| 3 | HTML Praktika (m1-08): bloklar VS Code + Gemini'ga | ✅ 14.10 qurildi; F-1014 fidbeki (7 band) 09:31 tuzatildi — 13 ekran, MD v3.2, sinovlar o'tdi; foydalanuvchi qayta ko'rigi kutilmoqda |
| 4 | **CSS Praktika (m1-10)** — KEYINGI: «AI bergan dizaynni tushunish va o'zgartirish», 11 ekran; «o'tgan darsdagi flexbox» xatosi | ⬜ |
| 5 | 3-Modul: m2-08, m2-09 (Antigravity simulyatsiyasi → VS Code + Gemini), m2-11, m2-12 | ⬜ |
| 6 | 4–6-Modullar: Antigravity ishlatilishi bo'yicha hisobot (≈70 fayl) → foydalanuvchi qarori | ⬜ |
| 7 | RU tarjima (m1-08, m1-15 — hozir qoralama), yakuniy MD, hamma sinovlar, yuklash papkasi | ⬜ |

## 3-bosqich — qurish rejasi (✅ 14.10 bajarildi, JURNAL'da)
- Manba: `01-m1-08-v3.1.md` (+ `01-m1-08-v3.md`). Fayl: `src/1-Modull/HtmlPractice.jsx` (hozir kompilyatorli 12 ekranli versiya, gates 12/12).
- Zaxira: `arxiv/F-1013-amaliyot-oldin/` da 20 ekranli asl nusxa bor; qurishdan oldin hozirgi (kompilyatorli) nusxa ham saqlanadi (masalan `arxiv/F-1013-m108-kompilyatorli/`).
- A1–A3 → `QBlok` + `QPrompt` (qolipda bor) + har qadam «Bajardim» (skelet `src/skelet/NamunaDars.jsx` `ScreenBlok` naqshi), «Namuna kodini nusxalash» (NAMUNA_A1/A2 faylda bor).
- Kompilyator bilan bog'liqlarini olish: `HtmlCompiler` importi, `TASK_A1–A3`, `BLOKLAR`, `openBlok`, `blokDone`, `readBlokCode`, portal, `pracRead` tiklash; «Level Up!» — A3 oxirgi «Bajardim»da.
- `PfSite` ga dizaynli holat (A3 natijasi). 0-ekran javobi «qurasiz», 1-ekran pastki qator, uyga vazifa VS Code'da, `HOMEWORK` `type: 'file'`.
- `HtmlCompiler.jsx` dagi `ANCHOR_NAV` tuzatishi QOLADI (CssLesson2 ishlatadi).
- Sinov: gates 12/12 · lint:jsx · 12 ekran surati 1280+390 · blok oqimi · navtest2 (self) · mentor · `smoke-onfinished-all` (⚠️ faqat argumentSIZ yurgizing — fayl bilan yurgizilsa umumiy natija fayli ustidan yoziladi).

## Vositalar (seans scratchpad'i yo'qoladi — kerak bo'lsa qayta yozing)
- Suratlar: `node konveyer/vositalar/shots.mjs <fayl> <papka> [ekranlar]` (SHOT_W/SHOT_H).
- Navigatsiya: `feedback/F-1012-navigatsiya-klapan/vositalar/navtest2.mjs` (ichidagi chiqish yo'lini yangi scratchpad'ga almashtiring; `node_modules` symlink kerak).
- GATE M sahifasi: `python3 konveyer/vositalar/gatem/sahifa.py <config.json> feedback/F-1013-amaliyot <chiqish.html>` → Artifact.

## Parallel seans (14.10)
- Ikkinchi seans LMS 7-M va undan keyingilarining fidbeklarini tuzatadi: `src/5-Modull` … `src/12-Modull`, F-1014-100 dan. Bu seans u papkalarga tegmaydi; `src/qolip`, `App.jsx` — so'rab.

## Ochiq qarzlar
- `VsCodeLesson.jsx` va `CssLesson2.jsx` — `emoji` darvozasi (eski umumiy qismlar) → `KATTA_TOZALASH.md` F-1013-E.
- `scripts/smoke-onfinished.mjs` VsCode darsida yakun tugmasini topmaydi (eski holat ham shunday); `-all` varianti o'tadi.
- Commit qilinmagan: F-1012 (70 dars), F-1013 (HtmlPractice — 14.10 VS Code bloklari, VsCodeLesson, HtmlCompiler, teg-xaritasi, App.jsx, mentor/lessons.jsx, KATTA_TOZALASH, feedback/F-1013-amaliyot/*).
