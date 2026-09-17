# Tartib — 16.09 kech va 17.09 (kim nima qiladi, qaysi buyruq)

Qoida: commit/push/sync faqat sizning buyrug'ingiz bilan. «Siz» = terminalda `!` bilan yurgizasiz, «men» = o'zim yurgizaman.

## A. Bugun kech (ovqatdan keyin), ≈15 daqiqa

| # | Kim | Nima |
|---|---|---|
| 1 | Siz | «commit» deysiz → men 3 commit qilaman (xabarlari D-bo'limda) |
| 2 | Siz | `! git push origin main` |
| 3 | Men → Siz | men `bash scripts/pull-dars-api.sh staging` bilan Kristinaning begona commitini tekshiraman → siz `! bash scripts/sync-dars-api.sh staging` (avto-deploy, ichida 0008 migratsiya + F-0916-03) |
| 4 | Men | 5 daqiqadan keyin `cd server && node --env-file=.env.deploy.staging tools/staging-check.mjs https://staging-dars-api.coddycamp.uz` → 19 ✓ · migratsiya **8** · katalog 110 · `result_details off` |

## B. Ertalab 17.09

| # | Kim | Nima |
|---|---|---|
| 5 | Siz | Axadullaga xabar: `xabar-axadulla-2026-09-17.md` (vaqt joyiga 15:00 yoki 17:00 Toshkent) + ilova `onfinished-sweep.md` |
| 6 | Siz → Men | `! bash scripts/sync-dars-api.sh main` → GitLab'da `main` pipeline'ida deploy tugmasi (darsdan tashqari vaqt — ≈30 s 503) → men `staging-check … --read-only https://dars-api.coddycamp.uz` (migratsiya 8, `result_details off`) |
| 7 | Siz | CRM «Umumiy modullar»: `lms/` dagi 92 fayl, `CRM_YUKLASH_ROYXATI.md` tartibida (ildiz + `4-M/` + `5-M/` + `6-M/`). Hammasi prod manzili bilan (16.09 13:08 yig'ilgan). Yuklagach har moduldan bitta darsni o'quvchi sifatida ochib ko'rasiz: darvoza bor, oq ekran yo'q. Men CRM'ga kira olmayman — bu tekshiruv sizda |
| 8 | Siz | Test-guruh (1070 / 1072) materialiga: `lms-staging/InternetLesson.jsx` va `lms-staging/4-M/PmLesson10.jsx` (staging manziliga qaraydi; oddiy guruhlarga EMAS) |

## C. Axadulla «staging qabul qiladi» deganda

| # | Kim | Nima |
|---|---|---|
| 9 | Siz | Kristinaga ruscha xabar `xabar-kristina-result-details-staging.md` → u staging'da `RESULT_DETAILS=a` + restart |
| 10 | Men | staging-check → `details a` |
| 11 | Hammamiz | 30 daqiqalik qo'shma sinov (quyida daqiqama-daqiqa) |
| 12 | Siz | O'tsa Kristinaga prod xabari (o'sha faylning oxirida) → prod `RESULT_DETAILS=a` → birinchi haqiqiy dars → men `verify` |

### Qo'shma sinov — 30 daqiqa (Axadulla §5 beshtasi)

| Daqiqa | Kim | Nima | Axadulla nimani ko'radi |
|---|---|---|---|
| 0–3 | Men · Siz | men `lms-watch` yoqaman; siz mentor akkaunt (M-2, 240) bilan CRM'dan **Internet** darsini ochasiz (test-guruh), o'quvchi (Nigora 31352 yoki Sherzod 31422) LMS'da ochadi → «Mentor: 1 / 22» | — |
| 3–10 | Siz | mentor 5 test ekranini o'tadi, o'quvchi har biriga javob beradi (bitta urinish); 21-ekranda mentor arenani boshlaydi, o'quvchi 3–4 savolga javob beradi; o'quvchi «Yakunlash → Tamom» | onFinished → LMS `question_try` (MVP yo'li) |
| 10–12 | Siz · Men | mentor «Erkin qilish» → 5–10 s → natija `delivered`; men `sinov-natija.mjs --pin <kod>` → sessiya, payload, verify | **(1)** test + arena saqlandi · **(2)** arena ballga kirmagan (`correct_answers` faqat test) · **(3)** `at`/`earned_at` `Z` bilan qaytdi |
| 12–16 | Men | `node --env-file=.env.deploy.staging tools/resend-event.mjs https://staging-dars-api.coddycamp.uz <event_id>` → 200 `duplicate: true`; `--mutate` → 409, bizda admin `manual_review` (+ Telegram bo'lsa) | **(4)** |
| 16–24 | Siz · Men | **PmLesson10** (`pm-m3d14-v1`): mentor ochadi, o'quvchi 4 testga javob → Erkin qilish → payload `total_questions: 4` | F-0916-03 tuzatilgani |
| 24–30 | Axadulla · Men | eski JWT (13 soat) → 401 · muddati o'tgan vaqtincha mentor → token yo'q · guruhdan chiqarilgan o'quvchi → mustaqil/403; men Dozzle'da `reason=` satrlarini ko'raman | **(5)** |

Yiqilgan band bo'lsa: to'xtatmaymiz, jadvalga yozamiz, oxirida sabab bilan ajratamiz (SINOV §7 uslubi).

## D. Commit xabarlari (3 ta, buyruq bilan)

1. `fix(server): F-0916-03 — ishtirok-kalitlar (practice/kadrlar/joy/koding: -1) total_questions maxrajidan chiqarildi (38/70 darsda ×2 edi) + unit-test + resend-event asbobi`
   — `server/src/modules/results/result-builder.js`, `server/test/unit/result-builder.test.js`, `server/tools/resend-event.mjs`
2. `test(onfinished): har savol sinovi — smoke-onfinished-all 70×2=140/140, E2E jonli onFinished 22/22 (harness payload), lint-keys darvozasi (gates 6)`
   — `scripts/smoke-onfinished-all.mjs`, `scripts/lint-keys.mjs`, `tools/e2e-lms.mjs`, `src/lms-harness/main.jsx`, `gates.mjs`, `package.json`, `.gitignore`
3. `docs: Axadulla 15.09 javobi ↔ kod (SINOV §9), F-0916-03 ov-bandlari (3 rol), 16.09 jurnali, xabarlar (Axadulla uz / Kristina ru), sweep-dalili`
   — `SINOV_PROTOKOLI_LMS.md`, `PIPELINE_STATE.md`, `.claude/agents/…` (3 fayl), `feedback/lms-sinov-2026-09-16/`

Darslar (`src/`, `lms/`) va GitLab'ga ketadigan `server/` chegarasi saqlanadi: sync faqat `server/` ni oladi.
