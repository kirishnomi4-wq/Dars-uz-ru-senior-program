# JSX darslar ma'lumoti: LMS tomoni bilan kelishilgan qoidalar va bitta o'zgarish

**Kimga:** Shahzoda, o'quv bo'limining mahsulot jamoasi
**Kimdan:** JSX darslar jamoasi
**Sana:** 06.11.2026
**Asos:** sizning 05.11 dagi javobingiz va Abdullohning 06.11 dagi javobi (LMS, CRM va School API tomoni)

---

## 1. Eng muhimi: Learn qoidasi o'zgardi

Siz bilan 05.11 da kelishgan edik: Learn testi oxirigacha yetmagan o'quvchiga ham ochiladi. Bu qoida saqlandi.
Lekin LMS tomoni Learn qachon **yopilishini** o'zgartirdi.

| | Oldin | Endi (Abdulloh, 06.11) |
|---|---|---|
| Learn qachon ochiladi | arena natijasiga qarab (dars natijasidagi `codestrike` bloki, faqat «Darsni yakunlash» bosilganda ketardi) | **darhol**, arenani kutmasdan, hamma o'quvchiga, oxirigacha yetmaganlarga ham |
| Learn qachon avtomatik bajarilgan deb belgilanadi | arenada kamida 7 ta to'g'ri javob | **o'quvchi arenaga kirishi bilan**. Ball shart emas: kirib, birorta ham javob bermagan o'quvchi ham qatnashgan hisoblanadi |
| Belgilangandan keyin | Learn yashiriladi, keyingi dars ochiladi | xuddi shunday |

**Nega o'zgardi.** Bu LMS tomonining qarori. Abdullohning hujjatida sabab alohida yozilmagan.
Fakt shunday: arena va Learn savollari — bir xil 12 ta savol (siz 05.11 da tekshirgansiz: Netlify, 3170).
Ya'ni arenaga kirgan o'quvchi Learn'dagi savollarning o'zini sinfda yechadi.
Sababini Abdullohdan alohida so'radik, javobini sizga yetkazamiz.

**Sizga ta'siri.** 05.11 da yozgan edingiz: «aynan shu o'quvchilar mavzuni yomonroq tushungan bo'ladi».
Yangi qoidada arenaga kirib, masalan, 2 ta to'g'ri javob bergan o'quvchi Learn'ni ko'rmaydi.
Uning tushunishi faqat arena javoblaridan ko'rinadi. Arena javoblari har savol bo'yicha ko'rinishda (view) bo'ladi, `quiz-N` → Learn savoli bog'lanishi bilan.
Arenaga kirib, javob bermagan o'quvchi bo'yicha savol-javob ma'lumoti bo'lmaydi — faqat «kirdi, 0 javob».

Bu bo'yicha savolimiz 4-bo'limda (4.1).

---

## 2. Coin qoidalari (LMS tomoni)

1. O'quvchi Learn'ni o'zi bajarib bo'lgan bo'lsa — CodeStrike uchun coin berilmaydi (javoblar uchun ham, podium uchun ham).
2. CodeStrike uchun coin berilgan bo'lsa — Learn uchun coin berilmaydi.
3. Learn arena sababli avtomatik bajarilgan bo'lsa — Learn coin bermaydi, CodeStrike coin'ini ham to'smaydi.
4. Learn'ni arenadan oldin boshlagan o'quvchi uni tugatishi mumkin. Arenaga kirgandan keyin Learn'da yangi urinish boshlanmaydi.
5. **Birinchi yakunlangan arena hisobga olinadi.** Keyingi o'yinlar — mashq: natija va coin o'zgarmaydi, birinchi arena 0 coin bergan bo'lsa ham.

Ko'rinishda «Learn o'zi bajarildi» va «arena sababli avtomatik hisoblandi» alohida ajratiladi.

---

## 3. Ma'lumot qanday keladi

### 3.1. Uch alohida hodisa

Oldin sessiyaga bitta xabar ketardi. Endi har o'quvchi uchun uch xil hodisa yoziladi:

| Hodisa | Qachon |
|---|---|
| **O'quv qismi natijasi** | o'quvchi oxirgi ekranga birinchi marta yetganda — darhol, mentorni va sinfni kutmasdan. Oxirigacha yetmagan o'quvchiga — sessiya yopilganda, `completed: false` va qaysi ekrangacha yetgani bilan |
| **Arenaga kirish** | o'quvchi arenaga kirganda (Learn shu hodisadan avtomatik hisoblanadi) |
| **Arena yakuni** | arena tugaganda: har savol bo'yicha javob, ball, podium |

Arena yakunida uch holat ajratiladi:
- arena natijasi **hali yo'q**;
- arena tugadi, o'quvchi **qatnashmadi**;
- o'quvchi **kirdi, lekin javob bermadi** (qatnashgan, natija 0).

Oxirigacha yetmagan o'quvchining Class darsi yolg'ondan «bajarildi» deb belgilanmaydi.
Orqaga qaytib bergan javoblar bazada saqlanadi, lekin birinchi natija va uning coin'i qayta hisoblanmaydi.
«Darsni yakunlash» tugmasi faqat darsdan chiqish uchun qoladi — natija bu tugmani kutmaydi.

### 3.2. Ma'lumot qachongacha «hali kelmagan» (05.11 dagi 1.1-savolingiz)

| Holat | Vaqt chegarasi |
|---|---|
| Mentor arenani yopmasa | oxirgi savol vaqti tugaganidan 1 daqiqa keyin arena o'zi yakunlanadi |
| Arena uzog'i bilan | ishga tushganidan 45 daqiqa |
| Jonli sessiya uzog'i bilan | boshlanganidan **2 soat** (dars 90 daqiqa + 30 daqiqa zaxira), mentor ekrani ochiq qolsa ham |

Qaysi chegara oldin kelsa, o'shasi ishlaydi. Demak, jonli dars ma'lumoti **sessiya boshlanganidan ko'pi bilan 2 soat ichida** yakunlanadi
(yetkazishdagi texnik qayta urinishlar bundan tashqari).
Mentor ekrani yopilsa, sessiya bundan oldinroq yopiladi. Bu vaqtning prod'dagi aniq qiymatini biz o'z serverimizdan tekshirib, alohida yozamiz.
Uyda (solo) urinishning yopilish muddatini ham shu yerda yozamiz.

### 3.3. Learn savollarining id'lari (05.11 dagi 2.4)

- CRM'da savolni mavjud id bilan tahrirlash mumkin — shunda id o'zgarmaydi.
- Savol arxivlanib, yangisi yaratilsa — yangi id beriladi (02.11 dagi Pre-Demo o'zgarishida shunday bo'lgan).
- **Joriy** savollar uchun faqat Active savollar olinadi.
- **Tarixiy** natijalar o'sha paytdagi asl savol id'siga bog'lanib qoladi. Arxivdagi savollarni tarixiy tahlildan chiqarib tashlamang.

Shuning uchun biz beradigan `quiz-N` → Learn jadvalida tartib raqamidan tashqari **til** va **savol versiyasi** ustunlari ham bo'ladi.

### 3.4. Nega CRM'da hozir hech narsa ko'rinmayapti

CRM'dagi mavjud statistika boshqa yo'l bilan yoziladi. Bizning server yuborgan xabar School API'ga yetib borgani `jsx_lesson_*` jadvallari to'lganini anglatmaydi.
Siz bilan kelishilgan A yo'lda ma'lumot bizning bazadagi tayyor ko'rinishlardan (view) olinadi.
`jsx_lesson_*` jadvallarining holatini Abdulloh tomoni alohida tekshiradi.

---

## 4. Savollarimiz

**4.1. Learn yangi qoidasi sizga ma'qulmi?** (1-bo'lim)
- **a)** Ma'qul. Arenaga kirgan o'quvchining tushunishini arena javoblaridan ko'ramiz.
- **b)** Ma'qul emas — arenada past ball olgan o'quvchiga Learn ochiq qolishi kerak. Unda buni siz Abdulloh bilan hal qilasiz (masalan, ball chegarasini qaytarish); biz qaroringizga qarab ishlaymiz.

**4.2. GW 69 tekshiruvi.** LMS tomonida bizning sessiyalar va yuborilgan xabarlar ro'yxati yo'q, shuning uchun eksportni (ism va kontaktsiz) biz tayyorlaymiz.
Buning uchun testi «yopiq» qolgan **5 ta o'quvchining LMS id'larini** yuboring.

---

## 5. Keyingi qadamlar va muddatlar

1. **Uch hodisaning JSON namunalari.** Kod yozishdan oldin biz va Abdulloh har hodisaning maydonlari, id'lari va qabul javobini kelishamiz. Bu bizning navbatdagi ishimiz.
2. **Muddatlar** — namunalar kelishilgandan keyin. Ikki tomon ish hajmini baholab, sanalarni beradi. Hozircha aniq sana yo'q.
3. **Konnektor:** bazaga faqat o'qish uchun ulanishni Abdulloh tomoni tashkil qiladi, ko'rinishlarni (view) biz yozamiz. Ulanish parametrlari va view'lar ro'yxati texnik sozlashda kelishiladi.
4. **Chiqarish:** avval QA'da bitta dars bilan to'liq sinov. Qabuldan keyin 172 dars bir yo'la, dars vaqtidan tashqarida chiqariladi. Alohida pilot bosqichi bo'lmaydi.
5. **Siz so'ragan ro'yxatlar** (05.11, 2.1b): «Bajardim» tugmasi bor practice ekranlar va tugmasiz practice ekranlar — tayyorlab, alohida yuboramiz.

Avval kelishilganlar o'zgarmaydi: ism va kontakt chiqmaydi, faqat id; o'quvchi matni faqat bizning bazada, konnektorga faqat kamida 5 o'quvchida takrorlangan noto'g'ri javoblar; tekshiruvsiz practice'da `correct: null`; eski yozuvlarda `opened_at: null`; vaqtlar UTC, ISO-8601.
