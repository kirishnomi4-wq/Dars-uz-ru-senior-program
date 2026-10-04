| Manba-ID | Qoida | Qamrov | Tekshiruv | Manba |
|---|---|---|---|---|
| DE-§hdr | Hamma darslar bir xil layoutda: stage 1100px, padH 60, avto-zoom `--lz`; boshqa kenglik qabul qilinmaydi. | hamma | ekran:stage kengligi 1100px, `--lz` zoom (1280 va 390 px) | DARS_ETALON.md:9 |
| DE-§hdr2 | Jonli ball hisobi serverda; mentor sessiya ochganda javob kaliti `set_quiz_keys` bilan yuklanadi, aks holda ballar 0 bo'ladi. | jonli | grep:set_quiz_keys | DARS_ETALON.md:4 |
| DE-§0.2 | Har o'zgarishdan keyin build toza bo'lsin: `npx esbuild <fayl> --loader:.jsx=jsx --outfile=/dev/null`. | hamma | grep:npm run gates | DARS_ETALON.md:30 |
| DE-§0.3 | Jonli qism yangi PIN bilan sinaladi (2 o'quvchi, podium/arena ballari 0 emas); mentor-kodning o'zi hujjatga yozilmaydi. | jonli | ekran:2 o'quvchi, podium/arena ball > 0 | DARS_ETALON.md:31 |
| DE-§0.4 | Ish oxirida 14-bo'limdagi tekshiruv ro'yxati to'ldiriladi. | hamma | ko'z | DARS_ETALON.md:32 |
| DE-§1.1 | Matnda faqat lotin o'zbek harflari bo'lsin; tasodifiy kirill harf xato, faqat ataylab `ru:` tarjimada ruxsat. | hamma | grep:[\x{0400}-\x{04FF}] | DARS_ETALON.md:52 |
| DE-§1.2 | Matn boshlang'ich o'quvchiga tushunarli bo'lsin: `<p>` — «matn (paragraf)», «xatboshi» emas; skelet bo'laklariga aniq maslahat. | hamma | ko'z | DARS_ETALON.md:57 |
| DE-§1.3 | O'quvchiga qaratilgan barcha matn (tugma, nishon, mentor, xabar) faqat «siz» shaklida yoziladi. | hamma | grep:[a-z']+(ding\|lading\|gansan\|asan\|san)\b\|o'zing\b\|senga\|sening | DARS_ETALON.md:58 |
| DE-§1.3b | Istisno: o'quvchining mashinaga bergan o'z buyruqlari («Yur», «Sakra», AI promptiga «rasm qo'sh») sen-formada qoladi. | tex | ko'z | DARS_ETALON.md:64 |
| DE-§1.4 | Tugma nomi neytral harakat oti bo'lsin («Yaratish», «Yuborish»), buyruq fe'li emas («Yarat»); nom o'zgarsa mentor va audio matni ham yangilanadi. | hamma | ko'z | DARS_ETALON.md:66 |
| DE-§1.5 | Manbada o'zbek apostrofi ASCII `'` bo'lsin; qiyshiq apostrof (U+2018, U+2019, U+02BB) aralashmasin. | hamma | grep:[‘’ʻ] | DARS_ETALON.md:67 |
| DE-§1.6 | Matnda tilga olingan tugma nomi ekrandagi tugma yozuvi bilan aynan bir xil bo'lsin. | hamma | ko'z | DARS_ETALON.md:73 |
| DE-§1.7 | O'quvchi matnida «sir», «hozircha sir», 🤫/🙈 kabi sirli-dramatik ifoda ishlatilmaydi; aniq, tinch tushuntirish yoziladi. | hamma | grep:hozircha sir\|🤫 | DARS_ETALON.md:74 |
| DE-§1.8 | Mentor matni sodda va do'stona bo'lsin. | hamma | ko'z | DARS_ETALON.md:78 |
| DE-§1.9 | Har ekranda `useAudio([{ id, text, trigger: 'on_mount', waits_for }])` matni yoziladi; muhim harakat javoblari `pushOneOff` bilan beriladi. | hamma | grep:useAudio\(\[ | DARS_ETALON.md:79 |
| DE-§1.9b | Audio matn va Mentor matni parallel bo'lsin (biri o'zgarsa ikkinchisi ham); `waits_for` hodisalari ekrandagi haqiqiy trigger bilan bog'lanadi. | hamma | ko'z | DARS_ETALON.md:81 |
| DE-§1.10 | Har interaktiv ekran tartibi: TOPSHIRIQ (buyruq, 3–6 so'z, savol emas) → YO'RIQNOMA (≤20 so'z) → KARTOCHKA (faqat material) → VARIANTLAR (qisqa tugmalar). | hamma | ko'z | DARS_ETALON.md:42 |
| DE-§2.1 | `useLiveSession(lessonId, answerKey)` imzosida `answerKey` va `keyRef` bo'lsin: `keyRef.current = answerKey`. | jonli | grep:function useLiveSession\(lessonId, answerKey\) | DARS_ETALON.md:99 |
| DE-§2.2 | `startMentor` ichida `liveStore(... mode:'mentor' ...)` dan keyin `set_quiz_keys` RPC chaqiruvi bo'lsin (`keyRef.current` bilan). | jonli | grep:liveRpc\('set_quiz_keys' | DARS_ETALON.md:107 |
| DE-§2.3 | `answerKey` chaqiruv tomonida `{ ...INLINE_KEYS, ...quiz-i: q.correct }` shaklida quriladi va `useLiveSession`ga uzatiladi. | jonli | grep:useLiveSession\(LESSON_META\.lessonId, answerKey\) | DARS_ETALON.md:115 |
| DE-§2.4 | `INLINE_KEYS` shakli `{ [screenId]: correctIdx }`; yozma (input) savollar uchun `-1`. | jonli | grep:INLINE_KEYS = \{ | DARS_ETALON.md:121 |
| DE-§2.4b | Har `INLINE_KEYS[id]` qiymati o'sha ekranning `QuestionScreen`ga uzatilgan `correctIdx` bilan bir xil bo'lishi shart. | jonli | ko'z | DARS_ETALON.md:122 |
| DE-§2.5 | Server `p_picked === kalit[p_question_id]` ni o'zi tekshiradi; klientning `p_correct` qiymatiga ishonilmaydi. | jonli | ko'z | DARS_ETALON.md:128 |
| DE-§2.6 | Nickname kaliti `LIVE_NICK_KEY = 'liveNickname'` qurilma bo'ylab bitta bo'lsin, `lessonId` bilan yasalmasin. | jonli | grep:liveNickname | DARS_ETALON.md:134 |
| DE-§3 | `submitAnswer(screenIdx, questionId, picked, correct, elapsedMs)` imzosi o'zgartirilmaydi (3 martagacha qayta urinish). | jonli | grep:submitAnswer\( | DARS_ETALON.md:141 |
| DE-§3b | Indeks diapazoni: `<100` dars testlari, `>=100` (`QUIZ_BASE_IDX + qi`) arena savollari, `PRACTICE_DONE_BASE (500) + fromScreen` praktika belgisi. | jonli | grep:QUIZ_BASE_IDX\|PRACTICE_DONE_BASE | DARS_ETALON.md:143 |
| DE-§4 | `SCREEN_META` va `screens[]` bir xil tartib va bir xil uzunlikda bo'lishi shart; indeks massiv o'rniga teng. | hamma | grep:SCREEN_META\|const screens = | DARS_ETALON.md:162 |
| DE-§4b | `SCREEN_META` har elementi `{ id, type, template, scored, scope }` metadata bo'lsin; `SCORED_IDX` undan hosil qilinadi. | hamma | grep:SCORED_IDX | DARS_ETALON.md:154 |
| DE-§4c | `PRACTICE_AFTER` va `Q_LABELS` indeks-kalitli maplar: ekran qo'shilsa/olinsa keyingi barcha indekslar surilib, kalitlar yangilanadi. | hamma | grep:PRACTICE_AFTER\|Q_LABELS | DARS_ETALON.md:165 |
| DE-§4d | Ekran qo'shish/olib tashlashda `SCREEN_META` va `screens[]` ikkalasidan bir xil o'rinda o'zgartiriladi. | hamma | ko'z | DARS_ETALON.md:171 |
| DE-§4e | Scored ekran qo'shilsa/olinsa `INLINE_KEYS` va `Q_LABELS` ham yangilanadi. | jonli | ko'z | DARS_ETALON.md:173 |
| DE-§4f | Ekran qo'shilgach build va jonli oqim sinovi bo'ladi (praktika to'g'ri ekrandan ochiladimi, podium ishlaydimi). | jonli | ekran:praktika ochilishi, podium | DARS_ETALON.md:175 |
| DE-§4.1 | Dars standart skeletda quriladi: hook → reja → sikl (exploration → test → praktika) → builder → debugging → podium → flashcard → summary. | hamma | ko'z | DARS_ETALON.md:180 |
| DE-§4.1b | `LESSON_META.lessonId` formati `<fan>-<NN>-v<versiya>`; katta kontent o'zgarishida versiya oshiriladi. | hamma | grep:lessonId: '[a-z]+-\d\d-v\d+' | DARS_ETALON.md:194 |
| DE-§4.1c | Sikl 3–5 marta takrorlanadi; builder (kamida 3 bo'lak) va debugging (nishon: debugger) bo'lishi kerak. | tex | ko'z | DARS_ETALON.md:182 |
| DE-§4.1d | SCREEN_META ekran tiplari: `hook / rule / exploration / test / case / stats / review / summary`. | hamma | grep:type: '(hook\|rule\|exploration\|test\|case\|stats\|review\|summary)' | DARS_ETALON.md:196 |
| DE-§4.2 | Yakun sahifasi tartibi: Dars tugadi chip + ScoreRing → CodeStrike CTA → RECAP + Uyga vazifa → Nishonlar kolleksiyasi. | hamma | ekran:summary tartibi | DARS_ETALON.md:199 |
| DE-§4.2b | Yakun sahifasi navigatsiyasi: «Qaytadan» (reset) va «Modulni yakunlash →» (`finishLesson` payload: lessonId, nickname, ballar, davomiylik). | hamma | grep:Modulni yakunlash | DARS_ETALON.md:201 |
| DE-103 | Har dars yakunida bitta gap — «Bugungi asosiy fikr» — turadi; o'quvchi uni o'z og'zi bilan ayta olishi kerak (F-0802-06). | hamma | grep:Bugungi asosiy fikr | DARS_ETALON.md:205 |
| DE-103a | Dars loyihalanganda avval asosiy fikr yoziladi, keyin ekranlar unga olib boradigan qilib quriladi (natija-avval). | hamma | ko'z | DARS_ETALON.md:217 |
| DE-103b | «Bugungi asosiy fikr» hero + ScoreRingdan keyin, CodeStrike CTAdan oldin, `small` o'lchovda turadi. | hamma | ekran:asosiy fikr joyi va o'lchovi | DARS_ETALON.md:219 |
| DE-103c | Asosiy fikr ikki tushunchani ulaydi, qayta ta'riflamaydi; RECAP kabi sanoq ro'yxati bo'lmaydi. | hamma | ko'z | DARS_ETALON.md:222 |
| DE-103d | Yakun ovozi aynan asosiy fikr gapini aytadi (matn va ovoz bir xil). | hamma | ko'z | DARS_ETALON.md:226 |
| DE-103e | Asosiy fikr flashcardga qo'shilmaydi: flashcard faqat o'tilgan atamalarni takrorlaydi. | hamma | ko'z | DARS_ETALON.md:227 |
| DE-§4.2f | Kalit so'zlar (GLOSSARY) yakun sahifasida bo'lmaydi; takrorlash alohida `ScreenFlashcards` sahifasida, summarydan oldin. | hamma | grep:GLOSSARY\|\.gloss | DARS_ETALON.md:230 |
| DE-105 | Test savoli `className="title h-ask"` bilan chiziladi; `.h-title` va `.h-sub` savol uchun ishlatilmaydi (F-0802-11). | hamma | grep:title h-ask | DARS_ETALON.md:236 |
| DE-105a | `.h-ask { font-size: clamp(19px,2.6vw,27px); line-height: 1.32; letter-spacing: -0.01em; text-wrap: balance; }` e'loni faylda aniq bittadan bo'lsin. | hamma | grep:\.h-ask \{ | DARS_ETALON.md:241 |
| DE-105b | `.h-title` va `.h-sub` ga tegilmaydi; ular sarlavha va yakun-subtitr uchun qoladi. | hamma | ko'z | DARS_ETALON.md:245 |
| DE-105c | Variant tugmasi: `font-size: clamp(15px,1.85vw,17px)`, `line-height: 1.45`, padding `clamp(13px,1.9vw,17px) clamp(15px,2.2vw,20px)`, variantlar orasi 11px. | hamma | ekran:variant tugma o'lchovi (1280 va 390 px) | DARS_ETALON.md:247 |
| DE-105d | Savol÷variant shrift nisbati taxminan 1.6× bo'lsin. | hamma | ekran:savol/variant shrift nisbati | DARS_ETALON.md:249 |
| DE-105e | Savol matni qisqa bo'lsin (105b-qonun va `MATN_KORPUS.md` 68-bo'lim). | hamma | ko'z | DARS_ETALON.md:250 |
| DE-§5.1 | `QuestionScreen`da `mountTs = useRef(Date.now())` bilan javob tezligi o'lchanadi. | jonli | grep:mountTs = useRef\(Date\.now\(\)\) | DARS_ETALON.md:259 |
| DE-§5.2 | `firstCorrectRef` birinchi urinishni qotiradi; qayta urinish bahoni oshirmaydi. | jonli | grep:firstCorrectRef | DARS_ETALON.md:260 |
| DE-§5.3 | Jonli darsda bir urinish: `oneShot = !!(live && live.mode === 'student')`, xato bossa ham qulflanadi. | jonli | grep:oneShot | DARS_ETALON.md:261 |
| DE-§5.4 | Jonli javob `live.submitAnswer(screen, SCREEN_META[screen]?.id \|\| 's'+screen, i, isCorrect, Date.now() - mountTs.current)` shaklida yuboriladi. | jonli | grep:live\.submitAnswer\(screen | DARS_ETALON.md:262 |
| DE-§5.5 | `NavNext` `optionalLive` jonli darsda animatsiya ekranlarida freeRide beradi; mentor tirik va sessiya tugamagan bo'lsa gate yumshaydi. | jonli | grep:freeRide | DARS_ETALON.md:267 |
| DE-§5.5a | `optionalLive` faqat animatsiya/mashq ekranlariga beriladi: hook, exploration, builder, debugging. | jonli | grep:optionalLive | DARS_ETALON.md:282 |
| DE-§5.5b | `optionalLive` testlarga (`QuestionScreen`), yozma testlarga, flashcard/podium/summaryga berilmaydi. | jonli | ko'z | DARS_ETALON.md:285 |
| DE-§5.5c | Erkin rejim, mentor uzilishi yoki yakka o'qishda `freeRide=false` bo'lib, gate qayta majburiy bo'ladi; `locked` freeRidedan mustaqil. | jonli | ko'z | DARS_ETALON.md:287 |
| DE-§5.6 | `RECAPS = {}` bo'sh qoldirilmaydi: har scored test uchun «Qayta tushuntirish» kartalari yoziladi. | hamma | grep:RECAPS = \{\} | DARS_ETALON.md:297 |
| DE-§5.6a | Har test uchun aynan 3 karta (`ic`, `h`, `body`, `vis`, `ask`); `h` bitta gap, `body` 1–2 sodda gap. | hamma | ko'z | DARS_ETALON.md:301 |
| DE-§5.6b | `RECAPS` kaliti scored ekranning `screens[]` indeksi (`Q_LABELS` bilan bir xil) va `SCORED_IDX` bilan to'liq mos bo'lsin. | jonli | ko'z | DARS_ETALON.md:302 |
| DE-§5.6c | Recap mazmuni o'sha testdan oldingi nazariyadagi metafora bilan bir xil bo'lsin; yangi metafora kiritilmaydi. | hamma | ko'z | DARS_ETALON.md:315 |
| DE-§5.6d | Kamida 1–2 kartada `ask` (sinfga og'zaki savol) bo'lsin; `ask` ichida backtik ishlatilmaydi. | hamma | grep:ask:.*` | DARS_ETALON.md:317 |
| DE-§5.6e | RECAPS satrida apostrofli matn qo'shtirnoq ichida yoziladi, aks holda build sinadi. | hamma | grep:npm run gates | DARS_ETALON.md:320 |
| DE-§5.7 | Jonli testda natija (to'g'ri/xato) mentor «Natijani ochish»ni bosguncha hamma ekranda yashirin turadi (Kahoot-reveal). | jonli | ekran:reveal'gacha neytral variantlar | DARS_ETALON.md:324 |
| DE-§5.7a | Mentor `doReveal()` bilan `reveal_screen` RPC yozadi; sahifa yangilansa `revealScreen === screen` dan tiklanadi. | jonli | grep:doReveal\|reveal_screen | DARS_ETALON.md:331 |
| DE-§5.7b | Reveal'gacha variantlar proyektorda neytral, `NavNext` `mReveal`gacha qulf («Avval natijani oching»). | jonli | ekran:mentor proyektor reveal'gacha | DARS_ETALON.md:333 |
| DE-§5.7c | O'quvchida javob qotadi (`oneShot`), kutish holati ko'k neytral belgi («Javobingiz qabul qilindi»). | jonli | grep:option-wait\|frame-wait | DARS_ETALON.md:336 |
| DE-§5.7d | `revealed = !oneShot \|\| (revealScreen === screen \|\| mentorScreen > screen \|\| status === 'ended' \|\| !mentorAlive)` formulasi qo'llanadi. | jonli | grep:const revealed = | DARS_ETALON.md:338 |
| DE-§5.7e | `MentorTestStats` reveal'gacha faqat «javob berdi N/M»ni ko'rsatadi; ✅/❌ soni va ustunlar yashirin; erkin rejimda reveal yo'q. | jonli | ekran:MentorTestStats reveal'gacha | DARS_ETALON.md:342 |
| DE-§5.8 | Darsda o'ylab topilgan personaj (chat-pufakli qahramon) ishlatilmaydi; yagona ovoz Mentor (F-0729-27). | hamma | grep:dy-msg\|DChat | DARS_ETALON.md:346 |
| DE-§5.8a | Bosqich topshirig'i personaj xabari bilan emas, vazifa-karta (`TaskCard`, 🎯, «Vazifa» yorlig'i) bilan beriladi. | hamma | grep:TaskCard | DARS_ETALON.md:351 |
| DE-§5.8b | Kod-misoldagi odam ismlari faqat kontent-ma'lumot; ular gapirmaydi va reaksiya-pufak yozmaydi. | hamma | ko'z | DARS_ETALON.md:353 |
| DE-§5.9 | Ko'p-qadamli mexanikada ipucha elementning nomi va joyini aytadi, konteyner nomini emas («Yuqoridagi B yoki I tugmasini bosing») (F-0801-11). | hamma | ko'z | DARS_ETALON.md:366 |
| DE-§5.9a | Ipuchadan qavs-izohlar olib tashlanadi; ular tugmaning o'z `title`ida turadi (99-qonun). | hamma | ko'z | DARS_ETALON.md:371 |
| DE-§5.9b | Kutilayotgan boshqaruv ~2 s davrda pulsatsiya qiladi (`scale(1) → 1.22`); bosilgach pulsatsiya o'chadi (`usedB`/`usedI`). | hamma | grep:@keyframes tgm-breathe\|\.pulse | DARS_ETALON.md:372 |
| DE-§5.9c | `prefers-reduced-motion: reduce` da animatsiya o'chadi, lekin affordans doimiy yorug' fon bilan qoladi. | hamma | grep:prefers-reduced-motion | DARS_ETALON.md:377 |
| DE-§5.9d | Har ko'p-qadamli mexanikada 2-qadam boshqaruvida pulsatsiya va ipuchada aniq nom bo'lishi tekshiriladi. | hamma | ko'z | DARS_ETALON.md:381 |
| DE-§5.10 | Darsning yakuniy va'dasi bitta tashqi bog'liqlikka (sayt, o'rnatish, ro'yxatdan o'tish) osilib qolmaydi (F-0801-12). | hamma | ko'z | DARS_ETALON.md:391 |
| DE-§5.10a | Har tashqi qadamda `help` bandi xatoning aynan matnini yozadi va ayblovni o'quvchidan oladi («bu sizning xatongiz emas»). | hamma | grep:xatongiz emas | DARS_ETALON.md:394 |
| DE-§5.10b | Tashqi qadam ekrani oxirida 🛟 ZAXIRA-YO'L paneli (`FallbackPanel`, yopiq `details`) bo'lsin: boshqa yo'l va tashqi bog'liqliksiz marshrut. | hamma | grep:FallbackPanel | DARS_ETALON.md:396 |
| DE-§5.10c | Buyruq yoki tugma nomi OS'ga qarab farq qilsa, Windows, macOS va Linux uchun uchalasi yoziladi. | hamma | ko'z | DARS_ETALON.md:401 |
| DE-§5.10d | Zaxira-panel darvozani qulflamaydi: bajarolmagan qadamni belgilab keyingi ekranga o'tishga ruxsat beradi. | hamma | ko'z | DARS_ETALON.md:403 |
| DE-§5.10e | Darsdagi har tashqi manzil/o'rnatishda `help` va zaxira-panel borligi tekshiriladi. | hamma | ko'z | DARS_ETALON.md:408 |
| DE-§6 | `MentorTestStats`da «to'g'ri» soni `data.rows.filter(a => a.picked === correctIdx).length` bilan hisoblanadi, `a.correct` bilan emas. | jonli | grep:a\.correct\)\.length | DARS_ETALON.md:413 |
| DE-§7 | Podium saralashi: `y.okCount - x.okCount \|\| x.time - y.time` (to'g'ri ko'p birinchi, teng bo'lsa vaqt kam). | jonli | grep:okCount - x\.okCount | DARS_ETALON.md:420 |
| DE-§7b | `okCount` server-baholangan `a.correct`dan hisoblanadi; to'g'ri chiqishi uchun 2-bo'limdagi kalit yuklangan bo'lishi shart. | jonli | grep:okCount = | DARS_ETALON.md:421 |
| DE-§8.1 | Arena ball formulasi (`QUIZ_MS = 15000`, `QUIZ_BASE_IDX = 100`, `quizPts`) o'zgartirilmaydi. | jonli | grep:const quizPts | DARS_ETALON.md:429 |
| DE-§8.1b | Arena ball: ≤500 ms 1000 ball, 15 s oxirida 500; streak (2+) uchun +100. | jonli | grep:streak>=2 | DARS_ETALON.md:402 |
| DE-§8.1c | Arena standart hajmi 12 savol, har biriga 15 soniya (`QUIZ_MS = 15000`); 20000 qiymat 15000 ga tushiriladi. | jonli | grep:QUIZ_MS = 20000 | DARS_ETALON.md:403 |
| DE-§8.1d | `QUIZ_BANK` har elementi `{ q, opts, correct }` bo'lsin, `correct` haqiqiy indeks. | jonli | grep:QUIZ_BANK | DARS_ETALON.md:404 |
| DE-§8.2 | Arena brendi «CodeStrike» (wordmark `Code<span class="qz-wm-h">Strike</span>`, CTA «⚡ CodeStrike jangi»); eski «CoddyHoot» ishlatilmaydi. | hamma | grep:CoddyHoot | DARS_ETALON.md:407 |
| DE-§8.2b | Arena ranglari: fon `#F0F4FC`, accent `#FF4F28`, `QUIZ_COLORS = ['#FF5A2C','#0FA6D6','#F5A623','#22A05C']`. | jonli | grep:QUIZ_COLORS | DARS_ETALON.md:409 |
| DE-§8.2c | Arena mascot — chaqmoq `QzBolt`; boyqush `QzOwl` eskirgan, ishlatilmaydi. | jonli | grep:QzOwl | DARS_ETALON.md:410 |
| DE-§8.2d | Jonli fon `QzFX` canvas va `QZ_BG_SHAPES` kod tokenlaridan iborat; plitkalar glossy, `qz-` CSS CodeStrike uslubida. | jonli | grep:QzFX\|QZ_BG_SHAPES | DARS_ETALON.md:411 |
| DE-§8.2e | `QZ_BG_SHAPES` va `QzFX` ichidagi `TOK` massivi aynan shu darsda o'rganilgan atamalardan tuziladi. | jonli | ko'z | DARS_ETALON.md:413 |
| DE-§8.3 | `QUIZ_BANK` to'g'ri javoblari 4 pozitsiyada teng taqsimlanadi (12 savolda 3/3/3/3); variantlar aralashtirilmaydi. | jonli | grep:correct: [0-9] (sed QUIZ_BANK \| uniq -c) | DARS_ETALON.md:416 |
| DE-§8.4 | Bitta savoldagi variantlar taxminan bir xil uzunlikda bo'lsin; to'g'ri javob uzunligi bilan ajralib turmasin (inline va arena uchun). | hamma | ko'z | DARS_ETALON.md:426 |
| DE-§8.4b | Xato variantlar ham to'liq, ishonarli yoziladi; to'g'ri javob ortiqcha cho'zilmaydi. | hamma | ko'z | DARS_ETALON.md:430 |
| DE-§8.4c | Variant matnlarini balanslashda `correct` indeksi va pozitsiyasiga tegilmaydi. | jonli | ko'z | DARS_ETALON.md:432 |
| DE-§9 | Reusable komponentlar kontentdan ajratiladi: boshqa darsga faqat ma'lumot almashtiriladi. | tex | ko'z | DARS_ETALON.md:439 |
| DE-§9.1 | `DragDropOrder` yagona atomik holat (`useState({pool, slots})`) ishlatadi; setState ichida setState bo'lmaydi. | tex | grep:setSt\( | DARS_ETALON.md:443 |
| DE-§9.1b | Sudrashda asl element DOM transform bilan suriladi; `position:fixed` klon ishlatilmaydi; tap ham ishlaydi. | tex | ekran:sudrash pirillamaydi, tap ishlaydi | DARS_ETALON.md:444 |
| DE-§9.2 | `DebugChallenge`da kod va jonli preview yonma-yon turadi; buzuq preview boshidan xato ko'rinadi, topilganda ko'z oldida tuzaladi. | tex | ekran:debug kod+preview | DARS_ETALON.md:449 |
| DE-§9.3 | Flashcard `front` to'liq savol bo'lib, `?` bilan tugaydi (uz ham, ru ham); «ta'rif → atamani top» qolipi taqiq (F-0729-26). | hamma | grep:front: '[^']*[^?']' | DARS_ETALON.md:455 |
| DE-§9.3b | Flashcard `back` — 1–4 so'z yoki kod; `note` — bir qatorli izoh. | hamma | ko'z | DARS_ETALON.md:458 |
| DE-§9.3c | Flashcard kartalari soni 10–12; savollar faqat o'sha darsda o'tilgan mavzudan, o'rgatilmagan atama kartaga chiqmaydi. | hamma | ko'z | DARS_ETALON.md:459 |
| DE-§9.3d | Flashcard qolipi o'zgarsa, Mentor va audio matni ham o'zgaradi; old-tomon ishorasi savolni takrorlamaydi («Javobni o'ylang»). | hamma | ko'z | DARS_ETALON.md:461 |
| DE-§9.3e | Flashcardda `tr(card.back)` majburiy, aks holda javob ikki tilda yozilmaydi. | ru | grep:tr\(card\.back\) | DARS_ETALON.md:463 |
| DE-§9.3f | Flashcard 3D flip, «Bildim»/«Takrorlash» (takrorlash kartasi navbat oxiriga), progress bar va yakun «Hammasini bilasiz!» bilan ishlaydi. | tex | grep:preserve-3d | DARS_ETALON.md:464 |
| DE-§9.3g | Flashcard baholash Quizlet uslubida: `✗ Takrorlash` qizil, `✓ Bildim` yashil; muhr bilan uchib ketadi (`fc-out-knew`/`fc-out-again`, `fc-in`). | tex | grep:fc-out-knew\|fc-out-again | DARS_ETALON.md:466 |
| DE-§9.3h | Flashcard tepasida ikki jonli hisoblagich-pill (`O'rganilmoqda · N`, `Bildim · N`) pop animatsiya bilan; `exiting` paytida tugmalar va flip qulflanadi. | tex | grep:fc-pill-pop\|exiting | DARS_ETALON.md:469 |
| DE-§9.3i | Flashcard alohida `ScreenFlashcards` sahifasida (summarydan oldin) va deck effekti `.fc-cardwrap::before/::after` bilan. | tex | grep:ScreenFlashcards | DARS_ETALON.md:471 |
| DE-§9.3j | Jonli darsda flashcard faqat mentorga ko'rinadi; jonli o'quvchidan sakrab o'tiladi, erkin rejim/mentor uzilishi/yakka o'qishda o'quvchiga ochiladi. | jonli | grep:FLASH_IDX\|flashHidden | DARS_ETALON.md:473 |
| DE-§9.3k | Flashcard sakrab o'tish navigatsiya darajasida (`advance()` va `prev()`da) bajariladi, komponent ichida emas. | jonli | grep:flashHidden\(\) | DARS_ETALON.md:481 |
| DE-§9.3l | Flashcardga nishon berilmaydi; ekran `scored:false`. | jonli | ko'z | DARS_ETALON.md:485 |
| DE-§9.4B | Dars ko'rsatgan har qanday tayyor kod nusxalanmaydi: kod bloklariga `nocopy` sinfi (`user-select: none`). | hamma | grep:nocopy | DARS_ETALON.md:491 |
| DE-§9.4B2 | Kod bloklarida `onCopy`, `onCut`, `onDragStart` bloklanadi (`const noCopy = {...}` bir joyda e'lon qilinadi). | hamma | grep:const noCopy | DARS_ETALON.md:496 |
| DE-§9.4B3 | Kod maydoni `<textarea onPaste>` matnda qator-ko'chirish yoki `<teg>` bo'lsa `preventDefault()` qiladi. | hamma | grep:onPaste | DARS_ETALON.md:499 |
| DE-§9.4B4 | Istisno: rasm URL, PIN kabi kod bo'lmagan uzun qiymatlar uchun «Nusxalash» tugmasi qoladi va bir qatorli paste ochiq. | hamma | ekran:URL paste o'tadi, ko'p qatorli bloklanadi | DARS_ETALON.md:502 |
| DE-§9.4B5 | Tekshiruv: `.hc-checklist` `userSelect` = `none`; ko'p qatorli paste'da `defaultPrevented === true`. | hamma | ekran:getComputedStyle('.hc-checklist').userSelect | DARS_ETALON.md:507 |
| DE-§9.4 | Darsda aynan 3 praktika-compiler bo'ladi (`PRACTICE_AFTER` uch kalit); 4–5 ta emas, har biri boshqacha ko'nikma. | tex | grep:const PRACTICE_AFTER (kalitlar soni = 3) | DARS_ETALON.md:512 |
| DE-§9.4a | Praktika `HtmlCompiler({ task, starterCode, onContinue, onBack })` bilan: chapda shartlar paneli, o'ngda kod maydoni va jonli iframe preview. | tex | grep:HtmlCompiler\( | DARS_ETALON.md:514 |
| DE-§9.4b | Praktika shartlari haqiqiy DOM tahlili bilan (`C.has/text/attr/attrs/nested/count/toggle`), regex bilan emas; CSS uchun `C.cssProp`/`C.cssValue`. | tex | grep:check: C\. | DARS_ETALON.md:526 |
| DE-§9.4c | `parseCss` qisqa xossalarni (`gap`, `padding`, `margin`, `flex`) `getPropertyValue(sh)` bilan topishi shart; `C.cssProp` aniq qiymatni majburlamaydi. | tex | ekran:to'g'ri yechim ✅ o'tadi | DARS_ETALON.md:527 |
| DE-§9.4d | Praktika materiali HTML ko'p qatorda, 2 bo'shliq chekinish bilan yoziladi; bir uzun qator emas. | tex | grep:starter.*<div[^\\]*><span | DARS_ETALON.md:528 |
| DE-§9.4e | CSS praktikasi 2 fayldan iborat (`index.html` material, `style.css` o'quvchi yozadigan joy); o'quvchi HTML yozmaydi. | tex | grep:name: 'style.css' | DARS_ETALON.md:529 |
| DE-§9.4f | Compilator starteri faqat `<!-- Bu yerga yozing -->` (CSS'da `/* Bu yerga yozing */`); tayyor teg, namuna matn yoki ko'rsatma bo'lmaydi. | tex | grep:STARTER_\|DEFAULT_FILES | DARS_ETALON.md:530 |
| DE-§9.4g | Praktika shartlari faqat shu ekrangacha o'tilgan teglarni so'raydi; o'tilmagan teg (masalan sarlavha praktikasida `<p>`) so'ralmaydi. | tex | ko'z | DARS_ETALON.md:531 |
| DE-§9.4h | Preview himoyalari: `li:empty{display:none}`, `<base target="_blank">`, iframe `sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"`. | tex | grep:sandbox="allow-scripts | DARS_ETALON.md:532 |
| DE-149 | Jonli sinfda sessiya tugamagan ekan mashq ochiladi; `mentorAlive` bu shartga kirmaydi (F-0914-11). | jonli | grep:live\.status !== 'ended' | DARS_ETALON.md:539 |
| DE-§9.4i | Praktika tugaganda `live.submitAnswer(PRACTICE_DONE_BASE + fromScreen, \`practice-${fromScreen}\`, 0, true, 0)` signali yuboriladi. | jonli | grep:PRACTICE_DONE_BASE \+ fromScreen | DARS_ETALON.md:544 |
| DE-§9.4j | `runPractice(entry, fromScreen)` har doim `fromScreen` bilan chaqiriladi; mentor uchun compilator overlay ochilmaydi. | jonli | grep:runPractice\( | DARS_ETALON.md:575 |
| DE-§9.3A | `onPractice` yiqilishining har uch yo'li (sinxron otilish, rad-etish, funksiya yo'q) darsning o'z compilatoriga (`openLocal`) tushadi (F-0912-04). | tex | grep:\.then\(done, openLocal\) | DARS_ETALON.md:551 |
| DE-§9.3Ab | `onPractice` promise'iga timeout qo'yilmaydi: u praktika tugaganda hal bo'ladi, ochilganda emas. | tex | grep:setTimeout.*onPractice | DARS_ETALON.md:565 |
| DE-§9.3Ac | Uyga vazifa yo'li `.catch(openLocal)` ishlatadi; `.catch(() => {})` bilan xato yutilmaydi. | tex | grep:then\(done\);\|catch\(\(\) => \{\}\) | DARS_ETALON.md:568 |
| DE-§9.4k | Jonli mentor praktikada `MentorPracticeOverlay` ko'radi: tugatganlar chiplari, «Tugatdi: N/M», 3 s polling, «Doskada yozib ko'rsatish», «Keyingi mavzuga →». | jonli | grep:MentorPracticeOverlay | DARS_ETALON.md:573 |
| DE-§9.4l | `reset()` da `setMentorPractice(null)` ham tozalanadi; CSS klasslari `mp-*`. | jonli | grep:setMentorPractice\(null\) | DARS_ETALON.md:578 |
| DE-§9.4A | Praktika bajarilganligi saqlanadi: `localStorage['<lessonId>-practice-<fromScreen>']` dars-doirasida (11-qonun formati). | tex | grep:-practice- | DARS_ETALON.md:585 |
| DE-§9.4A2 | Bajarilgan praktika qayta kirganda overlay ochmaydi, to'g'ridan-to'g'ri `advance()`; qayta ochish ixtiyoriy, darvoza emas. | tex | ekran:qayta kirganda praktika majburlanmaydi | DARS_ETALON.md:586 |
| DE-§9.4A3 | Erkin (self) rejimda xira matn-havola: «✓ Bu mashqni sinfda bajarganman — davom etish →»; tugma emas, savol shaklida emas. | tex | grep:Bu mashqni sinfda bajarganman | DARS_ETALON.md:587 |
| DE-§9.4A4 | Takrorlash-havola faqat eshikni ochadi: nishon bermaydi, serverga signal yubormaydi, xotiraga saqlanmaydi; jonli darsda va mentorda ko'rinmaydi. | tex | ko'z | DARS_ETALON.md:592 |
| DE-§9.4A5 | Erkin rejim jonlidan qattiqroq bo'lib qolmasligi kerak (freeRide bilan mutanosiblik). | tex | ko'z | DARS_ETALON.md:597 |
| DE-§10a | Yuqori panel popover sarlavhasi va tugma aria/title «Badges»; «Achievements» va «🏅 Nishonlar» popover joyida ishlatilmaydi. | hamma | grep:"Achievements"\|Achievements —\|🏅 Nishonlar — | DARS_ETALON.md:601 |
| DE-§10b | Yakun sahifasi «🏅 Nishonlaringiz», bayram «🏅 Nishon ochildi!», onboarding «Nishonlaringiz» o'zbekcha qoladi. | hamma | ko'z | DARS_ETALON.md:601 |
| DE-§10c | Nishon nomlari (`ACHIEVEMENTS.name`) qisqa inglizcha o'yin-nom («Built It!», «Nice Catch!»), o'zbekcha tavsifiy emas; `desc` o'zbekcha siz-formada. | hamma | grep:ACHIEVEMENTS | DARS_ETALON.md:601 |
| DE-§10d | Nishon bayrami (`AchCelebrate`) to'liq ekranli bo'ladi (spotlight, nurlar, medalyon, uchqunlar), ~4 s, bosib yopiladi; kichik toast emas. | tex | grep:AchCelebrate | DARS_ETALON.md:603 |
| DE-§10e | Nishon bayramlari navbatda bittalab ko'rsatiladi (`AchToasts` faqat `toasts[0]`); `prefers-reduced-motion` tinch varianti bor. | tex | grep:toasts\[0\] | DARS_ETALON.md:603 |
| DE-§10f | Har sahifada «🏅 X/4» hisoblagich bor (Stage header, progress yonida), yangisida pulslaydi; bosilsa popover ochiladi. | tex | ekran:🏅 hisoblagich | DARS_ETALON.md:604 |
| DE-§10g | Nishonlar kolleksiyasi dars oxirida: olingan rangli + tavsif, olinmagan 🔒. | tex | ekran:summary kolleksiya | DARS_ETALON.md:605 |
| DE-§10h | `ACHIEVEMENTS` aynan 4 ta (3 bosqich nishoni + `graduate`); `ACH_TRIGGERS` ekran id → nishon xaritasi. | tex | grep:const ACH_TRIGGERS | DARS_ETALON.md:610 |
| DE-§10i | Har nishon darsni oxirigacha o'tgan bolada real ochilishi mumkin: jonli o'quvchi ololmaydigan yashirin ekranga va «100% to'g'ri» kabi shartga bog'lanmaydi. | tex | ko'z | DARS_ETALON.md:614 |
| DE-151 | Nishon har o'quvchi olishi mumkin bo'lishi kerak (kafolat emas); amaliy nishon faqat birinchi urinishga beriladi; kafolatli yagonasi `graduate` (2026-09-18). | tex | ko'z | DARS_ETALON.md:616 |
| DE-§10j | Nishon triggeri markazlashgan: `recordAnswer`da `ACH_TRIGGERS[_m.id] && data.correct` bo'lsa `earn(...)`, yakunda `earn('graduate')`. | tex | grep:earn\('graduate'\) | DARS_ETALON.md:618 |
| DE-§10k | `ACH_TRIGGERS` faqat ma'noli ekranga (`type:'test'` yoki DragDrop/Debug challenge) bog'lanadi; exploration/toggle ekranga bog'lanmaydi. | tex | ko'z | DARS_ETALON.md:619 |
| DE-§10l | `earn` `earnedRef` bilan StrictMode-safe bo'ladi; `AchCtx.Provider value={earned}` root'da, `AchToasts` root'da. | tex | grep:earnedRef | DARS_ETALON.md:620 |
| DE-§10.1 | Mentor ekranida nishon hech qanday ko'rinishda (bayram, hisoblagich, kolleksiya) chiqmaydi (F-0729-06). | jonli | grep:live\.mode === 'mentor' | DARS_ETALON.md:627 |
| DE-§10.1a | Hisoblagich komponenti o'zi qaror qiladi: `if (gate?.live?.mode === 'mentor') return null` barcha hooklardan keyin. | jonli | grep:mode === 'mentor'\) return null | DARS_ETALON.md:639 |
| DE-§10.1b | Kolleksiya `{!isMentorL && ...}` qorovuli ostida; bayram root'da `{live.mode !== 'mentor' && <AchToasts/>}`. | jonli | grep:live\.mode !== 'mentor' && <AchToasts | DARS_ETALON.md:639 |
| DE-§10.1c | Uchala nishon qorovuli (hisoblagich, bayram, kolleksiya) yangi darsda majburiy, aks holda qabulchi qaytaradi (F-0729-24). | jonli | ko'z | DARS_ETALON.md:638 |
| DE-§10B | Mentor ekrani (proyektor) o'quvchi ko'rinishining nusxasi emas: shaxsiy narsa (nishon hisobi, ball) proyektorda chiqmaydi. | jonli | ko'z | DARS_ETALON.md:646 |
| DE-§10Ba | Mag'lubiyat-tablosi (butun sinf oldida «0/4 to'g'ri») proyektorda chiqmaydi; podiumdagi «📊 Savollar bo'yicha» kartasi olib tashlanadi. | jonli | grep:pod-qstats\|qstat- | DARS_ETALON.md:651 |
| DE-§10Bb | Mentor ekranida `ScoreRing` yo'q; podium reytingi, `MentorTestStats`, `MentorPracticeOverlay` va mentor-eslatmalari (ixcham chip) bor. | jonli | ekran:mentor rejimi 12 band | DARS_ETALON.md:656 |
| DE-§10Bc | Karta olib tashlanganda uning CSS'i (`pod-qstats`/`qstat-*`) o'lik qolmaydi; residue-grep majburiy. | jonli | grep:pod-qstats\|qstat- | DARS_ETALON.md:669 |
| DE-§11.1 | Mentor avatari hostlangan rasm: `<div className="mentor-ava"><img src={MENTOR_IMG} alt="" /></div>`; emoji 🧑‍🏫 eskirgan. | hamma | grep:MENTOR_IMG | DARS_ETALON.md:677 |
| DE-§11.1b | O'quvchi/profil qizcha rasmi `PHOTO_SET.profil = { img, round:true }`; barcha darsda mentor va qizcha bir xil. | hamma | grep:PHOTO_SET\.profil\|profil: \{ | DARS_ETALON.md:678 |
| DE-§11.2 | Natijadagi h1 qalin ko'rinsin: `.pv-h1 { font-weight: 700 }`. | tex | grep:\.pv-h1 | DARS_ETALON.md:679 |
| DE-§11.3 | `<p>` tavsifi «matn (paragraf)» deb yoziladi, «xatboshi» emas (≈DE-§1.2). | tex | grep:xatboshi | DARS_ETALON.md:680 |
| DE-§11.4 | Preview CSS'da bo'sh `<li>` nuqta bermasin: `li:empty{display:none}` (≈DE-§9.4h). | tex | grep:li:empty | DARS_ETALON.md:681 |
| DE-§11.5 | Preview'da havola yangi tabda ochiladi: `<base target="_blank">` va sandbox `allow-popups allow-popups-to-escape-sandbox`. | tex | grep:base target="_blank" | DARS_ETALON.md:682 |
| DE-§11.6 | Qizil/accent fon faqat xato-ogohlantirish uchun; xulosa, maslahat va «Sizning loyihangiz» bloklari yashil `frame-success`. | hamma | grep:frame-soft | DARS_ETALON.md:683 |
| DE-§11.7 | Ko'p qismli «bosib o'rgan» ekranda yo'riqnoma va jonli hisoblagich («👆 4 ta qismni bosing — 2/4»), bosilmaganlar `tap-hint` pulsatsiya, bosilganlar ✓. | tex | grep:tap-hint | DARS_ETALON.md:684 |
| DE-§11.8 | Testlardagi kod atamalari backtik bilan belgilanadi va `fmtCode()` orqali `.qcode` mono-chipga aylanadi; arena plitkasida `.qz-tile .qcode`. | tex | grep:fmtCode\|\.qcode | DARS_ETALON.md:685 |
| DE-§11.9 | Barcha praktika starteri (DEFAULT_FILES, STARTER_FINAL ham) faqat `<!-- Bu yerga yozing -->` va bo'sh qator (≈DE-§9.4f). | tex | grep:STARTER_ | DARS_ETALON.md:686 |
| DE-§11.10 | Preview'larda emoji-placeholder emas, `PHOTO_SET`dagi real rasm URL'lari ishlatiladi; kod namunasi rasm bilan mos bo'ladi. | tex | grep:PHOTO_SET | DARS_ETALON.md:687 |
| DE-§11.11 | Layout: `.stage { max-width: 1100px; height: calc(100dvh / var(--lz, 1)) }`, `padH = isMobile ? 12 : 60`, `.lesson-root`da `zoom: var(--lz, 1)`; 936px yoki boshqa kenglik rad etiladi. | hamma | grep:max-width: 1100px (936px chiqmasin) | DARS_ETALON.md:688 |
| DE-§11.11b | LiveGate `wrap`da `minHeight: 'calc(100dvh / var(--lz, 1))'` bo'lsin; lesson root'da `--lz` effekti bo'lsin. | hamma | grep:calc\(100dvh / var\(--lz | DARS_ETALON.md:688 |
| DE-§11.12 | Ekrandagi kod namunalarida class/id/o'zgaruvchi nomlari inglizcha bo'ladi (`class="card"`, `class="karta"` emas). | tex | grep:class="(karta\|sarlavha\|asosiy)" | DARS_ETALON.md:690 |
| DE-§11.13 | DevTools/terminal kabi vosita ekranida mashqdan keyin yashil «haqiqiy hayotda sinang» bloki turadi; Audio/Mentor matniga ham jumla qo'shiladi. | tex | ekran:yashil blok vosita ekranida | DARS_ETALON.md:691 |
| DE-§11.14 | Yangi darslarga onboarding (`TourGuide`) qo'shilmaydi (2026-07-10 qarori); auditor buni GAP deb belgilamaydi. | hamma | grep:TourGuide | DARS_ETALON.md:693 |
| DE-§11.14b | Mentor'da katta PIN (`LiveBigCode`) avtomatik ochilmaydi, faqat «📺 Ko'rsatish» tugmasi bilan (`bigOpen` boshlang'ich `false`; auto-open `useEffect` yo'q). | jonli | grep:bigOpen | DARS_ETALON.md:694 |
| DE-§11.15 | `.live-badge { opacity: 0.4 }` xira, `:hover/:focus-within` da `opacity: 1`; sensorli qurilmada `@media (hover:none) { opacity: 0.62 }`. | jonli | grep:\.live-badge | DARS_ETALON.md:695 |
| DE-§11.16 | Arenada o'quvchining o'z bali yashil (`#12A968`, `T.success`), qizil faqat xato javob uchun (`.qz-res.bad`, `.qz-tile.lose`). | jonli | grep:\.qz-brow\.me | DARS_ETALON.md:696 |
| DE-102 | Praktika-oyna ochilishi bilan `ccPractice:<lessonId>` = `{ kind, screen }` saqlanadi; yopilganda, tugaganda va `reset`da o'chiriladi (2026-08-01). | tex | grep:ccPractice: | DARS_ETALON.md:704 |
| DE-102a | Yozilgan kod `ccCode:<lessonId>:<kind>` = `{ codes, savedAt }` ga kompilyator ichida har 400 ms saqlanadi; har praktika o'z kaliti bilan. | tex | grep:ccCode: | DARS_ETALON.md:715 |
| DE-102b | Dars mount'ida `pracRead` o'qiladi va praktika qayta quriladi; `PRACTICE_AFTER[screen]` topilmasa saqlov jimgina tashlanadi. | tex | grep:pracRead\|pracWrite\|pracClear | DARS_ETALON.md:722 |
| DE-102c | `HtmlCompiler` kodni `storageKey` propi orqali faqat fayllar to'plami aynan mos kelganda tiklaydi. | tex | grep:storageKey=\{practice\.codeKey\} | DARS_ETALON.md:726 |
| DE-102d | `codes` boshlang'ich qiymatini ko'chirishda darsning o'z ifodasi saqlanadi (`CssLesson1`da `tr(f.starter)`); `f.starter` ga tekislanmaydi. | ru | grep:tr\(f\.starter\) | DARS_ETALON.md:730 |
| DE-102e | Har texnik darsning o'z ichki `HtmlCompiler` nusxasi bor; infra-manbani tuzatish tarqalmaydi, har fayl alohida tuzatiladi. | tex | grep:codesWrite | DARS_ETALON.md:737 |
| DE-102f | Tekshiruv: praktika ochiladi → kod yoziladi → `page.reload()` → oyna ochiq va kod joyida bo'lishi shart. | tex | ekran:reload'dan keyin praktika va kod saqlangan | DARS_ETALON.md:740 |
| DE-107 | Flashcard javobi o'lchami uzunlikka moslanadi: `t1` ≤8 belgi, `t2` ≤16, `t3` ≤32, `t4` >32 (`.fc-tag.t1…t4`) (F-0803-13/14). | hamma | grep:\.fc-tag\.t1 \{ | DARS_ETALON.md:742 |
| DE-107a | Monoshrift faqat lug'atdagi kalit so'z yoki kod-belgili yakka tokenga (`fcIsCode()`), gap `Manrope`da; gap ichidagi kalit so'zlar `.fc-kw`. | hamma | grep:fcIsCode\|\.fc-kw | DARS_ETALON.md:762 |
| DE-107b | Flashcard balandligi qat'iy qoladi (`height`, `min-height` emas), toshish 0 bo'lsin. | hamma | ekran:fc-card toshish 0 (1280 va 390 px) | DARS_ETALON.md:766 |
| DE-107c | `fcAnswer(` ishlatgan har faylda `const fcAnswer =` va `.fc-tag.t1 {` e'loni bor; eski `<span className="fc-tag">` qoldig'i 0. | hamma | grep:<span className="fc-tag"> | DARS_ETALON.md:770 |
| DE-107d | Matn uzunligi o'zgaruvchan bo'lsa, o'lcham ham o'zgaruvchan bo'lishi shart (bitta namunaviy holatga qarab tanlanmaydi). | hamma | ko'z | DARS_ETALON.md:780 |
| DE-108 | Bir dars — bitta misol-ip: barcha asosiy ekranlar bitta misol-olamda, yangi tushuncha ipning kengayishi bilan ochiladi (F-0803-19). | hamma | ko'z | DARS_ETALON.md:786 |
| DE-108a | Ikkinchi misolga faqat qisqa mashq/test bandida ruxsat, u ham o'quvchi tanigan olamdan (95-qonun). | hamma | ko'z | DARS_ETALON.md:792 |
| DE-108b | Misol-ip foydalanuvchi bilan kelishiladi (lavash ipi rad etilgan; JS darslarida o'yin olami: ball, jon, zarar, krit). | tex | ko'z | DARS_ETALON.md:794 |
| DE-109 | TMI taqiqi: keraksiz matn UI'ni to'ldirib tushunishga to'sqinlik qilmasin (F-0803-20). | hamma | ko'z | DARS_ETALON.md:783 |
| DE-108c | Misol-ip tekshiruvi: asosiy tushuntirish ekranlarida bitta nom-oila bo'ladi; eski ip qoldig'i (`salomBer`, `kvadrat`, `narxHisobla`, `qoshish`, `ayir`) 0. | tex | grep:salomBer\|kvadrat\|narxHisobla\|qoshish\|ayir | DARS_ETALON.md:801 |
| DE-108d | Istisno: shart darsida (if/else, m2-04) har bosqich o'z hayotiy misoli bilan ochiladi va o'sha ekranda yakunlanadi; ko'priklar qoladi, istisno boshqa darslarga tarqalmaydi (F-0914-01). | tex | ko'z | DARS_ETALON.md:803 |
| DE-109a | Ekran matni maqsaddan katta bo'lmasin: tushuntirish ekrani ~600 belgidan, hook ~500 belgidan oshmasin (oshsa auditor GAPga yozadi). | hamma | ekran:`.screen` matn uzunligi (tools/tmi-shot.mjs) | DARS_ETALON.md:817 |
| DE-109b | Dekorativ blok (ko'prik, qo'shimcha eslatma, kelajak-reklama) mashq g'alabasi yoniga qo'yilmaydi; g'alaba lahzasi yakka turadi (F-0803-11/12). | hamma | ko'z | DARS_ETALON.md:819 |
| DE-109c | «Bir ekran — bir ish» (92-qonun) bilan juft: matn ham bir ish atrofida bo'lsin (≈DE-92). | hamma | ko'z | DARS_ETALON.md:820 |
| DE-109d | Sarlavhada faqat harakat qoladi; kontekst-gap Mentor qatoriga ko'chadi (TMI ov-ro'yxati 1, F-0803-25). | hamma | ko'z | DARS_ETALON.md:824 |
| DE-109e | Bir g'oya sarlavha, mentor va mono-qatorda uch marta takrorlanmaydi; maksimum 2 marta (TMI ov-ro'yxati 2). | hamma | ko'z | DARS_ETALON.md:827 |
| DE-109f | Hech narsaga bog'lanmagan qat'iy qiymatli indikator/`Uline` bezak sanaladi va o'chiriladi; vizual faqat o'zgaradigan holatni ko'rsatadi. | hamma | ko'z | DARS_ETALON.md:829 |
| DE-109g | Ikkita yopilish matni ketma-ket (masalan `ks-hook` + `frame-success`) bo'lmaydi; bittasi qoladi. | hamma | ko'z | DARS_ETALON.md:832 |
| DE-109h | Bir ekranda ikki topshiriq bo'lmaydi: ikkinchisi shartli ochiladi yoki alohida ekranga o'tkaziladi. | hamma | ko'z | DARS_ETALON.md:833 |
| DE-109i | Keys/hikoya slaydlarida ball bermaydigan taxmin savoli maksimum 1 ta. | PM | ko'z | DARS_ETALON.md:836 |
| DE-109j | Dars ekranlari ≤354 belgi bo'lsin (yakun sahifasi istisno, 618). | hamma | ekran:`.screen` matn uzunligi ≤354 | DARS_ETALON.md:837 |
| DE-110 | Har `done`-shartli interaktiv ekranda har bosishga ko'rinadigan reaksiya bo'ladi; takror natijada ham xabar qayta jonlanadi (`key={submitCounter}`) (F-0803-25). | tex | grep:key=\{submitCounter\} | DARS_ETALON.md:846 |
| DE-110a | Matn-maydonda Enter yuboradi: input bor joyda `onKeyDown Enter → submit` shart. | tex | grep:onKeyDown.*Enter | DARS_ETALON.md:850 |
| DE-110b | Ko'p qadamli darvozada qolgan qadam nomma-nom aytiladi: nav-tugma yorlig'ida («Endi bo'sh holda yuboring») va ekran ichida bitta yo'l-ko'rsatma qatorida. | tex | ekran:nav-tugma yorlig'i qolgan qadamni aytadi | DARS_ETALON.md:853 |
| DE-110c | Tekshiruv: darvozali ekranda har tugma 2 marta ketma-ket bosiladi — ikkinchisida ham reaksiya; inputda Enter submit qiladi. | tex | ekran:2 marta bosish reaksiyasi, Enter submit | DARS_ETALON.md:859 |
| DE-110B | Ko'rinish tekshiruvi ochilgan holatda emas, bosilgandan keyin qilinadi: dars 0-ekrandan oxirigacha haqiqiy bosishlar bilan o'tkaziladi (F-0803-26). | tex | ekran:har bosishdan oldin element `bottom` ≤ `.stage-content` `bottom` | DARS_ETALON.md:861 |
| DE-110Ba | O'lchov `window.innerHeight` ga emas, `.stage-content` chetiga qarab qilinadi (nav-paneli pastdan ~70px yeydi). | tex | ekran:`getBoundingClientRect().bottom` taqqoslash | DARS_ETALON.md:871 |
| DE-110Bb | Joy yetmasa tartib: avval takroriy matnni kes, keyin ikki blokni yonma-yon qo'y, ro'yxatni 2 ustunga bo'l, oxirida shrift/padding. | tex | ko'z | DARS_ETALON.md:874 |
| DE-113 | Taklif ro'yxati ko'rsatgan narsani to'liq qo'yadi (`<h1>` ko'rsatsa `<h1>` tushadi); yarim qo'yish taqiq (F-0809-01). | tex | ekran:taklifni bosib sinash: matn, tushgan matn, kursor | DARS_ETALON.md:878 |
| DE-113a | Taklif faqat to'g'ri sintaksisdan boshlanmaydi: qatorda yolg'iz turgan `h1` ham ro'yxatni ochadi, lekin kursor matn tegi ichida bo'lsa ochilmaydi. | tex | ekran:yolg'iz `h1` yozilganda taklif ochiladi | DARS_ETALON.md:888 |
| DE-113b | Taklif ro'yxatida bosish = Enter; Tab qo'shimcha yo'l, Esc yopadi, Shift+Enter chiqadi (F-0809-02). | tex | ekran:Enter va sichqoncha bir xil tanlaydi | DARS_ETALON.md:894 |
| DE-113c | Esc bilan yopilgan ro'yxat qayta ochilish sharti aniq bo'lsin; o'lchov tahrir raqami (matnni eslash emas). | tex | ekran:Esc'dan keyin tahrir qilinsa qayta ochiladi | DARS_ETALON.md:897 |
| DE-113d | Taklif ro'yxati kesilmaydi (`slice(0,8)` yo'q), quti ichida suriladi, tanlangan qator ko'rinadi; `scrollIntoView` emas, qo'lda `scrollTop`. | tex | grep:slice\(0, ?8\)\|scrollIntoView | DARS_ETALON.md:902 |
| DE-114 | O'quvchi ishini yo'q qiladigan tugma ikki qadamli bo'ladi va qaytarish yo'li qoldiradi (F-0809-03). | tex | ekran:1-bosish «⚠ Rostdanmi?», 2-bosish tozalaydi | DARS_ETALON.md:907 |
| DE-114a | Naqsh: 1-bosish qizarib «⚠ Rostdanmi?» (4 s so'nadi), 2-bosishda eski holat `ref`ga nusxalanadi, 8 soniya «↶ Qaytarish» turadi; `Ctrl+Z` ga tayanilmaydi. | tex | grep:Rostdanmi | DARS_ETALON.md:913 |
| DE-114b | Yorliq qisqa («Rostdanmi?») qoladi, tushuntirish holat-matnida; aks holda pastki panel kengligi sakraydi. | tex | ekran:pastki panel kengligi sakramaydi | DARS_ETALON.md:917 |
| DE-115 | «Davom etish» yopiq bo'lsa, sababi ekranda ko'rinadi; tugmani bloklayotgan xatoni yashiruvchi qoida bekor (F-0809-03). | tex | ekran:o'chiq tugma sababi ko'rinadi | DARS_ETALON.md:920 |
| DE-115a | Uch joy birga to'g'rilanadi: xato yozuvi ko'rsatiladi, holat-matni haqiqatni aytadi, o'chiq tugma `title`ida sabab yoziladi. | tex | grep:disabled.*title= | DARS_ETALON.md:926 |
| DE-116 | JS fayli bor darsda preview qo'lda yangilanadi (`▶ Ishga tushirish`); kod o'zgarsa nishon «eskirdi · ▶ bosing»ga o'tadi (F-0809-03). | tex | grep:Ishga tushirish | DARS_ETALON.md:930 |
| DE-116a | JS darsida preview birinchi ochilishda bir marta o'zi yuriladi; shart-belgilari (✓) alohida yashirin iframe'da jonli qoladi. | tex | ekran:birinchi ochilishda preview bo'sh emas | DARS_ETALON.md:936 |
| DE-117 | «To'g'ri qildim, nega buzuq?» holati tug'ilmasin: shart yashil bo'lsa ekranda buzuq narsa ko'rinmasin (F-0809-03). | tex | ekran:siniq rasm belgisi yo'q | DARS_ETALON.md:940 |
| DE-117a | Yuklanmagan rasm uchun o'rin-egallovchi punktir quti: 🖼 + `alt` matni + «rasm topilmadi — `src` ni tekshiring». | tex | ekran:siniq rasm o'rniga punktir quti | DARS_ETALON.md:945 |
| DE-117b | O'rin-egallovchi element asl tegni DOM'dan o'chirmaydi (yashiradi) va faqat ko'rinadigan preview'ga qo'yiladi, tekshiruv-hujjatiga emas. | tex | ko'z | DARS_ETALON.md:947 |
| DE-118 | Umumiy modulga ko'chirishdan oldin modul superset bo'ladi: har nusxaning umumiy moduldan farqi o'qilib, yetishmagani kiritiladi (F-0809-04). | tex | ko'z | DARS_ETALON.md:951 |
| DE-118a | Superset darvozasi: ko'chirishdan oldin va keyin skan; nusxada bor, modulda yo'q qatorlar eski avlod kodi ekani isbotlanadi. | tex | ko'z | DARS_ETALON.md:960 |
| DE-118b | Skan har fayl uchun qayta yuritiladi; vizual xossa ko'chirilsa sinov `getComputedStyle` (fon, matn rangi) o'lchaydi, element sonini emas (F-0809-05). | tex | ekran:`getComputedStyle` fon va matn rangi | DARS_ETALON.md:962 |
| DE-119 | Ko'chirishdan oldin «bu blok dars-faylining qaysi global holatini o'qiydi?» deb so'raladi; modul-o'zgaruvchi (`__lang`) bog'liqligi uzilmasin (F-0809-04). | tex | ko'z | DARS_ETALON.md:969 |
| DE-119a | Holat prop sifatida uzatiladi: chaqiruv joylarida `lang={__lang}`; mahalliy `lang` o'zgaruvchisiga tayanilmaydi. | ru | grep:lang=\{__lang\} | DARS_ETALON.md:974 |
| DE-119b | Ko'chirish yakunida grep-darvoza: chaqiruv bor har joyda prop borligi sanab tekshiriladi. | tex | grep:lang=\{__lang\} | DARS_ETALON.md:977 |
| DE-120 | Ko'p faylli ko'chirish skripti shubhada faylga tegmasdan to'xtaydi; avval quruq yugurish, keyin bitta pilot, so'ng qolganlari (F-0809-04). | tex | ko'z | DARS_ETALON.md:979 |
| DE-120a | Skript chegarani `line === '}'` bilan topmaydi: CRLF faylda `'}\r'` bo'ladi. | tex | grep:=== '\}' | DARS_ETALON.md:986 |
| DE-121 | Solishtiruv raqami (qator soni, vaqt, qadam) bitta konstantadan hisoblanadi (`CARD_LINES`), ikkala ekranda bir xil formula bilan (F-0819-11). | tex | grep:n \* \|2 \+ n | DARS_ETALON.md:989 |
| DE-122 | Ekranda ko'rsatilgan raqam tekshirilsin: kod ixcham ko'rsatilsa, yashirin qism izohda oshkor aytiladi («yana 18 qator») (F-0819-11). | tex | grep:yana \d+ qator | DARS_ETALON.md:1000 |
| DE-123 | Kod va natija yonma-yon ekranda natija kengroq (45% kod / 55% natija, `.split-4555`) (F-0819-08/09). | tex | grep:split-4555 | DARS_ETALON.md:1010 |
| DE-123a | Natija to'ri maksimal element sonida to'liq to'ldiriladi (teshik qolmaydi; 3 ustun + 6 karta). | tex | ekran:oxirgi qator to'liq (1280 va 390 px) | DARS_ETALON.md:1015 |
| DE-123b | Kichraytiriladigan o'lchamlar klassda yashaydi (`.vcard-name`, `.vthumb-em`); inline `style` faqat dinamik qiymat uchun, aks holda modifikator klass uni bosa olmaydi. | tex | grep:style=\{\{ fontSize | DARS_ETALON.md:1019 |
| DE-124 | Muammodan keyingi tanishtiruv ekrani «kim yaratgan» emas, «qanday hal qiladi» deb so'raydi; vazifasi ko'prik qurish, tarix bermaslik (F-0819-13). | tex | grep:KIM hal qilgan | DARS_ETALON.md:1024 |
| DE-124a | Ta'rifda avval nima uchun kerakligi, keyin atama yoziladi («saytni tayyor bo'laklardan qurishga yordam beradigan kutubxona»). | tex | ko'z | DARS_ETALON.md:1033 |
| DE-124b | Tarix o'chirilmaydi, majburiy Mentor-matnidan ixtiyoriy, bosib ochiladigan kartochka ichiga tushiriladi. | tex | ko'z | DARS_ETALON.md:1038 |
| DE-125 | Tushuntirish ekranidan atama yoki fakt olishdan oldin `grep -n "<atama>"` bilan test, flashcard, `QUIZ_BANK`, yakun va RECAPSdagi bog'liqlik tasniflanadi (F-0819-13). | tex | grep:<atama> (test, flashcard, QUIZ_BANK, yakun) | DARS_ETALON.md:1041 |
| DE-125a | Faktni butunlay olib tashlash qimmat yo'l: unga bog'liq har savol ham o'chadi va arena 3/3/3/3 balansi uchun yangisi yoziladi. | jonli | ko'z | DARS_ETALON.md:1053 |
| DE-126 | «Bosib toping» ekranida o'quvchi birinchi soniyada nimani, qayerdan va nechtasini izlashini biladi (F-0819-15). | tex | ekran:topish ekrani sanoq va halqa | DARS_ETALON.md:1056 |
| DE-126a | Bosiladigan zona bosilmaguncha tinmay chorlovchi halqa bilan yonadi: tinch holatda ≥0.28, cho'qqida ≥0.6 va ≥3px. | tex | ekran:halqa alfa ≥0.28 / 0.6, ≥3px | DARS_ETALON.md:1061 |
| DE-126b | Hover-yorlig'i: `content: '✨ ' attr(data-hint)`, matn `data-hint`da; ichma-ich zonada faqat ichkarisi `:hover:not(:has(.zone:hover))`. | tex | grep:attr\(data-hint\) | DARS_ETALON.md:1064 |
| DE-126c | Bo'sh holat sanoq beradi: «Chapdagi sahifada 4 ta komponent yashiringan. Bosib toping.»; «bir qismni bosing» emas. | tex | ko'z | DARS_ETALON.md:1068 |
| DE-126d | `prefers-reduced-motion`da halqa yonmaydi, lekin statik ko'rinib turadi (affordans o'chmaydi). | tex | grep:prefers-reduced-motion | DARS_ETALON.md:1072 |
| DE-126e | Hisoblagich va tugma yorlig'ida o'rgatilayotgan atama ishlatiladi («2/4 komponent topildi»). | tex | ko'z | DARS_ETALON.md:1074 |
| DE-127 | Vizual metaforadagi har detal ma'no tashiydi; ma'nosiz detal shovqin sanaladi va o'chiriladi (F-0819-42). | tex | ko'z | DARS_ETALON.md:1079 |
| DE-127a | Taqiq: ko'zlar/yuz, boltlar/vintlar/panel-chiziqlari, ma'nosiz indikator chiroqlari, sababsiz uzuq chiziqlar, to'ldiruvchi shakllar (`▢ ▢`, `···`). | tex | grep:cf-bolts\|cf-gears\|▢ ▢ | DARS_ETALON.md:1085 |
| DE-127b | Uzuq chiziq faqat bo'sh joy, joylash zonasi va to'ldiriladigan maydon uchun (16-qonun). | tex | ko'z | DARS_ETALON.md:1090 |
| DE-127c | Tekshirish savoli: har elementga «bu nimani bildiradi?»; bir jumlada aytilmasa element o'chadi. | tex | ko'z | DARS_ETALON.md:1094 |
| DE-127d | Oqim-diagrammasi o'qiladigan bo'ladi: vertikal, har qadamda real kod, bitta o'q (`name="..."` ↓ `props` ↓ `{props.name}` ↓ natija); 3 soniyada o'qiladi. | tex | ekran:oqim 3 soniyada o'qiladi | DARS_ETALON.md:1097 |
| DE-127e | Oqim ranglari: KIRISH amber (`#FBF0DC`/`#DFB068`/`#7A5510`), NATIJA ko'k (`#EDF1FC`/`#A7B9E8`/`#33478A`); qizil ishlatilmaydi. | tex | ekran:oqim diagramma ranglari | DARS_ETALON.md:1105 |
| DE-127f | Bezak olib tashlanganda metafora o'lmaydi: qurilma bir necha ekranda bitta hikoya bo'lib qoladi, faqat ma'nosiz qismlar o'chadi. | tex | ko'z | DARS_ETALON.md:1113 |
| DE-127g | «Ishlayapti» signali bittadan ortiq bo'lmasin (puls, g'ildirak, `✦ ✦ ✦`, yorishgan lab — bittasi qoladi). | tex | ko'z | DARS_ETALON.md:1127 |
| DE-127h | Bezak olingach qolgan tuzilma o'lchamlari qayta hisoblanadi (`min-height` + markazlash), aks holda metafora yassilanadi. | tex | ekran:qurilma nisbati | DARS_ETALON.md:1133 |
| DE-127i | Quyuq panel ichida kartalarni faqat chegara ushlaydi; yuza ajratuvchisi kontrasti o'lchanadi, kerak bo'lsa panel yorug'ga o'tadi (F-0820-76). | tex | ekran:yuza kontrasti (portal fon/idish ≥1.14, chegara ≥1.35) | DARS_ETALON.md:1139 |
| DE-127j | Quyuq yuza ma'no tashisa qoladi (`.warp-flash` — to'liq qayta yuklanish); boshqa joyda metafora yorug' palitrada (`T.paper`, `T.bg`, `T.line`). | tex | ko'z | DARS_ETALON.md:1147 |
| DE-127k | Yorug' fonda porlash porlaydigan elementning o'zi to'yingan bo'lishi bilan hosil bo'ladi; oq radial o'rniga rangli halqa. | tex | ko'z | DARS_ETALON.md:1153 |
| DE-127l | Yorug'ga o'tkazilganda kichik kegldagi matn kontrasti qayta o'lchanadi: ma'noli kichik matn `T.ink2` (6.23), `T.ink3` (2.22) emas. | tex | ekran:kichik matn kontrasti ≥4.5 | DARS_ETALON.md:1158 |
| DE-128 | «Olib kelish» (GET) va «yuborish» (POST/PUT/DELETE) darslari ikki xil obrazda: ofitsiant va jo'natma (F-0820-71). | tex | ko'z | DARS_ETALON.md:1167 |
| DE-128a | Har dars o'z obrazida toza turadi: GET darsida `posilka/yorliq/yuk` va aksincha qolmaydi (ko'rinadigan matn bo'yicha, CSS klass nomi emas). | tex | grep:posilka\|ofitsiant | DARS_ETALON.md:1184 |
| DE-128b | Obraz almashadigan darsning reja-ekrani va birinchi tushuncha ekranida ko'prik-gap majburiy («O'tgan darsda... bugun teskarisi»). | tex | ko'z | DARS_ETALON.md:1192 |
| DE-128c | Yangi dars o'tgan darsni eslatganda o'sha darsning haqiqiy obrazini aytadi; yo'q obrazga havola qilinmaydi. | tex | ko'z | DARS_ETALON.md:1197 |
| DE-127x1 | 127-qonun istisnosi: quyuq yuza darsda bitta joyda (bir martalik) chiqadi; takrorlansa u cho'qqi emas, uslub (F-0820-78). | tex | grep:data-dark-ok | DARS_ETALON.md:1206 |
| DE-127x2 | Quyuq yuza rangining o'zi xabar bo'ladi; «chiroyli» yoki «atmosfera» yetarli asos emas. | tex | ko'z | DARS_ETALON.md:1216 |
| DE-127x3 | Quyuq cho'qqi faqat krem fon ustida ishlaydi; butun ekran quyuq bo'lmaydi. | tex | ekran:quyuq yuza atrofi yorug' | DARS_ETALON.md:1217 |
| DE-127x4 | Quyuq istisno elementning o'zida e'lon qilinadi: `data-dark-ok="ma'no-cho'qqisi"`; hex-oq ro'yxat (`SEMANTIC`ga) ishlatilmaydi. | tex | grep:data-dark-ok="ma'no-cho'qqisi" | DARS_ETALON.md:1221 |
| DE-112 | `<p className="xyz">` da bitta klassli `padding`/`margin` reset (0,1,1) dan kuchsiz; selektor `.xyz.xyz { … }` ga kuchaytiriladi (F-0803-27). | hamma | grep:npm run lint:jsx (5-tekshiruv) | DARS_ETALON.md:1235 |
| DE-112a | Margin topilmasi bo'lsa avval ota-konteyner tekshiriladi: `display:flex` + `gap` bo'lsa margin tiklanmaydi (F-0803-29). | hamma | ko'z | DARS_ETALON.md:1273 |
| DE-112b | Resetni `:where(.lesson-root) p` ga o'tkazish rad etilgan; `lint:jsx` faqat `padding`ni tekshiradi. | hamma | grep:where\(\.lesson-root\) | DARS_ETALON.md:1278 |
| DE-112c | CSS `<style>{LESSON_CSS}</style>` shaklida alohida o'zgaruvchida bo'lsa ham darvoza o'qiydi; e'lon oxiri `` `; `` bilan anchorlanadi (F-0803-29). | hamma | grep:LESSON_CSS | DARS_ETALON.md:1284 |
| DE-111 | Har ekran topshirilishidan oldin 7–10 soniyalik testdan o'tadi: nima qilishim kerak, qayerga bosaman, nimani o'rgatyapti (F-0803-28). | hamma | ekran:7–10 soniya testi (bosilgandan keyin ham) | DARS_ETALON.md:1304 |
| DE-111a | Uch savoldan biri 7–10 soniyada tushunilmasa ekran topshirilmaydi; tuzatish tartibi 109-qonun ov-ro'yxati bo'yicha. | hamma | ko'z | DARS_ETALON.md:1311 |
| DE-111b | Bo'sh joy so'z bilan to'ldirilmaydi: matn bo'lagi vazifani aytadi, yangi ma'no beradi yoki javobga yo'l ochadi, bo'lmasa o'chiriladi. | hamma | ko'z | DARS_ETALON.md:1316 |
| DE-111c | Bo'sh joy layout bilan hal qilinadi (blokni markazga/yuqoriga tortish), «Bu juda muhim», «Yaxshi ish!» kabi ma'nosiz gap bilan emas. | hamma | grep:Bu juda muhim\|Yaxshi ish! | DARS_ETALON.md:1322 |
| DE-111d | Har karta/blok olib tashlanishidan oldin «Bu bo'lmasa, o'quvchi ma'noni tushunmay qoladimi?» deb so'raladi: HA qoladi, YO'Q olib tashlanadi. | hamma | ko'z | DARS_ETALON.md:1327 |
| DE-111e | Shubha bo'lsa blok olib tashlanadi; savol butun blokka beriladi, qolgan blokning ichidagi matnga 109-qonun qo'llanadi. | hamma | ko'z | DARS_ETALON.md:1332 |
| DE-111f | Auditor GAP-hisobotida har olib tashlangan blok uchun bitta qator: nima olindi → javob YO'Q edi. | hamma | ko'z | DARS_ETALON.md:1337 |
| DE-111g | Auditor har ekran uchun 7–10 soniya hukmini beradi; yiqilgan ekran bo'lsa qabulchi QAYTARISH hukmini beradi. | hamma | ko'z | DARS_ETALON.md:1347 |
| DE-§12a | Gate-vidjet (majburiy drag-drop) 1280×720 va 1280×648 da `getBoundingClientRect().bottom <= innerHeight` bo'lsin; mavjud ustunni almashtirsin yoki yuqorida tursin (F-0803-19). | tex | ekran:vidjet bottom ≤ innerHeight (1280×720, 1280×648) | DARS_ETALON.md:1355 |
| DE-§12b | Bitta elementda bitta `animation` yozuvchi klass bo'lsin (`.fade-up` + `.tap-hint-card` shorthand'i bir-birini yengadi); ikkalasi kerak bo'lsa o'rovchi `<div>` yoki juft e'lon (F-0803-22). | tex | ekran:1.5 s dan keyin `getComputedStyle(el).opacity > 0.9` | DARS_ETALON.md:1356 |
| DE-§12b2 | Inline `animationDelay` ikkala animatsiyaga birdan tushadi: kechikish `--fd` tokeni orqali beriladi; `prefers-reduced-motion` bloki keyingi e'londan keyin turishi yoki `!important` bo'lishi kerak. | tex | grep:animationDelay | DARS_ETALON.md:1356 |
| DE-§12c | Gate-mezoni ipucha aytgan yechimni rad etmasin: ipuchani so'zma-so'z bajarib sinaladi; mezon shaklga emas ma'noga bog'lanadi (F-0803-22). | tex | ekran:ipucha yechimi darvozadan o'tadi | DARS_ETALON.md:1357 |
| DE-§12d | CSS izohlarida va `<style>` shablon-satri ichida backtik ishlatilmaydi; diagnostika esbuildning birinchi xatosi bo'yicha (2026-07-28, F-0802-15). | hamma | grep:npm run lint:jsx | DARS_ETALON.md:1358 |
| DE-§12e | Bir-qatorli funksiya ichiga `//` izoh qo'yilmaydi: izoh qatordan oldin alohida turadi yoki `/* … */` ishlatiladi (F-0802-14). | hamma | grep:npm run lint:jsx | DARS_ETALON.md:1359 |
| DE-§12f | `<li/>` bo'sh element ortiqcha nuqta bermasin; preview'da havola oq oyna bermasin (≈DE-§11.4, DE-§11.5). | tex | grep:li:empty | DARS_ETALON.md:1362 |
| DE-§12g | Tugma nomi o'zgarganda tugma, mentor matni va audio matni birga yangilanadi; qidiruv barcha yozilish variantlari bo'yicha (≈DE-§1.4). | hamma | grep:Ishga tushir\b | DARS_ETALON.md:1368 |
| DE-§12h | Kutish matni «sir»-uslubda yozilmaydi; apostrof tuzatishda single-quoted JS stringda `\'` escape yoki qo'shtirnoq ishlatiladi (≈DE-§1.7). | hamma | grep:hozircha sir\|🤫 | DARS_ETALON.md:1369 |
| DE-§12i | Kompilyator tab-qaytishda yopilmasligi uchun `ccPractice:` va `ccCode:` saqlovi bo'lishi shart (≈DE-102). | tex | grep:ccPractice:\|ccCode: | DARS_ETALON.md:1371 |
| DE-§13a | Etalon-darslar: `Htmllesson1`, `Htmllesson2`, `CssLesson1`; qolgan darslar shu uchtasining ko'rinishiga o'tkaziladi. | tex | ko'z | DARS_ETALON.md:1377 |
| DE-§13b | Ko'chiriladigan qatlamlar: CodeStrike arenasi, flashcard, badges, `fmtCode`, praktika qatlami, DragDrop/Debug, QUIZ_BANK 3/3/3/3, til tozalash, RECAPS. | tex | ko'z | DARS_ETALON.md:1386 |
| DE-§13c | Apostrof tuzatishda single-quoted JS stringda oddiy `'` bilan almashtirib bo'lmaydi: `\'` escape ishlatiladi (15-G). | hamma | grep:[‘’ʻ] | DARS_ETALON.md:1404 |
| DE-§13d | Dars bitta fayl-sessiya qadamida ko'chiriladi, tartib modul oqimi bo'yicha (CssLesson2 → GitLesson → DeployLesson → …). | tex | ko'z | DARS_ETALON.md:1409 |
| DE-§13e | Har dars ko'chirishida 15-C, 15-D, 15-G retsepti, RECAPS (bo'sh bo'lsa), 8.2, 8.3, 9.3, 10, 11.12, 11.15 qamrab olinadi va oxirida 14-checklist to'liq yuritiladi. | tex | ko'z | DARS_ETALON.md:1413 |
| DE-§14a | Har dars 14-bo'limdagi tekshiruv ro'yxati bo'yicha to'liq yuritiladi: TIL, JONLI/BALL, INTERAKTIV/DIZAYN, PRAKTIKA-DARVOZASI VA MENTOR EKRANI, YAKUNIY. | hamma | ko'z | DARS_ETALON.md:1421 |
| DE-§14b | Yakuniy band: build toza (`npx esbuild <fayl> --outfile=<scratch>`) va jonli sinov (yangi PIN, 2 o'quvchi, podium/arena ballari 0 emas) (≈DE-§0.2, DE-§0.3). | jonli | grep:npm run gates | DARS_ETALON.md:1493 |
| DE-§14c | Summary tekshiruvi: ScoreRing + CodeStrike CTA + RECAP/Uyga vazifa + 🏅 kolleksiya; glossary yo'q (F-0916-02). | hamma | grep:GLOSSARY | DARS_ETALON.md:1439 |
| DE-§14d | Arena tekshiruvi: 12 savol, har biriga 15 s (`QUIZ_MS = 15000`, 20000 emas); `QZ_BG_SHAPES` mavzuga mos (≈DE-§8.1c). | jonli | grep:QUIZ_MS = 15000 | DARS_ETALON.md:1448 |
| DE-§14e | 11.14 onboarding yoqilgan darsda `data-tour` va katta PIN faqat «Ko'rsatish» bilan; yangi darslarga qo'shilmaydi (⚠ZID:DE-§11.14 — 14-bo'limda majburiy ro'yxatda turibdi). | hamma | grep:data-tour | DARS_ETALON.md:1485 |
| DE-§15A | `set_quiz_keys` tuzatishi 2 edit: `useLiveSession(lessonId, answerKey)` + `keyRef` qatori va `liveStore` dan keyin `liveRpc('set_quiz_keys' ...)` (≈DE-§2.1, DE-§2.2). | jonli | grep:keyRef\.current = answerKey | DARS_ETALON.md:1503 |
| DE-§15B | `MentorTestStats` sanog'i `a.picked === correctIdx` bilan almashtiriladi (≈DE-§6). | jonli | grep:a\.picked === correctIdx | DARS_ETALON.md:1512 |
| DE-§15C | Interaktiv qatlam `Htmllesson1.jsx` dan ko'chiriladi (kod nomlari o'zgarmaydi); `qz-`/`dd-`/`dbg-`/`fc-`/`ach-`/`mp-` CSS bilan; kontent darsga moslanadi. | tex | grep:\.qz-\|\.dd-\|\.dbg-\|\.fc-\|\.mp- | DARS_ETALON.md:1517 |
| DE-§15D | `fmtCode` helper `` ` `` bilan belgilangan atamalarni `<code className="qcode">` ga aylantiradi; `.qcode` mono-chip CSS bilan; variant, izoh, «To'g'ri javob» satri va arena savoli/plitkasi shu orqali o'raladi. | tex | grep:const fmtCode | DARS_ETALON.md:1523 |
| DE-§15E | `optionalLive` faqat animatsiya ekraniga qo'yiladi, testlarga qo'yilmaydi (≈DE-§5.5a). | jonli | grep:optionalLive | DARS_ETALON.md:1541 |
| DE-§15F | Layout ko'chirish 4 edit: `--lz` effekti (`Math.min(1.5, Math.max(1, innerWidth / 1920))`), `.lesson-root` zoom/height, `.stage` 1100px, `padH = isMobile ? 12 : 60` (≈DE-§11.11). | hamma | grep:window\.innerWidth / 1920 | DARS_ETALON.md:1545 |
| DE-§15F2 | `HtmlCompiler` overlay (`.hc-root`, `position:fixed`) `.lesson-root`dan tashqarida; unga zoom ta'sir qilmaydi va tegilmaydi. | tex | ko'z | DARS_ETALON.md:1560 |
| DE-§15G | Til tozalash tartibi: avval «sir» matni, keyin sansirash (har biri `assert count==1`), eng oxirida qiyshiq apostroflar `\'` escape bilan. | hamma | grep:[‘’ʻ] | DARS_ETALON.md:1564 |
| DE-§15G2 | Til tozalashdan keyin esbuild toza va `grep -n "[‘’ʻ]"` bo'sh; JSX matn (string emas) ichida `\'` qolmaydi, u yerda oddiy `'` kerak. | hamma | grep:\\' | DARS_ETALON.md:1574 |
| DE-§15H | Yangi UI qatlamlari (bayram `AchCelebrate`/`AchToasts`, `TourGuide`, `.live-badge`, arena yashil `.me`) L1'dan ko'chiriladi; eski `.ach-toast*` CSS o'chadi. | tex | grep:\.ach-toast | DARS_ETALON.md:1580 |
| DE-§15H2 | `className="live-badge"` barcha `_liveBadgeS` badge holatlariga qo'shiladi (≈DE-§11.15). | jonli | grep:_liveBadgeS | DARS_ETALON.md:1586 |
| DE-§15I | L1 manba xaritasida qator raqamlariga tayanilmaydi; har doim grep-anchor (identifikator/CSS-marker) bilan topiladi. | tex | grep:grep -n "<anchor>" | DARS_ETALON.md:1595 |
