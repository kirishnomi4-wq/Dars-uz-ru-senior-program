# F-1120-01 — DAVOM (yangi seans shu yerdan boshlaydi)

**Holat sanasi:** 21.11.2026 02:20 (prod TIKLANDI ✅ · CRM 98/98 YUKLANDI ✅ · muhrlandi; commit kutilmoqda) · to'liq tarix: `JURNAL.md` (shu papka)
**Doira:** faqat AI Startup (LMS 2–14-Modul darslari). New Junior'ga TEGILMAYDI. Bridge fayllari — boshqa seansniki.

## Muammo (qisqa)
Jonli darsda yakuniy test javobi serverga 2 marta ketardi: `recordAnswer` avval `submitAnswer(…, 0, true, 0)` yuborardi
(doim A variant, vaqt 0), server birinchisini qotirardi → to'g'ri javob «A, xato, 0 s». Qolgan darslarda yakuniy test vaqti 0.

## Bajarildi (commit'lar)
- `b4320a99` — 96 dars + skelet NamunaDars (codemod `codemod-f1120.mjs`)
- `5cf99e5f` — yana 2 dars (FullstackFeedback m4-14, PipelineProject m6-08) + jsx-lint c3 qoidasi
- `86335ad6` — jsx-lint `warn` darajasi (bridge'da c3 vaqtincha 🟡) + tiklash SQL + CRM csv
- `241a156f` — jurnal
- Sinov: gates (yangi yiqilish 0), jonli brauzer `e2e-f1120.mjs` (6 dars TOZA, eski kod xatoni qaytaradi)
- Paket: `yuklash-2026-11-20-prod/` — 98 dars, smoke-lms ✓, smoke-preview 98/98, **O'TDI ✓**

## NAVBAT (tartib bilan)
1. ✅ **CRM'ga yuklash — BAJARILDI 21.11** (196/196 qator, terminal md5 ✓, muhr `claude-F-1120-01`; 0021 kerak emas — 01:00 dan keyin urinish 0). Commit: LMS_REESTR.json, LMS_DEPLOY_JURNAL.md, yuklash-2026-11-20-prod/yuklangan.csv — buyruq bilan.
   Eski reja — foydalanuvchi yuklovchi seansga beradi: `yuklash-2026-11-20-prod/` + `YUKLASH_PROTOKOLI.md`.
   - README «server AVVAL SHART» — boshqa seansning commitsiz 10 bridge-tex katalog id'si sabab; bizning 98 dars uchun server deploy KERAK EMAS.
   - Dars yo'q paytda yuklash (yangi versiya o'quvchiga darhol ko'rinadi).
   - Yuklangach: `node scripts/lms-farq.mjs muhrla yuklash-2026-11-20-prod/yuklangan.csv --kim <seans>` → reestr + `LMS_DEPLOY_JURNAL.md`;
     commit (LMS_REESTR.json, LMS_DEPLOY_JURNAL.md) — foydalanuvchi buyrug'i bilan.
   - 20.11 19:54 holati: `yuklangan.csv` da `yuklandi` ustuni BO'SH — hech narsa yuklanmagan.
2. ✅ **Prod bazani tiklash — BAJARILDI 21.11 01:17** (prod `6f9d1be5`, ▶ foydalanuvchi; foydalanuvchi qarori: yuklashdan OLDIN).
   - Natija (oldin/keyin, faqat o'qish): git-github +81, practice-02 +111 — 192 urinish = CRM csv 192/192; boshqa o'zgarish 0.
   - 🔴 QOLDIQ: yuklash tugaguncha eski kod yangi soxta qatorlar yozadi → yuklashdan keyin o'lchab, kerak bo'lsa `0021` (shu SQL, yangi raqam;
     0020 qayta yurmaydi) + CRM ro'yxatga qo'shimcha. Sync/staging-check FAQAT toza worktree'dan (asosiy `server/` da Junior 0019).
   - Eski tafsilot (prod'ga YOZISH — faqat foydalanuvchi aniq ruxsati bilan):
   - `0020_f1120_javob_tuzatish.sql` → `server/migrations/` ga ko'chirish → server sync + GitLab deploy (deploy.sh migratsiyani yurgizadi).
   - Kutilgan: ball ~192 qator (git-github-v19 s14 · practice-02-ai-promo-v18 s7), vaqt N qator; NOTICE logda.
   - Raqam 0020 — Junior seansining commitsiz `server/migrations/0019_junior_sinf.sql` bilan to'qnashmaslik uchun. Ko'chirishdan oldin
     `ls server/migrations` — 0020 band bo'lsa raqamni o'zgartir.
   - Lokal sinov (rollback bilan) o'tgan: ball 2, vaqt 11, takror 0.
   - Keyin tekshiruv: `v_lesson_results` (yukla.mjs) — deficit 0 bo'lishi kerak.
3. **CRM ro'yxati** `crm-tuzatish-royxat.csv` (192 qator, ismsiz) — foydalanuvchi o'zi CRM jamoasiga yuboradi
   (LMS'ga ketgan natijani biz o'zgartira olmaymiz: o'zgargan payload → 409). Xat taklif qilinmaydi.
4. ✅ **Bridge patch QO'LLANDI 21.11** (zaxira `bridge-zaxira-oldin/`, c3 istisnosi olindi, lint:jsx toza; emoji — eski). Bridge fayllari commitsiz (boshqa seans), sayt deploy qilinmagan.
   Eski reja — `bridge-f1120.patch` (5 fayl: BridgeTexAiSayt, BridgeTexGit, BridgeTexAvtoIjaraReact, BridgeTexPostgres,
   BridgeTexSaytQurish). Fayllar boshqa seansda commitsiz (`??`). O'sha seans tugagach: `git apply -p1 …` (yoki codemod qayta) →
   gates → jsx-lint.mjs dagi bridge warn-istisnosini (`c3warn`) olib tashlash.

## Alohida signallar (bu bug emas, ko'rilmagan)
- react-state-effect-03-v18 (m3-04) 20.11 — 11 urinishda bitta javob umuman YOZILMAGAN (dars davom etayotgan payt bo'lishi mumkin) — qayta o'lchash.
- 4 solo urinish (html-practice, pm-m2d7, internet-01, pm-m4d2) — bittadan, boshqa sinf.

## Vositalar
- Prod o'qish (ruxsat bor, faqat GET): `cd server && node --env-file=.env.deploy.prod ../feedback/F-1117-01-churn/dev/yukla.mjs https://dars-api.coddycamp.uz <papka> --from 2026-09-01 --views v_question_attempts,v_lesson_results`
- Lokal jonli sinov: server nusxasi (0019'siz) PORT=3011 + vite 5311; 3001 — AILM, TEGILMAYDI.
