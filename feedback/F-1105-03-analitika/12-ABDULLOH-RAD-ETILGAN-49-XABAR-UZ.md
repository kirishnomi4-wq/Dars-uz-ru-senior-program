# Abdullohga: School API rad etgan 49 ta natija-xabar

**Sana:** 06.11.2026
**Kimga:** Abdulloh (LMS, CRM, School API)
**Kimdan:** JSX va Dars API jamoasi
**Mavzu:** eski xabarlarni tuzatib, qayta yuborish — ruxsat va qoida

---

## 1. Nima topildi

Siz so'ragan prod ro'yxatini (02.11 dan keyingi xabarlar) tayyorlayotganda Dars API navbatida **49 ta xabar** topildi.
School API ularni **422** javobi bilan rad etgan, ular hozir `manual_review` holatida turibdi.

| | |
|---|---|
| Davr | 21.09 – 02.11 |
| Xabarlar | 49 ta: 15 tasi jonli dars (`live`), 34 tasi uyda (`solo`) |
| O'quvchilar | **228 nafar**. Ularning shu darsdagi natijasi LMS'ga yetib bormagan |
| Hozirgi holat | 05.11 dan keyingi oxirgi 100 xabarning hammasi qabul qilingan (201) |

## 2. Sabablar — uchalasi ham bizning tomonda

| Xato (School API javobi) | Soni | Sabab |
|---|---|---|
| `The correct flag does not match the selected option.` | 33 (solo) | O'quvchi to'g'ri variantni tanlagan, lekin bizning server `correct: false` yuborgan. Urinish yozilgan paytda javob kaliti serverda hali yo'q edi, shuning uchun urinish `false` bo'lib yozilgan. Xabar yig'ilgan paytda esa kalit bor edi, va `correct_option` bilan qarama-qarshilik chiqdi. O'quvchi ekranida natija to'g'ri ko'ringan. |
| `Live mode permits exactly one attempt per question.` | 15 (live) | Jonli darsda bitta o'quvchi bitta savolga ikki marta javob yuborgan (orasi ~25 daqiqa). Shu bitta o'quvchi sababli butun guruhning xabari rad etilgan. Bitta xabarda (21.09) shu ikkinchi urinish `elapsed times must increase` xatosini ham bergan. |
| `The answer must match options[option].` | 1 (solo) | Uyda o'tilgan urinish bir necha kunga cho'zilgan, orada variant matni o'zgargan. |

School API qoidalari to'g'ri ishlagan. Tuzatish faqat bizning serverda bo'ladi.

**Tangaga ta'siri.** Birinchi sabab faqat batafsil qismga emas, `correct_answers` ga ham tekkan.
Tuzatilgan xabarlarda **30 o'quvchida** (hammasi uyda o'tilgan dars) to'g'ri javoblar soni ortadi — jami **+64 to'g'ri javob**.
Jonli darslarda `correct_answers` o'zgarmaydi, faqat ortiqcha urinishlar olib tashlanadi.

## 3. Biz nima qilamiz

1. **Server tuzatiladi.** Xabar yig'ilayotganda:
   - jonli darsda har savol bo'yicha **faqat birinchi urinish** yuboriladi;
   - `correct` saqlangan urinishdan olinmaydi, kalitdan qayta hisoblanadi (`option === correct_option`);
   - javob matni `options[option]` ga mos kelmasa, matn `options[option]` dan olinadi.
2. **49 ta xabar yangidan yig'iladi.** Eski xabarni o'zgarishsiz qayta yuborish yordam bermaydi: u yana 422 oladi.
3. Avval **bitta xabar** yuboriladi. Siz LMS tomonida natija va coin to'g'ri tushganini tasdiqlaganingizdan keyin qolgan 48 tasi yuboriladi.

## 4. Savollarimiz

Siz «bitta identifikator bilan boshqa mazmun yuborilmaydi» degansiz. Shuning uchun quyidagilarni oldindan kelishib olmoqchimiz.

**4.1. `event_id`.** Bu xabarlar 422 olgan, ya'ni hech qachon qabul qilinmagan.
- **a)** Ularni **o'sha `event_id`** bilan, tuzatilgan mazmunda yuborsak bo'ladimi? 422 bo'lganda School API bu id'ni saqlab qoladimi?
- **b)** Yoki yangi id kerakmi? Masalan, oxiriga `_r1` qo'shilgan id (`sess_019443_20261009T121448Z_r1`).

**4.2. Kech kelgan natija.** Masalan, sentyabrdagi dars natijasi hozir kelsa:
- LMS uni odatdagidek qabul qiladimi? Natija va coin hozir beriladimi?
- Eski `started_at` / `finished_at` sanalari muammo bo'lmaydimi (dars yopilgan, modul tugagan va hokazo)?

**4.3. Takror natija.** Ba'zi o'quvchilar shu darsni keyinroq qayta o'tgan bo'lishi mumkin. Ularning natijasi allaqachon yetkazilgan bo'lsa, biz ularni yangi xabardan chiqarib tashlaymiz.
Shu yetarlimi yoki School API ham o'quvchi + dars bo'yicha takrorni o'zi tekshiradi? Coin ikki marta berilmasligi kerak.

**4.4. Jonli darsdagi guruh.** Jonli dars xabarida butun guruh bitta xabarda ketadi. 422 sababli shu darsdagi boshqa o'quvchilar ham natijasiz qolgan.
Qayta yuborishda butun guruhni yuborsak bo'ladimi (4.3 dagi istisno bilan)?

## 5. Ro'yxat

`request_id` — School API'ning rad javobidagi id. Loglardan topish uchun. Sana — xabar yuborilgan kun.

### 5.1. Jonli darslar — 15 ta xabar, 194 o'quvchi

| # | Sana | `event_id` | Dars | O'quvchi | Xato | `request_id` |
|---|---|---|---|---|---|---|
| 1 | 21.09 | `sess_027948_20260921T134401Z` | html-practice-portfolio-v2 | 17 | bitta urinish | `5f071011-23ca-4e71-924a-d7fe03b35195` |
| 2 | 29.09 | `sess_137686_20260929T121301Z` | react-api-get-05-v18 | 15 | bitta urinish | `1861e9d3-48b6-4a50-b87b-18dd941c26fb` |
| 3 | 30.09 | `sess_330364_20260930T103644Z` | pm-m2d7-v1 | 12 | bitta urinish | `6b3830a5-5dc2-4fe1-ad7a-bf3ae0e9173a` |
| 4 | 30.09 | `sess_819479_20260930T103109Z` | js-intro-01-v18 | 8 | bitta urinish | `f8053672-3b8f-4a7c-bc95-63a35fe4c902` |
| 5 | 05.10 | `sess_365731_20261005T121454Z` | pm-m4d15-v1 | 13 | bitta urinish | `69cbdde0-28cc-45da-8c69-3f00e4375b3a` |
| 6 | 05.10 | `sess_903631_20261005T104116Z` | html-02-v16 | 15 | bitta urinish | `44a5dc9e-1601-4709-b022-2ef8b8a8c546` |
| 7 | 07.10 | `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 13 | bitta urinish | `a49f0326-d65b-4ead-aa3f-48e6700e6f4d` |
| 8 | 09.10 | `sess_019443_20261009T121448Z` | js-loops-01-v18 | 16 | bitta urinish | `fc08c153-e18c-4cc7-aa6e-ef1d4a4a3dbb` |
| 9 | 12.10 | `sess_098894_20261012T135339Z` | html-practice-portfolio-v2 | 15 | bitta urinish | `c00c0c0b-d4a7-4f18-9f49-668e323fc8e5` |
| 10 | 12.10 | `sess_819195_20261012T103453Z` | css-01-v17 | 16 | bitta urinish | `0f3a9e2f-96ae-49bf-a506-4ba98186d250` |
| 11 | 27.10 | `sess_309563_20261027T041455Z` | pm-m1d6-v1 | 15 | bitta urinish | `7c45b39b-4bf0-4073-94f7-e5df54cf7c03` |
| 12 | 27.10 | `sess_728518_20261027T121132Z` | fullstack-connect-practice-p2-v18 | 7 | bitta urinish | `a36d93dc-dcb0-4f17-9e6a-21fdd254c458` |
| 13 | 27.10 | `sess_992402_20261027T132946Z` | pg-crud-04-05-v18 | 13 | bitta urinish | `b383dc3a-f33f-4c15-852e-e8c1a9802269` |
| 14 | 29.10 | `sess_204521_20261029T141614Z` | pm-m4d7-v1 | 12 | bitta urinish | `7e16ab06-c93f-4245-9f40-6f5870f8e50d` |
| 15 | 30.10 | `sess_482974_20261030T121455Z` | react-api-get-05-v18 | 7 | bitta urinish | `2fea89bf-8862-46ff-9d93-65165fda4e30` |

### 5.2. Uyda o'tilgan darslar — 34 ta xabar, har birida 1 o'quvchi

`event_id` ichida dars id'si bor.

| # | Sana | `event_id` | Xato | `request_id` |
|---|---|---|---|---|
| 1 | 28.09 | `solo_31347_pm-m1d2-v1_20260921T111944Z` | `correct` | `40197b77-cceb-4dd9-9547-d6816fae5511` |
| 2 | 28.09 | `solo_34941_pm-m1d2-v1_20260921T132950Z` | `correct` | `e1a2c225-0f69-4e7c-99e9-b3d8e8cfc60c` |
| 3 | 28.09 | `solo_35476_pm-m2d13-v1_20260921T111656Z` | `correct` | `3bcd1aa0-5f1d-4762-a999-d92794a8f439` |
| 4 | 28.09 | `solo_35487_pm-m2d2-v1_20260921T112604Z` | `correct` | `a1dd4b98-f21e-4334-972a-28b1bad64655` |
| 5 | 28.09 | `solo_36410_pm-m1d2-v1_20260921T131932Z` | `correct` | `7b1c7414-2efa-4cfa-8fd0-9d12f1342128` |
| 6 | 28.09 | `solo_36995_pm-m1d2-v1_20260921T120152Z` | `correct` | `fa06506f-95de-4106-9c40-d9c7acc41628` |
| 7 | 29.09 | `solo_29957_pm-m2d13-v1_20260922T142311Z` | `correct` | `2f753930-a133-4e7f-8a5f-87a33a3c3059` |
| 8 | 29.09 | `solo_36700_pm-m1d2-v1_20260922T124938Z` | `correct` | `2367cde5-4b8b-49a0-abff-1b17cafa7e81` |
| 9 | 30.09 | `solo_31136_pm-m2d13-v1_20260925T104945Z` | `correct` | `0fdd9545-0280-4515-bdf1-3b74323a8ddd` |
| 10 | 30.09 | `solo_31293_vscode-start-01-v1_20260923T050927Z` | `correct` | `2a5e1c06-0976-4303-bbd6-95cbaedae34a` |
| 11 | 30.09 | `solo_31826_internet-01-v18_20260923T131526Z` | `correct` | `19b65180-241f-47ec-8499-4607ad208f89` |
| 12 | 30.09 | `solo_35887_pm-m2d2-v1_20260923T114932Z` | `answer` | `a900bc18-baa7-4b06-b751-2b4f97c54a29` |
| 13 | 30.09 | `solo_36342_pm-m1d2-v1_20260923T130935Z` | `correct` | `6769bc2d-0111-4988-b950-3dcfa9771c78` |
| 14 | 01.10 | `solo_29058_pm-m1d2-v1_20260924T142222Z` | `correct` | `98081abc-b44e-4338-aa03-81b9672eab01` |
| 15 | 01.10 | `solo_29916_pm-m2d13-v1_20260924T121417Z` | `correct` | `cc34b69e-50fd-42b2-8f40-14cccd03775d` |
| 16 | 01.10 | `solo_31981_pm-m2d13-v1_20260924T121243Z` | `correct` | `121598b8-724c-4f05-a9d3-6c2abab2ffaf` |
| 17 | 01.10 | `solo_33114_pean-stack-01-v18_20260924T125527Z` | `correct` | `2d0b3f71-896e-4b1f-a625-5cac2fe03785` |
| 18 | 01.10 | `solo_34968_pm-m2d13-v1_20260924T121026Z` | `correct` | `32864622-0d7b-4dff-8e5b-154b8aff2181` |
| 19 | 02.10 | `solo_29669_pm-m2d13-v1_20260925T105755Z` | `correct` | `e6fd7430-5e90-4684-b95b-cf75b6c51575` |
| 20 | 02.10 | `solo_35840_pm-m1d2-v1_20260925T130841Z` | `correct` | `ef780c73-ccfa-4f98-92ed-0428a4a10fcf` |
| 21 | 05.10 | `solo_36516_html-02-v16_20260928T132343Z` | `correct` | `6eb21314-df19-4ef3-85ad-87753a8bac78` |
| 22 | 06.10 | `solo_29999_practice-03-decompose-v18_20260929T142757Z` | `correct` | `04cf5a26-19ad-498a-b4e4-1d423ed06f83` |
| 23 | 06.10 | `solo_31955_react-intro-01-v18_20260929T130029Z` | `correct` | `097dd0ab-1cf7-410e-899d-5ef93cdbdeca` |
| 24 | 07.10 | `solo_29150_data-intro-04-01-v18_20260930T134628Z` | `correct` | `2c8d3b75-1f91-489f-ba65-e6c62cf3bfe0` |
| 25 | 07.10 | `solo_30289_pm-m4d2-v1_20260930T140510Z` | `correct` | `8f7e577c-a731-480b-a68b-a23e861abf37` |
| 26 | 07.10 | `solo_30295_pm-m4d2-v1_20260930T142519Z` | `correct` | `4677afbe-3cc7-4bd7-8cd4-37b517647fe3` |
| 27 | 07.10 | `solo_30306_pm-m4d2-v1_20260930T140456Z` | `correct` | `d51597e2-dfde-48ff-849b-aee71e412f26` |
| 28 | 07.10 | `solo_30548_pm-m4d2-v1_20260930T143335Z` | `correct` | `a6ec1a71-c9dc-4d79-aaba-2cf32c81b1ab` |
| 29 | 07.10 | `solo_30549_pm-m4d2-v1_20260930T144337Z` | `correct` | `0e250271-7d77-4446-af65-2ec7214a9ab1` |
| 30 | 09.10 | `solo_30648_pm-m4d2-v1_20261002T130852Z` | `correct` | `72887a89-3f24-405e-9bac-212b3164ff5f` |
| 31 | 15.10 | `solo_32378_react-build-site-final-p4-v18_20261008T113007Z` | `correct` | `601d1a70-7dcd-4e8e-875d-b007407fea28` |
| 32 | 17.10 | `solo_32323_react-build-site-final-p4-v18_20261010T090701Z` | `correct` | `23c5c5f5-52e5-4b3b-b05a-cf6c39add3ec` |
| 33 | 19.10 | `solo_32038_pm-m4d7-v1_20261019T120610Z` | `correct` | `b7a8e30a-a620-48c7-8326-7fd1e68efeaa` |
| 34 | 02.11 | `solo_31005_cicd-full-pipeline-4c-03-v18_20261102T120926Z` | `correct` | `052f1709-351d-4dcf-bef1-07546a2ddf86` |

---

## Keyingi qadam

Javobingizdan keyin serverni tuzatamiz, sinovdan o'tkazamiz va avval bitta xabarni yuboramiz.
Bu ish uch hodisaning JSON namunalariga (oldingi kelishuv) xalaqit bermaydi, ular alohida hujjatda keladi.
