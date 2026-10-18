# YAKUNIY · m10-11 «Raqamlaringiz pitchni qanday o'zgartiradi?» (LMS 12-Modul 11-dars · src/10-Modull/PmPitchReviewLesson.jsx) — 12 → 11 · F-1018-08 · 2026-10-18 (avtopilot)
222-qonun, reja `04-7-14M-pitch-reja.md` (m10-11: test s4 va kartochkalar olinadi, juftlik ekrani qo'shiladi). lessonId `pm-m10d11-v1` → **`pm-m10d11-v2`**. Zaxira `arxiv/F-1018-08-oldin/` (ishchi fayl — boshqa seansning F-1015-295 tuzatishlari bilan). Qurish `qurish/f1018h.py`.
Ustaxona 1–3 (s5–s7), tushuncha ekranlari (s2, s3), yakuniy savol (s8) — KODI O'ZGARMAGAN.

## Ekranlar (11)
| № | id | Ekran | O'quvchi | Ball / nishon |
|---|---|---|---|---|
| 1 | s0 | Kirish — o'quvchi pitchi va ikki son | so'rovnoma (ballsiz) | — |
| 2 | s1 | Reja | 4 qadam: da'volar · dalil · dalilsiz gapni qayta yozish · **sherikka 2 daqiqada aytish + Mentor bilan yakkama-yakka** | — |
| 3 | s2 | Da'vo va dalil | 4 gap: «Dalil bor / yo'q» | Claim Finder! |
| 4 | s3 | Son, manba, qachon | uch tanlov | Three Parts! |
| 5 | s5 | Ustaxona 1/3 — da'volaringiz | gaplarni belgilash | — |
| 6 | s6 | Ustaxona 2/3 — dalillar | har da'voga dalil | — |
| 7 | s7 | Ustaxona 3/3 — tuzatilgan pitch | qayta yozish / olib tashlash → saqlash (pm-m10d11-pitch) | Pitch Fixed! |
| 8 | s8 | Yakuniy savol | va'da o'rniga nima; RECAPS {7} | 1 (final, s8: 1) |
| 9 | sjuft | **Juftlik: tuzatilgan pitch sherikka (YANGI)** | chapda tuzatilgan pitch (PitchVaraq, artefaktdan; Mentor rejimida Mentor misoli) · o'ngda 2 daqiqa taymer → to'xtagach sherik har da'voga «✓ Dalil bor» / «✗ Dalil yo'q» (olib tashlangan da'volar ro'yxatga kirmaydi) → xulosa («N ta gapga Dalil yo'q — uyga vazifada…» / «Har gapda dalil bor») → «Davom etish». Pitch saqlanmagan bo'lsa — eslatma + «Pitchni saqlashga qaytish», Davom ochiq. Yakka rejimda o'zi belgilaydi. Ballsiz | **Pair Check!** (ACH_TRIGGERS sjuft) |
| 10 | podium | Natijalar / arena | QUIZ_BANK 12 (o'zgarmagan) | — |
| 11 | s11 | Yakun | holatga qarab sarlavha · «Endi siz bilasiz» · HwCard · nishonlar 4/4 | — |

## Olingan (12 → 11)
1-savol (s4) · kartochkalar · Date Check nishoni · 2 o'lik CSS klassi (15 qator).

## O'zgargan
SCREEN_META 11 · INLINE_KEYS {s8: 1} · RECAPS {7} · Q_LABELS {7} · `answers[5/6/7]` → `[4/5/6]` (s5 davolar, s6 dalillar, yakun holati) · REJA 4-qadam · ACHIEVEMENTS: dateCheck → pairCheck 🤝 · ACH_TRIGGERS {s2, s3, s7, sjuft} · ScreenJuftlik + CSS `.pd-jf-*` · root nav sodda, screens 11.
Mentor uchun: Ustoz eslatmasi — yakkama-yakka davomida qolganlar juftlikda (A 2 daq, B belgilaydi, almashadi ≈ 6 daq) = 1:1 + juftlik = 2 raund (222.1). MentorPracticeStats zona PRACTICE_BASE + 8.

## Sinov
- `npm run gates` **13/13** · `lint:jsx` 0.
- shots uz 11/11, ru 11/11, 390 px (1, 8, 10) toza.
- `sinov/juft-m1011.mjs` → `natija-m1011.txt`: pitch saqlanmagan → eslatma + Davom ochiq · pitch bor → «2 daqiqada ayting» (yopiq), 2 gap (olib tashlangan sanalmadi), chiplar yopiq → taymer → «Har gapni belgilang» → ✓/✗ → «Davom etish», xulosa «1 ta gapga…», earned [pairCheck], answers[8] va artefakt `juftlik` saqlandi → qayta ochilganda bor/yoq tiklanadi. pageerror 0.
- Suratlar `suratlar/m1011/` (uz, ru, 390, s08-boshida.png, s08-tugadi.png).

## Tuzoqlar
- Ekran kesilganda `answers[N]` indekslari ko'chadi — bu darsda 5 joy (ustaxona zanjiri bir-birini o'qiydi).
- `mss` bu faylda yo'q — mahalliy `mssJ`.
- Juftlik ekrani artefakt (pm-m10d11-pitch) bo'lmasa bloklamaydi (ballsiz, eslatma bilan).
