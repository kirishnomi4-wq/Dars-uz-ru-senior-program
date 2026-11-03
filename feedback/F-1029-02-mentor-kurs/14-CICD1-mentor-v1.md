# Mentor kursi · CI/CD-1 «CI/CD nima va nega: lenta o'quvchi reposida» — MD v1

F-ID: F-1029-02 (CI/CD-1) · Sana: 2026-11-01 (avtopilot) · Holat: **KO'RIKDA** ([GATE M] kutilmoqda) · Fidbek: qator yoniga `>> …`
PRD: `13-CICD1-PRD.md` v1 (avtopilot takliflari Q1–Q3)
Fayl (quriladi): `src/mentor-kurs/CiCdIntroMentorLesson.jsx` · bo'laklar `src/mentor-kurs/cicd1/parts/` · dvigatel — umumiy `parts/01–02`
Qonun: `MENTOR_DARS_ETALON.md` M1–M31 · Haqiqiy chiqishlar: `manba/cicd1-out/` (skript `manba/drive-cicd1.sh`, `ci.yml` variantlari `manba/cicd1-yml/`)

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | Jest-1 va Jest-2 ni o'tgan mentor: o'quvchi reposida test yozadi, PASS/FAIL o'qiydi. GitHub Actions bilan ishlamagan. |
| Dars oxirida mentor | 1) CI va CD farqini, Delivery va Deployment farqini aytadi · 2) CI mashinasi toza papkada aynan terminal buyruqlarini yurgizishini, chiqish kodi 1 da lenta to'xtashini biladi · 3) o'quvchi reposida lenta qayerda qizil bo'lishini biladi (`npm ci`, test yo'q, lint, checkout yo'q) · 4) `ci.yml`ni o'qiydi va yozadi · 5) m4c-01 ni o'tadi |
| O'quvchi darsi | **m4c-01** «CI/CD nima va nega kerak» (21 ekran). Oldingi mentor darsi: Jest-2. |
| Kursdagi o'rni | Jest-2 → **shu** → GitHub Actions (M31: raqamsiz) |
| Til | M9. Yangi atamalar: CI (Continuous Integration — har push tekshiriladi), CD (Continuous Delivery / Deployment — chiqarish), pipeline (lenta), workflow (`ci.yml`), runner (lenta mashinasi), step (qadam), chiqish kodi (exit code). |
| Misol-ip | **O'quvchi reposi** (`IntroNestArxitechture`) + Jest-1 dagi `orderTotal` testi; o'quvchi darsidagi `ci.yml` (`on: push` · `runs-on: ubuntu-latest` · `npm install` · `npm test`). |
| Haqiqiylik (M10) | 01.11.2026: yangi clone · `env -i … CI=true` · Node 24.18 · npm 11.16. `ci.yml` — GitHub'ning rasmiy tahlilchisi `@actions/workflow-parser` 0.3.61. GitHub Actions — haqiqiy run'lar (01.11.2026 18:20–18:43, sinov reposi `kirishnomi4-wq/mentor-ci-sinov`, o'quvchi reposi nusxasi): `manba/cicd2-out/06-actions-xulosa.md`. Actions oynasi — shu run'larning qadam va holatlaridan. |
| Hajm | **25 ekran** · 6 bosqich · 3 amaliyot · 4 tekshiruv · 8 savol · jami ≈ 1 soat |
| Me'yor | ≤ 5 segment, ≤ 60 so'z, ko'prik, «Xulosa», kalit 8–14 so'z |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **CI** — har push'dan keyin kod umumiy repoga qo'shiladi va avtomatik tekshiriladi: o'rnatish, test, build. Hammaning kodi bir xil sharoitda sinaladi.
- **CD** — tekshirilgan yukni chiqarish. **Delivery** — chiqarishga tayyor, tasdiq kutadi; **Deployment** — o'zi chiqaradi.
- **lenta mashinasi (runner)** — GitHub'dagi toza kompyuter (`ubuntu-latest` = Ubuntu 24.04, Node 22). Har safar bo'sh papkadan boshlaydi.
- **chiqish kodi** — buyruq tugaganda qaytaradigan son: 0 — yashil, 0 emas — qizil. Qizil qadamdan keyin lenta to'xtaydi.
- **`ci.yml`** — `.github/workflows/` dagi fayl: `on` (qachon) · `runs-on` (qaysi mashina) · `steps` (qaysi buyruqlar, tartib bilan).
- **o'quvchi reposidagi to'rt tuzoq** — `npm ci` yiqiladi (lock sinxron emas) · test fayli yo'q → `No tests found` · lint — 46 error · `ci.yml`da checkout yo'q → papka bo'sh.

**Darsning ipi:** qo'lda besh qadam → CI/CD → lenta mashinasi = toza papka + sizning buyruqlaringiz → o'quvchi reposini toza clone'da «lentadan o'tkazamiz» (qayerda qizil) → `ci.yml`ni o'qish va checkout → buzamiz (`npm ci`, lint, test qizil, YAML) → Delivery va Deployment → m4c-01 ga ko'prik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | Qo'lda besh qadam va lenta | Lesson | 1 · tushuncha |
| 3 | CI: har push tekshiriladi | Lesson | 1 |
| 4 | Lenta mashinasi: toza papka va chiqish kodi | Lesson | 1 |
| 5 | Tekshiruv 1 — chiqish kodi | MCRetry | 1 |
| 6 | Toza clone: `npm ci` yiqildi | Lesson | 2 · o'quvchi reposi |
| 7 | `npm test`: test yo'q bo'lsa qizil | Lesson | 2 |
| 8 | Build va `&&`: qizilda to'xtaydi | Lesson | 2 |
| 9 | Amaliyot 1 — lentani qo'lda yurgizish | Practice | 2 |
| 10 | `ci.yml` tuzilishi | Lesson | 3 · ci.yml |
| 11 | Checkout yo'q — papka bo'sh | Lesson | 3 |
| 12 | Tavsiya `ci.yml` o'quvchi reposi uchun | Lesson | 3 |
| 13 | Tekshiruv 2 — qaysi satr qizil qiladi | LineCheck | 3 |
| 14 | Amaliyot 2 — `ci.yml` GitHub'da | Practice | 3 |
| 15 | Lint qadami: 46 error | Lesson | 4 · buzamiz |
| 16 | Test qizil — lenta to'xtaydi | Lesson | 4 |
| 17 | YAML xatolari: tahlilchi nima deydi | Lesson | 4 |
| 18 | Tekshiruv 3 — `in sync` xatosi | MCRetry | 4 |
| 19 | Amaliyot 3 — GitHub'da qizil va yashil | Practice | 4 |
| 20 | CD: Delivery va Deployment | Lesson | 5 · CD |
| 21 | Tekshiruv 4 — qaysi rejim | MCRetry | 5 |
| 22 | m4c-01 xaritasi | Lesson | 6 · ko'prik |
| 23 | O'quvchi darsidagi so'zlar va sinfdagi holatlar | Lesson | 6 |
| 24 | O'z-sinov — 8 savol | Screen27 | — |
| 25 | Yakun | Screen28 | — |

**Sahna turlari:** VS Code `IntroNestArxitechture` (to'liq Explorer, `.github/workflows/ci.yml` qo'shiladi) + terminal (toza muhit) + lenta chizig'i (o'quvchi darsidagi besh nuqta: 📦 🔍 📐 🎁 ✈️) + Actions oynasi (haqiqiy run qadamlaridan, `cicd2-out/21`).

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · CI/CD` · Sarlavha: **Testlar bor. Ularni har push'da kim yurgizadi?**
- Sahna: reja (6 bosqich); natija — terminal: `npm test && npm run build && echo UCHIRISH` → `UCHIRISH`.
- Reja: 01 CI/CD nima · 02 Lenta o'quvchi reposida · 03 `ci.yml` · 04 Buzamiz · 05 CD · 06 O'quvchi darsini o'tish
1. **Testlarni har safar qo'lda yurgizish shart emas — buni lenta qiladi**
   Ovoz: «Assalomu alaykum. Jest darslarida test yozdingiz va har safar npm test'ni o'zingiz yurgizdingiz. Bugun buni har push'da avtomatik qiladigan lentani ko'ramiz: CI/CD.»
2. **Avval tushuncha, keyin o'quvchi reposini lentadan qo'lda o'tkazamiz**
   Ovoz: «Avval tushunchani ko'ramiz: CI nima va CD nima. Keyin o'quvchi reposini toza papkada lentadan qo'lda o'tkazamiz va qaysi qadamda qizil bo'lishini ko'ramiz.» · reja 01–02
3. **Keyin `ci.yml` faylini o'qiymiz va uni ataylab buzib, xabarlarni ko'ramiz**
   Ovoz: «Keyin lenta faylini, ci yml'ni o'qiymiz, uni ataylab buzamiz va xabarlarni ko'ramiz. Oxirida chiqarish turlarini va o'quvchi darsini ko'ramiz.» · reja 03–05
4. **Olti bosqich, uch amaliyot. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi**
   Ovoz: «Dars olti bosqichdan iborat, uchta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.» · reja 06
- Manba: `cicd1-out/09-zanjir-toxtaydi.txt`.

---

## 2 · Qo'lda besh qadam va lenta  ← `Lesson`
- Kicker: `1-bosqich · tushuncha` · Sarlavha: **Har push'dan keyin besh qadam: o'rnatish, test, lint, build, chiqarish**
- Sahna: o'quvchi darsidagi lenta — besh nuqta, har birining ostida buyrug'i: 📦 Yig'ish `npm install` · 🔍 Skaner `npm test` · 📐 O'lcham ramkasi `eslint .` · 🎁 O'rash `npm run build` · ✈️ Uchirish (deploy).
1. **Qo'lda: har push'dan keyin besh buyruqni o'zingiz, tartib bilan yurgizasiz**
   Ovoz: «Kod yozildi va push qilindi. Endi qo'lda besh ish qilinadi: paketlarni o'rnatish, testlarni yurgizish, kod yozilish qoidasini tekshirish, build va saytni chiqarish. Bularning hammasi har push'da, tartib bilan qilinadi.»
2. **Muammo: sekin, zerikarli va bir kuni bittasini unutasiz**
   Ovoz: «Muammo shu: bu sekin va zerikarli. Bir kuni shoshilib testni tashlab ketasiz, buzuq kod foydalanuvchiga chiqadi. O'quvchi darsi ham aynan shu holatdan boshlanadi.»
3. **Lenta — xuddi shu besh qadamni har push'da o'zi bajaradi**
   Ovoz: «Lenta, inglizchasi pipeline, xuddi shu qadamlarni har push'da o'zi bajaradi. Yangi buyruq yo'q: lentada sizning terminalingizdagi buyruqlar yuradi.»
4. **Xulosa: lenta yangi narsa emas — terminal buyruqlarini avtomatik va tartib bilan yurgizadi**
   Ovoz: «Xulosa: lenta yangi narsa emas. U terminal buyruqlarini avtomatik va har safar bir xil tartibda yurgizadi. O'quvchi darsida bu nuqtalar aeroport nomlari bilan atalgan, ularni oxirida ko'ramiz.»
- Manba: o'quvchi darsi `CiCdIntroLesson.jsx` Screen0–1, Screen6–7.

## 3 · CI: har push tekshiriladi  ← `Lesson`
- Kicker: `1-bosqich · tushuncha` · Sarlavha: **Continuous Integration: har kimning kodi umumiy repoga qo'shiladi va tekshiriladi**
- Sahna: uch dasturchi (Ali, Vali, Sora — o'quvchi darsidagi ismlar) → push → bitta lenta → har biriga yashil yoki qizil.
1. **CI — Continuous Integration: kod umumiy repoga qo'shilishi bilan tekshiriladi**
   Ovoz: «Lenta har push'da aylanadi, demak avval push'ning o'zi. CI bu Continuous Integration, ya'ni uzluksiz birlashtirish. Har kim o'z kompyuterida yozadi, push qiladi, kod umumiy repoga qo'shiladi va shu zahoti tekshiriladi.»
2. **Tekshirishni hech kim so'ramaydi: lentani push'ning o'zi darhol boshlab beradi**
   Ovoz: «Tekshirishni hech kim so'ramaydi va hafta oxirini kutmaydi. Push'ning o'zi lentani boshlaydi. Kuniga o'n marta push bo'lsa, lenta o'n marta aylanadi.»
3. **Hamma bir xil sharoitda: «mening kompyuterimda ishlayapti» muammosi tugaydi**
   Ovoz: «Eng muhimi: hammaning kodi bir xil toza mashinada sinaladi. Vali uyida ishlagan, lentada qizil bo'lsa, xato uyidagi sozlamada yashiringan bo'ladi.»
4. **Xulosa: CI har push'ni bir xil toza sharoitda, darhol tekshiradi**
   Ovoz: «Xulosa: CI har push'ni darhol va bir xil toza sharoitda tekshiradi. Toza sharoit nimani anglatishini keyingi ekranda ko'ramiz, chunki o'quvchi reposidagi ko'p qizillar shundan keladi.»
- Manba: o'quvchi darsi Screen4–5, Screen11.

## 4 · Lenta mashinasi: toza papka va chiqish kodi  ← `Lesson`
- Kicker: `1-bosqich · tushuncha` · Sarlavha: **Lenta mashinasi har safar bo'sh papkadan boshlaydi va chiqish kodiga qaraydi**
- Sahna: lenta mashinasi kartasi (`ubuntu-latest` → Ubuntu 24.04.5 · Node.js 22.23.4 — run logi `cicd2-out/20`; GitHub eslatmasi: `ubuntu-latest` Ubuntu 26 ga o'tkazilmoqda) + terminal: `npm test` yashil → `[chiqish kodi: 0]`, qizil → `[chiqish kodi: 1]` (`07`, `08`).
1. **Lenta mashinasi — GitHub'dagi toza kompyuter, sizniki emas**
   Ovoz: «Lenta qayerda yuradi? GitHub'dagi alohida kompyuterda, inglizchasi runner. Hozir ubuntu latest degani Ubuntu yigirma to'rt, unda Node yigirma ikki o'rnatilgan. Sizning kompyuteringiz o'chiq bo'lsa ham ishlaydi.»
2. **Har safar bo'sh papka: `node_modules` ham, `.env` ham yo'q**
   Ovoz: «Har safar bo'sh papkadan boshlaydi. Sizning node modules papkangiz ham, env faylingiz ham u yerda yo'q. Shuning uchun lentada o'rnatish qadami albatta bor.»
3. **Har buyruq chiqish kodi qaytaradi: 0 — yashil, 1 — qizil**
   Ovoz: «Lenta qanday biladi: o'tdimi yoki yo'qmi? Har buyruq tugaganda bitta son qaytaradi, uni chiqish kodi deyishadi. Test yashil bo'lsa nol, qizil bo'lsa bir. Lenta faqat shu songa qaraydi.»
4. **Xulosa: lenta = toza papka + sizning buyruqlaringiz + chiqish kodi**
   Ovoz: «Xulosa: lenta bu toza papka, sizning buyruqlaringiz va chiqish kodi. Nol bo'lmagan kod chiqqan qadamdan keyin lenta to'xtaydi. Endi buni tekshirib olaylik.»
- Manba: `cicd1-out/07-npm-test-yashil.txt`, `08-npm-test-qizil.txt`, `12-github-hujjat.txt`.

## 5 · Tekshiruv 1 — chiqish kodi  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Lentada `npm test` chiqish kodi 1 qaytardi. Keyin nima bo'ladi?**
- Ovoz: «Lenta mashinasini ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Lentada npm test chiqish kodi bir qaytardi. Keyin nima bo'ladi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 Lenta davom etadi, build va chiqarish ham yuradi · 2 Lenta xatoni o'zi tuzatadi · 3 Lenta to'xtaydi, keyingi qadamlar yurmaydi, eski sayt joyida qoladi · 4 Sayt o'chib qoladi
- To'g'ri (ovoz, `ok`): «To'g'ri. Bir qizil degani. Lenta shu qadamda to'xtaydi, build ham, chiqarish ham yurmaydi. Foydalanuvchi eski, ishlayotgan saytni ko'radi, buzuq yuk uchmaydi. Demak, nol bo'lmagan chiqish kodi chiqqan joyda lenta to'xtaydi va keyingi qadamlar yurmaydi.» · qisqa: «Kod 1 — qizil: lenta to'xtaydi, buzuq yuk chiqmaydi.»
- Xato izohlari: 1 — «Davom etsa, tekshirilmagan kod chiqadi — lenta buning teskarisi uchun bor.» · 2 — «Lenta kod yozmaydi: tuzatish dasturchining ishi.» · 4 — «Chiqarish yurmagani uchun eski versiya joyida qoladi.»
- Maslahat: «Chiqish kodi 0 emas — qizil. Qizil qadamdan keyin lenta nima qiladi?»
- Manba: `cicd1-out/09-zanjir-toxtaydi.txt`; o'quvchi darsi Screen10.

---

## 6 · Toza clone: `npm ci` yiqildi  ← `Lesson`
- Kicker: `2-bosqich · o'quvchi reposi` · Sarlavha: **CI andozalarining o'rnatish buyrug'i — `npm ci`. O'quvchi reposida u yiqiladi**
- Sahna: terminal (haqiqiy, `01`):
  ```
  $ npm ci
  npm error code EUSAGE
  npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. …
  npm error Missing: @nestjs/jwt@11.0.2 from lock file
  npm error Missing: bcrypt@6.0.0 from lock file
  …
  [chiqish kodi: 1]
  ```
  → `npm install` → `added 759 packages` · `[chiqish kodi: 0]` (`02`).
1. **Endi o'quvchi reposini lentadagidek o'tkazamiz: toza clone, toza muhit**
   Ovoz: «Endi o'quvchi reposini lentadagidek o'tkazamiz: GitHub'dan yangi clone, toza papka, toza muhit. Lentaning birinchi qadami paketlarni o'rnatish.»
2. **GitHub'ning tayyor Node.js andozasida ham `npm ci` turadi — u lock faylga qat'iy amal qiladi**
   Ovoz: «GitHub Actions'dagi tayyor Node.js andozasini tanlasangiz ham, o'rnatish buyrug'i npm ci bo'ladi. U package lock fayliga qat'iy amal qiladi: ikkala fayl mos bo'lmasa, hech narsa o'rnatmaydi.»
3. **O'quvchi reposida lock fayl eskirgan: `npm ci` — `in sync` xatosi, kod 1**
   Ovoz: «O'quvchi reposida lock fayl eskirgan: unda yangi paketlar yo'q. Natijada in sync xatosi chiqadi, chiqish kodi bir. Lenta birinchi qadamdayoq qizil bo'ladi, test'gacha yetmaydi.»
4. **Xulosa: o'quvchi reposida o'rnatish — `npm install`; `npm ci` bilan lenta qizil**
   Ovoz: «Xulosa: bu repoda o'rnatish qadami npm install bo'lsin. U ishlaydi va yetti yuz ellik to'qqiz paketni o'rnatadi. Jest birinchi darsida ham shu sabab bilan npm install ishlatgan edik.»
- Manba: `cicd1-out/01-npm-ci.txt`, `02-npm-install.txt`; «ko'p CI namunalarida `npm ci`» — GitHub'ning rasmiy Node.js andozasi (`12`: `starter-workflows/ci/node.js.yml` — `npm ci`).

## 7 · `npm test`: test yo'q bo'lsa qizil  ← `Lesson`
- Kicker: `2-bosqich · o'quvchi reposi` · Sarlavha: **Test fayli yo'q repoda `npm test` — `No tests found`, kod 1**
- Sahna: terminal (`03`) → `src/order.spec.ts` qo'shildi → PASS (`07`).
1. **Ikkinchi qadam — test. O'quvchi reposida hali bitta ham test yo'q**
   Ovoz: «Ikkinchi qadam testlar. Toza clone'da o'quvchi reposida bitta ham test fayli yo'q: testlarni o'quvchi o'zi qo'shadi.»
2. **`No tests found, exiting with code 1` — lenta buni qizil deb biladi**
   Ovoz: «Natijada no tests found, exiting with code one chiqadi. Jest testni topmasa, chiqish kodi bir bilan tugaydi. Lenta buni xato deb biladi va to'xtaydi.»
3. **Jest-1 dagi `order.spec.ts` qo'shilgach — PASS va kod 0**
   Ovoz: «Jest birinchi darsidagi order spec faylini qo'shamiz. Natijada PASS chiqadi: bitta test o'tdi, chiqish kodi nol. Endi lenta keyingi qadamga o'tadi.»
4. **Xulosa: lentaga test qadami qo'yishdan oldin repoda kamida bitta test bo'lsin**
   Ovoz: «Xulosa: lentaga test qadamini qo'yishdan oldin repoda kamida bitta test bo'lsin. Aks holda lenta birinchi kundanoq qizil bo'ladi. Sinfda bu o'quvchilarda albatta chiqadi.»
- Manba: `cicd1-out/03-npm-test-bosh.txt`, `07-npm-test-yashil.txt`.

## 8 · Build va `&&`: qizilda to'xtaydi  ← `Lesson`
- Kicker: `2-bosqich · o'quvchi reposi` · Sarlavha: **`npm run build` yashil. `&&` zanjiri — lenta qoidasining o'zi**
- Sahna: terminal: `npm run build` → `nest build` · kod 0 (`04`); keyin `09`: `npm test && npm run build && echo "UCHIRISH"` — test qizil: hech narsa · kod 1; test yashil: `UCHIRISH` · kod 0.
1. **Uchinchi qadam — build: `nest build`, xatosiz, kod 0**
   Ovoz: «Uchinchi qadam build. Nest build TypeScript'ni JavaScript'ga aylantiradi. O'quvchi reposida xatosiz o'tadi, chiqish kodi nol.»
2. **`&&` — oldingi buyruq yashil bo'lsagina keyingisi yuradi**
   Ovoz: «Lenta qoidasini terminalda ko'rish mumkin. Buyruqlar orasidagi ikki ampersand shuni bildiradi: oldingi buyruq nol qaytarsagina keyingisi yuradi. Uch buyruqni shunday ulaymiz, oxiriga esa uchirish so'zini chiqaradigan buyruq qo'yamiz.»
3. **Test qizil — build ham, «UCHIRISH» ham yurmadi; test yashil — hammasi yurdi**
   Ovoz: «Kodni ataylab buzdik: test qizil bo'ldi, build yurmadi, uchirish yozuvi chiqmadi, chiqish kodi bir. Tuzatgandan keyin hammasi yurdi va oxirida uchirish chiqdi. Lenta aynan shunday ishlaydi.»
4. **Xulosa: lenta — `&&` bilan ulangan buyruqlar; birinchi qizilda to'xtaydi**
   Ovoz: «Xulosa: lentani ikki ampersand bilan ulangan buyruqlar deb tasavvur qiling. Birinchi qizil qadamda to'xtaydi. Endi buni o'zingiz yurgizasiz.»
- Manba: `cicd1-out/04-build.txt`, `09-zanjir-toxtaydi.txt`.

## 9 · Amaliyot 1 — lentani qo'lda yurgizish  ← `Practice`
- Kicker: `Amaliyot 1 / 3` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **Toza clone'da uch qadam va `&&` zanjiri** · `tableAt: 3`
1. **Endi siz: o'quvchi reposini toza papkada lentadagidek o'tkazasiz**
   Ovoz: «Endi navbat sizga. O'quvchi reposini yangi papkaga clone qiling va lentadagidek uch qadamdan o'tkazing. Bunga o'n daqiqa ketadi.»
2. **1–2-qadam: clone va `npm ci` — `in sync` xatosini ko'ring, keyin `npm install`**
   Ovoz: «Birinchi qadamda reponi yangi papkaga clone qilasiz. Ikkinchisida avval npm ci qilib, in sync xatosini o'qiysiz, keyin npm install qilasiz.»
3. **3–4-qadam: `order` fayllari va zanjir; isbot — oxirgi satr**
   Ovoz: «Uchinchi qadamda Jest birinchi darsidagi ikki order faylini qo'shasiz. To'rtinchisida zanjirni yurgizasiz. Isbot maydoniga oxirgi satrni yozing.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz o'quvchi reposi qaysi qadamda qizil bo'lishini va qanday tuzatilishini o'z qo'lingiz bilan ko'rdingiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Toza clone | `git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git lenta-sinov` · `cd lenta-sinov` | papka yaratildi |
  | 2 | O'rnatish | `npm ci` → xato · `npm install` | `in sync` · keyin `added … packages` |
  | 3 | Test fayli | `src/order.ts` + `src/order.spec.ts` (Jest-1) — «Kodni ochish» | fayl saqlandi |
  | 4 | Zanjir | `npm test && npm run build && echo "UCHIRISH"` | oxirgi satr `UCHIRISH` |
- Isbot: «Zanjirning oxirgi satri» · placeholder: «oxirgi satrni yozing» · KOD: `/^\s*"?UCHIRISH"?\s*$/i`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `npm ci` ham ishladi | lock fayl repoda yangilangan bo'lishi mumkin — yaxshi, davom eting |
  | `No tests found` | `order.spec.ts` `src/` ichida emas yoki nomi `.test.ts` (Jest-1, 4-ekran) |
  | `UCHIRISH` chiqmadi, FAIL | `order.ts`dagi hisob — `price * quantity` |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `cicd1-out/01`, `02`, `07`, `09`.

---

## 10 · `ci.yml` tuzilishi  ← `Lesson`
- Kicker: `3-bosqich · ci.yml` · Sarlavha: **`ci.yml`: qachon (`on`), qayerda (`runs-on`), nima (`steps`)**
- Sahna: VS Code — `.github/workflows/ci.yml` (o'quvchi darsidagi aynan):
  ```yaml
  on: push
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - run: npm install
        - run: npm test
  ```
1. **Lenta qayerda yoziladi: repodagi `.github/workflows/ci.yml` faylida, GitHub uni o'zi topadi**
   Ovoz: «Lenta qayerda yoziladi? Repodagi nuqta github, workflows papkasidagi yml faylida. GitHub shu papkani o'zi topadi. O'quvchi darsida bu fayl yo'l xaritasi deyiladi.»
2. **`on: push` — qachon: har push'da lenta o'zi boshlanadi**
   Ovoz: «Birinchi qator on push lenta qachon boshlanishini aytadi: har push'da u o'zi boshlanadi. Bu start signali.»
3. **`runs-on` — qaysi mashinada; `steps` — qaysi buyruqlar, yuqoridan pastga**
   Ovoz: «Runs on qaysi mashinada yurishini aytadi: ubuntu latest. Steps esa qaysi buyruqlar yurishini aytadi: har chiziqcha bitta qadam, ular yuqoridan pastga bajariladi. Surilish muhim: har qator kimning ichida turganini ko'rsatadi.»
4. **Xulosa: `on` · `runs-on` · `steps` — o'quvchi darsidagi uch bo'shliq aynan shular**
   Ovoz: «Xulosa: faylning asosi uchta: on, runs on va steps. O'quvchi darsida aynan shu uch joy bo'sh qoldirilgan va o'quvchi to'ldiradi. Lekin bu faylda bitta muhim qadam yetishmaydi, uni keyingi ekranda ko'ramiz.»
- Manba: o'quvchi darsi Screen13 (`YAML_BLANKS`); `cicd1-yml/1-oquvchi-darsi.yml`.

## 11 · Checkout yo'q — papka bo'sh  ← `Lesson`
- Kicker: `3-bosqich · ci.yml` · Sarlavha: **Rasmiy tahlilchi «xato yo'q» deydi — lekin mashinadagi papka bo'sh**
- Sahna: tahlilchi chiqishi (`10`): `1-oquvchi-darsi.yml ✓ xato yo'q`; actions/checkout hujjati: «checks-out your repository under `$GITHUB_WORKSPACE`» (`12`); bo'sh papkada (`11`):
  ```
  $ ls -a
  .  ..
  $ npm install
  npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
  ```
1. **Faylni GitHub'ning rasmiy tahlilchisida tekshirdik: u «xato yo'q» deb javob berdi**
   Ovoz: «O'quvchi darsidagi faylni GitHub'ning rasmiy tahlilchisida tekshirdik. Natija: xato yo'q, ya'ni fayl to'g'ri yozilgan. Lekin yozilishi to'g'ri degani, ishlaydi degani emas.»
2. **Lenta mashinasi bo'sh papkada: repodagi kodni `actions/checkout` olib keladi**
   Ovoz: «Eslang: mashina bo'sh papkadan boshlaydi. Repodagi kodni u yerga olib keladigan qadam actions checkout. Hujjati shunday deydi. O'quvchi faylida bu qadam yo'q.»
3. **Checkout'siz `npm install` — `Could not read package.json`**
   Ovoz: «Bo'sh papkada npm install'ni yurgizdik va could not read package json xatosini oldik. Package json yo'q, chunki kod kelmagan. GitHub'da ham sinadik: checkout'siz lentada xuddi shu xato, lenta qizil.»
4. **Xulosa: har lentaning birinchi qadami — kodni olib keladigan `actions/checkout`**
   Ovoz: «Xulosa: har lentaning birinchi qadami actions checkout. O'quvchilarga checkout m4c-03 da o'rgatiladi, amaliyot esa m4c-01 da. Shuning uchun amaliyotda bu qatorni o'zingiz qo'shtirasiz.»
- Manba: `cicd1-out/10-yml-tahlil.txt`, `11-checkoutsiz-bosh-papka.txt`, `12-github-hujjat.txt`; GitHub'da — `cicd2-out/13` (checkout'siz: `npm error enoent Could not read package.json`, qizil).

## 12 · Tavsiya `ci.yml` o'quvchi reposi uchun  ← `Lesson`
- Kicker: `3-bosqich · ci.yml` · Sarlavha: **Checkout, Node, install, test, build — besh qadam, tahlilchida xatosiz**
- Sahna: `ci.yml` (tavsiya, `cicd1-yml/2-tavsiya.yml`), qadamlar navbat bilan yoritiladi; tahlilchi: `✓ xato yo'q`.
  ```yaml
  name: CI
  on: push
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v7
        - uses: actions/setup-node@v7
          with:
            node-version: 22
        - run: npm install
        - run: npm test
        - run: npm run build
  ```
1. **`uses` — tayyor qadam: checkout kodni olib keladi, setup-node Node'ni o'rnatadi**
   Ovoz: «Checkout kerakligini ko'rdik, endi to'liq fayl. Unda uses bilan yozilgan ikki yangi qadam bor: bular boshqalar yozib qo'ygan tayyor qadamlar. Checkout kodni olib keladi. Setup node kerakli Node versiyasini o'rnatadi, bu yerda yigirma ikki.»
2. **`run` — sizning buyruqlaringiz: `npm install`, `npm test`, `npm run build`**
   Ovoz: «Qolgan qadamlar run bilan yoziladi, ular sizning buyruqlaringiz: npm install, npm test va npm run build. Bular amaliyotda terminalda yurgizgan uchta buyrug'ingiz.»
3. **Versiyalar: hozir checkout va setup-node — v7; o'quvchi darsida v4 yozilgan**
   Ovoz: «Endi versiyalar haqida. GitHub'da hozirgi so'nggi versiya yettinchi. O'quvchi m4c-03 darsida to'rtinchi versiya yozilgan. To'rtinchisi ham ishlaydi, lekin GitHub har safar eskirgan deb ogohlantiradi. Shuning uchun yettinchisini tavsiya qilamiz.»
4. **Xulosa: bu fayl o'quvchi reposi uchun — lint qadamisiz, sababini 15-ekranda ko'ramiz**
   Ovoz: «Xulosa: o'quvchi reposi uchun shu besh qadam yetadi. Lint qadami ataylab yo'q, sababini o'n beshinchi ekranda ko'ramiz. Fayl tahlilchida xatosiz.»
- Manba: `cicd1-yml/2-tavsiya.yml`, `cicd1-out/10`, `12`; o'quvchi m4c-03 `GithubActionsLesson.jsx` (`actions/checkout@v4`); GitHub'da — `cicd2-out/20` (v7 yashil), `25` (v4 yashil + «Node.js 20 is deprecated … forced to run on Node.js 24»).

## 13 · Tekshiruv 2 — qaysi satr qizil qiladi  ← `LineCheck`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4 — qaysi satr xato?` · Sarlavha: **Fayl to'g'ri yozilgan, lekin o'quvchi reposida lenta birinchi `run` qadamida qizil**
- Shart (`task`): «Bu `ci.yml` tahlilchida xatosiz. Lekin o'quvchi reposida lenta birinchi buyruqdayoq qizil bo'ladi. **Shu satrni bosing.**»
- Ovoz (`q`): «Faylni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu fayl yozilishi bo'yicha to'g'ri, lekin o'quvchi reposida lenta birinchi buyruqdayoq qizil. Shu satrni bosing.»
- Fayl: `.github/workflows/ci.yml` (`cicd1-yml/7-npm-ci.yml`):
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
  11       - run: npm ci          ← xato satr
  12       - run: npm test
  ```
- Tuzatilgan (`fixed`): 11-satr `npm ci` → yashil `npm install`; `fixedExtra`: terminal `npm ci` → `in sync` (qisqa) va `npm install` → `added 759 packages`.
- To'g'ri (ovoz, `ok`): «To'g'ri. O'n birinchi satr, npm ci. O'quvchi reposida lock fayl eskirgan, npm ci in sync xatosi bilan to'xtaydi. Bu repoda npm install yozamiz. Ekranda tuzatilgan holat. Demak, lock fayli eskirgan repoda lentaning o'rnatish qadami npm install bo'ladi.»
- Qisqa (`okShort`): «11-satr: `npm ci` — lock sinxron emas. Bu repoda `npm install`.»
- Maslahat (`hint`): «Lentaning birinchi buyrug'i qaysi? Toza clone'da u nima degan edi (6-ekran)?»
- Manba: `cicd1-out/01`, `02`, `10`.

## 14 · Amaliyot 2 — `ci.yml` GitHub'da  ← `Practice`
- Kicker: `Amaliyot 2 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **O'z reposingizga lenta: push va Actions'ni kuzatish** · `tableAt: 3`
1. **Endi siz: o'z GitHub reposingizga lenta qo'shasiz va birinchi yashilni ko'rasiz**
   Ovoz: «Endi o'z reposingizga lenta qo'shasiz. Jest darslaridagi repo bo'lsa yaxshi, unda testlar bor. Bunga o'n besh daqiqa ketadi.»
2. **1–2-qadam: `.github/workflows/ci.yml` — tavsiya fayl; commit va push**
   Ovoz: «Birinchi qadamda nuqta github, workflows papkasida ci yml faylini yaratasiz: o'n ikkinchi ekrandagi fayl. Ikkinchisida commit va push qilasiz.»
3. **3–4-qadam: Actions bo'limi, qadamlar ro'yxati; isbot — `npm test` qadamidagi `Tests:` satri**
   Ovoz: «Uchinchi qadamda GitHub'da Actions bo'limini ochib, lentani kuzatasiz. To'rtinchisida npm test qadamini ochib, Tests satrini isbot maydoniga nusxalaysiz.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizning reposingizda har push'da o'zi yuradigan lenta bor.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Fayl | `.github/workflows/ci.yml` — «Kodni ochish» (12-ekran) | fayl saqlandi |
  | 2 | Push | `git add .github && git commit -m "ci: lenta"` · `git push` | push o'tdi |
  | 3 | Actions | GitHub → repo → **Actions** → oxirgi lenta | yashil belgi |
  | 4 | Log | `test` ishi ichida `npm test` qadami | `Tests: … passed` |
- Isbot: «`npm test` qadamidagi `Tests:` satri» · placeholder: «Tests satrini qo'ying» · KOD: `/Tests:\s+\d+ passed,\s+\d+ total/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Actions'da lenta umuman yo'q | papka nomi aniq `.github/workflows` emas yoki fayl push qilinmagan |
  | `in sync` | `npm ci` yozilgan — `npm install` (13-ekran) |
  | `Could not read package.json` | checkout qadami yo'q (11-ekran) |
  | `No tests found` | repoda test fayli yo'q (7-ekran) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `cicd1-yml/2-tavsiya.yml`; `cicd1-out/07` (`Tests:` satri — Jest'ning o'zi, lokal); Actions'da — `cicd2-out/20` (yashil, logda `Tests: 1 passed, 1 total`).

---

## 15 · Lint qadami: 46 error  ← `Lesson`
- Kicker: `4-bosqich · buzamiz` · Sarlavha: **O'quvchi darsidagi «O'lcham ramkasi» — o'quvchi reposida lint 46 error**
- Sahna: terminal (`05`): `npm run lint` → `eslint "{src,apps,libs,test}/**/*.ts" --fix` → `✖ 49 problems (46 errors, 3 warnings)` · kod 1; `git status` — 14 fayl o'zgargan; `--fix`siz (`06`): `✖ 120 problems (116 errors, 4 warnings)`.
1. **O'quvchi darsidagi lentada lint nuqtasi bor — o'quvchi reposida sinab ko'rdik**
   Ovoz: «O'quvchi darsidagi lentada o'lcham ramkasi bor, ya'ni lint: kod yozilish qoidasi. O'quvchi reposida npm run lint'ni yurgizdik.»
2. **Natija: 46 error, chiqish kodi 1 — lint qadami qo'yilsa, lenta har safar qizil**
   Ovoz: «Natijada qirq olti error chiqdi, chiqish kodi bir. Repoda yozilish qoidasi buzilgan joylar ko'p. Lentaga lint qadami qo'yilsa, u har safar qizil bo'ladi, kod ishlasa ham.»
3. **Diqqat: skriptda `--fix` bor — u 14 faylni o'zgartirib qo'ydi**
   Ovoz: «Yana bir narsa: o'quvchi reposidagi lint skriptida fix bor. U o'n to'rt faylni o'zi o'zgartirib qo'ydi. Lentada fayl o'zgartiradigan buyruq bo'lmasligi kerak.»
4. **Xulosa: bu repoda lint — alohida ish; lentaga test va build yetadi**
   Ovoz: «Xulosa: bu repoda lint alohida ish, avval xatolar tozalanadi. Hozircha lentaga test va build yetadi. O'quvchi lint haqida so'rasa, shu raqamni ayting.»
- Manba: `cicd1-out/05-lint.txt`, `06-lint-fixsiz.txt`.

## 16 · Test qizil — lenta to'xtaydi  ← `Lesson`
- Kicker: `4-bosqich · buzamiz` · Sarlavha: **`*` o'rniga `+`: lentada FAIL, build yurmaydi**
- Sahna: `order.ts` buzilgan + terminal FAIL (`08`): `Expected: 20000 · Received: 10002` · kod 1; lenta chizig'i: 📦 yashil → 🔍 qizil → 🎁 ✈️ kulrang («yurmadi») Yonida Actions oynasi (haqiqiy run qadamlaridan, `cicd2-out/21`): qadamlar `Run actions/checkout@v7` … `Run npm test` ✗ · `Run npm run build` ○. Xulosa qadamida (M3): `price * quantity` tiklangan → `npm test` PASS · kod 0 (`07`), lenta yashil.
1. **Jest-1 dagi buzish: `price + quantity` — lentada nima bo'ladi?**
   Ovoz: «Jest birinchi darsidagi buzishni lentada ko'ramiz: ko'paytirish o'rniga qo'shish yozamiz va push qilamiz.»
2. **Test qadami qizil: Expected 20000, Received 10002, kod 1**
   Ovoz: «Test qadami qizil: expected yigirma ming, received o'n ming ikki, chiqish kodi bir. Jest birinchi darsidagi xabarning o'zi, faqat endi u lenta logida.»
3. **Build va chiqarish kulrang — yurmadi; foydalanuvchi eski saytni ko'radi**
   Ovoz: «Keyingi qadamlar, build ham, chiqarish ham, yurmadi. Buzuq kod foydalanuvchiga yetmadi, eski versiya ishlab turibdi. Dasturchi qizilni ko'radi va tuzatadi.»
4. **Xulosa: qizil lenta — yomon emas; u xatoni foydalanuvchidan oldin ushladi**
   Ovoz: «Xulosa: qizil lenta yomon narsa emas. U xatoni foydalanuvchidan oldin ushladi. O'quvchiga shuni ayting: qizil, lenta ishlayapti degani.»
- Manba: `cicd1-out/08-npm-test-qizil.txt`, `09-zanjir-toxtaydi.txt`; GitHub'da — `cicd2-out/21` (`Run npm test` qizil, `Run npm run build` skipped), `22` (yashil).

## 17 · YAML xatolari: tahlilchi nima deydi  ← `Lesson`
- Kicker: `4-bosqich · buzamiz` · Sarlavha: **`on: once`, `runs-on` yo'q, surilish — uch xato va ularning xabari**
- Sahna: uch karta, har birida buzilgan qator + tahlilchi xabari (`10`):
  - `on: once` → `Unexpected value 'once'`
  - `runs-on` yo'q → `Required property is missing: runs-on`
  - `- run:` noto'g'ri surilgan → `A block sequence may not be used as an implicit map key`
  - Xulosa qadamida (M3): tuzatilgan fayl (`on: push` · `runs-on` · bir xil surilish) → tahlilchida `✓ xato yo'q` (`1-oquvchi-darsi.yml`).
1. **O'quvchi darsidagi noto'g'ri variantlar: `once`, `my-laptop` — tahlilchida sinadik**
   Ovoz: «O'quvchi darsida noto'g'ri variantlar bor: once, my laptop. Ularni va o'quvchilar ko'p qiladigan xatolarni rasmiy tahlilchida sinadik.»
2. **`on: once` — `Unexpected value`; `runs-on` yo'q — `Required property is missing`**
   Ovoz: «On once yozilsa, tahlilchi unexpected value deydi, ya'ni kutilmagan qiymat. Runs on qatori bo'lmasa, required property is missing deydi, ya'ni majburiy qator yetishmaydi. Ikkalasida ham qator raqami ko'rsatiladi.»
3. **Surilish xatosi — xabar tushunarsiz, lekin qator raqami to'g'ri**
   Ovoz: «Eng ko'p uchraydigani surilish: bitta chiziqcha boshqa joyga siljigan. Uning xabari tushunarsiz: block sequence, implicit map key. Lekin qator raqami to'g'ri ko'rsatiladi, o'sha qatorga qarang.»
4. **Xulosa: YAML xabarida avval qator raqamini o'qing, keyin surilishni solishtiring**
   Ovoz: «Xulosa: YAML xatosida avval qator raqamini o'qing, keyin o'sha qatorning surilishini yuqoridagi qator bilan solishtiring. GitHub'da bunday faylda lenta darhol qizil bo'ladi, ichida qadam ham, log ham yo'q. GitHub sahifasida surilish xatosi umumiy yaml syntax xabari bo'lib chiqadi va qator raqami blok boshini ko'rsatishi mumkin.»
- Manba: `cicd1-out/10-yml-tahlil.txt`, `cicd1-yml/3…6`; GitHub'da — `cicd2-out/30–32` (darhol qizil, job/log yo'q); run sahifalari skrinshotlari `cicd2-out/30, 31, 32, 34-actions-sahifa-skrinshot.png`: `on: once` va `runs-on` — matn tahlilchi bilan aynan; surilish — «You have an error in your yaml syntax on line 4» (xato 8-qatorda, blok boshi).

## 18 · Tekshiruv 3 — `in sync` xatosi  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **O'quvchi: «Lentam birinchi qadamda qizil: `npm ci can only install packages when … in sync`». Sabab?**
- Ovoz: «Buzishlarni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi lentasi birinchi qadamda qizil, xabarda in sync. Sabab nima? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 Testlar yiqildi · 2 Lock fayl `package.json`ga mos emas — bu repoda `npm install` · 3 Checkout qadami yo'q · 4 GitHub ishlamayapti
- To'g'ri (ovoz, `ok`): «To'g'ri. Lock fayl package json'ga mos emas, npm ci bunday holatda hech narsa o'rnatmaydi. O'quvchi reposida aynan shunday. Yechim: npm install yozish yoki lock faylni yangilab push qilish. Demak, in sync xatosi chiqsa, sabab kodda emas, lock faylda.» · qisqa: «`in sync` — lock fayl mos emas: `npm install` yoki lock'ni yangilash.»
- Xato izohlari: 1 — «Test'gacha yetmadi: xato o'rnatish qadamida.» · 3 — «Checkout'siz xabar boshqacha: `Could not read package.json`.» · 4 — «Xabar npm'dan keldi va sababini aniq aytyapti.»
- Maslahat: «Xabardagi ikki fayl nomini o'qing: qaysi ikki fayl mos emas?»
- Manba: `cicd1-out/01`, `11`.

## 19 · Amaliyot 3 — GitHub'da qizil va yashil  ← `Practice`
- Kicker: `Amaliyot 3 / 3` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **Ataylab buzing, qizil lentani o'qing, tuzating** · `tableAt: 3`
1. **Endi siz: kodni ataylab buzasiz va lentaning qizilini o'z ko'zingiz bilan ko'rasiz**
   Ovoz: «Oxirgi amaliyot: kodni ataylab buzasiz va lentaning qizilini o'zingiz ko'rasiz. Bunga o'n daqiqa ketadi.»
2. **1–2-qadam: `*` o'rniga `+`, push — Actions'da qizil**
   Ovoz: «Birinchi qadamda order ts'da ko'paytirish o'rniga qo'shish yozasiz. Ikkinchisida commit va push qilib, Actions'da lenta qizil bo'lishini kutasiz.»
3. **3–4-qadam: qizil qadamdagi `Received`, keyin tuzatish va yashil; isbot — `Received` qiymati**
   Ovoz: «Uchinchi qadamda qizil qadamni ochib, received qiymatini o'qiysiz. To'rtinchisida xatoni tuzatib, push qilasiz va yashil lentani ko'rasiz. Isbot maydoniga received qiymatini yozing.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz qizil lentaning logini o'qib, xatoni tuzatib, lentani yana yashilga qaytardingiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Buzish | `src/order.ts`: `price * quantity` → `price + quantity` | fayl saqlandi |
  | 2 | Push | `git commit -am "sinov: buzildi"` · `git push` | Actions'da qizil |
  | 3 | O'qish | qizil `npm test` qadami | `Expected: 20000 · Received: 10002` |
  | 4 | Tuzatish | `price * quantity` · commit · push | yashil |
- Isbot: «3-qadamdagi `Received` qiymati» · placeholder: «Received yonidagi sonni yozing» · KOD: `/^\s*10\s?002\s*$/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Lenta yashil qoldi | o'zgarish push qilinmagan yoki `order.spec.ts` yo'q |
  | Build qadami ham qizil | build test'dan oldin turibdi — tartib: install → test → build |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `cicd1-out/08` (`Received: 10002` — lokal, Jest'ning o'zi); Actions'da — `cicd2-out/21` (qizil, `Received: 10002`), `22` (yashil).

---

## 20 · CD: Delivery va Deployment  ← `Lesson`
- Kicker: `5-bosqich · CD` · Sarlavha: **CD — tekshirilgan yukni chiqarish: tasdiq bilan yoki o'zi**
- Sahna: lenta oxiri — ikki yo'l: «Delivery: tayyor, tasdiq tugmasi kutadi» · «Deployment: o'zi chiqaradi»; pastda: «Maxfiy kalitlar — `ci.yml`da emas, GitHub Secrets'da (o'quvchi kartochkasi)».
1. **CI tekshiradi; CD — tekshiruvdan o'tgan yukni foydalanuvchiga chiqaradi**
   Ovoz: «Lentamiz kodni build'gacha tekshirdi, bu CI. CD esa tekshiruvdan o'tgan yukni chiqaradi. O'quvchi darsida ikki rejim bor va ular faqat oxirgi qadamda farq qiladi.»
2. **Continuous Delivery — hammasi tayyor, lekin chiqarishni odam tasdiqlaydi**
   Ovoz: «Continuous Delivery, ya'ni yetkazishda lenta oxirigacha yetadi va yuk tayyor turadi. Chiqarishni mas'ul odam tasdiqlaydi. Pul o'tkazish ilovasi kabi joylarda shunday.»
3. **Continuous Deployment — hamma qadam yashil bo'lsa, o'zi chiqaradi**
   Ovoz: «Continuous Deployment'da esa hamma qadam yashil bo'lsa, hech kimdan so'ramay o'zi chiqaradi. Chiqarish uchun parol va kalitlar kerak, ular faylda emas, GitHub Secrets'da saqlanadi.»
4. **Xulosa: Delivery — tasdiq bilan, Deployment — o'zi; chiqarishni kursda keyin qilamiz**
   Ovoz: «Xulosa: Delivery'da chiqarishni odam tasdiqlaydi, Deployment'da lenta o'zi chiqaradi. Bugun lentamiz build'da tugaydi. Haqiqiy chiqarishni o'quvchilar loyiha kunlarida qiladi.»
- Manba: o'quvchi darsi Screen5–6, flashcard «Secret»; App.jsx m4c-04, m4c-07 (loyiha kunlari).

## 21 · Tekshiruv 4 — qaysi rejim  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **Pul o'tkazish ilovasi: har yangilanishni mas'ul xodim ko'rib chiqadi. Qaysi rejim?**
- Ovoz: «Chiqarish rejimlarini ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Pul o'tkazish ilovasida har yangilanishni mas'ul xodim ko'rib chiqadi. Qaysi rejim mos? Variantni tanlang.»
- Variantlar (to'g'risi — 1): 1 Delivery — tekshiruvdan keyin tasdiq bilan chiqadi · 2 Deployment — o'zi chiqadi · 3 Lentasiz — hammasi qo'lda · 4 Faqat CI, chiqarish umuman yo'q
- To'g'ri (ovoz, `ok`): «To'g'ri, Delivery. Tekshiruvni lenta qiladi, chiqarishni xodim tasdiqlaydi. Deployment bo'lsa, xodim ko'rib chiqishga ulgurmaydi. Demak, chiqarishni odam tasdiqlasa Delivery, lenta o'zi chiqarsa Deployment.» · qisqa: «Delivery: lenta tekshiradi, xodim tasdiqlaydi.»
- Xato izohlari: 2 — «Tasdiqsiz chiqsa, xodim ko'rishga ulgurmaydi.» · 3 — «Tekshiruvni lenta qilsa ham bo'ladi — faqat chiqarish tasdiq bilan.» · 4 — «Ilova yangilanishi baribir chiqishi kerak.»
- Maslahat: «Shartdagi kalit so'z: «ko'rib chiqadi». Qaysi rejimda tasdiq bor?»
- Manba: o'quvchi darsi Screen5.

---

## 22 · m4c-01 xaritasi  ← `Lesson`
- Kicker: `6-bosqich · o'quvchi darsini o'tish` · Eyebrow: `m4c-01 · «CI/CD nima va nega kerak»` · Sarlavha: **m4c-01: aeroport lentasi, chamadon va yo'l xaritasi**
  | Blok | O'quvchi ekranlari | Siz qo'shasiz |
  |---|---|---|
  | 1 Kirish | s0 qo'lda uchirish · s1 reja | lenta = terminal buyruqlari (2-ekran) |
  | 2 Tushuncha | s2 muammo · s3 lenta · s4 test · s5 CI · s6 CD · s7 nuqtalar va buyruqlar · s8 test | chiqish kodi (4-ekran) |
  | 3 O'yin | s9 lenta o'yini (qizil nuqtada to'xtaydi) · s10 test · s11 nega | `&&` zanjiri (8-ekran) |
  | 4 ci.yml | s12 ikki holat · s13 `ci.yml` bo'shliqlari · s14 test | checkout (11-ekran) · `npm install` (13-ekran) |
  | 5 Yakun | s15 lentani yig'ish · amaliyot · kartochkalar · uyga vazifa (test) | Actions'da qizil/yashil (19-ekran) |
1. **m4c-01 — 21 ekran: aeroport lentasi, chamadon va yo'l xaritasi**
   Ovoz: «Endi o'quvchi darsini ko'ramiz: m4c-01, unda yigirma bir ekran bor. Darsda kod chamadonga, lenta aeroport lentasiga, ci yml esa yo'l xaritasiga o'xshatiladi. Lentada beshta nuqta bor: yig'ish, skaner, o'lcham ramkasi, o'rash va uchirish.»
2. **Amaliyotdagi `ci.yml`da checkout yo'q — o'quvchilarga bu qatorni qo'shtiring**
   Ovoz: «Eng muhim ogohlantirish: amaliyotdagi ci yml'da checkout yo'q. Uni yozmasa, lenta qizil bo'ladi. O'quvchilarga birinchi qadam sifatida actions checkout'ni qo'shtiring va o'rnatishni npm install bilan qoldiring.»
3. **O'quvchi lentasida lint nuqtasi bor — o'quvchi reposida u qizil, oldindan ayting**
   Ovoz: «Lenta o'yinida lint nuqtasi bor. O'quvchi uni lentaga qo'shmoqchi bo'lsa, oldindan ayting: bu repoda lint qirq olti error beradi.»
4. **Xulosa: vaqt — amaliyotga ko'proq; har o'quvchi Actions'da bitta yashil ko'rsin**
   Ovoz: «Xulosa: vaqt bo'yicha taklif, to'qson daqiqaning o'ttizini amaliyotga bering. Har o'quvchi Actions'da bitta yashil lentani o'z ko'zi bilan ko'rsin, qolgani shundan keyin oson.»
- Manba: `src/4c-Modull/CiCdIntroLesson.jsx` — `SCREEN_META` (21), ekran matnlari, `ScreenCicdPractice`, `CICD_FLASHCARDS`.

## 23 · O'quvchi darsidagi so'zlar va sinfdagi holatlar  ← `Lesson`
- Kicker: `6-bosqich · sinfda` · Sarlavha: **Lenta nuqtalari — buyruqlar; olti holat va tayyor javoblar**
  | O'quvchi aytadi | Siz bilasiz |
  |---|---|
  | 📦 Yig'ish · 🔍 Skaner · 📐 O'lcham ramkasi · 🎁 O'rash · ✈️ Uchirish | `npm install` · `npm test` · `eslint` · `npm run build` · deploy |
  | chamadon · yo'l xaritasi · lenta mashinasi | kod · `ci.yml` · runner |
  | # | Holat | Xabar | Yechim |
  |---|---|---|---|
  | 1 | Lenta yo'q | Actions bo'sh | `.github/workflows` nomi |
  | 2 | Checkout yo'q | `Could not read package.json` | `actions/checkout` |
  | 3 | `npm ci` | `in sync` | `npm install` |
  | 4 | Test yo'q | `No tests found` | bitta test |
  | 5 | Lint | 46 error | lentadan olib turish |
  | 6 | YAML | qator raqami | surilish |
- O'quvchi so'rasa:
  - «Lenta pulli emasmi?» → GitHub hujjati (`12`): ochiq repoda standart mashina bepul; yopiq repoda tarifdagi bepul ulushdan sarflanadi, oshsa — pullik.
  - «Kompyuterim o'chiq bo'lsa ham ishlaydimi?» → ha, lenta GitHub mashinasida.
  - «Qizil lenta — yomonmi?» → yo'q, xato foydalanuvchidan oldin ushlandi.
  - «`.env` lentada bormi?» → yo'q; maxfiy qiymatlar GitHub Secrets'da.
1. **O'quvchi darsi aeroport so'zlarini ishlatadi — siz buyruqni birga aytasiz**
   Ovoz: «Xaritani ko'rdingiz, endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz. O'quvchi darsi aeroport so'zlarini ishlatadi: yig'ish, skaner, o'rash. Siz har so'z bilan buyruqni birga ayting: skaner, ya'ni npm test.»
2. **Uch xabar uch sabab: `Could not read package.json`, `in sync`, `No tests found`**
   Ovoz: «Endi sinfda albatta chiqadigan holatlar. Birinchi uchtasi xabardan taniladi. Could not read package json chiqsa, checkout yo'q. In sync chiqsa, sabab npm ci. No tests found chiqsa, repoda test yo'q.» · 2–4-karta
3. **Lint 46 error, YAML qator raqami, Actions bo'sh — sababi bir qarashda**
   Ovoz: «Lint qirq olti error bersa, uni lentadan olib turing. YAML xatosida avval qator raqamini o'qing. Actions bo'limi bo'sh bo'lsa, papka nomi noto'g'ri yozilgan.» · 1, 5–6-karta
4. **Xulosa: lenta logini o'quvchi bilan birga o'qing — qaysi qadam qizil, keyin xabar**
   Ovoz: «Xulosa va usul bitta: javobni darhol aytmang, lenta logini o'quvchi bilan birga o'qing. Avval qaysi qadam qizil ekanini toping, keyin uning xabarini o'qing. Pastda o'quvchi savollariga tayyor javoblar bor.» · QA
- Manba: `cicd1-out/01…11`; o'quvchi darsi kartochkalari.

## 24 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | Lenta qadam qizilligini nimadan biladi? | chiqish kodi 0 emas · log uzunligi · vaqt · fayl hajmi | 1 | 0 — yashil, boshqasi — qizil. | 4 |
  | 2 | Lenta mashinasi har safar qanday papkadan boshlaydi? | sizning papkangizdan · bo'sh papkadan · oldingi lentadan · `node_modules` bilan | 2 | Shuning uchun checkout va install kerak. | 4 |
  | 3 | O'quvchi reposida `npm ci` nima beradi? | PASS · `No tests found` · `in sync` xatosi, kod 1 · 759 paket | 3 | Lock fayl eskirgan. | 6 |
  | 4 | Test fayli yo'q repoda `npm test`? | PASS · build yuradi · hech narsa · `No tests found`, kod 1 | 4 | Lenta qizil. | 7 |
  | 5 | `ci.yml`da `actions/checkout` yo'q bo'lsa? | papka bo'sh — `Could not read package.json` · tahlilchi xato beradi · lenta yuradi · testlar o'tadi | 1 | Tahlilchi xato bermaydi — yozilishi to'g'ri. | 11 |
  | 6 | O'quvchi reposida lint qadami lentada? | yashil · 46 error — qizil · yurmaydi · faqat ogohlantirish | 2 | `--fix` ham 14 faylni o'zgartiradi. | 15 |
  | 7 | `npm test && npm run build`, test qizil — build? | yuradi · yarim yuradi · yurmaydi · ikki marta yuradi | 3 | `&&` — oldingisi yashil bo'lsa. | 8 |
  | 8 | Har yangilanish tasdiq bilan chiqadi — bu? | Deployment · CI · lentasiz · Delivery | 4 | Delivery — tasdiq bilan. | 20 |
- `passed = ball ≥ 6 && 3 amaliyot isbot bilan`.

## 25 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz**
- Xulosa 6 band: (1) CI — har push toza mashinada tekshiriladi; CD — chiqarish (Delivery / Deployment) · (2) lenta = toza papka + buyruqlar + chiqish kodi; birinchi qizilda to'xtaydi (`&&`) · (3) o'quvchi reposi: `npm ci` — `in sync`, `npm install` ishlaydi; test yo'q — qizil; build yashil · (4) `ci.yml`: `on` · `runs-on` · `steps`; birinchi qadam — `actions/checkout` · (5) buzamiz: lint 46 error, YAML xatolari — qator raqami · (6) o'quvchi darsi: aeroport so'zlari = buyruqlar; amaliyotga checkout qo'shtiring.
- **Uyga vazifa** (M14): «Jest darslaridagi reposingizga lenta qo'shing: checkout, setup node, npm install, npm test va npm run build. Bir marta ataylab qizil qiling va tuzating. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Lenta | `.github/workflows/ci.yml` (12-ekran) | — |
  | 2 | Yashil | push → Actions | yashil |
  | 3 | Qizil | testni buzing → push | qizil, `Received` |
  | 4 | Tuzatish | push | yashil |
  | 5 | Topshirish | repo linki platformadagi uyga vazifaga (M30) | — |
  Vaqt: 30–45 daqiqa. Tekshiruvchi qaraydi: `ci.yml` to'g'ri papkada · checkout birinchi · `npm install` · Actions tarixida bitta qizil va undan keyingi yashil.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **GitHub Actions** — run, log va o'quvchi darsidagi namunalar». (01.11 sifat ko'rigi B3.)

---

## «KOD» — qurishda
1. Jest-2 yordamchilari (`ts()`, `jt()`, `Term`, Explorer) — CI/CD-1 bo'lagida nusxa + YAML rang beruvchi; generator `dev/cicd1-matn.py`.
2. Chiqishlar `cicd1-out/` dan aynan; `/tmp/claude-…` yo'llari `…/lenta-sinov` ga qisqartiriladi.
3. LineCheck (13-ekran): 11-satr → `target={10}`; `fixed` da har satrga `n`.
4. Actions oynasi (16-ekran) — haqiqiy run qadamlaridan (`cicd2-out/21`: nomlar va holatlar aynan), yorlig'i «haqiqiy run ma'lumotidan».
5. Isbotlar: 9 — `/^\s*"?UCHIRISH"?\s*$/i` · 14 — `/Tests:\s+\d+ passed,\s+\d+ total/` · 19 — `/^\s*10\s?002\s*$/`.

## Ochiq savollar ([GATE M])
1. ✅ **Actions'ni haqiqiy yurgizish** (PRD Q1) — 01.11 18:20–18:43, sinov reposi `kirishnomi4-wq/mentor-ci-sinov` (private), 28 tajriba (`cicd2-out/06-actions-xulosa.md`); 4, 11, 12, 14, 16, 17, 19-ekranlardagi ⚠ run'lar bilan almashtirildi (17-ekran: run sahifalari skrinshotlari bilan tekshirildi — 01.11 19:33).
2. Tavsiya `ci.yml` (PRD Q2): `npm install` (`npm ci` emas), lint yo'q, v7 — tasdiqlang.
3. ~~23-ekran «lenta pulli emasmi?»~~ — GitHub hujjatidan tekshirildi (`cicd1-out/12`): ochiq repoda bepul, yopiq repoda tarif ulushidan.

## O'quvchi darslari uchun alohida ish (qaror kerak; tegilmadi)
1. **m4c-01** amaliyoti: `ci.yml`da `actions/checkout` yo'q → GitHub'da `npm install` yiqiladi (sinaldi: `cicd2-out/13`, `Could not read package.json`).
2. **m4c-01**: lenta nuqtasi «O'lcham ramkasi» (`eslint .`) — o'quvchi reposida 46 error; o'quvchi lentaga qo'shsa doim qizil.
3. **m4c-03**: `actions/checkout@v4` / `setup-node@v4` — hozirgi so'nggi v7 (v4 ishlaydi, har run'da «Node.js 20 is deprecated» ogohlantirishi — `cicd2-out/10`, `25`).
4. O'quvchi reposi: `package-lock.json` eskirgan (`npm ci` yiqiladi) — repo egasi lock'ni yangilasa, CI andozalari ishlaydi.
