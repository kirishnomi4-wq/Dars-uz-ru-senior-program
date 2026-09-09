# Axadulla'ga javob №2 (2026-09-09) — foydalanuvchi yuboradi


Assalomu alaykum, Axadulla. Javobingiz va JSON-namuna uchun rahmat, uchala topilma bo'yicha tekshirdik.

**1. Vaqt zonasi.** Tuzatuvingiz ko'rinyapti: `sess_782030_20260908T125804Z` uchun GET endi `started_at 2026-09-08T12:58:04Z`,
`finished_at 13:07:35Z` qaytaradi, biz yuborgan bilan bir xil. Yopildi.

**2. `elapsed_ms = 0` va bir xil `at`.** Sabab biz tomonda: urinishlar tarixi faqat brauxer xotirasida turgan, o'quvchi sahifani
yangilaganda yo'qolib, tugashda zaxira qiymatlar ketgan (shu sababdan to'rt yutuqning `earned_at` ham bir xil). Tuzatdik: tarix endi
qurilma saqlovida ham turadi va yangilanganda tiklanadi. Keyingi pilotda `elapsed_ms` haqiqiy bosish vaqti, `at` har urinishning
o'z vaqti, `earned_at` yutuq birinchi olingan vaqt bo'ladi. Boshqa qurilmadan davom etilsa tarix bo'lmaydi, u holda oldingi zaxira
ko'rinish qoladi. Bu holatni keyin serverdan to'ldirishni ko'rib chiqamiz.

**3. `solved = true` noto'g'ri javobda.** Sabab biz tomonda: jonli darsda bitta urinish bo'lgani uchun dars `solved` ni «savol yopildi»
ma'nosida yozgan. Tuzatdik: `solved` endi urinishlardan hisoblanadi, ya'ni `solved === attempts.some(correct)`. Jonli darsdagi xato
javob `solved: false` bo'ladi, `correct` esa avvalgidek birinchi urinish.

**4. `→` belgisi `?` bo'lib qolgani.** Bu bizdan chiqmaydi: manbada va CRM'dagi yig'mada belgi `→` (U+2192) turibdi, LMS front
obyektni JS xotirasidan oladi, oraliq kodlash yo'q. O'sha namunada `—` (U+2014) saqlanib qolgan, `→` yo'qolgan. `—` cp1252
jadvalida bor, `→` yo'q, bu MariaDB ustuni yoki ulanishi `latin1/cp1252` bo'lganining aniq belgisi. Iltimos,
`school.student_question_log.answer` ustuni va Laravel DB-ulanishi (`charset`) `utf8mb4` ekanini tekshiring. Biz kontentni
o'zgartirmaymiz, UTF-8 bilan davom etamiz.

Yangi yig'mani CRM'dagi test-materialga qo'yamiz. Akkauntlar olindi, 30 daqiqalik qo'shma sinovga tayyormiz, vaqtni siz ayting.
Rahmat.
