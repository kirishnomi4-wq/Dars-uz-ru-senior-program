# Mentor kursi · Jest-2 «Edge cases va error path: noto'g'ri kirishni sinash» — MD v1

F-ID: F-1029-02 (Jest-2) · Sana: 2026-11-01 (avtopilot) · Holat: **KO'RIKDA** ([GATE M] kutilmoqda) · Fidbek: qator yoniga `>> …`
PRD: `11-Jest2-PRD.md` v1 (avtopilot takliflari Q1–Q2)
Fayl (quriladi): `src/mentor-kurs/JestEdgeMentorLesson.jsx` · bo'laklar `src/mentor-kurs/jest2/parts/` · dvigatel — umumiy `parts/01–02`
Qonun: `MENTOR_DARS_ETALON.md` M1–M31 · Haqiqiy chiqishlar: `manba/jest2-out/` (skript `manba/drive-jest2.sh`, har `npm test` toza muhitda)

## 0. Pasport

| Band | Qiymat |
|---|---|
| Kim uchun | Jest-1 ni o'tgan mentor: o'quvchi reposida test yozgan, PASS/FAIL o'qiydi, yolg'on testni taniydi. Xato tashlaydigan funksiyani sinamagan. |
| Dars oxirida mentor | 1) happy path va edge case'ni ajratadi, chegara qiymatlarni tanlaydi · 2) himoyasiz funksiya xato bermay noto'g'ri natija berishini ko'rsatadi · 3) guard yozadi (`if` → `throw` → `return`) · 4) xatoni `expect(() => …).toThrow()` va `toThrow('xabar')` bilan sinaydi, `() =>`siz nima bo'lishini biladi · 5) TypeScript tuzog'ini biladi (test yuradi, VS Code qizil) · 6) m4b-03 ni o'tadi |
| O'quvchi darsi | **m4b-03** «Edge cases va error path» (21 ekran). Oldingi mentor darsi: Jest-1. |
| Kursdagi o'rni | Jest-1 → **shu** → CI/CD (M31: raqamsiz) |
| Til | M9. Yangi atamalar: happy path (oddiy yo'l), edge case (chegara holati), guard (himoya sharti), exception / xato tashlash (`throw`), o'rash (`() =>`). |
| Misol-ip | **O'quvchi darsidagi aynan:** `orderTotal` (Jest-1 dagi) — 0, manfiy, 1, `'ikki'`, `null`; guard xabari `"quantity musbat raqam bo'lsin"`; uyga vazifa `applyCoupon(total, percent)`. Hammasi o'quvchi reposida (`src/`). |
| Haqiqiylik (M10) | 01.11.2026: o'quvchi reposi yangi clone · jest 30.4.2 · ts-jest 29.4.11 · typescript 5.9.3 · har `npm test` toza muhitda. |
| Hajm | **24 ekran** · 6 bosqich · 4 amaliyot · 4 tekshiruv · 8 savol · jami ≈ 1 soat |
| Me'yor | ≤ 5 segment, ≤ 60 so'z, ko'prik, «Xulosa», kalit 8–14 so'z |

---

## A. Darsning tayanchi

**Tushunchalar:**
- **happy path** — oddiy, kutilgan kirish (2 kitob) · **edge case** — chegaradagi qiymat: 0, manfiy, eng kichik (1), noto'g'ri tur (matn, `null`).
- **yashirin buzilish** — himoyasiz funksiya xato bermaydi, noto'g'ri natija qaytaradi: 0 → 0 (bepul), −1 → −10000, `'ikki'` → NaN, `null` → 0.
- **guard** — funksiya boshidagi shart: noto'g'ri kirish bo'lsa `throw new Error('…')`, aks holda hisob. Tartib: `if` → `throw` → `return`.
- **`expect(() => f()).toThrow()`** — funksiya `() =>` ichiga o'raladi, Jest uni o'zi chaqiradi va xatoni tutadi; `toThrow('matn')` — xabar shu matnni o'z ichiga olishi kerak.
- **`Received function did not throw`** — funksiya xato tashlamadi (guard yo'q yoki shart noto'g'ri).
- **chegaraning ikki tomoni** — `<= 0` va `< 0` faqat 0 da farq qiladi; `applyCoupon`da 100 ishlaydi, 101 — xato.
- **TypeScript tuzog'i** — o'quvchi reposida `npm test` turlarni tekshirmaydi (`isolatedModules`): `'ikki'` testi yuradi; VS Code (`tsc`) esa `TS2345` bilan qizil chizadi; to'g'ri yozuv — `'ikki' as any`.

**Darsning ipi:** Jest-1 dagi `orderTotal` → g'alati kirishlar (yashirin buzilish) → edge testlari qizil → guard → `toThrow` bilan sinash va uni buzish → TypeScript tuzog'i → `applyCoupon` (chegaraning ikki tomoni) → m4b-03 ga ko'prik.

**Ekranlar:**

| # | Ekran | Tur | Bosqich |
|---|---|---|---|
| 1 | Kirish | Lesson | — |
| 2 | Happy path va edge case | Lesson | 1 · edge |
| 3 | Yashirin buzilish: 0, −10000, NaN | Lesson | 1 |
| 4 | Tekshiruv 1 — himoyasiz funksiya | MCRetry | 1 |
| 5 | Edge testlari: `did not throw` | Lesson | 2 · guard |
| 6 | Guard: `if` → `throw` → `return` | Lesson | 2 |
| 7 | Amaliyot 1 — edge testlari va guard | Practice | 2 |
| 8 | `() =>` nega kerak | Lesson | 3 · buzamiz |
| 9 | `toThrow('xabar')`: xabar mos emas | Lesson | 3 |
| 10 | Shartsiz `throw` va `< 0` | Lesson | 3 |
| 11 | Tekshiruv 2 — qaysi satr 0 ni o'tkazib yuboradi | LineCheck | 3 |
| 12 | Amaliyot 2 — uch buzish | Practice | 3 |
| 13 | TypeScript: test yuradi, VS Code qizil | Lesson | 4 · tuzoqlar |
| 14 | Ikki fayl — test nomlari ko'rinmaydi | Lesson | 4 |
| 15 | Tekshiruv 3 — `did not throw` | MCRetry | 4 |
| 16 | Amaliyot 3 — `'ikki'` va `as any` | Practice | 4 |
| 17 | `applyCoupon`: chegaraning ikki tomoni | Lesson | 5 · uyga vazifa misoli |
| 18 | Tekshiruv 4 — `>= 100` | MCRetry | 5 |
| 19 | Amaliyot 4 — `applyCoupon` | Practice | 5 |
| 20 | m4b-03 xaritasi | Lesson | 6 · ko'prik |
| 21 | O'quvchi darsidagi so'zlar | Lesson | 6 |
| 22 | Sinfdagi holatlar va o'quvchi savollari | Lesson | 6 |
| 23 | O'z-sinov — 8 savol | Screen27 | — |
| 24 | Yakun | Screen28 | — |

**Sahna turlari:** Jest-1 bilan bir xil — VS Code `IntroNestArxitechture` (to'liq Explorer, `src/order.ts`, `src/order.spec.ts`, keyin `src/coupon.*`) + terminal (`npm test`, toza muhit).

---

## 1 · Kirish  ← `Lesson`
- Kicker: `Kirish` · Eyebrow: `Mentor kursi · Jest` · Sarlavha: **Test to'g'ri kirishni sinadi. Noto'g'ri kirish-chi?**
- Sahna: reja (6 bosqich); natija — terminal: 5 test PASS, ichida `✓ 0 dona — xato`, `✓ matn — xato`.
- Reja: 01 Edge case va yashirin buzilish · 02 Guard · 03 Buzamiz: `toThrow` · 04 TypeScript tuzog'i · 05 Uyga vazifa misoli · 06 O'quvchi darsini o'tish
1. **Jest-1 da to'g'ri kirishni sinadingiz — bugun noto'g'ri kirishni sinaymiz**
   Ovoz: «Assalomu alaykum. Jest birinchi darsida orderTotal'ni oddiy kirish bilan sinadingiz: o'n ming va ikki. Lekin haqiqiy do'konda mijoz nol yozadi, minus yozadi, raqam o'rniga so'z yozadi. Bugun aynan shu noto'g'ri kirishni sinaymiz.»
2. **Himoyasiz funksiya xato bermaydi, balki noto'g'ri natija qaytaradi**
   Ovoz: «Avval ko'ramiz: himoyasiz funksiya noto'g'ri kirishda xato bermaydi, balki noto'g'ri natija qaytaradi. Keyin funksiyaga himoya qo'yamiz va bu himoyani test bilan tekshiramiz.» · reja 01–02
3. **Xato tashlaydigan funksiyani sinash yo'li boshqacha — uni ataylab buzamiz**
   Ovoz: «Xato tashlaydigan funksiyani sinash yo'li boshqacha, va o'quvchilar aynan shu yerda adashadi. Uni uch xil buzamiz. Keyin TypeScript tuzog'ini va o'quvchining uyga vazifasini ko'ramiz.» · reja 03–05
4. **Olti bosqich, to'rt amaliyot. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi**
   Ovoz: «Dars olti bosqichdan iborat, to'rtta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.» · reja 06
- Manba: `jest2-out/05-guard-pass.txt`.

---

## 2 · Happy path va edge case  ← `Lesson`
- Kicker: `1-bosqich · edge` · Sarlavha: **Oddiy yo'l — 2 kitob. Chegaradagi qiymatlar — 0, manfiy, 1**
- Sahna: ikki ustun: «happy path» (`orderTotal(10000, 2)` → 20000) · «edge case» kartalari (0 · −1 · 1 · `'ikki'` · `null`) — segment bilan ochiladi.
1. **Happy path — hamma narsa rejadagidek: mijoz to'g'ri ma'lumot kiritadi**
   Ovoz: «Ikki so'zdan boshlaymiz. Birinchisi happy path, ya'ni oddiy yo'l: hamma narsa rejadagidek, mijoz ikki kitob oladi. Jest birinchi darsida aynan shuni sinadingiz.»
2. **Edge case — chegaradagi qiymat: 0, manfiy va eng kichik haqiqiy qiymat 1**
   Ovoz: «Ikkinchisi edge case, ya'ni chegara holati: oddiy qiymatlarning chetida turgan qiymatlar. Masalan nol dona, minus bir dona va eng kichik haqiqiy buyurtma, ya'ni bir dona. Xatolar ko'pincha aynan shu chetlarda yashiringan.»
3. **Noto'g'ri tur ham edge case: raqam o'rniga so'z yoki bo'sh qiymat**
   Ovoz: «Chegara holatining yana bir turi noto'g'ri ma'lumot: raqam o'rniga ikki degan so'z yoki umuman bo'sh qiymat, ya'ni null. Formada xato bo'lsa, server aynan shunday ma'lumot olishi mumkin.»
4. **Xulosa: har funksiya uchun — bitta oddiy holat va bir nechta chegara holati**
   Ovoz: «Xulosa: har funksiya uchun bitta oddiy holat va bir nechta chegara holati. O'quvchi darsi shunday deydi: chegara nol bilan bir orasida. Endi himoyasiz funksiya bu holatlarda nima qilishini ko'ramiz.»
- Manba: o'quvchi darsi `EdgeCasesTestLesson.jsx` Screen2–3, Screen5–6; `jest2-out/01`.

## 3 · Yashirin buzilish: 0, −10000, NaN  ← `Lesson`
- Kicker: `1-bosqich · edge` · Sarlavha: **Himoyasiz `price * quantity`: xato yo'q — natija noto'g'ri**
- Sahna: «mashina» natijalari (haqiqiy, `01`), har segmentda bitta qator yonadi:
  ```
  orderTotal(10000, 2)      → 20000
  orderTotal(10000, 0)      → 0
  orderTotal(10000, -1)     → -10000
  orderTotal(10000, 1)      → 10000
  orderTotal(10000, 'ikki') → NaN
  orderTotal(10000, null)   → 0
  ```
1. **Nol dona — 0 so'm: bepul buyurtma, xato yo'q**
   Ovoz: «Himoyasiz funksiyani chaqiramiz. Nol dona bersak, natija nol so'm bo'ladi: bepul buyurtma, va hech qanday xato yo'q. Funksiya o'z ishini qildi: o'n ming ko'paytirish nol.»
2. **Minus bir — minus o'n ming: do'kon mijozga pul to'laydimi?**
   Ovoz: «Minus bir dona bersak, natija minus o'n ming: ya'ni do'kon mijozga pul to'lashi kerak. Yana xato yo'q. Bir dona esa to'g'ri hisoblanadi, o'n ming. Demak, chegara nol bilan bir orasida.»
3. **So'z — NaN, null — 0: eng xavflisi, chunki hech kim sezmaydi**
   Ovoz: «Ikki degan so'z bersak, natija NaN, ya'ni not a number, son emas. Null esa nolga aylanadi: yana bepul buyurtma. O'quvchi darsi bu haqda «hech kim sezmaydi» deydi. Eng xavflisi shu: dastur ishlayveradi, xato hech qayerda chiqmaydi.»
4. **Xulosa: himoyasiz funksiya noto'g'ri kirishda xato bermaydi, balki noto'g'ri ishlaydi**
   Ovoz: «Xulosa: himoyasiz funksiya noto'g'ri kirishda xato bermaydi, balki noto'g'ri ishlaydi. To'g'ri yo'l: noto'g'ri kirishni darhol rad etish, ya'ni xato tashlash. Buni ikkinchi bosqichda qilamiz.»
- Manba: `jest2-out/01-himoyasiz-natijalar.txt`, `10-nan.txt`.

## 4 · Tekshiruv 1 — himoyasiz funksiya  ← `MCRetry`
- Kicker: `Tekshiruv 1` · Eyebrow: `Tekshiruv · 1 / 4`
- Sarlavha: **Himoyasiz `orderTotal(10000, -1)` nima qaytaradi?**
- Ovoz: «Yashirin buzilishni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Funksiyada hech qanday himoya yo'q, faqat narx ko'paytirish soni. Unga minus bir dona berildi. Nima qaytadi? Variantni tanlang.»
- Variantlar (to'g'risi — 2): 1 `Error` — manfiy son taqiqlangan · 2 −10000 — xato yo'q, lekin natija noto'g'ri · 3 0 · 4 `NaN`
- To'g'ri (ovoz, `ok`): «To'g'ri, minus o'n ming. Funksiya shunchaki ko'paytiradi, manfiy son uni to'xtatmaydi. Xato yo'q, natija esa noto'g'ri: do'kon mijozga pul to'laydigan bo'ldi. Demak, himoyasiz funksiya noto'g'ri kirishda xato bermaydi, balki noto'g'ri hisoblaydi, shuning uchun himoya kerak.» · qisqa: «−10000 — xato yo'q, lekin natija noto'g'ri. Himoya (guard) kerak.»
- Xato izohlari: 1 — «Xato tashlash uchun funksiyada `throw` bo'lishi kerak — himoyasiz funksiyada yo'q.» · 3 — «0 ni 0 dona beradi; −1 da natija manfiy.» · 4 — «NaN — son bo'lmagan kirishda (`'ikki'`); −1 esa son.»
- Maslahat: «Funksiya faqat ko'paytiradi: 10000 × (−1) = ?»
- Manba: `jest2-out/01`.

---

## 5 · Edge testlari: `did not throw`  ← `Lesson`
- Kicker: `2-bosqich · guard` · Sarlavha: **`toThrow()` kutdi — `Received function did not throw`**
- Sahna: `order.spec.ts` (3 `it`: happy · 0 · manfiy) + terminal FAIL (haqiqiy, `04`).
  ```
  FAIL src/order.spec.ts
    orderTotal
      ✓ 2 kitob narxini hisoblaydi (2 ms)
      ✕ 0 dona — xato (1 ms)
      ✕ manfiy — xato
    ● orderTotal › 0 dona — xato
      expect(received).toThrow()
      Received function did not throw
      >  8 |     expect(() => orderTotal(10000, 0)).toThrow();
  ```
1. **Test avval yoziladi: «0 dona — xato bo'lishi kerak», funksiya hali himoyasiz**
   Ovoz: «Avval test yozamiz: nol dona va minus bir dona xato bo'lishi kerak. Funksiya hali himoyasiz. Expect ichida yangi narsa bor: to throw, ya'ni xato tashlashi kerak. Uning yozilishini sakkizinchi ekranda batafsil ko'ramiz.»
2. **Natija: ikki edge testi qizil, happy path yashil**
   Ovoz: «npm test qilamiz: oddiy holat yashil, ikki chegara holati qizil. Fayl bitta bo'lgani uchun test nomlari ko'rinadi: belgi bilan o'tganlari, iks bilan yiqilganlari.»
3. **`Received function did not throw` — funksiya xato tashlamadi**
   Ovoz: «Xabarni o'qiymiz: received function did not throw. Bu funksiya xato tashlamadi degani, test esa buni kutgan edi. Bu FAIL'da expected va received raqami yo'q, chunki solishtirilgan narsa xato bo'ldi.»
4. **Xulosa: `did not throw` — funksiyada himoya yo'q yoki shart noto'g'ri**
   Ovoz: «Xulosa: did not throw ko'rsangiz, sabab ikkitadan biri. Yo funksiyada himoya umuman yo'q, yo shart bu qiymatni o'tkazib yubordi. Ikkinchisini o'ninchi ekranda ko'ramiz.»
- Manba: `jest2-out/04-himoyasiz-edge-fail.txt`.

## 6 · Guard: `if` → `throw` → `return`  ← `Lesson`
- Kicker: `2-bosqich · guard` · Sarlavha: **Funksiya boshida shart: noto'g'ri bo'lsa — xato, to'g'ri bo'lsa — hisob**
- Sahna: `order.ts` (guard bilan, 6 satr, qism-qism yoritiladi) → terminal: 5 test PASS (`05`).
  ```ts
  export function orderTotal(price: number, quantity: number): number {
    if (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity <= 0) {
      throw new Error("quantity musbat raqam bo'lsin");
    }
    return price * quantity;
  }
  ```
1. **Guard — funksiya boshidagi himoya: avval shart, keyin xato, keyin hisob**
   Ovoz: «Did not throw, chunki himoya yo'q. Endi uni qo'yamiz. Himoya, inglizchasi guard, funksiyaning boshida turadi. Uning tartibi uch qadamdan iborat: avval shart, keyin xato tashlash, keyin oddiy hisob. O'quvchi darsida bu tartibni bloklardan yig'adi.»
2. **Shart uchta tekshiruv: son emasmi, NaN'mi, nol yoki manfiymi**
   Ovoz: «Shartda uchta tekshiruv bor: quantity son emasmi, NaN emasmi va nol yoki undan kichikmi. Biri to'g'ri bo'lsa, funksiya to'xtaydi. Matn ham, minus ham, nol ham shu yerda ushlanadi.»
3. **`throw new Error('…')` — funksiyani to'xtatadi, xabar sababni aytadi**
   Ovoz: «Throw new error funksiyani shu joyda to'xtatadi, return'gacha bormaydi. Xabarni tushunarli yozing, masalan: quantity musbat raqam bo'lsin. Keyin testda aynan shu xabarni tekshirish mumkin.»
4. **Natija: beshala test yashil — happy, 1 dona, 0, manfiy va matn**
   Ovoz: «npm test qilamiz: beshala test yashil. Ikki dona va bir dona hisoblanadi, nol, minus va matn esa xato beradi. Bir dona testi muhim: himoya to'g'ri buyurtmani to'sib qo'ymaganini ko'rsatadi.»
   ```
   PASS src/order.spec.ts
     ✓ 2 kitob narxini hisoblaydi · ✓ 1 dona — eng kichik haqiqiy buyurtma
     ✓ 0 dona — xato · ✓ manfiy — xato · ✓ matn — xato
   Tests:       5 passed, 5 total
   ```
5. **Xulosa: guard qo'yilgach — xato holatlari ham, eng kichik to'g'ri holat ham sinaladi**
   Ovoz: «Xulosa: guard qo'yilgach ikki tomon sinaladi. Noto'g'ri kirish xato beradi, eng kichik to'g'ri kirish hisoblanadi. Faqat birini sinasangiz, himoya juda qattiq yoki juda yumshoq bo'lib qolganini bilmaysiz.»
- Manba: `jest2-out/05-guard-pass.txt`.

## 7 · Amaliyot 1 — edge testlari va guard  ← `Practice`
- Kicker: `Amaliyot 1 / 4` · Eyebrow: `Hozir o'zingizda · 10–15 daqiqa` · Sarlavha: **Avval qizil edge testlari, keyin guard va yashil** · `tableAt: 3`
1. **Endi siz: avval edge testlarini yozasiz va qizilni ko'rasiz, keyin himoya qo'yasiz**
   Ovoz: «Endi navbat sizga. Jest birinchi darsidagi order fayllarini oching. Avval edge testlarini yozasiz va qizilni ko'rasiz, keyin himoya qo'yasiz. Bunga o'n-o'n besh daqiqa ketadi.»
2. **1–2-qadam: 0 va manfiy uchun `toThrow` testlari — `did not throw`**
   Ovoz: «Birinchi qadamda nol va minus bir uchun ikkita test yozasiz: expect ichida o'ralgan funksiya va to throw. Ikkinchisida npm test qilib, did not throw xabarini o'qiysiz.»
3. **3–4-qadam: guard va 1 dona testi; isbot — `Tests:` satri**
   Ovoz: «Uchinchi qadamda funksiya boshiga himoya qo'yasiz. To'rtinchisida bir dona va matn testlarini qo'shib, npm test qilasiz. Isbot maydoniga Tests satrini nusxalang.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz test avval qizil, himoyadan keyin yashil bo'lishini o'z kodingizda ko'rdingiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Edge testlari | `order.spec.ts`: `expect(() => orderTotal(10000, 0)).toThrow();` va `-1` — «Kodni ochish» | fayl saqlandi |
  | 2 | Qizil | `npm test` | `Received function did not throw` (2 ta) |
  | 3 | Guard | `order.ts` — «Kodni ochish» (namuna) | fayl saqlandi |
  | 4 | Yashil | `1 dona` va `'ikki' as any` testlari · `npm test` | `Tests: 5 passed, 5 total` |
- Isbot: «`Tests:` satri» · placeholder: «natijadagi Tests satrini qo'ying» · KOD: `/Tests:\s+5 passed,\s+5 total/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | `Tests: 8 passed` yoki boshqa son, nomlar yo'q | Jest-1 dagi `delivery`/`discount` testlari ham yurdi — `npm test -- order` (faqat order testlari, sinalgan: `jest2-out/16`) |
  | 2-qadamda test xato matni bilan yiqildi | `() =>` yozilmagan — 8-ekran |
  | 4-qadamda `1 dona` qizil, `quantity musbat raqam bo'lsin` | shart `quantity <= 1` — 1 ham taqiqlangan; `quantity <= 0` bo'lsin |
  | `matn — xato` qizil, `Received: NaN`… | `typeof`/`Number.isNaN` tekshiruvi yo'q — guardning 2-satri |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `jest2-out/04`, `05`, `06`, `13-guard-juda-qattiq.txt` (`<= 1` → `1 dona` qizil).

---

## 8 · `() =>` nega kerak  ← `Lesson`
- Kicker: `3-bosqich · buzamiz` · Sarlavha: **`expect(orderTotal(10000, 0)).toThrow()` — test xatoning o'zi bilan qulaydi**
- Sahna: ikki yozuv yonma-yon (o'ralmagan qizil · o'ralgan yashil); terminal (haqiqiy, `06`).
  ```
  ● orderTotal › 0 dona — xato
    quantity musbat raqam bo'lsin
    > 3 |     throw new Error("quantity musbat raqam bo'lsin");
      at orderTotal (order.ts:3:11)
      at Object.<anonymous> (order.spec.ts:11:22)
  ```
1. **O'quvchi darsidagi savol: qaysi yozuv to'g'ri — o'ralganmi yoki o'ralmaganmi?**
   Ovoz: «O'quvchi darsida savol bor: qaysi yozuv to'g'ri? Expect ichida funksiyani to'g'ridan-to'g'ri chaqirishmi yoki strelkali funksiya ichiga o'rashmi? Sinab ko'ramiz: o'rashni olib tashlaymiz.»
2. **O'ralmagan: funksiya expect'dan oldin ishlaydi va xato testni qulatadi**
   Ovoz: «O'ralmagan holatda funksiya expect'ga yetmasdan ishlaydi va xato tashlaydi. Expect uni tutishga ulgurmaydi. Natijada test qizil, lekin xabarda expected va received yo'q, funksiyaning o'z xatosi turibdi: quantity musbat raqam bo'lsin.»
3. **Belgi: FAIL xabarida `at orderTotal (order.ts:…)` — xato funksiya ichidan uchdi**
   Ovoz: «Qanday tanib olasiz: FAIL xabarida expect so'zi yo'q, o'rniga sizning xato xabaringiz va at orderTotal, order ts, uchinchi satr. Ya'ni xato test ichida tutilmadi, funksiyadan to'g'ridan-to'g'ri uchib chiqdi.»
4. **Xulosa: xato kutilsa — funksiya `() =>` ichida; aks holda test o'zi qulaydi**
   Ovoz: «Xulosa: xato kutilayotgan bo'lsa, funksiya doim strelka ichiga o'raladi. Shunda Jest uni o'zi chaqiradi va xatoni tutadi. O'quvchi darsida bu o'rab berish deyiladi.»
- Manba: `jest2-out/06-orovsiz-tothrow.txt`, `05` (o'ralgan — PASS).

## 9 · `toThrow('xabar')`: xabar mos emas  ← `Lesson`
- Kicker: `3-bosqich · buzamiz` · Sarlavha: **`Expected substring` va `Received message` — xato bor, lekin boshqa xato**
- Sahna: test satri `toThrow('narx xato')`; xulosa qadamida (M3) xabar tiklangan → `✓ matn — xato` · `Tests: 5 passed` (`05`); terminal (haqiqiy, `07`):
  ```
  ● orderTotal › matn — xato
    expect(received).toThrow(expected)
    Expected substring: "narx xato"
    Received message:   "quantity musbat raqam bo'lsin"
  ```
1. **`toThrow()` faqat «xato bo'ldimi» deydi — `toThrow('matn')` qaysi xato ekanini tekshiradi**
   Ovoz: «O'rash bilan xato tutildi. Endi qaysi xato tutilganini tekshiramiz. Bo'sh to throw faqat xato bo'ldimi, shuni tekshiradi. Qavs ichiga matn yozilsa, xabar shu matnni o'z ichiga olishi kerak. Bu muhim: funksiya boshqa sabab bilan yiqilsa ham bo'sh to throw yashil bo'lardi.»
2. **Xabar mos emas: `Expected substring` — kutilgani, `Received message` — kelgani**
   Ovoz: «Testda narx xato deb yozdik, funksiya esa quantity musbat raqam bo'lsin deydi. Natija qizil: expected substring, ya'ni kutilgan bo'lak, va received message, ya'ni kelgan xabar. Bu Jest birinchi darsidagi expected va received'ning xato uchun ko'rinishi.»
3. **Xulosa: xabarni tekshiring — u xato qaysi shartdan kelganini aytadi**
   Ovoz: «Xulosa: xato kutilgan joyda xabarni ham tekshiring. Bir funksiyada bir nechta himoya bo'lsa, xabar qaysi biri ishlaganini aytadi. Sinfda buni o'quvchiga ko'rsating: xabar aniq yozilsa, test ham aniq bo'ladi.»
- Manba: `jest2-out/07-tothrow-xabar-mos-emas.txt`.

## 10 · Shartsiz `throw` va `< 0`  ← `Lesson`
- Kicker: `3-bosqich · buzamiz` · Sarlavha: **Shartsiz `throw` — oddiy holat ham qizil; `< 0` — nol o'tib ketadi**
- Sahna: ikki buzilgan `order.ts` navbat bilan; terminal (`08`, `09`); xulosa qadamida (M3) tiklangan holat: `if` bilan, `<= 0` → `Tests: 5 passed` (`05`).
1. **O'quvchi darsidagi tuzoq: `throw` bor, lekin `if` yo'q — har chaqiriq xato beradi**
   Ovoz: «O'quvchi darsida bloklarni yig'ishda tuzoq bor: throw qo'yilgan, lekin shart yo'q. Sinab ko'rdik: endi funksiya har chaqiriqda xato beradi.»
2. **Natija: xato testlari yashil, lekin happy va 1 dona — qizil**
   Ovoz: «Natija avvaliga g'alati ko'rinadi: xato kutgan testlar yashil, lekin ikki dona va bir dona qizil. Shuning uchun oddiy holat testi kerak: u himoya juda qattiq bo'lib qolganini ushlaydi.»
   ```
   ✕ 2 kitob narxini hisoblaydi · ✕ 1 dona — eng kichik haqiqiy buyurtma
   ✓ 0 dona — xato · ✓ manfiy — xato · ✓ matn — xato
   ```
3. **`<= 0` o'rniga `< 0` — faqat «0 dona» testi qizil: `did not throw`**
   Ovoz: «Ikkinchi buzish yumshoqroq: kichik yoki teng o'rniga faqat kichik yozamiz. Minus ham, matn ham ushlanadi, lekin nol o'tib ketadi. Faqat nol dona testi qizil, xabari did not throw. Bu Jest birinchi darsidagi chegara xatosining aynan o'zi.»
4. **Xulosa: happy testi himoyaning qattiqligini, edge testi yumshoqligini ushlaydi**
   Ovoz: «Xulosa: ikki xil test ikki xil xatoni ushlaydi. Oddiy holat testi himoya juda qattiq bo'lsa qizil bo'ladi. Chegara testi esa himoyada teshik bo'lsa qizil bo'ladi. Ikkalasi ham kerak.»
- Manba: `jest2-out/08-shartsiz-throw.txt`, `09-chegara-0.txt`.

## 11 · Tekshiruv 2 — qaysi satr 0 ni o'tkazib yuboradi  ← `LineCheck`
- Kicker: `Tekshiruv 2` · Eyebrow: `Tekshiruv · 2 / 4 — qaysi satr xato?` · Sarlavha: **`0 dona — xato` qizil: `Received function did not throw`**
- Shart (`task`): «Qoida: 0 dona ham noto'g'ri buyurtma — guard uni ushlashi kerak. Bu funksiyada `orderTotal(10000, 0)` xato tashlamadi. **0 ni o'tkazib yuborgan satrni bosing.**»
- Ovoz (`q`): «Buzishlarni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Nol dona testi qizil: did not throw. Qoida: nol dona ham noto'g'ri buyurtma. Nolni o'tkazib yuborgan satrni bosing.»
- Fayl: `src/order.ts`:
  ```ts
  1  export function orderTotal(price: number, quantity: number): number {
  2    if (typeof quantity !== 'number' || Number.isNaN(quantity) || quantity < 0) {   ← xato satr
  3      throw new Error("quantity musbat raqam bo'lsin");
  4    }
  5    return price * quantity;
  6  }
  ```
- Tuzatilgan (`fixed`): 2-satr `quantity < 0` → yashil `quantity <= 0`; `fixedExtra`: terminal `Tests: 5 passed`.
- To'g'ri (ovoz, `ok`): «To'g'ri. Ikkinchi satrda faqat kichik yozilgan: nol noldan kichik emas, shuning uchun shart o'tkazib yuboradi. Kichik yoki teng bo'lsa, nol ham ushlanadi. Ekranda tuzatilgan holat, beshala test yashil. Demak, chegara shartida kichik yoki teng yoziladi, aks holda nol o'tib ketadi.»
- Qisqa (`okShort`): «2-satr: `quantity < 0` — 0 o'tadi. To'g'risi `quantity <= 0`.»
- Maslahat (`hint`): «Xato qaysi qiymatda: 0. Qaysi satr qiymatni tekshiradi va 0 uchun nima qaytaradi?»
- Manba: `jest2-out/09-chegara-0.txt`, `05`.

## 12 · Amaliyot 2 — uch buzish  ← `Practice`
- Kicker: `Amaliyot 2 / 4` · Eyebrow: `Hozir o'zingizda · 10 daqiqa` · Sarlavha: **`() =>`siz, noto'g'ri xabar va `< 0`** · `tableAt: 3`
1. **Endi siz: o'z testingizni uch xil buzasiz va har xabarni o'qiysiz**
   Ovoz: «Endi o'z testingizni uch xil buzasiz. Bunga o'n daqiqa ketadi. Har buzishdan keyin npm test qilib, xabarni o'qing.»
2. **1–2-qadam: `() =>`ni olib tashlang, keyin `toThrow`ga boshqa xabar yozing**
   Ovoz: «Birinchi qadamda nol dona testida strelkani olib tashlang: test funksiyaning o'z xatosi bilan qulaydi. Keyin strelkani qaytaring. Ikkinchisida matn testida to throw ichiga narx xato deb yozing va received message'ni o'qing.»
3. **3–4-qadam: guardda `< 0`, keyin tiklang; isbot — `Received message` satri**
   Ovoz: «Uchinchi qadamda guardda kichik yoki teng o'rniga faqat kichik yozing: did not throw chiqadi. To'rtinchisida hammasini tiklang. Isbot maydoniga ikkinchi qadamdagi received message satrini nusxalang.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, xato kutiladigan testdagi uch xil xabarni endi bir qarashda ajrata olasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | `() =>`siz | `expect(orderTotal(10000, 0)).toThrow();` · `npm test` | `quantity musbat raqam bo'lsin` · `at orderTotal (order.ts:3:11)` |
  | 2 | Boshqa xabar | `toThrow('narx xato')` · `npm test` | `Expected substring` · `Received message` |
  | 3 | `< 0` | `order.ts`: `quantity < 0` · `npm test` | `0 dona — xato` · `did not throw` |
  | 4 | Tiklash | hammasini qaytaring · `npm test` | `5 passed` |
- Isbot: «2-qadamdagi `Received message` satri» · placeholder: «Received message qatorini qo'ying» · KOD: `/Received message:\s*"?quantity musbat raqam/i`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 1-qadamda PASS | o'zgarish boshqa testda qilingan — `0 dona` testidagi `() =>`ni oling |
  | 2-qadamda PASS | `toThrow()` bo'sh qolgan — qavs ichiga matn yozing |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `jest2-out/06`, `07`, `09`.

---

## 13 · TypeScript: test yuradi, VS Code qizil  ← `Lesson`
- Kicker: `4-bosqich · tuzoqlar` · Sarlavha: **`orderTotal(10000, 'ikki')`: `npm test` yuradi, VS Code esa `TS2345`**
- Sahna: ikki ustun: chapda `order.spec.ts` (`'ikki'` va `null` satrlari, qizil to'lqin chiziq maketi); o'ngda terminal `npm test` (`02` — `Received: NaN`, `null` → PASS) va `npx tsc --noEmit` (`03` — `TS2345` ×2).
1. **O'quvchi darsi `'ikki'` va `null`ni sinaydi — TypeScript faylda bu nima bo'ladi?**
   Ovoz: «O'quvchi darsida ikki degan so'z va null bilan sinash bor. Lekin test fayli TypeScript: funksiya son kutadi. Sinab ko'rdik, natija kutilmagan.»
2. **`npm test` turlarni tekshirmaydi: test yuradi, `Received: NaN`**
   Ovoz: «Npm test turlarni tekshirmaydi: o'quvchi reposining sozlamasida isolated modules yoqilgan, shuning uchun ts jest faylni tekshirmasdan o'tkazadi. Test yuradi: matn NaN beradi, null esa nol.»
   ```
   ✕ matn kelsa
   Expected: 0
   Received: NaN
   ```
3. **VS Code esa qizil chizadi: `TS2345: Argument of type 'string' is not assignable…`**
   Ovoz: «Shu fayl VS Code'da qizil chiziq bilan ko'rinadi. Tsc buyrug'i ham shuni aytadi: string turidagi argument number'ga mos emas, null ham mos emas. O'quvchi qizilni ko'radi, lekin test baribir ishlayveradi va u adashadi.»
   ```
   src/order.spec.ts(8,30): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
   src/order.spec.ts(11,30): error TS2345: Argument of type 'null' is not assignable to parameter of type 'number'.
   ```
4. **Xulosa: noto'g'ri turni ataylab sinashda — `'ikki' as any`; qizil chiziq yo'qoladi**
   Ovoz: «Xulosa: noto'g'ri turni ataylab sinamoqchi bo'lsangiz, as any yozing: ikki as any. TypeScript'ga bu ataylab ekanini aytasiz, qizil chiziq yo'qoladi. Sinab ko'rdik, guard bilan bu test yashil.»
- Manba: `jest2-out/02-ts-matn-null.txt`, `03-tsc-turlar.txt`, `05` (`'ikki' as any` → `toThrow` PASS); repo `tsconfig.json` (`isolatedModules: true`, `strictNullChecks: true`).

## 14 · Ikki fayl — test nomlari ko'rinmaydi  ← `Lesson`
- Kicker: `4-bosqich · tuzoqlar` · Sarlavha: **Ikki test fayli bo'lsa — faqat `PASS fayl`; nomlar `--verbose` bilan**
- Sahna: terminal: `npm test` (ikki fayl — `PASS src/order.spec.ts`, `PASS src/coupon.spec.ts`, nomlarsiz) → `npx jest --verbose` (nomlar bilan, `jest2-out/15`).
1. **Bitta faylda Jest har test nomini ko'rsatadi — ikkinchi fayl qo'shilganda ko'rsatmaydi**
   Ovoz: «Endi kichik, lekin sinfda albatta chiqadigan holat. Fayl bitta bo'lsa, Jest har test nomini ko'rsatadi. Ikkinchi test fayli qo'shilganda faqat PASS va fayl nomi qoladi. O'quvchi «testlarim qayoqqa ketdi?» deydi.»
   ```
   PASS src/order.spec.ts
   PASS src/coupon.spec.ts
   Tests:       11 passed, 11 total
   ```
2. **Testlar joyida — jami soni o'zgarmadi; nomlarni ko'rish uchun `npx jest --verbose`**
   Ovoz: «Testlar joyida: pastdagi jami o'n bir. Nomlarni ko'rish uchun npx jest minus minus verbose qiling. Shunda har fayl ostida nomlar va belgilar chiqadi.»
3. **Xulosa: nom ko'rinmasa — xato emas; jami sonni va `--verbose`ni ko'rsating**
   Ovoz: «Xulosa: nomlar ko'rinmasa, bu xato emas. Avval jami songa qarang, kerak bo'lsa verbose bilan yurgizing. FAIL bo'lganda esa qizil test nomi baribir chiqadi.»
- Manba: `jest2-out/11-uyga-vazifa-coupon.txt` (ikki fayl, nomlarsiz), `jest2-out/15-verbose-ikki-fayl.txt`, `jest2-out/12` (FAIL'da nom chiqadi).

## 15 · Tekshiruv 3 — `did not throw`  ← `MCRetry`
- Kicker: `Tekshiruv 3` · Eyebrow: `Tekshiruv · 3 / 4`
- Sarlavha: **O'quvchi: «`Received function did not throw` chiqdi». Bu nima degani?**
- Ovoz: «Tuzoqlarni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi testi qizil: received function did not throw. Bu nima degani? Variantni tanlang.»
- Variantlar (to'g'risi — 1): 1 Funksiya xato tashlamadi — guard yo'q yoki shart bu qiymatni o'tkazdi · 2 Funksiya xato tashladi, lekin boshqa xabar bilan · 3 Test fayli topilmadi · 4 `() =>` yozilmagan
- To'g'ri (ovoz, `ok`): «To'g'ri. Funksiya xato tashlamadi, test esa kutgan edi. Sabab ikkita: guard umuman yo'q yoki shart bu qiymatni o'tkazib yubordi, masalan nol. Funksiyani oching va shu qiymat bilan shartni qo'lda tekshiring. Demak, did not throw — himoya yo'qligi yoki shart teshikligi haqida xabar.» · qisqa: «Funksiya xato tashlamadi: guard yo'q yoki shart qiymatni o'tkazdi.»
- Xato izohlari: 2 — «Boshqa xabar bo'lsa `Expected substring` / `Received message` chiqadi.» · 3 — «Fayl topilmasa `No tests found` bo'ladi.» · 4 — «`() =>`siz test funksiyaning o'z xatosi bilan qulaydi — `did not throw` emas.»
- Maslahat: ««did not throw» — so'zma-so'z: funksiya … qilmadi.»
- Manba: `jest2-out/04`, `06`, `07`, `09`.

## 16 · Amaliyot 3 — `'ikki'` va `as any`  ← `Practice`
- Kicker: `Amaliyot 3 / 4` · Eyebrow: `Hozir o'zingizda · 5–10 daqiqa` · Sarlavha: **Qizil chiziq, lekin test yuradi — o'zingiz ko'ring** · `tableAt: 3`
1. **Endi siz: TypeScript tuzog'ini o'z ko'zingiz bilan ko'rasiz — VS Code va terminal**
   Ovoz: «Endi TypeScript tuzog'ini o'zingiz ko'rasiz. Bunga besh-o'n daqiqa ketadi. VS Code'ni ham, terminalni ham kuzating.»
2. **1–2-qadam: guardni vaqtincha oling, `'ikki'` testi — VS Code qizil, `npm test` yuradi**
   Ovoz: «Birinchi qadamda guard satrlarini vaqtincha izohga oling. Ikkinchisida matn testidagi as any'ni olib tashlang. VS Code qizil chizadi, lekin npm test yuradi va received NaN deydi.»
3. **3–4-qadam: `as any` va guardni qaytaring; isbot — 2-qadamdagi `Received` qiymati**
   Ovoz: «Uchinchi qadamda as any'ni qaytaring: qizil chiziq yo'qoladi. To'rtinchisida guardni qaytaring: hammasi yashil bo'ladi. Isbot maydoniga ikkinchi qadamdagi received qiymatini yozing.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, VS Code'dagi qizil chiziq va terminaldagi natija har xil narsa ekanini o'zingiz ko'rdingiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Guardni olish | `order.ts`: `if (…) { throw … }` — izohga | `return price * quantity` qoldi |
  | 2 | `as any`siz | `expect(orderTotal(10000, 'ikki')).toBe(0);` · `npm test` | VS Code: qizil chiziq · terminal: `Received: NaN` |
  | 3 | `as any` | `'ikki' as any` | qizil chiziq yo'q |
  | 4 | Tiklash | guard va `toThrow` testi · `npm test` | `5 passed` |
- Isbot: «2-qadamdagi `Received` qiymati» · placeholder: «Received yonidagini yozing» · KOD: `/^\s*NaN\s*$/i`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 2-qadamda `Received: 0` | `null` testini sinadingiz — matn testini oling |
  | 2-qadamda `Test suite failed to run` · `TS2345` | `tsconfig`da `isolatedModules: false` — ts-jest turlarni tekshiradi (o'quvchi reposida `true`) — `as any` yozing |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `jest2-out/02`, `03`, `05`, `14-isolated-false-ts2345.txt` (`isolatedModules: false` → `Test suite failed to run`, `TS2345`).

---

## 17 · `applyCoupon`: chegaraning ikki tomoni  ← `Lesson`
- Kicker: `5-bosqich · uyga vazifa misoli` · Sarlavha: **0 va 100 — ishlaydi; −1 va 101 — xato: chegaraning ikki tomoni**
- Sahna: `src/coupon.ts` (guard ×2) + `src/coupon.spec.ts` (6 `it`); terminal `11 passed` → `>= 100` → FAIL (`12`).
1. **O'quvchi uyga vazifasi: kupon — summadan foiz chegirma, 0 dan 100 gacha**
   Ovoz: «Endi o'quvchining uyga vazifasi: apply coupon funksiyasi. U summadan foiz chegirma hisoblaydi. Unda ikki himoya bor: summa son bo'lishi kerak, foiz esa nol bilan yuz orasida. Sinab ko'rdik, beshta emas, oltita test chiqdi.»
   ```ts
   if (typeof total !== 'number' || Number.isNaN(total)) throw new Error(…);
   if (percent < 0 || percent > 100) throw new Error("percent 0 dan 100 gacha bo'lsin");
   return total - (total * percent) / 100;
   ```
2. **Olti test: oddiy (10 %), chegaralar 0 va 100, chegaradan tashqari 101 va −1, matn**
   Ovoz: «Oltita test bor. Oddiy holat: o'n foiz, natija to'qson ming. Chegaraning ichki tomoni, nol foiz va yuz foiz, ishlaydi. Tashqi tomoni, yuz bir va minus bir, xato beradi. Oxirgisi matn summa. Hammasi yashil: ikki fayl bilan o'n bir test.»
3. **`>` o'rniga `>=` — faqat «chegara 100 %» qizil, o'z xatosi bilan**
   Ovoz: «Endi chegara xatosini qilamiz: katta o'rniga katta yoki teng yozamiz. Natijada faqat yuz foiz testi qizil, xabari esa funksiyaning o'z xatosi: percent noldan yuzgacha bo'lsin. Yuz foiz endi taqiqlangan bo'lib qoldi.»
   ```
   ● applyCoupon › chegara 100 % — 0
     percent 0 dan 100 gacha bo'lsin
     > 6 |     throw new Error("percent 0 dan 100 gacha bo'lsin");
   ```
4. **Xulosa: chegaraning ikki tomoni — ichkarida ishlaydi (0, 100), tashqarida xato (−1, 101)**
   Ovoz: «Xulosa: chegaraning ikki tomonini sinang. Ichkaridagi qiymatlar, nol va yuz, ishlashi kerak. Tashqaridagilar, minus bir va yuz bir, xato berishi kerak. O'quvchi vazifasini tekshirganda shu to'rt qiymat bormi, shunga qarang.»
- Manba: `jest2-out/11-uyga-vazifa-coupon.txt`, `12-coupon-chegara-xato.txt`; o'quvchi uyga vazifasi (`HW_V2`).

## 18 · Tekshiruv 4 — `>= 100`  ← `MCRetry`
- Kicker: `Tekshiruv 4` · Eyebrow: `Tekshiruv · 4 / 4`
- Sarlavha: **`applyCoupon` guardida `percent > 100` o'rniga `percent >= 100`. Qaysi test qizil bo'ladi?**
- Ovoz: «Chegarani ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Kupon funksiyasida katta o'rniga katta yoki teng yozildi. Oltita testdan qaysi biri qizil bo'ladi? Variantni tanlang.»
- Variantlar (to'g'risi — 3): 1 `101 % — xato` · 2 `0 %` · 3 `chegara 100 % — 0` · 4 hammasi
- To'g'ri (ovoz, `ok`): «To'g'ri, yuz foiz. Katta yoki teng bo'lsa, yuz ham taqiqlanadi va funksiya xato tashlaydi. Test esa nol natija kutgan edi. Yuz bir baribir xato beradi, u yashil qoladi. Demak, chegarani sinash uchun aynan chegaradagi qiymat testi kerak.» · qisqa: «`>= 100` — 100 ham xato; `chegara 100 %` qizil, qolgan 5 yashil.»
- Xato izohlari: 1 — «101 ikkala shartda ham xato — test yashil qoladi.» · 2 — «0 ga bu shart tegmaydi.» · 4 — «Faqat chegaradagi qiymat farq qiladi.»
- Maslahat: «Ikki shart faqat bitta qiymatda farq qiladi — qaysi biri?»
- Manba: `jest2-out/12-coupon-chegara-xato.txt`.

## 19 · Amaliyot 4 — `applyCoupon`  ← `Practice`
- Kicker: `Amaliyot 4 / 4` · Eyebrow: `Hozir o'zingizda · 15 daqiqa` · Sarlavha: **O'quvchi uyga vazifasi — guard va olti test** · `tableAt: 3`
1. **Endi siz: o'quvchi uyga vazifasini o'zingiz qilasiz — guard va olti test**
   Ovoz: «Oxirgi amaliyotda o'quvchi uyga vazifasini o'zingiz qilasiz: kupon funksiyasi, ikki himoya va oltita test. Bunga o'n besh daqiqa ketadi.»
2. **1–2-qadam: `coupon.ts` va `coupon.spec.ts`, `npm test` — hammasi yashil**
   Ovoz: «Birinchi qadamda coupon ts faylida ikki himoya va hisobni yozasiz. Ikkinchisida coupon spec ts faylida oltita test yozasiz. npm test qilganda hammasi yashil bo'lishi kerak.»
3. **3–4-qadam: `>` → `>=`, qizil test nomini o'qing; isbot — o'sha nom**
   Ovoz: «Uchinchi qadamda katta o'rniga katta yoki teng yozib, npm test qilasiz. To'rtinchisida qizil testning nomini nuqtali satrdan o'qib, isbot maydoniga yozasiz va funksiyani tiklaysiz.»
4. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz o'quvchi uyga vazifasini to'liq qildingiz va uning to'rt chegara qiymatini bilasiz.»
- Qadamlar:
  | # | Qadam | Buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Funksiya | `src/coupon.ts` — «Kodni ochish» | fayl saqlandi |
  | 2 | Testlar | `src/coupon.spec.ts` — 6 `it` · `npm test` | `PASS src/coupon.spec.ts` |
  | 3 | Buzish | `percent > 100` → `percent >= 100` · `npm test` | `1 failed` |
  | 4 | O'qish va tiklash | `●` satr · `>` qaytaring | hammasi yashil |
- Isbot: «Qizil testning nomi» · placeholder: «● satrdagi test nomini yozing» · KOD: `/100\s?%/`.
- «Boshqacha chiqdimi?»:
  | Chiqdi | Sabab va yechim |
  |---|---|
  | 3-qadamda hammasi yashil | 100 % testi yo'q — chegaraning ichki tomonini qo'shing |
  | `toBe(0)` emas, `90000` kutilgan joyda boshqa son | formula: `total - (total * percent) / 100` |
  | `'ikki'` qatorida qizil chiziq | `'ikki' as any` (13-ekran) |
  | Hech biri emas | skrinshot + xato matni — mentor-kurs Telegram guruhiga |
- Manba: `jest2-out/11`, `12`.

---

## 20 · m4b-03 xaritasi  ← `Lesson`
- Kicker: `6-bosqich · o'quvchi darsini o'tish` · Eyebrow: `m4b-03 · «Edge cases va error path»` · Sarlavha: **m4b-03: shumtaka mijoz, guard va o'rash**
  | Blok | O'quvchi ekranlari | Siz qo'shasiz |
  |---|---|---|
  | 1 Kirish | s0 g'alati buyurtmalar · s1 reja (4 qadam) | — |
  | 2 Edge | s2 happy path · s3 edge (0, manfiy, 1) · s4 test · s5 noto'g'ri ma'lumot (NaN, null) | yashirin buzilish natijalari (3-ekran) |
  | 3 Guard | s6 throw · s7 o'rash `() =>` · s8 test · s9 guard yig'ish (if → throw → return) | `() =>`siz nima bo'ladi (8-ekran) · shartsiz throw (10-ekran) |
  | 4 Mustahkamlash | s10–s15 testlar va haqiqiy edge testlarini tanlash | `toThrow('xabar')` (9-ekran) · `< 0` (11-ekran) |
  | 5 Yakun | s16 boundary etalon · amaliyot · uyga vazifa `applyCoupon` | TypeScript tuzog'i (13-ekran) · chegaraning ikki tomoni (17-ekran) |
1. **m4b-03 — 21 ekran: o'quvchi «shumtaka mijoz» kiritgan g'alati buyurtmalarni sinaydi**
   Ovoz: «Endi o'quvchi darsini ko'ramiz: m4b-03, unda yigirma bir ekran bor. O'quvchi shumtaka mijoz kiritgan g'alati buyurtmalarni ko'radi, himoya yig'adi va xatoni test bilan sinashni o'rganadi.»
2. **Guard bloki: o'quvchi o'rashni tanlaydi — siz o'ralmagan holatning xabarini ko'rsatasiz**
   Ovoz: «Guard blokida o'quvchi to'g'ri yozuvni tanlaydi: o'ralgan funksiya. Siz proyektorda o'ralmaganini yurgizib ko'rsating: test funksiyaning o'z xatosi bilan qulaydi. Ko'rgan o'quvchi buni unutmaydi.»
3. **Amaliyot oldidan: `'ikki'` testida `as any` — aks holda VS Code qizil chizadi**
   Ovoz: «Amaliyot va uyga vazifadan oldin bitta ogohlantirish: matn testida as any yozilsin. Yozilmasa, VS Code qizil chizadi, test esa baribir yuradi va o'quvchi adashadi.»
4. **Xulosa: vaqt — guard va o'rashga ko'proq; uyga vazifada to'rt chegara qiymati**
   Ovoz: «Xulosa: vaqt, taklif: to'qson daqiqaning yigirma beshi guard va o'rashga, chunki eng ko'p adashish shu yerda. Uyga vazifani tekshirganda to'rt qiymatga qarang: nol, yuz, minus bir va yuz bir.»
- Manba: `src/4b-Modull/EdgeCasesTestLesson.jsx` — `SCREEN_META` (21), ekran matnlari, `HW_V2`.

## 21 · O'quvchi darsidagi so'zlar  ← `Lesson`
- Kicker: `6-bosqich · o'quvchi darsini o'tish` · Sarlavha: **O'quvchi darsidagi so'zlar: shumtaka mijoz, «hech kim sezmaydi», guard bloklari, o'rab berish**
  | O'quvchi aytadi | Siz bilasiz |
  |---|---|
  | shumtaka mijoz · g'alati buyurtma | edge case, noto'g'ri kirish |
  | «hech kim sezmaydi» (NaN kartochkasi) · kartochkada «jim buzilish» | xatosiz noto'g'ri natija (0, −10000, NaN) — yashirin buzilish |
  | guard · 🚧 shart · 🧯 xato tashlash · ✅ to'g'ri hisob | `if` → `throw new Error` → `return` |
  | o'rab berish | `expect(() => f()).toThrow()` |
  | happy path | oddiy, kutilgan kirish |
1. **O'quvchi darsi «shumtaka mijoz» deydi — siz «edge case» atamasini birga aytasiz**
   Ovoz: «Xaritani ko'rdingiz, endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz. O'quvchi darsi shumtaka mijoz va g'alati buyurtma deydi. Siz uning yonida atamani ham ayting: edge case, ya'ni chegara holati.»
2. **«Hech kim sezmaydi», kartochkada «jim buzilish» — xatosiz noto'g'ri natija; guard esa uch blok: shart, xato, hisob**
   Ovoz: «Xato chiqmasdan natija noto'g'ri bo'lgan holat haqida o'quvchi darsi «hech kim sezmaydi» deydi, kartochkasida esa «jim buzilish» deb yozilgan. Siz buni yashirin buzilish deysiz, ikkalasi bitta narsa. Guard o'quvchi darsida uch blokdan iborat: shart, xato tashlash va to'g'ri hisob. Kodda ular aynan if, throw va return.»
3. **Xulosa: «o'rab berish, ya'ni `() =>`» — so'zni kod bilan birga ko'rsating**
   Ovoz: «Xulosa: o'rab berish deganda strelkali funksiya tushuniladi. So'zni aytganda ekranda kodni ham ko'rsating. Terminal so'zlari esa inglizcha qoladi: did not throw, received message.»
- Manba: `EdgeCasesTestLesson.jsx` Screen0, Screen5–9, kartochkalar.

## 22 · Sinfdagi holatlar va o'quvchi savollari  ← `Lesson`
- Kicker: `6-bosqich · sinfda` · Sarlavha: **Olti holat va tayyor javoblar**
  | # | Holat | Xabar | Yechim |
  |---|---|---|---|
  | 1 | Himoya yo'q | `Received function did not throw` | guard |
  | 2 | `() =>` yo'q | test funksiya xatosi bilan qulaydi | `expect(() => …)` |
  | 3 | Boshqa xabar | `Expected substring` / `Received message` | xabarni moslang |
  | 4 | Happy qizil | guard shartsiz yoki juda qattiq | `if` sharti |
  | 5 | `'ikki'` qizil chiziq | VS Code `TS2345`, test esa yuradi | `as any` |
  | 6 | Nomlar yo'q | ikki fayl | jami son · `--verbose` |
- O'quvchi so'rasa:
  - «Nega xato tashlaymiz, 0 qaytarsa bo'lmaydimi?» → 0 — yashirin buzilish (bepul buyurtma); xato darhol ko'rinadi va keyingi qadamni to'xtatadi.
  - «`toThrow()` va `toThrow('…')` farqi?» → biri «xato bo'ldimi», ikkinchisi «qaysi xato».
  - «`as any` yomon emasmi?» → kodda — ha; testda ataylab noto'g'ri tur berish uchun — joiz.
  - «Hamma funksiyaga guard kerakmi?» → foydalanuvchidan yoki tashqaridan ma'lumot oladigan funksiyaga — ha.
1. **Sinfda albatta chiqadigan olti holat — hammasini bugun o'zingiz ko'rdingiz**
   Ovoz: «Endi sinfda albatta chiqadigan oltita holatni ko'ramiz. Hammasini bugun o'zingiz ko'rdingiz.»
2. **Uch xabar uch sabab: `did not throw`, funksiya xatosi, `Received message`**
   Ovoz: «Birinchi uchtasi xabardan taniladi. Did not throw chiqsa, himoya yo'q. Funksiyaning o'z xabari chiqsa, strelka yo'q. Received message chiqsa, boshqa xato tutilgan.» · 1–3-karta
3. **Happy qizil, `'ikki'` qizil chiziq, nomlar yo'q — shart, `as any`, `--verbose`**
   Ovoz: «To'rtinchisi: oddiy holat qizil bo'lsa, himoya juda qattiq. Beshinchisi: matn testida qizil chiziq bo'lsa, as any yozing. Oltinchisi: nomlar ko'rinmasa, sabab ikkita fayl.» · 4–6-karta
4. **Xulosa: xabarni o'quvchi bilan birga o'qing — har xabar boshqa sababni aytadi**
   Ovoz: «Xulosa va usul bitta: javobni darhol aytmang, xabarni o'quvchi bilan birga o'qing. Bu darsda har xabar boshqa sababni aytadi. Pastda o'quvchi savollariga tayyor javoblar bor.» · QA
- Manba: `jest2-out/02…12`.

## 23 · O'z-sinov — 8 savol  ← `Screen27`
- Kicker: `O'z-sinov` · Sarlavha: **Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz**
- Savollar (`FINAL`; to'g'ri o'rinlar 1/2/3/4 — ikkitadan; `s` — qaytiladigan ekran):
  | # | Savol | Variantlar | ✔ | Izoh | s |
  |---|---|---|---|---|---|
  | 1 | Himoyasiz `orderTotal(10000, 0)` nima qaytaradi? | `Error` · 0 — xatosiz · `NaN` · 10000 | 2 | Yashirin buzilish: bepul buyurtma. | 3 |
  | 2 | `Received function did not throw` nimani bildiradi? | funksiya xato tashlamadi · boshqa xabar · fayl topilmadi · `() =>` yo'q | 1 | Guard yo'q yoki shart qiymatni o'tkazdi. | 5 |
  | 3 | Xato kutilayotgan testning to'g'ri yozuvi? | `expect(f(0)).toThrow()` · `f(0).toThrow()` · `expect(() => f(0)).toThrow()` · `expect(f(0)).toBe(0)` | 3 | Jest o'ralgan funksiyani o'zi chaqiradi. | 8 |
  | 4 | `() =>`siz `toThrow` — natija? | PASS · `did not throw` · `No tests found` · test funksiyaning o'z xatosi bilan qulaydi | 4 | Funksiya expect'dan oldin ishlaydi. | 8 |
  | 5 | Guardda `<= 0` o'rniga `< 0`. Qaysi test qizil? | `0 dona — xato` · `manfiy — xato` · `2 kitob` · `matn — xato` | 1 | Faqat 0 da farq. | 10 |
  | 6 | `.spec.ts`da `orderTotal(10000, 'ikki')` — o'quvchi reposida nima bo'ladi? | `npm test` yurmaydi · VS Code qizil, test yuradi — `NaN` · hech narsa · `No tests found` | 2 | `isolatedModules` — ts-jest turlarni tekshirmaydi. | 13 |
  | 7 | `applyCoupon`da `> 100` o'rniga `>= 100`. Qaysi test qizil? | `101 %` · `0 %` · `chegara 100 %` · hammasi | 3 | 100 ham taqiqlanadi. | 17 |
  | 8 | Kupon uchun chegaraning ikki tomoni — qaysi to'rt qiymat? | 10, 20, 30, 40 · 1, 2, 3, 4 · 50, 60, 70, 80 · 0, 100, −1, 101 | 4 | Ichkari ishlaydi, tashqari xato. | 17 |
- `passed = ball ≥ 6 && 4 amaliyot isbot bilan`.

## 24 · Yakun  ← `Screen28`
- Kicker: `Yakun` · Sarlavha: **Endi siz bilasiz**
- Xulosa 6 band: (1) happy path va edge case; yashirin buzilish (0, −10000, NaN, null → 0) · (2) guard `if` → `throw` → `return`; 1 dona testi · (3) `expect(() => …).toThrow()`; `() =>`siz test qulaydi; `toThrow('xabar')` · (4) `did not throw` — himoya yo'q yoki shart teshik; shartsiz throw — happy qizil · (5) TypeScript: test yuradi, VS Code qizil — `as any`; ikki fayl — `--verbose` · (6) chegaraning ikki tomoni: 0/100 ishlaydi, −1/101 xato.
- **Uyga vazifa** (M14): «Jest birinchi darsidagi o'z funksiyangizga himoya qo'ying: noto'g'ri tur, chegaradan tashqari qiymatlar xato bersin, xabar aniq bo'lsin. Har chegara uchun ikki tomonli test. Bir marta strelkani olib tashlab qulashni ko'ring. Apply coupon testlarini ham qo'shing. GitHub'ga chiqaring va linkni platformadagi uyga vazifaga qo'ying.»
  | # | Qadam | Fayl / buyruq | Kutilgan |
  |---|---|---|---|
  | 1 | Guard | Jest-1 dagi `discount.ts` (yoki o'z funksiyangiz) — tur va chegara, aniq xabar | — |
  | 2 | Testlar | ichki va tashqi chegara + `toThrow('xabar')` + `'…' as any` | `PASS` |
  | 3 | Buzish | `() =>`ni olib tashlang → qulash → tiklang | — |
  | 4 | Kupon | `src/coupon.ts` + `src/coupon.spec.ts` (6 test) | `11+ passed` |
  | 5 | Topshirish | `git push` → repo linki platformadagi uyga vazifaga (M30) | — |
  Vaqt: 40–60 daqiqa. Tekshiruvchi qaraydi: guard funksiya boshida · chegaraning ikki tomoni · `() =>` bilan `toThrow` · matn holati `as any` bilan.
- Keyingi dars kartasi: «Kursdagi keyingi mentor darsi: **CI/CD nima va nega** — testlar har push'da o'zi yursin».

---

## «KOD» — qurishda
1. Jest-1 yordamchilari (`ts()`, `jt()`, `Term`, Explorer) — Jest-2 bo'lagida nusxa; generator `dev/jest2-matn.py`.
2. Chiqishlar `jest2-out/` dan aynan (toza muhit).
3. LineCheck (11-ekran): MD'dagi 2-satr → `target={1}`.
4. 13-ekran «qizil to'lqin chiziq» — VS Code ko'rinishi maketi (CSS `text-decoration: wavy`), yonida haqiqiy `tsc` chiqishi.
5. **✅ 01.11 yurgizildi** (`drive-jest2.sh` 13–14 → `jest2-out/13`, `14`; 7-ekran jadval qatori aniqlashtirildi: `<= 1`). Avvalgi ro'yxat: 7-ekran «`1 dona` qizil» holati (`quantity < 1`? — natija yozilgach jadval qatori moslanadi) · 16-ekran «boshqa sozlamada `TS2345` bilan test yurmaydi» (`isolatedModules: false` bilan).
6. Isbotlar: 7 — `/Tests:\s+5 passed,\s+5 total/` · 12 — `/Received message:\s*"?quantity musbat raqam/i` · 16 — `/^\s*NaN\s*$/i` · 19 — `/100\s?%/`.

## Ochiq savollar ([GATE M])
1. 13-ekran (TypeScript tuzog'i) — o'quvchi darsiga ham `as any` qo'shilsinmi — alohida qaror (PRD Q1).
2. Uyga vazifa — Jest-1 dagi o'z funksiyasi davomi (`discount.ts`) — tasdiqlang.

## O'quvchi darslari uchun alohida ish (qaror kerak; tegilmadi)
1. **m4b-03**: `orderTotal(10000, 'ikki')` va `null` TypeScript testida — `as any` yozilmasa VS Code qizil (`TS2345`), test baribir yuradi.
2. **m4b-03**: ikki test fayli bo'lganda nomlar ko'rinmasligi aytilmagan (uyga vazifada `coupon.spec.ts` qo'shilganda).
