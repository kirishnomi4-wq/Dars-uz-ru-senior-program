# CodeStrike → Learn: taklif, kim nima qiladi

**Kimga:** Abdulloh (LMS IT jamoasi)
**Kimdan:** Azizbek (Academ-Developer) · 2026-10-23 · F-1023-01
**Asos:** `01-HOZIRGI-LOGIKA-UZ.md` (bugungi mexanizm)

> Qisqacha: har JSX darsda CodeStrike arenasi (12 savol) bor. O'quvchi uni darsda **7 va undan ko'p** to'g'ri yechsa, Learn darsi unga kerak emas: avtomatik «completed». 7 dan kam yechsa yoki umuman yechmasa, Class «completed» bo'ladi, lekin bog'langan **Learn ochiladi**: o'quvchi o'sha 12 savolni LMS testi sifatida qayta yechadi. Biz JSON'ga bitta tayyor maydon (`codestrike`) qo'shamiz, LMS shu maydonga qarab Learn'ni ochadi yoki yopadi.

---

## 1. Qoida

| Holat | Class | Learn |
|---|---|---|
| CodeStrike'da **7–12** to'g'ri | completed | completed (avtomatik, o'quvchi ko'rmaydi yoki «bajarildi» ko'rinadi) |
| CodeStrike'da **0–6** to'g'ri | completed | **ochiladi**, o'quvchi yechishi kerak |
| CodeStrike **o'ynalmagan** (mentor arenani boshlamagan, o'quvchi arenani o'tkazib yuborgan) | completed | **ochiladi** |
| Darsga **kelmagan** o'quvchi | Class'ni uyda o'zi ochadi (solo), arena shu yerda yechiladi, keyin yuqoridagi uch qatordan biri | |
| JSON'da `codestrike` maydoni **yo'q** (eski dars fayli) | completed | ochilmaydi (xavfsiz sukut, relizgacha) |

- Chegara: **7 / 12** (58 foiz). Bir savolga bitta javob, qayta o'ynash hisobga kirmaydi.
- Qaror **birinchi natijadan**: dars ichidagi «Qaytadan» va `review` rejimidagi takror «Tamom» qarorni o'zgartirmaydi.
- Learn → uyga vazifa (Practice) tartibi: Learn ochilgan o'quvchi uyga vazifaga Learn'ni bajargach o'tadi. Bu LMS'ning tayyor bog'lash mantig'i («mavzu» / BELONGS), biz tegmaymiz.
- Learn ichidagi o'tish qoidasi (urinishlar, ball) LMS'niki, bu hujjatda belgilanmaydi.

## 2. Signal: `onFinished` JSON'ga yangi maydon

Ustki darajada, `questions[]` ni qazish shart emas:

```json
"codestrike": {
  "played": true,
  "total": 12,
  "answered": 11,
  "correct": 8,
  "percent": 67,
  "passed": true,
  "mode": "student"
}
```

| Maydon | Ma'nosi |
|---|---|
| `played` | o'quvchi arenada kamida bitta savolga javob berganmi |
| `total` | arenadagi savollar soni (hozir hamma darsda 12) |
| `answered` | javob berilgan savollar |
| `correct` | to'g'ri javoblar (har savolga bitta urinish) |
| `percent` | `correct / total`, butun son |
| `passed` | `correct >= 7` (chegara darsning ichida, `total` o'zgarsa qoida `>= ceil(total * 7/12)`) |
| `mode` | `student` (sinfda, mentor bilan) yoki `solo` (yolg'iz) |

Qoidalar:
- `played: false` bo'lsa `answered: 0`, `correct: 0`, `passed: false`.
- Maydon **har doim** bor (yangi fayllarda), `review` rejimida ham: u yerda birinchi natija takrorlanadi.
- `detailsVersion` 2 → **3** (yangi maydon paydo bo'lganini bildiradi). Eski fayllarda `codestrike` yo'q: LMS buni «noma'lum» deb oladi va Learn'ni ochmaydi.
- `questions[]` ichidagi `kind: "arena"` yozuvlar o'z joyida qoladi (tafsilot kerak bo'lsa).

## 3. Oqim

```
O'quvchi darsni ochadi (student yoki solo)
  → ekranlar, testlar
  → CodeStrike: 12 savol, bitta javob/savol  → correct hisoblanadi
  → «Tamom» → onFinished JSON (+ codestrike)
LMS: question_try saqlaydi (hozirgidek, correct:1)
  → answer ichidan codestrike.passed o'qiydi
  → passed=true  → bog'langan Learn = completed
  → passed=false → bog'langan Learn = ochiq, majburiy
  → next_lesson_access shunga qarab target beradi
  → Learn bajarilgach → Practice (uyga vazifa) ochiladi (LMS tayyor mantiq)
```

## 4. Biz nima qilamiz (JSX + Dars API)

| # | Ish | Izoh |
|---|---|---|
| B1 | `codestrike` maydoni umumiy modulda (`src/live`), hamma darsga bir yo'la | kod bir joyda, 182 dars qayta yig'iladi |
| B2 | **`solo` da arena natija beradi**: birinchi o'ynash hisoblanadi, javoblar yoziladi; qayta o'ynash mashq bo'lib qoladi | hozir solo arena mashq, bu o'zgaradi |
| B3 | «Qaytadan» va `review` da `codestrike` birinchi natijadan | muhr mexanizmi bor, shunga qo'shiladi |
| B4 | Learn uchun savollar: har dars uchun 12 savol uz+ru, LMS import formatida JSON (182 fayl, skript bilan) | format LMS'dan keladi, yuklashni Azizbek o'zi qiladi |
| B5 | Sinov fayli: InternetLesson (lesson 2374 ↔ Learn 3148) staging'ga | birga E2E uchun |
| B6 | To'liq reliz: hamma dars CRM'ga qayta yuklanadi | keyinroq, alohida kelishiladi |

Bizning tomonda LMS'ga yangi so'rov, yangi endpoint, token o'zgarishi **yo'q**. Faqat JSON kengayadi.

## 5. IT jamoasi nima qiladi (LMS)

| # | Ish | Izoh |
|---|---|---|
| I1 | `question_try` kelganda `answer` JSON'idan `codestrike.passed` o'qish | maydon yo'q bo'lsa → «noma'lum», Learn ochilmaydi |
| I2 | Class darsiga bog'langan Learn'ni `passed` ga qarab **completed** yoki **ochiq** qilish | bog'lash «mavzu» (BELONGS) orqali, CRM'da qo'lda |
| I3 | `next_lesson_access` target: `passed=false` → Learn, `passed=true` → keyingi dars | |
| I4 | Qaror faqat **birinchi** `question_try` dan; keyingi yozuvlar (review) Learn holatini o'zgartirmaydi | |
| I5 | Learn → Practice tartibi: Learn bajarilmaguncha uyga vazifa ochilmaydi | tayyor deb aytildi, tasdiqlash kifoya |
| I6 | Learn savollarini JSON'dan import qilish formati (namuna) | B4 shu formatga quriladi |
| I7 | Staging'da birga sinov (6-bo'lim) | |

## 6. Qabul sinovlari (staging, InternetLesson 2374 + Learn 3148)

| # | Holat | Kutilgan |
|---|---|---|
| T1 | Sinfda (student), arenada 8/12 | Class ✓, Learn completed, keyingi dars ochiq |
| T2 | Sinfda, arenada 5/12 | Class ✓, Learn ochiq, uyga vazifa qulf; Learn bajarilgach uyga vazifa ochiq |
| T3 | Sinfda, mentor arenani boshlamagan | `played:false` → Learn ochiq |
| T4 | Uyda (solo), arenada 7/12 | Learn completed |
| T5 | Uyda (solo), arenada 3/12, keyin qayta o'ynab 12/12 | birinchi o'ynash hisob: Learn ochiq |
| T6 | T2 dan keyin review'da qayta «Tamom» | Learn holati o'zgarmaydi |
| T7 | Eski dars fayli (maydonsiz) | Learn ochilmaydi, xato yo'q |
| T8 | `answer` JSON buzilgan yoki bo'sh | LMS xato bermaydi, Learn ochilmaydi, log |

## 7. Muddat

| Qadam | Kim | Qachon |
|---|---|---|
| Hujjat kelishuvi + I6 format namunasi | ikkala tomon | shu hafta |
| B1–B3 kod + B5 sinov fayli staging'ga | biz | kelishuvdan 2 ish kuni |
| I1–I5 | IT | o'zlari aytadi |
| T1–T8 birga | ikkala tomon | ikki tomon tayyor bo'lgach |
| B4 JSON + yuklash, B6 to'liq reliz | biz | alohida kelishiladi (shoshilmaymiz) |

## 8. Ochiq savollar (IT'ga)

1. `next_lesson_access` javobidagi `strike_added` nima? CodeStrike uchun ularda allaqachon boshlangan mexanizm bo'lsa, shu taklif unga ulanadi.
2. Learn savollari uchun JSON import formati (I6): bitta namuna fayl.
3. Learn «completed» bo'lgan o'quvchida u ro'yxatda ko'rinadimi (✓ bilan) yoki yashirinadimi? Ikkalasi ham bizga ma'qul, bilib qo'yish kerak.
4. `answer` ustunining chegarasi: JSON +150 bayt o'sadi, 48 KB qisqartirish o'z kuchida. Muammo yo'qligini tasdiqlash.
