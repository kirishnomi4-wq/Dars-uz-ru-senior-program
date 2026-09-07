# SINOV PROTOKOLI — LMS ↔ Dars-platforma (birgalikdagi qabul sinovi)

**Asos:** LMS v1.2 §13 (21 band) + bizning 5 band · **Muhit:** avval `staging-api.azizbek.site`, keyin prod · **Sana:** to'ldiriladi
**Ishtirokchilar:** LMS jamoasi (test-akkauntlar, CRM), biz (backend, admin-sahifa, loglar)

## 0. Tayyorgarlik (sinovdan oldin)

| # | Kim | Nima | Tekshiruv |
|---|---|---|---|
| T1 | Biz | `https://staging-api.azizbek.site/api/v1/health` → 200, `checks.db = ok` | curl |
| T2 | Biz | `/etc/dars-api/staging.env`: haqiqiy `CODDYCAMP_*` (iss=coddycamp-lms, aud=dars-platform, kid=v1), `CORS_ORIGINS=https://lms.coddycamp.uz` | health + log'da «LMS-ko'prik o'chiq» YO'Q |
| T3 | Biz | `npm run seed:catalog` staging'da (115 dars) | `select count(*) from lesson_catalog` |
| T4 | Biz | Pilot-fayl: `DARS_API_URL=https://staging-api.azizbek.site node scripts/build-lms.mjs src/1-Modull/InternetLesson.jsx` → `lms/InternetLesson.jsx` | smoke-lms o'tdi |
| T5 | LMS / biz | Pilot-faylni CRM «Umumiy modullar» → test-materialga (`type=jsx`) G-1 va G-2 sahifalariga | O-1 LMS'da ko'radi, M-1 CRM'da ko'radi |
| T6 | LMS | Test-akkauntlar (S-1): O-1, O-2 (G-1 faol) · O-3 (G-1 muzlatilgan) · O-4 (G-2) · O-5 (G-1+G-2) · M-1 (TEACHER G-1) · M-2 (TEACHER G-2) · T-1 (TA G-1) · X-1 (tayinlanmagan) · V-1 (vaqtincha mentor, muddat ichida) | login/parol + ID + guruh xavfsiz kanal orqali |
| T7 | Biz | Admin-sahifa `https://staging-api.azizbek.site/admin` ochiq (basic auth) | ko'rinadi |

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
| 20 | `GET /lesson-results/{event_id}` tasdiqlaydi | Biz curl (results-token bilan, serverdan) | `200`, `data.event_id` mos | terminal skrinshoti (token yashirilgan) |
| 21 | Frontend/URL/loglarda `sapi_`, JWT secret, JWT yo'q | Brauzer DevTools (Network/Application), Caddy va journald loglari, URL | Hech qayerda yo'q (Authorization sarlavhasi Caddy logidan o'chiriladi) | grep natijasi skrinshoti |

## 2. Bizning qo'shimcha 5 band

| # | Band | Qadamlar | Kutilgan |
|---|---|---|---|
| B1 | O-3 (muzlatilgan) tushunarli xato ko'radi | O-3 LMS'da ochadi | LMS'ning o'z xabari yoki bizning darvoza — oq ekran emas |
| B2 | O-5 (ikki guruh) — tanlov | M-1 G-1 da va M-2 G-2 da bir vaqtda dars ochadi → O-5 kiradi | «Qaysi darsga kirasiz?» ikki tugma (guruh nomi yo'q), tanlagach kiradi |
| B3 | `rejected_students` saqlanadi va ko'rinadi | (19) dan keyin | admin `results/:id` da `response` ichida |
| B4 | Rotatsiya `kid v1 + v2` | LMS ikkinchi secret bilan `kid=v2` token beradi (yoki staging'da biz `_NEXT` env) | Ikkala kid ham qabul |
| B5 | **Maqsad-sinov:** M-1 CRM'da bosadi (kod yo'q) → O-1 LMS'da bosadi (PIN yo'q, o'z ismi) → O-4 kira olmaydi → T-1 ochadi → X-1 ocha olmaydi | ketma-ket | Hammasi bir o'tirishda, 15 daqiqa |

## 3. Uyga-qaytish (bizning F-0903-01)

| # | Qadamlar | Kutilgan |
|---|---|---|
| U1 | (16) dan keyin O-1 8 soatdan keyin (yoki boshqa qurilmadan) darsni LMS'da ochadi | «👁 Ko'rish rejimi» — javoblari, natija ekrani ko'rinadi, «↻ Qaytadan boshlash» |
| U2 | O-1 «Qaytadan boshlash» | «📘 Mustaqil rejim», 0-ekran; oxirigacha o'tsa → solo natija `delivered` (rank null) |
| U3 | O-1 solo'da 3-ekranda yopadi, boshqa qurilmadan ochadi | O'sha 3-ekrandan davom (server-progress) |

## 4. Natija-jadval (to'ldiriladi)

| Band | Holat (✅/❌) | Sana | Dalil (fayl/havola) | Izoh |
|---|---|---|---|---|
| 1 … 21 | | | | |
| B1 … B5 | | | | |
| U1 … U3 | | | | |

**Qabul mezoni:** 21 + 5 + 3 bandning hammasi ✅, `manual_review` da sinovga aloqasiz hodisa yo'q, loglarda sir yo'q (21).
**Prod'ga o'tish:** shu protokol prod'da 2, 11, 13, 16, 17, 21 bandlari bilan qisqa takrorlanadi (haqiqiy bitta guruh, mentor roziligi bilan).
