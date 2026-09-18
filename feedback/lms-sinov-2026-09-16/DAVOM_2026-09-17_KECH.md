# Davom — 17.09 kech (yangi seans shu fayldan boshlaydi)

Qoida: commit/push/sync faqat sizning buyrug'ingiz bilan. «Siz» = terminalda `!` bilan, «men» = o'zim.
Foydalanuvchi qarori (17.09): Axadulla bilan qo'shma sinov YO'Q — sinovni o'zimiz qilamiz; men so'rayman, siz bajarasiz.

## Muhr — 17.09 ~16:00 (masofadan tekshirilgan, `git ls-remote` + health)

| Qayer | Holat |
|---|---|
| GitHub main | **42bd48d** (push ✓) |
| GitLab staging | **00bb280** → staging server `0.1.0+00bb280b` · migratsiya 8 · `details a` · staging-check 17 ✓ 0 ✗ 2 ⚠ |
| GitLab main | **07de86e** → prod server `0.1.0+07de86e1` · migratsiya 8 · `details off` · prod-check 17 ✓ |
| F-0917-02 himoyasi (`participant`) | staging'da BOR · **prodda YO'Q** |
| Ishchi daraxt | faqat `PIPELINE_STATE.md` + shu fayl UNCOMMITTED |
| Lokal | PG17 klaster to'xtatilgan (skretchpad seansga xos — yangi seansda qayta quriladi, retsept pastda) |

## Navbat

| # | Kim | Nima |
|---|---|---|
| 0 | Siz | ✅ **Javob keldi (18.09 07:42):** CRM'da hech narsa yo'q (lms-staging 2 fayl ham, lms/ 102 fayl ham). → HOZIR: `lms-staging/InternetLesson.jsx` + `lms-staging/4-M/PmLesson10.jsx` → CRM test-guruh (1070 / 1072) materialiga. Oddiy guruhlarga EMAS (staging manzili) |
| 1 | Men · Siz | ⚠ **Sinov o'tkazildi 18.09 08:33–08:47** (2-guruh 1072): mentor avtomat ✓, Nigora ✓, arena ✓, natija **422 (F-0918-02)**, Sherzod kirmadi, 1-guruhda mentor 400 (F-0918-01). Qayta sinov 1-qadam tuzatilgach (Sherzod bilan, PmLesson10, resend) |
| 1a | Men → Siz | ✅ **Server-tuzatish TAYYOR (18.09 10:30):** F-0918-02 himoya + validator/soxta API/int-stub Laravel-qoidasi + F-0918-01 403; unit 57/57 · int 76/76 · staging payload → soxta API 422 ×40 aynan. **Qoldi:** commit (buyruq) → push → `sync-dars-api.sh staging` → staging-check. Xabar Axadullaga HOZIR: `xabar-axadulla-2026-09-18-arena-422.md` |
| 2 | Siz → Men | Qayta sinov o'tsa: `! bash scripts/sync-dars-api.sh main` → GitLab `main` pipeline → `deploy` job ▶ → men `node --env-file=.env.deploy.prod tools/staging-check.mjs --read-only https://dars-api.coddycamp.uz` (env-fayl AYNAN `.prod`) |
| 3 | Siz | Kristinaga (ru, loyiha pastda): prod `RESULT_DETAILS=a` + staging `TRUST_PROXY` — **ikkalasi Retry deploy-job bilan, qo'lda `up -d` EMAS** (F-0917-01) |
| 4 | Siz | CRM «Umumiy modullar»: `lms/` — `CRM_YUKLASH_ROYXATI.md` tartibida (ildiz 45 · 4-M 16 · 5-M 15 · 6-M 14 · uy-vazifa 12; hammasi `lms/` da bor, prod manzili, qayta yig'ish shart emas). Serverga bog'liq emas — istalgan payt. **Shart:** 4+ o'quvchili haqiqiy jonli dars 2-qadamdan OLDIN o'tkazilmaydi |
| 5 | Men | ✅ **BAJARILDI 18.09 07:40:** Axadulla `fix: accept empty Dars platform badges` (17.09 ~17:03 prod) → staging admin `requeue` ×3 → **201 ×3**, verify 200 found ×3, navbat manual_review 0. SINOV §10 «Yopilish» |
| 6 | Keyin | kalit-rotatsiya (prod A-variantdan keyingi kun) · KATTA §38/§39 · CLAUDE.md «beshalasi» → oltita (rozilik bilan) |

## 1-qadam — o'zimiz sinov (uch oyna)

Oynalar: **M** mentor M-2 (240) CRM'da · **O1** Nigora 31352 LMS'da · **O2** Sherzod 31422 boshqa brauzer/inkognito.
Men boshida: `cd server && node --env-file=.env.deploy.staging tools/lms-watch.mjs https://staging-dars-api.coddycamp.uz --out ../feedback/lms-sinov-2026-09-16/watch-0917.log`

| Daqiqa | Kim | Nima | Kutilgan |
|---|---|---|---|
| 0–3 | M, O1, O2 | M «Internet qanday ishlaydi» ni test-guruhda ochadi; O1 va O2 LMS'da ochadi | watch: `live … o'quvchi 2` |
| 3–10 | M, O1 | M 5 test ekranini o'tadi, O1 har biriga javob beradi (bitta urinish). **O2 hech narsaga javob bermaydi, birinchi ekranda qoladi.** 21-ekranda M arenani boshlaydi, O1 3–4 savolga javob → O1 «Yakunlash → Tamom» | — |
| 10–12 | M · Men | M «Erkin qilish» → 5–10 s → men `sinov-natija.mjs --pin <kod>` | `delivered` 201 · **O2 `badges: ["participant"]`** (F-0917-02 jonli isboti; ilgari butun hodisa 422) · O1 da `top_1`/`graduate` · `lang`, `questions[]` (test + arena `kind`), `achievements[]` · arena ballga kirmagan · vaqtlar `Z` |
| 12–15 | Men | `node --env-file=.env.deploy.staging tools/resend-event.mjs https://staging-dars-api.coddycamp.uz <event_id>` → **200 duplicate**; `--mutate` → **409** + bizda `manual_review` | Axadulla §5-4 |
| 15–20 | M, O1 · Men | **PmLesson10** (`pm-m3d14-v1`): M ochadi, O1 4 testga javob → «Erkin qilish» | payload `total_questions: 4` (F-0916-03) |

Yiqilgan band bo'lsa to'xtatmaymiz — jadvalga yozamiz, oxirida sabab bilan ajratamiz.

## Kristinaga xabar-loyiha (2-qadamdan keyin yuboriladi)

```
Кристина, здравствуйте. Две просьбы, обе через Retry deploy-job (не ручной up -d — после ручного staging сегодня
поднялся на старом образе 47d27f1: в .env.deploy IMAGE_TAG=latest, правильный тег ставит только CI).

1. Prod (dars-api): в .env.deploy RESULT_DETAILS=a → Retry deploy-job последнего main pipeline.
2. Staging: в .env.deploy TRUST_PROXY сейчас доверяет всей цепочке (поддельный X-Forwarded-For принимается;
   на prod всё правильно). Нужно TRUST_PROXY=loopback,172.16.0.0/12 или просто убрать строку — это default в compose.
   → Retry deploy-job последнего staging pipeline.

Проверим сами через staging-check. Спасибо!
```

## Yangi seans uchun retseptlar

- **Lokal PG17 (int-testlar):** `initdb -D <skretchpad>/pg17 -U postgres -A trust` → `pg_ctl … -o "-p 5433 -c listen_addresses=127.0.0.1 -c unix_socket_directories=''"` (socket yo'li 107 baytdan uzun — FAQAT TCP) → `create role dars login superuser password 'dars'; create database dars_test owner dars` → `cd server && npm run test:int` (76/76).
- **Deploy kuzatuvi:** fon-Bash'da `/api/v1/health` `version` ni 15 s dan poll → kutilgan SHA chiqqach `staging-check`. Staging avto ≈4–5 daqiqa; prod — tugma bosilgach ≈2–4 daqiqa.
- **«Qildim» degan so'zdan keyin ham masofani tekshir:** `git ls-remote origin refs/heads/main` va `git -C ../dars-api-coddy ls-remote origin refs/heads/staging` (17.09 da bir marta push ham, sync ham yetib bormagan edi).
- Klassifikator `pull-dars-api.sh main` ni «Production Deploy» deb bloklaydi → `git -C ../dars-api-coddy fetch` + `git log <bizning-oxirgi>..origin/main` bilan qo'lda (faqat o'qish).
