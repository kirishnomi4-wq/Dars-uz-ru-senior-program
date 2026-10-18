# JSX dars statistikasi — nima o'zgardi va MCP orqali nimalarni olish kerak

Sana: 2026-09-25

Assalomu alaykum.

Biz CRM tomonida yakunlangan JSX darslarining statistikasini alohida, o'zaro bog'langan jadvallarga saqlashni qo'shdik. Quyida o'zgarishlar va MCP orqali o'qish uchun jadval/ustunlar ro'yxati.

## 1. Biz nima qildik

- Yuborish yo'li o'zgarmadi: **Tamom → `onFinished(payload)` → LMS `question_try` → CRM bazasi**. Sizdan yangi endpoint yoki qo'shimcha yuborish talab qilinmaydi.
- Dars natijasi, savollar, savolga javob berish urinishlari va nishonlar uchun 4 ta jadval qo'shdik. Yozish to'g'ridan-to'g'ri CRM'da bajariladi; School API bu yozuv yo'lida vositachi emas.
- V1 va V2 formatlarini qo'llab-quvvatladik. Asl `passed`, baholar, `correct` va `solved` qiymatlarini saqlaymiz — ularni sun'iy ravishda `true` qilmaymiz.
- Darsni yakunlash, kirish va mukofot qoidalarini o'zgartirmadik. Tugallanmagan darslar uchun oraliq natija yuborish kerak emas.
- Asl JSON avvalgidek `student_question_log.answer` da qoladi. Mavjud School API `lesson-results` integratsiyasi bu o'zgarish bilan o'chirilmagan.

**Takroriy o'tish:** yangi analitikada bir o'quvchi + bir LMS darsi uchun faqat birinchi yakunlangan natija saqlanadi, hatto `passed: false` bo'lsa ham. Qayta o'tish, ko'rish rejimi yoki boshqa til birinchi natijani almashtirmaydi.

Shu birinchi natija ichida yuborilgan barcha savol urinishlari saqlanadi. Butun darsni keyin qayta o'tish esa yangi analitik natija yaratmaydi. Eski texnik jurnalda yangi kalit bilan qayta yuborilgan JSON qolishi mumkin — uni yangi analitikaga qo'shib sanamang.

## 2. MCP uchun ma'lumot manbasi

CRM production bazasi: **`school`**. Manba `school_api_control` emas. MCP'da quyidagi jadvallarga va kerakli ustunlarga o'qish huquqi bo'lishi kerak; ular ko'rinmasa, bizga ayting.

| Jadval | Bir qator nimani bildiradi | Bog'lanish |
| --- | --- | --- |
| `jsx_lesson_results` | O'quvchining LMS darsidagi birinchi yakunlangan natijasi | Asosiy kalit: `id` |
| `jsx_lesson_questions` | Shu natija ichidagi bitta savol | `jsx_lesson_result_id` → `jsx_lesson_results.id` |
| `jsx_lesson_attempts` | Shu savolga javob berishning bitta urinishi | `jsx_lesson_question_id` → `jsx_lesson_questions.id` |
| `jsx_lesson_achievements` | Shu natija ichidagi bitta nishon | `jsx_lesson_result_id` → `jsx_lesson_results.id` |

### 2.1. `jsx_lesson_results` — umumiy natija

| Ustunlar | Nima uchun olinadi |
| --- | --- |
| `id` | Natija ID'si; savollar va nishonlarni shu ID orqali oling |
| `lms_student_id` | LMS o'quvchi ID'si: `student_students.id` |
| `crm_student_id` | CRM o'quvchi ID'si: `student_list.ID`; `lms_student_id` bilan aralashtirmang |
| `lesson_id` | LMS dars ID'si: `student_lessons.id` |
| `lms_question_id` | Natija manbasi bo'lgan JSX topshiriq ID'si: `student_questions.id` |
| `module_id`, `course_id` | CRM modul va kurs ID'lari; filtrlash/guruhlash uchun |
| `source_lesson_id` | Siz yuborgan `lessonId`, masalan `internet-01-v18`; bu CRM `lesson_id` emas |
| `lesson_title_uz`, `lesson_title_ru` | Payload'dagi dars nomlari |
| `lang`, `live_mode`, `details_version` | Til, rejim va payload sxemasi versiyasi |
| `completed` | `onFinished` olinganini bildiradi; baho emas |
| `passed`, `final_score`, `final_total` | Asl `passed`, `finalScore`, `finalTotal`: yakuniy savol bo'yicha natija |
| `total_questions`, `correct_answers`, `score_percent` | Testlar soni, birinchi urinishda to'g'ri javoblar va asosiy foiz |
| `duration_sec`, `total_screens` | Yuborilgan davomiylik va ekranlar soni |
| `started_at`, `finished_at` | Payload'dagi boshlanish/yakun vaqti, UTC |
| `source_recorded_at` | Asl natija CRM jurnaliga yozilgan vaqt, UTC; tarixiy hisobotlar uchun |
| `stored_at` | Natija yangi jadvallarga yozilgan vaqt, UTC; tarixiy yakun vaqti bilan bir xil bo'lishi shart emas |
| `retake_pressed` | Birinchi saqlangan payload'dagi `retake.pressed` |
| `retake_total_questions`, `retake_correct_answers`, `retake_score_percent`, `retake_duration_sec` | Shu payload'dagi `retake.lastPass` ko'rsatkichlari; alohida qayta o'tishlar tarixi emas |
| `missed_question_ids` | Birinchi urinishda xato qilingan savollarning manba ID'lari, JSON-massiv |
| `truncated`, `truncated_fields` | Payload qisqartirilganmi va qaysi maydonlar qisqargan; ikkinchisi JSON-massiv |
| `questions_present`, `achievements_present` | Tegishli massiv payloadda bormi: `1` — bor, `0` — yuborilmagan |
| `question_log_id` | Zarur bo'lganda asl JSON bilan tekshirish: `student_question_log.id` |

Faqat umumiy statistika kerak bo'lsa, shu jadvalning o'zi yetarli. O'quvchi uchun `crm_student_id` yoki `lms_student_id`, dars uchun `lesson_id` yoki `source_lesson_id`, kurs/modul uchun tegishli ustun bilan filtrlang.

### 2.2. `jsx_lesson_questions` — savollar tahlili

| Ustunlar | Nima uchun olinadi |
| --- | --- |
| `id`, `jsx_lesson_result_id` | Ichki savol ID'si va uning asosiy natijaga bog'lanishi |
| `source_question_id` | Siz yuborgan `question_id`, masalan `s5b`; manba savolni dars bilan birga aniqlang |
| `kind` | Savol turi; odatiy test tahlilida `kind = 'test'`, Arena bilan aralashtirmang |
| `position`, `question_order` | Saqlangan massivdagi tartib va payload'dagi `order` |
| `question_text` | Savol matni |
| `options_json` | Javob variantlari, JSON-massiv |
| `correct_option`, `correct_answer` | To'g'ri variant indeksi va etalon javob |
| `first_try_correct` | Birinchi javob to'g'rimi: payload'dagi `correct` |
| `solved` | Savol keyinchalik yechilganmi |
| `attempts_present` | Savol uchun urinishlar massivi yuborilganmi |

Qiyin savollarni topish uchun `first_try_correct = 0`, keyin yechilganlarini ajratish uchun `solved = 1` dan foydalaning. Savollarni dars/manba versiyasini hisobga olib guruhlang; faqat `source_question_id` bo'yicha turli darslarni birlashtirmang.

### 2.3. `jsx_lesson_attempts` — savolga javob berish urinishlari

| Ustunlar | Nima uchun olinadi |
| --- | --- |
| `id`, `jsx_lesson_question_id` | Urinish ID'si va ichki savol ID'siga bog'lanish |
| `position`, `attempt_number` | Saqlangan massiv tartibi va payload'dagi `n` |
| `selected_option`, `answer_text` | Tanlangan variant indeksi va yuborilgan javob |
| `is_correct` | Aynan shu urinish to'g'rimi |
| `elapsed_ms` | Yuborilgan millisekund ko'rsatkichi |
| `answered_at` | Payload'dagi `at`, UTC |

`jsx_lesson_question_id` orqali kerakli savol urinishlarini oling va `position` bo'yicha tartiblang. `answered_at` bir xil bo'lgan urinishlar ham alohida yozuvlar; ularni vaqt bo'yicha bitta yozuvga birlashtirmang.

### 2.4. `jsx_lesson_achievements` — nishonlar

| Ustunlar | Nima uchun olinadi |
| --- | --- |
| `id`, `jsx_lesson_result_id` | Nishon yozuvi ID'si va asosiy natijaga bog'lanish |
| `position` | Payload'dagi nishonlar tartibi |
| `source_achievement_id` | Siz yuborgan nishon `id` si |
| `name`, `title` | Nishon nomi va tavsifi |
| `earned_at` | Nishon olingan vaqt, UTC |

## 3. MCP orqali o'qish tartibi va muhim qoidalar

1. `jsx_lesson_results` dan kerakli o'quvchi/dars/kurs natijalarini oling.
2. Tanlangan natijalarning `id` qiymatlari bilan `jsx_lesson_questions.jsx_lesson_result_id` va `jsx_lesson_achievements.jsx_lesson_result_id` ni filtrlang.
3. Olingan savollarning ichki `id` qiymatlari bilan `jsx_lesson_attempts.jsx_lesson_question_id` ni filtrlang. Bu yerda payload'dagi `source_question_id` ishlatilmaydi.

Talqin qilishda:

- `NULL` — ma'lumot yo'q yoki noma'lum; uni `0` yoki noto'g'ri javob deb hisoblamang. Mantiqiy maydonlarda `1` — ha, `0` — yo'q.
- `passed = 0` dars tugallanmaganini anglatmaydi. `completed` va bahoni alohida ko'ring.
- `truncated = 1` bo'lsa, tafsilotlar to'liq emas. `questions_present = 0` yoki `attempts_present = 0` ham nol savol/urinish degani emas. Umumiy natijani qolgan detallardan qayta hisoblamang.
- Asosiy natijani savollar, urinishlar va nishonlar bilan JOIN qilganda natija qatorlari ko'payadi. `score_percent` yoki `correct_answers` ni shu ko'paygan qatorlar bo'yicha jamlamang; umumiy ko'rsatkichlarni asosiy jadvaldan, bolalarini alohida hisoblang.
- Retake bo'lsa, `started_at` oxirgi o'tish boshi bo'lishi mumkin, asosiy baho esa birinchi o'tishdan. Ularni bir o'tishning aniq vaqt/baho jufti deb qabul qilmang.
- Eski tarix ommaviy ko'chirilmagan: eski natija keyingi yangi yuborishni qayta ishlaganda dastlabki jurnal yozuvidan olinishi mumkin. Jadvalda yozuv yo'qligi o'quvchi hech qachon tugatmaganini isbotlamaydi.
- Guruh/ustoz ID'lari bu to'rtta jadvalda yo'q. Bu hisobot barcha ro'yxatdagi o'quvchilarni emas, saqlangan yakunlangan natijalarni qamrab oladi.
- To'g'ri javoblar va o'quvchi javoblarini faqat ruxsat berilgan analitika foydalanuvchisiga oching. MCP orqali bu jadvallardan o'qish kerak, yozish yoki o'chirish emas.

Siz tomondan `onFinished` orqali mavjud v2 payloadni, haqiqiy baholarni va qisqartirish belgilarini yuborishda davom etishingiz yetarli.

Rahmat.
