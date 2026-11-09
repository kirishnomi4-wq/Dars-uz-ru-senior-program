# Abdullohga: 22-javobingizga qisqa javob — 16 v1.3, kod boshlanadi

**Sana:** 09.11.2026 (kech)
**Asos:** sizning `22-ABDULLOH-V1.2-VA-MUKOFOT-JAVOB-UZ.md` (bizda `23-…`)
**Ilova:** `16-ABDULLOH-JSON-V1.1-VA-OTISH-TARTIBI-UZ.md` — v1.3 nashri

Rahmat, asosiy tuzatishlar qabul qilingani va «server qismini boshlash mumkin» degan xulosangiz uchun. Qisqa:

## 1. 5-bo'limdagi 6 tuzatish — 16 v1.3 ga kiritildi

| № | Sizning talab | 16 da qayerda |
|---|---|---|
| 1 | Mukofot kaliti: o'quvchi + Class, Learn/CodeStrike uchun o'quvchi + Learn | §0 3.1, §2.1 «Mukofot kaliti», §3.2, §4.3 |
| 2 | Jonli sessiya 2 soat, qo'shimcha 30 daqiqa yo'q; sweep kechikishi ishlash huquqini uzaytirmaydi | §2.2 `elapsed_sec`: jonli ≤ 7200, `occurred_at` = yopilish yoki boshlanish + 2 soat, keyingi javob `session_limit`; 30 daqiqa faqat `processed_at` kechikishi |
| 3 | Backfill — 7 kun o'zi dalil emas; kontent bog'lanishi bo'lsa `backfill`, aks holda `unknown`; hozirgi kalitlar eski urinishniki deb taxmin qilinmaydi | §4.2 qator qayta yozildi: faqat javob matnlari joriy versiya bilan aynan mos kelsa `backfill`; eski urinish matni mos kalitlar bilan baholanadi |
| 4 | C4 `ar_<session>_<student>` → `ar_<attempt_id>` | §2.3 C4 |
| 5 | «10 daqiqadan keyin bir marta» olib tashlansin; 24 soatdan keyin hodisa yo'qolmasin | §2.4: jumla o'chirildi; 24 soatdan keyin «qo'llash kutilmoqda» belgisi bilan mas'ul tekshiruv ro'yxati |
| 6 | `processed_at` — birinchi yig'ilgan vaqt, qayta yuborishda o'zgarmaydi | §2.2 `processed_at` qatori |

## 2. Qabul qilganlarimiz

- Learn coin'lari dars oxiriga ko'chmaydi; Learn va CodeStrike o'rtasidagi cheklov sizning tomoningizda `student_question_rewards` + tranzaksiya bilan. Bizdan faqat hodisalar to'g'ri va bir marta kelishi.
- `pm-m2d13-v1` → Class 2444 tasdiqlandi (31136, 30.09, 3 coin). Learn 3184 tarixiy bog'lanishini siz tekshirasiz; 16a o'zgarmaydi.
- Birinchi haqiqiy xabar: hozircha ruxsat yo'q; nomzod `solo_35887_pm-m2d2-v1_20260923T114932Z` (takroriy coin bermaslik sinovi). Biz kutamiz: siz payload, mavjud hodisa va kutilgan natijani tasdiqlaganingizdan keyin bitta `rebuild` (`event_id` o'sha). 201 dan keyin GET bilan `coins: 0`, `coins_reason: already_rewarded` kutamiz.
- Oldin berilgan coin'lar avtomatik yechilmaydi; eski va yangi qiymatlar saqlanadi.

## 3. Biz boshlayotgan ish (server, Dars API)

1. Migratsiya: `attempts.lesson_version` + `version_source`; versiyali kalitlar jadvali.
2. Uch hodisa v2 (`lesson_result`, `arena_participation`, `arena_result`) — 16 v1.3 namunalari bo'yicha, `event_id` = `lr_` / `ap_` / `ar_` + `attempt_id`, `occurred_at` / `processed_at` / `elapsed_sec`, `details`, `practice` bloki.
3. Kuzatish (`processing`) — GET 1/5/15/60 daqiqa, soatlik, 24 soat, keyin mas'ul ro'yxat.
4. Brauzer yuki v4 (`dars_api` bloki, `schema_version: 2`, `codestrike` yo'q), `participant` nishoni olib tashlanadi.
5. 23 ssenariy — soxta qabul qiluvchi bilan avtomatik test.

Sizning tomoningizda v2 qabul qiluvchi (validator, qo'llash, kanonik mukofot himoyasi) tayyor bo'lgach, `netlify-deploy-v19` da birga QA; 172 dars relizi faqat shundan keyin, dars vaqtidan tashqarida.

**Sizdan:** 16 v1.3 dagi 6 joyni ko'rib chiqish · production validatori · birinchi xabar tasdig'i (qachon qulay bo'lsa). Shoshiltirmaymiz.
