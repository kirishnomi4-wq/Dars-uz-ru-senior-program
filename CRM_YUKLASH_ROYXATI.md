# CRM'ga yuklash ro'yxati — `lms/` yig'malari (2026-09-07 holati, cutover'da qayta yig'iladi)

**Qoida (S-6):** bitta darsning UZ va RU materiali CRM'da BIR XIL faylga (bir xil `lesson_id`) ishora qilsin — til `lang` prop bilan keladi.
**2026-09-08 (cutover-mashqi):** `PmLesson9.shared.jsx` va `PmUserStoryLesson.shared.jsx` manbasi 3-Modul/pm — `build-lms` ularni `lms/4-M/` ga yig'adi (OUT_MAP). Ro'yxat shunga to'g'rilandi; `lms/` ildizidagi eski nusxalari cutover kuni O'CHIRILADI (aks holda eskisi yuklanadi). Yig'ish+tekshiruv: `node scripts/cutover-mashq.mjs --url <manzil> --out lms --smoke`.

**Cutover kuni:** `DARS_API_URL=<Kristina manzili> node scripts/build-lms.mjs <src fayl>` → `lms/` → CRM Media → material. `.shared.jsx` = umumiy kompilyator moduli bilan; `yakka` = kompilyatorsiz.

## 4-M — 16 fayl

| lms fayl | lesson_id | Sarlavha (uz) | Manba | Tur |
|---|---|---|---|---|
| `4-M/PmLesson10.jsx` | `pm-m3d14-v1` | pm-m3d14-v1 | `src/3-Modull/PmLesson10.jsx` | yakka |
| `4-M/PmLesson8.jsx` | `pm-m3d5-v1` | pm-m3d5-v1 | `src/3-Modull/PmLesson8.jsx` | yakka |
| `4-M/PmLesson9.jsx` | `pm-m3d10-v1` | Qachon «tayyor» deb ayta olamiz? | `src/3-Modull/PmLesson9.jsx` | yakka |
| `4-M/PmUserStoryLesson.jsx` | `pm-m3d2-v3` | User Story: kim va nima uchun? | `src/pm/PmUserStoryLesson.jsx` | yakka |
| `4-M/ReactApiGetLesson.jsx` | `react-api-get-05-v18` | react-api-get-05-v18 | `src/3-Modull/ReactApiGetLesson.jsx` | yakka |
| `4-M/ReactApiPostLesson.jsx` | `react-api-post-06-v18` | react-api-post-06-v18 | `src/3-Modull/ReactApiPostLesson.jsx` | yakka |
| `4-M/ReactBuildSiteLesson.jsx` | `react-build-site-final-p4-v18` | Praktika: Istalgan saytni qurish — bo'laklash + aniq prompt | `src/3-Modull/ReactBuildSiteLesson.jsx` | yakka |
| `4-M/ReactCrudPracticeLesson.jsx` | `react-crud-practice-p1-v18` | react-crud-practice-p1-v18 | `src/3-Modull/ReactCrudPracticeLesson.jsx` | yakka |
| `4-M/ReactFirstComponentLesson.jsx` | `react-first-component-02-v18` | Birinchi komponent: Vite, JSX, props | `src/3-Modull/ReactFirstComponentLesson.jsx` | yakka |
| `4-M/ReactIntroLesson.jsx` | `react-intro-01-v18` | React nima va nima uchun? | `src/3-Modull/ReactIntroLesson.jsx` | yakka |
| `4-M/ReactProjectDayLesson.jsx` | `react-project-day-p3-v18` | Praktika: Loyiha kuni — AvtoIjara | `src/3-Modull/ReactProjectDayLesson.jsx` | yakka |
| `4-M/ReactPropsReuseLesson.jsx` | `react-props-reuse-04-v18` | Props va qayta ishlatish | `src/3-Modull/ReactPropsReuseLesson.jsx` | yakka |
| `4-M/ReactRouterPracticeLesson.jsx` | `react-router-practice-p2-v18` | react-router-practice-p2-v18 | `src/3-Modull/ReactRouterPracticeLesson.jsx` | yakka |
| `4-M/ReactStateEffectLesson.jsx` | `react-state-effect-03-v18` | State va Effect: useState + useEffect | `src/3-Modull/ReactStateEffectLesson.jsx` | yakka |
| `4-M/PmLesson9.shared.jsx` | `pm-m3d10-v1` | Qachon «tayyor» deb ayta olamiz? | `src/3-Modull/PmLesson9.jsx` | shared |
| `4-M/PmUserStoryLesson.shared.jsx` | `pm-m3d2-v3` | User Story: kim va nima uchun? | `src/pm/PmUserStoryLesson.jsx` | shared |

## 5-M — 15 fayl

| lms fayl | lesson_id | Sarlavha (uz) | Manba | Tur |
|---|---|---|---|---|
| `5-M/ApiPostmanLesson.jsx` | `api-postman-04-06-v18` | API va Postman — front backend bilan qanday gaplashadi | `src/4-Modull/ApiPostmanLesson.jsx` | yakka |
| `5-M/AuthEnvLesson.jsx` | `auth-env-04-07-v18` | Autentifikatsiya va .env — login, JWT, maxfiy kalitlar | `src/4-Modull/AuthEnvLesson.jsx` | yakka |
| `5-M/BackendCrudPracticeLesson.jsx` | `backend-crud-practice-p1-v18` | Praktika: Backend CRUD — AvtoIjara | `src/4-Modull/BackendCrudPracticeLesson.jsx` | yakka |
| `5-M/DataIntroLesson.jsx` | `data-intro-04-01-v18` | data-intro-04-01-v18 | `src/4-Modull/DataIntroLesson.jsx` | yakka |
| `5-M/DbSqlNosqlLesson.jsx` | `db-sql-nosql-04-02-v18` | SQL vs NoSQL — nega PostgreSQL | `src/4-Modull/DbSqlNosqlLesson.jsx` | yakka |
| `5-M/FullstackConnectPracticeLesson.jsx` | `fullstack-connect-practice-p2-v18` | Praktika: Fullstack ulash — AvtoIjara | `src/4-Modull/FullstackConnectPracticeLesson.jsx` | yakka |
| `5-M/FullstackFeedbackLesson.jsx` | `fullstack-feedback-p4-v18` | Praktika: Feedback bilan yaxshilash — AvtoStoyanka | `src/4-Modull/FullstackFeedbackLesson.jsx` | yakka |
| `5-M/FullstackProjectDayLesson.jsx` | `fullstack-projectday-p3-v18` | Praktika: Loyiha kuni — AvtoStoyanka | `src/4-Modull/FullstackProjectDayLesson.jsx` | yakka |
| `5-M/NodeServerLesson.jsx` | `node-server-04-03-v18` | Node.js — birinchi serveringiz | `src/4-Modull/NodeServerLesson.jsx` | yakka |
| `5-M/PmLesson11.jsx` | `pm-m4d2-v1` | Ilova nimani eslab qolsin? | `src/4-Modull/PmLesson11.jsx` | yakka |
| `5-M/PmLesson12.jsx` | `pm-m4d7-v1` | Sinfdoshingiz sahifangizni ochsa, nimani ko'radi? | `src/4-Modull/PmLesson12.jsx` | yakka |
| `5-M/PmLesson13.jsx` | `pm-m4d12-v1` | Ilova nimani yozib qoladi? | `src/4-Modull/PmLesson13.jsx` | yakka |
| `5-M/PmLesson14.jsx` | `pm-m4d15-v1` | «Qanday ishlaydi?» deb so'rashsa | `src/4-Modull/PmLesson14.jsx` | yakka |
| `5-M/PostgresCrudLesson.jsx` | `pg-crud-04-05-v18` | PostgreSQL so'rovlar — CRUD + AI bilan | `src/4-Modull/PostgresCrudLesson.jsx` | yakka |
| `5-M/RoutingLesson.jsx` | `nest-routing-04-04-v18` | Routing: server so'rovni qanday topadi | `src/4-Modull/RoutingLesson.jsx` | yakka |

## 6-M — 14 fayl

| lms fayl | lesson_id | Sarlavha (uz) | Manba | Tur |
|---|---|---|---|---|
| `6-M/AiPipelineProjectLesson.jsx` | `cicd-ai-pipeline-4c-05-v18` | AI bilan lentani boshqarish | `src/4c-Modull/AiPipelineProjectLesson.jsx` | yakka |
| `6-M/CiCdIntroLesson.jsx` | `cicd-intro-4c-01-v18` | CI/CD nima va nega kerak | `src/4c-Modull/CiCdIntroLesson.jsx` | yakka |
| `6-M/EdgeCasesTestLesson.jsx` | `edge-cases-04b-02-v18` | Edge cases va error path | `src/4b-Modull/EdgeCasesTestLesson.jsx` | yakka |
| `6-M/FullPipelineProjectLesson.jsx` | `cicd-full-pipeline-4c-03-v18` | cicd-full-pipeline-4c-03-v18 | `src/4c-Modull/FullPipelineProjectLesson.jsx` | yakka |
| `6-M/FullProPipelineLesson.jsx` | `full-pro-pipeline-4c-04-v18` | full-pro-pipeline-4c-04-v18 | `src/4c-Modull/FullProPipelineLesson.jsx` | yakka |
| `6-M/GithubActionsLesson.jsx` | `github-actions-4c-02-v18` | github-actions-4c-02-v18 | `src/4c-Modull/GithubActionsLesson.jsx` | yakka |
| `6-M/JestUnitTestLesson.jsx` | `jest-unit-04b-01-v18` | Unit-test: Jest | `src/4b-Modull/JestUnitTestLesson.jsx` | yakka |
| `6-M/NestArchAliveLesson.jsx` | `nest-arch-alive-4a-01-v18` | Nest arxitektura — tirik ko'rish | `src/4a-Modull/NestArchAliveLesson.jsx` | yakka |
| `6-M/NestArchPracticeLesson.jsx` | `nest-arch-practice-4a-03-v18` | Praktika — KitobShop backend | `src/4a-Modull/NestArchPracticeLesson.jsx` | yakka |
| `6-M/NestArchResourceLesson.jsx` | `nest-arch-resource-4a-02-v18` | Birinchi resursni qo'lda qo'shish — mashinalar | `src/4a-Modull/NestArchResourceLesson.jsx` | yakka |
| `6-M/PmLesson15.jsx` | `pm-m4a2-v1` | Hamma birdan kirsa, sayt chidaydimi? | `src/4a-Modull/PmLesson15.jsx` | yakka |
| `6-M/PmLesson16.jsx` | `pm-m4b2-v1` | Bitta xato — nechta odam ketadi? | `src/4b-Modull/PmLesson16.jsx` | yakka |
| `6-M/PmLesson17.jsx` | `pm-m4c2-v1` | pm-m4c2-v1 | `src/4c-Modull/PmLesson17.jsx` | yakka |
| `6-M/PmLesson18.jsx` | `pm-m4c6-v1` | Saytingiz hozir ochilyaptimi? | `src/4c-Modull/PmLesson18.jsx` | yakka |

## (ildiz: M1–M2) — 45 fayl

| lms fayl | lesson_id | Sarlavha (uz) | Manba | Tur |
|---|---|---|---|---|
| `CssLesson1.jsx` | `css-01-v17` | CSS asoslari: ranglar, shriftlar, bo'shliqlar | `src/1-Modull/CssLesson1.jsx` | yakka |
| `CssLesson1.shared.jsx` | `css-01-v17` | CSS asoslari: ranglar, shriftlar, bo'shliqlar | `src/1-Modull/CssLesson1.jsx` | shared |
| `CssLesson2.jsx` | `css-02-v18` | CSS: layout, flexbox, DevTools | `src/1-Modull/CssLesson2.jsx` | yakka |
| `CssLesson2.shared.jsx` | `css-02-v18` | CSS: layout, flexbox, DevTools | `src/1-Modull/CssLesson2.jsx` | shared |
| `CssPractice.jsx` | `css-practice-portfolio-v3` | CSS Praktika — Portfolioni bezaymiz | `src/1-Modull/CssPractice.jsx` | yakka |
| `CssPractice.shared.jsx` | `css-practice-portfolio-v3` | CSS Praktika — Portfolioni bezaymiz | `src/1-Modull/CssPractice.jsx` | shared |
| `DeployLesson.jsx` | `netlify-deploy-v19` | Netlify va deploy | `src/1-Modull/DeployLesson.jsx` | yakka |
| `GitLesson.jsx` | `git-github-v19` | Git va GitHub — kodni internetga chiqaramiz | `src/1-Modull/GitLesson.jsx` | yakka |
| `HtmlPractice.jsx` | `html-practice-portfolio-v2` | HTML Praktika — Portfolio sayt | `src/1-Modull/HtmlPractice.jsx` | yakka |
| `HtmlPractice.shared.jsx` | `html-practice-portfolio-v2` | HTML Praktika — Portfolio sayt | `src/1-Modull/HtmlPractice.jsx` | shared |
| `HtmlTakrorlashLesson.jsx` | `html-takrorlash-01-05-v2` | Takrorlash: HTML ustaxonasi | `src/1-Modull/HtmlTakrorlashLesson.jsx` | yakka |
| `HtmlTakrorlashLesson.shared.jsx` | `html-takrorlash-01-05-v2` | Takrorlash: HTML ustaxonasi | `src/1-Modull/HtmlTakrorlashLesson.jsx` | shared |
| `Htmllesson1.jsx` | `html-01-v17` | HTML asoslari | `src/1-Modull/Htmllesson1.jsx` | yakka |
| `Htmllesson1.shared.jsx` | `html-01-v17` | HTML asoslari | `src/1-Modull/Htmllesson1.jsx` | shared |
| `Htmllesson2.jsx` | `html-02-v16` | HTML: rasm, struktura, forma, DevTools | `src/1-Modull/Htmllesson2.jsx` | yakka |
| `Htmllesson2.shared.jsx` | `html-02-v16` | HTML: rasm, struktura, forma, DevTools | `src/1-Modull/Htmllesson2.jsx` | shared |
| `InternetLesson.jsx` | `internet-01-v18` | Internet qanday ishlaydi | `src/1-Modull/InternetLesson.jsx` | yakka |
| `JsConditionsLesson.jsx` | `js-cond-01-v18` | JavaScript — if/else | `src/2-Modull/JsConditionsLesson.jsx` | yakka |
| `JsConditionsLesson.shared.jsx` | `js-cond-01-v18` | JavaScript — if/else | `src/2-Modull/JsConditionsLesson.jsx` | shared |
| `JsFunctionsLesson.jsx` | `js-functions-01-v18` | JavaScript — Funksiya, parametr, return | `src/2-Modull/JsFunctionsLesson.jsx` | yakka |
| `JsFunctionsLesson.shared.jsx` | `js-functions-01-v18` | JavaScript — Funksiya, parametr, return | `src/2-Modull/JsFunctionsLesson.jsx` | shared |
| `JsIntroLesson.jsx` | `js-intro-01-v18` | Sistema va Algoritm | `src/2-Modull/JsIntroLesson.jsx` | yakka |
| `JsLoopsLesson.jsx` | `js-loops-01-v18` | JavaScript — Sikllar (for, while) | `src/2-Modull/JsLoopsLesson.jsx` | yakka |
| `JsLoopsLesson.shared.jsx` | `js-loops-01-v18` | JavaScript — Sikllar (for, while) | `src/2-Modull/JsLoopsLesson.jsx` | shared |
| `JsVarsLesson.jsx` | `js-vars-01-v18` | js-vars-01-v18 | `src/2-Modull/JsVarsLesson.jsx` | yakka |
| `JsVarsLesson.shared.jsx` | `js-vars-01-v18` | js-vars-01-v18 | `src/2-Modull/JsVarsLesson.jsx` | shared |
| `PeanStackLesson.jsx` | `pean-stack-01-v18` | PERN Stack — 4 texnologiya, bitta jamoa | `src/2-Modull/PeanStackLesson.jsx` | yakka |
| `PeanStackLesson.shared.jsx` | `pean-stack-01-v18` | PERN Stack — 4 texnologiya, bitta jamoa | `src/2-Modull/PeanStackLesson.jsx` | shared |
| `PmLesson1.jsx` | `pm-m1d2-v1` | PM 1-dars | `src/1-Modull/PmLesson1.jsx` | yakka |
| `PmLesson1.shared.jsx` | `pm-m1d2-v1` | PM 1-dars | `src/1-Modull/PmLesson1.jsx` | shared |
| `PmLesson2.jsx` | `pm-m1d6-v1` | Struktura — foydalanuvchi uchun qilingan qulaylik | `src/1-Modull/PmLesson2.jsx` | yakka |
| `PmLesson2.shared.jsx` | `pm-m1d6-v1` | Struktura — foydalanuvchi uchun qilingan qulaylik | `src/1-Modull/PmLesson2.jsx` | shared |
| `PmLesson3.jsx` | `pm-pitch-03-v19` | Demo Day — 3 daqiqalik nutq | `src/1-Modull/PmLesson3.jsx` | yakka |
| `PmLesson3.shared.jsx` | `pm-pitch-03-v19` | Demo Day — 3 daqiqalik nutq | `src/1-Modull/PmLesson3.jsx` | shared |
| `PmLesson4.jsx` | `pm-m2d2-v1` | Muammodan yechimga | `src/2-Modull/PmLesson4.jsx` | yakka |
| `PmLesson4.shared.jsx` | `pm-m2d2-v1` | Muammodan yechimga | `src/2-Modull/PmLesson4.jsx` | shared |
| `PmLesson5.shared.jsx` | `pm-m2d7-v1` | pm-m2d7-v1 | `src/2-Modull/PmLesson5.jsx` | shared |
| `PmLesson6.shared.jsx` | `pm-m2d13-v1` | Sistemani qanday pitch qilish | `src/2-Modull/PmLesson6.jsx` | shared |
| `PracticeLesson1.jsx` | `practice-01-jonlantirish-v18` | Praktika 1 — Saytni jonlantiramiz | `src/2-Modull/PracticeLesson1.jsx` | yakka |
| `PracticeLesson1.shared.jsx` | `practice-01-jonlantirish-v18` | Praktika 1 — Saytni jonlantiramiz | `src/2-Modull/PracticeLesson1.jsx` | shared |
| `PracticeLesson2.jsx` | `practice-02-ai-promo-v18` | Praktika 2 — AI bilan tez sayt | `src/2-Modull/PracticeLesson2.jsx` | yakka |
| `PracticeLesson3.jsx` | `practice-03-decompose-v18` | Praktika 3 — Dekompozitsiya (mini-do'kon) | `src/2-Modull/PracticeLesson3.jsx` | yakka |
| `PracticeLesson4.jsx` | `practice-04-mvp-deploy-v18` | Praktika 4 — MVP tayyor (deploy) | `src/2-Modull/PracticeLesson4.jsx` | yakka |
| `VsCodeLesson.jsx` | `vscode-start-01-v1` | VS Code — professional start | `src/1-Modull/VsCodeLesson.jsx` | yakka |
| `VsCodeLesson.shared.jsx` | `vscode-start-01-v1` | VS Code — professional start | `src/1-Modull/VsCodeLesson.jsx` | shared |

Jami 90 fayl; katalogda topilmagan: 0 (PmLesson1 takror-id bilan qo'lda belgilandi)
