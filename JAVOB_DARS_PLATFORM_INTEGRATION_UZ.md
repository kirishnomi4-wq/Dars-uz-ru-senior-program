# JAVOB — «Coddy Camp LMS ↔ Dars-platforma» (v1.0, 2026-08-20) hujjatiga

**Kimdan:** Dars-platforma jamoasi · **Kimga:** LMS (Coddy Camp) / School API jamoasi
**Nimaga javoban:** `DARS_PLATFORM_INTEGRATION.md` v1.0 — bizning `LMS_KIRISH_VA_NATIJA_TZ.md` (2026-08-18) ga javob
**Sana:** 2026-08-20

---

## Qisqacha

**Ikkala talabni ham qabul qilamiz.** Sizning yechimingiz bizning TZ'mizdan kuchliroq —
buni ochiq aytamiz (1-bo'lim).

Lekin bitta narsani ham ochiq aytishimiz kerak. Hujjatingiz «реализовано» deydi, bizning
qo'limizda esa **sinab ko'radigan hech narsa yo'q**: na staging-manzil, na kalit, na
test-akkaunt, na namuna-token, na hujjat havola qilgan `dars-platform-openapi.yaml`.
Biz TZ'ning 7-bo'limida aynan shu narsalarni so'ragan edik — birortasi kelmadi.
Ular kelmaguncha biz o'z tomonimizni yozib, tekshira olmaymiz, demak ish «tayyor» emas,
«loyihalangan». Nima kerakligini 2-bo'limda **raqamlangan ro'yxat** qilib berdik —
iltimos, bitta javobda, to'liq.

Uchinchi narsa: coin-formula **hech kimniki bo'lib qoldi** (4-bo'lim). Buni ham hal qilaylik.

---

## 1. Nimada haqsiz — ochiq aytamiz

**Tokenni LMS emas, School API yasaydi.** Biz «LMS o'zi 20–30 qator PHP bilan imzolasin»
degan edik. Sizniki yaxshiroq: LMS backend `POST /live-token` chaqiradi, School API
o'zi bazadan tekshiradi (o'quvchi faol, obunasi faol, guruhi faol; mentor uchun
`group_list.TEACHER_ID = subject_id` aniq mosligi) va shundan keyingina imzolaydi.
«Bu mentor haqiqatan shu guruhnikimi?» degan tekshiruvni biz o'z zimmamizga olmoqchi
edik — endi u manbada, bazaning yonida turadi. To'g'ri joy.

**`iss`, `aud`, `nbf`, `jti`.** Bizning TZ'da yo'q edi. To'g'ri qo'shimcha — hammasini
tekshiramiz.

**`crm_id` o'quvchi tokenida.** Biz «qaysi ID qulay bo'lsa» degan edik; siz ikkalasini
ham berdingiz. Yaxshi.

**Muzlatilgan o'quvchi → 403.** Biz bu holatni umuman o'ylamagan edik.

**`409` — bir xil `event_id`, boshqa mazmun.** Bizning «idempotentlik» talabimizdan
aniqroq. Qabul.

**Natija-tanasi.** Bizning §5.3 ni deyarli bir-biriga ko'chirib olgansiz, ustiga qat'iy
tekshiruvlar qo'shgansiz (`correct ≤ answered ≤ total`, noyob o'rinlar,
`badges_count`). Rozimiz — shunga mos yozamiz.

---

## 2. 🔴 Bizga YETKAZIB BERILISHI kerak bo'lgan narsalar

Quyidagi ro'yxatsiz biz boshlay olmaymiz. Har band — aniq, o'lchanadigan.
«Admin-panelda klient yaratish mumkin» degan gap bizga yetmaydi — **yaratilgan klient va
uning kaliti** kerak.

| № | Nima | Aniq talab |
|---|---|---|
| **Y-1** | **Staging base URL** | `live-token` va `lesson-results` ikkalasi ishlaydigan sinov-muhit manzili. Agar alohida staging yo'q bo'lsa — shuni yozing va prod'da **test-klient + test-akkauntlar** bering. |
| **Y-2** | **`lesson_results.submit` kaliti** | `Dars-platforma — результаты` klienti uchun `sapi_…` token. Faqat xavfsiz kanal orqali (hujjatingiz §1 qoidasi — bizga ham tegishli). |
| **Y-3** | **JWT maxfiy kaliti** | `DARS_PLATFORM_JWT_SECRET` ning o'zi (biz imzoni tekshiramiz — kalitsiz tekshirib bo'lmaydi) + `kid`/versiya. Xavfsiz kanal. |
| **Y-4** | **Test-akkauntlar** | Kamida: **3 o'quvchi** (har biriga LMS ID + CRM ID + guruh; uchinchisi **muzlatilgan** — 403 ni sinash uchun) · **1 mentor** o'z guruhi bilan (`teacher_list.ID` + `group_list.ID`) · **1 o'quvchi boshqa guruhdan** (A1'ning asosiy sinovi: u birinchi guruh sessiyasiga kira olmasligi kerak). Real bolalar ma'lumoti EMAS. |
| **Y-5** | **Namuna-tokenlar** | Y-3 kaliti bilan yasalgan **4 ta JWT**: o'quvchi (amal qiladigan) · mentor (amal qiladigan) · muddati o'tgan · `aud` noto'g'ri. Biz tekshiruv-kodimizni aynan shularga qarshi sinaymiz. |
| **Y-6** | **`dars-platform-openapi.yaml`** | Hujjat unga havola qiladi, fayl kelmagan. |
| **Y-7** | **`429` limiti** | Klient uchun aniq raqam (so'rov/daqiqa). Biz backoff'ni shunga moslaymiz. |
| **Y-8** | **LMS (PHP) tomonining holati** | Hujjat School API jamoasidan. §3.5 dagi `requestDarsLiveToken()` — bu **LMS qilishi kerak** bo'lgan ish; §9 qabul-tekshiruvida «LMS dars-sahifasi komponentga `liveToken` uzatadi» bandi **yo'q**. Savol aniq: LMS tomonida bu **yozilganmi**? Yozilmagan bo'lsa — **kim** va **qachon**? Bu bo'lmasa o'quvchi darsni ochganda token umuman kelmaydi va butun zanjir ishlamaydi. |

Y-1…Y-8 — bu «xohish» emas, **sinovning old-sharti**. Ular kelgan kundan boshlab biz
o'z qismimizni (5-bo'lim) yozamiz va sinov sanasini taklif qilamiz.

---

## 3. Aniqlik-savollar (S-1…S-11)

Har birida biz qanday qilmoqchi ekanimizni yozdik — e'tiroz bo'lmasa, shunday qilamiz.

**S-1. `jti` va sahifa yangilanishi.** O'quvchi darsda `F5` bossa — o'sha token, o'sha
`jti`. Sizning «bir `jti` bilan ikkinchi sessiya yaratilmasin» qoidasini biz shunday
tushunamiz: *`jti` birinchi kirishda sessiyaga bog'lanadi; o'sha `jti` bilan o'sha
sessiyaga qayta kirish — ruxsat; boshqa sessiya ochish — rad.* Tasdiqlang.

**S-2. `422` butun guruhni yiqitadi.** «Har ID school DB bo'yicha tekshiriladi» +
«`422` ni qayta yubormang» = dars davomida **bitta** o'quvchi muzlatilsa, **butun
guruhning** natijasi qabul qilinmaydi va yo'qoladi. **Qisman qabul so'raymiz:** noto'g'ri
ID'lar `rejected_students: [{ student_id, reason }]` bilan qaytsin, qolganlar `201` bilan
saqlansin. Bu talab — A2/A3 uchun muhim.

**S-3. `503` — darsga kirib bo'lmaydi.** Legacy DB yotsa `live-token` ishlamaydi, ya'ni
jonli dars umuman ochilmaydi. Biz **PIN-rejimni zaxira** sifatida saqlab qolamiz (faqat
mentor qo'lda yoqsa). Bu sizning ishingizga ta'sir qilmaydi — xabar uchun.

**S-4. Assistent / kurator.** Siz faqat `TEACHER_ID` ni tekshirasiz. Coddy Camp'da
assistent jonli dars o'tkazadimi? Bu mahsulot-qarori, texnik emas — javob «ha» bo'lsa,
`ASSISTANT_ID` ham tekshiruvga kirsin.

**S-5. `sub` turi.** Biz `string` degan edik; sizning misolingizda `34174` (raqam).
Claim'da aynan qaysi tur? Biz ikkalasini ham qabul qilamiz, lekin hujjatda yozilsin.

**S-6. Kalit aylanishi.** `.env` da `DARS_PLATFORM_JWT_KEY_ID=v1` bor, lekin JWT
**header**ida `kid` bormi — claims jadvalida yo'q. Kalit almashganda biz qanday bilamiz?
Taklif: header'da `kid`, biz bir vaqtda ikkita kalitni qabul qilamiz (eski + yangi).

**S-7. Soat farqi.** `nbf`/`exp` qat'iy tekshirilsa, serverlar orasidagi 2–3 soniya farq
rad beradi. **60 soniya leeway** kelishamiz — ikkala tomonda.

**S-8. `solo` rejimi.** `group_id` va `teacher_id` «отсутствуют» — `null` yuborilsa ham
`422` bo'ladimi? Biz maydonlarni umuman **tashlab yuboramiz**; tasdiqlang.

**S-9. Natijani ko'rish.** Sinovda biz yuborgan `event_id` control DB'ga tushganini
**o'zimiz** qanday ko'ramiz? `GET …/lesson-results/{event_id}` yo'q. Yo kichik read-endpoint,
yo admin-paneldan skrinshot — sinov uchun yetadi, lekin yo'l kerak.

**S-10. `TEACHER_ID` filtri** (bizning §7 savoli). Mentor-tekshiruvni endi siz qilganingiz
uchun bu savol **bizga shart emas** — yopamiz. Bor bo'lsa, baribir ayting.

**S-11. Kosmetik.** §3.3 `expires_at` qatori JSON'da noto'g'ri chekinish bilan. Ma'noga
ta'sir qilmaydi.

---

## 4. Coin-formula — kimniki?

Halol holat: biz TZ'da «formulani LMS belgilaydi, biz faktlarni beramiz» dedik; siz
«TZ'da tasdiqlangan formula yo'q» dedingiz. **Ikkalamiz ham haqmiz** — formula texnik
masala emas, **mahsulot-qarori**, va uni hozircha hech kim qabul qilmagan. `pending_policy`
bilan yashash mumkin, lekin u holda A2/A3 ning «coin'ga aylanadi» qismi ishlamaydi —
faktlar saqlanadi, o'quvchi hech narsa ko'rmaydi.

So'raymiz: **Coddy Camp tomonidan bitta mas'ul ism** — kim formulani tasdiqlaydi.

Muhokama uchun boshlang'ich taklif (kontrakt emas):

| Fakt | Coin |
|---|---|
| har to'g'ri javob | 10 |
| top-1 / top-2 / top-3 | 100 / 70 / 50 |
| har nishon (badge) | 20 |
| darsni oxirigacha o'tgan (`completed`) | 30 |

Formula qanday bo'lishidan qat'i nazar, bizdan **hech narsa o'zgarmaydi**. Faqat bitta
iltimos: `reward_status` `pending_policy` dan chiqqach, javobda `coins_awarded`
qaytaring — biz o'quvchiga «+120 coin» ko'rsatamiz. Bu bola uchun darsning eng yoqimli
soniyasi.

---

## 5. Bizning tomonda nima qilinadi (o'z zimmamiz)

Y-1…Y-8 kelgach:

- **JWT tekshiruvi:** `alg = HS256` (boshqasi rad), imzo, `iss = coddycamp-lms`,
  `aud = dars-platform`, `nbf`/`exp` (60 s leeway), `jti`-jurnal 12 soat (S-1 qoidasi).
  `sub`/`role`/`gid`/`name` faqat tokendan — frontend holatidan hech qachon.
- **Guruh-moslik (A1):** o'quvchi guruhlari `integration-context` orqali; sessiya faqat
  o'z guruhiniki; ikki guruhda ham sessiya bo'lsa — tanlov.
- **Natija-yuboruvchi:** server→server (brauzerdan emas); `solo` da maydonlar tashlanadi;
  `badges_count = badges.length`; badge-kalitlar `lower_snake_case` (lug'atni beramiz);
  qayta urinish faqat tarmoq/`429`/`5xx`, 1-3-10 soniya; `401/403/409/422` — to'xtash +
  jurnal (faqat HTTP-kod + `X-Request-ID`, tana yo'q).
- **`lesson_results` jadvali** bizda ham (doimiy) — qayta yuborish/solishtirish uchun.
- **PIN — zaxira rejimi** (S-3).
- Jurnalga `sapi_…`, JWT, shaxsiy ma'lumot **yozilmaydi** — sizning qoidangiz bizda ham.

Bekor qilinadi: 2026-08-04 TZ §7 **sinov-vektori** (`st_1042 / grp: F7-A`) — payload butunlay
o'zgardi, endi kutubxona imzolaydi. Uning o'rnini Y-5 namuna-tokenlar bosadi.

---

## 6. Qabul-mezonlari — sizning §9 ga qo'shimchalar

§9 dagi 1–10 ni **to'liq qabul qilamiz**. Lekin u ro'yxatda bizning **asosiy maqsad** —
A1 (boshqa guruh bolasi kira olmasin) — umuman yo'q. Qo'shamiz:

- [ ] **11.** LMS dars-sahifasi komponentga `liveToken` uzatadi — o'quvchi uchun ham,
      mentor uchun ham (Y-8).
- [ ] **12.** Mentor darsni ochadi → sessiya **aynan `gid` guruhiga** bog'lanadi, PIN so'ralmaydi.
- [ ] **13.** O'z guruhi o'quvchisi kiradi — **ism yozmaydi**, rasmiy ismi bilan ko'rinadi.
- [ ] **14.** **Boshqa guruh o'quvchisi** (Y-4) o'sha sessiyaga **kira olmaydi** —
      «Sizning guruhingizda hozir jonli dars yo'q».
- [ ] **15.** `F5` — o'quvchi o'sha sessiyaga, o'z joyiga qaytadi (S-1).
- [ ] **16.** Muddati o'tgan / `aud` noto'g'ri token (Y-5) — tushunarli xato, oq ekran emas.
- [ ] **17.** Bitta noto'g'ri ID bilan guruh-natija — qolganlar saqlanadi (S-2 qabul qilinsa).
- [ ] **18.** Yuborilgan `event_id` ni biz ko'ra olamiz (S-9).

---

## 7. Tartib

1. **Siz:** Y-1…Y-8 — **bitta javobda, to'liq.** Qaysi biri bo'lmasa — «yo'q, sababi…»
   deb yozing; jim qoldirilgan band = bizda ish to'xtab turadi.
2. **Siz:** S-1…S-11 bo'yicha javob (ko'pchiligi «ha/yo'q»).
3. **Coddy Camp:** coin-formula uchun mas'ul ism (4-bo'lim).
4. **Biz:** 5-bo'limdagi ishlar; sinov sanasini taklif qilamiz.
5. **Birga:** §9 1–10 + 11–18.
6. **Keyin:** formula → sizda reward-handler → `coins_awarded`.

---

## 8. Oxirida

Hujjat uchun rahmat — u puxta yozilgan, xavfsizlik qoidalari bizning TZ'mizdan qattiqroq,
va bu yaxshi. Biz hech qaysi bandingizga e'tiroz bildirmayapmiz.

Faqat bitta so'zga e'tiroz bor: **«реализовано»**. Bu so'z sinovdan keyin aytiladi.
Hozir bizda sinaydigan hech narsa yo'q. Y-1…Y-8 kelsin — biz o'z qismimizni yozamiz,
birga sinaymiz, va o'shanda «ishlaydi» deb ikkalamiz aytamiz.
