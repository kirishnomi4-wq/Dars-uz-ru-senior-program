# F-1029-02 · Mentor kursi — 12 NEW dars uchun ovozli JSX darslar

## Nima (29.10.2026)
Mentorlar eski dasturni (Node/Express/Auth/Telegraf/Swagger) biladi; 12 ta NEW mavzuni bilmaydi va ularni
hech kim o'rgatmaydi. Har NEW dars uchun **mentor darsi**: JSX, ovozli (ovoz + ekran sinxron), yolg'iz o'qiladi,
CRM'dagi mentor platformasida ochiladi. O'quvchi darsi (foydalanuvchi so'zi bilan) tushunarli emas — mentor darsi
noldan, haqiqiy loyiha va haqiqiy chiqishlar ustida quriladi.

## Qarorlar (foydalanuvchi, 29.10)
- Format: JSX + ovoz. Ekran-yozuv (video) KERAK EMAS. O'yin qatlami yo'q.
- Ovoz: yakunda ElevenLabs (platformaga qo'yish oldidan); ungacha lokal erkak ovozi → taklif `uz-UZ-SardorNeural` (edge-tts).
- Birinchi dars: Nest arxitekturasi (m4a-01 ga mos). Shoshilmaslik, «oddiy emas, haqiqiy dars».
- Til uslubi: mentor imtihoni (`~/Desktop/exam/Backend Imtihon.docx`) kabi — atama inglizcha + qavsda izoh, adabiy «siz».
- Mentor soni va muddat — foydalanuvchi: «sanga nima daxli», ya'ni rejani cheklamaydi.

## 12 NEW dars ↔ repo
m4-03 SQL/NoSQL · m4-06 PostgreSQL CRUD · m5-04 Telegraf+PostgreSQL · m4a-01 Nest arxitektura · m4a-03 Entity/DTO/Repository ·
m4b-01 Jest · m4b-03 Edge cases · m4c-01 CI/CD · m4c-03 GitHub Actions · m10-02 WebSocket · m10-05 Ulanish uzilsa · m11-03 Webhook

## Qilindi (29.10)
- Haqiqiy Nest 11 loyiha (`cars-api`) scratchpad'da yaratildi; 9 holat yurgizildi (toza · CLI · ishlaydi · 4 buzish · Error vs HttpException · /cars/abc · bo'sh POST). Chiqishlar: `manba/nest-out/`, skript `manba/drive.sh`.
- Ssenariy v1: `01-NestArch-mentor-v1.md` — 28 ekran, har ekran: Ekranda · Ovoz (to'liq matn, `[[id]]` sinxron belgilari) · Harakat · davomiylik. 3 tekshiruv, amaliyot (6 qadam + «boshqacha chiqsa» jadvali), o'quvchi darsiga ko'prik (IntroNestArxitechture daraxti + restoran-lug'at), 8 savollik o'z-sinov.
- edge-tts o'rnatildi (`~/.local/bin/edge-tts`, python `~/.local/lib/python3.14`); Sardor ovozi sinovdan o'tdi (`sample`): CLI ishlaydi; Python API'da so'z-chegarasi uchun `boundary` parametri tekshirilishi kerak.

## Ochiq savollar → MD B-bo'limi (audio joyi · platforma protokoli · skrinshot topshirish · sinov natijasi · qoralama ovoz · 1 dars yoki 2)

## DAVOM (keyingi seans)
1. GATE M: foydalanuvchi MD'ni o'qiydi (`>>` bilan), B-bo'lim savollariga javob.
2. Tasdiqdan keyin: audio-generator (MD → 28 mp3 + json, `[[id]]` → vaqt) → ko'rik-sahifa (tinglab ko'rish) → ovoz-dvigatel JSX → Nest darsi JSX.
3. Qolip muhrlanadi → qolgan 11 dars.

## 29.10 15:50 — ko'rik-sahifa tayyor
- `manba/mentor-tts.py` MD → 36 audio (`korik/audio/`), so'z-vaqt bilan; `korik/data.json`; jami ovoz 25.7 daqiqa (28 ekran).
- `korik/index.html`: har ekran — «Ekranda» + ovoz (so'z-sinxron yoritish, −10 s, tezlik, avto-davom) + fikr qutisi (localStorage) + «Fikrlarni nusxalash» (>> formatida).
- Lokal server: `python3 -m http.server 5331 --bind 127.0.0.1` (korik/ ichidan) → http://127.0.0.1:5331/
- Qoralama ovoz chegarasi: inglizcha atamalar (NotFoundException, providers) o'zbek ovozida taxminiy; `@` belgisi TTS'ga yuborilmaydi; ElevenLabs'da talaffuz lug'ati bilan tuzatiladi.

## 29.10 16:10 — TEXNIKA aniqlandi + prototip (6 ekran) ishga tushdi
**Foydalanuvchi javoblari (29.10):** platforma haqida o'ylamaslik, hozir faqat dars sifati; yakshanba darsni to'g'rilash, dushanba ElevenLabs → platforma.
Amaliyot platformada yuklanadi + test; natija qayd (keraklisi); Sardor hozircha maqul; ekran soni cheksiz, asosiysi: ovoz + animatsiya,
«tiq-tiq» ko'rsatish, keraksizi UI'da qolmasin, keyingisi kirib oldingisi ketsin — YANGI metodika, eski dars-dizayn metodikasi mos emas.
**Texnika (jsx optimisation / matematika darslari):** platforma SDK `@lesson/runtime` (hujjat: `LESSON_PROMPT_WITH_UNLOCK.md`):
- `useAudio(segments)` — ovozni PLATFORMA beradi (ElevenLabs v3, matn bo'yicha kesh): segment `{id, text, trigger: on_mount|after_previous, waits_for}`;
  maydonlar `isPlaying · muted · waitingFor · currentId · triggerEvent · replay · pushOneOff · toggleMute` (sekin-lab stub + Mirziyo darsi).
  Matn `[O'zbekcha tallaffuz]` bilan boshlanadi, `[pause]` kabi 0–2 teg, segment ≤25 s (60–80 so'z). So'z-vaqt YO'Q → sinxron SEGMENT darajasida.
- Demak mp3 saqlash savoli yopildi: audio fayl yo'q, matn bor. Lokal dev uchun shim: `src/mentor-kurs/dev/lesson-runtime.jsx` (segment-navbat,
  dev TTS-server `dev/tts-server.py` :5332, edge-tts Sardor, sha1 kesh `korik/tts-cache/`).
- Bitta `.jsx`, import faqat react + runtime (framer-motion/lucide node_modules'da yo'q → oddiy React + CSS); `.oz.jsx` yuklash uchun `jsx optimisation/optimizatsion lesson/tools/tayyorla.sh`.
**Prototip:** `src/mentor-kurs/NestArchMentorLesson.jsx` — muqova + S1 reja + S2 Express (38→1240 qator) + S5 sxema (so'rov nuqtasi) + S6 Controller kodi + Tekshiruv 1.
Metodika: chapda USTOZ GAPI (faqat hozirgi segment, oldingisi xira), o'ngda SAHNA; har segment = qadam: element kiradi/yoritiladi/xiralashadi; ovoz tugagach «Davom» yonadi.
Dev: `python3 feedback/F-1029-02-mentor-kurs/dev/tts-server.py 5332 &` · `npx vite --config vite.mentor-kurs.config.js --port 5333 --strictPort` → http://localhost:5333/mentor-kurs.html (`?s=N` — N-ekrandan).
Chrome'da ko'rildi: ovoz, qadamlar, fokus ishlaydi; tuzatildi: muqova shrifti, oldingi gap HTML, kod-panel balandligi.

## 29.10 17:30 — foydalanuvchi fikri + to'liq dars (28 ekran) yig'ildi
Fikr: ikki ustun ✓ · qadamlar o'zi ketsin ✓ · oq fon ✓ · metodika yoqdi. Nuqson: (1) sxema ekranida sahna toraygan (grid-sahnaga `justify-content:center` — tuzatildi, sxema qayta loyihalandi: 3 quti + strelkalar + so'rov nuqtasi);
(2) tekshiruvda xato tanlanganda to'g'ri javob ochilib qolgan — endi **MCRetry**: xato variant qizil bo'lib yopiladi, to'g'risini topguncha bosadi, `tries`/`firstTry` qayd; «Davom» topilguncha yopiq.
Dars manbasi bo'laklarda: `src/mentor-kurs/parts/01…07` → `cat parts/*.jsx > NestArchMentorLesson.jsx` (1520 qator, esbuild ✓, lint:jsx ✓).
Ekranlar: muqova · S1 reja · S2 Express 38→1240 · S3 tartib (jamoalar vs Nest) · S4 dekorator · S5 sxema · S6 Controller · S7 Service (+qayta ishlatish) · S8 Module (+daraxt) · S9 main+jurnal · S10 tekshiruv · S11 DI · S12 CLI · S13 bo'sh fayllar · S14 Service kodi · S15 Controller kodi (+Express↔Nest jadval) · S16 jurnal+so'rov paneli · S17 tekshiruv · S18–S21 to'rt buzish · S22 Error vs HttpException · S23 tekshiruv · S24 amaliyot (6 qadam, katakcha, «Kod» tugmasi, jadval) · S25 ko'prik (daraxt+lug'at) · S26 savollar · S27 o'z-sinov 8 (birinchi urinish hisob) · S28 yakun (completeLesson + onFinished).
Chrome'da 28 ekran ko'rildi (?s=N bilan): konsol xatosi 0; sxema, kod-fokus, terminal, so'rov paneli, buzishlar, amaliyot ro'yxati, daraxt+lug'at, savol-kartalar, o'z-sinov, yakun — ishlaydi.

## DAVOM (keyingi seans)
1. Foydalanuvchi darsni boshidan oxirigacha o'tadi (http://localhost:5333/mentor-kurs.html; serverlar: tts :5332, vite :5333) → fikrlar → tuzatish.
2. Sayqal: segment matnlari ≤25 s (uzunlarini bo'lish), ElevenLabs uchun `[English pronunciation] … [end]` atamalarga, `[pause]`.
3. Yuklashga tayyorlash: `jsx optimisation/optimizatsion lesson/tools/tayyorla.sh src/mentor-kurs/NestArchMentorLesson.jsx` → `.oz.jsx` (framer/lucide yo'q, faqat react + runtime).
4. Qolip muhrlanadi → qolgan 11 NEW dars shu dvigatelda (parts/01–02 umumiy).

## 29.10 18:30 — F-fikr 2 (3 xato) tuzatildi + halol audit
Tuzatildi: S26 (bir karta, oxirida yopiq) · S24/S28 har band o'z segmentida · S27 natija (oppoq ekran) + «N-ekranga qaytish» (root: onGoto/returnTo). esbuild ✓ lint:jsx ✓, Chrome'da tekshirildi (S26, S27 natija 7/8, qaytish→Davom→natija).
Audit: `AUDIT-2026-10-29.md` — 12 metodik + texnik + mayda. Keyingi: foydalanuvchi bilan yechimlar.

## 29.10 kech — AUDIT yechimlari qo'llandi (foydalanuvchi tasdig'i: 2 kalit ibora ✓, 4 oldingi gap yo'q ✓, 11 yakuniy bir urinish ✓, 8 o'tish rejasi 3 ekran ✓)
Dars 28 → **37 ekran**: +Amaliyot 1/2/3 (S9, S16, S22 dan keyin), S5 → fayllar + so'rov yo'li, S25 → daraxt + lug'at, +2 «qaysi satr xato» tekshiruvi (LineCheck),
+3 bashorat (S13 Mapped chiqadimi · S19 server ishga tushadimi · S21 Injectable'siz ishlaydimi — `ask` segment, waits_for button_click),
+3 «o'tish rejasi» ekrani (m4a-01 xaritasi 6 blok · qoqiladigan 6 joy · 90 daqiqa + 3 qoida), S28 da eslatma (nusxalash + .md yuklab olish).
Matn: har segmentda `key` (kalit ibora) — chapda faqat shu; «Matn» tugmasi butun transkriptni ochadi; oldingi kulrang gap olib tashlandi.
Ovoz: kod o'qilmaydi, «/» va «@» so'z bilan (skan: 181 bo'lak, 0 ta «/», 0 ta «@», 80+ so'z yo'q, jami 3354 so'z ≈ 24 daq). S2 1240 qator — «o'sgan loyihadan misol» deb halol belgilandi (haqiqiy katta Express fayl topilmadi).
Yakuniy sinov: bitta urinish, izoh ochiladi, 6/8, qayta topshirish tugmasi, urinishlar soni payload'da. color-mix olib tashlandi.

## 29.10 18:56 — v2 (37 ekran) brauzerda to'liq tekshirildi + 2 tuzatish
Foydalanuvchi: audit ro'yxatini «maqul, qil» degan (2 kalit ibora · 4 oldingi gap yo'q · 8 o'tish rejasi · 11 yakuniy bir urinish — alohida tasdiqlangan). Seans uzilgan joy: v2 yig'ilgan, brauzer-tekshiruvi yo'q edi.
Tekshiruv: Chrome, ovoz 8× tezlikda, 1→37 «Davom» bilan; konsol xatosi 0. Ishlaydi: kalit ibora + «Matn» tugmasi (2-band) · oldingi kulrang gap yo'q (4) · amaliyot 1/2/3 (katakcha, «Kod» paneli, 3/3 dan keyin «Davom») · tekshiruv 1/3/5 MCRetry (xato qizil-yopiq, to'g'risi ochilmaydi, tries qayd) · satr-tekshiruv 2/4 (xato satr → «bu satr emas» izohi, to'g'ri → yashil) · bashorat ×3 S13/S19/S21 (tugma → natija) · o'tish rejasi 3 ekran (8) · yakuniy sinov bir urinish + izoh + natija 5/8 + «N-ekranga qaytish» (17 → qaytish → natijaga) + «Sinovni qayta topshirish» (11) · S28 eslatma (nusxalash / yuklab olish .md) + onFinished payload (score · passed · finalAttempts · checks · practiceDone · answers).
Tuzatildi: (1) kichik ekran (audit B) — 1366×768 va 1280×720 da S14 kod paneli ichida aylanadi, yoritilgan 22–26 satrlar pastda ko'rinmas edi → CodePanel yoritilgan blokni (yoki shu qadamda kirgan satrni) panel ichida ko'rinishga aylantiradi (`parts/02-dvigatel.jsx`, satrda `data-at`); 1280×720 da tekshirildi (scrollTop 52, blok to'liq ko'rinadi), katta ekranda panel sig'sa aylantirmaydi. (2) til-lint 29 error: qiyshiq apostrof ‘ ’ (so‘rov, ro‘yxat, og‘riq…) 30 satrda → to'g'ri ' (ichida apostrof bor JS satrlari qo'shtirnoqqa o'tkazildi); 0 error, Chrome'da sarlavha tekshirildi.
Darvozalar: esbuild (--external @lesson/runtime) ✓ · lint:jsx ✓ · lint:til 0 error / 7 warn (sen-imperativ 1036 — «ol → chaqir → qaytar» naqsh, yolg'on-musbat; keyingi-darsda-vada 6× — mentor darsida ko'prik ataylab) · `npm run gates` 3 qizil: esbuild (umumiy darvoza @lesson/runtime'ni bilmaydi), dark (kod-panel #111827/#1F1115 — mentor dizayni: oq sahifa + qora kod-panel), til (endi 0 error — qayta yurganda yashil).
Ochiq (audit B/C): ElevenLabs teglari `[English pronunciation]…[end]`, `[pause]` — DAVOM 2 · S5b so'rov nuqtasi quti ustida (kosmetik) · S28 kichik ekranda «Keyingi dars» kartasi sahna ichida aylanib ko'rinadi · resume yo'q (platforma hal qiladi) · ruscha ovoz (10-band) — qaror yo'q.
Dev eslatma: `?s=N` bilan to'g'ridan ochilganda brauzer autoplay'ni rad etadi → shim segmentlarni ovozsiz oxirigacha o'tkazadi (ekran yakuniy holatda ko'rinadi); muqovadan «Boshlash» bilan ochilsa ovoz ishlaydi.

## DAVOM (keyingi seans)
1. Foydalanuvchi darsni boshidan oxirigacha o'tadi → fikrlar → tuzatish. Serverlar: `python3 feedback/F-1029-02-mentor-kurs/dev/tts-server.py 5332 &` · `npx vite --config vite.mentor-kurs.config.js --port 5333 --strictPort` → http://localhost:5333/mentor-kurs.html
2. ElevenLabs sayqal (atama teglari, `[pause]`, segment ≤25 s tekshiruvi). 3. `tayyorla.sh` → `.oz.jsx`. 4. Qolip muhrlanadi → qolgan 11 NEW dars.

## 29.10 19:20 — halol audit №2 (foydalanuvchi: «o'zing ko'rib chiq, hammasini tashla, yechimni keyin»)
37 ekran matni to'liq o'qildi; faktlar tekshirildi (o'quvchi darsi SCREEN_META 22 ✓, nest-out 9 holat ✓, daraxt qisman ≠). Natija: `AUDIT-v2-2026-10-29.md` — 30 band: A metodik 14 (eng og'iri: ko'prik sinfdagi baza-ulanish xatosini qoplamaydi; amaliyot 2 nusxalash; isbot yo'q; yakuniy sinov fakt-takror; LC2 ikki ma'noli), B fakt 5 (S21 Injectable da'vosi ehtimol noto'g'ri — sinash shart; Node 20+; daraxt), C matn 6 (tekshiruv-izohlari «to'rt yuz to'rt» shaklida ekranda), D platforma 5. Yechimlar foydalanuvchi bilan — hech narsa o'zgartirilmadi.

## 29.10 19:59 — audit №2 yechimlari qo'llandi (foydalanuvchi: «halol qila oladigan fiksni ayt, qilaylik»; yordam = «mentor-kurs Telegram guruhi» umumiy; Orqaga — keyinga)
**Haqiqiy chiqishlar** (`manba/drive2.sh`, scratchpad cars-api, Nest CLI 11.0.10 / core 11.2.8 / Node 24 → `nest-out/10–18`):
- 11 bo'sh POST `{}` → 201 `{"id":3}`; bodysiz POST → 201 `{"id":4}`.
- 12 @Injectable YO'Q + konstruktorda PricingService → server XATOSIZ ishga tushadi, GET /cars → 500, jurnal `TypeError: Cannot read properties of undefined (reading 'withDiscount')` — darsdagi «can't resolve dependencies chiqadi» da'vosi NOTO'G'RI edi (B15 tasdiqlandi). 13 @Inject parametr-dekoratori bilan, @Injectable'siz → ishlaydi (200). 14 nazorat ✓.
- 15 port yopiq → `Unable to connect to the database. Retrying (1)…` + `connect ECONNREFUSED 127.0.0.1:5433`; 16 .env yo'q → `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`; 17 parol noto'g'ri → `password authentication failed for user "postgres"`; 18 «baza yo'q» holati olinmadi (parol noto'g'ri bo'lib chiqdi) — darsga kirmadi. 10 urinishdan keyin ExceptionHandler bilan yiqiladi ✓.
**Dars 37 → 39 ekran.** Qo'llanganlar (audit raqami): A1 yangi ekran Rdb «Baza ulanmadi: uch xabar, uch sabab» (R2 dan keyin, haqiqiy chiqishlar + jadval) · A2 Amaliyot 3: Service nusxalanadi, Controller qo'lda (Kod panelida «namuna — nusxalash yo'q») · A3 har amaliyotda isbot-maydoni (P1 `nest --version` 11.x · P2 `Mapped {/, GET}` satri · P3 `/cars/99` message · P4 xabardagi modul nomi), `passed = sinov ≥6 && 4 amaliyot isbot bilan`, `testPassed` alohida · A4 yakuniy sinov 7–8: ko'rilmagan xato (UsersService/ConfigService) + yangi modul kodi «server nima qiladi» · A5 LC2 `target: [7, 8]` ikkala satr qabul · A6 S13 bashorat fayllardan oldin, 3 variant · A7 Amaliyot 1 bo'lindi: P0 (Node 20+ · CLI · `nest new` boshlab qo'yish, o'rnatish fonda) S5a dan keyin; eski P1 → «ishga tushiring, jurnalni o'qing» · A8 S6 `private readonly` segmenti, S14 `Omit<Car,'id'>` izohi · A9 Tekshiruv 3 izohi qisqardi, bo'sh POST fakti S16 ga haqiqiy chiqish bilan (r5) · A10 S25a chegara gapi · A11 har amaliyot jadvalida «Hech biri emas → mentor-kurs Telegram guruhi» · A13 tekshiruvlarda «1-urinish hisoblanadi» · A14 S16: 5 tugma bosilmaguncha Davom yopiq (`Lesson ready`) · B15 S21 d2 segmenti + haqiqiy terminal bloki, S26 Q6, eslatma #4 · B16 Node 20+ (P0, R2) · B17 daraxt: auth/, decorator/, BaseService.ts · B18 S2 «shartli misol, haqiqiy loyiha emas» · C20 `digits()` — ovoz so'z, ekran raqam (404/500/201/[0]) transkript va tekshiruv-izohlarida; `okShort` qisqa ekran-izoh · C21 kalit iboralar `GET /cars/:id` · C23 «slesh» yo'q · C24 muqova «jami 60–70 daqiqa» · C25 keyingi dars nomi App.jsx m4a-03 bilan.
**Dvigatel:** Practice `proof` + `HELP_ROW` + `copy:false`; MCRetry/LineCheck `okShort`, `targets[]`; Lesson `ready`; `.mk-input` CSS; `PRACTICE_COUNT`.
**Darvozalar:** esbuild ✓ · vite build (oxc) ✓ — bir marta yiqildi: apostrof-sed bir tirnoqli satrni buzdi (FINAL Q7 `e:`), qo'shtirnoqqa o'tkazildi · lint:jsx ✓ · lint:til 0 error / 7 warn (eski) · ovoz ≈3550 so'z ≈25 daqiqa.
**Chrome:** P0 isbot (xato → izoh, to'g'ri → ✓ + Davom), S6 7 segment, S13 3-variantli bashorat → fayllar keyin, S16 5 tugma → Davom, P2 Kod paneli namuna, S21 terminal bloki, LC2 9-satr qabul (ikkala yashil), Rdb, S27 yangi 7–8 + «N-ekran» raqamlari (3·18·20·23·28·23), S28 eslatma; konsol 0 xato.
**Qolgan:** A12 Orqaga (foydalanuvchi: keyin) · platforma bandlari · ElevenLabs teglari · foydalanuvchi butun darsni so'zma-so'z ko'rib chiqadi (keyingi qadam).

## DAVOM (keyingi seans)
1. Foydalanuvchi 39 ekranni so'zma-so'z ko'rib chiqadi → fikrlar → tuzatish. Serverlar: tts :5332 · vite :5333 → http://localhost:5333/mentor-kurs.html (muqovadan «Boshlash»).
2. A12 Orqaga (ekran yakuniy holatda, ovozsiz, ↺ boshidan) — dvigatel. 3. ElevenLabs sayqal. 4. tayyorla.sh → .oz.jsx. 5. Qolip → 11 dars.

## 29.10 21:37 — chala ishlar avtopilotda (foydalanuvchi: «chala ishlarni boshidan oxirigacha ot»; buzuq → o'zim tuzataman, matn/metodika fikri → ro'yxat; daraxt qoladi; oxirida lokal commit, push yo'q)
**1. v3 to'liq o'tish 1→39 (Chrome, ovoz 8×, muqovadan «Boshlash»):** 39/39 ekran, har birida Davom ochildi; 4 amaliyot (isbot: xato qiymat → izoh, to'g'ri → ✓), 5 tekshiruv (xato variant → qizil + izoh, to'g'ri → okShort), 3 bashorat, S16 5 tugma → Davom, yakuniy sinov bir urinish 7/8 → natija, S28 «Darsni yakunlash» → onFinished: passed ✓ · testPassed ✓ · practiceDone ✓ · finalAttempts 1 · checks 5 ta (tries qayd). Konsol: haqiqiy xato 0; 12× ogohlantirish `[lesson-runtime] autoplay rad: play() interrupted by pause()` — lokal shim, ekran almashganda one-off ovoz to'xtatiladi (platforma runtime'iga taalluqli emas, dars zanjiri buzilmaydi). Kuzatuv: yangi matn birinchi marta TTS'da yasalayotganda «Keyingi qadam →» tugmasi bir necha soniya ko'rinadi (shim `status: idle`) — dev-artefakt.
**F-1029-02-01 · Rdb 4-holat «baza mavjud emas»** (audit №2 dan ochiq). Haqiqiy chiqish olindi: scratchpad'da `nest new cars-api` (CLI 11.0.10, Node 24) + TypeORM, lokal PostgreSQL 17 (:5432), mavjud rol, yo'q baza `cars_db` → `ERROR [TypeOrmModule] Unable to connect to the database. Retrying (1)...` + `error: database "cars_db" does not exist`, 10 urinish → `ERROR [ExceptionHandler]` → `manba/nest-out/18-db-not-exist.log` (eski 18 fayli parol xatosi edi — almashtirildi; `.curl` — server ishga tushmadi). Darsga: `parts/07` DB_ERRS 4-blok + 10-urinish bloki at:5 · DB_ROWS 4-qator · yangi segment `d2` (ovoz: «database, nomi, does not exist», ekran: `createdb cars_db`) · sarlavha «to'rt xabar, to'rt sabab» · a/e segmentlari «to'rtta/to'rt xabar» · focus 1–5, qoida bloki at:5 · R2 STUMBLE «keyingi ekranda to'rt xabar» · eslatma (CHEATSHEET) 4-xabar. Chrome 35-ekran: 4 qator, har qadamda yoritish ✓; 1280×581 da ham yoritilgan satr va qator ko'rinadi.
**F-1029-02-02 · S28 kichik ekranda eslatma ko'rinmaydi** (audit №2 ochiq). Tasdiqlandi: 1280×581 viewport'da 7-qadamda («Eslatmani oling») eslatma va «Keyingi dars» kartasi sahnadan pastda. Tuzatildi: `parts/07` Screen28 — sahna `ref`, 7-qadamda eslatma blokiga silliq aylantirish, faqat sahna sig'masa (CodePanel naqshi). Chrome: iframe 1280×581 — scrollTop 350, eslatma + karta to'liq ko'rinadi; katta ekranda aylantirmaydi (sh = ch).
**F-1029-02-03 · R2 kalit iborasida «Node 18+»** — ovoz «yigirma yoki undan yuqori» (B16 da kalit qolib ketgan). `parts/07` R2 c → «Node 20+». Sinf-supurish: `grep 18+` parts — 0 qoldi.
**F-1029-02-04 · «Matn» transkriptida raqam so'z bilan / buzuq.** `digits()` «ming ikki yuz qirq» → «ming 200 qirq» (S25b/R1); yana «o'n birinchi versiya Node yigirma», «yigirma qator», «Yigirma ikki ekran», «o'n-o'n besh», «o'n marta», «Ikki-besh», «to'qson/o'ttiz daqiqa», «O'ttizdan oltmishgacha»… so'z bilan. Tuzatildi bitta joyda: `parts/02` DIGITS — uzun ibora oldin (`ming ikki yuz qirq` → 1240) + 11 yangi ibora (11-versiya, 10–15, 10 marta, 2–5, 22, 30–60, 60–90, 20, 30, 90). Ovoz matni o'zgarmadi. Sinf-supurish: barcha segmentlar skript bilan `digits()` dan o'tkazildi (scratchpad `digits-check.mjs`) — so'z-raqam qolmadi; iboralar segmentdan tashqarida (ok/wrong/hint/FINAL) uchramaydi. Chrome 33/34-ekran «Matn»: 22 · 1240 · 2–5 · 20 · 3000 ✓.
**Tekshirildi, nuqson yo'q:** S5b so'rov nuqtasi — qutidan 20px yuqorida, ustiga chiqmaydi (audit 30 yopildi, o'zgartirish yo'q).
**Darvozalar (oxirgi yig'ishdan keyin):** esbuild ✓ · vite build (oxc) ✓ · lint:jsx TOZA · lint:til 0 error / 7 warn (eski).
**Qonunlashtirish:** F-1029-02-04 (DIGITS tartibi — uzun ibora oldin) dvigatel izohida; qolgan 11 dars shu dvigateldan foydalanadi.
**Ochiq (foydalanuvchi uchun):** daraxt (S25a) haqiqiy repo bilan — foydalanuvchi: «qoldir» · matn/metodika fikrlari — bu raundda yangi topilmadi (faqat buzuq/rasmiy qoidalar tuzatildi).
