# YAKUNIY · m12-08 «Final pitchingiz 5 daqiqaga tayyormi?» (LMS 14-Modul 8-dars · src/12-Modull/PmFinalPitchLesson.jsx) — 12 → 11 · F-1018-15 · 2026-10-19
222-qonun + 222.7 (tekshiruv sahifasi — Demo Day 8 oldidan), reja `04-7-14M-pitch-reja.md`. lessonId `pm-m12d8-v1` → **`pm-m12d8-v2`**. Zaxira `arxiv/F-1018-15-oldin/` (ishchi fayl — QA seansining 2 qatorli tuzatishi bilan). Qurish `qurish/f1018n.py`.
Artefakt `pm-m12d8-final` — yangi maydon `tekshiruv: { holat, link }` (finalOl normallashtiruviga qo'shildi, aks holda keyingi yozuv o'chirardi).

## Ekranlar (11)
| № | id | Ekran | Ball / nishon |
|---|---|---|---|
| 1 | s0 | Kirish | — |
| 2 | s1 | Reja (4-qadam: «… keyin ilovangizni sahnaga tekshiring») | — |
| 3 | s2 | Savol-javob | Sharp Answer! |
| 4 | s3 | Tuzatish va taymer | — |
| 5 | s5 | Tuzatishlaringiz | Fix Applied! |
| 6 | s6 | 5 daqiqa — **1-raund** | Five Minutes! |
| 7 | s7 | Savol-javob mashqi — **2-raund** | Three Answers! |
| 8 | s8 | Yakuniy savol; RECAPS {7} | 1 (final) |
| 9 | stekshir | **Mahsulotingizda kamchilik bormi? (YANGI, 222.7)** — chapda «Ilovani ochish» (manzil m9-16 dagi `ilova` dan, tahrirlanadi), trek eslatmasi, 6-darsdagi demo ssenariysi (`pm-m12d6-demo.ssenariy`), yopiq Gemini so'rov namunasi; o'ngda uch tekshiruv bittadan (213.1): ilova ochildi · ssenariydagi asosiy harakat · savol-javob ekrani. «✗ Kamchilik bor» → VS Code + push, B-yo'l (`risklar[].bYol`) → «✓ To'g'rilandi». Ballsiz | — |
| 10 | podium | Arena (QUIZ_BANK o'zgarmagan) | — |
| 11 | s11 | Yakun; RECAP + «ilova telefonda tekshiriladi» | nishonlar 4 |

## Olingan
s4 test (KitobBozor) · kartochkalar · o'lik CSS 9 qator.

## Dizayn ko'rigi (suratdan keyin tuzatildi)
- Ssenariy raqamlari kartadan chiqib turardi → ro'yxat ichkarida.
- Telefonda uch tekshiruv ssenariy ostida, ekrandan tashqarida edi → tartib: ilova → tekshiruvlar → ssenariy (grid-areas).
- Qatorlar chegarasiz, holat fon bilan (213.3); bajarilgan tekshiruv bir qatorga yig'iladi.

## Sinov
- `npm run gates` **13/13** · `lint:jsx` 0 · shots uz 11/11, ru (1, 8, 10), 390 (8).
- `sinov/m1208.mjs` → `natija-m1208.txt`: bittadan ochilish, B-yo'l ko'rinadi, 3/3 → Davom, answers[8] va final.tekshiruv saqlandi, qayta ochilganda 3 yig'ilgan; ma'lumotsiz holatda eslatma, havola tugmasi yo'q. pageerror 0.
