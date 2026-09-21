---
name: savolda-tugmani-aniq-ayt
description: "Foydalanuvchiga qaror-savoli berganda UI-so'zni (masalan «Qaytadan») qaysi ekrandagi qaysi tugma ekanini aniq aytish — bir xil nomli ikki narsa bo'lishi mumkin"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c5acb657-104c-43ee-9591-0d5d526b0ab1
  modified: 2026-09-18T08:59:49.376Z
---

Qaror-savolida UI-atama ishlatilsa, u **qaysi ekrandagi qaysi tugma** ekani va bosilganda nima bo'lishi bir jumlada aytiladi; bir xil nomli narsa ikkita bo'lsa — ikkalasi yonma-yon ko'rsatiladi.

**Why:** 2026-09-18 (F-0918-04) — men «"Qaytadan" bosilganda nishon imkoni qaytsinmi?» deb so'radim (yakun ekranidagi, butun darsni qayta boshlaydigan tugma), foydalanuvchi esa topshiriq ICHIDAGI qayta urinishni tushunib «qaytmasin» dedi. Natijada noto'g'ri tomonga kod yozildi, keyin qayta tushuntirish va qayta ishlash kerak bo'ldi. Foydalanuvchi haqiqiy maqsadini faqat uchinchi xabarda aytdi: «bir darsdan faqat bir marta jo'natamiz, bo'lmasa nishonlar ko'payib ketadi» — ya'ni uni tugma emas, LMS'ga nima ketishi qiziqtirardi.

**How to apply:** savoldan oldin kodda shu nomli boshqa boshqaruv bor-yo'qligini tekshir; savolni «hozir → taklif» jadvali bilan ber; foydalanuvchi javobi kutilganidan boshqacha tuyulsa — ishga tushishdan oldin uning MAQSADINI (nima bo'lishidan qo'rqyapti) bir jumlada qaytarib so'ra. Bog'liq: [[diagnose-before-fix]].
