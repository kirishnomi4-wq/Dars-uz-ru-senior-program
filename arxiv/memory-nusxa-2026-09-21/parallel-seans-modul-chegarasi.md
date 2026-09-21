---
name: parallel-seans-modul-chegarasi
description: Parallel seanslar turli modullarda ishlaydi — o'z modulingdan tashqaridagi faylga (hatto bir belgilik tuzatish uchun ham) qo'l tegizilmaydi
metadata:
  type: feedback
---

Bir vaqtda bir nechta Claude seansi turli modullar ustida ishlaydi. Seans faqat
o'ziga topshirilgan modul fayllarini tahrirlaydi. Boshqa moduldagi fayl buzuq
ko'rinsa ham — tuzatilmaydi, izoh ham qoldirilmaydi, faqat foydalanuvchiga aytiladi.

**Why:** boshqa seans o'sha faylni ayni damda tahrirlayotgan bo'ladi; yarim tayyor
holat normal. Tashqaridan tegish o'sha seansning ishini buzadi yoki konfliktga olib
keladi. 2026-08-19: `src/6-Modull/PmLesson24.jsx:563` da bir belgilik sintaksis
xatosi butun `vite build` ni to'sib turgan edi — foydalanuvchi «aralashma» dedi.

**How to apply:** bir modul ustida ishlaganda darvoza sifatida **butun-loyiha
`vite build`** ga tayanma — u boshqa modul tufayli qizil bo'lishi mumkin. O'rniga:
`npx esbuild <fayl>` (shu fayl) + `npm run lint:jsx` (natijani shu faylga filtrlab)
+ `npm run lint:til <fayl>`. Bular boshqa modullarga bog'liq emas.
Boshqa moduldagi nuqson topilsa — F-ID berib, faqat AYTILADI. [[diagnose-before-fix]]
