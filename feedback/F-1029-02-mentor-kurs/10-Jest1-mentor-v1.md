# Mentor kursi · Jest-1 «Birinchi unit-test: o'quvchi reposida» — MD v1

F-ID: F-1029-02 (Jest-1) · Sana: 2026-11-01 (avtopilot) · Holat: **KO'RIKDA** ([GATE M] kutilmoqda) · Fidbek: qator yoniga `>> …`
PRD: `09-Jest1-PRD.md` v1 (savollar berilmagan — avtopilot takliflari Q1–Q3)
Fayl (quriladi): `src/mentor-kurs/JestUnitMentorLesson.jsx` · bo'laklar `src/mentor-kurs/jest1/parts/` · dvigatel — umumiy `parts/01–02`
Qonun: `MENTOR_DARS_ETALON.md` M1–M31 · Haqiqiy chiqishlar: `manba/jest1-out/` (skript `manba/drive-jest1.sh`, har `npm test` toza muhitda)

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | Nest-1 va Nest-2 ni o'tgan mentor: o'quvchi reposini (`IntroNestArxitechture`) o'zida ishga tushirgan, Module · Controller · Service'ni biladi. Test yozmagan, Jest natijasini o'qimagan. |
| Dars oxirida mentor | 1) unit-test nima ekanini va Jest testni qanday topishini biladi (o'quvchi reposida tayyor sozlama) · 2) `describe` · `it` · `expect` bilan test yozadi · 3) PASS va FAIL natijasini o'qiydi (`Expected` / `Received`, `>` satr, fayl va satr raqami) · 4) yolg'on testni taniydi (`expect`siz yashil, noto'g'ri etalon bilan qizil) · 5) chegara qiymatni sinaydi · 6) sinfdagi sozlash tuzoqlarini biladi va m4b-01 ni o'tadi |
| O'quvchi darsi | **m4b-01** «Unit-test: Jest» (21 ekran). Oldingi mentor darslari: Nest-1, Nest-2. |
| Kursdagi o'rni | Nest-2 → **shu** → Jest-2 (edge cases, `toThrow`) — M31: raqamsiz |
| Til | M9. Yangi atamalar: unit-test, test fayli (`*.spec.ts`), tasdiq (assertion — `expect`), etalon (kutilgan qiymat), PASS / FAIL. |
| Misol-ip | **O'quvchi darsidagi aynan:** KitobShop `orderTotal(price, quantity)` → `src/order.ts` + `src/order.spec.ts`; uyga vazifa `deliveryFee(total)` → `src/delivery.ts` + `src/delivery.spec.ts`. Hammasi o'quvchi reposi ichida. |
| Haqiqiylik (M10) | 01.11.2026: o'quvchi reposi GitHub'dan yangi papkaga · Node 24.18 · npm 11.16 · jest 30.4.2 · ts-jest 29.4.11 · typescript 5.9.3. **Har `npm test` toza muhitda** — Jest 30 sun'iy intellekt agenti muhitini sezsa ixcham chiqaradi; ekrandagi chiqish o'quvchi terminalidagi bilan bir xil (`jest1-out/README.md`). |
| Hajm | **26 ekran** · 6 bosqich · 4 amaliyot · 4 tekshiruv · 8 savol · jami ≈ 1 soat |
| Me'yor | ≤ 5 segment, ≤ 60 so'z, ko'prik, «Xulosa», kalit 8–14 so'z |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **unit-test** — bitta funksiyani alohida sinaydigan kod: «shu kirishga shu chiqish». Bir marta yoziladi, `npm test` har safar tekshiradi.
- **Jest qayerdan topadi** — o'quvchi reposining `package.json`ida `jest` bo'limi tayyor: `rootDir: "src"`, `testRegex: ".*\\.spec\\.ts$"`, `transform: ts-jest`. Ya'ni test fayli **`src/` ichida** va nomi **`.spec.ts`** bilan tugaydi.
- **`describe`** — bitta funksiyaning testlarini guruhlaydi · **`it`** — bitta holat · **`expect(natija).toBe(etalon)`** — tasdiq: natija etalonga tengmi.
- **AAA** — Tayyorlash → Chaqirish → Tekshirish (Arrange · Act · Assert).
- **FAIL o'qish** — `● describe › it` · `Expected:` (etalon) · `Received:` (funksiya qaytargani) · `>` belgili satr · `at … (order.spec.ts:6:20)`.
- **yolg'on test** — `expect` yo'q (doim PASS) yoki etalon noto'g'ri (to'g'ri kod bilan FAIL).
- **chegara** — shart o'zgaradigan aynan qiymat (100 000): `>=` va `>` farqi faqat shu yerda ko'rinadi.

**Darsning ipi:** o'quvchi reposi → Jest allaqachon bor → birinchi test (PASS) → buzamiz (FAIL o'qish, yolg'on testlar) → chegara (uyga vazifa misoli) → sinfdagi tuzoqlar (joy, nom, `npm ci`, Nest bo'lmagan loyiha) → m4b-01 ga ko'prik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | Unit-test: funksiya — mashina | Lesson | 1 · unit-test |
| 3 | Jest o'quvchi reposida allaqachon bor | Lesson | 1 |
| 4 | Tekshiruv 1 — «test yozdim, No tests found» | MCRetry | 1 |
| 5 | Birinchi test: `describe` · `it` · `expect` | Lesson | 2 · birinchi test |
| 6 | PASS'ni o'qish | Lesson | 2 |
| 7 | Amaliyot 1 — birinchi test | Practice | 2 |
| 8 | FAIL'ni o'qish: kod buzildi | Lesson | 3 · buzamiz |
| 9 | Noto'g'ri etalon: kod to'g'ri, test qizil | Lesson | 3 |
| 10 | Yolg'on PASS: `expect` yo'q | Lesson | 3 |
| 11 | Tekshiruv 2 — qaysi satr testni yolg'on qiladi | LineCheck | 3 |
| 12 | Amaliyot 2 — uch xil buzish | Practice | 3 |
| 13 | Chegara: `deliveryFee` va 100 000 | Lesson | 4 · chegara |
| 14 | AI yozgan testni tekshirish | Lesson | 4 |
| 15 | Tekshiruv 3 — kim xato: kod yoki etalon | MCRetry | 4 |
| 16 | Amaliyot 3 — `deliveryFee` | Practice | 4 |
| 17 | Sinfdagi tuzoqlar: joy, nom, `npm ci` | Lesson | 5 · tuzoqlar |
| 18 | Nest bo'lmagan loyiha: to'rt qadamli zanjir | Lesson | 5 |
| 19 | Tekshiruv 4 — TypeScript 7 | MCRetry | 5 |
| 20 | Amaliyot 4 — `No tests found`ni o'zingiz chiqaring | Practice | 5 |
| 21 | m4b-01 xaritasi | Lesson | 6 · ko'prik |
| 22 | O'quvchi darsidagi so'zlar: Jestbot, varaqa, etalon kartochkasi | Lesson | 6 |
| 23 | O'quvchi darsidagi `npm i -D jest ts-jest` | Lesson | 6 |
| 24 | Sinfdagi holatlar va o'quvchi savollari | Lesson | 6 |
| 25 | O'z-sinov — 8 savol | Screen27 | — |
| 26 | Yakun | Screen28 | — |

**Sahna turlari:** VS Code oynasi `IntroNestArxitechture` (Explorer: `dist/` `node_modules/` `test/` yopiq · `src/` ichida `api/` `common/` `config/` `core/` `infrastructure/` yopiq + yangi `order.ts`, `order.spec.ts`, keyin `delivery.ts`, `delivery.spec.ts` · `package.json`) + terminal (`npm test`). Bo'sh loyiha (18-ekran) — `bosh/` Explorer.

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · Jest` · Sarlavha: **Kodni o'zgartirdingiz. Hisob hali ham to'g'rimi — buni test aytadi.**
- Sahna: chapda reja (6 bosqich); o'ngda natija — terminal: `PASS src/order.spec.ts` · `✓ 2 kitob narxini hisoblaydi`.
- Reja: 01 Unit-test va Jest · 02 Birinchi test · 03 Buzamiz: FAIL va yolg'on testlar · 04 Chegara va AI testi · 05 Sinfdagi tuzoqlar · 06 O'quvchi darsini o'tish
1. **Kod o'zgarganda eski hisoblar buzilmaganini har safar qo'lda tekshirib bo'lmaydi**
   Ovoz: «Assalomu alaykum. Loyihada kod har kuni o'zgaradi. Har o'zgarishdan keyin eski hisoblar buzilmaganini qo'lda tekshirib bo'lmaydi: beshta hisob bo'lsa ham, ellikta bo'lsa ham. Bu ishni kompyuterga topshirish mumkin. Bu unit-test deyiladi, uni Jest ishga tushiradi.»
2. **Bugun o'quvchi reposida birinchi testni yozasiz va natijasini o'qiysiz**
   Ovoz: «Bugun Nest darslaridagi o'quvchi reposida birinchi testni yozasiz. Misol o'quvchi darsidagi aynan funksiya: KitobShop'dagi buyurtma summasi. Test yashil bo'lganda va qizil bo'lganda terminal nima deyishini o'qishni o'rganasiz.» · reja 01–02
3. **Testni ataylab buzamiz: yolg'on yashil va noto'g'ri qizil — ikkalasini tanib olasiz**
   Ovoz: «Keyin testni ataylab buzamiz. Ba'zi test hech narsani tekshirmasa ham yashil bo'ladi, ba'zisi kod to'g'ri bo'lsa ham qizil. O'quvchi AI'dan test so'raydi, shuning uchun bu ikkisini tanish sizga albatta kerak.» · reja 03–04
4. **Olti bosqich, to'rt amaliyot. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi**
   Ovoz: «Oxirida sinfdagi sozlash tuzoqlarini va o'quvchi darsini qanday o'tishni ko'ramiz. Dars olti bosqichdan iborat, to'rtta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.» · reja 05–06
- Manba: `jest1-out/03-pass.txt`.

---

## 2 · Unit-test: funksiya — mashina  ← `Lesson`
- Kicker: `1-bosqich · unit-test` · Sarlavha: **Funksiya kirishni oladi, natija qaytaradi — test shu juftni tekshiradi**
- Sahna: «mashina» kartasi: `orderTotal(10000, 2)` → `20000`; pastda uch juft (10000·2 → 20000 · 5000·3 → 15000 · 120000·1 → 120000); 3-segmentda `src/order.ts` VS Code oynasida.
1. **O'quvchi darsi funksiyani mashina deb tushuntiradi: kirish beriladi, natija chiqadi**
   Ovoz: «Testga o'tishdan oldin funksiyaga boshqacha qaraymiz. O'quvchi darsi uni mashina deb tushuntiradi: kirish berasiz, u natija qaytaradi. orderTotal'ga narx va soni beriladi, u summani qaytaradi. Masalan, o'n ming va ikkini bersak, natija yigirma ming bo'ladi.»
2. **Unit-test — shu juftni yozib qo'yish: «shu kirishga aynan shu chiqish»**
   Ovoz: «Unit-test shu juftni yozib qo'yadi: shu kirishga aynan shu chiqish bo'lishi kerak. Bir marta yoziladi va har safar bitta buyruq bilan tekshiriladi. Unit bitta bo'lak degani: test bitta funksiyani bazasiz va serversiz sinaydi.»
3. **Funksiyaning o'zi uch satr: `src/order.ts` — narx ko'paytirish soni**
   Ovoz: «Funksiyaning o'zi uch satr, o'quvchi reposida src papkasidagi order ts faylida turadi. U narxni soniga ko'paytiradi. Hozir bu oddiy, lekin keyinroq ichiga chegirma yoki soliq qo'shilsa, test eski hisoblar buzilmaganini aytadi.»
   ```ts
   export function orderTotal(price: number, quantity: number): number {
     return price * quantity;
   }
   ```
4. **Xulosa: unit-test — bitta funksiya, bitta kirish, bitta kutilgan natija**
   Ovoz: «Xulosa: unit-test bitta funksiyani alohida sinaydi. Unda uch narsa bor: kirish, kutilgan natija va ularni solishtiradigan bitta tasdiq. Kutilgan natijani bugun etalon deb ataymiz, o'quvchi darsida u etalon kartochkasi.»
- Manba: `drive-jest1.sh` (`src/order.ts`); o'quvchi darsi Screen2 («Har funksiya bir mashina»).

## 3 · Jest o'quvchi reposida allaqachon bor  ← `Lesson`
- Kicker: `1-bosqich · unit-test` · Sarlavha: **`package.json`dagi `jest` bo'limi: `src` ichida, nomi `.spec.ts`**
- Sahna: VS Code: `package.json` (jest bo'limi, 3 satr yoritiladi); terminal: `npm test` → `No tests found`.
1. **Nest loyihasi Jest bilan birga yaratiladi — o'quvchi reposida u allaqachon sozlangan**
   Ovoz: «Avval yaxshi xabar: Nest loyihasi Jest bilan birga yaratiladi. O'quvchi reposining package json faylida test buyrug'i ham, jest bo'limi ham tayyor. Hech narsa o'rnatish shart emas, npm install yetarli.»
2. **Uch satr muhim: `rootDir` — `src`, `testRegex` — `.spec.ts`, `transform` — `ts-jest`**
   Ovoz: «Jest bo'limida uchta satr muhim. Birinchisi root dir src: Jest faqat src papkasi ichini qaraydi. Ikkinchisi test regex: fayl nomi spec ts bilan tugashi kerak. Uchinchisi transform ts jest: TypeScript faylni Jest tushunadigan ko'rinishga o'tkazadi.»
   ```json
   "jest": {
     "rootDir": "src",
     "testRegex": ".*\\.spec\\.ts$",
     "transform": { "^.+\\.(t|j)s$": "ts-jest" }
   }
   ```
3. **Hozir `npm test` — `No tests found`: repoda hali birorta test yo'q**
   Ovoz: «Hozir npm test qilsak, Jest no tests found deydi, ya'ni test topilmadi, chiqish kodi esa bir. Jest o'ttiz yettita faylni ko'rdi, lekin ularning hech biri spec ts emas. Bu xato emas: o'quvchi birinchi testini yozmaguncha shunday bo'ladi.»
   ```
   No tests found, exiting with code 1
   In …/IntroNestArxitechture/src
     37 files checked.
     testRegex: .*\.spec\.ts$ - 0 matches
   ```
4. **Xulosa: test fayli — `src/` ichida va nomi `.spec.ts` bilan tugaydi**
   Ovoz: «Xulosa: o'quvchi reposida Jest tayyor, faqat ikki shart bor. Test fayli src papkasi ichida turadi va nomi spec ts bilan tugaydi. Bu ikki shartdan biri buzilsa, Jest testni ko'rmaydi. Sinfdagi eng ko'p savol aynan shu.»
- Manba: `jest1-out/01-clone-install.txt` (jest bo'limi), `02-test-yoq.txt`.

## 4 · Tekshiruv 1 — «test yozdim, No tests found»  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **O'quvchi `order.spec.ts` yozdi va `npm test` qildi — `No tests found`. Birinchi nimani tekshirasiz?**
- Ovoz: «Jest sozlamasini ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. O'quvchi order spec ts faylini yozdi va npm test qildi, javob esa no tests found bo'ldi. Fayl ichidagi kod to'g'ri. Birinchi nimani tekshirasiz? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 `npm install` qayta qilinsin · 2 `expect` to'g'ri yozilganmi · 3 Fayl qayerda turibdi — `src/` ichidami · 4 Jest versiyasi
- To'g'ri (ovoz): «To'g'ri, birinchi navbatda faylning joyini tekshirasiz. Sinab ko'rdik: xuddi shu fayl loyiha ildizida tursa, Jest uni ko'rmaydi va no tests found deydi, chunki root dir src. Fayl src ichiga ko'chirilsa, test topiladi. Nomi ham muhim: order test ts bo'lsa ham topilmaydi. Demak, no tests found chiqsa, avval test fayli src ichida turganini va nomi spec ts bilan tugashini tekshiring.» · qisqa: «`rootDir: src` — `src/`dan tashqaridagi fayl ko'rinmaydi. Nomi ham: `.test.ts` emas, `.spec.ts`.»
- Xato izohlari: 1 — «Jest o'rnatilmagan bo'lsa `jest: not found` chiqardi, `No tests found` emas.» · 2 — «`expect` xato bo'lsa test topilib, FAIL bo'lardi.» · 4 — «Versiya topish qoidasiga ta'sir qilmaydi — qoida `package.json`da.»
- Maslahat: «Xabar «test topilmadi» deyapti, «xato» emas. Jest testni qayerdan va qaysi nom bilan qidiradi?»
- Manba: `jest1-out/07-src-dan-tashqari.txt`, `08-test-ts-nomi.txt`, `17-ornatilmagan.txt` (`sh: 1: jest: not found`).

---

## 5 · Birinchi test: `describe` · `it` · `expect`  ← `Lesson`
- Kicker: `2-bosqich · birinchi test` · Sarlavha: **`order.spec.ts` — to'rt qism: import, describe, it, expect**
- Sahna: VS Code: Explorer'da `src/order.ts` yonida yangi `src/order.spec.ts` (`fresh`); kod 8 satr, qism-qism yoritiladi; 4-segmentda AAA uch belgisi satrlar yonida.
  ```ts
  import { orderTotal } from './order';

  describe('orderTotal', () => {
    it('2 kitob narxini hisoblaydi', () => {
      const result = orderTotal(10000, 2);
      expect(result).toBe(20000);
    });
  });
  ```
1. **Test fayli funksiya yonida: `order.ts` — `order.spec.ts`, ikkalasi `src/` ichida**
   Ovoz: «Test fayli funksiyaning yonida turadi: order ts yonida order spec ts. Birinchi qatordagi import funksiyani test fayliga olib kiradi. Jest bu faylni nomidan topadi va ichidagi testlarni ishga tushiradi.»
2. **`describe` — guruh: bitta funksiyaning testlari bir joyda, nomi bilan**
   Ovoz: «Describe bitta funksiyaning hamma testlarini guruhlaydi. Uning birinchi argumenti guruh nomi: orderTotal. Natijada shu nom ko'rinadi, shuning uchun qaysi funksiya xato berganini darhol bilasiz.»
3. **`it` — bitta holat, nomi oddiy gap bilan: «2 kitob narxini hisoblaydi»**
   Ovoz: «It bitta holatni sinaydi. Nomi oddiy gap bilan yoziladi: ikki kitob narxini hisoblaydi. Test qizil bo'lganda aynan shu gap chiqadi, shuning uchun nom tushunarli bo'lishi kerak.»
4. **`expect(result).toBe(20000)` — tasdiq: natija etalonga teng bo'lishi shart**
   Ovoz: «Eng muhim qator shu: expect, result, to be yigirma ming. Bu tasdiq: natija aynan yigirma ming bo'lishi kerak. Tepadagi qator funksiyani chaqiradi, bu qator tekshiradi. Tayyorlash, chaqirish, tekshirish: o'quvchi darsida bu uch qadam deyiladi.»
5. **Xulosa: `describe` — kim sinaladi, `it` — qaysi holat, `expect` — nima kutiladi**
   Ovoz: «Xulosa: describe qaysi funksiya sinalayotganini aytadi, it qaysi holatni, expect esa nima kutilayotganini. Testda haqiqatan tekshiradigan yagona qator expect. Uchinchi bosqichda ko'rasiz: expect'ni unutgan test hech narsani tekshirmaydi.»
- Manba: `drive-jest1.sh` (`src/order.spec.ts`); o'quvchi darsi Screen5–6 (4 qism), Screen12 (AAA).

## 6 · PASS'ni o'qish  ← `Lesson`
- Kicker: `2-bosqich · birinchi test` · Sarlavha: **`PASS src/order.spec.ts` — fayl, guruh, holat va jami**
- Sahna: terminal (haqiqiy, toza muhit) — satrlar navbat bilan yoritiladi.
  ```
  $ npm test
  > IntroNestArxitechture@0.0.1 test
  > jest

  PASS src/order.spec.ts
    orderTotal
      ✓ 2 kitob narxini hisoblaydi (2 ms)

  Test Suites: 1 passed, 1 total
  Tests:       1 passed, 1 total
  Snapshots:   0 total
  Time:        0.389 s, estimated 1 s
  Ran all test suites.
  ```
1. **`npm test` — `package.json`dagi `jest` buyrug'i: fayl topildi va yurdi**
   Ovoz: «Testni yozdik, endi npm test buyrug'ini beramiz. Bu package json'dagi jest buyrug'ini ishga tushiradi. Birinchi yashil satrda PASS va fayl yo'li turibdi: src order spec ts. Fayl topildi va undagi hamma test o'tdi.»
2. **Ostida guruh nomi va holat: `orderTotal` → `✓ 2 kitob narxini hisoblaydi`**
   Ovoz: «Uning ostida describe nomi, orderTotal, yozilgan, undan pastda esa belgi bilan it nomi: ikki kitob narxini hisoblaydi, ikki millisekundda. Nomlar aynan siz yozgan gaplar, shuning uchun ular tushunarli yozilishi kerak.»
3. **Pastda jami: `Test Suites` — fayllar, `Tests` — `it`lar soni**
   Ovoz: «Eng pastda jami turadi. Test suites fayllar sonini aytadi: bitta fayl, u o'tdi. Tests esa it'lar sonini aytadi: bitta. Testlar ko'paygach, sinfda o'quvchi bilan shu ikki satrga qaraysiz: nechta o'tdi, nechta yiqildi.»
4. **Xulosa: PASS — fayl va holatlar o'tdi; `Tests:` satri — nechta `it` tekshirildi**
   Ovoz: «Xulosa: PASS fayl va undagi hamma holat o'tganini bildiradi. Tests satri nechta it tekshirilganini aytadi. Lekin diqqat: PASS faqat expect'lar to'g'ri bo'lsa ma'noli. Buni uchinchi bosqichda isbotlaymiz.»
- Manba: `jest1-out/03-pass.txt` (toza muhit).

## 7 · Amaliyot 1 — birinchi test  ← `Practice`
- Kicker: `Amaliyot 1 / 4` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **O'quvchi reposida `order.ts` va `order.spec.ts`** · `tableAt: 3`
1. **Endi siz: o'quvchi reposida birinchi testni yozib, yashil PASS'ni ko'rasiz**
   Ovoz: «Endi navbat sizga. O'quvchi reposida birinchi testni yozasiz. Nest darsidagi repo sizda bo'lsa, o'shani oching; bo'lmasa clone va npm install qiling. Bunga o'n daqiqa ketadi.»
2. **1–2-qadam: `npm test` — avval `No tests found`, keyin `src/order.ts`**
   Ovoz: «Birinchi qadamda hech narsa yozmasdan npm test qiling va no tests found chiqishini ko'ring. Ikkinchisida src papkasida order ts faylini ochib, uch satrli funksiyani yozing.»
3. **3–4-qadam: `src/order.spec.ts` va `npm test`; isbot — `Tests:` satri**
   Ovoz: «Uchinchi qadamda uning yonida order spec ts faylini oching va kodni nusxalamasdan o'zingiz yozing. To'rtinchisida npm test qiling. Isbot maydoniga natijadagi Tests satrini nusxalang.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin o'quvchi reposida sizning birinchi testingiz bor va siz PASS natijasini o'qiy olasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Repo va bo'sh test | `git clone https://github.com/Azizbekcrypto/IntroNestArxitechture.git` (yoki Nest darsidagi papka) · `npm install` · `npm test` | `No tests found, exiting with code 1` |
  | 2 | Funksiya | `src/order.ts` — «Kodni ochish» | fayl saqlandi |
  | 3 | Test | `src/order.spec.ts` — «Kodni ochish» (namuna — o'zingiz yozing) | fayl saqlandi |
  | 4 | Ishga tushirish | `npm test` | `PASS src/order.spec.ts` · `✓ 2 kitob narxini hisoblaydi` |
- Isbot: «`Tests:` satri» · placeholder: «natijadagi Tests satrini qo'ying» · KOD: `/Tests:\s+1 passed,\s+1 total/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `npm ci` → `can only install packages when your package.json and package-lock.json … are in sync` | bu repoda lock fayl sinxron emas — `npm install` |
  | `No tests found` (fayl yozilgandan keyin) | fayl `src/`dan tashqarida yoki nomi `.test.ts` — 4-ekran |
  | `Cannot find module './orders' from 'order.spec.ts'` | import'dagi nom fayl nomiga mos emas yoki fayl boshqa papkada — ikkalasi `src/` ichida, yonma-yon |
  | `FAIL` · `Expected: 20000` | `order.ts`dagi hisobni tekshiring — 8-ekran |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `jest1-out/01`, `02`, `03`, `07`, `08`, `18-import-xato.txt`.

---

## 8 · FAIL'ni o'qish: kod buzildi  ← `Lesson`
- Kicker: `3-bosqich · buzamiz` · Sarlavha: **`*` o'rniga `+` — `Expected: 20000`, `Received: 10002`**
- Sahna: `order.ts` (2-satr: `*` chizilgan, `+` qizil) → terminal FAIL (haqiqiy), qismlar navbat bilan yoritiladi → tuzatish (yashil) → PASS.
  ```
  FAIL src/order.spec.ts
    ● orderTotal › 2 kitob narxini hisoblaydi

      expect(received).toBe(expected) // Object.is equality

      Expected: 20000
      Received: 10002

        4 |   it('2 kitob narxini hisoblaydi', () => {
        5 |     const result = orderTotal(10000, 2);
      > 6 |     expect(result).toBe(20000);
          |                    ^
      at Object.<anonymous> (order.spec.ts:6:20)

  Tests:       1 failed, 1 total
  ```
1. **O'quvchi darsidagi tajriba: ko'paytirish o'rniga qo'shish — test buni tutadimi?**
   Ovoz: «O'quvchi darsidagi tajribani qilamiz: funksiyada ko'paytirish o'rniga xato bilan qo'shish yozildi. Kod ishlaydi, xato bermaydi, lekin natija noto'g'ri. npm test buni tutadimi?»
2. **`FAIL` va `●` satri: qaysi fayl, qaysi guruh va qaysi holat yiqildi**
   Ovoz: «Test buni tutdi: qizil FAIL chiqdi. Undan pastda nuqta bilan boshlangan satr bor: orderTotal, strelka, ikki kitob narxini hisoblaydi. U qaysi guruh va qaysi holat yiqilganini aytadi. Nomlar tushunarli bo'lsa, faylni ochmasdan ham nima buzilganini bilasiz.»
3. **`Expected` — etalon, `Received` — funksiya qaytargani: 20000 kutildi, 10002 keldi**
   Ovoz: «Endi eng muhim ikki satr. Expected, ya'ni kutilgan qiymat yigirma ming: bu siz yozgan etalon. Received, ya'ni olingan qiymat o'n ming ikki: buni funksiya qaytardi, chunki o'n mingga ikki qo'shildi. Farqni ko'rib, xato qayerdaligini taxmin qilasiz.»
4. **`>` belgisi va `order.spec.ts:6:20` — testdagi qaysi satr yiqilganini ko'rsatadi**
   Ovoz: «Pastda test faylining bo'lagi ko'rinadi, strelka oltinchi satrni, ya'ni expect'ni ko'rsatadi. Eng oxirida fayl, satr va ustun yozilgan: order spec ts, olti, yigirma. Diqqat: bu test yiqilgan joy, xato esa funksiyada, order ts'da. Funksiyada yana ko'paytirishni yozamiz va test yashil bo'ladi.»
5. **Xulosa: FAIL o'qish tartibi — `●` satr, `Expected`/`Received`, keyin funksiyaning o'zi**
   Ovoz: «Xulosa: FAIL'ni shu tartibda o'qing. Avval nuqtali satrdan qaysi holat yiqilganini o'qing. Keyin expected va received'dan nima kutilgani va nima kelganini ko'ring. Oxirida funksiyani oching. Sinfda o'quvchiga javobni aytmang, shu uch qadamni birga o'qing.»
- Manba: `jest1-out/04-fail-kod-buzildi.txt`; tuzatilgan holat — `03-pass.txt`.

## 9 · Noto'g'ri etalon: kod to'g'ri, test qizil  ← `Lesson`
- Kicker: `3-bosqich · buzamiz` · Sarlavha: **`toBe(10002)` — `Expected: 10002`, `Received: 20000`: xato testning o'zida**
- Sahna: `order.spec.ts` (etalon `10002` qizil) → terminal FAIL → tuzatish `20000`.
1. **Endi aksincha: funksiya to'g'ri, lekin etalon xato yozildi — 10002**
   Ovoz: «Endi aksincha: funksiya to'g'ri, unda ko'paytirish turibdi. Lekin testda etalon xato yozildi: o'n ming ikki. Bu o'quvchi darsidagi burilish: robot etalonga ishonadi.»
2. **FAIL: `Expected: 10002`, `Received: 20000` — o'rinlari 8-ekrandagiga teskari**
   Ovoz: «Natija yana qizil. Lekin qarang: expected o'n ming ikki, received yigirma ming. Bu sakkizinchi ekrandagiga teskari. Funksiya to'g'ri hisobladi, test noto'g'ri narsani kutdi.»
   ```
   Expected: 10002
   Received: 20000
   ```
3. **Qizil test har doim kod xato degani emas: avval etalonni qo'lda tekshiring**
   Ovoz: «Demak qizil test har doim kod xato degani emas. Avval etalonni qo'lda hisoblang: o'n ming ko'paytirish ikki, yigirma ming. Etalon xato bo'lsa, testni tuzatasiz, kodni emas. Aks holda o'quvchi to'g'ri kodni buzib qo'yadi.»
4. **Xulosa: FAIL'da — kim xato: funksiyami yoki etalonmi? Etalonni qo'lda hisoblang**
   Ovoz: «Xulosa: FAIL chiqqanda birinchi savol: kim xato, funksiyami yoki etalonmi. Etalonni qo'lda hisoblang. Etalon to'g'ri bo'lsa, funksiyani tuzating. Noto'g'ri bo'lsa, testni tuzating.»
- Manba: `jest1-out/06-notogri-etalon.txt`.

## 10 · Yolg'on PASS: `expect` yo'q  ← `Lesson`
- Kicker: `3-bosqich · buzamiz` · Sarlavha: **`console.log` bor, `expect` yo'q — test hech narsani tekshirmay yashil bo'ldi**
- Sahna: `order.spec.ts` (6-satr: `console.log(result)`, qizil ramka) → terminal: `console.log 20000` va **PASS**.
1. **Eng xavfli test — `expect`siz: natija chiqariladi, lekin solishtirilmaydi**
   Ovoz: «Endi eng xavfli holat. Testda expect o'rniga console log yozildi: natija ekranga chiqadi, lekin hech narsa bilan solishtirilmaydi. AI ham, o'quvchi ham buni ko'p qiladi.»
   ```ts
   it('2 kitob narxini hisoblaydi', () => {
     const result = orderTotal(10000, 2);
     console.log(result);
   });
   ```
2. **Natija: `console.log 20000` va yashil PASS — test hech narsani tekshirmadi**
   Ovoz: «Natijada terminalga console log orqali yigirma ming chiqdi va yashil PASS turibdi. Ikki kitob narxini hisoblaydi degan holat ham tasdiq belgisi bilan. Lekin bu test hech narsani tekshirmadi. Funksiya bir million qaytarsa ham yashil bo'lardi.»
   ```
     console.log
       20000
   PASS src/order.spec.ts
     orderTotal
       ✓ 2 kitob narxini hisoblaydi (14 ms)
   ```
3. **Jest qoidasi: `it` ichida xato chiqmasa — holat o'tdi; tekshiruvni faqat `expect` qiladi**
   Ovoz: «Nega yashil? Jest uchun qoida oddiy: it ichida xato chiqmasa, holat o'tdi. Xato chiqaradigan narsa faqat expect: natija etalonga teng bo'lmasa, u FAIL beradi. Expect yo'q bo'lsa, yiqilish ham yo'q.»
4. **Xulosa: har `it`da kamida bitta `expect` — aks holda PASS yolg'on**
   Ovoz: «Xulosa: har it ichida kamida bitta expect bo'lishi shart. Sinfda yashil natijaga ishonishdan oldin it ichiga qarang: expect bormi? O'quvchi darsida buni yolg'on test deyishadi.»
- Manba: `jest1-out/05-expect-yoq.txt`.

## 11 · Tekshiruv 2 — qaysi satr testni yolg'on qiladi  ← `LineCheck`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4 — qaysi satr xato?` · Sarlavha: **Bu test doim yashil — hech narsani tekshirmaydi**
- Shart (`task`): «Qoida: test natijani etalon bilan solishtirishi kerak — `expect(…).toBe(…)`. Bu testda solishtirish yo'q, u doim PASS beradi. **Tekshiruv o'rnida turgan satrni bosing.**»
- Ovoz (`q`): «Yolg'on testni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Qoidani eslang: test natijani etalon bilan solishtirishi kerak. Bu testda solishtirish yo'q, u doim yashil. Tekshiruv o'rnida turgan satrni bosing.»
- Fayl: `src/order.spec.ts` (Explorer faol):
  ```ts
  1  import { orderTotal } from './order';
  2
  3  describe('orderTotal', () => {
  4    it('2 kitob narxini hisoblaydi', () => {
  5      const result = orderTotal(10000, 2);
  6      console.log(result);                 ← xato satr
  7    });
  8  });
  ```
- Tuzatilgan (`fixed`): 6-satr chizilgan, yashil `expect(result).toBe(20000);`; `fixedExtra`: terminal PASS (haqiqiy).
- To'g'ri (ovoz, `ok`): «To'g'ri. Oltinchi satr console log: natijani faqat chiqaradi. Uning o'rnida expect, result, to be yigirma ming bo'lishi kerak. Ekranda tuzatilgan holat: endi funksiya buzilsa, test qizil bo'ladi. Demak, har it ichida natijani etalon bilan solishtiradigan expect bo'lishi shart.»
- Qisqa (`okShort`): «6-satr: `console.log` faqat chiqaradi. O'rniga `expect(result).toBe(20000)`.»
- Maslahat (`hint`): «Import, describe va funksiyani chaqirish — kerakli qismlar. Natija bilan nima qilinayotganiga qarang: solishtiriladimi yoki faqat chiqariladimi?»
- Manba: `jest1-out/05-expect-yoq.txt`, `03-pass.txt`.

## 12 · Amaliyot 2 — uch xil buzish  ← `Practice`
- Kicker: `Amaliyot 2 / 4` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **Kodni, etalonni va `expect`ni buzing — natijani o'qing** · `tableAt: 3`
1. **Endi siz: o'z testingizni uch xil buzasiz va har natijani o'qiysiz**
   Ovoz: «Endi o'z testingizni uch xil buzasiz. Bunga o'n daqiqa ketadi. Har buzishdan keyin npm test va natijani ovoz chiqarib o'qing, sinfda xuddi shunday qilasiz.»
2. **1–2-qadam: funksiyada `+` — FAIL; tuzatib, etalonni 10002 qiling — FAIL**
   Ovoz: «Birinchi qadamda order ts'da ko'paytirish o'rniga qo'shish yozing va FAIL'ni ko'ring. Received qiymatini eslab qoling. Ikkinchisida funksiyani tuzatib, testdagi etalonni o'n ming ikki qiling: yana FAIL chiqadi, lekin qiymatlar teskari bo'ladi.»
3. **3–4-qadam: `expect` o'rniga `console.log` — PASS; tiklang; isbot — 1-qadamdagi `Received`**
   Ovoz: «Uchinchi qadamda expect o'rniga console log yozing: test yashil bo'ladi, lekin yolg'on. To'rtinchisida testni asl holiga qaytaring. Isbot maydoniga birinchi qadamdagi received qiymatini yozing.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz FAIL'ning ikki xilini va yolg'on PASS'ni o'z ko'zingiz bilan ko'rdingiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Kodni buzish | `order.ts`: `price + quantity` · `npm test` | `FAIL` · `Expected: 20000` · `Received: …` |
  | 2 | Etalonni buzish | `order.ts` tiklang · `order.spec.ts`: `toBe(10002)` · `npm test` | `FAIL` · `Expected: 10002` · `Received: 20000` |
  | 3 | `expect`siz | `expect(…)` o'rniga `console.log(result)` · `npm test` | `console.log 20000` · `PASS` |
  | 4 | Tiklash | `expect(result).toBe(20000);` · `npm test` | `PASS` |
- Isbot: «1-qadamdagi `Received` qiymati» · placeholder: «Received yonidagi sonni yozing» · KOD: `/^\s*10\s?002\s*$/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 1-qadamda `PASS` | fayl saqlanmagan — `Ctrl+S`, qayta `npm test` |
  | `error TS1005: ')' expected.` | qavs tushib qolgan — xabardagi satr va `~` belgisi joyni ko'rsatadi |
  | 3-qadamda `FAIL` | `expect` hali qolgan — u satrni butunlay almashtiring |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `jest1-out/03…06`, `19-sintaksis-xato.txt`.

---

## 13 · Chegara: `deliveryFee` va 100 000  ← `Lesson`
- Kicker: `4-bosqich · chegara` · Sarlavha: **Aynan 100 000 — `>=` va `>` farqi faqat chegarada ko'rinadi**
- Sahna: VS Code: `src/delivery.ts` + `src/delivery.spec.ts` (3 `it`); terminal: `4 passed` → `>` qilingach FAIL (aynan 100 000).
1. **O'quvchi uyga vazifasi: 100 000 dan — yetkazish bepul, kam bo'lsa — 15 000**
   Ovoz: «Chegara shartini qayerda ko'ramiz? O'quvchining uyga vazifasida, delivery fee funksiyasida. Buyurtma yuz ming va undan ko'p bo'lsa, yetkazish bepul, kam bo'lsa o'n besh ming. Funksiya bir satrdan iborat, unga uchta test yozamiz: yuz ellik ming, aynan yuz ming va to'qson to'qqiz ming uchun.»
   ```ts
   export function deliveryFee(total: number): number {
     return total >= 100000 ? 0 : 15000;
   }
   ```
2. **Uch test va jami 4 o'tdi; ikki fayl bo'lsa nomlar faqat `--verbose` bilan chiqadi**
   Ovoz: «npm test qilamiz: ikki fayl, order va delivery, to'rtta test, hammasi yashil. Diqqat: fayl ikkita bo'lsa, Jest test nomlarini ko'rsatmaydi, faqat PASS va fayl. Nomlarni ko'rish uchun npx jest minus minus verbose.»
   ```
   Test Suites: 2 passed, 2 total
   Tests:       4 passed, 4 total
   ```
3. **`>=` o'rniga `>` — faqat «aynan 100 000» qizil: `Expected: 0`, `Received: 15000`**
   Ovoz: «Endi kichik xato qilamiz: katta yoki teng o'rniga faqat katta yozamiz. Yuz ellik ming ham, to'qson to'qqiz ming ham o'zgarmadi, ular yashil. Faqat aynan yuz ming qizil bo'ldi: nol kutilgan edi, o'n besh ming keldi. Shu test bo'lmaganda, bu xatoni hech kim sezmasdi.»
   ```
   ● deliveryFee › aynan 100 000 — bepul
     Expected: 0
     Received: 15000
   Tests:       1 failed, 3 passed, 4 total
   ```
4. **Xulosa: shartli funksiyada uch test — chegaradan yuqori, aynan chegara, chegaradan past**
   Ovoz: «Xulosa: shart bor joyda kamida uchta test. Biri chegaradan yuqori, biri aynan chegarada, biri chegaradan past. Aynan chegara eng muhimi, xato ko'pincha shu yerda yashiringan. O'quvchi vazifasini tekshirganda shu uchta test bormi, shunga qarang.»
- Manba: `jest1-out/09-uyga-vazifa-pass.txt`, `10-chegara-xato.txt`, `16-verbose.txt` (`--verbose` — nomlar bilan); o'quvchi uyga vazifasi (`HW_V2` 6-5).

## 14 · AI yozgan testni tekshirish  ← `Lesson`
- Kicker: `4-bosqich · chegara` · Sarlavha: **AI'ning testiga ikki savol: `expect` bormi? Etalon to'g'rimi?**
- Sahna: o'quvchi darsidagi 5 ta AI testi kartochkasi (Screen15): har biriga ikki belgi (expect · etalon) — 2 tasi yashil, 3 tasi qizil.
  | AI testi | `expect` bormi | etalon | Hukm |
  |---|---|---|---|
  | `expect(orderTotal(10000, 2)).toBe(20000)` | ha | 10000 × 2 = 20000 ✓ | haqiqiy |
  | `const r = orderTotal(10000, 2);` (va boshqa hech narsa) | yo'q | — | yolg'on — doim yashil |
  | `expect(orderTotal(10000, 2)).toBe(10002)` | ha | ✗ | noto'g'ri etalon |
  | `console.log(orderTotal(5000, 3))` | yo'q | — | yolg'on |
  | `expect(orderTotal(5000, 3)).toBe(15000)` | ha | 5000 × 3 = 15000 ✓ | haqiqiy |
1. **O'quvchi darsida AI beshta test yozadi — ulardan faqat ikkitasi haqiqiy**
   Ovoz: «O'quvchi darsida AI orderTotal uchun beshta test yozadi. O'quvchi ulardan haqiqiylarini tanlaydi. Bugun ko'rgan ikki xatoni endi AI testlarida qidiramiz.»
2. **Birinchi savol: `expect` bormi? Yo'q bo'lsa — test doim yashil**
   Ovoz: «Birinchi savol: testda expect bormi? Ikkita testda u yo'q: birida funksiya faqat chaqiriladi, birida console log turibdi. Ikkalasi ham doim yashil bo'ladi, o'ninchi ekrandagidek.»
3. **Ikkinchi savol: etalon to'g'rimi? Qo'lda hisoblang — 10002 noto'g'ri**
   Ovoz: «Ikkinchi savol: etalon to'g'rimi? Qo'lda hisoblaymiz: o'n ming ko'paytirish ikki yigirma ming bo'ladi, besh ming ko'paytirish uch esa o'n besh ming. O'n ming ikki degan etalon noto'g'ri, bu test to'g'ri kodni qizil qiladi.»
4. **Xulosa: AI test yozadi — o'quvchi har biriga ikki savol beradi**
   Ovoz: «Xulosa: AI test yozishi mumkin, lekin har testga ikki savol beriladi: expect bormi va etalon qo'lda hisoblaganda to'g'rimi. Sinfda bu qoidani doskaga yozing, o'quvchi uni har AI testida ishlatsin.»
- Manba: o'quvchi darsi `JestUnitTestLesson.jsx` Screen15 (5 test, 2 haqiqiy); xatti-harakat — `jest1-out/05`, `06`.

## 15 · Tekshiruv 3 — kim xato: kod yoki etalon  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **`FAIL` · `Expected: 10002` · `Received: 20000`. `orderTotal(10000, 2)`. Kim xato?**
- Ovoz: «FAIL o'qishni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi testi qizil: expected o'n ming ikki, received yigirma ming. Funksiyaga o'n ming va ikki berilgan. Kim xato? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 Funksiya — `+` yozilgan · 2 Etalon — 10000 × 2 = 20000, test 10002 kutgan · 3 Jest — versiya eski · 4 Hech kim — qayta `npm test`
- To'g'ri (ovoz, `ok`): «To'g'ri, xato etalonda. Funksiya yigirma ming qaytardi, bu to'g'ri: o'n ming ko'paytirish ikki. Test o'n ming ikki kutgan, etalon xato. Testni tuzatasiz, kodga tegmaysiz. Demak, FAIL chiqqanda avval etalonni qo'lda hisoblang, keyin kodga qarang.» · qisqa: «`Received: 20000` — to'g'ri hisob. `Expected: 10002` — etalon xato. Testni tuzating.»
- Xato izohlari: 1 — «`+` bo'lsa `Received: 10002` bo'lardi — bu yerda Received 20000.» · 3 — «Jest faqat solishtiradi; versiya natijani o'zgartirmaydi.» · 4 — «Kod va test o'zgarmasa, natija ham o'zgarmaydi.»
- Maslahat: «`Received` — funksiya qaytargan qiymat. Uni qo'lda hisoblaganingiz bilan solishtiring.»
- Manba: `jest1-out/06-notogri-etalon.txt`, `04-fail-kod-buzildi.txt`.

## 16 · Amaliyot 3 — `deliveryFee`  ← `Practice`
- Kicker: `Amaliyot 3 / 4` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **Uch test va chegara xatosi** · `tableAt: 3`
1. **Endi siz: o'quvchi uyga vazifasini o'zingiz qilasiz — uch test va bitta chegara xatosi**
   Ovoz: «Endi o'quvchi uyga vazifasini o'zingiz qilasiz: delivery fee funksiyasiga uchta test yozasiz, keyin chegarani ataylab buzasiz. Bunga o'n daqiqa ketadi.»
2. **1–2-qadam: `delivery.ts` va `delivery.spec.ts` — uch `it`, `npm test` — 4 passed**
   Ovoz: «Birinchi qadamda src papkasida delivery ts faylini yozasiz. Ikkinchisida delivery spec ts faylida uchta it yozasiz: yuz ellik ming, aynan yuz ming va to'qson to'qqiz ming uchun. npm test to'rtta yashil test ko'rsatadi.»
3. **3–4-qadam: `>=` → `>`, `npm test`; isbot — qizil testning nomi**
   Ovoz: «Uchinchi qadamda katta yoki teng o'rniga faqat katta yozib, npm test qilasiz. To'rtinchisida qaysi test qizil bo'lganini nuqtali satrdan o'qib, isbot maydoniga yozasiz. Keyin funksiyani tiklang.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, chegaradagi xatoni faqat aynan chegara uchun yozilgan test tutishini o'zingiz ko'rdingiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Funksiya | `src/delivery.ts` — «Kodni ochish» | fayl saqlandi |
  | 2 | Testlar | `src/delivery.spec.ts` — 3 `it` · `npm test` | `Tests: 4 passed, 4 total` |
  | 3 | Chegarani buzish | `total >= 100000` → `total > 100000` · `npm test` | `1 failed, 3 passed` |
  | 4 | O'qish va tiklash | `●` satrni o'qing · `>=` qaytaring · `npm test` | `4 passed` |
- Isbot: «Qizil testning nomi (`●` satridan)» · placeholder: «qizil it nomini yozing» · KOD: `/100\s?000/` va `/bepul/i`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 3-qadamda hammasi yashil | aynan 100 000 testi yo'q — vazifadagi uchinchi holatni qo'shing |
  | 3-qadamda ikki test qizil | 99 000 testida etalon xato (15 000 bo'lishi kerak) |
  | `Tests: 3 passed` | `order.spec.ts` o'chirilgan — mayli, uchtasi ham yetarli |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `jest1-out/09`, `10`.

---

## 17 · Sinfdagi tuzoqlar: joy, nom, `npm ci`  ← `Lesson`
- Kicker: `5-bosqich · tuzoqlar` · Sarlavha: **Uch tuzoq: `src/`dan tashqari, `.test.ts`, `npm ci`**
- Sahna: uch karta (holat · haqiqiy xabar · yechim), segment bilan yonadi; Explorer'da fayl joyi ko'rsatiladi.
1. **Sinfda test yozilgan, lekin ishlamaydi — sabab ko'pincha koddan tashqarida**
   Ovoz: «Sinfda eng ko'p vaqt test kodiga emas, sozlashga ketadi. Uchta tuzoqni oldindan bilsangiz, ularni bir daqiqada tuzatasiz.»
2. **Fayl loyiha ildizida yoki nomi `.test.ts` — ikkalasida `No tests found`**
   Ovoz: «Birinchi va ikkinchi tuzoq fayl joyi va nomida. Sinab ko'rdik: test fayli loyiha ildizida tursa, Jest no tests found deydi. Nomi order test ts bo'lsa ham shu javob chiqadi. Xabardagi test regex satri shuni aytadi: nol mos fayl.»
   ```
   No tests found, exiting with code 1
     testRegex: .*\.spec\.ts$ - 0 matches
   ```
3. **`npm ci` bu repoda yiqiladi — lock fayl sinxron emas; `npm install` ishlaydi**
   Ovoz: «Uchinchi tuzoq: ba'zi o'quvchi npm ci deb yozadi. Bu repoda u yiqiladi: package json va lock fayl sinxron emas. Npm install ishlaydi. Bu repo muallifining kamchiligi, o'quvchining xatosi emas.»
   ```
   npm error `npm ci` can only install packages when your package.json and package-lock.json … are in sync.
   npm error Missing: @nestjs/jwt@11.0.2 from lock file
   ```
4. **Xulosa: `No tests found` — joy va nom; `npm ci` xatosi — `npm install`**
   Ovoz: «Xulosa: no tests found ko'rsangiz, fayl joyi va nomini tekshiring, src ichida va spec ts. Npm ci yiqilsa, npm install qiling. Ikkalasi ham kodda emas, sozlamada.»
- Manba: `jest1-out/07`, `08`, `01-clone-install.txt` (`npm ci` xatosi).

## 18 · Nest bo'lmagan loyiha: to'rt qadamli zanjir  ← `Lesson`
- Kicker: `5-bosqich · tuzoqlar` · Sarlavha: **Bo'sh loyihada darsdagi ikki buyruq yetmaydi: to'rt xato ketma-ket**
- Sahna: Explorer `bosh/` (`order.ts`, `order.spec.ts`, `package.json`); zinapoya: 4 qadam — har biri xabar (qizil) + keyingi buyruq; oxirida PASS (yashil).
1. **O'quvchi Nest emas, oddiy loyihada sinasa — darsdagi buyruqlar yetmaydi**
   Ovoz: «Ba'zi o'quvchi testni Nest emas, oddiy bo'sh loyihada sinaydi. O'quvchi darsida ikki qadam bor: npm i minus D jest ts jest va test: jest. Sinab ko'rdik: bo'sh loyihada bu yetmaydi, to'rtta xato ketma-ket chiqadi.»
2. **1-xato: `Must use import to load ES Module` — Jest TypeScript'ni o'qishni bilmaydi**
   Ovoz: «Birinchi xato: must use import to load ES module. Jest TypeScript faylni o'qishni bilmaydi, unga sozlama kerak. Yechim: npx ts jest config init, u jest config faylini yaratadi.»
3. **2-xato: `Cannot find name 'describe'` — `@types/jest` kerak; 3-xato: TypeScript 6 yoki 7**
   Ovoz: «Ikkinchi xato: cannot find name describe, chunki Jest turlari yo'q. Yechim types jest va typescript paketlarini o'rnatish. Lekin shunda uchinchi xato chiqadi: eng yangi TypeScript o'rnatiladi. Alohida o'rnatilsa yettinchi, boshqa paketlar bilan birga oltinchi. Ikkalasida ham ts jest ishlamaydi.»
   ```
   TS2593: Cannot find name 'describe'. … Try `npm i --save-dev @types/jest`
   The TypeScript compiler "typescript" (version 7.0.2) does not expose the JavaScript compiler API required by ts-jest.
   ```
4. **Yechim: `typescript@5` — bo'sh loyiha ham yashil: `PASS ./order.spec.ts`**
   Ovoz: «Yechim: typescript beshinchi versiyasini o'rnatish. Shundan keyin bo'sh loyiha ham yashil. Jami uchta qo'shimcha buyruq kerak bo'ldi: config init, types jest va typescript besh. Nest loyihasida bularning hammasi tayyor.»
   ```
   $ npm i -D typescript@5        → typescript 5.9.3
   PASS ./order.spec.ts
     ✓ 2 kitob narxini hisoblaydi (2 ms)
   ```
5. **Xulosa: test — Nest loyihasida; bo'sh loyihada — `config:init`, `@types/jest`, `typescript@5`**
   Ovoz: «Xulosa: sinfda testni o'quvchi reposida yozdiring, u yerda hammasi tayyor. O'quvchi baribir bo'sh loyihada sinasa, uchta buyruq: ts jest config init, types jest va typescript besh. Oltinchi va yettinchi TypeScript bilan ts jest hozircha ishlamaydi.»
- Manba: `jest1-out/12…15` (01.11.2026: `npm i -D typescript` → 7.0.2), `20-bosh2-npm-ci-va-js.txt` (to'rt paket bir buyruqda → TypeScript 6.0.3 → yana `TS2593`).

## 19 · Tekshiruv 4 — TypeScript 7  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **Bo'sh loyiha: `The TypeScript compiler "typescript" (version 7.0.2) does not expose … required by ts-jest`. Nima qilasiz?**
- Ovoz: «Zanjirni ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. O'quvchi bo'sh loyihada TypeScript o'rnatdi va xabar oldi: TypeScript yettinchi versiya ts jest uchun kerakli qismni bermaydi. Nima qilasiz? Variantni tanlang.»
- Variantlar (to'g'risi — 4): 1 `ts-jest`ni o'chirish · 2 `npm ci` · 3 Test faylini `.js` qilish · 4 `npm i -D typescript@5`
- To'g'ri (ovoz, `ok`): «To'g'ri. Ts jest hozircha TypeScript beshinchi versiyasi bilan ishlaydi. Typescript besh o'rnatilgach, sinab ko'rdik, test yashil. Nest reposida TypeScript besh allaqachon turibdi, shuning uchun u yerda bu xato chiqmaydi. Demak, ts jest bilan TypeScript beshinchi versiyasi ishlatiladi.» · qisqa: «`typescript@5` → `PASS`. Nest reposida TypeScript 5.9 allaqachon bor.»
- Xato izohlari: 1 — «`ts-jest`siz Jest TypeScript faylni o'qiy olmaydi — birinchi xatoga qaytasiz.» · 2 — «`npm ci` lock fayldagi versiyani qayta o'rnatadi, yangisini tanlamaydi — sinab ko'rdik, versiya o'zgarmadi.» · 3 — «`.js` nomida Jest TypeScript'ni o'qiy olmaydi — sinab ko'rdik: `Jest encountered an unexpected token`.»
- Maslahat: «Xabar versiya haqida: qaysi versiya ts-jest bilan ishlaydi?»
- Manba: `jest1-out/14`, `15`, `20-bosh2-npm-ci-va-js.txt` (`npm ci` — 6.0.3 o'zgarmadi; `.js` — `unexpected token`).

## 20 · Amaliyot 4 — `No tests found`ni o'zingiz chiqaring  ← `Practice`
- Kicker: `Amaliyot 4 / 4` · Eyebrow: `Hozir o'zingizda · 5 daqiqa` · Sarlavha: **Fayl joyi va nomi — ikki tuzoqni qo'l bilan ko'ring** · `tableAt: 3`
1. **Endi siz: sinfdagi eng ko'p savolni o'zingiz chiqarasiz — `No tests found`**
   Ovoz: «Oxirgi amaliyot qisqa, besh daqiqalik. Sinfdagi eng ko'p uchraydigan xabarni, no tests found'ni, o'zingiz chiqarasiz.»
2. **1–2-qadam: `order.spec.ts`ni loyiha ildiziga ko'chiring — `No tests found`**
   Ovoz: «Birinchi qadamda order spec ts'ni src'dan loyiha ildiziga ko'chirib, importni moslang. Ikkinchisida npm test qiling: no tests found chiqadi. Xabardagi testRegex satrini o'qing.»
3. **3–4-qadam: `src/`ga qaytarib, nomini `.test.ts` qiling; isbot — xabarning birinchi satri**
   Ovoz: «Uchinchi qadamda faylni src'ga qaytaring, lekin nomini order test ts qiling: yana no tests found chiqadi. To'rtinchisida nomini spec ts'ga qaytaring, test yashil bo'ladi. Isbot maydoniga xabarning birinchi satrini nusxalang.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, sinfda no tests found chiqsa, siz sababini fayl joyi va nomidan darhol topasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Ildizga | `order.spec.ts` → loyiha ildizi · import `./src/order` | fayl ko'chdi |
  | 2 | Sinash | `npm test` | `No tests found, exiting with code 1` |
  | 3 | Nom | `src/order.test.ts` · `npm test` | `No tests found` |
  | 4 | Tiklash | `src/order.spec.ts` · `npm test` | `PASS` |
- Isbot: «Xabarning birinchi satri» · placeholder: «npm test natijasining birinchi qatorini qo'ying» · KOD: `/No tests found/i`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 2-qadamda `PASS` | `src/` da eski nusxa qolgan (ikkita fayl) — bittasini o'chiring |
  | `delivery.spec.ts` ham yurdi | `PASS src/delivery.spec.ts` — u joyida, bu normal; `order` yo'qligiga qarang |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `jest1-out/07`, `08`.

---

## 21 · m4b-01 xaritasi  ← `Lesson`
- Kicker: `6-bosqich · o'quvchi darsini o'tish` · Eyebrow: `m4b-01 · «Unit-test: Jest»` · Sarlavha: **m4b-01: Jestbot, varaqa va etalon — amaliyot o'quvchi loyihasida**
- Sahna: 5 blok kartasi + «Siz qo'shasiz».
  | Blok | O'quvchi ekranlari | Siz qo'shasiz |
  |---|---|---|
  | 1 Kirish | s0 qo'lda vs test · s1 reja (4 qadam) | — |
  | 2 Tushuncha | s2 funksiya — mashina · s3 Jestbot poygasi (5 hisob qo'lda vs bitta buyruq) · s4 test | Jest reposida tayyor (3-ekran) |
  | 3 Yozish | s5 o'rnatish (`npm i -D jest ts-jest`) · s6 test fayli (4 qism) · s7 expect · s8 test · s9 varaqa (yolg'on PASS) · s10 `npm test` · s11 test | joy va nom (4, 17-ekran) · haqiqiy PASS chiqishi (6-ekran) |
  | 4 Buzish | s12 AAA · s13 FAIL (`*` → `+`) · s14 test · s15 AI yolg'on testlari | FAIL o'qish tartibi (8-ekran) · kim xato (9-ekran) |
  | 5 Yakun | s16 etalon kartochkasi + noto'g'ri etalon · amaliyot o'z loyihasida · kartochkalar · yakun | chegara (13-ekran) · uyga vazifa `deliveryFee` |
1. **m4b-01 — 21 ekran: ko'p qismida o'quvchi Jestbot bilan o'ynaydi, terminalni amaliyotda ko'radi**
   Ovoz: «Endi o'quvchi darsini ko'ramiz: m4b-01, unda yigirma bir ekran bor. Ko'p qismida o'quvchi Jestbot degan robot bilan ishlaydi: varaqa yig'adi, etalon qo'yadi, kodni buzadi. Haqiqiy terminalni u faqat amaliyotda, o'z loyihasida ko'radi.»
2. **Yozish bloki: o'quvchi darsi haqiqiy chiqishni ko'rsatmaydi — siz 6-ekrandagini ko'rsatasiz**
   Ovoz: «Yozish blokida o'quvchi darsi natijani kartochka bilan ko'rsatadi, haqiqiy terminal chiqishini emas. Siz proyektorda oltinchi ekrandagi haqiqiy PASS'ni ko'rsating: fayl, guruh, holat va jami.»
3. **Buzish bloki: FAIL o'qish tartibi va «kim xato» savoli — ikkalasi sizdan**
   Ovoz: «Buzish blokida o'quvchi expected va received'ni ko'radi. Siz o'qish tartibini o'rgatasiz: avval nuqtali satr, keyin expected va received, oxirida funksiya. Va har FAIL'da savol: kim xato, kodmi yoki etalonmi.»
4. **Xulosa: amaliyot oldidan — repo `npm install` bilan, test `src/` ichida, nomi `.spec.ts`**
   Ovoz: «Xulosa: amaliyot oldidan uch narsani tekshiring. Repo npm install bilan o'rnatilgan, test fayli src ichida, nomi spec ts bilan tugaydi. Vaqt, taklif: to'qson daqiqaning yigirma beshi amaliyotga, chunki sozlashda vaqt ketadi.»
- Manba: `src/4b-Modull/JestUnitTestLesson.jsx` — `SCREEN_META` (21), ekran matnlari, amaliyot ro'yxati, `HW_V2`.

## 22 · O'quvchi darsidagi so'zlar: Jestbot, varaqa, etalon kartochkasi  ← `Lesson`
- Kicker: `6-bosqich · o'quvchi darsini o'tish` · Sarlavha: **O'quvchi darsidagi so'zlar: Jestbot, robot papkasi, sinov varaqasi, etalon kartochkasi**
- Lug'at (o'quvchi darsidan aynan):
  | O'quvchi aytadi | Siz bilasiz |
  |---|---|
  | mashina — kirish → chiqish | funksiya |
  | Jestbot — sinovchi robot | Jest (`npm test`) |
  | robot papkasi — qaysi mashina sinaladi | `describe` |
  | sinov varaqasi — nima tekshiriladi | `it` |
  | etalon kartochkasi — qanday chiqish kutiladi | `expect(…).toBe(…)` |
  | yolg'on test | `expect`siz yoki noto'g'ri etalon |
  | Tayyorlash → Chaqirish → Tekshirish | AAA |
1. **O'quvchi darsi testni robot misolida tushuntiradi — siz har so'zni atamasi bilan birga aytasiz**
   Ovoz: «Endi o'quvchi darsida qanday so'zlar ishlatilishini ko'ramiz. AI Startup kursidagi o'quvchi darsi testni robot misolida tushuntiradi, robotning ismi Jestbot. Siz har so'zni ham, uning atamasini ham bilasiz va sinfda ikkalasini birga aytasiz.»
2. **Papka — `describe`, varaqa — `it`, etalon kartochkasi — `expect`**
   Ovoz: «Robot papkasi bu describe: u qaysi mashina sinalayotganini aytadi. Sinov varaqasi bu it: u nima tekshirilishini aytadi. Etalon kartochkasi bu expect: u qanday natija kutilishini aytadi. Mashina esa funksiyaning o'zi.»
3. **Yolg'on test va uch qadam — o'quvchi bularni so'z bilan ham, kodda ham taniydi**
   Ovoz: «Yolg'on test deganda etalon kartochkasi yo'q yoki noto'g'ri test tushuniladi. Uch qadam esa tayyorlash, chaqirish va tekshirish. O'quvchi bularni kodda ham tanishi kerak, shuning uchun har so'zni ekrandagi kod satri bilan ko'rsating.»
4. **Xulosa: «etalon kartochkasi, ya'ni `expect`» — so'zni kod satri bilan birga ko'rsating**
   Ovoz: «Xulosa: so'zlarni birga ayting, masalan etalon kartochkasi, ya'ni expect, va o'sha satrni ko'rsating. Metafora testni tushuntiradi, lekin terminaldagi so'zlar inglizcha: PASS, FAIL, expected, received.»
- Manba: `JestUnitTestLesson.jsx` Screen2, Screen9 (varaqa), Screen12 (AAA), Screen15–16, kartochkalar.

## 23 · O'quvchi darsidagi `npm i -D jest ts-jest`  ← `Lesson`
- Kicker: `6-bosqich · o'quvchi darsini o'tish` · Sarlavha: **Darsdagi o'rnatish qadami Nest reposida keraksiz, lekin zararsiz**
- Sahna: o'quvchi darsi s5 kartasi («`npm i -D jest ts-jest`», «`"test": "jest"`»); terminal: oldin/keyin versiyalar va `4 passed`.
1. **O'quvchi darsi Jest'ni o'rnatishni buyuradi — Nest reposida u allaqachon bor**
   Ovoz: «O'quvchi darsining beshinchi ekrani Jest'ni o'rnatishni buyuradi: npm i minus D jest ts jest va test: jest. Nest reposida ikkalasi allaqachon bor. O'quvchi «nega o'rnatyapmiz, bor-ku?» desa, javob tayyor bo'lsin.»
2. **Sinab ko'rdik: faqat versiyalar ko'tarildi, testlar yashil — zarari yo'q**
   Ovoz: «Sinab ko'rdik: buyruqdan keyin jest va ts jest kichik versiyaga ko'tarildi, testlar yashil qoldi. Zarari yo'q. Ikkinchi qism, test: jest, package json'da allaqachon shunday yozilgan.»
   ```
   --- oldin   jest 30.4.2 · ts-jest 29.4.11
   $ npm i -D jest ts-jest
   --- keyin   jest 30.5.2 · ts-jest 29.4.15
   Tests:       4 passed, 4 total
   ```
3. **Tavsiya: o'quvchi buyruqni bajarsin, siz «Nest buni oldindan qo'ygan» deb izohlang**
   Ovoz: «Tavsiya: o'quvchi buyruqni bajaraversin, zarar yo'q. Siz bir gap qo'shing: Nest loyihasi Jest'ni oldindan qo'ygan, bu buyruq uni yangilaydi. O'quvchi bo'sh loyihada qilsa, o'n sakkizinchi ekrandagi zanjir.»
4. **Xulosa: Nest reposida — zararsiz; bo'sh loyihada — yetarli emas**
   Ovoz: «Xulosa: darsdagi o'rnatish qadami Nest reposida zararsiz, bo'sh loyihada esa yetarli emas. Shuning uchun sinfda testni o'quvchi reposida yozdiring.»
- Manba: `jest1-out/11-npm-i-jest-nestda.txt`; o'quvchi darsi Screen5 (o'rnatish), amaliyot ro'yxati.

## 24 · Sinfdagi holatlar va o'quvchi savollari  ← `Lesson`
- Kicker: `6-bosqich · sinfda` · Sarlavha: **Olti holat va tayyor javoblar**
- Kartalar:
  | # | Holat | Xabar | Yechim |
  |---|---|---|---|
  | 1 | Test topilmadi | `No tests found` | `src/` ichida, `.spec.ts` |
  | 2 | O'rnatish | `npm ci` … `in sync` | `npm install` |
  | 3 | Yolg'on yashil | `PASS`, lekin `expect` yo'q | har `it`da `expect` |
  | 4 | Qizil, kod to'g'ri | `Expected` noto'g'ri | etalonni qo'lda hisoblash |
  | 5 | Chegara | faqat aynan qiymat qizil | uch test: yuqori · aynan · past |
  | 6 | Bo'sh loyiha | ESM · `describe` · TypeScript 7 | o'quvchi reposida yozish yoki 3 buyruq |
- O'quvchi so'rasa:
  - «Test kodni tuzatadimi?» → yo'q, faqat xabar beradi; tuzatish — sizniki.
  - «Har funksiyaga test kerakmi?» → hisob, shart va pul bor joyga — albatta; oddiy uzatuvchi funksiyaga shart emas.
  - «`toBe` va `===` farqi?» → `toBe` ham shunday solishtiradi (`Object.is`), lekin natijani Jest'ga xabar qiladi: PASS yoki FAIL; `===` faqat `true`/`false`.
  - «Jest faqat Nest uchunmi?» → yo'q, istalgan JavaScript/TypeScript loyihasi; Nest'da tayyor sozlangan.
  - «AI test yozsa bo'ladimi?» → ha, lekin har testga ikki savol: `expect` bormi, etalon to'g'rimi.
1. **Sinfda albatta chiqadigan olti holat — hammasini bugun o'zingiz ko'rdingiz**
   Ovoz: «Endi sinfda albatta chiqadigan oltita holatni ko'ramiz. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman.»
2. **Topilmadi va o'rnatish — joy, nom va `npm install`**
   Ovoz: «Birinchi holat no tests found: fayl joyi va nomini tekshiring. Ikkinchisi: npm ci yiqilsa, npm install qiling.» · 1–2-karta
3. **Yolg'on yashil, qizil to'g'ri kod va chegara — `expect`, etalon, uch test**
   Ovoz: «Uchinchisi: test yashil, lekin ichida expect yo'q. To'rtinchisi: test qizil, lekin kod to'g'ri, bunda etalonni qo'lda hisoblang. Beshinchisi: faqat aynan chegaradagi test qizil, shuning uchun har shartga uchta test yoziladi.» · 3–5-karta
4. **Xulosa: bo'sh loyiha — o'quvchi reposiga qaytaring; avval xabarni birga o'qing**
   Ovoz: «Oltinchisi bo'sh loyihadagi xatolar zanjiri: eng tez yo'l testni o'quvchi reposida yozdirish. Xulosa va usul bitta: javobni darhol aytmang, terminaldagi xabarni o'quvchi bilan birga o'qing. Pastda o'quvchi savollariga tayyor javoblar bor.» · 6-karta + QA
- Manba: `jest1-out/01…15`; `toBe` — `04` (`// Object.is equality`).

## 25 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | O'quvchi reposida Jest test faylini qayerdan qidiradi? | butun loyihadan, istalgan nom · `src/` ichidan, nomi `.spec.ts` · `test/` papkasidan · faqat `package.json` yonidan | 2 | `rootDir: src`, `testRegex: .*\.spec\.ts$`. | 3 |
  | 2 | Testda `expect` yo'q, faqat `console.log(result)`. Natija? | PASS — hech narsa tekshirilmadi · FAIL · `No tests found` · `SyntaxError` | 1 | `it` ichida xato tashlanmasa — o'tdi. | 10 |
  | 3 | `Expected: 20000` · `Received: 10002`. Nima bo'lgan? | Etalon xato · Jest eskirgan · Funksiya noto'g'ri hisobladi (`+`) · Test topilmadi | 3 | Received — funksiya qaytargan; 10000 + 2. | 8 |
  | 4 | `Expected: 10002` · `Received: 20000`, `orderTotal(10000, 2)`. Nima qilasiz? | Funksiyani o'zgartiraman · `npm install` · Testni o'chiraman · Etalonni 20000 ga tuzataman | 4 | Funksiya to'g'ri — etalon xato. | 9 |
  | 5 | `deliveryFee`: `>=` o'rniga `>` yozildi. Qaysi test qizil? | aynan 100 000 · 150 000 · 99 000 · hammasi | 1 | Farq faqat chegarada. | 13 |
  | 6 | O'quvchi `npm ci` qildi — `in sync` xatosi. Nima deysiz? | Jest'ni qayta o'rnating · `npm install` qiling · Repoyni o'chiring · Node'ni yangilang | 2 | Lock fayl sinxron emas — `npm install`. | 17 |
  | 7 | Bo'sh loyiha: TypeScript 7.0.2 — `does not expose … required by ts-jest`. Yechim? | `ts-jest`ni o'chirish · `npm ci` · `npm i -D typescript@5` · faylni `.js` qilish | 3 | ts-jest TypeScript 5 bilan ishlaydi (6 va 7 bilan — yo'q). | 18 |
  | 8 | AI 5 ta test yozdi. Har biriga qaysi ikki savol? | Tezmi va qisqami? · Nomi inglizchami? · Nechta satr? · `expect` bormi va etalon to'g'rimi? | 4 | Yolg'on testning ikki turi. | 14 |
- `passed = ball ≥ 6 && 4 amaliyot isbot bilan`.

## 26 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13.
- Xulosa 6 band:
  1. Unit-test — bitta funksiya, kirish va etalon; Jest o'quvchi reposida tayyor: `src/` ichida, `.spec.ts`.
  2. `describe` — kim, `it` — qaysi holat, `expect(…).toBe(…)` — nima kutiladi; yagona tekshiruvchi — `expect`.
  3. PASS: fayl · guruh · `✓` holat · `Tests:` jami.
  4. FAIL: `●` satr → `Expected` / `Received` → funksiya; kim xato — kodmi, etalonmi.
  5. Yolg'on testlar va chegara: `expect`siz yashil · noto'g'ri etalon qizil · shartga uch test; AI testiga ikki savol.
  6. Sinf: `No tests found` — joy va nom · `npm ci` → `npm install` · bo'sh loyihada `config:init`, `@types/jest`, `typescript@5`.
- **Uyga vazifa** (M14): «O'quvchi reposida o'z funksiyangizni yozing, masalan chegirma: summa ikki yuz mingdan oshsa o'n foiz. Shart bor, shuning uchun uchta test: yuqori, aynan chegara va past. Bir marta chegarani ataylab buzib qizilni ko'ring, keyin tuzating. delivery fee testlarini ham qo'shing. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Funksiya | `src/discount.ts` — o'z shartingiz (masalan 200 000 dan oshsa −10 %) | — |
  | 2 | Testlar | `src/discount.spec.ts` — 3 `it`: yuqori · aynan · past | `PASS` |
  | 3 | Buzish | shartni buzing → `npm test` | qizil — aynan chegara |
  | 4 | Uyga vazifa namunasi | `src/delivery.ts` + `src/delivery.spec.ts` | `Tests: … passed` |
  | 5 | Topshirish | `git add . && git commit -m "unit-testlar"` · `git push` → repo linki platformadagi uyga vazifaga (M30) | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi qaraydi: har `it`da `expect` · chegara qiymati sinalgan · etalonlar qo'lda hisoblanganga mos.
- **Eslatma:** Jest o'quvchi reposida (3 satr sozlama) · test fayli namunasi · PASS/FAIL o'qish tartibi · yolg'on testlar · chegara · AI testiga ikki savol · tuzoqlar jadvali · bo'sh loyiha zanjiri · o'quvchi tili · o'z uyga vazifangiz.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **Jest: edge cases va error path** — `toThrow`, xato holatlarni sinash».

---

## «KOD» — qurishda
1. PG darslari yordamchilari (`psql()` o'rniga `term()` + `ts()` — Nest-2 dagi rang beruvchi), generator `dev/jest1-matn.py`.
2. Explorer `root: 'IntroNestArxitechture'` — Nest-2 dagi to'liq Explorer (yopiq papkalar) + `src/order.ts`, `src/order.spec.ts` (5-ekrandan `fresh`), `src/delivery.*` (13-ekrandan).
3. Terminal chiqishlari `jest1-out/` dan aynan (toza muhit); `/tmp/…` yo'llari `…/IntroNestArxitechture` ga qisqartiriladi; 13–14 dagi rang kodlari olib tashlanadi.
4. LineCheck (11-ekran): MD'dagi 6-satr → `target={5}`.
5. **✅ 01.11 yurgizildi** (`drive-jest1.sh` 17–20 → `jest1-out/17…20`; aniqlashtirish: bo'sh loyihada TypeScript 6 ham ishlamaydi — 18-ekran moslandi). Avvalgi ro'yxat: Jest o'rnatilmagan holat → `jest: not found` (4-ekran izohi) · `Cannot find module './order'` (7-ekran jadvali) · `TS1005`/sintaksis xatosi (12-ekran jadvali) · 19-ekran 2–3-variant izohlari (`npm ci` bo'sh loyihada, `.js` fayl).
6. Isbotlar: 7 — `/Tests:\s+1 passed,\s+1 total/` · 12 — `/^\s*10\s?002\s*$/` · 16 — `/100\s?000/` + `/bepul/i` · 20 — `/No tests found/i`.

## Ochiq savollar ([GATE M])
1. Testlar o'quvchi reposida (Nest) — PRD Q1 taklifi; tasdiqlang.
2. 18-ekran (bo'sh loyiha zanjiri) — mentor uchun to'liq ko'rsatilsinmi yoki qisqa eslatma yetarlimi?
3. Uyga vazifa — o'quvchi vazifasidan kengroq (o'z funksiyasi + `deliveryFee`); M14 «usulni yangi narsada takrorlash».

## O'quvchi darslari uchun alohida ish (qaror kerak; tegilmadi)
1. **m4b-01** s5: `npm i -D jest ts-jest` — Nest reposida keraksiz (zararsiz); bo'sh loyihada yetarli emas (ESM → `@types/jest` → TypeScript 7).
2. **m4b-01**: test fayli `src/` ichida bo'lishi va nomi `.spec.ts` ekani aniq aytilmagan (Nest `rootDir: src`).
3. **O'quvchi reposi** `IntroNestArxitechture`: `package-lock.json` sinxron emas — `npm ci` yiqiladi.
