# ⚠ SOLO BALL TESHIGI — dalil va tuzatish-loyihasi (T9b, 2026-09-18 tun)

Holat: **kod bo'yicha zanjirning hamma bo'g'ini tasdiqlandi; uchidan-uchiga (haqiqiy LMS/solo) sinov QILINMAGAN.**
Kod o'zgarishi — foydalanuvchi qarori bilan (rasmiy natijaga tegadi).

## Nima

Uyda (solo, LMS-token bilan) darsni o'tgan o'quvchining **rasmiy natijasida** maxsus yakuniy test-ekran (tartiblash, yozma kod,
juftlash, karta-tanlov — **63 ekran, 62 dars**, asosan `s15`; 19.09 01:30 aniqlashtirildi: 45 + `inventar-hisoblangan` dagi 18) hech qachon javob berilgan deb sanalmaydi → 5 savollik darsda eng yaxshi natija 4/5;
`all_correct` / `first_try` nishonlari solo'da imkonsiz.

## Zanjir (har bo'g'in — fayl:qator)

1. **Server — ball manbai:** `server/src/modules/results/result-service.js` `enqueueSoloAttempt`: javoblar faqat
   `live_answers` dan (`select … from live_answers where pin = $1 and player_id = $2`). `result-builder.js` `buildSoloPayload`:
   `total = max(1, lessonQuestions(keys).size, answered)` — **kalitlardan** (s15 kaliti ham kiradi); `correct` — faqat `answers` dan.
2. **`live_answers` ga faqat ikki yo'l yozadi:** `submit_answer` (`0001_live_core.sql` 254) va `record_attempt` (`0005_answer_attempts.sql`
   96, birinchi urinish). Progress-sinxron (`PUT /me/progress`) `student_progress` ga yozadi — ballga kirmaydi.
3. **Klient — `useLiveSession.js`:** `submitAnswer` va `recordAttempt` **solo'da ham ishlaydi** (187, 202-qatorlar:
   `mode !== 'student' && mode !== 'solo'` → return). Oddiy test (`QuestionScreen`) solo'da `recordAttempt` orqali yetadi — shuning
   uchun MCQ to'g'ri sanaladi (199-qator izohi aynan shuni aytadi).
4. **Klient — dars ildizi:** maxsus yakuniy ekran javobini yuboradigan YAGONA joy — `recordAnswer` dagi qator:
   `if (_m && _m.scored && _m.scope === 'final' && data && data.correct && live.mode === 'student') live.submitAnswer(…)`
   (masalan `HtmlTakrorlashLesson.jsx:2754`, `ReactIntroLesson.jsx:2545`; 6-modul shakli — `data.solved` bilan,
   `AgentArchitectureLesson.jsx:2141`). **`live.mode === 'student'`** — solo'da chaqirilmaydi. Maxsus ekranlarning o'zi
   `recordAttempt` chaqirmaydi (T2 inventari, 45 ekran).
5. **Natija:** solo'da s15 `live_answers` ga tushmaydi → `answered` va `correct` da yo'q, `total` da bor.

Staging'da tasdiqlovchi tugallangan solo hodisa yo'q (yagona `agent-arch-06-04-v18` solo urinishi — `completed: false`, javob 0).

## Tuzatish-loyihasi (taklif — kodga tegilmagan)

- **Klient, dars ildizi (37 darsda aynan shu qator, qolganlarida variant):** `live.mode === 'student'` →
  `(live.mode === 'student' || live.mode === 'solo')`. `submit_answer` UNIQUE — birinchi yozilgani qoladi.
- **Shart bilan birga (T9 bilan):** hozir qator faqat `data.correct` bo'lganda va doim `picked 0 / true` yuboradi → solo'da ham
  «doim to'g'ri» bo'lib qoladi. T9 dagi o'zgarish (`correct` = birinchi to'liq urinish, `picked: first ? 0 : 1`, kalit `-1 → 0`)
  bilan birga qilinsa — solo va jonli bir xil, halol o'lchaydi.
- **Yozma testlar (23):** diskret urinish yo'q — «bajarildi» = `picked 0` (kalit 0 yoki -1) — solo'da ham sanaladi (hozir sanalmaydi).
- **Sinov (majburiy):** lokal server + soxta School API (`server/tools/fake-school-api.mjs`) + int-test: solo urinish, s15 ga
  javob → payload `answered/correct` da s15 bor. Keyin staging'da bitta haqiqiy solo o'tish.
- **Yon ta'sir:** o'tgan solo natijalar (agar prod'da bo'lsa) qayta hisoblanmaydi — faqat yangi urinishlar. Bugungacha haqiqiy
  darslar bo'lmagan (dushanba birinchi) — tarixiy zarar yo'q.

## Qaror uchun savol (ertalab)

A — T9 bilan birga tuzatamiz (tavsiya: dushanbadan oldin, uyda o'tgan o'quvchi 4/5 dan oshmasligi — adolatsiz) ·
B — hozircha tegmaymiz, Axadulla/Kristina bilan kelishib keyin.
