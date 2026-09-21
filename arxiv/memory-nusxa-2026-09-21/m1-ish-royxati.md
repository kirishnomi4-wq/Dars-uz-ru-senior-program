---
name: m1-ish-royxati
description: "1-Modul yaxshilash navbati (2026-08-03 o'lchovi) + Demo Day loyiha-ipi (ccDemoDay) qurilgan"
metadata: 
  node_type: memory
  type: project
  originSessionId: 776d6eda-d98b-4571-9ec8-1d3b1623b40d
  modified: 2026-08-03T15:34:31.315Z
---

2026-08-03 da 1-Modul ustida ish boshlandi, davomi keyingi seansda.

**Qurilgan va push qilingan (30a21e1):** Demo Day loyiha-ipi — yagona `ccDemoDay`
localStorage kaliti (TTLsiz): PmLesson1 yakunida yangi «Demo Day loyihasi» ekrani
(4 bank-g'oya + o'z g'oyasi) → VsCodeLesson'da «Mentor so'raydi» ekrani (tasdiqlash,
KFC-qoidasi, jonli MentorWorkStats) → DeployLesson'da ⭐ «Demo Day loyiham» birinchi
karta + AI-prompt sarlavhasi o'z yechimi → PmLesson3 nutq-ekranida eslatma.
GitLesson/PmLesson2 ataylab tegilmagan.

**Qolgan ish — M1 darslarini yangi qonunlarga (108–112) tortish.** O'lchov
(1280×720, yakun sahifasisiz): jami 27 TMI-ekran (>600 belgi), 96 ekranda mentor
>2 gap, 21 ekranda oshiq-toshiq >40px. Ish-navbati og'irligi bo'yicha:
1. m1-14 HtmlTakrorlash (7 TMI · 11 mentor · 3 oshiq)
2. m1-03 Htmllesson1 (4 · 9 · 2, bitta ekran 1004 belgi/219px)
3. m1-15 VsCodeLesson (4 · 8 · 2)
4. m1-10 CssPractice (2 · 10 · 2, 319px)
qolganlari: m1-01, m1-07, m1-08, m1-04 (mentor 11), m1-12, m1-05, m1-09.

**Usul (m2-09 tajribasi):** TMI kesish → mentor ≤2 gap → layout → darsni 0-ekrandan
haqiqiy bosishlar bilan o'tkazish (110-B: ko'rinish BOSILGANDAN keyin o'lchanadi,
chegara `.stage-content` cheti). Sweep-skript va o'lchov JSON scratchpad'da edi
(seans o'zgargan bo'lsa qayta yugurtirish oson — sweep-m1.mjs naqshi
[[boshqaruv-dispetcher]] retsept-C bilan ishlaydi).

Ochiq F-ID hisobi: F-0803-30 gacha band.
