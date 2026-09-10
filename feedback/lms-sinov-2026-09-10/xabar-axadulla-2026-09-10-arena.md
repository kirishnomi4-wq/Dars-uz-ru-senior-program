# Axadulla'ga xabar (2026-09-10) — foydalanuvchi yuboradi

Assalomu alaykum, Axadulla.

Bugun yangi yig'ma bilan to'liq jonli dars o'tkazdik (mentor + 2 o'quvchi, guruh 1072). Natija bo'yicha ikkita yaxshi xabar va bitta taklif bor.

**1. Bugungi natija.** `sess_956510_20260910T091454Z` — School API javobi HTTP 201, `GET /lesson-results/{event_id}` bilan tasdiqladik (2 o'quvchi, o'rinlar 1 va 2, vaqtlar `Z` bilan to'g'ri saqlangan, kechagi tuzatuvingiz ishlayapti).

**2. onFinished JSON topildi.** LMS front uni `POST /app/index.php?action=question_try` so'rovida `answer` maydoni ichida yuboradi (`question_id: 16594`, o'quvchi 31352). Ichida `lang`, `questions[]`, `achievements[]` bor, har urinishda `elapsed_ms` va `at` har xil — kechagi ikki topilma (elapsed 0, bir xil vaqt) yopilgan. Namuna-fayl ilova: `onfinished-nigora-solo-140613.json`.

**3. Taklif: batafsil natijani (analitikani) `lesson-results` ichida ham yuboraylik.**

Nega. Hozir batafsil natija (har savolga urinishlar, vaqtlar, yutuqlar) faqat `onFinished` orqali keladi. `onFinished` esa o'quvchi dars oxirida «Tamom» tugmasini bosgandagina ishlaydi. Jonli darsda o'quvchi tabni yopib ketsa yoki «Tamom»ni bosmasa, bu ma'lumot sizga umuman yetib bormaydi. `lesson-results` esa mentor darsni yopganda serverimizdan har doim ketadi, o'quvchi nima bosganidan qat'i nazar, va unda arena (CodeStrike) javoblari ham bor.

Nima o'zgaradi. `TZ_LESSON_RESULT_DETAILS_RU` dagi **A-variant** (§4): `lesson-results` ichida har o'quvchi obyektiga uchta ixtiyoriy maydon qo'shiladi — `lang`, `questions[]`, `achievements[]`. Shakli `onFinished` dagi bilan bir xil (siz allaqachon qabul qilayotgan format). Qo'shimcha: `questions[]` ichida arena savollari `kind: "arena"` bilan keladi (§7, 3-savol). Ball va coin o'zgarmaydi: `correct_answers`, `rank`, `total_questions` avvalgidek faqat dars-testlaridan (`kind: "test"`), arena ballga kirmaydi.

Arena elementining namunasi (bugungi darsdan):
```json
{ "question_id": "quiz-3", "kind": "arena", "order": 9, "correct": true, "solved": true,
  "attempts": [ { "n": 1, "option": 2, "correct": true, "elapsed_ms": 4120, "at": "2026-09-10T09:25:19Z" } ],
  "question": "…", "options": ["…", "…", "…", "…"], "correct_option": 2 }
```
Arena savollari faqat jonli darsda bo'ladi (mustaqil rejimda arena mashq, yozilmaydi). Hajm: bir o'quvchiga eng ko'pi 5 test + 12 arena, TZ limitlari ichida (≤ 200 savol, ≤ 10 urinish, tana ≤ 1 MB).

`onFinished` o'z joyida qoladi (u sizda keyingi darsni ochish uchun ham ishlayapti). Unda ham arena savollari `kind: "arena"` bilan chiqa boshlaydi. **Iltimos, ballni `questions.length` dan emas, `totalQuestions` / `correctAnswers` maydonlaridan oling** (yoki faqat `kind: "test"` elementlarini sanang), aks holda arena qo'shilganda foiz buzilib ketadi.

**Sizdan kerak bo'lgan javoblar:**

| № | Savol | Javob |
|---|---|---|
| 1 | A-variantni yoqamizmi — `lesson-results` ichida `lang`, `questions[]`, `achievements[]`? | ha / yo'q |
| 2 | Arena savollari `kind: "arena"` bilan kerakmi (ballga kirmaydi)? | ha / yo'q |
| 3 | School API yangi maydonlarni qachondan qabul qiladi (avval test-konturda)? Noma'lum maydonni rad etmaydimi (422)? | sana |
| 4 | Sizda ball `totalQuestions`/`correctAnswers` dan olinadimi, `questions.length` dan emasmi? | ha / yo'q |

Siz «ha» desangiz, bizning tomonda kod tayyor, faqat serverda bitta sozlama yoqiladi (`RESULT_DETAILS=a`), keyin avval staging'da bitta test-dars bilan tekshirib, so'ng prod'ga o'tkazamiz.

Rahmat.
