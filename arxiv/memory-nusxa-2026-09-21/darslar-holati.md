---
name: darslar-holati
description: "Platforma darslarining umumiy holati — qaysi modullar etalon v18'da, nima qolgan (eski mashina 2026-07-18 + hozirgi 2026-07-23 birlashtirilgan)"
metadata: 
  node_type: memory
  type: project
  originSessionId: c0edd3e6-e97f-4f1c-9d67-b34e8de431a5
  modified: 2026-08-01T10:17:51.091Z
---

Holat (2026-07-23 birlashtirilgan):

**Etalon v18'da (eski mashinada rol-pipeline bilan chiqarilgan):** 1-Modul (10 dars, Htmllesson1 = oltin etalon) · 2-Modul (13, JS-6 + PM4-6 + Practice1-4) · 3-Modul React (10) · 4-Modul (11) · 4a/4b/4c · 5-Modul Bot (8) · 6-Modul (10, metaforalar: SHAHAR/SUPER-KUCH KARTASI/GASTROL). Barcha darslarda CodeStrike neon-brend.

**Hozirgi mashinada qo'shilgan (2026-07-22/23):** UZ-RU i18n 49+ dars ([[ru-i18n-konvensiya]]) · PM etalon-uchlik 6-yaxshilash + jonli-ko'rik feedback ([[pm-etalon-yaxshilash]]) · 1-Modulga 2 YANGI dars: HtmlTakrorlashLesson (m1-14, 5-o'rin, «HTML ustaxonasi» 5 mijoz-kompilyator) + VsCodeLesson (m1-15, 10-o'rin, 6-qadam, yashil vizitka-card) — 2026-07-23 UNCOMMITTED, jonli-sinov kutilmoqda. Tartib: CssPractice 11 → Git 12.

**Qolgan v16/yozilmagan (eski jurnal 2026-07-18 bo'yicha, tekshirish kerak):** 7-Modul MvpArch/MvpBuild1/MvpBuild2/MvpIterate · 8-Modul m8-08/09/10 (fayl yo'q). RU'siz: PM darslar (PmStructure/PmPitch, PmLesson4-31, InternetLesson) + 5/6/7-modullar.

**Demo-URLlar (Vercel, alohida loyihalar):** https://coddycamp-3modul.vercel.app (**2026-08-19 dan 3-Modul, 16 slot, UZ-RU** — sinovchiga berildi; `vite.m3.config.js` -> dist-m3, kirish `modul3.html` -> deployda index.html; app `src/m3-demo/M3DemoMain.jsx` M34DemoApp ni `only={['3']}` bilan chaqiradi; loyiha `coddycamp-3modul`) · https://coddycamp-etalon-test.vercel.app (FAQAT 2 dars: PmLesson2 + PmUserStory; `vite.etalon-test.config.js` → dist-etalon-test, kirish `etalon-test.html`, app `src/etalon-test-demo/`; deploy'da etalon-test.html → index.html deb nomlanadi — 2026-07-30) · https://coddycamp-pm-darslar.vercel.app (3 PM etalon; build: `npx vite build --config vite.pm.config.js`) · https://coddycamp-1modul.vercel.app (**2026-08-01 dan 1+2-Modul, 30 slot / 27 ochiladigan dars** — nom «1modul» tarixiy, o'zgarmadi; katalog `src/m1-demo/M1DemoApp.jsx` dagi `MODULES` massivi, katalog matni ham UZ-RU; `vite.m1.config.js` → dist-m1, kirish `modul1.html` → deploy'da index.html deb nomlanadi; loyiha-id `prj_pc7ChRo5KoKDfui4HVTXJmZDQ9dT`) · https://coddycamp-texnik-darslar.vercel.app (QA-ko'rik: 1–6 modul BARCHA 70 texnik dars UZ-RU, PM'siz; `vite.texnik.config.js` → dist-texnik, kirish: `texnik.html`, app: `src/texnik-demo/` — 2026-07-30, UNCOMMITTED). Deploy: dist-papkani scratchpad-katalogga ko'chirib, kerak bo'lsa kirish-html'ni index.html deb nomlab, `vercel link --project <nom> --scope azizbek10 --yes` → `vercel deploy --prod --yes` (hisob: kirishnomi4/azizbek10). `vercel` CLI global o'rnatilgan (2026-08-01), lekin Git-Bash PATH'ida yo'q — `"$APPDATA/npm/vercel.cmd"` deb chaqiriladi. `vercel link` `.env.local` (OIDC token) yaratadi — deploy'dan oldin o'chirib tashlanadi.

**2026-07-28 (P83):** M1 v2-darslar O'CHIRILDI (PmAudienceLesson/PmStructureLesson/PmPitchLesson) — foydalanuvchi buyrug'i bilan slotlar PmLesson1/2/3'ga qaytarildi (App.jsx, M1DemoApp, SolishtirApp). Keyingi reja: PmLesson1/2/3 ni PM_DARS_ETALON qonun 1–86 bo'yicha optimallash (retsept C). UNCOMMITTED.

**Eski mashina arxivi:** `.claude/claude_backup.tar.gz` (repo ichida, 255MB) — 16 loyiha, 1093 sessiya-tarix; biror eski suhbat/qaror kerak bo'lsa shu yerdan qidiriladi.
