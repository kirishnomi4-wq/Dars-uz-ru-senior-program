# Mentor kursi · CI/CD-1 «Lenta: OrderBotNest'ning testlari har push'da o'zi yuradi» — MD v2 (M41: avval mentor o'rganadi)

F-ID: F-1029-02 (CI/CD-1) · **F-1104-20** (qayta yozish) · Sana: 2026-11-04 · Holat: **QURILMOQDA 04.11** (foydalanuvchi 04.11: «to'g'ridan qurib chiqar» — MD tasdig'isiz, saytda ko'riladi) · Fidbek: qator yoniga `>> …`
Oldingi: `14-CICD1-mentor-v1.md` (01.11, avtopilot, o'quvchi reposi `IntroNestArxitechture`, GitHub Actions yurgizilmagan) · **TASHLANADI**
Fayl (qayta quriladi): `src/mentor-kurs/CiCdIntroMentorLesson.jsx` · bo'laklar `src/mentor-kurs/cicd1/parts/` · dvigatel — umumiy `parts/01–02` · generator `dev/cicd1-matn.py` (jest2-matn.py dan, M48 tekshiruvi ichida) · kod va run'lar `dev/cicd1-kod.py` (yml'lar, chiqishlar, GitHub run'lari job/step/log bilan)
Qonun: `MENTOR_DARS_ETALON.md` M1–M48 · Haqiqiy chiqishlar: `manba/cicd1v2-out/` — lokal `00–08` (skript `manba/drive-cicd1v2.sh`, toza muhit), **GitHub Actions run'lari `10–21`** (skript `manba/drive-cicd1v2-actions.sh`, `…-ai.sh`; ro'yxat `runlar.tsv`) · yml variantlari `manba/cicd1v2-yml/` · AI tajribasi `manba/cicd1v2-ai/`
Loyiha: **OrderBotNest** — teglar `cicd1-start` (= `jest2-done` e15a44c) · `cicd1-done` (+ `.github/workflows/ci.yml`) — teglar push qilingan (ruxsat 04.11); sinov run'lari `ci-sinov` tarmog'ida (main toza)

**v1 → v2 nima o'zgardi (F-1104-20):**
- Misol — **OrderBotNest** (Jest-2 dan davom): mentor 25 testni yozgan, endi ularni lentaga topshiradi. O'quvchi reposi va `orderTotal` — faqat 23-ekran.
- Dars boshida **umumiy tushuncha** (foydalanuvchi 04.11): CI/CD nima qiladi, nega kerak, lenta nima — keyin darsga kirish.
- **Haqiqiy GitHub Actions run'lari** (v1 da yo'q edi): yashil run, test qizil, checkout yo'q, lock sinxron emas, `tsc`siz yolg'on yashil, YAML xatolari, AI yozgan workflow'lar — har biri `Azizbekcrypto/OrderBotNest` da haqiqiy run, job va qadam vaqtlari bilan.
- Haqiqiy topilma: **lokalda yashil, lentada qizil** — runner'dagi Node 22 (npm 10) lock faylni o'qiy olmadi (`Missing: webpack@5.112.2 from lock file`), mashinadagi Node 24 (npm 11) o'tkazadi (`10a`, `03d`) → `node-version` mashinadagi bilan bir xil.
- AI tajribasi: ikki AI bitta oddiy promptga workflow yozdi — ikkalasi `node-version: 22`, ikkalasida `tsc` va `build` yo'q → lentada qizil (`19`, `20`); faqat versiya tuzatilsa yashil (`21`), lekin tur xatosi o'tib ketadi.
- M46 (ovoz papka · fayl · satrni aytadi), M47 (xato ekranida sabab bir gapda, ichida — yonma-yon), M48 (variant uzunligi) — boshidan.

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | Jest-1 va Jest-2 ni o'tgan mentor: OrderBotNest'da 25 test yozgan, `npm test` natijasini o'qiydi, buzib tekshiradi. GitHub'da o'z reposi bor (push qila oladi). GitHub Actions bilan ishlamagan. |
| Dars oxirida mentor | 1) CI nima qiladi va nega kerakligini o'z so'zi bilan aytadi («menda ishlaydi» muammosi) · 2) lenta = toza mashina + sizning buyruqlaringiz + chiqish kodi; qizil qadamdan keyin qolgani yurmaydi · 3) OrderBotNest'ni toza clone'da qo'lda «lentadan o'tkazadi» · 4) `ci.yml`ning uch qismini (`on`, `runs-on`, `steps`) o'qiydi va yozadi, `checkout` va `setup-node` nega kerakligini biladi · 5) GitHub Actions'da run'ni ochib, qaysi qadam qizil, qaysi yurmaganini ko'radi · 6) to'rt tuzoqni taniydi: checkout yo'q · lock sinxron emas (`npm ci` vs `npm install`) · `tsc` qadamisiz yolg'on yashil · YAML xatosi · 7) «lokalda yashil, lentada qizil» bo'lsa, avval Node versiyasini solishtiradi · 8) AI yozgan workflow'ni to'rt savol bilan qabul qiladi · 9) CI va CD farqini, `.env` siz `dist/main` nega yiqilishini biladi · 10) sinfga: m4c-01 xaritasi |
| O'quvchi darsi (faqat 6-bosqich) | **m4c-01** «CI/CD nima va nega kerak» (`src/4c-Modull/CiCdIntroLesson.jsx`, `SCREEN_META` 20): aeroport lentasi — chamadon (kod) → 📦 Yig'ish (`npm install`) → 🔍 Skaner (`npm test`) → 📐 O'lcham ramkasi (`eslint .`) → 🎁 O'rash (`npm run build`) → ✈️ Uchirish (deploy); `on: push` = start signali; s13 `ci.yml` bo'shliqlari; amaliyot — o'z reposiga `ci.yml`. |
| Kursdagi o'rni | Jest-2 → **shu** → GitHub Actions: run, log va namunalar (M31: raqam yozilmaydi). |
| Til | M9 + M32. Atamalar inglizcha: CI, CD, pipeline (lenta), workflow, runner (lenta mashinasi), step (qadam), exit code (chiqish kodi), checkout, lock file. «Lenta» — o'quvchi darsidagi so'z, mentor darsida ham shu. Ovozda `ci.yml` — «si ay ye em el», `npm ci` — «npm si ay». |
| Misol-ip | **OrderBotNest** `jest2-done`: 25 test, `tsc` toza, `nest build` ishlaydi. Lenta: `npm ci` → `npx tsc --noEmit` → `npm test` → `npm run build`. Buzishlar: `order.service.ts` 36-satr `<` → `<=` (Jest-2 dagi chegara testi qizaradi) · `user.service.ts` 16-satr `telegram_id = from.id` (tur xatosi `tsc`da 20-satr, test yashil) · `package.json` `telegraf` `4.16.0` (lock `4.16.3`). |
| AI | 2 tajriba (ruxsat 04.11, har darsda): bitta oddiy prompt (`cicd1v2-ai/p1-prompt.txt`: «Bu NestJS loyihasi uchun GitHub Actions workflow yozib ber: har push'da testlar yursin.»), `ai1` kuchli, `ai2` kuchsizroq model; ikkala yml haqiqiy lentada sinaldi (`19`, `20`, `21`). Ekranda «namuna — sizning AI'ingiz boshqacha yozadi». |
| Haqiqiylik (M10) | 04.11: lokal — Node 24.18 · npm 11.16 · toza clone, `env -i … CI=true` (`00`); runner — `ubuntu-latest` (Ubuntu 24.04), `actions/checkout@v4`, `actions/setup-node@v4` (Node 24 → npm 11; Node 22.23 → npm 10.9, `10a`) · GitHub Actions run'lari 04.11 17:40–18:3x (`runlar.tsv`), har run job/step/annotatsiya/log API'dan (`1N-*.txt`) · YAML — GitHub'ning rasmiy tahlilchisi `@actions/workflow-parser` 0.3.61 (`08`). |
| Hajm | **25 ekran** · 6 bosqich · 3 amaliyot · 4 tekshiruv · 8 savol · ovoz ≈ 25 daq · amaliyot ≈ 50–65 daq · jami ≈ 1 s 15 – 1 s 30 daq |
| Me'yor | Jest-2 v2 bilan bir xil (≤ 5 segment, ≤ 60 so'z, M17 ko'prik, «Xulosa», kalit 8–14 so'z, M32, M33, M42, M43, M46, M47, M48) |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **CI (Continuous Integration)** — har push'dan keyin kod toza mashinada avtomatik tekshiriladi: o'rnatish, turlar, test, build. «Menda ishlaydi» o'rniga «toza mashinada ishlaydi». Jamoada hammaning kodi bir xil sharoitda sinaladi.
- **CD (Continuous Delivery / Deployment)** — tekshirilgan yukni chiqarish. **Delivery** — chiqarishga tayyor paket, odam tasdiqlaydi; **Deployment** — lenta o'zi chiqaradi. OrderBotNest'da bu `node dist/main` + `.env` (baza, token) — bugun chegaragacha.
- **lenta (pipeline)** — buyruqlar ketma-ketligi: `npm ci` → `npx tsc --noEmit` → `npm test` → `npm run build`. Har qadam chiqish kodi qaytaradi: 0 — yashil, boshqasi — qizil. Qizil qadamdan keyin qolgani yurmaydi (`&&`; GitHub'da «skipped»).
- **lenta mashinasi (runner)** — GitHub'dagi toza kompyuter: har run'da bo'sh papka, `node_modules` yo'q, `.env` yo'q. Shuning uchun `checkout` (kodni olib kelish) va `setup-node` (Node o'rnatish) qadamlari kerak.
- **`ci.yml`** — `.github/workflows/` dagi fayl, uch qism: `on` (qachon: `push`, `pull_request`) · `runs-on` (qaysi mashina: `ubuntu-latest`) · `steps` (qaysi buyruqlar, tartib bilan). `uses:` — tayyor qadam (`actions/checkout@v4`), `run:` — sizning buyrug'ingiz.
- **`npm ci` va `npm install`** — `ci` lock fayldan aynan o'rnatadi, `package.json` va lock mos kelmasa — yiqiladi («in sync»); `install` lock'ni o'zgartirib qo'yadi. Lentada — `npm ci`.
- **`tsc` qadami** — `ts-jest` tur xatosini o'tkazib yuboradi: test yashil, kod esa kompilyatsiya bo'lmaydi. `npx tsc --noEmit` lentada test'dan oldin.
- **Node versiyasi** — runner'dagi Node mashinadagidan boshqa bo'lsa, npm ham boshqa: lock faylni boshqacha o'qiydi. `node-version` — `node --version` ko'rsatgan raqam.
- **AI workflow'ni qabul qilish** — to'rt savol: `checkout` bormi · `node-version` meniki bilan bir xilmi · `npm ci`mi · `tsc` va `build` qadamlari bormi. Keyin push — run yashilmi.

**Darsning ipi:** CI/CD nima qiladi va nega → lenta: to'rt qadam, chiqish kodi, qizilda to'xtaydi → OrderBotNest'ni toza clone'da qo'lda lentadan o'tkazamiz → `ci.yml` va GitHub Actions: yashil run, test qizil run → to'rt tuzoq (checkout, lock, `tsc`, YAML) → lokalda yashil, lentada qizil: Node versiyasi → AI workflow'lari lentada → CD chegarasi → sinfga tayyorgarlik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | CI/CD nima qiladi: «menda ishlaydi»dan «toza mashinada ishlaydi»ga | Lesson | 1 · umumiy tushuncha |
| 3 | Lenta: to'rt qadam, chiqish kodi, qizilda to'xtaydi | Lesson | 1 |
| 4 | Toza clone: OrderBotNest'ni qo'lda lentadan o'tkazamiz | Lesson | 2 · lenta qo'lda |
| 5 | Tekshiruv 1 — `jest: not found` | MCRetry | 2 |
| 6 | Test qizil — zanjir shu yerda to'xtaydi | Lesson | 2 · buzamiz |
| 7 | Amaliyot 1 — lentani qo'lda yurgizish | Practice | 2 |
| 8 | `ci.yml`: uch qism — `on`, `runs-on`, `steps` | Lesson | 3 · GitHub Actions |
| 9 | Push → Actions: yashil run, qadamlar va vaqt | Lesson | 3 |
| 10 | Buzamiz: test qizil — lentada qaysi qadam, qaysi yurmadi | Lesson | 3 · buzamiz |
| 11 | Tekshiruv 2 — qizil qadamdan keyin | MCRetry | 3 |
| 12 | Amaliyot 2 — `ci.yml` o'z reposingizda, yashil run | Practice | 3 |
| 13 | Checkout yo'q — mashinada repo yo'q | Lesson | 4 · to'rt tuzoq |
| 14 | `npm ci` va lock: «in sync» xatosi | Lesson | 4 |
| 15 | `tsc` qadami: test yashil, lenta yolg'on yashil | Lesson | 4 · ichida |
| 16 | Tekshiruv 3 — YAML: qaysi satr lentani yiqitadi | LineCheck | 4 |
| 17 | Lokalda yashil, lentada qizil: Node versiyasi | Lesson | 5 · mashina farqi va AI |
| 18 | AI workflow yozdi — ikki to'plam | Lesson | 5 · AI |
| 19 | AI workflow'lari lentada: qizil → versiya → yashil, lekin… | Lesson | 5 · ichida |
| 20 | Tekshiruv 4 — AI workflow'ni qabul qilish | MCRetry | 5 |
| 21 | Amaliyot 3 — AI workflow, to'rt tekshiruv, buzib ko'rish | Practice | 5 |
| 22 | CD: Delivery, Deployment va `.env` chegarasi | Lesson | 6 · CD va sinf |
| 23 | Sinfga tayyorgarlik: m4c-01 xaritasi va xato qiladigan joylar | Lesson | 6 · sinfga tayyorgarlik |
| 24 | O'z-sinov — 8 savol | Screen27 | — |
| 25 | Yakun | Screen28 | — |

**Sahna turlari:** VS Code `OrderBotNest` (Explorer `compact()`: `.github/workflows/ci.yml`, `src/api/order/order.service.ts`, `src/api/user/user.service.ts`, `package.json`, `package-lock.json`), terminal «VS Code terminali · OrderBotNest» (`$` qatori bilan), **lenta chizig'i** (to'rt qadam: holat ✓ / ✗ / yurmadi), **GitHub Actions run oynasi** (haqiqiy run: job → qadamlar, holat, soniya, annotatsiya, log satrlari — `ActionsRun`, CI/CD-2 dan), **ikki mashina kartasi** (sizniki ↔ runner), AI javobi kartasi, sabab kartasi.

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · CI/CD` · Sarlavha: **Jest-2 da 25 test yozdingiz — bugun ular har push'da GitHub'ning o'zida yuradi, siz esa faqat yashil-qizilni ko'rasiz**
- Sahna: chapda reja (6 bosqich); o'ngda GitHub Actions run oynasi — dars oxiridagi natija (run `18`, `main`, `cicd1-done`): job `test` ✓, qadamlar `checkout` · `setup-node` · `npm ci` · `npx tsc --noEmit` · `npm test` · `npm run build` — hammasi ✓, har biri soniyasi bilan.
- Reja: 01 Umumiy tushuncha · 02 Lenta qo'lda · 03 GitHub Actions · 04 To'rt tuzoq · 05 Mashina farqi va AI · 06 CD va sinfga tayyorgarlik
1. **Jest-2 da testlar yozildi — bugun ular ==har push'da GitHub'ning o'zida== yuradi**
   Ovoz: «Assalomu alaykum. Jest ikkinchi darsida OrderBotNest'ga yigirma beshta test yozdingiz. Hozir ular faqat siz npm test desangiz yuradi. Bugun ularni lentaga topshiramiz: har push'da GitHub'ning o'zida yuradi. Ekranda dars oxiridagi natija: oltita qadam, hammasi yashil.»
2. **Avval ==umumiy tushuncha==: CI/CD nima qiladi, lenta nima, nega kerak**
   Ovoz: «Avval umumiy tushunchani olamiz: CI/CD nima qiladi va nega kerak. Keyin lentani o'z kompyuteringizda qo'lda yurgizasiz, shundan keyin GitHub'ga topshirasiz. Lenta qayerda yiqilishini to'rt tuzoqda ko'rasiz.» · reja 01–04
3. **Haqiqiy topilma: ==lokalda yashil, lentada qizil== — va AI yozgan workflow'lar**
   Ovoz: «Beshinchi bosqichda haqiqiy topilma: lokalda hammasi yashil edi, lentada qizil chiqdi. Sababini birga topamiz. Keyin ikki AI yozgan workflow'ni lentada sinaymiz. Oxirida CD nima va sinfga tayyorgarlik.» · reja 05–06
4. **Olti bosqich, uchta amaliyot; kerak: ==GitHub'da o'z reposingiz==**
   Ovoz: «Dars olti bosqich, uchta amaliyot. Amaliyotlar uchun GitHub'da o'z reposingiz kerak: OrderBotNest nusxangizni push qila olishingiz kifoya. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz.» · reja 06
- Manba: `cicd1v2-out/18-main-yashil.txt` (run, job, qadamlar).

## 2 · CI/CD nima qiladi: «menda ishlaydi»dan «toza mashinada ishlaydi»ga  ← `Lesson`
- Kicker: `1-bosqich · umumiy tushuncha` · Sarlavha: **CI — har push'da toza mashinada sizning buyruqlaringiz yuradi; CD — tekshirilgan yukni chiqarish. Ikkalasi bitta narsani hal qiladi: «menda ishlaydi»**
- Sahna: ikki karta galma-gal: «Hozir» — siz: `npm test` (yashil) → push → hamkor clone qiladi → unda qizil («menda ishlaydi!»): sabab — `node_modules` boshqa, Node boshqa, `.env` boshqa · «Lenta bilan» — push → GitHub'dagi toza mashina: `npm ci` · `tsc` · `test` · `build` → yashil/qizil → hammaga bir xil javob; 3-segmentda CI ↔ CD ikki yarim: «CI — tekshirish» · «CD — chiqarish (Delivery: odam tasdiqlaydi · Deployment: o'zi)»; 4-segmentda «bugun» chizig'i: CI to'liq, CD — chegaragacha.
1. **Muammo: ==«menda ishlaydi»== — hamkorda qizil, chunki uning mashinasi boshqa**
   Ovoz: «Tanish holat: sizda npm test yashil, push qildingiz, hamkor clone qildi, unda qizil. Menda ishlaydi, deysiz. Ikkalangiz ham haqsiz: uning node modules papkasi boshqa, Node versiyasi boshqa, env fayli boshqa. Kod bir xil, mashina boshqa.» · 1-karta
2. **CI: har push'da ==toza mashinada sizning buyruqlaringiz== yuradi — hammaga bir xil javob**
   Ovoz: «CI shuni hal qiladi. Continuous Integration: har push'dan keyin GitHub'dagi toza mashina kodni olib, aynan sizning buyruqlaringizni yurgizadi: o'rnatish, turlar, test, build. Mashina hamma uchun bir xil, javob ham bir xil: yashil yoki qizil. Menda ishlaydi, degan bahs yo'q.» · 2-karta
3. **CD: ==tekshirilgan yukni chiqarish== — Delivery odam tasdiqlaydi, Deployment o'zi chiqaradi**
   Ovoz: «CD ikkinchi yarmi: tekshirilgan yukni chiqarish. Continuous Delivery: paket tayyor, odam tugmani bosadi. Continuous Deployment: lenta o'zi chiqaradi, odam yo'q. Ikkalasi ham CI'dan keyin, chunki qizil yukni hech kim chiqarmaydi.» · CI ↔ CD
4. **Xulosa: bugun ==CI to'liq, CD chegaragacha== — OrderBotNest'ning lentasi har push'da yashil yoki qizil**
   Ovoz: «Xulosa: CI, har push'da toza mashinada tekshirish. CD, tekshirilgan yukni chiqarish. Bugun CI'ni oxirigacha qilamiz: OrderBotNest'ning lentasi har push'da yashil yoki qizil deydi. CD'ni chegarasigacha ko'ramiz: bot bazasiz va tokensiz chiqmaydi. Endi lentaning o'zi nima.» · chiziq
- Manba: tushunchalar A-bo'lim; «menda ishlaydi» — Jest-1 dagi `som()` U+00A0 topilmasi (mashinaga bog'liq xulq).

## 3 · Lenta: to'rt qadam, chiqish kodi, qizilda to'xtaydi  ← `Lesson`
- Kicker: `1-bosqich · umumiy tushuncha` · Sarlavha: **Lenta — buyruqlar ketma-ketligi: har biri chiqish kodi qaytaradi, 0 — yashil, boshqasi — qizil; qizildan keyin qolgani yurmaydi**
- Sahna: lenta chizig'i to'rt qadam (`npm ci` · `npx tsc --noEmit` · `npm test` · `npm run build`), galma-gal yonadi; 2-segmentda har qadam ostida «nima tekshiradi» qatori; 3-segmentda chiqish kodi kartasi: `0` yashil · `1`, `2`, `127` qizil; 4-segmentda uchinchi qadam ✗ → to'rtinchisi «yurmadi» (xira).
1. **To'rt qadam: ==`npm ci` → `tsc` → `npm test` → `npm run build`== — har biri bitta terminal buyrug'i**
   Ovoz: «Lenta sirli narsa emas: bu siz terminalda yozadigan buyruqlar ketma-ketligi. OrderBotNest uchun to'rtta: npm si ay, paketlarni o'rnatadi. npx tsc, turlarni tekshiradi. npm test. npm run build, dist papkasini yig'adi. Lenta shu to'rttasini tartib bilan yurgizadi.» · lenta
2. **Har qadam ==bitta savolga javob beradi==: o'rnatildimi, turlar to'g'rimi, test yashilmi, yig'ildimi**
   Ovoz: «Har qadam bitta savolga javob beradi. Paketlar o'rnatildimi. Turlar to'g'rimi. Testlar yashilmi. Build yig'ildimi. To'rt savol, to'rt javob. Hozircha eslint qadami yo'q: OrderBotNest'da lint sozlanmagan, lentaga faqat ishlaydigan buyruq qo'yiladi.» · savollar
3. **Chiqish kodi: ==0 — yashil, boshqasi — qizil==; `tsc` 2 beradi, `jest: not found` 127 beradi**
   Ovoz: «Har buyruq tugaganda son qaytaradi, bu chiqish kodi. Nol, hammasi yaxshi, yashil. Boshqa son, qizil. Jest qizil testda bir beradi, tsc tur xatosida ikki, buyruq topilmasa yuz yigirma yetti. Lenta sonning o'zini bilmaydi, faqat nolmi yoki yo'qmi, shuni qaraydi.» · chiqish kodi
4. **Xulosa: ==qizil qadamdan keyin qolgani yurmaydi== — test qizil bo'lsa, build boshlanmaydi**
   Ovoz: «Xulosa: lenta to'rt buyruq, har biri chiqish kodi bilan. Birinchi qizil qadamda lenta to'xtaydi, qolgani yurmaydi: test qizil bo'lsa build boshlanmaydi, buzuq kod hech qachon yig'ilmaydi. Endi shu lentani o'z kompyuteringizda, toza papkada qo'lda yurgizamiz.» · ✗ → yurmadi
- Manba: `cicd1v2-out/01`, `06` (`tsc` kodi 2), `04` (127), `02` (`&&` to'xtaydi).

---

## 4 · Toza clone: OrderBotNest'ni qo'lda lentadan o'tkazamiz  ← `Lesson`
- Kicker: `2-bosqich · lenta qo'lda` · Sarlavha: **Lenta mashinasi har safar bo'sh papkadan boshlaydi — biz ham: yangi clone, `node_modules` yo'q, to'rt buyruq ketma-ket, har biri chiqish kodi bilan**
- Sahna: terminal `01` galma-gal: `$ ls` (7 ta: `nest-cli.json` · `package.json` · `package-lock.json` · `README.md` · `scripts` · `src` · `tsconfig.json` — `node_modules` yo'q) → `$ npm ci` `added 633 packages in 5s` `[chiqish kodi: 0 · 5.7 s]` → `$ npx tsc --noEmit` `[0 · 2.6 s]` → `$ npm test` `Tests: 25 passed, 25 total` `[0 · 2.2 s]` → `$ npm run build` `[0 · 3.5 s]` · `$ ls dist`; 4-segmentda lenta chizig'i to'rt qadam ✓ + vaqtlar.
1. **Yangi papkaga clone: ==`node_modules` yo'q== — lenta mashinasi ham shunday boshlaydi**
   Ovoz: «OrderBotNest'ni yangi papkaga clone qiling: git clone, keyin jest ikki done tegiga o'ting. VS Code'da oching, terminalda ls. Yetti narsa: package json, lock, src va hokazo. Node modules yo'q, env yo'q. Lenta mashinasi har safar aynan shunday bo'sh papkadan boshlaydi.» · `ls`
2. **`npm ci`: ==633 paket, 6 soniya== — lock fayldan aynan; keyin `tsc` — 3 soniya, chiqish kodi 0**
   Ovoz: «Birinchi buyruq npm si ay: lock fayldagi versiyalarni aynan o'rnatadi, olti yuz o'ttiz uchta paket, olti soniya, chiqish kodi nol. Ikkinchisi npx tsc no emit: turlarni tekshiradi, fayl yozmaydi. Uch soniya, chiqish kodi nol: xato yo'q.» · `npm ci`, `tsc`
3. **`npm test`: ==25 test yashil, 2 soniya==; `npm run build`: `dist` papkasi, 4 soniya**
   Ovoz: «Uchinchisi npm test: beshta fayl, yigirma beshta test, hammasi yashil, ikki soniya. To'rtinchisi npm run build: nest build dist papkasini yig'adi, to'rt soniya. Ls dist: main js va boshqa fayllar. To'rtala qadam nol bilan tugadi.» · `test`, `build`
4. **Xulosa: ==to'rt buyruq, 15 soniya, to'rt nol== — bu lenta; GitHub'da aynan shu yuradi**
   Ovoz: «Xulosa: to'rt buyruq, jami o'n besh soniya, to'rtala chiqish kodi nol, lenta yashil. Siz hozir qo'lda qilgan ishni GitHub'dagi mashina har push'da o'zi qiladi, aynan shu buyruqlar bilan. Lekin avval bitta narsani tekshirib olaylik.» · lenta ✓
- Manba: `cicd1v2-out/01-lenta-yashil.txt`, `07-qadam-vaqtlari.txt`.

## 5 · Tekshiruv 1 — `jest: not found`  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Toza clone'da to'g'ridan `npm test` yozdik. Terminal: `sh: 1: jest: not found`, chiqish kodi 127. Sabab nima?**
- Material (`above`, M42): terminal `04`: `$ npm test` · `> jest` · `sh: 1: jest: not found` · `[chiqish kodi: 127 · 0.2 s]`; ostida `ls` natijasi (`node_modules` yo'q).
- Ovoz: «Lentani ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Toza clone'da npm si ay'ni o'tkazib yuborib, to'g'ridan npm test yozdik. Terminal: jest not found, chiqish kodi yuz yigirma yetti. Sabab nima? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 Jest `package.json`da umuman yo'q — avval ro'yxatga qo'shish kerak · 2 `node_modules` yo'q — `npm ci` qadami tushib qolgan · 3 Node versiyasi eski — Jest ishlamaydi · 4 Test fayllari yo'q — Jest «not found» deydi
- To'g'ri (ovoz): «To'g'ri. Jest package json'da bor, lekin o'rnatilmagan: node modules papkasi yo'q, chunki npm si ay yurmadi. Lentada bu eng ko'p uchraydigan xato: o'rnatish qadami tushib qolgan yoki tartibi noto'g'ri. Demak, lentada birinchi qadam doim o'rnatish, qolgani undan keyin.» · qisqa: «`node_modules` yo'q — `npm ci` yurmagan. Lentada birinchi qadam doim o'rnatish.»
- Isbot (`after`): terminal `01` dan: `$ npm ci` · `added 633 packages in 5s` · `[chiqish kodi: 0 · 5.7 s]`.
- Demak: «Lentada birinchi qadam — o'rnatish (`npm ci`); toza mashinada `node_modules` yo'q.»
- Xato izohlari: 1 — «`package.json` da `jest` bor (devDependencies); muammo o'rnatishda, ro'yxatda emas.» · 3 — «Node 24 — yangi; `not found` versiya emas, fayl yo'qligi.» · 4 — «Test fayli yo'q bo'lsa Jest `No tests found` deydi; bu yerda Jest'ning o'zi topilmadi.»
- Maslahat: «`ls` da `node_modules` bormi? `jest` buyrug'i qayerdan keladi?»
- Manba: `cicd1v2-out/04-npm-ci-yoq.txt`, `01`.

## 6 · Test qizil — zanjir shu yerda to'xtaydi  ← `Lesson`
- Kicker: `2-bosqich · buzamiz` · Sarlavha: **Kodni buzamiz va to'rt buyruqni `&&` bilan bog'laymiz: `npm ci` ✓, `tsc` ✓, test qizil — `build` boshlanmaydi, chiqish kodi 1**
- Sahna: VS Code — `order.service.ts` 36-satr `if (p.stock < c.qty) {` → `if (p.stock <= c.qty) {` (M36); terminal `02`: `$ npm ci && npx tsc --noEmit && npm test && npm run build` · `npm ci ✓` · `tsc ✓` · `FAIL src/api/order/order.service.spec.ts` · `● OrderService.place › chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi` · `Kolonka: omborda faqat 2 ta qoldi` · `> 37 |` · `Tests: 1 failed, 24 passed, 25 total` · `[chiqish kodi: 1]` — `build` satri yo'q; 4-segmentda lenta chizig'i: ✓ ✓ ✗ «yurmadi».
- F-1120-02 (M52): 0-band — mentor 36-satrdagi `<` ni o'zi bosadi → `<=`. Kod ostida kichik rasm (M51): `npm ci && tsc` ✓ → `npm test` «?» → ✕ → `npm run build` boshlanmadi; bo'laklar 1 (test FAIL) · 2 (build yo'q, chiqish kodi 1).
0. **Endi ==o'zingiz buzasiz==: kodda yonib turgan `<` ustiga bosing**
   Ovoz: «Lentaning to'rt buyrug'ini bilasiz. Endi ataylab buzamiz. Buzishni o'zingiz qilasiz: src, api, order papkasidagi order service ts faylining o'ttiz oltinchi satrida kichik belgisi yonib turibdi, ustiga bosing: u kichik yoki tengga aylanadi.»
   Bosish: «**order.service.ts** 36-satridagi **`<`** ustiga bosing — `<=` bo'ladi.»
1. **Buzildi: `order.service.ts` 36-satr ==`<` → `<=`== — Jest-2 dagi chegara testi buni ushlaydi**
   Ovoz: «Kichik endi kichik yoki teng. Jest ikkinchi darsidan eslaysiz: aynan ikkita qolganda ikkitasini sotib bo'lmaydi, chegara testi buni ushlaydi.» · 36-satr
2. **To'rt buyruq ==`&&` bilan bitta qatorda==: oldingisi nol bersa, keyingisi yuradi**
   Ovoz: «Bu safar to'rt buyruqni bitta qatorda yozamiz, oralarida ikki ampersand. Ma'nosi: oldingisi nol bersa, keyingisi yuradi, nol bermasa, to'xtaydi. Terminalda: npm si ay, ampersand, npx tsc, ampersand, npm test, ampersand, npm run build.» · `&&`
3. **Natija: ==`npm ci` ✓, `tsc` ✓, test FAIL — `build` satri umuman yo'q==, chiqish kodi 1**
   Ovoz: «Natijaga qarang. Npm si ay yashil, tsc yashil. Npm test: FAIL, chegara testi, Kolonka, omborda faqat ikkita qoldi, o'ttiz yettinchi satr. Va pastda build satri umuman yo'q: nest build boshlanmadi. Butun qatorning chiqish kodi bir.» · terminal
4. **Xulosa: ==zanjir birinchi qizilda uziladi== — GitHub lentasi ham aynan shunday, faqat «yurmadi» deb yozadi**
   Ovoz: «Xulosa: zanjir birinchi qizil qadamda uziladi, buzuq kod yig'ilmaydi. GitHub lentasi aynan shunday ishlaydi, faqat yurmagan qadamni skipped, ya'ni yurmadi deb ko'rsatadi. Satrni tiklang: git checkout, order service ts. Endi lentani o'zingiz qo'lda yurgizasiz.» · lenta ✗
- Rasm (F-1120-02, M51, 21.11): xulosada matnli qoida o'rniga darsning rasmi — Actions qatori npm ci ✓ · tsc ✓ · npm test ✕ · build (yurmadi), «chiqish kodi 1»; ostida `order.service.ts:36` `p.stock <= c.qty` · tiklash `git checkout -- src/api/order/order.service.ts` (cicd1v2-out/02).
- Manba: `cicd1v2-out/02-test-qizil-lenta-toxtadi.txt` (aynan); `order.service.ts` 36 (`jest2-done`).

## 7 · Amaliyot 1 — lentani qo'lda yurgizish  ← `Practice`
- Kicker: `Amaliyot 1 / 3` · Eyebrow: `Hozir o'zingizda · 12 daqiqa` · Sarlavha: **Toza clone'da to'rt buyruqni `&&` bilan yurgiting, keyin kodni buzib zanjir uzilishini ko'ring** · `tableAt: 3`
1. **Endi siz: ==yangi papkaga clone, `jest2-done` tegi==, to'rt buyruq zanjiri**
   Ovoz: «Endi navbat sizga. OrderBotNest'ni yangi papkaga clone qilasiz, jest ikki done tegiga o'tasiz, to'rt buyruqni ampersand bilan yurgizasiz. Baza va token kerak emas. O'n ikki daqiqa ketadi.»
2. **1–2-qadam: ==clone va zanjir== — to'rtala qadam nol, `dist` papkasi paydo bo'ladi**
   Ovoz: «Birinchi qadamda git clone va git checkout jest ikki done. Ikkinchisida to'rt buyruq zanjiri: npm si ay, tsc, test, build. Oxirida dist papkasi paydo bo'lishi kerak, tests satri yigirma besh passed.»
3. **3–4-qadam: ==36-satrni buzib== zanjirni yurgizing — `build` yurmaydi; tiklang; isbot — `Tests:` satri**
   Ovoz: «Uchinchi qadamda order service ts'ning o'ttiz oltinchi satrida kichikni kichik yoki tengga buzib, zanjirni qayta yurgizasiz: test qizil, build yurmaydi. To'rtinchisida git checkout bilan tiklaysiz. Isbot maydoniga uchinchi qadamdagi tests satrini nusxalang.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz lentani qo'lda yurgizgan va qizilda uzilishini ko'rgan bo'lasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Toza clone | `git clone https://github.com/Azizbekcrypto/OrderBotNest.git lenta` · `cd lenta` · `git checkout jest2-done` · `ls` | `node_modules` yo'q |
  | 2 | Zanjir | `npm ci && npx tsc --noEmit && npm test && npm run build` · `ls dist` | `Tests: 25 passed, 25 total` · `dist/main.js` |
  | 3 | Buzish | `src/api/order/order.service.ts` 36-satr `<` → `<=` · zanjirni qayta yurgizing | `Tests: 1 failed, 24 passed, 25 total` · `build` yurmadi |
  | 4 | Tiklash | `git checkout -- src/api/order/order.service.ts` · zanjir | `Tests: 25 passed, 25 total` |
- Isbot: «3-qadamdagi `Tests:` satri» · placeholder: «masalan: Tests: 1 failed, 24 passed, 25 total» · KOD: `/Tests:\s+1 failed,\s+24 passed/` · xato: «Buzilgan kodda bitta test qizil bo'lishi kerak — 3-qadamdagi `Tests:` qatorini qo'ying.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `error: pathspec 'jest2-done' did not match` | teglar olinmagan — `git fetch --tags`, keyin checkout |
  | `sh: 1: jest: not found` | `npm ci` yurmagan yoki zanjirda yo'q — birinchi buyruq `npm ci` |
  | 3-qadamda hammasi `✓` | 36-satr o'zgarmagan yoki boshqa satr — `if (p.stock <= c.qty)` bo'lsin |
  | `build` baribir yurdi | buyruqlar `;` bilan bog'langan — `&&` bo'lsin: `;` qizilda to'xtamaydi |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `cicd1v2-out/01`, `02`, `04`.

---

## 8 · `ci.yml`: uch qism — `on`, `runs-on`, `steps`  ← `Lesson`
- Kicker: `3-bosqich · GitHub Actions` · Sarlavha: **`.github/workflows/ci.yml` — lentaning yo'l xaritasi: qachon (`on`), qaysi mashinada (`runs-on`), qaysi qadamlar (`steps`); `uses` — tayyor qadam, `run` — sizning buyrug'ingiz**
- Sahna: VS Code — yangi fayl `.github/workflows/ci.yml` (`cicd1v2-yml/1-tavsiya.yml`, 15 satr): 1–2 `name: CI` · `on: [push, pull_request]` · 3–5 `jobs:` `test:` `runs-on: ubuntu-latest` · 6–11 `steps:` `- uses: actions/checkout@v4` · `- uses: actions/setup-node@v4` `with:` `node-version: 24` `cache: npm` · 12–15 `- run: npm ci` · `- run: npx tsc --noEmit` · `- run: npm test` · `- run: npm run build`; segmentlar bo'yicha yoritiladi; 4-segmentda o'ngda «sizning to'rt buyrug'ingiz ↔ `run:` satrlari» mosligi.
1. **Fayl ==`.github/workflows/ci.yml`== — GitHub shu papkadagi har faylni lenta deb o'qiydi**
   Ovoz: «OrderBotNest papkangizda, ildizda, nuqta github papkasini, ichida workflows papkasini, ichida ci yml faylini yarating. GitHub shu papkadagi har faylni lenta deb o'qiydi. Birinchi ikki satr: name, lentaning nomi, va on: qachon yursin. Push va pull request.» · 1–2
2. **`jobs` → `test` → ==`runs-on: ubuntu-latest`== — GitHub'dagi toza Ubuntu mashina**
   Ovoz: «Uchinchidan beshinchi satrgacha: jobs, ya'ni ishlar. Bitta ish, nomi test. Runs on, ubuntu latest: GitHub'dagi toza Ubuntu mashina. Har run'da yangi mashina, bo'sh papka, siz to'rtinchi ekranda ko'rgan holat.» · 3–5
3. **`steps`: ==`checkout` kodni olib keladi, `setup-node` Node 24 ni o'rnatadi== — `uses`, tayyor qadamlar**
   Ovoz: «Oltinchidan: steps, qadamlar. Birinchi ikkitasi uses bilan, tayyor qadamlar. Actions checkout: mashinaga reponi olib keladi, usiz papka bo'sh. Setup node: Node yigirma to'rtni o'rnatadi, mashinangizdagi bilan bir xil, va npm keshini yoqadi.» · 6–11
4. **Xulosa: ==to'rt `run:` satri — to'rtinchi ekrandagi to'rt buyruq==, aynan o'sha tartibda**
   Ovoz: «Xulosa: oxirgi to'rt satr run bilan, bular sizning buyruqlaringiz: npm si ay, tsc, test, build, aynan to'rtinchi ekrandagi tartibda. Ci yml uch qism: qachon, qaysi mashinada, qaysi qadamlar. Faylni saqlang, endi push qilamiz.» · 12–15 + moslik
- Manba: `cicd1v2-yml/1-tavsiya.yml` (`cicd1-done`), `08-yaml-tekshiruv.txt` (✓).

## 9 · Push → Actions: yashil run, qadamlar va vaqt  ← `Lesson`
- Kicker: `3-bosqich · GitHub Actions` · Sarlavha: **`git push` — va GitHub'ning Actions bo'limida run paydo bo'ladi: bitta job, oltita qadam, har biri soniyasi bilan, hammasi yashil**
- Sahna: terminal `$ git add .github && git commit -m "ci: lenta" && git push`; keyin GitHub Actions run oynasi (run `10`, `ci-sinov`): job `test` ✓ · qadamlar `Set up job` · `Run actions/checkout@v4` · `Run actions/setup-node@v4` · `Run npm ci` · `Run npx tsc --noEmit` · `Run npm test` · `Run npm run build` · `Complete job` — soniyalar; 3-segmentda `npm test` qadami logi ochiq (`PASS …` · `Tests: 25 passed, 25 total`); 4-segmentda run davomiyligi.
1. **Push qiling — ==GitHub'da Actions bo'limi==: run paydo bo'ldi, sariq nuqta — yuryapti**
   Ovoz: «Terminalda git add, commit, push. Brauzerda reponi oching, yuqorida Actions bo'limi. Yangi run paydo bo'ldi: nomi commit xabaringiz, yonida sariq nuqta, yuryapti. Bir daqiqadan kam kuting.» · terminal → run
2. **Run ichida: ==bitta job `test`, oltita qadam== — `checkout`, `setup-node`, to'rt buyruq, har biri soniyasi bilan**
   Ovoz: «Run'ni oching. Chapda job: test. O'ngda qadamlar: set up job, GitHub'ning o'zi qo'shgan. Keyin checkout, setup node, va to'rt buyrug'ingiz. Har qadam yonida yashil belgi va necha soniya yurgani. Hammasi yashil, run yashil.» · qadamlar
3. **Qadamni bossangiz — ==log, sizning terminalingizdagi matn==: `PASS`, `Tests: 25 passed`**
   Ovoz: «Npm test qadamini bosing: log ochiladi. Bu aynan sizning terminalingizdagi matn: PASS, beshta fayl, yigirma besh passed. Faqat uni siz emas, GitHub'dagi mashina yurgizdi. Shu logni o'qiy olsangiz, lentaning hamma xatosini topa olasiz.» · log
4. **Xulosa: ==push → toza mashina → sizning buyruqlaringiz → yashil==; endi uni qizil qilamiz**
   Ovoz: «Xulosa: push qildingiz, GitHub toza mashina ochdi, kodni olib keldi, Node o'rnatdi, to'rt buyrug'ingizni yurgizdi, yashil dedi. Siz hech narsa qilmadingiz. Endi kodni buzib push qilamiz va lenta qizilni qanday ko'rsatishini ko'ramiz.» · run ✓
- Manba: `cicd1v2-out/10-yashil.txt` (run, job, qadamlar, log — aynan).

## 10 · Buzamiz: test qizil — lentada qaysi qadam, qaysi yurmadi  ← `Lesson`
- Kicker: `3-bosqich · buzamiz` · Sarlavha: **`<=` bilan push: run qizil — `npm test` qadami ✗, `npm run build` «skipped», annotatsiyada `Process completed with exit code 1`**
- Sahna: VS Code `order.service.ts` 36 (`<=`) + terminal `$ git commit -am "sinov: chegara" && git push`; GitHub run oynasi (run `11`): `checkout` ✓ · `setup-node` ✓ · `npm ci` ✓ · `tsc` ✓ · **`npm test` ✗** · `npm run build` ⊘ skipped; annotatsiya: `Process completed with exit code 1.`; 3-segmentda `npm test` logi: `FAIL src/api/order/order.service.spec.ts` · `● OrderService.place › chegara…` · `Kolonka: omborda faqat 2 ta qoldi` · `Tests: 1 failed, 24 passed, 25 total` · `##[error]Process completed with exit code 1.`; 4-segmentda sabab qatori.
- F-1120-02 (M52): 0-band — mentor 36-satrdagi `<` ni yana o'zi bosadi → `<=`, keyin commit va push. Kod ostida kichik rasm (M51): push → GitHub run «?» → `npm test` ✕ → `npm run build` skipped; bo'laklar 1 (npm test ✕) · 2 (build skipped).
0. **Endi ==yana o'zingiz buzasiz==: `<` ustiga bosing — keyin push**
   Ovoz: «Lenta GitHub'da yashil. Endi oltinchi ekrandagi buzishni GitHub'da sinaymiz. Buzishni yana o'zingiz qilasiz: order service ts'ning o'ttiz oltinchi satrida kichik belgisi yonib turibdi, ustiga bosing.»
   Bosish: «**order.service.ts** 36-satridagi **`<`** ustiga bosing — `<=` bo'ladi, keyin commit va push.»
1. **Commit, push — ==run qizil==: ro'yxatda qizil belgi, commit xabari bilan**
   Ovoz: «Kichik yana kichik yoki teng. Commit, push. Actions bo'limida yangi run, bu safar qizil belgi. Run'ni ochamiz.» · push → run ✗
2. **Qadamlar: ==`npm test` ✗, `npm run build` — «skipped»==; annotatsiya: chiqish kodi 1**
   Ovoz: «Qadamlarga qarang: checkout, setup node, npm si ay, tsc, hammasi yashil. Npm test qizil. Npm run build: skipped, yurmadi. Yuqorida annotatsiya: process completed with exit code one. Oltinchi ekrandagi ampersand zanjiri bilan bir xil, faqat GitHub buni ko'rsatib beradi.» · qadamlar
3. **Logda ==o'sha FAIL==: chegara testi, `Kolonka: omborda faqat 2 ta qoldi`, 37-satr**
   Ovoz: «Qizil qadamni bosing: log. O'sha FAIL: order service spec, chegara testi, Kolonka, omborda faqat ikkita qoldi, o'ttiz yettinchi satr. Jest sizga lokalda aytadigan hamma narsa shu yerda. Pastda: process completed with exit code one.» · log
4. **Demak, sabab: ==test chiqish kodi 1 berdi — lenta to'xtadi==, build yurmadi, buzuq kod yig'ilmadi**
   Ovoz: «Demak, sabab bitta joyda: npm test chiqish kodi bir berdi, lenta shu qadamda to'xtadi, build yurmadi. Buzuq kod yig'ilmadi va hech qayerga chiqmadi. Satrni tiklab push qilsangiz, run yana yashil. Endi tekshirib olaylik.» · sabab
- Manba: `cicd1v2-out/11-test-qizil.txt` (run, qadamlar, annotatsiya, log — aynan).

## 11 · Tekshiruv 2 — qizil qadamdan keyin  ← `MCRetry`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4`
- Sarlavha: **Lentada `npx tsc --noEmit` qadami chiqish kodi 2 bilan tugadi. `npm test` va `npm run build` qadamlari nima bo'ladi?**
- Material (`above`): `ci.yml` 12–15 (to'rt `run:` satri); ostida terminal `06` dan: `$ npx tsc --noEmit` · `src/api/user/user.service.ts(20,42): error TS2322…` · `[chiqish kodi: 2 · 2.1 s]`.
- Ovoz: «Qizil run'ni ko'rdingiz, endi tekshirib olaylik. Ikkinchi tekshiruv. Lentada tsc qadami chiqish kodi ikki bilan tugadi: tur xatosi. Undan keyingi npm test va npm run build qadamlari nima bo'ladi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Ikkalasi yuradi — tur xatosi testga ham, build'ga ham xalaqit bermaydi · 2 `npm test` yuradi, `build` yurmaydi — test alohida · 3 Ikkalasi «skipped» — birinchi qizildan keyin to'xtaydi · 4 Ikkalasi yuradi, lekin run baribir qizil
- To'g'ri (ovoz): «To'g'ri. Lenta birinchi qizil qadamda to'xtaydi: tsc ikki berdi, npm test ham, build ham skipped, yurmadi. Chiqish kodi ikkimi, birmi, lenta uchun farqi yo'q: nol emas, demak qizil. Demak, qadam tartibi muhim: arzon va tez tekshiruv oldinda, undan o'tmagan kod testgacha ham bormaydi.» · qisqa: «Birinchi qizil qadam — qolgani «skipped». 2 ham, 1 ham — nol emas.»
- Isbot (`after`): GitHub run `15` qadamlari: `npm ci` ✓ · `npx tsc --noEmit` ✗ · `npm test` ⊘ · `npm run build` ⊘.
- Demak: «Lenta birinchi qizil qadamda to'xtaydi; keyingi qadamlar «skipped». Chiqish kodi nol emas — qizil.»
- Xato izohlari: 1 — «Lenta qadam ketma-ketligi: oldingisi qizil — keyingisi boshlanmaydi.» · 2 — «Qadamlar bir-biriga bog'liq: `tsc` qizil bo'lsa test ham yurmaydi.» · 4 — «Yurmaydi: GitHub ularni «skipped» deb belgilaydi, run qizil.»
- Maslahat: «Oltinchi ekrandagi `&&` zanjirini eslang: qizildan keyin nima bo'ldi?»
- Manba: `cicd1v2-out/06-tsc-qizil.txt`, `15-tsc-bor-qizil.txt`.

## 12 · Amaliyot 2 — `ci.yml` o'z reposingizda, yashil run  ← `Practice`
- Kicker: `Amaliyot 2 / 3` · Eyebrow: `Hozir o'zingizda · 20 daqiqa` · Sarlavha: **OrderBotNest nusxangizni GitHub'ga chiqaring, `ci.yml` yozing, push — Actions'da yashil run; keyin buzib qizilni ko'ring** · `tableAt: 3`
1. **Endi siz: ==o'z GitHub reposingiz== — OrderBotNest nusxasi, `ci.yml`, push**
   Ovoz: «Endi navbat sizga. GitHub'da o'zingizga yangi repo ochasiz, OrderBotNest nusxangizni unga push qilasiz, ci yml yozasiz va Actions'da yashil run'ni ko'rasiz. Yigirma daqiqa ketadi.»
2. **1–2-qadam: ==repo va push==, keyin `.github/workflows/ci.yml` — sakkizinchi ekrandagi 15 satr**
   Ovoz: «Birinchi qadamda GitHub'da bo'sh repo ochib, git remote bilan ulaysiz va push qilasiz. Ikkinchisida nuqta github, workflows, ci yml faylini sakkizinchi ekrandagi o'n besh satr bilan yozasiz, push. Actions'da run yashil bo'lishi kerak.»
3. **3–4-qadam: ==36-satrni buzib push== — run qizil, `build` skipped; tiklab push — yashil; isbot — run manzili**
   Ovoz: «Uchinchi qadamda o'ttiz oltinchi satrni buzib push qilasiz: run qizil, npm test qadami qizil, build skipped. To'rtinchisida tiklab push: yashil. Isbot maydoniga yashil run'ning manzilini, brauzer qatoridan, nusxalang.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizning reponingizda har push'da lenta yuradi, va siz uni bir marta qizil, bir marta yashil ko'rgansiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | O'z repo | GitHub → New repository (bo'sh, README'siz) · `git remote add mine https://github.com/<siz>/OrderBotNest.git` · `git push mine jest2-done:main` | GitHub'da kod ko'rinadi |
  | 2 | `ci.yml` | `.github/workflows/ci.yml` — 8-ekrandagi 15 satr (`node-version` — `node --version` raqamingiz) · `git add .github && git commit -m "ci: lenta" && git push mine HEAD:main` | Actions: run ✓ (6 qadam yashil) |
  | 3 | Buzib push | `order.service.ts` 36 `<` → `<=` · `git commit -am "sinov: chegara" && git push mine HEAD:main` | run ✗: `npm test` ✗ · `npm run build` skipped |
  | 4 | Tiklab push | `git checkout -- src/api/order/order.service.ts` · `git commit -am "tiklash" && git push mine HEAD:main` | run ✓ |
- Isbot: «4-qadamdagi yashil run manzili» · placeholder: «masalan: https://github.com/siz/OrderBotNest/actions/runs/41831…» · KOD: `/github\.com\/[^\s\/]+\/[^\s\/]+\/actions\/runs\/\d+/` · xato: «Actions'da run'ni ochib, brauzer qatoridagi manzilni qo'ying: …/actions/runs/<raqam>.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Actions bo'limida run yo'q | fayl `.github/workflows/` papkasida emas yoki push `main`ga bormagan — yo'lni va `git push mine HEAD:main` ni tekshiring |
  | `npm ci` qadami qizil: `Missing: … from lock file` | runner'dagi Node mashinangizdan boshqa — `node-version` ni `node --version` raqamiga qo'ying (17-ekran) |
  | `npm ci` qizil: `can only install with an existing package-lock.json` | `actions/checkout@v4` qadami yo'q — mashinada repo yo'q (13-ekran) |
  | Run qizil, ichida job yo'q | fayl xatosi — YAML surilish yoki `runs-on` yo'q (16-ekran) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `cicd1v2-out/10`, `11`, `12`, `10a`; GitHub Actions oqimi.

---

## 13 · Checkout yo'q — mashinada repo yo'q  ← `Lesson`
- Kicker: `4-bosqich · to'rt tuzoq` · Sarlavha: **`actions/checkout` satrini olib tashlasak — mashina bo'sh: `npm ci` «lock fayl yo'q» deydi, run qizil; birinchi tuzoq**
- Sahna: `ci.yml` (`2-checkout-yoq.yml`): `steps:` dan `- uses: actions/checkout@v4` o'chirilgan (qizil), keyin `setup-node`, `npm ci`, `npm test`; GitHub run `12`: `setup-node` ✓ · **`npm ci` ✗** · `npm test` ⊘; log: `npm error code EUSAGE` · `` npm error The `npm ci` command can only install with an existing package-lock.json or `` · `npm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or` · `npm error later to generate a package-lock.json file, then try again.`; 4-segmentda ikki mashina kartasi: «Sizda: papka to'la — `package-lock.json` bor» ↔ «Runner: bo'sh papka — checkout olib keladi».
1. **Birinchi tuzoq: ==`checkout` satri yo'q== — to'g'ri ko'rinadi, YAML xatosi ham yo'q**
   Ovoz: «To'rt tuzoqni ko'ramiz, har biri haqiqiy run. Birinchisi: ci yml'dan actions checkout satrini olib tashladik. Fayl to'g'ri ko'rinadi: setup node, npm si ay, npm test. YAML xatosi yo'q, GitHub faylni qabul qildi, run boshlandi.» · yml
2. **Run: `setup-node` ✓, ==`npm ci` ✗ — «can only install with an existing package-lock.json»==**
   Ovoz: «Run qizil. Setup node yashil, Node o'rnatildi. Npm si ay qizil, logda: npm si ay faqat mavjud package lock json bilan o'rnatadi, lock yarating, deydi. Lekin lock faylimiz repoda bor, siz uni to'rtinchi ekranda ko'rdingiz. Xabar aldaydi: lock yo'q emas, butun papka bo'sh.» · run + log
3. **Demak, sabab: ==runner bo'sh papkadan boshlaydi== — kodni `checkout` olib keladi, u yo'q**
   Ovoz: «Demak, sabab bitta: runner har safar bo'sh papkadan boshlaydi, to'rtinchi ekrandagi toza clone'dan ham bo'shroq, u yerda hatto clone ham yo'q. Kodni mashinaga actions checkout olib keladi. U yo'q, demak package json ham, lock ham yo'q, npm si ay nima o'rnatishini bilmaydi.» · ikki mashina
4. **Xulosa: ==birinchi qadam doim `checkout`==; «lock yo'q» yoki «package.json yo'q» ko'rsangiz — shu satrni qidiring**
   Ovoz: «Xulosa: har workflow'da birinchi qadam actions checkout. Logda lock fayl yo'q yoki package json yo'q ko'rsangiz, repongizni tekshirmang, ci yml'dagi shu satrni qidiring. O'quvchi darsidagi ci yml'da ham bu satr yo'q, yigirma uchinchi ekranda ko'ramiz. Ikkinchi tuzoq: lock fayl.» · xulosa
- Manba: `cicd1v2-out/12-checkout-yoq.txt` (run, log — aynan: `npm ci` «can only install with an existing package-lock.json»), `cicd1v2-yml/2-checkout-yoq.yml`; o'quvchi yml'idagi `npm install`/`npm test` bo'sh papkada — `Could not read package.json … ENOENT` (v1 lokal `cicd1-out/11`).

## 14 · `npm ci` va lock: «in sync» xatosi  ← `Lesson`
- Kicker: `4-bosqich · to'rt tuzoq` · Sarlavha: **`package.json`ni qo'lda o'zgartirdik, lock qolmadi — `npm ci` lentada ham, lokalda ham yiqiladi: «package.json and package-lock.json … in sync»; ikkinchi tuzoq**
- Sahna: VS Code `package.json` 30-satr `"telegraf": "^4.16.3"` → `"telegraf": "4.16.0"` (M36), `package-lock.json` da `4.16.3`; terminal `03c`: `$ npm ci` · `npm error code EUSAGE` · `` `npm ci` can only install packages when your package.json and package-lock.json … are in sync. Please update your lock file with `npm install` before continuing.`` · `Invalid: lock file's telegraf@4.16.3 does not satisfy telegraf@4.16.0`; GitHub run `13`: `npm ci` ✗ (o'sha xato); 4-segmentda ikki karta: `npm ci` — «lock'dan aynan, mos kelmasa — qizil» ↔ `npm install` — «lock'ni o'zi o'zgartiradi — lentada xavfli».
1. **Ikkinchi tuzoq: `package.json`da ==versiyani qo'lda o'zgartirdik==, `npm install` yurgizmadik — lock eskicha**
   Ovoz: «Ikkinchi tuzoq. Package json faylining o'ttizinchi satrida telegraf versiyasini qo'lda to'rt o'n olti nolga o'zgartirdik, npm install yurgizmadik. Package lock json'da hali to'rt o'n olti uch. Ikki fayl bir-biriga mos emas. Commit, push.» · `package.json` 30
2. **Lokalda ham, lentada ham: ==`npm ci` qizil — «in sync» emas==: lock'da 4.16.3, `package.json`da 4.16.0**
   Ovoz: «Natija lokalda ham, lentada ham bir xil: npm si ay qizil. Xabar: package json va package lock json in sync emas, ya'ni mos emas. Pastda aniq sabab: lock fayldagi telegraf to'rt o'n olti uch, package json'dagi to'rt o'n olti nolga mos kelmaydi.» · terminal + run
3. **Demak, sabab: ==`npm ci` lock fayldan aynan o'rnatadi==, mos kelmasa — o'rnatmaydi, qizil beradi**
   Ovoz: «Demak, sabab: npm si ay, ya'ni clean install, lock fayldan aynan o'rnatadi, bir baytini ham o'zgartirmaydi. Package json mos kelmasa, taxmin qilmaydi, qizil beradi. Bu to'g'ri: lentada hamma mashina aynan bir xil paketlarni olishi kerak.» · sabab
4. **Xulosa: ==lokalda `npm install`, lentada `npm ci`==; versiya o'zgarsa — lock ham commit'ga kiradi**
   Ovoz: «Xulosa: paket qo'shsangiz yoki versiya o'zgartirsangiz, lokalda npm install yurgizing: u lock'ni yangilaydi. Lock faylni ham commit'ga qo'shing. Lentada esa doim npm si ay: u lock'ga ishonadi va mos kelmasa to'xtaydi. Uchinchi tuzoq eng xavflisi: yashil, lekin yolg'on.» · ikki karta
- Manba: `cicd1v2-out/03c-npm-ci-lock-sinxron-emas.txt` (aynan), `13-npm-ci-lock.txt` (run).

## 15 · `tsc` qadami: test yashil, lenta yolg'on yashil  ← `Lesson`
- Kicker: `4-bosqich · ichida` · Sarlavha: **`user.service.ts`da tur xatosi: `ts-jest` testlarni baribir yashil o'tkazadi — `tsc` qadamisiz lenta yashil (yolg'on), `tsc` bilan qizil; uchinchi tuzoq**
- Sahna: yonma-yon (M47): chapda VS Code `user.service.ts` 16-satr `const telegram_id = String(from.id);` → `const telegram_id = from.id;` (M36; `tsc` xatoni 20 va 22-satrlarda — `findOne`, `create` — ko'rsatadi) + terminal `06`: `$ npx tsc --noEmit` · `user.service.ts(20,42): error TS2322: Type '{ telegram_id: number; }' is not assignable…` · `Type 'number' is not assignable to type 'string…'` · `[chiqish kodi: 2]` · `$ npm test` · `Tests: 25 passed, 25 total` · `[chiqish kodi: 0]`; o'ngda ikki run: run `14` (`6-tsc-yoq.yml`: `tsc` qadami yo'q) — hammasi ✓, **run yashil** · run `15` (`1-tavsiya.yml`) — `tsc` ✗, `test` ⊘, `build` ⊘, **run qizil**.
1. **Uchinchi tuzoq: ==tur xatosi, test yashil== — `ts-jest` turni tekshirmaydi, `tsc` tekshiradi**
   Ovoz: «Uchinchi tuzoq. Src, api, user papkasidagi user service ts faylining o'n oltinchi satrida string'ni olib tashladik: telegram id endi number, ustun esa string. Npx tsc: yigirmanchi satrda xato, TS ikki uch ikki ikki, chiqish kodi ikki. Npm test: yigirma besh passed, yashil. Test turni tekshirmaydi.» · chap
2. **Lentada `tsc` qadami yo'q (run 14): ==hammasi yashil — yolg'on==; kod kompilyatsiya bo'lmaydi**
   Ovoz: «Shu kodni tsc qadamisiz ci yml bilan push qildik: checkout, setup node, npm si ay, npm test. Run yashil, oltita belgi yashil. Lekin bu yolg'on yashil: nest build bu kodni yig'a olmaydi, bot ishga tushmaydi. Lenta buni ko'rmadi, chunki hech kim so'ramadi.» · run 14
3. **`tsc` qadami bilan (run 15): ==`tsc` ✗, test va build skipped== — run qizil, chiqish kodi 2**
   Ovoz: «O'sha kod, tavsiya ci yml bilan: tsc qadami bor. Run qizil: tsc qizil, chiqish kodi ikki, npm test skipped, build skipped. Yonma-yon qarang: bir xil kod, bir xil testlar, bitta satr farq: npx tsc no emit. Birida yolg'on yashil, ikkinchisida haqiqiy qizil.» · run 15
4. **Xulosa: ==lenta faqat so'ralgan narsani tekshiradi== — `tsc` qadamini test'dan oldin qo'ying**
   Ovoz: «Xulosa: lenta faqat siz so'ragan narsani tekshiradi. Testlar yashil, degani turlar to'g'ri degani emas. Npx tsc no emit qadamini npm test'dan oldin qo'ying: arzon, uch soniya, va build'gacha bormay to'xtatadi. To'rtinchi tuzoq: faylning o'zi.» · yonma-yon
- Manba: `cicd1v2-out/06-tsc-qizil.txt` (aynan), `14-tsc-yoq-yashil.txt`, `15-tsc-bor-qizil.txt` (run'lar).

## 16 · Tekshiruv 3 — YAML: qaysi satr lentani yiqitadi  ← `LineCheck`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4 — qaysi satr xato?` · Sarlavha: **Bu `ci.yml` bilan push qildik — run qizil, lekin ichida bitta qadam ham yo'q: «workflow file issue». Sababchi satrni toping**
- Shart (`task`): «Qoida: YAML'da bitta ro'yxatning elementlari (`- `) bir ustunda turadi. Ro'yxat 7-satrda boshlandi; keyingi element boshqa ustundan boshlanadi — GitHub aynan shu satrni ko'rsatadi. **Birinchi buzilgan satrni bosing.**»
- Ovoz (`q`): «Uch tuzoqni ko'rdingiz, to'rtinchisini o'zingiz topasiz. Uchinchi tekshiruv. Bu ci yml bilan push qildik: run qizil, lekin ichida bitta qadam ham yo'q, GitHub workflow file issue dedi. YAML'da bitta ro'yxatning elementlari bir ustunda turadi. Ro'yxat yettinchi satrda boshlandi, keyingi element boshqa ustundan boshlanadi. Birinchi buzilgan satrni bosing.»
- Fayl: `.github/workflows/ci.yml` (`cicd1v2-yml/4-surilish-xato.yml`, 9 satr; Explorer faol): 1 `name: CI` · 2 `on: push` · 3 `jobs:` · 4 `  test:` · 5 `    runs-on: ubuntu-latest` · 6 `    steps:` · 7 `    - uses: actions/checkout@v4` · **8 `      - run: npm ci` ← xato satr (7-satrdan 2 probel o'ngda)** · 9 `      - run: npm test` → `target` = 8-satr (indeks 7). GitHub'ning javobi (run `17`): run ochildi-yu, job yo'q — `gh run view`: `X This run likely failed because of a workflow file issue.` (`17-surilish-xato.txt`, aynan); fayl xatosining matni — rasmiy tahlilchi `08`: `A block sequence may not be used as an implicit map key at line 8, column 1` (✅ KOD 2).
- Tuzatilgan (`fixed`): 8–9-satrlar `    - run: npm ci` · `    - run: npm test` (7-satr bilan bir chuqurlikda; eski qizil, yangisi yashil); `fixedExtra`: ikkinchi fayl xatosi — `3-runs-on-yoq.yml`: `runs-on` satri yo'q → tahlilchi: `(Line: 5, Col: 5): Required property is missing: runs-on` (`08`); GitHub'da run `16` ham «workflow file issue», job yo'q — «fayl xatosida job yo'q, qadam yo'q, log yo'q».
- To'g'ri (ovoz, `ok`): «To'g'ri. Sakkizinchi satr qo'shnisidan ikki probel o'ngda boshlanadi: YAML uni ro'yxat elementi emas, oldingi elementning davomi deb o'qiydi va tushunmaydi. GitHub bunday faylni yurgizmaydi: run ro'yxatda qizil, lekin ichida job yo'q, qadam yo'q, log yo'q, faqat workflow file issue. Ekranda tuzatilgan: hamma chiziqcha bir chuqurlikda. Pastda ikkinchi fayl xatosi: runs on yo'q.»
- Qisqa (`okShort`): «8-satr 2 probel o'ngda — YAML tushunmadi. Fayl xatosida job yo'q, qadam yo'q, log yo'q.»
- Maslahat (`hint`): «`- uses` va `- run` chiziqchalari bir ustunda turishi kerak. Qaysi biri surilgan?»
- Manba: `cicd1v2-yml/4-surilish-xato.yml`, `3-runs-on-yoq.yml`, `08-yaml-tekshiruv.txt` (rasmiy tahlilchi), `17-surilish-xato.txt`, `16-runs-on-yoq.txt` (haqiqiy GitHub javobi).

---

## 17 · Lokalda yashil, lentada qizil: Node versiyasi  ← `Lesson`
- Kicker: `5-bosqich · mashina farqi` · Sarlavha: **Haqiqiy topilma: toza clone'da yashil edi, birinchi run'da `npm ci` qizil — `Missing: webpack@5.112.2 from lock file`; sabab — runner'da Node 22, mashinada Node 24**
- Sahna: yonma-yon (M47): chapda «Sizning mashinangiz» kartasi — `node --version` `v24.18.0` · `npm --version` `11.16.0` · `npm ci` ✓ (`01`); o'ngda «Runner (`node-version: 22`)» — `Found in cache @ …/node/22.23.4` · npm 10.9 · `npm ci` ✗: `npm error Missing: webpack@5.112.2 from lock file` (run `10a`); 3-segmentda terminal `03d`: `$ npx -p npm@10 npm ci` → o'sha xato lokalda (npm 10 bilan), `[chiqish kodi: 1]`; 4-segmentda `ci.yml` 10-satr `node-version: 22` → `node-version: 24` va run `10` ✓.
1. **Birinchi run'imiz aslida ==qizil edi==: `npm ci` — `Missing: webpack@5.112.2 from lock file`**
   Ovoz: «Endi haqiqiy topilma. Bu darsni tayyorlashda birinchi run qizil chiqdi. Npm si ay qadami: missing webpack from lock file. Lokalda esa to'rtinchi ekranda o'sha lock bilan npm si ay yashil edi. Bir xil kod, bir xil lock, boshqa natija. Menda ishlaydi, lekin lentada yo'q.» · run 10a
2. **Farq: ==mashinada Node 24 va npm 11, runner'da Node 22 va npm 10== — npm 10 lock'ni boshqacha o'qiydi**
   Ovoz: «Ikki mashinani yonma-yon qo'yamiz. Sizniki: node yigirma to'rt, npm o'n bir. Runner: ci yml'da node version yigirma ikki yozilgan edi, u bilan npm o'n keladi. Npm o'n lock faylning bir yozuvini, peer paketni, boshqacha o'qiydi va yo'q deb hisoblaydi.» · ikki karta
3. **Isbot lokalda: ==npm 10 bilan `npm ci` — o'sha xato==; demak sabab kod emas, npm versiyasi**
   Ovoz: «Isbot: o'z mashinamizda npx bilan npm o'nni chaqirib npm si ay yurgizdik: aynan o'sha xato, missing webpack. Demak, sabab kodda ham, lock'da ham emas: lentadagi Node, demak npm, mashinadagidan boshqa. Lokalda yashil, lentada qizil bo'lsa, birinchi shuni solishtiring.» · `03d`
4. **Xulosa: ==`node-version` — `node --version` raqamingiz==; 22 → 24 qilindi, run yashil**
   Ovoz: «Xulosa: ci yml'dagi node version mashinangizdagi node version bilan bir xil bo'lsin. Yigirma ikkini yigirma to'rtga o'zgartirdik, push, run yashil. Shuning uchun sakkizinchi ekrandagi faylda yigirma to'rt. Endi AI yozgan workflow'larni ko'ramiz: ikkalasi ham shu tuzoqqa tushdi.» · 22 → 24
- Manba: `cicd1v2-out/10a-node22-npm-ci-qizil.txt` (run, log — aynan), `03d-npm10-lock-sinxron-emas.txt`, `00-versiyalar.txt`, `10-yashil.txt`.

## 18 · AI workflow yozdi — ikki to'plam  ← `Lesson`
- Kicker: `5-bosqich · AI` · Sarlavha: **Yangi ko'nikma davomi: ikki AI'ga bitta oddiy prompt — ikkalasi to'g'ri ko'rinadigan workflow yozdi; endi ularni o'qiymiz, keyin lentada sinaymiz**
- Sahna: 1-segmentda bosqich kartasi: «1–4-bosqich · lentani siz yozdingiz» (xira) → «5-bosqich · AI yozadi, siz qabul qilasiz» (yonadi); 2-segmentdan prompt kartasi (`p1-prompt.txt`); 3-segmentda ikki AI javobi kartasi (`AiReply`): «1-AI (kuchli model)» — `.github/workflows/test.yml`, 22 satr: `name: Tests` · `on: push` · checkout@v4 · setup-node@v4 `node-version: 22`, `cache: npm` · `npm ci` · `npm test`; «2-AI (kuchsizroq model)» — `ci.yml`, 26 satr: `permissions: contents: read` · xuddi shu qadamlar; 4-segmentda ikki yml yonma-yon, `node-version: 22` satrlari qizil belgilangan, pastda «yo'q: `tsc`, `build`».
1. **Yana AI bosqichi: ==workflow'ni AI yozadi, siz qabul qilasiz== — oddiy prompt, ishorasiz**
   Ovoz: «Jest darslaridagi kabi oxirgi bosqich AI bilan. Prompt oddiy: bu NestJS loyihasi uchun GitHub Actions workflow yozib ber, har push'da testlar yursin. Checkout, setup node, versiya, tsc, build, bu so'zlarning hech biri promptda yo'q. Har AI loyihaning alohida nusxasida ishladi.» · bosqich + prompt
2. **Ikkalasi ==to'g'ri ko'rinadigan fayl== yozdi: checkout, setup-node, `npm ci`, `npm test`**
   Ovoz: «Ikkalasi ham to'g'ri ko'rinadigan fayl yozdi. Birinchisi test yml, yigirma ikki satr: checkout, setup node, npm si ay, npm test, har qadamga o'zbekcha nom. Ikkinchisi ci yml, yigirma olti satr, xuddi shu qadamlar, qo'shimcha permissions contents read, faqat o'qish huquqi. YAML xatosi yo'q.» · AI kartalari
3. **Lekin ikkalasida ==`node-version: 22`== — mashinangizni so'ramadi; va ==`tsc` ham, `build` ham yo'q==**
   Ovoz: «Lekin ikki narsa. Ikkalasi ham node version yigirma ikki yozdi: sizning mashinangizda qaysi Node borligini so'ramadi, odatdagi raqamni qo'ydi. Va ikkalasida tsc ham, build ham yo'q: prompt testlar yursin dedi, AI aynan shuni qildi, ortig'ini emas.» · qizil satrlar
4. **Xulosa: ==to'g'ri ko'ringan fayl hali tekshiruv emas== — lentaga qo'yib ko'ramiz**
   Ovoz: «Xulosa: to'g'ri ko'ringan workflow hali tekshiruv emas. Jest'dagi yashil test kabi: fayl chiroyli, lekin sizning mashinangizni va loyihangizni bilmaydi. Ikkalasini ham OrderBotNest'ning sinov tarmog'iga push qildik. Natija ekranda.»
- Manba: `cicd1v2-ai/00-promptlar.md`, `p1-prompt.txt`, `ai1/.github/workflows/test.yml`, `ai2/.github/workflows/ci.yml`, `ai1/diff-stat.txt`, `ai2/diff-stat.txt`.

## 19 · AI workflow'lari lentada: qizil → versiya → yashil, lekin…  ← `Lesson`
- Kicker: `5-bosqich · ichida` · Sarlavha: **Ikkala AI workflow'i lentada qizil — `npm ci`, o'sha `Missing: webpack… from lock file`; faqat `node-version` tuzatilsa yashil, lekin tur xatosi baribir o'tadi**
- Sahna: uch run galma-gal: run `19` (1-AI) — `npm ci` ✗ (`Missing: webpack@5.112.2 from lock file`) · run `20` (2-AI) — `npm ci` ✗ (o'sha) · run `21` (1-AI, `node-version: 24`) — `npm ci` ✓ · `npm test` ✓, run yashil; 4-segmentda 15-ekrandagi tur xatosi kartasi: «bu workflow bilan — yashil qoladi (`tsc` yo'q)» + to'rt savol ro'yxati.
1. **Run 19 va 20: ==ikkalasi qizil, `npm ci` qadamida== — 17-ekrandagi o'sha xato**
   Ovoz: «Ikkala run ham qizil, ikkalasi ham npm si ay qadamida: missing webpack from lock file. O'n yettinchi ekrandagi tuzoq: node version yigirma ikki, npm o'n, lock boshqacha o'qildi. AI buni bilishi mumkin emas edi: u sizning mashinangizni ko'rmaydi.» · run 19, 20
2. **Faqat bitta raqam: ==22 → 24 — run 21 yashil==, `npm ci` ✓, `npm test` ✓; qadam nomi hali «Node.js 22»**
   Ovoz: «Birinchi AI faylida faqat bitta raqamni o'zgartirdik: node version yigirma to'rt. Push: run yashil, npm si ay o'tdi, npm test yigirma besh passed. Qadam nomi hali Node js yigirma ikki o'rnatish deb turibdi: nom emas, raqam ishlaydi. Bitta raqam, qizildan yashilga.» · run 21
3. **Lekin: ==`tsc` yo'q — 15-ekrandagi tur xatosi bu lentada yashil qoladi==; `build` ham yo'q**
   Ovoz: «Lekin yashil hali to'liq emas. Bu workflow'da tsc yo'q: o'n beshinchi ekrandagi tur xatosini push qilsangiz, run yashil qoladi, yolg'on yashil. Build ham yo'q: yig'ilmaydigan kod yashil o'tadi. Prompt testlar yursin dedi, AI faqat shuni qildi.» · tur xatosi kartasi
4. **Xulosa: AI workflow'ini ==to'rt savol bilan== qabul qiling: checkout · `node-version` meniki · `npm ci` · `tsc` va `build`**
   Ovoz: «Xulosa: AI yozgan workflow'ni to'rt savol bilan qabul qiling. Checkout bormi. Node version mening mashinamdagi bilan bir xilmi. Npm si ay'mi, install emasmi. Tsc va build qadamlari bormi. To'rttasiga ha bo'lsa, push qiling va run'ni ko'ring. Endi tekshirib olaylik.» · to'rt savol
- Manba: `cicd1v2-out/19-ai1.txt`, `20-ai2.txt`, `21-ai1-node24.txt` (run'lar — aynan), `14-tsc-yoq-yashil.txt`.

## 20 · Tekshiruv 4 — AI workflow'ni qabul qilish  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **1-AI yozgan workflow: `checkout@v4` · `setup-node@v4` (`node-version: 22`) · `npm ci` · `npm test`. Mashinangizda Node 24. Lentaga qo'yishdan oldin nimani o'zgartirasiz?**
- Material (`above`): 1-AI fayli aynan — `ai1/.github/workflows/test.yml` qadam satrlari 12, 15–17, 21, 24 (`uses: actions/checkout@v4` … `node-version: 22`, `run: npm ci`, `run: npm test`; nom va bo'sh satrlarsiz — panel eski 6 satr balandligida); ostida `node --version` → `v24.18.0`.
- Ovoz: «AI workflow'larini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. Bu birinchi AI yozgan fayl: checkout bor, setup node yigirma ikki, npm si ay va npm test. Mashinangizda Node yigirma to'rt. Lentaga qo'yishdan oldin nimani o'zgartirasiz? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Hech narsa — checkout va `npm ci` bor, qolgani ishlaydi · 2 Faqat `node-version` 24 — testlar o'tsa, yetarli · 3 `node-version` 24 va `tsc`, `build` qadamlarini qo'shish · 4 `checkout`ni olib tashlash — `setup-node` o'zi olib keladi
- To'g'ri (ovoz): «To'g'ri. Ikki narsa. Node version mashinangizdagi yigirma to'rt, aks holda o'n yettinchi ekrandagi qizil. Va tsc bilan build qadamlari: aks holda tur xatosi va yig'ilmaydigan kod yashil o'tadi. Checkout va npm si ay to'g'ri, ular qoladi. Demak, AI fayli boshlanish nuqtasi, to'rt savol esa sizniki.» · qisqa: «`node-version` = `node --version` · `tsc` + `build` qadamlari. `checkout` va `npm ci` qoladi.»
- Isbot (`after`): run `21` qadamlari (`node-version: 24` bilan yashil) + eslatma: «`tsc`siz — 15-ekrandagi tur xatosi yashil o'tadi (run 14)».
- Demak: «AI workflow'i — boshlanish nuqtasi: `node-version` meniki · `tsc` va `build` qo'shiladi · `checkout` va `npm ci` qoladi.»
- Xato izohlari: 1 — «`node-version: 22` bilan `npm ci` qizil (17-ekran); `tsc` qadamisiz tur xatosi yashil o'tadi (15-ekran).» · 2 — «Run yashil bo'ladi, lekin `tsc` va `build` yo'q: tur xatosi va yig'ilmaydigan kod ham yashil o'tadi (15-ekran).» · 4 — «`setup-node` faqat Node o'rnatadi; kodni `checkout` olib keladi (13-ekran).»
- Maslahat: «19-ekrandagi to'rt savolni shu faylga bering: checkout? versiya? `ci`? `tsc`/`build`?»
- Manba: `cicd1v2-ai/ai1/.github/workflows/test.yml` (aynan; 2-AI ham `npm ci`), `cicd1v2-out/21`, `14`, `10a`.

## 21 · Amaliyot 3 — AI workflow, to'rt tekshiruv, buzib ko'rish  ← `Practice`
- Kicker: `Amaliyot 3 / 3` · Eyebrow: `Hozir o'zingizda · 20 daqiqa` · Sarlavha: **O'z AI'ingizga workflow yozdiring, to'rt savol bilan tuzating, push — yashil; keyin tur xatosi bilan push — qizil bo'lsin** · `tableAt: 3`
1. **Endi siz: AI'ga ==aniq shartli prompt== — OrderBotNest uchun workflow**
   Ovoz: «Endi navbat sizga. O'z AI'ingizga OrderBotNest uchun workflow yozdirasiz, promptni pastdagi tugma bilan nusxalaysiz. Keyin to'rt savol bilan tekshirib, o'z reponingizga push qilasiz. Yigirma daqiqa ketadi.»
2. **1–2-qadam: prompt va ==to'rt savol== — checkout · `node-version` meniki · `npm ci` · `tsc` va `build`**
   Ovoz: «Birinchi qadamda promptni berasiz. Ikkinchisida faylni to'rt savol bilan o'qiysiz: checkout bormi, node version mashinangizdagi raqammi, npm si ay'mi, tsc va build qadamlari bormi. Yetishmaganini qo'lda qo'shing yoki AI'dan so'rang.»
3. **3–4-qadam: ==push — yashil; tur xatosi bilan push — `tsc` qizil==, tiklash; isbot — qizil run'ning qadam nomi**
   Ovoz: «Uchinchi qadamda push: run yashil bo'lishi kerak. To'rtinchisida user service ts'ning o'n oltinchi satrida string'ni olib tashlab push qilasiz: run qizil, tsc qadamida, test skipped. Tiklab push, yashil. Isbot maydoniga qizil run'da qaysi qadam qizarganini yozing.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz AI yozgan workflow'ni to'rt savol bilan qabul qilgansiz va lenta tur xatosini ham ushlashini o'zingiz ko'rgansiz.»
- Prompt (nusxalash): «Loyiha: OrderBotNest (NestJS + Telegraf + TypeORM), `package-lock.json` bor, testlar Jest (`npm test`), turlar `npx tsc --noEmit`, build `npm run build`. Mashinamda Node <node --version raqamingiz>. Vazifa: `.github/workflows/ci.yml` yoz: har `push` va `pull_request`da `ubuntu-latest`da: kodni olib kelish (`actions/checkout@v4`), Node o'rnatish (`actions/setup-node@v4`, `node-version` — mening raqamim, `cache: npm`), `npm ci`, `npx tsc --noEmit`, `npm test`, `npm run build` — aynan shu tartibda, har biri alohida `run:` qadam. Boshqa fayllarga tegma. Javobda: faylning to'liq matni.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Prompt | yuqoridagi prompt — o'z AI'ingizga (`<node --version raqamingiz>` o'rniga o'z raqamingiz) | `.github/workflows/ci.yml` |
  | 2 | To'rt savol | `checkout@v4` bor · `node-version` = `node --version` · `npm ci` (install emas) · `npx tsc --noEmit` va `npm run build` qadamlari bor — yetishmasa qo'shing | 4 ✓ |
  | 3 | Push — yashil | `git add .github && git commit -m "ci: AI workflow" && git push mine HEAD:main` | run ✓ (checkout · setup-node · ci · tsc · test · build) |
  | 4 | Tur xatosi — qizil | `src/api/user/user.service.ts` 16-satr `String(from.id)` → `from.id` · commit, push · keyin `git checkout -- src/api/user/user.service.ts`, commit, push | run ✗: `npx tsc --noEmit` ✗ · `npm test` skipped → keyin run ✓ |
- Isbot: «4-qadamdagi qizil run'da qizargan qadam nomi» · placeholder: «masalan: npx tsc --noEmit» · KOD: `/tsc/i` · xato: «Qizil run'ni oching: qaysi qadam qizil? Uning nomini yozing (tsc bo'lishi kerak).»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `npm ci` qizil, `Missing: … from lock file` | `node-version` mashinangizdan boshqa — 2-savol (17-ekran) |
  | 4-qadamda run yashil | `tsc` qadami yo'q yoki `npm test`dan keyin turibdi — `npx tsc --noEmit` `npm ci`dan keyin, `npm test`dan oldin |
  | Run qizil, job yo'q (`workflow file issue`) | YAML surilish — `- uses` va `- run` bir ustunda (16-ekran) |
  | AI `npm install` yozdi | `npm ci` ga almashtiring (14-ekran) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `cicd1v2-ai/` tajribasi (ikkala AI `node-version: 22`, `tsc`/`build` yo'q); `cicd1v2-out/15` (tsc qizil run).

---

## 22 · CD: Delivery, Deployment va `.env` chegarasi  ← `Lesson`
- Kicker: `6-bosqich · CD` · Sarlavha: **Lenta `dist` yig'di — lekin `node dist/main` toza mashinada darhol yiqiladi: `DATABASE_URL topilmadi`. CD shu yerdan boshlanadi: secret, server, chiqarish — keyingi darslar**
- Sahna: terminal `05`: `$ npm run build` `[0]` · `$ node dist/main` · `Error: DATABASE_URL topilmadi. .env ga PostgreSQL manzilini yozing: postgresql://…` · `[chiqish kodi: 1]`; 3-segmentda CD chizig'i: CI (✓ to'rt qadam) → «paket tayyor» → Delivery (odam: «chiqar» tugmasi) / Deployment (lenta o'zi) → server; 4-segmentda «kerak» ro'yxati: `DATABASE_URL`, `BOT_TOKEN` — GitHub Secrets · server (qayerda yuradi) · chiqarish buyrug'i.
1. **Lenta `dist` yig'di — ==`node dist/main` toza mashinada yiqiladi==: `DATABASE_URL topilmadi`**
   Ovoz: «CI tugadi: dist papkasi tayyor. Endi uni ishga tushirib ko'raylik, toza mashinada: node dist main. Darhol xato: DATABASE URL topilmadi, env'ga Postgres manzilini yozing. Lokalda env faylingiz bor, lentada yo'q, va bo'lmasligi ham kerak: parol commit'ga kirmaydi.» · terminal
2. **CD: ==tekshirilgan paketni chiqarish== — Delivery: odam tugmani bosadi; Deployment: lenta o'zi**
   Ovoz: «Mana CD'ning chegarasi. Continuous Delivery: lenta paketni tayyorlab qo'yadi, odam chiqar tugmasini bosadi. Continuous Deployment: yashil bo'lsa, lenta o'zi serverga chiqaradi. Ikkalasiga ham uch narsa kerak: maxfiy qiymatlar, server va chiqarish buyrug'i.» · CD chizig'i
3. **Kerak: ==`DATABASE_URL` va `BOT_TOKEN` — GitHub Secrets==; server; chiqarish buyrug'i**
   Ovoz: «Maxfiy qiymatlar GitHub Secrets'da saqlanadi, ci yml ularni nom bilan oladi, qiymatini hech kim ko'rmaydi. Server, bot qayerda yuradi. Va chiqarish buyrug'i. Bularning har biri alohida mavzu, bugungi dars emas.» · ro'yxat
4. **Xulosa: ==bugun CI to'liq, CD chegarasi aniq==; secrets va run'ni o'qish — keyingi mentor darsida**
   Ovoz: «Xulosa: bugun CI to'liq: har push'da to'rt qadam, yashil yoki qizil. CD'ning chegarasini ko'rdingiz: paket bor, lekin maxfiy qiymatlarsiz yurmaydi. Keyingi mentor darsida GitHub Actions'ga chuqurroq kiramiz: run'ni o'qish, secrets, cache. Hozir esa sinfga tayyorgarlik.» · xulosa
- Manba: `cicd1v2-out/05-dist-main-envsiz.txt` (aynan); CI/CD-2 mentor darsi (secrets, cache, run logi).

## 23 · Sinfga tayyorgarlik: m4c-01 xaritasi va xato qiladigan joylar  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Eyebrow: `m4c-01 · «CI/CD nima va nega kerak»` · Sarlavha: **O'quvchi darsi: aeroport lentasi — chamadon, Yig'ish, Skaner, O'lcham ramkasi, O'rash, Uchirish; siz bilgan to'rt qadamning rasmli varianti**
- Sahna: ikki karta: «O'quvchi (m4c-01)» — 20 ekran, aeroport lentasi 5 nuqta (📦 Yig'ish `npm install` · 🔍 Skaner `npm test` · 📐 O'lcham ramkasi `eslint .` · 🎁 O'rash `npm run build` · ✈️ Uchirish deploy), `on: push` = start signali, s13 `ci.yml` bo'shliqlari (`on`, `runs-on`, `npm install`), amaliyot: o'z reposiga `ci.yml` · «Siz (bugun)» — OrderBotNest: `npm ci` · `tsc` · `test` · `build`, haqiqiy run'lar, to'rt tuzoq; 2-segmentda lug'at; 3-segmentda «Siz qo'shasiz» jadvali; 4-segmentda xato qiladigan joylar kartalari (3) + «O'quvchi so'rasa» (ovozsiz).
- Lug'at:
  | O'quvchi aytadi | Siz bilasiz |
  |---|---|
  | lenta · chamadon | pipeline · kod (commit) |
  | Yig'ish 📦 · Skaner 🔍 · O'rash 🎁 · Uchirish ✈️ | `npm install` · `npm test` · `npm run build` · deploy (CD) |
  | O'lcham ramkasi 📐 | `eslint .` — OrderBotNest'da yo'q, o'quvchi reposida bor |
  | start signali · yo'l xaritasi · lenta mashinasi | `on: push` · `ci.yml` · runner (`runs-on: ubuntu-latest`) |
  | qizil chiroq — lenta to'xtaydi | chiqish kodi ≠ 0 — keyingi qadamlar «skipped» |
  | seyf | GitHub Secrets (keyingi dars) |
- Siz qo'shasiz:
  | Siz qo'shasiz | Qayerda |
  |---|---|
  | `actions/checkout` satri — o'quvchi `ci.yml`ida yo'q (13-ekran): amaliyotda «bitta qator qo'shing» | amaliyot, `ci.yml` |
  | `npm ci` vs `npm install` — o'quvchi `install` yozadi; sinfda sabab bir gapda (14-ekran) | s13 builder |
  | haqiqiy Actions run'ini bir marta ekranda ko'rsatish: qizil qadam, skipped | amaliyot oxiri |
  | «lokalda yashil, lentada qizil» — Node versiyasi (17-ekran) | o'quvchi shikoyat qilganda |
- Xato qiladigan joylar:
  | # | Vaziyat | Xabar | Yechim |
  |---|---|---|---|
  | 1 | Actions'da run yo'q | — | fayl `.github/workflows/` da emas yoki push bormagan |
  | 2 | `npm install` / `npm test` qizil | `Could not read package.json … ENOENT` | `checkout` satri yo'q — papka bo'sh |
  | 3 | Run qizil, job yo'q | `workflow file issue` | YAML surilish / `runs-on` yo'q |
- O'quvchi so'rasa:
  - «Lenta mening kompyuterimda yuradimi?» → Yo'q — GitHub'dagi toza mashinada; shuning uchun `checkout` va `npm install` kerak.
  - «Nega `npm install` yana? Menda bor-ku» → Toza mashinada `node_modules` yo'q — har run'da yangidan.
  - «Qizil bo'lsa sayt buziladimi?» → Yo'q — qizil kod chiqmaydi, lenta to'xtaydi; bu himoya.
  - «Deploy qayerga?» → Bu CD — keyingi darslarda; hozir lenta tekshiradi, chiqarmaydi.
1. **m4c-01 — 20 ekran: ==aeroport lentasi, besh nuqta==; o'quvchi `ci.yml` bo'shliqlarini to'ldiradi**
   Ovoz: «Endi sinfga tayyorgarlik. O'quvchi darsi m4c-01, yigirma ekran. Metafora aeroport lentasi: chamadon bu kod, besh nuqta: yig'ish, skaner, o'lcham ramkasi, o'rash, uchirish. O'quvchi ci yml'dagi uch bo'shliqni to'ldiradi va amaliyotda o'z reposiga ci yml yozadi.» · kartalar
2. **O'quvchi so'zlari: ==Yig'ish — `npm install`, Skaner — `npm test`, start signali — `on: push`==**
   Ovoz: «O'quvchi so'zlari: yig'ish bu npm install, skaner npm test, o'lcham ramkasi eslint, o'rash build, uchirish deploy. Start signali on push, yo'l xaritasi ci yml, lenta mashinasi runner. Qizil chiroq, lenta to'xtaydi, bu chiqish kodi. Sinfda so'zni atamasi bilan birga ayting.» · lug'at
3. **Siz qo'shasiz: ==`checkout` satri — o'quvchi `ci.yml`ida yo'q==; `npm ci` sababi; bitta haqiqiy run**
   Ovoz: «Darsga siz qo'shadigan narsalar. O'quvchi darsidagi ci yml'da checkout satri yo'q: amaliyotda bitta qator qo'shing, deb ayting, aks holda uning run'i o'n uchinchi ekrandagi xato bilan qizaradi. Npm si ay'ning sababini bir gapda ayting. Va bitta haqiqiy run'ni ekranda ko'rsating.» · jadval
4. **Xulosa: o'quvchi «run yo'q» desa — ==papka yo'li va push==; pastda uch vaziyat va savollar**
   Ovoz: «Xulosa: o'quvchi Actions'da run yo'q desa, avval fayl yo'lini va push'ni tekshiring. Package json topilmadi chiqsa, checkout. Workflow file issue, YAML. Pastda uch vaziyat va o'quvchi savollariga tayyor javoblar bor.» · kartalar + QA
- Manba: `src/4c-Modull/CiCdIntroLesson.jsx` (`SCREEN_META` 20, s0 qo'lda 5 qadam, s13 builder `ci.yml`, amaliyot `task`, LENTA 5 nuqta); `cicd1v2-out/12`, `16`, `17`.

## 24 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran; M48 — uzunliklar tekis):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | Sizda `npm test` yashil, hamkorda qizil. CI buni qanday hal qiladi? | Hamkorga sizning `node_modules`ingizni yuboradi · Har push'da toza mashinada bir xil buyruqlarni yurgizadi · Testlarni GitHub'ga ko'chiradi — lokalda `npm test` endi yurmaydi · Qizil testni avtomatik tuzatib qo'yadi | 2 | Toza mashina — hammaga bir xil javob. | 2 |
  | 2 | Lentada `tsc` qadami chiqish kodi 2 berdi. `npm test` qadami? | Yuradi — tur xatosi testga aloqasi yo'q · Yuradi, lekin natijasi run holatiga hisobga olinmaydi · «Skipped» — birinchi qizil qadamdan keyin yurmaydi · Yuradi, run sariq bo'lib kutadi | 3 | Nol emas — lenta to'xtaydi. | 11 |
  | 3 | Toza clone'da `npm test`: `sh: 1: jest: not found`, kod 127. Sabab? | `node_modules` yo'q — o'rnatish qadami yurmagan · Jest `package.json`da yo'q — `devDependencies`ga qo'shish kerak · Node versiyasi eski — Jest yangi · Test fayllari yo'q — Jest topmadi | 1 | Lentada birinchi qadam — `npm ci`. | 5 |
  | 4 | `ci.yml`da `actions/checkout` satri yo'q. Lentada nima bo'ladi? | YAML xatosi — GitHub faylni qabul qilmaydi · `setup-node` kodni o'zi olib keladi, yashil · `npm ci` qizil — «lock yo'q», chunki papka bo'sh · Run ochiladi, lekin hech qaysi qadam yurmaydi | 3 | Runner bo'sh papkadan boshlaydi. | 13 |
  | 5 | `package.json`da versiyani qo'lda o'zgartirdingiz, lock eskicha. Lentada `npm ci`? | O'rnatadi — `package.json` ustun · Lock'ni o'zi yangilab o'rnatadi · Qizil — «in sync» emas, mos kelmaydi · O'rnatadi, lekin terminalda ogohlantirish yozadi | 3 | `npm ci` lock'dan aynan; mos kelmasa — qizil. | 14 |
  | 6 | Tur xatosi bor, `ci.yml`da `tsc` qadami yo'q, testlar yashil. Run? | Qizil — `npm test` tur xatosini ko'radi va to'xtaydi · Yashil — lenta so'ralmagan narsani tekshirmaydi · Qizil — `setup-node` turni tekshiradi · Sariq — GitHub ogohlantiradi, kutadi | 2 | Yolg'on yashil — `tsc` qadamini qo'shing. | 15 |
  | 7 | Lokalda `npm ci` yashil, lentada `Missing: webpack… from lock file`. Birinchi nimani solishtirasiz? | `package.json`dagi `webpack` satrini · Lock faylning hajmini · `node-version` va `node --version` raqamini · `npm test` natijasini lokalda va lentada solishtirasiz | 3 | Runner'dagi npm boshqa — lock'ni boshqacha o'qiydi. | 17 |
  | 8 | AI workflow: checkout, `node-version: 22`, `npm install`, `npm test`. Nima yetishmaydi? | Hech narsa — to'rt qadam yetarli · `permissions` — usiz run ochilmaydi · Ikkinchi job — testlar va build alohida job'larda bo'lsin · Versiya meniki, `npm ci`, `tsc` va `build` qadamlari | 4 | To'rt savol: checkout · versiya · `ci` · `tsc`/`build`. | 19 |
- `passed = ball ≥ 6 && 3 amaliyot isbot bilan`.

## 25 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13.
- Xulosa 6 band:
  1. CI — har push'da toza mashinada sizning buyruqlaringiz: «menda ishlaydi» o'rniga hammaga bir xil javob. CD — tekshirilgan yukni chiqarish (Delivery: odam tasdiqlaydi · Deployment: lenta o'zi).
  2. Lenta — `npm ci` → `npx tsc --noEmit` → `npm test` → `npm run build`; har qadam chiqish kodi: 0 — yashil, boshqasi — qizil; birinchi qizildan keyin qolgani «skipped».
  3. `ci.yml` uch qism: `on` (push, pull_request) · `runs-on: ubuntu-latest` · `steps` (`uses: actions/checkout@v4`, `actions/setup-node@v4` + `run:` buyruqlar). Push → Actions → run → job → qadamlar → log.
  4. To'rt tuzoq: `checkout` yo'q (`ENOENT package.json`) · lock mos emas («in sync» — lentada `npm ci`, lokalda `npm install` + lock commit'ga) · `tsc` qadamisiz yolg'on yashil · YAML surilish / `runs-on` yo'q (run ochilmaydi).
  5. Lokalda yashil, lentada qizil — avval `node-version` ↔ `node --version`: runner'dagi npm lock'ni boshqacha o'qiydi (`Missing: webpack… from lock file`).
  6. AI workflow'i — boshlanish nuqtasi: to'rt savol (checkout · versiya meniki · `npm ci` · `tsc` va `build`), keyin push va run. CD chegarasi: `node dist/main` `.env`siz yiqiladi — secrets keyingi darsda.
- **Uyga vazifa** (M14, M30): «O'z GitHub reposingizdagi OrderBotNest nusxangizda (Amaliyot 2) lentani kengaytiring: `pull_request`da ham yursin; ikkinchi job `lint` qo'shing — `npx prettier --check "src/**/*.ts"` (OrderBotNest'da Prettier bor); README'ga lenta nishoni (badge) qo'ying: `![CI](https://github.com/<siz>/OrderBotNest/actions/workflows/ci.yml/badge.svg)`. Keyin bitta faylni ataylab noto'g'ri formatlab push qiling — `lint` job qizil, `test` job yashil bo'lsin; tuzatib push — ikkalasi yashil. Repo linkini platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | `pull_request` | `ci.yml`: `on: [push, pull_request]` | push'da run ✓ |
  | 2 | `lint` job | `jobs.lint`: checkout · setup-node · `npm ci` · `npx prettier --check "src/**/*.ts"` | ikki job: `test` ✓ · `lint` ✓ |
  | 3 | Badge | README birinchi qatoriga `![CI](…/actions/workflows/ci.yml/badge.svg)` | README'da yashil nishon |
  | 4 | Buzish | `src/api/app.controller.ts` da satrni bir qatorga yig'ib (formatni buzib) push · keyin `npx prettier --write` va push | `lint` ✗, `test` ✓ → ikkalasi ✓ |
  | 5 | Topshirish | repo linki → platformadagi uyga vazifa | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi qaraydi: `ci.yml`da ikki job · README'da badge · Actions'da kamida bitta qizil `lint` run va undan keyin yashil.
- **Eslatma:** CI/CD ta'rifi · lenta to'rt qadam + chiqish kodi · `&&` zanjiri · `ci.yml` 15 satr · push → run → job → qadam → log · to'rt tuzoq · Node versiyasi qoidasi · AI workflow'iga to'rt savol · CD chegarasi (`DATABASE_URL`, secrets) · m4c-01 lug'ati · xato qiladigan joylar · o'z uyga vazifangiz.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **GitHub Actions: run, log va namunalar** — qizil run'ni o'qish, secrets, cache, matrix».

---

## «KOD» — qurishda

**Qurishdan OLDIN yurgiziladi — 04.11:**
1. ✅ `drive-cicd1v2.sh` → `cicd1v2-out/00…08`, `03b`, `03c`; `03d` (npm 10 bilan lokal — Actions topilmasining isboti).
2. ✅ `cicd1v2-yml/1…6` — `08-yaml-tekshiruv.txt` (rasmiy tahlilchi); 04.11 18:00 `node-version` 22 → 24 (1, 2, 5, 6).
3. ✅ 17:52–17:57 `drive-cicd1v2-actions.sh` → run'lar `10…18` (`ci-sinov` + `main` `cicd1-done`), `runlar.tsv`; `10a` — node 22 bilan birinchi (qizil) run saqlanadi.
4. ✅ 17:58–17:59 `drive-cicd1v2-actions-ai.sh` → `19-ai1` ✗, `20-ai2` ✗, `21-ai1-node24` ✓; `cicd1v2-ai/ai1`, `ai2` (`.github/`, `diff.patch`, `git-status.txt`), `XULOSA.md`.
5. ✅ 16-ekran LineCheck: `4-surilish-xato.yml` 8-satr → `target` 7; GitHub javobi «workflow file issue» (`17`), tahlilchi matni `08` (✅ KOD 2). Run raqamlari/sarlavha/vaqt — `runlar-api.tsv` (gh api).
6. ⏳ `cicd1-done` tegi: GitHub'da eski commit (5bd3a38, node 22) — foydalanuvchi `git push -f origin cicd1-done` bilan ko'chiradi (skript force push qilmaydi).

**Qurish:**
1. Generator `dev/cicd1-matn.py` (jest2-matn.py dan: MD yo'li, OUT; M48 tekshiruvi ichida) · `dev/cicd1-kod.py` (jest2-kod.py + cicd2-runlar.py dan: yml'lar `cicd1v2-yml/`, AI yml'lari, chiqishlar `cicd1v2-out/0N`, GitHub run'lari `1N` → `RUNS` (job, qadam, soniya, annotatsiya, log satrlari), `PROMPT1`, `PROMPT2` = 21-ekran prompti).
2. Bo'laklar `cicd1/parts/` yangidan (v1 — `dev/cicd1-v1-parts-zaxira/`): `04-yordam.jsx` (Jest-2 dan: `Term`, `kod`, `Code`, `AiReply`, `Card`, `MC`, `mkPractice`; CI/CD-2 dan: `yamlLine`, `ActionsRun`, `RunView`, `lg`; yangi: lenta chizig'i (4 qadam), ikki mashina kartasi, CD chizig'i) · `05-s01-s07.jsx` · `06-s08-s16.jsx` · `07-s17-s25.jsx`.
3. M43: kod sahnalari 8–16 satr, haqiqiy raqamlar; natija kod tagida. M46: terminal «VS Code terminali · OrderBotNest», `$` qatori; ovozda papka · fayl · satr. M47: 10, 13, 14 — oxirgi segment sabab; 15, 17 — yonma-yon.
4. Isbotlar: 7 — `/Tests:\s+1 failed,\s+24 passed/` · 12 — `/github\.com\/[^\s\/]+\/[^\s\/]+\/actions\/runs\/\d+/` · 21 — `/tsc/i`.
5. `LESSON_ID` o'zgarmaydi (M44): `mentor-cicd-01-lenta-v1`. Jest-2 yakunidagi karta «CI/CD: testlar lentada» mos.
6. Ovoz keshi → Vercel deploy (ruxsat 04.11).
