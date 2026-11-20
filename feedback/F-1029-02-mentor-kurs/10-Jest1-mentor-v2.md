# Mentor kursi · Jest-1 «OrderBotNest'ga birinchi testlar: yozamiz, buzamiz, AI testini tekshiramiz» — MD v2 (M41: avval mentor o'rganadi)

F-ID: F-1029-02 (Jest-1) · **F-1104-01** (qayta yozish) · Sana: 2026-11-04 · Holat: **GATE M O'TDI 04.11** → KOD ✅ → **QURILDI 04.11 14:19** (gates 12/13, sweep 25/25, toshish 0) → ovozli ko'rik · Fidbek: qator yoniga `>> …`
Oldingi: `10-Jest1-mentor-v1.md` (01.11, avtopilot, M41 dan oldin — misol o'quvchi m4b-01 dan aynan, «o'quvchi» so'zi 115 marta, 26 ekrandan 8 tasi sinf haqida) · **TASHLANADI**
Fayl (qayta quriladi): `src/mentor-kurs/JestUnitMentorLesson.jsx` · bo'laklar `src/mentor-kurs/jest1/parts/` · dvigatel — umumiy `parts/01–02` · generator `dev/jest1-matn.py` (v2, `pg2-matn.py` / `tgpg-matn.py` dagi kabi `==…==` va `Demak:`)
Qonun: `MENTOR_DARS_ETALON.md` M1–M45 · Haqiqiy chiqishlar: `manba/jest1v2-out/` (skript `manba/drive-jest1v2.sh`, har buyruq toza muhitda) · `manba/jest1v2-ai/` (ikki AI tajribasi, `XULOSA.md`) · buzib tekshirish `manba/jest1v2-mutatsiya.sh` · eski `manba/jest1-out/` (faqat 6-bosqich: o'quvchi reposi, bo'sh loyiha)
Loyiha: **OrderBotNest** — Telegraf+PG darsidagi aynan shu repo. Teglar (lokal, 04.11): `jest1-start` (= `tgpg-done` f2eca2f) · `jest1-done` 9d6b947 (+ `texts.spec.ts`, `keyboards.spec.ts`, Prettier) — **push YO'Q** (foydalanuvchi buyrug'i bilan; amaliyot 1-qadami GitHub'dagi teglarga bog'liq)

**v1 → v2 nima o'zgardi (F-1104-01, foydalanuvchi qarorlari 04.11):**
- Misol-ip o'quvchi darsidan (KitobShop `orderTotal`, o'quvchi reposi) emas — **mentor Telegraf+PG darsida ishlagan OrderBotNest**: `som()`, `orderKeyboard`, `catalogKeyboard`, `texts.cart`. Kursning ikkinchi yarmi bitta loyihada davom etadi (Jest-2 → CI/CD → WebSocket → Webhook).
- Foydalanuvchi xavotiri: «mentor faqat TG bot qildim, saytni testlolmayman demasin». Javob darsning o'zida: testda Telegram yo'q, `.env` va baza yo'q — test faqat funksiyani chaqiradi (2-ekran); bot ham, sayt ham bir xil sinaladi; o'quvchi darsidagi KitobShop — sayt misoli (22-ekran). Saytning HTTP API'si testi — Jest-2 da.
- Darsning markazi — haqiqiy topilmalar, o'ylab topilgan emas: `som(120000)` testi bir xil ko'ringan ikki qator bilan FAIL (bo'linmas probel) · etalon koddan olinsa test buzilgan kodda ham yashil · ikki AI testining buzib tekshirishi (36 test buzilishni sezmadi).
- O'quvchi darsi — faqat oxirgi 2 ekran (M41-4). Bo'sh loyiha zanjiri (`config:init`, `@types/jest`, TypeScript 7) v1 dagi 3 ekrandan bitta kartaga qisqardi.

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | Telegraf + PostgreSQL mentor darsini o'tgan: OrderBotNest kompyuterida, `tgpg-done` (yoki o'z 4-bosqichi) ishlaydi. NestJS mentor darslari (Module, Service). Test yozmagan, Jest natijasini o'qimagan. |
| Dars oxirida mentor | 1) unit-test nima va smoke'dan farqini biladi; Jest test faylini qanday topishini biladi (`rootDir`, `testRegex`) · 2) `describe` · `it` · `expect` bilan test yozadi · 3) FAIL'ni o'qiydi: `●` satr, `Expected` / `Received`, `>` satr, fayl va satr raqami; bir xil ko'rinadigan qatorlar sababini topadi · 4) `toBe` va `toEqual` farqini biladi · 5) ikki xil yolg'on testni taniydi: `expect`siz va etalon koddan olingan · 6) har status va chegaraga test yozadi · 7) AI yozgan testni qabul qiladi: diff, `expect`, qo'lda etalon, **buzib tekshirish** · 8) sinfga: m4b-01 xaritasi va o'quvchilar xato qiladigan joylar |
| O'quvchi darsi (faqat 6-bosqich) | **m4b-01** «Unit-test: Jest» (`src/4b-Modull/JestUnitTestLesson.jsx`, `SCREEN_META` 21): KitobShop `orderTotal`, Jestbot, uyga vazifa `deliveryFee`. |
| Kursdagi o'rni | Telegraf + PostgreSQL → **shu** → Jest-2 (edge cases, `toThrow`, Service mock, HTTP test) — M31: raqam yozilmaydi. ⚠ Ochiq savol 1 (TgPg keyingi kartasi hozir WebSocket). |
| Til | M9 + M32 + §MENTOR-STATE. Atamalar inglizcha: unit-test, test fayli (`*.spec.ts`), assertion (`expect`), etalon — kutilgan qiymat, PASS / FAIL, mock (faqat Jest-2 ga ishora). Buyurtma `status`i — «status»; umumiy ma'no — «vaziyat». `it` — «bitta vaziyat». |
| Misol-ip | **OrderBotNest** `src/api/telegram/`: `texts.ts` (`som`, `texts.cart`, `STATUS_UZ`), `keyboards.ts` (`orderKeyboard`, `catalogKeyboard`). Katalog TgPg dagi: Kolonka 50 000, sahifada 2 ta mahsulot (`PAGE_SIZE = 2`). |
| AI | Promptlar bitta AI dasturiga bog'lanmaydi. Ekrandagi AI javobi — **haqiqiy**, ikki tajribadan (`jest1v2-ai/ai1` Opus 5.5, `ai2` Haiku), bitta oddiy prompt: «src/api/telegram/texts.ts va keyboards.ts uchun jest testlar yozib ber. npm test yashil bo'lsin.» Belgi: «namuna — sizning AI'ingiz boshqacha yozadi, tekshiruv bir xil». |
| Haqiqiylik (M10) | 04.11: Node 24.18 · npm 11.16 · jest 30.5.2 · ts-jest 29.4.15 · TypeScript 5.9.3 · Telegraf 4.16.3. Har buyruq toza muhitda (`env -i`): Jest 30 AI agent muhitini sezsa ixcham chiqaradi (`jest1-out/README.md`). Scratchpad yo'llari ekranda `…/OrderBotNest/src`. |
| Hajm | **25 ekran** · 6 bosqich · 3 amaliyot · 4 tekshiruv · 8 savol · ovoz ≈ 24 daq · amaliyot ≈ 45–60 daq · jami ≈ 1 s 10 daq – 1 s 25 daq |
| Me'yor | TgPg v2 bilan bir xil (≤ 5 segment, ≤ 60 so'z, ko'prik M17, «Xulosa», kalit 8–14 so'z, M32 to'liq gap, M33 «Demak», M42 tekshiruv, M43 kod sahnasi) |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **unit-test** — bitta funksiyani alohida chaqiradigan kod: «shu kirishga shu chiqish». Telegram, baza, `.env` kerak emas — 10 test 0,5 soniyada (`jest1v2-out/11`, `12`).
- **smoke va unit-test** — smoke butun botni (baza, restart, besh mijoz) tekshiradi: «ishlayaptimi»; unit-test bitta qoidani: «oxirgi sahifada ▶ yo'q». Biri ikkinchisining o'rnini bosmaydi.
- **Jest qayerdan topadi** — `package.json`dagi `jest` bo'limi reponing o'zida tayyor: `rootDir: "src"`, `testRegex: ".*\\.spec\\.ts$"`, `transform: ts-jest`. Fayl `src/` ichida va nomi `.spec.ts` bilan tugaydi; aks holda `No tests found` (`01`, `13`, `14`).
- **`describe` · `it` · `expect`** — `describe` funksiyaning testlarini guruhlaydi, `it` — bitta vaziyat, `expect(natija).toBe(etalon)` — assertion. `it` ichida xato tashlanmasa — PASS.
- **FAIL o'qish** — `● describe › it` · `Expected:` (etalon) · `Received:` (funksiya qaytargan) · `>` satr · `at … (texts.spec.ts:5:25)`.
- **`toBe` va `toEqual`** — `toBe` — `Object.is`: belgi-belgi bir xil satr yoki aynan bitta obyekt; massiv va obyektni `toEqual` ichini solishtiradi (`06b`: «serializes to the same string»).
- **bo'linmas probel** — `toLocaleString('ru-RU')` minglarni U+00A0 bilan ajratadi; ekranda oddiy probeldek, `toBe` uchun boshqa belgi (`02`, `03`).
- **yolg'on test** — `expect` yo'q (doim PASS, `05`) yoki etalon koddan olingan (`` `Jami: ${som(100000)}` ``) — kod buzilsa etalon ham buziladi, test yashil (`06`).
- **chegara** — shart o'zgaradigan aynan qiymat: oxirgi sahifa, bitta sahifa (`page < pages - 1` → `<=` — `10`).
- **buzib tekshirish** — test to'plami sifati soni bilan emas: kodni ataylab buzing, test qizaradimi (`jest1v2-ai/mutatsiya.txt`).

**Darsning ipi:** smoke bor — nega yana test → Jest testni qayerdan topadi → birinchi test `som()` va bir xil ko'ringan FAIL → ikki xil yolg'on test → admin tugmalari: har status, katalog: chegara → AI ikki xil test to'plami yozdi: buzib tekshiramiz → AI testini qabul qilish → sinfga tayyorgarlik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | Smoke bor — nega yana test? | Lesson | 1 · nega va qayerda |
| 3 | Jest testni qayerdan topadi | Lesson | 1 · ichida |
| 4 | Tekshiruv 1 — `test/` papkasidagi fayl | MCRetry | 1 |
| 5 | Birinchi test: `describe` · `it` · `expect` | Lesson | 2 · birinchi test |
| 6 | Bir xil ikki qator — FAIL | Lesson | 2 |
| 7 | Ichida: `toBe` va bo'linmas probel | Lesson | 2 · ichida |
| 8 | Amaliyot 1 — `texts.spec.ts` | Practice | 2 |
| 9 | Yolg'on PASS: `expect` yo'q | Lesson | 3 · yolg'on testlar |
| 10 | Etalon koddan olingan — buzilgan kodda ham yashil | Lesson | 3 · ichida |
| 11 | Tekshiruv 2 — qaysi satr testni yolg'on qiladi | LineCheck | 3 |
| 12 | Admin tugmalari: har statusga bitta test | Lesson | 4 · statuslar va chegara |
| 13 | `toBe` massivda ishlamaydi — `toEqual` | Lesson | 4 · ichida |
| 14 | Kodni buzamiz: `CANCELLED` da ham tugma | Lesson | 4 |
| 15 | Katalog: chegara — oxirgi va bitta sahifa | Lesson | 4 |
| 16 | Tekshiruv 3 — `page <= pages - 1` | MCRetry | 4 |
| 17 | Amaliyot 2 — `keyboards.spec.ts` va bitta buzish | Practice | 4 |
| 18 | AI ikki to'plam yozdi — ikkalasi yashil | Lesson | 5 · AI testi |
| 19 | Buzib tekshirish: 36 test nimani sezmadi | Lesson | 5 · ichida |
| 20 | Tekshiruv 4 — `toBeTruthy` | MCRetry | 5 |
| 21 | Amaliyot 3 — AI test yozadi, siz buzib tekshirasiz | Practice | 5 |
| 22 | Sinfga tayyorgarlik: m4b-01 xaritasi | Lesson | 6 · sinfga tayyorgarlik |
| 23 | O'quvchilar xato qiladigan joylar va savollari | Lesson | 6 |
| 24 | O'z-sinov — 8 savol | Screen27 | — |
| 25 | Yakun | Screen28 | — |

**Sahna turlari:** VS Code oynasi `OrderBotNest` (Explorer: `src/api/telegram/{telegram.service.ts, keyboards.ts, texts.ts, texts.spec.ts, keyboards.spec.ts}` · `catalog/` · `order/` · `core/entity` · `package.json`; M25 ixcham `compact()` — faqat ochiq faylning papkasi) + terminal kod tagida (M43); **AI javobi kartasi** — prompt + AI javobidan qisqa parcha + `git diff --stat` (TgPg dagi `AiReply`, «namuna» belgisi); **buzish jadvali** — qatorlar galma-gal. **Tekshiruv (M42):** chapda savol va variantlar, o'ngda material savoldan oldin, isbot javobdan keyin, ostida `Demak`.

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · Jest` · Sarlavha: **OrderBotNest'ga birinchi testlarni yozamiz: avval o'zingiz, keyin AI yozgan testni tekshirasiz**
- Sahna: chapda reja (6 bosqich); o'ngda terminal — faqat natija (F-1104-02): `PASS src/api/telegram/keyboards.spec.ts` · `PASS src/api/telegram/texts.spec.ts` · `Tests: 10 passed, 10 total` · `Time: 0.538 s` (`jest1v2-out/11`).
- Reja: 01 Nega va qayerda · 02 Birinchi test · 03 Yolg'on testlar · 04 Statuslar va chegara · 05 AI testi · 06 Sinfga tayyorgarlik
1. **Buyurtma boti ishlaydi — bugun uning ==qoidalarini test bilan qo'riqlaymiz==**
   Ovoz: «Assalomu alaykum. O'tgan darsda buyurtma botini PostgreSQL'ga ko'chirdingiz. Bugun uning qoidalarini test bilan qo'riqlaymiz: narx qanday yoziladi, admin qaysi tugmani ko'radi, katalogning oxirgi sahifasida nima bo'ladi. Ekranda natija: o'nta test, yarim soniyada.»
2. **Avval testni o'zingiz yozasiz, ==FAIL va PASS'ni o'qishni== o'rganasiz**
   Ovoz: «Avval testni qo'lda yozasiz va Jest javobini o'qishni o'rganasiz. Birinchi testning o'zi kutilmagan narsani ko'rsatadi: kod to'g'ri ishlaydi, test qizil, ikki qator esa bir xil ko'rinadi. Sababini darsda bilib olasiz.» · reja 01–02
3. **Keyin testni AI yozadi, siz ==uni buzib tekshirasiz==**
   Ovoz: «Keyin testni AI yozadi. Biz buni ikki xil AI bilan haqiqatan qilib ko'rdik. Ikkalasi o'ttizdan ortiq test yozdi, hammasi yashil. Lekin kodni ataylab buzganimizda ba'zi buzilishlarni hech bir test sezmadi. Shu tekshiruv usulini o'rganasiz.» · reja 03–05
4. **Olti bosqich, uchta amaliyot; oxirida ==ikki ekran sinfga tayyorgarlik==**
   Ovoz: «Dars olti bosqichdan iborat, uchta amaliyotda o'zingiz ishlaysiz. Oxirgi ikki ekran sinfga tayyorgarlik: o'quvchi darsi xaritasi va o'quvchilar xato qiladigan joylar. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz.» · reja 06
- Manba: `jest1v2-out/11-hammasi.txt`, `jest1v2-ai/XULOSA.md`.

## 2 · Smoke bor — nega yana test?  ← `Lesson`
- Kicker: `1-bosqich · nega va qayerda` · Sarlavha: **Smoke butun botni tekshiradi, unit-test — bitta qoidani: biri ikkinchisining o'rnini bosmaydi**
- Sahna: ikki karta yonma-yon: «Smoke (`npm run smoke`)» — baza `shop_smoke`, alohida jarayonlar, restart, besh mijoz, `NATIJA: 5/5 ✓` (`orderbot-out/10`) · «Unit-test (`npm test`)» — bitta funksiya, `.env` yo'q, `Tests: 10 passed` · `Time: 0.508 s` (`jest1v2-out/12`); 3-segmentda kod: `texts.spec.ts` 1-qatori `import { som } from './texts';` va `texts.ts` 4-qatori `export const som = …`.
1. **Telegraf+PG darsida ==smoke butun botni tekshirdi==: baza, restart va besh mijoz**
   Ovoz: «Telegraf va PostgreSQL darsida smoke skriptini yurgizgansiz. U butun botni tekshiradi: alohida baza ochadi, serverni qayta yoqadi, besh mijozni bir vaqtda yuboradi. Javobi bitta: bot ishlayaptimi yoki yo'q.» · chap karta
2. **Unit-test esa ==bitta funksiyani bitta qoida bilan== tekshiradi**
   Ovoz: «Unit-test boshqacha. U bitta funksiyani chaqiradi va bitta qoidani tekshiradi: masalan, katalogning oxirgi sahifasida o'ng strelka chiqmasin. Smoke buni sezmaydi, chunki bot baribir ishlaydi. Unit-test esa xato qaysi funksiyada va qaysi qatorda ekanini aytadi.» · o'ng karta
3. **Testda ==Telegram ham, baza ham yo'q== — u bot yoki sayt ekanini bilmaydi**
   Ovoz: «Endi loyihaning o'zini oching: Telegraf va PostgreSQL darsidagi OrderBotNest papkasini VS Code'da oching. Ekranda bugun yozadigan test: u src, api, telegram papkasidagi texts ts faylidan faqat som funksiyasini import qiladi. Telegram, baza va env fayli kerak emas, env faylisiz o'nta test yarim soniyada o'tdi. Shuning uchun bot ham, sayt ham bir xil sinaladi.» · kod
4. **Xulosa: smoke — ==«ishlayaptimi»==, unit-test — «shu qoida buzilmadimi»**
   Ovoz: «Xulosa: smoke ishlayaptimi degan savolga javob beradi, unit-test esa shu qoida buzilmadimi degan savolga. Bugun unit-test yozamiz. Saytning so'rov va javobini sinash Jest ikkinchi darsida bo'ladi.»
- Manba: `orderbot-out/10-smoke-tgpg-done.txt` (`NATIJA: 5/5 ✓`), `jest1v2-out/12-env-siz.txt` (`.env.example` bor, `.env` yo'q · `Tests: 10 passed` · `Time: 0.508 s`).

## 3 · Jest testni qayerdan topadi  ← `Lesson`
- Kicker: `1-bosqich · ichida` · Sarlavha: **Jest sozlamasi `package.json`da tayyor: fayl `src/` ichida, nomi `.spec.ts` bilan tugaydi**
- Sahna: VS Code — `package.json` `"jest"` bo'limi (12 qator, `jest1v2-out/01` dagi aynan) + `"test": "jest"`; terminal kod tagida — `npm test` → `No tests found` bloki (`01`).
1. **Loyihada ==test yozish uchun hamma narsa tayyor==: Jest, ts-jest va sozlama**
   Ovoz: «Avval Jest testni qayerdan qidirishini ko'ramiz. VS Code'da OrderBotNest papkasining ildizidagi package json faylini oching. O'n to'rtinchi satrda test buyrug'i: jest. Pastroqda, qirq beshinchi satrdan, jest bo'limi boshlanadi. Nest loyihasida jest va ts jest paketlari allaqachon o'rnatilgan, hech narsa o'rnatmaysiz.» · `"test": "jest"`, devDependencies
2. **Ikki satr hal qiladi: ==`rootDir: src` va `testRegex` — `.spec.ts`==**
   Ovoz: «Jest bo'limida ikki satr hal qiladi: ellik birinchi va ellik ikkinchi. Root dir src: Jest faqat src papkasi ichini ko'radi. Test regex: fayl nomi spec ts bilan tugashi kerak. Ellik to'rtinchi satrdagi transform ts jest esa TypeScript faylni JavaScript'ga aylantirib beradi.» · 51–54-satr
3. **==VS Code terminalida `npm test`==: hozir test fayli yo'q — `No tests found`**
   Ovoz: «Endi VS Code'da Terminal menyusidan yangi terminal oching, u OrderBotNest papkasida ochiladi, va npm test yozing. Loyihada hali bitta ham test fayli yo'q, shuning uchun Jest no tests found deydi va bir kodi bilan chiqadi, ya'ni xato. Pastda: yigirma yetti fayl ko'rildi, test regex'ga nol mos keldi.» · terminal
4. **Xulosa: `No tests found` chiqsa — ==fayl joyi va nomini== tekshiring**
   Ovoz: «Xulosa: no tests found ko'rsangiz, kodni emas, fayl joyi va nomini tekshiring. Sinab ko'rdik: nomi test ts bo'lsa ham, fayl src'dan tashqarida tursa ham, aynan shu xabar chiqadi.»
- Manba: `jest1v2-out/01-test-yoq.txt` (`27 files checked` · `testRegex: .*\.spec\.ts$ - 0 matches` · `[chiqish kodi: 1]`), `13-test-ts-nomi.txt`, `14-src-dan-tashqari.txt`.

## 4 · Tekshiruv 1 — `test/` papkasidagi fayl  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Test fayli `test/texts.spec.ts` da — loyiha ildizidagi `test` papkasida. `npm test` nima deydi?**
- Material (`above`, M42): Explorer: `OrderBotNest/` → `src/` (yopiq) · `test/texts.spec.ts` (ochiq) · `package.json`; ostida `package.json` dan ikki satr: `"rootDir": "src",` · `"testRegex": ".*\\.spec\\.ts$",`.
- Ovoz: «Jest qayerdan qidirishini ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Test fayli nomi to'g'ri, spec ts bilan tugaydi. Lekin u src ichida emas, loyiha ildizidagi test papkasida turibdi. Npm test nima deydi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 `PASS` — fayl nomi `.spec.ts` bilan tugaydi · 2 `Cannot find module` — import yo'li buzildi · 3 `No tests found` — fayl `src/` dan tashqarida · 4 `PASS` — Jest `test/` papkasini o'zi qidiradi
- To'g'ri (ovoz): «To'g'ri. Root dir src bo'lgani uchun Jest test papkasiga umuman qaramaydi. Sinab ko'rdik: no tests found va bir kodi. Import xatosi chiqishi uchun Jest faylni ochishi kerak edi, u esa faylni ko'rmadi. Demak, test fayli src ichida, sinaladigan faylning yonida turadi.» · qisqa: «`rootDir: src` — `test/` ko'rinmaydi: `No tests found`.»
- Isbot (`after`): terminal `14-src-dan-tashqari.txt`: `No tests found, exiting with code 1` · `testRegex: .*\.spec\.ts$ - 0 matches`.
- Demak: «Test fayli `src/` ichida, sinaladigan faylning yonida turadi.»
- Xato izohlari: 1 — «Nom to'g'ri, lekin joy `rootDir` dan tashqarida.» · 2 — «Import xatosi uchun Jest faylni ochishi kerak — u faylni ko'rmadi.» · 4 — «Nest'ning e2e testlari uchun alohida sozlama kerak; bu loyihada u yo'q.»
- Maslahat: «`rootDir` qaysi papkani ko'rsatadi? Fayl o'sha papka ichidami?»
- Manba: `jest1v2-out/14-src-dan-tashqari.txt`.

---

## 5 · Birinchi test: `describe` · `it` · `expect`  ← `Lesson`
- Kicker: `2-bosqich · birinchi test` · Sarlavha: **Test — uch qismli kod: qaysi funksiya, qaysi vaziyat va qanday natija kutiladi**
- Sahna: VS Code — chapda Explorer (`src/api/telegram/texts.ts`, **`texts.spec.ts` — yangi**); kod `texts.ts` 3–4-satr (`// 120000 → "120 000 so'm"` · `export const som = …`), 2-segmentdan `texts.spec.ts` 1–7 (`02` dagi aynan).
1. **Birinchi test uchun ==`som` funksiyasini== olamiz: u narxni so'mda yozadi**
   Ovoz: «Birinchi test uchun eng oddiy funksiyani olamiz. VS Code'da src, api, telegram papkasidagi texts ts faylini oching: to'rtinchi satrda som funksiyasi. U sonni oladi va bot matni uchun so'mda yozadi, bir yuz yigirma ming bir yuz yigirma ming so'm bo'ladi. Bot har narxni shu funksiya bilan chiqaradi.» · `texts.ts` 3–4
2. **Test fayli ==yonida turadi==: `texts.ts` uchun — `texts.spec.ts`**
   Ovoz: «Test faylini shu telegram papkasining o'zida, texts ts yonida yaratasiz: Explorer'da papkani o'ng tugma bilan bosib, New File, nomi texts spec ts. Nomi spec ts bilan tugashi shart. Birinchi satrda funksiyani import qilamiz. Telegraf ham, baza ham import qilinmaydi.» · 1-satr
3. **`describe` — funksiya, `it` — vaziyat, ==`expect … toBe` — kutilgan natija==**
   Ovoz: «Keyingi uch qism. Describe som: bu testlar qaysi funksiya haqida. It: bitta vaziyat, nomi oddiy gap bilan yoziladi. Ichida expect: som bir yuz yigirma ming natijasi to be ichidagi etalonga teng bo'lsin. Etalon — kutilgan qiymat, uni qo'lda yozamiz.» · 3–5-satr
4. **Xulosa: ==funksiyani chaqirish, etalon bilan solishtirish== — har test shu ikki qadam**
   Ovoz: «Xulosa: har test ikki qadamdan iborat: funksiyani chaqirasiz va natijani qo'lda yozilgan etalon bilan solishtirasiz. Endi testni yurgizamiz: VS Code terminalida npm test, ikki chiziqcha va texts. Fayl nomini qo'shsak, faqat shu test fayli yuradi.»
- Manba: `order-bot` `tgpg-done` `src/api/telegram/texts.ts` 3–4; `jest1v2-out/02` (test fayli).

## 6 · Bir xil ikki qator — FAIL  ← `Lesson`
- Kicker: `2-bosqich · birinchi test` · Sarlavha: **Test qizil: `Expected` va `Received` bir xil ko'rinadi, lekin Jest ularni teng demayapti**
- Sahna: terminal `npx jest texts` → to'liq FAIL bloki (`jest1v2-out/02`), segment bilan yoritiladi: `● som › 120000 ni so'mda yozadi` → `Expected` / `Received` → `> 5 |` va `^` → `at Object.<anonymous> (api/telegram/texts.spec.ts:5:25)` → `Tests: 1 failed`.
1. **FAIL'ni ==yuqoridan pastga== o'qiymiz: avval qaysi test yiqildi**
   Ovoz: «Terminalda npm test, ikki chiziqcha va texts yozdik: test qizil. FAIL'ni yuqoridan pastga o'qiymiz. Nuqtali satr qaysi test yiqilganini aytadi: som guruhidagi bir yuz yigirma ming testi. Testlar ko'p bo'lsa, birinchi shu satrni qidirasiz.» · `●` satr
2. **Keyin ikki satr: ==`Expected` — etalon, `Received` — funksiya qaytargani==**
   Ovoz: «Keyingi ikki satr asosiysi. Expected — siz test faylida yozgan matn. Received — som funksiyasi haqiqatda qaytargan matn. Jest sonni emas, shu ikki matnni solishtiradi va ular teng bo'lmasa, test yiqiladi. Lekin qarang: ikkala qator bir xil, bir yuz yigirma ming so'm.» · Expected/Received
3. **Pastda ==satr raqami==: `texts.spec.ts:5:25` — beshinchi satr, `toBe` belgisi**
   Ovoz: «Pastda kod bo'lagi: katta belgisi va strelka xato bo'lgan joyni ko'rsatadi, test faylining beshinchi satri, to be. Eng oxirgi qatorda fayl nomi va satr raqami yana yozilgan. VS Code'da texts spec ts faylining aynan shu satrini ochasiz.» · `>` satr
4. **Demak, sabab bitta joyda: ==bo'sh joy ikki matnda har xil belgi==**
   Ovoz: «Demak, sabab bitta joyda: bir yuz yigirma va ming orasidagi bo'sh joy. Siz klaviaturada oddiy probel yozdingiz, som esa ko'zga ko'rinmaydigan boshqa belgi qo'ydi. Ekranda ikkalasi bir xil ko'rinadi, Jest uchun esa har xil. Keyingi ekranda ikki matnni belgima-belgi solishtirib, shu belgini o'z ko'zingiz bilan ko'rasiz.» · Expected/Received
- Manba: `jest1v2-out/02-som-fail-probel.txt` (aynan).

## 7 · Ichida: `toBe` va bo'linmas probel  ← `Lesson`
- Kicker: `2-bosqich · ichida` · Sarlavha: **`toLocaleString` minglarni oddiy probel bilan emas, bo'linmas probel bilan ajratadi**
- Sahna (F-1104-07): katta solishtirish — ikki qator yonma-yon: «Expected — siz yozgan» va «Received — som qaytargan»; belgilar bittalab paydo bo'ladi, mos belgilar yashil; 4-belgi (`0020` ↔ `00a0`) katta qizil va yonib-o'chadi, ostida «farq faqat shu belgida». Manba: `"120 000 so'm"` va ostida kodlar `0031 0032 0030 00a0 0030 0030 0030 0020 0073 006f 0027 006d` — `00a0` qizil, `0020` yashil; 3-segmentda `texts.spec.ts` tuzatilgan (`04`): `toBe("120 000 so'm")` (eski qizil, yangisi yashil — M36) + `it('kichik sonda probel yo\'q', …)`; terminal `PASS` · `✓ 120000 ni so'mda yozadi` · `✓ kichik sonda probel yo'q` · `Tests: 2 passed`.
1. **`toBe` ==belgi-belgi solishtiradi==: bitta belgi farq qilsa — teng emas**
   Ovoz: «Endi sababini aniqlaymiz. To be ikki matnni belgi-belgi solishtiradi, Jest buni Object is deb yozadi. Ekranda ikki qator: yuqorida Expected, siz yozgan matn, pastda Received, som qaytargan matn. Belgilarni birma-bir taqqoslaymiz: bir, ikki, nol, keyin bo'sh joy.» · solishtirish
2. **To'rtinchi belgida farq: ==`0020` — oddiy probel, `00a0` — bo'linmas probel==**
   Ovoz: «Mana farq, to'rtinchi belgida. Expected'da oddiy probel, kodi nol nol ikki nol. Received'da nol nol a nol: bo'linmas probel. Ekranda u oddiy probeldek ko'rinadi, lekin boshqa belgi. Uni to locale string qo'ydi, rus tili qoidasi bo'yicha. Qolgan hamma belgi bir xil, ular yashil.» · farq
3. **Etalonni ==`\u00a0` bilan ochiq yozamiz== — endi test yashil va o'qiladi**
   Ovoz: «Kod to'g'ri: bo'linmas probel raqamni Telegram xabarida ikki qatorga bo'lib yubormaydi. Shuning uchun etalonni tuzatamiz va belgini ochiq yozamiz: backslash u, nol nol a nol. Ikkinchi testni kichik son uchun qo'shdik. Ikkalasi yashil.» · tuzatilgan kod + PASS
4. **Xulosa: birinchi testning o'zi ==kod haqida bilmagan narsangizni== ko'rsatdi**
   Ovoz: «Xulosa: birinchi testning o'zi siz bilmagan narsani ko'rsatdi. Expected va received bir xil ko'rinsa, ko'rinmas belgini qidiring. Etalonga belgini ochiq yozing, ko'zga ko'rinmaydigan belgining o'zini emas: keyingi odam uni oddiy probel deb o'ylaydi.»
- Manba: `jest1v2-out/03-belgi-kodi.txt`, `04-som-pass.txt`; 4-segmentdagi «belgining o'zi» — `jest1v2-ai/ai2/texts.spec.ts` 33-satr (`od -c`: `302 240`), 19-ekranda qaytiladi.

## 8 · Amaliyot 1 — `texts.spec.ts`  ← `Practice`
- Kicker: `Amaliyot 1 / 3` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **Birinchi testni o'zingiz yozing: avval qizilni ko'ring, keyin sababini topib yashil qiling** · `tableAt: 3`
1. **Endi siz: ==`jest1-start` tegida== birinchi test faylini yozasiz**
   Ovoz: «Endi navbat sizga. Telegraf va PostgreSQL darsidagi OrderBotNest papkasini ochasiz va jest bir start tegiga o'tasiz. Env fayli va baza kerak emas. O'n daqiqa ketadi.»
2. **1–2-qadam: teg, fayl va ==oddiy probelli etalon== — FAIL'ni o'zingiz ko'ring**
   Ovoz: «Birinchi qadamda git fetch va checkout bilan tegga o'tasiz, npm test no tests found deydi. Ikkinchisida texts spec ts faylini yozasiz, etalonni klaviaturadagi oddiy probel bilan. Npm test texts: qizil, ikki qator bir xil.»
3. **3–4-qadam: ==`\u00a0`== bilan tuzatish va ikkinchi test; isbot — `Tests:` satri**
   Ovoz: «Uchinchi qadamda etalonga backslash u nol nol a nol yozasiz. To'rtinchisida besh yuz uchun ikkinchi testni qo'shasiz. Isbot maydoniga oxirgi natijaning tests satrini nusxalang.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz test yozasiz, FAIL'ni o'qiysiz va ko'rinmas belgini topasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Teg | `git fetch --tags` · `git checkout jest1-start` · `npm test` | `No tests found, exiting with code 1` |
  | 2 | Test — oddiy probel bilan | `src/api/telegram/texts.spec.ts` (5-ekrandagi kod) · `npm test -- texts` | `FAIL` · `Expected: "120 000 so'm"` · `Received: "120 000 so'm"` |
  | 3 | Tuzatish | etalon `"120\u00a0000 so'm"` · `npm test -- texts` | `PASS` |
  | 4 | Ikkinchi test | `it('kichik sonda probel yo\'q', …)` — `som(500)` → `"500 so'm"` | `Tests: 2 passed, 2 total` |
- Isbot: «Oxirgi natijaning `Tests:` satri» · placeholder: «`Tests: …` qatorini nusxalang» · KOD: `/Tests:\s+2 passed,\s+2 total/` · xato: «Ikkala test yashilmi? `npm test -- texts` natijasidagi `Tests:` qatorini qo'ying.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `error: pathspec 'jest1-start' did not match` | teglar olinmagan — `git fetch --tags`, keyin checkout |
  | `Your local changes … would be overwritten by checkout` | Telegraf+PG darsidagi o'z o'zgarishlaringiz — `git stash` yoki commit, keyin checkout |
  | 2-qadamda `PASS` | etalonni nusxa bilan qo'ydingiz — belgi ham ko'chdi; probelni klaviaturadan qayta yozing |
  | `Cannot find module './texts'` | fayl `src/api/telegram/` da emas — `texts.ts` yoniga ko'chiring |
  | `No tests found` | nomi `.spec.ts` emas yoki `src/` dan tashqarida (3–4-ekran) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `jest1v2-out/01`, `02`, `04`, `13`, `14`; `21-import-xato.txt` (`Cannot find module './texts' from 'api/texts.spec.ts'`), `20-git-checkout-xatolar.txt` (`pathspec`, `would be overwritten`) — KOD 2, 04.11.

---

## 9 · Yolg'on PASS: `expect` yo'q  ← `Lesson`
- Kicker: `3-bosqich · yolg'on testlar` · Sarlavha: **`expect`siz test har doim yashil: u funksiyani chaqiradi, lekin hech narsani tekshirmaydi**
- Sahna: kod `yolgon.spec.ts` (5 qator, `05` dan: `it(…, () => { console.log(som(120000)); });`); terminal kod tagida: `console.log` · `120 000 so'm` · `PASS` · `✓` · `Tests: 1 passed`.
1. **Test yozishni bildingiz — endi ==testning o'zi qanday aldashini== ko'ramiz**
   Ovoz: «Test yozishni bildingiz. Endi testning o'zi qanday aldashini ko'ramiz. Ekranda shu telegram papkasidagi yolgon spec ts fayli. Birinchi tur yolg'on test: unda expect yo'q, faqat console log. Bunday test ko'pincha qo'lda tekshirib ko'rish paytida qoladi.» · kod
2. **Jest natijani chop etdi va ==PASS dedi== — hech narsa solishtirilmadi**
   Ovoz: «Natija: terminalda Jest qiymatni chop etdi va PASS dedi. Lekin hech narsa solishtirilmadi. Jest uchun qoida oddiy: it ichida xato tashlanmasa, test o'tdi. Xatoni faqat expect tashlaydi.» · terminal
3. **Xulosa: har `it` ichida ==kamida bitta `expect`== bo'lsin — aks holda u test emas**
   Ovoz: «Xulosa: har it ichida kamida bitta expect bo'lishi kerak, aks holda u test emas, faqat chaqiruv. Bunday test topish oson: console log bor, expect yo'q. Ikkinchi tur esa ancha yashirin, uni keyingi ekranda ko'ramiz.»
- Manba: `jest1v2-out/05-expect-yoq.txt`.

## 10 · Etalon koddan olingan — buzilgan kodda ham yashil  ← `Lesson`
- Kicker: `3-bosqich · ichida` · Sarlavha: **Etalonni kodning o'zidan yasasangiz, kod buzilganda etalon ham buziladi — test yashil qoladi**
- Sahna: kod `savat.spec.ts` (`06` dan, 18 qator): ikki `it` — «etalon koddan» `` expect(t).toContain(`Jami: ${som(100000)}`) `` va «etalon qo'lda» `expect(t).toContain("Jami: 100\u00a0000 so'm")`; 1-segmentda terminal `06a`: ikkalasi `✓`; 2-segmentda `texts.ts` 4-satr buziladi `'ru-RU'` → `'en-US'` (qizil); 3-segmentda terminal `06`: `✓ etalon koddan` · `✕ etalon qo'lda` · `Received string: … Jami: 100,000 so'm`.
1. **Ikki test savat matnini tekshiradi: ==biri etalonni `som`dan oladi, biri qo'lda==**
   Ovoz: «Ikkinchi tur. Telegram papkasidagi savat spec ts faylida ikkita test bor, ikkalasi savat matnidagi jami qatorini qidiradi. Birinchisida etalon som funksiyasining o'zidan yasalgan, ikkinchisida qo'lda yozilgan. Chizmaga qarang: hozir som to'g'ri, ikkala etalon ham yuz ming so'm, ikkalasi yashil.» · oqim + `06a`
2. **Kodni buzamiz: ==narx endi «100,000» ko'rinishida== — bot noto'g'ri yozadi**
   Ovoz: «Endi kodni ataylab buzamiz. Texts ts faylining to'rtinchi satrida, som funksiyasida rus tili o'rniga ingliz tili qoidasini qo'yamiz. Endi bot narxni vergul bilan yozadi: yuz ming emas, yuz, vergul, ming. Mijoz uchun bu boshqa son. Testlarni yurgizamiz.» · `texts.ts` 4
3. **Koddan olingan etalon ==buzilgan `som` bilan birga o'zgardi== — test yashil**
   Ovoz: «Chizmaga qarang. Som endi yuz, vergul, ming deydi. Birinchi testning etaloni ham som'dan yasaladi, ya'ni u ham yuz, vergul, ming bo'ldi: ikki tomon birga buzildi va test yashil qoldi. Qo'lda yozilgan etalon o'zgarmadi, shuning uchun ikkinchi test qizil.» · oqim + `06`
4. **Xulosa: ==etalon qo'lda yoziladi== — sinalayotgan funksiya etalonda ishlatilmaydi**
   Ovoz: «Xulosa: etalon qo'lda yoziladi. Sinalayotgan funksiya etalonni yasashda ishlatilmaydi. Testda dollar va qavs ichida shu funksiya chaqirilgan bo'lsa, bu ogohlantirish belgisi. Endi buni bitta kod bo'lagida o'zingiz topasiz.»
- Manba: `jest1v2-out/06a-etalon-ikkalasi-pass.txt`, `06-etalon-nusxa.txt`, `savat.spec.ts`; naqsh — `jest1v2-ai/ai2/texts.spec.ts` (104, 114, 134, 160-satr).

## 11 · Tekshiruv 2 — qaysi satr testni yolg'on qiladi  ← `LineCheck`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4 — qaysi satr xato?` · Sarlavha: **Bu test `som` buzilganda ham yashil qoladi. Sababchi satrni toping**
- Shart (`task`): «Qoida: etalon qo'lda yoziladi, sinalayotgan funksiya etalonda chaqirilmaydi. Bu testda bitta satr etalonni `som` ning o'zidan yasaydi. **O'sha satrni bosing.**»
- Ovoz (`q`): «Yolg'on testni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu test buyurtma qabul qilingan xabarini tekshiradi. Som buzilganda ham u yashil qoladi. Bitta satr etalonni som funksiyasining o'zidan yasaydi. O'sha satrni bosing.»
- Fayl: `texts.spec.ts` (Explorer faol), `describe('texts.orderPlaced')` bo'lagi 12–19 (haqiqiy fayl `jest1v2-out/23-linecheck-buzuq.txt`, Haiku naqshi asosida; Prettier 80, M43): 12 `describe('texts.orderPlaced', () => {` · 13 `it('buyurtma qatori va jami', () => {` · 14 `const t = texts.orderPlaced(order);` · 15 `expect(t).toContain('Buyurtma #42 qabul qilindi!');` · **16 `` expect(t).toContain(`Jami: ${som(50000)}`); `` ← xato satr** · 17 `expect(t).toContain('Telefon: +998901234567');` · 18 `});` · 19 `});` → `target` = 16-satr (bo'lakda 5-satr). Yuqorida (`above` emas, kod paneli ostida) terminal: `som` en-US buzilganda `✓ buyurtma qatori va jami` (`23`).
- Tuzatilgan (`fixed`): 16 `` `Jami: ${som(50000)}` `` → `"Jami: 50\u00a0000 so'm"` va 2 `import { som, texts }` → `import { texts }` (eski qizil, yangisi yashil, raqamlar haqiqiy — `24`); `fixedExtra`: `som` en-US bilan — `✕ buyurtma qatori va jami` · `Received string: … Jami: 50,000 so'm` (`24`).
- To'g'ri (ovoz, `ok`): «To'g'ri. Shu satrda etalon som'ning o'zidan yasaladi, shuning uchun som buzilsa, etalon ham u bilan birga buziladi. Ekranda tuzatilgan satr: etalon qo'lda, bo'linmas probel bilan. Endi som buzilsa, test qizaradi. Demak, etalonda sinalayotgan funksiya chaqirilgan satrni qidiring.»
- Qisqa (`okShort`): «`${som(50000)}` — etalon koddan: `som` buzilsa, ikkala tomon birga buziladi. Qo'lda yozilgan `"Jami: 50\u00a0000 so'm"` buzilishni ushlaydi.»
- Maslahat (`hint`): «Qaysi satrda etalon qo'lda yozilmagan, funksiya chaqiruvidan yasalgan?»
- Manba: `jest1v2-out/23-linecheck-buzuq.txt`, `24-linecheck-tuzatilgan.txt`, `orderplaced.spec.ts`; `jest1v2-ai/ai2/texts.spec.ts` (Haiku: `` `Jami: ${som(50000)}` `` naqshi), `jest1v2-ai/mutatsiya.txt` (Haiku B1: 33 dan 1 qizil).

---

## 12 · Admin tugmalari: har statusga bitta test  ← `Lesson`
- Kicker: `4-bosqich · statuslar va chegara` · Sarlavha: **Buyurtma to'rt statusdan o'tadi — har statusga admin ko'radigan tugmalar uchun bitta test**
- Sahna: chapda status jadvali (`NEW` → «✅ Tasdiqlash · ❌ Bekor» · `CONFIRMED` → «🚚 Yetkazildi · ❌ Bekor» · `DELIVERED` / `CANCELLED` → tugma yo'q); o'ngda kod `keyboards.ts` 37–51 (`orderKeyboard`, haqiqiy satrlar); 3-segmentda `keyboards.spec.ts` 1–35 (`07` dan: `buttons()` yordamchisi, `order()`, uch `it`); terminal `07`: `PASS` · 3 ta `✓`.
1. **Admin har buyurtma ostida ==statusiga qarab tugma== ko'radi**
   Ovoz: «Endi admin tugmalarini sinaymiz. Telegraf va PostgreSQL darsidan bilasiz: buyurtma to'rt statusdan o'tadi. Yangi buyurtma ostida tasdiqlash va bekor tugmalari, tasdiqlanganida yetkazildi va bekor. Yetkazilgan yoki bekor qilingan buyurtmada tugma yo'q.» · jadval
2. **Bu qoida ==bitta funksiyada==: `orderKeyboard` — buyurtma kiradi, klaviatura chiqadi**
   Ovoz: «Bu qoida bitta funksiyada yozilgan: src, api, telegram papkasidagi keyboards ts faylida, o'ttiz yettinchi satrdan, order keyboard. Unga buyurtma beriladi, u Telegraf klaviaturasini qaytaradi yoki undefined. Tugma bosilganda bot callback satrini oladi: status, buyurtma raqami va yangi status.» · kod 37–51
3. **Har statusga ==bitta `it`==: ikki tugma, ikki tugma, `toBeUndefined`**
   Ovoz: «Test fayli yonida: keyboards spec ts. Har statusga bitta it yozamiz. Beshinchi satrdagi buttons yordamchisi klaviaturadan faqat tugma matni va callback'ni oladi. O'ttiz birinchi satrdagi testda to be undefined: yetkazilgan va bekor qilingan buyurtmada klaviatura yo'q. Terminalda uchala test yashil.» · test + terminal
4. **Xulosa: ==har status — bitta vaziyat==; bittasi tushib qolsa, o'sha qoida qo'riqlanmaydi**
   Ovoz: «Xulosa: statuslar jadvali bo'lsa, har qatori bitta test bo'ladi. To'rtta status uchun uchta test yozdik, oxirgisida ikkita expect. Birorta status tushib qolsa, o'sha qoida himoyasiz qoladi. Yordamchida nega to equal ishlatilganini keyingi ekranda bilib olasiz.»
- Manba: `order-bot` `keyboards.ts` 37–51; `jest1v2-out/07-orderKeyboard-pass.txt`, `keyboards.spec.ts`.

## 13 · `toBe` massivda ishlamaydi — `toEqual`  ← `Lesson`
- Kicker: `4-bosqich · ichida` · Sarlavha: **Ikki massiv bir xil ko'rinsa ham `toBe` FAIL beradi: u ichini emas, aynan bitta massivmi — shuni tekshiradi**
- Sahna: kod `tobe.spec.ts` (9 qator, `06b`); terminal: `✕ toBe` · `✓ toEqual` · `If it should pass with deep equality, replace "toBe" with "toStrictEqual"` · `Received: serializes to the same string`; 3-segmentda `08` dagi `Received: {"reply_markup": {"inline_keyboard": [[{"callback_data": …, "hide": false, "text": …}]]}}` — `"hide": false` yoritiladi.
1. **Bir xil massiv, ikki solishtirish: ==`toBe` qizil, `toEqual` yashil==**
   Ovoz: «Bir xil ikki massivni ikki usulda solishtiramiz. To be qizil, to equal yashil. Jest xabari ham shuni aytadi: received bir xil satrga aylanadi, lekin to be uni teng demaydi va to strict equal'ni taklif qiladi.» · terminal
2. **`toBe` — ==aynan bitta obyektmi==; `toEqual` — ichidagi qiymatlar tengmi**
   Ovoz: «Sababi bunday. Satr va son uchun to be qiymatni solishtiradi. Massiv va obyekt uchun esa u ikkalasi xotirada aynan bitta obyektmi, shuni tekshiradi. Kodda ikki marta yozilgan massiv ikki xil obyekt. To equal esa ichini bittalab solishtiradi.»
3. **Telegraf tugmaga ==`hide: false` qo'shadi== — shuning uchun yordamchi kerak bo'ldi**
   Ovoz: «Klaviaturada yana bir nozik joy bor. Telegraf har tugmaga hide false maydonini o'zi qo'shadi, kodimizda u yozilmagan. Klaviaturani to'liq solishtirsak, etalonga ham shu maydonni yozishga to'g'ri keladi. Shuning uchun yordamchi faqat matn va callback'ni oladi.» · `08` Received
4. **Xulosa: ==son va satr — `toBe`, massiv va obyekt — `toEqual`==**
   Ovoz: «Xulosa: son va satr uchun to be, massiv va obyekt uchun to equal ishlating. Kutubxona qo'shadigan maydonlar testni ortiqcha og'irlashtirsa, solishtirishdan oldin kerakli qismini ajratib oling.»
- Manba: `jest1v2-out/06b-tobe-toequal.txt`, `08-orderKeyboard-fail.txt` (`"hide": false`); `hide: false` — `jest1v2-ai/ai2` javobi ham aytgan (XULOSA).

## 14 · Kodni buzamiz: `CANCELLED` da ham tugma  ← `Lesson`
- Kicker: `4-bosqich · statuslar va chegara` · Sarlavha: **Bekor qilingan buyurtmaga yana tugma chiqdi — test qaysi qoida buzilganini aniq aytadi**
- Sahna: kod `keyboards.ts` 39-satr — `if (o.status === 'DELIVERED' || o.status === 'CANCELLED') return undefined;` → buzilgan `if (o.status === 'DELIVERED') return undefined;` (M36: eski qizil); terminal `08`: `✓ ✓ ✕` · `● orderKeyboard › yetkazilgan va bekor qilingan — tugma yo'q` · `expect(received).toBeUndefined()` · `Received: {…"🚚 Yetkazildi"…"❌ Bekor"…}` · `> 33 |`; 4-segmentda tuzatilgan satr yashil, terminal `PASS`.
- F-1120-02 (M52): 0-band — mentor 39-satrdagi `|| o.status === 'CANCELLED'` ni o'zi bosadi → shart buziladi. Kod ostida kichik rasm (M51): keyboards.spec.ts → orderKeyboard(CANCELLED) → javob «?» → klaviatura keldi (1 failed) → tiklandi (3 passed); bo'laklar 1 (test nomi — qoida) · 2 (Received — klaviatura).
0. **Endi ==o'zingiz buzasiz==: kodda yonib turgan `CANCELLED` sharti ustiga bosing**
   Ovoz: «Testlar yashil. Endi kodni ataylab buzamiz, chunki shartdan bitta status tushib qolishi juda oson. Buzishni o'zingiz qilasiz: keyboards ts faylining o'ttiz to'qqizinchi satrida bekor qilingan status sharti yonib turibdi, ustiga bosing.»
   Bosish: «**keyboards.ts** 39-satridagi **`|| o.status === 'CANCELLED'`** ustiga bosing — bu bo'lak shartdan o'chadi.»
1. **Shartdan ==`CANCELLED` tushib qoldi==: kod ishlaydi, server ham xato bermaydi**
   Ovoz: «Bekor qilingan status shartdan tushib qoldi. Bot ishlaydi, server ham xato bermaydi. Lekin admin bekor qilingan buyurtma ostida yana yetkazildi va bekor tugmalarini ko'radi. Testni yurgizamiz.» · kod
2. **Uchtadan bitta test qizil: ==`toBeUndefined` kutildi, lekin klaviatura keldi==**
   Ovoz: «Uchta testdan bittasi qizil. Nuqtali satr qoidani aytadi: yetkazilgan va bekor qilingan, tugma yo'q. Received qatorida undefined o'rniga klaviatura keldi, ichida yetkazildi va bekor tugmalari. Katta belgisi o'ttiz uchinchi satrda: bekor qilingan status.» · terminal
3. **Xulosa: ==test nomi qoidani aytadi== — FAIL'dan qaysi qoida buzilgani darhol ko'rinadi**
   Ovoz: «Xulosa: test nomini qoida sifatida yozing, masalan «bekor qilingan, tugma yo'q». Shunda FAIL'ning birinchi satridan qaysi qoida buzilganini darhol bilasiz. Shartni tiklaymiz, test yana yashil.»
- Manba: `jest1v2-out/08-orderKeyboard-fail.txt`.

## 15 · Katalog: chegara — oxirgi va bitta sahifa  ← `Lesson`
- Kicker: `4-bosqich · statuslar va chegara` · Sarlavha: **Xato ko'pincha chegarada: birinchi, oxirgi va yagona sahifa uchun alohida test**
- Sahna: chapda katalog sahifalari kartasi (`1/3 ▶` · `◀ 2/3 ▶` · `◀ 3/3` · `1/1`); o'ngda kod `keyboards.ts` 18–22 (sahifalash shartlari); 2-segmentda `keyboards.spec.ts` catalogKeyboard bo'lagi (`09` dan, `nav()` va 4 `it`); 3-segmentda buzish `page < pages - 1` → `page <= pages - 1` va terminal `10`: `✕ oxirgi sahifada ▶ yo'q` · `✕ bitta sahifa — faqat 1/1` · `+   "▶",`.
1. **Katalog ikkitadan sahifada: ==◀ birinchi sahifada yo'q, ▶ oxirgisida yo'q==**
   Ovoz: «Katalogga o'tamiz. Mahsulotlar ikkitadan sahifada ko'rsatiladi. Birinchi sahifada chap strelka yo'q, oxirgisida o'ng strelka yo'q, o'rtada ikkalasi bor. Mahsulot ikkitadan kam bo'lsa, sahifa bitta va strelka umuman yo'q.» · sahifalar kartasi
2. **To'rt vaziyat — to'rt test: ==birinchi, o'rta, oxirgi va yagona sahifa==**
   Ovoz: «Shu to'rt vaziyatga to'rtta test yozamiz: birinchi, o'rtadagi, oxirgi va yagona sahifa. Keyboards spec ts faylining qirq birinchi satridagi nav yordamchisi klaviaturadan faqat strelkalar qatorini oladi. Beshinchi test tugagan mahsulotni tekshiradi: uni bosib bo'lmaydi.» · test bo'lagi
3. **Kichikdan katta o'rniga ==kichik yoki teng==: o'rtadagi sahifa buni sezmaydi**
   Ovoz: «Kodni buzamiz: keyboards ts faylining yigirma birinchi satrida kichik belgisi o'rniga kichik yoki teng. Endi oxirgi sahifada ham o'ng strelka chiqadi. Natija: ikkita test qizil, oxirgi va yagona sahifa. O'rtadagi sahifa testi yashil qoldi, chunki u chegarada emas. Jest farqni plyus belgisi bilan ko'rsatdi.» · buzish + terminal
4. **Xulosa: ==har shartga chegara testi== — chegarasiz testlar bu xatoni ko'rmaydi**
   Ovoz: «Xulosa: har shartning chegarasiga alohida test yozing: birinchi, oxirgi va yagona sahifa. Faqat o'rtadagi sahifani sinasangiz, bu xato yashirin qoladi. Kichik va kichik yoki teng farqi faqat chegarada ko'rinadi.»
- Manba: `order-bot` `keyboards.ts` 18–22; `jest1v2-out/09-catalogKeyboard-pass.txt`, `10-chegara-fail.txt`.

## 16 · Tekshiruv 3 — `page <= pages - 1`  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **Faqat ikki test bor: «birinchi sahifa» va «o'rtadagi sahifa». Kodda `page <= pages - 1` yozildi. `npm test` nima deydi?**
- Material (`above`): kod `keyboards.ts` 21–22 buzilgan holda (`if (page <= pages - 1)`); ostida ikki test nomi: `✓ birinchi sahifada ◀ yo'q` (`0, 3`) · `✓ o'rtada ikkalasi bor` (`1, 3`).
- Ovoz: «Chegarani ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Faqat ikki test bor: birinchi sahifa va o'rtadagi sahifa. Kodda kichik yoki teng yozildi, ya'ni oxirgi sahifada ham o'ng strelka chiqadi. Npm test nima deydi? Variantni tanlang.»
- Variantlar (to'g'risi — 1): 1 Ikkalasi PASS — xato faqat oxirgi sahifada · 2 Ikkalasi FAIL — strelka qoidasi buzildi · 3 «o'rtadagi sahifa» FAIL — u ▶ ni ikki marta oladi · 4 TypeScript xato — `<=` bu yerda ishlamaydi
- To'g'ri (ovoz): «To'g'ri. Birinchi va o'rtadagi sahifada o'ng strelka baribir bor, xato faqat oxirgi sahifada ko'rinadi. Sinab ko'rdik: to'rt test bilan ikkitasi qizardi, oxirgi va yagona sahifa. Bu ikkisi bo'lmasa, test yashil, xato esa kodda. Demak, yashil test faqat sinalgan vaziyatlar haqida gapiradi.» · qisqa: «Ikkala test chegarada emas — PASS. Xatoni faqat oxirgi va yagona sahifa testlari ushlaydi.»
- Isbot (`after`): terminal `10`: `✓ birinchi sahifada ◀ yo'q` · `✓ o'rtada ikkalasi bor` · `✕ oxirgi sahifada ▶ yo'q` · `✕ bitta sahifa — faqat 1/1`.
- Demak: «Yashil test faqat sinalgan vaziyatlar haqida gapiradi.»
- Xato izohlari: 2 — «Birinchi sahifada ▶ to'g'ri chiqadi — xato u yerda ko'rinmaydi.» · 3 — «O'rtada ▶ baribir bor — `<` ham, `<=` ham bir xil natija beradi.» · 4 — «`<=` — to'g'ri TypeScript; xato mantiqda.»
- Maslahat: «`<` va `<=` qaysi `page` qiymatida har xil natija beradi? O'sha qiymat testlarda bormi?»
- Manba: `jest1v2-out/10-chegara-fail.txt`.

## 17 · Amaliyot 2 — `keyboards.spec.ts` va bitta buzish  ← `Practice`
- Kicker: `Amaliyot 2 / 3` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **Admin tugmalari va katalog uchun testlar yozing, keyin kodni bir marta buzib qizilni ko'ring** · `tableAt: 3`
1. **Endi siz: ==`keyboards.spec.ts`== — statuslar va katalog chegarasi**
   Ovoz: «Endi navbat sizga. Keyboards uchun test faylini yozasiz: admin tugmalari va katalog sahifalari. Ekrandagi testlarni nusxalamang, o'zingiz yozing: etalonni har safar o'zingiz o'ylab chiqasiz. O'n besh daqiqa ketadi.»
2. **1–2-qadam: ==har status va to'rt sahifa== uchun test; hammasi yashil**
   Ovoz: «Birinchi qadamda order keyboard uchun har statusga test yozasiz. Ikkinchisida catalog keyboard uchun birinchi, oxirgi va yagona sahifa testlari. Npm test keyboards: hammasi yashil bo'lishi kerak.»
3. **3–4-qadam: kodni ==ataylab buzing==, qizilni ko'ring va tiklang; isbot — qizil test nomi**
   Ovoz: «Uchinchi qadamda keyboards faylida bitta shartni buzing: bekor qilingan status yoki kichik yoki teng. Qaysi test qizarganini ko'ring. To'rtinchisida kodni git checkout bilan tiklang. Isbot maydoniga qizargan test nomini yozing.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz har status va chegaraga test yozasiz va uning xatoni ushlashini o'zingiz isbotlagansiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | `orderKeyboard` | `src/api/telegram/keyboards.spec.ts` — `NEW`, `CONFIRMED`, `DELIVERED` / `CANCELLED` · `npm test -- keyboards` | 3 ta `✓` |
  | 2 | `catalogKeyboard` | birinchi · oxirgi · yagona sahifa (`0, 3` · `2, 3` · `0, 1`) | `Tests: … passed` |
  | 3 | Buzish | `keyboards.ts` 39-satrdan `o.status === 'CANCELLED'` shartini o'chiring yoki 21-satrda `<` → `<=` · `npm test -- keyboards` | `✕ oxirgi sahifada ▶ yo'q` yoki `✕ yetkazilgan va bekor qilingan — tugma yo'q` |
  | 4 | Tiklash | `git checkout -- src/api/telegram/keyboards.ts` · `npm test` | hammasi `✓` |
- Isbot: «3-qadamda qizargan (✕) testning nomi — buyruq emas» · placeholder: «masalan: oxirgi sahifada ▶ yo'q» · KOD: `/(bekor|oxirgi|bitta|yagona|cancel)/i` · xato: «Bu yerga buyruqni emas, terminalda ✕ belgisi yonidagi test nomini yozing, masalan: oxirgi sahifada ▶ yo'q.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `toBe` bilan `serializes to the same string` | massiv — `toEqual` (13-ekran) |
  | Etalonda `hide: false` yo'q — FAIL | Telegraf qo'shadi: faqat `text` va `callback_data`ni ajrating yoki `toMatchObject` |
  | 3-qadamda hammasi `✓` | buzgan shartingizga test yo'q — o'sha vaziyatga test qo'shing (16-ekran) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `jest1v2-out/07–10`, `06b` · KOD 2 (04.11): yordamchisiz `b.callback_data` — TS xato bermadi, PASS (`22-ts-callback-data.txt`) → jadvaldan olib tashlandi.

---

## 18 · AI ikki to'plam yozdi — ikkalasi yashil  ← `Lesson`
- Kicker: `5-bosqich · AI testi` · Sarlavha: **Yangi ko'nikma: AI yozgan testni qabul qilish — avval ikki AI tajribasi**
- Sahna: 1-segmentda bosqich kirishi (F-1104-15): ikki karta — «1–4-bosqich · testni siz yozdingiz» (xira) → «5-bosqich · testni AI yozadi, siz qabul qilasiz» (yonadi); 2-segmentdan tepada prompt kartasi: «src/api/telegram/texts.ts va keyboards.ts uchun jest testlar yozib ber. npm test yashil bo'lsin.»; ostida ikki AI javobi kartasi yonma-yon (`AiReply`, «namuna»): Opus — `2 files changed, 290 insertions(+)` · «36 test, hammasi o'tdi» · parcha `const norm = (s: string) => s.replace(/[\u00a0 ]/g, ' ');` · Haiku — `2 files changed, 304 insertions(+)` · «33 test o'tdi» · parcha `` expect(t).toContain(`Jami: ${som(50000)}`); ``.
1. **Yangi bosqich, yangi ko'nikma: ==testni AI yozadi, siz uni qabul qilasiz==**
   Ovoz: «Endi yangi bosqich boshlanadi va u boshqa ko'nikma. To'rt bosqichda testni o'zingiz yozdingiz va FAIL'ni o'qishni o'rgandingiz. Ishda esa testni ko'pincha AI yozadi. Sizning ishingiz endi yozish emas, qabul qilish: AI yozgan test haqiqatan xatoni ushlaydimi. Buni ikki xil AI bilan haqiqiy tajribada ko'ramiz.» · bosqich kartasi
2. **Prompt bitta gap: ==«test yozib ber, yashil bo'lsin»== — mentor odatda shunday yozadi**
   Ovoz: «Tajriba bunday edi. Biz ikki xil AI'ga bir xil oddiy prompt berdik: texts va keyboards uchun jest testlar yozib ber, npm test yashil bo'lsin. Ataylab qisqa, chunki mentor ko'pincha shunday yozadi. Har AI loyihaning alohida nusxasida ishladi.» · prompt
3. **Ikkalasi ==faqat ikki test fayl qo'shdi==, kodga tegmadi: 36 va 33 test, hammasi yashil**
   Ovoz: «Natija yaxshi ko'rinadi. Ikkalasi faqat ikkita test fayl qo'shdi, kodga tegmadi, git diff stat buni tasdiqlaydi. Birinchisi o'ttiz olti, ikkinchisi o'ttiz uchta test yozdi, hammasi yashil. Ikkalasi bo'linmas probelni ham o'zi sezdi.» · diff-stat
4. **Lekin probelni ==ikki xil hal qildi==: biri almashtiradi, biri ko'rinmas belgini qo'ydi**
   Ovoz: «Lekin probelni ikki xil hal qildi. Birinchisi solishtirishdan oldin bo'linmas probelni oddiysiga almashtiradi va yana bir belgi haqida yozdi: Node versiyasiga qarab u boshqa belgi bo'lishi mumkin. Bizdagi Node'da bunday emas, sinab ko'rdik. Ikkinchisining etalonida esa ko'rinmas belgining o'zi turibdi, yettinchi ekrandagi tuzoq.» · parchalar
5. **Xulosa: ==«hammasi yashil» — tekshiruv emas==; testning o'zini tekshirish kerak**
   Ovoz: «Xulosa: ikki AI ham va'dasini bajardi, testlar yashil. Lekin yashil test yaxshi test degani emas. AI aytgan gapni ham tekshiramiz. Testning o'zi xatoni ushlaydimi, buni bilishning bitta ishonchli usulini keyingi ekranda ko'rasiz.»
- Manba: `jest1v2-ai/00-promptlar.md`, `ai1/diff-stat.txt`, `ai2/diff-stat.txt`, `ai1/texts.spec.ts` 4–7 (`norm`, U+202F haqidagi gapi — tekshirilmagan), `ai2/texts.spec.ts` 33 (`302 240`), `XULOSA.md`; U+202F — `jest1v2-out/03` (Node 24.18 ru-RU → `00a0`).

## 19 · Buzib tekshirish: 36 test nimani sezmadi  ← `Lesson`
- Kicker: `5-bosqich · ichida` · Sarlavha: **Test to'plamini kodni buzib tekshiramiz: qizarmasa — o'sha buzilish himoyasiz**
- Sahna: buzish jadvali (`jest1v2-ai/XULOSA.md` dan), qatorlar galma-gal: | Buzish | Men (10) | Opus (36) | Haiku (33) | — B1 `som` en-US: 1 · 8 · 1 · B2 savat qatorida hozirgi narx: **0** · 1 · 1 · B3 `CANCELLED` da tugma: 1 · 1 · 1 · B4 oxirgi sahifada ▶: 2 · 3 · 3 · B5 status matni o'zgardi: **0** · **0** · 1 (0 — qizil fon); 3-segmentda Opus testi: `it('har bir status uchun matn bor', …)` · `for (const s of all) expect(STATUS_UZ[s]).toBeTruthy();`.
1. **Usul oddiy: ==kodni ataylab buzing== va nechta test qizarganini sanang**
   Ovoz: «Usul oddiy: kodni ataylab buzing va nechta test qizarganini sanang. Bitta ham qizarmasa, o'sha buzilish himoyasiz. Biz beshta buzish oldik: narx formati, savatdagi narx, bekor qilingan buyurtma tugmasi, oxirgi sahifa va status matni. Uchala to'plamni sinadik.» · jadval sarlavhasi
2. **Bizning ==o'n testimiz ikki buzilishni sezmadi==: matnlarni sinamaganmiz**
   Ovoz: «Avval o'zimiznikini tan olamiz. Bizning o'nta testimiz ikki buzilishni sezmadi: savatdagi narx va status matni. Sababi oddiy: texts faylidan faqat som'ni sinaganmiz. Test yo'q joy himoyasiz.» · «Men» ustuni
3. **36 test ==status matni o'zgarganini sezmadi==: `toBeTruthy` faqat «bormi» deydi**
   Ovoz: «O'ttiz olti testli to'plam ham status matni o'zgarganini sezmadi. Uning testi faqat har status uchun qandaydir matn borligini tekshiradi, to be truthy bilan. Matn o'zgarsa ham test yashil. Ikkinchi to'plamda esa som buzilganda o'ttiz uchdan faqat bittasi qizardi: etaloni koddan olingan testlar.» · Opus testi
4. **Xulosa: ==test soni sifat emas== — qaysi buzilishni ushlashi sifat**
   Ovoz: «Xulosa: test soni sifat emas. O'ttiz olti test ham bitta buzilishni o'tkazib yubordi. Sifat — test qaysi buzilishni ushlashi. AI test yozgandan keyin uch to'rt joyda kodni buzib ko'ring. Qizarmagan joyga test qo'shing.»
- Manba: `jest1v2-ai/mutatsiya.txt` (skript `jest1v2-mutatsiya.sh`, aynan), `ai1/texts.spec.ts` 41–46.

## 20 · Tekshiruv 4 — `toBeTruthy`  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **AI testi: `expect(STATUS_UZ.CANCELLED).toBeTruthy()`. Kimdir matnni «Bekor qilingan» dan «Yangi» ga o'zgartirdi. Test nima deydi?**
- Material (`above`): kod `ai1/texts.spec.ts` 41–46 (`describe('STATUS_UZ')` · `it('har bir status uchun matn bor', …)` · `toBeTruthy()`); ostida `texts.ts` 9-satr buzilgan: `CANCELLED: '🆕 Yangi',`.
- Ovoz: «Buzib tekshirishni ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. AI testi bekor qilingan status matnini to be truthy bilan tekshiradi. Kimdir matnni xato bilan yangi deb o'zgartirdi: mijoz bekor qilingan buyurtmasini yangi deb ko'radi. Test nima deydi? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 FAIL — `toBeTruthy` matn o'zgarganini sezadi · 2 PASS — `toBeTruthy` faqat bo'sh emasmi deydi · 3 TypeScript xato — status matni turi o'zgardi · 4 FAIL — ikki status endi bir xil matnda
- To'g'ri (ovoz): «To'g'ri. To be truthy faqat qiymat bo'sh emasligini tekshiradi. Yangi degan matn ham bo'sh emas, shuning uchun test yashil. Mijoz esa noto'g'ri status ko'radi. Etalonni aniq yozsangiz, test qizaradi. Demak, to be truthy qiymat borligini tekshiradi, to'g'riligini emas.» · qisqa: ««Yangi» matni ham bo'sh emas — PASS. Statusning to'liq matnini kutgan aniq `toBe` buni ushlaydi.»
- Isbot (`after`): terminal `25-b5-cancelled.txt`: `CANCELLED: '🆕 Yangi'` · 1-AI to'plami `Tests: 36 passed, 36 total` · 2-AI to'plami `1 failed` (aniq etalon `toBe('❌ Bekor qilingan')`).
- Demak: «`toBeTruthy` qiymat borligini tekshiradi, to'g'riligini emas.»
- Xato izohlari: 1 — «`toBeTruthy` matnni etalon bilan solishtirmaydi — faqat bo'sh emasmi.» · 3 — «Ikkalasi ham `string` — turi o'zgarmadi.» · 4 — «Fayl joyi va nomi o'zgarmadi.»
- Maslahat: «`toBeTruthy` qaysi qiymatlarda FAIL beradi? «Yangi» matni shulardan birimi?»
- Manba: `jest1v2-ai/ai1/texts.spec.ts` 41–46, `ai2/texts.spec.ts` 53–56, `mutatsiya.txt`.

## 21 · Amaliyot 3 — AI test yozadi, siz buzib tekshirasiz  ← `Practice`
- Kicker: `Amaliyot 3 / 3` · Eyebrow: `Hozir o'zingizda · 20 daqiqa` · Sarlavha: **O'z AI'ingizga aniq shartli prompt bering, keyin to'rt tekshiruv va uchta buzish** · `tableAt: 3`
1. **Endi siz: AI'ga ==shartlari aniq prompt== berasiz — `texts.ts` dagi buyurtma matnlari uchun**
   Ovoz: «Endi navbat sizga. O'z AI'ingizga test yozdirasiz, lekin bu safar shartlari aniq prompt bilan. Mavzu: texts faylidagi savat va buyurtma matnlari. Promptni pastdagi tugma bilan nusxalaysiz. Yigirma daqiqa ketadi.»
2. **1–2-qadam: prompt va ==diff — faqat `.spec.ts`==, etalonda `${…}` yo'q**
   Ovoz: «Birinchi qadamda promptni berasiz. Ikkinchisida natijani tekshirasiz: git diff stat'da faqat spec fayl bo'lsin, har it'da expect bo'lsin, etalonda dollar va qavs ichida funksiya chaqirilmasin.»
3. **3–4-qadam: ==uchta buzish== — hammasi qizarsin; isbot — qizarmagan buzish yoki «hammasi»**
   Ovoz: «Uchinchi qadamda kodni uch joyda navbat bilan buzasiz: narx formati, savatdagi narx va status matni. Har biridan keyin npm test, keyin git checkout. Qizarmagan joy bo'lsa, AI'dan o'sha joyga test so'rang. Isbot maydoniga natijani yozing.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz AI yozgan testni soniga qarab emas, buzib tekshirib qabul qilasiz.»
- Prompt (nusxalash, M45 dagi TgPg «besh qismli prompt» qolipida): «Loyiha: OrderBotNest (NestJS + Telegraf), Jest sozlangan, testlar `src/` ichida `*.spec.ts`. Vazifa: `src/api/telegram/texts.ts` dagi `texts.cart`, `texts.orderPlaced`, `texts.orderLine` va `STATUS_UZ` uchun unit-testlar yoz. Shartlar: etalonni qo'lda yoz — `som()`, `STATUS_UZ` yoki boshqa sinalayotgan kodni etalonda ishlatma; bo'linmas probelni `\u00a0` bilan ochiq yoz; `toBeTruthy` bilan matn tekshirma — aniq qiymat yoz; har `it` da kamida bitta `expect`. Tegma: `src/` dagi `.spec.ts` dan boshqa fayllarga. Javobda: qo'shilgan fayllar ro'yxati va `npm test` natijasi.» — ⚠ KOD 5: shu prompt ikki AI bilan haqiqiy yurgiziladi, natija `jest1v2-ai/p2/`.
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Prompt | yuqoridagi prompt — o'z AI'ingizga · `npm test` | `PASS` |
  | 2 | To'rt tekshiruv | `git diff --stat` — faqat `.spec.ts` · har `it`da `expect` · etalonda `${som(` yoki `${STATUS_UZ` yo'q · `grep -c 'u00a0' src/api/telegram/texts.spec.ts` — 0 dan katta (escape matni bor) | 4 ✓ |
  | 3 | Uch buzish | `texts.ts`: `'ru-RU'` → `'en-US'` · `(i.price ?? i.product.price)` → `i.product.price` · `'❌ Bekor qilingan'` → `'🆕 Yangi'` — har biridan keyin `npm test` va `git checkout -- src/api/telegram/texts.ts` | har biri `✕` |
  | 4 | Qizarmagan joy | AI'ga: «<buzish> ni hech bir test ushlamadi — shu qoidaga test yoz» · 3-qadamni qaytaring | uchalasi `✕` |
- Isbot: «Uch buzishning natijasi» · placeholder: «masalan: uchalasi qizardi · yoki: savatdagi narx — avval qizarmadi, test qo'shdim» · KOD: `/(qizar|fail|✕|uchala|hammasi|test qo'sh)/i` · xato: «Har buzishdan keyin `npm test` natijasini yozing.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `git diff --stat` da `texts.ts` ham bor | AI kodni o'zgartirdi — `git checkout -- src/api/telegram/texts.ts`, promptdagi «Tegma» bandini takrorlang |
  | Etalonda `${som(…)}` qoldi | AI shartni bajarmadi — o'sha satrlarni qo'lda yozing (10-ekran) |
  | AI «`\u00a0` bilan ochiq yozdim» dedi, `grep -c 'u00a0'` → `0` | faylda ko'rinmas belgining o'zi — ikkala AI'da ham shunday chiqdi (`p2/XULOSA`); qatorlarni qo'lda `\u00a0` bilan yozing, keyin `npm test` |
  | Savatdagi narx buzilishida hammasi `✓` | `price` (buyurtma paytidagi narx) va `product.price` har xil bo'lgan test yo'q — ikkalasini farqli qilib test so'rang |
  | `sed` yoki tahrirdan keyin fayl o'zgarmadi | qo'lda tahrir qiling va saqlang (VS Code'da nuqta — saqlanmagan) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `jest1v2-ai/p2/` — shu prompt ikki AI bilan (04.11): ikkalasi faqat `texts.spec.ts` qo'shdi (17 va 12 test), `${som(` va `toBeTruthy` yo'q, uch buzishning uchalasi qizardi (1-AI: 11 · 1 · 5 · `CANCELLED` 3; 2-AI: 7 · 1 · 3 · 3 — `mutatsiya-p2.txt`, `mutatsiya-p2-haiku-toza.txt`); ikkalasining javobi «`\u00a0` bilan ochiq yozdim» degan, faylda esa escape matni 0, ko'rinmas belgi 17 va 13 (`grep`); `jest1v2-mutatsiya.sh` (`sed` qatorlari).

---

## 22 · Sinfga tayyorgarlik: m4b-01 xaritasi  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Eyebrow: `m4b-01 · «Unit-test: Jest»` · Sarlavha: **O'quvchi darsi: KitobShop sayti, bitta `orderTotal` funksiyasi va Jestbot — siz bilgan yo'lning kichik varianti**
- Sahna: ikki karta yonma-yon: «O'quvchi (m4b-01)» — 21 ekran, KitobShop `orderTotal(price, quantity)` → `src/order.ts` + `src/order.spec.ts`, Jestbot (robot) metaforasi, uyga vazifa `deliveryFee` · «Siz (bugun)» — OrderBotNest, `som`, `orderKeyboard`, `catalogKeyboard`, AI testi va buzib tekshirish; 3-segmentda «O'quvchi aytadi → siz bilasiz» lug'ati; 4-segmentda «Siz qo'shasiz» jadvali.
1. **m4b-01 — 21 ekran: ==KitobShop sayti==, `orderTotal` — narx ko'paytirish son**
   Ovoz: «Endi sinfga tayyorgarlik, ikki ekran. O'quvchi darsi m4b-01, yigirma bir ekran. Misol — KitobShop sayti: order total funksiyasi narxni songa ko'paytiradi. Ya'ni bot emas, sayt. Lekin describe, it va expect xuddi bugungidek, chunki test faqat funksiyani chaqiradi.»
2. **O'quvchi darsi ==Jestbot robot== misolida tushuntiradi — siz so'zni atamasi bilan aytasiz**
   Ovoz: «O'quvchi darsi testni robot misolida tushuntiradi, robotning ismi Jestbot. Robot papkasi bu describe, sinov varaqasi bu it, etalon kartochkasi bu expect. Sinfda ikkalasini birga ayting: etalon kartochkasi, ya'ni expect, va o'sha satrni ko'rsating.» · lug'at
3. **Siz qo'shasiz: ==haqiqiy FAIL, kim xato, chegara va buzib ko'rish==**
   Ovoz: «Darsga siz qo'shadigan narsalar: o'quvchi darsi natijani kartochkada ko'rsatadi, siz proyektorda haqiqiy FAIL'ni o'qib bering. Har FAIL'da savol bering: kim xato, kodmi yoki etalonmi. Uyga vazifadagi delivery fee'da aynan chegara qiymatini sinattiring. Test yashil bo'lsa, kodni bir marta buzdiring.» · jadval
   | Siz qo'shasiz | Qayerda |
   |---|---|
   | haqiqiy FAIL o'qish: `●` → `Expected` / `Received` → `>` satr | s13 «FAIL» |
   | «kim xato: kodmi, etalonmi?» | s13, s16 noto'g'ri etalon |
   | etalon qo'lda — `orderTotal` etalonda chaqirilmasin | s15 AI testlari |
   | chegara: aynan 100 000 | uyga vazifa `deliveryFee` |
   | yashil bo'lsa — bir marta buzdirish | amaliyot oxiri |
4. **Xulosa: amaliyot oldidan — ==test `src/` ichida, nomi `.spec.ts`==, `npm install` qilingan**
   Ovoz: «Xulosa: amaliyot oldidan uch narsani tekshiring. Repo npm install bilan o'rnatilgan, test fayli src ichida, nomi spec ts bilan tugaydi. Vaqt bo'yicha taklif: to'qson daqiqaning yigirma beshi amaliyotga, chunki sozlashda vaqt ketadi.»
- Manba: `src/4b-Modull/JestUnitTestLesson.jsx` — `SCREEN_META` (21), Screen2/9/12/13/15/16, amaliyot ro'yxati, `HW_V2`; v1 21–22-ekran (01.11 da o'quvchi darsidan aynan tekshirilgan) — ⚠ KOD 6: s-raqamlari qurishda qayta solishtiriladi.

## 23 · O'quvchilar xato qiladigan joylar va savollari  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Sarlavha: **Beshta vaziyat va tayyor javoblar — to'rttasini bugun o'zingiz ko'rdingiz**
- Sahna: 5 karta (vaziyat · xabar · yechim) segment bilan yonadi; pastda «O'quvchi so'rasa» — 5 ochiladigan karta (ovozsiz).
- Kartalar:
  | # | Vaziyat | Xabar | Yechim |
  |---|---|---|---|
  | 1 | Test topilmadi | `No tests found, exiting with code 1` · `testRegex … 0 matches` | `src/` ichida, nomi `.spec.ts` |
  | 2 | O'quvchi reposida `npm ci` yiqildi | `npm ci can only install packages when … in sync` · `Missing: @nestjs/jwt … from lock file` | `npm install` — repo lock fayli sinxron emas |
  | 3 | Yolg'on yashil | `PASS`, lekin `expect` yo'q yoki etalon koddan | har `it`da `expect`; etalon qo'lda |
  | 4 | Bir xil ko'rinadi, lekin FAIL | `Expected` = `Received` ko'rinishda · yoki `serializes to the same string` | ko'rinmas belgi (`\u00a0`) · massivga `toEqual` |
  | 5 | Nest bo'lmagan bo'sh loyiha | `Must use import to load ES Module` → `Cannot find name 'describe'` → TypeScript 7 `does not expose …` | o'quvchi reposida yozdirish; bo'sh loyihada: `npx ts-jest config:init`, `@types/jest`, `typescript@5` |
- O'quvchi so'rasa:
  - «Test kodni tuzatadimi?» → yo'q, faqat xabar beradi; tuzatish — sizniki.
  - «Darsda `npm i -D jest ts-jest` bor — o'rnatsam buziladimi?» → Nest reposida jest allaqachon bor; buyruq faqat kichik versiyaga ko'taradi, testlar yashil (sinalgan).
  - «Jest faqat Nest uchunmi?» → yo'q, istalgan JavaScript/TypeScript loyihasi; Nest'da tayyor sozlangan.
  - «AI testni yozsa bo'ladimi?» → ha; keyin to'rt tekshiruv va kamida bitta buzish (19-ekran).
  - «`toBe` va `===` farqi?» → `toBe` ham `Object.is` bilan solishtiradi, lekin natijani PASS yoki FAIL qilib xabar beradi.
1. **Sinfda albatta chiqadigan beshta vaziyat — ==to'rttasi bugun sizda ham chiqdi==**
   Ovoz: «Endi o'quvchi darsida albatta chiqadigan beshta vaziyatni ko'ramiz. To'rttasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman. Beshinchisi o'quvchi reposiga xos.»
2. **Topilmadi va `npm ci` — ==joy, nom va `npm install`==**
   Ovoz: «Birinchisi no tests found: fayl joyi va nomini tekshiring. Ikkinchisi o'quvchi reposiga xos: npm ci yiqiladi, chunki package json va lock fayl sinxron emas. Npm install qiling. Bu repo kamchiligi, o'quvchining xatosi emas.» · 1–2-karta
3. **Yolg'on yashil va bir xil ko'ringan FAIL — ==`expect`, qo'lda etalon, `toEqual`==**
   Ovoz: «Uchinchisi: test yashil, lekin expect yo'q yoki etalon koddan olingan. To'rtinchisi: qatorlar bir xil, test qizil: ko'rinmas belgi yoki massivni to be bilan solishtirish. Beshinchisi bo'sh loyiha: eng tez yo'l testni o'quvchi reposida yozdirish.» · 3–5-karta
4. **Xulosa: o'quvchi «AI yozdi, yashil» desa — ==bitta joyni buzdiring==**
   Ovoz: «Xulosa va usul: o'quvchi AI test yozdi, hammasi yashil desa, kodda bitta joyni o'zi buzsin va test qizarishini ko'rsin. Javobni darhol aytmang, terminaldagi xabarni birga o'qing. Pastda o'quvchi savollariga tayyor javoblar bor.» · QA
- Manba: `jest1-out/01-clone-install.txt` (`npm ci`), `11-npm-i-jest-nestda.txt`, `12…15` (bo'sh loyiha zanjiri, 01.11 — o'quvchi reposi `IntroNestArxitechture`); `jest1v2-out/01`, `02`, `05`, `06`, `06b`.

## 24 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | `package.json`: `rootDir: "src"`, `testRegex: ".*\\.spec\\.ts$"`. Fayl `src/order.test.ts`. `npm test`? | `No tests found` — nomi `.spec.ts` emas · `PASS` — Jest `.test.ts` ni ham oladi · `Cannot find module` — order topilmadi · `PASS` — `rootDir: src` bo'lgani yetadi | 1 | Nomi `.spec.ts` emas. | 3 |
  | 2 | `Expected: "120 000 so'm"` · `Received: "120 000 so'm"` — test FAIL. Birinchi qadam? | Jest'ni qayta o'rnatib, yana yurgizish · Belgilar kodini chiqarib solishtirish · Testni o'chirib, qo'lda tekshirib ko'rish · `toBe` o'rniga `toBeTruthy` qo'yish | 2 | `toBe` belgi-belgi solishtiradi: U+00A0. | 7 |
  | 3 | `it` ichida faqat `console.log(som(120000))`. Natija? | FAIL — `expect` yo'qligi xato sanaladi · `No tests found` — bo'sh `it` sanalmaydi · PASS — Jest hech narsani solishtirmadi · `SyntaxError` — testda `console.log` taqiq | 3 | Xatoni faqat `expect` tashlaydi. | 9 |
  | 4 | Etalon: `` `Jami: ${som(100000)}` ``. `som` buzildi. Test? | FAIL — `som` buzilgani darhol sezildi · TypeScript xato — shablon satr noto'g'ri · `Cannot find module` — `som` import bo'lmadi · PASS — etalon ham u bilan birga buzildi | 4 | Etalon qo'lda yoziladi. | 10 |
  | 5 | `expect(buttons).toBe([['◀', '1/3']])` — massivlar bir xil, lekin FAIL. Sabab? | `toBe` bitta obyektni kutadi — `toEqual` kerak · Massivdagi strelka belgisi boshqa kodda · Jest eskirgan — massivni solishtira olmaydi · Emoji'lar massivda boshqacha saqlanadi | 1 | `serializes to the same string`. | 13 |
  | 6 | Testlar faqat birinchi va o'rtadagi sahifani sinaydi, kodda `<=` xato. Natija? | Ikkalasi FAIL — `<=` hamma sahifani buzadi · Ikkalasi PASS — xato chegarada yashirin · O'rtadagisi FAIL — u ▶ ni ikki marta oladi · TypeScript xato — `<=` sonlar uchun emas | 2 | Yashil test faqat sinalgan vaziyat haqida. | 16 |
  | 7 | AI 36 test yozdi, hammasi yashil. Qabul qilishdan oldin eng ishonchli tekshiruv? | Test sonini sanab, 30 dan ko'pligini ko'rish · Testlarni qayta yurgizib, yana yashil ko'rish · Kodni 3 joyda buzib, test qizarishini ko'rish · AI'dan «hammasini tekshirdingmi» deb so'rash | 3 | Son emas — ushlagan buzilish. | 19 |
  | 8 | `expect(STATUS_UZ.CANCELLED).toBeTruthy()`, matn «Yangi» ga o'zgardi. Test? | FAIL — matn «bekor» emas, «yangi» bo'ldi · `No tests found` — `STATUS_UZ` topilmadi · TypeScript xato — matn turi o'zgardi · PASS — `toBeTruthy` faqat bo'sh emasmi | 4 | `toBeTruthy` — bormi, to'g'rimi emas. | 20 |
- `passed = ball ≥ 6 && 3 amaliyot isbot bilan`.

## 25 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13.
- Xulosa 6 band:
  1. Unit-test — bitta funksiya va bitta qoida; Telegram, baza va `.env` kerak emas — bot ham, sayt ham bir xil sinaladi. Smoke — «ishlayaptimi», unit-test — «shu qoida buzilmadimi».
  2. Jest: `rootDir: src`, `testRegex: .spec.ts` — fayl sinaladigan faylning yonida; `No tests found` — joy va nom.
  3. FAIL: `●` → `Expected` / `Received` → `>` satr va raqam; bir xil ko'rinsa — ko'rinmas belgi (`\u00a0`) yoki massivni `toBe` bilan solishtirish (`toEqual`).
  4. Yolg'on test ikki xil: `expect` yo'q · etalon koddan olingan; `toBeTruthy` — bormi, to'g'rimi emas.
  5. Har status — bitta test; har shartga chegara testi: birinchi, oxirgi, yagona.
  6. AI testini qabul qilish: diff faqat `.spec.ts` · har `it`da `expect` · etalon qo'lda · **kodni buzib, test qizarishini ko'rish**. Sinf: m4b-01 — haqiqiy FAIL, «kim xato», chegara, bir marta buzdirish.
- **Uyga vazifa** (M14, M30): «OrderBotNest'ning o'z nusxangizda buyurtma matnlari uchun testlar yozing: buyurtma qabul qilindi xabari, admin ro'yxati qatori va status o'zgargani haqidagi xabar. Muhim qoida: xabarda buyurtma paytidagi narx chiqadi, mahsulotning hozirgi narxi emas — bunga alohida test. AI bilan yozsangiz ham bo'ladi. Keyin to'rtta buzish qiling va har birida qaysi test qizarganini README'ga jadval qilib yozing. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | O'z nusxa | Telegraf+PG darsidagi o'z reposingiz · `git checkout -b tests` (yoki `jest1-start` dan) | — |
  | 2 | Testlar | `texts.spec.ts` ga: `texts.orderPlaced`, `texts.orderLine`, `texts.statusChanged`, `texts.customerStatus` · narx qoidasi: `price` va `product.price` har xil bo'lgan buyurtma | `PASS` |
  | 3 | To'rt buzish | `som` formati · `i.price ?? i.product.price` → `i.product.price` · `STATUS_UZ` matni · o'zingiz tanlagan bitta joy — har biridan keyin `npm test`, `git checkout` | har biri `✕` |
  | 4 | README | «Testlar» bo'limi: buzish → qizargan test nomi (4 qator); AI bilan yozgan bo'lsangiz — AI qaysi shartni bajarmadi va siz qanday ushladingiz | — |
  | 5 | Topshirish | `git add . && git commit -m "texts testlari"` · `git push` → repo linki platformadagi uyga vazifaga | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi qaraydi: etalonlar qo'lda (`${som(` yo'q) · narx qoidasi testi bor · README jadvalida 4 buzish va har biri qizargan.
- **Eslatma:** Jest sozlamasi (`rootDir`, `testRegex`) · test fayli namunasi · FAIL o'qish tartibi · bo'linmas probel va `\u00a0` · `toBe` / `toEqual` · ikki xil yolg'on test · statuslar va chegara testlari · AI testiga to'rt tekshiruv va buzib tekshirish · 21-ekran prompti (nusxalash) · xatolar jadvali · sinfga tayyorgarlik · o'z uyga vazifangiz.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **Jest: edge cases va xato yo'li** — `toThrow`, Service'ni mock bilan sinash va saytning API'siga birinchi HTTP test».

---

## «KOD» — qurishda

**Qurishdan OLDIN yurgiziladi — ✅ 04.11 hammasi (push'dan tashqari):**
1. ✅ 04.11 `drive-jest1v2.sh` → `jest1v2-out/00…14` (+ `06a`, `06b`) · AI tajribasi `jest1v2-ai/` (Opus, Haiku) · buzib tekshirish `jest1v2-mutatsiya.sh` → `mutatsiya.txt`.
2. ✅ 04.11 `drive-jest1v2-kod.sh` → `20-git-checkout-xatolar.txt` (`pathspec 'jest1-start' did not match` · `would be overwritten by checkout` — haqiqiy), `21-import-xato.txt` (`Cannot find module './texts' from 'api/texts.spec.ts'`), `22-ts-callback-data.txt` (TS xato bermadi — 17-ekran qatori olib tashlandi).
3. ✅ 04.11 `23-linecheck-buzuq.txt` (buzilgan `som` bilan ham `✓`), `24-linecheck-tuzatilgan.txt` (tuzatilgandan keyin `✕`), fayl `orderplaced.spec.ts`; target 16-satr.
4. ✅ 04.11 `25-b5-cancelled.txt`: 1-AI 36 passed (sezmadi) · 2-AI 1 failed.
5. ✅ 04.11 `jest1v2-ai/p2/` (2 agent, ruxsat bilan; bir agent nusxasiga men bexosdan qo'llagan `sed` o'lchovi ifloslandi — toza nusxada qayta o'lchandi, `mutatsiya-p2.txt` da qayd).
6. ✅ 04.11 m4b-01 `SCREEN_META` 21 (s0–s17 + practice, podium, sflash): s13 FAIL (`Expected 20000, Received 10002`), s15 «AI 5 ta test yozdi» (yolg'on test ovchisi), s16 etalon kartochkasi, `HW_V2` `deliveryFee` — 22-ekran jadvali mos.
7. ✅ 04.11 lokal teglar `jest1-start` f2eca2f · `jest1-done` 9d6b947 (`npm test` 10/10, `tsc` toza); chiqishlar Prettier bilan qayta yurgizildi — repo fayli = `jest1v2-out/*.spec.ts`. ⚠ **push** — buyruq bilan.

**Qurish:**
1. Generator `dev/jest1-matn.py` v2 (`tgpg-matn.py` dan): MD yo'li `10-Jest1-mentor-v2.md`; `==…==`, `Demak:`, amaliyot jadvallari MD'dan, ovoz ≤ 60 so'z tekshiruvi.
2. Bo'laklar `jest1/parts/` yangidan (v1 bo'laklari git `5e3ea262` da, zaxira `dev/jest1-v1-parts-zaxira/`): `04-yordam.jsx` — OrderBotNest Explorer (`compact()`), `tsLine` / `termLine`, `AiReply` (TgPg dan), buzish jadvali, belgilar kodi qatori · `05-s01-s11.jsx` · `06-s12-s21.jsx` · `07-s22-s25.jsx`.
3. Kodli sahnalar M43: har segmentda bitta bo'lak (8–14 satr), haqiqiy satr raqamlari (`order-bot` va `jest1v2-out/*.spec.ts`), Prettier 80; natija kod tagida. Kod bo'laklari `dev/tgpg-kod.py` kabi generator bilan repo/teg fayllaridan.
4. Chiqishlar aynan: `jest1v2-out/`, `jest1v2-ai/`; scratchpad yo'li → `…/OrderBotNest/src`.
5. Isbotlar: 8 — `/Tests:\s+2 passed,\s+2 total/` · 17 — `/(bekor|oxirgi|bitta|yagona|cancel)/i` · 21 — `/(qizar|fail|✕|uchala|hammasi|test qo'sh)/i`.
6. LineCheck (11-ekran): KOD 3 dagi fayl satri → `target`; `fixed` da haqiqiy satr raqamlari.
7. `LESSON_ID` o'zgarmaydi (M44: ekranlar soni 26 → 25, saqlov o'zi boshidan).
8. Ovoz keshi — yangi matn bilan; Vercel qayta (memory `mentor-kurs-vercel`) — buyruq bilan.
9. ✅ 04.11 TgPg keyingi dars kartasi → «Jest: OrderBotNest'ga birinchi testlar» (`tgpg/parts/07-s25-s28.jsx` 226, MD 561; yig.sh — faqat TgPg o'zgardi, esbuild ✓, lint:jsx toza).

## Ochiq savollar ([GATE M]) — ✅ 04.11 foydalanuvchi: «1 xa · 2 xa 3 ta · 3 xa ishlat · 4 halol tavsiyang · 5 xa» → 4: buyurtma matnlari + narx qoidasi (telefon — Jest-2)
1. **Kurs tartibi:** bu dars Telegraf+PG dan keyin keladi (OrderBotNest `tgpg-done` ustida). Sayt ro'yxatida ham shunday (TgPg → Jest-1). Lekin TgPg ning yakun ekranidagi keyingi dars kartasi hozir «WebSocket» (04.11 GATE M). Kartani «Jest-1» ga o'zgartiraymi? Unda WebSocket va Webhook CI/CD dan keyin, ular ham OrderBotNest ustida.
2. **Uchta amaliyot:** v1 da 4 ta edi (`No tests found` amaliyoti olib tashlandi — 3–4-ekran va 8-ekran 1-qadami yetarli). Ma'qulmi?
3. **21-ekran prompti:** ikki AI bilan qayta haqiqiy yurgizaman (KOD 5, 2 agent, scratchpad nusxada — 1-tajribadagidek). Ruxsat berasizmi?
4. **Uyga vazifa:** buyurtma matnlari testlari + narx qoidasi + 4 buzish README'da, 40–60 daqiqa. Muqobil: telefon tekshiruvi (`PHONE` hozir `telegram.service.ts` ichida yashirin — test uchun alohida funksiyaga chiqarish kerak, bu Jest-2 ga mosroq). Qaysi biri?
5. **Hajm:** 25 ekran, ovoz ≈ 24 daqiqa, amaliyot 45–60 daqiqa — jami ≈ 1 s 10 – 1 s 25 daq. Ma'qulmi?
