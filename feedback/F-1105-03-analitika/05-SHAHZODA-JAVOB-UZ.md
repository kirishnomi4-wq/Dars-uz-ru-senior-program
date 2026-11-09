# JSX darslar ma'lumoti: javob va qarorlar

**Kimga:** JSX darslar jamoasi
**Kimdan:** Shahzoda, o'quv bo'limining mahsulot jamoasi
**Sana:** 05.11.2026
**Javob:** «JSX darslar ma'lumoti: nima qabul qilindi va nimani aniqlashtiramiz» (05.11.2026) hujjatiga

---

## 1. «Qabul qilindi» qismi — ma'qul

1-qismni o'qib chiqdim, hammasi biz kutgandek. **1.1–1.9 bandlar ma'qul.** Faqat ikkita kichik aniqlik:

1. **1.1 — sessiya o'zi eskirib yopilishi.** Necha vaqtdan keyin yopiladi (soat yoki kun)? Shu vaqt reestrda yoki hujjatda yozilsin. Biz shu vaqtgacha ma'lumotni «hali kelmagan» deb hisoblaymiz.
2. **1.1 — Learn testi oxiriga yetmagan o'quvchiga ham ochilishi.** Abdulloh bilan tasdiqlangach, natijani yozing. Bu biz uchun muhim: aynan shu o'quvchilar mavzuni yomonroq tushungan bo'ladi.

---

## 2. Aniqlashtiramiz — javoblar

### 2.1. «Bajardim» qanday yoziladi

**2.1a. Javob: a)** — har qadamning «Bajardim»i alohida (qadam raqami va vaqti bilan), oxirgi qadam — «topshiriq bajarildi».
O'quvchi qaysi qadamda to'xtab qolgani ko'rinishi kerak.

**2.1b. Javob: b)** — tugma qo'shmaymiz. Ekran `kind: practice` bo'lib yoziladi: faqat ochilgan va o'tilgan vaqt, «bajardi» maydoni bo'sh (`null`).
«Keyingi»ni bosish «bajardi» degani emas — to'g'ri. Bunday ekranlar ro'yxatini ham, «bajarildi» deb belgilangan tugmalar ro'yxatini ham yuboring.

### 2.2. O'quvchi yozgan matnda ism bo'lishi mumkin

**Javob: a) va b) o'rtasidagi variant:**
- matn **faqat JSX bazasida** saqlanadi;
- CoddyCamp konnektoridagi ko'rinishga (view) **har bir o'quvchining matni chiqmaydi**;
- konnektorga faqat **umumlashgan ro'yxat** chiqadi: har topshiriq bo'yicha eng ko'p uchraydigan noto'g'ri javoblar — **kamida 5 ta o'quvchida bir xil bo'lganlari** va nechta o'quvchida uchragani.

Shunda tipik xatolar ko'rinadi, ism esa chiqmaydi: bir xil ism 5 ta o'quvchida takrorlanmaydi. Bizning qoidamiz «ism va kontakt yo'q, faqat id» buzilmaydi.

Agar bu qiyin bo'lsa — **b)**: matn saqlanmaydi, faqat «to'g'ri / noto'g'ri» va urinishlar.

### 2.3. Har yozuvda `lms_question_id` (14085 / 14086)

**Javob: a)** — A yo'ldagi ko'rinishda har yozuv yonida `lms_question_id` ustuni bo'ladi, reestrdan dars kodi va til bo'yicha qo'yiladi. Darsga tegilmaydi — yaxshi.

### 2.4. Arena savoli (`quiz-N`) → Learn savoli

**Javob: a)** — siz jadval berasiz: dars kodi, `quiz-N`, tartib raqami (1–12), uz matni, ru matni. CRM'dagi id'lar dashboardda **avtomatik** bog'lanadi: Learn testi (3170) ichidan tartib raqami bo'yicha. Qo'lda hech kim qidirmaydi.

CRM'da tartib ishonchli — tekshirdik. Netlify testida (3170):

| Til | `student_questions.id` | `order_number` |
|---|---|---|
| uz | 17935 – 17946 | 1 – 12 |
| ru | 17947 – 17958 | 13 – 24 |

Ya'ni `quiz-3` (4-savol) → uz **17938**, ru **17950**. Savollar matni ham sizning arena savollaringiz bilan mos keladi.

**Qoida ma'qul:** arena savoli o'zgarsa, Learn testi ham qayta yuklanadi va reviziya o'zgaradi. Iltimos, bunda **tartib raqamlari saqlansin** (uz 1–12, ru 13–24), aks holda moslik buziladi.

---

## 3. Keyingi qadam

1. Ishni boshlashingiz mumkin — 1-qism ma'qul, 2.1–2.4 bo'yicha qarorlar yuqorida.
2. Server tomoni va GW 69 tasdig'i — Abdulloh bilan.
3. Kutamiz:
   - har band bo'yicha muddat;
   - konnektor orqali o'zimiz tekshira boshlaydigan sana;
   - GW 69 (guruh 1030, 21.10.2026) bo'yicha tasdiq.
