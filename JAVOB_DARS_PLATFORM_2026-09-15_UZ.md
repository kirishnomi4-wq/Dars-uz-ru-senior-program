# Dars-platforma jamoasiga javob — 2026-09-15

Assalomu alaykum.

10–11-sentabrdagi xabarlaringizni ko'rib chiqdik. Batafsil natijani
`lesson-results` ichida yuborish taklifini qabul qilamiz.

## 1. `rank` va `top_1/top_2/top_3` qoidasi

Yangi qoidani tasdiqlaymiz: `correct_answers = 0` bo'lsa, `rank` faqat `null`
bo'ladi va `badges` ichida `top_1`, `top_2`, `top_3` yuborilmaydi.
`correct_answers`, `answered` va `total_questions` avvalgidek saqlanadi.

School API ushbu qoidani ham tekshiradi. Coin formulasi hozircha yoqilmagan;
API javobida `reward_status: "pending_policy"` qoladi.

## 2. To'rtta savolga javob

| № | Savol | Javob |
|---:|---|---|
| 1 | A-variant: `lesson-results` ichida `lang`, `questions[]`, `achievements[]` | **Ha** |
| 2 | Arena savollari `kind: "arena"` bilan kerakmi | **Ha**, lekin arena `answered`, `correct_answers`, `total_questions`, `rank` va coin hisobiga kirmaydi |
| 3 | School API qachondan qabul qiladi, yangi maydonlar `422` bermaydimi | Kod va OpenAPI **2026-09-15** kuni tayyorlandi. Staging deploy va control-migratsiyadan keyin qabul qilishni boshlaymiz; tayyorlik tasdig'imizdan oldin `RESULT_DETAILS=a` ni yoqmang |
| 4 | Ball `total_questions` / `correct_answers` dan olinadimi | **Ha.** `questions.length` ishlatilmaydi; batafsil savollar faqat agregatlarni tekshirish va analitika uchun ishlatiladi |

Yangi versiyada maydonlar shunchaki e'tiborsiz qoldirilmaydi: ular tekshiriladi,
normalizatsiya qilinadi, control DB'da saqlanadi, hodisaning idempotency hash'iga
kiradi va `GET /lesson-results/{event_id}` orqali qaytariladi. Eski payload yangi
maydonlarsiz ham valid bo'lib qoladi.

## 3. Asosiy tekshiruv qoidalari

- `questions[]` va `achievements[]` yuborilsa, `lang` majburiy (`uz` yoki `ru`);
- bir o'quvchiga ko'pi bilan 200 savol, bir savolga 10 urinish va 20 achievement;
- `kind: "test"` savollari `answered` va `correct_answers` bilan mos bo'lishi shart;
- `kind: "arena"` saqlanadi, lekin ballga kirmaydi;
- `correct` birinchi urinish natijasiga teng;
- `solved` kamida bitta to'g'ri urinish borligini bildiradi;
- live rejimida har savolga aynan bitta urinish;
- `at` va `earned_at` UTC formatida, oxirida `Z` bilan yuboriladi;
- bir xil `event_id` va bir xil payload `200 duplicate=true`, o'zgargan payload esa `409` qaytaradi;
- 1 MB gacha bo'lgan kelishilgan payload server limitiga sig'adi.

## 4. Live `onFinished` namunasi

`student_id=31352`, `question_id=16594`, 2026-09-10 taxminan 09:26 UTC bo'lgan
saqlangan `question_try` yozuvi alohida eksport qilinib yuboriladi. Unda maxfiy
ma'lumotlar va live PIN bo'lsa, yuborishdan oldin olib tashlanadi.

## 5. Birgalikdagi sinov

Avval staging'da `RESULT_DETAILS=a` bilan bitta test-dars o'tkazamiz. Unda:

1. test va arena savollari saqlanishini;
2. arena ballga kirmasligini;
3. urinish va achievement vaqtlarining `Z` bilan o'zgarmasdan qaytishini;
4. identik takror `200`, o'zgargan takror `409` qaytarishini;
5. eski JWT, muddati tugagan vaqtinchalik mentor va guruhdan chiqarilgan o'quvchi holatlarini tekshiramiz.

30 daqiqalik umumiy sinovning aniq kuni va vaqtini staging deploy tasdiqlangach
alohida kelishamiz.

## 6. Texnik tekshiruv

School API o'zgarishlari loyiha uchun alohida PHP 8.2 muhitida tekshirildi:

- batafsil natijalar va migratsiyalar bo'yicha 25 ta test (159 ta assertion) o'tdi;
- to'liq test to'plamidagi 112 ta test (567 ta assertion) o'tdi;
- o'zgartirilgan PHP fayllari Laravel Pint tekshiruvidan o'tdi.

Bu tekshiruv lokal muhitda bajarildi; staging deploy va birgalikdagi test hali
alohida tasdiqlanishi kerak.

## 7. Kalitlar rotatsiyasi

Rotatsiyaga rozimiz. Yangi JWT secret (`kid=v2`) va yangi `sapi_` tokenlar faqat
kelishilgan xavfsiz kanal orqali beriladi; Markdown, Git yoki ochiq chatga
yozilmaydi.

Tartib:

1. yangi kalit va tokenlar yaratiladi;
2. siz eski va yangi `kid`ni parallel qabul qilishni yoqasiz;
3. yangi `sapi_` tokenlar va `kid=v2` bilan staging/prod so'rovi tekshiriladi;
4. School API yangi kalitga o'tkaziladi;
5. eski JWT'larning maksimal 12 soatlik muddati tugagach `kid=v1` o'chiriladi;
6. yangi `sapi_` token ishlashi tasdiqlangach eski API tokenlar bekor qilinadi.

Rahmat.
