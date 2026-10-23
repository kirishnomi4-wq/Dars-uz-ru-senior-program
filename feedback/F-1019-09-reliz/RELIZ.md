# F-1019-09 · LMS prod relizi 2–14-Modul · 19.10.2026

**Paket:** `yuklash-2026-10-19-prod/yakka/` — 172 dars (13 modul papkasi, har birida `ROYXAT.md`: tartib, nom, lesson_id, md5). Yig'ma 09:18, undan keyin src o'zgarmagan.
**Commit:** `be0b14bd` (push YO'Q).
**Fayl nomlari:** foydalanuvchi so'rovi bilan hammasiga `-v3` (`NN-Dars-v3.jsx`) — CRM'dagi `-v2` lardan ajralsin; mazmun/md5 o'zgarmagan, ROYXAT.md lar yangilangan.
**Tekshiruv** (`preview-reliz.mjs --api prod --moduls 2-14`, HISOBOT.md): unit 24/0 · preview-keys ✓ · yig'ish 172 · statik 172 (API=prod) · smoke-lms ✗0 · smoke-preview 172/172.
«ro'yxat» ✗ — yig'ma boshida eski katalog o'qilgan; katalog qayta yig'ildi (183 dars), 172 lesson_id hammasi bor, takror yo'q (qayta tekshirildi).

## Nega server katalogi SHART
Server faqat katalogdagi darsni ochadi (jonli rejim, natija). GitLab `main` dagi katalog — 20.09 (110 dars). Relizdagi **79 dars** unda yo'q:
9–14-Modul hammasi (76) + m1-12 `pm-pitch-03-v20` + m2-13 `pm-m2d13-v2` + m5-14 `pm-m5d11-metrika-v1`.
Oxirgi sync (monorepo b2da94e) dan beri `server/` da faqat `data/lesson-catalog.json` o'zgargan — kod o'zgarmagan.
Seed yangi katalogni yozadi, katalogda yo'q eski id'larni `active=false` qiladi (o'chirmaydi): m1-12 va m2-13 ning eski versiyasi va 8 ta pitch `-v1`.

## Tartib (siz yurgizasiz)
1. GitHub (ixtiyoriy, zaxira): `! git push origin main`
2. GitLab darvozasi (push yo'q, faqat tekshiruv): `! bash scripts/sync-dars-api.sh main --check` → «darvoza OK» bo'lishi kerak.
   «TO'XTADI … begona commit» chiqsa — avval `! bash scripts/pull-dars-api.sh main`, keyin menga ayting.
3. Sync: `! bash scripts/sync-dars-api.sh main` → «push qilindi → main».
4. GitLab'da prod deploy — qo'lda (LMS jamoasi bilan kelishuv): pipeline → deploy job. Seed logida: `[seed:catalog] 183 dars`.
5. **Darhol** CRM'ga yuklash: avval m1-12 (2-Modul/12) va m2-13 (3-Modul/13) — ularning eski versiyasi seed'dan keyin nofaol; keyin qolganlari modul tartibida. `ROYXAT.md` dagi ☐ ni belgilab boring.
6. Prod smoke: har moduldan 1 dars LMS'da (o'quvchi + mentor) — dars ochiladi, jonli belgi, «Tamom» → natija ketadi.
Qaytish: eski fayllar CRM'da (yoki `yuklash-2026-10-04/`); server — GitLab'da oldingi pipeline'ni qayta deploy.

## Holat (19.10 11:09)
- GitLab `main` = `e1a9fa7` (sync: server/ @ be0b14bd, faqat `data/lesson-catalog.json`) — foydalanuvchi `sync-dars-api.sh main`.
- Pipeline #2961759103: test ✓ · build ✓ · deploy ✓ (job #17273914930, manual, 32 s).
- Prod health (`dars-api.coddycamp.uz/api/v1/health`): status ok · env prod · version `0.1.0+e1a9fa70` · db ok · migrations 9 · **catalog 183** (faol).
- Keyingi: CRM'ga yuklash (`-v3` fayllar), avval m1-12 va m2-13; keyin prod smoke.

## Qayta yig'ma (F-1019-10 dan keyin, 19.10 12:45)
`preview-reliz --api prod --moduls 2-14 --suffix v3` (foydalanuvchi) → **O'TDI ✓**: ro'yxat 172 ✓ (katalog 19.10) · unit 24/0 · yig'ish 172 (`-v3`) · statik ✓ · smoke-lms ✗0 · smoke-preview 172/172. Commit `6df7225c`.
Server: GitLab `main` = `54e7b37` (sync @ 6df7225c) → deploy ✓, prod health `0.1.0+54e7b37f`, catalog 183.
Yuklash: boshqa seans (Claude + brauzer). VS Code — qayta (eski 05a99dba → yangi dde2ea5d). InternetLesson o'zgarmagan (4b13e741).
