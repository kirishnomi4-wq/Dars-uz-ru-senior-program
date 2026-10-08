# 14-Modul — dars nomlari (TAXMIN T20 — NOM A, ertalab tasdiqlanadi; 08.10.2026, F-1008-553)

PM darslar — savol-sarlavha · texnik dars — mavzu nomi («Mahsulot tezligi: …», «Video-portfolio: …») · loyiha kuni — «Loyiha kuni: …». Hammasi ≤55 belgi, bitta qator; menyu nomi = dars nomi (DE-205).
PM sarlavhasida hali o'tilmagan atama yo'q (T-011): «stajirovka», «frilans», «Lighthouse» — faqat osti yozuvida yoki dars ichida tug'iladi (10-dars nomi shuning uchun qaror sahifasidagidan qisqardi).
Menyu nomi umumiy (o'quvchining o'z mahsulotiga ham to'g'ri keladi); Mentor misoli faqat dars ichida.

| № | Kalit | Tip (App.jsx) | Dars nomi (menyu = dars) | Belgi | Menyu osti yozuvi | Fayl (`src/12-Modull/`) |
|---|---|---|---|---|---|---|
| 1 | m12-01 | PM | **Investorga pitchni qanday tuzasiz?** | 34 | olti bo'lak: muammo, bozor, yechim, raqamlar, jamoa, keyingi qadam | `PmInvestorPitchLesson.jsx` |
| 2 | m12-02 | PM | **Mahsulotingiz hikoyasini qanday aytasiz?** | 40 | 5 daqiqalik pitch — hikoya, funksiyalar ro'yxati emas | `PmStoryPitchLesson.jsx` |
| 3 | m12-03 | Kod | **Mahsulot tezligi: o'lchaymiz va tezlashtiramiz** | 46 | Lighthouse, rasmlar va yuklanadigan kod hajmi — oldin va keyin | `ProductSpeedLesson.jsx` |
| 4 | m12-04 | Proyekt | **Loyiha kuni: demo uchun sayqal** | 30 | demo yo'lidagi uch joy: bosish, yuklanish, muvaffaqiyat | `PolishDayLesson.jsx` |
| 5 | m12-05 | PM | **Guruh pitchingizda nimani tuzatishni aytadi?** | 44 | pitch mashqi 1: guruh fidbeki va tuzatishlar ro'yxati | `PmPitchTrainingLesson.jsx` |
| 6 | m12-06 | Kod | **Demoga tayyorgarlik: risklar va B reja** | 38 | demo ssenariysi, B reja va yangi funksiyani to'xtatish | `DemoPrepLesson.jsx` |
| 7 | m12-07 | PM (PM+PRAKT) | **Investor ko'zi bilan: demo buzilmaydimi?** | 40 | demo tekshiruvi: buzamiz, agent tuzatadi, uch marta to'liq o'tish | `PmDemoTestLesson.jsx` |
| 8 | m12-08 | PM | **Final pitchingiz 5 daqiqaga tayyormi?** | 37 | pitch mashqi 2: taymer va savol-javob | `PmFinalPitchLesson.jsx` |
| 9 | m12-09 | Kod | **Video-portfolio: 3 daqiqada o'zingiz va mahsulot** | 48 | ssenariy, ekran yozuvi va havola | `VideoPortfolioLesson.jsx` |
| 10 | m12-10 | PM | **Birinchi buyurtmani qayerdan topasiz?** | 37 | frilans va stajirovka: reja va ikki xat | `PmFreelanceLesson.jsx` |
| 11 | m12-11 | PM | **Qaysi xalqaro dasturga ariza berasiz?** | 37 | Diamond Challenge, Y Combinator: shartlar va ariza | `PmProgramsLesson.jsx` |
| 12 | m12-12 | PM | **Keyingi olti oyda nima qilasiz?** | 31 | Mentor bilan yakkama-yakka: olti oylik reja | `PmNextStepsLesson.jsx` |
| 13 | m12-13 | PM | **Demo Day'ga tayyormisiz?** | 24 | hakamlar oldidan to'liq repetitsiya | `PmDressRehearsalLesson.jsx` |
| 14 | m12-14 | Rezerv | **Zaxira dars: zalni tayyorlash** | 29 | tashkiliy dars | — (`comp` siz) |
| 15 | m12-15 | PM | **Bitiruvchilar bilan uchrashuv** | 29 | tadbir — tashkilotchi bilan | — (`comp` siz) |
| 16 | m12-16 | Demo | **Demo Day 8 — bitiruv himoyasi** | 29 | hakamlar: 5–7 investor va tadbirkor; 5 daqiqa pitch va savol-javob | — (`comp` siz) |
| 17 | m12-17 | Demo | **Bitiruv marosimi** | 16 | sertifikatlar, video-portfolio, g'oliblar | — (`comp` siz) |

Komponent nomlari App.jsx va `src/` da band emas (grep 08.10 02:33). PM+PRAKT (7) — `type: 'PM'`; AI-PRAKT (4) — `type: 'Proyekt'`; TEX (3, 6, 9) — `type: 'Kod'`; 14 — `'Rezerv'`; 16, 17 — `'Demo'` (11-Modul `m9-17` naqshi); 15 — `'PM'` (dasturda PM; tadbir, `comp` siz).
Oldingi dars: `m11-13` «Zaxira dars» (13-Modul) · 13-darsdan keyin — 14-qator «Zaxira dars: zalni tayyorlash» (13-dars MD si «Keyingi dars» qatorida shuni aytadi).
App.jsx 12-blok: `id: '12', slug: 'm12', title: 'Bitiruvchi va mahsulot tezligi', period: 'oy 15.5–16.5', stage: 2`,
`idea`: «Mahsulot tez va silliq ishlaydi, pitch va jonli demo hakamlar oldiga tayyor — va keyingi olti oy rejasi bor.» «Qur» da faqat import va `comp` qo'shiladi, aniq Edit bilan.
MD fayl nomlari — `NN-<komponent nomi, Lesson siz>-v3.md` (masalan `03-ProductSpeed-v3.md`).
