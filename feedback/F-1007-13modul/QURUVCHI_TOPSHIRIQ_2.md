# 13-Modul — 2-to'lqin quruvchi topshirig'i (10 dars, 3 to'lqin; 08.10.2026)

> Buyruq — foydalanuvchi, 08.10 ertalab: pilotlar (03, 06) ko'rikdan o'tdi va tasdiqlandi — «qolgan darslarni ham quramiz».
> Umumiy qoidalar — `QURUVCHI_TOPSHIRIQ_PILOT.md` (O'qish tartibi · Tekshiruv va hisobot · chegaralar) **aynan shu to'lqinda ham kuchda**; shu fayl faqat farqlarni beradi.
> **`QURUVCHI_SABOQ.md` P-bo'limi (pilot ko'rigi, 9 sinf) — MAJBURIY, oldindan qo'llanadi** (odam figurasi yo'q · QKirish maketi · yo'riqnoma ko'rinmagan narsaga ishora qilmaydi · AI bilan davom PM-109 · `max-content`+`zoom` taqiq · to'lov sahifasi Payme ko'rinishi · `.q-dd-chip` override yo'q · nom qatori qoladi · NBSP/nowrap).
> Pilot fayllari `src/11-Modull/PaymentWebhookLesson.jsx` (TEX, `TolovSahna`, `MashqSahifa`, `AiDavomCard`) va `PmMoneyTalkLesson.jsx` (PM, `SuhbatVaraq`, `AiDavomCard`, `.mt-katak`) — tasdiqlangan namuna: qanday yechilganini ko'ring, kod bo'lagini ko'chirmang (JR-14); umumiy manbalar (`MASHQ_SAHIFA`, `TOLOV_SAHNA` matnlari) MD/tayanch bo'yicha o'z faylingizda qayta yoziladi.
> Fayl skeletdan tayyor (`LESSON_META`, palitra, export nomi; gates 12/12), App.jsx ga ulangan: `http://127.0.0.1:5175/#/lesson/m11-NN` (server asosiy seansniki — ishga tushirmang, to'xtatmang). Commit, push, deploy — YO'Q. MD ga tegilmaydi — «MD ga taklif» hisobotda.

## Darslar (har agent — faqat o'z fayli; vaqtinchalik fayllar scratchpad `<NN>-qurish/`)

| To'lqin | Dars | Kalit | Fayl (`src/11-Modull/`) | MD + FILTR | Ekran | Turi · palitra | Namuna (faqat ko'rish) | Turn |
|---|---|---|---|---|---|---|---|---|
| A | 1 | m11-01 | `PmUnitEconomicsLesson.jsx` | `01-PmUnitEconomics-v3.md` + `01-FILTR.md` | 14 | PM · `pm` | 06 pilot · 12-Modul `PmUsersCheckLesson.jsx` (hisob, metrika kartalari) | ≤150 |
| A | 2 | m11-02 | `PmMonetizationLesson.jsx` | `02-PmMonetization-v3.md` + `02-FILTR.md` | 15 | PM · `pm` | 06 pilot · 12-Modul `PmChannelsLesson.jsx` (karta-to'plam, tanlov) | ≤150 |
| A | 4 | m11-04 | `PmPricingLesson.jsx` | `04-PmPricing-v3.md` + `04-FILTR.md` | 12 | PM+PRAKT · `pm` | 06 pilot · 12-Modul `PmRealtimeSpecLesson.jsx` (PM+PRAKT tartibi, QMustaqil ketma-ket) | ≤130 |
| A | 5 | m11-05 | `PaymentDayLesson.jsx` | `05-PaymentDay-v3.md` + `05-FILTR.md` | 12 | loyiha kuni · `tex` | 03 pilot (`TolovSahna`, Payme `MashqSahifa`, tekshiruv kartasi) · 12-Modul `LiveNotifyDayLesson.jsx`, `RetentionDayLesson.jsx` (ScreenBlok, QBlok, QPrompt) | ≤140 |
| B | 7 | m11-07 | `PmTermsLesson.jsx` | `07-PmTerms-v3.md` + `07-FILTR.md` | 12 | PM+PRAKT · `pm` | 06 pilot · `PmRealtimeSpecLesson.jsx` | ≤130 |
| B | 8 | m11-08 | `WinBackDayLesson.jsx` | `08-WinBackDay-v3.md` + `08-FILTR.md` | 12 | loyiha kuni · `tex` | 03 pilot · `RetentionDayLesson.jsx` | ≤140 |
| B | 9 | m11-09 | `PmPayCheckLesson.jsx` | `09-PmPayCheck-v3.md` + `09-FILTR.md` | 12 | PM · `pm` | 06 pilot · `PmUsersCheckLesson.jsx` (Mentor tekshiruvi) | ≤130 |
| C | 10 | m11-10 | `ReferralDayLesson.jsx` | `10-ReferralDay-v3.md` + `10-FILTR.md` | 12 | loyiha kuni · `tex` | 03 pilot · `RetentionDayLesson.jsx`, `LiveNotifyDayLesson.jsx` | ≤140 |
| C | 11 | m11-11 | `PmReflectionLesson.jsx` | `11-PmReflection-v3.md` + `11-FILTR.md` | 12 | PM · `pm` | 06 pilot · `PmPitchReviewLesson.jsx` (o'z ishini roadmap bilan solishtirish) | ≤130 |
| C | 12 | m11-12 | `StabilizeDayLesson.jsx` | `12-StabilizeDay-v3.md` + `12-FILTR.md` | 12 | loyiha kuni · `tex` | 03 pilot · `BreakAndFixLesson.jsx` (buzish/tuzatish, tekshiruv yozuvi) | ≤140 |

## Har dars uchun (pilotdan farqlar)
- **Darsga xos ro'yxat — o'z MD ning «KOD» bo'limi, band-band** (pilot topshirig'idagi kabi men ajratib bermadim — MD «KOD» bo'limini to'liq o'qing va har bandni hisobotda «bajarildi / chetlashdi (sabab)» deb yozing).
- **Kalitlar (tayanch 8):** boshqa darsning kalitini faqat o'qiysiz; o'z kalitingizga MD/tayanch 8 dagi shaklda yozasiz. Pilot kalitlari: `pm-m11d3-oqim` (03), `pm-m11d6-suhbat` (06).
- **AI bilan davom (PM-109):** MD yakun bandida bo'lsa aynan; bo'lmasa — SABOQ P4 naqshida yozing (AI darsdagi sherik rolini o'ynaydi: foydalanuvchi, tashkilotchi, tekshiruvchi, to'lov xizmati) va hisobotda «MD ga taklif» qiling. Loyiha kunida AI — «tekshiruvchi» (buzish holatlarini beradi, o'quvchi natijani yozadi).
- **To'lov sahifasi / to'lov taklifi ekrani:** mashq to'lov sahifasi — Payme ko'rinishi (SABOQ P6, 03 `MashqSahifa`); ilovaning o'z «to'lov taklifi ekrani» (paywall, 4-dars) — MD bo'yicha, Payme emas (u ilova ichidagi ekran).
- **Loyiha kuni (05, 08, 10, 12):** ⛔ «qur» darvozalari (real telefon, Expo Go, Render, to'lov xizmati kabineti) sinalmagan — dars MD bo'yicha quriladi; hisobotda «sinalmagan» ro'yxati. 12-dars A3 4-bandida «ikkinchi tuzatish ham yiqilsa — `git revert` + push» qatori bor (12-FILTR 1-band B).
- **Ekran raqami** O'qituvchi eslatmasida — 1 dan (hisoblagich bilan bir xil; MD 0 dan sanasa, +1).
- Hisobot oxirida: **nimani tekshirmadingiz** (ochiq) · «MD ga taklif» · qolip taklifi · RU-qarz.
