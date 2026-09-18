# TEKSHIRUV-2 — adversarial ikkinchi o'tish (19.09 tun)

Obyekt: T9 2-qismi (`4e6c449`: PracticeLesson4 · JsIntro · AgentArchitecture · FullSystemProject · MobileAppPractice ·
PipelineProject · ReactNativeBasics · SystemArchitecture · ReactNativeApp — s15), Y1 filtri (`5261905`,
`src/live/resultDetails.js`), T9 1-qismi (`cc5abaf`) bilan izchillik. Faqat o'qish; `src/` ga tegilmagan.
Usul: diff + to'liq ekran kodi; `buildResultDetails` haqiqiy javob-shakli bilan node'da yurgizildi
(`scratchpad/review2/y1b.mjs`); taklif qilingan filtr skretch-nusxada mavjud unit-testlar bilan sinaldi.

## Xulosa

| Og'irlik | Soni |
|---|---|
| YUQORI | 1 (Y1b — Y1 filtri to'liq emas: 3 ekran) |
| O'RTA | 2 |
| PAST | 3 |

Toza chiqqanlar: `first` hisobi (hamma 9 ekranda `wrongEverRef` faqat xato-tarmoqda yonadi, hech qayerda nollanmaydi —
`reset`/qayta joylash birinchi urinishni tiklamaydi; `SCREEN_META[screen].id` to'g'ri — prob S1a/S1b `missed` ni tasdiqlagan) ·
`onWrong` takror chaqirilishi zararsiz (`missTry` idempotent, `wrongEverRef` allaqachon true) · ikki marta yuborish yo'q
(9 faylda ekran darajasidagi `submitAnswer` faqat `QuestionScreen` ichida; tartiblash-ekranni ildiz V2 qatori BIR marta
yuboradi; JsIntro va HtmlTakrorlash — ekran o'zi, ildizda final qatori ta'sir qilmaydi) · PracticeLesson4 va ReactIntro da
final-scope faqat s15 — ildiz qatorining `data.picked === 1 ? 1 : 0` xaritasi boshqa MCQ ga tegmaydi · holat tiklash
`solved || correct` eski saqlov (`{correct:true, picked:true}`) bilan ham ishlaydi · JsIntro `order` massivi saqlanadi ·
ReactNativeApp rad-tarmog'i faqat «navbatdagi emas» tanlovda (qo'yilgan bo'lakni qayta bosish, yakundan keyin bosish — sanalmaydi) ·
nishonlar (`missionLoop`, `cityLive`, `bughunter`, `backstagePass`) faqat ildizdagi `data.correct && !missed` orqali;
`planner` — `if (earn && first)` · Y1 filtri MCQ ni yo'qotmaydi: 304 ta `QuestionScreen` `onAnswer` chaqiruvining hammasida
`options` + `correctIndex` bor; «`correctIndex` bor, `options` yo'q» shakli hech bir darsda yo'q · T9 1/2-qism izchil
(payload `picked` 0/1 hamma joyda; ildiz V2 `data.picked`; ekran o'zi yuborsa `first ? 0 : 1`).

## Topilmalar

| # | Og'irlik | Joy | Nuqson | Senariy | Tuzatish | Ishonch |
|---|---|---|---|---|---|---|
| Y1b | **YUQORI** | `src/6-Modull/FullSystemProjectLesson.jsx:1277` · `MobileAppPracticeLesson.jsx:1262` · `SystemArchitectureLesson.jsx:1222` (filtr: `src/live/resultDetails.js:218`) | Tartiblash testi javobida `options` (tartib bo'laklari yorliqlari) bor, `correctIndex` yo'q → Y1 filtri (`!options && correctIdx === null`) o'tkazib yuboradi → `onFinished.questions[]` ga `correct_option` va `correct_answer` SIZ yozuv ketadi (TZ `QuestionResult.required` buziladi). T9 dan oldin ham kirardi (`picked: 0`), lekin endi xato-birinchi holatda detal yolg'on urinish ko'rsatadi: `attempts: [{option:-1,correct:false},{option:1,correct:true,answer:"🔍 Detal"}]` — go'yo o'quvchi «Detal» variantini tanlab to'g'ri topgan. | MobileAppPractice s15: bo'laklarni avval xato tartibda to'ldiradi → tuzatadi → «Tamom» → yukda `questions:[{question_id:'s15', options:[4 yorliq], correct:false, solved:true, attempts:[…"🔍 Detal"…]}]`, `correct_option`/`correct_answer` yo'q (node'da yurgizildi). | **A (tavsiya):** filtrni `if (correctIdx === null) return;` ga kuchaytirish — `correct_option` shartnomada majburiy; `QuestionScreen` doim `correctIndex` beradi. Skretch-nusxada mavjud 12 unit-test + yangi test (variant bor, `correctIndex` yo'q → chiqmaydi) = **13/13** o'tdi; reproduktsiya — 3 holatda ham «kirmadi». **B:** 3 ekran payload'idan `options` ni olib tashlash (faqat detallarda ishlatiladi). | Yuqori (yurgizib ko'rildi) |
| O1 | O'RTA | `scripts/smoke-onfinished-all.mjs` `seedFor` (I3/I5/I12) | Smoke kaliti bor HAR scored ekranga MCQ shaklidagi javob urug'laydi (question + options + correctIndex). Maxsus test-ekranlar (kalit `0`) haqiqatda variantsiz yoki `correctIndex` siz keladi → I3 («questions(kind=test) == kalitli ekranlar soni») va I12 haqiqiy yukni aks ettirmaydi; Y1 va Y1b ni ushlay olmaydi. | Har qanday T9 darsi — smoke 30/30 o'tadi, haqiqiy yukda esa s15 filtrlanadi (yoki Y1b da buzuq chiqadi). | `seedFor`: `template: 'custom'` va dars kodida shu ekran `QuestionScreen` emas bo'lsa — haqiqiy shakl (`{correct, firstAttemptCorrect, solved:true, picked:0|1}`) urug'lansin va I3 kutilgani shu ekransiz hisoblansin; yoki `ach-probe` S2 ga «Tamom» → `onFinished` yuki tekshiruvi. Y1/Y1b uchun ishonchli qatlam — unit-test (haqiqiy shakllar). | Yuqori |
| O2 | O'RTA (operatsion) | kalit `-1 → 0`: PracticeLesson4, JsIntro, HtmlTakrorlash, ReactIntro | Server `quiz_keys` faqat mentor darsni ochganda yangilanadi (LMS: `/lms/join` `answer_key` → `set_quiz_keys` upsert, `join-service.js:104,123`; PIN-yo'l: `create_session` dan keyin). Serverda eski `-1` qatori bo'lsa — mentor YANGI versiyani ochgunicha «doim to'g'ri» qoladi. Jonli darsda mentor avval ochadi → nuqson emas; solo'da maxsus ekran baribir yuborilmaydi (T9b). | — | Deploy/CRM eslatmasi: yangi yig'ma yuklangach birinchi jonli dars kalitni yangilaydi; alohida harakat shart emas. | Yuqori |
| P1 | PAST | `src/live/resultDetails.js:197` | Y1b «A» qabul qilinsa, «Variant-indekssiz savol (correctIdx yo'q)» tarmog'i o'lik kodga aylanadi. | — | A bilan birga olib tashlash yoki izohni yangilash. | Yuqori |
| P2 | PAST (matn) | `src/6-Modull/ReactNativeAppLesson.jsx:1121` (Mentor) | Mentor butun to'g'ri tartibni urinishdan OLDIN aytadi («ilova ochiladi → backend'dan fetch → FlatList ro'yxat → mahsulotni tap → Detail ekran») — endi ballga tegadigan birinchi-urinish testida javob tayyor. | O'quvchi Mentor gapini ko'chirib bosadi → har doim birinchi urinishda to'g'ri. | `MATN_TAKLIFLAR.md` ga: Mentor tartibni aytmasin («Ko'p ekranli ilova qanday ishlaydi? Eslang va tartibni o'zingiz yig'ing.»). Matn — tasdiq bilan. | Yuqori |
| P3 | PAST | 9 fayldagi `DragDropOrder` `useEffect([wrong])` | Test yechilib bo'lgach ekranga qaytib (yoki mashq-o'tishida) bo'laklarni xato joylash yana `onWrong` → `miss` chaqiradi. Javob allaqachon yozilgan (`fired`/`passed` qo'riqlaydi) — ball/nishonga ta'sir yo'q, faqat `missed` da qo'shimcha yozuv. | — | Zarur emas; xohlansa `onWrong` ni `passed`/`solved` bo'lsa chaqirmaslik. | Yuqori |

## Umumiy baho

T9 2-qismi naqshga sodiq va xavfsiz: birinchi urinish to'g'ri o'lchanadi, ikki marta yuborish yo'q, holat tiklanadi.
Yagona jiddiy qoldiq — Y1 filtrining bitta teshigi (3 ta 6-Modul ekrani `options` bilan keladi); bir qatorli, sinalgan tuzatish bor.
