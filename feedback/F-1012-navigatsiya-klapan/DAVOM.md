# DAVOM — Navigatsiya, klapan, sudrash xatolari (F-1012-01…03) · 2026-10-12

> ⚠️ **13.10 13:06 holati (bu blok quyidagilardan USTUN):** qarorlar olingan (70 dars bir yo'la · liveMode 43 · mentor qulfsiz),
> umumiy codemod 70 darsga QO'LLANGAN (`maxReached` → `gate.passed`, mentor freeRide, sudrash 24 joy, NestJS ROUTE, liveMode).
> Tekshirildi: gates 70/70 — 10/12 toza, `tell`+`emoji` HEAD bilan bir xil (eski qarz) · smoke:onfinished 140/140 ·
> navtest2 70/70 (orqaga/oldinga ochiq) · klapan 14/14 (kutish → oldinga → orqaga = ochiq) · mentor 4 dars (HEAD yopiq → endi ochiq).
> **F-1013-01 TUZATILDI:** PmLesson16/17/18 keys-ekrani `{c.predict.ask}` → `tr(c.predict.ask)` (oq ekran edi; LMS v2/v3 da ham bor edi).
>   Tekshirildi: gates bir xil, keys-ekran o'quvchi yo'li boshidan oxirigacha, pageerror 0.
> **F-1013-02 (foydalanuvchi qarori):** test ekranida mentor qulfi QAYTARILDI — NavNext `mentorLock` (71 test tugmasi, 70 fayl);
>   mentor avval «Natijani ochish», keyin o'tadi; boshqa ekranlarda mentor qulfsiz. Zaxira: seans scratchpad `zaxira-mentorlock/70dars.tgz`.
>   Tekshirildi: gates 70/70 avvalgi bilan bir xil · lint:jsx toza · mentor test-ekran 70/70 (yopiq → ochish → ochiq → oldinga → orqaga ochiq)
>   · mentor topshiriq-ekran ochiq (CssLesson1, PmLesson8, NestArchAlive 09) · navtest2 ✅560 ❌0 · smoke:onfinished 140/140.
>   Eslatma: «Jonli natija» paneli serverdan o'quvchilar ro'yxati kelmaguncha chizilmaydi → server javob bermasa mentor test-ekranda qoladi (HEAD'da ham shunday, yangi emas).
> Ochiq: F-1012-02 · 5–14-Modul · PIPELINE_STATE yozuvi + qonun · yuklash papkasi.
> Skriptlar tuzatildi (`vositalar/` ga qaytarildi): `navtest2.mjs`, `valve.mjs` (K argumenti), `mentor.mjs`; ishga tushirishda scratchpad ga `node_modules` symlink kerak.
>
> ~~**Chorshanba (2026-10-14) shu yerdan boshlanadi.** Retsept B (fidbek). Tashxis TUGADI, kodga HALI TEGILMAGAN.~~
> Maqsad: 1·2·3·4·4a·4b·4c modullaridagi 70 darsni tuzatish → darvozalar → yangi yuklash papkasi → foydalanuvchi hammasini LMS'ga yuklaydi.
> Commit — faqat buyruq bilan.

---

## 0. Birinchi ish (chorshanba)

1. Shu faylni o'qi.
2. Foydalanuvchidan **3 javobni** ol (6-bo'lim). Javobsiz boshlama.
3. 8+ faylga tegadi → avval `KATTA_TOZALASH.md` ga yozuv (F-1012-04 sinf-supurish), keyin tuzatish.
4. Tartib: 4-bo'lim (1 → 2 → 3 → 4) → 5-bo'lim tekshiruv → yuklash papkasi.

---

## 1. Fidbek (mentor, 2026-10-12, NestJS 1-dars LMS preview)

| F-ID | Nima dedi | Holat |
|---|---|---|
| **F-1012-01** | 9-ekran «Buyurtma yo'li»: hammasini tekshirdi, lekin tugma «Tartibni tuzating» ochilmaydi | sabab topildi |
| **F-1012-02** | 1-darsdagi GitHub loyiha (`Azizbekcrypto/IntroNestArxitechture`) `.env` + Postgres'siz ishlamaydi | sabab topildi, yechim qarori kutiladi |
| **F-1012-03** | Orqaga/oldinga yurolmaydi; keyingi ekranlarga o'tib qaytsa — topshiriqlarni boshqattan qilish kerak | sabab topildi |
| **F-1012-04** | (sinf-supurish) shu xatolar barcha 70 darsda qidirildi | 41 fayl |

LMS havolasi: `https://lms.coddycamp.uz/preview?jsx=https%3A%2F%2Fgo.coddycamp.uz%2Fuploads%2Flessons%2Flesson_runner%2F79d11b378d458e7cf4da079e890e4d21.jsx&lang=uz`
LMS'dagi fayl md5 `8fb78b88…` = **`yuklash-2026-10-01` (v2)** nusxasi — 04.10 dagi v3 (4a) LMS'ga YUKLANMAGAN. 9-ekran v2 va v3 da bir xil.

---

## 2. Tashxis — 4 xato sinfi (hammasi tasdiqlangan)

### A1) Klapan ekranni saqlamaydi — 14 dars, 138 ekran
- `useStuckValve(done, progress)` — 60 s harakatsizlik yoki 110 s dan keyin `_resc=true` → `NavNext disabled={!done && !_resc}` ochiladi.
  Lekin `onAnswer` faqat `done` bo'lganda chaqiriladi → klapan bilan o'tilgan ekran **saqlanmaydi** → qaytganda topshiriq boshidan
  (9-ekranda kartalar qayta aralashadi), tugma yana 60–110 s yopiq. Mentor rejimida klapan umuman ishlamaydi (`isMentor` → taymer yo'q).
- Brauzer dalili (`vositalar/valve.mjs`, LMS v2 fayli): `09 YOPIQ → 65 s → ochiq → 10 → orqaga → 09 YOPIQ`.
- Darslar (`function useStuckValve` bor):
  - 4-M: ApiPostmanLesson, AuthEnvLesson, BackendCrudPracticeLesson, FullstackConnectPracticeLesson
  - 4a: NestArchAliveLesson, NestArchResourceLesson, NestArchPracticeLesson
  - 4b: JestUnitTestLesson, EdgeCasesTestLesson
  - 4c: CiCdIntroLesson, GithubActionsLesson, FullPipelineProjectLesson, AiPipelineProjectLesson, FullProPipelineLesson
- Eslatma: `audit_gate.py` 7 ta PM darsni ham «klapanli» dedi — XATO signal («rescue» so'zi boshqa ma'noda). Haqiqiy son 14.

### A2) Bajarilgan ekran ham qaytganda qulflanadi — 12 dars
Ekran holatini `useState` da ushlaydi, `storedAnswer` dan tiklamaydi.
- **PM «Muhokama» `Screen2`** (`opened/seen` massivlari, `disabled={!allSeen && !isMentor}`, yorliq «👆 Yana N ishni oching»), 11 darsda bir xil:
  PmLesson8, 9, 10 (3-M) · PmLesson11, 12, 13, 14 (4-M) · PmLesson15 (4a) · PmLesson16 (4b) · PmLesson17, 18 (4c)
- **CssLesson1 `Screen3b`** (5-ekran, `seen` Set, `disabled={!explored}`, «1/3 usul ko'rilgan»).
- Brauzer dalili (`vositalar/navtest2.mjs`): PmLesson8 03 ❌, PmLesson11 03 ❌, CssLesson1 05 ❌.
- XATO signallar (tekshirildi, tuzatilmaydi): VsCode ScreenInstall/Folder/Live, CssPractice Screen3…13 (`useStylePick` saqlaydi),
  DeployLesson ScreenDrop, PmLesson5 ScrRecap, PmLesson14 ScreenReflection (localStorage), PmLesson4 ScreenClean (`shelf` saqlanadi).
  navtest2'dagi PmLesson8 05/06, PmLesson11 05/07 ❌ — sinov urug'i umumiy shaklda edi (ekran `placed` kabi maydonni kutadi), haqiqiy xato emas.

### B) Sudrash mashqida karta ikki marta chiqadi — 22 dars (23 joy)
- `place(id, from, slotIdx)`: kartani o'z katagiga qayta tashlasa (`from === slotIdx`), `occ` = shu kartaning o'zi → pool'ga ham qo'shiladi.
- **Allaqachon ma'lum: F-0922-54** — faqat `src/3-Modull/ReactIntroLesson.jsx:~687` da tuzatilgan (`if (occ && occ !== id) np = [...np, occ];`).
  Sinf-supurish o'shanda qilinmagan.
- Tuzatish = shu bir qator (`if (occ) …` → `if (occ && occ !== id) …`).
- Joylar:
  - 1-M: InternetLesson:2708, Htmllesson1:1330, HtmlTakrorlashLesson:1117, PmLesson2:866, CssLesson1:924, CssLesson2:1006, HtmlPractice:1408, VsCodeLesson:909, CssPractice:859
  - 2-M: JsFunctionsLesson:728, PeanStackLesson:742, PracticeLesson3:1701, PracticeLesson4:1715
  - 3-M: ReactApiPostLesson:581, ReactRouterPracticeLesson:1382
  - 4-M: RoutingLesson:1067
  - 4a: NestArchAliveLesson:701 (DragDropOrder) **va** :1106 (Screen9)
  - 4c: CiCdIntroLesson:722, GithubActionsLesson:677, FullPipelineProjectLesson:658, AiPipelineProjectLesson:669, FullProPipelineLesson:653
  (qator raqamlari 12.10 holati; `grep -n "if (typeof from === 'number') ns\[from\] = null;"` bilan qayta top)

### C) NestArchAlive 9-ekran — tekshiruv ziddiyati + faktik xato — 1 dars
- `ROUTE = ['guard','waiter','inspector','chef','store','tray']` (Controller → Pipe). `pathOk` faqat shu aniq tartib.
- `runPath()` esa `waiter` (Controller) ni umuman tekshirmaydi → Guard → **Pipe → Controller** ham 3 mijozni to'g'ri o'tkazadi (201/400/401),
  «✓ 201» chiqadi, lekin tugma «Tartibni tuzating» da qoladi. Mentor aynan shu tartibni tergan.
- **Faktik:** NestJS hayot-sikli — Guard → (Interceptor) → **Pipe → Controller handler** → Service. Ya'ni darsning tartibi xato, mentorniki to'g'ri.
- Tartib aytilgan boshqa joylar: uyga vazifa/praktika checklist «qo'riqchi → ofitsiant → nazoratchi → oshpaz → ombor → lagan» (`ScreenNestPractice`),
  fayl boshidagi izoh (10-qator), ehtimol yakuniy MD. `grep -n "ofitsiant → nazoratchi\|официант → контрол" src/4a-Modull/*.jsx` bilan top.
- Shunga o'xshash simulyatsiya (`runPath`/`ROUTE`) boshqa darslarda YO'Q (qidirildi).

---

## 3. Qo'shimcha topilmalar (shu seansda)

- **liveMode yo'q — 43 dars** (3, 4, 4a, 4b, 4c modullari): `onFinished` payload'ida `nickname/livePin/liveMode` umuman yo'q
  (1–2-Modulda bor). CRM `jsx_lesson_results.live_mode` NULL bo'ladi. Qo'shish = payload obyektiga 3 qator (InternetLesson naqshi).
  Dalil: `vositalar/harvest.mjs` + `ingest.py` (70 dars × 4 ssenariy, 279/280 payload). Analitikani CRM o'zi qiladi
  (memory `analitika-crm-jamoasida`), biz faqat payload to'liqligiga javobgarmiz.
- **F-1012-02 GitHub loyiha** (kod o'qib; ishga tushirishga ruxsat berilmadi):
  - TypeORM `type:'postgres'`, `url = NODE_ENV==='dev' ? DEV_DB_URL : PROD_DB_URL`, `.env.example`: `postgres://postgres:password@localhost:5432/nestarxitechture` → bolada Postgres yo'q → server ko'tarilmaydi.
  - Darsdagi `.env` namunasi (3-ekran: `PORT`, `DEV_DB_URL=postgres://localhost/nest_db`, `Access_Token_Key`) loyihaga mos emas:
    `NODE_ENV=dev` yo'q (bo'lmasa PROD_DB_URL olinadi), baza nomi boshqa, superadmin/JWT maydonlari bo'sh (`onModuleInit` superadmin yaratadi).
  - Variantlar: **A** mentor tayyor bulut-baza (Neon bepul) + to'liq `.env` beradi (tavsiya) · B SQLite rejimi · C darsga Postgres o'rnatish · D mentor ekranda ko'rsatadi.
  - Bu foydalanuvchi reposi — dars fayllaridan alohida ish; 4-bo'lim tugagach.

---

## 4. Yechim rejasi (tasdiq kutilmoqda)

| # | Sinf | Nima qilinadi | Fayl |
|---|---|---|---|
| 1 | A1 klapan | Klapan tugmani ochganda ekran «o'tildi» deb dars progressiga yoziladi (ball EMAS — `correct` yozilmaydi; masalan alohida `passed`/`rescued` ro'yxati ccProgress + server progress'da). Qaytganda tugma darrov ochiq, topshiriq qayta aralashmaydi. `useStuckValve` ga ekran indeksi kerak — har darsda bitta hook, chaqiruvlar codemod | 14 |
| 2 | A2 tiklanmaydi | PM `Screen2` va CssLesson1 `Screen3b`: holat `storedAnswer` dan tiklansin, bajarilganda `onAnswer` | 12 |
| 3 | B nusxa | `if (occ && occ !== id)` (F-0922-54 naqshi) | 22 |
| 4 | C 9-ekran | `ROUTE` → guard, inspector, waiter, chef, store, tray; `runPath` ham Controller'ni Pipe'dan keyin talab qilsin (aks holda teskari ziddiyat chiqadi); tartib aytilgan barcha matnlar uz+ru | 1 |
| 5 | liveMode (ixtiyoriy, 6-bo'lim 2-savol) | 43 dars payload'iga `nickname/livePin/liveMode` | 43 |

Tuzatiladigan fayllar ro'yxati (1–4): `vositalar/fixfiles.txt` — **41 fayl** (1-M 9 · 2-M 4 · 3-M 5 · 4-M 9 · 4a 4 · 4b 3 · 4c 7).
Qonun-marshruti (B/4): A1/A2 → `DARS_ETALON.md` yangi qonun («klapan ekranni o'tildi deb saqlaydi; har qulflangan ekran storedAnswer'dan tiklanadi»);
B → tekshiruvchi rol-fayliga ov-bandi + darvoza (`if (occ)` naqshini qidirish); C → `MATN_KORPUS`/etalon emas, kontent-fakt (jurnal).
Jurnal: `PIPELINE_STATE.md` ga F-1012-01…04 raund-yozuv.

---

## 5. Tekshiruv (tuzatishdan keyin)

1. Har faylga `npm run gates -- <fayl>` (7/7) + `npm run lint:jsx` 0.
2. `vositalar/navtest2.mjs` — 70 dars uchun orqaga/oldinga (urug' shaklini ekranga mos qilish kerak, yoki faqat A2 ekranlari).
3. `vositalar/valve.mjs` — klapanli 14 dars: kutish → oldinga → orqaga → **ochiq** bo'lishi shart.
4. Sudrash: kartani o'z katagiga tashlash → pool'da nusxa YO'Q (yangi kichik sinov yoziladi).
5. 9-ekran: to'g'ri NestJS tartibi → tugma ochiladi; Controller → Pipe tartibi → simulyatsiya ham yiqiladi (ziddiyat yo'q).
6. `npm run smoke:onfinished` (natija yuborish buzilmagan) + `harvest.mjs`/`ingest.py` (liveMode qo'shilsa — 70/70 da bor).
7. Yangi yuklash papkasi: `yuklash-papka.mjs --out yuklash-2026-10-14` → `yuklash-tekshir.sh` + click-walk (uz+ru) + md5 ro'yxati.
   Shablon: `yuklash-2026-10-04/README.md`. Fayl nomida yangi belgi (`-v4`).

**Vositalar haqida:** `vositalar/*.mjs` 12.10 da scratchpad'dan nusxa — ichidagi HTML-chiqish yo'llari eski scratchpad'ga yozilgan,
ishlatishdan oldin `page`/`out` yo'llarini yangi seans scratchpad'iga almashtir. Ishga tushirish: repo ildizidan `node feedback/F-1012-navigatsiya-klapan/vositalar/<fayl> <lms .jsx> self 12`.
LMS'dagi asl faylni olish: `curl -s -o x.jsx https://go.coddycamp.uz/uploads/lessons/lesson_runner/79d11b378d458e7cf4da079e890e4d21.jsx` (12.10 da 200 qaytardi).

---

## 6. Foydalanuvchidan javob kutilayotgan savollar

1. **Rejani tasdiqlaysizmi** (4-bo'lim 1–4)? 9-ekranda NestJS tartibi: qo'riqchi → **nazoratchi → ofitsiant** → oshpaz → ombor → lagan.
2. **liveMode** 43 darsga qo'shilsinmi (baribir hammasi qayta yuklanadi)?
3. **Mentor tayyorlanayotganda** (LMS preview) qulfsiz oldinga/orqaga yursinmi? Hozir preview mentorni oddiy o'quvchi kabi qulflaydi.
4. (keyin) **F-1012-02** GitHub loyiha: A / B / C / D variant?

---

## 7. Bu seansda yana nima bo'ldi (kontekst)

- Analitika: Axadulla `JAVOB_JSX_NATIJA_V2_2026-09-25_UZ.md` (Telegram Desktop) — CRM 4 jadval; sinov: payload ularga to'liq mos.
  Foydalanuvchi qarori: analitikani CRM o'zi qiladi, biz taklif qilmaymiz.
- AILM loyihasi VS Code'da ochildi (lokal stend ishga tushirilib, keyin o'chirildi; `~/AILM-stend` bazasi yangidan seed qilingan, 22 dars yuklangan).
