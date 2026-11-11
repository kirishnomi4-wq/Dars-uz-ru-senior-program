# F-1111-03 — «Yetkaz» → «TezTaom» (3-M 14 «Istalgan saytni qurish», LMS 4-Modul 14)

## 11.11 18:03 · Fidbek → tashxis → tuzatish

**Fidbek (mentor, foydalanuvchi orqali):** rasm `rasm/mentor-fidbek-yetkaz.png` — «Yetkaz uchun aniq prompt yozing.» (Amaliyot 2 · Gemini ekrani).
Foydalanuvchi: «yetkaz emas boshqa narsa qo'yish kerak, tarjima g'alati chiqqan».

**Tashxis:** «Yetkaz» — buyruq fe'li, nom emas. Gapda «Yetkaz uchun…» buzilgan tarjimadek o'qiladi; promptda «loyiham (yetkaz) uchun ovqat yetkazib berish saytining…» — bir gapda ikki «yetkaz»; ruschada «для Yetkaz» tarjima qilinmagandek.
Darsda 31 joy (22 tasi o'quvchiga ko'rinadi, uz+ru): logo, footer, oyna nomlari, sarlavha, mentor gaplari, terminal `npm create vite@latest yetkaz`, prompt, arena 2 savol, nishon tavsifi.

**Qaror (foydalanuvchi, 11.11):** nom «TezTaom» (papka `teztaom`); faqat LMS darsi — bridge nusxasi (`src/bridge/lessons/BridgeTexSaytQurish.jsx`, 26 joy) tegilmadi (bridge ustida boshqa seans ishlayapti).

**Tuzatish:** `src/3-Modull/ReactBuildSiteLesson.jsx` — `Yetkaz` → `TezTaom`, `yetkaz` (papka) → `teztaom`, `yetkazPrompt` → `teztaomPrompt`, `ScreenYetkaz` → `ScreenTezTaom`. 31 almashtirish, qolgan 0. «yetkazib berish»/«yetkazish» so'zlari (oddiy ma'no) o'zgarmadi.

**Darvozalar:** 11/13 ✓. `tell` 3 error + `emoji` 3 error — ESKI: o'zgarishdan oldingi (HEAD) fayl bilan aynan bir xil qatorlar (897/901 · 380/590/957), tahrirga aloqasi yo'q; dars shu holatda 11.11 da muhrlangan.
**Ko'z bilan:** `rasm/teztaom-s3-uz.png` — «TezTaom uchun aniq prompt yozing.», prompt «(teztaom)»; `rasm/teztaom-s3-ru.png` — «Напишите точный промпт для TezTaom.» Ikkalasi xatosiz.

**Sinf-supurish:** namuna-sayt nomlari — `title="… — localhost"` va `npm create vite@latest <papka>` (35 dars fayli, mentor-kurs va bridge'dan tashqari): robo-games · AvtoIjara/avto-ijara · avto-stoyanka · mening-katalogim · TezTaom. Fe'l yoki oddiy so'z bo'lgan nom boshqa yo'q (0).
**Qonunlashtirish:** `MATN_KORPUS.md` §NAMUNA-NOM.

**Arena savol manbalari:** `codestrike-savollar/4-Modul/14-ReactBuildSiteLesson.json` (4) + `lms/4-Modul/14-ReactBuildSiteLesson-{uz,ru}.json` (2+2) — quiz-2 va quiz-9 savol matni «Yetkaz» → «TezTaom» (darsdagi QUIZ_BANK bilan bir xil bo'lishi uchun); JSON ✓. `savol-kalitlari.mjs` quruq yurish: 172 dars · test 501 · arena 2064 · takror 0.

**lms-farq (18:1x):** o'zgarmagan 171 · o'zgargan 1 (m3-13 v7 → v8). Server: «nom/nishon o'zgargan 1» — nishon tavsifi `server/data/lesson-catalog.json` da; keyingi server deploy bilan yangilanadi (darsning o'zida yangi matn). `lesson-catalog.json` ni lms-farq qayta yig'di — ichida boshqa seansning 10 ta bridge-tex darsi ham bor → bu seans uni commit QILMAYDI.

**Qoldi (ruxsat kutilmoqda):** commit (pathspec) → paket → CRM 2 qator (16380 uz / 16381 ru, bo'lim 2460) → muhr → `savol-kalitlari --yoz` → prod kalitlari foydalanuvchi `!` bilan. CRM Learn 3197: 4 savol (uz 3/10, ru 15/22) eski matnda — « » bor, almashtirish = foydalanuvchi Archive + bulk.
