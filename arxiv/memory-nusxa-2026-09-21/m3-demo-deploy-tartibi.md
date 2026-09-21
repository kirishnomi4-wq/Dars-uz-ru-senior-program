---
name: m3-demo-deploy-tartibi
description: "3-Modul demosi (coddycamp-3modul.vercel.app) deploy tartibi — vite build dist-m3/.vercel ni o'chiradi, tiklash shart; parallel seans bo'lsa faqat o'z hunk'lari commit qilinadi"
metadata: 
  node_type: memory
  type: project
  originSessionId: c12b52d4-f896-43a0-9112-f4b293228855
  modified: 2026-08-20T13:25:21.121Z
---

3-Modul demosi: `npx vite build --config vite.m3.config.js` → `dist-m3/`, keyin
`npx vercel deploy --prod --yes --cwd dist-m3` (auth: `kirishnomi4-6915`, loyiha `azizbek10` team'ida).

**Why:** `vite build` `dist-m3/`ni butunlay tozalaydi — `.vercel/project.json` (loyiha-bog'lanish) va
`index.html` (Vercel ildizda kutadi) o'chib ketadi; tiklanmasa deploy yangi loyiha yaratadi yoki 404 beradi.
Qiymatlar: projectId `prj_TaMip6SSwe7pkJ5iWjgqsoM4RmwH`, orgId `team_wLZPVKNuvFDTVgcDUKxQU0SD`,
projectName `coddycamp-3modul`; `cp dist-m3/modul3.html dist-m3/index.html`.

**How to apply:** build → project.json + index.html tikla → deploy → tekshir: prod `index.html`dagi
chunk-nomi lokal bilan mos, dars-chunk'i HTTP 200 va ichida tuzatish-naqshi bor (`vercel inspect` →
`target production`). Parallel seans umumiy fayllarni (ETALON/STATE/jsx-lint) tahrirlayotgan bo'lsa,
faqat o'z hunk'ini stage qil (`git diff > patch`, kerakli hunk'ni ajrat, `git apply --cached --recount`).
Bog'liq: [[parallel-seans-modul-chegarasi]] · [[darslar-holati]] · [[no-commit-without-approval]]
