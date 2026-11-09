# F-1105-03 — ish rejasi, yakuniy (09.11.2026 19:30)

**Manbalar (ustunlik tartibida):** `25-YAKUNIY-JSX-DARS-LMS-KONTRAKT-UZ.md` (Abdulloh, yakuniy) → `16-…` v1.3 (JSON namunalari) → Shahzoda: `04` (1.1–1.9 va'dalar), `05` (2.1–2.4 qarorlar), `08` (§3, §5), F-1102-02 ro'yxati (31 band).
**Qoidalar:** har bosqich — testlar yashil → commit → staging; prod ▶ faqat foydalanuvchi; 172 dars fayliga tegilmaydi (hammasi `src/live` da); T (reliz kuni) ni faqat foydalanuvchi aytadi; jurnal har qadamda.

## 1. Server — Dars API (S)

| № | Bosqich | Aniq ish | Darvoza |
|---|---|---|---|
| S0 | Commit | Bugungi hujjatlar 19–26, 16/16a, `dev/` 10 skript, KATTA_TOZALASH (pathspec) | — |
| S1 | Migratsiya 0012 | `attempts`: `lesson_version`, `version_source` (`attempt`/`backfill`/`unknown`), `opened_at`, `last_activity_at`. `quiz_key_versions` (lesson_id, lesson_version, question_id, correct_idx). `arena_participants` (pin, player_id, attempt_id, first_question_id, first_question_order, first_shown_at, source, student_arena_no). `screen_views` (attempt_id, screen_id, screen_idx, opened_at, closed_at, by_student bool). `practice_attempts` (attempt_id, screen_id, attempt_no, checked, correct|null, text ≤300, at). `question_keys` (lesson_key, question_id, question_key, revision, lang, text_hash). `result_events`: `event_type`, `schema_version`, `student_id`, `processing_status`, `processing_next_at`, `processing_checked_at`, `processing_response`; holat `review`. `lms_sessions`: `arena_started_at`, `arena_end_reason`, `questions_shown` | migratsiya qayta yurib ham buzilmaydi; unit + int |
| S2 | Versiya yozuvi | Join'da `lesson_version` → `attempts` (`attempt`), yo'q bo'lsa `unknown`; `set_quiz_keys` versiyali jadvalga ham; T dan oldingi urinishlar `null`/`unknown` (backfill yo'q, 25 §9) | int |
| S3 | Quruvchi v2 | `lesson_result` (`lr_<attempt_id>`): `result{attempt_no, trigger, participated, completed, opened_at, completed_at, last_activity_at, elapsed_sec, processed_at, screens{reached,total}, tests{…}, badges}`; `participated` = o'zi ekran o'tgan (`screen_views.by_student`) yoki javob bergan; `completed` = `reached_end`; `badges` faqat `all_correct`, `first_try`, `graduate`, `comeback`; `practice[]`; `details{full|omitted}` + `questions[]` + `achievements`; `lang`; `lesson_version`+`version_source`. `arena_participation` (`ap_`): `arena{started_at, questions_total}`, `participation{…, source: shown|answer}`. `arena_result` (`ar_`): `arena{started_at, finished_at, end_reason, questions_total, questions_shown, players_total}`, `result{student_arena_no, participated, participated_at, answered, correct_answers, points, place 1–3|null, badges arena_top_N}`; `points` formulasi: to'g'ri × 100000 + tezlik bonusi (ekran podiumi tartibi saqlanadi); `not_started` har o'quvchiga. Validator v2 (25 §5 tengliklari, 1 MiB) | unit: 16 v1.3 namunalari aynan chiqadi |
| S4 | Navbat, yuborish, kuzatish | Lahzalar: birinchi `reached_end` darhol; sessiya yopilishi (mentor / 2 soat / stale) → qolgan `lesson_result` + `arena_result`; arena yakuni (mentor / 45 daq / oxirgi savol + 1 daq); solo `reached_end` / 7 kun / `version_changed`. Yuborish: `schema_version: 2`, 201/200/409/422/413/401/403/429(`Retry-After`)/5xx; `processed_at` birinchi yig'ilganda qotadi. Kuzatish ishchisi: GET 1/5/15/60 daq, soatlik, 24 soat → `review` + Telegram; 60 daq `queued` → ogohlantirish. v1 yo'li o'zgarmaydi (T+8 gacha) | int: soxta School API v2 |
| S5 | `version_changed` | Faol urinishga boshqa versiya → eski yopiladi (`lesson_result`, `completed:false`), yangi UUID; mos kelmagan javob/progress → 409 | int |
| S6 | Admin | v2 hodisalar, `processing` holati, `review` ro'yxati; `rebuild` v2 bilan; sessiya sahifasida arena/`screen_views` ko'rsatkichlari | — |
| S7 | Ssenariylar | 16 §6 dagi 23 + 25 §12 dagi 1–18 → bitta ro'yxat (takrorlar birlashtiriladi), har biri integratsiya testi | hammasi yashil |
| S8 | Staging | Deploy, `staging-check` v2 rejimi (soxta qabul qiluvchi yoki Abdulloh stagingi) | 19 ✓ + v2 |
| S9 | Savol kaliti | `question_key` = `<dars kodi -vN siz>:<question_id>`, `revision` = uz+ru matn xeshi; `question_keys` jadvali; hodisa tafsilotida `question_key`, `revision`; «eski id → kalit» JSON+CSV `LMS_REESTR.json` yonida (skript, relizda yangilanadi) | skript + test |
| S10 | Ekran ko'rinishlari | RPC `screen_open` (ochildi/yopildi, kim o'tkazdi) → `screen_views`; undan `opened_at`, `skipped`, faol vaqt bahosi (`active_sec_est`) view'larda | int |
| S11 | Analitika view'lari | `v_lesson_results`, `v_question_attempts`, `v_practice`, `v_screen_views`, `v_arena`, `v_arena_full_place` (to'liq o'rin, o'rtacha vaqt, o'rin olganlar soni), `v_wrong_answers_top` (≥5 o'quvchi), `v_sessions` (kirganlar: LMS/PIN). Ustunlar: `lms_question_id` (reestrdan), `crm_id`, guruhlar (uyda ham), UTC. Ism/kontakt/matn yo'q. Konnektor uchun faqat o'qish roli; tarmoqni Abdulloh ochadi | SQL testlar |
| S12 | `quiz-N` → Learn | Skript: dars kodi, `quiz-N`, tartib 1–12, uz matn, ru matn, til, reviziya → CSV; relizda yangilanadi | — |
| S13 | Shahzodaga muddatlar | Abdulloh ETA'si kelgach: band-ma-band muddat jadvali, konnektor orqali tekshirish boshlanadigan sana, Learn «oxiriga yetmaganga ham ochiladi» (Abdulloh qoidasi), practice ekranlar 2 ro'yxati (L3 dan) | hujjat |

## 2. Darslar — `src/live` (L), 172 fayl o'zgarmaydi

| № | Ish | Aniq |
|---|---|---|
| L1 | Versiya in'ektsiyasi | `useLiveSession` versiyani yig'ish paytidagi global qiymatdan oladi; `pack-lms.mjs` har faylga reestrdagi yangi versiyani yozadi; join'ga ketadi |
| L2 | Brauzer yuki v4 | `schema_version: 2`, `dars_api{attempt_id, session_key, lesson_version, lesson_result_event_id}`, `codestrike` yo'q; oxirgi ekranda avtomatik, sahifadan avtomatik chiqarmaydi (tugma faqat chiqish); «natija qayta ishlanmoqda» holati. **Bayroq**: T gacha v3 |
| L3 | Practice (F-1109-01 B) | `record_practice` RPC: har «Tekshirish»/«Bajardim» = urinish (`checked`, `correct`/`null`, matn ≤300 faqat bizning bazada); 87 dars tahlil skripti → markaziy xarita (`practiceMeta.js`: ekran tekshiriladimi, tugmasi bormi) → Shahzodaga 2 ro'yxat |
| L4 | F-1107-02 | `[object Object]` markaziy tuzatish (`logAttempt`/`recordAttempt` matnni satrga keltiradi) |
| L6 | `screen_open` | Ekran almashganda (o'quvchi o'zi / mentor) serverga xabar, progress sinxroni bilan birga (ortiqcha trafik yo'q) |
| L5 | Reliz T | 172 dars yig'ish; darvozalar (`lint:jsx`, esbuild, `lms-farq`); 16a va «eski id → kalit» qayta; QA `netlify-deploy-v19` Abdulloh bilan (desktop + mobil); yuklash dars vaqtidan tashqari, jonli 0 da; reestr muhri; Learn testlari qayta yuklansa tartib raqamlari saqlanadi (uz 1–12, ru 13–24) |

## 3. Reliz va yopilish

T — ikki tomon tayyor bo'lgach, kunini foydalanuvchi aytadi. Ketma-ketlik (25 §12): migratsiyalar + v1/v2 qabul qiluvchi → CRM qo'llash + LMS → birgalikdagi QA → 172 dars → yangi oqim bayrog'i → monitoring. Nosozlikda bayroq o'chadi, hech narsa o'chirilmaydi. T+8 — tekshirish nuqtasi; v1 ikki tomon tasdig'i bilan yopiladi.

## 4. Tashqi bog'liqliklar (bizni to'xtatmaydi)

Abdulloh: v2 qabul qiluvchi, CRM qo'llash, prod validator SHA, 35887 birinchi xabar, konnektor tarmog'i, 50 xabar solishtiruvi. Shahzoda: muddatlar jadvalini qabul qilish (S13). Kristina: `STALE_SESSION_MINUTES` prod qiymati (ularning deployment mas'uli).

## 5. Rejaga ataylab KIRMAGAN

Haqiqiy faol vaqt o'lchovi (faqat baho, F-1102-02 §5.4) · topshiriqlarga ma'noli kalit nomlari (kalit = dars + `sN` + reviziya) · «Qaytadan» bayrog'i (LMS kanalida bor) · GW 69 tahlili · Learn savol id'lari bo'yicha moslik (CRM tartib raqami bilan o'zi qiladi) · School API / CRM / LMS ichki ishlari.

## 6. Tartib

Bugun: S0 → S1 → S2 → S3 → S4 (har biri testlar + commit + staging). Ertaga: S5–S8, S9–S12, L1–L6. Keyin S13, QA, T.
