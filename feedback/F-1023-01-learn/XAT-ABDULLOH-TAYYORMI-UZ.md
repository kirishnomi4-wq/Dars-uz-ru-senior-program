# CodeStrike → Learn: hamma darsga chiqarishga tayyormizmi? (26.10.2026)

Abdulloh, salom!

Oxirgi faylni sinab, «ishlayapti» deganingiz uchun rahmat. Hamma darsga chiqarishdan oldin
sizdan bir nechta narsani aniqlab olmoqchimiz.

## Qaysi fayl haqida

```text
Fayl:    internet-01-v18-codestrike-bug01-v2-20261023.jsx  (490 810 bayt)
SHA-256: ba2268cfcac0ccc5a230d46d9fecc539b6c022992ed67c8ceb7a09f036a30627
```

LMS'da «Test uchun» kursida turibdi: Class 2848 «1-sinov dars internetlesson»,
u Learn 3152 «1-darsni testlaymiz» ga bog'langan.

## Biz tomonda bugun tekshirilgani

- Tuzatish hozirgi kodga ziddiyatsiz tushadi.
- Shu fayl hozirgi koddan qayta yig'ildi. SHA aynan bir xil chiqdi, demak siz sinagan fayl relizga chiqadigan kodning o'zi.
- Unit testlar 44/44 o'tdi.
- CodeStrike bor 182 darsning hammasida o'yin belgilari turibdi. Hammasi esbuild'dan xatosiz o'tdi.
- 2-modulning 14 darsi brauzerda ochib ko'rildi, xato chiqmadi.

## Savollar

1. **Holatlar.** Quyidagi holatlarning hammasi o'tdimi?

   | # | Holat | Kutilgan natija |
   |---|---|---|
   | T1 | Sinfda, 8/12 | `passed: true`, Learn yopiladi |
   | T2 | Sinfda, 5/12 | `passed: false`, Learn ochiladi |
   | T3 | Mentor arenani boshlamadi | `played: false`, Learn ochiladi |
   | T4 | Uyda, 7/12 | `passed: true`, `mode: "solo"` |
   | T5 | Uyda, 3/12, keyin qayta o'ynab 12/12 | birinchi o'yin qoladi: 3/12, `passed: false` |
   | T6 | Tugagan darsni qayta ochib «Tamom» | Learn holati o'zgarmaydi |

   BUG-01 ning 6 sharti (taymaut, yopib qayta ochish, sahifani qayta yuklash, solo → jonli) ham o'tdimi?

2. **LMS prodda tayyormi?** `codestrike` maydonini o'qiydigan qism prodda ishlayaptimi? Kerakli mantiq: 7/12 va undan ko'p bo'lsa Learn yopiladi, kam bo'lsa ochiladi.

3. **Learn'siz darslar.** `codestrike` maydoni 182 darsning hammasiga qo'shiladi. Learn'ga bog'lanmagan darsda bu maydon hech narsaga ta'sir qilmaydi, to'g'rimi?

4. **Learn savollari.** Har dars uchun 12 ta savolni (uz + ru) JSON qilib biz tayyorlaymiz. Format qanday bo'lishi kerak? Bitta namuna yubora olasizmi?

## Javobingizdan keyin

«Tayyor» deb yozsangiz:

1. Tuzatishni hamma darsga qo'llaymiz.
2. Testlar va tekshiruvlarni qayta o'tkazamiz.
3. Darslarni yangi versiya qilib yig'amiz va CRM'ga yuklaymiz.

Yuklashdan oldin fayllar ro'yxatini va SHA'larini sizga yuboramiz.

Biror holat o'tmagan bo'lsa, qaysi biri ekanini va nima chiqqanini yozing. Avval tuzatamiz, keyin chiqaramiz.
