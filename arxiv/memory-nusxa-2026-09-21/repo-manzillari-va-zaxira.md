---
name: repo-manzillari-va-zaxira
description: "2026-09-08: kutish-rejasi ishi 3 commit (549a91f/e98941a/1477075, main=1477075); 2026-09-07 Kali: tiklangan ish 3 commit bilan PUSH QILINDI (dd00528, origin SSH, kalit GitHub'da);  haqiqiy repo = github.com/kirishnomi4-wq/Dars-uz-ru-senior-program (main ff2382c, 2026-08-25); 25-avg…3-sen oralig'idagi UNCOMMITTED ish (backend server/, src/live, pilot, uy-vazifa komponentlari, mentor-sayt, JAVOB v2-v5) Windows seans-yozuvlari + file-history'dan TIKLANDI va tekshirildi (unit 45, int 60, E2E 16+10); hali commit qilinmagan"
metadata:
  type: project
---

**Holat (2026-09-07 kech):** ish Kali Linux'da, `/home/kali/Desktop/internetLesson`. Origin endi
`https://github.com/kirishnomi4-wq/Dars-uz-ru-senior-program.git` (main = ff2382c, 25-avgust, 109 commit);
eski Azizbekcrypto klon `eski-azizbek` remote + `eski-kali-klon` shoxchasida qoldi (foydasiz).
Windows manzili `C:\Users\ADMIN\internetLesson` edi; commit'lar u yerdan shu repo'ga push qilingan (oxirgisi 25-avg).

**Tiklash (2026-09-07):** 25-avgust commit'idan keyingi ish Windows'da uncommitted edi. Manba: Telegram Desktop'dagi
`claude-backup.zip` (Windows `.claude/`: seans-yozuvlari + `file-history/`). Qoida: file-history snapshot = tahrirdan
KEYINGI holat (checkpoint), yakuniy fayl = oxirgi snapshot + undan keyingi Write/Edit/heredoc/python/sed/node -e.
Skriptlar scratchpad'da edi (assemble2.py, late2.py) — qayta kerak bo'lsa memory'dagi qoida yetarli.
Tiklangan: `server/` (62 fayl), `src/live/`, `src/mentor/` + `scripts/gen-mentor.mjs`, `src/hw-demo/`, `src/*/Pm*.homework.jsx`
(m1-02, m1-05, m1-12, m2-*, m3-*, m4-*, 4a/4b/4c), M1 darslariga uy-vazifa ilgaklari, `pm-senariylar/*-UY.md`, `pilot/`,
`tools/e2e-*.mjs`, `scripts/codemod-live-module.mjs`, `lms-harness.html`, `BACKEND_REJA_UZ.md`, `SINOV_PROTOKOLI_LMS.md`,
`.github/workflows/server-tests.yml`, JAVOB v2–v5, `lms bilan avtomatlashtirish/` (LMS hujjatlari, README_INDEX), `uyga-vazifa/` (Telegram zip),
`.env.coddycamp.local` (8 kalit, gitignored), jurnal-appendlar (PIPELINE_STATE, PM_PIPELINE_STATE, DARS_ETALON +28 qator, KATTA_TOZALASH).
Hosilalar generator bilan: `npm run gen:mentor` → src/mentor/lessons.jsx · `node scripts/gen-lesson-catalog.mjs` → server/data/lesson-catalog.json ·
pilot bundle `node scripts/build-lms.mjs pilot/src/InternetLesson.liveToken.jsx` + `mv lms/…liveToken.jsx pilot/` · `node pilot/demo-build.mjs` → pilot/demo.html.
Tiklanmagan: `~/.ssh/dars_do` (Windows'da), Windows scratchpad'lar. Qator-oxirlari LF'ga keltirildi (snapshotlar CRLF edi).

**Tekshirildi (Kali, 2026-09-07):** server unit 45/45 · integratsion 60/60 · E2E LMS 16/16 · E2E PIN 10/10 · pilot smoke 5 holat ·
esbuild-gate: faqat src/main.jsx (MvpBuild2Lesson 127-qator dublikat kalit ogohlantirishi — 25-avg holatidan qolgan) ·
jsx-lint 25 xato 7 faylda = ma'lum «o'lik kalit» (cutover'gacha) · til/dark lint butun-src rejimida eski topilmalar (per-file rejimda ishlatiladi).

**Kali muhiti:** Docker YO'Q; PostgreSQL 18 binarlari `/usr/lib/postgresql/18/bin`, sinov-klaster foydalanuvchi huquqida:
`initdb -D <dir> -U kali --auth=trust` → `pg_ctl -D <dir> -o "-p 5433 -k /tmp/claude-1000/pgsock" start` → role `dars`/`dars`, bazalar `dars_dev`, `dars_test`
(2026-09-07 klaster scratchpad'da edi — keyingi seansda qayta yaratiladi). `server/.env` = .env.example + dev LMS qiymatlari (SCHOOL_API_URL=127.0.0.1:3999).
Vite: `npx vite` uy-papkadagi boshqa nusxani oladi → `node node_modules/vite/bin/vite.js --port 5300` ishlatilsin (loyiha vite 8.1.0).
Chrome `/usr/bin/google-chrome`; e2e/pilot skriptlari `CHROME=` env o'zgaruvchisini oladi (2026-09-07 patch), `pilot/*.mjs` ROOT=process.cwd().
E2E tartibi: `server/tools/fake-school-api.mjs` (3999) + `node --env-file=.env src/index.js` (3001) + vite (5300) → `CHROME=… node tools/e2e-lms.mjs`.
Jarayonlarni `pkill -f` bilan o'ldirganda o'z qobig'ini ham o'ldiradi — PID orqali yoki alohida skript-fayldan.

**Yakun (2026-09-07 kech):** 3 commit push qilindi — 8ececf6 (LMS backend+live+pilot), afef935 (uy-vazifa+mentor-sayt), dd00528 (jurnallar); origin/main = dd00528. Origin endi SSH: `git@github.com:kirishnomi4-wq/Dars-uz-ru-senior-program.git`, Kali `~/.ssh/id_ed25519` kaliti kirishnomi4-wq akkauntiga qo'shilgan (HTTPS push ishlamaydi — token yo'q). Endi hamma narsa ikki joyda.

**Why:** Windows→Kali ko'chishda eski klon ochilgan, backend faqat seans-yozuvlarida edi. **How to apply:** har seans oxirida buyruq bilan commit + `git push origin main` (SSH tayyor); keyingi ish = droplet, staging, LMS §13 sinovi. [[coddycamp-integratsiya-sirlari]] [[uyga-vazifa-etalon]] [[mentor-sayt-deploy]]


**2026-09-08:** yana 3 commit — 549a91f (server: Docker/GitLab, 0005, verify) · e98941a (97 dars codemod, recordAttempt, o'lik kalitlar) · 1477075 (hujjatlar). Ishchi daraxt toza. PG18 sinov-klasteri retsepti ishladi (pgdata scratchpad'da, 5433; klaster seans bilan yo'qoladi — keyingi seansda qayta initdb). Repo ildizida tracked axlat: `--apply` (280 KB) va `C` (0 B) — 2026-09-07 tiklashdan qolgan, KATTA_TOZALASH nomzodi.
**PUSH HOLATI 2026-09-08:** 3 commit FAQAT LOKAL (1477075) — `git push origin main` auto-rejim klassifikatori tomonidan 2 marta bloklandi; foydalanuvchi o'zi `! git push origin main` qiladi yoki keyingi seansda birinchi ish. GitLab sync shart emas (server/ bir xil).
**2026-09-08 (kech):** yana 3 commit — f3f9d2c (server: RESULT_DETAILS, staging-check, Docker seed, TRUST_PROXY) · 50c822a (eski/1-Modull ko'chirish, cutover-mashq, smoke-skriptlar) · b849ca7 (docs). main=b849ca7, origin/main=dd00528 → **6 commit PUSH KUTILMOQDA** (foydalanuvchi `! git push origin main`). Darvozalar: vite build 116 chunk toza (vite 8 rolldown — 1,7 s normal), unit 51, int 66, jsx/prompt-lint 0. PG18 klaster 5433 scratchpad'da (seans bilan yo'qoladi). Mashq-chiqishlar scratchpad `lms-mashq/` (tashlab yuborsa bo'ladi).
**2026-09-08 14:40 PUSH QILINDI:** origin/main = f395040 (dd00528..f395040, 9 commit: server RESULT_DETAILS/staging-check/Docker, darslar, docs, Kristina infra qabul, lms pilot + 12 uy-vazifa yig'masi). Ishchi daraxt toza. GitLab staging = 91c93f6e (deploy ✓).
**2026-09-08 kun yakuni:** origin/main = d9aa9ab (bugun jami 13 commit push qilindi: server RESULT_DETAILS/staging-check/Docker/TRUST_PROXY/admin-sessiyalar, 97 dars onFinished-detallari, lms pilot + 12 uy-vazifa, cutover-mashq, vite-konfiglar, hujjatlar). 2 hujjat (STAGING_QABUL, BACKEND_REJA) uncommitted — ertaga birinchi commit. GitLab staging 16f8284.
