# Mentor darsi · Jest-2: edge cases va error path — PRD v1 (01.11 avtopilot; savollar berilmagan, tasdiqlanmagan)

> PRD Ilova A shabloni · kursdagi ichki tartib №6 (M31: raqam yozilmaydi). Haqiqiy chiqishlar `manba/jest2-out/` (README).

**O'quvchi darsi:** **m4b-03** «Edge cases va error path» (`src/4b-Modull/EdgeCasesTestLesson.jsx`, 21 ekran). Ip: Dars 1 dagi `orderTotal`. «G'alati buyurtmalar» (0, manfiy, matn) → reja (4 qadam: happy path vs xato yo'li · chegara 0/manfiy · noto'g'ri ma'lumot va exception · exceptionni sinash) → happy path → edge (0, manfiy, 1 — «chegara 0 bilan 1 orasida») → test → noto'g'ri ma'lumot (`'ikki'` → NaN «jim buzilish», `null` → 0) → guard `throw new Error(...)` → `() =>` bilan o'rash (`toThrow`) → test → guard yig'ish (if → throw → return; shartsiz throw) → … → haqiqiy edge testlarni tanlash → yakuniy (boundary etalon) → amaliyot o'z loyihasida · uyga vazifa `applyCoupon(total, percent)` (0 va 100 ishlaydi, 101 va −1 `toThrow`, `"ikki"` `toThrow`).
**Oldin:** Jest-1. **Keyin:** CI/CD-1 (kurs jadvali §4).

1. **Biladi (3 gap):** happy path va edge case farqini, chegara qiymatlarni (0, manfiy, 1; `<` va `<=`) tanlashni; himoyasiz funksiya noto'g'ri kirishda **jim** noto'g'ri natija berishini (0, −10000, NaN). Guard (`if` → `throw`) yozadi va xatoni `expect(() => …).toThrow()` / `toThrow('xabar')` bilan sinaydi; `() =>`siz nima bo'lishini biladi. Sinf tuzoqini biladi: o'quvchi reposida `npm test` turlarni tekshirmaydi — `'ikki'` testi yuradi, VS Code esa qizil chizadi.
2. **Qo'li bilan (4 amaliyot):** P1 himoyasiz funksiyaga edge testlari → isbot: `Received function did not throw` · P2 guard qo'shish → isbot: `Tests: 5 passed` · P3 `() =>`ni olib tashlash va `toThrow` xabarini buzish → isbot: `Received message` satri · P4 `applyCoupon` 6 test + chegara xatosi → isbot: qizil test nomi.
3. **Haqiqiy loyiha:** o'quvchi reposi, `manba/drive-jest2.sh` → `jest2-out/` 13 fayl (toza muhit).
4. **Buzamiz:** himoyasiz edge (`did not throw`) · `() =>`siz (test xato bilan qulaydi) · `toThrow` xabari mos emas · shartsiz `throw` (happy qizil) · `< 0` (0 o'tadi) · `applyCoupon` `>= 100`.
5. **Ko'prik:** m4b-03 xaritasi · o'quvchi tili (shumtaka mijoz, g'alati buyurtma, jim buzilish, guard, o'rash) · sinfdagi holatlar (`'ikki'` qizil chiziq lekin test yuradi, `as any`, `NaN`, nom chiqmasligi) · vaqt rejasi.
6. **Tekshiruv 4 + o'z-sinov 8.**
7. **Uyga vazifa:** o'quvchi vazifasi + o'z funksiyasiga guard va to'liq chegara testlari → faqat GitHub linki (M30).
8. **Hajm (taxmin):** ~25 ekran · ovoz ~20 daq · amaliyot ~35 daq · jami ~1 soat.
9. **Ochiq / avtopilot takliflari:**
   - **Q1** — o'quvchi darsidagi `orderTotal(10000, 'ikki')` TypeScript faylda: `npm test` yuradi (isolatedModules), VS Code esa `TS2345` ko'rsatadi; to'g'ri yo'l — `'ikki' as any` (sinalgan). Mentor darsida aytiladi; o'quvchi darsiga qo'shish — alohida qaror.
   - **Q2** — o'quvchi darsida `null → 0` «yana bepul buyurtma» deyiladi — sinovda ham shunday (0); `strictNullChecks` VS Code'da xato beradi — mentor biladi.
