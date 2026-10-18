# YAKUNIY · m12-02 «Mahsulotingiz hikoyasini qanday aytasiz?» (LMS 14-Modul 2-dars · src/12-Modull/PmStoryPitchLesson.jsx) — 15 → 10 · F-1018-12 · 2026-10-19
222-qonun, reja `04-7-14M-pitch-reja.md` (foydalanuvchi 19.10 tasdiqi). lessonId `pm-m12d2-v1` → **`pm-m12d2-v2`**. Zaxira `arxiv/F-1018-12-oldin/`. Qurish `qurish/f1018l.py`.
Artefakt `pm-m12d2-hikoya` formati o'zgarmadi; `video.qayta` (2-raund vaqti) qo'shildi. m12-05 o'qiydi — mos.

## Ekranlar (10)
| № | id | Ekran | O'quvchi | Ball / nishon |
|---|---|---|---|---|
| 1 | s0 | Kirish | so'rovnoma | — |
| 2 | s1 | Reja | 4-qadam: **telefonga, keyin sherikka** | — |
| 3 | royxatLahza | Ro'yxat va lahza | bashorat → 3 tugma | — |
| 4 | pitchdaHikoya | Hikoya pitchda | bashorat → 3 tugma | — |
| 5 | hikoya | Hikoyangiz (3 karta) | ustaxona | My Story! |
| 6 | video | Videoga yozish (1-raund) | rozilik → 1 daq taymer → «Video yozildi / Yozib bo'lmadi / Aytdim» | — |
| 7 | tekshirish | **2-raund: sherik tekshiradi (QAYTA QURILDI)** | 1 daq taymer (karta ichida) → to'xtagach uch savol ochiladi («Ha»/«Yo'q», «Taymerda: 0:58»), «Yo'q» → maslahat + «Kartani ochish»; juft/yakka/Mentor matni alohida. Oldin: video yozilmasa ekranda ish yo'q edi | Pair Check! |
| 8 | s11 | Yakuniy savol | videoda ro'yxat chiqsa; RECAPS {7} | 1 (final) |
| 9 | podium | Arena | QUIZ_BANK 12: iPhone 3 savoli → 2-raund (C), lahza (B), 1 daqiqa (D) | — |
| 10 | s14 | Yakun | sarlavha 2-raund natijasiga qarab (video shart emas) | nishonlar 2 |

## Olingan
iPhone keysi (s4, IphoneSahna, Brend, CSS) · 1-, 2-, 3-savol (s3, s5, s7) va ularning nishonlari (One Moment!, Fewer Buttons!) · kartochkalar · RECAP iPhone qatori → «ikki marta aytasiz» · o'lik CSS 47 qator.

## Dizayn ko'rigi (suratdan keyin tuzatildi)
- Taymer tugmalari kartadan tashqarida osilib turardi (213.13) → taymer kartasi ichiga.
- «Yo'q» qatorida savol raqami matndan alohida qatorga tushardi → grid.
- Yakka rejimda xulosa «Sherik … topdi» edi → yakka matni alohida; yakun sarlavhasi neytral.
- Savol qatorlari holati fon bilan, chegarasiz (213.3).

## Sinov
- `npm run gates` **13/13** · `lint:jsx` 0.
- shots uz 10/10, ru (1, 6, 9), 390 (6).
- `sinov/m1202.mjs` → `natija-m1202.txt`: chiplar taymergacha yopiq → taymer → «Taymerda: 0:02» → Ha/Yo'q/Ha → maslahat + «Kartani ochish» → Davom ochiq, earned [pairCheck], `video.qayta` saqlandi, qayta ochilganda 2/1, yakun sarlavhasi to'g'ri. pageerror 0.
