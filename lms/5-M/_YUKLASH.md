# 5-M — LMS'ga yuklash ro'yxati

> **Bu papka = LMS kursidagi `5-Modul`** — 5-Modul — Backend: Node-Express + PostgreSQL
> Manba: src/4-Modull · Tartib: `src/fb-demo/FbDemoApp.jsx` (haqiqiy dars tartibi).
> Papkadagi **15 ta `.jsx`** faylning HAMMASI yuklanadi. Boshqa hech narsa kerak emas:
> har fayl o'zi-yetarli (faqat `import … from "react"`), ⚙ belgisi — kompilyator ichida.

| # | Tur | Fayl | Dars | lessonId | Hajm |
|---|---|---|---|---|---|
| 1 | Kod | `DataIntroLesson.jsx` | Ma'lumot nima | `data-intro-04-01-v18` | 339 KB |
| 2 | PM | `PmLesson11.jsx` | Ma'lumot ham mahsulot qarori | `pm-m4d2-v1` | 443 KB ⚙ |
| 3 | Kod | `DbSqlNosqlLesson.jsx` | SQL vs NoSQL — PostgreSQL | `db-sql-nosql-04-02-v18` | 324 KB |
| 4 | Kod | `NodeServerLesson.jsx` | Node.js — birinchi server | `node-server-04-03-v18` | 307 KB |
| 5 | Kod | `RoutingLesson.jsx` | Routing — Express / Nest | `nest-routing-04-04-v18` | 316 KB |
| 6 | Kod | `PostgresCrudLesson.jsx` | PostgreSQL so'rovlari | `pg-crud-04-05-v18` | 304 KB |
| 7 | PM | `PmLesson12.jsx` | Xavfsizlik — foydalanuvchi ishonchi | `pm-m4d7-v1` | 327 KB |
| 8 | Proyekt | `BackendCrudPracticeLesson.jsx` | Praktika: Backend CRUD | `backend-crud-practice-p1-v18` | 309 KB |
| 9 | Kod | `ApiPostmanLesson.jsx` | API nima + Postman | `api-postman-04-06-v18` | 315 KB |
| 10 | Proyekt | `FullstackConnectPracticeLesson.jsx` | Praktika: React + Node ulash | `fullstack-connect-practice-p2-v18` | 329 KB |
| 11 | Kod | `AuthEnvLesson.jsx` | Autentifikatsiya va .env | `auth-env-04-07-v18` | 341 KB |
| 12 | PM | `PmLesson13.jsx` | Ilova nimani yozib qoladi? | `pm-m4d12-v1` | 449 KB ⚙ |
| 13 | Proyekt | `FullstackProjectDayLesson.jsx` | Fullstack loyiha kuni | `fullstack-projectday-p3-v18` | 326 KB |
| 14 | Proyekt | `FullstackFeedbackLesson.jsx` | Fikr bo'yicha yaxshilash | `fullstack-feedback-p4-v18` | 318 KB |
| 15 | PM | `PmLesson14.jsx` | "Qanday ishlaydi?" deb so'rashsa | `pm-m4d15-v1` | 321 KB |
| 16 | Rezerv | — | *(fayl yo'q — Zaxira dars)* | | |
| 17 | Demo | — | *(fayl yo'q — Demo Day)* | | |

## Qoidalar

- **Bu papkani QO'LDA to'ldirmang.** Fayllar `build-lms` chiqishi:
  `node scripts/build-lms.mjs src/4-Modull/<Dars>.jsx`
  Yig'uv shu papkaga yozadi — ildizda (`lms/`) nusxa QOLMAYDI, shuning uchun eski faylni
  adashib yuklab yuborish xavfi yo'q.
- **Tahrir manbaga kiritiladi**, keyin dars qayta yig'iladi. Yig'ilgan faylni tahrirlash — behuda.
- Yuklashdan oldin: `npm run smoke:lms` — har fayl brauzerda ochilib tekshiriladi.
- `Rezerv` va `Demo` kunlarida fayl yo'q — ular dars-fayli talab qilmaydi.
