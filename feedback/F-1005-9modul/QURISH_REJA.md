# 9-Modul — to'liq ish rejasi (konveyer 3–9), 05.10.2026

Manba-haqiqat: 12 ta `NN-*-v3.md` (GATE M + tashqi audit Filtri + o'zaro tekshiruv), `00-MODUL-TAYANCH.md`, `GATE_M_JAVOB.md`, `00-NOMLAR.md`.
Qoida: har to'lqindan oldin alohida ruxsat (nechta agent · nima · qaysi fayllar). Commit / push / deploy — faqat buyruq bilan. Seans chegarasi — `konveyer/0-YANGI-MODUL.md` 2-bo'lim.

## MD holati (qurishdan oldin)
- 12 MD · til tekshiruvi 0 xato · arena 12×12, ✔ 3/3/3/3 · ekran soni e'lon qilinganiga teng · keyingi dars nomlari menyu bilan mos.
- Ekranlar: 1 → 17 · 2 → 16 · 3 → 17 · 4 → 18 · 5 → 20 · **6 → 12** · 7 → 12 · **8 → 12** · 9 → 12 · 10 → 16 · 11 → 12 · 12 → 16 (6 va 8 — GATE M P-q0, PM+PRAKT shakli; 6, 7, 8, 9, 11 — kartochka alohida ekran, F-1005-88).
- «Qur» da tekshiriladi (MD da tekshirib bo'lmaydi): Umami / Netlify / Render interfeys nomlari · Motion (platformada `motion` paketi yo'q — 5, 8-darslarda maket) · ikki manba havolasi.

## To'lqinlar

| To'lqin | Nima | Agent | Tegadigan fayllar | O'tish sharti | Kim tekshiradi |
|---|---|---|---|---|---|
| **1** | **Repo `maydon`** — amaliyot bloklarining asosi | 1 | faqat `~/Desktop/maydon` (yangi, alohida git; `internetLesson` ga tegmaydi) | `main` = bo'sh boshlang'ich + `README.md` (stack); yechim tarmog'ida teglar `dars-04-start … dars-11-done` (tayanch 3 jadvali, K1, K7, `dars-09-done` dagi ataylab kamchiliklar); har teg lokal PostgreSQL bilan ishga tushadi, `npm run build` toza | men: har tegni `git checkout` + ishga tushirib ko'raman |
| **1** | **Pilot quruvchi** — 1-dars (PM) va 7-dars (loyiha kuni) | 2 | `src/7-Modull/PmProductProblemLesson.jsx` · `src/7-Modull/MvpFirstScreenLesson.jsx` | `gates` 12/12 · `lint:jsx` 0 · surat «xato: yo'q» (`konveyer/2-QURUVCHI.md`) | men: `App.jsx` 7-blokka 2 ta `comp`, lokal dev'da ko'rish, sizga havola |
| — | Pilot ko'rigi | — | — | siz ko'rasiz; umumiy xatolar keyingi topshiriqqa qo'shiladi | siz |
| **2** | Quruvchi — qolgan 10 dars | 10 parallel | har biri faqat o'z `src/7-Modull/<Nom>Lesson.jsx` | har dars 12/12, 0 | men: `App.jsx` comp, darvozalar qayta |
| **3** | Sadoqat (kod ↔ MD) + vizual (1280×773 · 1366×768 · 390×844) | 2 × 12 = 24, ikki bo'lakda | yo'q — faqat hisobot (`3-SADOQAT.md`, `4-VIZUAL.md`) | MOS · TOZA | men: topilmalarni yig'aman |
| **4** | Tuzatuvchi (topilma bo'lgan darslar) | 0–12 | o'z fayli (`5-TUZATUVCHI.md`) | qayta 3-to'lqin, maks 2 aylanish | men |
| **5** | RU | 12 | o'z fayli, faqat `ru:` (`6-RU.md`) | `ru-gate` TENG · `ru-walk` toza | men |
| **6** | Yakuniy MD (koddan) | 12 | `feedback/F-1005-9modul/YAKUNIY/NN-*.md` (`7-YAKUNIY.md`) | ekran soni = SCREEN_META | men |
| **7** | Modul yopish | — | — | `npm run modul:yopish -- src/7-Modull --yakuniy feedback/F-1005-9modul/YAKUNIY` (fon + Monitor, vaqt chegarasi) | men |
| QA | QA sayti — buyruq bilan | — | `modul7.html` · `src/m7-demo/*` · `vite.m7.config.js` · `dist-m7/` | Vercel yangi loyiha (sizning roziligingiz), `sayt-smoke` uz + ru | siz |
| — | Commit, repo push (`github.com/Azizbekcrypto/maydon`) | — | o'z fayllarim, `git add <aniq yo'l>` | faqat buyruq bilan | siz |

Zaxira dars (13) qurilmaydi. `App.jsx` dagi `import` + `comp` — fayl paydo bo'lgach (aks holda build sinadi), faqat 7-blokda.

## Har agentga beriladigan topshiriq
- Quruvchi: `konveyer/2-QURUVCHI.md` + dars MD + `00-MODUL-TAYANCH.md` (5–6-bo'limlar) + `GATE_M_JAVOB.md`; skelet `src/skelet/NamunaDars.jsx`; turn-byudjeti ≤110.
  Qo'shimcha: saqlash kalitlari — tayanch 6 jadvali (yangisini o'ylab topmaydi); blok 5 qadam (`QBlok` massiv); PM+PRAKT (6, 8) — yakun ichida `QKartochka`.
- Repo agenti: tayanch 3 (jadval, teglar), K1, K2, K7, 4–11-darslar MD laridagi REPO bo'limlari; har teg — o'sha dars prompti natijasiga mos; push yo'q.

## Hajm (halol)
≈ 60–70 agent yurishi. O'lchov: MD agenti ≈ 0.3–0.4 mln token; quruvchi og'irroq. Shuning uchun pilot: umumiy xato 12 marta emas, bir marta tuzatiladi.

## Ochiq qarorlar (sahifada, tavsiya — birinchi variant)
1. Pilot (2 dars + repo) avval · yoki 12 tasi birdan.
2. Repo joyi `~/Desktop/maydon` · push — buyruq bilan.
3. Teglarni sinash — lokal PostgreSQL (ishlayapti).
