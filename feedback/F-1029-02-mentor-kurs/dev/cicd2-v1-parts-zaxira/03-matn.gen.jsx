
// ============================================================
//  CI/CD-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd2-matn.py (manba: 24-CICD2-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · CI/CD",
  "title": "Lenta yozildi. Endi uni GitHub'da ochib, qizilini o'qiymiz",
  "seg": [
   [
    "a",
    "Oldingi darsdagi lentani GitHub'ga qo'ydik va <b>28 tajriba</b> qildik",
    "Assalomu alaykum. Oldingi darsda lenta faylini yozdik va terminalda sinadik. Bu safar uni haqiqiy GitHub'ga qo'ydik: o'quvchi reposining nusxasida yigirma sakkiz tajriba, har birining logi bilan."
   ],
   [
    "b",
    "Avval Actions oynasi: run, job va qadam, keyin <b>qizil run logi</b>",
    "Avval Actions oynasini o'qishni o'rganamiz: run, job va qadam. Keyin qizil run'ni o'qiymiz: sabab qayerda yozilgan va chiqish kodi nimani bildiradi."
   ],
   [
    "c",
    "Keyin fayl xatolari va o'quvchi darsidagi <b>matrix, cache, secrets haqiqati</b>",
    "Keyin fayl xatolarini ko'ramiz: ba'zida run umuman boshlanmaydi. So'ng o'quvchi darsidagi matrix, cache va secrets namunalarini GitHub'da yurgizib ko'ramiz. Natijalarning ba'zisi kutilmagan."
   ],
   [
    "d",
    "Xulosa: besh bosqich, <b>uch amaliyot</b>; ustoz gapirib bo'lgach Davom ochiladi",
    "Dars besh bosqichdan iborat, uchta amaliyot bor, hammasi o'z reposingizda. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · Actions oynasi",
  "title": "Har push — bitta run: ro'yxatda commit xabari, belgi va vaqt",
  "seg": [
   [
    "a",
    "Repo sahifasidagi Actions bo'limi: har push'dan keyin <b>yangi qator — run</b>",
    "Rejani ko'rdingiz, endi oynaning o'zini ochamiz. GitHub'da repo sahifasida Actions bo'limi bor. Har push'dan keyin u yerda yangi qator paydo bo'ladi. Bu qator run deyiladi: lentaning bitta yurishi."
   ],
   [
    "b",
    "Qator nomi — <b>commit xabari</b>; yonida workflow nomi, tarmoq va push",
    "Qatorning nomi commit xabaringiz. Uning yonida workflow nomi turadi, ya'ni faylning birinchi qatoridagi name: CI. Keyin tarmoq va hodisa, bu yerda push. Shuning uchun commit xabarini tushunarli yozing."
   ],
   [
    "c",
    "Belgi: yashil belgi — hammasi o'tdi, qizil xoch — <b>qaysidir qadam yiqildi</b>",
    "Chap tomonda belgi turadi: yashil belgi hamma qadam o'tdi degani, qizil xoch qaysidir qadam yiqildi degani. Vaqtga ham qarang: to'qqiz soniyalik qizil run odatda o'rnatishgacha ham yetmagan."
   ],
   [
    "d",
    "Xulosa: run'lar <b>tarixi saqlanadi</b> — qizil va undan keyingi yashil ketma-ket ko'rinadi",
    "Xulosa: har push bitta run yaratadi va bu tarix saqlanib qoladi. Ikkinchi run qizil, uchinchisi yashil: xato topildi va tuzatildi. O'quvchi ishini ham shu ro'yxatdan ko'rasiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · Actions oynasi",
  "title": "Run ichida job, job ichida qadamlar; uchtasini GitHub o'zi qo'shadi",
  "seg": [
   [
    "a",
    "Run ichida job ro'yxati: faylda <code>jobs: test:</code> — <b>bitta job <code>test</code></b>",
    "Ro'yxatdagi birinchi run'ni ochamiz. Chap tomonda job'lar ro'yxati turadi. Faylda jobs ostida bitta nom bor, test. Shuning uchun job ham bitta: test. Ikkita nom yozilsa, ikkita job bo'lardi."
   ],
   [
    "b",
    "Job ichida qadamlar: har <code>uses</code> va <code>run</code> — <b><code>Run …</code> nomli qadam</b>",
    "Job ichida esa qadamlar bor. Faylingizdagi har qator qadamga aylangan, oldiga Run so'zi qo'shilgan: run actions checkout, run npm install, run npm test. Eng uzuni o'rnatish qadami, u o'ttiz to'rt soniya davom etdi."
   ],
   [
    "c",
    "<code>Set up job</code>, <code>Post …</code>, <code>Complete job</code> — faylda yo'q, <b>GitHub o'zi qo'shadi</b>",
    "Faylda yo'q qadamlar ham bor. Set up job mashinani tayyorlaydi, Post qadamlari uses'dan keyin tozalaydi, Complete job yakunlaydi. Ularni GitHub o'zi qo'shadi, siz yozmaysiz."
   ],
   [
    "d",
    "Xulosa: o'quvchi <b>«nuqta» desa — job</b>, <b>«amal» desa — qadam</b>",
    "Xulosa: run ichida job, job ichida qadam. O'quvchi darsida nuqta va amal so'zlari ishlatiladi: nuqta bu job, amal bu qadam. Oynada ularni shu nomlar bilan ko'rsating."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "1-bosqich · Actions oynasi",
  "title": "uses qadamining logi — tayyor qadam ichida nima bo'lganini aytadi",
  "seg": [
   [
    "a",
    "<code>uses</code> — boshqalar yozgan <b>tayyor qadam</b>; <code>Set up job</code> uni yuklab oladi",
    "Qadamlar ichiga kiramiz. Uses qadami boshqalar yozgan tayyor dastur. Set up job logida ko'rinadi: GitHub actions checkout'ni o'z reposidan yuklab oldi. Shu yerda mashina ham yozilgan: Ubuntu yigirma to'rt."
   ],
   [
    "b",
    "checkout: papkani tozalaydi va repodan <b>faqat oxirgi commit'ni</b> oladi",
    "Checkout logiga qaraymiz: u avval ish papkasini tozalaydi, keyin git init qiladi va repodan faqat oxirgi commit'ni oladi, fetch depth bir. Shuning uchun lentada git tarixi yo'q, faqat joriy kod."
   ],
   [
    "c",
    "setup-node: Node 22 <b>mashinada tayyor turibdi</b> — o'rnatish soniyadan kam",
    "Setup node qadamida node version yigirma ikki so'radik. Mashinada u tayyor turgan ekan: found in cache. Natijada node yigirma ikki va npm o'n o'rnatilgan. Sizning kompyuteringizdagi npm versiyasidan farq qilishi mumkin."
   ],
   [
    "d",
    "Xulosa: <code>uses</code> qadami tushunarsiz bo'lsa — <b>logini oching</b>, u nima qilganini aytadi",
    "Xulosa: uses qadami qora quti emas. Logini ochsangiz, nima qilganini qadamma-qadam aytadi. GitHub yana bir narsani eslatadi: ubuntu latest Ubuntu yigirma oltiga o'tkazilmoqda, versiya o'zgarishi mumkin."
   ]
  ]
 },
 "5": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Run'dagi qaysi qadam ci.ymlda yozilmagan — uni GitHub o'zi qo'shgan?",
  "q": "Qadamlarni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Run ichidagi qaysi qadam faylingizda yozilmagan, uni GitHub o'zi qo'shgan? Variantni tanlang.",
  "ok": "To'g'ri. Set up job faylda yo'q: GitHub mashinani tayyorlaydi va uses qadamlarini yuklab oladi. Post qadamlari va Complete job ham GitHub'niki. Demak, run'dagi hamma qadam ham sizning faylingizdan emas: tayyorlash va tozalash qadamlarini GitHub o'zi qo'shadi.",
  "okShort": "<code>Set up job</code> — GitHub'niki: mashina va <code>uses</code> qadamlarini tayyorlaydi.",
  "hint": "Faylingizdagi qatorlar oldiga Run qo'shiladi. Qaysi nomda Run yo'q?",
  "correct": 1,
  "opts": [
   "Run npm install",
   "Set up job",
   "Run actions/checkout@v7",
   "Run npm test"
  ],
  "wrong": {
   "0": "Bu sizning run: npm install qatoringiz.",
   "2": "Bu sizning uses: actions/checkout@v7 qatoringiz.",
   "3": "Bu sizning run: npm test qatoringiz."
  }
 },
 "6": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "O'z reposingizdagi oxirgi run: job, qadamlar va Node versiyasi",
  "seg": [
   [
    "a",
    "Endi siz: oldingi darsda lenta qo'shgan reposingizdagi <b>run'ni ochasiz</b>",
    "Endi navbat sizga. Oldingi darsda lenta qo'shgan reposingizni oching. Lenta bo'lmasa, avval tavsiya faylini qo'shib push qiling. Bunga o'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: Actions → oxirgi run → job <code>test</code> va <b>qadamlar ro'yxati</b>",
    "Birinchi qadamda Actions bo'limida oxirgi run'ni ochasiz. Ikkinchisida job test'ni bosib, qadamlarni sanaysiz: siz yozganlari qaysi, GitHub qo'shganlari qaysi."
   ],
   [
    "c",
    "3–4-qadam: <code>Set up job</code> dagi Ubuntu, <code>setup-node</code> dagi <b><code>node:</code> satri</b> — isbot",
    "Uchinchi qadamda Set up job'ni ochib, Ubuntu versiyasini topasiz. To'rtinchisida setup node qadamidagi environment details guruhini ochasiz. Undagi node satrini isbot maydoniga qo'ying."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz o'z run'ingizda qaysi qadamni o'zingiz yozganingizni va qaysini GitHub qo'shganini ajrata olasiz."
   ]
  ]
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · qizilni o'qish",
  "title": "Qizil run'da sabab izohda emas — qizil qadamning logida",
  "seg": [
   [
    "a",
    "Oldingi darsdagi buzish <b>endi GitHub'da</b>: ko'paytirish o'rniga qo'shish, push",
    "Yashil run'ni o'qidik, endi qizil run'ni ko'ramiz. Oldingi darsda terminalda qilgan buzishni GitHub'ga push qildik: ko'paytirish o'rniga qo'shish. Ro'yxatda ikkinchi run qizil xoch bilan chiqdi."
   ],
   [
    "b",
    "Qizil qadam — <code>npm test</code>; build va <code>Post setup-node</code> — <b>kulrang, yurmadi</b>",
    "Run ichida npm test qadami qizil. Undan keyingi build kulrang, skipped, ya'ni yurmadi. Setup node'ning tozalash qadami ham yurmadi. Lenta birinchi qizilda to'xtaydi, terminaldagi kabi."
   ],
   [
    "c",
    "Izohda faqat «exit code 1»; sabab — <b>qadam logida</b>: <code>Expected</code> va <code>Received</code>",
    "Run sahifasi tepasida izoh bor: process completed with exit code bir. Bu sabab emas, faqat kod. Sababni qizil qadam logidan o'qiymiz: expected yigirma ming, received o'n ming ikki."
   ],
   [
    "d",
    "Xulosa: <b>qizil qadamni oching</b>, logdagi xabarni o'qing — tuzatgach run yashil",
    "Xulosa: avval qizil qadamni oching, xabarni logdan o'qing, izohdan emas. Xatoni tuzatib push qildik: uchinchi run yashil, tests bir passed, build ham o'tdi."
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "2-bosqich · qizilni o'qish",
  "title": "Izohdagi son xato turini aytadi: 1, 127, 254, 2, 128",
  "seg": [
   [
    "a",
    "Izohdagi son — qadam qaytargan chiqish kodi; u <b>xato turini</b> taxminan aytadi",
    "Qizil run'larda izoh doim bir xil: process completed with exit code va son. Bu son qizil qadamning chiqish kodi. Biz yigirma sakkiz tajribada beshta turli kod ko'rdik."
   ],
   [
    "b",
    "Kod 1 — buyruq yurdi va <b>«yo'q» dedi</b>: test yiqildi yoki <code>npm ci</code> rad etdi",
    "Kod bir shuni bildiradi: buyruq ishga tushdi va o'zi yo'q dedi. Masalan test yiqildi yoki npm ci lock fayl mos emas dedi. Eng ko'p uchraydigani shu."
   ],
   [
    "c",
    "127 — <b>buyruq topilmadi</b>; 254 — npm fayl topmadi; 2 va 128 — bash va git",
    "Yuz yigirma yetti bo'lsa, buyruq umuman topilmagan, masalan jest o'rnatilmagan. Ikki yuz ellik to'rt bo'lsa, npm package json'ni topmagan. Ikki bo'lsa, bash qatorni tushunmagan. Yuz yigirma sakkiz esa git xatosi."
   ],
   [
    "d",
    "Xulosa: kod — yo'nalish, sabab — <b>logdagi birinchi <code>error</code> satri</b>",
    "Xulosa: kod yo'nalish beradi, sababni esa logdagi birinchi error satri aytadi. O'quvchi «qizil» desa, avval qaysi qadam va qaysi kod deb so'rang."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "2-bosqich · qizilni o'qish",
  "title": "npm ci ikki xil yiqiladi: lock eskirgan yoki lock umuman yo'q",
  "seg": [
   [
    "a",
    "Oldingi darsda terminalda ko'rgan <code>in sync</code> — GitHub'da ham <b>birinchi qadamda qizil</b>",
    "Kodlarni bildik, endi eng ko'p uchraydigan qizilni ko'ramiz: o'rnatish qadami. Oldingi darsda terminalda ko'rgan in sync xatosi GitHub'da ham chiqdi. Run o'n besh soniyada qizil, test'gacha yetmadi."
   ],
   [
    "b",
    "O'quvchi reposi: <b>lock fayl eskirgan</b> — <code>Missing: … from lock file</code>",
    "O'quvchi reposida lock fayl bor, lekin eskirgan: package json'dagi paketlar unda yo'q. Xabarda missing from lock file qatorlari turadi. npm ci bunday holatda hech narsa o'rnatmaydi."
   ],
   [
    "c",
    "«Repongiz yo'qmi?» namunasi: <b>lock umuman yo'q</b> — xabar boshqacha",
    "O'quvchi darsidagi «Repongiz yo'qmi» namunasida lock fayl umuman yo'q. Xabar ham boshqacha: npm ci faqat mavjud package lock bilan ishlaydi. Ikkalasining kodi bir, sababini xabardan ajratasiz."
   ],
   [
    "d",
    "Xulosa: bu repolarda <b><code>npm install</code> yozing</b> — run yashil, 759 paket",
    "Xulosa: o'quvchi repolarida npm install yozing. Shu bilan run yashil bo'ldi, yetti yuz ellik to'qqiz paket o'rnatildi. npm ci kerak bo'lsa, avval lock faylni yangilab push qilish kerak."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "2-bosqich · qizilni o'qish",
  "title": "Qadam yo'q yoki joyi xato: Could not read package.json va jest: not found",
  "seg": [
   [
    "a",
    "Checkout'siz lenta: oldingi darsdagi bo'sh papka <b>GitHub'da ham bo'sh</b>",
    "O'rnatishdan oldin yana bir qizil bor. Oldingi darsda bo'sh papkada package json topilmagan edi. GitHub'da checkout qadamini olib tashladik: xuddi shu xato, kodi ikki yuz ellik to'rt."
   ],
   [
    "b",
    "Logdagi yo'l — <b>mashinadagi ish papkasi</b>; u yerda repo kodi yo'q",
    "Logdagi yo'lga qarang: home runner work va repo nomi. Bu mashinadagi ish papkasi. Checkout bo'lmasa, u bo'sh qoladi va npm package json'ni topmaydi."
   ],
   [
    "c",
    "Tartib xato: <code>npm test</code> o'rnatishdan oldin — <b><code>jest: not found</code>, kod 127</b>",
    "Ikkinchi holat: npm test'ni npm install'dan oldinga qo'ydik. Jest hali o'rnatilmagan, shuning uchun jest not found chiqdi, kodi yuz yigirma yetti. Qadam nol soniyada yiqildi."
   ],
   [
    "d",
    "Xulosa: tartib — <b>checkout, setup-node, <code>npm install</code>, <code>npm test</code>, build</b>; run yashil",
    "Xulosa: tartib doim bir xil: checkout, setup node, npm install, npm test, build. Tavsiya fayli shu tartibda, run yashil. Endi xato satrni o'zingiz topasiz."
   ]
  ]
 },
 "11": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "Logda sh: 1: jest: not found, kod 127. Qaysi satr sabab?",
  "q": "Tartib xatosini ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Run qizil, npm test qadami nol soniyada yiqildi, logda jest not found. Faylning qaysi satri sabab? Shu satrni bosing.",
  "ok": "To'g'ri. O'n birinchi satr: npm test o'rnatishdan oldin turibdi, jest hali yo'q. Uni npm install'dan keyinga qo'yamiz. Ekranda tuzatilgan tartib va yashil run. Demak, qadam nol soniyada yiqilsa, avval qadamlar tartibini tekshiring.",
  "okShort": "11-satr: <code>npm test</code> o'rnatishdan oldin — <code>npm install</code>dan keyinga.",
  "hint": "jest qayerdan keladi? Uni qaysi buyruq o'rnatadi va u qaysi satrda?",
  "task": "Run qizil: <code>Run npm test</code> qadami 0 soniyada yiqildi, logda <code>jest: not found</code>. <b>Sababchi satrni bosing.</b>"
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Tartibni ataylab buzing: qizil qadam, kod va tuzatish",
  "seg": [
   [
    "a",
    "Endi siz: qadamlar <b>tartibini buzasiz</b> va izohdagi kodni o'qiysiz",
    "Endi o'z reposingizda tartibni buzasiz. Oldingi darsda testni buzgandingiz, bu safar faylni buzasiz. Bunga o'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>npm test</code> qatorini <b><code>npm install</code>dan oldinga</b> ko'chiring, push",
    "Birinchi qadamda ci yml'dagi npm test qatorini npm install'dan oldinga ko'chirasiz. Ikkinchisida commit va push qilib, Actions'da yangi run qizil bo'lishini kutasiz."
   ],
   [
    "c",
    "3–4-qadam: <b>qizil qadamdagi kod</b> — isbot; keyin tartibni tiklang, yashil",
    "Uchinchi qadamda run sahifasidagi izohdan chiqish kodini o'qib, isbot maydoniga yozasiz. To'rtinchisida tartibni tiklab, push qilasiz va yashil run'ni kutasiz."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, qadamlar tartibi buzilganda qaysi kod chiqishini o'z run'ingizda ko'rdingiz."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "3-bosqich · fayl xatolari",
  "title": "Fayl o'qilmasa run darhol qizil: job ham, qadam ham, log ham yo'q",
  "seg": [
   [
    "a",
    "Oldingi darsda tahlilchida ko'rgan uch xato — <b>GitHub'da qanday ko'rinadi</b>",
    "Qadamdagi xatolarni ko'rdik, endi faylning o'zidagi xato. Oldingi darsda uch YAML xatosini tahlilchida ko'rgan edik. Endi o'shalarni GitHub'ga push qildik."
   ],
   [
    "b",
    "Run darhol qizil: nol soniya, ichida <b>job ham, qadam ham, log ham yo'q</b>",
    "Natijada run ro'yxatda paydo bo'ladi va shu zahoti qizil bo'ladi. Ichida job yo'q, qadam yo'q, log yo'q. Mashina ishga ham tushmagan, chunki GitHub faylni o'qiy olmadi."
   ],
   [
    "c",
    "Izohda «Invalid workflow file», <b>qator 4</b> — xato esa <b>8-qatorda</b>",
    "Run sahifasida izoh bor: invalid workflow file. On once va runs on xatosida matn tahlilchidagi bilan bir xil. Surilishda esa faqat yaml syntax va to'rtinchi qator deyiladi. Xato aslida sakkizinchi qatorda: GitHub blok boshini, test job'ini ko'rsatdi."
   ],
   [
    "d",
    "To'rtinchi xato: <code>echo</code> ichidagi <b>ikki nuqta</b> — qo'shtirnoqsiz qatorda YAML'ni buzadi",
    "To'rtinchi xato kutilmagan edi: run echo natija ikki nuqta ok qatori. Qatordagi ikki nuqta va bo'sh joy YAML uchun yangi kalit degani. Tahlilchi nested mappings deydi, GitHub'da run darhol qizil."
   ],
   [
    "e",
    "Xulosa: <b>qadamsiz qizil run — fayl xatosi</b>; aniq qatorni tahlilchida toping, <code>run: |</code> bilan yozing",
    "Xulosa: qadami yo'q qizil run ko'rsangiz, bu fayl xatosi. GitHub ko'rsatgan qatordan pastroqqa ham qarang, aniq qatorni tahlilchi beradi. Ikki nuqtali buyruqni run va tik chiziqdan keyingi qatorga yozing: shunday run yurdi."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "3-bosqich · fayl xatolari",
  "title": "Papka nomi xato — run yo'q; runs-on xato — run cheksiz kutadi",
  "seg": [
   [
    "a",
    "Qizildan ham yomoni bor: <b>run umuman yo'q yoki tugamaydi</b>",
    "Qizil run hech bo'lmasa ko'rinadi. Ikki holatda esa qizil ham yo'q. Birinchisi: papka nomida bitta harf xato, workflow o'rniga workflow, s harfisiz."
   ],
   [
    "b",
    "<code>.github/workflow</code> — <b>GitHub faylni ko'rmaydi</b>: Actions'da hech narsa paydo bo'lmaydi",
    "Push qildik va bir yarim daqiqa kutdik: run soni nol. GitHub faylni faqat workflows papkasidan qidiradi. Xato xabari ham yo'q, shuning uchun o'quvchi uzoq qidiradi."
   ],
   [
    "c",
    "<code>runs-on: my-laptop</code> — bunday mashina yo'q, run <b>uch daqiqadan keyin ham kutmoqda</b>",
    "Ikkinchi holat o'quvchi darsidagi noto'g'ri variantdan chiqadi: runs on my laptop. Tahlilchi buni xato demaydi. GitHub esa shu nomli mashinani kutadi: uch daqiqadan keyin ham queued. Biz uni qo'lda bekor qildik."
   ],
   [
    "d",
    "Xulosa: run yo'q — <b>papka nomi</b>; run sariq va kutmoqda — <b><code>runs-on</code> nomi</b>",
    "Xulosa: run umuman yo'q bo'lsa, papka nomini tekshiring. Run sariq bo'lib kutib tursa, runs on qatorini tekshiring. To'g'ri fayl workflows papkasida va ubuntu latest bilan: run yashil."
   ]
  ]
 },
 "15": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "O'quvchi: «Push qildim, run o'n daqiqadan beri sariq, kutmoqda». Sabab?",
  "q": "Kutib turgan run'ni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi push qildi, run o'n daqiqadan beri sariq, kutmoqda. Eng ehtimolli sabab nima? Variantni tanlang.",
  "ok": "To'g'ri. Runs on'da GitHub'da yo'q nom yozilgan, masalan my laptop. Run shu mashinani kutadi va o'zi tugamaydi. Nomni ubuntu latest qilib, eski run'ni bekor qiling. Demak, run sariq bo'lib tugamasa, sabab ko'pincha runs on'dagi nomda.",
  "okShort": "Cheksiz kutish — <code>runs-on</code> nomi: <code>ubuntu-latest</code> qiling.",
  "hint": "Run ishga tushmagan — mashina topilmagan. Mashinani qaysi qator tanlaydi?",
  "correct": 2,
  "opts": [
   "Testlar juda sekin",
   "Fayl .github/workflow papkasida",
   "runs-onda GitHub'da yo'q mashina nomi",
   "Checkout qadami yo'q"
  ],
  "wrong": {
   "0": "Testlar sekin bo'lsa, run sariq emas, «yurmoqda» holatida bo'ladi.",
   "1": "Papka xato bo'lsa, run umuman paydo bo'lmaydi.",
   "3": "Checkout'siz run tez qizil bo'ladi, kutib turmaydi."
  }
 },
 "16": {
  "type": "Lesson",
  "kicker": "4-bosqich · o'quvchi darsidagi namunalar",
  "title": "O'quvchi darsidagi matrix: uch job yashil, lekin uchalasida Node 22",
  "seg": [
   [
    "a",
    "O'quvchi darsida <code>matrix</code>: bir faylda uch Node versiyasi — <b>uch parallel job</b>",
    "Fayl xatolarini bildik, endi o'quvchi darsidagi qo'shimchalarni ko'ramiz. Birinchisi matrix: unda node o'n sakkiz, yigirma va yigirma ikki yozilgan. GitHub bitta job'dan uchta job yasaydi va ularni parallel yurgizadi."
   ],
   [
    "b",
    "Natija: <code>test (18)</code>, <code>test (20)</code>, <code>test (22)</code> — <b>uchalasi yashil</b>",
    "O'quvchi darsidagi faylni aynan shunday push qildik. Run'da uchta job: test o'n sakkiz, test yigirma, test yigirma ikki. Uchalasi yashil. Bir qarashda hammasi joyidadek."
   ],
   [
    "c",
    "Lekin logda uchalasi <code>v22.23.4</code>: <b>matrix <code>setup-node</code>ga ulanmagan</b>",
    "Lekin har job'da node version'ni chiqardik: uchalasida yigirma ikki. Matrix faqat job nomini o'zgartirgan. Setup node'ga qaysi versiya kerakligi aytilmagan, u mashinadagisini qoldirgan."
   ],
   [
    "d",
    "Xulosa: <code>node-version: ${{ matrix.node }}</code> qo'shilgach — <b>18, 20 va 22 haqiqatan</b>",
    "Xulosa: setup node'ga node version qatorini qo'shing va matrix node'ni bering. Shundan keyin logda o'n sakkiz, yigirma va yigirma ikki chiqdi. O'quvchiga yashil belgi emas, logdagi versiyani ko'rsating."
   ]
  ]
 },
 "17": {
  "type": "Lesson",
  "kicker": "4-bosqich · o'quvchi darsidagi namunalar",
  "title": "O'quvchi darsidagi cache qizil: key majburiy. To'g'risi — setup-node cache: npm",
  "seg": [
   [
    "a",
    "O'quvchi darsida <code>actions/cache</code> va <code>path: node_modules</code> — <b>«5 baravar tez»</b>",
    "Ikkinchi qo'shimcha cache. O'quvchi darsida actions cache qadami bor, faqat path yozilgan, va besh baravar tezlashadi deyilgan. Shu faylni o'quvchi reposiga push qildik."
   ],
   [
    "b",
    "Natija: <b>cache qadami qizil</b> — <code>Input required and not supplied: key</code>",
    "Natijada cache qadamining o'zi qizil bo'ldi. Izohda key kiritilmagan deyilgan. Bu qadam uchun key majburiy. O'rnatish ham, build ham yurmadi: o'quvchi faylni ko'chirsa, lentasi tezlashmaydi, to'xtaydi."
   ],
   [
    "c",
    "To'g'risi — <code>setup-node</code>da <b><code>cache: npm</code></b>: o'rnatish 44 soniyadan 16 soniyaga",
    "Oddiyroq yo'l bor: setup node'ga cache npm qatorini qo'shish. O'lchab ko'rdik: cache'siz o'rnatish qirq to'rt soniya davom etdi. Birinchi run'da foyda yo'q, kesh endi saqlanadi. Ikkinchi run'da esa o'n olti soniya."
   ],
   [
    "d",
    "Xulosa: kesh <b>ikkinchi run'dan ishlaydi</b>, o'rnatish taxminan 2,8 baravar tez — 5 emas",
    "Xulosa: kesh ikkinchi run'dan boshlab ishlaydi. Bu repoda o'rnatish taxminan ikki yarim, uch baravar tezlashdi, besh emas. O'quvchiga raqamni o'z run'idan ko'rsating."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "4-bosqich · o'quvchi darsidagi namunalar",
  "title": "Secret logda `",
  "seg": [
   [
    "a",
    "O'quvchi darsi: secret «logda hech qachon ochiq ko'rinmaydi»; <b>tekshirdik</b>",
    "Uchinchi qo'shimcha secrets. O'quvchi darsida kalit faylda emas, seyfda turadi va logda hech qachon ochiq ko'rinmaydi deyilgan. Sinov kaliti qo'yib, logga chiqarib ko'rdik."
   ],
   [
    "b",
    "To'g'ridan chiqarilsa — <b><code>***</code></b>; qadam nomida ham yashiriladi",
    "Kalitni to'g'ridan echo qilsak, logda uchta yulduzcha chiqadi. Qadam nomida ham yulduzcha turadi. GitHub qiymatni aynan shu ko'rinishda qidiradi va yashiradi."
   ],
   [
    "c",
    "Bo'laklab chiqarilsa — kalit logda <b>to'liq ochiq</b>; yo'q secret esa bo'sh qator",
    "Lekin kalitni ikki bo'lakka bo'lib chiqardik: logda to'liq ochiq. Aynan qiymat bo'lmagani uchun yashirilmadi. Yana bir narsa: yozilmagan secret xato bermaydi, bo'sh qator qaytaradi, run yashil."
   ],
   [
    "d",
    "Xulosa: secret'ni <b>logga umuman chiqarmang</b>; yo'q secret run'ni qizil qilmaydi",
    "Xulosa: secret'ni logga umuman chiqarmang, yulduzcha faqat aynan qiymatni yashiradi. Kalit nomi xato bo'lsa, run yashil qoladi, xato keyin chiqadi. Kalit nomini sinchiklab tekshiring."
   ]
  ]
 },
 "19": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "O'z lentangizga matrix: Node 20 va 22, versiya logda",
  "seg": [
   [
    "a",
    "Endi siz: lentangizni ikki Node versiyasida yurgizasiz va <b>logdan tekshirasiz</b>",
    "Oxirgi amaliyot: lentangizni ikki Node versiyasida yurgizasiz va versiyani yashil belgidan emas, logdan tekshirasiz. Bunga o'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>strategy: matrix: node: [20, 22]</code> va <b><code>node-version: ${{ matrix.node }}</code></b>",
    "Birinchi qadamda job ichiga strategy, matrix va node qatorini yozasiz: yigirma va yigirma ikki. Ikkinchisida setup node'dagi node version qatoriga matrix node'ni berasiz. Ekrandagi fayl namuna."
   ],
   [
    "c",
    "3–4-qadam: <code>node --version</code> qadami, push; <b><code>test (20)</code> dagi versiya</b> — isbot",
    "Uchinchi qadamda setup node'dan keyin node version'ni chiqaradigan qadam qo'shib, push qilasiz. To'rtinchisida test yigirma job'ini ochib, chiqqan versiyani isbot maydoniga yozasiz."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, matrix haqiqatan ishlayotganini yashil belgidan emas, logdagi versiyadan bilasiz."
   ]
  ]
 },
 "20": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "O'quvchi darsidagi actions/cache@v4 + path: node_modules ko'chirildi. Nima bo'ladi?",
  "q": "Namunalarni ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. O'quvchi darsidagi cache qadamini, faqat path bilan, o'z reposiga ko'chirdi va push qildi. Nima bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Actions cache uchun key majburiy. Qadam qizil, o'rnatish va build yurmaydi. To'g'risi: setup node'da cache npm, ikkinchi run'dan o'rnatish tezlashadi. Demak, o'quvchi darsidan ko'chirilgan faylni ham GitHub'da yurgizib, natijasini tekshirish kerak.",
  "okShort": "<code>key</code>siz <code>actions/cache</code> — qizil; <code>setup-node</code> <code>cache: npm</code> yozing.",
  "hint": "Izohdagi so'zni eslang: qaysi kirish yetishmadi?",
  "correct": 3,
  "opts": [
   "Ikkinchi run'dan besh baravar tez",
   "Yashil, lekin kesh saqlanmaydi",
   "Fayl xatosi, run qadamsiz qizil",
   "Cache qadami qizil: Input required and not supplied: key"
  ],
  "wrong": {
   "0": "Run kesh qadamida to'xtaydi, tezlik o'lchanmaydi ham.",
   "1": "Yashil bo'lmaydi: qadam majburiy kirishsiz ishlamaydi.",
   "2": "Tahlilchi bu faylni xatosiz deydi: xato faqat qadam yurganda chiqadi."
  }
 },
 "21": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4c-03 · «GitHub Actions — yo'l xaritasini yozish»",
  "title": "m4c-03: yo'l xaritasi, nuqta va amal — 23 ekran",
  "seg": [
   [
    "a",
    "m4c-03 — 23 ekran: <b>yo'l xaritasi, nuqta, amal</b> va qo'shimchalar",
    "Endi o'quvchi darsini ko'ramiz: m4c-03, unda yigirma uch ekran bor. Darsda fayl yo'l xaritasi, job nuqta, qadam esa amal deb ataladi. Dars besh blokdan iborat: kirish, YAML, on va runs on, qo'shimchalar va markaziy ekran."
   ],
   [
    "b",
    "O'quvchi darsida <code>@v4</code> — ishlaydi, lekin GitHub <b>har run'da ogohlantiradi</b>",
    "Birinchi farq versiyada: o'quvchi darsida checkout va setup node'ning to'rtinchi versiyasi yozilgan. Sinadik: run yashil, lekin har safar Node yigirma eskirgan degan ogohlantirish chiqadi. Yettinchisini tavsiya qiling."
   ],
   [
    "c",
    "Qo'shimchalar blokida <b>uch tuzatish</b>: matrix'ni ulang, <code>cache: npm</code>, secret'ni chiqarmang",
    "Qo'shimchalar blokida uchta tuzatish aytasiz: matrix'ni setup node'ga ulang, cache uchun setup node'dagi cache npm, secret'ni logga umuman chiqarmang. Dalillari o'n oltinchi, o'n yettinchi va o'n sakkizinchi ekranlarda."
   ],
   [
    "d",
    "Xulosa: o'quvchi yozgan har faylni push qildiring — natijani <b>Actions'da birga o'qing</b>",
    "Xulosa: o'quvchi darsi simulyatsiya, Actions esa haqiqat. Har o'quvchi faylini push qilsin va run'ni siz bilan birga o'qisin. Simulyatsiya qayerda farq qilishini keyingi ekranda ko'ramiz."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi darsini o'tish",
  "title": "O'quvchi darsidagi to'rt holat GitHub'da boshqacha chiqadi",
  "seg": [
   [
    "a",
    "Simulyatsiyada o'tgan begona qatorlar GitHub'da <b>run'ni qizil qiladi</b>",
    "Xaritani ko'rdingiz, endi farqlarni ko'ramiz. Markaziy ekranda begona qatorlar bor: print test va git push. Simulyatsiya ularni o'tkazadi. GitHub'da ikkalasi qizil: birinchisini bash tushunmaydi, ikkinchisiga ruxsat yo'q."
   ],
   [
    "b",
    "<code>git push</code> — 403: lentadagi token repoga <b>faqat o'qish</b> uchun ruxsat oladi",
    "Git push nega 403? Set up job logida yozilgan: token ruxsati contents read, ya'ni faqat o'qish. Lenta repoga o'zi yozolmaydi. O'quvchi so'rasa, shu satrni ko'rsating."
   ],
   [
    "c",
    "<b>Testsiz lenta — yashil</b>; «Repongiz yo'qmi?» namunasida test doim yashil",
    "Yakuniy ekranda test qadami yo'q lenta qizil deyiladi. Haqiqatda run yashil: tekshirmaydigan lenta xato topmaydi. «Repongiz yo'qmi» namunasida test doim yashil, qizil uchun skriptni exit bir qiling."
   ],
   [
    "d",
    "Xulosa: o'quvchiga ayting — yashil belgi <b>faqat yozilgan qadamlar</b> o'tganini bildiradi",
    "Xulosa: o'quvchiga ayting, yashil belgi faqat yozilgan qadamlar o'tdi degani. Test qadami bo'lmasa, yashil hech narsani kafolatlamaydi. Shuning uchun lentada npm test albatta bo'lsin."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "5-bosqich · sinfda",
  "title": "O'quvchi darsidagi so'zni Actions oynasida ko'rsating; sinfdagi olti holat",
  "seg": [
   [
    "a",
    "O'quvchi darsi so'zlarini <b>Actions oynasidagi joy</b> bilan birga ko'rsating",
    "Farqlarni bildingiz, endi sinfda ishlatiladigan so'zlarni ko'ramiz. O'quvchi yo'l xaritasi, nuqta va amal deydi. Siz har so'z bilan Actions oynasidagi joyni ko'rsating: nuqta, ya'ni job."
   ],
   [
    "b",
    "Uch holat <b>run'ning o'zidan</b> taniladi: run yo'q, sariq kutish, qadamsiz qizil",
    "Endi sinfda chiqadigan holatlar. Uchtasi run'ning o'zidan taniladi. Run yo'q bo'lsa, papka nomi xato. Run sariq kutib tursa, runs on xato. Qadamsiz qizil bo'lsa, fayl xatosi."
   ],
   [
    "c",
    "Uch holat <b>kod va logdan</b>: 127, 254 va <code>npm ci</code> dagi kod 1",
    "Qolgan uchtasi kod va logdan taniladi. Kod yuz yigirma yetti bo'lsa, jest yo'q, install'ni oldinroq qo'ying. Ikki yuz ellik to'rt bo'lsa, checkout yo'q. Kod bir va in sync bo'lsa, npm install yozing."
   ],
   [
    "d",
    "Xulosa: javobni aytmang — o'quvchi bilan qizil qadam, kod va logni <b>birga o'qing</b>",
    "Xulosa va usul bitta: javobni darhol aytmang. O'quvchi bilan birga o'qing: qaysi qadam qizil, qaysi kod va logdagi birinchi error satri nima deydi. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Actions'da har push nimani yaratadi?",
    "o": [
     "bitta run",
     "bitta repo",
     "bitta tarmoq",
     "bitta secret"
    ],
    "c": 0,
    "e": "Run nomi — commit xabari.",
    "s": 2
   },
   {
    "q": "Set up job qadami qayerdan keladi?",
    "o": [
     "ci.ymldagi birinchi qator",
     "GitHub o'zi qo'shadi",
     "checkout ichidan",
     "npm installdan"
    ],
    "c": 1,
    "e": "Mashina va uses qadamlarini tayyorlaydi.",
    "s": 3
   },
   {
    "q": "Qizil run'da sababni qayerdan o'qiysiz?",
    "o": [
     "izohdagi «exit code»",
     "run nomidan",
     "qizil qadam logidan",
     "davomiyligidan"
    ],
    "c": 2,
    "e": "Izohda faqat kod.",
    "s": 7
   },
   {
    "q": "npm test npm installdan oldin turibdi — logda?",
    "o": [
     "in sync",
     "Could not read package.json",
     "Received: 10002",
     "jest: not found, kod 127"
    ],
    "c": 3,
    "e": "Jest hali o'rnatilmagan.",
    "s": 10
   },
   {
    "q": "runs-on: my-laptop bilan run?",
    "o": [
     "sariq holda cheksiz kutadi",
     "darhol qizil",
     "yashil",
     "paydo bo'lmaydi"
    ],
    "c": 0,
    "e": "Bunday mashina yo'q, tahlilchi xato demaydi.",
    "s": 14
   },
   {
    "q": "Fayl .github/workflow/ci.yml da (s yo'q)?",
    "o": [
     "qadamsiz qizil run",
     "run umuman yo'q",
     "sariq kutadi",
     "yashil"
    ],
    "c": 1,
    "e": "GitHub faqat workflowsdan qidiradi.",
    "s": 14
   },
   {
    "q": "matrix: node: [18, 20, 22], node-version yo'q?",
    "o": [
     "uch xil versiya",
     "bitta job",
     "uch job, uchalasida Node 22",
     "fayl xatosi"
    ],
    "c": 2,
    "e": "Matrix setup-nodega ulanmagan.",
    "s": 16
   },
   {
    "q": "Secret ikki bo'lakka bo'lib chiqarildi — logda?",
    "o": [
     "***",
     "bo'sh qator",
     "run qizil",
     "to'liq ochiq"
    ],
    "c": 3,
    "e": "Faqat aynan qiymat yashiriladi.",
    "s": 18
   }
  ]
 },
 "25": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};
