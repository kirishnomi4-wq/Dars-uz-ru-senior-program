# T2-B — 45 ball-ekran inventari (2026-09-18)

Manba: `ball-custom-ekranlar.json` (sinf: «DOIM correct:true» 34 · «onAnswer ichki komponentda» 10 · «komponent topilmadi» 1).
To'liq yozuvlar: `inventar-ball.json`. Usul: har ekran komponenti kodda o'qildi, brauzerda ochilmadi. Server qismi
`server/migrations/0001_live_core.sql`, `0005_answer_attempts.sql` va `server/src/modules/results/*` dan o'qildi.

## Hukmlar

| Hukm | Soni | Qaysilar |
|---|---|---|
| **TARTIBLASH-TUZATILADI** | **15** | DragDropOrder 13: HtmlTakrorlash s11 · PracticeLesson4 s15 · ReactIntro s15 · BotAiAgent · BotAiBrain · BotAiProject · BotFullProject · AgentArchitecture · FullSystemProject · MobileAppPractice · PipelineProject · ReactNativeBasics · SystemArchitecture (s15). Custom 2: JsIntro s15 (bosib tizish + ▶ RUN) · ReactNativeApp s15 (bosib qo'yish, xato silkinadi) |
| **DISKRET-TANLOV** (8-A doirasidan tashqari — ertalab qaror) | **7** | PracticeLesson1 s15 · PracticeLesson3 s15 · ApiPostman s15 · DbSqlNosql s15 · DataIntro s15 va s15b · Routing s15 |
| **YOZMA-QOLADI** | **23** | 22 yozma/regex (jonli tekshiruv, «Tekshirish» tugmasi yo'q) + PracticeLesson2 s15 (xato yo'li yo'q) |
| ALLAQACHON-HALOL | 0 | — |
| NOANIQ | 0 | — |

**Foydalanuvchi soni bilan farq:** 8-A «13 tartiblash + 32 yozma» deb qabul qilingan edi. Haqiqatda 15 tartiblash (2 tasi
DragDropOrder emas, lekin tartiblash va diskret urinishi aniq), 7 diskret tanlov/ulash (xato yo'li va urinish-hodisasi bor —
tuzatsa bo'ladi, lekin 8-A ularni tunga kiritmagan) va 23 yozma. 22 yozmaning hammasi harf terilishi bilan jonli o'tadi —
diskret urinish yo'q.

## P5 bilan ziddiyat — hal qilindi

P5 «6-Modulda DragDropOrder test-ekranida allaqachon halol» degan. Kod: `AgentArchitectureLesson.jsx` Screen15 (≈1187-qator),
`FullSystemProject` (≈1271), `MobileAppPractice` ScreenFinalDD (≈1256), `PipelineProject` (≈1171), `ReactNativeBasics`
(≈1188), `SystemArchitecture` (≈1216) — hammasida shartsiz `correct: true, firstAttemptCorrect: true`. P5 «halol» ni «yechilmaguncha
`correct` kelmaydi (tekin emas)» ma'nosida olgan; fayldagi izoh ham shunday: «s15 (yakuniy DragDrop — noto'g'ri tartibda solve
bo'lmaydi)». 151-qonun / 8-A o'lchovi — **birinchi TO'LIQ urinish** — bo'yicha ular halol EMAS. Mening 13 lik o'lchovim to'g'ri.

## Ball uch kanaldan ketadi — tuzatish uchalasiga tegishi kerak

1. **`onFinished` (LMS `question_try`)** — `correctAnswers` = `answers[].correct` (finishLesson, resultDetails 179-qator). Hozir doim 1.
2. **Jonli server (`live.mode === 'student'`)** — `submit_answer` **`p_correct` ni e'tiborga olmaydi** (0001_live_core.sql 202-qator
   izohi): to'g'rilik `quiz_keys` dan. Kalit `-1` → **doim `true`** (242-qator); kalit `0` → `picked === 0`. Hozir: `-1` li ekranlar
   (4 ta) doim to'g'ri; `0` li ekranlar `picked: 0` yuborgani uchun doim to'g'ri.
3. **Solo server (`live.mode === 'solo'`, uyda)** — ⚠ **bu ekranlar umuman yuborilmaydi.** Barcha submit-joylar
   `live.mode === 'student'` bilan cheklangan; MCQ esa `recordAttempt` orqali (0005: birinchi urinish `live_answers` ga) solo'da
   ham yetadi. Kalit s-qolipda → `total_questions` ga kiradi → rasmiy solo natijada bu savol DOIM javobsiz: maksimal (N-1)/N,
   `all_correct` / `first_try` solo'da imkonsiz. Xuddi shu naqsh 18 «hisoblangan» custom ekranga ham tegishi mumkin
   (masalan PmMetrics s9: `if (oneShot) live.submitAnswer` — faqat student) — ular ochib tekshirilmadi.
   **Kod bo'yicha xulosa, server E2E bilan tasdiqlanmagan.**
4. **Routing s15** — jonli darsda ham yuborilmaydi (root'da final-qator yo'q, ekranda submit yo'q).

## Tuzatish-loyihasi (TARTIBLASH-TUZATILADI, 15)

- **DragDropOrder (fayl ichidagi nusxa):** pilotdagi 2 qator — `onWrong` prop + `useEffect(() => { if (wrong) onWrong && onWrong(); }, [wrong]);`
  (`wrong = full && !solved` hamma nusxada bor; bo'lakni qaytarish `full` qilmaydi → sirpanish sanalmaydi).
- **Ekran:** `const _am = useContext(AchMissCtx); const wrongEverRef = useRef(false);` · `onWrong` → `wrongEverRef.current = true; if (_am) _am.miss(screen);` ·
  yechilganda `const first = !wrongEverRef.current && !(_am && _am.missed.has(sid));` → `correct: first, firstAttemptCorrect: first, picked: first ? 0 : 1`.
  JsIntro: `setPhase('fail')` tarmog'ida; ReactNativeApp: rad-tarmog'ida (`else { setShakeId … }`).
- **F5:** `_am.miss(screen)` progressdagi `missed` ga yozadi. Root `missTry` hozir faqat ACH-ekranni yozadi → nishonsiz 8 ekran
  uchun 1 qator: `if (!sid || missedRef.current.has(sid) || (ach && earnedRef.current.has(ach))) return;` (AchRule va earn-guard
  faqat ACH ekranlarini o'qiydi — boshqa ta'sir yo'q).
- **Jonli server:** 4 ekranda INLINE_KEYS `-1` → `0` (HtmlTakrorlash s11 · PracticeLesson4 s15 · ReactIntro s15 · JsIntro s15);
  root V1 qatori (`data.correct` + `true`) → V2 (`data.solved` + `first ? 0 : 1` + `!!data.correct`) — PracticeLesson4, ReactIntro;
  HtmlTakrorlash va JsIntro — ekran-darajasidagi submit. Aks holda xato qilgan jonli o'quvchi serverga umuman yozilmaydi.
- **Nishonlar:** 7 ta ekranda nishon bor (architect, flow, director, missionLoop, cityLive, bughunter, backstagePass) — root earn
  `data.correct` ga qaragani uchun avtomatik birinchi urinishga o'tadi. PracticeLesson4 `planner` — `if (earn && first)`.
- **Hajm:** ≈ 100–120 qator, 15 faylda.

## Xavflar

- **Solo — alohida qaror.** `live.mode === 'solo'` ni submit-shartlariga qo'shish rasmiy solo natijalarni o'zgartiradi (savol
  javobsizdan hisoblanganga o'tadi). To'g'ri yo'nalish, lekin server E2E sinovisiz tunda kiritish xavfli.
- **Kalit `-1` → `0`** — server kalitlari mentor darsni ochganda avtomatik yangilanadi (`set_quiz_keys`); eski sessiyalar eski
  kalit bilan qoladi. `lint-keys` qiymatga qaramaydi; `smoke:onfinished` `0` kalitni MCQ deb urug'laydi — o'tadi (6-modul precedenti).
- **136-qonun jadvali** `correct` ni «yakuniy natija to'g'rimi» deb ta'riflaydi, `QuestionScreen` va resultDetails esa `correct` ni
  **birinchi urinish** (ball) deb oladi. 8-A test-ekranlarni MCQ bilan tenglashtiradi → qonunga aniqlik kerak: «scored test-ekranda
  `correct` = birinchi to'liq urinish; `solved` = oxirida yetdimi».
- **Ball sharti oldindan aytilmaydi** (MCQ'da ham aytilmaydi). Nishonli 7 ekranda `AchRule` qo'yish — ertalab qaror.
- 22 yozma testga tegilmagan: ular «bajarildi» bo'lib qoladi (136-qonun: bajarish-ekranida `correct: true` qonuniy). Diskret urinish
  kerak bo'lsa — «Tekshirish» tugmasi (mexanika + matn o'zgarishi).
