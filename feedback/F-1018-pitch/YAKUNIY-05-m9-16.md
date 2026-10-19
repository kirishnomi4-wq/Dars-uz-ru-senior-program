# YAKUNIY · m9-16 «G'oyangiz va ilovangiz guruhni ishontiradimi?» (LMS 11-Modul 16-dars · src/9-Modull/PmPrototypePitchLesson.jsx) — 16 → 11 · F-1018-07 · 2026-10-18
222-qonun, reja `04-7-14M-pitch-reja.md` (tasdiq: «manga maqul ruxsat»). lessonId `pm-m9d16-v1` → **`pm-m9d16-v2`**. Zaxira `arxiv/F-1018-07-oldin/`. Qurish `qurish/f1018g.py` (zaxiradan).
Ustaxona (s10), juftlik (s11: Ayting · Baholang · Tuzating), to'rt bo'lak (s2), muammo va dalil (s4), jonli demo (s8) — KODI O'ZGARMAGAN; s11 ga 4-qadam, yangi ScreenIlova qo'shildi.

## Ekranlar (11)
| № | id | Ekran | O'quvchi | Ball / nishon |
|---|---|---|---|---|
| 1 | s0 | Kirish — zal 3 daqiqada nimani ko'rmoqchi | radio-variant (ballsiz) | — |
| 2 | s1 | Reja | 4 qadam: muammo dalil bilan · mahsulot bir gapda · **pitchni sherikka 3 daq aytib, baholatib, tuzatib 1 daq qayta ayting** · **ilovani Demo Day oldidan telefonda tekshiring** | — |
| 3 | s2 | To'rt bo'lak | Mentor pitchi yig'iladi, taymer bo'linadi | — |
| 4 | s4 | Muammo va dalil | sanoq va harakat belgisi jadvaldan bo'lakka | — |
| 5 | s8 | Jonli demo | kutish yozuvi → asosiy harakat → sinovdagi tuzatish | — |
| 6 | s10 | Pitch yozish (ustaxona) | to'rt bo'lak; artefakt pm-m9d16-pitch (maydonlar o'zgarmagan; `demo.son` endi faqat artefaktdan) | Four Parts! |
| 7 | s12 | Yakuniy savol | son va unga nima kirgani (kitob almashish ilovasi); RECAPS {6} (1-karta: «Database'dagi son hamma yozuvni sanaydi») | 1 (final, s12: 0) |
| 8 | s11 | Juftlikda pitch | Ayting 3 daq → Baholang (varaq) → Tuzating → **4-qadam (YANGI): «2-raund: tuzatilgan bo'lakni sherigingizga 1 daqiqada qayta ayting»** (taymer «1 daqiqani boshlash» / «To'xtatish»; yakka rejimda «ovoz chiqarib») → xulosa «pitch sahnaga tayyor»; «Davom etish» faqat shundan keyin (oldin «Qayta ayting (1 daqiqa)») | Three Minutes! · Fixed It! · **Second Take!** (`data.nishon`) |
| 9 | silova | **Ilovangizda kamchilik bormi? (YANGI, 222.7)** | chapda: manzil maydoni (artefakt `ilova`), «Ilovani ochish», Render eslatmasi («2–3 daqiqa oldin oching»), mobil trekda Expo Go eslatmasi, Gemini so'rov namunasi (nusxalash); o'ngda 3 tekshiruv kartasi (ilova ochildi · asosiy harakat ishlaydi · sinovdagi tuzatish ko'rinadi), har biriga «✓ Joyida» / «✗ Kamchilik bor» → «VS Code'da to'g'rilang, push» → «✓ To'g'rilandi»; 3/3 → xulosa, «Davom etish». Ballsiz | — |
| 10 | podium | Natijalar / arena | QUIZ_BANK 12 (3/3/3/3) | — |
| 11 | s15 | Yakun | «Endi siz bilasiz» (Database qatori → 2-raund + ilova tekshiruvi) · HwCard · nishonlar 4/4 | — |

## Olingan (16 → 11)
1-, 2-, 3-test (s3, s5, s7) · iPhone keysi (s6) · Neon SQL (s9: NeonMaket, S9_*, useSanoq) · kartochkalar · honestCount nishoni · 68 o'lik CSS klassi (93 qator).

## O'zgargan
SCREEN_META 11 (s12 yakuniy savol juftlikdan OLDIN) · SCREEN_INTENTS · INLINE_KEYS {s12: 0, bolaklar, dalil, demo, practice, juftlik: −1} · RECAPS {6} · Q_LABELS {6} · REJA 3–4-qadam · s10 `answers[9]` o'rniga artefakt · s11: `tm2`, `yur2`, `aytildi`, `tayyor`, `boshla2/toxtat2`, `.pt-s11-qayta`, mentorT 3 holat, MentorNote 2-raund · ScreenIlova + CSS `.pt-ilova-*` · root: nav sodda, screens 11 · yakun `answers[11]` → `answers[7]` · ACHIEVEMENTS: honestCount → secondTake 🔁, ACH_TRIGGERS {} · QUIZ_BANK q5 (Jobs, C) → «nima uchun darhol qayta aytasiz», q6 (Apple, A) → «Demo Day oldidan nimani tekshirasiz» · yakun RECAP 4-qatori.

## Sinov
- `npm run gates` **13/13** · `lint:jsx` 0 (INLINE_KEYS'dan ortiqcha `ilova` kaliti olindi — ScreenIlova submitAnswer qilmaydi) · emoji-lint: «↗» olindi.
- `konveyer/vositalar/shots.mjs` uz 11/11, ru 11/11, 390 px (1, 7, 8, 10) toza.
- `sinov/raund2-m916.mjs` → `natija-m916.txt`: s11 tuzatilgan holatda «Qayta ayting (1 daqiqa)» (yopiq) + 2-raund bloki → taymer → to'xtagach «Davom etish», earned [threeMinutes, fixedIt, secondTake], answers[7].qayta saqlandi, qayta ochilganda tiklanadi → ScreenIlova: «Tekshiring (0/3)» → manzil → havola https://… → ✓ / ✗ → «To'g'rilandi» → 3/3 «Davom etish», answers[8].ilova va artefakt `ilova` saqlandi, qayta ochilganda havola tiklanadi. pageerror 0.
- Suratlar `suratlar/m916/` (uz, ru, 390, s07-raund2*.png, s08-ilova-tugadi.png).

## Tuzoqlar
- Regex bilan o'zgaruvchi nomini almashtirish (`\bqayta\b`) o'quvchi matni («qayta ayting») va CSS-klass nomini ham almashtirdi — faqat kod-tokenlarga tegish, keyin grep.
- Playwright `text=Davom etish` Mentor matnidagi «Davom etish»ni ham oladi — tugma `locator('button', { hasText })`.
- QMustaqil: keng maydon `qadamlar`da, `forma` tor ustun (q-col) — 2 ustunli grid `qadamlar`ga.
- Ilova manzili oldingi darslarda saqlanmagan — o'quvchi qo'li bilan, artefakt `pm-m9d16-pitch.ilova`.
