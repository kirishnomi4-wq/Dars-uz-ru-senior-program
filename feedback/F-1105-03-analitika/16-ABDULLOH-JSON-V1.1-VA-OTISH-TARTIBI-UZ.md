# Abdullohga: 15-javobingizga javob — JSON v1.1, ikki kanal bog'lanishi, o'tish tartibi, 50 xabar hisoboti

**Sana:** 09.11.2026
**Kimga:** Abdulloh (LMS, CRM, School API)
**Kimdan:** JSX va Dars API jamoasi
**Asos:** `15-ABDULLOH-TOLIQ-JAVOB-UZ.md` (09.11) va `14-ABDULLOH-TOLIQ-UZ.md`
**Ilova:** `16a-REESTR-DARS-CLASS-LEARN.csv` — 172 dars: `lesson_id` + versiya → CRM Class → Learn

Siz so'ragan uchta narsa shu hujjatda: tuzatilgan JSON namunalari (2-bo'lim), brauzer va server bog'lanishi (3-bo'lim), ochiq urinishlar uchun o'tish tartibi (4-bo'lim). 50 ta xabar hisobotining formati va vaqti 5-bo'limda, 17 ta ssenariy 6-bo'limda.

Bitta tuzatish o'zimizdan: 14-hujjatdagi 2.7 jumlamiz eskirgan edi, dalil 1-bo'limda.

| Qism | Nima haqida | Sizdan nima kerak |
|---|---|---|
| 0 | 3.1–3.7 ga qisqa javob | Ko'rib chiqish |
| 1 | 2.7 bo'yicha tuzatish va dalil | Ma'lumot uchun |
| 2 | JSON v1.1 — o'zgargan maydonlar, namunalar, qabul javobi | **Tasdiqlash yoki tuzatish** |
| 3 | Brauzer va server kanali: umumiy kalit, tartib qoidalari | **Tasdiqlash** |
| 4 | Kontent yangilanganda ochiq urinishlar, v1 ni to'xtatish sharti | **Tasdiqlash** |
| 5 | 50 xabar: hisobot formati va tartibi | Format ma'qulmi |
| 6 | 17 ssenariy | Ko'rib chiqish |
| 7 | Keyingi qadam | — |

---

## 0. Sizning 3.1–3.7 ga qisqa javob

| Band | Siz so'ragan | Bizning yechim | Qayerda |
|---|---|---|---|
| 3.1 | Class va Learn bilan versiyalangan moslik | Ilova `16a` reestri: 172 qator, `lesson_id` + `lesson_version` → `class_id`, `learn_id`, material id (uz, ru). Mukofot kaliti `student_id` + `lesson_id`, versiya kirmaydi | 2.1, Ilova A |
| 3.2 | Ikki kanal uchun umumiy identifikator, hodisalar tartibi | Umumiy kalit `attempt_id` ikkala kanalda. Mukofot manbasi — server hodisasi. Tartib qoidalari 3 ta | 3 |
| 3.3 | `duration_sec` 86400 va solo 7 kun ziddiyati | `duration_sec` o'rniga `elapsed_sec` (kalendar, 0…604800) + `last_activity_at`. Qirqish yo'q. Faol vaqt hozir o'lchanmaydi, keyingi versiyada | 2.2 |
| 3.4 | `not_started` to'liq JSON | Namuna C4 | 2.3 |
| 3.5 | Tafsilot tushirilgan belgi | `details` bloki: `status`, `reason`, `available` | 2.2 |
| 3.6 | Ochiq urinishlar va v1 to'xtatish | Versiya urinishga va kalitlarga yoziladi; eski urinish o'z versiyasida yakunlanadi; v1 to'xtash sharti aniq | 4 |
| 3.7 | `201` ma'nosi, v1 va v2 javobi | `201` = saqlandi; qo'llash holati alohida so'rovda; v1/v2 jadvali. Yakuniy sxema sizda | 2.4 |
| 2.7 | Bo'sh `badges` ni rad etgan payload va `request_id` | Bu 17.09 dagi holat, 18.09 da tuzatilgan. Jumlamiz eskirgan | 1 |
| yangi | Tafsilot tugatgan o'quvchilarda yo'qolayotgani (09.11 topilma) | `answered` = `questions` tengligi bekor, qisman tafsilot (`details.status: partial`). **Savol:** School API bu tenglikni tekshiradimi? | 2.2 |

---

## 1. Tuzatish: bo'sh `badges` (sizning 2.7)

14-hujjatda «hozir School API bo'sh massivni 422 bilan rad etadi» deb yozgan edik. Bu **eskirgan**. Dalil:

| | |
|---|---|
| Qachon | 2026-09-17, staging |
| Xato | `HTTP 422 The students.0.badges field is required.` (Laravel `required` bo'sh massivni «maydon yo'q» deb olgan) |
| Payload | `badges: []`, `badges_count: 0`, `answered: 0`, `completed: false` (7 kunlik avto-yopilish) |

| `event_id` | `request_id` | Vaqt |
|---|---|---|
| `solo_31347_internet-01-v18_20260910T050107Z` | `2c214518-1c1b-4e99-b9aa-3b95038e4083` | 17.09 05:12 UTC |
| `solo_35813_internet-01-v18_20260908T130054Z` | `c65f9d7c-bbc9-4678-a680-1708a5c11fd2` | 15.09 13:07 UTC |
| `solo_34174_agent-arch-06-04-v18_20260908T053511Z` | `6360d066-86ce-4aad-8a90-ba7cad3f3995` | 15.09 05:37 UTC |

Axadulla 17.09 da School API'da `fix: accept empty Dars platform badges` (`present|array`) ni chiqardi. 18.09 da uchala xabar **o'sha payload bilan** (`badges: []` o'zgarmagan) qayta yuborildi — uchalasi `201`. Shundan beri bo'sh massiv qabul qilinadi; sizning lokal validatoringizda taqiq yo'qligi shunga mos.

Bizning serverda o'sha kunlardan ikki zaxira qolgan: nishonsiz o'quvchiga `participant` nishoni qo'shiladi va «bo'sh bo'lmasin» qoidasi tekshiriladi. **v1.1 da:** `badges: []` oddiy holat, `participant` zaxira-nishoni olib tashlanadi — qatnashish endi `result.participated` maydonida aniq turadi. Agar LMS'da `participant` nishoniga biror mantiq bog'langan bo'lsa, ayting — qoldiramiz.

---

## 2. JSON v1.1

Asos — 14-hujjat 2-bo'limi. Bu yerda faqat **o'zgargan** joylar va to'liq namunalar.

### 2.1. Umumiy qismga qo'shilgan maydonlar

| Maydon | Ma'nosi |
|---|---|
| `attempt_id` | Urinish id'si (UUID, Dars API bazasi). Jonli va uyda — har o'quvchining shu darsdagi har urinishi uchun bitta. **Brauzer kanalida ham shu id ketadi** (3-bo'lim) — ikki kanalni bog'laydigan kalit |
| `lesson_version` | **Reestr versiyasi** (`v5`, `v6`, `v7`, `v8`), LMS'ga yuklangan fayl versiyasi bilan bir xil (`16a` reestri, LMS'dagi fayl nomi `13-DeployLesson-v5.jsx`). 14-hujjatda `v19` deb yozilgani `lesson_id` ichidagi tarixiy qo'shimcha edi — u kontent o'zgarganda o'zgarmaydi, shuning uchun versiya sifatida yaramaydi |

Umumiy qism (yangi maydonlar bilan):

```json
{
  "schema_version": 2,
  "event_type": "lesson_result",
  "event_id": "lr_483920_20261110T090012Z_34174",
  "occurred_at": "2026-11-10T10:12:40Z",
  "lesson_id": "netlify-deploy-v19",
  "lesson_version": "v5",
  "lesson_title": "Netlify va deploy",
  "mode": "live",
  "session_key": "sess_483920_20261110T090012Z",
  "attempt_id": "7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90",
  "group_id": 861,
  "teacher_id": 145,
  "student": { "student_id": 34174, "id_type": "lms" }
}
```

**Class va Learn qanday topiladi (3.1).** `lesson_id` → `16a` reestridagi qator → `class_id` (CRM Class), `learn_id` (CRM Learn), `material_uz` / `material_ru` (Class ichidagi material id'lari). Reestr har relizda yangilanadi va yuklash paketi bilan birga keladi: dars yangi versiyada yuklansa, o'sha qatorning `lesson_version` i o'zgaradi, `class_id` va `learn_id` o'zgarmaydi. CRM tomonida Class yoki Learn almashtirilsa, siz bizga yangi id'ni aytasiz — reestr biz tomonda tuzatiladi.

Mukofot kaliti: **`student_id` + `lesson_id`**. Til (`lang`) ham, `lesson_version` ham kalitga kirmaydi — dars yangi versiyada chiqsa yoki o'quvchi ruscha ochsa, yangi mukofot huquqi paydo bo'lmaydi. Analitika view'laridagi savol-moslik (`quiz-N` → Learn savoli) bu kalitga aloqador emas.

### 2.2. `result` va yangi `details` bloki

| Maydon | O'zgarish | Ma'nosi |
|---|---|---|
| `elapsed_sec` | **`duration_sec` o'rniga** | `opened_at` dan `occurred_at` gacha kalendar vaqti, soniyada. Chegara **0…604800** (7 kun — uyda urinishning eng uzun umri). Kutilgan: uyda ≤ 7 kun, jonli darsda ≤ 4 soat (sessiya 2 soat + yopilish kechikishi). **Qirqilmaydi:** chegaradan oshsa hodisa bizda to'xtaydi (`manual_review` + Telegram) — bu bizning xato bo'ladi, yashirin kesish bo'lmaydi |
| `last_activity_at` | yangi | O'quvchining oxirgi harakati (javob yoki ekran o'tishi), server vaqti. `elapsed_sec` bilan birga «7 kun ochiq turdi, lekin 20 daqiqa ishladi» holatini ko'rsatadi |
| `active_sec` | **hozir yo'q** | Faol ishlash vaqti. Ekran-vaqt yozuvi (view'lar uchun kerak bo'lgan ish) kiritilganda v1.2 da qo'shiladi. Maydon yo'q = o'lchanmagan; `0` yuborilmaydi |
| `trigger` | `version_changed` qo'shildi | Dars yangi versiyada ochilgani uchun eski urinish yopildi (4-bo'lim) |
| `attempt_no`, `student_arena_no` | ma'nosi aniqlashtirildi | Faqat ma'lumot. Mukofot sharti emas (sizning 2.6 aniqligi: birinchi to'liq yakunlash qotadi, undan oldingi tugallanmaganlar tarixda qoladi) |

**`details` bloki** — `lesson_result` va `arena_result` da, `questions[]` yonida:

```json
"details": { "status": "full", "reason": null, "available": 2 }
```

| `status` | `reason` | Ma'nosi |
|---|---|---|
| `full` | `null` | `questions[]` to'liq. `available: 0` bo'lsa — o'quvchi savolga javob bermagan, `questions: []` haqiqiy holat |
| `partial` | `practice_screen` | Darsning yakuniy amaliyot ekrani (yozma topshiriq, variantsiz) ball sifatida `tests.answered` ga kiradi, lekin savol-yozuvi yo'q. `questions[]` da qolgan savollar to'liq, `available` = `questions[]` dagi test-yozuvlar soni, `tests.answered` undan ko'p. **Hozir 172 darsning 87 tasida shunday ekran bor** |
| `omitted` | `size` | Javoblar bor edi (`available` ta savol), hodisa 1 MB dan oshgani uchun tafsilot yuborilmadi |
| `omitted` | `invalid_text` | Javoblar bor edi, matnlar buzuq (masalan `[object Object]`) — tafsilot yuborilmadi |
| `omitted` | `version_mismatch` | Javoblar bor edi, lekin boshqa dars versiyasiga tegishli — tafsilot yuborilmadi |

Asosiy natija (`tests.answered`, `correct_answers`, `completed`) har holatda ishonchli manbadan hisoblanadi va yuboriladi. `details.status: omitted` natijani qayta hisoblash uchun ishlatilmaydi — sizning 3.5 bandingizga mos.

**Kontrakt o'zgarishi (muhim, hozirgi v1 ga ham tegadi).** Tafsilot TZ'sida (`TZ_LESSON_RESULT_DETAILS_RU`, §4 invariantlari) «`answered` = `kind: test` yozuvlar soni, `correct_answers` = ulardan `correct: true` lari soni» deb yozilgan edi. 09.11 da prod'da o'lchadik: shu tenglik sababli Dars API darsni **tugatgan** o'quvchining butun tafsilotini tashlab yuborar ekan — oxirgi 100 xabarda jonli darsda javob bergan 118 o'quvchidan 69 tasida, uyda 69 dan 33 tasida `questions[]` yo'q (sabab — yakuniy amaliyot ekrani matnsiz). 09.11 dan Dars API qoidasi yumshatildi: **`questions[]` dagi test-yozuvlar soni `answered` dan kam bo'lishi mumkin** (ko'p bo'lsa — xato, tafsilot tashlanadi). Bu hozirgi v1 xabarlarga ham tegadi: endi tugatgan o'quvchilarda ham `questions[]` keladi, faqat amaliyot ekranisiz.

**Sizdan savol:** School API `answered` bilan `questions[]` sonining tengligini tekshiradimi? Tekshirsa — ayting, qoidani sizning tomoningizda ham yumshatish kerak, aks holda bunday xabarlar 422 oladi. Biz buni 50 xabarning birinchisi yuborilganda ham ko'ramiz.

### 2.3. Namunalar v1.1

Dars: `netlify-deploy-v19`, reestrda `v5`, Class `2429`, Learn `3170`.

**A1. `lesson_result` — yakunlagan o'quvchi (jonli dars):**

```json
{
  "schema_version": 2,
  "event_type": "lesson_result",
  "event_id": "lr_483920_20261110T090012Z_34174",
  "occurred_at": "2026-11-10T10:12:40Z",
  "lesson_id": "netlify-deploy-v19",
  "lesson_version": "v5",
  "lesson_title": "Netlify va deploy",
  "mode": "live",
  "session_key": "sess_483920_20261110T090012Z",
  "attempt_id": "7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90",
  "group_id": 861,
  "teacher_id": 145,
  "student": { "student_id": 34174, "id_type": "lms" },
  "result": {
    "attempt_no": 1,
    "trigger": "reached_end",
    "participated": true,
    "completed": true,
    "opened_at": "2026-11-10T09:01:05Z",
    "completed_at": "2026-11-10T10:12:40Z",
    "last_activity_at": "2026-11-10T10:12:40Z",
    "elapsed_sec": 4295,
    "screens": { "reached": 11, "total": 11 },
    "tests": { "total_questions": 2, "answered": 2, "correct_answers": 2 },
    "badges": ["all_correct", "first_try", "graduate"]
  },
  "lang": "uz",
  "details": { "status": "full", "reason": null, "available": 2 },
  "questions": [
    {
      "question_id": "s2",
      "kind": "test",
      "order": 1,
      "question": "Netlify nima qiladi?",
      "options": ["Sayt papkangizni internetda saqlaydi va link beradi", "Kodni chiroyli ranglar bilan bezaydi", "Internet tezligini oshiradi", "Telefonga o'yin o'rnatadi"],
      "correct_option": 0,
      "correct_answer": "Sayt papkangizni internetda saqlaydi va link beradi",
      "correct": true,
      "solved": true,
      "attempts": [
        { "n": 1, "option": 0, "answer": "Sayt papkangizni internetda saqlaydi va link beradi", "correct": true, "elapsed_ms": 8400, "at": "2026-11-10T09:31:12Z" }
      ]
    }
  ],
  "achievements": [
    { "id": "hostpick", "name": "Host Pick!", "title": "Netlify nima qilishini aniqladingiz", "earned_at": "2026-11-10T09:31:12Z" }
  ]
}
```

**A2. Oxirigacha yetmagan o'quvchi (sessiya yopilganda)** — umumiy qism A1 dagidek, `event_id` `…_34190`, `attempt_id` o'ziniki:

```json
"result": {
  "attempt_no": 1,
  "trigger": "session_closed",
  "participated": true,
  "completed": false,
  "opened_at": "2026-11-10T09:03:44Z",
  "completed_at": null,
  "last_activity_at": "2026-11-10T09:52:10Z",
  "elapsed_sec": 5836,
  "screens": { "reached": 6, "total": 11 },
  "tests": { "total_questions": 2, "answered": 1, "correct_answers": 1 },
  "badges": []
},
"lang": "uz",
"details": { "status": "full", "reason": null, "available": 1 },
"questions": [ { "question_id": "s2", "kind": "test", "order": 1, "...": "A1 dagidek bitta yozuv" } ],
"achievements": []
```

**A3. Uyda, 7 kun ochiq turgan, tugatmagan (`solo_expired`)** — `elapsed_sec` chegarasi shu holat uchun:

```json
"mode": "solo",
"result": {
  "attempt_no": 1,
  "trigger": "solo_expired",
  "participated": true,
  "completed": false,
  "opened_at": "2026-11-03T14:02:11Z",
  "completed_at": null,
  "last_activity_at": "2026-11-03T14:25:40Z",
  "elapsed_sec": 604800,
  "screens": { "reached": 4, "total": 11 },
  "tests": { "total_questions": 2, "answered": 0, "correct_answers": 0 },
  "badges": []
},
"details": { "status": "full", "reason": null, "available": 0 },
"questions": [],
"achievements": []
```

Uyda `group_id`, `teacher_id`, `session_key` bo'lmaydi (hozirgi qoida), `attempt_id` bo'ladi.

**B. `arena_participation`** — 14-hujjatdagi B bilan bir xil, umumiy qismga `attempt_id` qo'shildi, `lesson_version: "v5"`.

**C1. `arena_result` — qatnashgan, 2-o'rin** — 14-hujjatdagi C1 bilan bir xil, qo'shimcha: umumiy qismda `attempt_id`, `questions[]` oldida `"details": { "status": "full", "reason": null, "available": 12 }`.

**C2 (kirdi, javob bermadi)** va **C3 (arenaga kirmadi)** — o'zgarmadi, `details.available: 0`.

**C4. `arena_result` — arena umuman boshlanmadi (`not_started`), to'liq JSON:**

```json
{
  "schema_version": 2,
  "event_type": "arena_result",
  "event_id": "ar_483920_20261110T090012Z_34174",
  "occurred_at": "2026-11-10T10:41:00Z",
  "lesson_id": "netlify-deploy-v19",
  "lesson_version": "v5",
  "lesson_title": "Netlify va deploy",
  "mode": "live",
  "session_key": "sess_483920_20261110T090012Z",
  "attempt_id": "7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90",
  "group_id": 861,
  "teacher_id": 145,
  "student": { "student_id": 34174, "id_type": "lms" },
  "arena": {
    "started_at": null,
    "finished_at": "2026-11-10T10:41:00Z",
    "end_reason": "not_started",
    "questions_total": 12,
    "players_total": 0
  },
  "result": {
    "student_arena_no": null,
    "participated": false,
    "participated_at": null,
    "answered": 0,
    "correct_answers": 0,
    "points": 0,
    "place": null,
    "badges": []
  },
  "lang": "uz",
  "details": { "status": "full", "reason": null, "available": 0 },
  "questions": []
}
```

| Maydon (`not_started`) | Qiymat | Ma'nosi |
|---|---|---|
| `arena.started_at` | `null` | Arena boshlanmagan |
| `arena.finished_at` | sessiya yopilgan lahza | `occurred_at` bilan bir xil. Bu «arena tugadi» emas, «arena imkoni yopildi» |
| `arena.questions_total` | darsdagi arena savollari soni | Dars bankidan (bu darsda 12). Ko'rsatilgan savollar soni emas |
| `arena.players_total` | `0` | Hech kim kirmagan |
| `result.*` | `null` / `0` / `false` | C3 bilan bir xil |

Bu hodisa sessiyadagi **har bir** LMS o'quvchisiga ketadi — sizda «hali arena natijasi yo'q» holati yopiladi. Agar `not_started` uchun hodisa kerak emas desangiz (sessiya yopilganda arena bo'lmagani `lesson_result` dan ham ko'rinadi), yubormaymiz — ayting.

### 2.4. Qabul javobining ma'nosi (3.7)

Bizning taklif — yakuniy sxema siz tomonda:

| Kod | v2 ma'nosi | Dars API nima qiladi |
|---|---|---|
| `201` | Hodisa **saqlandi** va qayta ishlashga qabul qilindi. Sinxron tekshirilgan: tuzilma, o'quvchi mavjud, `lesson_id` reestrda bor | `delivered`. Qayta yubormaydi |
| `200` `duplicate: true` | O'sha `event_id`, o'sha mazmun oldin saqlangan | `delivered` |
| `409` | O'sha `event_id`, boshqa mazmun | `manual_review` + Telegram |
| `422` | Tuzilma xato · o'quvchi topilmadi · `lesson_id` reestrda yo'q | `manual_review` + Telegram |
| `429`, `5xx` | Vaqtinchalik | O'sha mazmun bilan qayta |

Progress va mukofotni qo'llash asinxron bo'lsa, `201` tanasida holat va uni so'rash yo'li bo'lsin:

```json
{ "data": { "event_id": "…", "event_type": "lesson_result", "accepted": true, "duplicate": false, "processing": "queued" } }
```

`GET …/lesson-results/{event_id}` (hozirgi `verify` manzili) → `processing: queued | applied | failed`, `applied` bo'lsa nima qo'llangani (`class_done`, `learn_done`, `coins`), `failed` bo'lsa `error`. Saqlangan hodisa biznes-xato sabab yo'qolmaydi: `failed` ni School API o'zi qayta ishlaydi, biz **qayta yubormaymiz** (o'sha id bilan yuborsak baribir `200 duplicate`). Biz tomonda: yetkazilgan hodisani 10 daqiqadan keyin bir marta so'raymiz, `failed` bo'lsa Telegram'ga yozamiz.

**v1 va v2 javobi farqi** (sizning eslatmangiz to'g'ri, jumlamizni tuzatamiz):

| | v1 guruh-xabari (hozir) | v2 bitta o'quvchi (taklif) |
|---|---|---|
| O'quvchi topilmadi | `201` + `rejected_students`, qolganlari saqlanadi | `422` — hodisada bitta o'quvchi bor, saqlanadigan narsa qolmaydi |
| Javob tanasi | `students_accepted`, `rejected_students`, `reward_status` | `event_type`, `accepted`, `duplicate`, `processing` |

Bu **yangi qoida**, v1 xulqi emas. Bizning navbat v1 da `rejected_students` kelganda hodisani `delivered` deb belgilab, Telegram'ga ogohlantirish yozadi — bu saqlanadi.

---

## 3. Ikki kanal: brauzer (`onFinished`) va server (3.2)

### 3.1. Umumiy kalit

`attempt_id`. Brauzer yukiga (`onFinished`, v4) shu blok qo'shiladi, `codestrike` bloki olib tashlanadi (sizning 2.8):

```json
"dars_api": {
  "attempt_id": "7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90",
  "session_key": "sess_483920_20261110T090012Z",
  "lesson_version": "v5",
  "lesson_result_event_id": "lr_483920_20261110T090012Z_34174"
}
```

Uyda `session_key: null`. Moslashtirish: `student_id` (token) + `lesson_id` + `attempt_id`. Server hodisasi o'sha `attempt_id` bilan keladi; `lesson_result_event_id` ni brauzer oldindan biladi, chunki id qolipi (`lr_` + sessiya + o'quvchi) deterministik.

### 3.2. Qaysi kanal nima uchun

| | Brauzer (`onFinished`) | Server (`lesson_result`) |
|---|---|---|
| Qachon | O'quvchi oxirgi ekranga yetganda, bir marta, avtomatik | O'sha lahzada (`reached_end`) yoki sessiya yopilganda |
| Vazifa | LMS'da darhol ko'rsatish (progress, «bajarildi») va zaxira | **Mukofot va Class holatining manbasi** |
| Yetmasa | O'quvchi oynani yopgan — server hodisasi baribir keladi | Tarmoq — navbat qayta uradi |

Mukofot himoyasi: kalit `student_id` + `lesson_id`, qaysi kanal birinchi kelsa ham **bir marta**; ikkinchisi tarix sifatida saqlanadi. Brauzer yukida `codestrike` yo'q, shuning uchun eski «`codestrike` bo'lmasa eski mukofot yo'li» mantig'i ishga tushmasligi kerak — buni siz yangi kontraktga moslashtirasiz, biz brauzer yukiga `"schema_version": 2` belgisini qo'shamiz, eski yukdan farqlash uchun.

### 3.3. Hodisalar tartibi (`arena_participation` va `arena_result`)

Kelish tartibi kafolatlanmaydi (qayta urinishlar). Qabul qiluvchi qoidalari:

1. **`arena_result` — haqiqat manbasi.** Unda `result.participated` va `participated_at` bor. U kelgan bo'lsa, keyin kelgan `arena_participation` hech narsani o'zgartirmaydi (idempotent).
2. **`arena_participation` birinchi kelsa** — Learn avtomatik bajarildi (sizning qoidangiz: birinchi savol ko'rsatildi, ball chegarasi yo'q). Keyin `arena_result` `participated: true` bilan keladi — ikkinchi ta'sir yo'q.
3. **«Birinchi arena»** — `student_arena_no: 1` (server hisoblaydi, o'quvchining shu darsdagi arenalari bo'yicha). Tarmoqdan birinchi kelgan hodisa emas. `student_arena_no: 2` va undan keyingilar — mashq, mukofotga ta'sir qilmaydi.

Ikkala hodisa bir `session_key` + `student_id` bilan keladi, shu juftlik bitta arenani bildiradi (bir sessiyada bitta arena).

---

## 4. Kontent yangilanganda ochiq urinishlar va v1 ni to'xtatish (3.6, 2.9)

### 4.1. Halol holat

14-hujjat 2.1 da «urinish o'quvchi ochgan `lesson_version` ga bog'lanadi» deb yozgan edik. Bu **reja edi, hozirgi holat emas**. Hozir: urinish yozuvida versiya yo'q, javob kalitlari faqat `lesson_id` bo'yicha saqlanadi va dars har ochilganda ustidan yoziladi, darslar serverga versiya yubormaydi. Versiya nomuvofiqligini hozir faqat matn-tekshiruv ushlaydi: `correct_answer` — o'quvchi **ko'rgan** to'g'ri javob matni (urinish paytida yoziladi); kalit indeksi shu matnga mos kelmasa, yozuv chiqariladi. 50 ta xabardagi ikki holat shu yo'l bilan topilgan.

### 4.2. v1.1 da nima qilinadi (bizning tomon)

| | |
|---|---|
| Dars yuki | Har dars fayli yig'ilganda o'z `lesson_version` ini (reestr versiyasi) ichiga oladi va serverga yuboradi |
| Urinish | `lesson_version` urinishga yoziladi (yangi ustun). Jonli sessiyaga — mentor ochgan versiya |
| Kalitlar | Javob kalitlari `lesson_id` + `lesson_version` bilan saqlanadi. Eski urinish **o'z versiyasining** kalitlari bilan baholanadi, yangi savollar unga aralashmaydi |
| Hodisa | `lesson_version` = urinishniki, dars yukiniki emas |

### 4.3. O'tish qoidalari

| Holat | Nima bo'ladi |
|---|---|
| Uyda ochiq urinish, brauzer tabi eski versiya bilan ochiq | **Davom etadi** o'z versiyasida: server o'sha versiya kalitlari bilan baholaydi, urinish odatdagidek yakunlanadi (`reached_end` yoki 7 kun) |
| O'quvchi sahifani yangiladi, LMS yangi faylni berdi | Eski urinish `trigger: "version_changed"` bilan yopiladi → `lesson_result` (`completed: false`, `participated` o'z qoidasi bo'yicha). Yangi urinish boshlanadi (`attempt_no + 1`), ekran-o'rni ko'chirilmaydi (ekranlar boshqa bo'lishi mumkin). Mukofot: birinchi to'liq yakunlash — yangi urinishda olinadi; kalit `student_id` + `lesson_id` bo'lgani uchun versiya yangi huquq bermaydi |
| Eski tab progress yuborayotganda server versiya farqini ko'rdi | `409 version_changed` → sahifada «Dars yangilandi, sahifani yangilang». Javob qabul qilinmaydi |
| Jonli sessiya | Sessiya versiyasi mentor ochgan versiya. Reliz faqat dars vaqtidan tashqarida va jonli sessiya 0 bo'lganda qilinadi (hozir ham shunday) — dars o'rtasida versiya almashmaydi |
| Navbatdagi v1 hodisalar | O'z holicha yetkaziladi, v2 ga aylantirilmaydi |

### 4.4. v1 ni to'xtatish sharti

T — 172 dars yangi versiyada yuklangan kun (dars vaqtidan tashqari, sizga oldindan yozma xabar).

- **T dan:** yangi hodisalar `schema_version: 2`. Yangi yuk v1 guruh-xabarini yaratmaydi.
- **T … T+8 kun:** School API ikkalasini qabul qiladi. Bu davrda v1 faqat eski urinishlardan keladi: T dan oldin ochilgan uyda urinishlar (eng ko'pi 7 kun yashaydi) va navbatda qolgan eski xabarlar.
- **T+8 kun:** biz tekshiramiz — eski versiyali faol urinish 0, navbatda v1 `pending` 0 — va sizga «v1 ni yopish mumkin» deb **yozma** xabar beramiz. Shu xabargacha v1 qabul qilinadi; xabardan keyin yopasiz.
- Yangilanmagan dars qolmaydi: 172 dars = LMS'dagi hamma JSX dars.

---

## 5. 50 ta xabar: hisobot tartibi (1.1–1.4)

Qabul qildik: **hech narsa yuborilmaydi**, avval hisobot. Tartib:

1. Dars API prod'da yangilanadi (tuzatish kodi tayyor, staging'da sinalgan).
2. 50 xabar **sinov rejimida** qayta yig'iladi — bazaga va School API'ga hech narsa yozilmaydi.
3. Hisobot sizga (shu papkaga `17-…` fayl).
4. Siz LMS tarixi, brauzer natijalari va coin reyestri bilan solishtirasiz, qaysi qatorlar yuborilishini aytasiz.
5. Bitta xabar → sizda tekshiruv → qolganlari.

**Hisobot formati** — CSV, har qator = o'quvchi × dars (229 qator), ustunlar:

| Ustun | Ma'nosi |
|---|---|
| `event_id`, `mode`, `lesson_id`, `lesson_version_hozir` | Xabar va dars. Versiya — reestrdagi hozirgi versiya (eski urinishning aniq versiyasi yozilmagan, 4.1) |
| `student_id` | LMS id |
| `takror` | Shu o'quvchi + dars boshqa xabarda ham bormi (229 noyob emasligi shu ustunda ko'rinadi) |
| `eski_answered`, `eski_correct`, `eski_completed`, `eski_badges` | 422 olgan xabardagi qiymat |
| `yangi_answered`, `yangi_correct`, `yangi_completed`, `yangi_badges` | Qayta yig'ilgan qiymat |
| `tafsilot` | `to'liq` · `tushirildi: <sabab>` (`invalid_text`, `version_mismatch`, `size`) |
| `chiqarilgan_urinishlar` | Tarixdan olib tashlangan urinishlar soni va sababi (jonli ikkinchi urinish · boshqa versiya) |
| `bizda_holat` | `yuboriladi` · `chiqariladi: bizda shu dars bo'yicha tugallangan natija allaqachon yetkazilgan (event_id)` |
| `sizda_tekshirish` | Bo'sh ustun — brauzer natijasi / coin reyestri bo'yicha sizning belgingiz |

Qoidalar, sizning 1-bo'limingizga mos:
- `correct` faqat o'quvchi ko'rgan savol versiyasining kaliti bilan hisoblanadi: `correct_answer` matni urinish paytida yozilgan, kalit indeksi shu matnga mos kelmasa yozuv chiqariladi; savol yoki variant matni birinchi urinishdan farq qilsa — chiqariladi.
- Agregat ham tekshiriladi: `correct_answers` qayta hisoblanadi, hisobotda eski va yangi yonma-yon.
- Eski natija va coin: biz «yuboriladi» deb belgilagan qator ham sizning reyestr tekshiruvingizdan keyingina ketadi. Yangi Learn qoidasi eski natijalarga qo'llanmaydi — bu xabarlar v1 formatda, hozirgi qoidalar bilan ketadi.
- 50 xabar yangi qoida bilan yig'iladi: yakuniy amaliyot ekranini bosgan o'quvchilarda qolgan savollar tafsiloti ketadi (hisobotdagi `matnsiz savol` qatorlari).
- `event_id` o'sha qoladi (siz tasdiqladingiz: validatsiyada rad etilgan, saqlanmagan). Agar biror `event_id` sizda saqlangan chiqsa, uni hisobotda belgilaysiz — biz `_r1` bilan yuboramiz yoki chiqaramiz.

---

## 6. Qabul ssenariylari — 17 ta

1–10 — 14-hujjatdagi, 11–17 — sizning qo'shimchangiz.

| # | Ssenariy | Dars API nima yuboradi | Sizning tomonda kutiladi |
|---|---|---|---|
| 1 | Oxirgi ekranga yetdi, tugmani bosmadi | `lesson_result` (`reached_end`, `completed: true`) darhol | Natija saqlandi, Class bajarildi |
| 2 | Arenaga kirdi, javob bermadi | `arena_participation`, keyin `arena_result` (`participated: true`, `answered: 0`) | Learn avtomatik bajarildi |
| 3 | Learn oldin bajarilgan, arena keyin tugadi | Odatdagi `arena_result` | CodeStrike coin'i yo'q |
| 4 | CodeStrike coin'i oldin, Learn keyin | Odatdagi `arena_result` | Learn coin'i yo'q |
| 5 | Learn CodeStrike sababli avtomatik bajarildi | `arena_participation` → `arena_result` | CodeStrike coin'i to'silmaydi |
| 6 | Bir vaqtda yakunlash, ikki kanal | Brauzer yuki `dars_api.attempt_id` bilan + server `lesson_result` o'sha `attempt_id` | Bir marta mukofot, ikkinchisi tarix |
| 7 | 1-arena nol, 2-arena yuqori | 2-arena `student_arena_no: 2` | 1-natija va mukofot o'zgarmaydi |
| 8 | Mentor tabini yopdi / ochiq qoldirdi / oxirgi savolgacha yetmadi | `end_reason`: `session_closed` · `session_limit` · `last_question_timeout` yoki `arena_limit` | Natijalar yakunlandi |
| 9 | Darsni tugatmagan o'quvchi | `lesson_result` (`session_closed`, `completed: false`) | Class bajarilmagan, coin yo'q |
| 10 | Uyda, ikki til | Uyda faqat `lesson_result`; `lang` | Regressiya yo'q |
| 11 | Jonlida tugatmadi → uyda birinchi marta yakunladi | Jonli: `completed: false` (`attempt_no: 1`); uyda: `completed: true` (`attempt_no: 2`, `trigger: reached_end`) | Mukofot **bir marta**, ikkinchi natijada (2.6 b). `attempt_no` shart emas |
| 12 | Arena yakuni qatnashish hodisasidan oldin keldi | `arena_result` birinchi, `arena_participation` keyin (qayta urinish) | 3.3 qoidalari: `arena_result` haqiqat, ikkinchisi idempotent, Learn bir marta |
| 13 | Server va brauzer bir xil natijani parallel yubordi | Ikkalasi bir `attempt_id` bilan, soniyalar farqi bilan | Bir marta mukofot, qaysi birinchi kelsa |
| 14a | Uyda 7 kun ochiq, tugatmadi | A3: `solo_expired`, `elapsed_sec: 604800`, `last_activity_at` erta | Natija saqlandi, coin yo'q, `elapsed_sec` qirqilmagan |
| 14b | Arena umuman boshlanmadi | C4: `not_started`, `started_at: null`, har o'quvchiga | «Arena natijasi yo'q» holati yopildi, Learn ochiq qoladi |
| 15 | Tafsiloti tushirilgan natija va haqiqatan javobsiz natija | `details: omitted / size` (`available: 2`, `tests.answered: 2`) va `details: full` (`available: 0`, `answered: 0`) | Birinchisida natija saqlanadi, tafsilot yo'q; ikkinchisida javobsizlik haqiqiy |
| 16 | Eski versiyada ochiq urinish paytida yangi dars nashri | Eski tab: o'z versiyasida davom; sahifa yangilansa `version_changed` + yangi urinish (4.3) | Birinchi to'liq yakunlash → mukofot bir marta, versiya huquq yaratmaydi |
| 17 | Eski xabarni tiklashda brauzer orqali oldin berilgan coin takrorlanmasligi | Hisobotda `bizda_holat` + sizning reyestr tekshiruvingiz; faqat belgilangan qatorlar ketadi | Takroriy coin yo'q |

Bizning tomonda 17 tasi avtomatik testga aylanadi (soxta qabul qiluvchi bilan). QA'da `netlify-deploy-v19` da siz bilan birga.

---

## 7. Prod (4.1) va keyingi qadam

`STALE_SESSION_MINUTES` — Kristinadan faqat samarali qiymat va ishlayotgan versiya so'raladi, boshqa hech narsa. Kelishilgan chegaralar (sessiya 2 soat, arena 45 daqiqa, oxirgi savoldan 1 daqiqa) o'zgarmaydi.

**Sizdan:** 2-bo'lim namunalari va maydonlari · **2.2 dagi savol: School API `answered` = `questions` tengligini tekshiradimi** · 2.4 javob-sxemasi (o'z tomoningizdan yakuniy) · 3-bo'lim kalit va tartib qoidalari · 4-bo'lim o'tish tartibi va v1 yopish sharti · 5-bo'lim hisobot formati — «ha» yoki tuzatish.

**Keyin:** ikki tomon ish hajmi va muddatlarni belgilaydi → kod → 17 ssenariy testi → QA → 172 dars dars vaqtidan tashqarida. 50 xabar hisoboti bu zanjirga bog'liq emas, server yangilangan kuni tayyorlanadi.

---

## Ilova A. `16a-REESTR-DARS-CLASS-LEARN.csv` ustunlari

172 qator, har JSX dars bittadan. Manba: LMS'ga yuklangan fayllar reestri (02.11 holati) va CRM'dan o'qilgan Class → Learn mosligi (27.10, Learn id'lari 29.10 da ochilgan).

| Ustun | Ma'nosi |
|---|---|
| `modul` | Dastur moduli (2…14) |
| `crm_bolim` | CRM bo'lim id'si |
| `class_id` | CRM Class (dars) id'si |
| `class_tartib` | Class'ning bo'limdagi tartib raqami (`order`) |
| `lesson_id` | Hodisadagi `lesson_id` |
| `lesson_version` | Hodisadagi `lesson_version` — LMS'dagi fayl versiyasi (`v5` … `v8`) |
| `material_uz`, `material_ru` | Class ichidagi JSX material id'lari (uz va ru) |
| `learn_id` | Shu Class'ga bog'langan Learn id'si |
| `nom_uz` | Dars nomi |

Versiya taqsimoti hozir: `v5` — 110, `v6` — 54, `v7` — 7, `v8` — 1. 172 dars relizida har qatorning `lesson_version` i yangilanadi, `class_id` va `learn_id` o'zgarmaydi.
