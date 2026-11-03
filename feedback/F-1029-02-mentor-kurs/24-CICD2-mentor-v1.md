# Mentor kursi · CI/CD-2 «GitHub Actions: run, log va o'quvchi darsidagi namunalar» — MD v1

F-ID: F-1029-02 (CI/CD-2) · Sana: 2026-11-01 · Holat: **KO'RIKDA** ([GATE M] kutilmoqda) · Fidbek: qator yoniga `>> …`
PRD: `15-CICD2-PRD.md`
Fayl (quriladi): `src/mentor-kurs/GithubActionsMentorLesson.jsx` · bo'laklar `src/mentor-kurs/cicd2/parts/` · dvigatel — umumiy `parts/01–02`
Qonun: `MENTOR_DARS_ETALON.md` M1–M31 · Haqiqiy chiqishlar: `manba/cicd2-out/` — lokal `00–05`, **GitHub Actions run'lari `10–61`** (jamlanma `06-actions-xulosa.md`, linklar `runlar.tsv`, `runlar-api.tsv`) · skript `manba/drive-cicd2-actions.sh` · o'quvchi darsi xaritasi `manba/cicd2-oquvchi-xarita.md`

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | CI/CD birinchi mentor darsini o'tgan mentor: lenta = toza papka + buyruqlar + chiqish kodi; `ci.yml` uch qismi; o'quvchi reposidagi tuzoqlar. Actions oynasini ochib, run logini o'qimagan. |
| Dars oxirida mentor | 1) Actions'da run → job → step ni topadi, GitHub o'zi qo'shadigan qadamlarni ajratadi · 2) qizil run'da sababni izohdan emas, qizil qadam logidan o'qiydi; chiqish kodlarini (1, 127, 254) taniydi · 3) fayl xatosida run darhol qizil va qadamsiz, `runs-on` xatosida cheksiz kutishini, papka xatosida run umuman yo'qligini biladi · 4) o'quvchi darsidagi `matrix`, `cache`, `secrets` namunalarining haqiqiy natijasini biladi va to'g'risini yozadi · 5) m4c-03 ni o'tadi: simulyatsiya bilan haqiqiy Actions farqini aytadi |
| O'quvchi darsi | **m4c-03** «GitHub Actions — yo'l xaritasini yozish» (23 ekran). Oldingi mentor darsi: «CI/CD nima va nega». |
| Kursdagi o'rni | CI/CD nima va nega → **shu** → Telegraf + PostgreSQL (M31: raqamsiz) |
| Til | M9. Yangi atamalar: run (bitta yurish — bitta push), job (ish — o'quvchi darsida «nuqta»), step (qadam — «amal»), log (qadam chiqishi), izoh (annotation — run sahifasidagi qisqa xato), matrix, cache, secret. |
| Misol-ip | O'quvchi reposi (`IntroNestArxitechture` 45071ac + Jest darsidagi `order` testi + tavsiya `ci.yml`) — endi GitHub'da, `main` tarmog'ida 7 run. Yonida o'quvchi darsidagi `ci-mashq` namunasi («Repongiz yo'qmi?»). |
| Haqiqiylik (M10) | 01.11.2026 18:20–18:43 — sinov reposi `kirishnomi4-wq/mentor-ci-sinov` (private), 28 tajriba. Har Actions oynasi — shu run'larning API ma'lumotidan (`gh api` runs/jobs/steps, `gh run view --log`), sahnada «haqiqiy run ma'lumotidan · run #N» (foydalanuvchi qarori 01.11 11:03). Actions sahifasining o'z ko'rinishi (rang, joylashuv) — chizilgan; fayl xatosi sahifalari (#16–#19), run ro'yxati va #2 sahifasi — foydalanuvchi skrinshotlaridan (19:27–19:33) solishtirildi; secret sozlamalari sahifasi ko'rilmagan (⚠). |
| Hajm | **25 ekran** · 5 bosqich · 3 amaliyot · 4 tekshiruv · 8 savol · jami ≈ 1 soat |
| Me'yor | ≤ 5 segment, ≤ 60 so'z, ko'prik, «Xulosa», kalit 8–14 so'z |

---

## A. Darsning tayanchi

**Oldingi CI/CD darsida bor — takrorlanmaydi, faqat ko'prik:** CI/CD tushunchasi · toza papka va chiqish kodi · `on`/`runs-on`/`steps` · checkout keragi · tavsiya `ci.yml` · lint 46 · YAML tahlilchi xabarlari · Delivery/Deployment.

**Bu darsning o'zagi — Actions'ning o'zi (run'lar `cicd2-out/`):**
- **run → job → step** — har push bitta run (`#1 … #27`); faylda `jobs: test:` — bitta job `test`; ichida qadamlar. GitHub o'zi qo'shadi: `Set up job`, `Post Run …`, `Complete job` (`20`).
- **`Set up job` logi** — `Ubuntu 24.04.5 LTS`, `Image: ubuntu-24.04`, `GITHUB_TOKEN Permissions: Contents: read`, `Download action repository 'actions/checkout@v7'` (`20`). Har run'da eslatma: «The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026».
- **`uses` ichida** — checkout: `fetch-depth: 1`, «Deleting the contents of …», `git init`, faqat oxirgi commit · setup-node: «Found in cache @ /opt/hostedtoolcache/node/22.23.4/x64», `node: v22.23.4`, `npm: 10.9.9` (`20`).
- **qizil run** — qizil qadamdan keyingilari `skipped`; izohda faqat `Process completed with exit code N`, sabab — qadam logida. Kodlar: 1 (test, `npm ci`), 127 (`jest: not found`), 254 (npm `ENOENT`), 2 (bash sintaksis), 128 (git) (`21, 23, 24, 13, 16, 17`).
- **fayl xatosi** — `on: once`, `runs-on` yo'q, surilish, `echo "Natija: ok"`: run darhol qizil, job ham, qadam ham, log ham yo'q (`30–32, 34`). `runs-on: my-laptop` — `queued` 20/60/180 s, cheksiz kutadi (`33`). Papka `.github/workflow` (s yo'q) — run umuman yo'q (`18`).
- **o'quvchi darsidagi namunalar** — `matrix` ulanmagan: 3 job, uchalasi Node 22 (`40`), ulangan: 18.20.8 · 20.20.2 · 22.23.4 (`41`) · `cache` `key`siz: `Input required and not supplied: key`, qizil (`50`); `setup-node` `cache: npm`: `npm install` 44 → 45 → 16 s (`51–53`) · `secrets`: `***`, lekin bo'laklab chiqarilsa ochiq; yo'q secret — bo'sh, run yashil (`61`) · begona `print('test')` → `syntax error`, kod 2 (`16`); `git push` → `403`, kod 128 (`17`) · testsiz lenta — yashil (`14`) · `@v4` — yashil, «Node.js 20 is deprecated» (`10`, `25`).

**Lokal (`cicd2-out/00–05`):** «Repongiz yo'qmi?» namunasi `"test": "echo ok && exit 0"`, lock yo'q (`01`); `npm ci` → lock talab qiladi (`02`); qizil uchun `echo xato && exit 1` (`04`); o'quvchi darsidagi 6 `ci.yml` tahlilchida: `matrix` va `key`siz `cache` — xatosiz (xato faqat run'da), `run: echo "Kalit: …"` — `Nested mappings are not allowed in compact mappings` (`05`).

**Darsning ipi:** oldingi darsda yozilgan lenta → Actions oynasi (run, job, step, `uses` ichida) → qizilni o'qish (log, chiqish kodi, install va tartib) → fayl xatolari (run qizil, kutadi yoki yo'q) → o'quvchi darsidagi namunalarning haqiqati (matrix, cache, secrets) → m4c-03 ga ko'prik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich | Run |
|---|---|---|---|---|
| 1 | Kirish | Lesson | — | 20 |
| 2 | Actions oynasi: run ro'yxati | Lesson | 1 · Actions oynasi | 20–26 |
| 3 | Run → job → step | Lesson | 1 | 20 |
| 4 | `uses` ichida: checkout va setup-node | Lesson | 1 | 20 |
| 5 | Tekshiruv 1 — GitHub qo'shgan qadam | MCRetry | 1 | |
| 6 | Amaliyot 1 — o'z run'ingizni o'qish | Practice | 1 | 20 |
| 7 | Qizil run: qadam, log va tuzatish | Lesson | 2 · qizilni o'qish | 21, 22 |
| 8 | Chiqish kodi — qaysi turdagi xato | Lesson | 2 | 21, 24, 13, 16, 17 |
| 9 | O'rnatish qadami qizil: `npm ci` | Lesson | 2 | 23, 11, 26 |
| 10 | Checkout'siz va tartib xato | Lesson | 2 | 13, 24, 26 |
| 11 | Tekshiruv 2 — qaysi satr | LineCheck | 2 | 24 |
| 12 | Amaliyot 2 — tartibni buzish va kod | Practice | 2 | 24, 26 |
| 13 | Fayl xatosi: run darhol qizil | Lesson | 3 · fayl xatolari | 30–32, 34, 61 |
| 14 | Run yo'q yoki cheksiz kutadi | Lesson | 3 | 18, 33 |
| 15 | Tekshiruv 3 — sariq run | MCRetry | 3 | |
| 16 | matrix | Lesson | 4 · o'quvchi darsidagi namunalar | 40, 41 |
| 17 | cache | Lesson | 4 | 50–53 |
| 18 | secrets | Lesson | 4 | 60, 61 |
| 19 | Amaliyot 3 — matrix'ni ulash | Practice | 4 | 41 |
| 20 | Tekshiruv 4 — `key`siz cache | MCRetry | 4 | |
| 21 | m4c-03 xaritasi | Lesson | 5 · ko'prik | — |
| 22 | Simulyatsiya va haqiqiy Actions | Lesson | 5 | 10, 12, 14, 16, 17 |
| 23 | O'quvchi darsidagi so'zlar va sinfdagi holatlar | Lesson | 5 | — |
| 24 | O'z-sinov — 8 savol | Screen27 | — | |
| 25 | Yakun | Screen28 | — | |

**Sahna turlari:** Actions oynasi (run ro'yxati · run ichida job va qadamlar · qadam logi; «haqiqiy run ma'lumotidan · run #N») + VS Code `IntroNestArxitechture` (Explorer, `.github/workflows/ci.yml`) + YAML kartasi (tahlilchi xabari) + o'lchov jadvali.

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · CI/CD` · Sarlavha: **Lenta yozildi. Endi uni GitHub'da ochib, qizilini o'qiymiz**
- Sahna: reja (5 bosqich); natija — Actions run ro'yxati, `main` tarmog'i, 7 run (`#1 ci: lenta` ✓ … `#7 ci: tavsiya` ✓) — haqiqiy run ma'lumotidan.
- Reja: 01 Actions oynasi · 02 Qizilni o'qish · 03 Fayl xatolari · 04 O'quvchi darsidagi namunalar · 05 O'quvchi darsini o'tish
1. **Oldingi darsdagi lentani GitHub'ga qo'ydik va 28 tajriba qildik**
   Ovoz: «Assalomu alaykum. Oldingi darsda lenta faylini yozdik va terminalda sinadik. Bu safar uni haqiqiy GitHub'ga qo'ydik: o'quvchi reposining nusxasida yigirma sakkiz tajriba, har birining logi bilan.»
2. **Avval Actions oynasi: run, job va qadam, keyin qizil run logi**
   Ovoz: «Avval Actions oynasini o'qishni o'rganamiz: run, job va qadam. Keyin qizil run'ni o'qiymiz: sabab qayerda yozilgan va chiqish kodi nimani bildiradi.» · reja 01–02
3. **Keyin fayl xatolari va o'quvchi darsidagi matrix, cache, secrets haqiqati**
   Ovoz: «Keyin fayl xatolarini ko'ramiz: ba'zida run umuman boshlanmaydi. So'ng o'quvchi darsidagi matrix, cache va secrets namunalarini GitHub'da yurgizib ko'ramiz. Natijalarning ba'zisi kutilmagan.» · reja 03–05
4. **Xulosa: besh bosqich, uch amaliyot; ustoz gapirib bo'lgach Davom ochiladi**
   Ovoz: «Dars besh bosqichdan iborat, uchta amaliyot bor, hammasi o'z reposingizda. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.»
- Manba: `cicd2-out/runlar-api.tsv` (run #1–#7, `main`).

---

## 2 · Actions oynasi: run ro'yxati  ← `Lesson`
- Kicker: `1-bosqich · Actions oynasi` · Sarlavha: **Har push — bitta run: ro'yxatda commit xabari, belgi va vaqt**
- Sahna: Actions — run ro'yxati (`main`, run #1–#7, API):
  | # | Belgi | Nom (commit xabari) | Workflow | Tarmoq | Hodisa | Vaqt |
  |---|---|---|---|---|---|---|
  | 1 | ✓ | ci: lenta (CI/CD-1 tavsiya) | CI | main | push | 46 s |
  | 2 | ✗ | sinov: buzildi | CI | main | push | 1 daq 5 s |
  | 3 | ✓ | tuzatildi | CI | main | push | 1 daq 8 s |
  | 4 | ✗ | ci: npm ci | CI | main | push | 15 s |
  | 5 | ✗ | ci: tartib xato | CI | main | push | 9 s |
  | 6 | ✓ | ci: v4 (o'quvchi darsidagi) | CI | main | push | 1 daq 10 s |
  | 7 | ✓ | ci: tavsiya | CI | main | push | 46 s |
  Vaqt — API'dagi `createdAt → updatedAt` (navbat bilan birga).
1. **Repo sahifasidagi Actions bo'limi: har push'dan keyin yangi qator — run**
   Ovoz: «Rejani ko'rdingiz, endi oynaning o'zini ochamiz. GitHub'da repo sahifasida Actions bo'limi bor. Har push'dan keyin u yerda yangi qator paydo bo'ladi. Bu qator run deyiladi: lentaning bitta yurishi.»
2. **Qator nomi — commit xabari; yonida workflow nomi, tarmoq va push**
   Ovoz: «Qatorning nomi commit xabaringiz. Uning yonida workflow nomi turadi, ya'ni faylning birinchi qatoridagi name: CI. Keyin tarmoq va hodisa, bu yerda push. Shuning uchun commit xabarini tushunarli yozing.»
3. **Belgi: yashil belgi — hammasi o'tdi, qizil xoch — qaysidir qadam yiqildi**
   Ovoz: «Chap tomonda belgi turadi: yashil belgi hamma qadam o'tdi degani, qizil xoch qaysidir qadam yiqildi degani. Vaqtga ham qarang: to'qqiz soniyalik qizil run odatda o'rnatishgacha ham yetmagan.»
4. **Xulosa: run'lar tarixi saqlanadi — qizil va undan keyingi yashil ketma-ket ko'rinadi**
   Ovoz: «Xulosa: har push bitta run yaratadi va bu tarix saqlanib qoladi. Ikkinchi run qizil, uchinchisi yashil: xato topildi va tuzatildi. O'quvchi ishini ham shu ro'yxatdan ko'rasiz.»
- Manba: `cicd2-out/runlar-api.tsv` (`gh run list --json`), `20–26`.

## 3 · Run → job → step  ← `Lesson`
- Kicker: `1-bosqich · Actions oynasi` · Sarlavha: **Run ichida job, job ichida qadamlar; uchtasini GitHub o'zi qo'shadi**
- Sahna: chapda `ci.yml` (tavsiya), o'ngda run #1 ichi: job `test` ✓ · runner `ubuntu-latest` · qadamlar (API, soniya):
  `Set up job` 1 · `Run actions/checkout@v7` 1 · `Run actions/setup-node@v7` 0 · `Run npm install` 34 · `Run npm test` 1 · `Run npm run build` 3 · `Post Run actions/setup-node@v7` 1 · `Post Run actions/checkout@v7` 0 · `Complete job` 0.
  Xulosa qadamida: o'quvchi darsi so'zlari — yo'l xaritasi = `ci.yml` · nuqta = job · amal = step.
1. **Run ichida job ro'yxati: faylda `jobs: test:` — bitta job `test`**
   Ovoz: «Ro'yxatdagi birinchi run'ni ochamiz. Chap tomonda job'lar ro'yxati turadi. Faylda jobs ostida bitta nom bor, test. Shuning uchun job ham bitta: test. Ikkita nom yozilsa, ikkita job bo'lardi.»
2. **Job ichida qadamlar: har `uses` va `run` — `Run …` nomli qadam**
   Ovoz: «Job ichida esa qadamlar bor. Faylingizdagi har qator qadamga aylangan, oldiga Run so'zi qo'shilgan: run actions checkout, run npm install, run npm test. Eng uzuni o'rnatish qadami, u o'ttiz to'rt soniya davom etdi.»
3. **`Set up job`, `Post …`, `Complete job` — faylda yo'q, GitHub o'zi qo'shadi**
   Ovoz: «Faylda yo'q qadamlar ham bor. Set up job mashinani tayyorlaydi, Post qadamlari uses'dan keyin tozalaydi, Complete job yakunlaydi. Ularni GitHub o'zi qo'shadi, siz yozmaysiz.»
4. **Xulosa: o'quvchi «nuqta» desa — job, «amal» desa — qadam**
   Ovoz: «Xulosa: run ichida job, job ichida qadam. O'quvchi darsida nuqta va amal so'zlari ishlatiladi: nuqta bu job, amal bu qadam. Oynada ularni shu nomlar bilan ko'rsating.»
- Manba: `cicd2-out/20-nest-yashil.txt` («job → step» bo'limi), `cicd1-yml/2-tavsiya.yml`.

## 4 · `uses` ichida: checkout va setup-node  ← `Lesson`
- Kicker: `1-bosqich · Actions oynasi` · Sarlavha: **`uses` qadamining logi — tayyor qadam ichida nima bo'lganini aytadi**
- Sahna: qadam logi (run #1, qisqartirilgan, haqiqiy):
  ```
  Set up job
    Operating System: Ubuntu 24.04.5 LTS
    Image: ubuntu-24.04 · Version: 20261025.353.1
    GITHUB_TOKEN Permissions: Contents: read
    Download action repository 'actions/checkout@v7' (SHA:3d3c42e5…)
  Run actions/checkout@v7
    fetch-depth: 1
    Deleting the contents of '/home/runner/work/mentor-ci-sinov/mentor-ci-sinov'
    git init … · git fetch --depth=1 origin … · git checkout --force -B main
  Run actions/setup-node@v7
    node-version: 22
    Found in cache @ /opt/hostedtoolcache/node/22.23.4/x64
    node: v22.23.4 · npm: 10.9.9
  ```
  Pastda GitHub eslatmasi (har run'da): «The ubuntu-latest label will migrate to Ubuntu 26 beginning October 19, 2026».
1. **`uses` — boshqalar yozgan tayyor qadam; `Set up job` uni yuklab oladi**
   Ovoz: «Qadamlar ichiga kiramiz. Uses qadami boshqalar yozgan tayyor dastur. Set up job logida ko'rinadi: GitHub actions checkout'ni o'z reposidan yuklab oldi. Shu yerda mashina ham yozilgan: Ubuntu yigirma to'rt.»
2. **checkout: papkani tozalaydi va repodan faqat oxirgi commit'ni oladi**
   Ovoz: «Checkout logiga qaraymiz: u avval ish papkasini tozalaydi, keyin git init qiladi va repodan faqat oxirgi commit'ni oladi, fetch depth bir. Shuning uchun lentada git tarixi yo'q, faqat joriy kod.»
3. **setup-node: Node 22 mashinada tayyor turibdi — o'rnatish soniyadan kam**
   Ovoz: «Setup node qadamida node version yigirma ikki so'radik. Mashinada u tayyor turgan ekan: found in cache. Natijada node yigirma ikki va npm o'n o'rnatilgan. Sizning kompyuteringizdagi npm versiyasidan farq qilishi mumkin.»
4. **Xulosa: `uses` qadami tushunarsiz bo'lsa — logini oching, u nima qilganini aytadi**
   Ovoz: «Xulosa: uses qadami qora quti emas. Logini ochsangiz, nima qilganini qadamma-qadam aytadi. GitHub yana bir narsani eslatadi: ubuntu latest Ubuntu yigirma oltiga o'tkazilmoqda, versiya o'zgarishi mumkin.»
- Manba: `cicd2-out/20-nest-yashil.txt` (log: `Set up job`, `Run actions/checkout@v7`, `Run actions/setup-node@v7`; izoh `[notice]`).

## 5 · Tekshiruv 1 — GitHub qo'shgan qadam  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Run'dagi qaysi qadam `ci.yml`da yozilmagan — uni GitHub o'zi qo'shgan?**
- Ovoz: «Qadamlarni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Run ichidagi qaysi qadam faylingizda yozilmagan, uni GitHub o'zi qo'shgan? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 Run npm install · 2 Set up job · 3 Run actions/checkout@v7 · 4 Run npm test
- To'g'ri (ovoz, `ok`): «To'g'ri. Set up job faylda yo'q: GitHub mashinani tayyorlaydi va uses qadamlarini yuklab oladi. Post qadamlari va Complete job ham GitHub'niki. Demak, run'dagi hamma qadam ham sizning faylingizdan emas: tayyorlash va tozalash qadamlarini GitHub o'zi qo'shadi.» · qisqa: «`Set up job` — GitHub'niki: mashina va `uses` qadamlarini tayyorlaydi.»
- Xato izohlari: 1 — «Bu sizning `run: npm install` qatoringiz.» · 3 — «Bu sizning `uses: actions/checkout@v7` qatoringiz.» · 4 — «Bu sizning `run: npm test` qatoringiz.»
- Maslahat: «Faylingizdagi qatorlar oldiga `Run` qo'shiladi. Qaysi nomda `Run` yo'q?»
- Manba: `cicd2-out/20` (qadamlar ro'yxati).

---

## 6 · Amaliyot 1 — o'z run'ingizni o'qish  ← `Practice`
- Kicker: `Amaliyot 1 / 3` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **O'z reposingizdagi oxirgi run: job, qadamlar va Node versiyasi** · `tableAt: 3`
1. **Endi siz: oldingi darsda lenta qo'shgan reposingizdagi run'ni ochasiz**
   Ovoz: «Endi navbat sizga. Oldingi darsda lenta qo'shgan reposingizni oching. Lenta bo'lmasa, avval tavsiya faylini qo'shib push qiling. Bunga o'n daqiqa ketadi.»
2. **1–2-qadam: Actions → oxirgi run → job `test` va qadamlar ro'yxati**
   Ovoz: «Birinchi qadamda Actions bo'limida oxirgi run'ni ochasiz. Ikkinchisida job test'ni bosib, qadamlarni sanaysiz: siz yozganlari qaysi, GitHub qo'shganlari qaysi.»
3. **3–4-qadam: `Set up job` dagi Ubuntu, `setup-node` dagi `node:` satri — isbot**
   Ovoz: «Uchinchi qadamda Set up job'ni ochib, Ubuntu versiyasini topasiz. To'rtinchisida setup node qadamidagi environment details guruhini ochasiz. Undagi node satrini isbot maydoniga qo'ying.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz o'z run'ingizda qaysi qadamni o'zingiz yozganingizni va qaysini GitHub qo'shganini ajrata olasiz.»
- Qadamlar:
  | # | Qadam | Qayerda | Kutilgan |
  |---|---|---|---|
  | 1 | Run | GitHub → repo → **Actions** → oxirgi run | ✓ yoki ✗ belgili qator |
  | 2 | Job | job `test` → qadamlar | `Set up job` … `Complete job` |
  | 3 | Mashina | `Set up job` → `Operating System` | `Ubuntu 24.04.5 LTS` (yoki yangiroq) |
  | 4 | Node | `Run actions/setup-node@v7` → `Environment details` | `node: v22.…` |
- Isbot: «`setup-node` logidagi `node:` satri» · placeholder: «node satrini qo'ying» · KOD: `/^\s*node:\s*v\d+\.\d+\.\d+\s*$/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Actions'da run umuman yo'q | fayl `.github/workflows/` da emas (s harfi) yoki push qilinmagan (14-ekran) |
  | Run sariq, «kutmoqda» | `runs-on`da GitHub'da yo'q mashina nomi (14-ekran) |
  | Ubuntu 26 chiqdi | `ubuntu-latest` yangilangan — GitHub eslatgan o'tish; xato emas |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `cicd2-out/20` (`Operating System`, `Environment details`), `18`, `33`.

---

## 7 · Qizil run: qadam, log va tuzatish  ← `Lesson`
- Kicker: `2-bosqich · qizilni o'qish` · Sarlavha: **Qizil run'da sabab izohda emas — qizil qadamning logida**
- Sahna: run #2 «sinov: buzildi» (API): job `test` ✗ · `Run actions/checkout@v7` ✓ · `Run actions/setup-node@v7` ✓ · `Run npm install` ✓ 57 s · `Run npm test` ✗ · `Run npm run build` ○ skipped · `Post Run actions/setup-node@v7` ○ skipped · `Post Run actions/checkout@v7` ✓ · `Complete job` ✓. Tepada izoh: `Process completed with exit code 1.`
  `npm test` logi (haqiqiy):
  ```
  FAIL src/order.spec.ts
    orderTotal
      ✕ 2 kitob narxini hisoblaydi (4 ms)
      Expected: 20000
      Received: 10002
  Tests:       1 failed, 1 total
  ##[error]Process completed with exit code 1.
  ```
  Xulosa qadamida (M3): run #3 «tuzatildi» ✓ — `price * quantity`, `Tests: 1 passed, 1 total`, build ✓.
1. **Oldingi darsdagi buzish endi GitHub'da: ko'paytirish o'rniga qo'shish, push**
   Ovoz: «Yashil run'ni o'qidik, endi qizil run'ni ko'ramiz. Oldingi darsda terminalda qilgan buzishni GitHub'ga push qildik: ko'paytirish o'rniga qo'shish. Ro'yxatda ikkinchi run qizil xoch bilan chiqdi.»
2. **Qizil qadam — `npm test`; build va `Post setup-node` — kulrang, yurmadi**
   Ovoz: «Run ichida npm test qadami qizil. Undan keyingi build kulrang, skipped, ya'ni yurmadi. Setup node'ning tozalash qadami ham yurmadi. Lenta birinchi qizilda to'xtaydi, terminaldagi kabi.»
3. **Izohda faqat «exit code 1»; sabab — qadam logida: `Expected` va `Received`**
   Ovoz: «Run sahifasi tepasida izoh bor: process completed with exit code bir. Bu sabab emas, faqat kod. Sababni qizil qadam logidan o'qiymiz: expected yigirma ming, received o'n ming ikki.»
4. **Xulosa: qizil qadamni oching, logdagi xabarni o'qing — tuzatgach run yashil**
   Ovoz: «Xulosa: avval qizil qadamni oching, xabarni logdan o'qing, izohdan emas. Xatoni tuzatib push qildik: uchinchi run yashil, tests bir passed, build ham o'tdi.»
- Manba: `cicd2-out/21-nest-test-qizil.txt`, `22-nest-tuzatildi-yashil.txt`.

## 8 · Chiqish kodi — qaysi turdagi xato  ← `Lesson`
- Kicker: `2-bosqich · qizilni o'qish` · Sarlavha: **Izohdagi son xato turini aytadi: 1, 127, 254, 2, 128**
- Sahna: jadval — run'lardagi haqiqiy kodlar (izoh `Process completed with exit code N`):
  | Kod | Qadam | Logdagi xabar | Run |
  |---|---|---|---|
  | 1 | `npm test` | `FAIL` · `Expected` / `Received` | 21 |
  | 1 | `npm ci` | `npm error code EUSAGE` · `in sync` | 23 |
  | 127 | `npm test` | `sh: 1: jest: not found` | 24 |
  | 254 | `npm install` | `npm error enoent Could not read package.json` | 13 |
  | 2 | `print('test')` | `syntax error near unexpected token` | 16 |
  | 128 | `git push` | `fatal: unable to access … 403` | 17 |
  Xulosa qadamida: formulasi — qizil qadam → kod → logdagi birinchi `error` satri.
1. **Izohdagi son — qadam qaytargan chiqish kodi; u xato turini taxminan aytadi**
   Ovoz: «Qizil run'larda izoh doim bir xil: process completed with exit code va son. Bu son qizil qadamning chiqish kodi. Biz yigirma sakkiz tajribada beshta turli kod ko'rdik.»
2. **Kod 1 — buyruq yurdi va «yo'q» dedi: test yiqildi yoki `npm ci` rad etdi**
   Ovoz: «Kod bir shuni bildiradi: buyruq ishga tushdi va o'zi yo'q dedi. Masalan test yiqildi yoki npm ci lock fayl mos emas dedi. Eng ko'p uchraydigani shu.»
3. **127 — buyruq topilmadi; 254 — npm fayl topmadi; 2 va 128 — bash va git**
   Ovoz: «Yuz yigirma yetti bo'lsa, buyruq umuman topilmagan, masalan jest o'rnatilmagan. Ikki yuz ellik to'rt bo'lsa, npm package json'ni topmagan. Ikki bo'lsa, bash qatorni tushunmagan. Yuz yigirma sakkiz esa git xatosi.»
4. **Xulosa: kod — yo'nalish, sabab — logdagi birinchi `error` satri**
   Ovoz: «Xulosa: kod yo'nalish beradi, sababni esa logdagi birinchi error satri aytadi. O'quvchi «qizil» desa, avval qaysi qadam va qaysi kod deb so'rang.»
- Manba: `cicd2-out/21`, `23`, `24`, `13`, `16`, `17` (izohlar va loglar).

## 9 · O'rnatish qadami qizil: `npm ci`  ← `Lesson`
- Kicker: `2-bosqich · qizilni o'qish` · Sarlavha: **`npm ci` ikki xil yiqiladi: lock eskirgan yoki lock umuman yo'q**
- Sahna: ikki karta (qadam `Run npm ci` ✗, keyingilari skipped):
  - o'quvchi reposi (run `23`, 15 s): `npm error code EUSAGE` · «`npm ci` can only install packages when your package.json and package-lock.json … are in sync» · `Missing: @nestjs/jwt@11.0.2 from lock file`
  - `ci-mashq` namunasi (run `11`): `npm error code EUSAGE` · «The `npm ci` command can only install with an existing package-lock.json …»
  Xulosa qadamida (M3): `run: npm install` → run #7 ✓ (`added 759 packages`).
1. **Oldingi darsda terminalda ko'rgan `in sync` — GitHub'da ham birinchi qadamda qizil**
   Ovoz: «Kodlarni bildik, endi eng ko'p uchraydigan qizilni ko'ramiz: o'rnatish qadami. Oldingi darsda terminalda ko'rgan in sync xatosi GitHub'da ham chiqdi. Run o'n besh soniyada qizil, test'gacha yetmadi.»
2. **O'quvchi reposi: lock fayl eskirgan — `Missing: … from lock file`**
   Ovoz: «O'quvchi reposida lock fayl bor, lekin eskirgan: package json'dagi paketlar unda yo'q. Xabarda missing from lock file qatorlari turadi. npm ci bunday holatda hech narsa o'rnatmaydi.»
3. **«Repongiz yo'qmi?» namunasi: lock umuman yo'q — xabar boshqacha**
   Ovoz: «O'quvchi darsidagi «Repongiz yo'qmi» namunasida lock fayl umuman yo'q. Xabar ham boshqacha: npm ci faqat mavjud package lock bilan ishlaydi. Ikkalasining kodi bir, sababini xabardan ajratasiz.»
4. **Xulosa: bu repolarda `npm install` yozing — run yashil, 759 paket**
   Ovoz: «Xulosa: o'quvchi repolarida npm install yozing. Shu bilan run yashil bo'ldi, yetti yuz ellik to'qqiz paket o'rnatildi. npm ci kerak bo'lsa, avval lock faylni yangilab push qilish kerak.»
- Manba: `cicd2-out/23-nest-npm-ci.txt`, `11-mashq-npm-ci-lock-yoq.txt`, `26-nest-tavsiya-yashil.txt`; lokal `02`.

## 10 · Checkout'siz va tartib xato  ← `Lesson`
- Kicker: `2-bosqich · qizilni o'qish` · Sarlavha: **Qadam yo'q yoki joyi xato: `Could not read package.json` va `jest: not found`**
- Sahna: ikki run:
  - checkout yo'q (run `13`): qadamlar `Run actions/setup-node@v4` ✓ · `Run npm install` ✗ · `Run npm test` ○ — log: `npm error path /home/runner/work/mentor-ci-sinov/mentor-ci-sinov/package.json` · `npm error enoent Could not read package.json` · kod 254
  - `npm test` `npm install`dan oldin (run `24`): `Run npm test` ✗ (0 s) · `Run npm install` ○ · `Run npm run build` ○ — log: `> jest` · `sh: 1: jest: not found` · kod 127
  Xulosa qadamida (M3): tavsiya tartibi `checkout → setup-node → npm install → npm test → npm run build` → run #7 ✓.
1. **Checkout'siz lenta: oldingi darsdagi bo'sh papka GitHub'da ham bo'sh**
   Ovoz: «O'rnatishdan oldin yana bir qizil bor. Oldingi darsda bo'sh papkada package json topilmagan edi. GitHub'da checkout qadamini olib tashladik: xuddi shu xato, kodi ikki yuz ellik to'rt.»
2. **Logdagi yo'l — mashinadagi ish papkasi; u yerda repo kodi yo'q**
   Ovoz: «Logdagi yo'lga qarang: home runner work va repo nomi. Bu mashinadagi ish papkasi. Checkout bo'lmasa, u bo'sh qoladi va npm package json'ni topmaydi.»
3. **Tartib xato: `npm test` o'rnatishdan oldin — `jest: not found`, kod 127**
   Ovoz: «Ikkinchi holat: npm test'ni npm install'dan oldinga qo'ydik. Jest hali o'rnatilmagan, shuning uchun jest not found chiqdi, kodi yuz yigirma yetti. Qadam nol soniyada yiqildi.»
4. **Xulosa: tartib — checkout, setup-node, `npm install`, `npm test`, build; run yashil**
   Ovoz: «Xulosa: tartib doim bir xil: checkout, setup node, npm install, npm test, build. Tavsiya fayli shu tartibda, run yashil. Endi xato satrni o'zingiz topasiz.»
- Manba: `cicd2-out/13-mashq-checkoutsiz.txt`, `24-nest-tartib-xato.txt`, `26-nest-tavsiya-yashil.txt`.

## 11 · Tekshiruv 2 — qaysi satr  ← `LineCheck`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4` · Sarlavha: **Logda `sh: 1: jest: not found`, kod 127. Qaysi satr sabab?**
- Shart (`task`): «Run qizil: `Run npm test` qadami 0 soniyada yiqildi, logda `jest: not found`. **Sababchi satrni bosing.**»
- Ovoz (`q`): «Tartib xatosini ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Run qizil, npm test qadami nol soniyada yiqildi, logda jest not found. Faylning qaysi satri sabab? Shu satrni bosing.»
- Fayl: `.github/workflows/ci.yml` (run `24`):
  ```yaml
  1  name: CI
  2  on: push
  3  jobs:
  4    test:
  5      runs-on: ubuntu-latest
  6      steps:
  7        - uses: actions/checkout@v7
  8        - uses: actions/setup-node@v7
  9          with:
  10           node-version: 22
  11       - run: npm test        ← xato satr
  12       - run: npm install
  13       - run: npm run build
  ```
- Tuzatilgan (`fixed`): 11–12-satr o'rin almashadi: `npm install` → `npm test` (yashil); `fixedExtra`: run #7 qadamlari ✓ (`Run npm install` 34 s · `Run npm test` · `Run npm run build`).
- To'g'ri (ovoz, `ok`): «To'g'ri. O'n birinchi satr: npm test o'rnatishdan oldin turibdi, jest hali yo'q. Uni npm install'dan keyinga qo'yamiz. Ekranda tuzatilgan tartib va yashil run. Demak, qadam nol soniyada yiqilsa, avval qadamlar tartibini tekshiring.»
- Qisqa (`okShort`): «11-satr: `npm test` o'rnatishdan oldin — `npm install`dan keyinga.»
- Maslahat (`hint`): «`jest` qayerdan keladi? Uni qaysi buyruq o'rnatadi va u qaysi satrda?»
- Manba: `cicd2-out/24`, `26`.

## 12 · Amaliyot 2 — tartibni buzish va kod  ← `Practice`
- Kicker: `Amaliyot 2 / 3` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **Tartibni ataylab buzing: qizil qadam, kod va tuzatish** · `tableAt: 3`
1. **Endi siz: qadamlar tartibini buzasiz va izohdagi kodni o'qiysiz**
   Ovoz: «Endi o'z reposingizda tartibni buzasiz. Oldingi darsda testni buzgandingiz, bu safar faylni buzasiz. Bunga o'n daqiqa ketadi.»
2. **1–2-qadam: `npm test` qatorini `npm install`dan oldinga ko'chiring, push**
   Ovoz: «Birinchi qadamda ci yml'dagi npm test qatorini npm install'dan oldinga ko'chirasiz. Ikkinchisida commit va push qilib, Actions'da yangi run qizil bo'lishini kutasiz.»
3. **3–4-qadam: qizil qadamdagi kod — isbot; keyin tartibni tiklang, yashil**
   Ovoz: «Uchinchi qadamda run sahifasidagi izohdan chiqish kodini o'qib, isbot maydoniga yozasiz. To'rtinchisida tartibni tiklab, push qilasiz va yashil run'ni kutasiz.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, qadamlar tartibi buzilganda qaysi kod chiqishini o'z run'ingizda ko'rdingiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Buzish | `ci.yml`: `- run: npm test` → `- run: npm install` dan oldinga | fayl saqlandi |
  | 2 | Push | `git commit -am "sinov: tartib"` · `git push` | Actions'da qizil |
  | 3 | O'qish | qizil `Run npm test` · izoh | `jest: not found` va kod |
  | 4 | Tuzatish | tartibni tiklang · commit · push | yashil |
- Isbot: «3-qadamdagi chiqish kodi (izohdagi son)» · placeholder: «izohdagi sonni yozing» · KOD: `/^\s*127\s*$/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Run yashil qoldi | o'zgarish push qilinmagan yoki `npm test` qatori hali ham `npm install`dan keyin |
  | Kod 1, `jest: not found` emas | testlar yiqildi — avvalgi buzish tuzatilmagan (`Expected`/`Received`ni o'qing) |
  | Run umuman boshlanmadi | qator ko'chirilganda surilish buzilgan (13-ekran) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `cicd2-out/24` (`exit code 127`), `26`.

---

## 13 · Fayl xatosi: run darhol qizil  ← `Lesson`
- Kicker: `3-bosqich · fayl xatolari` · Sarlavha: **Fayl o'qilmasa run darhol qizil: job ham, qadam ham, log ham yo'q**
- Sahna: to'rt karta — buzilgan qator · tahlilchi xabari · **GitHub izohi** (run sahifasi skrinshotlari, foydalanuvchi 01.11 19:27–19:33; har run 0 s, job yo'q):
  - `on: once` (#16, `30`) → tahlilchi `(Line: 2, Col: 5): Unexpected value 'once'` · GitHub `Invalid workflow file: .github/workflows/ci.yml#L1` — `(Line: 2, Col: 5): Unexpected value 'once'` (aynan)
  - `runs-on` yo'q (#17, `31`) → `(Line: 5, Col: 5): Required property is missing: runs-on` · GitHub — aynan
  - `- run:` surilgan (#18, `32`) → tahlilchi `A block sequence may not be used as an implicit map key at line 8` · GitHub `…#L4` — `You have an error in your yaml syntax on line 4`
  - `run: echo "Natija: ok"` (#19, `34`) → tahlilchi `Nested mappings are not allowed in compact mappings at line 8` · GitHub `…#L8` — `You have an error in your yaml syntax on line 8`
  Run #18 sahifasi (`32`, foydalanuvchi skrinshoti 01.11 19:27): «yaml: surilish #18» · Status `Failure` · Total duration `–` · «This workflow graph cannot be shown» · **Annotations · 1 error: `Invalid workflow file: .github/workflows/ci.yml#L4` — «You have an error in your yaml syntax on line 4»**. Fayl yonida, 4 va 8-qator ajratilgan: GitHub 4-qatorni (`test:` — blok boshi) ko'rsatdi, xato 8-qatorda (`- run: npm test`); tahlilchi — `at line 8, column 1` (`07`).
  Xulosa qadamida (M3): `run: |` blokida yozilgan `echo "Kalit: …"` → run `61` ✓ (qadam yurdi).
1. **Oldingi darsda tahlilchida ko'rgan uch xato — GitHub'da qanday ko'rinadi**
   Ovoz: «Qadamdagi xatolarni ko'rdik, endi faylning o'zidagi xato. Oldingi darsda uch YAML xatosini tahlilchida ko'rgan edik. Endi o'shalarni GitHub'ga push qildik.»
2. **Run darhol qizil: nol soniya, ichida job ham, qadam ham, log ham yo'q**
   Ovoz: «Natijada run ro'yxatda paydo bo'ladi va shu zahoti qizil bo'ladi. Ichida job yo'q, qadam yo'q, log yo'q. Mashina ishga ham tushmagan, chunki GitHub faylni o'qiy olmadi.»
3. **Izohda «Invalid workflow file», qator 4 — xato esa 8-qatorda**
   Ovoz: «Run sahifasida izoh bor: invalid workflow file. On once va runs on xatosida matn tahlilchidagi bilan bir xil. Surilishda esa faqat yaml syntax va to'rtinchi qator deyiladi. Xato aslida sakkizinchi qatorda: GitHub blok boshini, test job'ini ko'rsatdi.»
4. **To'rtinchi xato: `echo` ichidagi ikki nuqta — qo'shtirnoqsiz qatorda YAML'ni buzadi**
   Ovoz: «To'rtinchi xato kutilmagan edi: run echo natija ikki nuqta ok qatori. Qatordagi ikki nuqta va bo'sh joy YAML uchun yangi kalit degani. Tahlilchi nested mappings deydi, GitHub'da run darhol qizil.»
5. **Xulosa: qadamsiz qizil run — fayl xatosi; aniq qatorni tahlilchida toping, `run: |` bilan yozing**
   Ovoz: «Xulosa: qadami yo'q qizil run ko'rsangiz, bu fayl xatosi. GitHub ko'rsatgan qatordan pastroqqa ham qarang, aniq qatorni tahlilchi beradi. Ikki nuqtali buyruqni run va tik chiziqdan keyingi qatorga yozing: shunday run yurdi.»
- Manba: `cicd2-out/30–32`, `34` (`gh run view`, jobs API bo'sh), **`30`, `31`, `32`, `34-actions-sahifa-skrinshot.png`** (run #16–#19 sahifalari), `07-yml-30-34-tahlil.txt` (shu fayllar tahlilchida), `05-yml-tahlil.txt`, `cicd1-out/10`; tuzatish — `61` (`run: |`).

## 14 · Run yo'q yoki cheksiz kutadi  ← `Lesson`
- Kicker: `3-bosqich · fayl xatolari` · Sarlavha: **Papka nomi xato — run yo'q; `runs-on` xato — run cheksiz kutadi**
- Sahna: ikki holat:
  - `.github/workflow/ci.yml` (s yo'q, `18`): push'dan 90 s keyin — `gh run list --commit …` → 0 ta run
  - `runs-on: my-laptop` (`33`): 20 s — `queued` · 60 s — `queued` · 180 s — `queued`; job `test` · `labels=my-laptop`; qo'lda bekor qilindi → `cancelled`
  Xulosa qadamida (M3): `.github/workflows/` + `runs-on: ubuntu-latest` → run #7 ✓.
1. **Qizildan ham yomoni bor: run umuman yo'q yoki tugamaydi**
   Ovoz: «Qizil run hech bo'lmasa ko'rinadi. Ikki holatda esa qizil ham yo'q. Birinchisi: papka nomida bitta harf xato, workflow o'rniga workflow, s harfisiz.»
2. **`.github/workflow` — GitHub faylni ko'rmaydi: Actions'da hech narsa paydo bo'lmaydi**
   Ovoz: «Push qildik va bir yarim daqiqa kutdik: run soni nol. GitHub faylni faqat workflows papkasidan qidiradi. Xato xabari ham yo'q, shuning uchun o'quvchi uzoq qidiradi.»
3. **`runs-on: my-laptop` — bunday mashina yo'q, run uch daqiqadan keyin ham kutmoqda**
   Ovoz: «Ikkinchi holat o'quvchi darsidagi noto'g'ri variantdan chiqadi: runs on my laptop. Tahlilchi buni xato demaydi. GitHub esa shu nomli mashinani kutadi: uch daqiqadan keyin ham queued. Biz uni qo'lda bekor qildik.»
4. **Xulosa: run yo'q — papka nomi; run sariq va kutmoqda — `runs-on` nomi**
   Ovoz: «Xulosa: run umuman yo'q bo'lsa, papka nomini tekshiring. Run sariq bo'lib kutib tursa, runs on qatorini tekshiring. To'g'ri fayl workflows papkasida va ubuntu latest bilan: run yashil.»
- Manba: `cicd2-out/18-papka-nomi-xato.txt`, `33-yaml-runs-on-my-laptop.txt`, `26`.

## 15 · Tekshiruv 3 — sariq run  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **O'quvchi: «Push qildim, run o'n daqiqadan beri sariq, kutmoqda». Sabab?**
- Ovoz: «Kutib turgan run'ni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi push qildi, run o'n daqiqadan beri sariq, kutmoqda. Eng ehtimolli sabab nima? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Testlar juda sekin · 2 Fayl `.github/workflow` papkasida · 3 `runs-on`da GitHub'da yo'q mashina nomi · 4 Checkout qadami yo'q
- To'g'ri (ovoz, `ok`): «To'g'ri. Runs on'da GitHub'da yo'q nom yozilgan, masalan my laptop. Run shu mashinani kutadi va o'zi tugamaydi. Nomni ubuntu latest qilib, eski run'ni bekor qiling. Demak, run sariq bo'lib tugamasa, sabab ko'pincha runs on'dagi nomda.» · qisqa: «Cheksiz kutish — `runs-on` nomi: `ubuntu-latest` qiling.»
- Xato izohlari: 1 — «Testlar sekin bo'lsa, run sariq emas, «yurmoqda» holatida bo'ladi.» · 2 — «Papka xato bo'lsa, run umuman paydo bo'lmaydi.» · 4 — «Checkout'siz run tez qizil bo'ladi, kutib turmaydi.»
- Maslahat: «Run ishga tushmagan — mashina topilmagan. Mashinani qaysi qator tanlaydi?»
- Manba: `cicd2-out/33`, `18`, `13`.

---

## 16 · matrix  ← `Lesson`
- Kicker: `4-bosqich · o'quvchi darsidagi namunalar` · Sarlavha: **O'quvchi darsidagi `matrix`: uch job yashil, lekin uchalasida Node 22**
- Sahna: chapda o'quvchi darsi `ci.yml` (s13): `strategy: matrix: node: [18, 20, 22]` · `uses: actions/setup-node` (`node-version` yo'q). O'ngda run (`40`): job'lar `test (18)` ✓ · `test (20)` ✓ · `test (22)` ✓; har birida `node --version` → `v22.23.4` · `v22.23.4` · `v22.23.4`.
  Xulosa qadamida (M3): `with: node-version: ${{ matrix.node }}` → run (`41`): `v18.20.8` · `v20.20.2` · `v22.23.4`.
1. **O'quvchi darsida `matrix`: bir faylda uch Node versiyasi — uch parallel job**
   Ovoz: «Fayl xatolarini bildik, endi o'quvchi darsidagi qo'shimchalarni ko'ramiz. Birinchisi matrix: unda node o'n sakkiz, yigirma va yigirma ikki yozilgan. GitHub bitta job'dan uchta job yasaydi va ularni parallel yurgizadi.»
2. **Natija: `test (18)`, `test (20)`, `test (22)` — uchalasi yashil**
   Ovoz: «O'quvchi darsidagi faylni aynan shunday push qildik. Run'da uchta job: test o'n sakkiz, test yigirma, test yigirma ikki. Uchalasi yashil. Bir qarashda hammasi joyidadek.»
3. **Lekin logda uchalasi `v22.23.4`: matrix `setup-node`ga ulanmagan**
   Ovoz: «Lekin har job'da node version'ni chiqardik: uchalasida yigirma ikki. Matrix faqat job nomini o'zgartirgan. Setup node'ga qaysi versiya kerakligi aytilmagan, u mashinadagisini qoldirgan.»
4. **Xulosa: `node-version: ${{ matrix.node }}` qo'shilgach — 18, 20 va 22 haqiqatan**
   Ovoz: «Xulosa: setup node'ga node version qatorini qo'shing va matrix node'ni bering. Shundan keyin logda o'n sakkiz, yigirma va yigirma ikki chiqdi. O'quvchiga yashil belgi emas, logdagi versiyani ko'rsating.»
- Manba: `cicd2-out/40-matrix-ulanmagan.txt`, `41-matrix-ulangan.txt`; o'quvchi `GithubActionsLesson.jsx` s13; tahlilchi `05` (ikkalasi xatosiz).

## 17 · cache  ← `Lesson`
- Kicker: `4-bosqich · o'quvchi darsidagi namunalar` · Sarlavha: **O'quvchi darsidagi `cache` qizil: `key` majburiy. To'g'risi — `setup-node` `cache: npm`**
- Sahna: chapda o'quvchi darsi (s14): `uses: actions/cache@v4` · `with: path: node_modules` (`key` yo'q) → run (`50`): `Run actions/cache@v4` ✗ · izoh `Input required and not supplied: key` · `Run npm install` ○ · `Run npm run build` ○.
  O'ngda o'lchov (o'quvchi reposi, 759 paket):
  | Run | `npm install` | Job |
  |---|---|---|
  | cache'siz (`51`) | 44 s | 52 s |
  | `cache: npm`, 1-run (`52`) | 45 s | 58 s — oxirida «Cache saved» |
  | `cache: npm`, 2-run (`53`) | 16 s | 30 s — «Cache restored», ~57 MB |
1. **O'quvchi darsida `actions/cache` va `path: node_modules` — «5 baravar tez»**
   Ovoz: «Ikkinchi qo'shimcha cache. O'quvchi darsida actions cache qadami bor, faqat path yozilgan, va besh baravar tezlashadi deyilgan. Shu faylni o'quvchi reposiga push qildik.»
2. **Natija: cache qadami qizil — `Input required and not supplied: key`**
   Ovoz: «Natijada cache qadamining o'zi qizil bo'ldi. Izohda key kiritilmagan deyilgan. Bu qadam uchun key majburiy. O'rnatish ham, build ham yurmadi: o'quvchi faylni ko'chirsa, lentasi tezlashmaydi, to'xtaydi.»
3. **To'g'risi — `setup-node`da `cache: npm`: o'rnatish 44 soniyadan 16 soniyaga**
   Ovoz: «Oddiyroq yo'l bor: setup node'ga cache npm qatorini qo'shish. O'lchab ko'rdik: cache'siz o'rnatish qirq to'rt soniya davom etdi. Birinchi run'da foyda yo'q, kesh endi saqlanadi. Ikkinchi run'da esa o'n olti soniya.»
4. **Xulosa: kesh ikkinchi run'dan ishlaydi, o'rnatish taxminan 2,8 baravar tez — 5 emas**
   Ovoz: «Xulosa: kesh ikkinchi run'dan boshlab ishlaydi. Bu repoda o'rnatish taxminan ikki yarim, uch baravar tezlashdi, besh emas. O'quvchiga raqamni o'z run'idan ko'rsating.»
- Manba: `cicd2-out/50-cache-keysiz.txt`, `51–53`; o'quvchi `GithubActionsLesson.jsx` s14; tahlilchi `05` (`key`siz — xatosiz).

## 18 · secrets  ← `Lesson`
- Kicker: `4-bosqich · o'quvchi darsidagi namunalar` · Sarlavha: **Secret logda `***` bo'ladi — lekin bo'laklab chiqarilsa ochiq ko'rinadi**
- Sahna: repoga secret `API_KEY` qo'yildi (`gh secret set`, sinov qiymati, 25 belgi) (`60`). Run (`61`) qadamlari va logi:
  ```
  Run echo "Kalit: ***"                     → Kalit: ***
  Run echo "Uzunligi: ${#API_KEY}"
    env: API_KEY: ***                      → Uzunligi: 25
                                           → Bo'lib yozilsa: sk_test _mentor_sinov_7f3a
  Run echo "Yo'q secret: []"                → Yo'q secret: []
  ```
  Run ✓. Repo sahifasida secret qo'yish joyi — Settings → Secrets and variables → Actions (⚠ GitHub hujjatidan; sinovda `gh secret set` ishlatildi).
1. **O'quvchi darsi: secret «logda hech qachon ochiq ko'rinmaydi»; tekshirdik**
   Ovoz: «Uchinchi qo'shimcha secrets. O'quvchi darsida kalit faylda emas, seyfda turadi va logda hech qachon ochiq ko'rinmaydi deyilgan. Sinov kaliti qo'yib, logga chiqarib ko'rdik.»
2. **To'g'ridan chiqarilsa — `***`; qadam nomida ham yashiriladi**
   Ovoz: «Kalitni to'g'ridan echo qilsak, logda uchta yulduzcha chiqadi. Qadam nomida ham yulduzcha turadi. GitHub qiymatni aynan shu ko'rinishda qidiradi va yashiradi.»
3. **Bo'laklab chiqarilsa — kalit logda to'liq ochiq; yo'q secret esa bo'sh qator**
   Ovoz: «Lekin kalitni ikki bo'lakka bo'lib chiqardik: logda to'liq ochiq. Aynan qiymat bo'lmagani uchun yashirilmadi. Yana bir narsa: yozilmagan secret xato bermaydi, bo'sh qator qaytaradi, run yashil.»
4. **Xulosa: secret'ni logga umuman chiqarmang; yo'q secret run'ni qizil qilmaydi**
   Ovoz: «Xulosa: secret'ni logga umuman chiqarmang, yulduzcha faqat aynan qiymatni yashiradi. Kalit nomi xato bo'lsa, run yashil qoladi, xato keyin chiqadi. Kalit nomini sinchiklab tekshiring.»
- Manba: `cicd2-out/60-secret-qoyildi.txt`, `61-secret-logda.txt`; o'quvchi `GithubActionsLesson.jsx` s16; tahlilchi `05` (`run: echo "Kalit: …"` — `Nested mappings`).

## 19 · Amaliyot 3 — matrix'ni ulash  ← `Practice`
- Kicker: `Amaliyot 3 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **O'z lentangizga matrix: Node 20 va 22, versiya logda** · `tableAt: 3`
1. **Endi siz: lentangizni ikki Node versiyasida yurgizasiz va logdan tekshirasiz**
   Ovoz: «Oxirgi amaliyot: lentangizni ikki Node versiyasida yurgizasiz va versiyani yashil belgidan emas, logdan tekshirasiz. Bunga o'n besh daqiqa ketadi.»
2. **1–2-qadam: `strategy: matrix: node: [20, 22]` va `node-version: ${{ matrix.node }}`**
   Ovoz: «Birinchi qadamda job ichiga strategy, matrix va node qatorini yozasiz: yigirma va yigirma ikki. Ikkinchisida setup node'dagi node version qatoriga matrix node'ni berasiz. Ekrandagi fayl namuna.»
3. **3–4-qadam: `node --version` qadami, push; `test (20)` dagi versiya — isbot**
   Ovoz: «Uchinchi qadamda setup node'dan keyin node version'ni chiqaradigan qadam qo'shib, push qilasiz. To'rtinchisida test yigirma job'ini ochib, chiqqan versiyani isbot maydoniga yozasiz.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, matrix haqiqatan ishlayotganini yashil belgidan emas, logdagi versiyadan bilasiz.»
- Fayl (namuna, `ci.yml`):
  ```yaml
  jobs:
    test:
      strategy:
        matrix:
          node: [20, 22]
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v7
        - uses: actions/setup-node@v7
          with:
            node-version: ${{ matrix.node }}
        - run: node --version
        - run: npm install
        - run: npm test
  ```
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | matrix | `strategy: matrix: node: [20, 22]` | fayl saqlandi |
  | 2 | Ulash | `node-version: ${{ matrix.node }}` | fayl saqlandi |
  | 3 | Push | `- run: node --version` · commit · push | ikki job: `test (20)`, `test (22)` |
  | 4 | Log | `test (20)` → `Run node --version` | `v20.…` |
- Isbot: «`test (20)` job'idagi `node --version` natijasi» · placeholder: «versiyani yozing» · KOD: `/^\s*v20\.\d+\.\d+\s*$/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Ikkala job'da ham `v22…` | `node-version` qatori yo'q yoki `matrix.node` yozilmagan (16-ekran) |
  | Job bitta, nomida son yo'q | `strategy` job ichida emas — surilishni tekshiring |
  | Run qadamsiz qizil | fayl xatosi, surilish (13-ekran) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `cicd2-out/41-matrix-ulangan.txt` (`test (20)` → `v20.20.2`), `40`.

## 20 · Tekshiruv 4 — `key`siz cache  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **O'quvchi darsidagi `actions/cache@v4` + `path: node_modules` ko'chirildi. Nima bo'ladi?**
- Ovoz: «Namunalarni ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. O'quvchi darsidagi cache qadamini, faqat path bilan, o'z reposiga ko'chirdi va push qildi. Nima bo'ladi? Variantni tanlang.»
- Variantlar (to'g'risi — 4): 1 Ikkinchi run'dan besh baravar tez · 2 Yashil, lekin kesh saqlanmaydi · 3 Fayl xatosi, run qadamsiz qizil · 4 Cache qadami qizil: `Input required and not supplied: key`
- To'g'ri (ovoz, `ok`): «To'g'ri. Actions cache uchun key majburiy. Qadam qizil, o'rnatish va build yurmaydi. To'g'risi: setup node'da cache npm, ikkinchi run'dan o'rnatish tezlashadi. Demak, o'quvchi darsidan ko'chirilgan faylni ham GitHub'da yurgizib, natijasini tekshirish kerak.» · qisqa: «`key`siz `actions/cache` — qizil; `setup-node` `cache: npm` yozing.»
- Xato izohlari: 1 — «Run kesh qadamida to'xtaydi, tezlik o'lchanmaydi ham.» · 2 — «Yashil bo'lmaydi: qadam majburiy kirishsiz ishlamaydi.» · 3 — «Tahlilchi bu faylni xatosiz deydi: xato faqat qadam yurganda chiqadi.»
- Maslahat: «Izohdagi so'zni eslang: qaysi kirish yetishmadi?»
- Manba: `cicd2-out/50`, `51–53`, `05`.

---

## 21 · m4c-03 xaritasi  ← `Lesson`
- Kicker: `5-bosqich · o'quvchi darsini o'tish` · Eyebrow: `m4c-03 · «GitHub Actions — yo'l xaritasini yozish»` · Sarlavha: **m4c-03: yo'l xaritasi, nuqta va amal — 23 ekran**
  | Blok | O'quvchi ekranlari | Siz qo'shasiz |
  |---|---|---|
  | 1 Kirish | s0 chamadon lentada, skaner yurmadi · s1 reja | Actions oynasi, run ro'yxati (2-ekran) |
  | 2 Joylashuv va YAML | s2 Actions nima · s3 `.github/workflows/ci.yml` · s4 test · s5 YAML bo'sh joy · s6 workflow → job → step · s7 test | papka `workflows` — s harfisiz run yo'q (14-ekran); qadamsiz qizil run — fayl xatosi (13-ekran) |
  | 3 on, runs-on, amallar | s8 `on:` · s9 `runs-on` · s10 test · s11 `uses`/`run` · s12 tartib (`@v4`) | `my-laptop` — cheksiz kutadi (14-ekran); `uses` logi (4-ekran); tartib xato — kod 127 (10-ekran) |
  | 4 Qo'shimchalar | s13 matrix · s14 cache · s15 test · s16 secrets | matrix ulanmagan (16) · cache `key`siz qizil (17) · secret bo'laklab ochiq (18) |
  | 5 Markaziy va yakun | s17 yo'l xaritasini yozish · s18 yakuniy (1 urinish) · amaliyot · kartochkalar · uyga vazifa | simulyatsiya va haqiqat (22-ekran) |
1. **m4c-03 — 23 ekran: yo'l xaritasi, nuqta, amal va qo'shimchalar**
   Ovoz: «Endi o'quvchi darsini ko'ramiz: m4c-03, unda yigirma uch ekran bor. Darsda fayl yo'l xaritasi, job nuqta, qadam esa amal deb ataladi. Dars besh blokdan iborat: kirish, YAML, on va runs on, qo'shimchalar va markaziy ekran.»
2. **O'quvchi darsida `@v4` — ishlaydi, lekin GitHub har run'da ogohlantiradi**
   Ovoz: «Birinchi farq versiyada: o'quvchi darsida checkout va setup node'ning to'rtinchi versiyasi yozilgan. Sinadik: run yashil, lekin har safar Node yigirma eskirgan degan ogohlantirish chiqadi. Yettinchisini tavsiya qiling.»
3. **Qo'shimchalar blokida uch tuzatish: matrix'ni ulang, `cache: npm`, secret'ni chiqarmang**
   Ovoz: «Qo'shimchalar blokida uchta tuzatish aytasiz: matrix'ni setup node'ga ulang, cache uchun setup node'dagi cache npm, secret'ni logga umuman chiqarmang. Dalillari o'n oltinchi, o'n yettinchi va o'n sakkizinchi ekranlarda.»
4. **Xulosa: o'quvchi yozgan har faylni push qildiring — natijani Actions'da birga o'qing**
   Ovoz: «Xulosa: o'quvchi darsi simulyatsiya, Actions esa haqiqat. Har o'quvchi faylini push qilsin va run'ni siz bilan birga o'qisin. Simulyatsiya qayerda farq qilishini keyingi ekranda ko'ramiz.»
- Manba: `src/4c-Modull/GithubActionsLesson.jsx` — `SCREEN_META` (23), ekran matnlari, `GA_PKG`, `HW_V2`; xarita `manba/cicd2-oquvchi-xarita.md`; run'lar `10`, `25`, `40`, `50`, `61`.

## 22 · Simulyatsiya va haqiqiy Actions  ← `Lesson`
- Kicker: `5-bosqich · o'quvchi darsini o'tish` · Sarlavha: **O'quvchi darsidagi to'rt holat GitHub'da boshqacha chiqadi**
- Sahna: jadval (o'quvchi darsi → GitHub'da, run):
  | O'quvchi darsida | GitHub'da | Run |
  |---|---|---|
  | s17: `run: print('test')` begona qator, simulyatsiya o'tadi | `syntax error near unexpected token`, kod 2 — qizil | 16 |
  | s17: `run: git push` begona qator | `fatal: unable to access … 403`, kod 128 — qizil (`GITHUB_TOKEN`: `Contents: read`) | 17 |
  | s18: test qadami yo'q — «qizil chiroq» | run **yashil** — testsiz lenta hech narsani tekshirmaydi | 14 |
  | amaliyot «Repongiz yo'qmi?»: `"test": "echo ok && exit 0"` | test doim yashil; qizil uchun `echo xato && exit 1` | 10, 12 |
1. **Simulyatsiyada o'tgan begona qatorlar GitHub'da run'ni qizil qiladi**
   Ovoz: «Xaritani ko'rdingiz, endi farqlarni ko'ramiz. Markaziy ekranda begona qatorlar bor: print test va git push. Simulyatsiya ularni o'tkazadi. GitHub'da ikkalasi qizil: birinchisini bash tushunmaydi, ikkinchisiga ruxsat yo'q.»
2. **`git push` — 403: lentadagi token repoga faqat o'qish uchun ruxsat oladi**
   Ovoz: «Git push nega 403? Set up job logida yozilgan: token ruxsati contents read, ya'ni faqat o'qish. Lenta repoga o'zi yozolmaydi. O'quvchi so'rasa, shu satrni ko'rsating.»
3. **Testsiz lenta — yashil; «Repongiz yo'qmi?» namunasida test doim yashil**
   Ovoz: «Yakuniy ekranda test qadami yo'q lenta qizil deyiladi. Haqiqatda run yashil: tekshirmaydigan lenta xato topmaydi. «Repongiz yo'qmi» namunasida test doim yashil, qizil uchun skriptni exit bir qiling.»
4. **Xulosa: o'quvchiga ayting — yashil belgi faqat yozilgan qadamlar o'tganini bildiradi**
   Ovoz: «Xulosa: o'quvchiga ayting, yashil belgi faqat yozilgan qadamlar o'tdi degani. Test qadami bo'lmasa, yashil hech narsani kafolatlamaydi. Shuning uchun lentada npm test albatta bo'lsin.»
- Manba: `cicd2-out/16-mashq-print-test.txt`, `17-mashq-git-push.txt`, `14-mashq-testsiz.txt`, `10`, `12`, `20` (`GITHUB_TOKEN Permissions`); lokal `01`, `04`; o'quvchi `GithubActionsLesson.jsx` s17, s18, `GA_PKG`.

## 23 · O'quvchi darsidagi so'zlar va sinfdagi holatlar  ← `Lesson`
- Kicker: `5-bosqich · sinfda` · Sarlavha: **O'quvchi darsidagi so'zni Actions oynasida ko'rsating; sinfdagi olti holat**
  | O'quvchi aytadi (m4c-03) | Actions oynasida |
  |---|---|
  | yo'l xaritasi | `.github/workflows/ci.yml` |
  | nuqta · amal | job · qadam (step) |
  | lenta mashinasi | runner — `runs-on`, `Set up job` logi |
  | START SIGNALI | `on: push` — run qatorida «push» |
  | YASHIL / QIZIL CHIROQ | run belgisi ✓ / ✗ |
  | PARALLEL LENTALAR · YAQIN JAVON · SEYF | matrix — bir run'da bir nechta job · cache · secrets |
  | # | Holat | Belgisi | Yechim |
  |---|---|---|---|
  | 1 | Run yo'q | Actions bo'sh | `.github/workflows` nomi |
  | 2 | Run sariq, kutmoqda | `queued` | `runs-on: ubuntu-latest` |
  | 3 | Qadamsiz qizil | job yo'q | fayl xatosi — surilish, `: ` |
  | 4 | Kod 127 | `jest: not found` | `npm install` oldinroq |
  | 5 | Kod 254 | `Could not read package.json` | `actions/checkout` |
  | 6 | Kod 1, `npm ci` | `in sync` / lock yo'q | `npm install` |
- O'quvchi so'rasa:
  - «Run qancha vaqt oladi?» → o'quvchi reposida ~45 s – 1 daq 10 s; o'rnatish eng uzuni (`20–26`).
  - «Nega lenta git push qilolmaydi?» → token faqat o'qishga ruxsat oladi (`Contents: read`, `20`).
  - «Ubuntu versiyasi nega boshqacha?» → `ubuntu-latest` Ubuntu 26 ga o'tkazilmoqda (GitHub eslatmasi, har run'da).
  - «Secret'ni ko'rsam bo'ladimi?» → logda yo'q; qiymatni faqat qo'ygan odam biladi; logga chiqarmang (`61`).
1. **O'quvchi darsi so'zlarini Actions oynasidagi joy bilan birga ko'rsating**
   Ovoz: «Farqlarni bildingiz, endi sinfda ishlatiladigan so'zlarni ko'ramiz. O'quvchi yo'l xaritasi, nuqta va amal deydi. Siz har so'z bilan Actions oynasidagi joyni ko'rsating: nuqta, ya'ni job.»
2. **Uch holat run'ning o'zidan taniladi: run yo'q, sariq kutish, qadamsiz qizil**
   Ovoz: «Endi sinfda chiqadigan holatlar. Uchtasi run'ning o'zidan taniladi. Run yo'q bo'lsa, papka nomi xato. Run sariq kutib tursa, runs on xato. Qadamsiz qizil bo'lsa, fayl xatosi.» · 1–3-karta
3. **Uch holat kod va logdan: 127, 254 va `npm ci` dagi kod 1**
   Ovoz: «Qolgan uchtasi kod va logdan taniladi. Kod yuz yigirma yetti bo'lsa, jest yo'q, install'ni oldinroq qo'ying. Ikki yuz ellik to'rt bo'lsa, checkout yo'q. Kod bir va in sync bo'lsa, npm install yozing.» · 4–6-karta
4. **Xulosa: javobni aytmang — o'quvchi bilan qizil qadam, kod va logni birga o'qing**
   Ovoz: «Xulosa va usul bitta: javobni darhol aytmang. O'quvchi bilan birga o'qing: qaysi qadam qizil, qaysi kod va logdagi birinchi error satri nima deydi. Pastda o'quvchi savollariga tayyor javoblar bor.» · QA
- Manba: o'quvchi darsi metafora lug'ati (fayl boshidagi izoh) va kartochkalar (`FC`, 11 ta); `cicd2-out/06-actions-xulosa.md`.

## 24 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | Actions'da har push nimani yaratadi? | bitta run · bitta repo · bitta tarmoq · bitta secret | 1 | Run nomi — commit xabari. | 2 |
  | 2 | `Set up job` qadami qayerdan keladi? | `ci.yml`dagi birinchi qator · GitHub o'zi qo'shadi · checkout ichidan · `npm install`dan | 2 | Mashina va `uses` qadamlarini tayyorlaydi. | 3 |
  | 3 | Qizil run'da sababni qayerdan o'qiysiz? | izohdagi «exit code» · run nomidan · qizil qadam logidan · davomiyligidan | 3 | Izohda faqat kod. | 7 |
  | 4 | `npm test` `npm install`dan oldin turibdi — logda? | `in sync` · `Could not read package.json` · `Received: 10002` · `jest: not found`, kod 127 | 4 | Jest hali o'rnatilmagan. | 10 |
  | 5 | `runs-on: my-laptop` bilan run? | sariq holda cheksiz kutadi · darhol qizil · yashil · paydo bo'lmaydi | 1 | Bunday mashina yo'q, tahlilchi xato demaydi. | 14 |
  | 6 | Fayl `.github/workflow/ci.yml` da (s yo'q)? | qadamsiz qizil run · run umuman yo'q · sariq kutadi · yashil | 2 | GitHub faqat `workflows`dan qidiradi. | 14 |
  | 7 | `matrix: node: [18, 20, 22]`, `node-version` yo'q? | uch xil versiya · bitta job · uch job, uchalasida Node 22 · fayl xatosi | 3 | Matrix `setup-node`ga ulanmagan. | 16 |
  | 8 | Secret ikki bo'lakka bo'lib chiqarildi — logda? | `***` · bo'sh qator · run qizil · to'liq ochiq | 4 | Faqat aynan qiymat yashiriladi. | 18 |
- `passed = ball ≥ 6 && 3 amaliyot isbot bilan`.

## 25 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz**
- Xulosa 6 band: (1) Actions: har push — run; run ichida job, job ichida qadam; `Set up job`, `Post`, `Complete job` — GitHub'niki · (2) `uses` logi: checkout — faqat oxirgi commit; setup-node — mashinadagi Node; token — `Contents: read` · (3) qizil run: qizil qadam → kod (1, 127, 254) → logdagi birinchi `error` satri · (4) fayl xatosi — qadamsiz qizil; papka xato — run yo'q; `runs-on` xato — cheksiz kutadi · (5) o'quvchi darsidagi namunalar: matrix'ni `node-version`ga ulang; `cache` — `setup-node` `cache: npm`; secret'ni logga chiqarmang · (6) testsiz lenta yashil — yashil belgi faqat yozilgan qadamlarni kafolatlaydi.
- **Uyga vazifa** (M14): «Lentali reposingizda: matrix bilan Node 20 va 22, setup node'da cache npm, node version qadami. Bir marta tartibni yoki testni ataylab buzib qizil qiling va tuzating. Repo linkini platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | matrix | `node: [20, 22]` + `node-version: ${{ matrix.node }}` (19-ekran) | ikki job |
  | 2 | cache | `setup-node` → `cache: npm` (17-ekran) | 2-run'da «Cache restored» |
  | 3 | Qizil | tartib yoki test buziladi → push | qizil, kod |
  | 4 | Tuzatish | push | yashil |
  | 5 | Topshirish | repo linki platformadagi uyga vazifaga (M30) | — |
  Vaqt: 30–45 daqiqa. Tekshiruvchi qaraydi: Actions tarixida ikki job'li yashil run · `test (20)` logida `v20` · bitta qizil va undan keyingi yashil.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **Telegraf + PostgreSQL** — bot eslab qoladi: holat bazada».

---

## «KOD» — qurishda
1. Yordamchilar: CI/CD-1 bo'lagidan nusxa (`04-yordam.jsx`) + `ActionsList` (run ro'yxati) va `ActionsRun` (run ichi: job'lar, qadamlar, log, izoh); har Actions oynasida «haqiqiy run ma'lumotidan · run #N». Generator `dev/cicd2-matn.py`.
2. Run raqamlari, qadam nomlari, soniyalar, log satrlari — `cicd2-out/` dan aynan (`runlar-api.tsv`, `NN-*.txt`); yo'l `/home/runner/work/mentor-ci-sinov/mentor-ci-sinov` — sinov reposi nomi bilan qoladi (haqiqiy).
3. LineCheck (11-ekran): 11-satr → `target={10}`; `fixed` da har satrga `n`.
4. Isbotlar: 6 — `/^\s*node:\s*v\d+\.\d+\.\d+\s*$/` · 12 — `/^\s*127\s*$/` · 19 — `/^\s*v20\.\d+\.\d+\s*$/`.
5. Secret sinov qiymati (`sk_test_mentor_sinov_7f3a`) — soxta, faqat sinov reposida; ekranda ko'rsatiladi (bo'laklab ochilishini isbotlash uchun).

## Ochiq savollar ([GATE M])
1. ✅ **Fayl xatosi sahifasining aniq matni** (13-ekran) — #16–#19 skrinshotlari (19:27–19:33): maydon xatosida (`on`, `runs-on`) GitHub = tahlilchi (matn va qator aynan); sintaksis xatosida «You have an error in your yaml syntax on line N» — `echo` da N to'g'ri (8), surilishda **4** (xato 8-qatorda, blok boshi). CI/CD-1 17-ekran («qator raqami to'g'ri») — tahlilchi uchun to'g'ri, GitHub sahifasi uchun emas: qo'shimcha kerakmi — qaror.
2. PRD Q2 — «Repongiz yo'qmi?» namunasida test doim yashil: mentor darsida qizil yo'li aytildi (22-ekran, `exit 1`) — tasdiqlang.
3. Sinov reposi `kirishnomi4-wq/mentor-ci-sinov` — o'chirish faqat sizning roziligingiz bilan; dars run raqamlarini ko'rsatadi, lekin linklar ekranda yo'q (repo private).

## O'quvchi darslari uchun alohida ish (qaror kerak; tegilmadi) — hammasi run bilan tasdiqlangan
1. **m4c-03 s13** `matrix: node: [18, 20, 22]` — `node-version` yo'q: uch job, uchalasi Node 22 (`40`); ulangan — `41`.
2. **m4c-03 s14** `actions/cache@v4` `key`siz — qadam qizil, `Input required and not supplied: key` (`50`); «5 baravar» — o'lchovda ~2,8 (`51–53`).
3. **m4c-03 s16** «logda hech qachon ochiq ko'rinmaydi» — bo'laklab chiqarilsa ochiq (`61`).
4. **m4c-03 s17** begona `print('test')`, `git push` simulyatsiyada o'tadi — GitHub'da qizil, kod 2 va 128 (`16`, `17`).
5. **m4c-03 s18** testsiz lenta «qizil chiroq» — GitHub'da yashil (`14`).
6. **m4c-03 amaliyot** «Repongiz yo'qmi?» — `echo ok && exit 0`: uyga vazifadagi qizil run uchun skriptni o'zgartirish kerak (`12`, lokal `04`).
7. **m4c-03 s12, kartochka** `@v4` — ishlaydi, har run'da «Node.js 20 is deprecated» (`10`, `25`); so'nggi — v7.
