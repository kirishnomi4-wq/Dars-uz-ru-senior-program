---
name: holat-2026-09-08-yakun
description: "2026-09-08 kun yakuni HOLAT-MUHRI: LMS pilot o'tdi (staging), staging+prod tirik, natija-detallari onFinished, GitLab ikki tomonlama; ertaga (2026-09-09) aynan shu yerdan davom — qadam-baqadam ro'yxat"
metadata:
  type: project
---

# Qayerga keldik (2026-09-08, 18:15)

**Muhitlar:** staging `https://staging-dars-api.coddycamp.uz` (GitLab 8d24e53 sync qilindi, deploy ertalab tekshiriladi; oldingi 16f8284 qabul 19 ✓) · prod `https://dars-api.coddycamp.uz` (97e8792, bugungi kod, qabul 17 ✓; **deploy QO'LDA** — Kristina 8333ddd, merge ham deploy ham bizning signal bilan) · GitHub `main` = 5a0322e, daraxt toza (bugun 17 commit) · loglar Dozzle `dars-logs.coddycamp.uz` (login dars, parol `.env.coddycamp.local`).

**Bugun bo'lgani (tartib):** natija-detallari (avval server-bayroq A → Axadulla rad → **onFinished C-variant**, 97 dars, `src/live/resultDetails.js`) · `tools/staging-check.mjs` (19 band) + `STAGING_QABUL_UZ.md` · deploy-paket nuqsonlari (katalog seed, TRUST_PROXY: mening «son» xatom → Kristina ro'yxat) · lesson_id takror 0 · `cutover-mashq` 90/90 · 12 PM uy-vazifa yig'masi · o'lik manzil → prod, 14 vite-konfig · rotatsiya-runbook `SIRLAR_ROTATSIYASI_UZ.md` · Telegram `tools/telegram-check.mjs` · admin «Sessiyalar» · GitLab ikki tomonlama (`pull-dars-api.sh` → `sync-dars-api.sh` darvozasi) · GitLab akkaunt tasdiqlandi · **LMS PILOT O'TDI** (gid 1070, mentor 165, o'quvchi 37069: mentor kod, o'quvchi PIN'siz 21/21, javob 5/urinish 5/yutuq 4, natija School API 201 + LMS GET, tanga 40, begona o'quvchi → solo) · F-0908-01 (end_reason stale→mentor) tuzatildi.

**Kelishuvlar:** Kristina — env o'zgarishini so'rov bilan qo'yadi, prod-merge faqat bizning signal, loglar Dozzle; qolgan: dump-dalili (foydalanuvchi Dozzle backup-logidan oladi). Axadulla — School API kontrakti kengaymaydi, detallar onFinished (hajm chegarasi yo'q), keyin kerak bo'lsa alohida endpoint; test-akkauntlar berdi (teacher + guruh 1070).

# Ertaga (2026-09-09) shu yerdan

1. `cd server && node --env-file=.env.deploy.staging tools/staging-check.mjs https://staging-dars-api.coddycamp.uz` → 8d24e53, 0 ✗ kutiladi.
2. Axadulla'ga xabar: onFinished tayyor (TZ_LESSON_RESULT_DETAILS_RU §9) + 37069 uchun saqlangan JSON'da `questions/achievements` borligini ko'rsatsin.
3. §13 ning qolgan bandlari — qolgan test-akkauntlar (O-3 muzlatilgan, O-4 boshqa guruh, O-5 ikki guruh, T-1 TA, X-1 tayinlanmagan, V-1 vaqtincha) bilan; dalil `SINOV_PROTOKOLI_LMS.md` §4 jadvali; kuzatuv: scratchpad'dagi `lms-watch2.sh` naqshi (admin/api/sessions).
4. Foydalanuvchi: Telegram-bot (runbook 0.4), dump-dalili (Dozzle), CRM'ga 12 uy-vazifa yig'masi (ro'yxat CRM_YUKLASH_ROYXATI oxirida).
5. Keyin: rotatsiya so'rovi Axadulla'ga (SIRLAR_ROTATSIYASI §5 xat) → staging'da `jwt_next` ✓ → cutover kuni: `cutover-mashq --url https://dars-api.coddycamp.uz --out lms --smoke`, CRM'ga 90 fayl, demo/mentor-saytlar qayta build, `sync main` + GitLab deploy tugmasi.
6. Alohida reja: M7 13 dars (jonli modulsiz, v16); arena savollari onFinished'da yo'q (Axadulla xohlasa).

**Foiz ≈ 82.** Qolgan 18 %: §13 to'liq sinov, rotatsiya, cutover kuni, sinov-tuzatishlari.

**Ish-uslubi (foydalanuvchi talabi):** har jarayondan keyin qisqa hisobot, keyingi ishga tasdiq; shoshilmasdan; commit/push/sync faqat buyruq bilan (sync = staging avto-deploy; `main` = prod, faqat cutover).
