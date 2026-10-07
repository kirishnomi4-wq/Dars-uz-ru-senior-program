# 11-Modul — dars nomlari (TAKLIF — qaror sahifasida tasdiqlanadi)

PM darslar — savol-sarlavha (9/10-Modul uslubi) · texnik darslar — mavzu nomi · loyiha kunlari — «Loyiha kuni: …». Hammasi ≤55 belgi, bitta qator; menyu nomi = dars nomi (DE-205).
Menyu nomi umumiy (o'quvchining o'z mahsulotiga ham to'g'ri keladi); Mentor misoli faqat dars ichida. Sarlavhada hali o'tilmagan atama yo'q (T-011) — RICE, PRD, roadmap, PWA faqat osti yozuvida
(«Roadmap» 15-dars nomida — 6-darsda o'tilgan).

| № | Kalit | Tip (App.jsx) | Dars nomi (menyu = dars) | Belgi | Menyu osti yozuvi | Fayl (`src/9-Modull/`) |
|---|---|---|---|---|---|---|
| 1 | m9-01 | PM | **Oltita g'oyani qayerdan topasiz?** | 31 | muammo, kim uchun va yechim — 6 yozma g'oya | `PmTenIdeasLesson.jsx` |
| 2 | m9-02 | PM | **Oltita g'oyadan qaysi uchtasi qoladi?** | 36 | saralash va RICE bahosi | `PmIdeaRiceLesson.jsx` |
| 3 | m9-03 | PM | **Ikki g'oyadan qaysi biri odamlarga kerak?** | 41 | 10 intervyu, 1-qism: ikki g'oya, bir xil savollar | `PmInterviewsOneLesson.jsx` |
| 4 | m9-04 | PM | **O'n intervyudan keyin qaysi g'oya qoladi?** | 41 | takrorlangan javoblar va final g'oya | `PmFinalIdeaLesson.jsx` |
| 5 | m9-05 | PM | **G'oyangiz bir sahifaga sig'adimi?** | 33 | Mentor tekshiruvi va to'liq PRD | `PmPrdLesson.jsx` |
| 6 | m9-06 | PM | **Bitiruvgacha nimani qachon qurasiz?** | 35 | RICE bo'yicha roadmap | `PmRoadmapLesson.jsx` |
| 7 | m9-07 | Kod | **Jonli prototip: qog'ozdan bosiladigan ekrangacha** | 48 | wireframe → talab → bosiladigan prototip | `LivePrototypeLesson.jsx` |
| 8 | m9-08 | Kod | **Arxitektura va platforma: web yoki mobil ilova** | 46 | qismlar, real vaqt nuqtalari, stek — asoslangan tanlov | `PlatformChoiceLesson.jsx` |
| 9 | m9-09 | Kod | **React Native va Expo: prototip telefonda** | 40 | Expo, navigatsiya; web-trek — adaptiv sayt va PWA | `ExpoPrototypeLesson.jsx` |
| 10 | m9-10 | Proyekt | **Loyiha kuni: poydevor — Database, kirish, deploy** | 48 | tanlangan stekda: ilova Backend'ga ulanadi | `FoundationDayLesson.jsx` |
| 11 | m9-11 | Proyekt | **Loyiha kuni: 1-asosiy funksiya** | 30 | roadmap'dagi birinchi funksiya — talabni siz yozasiz | `FeatureOneLesson.jsx` |
| 12 | m9-12 | Proyekt | **Loyiha kuni: 2-asosiy funksiya** | 30 | roadmap'dagi ikkinchi funksiya | `FeatureTwoLesson.jsx` |
| 13 | m9-13 | PM | **Uch foydalanuvchidan keyin nimani tuzatasiz?** | 44 | auditoriya bilan sinov va shu darsda tuzatish | `PmAudienceTestLesson.jsx` |
| 14 | m9-14 | Proyekt | **Loyiha kuni: 3-asosiy funksiya** | 30 | roadmap'dagi uchinchi funksiya | `FeatureThreeLesson.jsx` |
| 15 | m9-15 | PM | **Roadmap bo'yicha qayerdasiz?** | 28 | Mentor bilan yakkama-yakka: risklar va tuzatilgan reja | `PmOneOnOneLesson.jsx` (yoki `comp` siz — qaror DARS-q1) |
| 16 | m9-16 | PM | **G'oyangiz va ilovangiz guruhni ishontiradimi?** | 45 | muammo → yechim → jonli demo | `PmPrototypePitchLesson.jsx` |
| 17 | m9-17 | Demo | **Demo Day 7** | 10 | final g'oya | — (`comp` siz, oldingi Demo Day kabi — qaror DARS-q0; osti — DD-q0, 06.10) |

Komponent nomlari App.jsx va `src/` da band emas (grep, 05.10). 13-dars (PM+PRAKT) App.jsx da `type: 'PM'` — 9-Modul `m7-06` naqshi.
App.jsx 9-blok (taklif): `id: '9', slug: 'm9', title: 'Final loyiha: g\'oya va rivojlantirish', period: 'oy 12–13.5', stage: 2`,
`idea`: «Bitiruvgacha olib boriladigan final mahsulot: g'oya, intervyu, PRD, prototip va birinchi funksiyalar — web yoki mobil.»
Oldingi dars: `m8-13` «Zaxira dars» (10-Modul) · 17-darsdan keyin — 12-modul (App.jsx da hali yo'q).
