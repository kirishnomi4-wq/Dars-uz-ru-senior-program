# Abdullohga: 50 ta xabar, uchta hodisaning JSON namunalari, prod ma'lumotlari

**Sana:** 09.11.2026
**Kimga:** Abdulloh (LMS, CRM, School API)
**Kimdan:** JSX va Dars API jamoasi
**Asos:** `07-ABDULLOH-JAVOBLAR-VA-QARORLAR-UZ.md` va `10-ABDULLOH-ANIQLASHTIRISH-JAVOB-UZ.md` (06.11)

Hujjat to'rt qismdan iborat. Javobingiz kerak bo'lgan hamma savol **0-bo'limda** bitta ro'yxatda.

| Qism | Nima haqida | Sizdan nima kerak |
|---|---|---|
| 1 | School API rad etgan 50 ta eski xabar | 4 ta savolga javob (1.1–1.4) |
| 2 | Uchta yangi hodisaning JSON namunalari (v1) | Namunalarni tasdiqlash yoki tuzatish, 10 ta savol (2.1–2.10) |
| 3 | `07` 8-bo'limidagi 10 ta qabul ssenariysi | Ko'rib chiqish |
| 4 | Siz so'ragan prod ma'lumotlari | 1 ta savol (4.1), GW 69 — ixtiyoriy |

---

## 0. Savollar ro'yxati

Har savolda bizning taklifimiz **qalin** yozilgan. Rozi bo'lsangiz «ha» deb yozishingiz kifoya.

**50 ta xabar (1-qism)**

| # | Savol | Bizning taklif |
|---|---|---|
| 1.1 | 422 olgan xabarni tuzatib, **o'sha `event_id`** bilan yuborsak bo'ladimi yoki yangi id kerakmi (`…_r1`)? | **a) o'sha id** — School API ularni hech qachon qabul qilmagan |
| 1.2 | Sentyabr–oktyabr natijasi hozir kelsa, LMS uni qabul qiladimi? Natija va coin hozir beriladimi? | **ha, odatdagidek** |
| 1.3 | O'quvchining shu darsdagi natijasi keyinroq yetkazilgan bo'lsa, biz uni yangi xabardan chiqarib tashlaymiz. Shu yetarlimi? | **ha**, School API ham o'quvchi + dars bo'yicha tekshirsa yaxshi |
| 1.4 | Jonli dars xabarini butun guruh bilan qayta yuborsak bo'ladimi (1.3 dagi istisno bilan)? | **ha** |

**JSON namunalari (2-qism)**

| # | Savol | Bizning taklif |
|---|---|---|
| 2.1 | Uchala hodisa mavjud `lesson-results` manziliga keladi, turini `event_type` maydoni ajratadi | **ha** (`07`, 2.13 ga mos) |
| 2.2 | Uchala hodisa ham **har o'quvchiga alohida** yuboriladi, arena natijasi ham | **ha** (sababi 2.2-bo'limda) |
| 2.3 | Muvaffaqiyatli qabul javobi va xato kodlari 2.6-bo'limdagidek | **ha** |
| 2.4 | Dars natijasida dars-podiumi (`rank`) va guruhga bog'liq nishonlar (`speedster`, `top_1…3`) bo'lmaydi | **ha** — natija o'quvchi oxirgi ekranga yetgan lahzada ketadi, bu paytda boshqalar hali ishlayapti |
| 2.5 | «O'quv qismida qatnashgan» ta'rifi | **kamida bitta ekran oldinga o'tgan yoki kamida bitta savolga javob bergan** |
| 2.6 | Jonli darsda `completed: false` bo'lgan o'quvchi keyin uyda darsni oxirigacha o'tdi. O'quv qismi coin'i beriladimi? | Qaror sizniki: **a)** yo'q, birinchi natija qotadi · **b)** ha, birinchi `completed: true` natija hisobga olinadi |
| 2.7 | Arenada qatnashmagan o'quvchida `badges` bo'sh massiv bo'lishi mumkin | **ha** — hozir School API bo'sh massivni 422 bilan rad etadi |
| 2.8 | Brauzer kanali (`onFinished`): oxirgi ekranda avtomatik bir marta ketadi, `codestrike` bloki undan olib tashlanadi. LMS `onFinished` kelganda oynani yopmaydi | **ha** |
| 2.9 | O'tish davrida School API eski guruh-xabarini (v1) ham, yangi hodisalarni ham qabul qiladi. 172 dars yangilangach v1 to'xtatiladi | **ha** |
| 2.10 | Arena savollari Learn savollariga view orqali bog'lanadi, hodisada faqat `quiz-N` bo'ladi | **ha** (Shahzoda, 2.3 «a») |

**Prod ma'lumotlari (4-qism)**

| # | Savol |
|---|---|
| 4.1 | `STALE_SESSION_MINUTES` ning prod qiymatini Kristina konteynerdan tasdiqlay oladimi? |
| 4.2 | GW 69 — ixtiyoriy (4.3-bo'lim). Javob shart emas |

---

## 1. School API rad etgan 50 ta xabar

### 1.1. Nima topildi

Siz so'ragan prod ro'yxatini tayyorlayotganda Dars API navbatida **50 ta xabar** topildi (49 tasi 06.11 da, 1 tasi 07.11 da qo'shildi).
School API ularni **422** javobi bilan rad etgan, ular `manual_review` holatida turibdi.

| | |
|---|---|
| Davr | 21.09 – 07.11 |
| Xabarlar | 50 ta: 15 tasi jonli dars (`live`), 35 tasi uyda (`solo`) |
| O'quvchilar | **229 nafar**. Ularning shu darsdagi natijasi LMS'ga yetib bormagan |
| Hozirgi holat (09.11, 01:32 Toshkent) | Navbatda 4630 ta xabar yetkazilgan, 50 tasi `manual_review`, 5 tasi `skipped`, kutayotgani yo'q. 07.11 dan keyin yangi rad yo'q: oxirgi 100 xabarning (07.11 → 08.11) hammasi qabul qilingan |

### 1.2. Sabablar — hammasi bizning tomonda

| School API javobi | Soni | Sabab |
|---|---|---|
| `The correct flag does not match the selected option.` | 33 (solo) | O'quvchi to'g'ri variantni tanlagan, lekin server `correct: false` yuborgan. Urinish yozilgan paytda javob kaliti serverda hali yo'q edi, urinish `false` bo'lib yozilgan. Xabar yig'ilganda kalit bor edi, shu sababli `correct_option` bilan qarama-qarshilik chiqdi. O'quvchi ekranida natija to'g'ri ko'ringan |
| `Live mode permits exactly one attempt per question.` | 15 (live) | Jonli darsda bitta o'quvchi bitta savolga ikki marta javob yuborgan (orasi ~25 daqiqa). Shu bitta o'quvchi sababli butun guruh xabari rad etilgan. Bitta xabarda (21.09) shu urinish `elapsed times must increase` xatosini ham bergan |
| `The answer must match options[option].` | 2 (solo) | Uyda o'tilgan urinish davomida **dars yangilangan**. Server urinishlarni ekran raqami bo'yicha bog'lagani uchun boshqa versiyadagi javoblar shu savol tarixiga qo'shilib ketgan. 23–30.09: savol o'sha, variant matni tahrirlangan. 31.10–07.11: dars 02.11 da qisqartirilgan, o'sha raqamdagi ekranda **boshqa savol** turgan |

School API qoidalari to'g'ri ishlagan.

**Qo'shimcha topilma.** Bitta jonli darsda (`sess_992402…`, `pg-crud-04-05-v18`) 7 o'quvchining ikki savolida variant matni o'rniga `[object Object]` yozilgan: dars ikki tilli matnni satrga aylantirmasdan yuborgan. Bu xabarning rad etilishiga sabab emas, lekin shu matn bilan yetkazilishi ham noto'g'ri edi.

**Coin'ga ta'siri.** Birinchi sabab `correct_answers` ga ham tekkan. Tuzatilgan xabarlarda **30 o'quvchida** (hammasi uyda o'tilgan dars) to'g'ri javoblar soni ortadi, jami **+64 to'g'ri javob**. Jonli darslarda `correct_answers` o'zgarmaydi, faqat ortiqcha urinishlar olib tashlanadi.

### 1.3. Tuzatish (kod tayyor, sinovdan o'tgan, prod'ga hali chiqmagan)

1. Xabar yig'ilayotganda:
   - jonli darsda har savol bo'yicha **faqat birinchi urinish** yuboriladi;
   - `correct` saqlangan urinishdan olinmaydi, kalitdan qayta hisoblanadi (`option === correct_option`);
   - savol tarixiga faqat **o'sha savol va o'sha variantlar** bilan berilgan urinishlar kiradi. Boshqa dars versiyasida berilgan javoblar tashlanadi, «tuzatib» yuborilmaydi;
   - to'g'ri javob matni kalitga mos kelmasa yoki matn o'rnida `[object Object]` bo'lsa, o'sha o'quvchining batafsil qismi yuborilmaydi.
2. Yuborishdan oldin Dars API School API'ning shu qoidalarini o'zi tekshiradi. Bitta o'quvchining batafsil qismi buzuq bo'lsa, **faqat o'shaning batafsil qismi** tashlanadi. Guruh xabari yiqilmaydi.
3. 50 ta xabar manba ma'lumotdan **yangidan yig'iladi**. Eski xabarni o'zgarishsiz qayta yuborish yordam bermaydi, u yana 422 oladi. Eski holat arxivda saqlanadi.

Sinov — haqiqiy 50 ta xabar bilan (07.11):

| | |
|---|---|
| O'quvchilar | 229 |
| To'liq (asosiy natija + batafsil qism) | 222 |
| Faqat asosiy natija (batafsil qism `[object Object]` sababli tashlandi) | 7 |
| To'g'ri javoblar soni ortadi | 30 o'quvchida, jami +64 |
| Savol tarixidan olib tashlangan urinishlar | 30 (jonli darsdagi ortiqcha urinishlar va boshqa versiyadagi javoblar) |

Avtomatik testlar: unit 64/64, integratsion 92/92. Uchala prod holati (ikki versiya almashuvi va `[object Object]`) test sifatida kiritilgan.

### 1.4. Yuborish tartibi

1. Siz 1.1–1.4 ga javob berasiz.
2. Dars API staging'da, keyin prod'da yangilanadi.
3. 50 ta xabar avval **sinov rejimida** yig'iladi, hech narsa yuborilmaydi. Natijani sizga yuboramiz.
4. **Bitta xabar** yuboriladi. Siz LMS'da natija va coin to'g'ri tushganini tasdiqlaysiz.
5. Qolgan 49 tasi yuboriladi.

Ro'yxat (`event_id` va School API'ning `request_id` si) — **Ilova A**da.

---

## 2. Uchta hodisaning JSON namunalari (v1)

### 2.1. Umumiy qoidalar

| Qoida | Qiymat |
|---|---|
| Manzil | `POST /api/v1/integrations/dars-platform/lesson-results` (mavjud) |
| Hodisa turi | `event_type`: `lesson_result` · `arena_participation` · `arena_result` |
| Versiya | `schema_version: 2`. Maydon bo'lmasa — hozirgi v1 guruh-xabari |
| Vaqtlar | UTC, ISO-8601, soniyagacha (`2026-11-10T09:00:12Z`). Hammasi **server vaqti**, o'quvchi qurilmasining soati ishlatilmaydi |
| `occurred_at` | Hodisa sodir bo'lgan lahza (yuborilgan lahza emas) |
| Qayta yuborish | O'sha `event_id`, **bayt-ma-bayt o'sha mazmun**. Tanada yuborish vaqti yo'q, shuning uchun mazmun o'zgarmaydi |
| O'quvchi | `student.student_id` = token `sub` = `student_students.id`, `id_type: "lms"` (`07`, 5.1) |
| Jonli sessiya kaliti | `session_key` = `sess_<PIN>_<boshlanish>`, hozirgi `event_id` qolipi bilan bir xil |
| Ism, kontakt | Hech qaysi hodisada yo'q |
| Dars versiyasi | Urinish o'quvchi ochgan `lesson_version` ga bog'lanadi. Dars yangilangach berilgan javoblar shu urinishga qo'shilmaydi (1.2 dagi 2 ta xabar sababi). 172 dars yangilanganda uyda ochiq qolgan urinishlarning hammasi shu holatga tushadi |
| Matnlar | Savol, variant va javob har doim satr, o'quvchi ko'rgan tilda (`lang`) |
| Hajm | Bitta hodisa ≤ 1 MB. Batafsil qism (`questions`) sig'masa tashlanadi, asosiy qism baribir ketadi |

### 2.2. Nega har o'quvchiga alohida

50 ta xabardan 15 tasida **bitta** o'quvchining xatosi sababli butun guruh natijasiz qolgan. Har o'quvchiga alohida hodisa bo'lsa:
- bitta o'quvchining xatosi boshqalarga tegmaydi;
- har o'quvchi uchun takroriy mukofotdan himoya oddiyroq bo'ladi (`07`, 2.9);
- dars natijasi o'quvchi oxirgi ekranga yetgan lahzada ketadi, guruhni kutmaydi (`07`, 2.2).

### 2.3. `event_id` qoliplari

Qolip: `[A-Za-z0-9][A-Za-z0-9._:@-]*`, ≤ 128 belgi (hozirgi qoida).

| Hodisa | Jonli dars | Uyda (solo) |
|---|---|---|
| `lesson_result` | `lr_<PIN>_<boshlanish>_<student_id>` | `lr_solo_<student_id>_<lesson_id>_<boshlanish>` |
| `arena_participation` | `ap_<PIN>_<boshlanish>_<student_id>` | — (solo'da arena yopiq, `07` 2.11) |
| `arena_result` | `ar_<PIN>_<boshlanish>_<student_id>` | — |

Bir sessiyada bitta arena bo'ladi: arena yakunlangach qayta ochilmaydi (28.10 dan, PODIUM-05). Shuning uchun arena id'si sessiya kalitidan chiqadi.

### 2.4. Uchala hodisaning umumiy qismi

```json
{
  "schema_version": 2,
  "event_type": "lesson_result",
  "event_id": "lr_483920_20261110T090012Z_34174",
  "occurred_at": "2026-11-10T10:12:40Z",
  "lesson_id": "netlify-deploy-v19",
  "lesson_version": "v19",
  "lesson_title": "Netlify va deploy",
  "mode": "live",
  "session_key": "sess_483920_20261110T090012Z",
  "group_id": 861,
  "teacher_id": 145,
  "student": { "student_id": 34174, "id_type": "lms" }
}
```

Solo'da `group_id`, `teacher_id`, `session_key` bo'lmaydi (hozirgi qoida).

### 2.5. Namunalar

#### A. `lesson_result` — o'quv qismi natijasi

**Qachon ketadi:**
- o'quvchi oxirgi o'quv ekraniga **birinchi marta** yetganda, darhol (`trigger: "reached_end"`). «Darsni yakunlash» tugmasi kutilmaydi;
- oxirigacha yetmagan bo'lsa — sessiya yopilganda (`trigger: "session_closed"`);
- solo'da oxirigacha yetmagan bo'lsa — urinish 7 kundan keyin yopilganda (`trigger: "solo_expired"`).

**A1. Yakunlagan o'quvchi (jonli dars):**

```json
{
  "schema_version": 2,
  "event_type": "lesson_result",
  "event_id": "lr_483920_20261110T090012Z_34174",
  "occurred_at": "2026-11-10T10:12:40Z",
  "lesson_id": "netlify-deploy-v19",
  "lesson_version": "v19",
  "lesson_title": "Netlify va deploy",
  "mode": "live",
  "session_key": "sess_483920_20261110T090012Z",
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
    "screens": { "reached": 11, "total": 11 },
    "tests": { "total_questions": 2, "answered": 2, "correct_answers": 2 },
    "duration_sec": 4295,
    "badges": ["all_correct", "first_try", "graduate"]
  },
  "lang": "uz",
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

`questions[]` va `achievements[]` — hozirgi batafsil qism (`RESULT_DETAILS=a`) bilan bir xil format, faqat dars savollari (`kind: "test"`). Namunada joy tejash uchun bittadan yozuv ko'rsatilgan.

**A2. Oxirigacha yetmagan o'quvchi (sessiya yopilganda):**

```json
{
  "schema_version": 2,
  "event_type": "lesson_result",
  "event_id": "lr_483920_20261110T090012Z_34190",
  "occurred_at": "2026-11-10T10:41:00Z",
  "lesson_id": "netlify-deploy-v19",
  "lesson_version": "v19",
  "lesson_title": "Netlify va deploy",
  "mode": "live",
  "session_key": "sess_483920_20261110T090012Z",
  "group_id": 861,
  "teacher_id": 145,
  "student": { "student_id": 34190, "id_type": "lms" },
  "result": {
    "attempt_no": 1,
    "trigger": "session_closed",
    "participated": true,
    "completed": false,
    "opened_at": "2026-11-10T09:03:44Z",
    "completed_at": null,
    "screens": { "reached": 6, "total": 11 },
    "tests": { "total_questions": 2, "answered": 1, "correct_answers": 1 },
    "duration_sec": 5836,
    "badges": ["participant"]
  },
  "lang": "uz",
  "questions": [],
  "achievements": []
}
```

**`result` maydonlari:**

| Maydon | Turi | Ma'nosi |
|---|---|---|
| `attempt_no` | int ≥ 1 | O'quvchining shu darsdagi nechanchi natijasi. Hodisa yaratilganda beriladi, qayta yuborishda o'zgarmaydi. Mukofot uchun `1` (`07`, 2.4 va 2.12) |
| `trigger` | `reached_end` · `session_closed` · `solo_expired` | Natija nima sababdan yozildi |
| `participated` | bool | O'quv qismida qatnashgan (ta'rif — savol 2.5) |
| `completed` | bool | Oxirgi o'quv ekraniga yetgan. `true` bo'lsa `participated` ham doim `true` |
| `opened_at` | vaqt · null | Dars birinchi ochilgan lahza. Eski yozuvlarda `null` (`07`, 3.3) |
| `completed_at` | vaqt · null | Oxirgi ekranga birinchi yetgan lahza |
| `screens.reached` | int | Yetgan eng oxirgi ekran (1 dan boshlab). Orqaga qaytsa ham kamaymaydi |
| `tests` | — | Dars savollari (arena kirmaydi). `correct_answers ≤ answered ≤ total_questions` |
| `duration_sec` | 0…86400 | Dars ochilgandan natija yozilgangacha |
| `badges` | massiv | Hozirgi kalitlar, guruhga bog'liqlari bundan mustasno (savol 2.4) |

Practice («Bajardim») qadamlari, ekranlar vaqti va o'quvchi matnlari hodisaga kirmaydi. Ular view'larda bo'ladi (`07`, 3.1–3.3).

#### B. `arena_participation` — arenaga kirish

**Qachon ketadi:** arena boshlangan va o'quvchi ekranida **birinchi arena savoli ko'rsatilgan** lahzada (`10`, 2-bo'lim). Lobbi yoki CodeStrike tugmasi hisobga kirmaydi. Kech qo'shilgan o'quvchida — u ko'rgan birinchi savol.

```json
{
  "schema_version": 2,
  "event_type": "arena_participation",
  "event_id": "ap_483920_20261110T090012Z_34174",
  "occurred_at": "2026-11-10T10:15:03Z",
  "lesson_id": "netlify-deploy-v19",
  "lesson_version": "v19",
  "lesson_title": "Netlify va deploy",
  "mode": "live",
  "session_key": "sess_483920_20261110T090012Z",
  "group_id": 861,
  "teacher_id": 145,
  "student": { "student_id": 34174, "id_type": "lms" },
  "arena": {
    "started_at": "2026-11-10T10:14:58Z",
    "questions_total": 12
  },
  "participation": {
    "student_arena_no": 1,
    "first_question_id": "quiz-0",
    "first_question_order": 1,
    "first_shown_at": "2026-11-10T10:15:03Z",
    "source": "shown"
  }
}
```

| Maydon | Ma'nosi |
|---|---|
| `student_arena_no` | O'quvchining shu darsdagi nechanchi arenasi. Learn va mukofot uchun `1` (`07`, 2.10) |
| `first_shown_at` | Dars ekranida savol ko'ringani haqidagi xabar serverga kelgan lahza (server vaqti) |
| `source` | `shown` — ko'ringani haqida xabar keldi · `answer` — xabar tarmoqda yo'qoldi, lekin o'quvchi javob yubordi. Javob vaqti qatnashish lahzasi bo'ladi |

#### C. `arena_result` — arena yakuni

**Qachon ketadi:** arena yakunlanganda, sessiyadagi **har bir LMS o'quvchisiga**, arenaga kirmaganlarga ham (`07`, 2.6 va 2.8). Yakunlanish sabablari (qaysi biri birinchi bo'lsa):

| `end_reason` | Qachon |
|---|---|
| `mentor` | Mentor arenani yakunladi |
| `last_question_timeout` | Oxirgi savolning server vaqti tugaganidan 1 daqiqa o'tdi |
| `arena_limit` | Arena boshlanganidan 45 daqiqa o'tdi |
| `session_limit` | Sessiya boshlanganidan 2 soat o'tdi (`07`, 2.14) |
| `session_closed` | Sessiya boshqa sabab bilan yopildi (mentor darsni yakunladi yoki mentor ekranidan signal kelmay qoldi, 4.1-bo'lim) |
| `not_started` | Arena umuman boshlanmadi, sessiya yopildi |

**C1. Qatnashgan, 2-o'rin:**

```json
{
  "schema_version": 2,
  "event_type": "arena_result",
  "event_id": "ar_483920_20261110T090012Z_34174",
  "occurred_at": "2026-11-10T10:19:30Z",
  "lesson_id": "netlify-deploy-v19",
  "lesson_version": "v19",
  "lesson_title": "Netlify va deploy",
  "mode": "live",
  "session_key": "sess_483920_20261110T090012Z",
  "group_id": 861,
  "teacher_id": 145,
  "student": { "student_id": 34174, "id_type": "lms" },
  "arena": {
    "started_at": "2026-11-10T10:14:58Z",
    "finished_at": "2026-11-10T10:19:30Z",
    "end_reason": "mentor",
    "questions_total": 12,
    "players_total": 17
  },
  "result": {
    "student_arena_no": 1,
    "participated": true,
    "participated_at": "2026-11-10T10:15:03Z",
    "answered": 12,
    "correct_answers": 10,
    "points": 9350,
    "place": 2,
    "badges": ["arena_top_2"]
  },
  "lang": "uz",
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
    }
  ]
}
```

**C2. Arenaga kirdi, javob bermadi:**

```json
"result": {
  "student_arena_no": 1,
  "participated": true,
  "participated_at": "2026-11-10T10:15:04Z",
  "answered": 0,
  "correct_answers": 0,
  "points": 0,
  "place": null,
  "badges": []
},
"questions": []
```

**C3. Darsda bor edi, arenaga kirmadi:**

```json
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
"questions": []
```

| Maydon | Ma'nosi |
|---|---|
| `players_total` | Arenaga kirganlar soni, PIN bilan kirganlar ham. O'rin shular orasida hisoblanadi |
| `points` | CodeStrike ochkosi — o'quvchi ekranda ko'rgan formula bilan bir xil (tezlik + ketma-ket to'g'ri javob uchun bonus) |
| `place` | 1, 2, 3 yoki `null`. Tartib: ochko ↓, to'g'ri javoblar ↓, oldin qo'shilgan. Javob bermagan o'quvchiga o'rin berilmaydi |
| `student_arena_no` | Arenaga kirmagan bo'lsa `null` |
| `questions[]` | Har arena savoli matni bilan. Hozir arena matni serverga yozilmaydi — yangi darslarda yoziladi |

Arena savoli `quiz-N` = darsdagi `QUIZ_BANK[N]`, aralashtirilmaydi. Learn id'siga moslik view'da (`lesson_id` + `lesson_version` + `lang` + `order`, `07` 2.16).

**«Hali arena natijasi yo'q»** = shu o'quvchi uchun `arena_result` hali kelmagan. **«Yakunlandi, qatnashmadi»** = `arena_result` keldi, `participated: false` (`07`, 2.6).

### 2.6. Qabul javobi va xato kodlari

Hozirgi qoidalar saqlanadi, javob tanasiga `event_type` qo'shiladi.

| Kod | Qachon | Dars API nima qiladi |
|---|---|---|
| `201` | Yangi hodisa saqlandi | `delivered` |
| `200` | O'sha id, o'sha mazmun (`duplicate: true`) | `delivered` |
| `409` | O'sha id, boshqa mazmun | qayta yubormaydi, `manual_review` + Telegram |
| `422` | Tuzilma yoki qiymat xato, o'quvchi topilmadi | qayta yubormaydi, `manual_review` + Telegram |
| `429`, `5xx`, tarmoq | Vaqtinchalik | o'sha mazmun bilan qayta urinadi |

Taklif qilinadigan `201` tanasi:

```json
{
  "data": {
    "event_id": "ar_483920_20261110T090012Z_34174",
    "event_type": "arena_result",
    "accepted": true,
    "duplicate": false
  }
}
```

**Kelish tartibi kafolatlanmaydi.** Biz bir o'quvchi uchun `arena_participation` ni `arena_result` dan oldin navbatga qo'yamiz, lekin qayta urinishda ular almashib kelishi mumkin. Qabul qiluvchi har qanday tartibni to'g'ri hisoblashi kerak.

### 2.7. O'tish davri

1. School API yangi hodisalarni qabul qilishga tayyor bo'ladi, eski v1 guruh-xabarini ham qabul qilaveradi.
2. Dars API prod'ga yangi hodisalar o'chiq holda chiqadi. Eski darslar buzilmaydi.
3. 172 dars yangi versiyada yuklanadi (dars vaqtidan tashqari).
4. Yangi hodisalar yoqiladi, v1 guruh-xabari to'xtatiladi (savol 2.9).

Prod'ga chiqarish kunini alohida xabar qilamiz.

---

## 3. Qabul ssenariylari (`07`, 8-bo'lim)

| # | Ssenariy | Dars API nima yuboradi | Sizning tomonda kutiladi |
|---|---|---|---|
| 1 | Oxirgi ekranga yetdi, tugmani bosmadi | `lesson_result` (`reached_end`, `completed: true`) darhol. Arena ochiq qoladi | Natija saqlandi |
| 2 | Arenaga kirdi, javob bermadi | `arena_participation`, keyin `arena_result` (`participated: true`, `answered: 0`) | Learn avtomatik bajarildi, keyingi dars ochildi |
| 3 | Learn oldin bajarilgan, arena keyin tugadi | Odatdagi `arena_result` | CodeStrike coin'i yo'q |
| 4 | CodeStrike coin'i oldin berilgan, Learn keyin tugadi | Odatdagi `arena_result` | Learn coin'i yo'q |
| 5 | Learn CodeStrike sababli avtomatik bajarildi | `arena_participation` → `arena_result` | CodeStrike coin'i to'silmaydi |
| 6 | Bir vaqtda yakunlash, ikki kanal, takroriy yetkazish | O'sha id, o'sha mazmun. Brauzer kanalida CodeStrike yo'q (savol 2.8) | Ikki marta mukofot yo'q |
| 7 | 1-arena nol, 2-arena yuqori | 2-arena `student_arena_no: 2` | 1-natija va mukofot o'zgarmaydi |
| 8 | Mentor tabini yopdi / ochiq qoldirdi / oxirgi savolgacha yetmadi | `end_reason`: `session_closed` · `session_limit` · `last_question_timeout` yoki `arena_limit` | Natijalar yakunlandi |
| 9 | Darsni tugatmagan o'quvchi | `lesson_result` (`session_closed`, `completed: false`) | Class bajarilmagan, coin yo'q (`10`, 3.2) |
| 10 | Solo, eski darslar, ikki til | Solo: faqat `lesson_result`. Eski darslar: o'tish davrida v1. Til: `lang` | Regressiya yo'q |

Bizning tomonda bu ssenariylar avtomatik testlarga aylantiriladi (soxta qabul qiluvchi bilan). QA'da `netlify-deploy-v19` darsida siz bilan birga, kompyuter va mobilda tekshiramiz.

---

## 4. Siz so'ragan prod ma'lumotlari

### 4.1. Sessiya yopilish muddatlari (`07`, 2.15)

| | Qiymat | Manba |
|---|---|---|
| Jonli sessiya | Mentor ekranidan signal (har 10 soniyada) `STALE_SESSION_MINUTES` daqiqa kelmasa yopiladi. Tekshiruv har 15 daqiqada, ya'ni amalda muddat + 0…15 daqiqa | Kod |
| `STALE_SESSION_MINUTES` prod qiymati | **Tasdiqlanmagan.** Biz Kristinaga bergan `.env.deploy.prod` faylida bu kalit yo'q, bunda kod standarti 30 ishlaydi. Kristina uni konteynerga o'zi qo'shgan bo'lishi mumkin. Aniq qiymatni faqat konteyner beradi: `printenv STALE_SESSION_MINUTES` (bo'sh chiqsa — 30) | Savol 4.1 |
| Uyda (solo) | Boshlanganidan **7 kun** o'tgach yopiladi. Bu sozlama emas, kodda qat'iy (`SOLO_AUTO_FINISH_DAYS = 7`), prod versiya `7c5e2ea6` da ham shunday. Tekshiruv har 15 daqiqada. Muddat boshlangan lahzadan hisoblanadi, oxirgi faollikdan emas: 50-xabardagi o'quvchi 07.11 da ishlayotgan paytida urinishi yopilgan | Kod, prod xabari |

Prod'dagi oxirgi 200 sessiya (06.11 → 08.11):

| | Soni |
|---|---|
| Jonli: mentor yopgan | 34 |
| Jonli: mentor signali kelmay qolgani uchun yopilgan | 12 |
| Uyda: oxirigacha o'tilgan | 119 |
| Uyda: o'quvchi jonli darsga o'tgani uchun yopilgan | 35 |
| Jonli dars davomiyligi | median 1,07 soat; 46 tadan 3 tasi 2 soatdan uzun (2,11 · 2,45 · 3,27) |

Yangi 2 soatlik chegara (`07`, 2.14) shu 3 ta holatga tegadi.

### 4.2. 02.11 dan keyingi xabarlar (`07`, 3.3)

- 02.11 ~14:47 UTC dan batafsil qism yoqilgan (`RESULT_DETAILS=a`, prod health).
- Admin API oxirgi 100 xabarni beradi: 07.11 06:24 → 08.11 20:03 UTC — 100 tasi `201`. Ro'yxat ilova faylda: `14a-OXIRGI-100-XABAR.csv` (`event_id`, holat, HTTP status, `request_id`, xato; ism yo'q).
- 02.11 dan keyin rad etilganlar — 2 ta (Ilova A: A.2 dagi 34 va 35-qatorlar).
- 02.11 → 06.11 oralig'ining to'liq ro'yxati admin API'da yo'q. Uni Ilova B dagi 7-so'rov beradi.
- CRM'dagi `jsx_lesson_*` jadvallari to'lishini siz tekshirasiz (`07`, 3.3).

### 4.3. GW 69 va oktyabr yig'masi (`07`, 4.1–4.2) — ixtiyoriy

Bizda prod bazaga to'g'ridan-to'g'ri kirish yo'q, admin API esa faqat oxirgi 200 sessiyani beradi (05.11 dan). GW 69 (21.10) va oktyabr shunga kirmaydi.

GW 69 da ko'rilgan holat (7 o'quvchida Learn urinishsiz «o'tilgan», 5 o'quvchida «yopiq») eski «12 dan 7 to'g'ri» qoidasiga tegishli. Bu qoida 06.11 da bekor qilindi (`10`, 1-bo'lim), yangi hodisalarda bunday holat bo'lmaydi. Shuning uchun bu tekshiruv **ixtiyoriy**, ishni to'xtatmaydi.

Kerak bo'lsa: Kristina **Ilova B** dagi so'rovlarni prod bazada yurgizadi. Hammasi faqat o'qiydi, ism va nik chiqarmaydi. 1–5-so'rovlar — GW 69, 6-so'rov — oktyabr yig'masi, 7-so'rov — 02.11 dan keyingi xabarlar.

### 4.4. `lms_participants.crm_id` (`07`, 5.2)

Oxirgi 40 ta jonli sessiyada (06.11 → 08.11) **300 o'quvchidan 300 tasida** `crm_id` yozilgan.

---

## Ilova A. Rad etilgan 50 ta xabar

`request_id` — School API'ning rad javobidagi id. Loglardan topish uchun. Sana — xabar yuborilgan kun.

### A.1. Jonli darslar — 15 ta xabar, 194 o'quvchi

| # | Sana | `event_id` | Dars | O'quvchi | Xato | `request_id` |
|---|---|---|---|---|---|---|
| 1 | 21.09 | `sess_027948_20260921T134401Z` | html-practice-portfolio-v2 | 17 | bitta urinish | `5f071011-23ca-4e71-924a-d7fe03b35195` |
| 2 | 29.09 | `sess_137686_20260929T121301Z` | react-api-get-05-v18 | 15 | bitta urinish | `1861e9d3-48b6-4a50-b87b-18dd941c26fb` |
| 3 | 30.09 | `sess_330364_20260930T103644Z` | pm-m2d7-v1 | 12 | bitta urinish | `6b3830a5-5dc2-4fe1-ad7a-bf3ae0e9173a` |
| 4 | 30.09 | `sess_819479_20260930T103109Z` | js-intro-01-v18 | 8 | bitta urinish | `f8053672-3b8f-4a7c-bc95-63a35fe4c902` |
| 5 | 05.10 | `sess_365731_20261005T121454Z` | pm-m4d15-v1 | 13 | bitta urinish | `69cbdde0-28cc-45da-8c69-3f00e4375b3a` |
| 6 | 05.10 | `sess_903631_20261005T104116Z` | html-02-v16 | 15 | bitta urinish | `44a5dc9e-1601-4709-b022-2ef8b8a8c546` |
| 7 | 07.10 | `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 13 | bitta urinish | `a49f0326-d65b-4ead-aa3f-48e6700e6f4d` |
| 8 | 09.10 | `sess_019443_20261009T121448Z` | js-loops-01-v18 | 16 | bitta urinish | `fc08c153-e18c-4cc7-aa6e-ef1d4a4a3dbb` |
| 9 | 12.10 | `sess_098894_20261012T135339Z` | html-practice-portfolio-v2 | 15 | bitta urinish | `c00c0c0b-d4a7-4f18-9f49-668e323fc8e5` |
| 10 | 12.10 | `sess_819195_20261012T103453Z` | css-01-v17 | 16 | bitta urinish | `0f3a9e2f-96ae-49bf-a506-4ba98186d250` |
| 11 | 27.10 | `sess_309563_20261027T041455Z` | pm-m1d6-v1 | 15 | bitta urinish | `7c45b39b-4bf0-4073-94f7-e5df54cf7c03` |
| 12 | 27.10 | `sess_728518_20261027T121132Z` | fullstack-connect-practice-p2-v18 | 7 | bitta urinish | `a36d93dc-dcb0-4f17-9e6a-21fdd254c458` |
| 13 | 27.10 | `sess_992402_20261027T132946Z` | pg-crud-04-05-v18 | 13 | bitta urinish | `b383dc3a-f33f-4c15-852e-e8c1a9802269` |
| 14 | 29.10 | `sess_204521_20261029T141614Z` | pm-m4d7-v1 | 12 | bitta urinish | `7e16ab06-c93f-4245-9f40-6f5870f8e50d` |
| 15 | 30.10 | `sess_482974_20261030T121455Z` | react-api-get-05-v18 | 7 | bitta urinish | `2fea89bf-8862-46ff-9d93-65165fda4e30` |

### A.2. Uyda o'tilgan darslar — 35 ta xabar, har birida 1 o'quvchi

`event_id` ichida dars id'si bor.

| # | Sana | `event_id` | Xato | `request_id` |
|---|---|---|---|---|
| 1 | 28.09 | `solo_31347_pm-m1d2-v1_20260921T111944Z` | `correct` | `40197b77-cceb-4dd9-9547-d6816fae5511` |
| 2 | 28.09 | `solo_34941_pm-m1d2-v1_20260921T132950Z` | `correct` | `e1a2c225-0f69-4e7c-99e9-b3d8e8cfc60c` |
| 3 | 28.09 | `solo_35476_pm-m2d13-v1_20260921T111656Z` | `correct` | `3bcd1aa0-5f1d-4762-a999-d92794a8f439` |
| 4 | 28.09 | `solo_35487_pm-m2d2-v1_20260921T112604Z` | `correct` | `a1dd4b98-f21e-4334-972a-28b1bad64655` |
| 5 | 28.09 | `solo_36410_pm-m1d2-v1_20260921T131932Z` | `correct` | `7b1c7414-2efa-4cfa-8fd0-9d12f1342128` |
| 6 | 28.09 | `solo_36995_pm-m1d2-v1_20260921T120152Z` | `correct` | `fa06506f-95de-4106-9c40-d9c7acc41628` |
| 7 | 29.09 | `solo_29957_pm-m2d13-v1_20260922T142311Z` | `correct` | `2f753930-a133-4e7f-8a5f-87a33a3c3059` |
| 8 | 29.09 | `solo_36700_pm-m1d2-v1_20260922T124938Z` | `correct` | `2367cde5-4b8b-49a0-abff-1b17cafa7e81` |
| 9 | 30.09 | `solo_31136_pm-m2d13-v1_20260925T104945Z` | `correct` | `0fdd9545-0280-4515-bdf1-3b74323a8ddd` |
| 10 | 30.09 | `solo_31293_vscode-start-01-v1_20260923T050927Z` | `correct` | `2a5e1c06-0976-4303-bbd6-95cbaedae34a` |
| 11 | 30.09 | `solo_31826_internet-01-v18_20260923T131526Z` | `correct` | `19b65180-241f-47ec-8499-4607ad208f89` |
| 12 | 30.09 | `solo_35887_pm-m2d2-v1_20260923T114932Z` | `answer` (dars versiyasi) | `a900bc18-baa7-4b06-b751-2b4f97c54a29` |
| 13 | 30.09 | `solo_36342_pm-m1d2-v1_20260923T130935Z` | `correct` | `6769bc2d-0111-4988-b950-3dcfa9771c78` |
| 14 | 01.10 | `solo_29058_pm-m1d2-v1_20260924T142222Z` | `correct` | `98081abc-b44e-4338-aa03-81b9672eab01` |
| 15 | 01.10 | `solo_29916_pm-m2d13-v1_20260924T121417Z` | `correct` | `cc34b69e-50fd-42b2-8f40-14cccd03775d` |
| 16 | 01.10 | `solo_31981_pm-m2d13-v1_20260924T121243Z` | `correct` | `121598b8-724c-4f05-a9d3-6c2abab2ffaf` |
| 17 | 01.10 | `solo_33114_pean-stack-01-v18_20260924T125527Z` | `correct` | `2d0b3f71-896e-4b1f-a625-5cac2fe03785` |
| 18 | 01.10 | `solo_34968_pm-m2d13-v1_20260924T121026Z` | `correct` | `32864622-0d7b-4dff-8e5b-154b8aff2181` |
| 19 | 02.10 | `solo_29669_pm-m2d13-v1_20260925T105755Z` | `correct` | `e6fd7430-5e90-4684-b95b-cf75b6c51575` |
| 20 | 02.10 | `solo_35840_pm-m1d2-v1_20260925T130841Z` | `correct` | `ef780c73-ccfa-4f98-92ed-0428a4a10fcf` |
| 21 | 05.10 | `solo_36516_html-02-v16_20260928T132343Z` | `correct` | `6eb21314-df19-4ef3-85ad-87753a8bac78` |
| 22 | 06.10 | `solo_29999_practice-03-decompose-v18_20260929T142757Z` | `correct` | `04cf5a26-19ad-498a-b4e4-1d423ed06f83` |
| 23 | 06.10 | `solo_31955_react-intro-01-v18_20260929T130029Z` | `correct` | `097dd0ab-1cf7-410e-899d-5ef93cdbdeca` |
| 24 | 07.10 | `solo_29150_data-intro-04-01-v18_20260930T134628Z` | `correct` | `2c8d3b75-1f91-489f-ba65-e6c62cf3bfe0` |
| 25 | 07.10 | `solo_30289_pm-m4d2-v1_20260930T140510Z` | `correct` | `8f7e577c-a731-480b-a68b-a23e861abf37` |
| 26 | 07.10 | `solo_30295_pm-m4d2-v1_20260930T142519Z` | `correct` | `4677afbe-3cc7-4bd7-8cd4-37b517647fe3` |
| 27 | 07.10 | `solo_30306_pm-m4d2-v1_20260930T140456Z` | `correct` | `d51597e2-dfde-48ff-849b-aee71e412f26` |
| 28 | 07.10 | `solo_30548_pm-m4d2-v1_20260930T143335Z` | `correct` | `a6ec1a71-c9dc-4d79-aaba-2cf32c81b1ab` |
| 29 | 07.10 | `solo_30549_pm-m4d2-v1_20260930T144337Z` | `correct` | `0e250271-7d77-4446-af65-2ec7214a9ab1` |
| 30 | 09.10 | `solo_30648_pm-m4d2-v1_20261002T130852Z` | `correct` | `72887a89-3f24-405e-9bac-212b3164ff5f` |
| 31 | 15.10 | `solo_32378_react-build-site-final-p4-v18_20261008T113007Z` | `correct` | `601d1a70-7dcd-4e8e-875d-b007407fea28` |
| 32 | 17.10 | `solo_32323_react-build-site-final-p4-v18_20261010T090701Z` | `correct` | `23c5c5f5-52e5-4b3b-b05a-cf6c39add3ec` |
| 33 | 19.10 | `solo_32038_pm-m4d7-v1_20261019T120610Z` | `correct` | `b7a8e30a-a620-48c7-8326-7fd1e68efeaa` |
| 34 | 02.11 | `solo_31005_cicd-full-pipeline-4c-03-v18_20261102T120926Z` | `correct` | `052f1709-351d-4dcf-bef1-07546a2ddf86` |
| 35 | 07.11 | `solo_29085_pm-m3d14-v1_20261031T061309Z` | `answer` (dars versiyasi) | `be15fa20-6456-4187-b537-a541f5576ebe` |

---

## Ilova B. SQL (prod bazada faqat o'qish; ism va nik chiqarilmaydi)

`:session_id` va `:pin` — 1-so'rov natijasidan.

```sql
-- 1) GW 69 sessiyasini topish (21.10, Toshkent vaqti)
select s.id as session_id, s.pin, s.lesson_id, s.gid, s.teacher_id,
       s.started_at, s.finished_at, s.status, s.end_reason, ls.quiz_done_at
  from lms_sessions s
  join live_sessions ls on ls.pin = s.pin
 where s.gid = 1030
   and s.started_at >= '2026-10-21 00:00+05' and s.started_at < '2026-10-22 00:00+05'
 order by s.started_at;

-- 2) Sessiyadagi LMS o'quvchilar: kirgan vaqti, oxirigacha yetdimi, qaysi ekranda qoldi
select p.subject_id, p.crm_id, p.joined_at,
       a.status, a.finish_reason, a.reached_end, sp.screen, sp.total
  from lms_participants p
  left join attempts a          on a.id = p.attempt_id
  left join student_progress sp on sp.attempt_id = a.id
 where p.session_id = :session_id and p.role = 'student'
 order by p.subject_id;

-- 3) Kirganlarning hammasi, PIN bilan (LMS'siz) kirganlar ham
select lp.id as player_id, lp.joined_at, (p.id is not null) as has_lms_account
  from live_players lp
  left join lms_participants p on p.player_id = lp.id
 where lp.pin = :pin;

-- 4) Javoblar: dars savollari (< 100) va arena (>= 100), har urinish bilan
select aa.player_id, aa.question_id, aa.screen_idx, aa.attempt_no,
       aa.correct, aa.elapsed_ms, aa.answered_at
  from answer_attempts aa
 where aa.pin = :pin
 order by aa.player_id, aa.screen_idx, aa.attempt_no;

-- 5) Yuborilgan xabar tanasi va yetkazish holati (School API javobi bilan)
select event_id, status, students_count, send_attempts, last_http_status,
       last_error, delivered_at, response, payload
  from result_events
 where session_id = :session_id;

-- 6) Oktyabr yig'masi: nechta xabar, qaysi holatda
select mode, status, count(*) as events, sum(students_count) as students
  from result_events
 where created_at >= '2026-10-01 00:00+05' and created_at < '2026-11-01 00:00+05'
 group by mode, status
 order by mode, status;

-- 7) 02.11 dan keyin: detallar ketyaptimi va School API nima deyapti
select last_http_status, status, count(*) as events,
       count(*) filter (where payload->'students'->0 ? 'questions') as with_details
  from result_events
 where created_at >= '2026-11-02 14:47Z'
 group by last_http_status, status
 order by events desc;
```
