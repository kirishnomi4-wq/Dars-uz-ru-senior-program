# Abdullohga: 15-javobingizga javob — JSON v1.1, ikki kanal bog'lanishi, o'tish tartibi, 50 xabar hisoboti

**Sana:** 09.11.2026
**Kimga:** Abdulloh (LMS, CRM, School API)
**Kimdan:** JSX va Dars API jamoasi
**Asos:** `15-ABDULLOH-TOLIQ-JAVOB-UZ.md` (09.11) va `14-ABDULLOH-TOLIQ-UZ.md`
**Ilova:** `16a-REESTR-DARS-CLASS-LEARN.csv` — 172 dars: `lesson_id` + versiya → CRM Class → Learn (+ `eski_lesson_id`)
**Ustunlik:** 09.11 19:10 dan yakuniy kelishuv — `25-YAKUNIY-JSX-DARS-LMS-KONTRAKT-UZ.md` (Abdulloh). Zid joyda 25 ustun; bu hujjat JSON namunalari va tushuntirishlar manbasi bo'lib qoladi. 25 dagi farqlar: `participated` ta'rifi (o'quvchi o'zi ekran o'tgan yoki javob bergan), `arena_participation` tuzilmasi (`participation{…, source}`), `place` faqat 1–3, `lesson_result.badges` da guruh nishonlari yo'q, backfill faqat fayl bilan isbotlangan bog'lanishda (amalda T dan oldingi urinishlar `unknown`), 413/401/403 qoidalari.
**Nashr:** v1.3 (09.11 kech) — v1.2 sizning 18-javobingiz bo'yicha (`21-…`), v1.3 esa 22-javobingiz 5-bo'limidagi 6 tuzatish bilan: mukofot kaliti kanonik (o'quvchi + Class / o'quvchi + Learn), jonli chegara 2 soat, backfill faqat kontent dalili bilan, C4 `ar_` + `attempt_id`, kuzatish matni yagona, `processed_at` birinchi yig'ilgan vaqt. Qisman tafsilot (`partial`) v1 da yo'q, amaliyot ekrani test hisobidan tashqari, `event_id` urinish bo'yicha, vaqt maydonlari ajratilgan, namunalar to'liq.

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
| 3.1 | Class va Learn bilan versiyalangan moslik | Ilova `16a` reestri: 172 qator, `lesson_id` + `lesson_version` → `class_id`, `learn_id`, material id (uz, ru). Mukofot kaliti kanonik: o'quvchi + CRM Class (o'quv qismi), o'quvchi + bog'langan Learn (Learn/CodeStrike cheklovi); `lesson_id` reestr orqali Class'ga tortiladi, versiya kirmaydi | 2.1, Ilova A |
| 3.2 | Ikki kanal uchun umumiy identifikator, hodisalar tartibi | Umumiy kalit `attempt_id` ikkala kanalda. Mukofot manbasi — server hodisasi. Tartib qoidalari 3 ta | 3 |
| 3.3 | `duration_sec` 86400 va solo 7 kun ziddiyati | `duration_sec` o'rniga `elapsed_sec` (kalendar, `opened_at` → `occurred_at`) + `last_activity_at`. `occurred_at` — mantiqiy yakun (uyda eng ko'pi `opened_at` + 7 kun), `processed_at` — bizda yig'ilgan haqiqiy vaqt; sweep kechikishi `elapsed_sec` ga kirmaydi. Qirqish yo'q. Faol vaqt keyingi versiyada | 2.2 |
| 3.4 | `not_started` to'liq JSON | Namuna C4 | 2.3 |
| 3.5 | Tafsilot tushirilgan belgi | `details` bloki: `status`, `reason`, `available` | 2.2 |
| 3.6 | Ochiq urinishlar va v1 to'xtatish | Versiya urinishga va kalitlarga yoziladi; eski urinish o'z versiyasida yakunlanadi; v1 to'xtash sharti aniq | 4 |
| 3.7 | `201` ma'nosi, v1 va v2 javobi | `201` = saqlandi; qo'llash holati alohida so'rovda; v1/v2 jadvali. Yakuniy sxema sizda | 2.4 |
| 2.7 | Bo'sh `badges` ni rad etgan payload va `request_id` | Bu 17.09 dagi holat, 18.09 da tuzatilgan. Jumlamiz eskirgan | 1 |
| yangi | Tafsilot tugatgan o'quvchilarda yo'qolayotgani (09.11 topilma) | **v1.2:** tenglik SAQLANADI (siz tasdiqladingiz: School API tekshiradi). Yechim boshqa: yakuniy amaliyot ekrani (`-1` kalit) `tests` hisobiga umuman kirmaydi, shunda `answered` = `questions[]` va tafsilot to'liq. Qisman tafsilot v1 da yo'q | 2.2 |

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
  "event_id": "lr_7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90",
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

Mukofot kaliti **kanonik, CRM tomonida** (sizning 22-javobingiz): o'quv qismi mukofoti — **o'quvchi + CRM Class**; Learn va CodeStrike o'rtasidagi o'zaro cheklov — **o'quvchi + bog'langan Learn**. Hodisadagi `lesson_id` faqat reestr (`16a`, `eski_lesson_id` bilan) orqali Class'ni topish uchun; til (`lang`), `lesson_version`, tashqi id o'zgarishi kalitga kirmaydi — dars yangi versiyada chiqsa, id almashsa yoki o'quvchi ruscha ochsa, yangi mukofot huquqi paydo bo'lmaydi. Analitika view'laridagi savol-moslik (`quiz-N` → Learn savoli) bu kalitga aloqador emas.

### 2.2. `result` va yangi `details` bloki

| Maydon | O'zgarish | Ma'nosi |
|---|---|---|
| `elapsed_sec` | **`duration_sec` o'rniga** | `opened_at` dan `occurred_at` gacha kalendar vaqti, soniyada. `occurred_at` — **mantiqiy** yakun: `reached_end` lahzasi · sessiya yopilgan lahza · uyda muddati tugasa aynan `opened_at` + 7 kun. Chegara: uyda **≤ 604800** (aynan 7 kun, oshmaydi), jonli darsda **≤ 7200** (kelishilgan sessiya muddati 2 soat, boshqa qo'shimcha yo'q). Jonlida `occurred_at` = mentor yopgan lahza yoki sessiya boshlanganidan 2 soat — qaysi oldin kelsa; 2 soatdan keyin kelgan javob qabul qilinmaydi (`session_limit`), tashlandiq sessiyani 30 daqiqada aniqlash esa qayta ishlash kechikishi — u `processed_at` da ko'rinadi, ishlash huquqini uzaytirmaydi. **Qirqilmaydi:** chegaradan oshsa hodisa bizda to'xtaydi (`manual_review` + Telegram) — bu bizning xato bo'ladi, yashirin kesish bo'lmaydi |
| `processed_at` | yangi | Hodisa bizda **birinchi marta** yig'ilgan vaqt. Qayta yuborishda (tarmoq, `429`, `5xx`) o'zgarmaydi — bir xil `event_id` har doim bir xil mazmun bilan keladi. Uyda muddat tugashini tekshiruv har 15 daqiqada yuradi, shuning uchun `processed_at` `occurred_at` dan 15 daqiqagacha kech bo'ladi; bu kechikish `elapsed_sec` ga kirmaydi va xato emas |
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
| `partial` | — | **v1.2 da yo'q.** Avvalgi nashrda amaliyot ekrani uchun taklif qilingan edi; siz School API tenglikni tekshirishini tasdiqladingiz, shuning uchun amaliyot ekrani `tests` hisobidan chiqarildi (quyida) va `answered` = `questions[]` har doim. Zarurat bo'lsa v2 da, faqat sizning QA'ngizdan keyin |
| `omitted` | `size` | Javoblar bor edi (`available` ta savol), hodisa 1 MB dan oshgani uchun tafsilot yuborilmadi |
| `omitted` | `invalid_text` | Javoblar bor edi, matnlar buzuq (masalan `[object Object]`) — tafsilot yuborilmadi |
| `omitted` | `version_mismatch` | Javoblar bor edi, lekin boshqa dars versiyasiga tegishli — tafsilot yuborilmadi |

Asosiy natija (`tests.answered`, `correct_answers`, `completed`) har holatda ishonchli manbadan hisoblanadi va yuboriladi. `details.status: omitted` natijani qayta hisoblash uchun ishlatilmaydi — sizning 3.5 bandingizga mos.

**Amaliyot ekrani va `tests` (sizning 2-bo'limingizga javob).** Tafsilot TZ'sidagi invariant — «`answered` = `kind: test` yozuvlar soni, `correct_answers` = ulardan `correct: true` lari soni» — **saqlanadi**, School API ham shuni tekshiradi (siz: `6b3c85d`). 09.11 da prod'da ko'rganimiz: 172 darsning 87 tasida yakuniy amaliyot ekrani (yozma topshiriq, kalit `-1`) ballni yozadi, savol-variant matnini yozmaydi; shu sababli tugatgan o'quvchilarning tafsiloti tushib ketardi (jonli 69/118, uyda 33/69). Bizning birinchi yechimimiz (tenglikni yumshatish, 14:24) noto'g'ri edi — 20 hodisa 422 oldi, 17:04 da qaytarildi. **Yakuniy qoida (17:04 dan prod'da):**

- Amaliyot ekrani (`-1` kalit, tekshiruvli ham, «Bajardim» ham) **`tests` hisobiga kirmaydi**: `tests.answered`, `tests.correct_answers`, `tests.total_questions` va `questions[]` faqat variantli test savollari. Shunda `answered` = `questions[]` har doim, tafsilot to'liq keladi.
- `tests.correct_answers` ga amaliyot hech qachon qo'shilmaydi — tekshiruvsiz «Bajardim» tekshirilgan to'g'ri javob bilan bir xil ma'no bermaydi (07-hujjat kelishuvi, `correct: null`).
- Amaliyot natijasi v2 da alohida blokda beriladi (`practice: [{ screen_id, done, checked, correct }]`): kod tekshirgan topshiriqda `checked: true`, `correct: true/false`; «Bajardim» tugmasida `checked: false`, `correct: null`. Bu blok `tests` ga ta'sir qilmaydi, `completed` ga ham (u faqat oxirgi ekranga yetganlik).
- `completed` ta'rifi: **oxirgi o'quv ekraniga yetganlik** (`reached_end`), javoblar soni emas — jonli va uyda bir xil (sizning 4-bo'limingiz; 30321 holati shu qoida bilan `completed: false` qoladi).

### 2.3. Namunalar v1.1

Dars: `netlify-deploy-v19`, reestrda `v5`, Class `2429`, Learn `3170`.

**A1. `lesson_result` — yakunlagan o'quvchi (jonli dars):**

```json
{
  "schema_version": 2,
  "event_type": "lesson_result",
  "event_id": "lr_7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90",
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
    "processed_at": "2026-11-10T10:12:41Z",
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
    },
    {
      "question_id": "s5",
      "kind": "test",
      "order": 2,
      "question": "Deploy so'zi nimani bildiradi?",
      "options": ["Saytni o'chirish", "Saytni internetga chiqarish", "Kodni nusxalash", "Rasm qo'shish"],
      "correct_option": 1,
      "correct_answer": "Saytni internetga chiqarish",
      "correct": true,
      "solved": true,
      "attempts": [
        { "n": 1, "option": 1, "answer": "Saytni internetga chiqarish", "correct": true, "elapsed_ms": 6100, "at": "2026-11-10T09:48:30Z" }
      ]
    }
  ],
  "achievements": [
    { "id": "hostpick", "name": "Host Pick!", "title": "Netlify nima qilishini aniqladingiz", "earned_at": "2026-11-10T09:31:12Z" }
  ]
}
```

Tekshiruv: `tests.answered` 2 = `questions[]` 2 = `details.available` 2; `correct_answers` 2 = `correct: true` yozuvlar 2; `elapsed_sec` 4295 = `10:12:40` − `09:01:05`.

**A2. Oxirigacha yetmagan o'quvchi (sessiya yopilganda)** — umumiy qism A1 dagidek, `student_id: 34190`, `attempt_id` o'ziniki (`"c2b7e0a4-5d16-4f3a-9e8b-1a2b3c4d5e6f"`), `event_id` = `lr_` + shu `attempt_id`:

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
  "processed_at": "2026-11-10T10:41:01Z",
  "screens": { "reached": 6, "total": 11 },
  "tests": { "total_questions": 2, "answered": 1, "correct_answers": 1 },
  "badges": []
},
"lang": "uz",
"details": { "status": "full", "reason": null, "available": 1 },
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
      { "n": 1, "option": 0, "answer": "Sayt papkangizni internetda saqlaydi va link beradi", "correct": true, "elapsed_ms": 11200, "at": "2026-11-10T09:33:40Z" }
    ]
  }
],
"achievements": []
```

Bu o'quvchi uchun `occurred_at` = sessiya yopilgan lahza `2026-11-10T10:41:00Z`, `elapsed_sec` 5836 = `10:41:00` − `09:03:44`; `completed: false`, chunki 6-ekranda qolgan (`reached_end` yo'q).

**A3. Uyda, 7 kun ochiq turgan, tugatmagan (`solo_expired`)** — `elapsed_sec` chegarasi shu holat uchun. Umumiy qismda `occurred_at` = `opened_at` + 7 kun = `2026-11-10T14:02:11Z` (mantiqiy yakun), `processed_at` esa tekshiruv yurgan vaqt (15 daqiqagacha kech):

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
  "processed_at": "2026-11-10T14:14:58Z",
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

**C1. `arena_result` — qatnashgan, 2-o'rin (to'liq JSON).** Arena 12 savoldan iborat, mentor 3-savoldan keyin yopgan; o'quvchi 3 ta savolga javob bergan, 2 tasi to'g'ri. `details.available` = `questions[]` = `result.answered` = 3:

```json
{
  "schema_version": 2,
  "event_type": "arena_result",
  "event_id": "ar_7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90",
  "occurred_at": "2026-11-10T10:19:30Z",
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
    "started_at": "2026-11-10T10:14:58Z",
    "finished_at": "2026-11-10T10:19:30Z",
    "end_reason": "mentor",
    "questions_total": 12,
    "questions_shown": 3,
    "players_total": 17
  },
  "result": {
    "student_arena_no": 1,
    "participated": true,
    "participated_at": "2026-11-10T10:15:03Z",
    "answered": 3,
    "correct_answers": 2,
    "points": 1870,
    "place": 2,
    "badges": ["arena_top_2"]
  },
  "lang": "uz",
  "details": { "status": "full", "reason": null, "available": 3 },
  "questions": [
    {
      "question_id": "quiz-0",
      "kind": "arena",
      "order": 1,
      "question": "Netlify nima qiladi?",
      "options": ["Saytni internetga chiqaradi", "Kodni ranglarga bo'yaydi", "Internetni tezlashtiradi", "Telefonni zaryadlaydi"],
      "correct_option": 0,
      "correct_answer": "Saytni internetga chiqaradi",
      "correct": true,
      "solved": true,
      "attempts": [
        { "n": 1, "option": 0, "answer": "Saytni internetga chiqaradi", "correct": true, "elapsed_ms": 2100, "at": "2026-11-10T10:15:05Z" }
      ]
    },
    {
      "question_id": "quiz-1",
      "kind": "arena",
      "order": 2,
      "question": "Deploy qilingan sayt manzili qayerda ko'rinadi?",
      "options": ["Faqat kompyuterda", "Netlify panelida, hamma uchun ochiq", "Faqat telefonda", "Hech qayerda"],
      "correct_option": 1,
      "correct_answer": "Netlify panelida, hamma uchun ochiq",
      "correct": false,
      "solved": false,
      "attempts": [
        { "n": 1, "option": 0, "answer": "Faqat kompyuterda", "correct": false, "elapsed_ms": 4800, "at": "2026-11-10T10:16:20Z" }
      ]
    },
    {
      "question_id": "quiz-2",
      "kind": "arena",
      "order": 3,
      "question": "Sayt yangilanganda nima qilinadi?",
      "options": ["Yangi akkaunt ochiladi", "Papka qayta yuklanadi (deploy)", "Kompyuter o'chiriladi", "Hech narsa"],
      "correct_option": 1,
      "correct_answer": "Papka qayta yuklanadi (deploy)",
      "correct": true,
      "solved": true,
      "attempts": [
        { "n": 1, "option": 1, "answer": "Papka qayta yuklanadi (deploy)", "correct": true, "elapsed_ms": 3300, "at": "2026-11-10T10:17:41Z" }
      ]
    }
  ]
}
```

`arena.questions_shown` (yangi) — mentor ko'rsatgan savollar soni; `questions_total` — bankdagi jami. Arenada `achievements` yo'q (dars yutuqlari `lesson_result` da).

**C2 (kirdi, javob bermadi)** va **C3 (arenaga kirmadi)** — o'zgarmadi, `details.available: 0`.

**C4. `arena_result` — arena umuman boshlanmadi (`not_started`), to'liq JSON:**

```json
{
  "schema_version": 2,
  "event_type": "arena_result",
  "event_id": "ar_7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90",
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

`GET …/lesson-results/{event_id}` (hozirgi `verify` manzili) → `processing: queued | applied | failed`, `applied` bo'lsa nima qo'llangani (`class_done`, `learn_done`, `coins`), `failed` bo'lsa `error`. Saqlangan hodisa biznes-xato sabab yo'qolmaydi: `failed` ni School API o'zi qayta ishlaydi, biz **qayta yubormaymiz** (o'sha id bilan yuborsak baribir `200 duplicate`). Kuzatish tartibi — keyingi abzatsda, u yagona qoida.

**Kuzatish (sizning 7-bo'limingiz):** `201` + `processing: queued` kelgan hodisa **yakuniy holatgacha** kuzatiladi: GET 1, 5, 15, 60 daqiqada, keyin har soatda, 24 soatgacha. 60 daqiqadan uzoq `queued` → Telegram ogohlantirish (bizga va sizga). 24 soatdan keyin ham yakuniy holat bo'lmasa hodisa yo'qolmaydi: bizda «qo'llash kutilmoqda» belgisi bilan mas'ul tekshiruv ro'yxatiga o'tadi, ikkala tomon ko'rib chiqadi, kuzatuv qo'lda yopiladi. `failed` → `manual_review` emas, chunki hodisa sizda saqlangan: siz qayta ishlaysiz, biz kuzatishda davom etamiz. GET javobi bir ma'noli bo'lsin: `applied` da nima qo'llangani (`class_done`, `learn_done`, `coins` soni) va coin 0 bo'lsa sababi (`coins_reason`: `already_rewarded` · `not_completed` · `rule`), `failed` da `error` kodi va matni.

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
  "lesson_result_event_id": "lr_7d3f1c2e-9a4b-4c8e-b2f1-0e5d6a7b8c90"
}
```

Uyda `session_key: null`. Moslashtirish: `student_id` (token) + `lesson_id` + `attempt_id`. Server hodisasi o'sha `attempt_id` bilan keladi; `lesson_result_event_id` ni brauzer oldindan biladi, chunki id qolipi **`lr_` + `attempt_id`** deterministik (sizning 5-bandingiz: sessiya + o'quvchi qolipi bekor). Bir urinish — bitta `lesson_result`; bir sessiyada eski urinish `version_changed` bilan yopilib yangisi ochilsa, ikkita har xil `attempt_id` va ikkita har xil `event_id` bo'ladi, to'qnashuv yo'q. Arena hodisalari ham shu qolipda: `ap_` / `ar_` + `attempt_id`.

### 3.2. Qaysi kanal nima uchun

| | Brauzer (`onFinished`) | Server (`lesson_result`) |
|---|---|---|
| Qachon | O'quvchi oxirgi ekranga yetganda, bir marta, avtomatik | O'sha lahzada (`reached_end`) yoki sessiya yopilganda |
| Vazifa | LMS'da darhol ko'rsatish (progress, «bajarildi») va zaxira | **Mukofot va Class holatining manbasi** |
| Yetmasa | O'quvchi oynani yopgan — server hodisasi baribir keladi | Tarmoq — navbat qayta uradi |

Vazifalar aniq ajratilgan (sizning 5-bo'limingiz, avvalgi «qaysi kanal birinchi kelsa» jumlasi bekor):

- **Server hodisasi** — Class holati va mukofotni qo'llashning yagona manbasi. Mukofot kaliti kanonik (o'quvchi + Class; Learn/CodeStrike uchun o'quvchi + Learn), bir marta.
- **Brauzer yuki** — progressni ko'rsatish va shu urinishning natijasini `attempt_id` bilan bog'lash. U mukofot bermaydi; server tasdig'i (`lesson_result` → `applied`) kelmaguncha LMS'da «yakuniy saqlandi» ko'rsatilmaydi, «natija qayta ishlanmoqda» ko'rsatiladi.
- Brauzer v2 yukida `codestrike` yo'q va `"schema_version": 2` bor — u eski mukofot yo'lini **ishga tushirmaydi**; buni siz qabul qiluvchida v1 yukidan ajratasiz.
- Kelish tartibi ta'sir qilmaydi: server hodisasi oldin kelsa brauzer yuki faqat bog'lanadi; brauzer yuki oldin kelsa u kutib turadi; ikkinchi marta kelgani (`attempt_id` bir xil) takroriy ta'sir yaratmaydi.

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
| Hodisa | `lesson_version` = urinishniki, dars yukiniki emas. Qo'shimcha `version_source`: `attempt` (urinishga yozilgan) · `backfill` (quyidagi qoida bilan tiklangan) · `unknown` |
| **O'tishdan oldin ochilgan, versiyasi yozilmagan urinishlar** (sizning 6-bo'limingiz, 22-javob 5.3) | «Oxirgi 7 kunda yuklash bo'lmagan» o'zi dalil emas — bu faqat zaruriy shart. `backfill` faqat **kontent bilan ishonchli bog'lanish** bo'lsa: urinishning har javobida yozilgan savol/variant matni joriy versiya matni bilan aynan mos (`correct_answer` = `options[correct_option]`, savol matni bir xil) **va** T dan oldingi 7 kunda yuklash bo'lmagan — shunda `lesson_version` = joriy reestr versiyasi, `version_source: backfill`. Birorta javobda matn mos kelmasa yoki javob yo'q bo'lsa (tekshiradigan narsa yo'q) — `lesson_version: null`, `version_source: unknown`; hodisa baribir ketadi, reestr versiyasi tarixiy fakt sifatida yozilmaydi. Kalitlar: hozirgi `quiz_keys` eski urinishniki deb **taxmin qilinmaydi**; eski urinish faqat matni mos kelgan kalitlar bilan baholanadi, mos kelmagan yozuv chiqariladi (hozirgi qoida). Yangi versiya kalitlari T dan versiyali jadvalga yoziladi |

### 4.3. O'tish qoidalari

| Holat | Nima bo'ladi |
|---|---|
| Uyda ochiq urinish, brauzer tabi eski versiya bilan ochiq | **Davom etadi** o'z versiyasida: server o'sha versiya kalitlari bilan baholaydi, urinish odatdagidek yakunlanadi (`reached_end` yoki 7 kun). **Qoida 1:** kelgan javob versiyasi urinishning o'z versiyasiga teng — yangi nashr borligi sabab RAD ETILMAYDI. «Oxirgi nashrdan farq qiladi» o'zi hech narsani bildirmaydi |
| O'quvchi sahifani yangiladi, LMS yangi faylni berdi | Eski urinish `trigger: "version_changed"` bilan yopiladi → `lesson_result` (`completed: false`, `participated` o'z qoidasi bo'yicha). Yangi urinish boshlanadi (`attempt_no + 1`), ekran-o'rni ko'chirilmaydi (ekranlar boshqa bo'lishi mumkin). Mukofot: birinchi to'liq yakunlash — yangi urinishda olinadi; mukofot o'quvchi + Class bo'yicha bo'lgani uchun versiya yangi huquq bermaydi |
| Kelgan javob/progress versiyasi urinishning **o'z** versiyasiga mos emas (masalan tab yangilanib yangi fayl eski `attempt_id` bilan yozmoqchi) | **Qoida 2 (konflikt):** `409 version_changed` → sahifada «Dars yangilandi, sahifani yangilang». Javob qabul qilinmaydi; yangi urinish ochiladi. Qoida 1 va 2 har xil shart: birinchisida versiya urinishniki bilan teng, ikkinchisida teng emas |
| Jonli sessiya | Sessiya versiyasi mentor ochgan versiya. Reliz faqat dars vaqtidan tashqarida va jonli sessiya 0 bo'lganda qilinadi (hozir ham shunday) — dars o'rtasida versiya almashmaydi |
| Navbatdagi v1 hodisalar | O'z holicha yetkaziladi, v2 ga aylantirilmaydi |

### 4.4. v1 ni to'xtatish sharti

T — 172 dars yangi versiyada yuklangan kun (dars vaqtidan tashqari, sizga oldindan yozma xabar).

- **T dan:** yangi hodisalar `schema_version: 2`. Yangi yuk v1 guruh-xabarini yaratmaydi.
- **T … T+8 kun:** School API ikkalasini qabul qiladi. Bu davrda v1 faqat eski urinishlardan keladi: T dan oldin ochilgan uyda urinishlar (eng ko'pi 7 kun yashaydi) va navbatda qolgan eski xabarlar.
- **T+8 kun — tekshirish nuqtasi, o'chirish sanasi emas.** Biz tekshiramiz: eski versiyali faol urinish 0 · eski versiyada qayta urinish (`restarted`) 0 · navbatda v1 `pending` va `retry_wait` 0 · hal qilinmagan v1 `manual_review` 0 · tarixiy tiklashlar (50 xabar va keyingilari) yakunlangan. Hammasi bajarilsa sizga «v1 ni yopish mumkin» deb **yozma** xabar beramiz, siz o'z tomoningizda tekshirib tasdiqlaysiz — **v1 ikki tomon tasdig'idan keyin** yopiladi. Birorta shart bajarilmasa nuqta kechiktiriladi, sabab yoziladi.
- Yangilanmagan dars qolmaydi: 172 dars = LMS'dagi hamma JSX dars.

---

## 5. 50 ta xabar: hisobot tartibi (1.1–1.4)

Qabul qildik: **hech narsa yuborilmaydi**, avval hisobot. Tartib:

1. Dars API prod'da yangilanadi (tuzatish kodi tayyor, staging'da sinalgan).
2. 50 xabar **sinov rejimida** qayta yig'iladi — bazaga va School API'ga hech narsa yozilmaydi.
3. Hisobot sizga: `20-ABDULLOH-50-XABAR-HISOBOT-V2-UZ.md` + `20a-50-XABAR-HISOBOT-V2.csv` (2-nashr; `17`/`17a` bekor). Ustunlar 20-hujjat 8-bo'limida (quyidagi jadval 1-nashrniki, tarix uchun).
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
- 50 xabar yangi qoida bilan yig'iladi: amaliyot ekrani test hisobidan tashqari, shuning uchun tafsilot to'liq; `total_questions` — hodisa yopilgan paytdagi qiymat (eski kalitlar aralashmaydi); jonli `completed` faqat `reached_end`.
- `event_id` o'sha qoladi (siz tasdiqladingiz: validatsiyada rad etilgan, saqlanmagan). Agar biror `event_id` sizda saqlangan chiqsa — avval qaysi ma'lumot va mukofot qo'llanganini birga aniqlaymiz, keyin alohida tiklash yo'lini belgilaymiz; `_r1` avtomatik qo'shilmaydi.
- Qisman tafsilot qatorlari yo'q (v1.2); bo'lib qolsa, ikkala tomon QA'sidan oldin yuborilmaydi.

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
| 13 | Server va brauzer bir xil natijani parallel yubordi | Ikkalasi bir `attempt_id` bilan, soniyalar farqi bilan | Bir marta mukofot — faqat server hodisasidan; brauzer yuki bog'lanadi, tartib ta'sir qilmaydi (3.2) |
| 14a | Uyda 7 kun ochiq, tugatmadi | A3: `solo_expired`, `elapsed_sec: 604800`, `last_activity_at` erta | Natija saqlandi, coin yo'q, `elapsed_sec` qirqilmagan |
| 14b | Arena umuman boshlanmadi | C4: `not_started`, `started_at: null`, har o'quvchiga | «Arena natijasi yo'q» holati yopildi, Learn ochiq qoladi |
| 15 | Tafsiloti tushirilgan natija va haqiqatan javobsiz natija | `details: omitted / size` (`available: 2`, `tests.answered: 2`) va `details: full` (`available: 0`, `answered: 0`) | Birinchisida natija saqlanadi, tafsilot yo'q; ikkinchisida javobsizlik haqiqiy |
| 16 | Eski versiyada ochiq urinish paytida yangi dars nashri | Eski tab: o'z versiyasida davom; sahifa yangilansa `version_changed` + yangi urinish (4.3) | Birinchi to'liq yakunlash → mukofot bir marta, versiya huquq yaratmaydi |
| 17 | Eski xabarni tiklashda brauzer orqali oldin berilgan coin takrorlanmasligi | Hisobotda `bizda_holat` + sizning reyestr tekshiruvingiz; faqat belgilangan qatorlar ketadi | Takroriy coin yo'q |
| 18 | Amaliyot ekranini bajargan, testlarga ham javob bergan o'quvchi | `tests` faqat test savollari (`answered` = `questions[]`), amaliyot v2 `practice` blokida | 422 yo'q, tafsilot to'liq, `correct_answers` ga amaliyot kirmagan |
| 19 | Uyda 7 kun + yopilish kechikishi | `occurred_at` = `opened_at` + 7 kun, `elapsed_sec` = 604800, `processed_at` 15 daqiqagacha kech | `manual_review` emas, oddiy natija |
| 20 | Tashqi `lesson_id` almashgan dars (`pm-m2d13-v1` → `v2`) | Hodisa o'z `lesson_id` si bilan; reestr `eski_lesson_id` orqali Class/Learn | Bitta Class, bitta mukofot huquqi; eski id yangi huquq yaratmaydi |
| 21 | Versiyasi yozilmagan eski urinish o'tish kunidan keyin yakunlandi | `lesson_version` backfill (matnlar joriy versiya bilan aynan mos + 7 kunda yuklash yo'q) yoki `null` + `version_source: unknown` | Qabul qilinadi; versiya tarixiy fakt deb yozilmaydi |
| 22 | Bir sessiyada urinish almashdi (`version_changed`) | Ikki `lesson_result`: `lr_<A>` (`completed: false`, `version_changed`) va `lr_<B>` | Ikki yozuv, bitta mukofot (birinchi to'liq yakunlash) |
| 23 | `201` dan keyin uzoq `queued` | GET kuzatuvi 24 soatgacha; 60 daqiqadan keyin ogohlantirish; 24 soatdan keyin mas'ul tekshiruv ro'yxati | Yakuniy holat `applied`/`failed` bir ma'noli; hodisa yo'qolmaydi |

Bizning tomonda 23 tasi avtomatik testga aylanadi (soxta qabul qiluvchi bilan). QA'da `netlify-deploy-v19` da siz bilan birga.

---

## 7. Prod (4.1) va keyingi qadam

`STALE_SESSION_MINUTES` — Kristinadan faqat samarali qiymat va ishlayotgan versiya so'raladi, boshqa hech narsa. Kelishilgan chegaralar (sessiya 2 soat, arena 45 daqiqa, oxirgi savoldan 1 daqiqa) o'zgarmaydi.

**Holat (v1.3):** 22-javobingizda asosiy tuzatishlar qabul qilindi, 5-bo'limdagi 6 tuzatish shu nashrga kiritildi (mukofot kaliti kanonik · jonli 7200 s · backfill faqat matn dalili bilan · C4 `ar_` + `attempt_id` · kuzatish matni yagona · `processed_at` birinchi yig'ilgan vaqt). Sizdan faqat shu 6 ta joyni ko'rib chiqish qoldi; production validatori va tarixiy Learn bog'lanishini siz tekshirasiz. Biz server kodini boshlaymiz.

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
| `eski_lesson_id` | Shu darsning avvalgi tashqi id'lari (yangidan eskiga, `\|` bilan), git tarixidan: masalan `pm-m2d13-v2` ← `pm-m2d13-v1` ← `pm-demoday-pitch-06-v18`. Eski id bilan kelgan tarixiy hodisa shu qator orqali Class/Learn'ga tortiladi; qaysi Class'da bo'lgani CRM tarixi bilan siz tomonda tasdiqlanadi, avtomatik birlashtirilmaydi. Relizda joriy versiya yangilanganda bu ustun o'chmaydi, faqat to'ldiriladi |

Versiya taqsimoti hozir: `v5` — 110, `v6` — 54, `v7` — 7, `v8` — 1. 172 dars relizida har qatorning `lesson_version` i yangilanadi, `class_id` va `learn_id` o'zgarmaydi.
