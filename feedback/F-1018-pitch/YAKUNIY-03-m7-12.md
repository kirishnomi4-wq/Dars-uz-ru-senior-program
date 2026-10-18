# YAKUNIY · m7-12 «Pitchingizda kimning hikoyasi bor?» (src/7-Modull/PmUserStoryPitchLesson.jsx) — 16 → 10 · F-1018-05 · 2026-10-18 · 7–14-M PILOT
222-qonun, reja `04-7-14M-pitch-reja.md` (tasdiq: keys olinadi · tartib m7-12 pilot). lessonId `m7-12-v1` → **`m7-12-v2`**. Zaxira `arxiv/F-1018-05-oldin/`. Qurish `qurish/f1018e.py` (zaxiradan).
Ustaxona (s9), saralash (s4), uch slayd (s8), repetitsiya (s12) — KODI O'ZGARMAGAN (QA'dan o'tgan), faqat s12 ga 2-raund qo'shildi.

## Ekranlar (10)
| № | id | Ekran | O'quvchi | Ball / nishon |
|---|---|---|---|---|
| 1 | s0 | Kirish — «Maydon» pitchi, ikki slayd | ikki teng variantdan tanlaydi (ballsiz) | — |
| 2 | s1 | Reja | 4 qadam: raqam yonida nima · pitchga qaysi gap · **uch slaydga yozasiz** · **ikki marta ovoz chiqarib aytasiz: sinfdoshga, keyin tuzatib yana** | — |
| 3 | s2 | Raqam va hikoya | bashorat → qadamlar → slayd o'zgaradi, zal pufagi | — |
| 4 | s4 | Yozuvdan olingan gap — saralash | 6 gapni «yozuvda bor / yo'q» tomoniga joylaydi | Story Finder! |
| 5 | s8 | Uch slayd | 5 bo'lakni slaydlarga joylaydi | Pitch Builder! |
| 6 | s9 | Mustaqil ish — pitch yozish | 4 qator (odam kimligi, muammo, yechim, foydalanuvchi) → «Slaydga chiqarish»; artefakt pm-m7d12-pitch | Real Voice! |
| 7 | s11 | Yakuniy savol | foydalanuvchi slaydi haqida; RECAPS {6} | 1 (final, s11: 3) |
| 8 | s12 | Repetitsiya | **1-raund:** juftlikda 2 daq (A 1 + B 1) yoki yakka 1 daq → bir qator yozadi (sinfdosh qaysi odamni eslab qoldi) → **2-raund (YANGI):** «yozgan qatoringizni hisobga olib, pitchni yana 1 daqiqada ayting» taymeri; Davom shu raunddan keyin, tugma «Qayta ayting (1 daqiqa)» | Rehearsal Done! |
| 9 | podium | Natijalar / arena | QUIZ_BANK 12 (3/3/3/3) | — |
| 10 | s15 | Yakun | «Endi siz bilasiz» · HwCard uyga vazifa · nishonlar 4/4 | — |

## Olingan (16 → 10)
1-, 2-, 3-test (s3, s5, s7) · Canva keysi (s6) · Kod yozish HTML (s10 + HtmlCompiler importi, KOD_*) · kartochkalar (KARTOCHKALAR, ScreenFlashcards; HwCard saqlandi) · 29 o'lik CSS klassi (51 qator). 3 148 → 2 766 qator.

## O'zgargan
SCREEN_META 10 · INLINE_KEYS {s11: 3, saralash, slaydlar, practice, repetitsiya: −1} · RECAPS {6} · Q_LABELS {6} · REJA 3–4-qadam · s12: `vaqt2`, `tayyor = yozildi && vaqt2`, 2-raund bloki `.ps-s12-qayta`, mentor gapi «so'ng tuzatib yana bir marta ayting» · QUIZ_BANK: Melanie/Canva → «Repetitsiyada sherik bir daqiqa tinglaydi, keyin nima yozadi?» (correct 0) · root: FLASH_IDX olindi.

## Sinov
- `npm run gates` **13/13** · `lint:qolip` error 0 · `lint:jsx` 0 · tell/emoji farqi 0.
- `konveyer/vositalar/shots.mjs` uz 10/10, ru 10/10 pageerror yo'q; 390 px (1, 5, 7, 9) toza.
- `sinov/raund2-m712.mjs`: qator yozilgach 2-raund bloki + «Qayta ayting (1 daqiqa)» tugmasi (natija jurnalda).
- Suratlar `suratlar/m712/`.

## Tuzoqlar
1. Kartochka hududini kesishda chegara «YAKUN» emas, «UYGA VAZIFA — PM HwCard» — oraliqda HwCard turadi (undef tutdi).
2. `shots.mjs` ni bir vaqtda 2–3 nusxa yurgizish — qulaydi; ketma-ket yurgiziladi.
3. QReja qadamlari `REJA` massivida — olingan ekran (Canva) qadami ham olinadi, aks holda reja yolg'on aytadi.
