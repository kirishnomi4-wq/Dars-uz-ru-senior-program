`# TZ: o'quvchi natijasining tafsilotini LMS'ga yo'qotmasdan yetkazish

**Sana:** 2026-09-15 · **Kimga:** Axadulla (LMS integratsiya / School API) · **Kimdan:** Dars-platforma jamoasi
**Holat:** taklif, javobingiz kutiladi. Avvalgi hujjat: `TZ_LESSON_RESULT_DETAILS_RU.md` (§4 A-variant, §9 C-variant).

---

## 1. Qisqacha

Hozir o'quvchi natijasining **tafsiloti** (har savol, urinishlar, vaqt, yutuqlar, arena) LMS'ga faqat `onFinished` orqali boradi.
`onFinished` esa faqat o'quvchi dars oxirida **«Tamom»** tugmasini bosganda ishlaydi. Bosmasa, tafsilot LMS'ga umuman yetmaydi.

**Taklif:** xuddi shu tafsilotni bizning serverimiz `lesson-results` ichida ham yuborsin (A-variant). `onFinished` o'z joyida qoladi.
Shakl sizga tanish: `onFinished` dagi `lang`, `questions[]`, `achievements[]` bilan bir xil.

---

## 2. Hozir natija qanday yetib boradi

| | `onFinished` (dars sahifasi) | `lesson-results` (bizning server → School API) |
|---|---|---|
| **Kim yuboradi** | O'quvchi brauzeridagi dars | Bizning server |
| **Qachon** | O'quvchi yakun ekranida «Tamom»ni bosganda, bir marta | **Jonli:** mentor «Erkin qilish»ni bosganda yoki mentor yangi sessiya ochganda, yoki sessiya 30 daqiqa jim qolganda. **Mustaqil:** o'quvchi oxirgi ekranga yetganda yoki 7 kun o'tganda |
| **Kimlar uchun** | Faqat «Tamom»ni bosgan o'quvchi | Sessiyaga kirgan hamma o'quvchi |
| **Ichida** | `correctAnswers`, `totalQuestions`, `answers` + tafsilot (`lang`, `questions[]`, `achievements[]`, arena) | `correct_answers`, `answered`, `rank`, `badges`, `duration_sec`, `total_questions`. **Tafsilot yo'q** |
| **Yetmasa** | Bizga noma'lum (LMS front `question_try` so'rovini qayta yuboradimi, bilmaymiz) | Qayta urinish: 1 s → 3 s → 10 s → 1 daq → 5 daq → 15 daq → har soat, jami 30 marta (~24 soat). 401/403/404/409/422 bo'lsa to'xtaydi, bizga ogohlantirish keladi |
| **Takror** | — | Bir xil `event_id` → `200`, `duplicate: true` |

---
    
## 3. Muammo: tafsilot qaysi holatlarda yo'qoladi

| № | Holat | `onFinished` | `lesson-results` |
|---|---|---|---|
| 1 | O'quvchi yakun ekraniga yetdi, lekin «Tamom»ni bosmay oynani yopdi | ❌ tafsilot yo'q | ✅ ketadi |
| 2 | O'quvchi dars o'rtasida tabni yoki brauzerni yopdi | ❌ | ✅ (jonli: mentor darsni yopganda) |
| 3 | «Tamom» bosilgan lahzada internet uzildi | ⚠️ LMS front qayta yuborsagina | ✅ serverda qayta urinish bor |
| 4 | Mentor darsni erta yopdi, o'quvchi oxirgi ekranga yetmadi | ❌ | ✅ |
| 5 | Mentor darsni yopmay ketib qoldi | ❌ (o'quvchi «Tamom»ni bosmasa) | ✅ 30 daqiqa jimlikdan keyin |
| 6 | O'quvchi darsni boshqa qurilmada davom ettirdi | ⚠️ urinishlar tarixi va vaqtlar yo'q, faqat yakuniy javob | ✅ tarix serverda saqlanadi |
| 7 | Mustaqil rejimda o'quvchi darsni tugatmadi | ❌ | ✅ 7 kundan keyin (tugatilmagan deb) |
| 8 | Arena (CodeStrike) javoblari | ⚠️ faqat «Tamom» bosilsa | ✅ har doim |
| 9 | Ball ikki manbadan olinadi (`correctAnswers` va `correct_answers`) | Ikkalasi farq qilishi mumkin: biri kelmasa yoki kechiksa | Bitta manba bo'lsa, farq bo'lmaydi |

**Isbot holati:** 10-sentabr sinovida `onFinished` faqat **mustaqil** rejimda topildi (`question_try`, o'quvchi 31352).
**Jonli** darsdagi `onFinished` namunasini 11-sentabrda so'radik, hali yo'q. Ya'ni jonli darsda tafsilot LMS'ga yetib borayotgani hozircha tasdiqlanmagan.

Jonli darsda 1, 2, 4 va 5-holatlar tabiiy: 20 kishilik sinfda bir nechta o'quvchi «Tamom»gacha yetmaydi yoki uni bosmaydi.

---

## 4. Yechim: tafsilot `lesson-results` ichida ham ketadi (A-variant)

### 4.1. Nima qo'shiladi
Har o'quvchi obyektiga (`StudentResult`) uchta **ixtiyoriy** maydon qo'shiladi. Eski maydonlar o'zgarmaydi, tafsilotsiz eski hodisalar ham to'g'ri bo'lib qoladi.

```json
{
  "student_id": 31352, "id_type": "lms",
  "correct_answers": 4, "answered": 5, "rank": 1, "badges": ["top_1"], "duration_sec": 1540, "completed": true,
  "lang": "uz",
  "questions": [
    { "question_id": "s4", "kind": "test", "order": 1,
      "question": "…", "options": ["…", "…", "…", "…"], "correct_option": 1, "correct_answer": "…",
      "correct": true, "solved": true,
      "attempts": [ { "n": 1, "option": 1, "answer": "…", "correct": true, "elapsed_ms": 4200, "at": "2026-09-10T09:18:03Z" } ] },
    { "question_id": "quiz-3", "kind": "arena", "order": 9,
      "question": "…", "options": ["…", "…", "…", "…"], "correct_option": 2, "correct_answer": "…",
      "correct": true, "solved": true,
      "attempts": [ { "n": 1, "option": 2, "answer": "…", "correct": true, "elapsed_ms": 4120, "at": "2026-09-10T09:25:19Z" } ] }
  ],
  "achievements": [ { "id": "firstwin", "name": "Bullseye!", "title": "…", "earned_at": "2026-09-10T09:18:03Z" } ]
}
```

Maydonlar va chegaralar `TZ_LESSON_RESULT_DETAILS_RU.md` §4 va §6 (OpenAPI qoralamasi) dagidek. Qisqa ro'yxat:

| Maydon | Qoida |
|---|---|
| `lang` | `uz` yoki `ru`: o'quvchi darsni qaysi tilda o'tgan bo'lsa, matnlar shu tilda |
| `questions[]` | ≤ 200. Faqat o'quvchi javob bergan savollar. Avval dars testlari, keyin arena |
| `kind` | `test` — ballga kiradi · `arena` — ballga kirmaydi (faqat jonli dars, bitta urinish) |
| `correct` | **Birinchi urinish** to'g'rimi. `correct_answers` shu bo'yicha sanaladi |
| `solved` | Oxir-oqibat to'g'ri javobga yetdimi (`attempts` ichida to'g'ri urinish bor) |
| `attempts[]` | 1..10 · `elapsed_ms` 0..3 600 000 · `at` ISO UTC |
| `question`, `options[]`, `correct_answer` | har matn ≤ 300 belgi, variantlar ≤ 6 |
| `achievements[]` | ≤ 20 · `id` `[a-z0-9_-]{1,32}` · `name` ≤ 40 · `title` ≤ 200 · `earned_at` ISO UTC |

### 4.2. Qoidalar
1. **Ball o'zgarmaydi.** `correct_answers`, `answered`, `total_questions`, `rank`, `badges` avvalgidek faqat `kind: "test"` bo'yicha sanaladi.
   Ballni `questions.length` dan hisoblamang: arena qo'shilgani uchun foiz buziladi.
2. **Tafsilot asosiy natijani to'smaydi.** Tafsilot chegaradan oshsa yoki tana 1 MB dan katta bo'lsa, faqat tafsilot tashlanadi.
   Asosiy natija (ball, o'rin, nishonlar) baribir ketadi, bizda ogohlantirish yoziladi.
3. **Idempotentlik o'zgarmaydi.** Tafsilot o'sha hodisaning bir qismi, `event_id` o'sha. Yuborilgan hodisa keyin o'zgartirilmaydi.
4. **Hajm:** 30 o'quvchi × 12 savol × 3 urinishgacha ≈ 100–150 KB bitta hodisaga.
5. **`onFinished` o'chirilmaydi.** U LMS'da keyingi darsni ochish uchun ham ishlatiladi va o'z tafsilotini yuborishda davom etadi.
6. **Asosiy manba taklifi:** analitika uchun `lesson-results` dagi tafsilot, `onFinished` esa zaxira. Ikkalasi bir xil shaklda,
   shuning uchun ularni `lessonId`/`lesson_id` va o'quvchi bo'yicha solishtirish mumkin.

---

## 5. Bizning tomonda nima tayyor

- Server tafsilotni yig'ish va yuborish kodi tayyor: urinishlar tarixi, yutuq vaqtlari, arena javoblari serverda saqlanadi.
- Yoqish serverdagi bitta sozlama bilan: `RESULT_DETAILS=a`. Hozir staging'da ham, prod'da ham **o'chiq** (`off`).
- School API kontrakti (`dars-platform-openapi.yaml`) faqat ixtiyoriy maydonlar bilan kengayadi, majburiy maydon qo'shilmaydi.

---

## 6. Yoqish tartibi (sizning «ha» javobingizdan keyin)

| Qadam | Kim | Nima | Tekshiruv |
|---|---|---|---|
| 1 | LMS | Test konturingizda School API yangi ixtiyoriy maydonlarni qabul qiladi | Noma'lum maydon uchun `422` qaytmaydi |
| 2 | Biz | Staging'da `RESULT_DETAILS=a` | Server `health` javobida `result_details: "a"` |
| 3 | Birgalikda | Bitta test-dars: mentor + 2 o'quvchi, bittasi «Tamom»ni bosmaydi | `GET /lesson-results/{event_id}`: ikkala o'quvchida ham `questions[]` bor |
| 4 | Birgalikda | Solishtirish | `correct_answers` = `questions` ichidagi `kind: "test"` va `correct: true` soni; matnlar o'quvchi ekranidagi bilan bir xil |
| 5 | Biz | Prod'da yoqish | Birinchi jonli darsdan keyin bitta hodisa tekshiriladi |

Orqaga qaytarish: `RESULT_DETAILS=off`. Kod o'zgarmaydi, asosiy natija avvalgidek ketadi.

---

## 7. Sizdan kerak bo'lgan javoblar

| № | Savol | Javob |
|---|---|---|
| 1 | Tafsilot `lesson-results` ichida ham ketsinmi (A-variant)? | ha / yo'q |
| 2 | Arena savollari (`kind: "arena"`, ballga kirmaydi) kerakmi? | ha / yo'q |
| 3 | School API yangi ixtiyoriy maydonlarni qachondan qabul qiladi (avval test konturda)? Noma'lum maydonga `422` bermaydimi? | sana |
| 4 | Ball `totalQuestions` / `correctAnswers` dan olinadimi (`questions.length` dan emasmi)? | ha / yo'q |
| 5 | LMS front `question_try` (onFinished) so'rovi yiqilsa, uni qayta yuboradimi? | ha / yo'q |
| 6 | Jonli darsdagi `onFinished` yozuvidan bitta namuna (`question_try`, o'quvchi 31352, 2026-09-10, ~09:26 UTC) | JSON |
| 7 | Tafsilot ikki joydan kelsa, sizda qaysi biri asosiy bo'ladi? Taklifimiz: `lesson-results` | lesson-results / onFinished |

---

## 8. Agar javob «yo'q» bo'lsa

Faqat `onFinished` bilan qolamiz. Bu holda quyidagilarni ochiq qabul qilamiz:
- «Tamom»ni bosmagan o'quvchining tafsiloti (savollar, urinishlar, yutuqlar, arena) LMS'da bo'lmaydi (3-bo'lim, 1, 2, 4, 5, 7-holatlar);
- boshqa qurilmada davom etgan o'quvchida urinishlar tarixi to'liq bo'lmaydi (6-holat);
- ball va o'rin baribir `lesson-results` orqali hammaga ketadi, chunki bu o'zgarmaydi.

---

## 9. Qabul mezonlari

- [ ] Jonli darsda «Tamom»ni bosmagan o'quvchining ham `questions[]` va `achievements[]` LMS'da bor.
- [ ] `correct_answers` tafsilotdagi `kind: "test"`, `correct: true` soniga teng.
- [ ] Arena savollari `kind: "arena"` bilan keladi va ballga ta'sir qilmaydi.
- [ ] Tafsilot yoqilganda ham takror yuborish `duplicate: true` beradi, ikkinchi tanga hodisasi chiqmaydi.
- [ ] Katta tafsilotda asosiy natija baribir yetadi.
- [ ] `RESULT_DETAILS=off` qilinsa, hammasi avvalgi holatga qaytadi.
