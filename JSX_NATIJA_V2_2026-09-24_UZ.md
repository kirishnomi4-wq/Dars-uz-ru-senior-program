# Dars (JSX) yakunida LMS'ga nima ketadi — v2: oldin, endi va sinov natijasi

**Kimga:** Shaxzod (product manager) · Axadulla (LMS integratsiya)
**Kimdan:** Azizbek (Academ-Developer) · 2026-09-24
**Asos:** 23.09 dagi «Dars yakunida LMS'ga nima bera olamiz» hujjati (3-bo'lim: bor, lekin yuborilmayotgan bandlar) · 24.09 staging sinovi (InternetLesson, 2848 sinov-joyi, uch o'tish)

> Qisqacha: dars yakunida `onFinished` orqali ketadigan JSON **kengaytirildi** — 7 yangi maydon qo'shildi, eski maydonlar o'zgarmadi.
> LMS tomonda hech narsa o'zgartirish shart emas. 24.09 da staging'da uch xil rejimda sinadik: LMS uchalasini
> **200** bilan saqladi, o'quvchi ekranida **hech qanday xato chiqmadi**. Hozircha faqat bitta dars (InternetLesson) yangi
> shaklda; siz «ha» desangiz, qolgan 103 darsga va 18 uyga vazifa paketiga tarqatamiz.

---

## 1. Oldin nima ketardi (24.09 gacha, hamma darsda hozir ham shu)

| Maydon | Ma'nosi |
|---|---|
| `lessonId`, `lessonTitle` | dars kodi va nomi `{uz, ru}` |
| `lang` | o'quvchi qaysi tilda o'tdi |
| `nickname`, `livePin`, `liveMode` | jonli darsdagi ism, PIN, rejim (27 darsda) |
| `durationSec` | ochilishdan yakungacha soniya |
| `totalQuestions`, `correctAnswers`, `scorePercent` | ballik test soni, birinchi urinishda to'g'ri, foiz |
| `finalScore`, `finalTotal`, `passed` | yakuniy savol bo'yicha ball va 60 foiz mezoni |
| `questions[]` | har savol: `question_id`, `kind`, `order`, matn, `options`, `correct_option`, `correct_answer`, `correct`, `solved`, `attempts[]` (har bosish: `n`, `option`, `answer`, `correct`, `elapsed_ms`, `at`) |
| `achievements[]` | nishonlar: `id`, `name`, `title`, `earned_at` |
| `answers[]` | eski shakl, `questions[]` bilan bir xil ma'lumot |

Real hajm: 5,7–6,2 KB (InternetLesson, 5 savol).

## 2. Endi nima qo'shildi (v2)

| Yangi maydon | Ma'nosi | Halol chegara |
|---|---|---|
| `detailsVersion: 2` | sxema raqami — analitika qaysi maydon qachondan borligini biladi | eski payloadda bu maydon yo'q, `undefined` = v1 |
| `missed[]` | birinchi urinishda xato qilingan test-savollar `question_id` ro'yxati | `questions[]` dan ham chiqadi, qulaylik uchun |
| `totalScreens` | darsdagi ekranlar soni | |
| `startedAt`, `finishedAt` | o'tish boshlanishi va yakuni, UTC ISO | «Qaytadan» bosilgan bo'lsa `startedAt` — oxirgi o'tish boshi |
| `retake` | `{pressed: false}` · `{pressed: true, lastPass: {totalQuestions, correctAnswers, scorePercent, durationSec}}` · `null` = bilib bo'lmadi | necha marta bosilgani hisoblanmaydi; asosiy raqamlar avvalgidek **birinchi** o'tishdan |
| `truncated` | hajm-shifti ishlagan bo'lsa `true` + `truncatedFields[]` (nima qisqargani); odatda `false` | shift 48 KB (pastda) |

Qo'shilishi kutilgan hajm: +300–500 bayt. Sinovda 6,1 KB.

## 3. Nima o'zgarmadi

- `passed`, `scorePercent`, `questions[]` — **halol**, haqiqiy natija. 22.09 da kelishilganidek soxta `true` qilinmaydi.
- `onFinished` faqat haqiqiy yakunda, «Tamom» tugmasidan. Avtomatik chaqiruv yo'q.
- LMS tomonda o'zgarish **shart emas**: runner payloadni o'qimaydi, satr qilib `question_try.answer` ga yuboradi — sinov shuni tasdiqladi.
- Bir ochilish ichida yuk **muhrlanadi**: qayta bosish, F5 — aynan o'sha baytlar (20.09 dagi 409 qaytmasligi uchun). Yangi maydonlar ham muhr ichida.
- **Hajm-shifti**: 48 KB dan oshsa yuk tartib bilan qisqartiriladi (avval eski `answers[]`, keyin urinishlar, matn, savollar) va `truncated: true` ketadi. O'quvchi hajm sabab xato ko'rmaydi.

## 4. Sinov natijasi — 24.09, staging, InternetLesson, 2848 sinov-joyi

Bitta test-o'quvchi, uch o'tish, uch xil rejim. Har o'tishda savollarda **ataylab xato**, keyin to'g'rilash, oxirigacha, «Tamom».

| Vaqt | Rejim | Natija payloadda | `question_try` | CRM saqladi | `next_lesson_access` | Mukofot |
|---|---|---|---|---|---|---|
| 14:00 | ko'rish (eski urinish) | 1/5, `passed: false` | **200** | to'liq, aynan | **completed** | 3 ball, 3 tanga |
| 14:08 | jonli, `student` | 0/5, `passed: false`, har savolda 2–4 urinish | **200** | to'liq, aynan | **completed** | 0 |
| 14:12 | mustaqil, `solo` | 1/5, `passed: false`, 5/5 keyin yechilgan, 4/4 nishon | **200** | to'liq, aynan | **completed** | 0 |

**Nima isbotlandi:**
- LMS v2 payloadni **uchala rejimda qabul qildi va saqladi**. CRM qaytargan `answer` yuborilgan bilan ma'no bo'yicha aynan bir xil, hech narsa kesilmagan. Yangi maydonlar ichida.
- 14:08 va 14:12 o'tishlari **aynan 22.09 da «Natijani saqlab bo'lmadi» bergan holat**: `passed: false`, birinchi urinishlar xato, keyin to'g'rilangan. Endi LMS «completed» dedi.
- O'quvchi ekranida **qizil xato yo'q** — uchalasida «Tabriklaymiz» oynasi, keyin LMS kurs sahifasiga o'tdi, dars «✓» bo'ldi.
- LMS va CRM tomonda 4xx, 5xx, 409 — **0** (HAR to'liq ko'rildi).
- LMS qayta yakunga mukofot bermadi (ikkinchi va uchinchi o'tishda 0 ball, 0 tanga) — takror yozuv tanga bermaydi.

**Bitta 409 bor edi, lekin u bizning serverdan va o'quvchiga ko'rinmadi:** 14:06 da jonli sessiya tugatildi, bizning server o'quvchi urinishini yakunladi; o'quvchi darsda davom etayotgani uchun keyingi progress-yozuv bizning serverda rad etildi. Klient buni jim qabul qiladi, sarlavha «Yakunlandi — javoblaringiz saqlandi» bo'ldi. LMS'ga aloqasi yo'q.

**«Ikki marta bosish» haqida:** «Darsni yakunlash» faqat oynani ochadi, yuboradigan tugma «Tamom». «Tamom» dan 1 soniya ichida LMS kurs sahifasiga o'tib ketadi, shu sabab bir ochilishda ikkinchi yuborish bo'lmaydi — sinovda ham ikkinchi bosish hech qanday so'rov yubormadi. Yagona takror-yo'l: tugagan darsni qayta ochib (ko'rish rejimi) «Tamom» bosish → yangi kalit → CRM'da yangi yozuv (14:00 dagi o'tish shunday). Xohlasangiz, biz tomondan to'samiz.

## 5. Halol chegaralar (23.09 hujjatidagi 4-bo'lim o'z kuchida)

1. **Yakunlamagan o'quvchi haqida hech narsa ketmaydi.** `totalScreens` va `startedAt` faqat yakunda keladi; «qayerda to'xtadi» savoli LMS tomonida oraliq hodisa (`onProgress`) qabul qilinsa yopiladi. Bu ma'lumot bizning `dars_prod` bazasida bor (23.09 «Analitika» taklifi).
2. **CRM `question_try.answer` ustunining chegarasini bilmaymiz.** 6 KB o'tdi. Axadulladan uch javob kutamiz: ustun turi va uzunligi · so'rov tanasiga chegara · staging va prod bir xilmi. Shunga qarab 48 KB shift qoladi yoki o'zgaradi.
3. **`retake`** faqat bosilgan-bosilmagani va oxirgi o'tish natijasi; nechta marta — yo'q.
4. **Ko'rish rejimida qayta «Tamom»** yangi yozuv beradi (yuqorida). To'sish — qaror sizda.

## 6. Keyingi qadam

| Kim | Nima |
|---|---|
| **Siz** | «Ha» — 103 dars va 18 uyga vazifa paketiga tarqatamiz (bizda 1 kun: to'liq smoke, yuklash papkasi, hujjat yangilanadi). Ko'rish rejimida qayta yuborishni to'saylikmi — ayting |
| **Axadulla** | 5-bo'lim 2-band: ustun turi, so'rov chegarasi, staging = prod? |
| **Shaxzod** | analitikada qaysi savollarga javob kerak — 23.09 hujjatining 2-bo'lim formulalariga solishtirib, yetishmaganini qo'shamiz |

---

## Ilova — real payload namunasi (14:12, `solo` o'tish, staging; ism yashirilgan, 5 savoldan 1 tasi ko'rsatilgan)

```json
{
  "lessonId": "internet-01-v18",
  "lessonTitle": {
    "uz": "Internet qanday ishlaydi",
    "ru": "Как устроен интернет"
  },
  "nickname": "«yashirilgan»",
  "livePin": "237707",
  "liveMode": "solo",
  "durationSec": 216,
  "totalQuestions": 5,
  "correctAnswers": 1,
  "scorePercent": 20,
  "finalScore": 0,
  "finalTotal": 1,
  "passed": false,
  "answers": "[… 19 element, eski shakl]",
  "detailsVersion": 2,
  "lang": "uz",
  "questions": [
    {
      "question_id": "s5b",
      "kind": "test",
      "order": 2,
      "correct": false,
      "solved": true,
      "attempts": [
        {
          "n": 1,
          "option": 0,
          "correct": false,
          "elapsed_ms": 4758,
          "at": "2026-09-24T09:09:43Z",
          "answer": "Brauzer"
        },
        {
          "n": 2,
          "option": 1,
          "correct": false,
          "elapsed_ms": 6404,
          "at": "2026-09-24T09:09:45Z",
          "answer": "Parol"
        },
        {
          "n": 3,
          "option": 2,
          "correct": true,
          "elapsed_ms": 7096,
          "at": "2026-09-24T09:09:45Z",
          "answer": "Domen"
        }
      ],
      "question": "youtube.com, coddycamp.uz — bunday sayt manzili nima deb ataladi?",
      "options": [
        "Brauzer",
        "Parol",
        "Domen",
        "Server"
      ],
      "correct_option": 2,
      "correct_answer": "Domen"
    },
    "… yana 4 savol"
  ],
  "achievements": [
    {
      "id": "firstwin",
      "name": "Bullseye!",
      "title": "Birinchi test savoliga to'g'ri javob berdingiz",
      "earned_at": "2026-09-24T09:09:23Z"
    },
    "… yana 3 nishon"
  ],
  "missed": [
    "s5b",
    "s9",
    "s12",
    "s15"
  ],
  "totalScreens": 22,
  "finishedAt": "2026-09-24T09:12:26Z",
  "truncated": false,
  "retake": {
    "pressed": false
  },
  "startedAt": "2026-09-24T09:08:49Z"
}
```
