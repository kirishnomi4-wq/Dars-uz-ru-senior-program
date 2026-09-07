# 6-M → CRM «BACKEND: NESTJS + TESTIROVANIE + CI/CD DEPLOY» (modul 90)

> Papka: `C:\Users\ADMIN\internetLesson\lms\6-M\`
> Modul bo'sh edi — avval **mavzular yaratiladi**, keyin ichiga JSX fayllar yuklanadi.

---

## 1-BOSQICH — mavzular ro'yxati (Yangi qo'shish → Turi: **Class** → uz/ru nomi → Qo'shish)

Nomlar kurs manbasidan (`src/fb-demo/FbDemoApp.jsx`) olingan, o'ylab topilmagan.
Tartib — haqiqiy dars ketma-ketligi.

| # | Holat | Mavzu uz | Mavzu ru |
|---|---|---|---|
| 1 | ✅ **2761** | NestJS va arxitektura: MVC, module, controller, service | NestJS и архитектура: MVC, module, controller, service |
| 2 | ✅ **2762** | Yuk: hamma birdan kirsa, sayt chidaydimi? | Нагрузка: выдержит ли сайт, если все зайдут разом? |
| 3 | ✅ **2763** | Boilerplate: Nest + PostgreSQL — Entity, DTO, Repository | Boilerplate: Nest + PostgreSQL — Entity, DTO, Repository |
| 4 | ✅ **2764** | Praktika: yangi modul — o'z controller va service | Практика: новый модуль — свой controller и service |
| 5 | ✅ **2765** | Unit-test: Jest bilan birinchi test | Unit-тест: первый тест с Jest |
| 6 | ✅ **2766** | Sifat: bitta xato — nechta odam ketadi? | Качество: одна ошибка — сколько людей уйдёт? |
| 7 | ✅ **2767** | Edge case va error path: chegarada nima bo'ladi? | Edge case и error path: что будет на границе? |
| 8 | ✅ **2768** | CI/CD nima va nega kerak? | Что такое CI/CD и зачем он нужен? |
| 9 | ✅ **2769** | Reliz: hammasini birdan chiqaraymi — yoki har hafta bo'lak? | Релиз: выпустить всё разом — или по кусочку каждую неделю? |
| 10 | ✅ **2770** | GitHub Actions: avtomatik ish oqimini yozaman | GitHub Actions: пишу автоматический поток работ |
| 11 | ✅ **2771** | Loyiha kuni: to'liq lenta — backend + frontend | Проектный день: полный конвейер — backend + frontend |
| 12 | ✅ **2772** | Loyiha kuni: promptlar bilan lentani boshqaraman | Проектный день: управляю конвейером с промптами |
| 13 | ✅ **2773** | Monitoring: saytingiz hozir ochilyaptimi? | Мониторинг: ваш сайт сейчас открывается? |
| 14 | ✅ **2774** | Loyiha kuni: hammasi birga — test + lint + deploy | Проектный день: всё вместе — тест + lint + deploy |

⚠️ **Turi har safar `Class` bo'lsin.** Yangi mavzu oynasida u ko'rinishda «Class» bo'lib
turadi, lekin qo'l tegmasa **`Learn`** bo'lib saqlanadi (2762 da shunday bo'ldi, tuzatildi).
Yaratgandan keyin ro'yxatda «TURI» ustunida `Class` yozuvini ko'ring.

Zaxira dars (15-o'rin) — fayl talab qilmaydi, xohlasangiz qo'shasiz.

---

## 2-BOSQICH — qaysi darsga qaysi fayl

Har dars **IKKI marta** yuklanadi: `Til = uz` va `Til = ru` — **fayl ikkalasida bir xil**.
Tanlash: **`JSX dars (Lesson Runner)`**. Sarlavha bo'sh. ⚙ = kompilyator fayl ichida.

| CRM qatori | Tartib | Dars | Fayl | Hajm |
|---|---|---|---|---|
| **2761** | 10 | NestJS va arxitektura | `NestArchAliveLesson.jsx` | 356 KB |
| **2762** | 20 | Yuk: hamma birdan kirsa | `PmLesson15.jsx` ⚙ | 458 KB |
| **2763** | 30 | Boilerplate: Nest + PostgreSQL | `NestArchResourceLesson.jsx` | 328 KB |
| **2764** | 40 | Praktika: yangi modul | `NestArchPracticeLesson.jsx` | 357 KB |
| **2765** | 50 | Unit-test: Jest | `JestUnitTestLesson.jsx` | 315 KB |
| **2766** | 60 | Sifat: bitta xato | `PmLesson16.jsx` | 349 KB |
| **2767** | 70 | Edge case va error path | `EdgeCasesTestLesson.jsx` | 315 KB |
| **2768** | 80 | CI/CD nima va nega kerak | `CiCdIntroLesson.jsx` | 323 KB |
| **2769** | 90 | Reliz: birdan yoki bo'lak | `PmLesson17.jsx` ⚙ | 474 KB |
| **2770** | 100 | GitHub Actions | `GithubActionsLesson.jsx` | 335 KB |
| **2771** | 110 | Loyiha kuni: to'liq lenta | `FullPipelineProjectLesson.jsx` | 306 KB |
| **2772** | 120 | Loyiha kuni: promptlar bilan | `AiPipelineProjectLesson.jsx` | 317 KB |
| **2773** | 130 | Monitoring | `PmLesson18.jsx` | 348 KB |
| **2774** | 140 | Loyiha kuni: hammasi birga | `FullProPipelineLesson.jsx` | 310 KB |

## Ochiq savol

Status ikki xil: **2761–2762 = `Draft`**, **2763–2774 = `Active`**.
4- va 5-Modulda hamma qator `Draft`. Bir xilga keltirish foydalanuvchi qaroriga qoldi.
