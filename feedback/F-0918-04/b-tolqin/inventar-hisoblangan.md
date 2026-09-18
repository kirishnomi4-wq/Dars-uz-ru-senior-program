# 18 ta «hisoblangan» ball-ekran — inventar (19.09 tun, faqat o'qish)

Manba: `ball-custom-ekranlar.json` (`sinf == "hisoblangan"`). Har ekran komponenti va ildiz `recordAnswer` kodda o'qildi;
ikki naqsh vakili (CiCdIntro s15, PeanStack s15) skretchda `scripts/ach-probe.mjs` (`test: true`, `missed: false`) bilan
brauzerda sinaldi. `src/` ga tegilmagan.

## Xulosa

| Hukm | Soni | Ekranlar |
|---|---|---|
| BALL-TESHIK (F5) + SOLO-TESHIK | 12 | 10 tartiblash (AiPipeline · CiCdIntro · FullProPipeline · BotApiButtons · BotFeedbackIteration · BotIntro · BotStatefulMemory · ArchPatterns · ClaudeSkills · WriteSkill — s15) · NestArchAlive s19 · NestArchResource s17 |
| BALL-TESHIK (F5 + jonli) + SOLO-TESHIK | 1 | PeanStack s15 |
| SOLO-TESHIK (qolgan kanallar halol) | 5 | EdgeCasesTest s16 · JestUnitTest s16 · GithubActions s18 · PmJtbd s9 · PmMetrics s9 |
| HALOL | 0 | — |

- **Birinchi urinish o'lchovi — 18/18 to'g'ri:** hammasi `correct` ni birinchi to'liq urinishdan oladi.
- **F5-teshik — 13 ta:** birinchi urinish faqat xotirada turadi (`hadWrongRef` / `firstCorrectRef`), javob esa faqat yakunda
  yoziladi → xato → F5 → to'g'ri = ball «to'g'ri» (nishonli ekranlarda nishon ham). **Brauzerda tasdiqlandi:** CiCdIntro s15 va
  PeanStack s15 da S1a (F5 siz) ✓, S1b — «F5 DAN KEYIN BALL TO'G'RI». Qolgan 11 tasi — kod bo'yicha (bir xil naqsh). 5 ekranda
  teshik yo'q — ular har urinishda `onAnswer` chaqiradi (`firstAttemptCorrect` / `firstResult` saqlanadi).
- **Jonli kanal:** 17 tasida to'g'ri (kalit 0 yoki 1 + `picked` 0/1 yoki haqiqiy indeks). **PeanStack s15** — kalit `-1` + ildiz V1:
  xato-birinchi jonli o'quvchi serverga umuman yuborilmaydi (ballda 0, lekin «javob bermagan» deb sanaladi).
- **`onFinished` detallari:** 16 tasi to'g'ri ravishda kirmaydi (`correctIndex` yo'q — Y1b filtri); EdgeCases/Jest s16 to'liq
  shartnoma maydonlari bilan kiradi (question · options · correctIndex · correctAnswer).
- **⚠ SOLO — 18/18:** bironta ekran `recordAttempt` chaqirmaydi, `submitAnswer` faqat `live.mode === 'student'` (ekran ichida
  yoki ildizda) → uyda o'tgan o'quvchining rasmiy natijasida sanalmaydi. **`solo-ball.md` hisobi aniqlashtirildi: 45 emas —
  45 + 18 = 63 ekran, 62 dars** (18 tasi 18 ta yangi darsda: AiPipelineProjectLesson, ArchPatternsLesson, BotApiButtonsLesson, BotFeedbackIterationLesson, BotIntroLesson, BotStatefulMemoryLesson, CiCdIntroLesson, ClaudeSkillsLesson, EdgeCasesTestLesson, FullProPipelineLesson, GithubActionsLesson, JestUnitTestLesson, NestArchAliveLesson, NestArchResourceLesson, PeanStackLesson, PmJtbdLesson, PmMetricsLesson, WriteSkillLesson).

## Jadval

| Dars · ekran | Nishon | Mexanika | F5 | Jonli | Hukm | Dalil |
|---|---|---|---|---|---|---|
| AiPipelineProjectLesson · s15 | finalCall | tartiblash (DragDropOrder, `onChange`) | TESHIK: `hadWrongRef` faqat yakundagi `storedAnswer.firstAttemptCorrect` dan tiklanadi — xato → F5 → to'g'ri = `correct: true` (va nishon) | ✓ ildiz V2: `data.solved` + `data.picked` (0/1), kalit 0 | **BALL-TESHIK (F5) + SOLO-TESHIK** | CiCdIntro s15 — brauzerda tasdiqlandi (S1b: F5 dan keyin ball to'g'ri); qolgan 9 tasi — bir xil kod (kod bo'yicha) |
| CiCdIntroLesson · s15 | orderMatters | tartiblash (DragDropOrder, `onChange`) | TESHIK: `hadWrongRef` faqat yakundagi `storedAnswer.firstAttemptCorrect` dan tiklanadi — xato → F5 → to'g'ri = `correct: true` (va nishon) | ✓ ildiz V2: `data.solved` + `data.picked` (0/1), kalit 0 | **BALL-TESHIK (F5) + SOLO-TESHIK** | brauzerda tasdiqlandi: S1a ✓, S1b — «F5 DAN KEYIN BALL TO'G'RI» |
| FullProPipelineLesson · s15 | orderMatters | tartiblash (DragDropOrder, `onChange`) | TESHIK: `hadWrongRef` faqat yakundagi `storedAnswer.firstAttemptCorrect` dan tiklanadi — xato → F5 → to'g'ri = `correct: true` (va nishon) | ✓ ildiz V2: `data.solved` + `data.picked` (0/1), kalit 0 | **BALL-TESHIK (F5) + SOLO-TESHIK** | CiCdIntro s15 — brauzerda tasdiqlandi (S1b: F5 dan keyin ball to'g'ri); qolgan 9 tasi — bir xil kod (kod bo'yicha) |
| BotApiButtonsLesson · s15 | — | tartiblash (DragDropOrder, `onChange`) | TESHIK: `hadWrongRef` faqat yakundagi `storedAnswer.firstAttemptCorrect` dan tiklanadi — xato → F5 → to'g'ri = `correct: true` (va nishon) | ✓ ildiz V2: `data.solved` + `data.picked` (0/1), kalit 0 | **BALL-TESHIK (F5) + SOLO-TESHIK** | CiCdIntro s15 — brauzerda tasdiqlandi (S1b: F5 dan keyin ball to'g'ri); qolgan 9 tasi — bir xil kod (kod bo'yicha) |
| BotFeedbackIterationLesson · s15 | loopCloser | tartiblash (DragDropOrder, `onChange`) | TESHIK: `hadWrongRef` faqat yakundagi `storedAnswer.firstAttemptCorrect` dan tiklanadi — xato → F5 → to'g'ri = `correct: true` (va nishon) | ✓ ildiz V2: `data.solved` + `data.picked` (0/1), kalit 0 | **BALL-TESHIK (F5) + SOLO-TESHIK** | CiCdIntro s15 — brauzerda tasdiqlandi (S1b: F5 dan keyin ball to'g'ri); qolgan 9 tasi — bir xil kod (kod bo'yicha) |
| BotIntroLesson · s15 | — | tartiblash (DragDropOrder, `onChange`) | TESHIK: `hadWrongRef` faqat yakundagi `storedAnswer.firstAttemptCorrect` dan tiklanadi — xato → F5 → to'g'ri = `correct: true` (va nishon) | ✓ ildiz V2: `data.solved` + `data.picked` (0/1), kalit 0 | **BALL-TESHIK (F5) + SOLO-TESHIK** | CiCdIntro s15 — brauzerda tasdiqlandi (S1b: F5 dan keyin ball to'g'ri); qolgan 9 tasi — bir xil kod (kod bo'yicha) |
| BotStatefulMemoryLesson · s15 | memoryKeeper | tartiblash (DragDropOrder, `onChange`) | TESHIK: `hadWrongRef` faqat yakundagi `storedAnswer.firstAttemptCorrect` dan tiklanadi — xato → F5 → to'g'ri = `correct: true` (va nishon) | ✓ ildiz V2: `data.solved` + `data.picked` (0/1), kalit 0 | **BALL-TESHIK (F5) + SOLO-TESHIK** | CiCdIntro s15 — brauzerda tasdiqlandi (S1b: F5 dan keyin ball to'g'ri); qolgan 9 tasi — bir xil kod (kod bo'yicha) |
| ArchPatternsLesson · s15 | trafficRoute | tartiblash (DragDropOrder, `onChange`) | TESHIK: `hadWrongRef` faqat yakundagi `storedAnswer.firstAttemptCorrect` dan tiklanadi — xato → F5 → to'g'ri = `correct: true` (va nishon) | ✓ ildiz V2: `data.solved` + `data.picked` (0/1), kalit 0 | **BALL-TESHIK (F5) + SOLO-TESHIK** | CiCdIntro s15 — brauzerda tasdiqlandi (S1b: F5 dan keyin ball to'g'ri); qolgan 9 tasi — bir xil kod (kod bo'yicha) |
| ClaudeSkillsLesson · s15 | cardMaster | tartiblash (DragDropOrder, `onChange`) | TESHIK: `hadWrongRef` faqat yakundagi `storedAnswer.firstAttemptCorrect` dan tiklanadi — xato → F5 → to'g'ri = `correct: true` (va nishon) | ✓ ildiz V2: `data.solved` + `data.picked` (0/1), kalit 0 | **BALL-TESHIK (F5) + SOLO-TESHIK** | CiCdIntro s15 — brauzerda tasdiqlandi (S1b: F5 dan keyin ball to'g'ri); qolgan 9 tasi — bir xil kod (kod bo'yicha) |
| WriteSkillLesson · s15 | testedSkill | tartiblash (DragDropOrder, `onChange`) | TESHIK: `hadWrongRef` faqat yakundagi `storedAnswer.firstAttemptCorrect` dan tiklanadi — xato → F5 → to'g'ri = `correct: true` (va nishon) | ✓ ildiz V2: `data.solved` + `data.picked` (0/1), kalit 0 | **BALL-TESHIK (F5) + SOLO-TESHIK** | CiCdIntro s15 — brauzerda tasdiqlandi (S1b: F5 dan keyin ball to'g'ri); qolgan 9 tasi — bir xil kod (kod bo'yicha) |
| PeanStackLesson · s15 | fullstack | tartiblash (DragDropOrder, `onWrong` bor) | TESHIK: `firstCorrectRef` xotirada, `onAnswer` faqat yechilganda — xato → F5 → to'g'ri = `correct: true` + nishon | TESHIK: kalit -1 + ildiz V1 (`data.correct && student → submitAnswer(…, 0, true)`) — xato-birinchi jonli o'quvchi serverga UMUMAN yuborilmaydi (javobsiz sanaladi) | **BALL-TESHIK (F5 + jonli: xato-birinchi javobsiz) + SOLO-TESHIK** | brauzerda tasdiqlandi: S1b — «F5 DAN KEYIN BALL TO'G'RI» |
| NestArchAliveLesson · s19 | rightPlace | xato qatorni topish + sudrab ko'chirish | TESHIK (kod bo'yicha): `firstCorrectRef` xotirada, `onAnswer` faqat `done` da — xato bosish → F5 → to'g'ri = `correct: true` + nishon (PeanStack s15 bilan bir xil naqsh, u brauzerda tasdiqlangan) | ✓ ildiz V2, `picked` 0/1, kalit 0 (izohda aniq yozilgan) | **BALL-TESHIK (F5) + SOLO-TESHIK** | kod bo'yicha |
| NestArchResourceLesson · s17 | detective404 | begona qatorni topish + tuzatish | TESHIK (kod bo'yicha): `firstCorrectRef` xotirada, `onAnswer` faqat `done` da — xato bosish → F5 → to'g'ri = `correct: true` + nishon (PeanStack s15 bilan bir xil naqsh, u brauzerda tasdiqlangan) | ✓ ildiz V2, `picked` 0/1, kalit 0 (izohda aniq yozilgan) | **BALL-TESHIK (F5) + SOLO-TESHIK** | kod bo'yicha |
| EdgeCasesTestLesson · s16 | boundaryMaster | karta-tanlov (MCQ ga o'xshash, 4 variant) | ✓ teshik yo'q: har tanlov saqlanadi, F5 dan keyin `storedAnswer.firstAttemptCorrect` dan tiklanadi | ✓ oneShot: ekran o'zi `submitAnswer(i, isCorrect)`, kalit 1 = `CARD_CORRECT` 1; ildiz `selfSubmitted` bilan takrorlamaydi | **SOLO-TESHIK (qolgan kanallar halol)** | kod bo'yicha |
| JestUnitTestLesson · s16 | expectMaster | karta-tanlov (MCQ ga o'xshash, 4 variant) | ✓ teshik yo'q: har tanlov saqlanadi, F5 dan keyin `storedAnswer.firstAttemptCorrect` dan tiklanadi | ✓ oneShot: ekran o'zi `submitAnswer(i, isCorrect)`, kalit 1 = `CARD_CORRECT` 1; ildiz `selfSubmitted` bilan takrorlamaydi | **SOLO-TESHIK (qolgan kanallar halol)** | kod bo'yicha |
| GithubActionsLesson · s18 | logDetective | bir martalik tanlov (4 variant) | ✓ teshik yo'q (tanlov darhol saqlanadi, `uiPicked` dan tiklanadi) | ✓ ildiz V2, kalit 0 | **SOLO-TESHIK** | kod bo'yicha |
| PmJtbdLesson · s9 | — | juftlash (4 juft) | ✓ teshik yo'q: har o'zgarishda `onAnswer` (`firstResult` saqlanadi) | ✓ ekran o'zi `submitAnswer(result, …)` birinchi to'liq urinishda (oneShot), kalit 0 | **SOLO-TESHIK** | kod bo'yicha |
| PmMetricsLesson · s9 | — | juftlash (bir martalik) | ✓ teshik yo'q (darhol saqlanadi) | ✓ ekran o'zi `submitAnswer(pk, …)` (oneShot), kalit 0 | **SOLO-TESHIK** | kod bo'yicha |

## Tuzatish takliflari (KODGA TEGILMAGAN)

1. **F5-teshik (13):** `cc5abaf` naqshi — xato-tarmoqda `achMiss.miss(screen)`; yechilganda
   `first = !hadWrongRef.current && !(achMiss && achMiss.missed.has(SCREEN_META[screen].id))`; ildiz `missTry` nishonsiz ekranni
   ham yozsin (`if (!sid || missedRef.current.has(sid) || (ach && earnedRef.current.has(ach))) return;`).
2. **PeanStack s15 jonli:** kalit `s15: -1 → 0`; ildiz qatori `data.correct … submitAnswer(idx, id, 0, true, 0)` →
   `(data.solved || data.correct) … submitAnswer(idx, id, data.picked === 1 ? 1 : 0, !!data.correct, 0)`; ekran `picked: first ? 0 : 1`
   (hozir `picked` — satr; holat `solved` dan tiklanadi).
3. **Solo (18):** `solo-ball.md` qarori bilan birga — ildiz/ekran `submitAnswer` shartiga `|| live.mode === 'solo'` (UNIQUE — birinchi
   yozilgan qoladi) yoki ekranda `recordAttempt`; qaysi biri — foydalanuvchi qarori.
