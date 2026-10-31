# PRD · Mentor kursi — 12 ta ovozli mentor darsi

> **Holat:** v1 · 31.10.2026 — **[GATE PRD] o'tdi:** 6 qaror ham berildi (§9). Shu hujjat bo'yicha keyingi dars — Nest-2.
> **Manba:** 1-dars «NestJS arxitekturasi» (yopilgan, `src/mentor-kurs/NestArchMentorLesson.jsx`), qonun `MENTOR_DARS_ETALON.md` (M1–M24),
> jurnal `feedback/F-1029-02-mentor-kurs/JURNAL.md`, platforma SDK `LESSON_PROMPT_WITH_UNLOCK.md`.
> **Chegara:** bu hujjat — **mahsulot talablari** (nima, kim uchun, qachon tayyor). Ekran qoidalari etalonda turadi va bu yerda takrorlanmaydi — faqat raqami bilan havola (M4, M21…).

---

## 1. Muammo

Mentorlar eski dasturni (Node, Express, Auth, Telegraf, Swagger) biladi, lekin kursdagi **12 ta yangi mavzuni** bilmaydi va ularni hech kim o'rgatmaydi.
O'quvchi darsi mentorga yetmaydi: u o'quvchi uchun yozilgan, sinfda chiqadigan savol va xatolarga javob bermaydi.

## 2. Maqsad

Har yangi mavzu uchun **bitta ovozli mentor darsi**: mentor uni yolg'iz o'qiydi, yonida ustoz yo'q — dars o'zi ustoz.
Dars oxirida mentor:
1. mavzuni **biladi** (yakuniy sinov ≥ 6/8);
2. uni **o'z qo'li bilan qilgan** (4 amaliyot, har birida isbot);
3. o'quvchi darsini **qanday o'tishni** biladi (o'tish rejasi, vaqt, o'quvchi tili);
4. sinfda chiqadigan **xatolarga tayyor** (haqiqiy xato xabarlari va tayyor javoblar).

**Muvaffaqiyat o'lchovi (platformadan):** `onFinished.passed` ulushi · `finalAttempts` (1 urinishda o'tganlar) · amaliyot isboti to'g'ri ulushi · dars davomiyligi (`durationSec`).
**Muvaffaqiyat o'lchovi (sinfdan, qo'lda):** mentor guruhidagi savollar soni shu mavzu bo'yicha kamayadimi — Telegram guruhi kuzatiladi. *(Kim kuzatadi — hozircha hech kim, §9-5.)*

## 3. Foydalanuvchi

**Mentor** — Express'ni biladi, yangi mavzuni bilmaydi. Kursdagi **12 darsning hammasini** o'tib bo'lgach, sinfga kiradi (M8 — «keyingi darsda» deyilmaydi).
Til: o'zbek yoki rus (2-til — 31.10 dan, §6.3). Qurilma: kompyuter, 1280×720 dan 1920×1080 gacha (M15). Quloqchin yoki karnay.

## 4. Kurs tarkibi — 12 dars

Tartib — o'quvchi dasturidagi tartib; mentor darsi o'quvchi darsidan **oldin** o'tilishi kerak. **Qurish navbati (§9-6):** Nest-2 birinchi, keyin jadval boshidan (PostgreSQL-1 …).

| # | Mentor darsi | O'quvchi darsi | Holat |
|---|---|---|---|
| 1 | PostgreSQL: SQL va NoSQL, nega PostgreSQL | m4-03 | — |
| 2 | PostgreSQL: CRUD so'rovlar | m4-06 (+ m4-08 praktika) | — |
| 3 | **Nest-1:** arxitektura — Module, Controller, Service | m4a-01 | ✅ yopildi (UZ 30.10 · RU 31.10) |
| 4 | **Nest-2:** o'quvchi reposi — Entity, DTO, Repository, BaseService | m4a-03, m4a-04 (repo `IntroNestArxitechture`) | MD v3 navbatda (DAVOM «QAROR 18:14») |
| 5 | Jest: birinchi unit-test | m4b-01 | — |
| 6 | Jest: edge cases va error path | m4b-03 | — |
| 7 | CI/CD nima va nega | m4c-01 | — |
| 8 | GitHub Actions: workflow yozish | m4c-03 (+ m4c-04/07 loyiha kunlari) | — |
| 9 | Telegraf + PostgreSQL: bot eslab qoladi | m5-04 | — |
| 10 | WebSocket: doimiy ulanish | m10-02 | — |
| 11 | WebSocket: ulanish uzilsa | m10-05 | — |
| 12 | Webhook: to'lov Backend'ga qanday yetadi | m11-03 | — |

*(Jurnalda «12 NEW» ro'yxati: m4-03 · m4-06 · m5-04 · m4a-01 · m4a-03 · m4b-01 · m4b-03 · m4c-01 · m4c-03 · m10-02 · m10-05 · m11-03. Nest-2 = m4a-03 + o'quvchi reposi — 30.10 qarori.)*

## 5. Dars tuzilmasi (har darsda bir xil — Nest-1 dan)

| Bosqich | Nima | Ekran turi (dvigatel) | Qonun |
|---|---|---|---|
| Kirish | 3 natija, reja, «shoshilmang» | `Lesson` | M5, M17 |
| 1. Nega | tanish narsa (Express) → og'riq → yechim | `Lesson` | M10 (shartli misol ochiq aytiladi) |
| 2–4. Mavzu | haqiqiy loyiha, kod satrma-satr, Explorer har sahnada | `Lesson` + `Ide`/`CodePanel` | M1, M6, M19 |
| Amaliyot ×4 | har bosqichdan keyin, isbot maydoni bilan | `Practice` | M11, M18 |
| Tekshiruv ×5 | variantli + «qaysi satr xato», topilgach tuzatilgan kod | `MCRetry`, `LineCheck` | M2, M12, M20 |
| 5. Buzamiz | 3–4 haqiqiy xato: o'qish → tuzatish → yashil terminal | `Lesson` | M3, M18 |
| 7. Ko'prik | o'quvchi loyihasi, o'quvchi tili, dars xaritasi, qoqiladigan joylar, sinfdagi eng ko'p xato, vaqt rejasi, o'quvchi savollari | `Lesson` | M8, M9 |
| O'z-sinov | 8 savol, bitta urinish, ≥ 6 — o'tdi | `Screen27` | M12 |
| Yakun | Barakalla → xulosa → uyga vazifa → eslatma (.md) | `Screen28` | M13, M14 |

**Hajm mezoni (Nest-1 o'lchovi):** ~39 ekran · ovoz ~50 daqiqa · jami 1,5–2 soat. Mavzu kichik bo'lsa ekran kamayadi; 4 amaliyot va 5 tekshiruv — Nest o'lchovi, **qonun emas**: har dars o'ziga mos (§9-4, 31.10).

## 6. Texnik talablar

### 6.1 Platforma
- Bitta `.jsx`, import faqat `react` va `@lesson/runtime` (`useAudio`, `useSfx`, `useNextLessonAccess`).
- Kirish: `{ studentName, lang, onFinished }`. `onFinished` maydonlari — Nest-1 dagidek: `passed`, `testPassed`, `practiceDone`, `correctAnswers`, `finalAttempts`, `checks[]`, `answers[]`, `durationSec`.
- Yuklash fayli: `tayyorla.sh` → `.oz.jsx` (JS Chrome 70 ga pasaytiriladi). Nest-1: UZ 81 KB → UZ+RU 131 KB.

### 6.2 Dvigatel (umumiy)
- Manba bo'laklarda: `parts/01-asos.jsx` (CSS, til mexanizmi), `parts/02-dvigatel.jsx` (useBeats, Stage, Say, CodePanel, Ide, MCRetry, LineCheck, Practice), keyin ekran bo'laklari, oxirida `08-ru.jsx`.
- Yig'ish: `cat parts/*.jsx > <Dars>.jsx`; yig'ilgan faylga to'g'ridan tegilmaydi.
- **Qaror (§9-1, 31.10):** dvigatel **umumiy** — har yangi dars `parts/01–02` ni oladi; yopilgan dars `.oz.jsx` da muzlaydi, dvigatel tuzatilsa yopilgan darslar qayta yig'ilmaydi (faqat qaror bilan).

### 6.3 Ikki til — UZ + RU (31.10, F-1030-38)
- O'zbekcha — etalon. Ruscha matn **alohida bo'lakda** (`08-ru.jsx`): `ru(obj, {…})` — segmentlar `id` bo'yicha, kod satrlari va ro'yxatlar indeks bo'yicha.
- `setLang(lang)` ildizda bir marta: obyektning o'zi ruschaga almashtiriladi (o'zbekcha nusxa saqlanadi) — `S1.plan` kabi to'g'ridan o'qiladigan joy ham ruscha bo'ladi.
- Sahnadagi yozuv — `t(uz, ru)` (faqat render ichida). Dvigatel tugmalari ham `t()` orqali.
- Himoya: ruscha ma'lumot o'zbekchada yo'q joyga tushsa (`ruCheck`) — konsolda `[ru] o'zbekchada yo'q: …` xatosi.
- Ruscha uslub: «Вы», mentor imtihoni — dasturlash atamalari inglizcha (Controller, route, dependency…); o'quvchi darsining ruscha metafora so'zlari aynan olinadi (официант, повар…).
- Ovoz belgisi tilga qarab: `[O'zbekcha tallaffuz]` / `[Русское произношение]`; inglizcha iboralar ikkala tilda `[English pronunciation] … [end]`.
- Analitika (`onFinished`) — o'zbekcha qoladi (RU_I18N_SPEC 5-qoida).

### 6.4 Ovoz
- Platformada: ElevenLabs v3 (`useAudio` matndan yasaydi, mp3 saqlanmaydi). Lokal: edge-tts — UZ `uz-UZ-SardorNeural`, RU `ru-RU-DmitryNeural`.
- Segment ≤ 60 so'z, ovozda kod va `/ + = % ×` yo'q (M21). Ovoz ishlamasa dars qotmaydi (M16).

### 6.5 Haqiqiy chiqish
- Darsdagi har terminal chiqishi, xato xabari va raqam — haqiqiy ishga tushirishdan (`manba/drive*.sh` → `manba/nest-out/`). Har dars o'z `manba/` papkasini oladi (M10, M22-3).

## 7. Ishlab chiqish jarayoni (har dars)

1. **Manba yig'ish:** o'quvchi darsi (App.jsx `comp:`), o'quvchi reposi (bo'lsa), kursdagi oldingi mentor darslari (M8 — mentor hammasini biladi).
2. **Haqiqiy loyiha:** lokal ishga tushirish, hamma holat va xatoni yozib olish (`drive.sh`).
3. **MD v3** — har ekran, har ovoz segmenti, har tekshiruv (konveyer `1-MD.md` formati, mentor varianti) → **[GATE M]** foydalanuvchi.
4. **Kod:** Nest-1 dvigatelidan; ekran bo'laklari yangi.
5. **Foydalanuvchi so'zma-so'z ko'rigi** (39 ekran surati) → F-ID'lar → tuzatish → yangi M-qonun (sinf-supurish: hamma qurilgan mentor darslarida).
6. **UX ko'rigi** — oldin/keyin artifact, faqat tasdiqlangani (M23 usuli).
7. **RU** — `08-ru.jsx` + sahna `t()` (§6.3).
8. **Yopish sinovi (M22)** — §8 jadvali.
9. **`.oz.jsx`** → LMS (G retsepti, `LMS_REESTR.json`).

## 8. Tayyorlik mezoni (Definition of Done)

| # | Band | Qanday tekshiriladi |
|---|---|---|
| 1 | Etalon tekshiruv ro'yxati (M1–M23) | `MENTOR_DARS_ETALON.md` 4-bo'lim |
| 2 | esbuild · vite build · `lint:jsx` 0 · `lint:til` 0 error | buyruqlar DAVOM.md da |
| 3 | Ovozli to'liq o'tish **UZ** — 1920 va 1280: 39/39, qotgan 0, kirishda qulf, `onFinished` 3 × true | `dev/e2e-ovozli-otish.mjs W H uz` |
| 4 | Ovozli to'liq o'tish **RU** — xuddi shunday | `dev/e2e-ovozli-otish.mjs W H ru` |
| 5 | RU qoldiq 0: ekranda, «Matn»da, ovozga ketgan matnda o'zbekcha so'z yo'q; konsolda `[ru]` xatosi yo'q | `dev/til-tekshiruv.mjs all ru` |
| 6 | **UZ o'zgarmagan:** RU qo'shilgandan oldin va keyin — har ekran matni va ovoz matnlari belgima-belgi bir xil | `dev/til-tekshiruv.mjs all uz … natija.json` ×2 |
| 7 | 1280×720: sahifa siljimagan, yoritilgan satr yashirinmagan, nav kesilmagan — ikkala tilda | `dev/ekran-olchov.mjs … uz|ru` |
| 8 | `.oz.jsx` siqilgan holda ikkala tilda render bo'ladi | qoldiq-skripti `oz` kaliti bilan |

## 9. Qarorlar (foydalanuvchi, 31.10.2026)

| # | Savol | Qaror |
|---|---|---|
| 1 | Dvigatel: nusxa yoki umumiy `parts/`? | **Umumiy dvigatel** (`parts/01–02`), har dars yopilganda `.oz.jsx` ichiga muzlatiladi — platformadagi fayl o'zgarmaydi. |
| 2 | Ruscha tarjimani kim ko'radi? | **Foydalanuvchi o'zi** («yaxshi chiqibdi»). Ko'rikdan o'tmagan tarjima — texnik tekshiruvdan o'tgan, lekin «tasdiqlanmagan» deb yuriladi. |
| 3 | ElevenLabs ruscha ovozi | **Erkak ovozi** (UZ bilan bir xil ohangda). Platformada sinaladi. |
| 4 | Hajm: 4 amaliyot / 5 tekshiruv qat'iymi? | **Yo'q, moslashuvchan:** har dars o'ziga xos — mavzuga qarab. 4/5 — Nest o'lchovi, qonun emas. Savol tug'ilsa — foydalanuvchidan so'raladi. |
| 5 | Natijani kim kuzatadi? | **Hozircha hech kim** — keyin hal qilinadi (31.10). Darsda analitika qismi loyihalanmaydi; `onFinished` maydonlari saqlanadi. |
| 6 | Darslar tartibi | **Avval Nest-2**, keyin **boshidan**: PostgreSQL-1 → PostgreSQL-2 → Telegraf+PG → Jest ×2 → CI/CD ×2 → WebSocket ×2 → Webhook (§4 tartibi). |

## 10. Tekshiruv vositalari (31.10 holati)

| Vosita | Joyi | Nima qiladi |
|---|---|---|
| `e2e-ovozli-otish.mjs` | `feedback/F-1029-02-mentor-kurs/dev/` | ovoz 16× bilan muqovadan oxirigacha, `[uz|ru]` |
| `ekran-olchov.mjs` | o'sha joy | `?s=N` har ekran, 1280×720 o'lchov, `[uz|ru]` |
| `til-tekshiruv.mjs` | o'sha joy | RU qoldiq (ekran + «Matn» + ovoz matni) · `natija.json` — UZ/RU solishtiruv, `.oz.jsx` sinovi |
| `tts-server.py` | `dev/` | edge-tts; matn `[Русское произношение]` bilan boshlansa — Dmitry |

---

## Ilova A · Har dars uchun PRD shabloni (MD v3 dan oldin to'ldiriladi, ½ sahifa)

```
# Mentor darsi N · <mavzu>
O'quvchi darsi: <key> «<nom>» (+ praktika <key>)        Kursdagi o'rni: <oldingi mentor darsi> → shu → <keyingi>
1. Mentor dars oxirida nimani BILADI (3 gap)
2. Mentor nimani O'Z QO'LI BILAN qiladi (4 amaliyot · har birining isboti — nima yoziladi)
3. Haqiqiy loyiha: <repo / noldan> · lokal ishga tushirish buyrug'i · manba/drive.sh holatlari (ro'yxat)
4. Buzamiz: 3–4 haqiqiy xato (xabar matni → qaysi klass · qaysi dependency · qaysi fayl → tuzatish)
5. Ko'prik: o'quvchi darsi xaritasi (blok → «siz nima deysiz») · o'quvchi tili (metafora ↔ atama) · qoqiladigan 6 joy · sinfdagi eng ko'p xato · vaqt rejasi
6. Tekshiruv 5 + o'z-sinov 8 — mavzular (savol matni MD v3 da)
7. Uyga vazifa (topshirish: faqat GitHub repo linki → platforma; Telegram va skrinshot yo'q — 31.10, M30)
8. Hajm: ekran soni ≈ · ovoz ≈ daqiqa · jami ≈ soat
9. Xavf / ochiq savollar
```

## Ilova B · Nest-2 — to'ldirilgan PRD (DAVOM.md «QAROR 18:14» dan, tasdiqlanmagan)

```
# Mentor darsi 4 · Nest-2: o'quvchi reposi — Entity, DTO, Repository, BaseService
O'quvchi darsi: m4a-03 «Birinchi resursni qo'lda qo'shish — mashinalar» + m4a-04 «Praktika — KitobShop backend»
Kursdagi o'rni: Nest-1 (arxitektura) → shu → Jest-1
1. Biladi: o'quvchi reposining 5 farqi (server api/app.service.ts da · /api/v1 prefiks · AllExceptionFilter
   {statusCode, error:{message}} · global ValidationPipe whitelist/forbidNonWhitelisted · config/index.ts);
   qatlamlar: Entity/Base.entity, DTO (create/update/signin), Repository, BaseService (CRUD), Guard, successRes, pagination.
2. Qo'li bilan: clone + .env.example + createdb nestarxitechture + start:dev → Swagger (/api/v1) · resurs qo'shish
   (m4a-03 kabi) · DTO 400 ni o'zi chiqarish · BaseService'dan meros.
3. Loyiha: github.com/Azizbekcrypto/IntroNestArxitechture (HEAD), lokal PG17.
4. Buzamiz: baza ulanmadi (4 xabar — Nest-1 Rdb dan chuqurroq) · prefiks unutildi (404) · DTO'da ortiqcha maydon (400 forbidNonWhitelisted) · …
5. Ko'prik: m4a-03 va m4a-04 xaritasi.
7. Uyga vazifa: clone + ishga tushirish + 5 savol (javobsiz, AI bilan) → GitHub repo linki → platforma (31.10, M30: Telegram va skrinshot yo'q).
```
