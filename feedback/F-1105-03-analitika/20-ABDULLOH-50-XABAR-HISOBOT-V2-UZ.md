# Abdullohga: 50 ta xabar — sinov rejimida qayta yig'ish hisoboti, 2-nashr (hech narsa yuborilmagan)

**Sana:** 2026-11-09 · **Asos:** sizning 18-javobingiz (bizda `19-ABDULLOH-16-17-JAVOB-UZ.md`), 8-bo'lim talablari · **Jadval:** `20a-50-XABAR-HISOBOT-V2.csv` (229 qator = o'quvchi × xabar)
**Manba:** prod Dars API `0.1.0+7e53ca91`, qayta yig'ish `dry: true` — bazaga yozilmadi, School API'ga yuborilmadi. 17-hisobot (1-nashr) bekor, bu nashr uning o'rnini bosadi.

## 0. 1-nashrdan keyin nima o'zgardi (sizning javobingiz bo'yicha)

| № | O'zgarish | Sabab (18-javob) | Natija shu hisobotda |
|---|---|---|---|
| 1 | Qisman tafsilot bekor: validator tenglikka qaytdi (F-1109-02, prod 17:04) | §2 — School API `answered = questions` tengligini tekshiradi | Qisman qator YO'Q. 14:24–16:48 da 20 oddiy hodisa 422 olgan edi, qayta yuborildi, qabul qilindi |
| 2 | Amaliyot ekrani (kalit `-1`) `tests` hisobidan chiqdi: `answered`, `correct_answers`, `total_questions`, `questions[]` | §2 — tekshiruvsiz «Bajardim» tekshirilgan to'g'ri javob emas, `correct:null` kelishuvi | 20 qatorda `answered` kamaydi (amaliyot chiqdi), tafsilot shu o'quvchilarda endi to'liq |
| 3 | Jonli `completed` faqat `reached_end` (oxirgi o'quv ekraniga yetganlik) | §4 — kelishilgan mezon | 30321 · `css-01-v17`: `completed` `false` qoladi (quyida dalil) |
| 4 | Qayta yig'ishda `total_questions` = hodisa yopilgan paytdagi total (saqlangan xabardan) − shu sessiyada bajarilgan amaliyot ekrani | §8.2 — nishon o'zgarishi sababi | 1-nashrdagi 20 ta `html-practice-portfolio-v2` nishon-o'zgarishi BIZNING XATO edi (dars 16.10 da 6 test → 1 test, eski kalitlar bazada qolib total 6→7); endi total tarixiy |
| 5 | Chiqarilgan har qator uchun o'rnini bosgan hodisa `event_id`, holati, yetkazilgan vaqti | §8.1 | 1-bo'lim jadvali |
| 6 | Tarixiy versiya ustuni `lesson_version_tarixiy` (LMS yuklash jurnali bo'yicha, sessiya kuniga) va `dalil` ustuni | §8.3 | CSV |
| 7 | `event_id` o'sha qoladi, `_r1` avtomatik qo'shilmaydi | §8.4 | Qabul |

## 1. Yig'ma

| | Soni |
|---|---|
| Xabarlar | 50 (jonli 15, uyda 35) |
| O'quvchi natijasi yozuvlari (eski xabarlarda) | 229 |
| Noyob o'quvchi | 197 · noyob o'quvchi + dars: 229 |
| Qayta yig'ilganda yuboriladigan yozuvlar (NOMZOD, tasdiqlangan ro'yxat emas) | 213 |
| Bizda chiqariladi (o'rnini bosgan hodisa 2-bo'limda) | 16 |
| `total_questions` o'zgargan xabarlar | 2 (css-01-v17: 5→4; pg-crud-04-05-v18: 5→4) |
| `answered` o'zgaradi | 20 (hammasi amaliyot ekrani chiqqani uchun, `ozgarish_sababi` ustuni) |
| `correct_answers` o'zgaradi | 47 qatorda, jami +36: oshgani 27 (kalit bo'yicha qayta hisob, F-1106-01), kamaygani 20 (amaliyot ekrani `correct_answers` dan chiqdi) |
| `completed` o'zgaradi | 6 — hammasi `true` → `false`: eski xabarda «hamma savolga javob berdi» zaxira qoidasi bilan tugatgan hisoblangan, urinish jadvalida `reached_end` yo'q (react-api-get-05-v18 · 31981; html-02-v16 · 30321; html-02-v16 · 30815; html-02-v16 · 37033; css-01-v17 · 37309; react-api-get-05-v18 · 30093) |
| `badges` o'zgaradi (yuboriladigan qatorlarda) | 20 — sabablari 3-bo'limda |
| Tafsilot | `to'liq` 209 · `matnsiz savol` 7 · `invalid_text` 13 |
| Tarixdan chiqarilgan urinishlar | 29 (jonli: ikkinchi urinish; uyda: boshqa dars versiyasi) |
| Xabar holati | yuboriladi 46 · butunlay chiqariladi 4 · xato 0 |

**Tafsilot holatlari.** `to'liq` — `answered` = `questions[]`, har yozuvda matn va kalit. `tushirildi: invalid_text` — bitta dars (`pg-crud-04-05-v18`), matn o'rniga `[object Object]` yozilgan: asosiy natija ketadi, tafsilot yo'q. `tushirildi: matnsiz savol` — test savoli (haqiqiy kalitli maxsus ekran) matnsiz yozilgan: tenglik buzilmasin deb o'sha o'quvchining tafsiloti tushiriladi, asosiy natija ketadi; 172 dars relizida bunday ekranlar matn yozadigan bo'ladi.

**`completed` pasaygan 6 o'quvchi haqida.** Bu sizning 4-bo'limingizdagi talabning to'g'ridan-to'g'ri natijasi: tugatganlik faqat oxirgi o'quv ekraniga yetganlik bilan o'lchanadi. Hammasida testlar to'liq javoblangan, lekin urinish yozuvida `reached_end` yo'q (sessiya `live_ended` bilan yopilgan). Eski xabar ularni zaxira qoida bilan tugatgan deb yuborgan edi; yangi xabarda `completed: false`, `graduate` nishoni yo'q, coin huquqi yo'q. Agar siz bu o'quvchilar uchun CRM tarixida boshqa dalil ko'rsangiz, qatorni belgilang — alohida ko'rib chiqamiz.

## 2. Chiqarilgan 16 yozuv — o'rnini bosgan hodisa (8.1)

Qoida: shu o'quvchining shu dars bo'yicha `completed: true` natijasi boshqa hodisada yetkazilgan (`delivered`) yoki shu to'plamda oldinroq yuboriladi. «Yetkazilgan» coin berilganini bildirmaydi — buni siz reyestr bilan tekshirasiz; biz faqat hodisani ko'rsatamiz.

| Chiqarilgan hodisa | Dars | O'quvchi | O'rnini bosgan hodisa | Holati | Yetkazilgan (UTC) |
|---|---|---|---|---|---|
| `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 30234 | `sess_779909_20261007T112727Z` | delivered | 2026-10-07T11:37:34.184Z |
| `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 30266 | `sess_779909_20261007T112727Z` | delivered | 2026-10-07T11:37:34.184Z |
| `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 30365 | `sess_779909_20261007T112727Z` | delivered | 2026-10-07T11:37:34.184Z |
| `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 30400 | `sess_779909_20261007T112727Z` | delivered | 2026-10-07T11:37:34.184Z |
| `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 30450 | `sess_779909_20261007T112727Z` | delivered | 2026-10-07T11:37:34.184Z |
| `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 33894 | `sess_779909_20261007T112727Z` | delivered | 2026-10-07T11:37:34.184Z |
| `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 34798 | `sess_779909_20261007T112727Z` | delivered | 2026-10-07T11:37:34.184Z |
| `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 35278 | `sess_779909_20261007T112727Z` | delivered | 2026-10-07T11:37:34.184Z |
| `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 35834 | `sess_779909_20261007T112727Z` | delivered | 2026-10-07T11:37:34.184Z |
| `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 36081 | `sess_779909_20261007T112727Z` | delivered | 2026-10-07T11:37:34.184Z |
| `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 36098 | `sess_779909_20261007T112727Z` | delivered | 2026-10-07T11:37:34.184Z |
| `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 36413 | `sess_779909_20261007T112727Z` | delivered | 2026-10-07T11:37:34.184Z |
| `sess_279506_20261007T104156Z` | pm-m2d2-v1 | 36586 | `sess_779909_20261007T112727Z` | delivered | 2026-10-07T11:37:34.184Z |
| `solo_30289_pm-m4d2-v1_20260930T140510Z` | pm-m4d2-v1 | 30289 | `solo_30289_pm-m4d2-v1_20261026T142912Z` | delivered | 2026-10-28T14:22:05.929Z |
| `solo_32038_pm-m4d7-v1_20261019T120610Z` | pm-m4d7-v1 | 32038 | `sess_924371_20261019T121259Z` | delivered | 2026-10-19T12:46:04.551Z |
| `solo_31005_cicd-full-pipeline-4c-03-v18_20261102T120926Z` | cicd-full-pipeline-4c-03-v18 | 31005 | `sess_020508_20261102T121037Z` | delivered | 2026-11-02T13:50:15.131Z |

## 3. `badges` o'zgargan 20 yozuv — sabablari (8.2)

Nishon qoidalari (o'zgarmagan): `all_correct` = correct = total · `first_try` = hammasiga birinchi urinishda to'g'ri · `speedster` = guruh medianasidan tez va nisbat ≥ 0.8 · `graduate` = completed · `top_N` = podium · `participant` = ro'yxat bo'sh qolganda o'rnini bosuvchi (nishon emas). Sabab ustunida qaysi kirish o'zgargani yozilgan.

| Hodisa | Dars | O'quvchi | Eski | Yangi | Sabab |
|---|---|---|---|---|---|
| `sess_137686_20260929T121301Z` | react-api-get-05-v18 | 31981 | all_correct|first_try|graduate | all_correct|first_try | completed ha→yo'q (reached_end=yo'q); graduate ← completed |
| `solo_31136_pm-m2d13-v1_20260925T104945Z` | pm-m2d13-v1 | 31136 | graduate | all_correct|first_try|graduate | correct 1→4 (kalit bo'yicha qayta hisob, F-1106-01); all_correct/first_try ← correct va total |
| `sess_903631_20261005T104116Z` | html-02-v16 | 30321 | all_correct|first_try|speedster|top_1|graduate | all_correct|first_try|speedster|top_1 | completed ha→yo'q (reached_end=yo'q); graduate ← completed |
| `sess_903631_20261005T104116Z` | html-02-v16 | 30815 | all_correct|first_try|graduate | all_correct|first_try | completed ha→yo'q (reached_end=yo'q); graduate ← completed |
| `sess_903631_20261005T104116Z` | html-02-v16 | 37033 | graduate | participant | completed ha→yo'q (reached_end=yo'q); participant — faqat bo'sh ro'yxat o'rnini bosuvchi; graduate ← completed |
| `sess_819195_20261012T103453Z` | css-01-v17 | 36866 | speedster|graduate | graduate | total 5→4 (amaliyot ekrani testdan chiqarildi); answered 5→4 (amaliyot ekrani testdan chiqarildi); correct 4→3 (amaliyot ekrani testdan chiqarildi) |
| `sess_819195_20261012T103453Z` | css-01-v17 | 37033 | speedster|graduate | graduate | total 5→4 (amaliyot ekrani testdan chiqarildi); answered 5→4 (amaliyot ekrani testdan chiqarildi); correct 4→3 (amaliyot ekrani testdan chiqarildi) |
| `sess_819195_20261012T103453Z` | css-01-v17 | 37058 | speedster|graduate | graduate | total 5→4 (amaliyot ekrani testdan chiqarildi); answered 5→4 (amaliyot ekrani testdan chiqarildi); correct 4→3 (amaliyot ekrani testdan chiqarildi) |
| `sess_819195_20261012T103453Z` | css-01-v17 | 37309 | all_correct|first_try|graduate | all_correct|first_try | total 5→4 (amaliyot ekrani testdan chiqarildi); answered 5→4 (amaliyot ekrani testdan chiqarildi); correct 5→4 (amaliyot ekrani testdan chiqarildi); completed ha→yo'q (reached_end=yo'q); graduate ← completed |
| `sess_992402_20261027T132946Z` | pg-crud-04-05-v18 | 31299 | speedster|graduate | all_correct|first_try|speedster|top_1|graduate | total 5→4 (amaliyot ekrani testdan chiqarildi); all_correct/first_try ← correct va total; top_N ← podium qayta (amaliyot ball sifatida kirmaydi; to'g'ri soni, vaqt) |
| `sess_992402_20261027T132946Z` | pg-crud-04-05-v18 | 31601 | all_correct|first_try|top_3|graduate|arena_top_1 | all_correct|first_try|graduate|arena_top_1 | total 5→4 (amaliyot ekrani testdan chiqarildi); answered 5→4 (amaliyot ekrani testdan chiqarildi); correct 5→4 (amaliyot ekrani testdan chiqarildi); top_N ← podium qayta (amaliyot ball sifatida kirmaydi; to'g'ri soni, vaqt) |
| `sess_992402_20261027T132946Z` | pg-crud-04-05-v18 | 32003 | all_correct|first_try|speedster|top_1|graduate | all_correct|first_try|speedster|top_2|graduate | total 5→4 (amaliyot ekrani testdan chiqarildi); answered 5→4 (amaliyot ekrani testdan chiqarildi); correct 5→4 (amaliyot ekrani testdan chiqarildi); top_N ← podium qayta (amaliyot ball sifatida kirmaydi; to'g'ri soni, vaqt) |
| `sess_992402_20261027T132946Z` | pg-crud-04-05-v18 | 32260 | all_correct|first_try|speedster|top_2|graduate | all_correct|first_try|speedster|graduate | total 5→4 (amaliyot ekrani testdan chiqarildi); answered 5→4 (amaliyot ekrani testdan chiqarildi); correct 5→4 (amaliyot ekrani testdan chiqarildi); top_N ← podium qayta (amaliyot ball sifatida kirmaydi; to'g'ri soni, vaqt) |
| `sess_992402_20261027T132946Z` | pg-crud-04-05-v18 | 32564 | speedster|graduate|arena_top_3 | all_correct|first_try|speedster|top_3|graduate|arena_top_3 | total 5→4 (amaliyot ekrani testdan chiqarildi); all_correct/first_try ← correct va total; top_N ← podium qayta (amaliyot ball sifatida kirmaydi; to'g'ri soni, vaqt) |
| `sess_992402_20261027T132946Z` | pg-crud-04-05-v18 | 32565 | speedster|graduate | graduate | total 5→4 (amaliyot ekrani testdan chiqarildi); answered 5→4 (amaliyot ekrani testdan chiqarildi); correct 4→3 (amaliyot ekrani testdan chiqarildi) |
| `sess_992402_20261027T132946Z` | pg-crud-04-05-v18 | 32582 | graduate | all_correct|first_try|graduate | total 5→4 (amaliyot ekrani testdan chiqarildi); all_correct/first_try ← correct va total |
| `sess_992402_20261027T132946Z` | pg-crud-04-05-v18 | 32638 | graduate | all_correct|first_try|graduate | total 5→4 (amaliyot ekrani testdan chiqarildi); all_correct/first_try ← correct va total |
| `sess_992402_20261027T132946Z` | pg-crud-04-05-v18 | 32697 | graduate | all_correct|first_try|graduate | total 5→4 (amaliyot ekrani testdan chiqarildi); all_correct/first_try ← correct va total |
| `sess_992402_20261027T132946Z` | pg-crud-04-05-v18 | 32795 | graduate | all_correct|first_try|graduate | total 5→4 (amaliyot ekrani testdan chiqarildi); all_correct/first_try ← correct va total |
| `sess_482974_20261030T121455Z` | react-api-get-05-v18 | 30093 | all_correct|first_try|speedster|top_2|graduate|arena_top_2 | all_correct|first_try|speedster|top_2|arena_top_2 | completed ha→yo'q (reached_end=yo'q); graduate ← completed |

## 4. 30321 · `css-01-v17` · `sess_819195_20261012T103453Z` (4-bo'lim)

- Sessiya: mentor yopgan (`mentor`, 2026-10-12T11:50:40.661Z); o'quvchilar 16, oxiriga yetgan (`reached_end`) 13.
- 30321: urinish `finished`, yakun sababi `live_ended`, `reached_end` = **false**; bazada javob 5 (to'g'ri 4), matnli urinish 4.
- 1-nashrdagi «5-javob» — `s15` yakuniy amaliyot ekrani (CSS qoidasini qo'lda yozish; kod uni tekshiradi, lekin savol-variant matni yo'q). Endi u `tests` hisobiga kirmaydi: `answered` 4→4, `correct_answers` 3→3, `total` 5→4.
- `completed`: **yo'q** (`reached_end` yo'q). Yangi yakunlash va coin huquqi YO'Q — sizning talabingizga mos.

## 5. `pm-m2d13-v1` (3-bo'lim)

- Dars id `pm-m2d13-v1` → `pm-m2d13-v2` 19.10.2026 da o'zgargan (pitch darslari qisqartirilganda, bizning commit `ffd6e14a`); 19.10 relizida LMS'ga v2 yuklangan. 7 natija 21–25.09 dagi, ya'ni sentyabr LMS tuzilmasi (o'sha paytdagi Class'ni bizning reestr bilmaydi, reestr 19.10 dan yuritiladi).
- 16a reestrga `eski_lesson_id` ustuni qo'shildi (shu hisobotda: `pm-m2d13-v1 → pm-m2d13-v2`). Bu faqat «qaysi dars» mosligi; o'sha kundagi CRM Class/Learn'ni siz tasdiqlaysiz, biz avtomatik birlashtirmaymiz.

## 6. Tarixiy versiya dalili (8.3)

- `lesson_version_tarixiy` — sessiya kunida LMS'da turgan versiya (LMS yuklash jurnali bo'yicha: 19.10 to'liq reliz v3, keyingi yuklashlar sana bilan). 19.10 dan oldingi sessiyalar uchun «reestr oldi (sentyabr yuklash)». `lesson_version_hozir` — hozirgi versiya, yordamchi.
- `dalil` — baholashga ishlatilgan savol/variant/kalit mosligi: tafsilotdagi matnlar o'quvchi javob bergan PAYTDA yozilgan (`answer_attempts.texts`), qayta yig'ishda kalit shu matnga tekshiriladi (`correct_answer` = `options[correct_option]`); mos kelmasa yozuv chiqariladi (`chiqarilgan_urinishlar`) yoki tafsilot tushiriladi (`version_mismatch`). Ya'ni dalil hodisaning ichida: har savolda matn + kalit + o'quvchi javobi.
- Hozir `attempts` da versiya ustuni yo'q (16-hujjat 4.2 rejasi) — shuning uchun versiya jurnal bo'yicha, kalit↔matn tekshiruvi esa yozuv darajasida.

## 7. Xabarlar bo'yicha

| # | Sana | `event_id` | Rejim | Dars | Eski xato | Total eski→yangi | O'quvchi: eski → yangi | Chiqarildi | `correct` o'zgardi | reached_end | Holat |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2026-09-21 | `sess_027948_20260921T134401Z` | live | html-practice-portfolio-v2 | Attempt elapsed times must increase. | 6→6 | 17 → 17 | 0 | 0 | 17/17 | yuboriladi |
| 2 | 2026-09-21 | `solo_35487_pm-m2d2-v1_20260921T112604Z` | solo | pm-m2d2-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+1) | — | yuboriladi |
| 3 | 2026-09-21 | `solo_35476_pm-m2d13-v1_20260921T111656Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 0 | — | yuboriladi |
| 4 | 2026-09-21 | `solo_31347_pm-m1d2-v1_20260921T111944Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 5→5 | 1 → 1 | 0 | 1 (+1) | — | yuboriladi |
| 5 | 2026-09-21 | `solo_36995_pm-m1d2-v1_20260921T120152Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 5→5 | 1 → 1 | 0 | 1 (+2) | — | yuboriladi |
| 6 | 2026-09-21 | `solo_36410_pm-m1d2-v1_20260921T131932Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 5→5 | 1 → 1 | 0 | 1 (+3) | — | yuboriladi |
| 7 | 2026-09-21 | `solo_34941_pm-m1d2-v1_20260921T132950Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 5→5 | 1 → 1 | 0 | 1 (+1) | — | yuboriladi |
| 8 | 2026-09-29 | `sess_137686_20260929T121301Z` | live | react-api-get-05-v18 | Live mode permits exactly one attempt per question. | 4→4 | 15 → 15 | 0 | 0 | 14/15 | yuboriladi |
| 9 | 2026-09-22 | `solo_36700_pm-m1d2-v1_20260922T124938Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 5→5 | 1 → 1 | 0 | 1 (+1) | — | yuboriladi |
| 10 | 2026-09-22 | `solo_29957_pm-m2d13-v1_20260922T142311Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+1) | — | yuboriladi |
| 11 | 2026-09-23 | `solo_31293_vscode-start-01-v1_20260923T050927Z` | solo | vscode-start-01-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+1) | — | yuboriladi |
| 12 | 2026-09-23 | `solo_35887_pm-m2d2-v1_20260923T114932Z` | solo | pm-m2d2-v1 | The answer must match options[option]. | 4→4 | 1 → 1 | 0 | 0 | — | yuboriladi |
| 13 | 2026-09-25 | `solo_31136_pm-m2d13-v1_20260925T104945Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+3) | — | yuboriladi |
| 14 | 2026-09-30 | `sess_819479_20260930T103109Z` | live | js-intro-01-v18 | Live mode permits exactly one attempt per question. | 5→5 | 8 → 8 | 0 | 0 | 7/8 | yuboriladi |
| 15 | 2026-09-30 | `sess_330364_20260930T103644Z` | live | pm-m2d7-v1 | Live mode permits exactly one attempt per question. | 4→4 | 12 → 12 | 0 | 0 | 12/12 | yuboriladi |
| 16 | 2026-09-23 | `solo_36342_pm-m1d2-v1_20260923T130935Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 5→5 | 1 → 1 | 0 | 0 | — | yuboriladi |
| 17 | 2026-09-23 | `solo_31826_internet-01-v18_20260923T131526Z` | solo | internet-01-v18 | The correct flag does not match the selected option. | 5→5 | 1 → 1 | 0 | 1 (+1) | — | yuboriladi |
| 18 | 2026-09-24 | `solo_34968_pm-m2d13-v1_20260924T121026Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+3) | — | yuboriladi |
| 19 | 2026-09-24 | `solo_31981_pm-m2d13-v1_20260924T121243Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+3) | — | yuboriladi |
| 20 | 2026-09-24 | `solo_29916_pm-m2d13-v1_20260924T121417Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+3) | — | yuboriladi |
| 21 | 2026-09-24 | `solo_33114_pean-stack-01-v18_20260924T125527Z` | solo | pean-stack-01-v18 | The correct flag does not match the selected option. | 5→5 | 1 → 1 | 0 | 1 (+2) | — | yuboriladi |
| 22 | 2026-09-24 | `solo_29058_pm-m1d2-v1_20260924T142222Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 5→5 | 1 → 1 | 0 | 0 | — | yuboriladi |
| 23 | 2026-09-25 | `solo_29669_pm-m2d13-v1_20260925T105755Z` | solo | pm-m2d13-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+3) | — | yuboriladi |
| 24 | 2026-09-25 | `solo_35840_pm-m1d2-v1_20260925T130841Z` | solo | pm-m1d2-v1 | The correct flag does not match the selected option. | 5→5 | 1 → 1 | 0 | 1 (+1) | — | yuboriladi |
| 25 | 2026-10-05 | `sess_903631_20261005T104116Z` | live | html-02-v16 | Live mode permits exactly one attempt per question. | 4→4 | 15 → 15 | 0 | 0 | 12/15 | yuboriladi |
| 26 | 2026-09-28 | `solo_36516_html-02-v16_20260928T132343Z` | solo | html-02-v16 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+1) | — | yuboriladi |
| 27 | 2026-10-05 | `sess_365731_20261005T121454Z` | live | pm-m4d15-v1 | Live mode permits exactly one attempt per question. | 4→4 | 13 → 13 | 0 | 0 | 13/13 | yuboriladi |
| 28 | 2026-09-29 | `solo_31955_react-intro-01-v18_20260929T130029Z` | solo | react-intro-01-v18 | The correct flag does not match the selected option. | 5→5 | 1 → 1 | 0 | 1 (+3) | — | yuboriladi |
| 29 | 2026-09-29 | `solo_29999_practice-03-decompose-v18_20260929T142757Z` | solo | practice-03-decompose-v18 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+1) | — | yuboriladi |
| 30 | 2026-10-07 | `sess_279506_20261007T104156Z` | live | pm-m2d2-v1 | Live mode permits exactly one attempt per question. | 4→4 | 13 → 0 | 13 | 0 | 9/13 | chiqariladi |
| 31 | 2026-09-30 | `solo_29150_data-intro-04-01-v18_20260930T134628Z` | solo | data-intro-04-01-v18 | The correct flag does not match the selected option. | 6→6 | 1 → 1 | 0 | 1 (+2) | — | yuboriladi |
| 32 | 2026-09-30 | `solo_30306_pm-m4d2-v1_20260930T140456Z` | solo | pm-m4d2-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+3) | — | yuboriladi |
| 33 | 2026-09-30 | `solo_30289_pm-m4d2-v1_20260930T140510Z` | solo | pm-m4d2-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 0 | 1 | 0 | — | chiqariladi |
| 34 | 2026-09-30 | `solo_30295_pm-m4d2-v1_20260930T142519Z` | solo | pm-m4d2-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+2) | — | yuboriladi |
| 35 | 2026-09-30 | `solo_30548_pm-m4d2-v1_20260930T143335Z` | solo | pm-m4d2-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+1) | — | yuboriladi |
| 36 | 2026-09-30 | `solo_30549_pm-m4d2-v1_20260930T144337Z` | solo | pm-m4d2-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+3) | — | yuboriladi |
| 37 | 2026-10-02 | `solo_30648_pm-m4d2-v1_20261002T130852Z` | solo | pm-m4d2-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 1 | 0 | 1 (+2) | — | yuboriladi |
| 38 | 2026-10-09 | `sess_019443_20261009T121448Z` | live | js-loops-01-v18 | Live mode permits exactly one attempt per question. | 4→4 | 16 → 16 | 0 | 0 | 16/16 | yuboriladi |
| 39 | 2026-10-12 | `sess_819195_20261012T103453Z` | live | css-01-v17 | Live mode permits exactly one attempt per question. | 5→4 | 16 → 16 | 0 | 14 (-14) | 13/16 | yuboriladi |
| 40 | 2026-10-12 | `sess_098894_20261012T135339Z` | live | html-practice-portfolio-v2 | Live mode permits exactly one attempt per question. | 6→6 | 15 → 15 | 0 | 0 | 15/15 | yuboriladi |
| 41 | 2026-10-08 | `solo_32378_react-build-site-final-p4-v18_20261008T113007Z` | solo | react-build-site-final-p4-v18 | The correct flag does not match the selected option. | 5→5 | 1 → 1 | 0 | 1 (+4) | — | yuboriladi |
| 42 | 2026-10-10 | `solo_32323_react-build-site-final-p4-v18_20261010T090701Z` | solo | react-build-site-final-p4-v18 | The correct flag does not match the selected option. | 5→5 | 1 → 1 | 0 | 1 (+4) | — | yuboriladi |
| 43 | 2026-10-19 | `solo_32038_pm-m4d7-v1_20261019T120610Z` | solo | pm-m4d7-v1 | The correct flag does not match the selected option. | 4→4 | 1 → 0 | 1 | 0 | — | chiqariladi |
| 44 | 2026-10-27 | `sess_309563_20261027T041455Z` | live | pm-m1d6-v1 | Live mode permits exactly one attempt per question. | 4→4 | 15 → 15 | 0 | 0 | 15/15 | yuboriladi |
| 45 | 2026-10-27 | `sess_728518_20261027T121132Z` | live | fullstack-connect-practice-p2-v18 | Live mode permits exactly one attempt per question. | 4→4 | 7 → 7 | 0 | 0 | 7/7 | yuboriladi |
| 46 | 2026-10-27 | `sess_992402_20261027T132946Z` | live | pg-crud-04-05-v18 | Live mode permits exactly one attempt per question. | 5→4 | 13 → 13 | 0 | 6 (-6) | 13/13 | yuboriladi |
| 47 | 2026-10-29 | `sess_204521_20261029T141614Z` | live | pm-m4d7-v1 | Live mode permits exactly one attempt per question. | 4→4 | 12 → 12 | 0 | 0 | 12/12 | yuboriladi |
| 48 | 2026-10-30 | `sess_482974_20261030T121455Z` | live | react-api-get-05-v18 | Live mode permits exactly one attempt per question. | 4→4 | 7 → 7 | 0 | 0 | 6/7 | yuboriladi |
| 49 | 2026-11-02 | `solo_31005_cicd-full-pipeline-4c-03-v18_20261102T120926Z` | solo | cicd-full-pipeline-4c-03-v18 | The correct flag does not match the selected option. | 1→1 | 1 → 0 | 1 | 0 | — | chiqariladi |
| 50 | 2026-10-31 | `solo_29085_pm-m3d14-v1_20261031T061309Z` | solo | pm-m3d14-v1 | The answer must match options[option]. | 4→4 | 1 → 1 | 0 | 0 | — | yuboriladi |

## 8. CSV ustunlari

| Ustun | Ma'nosi |
|---|---|
| `event_id`, `sana`, `mode`, `lesson_id` | Xabar va dars (`lesson_id` — o'sha paytdagi tashqi id) |
| `lesson_id_hozir`, `class_id`, `learn_id` | Reestrdagi hozirgi id va bog'lanish (eski id bo'lsa `eski_lesson_id` orqali); Class/Learn'ni siz tasdiqlaysiz |
| `lesson_version_tarixiy` / `lesson_version_hozir` | Sessiya kunidagi versiya (yuklash jurnali) / hozirgi |
| `student_id`, `takror` | LMS id; shu o'quvchi + dars 50 ta xabarning boshqasida ham bor |
| `eski_xato` | School API'ning 422 sababi |
| `eski_total` / `yangi_total` | Xabardagi `total_questions` |
| `eski_*` / `yangi_*` | 422 olgan xabardagi / qayta yig'ilgan qiymat |
| `ozgarish_sababi` | Har o'zgargan qiymat uchun sabab (amaliyot ekrani chiqdi · kalit bo'yicha qayta hisob · reached_end) |
| `reached_end`, `urinish_yakuni` | Jonli: urinish jadvalidan (oxirgi ekranga yetganmi, qanday yakunlangan); uyda: urinish holatidan |
| `tafsilot` | `to'liq` · `tushirildi: matnsiz savol` (test savoli matnsiz — maxsus ekran) · `tushirildi: invalid_text` ([object Object], bitta dars) · `tushirildi: version_mismatch` · `tushirildi: size` |
| `dalil` | Tafsilot matni javob paytida yozilgan, kalit↔matn mos (savol/urinish soni) |
| `chiqarilgan_urinishlar` | Savol tarixidan olib tashlangan urinishlar soni va sababi |
| `bizda_holat` | `yuboriladi` (nomzod) · `chiqariladi` · `manbada topilmadi` |
| `orniga_hodisa`, `orniga_holat`, `orniga_yetkazilgan` | Chiqarilgan qator uchun o'rnini bosgan hodisa |
| `sizda_tekshirish` | Bo'sh — CRM brauzer tarixi va coin reyestri bo'yicha sizning belgingiz |

## 9. Tartib (o'zgarmagan)

Siz `yuboriladi` qatorlardan tasdiqlanganlarini belgilaysiz → bitta xabar (`event_id` o'sha, suffix yo'q) → sizda saqlash va haqiqiy mukofot tekshiruvi → qolganlari. Bizda saqlangan chiqsa — avval aniqlaymiz, `_r1` avtomatik emas.
