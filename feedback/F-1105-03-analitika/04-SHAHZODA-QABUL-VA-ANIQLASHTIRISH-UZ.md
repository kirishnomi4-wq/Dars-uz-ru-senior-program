# JSX darslar ma'lumoti: nima qabul qilindi va nimani aniqlashtiramiz

**Kimga:** Shahzoda, o'quv bo'limining mahsulot jamoasi
**Kimdan:** JSX darslar jamoasi
**Sana:** 05.11.2026
**Javob:** «Ответы продуктовой команды: данные JSX-уроков» (05.11.2026) hujjatiga

> **Iltimos, javobni o'zbek tilida yozing.** Javobni AI yordamida tayyorlasangiz, unga ham o'zbek tilida yozishni ayting.

---

Javoblaringiz uchun rahmat. Rad etilgan band yo'q, qo'shimcha talablaringiz ham qabul qilindi.
Quyida ikki qism bor:

1. **Qabul qilindi** — har band qanday ishlashi. O'qib chiqing: biror joy siz kutgandek bo'lmasa, ayting.
2. **Aniqlashtiramiz** — 4 ta savol. Ular bo'yicha bitta qaror kerak.

«Hammasi ma'qul» desangiz, ishni boshlaymiz. Server tomonini (ma'lumot qanday ketishi, bazaga kirish) Abdulloh bilan alohida kelishamiz.
Muddatlarni ikkala javobdan keyin aytamiz.

---

## 1. Qabul qilindi — qanday bo'ladi

### 1.1. Natija avtomatik ketadi — tugmaga bog'liq emas

| Holat | Nima ketadi |
|---|---|
| O'quvchi darsning oxirgi ekraniga yetdi | Dars natijasi darhol ketadi (CodeStrike'siz) |
| Mentor jonli darsda arenani yopdi | Darhol CodeStrike natijasi ketadi |
| O'quvchi oxirgi ekranga yetmadi | Mentor sessiyani yopganda uning ma'lumoti ham ketadi. Mentor yopmasa, sessiya o'zi eskirib yopilganda ketadi |

Har o'quvchi bo'yicha qo'shiladi:
- `reached_end` — oxirgi ekranga yetdimi, qachon yetdi;
- yetmagan bo'lsa — qaysi ekrangacha yetgani, masalan **20 tadan 14-ekran**.

**Learn testi oxiriga yetmagan o'quvchiga ham ochilishi** (sizning 1.3-bandingiz) LMS tomonida qilinadi. Biz signal beramiz, ochishni LMS hal qiladi. Buni Abdulloh bilan tasdiqlab, sizga yozamiz.

### 1.2. Topshiriqning doimiy kaliti

- Format: `<dars kodi, -vN siz>:<topshiriq kaliti>`, masalan `netlify-deploy:what-netlify-does`.
- **Uz va ru versiyalarda kalit bitta.** Dars bitta, o'quvchi faqat tilni almashtiradi.
- Savol so'zi yoki variantlar tartibi o'zgarsa, ma'nosi o'sha bo'lsa — **kalit o'zgarmaydi**.
- **Reviziya** (`revision`) — savol va variantlar matnining (uz + ru) qisqa xeshi. Matn tahrirlansa, reviziya o'zgaradi. Bitta kalit bo'yicha tahrirdan oldingi va keyingi ma'lumotni shu bilan ajratasiz.
- «Eski id (`s4`) → yangi kalit» jadvali **JSON va CSV** ko'rinishida, har dars va versiya bo'yicha, `LMS_REESTR.json` yonida turadi.

### 1.3. Practice va kod topshiriqlari

| Turi | Nima yoziladi |
|---|---|
| Tekshiruvsiz practice (VS Code, Gemini) | «Bajardim» bosilgani va vaqti. `correct` — **bo'sh (`null`)**, `false` emas |
| Tekshiriladigan topshiriq (kod, teg, xato topish, tartibga terish) | Har «Tekshirish» bosilishi — bitta urinish. `correct` — birinchi tekshiruv o'tdimi. `solved` — oxirida o'tdimi |
| O'tkazib yuborilgan topshiriq | `skipped` ro'yxatiga tushadi (practice ham) |

O'quvchi yozgan matn (300 belgigacha) faqat tekshiriladigan topshiriqlarda saqlanadi. Bu yerda bitta savol bor — 2.2.

### 1.4. Vaqtlar

- `opened_at` — topshiriq qachon ochilgani. Yangi versiya yuklangan kundan boshlab yoziladi. Eski ma'lumotda **bo'sh (`null`)** bo'ladi — 0 ham emas, javob vaqti ham emas.
- Har darsning yangi versiyasi qachon yuklangani reestrda yoziladi.
- Barcha vaqtlar UTC'da, ISO-8601 formatida.

### 1.5. Id'lar va reestr

Reestrda har dars uchun shular bo'ladi:

| Maydon | Netlify darsi misolida |
|---|---|
| Dars kodi | `netlify-deploy-v19` |
| JSX dars, uz (`student_questions.id`) | 14085 |
| JSX dars, ru (`student_questions.id`) | 14086 |
| Class darsi (`student_lessons.id`) | 2429 |
| Learn testi (`student_lessons.id`) | 3170 |
| Yangi versiya yuklangan sana | yuklangan kuni |

Class → Learn mosligi bizda 172 dars bo'yicha bor (29.10 da Learn testlarini yuklaganimizdan).

### 1.6. CodeStrike (arena)

- `joined` — birinchi savolni ko'rdi.
- `answered` — nechta savolga javob berdi (son).
- To'liq o'rin (1, 2, 3, 4 …) — eski qoida bo'yicha: ko'proq to'g'ri javob → yuqori; teng bo'lsa — kam umumiy vaqt; u ham teng bo'lsa — kim oldin kirgan. Javob bermaganlarda o'rin bo'sh (`null`).
- Har sessiyada **o'rin olganlar soni** — «11 tadan 4-o'rin» deb o'qish uchun.

### 1.7. Til

Savol matni o'quvchi o'tgan tilda saqlanadi, yonida `lang` bo'ladi. Kalit ikkala tilda bitta, shuning uchun uz va ru ma'lumoti bitta topshiriqqa qo'shiladi.

### 1.8. Yetkazish

**A yo'l** — JSX bazasini CoddyCamp konnektorida faqat o'qish uchun ochish. Texnik tomonini Abdulloh bilan qilamiz.

### 1.9. GW 69 tasdig'i

GW 69 (guruh 1030, 21.10) sessiyasini prod bazadan topish uchun Abdulloh kerak. Quyidagilarni u bilan birga tayyorlab yuboramiz:
- xabar tanasi;
- yetkazish holati va School API javobi;
- 7 o'quvchining natijalari;
- testi «yopiq» qolgan 5 o'quvchining tahlili.

Shu ma'lumotda o'quvchi id'si ham tekshiriladi: bizdagi id'larni sizdagi `student_students.id` bilan solishtiramiz (sizning 9.1-bandingiz).

---

## 2. Aniqlashtiramiz

Har savol ostida variantlar va tavsiyamiz bor. Javobni harf bilan yozish kifoya.

### 2.1. «Bajardim» qanday yoziladi

Hozir bu signal serverga faqat 14 darsdan keladi. Qolgan darslarning practice ekranlarida ham tugma bor, lekin hamma joyda bir xil emas:

- **Tugma nomi har xil.** Ko'pida «Bajardim», ba'zilarida «Saqlash» (masalan, pitch varag'ini saqlash).
- **Bir ekranda bir necha qadam.** Masalan, «Retention» darsidagi ish 4 qadamdan iborat va har qadamda o'z «Bajardim»i bor.
- **Tugmasiz ekran bo'lishi mumkin** — faqat «Keyingi» bosiladi. 172 darsni ko'rib chiqib, bunday ekranlar bor-yo'qligini ro'yxat qilamiz.

Qaysi tugma «bajarildi» degani ekanini har ekran bo'yicha o'zimiz belgilaymiz va ro'yxatini sizga beramiz.

**Savol 2.1a. Bir necha qadamli ekranda nima yozilsin?**
- a) har qadamning «Bajardim»i alohida (qadam raqami va vaqti bilan), oxirgi qadam — «topshiriq bajarildi»;
- b) faqat oxirgi qadam — «topshiriq bajarildi».

*Tavsiyamiz: a.* O'quvchi qaysi qadamda to'xtab qolgani ko'rinadi.

**Savol 2.1b. Tugmasiz ekran chiqsa, nima qilinsin?**
- a) ekranga «Bajardim» tugmasini qo'shamiz (darsning ko'rinishi o'zgaradi);
- b) tugma qo'shmaymiz: ekran `kind: practice` bo'lib yoziladi, unda faqat ochilgan va o'tilgan vaqt bo'ladi, «bajardi» maydoni bo'sh qoladi.

*Tavsiyamiz: b.* «Keyingi»ni bosish «bajardi» degani emas, shuning uchun uni «bajardi» deb yozmaymiz. Bunday ekranlar ro'yxatini alohida beramiz.

**Javob:**

### 2.2. O'quvchi yozgan matnda ism bo'lishi mumkin

O'quvchilar kodiga ko'pincha o'z ismini yozadi, masalan `<h1>Ali Valiyev</h1>` yoki `Salom, men Ali`.
Sizning qoidangiz: «ism va kontakt yo'q, faqat id». Matndan ismni ishonchli olib tashlab bo'lmaydi.

**Savol 2.2. Nima qilamiz?**
- a) matn saqlanadi. Unda ism bo'lishi mumkinligini qabul qilasiz, dashboardga chiqarishdan oldin o'zingiz ko'rib chiqasiz;
- b) matn saqlanmaydi, faqat «to'g'ri / noto'g'ri» va urinishlar.

*Tavsiyamiz: a.* Matn faqat JSX bazasida bo'ladi, ko'pchilik ko'radigan joyga chiqmaydi. Lekin qaror sizniki.

**Javob:**

### 2.3. Har xabarda `lms_question_id` (14085 / 14086)

Dars ishlayotgan paytda o'zining CRM'dagi id'sini bilmaydi: bitta dars fayli uz va ru uchun ikki joyga yuklanadi.

**Savol 2.3. Qaysi biri yetadi?**
- a) A yo'ldagi ko'rinishda (view) har yozuv yonida `lms_question_id` ustuni bo'ladi. Uni reestrdan dars kodi va til bo'yicha qo'yamiz. Darsning o'zi o'zgarmaydi;
- b) id'ni LMS darsni ochayotganda o'zi beradi (tokenda). Bu LMS tomonida, Abdulloh qiladi.

*Tavsiyamiz: a.* Darsga tegilmaydi, LMS'da ham ish yo'q. Sizga baribir har yozuvda id ko'rinadi.

**Javob:**

### 2.4. Arena savoli (`quiz-N`) → Learn savoli

Bu bajariladi:
- arenadagi savollar aralashtirilmaydi — `quiz-3` har doim darsdagi 4-savol;
- Learn testiga aynan shu 12 savol shu tartibda yuklangan.

Ikki narsani bilishingiz kerak:
- Learn'da har savol **uz va ru uchun alohida** saqlangan (12 uz + 12 ru). Demak bitta `quiz-N` ga **ikki id** to'g'ri keladi;
- CRM savollarga bergan id'lar (`student_questions.id`) bizda yo'q.

**Savol 2.4. Qaysi biri qulay?**
- a) biz har dars bo'yicha jadval beramiz: dars kodi, `quiz-N`, tartib raqami (1–12), uz matni, ru matni. Id'ni 3170 ichidan tartib raqami bo'yicha o'zingiz topasiz;
- b) siz CRM'dan Learn savollari id'larini (tartibi bilan) jadval qilib berasiz, biz jadvalni to'liq — id'lar bilan qilib qaytaramiz.

*Tavsiyamiz: a* — tezroq. Agar CRM'da tartib ishonchsiz bo'lsa — b.

Bundan bitta qoida chiqadi: **arena savolini o'zgartirsak, Learn testini ham qayta yuklaymiz.** Reviziya ham o'zgaradi.

**Javob:**

---

## 3. Keyingi qadam

1. Siz 2.1–2.4 ga javob berasiz va 1-qism bo'yicha «ma'qul» yoki tuzatishingizni yozasiz.
2. Server tomonini Abdulloh bilan kelishamiz.
3. Ikkala javobdan keyin har band bo'yicha muddat va o'zingiz tekshira boshlaydigan sanani yuboramiz.
