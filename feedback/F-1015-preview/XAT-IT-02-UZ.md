# JSX preview: ikki izolyatsiya defekti tuzatildi (21.10.2026 handoff'iga javob)

Hamkasblar, salom!

`jsx_preview_owner_handoff_2026-10-21.md` ni o'qib chiqdik. Rahmat, aniq va batafsil yozilgan ekan.

## 1. Qisqacha

Ikkala defektni ham tasdiqlaymiz. Sabab bizning tomonda: hamma JSX'ga kiradigan umumiy `src/live/previewMode.js` modulida.

Kontraktda yangi `previewRunId` faqat sahifa ochilganda yoki F5 bosilganda keladi, deb yozilgan edi. Shuning uchun preview rejimi sahifa yopilguncha yoqiq turardi. Sahifa qayta yuklanmasdan (SPA) yangi ishga tushirish bo'lishini hisobga olmaganmiz.

Tuzatish manba modulning o'zida qilindi. CRM/LMS kontrakti o'zgarmaydi.

## 2. O'zimiz topgan qo'shimcha muammo

Natija moduli (`result_details`) xotirasi ham butun sahifa uchun umumiy edi. Preview'dagi javoblar o'sha SPA ichida xuddi shu darsning keyingi oddiy darsi natijasiga aralashib ketishi mumkin edi. Bu ham tuzatildi.

## 3. Nima o'zgardi

- Rejim har ishga tushirishda (mount) proplardan qayta aniqlanadi:
  - `visitMode="preview"` + yangi `previewRunId` → yangi, bo'sh preview xotirasi;
  - o'sha `previewRunId` (rerender yoki remount) → holat saqlanadi;
  - preview proplari yo'q → preview o'chiq, odatdagi saqlov va odatdagi jonli so'rovlar ishlaydi.
- Bitta ishga tushirish ichida rejim o'zgarmaydi.
- Natija xotirasi har yangi ishga tushirishda tozalanadi.
- Jonli darsdan keyin preview ochilsa, jonli darsning so'nggi progress yozuvi baribir yuboriladi, aks holda progress yo'qolardi. Preview'ning o'zi hech qanday so'rov yubormaydi.

## 4. Qanday tekshirdik

`internet-01-v18` darsida sizning ssenariylaringizni brauzerda takrorladik: sahifa qayta yuklanmaydi, dars qayta mount qilinadi.

| Yig'ma | Natija |
|---|---|
| Eski (QA'dagi kabi) | O'tishdan keyin ekran `02/22` da qoladi. Mentor darsida «Предпросмотр» belgisi qoladi. **Ikkala defekt takrorlanadi** |
| Yangi | Preview B `01/22` dan boshlanadi. Mentor darsida preview belgisi yo'q, `/lms/join` so'rovi ketadi. Jonli → preview o'tishda so'rov 0 ta, haqiqiy `ccProgress` o'zgarmaydi |

Unit-testlar: 25/25.

## 5. Acceptance criteria holati

| Holat | AC |
|---|---|
| ✅ Yopildi (bizda tekshirildi) | AC-1, AC-2, AC-3, AC-5, AC-8, AC-9 |
| 🔍 Sizning QA tekshiruvingiz kerak (haqiqiy akkauntlar bilan) | AC-4 (o'quvchi), AC-10. Mantiq AC-3 bilan bir xil |
| ⏸ Bu tuzatishda yopilmadi | AC-6, AC-7 |

**AC-6** (bitta sahifada bir vaqtda ikki dars) va **AC-7** (`Storage.prototype`ga tegmaslik) nega yopilmadi:
- Buning uchun hamma darslarda saqlov bilan ishlashni qayta yozish kerak: 177 faylda taxminan 750 joy. Regressiya xavfi yuqori.
- Hozirgi almashtirish faqat bizning kalitlarimizga tegadi (`ccProgress:`, `liveSession:` va hokazo) va faqat preview ishga tushirish paytida ishlaydi. Qolgan vaqtda u shaffof.
- LMS kalitlariga tegilmaydi.

## 6. Ma'lum cheklov

Agar oldingi dars kodi yangi dars mount bo'lgandan keyin `localStorage`ga biror narsa yozsa, bu yozuv noto'g'ri xotiraga tushishi mumkin. Umumiy modulda bunday yozuv yo'q, lekin darslarning o'z kodi buning uchun alohida tekshirilmagan. Xavf past, lekin nol emas.

## 7. Savollarimiz

1. Shu yondashuv sizga to'g'ri keladimi? Ya'ni izolyatsiya `previewRunId` asosida, har ishga tushirish bo'yicha qilinadi, `Storage.prototype` esa qoladi.
2. LMS'da bitta sahifada bir vaqtda ikkita dars mount bo'lib turadigan holat bormi? Bo'lmasa, AC-6 va AC-7 ni alohida vazifaga chiqarishni so'raymiz.
3. Haqiqiy interfeysda «Bilimlar bazasi»dan oddiy darsga o'tish SPA orqali bo'ladimi yoki sahifa qayta yuklanadimi? Bu production'dagi xavfni baholash uchun kerak.
4. Til almashtirilganda siz yangi `previewRunId` berasiz, ya'ni preview boshidan boshlanadi (AC-2 bo'yicha). Shunday bo'lishi kutilgan, deb to'g'ri tushunyapmizmi?

## 8. Keyingi qadamlar

1. Tuzatilgan `internet-01-v18` QA uchun tayyor:
   - Link: https://coddycamp-jsx-qa.vercel.app (fayl: `internet-01-v18-preview-fix-20261021.jsx`)
   - SHA-256: `688453cb58f984c1c3db5b4dd01a8bac17c59ebdd421113fbbbac6d493ec75f1`
   - Dars API: production (`https://dars-api.coddycamp.uz`), siz tekshirgan 19.10 nusxasi bilan bir xil.
   - Siz tekshirgan nusxa (SHA-256 `31b5d3bc…14326d`) bizning manbadan qayta yig'ilganda bayt-bayt bir xil chiqdi. Yangi fayldan farqi faqat preview moduli va natija xotirasini tozalashda, dars mazmuni o'zgarmagan.
2. Sizdan OK kelgach, hamma 172 JSX'ni qayta yig'amiz. Sizga commit, SHA-256 bilan fayllar ro'yxati va AC natijalarini beramiz.
