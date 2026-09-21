---
name: m4-demo-deploy-tartibi
description: "4-Modul demosi (coddycamp-4modul.vercel.app) deploy tartibi — vite.m4.config.js → dist-m4, yangi Vercel loyihasi 2026-08-21 da yaratildi"
metadata:
  type: project
---

4-Modul demosi: `npx vite build --config vite.m4.config.js` → `dist-m4/`, keyin
`cp dist-m4/modul4.html dist-m4/index.html` → `npx vercel deploy --prod --yes --cwd dist-m4 --scope team_wLZPVKNuvFDTVgcDUKxQU0SD`.
URL: https://coddycamp-4modul.vercel.app (loyiha `coddycamp-4modul`, `azizbek10` team, 2026-08-21 da yaratildi).
Kirish: `modul4.html` → `src/m4-demo/M4DemoMain.jsx` → `M34DemoApp only={['m4']}` (katalog `src/m34-demo/M34DemoApp.jsx`da).

**Why:** 3-Modul bilan bir xil muammo — `vite build` `dist-m4/`ni tozalaydi, `.vercel/project.json` va `index.html` o'chadi.
Qiymatlar: projectId `prj_2R1h3JKiGyoj4IWHTAWap2OF3FJs`, orgId `team_wLZPVKNuvFDTVgcDUKxQU0SD`, projectName `coddycamp-4modul`.
`vercel link` `dist-m4/`ga `.env.local` + `.gitignore` tashlaydi — deploydan oldin o'chirish kerak.

**How to apply:** build → project.json + index.html tikla → deploy → tekshir: prod `index.html` chunk-nomi lokal bilan mos,
dars-chunk HTTP 200. Katalog-sarlavhalar `App.jsx` bilan tengligini ko'r (m4-12/m4-15 2026-08-21 da tenglashtirildi).
Bog'liq: [[m3-demo-deploy-tartibi]] · [[darslar-holati]] · [[no-commit-without-approval]]
