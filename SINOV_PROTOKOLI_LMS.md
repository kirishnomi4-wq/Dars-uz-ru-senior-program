# SINOV PROTOKOLI — LMS ↔ Dars-platforma (birgalikdagi qabul sinovi)

**Asos:** LMS v1.2 §13 (21 band) + bizning 5 band · **Muhit:** avval `staging-dars-api.coddycamp.uz`, keyin prod `dars-api.coddycamp.uz` · **Sana:** to'ldiriladi
**Ishtirokchilar:** LMS jamoasi (test-akkauntlar, CRM), biz (backend, admin-sahifa, loglar)

## 0. Tayyorgarlik (sinovdan oldin)

`<STAGING>` = Kristina bergan manzil (masalan `https://staging-dars-api.coddycamp.uz`). To'liq tartib: `STAGING_QABUL_UZ.md`.

| # | Kim | Nima | Tekshiruv |
|---|---|---|---|
| T1 | Biz | `cd server && node --env-file=.env.deploy.staging tools/staging-check.mjs <STAGING>` — 19 band bir yo'la: health, env, migratsiya/katalog soni, soat (JWT ±60 s), TLS, 404-JSON, CORS, tana-yo'li, ko'prik, JWT rad, proksi-IP, admin, mentor-oqim (join → ETag/304 → heartbeat → me → end), School API ulanishi, kechikish | «Qabul: server tayyor», 0 ✗ |
| T2 | Kristina | Serverdagi env-fayl = yuborilgan `.env.deploy.staging` (`CORS_ORIGINS=https://lms.coddycamp.uz`, iss/aud/kid, tokenlar) | T1 dagi `env`, `features`, `cors_allow`, `mentor_flow` ✓ |
| T3 | avto | Katalog `migrate` xizmatida yuklanadi (`migrate && seed:catalog`, compose 2026-09-08) | T1 dagi `catalog` = 110 (lokal `data/lesson-catalog.json` bilan bir xil) |
| T4 | Biz | Pilot: `DARS_API_URL=<STAGING> node scripts/build-lms.mjs src/1-Modull/InternetLesson.jsx` → `lms/InternetLesson.jsx`; `CHROME=/usr/bin/google-chrome node scripts/smoke-lms.mjs lms/InternetLesson.jsx` | smoke o'tdi, faylda `<STAGING>` bor, eski manzil yo'q |
| T5 | Biz | Pilot-faylni CRM «Umumiy modullar» → test-materialga (`type=jsx`) G-1 va G-2 sahifalariga | O-1 LMS'da ko'radi, M-1 CRM'da ko'radi |
| T6 | Foydalanuvchi | Test-akkauntlar (S-1): O-1, O-2 (G-1 faol) · O-3 (G-1 muzlatilgan) · O-4 (G-2) · O-5 (G-1+G-2) · M-1 (TEACHER G-1) · M-2 (TEACHER G-2) · T-1 (TA G-1) · X-1 (tayinlanmagan) · V-1 (vaqtincha mentor, muddat ichida) | login/parol + ID + guruh xavfsiz kanal orqali |
| T7 | Biz | Admin-sahifa `<STAGING>/admin` ochiq (basic auth). **Dalil-manba:** «Sessiyalar» jadvali (dars, guruh, mentor, o'quvchi soni, javoblar, ekran, holat, natija) + «batafsil» (ishtirokchilar subject_id, javob/to'g'ri/urinish soni, oxirigacha yetdimi, natija-hodisa) — ismsiz | T1 dagi `admin` ✓ (sessiyalar-endpoint bilan) |

## 1. Bandlar (LMS §13) — kim bosadi, nima kutiladi, dalil

Har band uchun dalil: skrinshot (belgi/darvoza) + bizda log-satr yoki admin-yozuv. Token, JWT, `sapi_` hech qayerda ko'rinmasin.

| § | Band | Qadamlar | Kutilgan natija | Dalil |
|---|---|---|---|---|
| 1 | Eski JSX (`liveToken`siz) ishlaydi | Eski (modulgacha) `lms/` faylini test-materialga qo'yib O-1 ochadi | Dars ochiladi, PIN-darvoza, oq ekran yo'q | skrinshot |
| 2 | Faol o'quvchi JWT bilan ismsiz kiradi | M-1 CRM'dan darsni ochadi (sessiya) → O-1 LMS'da ochadi | O-1 da PIN/ism so'ralmaydi, belgi «Mentor: 1/N · <ism>» (ism LMS'dan) | O-1 skrinshot; bizda `lms: o'quvchi jonli darsga qo'shildi` |
| 3 | Muddati o'tgan JWT — oq ekransiz rad | LMS 13 soatlik eski token beradi (yoki bizning `mint --exp-past` staging'da) | Darvoza + «Avtomatik kirish bo'lmadi», PIN yo'li ochiq | skrinshot; log `token rad etildi reason=expired` |
| 4 | Noto'g'ri aud/iss/kid/imzo rad | Bizning `mint` bilan 4 xil buzuq token (staging) | 401 `invalid_token`, dars PIN-darvozada | log reason: aud/iss/kid/signature |
| 5 | Muzlatilgan o'quvchi JWT olmaydi | O-3 LMS'da darsni ochadi | LMS token bermaydi (403) → dars PIN-darvozada; bizga so'rov kelmaydi | O-3 skrinshot (LMS tomonida) |
| 6 | Mentor faqat o'z faol guruhiga | M-1 G-1 uchun ochadi; M-1 G-2 sahifasidan urinadi | G-1: sessiya (belgi «Kod: ###»); G-2: LMS token bermaydi | skrinshot ×2; bizda `lms_sessions.gid = G-1` |
| 7 | TA (`role_id=5`) `role=mentor`, faqat o'z guruhi | T-1 CRM'dan G-1 darsni ochadi | Sessiya ochiladi (yoki M-1 niki davom etsa — §6.6: TA boshqa o'qituvchi → eskisi auto_replaced, yangisi) | skrinshot; admin/DB: `teacher_id = T-1` |
| 8 | Vaqtincha mentor — muddat ichida | V-1 (START..END ichida) ochadi | Sessiya ochiladi | skrinshot |
| 9 | Tayinlanmagan/kurator/muddatdan tashqari — JWT yo'q | X-1 ochadi; V-1 muddatdan keyin | LMS token bermaydi → PIN-darvoza; bizga so'rov yo'q | skrinshot (LMS) |
| 10 | Sessiya `gid, teacher_id, lesson_id, jti` saqlaydi | (2) dan keyin | DB: `lms_sessions` qatorida to'rttasi bor | `select gid, teacher_id, lesson_id, mentor_jti from lms_sessions` (ID'lar, ism yo'q) |
| 11 | O'z guruhi o'quvchisi avto kiradi | O-2 ochadi | PIN'siz, ism LMS'dan | skrinshot |
| 12 | Boshqa guruh o'quvchisi kira olmaydi | O-4 (G-2) ochadi, G-1 da dars ketmoqda | O-4 ga G-1 sessiyasi berilmaydi: guruhida dars yo'q → **solo** (mustaqil) rejim, «📘 Mustaqil rejim» | skrinshot; DB: O-4 ning `lms_participants` da G-1 sessiyasi YO'Q |
| 13 | O'sha JWT takror — yangi sessiya yo'q; F5 yangi jti → o'sha sessiya | O-1 F5 bosadi; keyin boshqa brauzerdan (localStorage bo'sh) kiradi | Ikkalasida ham o'sha o'yinchi; `live_players` da O-1 bitta | admin/DB: players soni o'zgarmaydi |
| 14 | Istalgan JSX-material ochiladi; eski JSX buzilmaydi | Ikkinchi dars-faylini (masalan `HtmlLesson1`) test-materialga qo'yib ochish | Ishlaydi | skrinshot |
| 15 | Avto-kirish bo'lmasa PIN ishlaydi | Backend'ni 1 daqiqaga to'xtatamiz (staging) → O-1 ochadi | Darvoza + izoh; PIN bilan kiradi (mentor sessiyasi ochiq bo'lsa) | skrinshot |
| 16 | Yangi natija `201` | M-1 «Erkin qilish» bosadi | 5–10 s ichida `result_events.status = delivered`, `last_http_status = 201` | admin-sahifa skrinshoti; LMS tomonida yozuv |
| 17 | Aynan takror → `200` + `duplicate: true` | Admin'da «qayta yubor» | `last_http_status = 200`, `response.data.duplicate = true` | admin skrinshot |
| 18 | O'zgartirilgan takror → `409` | LMS bilan kelishib: o'sha `event_id` bilan boshqa payload (faqat staging, qo'lda curl) | `409`, bizda `manual_review` + Telegram | admin skrinshot |
| 19 | Qisman noto'g'ri guruh → to'g'rilari saqlanadi, rad etilganlar qaytadi | LMS test-bazasida O-2 ni «topilmaydigan» qiladi (yoki soxta ID) → «Erkin qilish» | `delivered`, `response.data.rejected_students` da o'sha ID | admin skrinshot |
| 20 | `GET /lesson-results/{event_id}` tasdiqlaydi | Admin: `GET /admin/api/results/<event_id>/verify` (server o'zi results-token bilan School API'dan so'raydi) | `remote.found = true`, `remote.data.event_id` mos | admin-javob skrinshoti (token ko'rinmaydi) |
| 21 | Frontend/URL/loglarda `sapi_`, JWT secret, JWT yo'q | Brauzer DevTools (Network/Application), Caddy va journald loglari, URL | Hech qayerda yo'q (Authorization sarlavhasi Caddy logidan o'chiriladi) | grep natijasi skrinshoti |

## 2. Bizning qo'shimcha 7 band

| # | Band | Qadamlar | Kutilgan |
|---|---|---|---|
| B1 | O-3 (muzlatilgan) tushunarli xato ko'radi | O-3 LMS'da ochadi | LMS'ning o'z xabari yoki bizning darvoza — oq ekran emas |
| B2 | O-5 (ikki guruh) — tanlov | M-1 G-1 da va M-2 G-2 da bir vaqtda dars ochadi → O-5 kiradi | «Qaysi darsga kirasiz?» ikki tugma (guruh nomi yo'q), tanlagach kiradi |
| B3 | `rejected_students` saqlanadi va ko'rinadi | (19) dan keyin | admin `results/:id` da `response` ichida |
| B4 | Rotatsiya `kid v1 + v2` | LMS ikkinchi secret bilan `kid=v2` token beradi (yoki staging'da biz `_NEXT` env) | Ikkala kid ham qabul |
| B5 | **Maqsad-sinov:** M-1 CRM'da bosadi (kod yo'q) → O-1 LMS'da bosadi (PIN yo'q, o'z ismi) → O-4 kira olmaydi → T-1 ochadi → X-1 ocha olmaydi | ketma-ket | Hammasi bir o'tirishda, 15 daqiqa |
| B6 | Natija-detallari: savollar (**onFinished** payload'ida `questions[]`, TZ §9, 2026-09-08 — School API emas) | O-1 bitta savolda avval noto'g'ri, keyin to'g'ri bosadi; dars tugaydi («Tamom») | LMS saqlagan onFinished JSON'da (Axadulla ko'rsatadi) `questions[]`: shu savolda 2 urinish, `correct=false`, `solved=true`; matnlar o'quvchi tilida; School API hodisasidagi `correct_answers` ekrandagi «N / jami» bilan bir xil |
| B7 | Natija-detallari: yutuqlar (onFinished `achievements[]`) | O-1 darsda kamida 2 yutuq oladi (masalan «Bullseye!» + «Level Up!») | onFinished JSON'da `achievements[]`: id kichik harfda, `name`/`title` darsdagi bilan bir xil, `earned_at` o'sib boradi |

## 3. Uyga-qaytish (bizning F-0903-01)

| # | Qadamlar | Kutilgan |
|---|---|---|
| U1 | (16) dan keyin O-1 8 soatdan keyin (yoki boshqa qurilmadan) darsni LMS'da ochadi | «👁 Ko'rish rejimi» — javoblari, natija ekrani ko'rinadi, «↻ Qaytadan boshlash» |
| U2 | O-1 «Qaytadan boshlash» | «📘 Mustaqil rejim», 0-ekran; oxirigacha o'tsa → solo natija `delivered` (rank null) |
| U3 | O-1 solo'da 3-ekranda yopadi, boshqa qurilmadan ochadi | O'sha 3-ekrandan davom (server-progress) |

## 4. Natija-jadval (to'ldiriladi)

### Pilot 2026-09-08 (staging 16f8284, InternetLesson, test-guruh gid 1070, mentor 165, o'quvchi 37069) — foydalanuvchi o'tkazdi, biz admin/sessiyalar orqali kuzatdik

| Band | Natija | Dalil |
|---|---|---|
| Mentor CRM'dan ochadi → jonli sessiya, PIN yo'q, «Kod: 782 030 · 1» belgisi | ✅ | skrinshot (mentor), admin: live gid=1070 t=165 |
| O'quvchi (guruh a'zosi) LMS'da ochadi → PIN so'ralmaydi, «Mentor: 1/22 · test», ergashadi | ✅ | skrinshot, admin: students=1, ekran 21/21 ga birga yetdi |
| Begona o'quvchi (guruhda emas) → «Mustaqil rejim», ismi JWT'dan | ✅ | skrinshot, admin: solo sessiya |
| Javoblar/urinishlar/yutuqlar serverda | ✅ | tafsilot: javob 5, to'g'ri 1, urinish 5, yutuq 4, oxirigacha ✓ |
| Natija School API'ga | ✅ | `sess_782030_20260908T125804Z` delivered, HTTP 201, LMS GET topildi (rank 1, students_accepted 1) |
| LMS'da tanga | ✅ | o'quvchi ekranida 🪙 40 (LMS `reward_status: pending_policy` → tanga berildi) |
| CodeStrike (kompilyator) darsda | ✅ | foydalanuvchi ko'rdi |
| Topilma | ⚠ | `end_reason=stale` (mentor tugatgan bo'lsa ham) — F-0908-01, tuzatildi (live end_session → 'mentor') |
| Ochiq | — | Axadulla javobi 2026-09-09 (`JAVOB_XABAR_AXADULLA_2026-09-09_UZ.md`): onFinished C tasdiqlandi, 37069 uchun real JSON-namuna keyin keladi (prod yozuv tekshirilgach); akkauntlar xavfsiz kanal orqali keladi → §5.2; F-0909-01 LMS tomonida tuzatiladi |


### 2026-09-09 — §5.1 (biz, akkauntsiz, staging 8d24e53)

| Band | Natija | Dalil |
|---|---|---|
| 4 qo'shimcha: `aud=x` · `iss=x` · `alg=none` · bo'sh Bearer → 401 | ✅ | `feedback/lms-sinov-2026-09-09/04-jwt-aud-iss-alg.txt` (10:38): 4/4 → 401, `invalid_token` / `unauthorized`; Dozzle `04-03-dozzle-token-rad-etildi.png` (13:02): 10:38:04 va 10:38:25 da `reason="aud"`, `"iss"`, `"alg"` — 6 satr, env=staging |
| 20 `GET /lesson-results/{event_id}` tasdiqlaydi | ✅ | `feedback/lms-sinov-2026-09-09/20-verify-sess_782030_20260908T125804Z.json`: `remote.found = true`, `event_id` mos, `students_accepted 1`, `rank 1`, `badges 3` |
| 17 Aynan takror → 200 + `duplicate: true` | ✅ | A-yo'l (qo'lda, serverdan tashqaridan, admin satridagi payload AYNAN — worker ham qayta yuborishda shu JSONB'dan oladi): `17-oldin-admin-row.json` (1 urinish, 201) · `17-oldin-school-get.json` · **`17-yubor-school-post.json`: HTTP 200, `accepted: true, duplicate: true`, students 1/1/0** (foydalanuvchi `!` bilan yurgizdi, 11:1x) · `17-keyin-school-get.json`: 9 maydon va `students` oldingi bilan BIR XIL, `received_at 13:07:35Z` o'zgarmadi → ikkinchi yozuv yo'q. Admin «qayta yubor» yetkazilganni yubormaydi — bu ataylab, o'zgartirilmaydi |
| 3 (biz-variant) Muddati o'tgan token → darvoza + PIN yo'li | ✅ | `scripts/smoke-lms.mjs` token-rejimi (`LMS_TOKEN`/`--token`, `--expect`, `--shot`; self-urug'i yo'q, kompilyator o'tkaziladi, faqat sinov-brauzerida CORS o'chiq). `mint-token --exp-past` (student 900001) → staging join 401 → darvoza: izoh «Avtomatik kirish bo'lmadi. Kod bilan kiring.», PIN-maydon ha, «Kodsiz, o'zim ko'raman» ha, oq ekran yo'q, konsol-xato yo'q. Skrinshot `03-expired-token-darvoza.png` (11:44). Salbiy sinov: `--expect "Mustaqil rejim"` → ✗ (tasdiq ishlaydi). Tokensiz regressiya ✓. Dozzle `04-03-dozzle-token-rad-etildi.png`: 11:44:06 va 11:44:25 da `reason="expired"` (ikkinchi satr — salbiy sinov) |
| 16 tayyorgarlik: eski (ko'prikgacha) JSX | 🟡 tayyor | Manba aniqlandi: `177ee1a` (2026-08-17, 8ececf6 dan oldingi oxirgi `lms/InternetLesson.jsx`), nusxa `16-eski-InternetLesson-177ee1a.jsx` (423 KB; `liveToken`/`lms/join` yo'q, API-host: https://go.coddycamp.uz). Smoke: tokensiz ✓ · LMS-token bilan ✓ — darvoza «Darsga qo'shilish», PIN-maydon ha, oq ekran yo'q, xato yo'q; «Kodsiz» yo'li yo'q (F-0903-01 dan oldingi, kutilgan). Skrinshot `16-eski-yigma-token-bilan.png`. Qoldi: foydalanuvchi shu faylni CRM test-materialiga qo'yadi → O-1 ochadi (§5.2 16-qadam) |
| 21 (bizning qism) Loglarda sir yo'q | ✅ | Dozzle, `dars-api-staging-api-1`, «searched all logs»: `sapi_` → No matches (`21-dozzle-sapi.png`, 13:01) · `eyJ` → No matches (`21-dozzle-eyJ.png`, 13:01). `token rad etildi` qidiruvida 11 satr — faqat `reqId`/`reason`, token yo'q. DevTools-Network qismi (Authorization faqat bizning API'ga) — O-1 bilan §5.2 da |
| Topilma F-0909-01 (LMS tomoni) | ✅ yopildi 13:50 | Sabab (Axadulla, `JAVOB_PARTNER_SAVOLLARI_2026-09-09.md`): MariaDB `DATETIME` zonasiz → Laravel `Asia/Tashkent` deb o'qib −5 soat. School API `main` da tuzatildi. Bizning GET (13:50): `started_at 2026-09-08T12:58:04Z`, `finished_at 13:07:35Z` — yuborilgan bilan bir xil. Biz `Z` bilan davom etamiz, o'zgarish yo'q. §5.2 10b endi nazorat-tekshiruv |

| Band | Holat (✅/❌) | Sana | Dalil (fayl/havola) | Izoh |
|---|---|---|---|---|
| 1 … 21 | | | | |
| B1 … B5 | | | | |
| U1 … U3 | | | | |

**Qabul mezoni:** 21 + 5 + 3 bandning hammasi ✅, `manual_review` da sinovga aloqasiz hodisa yo'q, loglarda sir yo'q (21).
**Prod'ga o'tish:** shu protokol prod'da 2, 11, 13, 16, 17, 21 bandlari bilan qisqa takrorlanadi (haqiqiy bitta guruh, mentor roziligi bilan).

### 2026-09-10 — foydalanuvchi sinovi (G-2 1072, M-2 + O-?): topilma F-0910-01

| Band | Natija | Dalil |
|---|---|---|
| **F-0910-01** o'quvchi mentordan OLDIN kirdi → «Mustaqil rejim»; mentor keyin ochdi (kod 088114) → o'quvchi ulanmadi, mentor belgisida 👥 0 | ❌ → ✅ tuzatildi va **qayta sinovda o'tdi (14:15)** | Skrinshotlar (foydalanuvchi, LMS o'quvchi-tab + preview mentor-tab + guruh 1072); `feedback/lms-sinov-2026-09-10/watch.log` 10:01:09 `YANGI solo … student 31347`; `lms-watch --once` 12:01: `live live … gid 1072 · mentor 240 · kod 088114 · o'quvchi 0` + solo `cab51064` hali faol. Sabab: `join-service.js` 0-qoida «faol solo → har doim davom» — 1-qadam (guruhda jonli sessiya) faol solo'da ishlamagan; klient solo'da qayta so'ramagan. Tuzatish: server (solo → avval jonli qidiruv → `live_started`, 0007 migratsiya) + klient (20 s jim `join`, «🎉 Mentor darsni boshladi» belgisi). Dalil: int 69/69, E2E 18/18 (yangi qadam 19.7 s), qayta sinov §5.2 6b. **Qayta sinov 14:15 (foydalanuvchi, staging 3f75129, yangi yig'ma CRM'da):** M-2 kod 956510 → o'quvchi (Nigora) F5'siz «Mentor: 1 / 22 · Nigora Rakhmanova», mentor belgisida 👥 1 (skrinshotlar chatda); `lms-watch --once` 14:16: solo `37b70787` **`ended (live_started)`**, jonli `6b4192f0` gid 1072 mentor 240 o'quvchi 1 |

### 2026-09-10 14:15–15:25 — §5.2 foydalanuvchi bilan (G-2 1072, M-2 = mentor 240, o'quvchilar Nigora 31352 / Sherzod 31422, staging 3f75129)

| Qadam | Natija | Dalil |
|---|---|---|
| 6b solo→jonli (F-0910-01) | ✅ | yuqorida |
| 3 F5 / inkognito | ✅ (foydalanuvchi «done») | mentor belgisida 👥 1 qoldi |
| 4 ikkinchi o'quvchi | ✅ | watch 14:24 `student 31422: javob 2 (to'g'ri 2)`; ikkalasi mentorni ergashdi (skrinshot «Mentor: 2 / 22 · Sherzod Rasulov») |
| 9 javoblar + yutuq + oxirigacha + arena | ✅ | Nigora javob 5 (to'g'ri 0) urinish 5 yutuq 3, «oxiriga yetdi ✓»; arena podium Nigora 2582 ball 3/12, Sherzod 0/12 (skrinshot) |
| 10 «Erkin qilish» → natija | ✅ | 14:27:43 `holat ended (mentor) · natija delivered`; `sess_956510_20260910T091454Z` HTTP 201, o'quvchi 2 |
| 10b verify (LMS'da topildi) | ✅ | `sinov-956510-verify-*.json`: Sherzod 1-o'rin (2/2), Nigora 2-o'rin (0/5, nishon 3); vaqtlar `Z` |
| 13 ko'rish rejimi | ✅ (server) | HAR-2: 10:22:29 `join` → `review` (jonli urinish tugagach) |
| 14 «Qaytadan boshlash» → solo | ✅ | 14:27:55 `YANGI solo` 31352, 14:28:23 31422 (foydalanuvchi tasdig'i kutilmoqda: tugmani o'zi bosganmi) |
| U2 solo oxirigacha | ✅ | 15:20–15:22 solo 140613: javob 5 (to'g'ri 1) urinish 14 yutuq 4 → `ended (solo_done)`, `attempt completed`; natija-hodisa YO'Q — **Qoida 3** (jonli natijadan tanga olingan, `already_rewarded`) — kutilgan |
| Klient 20 s qayta-so'rov (staging'da) | ✅ | HAR-2: `/lms/join` 10:20:40, :21:00, :21:20, :21:40, :22:00 → `solo` (aynan 20 s) |
| B6/B7 onFinished JSON (brauzerdan) | ✅ | LMS front uni **`POST go.coddycamp.uz/app/index.php?action=question_try`** `{question_id:16594, answer:"<JSON>"}` bilan yuboradi (LMS 200, `student_id 31352`), keyin `next_lesson_access {completed_lesson_id:2848}`. Fayl: `feedback/lms-sinov-2026-09-10/onfinished-nigora-solo-140613.json` (solo, 5 savol, 14 urinish, 4 yutuq). **F-0909-02 ✅** (`elapsed_ms` 786…4335 har xil, `at` har xil), **F-0909-03 ✅** (`solved` = oxir-oqibat to'g'ri, `correct` = birinchi urinish; correctAnswers 1, scorePercent 20). HAR'lar o'chirildi (tokenlar) |
| HAR-1 (jonli) | 🟡 | DevTools yozuvi 09:26:45 da to'xtagan (record o'chgan) — «Tamom» so'rovi tushmadi; xulosa `oquvchi-nigora-har-xulosa.md`. Jonli onFinished JSON — Axadulla bazasidan (question_try, 31352, ~09:26Z) yoki keyingi jonli sinovda |
| Ochiq | ❓ | «Tamom»dan keyin LMS 2849-darsga o'tdi (`lesson_runner/26d4ae2d…jsx`, `join internet-01-v18 → review`) va `robo-error.png` yuklandi — foydalanuvchidan: 2849 qaysi fayl, ekranda xato ko'rindimi? |

**20:15 — CRM test-materiali uchun yig'malar tayyor** (`feedback/lms-sinov-2026-09-10/CRM-yuklash/`, foydalanuvchi yuklaydi):
`1-Internet-YANGI-2026-09-10.jsx` (arena onFinished'da + 20 s qayta-so'rov; CRM'dagi hozirgi nusxa arena qo'shilishidan oldingi) ·
`2-HtmlLesson1-YANGI-2026-09-10.jsx` (15-qadam, staging manzili) · `3-Internet-ESKI-177ee1a.jsx` (16-qadam). Belgilar `OQING.md` da.
Keyingi jonli sinovda o'quvchi brauzerida DevTools → Network → **Preserve log** — HAR-1 (jonli onFinished) shu yerdan olinadi.

### 2026-09-11 — PROD DEPLOY (biz; foydalanuvchi GitLab'da deploy tugmasini bosdi)

| Qadam | Dalil | Hukm |
|---|---|---|
| Darvozalar (boshidan) | unit 52/52 · int 69/70 · E2E LMS 18/18 · jsx-lint 0 · esbuild 156/156 · smoke 109/109 · vite build ✓ | ✅ |
| Staging qabul (eski kod) | `staging-check` 19 ✓ 0 ✗ (3f751291) | ✅ |
| GitHub | `fe40820` push, ishchi daraxt toza | ✅ |
| GitLab `main` | `8333ddd → 3f75129` ff-merge; prod deploy QO'LDA bosildi | ✅ |
| Prod deploy #1 | `0.1.0+3f751291`, ~30 s 503, migratsiya 6 → **7/7** | ✅ |
| Prod qabul (to'liq) | 19 ✓ 0 ✗ — mentor-oqim PIN 471933 (ETag/304, heartbeat, yopish), School API 161 ms, p50 123 ms | ✅ |
| F-0911-01 | prodda 25 soat osilgan o'quvchisiz sessiya → `closeOrphanLmsSessionsJob` (int +1) | tuzatildi |
| F-0911-02 | 0 to'g'ri yechgan `top_2` olgan edi (10-sentabr dalili) → rank faqat ≥1 to'g'ri bilan (unit +2) | tuzatildi |
| Prod deploy #2 | `c04a84b` (staging avto → 19 ✓ → main ff-merge) | pastda |

**Ochiq qolgani:** CRM'ga 90 fayl (foydalanuvchi) · sirlar rotatsiyasi (Axadulla, prod'dan keyin kelishuv bilan) ·
§5.2/§5.3 qolgan bandlari (cutoverdan keyin qarori) · M7 13 dars.

## 5. O'tkazish-tartibi — qolgan bandlar (2026-09-09 tuzildi)

**Pilotdan (2026-09-08) yopilgan:** 2, 6 (G-1 qismi), 10, 12, 16. **Kutilmoqda:** B6/B7 (Axadulla onFinished JSON).
**Ma'lum ID'lar:** G-1 = gid 1070 · M-1 = teacher 165 · O-1 = 37069 · pilot-sessiya `804836d7…`, natija `sess_782030_20260908T125804Z` · begona o'quvchi solo-sessiyasi `d82426f8…` (hali `live`).
**Kerak (Axadulla, S-1):** O-2 (G-1), O-3 (G-1 muzlatilgan), O-4 (G-2), O-5 (G-1+G-2), M-2 (TEACHER G-2), T-1 (TA G-1), X-1 (tayinlanmagan), V-1 (vaqtincha mentor G-1, START..END). Guruh G-2 ning gid'i.

**Dalil-oqimi (har seansda birinchi buyruq, biz):**
```
cd server && node --env-file=.env.deploy.staging tools/lms-watch.mjs https://staging-dars-api.coddycamp.uz --out ../feedback/lms-sinov-2026-09-09/watch.log
```
Har o'zgarish (yangi sessiya, ishtirokchi, javob/urinish/yutuq, ekran, holat, natija HTTP) vaqt-tamg'asi bilan satr bo'ladi — §4 jadvalining «Dalil» ustuni shu satrlar + foydalanuvchi skrinshotlari (o'sha papkaga).

### 5.1 Hozir, akkauntsiz — biz (≈20 daqiqa)

| Band | Qanday | Dalil |
|---|---|---|
| 4 | `staging-check` `jwt_reject` allaqachon: muddati o'tgan · begona secret · noma'lum kid → 401 (2026-09-09 09:09 ✓). Qo'shimcha: `mint --aud x`, `mint --iss x` → `POST /api/v1/lms/join` → 401 `invalid_token` | staging-check satri; Dozzle `token rad etildi reason=aud/iss` |
| 17 | admin → pilot natijasi → «qayta yubor» (`POST /admin/api/results/<id>/requeue`) → worker → School API `200` + `duplicate: true` | admin `results/<id>`: `last_http_status 200`, `response.data.duplicate` |
| 20 | `GET /admin/api/results/<id>/verify` → `remote.found = true`, `remote.data.event_id` mos | admin-javob (token ko'rinmaydi) |
| 21 (bizning qism) | Dozzle'da `sapi_` va `eyJ` qidiruv → 0 satr; brauzer DevTools → Network: `Authorization` faqat bizning API'ga, URL'da token yo'q | qidiruv-skrinshoti |
| 3 (biz-variant) | `mint --exp-past` tokeni bilan LMS-yig'mani ochish: harness `scripts/smoke-lms.mjs` token-rejimi (`LMS_TOKEN`, 2026-09-09 qo'shildi) → darvoza «Avtomatik kirish bo'lmadi», PIN yo'li ochiq | skrinshot; log `reason=expired` |

### 5.2 Bir o'tirish — foydalanuvchi akkauntlar bilan, biz `lms-watch` bilan (≈30 daqiqa, B5 kengaytirilgan)

Tartib muhim: **T-1 va V-1 M-1 sessiyasini almashtiradi (§6.6 auto_replaced)** — ular «Erkin qilish»dan KEYIN.

**Akkauntlar keldi (2026-09-09 14:40).** Parollar hujjatga yozilmaydi (xavfsiz kanal). Yangi guruhlar:
**G-1 = gid 1071** · **G-2 = gid 1072** (pilotdagi 1070 — eski test-guruh, tegilmaydi).

| Belgi | Akkaunt (login) | Rol / guruh | LMS ID |
|---|---|---|---|
| M-1 | `+998800850202` | O'qituvchi, G-1 | watch'dan aniqlanadi |
| M-2 | `+998800850303` | O'qituvchi 2, G-2 | — |
| T-1 | `+998800850101` | TA, G-1 | — |
| O-1 | `998945848654` | o'quvchi, G-1 faol | — |
| O-3 | `998935885045` | o'quvchi, G-1 **muzlatilgan** | — |
| O-4 | `998504595975` | o'quvchi, G-2 faol | — |
| O-5 | `998950145778` | o'quvchi, **G-1 + G-2** | — |

**O'zgarish:** alohida O-2 berilmadi → 4-qadamda (band 11, «ikkinchi o'quvchi») **O-5** ishlatiladi
(o'sha paytda G-2 darsi ochilmagan bo'lsa, O-5 to'g'ri G-1 ga tushadi). B2 (ikki dars bir vaqtda) shu sababli
oxirgi qadamga ko'chdi. **Berilmagan:** X-1 (guruhsiz o'quvchi → band 9a) va V-1 (vaqtincha mentor → band 8, 9b)
— IT-jamoadan qayta so'raladi, bu ikki band ochiq qoladi.

| # | Kim | Nima | Kutilgan (watch'da) | Band |
|---|---|---|---|---|
| 1 | M-1 | CRM'dan G-1 darsni ochadi | `YANGI live … gid 1070 · mentor 165`; belgi «Kod: ###» | 6a |
| 2 | O-1 | LMS'da ochadi | `qo'shildi student 37069`, PIN so'ralmaydi, ism LMS'dan | 2 |
| 3 | O-1 | F5; keyin inkognito-oynada qayta ochadi | `player` soni o'zgarmaydi; ikkalasida o'sha o'yinchi | 13 |
| 4 | O-2 | LMS'da ochadi | `qo'shildi student <O-2>`, PIN yo'q | 11 |
| 5 | O-3 | (muzlatilgan) ochadi | LMS token bermaydi → **watch'da hech narsa yo'q**; ekranda tushunarli xabar, oq ekran emas | 5, B1 |
| 6 | O-4 | (G-2) ochadi | `YANGI solo …`, «📘 Mustaqil rejim»; G-1 sessiyasida ko'rinmaydi | 12 (takror) |
| 6b | M-2 | O-4 darsni OCHIB TURGANDA (6-qadam) M-2 CRM'dan G-2 darsni ochadi — O-4 F5 bosmaydi | ≤25 s ichida O-4 belgisi «🎉 Mentor darsni boshladi — jonli darsga ulandingiz» → 8 s dan keyin «👨‍🏫 Mentor: 1 / 22»; M-2 belgisida 👥 1; watch: O-4 solo `ended (live_started)`, `qo'shildi student` M-2 sessiyasida. **Shart:** CRM test-materialida 2026-09-10 yig'masi (`grep LMS_SOLO_RECHECK_MS`) | **F-0910-01** |
| 7 | X-1 | ochadi | LMS token bermaydi → PIN-darvoza; watch'da yo'q | 9a |
| 8 | M-1 | G-2 sahifasidan urinadi | LMS token bermaydi; G-1 sessiyasi davom etadi | 6b |
| 9 | O-1 | bitta savolda avval noto'g'ri, keyin to'g'ri; 2+ yutuq; oxirigacha | `urinish` o'sadi, `yutuq ≥2`, `oxiriga yetdi ✓` | B6, B7 (JSON — Axadulla) |
| 10 | M-1 | «Erkin qilish» | `holat ended (mentor)` → `natija … delivered · HTTP 201` | 16 |
| 10b | Biz | admin `results/<id>/verify` | `remote.data.started_at/finished_at` = biz yuborgan `Z` vaqt (F-0909-01 LMS tuzatuvi tekshiruvi, Axadulla 2026-09-09 §1) | F-0909-01 |
| 11 | T-1 | CRM'dan G-1 ochadi | `YANGI live … mentor <T-1>`; eskisi `auto_replaced` | 7 |
| 12 | V-1 | (muddat ichida) ochadi | `YANGI live … mentor <V-1>` | 8 |
| 13 | O-1 | darsni LMS'da qayta ochadi (10-qadamdan keyin) | «👁 Ko'rish rejimi», javoblari ko'rinadi | U1 |
| 14 | O-1 | «↻ Qaytadan boshlash» → 3-ekranda yopadi → boshqa qurilma/inkognito | `YANGI solo`; 3-ekrandan davom | U2, U3 |
| 15 | Foydalanuvchi | CRM test-materialiga ikkinchi dars (`lms/…HtmlLesson1…`) → O-1 ochadi | ishlaydi | 14 |
| 16 | Foydalanuvchi | CRM'ga eski (ko'prikgacha) JSX → O-1 ochadi. Fayl tayyor: `feedback/lms-sinov-2026-09-09/16-eski-InternetLesson-177ee1a.jsx` | PIN-darvoza, oq ekran yo'q (lokal smoke bilan oldindan tasdiqlandi, 2026-09-09) | 1 |

### 5.3 LMS-jamoasi bilan kelishib (alohida vaqt — Axadulla 2026-09-09 §5: to'rt band uchun alohida vaqt kelishiladi, rozilik bor)

| Band | Kim bilan | Nima |
|---|---|---|
| 15 | Kristina (yoki biz) | staging api 1 daqiqa to'xtaydi → O-1 ochadi → darvoza + PIN. Kristinasiz variant: Chrome DevTools → Network → «Block request URL» `*/api/v1/lms/*` |
| 3 (LMS-variant) | Axadulla | LMS 13 soatlik eski token beradi (yoki O-1 sahifasi 12+ soat ochiq turib F5) |
| 9b | Axadulla | V-1 ning END sanasini o'tmishga qo'yadi → V-1 ochadi → token yo'q |
| 18 | Axadulla | o'sha `event_id` bilan boshqa payload → 409; bizda `manual_review` + Telegram (0.4 tayyor bo'lsa) |
| 19, B3 | Axadulla | O-2 ni LMS test-bazasida «topilmaydigan» qiladi → «Erkin qilish» → `rejected_students` |
| B2 | M-1 + M-2 | ikkala guruhda bir vaqtda dars → O-5 «Qaysi darsga kirasiz?» |
| B4 | Axadulla | rotatsiya (`SIRLAR_ROTATSIYASI_UZ.md` §5 xat) → `kid v2` → `jwt_next` ✓ |

## 6. Axadulla javobi 2026-09-09 — kod bilan solishtiruv (biz)

Manba: `JAVOB_XABAR_AXADULLA_2026-09-09_UZ.md` (11:40). Har band bizning kodga qarab tekshirildi:

| Javob-bandi | Bizda | Hukm |
|---|---|---|
| §1 vaqt zonasi — LMS tomonida tuzatiladi, biz `Z` bilan davom etamiz | `resultDetails.iso()` va payload `Z` bilan | ✅ o'zgarish yo'q; tekshiruv §5.2 10b |
| §2 onFinished C: `lang`, `questions[]`, `achievements[]` yuqori darajada, eski maydonlar o'zgarmaydi | `src/live/resultDetails.js` → `buildResultDetails`, dars payload'iga `...` bilan qo'shiladi | ✅ |
| §2 tekshirish-ro'yxati: `question_id`, `attempts[]` raqamlari, `correct`/`solved`, `elapsed_ms`/`at`, `achievements[].earned_at` | `question_id`, `attempts[].n`, `correct`, `solved`, `elapsed_ms`, `at` (ISO Z), `earned_at` | ✅ hammasi bor |
| §3-2 `question`, `options[]`, `correct_answer` kerak | `q.question`, `q.options`, `q.correct_option`, `q.correct_answer` | ✅ |
| §3-3 faqat `kind="test"`, arena yo'q | `kind: 'test'`, faqat `meta.scored` ekranlar; arena kirmaydi | ✅ |
| §3-4 live: bitta urinish, ball birinchi urinish | invariant `attempts[0].correct = correct`; darsda `correct: firstCorrectRef.current`, `solved: isCorrect` (InternetLesson.jsx:355) | ✅ |
| §3-5 limitlar 200/10/6/20/300 | `LIM = { questions: 200, attempts: 10, options: 6, text: 300, achievements: 20 }` | ✅ bir xil |
| §3-7 detallar coin'ga ta'sir qilmaydi; lesson-runner coin/point 0 | bizga tegmaydi; pilotda 🪙 40 School API `lesson-results` orqali | ℹ️ eslatma |
| «`correctAnswers` = birinchi urinishda to'g'ri» | `correctAnswers = scoredAnswers.filter(a => a.correct).length`, `a.correct` = birinchi urinish | ✅ |
| §5 yopishdan oldin: 37069 saqlangan onFinished JSON ↔ dars ekranidagi natija | Namuna keldi (`DARS_ONFINISHED_37069_SAMPLE_2026-09-08.json`, 13:22): 5 savol (s4/s5b/s9/s12/s15) · 1 to'g'ri · 5 urinish · 4 yutuq (firstwin/packet/router/graduate) — `B6-pilot-sessiya-admin.json` bilan **mos**. Uch topilma → §7 (F-0909-02/03 biz, F-0909-04 LMS) | ✅ B6/B7 mos; §7 |

**Kontrakt bo'yicha kod-o'zgarish yo'q**; namuna ochgan 2 ta bizning nuqson §7 da tuzatildi. Kutilayotgan: qo'shma sinov vaqti (akkauntlar keldi — 14:00).

## 7. Pilot JSON-namunasi topilmalari (Axadulla, `JAVOB_PARTNER_SAVOLLARI_2026-09-09.md`) — 2026-09-09

| F-ID | Topilma | Sabab (tashxis) | Yechim | Dalil |
|---|---|---|---|---|
| **F-0909-02** | 5 urinishda `elapsed_ms = 0`, hamma `at` = 13:07:00Z; 4 yutuqning `earned_at` bir xil (13:04:52Z) | Tarix (`attemptsByLesson`, `earnedAtByLesson`) faqat JS-xotirada; o'quvchi 13:04:52 da sahifani yangilagan (F5-sinovi) → tarix yo'qolgan → tugashda zaxira-yo'l (1 urinish, 0 ms, tugash vaqti); yutuqlar saqlovdan tiklanib bir vaqtda «birinchi ko'rindi» | `src/live/resultDetails.js`: tarix `localStorage` `ccDetails:<darsId>` ga ham yoziladi, `load()` bir marta tiklaydi, `resetResultDetails` saqlovni ham tozalaydi. Zaxira-yo'l qoldi (boshqa qurilma). Bitta umumiy fayl, 97 dars tegilmagan | test 5/5; brauzer: `F-0909-02-03-brauzer-tekshiruv.txt` (2468/3009 ms, F5 dan keyin turibdi) |
| **F-0909-03** | 4 noto'g'ri javobda `solved = true` | Jonli darsda bitta urinish: dars `solved: true` = «savol yopildi»; LMS `solved` = «oxirida to'g'riga yetdi» — ikki ma'no to'qnashgan | `solved = attempts.some(correct)` (server `result-builder.js:356/411` qoidasi bilan bir xil); jonli xato → `false`; tarix yo'q + birinchi xato + oxirida to'g'ri → 2 urinish (birinchisi `option: -1`) | test «F-0909-03 …» va «zaxira-yo'l …» |
| **F-0909-04** | `→` belgisi `?` bo'lib kelgan (s15 variantlari) | LMS tomoni: manba va CRM yig'masida `→` (U+2192) 4 joyda; front obyektni JS'dan oladi; namunada `—` (U+2014, cp1252'da bor) saqlangan, `→` (cp1252'da yo'q) yo'qolgan → MariaDB ustun/ulanish `latin1/cp1252` | Bizda o'zgarish yo'q; Axadulla'ga `utf8mb4` so'rovi (`javob-axadulla-2026-09-09-2.md` §4) | `grep -c 'Brauzer → DNS → Server → Ekran' lms/InternetLesson.jsx` = 4 |

### 7.1 Axadulla javobi №3 (2026-09-09, ~15:00) — Unicode tuzatuvi deploy qilindi

LMS tomonida saqlash tuzatildi: `student_question_log.answer` ustunida `→` kabi belgilar yo'qolmaydi.
API payload formati o'zgarmadi, **bizda o'zgarish yo'q** (F-0909-04 yopilishga tayyor, kechki sinovda tasdiqlanadi).

**Ular so'ragan tartib:** yangi yig'ma CRM test-materialiga qo'yiladi → **bitta to'liq test darsi** o'tkaziladi →
ularga yuboriladi: (1) yangi `event_id`, (2) biz yuborgan `onFinished` JSON, (3) o'quvchi ID.
Ular tekshiradi: `elapsed_ms` · har urinishning `at` · `achievements[].earned_at` · `solved` · `→` va boshqa Unicode.
Eski yozuvlardagi `?` tiklanmaydi — tekshiruv faqat yangi natija bilan.

**Shart (kechki §5.2 ga bog'landi):**
- **T5 majburiy** — CRM test-materiali **yangi yig'ma** bilan almashtirilmasa, F-0909-02/03 tuzatishlari sinovda bo'lmaydi
  va Axadulla tekshiradigan 4 maydonning hammasi yana eski natija beradi.
- 9-qadamda o'quvchi **s15** savoliga javob bersin (variantlarida `Brauzer → DNS → Server → Ekran` — Unicode dalili shu yerdan chiqadi),
  bitta savolda avval xato→keyin to'g'ri (`solved` dalili), 2+ yutuq, oxirigacha (`earned_at`, `elapsed_ms` dalillari).
- 10-qadamdan keyin biz admin'dan uch narsani yig'amiz: `event_id` (`results/<id>`), yuborilgan `onFinished` JSON, `student_id`.

### 7.2 Dalil yig'ish tartibi (2026-09-09 tayyorlandi) — `server/tools/sinov-natija.mjs`

**Muhim farq:** `onFinished` JSON **serverda saqlanmaydi**. Axadulla C-variantni tanlagan — detallar
(`questions`/`achievements`) o'quvchi brauzeridan to'g'ridan-to'g'ri LMS frontiga boradi
(staging `features.result_details = off` — ataylab shunday). Serverda faqat School API payload'i
(`result_events.payload`: rank/badges/answered) turadi. Shuning uchun ikki manba ikki xil olinadi:

| Nima | Qayerdan | Qanday |
|---|---|---|
| `event_id`, tanga-yetkazish, LMS tasdig'i | admin API | skript o'zi oladi |
| **`onFinished` JSON** | **o'quvchi brauzeri** | dars boshlashdan oldin DevTools → Network → **Preserve log** yoqiladi; dars tugagach LMS frontining so'rovini topib, **Request payload** ni faylga saqlanadi |

**Zaxira yo'l:** agar so'rov qo'lga tushmasa — LMS jamoasi o'z bazasidan (`student_question_log`) chiqarib bera oladi.

**Buyruq (dars tugagach, `server/` ichidan):**
```
node --env-file=.env.deploy.staging tools/sinov-natija.mjs https://staging-dars-api.coddycamp.uz \
  --gid 1071 --onfinished <brauzerdan-olingan.json>
```
Chiqishi `feedback/lms-sinov-2026-09-09/` ga: `sinov-<pin>-sessiya.json` · `-schoolapi-<event>.json` ·
`-verify-<event>.json` · `-onFinished.json` · `-xabar-axadulla.md` (yuborishga tayyor matn).

**O'z-o'zini tekshiruv** (Axadulla tekshiradigan 5 maydon) — hammasi ✓ bo'lmasa xabar yuborilmaydi:
`elapsed_ms > 0` · har xil `at` · har xil `earned_at` · kamida bitta `solved:false` · matnlarda `→` bor.
Pilot namunasida (2026-09-08) beshtasi ham ✗ edi — skript ularni qayta topib tasdiqladi (regressiya-nazorat).

**Yig'ma:** `lms/InternetLesson.jsx` staging manzili bilan qayta yig'ildi (14:20): `ccDetails` bor, `→` 4, prod-manzil 0, smoke tokensiz ✓ va muddati o'tgan token ✓, oxlint toza. **Foydalanuvchi:** CRM test-materialini shu yangi nusxa bilan almashtiradi (T5). **Qolgan 90+ yig'ma** eski `resultDetails` bilan — cutover-mashqdagi to'liq qayta yig'ishda yangilanadi (KATTA_TOZALASH).

## 8. Kutish-ro'yxati — kimdan nima, kelganda nima bo'ladi (2026-09-10 21:00, shafof)

Bizning tomonda buyruqsiz qiladigan ish QOLMADI: kod, testlar, yig'malar, mashq — hammasi o'tgan. Qolgani boshqalarning qo'lida:

| # | Nima | Kimdan | Aniq nima kutiladi | Kelganda biz nima qilamiz | Bizda tayyor |
|---|---|---|---|---|---|
| 1 | ~~Batafsil analitika (A-variant) + arena~~ **✅ 2026-09-15 QABUL** (§9) — endi kutiladigani: «staging qabul qiladi» signali → Kristina staging `RESULT_DETAILS=a` → §5 qo'shma sinov | Axadulla | 4 savolga javob (`feedback/lms-sinov-2026-09-10/xabar-axadulla-2026-09-10-arena.md`); 09-08 da bir marta rad etilgan — «yo'q» ham ehtimol | «ha»: Kristina'ga `RESULT_DETAILS=a` (staging) → 1 test-dars → verify → prod env. «yo'q»: hech narsa o'zgarmaydi, arena onFinished orqali ketaveradi | server kodi, 97 dars `arenaBank`, unit/int |
| 2 | Jonli darsning onFinished JSON dalili | Axadulla (bazadan: `question_try`, 31352, ~09:26Z) yoki keyingi jonli sinov (Preserve log) | payload fayli | `server/tools/sinov-natija.mjs --onfinished` bilan tekshiruv, B6/B7 jonli qatori | vosita tayyor |
| 3 | X-1 (guruhsiz o'quvchi) va V-1 (vaqtinchalik mentor) akkauntlari | IT-jamoa (so'rov №2 `feedback/lms-sinov-2026-09-09/akkaunt-sorovi-2-X1-V1.md`) | 2 login | §5.2 7, 8, 12-qadamlar (bandlar 9a, 6b, 8) | lms-watch, protokol |
| 4 | CRM test-materialini yangilash | Foydalanuvchi | `CRM-yuklash/1-Internet-YANGI-2026-09-10.jsx` CRM'ga; `2-HtmlLesson1-…` 15-qadam uchun | keyingi jonli sinovda arena onFinished'da ko'rinadi | papka + `OQING.md` |
| 5 | §5.2 qolgan qadamlar: 5 (O-3 muzlatilgan) · 11 (T-1 auto_replaced) · 15 (ikkinchi dars) · 16 (eski JSX) · B2 (ikki guruh, O-5) | Foydalanuvchi (akkauntlar bor), biz lms-watch bilan | bir o'tirish ≈20 daqiqa | natija-jadvalga dalil bilan yozamiz | hammasi tayyor |
| 6 | Bugungi ikki ochiq savol: 2849-dars / `robo-error.png`; 14-qadamda «Qaytadan boshlash»ni kim bosdi | Foydalanuvchi | javob | jadvalga yozamiz | — |
| 7 | §5.3 bandlari: 3 (eski token) · 9b (V-1 END) · 18 (takror 409) · 19/B3 (rejected_students) · 15 (api 1 daqiqa to'xtaydi — Kristina) | Axadulla + Kristina | alohida vaqt kelishuvi (roziligi bor) | birga o'tkazamiz, dalil yig'amiz | server tomoni int-testlarda yopilgan |
| 8 | Sirlar rotatsiyasi (JWT kid v2 + `sapi_`) — prod'dan OLDIN shart (sirlar ochiq chatda kelgan) | Axadulla (`SIRLAR_ROTATSIYASI_UZ.md` §5 xati) | yangi kalitlar xavfsiz kanal orqali | `jwt_next` → almashtirish → eskisini o'chirish (runbook) | `jwt_next` kodda |
| 9 | Birinchi zaxira-dump dalili (TZ §6) | Kristina / foydalanuvchi Dozzle'dan | backup-konteyner logi | `STAGING_QABUL_UZ.md` ga yozamiz | — |
| 10 | ~~Commit va push~~ | — | — | ✅ 2026-09-11: `fe40820` + `5c4dd5b`, GitHub push, daraxt toza | — |
| 11 | Prod cutover | **server qismi ✅ 2026-09-11** (`3f751291` → `c04a84b`, qabul 19 ✓) | qolgani: 90 fayl CRM'ga | `cutover-mashq --url prod --out lms --smoke` → CRM 90 fayl → Vercel | mashq 90/90 |
| 12 | M7: 13 dars jonli-modulsiz (v16) | Foydalanuvchi qarori (qachon) | — | darslik-jonli konveyeri | birinchi cutover'ga shart emas |
| 13 | Uyga vazifa paketlari (42 tex + 17 PM) LMS'ga | Foydalanuvchi ko'rigi | — | yuklash ro'yxati | darvozalar o'tgan |

## 9. Axadulla javobi 2026-09-15 (`JAVOB_DARS_PLATFORM_2026-09-15_UZ.md`) ↔ kod — 2026-09-16 solishtiruv (biz)

Og'zaki qo'shimcha (foydalanuvchi orqali): **MVP uchun batafsil natijani hozircha `onFinished`dan oladi**; «har bitta savolni sinab ko'rdingizmi?».

| Uning bandi | Bizda | Holat |
|---|---|---|
| §1 `correct_answers = 0` → `rank null`, `top_N` yo'q | `assignRanks(..., { requireCorrect: true })` (F-0911-02) | ✅ |
| §2-1 A-variant: `lang`, `questions[]`, `achievements[]` `lesson-results` ichida | `result-builder.js buildStudentDetails`, `RESULT_DETAILS=a` | ✅ kod; **bayroq `off`** — «tayyorlik tasdig'imizgacha yoqmang» |
| §2-2 arena `kind: "arena"`, ballga kirmaydi | `isArenaQ` → `kind`, `lessonQuestions` arena'siz | ✅ |
| §2-4 ball `total_questions`/`correct_answers`dan | payload shu maydonlar; **F-0916-03**: 38/70 darsda `total_questions` ishtirok-kalitlar (`practice: -1`…) hisobiga ×2 edi → `isParticipationKey` bilan tuzatildi, unit 54/54, int 76/76, `scripts/lint-keys.mjs` 97/97 | ✅ tuzatildi 16.09 |
| §3 `lang` majburiy (questions/achievements bilan) | detallar bo'lsa `lang` doim beriladi (`uz`/`ru`) | ✅ |
| §3 limitlar 200 / 10 / 20, ≤ 1 MB | `DETAILS_LIMITS` bir xil; oshsa detallar tashlanadi, asosiy ketadi (`finalizePayload`) | ✅ |
| §3 `kind: test` soni == `answered`, to'g'rilari == `correct_answers` | `validateStudentDetails` (`answered≠questions`, `correct≠questions`) — buzilsa detallar tashlanadi | ✅ |
| §3 `correct` = birinchi urinish; `solved` = kamida bitta to'g'ri | `attempts[0].correct === correct`, `solved === some(correct)` (server + klient bir xil) | ✅ |
| §3 jonlida har savolga aynan bitta urinish | `live_answers UNIQUE(player, screen)`; klient oneShot; **E2E 22/22** (jonli: s4 1 urinish, quiz-0 1 urinish) | ✅ |
| §3 `at`/`earned_at` UTC `Z` | `isoUtc` (server), `iso()` (klient) | ✅ |
| §3 aynan takror → 200 `duplicate`, o'zgargan → 409 | worker: 200/201 → delivered · 409 → `manual_review` + Telegram; **asbob `server/tools/resend-event.mjs`** (`--mutate` → 409) lokalda soxta School API bilan 200 ✓ / 409 ✓ | ✅ |
| §4 jonli `question_try` namunasi (31352, 09-10) | kelganda `sinov-natija.mjs --onfinished` | ⏳ Axadulla |
| §5 qo'shma sinov 5 band (staging, `RESULT_DETAILS=a`) | 1 → §5.3-«B6/B7 jonli» + `resend`; 2 → `lessonQuestions`; 3 → 10b; 4 → `resend-event` (200/409); 5 → §5.3-3/9b/19 (Axadulla LMS'da qiladi). Test-darslar: **Internet** (5 test + 12 arena) + **PmLesson10** (F-0916-03 isboti: `total_questions 4`). Yig'malar staging manzili bilan `lms-staging/` (gitignored) | ⏳ vaqt — Axadulla staging deploy tasdiqlagach |
| §7 rotatsiya 6 qadam | `SIRLAR_ROTATSIYASI_UZ.md` J1–J7/T1–T4 bilan aynan mos; `_NEXT` juftligi kodda, `staging-check jwt_next` | ⏳ proddan keyin; kanal kelishiladi |

**«Har savol sinaldi» dalili (2026-09-16):** `scripts/smoke-onfinished-all.mjs` — 70 CRM-dars × uz+ru = **140/140** (har ball-savol darsning
o'z kalitidan urug'lanadi, 9 invariant): `feedback/lms-sinov-2026-09-16/onfinished-sweep.{json,md}`. Jonli yo'l: `tools/e2e-lms.mjs`
22/22 — yangi 4 qadam (jonli javob s4 · arena quiz-0 · Erkin qilish · F5 → ko'rish → «Tamom» → onFinished: s4 `kind: test` 1 urinish server
bilan bir xil, quiz-0 `kind: arena` 1 urinish, test soni == serverdagi `answered`, `lang`, `achievements[]`).

## 10. F-0917-02 — School API bo'sh `badges` ni 422 bilan rad etadi (2026-09-17, staging navbatidan topildi)

| Nima | Dalil |
|---|---|
| Hodisa | Staging `manual_review` 3 ta, hammasi `HTTP 422 The students.0.badges field is required.` — `solo_31347_internet-01-v18_20260910T050107Z` (req `2c214518…`, 09-17 05:12Z) · `solo_35813_internet-01-v18_20260908T130054Z` (req `c65f9d7c…`, 09-15 13:07Z) · `solo_34174_agent-arch-06-04-v18_20260908T053511Z` (req `6360d066…`, 09-15 05:37Z). Payload: `badges: []`, `badges_count: 0`, `answered: 0`, `completed: false` (auto_7d) |
| Juftlik | Yetkazilgan `sess_956510…` (`31352:[top_2,graduate,arena_top_1] 31422:[top_1]`) va `sess_782030…` (`37069:[top_1,graduate,arena_top_1]`) — nishon bo'sh emas. Farq faqat shunda |
| Sabab | Laravel `required` bo'sh massivni «yo'q» deb hisoblaydi; kontrakt (§7.3: noyob `lower_snake_case` kalitlar, `badges_count = length`) bo'sh ro'yxatni taqiqlamaydi. Bizning `validatePayload` ham, soxta School API ham, int-stub ham bo'sh massivni o'tkazardi — shuning uchun lokal sinovda HECH QACHON tutilmagan (unit-fiksturada pC/pD doim `[]` edi) |
| Xavf | Jonli sinfda bitta nishonsiz o'quvchi (top-3 emas · `reached_end` yo'q · hammasi to'g'ri emas) → BUTUN guruh hodisasi 422. Pilotda 1–2 o'quvchi (doim `top_N`) — ko'rinmagan. `RESULT_DETAILS`ga bog'liq emas. Prod navbati bo'sh — zarar yo'q |
| Qaror (foydalanuvchi, 3-variant) | **A)** Axadullaga so'rov: `students.*.badges` → `present\|array` (`feedback/lms-sinov-2026-09-16/xabar-axadulla-2026-09-17-badges-422.md`) · **B)** bizning himoya: `badgesFor` ro'yxat bo'sh qolsa `participant` qo'shadi (FAQAT shu holda) |
| Kod | `result-builder.js` `badgesFor` + `validatePayload` («badges bo'sh» — navbatga tushishidan oldin tutadi) · `tools/fake-school-api.mjs` va `test/integration/results.test.js` stub'i endi Laravel qoidasini AYNAN takrorlaydi (o'sha xabar matni bilan 422) |
| Sinov | unit **55/55** (yangi: solo 0-javob → `['participant']`; jonli pC/pD → `['participant']`, pA/pB ga qo'shilmaydi; validator bo'sh massivni tutadi) · int **76/76** (auto_7d testi endi `badges` ni ham tekshiradi) · **teskari isbot:** tuzatishni o'chirib `results.test.js` → 9 ✓ 1 ✗ (aynan auto_7d testi) — stub xato-sinfni tutadi |
| Qolgan | sync staging (buyruq) → qo'shma sinovga «oxirigacha yetmagan 2-o'quvchi» qadami → Axadulla qoidani o'zgartirgach 3 hodisa admin `requeue` (saqlangan payload `[]` bilan qayta ketadi — 201 = uning tuzatishi ishladi) → prod sync. Ochiq savol Axadullaga: `participant` tanga-formulaga kirmasin |
| **Yopilish (2026-09-18)** | Axadulla School API'da `fix: accept empty Dars platform badges` (main, pipeline #2857934700, 17.09 16:52 → prod ~17:03; skrinshot Telegram). 18.09 07:40 staging admin `requeue` ×3 — saqlangan payload `badges: []` O'ZGARMAGAN holda qayta ketdi: `solo_31347…` → **201** (req `54645ade…`) · `solo_35813…` → **201** (`41d62bed…`) · `solo_34174…` → **201** (`dfe305c6…`); `verify` → School API `lesson-results/{event_id}` **200 found ×3**. Navbat: delivered 5 · manual_review 0. **A-variant ISHLADI.** B-himoya (`participant`) qoladi (ikki tomonlama kelishuv, staging'da bor, prodda hali yo'q). Axadullaning `participant` bo'yicha 2 savolga javobi hali yo'q — ochiq |

## 11. O'zimiz sinov 2026-09-18 (staging, gid 1072) — F-0918-01 · F-0918-02

| Nima | Dalil |
|---|---|
| O'tdi | Mentor 240 LMS-token bilan avtomat (kod 018937, `1ffe8101`), Nigora 31352 qo'shildi, 5 test (3 to'g'ri), 3 yutuq, arena 3/12 1-o'rin, `reached_end` ✓, `badges [top_1, graduate, arena_top_1]`, `lang uz`, `achievements[]` 3 (`earned_at` Z), test-yozuvlar to'liq (`question/options/correct_answer/attempts[].answer`), arena `order` 7..17 (F-0916-03 ✓). onFinished LMS'ga yetdi (`question_try` 200, 5/3/60%/passed) |
| O'tmadi | Sherzod 31422 kirmadi → `participant` jonli isboti yo'q · **`sess_018937_20260918T033756Z` → 422** (req `3bd0c3e1-…`, 03:47Z) · PmLesson10 (`total_questions 4`) sinalmadi · resend 200/409 sinalmadi |
| **F-0918-02** | 40 xato = 8 arena-yozuv × {`question`, `options`, `correct_answer`, `attempts.0.answer` required; `attempts.0.option` «must reference an item in options»}. Sabab: arena javobida matn serverga yozilmaydi (`logArena` lokal, `submit_answer` faqat raqam), `result-builder` arena-yozuvni matnsiz chiqaradi, `validatePayload`/soxta API/int-stub bu maydonlarni talab qilmagan. Prod xavfsiz (details off). Yechim: (1) server — matnsiz yozuv `questions[]`ga kirmaydi + validator/stub Laravel-qoidasi; (2) Axadulla — arena uchun `nullable` so'rovi (`xabar-axadulla-2026-09-18-arena-422.md`); (3) KATTA — darslar arena matnini serverga ham yozadi (onFinished o'zgarmaydi) |
| **F-0918-01** | Noto'g'ri mentor-kod → 400 `domain_error` («Mentor kodi noto'g'ri») → darsda «Server javob bermadi (xato 400)» (klient 401/403 ni kutadi). 1-guruh 08:35 hodisasi shu deb taxmin (LMS token kechikkan, darvoza ochiq). Yechim: server 403 |
| Kuzatuv | `lms-watch` taymautlari (10 s) server emas: HAR'da staging 130–250 ms; admin sessions 0,5–0,7 s. LMS «Hali bu darsga kelmagansiz» modali — LMS davomat, Axadullaga savol |
| **Tuzatish (18.09 10:30)** | Server: `isCompleteQuestion` → matnsiz yozuv `questions[]`ga kirmaydi; `answer/correct_answer` `options[option]`dan tiklanadi; validator matn-maydonlarini majburiy qiladi; `finalizePayload` o'quvchi-darajasida tashlaydi; PG «Mentor kodi noto'g'ri» → 403. Soxta API/int-stub Laravel-qoidasi. unit 57/57 · int 76/76 · staging payload → soxta API 422 ×40 (aynan). Arena matni darsdan kelganda (KATTA §40) arena-yozuv o'z-o'zidan to'liq kiradi (int-test isbotlangan: quiz-0 matn bilan → question/options/correct_answer/answer) |
