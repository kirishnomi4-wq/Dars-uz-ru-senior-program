# F-1117-01 — AI Startup: «2 darsdan keyin churn baland» — tahlil

**Manba:** foydalanuvchi, 17.11.2026: «AISTARTUP analitikasida 2 darsdan keyin churn juda baland — sifatsiz darslarni aniqlab yaxshilashimiz kerak».
Keyin: «o'zimiz shu JSX'dan chiqaryapmiz, Shahzoda MCP'dan oladi — o'zimiz analiz qilaylik, nima kerak bo'lsa qilaver».

## 2026-11-17 14:29 — server oynasi + birinchi tahlil

**Server:** `GET /admin/api/analytics/:view` (12 view oq ro'yxati, from/to, limit ≤ 10000 + truncated, offset, read only, 30 s).
Commit `735bf0a7` (2 fayl, pathspec) · unit 88/88 · int 128/128 · staging `c727241` ✓ (foydalanuvchi `!`) · main `f143490` → prod ▶ (foydalanuvchi) → prod `0.1.0+f143490a`.
Skriptlar: `dev/yukla.mjs` (view'larni yuklaydi, faqat GET), `dev/tahlil.mjs` (hisobot), `dev/tekshir2-4.mjs` (qo'shimcha tekshiruvlar).
Xom ma'lumot (o'quvchi id'lari bilan) repo'ga kirmaydi — scratchpad'da. Repo'da faqat yig'ma: `natija-20261117.json`.

**Ma'lumot:** 08.09 → 17.11 · 6952 sessiya · 14556 urinish · 31555 ekran ochilishi (12.11 dan) · 884 jonli o'quvchi · 76 guruh.

**1. «2 darsdan keyin ketish» bizning ma'lumotda kichik:**
- Kurs boshidan (2-M 01) boshlagan 7 guruh: o'rtacha kelganlar 1-darsda 10.1 → 3-darsda 11.9 → 10-darsda 13.0; 1-darsdagilardan 70/71 tasi 3+ darsda ham bor. 3-M 01, 4-M 01, 5-M 01 dan boshlagan guruhlarda ham shunday (89/92, 39/39, 81/81).
- 1-darsi 21+ kun oldin bo'lgan, guruhi davom etayotgan o'quvchilar: guruh bilan birga boshlaganlar 547 → 1–2 darsdan keyin 14+ kun kelmagan 17 (3.1%); guruhga keyinroq qo'shilganlar 81 → 10 (12.3%).
- 14+ kun kelmaganlar 110/884; ulardan 1–2 darsda to'xtaganlar 55: 23 — guruhining o'zi ham bizda to'xtagan (5 guruh: guruh yopilgan / birlashgan / LMS'dan foydalanmay qo'ygan — CRM'da tekshirish kerak), 17 — guruh bilan boshlagan, 15 — o'rtadan qo'shilgan. Ularning 1-darsi bitta darsga to'planmagan (19 xil dars).
- Cheklov: biz faqat LMS orqali darsga kirgan o'quvchini ko'ramiz; CRM'da yozilgan, lekin birorta LMS darsini ochmagan o'quvchi bizda yo'q. Analitikadagi churn qaysi o'lchovdan ekanini foydalanuvchidan so'rash kerak.

**2. Sifat signallari (darsning o'zi):**
- 2-M 02 «Kim mening foydalanuvchim?» (kursning 2-darsi): s5b «"Hamma uchun" sayt nega kam ishlaydi?» — xato 64.8% (147/227, eski versiya), joriy v7 da ham 57.6% (19/33); eng ko'p tanlangan xato — «Ko'p odam bir vaqtda kirganidan sayt sekinlashib qoladi» (kalit to'g'ri: correctIdx 1 = INLINE_KEYS). Taxmin: «kam ishlaydi» texnik ma'noda (sekin ishlaydi) o'qiladi. Dars testlari 68.8% to'g'ri — 2-Modulning birinchi 8 darsida eng pastlardan.
- 4-M 02 «User Story»: s7 42% / s8 28% xato (v8, 81 o'quvchi), eski versiyada 59%.
- 2-M 12 Git: testlar 40.2% to'g'ri, jonli dars mediana 116 daq; v7 da s6/s14/s11 71–86% xato (n≈7 — kichik).
- 2-M 09 VS Code: testlar 42% to'g'ri (7.5 javob/o'quvchi).
- Uzun darslar: 2-M 04 HTML-2 119 daq · 2-M 12 Git 116 · 2-M 03 HTML 99 (boshqalari 51–77).
- Uyda: oxiriga yetmagan urinishlarning ko'pi 0-ekranda yopilgan (2-M 01: 27 dan 20).
- Backend CRUD (5-M 08) s4/s5b/s8 100% xato — eski ma'lumot, 15.10 dan beri bu savollar ball bermaydi (F-1015-348) — chora kerak emas.

**Hukm:** «2 darsdan keyin ko'p o'quvchi ketadi» bizning ma'lumotda tasdiqlanmadi (guruh bilan boshlaganlar 3.1%, keyin qo'shilganlar 12.3%).
Sifat-nomzodlar ro'yxati yuqorida. Keyingi qadam — foydalanuvchi tanlovi (tuzatishlar tasdiqsiz qilinmaydi).

## 2026-11-17 15:07 — savolma-savol tashxis + qaror sahifasi

**Tuzatish (o'z xatoim):** 14:29 dagi «Git 40%, VS Code 42% test to'g'ri» — noto'g'ri: `tests_answered` ga amaliyot ekranlari ham kiradi (F-1112-06 sinfi). Savolma-savol (`v_question_attempts`, birinchi urinish) Git/VS Code 61–73%. Eski versiyalarda variant tartibi o'zgargan — variant taqsimoti faqat joriy versiyada ishonchli (`dev/variantlar.mjs`).
**Joriy versiyalar:** 83 savol (n ≥ 20), o'rtacha 77% to'g'ri. Tanlangan 5 joy (tashxis kodda tekshirildi, kalitlar to'g'ri):
1. 2-M 01 s4 (68%, n 31) — savol s3 gapini takrorlaydi (§106), «ochib… chiqaradigan» serverga ham mos (s2 «Server sahifani qaytardi»). Taklif: «Saytni telefoningiz ekranida ko'rsatadigan dastur qanday nomlanadi?»
2. 2-M 02 s5b (42%, n 33; eski 35%, n 229) — «kam ishlaydi» ikki ma'noli (§133), C «sekinlashadi» 42% = to'g'ri javob 42%. Taklif: savol «…nega kam odamga yoqadi?» + C «Bunday saytni qurishga juda ko'p vaqt ketadi».
3. 2-M 08 s5 ekrani (s5b 52%, n 21; eski 48%, n 189) — FBOX `align: stretch`: row → tik ustunlar, column → yotiq qatorlar (rasm so'zga teskari) + kodda `.row` klassi column'da ham. Taklif: `align="flex-start"` + `.boxes`.
4. 3-M 07 s15 (44%, n 32; eski 54%, n 302) — A «Uchtadan ko'p imkoniyat chalg'itadi» darsning Instagram keysida rost (§102). Taklif: A → «Mehmon uchtadan ko'p tugmani eslab qololmaydi».
5. 4-M 02 s7 (59%, n 83; eski 40%, n 244) — «Men foydalanuvchi sifatida…» darsning o'z qoidasiga zid (321-qator, 1327-mashq: «foydalanuvchi» umumiy); NIMA ham bahsli. Taklif: «Men yangi mehmon sifatida, qizil tugmani bosishni xohlayman.»
**Qaror sahifasi:** https://claude.ai/artifact/1yEH6tMDudYVPZvPuY2G3f (oldin/keyin rasmlari — vaqtinchalik nusxadan, nusxalar o'chirildi). Javob kutilmoqda; `.jsx` ga hali tegilmagan.

## 2026-11-17 15:14 — Shahzodaning 2 darsi (foydalanuvchi rasmi: «shu ikki darsdan ketishgan»)

Rasm: «Система и алгоритм (#2431) 81% · 82%» va «Practice: AI-agent 1 (#2439) 69% · 73%» (ustun nomlari rasmda yo'q).
Class → dars (v_lessons): #2431 = 3-M 01 js-intro-01 (`src/2-Modull/JsIntroLesson.jsx`), #2439 = 3-M 09 practice-02-ai-promo (`src/2-Modull/PracticeLesson2.jsx`).
**1-ustun = jonli darsda oxirgi ekranga yetganlar ulushi:** bizda 80% (278) va 69% (255) — mos. Ya'ni bu kursdan ketish emas, darsni oxirigacha o'tmaslik.
- Darsdan darsga o'tish (`dev/otish.mjs`): 3-M 01 ga oldingi darsdagilarning 89% i keladi, 3-M 09 ga — 91%; 3-Modul oralig'i 86–92% — ikkalasi ajralmaydi.
- Qayerda to'xtashadi (`dev/toxtash.mjs`): js-intro-01 — yetmaganlarning deyarli hammasi 17–18-ekranda (yakuniy test / arena `s15b`), keyingi 2 ekran (kartochka, yakun) ochilmaydi; 3 sessiyada butun sinf arenada to'xtagan. practice-02 — 23 dan 5 sessiyada butun sinf yetmagan (a4 amaliyot yoki arena), yakka to'xtaganlar 11% (asosan arena).
- Butun kurs: jonli urinishlar 8548, oxiriga yetgan 73%; yetmaganlarning 33% i arenaga yoki undan keyinga yetgan (3-M da 44%). 171/172 darsda arena oxiridan 1–2 ekran oldin turadi.
Ochiq: 2-ustun (82% / 73%) nima? Shahzoda «ketishgan» deganda kursni yoki darsni nazarda tutyaptimi? Yo'nalish (arena oxiriga / tugatish ta'rifi / tegmaslik) — foydalanuvchi qarori.

## 2026-11-17 15:20 — qaror: arena joyi o'zgarmaydi
Foydalanuvchi: «o'zgartirmaymiz, Shahzodaga aytaylik — e'tiborli bo'lsin». Darslarga tegilmadi. Shahzodaga matn (chatda) tayyorlandi — foydalanuvchi o'zi yuboradi: 81%/69% = oxirgi ekranga yetganlar, kursdan ketish emas; o'tish 89%/91%; arena oxiridan 1–2 ekran oldin; Practice 2 da 5/23 guruhga vaqt yetmagan; ketish 3% / 12%.
Ochiq: sahifadagi 5 ta tuzatish (https://claude.ai/artifact/1yEH6tMDudYVPZvPuY2G3f) — javob kutilmoqda; Practice 2 vaqt masalasi — keyin.

## 2026-11-17 15:43 — qaror sahifasi javobi: hammasi «Tegmaymiz»
Foydalanuvchi: 1) 2-M 01 s4 — B · 2) 2-M 02 s5b — C · 3) 2-M 08 s5 ekrani — B · 4) 3-M 07 s15 — B · 5) 4-M 02 s7 — C (hammasi «Tegmaymiz»).
Darslarga tegilmadi; korpus/qonunga muhr yo'q (tuzatish bo'lmadi). F-1117-01 yopildi: server oynasi prod'da qoladi (keyingi tahlillar uchun).
Commit qilinmagan: shu papka (JURNAL, natija-20261117.json, dev/*.mjs).

## 2026-11-17 16:01 — Shahzodaning paneli (rasmlar): «Уходы по урокам» + «Трудные уроки»
**Уходы (CRM, 180 kun):** #2431 3-M 01 — ушли 12/301 (kutilgan 3,9, ×3,08; keyingi darsni o'tkazgan 7,6%; 10/24 guruh) · #2439 3-M 09 — 11/282 (kutilgan 4, ×2,75; 8,9%; 8/23). Bizda (08.09 dan, qat'iyroq qoida): 6/260 va 4/254 — yo'nalish mos, son kichik.
Faraz: 3-M 01 — modul almashinuvi (HTML/CSS + Demo Day → JS). 3-M 09 — ikki praktika ketma-ket: 3-M 08 da 23 sinfdan 9 tasi oxiriga yetmagan (39%), 3-M 09 da 5/23 — vaqt sig'maydi.
**Трудные уроки (90 kun, «сдали X из Y»):** 6 darsdan 5 tasi PRACTICE_CHECKED ro'yxatida (`src/live/practiceMeta.js`, 45/172 dars) — F-1112-06: kalitli amaliyot ekrani v2 `tests` ga sanaladi, deyarli doim «noto'g'ri» → ball pasayadi, tafsilot `omitted:invalid_text`.
- data-intro-04-01 (0/128): total 6 = 4 MC + s15 + s15b; 45 lr_ da 6/6 yo'q (4/6 — 14, 5/6 — 3); tafsilot omitted 34/45. MC savollar 72–88% to'g'ri.
- react-intro-01: total 5 (4 MC + s15), omitted 39/39; MC 81–97%. pean-stack-01: omitted 18/18; MC 89–96%. practice-01: omitted 27/28.
- 6-dars pm-m2d7 (52%) — amaliyotsiz; «Burbn» savoli arena/Learn savoli (QUIZ_BANK), kalit to'g'ri.
CRM «сдал» qoidasi bizga noma'lum (Abdulloh/Shahzoda). Taklif: F-1112-06 server tuzatishi (kind=practice → tests'dan chiqarish) — foydalanuvchi qarori.

## 2026-11-17 17:59 — F-1112-06 server tuzatishi prod'da («Трудные уроки» sababi)
- Commit `a26083c5` (16:22): `v2-service.loadAttemptSource` urinish versiyasining `question_keys` dagi `kind=practice` ekranlarini (kaliti 0 bo'lsa ham) amaliyot (-1) deb belgilaydi → `tests.total_questions` va tafsilotga kirmaydi, `practice[]` da qoladi. v1 o'zgarmagan. Unit 90/90, int 129/129 (tuzatishsiz int testi prod xatosini qayta tug'diradi).
- Staging `43c3260b` (16:53) — staging-check 17:17 da qayta: 18 ✓ / 0 ✗. Main `ac5742f7` → prod ▶ (foydalanuvchi, ~17:33) → prod `0.1.0+ac5742f7` 17:34:58. Prod `--read-only` 16 ✓ / 0 ✗; v2-kuzatuv «Muammo yo'q» (pending 0, failed 0); 4 jonli sessiya (42 onlayn) deploy paytida uzilmadi.
- Deploy'gacha baza (16.11 10:39Z → 17.11 12:32Z, `../F-1105-03-analitika/dev/prod-tafsilot.mjs`): 444 lr_ dan 81 tasi `omitted:invalid_text` — hammasi PRACTICE_CHECKED dars + amaliyot bajarilgan (react-intro 21, practice-01 15, practice-04 13, js-intro 11, nest-arch-alive 10, api-postman 6, full-pro-pipeline 3, data-intro 1, html-takrorlash 1); qoidaga zid 0.
- Deploy'dan keyingi tasdiq HALI YO'Q: 17:37 dagi 4 jonli dars (nest-arch-practice, pm-m3d5, vscode-start, html-01) PRACTICE_CHECKED'da emas. Tekshiruv: 17:35 dan keyingi kalitli-amaliyotli dars/uyda urinishda `full` chiqishi kerak (o'sha skript).
- Abdullohga xabar (chatda tayyorlandi, foydalanuvchi yuboradi): 45 darsda `tests.total_questions` −1 (data-intro −2), `details` full, kontrakt 25 §5, eski hodisalar va v1 o'zgarmaydi.
