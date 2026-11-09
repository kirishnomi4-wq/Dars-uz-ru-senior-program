# DAVOM — analitika + mentor fidbeklari (holat: 2026-11-09 19:21)

> ✅ **09.11 19:10 — YAKUNIY KONTRAKT `25-YAKUNIY-JSX-DARS-LMS-KONTRAKT-UZ.md` (Abdulloh): 06–24 ni birlashtiradi, zid joyda ustun; «tasdiq davrasi tugadi, kod boshlanadi».** 16 v1.3 — namunalar manbasi. Farqlar JURNAL 19:21 (participated ta'rifi, arena_participation tuzilmasi, place 1–3, badges, crm_id/group faqat view'larda, backfill → unknown, 413/401/403, qabul mezonlari 1–18). Prod `7e53ca91`. 50 xabar: solishtirish ularda, nomzod 35887. **KEYINGI: to'liq reja S0–S13 / L1–L6 (25 tuzatishlari bilan) → kod. Foydalanuvchi «ha» → S0 commit.**

Yangi seans shu fayldan boshlaydi. Batafsil tarix: `JURNAL.md` (shu papka) va `feedback/F-1107-mentor-fidbek/JURNAL.md`.

## Qarorlar (foydalanuvchi, 07.11)
- Yakshanba 08.11 relizi **BEKOR**. Hammasi bir yo'la: analitika kodi + mentor tuzatishlari bilan **172 dars birga** chiqadi. Kunini faqat foydalanuvchi aytadi.
- Asosiy analitika kodi (0012, 3 hodisa, src/live) **Abdulloh JSON v1.1 ni tasdiqlagandan keyin** yoziladi (A varianti).
- GW 69 — shart emas.

## Holat
| Ish | Holat |
|---|---|
| Abdulloh javobi (09.11 12:40) | `15-ABDULLOH-TOLIQ-JAVOB-UZ.md`: yo'nalish qabul, 1.1–1.4 «ha» shart bilan (avval hisobot), 2.1–2.10 «ha», 2.6 = b, 3.1–3.7 tuzatish, +7 ssenariy |
| Bizning javob | 16 yuborildi 14:30 → Abdulloh 18-javobi 16:35 (`19-…`) → **16 v1.2 nashri (09.11 17:37):** `partial` bekor, amaliyot `-1` testdan tashqari + v2 `practice` bloki, `completed` = `reached_end`, `occurred_at`/`processed_at`, jonli ≤ 9000 s, A1/A2/C1 to'liq JSON (9/9 parse), `lr_`/`ap_`/`ar_` + `attempt_id`, §3.2 4 qoida, §4.2 backfill (7 kun sharti, `version_source`), §4.3 ikki qoida, §4.4 v1 yopilishi 5 shart + ikki tomon, §2.4 kuzatish 24 soat, ssenariy 18–23, Ilova `eski_lesson_id`; lint:til 0 error. **`21-ABDULLOH-18-JAVOBGA-JAVOB-UZ.md`** — 9 bo'limga bandma-band javob + sizdan 4 narsa. 16a: `eski_lesson_id` ustuni (dev/eski-id.sh, 62 dars) |
| Server (F-1106-01, F-1107-01; F-1109-01 A bekor → F-1109-02) | ✅ **Prod `0.1.0+d9510a7e`** (09.11 17:04; manba `9cc55ff0`). Staging 80be5af (19 ✓). Navbat: delivered 4700 · manual_review 50 (tarixiy) · skipped 5 |
| 50 ta manual_review hodisa | **YAKUNIY sinov-hisobot (09.11 15:25, prod 873334d7, yangi qoida):** tafsilot tushdi 13 (pg-crud), qisman 22, completed o'zgargan 1 (css-01 30321). Oldingi (14:05): `17-ABDULLOH-50-XABAR-HISOBOT-UZ.md` + `17a-50-XABAR-HISOBOT.csv` (229 qator; yuboriladi 213 · chiqariladi 16 · correct +57/28 · tafsilot tushdi 35). Hech narsa yuborilmagan. Foydalanuvchi Abdullohga yuboradi → u reyestr bilan solishtiradi → qaysi qatorlar → 1 xabar (`dry: false`, suffix yo'q) → qolgani. Skriptlar: scratchpad/prod/50-dry.sh, hisobot.mjs (reboot'da o'chadi — dev/ ga nusxa kerak) |
| F-1107-02 «[object Object]» | Faqat `PostgresCrudLesson.jsx` (s5b/s12). Tuzatish src/live da, 172 reliz bilan (tasdiq kerak) |
| Mentor fidbeklari F-1107-03…08 | Commit `68922462` (4 fayl). Push yo'q. CRM'ga 172 relizi bilan |
| 🔴 **F-1109-01 tafsilot yo'qolishi (yakuniy amaliyot ekrani)** | Prod o'lchov 09.11 (oxirgi 100 yetkazilgan): jonli javob berganlardan **69/118 da tafsilot yo'q** (67 tasi completed), solo **33/69** (hammasi completed). Sabab: custom scored final ekran `submitAnswer` bilan ball yozadi, matn (`recordAttempt`) yozmaydi → `isCompleteQuestion` tashlaydi → `answered≠questions` (BIZNING invariant, F-0918-02) → o'quvchining butun tafsiloti tushadi. **87/172 darsda** (21 tasi `-1`, 66 tasi haqiqiy kalit). Taklif A: validator `testN < answered` ruxsat (qisman tafsilot), v2 `details.status: partial / practice_screen`, staging'da 1 hodisa sinovi; B (reliz): custom ekran matn yozsin. **A ✅ PROD'DA 09.11 14:24 (commit f79de6f4 → staging 8e8ec25 19✓ → main 873334d ▶):** validator `questions>answered`/`correct>answered`, unit 64/64, int 92/92; 16 §2.2 `partial` + kontrakt-o'zgarish bandi + Abdullohga savol; KATTA_TOZALASH'da F-1109-01 (B ⬜ 87 dars). Keyingi: commit → staging → main ▶ → 50-dry qayta → yakuniy 17 |
| Qonunlashtirish (MATN_KORPUS / DARS_ETALON) | Kutilmoqda — MATN_KORPUS.md da boshqa seansning commit qilinmagan tahriri bor |

## Kodda topilgan faktlar (09.11, 16-hujjat asosi)
- Bo'sh `badges` 422 — F-0917-02 (17.09), Axadulla 18.09 tuzatgan; serverda `participant` zaxirasi (`badgesFor`) + `badges bo'sh` validator qoidasi (`result-builder.js:300`) qolgan.
- `duration` 0…86400 clamp: `result-builder.js:182` (live), `:239` (solo), `:301` (validator). Faol vaqt serverda yo'q.
- Versiya: `attempts` da `lesson_version` YO'Q; `quiz_keys` (lesson_id, question_id) — versiyasiz, har ochilishda upsert; darslar `lessonVersion` yubormaydi (0/172, `LESSON_META` da versiya yo'q); `lms_sessions.lesson_version` ustuni bor, bo'sh. Versiya-isbot faqat `key≠text` (`correct_answer` = `texts.correct`).
- onFinished yukida attempt/pin/session yo'q (muhr-kaliti lokal `liveSession:<id>` dan).
- `rewardedStudents` (result-service.js:93): completed=false to'smaydi → 2.6 b allaqachon shunday.
- Rebuild dry summary: students_before/after, excluded, not_in_source, correct_changes, details_dropped (+ payload).

## Eslatmalar
- `lms-farq`: 172 «o'zgargan» — faqat boshqa seansning commit qilinmagan `src/live/previewMode.js` qatori tufayli; mazmunan 4 dars.
- `dev/` — prod admin GET skriptlari (parol `server/.env.deploy.prod` dan). **Prod'ni o'qish agentga taqiqlangan** — nusxa scratchpad'ga, foydalanuvchi `! bash <yo'l>` bilan yurgizadi. Scratchpad reboot'da o'chadi.
- Reestr skripti: scratchpad/reestr/yig.mjs (LMS_REESTR.json + CLASS-LEARN.csv + LEARN-OCHILDI.csv → 16a). Reliz paytida qayta yurgiziladi (versiyalar yangilanadi).

## Keyingi qadamlar (tartib)
1. ~~15 nusxa + jurnal~~ ✅ · ~~16 + 16a~~ ✅ · ~~commit f79de6f4 → staging → main ▶~~ ✅ · ~~50-dry qayta → 17 yakuniy~~ ✅ → ~~Abdullohga yuborish~~ ✅ 14:30 → ~~Abdulloh javobi~~ ✅ 16:35 (papkada `19-ABDULLOH-16-17-JAVOB-UZ.md`).
1a. ~~F-1109-02 hotfix~~ ✅ 17:05 · ~~F-1109-03 server 3731cde3 → staging → main → prod ▶ 17:40 (`7e53ca91`)~~ ✅ · ~~50-dry2 → 20/20a~~ ✅ 17:43 · ~~16 v1.2 + 21 + 22~~ ✅. ~~Foydalanuvchi paketni yuboradi~~ ✅ 17:47 → ~~Abdulloh javobi~~ ✅ 18:43 (`23-…`, qabul + 6 tuzatish) → ~~16 v1.3 + 24~~ ✅ 18:46 → ~~16 v1.3 + 24 yuborildi~~ ✅ 18:55 → **KOD (foydalanuvchi buyrug'i bilan): commit → 0012 → 3 hodisa v2 → kuzatish → brauzer v4 → 23 test**.
1b. **Abdulloh 18-javobi bo'yicha qarorlar (foydalanuvchi):** qayta yig'ishda `total_questions` saqlangan payload'dan (20 nishon-xato shu) · `-1` amaliyot `tests` dan tashqari · jonli `completed` = `reached_end` · `excluded_by` hodisa id · 16a «eski id» ustuni (`pm-m2d13-v1`) · 16 v1.2 tuzatishlar (`lr_<attempt_id>`, 4.3, v1 yopilish, `occurred_at`/`processed_at`, 2 soat + 30 daq, A1/C1, 201 kuzatish, amaliyot `correct: null`). Keyin: server kod → testlar → staging → main ▶ → 50-dry qayta → **19/19a hisobot** (chiqarilganlar id, nishon sabablari, 30321 dalili: `reached_end: false`, tarixiy dalil = javob paytidagi matn + kalit↔matn) → Abdullohga paket. Qisman 22 qator yuborilmaydi.
2. ~~Server ▶~~ ✅ 13:52 · ~~50 dry → 17~~ ✅ 14:05 → foydalanuvchi 17 + 17a ni Abdullohga yuboradi · F-1109-01 o'lchash (tafsilot-tekshir.sh) → qaror.
2a. Abdulloh javobi → 17a da belgilangan qatorlar → 1 xabar (`rebuild` `dry: false`, suffix yo'q) → School API javobi (tenglik tekshiruvi shu yerda ko'rinadi) → qolgani.
3. Abdulloh 16 ni tasdiqlagach: ish hajmi/muddat → kod (0012: attempts.lesson_version, quiz_keys versiyali, 3 hodisa, elapsed/last_activity/details, yuk versiyasi, onFinished v4 `dars_api`, `participant` olib tashlash) → 17 ssenariy testi → QA `netlify-deploy-v19` → 172 dars (kunini foydalanuvchi aytadi).
