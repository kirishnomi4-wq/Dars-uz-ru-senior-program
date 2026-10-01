# MD-eksport topshirig'i (29.09, 6-Modulda sinalgan): bitta darsni ekranma-ekran MD'ga chiqarish (faqat O'QISH + bitta MD yozish)

Loyiha: /home/kali/Desktop/internetLesson (React darsliklar, o'zbekcha). Maqsad: foydalanuvchi (metodist) darsning
HAR bir ekranidagi o'quvchi ko'radigan o'zbekcha matnni MD'da o'qib, fidbek yozadi; keyin dars shu MD'ga moslanadi.

## Namuna (formatni aynan shunday qiling)
`feedback/F-0928-QA-5modul/01-BotIntro-sozlar.md` — 5-Modul 1-darsi uchun tayyor MD. Avval uni to'liq o'qing.

## Qat'iy qoidalar
- HECH qanday faylni tahrirlamang. Faqat o'zingizga berilgan BITTA MD faylni yozasiz (Write). Commit yo'q.
- Matnni SO'ZMA-SO'Z ko'chiring (`uz:` qiymatlari). O'zingiz tuzatmang, qisqartirmang, qayta yozmang. Ruscha (`ru:`) KERAK EMAS.
- Ekran tartibi = fayl oxiridagi `const screens = [...]` massivi (0 dan). SCREEN_META bilan solishtiring.
- Har ekranda holatga bog'liq (bosilgandan keyin, to'g'ri/xato, A/B tanlov) BARCHA matnlarni yozing — o'quvchi ko'radigan hamma narsa.
- Test ekranlarida: variantlar, ✔ to'g'ri javob (INLINE_KEYS/correctIdx dan aniqlang), to'g'ri-izoh, har xato variant izohi.
- Har ekran sarlavhasida fayldagi qator raqami: `## 3 · Nom  \`[873]\``.
- Ortiqcha narsa yozmang: CSS, kod-mantiq, ball-texnikasi tushuntirmasi kerak emas. Faqat o'quvchi ko'radigan matn + qisqa "nima qiladi".
- Podium/Natijalar ekranining umumiy shablon matnini 1–2 qatorda qisqa yozing.
- Fayl katta (~3000 qator). Uni bo'lib bir marta o'qing (Read offset/limit), qayta-qayta o'qimang. grep bilan kerakli joylarni toping.

## MD tuzilmasi (tartib)
1. Sarlavha: `# 5-Modul (LMS: 7-Modul) · N-dars «Nom» — reja va ekranma-ekran so'zlar`
   Keyin: `Fayl: \`src/5-Modull/X.jsx\` · K ekran · faqat o'zbekcha matn` va namunadagi 2 qator (qator raqami, `>> ...` fidbek usuli).
2. `## Darsning ipi` — 3–5 qator: **Hook** (0-ekran: qanday vaziyat, o'quvchi nima qiladi — aniq), **Markaziy o'yin/mexanika**, **Asosiy metafora** (bo'lsa), **Yakun** (nima bilan tugaydi). Bu yerda o'z so'zingiz bilan qisqa tavsif — lekin dars aynan nima deyishini buzmang.
3. `## Dars rejasi (oqim)` jadvali: `# | Ekran | Turi | Nima qiladi o'quvchi | Ball` (namunadagidek; turi: hook/qoida/tushuncha/test/markaziy/case/amaliyot/praktika/podium/kartochkalar/xulosa...).
   Ostida: arena savollar soni, qisqa takrorlash (RECAPS) soni, nishonlar soni. Va **Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at)**.
4. Har ekran bo'limi (namunadagi uslub: Eyebrow · Sarlavha · Mentor · Matn · Kartalar · Tugmalar · Xulosa ...). Mentor gapi har ekranda alohida `- Mentor:` qatorda aniq ko'rinsin.
5. Kod-praktika/koding ekranlari bo'lsa: topshiriq matni, boshlang'ich kod (```js bloki), bo'shliq variantlari, tekshiruv xabarlari.
6. Takrorlash kartochkalari — jadval (Old · Orqa · Izoh). Yakun ekrani — xulosalar, uyga vazifa, keyingi dars matni.
7. `## Qo'shimcha matnlar`: Nishonlar · Qisqa takrorlash oynalari (RECAPS) · Jonli viktorina (QUIZ_BANK, har savol: savol ✔to'g'ri · qolgan variantlar) — namunadagidek ixcham.
8. `## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)` — MAKS 8 band, faqat ANIQ narsalar (ekran raqami bilan):
   izohsiz inglizcha/texnik so'z · taqiqlangan so'zlar («chip», «slot», «daftar», kantselyarit: «ushbu», «hisoblanadi», «amalga oshirmoq») ·
   o'quvchi tushunmaydigan jumla · bir xil narsaning ikki xil nomlanishi · takrorlangan matn · to'g'ri javob uzunligi/shakli bilan "sotilib" qolgan test.
   Taqiq-ro'yxat manbai: /home/kali/Desktop/internetLesson/MATN_ETALONI.md (LUG'AT bo'limini grep qiling, butunini o'qimang).

## Yakuniy javobingiz (menga, 6 qatordan oshmasin)
MD yo'li · ekranlar soni · ballik testlar soni · hook bir jumlada · belgilarning eng muhim 2 tasi · ko'chira olmagan/shubhali joy bo'lsa — nima.
