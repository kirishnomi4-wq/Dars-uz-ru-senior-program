# Abdullohga: 50 ta xabar — sinov rejimida qayta yig'ish hisoboti (hech narsa yuborilmagan)

**Sana:** 2026-11-09 · **Format:** `16-…` hujjat 5-bo'limi · **Jadval:** `17a-50-XABAR-HISOBOT.csv` (229 qator = o'quvchi × xabar)
**Manba:** prod Dars API, server `0.1.0+92087d0e`, qayta yig'ish `dry: true` — bazaga yozilmadi, School API'ga yuborilmadi.

## 1. Yig'ma

| | Soni |
|---|---|
| Xabarlar | 50 (jonli 15, uyda 35) |
| O'quvchi natijasi yozuvlari (eski xabarlarda) | 229 |
| Noyob o'quvchi | 197 · noyob o'quvchi + dars juftligi: 229 (takror 0 qator) |
| Qayta yig'ilganda yuboriladigan yozuvlar | 213 |
| Bizda chiqariladi (shu dars bo'yicha tugallangan natija allaqachon yetkazilgan) | 16 |
| Manbada topilmadi | 0 |
| `correct_answers` o'zgaradi | 28 o'quvchida, jami +57 |
| Tafsiloti tushirilgan yozuvlar | 35 |
| Tarixdan chiqarilgan urinishlar | 29 |
| Xabar holati | yuboriladi 46 · butunlay chiqariladi 4 · xato 0 |

**Tafsilot nega tushirilgan** (35 yozuv): `matnsiz savol` — 22 · `invalid_text` — 13.
- `matnsiz savol` — darsning yakuniy amaliyot ekrani (yozma topshiriq) natijani ball sifatida yozadi, lekin savol va variant matni yo'q; Dars API'ning hozirgi qoidasi bo'yicha shunday o'quvchining tafsiloti to'liq bo'lmagani uchun **butunlay** yuborilmaydi. **Eski xabarda ham shu o'quvchilarda tafsilot bo'sh edi** — bu yangi o'zgarish emas, asosiy natija (`answered`, `correct_answers`) ta'sirlanmaydi. Bu qoida 87 darsga tegadi va alohida hal qilinadi (16-hujjat 2.2 `details` bloki: qisman tafsilot). Agar siz ma'qul desangiz, 50 xabar yuborilishidan oldin qoida yumshatiladi va bu 22 o'quvchida qolgan savollar tafsiloti ketadi.
- `invalid_text` — `[object Object]` (bitta dars, `pg-crud-04-05-v18`, 14-hujjat 1.2).
- `version_mismatch` — kalit o'quvchi ko'rgan matnga mos emas.

## 2. Xabarlar bo'yicha

| # | Sana | `event_id` | Rejim | Dars | Eski xato | O'quvchi: eski → yangi | Chiqarildi | `correct` o'zgardi | Tafsilot tushdi | Urinish chiqdi | Holat |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2026-09-21 | `sess_027948_20260921T134401Z` | live | html-practice-portfolio-v2 | Attempt elapsed times must increase. | 17 → 17 | 0 | 0 | 0 | 2 | yuboriladi |
| 2 | 2026-09-28 | `solo_35487_pm-m2d2-v1_20260921T112604Z` | solo | pm-m2d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+1) | 0 | 0 | yuboriladi |
| 3 | 2026-09-28 | `solo_35476_pm-m2d13-v1_20260921T111656Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 0 | 0 | 0 | yuboriladi |
| 4 | 2026-09-28 | `solo_31347_pm-m1d2-v1_20260921T111944Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+1) | 0 | 0 | yuboriladi |
| 5 | 2026-09-28 | `solo_36995_pm-m1d2-v1_20260921T120152Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+2) | 0 | 0 | yuboriladi |
| 6 | 2026-09-28 | `solo_36410_pm-m1d2-v1_20260921T131932Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+3) | 0 | 0 | yuboriladi |
| 7 | 2026-09-28 | `solo_34941_pm-m1d2-v1_20260921T132950Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+1) | 0 | 0 | yuboriladi |
| 8 | 2026-09-29 | `sess_137686_20260929T121301Z` | live | react-api-get-05-v18 | Live mode permits exactly one attempt per question. | 15 → 15 | 0 | 0 | 0 | 2 | yuboriladi |
| 9 | 2026-09-29 | `solo_36700_pm-m1d2-v1_20260922T124938Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+1) | 0 | 0 | yuboriladi |
| 10 | 2026-09-29 | `solo_29957_pm-m2d13-v1_20260922T142311Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+1) | 0 | 0 | yuboriladi |
| 11 | 2026-09-30 | `solo_31293_vscode-start-01-v1_20260923T050927Z` | solo | vscode-start-01-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+1) | 0 | 0 | yuboriladi |
| 12 | 2026-09-30 | `solo_35887_pm-m2d2-v1_20260923T114932Z` | solo | pm-m2d2-v1 | The answer must match options[option]. | 1 → 1 | 0 | 0 | 0 | 2 | yuboriladi |
| 13 | 2026-09-30 | `solo_31136_pm-m2d13-v1_20260925T104945Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+3) | 0 | 0 | yuboriladi |
| 14 | 2026-09-30 | `sess_819479_20260930T103109Z` | live | js-intro-01-v18 | Live mode permits exactly one attempt per question. | 8 → 8 | 0 | 0 | 7 | 3 | yuboriladi |
| 15 | 2026-09-30 | `sess_330364_20260930T103644Z` | live | pm-m2d7-v1 | Live mode permits exactly one attempt per question. | 12 → 12 | 0 | 0 | 0 | 2 | yuboriladi |
| 16 | 2026-09-30 | `solo_36342_pm-m1d2-v1_20260923T130935Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 0 | 0 | 0 | yuboriladi |
| 17 | 2026-09-30 | `solo_31826_internet-01-v18_20260923T131526Z` | solo | internet-01-v18 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+1) | 0 | 0 | yuboriladi |
| 18 | 2026-10-01 | `solo_34968_pm-m2d13-v1_20260924T121026Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+3) | 0 | 0 | yuboriladi |
| 19 | 2026-10-01 | `solo_31981_pm-m2d13-v1_20260924T121243Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+3) | 0 | 0 | yuboriladi |
| 20 | 2026-10-01 | `solo_29916_pm-m2d13-v1_20260924T121417Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+3) | 0 | 0 | yuboriladi |
| 21 | 2026-10-01 | `solo_33114_pean-stack-01-v18_20260924T125527Z` | solo | pean-stack-01-v18 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+2) | 0 | 0 | yuboriladi |
| 22 | 2026-10-01 | `solo_29058_pm-m1d2-v1_20260924T142222Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 0 | 0 | 0 | yuboriladi |
| 23 | 2026-10-02 | `solo_29669_pm-m2d13-v1_20260925T105755Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+3) | 0 | 0 | yuboriladi |
| 24 | 2026-10-02 | `solo_35840_pm-m1d2-v1_20260925T130841Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+1) | 0 | 0 | yuboriladi |
| 25 | 2026-10-05 | `sess_903631_20261005T104116Z` | live | html-02-v16 | Live mode permits exactly one attempt per question. | 15 → 15 | 0 | 0 | 0 | 4 | yuboriladi |
| 26 | 2026-10-05 | `solo_36516_html-02-v16_20260928T132343Z` | solo | html-02-v16 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+1) | 0 | 0 | yuboriladi |
| 27 | 2026-10-05 | `sess_365731_20261005T121454Z` | live | pm-m4d15-v1 | Live mode permits exactly one attempt per question. | 13 → 13 | 0 | 0 | 0 | 1 | yuboriladi |
| 28 | 2026-10-06 | `solo_31955_react-intro-01-v18_20260929T130029Z` | solo | react-intro-01-v18 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+3) | 0 | 0 | yuboriladi |
| 29 | 2026-10-06 | `solo_29999_practice-03-decompose-v18_20260929T142757Z` | solo | practice-03-decompose-v18 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+1) | 0 | 0 | yuboriladi |
| 30 | 2026-10-07 | `sess_279506_20261007T104156Z` | live | pm-m2d2-v1 | Live mode permits exactly one attempt per question. | 13 → 0 | 13 | 0 | 0 | 1 | chiqariladi |
| 31 | 2026-10-07 | `solo_29150_data-intro-04-01-v18_20260930T134628Z` | solo | data-intro-04-01-v18 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+2) | 0 | 0 | yuboriladi |
| 32 | 2026-10-07 | `solo_30306_pm-m4d2-v1_20260930T140456Z` | solo | pm-m4d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+3) | 0 | 0 | yuboriladi |
| 33 | 2026-10-07 | `solo_30289_pm-m4d2-v1_20260930T140510Z` | solo | pm-m4d2-v1 | The correct flag does not match the selected option. | 1 → 0 | 1 | 0 | 0 | 0 | chiqariladi |
| 34 | 2026-10-07 | `solo_30295_pm-m4d2-v1_20260930T142519Z` | solo | pm-m4d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+2) | 0 | 0 | yuboriladi |
| 35 | 2026-10-07 | `solo_30548_pm-m4d2-v1_20260930T143335Z` | solo | pm-m4d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+1) | 0 | 0 | yuboriladi |
| 36 | 2026-10-07 | `solo_30549_pm-m4d2-v1_20260930T144337Z` | solo | pm-m4d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+3) | 0 | 0 | yuboriladi |
| 37 | 2026-10-09 | `solo_30648_pm-m4d2-v1_20261002T130852Z` | solo | pm-m4d2-v1 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+2) | 0 | 0 | yuboriladi |
| 38 | 2026-10-09 | `sess_019443_20261009T121448Z` | live | js-loops-01-v18 | Live mode permits exactly one attempt per question. | 16 → 16 | 0 | 0 | 0 | 1 | yuboriladi |
| 39 | 2026-10-12 | `sess_819195_20261012T103453Z` | live | css-01-v17 | Live mode permits exactly one attempt per question. | 16 → 16 | 0 | 1 (+1) | 15 | 2 | yuboriladi |
| 40 | 2026-10-12 | `sess_098894_20261012T135339Z` | live | html-practice-portfolio-v2 | Live mode permits exactly one attempt per question. | 15 → 15 | 0 | 0 | 0 | 1 | yuboriladi |
| 41 | 2026-10-15 | `solo_32378_react-build-site-final-p4-v18_20261008T113007Z` | solo | react-build-site-final-p4-v18 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+4) | 0 | 0 | yuboriladi |
| 42 | 2026-10-17 | `solo_32323_react-build-site-final-p4-v18_20261010T090701Z` | solo | react-build-site-final-p4-v18 | The correct flag does not match the selected option. | 1 → 1 | 0 | 1 (+4) | 0 | 0 | yuboriladi |
| 43 | 2026-10-19 | `solo_32038_pm-m4d7-v1_20261019T120610Z` | solo | pm-m4d7-v1 | The correct flag does not match the selected option. | 1 → 0 | 1 | 0 | 0 | 0 | chiqariladi |
| 44 | 2026-10-27 | `sess_309563_20261027T041455Z` | live | pm-m1d6-v1 | Live mode permits exactly one attempt per question. | 15 → 15 | 0 | 0 | 0 | 1 | yuboriladi |
| 45 | 2026-10-27 | `sess_728518_20261027T121132Z` | live | fullstack-connect-practice-p2-v18 | Live mode permits exactly one attempt per question. | 7 → 7 | 0 | 0 | 0 | 1 | yuboriladi |
| 46 | 2026-10-27 | `sess_992402_20261027T132946Z` | live | pg-crud-04-05-v18 | Live mode permits exactly one attempt per question. | 13 → 13 | 0 | 0 | 13 | 0 | yuboriladi |
| 47 | 2026-10-29 | `sess_204521_20261029T141614Z` | live | pm-m4d7-v1 | Live mode permits exactly one attempt per question. | 12 → 12 | 0 | 0 | 0 | 1 | yuboriladi |
| 48 | 2026-10-30 | `sess_482974_20261030T121455Z` | live | react-api-get-05-v18 | Live mode permits exactly one attempt per question. | 7 → 7 | 0 | 0 | 0 | 2 | yuboriladi |
| 49 | 2026-11-02 | `solo_31005_cicd-full-pipeline-4c-03-v18_20261102T120926Z` | solo | cicd-full-pipeline-4c-03-v18 | The correct flag does not match the selected option. | 1 → 0 | 1 | 0 | 0 | 0 | chiqariladi |
| 50 | 2026-11-07 | `solo_29085_pm-m3d14-v1_20261031T061309Z` | solo | pm-m3d14-v1 | The answer must match options[option]. | 1 → 1 | 0 | 0 | 0 | 3 | yuboriladi |

## 3. CSV ustunlari

| Ustun | Ma'nosi |
|---|---|
| `event_id`, `sana`, `mode`, `lesson_id`, `lesson_version_hozir` | Xabar va dars. Versiya — reestrdagi hozirgi versiya (eski urinishning aniq versiyasi yozilmagan) |
| `student_id` | LMS id |
| `takror` | Shu o'quvchi + dars 50 ta xabarning boshqasida ham bor |
| `eski_xato` | School API'ning 422 sababi |
| `eski_*` / `yangi_*` | 422 olgan xabardagi qiymat / qayta yig'ilgan qiymat (`answered`, `correct`, `completed`, `badges`) |
| `tafsilot` | `to'liq` · `tushirildi: invalid_text` ([object Object]) · `tushirildi: version_mismatch` (kalit o'quvchi ko'rgan matnga mos emas) · `tushirildi: size` |
| `chiqarilgan_urinishlar` | Savol tarixidan olib tashlangan urinishlar soni va sababi |
| `bizda_holat` | `yuboriladi` · `chiqariladi: …` · `manbada topilmadi` |
| `sizda_tekshirish` | Bo'sh — brauzer natijasi va coin reyestri bo'yicha sizning belgingiz |

## 4. Qoidalar (16-hujjat 5-bo'limi)

- `correct` o'quvchi ko'rgan savol versiyasining kaliti bilan: `correct_answer` matni urinish paytida yozilgan, kalit indeksi shu matnga mos kelmasa yozuv chiqarilgan. Savol yoki variant matni birinchi urinishdan farq qilsa — chiqarilgan.
- Jonli darsda har savolga faqat birinchi urinish.
- Agregat `correct_answers` qayta hisoblangan, jadvalda eski va yangi yonma-yon.
- `event_id` o'sha qoladi. Siz «yuboriladi» qatorlardan qaysilari ketishini belgilaysiz; keyin bitta xabar → sizda tekshiruv → qolganlari.
