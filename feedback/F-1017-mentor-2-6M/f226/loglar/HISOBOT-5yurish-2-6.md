# Reliz hisoboti — 2026-10-18 07:06 UTC

API: **prod** · darslar: **70** · shared: yo'q (DE 221) · preview-sinov: to'liq · lms/ ga yurishda yozildi: yo'q

| | Qadam | Tafsilot |
|---|---|---|
| ✗ | ro'yxat: 70 dars (kutilgan 70) | LMS'dagi ro'yxatda YO'Q lesson_id (serverda bo'lmasa join 404): src/1-Modull/PmLesson3.jsx → pm-pitch-03-v20<br>ro'yxatdan TUSHGAN: pm-pitch-03-v19<br>lokal katalogda (taxminiy, 20.09): pm-pitch-03-v20=yo'q |
| ✓ | unit-testlar (previewMode + resultDetails) | pass 24 · fail 0 |
| ✓ | preview-keys-check (yangi xotira-kalitlari himoyada) | Prefikssiz (${…} bilan boshlanadi) — qo'lda ko'ring: ·   src/live/resultDetails.js — sealKey · ✓ hamma kalit qoplangan |
| ✓ | yakka yig'ish (yuklash-papka): 70 fayl |  |
| — | shared yig'ish | o'tkazildi — kompilyator dars ichida (DE 221), --shared bilan yoqiladi |
| ✓ | statik: 70 fayl — o'ram, window-belgi yo'q, API=prod, supabase yo'q |  |
| ✓ | smoke-lms yakka: ✗ 0 |  |
| — | smoke-shared | o'tkazildi (DE 221) |
| ✓ | smoke-preview yakka: 70/70 |  |
| — | smoke-preview shared | o'tkazildi (DE 221) |

**Hukm: YIQILDI ✗**

## Darslar

| Modul | key | src | lesson_id |
|---|---|---|---|
| 2 | m1-01 | `src/1-Modull/InternetLesson.jsx` | `internet-01-v18` |
| 2 | m1-02 | `src/1-Modull/PmLesson1.jsx` | `pm-m1d2-v1` |
| 2 | m1-03 | `src/1-Modull/Htmllesson1.jsx` | `html-01-v17` |
| 2 | m1-04 | `src/1-Modull/Htmllesson2.jsx` | `html-02-v16` |
| 2 | m1-14 | `src/1-Modull/HtmlTakrorlashLesson.jsx` | `html-takrorlash-01-05-v2` |
| 2 | m1-05 | `src/1-Modull/PmLesson2.jsx` | `pm-m1d6-v1` |
| 2 | m1-06 | `src/1-Modull/CssLesson1.jsx` | `css-01-v17` |
| 2 | m1-07 | `src/1-Modull/CssLesson2.jsx` | `css-02-v18` |
| 2 | m1-15 | `src/1-Modull/VsCodeLesson.jsx` | `vscode-start-01-v1` |
| 2 | m1-08 | `src/1-Modull/HtmlPractice.jsx` | `html-practice-portfolio-v2` |
| 2 | m1-10 | `src/1-Modull/CssPractice.jsx` | `css-practice-portfolio-v3` |
| 2 | m1-09 | `src/1-Modull/GitLesson.jsx` | `git-github-v19` |
| 2 | m1-11 | `src/1-Modull/DeployLesson.jsx` | `netlify-deploy-v19` |
| 2 | m1-12 | `src/1-Modull/PmLesson3.jsx` | `pm-pitch-03-v20` |
| 3 | m2-01 | `src/2-Modull/JsIntroLesson.jsx` | `js-intro-01-v18` |
| 3 | m2-02 | `src/2-Modull/PmLesson4.jsx` | `pm-m2d2-v1` |
| 3 | m2-03 | `src/2-Modull/JsVarsLesson.jsx` | `js-vars-01-v18` |
| 3 | m2-04 | `src/2-Modull/JsConditionsLesson.jsx` | `js-cond-01-v18` |
| 3 | m2-05 | `src/2-Modull/JsLoopsLesson.jsx` | `js-loops-01-v18` |
| 3 | m2-06 | `src/2-Modull/JsFunctionsLesson.jsx` | `js-functions-01-v18` |
| 3 | m2-07 | `src/2-Modull/PmLesson5.jsx` | `pm-m2d7-v1` |
| 3 | m2-08 | `src/2-Modull/PracticeLesson1.jsx` | `practice-01-jonlantirish-v18` |
| 3 | m2-09 | `src/2-Modull/PracticeLesson2.jsx` | `practice-02-ai-promo-v18` |
| 3 | m2-10 | `src/2-Modull/PeanStackLesson.jsx` | `pean-stack-01-v18` |
| 3 | m2-11 | `src/2-Modull/PracticeLesson3.jsx` | `practice-03-decompose-v18` |
| 3 | m2-12 | `src/2-Modull/PracticeLesson4.jsx` | `practice-04-mvp-deploy-v18` |
| 3 | m2-13 | `src/2-Modull/PmLesson6.jsx` | `pm-m2d13-v1` |
| 4 | m3-01 | `src/3-Modull/ReactIntroLesson.jsx` | `react-intro-01-v18` |
| 4 | m3-02 | `src/pm/PmUserStoryLesson.jsx` | `pm-m3d2-v3` |
| 4 | m3-03 | `src/3-Modull/ReactFirstComponentLesson.jsx` | `react-first-component-02-v18` |
| 4 | m3-04 | `src/3-Modull/ReactStateEffectLesson.jsx` | `react-state-effect-03-v18` |
| 4 | m3-05 | `src/3-Modull/PmLesson8.jsx` | `pm-m3d5-v1` |
| 4 | m3-06 | `src/3-Modull/ReactPropsReuseLesson.jsx` | `react-props-reuse-04-v18` |
| 4 | m3-07 | `src/3-Modull/ReactCrudPracticeLesson.jsx` | `react-crud-practice-p1-v18` |
| 4 | m3-08 | `src/3-Modull/ReactApiGetLesson.jsx` | `react-api-get-05-v18` |
| 4 | m3-09 | `src/3-Modull/ReactApiPostLesson.jsx` | `react-api-post-06-v18` |
| 4 | m3-10 | `src/3-Modull/PmLesson9.jsx` | `pm-m3d10-v1` |
| 4 | m3-11 | `src/3-Modull/ReactRouterPracticeLesson.jsx` | `react-router-practice-p2-v18` |
| 4 | m3-12 | `src/3-Modull/ReactProjectDayLesson.jsx` | `react-project-day-p3-v18` |
| 4 | m3-13 | `src/3-Modull/ReactBuildSiteLesson.jsx` | `react-build-site-final-p4-v18` |
| 4 | m3-14 | `src/3-Modull/PmLesson10.jsx` | `pm-m3d14-v1` |
| 5 | m4-01 | `src/4-Modull/DataIntroLesson.jsx` | `data-intro-04-01-v18` |
| 5 | m4-02 | `src/4-Modull/PmLesson11.jsx` | `pm-m4d2-v1` |
| 5 | m4-03 | `src/4-Modull/DbSqlNosqlLesson.jsx` | `db-sql-nosql-04-02-v18` |
| 5 | m4-04 | `src/4-Modull/NodeServerLesson.jsx` | `node-server-04-03-v18` |
| 5 | m4-05 | `src/4-Modull/RoutingLesson.jsx` | `nest-routing-04-04-v18` |
| 5 | m4-06 | `src/4-Modull/PostgresCrudLesson.jsx` | `pg-crud-04-05-v18` |
| 5 | m4-07 | `src/4-Modull/PmLesson12.jsx` | `pm-m4d7-v1` |
| 5 | m4-08 | `src/4-Modull/BackendCrudPracticeLesson.jsx` | `backend-crud-practice-p1-v18` |
| 5 | m4-09 | `src/4-Modull/ApiPostmanLesson.jsx` | `api-postman-04-06-v18` |
| 5 | m4-10 | `src/4-Modull/FullstackConnectPracticeLesson.jsx` | `fullstack-connect-practice-p2-v18` |
| 5 | m4-11 | `src/4-Modull/AuthEnvLesson.jsx` | `auth-env-04-07-v18` |
| 5 | m4-12 | `src/4-Modull/PmLesson13.jsx` | `pm-m4d12-v1` |
| 5 | m4-13 | `src/4-Modull/FullstackProjectDayLesson.jsx` | `fullstack-projectday-p3-v18` |
| 5 | m4-14 | `src/4-Modull/FullstackFeedbackLesson.jsx` | `fullstack-feedback-p4-v18` |
| 5 | m4-15 | `src/4-Modull/PmLesson14.jsx` | `pm-m4d15-v1` |
| 6 | m4a-01 | `src/4a-Modull/NestArchAliveLesson.jsx` | `nest-arch-alive-4a-01-v18` |
| 6 | m4a-02 | `src/4a-Modull/PmLesson15.jsx` | `pm-m4a2-v1` |
| 6 | m4a-03 | `src/4a-Modull/NestArchResourceLesson.jsx` | `nest-arch-resource-4a-02-v18` |
| 6 | m4a-04 | `src/4a-Modull/NestArchPracticeLesson.jsx` | `nest-arch-practice-4a-03-v18` |
| 6 | m4b-01 | `src/4b-Modull/JestUnitTestLesson.jsx` | `jest-unit-04b-01-v18` |
| 6 | m4b-02 | `src/4b-Modull/PmLesson16.jsx` | `pm-m4b2-v1` |
| 6 | m4b-03 | `src/4b-Modull/EdgeCasesTestLesson.jsx` | `edge-cases-04b-02-v18` |
| 6 | m4c-01 | `src/4c-Modull/CiCdIntroLesson.jsx` | `cicd-intro-4c-01-v18` |
| 6 | m4c-02 | `src/4c-Modull/PmLesson17.jsx` | `pm-m4c2-v1` |
| 6 | m4c-03 | `src/4c-Modull/GithubActionsLesson.jsx` | `github-actions-4c-02-v18` |
| 6 | m4c-04 | `src/4c-Modull/FullPipelineProjectLesson.jsx` | `cicd-full-pipeline-4c-03-v18` |
| 6 | m4c-05 | `src/4c-Modull/AiPipelineProjectLesson.jsx` | `cicd-ai-pipeline-4c-05-v18` |
| 6 | m4c-06 | `src/4c-Modull/PmLesson18.jsx` | `pm-m4c6-v1` |
| 6 | m4c-07 | `src/4c-Modull/FullProPipelineLesson.jsx` | `full-pro-pipeline-4c-04-v18` |
