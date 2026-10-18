# YAKUNIY · m8-11 «Besh daqiqada nimani ko'rsatasiz?» (LMS 10-Modul 11-dars · src/8-Modull/PmPitchRehearsalLesson.jsx) — 17 → 11 · F-1018-06 · 2026-10-18
222-qonun, reja `04-7-14M-pitch-reja.md` (tasdiq: m7-12 pilot ma'qul → m8-11). lessonId `pm-m8d11-pitch-v1` → **`pm-m8d11-pitch-v2`**. Zaxira `arxiv/F-1018-06-oldin/`. Qurish `qurish/f1018f.py` (zaxiradan).
Ustaxona (s11), repetitsiya (s12), baholash varag'i (s8), besh slayd (s2), raqamlar slaydi (s6) — KODI O'ZGARMAGAN (QA'dan o'tgan); s13 ga 2-raund qo'shildi.

## Ekranlar (11)
| № | id | Ekran | O'quvchi | Ball / nishon |
|---|---|---|---|---|
| 1 | s0 | Kirish — 1 daqiqalik pitch va bo'sh 4 daqiqa | radio-variant (ballsiz) | — |
| 2 | s1 | Reja | 4 qadam: qaysi slaydlar qo'shiladi · raqamni zal ishonadigan qilib yozasiz · **besh slaydli pitchni sinfdoshga 5 daqiqada aytib, baholatasiz** · **eng zaif slaydni tuzatib, 1 daqiqada qayta aytasiz** | — |
| 3 | s2 | Besh slayd | bashorat → Raqamlar va Keyingi qadam qo'shiladi | — |
| 4 | s6 | Raqamlar slaydi | «17» → nimani sanadi · solishtirish · halol gap | — |
| 5 | s8 | Baholash varag'i — saralash | 5 gapni varaqqa / «Yozilmaydi»ga joylaydi | Feedback Sorter! |
| 6 | s9 | Yakuniy savol | qaysi fidbek yordam beradi; RECAPS {5} | 1 (final, s9: 2) |
| 7 | s11 | Mustaqil ish — besh slaydli pitch | 5 slayd formasi; artefakt pm-m8d11-pitch (maydonlar o'zgarmagan) | — |
| 8 | s12 | Repetitsiya (1-raund) | 5 daqiqa taymer → sinfdosh baholash varag'ini to'ldiradi | Five Minutes! |
| 9 | s13 | Tuzatish + **2-raund (YANGI)** | ✗ slaydni qayta yozadi → «Slaydga chiqarish» → **«2-raund: tuzatilgan slaydni sherigingizga 1 daqiqada qayta ayting»** (taymer «1 daqiqani boshlash» / «To'xtatish»; yakka rejimda «ovoz chiqarib») → to'xtagach xulosa «pitch sahnaga tayyor» · «Davom etish» faqat shundan keyin (oldin tugma «Qayta ayting (1 daqiqa)») | Pitch Fixed! (tuzatish) · **Second Take!** (2-raund, `achMiss.earn`) |
| 10 | podium | Natijalar / arena | QUIZ_BANK 12 (3/3/3/3) | — |
| 11 | s16 | Yakun | «Endi siz bilasiz» (Neon qatori → 2-raund qatori) · HwCard · nishonlar 4/4 | — |

## Olingan (17 → 11)
1-, 2-, 3-test (s3, s5, s7) · Airbnb keysi (s4 + 2-test) · Neon SQL kod yozish (s10: NeonMaket, S10_*, okrHozir, useSanoq) · kartochkalar (KARTOCHKALAR, ScreenFlashcards; HwCard saqlandi) · realNumber nishoni · 41 o'lik CSS klassi (87 qator, 2-o'tish: `.pr-ab-katta.on` kabi qo'shma selektorlar).

## O'zgargan
SCREEN_META 11 · SCREEN_INTENTS · INLINE_KEYS {s9: 2, beshSlayd, raqamlar, fidbek, practice, repetitsiya, tuzatish: −1} · RECAPS {5} · Q_LABELS {5} · REJA 2–4-qadam · s11: Neon soni faqat artefaktdan (`answers[10]` indeksi ko'chgan edi) · s13: `tm2 = usePitchTaymer`, `qayta`, `tayyor = done && qayta`, `.pr-s13-qayta` bloki, onAnswer `qayta: sek`, `pitchYoz({ qayta })` · root: `achMissVal.earn` (ekran ichidan ikkinchi nishon) · ACHIEVEMENTS: realNumber → secondTake 🔁 · QUIZ_BANK: q4 (Neon, D) → «nima uchun darhol qayta aytasiz» · q6 (Airbnb, B) → «juftlik qanday ishlaydi» · q7 (Airbnb, C) → «hamma ✓ — nimani tuzatasiz» · yakun RECAP 3-qatori · mentor/MentorNote s13.

## Sinov
- `npm run gates` **13/13** (tell: q4 to'g'ri javob qisqartirildi) · `lint:jsx` 0 · `lint:qolip` 0.
- `konveyer/vositalar/shots.mjs` uz 11/11, ru 11/11 pageerror yo'q; 390 px (1, 5, 7, 8) toza.
- `sinov/raund2-m811.mjs` (natija `sinov/natija-m811.txt`): tuzatishdan oldin «Bitta slaydni tuzating» (yopiq) → tuzatilgach «Qayta ayting (1 daqiqa)» (yopiq) + 2-raund bloki → taymer yurdi → to'xtagach «Davom etish» ochiq, xulosa, earned = [pitchFixed, secondTake], answers[8].qayta saqlandi → qayta ochilganda holat tiklanadi (Davom ochiq, taymer to'xtagan). pageerror 0.
- Suratlar `suratlar/m811/` (uz, ru, 390, s08-raund2*.png, s10-yakun.png).

## Tuzoqlar (keyingi darslar uchun)
- `answers[N]` bilan boshqa ekranga murojaat — ekran kesilganda indeks ko'chadi (s11 Neon'ni `answers[10]` dan o'qirdi) → artefakt/localStorage orqali o'qish.
- Bitta ekranda ikkinchi nishon: `ACH_TRIGGERS` bitta id/ekran — `achMissVal` ga `earn` qo'shib ekran ichidan chaqiriladi.
- O'lik CSS 1-o'tish faqat `.klass` bilan boshlanadigan selektorni oladi; `p.klass`, `.klass.on` kabilar 2-o'tishda.
- Sinovda `page.reload()` addInitScript'ni qayta yuradi (progress qayta yoziladi) — tiklanishni yangi kontekst bilan tekshirish.
