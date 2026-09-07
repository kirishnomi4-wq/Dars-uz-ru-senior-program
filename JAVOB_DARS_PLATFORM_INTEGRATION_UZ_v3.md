# JAVOB v3 — «Coddy Camp LMS ↔ Dars-platforma»: maqsad, holat, sizdan kerak bo'lgan narsalar

**Kimdan:** Dars-platforma jamoasi · **Kimga:** LMS (Coddy Camp) / School API jamoasi
**Sana:** 2026-08-27 · **Bu hujjat v2 o'rnini to'liq bosadi** — faqat shuni o'qing.
**Nimaga javoban:** `DARS_PLATFORM_INTEGRATION.md` v1.1 · `DARS_PLATFORM_PARTNER_IMPLEMENTATION_RU.md` v1.0 ·
`dars-platform-openapi.yaml` 1.1.0 · uchta kalit (natija-token, kontekst-token, JWT-secret)

---

## 0. Bir sahifada

**Maqsad — bitta jumla.** Mentor **go.coddycamp.uz** da o'z guruhining sahifasida dars tugmasini
(«loop · UZ» kabi) bosadi → **hech qanday kod termasdan** jonli dars ochiladi va u **aynan shu
guruhga** bog'lanadi. O'sha guruhning o'quvchisi **lms.coddycamp.uz** da darsni bosadi → biz
«mentor shu guruh uchun dars boshlaganmi?» deb tekshiramiz → ha bo'lsa **PIN'siz, ism yozmasdan,
o'z rasmiy ismi bilan** avtomatik kiradi; boshqa guruh o'quvchisi **kira olmaydi**. Dars tugagach
natija (nishonlar, top-3, to'g'ri javoblar) School API'ga o'zi tushadi.

**Holat.** Kelishuv (kontrakt, kalitlar, hujjatlar) — **to'liq yopildi**, rahmat.
Endi qurilish bosqichi. Ikki ish bor — biri sizda, biri bizda:

| To'siq | Kimda | Nima |
|---|---|---|
| **Mentor-token yo'q** | **Siz** | Siz token-chiqarishni faqat **o'quvchi** uchun (lms.coddycamp.uz) qilgansiz. Mentor **go.coddycamp.uz** da — u yerda dars tugmasi bosilganda `role: mentor, gid` bilan token chiqmaydi. Bu bo'lmasa «qaysi guruh?» ni hech kim bilmaydi → PIN qoladi |
| **Backend** | Biz | Tokenni tekshiradigan, guruhni solishtiradigan, natijani yuboradigan o'z backend'imizni **2026-09-02 dan** yozamiz (5-bo'lim) |

**Sizdan kerak (to'liq ro'yxat 3-bo'limda):** K-1 mentor-token (go.coddycamp.uz) · K-2 test-akkauntlar ·
K-3 `iss/aud/kid` · K-4 `429` limiti · K-5 assistent/vaqtincha mentor · K-6 coin-mas'ul ·
K-7 real token skrinshoti · K-8 rotatsiya · K-9 domenlar · K-10 o'quvchi-tokeniga guruhlar (taklif).
**Bitta javobda, band-ma-band.**

---

## 1. Maqsad-oqim — qadam-baqadam, kim qiladi, hozir qay holatda

Ikki sayt, ikki foydalanuvchi, bitta sessiya:

```
MENTOR — go.coddycamp.uz                          O'QUVCHI — lms.coddycamp.uz
Guruh sahifasi (group_list/detail/857)            Dars sahifasi
«loop · UZ» tugmasini bosadi                      darsni bosadi
        │                                                   │
   [1] go backend: mentor-token                        [5] lms backend: o'quvchi-token
       {role: mentor, sub: teacher_list.ID,                {role: student, sub: lms_id, name}
        gid: 857}                                           │
        │                                                   │
   [2] JSX ochiladi, liveToken oladi                   [2] JSX ochiladi, liveToken oladi
        │                                                   │
   [3] Bizning server: imzo tekshiradi                 [3] Bizning server: imzo tekshiradi
        │                                                   │
   [4] Sessiya KODSIZ ochiladi, gid=857 ga bog'lanadi  [6] O'quvchining guruhlari: [857, 902]
        │                                                   │
        │                                              [7] 857 da mentor boshlagan sessiya bormi?
        │                                                   ├─ ha  → PIN'siz, o'z ismi bilan kiradi
        │                                                   └─ yo'q → «Guruhingizda hozir jonli dars yo'q»
        └──────────────── bitta jonli dars ────────────────┘
                                │
                     [8] Natija → School API (nishon, top-3, to'g'ri javoblar)
```

| № | Qadam | Kim | Holat |
|---|---|---|---|
| 1 | Mentor-token (`role: mentor`, `gid`) — go.coddycamp.uz tugmasida | **Siz** | 🔴 **Sizdan kutamiz** — bosh shart (K-1) |
| 2 | JSX tokenni oladi | Biz | ✅ **Isbotlandi** (pilot, 4-bo'lim) |
| 3 | Imzo/`iss`/`aud`/`kid`/`exp`/`jti` tekshiruvi | Biz — backend | 🔧 **Biz yozamiz** — 2026-09-02 dan |
| 4 | Sessiya kodsiz, `gid` ga bog'lab ochiladi | Biz — backend | 🔧 **Biz yozamiz** — 2026-09-02 dan |
| 5 | O'quvchi-token (`role: student`, `sub`, `name`) — lms.coddycamp.uz | **Siz** | ✅ **Tayyor** (sizning hujjat §6) |
| 6 | O'quvchining guruhlari (`integration-context`) | Biz — backend | 🔧 **Biz yozamiz**; **K-10 bo'lsa kerak emas** |
| 7 | «Mentor boshlagan guruhmi?» → avtomatik kirish / rad | Biz — backend | 🔧 **Biz yozamiz** — 2026-09-02 dan |
| 8 | Natija → `POST /lesson-results` | Biz — backend | 🔧 **Biz yozamiz** — kontrakt va token tayyor |

Mentor bir saytda, o'quvchi boshqa saytda — bu muammo emas: sessiya **bizning bazada** yashaydi,
ikkala sayt bitta JSX'ni ochadi, farq faqat tokendagi `role`.

**Nega hozir «mentor kodi» hali so'raladi?** Brauzer tokenni tekshira olmaydi — maxfiy kalit
brauzerga qo'yilsa, istalgan o'quvchi o'ziga «`role: mentor, gid: 857`» yasab oladi. Tekshiruv faqat
serverda — buni 2026-09-02 dan yozamiz. Ungacha eski kod-darvoza turadi. Bu to'g'ri va vaqtinchalik.

---

## 2. Sizdan hozirgacha nima keldi — tasdiq va rahmat

| Nima | Holat |
|---|---|
| Kontrakt: `live-token`, `lesson-results`, `GET /{event_id}`, OpenAPI 1.1.0 | ✅ To'liq, aniq |
| Natija-token (`lesson_results.submit/read`) | ✅ Keldi, format to'g'ri |
| Kontekst-token (`integration-context`, tor ruxsat) | ✅ Keldi, format to'g'ri — to'g'ri qaror |
| JWT-secret (`base64:`, 48 bayt) | ✅ Keldi, format to'g'ri |
| O'quvchi-token lms.coddycamp.uz da | ✅ Tayyor (sizning §6 «Текущий этап») |
| Bizning savollarga javoblar: `jti`/F5 · qisman qabul (`rejected_students`) · `sub` satr · `kid` header · 60 s · `solo` maydonlari tashlanadi · `GET` | ✅ Hammasi yopildi |
| Yangi talablar: `typ=JWT` · `kid` allowlist · `exp−iat ≤ 43200` · `base64:` dekod · `lesson_id` server-katalogdan · DB-`UNIQUE` · navbat · `409` da yangi `event_id` yo'q | ✅ Hammasini qabul qilamiz |

**Kalitlar haqida bitta ochiq gap.** Ular bizga oddiy xabar orqali keldi — bu sizning o'z §1/§10
qoidangizga zid. Sinov uchun shu kalitlar bilan ishlaymiz; prod'ga chiqishdan oldin **rotatsiya**
so'raymiz (K-8). Bizda saqlanishi: faqat server-muhitda; repo, brauzer, jurnalga tushmaydi.

---

## 3. 🔴 Sizdan kerak — to'liq ro'yxat (K-1…K-10)

Har band: **nima → nima uchun → qabul-mezoni.** Jim qoldirilgan band = bizda ish to'xtab turadi.
Qaysi biri bo'lmasa — «yo'q, sababi…» deb yozing.

### K-1. Mentor-token — go.coddycamp.uz dagi dars tugmasida (BOSH TO'SIQ)

**Qayerda.** go.coddycamp.uz → Guruhlar → guruh sahifasi (masalan `group_list/detail/857`,
«GW62 - Senior») → dars tugmalari qatori: «JS: Sikllar», **«loop · RU»**, **«loop · UZ»**,
«Kompilyator». Mentor shu tugmani bosganda JSX ochiladi — **shu joyga** token qo'shiladi.

**Nima.** Tugma bosilganda go backend (foydalanuvchining go-sessiyasini tekshirib) chaqiradi:
```json
POST /api/v1/integrations/dars-platform/live-token
{ "role": "mentor", "subject_id": <teacher_list.ID>, "group_id": 857 }
```
`group_id` — sahifadagi guruh (`group_list.ID`, URL'dagi `857`). Olingan `live_token` JSX'ga
**o'quvchidagi bilan bir xil prop** orqali uzatiladi: `<Lesson liveToken={liveToken} lang="uz" />`
(«loop · RU» uchun `lang="ru"`). JSX `role` ni tokendan o'zi o'qiydi — go'dan alohida «bu mentor»
belgisi kerak emas. Har bosishda yangi token. School API tomonida `group_list.TEACHER_ID = subject_id`
va `STATUS = active` tekshiruvi sizda **tayyor** (§3.2) — faqat go tomonida chaqiruv yo'q.

**Nima uchun.** `gid` — butun oqimning yuragi. U bo'lmasa sessiya guruhga bog'lanmaydi, o'quvchi
«o'z guruhining sessiyasi»ni topa olmaydi, PIN qoladi. Siz o'quvchi uchun qilgan ishning **aynan
o'zi** — faqat boshqa saytda va `role: mentor`, `group_id` bilan.

**Qabul-mezoni.**
- [ ] go.coddycamp.uz da guruh sahifasidan dars tugmasi bosilganda JSX'ga `liveToken` keladi:
      `role: "mentor"`, `sub` = `teacher_list.ID`, `gid` = shu sahifaning guruhi.
- [ ] Boshqa mentorning guruhi uchun so'ralsa `403` (sizda tayyor).
- [ ] «loop · UZ» va «loop · RU» ikkalasida ham token keladi.
- [ ] O'quvchi (lms) va mentor (go) **bir xil** JSX-faylni ochadi; farq faqat tokendagi `role`.

**Savollar — yozishdan oldin javob kerak.** Rasmda guruh sahifasiga **Academic Department xodimi**
kirgan, guruhda esa «Vaqtincha mentor: …» maydoni bor. Shundan:

| № | Savol | Nima uchun |
|---|---|---|
| K-1a | Dars tugmasini **kim** bosa oladi — faqat guruhning o'z mentori (`group_list.TEACHER_ID`)mi, yoki admin/akademik xodim ham? Xodim bossa `subject_id` kim bo'ladi — guruh mentorimi? | School API `TEACHER_ID = subject_id` ni tekshiradi: xodim o'z ID'si bilan so'rasa `403` bo'ladi. Qoida kerak: «tugmani bosgan kim bo'lsa ham, `subject_id` = guruhning mentori, go buni o'zi tekshiradi» — yoki «faqat mentor bosadi» |
| K-1b | **Vaqtincha mentor** dars o'tkazsa — u `TEACHER_ID` emas, School API `403` beradi. Vaqtincha mentorni ham qabul qilish kerakmi? Kerak bo'lsa School API tekshiruviga qanday kiradi? | Aks holda o'rinbosar mentor jonli dars ocha olmaydi |
| K-1c | go-sessiyada mentorning `teacher_list.ID` bormi (yoki boshqa ID → `teacher_list` ga qanday bog'lanadi)? | `subject_id` manbasi |
| K-1d | **Kim yozadi, qachon tayyor?** | Sinov sanasi shunga bog'liq |

### K-2. Test-akkauntlar + test-guruh

Hammasi **sintetik**. O'quvchi uchun: **lms.coddycamp.uz login/parol** + LMS ID
(`student_students.id`) + CRM ID (`student_list.ID`) + guruh. Mentor uchun: **go.coddycamp.uz
login/parol** + `teacher_list.ID` + guruh. Usiz «boshqa guruh bolasi kira olmaydi» va
«muzlatilgan → 403» ni sinab bo'lmaydi.

| Kod | Kim | Holat | Nimani sinaydi |
|---|---|---|---|
| **O-1** | O'quvchi, guruh **G-1** | faol | Oddiy kirish, ism avtomatik, natija |
| **O-2** | O'quvchi, guruh **G-1** | faol | Guruh-natija (top-3) |
| **O-3** | O'quvchi, guruh **G-1** | **muzlatilgan** | `403`, tushunarli xato, oq ekran emas |
| **O-4** | O'quvchi, guruh **G-2** (boshqa mentor) | faol | **Asosiy sinov:** G-1 sessiyasiga kira olmaydi |
| **O-5** *(ixtiyoriy)* | O'quvchi, **G-1 + G-2** | faol | Ikki guruhda sessiya bo'lsa — tanlov |
| **M-1** | Mentor, guruh **G-1** (`TEACHER_ID`) | faol | Kodsiz sessiya, `gid` = G-1 |
| **M-2** *(ixtiyoriy)* | Mentor, guruh **G-2** | faol | M-1 G-2 uchun so'rasa `403` |

Qo'shimcha: G-1 va G-2 guruh sahifalarida bizning JSX-dars tugmasi bo'lsin; O-1…O-5 lms'da shu
darsni ko'rsin.

### K-3. `iss` / `aud` / `kid` — aniq qiymatlar

Hujjatda «alohida beriladi» — kelmadi. Biz hozircha default oldik, **tasdiqlang yoki to'g'rilang:**
`iss = coddycamp-lms` · `aud = dars-platform` · `kid = v1`. Bitta belgi farq qilsa har token rad.
Mentor-token (go) va o'quvchi-token (lms) **bir xil** `iss`/secret bilan chiqadimi — tasdiqlang.

### K-4. `429` limiti

Natija-klient va kontekst-klient uchun **alohida raqam** (so'rov/daqiqa). Kontekst-klient muhim:
har o'quvchi kirishida 1 so'rov — 30 kishilik guruh bir daqiqada 30 so'rov.

### K-5. Assistent va vaqtincha mentor

Assistent (`ASSISTANT_ID`) yoki vaqtincha mentor jonli dars o'tkazadimi? Ha bo'lsa — `live-token`
ularni ham mentor sifatida qabul qilsinmi (K-1b bilan bog'liq)? Mahsulot-qarori.

### K-6. Coin-formula mas'uli

`pending_policy` dan chiqish uchun **bitta ism**. Taklifimiz o'zgarmadi: har to'g'ri javob 10 ·
top-1/2/3 = 100/70/50 · nishon 20 · yakunlagan 30. Formula qanday bo'lsa ham bizda hech narsa
o'zgarmaydi; faqat `coins_awarded` qaytarsangiz — o'quvchiga «+120 coin» ko'rsatamiz.

### K-7. Real token — pilot-fayl bilan (4-bo'lim)

Biz `InternetLesson.liveToken.jsx` pilot-faylni yubordik. Uni lms.coddycamp.uz da test-o'quvchi
bilan oching va **pastki-chap belgining skrinshotini** yuboring — biz real tokenning
`kid`/`typ`/claim'larini ko'ramiz. K-1 tayyor bo'lgach — go.coddycamp.uz da mentor bilan ham.

### K-8. Prod oldidan rotatsiya

Yangi secret + `kid: v2`, kelishilgan **xavfsiz kanal** orqali (2-bo'lim). Biz bir vaqtda ikki
`kid` qabul qilamiz, eskisi o'tgach o'chiramiz.

### K-9. Domenlar

JSX **`lms.coddycamp.uz`** (o'quvchi) va **`go.coddycamp.uz`** (mentor) dan ochiladi — to'g'rimi?
Boshqa domen (staging, mobil) bormi? Bizning server CORS'ni faqat shularga ochadi.

### K-10. TAKLIF — o'quvchi-tokeniga guruhlar (`gids`)

Hozir o'quvchi-tokenida guruh yo'q; biz har kirishda `integration-context` chaqirishimiz kerak
(6-qadam). School API token berayotganda obunalarni **baribir tekshiradi** (§3.1). Agar shu paytda
tokenga faol guruhlarni qo'shsa:
```json
{ "sub": "34174", "role": "student", "name": "…", "crm_id": 17226, "gids": [857, 902], … }
```
— 6-qadam umuman kerak bo'lmay qoladi, kirish tezlashadi, kontekst-klientga yuk tushmaydi, va
PIN'siz kirishni biz **serverni kutmasdan** ishga tushira olamiz (imzo-tekshiruvni o'z bazamiz
ichida qilamiz). Bu **taklif** — rad etsangiz, 6-qadam bilan ketamiz. Javob: ha/yo'q + sabab.

---

## 4. Pilot — biz yuborgan fayl nima qiladi

`InternetLesson.liveToken.jsx` — «Internet qanday ishlaydi» darsining nusxasi, unga `liveToken`
prop qo'shilgan. Fayl **faqat ko'rsatadi**: pastki-chap burchakda kichik belgi — token kelganmi,
`role/sub/name/gid/crm_id`, header `alg/typ/kid`, `iss/aud/exp/jti`.

Ataylab **qilmaydi:** imzo tekshirmaydi, claim'larga ishonmaydi, ism/rolni darsga qo'llamaydi
(PIN-oqim o'zgarishsiz), tokenni hech qayerga yubormaydi, `console`ga yozmaydi.

Biz sinab ko'rdik (haqiqiy brauzer): tokensiz — oddiy dars · o'quvchi-token — belgi yashil ·
mentor-token — `gid` ko'rinadi · buzuq token — qizil belgi, oq ekran yo'q · token keyin kelsa —
belgi yangilanadi (sizning §4 talabi) · konsolda xato yo'q · token DOM'ga sizmagan.

**Sizdan:** §13-1 (eski sahifa ishlaydi) va §13-2 (token JSX'ga yetdi) ni shu fayl bilan tekshiring
→ K-7 skrinshoti. Shu faylni go.coddycamp.uz dagi tugmaga ham qo'yib ko'rsangiz — K-1 sinovining
yarmi tayyor.

---

## 5. Biz nima qilamiz

**Backend (2026-09-02 dan):** o'z serverimiz (Node + PostgreSQL). Unda:
- **JWT-tekshiruv** — sizning §5.1 ro'yxati to'liq: 3 segment · `alg=HS256` qat'iy · `typ=JWT` ·
  `kid` allowlist (ikki `kid` bir vaqtda) · HMAC · `iss`/`aud` · `nbf`/`iat`/`exp` 60 s ·
  `exp−iat ≤ 43200` · `jti` · `role ∈ {student, mentor}` · `sub` musbat son-satr · `base64:` dekod.
- **`jti` ↔ sessiya** — `UNIQUE(jwt_jti)`, `UNIQUE(session_id, role, subject_id)`; F5 — o'sha
  sessiya; boshqa sessiya — rad. JWT saqlanmaydi (faqat `jti`, ID'lar, `exp`).
- **Mentor-sessiya** — `gid`, `teacher_id`, `lesson_id`, `jti` bilan; kod yo'q. Bir guruh, bir dars
  uchun bir vaqtda bitta faol sessiya.
- **O'quvchi-kirish** — guruhlari (`gids` yoki `integration-context`: `status ∈ {active, demo}`,
  `active=true`, guruh faol) → shu guruhlarda `lesson_id` bo'yicha faol sessiya → bitta bo'lsa
  avtomatik, bir nechta bo'lsa tanlov, yo'q bo'lsa «Guruhingizda hozir jonli dars yo'q».
  `lesson_id` faqat server-katalogdan.
- **Natija-navbat** — avval o'z DB'ga `pending` → yuborish → `delivered`/`retry_wait`/
  `manual_review`; qayta urinish faqat tarmoq/`429`/`500`/`503`, 1-3-10 s; `401/403/409/422` —
  to'xtash + jurnal (HTTP-kod, `event_id`, `X-Request-ID`); `solo` da maydonlar tashlanadi;
  `badges_count = badges.length`; kalitlar `lower_snake_case`.
- **CORS** — faqat `lms.coddycamp.uz` va `go.coddycamp.uz` (K-9).
- **Jurnal** — `sapi_`, JWT, shaxsiy ma'lumot yozilmaydi. **PIN — zaxira** (`503` bo'lsa yoki K-1 hali kelmagan bo'lsa).

**Komponent:** `liveToken` prop (`null` → keyin keladi), eski dars o'zgarishsiz ishlaydi,
brauzerda imzo/secret yo'q.

**Ikki bosqich:**
| Bosqich | Nima ishlaydi | Nimaga bog'liq |
|---|---|---|
| **1** | O'quvchi ism yozmaydi (JWT `name`), ID bog'lanadi, natija School API'ga tushadi — **PIN hali turadi** | Bizning backend (2026-09-02 dan) + K-2, K-3 |
| **2** | Mentor go'da tugmani bosadi, kod yo'q, sessiya `gid` ga; o'quvchi lms'da bosadi, PIN yo'q; boshqa guruh kira olmaydi — **maqsad to'liq** | **K-1** (+ K-10 bo'lsa tezroq) |

---

## 6. Birgalikdagi sinov — qabul-mezonlari

Sizning `PARTNER_IMPLEMENTATION` §13 dagi **17 band to'liq qabul.** Ustiga:
- [ ] **18.** O'quvchi darsni **lms.coddycamp.uz ichidan** ochadi, tashqi havoladan emas.
- [ ] **19.** O-3 (muzlatilgan) — lms'da tugmani bosganda tushunarli xabar, oq ekran emas.
- [ ] **20.** O-5 (ikki guruh) — ikkalasida sessiya bo'lsa tanlov; bittasida bo'lsa avtomatik.
- [ ] **21.** Mentor go'da guruhsiz joydan ochsa (bo'lsa) — PIN-zaxira ishlaydi, xato yo'q.
- [ ] **22.** `GET /lesson-results/{event_id}` — `rejected_students` ham ko'rinadi.
- [ ] **23.** Rotatsiya: `kid v1` + `v2` bir vaqtda, keyin `v1` o'chadi — eski token rad.
- [ ] **24.** **Maqsad-sinovi:** M-1 go.coddycamp.uz da G-1 sahifasidan «loop · UZ» ni bosadi →
      kod so'ralmaydi, sessiya ochiladi → O-1 lms.coddycamp.uz da darsni bosadi → PIN va ism
      so'ralmaydi, o'z ismi bilan ichkarida → O-4 bosadi → kira olmaydi.
- [ ] **25.** M-1 «loop · RU» ni bossa — o'sha guruh, `lang=ru`, sessiya ikkilanmaydi.

---

## 7. Tartib — kim, nima, qachon

| № | Kim | Nima | Qachon |
|---|---|---|---|
| 1 | **Siz** | K-1d sana · K-2 · K-3 · K-9 — **bitta javobda** | Iloji boricha tez — bizning boshlanish nuqtamiz |
| 2 | **Siz** | K-1a/b/c, K-4, K-5, K-6, K-7, K-10 javoblari | Shu javob bilan |
| 3 | **Biz** | Backend + 5-bo'lim (1-bosqich) | 2026-09-02 dan |
| 4 | **Birga** | 1-bosqich sinovi (§13 1–5, 8, 10–17 + 18–20, 22) | K-2/K-3 dan +7 kun |
| 5 | **Siz** | K-1 mentor-token go.coddycamp.uz da | K-1d sanasi |
| 6 | **Birga** | 2-bosqich sinovi (§13 6, 7, 9 + 21, **24**, 25) — **maqsad to'liq** | K-1 dan +3 kun |
| 7 | **Siz** | K-8 rotatsiya · K-6 → formula → `coins_awarded` | Prod oldidan |

---

## 8. Oxirida

Kelishuv bosqichi tugadi — bu sizning puxta hujjatlaringiz va kalitlaringiz bilan bo'ldi, rahmat.
Siz o'quvchi uchun qilgan ish to'g'ri va tayyor; endi **aynan o'sha ishni mentor uchun,
go.coddycamp.uz dagi dars tugmasida** qilish kerak — bu bizning maqsadimizning yarmi. Ikkinchi
yarmi (server) bizda, 2-sentabrdan. Sizdan — 3-bo'lim, band-ma-band, birinchi navbatda **K-1d
sanasi** va **K-1a** (tugmani kim bosadi). Shu ikkisi yopilganda «mentor kod termaydi, o'quvchi PIN
termaydi» — ishlaydi.
