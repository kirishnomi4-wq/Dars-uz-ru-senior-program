# YAKUNIY · m10-12 «Raqamlaringiz zalni ishontiradimi?» (LMS 12-Modul 12-dars · src/10-Modull/PmGrowthPitchLesson.jsx) — 16 → 11 · F-1018-09 · 2026-10-18 (avtopilot)
222-qonun, reja `04-7-14M-pitch-reja.md` (QAROR 2: s9 grafik kodi QOLADI; keys Uzum olinadi). lessonId `pm-m10d12-v1` → **`pm-m10d12-v2`**. Zaxira `arxiv/F-1018-09-oldin/` (ishchi fayl — boshqa seansning F-1015-295 tuzatishlari bilan). Qurish `qurish/f1018i.py`.
Besh bo'lak (s2), grafik (s4), jonli demo (s8), kod yozish (s9), ustaxona (s10), juftlik (s11: Ayting · Baholang · Tuzating), yakuniy savol (s12) — KODI O'ZGARMAGAN; s11 ga 4-qadam qo'shildi.

## Ekranlar (11)
| № | id | Ekran | O'quvchi | Ball / nishon |
|---|---|---|---|---|
| 1 | s0 | Kirish | so'rovnoma (ballsiz) | — |
| 2 | s1 | Reja | 4 qadam: sonlar qayerda · grafik halol · **grafikni o'z sonlaridan chizib, pitchni besh bo'lakka yozing** · **sherikka 5 daq aytib, tuzatib 1 daq qayta ayting** | — |
| 3 | s2 | Besh bo'lak | bashorat → Raqamlar bo'lagi | — |
| 4 | s4 | O'sish grafigi | buzilgan → to'liq | — |
| 5 | s8 | Jonli demo | 3 tugma | — |
| 6 | s9 | Kod yozish: o'sish grafigi (QKod + HtmlCompiler) | o'z sonlaridan grafik | Growth Chart! |
| 7 | s10 | Pitch yozish (ustaxona) | besh bo'lak; artefakt pm-m10d12-pitch | Five Parts! |
| 8 | s11 | Juftlikda pitch | Ayting 5 daq → Baholang → Tuzating → **4-qadam (YANGI): «2-raund: o'zgartirilgan bo'lakni sherigingizga 1 daqiqada qayta ayting»** (taymer; yakka rejimda «ovoz chiqarib»); mentor matni 3 holat; «Davom etish» faqat shundan keyin («Qayta ayting (1 daqiqa)») | Live Pitch! · Part Fixed! · **Second Take!** (EarnCtx) |
| 9 | s12 | Yakuniy savol | sekinlashuv va halol gap; RECAPS {8} | 1 (final, s12: 1) |
| 10 | podium | Natijalar / arena | QUIZ_BANK 12 («Uzum qachon ishga tushgan?» → 2-raund savoli, A) | — |
| 11 | s15 | Yakun | holatga qarab sarlavha · «Endi siz bilasiz» · HwCard · nishonlar 5/5 | — |

## Olingan (16 → 11)
1-, 2-, 3-savol (s3, s5, s7) · Uzum keysi (s6) · kartochkalar · 21 o'lik CSS klassi (40 qator). `Uz`/`uzAjrat` yordamchilari qoldi (ishlatilmaydi — zararsiz).

## O'zgargan
SCREEN_META 11 · INLINE_KEYS {s12: 1, beshBolak, grafik, demo, kod, practice, juftlik: −1} · RECAPS {8} · Q_LABELS {8} · yakun `answers[10]`→`[6]`, `answers[9]`→`[5]` · REJA 3–4-qadam · s11: `tm2`, `yur2`, `aytildi`, `tayyor`, `boshla2/toxtat2` (saqlaKalit qayta, onAnswer qayta, earn secondTake), `mGapQ`, `.gp-s11-qayta` bloki · ACHIEVEMENTS + secondTake 🔁 · root nav sodda, screens 11 · CSS `.gp-s11-q*`.

## Sinov
- `npm run gates` **13/13** · `lint:jsx` 0.
- shots uz 11/11, ru 11/11, 390 px (1, 7, 10) toza.
- `sinov/raund2-m1012.mjs` → `natija-m1012.txt`: bo'lak o'zgartirilgan holatda «Qayta ayting (1 daqiqa)» (yopiq) + 2-raund bloki, mentor «Bo'lak o'zgartirildi: endi…» → taymer → to'xtagach «Davom etish», xulosa, earned [livePitch, partFixed, secondTake], answers[7].qayta → qayta ochilganda tiklanadi. pageerror 0.
- Suratlar `suratlar/m1012/` (uz, ru, 390, s07-raund2*.png).
