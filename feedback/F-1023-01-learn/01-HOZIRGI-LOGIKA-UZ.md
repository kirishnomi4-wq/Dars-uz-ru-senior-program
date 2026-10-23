# JSX dars va CodeStrike: hozir biznes-logika qanday ishlaydi

**Kimga:** Abdulloh (LMS IT jamoasi)
**Kimdan:** Azizbek (Academ-Developer) · 2026-10-23
**Maqsad:** ikkinchi hujjatdagi taklifni (CodeStrike → Learn) bir xil tushunish uchun hozirgi holatni bitta joyda yozish. Bu hujjatda taklif yo'q, faqat bugun ishlab turgan mexanizm.

---

## 1. Qatnashchilar

| Tomon | Nima qiladi |
|---|---|
| **LMS** (lms.coddycamp.uz, go.coddycamp.uz) | o'quvchi va mentorni tanitadi (JWT), JSX darsni ochadi, dars yakunidagi natijani saqlaydi (`question_try`), keyingi darsni ochadi (`next_lesson_access`) |
| **JSX dars** (bizning fayl, CRM'ga yuklanadi) | ekranlar, testlar, CodeStrike arenasi, yakunda `onFinished(JSON)` |
| **Dars API** (dars-api.coddycamp.uz, bizning server) | jonli sessiya (mentor + guruh), ball, arena reytingi, urinishlar tarixi, School API'ga natija |

LMS bizning JSON'ni **o'qimaydi**: uni satr sifatida `question_try.answer` ga saqlaydi va har doim `correct: 1` qo'yadi (2026-09-22 kelishuvi: `correct:1` = «JSX dars yakunlandi» signali).

## 2. Darsga kirish rejimlari

LMS JSX'ni ochganda `liveToken` beradi. Dars shu token bilan bizning serverga `/lms/join` qiladi va rejim aniqlanadi:

| Rejim | Kim | Qachon |
|---|---|---|
| `mentor` | o'qituvchi (TEACHER / TA / vaqtincha mentor) | CRM'dan darsni ochadi, guruhga jonli sessiya ochiladi, kod chiqadi |
| `student` | o'quvchi | mentor sessiyasi ochiq bo'lsa, o'quvchi avtomatik ergashadi (PIN kerak emas) |
| `solo` | o'quvchi | mentor sessiyasi yo'q (uyda, kech kelgan, darsga kelmagan): yolg'iz o'tadi |
| `review` | o'quvchi | tugatgan darsni qayta ochdi: faqat ko'radi, javoblar qulf |
| `preview` | CRM «Bilimlar bazasi» | serverga so'rov yo'q, hech narsa yozilmaydi (2026-10-15 kelishuvi) |

## 3. Dars ichida nima bo'ladi

1. **Ekranlar** (o'rtacha 18–22): tushuntirish, interaktiv topshiriq, ballik testlar (odatda 5 ta).
2. **Testlar:** har bosish bizning serverga yoziladi (`record_attempt`). Ball faqat birinchi urinishdan.
3. **CodeStrike arenasi** (har darsda **12 ta savol**, uz+ru, har savolga vaqt chegarasi):
   - `student` rejimda: mentor arenani boshlaydi, hamma bir vaqtda javob beradi, har savolga **bitta** javob, javoblar serverga (`submit_answer`), ekranda podium (top-3).
   - `solo` rejimda: o'quvchi arenani o'zi boshlaydi, 12 savolni yechadi, natijani ko'radi, xohlasa qayta o'ynaydi. **Hozir bu mashq: javoblar hech qayerga yozilmaydi.**
   - `review` da arena qulf.
4. **Nishonlar** (har darsda ~4 ta), yakuniy ekran, «Darsni yakunlash» → «Tamom».

## 4. Yakun: `onFinished` JSON

«Tamom» bosilganda dars `onFinished` ga bitta JSON beradi. LMS uni `POST question_try {question_id, answer: <JSON satr>}` qilib yuboradi, keyin `next_lesson_access` chaqiradi.

Asosiy maydonlar (hozirgi v2, 2026-09-24 dan):

| Maydon | Ma'nosi |
|---|---|
| `lessonId`, `lessonTitle{uz,ru}`, `lang` | dars kodi, nomi, o'quvchi tili |
| `liveMode` | `student` / `solo` / `review` / `self` |
| `nickname`, `livePin` | jonli darsdagi ism va sessiya kodi |
| `durationSec`, `startedAt`, `finishedAt`, `totalScreens` | vaqtlar va ekranlar soni |
| `totalQuestions`, `correctAnswers`, `scorePercent` | ballik testlar: soni, birinchi urinishda to'g'ri, foiz |
| `finalScore`, `finalTotal`, `passed` | yakuniy savol bo'yicha 60 foiz mezoni (halol, LMS `correct` ga ta'sir qilmaydi) |
| `questions[]` | har savol: `question_id`, `kind` (`test` yoki `arena`), matn, variantlar, `correct_option`, `correct` (1-urinish), `solved`, `attempts[]` |
| `achievements[]` | olingan nishonlar va vaqti |
| `missed[]`, `retake`, `truncated`, `detailsVersion: 2` | xizmat maydonlari |

**CodeStrike hozir qayerda:** `questions[]` ichida `kind: "arena"` yozuvlar (`question_id: "quiz-0" … "quiz-11"`), har birida bitta urinish va `correct`. Ular **faqat `student` rejimda** bor. `solo` da arena mashq bo'lgani uchun JSON'da arena yozuvi yo'q. Ballga (`scorePercent`) arena kirmaydi.

Hajm: 5–7 KB, 48 KB dan oshsa qisqartiriladi (`truncated: true`).

## 5. Muhr va takror

- Bir ochilish ichida JSON **muhrlanadi**: «Tamom» qayta bosilsa yoki F5 bo'lsa aynan o'sha baytlar ketadi (409 bo'lmasligi uchun).
- Dars ichidagi «Qaytadan» (mashq-o'tishi) natijaga kirmaydi: JSON'da **birinchi o'tish** ketadi (`retake.pressed: true` belgisi bilan).
- `review` rejimida tugagan darsni qayta ochib «Tamom» bossa **ikkinchi natija** ketadi (yangi `question_try` yozuvi). LMS bunga mukofot bermaydi, lekin yozuv paydo bo'ladi.

## 6. LMS tomonida keyin nima bo'ladi

1. `question_try` → 200, `correct: true`, `answer` saqlanadi.
2. `next_lesson_access` → `{"success":"completed", "target":{lesson_id,…}, "points", "coins", "strike_added": false, …}` → o'quvchi kurs sahifasiga qaytadi, dars «✓».
3. Class darsiga «mavzu» orqali bog'langan darslar (BELONGS ustuni: masalan Practice «Uyga vazifa») LMS qoidasi bo'yicha ochiladi.

## 7. Bugungi chegaralar (taklif shulardan kelib chiqadi)

| # | Chegara | Oqibat |
|---|---|---|
| 1 | LMS JSON ichini o'qimaydi | «CodeStrike bajarildimi» qarorini LMS hech qayerdan ololmaydi |
| 2 | `solo` da arena yozilmaydi | uyda o'tgan o'quvchining CodeStrike natijasi yo'q |
| 3 | Darsga kirmagan o'quvchidan JSON umuman ketmaydi | «natija yo'q» holatini faqat LMS biladi |
| 4 | `review` da qayta «Tamom» ikkinchi JSON beradi | qaror faqat birinchi natijadan olinishi kerak |
| 5 | CodeStrike natijasi `questions[]` ichida, alohida ustki maydon yo'q | LMS'ga qazib o'qish qiyin |

Bu beshtasi ikkinchi hujjatda yopiladi.
