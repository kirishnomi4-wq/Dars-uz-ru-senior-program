# Mentor kursi · Jest-2 «Xato yo'li: bot noto'g'ri kirishda to'g'ri buziladimi» — MD v2 (M41: avval mentor o'rganadi)

F-ID: F-1029-02 (Jest-2) · **F-1104-19** (qayta yozish) · Sana: 2026-11-04 · Holat: **QURILDI 04.11** (gates 12/13 — esbuild `@lesson/runtime`; til 0; emoji 0; sweep 25/25; M48 0·0) → ovoz → Vercel (foydalanuvchi 04.11: «to'g'ridan qurib chiqar» — MD tasdig'isiz, saytda ko'riladi) · Fidbek: qator yoniga `>> …`
Oldingi: `12-Jest2-mentor-v1.md` (01.11, avtopilot, o'quvchi m4b-03 `orderTotal` misolida, «o'quvchi» 63 marta) · **TASHLANADI**
Fayl (qayta quriladi): `src/mentor-kurs/JestEdgeMentorLesson.jsx` · bo'laklar `src/mentor-kurs/jest2/parts/` · dvigatel — umumiy `parts/01–02` · generator `dev/jest2-matn.py` (jest1-matn.py dan, M48 tekshiruvi ichida) · kod `dev/jest2-kod.py`
Qonun: `MENTOR_DARS_ETALON.md` M1–M48 · Haqiqiy chiqishlar: `manba/jest2v2-out/` (skript `manba/drive-jest2v2.sh`, toza muhit) · `manba/jest2v2-ai/` (2 AI tajribasi) · buzib tekshirish `manba/jest1v2-mutatsiya.sh` qolipida
Loyiha: **OrderBotNest** — teglar `jest2-start` (= `jest1-done` 9d6b947) · `jest2-done` (+ `phone.ts`, `phone.spec.ts`, `order.service.spec.ts`, `app.controller.spec.ts`, supertest) — push dars tayyor bo'lganda (ruxsat 04.11)

**v1 → v2 nima o'zgardi (F-1104-19):**
- Misol — OrderBotNest'ning o'z xato yo'llari: telefon raqami qoidasi (`PHONE`), `OrderService.place` (telefon yo'q · savat bo'sh · ombor yetmaydi), saytning `GET /` API'si. O'quvchi darsi (`orderTotal`, shumtaka, `applyCoupon`) — faqat 23-ekran.
- Dars boshida **umumiy tushuncha** (foydalanuvchi 04.11: «qisqa emas, umumiy tushuntirib, keyin darsga kirish»): happy path · edge case · error path — nima, nega, botda qayerda.
- Haqiqiy topilmalar: mijoz probel bilan yozgan raqamni bot rad etadi (`02`) · 9 ta nol ham «to'g'ri raqam» (`04`) · `toThrow` promise'dagi xatoda Jest jarayonini quladi — PASS ham, FAIL ham yo'q (`07`) · `await` unutilsa xabar noto'g'ri bo'lsa ham natija chiqmaydi (`08`) · `<` → `<=` buzilishini 4 test sezmaydi, chegara testi sezadi (`09`, `09c`) · `rejects` sinxron throw'da — FAIL (`06`).
- Saytning API'siga birinchi HTTP test (`supertest`) — Jest-1 dagi «saytni test qila olmayman» xavotirining ikkinchi javobi.
- M46 (ovoz papka · fayl · satrni aytadi), M47 (xato ekranida sabab bir gapda, ichida — yonma-yon), M48 (variant uzunligi) — boshidan.

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | Jest-1 ni o'tgan mentor: OrderBotNest'da `texts.spec.ts`, `keyboards.spec.ts` yozgan, FAIL'ni o'qiydi, yolg'on testni taniydi, buzib tekshiradi. `async`/`await` ni Nest darslaridan biladi. |
| Dars oxirida mentor | 1) happy path, edge case va error path farqini biladi va botda qayerda ekanini ko'rsatadi · 2) qoidani testdan chaqirish uchun alohida funksiyaga ajratadi (`isPhone`) · 3) `it.each` bilan chegara va noto'g'ri kirish testlarini yozadi · 4) bazasiz test uchun mock (`jest.fn`, `mockResolvedValue`) va `Test.createTestingModule` ishlatadi · 5) sinxron xato (`toThrow`) va promise xatosi (`rejects.toThrow`) farqini biladi, `await` unutilsa nima bo'lishini ko'rgan · 6) xato yo'lida «nima bo'lmasligi kerak»ni tekshiradi (`not.toHaveBeenCalled`) · 7) chegara testini yozadi va kodni buzib isbotlaydi · 8) saytning API'siga HTTP test yozadi (`supertest`) · 9) AI yozgan edge testlarni buzib tekshirib qabul qiladi · 10) sinfga: m4b-03 xaritasi |
| O'quvchi darsi (faqat 6-bosqich) | **m4b-03** «Edge cases va error path» (`src/4b-Modull/EdgeCasesTestLesson.jsx`, `SCREEN_META` 21): KitobShop `orderTotal`, shumtaka mijoz, guard (`if` → `throw` → `return`), `expect(() => …).toThrow()`, uyga vazifa `applyCoupon`. |
| Kursdagi o'rni | Jest-1 → **shu** → CI/CD-1 (test lentada) — M31: raqam yozilmaydi. |
| Til | M9 + M32. Atamalar inglizcha: happy path, edge case, error path, mock, promise, async, await, regex. «Chegara» — boundary (o'zbekcha qoladi, Jest-1 dagidek). Ovozda `rejects.toThrow` — «rejects to throw». |
| Misol-ip | **OrderBotNest** `jest1-done`: `src/api/telegram/telegram.service.ts` 12-satr `PHONE` → `phone.ts` (`isPhone`); `src/api/order/order.service.ts` 24–38 (`place`: ikki sinxron `throw`, bitta tranzaksiya ichidagi `throw`); `src/api/app.controller.ts` (`GET /` → `{ ok: true, service: 'order-bot' }`). Mijoz Aziza raqamni «+998 90 123 45 67» deb yozadi; Kolonka 50 000, omborda 1 ta / 2 ta. |
| AI | 2 tajriba (ruxsat 04.11, har darsda): bitta oddiy prompt (`jest2v2-ai/p1-prompt.txt`), `ai1` kuchli, `ai2` kuchsizroq model; 26.11 (F-1125-01, M56) — 2-topshiriq Jest tilida (`p2-prompt.txt`, o'sha ikki model, natija `p2/`); buzib tekshirish — `mutatsiya` qolipi. Ekranda «namuna — sizning AI'ingiz boshqacha yozadi». |
| Haqiqiylik (M10) | 04.11: Node 24.18 · jest 30.5.2 · ts-jest 29.4.15 · @nestjs/testing 11.2.8 · TypeScript 5.9.3 · supertest 7.3.1. Har buyruq toza muhitda; scratchpad yo'li ekranda `…/OrderBotNest/src`. |
| Hajm | **26 ekran** (26.11, F-1125-01: AI bo'limi Nest-1 darajasida — 20-ekran ikki topshiriq, «## AI-T5» Tekshiruv 5 saytda 22-ekran; MD raqamlari 22–25 saytda 23–26) · 6 bosqich · 3 amaliyot · 5 tekshiruv · 8 savol · ovoz ≈ 25 daq · amaliyot ≈ 50–65 daq · jami ≈ 1 s 15 – 1 s 30 daq |
| Me'yor | Jest-1 v2 bilan bir xil (≤ 5 segment, ≤ 60 so'z, M17 ko'prik, «Xulosa», kalit 8–14 so'z, M32, M33, M42, M43, M46, M47, M48) |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **happy path** — kutilgan to'g'ri kirish: mijoz `+998901234567` yozdi, omborda yetarli. Jest-1 ning hamma testi shu yo'lda edi.
- **edge case** — qoidaning chegarasidagi yoki kutilmagan, lekin to'g'ri kirish: raqam probel bilan, 9 ta raqam (eng qisqa to'g'ri), omborda aynan 2 ta. Kod xato bermaydi, lekin noto'g'ri javob berishi mumkin.
- **error path** — kod **ataylab** xato beradigan yo'l: telefon yo'q, savat bo'sh, ombor yetmaydi. Test xatoning o'zini kutadi: chiqdimi, qaysi xabar bilan, keyin nima qilinmadi.
- **qoidani ajratish** — `const PHONE` service ichida yashirin, testdan chaqirib bo'lmaydi → `phone.ts` da `isPhone(text)`; bot ham, test ham shu funksiyani chaqiradi.
- **mock** — baza o'rniga soxta obyekt: `manager.findOne = jest.fn()`, `mockResolvedValue({ stock: 1 })`; `Test.createTestingModule` Nest'ning `DataSource`i o'rniga shu mock'ni beradi. Unit-test bazasiz, millisekundlarda.
- **sinxron xato va promise xatosi** — `place` birinchi ikki tekshiruvni darhol otadi (`throw` funksiyaning o'zida), ombor xatosi esa `transaction` ichida, ya'ni promise'da. Birinchisiga `expect(() => f()).toThrow()`, ikkinchisiga `await expect(f()).rejects.toThrow()`.
- **noto'g'ri shakl — natija yo'q** — `toThrow` promise xatosida yoki `await`siz `rejects` — Jest FAIL bermaydi, jarayon qulaydi, PASS/FAIL umuman chiqmaydi (`07`, `08`).
- **nima bo'lmasligi kerak** — xato yo'lida `UPDATE` ketmasin: `expect(manager.query).not.toHaveBeenCalled()`.
- **chegara testi** — `stock < qty` ↔ `stock <= qty` farqi faqat «omborda aynan 2 ta, 2 ta olinadi»da ko'rinadi (`09c`).
- **HTTP test** — `supertest` server ochmasdan Nest ilovasiga so'rov yuboradi: `GET /` → 200 va JSON, `GET /nope` → 404 `Cannot GET /nope`.

**Darsning ipi:** uch yo'l nima va botda qayerda → telefon qoidasi yashirin, ajratamiz, chegara testlari, probel topilmasi, «9 ta nol» → `place` ning uch xatosi: mock, `toThrow` va `rejects`, noto'g'ri shakl jarayonni quladi, `await` → «nima bo'lmasligi kerak» va chegara → sayt API'siga HTTP test → AI edge testlari: buzib tekshirish → sinfga tayyorgarlik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | Uch yo'l: happy path, edge case, error path | Lesson | 1 · umumiy tushuncha |
| 3 | Telefon qoidasi yashirin — alohida funksiyaga | Lesson | 2 · telefon (edge) |
| 4 | Tekshiruv 1 — probel bilan yozilgan raqam | MCRetry | 2 |
| 5 | Edge testlar: `it.each` — qisqa, uzun, harf, bo'sh, probel | Lesson | 2 |
| 6 | Ichida: tuzatish va «9 ta nol ham o'tadi» | Lesson | 2 · ichida |
| 7 | Amaliyot 1 — `phone.ts` va `phone.spec.ts` | Practice | 2 |
| 8 | `place` — uch xato, ikki xil joy | Lesson | 3 · error path |
| 9 | Mock: baza o'rniga soxta `manager` | Lesson | 3 · ichida |
| 10 | `toThrow` va `rejects.toThrow` — to'rt test yashil | Lesson | 3 |
| 11 | Buzamiz: `toThrow` promise xatosida — natija yo'q | Lesson | 3 · buzamiz |
| 12 | Tekshiruv 2 — `rejects` sinxron xatoda | MCRetry | 3 |
| 13 | `await` unutildi — xabar noto'g'ri, natija yo'q | Lesson | 3 · ichida |
| 14 | Tekshiruv 3 — qaysi satr natijani yo'qotadi | LineCheck | 3 |
| 15 | Xato yo'lida nima bo'lmasligi kerak | Lesson | 4 · chegara va «bo'lmasligi» |
| 16 | Chegara: `<` → `<=` — to'rt test ko'rmaydi, beshinchisi ko'radi | Lesson | 4 · buzamiz |
| 17 | Amaliyot 2 — `order.service.spec.ts` va chegara | Practice | 4 |
| 18 | Sayt API'siga HTTP test: `supertest` | Lesson | 5 · HTTP va AI |
| 19 | Tekshiruv 4 — `GET /nope` | MCRetry | 5 |
| 20 | AI edge testlar yozdi — ikki to'plam | Lesson | 5 · AI |
| 21 | Buzib tekshirish: AI to'plamlari | Lesson | 5 · ichida |
| 22 | Amaliyot 3 — AI test yozadi, siz buzib tekshirasiz | Practice | 5 |
| 23 | Sinfga tayyorgarlik: m4b-03 xaritasi va xato qiladigan joylar | Lesson | 6 · sinfga tayyorgarlik |
| 24 | O'z-sinov — 8 savol | Screen27 | — |
| 25 | Yakun | Screen28 | — |

**Sahna turlari:** VS Code `OrderBotNest` (Explorer `compact()`: `src/api/telegram/{telegram.service.ts, phone.ts, phone.spec.ts}`, `src/api/order/{order.service.ts, order.service.spec.ts}`, `src/api/app.controller.ts`, `app.controller.spec.ts`), terminal «VS Code terminali · OrderBotNest» (`$` qatori bilan), **uch yo'l kartasi** (happy · edge · error — bot misoli bilan), **oqim chizmasi** (`place` → sinxron throw / promise throw), AI javobi kartasi, buzish jadvali.

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · Jest` · Sarlavha: **Bot to'g'ri kirishda ishlaydi — endi noto'g'ri kirishda to'g'ri buziladimi, shuni sinaymiz**
- Sahna: chapda reja (6 bosqich); o'ngda terminal — faqat natija (`12-hammasi.txt`): `PASS …keyboards.spec.ts` · `PASS …texts.spec.ts` · `PASS …order.service.spec.ts` · `PASS …app.controller.spec.ts` · `PASS …phone.spec.ts` · `Tests: 25 passed, 25 total`.
- Reja: 01 Umumiy tushuncha · 02 Telefon: edge case · 03 Buyurtma: error path · 04 Chegara va «bo'lmasligi kerak» · 05 HTTP test va AI · 06 Sinfga tayyorgarlik
1. **Jest-1 da «ishlaydi»ni sinadingiz — bugun ==«buzilganda to'g'ri buziladimi»==**
   Ovoz: «Assalomu alaykum. Jest birinchi darsida bot to'g'ri kirishda to'g'ri ishlashini sinadingiz. Bugun teskarisi: mijoz noto'g'ri yozganda, ombor yetmaganda bot to'g'ri buziladimi. Ekranda dars oxiridagi natija: beshta test fayli, yigirma beshta test, hammasi yashil.»
2. **Avval ==umumiy tushuncha==: uch yo'l — happy path, edge case, error path**
   Ovoz: «Avval umumiy tushunchani olamiz: kodning uch yo'li bor. Happy path, ya'ni kutilgan to'g'ri kirish. Edge case, ya'ni qoidaning chegarasi. Error path, ya'ni kod ataylab xato beradigan yo'l. Bugun uchalasini botning haqiqiy joylarida ko'rasiz.» · reja 01
3. **Telefon qoidasi, buyurtmaning uch xatosi, ==sayt API'siga HTTP test==**
   Ovoz: «Keyin uchta haqiqiy joy: telefon raqami qoidasi, buyurtma berishdagi uchta xato va saytning API manzili. Oxirgisi Jest birinchi darsidagi savolga javob: sayt ham xuddi shunday sinaladi. Yo'lda ikkita yashirin tuzoqni ko'rasiz: ularda Jest qizil ham bermaydi.» · reja 02–05
4. **Olti bosqich, uchta amaliyot; oxirida ==ikki ekran sinfga tayyorgarlik==**
   Ovoz: «Dars olti bosqichdan iborat, uchta amaliyotda o'zingiz yozasiz. Oxirgi ikki ekran sinfga tayyorgarlik: o'quvchi darsi xaritasi va o'quvchilar xato qiladigan joylar. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz.» · reja 06
- Manba: `jest2v2-out/12-hammasi.txt`.

## 2 · Uch yo'l: happy path, edge case, error path  ← `Lesson`
- Kicker: `1-bosqich · umumiy tushuncha` · Sarlavha: **Har funksiyada uch yo'l bor: kutilgan kirish, chegaradagi kirish va ataylab xato — test uchalasini sinaydi**
- Sahna: uch karta galma-gal yonadi (bot misoli bilan): «Happy path» — `+998901234567`, omborda 10 ta → buyurtma qabul · «Edge case» — `+998 90 123 45 67` (probel), 9 ta raqam, omborda aynan 2 ta → kod xato bermaydi, lekin to'g'rimi? · «Error path» — telefon yo'q, savat bo'sh, omborda 1 ta → kod **ataylab** xato beradi: qaysi xabar, keyin nima bo'lmaydi; 4-segmentda uch kartaning ostida «test nimani kutadi» qatori.
1. **Happy path — ==kutilgan to'g'ri kirish==: Jest-1 ning hamma testi shu yo'lda edi**
   Ovoz: «Birinchi yo'l happy path: mijoz raqamni to'g'ri yozdi, omborda yetarli, buyurtma qabul qilindi. Jest birinchi darsidagi hamma test shu yo'lda edi. Haqiqiy do'konda esa mijozlarning hammasi ham to'g'ri yozmaydi.» · 1-karta
2. **Edge case — ==qoidaning chegarasi==: kod xato bermaydi, lekin javob to'g'rimi?**
   Ovoz: «Ikkinchi yo'l edge case, ya'ni chegara. Mijoz raqamni probel bilan yozdi. Yoki raqam aynan to'qqizta, ya'ni eng qisqa ruxsat etilgani. Yoki omborda aynan ikkita bor va ikkitasi olinadi. Kod xato bermaydi, lekin javobi to'g'rimi, buni test aytadi.» · 2-karta
3. **Error path — ==kod ataylab xato beradi==: qaysi xabar, keyin nima bo'lmaydi**
   Ovoz: «Uchinchi yo'l error path: telefon yo'q, savat bo'sh, omborda yetmaydi. Bu yerda kod ataylab xato beradi, bu to'g'ri xulq. Test xatoning o'zini kutadi: xato chiqdimi, qaysi xabar bilan, va xatodan keyin ombor o'zgarmay qoldimi.» · 3-karta
4. **Xulosa: har funksiyaga ==uch yo'lning testi== — bugun uchalasini yozamiz**
   Ovoz: «Xulosa: bitta funksiyaga uch yo'lning testi yoziladi: kutilgan kirish, chegara va xato. Bugun telefon qoidasida chegarani, buyurtmada xato yo'lini, saytning API'sida esa so'rov va javobni sinaymiz. Telefon qoidasidan boshlaymiz.» · «test nimani kutadi»
- Manba: tushunchalar A-bo'lim; misollar `jest2v2-out/02`, `04`, `05`, `09c`.

---

## 3 · Telefon qoidasi yashirin — alohida funksiyaga  ← `Lesson`
- Kicker: `2-bosqich · telefon` · Sarlavha: **`PHONE` qoidasi `telegram.service.ts` ichida yashirin — testdan chaqirib bo'lmaydi, shuning uchun alohida faylga chiqaramiz**
- Sahna: VS Code — `telegram.service.ts` 12-satr `const PHONE = /^\+?\d{9,13}$/;` va 155–157 (`WAITING_PHONE`, `if (!PHONE.test(phone)) return ctx.reply(texts.badPhone);`); 3-segmentda yangi fayl `phone.ts` (4 qator, `kod-02-phone.ts`); 4-segmentda `telegram.service.ts` (`jest2-done`): 10-satr `import { isPhone } from './phone';` · 155 `const phone = ctx.message.text.replace(/[\s-]/g, '');` · 156 `if (!isPhone(phone)) return ctx.reply(texts.badPhone);`.
1. **Qoida ==`telegram.service.ts` 12-satrda==: `+` ixtiyoriy, 9 dan 13 tagacha raqam**
   Ovoz: «OrderBotNest papkangizni VS Code'da oching. Src, api, telegram papkasidagi telegram service ts faylining o'n ikkinchi satrida telefon qoidasi: regex. Plus ixtiyoriy, keyin to'qqizdan o'n uchtagacha raqam, boshqa hech narsa. Bir yuz ellik yettinchi satrda bot shu qoida bilan mijoz xabarini tekshiradi.» · 12, 155–157
2. **Muammo: qoida ==`const`, eksport qilinmagan== — test uni chaqira olmaydi**
   Ovoz: «Muammo shunda: qoida const, fayl ichida yashirin, eksport qilinmagan. Test uni chaqira olmaydi. Butun botni ko'tarib, Telegram xabarini soxtalashtirish esa unit-test emas. Shuning uchun qoidani alohida faylga chiqaramiz.» · `const PHONE`
3. **Yangi fayl `phone.ts`: ==`isPhone(text)` — bitta funksiya==, bot ham, test ham shuni chaqiradi**
   Ovoz: «Shu telegram papkasida phone ts faylini yaratamiz. Ichida ikki narsa: o'sha regex va is phone funksiyasi, u matnni oladi va true yoki false qaytaradi. Endi bot ham, test ham bitta funksiyani chaqiradi. Qoida bitta joyda yashaydi.» · `phone.ts`
4. **Xulosa: ==sinamoqchi bo'lgan qoidani funksiyaga ajrating== — bu kodni ham tozalaydi**
   Ovoz: «Xulosa: sinamoqchi bo'lgan qoida service ichida yashirin bo'lsa, uni alohida funksiyaga ajrating. Telegram service endi is phone'ni import qiladi va chaqiradi. Bu testni mumkin qiladi va kodni ham tozalaydi: qoida bitta joyda. Endi qoidaning o'zini sinaymiz.» · import
- Manba: `jest2v2-out/01-phone-yashirin.txt`, `kod-02-phone.ts`; `order-bot` `jest2-start` `telegram.service.ts` 12, 155–157 · `jest2-done` 10, 155–156 (✅ KOD 1).

## 4 · Tekshiruv 1 — probel bilan yozilgan raqam  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 5`
- Sarlavha: **Mijoz raqamni «+998 90 123 45 67» deb yozdi. `isPhone` hozirgi regex bilan nima qaytaradi?**
- Material (`above`, M42): kod `phone.ts` 1–4 (`PHONE = /^\+?\d{9,13}$/` · `isPhone = (text) => PHONE.test(text.trim())`); ostida bot oqimi qatori: «Aziza: +998 90 123 45 67».
- Ovoz: «Qoidani ajratdik, endi tekshirib olaylik. Birinchi tekshiruv. Mijoz raqamni probellar bilan yozdi: plus to'qqiz to'qqiz sakkiz, probel, to'qson, probel va hokazo. Is phone hozirgi regex bilan nima qaytaradi? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 `true` — raqamlar soni to'g'ri, probel sanalmaydi · 2 `false` — regex'da faqat raqam va `+`, probel yo'q · 3 `true` — `trim()` probellarni olib tashlaydi · 4 Xato — regex matndagi probelda yiqiladi
- To'g'ri (ovoz): «To'g'ri. Regex'da faqat plus va raqamlar bor, probel yo'q, shuning uchun false. Trim faqat boshi va oxiridagi probelni oladi, o'rtadagini emas. Bot bu raqamni rad etadi, mijoz esa raqamni to'g'ri yozganini o'ylaydi. Demak, edge case ko'pincha qoida emas, mijozning odatidan chiqadi.» · qisqa: «Regex'da probel yo'q → `false`. `trim()` faqat chekkadagi probelni oladi.»
- Isbot (`after`): terminal `02`: `✕ mijoz probel bilan yozadi` · `Expected: true` · `Received: false`.
- Demak: «Edge case ko'pincha qoidadan emas, mijozning odatidan chiqadi.»
- Xato izohlari: 1 — «Regex belgima-belgi tekshiradi: probel `\d` emas.» · 3 — «`trim()` faqat boshidagi va oxiridagi probelni oladi, o'rtadagini emas.» · 4 — «Regex yiqilmaydi, u `false` qaytaradi — xato xabari yo'q.»
- Maslahat: «Regex'da qaysi belgilar ruxsat etilgan? Probel ular ichidami?»
- Manba: `jest2v2-out/02-phone-probel-fail.txt`.

## 5 · Edge testlar: `it.each` — qisqa, uzun, harf, bo'sh, probel  ← `Lesson`
- Kicker: `2-bosqich · telefon` · Sarlavha: **Bitta qoidaga yettita kirish: ikkita to'g'ri, to'rtta noto'g'ri va bitta chegara — `it.each` ularni bir jadvalda yozadi**
- Sahna: VS Code — `phone.spec.ts` (`kod-02-phone.spec.ts`, Prettier): 1–8 `it.each(['+998901234567', '998901234567'])` · 10–17 `it.each([['12345678', '8 ta raqam — qisqa'], …])` · 19–21 `it('mijoz probel bilan yozadi')`; terminal `02` (FAIL, 6 ✓ 1 ✕) kod tagida; 4-segmentda sabab qatori.
1. **`it.each` — ==bir xil test, har xil kirish==: ro'yxat beriladi, Jest har biriga alohida test yasaydi**
   Ovoz: «Phone spec ts faylini telegram papkasida, phone ts yonida yaratamiz. Yangi narsa: it each. Unga kirishlar ro'yxati beriladi, Jest har biriga alohida test yasaydi. Birinchi ro'yxatda ikkita to'g'ri raqam: plus bilan va plussiz.» · 1–8
2. **To'rtta noto'g'ri kirish: ==8 ta raqam, 14 ta raqam, harf, bo'sh== — har birining nomi bor**
   Ovoz: «Ikkinchi ro'yxatda to'rtta noto'g'ri kirish: sakkizta raqam, ya'ni chegaradan bitta kam. O'n to'rtta raqam, chegaradan bitta ko'p. Harflar. Bo'sh matn. Har qatorda kirish va uning nomi: terminalda test nomi tushunarli bo'lsin.» · 10–17
3. **Yettinchi test — mijozning odati: ==probel bilan yozilgan raqam `true` bo'lishi kerak==**
   Ovoz: «Yettinchi test mijozning odati: probel bilan yozilgan raqam. Biz uni to'g'ri deb kutamiz, chunki bu haqiqiy raqam. VS Code terminalida npm test, ikki chiziqcha, phone. Oltita yashil, bittasi qizil: probel bilan yozilgan raqam.» · terminal
4. **Demak, ==qoida mijozdan tor==: probel bilan yozilgan haqiqiy raqamni bot rad etadi**
   Ovoz: «Demak, sabab bitta joyda: qoida mijozdan tor. Mijoz probel bilan yozadi, regex esa faqat raqamlarni biladi. Test buni kod yozilgan kuniyoq ko'rsatdi, mijoz shikoyat qilguncha emas. Keyingi ekranda qoidani kengaytiramiz va yana bir chegarani ko'ramiz.»
- Manba: `jest2v2-out/02-phone-probel-fail.txt`, `kod-02-phone.spec.ts`.

## 6 · Ichida: tuzatish va «9 ta nol ham o'tadi»  ← `Lesson`
- Kicker: `2-bosqich · ichida` · Sarlavha: **Tuzatish bitta satr: tekshirishdan oldin probel va chiziqchani olib tashlaymiz — keyin test qoida nimani o'tkazib yuborishini ham ko'rsatadi**
- Sahna: `phone.ts` 4-satr: `PHONE.test(text.trim())` (qizil) → `PHONE.test(text.replace(/[\s-]/g, ''))` (yashil, `kod-03-phone.ts`); terminal `03` (7 ✓); 3-segmentda `phone.spec.ts` ga qo'shilgan `describe("isPhone — qoida nimani o'tkazib yuboradi")` · `it("9 ta nol ham o'tadi")` (`kod-04-phone.spec.ts`), terminal `04` (8 ✓).
1. **Tuzatish: ==`replace(/[\s-]/g, '')`== — probel va chiziqcha olib tashlanadi, keyin tekshiriladi**
   Ovoz: «Phone ts faylining to'rtinchi satrini o'zgartiramiz: trim o'rniga replace. U probel va chiziqchalarni olib tashlaydi, keyin regex tekshiradi. Mijoz qanday yozsa ham, raqamlar bir xil. Npm test phone: yettala test yashil.» · 4-satr + `03`
2. **Yana bir test: ==9 ta nol ham `true`== — qoida buni to'g'ri raqam deydi**
   Ovoz: «Endi qiziq test. To'qqizta nol: is phone nima deydi? True. Qoida bo'yicha bu to'g'ri raqam: to'qqizta raqam, boshqa hech narsa. Test yashil, lekin siz o'ylab qolasiz: haqiqatan ham to'qqizta nol telefon raqamimi?» · `04`
3. **Test ==qoidani tekshiradi, qoidaning o'zi to'g'rimi== — bu sizning qaroringiz**
   Ovoz: «Mana edge test'ning ikkinchi foydasi. Test qoidani tekshiradi, qoidaning o'zi to'g'rimi, buni test hal qilmaydi. To'qqizta nol o'tishi sizga kelishmasa, qoidani torroq yozasiz va test yana sizni qo'riqlaydi. Hozircha qoldiramiz: bot uchun yetarli.»
4. **Xulosa: ==chegaradagi kirishni testga yozing== — u qoidani ko'zingiz oldiga olib keladi**
   Ovoz: «Xulosa: chegaradagi kirishni testga yozing, u qoidani ko'zingiz oldiga olib keladi. Bitta test qoidaning tor joyini topdi, probel. Boshqasi qoidaning keng joyini ko'rsatdi, to'qqizta nol. Endi shu ikkala faylni o'zingiz yozasiz.»
- Manba: `jest2v2-out/03-phone-tuzatildi.txt`, `04-phone-nol.txt`, `kod-03-phone.ts`, `kod-04-phone.spec.ts`.

## 7 · Amaliyot 1 — `phone.ts` va `phone.spec.ts`  ← `Practice`
- Kicker: `Amaliyot 1 / 3` · Eyebrow: `Hozir o'zingizda · 12 daqiqa` · Sarlavha: **Telefon qoidasini alohida faylga chiqaring, chegara testlarini yozing va probel bilan qizilni ko'ring** · `tableAt: 3`
1. **Endi siz: ==`jest2-start` tegida== qoidani ajratasiz va yetti test yozasiz**
   Ovoz: «Endi navbat sizga. OrderBotNest papkangizda jest ikki start tegiga o'tasiz. Telegram papkasida phone ts va phone spec ts yaratasiz. Baza va token kerak emas. O'n ikki daqiqa ketadi.»
2. **1–2-qadam: teg va ==`phone.ts`, `it.each` bilan yetti test== — probel testi qizil**
   Ovoz: «Birinchi qadamda git fetch va checkout bilan tegga o'tasiz. Ikkinchisida phone ts'ga regex va is phone'ni, phone spec ts'ga it each bilan yetti testni yozasiz. Npm test phone: probel testi qizil bo'lishi kerak.»
3. **3–4-qadam: ==`replace` bilan tuzatish==, «9 ta nol» testi; isbot — `Tests:` satri**
   Ovoz: «Uchinchi qadamda is phone'da trim o'rniga replace yozasiz: hammasi yashil. To'rtinchisida to'qqizta nol testini qo'shasiz va natijani ko'rasiz. Isbot maydoniga oxirgi natijaning tests satrini nusxalang.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz qoidani testga ochasiz va chegara testini yozasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Teg | `git fetch --tags` · `git checkout jest2-start` · `npm test` | `Tests: 10 passed, 10 total` |
  | 2 | `phone.ts` + `phone.spec.ts` (3–5-ekrandagi kod) | `src/api/telegram/phone.ts` · `src/api/telegram/phone.spec.ts` · `npm test -- phone` | `✕ mijoz probel bilan yozadi` · `Tests: 1 failed, 6 passed` |
  | 3 | Tuzatish | `isPhone` da `text.replace(/[\s-]/g, '')` · `npm test -- phone` | `Tests: 7 passed, 7 total` |
  | 4 | Chegara | `it("9 ta nol ham o'tadi")` — `isPhone('000000000')` → `true` | `Tests: 8 passed, 8 total` |
- Isbot: «Oxirgi natijaning `Tests:` satri» · placeholder: «masalan: Tests: 8 passed, 8 total» · KOD: `/Tests:\s+8 passed,\s+8 total/` · xato: «Sakkizta test yashilmi? `npm test -- phone` natijasidagi `Tests:` qatorini qo'ying.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `error: pathspec 'jest2-start' did not match` | teglar olinmagan — `git fetch --tags`, keyin checkout |
  | 2-qadamda hammasi `✓` | probel testi yozilmagan yoki `replace` allaqachon qo'yilgan — 5-ekrandagi yettinchi testni tekshiring |
  | `it.each` da `%s` o'rniga `undefined` | ro'yxat elementlari massiv emas — `['12345678', '8 ta raqam']` juftlik bo'lsin |
  | `Cannot find module './phone'` | fayl `src/api/telegram/` da emas — `telegram.service.ts` yoniga ko'chiring |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `jest2v2-out/02`, `03`, `04`; `Cannot find module` — Jest-1 `jest1v2-out/21` (xabar shakli bir xil).

---

## 8 · `place` — uch xato, ikki xil joy  ← `Lesson`
- Kicker: `3-bosqich · error path` · Sarlavha: **Buyurtma berishda uchta xato bor: ikkitasi funksiyaning o'zida darhol, uchinchisi tranzaksiya ichida — testda bu farq hal qiluvchi**
- Sahna: VS Code — `order.service.ts` 24–27 (`place(user, cart): Promise<Order> {` · `if (!user.phone) throw new Error("Telefon raqami yo'q");` · `if (cart.length === 0) throw new Error("Savat bo'sh");` · `return this.ds.transaction(async (m) => {`) va 36–38 (`if (p.stock < c.qty) { throw new Error(…omborda faqat… qoldi) }`); 3-segmentda oqim chizmasi: `place()` → [sinxron: telefon · savat] darhol `throw` → [promise: `transaction(…)`] ichida `throw`.
1. **`order.service.ts` 24-satr: ==`place` ikki xatoni darhol otadi== — telefon yo'q, savat bo'sh**
   Ovoz: «Endi buyurtmaga o'tamiz. Src, api, order papkasidagi order service ts faylini oching, yigirma to'rtinchi satr: place funksiyasi. Yigirma besh va yigirma oltinchi satrlarda ikki tekshiruv: telefon yo'q bo'lsa xato, savat bo'sh bo'lsa xato. Ikkalasi darhol, funksiyaning o'zida otiladi.» · 24–27
2. **Uchinchi xato ==tranzaksiya ichida, 37-satr==: omborda yetmasa — promise'da otiladi**
   Ovoz: «Uchinchi xato o'ttiz yettinchi satrda: omborda yetmasa. Lekin u transaction ichida, ya'ni async funksiya ichida. Bu xato darhol emas, promise'da otiladi. Ekrandagi chizmaga qarang: ikki xato chapda, funksiyaning o'zida, bittasi o'ngda, promise ichida.» · 36–38 + chizma
3. **Farq nega muhim: ==Jest'da ikkita har xil usul== — sinxron uchun biri, promise uchun boshqasi**
   Ovoz: «Bu farq test uchun hal qiluvchi. Sinxron xatoni expect, qavs ichida funksiya, to throw bilan ushlaymiz. Promise xatosini esa await expect, rejects, to throw bilan. Usulni almashtirib yuborsangiz, Jest qizil ham bermaydi, buni ikki ekrandan keyin ko'rasiz.»
4. **Xulosa: xatoni sinashdan oldin ==qayerda otilishini== aniqlang — darholmi, promise ichidami**
   Ovoz: «Xulosa: xatoni sinashdan oldin uning qayerda otilishini aniqlang: funksiyaning o'zida darholmi, yoki promise ichidami. Place'da ikkala tur ham bor. Lekin testdan oldin yana bir muammo: place bazaga yozadi, bizda esa test bazasi yo'q. Keyingi ekranda shuni hal qilamiz.»
- Manba: `order-bot` `jest1-done` `order.service.ts` 24–27, 36–38 (haqiqiy satrlar, `jest2v2-out/08` dagi `> 37 |`).

## 9 · Mock: baza o'rniga soxta `manager`  ← `Lesson`
- Kicker: `3-bosqich · ichida` · Sarlavha: **Unit-test bazasiz: `DataSource` o'rniga soxta obyekt, `findOne` biz aytgan mahsulotni qaytaradi — bu mock**
- Sahna: VS Code — `order.service.spec.ts` (`kod-05-order.service.spec.ts`) 8–15 (`const manager = { findOne: jest.fn(), query: jest.fn(), create: …, save: …, delete: … }`) · 16 (`const dataSource = { transaction: jest.fn((cb) => cb(manager)) }`) · 23–31 (`Test.createTestingModule({ providers: [OrderService, { provide: getRepositoryToken(Order), useValue: {} }, { provide: DataSource, useValue: dataSource }] })`); 4-segmentda `manager.findOne.mockResolvedValue({ … stock: 1 … })` satri.
1. **`place` bazaga yozadi, test bazasi yo'q — ==baza o'rniga mock==: soxta `manager`**
   Ovoz: «Place funksiyasi transaction ichida bazaga yozadi: find one, update, save. Unit-testda baza yo'q va kerak emas. Shuning uchun baza o'rniga mock, ya'ni soxta obyekt beramiz. Order papkasida order service spec ts faylini yaratamiz, sakkizinchi satrdan manager obyekti.» · 8–15
2. **`jest.fn()` — ==chaqiruvni yozib qoladigan soxta funksiya==; `transaction` esa mock'ni callback'ka beradi**
   Ovoz: «Jest fn soxta funksiya: u chaqirilganini va qanday argument bilan chaqirilganini yozib qoladi. Find one, query, save, hammasi shunday. O'n oltinchi satrda data source: uning transaction funksiyasi callback'ni darhol chaqirib, unga bizning manager'ni beradi. Place buni haqiqiy baza deb o'ylaydi.» · 16
3. **`Test.createTestingModule`: ==Nest'ga `DataSource` o'rniga mock'ni beramiz==, `OrderService` haqiqiy**
   Ovoz: «Yigirma uchinchi satrdan Nest'ning test moduli. Providers ro'yxatida order service haqiqiy, data source o'rniga esa bizning soxta obyekt. Nest uni inject qiladi, order service farqini bilmaydi. Repository ham kerak, bo'sh obyekt yetadi: place uni ishlatmaydi.» · 23–31
4. **Xulosa: har testda ==`mockResolvedValue` bilan mahsulotni biz beramiz== — omborda 1 ta yoki 10 ta**
   Ovoz: «Xulosa: endi har testda omborni biz boshqaramiz. Mock resolved value bilan find one'ga nima qaytarishini aytamiz: omborda bitta Kolonka yoki o'nta. Baza yo'q, lekin place aynan haqiqiy kodda ishlaydi. Endi to'rtta testni yozamiz.» · `mockResolvedValue`
- Manba: `kod-05-order.service.spec.ts` (Prettier, haqiqiy satrlar).

## 10 · `toThrow` va `rejects.toThrow` — to'rt test yashil  ← `Lesson`
- Kicker: `3-bosqich · error path` · Sarlavha: **Sinxron xato — `expect(() => …).toThrow()`, promise xatosi — `await expect(…).rejects.toThrow()`: to'rt test, hammasi yashil**
- Sahna: `order.service.spec.ts` 33–53 (`kod-05`): `it("telefon yo'q — darhol xato")` — `expect(() => service.place(…)).toThrow("Telefon raqami yo'q")` · `it("savat bo'sh")` · `it("omborda yetmaydi…")` — `mockResolvedValue({ stock: 1 })` · `await expect(service.place(user, cart)).rejects.toThrow('Kolonka: omborda faqat 1 ta qoldi')` · `it('yetarli')`; terminal `05` (4 ✓) kod tagida.
1. **Sinxron xato: ==`expect(() => …)` — funksiyani o'rab beramiz==, Jest uni o'zi chaqiradi**
   Ovoz: «Birinchi ikki test sinxron xato uchun. Qarang: expect ichida funksiyani darhol chaqirmaymiz, qavs, strelka, keyin chaqiruv. Jest o'sha o'ramni o'zi chaqiradi va xatoni ushlaydi. To throw ichida xabar: telefon raqami yo'q. Xabar mos bo'lmasa, test qizil.» · 33–40
2. **Promise xatosi: ==`await expect(…).rejects.toThrow()`== — funksiya darhol chaqiriladi, promise kutiladi**
   Ovoz: «Uchinchi test promise xatosi uchun, shakli boshqa. Expect ichida place darhol chaqiriladi, o'ramsiz, chunki u promise qaytaradi. Keyin rejects: promise xato bilan tugashini kutamiz. Va boshida await: Jest natijani kutsin. Mock'da omborda bitta Kolonka, savatda ikkita.» · 42–47
3. **To'rtinchi test — happy path: ==omborda 10 ta, jami 100 000==, `query` bir marta chaqirildi**
   Ovoz: «To'rtinchi test happy path: omborda o'nta, buyurtma o'tadi, jami bir yuz ming so'm. Va yana bir tekshiruv: manager query bir marta chaqirildi, ya'ni update ketdi. VS Code terminalida npm test order service: to'rttala test yashil.» · 49–53 + terminal
4. **Xulosa: ==sinxron — o'rab `toThrow`, promise — `rejects` va `await`==; endi ikkalasini almashtirib ko'ramiz**
   Ovoz: «Xulosa: sinxron xatoga o'ram va to throw, promise xatosiga rejects va await. Ikkalasi yashil, lekin shakl muhim. Keyingi ikki ekranda ularni ataylab almashtiramiz va Jest nima qilishini ko'rasiz. Natija sizni hayron qoldiradi.»
- Manba: `jest2v2-out/05-order-pass.txt`, `kod-05-order.service.spec.ts`.

## 11 · Buzamiz: `toThrow` promise xatosida — natija yo'q  ← `Lesson`
- Kicker: `3-bosqich · buzamiz` · Sarlavha: **Ombor xatosini `toThrow` bilan yozsak, Jest qizil bermaydi — jarayonning o'zi quladi, PASS ham, FAIL ham chiqmadi**
- Sahna: `order.service.spec.ts` ombor testi (`kod-07-order-tothrow.spec.ts`): `expect(() => service.place(user, cart)).toThrow('Kolonka: omborda faqat 1 ta qoldi');` (qizil belgi); terminal `07` (`…/OrderBotNest/src/api/order/order.service.ts:48` · `throw new Error(…)` · `Error: Kolonka: omborda faqat 1 ta qoldi` · `Node.js v24.18.0` · `[chiqish kodi: 1]`) — PASS/FAIL satri yo'q; 3-segmentda sabab kartasi: `toThrow` o'ramni chaqirdi → `place` promise qaytardi (xato yo'q!) → xato keyin, promise ichida → hech kim ushlamadi → jarayon quladi.
- F-1120-02 (M52): 0-band — mentor to'g'ri testdagi (51-satr) `await … .rejects` ni o'zi bosadi → test sinxron `toThrow` shakliga o'tadi. Kod ostida kichik rasm (M51): spec → place() → Jest natijasi «?» → «PASS ham, FAIL ham yo'q — jarayon quladi»; bo'laklar 1 (51-satr o'ram) · 2 (`Node.js v24.18.0`).
0. **Endi ==o'zingiz buzasiz==: testda yonib turgan `rejects` ustiga bosing**
   Ovoz: «Ombor testi to'g'ri yozilgan: await va rejects bor. Endi ataylab buzamiz. Buzishni o'zingiz qilasiz: order service spec faylining ellik birinchi satri yonib turibdi, ustiga bosing: test birinchi testdagi sinxron shaklga o'tadi.»
   Bosish: «**order.service.spec.ts** 51-satridagi **`await expect(…).rejects`** ustiga bosing — test `expect(() => …).toThrow` shakliga o'tadi.»
1. **Ombor testi endi ==`toThrow` bilan== — sinxron shakl, promise xatosi uchun**
   Ovoz: «Test endi o'ram va to throw bilan, await yo'q, rejects yo'q. Ko'rinishi to'g'riga o'xshaydi: xabar ham o'sha. Npm test order service.»
2. **Natija: ==PASS ham, FAIL ham yo'q== — terminalda xato va `Node.js v24.18.0`, jarayon quladi**
   Ovoz: «Natijaga qarang. PASS yo'q, FAIL yo'q, tests satri yo'q. Faqat xato: Kolonka, omborda faqat bitta qoldi, va Node versiyasi. Jest jarayonining o'zi quladi. Siz test qizil bo'ladi deb kutgan edingiz, u esa umuman natija bermadi.» · terminal
3. **Demak, sabab: ==`toThrow` o'ramni chaqirdi, `place` promise qaytardi, xato keyin keldi== — hech kim ushlamadi**
   Ovoz: «Demak, sabab bitta joyda. To throw o'ramni chaqirdi, place promise qaytardi, va shu paytda xato yo'q edi. Test o'tdi deb hisoblandi. Xato keyin, promise ichida otildi, uni hech kim ushlamadi, va Node butun jarayonni to'xtatdi. Bu yashirin xato: qizil emas, bo'sh.» · sabab kartasi
4. **Xulosa: promise xatosiga ==`toThrow` emas, `rejects`== — aks holda Jest sizga hech narsa aytmaydi**
   Ovoz: «Xulosa: promise ichidagi xatoga to throw yozilmaydi, rejects yoziladi. Aks holda Jest sizga hech narsa aytmaydi, jarayon qulaydi. Sinfda o'quvchi test natijasi chiqmayapti desa, birinchi shuni so'rang: xato promise ichidami. Endi teskarisini ko'ramiz.»
- Manba: `jest2v2-out/07-tothrow-promise.txt` (aynan), `kod-07-order-tothrow.spec.ts`.

## 12 · Tekshiruv 2 — `rejects` sinxron xatoda  ← `MCRetry`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 5`
- Sarlavha: **Telefon testini `await expect(service.place(…)).rejects.toThrow()` bilan yozdik. `place` xatoni darhol, funksiya ichida otadi. Natija?**
- Material (`above`): kod `kod-06-order-rejects.spec.ts` telefon testi (`it("telefon yo'q — darhol xato", async () => { await expect(service.place({ id: 1, phone: null } as User, cart)).rejects.toThrow("Telefon raqami yo'q"); })`); ostida `order.service.ts` 25-satr `if (!user.phone) throw new Error("Telefon raqami yo'q");`.
- Ovoz: «Promise shaklini sinxron xatoga qo'yib ko'ramiz. Ikkinchi tekshiruv. Telefon testini rejects bilan yozdik, lekin place telefon xatosini darhol, funksiyaning o'zida otadi, promise qaytarmasdan. Npm test nima deydi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 PASS — `rejects` sinxron xatoni ham ushlaydi · 2 Jarayon quladi — 11-ekrandagi kabi natija yo'q · 3 FAIL — xato `expect` ishga tushguncha otildi · 4 PASS — `await` xatoni promise'ga o'raydi
- To'g'ri (ovoz): «To'g'ri. Place chaqirilganda xato darhol otildi, expect hali ishga tushmagan edi. Jest bu xatoni testning o'zi yiqildi deb hisoblaydi va FAIL beradi, xabari: telefon raqami yo'q. Bu safar natija bor, chunki xato sinxron, Jest uni ushladi. Demak, rejects faqat promise'dan keladigan xatoni ushlaydi.» · qisqa: «Xato `expect`gacha otildi — FAIL, Jest ushladi. `rejects` faqat promise xatosi uchun.»
- Isbot (`after`): terminal `06`: `✕ telefon yo'q — darhol xato` · `● OrderService.place › telefon yo'q — darhol xato` · `Telefon raqami yo'q` · `> 25 |     if (!user.phone) throw new Error(…)` · `Tests: 1 failed, 3 skipped, 4 total`.
- Demak: «`rejects` faqat promise'dan keladigan xatoni ushlaydi; sinxron xato `expect`gacha otiladi.»
- Xato izohlari: 1 — «`rejects` promise kutadi; xato `expect` ishga tushguncha otildi.» · 2 — «Bu safar xato sinxron — Jest uni test ichida ushladi, natija bor.» · 4 — «`await` xatoni o'ramaydi; `place` chaqirilgan paytdayoq otildi.»
- Maslahat: «`service.place(…)` qachon chaqiriladi — `expect` ichida, `rejects`dan oldin. Xato qachon otiladi?»
- Manba: `jest2v2-out/06-rejects-sinxron.txt`, `kod-06-order-rejects.spec.ts`.

## 13 · `await` unutildi — xabar noto'g'ri, natija yo'q  ← `Lesson`
- Kicker: `3-bosqich · ichida` · Sarlavha: **`rejects` to'g'ri, lekin `await` yo'q va xabar ataylab noto'g'ri: Jest xatoni topdi, lekin testga bog'lay olmadi — yana natija yo'q**
- Sahna: `kod-08-order-await-yoq.spec.ts` ombor testi: `expect(service.place(user, cart)).rejects.toThrow('Planshet: omborda faqat 9 ta qoldi');` (await yo'q — qizil belgi, xabar noto'g'ri); terminal `08`: `JestAssertionError: expect(received).rejects.toThrow(expected)` · `Expected substring: "Planshet: omborda faqat 9 ta qoldi"` · `Received message: "Kolonka: omborda faqat 1 ta qoldi"` · `> 37 |` · `Node.js v24.18.0` · `[chiqish kodi: 1]` — PASS/FAIL yo'q; 3-segmentda sabab kartasi: test tugadi → keyin promise rad etildi → Jest «bu qaysi test?» — bog'lay olmadi → jarayon quladi.
1. **Shakl deyarli to'g'ri: `rejects` bor, ==faqat `await` yo'q==; xabarni ham ataylab noto'g'ri yozdik**
   Ovoz: «Yana bir yashirin xato, bu safar ancha nozik. Rejects bor, to throw bor, faqat boshida await yo'q. Va xabarni ataylab noto'g'ri yozdik: Planshet, to'qqizta qoldi, kodda esa Kolonka, bitta. Test qizil bo'lishi kerak. Npm test.»
2. **Natija: Jest farqni ==topdi — `Expected` Planshet, `Received` Kolonka==, lekin PASS/FAIL yana yo'q**
   Ovoz: «Natijaga qarang. Jest farqni topdi: expected Planshet, received Kolonka, o'ttiz yettinchi satr. Lekin pastda yana Node versiyasi, PASS yo'q, FAIL yo'q. Jest xatoni ko'rdi, lekin uni testga bog'lay olmadi.» · terminal
3. **Demak, sabab: ==`await`siz test darhol tugadi==, promise keyin rad etildi — Jest uni qaysi testga yozishni bilmadi**
   Ovoz: «Demak, sabab bitta: await yo'q. Test funksiyasi promise'ni kutmasdan darhol tugadi. Promise keyin rad etildi, Jest bu xato qaysi testniki ekanini bilmadi va jarayonni to'xtatdi. Await bo'lsa, bu oddiy qizil test bo'lar edi, xabar bilan.» · sabab kartasi
4. **Xulosa: ==`rejects` oldida doim `await`==; natija umuman chiqmasa — promise va `await`ni tekshiring**
   Ovoz: «Xulosa: rejects oldida doim await, test funksiyasi esa async. Jest natija umuman bermasa, bu kodning xatosi emas, testning shakli: promise xatosiga to throw yoki await'siz rejects. Endi shu satrni o'zingiz topasiz.»
- Manba: `jest2v2-out/08-await-unutildi.txt` (aynan), `kod-08-order-await-yoq.spec.ts`.

## 14 · Tekshiruv 3 — qaysi satr natijani yo'qotadi  ← `LineCheck`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 5 — qaysi satr xato?` · Sarlavha: **Bu test faylida `npm test` natija bermaydi — jarayon qulaydi. Sababchi satrni toping**
- Shart (`task`): «Qoida: promise xatosi `await expect(…).rejects.toThrow()` bilan kutiladi. Bu bo'lakda bitta satr promise'ni kutmaydi. **O'sha satrni bosing.**»
- Ovoz (`q`): «Yashirin xatoni ko'rdingiz, endi o'zingiz toping. Uchinchi tekshiruv. Bu test faylida npm test natija bermaydi, jarayon qulaydi. Bo'lakda bitta satr promise'ni kutmaydi. O'sha satrni bosing.»
- Fayl: `order.service.spec.ts` (Explorer faol), `kod-08-order-await-yoq.spec.ts` ombor testi bo'lagi (Prettier, haqiqiy satrlar; xato satr — 51-satr, ✅ KOD 2): `it("omborda yetmaydi…", async () => {` · `manager.findOne.mockResolvedValue({ … stock: 1 … });` · **`expect(service.place(user, cart)).rejects.toThrow(` ← xato satr (await yo'q)** · `'Planshet: omborda faqat 9 ta qoldi',` · `);` · `});` → `target` = `expect(service.place` satri.
- Tuzatilgan (`fixed`): `expect(service.place(user, cart)).rejects.toThrow(` → `await expect(service.place(user, cart)).rejects.toThrow(` (eski qizil, yangisi yashil); `fixedExtra`: terminal — `await` bilan va noto'g'ri xabar: `✕ omborda yetmaydi` · `Expected substring: "Planshet…"` · `Received message: "Kolonka…"` · `Tests: 1 failed, 3 skipped, 4 total` — ✅ KOD 3 (`jest2v2-out/08b-await-bor-xabar-xato.txt`).
- To'g'ri (ovoz, `ok`): «To'g'ri. Shu satrda await yo'q: test promise'ni kutmasdan tugaydi, xato keyin keladi va Jest uni testga bog'lay olmaydi. Ekranda tuzatilgan satr: await bilan. Endi noto'g'ri xabar oddiy qizil test beradi, expected va received bilan. Demak, natija chiqmasa, avval rejects oldidagi await'ni qidiring.»
- Qisqa (`okShort`): «`await` yo'q — test promise'ni kutmadi, jarayon quladi. `await` bilan — oddiy FAIL, `Expected`/`Received` bilan.»
- Maslahat (`hint`): «Qaysi satr promise qaytaradi va uni kutmaydi? `rejects` oldida nima bo'lishi kerak?»
- Manba: `jest2v2-out/08`, `08b`, `kod-08-order-await-yoq.spec.ts`, `kod-08b-order-await-xato.spec.ts`.

---

## 15 · Xato yo'lida nima bo'lmasligi kerak  ← `Lesson`
- Kicker: `4-bosqich · chegara va «bo'lmasligi kerak»` · Sarlavha: **Xato yo'lida test ikki narsani kutadi: xato chiqdi va ombor o'zgarmadi — `not.toHaveBeenCalled()`**
- Sahna: `order.service.spec.ts` 42–47 (`kod-05`): `await expect(…).rejects.toThrow(…)` · `expect(manager.query).not.toHaveBeenCalled();` (yoritilgan); `order.service.ts` 36–41 (`if (p.stock < c.qty) throw …` → keyin `await m.query('UPDATE products SET stock = stock - $1 …')`); 3-segmentda happy path testidagi `expect(manager.query).toHaveBeenCalledTimes(1)`.
1. **Xato chiqdi — bu yarmi. ==Xatodan keyin `UPDATE` ketmaganini== ham tekshiramiz**
   Ovoz: «Ombor testiga qaytamiz. Xato chiqdi, bu yarmi. Muhimroq savol: xatodan keyin ombor o'zgarmay qoldimi? Order service ts'da o'ttiz oltinchi satrdagi tekshiruv update'dan oldin turadi. Agar kimdir tartibni almashtirsa, xato chiqadi, lekin ombor baribir kamayadi.» · 36–41
2. **`expect(manager.query).not.toHaveBeenCalled()` — ==mock chaqiruvni yozib qolgan==, biz so'raymiz**
   Ovoz: «Mock bu yerda yordam beradi. Manager query jest fn, u chaqirilganini eslab qoladi. Biz so'raymiz: not to have been called, ya'ni umuman chaqirilmagan bo'lsin. Xato yo'lida bu eng muhim qator: bot xato berib, baribir omborni kamaytirmasin.» · 46
3. **Happy path'da teskarisi: ==`toHaveBeenCalledTimes(1)`== — `UPDATE` aynan bir marta ketdi**
   Ovoz: «Happy path testida teskarisi: to have been called times bir. Update aynan bir marta ketdi, ikki marta emas, nol marta emas. Mock bilan siz kod bazaga nima yuborganini sanaysiz: nima ketdi, nima ketmadi.» · 53
4. **Xulosa: error path testi ==ikki qismli==: xato chiqdi va keyingi qadam bajarilmadi**
   Ovoz: «Xulosa: xato yo'lining testi ikki qismli. Birinchisi: xato chiqdi, to'g'ri xabar bilan. Ikkinchisi: xatodan keyin bo'lmasligi kerak bo'lgan narsa bo'lmadi. Ikkinchisini ko'pchilik yozmaydi, aynan shu yerda bot pulni yo'qotadi. Endi chegarani buzamiz.»
- Manba: `kod-05-order.service.spec.ts` 42–53; `order.service.ts` 36–41.

## 16 · Chegara: `<` → `<=` — to'rt test ko'rmaydi, beshinchisi ko'radi  ← `Lesson`
- Kicker: `4-bosqich · buzamiz` · Sarlavha: **Ombor tekshiruvini `<=` qilsak, aynan 2 ta qolganda 2 tasini sotib bo'lmaydi — to'rt test yashil qoladi, chegara testi qizaradi**
- Sahna: `order.service.ts` 36-satr `if (p.stock < c.qty) {` → buzilgan `if (p.stock <= c.qty) {` (M36); terminal `09` (4 ✓ — buzilish sezilmadi); 3-segmentda qo'shilgan test (`kod-10-order-chegara.spec.ts`): `it("chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi")` · `mockResolvedValue({ stock: 2 })` · `expect(order.total).toBe(100000)`; terminal `09b` (5 ✓) → `09c`: `✕ chegara…` · `Kolonka: omborda faqat 2 ta qoldi` · `> 37 |`.
- F-1120-02 (M52): 0-band — mentor 36-satrdagi `<` ni o'zi bosadi → `<=`. Kod ostida kichik rasm (M51): «omborda 2, savatda 2» → `p.stock < c.qty` → natija «?» → 4 passed (sezilmadi) → 5-test bilan 1 failed → 5 passed; bo'laklar 1 (36-satr shart) · 2 (5-test — aynan 2 ta).
0. **Endi ==o'zingiz buzasiz==: shartda yonib turgan `<` ustiga bosing**
   Ovoz: «Ombor tekshiruvi to'g'ri ishlaydi. Endi chegarani buzamiz. Buzishni o'zingiz qilasiz: order service ts'ning o'ttiz oltinchi satrida kichik belgisi yonib turibdi, ustiga bosing: u kichik yoki tengga aylanadi.»
   Bosish: «**order.service.ts** 36-satridagi **`<`** ustiga bosing — `<=` bo'ladi.»
1. **Buzildi: ==`<` o'rniga `<=`== — omborda 2 ta, 2 tasini olsa, bot «faqat 2 ta qoldi» deydi**
   Ovoz: «Kichik endi kichik yoki teng. Omborda ikkita bo'lsa va mijoz ikkitasini olsa, bot xato beradi: faqat ikkita qoldi. Oxirgi mahsulot hech qachon sotilmaydi. Npm test order service.» · 36
2. **To'rt test ==yashil qoldi==: ular 1 ta va 10 ta ni sinaydi, chegarani emas**
   Ovoz: «To'rttala test yashil. Sababi: ombor testi bitta qolganini sinaydi, happy path o'nta. Ikkalasi chegaradan uzoqda. Kichik va kichik yoki teng farqi faqat ikki son teng bo'lganda ko'rinadi. Jest birinchi darsidagi sahifalash xatosi bilan bir xil.» · `09`
3. **Beshinchi test — ==omborda aynan 2 ta, 2 tasi olinadi==: endi qizil, «faqat 2 ta qoldi»**
   Ovoz: «Beshinchi testni qo'shamiz: mock'da omborda aynan ikkita, savatda ikkita. Buyurtma o'tishi kerak, jami bir yuz ming. To'g'ri kod bilan beshtala yashil. Buzilgan kod bilan beshinchisi qizil: omborda faqat ikkita qoldi. Bitta belgi, bitta test uni ushladi.» · test + `09b`, `09c`
4. **Xulosa: har ==`<`, `<=`, `>` shartiga chegara testi== — aynan teng bo'lgan qiymat bilan**
   Ovoz: «Xulosa: kodda kichik, katta, kichik yoki teng ko'rsangiz, aynan teng bo'lgan qiymat bilan test yozing. Bu test odatda eng qisqa va eng ko'p xatoni ushlaydi. Shartni tiklaymiz, beshtala yashil. Endi order service testlarini o'zingiz yozasiz.»
- Manba: `jest2v2-out/09-order-chegara-buzildi.txt`, `09b-chegara-testi-pass.txt`, `09c-chegara-testi-buzildi.txt`, `kod-10-order-chegara.spec.ts`.

## 17 · Amaliyot 2 — `order.service.spec.ts` va chegara  ← `Practice`
- Kicker: `Amaliyot 2 / 3` · Eyebrow: `Hozir o'zingizda · 20 daqiqa` · Sarlavha: **Mock bilan `place` ning uch xatosini va chegarasini sinang, keyin kodni buzib qizilni ko'ring** · `tableAt: 3`
1. **Endi siz: ==`order.service.spec.ts`== — mock, uch xato, chegara va bitta buzish**
   Ovoz: «Endi navbat sizga. Order papkasida order service spec ts yozasiz: mock, uchta xato, happy path va chegara. Ekrandagi namuna kodni ochishingiz mumkin, lekin o'zingiz yozing, nusxalamang. Yigirma daqiqa ketadi.»
2. **1–2-qadam: ==mock va to'rt test== — sinxron `toThrow`, promise `rejects`, `not.toHaveBeenCalled`**
   Ovoz: «Birinchi qadamda mock manager va test modulini yozasiz. Ikkinchisida to'rtta test: telefon va savat sinxron to throw bilan, ombor await rejects bilan va query chaqirilmaganini tekshirib, happy path jami bilan. Npm test order service: to'rttasi yashil.»
3. **3–4-qadam: ==chegara testi va `<=` buzish==; isbot — qizargan (✕) testning nomi**
   Ovoz: «Uchinchi qadamda chegara testini qo'shasiz: omborda aynan ikkita. To'rtinchisida order service ts'da kichikni kichik yoki tengga buzib, qaysi test qizarganini ko'rasiz va git checkout bilan tiklaysiz. Isbot maydoniga qizargan test nomini yozing.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz bazasiz xato yo'lini sinaysiz va chegara testining xatoni ushlashini o'zingiz ko'rgansiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Mock va modul | `src/api/order/order.service.spec.ts` — `manager`, `dataSource`, `Test.createTestingModule` (9-ekran) | fayl tayyor |
  | 2 | To'rt test | telefon · savat (`toThrow`) · ombor (`await … rejects.toThrow` + `not.toHaveBeenCalled`) · yetarli (`total` 100000) · `npm test -- order.service` | `Tests: 4 passed, 4 total` |
  | 3 | Chegara | `it("chegara: omborda aynan 2 ta…")` — `stock: 2` · `npm test -- order.service` | `Tests: 5 passed, 5 total` |
  | 4 | Buzish va tiklash | `order.service.ts` 36-satr `<` → `<=` · `npm test -- order.service` · `git checkout -- src/api/order/order.service.ts` | `✕ chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi` |
- Isbot: «4-qadamda qizargan (✕) testning nomi — buyruq emas» · placeholder: «masalan: chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi» · KOD: `/(chegara|aynan 2|2 ta)/i` · xato: «Bu yerga buyruqni emas, terminalda ✕ yonidagi test nomini yozing, masalan: chegara: omborda aynan 2 ta.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | Natija umuman yo'q, `Node.js v24…` | promise xatosiga `toThrow` yoki `rejects` oldida `await` yo'q (11, 13-ekran) |
  | `Nest can't resolve dependencies of the OrderService (?, DataSource)… "OrderRepository" at index [0]` | `providers` da `getRepositoryToken(Order)` yo'q — bo'sh obyekt bilan qo'shing (9-ekran) |
  | `Received message: "Mahsulot topilmadi: Kolonka"` | `mockResolvedValue` shu testda yozilmagan — `findOne` `undefined` qaytardi, kod «topilmadi» dedi |
  | 4-qadamda hammasi `✓` | chegara testi `stock: 2` emas — mock'da aynan 2 va savatda 2 bo'lsin |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `jest2v2-out/05`, `07`, `08`, `09`, `09b`, `09c`, `14a-repository-token-yoq.txt`, `14b-mock-yozilmagan.txt` (✅ KOD 4).

---

## 18 · Sayt API'siga HTTP test: `supertest`  ← `Lesson`
- Kicker: `5-bosqich · HTTP va AI` · Sarlavha: **Sayt ham shunday sinaladi: `supertest` server ochmasdan Nest ilovasiga so'rov yuboradi — `GET /` 200 va JSON, `GET /nope` 404**
- Sahna: terminal `10` (`$ npm i -D supertest @types/supertest` · `supertest 7.3.1`); VS Code `src/api/app.controller.spec.ts` (`kod-11`, Prettier): 1–12 (`Test.createTestingModule({ controllers: [AppController] })` · `app = mod.createNestApplication()` · `await app.init()`) · 14–25 (`request(app.getHttpServer()).get('/')` · `expect(res.status).toBe(200)` · `expect(res.body).toEqual({ ok: true, service: 'order-bot' })` · `/nope` → 404, `res.body.message` `Cannot GET /nope`); terminal `11` (2 ✓).
1. **Jest-1 dagi savol: ==«saytni test qila olamanmi?»== — ha, bitta paket: `supertest`**
   Ovoz: «Jest birinchi darsida savol bor edi: botni sinadim, saytni-chi? Javob: xuddi shunday, bitta qo'shimcha paket bilan. VS Code terminalida npm i minus D supertest va types supertest. Supertest server ochmasdan Nest ilovasiga so'rov yuboradi.» · `10`
2. **`app.controller.spec.ts`: ==Nest ilovasini xotirada ko'taramiz== — `createNestApplication`, `app.init()`**
   Ovoz: «Src, api papkasida app controller spec ts yaratamiz. Before all'da test moduli faqat app controller bilan, keyin create nest application va init. Ilova xotirada ko'tarildi, port ochilmadi, baza yo'q. After all'da yopamiz.» · 1–12
3. **Ikki test: ==`GET /` → 200 va `{ ok: true }`==, `GET /nope` → 404 «Cannot GET /nope»**
   Ovoz: «Birinchi test: get, ildiz manzil. Status ikki yuz, tana ok true va service order bot, to equal bilan. Ikkinchisi error path: yo'q manzil. Status to'rt yuz to'rt, xabar cannot get nope. Npm test app controller: ikkalasi yashil.» · 14–25 + `11`
4. **Xulosa: ==so'rov → status va tana==; bot handler'i ham, sayt route'i ham bir xil sinaladi**
   Ovoz: «Xulosa: HTTP test so'rov yuboradi va statusni, tanani tekshiradi. Bot handler'i ham, sayt route'i ham bitta usulda sinaladi: kirish beriladi, chiqish solishtiriladi. Kattaroq API'da shu qolip har route uchun takrorlanadi. Endi tekshirib olaylik.»
- Manba: `jest2v2-out/10-supertest-ornatish.txt`, `11-http-pass.txt`, `kod-11-app.controller.spec.ts`.

## 19 · Tekshiruv 4 — `GET /nope`  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 5`
- Sarlavha: **Ilovada faqat `GET /` route'i bor. Test `GET /nope` yubordi. `res.status` va `res.body.message` nima bo'ladi?**
- Material (`above`): kod `app.controller.ts` (`@Get() health() { return { ok: true, service: 'order-bot' }; }`) · `app.controller.spec.ts` 21–25 (`request(app.getHttpServer()).get('/nope')`).
- Ovoz: «HTTP testni ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. Ilovada faqat bitta route bor, ildiz. Test yo'q manzilga, nope'ga so'rov yubordi. Status va xabar nima bo'ladi? Variantni tanlang.»
- Variantlar (to'g'risi — 4): 1 200 va `{ ok: true }` — Nest ildizga yo'naltiradi · 2 500 — route topilmagani server xatosi · 3 Test yiqiladi — `supertest` yo'q manzilni yubormaydi · 4 404 va `Cannot GET /nope` — Nest'ning o'z javobi
- To'g'ri (ovoz): «To'g'ri. Nest yo'q manzilga o'zi to'rt yuz to'rt qaytaradi, tanasida message: cannot get nope. Bu kodingizdagi xato emas, kutilgan error path, va test uni aynan shunday kutadi. Demak, yo'q manzil beshyuz emas, to'rt yuz to'rt: mijoz xatosi, server xatosi emas.» · qisqa: «Yo'q route → Nest'ning o'zi 404 va `Cannot GET /nope` — bu kutilgan error path.»
- Isbot (`after`): terminal `11`: `✓ 200 va { ok: true }` · `✓ yo'q manzil — 404` · `Tests: 2 passed, 2 total`.
- Demak: «Yo'q manzil — 404, mijoz xatosi; 500 — server xatosi. Test ikkalasini farqlaydi.»
- Xato izohlari: 1 — «Nest yo'naltirmaydi: route yo'q bo'lsa — 404.» · 2 — «500 — kod ichidagi xato; yo'q route oddiy 404.» · 3 — «`supertest` istalgan manzilga yuboradi; javob 404 keladi, test yiqilmaydi.»
- Maslahat: «Brauzerda yo'q sahifani ochsangiz qaysi raqam chiqadi? Nest ham shuni qaytaradi.»
- Manba: `jest2v2-out/11-http-pass.txt`.

## 20 · AI edge testlar yozdi — ikki topshiriq  ← `Lesson`
- Kicker: `5-bosqich · AI` · Sarlavha: **Yangi ko'nikma davomi: AI edge va xato testlarini yozdi — ikki xil topshiriq, to'rt to'plam, hammasi yashil; endi ularni qabul qilamiz**
- Sahna (26.11, F-1125-01 — Nest-1 darajasi, M56): 1-segmentda bosqich kartasi (Jest-1 dagi kabi): «1–4-bosqich · xato yo'lini siz yozdingiz» (xira) → «5-bosqich · AI yozadi, siz qabul qilasiz» (yonadi); 2-segmentda ikki topshiriq kartasi yonma-yon (`AiReply`): «1-topshiriq · oddiy so'zlar bilan» (`p1-prompt.txt`, 04.11) · «2-topshiriq · Jest tilida» (`p2-prompt.txt`, 26.11); 3-segmentda natija jadvali 2 × 2 (1-AI kuchli model · 2-AI kuchsizroq model × ikki topshiriq): oddiy — 50 / 42 test, 352 / 224 qator, qoida ajratilmadi; Jest tilida — 23 / 23 test, 114 / 90 qator, `isPhone` ajratildi; `rejects` + `await` va «bo'lmasligi kerak» — to'rttalasida ✓; 4-segmentda ikki kod bo'lagi (1-topshiriq): 1-AI `telegram.service.phone.spec.ts` 84–96 (90-satr `["o'rtada probel", '+998 90 123 45 67']`) va 2-AI `telegram.service.spec.ts` 49, 56–57, 61 (57-satr `['+998 90 123 45 67', 'ichida bo\'shliq']`, «rad etiladi» ro'yxatida; oraliq «…»); 2-topshiriqdagi shu satr ko'rsatilmaydi — uni mentor 22-ekranda (Tekshiruv 5) o'zi topadi.
1. **Yana AI bosqichi: ==edge va xato testlarini AI yozadi, siz qabul qilasiz==**
   Ovoz: «Jest birinchi darsidagi kabi oxirgi bosqich AI bilan. Farqi: bu safar AI happy path emas, edge va xato testlarini yozadi, ya'ni bugungi mavzuni. Biz ikki xil AI'ga bitta vazifani ikki xil topshiriq bilan berdik va natijani olib keldik.» · bosqich kartasi
2. **Ikki topshiriq: ==oddiy so'zlar bilan== va ==Jest tilida== — qoida, `it.each`, mock, `rejects`, chegara**
   Ovoz: «Birinchi topshiriq oddiy so'zlar bilan: place va telefon tekshiruvi uchun edge case va xato testlar yoz, npm test yashil bo'lsin. Ikkinchisi bugungi dars tilida: qoidani is phone funksiyasiga ajrat, it each bilan chegaralar, place uchun mock, rejects va await, xatodan keyin update ketmasin. Har AI loyihaning alohida nusxasida ishladi.» · ikki topshiriq
3. **Oddiy: ==50 va 42 test==, qoida ajratilmadi · Jest tilida: ==23 va 23 test==, `isPhone` ajratildi**
   Ovoz: «Natija. Oddiy topshiriqda ikkalasi faqat test fayllarini qo'shdi: ellik va qirq ikki test, telefon qoidasini ajratmadi, uni butun handler orqali to'rtta servisni soxtalab sinadi. Jest tilidagi topshiriqda ikkalasi qoidani is phone'ga ajratdi, testlar yigirma uchtadan, kod ikki barobardan ko'proq qisqa. To'rttalasi ham rejects va await'ni to'g'ri yozdi.» · jadval
4. **Lekin to'rttalasi ham ==probelli raqam rad etilishini «to'g'ri» deb yozdi== — Jest tilidagi topshiriqda ham**
   Ovoz: «Lekin bir narsa to'rttalasida bir xil: probel bilan yozilgan raqam rad etilishini to'g'ri deb test qildi. Biz buni oltinchi ekranda xato deb topgan edik. Jest tilidagi topshiriqda probel holati so'ralgan, lekin javobi yozilmagan edi, AI javobni hozirgi koddan oldi. O'sha satrni tekshiruvda o'zingiz topasiz.» · ikki bo'lak
5. **Xulosa: ==dars tilidagi topshiriq tuzilishni beradi==, qoidani siz aytasiz; yashil — hali tekshiruv emas**
   Ovoz: «Xulosa: topshiriqni dars tilida bersangiz, AI tuzilishni to'g'ri qiladi: qoidani ajratadi, testlar qisqa. Lekin qoidaning o'zini, probelli raqam qabul qilinadimi, siz aytasiz. Yashil hali tekshiruv emas: keyingi ekranda kodni buzib ko'ramiz.»
- Manba: `jest2v2-ai/00-promptlar.md`, `p1-prompt.txt`, `p2-prompt.txt`, `ai1/diff-stat.txt`, `ai2/diff-stat.txt`, `p2/ai1/diff-stat.txt`, `p2/ai2/diff-stat.txt`, `p2/ai*/00-javob.md`, `ai1/telegram.service.phone.spec.ts` 84–96, `ai2/telegram.service.spec.ts` 49–61, `XULOSA.md`, `p2/XULOSA.md`.

## 21 · Buzib tekshirish: AI to'plamlari  ← `Lesson`
- Kicker: `5-bosqich · ichida` · Sarlavha: **Beshta buzish — uchala to'plam hammasini ushladi; oltinchi «buzilish»ni esa buzib bo'lmaydi: AI probelli raqam rad etilishini muhrlab qo'ygan**
- Sahna: buzish jadvali (`MutTable`, `jest2v2-ai/mutatsiya-men.txt`, `mutatsiya-ai.txt`; 26.11 — jadval tagida izoh qatori: Jest tilidagi to'plamlar 23 va 23 test, beshala buzishda bittadan qizardi — `p2/mutatsiya-p2.txt`): | Buzish | Men (25) | 1-AI (50) | 2-AI (42) | — B1 regex 9–13 → 8–13: 1 · 1 · 2 · B2 `<` → `<=`: 1 · 1 · 1 · B3 `UPDATE` tekshiruvdan oldin: 1 · 2 · 1 · B4 xabar o'zgardi: 1 · 3 · 3 · B5 bo'sh savat tekshiruvi yo'q: 1 · 1 · 1; 3-segmentda «muhr» kartasi: Opus testi 90-satr `["o'rtada probel", '+998 90 123 45 67']` (rad kutiladi) ↔ 6-ekrandagi tuzatish `phone.ts` 4-satr `replace(/[\s-]/g, '')` → bu test qizaradi.
1. **Beshta buzish — ==bugungi beshta qoida==: regex chegarasi, `<=`, tartib, xabar, bo'sh savat**
   Ovoz: «Beshta buzish oldik, har biri bugungi bitta qoida. Regex'da to'qqizni sakkizga. Kichikni kichik yoki tengga. Update'ni ombor tekshiruvidan oldinga. Xato xabarini o'zgartirish. Bo'sh savat tekshiruvini olib tashlash. Uchala to'plamni sinadik: bizniki va ikki AI.» · jadval
2. **Natija: ==hamma to'plam beshala buzishni ushladi==, Jest tilidagilar ham — AI xato yo'lini yaxshi yozdi**
   Ovoz: «Natija: uchala to'plam beshala buzilishni ushladi. Bizning yigirma besh testimiz har buzilishda bittadan qizardi. Birinchi AI xabar o'zgarganda uchta test bilan sezdi, ikkinchisi ham hammasini sezdi. Jest tilidagi ikki to'plam ham beshalasini ushladi. Bu safar AI xato yo'lini yaxshi yozdi, buni tan olamiz.» · jadval + izoh qatori
3. **Oltinchi «buzilish» jadvalda yo'q: ==AI probelli raqam rad etilishini muhrladi== — `replace` tuzatishi uning testini qizartiradi**
   Ovoz: «Lekin bitta narsa jadvalga sig'maydi, chunki uni buzib bo'lmaydi: probel. To'rttala to'plam ham probelli raqam rad etilishini test qilib muhrladi. Siz oltinchi ekrandagi replace bilan tuzatsangiz, ularning testi qizaradi. Test qoidani emas, hozirgi kodni qo'riqlayapti. Mijoz odati haqida AI bilmaydi.» · muhr kartasi
4. **Xulosa: AI testi ==xatoni ushlaydi, lekin hozirgi xulqni ham muhrlaydi== — har testdan «bu qoidami?» deb so'rang**
   Ovoz: «Xulosa: AI yozgan test ikki narsa qiladi. Xatoni ushlaydi, bu yaxshi. Va hozirgi xulqni, shu jumladan xatoni ham, muhrlab qo'yadi. Har testni o'qib so'rang: bu qoidami, yoki kod shunchaki hozir shunday ishlaydimi. Avval bitta tekshiruv, keyin o'z AI'ingiz bilan sinab ko'rasiz.»
- Manba: `jest2v2-ai/mutatsiya-men.txt`, `mutatsiya-ai.txt`, `XULOSA.md`, `ai1/telegram.service.phone.spec.ts` 90, `ai2/telegram.service.spec.ts` 58.

## AI-T5 · Tekshiruv 5 — Jest tilidagi topshiriq: AI testining qaysi satri qoidaga zid  ← `LineCheck` (F-1125-01, M56; kod `jest2/parts/06b-ai.jsx`, saytda 22-ekran; matn kodda — generator bu bo'limni o'qimaydi; MD raqamlari 22–25 saytda 23–26)
- Kicker (kodda): `Tekshiruv 5` · Eyebrow: `Tekshiruv · 5 / 5 — qaysi satr qoidaga zid?` · Sarlavha: «Jest tilidagi topshiriq: AI testining qaysi satri 6-ekrandagi qoidaga zid?»
- Kod: `jest2v2-ai/p2/ai1/phone.spec.ts` 4–16 (1-AI, Jest tilidagi topshiriq, aynan); explorer daraxtisiz — 1280 da satrlar to'liq ko'rinsin, fayl yo'li sarlavhada. Tuzatilgandan keyin: `phone.ts` 5-satr (eski/yangi) va `npx jest` natija satri. To'g'ri satr — 13: `{ nomi: 'probel bilan', text: '+998 90 123 45 67', kutilgan: false }` (2-AI da ham 13-satr, `p2/ai2/phone.spec.ts`).
- Vazifa (ekranda): qoida — mijoz raqamni probel bilan yozsa ham bot qabul qiladi (6-ekran, `phone.ts` da `replace`); qaysi satr hozirgi xulqni muhrlaydi — bosing.
- Tuzatish (yurgizilgan, `p2/tuzatish-ai1.txt`): `phone.ts` ga 6-ekrandagi `replace(/[\s-]/g, '')` + 13-satr `kutilgan: true` → `Tests: 23 passed, 23 total`; faqat `replace` bo'lsa — shu test qizaradi, `1 failed, 22 passed` (`p2/mutatsiya-p2.txt` B6).

## 22 · Amaliyot 3 — AI test yozadi, siz buzib tekshirasiz  ← `Practice`
- Kicker: `Amaliyot 3 / 3` · Eyebrow: `Hozir o'zingizda · 20 daqiqa` · Sarlavha: **O'z AI'ingizga aniq shartli prompt bering, keyin to'rt tekshiruv va uchta buzish** · `tableAt: 3`
1. **Endi siz: AI'ga ==shartlari aniq prompt== — `setStatus` ning xato yo'li uchun**
   Ovoz: «Endi navbat sizga. O'z AI'ingizga test yozdirasiz, mavzu: order service'dagi set status funksiyasi, uning xato yo'li. Promptni pastdagi tugma bilan nusxalaysiz. Yigirma daqiqa ketadi.»
2. **1–2-qadam: prompt va ==to'rt tekshiruv== — diff, `await` + `rejects`, `not.toHaveBeenCalled`, «qoidami?»**
   Ovoz: «Birinchi qadamda promptni berasiz. Ikkinchisida natijani tekshirasiz: git diff stat'da faqat spec fayl, promise xatosida await va rejects, xatodan keyin increment chaqirilmaganini tekshiradigan test bor. Va har testdan so'rang: bu qoidami, yoki kod hozir shunday ishlaydimi.»
3. **3–4-qadam: ==uchta buzish== — hammasi qizarsin; isbot — natija**
   Ovoz: «Uchinchi qadamda set status'ni uch joyda navbat bilan buzasiz: bekor tekshiruvini olib tashlang, increment'ni tekshiruvdan oldinga ko'chiring, xabarni o'zgartiring. Har biridan keyin npm test va git checkout. Qizarmagan joyga AI'dan test so'rang. Isbot maydoniga natijani yozing.»
4. **Boshqacha chiqsa, ==«Boshqacha chiqdimi?»== tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz AI yozgan xato yo'li testini ikki qismi bo'yicha qabul qilasiz: xato chiqdi va keyingi qadam bo'lmadi.»
- Prompt (nusxalash): «Loyiha: OrderBotNest (NestJS + Telegraf + TypeORM), Jest sozlangan, testlar `src/` ichida `*.spec.ts`; `src/api/order/order.service.spec.ts` da `place` uchun mock namunasi bor. Vazifa: `OrderService.setStatus(id, status)` uchun unit-testlar yoz (`src/api/order/order.service.spec.ts` ga qo'sh yoki alohida fayl): buyurtma topilmadi → xato; allaqachon `CANCELLED` bo'lgan buyurtmani yana bekor qilish → xato va `increment` chaqirilmaydi; `CANCELLED` qilinganda har mahsulot uchun `increment` chaqiriladi; `CONFIRMED` qilinganda `increment` chaqirilmaydi. Shartlar: baza o'rniga mock (`findOneBy`, `query`, `increment`, `save` — `jest.fn`); promise xatosi `await expect(…).rejects.toThrow('…')` bilan; xato xabarini qo'lda yoz, koddan olma; har `it` da kamida bitta `expect`. Tegma: `src/` dagi `.spec.ts` dan boshqa fayllarga. Javobda: qo'shilgan fayllar ro'yxati va `npm test` natijasi.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Prompt | yuqoridagi prompt — o'z AI'ingizga · `npm test` | `PASS` |
  | 2 | To'rt tekshiruv | `git diff --stat` — faqat `.spec.ts` · `rejects` oldida `await` · `expect(manager.increment).not.toHaveBeenCalled()` bor · har test «qoida»mi yoki «kod hozir shunday»mi — ikkinchisini belgilang | 4 ✓ |
  | 3 | Uch buzish | `order.service.ts` `setStatus`: `if (order.status === 'CANCELLED')` tekshiruvini olib tashlang · `increment` siklini tekshiruvdan oldinga ko'chiring · `allaqachon bekor qilingan` → `bekor` — har biridan keyin `npm test` va `git checkout -- src/api/order/order.service.ts` | har biri `✕` |
  | 4 | Qizarmagan joy | AI'ga: «<buzish> ni hech bir test ushlamadi — shu qoidaga test yoz» · 3-qadamni qaytaring | uchalasi `✕` |
- Isbot: «Uch buzishning natijasi» · placeholder: «masalan: uchalasi qizardi · yoki: increment tartibi — avval qizarmadi, test qo'shdim» · KOD: `/(qizar|fail|✕|uchala|hammasi|test qo'sh)/i` · xato: «Har buzishdan keyin `npm test` natijasini yozing.»
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `git diff --stat` da `order.service.ts` ham bor | AI kodni o'zgartirdi — `git checkout -- src/api/order/order.service.ts`, «Tegma» bandini takrorlang |
  | Natija umuman yo'q, `Node.js v24…` | AI `toThrow` ni promise'da ishlatgan yoki `await` yo'q — 11, 13-ekran; satrni qo'lda tuzating |
  | `increment` tartibi buzilishida hammasi `✓` | «bo'lmasligi kerak» testi yo'q — `not.toHaveBeenCalled` so'rang (15-ekran) |
  | `order.items` `undefined` | mock'dagi buyurtmada `items: []` yo'q — mock'ga `items` bering |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `order-bot` `order.service.ts` `setStatus` 66–87 (`FOR UPDATE`, `allaqachon bekor qilingan`, `increment`); jadval — 1-prompt tajribasi (`XULOSA.md`) asosida: ikkala AI `await`/`rejects`ni to'g'ri yozdi, `${` ishlatmadi.

---

## 23 · Sinfga tayyorgarlik: m4b-03 xaritasi va xato qiladigan joylar  ← `Lesson`
- Kicker: `6-bosqich · sinfga tayyorgarlik` · Eyebrow: `m4b-03 · «Edge cases va error path»` · Sarlavha: **O'quvchi darsi: KitobShop `orderTotal`, «shumtaka mijoz» va guard — siz bilgan yo'lning kichik, bazasiz varianti**
- Sahna: ikki karta: «O'quvchi (m4b-03)» — 21 ekran, `orderTotal(price, quantity)`: 0, manfiy, `'ikki'`, `null` → guard (`if` → `throw` → `return`), `expect(() => …).toThrow()`, uyga vazifa `applyCoupon` · «Siz (bugun)» — `isPhone`, `place` (mock, `rejects`, `not.toHaveBeenCalled`), chegara, HTTP; 2-segmentda lug'at; 3-segmentda «Siz qo'shasiz» jadvali; 4-segmentda xato qiladigan joylar kartalari (3) + «O'quvchi so'rasa» (ovozsiz).
- Lug'at:
  | O'quvchi aytadi | Siz bilasiz |
  |---|---|
  | shumtaka mijoz · g'alati buyurtma | edge case, noto'g'ri kirish |
  | «hech kim sezmaydi» · «jim buzilish» (kartochka) | yashirin buzilish — xatosiz noto'g'ri natija (0, −10000, NaN) |
  | guard · 🚧 shart · 🧯 xato tashlash | `if` → `throw new Error` → `return` |
  | o'rab berish | `expect(() => f()).toThrow()` — sinxron xato |
  | happy path | kutilgan kirish |
- Siz qo'shasiz:
  | Siz qo'shasiz | Qayerda |
  |---|---|
  | «xato chiqdi» + «keyin nima bo'lmadi» — ikki qismli test | s6–s8 guard |
  | `() =>` siz nima bo'ladi — haqiqiy chiqish (11-ekrandagi kabi natija yo'q) | s7 o'rash |
  | chegaraning ikki tomoni: aynan 0 va aynan 100 | uyga vazifa `applyCoupon` |
  | AI yozgan testni bir marta buzdirish | amaliyot oxiri |
- Xato qiladigan joylar:
  | # | Vaziyat | Xabar | Yechim |
  |---|---|---|---|
  | 1 | Himoya yo'q | `Received function did not throw` | guard yozilmagan yoki shart qiymatni o'tkazdi |
  | 2 | `() =>` yo'q | natija yo'q yoki test funksiya xatosi bilan yiqildi | `expect(() => …)` |
  | 3 | Boshqa xabar | `Expected substring` / `Received message` | xabarni koddagi bilan moslang |
- O'quvchi so'rasa:
  - «Nega xato tashlaymiz, 0 qaytarsak bo'lmaydimi?» → 0 — yashirin buzilish: bepul buyurtma; xato esa darhol ko'rinadi.
  - «`toThrow()` ichida xabar shartmi?» → shart emas, lekin xabar bilan test aniqroq: qaysi xato ekanini ham tekshiradi.
  - «`'ikki'` yozsam VS Code qizil chizadi» → TypeScript turini tekshiradi; test uchun `as any` — ataylab noto'g'ri tur beryapmiz.
  - «Guard'ni funksiya oxiriga yozsam bo'ladimi?» → yo'q: xato hisobdan oldin chiqishi kerak, aks holda hisob baribir bajariladi.
1. **m4b-03 — 21 ekran: ==`orderTotal` ga guard==, shumtaka mijoz 0 va manfiy beradi**
   Ovoz: «Endi sinfga tayyorgarlik. O'quvchi darsi m4b-03, yigirma bir ekran. O'quvchi Jest birinchi darsidagi order total funksiyasiga guard qo'shadi: nol, manfiy, matn kelsa xato tashlaydi. Dars buni shumtaka mijoz misolida tushuntiradi: g'alati buyurtma beradigan mijoz. Baza yo'q, promise yo'q, hammasi sinxron.»
2. **O'quvchi so'zlari: ==shumtaka — edge case, guard — `if` `throw` `return`==, o'rab berish — `expect(() => …)`**
   Ovoz: «O'quvchi darsidagi so'zlar: shumtaka mijoz bu edge case. Guard bu if, throw, return. O'rab berish bu expect ichidagi qavs strelka. Kartochkadagi «jim buzilish» esa yashirin buzilish: xatosiz noto'g'ri natija. Sinfda so'zni atamasi bilan birga ayting.» · lug'at
3. **Siz qo'shasiz: ==ikki qismli test, `() =>` siz natija, chegaraning ikki tomoni==**
   Ovoz: «Darsga siz qo'shadigan narsalar. Guard testida ikki qism: xato chiqdi va hisob bajarilmadi. O'rab bermasa nima bo'lishini bir marta haqiqiy terminalda ko'rsating: natija yo'q, bugun o'zingiz ko'rgansiz. Uyga vazifada apply coupon'ning aynan nol va aynan yuz chegaralarini sinattiring.» · jadval
4. **Xulosa: o'quvchi «test natijasi chiqmayapti» desa — ==`() =>` yo'q==; pastda uch vaziyat va savollar**
   Ovoz: «Xulosa: o'quvchi test natijasi umuman chiqmayapti desa, birinchi expect ichidagi o'ramga qarang. Did not throw chiqsa, guard yo'q yoki shart qiymatni o'tkazgan. Pastda uch vaziyat va o'quvchi savollariga tayyor javoblar bor.» · kartalar + QA
- Manba: `src/4b-Modull/EdgeCasesTestLesson.jsx` (`SCREEN_META` 21, s0 shumtaka, s6–s9 guard, s7 o'rash, s15 PickLines, `HW_V2` `applyCoupon`); `jest1-out`/`jest2v2-out/07` (`() =>` siz — natija yo'q bilan bir xil mexanizm).

## 24 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran; M48 — uzunliklar tekis):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | Mijoz «+998 90 123 45 67» yozdi, bot «Raqam noto'g'ri» dedi. Bu qaysi yo'l? | Edge case — qoida mijoz odatidan tor · Error path — kod ataylab xato berdi, to'g'ri · Happy path — raqam to'g'ri, bot ham · Xato emas — mijoz noto'g'ri yozgan | 1 | Haqiqiy raqam, qoida tor. | 5 |
  | 2 | `const PHONE` service ichida, eksport yo'q. Testda nima qilasiz? | Butun botni ko'tarib, Telegram xabarini soxtalaymiz · Qoidani alohida funksiyaga ajratib, uni sinaymiz · Regex'ni testga nusxalab, o'sha yerda sinaymiz · Service'ni `any` qilib, `PHONE` ga kiramiz | 2 | Bitta joy, bot ham test ham shuni chaqiradi. | 3 |
  | 3 | `place` ombor xatosini `transaction` ichida otadi. Qaysi shakl to'g'ri? | `expect(() => service.place(u, c)).toThrow('…')` — o'ram bilan · `expect(service.place(u, c)).toThrow('…')` · `await expect(service.place(u, c)).rejects.toThrow('…')` · `expect(await service.place(u, c)).toThrow('…')` — await ichida | 3 | Promise xatosi — `rejects` va `await`. | 10 |
  | 4 | Promise xatosiga `toThrow` yozildi. `npm test` nima ko'rsatadi? | FAIL — xabar mos kelmadi · PASS — xato ushlanmadi, test o'tdi · FAIL — `toThrow` promise'ni darhol rad etadi · Natija yo'q — jarayon quladi, `Node.js v24` | 4 | Xato promise'da, hech kim ushlamadi. | 11 |
  | 5 | `expect(service.place(u, c)).rejects.toThrow('…')` — `await` yo'q, xabar noto'g'ri. Natija? | Natija yo'q — Jest xatoni testga bog'lay olmadi · FAIL — `Expected` / `Received` farqi aniq ko'rsatiladi · PASS — `rejects` promise'ni o'zi kutib oladi · TypeScript xato — `rejects` oldida `await` shart | 1 | Test promise'ni kutmay tugadi. | 13 |
  | 6 | Xato yo'li testida «xato chiqdi»dan tashqari nima tekshiriladi? | Xato necha millisekundda chiqqani — tezlik · Xatodan keyin `UPDATE` chaqirilmagani · Xato stack'ida qaysi fayl borligi · Xato obyekti `Error` turida ekani | 2 | «Nima bo'lmasligi kerak» — `not.toHaveBeenCalled`. | 15 |
  | 7 | Mock'da omborda 1 ta va 10 ta sinalgan. Kodda `<` → `<=` buzildi. Testlar? | Ikkalasi FAIL — chegara buzilgani uchun · Ombor testi FAIL, happy PASS · Ikkalasi PASS — chegara sinalmagan · Natija yo'q — mock qulaydi | 3 | Farq faqat aynan teng bo'lganda. | 16 |
  | 8 | `supertest` bilan `GET /nope` yuborildi, route yo'q. Javob? | 500 — server route topa olmadi · 200 — Nest ildizga yo'naltiradi · Test yiqiladi — manzil mavjud bo'lmagani uchun · 404 va `Cannot GET /nope` — Nest javobi | 4 | Nest'ning o'z 404 javobi — kutilgan error path. | 19 |
- `passed = ball ≥ 6 && 3 amaliyot isbot bilan`.

## 25 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz** · tartib M13.
- Xulosa 6 band:
  1. Uch yo'l: happy path (kutilgan kirish), edge case (chegara — kod xato bermaydi, javob to'g'rimi), error path (kod ataylab xato beradi — qaysi xabar, keyin nima bo'lmadi).
  2. Sinamoqchi bo'lgan qoidani alohida funksiyaga ajrating (`isPhone`); `it.each` — bir test, ko'p kirish; chegara testi qoidaning tor (probel) va keng (9 ta nol) joyini ko'rsatadi.
  3. Baza o'rniga mock: `jest.fn`, `mockResolvedValue`, `Test.createTestingModule` — unit-test bazasiz, kod haqiqiy.
  4. Sinxron xato — `expect(() => …).toThrow()`; promise xatosi — `await expect(…).rejects.toThrow()`. Shakl noto'g'ri bo'lsa Jest natija bermaydi: jarayon qulaydi (`toThrow` promise'da · `await`siz `rejects`).
  5. Error path testi ikki qismli: xato chiqdi va keyingi qadam bajarilmadi (`not.toHaveBeenCalled`); har `<`/`<=` shartiga aynan teng qiymat bilan chegara testi.
  6. Sayt API'si `supertest` bilan: so'rov → status va tana; 404 — mijoz xatosi, 500 — server xatosi. AI testini qabul qilish: diff · `await` + `rejects` · «bo'lmasligi kerak» testi · buzib tekshirish.
- **Uyga vazifa** (M14, M30): «OrderBotNest'ning o'z nusxangizda `CartService.add` va `UserService.getOrCreate` uchun xato yo'li va chegara testlarini yozing, mock bilan. `add`: `ON CONFLICT` so'rovi aynan bir marta ketadi, `RETURNING qty` qaytgan son qaytariladi; `repo.query` xato bersa — `rejects` va boshqa so'rov ketmaydi. `getOrCreate`: foydalanuvchi bor — `save` chaqirilmaydi; yo'q — bir marta `save`; roli o'zgargan — `save` bir marta. Keyin uchta buzish qiling (tartib, shart, xabar) va README'ga jadval yozing. AI bilan yozsangiz ham bo'ladi, lekin har testda `await` va «bo'lmasligi kerak» qismini o'zingiz tekshiring. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | O'z nusxa | o'z reposingizda `git checkout -b edge-tests` (yoki `jest2-done` dan) | — |
  | 2 | `cart.service.spec.ts` | mock `repo` (`query`, `delete`) · `add` — `query` 1 marta, `RETURNING qty` → natija · `query` rad etsa — `await … rejects.toThrow`, boshqa chaqiruv yo'q | `PASS` |
  | 3 | `user.service.spec.ts` | mock `repo` (`findOne`, `create`, `save`) · bor — `save` 0 · yo'q — `save` 1 · rol o'zgargan — `save` 1 | `PASS` |
  | 4 | Uch buzish | `getOrCreate`: `if (!user)` tekshiruvini olib tashlang · `add`: `rows[0].qty` → `rows.length` · rol tekshiruvi `!==` → `===` — har biridan keyin `npm test`, `git checkout` | har biri `✕` |
  | 5 | README va topshirish | «Testlar» bo'limi: buzish → qizargan test nomi (3 qator) · `git add . && git commit -m "edge va error path testlari"` · `git push` → repo linki platformaga | — |
  Vaqt: 50–70 daqiqa. Tekshiruvchi qaraydi: har promise xatosida `await` + `rejects` · `not.toHaveBeenCalled` kamida ikki testda · README jadvalida 3 buzish, har biri qizargan.
- **Eslatma:** uch yo'l · qoidani ajratish · `it.each` · mock qolipi (`manager`, `dataSource`, `Test.createTestingModule`) · `toThrow` / `rejects.toThrow` / `await` · «natija yo'q» ikki sababi · `not.toHaveBeenCalled` · chegara testi · `supertest` qolipi · AI prompti (22-ekran) · xato qiladigan joylar · o'z uyga vazifangiz. · 26.11 (F-1125-01): «AI testini qabul qilish» bo'limiga — topshiriq dars tilida (qoidani ajrat · `it.each` · mock · `await` + `rejects` · `not.toHaveBeenCalled` · chegara), kutilgan qiymatni o'zingiz yozing
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **CI/CD: testlar lentada** — har push'da `npm test` o'zi yuradi, qizil bo'lsa — to'xtaydi».

---

## «KOD» — qurishda

**Qurishdan OLDIN yurgiziladi — ✅ 04.11 hammasi:**
1. ✅ 04.11 `jest2-done` e15a44c (amend; birinchi commit `telegram.service.ts`siz edi — `WAITING_PHONE` so'zi tekshiruvni yiqitgan, tuzatildi): `telegram.service.ts` → `isPhone` (10, 155–156), `phone.ts`, `phone.spec.ts` (8), `order.service.spec.ts` (5, chegara), `app.controller.spec.ts` (2), `supertest`; `npm test` 25/25, `tsc` toza, Prettier ✓; `12-hammasi.txt` qayta.
2. ✅ 14-ekran LineCheck: `kod-08-order-await-yoq.spec.ts` 51-satr → `target`.
3. ✅ `08b-await-bor-xabar-xato.txt` — `await` + noto'g'ri xabar → oddiy FAIL (`Expected substring: "Planshet…"` · `Received message: "Kolonka…"`).
4. ✅ `14a-repository-token-yoq.txt` (`Nest can't resolve dependencies of the OrderService (?, DataSource)… "OrderRepository" at index [0]… RootTestModule`), `14b-mock-yozilmagan.txt` (`Received message: "Mahsulot topilmadi: Kolonka"` — TypeError emas, 17-ekran jadvali shunga moslandi).
5. ✅ 04.11 AI (2 agent): `jest2v2-ai/ai1` (Opus, 50), `ai2` (Haiku, 42), `XULOSA.md`; `jest2v2-mutatsiya.sh` → `mutatsiya-men.txt`, `mutatsiya-ai.txt` (ikkala AI 5/5 ushladi; probel muhri — 21-ekran kartasi).
6. ✅ `drive-jest2v2.sh` → `jest2v2-out/00…13`, `kod-*.spec.ts` (Prettier), `09b`, `09c`.

**Qurish:**
1. Generator `dev/jest2-matn.py` (jest1-matn.py dan: MD yo'li, OUT; M48 tekshiruvi ichida) · `dev/jest2-kod.py` (jest1-kod.py dan: `jest2-start`/`jest2-done` teglari, `jest2v2-out/kod-*`, `OUT` chiqishlari, `PROMPT1`, `PROMPT2` = 22-ekran prompti).
2. Bo'laklar `jest2/parts/` yangidan (v1 — `dev/jest2-v1-parts-zaxira/`): `04-yordam.jsx` (Jest-1 dan: `Term`, `kod`, `Code`, `AiReply`, `MutTable`, CSS + uch yo'l kartasi, oqim chizmasi, sabab kartasi) · `05-s01-s11.jsx` · `06-s12-s22.jsx` · `07-s23-s25.jsx`.
3. M43: kod sahnalari 8–14 satr, haqiqiy raqamlar; natija kod tagida. M46: terminal «VS Code terminali · OrderBotNest», `$` qatori. M47: 5, 11, 13-ekran oxirgi segmenti — sabab; 11, 13 — sabab kartasi (oqim).
4. Isbotlar: 7 — `/Tests:\s+8 passed,\s+8 total/` · 17 — `/(chegara|aynan 2|2 ta)/i` · 22 — `/(qizar|fail|✕|uchala|hammasi|test qo'sh)/i`.
5. `LESSON_ID` o'zgarmaydi (M44). TgPg/Jest-1 keyingi dars kartalari — Jest-1 yakunidagi karta «Jest: edge cases va xato yo'li — toThrow, Service'ni mock bilan sinash va saytning API'siga birinchi HTTP test» mos.
6. Ovoz keshi → Vercel deploy (ruxsat 04.11) → OrderBotNest `jest2-start`/`jest2-done` push.
