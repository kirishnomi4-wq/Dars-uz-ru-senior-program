---
name: fb-demo-deploy-tartibi
description: "«Frontend-Backend darslari» demosi (coddycamp-frontend-backend.vercel.app) — 4-Modul=lokal 3-Modull, 5-Modul=lokal 4-Modull; vite.fb.config.js → dist-fb; 2026-08-21 yaratildi"
metadata: 
  node_type: memory
  type: project
  originSessionId: f6d85fef-7d77-4277-bd6e-f299f2bb9664
  modified: 2026-08-21T14:57:41.240Z
---

Yangi prod-demo (2026-08-21): **https://coddycamp-frontend-backend.vercel.app** — loyiha `coddycamp-frontend-backend`,
`azizbek10` team (`team_wLZPVKNuvFDTVgcDUKxQU0SD`), projectId `prj_pd9s27RlnNkx78HP27E5TvmGIFnx`.
Kirish: `frontend-backend.html` → `src/fb-demo/FbDemoMain.jsx` → `FbDemoApp.jsx` (katalog UZ-RU, `cc_lang`).
Ko'rsatish-nomlari foydalanuvchi talabi: **«4-Modul — Frontend: React»** = lokal `src/3-Modull` darslari (hash `fe-01…`),
**«5-Modul — Backend: Node-Express + PostgreSQL»** = lokal `src/4-Modull` darslari (hash `be-01…`). Tartib App.jsx bilan bir xil.

**Why:** 3- va 4-Modul darslari yaxshilangach bitta URL'da, foydalanuvchi nomlagan modul-raqamlari bilan prodga chiqarish kerak edi.
2026-08-21 kechqurun: PmLesson11-14 UZ-RU tugadi (ru-gate + ru-walk darvozalaridan o'tdi), demo jonli
`src/4-Modull/` fayllariga o'tkazildi va qayta deploy qilindi - endi 30/30 dars ikkala tilda.
Tarjimadan oldingi UZ nusxalari: `arxiv/pm11-14-uz-baseline-2026-08-21/` (ru-gate baseline'i).

**How to apply:** `npx vite build --config vite.fb.config.js` → `cp dist-fb/frontend-backend.html dist-fb/index.html` →
`.vercel/project.json` tiklash (build papkani tozalaydi) → `npx vercel deploy --prod --yes --cwd dist-fb --scope team_wLZPVKNuvFDTVgcDUKxQU0SD`
→ tekshir: prod index chunk-nomi lokal bilan mos, 31 chunk HTTP 200, brauzerda katalog UZ/RU (scratchpad `prodcheck.mjs` naqshi,
playwright-core absolyut import). Dark-lint `.m1-tab.on #0E0E10` — M34DemoApp bilan bir xil, qabul qilingan.
Bog'liq: [[m3-demo-deploy-tartibi]] · [[m4-demo-deploy-tartibi]] · [[pm-ru-i18n]] · [[no-commit-without-approval]]

**2026-08-22:** saytga uchinchi modul qo'shildi — **«6-Modul — Backend: NestJS + Testlash + CI/CD Deploy»**
(RU: «6-Модуль — Backend: NestJS + Тестирование + CI/CD Deploy»), hash `nb-01…nb-15`:
lokal `src/4a-Modull` (4 dars) + `src/4b-Modull` (3) + `src/4c-Modull` (8) bitta ketma-ket ro'yxatda.
Shu bilan birga `PmLesson15–18` UZ-RU qilindi — endi saytdagi 45 darsning hammasi ikki tilda.
Deploy tartibi o'zgarmagan (build → `index.html` nusxasi → `.vercel/project.json` tiklash → `vercel deploy --prod`).
