# Dars-platforma jamoasiga javob — 2026-09-09

Assalomu alaykum.

Xabaringiz va `TZ_LESSON_RESULT_DETAILS_RU (2)` hujjatidagi 2026-09-08 qarori bilan tanishdik.

## 1. Vaqt zonasi

Muammo biz tomonda tasdiqlandi. `Z` bilan kelgan vaqt UTC sifatida saqlanishi va o‘zgarishsiz UTC ko‘rinishida qaytarilishi kerak.

Kutiladigan natija:

- yuborilgan `started_at: 2026-09-08T12:58:04Z`;
- GET javobidagi `started_at: 2026-09-08T12:58:04Z`;
- yuborilgan `finished_at: 2026-09-08T13:07:35Z`;
- GET javobidagi `finished_at: 2026-09-08T13:07:35Z`.

Siz tomonda formatni o‘zgartirish shart emas. ISO 8601 UTC va `Z` formatida yuborishni davom ettiring. School API’dagi 5 soatlik siljish biz tomonda tuzatiladi va keyingi qo‘shma sinovdan oldin tekshiriladi.

## 2. `onFinished` natijasining detallari

2026-09-08 kungi **C varianti**ni tasdiqlaymiz:

- yangi ma’lumotlar mavjud `onFinished` obyektining ichida keladi;
- yuqori darajadagi yangi maydonlar: `lang`, `questions[]`, `achievements[]`;
- eski `lessonId`, `correctAnswers`, `totalQuestions`, `answers` va boshqa maydonlar o‘zgarmaydi;
- alohida details endpoint hozir yaratilmaydi;
- School API `lesson-results` kontrakti hozir o‘zgarmaydi;
- `RESULT_DETAILS` o‘chiq qoladi;
- arena savollari hozir yuborilmaydi.

LMS frontend `onFinished` obyektini to‘liq JSON ko‘rinishida backendga yuboradi. Production CRM backend ushbu JSON’ni `school.student_question_log.answer` maydonida saqlaydi.

`37069` o‘quvchining aynan pilot natijasida `lang`, `questions` va `achievements` saqlanganini hali fakt bo‘yicha tasdiqlamadik. Production yozuv tekshirilgach, shaxsiy ma’lumotlarsiz bitta real JSON namunani alohida yuboramiz. Tekshiruvda quyidagilar solishtiriladi:

- `lang`;
- `questions[].question_id`;
- har bir savoldagi `attempts[]` va urinish raqamlari;
- `correct` va `solved`;
- `elapsed_ms` va `at`;
- `achievements[]` va `earned_at`.

## 3. §7 savollariga aniq javoblar

| № | Savol | Javob |
|---:|---|---|
| 1 | A yoki B variant | **C varianti:** shu obyekt `onFinished` ichida. Alohida endpoint yo‘q |
| 2 | Savol va variant matnlari kerakmi | **Ha**, `question`, `options[]` va `correct_answer` kerak |
| 3 | Arena savollari kerakmi | **Hozircha yo‘q**; faqat `kind = "test"` |
| 4 | Live rejimida bitta urinish, ball birinchi urinish bo‘yicha hisoblanadimi | **Ha** |
| 5 | Limitlar ma’qulmi | **Ha:** 200 tagacha savol, har savolga 10 tagacha urinish, 6 tagacha variant, 20 tagacha achievement, matn 300 belgigacha |
| 6 | Yangilangan OpenAPI va School API qabul sanasi | **Talab qilinmaydi**, chunki C variantida `lesson-results` kontrakti o‘zgarmaydi |
| 7 | Detallar coin hisobiga ta’sir qiladimi | **Yo‘q.** Detallar faqat analitika uchun. Hozir `lesson-runner` natijasi uchun coin va point `0` bo‘lib qoladi |

Qo‘shimcha tasdiq:

- `correctAnswers` — birinchi urinishda to‘g‘ri javob berilgan test savollari soni;
- `questions[].correct` — birinchi urinish natijasi;
- `questions[].solved` — o‘quvchi oxirida to‘g‘ri javobgacha yetganmi;
- barcha vaqtlar UTC formatida, `Z` bilan yuboriladi;
- yangi detallar mavjud coin, badge va rank qoidalarini o‘zgartirmaydi.

## 4. Qolgan test akkauntlari

So‘ralgan akkauntlar ro‘yxati qabul qilindi:

- O-2 — G-1 (`gid=1070`) o‘quvchisi;
- O-3 — G-1 muzlatilgan o‘quvchi;
- O-4 — boshqa G-2 guruhidagi o‘quvchi va G-2 `gid` qiymati;
- O-5 — G-1 va G-2 guruhlaridagi o‘quvchi;
- M-2 — G-2 guruhining `TEACHER` foydalanuvchisi;
- T-1 — G-1 guruhining `TA` foydalanuvchisi;
- X-1 — hech qaysi guruhga tayinlanmagan foydalanuvchi;
- V-1 — G-1 uchun amaldagi `START_DATE..END_DATE` oralig‘idagi vaqtinchalik mentor.

Login, parol va boshqa maxfiy ma’lumotlar ushbu hujjatga yoki Git’ga yozilmaydi. Tayyor akkauntlar, ularning belgilari va kerakli `gid` qiymatlari xavfsiz kanal orqali alohida yuboriladi.

## 5. Qo‘shma sinov

Akkauntlar yuborilgach, 30 daqiqalik qo‘shma sinovga tayyormiz. Quyidagi to‘rtta band uchun alohida vaqtni kelishamiz:

1. V-1 vaqtinchalik mentor muddatini o‘tmishga o‘tkazish;
2. bir `event_id` bilan o‘zgartirilgan payload yuborib `409 Conflict` tekshirish;
3. topilmaydigan o‘quvchi ID’sini tekshirish;
4. JWT kalitini rotatsiya qilishni tekshirish.

Sinovni yopishdan oldin `37069` o‘quvchining bitta saqlangan `onFinished` JSON namunasi dars ekranidagi natija bilan solishtiriladi.
