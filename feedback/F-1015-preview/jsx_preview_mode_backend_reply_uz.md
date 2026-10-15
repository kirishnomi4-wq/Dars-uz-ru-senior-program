# JSX preview — serversiz yechim bo'yicha javob

Hamkasblar, salom!

Serversiz preview variantini tasdiqlaymiz. Bu variant bizga mos va umumiy
live/solo sessiyalardan to'liq ajratilgani uchun afzal.

## Savollarga javoblar

### 1. Serversiz variant va testlar

Ha, serversiz variant mos. Preview Dars-platforma serveriga umuman murojaat
qilmasa, preview-sessiya, alohida jadval va 24 soatlik TTL kerak emas.

Lekin quyidagi avtomatik testlar majburiy:

- `/lms/join`, `/lms/me`, `/me/progress` va live-room endpointlariga birorta
  ham so'rov ketmasligi;
- `localStorage` va `sessionStorage`ga hech narsa yozilmasligi;
- F5 bosilgandan keyin dars noldan boshlanishi;
- PIN oynasi va mentor paneli chiqmasligi;
- `visitMode="preview"` bilan birga `liveToken` kelsa ham token ishlatilmasligi;
- oddiy Davomat va o'quvchi flow'lari o'zgarmasligi.

### 2. Preview rejimining ishonchli manbasi

Asosiy va ishonchli manba — `visitMode` prop.

JSX iframe ichida ochilmaydi: dinamik komponent LMS React daraxtida ishlaydi.
URL'dagi `visit_mode=preview` parametrini LMS o'qiydi va JSX komponentiga
`visitMode="preview"` prop sifatida uzatadi.

`window.__CC_VISIT_MODE__` kerak emas. Bitta source of truth saqlanishi uchun
undan foydalanmaslikni so'raymiz.

`previewRunId`ni qabul qilish mumkin, lekin serversiz variantda uni backend'ga
yuborish yoki saqlash talab qilinmaydi.

### 3. Uyga vazifalar

Yo'q. Hozirgi scope — `Bilimlar bazasi` orqali ochiladigan
`student_questions.type = lesson-runner` JSX materiallari. Uyga vazifalar bu
vazifaga kirmaydi.

### 4. Hodisa ma'lumotlari

Hodisaning aniq darsi, guruhi, sana va vaqti bizda hozir yo'q. Bu ma'lumot
topilsa, server jurnalini qo'shimcha tekshirish uchun alohida yuboramiz.

Ushbu ma'lumot serversiz preview yechimini qabul qilish va amalga oshirishni
bloklamaydi.

### 5. Staging tekshiruvi

Staging build tayyor bo'lgach, birgalikda test-guruh va test-o'quvchini
belgilaymiz. Tekshiruvda o'qituvchi preview'ni oxirigacha o'tadi, keyin o'quvchi
xuddi shu JSX darsni boshlang'ich holatdan ochishi kerak.

### 6. Preview'dagi hodisalar va `onFinished`

Preview jim ishlashi kerak. JSX lokal `onFinished`ni odatdagidek chaqirishi
mumkin, lekin LMS preview sahifasida u bo'sh funksiya bo'ladi.

Serverga event, progress, javob yoki result yuborilmasin. JSX School API'ni
to'g'ridan-to'g'ri chaqirmasligi kerak.

### 7. Yetarlilik va qabul qilish sharti

Ha, taklif yetarli. Qabul qilish uchun quyidagilar tasdiqlanishi kerak:

- o'zgarish umumiy modulda amalga oshirilgan;
- 174 ta darsning barchasi yangi umumiy modul bilan qayta yuklangan;
- yuqoridagi avtomatik testlar o'tgan;
- preview'dan keyin o'quvchi darsni toza boshlashi birgalikdagi E2E testda
  tasdiqlangan;
- Davomat live-flow va oddiy o'quvchi flow'ida regressiya yo'q.

### 8. Darslar qayta yuklangunigacha mentor JWT

`Bilimlar bazasi` hozir ham mentor JWT yubormaydi. Mentor JWT faqat Davomatdagi
guruh live-flow'ida xavfsiz handshake orqali olinadi.

Shuning uchun JWT yubormaslikning o'zi hodisani to'liq to'xtatmaydi. Asosiy
himoya — `visitMode="preview"` rejimida:

- eski `liveSession:<id>` holatini tiklamaslik;
- PIN oynasini ko'rsatmaslik;
- Dars-platforma serveriga umuman murojaat qilmaslik;
- barcha progressni faqat ochiq varaq xotirasida saqlash.

CRM'dagi `visit_mode=preview` yangi umumiy modul 174 ta darsga yuklanganidan va
tekshiruvdan o'tganidan keyin yoqiladi.

## Release tartibi

1. Siz umumiy modul o'zgarishini staging'ga chiqarasiz va 174 ta darsni qayta
   yuklaysiz.
2. Biz LMS frontend'ni staging'ga chiqaramiz.
3. Birgalikda preview → student clean-start E2E testini o'tkazamiz.
4. Siz umumiy modul va yangilangan darslarni production'ga chiqarasiz.
5. Biz LMS frontend'ni production'ga chiqaramiz.
6. Eng oxirida CRM'da `visit_mode=preview`ni yoqamiz.
7. Test-guruh va test-o'quvchi bilan production smoke-test o'tkazamiz.

Rahmat!
