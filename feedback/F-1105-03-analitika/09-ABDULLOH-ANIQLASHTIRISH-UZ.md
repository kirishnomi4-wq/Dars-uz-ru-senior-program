# Abdullohga: JSON namunalaridan oldin uchta aniqlashtirish

**Sana:** 06.11.2026
**Kimga:** Abdulloh (LMS, CRM, School API)
**Kimdan:** JSX va Dars API jamoasi
**Asos:** sizning 06.11 dagi javobingiz — `07-ABDULLOH-JAVOBLAR-VA-QARORLAR-UZ.md`

Javob uchun rahmat, hammasi aniq. Qarorlaringizni qabul qildik, Shahzodaga ham yetkazamiz.
Uch hodisaning JSON namunalarini yozishdan oldin uchta kichik savol qoldi.

---

## 1. Learn qoidasi nega o'zgardi

Yangi qoida: o'quvchi arenaga kirishi bilan Learn avtomatik bajarilgan deb belgilanadi, ball shart emas (1-bo'lim, 2.5).

Shahzoda 05.11 da shunday yozgan edi: Learn oxirigacha yetmagan va past natijali o'quvchilar uchun muhim, «aynan shu o'quvchilar mavzuni yomonroq tushungan bo'ladi».
Yangi qoidada arenaga kirib, masalan, 2 ta to'g'ri javob bergan o'quvchi Learn'ni ko'rmaydi.

- **1.1.** Qoida nega o'zgardi? Shahzodaga sababini tushuntirmoqchimiz.
- **1.2.** Agar Shahzoda ball chegarasini qaytarishni so'rasa (masalan, kamida 7 ta to'g'ri javob), LMS tomonida bu mumkinmi?
  Bu holda bizning tomonda o'zgarish kam: ball arena yakuni hodisasida baribir bo'ladi.

---

## 2. «Arenaga kirish» qaysi lahza

Learn aynan shu hodisadan avtomatik hisoblanadi, shuning uchun lahza aniq bo'lishi kerak.

- **a)** o'quvchi «Tayyor» ekranidagi CodeStrike tugmasini bosgan lahza;
- **b)** arena boshlanib, birinchi savol o'quvchining ekraniga chiqqan lahza.

*Taklif:* **(b)**. Tugmani bosib, arena boshlanmasdan chiqib ketgan o'quvchi qatnashmagan hisoblanadi.
Arena boshlangandan keyin kirgan (kech qolgan) o'quvchi — o'zi kirgan lahzada, birinchi ko'rgan savoli bilan.

Hozirgi holat (tekshirildi): arenaga kirish hech qayerda yozilmaydi. Ishtirok faqat javoblar sonidan aniqlanadi (`played: answered > 0`).
2.8 da aytganingiz to'g'ri — kirish hodisasini biz yangidan qo'shamiz.

---

## 3. O'quv qismi coin'i

Javobingizda Learn coin'i va CodeStrike coin'i (javoblar, podium) haqida yozilgan. Darsning o'z testlari uchun beriladigan coin haqida yozilmagan.

- **3.1.** O'quv qismi coin'i qoidasi o'zgarmaydimi? *Taklif:* o'zgarmaydi — o'quv qismi natijasi hodisasida ketadi; bir o'quvchi, bir dars — bitta coin hodisasi (hozirgi qoida).
- **3.2.** Oxirigacha yetmagan o'quvchiga sessiya yopilganda (`completed: false`) shu paytgacha bergan to'g'ri javoblari uchun coin beriladimi?
- **3.3.** Learn va CodeStrike o'rtasidagi cheklovlar (1-bo'lim, 4–6-bandlar) o'quv qismi coin'iga tegmaydi — to'g'rimi?

---

## Keyingi qadam

Javobingizdan keyin uch hodisaning versiyalangan JSON namunalarini (majburiy maydonlar, id'lar, qabul javobi) tayyorlab yuboramiz.
Namunalar kelishilgach, ikki tomon ish hajmini baholab, muddatlarni beradi.
