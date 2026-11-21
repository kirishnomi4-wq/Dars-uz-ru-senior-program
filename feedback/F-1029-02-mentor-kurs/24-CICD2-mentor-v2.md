# Mentor kursi · CI/CD-2 «GitHub Actions ichida: qizil run'dan PR'gacha» — MD v2 (M41: avval mentor o'rganadi)

F-ID: F-1029-02 (CI/CD-2) · **F-1104-21** (qayta yozish) · Sana: 2026-11-04 · Holat: **QURILMOQDA 04.11** (foydalanuvchi 04.11: «to'g'ridan qurib chiqar» — MD tasdig'isiz, saytda ko'riladi) · Fidbek: qator yoniga `>> …`
Oldingi: `24-CICD2-mentor-v1.md` (01.11, o'quvchi reposi + `kirishnomi4-wq/mentor-ci-sinov`, 28 run) · **TASHLANADI**
Fayl (qayta quriladi): `src/mentor-kurs/GithubActionsMentorLesson.jsx` · bo'laklar `src/mentor-kurs/cicd2/parts/` · dvigatel — umumiy `parts/01–02` · generator `dev/cicd2-matn.py` (cicd1-matn.py dan, M48 ichida) · kod va run'lar `dev/cicd2-kod.py` (RUNS: cicd1v2-out 10/11/18 + cicd2v2-out 30–41)
Qonun: `MENTOR_DARS_ETALON.md` M1–M48 · Haqiqiy chiqishlar: **GitHub Actions run'lari** `manba/cicd1v2-out/10, 11, 18` (Actions ichi, cache) · `manba/cicd2v2-out/30–41` (matrix, smoke + Postgres, secret, PR, AI; skriptlar `drive-cicd2v2-actions.sh` PHASE=matrix/rest/secret, `…-ai.sh`, `rec-run.sh`) · yml variantlari `manba/cicd2v2-yml/` · AI `manba/cicd2v2-ai/` · o'quvchi namunasi lokal `manba/cicd2-out/01–04` (01.11)
Loyiha: **OrderBotNest** — teglar `cicd2-start` (= `cicd1-done` b842475) · `cicd2-done` (PR merge: `ci.yml` + `smoke` job, README badge) — push dars tayyor bo'lganda (ruxsat 04.11); sinov run'lari `ci-sinov`, PR tarmog'i `lenta-smoke`

**v1 → v2 nima o'zgardi (F-1104-21):**
- Misol — **OrderBotNest** (CI/CD-1 davomi): lenta bor, endi Actions'ning ichiga kiramiz. O'quvchi reposi va «Repongiz yo'qmi?» namunasi — faqat 22-ekran.
- Dars boshida **umumiy tushuncha**: Actions nima qiladi — run → job → step, GitHub o'zi qo'shadigan qadamlar, `uses` ichida nima bo'ladi (haqiqiy log).
- Yangi haqiqiy run'lar: **matrix** [22, 24] — `fail-fast` 24 ni bekor qildi (30), `fail-fast: false` — 22 qizil, 24 yashil (31) · **`services: postgres`** bilan `npm run smoke` lentada (32: `NATIJA: 5/5 ✓`) · secret nomi xato → `DATABASE_URL` bo'sh → smoke qizil (33) · secret maskasi `***` (34) · **pull request**: tarmoq → PR → `pull_request` run → merge → main (35–37), README badge · **AI** ikkala workflow birinchi urinishda yashil (40, 41) — secret ishlatmadi (to'g'ri).
- Cache haqiqati: birinchi run «Cache saved» (`npm ci` 11 s) → ikkinchisi «Cache hit» (5 s) → main'da «npm cache is not found» (tarmoq chegarasi).
- M46, M47, M48 — boshidan.

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | CI/CD-1 ni o'tgan mentor: OrderBotNest'da `ci.yml` yozgan, push'da yashil/qizil run'ni ko'rgan, to'rt tuzoqni biladi. Run ichini (log, annotatsiya, cache), matrix, services, secrets va PR tekshiruvini ko'rmagan. |
| Dars oxirida mentor | 1) run → job → step ni ajratadi, GitHub o'zi qo'shgan qadamlarni (`Set up job`, `Post …`, `Complete job`) biladi · 2) `uses` ichida nima bo'lishini logdan o'qiydi (`git init` + `fetch --depth=1`, «Found in cache», runner `ubuntu-26.04`) · 3) qizil run'da sababni annotatsiyadan emas, qadam logidan topadi · 4) `cache: npm` nima qiladi va nega main'da «not found» · 5) `matrix` yozadi, `fail-fast` nima qilishini biladi · 6) bazali tekshiruvni lentaga qo'yadi: `services: postgres` + healthcheck + `needs` · 7) `env` va `secrets` farqini biladi; secret nomi xato bo'lsa nima bo'lishini ko'rgan; maska `***` · 8) PR ochib, tekshiruv yashil bo'lgach merge qiladi; README'ga badge qo'yadi · 9) AI yozgan smoke workflow'ni to'rt savol bilan qabul qiladi · 10) sinfga: m4c-03 xaritasi, «Repongiz yo'qmi?» namunasining tuzoqlari |
| O'quvchi darsi (faqat 6-bosqich) | **m4c-03** «GitHub Actions — yo'l xaritasini yozish» (`src/4c-Modull/GithubActionsLesson.jsx`, `SCREEN_META` 23): yo'l xaritasi (`ci.yml`), ierarxiya (nuqta = job, amal = step), signal va mashina, `uses`/`run`, «Jurnaldan sababni topish», tartib (DragDrop), parallel lentalar (`matrix`), seyf (`secrets`), tablo (badge), amaliyot — o'z reposiga `ci.yml` (checkout + `npm install` + `npm test`), «Repongiz yo'qmi?» namunasi. |
| Kursdagi o'rni | CI/CD-1 → **shu** → Telegraf + PostgreSQL (M31: raqam yozilmaydi). |
| Til | M9 + M32. Atamalar inglizcha: run, job, step, log, annotation (annotatsiya), cache, matrix, fail-fast, services (xizmat konteyneri), healthcheck, secret, pull request (PR), merge, badge. O'quvchi so'zlari (nuqta, amal, parallel lentalar, seyf, tablo) — 21-ekranda. |
| Misol-ip | **OrderBotNest** `cicd1-done`: `ci.yml` (test job, 4 qadam). Yangi: `strategy.matrix` · `smoke` job (`needs: test`, `services: postgres:18`, `npm run smoke` — Telegram'siz tekshiruv: restart 3 + race 2 = 5 band) · `lenta-smoke` tarmog'i → PR → merge → main. Buzishlar: `node-version: [22, 24]` (22 — CI/CD-1 tuzog'i) · `secrets.DATABSE_URL` (harf tushib qolgan). |
| AI | 2 tajriba (ruxsat 04.11): bitta oddiy prompt (`cicd2v2-ai/p1-prompt.txt`: «…`npm run smoke` bor, unga PostgreSQL kerak (DATABASE_URL). Workflow'ga smoke'ni ham qo'shib ber»), `ai1` kuchli, `ai2` kuchsizroq; ikkalasi haqiqiy lentada (`40`, `41`) — yashil. |
| Haqiqiylik (M10) | 04.11 17:51–19:2x: runner `ubuntu-latest` = **Ubuntu 26.04** (`Image: ubuntu-26.04`, runner 2.338.2), `actions/checkout@v4`, `setup-node@v4` (Node 24.22.1, npm 11.19.1); har run job/step/annotatsiya/log API'dan; cache kaliti haqiqiy (`node-cache-Linux-x64-npm-ccb2…`); smoke chiqishi `NATIJA: 5/5 ✓`. YAML — `@actions/workflow-parser` (`08`). |
| Hajm | **25 ekran** · 6 bosqich · 3 amaliyot · 4 tekshiruv · 8 savol · ovoz ≈ 25 daq · amaliyot ≈ 50–65 daq · jami ≈ 1 s 15 – 1 s 30 daq |
| Me'yor | CI/CD-1 v2 bilan bir xil (≤ 5 segment, ≤ 60 so'z, M17 ko'prik, «Xulosa», kalit 8–14 so'z, M32, M33, M42, M43, M46, M47, M48) |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **run → job → step** — har push bitta run; `jobs:` ostidagi har nom bitta job (alohida mashina); job ichida qadamlar. GitHub o'zi qo'shadi: `Set up job` (mashina, ruxsatlar, action'larni yuklab olish), `Post Run …` (tozalash, cache saqlash), `Complete job`.
- **`uses` ichida** — `checkout`: papkani tozalab `git init`, `fetch --depth=1` (faqat oxirgi commit); `setup-node`: «Found in cache @ …/node/24.22.1» (runner'dagi tayyor Node), `npm config get cache` → cache tiklash.
- **annotatsiya va log** — annotatsiya run sahifasidagi qisqa satr (`Process completed with exit code 2.`, tsc xatosining birinchi qatori); sabab — qizil qadamning logida (butun chiqish).
- **cache** — `setup-node` `cache: npm`: birinchi run'da «npm cache is not found» → oxirida «Cache saved with the key: node-cache-Linux-x64-npm-<lock hash>»; keyingi run «Cache hit for: …» → `npm ci` 11 s → 5 s. Cache **tarmoqqa bog'liq**: `ci-sinov`da saqlangan cache `main`da yo'q («not found»).
- **matrix** — bitta job ta'rifi, bir nechta qiymat: `strategy.matrix.node-version: [22, 24]` → `test (22)`, `test (24)` — parallel. **fail-fast** (odatiy `true`): bittasi yiqilsa qolgani bekor qilinadi («The strategy configuration was canceled because "test._22" failed»); `fail-fast: false` — hammasi oxirigacha.
- **services** — job yonida konteyner: `postgres:18`, `POSTGRES_PASSWORD`, `POSTGRES_DB: shop`, `ports: 5432:5432`, healthcheck `pg_isready` — baza tayyor bo'lmaguncha qadamlar boshlanmaydi (`Initialize containers` qadami). Job tugashi bilan o'chadi (`Stop containers`).
- **`needs`** — `smoke` job `needs: test`: test qizil bo'lsa smoke boshlanmaydi (Postgres ko'tarilmaydi).
- **`env` va `secrets`** — konteyner paroli sir emas → `env:` (yml'da ochiq). Tashqi resurs (prod baza, bot token) → GitHub Secrets: yml'da `${{ secrets.NOM }}`, logda `***`. Secret **nomi xato** bo'lsa xato chiqmaydi — qiymat bo'sh, dastur o'zi yiqiladi («DATABASE_URL topilmadi»).
- **pull request** — tarmoq → PR → `pull_request` run; PR sahifasida tekshiruv (checks) yashil/qizil; merge → main'da yana run. Badge: `actions/workflows/ci.yml/badge.svg` — README'da lenta holati.
- **smoke lentada** — unit test bazasiz (Jest-2), smoke bazali (TgPg): `npm run smoke` `shop_smoke` bazasini ochadi, restart va race'ni sinaydi, `NATIJA: 5/5 ✓`, chiqish kodi 0 / 1 / 2.

**Darsning ipi:** Actions nima qiladi → `uses` ichida (haqiqiy log) → qizilni o'qish: annotatsiya vs log → cache → matrix va fail-fast → smoke lentada: services, needs → env vs secrets, nomi xato → PR va badge → AI workflow'lari → sinfga tayyorgarlik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich | Run |
|---|---|---|---|---|
| 1 | Kirish | Lesson | — | 37 |
| 2 | Actions nima qiladi: run → job → step, GitHub qo'shgan qadamlar | Lesson | 1 · umumiy tushuncha | 10 |
| 3 | `uses` ichida: Set up job, checkout, setup-node loglari | Lesson | 1 | 10 |
| 4 | Qizil run'ni o'qish: annotatsiya qisqa, sabab — qadam logida | Lesson | 2 · qizilni o'qish | 15, 11 |
| 5 | Tekshiruv 1 — annotatsiya «exit code 1» | MCRetry | 2 | 11 |
| 6 | Cache: saqlandi → tiklandi → main'da yo'q | Lesson | 2 | 10, 11, 18 |
| 7 | Amaliyot 1 — o'z run'ingizni o'qish | Practice | 2 | — |
| 8 | matrix: bitta fayl, ikki Node — fail-fast 24 ni bekor qildi | Lesson | 3 · matrix | 30 |
| 9 | fail-fast: false — 22 qizil, 24 yashil | Lesson | 3 | 31 |
| 10 | Tekshiruv 2 — fail-fast | MCRetry | 3 | 30 |
| 11 | Amaliyot 2 — matrix o'z reposida | Practice | 3 | — |
| 12 | Smoke lentada: bazali tekshiruvga baza qayerdan — services | Lesson | 4 · smoke va secret | — |
| 13 | `services: postgres` + `needs: test` — smoke job yashil | Lesson | 4 | 32 |
| 14 | DATABASE_URL qayerdan: env (konteyner) va secrets (tashqi); nomi xato → bo'sh | Lesson | 4 · ichida | 33, 34 |
| 15 | Tekshiruv 3 — qaysi satr smoke'ni bazasiz qoldiradi | LineCheck | 4 | 33 |
| 16 | Pull request: lenta merge'dan oldin tekshiradi; badge | Lesson | 5 · PR va AI | 35, 36, 37 |
| 17 | AI smoke workflow yozdi — ikki to'plam, ikkalasi yashil | Lesson | 5 · AI | 40, 41 |
| 18 | AI'ni qabul qilish: to'rt savol; tayanch to'g'ri — AI ham to'g'ri | Lesson | 5 · ichida | 40, 41 |
| 19 | Tekshiruv 4 — konteyner uchun secret kerakmi | MCRetry | 5 | — |
| 20 | Amaliyot 3 — smoke job, PR, merge, badge | Practice | 5 | — |
| 21 | m4c-03 xaritasi: o'quvchi so'zlari | Lesson | 6 · sinfga tayyorgarlik | — |
| 22 | «Repongiz yo'qmi?» namunasi va simulyatsiya — sinfdagi tuzoqlar | Lesson | 6 | lokal 01–04 |
| 23 | Siz qo'shasiz, xato qiladigan joylar, o'quvchi so'rasa | Lesson | 6 | — |
| 24 | O'z-sinov — 8 savol | Screen27 | — | |
| 25 | Yakun | Screen28 | — | |

**Sahna turlari:** GitHub Actions run oynasi (`RunView` — CI/CD-1 dan: job ro'yxati chapda, qadamlar, log, annotatsiya; endi **ko'p job** — matrix, smoke), PR sahifasi kartasi (`gh pr view`/`gh pr checks` ma'lumotidan), VS Code `OrderBotNest` (`.github/workflows/ci.yml`, `README.md`, `scripts/smoke.js`), terminal, ikki karta (env ↔ secrets), cache zanjiri (saqlandi → tiklandi → yo'q), AI javobi kartasi.

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · CI/CD` · Sarlavha: **Lenta bor va yashil. Bugun uning ichiga kiramiz: log, cache, matrix, Postgres bilan smoke, secret va pull request — hammasi haqiqiy run'larda**
- Sahna: chapda reja (6 bosqich); o'ngda GitHub run oynasi — dars oxiridagi natija (run `37`, `main`, PR merge): ikki job `test` ✓ va `smoke` ✓ (`Initialize containers` · `npm run smoke`).
- Reja: 01 Umumiy tushuncha · 02 Qizilni o'qish va cache · 03 matrix · 04 Smoke va secret · 05 PR va AI · 06 Sinfga tayyorgarlik
1. **CI/CD-1 da lenta yozdingiz — bugun ==Actions'ning ichiga== kiramiz, hammasi haqiqiy run'larda**
   Ovoz: «Assalomu alaykum. Oldingi darsda OrderBotNest'ga lenta yozdingiz: har push'da to'rt qadam. Bugun shu lentaning ichiga kiramiz. Ekranda dars oxiridagi natija: ikkita job, test va smoke, smoke haqiqiy Postgres bilan, ikkalasi yashil.»
2. **Avval ==umumiy tushuncha==: run, job, step va GitHub o'zi qo'shadigan qadamlar**
   Ovoz: «Avval umumiy tushuncha: Actions nima qiladi, run, job va step nima, GitHub o'zi qaysi qadamlarni qo'shadi va uses ichida nima bo'ladi. Keyin qizil run'ni to'g'ri o'qishni va cache nima qilishini ko'rasiz.» · reja 01–02
3. **Keyin ==matrix, Postgres xizmati bilan smoke, secret va pull request==**
   Ovoz: «Uchinchi bosqichda matrix: bitta fayl, ikki Node. To'rtinchisida bazali tekshiruvni lentaga qo'yamiz: Postgres xizmati va smoke. Secret nima va nomi xato bo'lsa nima bo'ladi. Beshinchisida pull request va AI yozgan workflow'lar. Oxirida sinfga tayyorgarlik.» · reja 03–06
4. **Olti bosqich, uchta amaliyot — ==o'z GitHub reponingizda==; har run haqiqiy**
   Ovoz: «Dars olti bosqich, uchta amaliyot, hammasi CI/CD-1 dagi o'z reponingizda. Ekrandagi har run haqiqiy: OrderBotNest'da shu kuni yurgizilgan, qadam va soniyalari o'sha. Shoshilmang, har ekranni boshidan eshitish mumkin. Boshlaymiz.» · reja 06
- Manba: `cicd2v2-out/37-main-merge.txt`.

## 2 · Actions nima qiladi: run → job → step, GitHub qo'shgan qadamlar  ← `Lesson`
- Kicker: `1-bosqich · umumiy tushuncha` · Sarlavha: **Har push — run; faylda `jobs:` ostidagi har nom — alohida mashinada bitta job; job ichida qadamlar; uchtasini GitHub o'zi qo'shadi**
- Sahna: chapda `ci.yml` (`cicd2-start`, 15 satr) — `jobs:` / `test:` / `steps:` yoritiladi; o'ngda run `10` oynasi: job `test`, qadamlar **hammasi** (Post'lar bilan): `Set up job` · `Run actions/checkout@v4` · `Run actions/setup-node@v4` · `Run npm ci` · `Run npx tsc --noEmit` · `Run npm test` · `Run npm run build` · `Post Run actions/setup-node@v4` · `Post Run actions/checkout@v4` · `Complete job`; 3-segmentda GitHub qo'shgan uchtasi yoritiladi; 4-segmentda uch so'z kartasi: run · job · step.
1. **Run — bitta push; ==job — faylda `jobs:` ostidagi har nom==, har biri alohida mashinada**
   Ovoz: «Actions'ni boshidan tushunib olaylik. Har push bitta run. Faylda jobs ostida bitta nom bor, test, demak bitta job. Job bu alohida mashina: ikki nom yozsangiz, ikki mashina parallel ochiladi. Shuni matrix va smoke'da ko'rasiz.» · yml `jobs:`
2. **Step — job ichidagi qadam: ==har `uses` va `run` — bitta «Run …» qatori==**
   Ovoz: «Job ichida qadamlar: faylda steps ostida nechta uses va run bo'lsa, run oynasida shuncha Run qatori. Checkout, setup node, to'rtta buyruq. Har qatorning yonida belgi va soniya, bossangiz, log.» · steps ↔ qadamlar
3. **Uchtasini siz yozmadingiz: ==`Set up job`, `Post Run …`, `Complete job`== — GitHub o'zi qo'shadi**
   Ovoz: «Lekin ro'yxatda siz yozmagan qatorlar ham bor. Boshida set up job: mashinani tayyorlash. Oxirida post run, ya'ni tozalash, cache saqlash, va complete job. GitHub ularni har job'ga o'zi qo'shadi. Ularning logida foydali narsalar bor, hozir ko'ramiz.» · GitHub qo'shganlari
4. **Xulosa: ==run → job → step==; qizil bo'lsa — qaysi job, qaysi qadam, uning logi**
   Ovoz: «Xulosa: run, job, step. Run yashil yoki qizil. Qizil bo'lsa qaysi job, qaysi qadam, deb pastga tushasiz va o'sha qadamning logini o'qiysiz. Endi GitHub qo'shgan qadamlarning ichiga qaraymiz.» · uch karta
- Manba: `cicd1v2-out/10-yashil.txt` (job/qadamlar API'dan, aynan), `cicd2-start` `ci.yml`.

## 3 · `uses` ichida: Set up job, checkout, setup-node loglari  ← `Lesson`
- Kicker: `1-bosqich · umumiy tushuncha` · Sarlavha: **Tayyor qadamlar yashirin emas: `Set up job` mashinani aytadi, `checkout` bo'sh papkada `git init` va `fetch --depth=1` qiladi, `setup-node` tayyor Node'ni topadi**
- Sahna: run `10` oynasi, uch qadam logi galma-gal: `Set up job`: `Current runner version: '2.338.2'` · `Image: ubuntu-26.04` · `GITHUB_TOKEN Permissions` `Contents: read` · `Download action repository 'actions/checkout@v4' (SHA:11d5960…)` · `… 'actions/setup-node@v4'` → `Run actions/checkout@v4`: `Syncing repository: Azizbekcrypto/OrderBotNest` · `Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'` · `/usr/bin/git init …` · `git … fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +ef9e667…` → `Run actions/setup-node@v4`: `node-version: 24` · `cache: npm` · `Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64` · `node: v24.22.1` · `npm: 11.19.1`.
1. **`Set up job` logi: ==runner `ubuntu-26.04`, token ruxsati `Contents: read`==, action'lar yuklab olinadi**
   Ovoz: «Run'ni oching, set up job qadamini bosing. Mashina: image ubuntu yigirma olti nol to'rt. Ubuntu latest endi shu, oktabrdan o'zgardi. GitHub token ruxsati: contents read, faqat o'qiydi. Keyin download action repository: checkout va setup node tayyor qadamlari yuklab olinadi, SHA bilan.» · Set up job
2. **`checkout` ichida: ==papkani tozalaydi, `git init`, `fetch --depth=1`== — faqat oxirgi commit**
   Ovoz: «Checkout qadamini bosing. Syncing repository, keyin deleting the contents: papka tozalanadi. Git init: bo'sh repo. Git fetch depth bir: faqat oxirgi commit olinadi, butun tarix emas, tez bo'lsin. Mana nega CI/CD-1 da checkout'siz papka bo'sh edi.» · checkout
3. **`setup-node` ichida: ==«Found in cache» — runner'da tayyor Node 24.22.1, npm 11.19.1==**
   Ovoz: «Setup node: node version yigirma to'rt, cache npm. Found in cache: runner'da Node yigirma to'rt allaqachon bor, yuklab olinmadi. Node v yigirma to'rt yigirma ikki bir, npm o'n bir o'n to'qqiz. CI/CD-1 dagi tuzoq shu yerda ko'rinadi: versiya raqamini log aytadi.» · setup-node
4. **Xulosa: ==`uses` — boshqalar yozgan skript==, logi ochiq; mashina, versiya, ruxsat — shu yerda**
   Ovoz: «Xulosa: uses yashirin narsa emas, boshqalar yozgan skript, logi ochiq. Mashina qaysi, Node qaysi, token nimaga ruxsatli, hammasi shu uch qadamning logida. Xato tushunarsiz bo'lsa, avval shu yerga qarang. Endi qizil run'ni o'qiymiz.» · xulosa
- Manba: `cicd1v2-out/10-yashil.txt` logi (`Set up job`, `Run actions/checkout@v4`, `Run actions/setup-node@v4` — aynan).

---

## 4 · Qizil run'ni o'qish: annotatsiya qisqa, sabab — qadam logida  ← `Lesson`
- Kicker: `2-bosqich · qizilni o'qish` · Sarlavha: **Run sahifasidagi annotatsiya — xatoning birinchi satri; to'liq sabab qizil qadamning logida: `tsc` run'ida uchta annotatsiya, logda sakkiz satr**
- Sahna: run `15` (tsc qizil): annotatsiyalar (3): `Process completed with exit code 2.` · `No overload matches this call.` · `Type '{ telegram_id: number; }' is not assignable to type 'FindOptionsWhere<User> | …'`; qadam `Run npx tsc --noEmit` ✗ logi: `##[error]src/api/user/user.service.ts(20,42): error TS2322: …` · `Types of property 'telegram_id' are incompatible.` · `Type 'number' is not assignable to type 'string | …'` · `##[error]src/api/user/user.service.ts(22,33): error TS2769: …`; 3-segmentda run `11` (test qizil): annotatsiya faqat `Process completed with exit code 1.`, log: `FAIL …order.service.spec.ts` · `● … chegara` · `Kolonka: omborda faqat 2 ta qoldi` · `> 37 |`; 4-segmentda o'qish tartibi kartasi: belgi → qizil job → qizil qadam → log → `##[error]` satri.
1. **Run sahifasining yuqorisi — ==annotatsiyalar==: `##[error]` bilan boshlangan satrlar, qisqa**
   Ovoz: «Qizil run'ni oching, CI/CD-1 dagi tsc run'i. Yuqorida annotations: uchta satr. Process completed with exit code two, no overload matches this call, va tur xatosining birinchi qatori. Bular logdagi error belgisi bilan boshlangan satrlar, GitHub ularni yuqoriga chiqaradi.» · annotatsiyalar
2. **To'liq sabab — ==qizil qadamning logida==: fayl, satr, ustun, ikki xato, nima nimaga mos emas**
   Ovoz: «Lekin annotatsiya qisqa. Qizil qadamni bosing: npx tsc. Logda hammasi: user service ts, yigirmanchi satr, qirq ikkinchi ustun, TS ikki uch ikki ikki, number string'ga mos emas, va yigirma ikkinchi satrda ikkinchi xato. Sabab shu yerda, annotatsiyada emas.» · log
3. **Test qizil run'ida annotatsiya ==faqat «exit code 1»== — Jest xatosi logda: FAIL, qaysi test, qaysi satr**
   Ovoz: «Test qizil bo'lgan run'da annotatsiya yanada kam: faqat process completed with exit code one. Jest error belgisi bilan yozmaydi. Qaysi test, nima kutilgan, nima keldi, o'ttiz yettinchi satr, hammasi npm test qadamining logida. Annotatsiya sizga faqat qaysi qadam ekanini aytadi.» · run 11
4. **Xulosa: ==belgi → qizil job → qizil qadam → log==; annotatsiya yo'l ko'rsatadi, sabab logda**
   Ovoz: «Xulosa: qizil run'ni o'qish tartibi: belgi, qizil job, qizil qadam, uning logi. Annotatsiya yo'l ko'rsatkich, sabab logda. O'quvchi lentam qizil, nima qilay desa, shu to'rt qadamni birga bosing. Endi tekshirib olaylik.» · tartib kartasi
- Manba: `cicd1v2-out/15-tsc-bor-qizil.txt` (annotatsiyalar 3, log), `11-test-qizil.txt` (annotatsiya 1, log) — aynan.

## 5 · Tekshiruv 1 — annotatsiya «exit code 1»  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Run qizil. Annotatsiyada faqat `Process completed with exit code 1.` — `npm test` qadamida. Sababni qayerdan o'qiysiz?**
- Material (`above`, M42): run `11` oynasi: annotatsiya `Process completed with exit code 1.`; qadamlar `npm ci` ✓ · `tsc` ✓ · **`npm test` ✗** · `build` skipped (log yopiq).
- Ovoz: «Qizil run'ni o'qishni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Run qizil, annotatsiyada faqat process completed with exit code one, npm test qadamida. Qaysi test yiqilganini qayerdan o'qiysiz? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 Annotatsiyani bosib — u to'liq xatoni ochadi · 2 `npm test` qadamini bosib — logda FAIL va test nomi · 3 `Set up job` logidan — u hamma xatoni yig'adi · 4 Commit'ni lokalda qayta yurgizib — GitHub logi to'liq emas
- To'g'ri (ovoz): «To'g'ri. Qizil qadamni bosasiz: npm test. Logda Jest'ning to'liq chiqishi: FAIL, qaysi test, kutilgan va kelgan, o'ttiz yettinchi satr. Annotatsiya faqat qadamni ko'rsatdi, chunki Jest error belgisi bilan yozmaydi. Demak, annotatsiya manzil, log esa sabab; lokalda qayta yurgizish shart emas.» · qisqa: «Qizil qadam logi — to'liq Jest chiqishi. Annotatsiya — faqat manzil.»
- Isbot (`after`): run `11` `npm test` logi: `FAIL src/api/order/order.service.spec.ts` · `● OrderService.place › chegara…` · `Kolonka: omborda faqat 2 ta qoldi` · `Tests: 1 failed, 24 passed, 25 total`.
- Demak: «Annotatsiya — manzil (qaysi qadam); sabab — qizil qadamning logida. Jest xatosi annotatsiyaga chiqmaydi.»
- Xato izohlari: 1 — «Annotatsiya qisqa satr, ochilmaydi — Jest uchun faqat «exit code 1».» · 3 — «`Set up job` — mashina va ruxsatlar; qadam xatolari u yerda yo'q.» · 4 — «GitHub logi — terminalingizdagi to'liq matn; lokalda qayta yurgizish shart emas.»
- Maslahat: «4-ekrandagi tartib: belgi → job → qadam → ?»
- Manba: `cicd1v2-out/11-test-qizil.txt`.

## 6 · Cache: saqlandi → tiklandi → main'da yo'q  ← `Lesson`
- Kicker: `2-bosqich · cache` · Sarlavha: **`cache: npm` nima qiladi: birinchi run «Cache saved», ikkinchisi «Cache hit» — `npm ci` 11 s → 5 s; `main`da esa «not found»: cache tarmoqqa bog'liq**
- Sahna: cache zanjiri uch karta: run `10` (`ci-sinov`, birinchi): `setup-node` logi `npm cache is not found` → `Post Run actions/setup-node@v4`: `Cache saved with the key: node-cache-Linux-x64-npm-ccb2b15d…` · `npm ci` **11 s** → run `11` (`ci-sinov`, ikkinchi): `Cache hit for: node-cache-Linux-x64-npm-ccb2b15d…` · `npm ci` **5 s** → run `18` (`main`, birinchi): `npm cache is not found` · `npm ci` **11 s**; 4-segmentda kalit tarkibi: `node-cache` · `Linux-x64` · `npm` · lock faylning hash'i.
1. **`setup-node` `cache: npm` — birinchi run'da ==«npm cache is not found»==, oxirida «Cache saved with the key»**
   Ovoz: «Ci yml'dagi cache npm satri nima qiladi? Birinchi run'ning setup node logida: npm cache is not found, cache yo'q. Oxirida, post run setup node qadamida: cache saved with the key, node cache, Linux, npm va uzun raqam. Npm si ay o'n bir soniya yurdi.» · run 10
2. **Ikkinchi run: ==«Cache hit» — `npm ci` 11 soniyadan 5 ga tushdi==; kalit — lock faylning hash'i**
   Ovoz: «Ikkinchi run, o'sha tarmoq: cache hit for, o'sha kalit. Npm si ay besh soniya: paketlar internetdan emas, saqlangan cache'dan. Kalitdagi uzun raqam package lock json'ning hash'i: lock o'zgarsa, kalit o'zgaradi, cache qaytadan yig'iladi. Shuning uchun lock commit'da bo'lishi kerak.» · run 11
3. **`main`dagi birinchi run: yana ==«not found»== — cache tarmoqqa bog'liq, `ci-sinov`niki `main`ga o'tmaydi**
   Ovoz: «Endi main tarmog'idagi birinchi run: yana npm cache is not found, npm si ay yana o'n bir soniya. Cache tarmoqqa bog'liq: ci sinov tarmog'ida saqlangani main'ga o'tmaydi. Main'da bir marta yashil bo'lgach, undan keyingi run'lar va tarmoqlar o'sha cache'ni oladi.» · run 18
4. **Xulosa: ==cache — tezlik, to'g'rilik emas==; «not found» xato emas, «hit» — lock o'zgarmagan degani**
   Ovoz: «Xulosa: cache tezlik uchun, to'g'rilik uchun emas: cache bo'lmasa ham lenta to'g'ri ishlaydi, faqat sekinroq. Logda not found ko'rsangiz, bu xato emas. Hit ko'rsangiz, lock o'zgarmagan. Endi o'z run'ingizni o'qiysiz.» · kalit
- Manba: `cicd1v2-out/10-yashil.txt` (setup-node, Post setup-node), `11-test-qizil.txt` (Cache hit), `18-main-yashil.txt` (not found); `npm ci` soniyalari API'dan.

## 7 · Amaliyot 1 — o'z run'ingizni o'qish  ← `Practice`
- Kicker: `Amaliyot 1 / 3` · Eyebrow: `Hozir o'zingizda · 12 daqiqa` · Sarlavha: **CI/CD-1 dagi reponingizda ikki run'ni oching: `Set up job`, `checkout`, cache «saved» va «hit», `npm ci` soniyalari** · `tableAt: 3`
1. **Endi siz: ==o'z reponingizdagi oxirgi ikki run==, uchta log va cache**
   Ovoz: «Endi navbat sizga. CI/CD-1 dagi reponingizni GitHub'da oching, Actions bo'limi. Oxirgi ikki run'ni o'qiysiz: set up job, checkout, setup node loglari va cache. Push kerak emas, faqat o'qish. O'n ikki daqiqa ketadi.»
2. **1–2-qadam: ==`Set up job`da mashina va ruxsat==, `checkout`da `git init` va `fetch --depth=1`**
   Ovoz: «Birinchi qadamda oxirgi run'ni ochib, set up job logidan image va GITHUB TOKEN ruxsatini topasiz. Ikkinchisida checkout logidan git init va fetch depth bir satrlarini. Uchinchi ekrandagi bilan solishtiring.»
3. **3–4-qadam: ==ikki run'da cache: «saved» va «hit»==, `npm ci` soniyalari; isbot — hit satri**
   Ovoz: «Uchinchi qadamda eski run'ning post run setup node logida cache saved, yangisida setup node logida cache hit satrini topasiz. To'rtinchisida ikkala run'da npm si ay necha soniya yurganini yozib oling. Isbot maydoniga cache hit satrini nusxalang.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz run'ning har qadamini ochib o'qiy olasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | `Set up job` | GitHub → Actions → oxirgi run → job `test` → `Set up job` | `Image: ubuntu-…` · `GITHUB_TOKEN Permissions` · `Download action repository` |
  | 2 | `checkout` | `Run actions/checkout@v4` logi | `Deleting the contents of` · `git init` · `fetch … --depth=1` |
  | 3 | Cache | eski run → `Post Run actions/setup-node@v4` · yangi run → `Run actions/setup-node@v4` | `Cache saved with the key: node-cache-…` · `Cache hit for: node-cache-…` |
  | 4 | Soniyalar | ikkala run'da `Run npm ci` yonidagi soniya | ikkinchisi kamroq |
- Isbot: «Yangi run'dagi «Cache hit» satri» · placeholder: «masalan: Cache hit for: node-cache-Linux-x64-npm-…» · KOD: `/Cache hit for: node-cache-/i` · xato: «`Run actions/setup-node@v4` logidagi `Cache hit for: node-cache-…` satrini qo'ying.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Ikkala run'da `npm cache is not found` | ikkinchi run boshqa tarmoqda yoki `cache: npm` satri yo'q — bir tarmoqda ketma-ket ikki run bo'lsin |
  | `Cache saved` yo'q | run qizil tugagan — `Post Run` cache'ni faqat `npm ci` o'tganda saqlaydi; yashil run'ni oching |
  | Log ochilmaydi (bo'sh) | run hali yuryapti yoki 90 kundan eski — yangi push qiling |
  | `Image: ubuntu-24.04` chiqdi | runner surati sanaga qarab farq qiladi — xato emas, raqamni yozing |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `cicd1v2-out/10`, `11`, `18`.

---

## 8 · matrix: bitta fayl, ikki Node — fail-fast 24 ni bekor qildi  ← `Lesson`
- Kicker: `3-bosqich · matrix` · Sarlavha: **`strategy.matrix.node-version: [22, 24]` — bitta job ta'rifi, ikki mashina: `test (22)` qizil, `test (24)` esa… bekor qilindi — fail-fast**
- Sahna: `ci.yml` (`1-matrix.yml`, 18 satr): 6–8 `strategy:` `matrix:` `node-version: [22, 24]` · 13 `node-version: ${{ matrix.node-version }}`; run `30` oynasi: ikki job — `test (22)` ✗ (`npm ci` ✗, 10 s) · `test (24)` ⊘ cancelled (22 s; `npm ci` ✓, `tsc` yurayotganda to'xtatildi); annotatsiya: `The strategy configuration was canceled because "test._22" failed`; 4-segmentda fail-fast kartasi.
1. **Matrix: ==`strategy.matrix` — bitta job, bir nechta qiymat==; `${{ matrix.node-version }}` har mashinaga o'z raqami**
   Ovoz: «Matrix bilan boshlaymiz. Ci yml'da job ostiga strategy, matrix, node version, qavsda yigirma ikki va yigirma to'rt. Setup node'da esa raqam o'rniga matrix node version. Bitta job ta'rifi, GitHub undan ikki mashina ochadi: test yigirma ikki va test yigirma to'rt, parallel.» · yml 6–8, 13
2. **Run: ==`test (22)` qizil — `npm ci`, o'sha lock tuzog'i==; `test (24)` «cancelled»**
   Ovoz: «Push, run. Chapda ikki job. Test yigirma ikki qizil: npm si ay, CI/CD-1 dagi o'sha tuzoq, missing webpack from lock file. Test yigirma to'rt esa yashil ham, qizil ham emas: cancelled, bekor qilindi, yigirma ikkinchi soniyada, tsc yurayotganda.» · run 30
3. **Demak, sabab: ==fail-fast — bittasi yiqilsa qolganini bekor qiladi== (odatiy sozlama)**
   Ovoz: «Demak, sabab annotatsiyada: the strategy configuration was canceled because test yigirma ikki failed. Bu fail fast: matrix'da bitta mashina yiqilsa, GitHub qolganini bekor qiladi, vaqt va mashina tejaydi. Odatiy sozlama shu. Lekin siz yigirma to'rtda nima bo'lganini bilmay qolasiz.» · fail-fast kartasi
4. **Xulosa: ==matrix mashinani emas, versiyani sinaydi==; natija to'liq kerak bo'lsa — `fail-fast: false`**
   Ovoz: «Xulosa: matrix bitta kodni bir nechta versiyada sinaydi. Fail fast tez, lekin javobi chala: yigirma to'rt yashilmi, bilmadik. To'liq javob kerak bo'lsa, fail fast false. Keyingi run'da shuni qo'yamiz.» · xulosa
- Manba: `cicd2v2-out/30-matrix-fail-fast.txt` (ikki job, annotatsiya — aynan), `cicd2v2-yml/1-matrix.yml`.

## 9 · fail-fast: false — 22 qizil, 24 yashil  ← `Lesson`
- Kicker: `3-bosqich · matrix` · Sarlavha: **`fail-fast: false` — ikkala mashina oxirigacha: `test (22)` qizil, `test (24)` yashil; run qizil, lekin javob to'liq: kod 24 da ishlaydi, 22 da lock o'qilmaydi**
- Sahna: `ci.yml` (`2-matrix-fail-fast-false.yml`) 6–9 `strategy:` `fail-fast: false` `matrix:` …; run `31`: `test (22)` ✗ (`npm ci` ✗) · `test (24)` ✓ (to'rt qadam ✓, 25 s); 3-segmentda `test (22)` `npm ci` logi: `Missing: webpack@5.112.2 from lock file`; 4-segmentda matrix nima uchun kartasi: kutubxona (bir nechta Node) ↔ ilova (bitta Node — mashinadagi).
1. **`fail-fast: false` — ==ikkala mashina oxirigacha yuradi==, run baribir qizil (22 yiqildi)**
   Ovoz: «Strategy ostiga fail fast false qo'shamiz. Push. Endi ikkala job oxirigacha yurdi: test yigirma ikki qizil, test yigirma to'rt yashil, to'rtala qadam. Run umuman qizil, chunki bittasi yiqildi, lekin javob to'liq.» · run 31
2. **22 ning logi — ==CI/CD-1 dagi o'sha xato==: npm 10 lock'ni o'qiy olmaydi; 24 — hammasi yashil**
   Ovoz: «Yigirma ikkining npm si ay logi: missing webpack from lock file, CI/CD-1 o'n yettinchi ekrandagi xato. Yigirma to'rt: npm si ay, tsc, test, build, hammasi yashil. Matrix sizga aniq aytdi: bu loyiha Node yigirma to'rtda ishlaydi, yigirma ikkida lock o'qilmaydi.» · log
3. **Matrix kimga kerak: ==kutubxona yozsangiz — ha==, bot yoki sayt — mashinangizdagi bitta Node yetadi**
   Ovoz: «Matrix kimga kerak? Kutubxona yozsangiz, uni har xil Node'da ishlatishadi, matrix shart. OrderBotNest kabi bot yoki sayt bitta serverda, bitta Node'da yuradi: mashinangizdagi raqam yetadi. O'quvchi darsida matrix parallel lentalar deb chizilgan, uchta Node.» · karta
4. **Xulosa: ==matrix — bir nechta versiya, parallel==; `fail-fast` tez, `false` — to'liq javob**
   Ovoz: «Xulosa: matrix bitta faylni bir nechta versiyada parallel sinaydi. Fail fast tez to'xtatadi, false to'liq javob beradi. Loyihangizga kerak bo'lsa qo'ying, bo'lmasa bitta Node, mashinangizdagi. Endi tekshirib olaylik.» · xulosa
- Manba: `cicd2v2-out/31-matrix-ikkalasi.txt` (aynan), `cicd2v2-yml/2-matrix-fail-fast-false.yml`.

## 10 · Tekshiruv 2 — fail-fast  ← `MCRetry`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4`
- Sarlavha: **matrix `[22, 24]`, `fail-fast` yozilmagan. `test (22)` 10-soniyada yiqildi, `test (24)` hali `tsc`da. `test (24)` bilan nima bo'ladi?**
- Material (`above`): yml 6–8 (`strategy:` `matrix:` `node-version: [22, 24]` — `fail-fast` yo'q); ostida run `30` jobs: `test (22)` ✗ 10 s · `test (24)` ? 22 s.
- Ovoz: «Matrix'ni ko'rdingiz, endi tekshirib olaylik. Ikkinchi tekshiruv. Matrix yigirma ikki va yigirma to'rt, fail fast yozilmagan. Test yigirma ikki o'ninchi soniyada yiqildi, test yigirma to'rt hali tsc'da. Yigirma to'rt bilan nima bo'ladi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Oxirigacha yuradi — matrix job'lari bir-biriga bog'liq emas · 2 Oxirigacha yuradi, lekin natijasi run'ga kirmaydi · 3 Bekor qilinadi — odatiy `fail-fast` qolganini to'xtatadi · 4 Qayta boshlanadi — GitHub 22 ning o'rniga 24 ni ishlatadi
- To'g'ri (ovoz): «To'g'ri. Fail fast yozilmasa, u true: bitta mashina yiqilishi bilan GitHub qolganini bekor qiladi, cancelled. Yigirma to'rt tsc'da to'xtatildi, natijasi noma'lum. To'liq javob kerak bo'lsa, fail fast false yoziladi. Demak, matrix'da cancelled ko'rsangiz, bu o'sha job'ning xatosi emas, boshqasining yiqilgani.» · qisqa: «`fail-fast` odatiy `true` — bittasi yiqilsa qolgani «cancelled». To'liq javob — `fail-fast: false`.»
- Isbot (`after`): run `30` annotatsiyasi: `The strategy configuration was canceled because "test._22" failed` + jobs `test (24)` cancelled.
- Demak: «matrix'da «cancelled» — o'sha job'ning xatosi emas: boshqa job yiqildi, `fail-fast` to'xtatdi.»
- Xato izohlari: 1 — «matrix job'lari bitta strategy'ga bog'langan — `fail-fast` ularni birga boshqaradi.» · 2 — «Yurmaydi: 22-soniyada «cancelled», `tsc` tugamadi.» · 4 — «GitHub mashinani almashtirmaydi; har qiymat — o'z mashinasi.»
- Maslahat: «8-ekrandagi annotatsiya: «canceled because … failed» — kim kimni to'xtatdi?»
- Manba: `cicd2v2-out/30-matrix-fail-fast.txt`.

## 11 · Amaliyot 2 — matrix o'z reposida  ← `Practice`
- Kicker: `Amaliyot 2 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **`ci.yml`ga matrix `[22, 24]` qo'shing, ikki job'ni ko'ring, `fail-fast: false` bilan to'liq javob oling, keyin bitta Node'ga qaytaring** · `tableAt: 3`
1. **Endi siz: ==o'z reponingizda matrix==, ikki mashina, fail-fast ikki holatda**
   Ovoz: «Endi navbat sizga. O'z reponingizdagi ci yml'ga matrix qo'shasiz, yigirma ikki va yigirma to'rt, push qilib ikki job'ni ko'rasiz. Keyin fail fast false bilan to'liq javob, oxirida bitta Node'ga qaytarasiz. O'n besh daqiqa ketadi.»
2. **1–2-qadam: ==matrix va push== — `test (22)` qizil, `test (24)` cancelled**
   Ovoz: «Birinchi qadamda strategy matrix va setup node'da matrix node version yozasiz, sakkizinchi ekrandagi kabi. Ikkinchisida push: Actions'da ikki job, yigirma ikki qizil, yigirma to'rt cancelled bo'lishi kerak.»
3. **3–4-qadam: ==`fail-fast: false`== — 24 yashil; keyin matrix'ni olib, `node-version: 24`; isbot — 24 job'ining holati**
   Ovoz: «Uchinchi qadamda fail fast false qo'shib push qilasiz: yigirma to'rt yashil, yigirma ikki qizil. To'rtinchisida matrix'ni olib tashlab, node version yigirma to'rtga qaytarasiz, run yashil. Isbot maydoniga uchinchi qadamdagi yigirma to'rt job'ining holatini yozing.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz matrix yozasiz va cancelled nima ekanini bilasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | matrix | `ci.yml`: `strategy:` → `matrix:` → `node-version: [22, 24]` · `setup-node`da `node-version: ${{ matrix.node-version }}` | 8-ekrandagi 18 satr |
  | 2 | Push | `git commit -am "ci: matrix" && git push mine HEAD:main` | `test (22)` ✗ · `test (24)` cancelled |
  | 3 | `fail-fast: false` | `strategy:` ostiga `fail-fast: false` · push | `test (22)` ✗ · `test (24)` ✓ |
  | 4 | Qaytarish | matrix'ni olib tashlang, `node-version: 24` · push | run ✓ (bitta job) |
- Isbot: «3-qadamda `test (24)` job'ining holati» · placeholder: «masalan: success / yashil» · KOD: `/(success|yashil|✓|passed)/i` · xato: «`fail-fast: false` bilan 24 job'i oxirigacha yurishi kerak — holatini yozing.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Bitta job, nomi `test` | `strategy` `runs-on` bilan bir chuqurlikda emas yoki `matrix.node-version` ishlatilmagan — 8-ekrandagi yml |
  | Ikkalasi yashil | mashinangizda Node 22 va lock npm 10 bilan yig'ilgan — tuzoq yo'q; kutilgan farq faqat lock npm 11 bilan bo'lsa chiqadi (CI/CD-1 17-ekran) |
  | Ikkalasi qizil `npm ci` | lock mos emas (CI/CD-1 14-ekran) — `npm install`, lock commit'ga |
  | `Invalid workflow file` | YAML surilish — `strategy:` `matrix:` ikki probel o'ngda, ro'yxat `[22, 24]` |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `cicd2v2-out/30`, `31`.

---

## 12 · Smoke lentada: bazali tekshiruvga baza qayerdan — services  ← `Lesson`
- Kicker: `4-bosqich · smoke va secret` · Sarlavha: **Jest testlari bazasiz (mock). Smoke esa haqiqiy Postgres'ga yozadi — lentada baza yo'q. Yechim: job yoniga vaqtinchalik konteyner — `services`**
- Sahna: ikki karta galma-gal: «Unit test (Jest-2)» — mock, baza yo'q, 2 s · «Smoke (TgPg)» — `npm run smoke`: `scripts/smoke.js` → `shop_smoke` bazasini ochadi, restart 3 + race 2, `NATIJA: 5/5 ✓`, baza KERAK; 3-segmentda `scripts/smoke.js` satrlari (`cicd2-done`): `const baseUrl = process.env.SMOKE_DB_URL || process.env.DATABASE_URL || '';` · `` const db = `${u.pathname.slice(1) || 'shop'}_smoke`; `` · `CREATE DATABASE "${db}" TEMPLATE template0`; 4-segmentda services kartasi: job mashinasi yonida `postgres:18` konteyneri, `localhost:5432`, job bilan tug'iladi va o'ladi.
1. **Lentada hozir faqat ==Jest — bazasiz==; TgPg darsidagi smoke esa haqiqiy bazaga yozadi**
   Ovoz: «To'rtinchi bosqich. Lentada hozir faqat Jest testlari: mock, baza yo'q, ikki soniya. Lekin Telegraf darsida smoke yozgansiz: npm run smoke, haqiqiy Nest va Telegraf kodi, haqiqiy Postgres, restart va race. U lentada yo'q, chunki runner'da baza yo'q.» · ikki karta
2. **`scripts/smoke.js`: ==`DATABASE_URL`dan `shop_smoke` bazasini o'zi ochadi==, oxirida o'chiradi**
   Ovoz: «OrderBotNest'da scripts papkasidagi smoke js'ni oching. Base url: DATABASE URL muhit o'zgaruvchisidan. Undan shop smoke nomli vaqtinchalik baza ochadi, template zero bilan, oxirida o'chiradi. Demak, smoke'ga faqat bitta narsa kerak: ishlayotgan Postgres va unga manzil.» · smoke.js
3. **Yechim: ==`services` — job mashinasi yonida vaqtinchalik konteyner==, `postgres:18`, `localhost:5432`**
   Ovoz: «GitHub'da bu services deyiladi: job'ga ikkinchi konteyner, bu yerda postgres o'n sakkiz. U job bilan birga ochiladi, mashinada localhost besh ming to'rt yuz o'ttiz ikkida turadi, job tugashi bilan o'chadi. Hech qanday server, hech qanday tashqi baza kerak emas.» · services kartasi
4. **Xulosa: ==unit test bazasiz, smoke — services bilan==; lentada ikkalasi: tez va to'liq**
   Ovoz: «Xulosa: unit testlar bazasiz, tez. Smoke bazali, to'liq. Lentada ikkalasi bo'lsin: avval test, keyin smoke, uning yonida Postgres konteyneri. Keyingi ekranda shu job'ni yozamiz va haqiqiy run'da ko'ramiz.»
- Manba: `order-bot` `cicd2-done` `scripts/smoke.js` (haqiqiy satrlar), `package.json` `"smoke"`; TgPg darsi smoke natijasi (`orderbot-out/10-smoke-tgpg-done.txt`).

## 13 · `services: postgres` + `needs: test` — smoke job yashil  ← `Lesson`
- Kicker: `4-bosqich · smoke va secret` · Sarlavha: **Ikkinchi job `smoke`: `needs: test`, `services: postgres:18` healthcheck bilan, `npm run smoke` — run'da `Initialize containers`, keyin `NATIJA: 5/5 ✓`**
- Sahna: `ci.yml` (`3-smoke-services.yml`, 41 satr) bo'laklab: 16–17 `smoke:` `needs: test` · 19–30 `services:` `postgres:` `image: postgres:18` `env:` `POSTGRES_PASSWORD` `POSTGRES_DB: shop` `ports: - 5432:5432` `options: --health-cmd "pg_isready -U postgres" …` · 31–41 steps: checkout · setup-node · `npm ci` · `npm run smoke` `env: DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop`; run `32`: ikki job `test` ✓ → `smoke` ✓: `Initialize containers` (≈12 s) · `npm run smoke` logi: `== vaqtinchalik baza: shop_smoke ==` · `✓ telefon kutish restartdan o'tdi…` · `✓ ortiqcha sotilmadi…` · `NATIJA: 5/5 ✓` · `Stop containers`.
1. **Ikkinchi job: ==`smoke:` `needs: test`== — test qizil bo'lsa smoke boshlanmaydi, Postgres ko'tarilmaydi**
   Ovoz: «Ci yml'ga jobs ostiga ikkinchi nom qo'shamiz: smoke. Birinchi satri needs test: avval test job'i yashil bo'lsin, keyin smoke. Test qizil bo'lsa smoke boshlanmaydi, Postgres ham ko'tarilmaydi, vaqt bekor ketmaydi.» · 16–17
2. **`services: postgres`: ==image, parol, baza nomi, port va healthcheck== — `pg_isready` tayyor demaguncha kutadi**
   Ovoz: «Services ostida postgres: image postgres o'n sakkiz. Env: parol va baza nomi shop, smoke shop smoke'ni shundan ochadi. Ports: besh ming to'rt yuz o'ttiz ikki. Options: healthcheck, pg is ready. Baza tayyor demaguncha qadamlar boshlanmaydi, aks holda smoke ulanolmay yiqilardi.» · 19–30
3. **Qadamlar: checkout, setup-node, `npm ci`, ==`npm run smoke` — `env: DATABASE_URL` konteynerga==; run'da «Initialize containers»**
   Ovoz: «Qadamlar tanish: checkout, setup node, npm si ay. Keyin npm run smoke, uning env'ida DATABASE URL: postgres, parol postgres, localhost, shop. Push. Run'da ikki job: test yashil, keyin smoke: birinchi qadam initialize containers, Postgres ko'tarildi, o'n ikki soniya.» · 31–41 + run
4. **Xulosa: smoke logida ==`NATIJA: 5/5 ✓`== — restart va race lentada; `Stop containers` — baza o'chdi**
   Ovoz: «Xulosa: npm run smoke qadamining logi: vaqtinchalik baza shop smoke, restart uchta yashil, race ikkita yashil, natija besh besh. Oxirida stop containers: baza o'chdi, iz qolmadi. Endi haqiqiy bot sinovi har push'da. Keyingi ekranda DATABASE URL qayerdan kelishini chuqurroq ko'ramiz.» · log
- Manba: `cicd2v2-out/32-smoke-services.txt` (ikki job, log — aynan), `cicd2v2-yml/3-smoke-services.yml` (= `cicd2-done` `ci.yml`).

## 14 · DATABASE_URL qayerdan: env (konteyner) va secrets (tashqi); nomi xato → bo'sh  ← `Lesson`
- Kicker: `4-bosqich · ichida` · Sarlavha: **Konteyner paroli sir emas — `env:`da ochiq. Haqiqiy baza yoki bot tokeni — Secrets: logda yulduzcha (maska). Secret nomi xato bo'lsa xato chiqmaydi — qiymat bo'sh, smoke «DATABASE_URL topilmadi»**
- Sahna: yonma-yon (M47): run `33` logida haqiqiy topilma: smoke xabaridagi namuna manzil `postgresql://postgres:parol@localhost…` logda `***localhost:5432/shop` bo'lib chiqdi — runner URL ichidagi `user:parol@` qismini o'zi maskalaydi (secret'siz ham). Chapda ikki karta: «`env:` — konteyner» (`DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop` — yml'da ochiq, job bilan o'ladi) ↔ «`secrets` — tashqi» (GitHub → Settings → Secrets and variables → Actions → `DATABASE_URL`; yml'da `${{ secrets.DATABASE_URL }}`; logda `***`); o'ngda run `33` (`4-smoke-secret-xato.yml` 41-satr `${{ secrets.DATABSE_URL }}`): `smoke` ✗ — log: `SMOKE XATO: DATABASE_URL topilmadi. .env ga PostgreSQL manzilini yozing: postgresql://…` · `[chiqish kodi 2]`; 3-segmentda run `34` (secret bor bo'lsa): `echo "DATABASE_URL=${{ secrets.DATABASE_URL }}"` → `DATABASE_URL=***` · `wc -c` → uzunlik · yo'q secret → `YO'Q=` (bo'sh) — ⚠ run 34 foydalanuvchi secret yaratgandan keyin; ungacha ekranda «GitHub maskasi: `***`» kartasi manba bilan.
1. **Konteyner paroli — ==`env:`da ochiq, bu to'g'ri==: u faqat job ichida yashaydi, job bilan o'ladi**
   Ovoz: «O'n uchinchi ekranda DATABASE URL'ni yml'ga ochiq yozdik, parol postgres. Bu to'g'ri: konteyner job ichida tug'iladi va o'ladi, unga tashqaridan hech kim ulanolmaydi. Sir emas. Ikkala AI ham shunday qildi, keyin ko'rasiz.» · env kartasi
2. **Haqiqiy baza, bot tokeni — ==GitHub Secrets==: Settings'da yoziladi, yml'da `${{ secrets.NOM }}`, logda `***`**
   Ovoz: «Lekin haqiqiy baza manzili yoki bot tokeni yml'ga yozilmaydi: repo ochiq, tarix abadiy. Ular GitHub'da repo settings, secrets and variables, actions bo'limiga yoziladi. Yml'da faqat nomi: secrets DATABASE URL. Logda qiymati yulduzcha bo'lib chiqadi, maska.» · secrets kartasi
0. **Endi ==o'zingiz buzasiz==: `ci.yml`da yonib turgan secret nomi ustiga bosing**
   Ovoz: «Endi buzamiz. Buzishni o'zingiz qilasiz: ci yml'ning qirq birinchi satrida secrets DATABASE URL yonib turibdi, ustiga bosing: nomdan bitta harf tushib qoladi.»
   Bosish: «**ci.yml** 41-satridagi **`secrets.DATABASE_URL`** ustiga bosing — nomdan bitta harf tushib qoladi.»
3. **Buzildi: ==`secrets.DATABSE_URL` — bitta harf tushib qoldi==; xato yo'q, qiymat bo'sh — smoke «DATABASE_URL topilmadi»**
   Ovoz: «Harf tushib qoldi: secrets DATABSE URL. Push. GitHub xato bermaydi: bunday secret yo'q, demak qiymat bo'sh. Smoke qadami qizil: SMOKE XATO, DATABASE URL topilmadi, chiqish kodi ikki. Logga qarang: xabardagi namuna manzilning paroli yulduzcha, runner URL parolini o'zi yashirdi.» · run 33
4. **Xulosa: ==env — konteyner, secrets — tashqi==; «topilmadi» ko'rsangiz — yml'dagi secret nomini tekshiring**
   Ovoz: «Xulosa: konteyner uchun env, tashqi resurs uchun secrets. Secret nomi xato bo'lsa GitHub indamaydi, qiymat bo'sh keladi va dastur yiqiladi. Logda topilmadi yoki undefined ko'rsangiz, avval yml'dagi secret nomini Settings'dagi bilan solishtiring. Endi shu satrni o'zingiz topasiz.»
- F-1120-02 (M52): 3-banddan oldin «0.» — mentor 41-satrdagi `secrets.DATABASE_URL` ni o'zi bosadi → `DATABSE_URL` (to'g'ri satr — 2-banddagi `${{ secrets.DATABASE_URL }}`). Kichik rasm: secret nomi → qiymat «?» → bo'sh → smoke ✕ «DATABASE_URL topilmadi», chiqish kodi 2; bo'laklar 1 (41-satr nomi) · 2 (SMOKE XATO satri).
- Rasm (F-1120-02, M51, 21.11): xulosada ogohlantirish matni o'rniga, ikki karta ostida darsning rasmi — `services: postgres:18`, Actions: test ✓ · smoke ✕, «exit code 2»; ostida `ci.yml:41` `secrets.DATABSE_URL` — GitHub indamaydi, qiymat bo'sh → «DATABASE_URL topilmadi» (run 33).
- Manba: `cicd2v2-out/33-smoke-secret-xato.txt` (aynan), `34-secret-echo.txt` (secret bo'lsa), `cicd2v2-yml/4-smoke-secret-xato.yml`, `5-secret-echo.yml`; lokal `DATABASE_URL=` smoke → kod 2 (`cicd1v2-run`, 04.11).

## 15 · Tekshiruv 3 — qaysi satr smoke'ni bazasiz qoldiradi  ← `LineCheck`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4 — qaysi satr xato?` · Sarlavha: **Bu `ci.yml` bilan `smoke` job qizil: «DATABASE_URL topilmadi». Postgres ko'tarildi, healthcheck o'tdi. Sababchi satrni toping**
- Shart (`task`): «Qoida: `${{ secrets.NOM }}` — NOM Settings'dagi bilan harfma-harf bir xil bo'lishi kerak; yo'q nom — bo'sh qiymat, xato yo'q. Bu bo'lakda bitta satr noto'g'ri nomga murojaat qiladi. **O'sha satrni bosing.**»
- Ovoz (`q`): «Secret nomini ko'rdingiz, endi o'zingiz toping. Uchinchi tekshiruv. Bu ci yml bilan smoke job qizil: DATABASE URL topilmadi. Postgres ko'tarildi, healthcheck o'tdi. Bo'lakda bitta satr noto'g'ri secret nomiga murojaat qiladi. O'sha satrni bosing.»
- Fayl: `.github/workflows/ci.yml` (`4-smoke-secret-xato.yml` 31–41 — smoke qadamlari): `steps:` · `- uses: actions/checkout@v4` · `- uses: actions/setup-node@v4` · `with:` · `node-version: 24` · `cache: npm` · `- run: npm ci` · `- run: npm run smoke` · `env:` · **`DATABASE_URL: ${{ secrets.DATABSE_URL }}` ← xato satr (41)** → `target` = 41-satr (bo'lakda indeks 10; ✅ KOD).
- Tuzatilgan (`fixed`): 41 → `DATABASE_URL: ${{ secrets.DATABASE_URL }}` (eski qizil, yangisi yashil); `fixedExtra`: run `33` smoke logi: `SMOKE XATO: DATABASE_URL topilmadi…` · `##[error]Process completed with exit code 2.` — va eslatma: «konteyner uchun oddiy `env:` (13-ekran) ham yetadi».
- To'g'ri (ovoz, `ok`): «To'g'ri. Secrets DATABSE URL: E harfi tushib qolgan. GitHub bunday secret'ni topmadi, lekin xato bermadi, bo'sh qiymat berdi. Smoke bo'sh manzil bilan ishga tushdi va o'zi to'xtadi: DATABASE URL topilmadi. Ekranda tuzatilgan satr. Demak, secret bilan bog'liq xatoni avval nomdan qidiring.»
- Qisqa (`okShort`): «`DATABSE` — bitta harf yo'q; GitHub indamaydi, qiymat bo'sh, dastur yiqiladi. Nomni Settings bilan solishtiring.»
- Maslahat (`hint`): «`${{ secrets.… }}` ichidagi nomni harfma-harf o'qing: DATABASE_URL to'liqmi?»
- Manba: `cicd2v2-yml/4-smoke-secret-xato.yml`, `cicd2v2-out/33-smoke-secret-xato.txt`.

---

## 16 · Pull request: lenta merge'dan oldin tekshiradi; badge  ← `Lesson`
- Kicker: `5-bosqich · PR va AI` · Sarlavha: **Yangi ish — alohida tarmoqda; pull request ochilganda lenta yana yuradi va PR sahifasida tekshiruv turadi; yashil — merge; README'da badge lenta holatini ko'rsatadi**
- Sahna: terminal `$ git checkout -b lenta-smoke` · `$ git push -u origin lenta-smoke` → run `35` (push, `lenta-smoke`) ✓; 2-segmentda PR kartasi (`36b-pr-holat.txt`: `gh pr view` — sarlavha «ci: smoke job (PostgreSQL xizmati) va README badge», `lenta-smoke → main`, `gh pr checks`: `test` ✓ · `smoke` ✓ — `pull_request` run `36`); 3-segmentda merge → `main` run `37` (merge commit, ikki job ✓); 4-segmentda README birinchi satri (`cicd2-done`): `[![CI](https://github.com/Azizbekcrypto/OrderBotNest/actions/workflows/ci.yml/badge.svg)](…)` + badge ko'rinishi «CI · passing».
1. **Yangi ish — ==alohida tarmoq `lenta-smoke`==; push — tarmoqda ham run (`on: push`)**
   Ovoz: «Smoke job'ni main'ga to'g'ridan emas, pull request orqali qo'shamiz, jamoada shunday. Terminalda git checkout b lenta smoke, ci yml'ni o'zgartirib commit, git push u origin lenta smoke. Actions'da run: on push har tarmoqqa tegishli.» · terminal + run 35
2. **Pull request: ==`on: pull_request` — yana run==; PR sahifasida «checks»: `test` ✓, `smoke` ✓**
   Ovoz: «GitHub'da pull request ochamiz: lenta smoke'dan main'ga. Ci yml'dagi on pull request ishga tushadi: yana bir run, bu safar pull request hodisasi. PR sahifasining pastida checks: test yashil, smoke yashil. Merge tugmasi ochiq. Qizil bo'lsa, bu yerda ko'rinadi, main'ga o'tmaydi.» · PR kartasi
3. **Merge — ==main'da merge commit, yana run==: ikki job yashil; endi main'da smoke ham bor**
   Ovoz: «Merge bosamiz. Main'da merge commit paydo bo'ladi, on push, yana run: test va smoke yashil. Endi main'dagi lenta ikki job'li. Tarix ham tushunarli: qaysi PR nimani qo'shgani ko'rinadi, CI/CD-1 dagi to'g'ridan push'dan farqi shu.» · run 37
4. **Xulosa: ==README'ga badge== — `actions/workflows/ci.yml/badge.svg`: ochgan odam lentani ko'radi**
   Ovoz: «Xulosa: tarmoq, pull request, checks, merge. Va README'ning birinchi satriga badge: workflows ci yml badge svg. Reponi ochgan har kim lenta yashilmi, qizilmi, darhol ko'radi. O'quvchi darsida bu tablo deyiladi. Endi AI'ga o'tamiz.» · README
- Manba: `cicd2v2-out/35-pr-tarmoq.txt`, `36-pr-checks.txt`, `36b-pr-holat.txt`, `37-main-merge.txt` (aynan); `cicd2-done` `README.md` 1-satr.

## 17 · AI smoke workflow yozdi — ikki to'plam, ikkalasi yashil  ← `Lesson`
- Kicker: `5-bosqich · AI` · Sarlavha: **Yangi ko'nikma davomi: ikki AI'ga bitta prompt — «smoke'ni ham qo'sh, unga PostgreSQL kerak»; ikkalasi `services: postgres` yozdi va lentada birinchi urinishda yashil**
- Sahna: 1-segmentda bosqich kartasi («1–4-bosqich · siz» xira → «5-bosqich · AI yozadi, siz qabul qilasiz»); 2-segmentda prompt kartasi (`p1-prompt.txt`); 3-segmentda ikki AiReply: «1-AI (kuchli model)» — `ci.yml` +20 satr: `services: postgres:18` healthcheck, `POSTGRES_DB: shop`, `npm run smoke` oxirida, `env: DATABASE_URL` faqat smoke qadamida, 3 izoh; «2-AI (kuchsizroq model)» — +17 satr: xuddi shu, `env` job darajasida; 4-segmentda run `40` va `41` ikkalasi ✓ (`Initialize containers` · `npm run smoke` ✓).
1. **Yana AI bosqichi: ==prompt — «smoke'ni ham qo'sh, unga PostgreSQL kerak»==, services so'zi yo'q**
   Ovoz: «CI/CD-1 dagi kabi oxirgi bosqich AI bilan. Prompt: OrderBotNest'da npm run smoke bor, unga PostgreSQL kerak, DATABASE URL. Workflow'ga shu smoke'ni ham qo'shib ber. Services, konteyner, healthcheck, secret, bu so'zlar promptda yo'q. Har AI loyihaning alohida nusxasida, mavjud ci yml bilan.» · bosqich + prompt
2. **Ikkalasi ==`services: postgres:18`, healthcheck, `POSTGRES_DB: shop`== yozdi — README'dagi versiyadan**
   Ovoz: «Ikkalasi ham services postgres o'n sakkiz yozdi, README'dagi versiyadan. Parol, baza nomi shop, port, va healthcheck pg is ready. Smoke qadami build'dan keyin, env'ida DATABASE URL. Birinchisi env'ni faqat smoke qadamiga, ikkinchisi butun job'ga berdi.» · AI kartalari
3. **Lentada: ==ikkalasi birinchi urinishda yashil== — `Initialize containers`, `NATIJA: 5/5 ✓`**
   Ovoz: «Ikkalasini ham sinov tarmog'iga push qildik. Ikkalasi yashil: initialize containers, Postgres ko'tarildi, npm run smoke, natija besh besh. CI/CD-1 dagidan farqli, bu safar AI birinchi urinishda to'g'ri qildi. Nega shunday, hozir ko'ramiz.» · run 40, 41
4. **Xulosa: AI ==secret ishlatmadi — to'g'ri== («konteyner — sir emas»); yashil, lekin tekshiruv hali oldinda**
   Ovoz: «Xulosa: ikkala AI secret ishlatmadi va birinchisi sababini yozdi: konteyner paroli faqat job ichida, sir emas. To'g'ri fikr. Ikkalasi yashil. Lekin yashil hali qabul emas: keyingi ekranda to'rt savol bilan o'qiymiz.»
- Manba: `cicd2v2-ai/00-promptlar.md`, `p1-prompt.txt`, `ai1/.github/workflows/ci.yml`, `ai2/…`, `XULOSA.md`, `cicd2v2-out/40-ai1.txt`, `41-ai2.txt`.

## 18 · AI'ni qabul qilish: to'rt savol; tayanch to'g'ri — AI ham to'g'ri  ← `Lesson`
- Kicker: `5-bosqich · ichida` · Sarlavha: **Nega bu safar yashil: AI faylni noldan yozmadi, sizning `ci.yml`ni (node 24) o'zgartirdi — tayanch to'g'ri bo'lsa AI ham to'g'ri; qabul — to'rt savol**
- Sahna: yonma-yon (M47): chapda CI/CD-1 AI natijasi kartasi: «noldan yozdi → `node-version: 22` → qizil» ↔ o'ngda CI/CD-2: «mavjud `ci.yml` (24) ni o'zgartirdi → yashil»; 2-segmentda ikki AI yml bo'lagi yonma-yon: 1-AI `env:` smoke qadamida ↔ 2-AI `env:` job darajasida; 3-segmentda 1-AI izohi: «smoke ichida yana `nest build` — build ikki marta»; 4-segmentda to'rt savol ro'yxati.
1. **Farq: CI/CD-1 da AI ==noldan yozdi== (node 22 → qizil); bu safar ==sizning faylingizni o'zgartirdi== (24 → yashil)**
   Ovoz: «CI/CD-1 da AI workflow'ni noldan yozdi va node yigirma ikki qo'ydi, qizil. Bu safar repoda sizning ci yml'ingiz bor edi, node yigirma to'rt bilan. AI uni o'zgartirdi, noldan yozmadi. Tayanch to'g'ri bo'lsa, AI ham to'g'ri davom etadi. Shuning uchun avval o'zingiz yozing, keyin AI'ga bering.» · ikki karta
2. **Ikki farq: ==`env` qayerda== — 1-AI faqat smoke qadamida (torroq, yaxshi), 2-AI butun job'ga; smoke alohida job emas**
   Ovoz: «Ikkalasini solishtiring. Birinchi AI DATABASE URL'ni faqat smoke qadamiga berdi, ikkinchisi butun job'ga: ikkalasi ishlaydi, torrog'i yaxshiroq. Ikkalasi smoke'ni alohida job qilmadi, oxirgi qadam qildi: ishlaydi, lekin test qizil bo'lsa ham Postgres ko'tariladi. Tavsiyada needs test bilan alohida job.» · yml bo'laklari
3. **1-AI o'zi sezdi: ==smoke ichida yana `nest build` — build ikki marta==; AI izohini o'qing**
   Ovoz: «Birinchi AI yana bir narsani o'zi aytdi: smoke ichida yana nest build bor, build ikki marta yuradi, bir necha soniya ortiqcha. Siz hal qilasiz: npm run build qadamini qoldirasizmi, olasizmi. AI'ning izohlarini o'qing, ko'pincha eng foydali joyi shu.» · izoh
4. **Xulosa: AI smoke workflow'iga ==to'rt savol==: services + healthcheck · `DATABASE_URL` yetib boradimi · tartib · secret kerakmi**
   Ovoz: «Xulosa, to'rt savol. Services va healthcheck bormi. DATABASE URL smoke qadamiga yetib boradimi, env qayerda. Tartib: smoke build'dan keyinmi. Secret kerakmi: konteyner uchun yo'q, tashqi baza uchun ha. To'rttasiga javob bo'lsa, push va run. Endi tekshirib olaylik.» · to'rt savol
- Manba: `cicd2v2-ai/XULOSA.md`, `ai1/diff.patch`, `ai2/diff.patch`; CI/CD-1 `cicd1v2-ai/XULOSA.md`.

## 19 · Tekshiruv 4 — konteyner uchun secret kerakmi  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **AI `services: postgres` yozdi va `DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop` ni yml'da ochiq qoldirdi. Bu xatomi?**
- Material (`above`): AI yml bo'lagi (`YML_AI1` smoke qadami: `- run: npm run smoke` · `env:` · `DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop`); ostida services kartasi qisqa: «konteyner — job ichida, job bilan o'chadi».
- Ovoz: «AI workflow'ini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. AI services postgres yozdi va DATABASE URL'ni, parol postgres bilan, yml'da ochiq qoldirdi. Bu xatomi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Xato — har qanday parol, hatto vaqtinchalik ham, Secrets'da bo'lishi shart · 2 Xato — GitHub ochiq parolni ko'rsa run'ni to'xtatadi · 3 Xato emas — konteyner job ichida yashaydi, parol tashqariga chiqmaydi · 4 Xato emas — `localhost` manzillari hech qachon sir bo'lmaydi
- To'g'ri (ovoz): «To'g'ri. Bu konteyner job bilan ochiladi va job bilan o'chadi, unga tashqaridan hech kim ulanolmaydi, parol hech narsani ochmaydi. Secret tashqi resurs uchun: haqiqiy baza, bot tokeni. Demak, secret kerakmi deb so'raganda, bu qiymat job'dan tashqarida nimani ochadi, deb so'rang.» · qisqa: «Konteyner — job ichida, job bilan o'chadi → `env` yetadi. Tashqi resurs → Secrets.»
- Isbot (`after`): run `40` `smoke` ✓ (`Initialize containers` · `npm run smoke` ✓) + 14-ekran kartasi «env — konteyner · secrets — tashqi».
- Demak: «Secret savoli: bu qiymat job'dan tashqarida nimani ochadi? Konteyner — hech narsani → `env`. Prod baza, token → Secrets.»
- Xato izohlari: 1 — «Secrets tashqi resurs uchun; konteyner paroli job bilan o'ladi.» · 2 — «GitHub yml'dagi matnni tekshirmaydi — run yashil (40, 41).» · 4 — «`localhost` ham sir bo'lishi mumkin (masalan, self-hosted runner'dagi haqiqiy baza) — gap manzilda emas, qiymat nimani ochishida.»
- Maslahat: «14-ekran: env — konteyner, secrets — tashqi. Bu konteyner job'dan tashqarida bormi?»
- Manba: `cicd2v2-ai/ai1/.github/workflows/ci.yml`, `cicd2v2-out/40`, `41`.

## 20 · Amaliyot 3 — smoke job, PR, merge, badge  ← `Practice`
- Kicker: `Amaliyot 3 / 3` · Eyebrow: `Hozir o'zingizda · 25 daqiqa` · Sarlavha: **O'z AI'ingizga smoke job yozdiring, to'rt savol bilan tekshiring, alohida tarmoqda PR oching, yashil bo'lgach merge qiling, README'ga badge** · `tableAt: 3`
1. **Endi siz: ==AI'ga smoke job== — tarmoq, PR, merge, badge**
   Ovoz: «Endi navbat sizga. O'z AI'ingizga smoke job yozdirasiz, promptni pastdagi tugma bilan nusxalaysiz. Alohida tarmoqda push qilib pull request ochasiz, tekshiruv yashil bo'lgach merge, README'ga badge. Yigirma besh daqiqa ketadi.»
2. **1–2-qadam: ==tarmoq va prompt==, keyin to'rt savol: services + healthcheck · env · tartib · secret**
   Ovoz: «Birinchi qadamda yangi tarmoq ochasiz: git checkout b lenta smoke. Ikkinchisida promptni AI'ga berib, faylni to'rt savol bilan o'qiysiz: services va healthcheck bormi, DATABASE URL smoke qadamiga yetadimi, smoke build'dan keyinmi, secret kerak emasligi to'g'rimi.»
3. **3–4-qadam: ==push, PR, checks yashil, merge==, README'ga badge; isbot — PR manzili**
   Ovoz: «Uchinchi qadamda push va GitHub'da pull request: checks'da test va smoke yashil bo'lgach merge. To'rtinchisida README'ning birinchi satriga badge qo'yib, main'ga push qilasiz: nishon passing. Isbot maydoniga merge qilingan PR manzilini nusxalang.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizning lentangizda haqiqiy bot sinovi bor va u pull request orqali keldi.»
- Prompt (nusxalash): «Loyiha: OrderBotNest (NestJS + Telegraf + TypeORM), `.github/workflows/ci.yml` bor (job `test`: checkout · setup-node · `npm ci` · `npx tsc --noEmit` · `npm test` · `npm run build`). `npm run smoke` — Telegram'siz tekshiruv (`scripts/smoke.js`), unga ishlayotgan PostgreSQL va `DATABASE_URL` kerak; smoke `<baza>_smoke` bazasini o'zi ochib o'chiradi. Vazifa: `ci.yml`ga ikkinchi job `smoke` qo'sh: `needs: test`; `services: postgres` (`image: postgres:18`, `POSTGRES_PASSWORD: postgres`, `POSTGRES_DB: shop`, `ports: 5432:5432`, `pg_isready` healthcheck); qadamlar: checkout, setup-node (`node-version` — mening raqamim, `cache: npm`), `npm ci`, `npm run smoke` (`env: DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop`). Secret ishlatma — konteyner. Boshqa fayllarga tegma. Javobda faylning to'liq matni.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Tarmoq | `git checkout -b lenta-smoke` | yangi tarmoq |
  | 2 | Prompt + to'rt savol | yuqoridagi prompt — o'z AI'ingizga · `services` + `pg_isready` · `env: DATABASE_URL` smoke qadamida · smoke `build`dan keyin / `needs: test` · secret yo'q (konteyner) | 4 ✓ |
  | 3 | PR va merge | `git push -u mine lenta-smoke` · GitHub → New pull request (`lenta-smoke` → `main`) · checks ✓ → Merge | PR merged · `main` run ✓ (2 job) |
  | 4 | Badge | `git pull mine main` · README 1-satr: `![CI](https://github.com/<siz>/OrderBotNest/actions/workflows/ci.yml/badge.svg)` · commit, push | README'da «CI passing» |
- Isbot: «Merge qilingan PR manzili» · placeholder: «masalan: https://github.com/siz/OrderBotNest/pull/1» · KOD: `/github\.com\/[^\s\/]+\/[^\s\/]+\/pull\/\d+/` · xato: «PR sahifasining manzilini qo'ying: …/pull/<raqam>.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `smoke` qizil: `DATABASE_URL topilmadi` | `env:` smoke qadamiga yetmagan (boshqa qadamda yoki job'da yo'q) yoki secret nomi xato (14–15-ekran) |
  | `smoke` qizil: `ECONNREFUSED 127.0.0.1:5432` | `services` yo'q yoki `ports: 5432:5432` yo'q yoki healthcheck yo'q (baza tayyor bo'lmasdan boshlandi) |
  | `smoke` qizil: `database "shop" does not exist` | `POSTGRES_DB: shop` yo'q — smoke `shop` ga ulanib `shop_smoke` ochadi |
  | PR'da checks ko'rinmaydi | `on:` da `pull_request` yo'q — `on: [push, pull_request]` |
  | Badge «no status» | manzilda workflow fayl nomi xato — `ci.yml` aynan; yoki main'da hali run yo'q |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `cicd2v2-out/32`, `33`, `35–37`, `40`, `41`; `cicd2v2-ai/XULOSA.md`.

---

## 21 · m4c-03 xaritasi: o'quvchi so'zlari  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Eyebrow: `m4c-03 · «GitHub Actions — yo'l xaritasini yozish»` · Sarlavha: **O'quvchi darsi: yo'l xaritasi, nuqta, amal, parallel lentalar, yaqin javon, seyf, tablo — siz bugun haqiqiy run'da ko'rgan narsalarning rasmli nomlari**
- Sahna: ikki karta: «O'quvchi (m4c-03)» — 23 ekran: yo'l xaritasi qayerda yashaydi (`.github/workflows/`), ierarxiya (nuqta = job, amal = step), signal va mashina (`on`, `runs-on`), `uses`/`run`, «Jurnaldan sababni topish», tartib (DragDrop: checkout → setup-node → install → test), parallel lentalar (`matrix`, 3 Node, simulyatsiya), seyf (`${{ secrets.API_KEY }}`), tablo (badge), amaliyot — o'z reposiga `ci.yml` · «Siz (bugun)» — haqiqiy run'lar: log, cache, matrix + fail-fast, services, env/secrets, PR, badge; 2-segmentda lug'at; 3-segmentda «simulyatsiya ↔ haqiqiy» jadvali.
- Lug'at:
  | O'quvchi aytadi | Siz bilasiz |
  |---|---|
  | yo'l xaritasi · lenta mashinasi · start signali | `ci.yml` · runner (`runs-on`) · `on: push` |
  | nuqta · amal | job · step (`uses` — tayyor amal, `run` — buyruq) |
  | jurnal · jurnaldan sababni topish | qadam logi · annotatsiya → qizil qadam → log (4-ekran) |
  | parallel lentalar | `strategy.matrix` — har qiymat alohida job; `fail-fast` |
  | yaqin javon | `cache: npm` — «Cache saved» → «Cache hit» |
  | seyf | GitHub Secrets — `${{ secrets.NOM }}`, logda `***`; konteyner — `env` |
  | tablo | README badge — `actions/workflows/ci.yml/badge.svg` |
- Simulyatsiya ↔ haqiqiy:
  | O'quvchi darsida (simulyatsiya) | Haqiqiy Actions'da (bugun) |
  |---|---|
  | matrix: 3 lenta, hammasi ✓ | 22 ✗ (lock), 24 ✓; `fail-fast` 24 ni bekor qildi (30, 31) |
  | seyf: `${{ secrets.API_KEY }}` → yashirin | logda `***`; nomi xato — bo'sh, xato yo'q (33) |
  | jurnal: sabab bitta satrda | annotatsiya qisqa; sabab qadam logida (15, 11) |
  | tablo: passing | `badge.svg` — main'dagi oxirgi run (37) |
1. **m4c-03 — 23 ekran: ==yo'l xaritasi, nuqta, amal==; matrix, seyf, tablo — simulyatsiyada**
   Ovoz: «Endi sinfga tayyorgarlik. O'quvchi darsi m4c-03, yigirma uch ekran. Yo'l xaritasi bu ci yml, nuqta bu job, amal bu step. Parallel lentalar matrix, seyf secrets, tablo badge. Hammasi ekranda chizilgan simulyatsiya: tugma bosiladi, lenta yuradi, hammasi yashil.» · kartalar
2. **Lug'at: ==o'quvchi so'zi → atama==; sinfda ikkalasini birga ayting**
   Ovoz: «Lug'atga qarang: o'quvchi so'zi chapda, atama o'ngda. Jurnal bu qadam logi, yaqin javon bu cache, seyf bu secrets. Sinfda so'zni atamasi bilan birga ayting: parallel lentalar, ya'ni matrix. O'quvchi keyin GitHub'ni ochganda so'zlar tanish bo'ladi.» · lug'at
3. **Simulyatsiya ↔ haqiqiy: ==o'quvchi darsida hammasi yashil==, haqiqiy Actions'da 22 qizil, cancelled, `***`**
   Ovoz: «Farqni bilib turing. O'quvchi darsida matrix uchala lentada yashil, seyf shunchaki yashirin, jurnalda sabab bitta satr. Haqiqiy Actions'da yigirma ikki qizil, yigirma to'rt cancelled, secret nomi xato bo'lsa indamaydi, sabab logning ichida. Siz buni bugun ko'rdingiz, o'quvchi ko'rmagan.» · jadval
4. **Xulosa: ==simulyatsiya tushuncha beradi, haqiqiy run tajriba==; sinfda bittasini ekranda oching**
   Ovoz: «Xulosa: simulyatsiya tushunchani beradi, haqiqiy run tajribani. Sinfda o'z reponingizdagi bitta run'ni proyektorda oching: job, qadam, log, cache hit. O'quvchi yo'l xaritasi va haqiqiy Actions bir narsa ekanini ko'rsin. Keyingi ekranda sinfdagi tuzoqlar.»
- Manba: `src/4c-Modull/GithubActionsLesson.jsx` (`SCREEN_META` 23, s13 matrix-lanes, s16 secrets, badge, amaliyot `task`); bugungi run'lar.

## 22 · «Repongiz yo'qmi?» namunasi va simulyatsiya — sinfdagi tuzoqlar  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Sarlavha: **O'quvchi darsidagi «Repongiz yo'qmi?» namunasi: lock fayl yo'q — `npm ci` qizil; `"test": "echo ok && exit 0"` — hech qachon qizil bo'lmaydi; uyga vazifadagi «testni buzing» shu yerda to'xtab qoladi**
- Sahna: terminal `cicd2-out/01` (namuna `package.json`: `"test": "echo ok && exit 0"`, lock yo'q) → `02`: `$ npm ci` → `The npm ci command can only install with an existing package-lock.json…` `[1]` → `03`: `$ npm install && npm test` → `ok` `[0]` → `04`: «buzish» — `echo xato && exit 1` → `[1]`; 4-segmentda uch tuzoq kartasi: lock yo'q · test doim yashil · `@v4` (o'quvchi darsida) ishlaydi (haqiqiy run'larda `@v4` ✓, «Node.js 20 is deprecated» ogohlantirishi bilan).
1. **Namuna: ==`npm install`, `echo ok` testi, lock yo'q== — o'quvchi shu bilan birinchi lentasini yozadi**
   Ovoz: «O'quvchi darsida reposi yo'q o'quvchi uchun namuna bor: package json'da test echo ok, lock fayl yo'q, lenta npm install va npm test. U ishlaydi: npm install o'rnatadi, test ok deydi, yashil. Lekin ikki tuzoq bor.» · 01, 03
2. **Tuzoq 1: o'quvchi GitHub'ning tayyor andozasini bossa — ==`npm ci`, lock yo'q — qizil==**
   Ovoz: «Birinchi tuzoq: o'quvchi Actions'da GitHub'ning tayyor Node andozasini bossa, u npm si ay yozadi. Lock fayl yo'q, npm si ay yiqiladi: can only install with an existing package lock json. CI/CD-1 o'n uchinchi ekrandagi xabar, boshqa sabab bilan. Yechim: npm install, yoki npm install bir marta lokalda, lock commit'ga.» · 02
3. **Tuzoq 2: ==`echo ok && exit 0` hech qachon qizil bo'lmaydi== — uyga vazifadagi «testni buzing» imkonsiz**
   Ovoz: «Ikkinchi tuzoq: test echo ok va exit nol, u hech qachon qizil bo'lmaydi. Uyga vazifada testni ataylab buzing deyiladi, namunada buzib bo'lmaydi. Yechim: o'quvchi o'z Jest loyihasida qilsin, yoki skriptni echo xato va exit bir qilib ko'rsating: qizil, keyin qaytaring.» · 04
4. **Xulosa: namuna ==boshlash uchun yaxshi, buzish uchun emas==; `@v4` ishlaydi, ogohlantirish — xato emas**
   Ovoz: «Xulosa: namuna boshlash uchun yaxshi, buzish uchun emas. Va o'quvchi darsidagi checkout v to'rt hozir ham ishlaydi, logda Node yigirma deprecated ogohlantirishi chiqadi, bu xato emas. Oxirgi ekranda siz qo'shadigan narsalar va o'quvchi savollari.»
- Manba: `cicd2-out/01-ci-mashq-namuna.txt`, `02-npm-ci-lock-yoq.txt`, `03-npm-install-test.txt`, `04-test-buzildi.txt` (lokal, 01.11); `@v4` — bugungi run'lar annotatsiyasi («Node.js 20 is deprecated … forced to run on Node.js 24»).

## 23 · Siz qo'shasiz, xato qiladigan joylar, o'quvchi so'rasa  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Sarlavha: **Darsga siz qo'shadigan to'rt narsa, uch vaziyat va o'quvchi savollariga tayyor javoblar**
- Sahna: 1-segmentda «Siz qo'shasiz» jadvali; 2-segmentda xato qiladigan joylar kartalari (3); 3–4-segmentda «O'quvchi so'rasa» (QA, ovozsiz).
- Siz qo'shasiz:
  | Siz qo'shasiz | Qayerda |
  |---|---|
  | haqiqiy run'ni proyektorda: job → qadam → log; annotatsiya vs log (4-ekran) | «Jurnaldan sababni topish» |
  | matrix'da haqiqiy natija: bitta versiya qizil bo'lishi mumkin, `fail-fast` qolganini to'xtatadi (8–9) | parallel lentalar |
  | secret nomi xato — xato chiqmaydi, bo'sh keladi (14); konteyner uchun secret kerak emas | seyf |
  | namunadagi `npm ci` va `echo ok` tuzoqlari (22) | «Repongiz yo'qmi?» + uyga vazifa |
- Xato qiladigan joylar:
  | # | Vaziyat | Xabar | Yechim |
  |---|---|---|---|
  | 1 | `npm ci` qizil, lock yo'q | `can only install with an existing package-lock.json` | `npm install` (namuna) yoki lock commit'ga |
  | 2 | matrix'da bitta job «cancelled» | `The strategy configuration was canceled because … failed` | xato boshqa job'da; `fail-fast: false` |
  | 3 | «testni buzdim, baribir yashil» | `ok` | `echo ok && exit 0` — buzilmaydi; `exit 1` yoki Jest loyihasi |
- O'quvchi so'rasa:
  - «Jurnal qayerda?» → run → job → qadam; qadam nomini bosing — log ochiladi.
  - «Matrix'da hammasi yashil bo'lishi shartmi?» → Yo'q — maqsad qaysi versiyada ishlashini bilish; qizil versiya — javob.
  - «Seyfdagi kalitni ko'rsam bo'ladimi?» → Yo'q — logda `***`; qiymat faqat yozilganda ko'rinadi, keyin hech kim o'qiy olmaydi.
  - «Badge qizil bo'lsa nima?» → main'dagi oxirgi run qizil — Actions'ni ochib qaysi qadam qizilligini toping.
1. **Siz qo'shasiz: ==haqiqiy run proyektorda, matrix'ning haqiqiy natijasi, secret nomi, namuna tuzoqlari==**
   Ovoz: «Darsga siz qo'shadigan to'rt narsa. Jurnaldan sababni topish ekranida haqiqiy run'ni proyektorda oching. Parallel lentalarda ayting: haqiqatda bitta versiya qizil bo'lishi mumkin. Seyfda: nom xato bo'lsa indamaydi. Uyga vazifada namuna tuzoqlarini oldindan ayting.» · jadval
2. **Uch vaziyat: ==lock yo'q, cancelled, «buzdim, baribir yashil»== — xabar va yechim**
   Ovoz: «Uch vaziyat. Npm si ay qizil, lock yo'q: npm install yoki lock commit'ga. Matrix'da cancelled: xato boshqa job'da, fail fast. Testni buzdim, baribir yashil: echo ok buzilmaydi, exit bir yoki Jest loyihasi. Har birining xabari kartada.» · kartalar
3. **O'quvchi so'rasa: ==jurnal qayerda, matrix yashil shartmi, seyfni ko'rsam bo'ladimi, badge qizil==**
   Ovoz: «O'quvchi savollariga tayyor javoblar pastda, bosib oching: jurnal qayerda, matrix'da hammasi yashil bo'lishi shartmi, seyfdagi kalitni ko'rsam bo'ladimi, badge qizil bo'lsa nima. Har biriga bir gap javob bor.» · QA
4. **Xulosa: o'quvchi «lenta qizil» desa — ==job → qadam → log==; shu bilan sinfga tayyor**
   Ovoz: «Xulosa: o'quvchi lenta qizil desa, u bilan birga uch qadam: qaysi job, qaysi qadam, uning logi. Shu bilan sinfga tayyorsiz. Endi o'zingizni tekshiring.»
- Manba: 4, 8, 9, 14, 22-ekranlar; `cicd2-out/02`, `04`; `cicd2v2-out/30`.

## 24 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran; M48 — uzunliklar tekis):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | `ci.yml`da `jobs:` ostida `test:` va `smoke:`. Run'da nechta mashina ochiladi? | Bitta — job'lar navbat bilan bir mashinada · Ikkita — har job alohida mashinada · Qadamlar soni qancha bo'lsa, shuncha · Uchta — GitHub `Set up job` uchun alohida mashina oladi | 2 | Har job — o'z mashinasi; `needs` tartibini beradi. | 2 |
  | 2 | `Run actions/checkout@v4` logida `git fetch … --depth=1`. Bu nima? | Butun tarixni yuklaydi — tezlik uchun siqilgan · Faqat oxirgi commit yuklanadi — tarixsiz, tez · Faqat o'zgargan fayllarni yuklaydi · Bir daqiqa ichida tugamasa to'xtatadi | 2 | Runner'ga butun tarix kerak emas. | 3 |
  | 3 | Run qizil, annotatsiya: `Process completed with exit code 1.` — `npm test`da. To'liq sabab qayerda? | Annotatsiyaning o'zida — boshqa joyda yo'q · `Set up job` logida — xatolar u yerga yig'iladi · `npm test` qadamining logida — FAIL va test nomi · Commit sahifasida — GitHub xatoni u yerga yozadi | 3 | Annotatsiya — manzil, sabab — log. | 4 |
  | 4 | Ikkinchi run'da `setup-node` logida `Cache hit for: node-cache-…`. `npm ci` nima qiladi? | Paketlarni o'rnatmaydi — cache'dan ishlataveradi · Saqlangan yuklamalardan o'rnatadi — tezroq, natija bir xil · Lock faylni cache'dagi eski nusxa bilan almashtirib qo'yadi · Faqat o'zgargan paketlarni yuklaydi | 2 | Cache — tezlik, to'g'rilik emas. | 6 |
  | 5 | matrix `[22, 24]`, `fail-fast` yozilmagan; 22 yiqildi. 24? | Oxirigacha yuradi — natijasi alohida ko'rinadi · Bekor qilinadi — «cancelled», natijasi noma'lum · Qayta boshlanadi — 22 ning o'rniga · Oxirigacha yuradi, lekin run baribir yashil deb belgilanadi | 2 | Odatiy `fail-fast: true`. | 8 |
  | 6 | Smoke'ga Postgres kerak. Lentada baza qayerdan? | Runner'da Postgres o'rnatilgan — hech narsa yozilmaydi · Mentor serveridagi bazaga ulanadi — manzil Secrets'da · `services: postgres` — job yonida vaqtinchalik konteyner · Smoke bazasiz rejimga o'tadi — natija yashil | 3 | Konteyner job bilan tug'iladi va o'ladi. | 13 |
  | 7 | yml'da `${{ secrets.DATABSE_URL }}` (harf tushgan). Run? | Fayl xatosi — run ochilmaydi · Annotatsiya: «secret not found» — qadam darhol qizil, log bo'sh · Qiymat bo'sh keladi — dastur o'zi yiqiladi, GitHub indamaydi · Run yashil — bo'sh qiymat bilan smoke o'tadi | 3 | «DATABASE_URL topilmadi» — kod 2. | 14 |
  | 8 | PR ochildi, checks'da `smoke` qizil. Nima bo'ladi? | Merge tugmasi butunlay yo'qoladi — GitHub qizil check bilan merge'ni taqiqlaydi · PR o'zi yopiladi — qayta ochish kerak · Qizil ko'rinadi — merge qilmaslik sizning qaroringiz (himoya sozlanmagan) · main'dagi lenta ham qizil bo'ladi | 3 | Checks ko'rsatadi; taqiq — branch protection bilan. | 16 |
- `passed = ball ≥ 6 && 3 amaliyot isbot bilan`.

## 25 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13.
- Xulosa 6 band:
  1. run → job → step; GitHub qo'shadi: `Set up job` (runner, token ruxsati, action'lar), `Post Run …` (cache), `Complete job`. `uses` ichi ochiq: `checkout` — `git init` + `fetch --depth=1`; `setup-node` — «Found in cache», Node/npm versiyasi.
  2. Qizil run: belgi → job → qadam → log. Annotatsiya — manzil (`##[error]` satrlari), sabab — qadam logida. Cache: «saved» → «hit» (`npm ci` 11 s → 5 s); tarmoqqa bog'liq («not found» — xato emas).
  3. matrix — bitta job, bir nechta qiymat, parallel; `fail-fast` (odatiy) bittasi yiqilsa qolganini «cancelled» qiladi; to'liq javob — `fail-fast: false`. Bot/sayt uchun bitta Node (mashinadagi) yetadi.
  4. Bazali tekshiruv lentada: `smoke` job `needs: test`, `services: postgres:18` (parol, `POSTGRES_DB`, port, `pg_isready` healthcheck), `npm run smoke` `env: DATABASE_URL` → `Initialize containers` → `NATIJA: 5/5 ✓` → `Stop containers`.
  5. `env` — konteyner (sir emas); Secrets — tashqi resurs (Settings → Secrets, `${{ secrets.NOM }}`, logda `***`). Nomi xato — xato yo'q, qiymat bo'sh, dastur yiqiladi («topilmadi»).
  6. Pull request: tarmoq → PR → `pull_request` run → checks → merge → main run; README badge. AI smoke workflow'i: tayanch (`ci.yml`) to'g'ri bo'lsa AI ham to'g'ri; to'rt savol: services + healthcheck · env yetadimi · tartib · secret kerakmi.
- **Uyga vazifa** (M14, M30): «O'z reponingizdagi lentaga uchinchi job qo'shing: `lint` — `npx prettier --check "src/**/*.ts"` (`needs` yo'q — test bilan parallel). Keyin `main` tarmog'ini himoyalang: GitHub → Settings → Branches → Add rule → `main` → «Require status checks to pass» → `test`, `smoke`, `lint`. Bitta faylni ataylab noto'g'ri formatlab alohida tarmoqda PR oching — `lint` qizil, Merge tugmasi yopiq bo'lsin; tuzatib push — yashil, merge. README'dagi badge yashil. Repo linkini va PR manzilini platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | `lint` job | `ci.yml`: `jobs.lint` — checkout · setup-node · `npm ci` · `npx prettier --check "src/**/*.ts"` | uch job: `test` · `smoke` · `lint` |
  | 2 | Himoya | Settings → Branches → rule `main` → Require status checks: `test`, `smoke`, `lint` | qoida saqlandi |
  | 3 | Qizil PR | tarmoq `lint-sinov`, `src/api/app.controller.ts` formatini buzing (bir qatorga), push, PR | `lint` ✗, Merge yopiq |
  | 4 | Yashil PR | `npx prettier --write src/api/app.controller.ts`, push | uchalasi ✓, merge |
  | 5 | Topshirish | repo linki + PR manzili → platformadagi uyga vazifa | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi qaraydi: `ci.yml`da uch job · branch rule bor · PR tarixida qizil `lint` run va keyin yashil merge.
- **Eslatma:** run → job → step · GitHub qadamlari · `uses` loglari (`fetch --depth=1`, «Found in cache») · qizilni o'qish tartibi · cache «saved/hit/not found» · matrix + `fail-fast` · `services: postgres` qolipi · `needs` · env ↔ secrets, nom xatosi · PR → checks → merge · badge · AI smoke workflow'iga to'rt savol · m4c-03 lug'ati · namuna tuzoqlari · o'z uyga vazifangiz.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **WebSocket: jonli panel** — bot buyurtma olsa, brauzerdagi panel sahifani yangilamasdan o'zi ko'rsatadi» (04.11 tuzatildi: OrderBotNest ipida CI/CD-2 dan keyin WebSocket-1).

---

## «KOD» — qurishda

**Qurishdan OLDIN yurgiziladi — 04.11:**
1. ✅ Run'lar `cicd1v2-out/10, 11, 18` (Actions ichi, cache) — CI/CD-1 dan.
2. ✅ 19:05 `drive-cicd2v2-actions.sh PHASE=matrix` → `30` (fail-fast: 22 ✗, 24 cancelled; `rec-run.sh` bilan CI workflow'iga qayta yozildi — `ci-sinov`da AI-1 ning `test.yml` qolgan edi, har push ikki run berardi; skript endi `test.yml`ni o'chiradi va `--workflow CI` filtrlaydi), `31` (fail-fast: false: 22 ✗, 24 ✓).
3. ✅ 19:08 `drive-cicd2v2-actions-ai.sh` → `40-ai1` ✓, `41-ai2` ✓ (smoke `NATIJA: 5/5 ✓`); `cicd2v2-ai/XULOSA.md`.
4. ✅ 19:13–19:21 `PHASE=rest` → `32` ✓ (smoke `NATIJA: 5/5 ✓`, `Initialize containers` 13 s), `33` ✗ (`SMOKE XATO: DATABASE_URL topilmadi`, kod 2; logda `***localhost…` — runner URL parolini o'zi maskaladi), PR #1: `35` ✓ (push), `36` ✓ (pull_request), `36b` (`gh pr view/checks`), merge 87a5bb1 → `37` ✓ (main) = `cicd2-done`; teglar `cicd2-start`/`cicd2-done` push ✓ (force kerak bo'lmadi).
5. ⏳ `PHASE=secret` → `34` (maska, `5-secret-echo.yml`) — foydalanuvchi `DATABASE_URL` secret'ini yaratgach (avto-rejim secret yozishni rad etdi); ungacha 14-ekran 3-segmentida maska kartasi «GitHub hujjati» belgisi bilan.
6. ✅ 15-ekran LineCheck: `4-smoke-secret-xato.yml` 31–41 bo'lagi, 41-satr → `target` 10 (CLICK `'cicd-02': { 14: 10 }`).

**Qurish:**
1. Generator `dev/cicd2-matn.py` (cicd1-matn.py dan) · `dev/cicd2-kod.py` (yml'lar, AI yml'lari, `cicd2-out/0N` lokal, RUNS — `cicd1v2-out` 10/11/18 + `cicd2v2-out` 30–41, ko'p job'li run'larda log kaliti `job · step`, `TXT_36B` PR holati).
2. Bo'laklar `cicd2/parts/` yangidan (v1 — `dev/cicd2-v1-parts-zaxira/`): `04-yordam.jsx` (CI/CD-1 dan: `RunView` ko'p job + `job` tanlash, `RunRows`, `Lenta4` kerak emas; yangi: cache zanjiri, PR kartasi, env↔secrets kartasi, services kartasi) · `05-s01-s07.jsx` · `06-s08-s15.jsx` · `07-s16-s25.jsx`.
3. M43: yml sahnalari ≤ 16 satr (bo'laklab), natija kod tagida. M46: ovozda GitHub sahifasi (Actions → run → job → qadam; Settings → Secrets), fayl (`ci.yml`, `scripts/smoke.js`, `README.md`). M47: 4, 8, 14 — oxirgi segment sabab; 14, 18 — yonma-yon.
4. Isbotlar: 7 — `/Cache hit for: node-cache-/i` · 11 — `/(success|yashil|✓|passed)/i` · 20 — `/github\.com\/[^\s\/]+\/[^\s\/]+\/pull\/\d+/`.
5. `LESSON_ID` o'zgarmaydi (M44): `mentor-cicd-02-actions-v1`. CI/CD-1 yakunidagi karta «GitHub Actions: run, log va namunalar» → shu dars (nomi mos).
6. Ovoz keshi → Vercel deploy (ruxsat 04.11).
