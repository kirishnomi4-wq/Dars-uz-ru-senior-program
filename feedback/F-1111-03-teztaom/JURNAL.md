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

## 11.11 18:34 · LMS'ga chiqarildi (foydalanuvchi: «Ha, to'liq chiqar»)

- **Commit** 0eea4117 (pathspec, 9 fayl; boshqa seansning 41 staged fayli tegilmadi).
- **Paket** `yuklash-20261111-teztaom/` (`--majbur` — boshqa seans fayllari commit qilinmagan): 1 dars, v8, md5 `3718c8fb…`; smoke-lms ✓ · smoke-preview 1/1 → O'TDI. «Server avval» belgisi: bridge-tex 10 id (boshqa seans) + nishon tavsifi; dars id va nishon id o'zgarmagan → server deploy'siz yuklandi (foydalanuvchi rozi: tavsif keyingi server deploy'da).
- **CRM** (konveyer v4, `konveyer/royxat-teztaom.json`, 5399 → yangi paket): 16380 uz + 16381 ru — v7 Active → **v8 Active**, 8 s; bayt ✓ (brauzer qayta o'qish) + shell md5 ✓ ikkalasi `3718c8fb…`, ichida «TezTaom» 21.
- **Muhr** (`--server` SIZ — ishchi `lesson-catalog.json` bridge bilan qayta yig'ilgan, prod katalogi emas; reestr server yozuvi ab1bfa3 o'zgarmadi): lms-farq → o'zgarmagan **172** · o'zgargan 0.
- **Savol kalitlari** `--yoz`: 2565 qator; farq faqat shu dars (v7→v8, quiz-2/quiz-9 revision), javob indekslari o'zgarmagan; `src/live/*` o'zgarmadi.

Commit 4a4f62ac (muhr + kalitlar, pathspec).

## 11.11 18:35 · Learn 3197 «React practice 2 test» — B usuli tayyorlandi (F-1102-01 03.11 bilan bir xil)

- Keshsiz o'qish (`dump/learn-3197-oldin.json`): 24 qator, 24 Active, tartib 1–12 uz + 13–24 ru, Archive 0. «Yetkaz» — aynan 4: **18585** (uz 3) · **18592** (uz 10) · **18597** (ru 15) · **18604** (ru 22).
- Bulk fayllar (`learn-savollar/`, manba `codestrike-savollar/lms/4-Modul/14-ReactBuildSiteLesson-{uz,ru}.json`): `B-3197-uz-3-10.json` (✔ 2, 1) · `B-3197-ru-15-22.json` (✔ 2, 1) — kalitlar bilan mos.
- **Kutilmoqda:** foydalanuvchi 4 qatorni Archive qiladi → Claude 2 bulk (kurs 20 · modul 74 · Learn 3197 · uz/ru · «Kurs savollari»; «Tekshirish» Xato 0 + «2 ta» → «Qo'shildi: 2») → keshsiz qayta o'qish.
- **Prod kalitlari ✅ 11.11 18:37** (foydalanuvchi `!`): «yuklandi: 2565 qator → https://dars-api.coddycamp.uz».

## 11.11 19:34 · LEARN 3197 TUGADI — 4/4 ✅ (B usuli: foydalanuvchi arxivladi, Claude bulk yukladi)

- Foydalanuvchi arxivladi: 18585 · 18592 · 18597 · 18604 (keshsiz tasdiqlandi: 4 Archive, qolgan 20 o'zgarmagan).
- **Bulk** (Faqat savollar · Kurs savollari · kurs 20 · modul 74 Frontend-React · Learn 3197 «React practice 2 test»; maydon JSON sha256 = fayl; «Tekshirish» Xato 0 + «2 ta savol» → tasdiq «2 ta yozuv saqlanadi» → «Qo'shildi: 2, Xato: 0»):
  uz → **21846** (3) · **21847** (10); ru → **21848** (15) · **21849** (22). Hammasi Active.
- ru bulkdan oldin bir nomuvofiqlik: modul maydoni bo'sh qolgan (dars 3197 ko'ringan) — YUKLANMADI; sahifa yangilandi (oraliqda ERR_NETWORK_CHANGED, qayta ochildi), tanlov qaytadan → uchala maydon tekshirildi → yuklandi.
- **Yakuniy keshsiz tekshiruv** (`F-1105-03-analitika/crm-yuklash-20261110/dump/learn-3197-{oldin,keyin}.json`): 28 qator · Active 24 · tartib 1–24 takrorsiz · 1–12 uz / 13–24 ru · Archive aynan 4 · tegilmagan 20 farq 0 · Active'da «Yetkaz» 0. Tahrir oynasidan (saqlanmasdan): 4 savol — matn, 4 variant, izoh, to'g'ri javob (2 · 1 · 2 · 1) manba bilan mos.

**F-1111-03 LMS qismi yopildi.** Ochiq: nishon tavsifi serverda eski (keyingi server deploy) · bridge nusxasi (foydalanuvchi qarori: tegilmaydi).

**Yangi topilma (tuzatilmadi, tashxis):** shu darsning QUIZ_BANK quiz-1 va quiz-9 variantlari oddiy satr (uz/ru'siz) — ruscha rejimda o'zbekcha: «useState bilan · props bilan · map bilan», «App.jsx'dagi massiv · Gemini prompti · index.css fayli». Learn ru 14 va 22 da ham shunday.

## 11.11 19:40 · F-1111-04 — arena variantlari ruscha rejimda o'zbekcha (foydalanuvchi: «o'sha xatoni to'g'rilaylik»)

- **ReactBuildSiteLesson** QUIZ_BANK: quiz-1 `useState bilan · props bilan · map bilan` → `{uz, ru}` («Через useState · Через props · Через map»); quiz-9 `App.jsx'dagi massiv · Gemini prompti · index.css fayli` → «Массив в App.jsx · Промпт Gemini · Файл index.css». `Router (<Route>)` — oddiy satr qoldi (kod).
- **Sinf-supurish** (`codestrike-savollar/lms/*/*-ru.json`, 172 dars, kirillsiz + o'zbekcha morfologiya): 3 topildi → 2 haqiqiy: shu ikki savol + **ReactIntroLesson** quiz (ru 17) «HTML va CSS» → «HTML и CSS». `.tugma:hover` (9-M Animation) — kod, tarjima emas; Umami — soxta signal.
- Darvozalar: ikkala dars 11/13, `tell`/`emoji` HEAD bilan aynan bir xil. `codestrike-savollar --yoz` → faqat 2 dars ru fayli + ROYXAT; `--tekshir` 172 bir xil.
- **Qonunlashtirish:** `RU_I18N_SPEC.md` §11.
- **Keyingi:** commit → paket (F-1111-05 bilan) → CRM → muhr → kalitlar (ru variant revision) → prod `!` → Learn ru: 3197 tartib 14 (quiz-1) va 22 (21849, quiz-9) + ReactIntro Learn ru 17 — foydalanuvchi Archive + bulk.
