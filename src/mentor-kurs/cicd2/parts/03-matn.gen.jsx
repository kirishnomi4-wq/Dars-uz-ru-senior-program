
// ============================================================
//  CI/CD-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd2-matn.py (manba: 24-CICD2-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · CI/CD",
  "title": "Lenta bor va yashil. Bugun uning ichiga kiramiz: log, cache, matrix, Postgres bilan smoke, secret va pull request — hammasi haqiqiy run'larda",
  "seg": [
   [
    "a",
    "CI/CD-1 da lenta yozdingiz — bugun <b>Actions'ning ichiga</b> kiramiz, hammasi haqiqiy run'larda",
    "Assalomu alaykum. Oldingi darsda OrderBotNest'ga lenta yozdingiz: har push'da to'rt qadam. Bugun shu lentaning ichiga kiramiz. Ekranda dars oxiridagi natija: ikkita job, test va smoke, smoke haqiqiy Postgres bilan, ikkalasi yashil."
   ],
   [
    "b",
    "Avval <b>umumiy tushuncha</b>: run, job, step va GitHub o'zi qo'shadigan qadamlar",
    "Avval umumiy tushuncha: Actions nima qiladi, run, job va step nima, GitHub o'zi qaysi qadamlarni qo'shadi va uses ichida nima bo'ladi. Keyin qizil run'ni to'g'ri o'qishni va cache nima qilishini ko'rasiz."
   ],
   [
    "c",
    "Keyin <b>matrix, Postgres xizmati bilan smoke, secret va pull request</b>",
    "Uchinchi bosqichda matrix: bitta fayl, ikki Node. To'rtinchisida bazali tekshiruvni lentaga qo'yamiz: Postgres xizmati va smoke. Secret nima va nomi xato bo'lsa nima bo'ladi. Beshinchisida pull request va AI yozgan workflow'lar. Oxirida sinfga tayyorgarlik."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot — <b>o'z GitHub reponingizda</b>; har run haqiqiy",
    "Dars olti bosqich, uchta amaliyot, hammasi CI/CD-1 dagi o'z reponingizda. Ekrandagi har run haqiqiy: OrderBotNest'da shu kuni yurgizilgan, qadam va soniyalari o'sha. Shoshilmang, har ekranni boshidan eshitish mumkin. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "Har push — run; faylda jobs: ostidagi har nom — alohida mashinada bitta job; job ichida qadamlar; uchtasini GitHub o'zi qo'shadi",
  "seg": [
   [
    "a",
    "Run — bitta push; <b>job — faylda <code>jobs:</code> ostidagi har nom</b>, har biri alohida mashinada",
    "Actions'ni boshidan tushunib olaylik. Har push bitta run. Faylda jobs ostida bitta nom bor, test, demak bitta job. Job bu alohida mashina: ikki nom yozsangiz, ikki mashina parallel ochiladi. Shuni matrix va smoke'da ko'rasiz."
   ],
   [
    "b",
    "Step — job ichidagi qadam: <b>har <code>uses</code> va <code>run</code> — bitta «Run …» qatori</b>",
    "Job ichida qadamlar: faylda steps ostida nechta uses va run bo'lsa, run oynasida shuncha Run qatori. Checkout, setup node, to'rtta buyruq. Har qatorning yonida belgi va soniya, bossangiz, log."
   ],
   [
    "c",
    "Uchtasini siz yozmadingiz: <b><code>Set up job</code>, <code>Post Run …</code>, <code>Complete job</code></b> — GitHub o'zi qo'shadi",
    "Lekin ro'yxatda siz yozmagan qatorlar ham bor. Boshida set up job: mashinani tayyorlash. Oxirida post run, ya'ni tozalash, cache saqlash, va complete job. GitHub ularni har job'ga o'zi qo'shadi. Ularning logida foydali narsalar bor, hozir ko'ramiz."
   ],
   [
    "d",
    "Xulosa: <b>run → job → step</b>; qizil bo'lsa — qaysi job, qaysi qadam, uning logi",
    "Xulosa: run, job, step. Run yashil yoki qizil. Qizil bo'lsa qaysi job, qaysi qadam, deb pastga tushasiz va o'sha qadamning logini o'qiysiz. Endi GitHub qo'shgan qadamlarning ichiga qaraymiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "Tayyor qadamlar yashirin emas: Set up job mashinani aytadi, checkout bo'sh papkada git init va fetch --depth=1 qiladi, setup-node tayyor Node'ni topadi",
  "seg": [
   [
    "a",
    "<code>Set up job</code> logi: <b>runner <code>ubuntu-26.04</code>, token ruxsati <code>Contents: read</code></b>, action'lar yuklab olinadi",
    "Run'ni oching, set up job qadamini bosing. Mashina: image ubuntu yigirma olti nol to'rt. Ubuntu latest endi shu, oktabrdan o'zgardi. GitHub token ruxsati: contents read, faqat o'qiydi. Keyin download action repository: checkout va setup node tayyor qadamlari yuklab olinadi, SHA bilan."
   ],
   [
    "b",
    "<code>checkout</code> ichida: <b>papkani tozalaydi, <code>git init</code>, <code>fetch --depth=1</code></b> — faqat oxirgi commit",
    "Checkout qadamini bosing. Syncing repository, keyin deleting the contents: papka tozalanadi. Git init: bo'sh repo. Git fetch depth bir: faqat oxirgi commit olinadi, butun tarix emas, tez bo'lsin. Mana nega CI/CD-1 da checkout'siz papka bo'sh edi."
   ],
   [
    "c",
    "<code>setup-node</code> ichida: <b>«Found in cache» — runner'da tayyor Node 24.22.1, npm 11.19.1</b>",
    "Setup node: node version yigirma to'rt, cache npm. Found in cache: runner'da Node yigirma to'rt allaqachon bor, yuklab olinmadi. Node v yigirma to'rt yigirma ikki bir, npm o'n bir o'n to'qqiz. CI/CD-1 dagi tuzoq shu yerda ko'rinadi: versiya raqamini log aytadi."
   ],
   [
    "d",
    "Xulosa: <b><code>uses</code> — boshqalar yozgan skript</b>, logi ochiq; mashina, versiya, ruxsat — shu yerda",
    "Xulosa: uses yashirin narsa emas, boshqalar yozgan skript, logi ochiq. Mashina qaysi, Node qaysi, token nimaga ruxsatli, hammasi shu uch qadamning logida. Xato tushunarsiz bo'lsa, avval shu yerga qarang. Endi qizil run'ni o'qiymiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "2-bosqich · qizilni o'qish",
  "title": "Run sahifasidagi annotatsiya — xatoning birinchi satri; to'liq sabab qizil qadamning logida: tsc run'ida uchta annotatsiya, logda sakkiz satr",
  "seg": [
   [
    "a",
    "Run sahifasining yuqorisi — <b>annotatsiyalar</b>: <code>##[error]</code> bilan boshlangan satrlar, qisqa",
    "Qizil run'ni oching, CI/CD-1 dagi tsc run'i. Yuqorida annotations: uchta satr. Process completed with exit code two, no overload matches this call, va tur xatosining birinchi qatori. Bular logdagi error belgisi bilan boshlangan satrlar, GitHub ularni yuqoriga chiqaradi."
   ],
   [
    "b",
    "To'liq sabab — <b>qizil qadamning logida</b>: fayl, satr, ustun, ikki xato, nima nimaga mos emas",
    "Lekin annotatsiya qisqa. Qizil qadamni bosing: npx tsc. Logda hammasi: user service ts, yigirmanchi satr, qirq ikkinchi ustun, TS ikki uch ikki ikki, number string'ga mos emas, va yigirma ikkinchi satrda ikkinchi xato. Sabab shu yerda, annotatsiyada emas."
   ],
   [
    "c",
    "Test qizil run'ida annotatsiya <b>faqat «exit code 1»</b> — Jest xatosi logda: FAIL, qaysi test, qaysi satr",
    "Test qizil bo'lgan run'da annotatsiya yanada kam: faqat process completed with exit code one. Jest error belgisi bilan yozmaydi. Qaysi test, nima kutilgan, nima keldi, o'ttiz yettinchi satr, hammasi npm test qadamining logida. Annotatsiya sizga faqat qaysi qadam ekanini aytadi."
   ],
   [
    "d",
    "Xulosa: <b>belgi → qizil job → qizil qadam → log</b>; annotatsiya yo'l ko'rsatadi, sabab logda",
    "Xulosa: qizil run'ni o'qish tartibi: belgi, qizil job, qizil qadam, uning logi. Annotatsiya yo'l ko'rsatkich, sabab logda. O'quvchi lentam qizil, nima qilay desa, shu to'rt qadamni birga bosing. Endi tekshirib olaylik."
   ]
  ]
 },
 "5": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Run qizil. Annotatsiyada faqat Process completed with exit code 1. — npm test qadamida. Sababni qayerdan o'qiysiz?",
  "q": "Qizil run'ni o'qishni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Run qizil, annotatsiyada faqat process completed with exit code one, npm test qadamida. Qaysi test yiqilganini qayerdan o'qiysiz? Variantni tanlang.",
  "ok": "To'g'ri. Qizil qadamni bosasiz: npm test. Logda Jest'ning to'liq chiqishi: FAIL, qaysi test, kutilgan va kelgan, o'ttiz yettinchi satr. Annotatsiya faqat qadamni ko'rsatdi, chunki Jest error belgisi bilan yozmaydi. Demak, annotatsiya manzil, log esa sabab; lokalda qayta yurgizish shart emas.",
  "okShort": "Qizil qadam logi — to'liq Jest chiqishi. Annotatsiya — faqat manzil.",
  "hint": "4-ekrandagi tartib: belgi → job → qadam → ?",
  "demak": "Annotatsiya — manzil (qaysi qadam); sabab — qizil qadamning logida. Jest xatosi annotatsiyaga chiqmaydi.",
  "correct": 1,
  "opts": [
   "Annotatsiyani bosib — u to'liq xatoni ochadi",
   "npm test qadamini bosib — logda FAIL va test nomi",
   "Set up job logidan — u hamma xatoni yig'adi",
   "Commit'ni lokalda qayta yurgizib — GitHub logi to'liq emas"
  ],
  "wrong": {
   "0": "Annotatsiya qisqa satr, ochilmaydi — Jest uchun faqat «exit code 1».",
   "2": "Set up job — mashina va ruxsatlar; qadam xatolari u yerda yo'q.",
   "3": "GitHub logi — terminalingizdagi to'liq matn; lokalda qayta yurgizish shart emas."
  }
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · cache",
  "title": "cache: npm nima qiladi: birinchi run «Cache saved», ikkinchisi «Cache hit» — npm ci 11 s → 5 s; mainda esa «not found»: cache tarmoqqa bog'liq",
  "seg": [
   [
    "a",
    "<code>setup-node</code> <code>cache: npm</code> — birinchi run'da <b>«npm cache is not found»</b>, oxirida «Cache saved with the key»",
    "Ci yml'dagi cache npm satri nima qiladi? Birinchi run'ning setup node logida: npm cache is not found, cache yo'q. Oxirida, post run setup node qadamida: cache saved with the key, node cache, Linux, npm va uzun raqam. Npm si ay o'n bir soniya yurdi."
   ],
   [
    "b",
    "Ikkinchi run: <b>«Cache hit» — <code>npm ci</code> 11 soniyadan 5 ga tushdi</b>; kalit — lock faylning hash'i",
    "Ikkinchi run, o'sha tarmoq: cache hit for, o'sha kalit. Npm si ay besh soniya: paketlar internetdan emas, saqlangan cache'dan. Kalitdagi uzun raqam package lock json'ning hash'i: lock o'zgarsa, kalit o'zgaradi, cache qaytadan yig'iladi. Shuning uchun lock commit'da bo'lishi kerak."
   ],
   [
    "c",
    "<code>main</code>dagi birinchi run: yana <b>«not found»</b> — cache tarmoqqa bog'liq, <code>ci-sinov</code>niki <code>main</code>ga o'tmaydi",
    "Endi main tarmog'idagi birinchi run: yana npm cache is not found, npm si ay yana o'n bir soniya. Cache tarmoqqa bog'liq: ci sinov tarmog'ida saqlangani main'ga o'tmaydi. Main'da bir marta yashil bo'lgach, undan keyingi run'lar va tarmoqlar o'sha cache'ni oladi."
   ],
   [
    "d",
    "Xulosa: <b>cache — tezlik, to'g'rilik emas</b>; «not found» xato emas, «hit» — lock o'zgarmagan degani",
    "Xulosa: cache tezlik uchun, to'g'rilik uchun emas: cache bo'lmasa ham lenta to'g'ri ishlaydi, faqat sekinroq. Logda not found ko'rsangiz, bu xato emas. Hit ko'rsangiz, lock o'zgarmagan. Endi o'z run'ingizni o'qiysiz."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 12 daqiqa",
  "title": "CI/CD-1 dagi reponingizda ikki run'ni oching: Set up job, checkout, cache «saved» va «hit», npm ci soniyalari",
  "seg": [
   [
    "a",
    "Endi siz: <b>o'z reponingizdagi oxirgi ikki run</b>, uchta log va cache",
    "Endi navbat sizga. CI/CD-1 dagi reponingizni GitHub'da oching, Actions bo'limi. Oxirgi ikki run'ni o'qiysiz: set up job, checkout, setup node loglari va cache. Push kerak emas, faqat o'qish. O'n ikki daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b><code>Set up job</code>da mashina va ruxsat</b>, <code>checkout</code>da <code>git init</code> va <code>fetch --depth=1</code>",
    "Birinchi qadamda oxirgi run'ni ochib, set up job logidan image va GITHUB TOKEN ruxsatini topasiz. Ikkinchisida checkout logidan git init va fetch depth bir satrlarini. Uchinchi ekrandagi bilan solishtiring."
   ],
   [
    "c",
    "3–4-qadam: <b>ikki run'da cache: «saved» va «hit»</b>, <code>npm ci</code> soniyalari; isbot — hit satri",
    "Uchinchi qadamda eski run'ning post run setup node logida cache saved, yangisida setup node logida cache hit satrini topasiz. To'rtinchisida ikkala run'da npm si ay necha soniya yurganini yozib oling. Isbot maydoniga cache hit satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz run'ning har qadamini ochib o'qiy olasiz."
   ]
  ],
  "steps": [
   {
    "t": "Set up job",
    "cmds": [
     "GitHub → Actions → oxirgi run → job test → Set up job"
    ],
    "exp": "Image: ubuntu-… · GITHUB_TOKEN Permissions · Download action repository"
   },
   {
    "t": "checkout",
    "cmds": [
     "Run actions/checkout@v4 logi"
    ],
    "exp": "Deleting the contents of · git init · fetch … --depth=1"
   },
   {
    "t": "Cache",
    "cmds": [
     "eski run → Post Run actions/setup-node@v4",
     "yangi run → Run actions/setup-node@v4"
    ],
    "exp": "Cache saved with the key: node-cache-… · Cache hit for: node-cache-…"
   },
   {
    "t": "Soniyalar",
    "cmds": [
     "ikkala run'da Run npm ci yonidagi soniya"
    ],
    "exp": "ikkinchisi kamroq"
   }
  ],
  "proof": {
   "label": "Yangi run'dagi «Cache hit» satri",
   "placeholder": "masalan: Cache hit for: node-cache-Linux-x64-npm-…",
   "re": "Cache hit for: node-cache-",
   "flags": "i",
   "wrong": "Run actions/setup-node@v4 logidagi Cache hit for: node-cache-… satrini qo'ying."
  },
  "trouble": [
   [
    "Ikkala run'da npm cache is not found",
    "ikkinchi run boshqa tarmoqda yoki cache: npm satri yo'q — bir tarmoqda ketma-ket ikki run bo'lsin"
   ],
   [
    "Cache saved yo'q",
    "run qizil tugagan — Post Run cache'ni faqat npm ci o'tganda saqlaydi; yashil run'ni oching"
   ],
   [
    "Log ochilmaydi (bo'sh)",
    "run hali yuryapti yoki 90 kundan eski — yangi push qiling"
   ],
   [
    "Image: ubuntu-24.04 chiqdi",
    "runner surati sanaga qarab farq qiladi — xato emas, raqamni yozing"
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "3-bosqich · matrix",
  "title": "strategy.matrix.node-version: [22, 24] — bitta job ta'rifi, ikki mashina: test (22) qizil, test (24) esa… bekor qilindi — fail-fast",
  "seg": [
   [
    "a",
    "Matrix: <b><code>strategy.matrix</code> — bitta job, bir nechta qiymat</b>; <code>${{ matrix.node-version }}</code> har mashinaga o'z raqami",
    "Matrix bilan boshlaymiz. Ci yml'da job ostiga strategy, matrix, node version, qavsda yigirma ikki va yigirma to'rt. Setup node'da esa raqam o'rniga matrix node version. Bitta job ta'rifi, GitHub undan ikki mashina ochadi: test yigirma ikki va test yigirma to'rt, parallel."
   ],
   [
    "b",
    "Run: <b><code>test (22)</code> qizil — <code>npm ci</code>, o'sha lock tuzog'i</b>; <code>test (24)</code> «cancelled»",
    "Push, run. Chapda ikki job. Test yigirma ikki qizil: npm si ay, CI/CD-1 dagi o'sha tuzoq, missing webpack from lock file. Test yigirma to'rt esa yashil ham, qizil ham emas: cancelled, bekor qilindi, yigirma ikkinchi soniyada, tsc yurayotganda."
   ],
   [
    "c",
    "Demak, sabab: <b>fail-fast — bittasi yiqilsa qolganini bekor qiladi</b> (odatiy sozlama)",
    "Demak, sabab annotatsiyada: the strategy configuration was canceled because test yigirma ikki failed. Bu fail fast: matrix'da bitta mashina yiqilsa, GitHub qolganini bekor qiladi, vaqt va mashina tejaydi. Odatiy sozlama shu. Lekin siz yigirma to'rtda nima bo'lganini bilmay qolasiz."
   ],
   [
    "d",
    "Xulosa: <b>matrix mashinani emas, versiyani sinaydi</b>; natija to'liq kerak bo'lsa — <code>fail-fast: false</code>",
    "Xulosa: matrix bitta kodni bir nechta versiyada sinaydi. Fail fast tez, lekin javobi chala: yigirma to'rt yashilmi, bilmadik. To'liq javob kerak bo'lsa, fail fast false. Keyingi run'da shuni qo'yamiz."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · matrix",
  "title": "fail-fast: false — ikkala mashina oxirigacha: test (22) qizil, test (24) yashil; run qizil, lekin javob to'liq: kod 24 da ishlaydi, 22 da lock o'qilmaydi",
  "seg": [
   [
    "a",
    "<code>fail-fast: false</code> — <b>ikkala mashina oxirigacha yuradi</b>, run baribir qizil (22 yiqildi)",
    "Strategy ostiga fail fast false qo'shamiz. Push. Endi ikkala job oxirigacha yurdi: test yigirma ikki qizil, test yigirma to'rt yashil, to'rtala qadam. Run umuman qizil, chunki bittasi yiqildi, lekin javob to'liq."
   ],
   [
    "b",
    "22 ning logi — <b>CI/CD-1 dagi o'sha xato</b>: npm 10 lock'ni o'qiy olmaydi; 24 — hammasi yashil",
    "Yigirma ikkining npm si ay logi: missing webpack from lock file, CI/CD-1 o'n yettinchi ekrandagi xato. Yigirma to'rt: npm si ay, tsc, test, build, hammasi yashil. Matrix sizga aniq aytdi: bu loyiha Node yigirma to'rtda ishlaydi, yigirma ikkida lock o'qilmaydi."
   ],
   [
    "c",
    "Matrix kimga kerak: <b>kutubxona yozsangiz — ha</b>, bot yoki sayt — mashinangizdagi bitta Node yetadi",
    "Matrix kimga kerak? Kutubxona yozsangiz, uni har xil Node'da ishlatishadi, matrix shart. OrderBotNest kabi bot yoki sayt bitta serverda, bitta Node'da yuradi: mashinangizdagi raqam yetadi. O'quvchi darsida matrix parallel lentalar deb chizilgan, uchta Node."
   ],
   [
    "d",
    "Xulosa: <b>matrix — bir nechta versiya, parallel</b>; <code>fail-fast</code> tez, <code>false</code> — to'liq javob",
    "Xulosa: matrix bitta faylni bir nechta versiyada parallel sinaydi. Fail fast tez to'xtatadi, false to'liq javob beradi. Loyihangizga kerak bo'lsa qo'ying, bo'lmasa bitta Node, mashinangizdagi. Endi tekshirib olaylik."
   ]
  ]
 },
 "10": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "matrix [22, 24], fail-fast yozilmagan. test (22) 10-soniyada yiqildi, test (24) hali tscda. test (24) bilan nima bo'ladi?",
  "q": "Matrix'ni ko'rdingiz, endi tekshirib olaylik. Ikkinchi tekshiruv. Matrix yigirma ikki va yigirma to'rt, fail fast yozilmagan. Test yigirma ikki o'ninchi soniyada yiqildi, test yigirma to'rt hali tsc'da. Yigirma to'rt bilan nima bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Fail fast yozilmasa, u true: bitta mashina yiqilishi bilan GitHub qolganini bekor qiladi, cancelled. Yigirma to'rt tsc'da to'xtatildi, natijasi noma'lum. To'liq javob kerak bo'lsa, fail fast false yoziladi. Demak, matrix'da cancelled ko'rsangiz, bu o'sha job'ning xatosi emas, boshqasining yiqilgani.",
  "okShort": "<code>fail-fast</code> odatiy <code>true</code> — bittasi yiqilsa qolgani «cancelled». To'liq javob — <code>fail-fast: false</code>.",
  "hint": "8-ekrandagi annotatsiya: «canceled because … failed» — kim kimni to'xtatdi?",
  "demak": "matrix'da «cancelled» — o'sha job'ning xatosi emas: boshqa job yiqildi, <code>fail-fast</code> to'xtatdi.",
  "correct": 2,
  "opts": [
   "Oxirigacha yuradi — matrix job'lari bir-biriga bog'liq emas",
   "Oxirigacha yuradi, lekin natijasi run'ga kirmaydi",
   "Bekor qilinadi — odatiy fail-fast qolganini to'xtatadi",
   "Qayta boshlanadi — GitHub 22 ning o'rniga 24 ni ishlatadi"
  ],
  "wrong": {
   "0": "matrix job'lari bitta strategy'ga bog'langan — fail-fast ularni birga boshqaradi.",
   "1": "Yurmaydi: 22-soniyada «cancelled», tsc tugamadi.",
   "3": "GitHub mashinani almashtirmaydi; har qiymat — o'z mashinasi."
  }
 },
 "11": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "ci.ymlga matrix [22, 24] qo'shing, ikki job'ni ko'ring, fail-fast: false bilan to'liq javob oling, keyin bitta Node'ga qaytaring",
  "seg": [
   [
    "a",
    "Endi siz: <b>o'z reponingizda matrix</b>, ikki mashina, fail-fast ikki holatda",
    "Endi navbat sizga. O'z reponingizdagi ci yml'ga matrix qo'shasiz, yigirma ikki va yigirma to'rt, push qilib ikki job'ni ko'rasiz. Keyin fail fast false bilan to'liq javob, oxirida bitta Node'ga qaytarasiz. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>matrix va push</b> — <code>test (22)</code> qizil, <code>test (24)</code> cancelled",
    "Birinchi qadamda strategy matrix va setup node'da matrix node version yozasiz, sakkizinchi ekrandagi kabi. Ikkinchisida push: Actions'da ikki job, yigirma ikki qizil, yigirma to'rt cancelled bo'lishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <b><code>fail-fast: false</code></b> — 24 yashil; keyin matrix'ni olib, <code>node-version: 24</code>; isbot — 24 job'ining holati",
    "Uchinchi qadamda fail fast false qo'shib push qilasiz: yigirma to'rt yashil, yigirma ikki qizil. To'rtinchisida matrix'ni olib tashlab, node version yigirma to'rtga qaytarasiz, run yashil. Isbot maydoniga uchinchi qadamdagi yigirma to'rt job'ining holatini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz matrix yozasiz va cancelled nima ekanini bilasiz."
   ]
  ],
  "steps": [
   {
    "t": "matrix",
    "cmds": [
     "ci.yml: strategy: → matrix: → node-version: [22, 24]",
     "setup-nodeda node-version: ${{ matrix.node-version }}"
    ],
    "exp": "8-ekrandagi 18 satr"
   },
   {
    "t": "Push",
    "cmds": [
     "git commit -am \"ci: matrix\" && git push mine HEAD:main"
    ],
    "exp": "test (22) ✗ · test (24) cancelled"
   },
   {
    "t": "fail-fast: false",
    "cmds": [
     "strategy: ostiga fail-fast: false",
     "push"
    ],
    "exp": "test (22) ✗ · test (24) ✓"
   },
   {
    "t": "Qaytarish",
    "cmds": [
     "matrix'ni olib tashlang, node-version: 24",
     "push"
    ],
    "exp": "run ✓ (bitta job)"
   }
  ],
  "proof": {
   "label": "3-qadamda test (24) job'ining holati",
   "placeholder": "masalan: success / yashil",
   "re": "(success|yashil|✓|passed)",
   "flags": "i",
   "wrong": "fail-fast: false bilan 24 job'i oxirigacha yurishi kerak — holatini yozing."
  },
  "trouble": [
   [
    "Bitta job, nomi test",
    "strategy runs-on bilan bir chuqurlikda emas yoki matrix.node-version ishlatilmagan — 8-ekrandagi yml"
   ],
   [
    "Ikkalasi yashil",
    "mashinangizda Node 22 va lock npm 10 bilan yig'ilgan — tuzoq yo'q; kutilgan farq faqat lock npm 11 bilan bo'lsa chiqadi (CI/CD-1 17-ekran)"
   ],
   [
    "Ikkalasi qizil npm ci",
    "lock mos emas (CI/CD-1 14-ekran) — npm install, lock commit'ga"
   ],
   [
    "Invalid workflow file",
    "YAML surilish — strategy: matrix: ikki probel o'ngda, ro'yxat [22, 24]"
   ]
  ]
 },
 "12": {
  "type": "Lesson",
  "kicker": "4-bosqich · smoke va secret",
  "title": "Jest testlari bazasiz (mock). Smoke esa haqiqiy Postgres'ga yozadi — lentada baza yo'q. Yechim: job yoniga vaqtinchalik konteyner — services",
  "seg": [
   [
    "a",
    "Lentada hozir faqat <b>Jest — bazasiz</b>; TgPg darsidagi smoke esa haqiqiy bazaga yozadi",
    "To'rtinchi bosqich. Lentada hozir faqat Jest testlari: mock, baza yo'q, ikki soniya. Lekin Telegraf darsida smoke yozgansiz: npm run smoke, haqiqiy Nest va Telegraf kodi, haqiqiy Postgres, restart va race. U lentada yo'q, chunki runner'da baza yo'q."
   ],
   [
    "b",
    "<code>scripts/smoke.js</code>: <b><code>DATABASE_URL</code>dan <code>shop_smoke</code> bazasini o'zi ochadi</b>, oxirida o'chiradi",
    "OrderBotNest'da scripts papkasidagi smoke js'ni oching. Base url: DATABASE URL muhit o'zgaruvchisidan. Undan shop smoke nomli vaqtinchalik baza ochadi, template zero bilan, oxirida o'chiradi. Demak, smoke'ga faqat bitta narsa kerak: ishlayotgan Postgres va unga manzil."
   ],
   [
    "c",
    "Yechim: <b><code>services</code> — job mashinasi yonida vaqtinchalik konteyner</b>, <code>postgres:18</code>, <code>localhost:5432</code>",
    "GitHub'da bu services deyiladi: job'ga ikkinchi konteyner, bu yerda postgres o'n sakkiz. U job bilan birga ochiladi, mashinada localhost besh ming to'rt yuz o'ttiz ikkida turadi, job tugashi bilan o'chadi. Hech qanday server, hech qanday tashqi baza kerak emas."
   ],
   [
    "d",
    "Xulosa: <b>unit test bazasiz, smoke — services bilan</b>; lentada ikkalasi: tez va to'liq",
    "Xulosa: unit testlar bazasiz, tez. Smoke bazali, to'liq. Lentada ikkalasi bo'lsin: avval test, keyin smoke, uning yonida Postgres konteyneri. Keyingi ekranda shu job'ni yozamiz va haqiqiy run'da ko'ramiz."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · smoke va secret",
  "title": "Ikkinchi job smoke: needs: test, services: postgres:18 healthcheck bilan, npm run smoke — run'da Initialize containers, keyin NATIJA: 5/5 ✓",
  "seg": [
   [
    "a",
    "Ikkinchi job: <b><code>smoke:</code> <code>needs: test</code></b> — test qizil bo'lsa smoke boshlanmaydi, Postgres ko'tarilmaydi",
    "Ci yml'ga jobs ostiga ikkinchi nom qo'shamiz: smoke. Birinchi satri needs test: avval test job'i yashil bo'lsin, keyin smoke. Test qizil bo'lsa smoke boshlanmaydi, Postgres ham ko'tarilmaydi, vaqt bekor ketmaydi."
   ],
   [
    "b",
    "<code>services: postgres</code>: <b>image, parol, baza nomi, port va healthcheck</b> — <code>pg_isready</code> tayyor demaguncha kutadi",
    "Services ostida postgres: image postgres o'n sakkiz. Env: parol va baza nomi shop, smoke shop smoke'ni shundan ochadi. Ports: besh ming to'rt yuz o'ttiz ikki. Options: healthcheck, pg is ready. Baza tayyor demaguncha qadamlar boshlanmaydi, aks holda smoke ulanolmay yiqilardi."
   ],
   [
    "c",
    "Qadamlar: checkout, setup-node, <code>npm ci</code>, <b><code>npm run smoke</code> — <code>env: DATABASE_URL</code> konteynerga</b>; run'da «Initialize containers»",
    "Qadamlar tanish: checkout, setup node, npm si ay. Keyin npm run smoke, uning env'ida DATABASE URL: postgres, parol postgres, localhost, shop. Push. Run'da ikki job: test yashil, keyin smoke: birinchi qadam initialize containers, Postgres ko'tarildi, o'n ikki soniya."
   ],
   [
    "d",
    "Xulosa: smoke logida <b><code>NATIJA: 5/5 ✓</code></b> — restart va race lentada; <code>Stop containers</code> — baza o'chdi",
    "Xulosa: npm run smoke qadamining logi: vaqtinchalik baza shop smoke, restart uchta yashil, race ikkita yashil, natija besh besh. Oxirida stop containers: baza o'chdi, iz qolmadi. Endi haqiqiy bot sinovi har push'da. Keyingi ekranda DATABASE URL qayerdan kelishini chuqurroq ko'ramiz."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "Konteyner paroli sir emas — env:da ochiq. Haqiqiy baza yoki bot tokeni — Secrets: logda yulduzcha (maska). Secret nomi xato bo'lsa xato chiqmaydi — qiymat bo'sh, smoke «DATABASE_URL topilmadi»",
  "seg": [
   [
    "a",
    "Konteyner paroli — <b><code>env:</code>da ochiq, bu to'g'ri</b>: u faqat job ichida yashaydi, job bilan o'ladi",
    "O'n uchinchi ekranda DATABASE URL'ni yml'ga ochiq yozdik, parol postgres. Bu to'g'ri: konteyner job ichida tug'iladi va o'ladi, unga tashqaridan hech kim ulanolmaydi. Sir emas. Ikkala AI ham shunday qildi, keyin ko'rasiz."
   ],
   [
    "b",
    "Haqiqiy baza, bot tokeni — <b>GitHub Secrets</b>: Settings'da yoziladi, yml'da <code>${{ secrets.NOM }}</code>, logda <code>***</code>",
    "Lekin haqiqiy baza manzili yoki bot tokeni yml'ga yozilmaydi: repo ochiq, tarix abadiy. Ular GitHub'da repo settings, secrets and variables, actions bo'limiga yoziladi. Yml'da faqat nomi: secrets DATABASE URL. Logda qiymati yulduzcha bo'lib chiqadi, maska."
   ],
   [
    "c",
    "Buzamiz: <b><code>secrets.DATABSE_URL</code> — bitta harf tushib qoldi</b>; xato yo'q, qiymat bo'sh — smoke «DATABASE_URL topilmadi»",
    "Endi buzamiz: yml'da secrets DATABSE URL, bitta harf tushib qoldi. Push. GitHub xato bermaydi: bunday secret yo'q, demak qiymat bo'sh. Smoke qadami qizil: SMOKE XATO, DATABASE URL topilmadi, chiqish kodi ikki. Logga qarang: xabardagi namuna manzilning paroli yulduzcha, runner URL parolini o'zi yashirdi."
   ],
   [
    "d",
    "Xulosa: <b>env — konteyner, secrets — tashqi</b>; «topilmadi» ko'rsangiz — yml'dagi secret nomini tekshiring",
    "Xulosa: konteyner uchun env, tashqi resurs uchun secrets. Secret nomi xato bo'lsa GitHub indamaydi, qiymat bo'sh keladi va dastur yiqiladi. Logda topilmadi yoki undefined ko'rsangiz, avval yml'dagi secret nomini Settings'dagi bilan solishtiring. Endi shu satrni o'zingiz topasiz."
   ]
  ]
 },
 "15": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4 — qaysi satr xato?",
  "title": "Bu ci.yml bilan smoke job qizil: «DATABASE_URL topilmadi». Postgres ko'tarildi, healthcheck o'tdi. Sababchi satrni toping",
  "q": "Secret nomini ko'rdingiz, endi o'zingiz toping. Uchinchi tekshiruv. Bu ci yml bilan smoke job qizil: DATABASE URL topilmadi. Postgres ko'tarildi, healthcheck o'tdi. Bo'lakda bitta satr noto'g'ri secret nomiga murojaat qiladi. O'sha satrni bosing.",
  "ok": "To'g'ri. Secrets DATABSE URL: E harfi tushib qolgan. GitHub bunday secret'ni topmadi, lekin xato bermadi, bo'sh qiymat berdi. Smoke bo'sh manzil bilan ishga tushdi va o'zi to'xtadi: DATABASE URL topilmadi. Ekranda tuzatilgan satr. Demak, secret bilan bog'liq xatoni avval nomdan qidiring.",
  "okShort": "<code>DATABSE</code> — bitta harf yo'q; GitHub indamaydi, qiymat bo'sh, dastur yiqiladi. Nomni Settings bilan solishtiring.",
  "hint": "${{ secrets.… }} ichidagi nomni harfma-harf o'qing: DATABASE_URL to'liqmi?",
  "task": "Qoida: <code>${{ secrets.NOM }}</code> — NOM Settings'dagi bilan harfma-harf bir xil bo'lishi kerak; yo'q nom — bo'sh qiymat, xato yo'q. Bu bo'lakda bitta satr noto'g'ri nomga murojaat qiladi. <b>O'sha satrni bosing.</b>"
 },
 "16": {
  "type": "Lesson",
  "kicker": "5-bosqich · PR va AI",
  "title": "Yangi ish — alohida tarmoqda; pull request ochilganda lenta yana yuradi va PR sahifasida tekshiruv turadi; yashil — merge; README'da badge lenta holatini ko'rsatadi",
  "seg": [
   [
    "a",
    "Yangi ish — <b>alohida tarmoq <code>lenta-smoke</code></b>; push — tarmoqda ham run (<code>on: push</code>)",
    "Smoke job'ni main'ga to'g'ridan emas, pull request orqali qo'shamiz, jamoada shunday. Terminalda git checkout b lenta smoke, ci yml'ni o'zgartirib commit, git push u origin lenta smoke. Actions'da run: on push har tarmoqqa tegishli."
   ],
   [
    "b",
    "Pull request: <b><code>on: pull_request</code> — yana run</b>; PR sahifasida «checks»: <code>test</code> ✓, <code>smoke</code> ✓",
    "GitHub'da pull request ochamiz: lenta smoke'dan main'ga. Ci yml'dagi on pull request ishga tushadi: yana bir run, bu safar pull request hodisasi. PR sahifasining pastida checks: test yashil, smoke yashil. Merge tugmasi ochiq. Qizil bo'lsa, bu yerda ko'rinadi, main'ga o'tmaydi."
   ],
   [
    "c",
    "Merge — <b>main'da merge commit, yana run</b>: ikki job yashil; endi main'da smoke ham bor",
    "Merge bosamiz. Main'da merge commit paydo bo'ladi, on push, yana run: test va smoke yashil. Endi main'dagi lenta ikki job'li. Tarix ham tushunarli: qaysi PR nimani qo'shgani ko'rinadi, CI/CD-1 dagi to'g'ridan push'dan farqi shu."
   ],
   [
    "d",
    "Xulosa: <b>README'ga badge</b> — <code>actions/workflows/ci.yml/badge.svg</code>: ochgan odam lentani ko'radi",
    "Xulosa: tarmoq, pull request, checks, merge. Va README'ning birinchi satriga badge: workflows ci yml badge svg. Reponi ochgan har kim lenta yashilmi, qizilmi, darhol ko'radi. O'quvchi darsida bu tablo deyiladi. Endi AI'ga o'tamiz."
   ]
  ]
 },
 "17": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI",
  "title": "Yangi ko'nikma davomi: ikki AI'ga bitta prompt — «smoke'ni ham qo'sh, unga PostgreSQL kerak»; ikkalasi services: postgres yozdi va lentada birinchi urinishda yashil",
  "seg": [
   [
    "a",
    "Yana AI bosqichi: <b>prompt — «smoke'ni ham qo'sh, unga PostgreSQL kerak»</b>, services so'zi yo'q",
    "CI/CD-1 dagi kabi oxirgi bosqich AI bilan. Prompt: OrderBotNest'da npm run smoke bor, unga PostgreSQL kerak, DATABASE URL. Workflow'ga shu smoke'ni ham qo'shib ber. Services, konteyner, healthcheck, secret, bu so'zlar promptda yo'q. Har AI loyihaning alohida nusxasida, mavjud ci yml bilan."
   ],
   [
    "b",
    "Ikkalasi <b><code>services: postgres:18</code>, healthcheck, <code>POSTGRES_DB: shop</code></b> yozdi — README'dagi versiyadan",
    "Ikkalasi ham services postgres o'n sakkiz yozdi, README'dagi versiyadan. Parol, baza nomi shop, port, va healthcheck pg is ready. Smoke qadami build'dan keyin, env'ida DATABASE URL. Birinchisi env'ni faqat smoke qadamiga, ikkinchisi butun job'ga berdi."
   ],
   [
    "c",
    "Lentada: <b>ikkalasi birinchi urinishda yashil</b> — <code>Initialize containers</code>, <code>NATIJA: 5/5 ✓</code>",
    "Ikkalasini ham sinov tarmog'iga push qildik. Ikkalasi yashil: initialize containers, Postgres ko'tarildi, npm run smoke, natija besh besh. CI/CD-1 dagidan farqli, bu safar AI birinchi urinishda to'g'ri qildi. Nega shunday, hozir ko'ramiz."
   ],
   [
    "d",
    "Xulosa: AI <b>secret ishlatmadi — to'g'ri</b> («konteyner — sir emas»); yashil, lekin tekshiruv hali oldinda",
    "Xulosa: ikkala AI secret ishlatmadi va birinchisi sababini yozdi: konteyner paroli faqat job ichida, sir emas. To'g'ri fikr. Ikkalasi yashil. Lekin yashil hali qabul emas: keyingi ekranda to'rt savol bilan o'qiymiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Nega bu safar yashil: AI faylni noldan yozmadi, sizning ci.ymlni (node 24) o'zgartirdi — tayanch to'g'ri bo'lsa AI ham to'g'ri; qabul — to'rt savol",
  "seg": [
   [
    "a",
    "Farq: CI/CD-1 da AI <b>noldan yozdi</b> (node 22 → qizil); bu safar <b>sizning faylingizni o'zgartirdi</b> (24 → yashil)",
    "CI/CD-1 da AI workflow'ni noldan yozdi va node yigirma ikki qo'ydi, qizil. Bu safar repoda sizning ci yml'ingiz bor edi, node yigirma to'rt bilan. AI uni o'zgartirdi, noldan yozmadi. Tayanch to'g'ri bo'lsa, AI ham to'g'ri davom etadi. Shuning uchun avval o'zingiz yozing, keyin AI'ga bering."
   ],
   [
    "b",
    "Ikki farq: <b><code>env</code> qayerda</b> — 1-AI faqat smoke qadamida (torroq, yaxshi), 2-AI butun job'ga; smoke alohida job emas",
    "Ikkalasini solishtiring. Birinchi AI DATABASE URL'ni faqat smoke qadamiga berdi, ikkinchisi butun job'ga: ikkalasi ishlaydi, torrog'i yaxshiroq. Ikkalasi smoke'ni alohida job qilmadi, oxirgi qadam qildi: ishlaydi, lekin test qizil bo'lsa ham Postgres ko'tariladi. Tavsiyada needs test bilan alohida job."
   ],
   [
    "c",
    "1-AI o'zi sezdi: <b>smoke ichida yana <code>nest build</code> — build ikki marta</b>; AI izohini o'qing",
    "Birinchi AI yana bir narsani o'zi aytdi: smoke ichida yana nest build bor, build ikki marta yuradi, bir necha soniya ortiqcha. Siz hal qilasiz: npm run build qadamini qoldirasizmi, olasizmi. AI'ning izohlarini o'qing, ko'pincha eng foydali joyi shu."
   ],
   [
    "d",
    "Xulosa: AI smoke workflow'iga <b>to'rt savol</b>: services + healthcheck · <code>DATABASE_URL</code> yetib boradimi · tartib · secret kerakmi",
    "Xulosa, to'rt savol. Services va healthcheck bormi. DATABASE URL smoke qadamiga yetib boradimi, env qayerda. Tartib: smoke build'dan keyinmi. Secret kerakmi: konteyner uchun yo'q, tashqi baza uchun ha. To'rttasiga javob bo'lsa, push va run. Endi tekshirib olaylik."
   ]
  ]
 },
 "19": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "AI services: postgres yozdi va DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop ni yml'da ochiq qoldirdi. Bu xatomi?",
  "q": "AI workflow'ini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. AI services postgres yozdi va DATABASE URL'ni, parol postgres bilan, yml'da ochiq qoldirdi. Bu xatomi? Variantni tanlang.",
  "ok": "To'g'ri. Bu konteyner job bilan ochiladi va job bilan o'chadi, unga tashqaridan hech kim ulanolmaydi, parol hech narsani ochmaydi. Secret tashqi resurs uchun: haqiqiy baza, bot tokeni. Demak, secret kerakmi deb so'raganda, bu qiymat job'dan tashqarida nimani ochadi, deb so'rang.",
  "okShort": "Konteyner — job ichida, job bilan o'chadi → <code>env</code> yetadi. Tashqi resurs → Secrets.",
  "hint": "14-ekran: env — konteyner, secrets — tashqi. Bu konteyner job'dan tashqarida bormi?",
  "demak": "Secret savoli: bu qiymat job'dan tashqarida nimani ochadi? Konteyner — hech narsani → <code>env</code>. Prod baza, token → Secrets.",
  "correct": 2,
  "opts": [
   "Xato — har qanday parol, hatto vaqtinchalik ham, Secrets'da bo'lishi shart",
   "Xato — GitHub ochiq parolni ko'rsa run'ni to'xtatadi",
   "Xato emas — konteyner job ichida yashaydi, parol tashqariga chiqmaydi",
   "Xato emas — localhost manzillari hech qachon sir bo'lmaydi"
  ],
  "wrong": {
   "0": "Secrets tashqi resurs uchun; konteyner paroli job bilan o'ladi.",
   "1": "GitHub yml'dagi matnni tekshirmaydi — run yashil (40, 41).",
   "3": "localhost ham sir bo'lishi mumkin (masalan, self-hosted runner'dagi haqiqiy baza) — gap manzilda emas, qiymat nimani ochishida."
  }
 },
 "20": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 25 daqiqa",
  "title": "O'z AI'ingizga smoke job yozdiring, to'rt savol bilan tekshiring, alohida tarmoqda PR oching, yashil bo'lgach merge qiling, README'ga badge",
  "seg": [
   [
    "a",
    "Endi siz: <b>AI'ga smoke job</b> — tarmoq, PR, merge, badge",
    "Endi navbat sizga. O'z AI'ingizga smoke job yozdirasiz, promptni pastdagi tugma bilan nusxalaysiz. Alohida tarmoqda push qilib pull request ochasiz, tekshiruv yashil bo'lgach merge, README'ga badge. Yigirma besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>tarmoq va prompt</b>, keyin to'rt savol: services + healthcheck · env · tartib · secret",
    "Birinchi qadamda yangi tarmoq ochasiz: git checkout b lenta smoke. Ikkinchisida promptni AI'ga berib, faylni to'rt savol bilan o'qiysiz: services va healthcheck bormi, DATABASE URL smoke qadamiga yetadimi, smoke build'dan keyinmi, secret kerak emasligi to'g'rimi."
   ],
   [
    "c",
    "3–4-qadam: <b>push, PR, checks yashil, merge</b>, README'ga badge; isbot — PR manzili",
    "Uchinchi qadamda push va GitHub'da pull request: checks'da test va smoke yashil bo'lgach merge. To'rtinchisida README'ning birinchi satriga badge qo'yib, main'ga push qilasiz: nishon passing. Isbot maydoniga merge qilingan PR manzilini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizning lentangizda haqiqiy bot sinovi bor va u pull request orqali keldi."
   ]
  ],
  "steps": [
   {
    "t": "Tarmoq",
    "cmds": [
     "git checkout -b lenta-smoke"
    ],
    "exp": "yangi tarmoq"
   },
   {
    "t": "Prompt + to'rt savol",
    "cmds": [
     "yuqoridagi prompt — o'z AI'ingizga",
     "services + pg_isready",
     "env: DATABASE_URL smoke qadamida",
     "smoke builddan keyin / needs: test",
     "secret yo'q (konteyner)"
    ],
    "exp": "4 ✓"
   },
   {
    "t": "PR va merge",
    "cmds": [
     "git push -u mine lenta-smoke",
     "GitHub → New pull request (lenta-smoke → main)",
     "checks ✓ → Merge"
    ],
    "exp": "PR merged · main run ✓ (2 job)"
   },
   {
    "t": "Badge",
    "cmds": [
     "git pull mine main",
     "README 1-satr: ![CI](https://github.com/<siz>/OrderBotNest/actions/workflows/ci.yml/badge.svg)",
     "commit, push"
    ],
    "exp": "README'da «CI passing»"
   }
  ],
  "proof": {
   "label": "Merge qilingan PR manzili",
   "placeholder": "masalan: https://github.com/siz/OrderBotNest/pull/1",
   "re": "github\\.com\\/[^\\s\\/]+\\/[^\\s\\/]+\\/pull\\/\\d+",
   "flags": "",
   "wrong": "PR sahifasining manzilini qo'ying: …/pull/<raqam>."
  },
  "trouble": [
   [
    "smoke qizil: DATABASE_URL topilmadi",
    "env: smoke qadamiga yetmagan (boshqa qadamda yoki job'da yo'q) yoki secret nomi xato (14–15-ekran)"
   ],
   [
    "smoke qizil: ECONNREFUSED 127.0.0.1:5432",
    "services yo'q yoki ports: 5432:5432 yo'q yoki healthcheck yo'q (baza tayyor bo'lmasdan boshlandi)"
   ],
   [
    "smoke qizil: database \"shop\" does not exist",
    "POSTGRES_DB: shop yo'q — smoke shop ga ulanib shop_smoke ochadi"
   ],
   [
    "PR'da checks ko'rinmaydi",
    "on: da pull_request yo'q — on: [push, pull_request]"
   ],
   [
    "Badge «no status»",
    "manzilda workflow fayl nomi xato — ci.yml aynan; yoki main'da hali run yo'q"
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m4c-03 · «GitHub Actions — yo'l xaritasini yozish»",
  "title": "O'quvchi darsi: yo'l xaritasi, nuqta, amal, parallel lentalar, yaqin javon, seyf, tablo — siz bugun haqiqiy run'da ko'rgan narsalarning rasmli nomlari",
  "seg": [
   [
    "a",
    "m4c-03 — 23 ekran: <b>yo'l xaritasi, nuqta, amal</b>; matrix, seyf, tablo — simulyatsiyada",
    "Endi sinfga tayyorgarlik. O'quvchi darsi m4c-03, yigirma uch ekran. Yo'l xaritasi bu ci yml, nuqta bu job, amal bu step. Parallel lentalar matrix, seyf secrets, tablo badge. Hammasi ekranda chizilgan simulyatsiya: tugma bosiladi, lenta yuradi, hammasi yashil."
   ],
   [
    "b",
    "Lug'at: <b>o'quvchi so'zi → atama</b>; sinfda ikkalasini birga ayting",
    "Lug'atga qarang: o'quvchi so'zi chapda, atama o'ngda. Jurnal bu qadam logi, yaqin javon bu cache, seyf bu secrets. Sinfda so'zni atamasi bilan birga ayting: parallel lentalar, ya'ni matrix. O'quvchi keyin GitHub'ni ochganda so'zlar tanish bo'ladi."
   ],
   [
    "c",
    "Simulyatsiya ↔ haqiqiy: <b>o'quvchi darsida hammasi yashil</b>, haqiqiy Actions'da 22 qizil, cancelled, <code>***</code>",
    "Farqni bilib turing. O'quvchi darsida matrix uchala lentada yashil, seyf shunchaki yashirin, jurnalda sabab bitta satr. Haqiqiy Actions'da yigirma ikki qizil, yigirma to'rt cancelled, secret nomi xato bo'lsa indamaydi, sabab logning ichida. Siz buni bugun ko'rdingiz, o'quvchi ko'rmagan."
   ],
   [
    "d",
    "Xulosa: <b>simulyatsiya tushuncha beradi, haqiqiy run tajriba</b>; sinfda bittasini ekranda oching",
    "Xulosa: simulyatsiya tushunchani beradi, haqiqiy run tajribani. Sinfda o'z reponingizdagi bitta run'ni proyektorda oching: job, qadam, log, cache hit. O'quvchi yo'l xaritasi va haqiqiy Actions bir narsa ekanini ko'rsin. Keyingi ekranda sinfdagi tuzoqlar."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "O'quvchi darsidagi «Repongiz yo'qmi?» namunasi: lock fayl yo'q — npm ci qizil; \"test\": \"echo ok && exit 0\" — hech qachon qizil bo'lmaydi; uyga vazifadagi «testni buzing» shu yerda to'xtab qoladi",
  "seg": [
   [
    "a",
    "Namuna: <b><code>npm install</code>, <code>echo ok</code> testi, lock yo'q</b> — o'quvchi shu bilan birinchi lentasini yozadi",
    "O'quvchi darsida reposi yo'q o'quvchi uchun namuna bor: package json'da test echo ok, lock fayl yo'q, lenta npm install va npm test. U ishlaydi: npm install o'rnatadi, test ok deydi, yashil. Lekin ikki tuzoq bor."
   ],
   [
    "b",
    "Tuzoq 1: o'quvchi GitHub'ning tayyor andozasini bossa — <b><code>npm ci</code>, lock yo'q — qizil</b>",
    "Birinchi tuzoq: o'quvchi Actions'da GitHub'ning tayyor Node andozasini bossa, u npm si ay yozadi. Lock fayl yo'q, npm si ay yiqiladi: can only install with an existing package lock json. CI/CD-1 o'n uchinchi ekrandagi xabar, boshqa sabab bilan. Yechim: npm install, yoki npm install bir marta lokalda, lock commit'ga."
   ],
   [
    "c",
    "Tuzoq 2: <b><code>echo ok &amp;&amp; exit 0</code> hech qachon qizil bo'lmaydi</b> — uyga vazifadagi «testni buzing» imkonsiz",
    "Ikkinchi tuzoq: test echo ok va exit nol, u hech qachon qizil bo'lmaydi. Uyga vazifada testni ataylab buzing deyiladi, namunada buzib bo'lmaydi. Yechim: o'quvchi o'z Jest loyihasida qilsin, yoki skriptni echo xato va exit bir qilib ko'rsating: qizil, keyin qaytaring."
   ],
   [
    "d",
    "Xulosa: namuna <b>boshlash uchun yaxshi, buzish uchun emas</b>; <code>@v4</code> ishlaydi, ogohlantirish — xato emas",
    "Xulosa: namuna boshlash uchun yaxshi, buzish uchun emas. Va o'quvchi darsidagi checkout v to'rt hozir ham ishlaydi, logda Node yigirma deprecated ogohlantirishi chiqadi, bu xato emas. Oxirgi ekranda siz qo'shadigan narsalar va o'quvchi savollari."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "Darsga siz qo'shadigan to'rt narsa, uch vaziyat va o'quvchi savollariga tayyor javoblar",
  "seg": [
   [
    "a",
    "Siz qo'shasiz: <b>haqiqiy run proyektorda, matrix'ning haqiqiy natijasi, secret nomi, namuna tuzoqlari</b>",
    "Darsga siz qo'shadigan to'rt narsa. Jurnaldan sababni topish ekranida haqiqiy run'ni proyektorda oching. Parallel lentalarda ayting: haqiqatda bitta versiya qizil bo'lishi mumkin. Seyfda: nom xato bo'lsa indamaydi. Uyga vazifada namuna tuzoqlarini oldindan ayting."
   ],
   [
    "b",
    "Uch vaziyat: <b>lock yo'q, cancelled, «buzdim, baribir yashil»</b> — xabar va yechim",
    "Uch vaziyat. Npm si ay qizil, lock yo'q: npm install yoki lock commit'ga. Matrix'da cancelled: xato boshqa job'da, fail fast. Testni buzdim, baribir yashil: echo ok buzilmaydi, exit bir yoki Jest loyihasi. Har birining xabari kartada."
   ],
   [
    "c",
    "O'quvchi so'rasa: <b>jurnal qayerda, matrix yashil shartmi, seyfni ko'rsam bo'ladimi, badge qizil</b>",
    "O'quvchi savollariga tayyor javoblar pastda, bosib oching: jurnal qayerda, matrix'da hammasi yashil bo'lishi shartmi, seyfdagi kalitni ko'rsam bo'ladimi, badge qizil bo'lsa nima. Har biriga bir gap javob bor."
   ],
   [
    "d",
    "Xulosa: o'quvchi «lenta qizil» desa — <b>job → qadam → log</b>; shu bilan sinfga tayyor",
    "Xulosa: o'quvchi lenta qizil desa, u bilan birga uch qadam: qaysi job, qaysi qadam, uning logi. Shu bilan sinfga tayyorsiz. Endi o'zingizni tekshiring."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "ci.ymlda jobs: ostida test: va smoke:. Run'da nechta mashina ochiladi?",
    "o": [
     "Bitta — job'lar navbat bilan bir mashinada",
     "Ikkita — har job alohida mashinada",
     "Qadamlar soni qancha bo'lsa, shuncha",
     "Uchta — GitHub Set up job uchun alohida mashina oladi"
    ],
    "c": 1,
    "e": "Har job — o'z mashinasi; needs tartibini beradi.",
    "s": 2
   },
   {
    "q": "Run actions/checkout@v4 logida git fetch … --depth=1. Bu nima?",
    "o": [
     "Butun tarixni yuklaydi — tezlik uchun siqilgan",
     "Faqat oxirgi commit yuklanadi — tarixsiz, tez",
     "Faqat o'zgargan fayllarni yuklaydi",
     "Bir daqiqa ichida tugamasa to'xtatadi"
    ],
    "c": 1,
    "e": "Runner'ga butun tarix kerak emas.",
    "s": 3
   },
   {
    "q": "Run qizil, annotatsiya: Process completed with exit code 1. — npm testda. To'liq sabab qayerda?",
    "o": [
     "Annotatsiyaning o'zida — boshqa joyda yo'q",
     "Set up job logida — xatolar u yerga yig'iladi",
     "npm test qadamining logida — FAIL va test nomi",
     "Commit sahifasida — GitHub xatoni u yerga yozadi"
    ],
    "c": 2,
    "e": "Annotatsiya — manzil, sabab — log.",
    "s": 4
   },
   {
    "q": "Ikkinchi run'da setup-node logida Cache hit for: node-cache-…. npm ci nima qiladi?",
    "o": [
     "Paketlarni o'rnatmaydi — cache'dan ishlataveradi",
     "Saqlangan yuklamalardan o'rnatadi — tezroq, natija bir xil",
     "Lock faylni cache'dagi eski nusxa bilan almashtirib qo'yadi",
     "Faqat o'zgargan paketlarni yuklaydi"
    ],
    "c": 1,
    "e": "Cache — tezlik, to'g'rilik emas.",
    "s": 6
   },
   {
    "q": "matrix [22, 24], fail-fast yozilmagan; 22 yiqildi. 24?",
    "o": [
     "Oxirigacha yuradi — natijasi alohida ko'rinadi",
     "Bekor qilinadi — «cancelled», natijasi noma'lum",
     "Qayta boshlanadi — 22 ning o'rniga",
     "Oxirigacha yuradi, lekin run baribir yashil deb belgilanadi"
    ],
    "c": 1,
    "e": "Odatiy fail-fast: true.",
    "s": 8
   },
   {
    "q": "Smoke'ga Postgres kerak. Lentada baza qayerdan?",
    "o": [
     "Runner'da Postgres o'rnatilgan — hech narsa yozilmaydi",
     "Mentor serveridagi bazaga ulanadi — manzil Secrets'da",
     "services: postgres — job yonida vaqtinchalik konteyner",
     "Smoke bazasiz rejimga o'tadi — natija yashil"
    ],
    "c": 2,
    "e": "Konteyner job bilan tug'iladi va o'ladi.",
    "s": 13
   },
   {
    "q": "yml'da ${{ secrets.DATABSE_URL }} (harf tushgan). Run?",
    "o": [
     "Fayl xatosi — run ochilmaydi",
     "Annotatsiya: «secret not found» — qadam darhol qizil, log bo'sh",
     "Qiymat bo'sh keladi — dastur o'zi yiqiladi, GitHub indamaydi",
     "Run yashil — bo'sh qiymat bilan smoke o'tadi"
    ],
    "c": 2,
    "e": "«DATABASE_URL topilmadi» — kod 2.",
    "s": 14
   },
   {
    "q": "PR ochildi, checks'da smoke qizil. Nima bo'ladi?",
    "o": [
     "Merge tugmasi butunlay yo'qoladi — GitHub qizil check bilan merge'ni taqiqlaydi",
     "PR o'zi yopiladi — qayta ochish kerak",
     "Qizil ko'rinadi — merge qilmaslik sizning qaroringiz (himoya sozlanmagan)",
     "main'dagi lenta ham qizil bo'ladi"
    ],
    "c": 2,
    "e": "Checks ko'rsatadi; taqiq — branch protection bilan.",
    "s": 16
   }
  ]
 },
 "25": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};
