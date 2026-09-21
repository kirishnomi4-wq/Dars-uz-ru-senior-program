---
name: progress-saqlov
description: "F-0730-01 — barcha 111 darsda localStorage ccProgress:<lessonId> sahifa-holat saqlovi (reload'da o'quvchi joyiga qaytadi)"
metadata: 
  node_type: memory
  type: project
  originSessionId: a66a011a-a533-44c2-b097-6969b8a2f413
  modified: 2026-07-30T08:24:22.772Z
---

2026-07-30 (F-0730-01): barcha darslarga (111 fayl) sahifa-holat saqlovi kiritildi — reload'da o'quvchi 1-ekranga tushib qolmaydi.

**Mexanizm:** localStorage kalit `ccProgress:<lessonId>`, qiymat `{screen, answers, earned, startedAt, total, savedAt}`. Har dars-faylda 4 joy: helper blok (progRead/progWrite/progClear, TTL 6 soat, total-mos-tekshiruv, try/catch) · lesson-root'da savedRef bir-martalik tiklash + jonli-o'quvchi clamp (lastScreen-1) · reset'da progClear + saqlash-effekti · finishLesson'da progClear.

**Yangi dars qurilganda shu naqsh MAJBURIY** — etalon: `src/pm/PmUserStoryLesson.jsx` (grep F-0730-01, 4 joy). Sof-PM darslarda (live/earned yo'q) clamp/earned qismlari tushiriladi.

**Ma'lum cheklov:** kompilator ichidagi topshirilmagan kod saqlanmaydi — faqat ekran-pozitsiya + qayd etilgan javoblar.

**Tekshiruv-usul:** playwright-core smoke (scratchpad'da edi) — saqlovga screen=5 yozib reload, effect qayta yozgan qiymat 5 bo'lsa PASS; TTL 7 soat eskirtirilsa 0 bo'lishi kerak.

Bog'liq: [[jonli-ball-tizimi]] (liveSession saqlovi bilan bir uslub), [[darslar-holati]].
