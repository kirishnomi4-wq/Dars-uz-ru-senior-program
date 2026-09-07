# JAVOB v4 — «Coddy Camp LMS ↔ Dars-platforma»: mentor-flow qabul qilindi, sinovga qolgan narsalar

**Kimdan:** Dars-platforma jamoasi · **Kimga:** LMS (Coddy Camp) / School API jamoasi
**Sana:** 2026-09-03 · **Nimaga javoban:** `DARS_PLATFORM_PARTNER_IMPLEMENTATION_RU.md` v1.1 (2026-09-03)
**Bu hujjat v3 dagi K-1…K-10 ro'yxatini yopadi va uning o'rniga bitta yakuniy ro'yxat (S-1…S-8) beradi.**

---

## 0. Bir sahifada

**Rahmat.** Mentor-flow (asosiy o'qituvchi yoki TA bosadi → `role: mentor`, `gid` bilan JWT keladi) — bu
bizning bosh to'sig'imiz edi, siz uni yopdingiz. K-1, K-1a, K-1c, K-5 — **yopildi**. v1.1 dagi yangi
talablarni (query string'dan `group_id`/ism o'qilmaydi · §13 20 band · logda asl JWT yo'q) **qabul qilamiz**.

**Endi holat.** Kontrakt va kod sizda tayyor, backend bizda navbatda. Birgalikdagi sinovni boshlash uchun
sizdan **8 ta aniq narsa** qoldi — hammasi «qiymat yoki akkaunt», kod-ish emas. Ular kelgan kuni biz
sinovga chiqamiz.

| Bugun kerak | Nima |
|---|---|
| **S-1** | Test-akkauntlar va test-guruhlar (bloklovchi) |
| **S-2** | `iss` / `aud` / `kid` ning aniq qiymatlari |
| **S-3** | Har ikki API-klient uchun `429` limiti |
| **S-4** | JSX qaysi origin'da ochiladi (mentor va o'quvchi uchun alohida) — CORS uchun |
| **S-5** | Real token dalili: pilot-fayl bilan ikki skrinshot (o'quvchi + mentor) |
| **S-6** | `lang` (UZ/RU) komponentga qanday keladi |
| **S-7** | F5 da `jti` o'sha-o'zimi yoki yangimi |
| **S-8** | «Vaqtincha mentor» maydoni → `TEACHER_ID`/`TA_ID` ning qaysi biriga tushadi |

Keyinroq (prod oldidan, bloklamaydi): coin-formula mas'uli · rotatsiya `kid v2`.

---

## 1. Oqim — nima kelishi kerak, nima kelyapti (to'liq tekshiruv)

Har qator: **biz kutgan ma'lumot → sizning hujjat qayerda tasdiqlaydi → holat**.
Holat belgilari: ✅ hujjatda tasdiqlangan · ⚠️ tasdiqlangan, lekin dalil yo'q · ❌ kelmagan.

### 1.1 Mentor bosganda (CRM → JSX)

| № | Kerak | Sizning hujjat | Holat |
|---|---|---|---|
| M-1 | Tugma bosilganda `liveToken` prop keladi (yangi token har ochilishda) | §4.1, §6 «реализованы оба потока» | ⚠️ dalil yo'q → **S-5** |
| M-2 | Header: `alg=HS256`, `typ=JWT`, `kid` | §3.3 (v1.1 INTEGRATION), §5.1 | ⚠️ real `kid` qiymati noma'lum → **S-2, S-5** |
| M-3 | Claim'lar: `sub`=`teacher_list.ID`, `role=mentor`, `name`, `gid`, `iss`, `aud`, `iat/nbf/exp`, `jti` | §5.3 | ✅ |
| M-4 | Tugmani kim bosa oladi: `TEACHER_ID` yoki `TA_ID` (`role_id=5`); kurator/admin — yo'q | §5.3, §13-7/8 | ✅ |
| M-5 | «Vaqtincha mentor» (CRM maydoni) token oladimi | aytilmagan | ❌ → **S-8** |
| M-6 | Token URL/localStorage'ga tushmaydi, `postMessage` orqali | §4.1 | ✅ |
| M-7 | JSX qaysi origin'da ishlaydi («исходный preview URL» — qaysi domen?) | aytilmagan | ❌ → **S-4** |
| M-8 | `lang="uz"` / `lang="ru"` qanday tanlanadi (bitta materialga ikki til) | faqat `lang="uz"` misoli | ❌ → **S-6** |
| M-9 | `lesson_id` — tokenda yo'q, biz o'z katalogimizdan olamiz | §6 (partnyor kataloqdan tekshiradi) | ✅ bizda |
| M-10 | «Boshqa mentor guruhi» → `403` | §3.2 INTEGRATION | ✅ |

### 1.2 O'quvchi bosganda (LMS → JSX)

| № | Kerak | Sizning hujjat | Holat |
|---|---|---|---|
| O-1 | `liveToken` prop keladi | §6 student-flow | ⚠️ dalil yo'q → **S-5** |
| O-2 | Claim'lar: `sub`=LMS ID, `role=student`, `name`, `crm_id`, `iss/aud/…`, `jti` | §5.2 | ✅ |
| O-3 | Muzlatilgan o'quvchi → `403`, token yo'q | §3.1 INTEGRATION, §13-5 | ✅ |
| O-4 | O'quvchining guruhlari — tokenda yo'q → biz `integration-context` chaqiramiz | §3.2, §6 (5–6-qadam) | ✅ kontekst-token bizda; **limit noma'lum → S-3** |
| O-5 | JSX qaysi origin'da (lms.coddycamp.uz?) | aytilmagan | ❌ → **S-4** |
| O-6 | F5 bosilganda: o'sha `jti` qaytadimi yoki yangi token/jti chiqadimi | §5.4 «F5 с тем же jti» ↔ §3.3 «на каждое открытие новый JWT» — ikkisi bir-biriga zid o'qiladi | ❌ → **S-7** |
| O-7 | `lang` o'quvchi uchun qanday keladi | aytilmagan | ❌ → **S-6** |

### 1.3 Ikkalasi uchun umumiy (imzo, kalitlar, sinov)

| № | Kerak | Holat |
|---|---|---|
| U-1 | JWT-secret (`base64:`, 48 bayt) | ✅ bizda |
| U-2 | `iss`, `aud`, `kid` aniq qiymatlari | ❌ hujjatda hali «передаётся отдельно» → **S-2** |
| U-3 | Natija-token (`lesson_results.submit/read`) | ✅ bizda |
| U-4 | Kontekst-token (`integration-context`) | ✅ bizda |
| U-5 | `429` limiti — natija-klient va kontekst-klient uchun alohida | ❌ §14-7 hali va'da → **S-3** |
| U-6 | Test-akkauntlar va test-guruhlar | ❌ §14 «список тестовых ID» hali va'da → **S-1** |
| U-7 | Test-guruh sahifasida bizning JSX-material (`type = jsx`) | ❌ → **S-1** |
| U-8 | Rotatsiya tartibi (`kid v1` + `v2`) | ✅ §12, prod oldidan |
| U-9 | Coin-formula | ✅ `pending_policy` deb qabul; mas'ul ism — prod oldidan |

### 1.4 Natija (bizning backend → School API)

| № | Kerak | Holat |
|---|---|---|
| N-1 | `POST /lesson-results` kontrakti, `201/200/409/422` | ✅ |
| N-2 | `GET /lesson-results/{event_id}` + `rejected_students` | ✅ |
| N-3 | Retry: tarmoq/`429` (`Retry-After`)/`500`/`503`, 1-3-10 s; `401/403/409/422` to'xtash | ✅ qabul qilamiz |

**Xulosa:** kod-ish sizda tugagan. Qolgan 8 band — qiymat, akkaunt yoki bitta jumla javob.

---

## 2. 🔴 Bugun kerak — S-1…S-8 (har biri: nima → qabul-mezoni)

### S-1. Test-akkauntlar + test-guruhlar (BLOKLOVCHI)

Hammasi sintetik. Xavfsiz kanal orqali. Har akkaunt uchun: login/parol + ID + guruh.

| Kod | Kim | Holat | Nimani sinaydi |
|---|---|---|---|
| **O-1** | O'quvchi, guruh **G-1** (LMS ID + CRM ID) | faol | Oddiy kirish, ism avtomatik, natija |
| **O-2** | O'quvchi, guruh **G-1** | faol | Guruh-natija, top-3 |
| **O-3** | O'quvchi, guruh **G-1** | **muzlatilgan** | `403`, tushunarli xato |
| **O-4** | O'quvchi, guruh **G-2** | faol | **Asosiy:** G-1 sessiyasiga kira olmaydi |
| **O-5** | O'quvchi, **G-1 + G-2** | faol | Ikki sessiya → tanlov |
| **M-1** | Asosiy o'qituvchi, G-1 (`TEACHER_ID`) — CRM login | faol | Kodsiz sessiya, `gid = G-1` |
| **M-2** | Asosiy o'qituvchi, G-2 | faol | O-5 sinovi; M-1 G-2 uchun so'rasa `403` |
| **T-1** | TA (`role_id=5`, `TA_ID` = G-1) — CRM login | faol | §13-7: `role=mentor`, `gid = G-1` |
| **X-1** | Tayinlanmagan xodim yoki kurator — CRM login | faol | §13-8: mentor-token **olmaydi** |

**Qabul-mezoni:** G-1 va G-2 sahifalarida bizning JSX-material (`type = jsx`) bor; O-1…O-5 uni LMS'da
ko'radi; M-1/M-2/T-1/X-1 uni CRM'da ko'radi.

### S-2. `iss` / `aud` / `kid` — aniq qiymatlar

Uch satr yozing. Bizning taxmin: `iss = coddycamp-lms` · `aud = dars-platform` · `kid = v1`.
Mentor-token va o'quvchi-token **bir xil** `iss`/`kid`/secret bilan chiqadimi — «ha/yo'q».

### S-3. `429` limiti

Ikki raqam (so'rov/daqiqa): natija-klient · kontekst-klient. Kontekst muhim: 30 kishilik guruh
bir daqiqada 30 so'rov beradi. `Retry-After` sekundda keladimi — tasdiqlang.

### S-4. JSX qaysi origin'da ochiladi

- Mentor CRM'dan bosganda «исходный preview URL» qaysi domen? (`go.coddycamp.uz`? `lms.coddycamp.uz`? boshqa?)
- O'quvchi LMS'da bosganda qaysi domen? (`lms.coddycamp.uz`?)
- Staging yoki mobil-domen bormi?

Bizning backend CORS'ni **faqat shu ro'yxatga** ochadi. Noto'g'ri bo'lsa `join` so'rovi brauzerda bloklanadi.

### S-5. Real token dalili — pilot-fayl bilan

`InternetLesson.liveToken.jsx` (27-avgustda yuborilgan) ni test-materialga qo'ying va **ikki skrinshot**
yuboring: (a) O-1 LMS'da ochganda pastki-chap belgi · (b) M-1 CRM'da ochganda pastki-chap belgi.
Belgi tokenning o'zini ko'rsatmaydi, faqat `role/sub/gid`, `alg/typ/kid`, `iss/aud`. Bu bizga
§13-1/2 va K-1 ning yarmini bir vaqtda yopadi.

### S-6. `lang` qanday keladi

Bitta JSX-material UZ va RU'da o'tiladi. `lang="uz" | "ru"` ni kim tanlaydi — CRM material-sozlamasimi,
ikkita alohida materialmi, yoki foydalanuvchi tili? Mentor va o'quvchi uchun bir xil qoidami?

### S-7. F5 da `jti`

§3.3 «har ochilishda yangi JWT» va §5.4 «F5 — o'sha `jti`» ni birga o'qisak, savol chiqadi:
**F5 bosilganda LMS/CRM frontend eski tokenni qayta beradimi (server-sessiyadan) yoki yangi token
so'raydimi?** Yangi bo'lsa `jti` ham yangi — biz «o'sha sessiyaga qaytish»ni `jti` orqali emas,
`(session_id, role, sub)` orqali qilamiz. Bitta jumla javob kifoya.

### S-8. «Vaqtincha mentor»

CRM guruh sahifasida «Vaqtincha mentor: …» maydoni bor. U `TEACHER_ID`ga tushadimi, `TA_ID`gami,
yoki alohida maydonmi? Alohida bo'lsa — u token oladimi? (Olmasa o'rinbosar mentor jonli dars ocha olmaydi.)

---

## 3. Biz nima qilamiz

- **Backend** (Node + PostgreSQL): §5.1 ning 12 bandi to'liq · `kid` allowlist (ikki `kid`) · `base64:` dekod ·
  `UNIQUE(jwt_jti)` + `UNIQUE(session_id, role, subject_id)` · mentor-sessiya `gid/teacher_id/lesson_id/jti` ·
  o'quvchi: `integration-context` → `active|demo` + faol guruh → bitta sessiya = avtomatik, ko'p = tanlov,
  yo'q = «Guruhingizda hozir jonli dars yo'q» · natija-navbat `pending → delivered/retry_wait/manual_review` ·
  CORS faqat S-4 ro'yxati · logda token/JWT/shaxsiy ma'lumot yo'q.
- **Komponent:** `liveToken` prop (avval `null`, keyin keladi) · `Authorization: Bearer` bilan `join` ·
  `group_id`/ism query string'dan o'qilmaydi (§4.1) · tokensiz eski dars o'zgarishsiz · PIN — zaxira.
- **Sinov:** sizning §13 20 band + bizning: O-3 tushunarli xato · O-5 tanlov · `GET` da `rejected_students` ·
  rotatsiya `v1+v2` · **maqsad-sinovi:** M-1 CRM'da bosadi → kod yo'q → O-1 LMS'da bosadi → PIN yo'q, o'z
  ismi → O-4 kira olmaydi → T-1 ham ocha oladi → X-1 ocha olmaydi.

---

## 4. Tartib

| № | Kim | Nima | Qachon |
|---|---|---|---|
| 1 | **Siz** | S-1 … S-8 — **bitta javobda, band-ma-band** | **Bugun** |
| 2 | Biz | Backend + komponent | S-2/S-4 kelgan kundan |
| 3 | Birga | §13 1–20 + bizning 5 band | S-1 dan +7 kun |
| 4 | Siz | Coin-mas'ul · rotatsiya `kid v2` | Prod oldidan |

Sizning tomoningizda kod-ish qolmadi — rahmat. Qolgan 8 band javob-xat hajmida. Ular kelishi bilan
«mentor kod termaydi, o'quvchi PIN termaydi» sinovga chiqadi.
