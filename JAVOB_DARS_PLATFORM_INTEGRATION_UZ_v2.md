# JAVOB v2 — «Coddy Camp LMS ↔ Dars-platforma» v1.1 paketiga

**Kimdan:** Dars-platforma jamoasi · **Kimga:** LMS (Coddy Camp) / School API jamoasi
**Nimaga javoban:** `DARS_PLATFORM_INTEGRATION.md` v1.1 (2026-08-25) ·
`DARS_PLATFORM_PARTNER_IMPLEMENTATION_RU.md` v1.0 (2026-08-26) · `dars-platform-openapi.yaml` 1.1.0 ·
uchta kalit (natija-token, kontekst-token, JWT-secret)
**Bizning oldingi javob:** `JAVOB_DARS_PLATFORM_INTEGRATION_UZ.md` (2026-08-20)
**Sana:** 2026-08-27

---

## Qisqacha

**Rahmat — paket keldi va u ishlaydigan paket.** Uchala hujjatni va kalitlarni o'qib, tekshirib
chiqdik. Bizning 2026-08-20 dagi so'rovlarimizning ko'p qismi yopildi (1-bo'lim).

Endi halol holat. Biz uchta avtomatizatsiya so'ragan edik:

| | Nima | Hozirgi paket bilan |
|---|---|---|
| **A2** | Nishonlar (badge) LMS'ga tushadi | ✅ **To'liq qilish mumkin** |
| **A3** | Top-3 va to'g'ri javoblar LMS'ga tushadi | ✅ **To'liq qilish mumkin** |
| **A1** | O'quvchi ism yozmaydi, faqat o'z guruhining darsiga tushadi, PIN yo'q | ⚠️ **Yarmi** — ism va ID avtomatik bo'ladi, lekin **PIN qoladi** |

A1 ning ikkinchi yarmi bizga emas, **LMS tomoniga** bog'liq: mentor darsni ochganda mentor-JWT
(`role: mentor`, `gid`) hali chiqmaydi. Siz buni hujjatda o'zingiz aytgansiz («пока mentor-flow
не подключён, ручной PIN должен остаться fallback»). Biz «yarmi» bilan to'xtamoqchi emasmiz —
A1 ni **to'liq** qilmoqchimiz. Buning uchun sizdan nima kerakligi 4-bo'limda aniq yozilgan.

Bizning reja: **2026-09-02 dan keyin** o'z backend-serverimizni ko'taramiz va 7-bo'limdagi
ishlarni yozamiz. Kod yozishga to'sqinlik qiladigan narsa yo'q. Lekin **sinovni yopish** uchun
5-bo'limdagi uchta narsa kelishi shart — ular kelmasa 2-sentabrdan keyin ham sinab bo'lmaydi.

---

## 1. Nima olindi — tasdiq

### 1.1. Bizning Y-1…Y-8 so'rovlarimiz

| № | So'rov | Holat |
|---|---|---|
| Y-1 | Staging | Alohida staging yo'q, prod'da sintetik akkauntlar bilan (§10). **Qabul qilamiz** |
| Y-2 | Natija-token | ✅ Keldi |
| Y-3 | JWT-secret + `kid` | ✅ Secret keldi. `kid`/`iss`/`aud` «alohida beriladi» deyilgan — **kelmadi** (5.2-band) |
| Y-4 | Test-akkauntlar | ❌ **Kelmadi** — sinovning old-sharti (5.1-band) |
| Y-5 | Namuna-JWT'lar | Kelmadi, lekin **endi shart emas** — secret bizda, o'zimiz yasaymiz. Faqat **siz yasagan bitta** token kerak (6.4-band) |
| Y-6 | `openapi.yaml` | ✅ Keldi (1.1.0) |
| Y-7 | `429` limiti | ❌ Kelmadi (6.1-band) |
| Y-8 | LMS (PHP) holati | ⚠️ Student-flow tayyor. **Mentor-flow yo'q** (4-bo'lim) |

Biz so'ramagan, siz bergan: **kontekst-token** (`integration-context` uchun alohida, tor
ruxsatli o'qish-klient). To'g'ri qaror — eski umumiy o'qish-tokenini bu ish uchun ishlatmaymiz.

### 1.2. Bizning S-1…S-11 savollarimiz

| Savol | Javob | Bizning hukm |
|---|---|---|
| S-1 `jti` va F5 | Birinchi kirishda sessiyaga bog'lanadi; qayta kirish — ruxsat, boshqa sessiya — rad | ✅ Aynan biz taklif qilgandek. Yopildi |
| S-2 `422` butun guruhni yiqitadi | Qisman qabul: `rejected_students[]`, qolganlar saqlanadi (§4.3) | ✅ Yopildi — rahmat, bu muhim edi |
| S-3 PIN zaxira | — | Bizning ish. Saqlab qolamiz |
| S-4 Assistent | **Javob yo'q** | Ochiq (6.2-band) |
| S-5 `sub` turi | Satr (string) | ✅ Yopildi |
| S-6 Kalit aylanishi | `kid` header'da; rotatsiyada ikki `kid` qabul qilinadi | ✅ Yopildi |
| S-7 Soat farqi | 60 soniya | ✅ Yopildi |
| S-8 `solo` maydonlari | Maydonlar butunlay tashlanadi (`null` emas) | ✅ Yopildi. OpenAPI `not` bilan qat'iy — shunday qilamiz |
| S-9 Natijani ko'rish | `GET /lesson-results/{event_id}` | ✅ Yopildi |
| S-10 `TEACHER_ID` filtri | — | Yopiq (kerak emas) |
| S-11 Kosmetik | Tuzatilgan | ✅ |
| §4 Coin-formula mas'uli | **Javob yo'q** | Ochiq (6.3-band) |

### 1.3. v1.1 da qo'shilgan yangi talablar — qabul qilamiz

`typ = JWT` · `kid` faqat server-allowlist'dan (kid — dalil emas, kalit-tanlov) ·
`exp − iat ≤ 43 200` · `sub` musbat son-satr · `base64:` prefiksi dekod qilinib **bayt** sifatida
ishlatiladi · `lesson_id` brauzerdan ishonilmaydi (server-katalog) · `UNIQUE(jwt_jti)` va
`UNIQUE(session_id, role, subject_id)` DB darajasida · natija avval o'z DB'ga `pending`, keyin
navbatdan · `409` da yangi `event_id` yasalmaydi — qo'lda tekshiruv. Hammasiga rozimiz.

---

## 2. Kalitlar haqida — ochiq gap

Uchala kalit **olindi va format bo'yicha tekshirildi**: ikkala `sapi_` token — 64 hex, bir-biridan
farqli; JWT-secret — `base64:` prefiksli, dekodda 48 bayt (hujjatingizdagi `openssl rand -base64 48`
ga aynan mos). Hammasi to'g'ri yasalgan.

Bizda saqlanishi: faqat server-muhitda (env), repo'ga, brauzer-bundle'ga, jurnalga tushmaydi —
sizning §1 va §10 qoidangiz bizda ham.

Bitta narsani aytmasak bo'lmaydi: kalitlar bizga **oddiy xabar** orqali keldi. Bu sizning o'z
§1/§10 qoidangizga zid. Ayb izlamaymiz — sinov uchun shu kalitlar bilan ishlaymiz. Lekin
**prod'ga chiqishdan oldin rotatsiya** so'raymiz: yangi secret + `kid: v2` (6.5-band), kelishilgan
xavfsiz kanal orqali. Shunda ikkala tomon ham o'z qoidasiga qaytadi.

---

## 3. Halol holat — nima ishlaydi, nima yo'q

Hozirgi paket bilan o'quvchi-oqimi **to'liq**:

```
O'quvchi LMS'ga kiradi → darsni ochadi
  → LMS backend: POST /live-token {role: student}         ✅ (sizda tayyor)
  → LMS frontend: <Lesson liveToken=…>                     ✅ (sizda tayyor)
  → bizning backend: JWT tekshiruv → sub, name, crm_id     ✅ (secret bizda)
  → integration-context → o'quvchining guruhlari           ✅ (kontekst-token bizda)
  → o'quvchi o'z ismi bilan, ID bilan sessiyada            ✅
  → dars tugadi → POST /lesson-results (badge, top-3)      ✅ (natija-token bizda)
```

Mentor-oqimi **yo'q**:

```
Mentor LMS'da guruh-kartasidan darsni ochadi
  → LMS backend: POST /live-token {role: mentor, group_id}  ❌ yozilmagan
  → bizning backend: sessiya = aynan gid guruhi              ⏸ kutadi
```

Mentor-JWT bo'lmasa bizning backend «bu sessiya qaysi guruhniki?» ni **bilmaydi**. Shuning
uchun o'quvchi «o'z guruhining sessiyasi»ni topa olmaydi — PIN qolishga majbur. Ism va ID
avtomatik bo'ladi (bu ham katta yutuq), lekin «boshqa guruh bolasi kira olmaydi» degan
asosiy maqsad PIN bilan qoladi.

**Biz yarmi bilan qoniqmaymiz.** 4-bo'lim — A1 ni to'liq qilish uchun LMS tomonida aynan nima
kerak.

---

## 4. 🔴 Mentor-flow — LMS tomonida nima qilinishi kerak

Bu bo'lim §3.5 dagi `requestDarsLiveToken()` ning **mentor** varianti. Kod-namuna sizda bor;
biz faqat *qayerda* va *qanday* chaqirilishi kerakligini yozamiz.

### 4.1. Qadamlar

1. **Mentor LMS'ga o'z akkaunti bilan kiradi.** LMS sessiyasida mentorning `teacher_list.ID`
   si bo'lishi kerak (o'quvchida `student_students.id` bo'lgani kabi).
2. **Mentor darsni GURUH kontekstidan ochadi** — guruh-kartasi, guruh-jadvali, «Darsni
   boshlash» tugmasi guruh sahifasida. Bu majburiy: `group_id` shu yerdan keladi. Mentor
   darsni guruhsiz umumiy ro'yxatdan ochsa — `gid` yo'q, mentor-JWT chiqmaydi.
3. **LMS backend** o'z sessiyasidan `teacher_list.ID` ni, sahifadan `group_id` ni oladi va
   chaqiradi:
   ```json
   POST /api/v1/integrations/dars-platform/live-token
   { "role": "mentor", "subject_id": <teacher_list.ID>, "group_id": <group_list.ID> }
   ```
   School API `group_list.TEACHER_ID = subject_id` va `STATUS = active` ni tekshiradi (sizning
   §3.2) — bu qism sizda tayyor.
4. **LMS frontend** olingan `live_token` ni komponentga uzatadi — o'quvchidagi bilan **bir xil
   prop**: `<Lesson liveToken={liveToken} lang="uz" />`. Komponent `role` ni tokendan o'zi
   o'qiydi (bizning backend tekshirgandan keyin); LMS'dan alohida «bu mentor» belgisi kerak emas.
5. **Har ochilishda yangi JWT** (o'quvchidagi kabi).

### 4.2. Qabul-mezonlari (mentor-flow tayyor, qachonki)

- [ ] Mentor guruh-kartasidan darsni ochganda komponentga `liveToken` keladi, ichida
      `role: "mentor"`, `sub` = `teacher_list.ID`, `gid` = o'sha guruh.
- [ ] Mentor **boshqa** mentorning guruhi uchun darsni ocha olmaydi (`403` — sizda tayyor).
- [ ] Mentor `F5` bossa — o'sha token (yoki yangi token, o'sha `gid`) — sessiya yo'qolmaydi.
- [ ] O'quvchi va mentor **bir xil** JSX-faylni ochadi; farq faqat tokendagi `role` da.

### 4.3. Savollar (mentor-flow'ni yozishdan oldin javob kerak)

| № | Savol | Nima uchun |
|---|---|---|
| M-1 | Mentorlar LMS'ga o'z akkaunti bilan kiradimi? Sessiyada `teacher_list.ID` bormi, yoki `gl_sys_users` orqali bog'lanadimi? | `subject_id` qayerdan olinishini bilish uchun |
| M-2 | Mentor darsni qaysi sahifadan ochadi — guruh ichidanmi? Agar guruhsiz sahifadan ham ochilsa, u holda nima bo'ladi? | `group_id` manbasi; guruhsiz ochilish = PIN-zaxira |
| M-3 | Mentor-flow'ni **kim** yozadi va **qachon** tayyor bo'ladi? | Biz 2-sentabrdan keyin backend'ni yozamiz; mentor-flow qachon kelishiga qarab sinov sanasini belgilaymiz |
| M-4 | Assistent (`ASSISTANT_ID`) jonli dars o'tkazadimi? Ha bo'lsa — `live-token` uni ham qabul qilsinmi? | Mahsulot-qarori (S-4 takrori) |

**M-3 eng muhimi.** Jim qolsa — A1 yarim bo'lib qoladi va bu bizning ishimiz emas.

---

## 5. 🔴 Sinovni yopish uchun MAJBURIY (3 band)

Bularsiz kod yozish mumkin, lekin **sinab bo'lmaydi**.

### 5.1. Test-akkauntlar (Y-4 takrori — aniq spetsifikatsiya bilan)

Hammasi **sintetik** (real bola emas). Har biri uchun: **LMS login/parol** (chunki oqim
LMS'ga kirishdan boshlanadi) + LMS ID (`student_students.id`) + CRM ID (`student_list.ID`) +
guruh.

| Kod | Kim | Holat | Nimani sinaydi |
|---|---|---|---|
| **O-1** | O'quvchi, guruh **G-1** | faol obuna | Oddiy kirish, ism avtomatik, natija |
| **O-2** | O'quvchi, guruh **G-1** | faol obuna | Guruh-natija (2+ o'quvchi, top-3) |
| **O-3** | O'quvchi, guruh **G-1** | **muzlatilgan** (obunasi faol emas) | `live-token` → `403`; tushunarli xato, oq ekran emas |
| **O-4** | O'quvchi, guruh **G-2** (boshqa mentor) | faol obuna | **A1 asosiy sinovi:** G-1 sessiyasiga kira olmasligi |
| **O-5** *(ixtiyoriy)* | O'quvchi, **G-1 va G-2** ikkalasida | faol | Ikki guruhda ham sessiya bo'lsa — tanlov ekrani |
| **M-1** | Mentor, guruh **G-1** | faol | Sessiya ochish, `gid` = G-1 |
| **M-2** *(ixtiyoriy)* | Mentor, guruh **G-2** | faol | M-1 G-2 uchun token so'rasa `403` |

Qo'shimcha: **LMS'da test-kurs/sahifa** — unda bizning JSX-dars turadi va O-1…O-5 unga
yozilgan. Bo'lmasa o'quvchi LMS'dan darsni ocha olmaydi.

### 5.2. `iss` / `aud` / `kid` — aniq qiymatlar

Hujjatda: «текущее значение передаётся отдельно». Kelmadi. Biz hozircha hujjat defaultlarini
oldik — **tasdiqlang yoki to'g'rilang:**

```
iss = coddycamp-lms
aud = dars-platform
kid = v1
```

Bitta belgi farq qilsa — har bir token rad bo'ladi. Bu bir qatorlik javob, lekin usiz hech
narsa ishlamaydi.

### 5.3. Mentor-flow sanasi (M-3)

4-bo'limda. Sana bo'lmasa — sinov rejasini tuzib bo'lmaydi.

---

## 6. Qo'shimcha so'rovlar (ishni to'xtatmaydi, lekin javob kerak)

| № | Nima | Nima uchun |
|---|---|---|
| **6.1** | `429` limiti — natija-klient va kontekst-klient uchun alohida raqam (so'rov/daqiqa) | Backoff'ni shunga moslaymiz. Ayniqsa kontekst-klient: har o'quvchi kirishida 1 so'rov — 30 kishilik guruh bir daqiqada 30 so'rov beradi |
| **6.2** | Assistent (M-4 / S-4) — ha/yo'q | Mahsulot-qarori |
| **6.3** | Coin-formula uchun **bitta mas'ul ism** | `pending_policy` dan chiqish uchun. Bizning taklif oldingi javob 4-bo'limida turibdi; formula kimniki bo'lsa ham bizda hech narsa o'zgarmaydi |
| **6.4** | **Siz yasagan bitta real** student-JWT (test-akkaunt O-1 uchun, muddati o'tsa ham mayli) | Header (`kid`, `typ`) va claim'lar real qanday chiqishini bir marta ko'rish uchun. Biz secret bilan o'zimiz yasaymiz, lekin «o'zimizniki o'zimizga mos» degan sinov — sinov emas |
| **6.5** | Prod oldidan **rotatsiya**: yangi secret + `kid: v2`, xavfsiz kanal (2-bo'lim) | Kalitlar oddiy xabar orqali kelgan |
| **6.6** | LMS **origin**'lari — JSX qaysi domen(lar)dan ochiladi (masalan `go.coddycamp.uz`, staging bo'lsa u ham) | Bizning backend CORS'ni faqat shu domenlarga ochadi |

---

## 7. Biz nima qilamiz va qachon

### 7.1. Backend

Hozir bizda server-kod yo'q — jonli dars Supabase (Postgres RPC) ustida ishlaydi. JWT-tekshiruv,
`integration-context`, natija-navbat — sirlar bilan ishlaydigan server-kod. Shuning uchun
**2026-09-02 dan keyin** o'z backend-serverimizni ko'taramiz (Node + PostgreSQL) va unga
yozamiz:

- **JWT-tekshiruv** — sizning §5.1 ro'yxati **to'liq**: 3 segment · `alg = HS256` qat'iy ·
  `typ = JWT` · `kid` allowlist (bir vaqtda ikki `kid`) · HMAC imzo · `iss`/`aud` aniq ·
  `nbf`/`iat`/`exp` 60 s leeway · `exp − iat ≤ 43 200` · `jti` bo'sh emas · `role` faqat
  `student|mentor` · `sub` musbat son-satr. `base64:` dekod qilinadi.
- **`jti` ↔ sessiya** — `UNIQUE(jwt_jti)`, `UNIQUE(session_id, role, subject_id)`; F5 —
  o'sha sessiya; boshqa sessiya — rad. JWT'ning o'zi saqlanmaydi (faqat `jti`, ID'lar, `exp`).
- **Guruh-moslik** — `integration-context` (kontekst-token bilan, server→server) →
  `status ∈ {active, demo}`, `active = true`, guruhi faol → shu guruhlar ichida `lesson_id`
  bo'yicha faol sessiya → bitta bo'lsa avtomatik, bir nechta bo'lsa tanlov, yo'q bo'lsa
  «Sizning guruhingizda hozir jonli dars yo'q». `lesson_id` faqat server-katalogdan.
- **Natija-navbat** — avval o'z DB'ga `pending` → yuborish → `delivered` / `retry_wait` /
  `manual_review`. Qayta urinish faqat tarmoq / `429` (`Retry-After`) / `500` / `503`,
  1-3-10 s. `401/403/409/422` — to'xtash + jurnal (HTTP-kod, `event_id`, `X-Request-ID`).
  `409` — yangi `event_id` yasalmaydi. `solo` da `group_id`/`teacher_id` tashlanadi,
  `rank: null`. `badges_count = badges.length`, kalitlar `lower_snake_case` (barcha darslar
  bo'ylab tekshiramiz).
- **Jurnal** — `sapi_`, JWT, shaxsiy ma'lumot yozilmaydi.
- **PIN — zaxira** (mentor qo'lda yoqsa; `503` yoki mentor-flow yo'q holatlar uchun).

### 7.2. Dars-komponent

`liveToken` prop'ini qabul qiladi; `null` → keyin keladi — `useEffect([liveToken])` (sizning
§4). Eski dars (`liveToken`siz) o'zgarishsiz ishlaydi. Brauzerda imzo tekshirilmaydi, secret
yo'q, JWT `console`/analitikaga yozilmaydi.

### 7.3. Ikki bosqich

| Bosqich | Nima | Nimaga bog'liq |
|---|---|---|
| **1** | O'quvchi ism yozmaydi (JWT `name`), ID bog'lanadi, natija LMS'ga tushadi (A2, A3) — **PIN hali turadi** | Faqat bizga: server + 5.1, 5.2 |
| **2** | Mentor `gid`-sessiya, PIN yo'q, boshqa guruh kira olmaydi (A1 to'liq) | **LMS mentor-flow** (4-bo'lim) |

1-bosqich mentor-flow'ni kutmaydi. Mentor-flow kelgan kuni 2-bosqich yoqiladi — bizning
backend'da bu **bitta shart**, qayta yozish emas.

---

## 8. Birgalikdagi sinov — qabul-mezonlari

Sizning `PARTNER_IMPLEMENTATION` §13 dagi **17 bandni to'liq qabul qilamiz**. Ular ustiga:

- [ ] **18.** O'quvchi **LMS ichidan** darsni ochadi (test-kurs orqali) — tashqi havoladan emas.
- [ ] **19.** O-3 (muzlatilgan) — LMS'da dars tugmasini bosganda tushunarli xabar, oq ekran emas.
- [ ] **20.** O-5 (ikki guruh) — ikkalasida sessiya bo'lsa tanlov; bittasida bo'lsa avtomatik.
- [ ] **21.** Mentor darsni **guruhsiz** sahifadan ochsa (M-2 javobiga qarab) — PIN-zaxira ishlaydi, xato yo'q.
- [ ] **22.** `GET /lesson-results/{event_id}` — biz yuborgan `rejected_students` ham ko'rinadi.
- [ ] **23.** Rotatsiya sinovi: `kid v1` va `v2` bir vaqtda qabul, keyin `v1` o'chiriladi — eski token rad.

Sinov sanasi: **5.1 va 5.2 kelgan kundan +7 kun** ichida biz 1-bosqichni taklif qilamiz;
2-bosqich — mentor-flow sanasidan +3 kun.

---

## 9. Tartib — kim nima qiladi

| № | Kim | Nima | Muddat |
|---|---|---|---|
| 1 | **Siz** | 5.1 test-akkauntlar + LMS test-kurs · 5.2 `iss/aud/kid` · 5.3 mentor-flow sanasi — **bitta javobda** | Iloji boricha tez — bu bizning boshlanish nuqtamiz |
| 2 | **Siz** | 4.3 (M-1…M-4) va 6.1…6.6 javoblari | Shu javob bilan birga |
| 3 | **Biz** | Server + 7.1, 7.2 (1-bosqich) | 2026-09-02 dan boshlab |
| 4 | **Birga** | 1-bosqich sinovi (§13 1–5, 8, 10–17 + 18–20, 22) | 5.1/5.2 dan +7 kun |
| 5 | **Siz** | Mentor-flow (4-bo'lim) | M-3 sanasi |
| 6 | **Birga** | 2-bosqich sinovi (§13 6, 7, 9 + 21) — **A1 to'liq** | Mentor-flow'dan +3 kun |
| 7 | **Siz** | Rotatsiya (`kid v2`) · coin-mas'ul → formula → `coins_awarded` | Prod oldidan |

Oldingi javobdagi qoida shu yerda ham: **jim qoldirilgan band = bizda ish to'xtab turadi.**
Qaysi biri bo'lmasa — «yo'q, sababi…» deb yozing, biz rejani shunga moslaymiz.

---

## 10. Oxirida

Paket puxta: kontrakt aniq, xavfsizlik qoidalari qattiq, qisman qabul va `GET` bizning
so'rovimiz bo'yicha qo'shilgan — buni ko'rdik va qadrlaymiz.

Bitta narsa qoldi va u texnik emas, tashkiliy: **mentor-flow**. U bo'lmasa biz «ism yozmaydi»
gacha boramiz, «PIN yo'q, boshqa guruh kira olmaydi» ga bormaymiz. Biz o'z qismimizni to'liq
yozamiz va mentor-flow kelgan kuni yoqamiz. Sizdan — 5-bo'limdagi uchta narsa va M-3 sanasi.
