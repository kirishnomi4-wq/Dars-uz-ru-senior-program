# B to'lqin — ADVERSARIAL TEKSHIRUV (2026-09-19 tun)

Obyekt: `git diff 655cd93 HEAD -- src` — P1–P6 partiyalari, T9 1-qismi (6 test) va pilot. 64 fayl. T9 2-qismining 9 fayli
(JsIntro, PracticeLesson4, AgentArchitecture, FullSystemProject, MobileAppPractice, PipelineProject, ReactNativeApp,
ReactNativeBasics, SystemArchitecture) tekshirilmadi — ular hozir tahrirlanmoqda.

Usul: har `achMiss.miss` / `onWrong` / `<AchRule>` joyi avtomatik topildi (115 `miss` · 101 `AchRule` · 30 `onWrong`).
Keyin 137 komponent (ekranlar va umumiy komponentlar) mantiq-qatorlari bilan qo'lda o'qildi. Shubhali joylar kodda
aniqlashtirildi, bittasi `buildResultDetails` ni haqiqiy javob-obyekti bilan yurgizib isbotlandi. Brauzer-prob
qo'shimcha yurgizilmadi: topilmaning isboti node-yurgizish bilan yetarli bo'ldi.

## Xulosa

| Og'irlik | Soni | Qisqacha |
|---|---|---|
| **YUQORI** | **1** (2 qismli) | T9: `picked: 0/1` maxsus test-ekranlarni `onFinished.questions[]` ga shartnomaga zid shaklda kiritadi (ReactIntro s15 — savol matnisiz); xato-birinchi holatda detallar «1-variant to'g'ri» deydi |
| O'RTA | 4 | 3 tasi ma'lum (matn/UX, takliflari bor) · 1 jarayon: `--seal` smoke bu sinfni ko'rmaydi |
| PAST | 3 | matn aniqligi (`once` o'rinli bo'lgan joy) · tungi ishdan oldingi UX · dizayn-eslatma |

**Toza chiqqan tekshiruvlar** (nuqson topilmadi):
- **1-tur:** `miss` hech bir ekranda to'g'ri harakatda chaqirilmaydi. `once` ekranlardagi solishtirishlar `correct` hisobi bilan bir xil yo'nalishda: BotAi* s9/s11, BotAiBrain s7/s9/s11, BotFullProject s7/s9/s11, PmLesson18 s9, PmLesson25 s9, PmLesson6 s10.
- **2-tur:** ko'p tarmoqli ekranlarning har xato-tarmog'i `miss` bilan yopilgan: HtmlTakrorlash s6 (qator + variant), PmLesson5 s11 (karta + ro'yxat), ReactApiPost s13 (uch bosqich), PmLesson13 s4 (slot + ustun), PmLesson16 s9 (kimda + oqibat), EdgeCases/Jest s9 (tashlash + chalg'ituvchi), PmLesson22 s9 (katak + «toza»), PmLesson1 s11 (ikki rad), ReactCrud s13 (ikki qator), BackendCrud s10 (ikki qator). Umumiy komponent chaqiruvlarining hammasida `onWrong` uzatilgan: avtomatik ro'yxatdagi 7 shubha tag-tahlilining yolg'on signali bo'lib chiqdi.
- **3-tur:** sirpanishlar ajratilgan. «Band qator» (PmLesson4 s4), zonadan tashqari (ApiPostman s3, FullstackFeedback s5), hali ko'rinmagan ➕ (PmLesson13 s4), bo'sh bo'limli xarita (GithubActions s17), qarorsiz bosish (PmLesson23 s9, PmLesson13 s4 «avval gap») sanalmaydi. HtmlPractice s2 da faqat tuzilma xatosi sanaladi: katak to'la turganda har o'zgarish uni bo'shatadi, shuning uchun har to'liq urinish o'tishni qayta yoqadi.
- **4-tur:** joylashuv va `done` shartlari to'g'ri. `once` qatori yakun blokidan tashqarida (PmLesson6 s10). Ikki bosqichli ekranlarda qator boshidan ko'rinadi (Htmllesson1 s5, JsFunctions s3).
- **5-tur:** `useContext(AchMissCtx)` hamma joyda komponentning yuqori darajasida, erta `return` dan oldin (0 holat). Bir qatorli funksiya ichida `//` izoh yo'q (0).
- **6-tur:** `onWrong` berilmagan chaqiruvda xatti-harakat o'zgarmaydi: `onWrong &&` va `if (onWrong)` bilan himoyalangan.
- **8-tur:** yangi o'quvchi matni yo'q. Har yangi `uz:` satri tun boshidagi holat bilan fayl-fayl sanaldi: soni o'zgarmagan. Yagona istisno — tasdiqlangan Q6 qatori va §183 matnlari.
- **Q6:** beshta debug-ekranning hammasida har kod qatori bosiladi.

## YUQORI

### Y1 — T9: maxsus test-ekranlar `onFinished` detallariga LMS shartnomasiga zid kiradi; detallar xatoni «to'g'ri» deb ko'rsatadi

- **Qayerda:**
  - `src/3-Modull/ReactIntroLesson.jsx` s15: `solve`, taxminan 1711-qator.
  - `src/1-Modull/HtmlTakrorlashLesson.jsx` s11 (`ScreenExam.onSolved`): taxminan 1566–1568-qatorlar.
  - Bog'liq, tun boshidan oldin ham shunday edi: BotAiAgent / BotAiBrain / BotAiProject / BotFullProject s15 (`onSolved`). T9 2-qismi xuddi shu naqshni yana 9 ekranga yoymoqda.
- **Tur:** 9 (T9 izchilligi). Natija: LMS yuki.
- **Mexanizm:** `src/live/resultDetails.js` `buildResultDetails` faqat `Number.isInteger(a.picked)` bo'lgan javobni `questions[]` ga qo'shadi.
  - T9 dan oldin ReactIntro s15 va HtmlTakrorlash s11 `picked: true` yuborardi, ya'ni detallarga kirmasdi.
  - T9 ularni `picked: first ? 0 : 1` qildi. Endi ular `kind: 'test'` bo'lib kiradi, lekin `options`, `correct_option` va `correct_answer` siz. ReactIntro s15 da `question` ham yo'q.
  - Shartnomaga ko'ra (`TZ_LESSON_RESULT_DETAILS_RU.md` 130–136) bu maydonlar **majburiy**, `options` esa `minItems: 2`.
  - Bundan tashqari, «1 = xato» kodlashi detallarda teskari o'qiladi. `correctIdx` yo'q, `solved: true` bo'lgani uchun `attempts = [{option:-1, correct:false}, {option:1, correct:true}]` hosil bo'ladi.
- **Isbot:** node'da haqiqiy javob-obyekti bilan (`scratchpad/review/rd.mjs`):
  - ReactIntro s15, xato birinchi: `[{"question_id":"s15","kind":"test","correct":false,"solved":true,"attempts":[{"option":-1,"correct":false},{"option":1,"correct":true}]}]`. Savol matni yo'q.
  - Oldin (655cd93): `[]`.
  - HtmlTakrorlash s11: savol matni bor, lekin variantlar va `correct_answer` yo'q.
- **Senariy:** o'quvchi ReactIntro yakuniy testida bo'laklarni noto'g'ri, keyin to'g'ri joylaydi. «Tamom» bosilgach, `onFinished` yukida matnsiz, variantsiz test-yozuv ketadi. Unda «2-urinish, 1-variant, to'g'ri» deyilgan.
  - LMS bunga qanday javob beradi, noma'lum: rad etishi (422/409), jim yutishi yoki noto'g'ri ko'rsatishi mumkin. **TEKSHIRISH KERAK.**
  - Pretsedent: bugungi F-0918-02 da aynan matnsiz yozuv School API'da 422 berdi.
- **Nega smoke ushlamadi:** `smoke-onfinished-all.mjs` `seedFor` kaliti `≥ 0` bo'lgan ekranga MCQ shaklidagi javob urug'laydi (question, options, correctIndex). Shuning uchun I5 («har MCQ: question/options/correct_option/correct_answer») o'tadi. Haqiqiy ekran esa bunday javob bermaydi.
- **Tuzatish taklifi** (bittasini tanlash kerak):
  - **A (markaziy, 1 qator, tavsiya):** `buildResultDetails` da `if (!Array.isArray(a.options) || a.options.length < 2) return;`. Variantsiz maxsus ekran detallarga kirmaydi, chunki shartnomani qanoatlantira olmaydi.
    - Ball `correctAnswers`/`totalQuestions` orqali baribir to'g'ri ketadi, server detallari `live_answers` dan olinadi.
    - `src/live` umumiy fayl, shuning uchun ikki bosqichli qoida qo'llanadi va `vite build` shart.
  - **B (ekran darajasi):** `onAnswer` da `picked: true` qaytariladi, ball faqat `correct`/`firstAttemptCorrect` da qoladi.
    - Jonli `submitAnswer` `first ? 0 : 1` ni ekranda hisoblaydi (HtmlTakrorlash allaqachon shunday qiladi).
    - Ildiz qatorlari `data.correct ? 0 : 1` ga o'tadi: ReactIntro `data.picked === 1 ? 1 : 0` va Bot `data.picked ?? 1` o'rniga.
  - **Qo'shimcha:** `smoke-onfinished-all.mjs` ga invariant qo'shish: `questions[]` dagi har yozuvda `options.length ≥ 2` va `question` bo'lsin (urug'dan emas, yuk shaklidan).
- **Ishonch:** yuk shakli bo'yicha **yuqori** (yurgizib ko'rildi). LMS'dagi oqibati **o'rta**, ya'ni TEKSHIRISH KERAK.

## O'RTA

| # | Joy | Tur | Senariy | Taklif | Holat |
|---|---|---|---|---|---|
| O1 | `src/4-Modull/AuthEnvLesson.jsx` s14, xato qator bosilganda (≈1351) | 4/UX | xatosiz qator bosilsa ekran jim qoladi; `miss` yozildi, faqat 151-qator «lost» matniga o'tadi | Q6 matnini qo'yish («Bu qatorda xato yo'q — yana qarang.»), matn tasdig'i kerak | ma'lum — `matn-P4.md` |
| O2 | `src/1-Modull/CssLesson2.jsx` s7, muvaffaqiyat bloki | 8 (mavjud matn) | xato qilgan (nishonsiz) o'quvchi ham «🎯 Nishonga tegdi!» ni ko'radi | matnni nishondan ajratish | ma'lum — `matn-P1.md` |
| O3 | `src/4a-Modull/NestArchPracticeLesson.jsx` s19, `cl-row` | UX | `tap-hint` hamma da'voni bosishga chorlaydi, to'g'ri da'voni bosish esa xato sanaladi | to'g'ri da'volardan `tap-hint` ni olish (dizayn) | ma'lum — P2 hisoboti |
| O4 | `scripts/smoke-onfinished-all.mjs` `seedFor` | jarayon | Y1 sinfini ko'rmaydi (urug' MCQ shaklida) | Y1 dagi qo'shimcha invariant | yangi |

## PAST

| # | Joy | Tur | Izoh / taklif |
|---|---|---|---|
| P1 | `src/5-Modull/PmLesson21.jsx` s9 (`<AchRule screen={screen} />`, ≈1402) | 4 (`once`) | Har qator `tekshir` dan keyin qotadi, qayta urinish yo'q, keyingi qatorga o'tiladi. Xatodan keyin «…endi bemalol to'g'risini toping» shu qator uchun noaniq. `once` («Nishon birinchi urinish uchun edi.») aniqroq (PmLesson6 s10 bilan bir xil sinf) |
| P2 | `src/4a-Modull/PmLesson15.jsx` s4 `tanla` | tungi ishdan oldingi UX | Yechilgandan keyin boshqa qism bosilsa, ekran «yechilmagan» holatga qaytadi, `done` false bo'lib, «Davom» o'chadi. Tunda qo'shilgan `miss` bunga zarar qo'shmaydi: nishon olingan bo'lsa `missTry` yozmaydi. `if (done) return;` bilan yopish mumkin |
| P3 | `src/6-Modull/PmLesson24.jsx` s9 `qoy` | dizayn-eslatma | Tanlov qotmaydi. To'g'ri tanlovdan keyin xato variant bosilsa ham `miss` yoziladi. Mantiqan «javobni xatoga o'zgartirish», qoidaga zid emas |

## Doiradan tashqarida qayd

- Bot darslari s15 (T9 1-qismi) tun boshidan oldin ham `picked: 0` bilan detallarga variantsiz kirardi. Ya'ni Y1 ning bir qismi eskidan kelgan, T9 esa unga «option 1 = correct» qarama-qarshiligini qo'shdi.
- T9 2-qismi (9 ekran) hozir xuddi shu naqshni qo'llamoqda: Y1 tuzatishi ularga ham tegishi kerak.
