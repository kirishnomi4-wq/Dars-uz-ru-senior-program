
\# BUG-01 bo'yicha javob: tuzatilgan namuna (23.10.2026)

Abdulloh, rahmat! Xato haqiqiy, sababi siz yozgandek. Tuzatilgan namuna tayyor.

```text
Fayl:    internet-01-v18-codestrike-bug01-20261023.jsx  (488 442 bayt)
SHA-256: a8549777df82c23c747e4bdc43a8b14dbe45131b91ef0a6ab5256f7349180f38
MD5:     d984f1b1226aa3dda0472aac21fc84b5
```

**SHA haqida — bizning xato.** Sizdagi fayl (`a187effa…`) aynan biz bergan fayl edi, u 16:29 dan beri o'zgarmagan. Oldingi xatda SHA noto'g'ri yozilgan (`92dcd1c7…`). Bu safar summa yuborilayotgan faylning o'zidan olindi.

## Sabab

- Arenada har savolga faqat birinchi javob yoziladi. Taymautda o'tkazib yuborilgan savolga javob yozilmaydi, joyi bo'sh qoladi.
- «↻ Qayta ishlash» arenani 1-savoldan qayta boshlaydi va bu o'yin ham natijaga yozilardi. Bo'sh joyni ikkinchi o'yin to'ldirardi: 6/12 → 7/12, `passed: true`.
- Chatdagi «5/10 → 6/10» misoli ham xuddi shu mexanizm.

## Tuzatish (ikki qatlam)

1. **Natija moduli** (`src/live/resultDetails.js`). Arena savollari doim oldinga keladi (1 → 12, jonli va solo'da). Oldingi yoki o'sha raqamga javob kelsa, yangi o'yin boshlangan bo'ladi. Shu zahoti birinchi o'yin yopiladi, taymautdagi bo'sh joylari bilan birga. Keyingi javoblar yozilmaydi. Yopiq belgisi saqlovda turadi: qayta yuklash, review va «yangi urinish» tugmasidan keyin ham saqlanadi.
2. **Darslar** (182 ta, bitta satr). «↻ Qayta ishlash» endi mashq rejimida o'ynaydi, natijaga umuman yozilmaydi.

Ekrandagi qayta o'yin ballari avvalgidek ko'rinadi, faqat `codestrike` ga kirmaydi. Solo arena javoblari Dars API'ga avvalgidek yuborilmaydi. Dars API va LMS tomonida o'zgarish kerak emas.

## Qabul shartlari

Har bir sharti unit testga aylantirildi (`resultDetails.test.mjs`, jami 36/36). Tuzatish vaqtincha o'chirilganda yangi testlar yiqiladi.

| # | Shart | Natija |
|---|---|---|
| 1 | 6 to'g'ri + 5 xato + taymaut → qayta 12/12 | `answered 11, correct 6, percent 50, passed false` ✓ |
| 2 | bir necha qayta o'yin, qayta yuklash, review'da qayta «Tamom», yangi urinish | o'zgarmaydi ✓ |
| 3 | qayta o'yin bo'sh savolni to'ldirmaydi; `questions[]` va `codestrike` bir xil | arena yozuvlari 11, `quiz-11` yo'q ✓ (o'rtadagi taymaut ham) |
| 4 | 3/12 → qayta 12/12 | 3/12, `passed false` ✓ |
| 5 | 6/12 false, 7/12 true; yaxshi birinchi natija yomon qayta o'yindan keyin | ✓ |
| 6 | javobsiz → `played false, answered 0, correct 0, passed false, mode null` | ✓ |
| 7 | T1–T6 brauzerda | **siz tomonda qayta yurgizish kerak** — biz brauzer stsenariysini (Playwright soati bilan) yurgizmadik |

Boshqa tekshiruvlar: lint (258 fayl), esbuild 258/258, e'lon qilinmagan o'zgaruvchi 0, LMS smoke ✓. Fayl prod Dars API manzili bilan.

## Bitta chekka holat

Agar birinchi o'yinda **birorta ham** javob bo'lmasa (12 savolning hammasi taymaut), natija `played: false` bo'ladi. «Qayta ishlash» mashq bo'lgani uchun hisobga kirmaydi. Lekin o'quvchi o'sha paytda sahifani qayta yuklab, arenani qaytadan boshlasa, bu o'yin birinchi deb hisoblanadi. Buni ham yopish kerak bo'lsa ayting, darsga «o'yin tugadi» signali qo'shiladi.

## Prod haqida

Bugungi prod relizida `codestrike` yo'q, CodeStrike eski formatda qoladi. Bu tuzatish ham, `codestrike` maydoni ham faqat shu QA namunasida. Hamma darsga sizning OK'ingizdan keyin chiqadi.
