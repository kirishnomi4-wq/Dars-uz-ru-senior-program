# KATTA §41 — codemod uchun quruq o'lchov (2026-09-18 kech)

Bu fayl — REJA va O'LCHOV. `src/` ga tegilmagan. Yonidagi fayllar:
`codemod-olchov.py` (faqat o'qiydi) → `codemod-olchov.json` · `codemod-6band-proto.mjs` (prototip: natijani faqat
`--out <papka>` ga NUSXA qilib yozadi, `src` ga yoza olmaydi).

## a) Qisqa xulosa

| Guruh | Fayl | Ma'nosi |
|---|---|---|
| G0 — pilot | 1 | `InternetLesson.jsx`: 6-band bor, faqat muhrlash qo'shiladi (import + 1 qator) |
| **G1 — to'liq mexanik** | **69** | hamma langar etalon shaklda |
| **G2 — parametrli mexanik** | **22** | langarlar joyida, lekin nom to'qnashuvi yoki qo'shimcha setter bor — prototip ularni ham o'tkazdi |
| G3 — qo'l ishi | 5 | 3 tasida `reset` nishonlarni tozalaydi (6-bandga zid) · 2 tasida ikkinchi test-komponent bor |
| GX — arxiv | 1 | `src/eski/1-Modull/PmAudienceLesson.jsx` — marshrutda yo'q (App.jsx: «o'chirildi»), progress-saqlovi ham yo'q → tegilmaydi |
| Jami `ACH_TRIGGERS` li | 98 | |

**Prototip dalili:** G1 + G2 = 91 faylning NUSXASIGA 14 ta almashtirish qo'llandi — **91/91 mos, xato 0**; har nusxa
`esbuild` dan o'tdi (sintaksis), `jsx-lint` 91 faylda toza. O'rtacha **+20 qator/dars** (jami ≈ 1820 qator).
Bu — sintaksis va langar dalili; **xatti-harakat brauzerda hali tekshirilmagan** (f-bo'lim).

Hajm-baho: codemod skripti tayyor prototipdan ≈ 1 soat (src/live ga `sealPayload` + unit test bilan) · G3 5 fayl ≈ 1 soat ·
darvozalar + smoke + brauzer-namunalar ≈ 2–3 soat. 1–5-bandlar (`AchRule` + `miss()` nuqtalari, 76 dars) bu o'lchovga
KIRMAYDI — u B to'lqin, dars-badars qo'l ishi.

## b) 6-band langarlari (98 faylda o'lchandi)

| # | Langar | Etalon shakl | Natija |
|---|---|---|---|
| L1 | `src/live` importi | `import { … } from '../live/index.js';` | 98/98 |
| L2 | `const AchCtx = createContext(null);` | yonidan `AchMissCtx` qo'shiladi | 98/98 (aynan 1 ta) |
| L3 | `QuestionScreen` boshi | `const QuestionScreen = ({ … }) => {` | 98/98 |
| L4 | jonli javob qatori | `live.submitAnswer(screen, SCREEN_META[screen]?.id \|\| …, i, isCorrect, …);` | 95 × 1 ta · 1 × variant yozuv (`'s' + screen`) · **2 × 2 ta** (4b: EdgeCases, JestUnit — ikkinchi test-komponent) |
| L5 | `recordAttempt` qatori | `if (live && live.recordAttempt) live.recordAttempt(` | 98/98 (aynan 1 ta) |
| L6 | `earnedRef` e'loni | `useRef(new Set(saved?.earned \|\| []))` | 96 · 1 variant (`PmLesson4`: `(saved && saved.earned)`) · 1 arxiv |
| L7 | `earn` boshi | `if (!ACHIEVEMENTS[id] \|\| earnedRef.current.has(id)) return;` | 98/98 |
| L8 | nishon berish qatori | `if (_m && ACH_TRIGGERS[_m.id] && data && data.correct) earn(…)` | 94 · 2 variant (`_m.scored &&`) · 1 pilot · 1 arxiv |
| L9 | `reset` (ildizdagi, `setScreen(0)` li) | bir qatorli, `progClear(…)` bilan boshlanadi | 76 etalon · 17 qo'shimcha setter (`pracClear`, `setPractice(null)`, `setMentorPractice`, `setBoard`…) — boshiga qo'shish bilan mexanik · **3 tasi nishonni tozalaydi** · 1 arxiv |
| L10 | progress-saqlov effekti | `progWrite(…, { screen, answers, earned: […], startedAt…, total…, savedAt… }); }, [screen, answers, earned]);` | 96 bir xil · 1 pilot · 1 arxiv |
| L11 | `finishLesson` | 9 xil tana-shakli, lekin farqlar mahalliy: `nickname/livePin/liveMode` maydonlari (26 dars) · `s`/`_`/`_s` nomi · `finalCorrect` bir ifodada. **Token-tekshiruvi:** tanadagi HAR `answers` so'zi = `answers[i]` + `buildResultDetails` ichidagi bitta + `answers:` kaliti; `durationSec`, `const payload`, `onFinished(payload)` — aynan 1 tadan | 97/97 o'tdi (arxivda `buildResultDetails` yo'q) |
| L12 | Provider | `<AchCtx.Provider value={earned}>` … `</AchCtx.Provider>` | 98/98 (1 juft) |
| L13 | «Qaytadan» tugmasi | ildizda `onReset={reset}`; yakun ekranida `onClick={onReset}` | 97 × (1, 1) · 1 × (1, 2) |
| — | `react` importi | `useRef/useState/useContext/createContext/useCallback` | 98/98 bor · `useMemo` 38 darsda yo'q → prototip qo'shadi |

**Nom to'qnashuvi (muhim):** 14 darsda ildizda `const [practice, setPractice]` allaqachon band (amaliyot-kompilyator
holati), 3 darsda (`PmLesson21`, `PmLesson22`, `PmJtbdLesson`) `QuestionScreen` ichida `practice` so'zi bor. Shuning uchun
codemod **hamma darsda** `fpPractice` / `setFpPractice` nomini ishlatadi; kontekst maydoni pilotdagidek `practice` qoladi
(`AchRule` o'zgarmaydi). Pilotni qayta nomlash shart emas.

**Pilotda o'ralmagan yo'llar (fakt):** mashq-o'tishida faqat `QuestionScreen` dagi `submitAnswer`/`recordAttempt`
to'xtatiladi. Boshqa `submitAnswer` chaqiruvlari (ildizdagi final-scope — 65 dars; `PRACTICE_BASE` — amaliyot; arena)
o'ralmagan. Serverda `submit_answer`: `on conflict (player_id, screen_idx) do nothing` (`0001_live_core.sql:256`) — takror
javob balni o'zgartirmaydi. Urinish-tarixi (`recordAttempt`) har darsda aynan bitta joyda — `QuestionScreen` da.

## c) Yukni muhrlash — loyiha

**Kod bo'yicha aniqlangani (pilot, qolgan darslarda `finishLesson` shu shaklda):**
- `finishLesson` hech qanday holatni o'zgartirmaydi → «Darsni yakunlash» tugmasi ekranda qoladi, qayta bosish mumkin.
- Har bosishda yuk qaytadan yig'iladi: `durationSec` o'sadi; `buildResultDetails` ham vaqtga bog'liq (`at` yo'q javobga
  `finish = Date.now()` qo'yiladi). Ya'ni farq faqat `durationSec` da emas — **butun obyektni** muhrlash kerak.
- `finishLesson` boshida `progClear` — lokal progress (shu jumladan `firstPass`) o'chadi.

**Taklif — markaziy yordamchi, darsda bitta qator:**

```js
// src/live/resultDetails.js (+ index.js eksporti)
const sealed = new Map(); // dars-ID → birinchi yuborilgan yuk (shu sahifa-yuklanishi ichida)
export function sealPayload(lessonId, payload) {
  if (!lessonId) return payload;
  if (!sealed.has(lessonId)) sealed.set(lessonId, payload);
  return sealed.get(lessonId);
}
// resetResultDetails(lessonId) ichiga: sealed.delete(lessonId)
//   (LMS «toza boshlash» va solo → jonli o'tish — yangi urinish, yangi yuk; useLiveSession.js:308, 346)
```
```jsx
// har darsda (codemod T1 + T10):
if (typeof onFinished === 'function') onFinished(sealPayload(LESSON_META.lessonId, payload));
```

Nega dars ichidagi `useRef` emas: siyosat (xotira / saqlov / qachon tozalanadi) BITTA faylda turadi — Axadulla javobidan
keyin o'zgarsa, 98 darsga qayta tegilmaydi. Unit test joyi tayyor: `src/live/resultDetails.test.mjs`.

**Chegaralar (halol):**
- **Shu sahifada qayta bosish** (18.09 da ko'rilgan holat) — yopiladi: aynan o'sha obyekt qaytadi.
- **«Qaytadan» → mashq → yana «Yakunlash»** — muhr `reset` da tozalanmaydi → o'sha yuk (6-bandga mos: birinchi o'tish — hisob).
- **Yakunlab, orqaga qaytib, javobsiz savolga javob berib, yana «Yakunlash»** — ESKI yuk ketadi. Bu xatti-harakat
  o'zgarishi («bir dars — bir natija»); foydalanuvchi bilishi kerak.
- **F5 dan keyin — YOPILMAYDI.** Xotiradagi muhr yo'qoladi. LMS-token bilan server progressni qaytaradi (`startedAt`
  bilan) → `durationSec` boshqa chiqadi. LMS kaliti nimaga bog'langanini bilmaymiz (yukka? urinishga? sahifa
  ochilishiga?) — 409 takrorlanadimi, **o'lchab bo'lmadi**. Kerak bo'lsa B-variant: muhr `localStorage` ga ham
  (`ccSealed:<darsId>`, urinish-ID bilan) — faqat `resultDetails.js` o'zgaradi. Avval Axadulla javobi.
- **Mentor rejimi:** `live.endSession()` avvalgidek har bosishda chaqiriladi; yuk muhrlanadi — zararsiz.
- **Standalone (`onFinished` yo'q):** `sealPayload` shart ichida — chaqirilmaydi, ta'sir yo'q.

**Qamrov:** 98 (−1 arxiv) dars + `onFinished(payload)` li yana 13 fayl (`3-Modull/PmLesson7` · `7-Modull` 12 dars — `lms/`
da yo'q) + uy-vazifa fayllari (`lms/` da 12 ta; ular `onFinished({…})` ni ichkarida yig'adi — shakli boshqa, **o'lchanmadi**).
Eski papkalar (`eski/`, `2-moodull eski/`) — tegilmaydi.

## d) Shakl-guruhlar

**G1 — to'liq mexanik (69):**
- **1-Modull** (5): DeployLesson · GitLesson · PmLesson1 · PmLesson2 · PmLesson3
- **2-Modull** (2): PmLesson6 · PracticeLesson3
- **3-Modull** (12): PmLesson8 · PmLesson9 · PmLesson10 · ReactApiGetLesson · ReactApiPostLesson · ReactBuildSiteLesson · ReactCrudPracticeLesson · ReactFirstComponentLesson · ReactIntroLesson · ReactProjectDayLesson · ReactPropsReuseLesson · ReactStateEffectLesson
- **4-Modull** (14): ApiPostmanLesson · AuthEnvLesson · BackendCrudPracticeLesson · DataIntroLesson · DbSqlNosqlLesson · FullstackConnectPracticeLesson · FullstackProjectDayLesson · NodeServerLesson · PmLesson11 · PmLesson12 · PmLesson13 · PmLesson14 · PostgresCrudLesson · RoutingLesson
- **4a-Modull** (3): NestArchAliveLesson · NestArchPracticeLesson · PmLesson15
- **4b-Modull** (1): PmLesson16
- **4c-Modull** (7): AiPipelineProjectLesson · CiCdIntroLesson · FullPipelineProjectLesson · FullProPipelineLesson · GithubActionsLesson · PmLesson17 · PmLesson18
- **5-Modull** (10): BotAiAgentLesson · BotAiBrainLesson · BotAiProjectLesson · BotApiButtonsLesson · BotFeedbackIterationLesson · BotFullProjectLesson · BotIntroLesson · BotStatefulMemoryLesson · PmLesson19 · PmLesson20
- **6-Modull** (13): AgentArchitectureLesson · ArchPatternsLesson · ClaudeSkillsLesson · FullSystemProjectLesson · MobileAppPracticeLesson · PipelineProjectLesson · PmLesson23 · PmLesson24 · PmLesson25 · ReactNativeAppLesson · ReactNativeBasicsLesson · SystemArchitectureLesson · WriteSkillLesson
- **pm** (2): PmMetricsLesson · PmUserStoryLesson

**G2 — parametrli mexanik (22):**
- `reset` da qo'shimcha setter + ildizda `practice` nomi band (14): CssLesson1 · CssLesson2 · CssPractice · HtmlPractice ·
  HtmlTakrorlashLesson · Htmllesson1 · Htmllesson2 · VsCodeLesson · JsConditionsLesson · JsFunctionsLesson · JsLoopsLesson ·
  JsVarsLesson · PeanStackLesson · PracticeLesson1
- `reset` da qo'shimcha setter (3): PracticeLesson2 · PracticeLesson4 · NestArchResourceLesson
- `QuestionScreen` da `practice` so'zi (3): PmLesson21 · PmLesson22 · PmJtbdLesson
- variant yozuv (2): PmLesson4 (`earnedRef`) · ReactRouterPracticeLesson (`'s' + screen`)

**G3 — qo'l ishi (5):**
- `reset` nishonlarni tozalaydi (`earnedRef.current = new Set(); setEarned(new Set()); …`) — 6-bandga zid («Qaytadan»da
  nishon ko'paymaydi ham, KAMAYMAYDI ham): **JsIntroLesson · PmLesson5 · FullstackFeedbackLesson**. Tozalash qatorlari
  olib tashlanadi; FullstackFeedback da `trkRef`/`setResolved` — dars holati, qoladi (o'qib tasdiqlash kerak).
- ikkinchi test-komponent (`submitAnswer` 2 joyda): **EdgeCasesTestLesson (1417-qator) · JestUnitTestLesson (1456-qator)** —
  o'sha komponentga ham `fpPractice` kiritiladi.

Bugungi tahrirlar (Htmllesson2, PmLesson4, PmLesson5, BotIntroLesson — ishchi daraxtda, commit qilinmagan) o'lchovga
kirgan: langarlar ularga tegmagan.

## e) Xavflar va tartib

1. **`sealPayload` — avval markaz:** `src/live/resultDetails.js` + `index.js` + unit test (`resultDetails.test.mjs`).
   `src/live` — umumiy fayl (97 dars ishlatadi) → ikki bosqichli qoida: ishoralar ro'yxati → tuzatish → `vite build`.
2. **Pilot:** `InternetLesson.jsx` ga faqat muhrlash → brauzer: ikki marta «Yakunlash» = bir xil JSON.
3. **G1 dan 3 namuna** (bittadan texnik / PM / 6-modul) → gates + brauzer (D/E/F holatlari) → keyin **G1 to'liq (69)**.
4. **G2 (22)** → gates; brauzer-namuna: Htmllesson2 (nom to'qnashuvi + amaliyot-kompilyator), PmLesson21.
5. **G3 (5)** qo'lda.
6. Har to'lqindan keyin: `npm run gates -- <fayl>` (yangi topilma 0 — eski qarz HEAD bilan solishtiriladi) ·
   `npm run lint:jsx` · `npm run smoke:onfinished` · oxirida `vite build`. `lms/` qayta yig'ish — eng oxirida, bir yo'la.

Xavflar:
- **Bir qatorli `reset` ichiga izoh yozilmaydi** (`//` qatorning qolganini o'chiradi — F-0802-15). Prototip izohsiz qo'shadi.
- **Server-progress `firstPass`/`missed` ni tashimaydi** (151-qonunda yozilgan chegara): boshqa qurilmadan davom etilsa,
  mashq-holati yo'qoladi.
- **Progress-saqlov shakli kengayadi** (`missed`, `firstPass`) — eski saqlovda bu maydonlar yo'q → `saved?.…` bilan xavfsiz.
- **G3 dagi 3 darsda xatti-harakat o'zgaradi:** «Qaytadan» endi nishonlarni o'chirmaydi.
- **Parallel seans** bo'lsa — 91 faylga bir yo'la yozish to'qnashadi; codemod yakka seansda yuriladi.

## f) Sinov rejasi

| Vosita | Nima qayta ishlatiladi | Nima qo'shiladi |
|---|---|---|
| `scripts/smoke-onfinished-all.mjs` (har darsda yakun tugmasini bosib yukni 9 invariant bilan tekshiradi) | butunlay | **I10:** tugma ikki marta bosiladi → ikkala yuk `JSON.stringify` bo'yicha AYNAN teng · **I11:** «Qaytadan» → oxirgi ekran → «Yakunlash» → yuk o'zgarmagan |
| `feedback/F-0918-04/ach-test.mjs` + `harness.jsx` | D («Qaytadan» → `firstPass` muhrlandi, `earned` o'zgarmadi) · E (mashqda test nishoni berilmadi) · F (mashqdan keyin `onFinished` = birinchi o'tish) | dars parametrlari (URL, saqlov-kaliti, ekran soni, test ekrani indeksi) argumentga chiqariladi — har shakl-guruhdan 1 dars |
| `src/live/resultDetails.test.mjs` | — | `sealPayload`: birinchi obyekt qaytadi · `resetResultDetails` dan keyin yangisi |
| `npm run gates`, `lint:jsx`, `vite build` | butunlay | — |

**O'lchanmagani (ochiq):** brauzerdagi xatti-harakat (prototip faqat nusxada, sintaksis darajasida) · F5 dan keyingi LMS
javobi · `review` rejimida yakun tugmasi qanday ishlashi · uy-vazifa fayllarining `onFinished` shakli · B to'lqin
(`AchRule` + CSS + `miss()` nuqtalari) langarlari.
