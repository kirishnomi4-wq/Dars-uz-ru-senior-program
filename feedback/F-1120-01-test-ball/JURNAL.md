# F-1120-01 — jonli darsda yakuniy test: to'g'ri javob «xato» va «0.0s» bo'lib yoziladi

**Manba (20.11.2026):** foydalanuvchi — AI Startup «Praktika 2 — AI bilan tez sayt» (m2-09) jonli darsida hamma
to'g'ri ishlagan, lekin mentor panelida 8 ta A (xato), 2 ta B; o'quvchi natijasida soniya 0.0s.
Rasmlar: `01-jonli-natija-8A.png`, `02-soniya-0.0s.png`. New Junior'ga aloqasi yo'q (foydalanuvchi talabi).

## Tashxis
Yakuniy (`scope: 'final'`) TEST ekranida jonli o'quvchi javobi serverga IKKI marta ketadi:
1. `recordAnswer` (onAnswer orqali, BIRINCHI chaqiriladi) → `submitAnswer(idx, id, 0, true, 0)` — doim variant 0 (A), vaqt 0.
   Bu qator variantsiz yakuniy ekranlar («Bajardim», kalit -1/0) uchun yozilgan, MCQ'ni hisobga olmagan.
2. `QuestionScreen.pick` → haqiqiy variant + vaqt.
Server `submit_answer` — `on conflict (player_id, screen_idx) do nothing` (birinchisi qotadi), to'g'rilikni kalitdan o'zi hisoblaydi.
Natija: to'g'ri javob bergan o'quvchi → «A, xato, 0 ms». Xato bergan → 1-yo'l ishlamaydi, javobi to'g'ri yoziladi.
Tarmoq tartibi tasodifan almashsa — haqiqiy yozuv o'tadi (rasmdagi 2 ta B).

Ikki ko'rinish (sinf-supurish, 20.11):
- **A-ko'rinish** `…(idx, _m.id, 0, true, 0)` — kalit > 0 bo'lsa BALL xato + vaqt 0: **GitLesson (s14=3), PracticeLesson2 (s7=1)**;
  bridge: BridgeTexAiSayt (s7=1), BridgeTexGit (s14=3) — alohida sayt, qaror kutiladi.
- **B-ko'rinish** `…(idx, _m.id, data.picked ?? 1, !!data.correct, data.elapsedMs || 0)` — variant to'g'ri, lekin `data.elapsedMs`
  hech qachon yo'q → yakuniy test VAQTI 0 (~120 dars, 4a–12-Modul + skelet NamunaDars).

## Prod dalili (faqat o'qish, admin API GET, 20.10–20.11)
`v_question_attempts` (haqiqiy 1-urinish) vs `v_lesson_results.tests_correct`:
| Dars | jonli: to'g'ri, bazada xato | yakka (solo) |
|---|---|---|
| practice-02-ai-promo-v18 | **104 / 187** | 0 / 41 |
| git-github-v19 | **47 / 77** | 0 / 41 |
Boshqa darslarda ball farqi yo'q (internet-01, pm-m2d7, pm-m4d2 da solo 1 tadan — boshqa sinf, ko'rilmadi).

## 1-qadam — tuzatildi (20.11 17:00, foydalanuvchi «tavsiyang maqul boshla»)
Fayllar: `src/2-Modull/PracticeLesson2.jsx`, `src/1-Modull/GitLesson.jsx` (har birida 2 joy):
- `QuestionScreen` jonli `onAnswer` ma'lumotiga `elapsedMs` qo'shildi.
- `recordAnswer` yakuniy qatori: `Number.isInteger(data.picked) ? data.picked : 0` + `data.elapsedMs || 0`
  + `!firstPassRef.current` (151-qonun 6-band: «Qaytadan» mashqi yozilmaydi). Endi ikkala yozuv bir xil — qaysi birinchi yetsa ham to'g'ri.

Tekshiruv:
- `npm run gates` — PracticeLesson2 11/13, GitLesson 12/13; yiqilganlar (tell, emoji: 313/1808-qator) HEAD nusxada ham aynan
  shunday — eski, bu tahrirga aloqasiz.
- Jonli brauzer sinovi `e2e-f1120.mjs` (lokal server 3011 nusxa 0019'siz, vite 5311; mentor + 3 o'quvchi to'g'ri variantni bosadi):
  - PracticeLesson2 ESKI kod: Ali 1/t/2507 · Gani **0/f/0** · Vali **0/f/0** → xato qayta hosil qilindi.
  - PracticeLesson2 YANGI: 3/3 `picked=1, correct=t`, vaqt 2530/3905/5896 ms → TOZA.
  - GitLesson YANGI: 3/3 `picked=3, correct=t`, vaqt 2439/3772/5805 ms → TOZA.
- LMS'ga yuklanmagan, commit yo'q.

## 2-qadam — hamma darslar (20.11 ~17:40, foydalanuvchi «birmartaga barcha xatoli darslarni tuzatib birmartaga yuklavoramz»)
Tasnif (`classify`): yakuniy ball-ekrani bor 95 fayl (bridge'siz) — A-MCQ 1 · A-maxsus (kalit -1, «Bajardim»/yozma) 20 ·
B-MCQ 44 · B-maxsus 33 (+ skelet NamunaDars). Yakuniy ekrani yo'q 32 dars — qator ishlamaydi, tegilmadi.
Maxsus ekranlar o'zi submit qilmaydi — yagona yozuv recordAnswer qatori, vaqti doim 0 edi.
`codemod-f1120.mjs` (quruq yurish → 95/95, 0 rad → `--yoz`), har faylda:
- ildiz: `scrTsRef` (joriy ekranga kirgan vaqt) + `useEffect(..., [screen])` — reportScreen effektidan oldin;
- yakuniy qator: vaqt `Number.isFinite(data.elapsedMs) ? data.elapsedMs : Date.now() - scrTsRef.current`; A — haqiqiy picked; ikkalasiga `!firstPassRef.current`;
- QuestionScreen jonli onAnswer'ga `elapsedMs` (MCQ'da ikkala yozuv aynan bir xil).
Tekshiruv:
- gates 97 fayl (95 + 1-qadamdagi 2): YANGI yiqilish 0; 28 faylda emoji/tell qizil — HEAD worktree'dagi aynan o'sha fayllarda ham bor (eski).
- jonli brauzer (mentor + 3 o'quvchi, picked/correct/elapsed bazadan): PmLesson6 (A-MCQ) · JsVarsLesson (A-maxsus, yozma) ·
  PmChannelsLesson, PmPricingLesson (B-MCQ) — hammasi 3/3 TOZA, vaqt 2,4–5,9 s. PmChannelsLesson ESKI kod: 3/3 vaqt **0** (xato qayta hosil qilindi).
- `lms-farq`: o'zgargan 96 — tuzatilgan darslar ro'yxati bilan AYNAN mos (boshqa o'zgarish yo'q). Paket commit'dan keyin.
  Ogohlantirish (bizniki emas): `server/data/lesson-catalog.json` da 10 ta bridge-tex id (boshqa seans, commitsiz) — bu yuklashga kirmaydi.

## 3-qadam — commit + paket (20.11, foydalanuvchi «xa qil … ikala bagni general togrilaver»)
- Commit `b4320a99` — faqat 97 dars + shu papka (pathspec bilan; boshqa seansning 41 staged fayli tegilmadi).
- `lms-farq paket --majbur` → `yuklash-2026-11-20-prod/` (96 dars, versiya +1). `--majbur` sababi: 14 commitsiz fayl boshqa
  seanslarniki (bridge, tekshiruv sayti) — farq bizning 96 dars bilan aynan mos, ular paketga kirmaydi.
- 1-urinish `timeout 1500` bilan smoke-lms o'rtasida uzildi (HISOBOT yo'q) → papka o'chirildi, vaqt chegarasiz qayta yig'ildi.
- README «server AVVAL SHART» — sababi boshqa seansning commitsiz 10 bridge-tex katalog id'si; bizning 96 dars uchun server deploy kerak emas
  (yangi/o'zgargan lesson_id yo'q).
- Qayta yig'ish natijasi `HISOBOT.md`: 96 dars · lint:jsx ✓ · smoke-lms ✓ · smoke-preview 96/96 · **Hukm: O'TDI ✓**.
  Keyingi: yuklovchi seans (YUKLASH_PROTOKOLI.md) → `yuklangan.csv` → `lms-farq muhrla … --kim <seans>`.

## 4-qadam — ochiq ishlar tayyorlandi (20.11 kech, foydalanuvchi «hammasini tayorlaylik togri ketma ketligida»)
**Lint (c3, `jsx-lint.mjs`):** yakuniy ball-ekrani qatori doimiy 0/0 yoki vaqtsiz yuborsa — error. Xavfsiz himoyalar
(`_m.template !== 'MCScreen'`, `!data.selfSubmitted`) va yakuniy ekrani yo'q darslar chetlanadi. Qoida sweep'dan chetda qolgan
**2 darsni** topdi → tuzatildi (`5cf99e5f`): FullstackFeedbackLesson m4-14 (`0, true, 0` ichki if'da), PipelineProjectLesson m6-08
(`data.picked ?? 0`). Gates: Pipeline 13/13; FullstackFeedback tell/emoji (611, 665, 1335 — tegilmagan qatorlar, eski).
Jonli brauzer sinovi bu ikkisiga YO'Q — mexanizm JsVars (maxsus ekran) da tasdiqlangan.
Paket butun src bo'yicha lint:jsx talab qiladi → bridge (boshqa seans, commitsiz `??`) 5 fayl bloklardi → jsx-lint'ga `warn`
darajasi, bridge'da c3 vaqtincha 🟡 (`86335ad6`). Eski kod nusxasida qoida 🔴 beradi (tekshirildi).

**Prod ma'lumot-tuzatish (`0020_f1120_javob_tuzatish.sql`, hali `server/migrations/` da EMAS):**
- Qayta o'lchov 01.09 dan (faqat o'qish): bug **192 urinish** (git-github 81 · 28.09–19.11, 9 guruh; practice-02 111 · 19.10–20.11, 17 guruh),
  26 sessiya — HAMMASIDA v1 natija LMS'ga `delivered` (+ 21 urinishda v2 lesson_result). Oldingi «151» — faqat 20.10 dan edi.
- Alohida signallar (bu bug EMAS): react-state-effect-03-v18 bugun 11 urinish — javob YOZILMAGAN (`tests_answered` < urinishlar),
  ehtimol dars davom etayotgan payt; 4 ta solo 1 tadan (html-practice, pm-m2d7, internet-01, pm-m4d2). Ko'rilmadi.
- SQL: 1) ball — faqat 2 dars/savol, soxta shakl (0, xato, 0 ms) + 1-urinish boshqa variant → answer_attempts dan picked/elapsed,
  correct quiz_keys dan; 2) vaqt — barcha darslar test zonasi, vaqt 0 va 1-urinish aynan o'sha variant. Idempotent.
- Lokal sinov (BEGIN…ROLLBACK): ball 2 qator (Gani/Vali s7 → 1, t, 5900/3847), vaqt 11 qator; ikkinchi yurish 0/0.
- Raqam 0020 — Junior seansining commitsiz `0019_junior_sinf.sql` bilan to'qnashmasin (migrate takror raqamda yiqiladi).
**CRM ro'yxati `crm-tuzatish-royxat.csv`:** 192 qator, ismsiz (sana, dars, guruh, student_id, crm_id, session_id, testlar,
lmsdagi_ball, togri_ball). LMS'dagi natijani biz o'zgartira olmaymiz (o'zgargan payload → 409).
**Paket qayta (86335ad6):** `yuklash-2026-11-20-prod/` — **98 dars** (96 + m4-14, m6-08) · smoke-lms ✓ · smoke-preview 98/98 · **O'TDI ✓**.
**Bridge patch `bridge-f1120.patch`:** 5 fayl (AiSayt, Git — MCQ; AvtoIjaraReact, Postgres, SaytQurish — maxsus), codemod
nusxada, `git apply --check` toza, QO'LLANMAGAN.

## Ochiq
2. ~~B-ko'rinish~~ — tuzatildi (yuqorida); LMS yuklash: commit → `lms-farq paket` → yuklovchi → muhrla.
3. Prod ma'lumotni tiklash (151 qator, answer_attempts'dan) — prod'ga yozish, faqat foydalanuvchi buyrug'i bilan;
   LMS'ga ketgan natija o'zgargan payload bilan qayta yuborilsa 409 — CRM jamoasi bilan kelishuv kerak.
4. Bridge 2 dars — qaror.
5. Sinf muhri (qayerga — tekshiruvchi rol-fayli yoki darvoza) — qaror.
