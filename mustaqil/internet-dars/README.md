# Internet qanday ishlaydi — mustaqil nusxa (2026-10-14)

Bir kishining so'rovi bilan berilgan **alohida** dars. Asosiy tizimga (src/, LMS, App.jsx, dars-api) **daxilsiz**:

- `src/InternetLesson.jsx` — `src/1-Modull/InternetLesson.jsx` ning 2026-10-14 dagi nusxasi. Asl faylga qilingan
  o'zgarishlar bu yerga O'TMAYDI, bu yerdagilar u yerga o'tmaydi.
- `src/live/` — jonli-modul nusxasi, server o'chiq (`LIVE_ENABLED = false`): parol, PIN, mentor kirishi, rol tanlash yo'q.
  Dars ochilishi bilan boshlanadi. Hech qayerga tarmoq so'rovi ketmaydi.
- `public/mentor.png` — mentor avatari nusxasi (go.coddycamp.uz ga bog'liq emas).
- UZ / RU almashtirgich — `src/main.jsx`.
- 14.10 (2): 16 ekran — eski 1–14 + 15 `ScreenPractice` (kompilyator: <h1> ism + <p> bitta gap) + 16 yakun (CodeStrike).
  Eski 15–21 olib tashlandi; nishonlar: 🎯 firstwin · 💻 coder · 🏆 graduate. `src/compilator/HtmlCompiler.jsx` — asosiy loyihadan nusxa.

Build (repo ildizidan): `npx vite build --config mustaqil/internet-dars/vite.config.js` → `mustaqil/internet-dars/dist/`

## Sayt (2026-10-14)
**https://animatsiyon-darslik.vercel.app** — Vercel akkaunt kirishnomi6-9875, loyiha `animatsiyon-darslik`
(projectId `prj_ThYm690Gku703oRSlLlW9C75vj4f`, orgId `team_eMjzRKSHuQyrsksyNlH1aIJJ`).

Qayta deploy (build `dist/` ni tozalaydi — `.vercel` qayta yoziladi):
1. `npx vite build --config mustaqil/internet-dars/vite.config.js`
2. `mkdir -p mustaqil/internet-dars/dist/.vercel && echo '{"projectId":"prj_ThYm690Gku703oRSlLlW9C75vj4f","orgId":"team_eMjzRKSHuQyrsksyNlH1aIJJ","projectName":"animatsiyon-darslik"}' > mustaqil/internet-dars/dist/.vercel/project.json`
3. `npx vercel deploy --prod --yes --cwd mustaqil/internet-dars/dist`

UZ/RU tugmasi (E varianti): ≥1200px — o'ng tepa burchak, torroq — tepa markaz (y 1..25). 360–1920px, 22 ekran × 2 til o'lchangan — tegish yo'q.
