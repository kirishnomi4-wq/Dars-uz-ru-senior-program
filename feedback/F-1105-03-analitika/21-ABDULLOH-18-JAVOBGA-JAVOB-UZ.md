# Abdullohga: 18-javobingizga javob — nima tuzatildi, nima topildi, nima so'raymiz

**Sana:** 09.11.2026 (kech)
**Kimga:** Abdulloh (LMS, CRM, School API)
**Kimdan:** JSX va Dars API jamoasi
**Asos:** sizning `18-ABDULLOH-JSON-V1.1-VA-HISOBOT-JAVOB-UZ.md` (bizda `19-…`)
**Ilovalar:** `16-ABDULLOH-JSON-V1.1-VA-OTISH-TARTIBI-UZ.md` (v1.2 nashri) · `16a-REESTR-DARS-CLASS-LEARN.csv` (+ `eski_lesson_id`) · `20-ABDULLOH-50-XABAR-HISOBOT-V2-UZ.md` + `20a-50-XABAR-HISOBOT-V2.csv`

Mahsulot qoidalari o'zgarmaydi, biz ham shunday tushunamiz. Quyida sizning 9 bo'limingizga bandma-band javob: nima qilindi (prod'da yoki hujjatda), nima topildi, sizdan nima kerak.

| Sizning bo'lim | Qisqa javob | Qayerda |
|---|---|---|
| 1 | CSV raqamlari mos. 213 — nomzod, tasdiqlangan ro'yxat emas | 20 |
| 2 | Tenglik saqlanadi. Bizning 14:24 dagi yumshatish xato edi: 20 hodisa 422, 17:04 da qaytarildi. Amaliyot ekrani `tests` dan chiqarildi | 1-bo'lim quyida, 16 §2.2 |
| 3 | `pm-m2d13-v1` → `v2` 19.10 da; reestrga `eski_lesson_id` ustuni; Class'ni siz tasdiqlaysiz | 2-bo'lim, 16a |
| 4 | 30321: `reached_end: false` → `completed: false` qoladi, bizning qayta yig'ish xato edi | 3-bo'lim, 20 §4 |
| 5 | Server — manba, brauzer — ko'rsatish va bog'lash; `event_id` = `lr_` + `attempt_id` | 16 §3 |
| 6 | Versiyasiz eski urinish: 7 kun qoidasi bilan backfill yoki `unknown`; 4.3 ikki qoida; v1 yopilishi ikki tomon tasdig'i bilan | 16 §4 |
| 7 | `occurred_at` mantiqiy, `processed_at` haqiqiy; jonli 2 soat + 30 daq; A1, A2, C1 to'liq; `not_started` qoladi; kuzatish yakuniy holatgacha | 16 §2.2–2.4 |
| 8 | 16 chiqarilgan → o'rnini bosgan `event_id`; 22 nishon sababi (20 tasi bizning xato); tarixiy dalil ustunlari; `_r1` yo'q; qisman qator yo'q | 20 |
| 9 | QA ssenariylari 18–23 qo'shildi | 16 §6 |

---

## 1. Tenglik va amaliyot ekrani (sizning 2-bo'limingiz)

**Nima bo'ldi.** 09.11 14:24 da biz Dars API'da «`questions[]` `answered` dan kam bo'lishi mumkin» qoidasini prod'ga chiqargan edik (16-hujjat v1.1 dagi `partial`). Sizning javobingiz keldi: School API tenglikni tekshiradi. Prod'da 15:02–16:48 orasida 20 hodisa (3 jonli dars: 7, 13, 13 o'quvchi; 16 uyda) aynan shu sabab 422 oldi: «The answered count must equal the number of test question details». 17:04 da tenglikni qaytardik, 20 hodisani qayta yubordik — hammasi `201`. Bular bugungi oddiy oqim hodisalari, 50 talik tarixiy ro'yxatga tegilmadi.

**Yakuniy qoida (17:04 dan prod'da, 16 §2.2):**

- Yakuniy amaliyot ekrani (kalit `-1`: tekshiruvli yozma topshiriq ham, «Bajardim» ham) `tests` hisobiga **kirmaydi**: `answered`, `correct_answers`, `total_questions`, `questions[]` — faqat variantli test savollari. Shunda tenglik har doim bajariladi, tafsilot to'liq keladi (avval tugatgan o'quvchilarning ko'pida tushib ketardi).
- Amaliyot `tests.correct_answers` ga hech qachon kirmaydi. v2 da alohida `practice` bloki: kod tekshirgan bo'lsa `checked: true, correct: true/false`; «Bajardim» bo'lsa `checked: false, correct: null` (07-hujjat kelishuvi).
- `details.status: partial` v1.2 dan olib tashlandi. Kerak bo'lib qolsa — faqat ikkala tomon QA'sidan keyin.

**Sizdan:** production School API validatori ham `6b3c85d` dagi tenglikni tekshirishini tasdiqlang (biz shunga mosladik, farq bo'lsa aytasiz).

## 2. `pm-m2d13-v1` va reestr (3-bo'lim)

- Dars id `pm-m2d13-v1` → `pm-m2d13-v2` 19.10.2026 da o'zgargan (pitch darslari qisqartirilganda), 19.10 relizida LMS'ga v2 yuklangan. 7 natija 21–25.09 dagi, ya'ni sentyabr LMS tuzilmasi; o'sha paytdagi Class bizning reestrda yo'q (reestr 19.10 dan yuritiladi).
- 16a ga `eski_lesson_id` ustuni qo'shildi: 172 darsning har biri uchun avvalgi tashqi id'lar git tarixidan (62 darsda bor; `pm-m2d13-v2` ← `pm-m2d13-v1` ← `pm-demoday-pitch-06-v18`). Relizda joriy versiya yangilansa bu ustun o'chmaydi.
- Mukofot himoyasi sizda kanonik bog'lanish (o'quvchi + Class, o'quvchi + Learn) bo'yicha — qabul. Biz eski id'ni avtomatik birlashtirmaymiz: hisobotda `lesson_id` (o'sha paytdagi) va `lesson_id_hozir` alohida ustun.

**Sizdan:** `pm-m2d13-v1` 21–25.09 da qaysi Class/Learn'da bo'lganini CRM tarixidan tasdiqlang (o'quvchilar 35476, 29957, 31136, 34968, 31981, 29916, 29669).

## 3. 30321 · `css-01-v17` (4-bo'lim)

Siz haq edingiz. Prod'dan dalil: sessiya `sess_819195_20261012T103453Z`, mentor 11:50:40Z da yopgan; 16 o'quvchidan 13 tasi oxirgi ekranga yetgan; **30321 — `reached_end: false`**, urinish `live_ended`. 1-nashrdagi «5-javob» yakuniy amaliyot ekrani (`s15`, CSS qoidasini qo'lda yozish) edi; eski qoidamiz «hamma savolga javob berdi = tugatdi» uni hisoblab `completed: true` qilgan.

Tuzatildi (prod'da): jonli `completed` faqat `reached_end` (kelishilgan mezon), zaxira olib tashlandi; amaliyot ekrani testdan tashqari. Natija: 30321 uchun `completed: false`, `answered` 4, `correct_answers` 3, `total` 4 — yangi yakunlash va coin huquqi yo'q (20 §4).

## 4. Hisobot 2-nashri (8-bo'lim)

`20`/`20a` — `17`/`17a` o'rnini bosadi. Sizning 5 talabingiz:

1. **Chiqarilgan 16 yozuv** — har biriga o'rnini bosgan hodisa `event_id`, holati (`delivered` yoki «shu to'plamda oldinroq»), yetkazilgan vaqti (20 §2, CSV `orniga_*` ustunlari). «Yetkazilgan» coin berilganini bildirmaydi — buni siz reyestr bilan tekshirasiz.
2. **Nishon o'zgarishlari** — har qator uchun sabab (20 §3, CSV `ozgarish_sababi`). Topilma: 1-nashrdagi 20 ta `html-practice-portfolio-v2` o'zgarishi **bizning xato** edi: dars 16.10 da 6 testdan 1 testga qisqargan, eski kalitlar bazada qolgan, qayta yig'ishda `total_questions` 6→7 bo'lib `all_correct`/`first_try`/`speedster` tushgan. Endi qayta yig'ishda total — hodisa yopilgan paytdagi qiymat.
3. **Tarixiy versiya dalili** — `lesson_version_tarixiy` (sessiya kunida LMS'da turgan versiya, yuklash jurnali bo'yicha) va `dalil` ustuni: tafsilot matni o'quvchi javob bergan paytda yozilgan, kalit shu matnga tekshiriladi; mos kelmasa yozuv chiqariladi. `lesson_version_hozir` yordamchi bo'lib qoldi.
4. **`event_id`** o'sha qoladi, `_r1` avtomatik emas: bizda saqlangan chiqsa avval birga aniqlaymiz.
5. **Qisman tafsilot** — endi bunday qator yo'q (amaliyot testdan tashqari); bo'lib qolsa QA'gacha yuborilmaydi.

`sizda_tekshirish` ustuni bo'sh — tekshiruv tugamagan, biz ham shunday hisoblaymiz. Tartib o'zgarmaydi: siz belgilagan qatorlar → bitta xabar → sizda saqlash va mukofot tekshiruvi → qolganlari.

## 5. Kontrakt tuzatishlari (5, 6, 7-bo'limlar) — 16-hujjat v1.2 da

| Sizning talab | 16 da nima o'zgardi |
|---|---|
| Server — manba, brauzer — ko'rsatish; tartib takror ta'sir bermasin; brauzer v2 yuki eski yo'lni ishga tushirmasin | §3.2 qayta yozildi: 4 qoida, «qaysi kanal birinchi kelsa» jumlasi bekor |
| `event_id` urinishni ajratsin | §3.1: `lr_` / `ap_` / `ar_` + `attempt_id`, deterministik; `version_changed` da ikki urinish — ikki id |
| Versiyasiz eski urinishlar | §4.2 yangi qator: T dan oldingi 7 kunda yuklash bo'lmasa — ochiq urinishlar joriy fayl bilan ochilgan, versiya fakt (`version_source: backfill`); aks holda `null` + `unknown`; kalitlar T da versiyali jadvalga muhrlanadi |
| 4.3 ikki qoida | §4.3: Qoida 1 (versiya urinishniki bilan teng — rad etilmaydi) va Qoida 2 (teng emas — `409`) alohida |
| v1 yopilishi | §4.4: T+8 tekshirish nuqtasi; 5 shart (faol eski urinish, qayta urinish, `pending`/`retry_wait`, `manual_review`, tarixiy tiklash); ikki tomon tasdig'i |
| Vaqt | §2.2: `occurred_at` mantiqiy (uyda `opened_at` + 7 kun), `processed_at` haqiqiy; `elapsed_sec` uyda ≤ 604800 aynan, jonli ≤ 9000 (2 soat + 30 daqiqa); «4 soat» olib tashlandi |
| Namunalar to'liq | A1 (2 savol = `available` 2), A2 (to'liq yozuv), C1 to'liq JSON (3 javob = 3 yozuv), A3 `processed_at` bilan |
| `not_started` | Qoladi (C4) |
| Asinxron qo'llash | §2.4: GET kuzatuvi 1/5/15/60 daqiqa, keyin har soat, 24 soatgacha; 60 daqiqadan uzoq `queued` → ogohlantirish; GET javobida `applied` + nima qo'llangani + `coins_reason`, `failed` + `error` |
| QA ssenariylari | §6: 18 (amaliyot + testlar), 19 (7 kun + kechikish), 20 (tashqi id almashishi), 21 (versiyasiz urinish), 22 (bir sessiyada urinish almashishi), 23 (uzoq `queued`) |

## 6. Sizdan (bugun yoki ertaga ertalab)

1. Production School API validatori = `6b3c85d` tengligi — tasdiq.
2. `pm-m2d13-v1` ning sentyabrdagi Class/Learn'i — CRM tarixidan.
3. `20a` dagi `yuboriladi` qatorlardan birinchi haqiqiy xabar uchun 1–2 tasini belgilash (uyda, bitta o'quvchi bo'lsa ham yaxshi) — biz bitta xabarni yuboramiz, siz saqlash va mukofotni tekshirasiz.
4. 16 v1.2 bo'yicha «ha» yoki tuzatish (§7 ro'yxati).

Keyin: ikki tomon ish hajmi va muddat → kod (urinishga versiya, versiyali kalitlar, uch hodisa, `lr_` + `attempt_id`, brauzer yuki v4) → 23 ssenariy testi → QA `netlify-deploy-v19` → 172 dars dars vaqtidan tashqarida.
