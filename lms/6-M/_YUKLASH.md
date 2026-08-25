# 6-M — LMS'ga yuklash ro'yxati

> **Bu papka = LMS kursidagi `6-Modul`** — 6-Modul — Backend: NestJS + Testlash + CI/CD Deploy
> Manba: src/4a-Modull · src/4b-Modull · src/4c-Modull · Tartib: `src/fb-demo/FbDemoApp.jsx` (haqiqiy dars tartibi).
> Papkadagi **14 ta `.jsx`** faylning HAMMASI yuklanadi. Boshqa hech narsa kerak emas:
> har fayl o'zi-yetarli (faqat `import … from "react"`), ⚙ belgisi — kompilyator ichida.

| # | Tur | Fayl | Dars | lessonId | Hajm |
|---|---|---|---|---|---|
| 1 | Kod | `NestArchAliveLesson.jsx` | NestJS va arxitektura | `nest-arch-alive-4a-01-v18` | 356 KB |
| 2 | PM | `PmLesson15.jsx` | Hamma birdan kirsa, sayt chidaydimi? | `pm-m4a2-v1` | 459 KB ⚙ |
| 3 | Kod | `NestArchResourceLesson.jsx` | Boilerplate: Nest + PostgreSQL | `nest-arch-resource-4a-02-v18` | 328 KB |
| 4 | Proyekt | `NestArchPracticeLesson.jsx` | Praktika: yangi modul | `nest-arch-practice-4a-03-v18` | 357 KB |
| 5 | Kod | `JestUnitTestLesson.jsx` | Unit-test: Jest | `jest-unit-04b-01-v18` | 315 KB |
| 6 | PM | `PmLesson16.jsx` | Bitta xato — nechta odam ketadi? | `pm-m4b2-v1` | 349 KB |
| 7 | Kod | `EdgeCasesTestLesson.jsx` | Edge case va error path | `edge-cases-04b-02-v18` | 316 KB |
| 8 | Kod | `CiCdIntroLesson.jsx` | CI/CD nima va nega kerak | `cicd-intro-4c-01-v18` | 323 KB |
| 9 | PM | `PmLesson17.jsx` | Hammasini birdan chiqaraymi — yoki har hafta bo'lak? | `pm-m4c2-v1` | 475 KB ⚙ |
| 10 | Kod | `GithubActionsLesson.jsx` | GitHub Actions — asoslar | `github-actions-4c-02-v18` | 335 KB |
| 11 | Proyekt | `FullPipelineProjectLesson.jsx` | Loyiha kuni: to'liq lenta | `cicd-full-pipeline-4c-03-v18` | 306 KB |
| 12 | Proyekt | `AiPipelineProjectLesson.jsx` | Loyiha kuni: promptlar bilan | `cicd-ai-pipeline-4c-05-v18` | 318 KB |
| 13 | PM | `PmLesson18.jsx` | Saytingiz hozir ochilyaptimi? | `pm-m4c6-v1` | 349 KB |
| 14 | Proyekt | `FullProPipelineLesson.jsx` | Loyiha kuni: hammasi birga | `full-pro-pipeline-4c-04-v18` | 310 KB |
| 15 | Rezerv | — | *(fayl yo'q — Zaxira dars)* | | |

## Qoidalar

- **Bu papkani QO'LDA to'ldirmang.** Fayllar `build-lms` chiqishi:
  `node scripts/build-lms.mjs src/4c-Modull/<Dars>.jsx`
  Yig'uv shu papkaga yozadi — ildizda (`lms/`) nusxa QOLMAYDI, shuning uchun eski faylni
  adashib yuklab yuborish xavfi yo'q.
- **Tahrir manbaga kiritiladi**, keyin dars qayta yig'iladi. Yig'ilgan faylni tahrirlash — behuda.
- Yuklashdan oldin: `npm run smoke:lms` — har fayl brauzerda ochilib tekshiriladi.
- `Rezerv` va `Demo` kunlarida fayl yo'q — ular dars-fayli talab qilmaydi.
