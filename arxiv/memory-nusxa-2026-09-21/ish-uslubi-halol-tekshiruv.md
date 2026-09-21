---
name: ish-uslubi-halol-tekshiruv
description: "Foydalanuvchi talabi — halol, aniq, sifatli, shoshilmasdan; darvozani bazaga solishtirish, ko'z bilan ko'rish, tekshirilmaganni \"tekshirildi\" demaslik"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 954df238-7d6d-4ab4-9c90-160a7931bdd0
  modified: 2026-09-21T10:55:29.025Z
---

Foydalanuvchining takrorlangan talabi (2026-09-21): **«halol, aniq, sifatli, shoshilmasdan
ishla»**. Amalda bu quyidagilarni anglatadi:

1. **Darvoza yiqilsa — bazaga solishtir.** `til` va `dark` deyarli har faylda eski qarz sabab
   yiqiladi. `git show HEAD:<fayl> > /tmp/base.jsx` → ikkalasini lint qilib **farq 0** ekanini
   ko'rsat. «Yiqildi» deb qo'rqitma, «farq 0» deb ayt.
2. **Ko'z bilan ko'r.** Dizayn/maket qo'shganda `shot-screen.mjs` bilan skrinshot ol va
   **rasmni o'zing ko'r** — kod to'g'ri bo'lishi yetarli emas.
3. **Tekshirmaganni «tekshirildi» dema.** Halol chegarani ayt: «buni bugun qayta yurgizmadim,
   tungi natija shunday edi».
4. **Raqamni o'lchab ayt.** Taxminiy son berma; bergan bo'lsang va xato chiqsa — tuzat va
   sababini bir qatorda ayt (21.09: 27/35 → 30/35, sabab soxta grep-topilmasi).
5. **O'z taklifingni ham tekshir.** Maket yoki izoh qo'yganda **keyingi ekran nima
   so'rashini** ko'r — javobni oldindan aytib qo'ymaslik (KORPUS §186).
6. **Hujjat bilan kodni solishtir.** «Ochiq ish» ro'yxatlari eskiradi; ishni boshlashdan oldin
   kodda haqiqatan bajarilmaganini tasdiqla (21.09: 8 ta «ochiq» ekrandan 6 tasi allaqachon
   hal qilingan edi).
7. **`git add -A` ishlatma** — kerakli fayllarni nomma-nom qo'sh.

**Why:** foydalanuvchi natijani LMS'ga qo'lda yuklaydi va sinfda jonli o'tadi — noto'g'ri
«tayyor» degan xabar sinfda pul va vaqt yo'qotadi.

Bog'liq: [[holat-2026-09-21]] · [[prob-selektori-matnga-boglanmaydi]] · [[diagnose-before-fix]]
