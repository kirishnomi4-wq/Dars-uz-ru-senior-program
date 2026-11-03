# Jest-2 — haqiqiy chiqishlar (01.11.2026, avtopilot)

Yasash: `S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-jest2.sh` (repo ildizidan). O'quvchi reposi GitHub'dan yangi papkaga (`npm install`); har `npm test` toza muhitda (Jest 30 agent muhitida ixcham chiqaradi — `jest1-out/README.md`).
Versiyalar `00`: Node 24.18 · jest 30.4.2 · ts-jest 29.4.11 · typescript 5.9.3. Misol — o'quvchi m4b-03 dagi aynan: `orderTotal` (0, manfiy, 1, `'ikki'`, `null`), guard `throw`, `expect(() => …).toThrow()`; uyga vazifa `applyCoupon(total, percent)`.

| Fayl | Nima |
|---|---|
| 01 | himoyasiz `price * quantity`: 2 → 20000 · **0 → 0** · **−1 → −10000** · 1 → 10000 · **`'ikki'` → NaN** · **`null` → 0** (hammasi jim, xatosiz) |
| 02 | **`.spec.ts`da `orderTotal(10000, 'ikki')` va `null` — `npm test` turlarni tekshirmaydi** (tsconfig `isolatedModules: true` → ts-jest faqat o'tkazadi): test ishlaydi, `Received: NaN`; `null` → 0 → PASS |
| 03 | xuddi shu fayl `npx tsc --noEmit` (VS Code ko'radigani) → `TS2345: Argument of type 'string' is not assignable…` va `'null'` — **muharrirda qizil, `npm test` esa yuradi** |
| 04 | himoyasiz funksiya + `expect(() => orderTotal(10000, 0)).toThrow()` → `Received function did not throw` (0 va −1) |
| 05 | guard (`typeof` · `Number.isNaN` · `<= 0` → `throw new Error(...)`) → 5 test PASS (`'ikki' as any` → `toThrow("…")`) |
| 06 | `() =>`siz `expect(orderTotal(10000, 0)).toThrow()` → test **xatoning o'zi bilan** yiqiladi: `quantity musbat raqam bo'lsin`, `at orderTotal (order.ts:3:11)` |
| 07 | `toThrow('narx xato')` — xabar mos emas → `Expected substring: "narx xato"` · `Received message: "quantity musbat raqam bo'lsin"` |
| 08 | `if`siz `throw` (shartsiz) → happy testlar ham qizil (`2 kitob`, `1 dona`) |
| 09 | `<= 0` o'rniga `< 0` → `0 dona — xato` testi qizil: `Received function did not throw` |
| 10 | `'ikki' as any` himoyasiz → `NaN` |
| 11 | uyga vazifa `applyCoupon` (6 test) + order (5) → `11 passed`; **ikki fayl bo'lsa test nomlari chiqmaydi** — faqat `PASS fayl` (bitta faylda nomlar chiqadi) |
| 12 | `percent > 100` o'rniga `>= 100` → faqat `chegara 100 % — 0` qizil (o'z xatosi bilan) |
| 13 | (MD KOD 5) guard `quantity <= 1` — juda qattiq → `1 dona` testi qizil (funksiyaning o'z xatosi bilan) |
| 14 | `tsconfig` `isolatedModules: false` → ts-jest turlarni tekshiradi: `Test suite failed to run` · `TS2345` (+ `TS151002` ogohlantirish: hybrid module faqat `isolatedModules: true` bilan) — o'quvchi reposida `true`, shuning uchun 02 da test yurgan |
| 15 | `npx jest --verbose` (order + coupon) — ikki fayl, har biri ostida nomlar (14-ekran) |
| 16 | `npm test -- order` — faqat `order.spec.ts` (yo'l bo'yicha filtr): Jest-1 dagi `delivery`/`discount` testlari bo'lsa ham `Tests: 5 passed, 5 total` va nomlar chiqadi |
