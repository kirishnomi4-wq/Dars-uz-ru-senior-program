# 33-hujjatga javob — QA darsi va Learn tiklandi

Salom. Biz tomondan quyidagilar bajarildi. Biznes qoidalari o‘zgarmadi — 25-kontrakt bo‘yicha davom etamiz.

## 1. Staging deploy uchun ruxsat tuzatildi

`/srv/dars-api/staging/.env.deploy` faylida `gitlab-runner` uchun o‘qish ruxsati tiklandi va aynan runner foydalanuvchisi nomidan tekshirildi.

Sabab bizning sozlash paytidagi `chmod 600` bo‘lgan: mavjud ACL yozuvi saqlangan, ammo uning samarali ruxsati maska orqali yopilib qolgan. Bu tuzatildi. Production faylining ruxsatlari o‘zgartirilmadi.

**Sizdan:** yiqilgan staging deploy job’ini Retry qiling. Bizning GitLab akkauntimiz sizning loyihangizga kira olmagani uchun Retry’ni bajara olmadik. Javobni tayyorlash paytida health hali `0.1.0+f65573c5`, `result_schema_v2: on` ko‘rsatmoqda; `2cbce86` yangilanishi staging’da ishlayotganini hali tasdiqlamaymiz.

## 2. Yuborgan JSX faylingiz QA’ga yuklandi

`01-InternetLesson-v6-QA-staging.jsx` Class **2374** uchun ikkala tilga bir xil fayl sifatida o‘rnatildi:

- uz material: **13381**;
- ru material: **14091**;
- Dars lesson ID: `internet-01-v18`;
- versiya: `v6`;
- server: `https://staging-dars-api.coddycamp.uz`.

Kesh tozalandi. Nashr qilingan fayl HTTP 200 qaytaradi. QA LMS ko‘rish rejimida kompyuter va mobil o‘lchamlarda dars ochildi, JavaScript xatosi va gorizontal siljish aniqlanmadi. Bu ko‘rish tekshiruvi; to‘liq jonli sinov hali o‘tkazilmadi.

[Darsni QA’da ko‘rish](https://qa-lms.coddycamp.uz/preview?visit_mode=preview&jsx=https%3A%2F%2Fqa-crm.coddycamp.uz%2Fuploads%2Flessons%2Flesson_runner%2Fversions%2F4ca1a249af9b8366c903435147c1a9b5%2Flesson.jsx)

Bu havola preview uchun. Jonli mentor sessiyasini CRM’dagi odatiy mentor kirishi orqali ochish kerak.

## 3. Learn 3148 tiklandi

QA bazasida reestrdagi Learn **3148** yo‘q edi. Uni production’dagi amaldagi ma’lumotlarni faqat o‘qish orqali olib, QA’da tikladik:

- nomi: «Как работает Интернет тест»;
- kurs **20**, modul **70**;
- turi `Learn`, holati `active`;
- **24 ta faol savol**: 12 ta uz va 12 ta ru;
- Class **2374 → Learn 3148** bog‘lanishi.

ID va savollar mazmuni manba bilan solishtirildi. Mavjud Practice **2785** o‘z joyida qoldi, u Learn o‘rniga ishlatilmadi.

## 4. Birinchi QA ishtirokchisi

Foydalanuvchi tasdiqlagan ishtirokchi:

**Suxrob test — `student_students.id = 33018`.** Bu LMS ID; hodisalarda `id_type: lms` bilan shu ID ishlatiladi.

Uning holati:

| Obyekt | QA holati |
| --- | --- |
| Kurs 20 | Ruxsat bor |
| Modul 70 | Ruxsat bor |
| Class 2374 | Avvaldan `completed` |
| Learn 3148 | `opened` |

Suxrob’ning odatiy LMS kirishi orqali tekshirildi: Learn ro‘yxatda ko‘rinadi, tanlangan tilda 12 ta savol HTTP 200 bilan keladi. Balans, mukofotlar tarixi va Class’ning avvalgi yakuni o‘zgartirilmadi.

[Learn 3148 — QA LMS](https://qa-lms.coddycamp.uz/course/20/module/70/3148)

**Sinovda hisobga olish kerak:** Suxrob hozir Class’ning birinchi yakunini tekshirish uchun toza holatda emas. Uni qayta topshirish va takroriy mukofot berilmasligi ssenariysida ishlatish mumkin. Birinchi yakun ssenariysi uchun tugatilmagan Class’ga ega ishtirokchi yoki alohida tasdiqlangan qayta ochish kerak. Qolgan ikki QA ishtirokchisining LMS ID’lari hali bizga berilmagan; qisman Learn mukofoti olgan ishtirokchi ham hali tanlanmagan.

## 5. Vaqt validatsiyasi bo‘yicha javob

Ha, millisekundlarni yo‘qotish va soniyaga yaxlitlashdan kelgan nomuvofiqlik QA qabul qiluvchisida tuzatilgan. Ishlayotgan validator fayli tekshirilgan versiya bilan bir xil.

`elapsed_sec` — millisekund aniqligidagi `occurred_at − opened_at` farqining butun soniyaga yaxlitlangan qiymati. `processed_at` bu farqqa qo‘shilmaydi. Kasr soniyali vaqtlar va noto‘g‘ri davomiylik holatlari testdan o‘tgan.

Bu har qanday vaqt qiymati qabul qilinadi degani emas: mantiqan noto‘g‘ri yoki chegaradan tashqari vaqtlar 422 bilan rad etiladi. Oldin rad etilgan tarixiy hodisalar avtomatik qayta yuborilmadi.

## 6. Keyingi qadamlar

1. Siz staging deploy job’ini Retry qilasiz va eski urinishlarni v2’dan chiqaruvchi yangi versiya health’da ishlayotganini tasdiqlaysiz.
2. Qolgan QA ishtirokchilari va rollari belgilanadi: birinchi yakun, yarimida chiqish, javobsiz arena, qisman Learn mukofoti.
3. So‘ng jonli darsni birga o‘tkazamiz: `lr_`, `ap_`, `ar_`, GET yakuniy holatlari, Class/Learn va coin natijalarini solishtiramiz.

Production qabul qiluvchisi va production’dagi `RESULT_SCHEMA_V2` bu ishda o‘zgartirilmadi. Production’ga o‘tish jonli QA qabulidan keyingi alohida bosqich bo‘lib qoladi.
