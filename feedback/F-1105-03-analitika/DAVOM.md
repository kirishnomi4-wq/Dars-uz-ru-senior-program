# DAVOM — analitika + mentor fidbeklari (holat: 2026-11-09 15:25)

Yangi seans shu fayldan boshlaydi. Batafsil tarix: `JURNAL.md` (shu papka) va `feedback/F-1107-mentor-fidbek/JURNAL.md`.

## Qarorlar (foydalanuvchi, 07.11)
- Yakshanba 08.11 relizi **BEKOR**. Hammasi bir yo'la: analitika kodi + mentor tuzatishlari bilan **172 dars birga** chiqadi. Kunini faqat foydalanuvchi aytadi.
- Asosiy analitika kodi (0012, 3 hodisa, src/live) **Abdulloh JSON v1.1 ni tasdiqlagandan keyin** yoziladi (A varianti).
- GW 69 — shart emas.

## Holat
| Ish | Holat |
|---|---|
| Abdulloh javobi (09.11 12:40) | `15-ABDULLOH-TOLIQ-JAVOB-UZ.md`: yo'nalish qabul, 1.1–1.4 «ha» shart bilan (avval hisobot), 2.1–2.10 «ha», 2.6 = b, 3.1–3.7 tuzatish, +7 ssenariy |
| Bizning javob | **`16-ABDULLOH-JSON-V1.1-VA-OTISH-TARTIBI-UZ.md` + `16a-REESTR-DARS-CLASS-LEARN.csv` tayyor (09.11 13:55), lint:til 0 error.** Foydalanuvchi ko'radi → Abdullohga yuboradi. Foydalanuvchi tasdig'i kutilayotgan qarorlar: `participant` nishonini v1.1 da olib tashlash · `elapsed_sec` + `last_activity_at` (faol vaqt v1.2) · ochiq urinish: eski tab davom etadi, yangilansa `version_changed` + yangi urinish · v1 yopish T+8 kun · `not_started` hodisasi yuboriladi |
| Server (F-1106-01, F-1107-01, F-1109-01 A) | ✅ **Prod `0.1.0+873334d7`** (09.11 14:24; oldin 13:52 da 92087d0e). Staging 8e8ec25 (19 ✓). Navbat o'zgarmagan |
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
1. ~~15 nusxa + jurnal~~ ✅ · ~~16 + 16a~~ ✅ · ~~commit f79de6f4 → staging → main ▶~~ ✅ · ~~50-dry qayta → 17 yakuniy~~ ✅ → **foydalanuvchi 16 + 16a + 17 + 17a ni `18-TELEGRAM-XABAR-UZ.md` matni bilan Abdullohga yuboradi.**
2. ~~Server ▶~~ ✅ 13:52 · ~~50 dry → 17~~ ✅ 14:05 → foydalanuvchi 17 + 17a ni Abdullohga yuboradi · F-1109-01 o'lchash (tafsilot-tekshir.sh) → qaror.
2a. Abdulloh javobi → 17a da belgilangan qatorlar → 1 xabar (`rebuild` `dry: false`, suffix yo'q) → School API javobi (tenglik tekshiruvi shu yerda ko'rinadi) → qolgani.
3. Abdulloh 16 ni tasdiqlagach: ish hajmi/muddat → kod (0012: attempts.lesson_version, quiz_keys versiyali, 3 hodisa, elapsed/last_activity/details, yuk versiyasi, onFinished v4 `dars_api`, `participant` olib tashlash) → 17 ssenariy testi → QA `netlify-deploy-v19` → 172 dars (kunini foydalanuvchi aytadi).
