# Mentor darsi · Jest-1: birinchi unit-test — PRD v1 (01.11 avtopilot; savollar berilmagan, tasdiqlanmagan)

> PRD Ilova A shabloni · kursdagi ichki tartib №5 (M31: raqam yozilmaydi). Haqiqiy chiqishlar `manba/jest1-out/` (README) — PRD ular bilan yozildi.

**O'quvchi darsi:** **m4b-01** «Unit-test: Jest» (`src/4b-Modull/JestUnitTestLesson.jsx`, 21 ekran). Ip: KitobShop `orderTotal(price, quantity)`. Kirish (qo'lda vs avtomatik) → reja (4 qadam) → «funksiya = mashina» (kirish → chiqish) → Jestbot poygasi (5 hisob qo'lda vs bitta buyruq) → test → o'rnatish (`npm i -D jest ts-jest`, `"test": "jest"`) → test fayli (`order.spec.ts`: import · describe · it · expect) → expect (testni yig'ish) → test → «topshiriq varaqasi» (robot papkasi = describe, sinov varaqasi = it, etalon kartochkasi = expect; expect'siz → «0 ta tasdiq» — yolg'on PASS) → `npm test` → test → AAA (Tayyorlash → Chaqirish → Tekshirish) → FAIL (`*` → `+`, 10002) → test → AI yolg'on testlari (5 tadan 2 tasi haqiqiy) → yakuniy: etalon `toBe(15000)` + noto'g'ri etalon → amaliyot «o'z loyihangiz»: `npm i -D jest ts-jest`, `order.ts` + `order.spec.ts`, buzib FAIL, AI testini tekshirish · uyga vazifa `deliveryFee` (3 test, chegara 100 000, `delivery.ts` + `delivery.spec.ts`).
**Oldin:** Nest-1, Nest-2 (o'quvchi reposi `IntroNestArxitechture`). **Keyin:** Jest-2 (m4b-03 edge cases, `toThrow`).

1. **Biladi (3 gap):** unit-test nima va Jest uni qanday topadi (Nest reposida tayyor sozlama: `rootDir: src`, `.spec.ts`, `ts-jest`); PASS va FAIL natijasini o'qiydi (`Expected` / `Received`, `>` satr, fayl:satr). Yolg'on testlarni taniydi — `expect`siz yashil va noto'g'ri etalon bilan qizil; chegara qiymatni sinashni biladi. Sinfdagi tuzoqlarni oldindan biladi: fayl joyi va nomi, `npm ci`, Nest bo'lmagan loyihada sozlash zanjiri, TypeScript 7.
2. **Qo'li bilan (4 amaliyot):** P1 o'quvchi reposida birinchi test → isbot: `Tests:` satri · P2 kodni buzish, etalonni buzish, `expect`ni olib tashlash → isbot: `Received` qiymati · P3 `deliveryFee` 3 test + chegara xatosi → isbot: qizil test nomi · P4 fayl joyi/nomi tuzog'i → isbot: `No tests found` xabari.
3. **Haqiqiy loyiha:** o'quvchi reposi GitHub'dan yangi papkaga (`manba/drive-jest1.sh` → `jest1-out/` 17 fayl) + bo'sh JS loyiha (Nest'siz zanjir). **Har `npm test` toza muhitda** (Jest 30 agent muhitida ixcham chiqaradi — README).
4. **Buzamiz:** `*` → `+` (FAIL) · noto'g'ri etalon (FAIL, kod to'g'ri) · `expect`siz (PASS — yolg'on) · `>=` → `>` (chegara) · fayl `src/`dan tashqarida / `.test.ts` (`No tests found`) · bo'sh loyiha: ESM → `@types/jest` → TypeScript 7.
5. **Ko'prik:** m4b-01 xaritasi · o'quvchi tili (Jestbot, mashina, robot papkasi, sinov varaqasi, etalon kartochkasi, yolg'on test) · sinfdagi holatlar · vaqt rejasi.
6. **Tekshiruv 4 + o'z-sinov 8.**
7. **Uyga vazifa:** o'quvchi uyga vazifasining kengaytmasi — `deliveryFee` + o'z funksiyasi (masalan chegirma) 3+ test, chegara bilan; bir marta qizil, keyin yashil → faqat GitHub linki (M30).
8. **Hajm (taxmin):** ~26 ekran · ovoz ~25 daq · amaliyot ~35 daq · jami ~1 soat.
9. **Ochiq / avtopilot takliflari:**
   - **Q1** — o'quvchi «o'z loyihasi»: m4b moduli m4a (Nest) dan keyin → taklif: Nest loyihasi (o'quvchi reposi) deb olinadi; Nest bo'lmagan holat alohida ekranda (tuzoq zanjiri).
   - **Q2** — o'quvchi darsidagi `npm i -D jest ts-jest` qadami: Nest reposida keraksiz (Jest bor), lekin zararsiz — o'quvchi darsini o'zgartirish kerakmi — alohida qaror.
   - **Q3** — TypeScript 7 + ts-jest mos emas (01.11): Nest bo'lmagan loyihada `typescript@5` — darsda aytiladi; o'quvchi darsiga qo'shish — alohida qaror.
