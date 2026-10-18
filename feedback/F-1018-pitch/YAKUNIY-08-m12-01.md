# YAKUNIY · m12-01 «Investorga pitchni qanday tuzasiz?» (LMS 14-Modul 1-dars · src/12-Modull/PmInvestorPitchLesson.jsx) — 16 → 10 · F-1018-11 · 2026-10-19
222-qonun, reja `04-7-14M-pitch-reja.md` (foydalanuvchi 19.10: «pitchlarga tasdiq, rejalaring maqul — faqat qil, metodika va dizaynni ham ko'rib to'g'rila»). lessonId `pm-m12d1-v1` → **`pm-m12d1-v2`**. Zaxira `arxiv/F-1018-11-oldin/` (ishchi fayl — 7–14-M QA seansining 213-tuzatishlari bilan). Qurish `qurish/f1018j.py`.
Artefakt `pm-m12d1-pitch` formati o'zgarmadi (m12-02/05/08 o'qiydi); yangi maydon `sherik` qo'shildi (ixtiyoriy).

## Ekranlar (10)
| № | id | Ekran | O'quvchi | Ball / nishon |
|---|---|---|---|---|
| 1 | s0 | Kirish | so'rovnoma | — |
| 2 | s1 | Reja | 4-qadam: **qoralama + sherikka 2 daqiqada o'qish** | — |
| 3 | oltiBolak | Olti bo'lak | bashorat → 3 tugma | — |
| 4 | uchBolak | **Uch yangi bo'lak (YANGI, 3 ekran bitta)** | chip-qator (Bozor · Jamoa · Keyingi qadam) → har qism: bashorat → 3 bosish → xulosa → nav «Keyingi bo'lak: …» (213.1); bajarilgan chip ✓ va bosilsa qayta ochiladi | — |
| 5 | tartib | Mentor qoralamasi — tartib | 6 gap joylanadi | Right Order! |
| 6 | practice | Pitch qoralamasi (ustaxona) | 6 karta, artefakt | Six Parts! · Fresh Numbers! · Clear Ask! |
| 7 | sherik | **Sherikka o'qing (YANGI, 222.1 1-raund)** | chapda qoralama · o'ngda 2 daq taymer → sherik (investor) 6 savolga «✓ Javob bor / ✗ Javob yo'q» → xulosa bo'lak nomlari bilan, «Qoralamaga qaytib tuzatish». Qoralama yo'q — eslatma, Davom ochiq. Yakka rejim, Mentor rejimi (juftlik ko'rsatmasi + sanoq) | Read Aloud! |
| 8 | s12 | Yakuniy savol | Keyingi qadamda nima; RECAPS {7} | 1 (final) |
| 9 | podium | Arena | QUIZ_BANK 12 (Airbnb 2 savoli → Bozor savoli C · savol-javob D) | — |
| 10 | s15 | Yakun | holatli sarlavha, nishonlar 5 | — |

## Olingan
Airbnb keysi (s3) va uning ma'lumotlari (AIRBNB_KADR, SLAYD_NOM, Brend) · 1-, 2-, 3-savol (s4, s6, s8) · kartochkalar · o'lik CSS 18 qator. 2-raund — m12-02/05/08 da (reja: tuzilma darsi).

## Dizayn ko'rigi (suratdan keyin tuzatildi)
- «Keyingi bo'lak» tugmasi kontent ostida nav ortida qolardi → nav-tugmaning o'ziga ko'chdi.
- Eyebrow'dagi «(n/3)» mobilda ikki qatorga tushardi → olindi (sanoq navda).
- Sherik ekranida OltiBolakSahna taymer-chizig'i «5:00» ko'rsatardi (o'qish 2 daq) → olindi.
- Savol qatori 3 qavat edi → grid: nom + savol chapda, tugmalar o'ngda; mobilda ustma-ust. Chegara yo'q, holat fon bilan (213.3).

## Sinov
- `npm run gates` **13/13** · `lint:jsx` 0 (birinchi qurishda tell: arena 4-savol to'g'ri javobi uzun → «Savol-javob boshlanadi»).
- shots uz 10/10, ru (3, 6), 390 px (3, 6) toza.
- `sinov/m1201.mjs` → `natija-m1201.txt`: uch qism ketma-ket (nav «Keyingi bo'lak: Jamoa» → «… Keyingi qadam» → «Davom etish»), answers[3].qismlar 3, qayta ochilganda tiklanadi; sherik: qoralama yo'q → eslatma; bor → taymer → 6 belgi → xulosa «1 ta savolga javob yo'q: Jamoa», earned [readAloud], artefakt `sherik`, qayta ochilganda 5/1. pageerror 0.
- Suratlar `suratlar/m1201/`.
