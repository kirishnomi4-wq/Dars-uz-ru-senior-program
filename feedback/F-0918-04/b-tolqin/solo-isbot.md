# SOLO ISBOTI — qolgan 27 maxsus test-ekran (Q1, 19.09)

> Q1 tuzatishi (`9cdf279`: dars ildizi `recordAnswer` solo'da ball-ekran yakunlanganda `submit_answer` yuboradi) oldin 26
> tartiblash testi va PmJtbd s9 da isbotlangan edi. Bu fayl — qolgan 27 ekran. Usul: `scripts/ach-probe.mjs --solo` (dars
> esbuild bilan yig'iladi, soxta server har so'rovni yozadi; server kabi kalit bo'yicha baholanadi). Spec:
> `probe/solo-yozma.json`. Kodga tegilmadi.

## Xulosa

- **Solo: 27/27 ✓** — har ekranda yakunda serverga `submit_answer` ketdi; ✗ yo'q, tuzatish taklifi kerak emas.
- **23 yozma test** (kalit -1 — server «bajarildi = to'g'ri»): diskret urinish yo'q (harf terilishi bilan jonli tekshiruv) →
  spec'da `wrong = right`; SOLO-xato tekshiruvi bu yerda ma'nosiz — faqat «yakunda yozuv ketdimi» isbotlandi (✓).
- **4 boshqa shakl** (kalit ≥ 0) — xato yo'li haqiqiy: EdgeCasesTest s16 va JestUnitTest s16 (karta-tanlov, kalit 1: xato →
  keyin to'g'ri) · GithubActions s18 (bir martalik, kalit 0) · PmMetrics s9 (juftlash, bir martalik, kalit 0) — to'g'ri →
  serverga «to'g'ri», xato-birinchi → «xato» (server kalit bo'yicha).
- **Spec to'g'riligi (oddiy prob, solo'siz):** 27/27 da S0 (test-ekranda qator yo'q), S4, S2 (javob yozildi, `correct: true`)
  ✓. 4 ta xato yo'lli ekranda S1a/S1b ham ✓. Yozma testlarda S1a/S1b ✗ — kutilgan artefakt (`wrong = right`).
- Q1 bilan birga jami isbotlangan: 26 + 1 + 27 = **54 ekran**; `inventar-hisoblangan` dagi NestArchAlive s19 va
  NestArchResource s17 (Q4 agentida) va 7 diskret test (Q4) bu faylga kirmagan.
- Chegara: file:// dagi boshsiz Chrome + soxta server. Haqiqiy staging solo o'tishi — alohida (Q1-A reja).

## Jadval

| Ekran | Shakl | Solo natija (picked, correct) | Izoh |
|---|---|---|---|
| CssLesson1 s15 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| CssPractice s16 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| Htmllesson1 s7 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| PmLesson1 s15 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| PmLesson3 s13 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| VsCodeLesson s13 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| JsConditionsLesson s15 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| JsFunctionsLesson s15 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| JsVarsLesson s15 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| ReactApiPostLesson s16 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| ReactBuildSiteLesson s14 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| ReactCrudPracticeLesson s14 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| ReactFirstComponentLesson s15 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| ReactProjectDayLesson s14 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| ReactPropsReuseLesson s15 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| ReactRouterPracticeLesson s14 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| ReactStateEffectLesson s15 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| AuthEnvLesson s15 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| FullstackFeedbackLesson s16 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| FullstackProjectDayLesson s16 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| NodeServerLesson s15 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| PostgresCrudLesson s15 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| PracticeLesson2 s15 | yozma (kalit -1) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:0,correct:true} | faqat bajarildi — SOLO-xato ma'nosiz |
| EdgeCasesTestLesson s16 | karta-tanlov (kalit 1) | ✓ to'g'ri: {picked:1,correct:true} · xato: {picked:0,correct:false} | xato-birinchi → serverga «xato» |
| JestUnitTestLesson s16 | karta-tanlov (kalit 1) | ✓ to'g'ri: {picked:1,correct:true} · xato: {picked:0,correct:false} | xato-birinchi → serverga «xato» |
| GithubActionsLesson s18 | bir martalik tanlov (kalit 0) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:1,correct:false} | xato-birinchi → serverga «xato» |
| PmMetricsLesson s9 | juftlash (kalit 0) | ✓ to'g'ri: {picked:0,correct:true} · xato: {picked:1,correct:false} | xato-birinchi → serverga «xato» |
