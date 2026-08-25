# 4-M — LMS'ga yuklash ro'yxati

> **Bu papka = LMS kursidagi `4-Modul`** — 4-Modul — Frontend: React
> Manba: src/3-Modull (+ src/pm) · Tartib: `src/fb-demo/FbDemoApp.jsx` (haqiqiy dars tartibi).
> Papkadagi **14 ta `.jsx`** faylning HAMMASI yuklanadi. Boshqa hech narsa kerak emas:
> har fayl o'zi-yetarli (faqat `import … from "react"`), ⚙ belgisi — kompilyator ichida.

| # | Tur | Fayl | Dars | lessonId | Hajm |
|---|---|---|---|---|---|
| 1 | Kod | `ReactIntroLesson.jsx` | React nima va nima uchun? | `react-intro-01-v18` | 362 KB |
| 2 | PM | `PmUserStoryLesson.jsx` | User Story: kim va nima uchun? | `pm-m3d2-v3` | 478 KB ⚙ |
| 3 | Kod | `ReactFirstComponentLesson.jsx` | Birinchi komponent | `react-first-component-02-v18` | 329 KB |
| 4 | Kod | `ReactStateEffectLesson.jsx` | State va Effect | `react-state-effect-03-v18` | 317 KB |
| 5 | PM | `PmLesson8.jsx` | Qaysi ishni birinchi qilasiz? | `pm-m3d5-v1` | 312 KB |
| 6 | Kod | `ReactPropsReuseLesson.jsx` | Props va qayta ishlatish | `react-props-reuse-04-v18` | 326 KB |
| 7 | Proyekt | `ReactCrudPracticeLesson.jsx` | Praktika: AI bilan to'liq CRUD | `react-crud-practice-p1-v18` | 309 KB |
| 8 | Kod | `ReactApiGetLesson.jsx` | API bilan ishlash — GET | `react-api-get-05-v18` | 322 KB |
| 9 | Kod | `ReactApiPostLesson.jsx` | API — POST / PUT / DELETE | `react-api-post-06-v18` | 366 KB |
| 10 | PM | `PmLesson9.jsx` | Qachon «tayyor» deb ayta olamiz? | `pm-m3d10-v1` | 444 KB ⚙ |
| 11 | Proyekt | `ReactRouterPracticeLesson.jsx` | Praktika: React Router | `react-router-practice-p2-v18` | 323 KB |
| 12 | Proyekt | `ReactProjectDayLesson.jsx` | Loyiha kuni — AvtoIjara | `react-project-day-p3-v18` | 325 KB |
| 13 | Proyekt | `ReactBuildSiteLesson.jsx` | Final loyihani bo'laklash va qurish | `react-build-site-final-p4-v18` | 316 KB |
| 14 | PM | `PmLesson10.jsx` | Ishlayotgan saytingizni qanday ko'rsatasiz? | `pm-m3d14-v1` | 320 KB |
| 15 | Rezerv | — | *(fayl yo'q — Zaxira dars)* | | |
| 16 | Demo | — | *(fayl yo'q — Demo Day)* | | |

## Qoidalar

- **Bu papkani QO'LDA to'ldirmang.** Fayllar `build-lms` chiqishi:
  `node scripts/build-lms.mjs src/3-Modull/<Dars>.jsx`
  Yig'uv shu papkaga yozadi — ildizda (`lms/`) nusxa QOLMAYDI, shuning uchun eski faylni
  adashib yuklab yuborish xavfi yo'q.
- **Tahrir manbaga kiritiladi**, keyin dars qayta yig'iladi. Yig'ilgan faylni tahrirlash — behuda.
- Yuklashdan oldin: `npm run smoke:lms` — har fayl brauzerda ochilib tekshiriladi.
- `Rezerv` va `Demo` kunlarida fayl yo'q — ular dars-fayli talab qilmaydi.
