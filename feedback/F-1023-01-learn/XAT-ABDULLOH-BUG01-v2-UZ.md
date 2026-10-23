# BUG-01 — ikkinchi tuzatish (23.10.2026, review'ga javob)

Abdulloh, review uchun rahmat — ikkala topilma ham to'g'ri edi. Javob tartibiga qarab taxmin qilish yetmasdi.
Endi o'yin chegarasi aniq belgi bilan qayd etiladi.

```text
Fayl:    internet-01-v18-codestrike-bug01-v2-20261023.jsx  (490 810 bayt)
SHA-256: ba2268cfcac0ccc5a230d46d9fecc539b6c022992ed67c8ceb7a09f036a30627
MD5:     598f885dfb25a3cdfdf4bece121a5921
```

Oldingi namuna (`a8549777…`) bekor — shu fayl bilan tekshiring.

## Nima o'zgardi

**Darsda (QuizArena, 183 fayl):**
- Arena har ochilganda o'zining o'yin-ID'sini oladi (`arenaRun`).
- Birinchi savol ko'ringanda `live.arenaStart(arenaRun)` chaqiriladi. Bu solo'da va jonli rejimda (o'quvchi) ishlaydi.
- `live.arenaDone()` quyidagi holatlarda chaqiriladi:
  - oxirgi savoldan keyin (solo `done`);
  - jonli test yakunlanganda (`quiz_state = done`);
  - «↻ Qayta ishlash» yoki mashq rejimiga o'tilganda.

**Natija modulida (`src/live/resultDetails.js`):**
- Birinchi boshlangan o'yin saqlovga yoziladi: `arenaGame { run, mode, pin }`.
- Boshqa o'yin-ID bilan yangi o'yin boshlansa, birinchi o'yin shu zahoti yopiladi (`arenaClosed`). Javobsiz bo'lsa ham yopiladi. Bunga kiradi:
  - arenani yopib qayta ochish;
  - sahifani qayta yuklash;
  - solo'dan jonli rejimga o'tish yoki aksincha.
- Istisno: xuddi o'sha mentor sessiyasiga (`student` + o'sha PIN) qayta ulanish o'yinni davom ettiradi. O'quvchi jonli test vaqtida arenani yopib ochsa, qolgan savollar yo'qolmaydi.
- Yopilgandan keyin hech qanday javob yozilmaydi. `codestrike` va `questions[]` dagi arena yozuvlari bir xil to'plamdan hisoblanadi.
- Belgilar saqlovda turadi: qayta yuklash, review, «yangi urinish» va **solo → jonli avtomatik o'tish**dan keyin ham. Siz topgan 1183-qatordagi `resetResultDetails` endi `keepArena: true` bilan chaqiriladi.
- Oldingi tartib qoidasi ham qo'shimcha himoya sifatida qoldi.

Solo arena javoblari Dars API'ga avvalgidek yuborilmaydi. Dars API va LMS tomonida o'zgarish kerak emas.

## Yopish shartlari — unit testlar (`resultDetails.test.mjs`, jami 44/44)

| # | Sizning shartingiz | Test natijasi |
|---|---|---|
| 1 | 6 + 5 xato + taymaut → «Qayta ishlash» 12/12 | `answered 11, correct 6, passed false` ✓ |
| 2 | yopib qayta ochish → 1–11 taymaut, 12 to'g'ri | o'zgarmaydi ✓ (natija oynasida yopilgan holat ham) |
| 3 | 2-stsenariy qayta yuklashdan keyin | o'zgarmaydi ✓ |
| 4 | javobsiz birinchi o'yin → qayta ochish yoki qayta yuklash → muvaffaqiyatli o'yin | `played false, answered 0` ✓ |
| 5 | yomon birinchi solo → avtomatik jonli → muvaffaqiyatli o'yin | birinchi natija qoladi, `mode: solo` ✓ |
| 6 | muvaffaqiyatli birinchi → yomon qayta o'yinlar | 7/12 `passed true` qoladi; `questions[]` arena soni va to'g'rilari `codestrike` bilan teng ✓ |
| + | jonli: o'sha PIN'ga qayta ulanish | o'yin davom etadi (12/12) ✓; boshqa PIN — hisobga kirmaydi ✓ |

**Mutatsiya tekshiruvi.** Himoyalar vaqtincha o'chirilganda testlar yiqildi:
- «yangi ochilish yopadi» qoidasisiz 5 test yiqildi;
- `keepArena` saqlovisiz 2 test yiqildi.

**Boshqa tekshiruvlar:** lint (258 fayl), esbuild 258/258, e'lon qilinmagan o'zgaruvchi 0, LMS smoke ✓, preview smoke 3/3. Fayl prod Dars API manzili bilan.

## Halol chegara

Brauzerda (Playwright, taymautlar bilan) biz tomonda yurgizilmadi. Sabab: solo/student rejimi uchun LMS tokeni kerak. Yuqoridagi 6 shart modul darajasida tekshirildi. Darsdagi chaqiruvlar 183 faylning hammasida bir xil ekani skript bilan sanaldi. Iltimos, T1–T6 va 1–6 shartlarni brauzerda qayta yurgizing.

## Prod haqida

Bugungi prod relizida `codestrike` yo'q, CodeStrike eski formatda qoladi. Bu tuzatish faqat shu QA namunasida. Hamma darsga sizning OK'ingizdan keyin chiqadi.
