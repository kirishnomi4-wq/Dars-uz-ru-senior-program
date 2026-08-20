# TZ — LMS (Coddy Camp) ↔ Dars-platforma: 3 avtomatizatsiya uchun nima kerak

**Versiya:** 1.0 · **Sana:** 2026-08-18 · **Buyurtmachi:** Dars-platforma jamoasi · **Bajaruvchi:** LMS jamoasi

> Bu hujjat School Data API (`API_INTEGRATION.md`; token olindi, `GET /resources` → 200 ✅)
> asosida yozildi. API bizga kerak bo'lgan **o'qish**ni to'liq beradi. Quyida — u bilan
> nima hal bo'ldi, nima hal bo'lmaydi va LMS'dan aynan **ikki narsa** so'raymiz.
> Har talab uchun: **nima uchun kerak → qaysi muammoni yechadi → qanday qilinadi**.

---

## 1. Maqsad — 3 ta avtomatizatsiya

| № | Avtomatizatsiya | Bugungi holat | Bo'lishi kerak |
|---|---|---|---|
| A1 | **Guruh-mos jonli dars** | Mentor umumiy kod bilan kiradi; o'quvchi PIN + qo'lda yozilgan ism bilan kiradi. Boshqa guruh bolasi ham PIN'ni bilsa kiradi. Ismlar har xil («Ali», «ali7»). | Mentor darsni bosganda **o'z guruhi** uchun sessiya ochiladi. O'quvchi darsni bosganda **faqat o'z guruhining** sessiyasiga tushadi, ism yozmaydi — LMS'dagi rasmiy ismi bilan. |
| A2 | **Badge (nishon)lar saqlanadi** | Dars ichida yig'ilgan nishonlar faqat brauzer xotirasida (`localStorage`) — yo'qoladi, hech qayerga bormaydi. | Dars tugaganda har o'quvchining **ID'si + nishonlar ro'yxati** LMS'ga uzatiladi → LMS ularni coin/reytingga aylantiradi. |
| A3 | **CodeStrike analitikasi** | Jonli dars javoblari bizning bazada 24 soat turadi va o'chadi; LMS ko'rmaydi. | Dars tugaganda LMS'ga: **top-1 / top-2 / top-3** kim ekani + har o'quvchi nechta to'g'ri javob topgani. Coin (masalan har to'g'ri javob ×N, top-3 uchun bonus) — **LMS o'zi hisoblaydi**, biz faqat faktlarni beramiz. |

---

## 2. School Data API bilan nima HAL BO'LDI (LMS'dan qo'shimcha ish kerak emas)

Bizga ochilgan resurslar: `student-list`, `student-students`, `subscribe-list`, `group-list`,
`teacher-list`, `gl-sys-users` + `integration-context` endpoint'lari.

Bundan **o'zimiz** olamiz:

- o'quvchi ID → rasmiy ismi, faol obunalari, **har obunaning guruhi** (bir o'quvchi bir nechta guruh — `subscriptions[]` massivi, muammosiz);
- guruh → **mentori** (`teacher`), assistenti, kuratori;
- mentor ID → uning barcha guruhlari (`group-list` bo'yicha).

Demak «shu o'quvchi shu mentorning guruhidami?» degan savolga biz **server tomonda** javob bera olamiz.
Token faqat bizning serverda (Supabase secret), brauzerga tushmaydi (doc §3).

---

## 3. Nima HAL BO'LMAYDI — va nima uchun faqat LMS hal qila oladi

### 3.1. Muammo №1 — «Darsni KIM ochdi?»

Dars o'quvchining brauzerida, LMS ichida ochiladi. Hozir dars komponenti LMS'dan faqat
`{ studentName, lang, onFinished }` oladi. Bunda:

- **ID yo'q** — `studentName` («Ali Valiyev») bilan API'da qidirib bo'lmaydi (bir xil ismlar, yozilish farqi, API'da ism bo'yicha qidiruv yo'q);
- **rol yo'q** — mentor ochdimi, o'quvchimi — bilmaymiz;
- **imzo yo'q** — hatto ID berilsa ham, o'quvchi brauzerda uni o'zgartirib boshqa bola nomidan kirishi mumkin.

API buni hal qila olmaydi: u «ID bering — ma'lumot beraman» deydi, lekin **ID'ni birinchi bo'lib
faqat LMS biladi** (o'quvchi LMS'ga login qilgan). Shuning uchun **A1, A2, A3 ning uchalasi**
ham shu bitta narsaga tiqilib turibdi: darsga kirishda LMS bizga **imzolangan shaxs-token**
berishi kerak.

### 3.2. Muammo №2 — «Natijani QAYERGA yozamiz?»

School Data API **faqat o'qiydi** (`GET`; `POST/PUT` → 405, doc §2 va §16). Badge, top-3,
to'g'ri javoblar LMS'ga tushishi uchun LMS tomonda **qabul qiluvchi endpoint** bo'lishi kerak.
Biz uni chaqiramiz (server→server), LMS coin hisoblab o'quvchiga yozadi.

---

## 4. TALAB A — Shaxs-token (darsga kirishda)

### 4.1. Nima

Dars ochilganda LMS dars-komponentiga **imzolangan JWT (HS256)** beradi. Ikki yo'lning
**ixtiyoriysi** (LMS'ga qulayi):

- **Variant 1 (tavsiya, eng oson):** dars-komponentga yangi prop — `liveToken`:
  ```jsx
  <Lesson studentName="Ali Valiyev" lang="uz" liveToken="<JWT>" onFinished={...} />
  ```
- **Variant 2:** havola hash-qismida — `https://<dars>/<sahifa>#lt=<JWT>` (2026-08-04 TZ'dagi kabi).

Biz ikkalasini ham qabul qilamiz.

### 4.2. Token tarkibi (payload)

| Maydon | Turi | Majburiy | Tavsif | Misol |
|---|---|---|---|---|
| `sub` | string | ✅ | Kim ochdi. O'quvchi uchun **`student_students.id`** (LMS ID) yoki CRM ID — qaysi biri sizga qulay, aytasiz; API ikkalasini ham tushunadi. Mentor uchun `teacher_list.ID` | `"233"` |
| `role` | string | ✅ | `"student"` yoki `"mentor"` | `"student"` |
| `name` | string | ✅ | Rasmiy «Ism Familiya» (nickname emas) — API'dan ham olamiz, bu tezkor ko'rsatish uchun | `"Ali Valiyev"` |
| `gid` | number | ✅ (mentor uchun) | Mentor LMS'da **qaysi guruh** sahifasidan/kartasidan darsni ochdi (`group_list.ID`). Bu — A1'ning yuragi: sessiya aynan shu guruhga bog'lanadi va faqat shu guruh o'quvchilari kiradi. O'quvchi tokenida kerak emas (guruhlarini API'dan o'zimiz olamiz) | `17` |
| `iat` | number | ✅ | Yasalgan vaqt (Unix soniya) | `1755500000` |
| `exp` | number | ✅ | `iat + 12 soat` | `1755543200` |

Qoidalar: algoritm faqat **HS256**; token **har ochilganda yangi**; maxfiy kalit faqat
LMS serverida (env), bizga xavfsiz kanal orqali beriladi (chat/email'da ochiq EMAS);
kalit almashish tartibi — 2026-08-04 TZ §6.

### 4.3. Bu bilan nima hal bo'ladi

```
Mentor LMS'da «Darsni boshlash» → token {sub: teacher_id, role: mentor, gid: 17}
   → bizning server: teacher 8 haqiqatan 17-guruhning mentorimi? (API group-list) ✔
   → 17-guruh uchun sessiya ochiladi (PIN kerak emas — avtomatik)

O'quvchi LMS'da «Darsga kirish» → token {sub: 233, role: student}
   → bizning server: 233 → integration-context → guruhlari [17, 21]
   → 17-guruhda hozir jonli sessiya bor → o'sha yerga kiritiladi, ismi «Ali Valiyev»
   → 21-guruhning sessiyasiga (boshqa mentor) KIRA OLMAYDI ✔
   → boshqa guruh bolasi (guruhlari [30]) → «Sizning guruhingizda hozir jonli dars yo'q» ✔
```

- Ism yozish yo'q, soxta ism yo'q, PIN sizib chiqishi endi muammo emas.
- Bir o'quvchi ko'p guruhda bo'lsa — qaysi guruhida hozir sessiya ochiq bo'lsa, o'shanga; ikkalasida ham bo'lsa — tanlov chiqadi.
- Barcha natijalar (A2, A3) endi **aniq ID**ga bog'lanadi.

### 4.4. Kod-namuna (PHP, kutubxonasiz)

2026-08-04 TZ §5 dagi `makeLiveToken()` aynan shu — faqat payload'ga `role` (va mentor uchun
`gid`) qo'shiladi:

```php
// o'quvchi uchun:
$payload = ['sub' => (string)$student['lms_id'], 'role' => 'student',
            'name' => $student['fullName'], 'iat' => $now, 'exp' => $now + 43200];
// mentor uchun:
$payload = ['sub' => (string)$teacher['id'], 'role' => 'mentor', 'gid' => $group['id'],
            'name' => $teacher['name'], 'iat' => $now, 'exp' => $now + 43200];
```

---

## 5. TALAB B — Natija qabul qiluvchi endpoint (LMS tomonda)

### 5.1. Nima

LMS bitta `POST` endpoint ochadi, biz **server→server** (brauzerdan EMAS) chaqiramiz.
Manzil va autentifikatsiya sizniki — masalan:

```
POST https://<lms-domen>/api/external/lesson-results
Authorization: Bearer <siz beradigan maxfiy kalit>
Content-Type: application/json
```

### 5.2. Qachon yuboriladi

- **Jonli dars tugaganda** (mentor «Yakunlash» bosadi) — bitta so'rovda **butun guruh** (top-3 shu yerda ma'noli).
- **Yakka o'tishda** (o'quvchi jonli sessiyasiz o'zi o'tsa) — bitta o'quvchi, `rank: null`, `students` massivida 1 ta element.

### 5.3. Tana (payload)

```json
{
  "event_id": "sess_483920_2026-08-18T10:42:00Z",
  "lesson_id": "pm-audience",
  "lesson_title": "Auditoriya — kim uchun quramiz",
  "mode": "live",
  "group_id": 17,
  "teacher_id": 8,
  "started_at": "2026-08-18T09:00:12Z",
  "finished_at": "2026-08-18T10:42:00Z",
  "total_questions": 12,
  "students": [
    {
      "student_id": 233,
      "id_type": "lms",
      "correct_answers": 11,
      "answered": 12,
      "rank": 1,
      "badges": ["first_try", "speedster", "graduate"],
      "badges_count": 3,
      "duration_sec": 5400,
      "completed": true
    },
    { "student_id": 240, "id_type": "lms", "correct_answers": 10, "answered": 12, "rank": 2, "badges": ["graduate"], "badges_count": 1, "duration_sec": 5380, "completed": true },
    { "student_id": 251, "id_type": "lms", "correct_answers": 10, "answered": 11, "rank": 3, "badges": [], "badges_count": 0, "duration_sec": 5100, "completed": true },
    { "student_id": 262, "id_type": "lms", "correct_answers": 6,  "answered": 12, "rank": null, "badges": ["graduate"], "badges_count": 1, "duration_sec": 5400, "completed": true }
  ]
}
```

| Maydon | Ma'no |
|---|---|
| `event_id` | Noyob; **qayta yuborilsa dublikat yaratmang** (idempotentlik — biz tarmoq xatosida qayta yuborishimiz mumkin) |
| `mode` | `"live"` (guruh bilan) yoki `"solo"` |
| `students[].student_id` + `id_type` | `id_type: "lms"` → `student_students.id`; `"crm"` → `student_list.ID`. Tokenda qaysi ID bersangiz — o'shani qaytaramiz |
| `correct_answers` / `answered` / `total_questions` | To'g'ri / javob berilgan / darsdagi jami savol |
| `rank` | `1`, `2`, `3` — top-3; qolganlarda `null`. Teng ballda tezlik hal qiladi (bizda `elapsed_ms` bor). Coin miqdorini **LMS o'zi belgilaydi** (masalan 1→100, 2→70, 3→50 + har to'g'ri javob ×N) |
| `badges` | Nishon ID'lari (barqaror inglizcha kalitlar; to'liq lug'atni alohida beramiz) |
| `completed` | O'quvchi oxirgi ekranga yetdimi |

Kutilgan javob: `200/201` + istalgan JSON (masalan `{ "coins_awarded": {...} }` — bo'lsa
o'quvchiga «+120 coin» ko'rsatamiz; bo'lmasa shunchaki «Natija saqlandi»).
Xato bo'lsa `4xx/5xx` — biz 5xx'da 3 marta backoff bilan qayta urinamiz, 4xx'da to'xtaymiz va jurnalga yozamiz.

### 5.4. Bu bilan nima hal bo'ladi

- A2: badge'lar o'quvchi ID'si bilan LMS'da — coin/do'kon/reyting sizning qo'lingizda.
- A3: top-3 va to'g'ri javoblar — **dars tugashi bilan avtomatik**, mentor hech narsa qilmaydi.
- Ma'lumot bizda ham (`lesson_results` jadvali, doimiy) — kerak bo'lsa keyin qayta yuborish/solishtirish mumkin.

### 5.5. Muqobil (agar endpoint ochish qiyin bo'lsa)

Biz **o'zimizda** read-endpoint ochamiz (`GET /results?since=...`, Bearer bilan), LMS
xohlagan vaqtida tortib oladi (pull). Ishlaydi, lekin real-vaqt emas va LMS tomonda cron
kerak — shuning uchun 5.1 ni tavsiya qilamiz.

---

## 6. Umumiy oqim (ikkala talab bilan)

```
                LMS                                   Dars-platforma (biz)
   ─────────────────────────────         ──────────────────────────────────────────
   Mentor «Darsni boshlash»  ──token──▶  tekshir (imzo) → API: mentormi? → sessiya[guruh 17]
   O'quvchi «Darsga kirish»  ──token──▶  tekshir → API: guruhlari? → 17 bor → kirdi (ismi bilan)
                                          ... dars: javoblar, badge'lar serverda yig'iladi ...
   POST /lesson-results      ◀─natija──  mentor «Yakunlash» → top-3 hisob → yuborish
   coin hisoblash, o'quvchiga yozish
```

Ikkala talab ham **bir-biriga bog'liq emas**: A ni oldin qilsangiz — A1 (guruh-mos kirish)
darhol ishlaydi; B qo'shilsa — A2/A3 ham.

---

## 7. Sinov uchun bizga kerak

- 2–3 **test o'quvchi** (LMS ID + CRM ID, guruhi) va 1 **test mentor** (teacher_list ID) — real ma'lumotsiz.
- Test kalit bilan yasalgan **1 dona namuna-token** (o'quvchi) + 1 dona (mentor).
- `POST /lesson-results` uchun **sinov-manzil** (staging) va kalit.
- Savol: `/resources` javobida `filterable_columns` bor (masalan `group-list` da `TEACHER_ID`), lekin hujjatda filtr yo'q deyilgan — `?TEACHER_ID=8` kabi filtr ishlaydimi? Ishlasa mentorning guruhlarini bitta so'rovda olamiz (aks holda butun jadvalni varaqlaymiz — ishlaydi, lekin sekinroq).
- Savol: mentorlar LMS'da o'z akkaunti bilan kiradimi? Ularning LMS-ID'si `teacher_list.ID` bilan qanday bog'lanadi?

---

## 8. Qabul-mezonlari

**Talab A (token) tayyor, qachonki:**
- [ ] o'quvchi darsni ochganda `liveToken` (yoki `#lt=`) keladi, `role: "student"`, `sub` = kelishilgan ID;
- [ ] mentor ochganda `role: "mentor"`, `sub` = teacher ID, `gid` = darsni ochgan guruh ID'si (majburiy);
- [ ] HS256, `exp = iat + 12h`, kalit faqat serverda; 2026-08-04 TZ §7 sinov-vektori o'tadi.

**Talab B (natija) tayyor, qachonki:**
- [ ] `POST` endpoint + kalit berildi; §5.3 tanani qabul qiladi;
- [ ] bir xil `event_id` ikkinchi marta kelsa dublikat coin bermaydi;
- [ ] 2–3 test o'quvchi bilan birgalikda jonli sinov o'tdi: kirish → dars → yakun → LMS'da natija ko'rindi.

---

## 9. Savol-javob

**Nega faqat `studentName` yetmaydi?** Ism — identifikator emas: ikki «Ali Valiyev», yozilish farqi, API'da ism bo'yicha qidiruv yo'q. Faqat ID ishonchli.

**Nega imzolangan token, oddiy `studentId` prop emas?** Prop brauzerda o'zgartiriladi — o'quvchi boshqa bola nomidan kirib uning coinini «yig'ishi» mumkin. Imzo bilan bu imkonsiz. Yasash — 20–30 qator server-kod (namuna bor).

**Coin formulasini kim belgilaydi?** LMS. Biz faktlarni beramiz: to'g'ri javoblar soni, top-1/2/3, badge'lar. Formula o'zgarsa bizda hech narsa o'zgarmaydi.

**API tokenini frontendga qo'yib qo'ysak bo'lmaydimi?** Yo'q — hujjat §3 taqiqlaydi va u bilan butun maktab bazasi o'qiladi. Token faqat bizning serverda.

---

## 10. Keyingi qadam

1. LMS jamoasi savol/e'tirozlarini yozadi (ayniqsa §7) → javob beramiz.
2. Kelishuvdan keyin biz backend'ni (guruh-tekshiruv, natija-jadval, top-3, yuborish) yozamiz — LMS'dan A va B kutamiz.
3. Birga sinov → ishga tushirish.
