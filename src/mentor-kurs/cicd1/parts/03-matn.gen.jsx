
// ============================================================
//  CI/CD-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd1-matn.py (manba: 14-CICD1-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · CI/CD",
  "title": "Jest-2 da 25 test yozdingiz — bugun ular har push'da GitHub'ning o'zida yuradi, siz esa faqat yashil-qizilni ko'rasiz",
  "seg": [
   [
    "a",
    "Jest-2 da testlar yozildi — bugun ular <b>har push'da GitHub'ning o'zida</b> yuradi",
    "Assalomu alaykum. Jest ikkinchi darsida OrderBotNest'ga yigirma beshta test yozdingiz. Hozir ular faqat siz npm test desangiz yuradi. Bugun ularni lentaga topshiramiz: har push'da GitHub'ning o'zida yuradi. Ekranda dars oxiridagi natija: oltita qadam, hammasi yashil."
   ],
   [
    "b",
    "Avval <b>umumiy tushuncha</b>: CI/CD nima qiladi, lenta nima, nega kerak",
    "Avval umumiy tushunchani olamiz: CI/CD nima qiladi va nega kerak. Keyin lentani o'z kompyuteringizda qo'lda yurgizasiz, shundan keyin GitHub'ga topshirasiz. Lenta qayerda yiqilishini to'rt tuzoqda ko'rasiz."
   ],
   [
    "c",
    "Haqiqiy topilma: <b>lokalda yashil, lentada qizil</b> — va AI yozgan workflow'lar",
    "Beshinchi bosqichda haqiqiy topilma: lokalda hammasi yashil edi, lentada qizil chiqdi. Sababini birga topamiz. Keyin ikki AI yozgan workflow'ni lentada sinaymiz. Oxirida CD nima va sinfga tayyorgarlik."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot; kerak: <b>GitHub'da o'z reposingiz</b>",
    "Dars olti bosqich, uchta amaliyot. Amaliyotlar uchun GitHub'da o'z reposingiz kerak: OrderBotNest nusxangizni push qila olishingiz kifoya. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "CI — har push'da toza mashinada sizning buyruqlaringiz yuradi; CD — tekshirilgan yukni chiqarish. Ikkalasi bitta narsani hal qiladi: «menda ishlaydi»",
  "seg": [
   [
    "a",
    "Muammo: <b>«menda ishlaydi»</b> — hamkorda qizil, chunki uning mashinasi boshqa",
    "Tanish holat: sizda npm test yashil, push qildingiz, hamkor clone qildi, unda qizil. Menda ishlaydi, deysiz. Ikkalangiz ham haqsiz: uning node modules papkasi boshqa, Node versiyasi boshqa, env fayli boshqa. Kod bir xil, mashina boshqa."
   ],
   [
    "b",
    "CI: har push'da <b>toza mashinada sizning buyruqlaringiz</b> yuradi — hammaga bir xil javob",
    "CI shuni hal qiladi. Continuous Integration: har push'dan keyin GitHub'dagi toza mashina kodni olib, aynan sizning buyruqlaringizni yurgizadi: o'rnatish, turlar, test, build. Mashina hamma uchun bir xil, javob ham bir xil: yashil yoki qizil. Menda ishlaydi, degan bahs yo'q."
   ],
   [
    "c",
    "CD: <b>tekshirilgan yukni chiqarish</b> — Delivery odam tasdiqlaydi, Deployment o'zi chiqaradi",
    "CD ikkinchi yarmi: tekshirilgan yukni chiqarish. Continuous Delivery: paket tayyor, odam tugmani bosadi. Continuous Deployment: lenta o'zi chiqaradi, odam yo'q. Ikkalasi ham CI'dan keyin, chunki qizil yukni hech kim chiqarmaydi."
   ],
   [
    "d",
    "Xulosa: bugun <b>CI to'liq, CD chegaragacha</b> — OrderBotNest'ning lentasi har push'da yashil yoki qizil",
    "Xulosa: CI, har push'da toza mashinada tekshirish. CD, tekshirilgan yukni chiqarish. Bugun CI'ni oxirigacha qilamiz: OrderBotNest'ning lentasi har push'da yashil yoki qizil deydi. CD'ni chegarasigacha ko'ramiz: bot bazasiz va tokensiz chiqmaydi. Endi lentaning o'zi nima."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "Lenta — buyruqlar ketma-ketligi: har biri chiqish kodi qaytaradi, 0 — yashil, boshqasi — qizil; qizildan keyin qolgani yurmaydi",
  "seg": [
   [
    "a",
    "To'rt qadam: <b><code>npm ci</code> → <code>tsc</code> → <code>npm test</code> → <code>npm run build</code></b> — har biri bitta terminal buyrug'i",
    "Lenta sirli narsa emas: bu siz terminalda yozadigan buyruqlar ketma-ketligi. OrderBotNest uchun to'rtta: npm si ay, paketlarni o'rnatadi. npx tsc, turlarni tekshiradi. npm test. npm run build, dist papkasini yig'adi. Lenta shu to'rttasini tartib bilan yurgizadi."
   ],
   [
    "b",
    "Har qadam <b>bitta savolga javob beradi</b>: o'rnatildimi, turlar to'g'rimi, test yashilmi, yig'ildimi",
    "Har qadam bitta savolga javob beradi. Paketlar o'rnatildimi. Turlar to'g'rimi. Testlar yashilmi. Build yig'ildimi. To'rt savol, to'rt javob. Hozircha eslint qadami yo'q: OrderBotNest'da lint sozlanmagan, lentaga faqat ishlaydigan buyruq qo'yiladi."
   ],
   [
    "c",
    "Chiqish kodi: <b>0 — yashil, boshqasi — qizil</b>; <code>tsc</code> 2 beradi, <code>jest: not found</code> 127 beradi",
    "Har buyruq tugaganda son qaytaradi, bu chiqish kodi. Nol, hammasi yaxshi, yashil. Boshqa son, qizil. Jest qizil testda bir beradi, tsc tur xatosida ikki, buyruq topilmasa yuz yigirma yetti. Lenta sonning o'zini bilmaydi, faqat nolmi yoki yo'qmi, shuni qaraydi."
   ],
   [
    "d",
    "Xulosa: <b>qizil qadamdan keyin qolgani yurmaydi</b> — test qizil bo'lsa, build boshlanmaydi",
    "Xulosa: lenta to'rt buyruq, har biri chiqish kodi bilan. Birinchi qizil qadamda lenta to'xtaydi, qolgani yurmaydi: test qizil bo'lsa build boshlanmaydi, buzuq kod hech qachon yig'ilmaydi. Endi shu lentani o'z kompyuteringizda, toza papkada qo'lda yurgizamiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "2-bosqich · lenta qo'lda",
  "title": "Lenta mashinasi har safar bo'sh papkadan boshlaydi — biz ham: yangi clone, node_modules yo'q, to'rt buyruq ketma-ket, har biri chiqish kodi bilan",
  "seg": [
   [
    "a",
    "Yangi papkaga clone: <b><code>node_modules</code> yo'q</b> — lenta mashinasi ham shunday boshlaydi",
    "OrderBotNest'ni yangi papkaga clone qiling: git clone, keyin jest ikki done tegiga o'ting. VS Code'da oching, terminalda ls. Yetti narsa: package json, lock, src va hokazo. Node modules yo'q, env yo'q. Lenta mashinasi har safar aynan shunday bo'sh papkadan boshlaydi."
   ],
   [
    "b",
    "<code>npm ci</code>: <b>633 paket, 6 soniya</b> — lock fayldan aynan; keyin <code>tsc</code> — 3 soniya, chiqish kodi 0",
    "Birinchi buyruq npm si ay: lock fayldagi versiyalarni aynan o'rnatadi, olti yuz o'ttiz uchta paket, olti soniya, chiqish kodi nol. Ikkinchisi npx tsc no emit: turlarni tekshiradi, fayl yozmaydi. Uch soniya, chiqish kodi nol: xato yo'q."
   ],
   [
    "c",
    "<code>npm test</code>: <b>25 test yashil, 2 soniya</b>; <code>npm run build</code>: <code>dist</code> papkasi, 4 soniya",
    "Uchinchisi npm test: beshta fayl, yigirma beshta test, hammasi yashil, ikki soniya. To'rtinchisi npm run build: nest build dist papkasini yig'adi, to'rt soniya. Ls dist: main js va boshqa fayllar. To'rtala qadam nol bilan tugadi."
   ],
   [
    "d",
    "Xulosa: <b>to'rt buyruq, 15 soniya, to'rt nol</b> — bu lenta; GitHub'da aynan shu yuradi",
    "Xulosa: to'rt buyruq, jami o'n besh soniya, to'rtala chiqish kodi nol, lenta yashil. Siz hozir qo'lda qilgan ishni GitHub'dagi mashina har push'da o'zi qiladi, aynan shu buyruqlar bilan. Lekin avval bitta narsani tekshirib olaylik."
   ]
  ]
 },
 "5": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Toza clone'da to'g'ridan npm test yozdik. Terminal: sh: 1: jest: not found, chiqish kodi 127. Sabab nima?",
  "q": "Lentani ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Toza clone'da npm si ay'ni o'tkazib yuborib, to'g'ridan npm test yozdik. Terminal: jest not found, chiqish kodi yuz yigirma yetti. Sabab nima? Variantni tanlang.",
  "ok": "To'g'ri. Jest package json'da bor, lekin o'rnatilmagan: node modules papkasi yo'q, chunki npm si ay yurmadi. Lentada bu eng ko'p uchraydigan xato: o'rnatish qadami tushib qolgan yoki tartibi noto'g'ri. Demak, lentada birinchi qadam doim o'rnatish, qolgani undan keyin.",
  "okShort": "<code>node_modules</code> yo'q — <code>npm ci</code> yurmagan. Lentada birinchi qadam doim o'rnatish.",
  "hint": "ls da node_modules bormi? jest buyrug'i qayerdan keladi?",
  "demak": "Lentada birinchi qadam — o'rnatish (<code>npm ci</code>); toza mashinada <code>node_modules</code> yo'q.",
  "correct": 1,
  "opts": [
   "Jest package.jsonda umuman yo'q — avval ro'yxatga qo'shish kerak",
   "node_modules yo'q — npm ci qadami tushib qolgan",
   "Node versiyasi eski — Jest ishlamaydi",
   "Test fayllari yo'q — Jest «not found» deydi"
  ],
  "wrong": {
   "0": "package.json da jest bor (devDependencies); muammo o'rnatishda, ro'yxatda emas.",
   "2": "Node 24 — yangi; not found versiya emas, fayl yo'qligi.",
   "3": "Test fayli yo'q bo'lsa Jest No tests found deydi; bu yerda Jest'ning o'zi topilmadi."
  }
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · buzamiz",
  "title": "Kodni buzamiz va to'rt buyruqni && bilan bog'laymiz: npm ci ✓, tsc ✓, test qizil — build boshlanmaydi, chiqish kodi 1",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>&lt;</code> ustiga bosing",
    "Lentaning to'rt buyrug'ini bilasiz. Endi ataylab buzamiz. Buzishni o'zingiz qilasiz: src, api, order papkasidagi order service ts faylining o'ttiz oltinchi satrida kichik belgisi yonib turibdi, ustiga bosing: u kichik yoki tengga aylanadi.",
    "<b>order.service.ts</b> 36-satridagi <b><code>&lt;</code></b> ustiga bosing — <code>&lt;=</code> bo'ladi."
   ],
   [
    "a",
    "Buzildi: <code>order.service.ts</code> 36-satr <b><code>&lt;</code> → <code>&lt;=</code></b> — Jest-2 dagi chegara testi buni ushlaydi",
    "Kichik endi kichik yoki teng. Jest ikkinchi darsidan eslaysiz: aynan ikkita qolganda ikkitasini sotib bo'lmaydi, chegara testi buni ushlaydi."
   ],
   [
    "b",
    "To'rt buyruq <b><code>&amp;&amp;</code> bilan bitta qatorda</b>: oldingisi nol bersa, keyingisi yuradi",
    "Bu safar to'rt buyruqni bitta qatorda yozamiz, oralarida ikki ampersand. Ma'nosi: oldingisi nol bersa, keyingisi yuradi, nol bermasa, to'xtaydi. Terminalda: npm si ay, ampersand, npx tsc, ampersand, npm test, ampersand, npm run build."
   ],
   [
    "c",
    "Natija: <b><code>npm ci</code> ✓, <code>tsc</code> ✓, test FAIL — <code>build</code> satri umuman yo'q</b>, chiqish kodi 1",
    "Natijaga qarang. Npm si ay yashil, tsc yashil. Npm test: FAIL, chegara testi, Kolonka, omborda faqat ikkita qoldi, o'ttiz yettinchi satr. Va pastda build satri umuman yo'q: nest build boshlanmadi. Butun qatorning chiqish kodi bir."
   ],
   [
    "d",
    "Xulosa: <b>zanjir birinchi qizilda uziladi</b> — GitHub lentasi ham aynan shunday, faqat «yurmadi» deb yozadi",
    "Xulosa: zanjir birinchi qizil qadamda uziladi, buzuq kod yig'ilmaydi. GitHub lentasi aynan shunday ishlaydi, faqat yurmagan qadamni skipped, ya'ni yurmadi deb ko'rsatadi. Satrni tiklang: git checkout, order service ts. Endi lentani o'zingiz qo'lda yurgizasiz."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 12 daqiqa",
  "title": "Toza clone'da to'rt buyruqni && bilan yurgiting, keyin kodni buzib zanjir uzilishini ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: <b>yangi papkaga clone, <code>jest2-done</code> tegi</b>, to'rt buyruq zanjiri",
    "Endi navbat sizga. OrderBotNest'ni yangi papkaga clone qilasiz, jest ikki done tegiga o'tasiz, to'rt buyruqni ampersand bilan yurgizasiz. Baza va token kerak emas. O'n ikki daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>clone va zanjir</b> — to'rtala qadam nol, <code>dist</code> papkasi paydo bo'ladi",
    "Birinchi qadamda git clone va git checkout jest ikki done. Ikkinchisida to'rt buyruq zanjiri: npm si ay, tsc, test, build. Oxirida dist papkasi paydo bo'lishi kerak, tests satri yigirma besh passed."
   ],
   [
    "c",
    "3–4-qadam: <b>36-satrni buzib</b> zanjirni yurgizing — <code>build</code> yurmaydi; tiklang; isbot — <code>Tests:</code> satri",
    "Uchinchi qadamda order service ts'ning o'ttiz oltinchi satrida kichikni kichik yoki tengga buzib, zanjirni qayta yurgizasiz: test qizil, build yurmaydi. To'rtinchisida git checkout bilan tiklaysiz. Isbot maydoniga uchinchi qadamdagi tests satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz lentani qo'lda yurgizgan va qizilda uzilishini ko'rgan bo'lasiz."
   ]
  ],
  "steps": [
   {
    "t": "Toza clone",
    "cmds": [
     "git clone https://github.com/Azizbekcrypto/OrderBotNest.git lenta",
     "cd lenta",
     "git checkout jest2-done",
     "ls"
    ],
    "exp": "node_modules yo'q"
   },
   {
    "t": "Zanjir",
    "cmds": [
     "npm ci && npx tsc --noEmit && npm test && npm run build",
     "ls dist"
    ],
    "exp": "Tests: 25 passed, 25 total · dist/main.js"
   },
   {
    "t": "Buzish",
    "cmds": [
     "src/api/order/order.service.ts 36-satr < → <=",
     "zanjirni qayta yurgizing"
    ],
    "exp": "Tests: 1 failed, 24 passed, 25 total · build yurmadi"
   },
   {
    "t": "Tiklash",
    "cmds": [
     "git checkout -- src/api/order/order.service.ts",
     "zanjir"
    ],
    "exp": "Tests: 25 passed, 25 total"
   }
  ],
  "proof": {
   "label": "3-qadamdagi Tests: satri",
   "placeholder": "masalan: Tests: 1 failed, 24 passed, 25 total",
   "re": "Tests:\\s+1 failed,\\s+24 passed",
   "flags": "",
   "wrong": "Buzilgan kodda bitta test qizil bo'lishi kerak — 3-qadamdagi Tests: qatorini qo'ying."
  },
  "trouble": [
   [
    "error: pathspec 'jest2-done' did not match",
    "teglar olinmagan — git fetch --tags, keyin checkout"
   ],
   [
    "sh: 1: jest: not found",
    "npm ci yurmagan yoki zanjirda yo'q — birinchi buyruq npm ci"
   ],
   [
    "3-qadamda hammasi ✓",
    "36-satr o'zgarmagan yoki boshqa satr — if (p.stock <= c.qty) bo'lsin"
   ],
   [
    "build baribir yurdi",
    "buyruqlar ; bilan bog'langan — && bo'lsin: ; qizilda to'xtamaydi"
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "3-bosqich · GitHub Actions",
  "title": ".github/workflows/ci.yml — lentaning yo'l xaritasi: qachon (on), qaysi mashinada (runs-on), qaysi qadamlar (steps); uses — tayyor qadam, run — sizning buyrug'ingiz",
  "seg": [
   [
    "a",
    "Fayl <b><code>.github/workflows/ci.yml</code></b> — GitHub shu papkadagi har faylni lenta deb o'qiydi",
    "OrderBotNest papkangizda, ildizda, nuqta github papkasini, ichida workflows papkasini, ichida ci yml faylini yarating. GitHub shu papkadagi har faylni lenta deb o'qiydi. Birinchi ikki satr: name, lentaning nomi, va on: qachon yursin. Push va pull request."
   ],
   [
    "b",
    "<code>jobs</code> → <code>test</code> → <b><code>runs-on: ubuntu-latest</code></b> — GitHub'dagi toza Ubuntu mashina",
    "Uchinchidan beshinchi satrgacha: jobs, ya'ni ishlar. Bitta ish, nomi test. Runs on, ubuntu latest: GitHub'dagi toza Ubuntu mashina. Har run'da yangi mashina, bo'sh papka, siz to'rtinchi ekranda ko'rgan holat."
   ],
   [
    "c",
    "<code>steps</code>: <b><code>checkout</code> kodni olib keladi, <code>setup-node</code> Node 24 ni o'rnatadi</b> — <code>uses</code>, tayyor qadamlar",
    "Oltinchidan: steps, qadamlar. Birinchi ikkitasi uses bilan, tayyor qadamlar. Actions checkout: mashinaga reponi olib keladi, usiz papka bo'sh. Setup node: Node yigirma to'rtni o'rnatadi, mashinangizdagi bilan bir xil, va npm keshini yoqadi."
   ],
   [
    "d",
    "Xulosa: <b>to'rt <code>run:</code> satri — to'rtinchi ekrandagi to'rt buyruq</b>, aynan o'sha tartibda",
    "Xulosa: oxirgi to'rt satr run bilan, bular sizning buyruqlaringiz: npm si ay, tsc, test, build, aynan to'rtinchi ekrandagi tartibda. Ci yml uch qism: qachon, qaysi mashinada, qaysi qadamlar. Faylni saqlang, endi push qilamiz."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · GitHub Actions",
  "title": "git push — va GitHub'ning Actions bo'limida run paydo bo'ladi: bitta job, oltita qadam, har biri soniyasi bilan, hammasi yashil",
  "seg": [
   [
    "a",
    "Push qiling — <b>GitHub'da Actions bo'limi</b>: run paydo bo'ldi, sariq nuqta — yuryapti",
    "Terminalda git add, commit, push. Brauzerda reponi oching, yuqorida Actions bo'limi. Yangi run paydo bo'ldi: nomi commit xabaringiz, yonida sariq nuqta, yuryapti. Bir daqiqadan kam kuting."
   ],
   [
    "b",
    "Run ichida: <b>bitta job <code>test</code>, oltita qadam</b> — <code>checkout</code>, <code>setup-node</code>, to'rt buyruq, har biri soniyasi bilan",
    "Run'ni oching. Chapda job: test. O'ngda qadamlar: set up job, GitHub'ning o'zi qo'shgan. Keyin checkout, setup node, va to'rt buyrug'ingiz. Har qadam yonida yashil belgi va necha soniya yurgani. Hammasi yashil, run yashil."
   ],
   [
    "c",
    "Qadamni bossangiz — <b>log, sizning terminalingizdagi matn</b>: <code>PASS</code>, <code>Tests: 25 passed</code>",
    "Npm test qadamini bosing: log ochiladi. Bu aynan sizning terminalingizdagi matn: PASS, beshta fayl, yigirma besh passed. Faqat uni siz emas, GitHub'dagi mashina yurgizdi. Shu logni o'qiy olsangiz, lentaning hamma xatosini topa olasiz."
   ],
   [
    "d",
    "Xulosa: <b>push → toza mashina → sizning buyruqlaringiz → yashil</b>; endi uni qizil qilamiz",
    "Xulosa: push qildingiz, GitHub toza mashina ochdi, kodni olib keldi, Node o'rnatdi, to'rt buyrug'ingizni yurgizdi, yashil dedi. Siz hech narsa qilmadingiz. Endi kodni buzib push qilamiz va lenta qizilni qanday ko'rsatishini ko'ramiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "<= bilan push: run qizil — npm test qadami ✗, npm run build «skipped», annotatsiyada Process completed with exit code 1",
  "seg": [
   [
    "x",
    "Endi <b>yana o'zingiz buzasiz</b>: <code>&lt;</code> ustiga bosing — keyin push",
    "Lenta GitHub'da yashil. Endi oltinchi ekrandagi buzishni GitHub'da sinaymiz. Buzishni yana o'zingiz qilasiz: order service ts'ning o'ttiz oltinchi satrida kichik belgisi yonib turibdi, ustiga bosing.",
    "<b>order.service.ts</b> 36-satridagi <b><code>&lt;</code></b> ustiga bosing — <code>&lt;=</code> bo'ladi, keyin commit va push."
   ],
   [
    "a",
    "Commit, push — <b>run qizil</b>: ro'yxatda qizil belgi, commit xabari bilan",
    "Kichik yana kichik yoki teng. Commit, push. Actions bo'limida yangi run, bu safar qizil belgi. Run'ni ochamiz."
   ],
   [
    "b",
    "Qadamlar: <b><code>npm test</code> ✗, <code>npm run build</code> — «skipped»</b>; annotatsiya: chiqish kodi 1",
    "Qadamlarga qarang: checkout, setup node, npm si ay, tsc, hammasi yashil. Npm test qizil. Npm run build: skipped, yurmadi. Yuqorida annotatsiya: process completed with exit code one. Oltinchi ekrandagi ampersand zanjiri bilan bir xil, faqat GitHub buni ko'rsatib beradi."
   ],
   [
    "c",
    "Logda <b>o'sha FAIL</b>: chegara testi, <code>Kolonka: omborda faqat 2 ta qoldi</code>, 37-satr",
    "Qizil qadamni bosing: log. O'sha FAIL: order service spec, chegara testi, Kolonka, omborda faqat ikkita qoldi, o'ttiz yettinchi satr. Jest sizga lokalda aytadigan hamma narsa shu yerda. Pastda: process completed with exit code one."
   ],
   [
    "d",
    "Demak, sabab: <b>test chiqish kodi 1 berdi — lenta to'xtadi</b>, build yurmadi, buzuq kod yig'ilmadi",
    "Demak, sabab bitta joyda: npm test chiqish kodi bir berdi, lenta shu qadamda to'xtadi, build yurmadi. Buzuq kod yig'ilmadi va hech qayerga chiqmadi. Satrni tiklab push qilsangiz, run yana yashil. Endi tekshirib olaylik."
   ]
  ]
 },
 "11": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "Lentada npx tsc --noEmit qadami chiqish kodi 2 bilan tugadi. npm test va npm run build qadamlari nima bo'ladi?",
  "q": "Qizil run'ni ko'rdingiz, endi tekshirib olaylik. Ikkinchi tekshiruv. Lentada tsc qadami chiqish kodi ikki bilan tugadi: tur xatosi. Undan keyingi npm test va npm run build qadamlari nima bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Lenta birinchi qizil qadamda to'xtaydi: tsc ikki berdi, npm test ham, build ham skipped, yurmadi. Chiqish kodi ikkimi, birmi, lenta uchun farqi yo'q: nol emas, demak qizil. Demak, qadam tartibi muhim: arzon va tez tekshiruv oldinda, undan o'tmagan kod testgacha ham bormaydi.",
  "okShort": "Birinchi qizil qadam — qolgani «skipped». 2 ham, 1 ham — nol emas.",
  "hint": "Oltinchi ekrandagi && zanjirini eslang: qizildan keyin nima bo'ldi?",
  "demak": "Lenta birinchi qizil qadamda to'xtaydi; keyingi qadamlar «skipped». Chiqish kodi nol emas — qizil.",
  "correct": 2,
  "opts": [
   "Ikkalasi yuradi — tur xatosi testga ham, build'ga ham xalaqit bermaydi",
   "npm test yuradi, build yurmaydi — test alohida",
   "Ikkalasi «skipped» — birinchi qizildan keyin to'xtaydi",
   "Ikkalasi yuradi, lekin run baribir qizil"
  ],
  "wrong": {
   "0": "Lenta qadam ketma-ketligi: oldingisi qizil — keyingisi boshlanmaydi.",
   "1": "Qadamlar bir-biriga bog'liq: tsc qizil bo'lsa test ham yurmaydi.",
   "3": "Yurmaydi: GitHub ularni «skipped» deb belgilaydi, run qizil."
  }
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "OrderBotNest nusxangizni GitHub'ga chiqaring, ci.yml yozing, push — Actions'da yashil run; keyin buzib qizilni ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: <b>o'z GitHub reposingiz</b> — OrderBotNest nusxasi, <code>ci.yml</code>, push",
    "Endi navbat sizga. GitHub'da o'zingizga yangi repo ochasiz, OrderBotNest nusxangizni unga push qilasiz, ci yml yozasiz va Actions'da yashil run'ni ko'rasiz. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>repo va push</b>, keyin <code>.github/workflows/ci.yml</code> — sakkizinchi ekrandagi 15 satr",
    "Birinchi qadamda GitHub'da bo'sh repo ochib, git remote bilan ulaysiz va push qilasiz. Ikkinchisida nuqta github, workflows, ci yml faylini sakkizinchi ekrandagi o'n besh satr bilan yozasiz, push. Actions'da run yashil bo'lishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <b>36-satrni buzib push</b> — run qizil, <code>build</code> skipped; tiklab push — yashil; isbot — run manzili",
    "Uchinchi qadamda o'ttiz oltinchi satrni buzib push qilasiz: run qizil, npm test qadami qizil, build skipped. To'rtinchisida tiklab push: yashil. Isbot maydoniga yashil run'ning manzilini, brauzer qatoridan, nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizning reponingizda har push'da lenta yuradi, va siz uni bir marta qizil, bir marta yashil ko'rgansiz."
   ]
  ],
  "steps": [
   {
    "t": "O'z repo",
    "cmds": [
     "GitHub → New repository (bo'sh, README'siz)",
     "git remote add mine https://github.com/<siz>/OrderBotNest.git",
     "git push mine jest2-done:main"
    ],
    "exp": "GitHub'da kod ko'rinadi"
   },
   {
    "t": "ci.yml",
    "cmds": [
     ".github/workflows/ci.yml — 8-ekrandagi 15 satr (node-version — node --version raqamingiz)",
     "git add .github && git commit -m \"ci: lenta\" && git push mine HEAD:main"
    ],
    "exp": "Actions: run ✓ (6 qadam yashil)"
   },
   {
    "t": "Buzib push",
    "cmds": [
     "order.service.ts 36 < → <=",
     "git commit -am \"sinov: chegara\" && git push mine HEAD:main"
    ],
    "exp": "run ✗: npm test ✗ · npm run build skipped"
   },
   {
    "t": "Tiklab push",
    "cmds": [
     "git checkout -- src/api/order/order.service.ts",
     "git commit -am \"tiklash\" && git push mine HEAD:main"
    ],
    "exp": "run ✓"
   }
  ],
  "proof": {
   "label": "4-qadamdagi yashil run manzili",
   "placeholder": "masalan: https://github.com/siz/OrderBotNest/actions/runs/41831…",
   "re": "github\\.com\\/[^\\s\\/]+\\/[^\\s\\/]+\\/actions\\/runs\\/\\d+",
   "flags": "",
   "wrong": "Actions'da run'ni ochib, brauzer qatoridagi manzilni qo'ying: …/actions/runs/<raqam>."
  },
  "trouble": [
   [
    "Actions bo'limida run yo'q",
    "fayl .github/workflows/ papkasida emas yoki push mainga bormagan — yo'lni va git push mine HEAD:main ni tekshiring"
   ],
   [
    "npm ci qadami qizil: Missing: … from lock file",
    "runner'dagi Node mashinangizdan boshqa — node-version ni node --version raqamiga qo'ying (17-ekran)"
   ],
   [
    "npm ci qizil: can only install with an existing package-lock.json",
    "actions/checkout@v4 qadami yo'q — mashinada repo yo'q (13-ekran)"
   ],
   [
    "Run qizil, ichida job yo'q",
    "fayl xatosi — YAML surilish yoki runs-on yo'q (16-ekran)"
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · to'rt tuzoq",
  "title": "actions/checkout satrini olib tashlasak — mashina bo'sh: npm ci «lock fayl yo'q» deydi, run qizil; birinchi tuzoq",
  "seg": [
   [
    "a",
    "Birinchi tuzoq: <b><code>checkout</code> satri yo'q</b> — to'g'ri ko'rinadi, YAML xatosi ham yo'q",
    "To'rt tuzoqni ko'ramiz, har biri haqiqiy run. Birinchisi: ci yml'dan actions checkout satrini olib tashladik. Fayl to'g'ri ko'rinadi: setup node, npm si ay, npm test. YAML xatosi yo'q, GitHub faylni qabul qildi, run boshlandi."
   ],
   [
    "b",
    "Run: <code>setup-node</code> ✓, <b><code>npm ci</code> ✗ — «can only install with an existing package-lock.json»</b>",
    "Run qizil. Setup node yashil, Node o'rnatildi. Npm si ay qizil, logda: npm si ay faqat mavjud package lock json bilan o'rnatadi, lock yarating, deydi. Lekin lock faylimiz repoda bor, siz uni to'rtinchi ekranda ko'rdingiz. Xabar aldaydi: lock yo'q emas, butun papka bo'sh."
   ],
   [
    "c",
    "Demak, sabab: <b>runner bo'sh papkadan boshlaydi</b> — kodni <code>checkout</code> olib keladi, u yo'q",
    "Demak, sabab bitta: runner har safar bo'sh papkadan boshlaydi, to'rtinchi ekrandagi toza clone'dan ham bo'shroq, u yerda hatto clone ham yo'q. Kodni mashinaga actions checkout olib keladi. U yo'q, demak package json ham, lock ham yo'q, npm si ay nima o'rnatishini bilmaydi."
   ],
   [
    "d",
    "Xulosa: <b>birinchi qadam doim <code>checkout</code></b>; «lock yo'q» yoki «package.json yo'q» ko'rsangiz — shu satrni qidiring",
    "Xulosa: har workflow'da birinchi qadam actions checkout. Logda lock fayl yo'q yoki package json yo'q ko'rsangiz, repongizni tekshirmang, ci yml'dagi shu satrni qidiring. O'quvchi darsidagi ci yml'da ham bu satr yo'q, yigirma uchinchi ekranda ko'ramiz. Ikkinchi tuzoq: lock fayl."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · to'rt tuzoq",
  "title": "package.jsonni qo'lda o'zgartirdik, lock qolmadi — npm ci lentada ham, lokalda ham yiqiladi: «package.json and package-lock.json … in sync»; ikkinchi tuzoq",
  "seg": [
   [
    "a",
    "Ikkinchi tuzoq: <code>package.json</code>da <b>versiyani qo'lda o'zgartirdik</b>, <code>npm install</code> yurgizmadik — lock eskicha",
    "Ikkinchi tuzoq. Package json faylining o'ttizinchi satrida telegraf versiyasini qo'lda to'rt o'n olti nolga o'zgartirdik, npm install yurgizmadik. Package lock json'da hali to'rt o'n olti uch. Ikki fayl bir-biriga mos emas. Commit, push."
   ],
   [
    "b",
    "Lokalda ham, lentada ham: <b><code>npm ci</code> qizil — «in sync» emas</b>: lock'da 4.16.3, <code>package.json</code>da 4.16.0",
    "Natija lokalda ham, lentada ham bir xil: npm si ay qizil. Xabar: package json va package lock json in sync emas, ya'ni mos emas. Pastda aniq sabab: lock fayldagi telegraf to'rt o'n olti uch, package json'dagi to'rt o'n olti nolga mos kelmaydi."
   ],
   [
    "c",
    "Demak, sabab: <b><code>npm ci</code> lock fayldan aynan o'rnatadi</b>, mos kelmasa — o'rnatmaydi, qizil beradi",
    "Demak, sabab: npm si ay, ya'ni clean install, lock fayldan aynan o'rnatadi, bir baytini ham o'zgartirmaydi. Package json mos kelmasa, taxmin qilmaydi, qizil beradi. Bu to'g'ri: lentada hamma mashina aynan bir xil paketlarni olishi kerak."
   ],
   [
    "d",
    "Xulosa: <b>lokalda <code>npm install</code>, lentada <code>npm ci</code></b>; versiya o'zgarsa — lock ham commit'ga kiradi",
    "Xulosa: paket qo'shsangiz yoki versiya o'zgartirsangiz, lokalda npm install yurgizing: u lock'ni yangilaydi. Lock faylni ham commit'ga qo'shing. Lentada esa doim npm si ay: u lock'ga ishonadi va mos kelmasa to'xtaydi. Uchinchi tuzoq eng xavflisi: yashil, lekin yolg'on."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "user.service.tsda tur xatosi: ts-jest testlarni baribir yashil o'tkazadi — tsc qadamisiz lenta yashil (yolg'on), tsc bilan qizil; uchinchi tuzoq",
  "seg": [
   [
    "a",
    "Uchinchi tuzoq: <b>tur xatosi, test yashil</b> — <code>ts-jest</code> turni tekshirmaydi, <code>tsc</code> tekshiradi",
    "Uchinchi tuzoq. Src, api, user papkasidagi user service ts faylining o'n oltinchi satrida string'ni olib tashladik: telegram id endi number, ustun esa string. Npx tsc: yigirmanchi satrda xato, TS ikki uch ikki ikki, chiqish kodi ikki. Npm test: yigirma besh passed, yashil. Test turni tekshirmaydi."
   ],
   [
    "b",
    "Lentada <code>tsc</code> qadami yo'q (run 14): <b>hammasi yashil — yolg'on</b>; kod kompilyatsiya bo'lmaydi",
    "Shu kodni tsc qadamisiz ci yml bilan push qildik: checkout, setup node, npm si ay, npm test. Run yashil, oltita belgi yashil. Lekin bu yolg'on yashil: nest build bu kodni yig'a olmaydi, bot ishga tushmaydi. Lenta buni ko'rmadi, chunki hech kim so'ramadi."
   ],
   [
    "c",
    "<code>tsc</code> qadami bilan (run 15): <b><code>tsc</code> ✗, test va build skipped</b> — run qizil, chiqish kodi 2",
    "O'sha kod, tavsiya ci yml bilan: tsc qadami bor. Run qizil: tsc qizil, chiqish kodi ikki, npm test skipped, build skipped. Yonma-yon qarang: bir xil kod, bir xil testlar, bitta satr farq: npx tsc no emit. Birida yolg'on yashil, ikkinchisida haqiqiy qizil."
   ],
   [
    "d",
    "Xulosa: <b>lenta faqat so'ralgan narsani tekshiradi</b> — <code>tsc</code> qadamini test'dan oldin qo'ying",
    "Xulosa: lenta faqat siz so'ragan narsani tekshiradi. Testlar yashil, degani turlar to'g'ri degani emas. Npx tsc no emit qadamini npm test'dan oldin qo'ying: arzon, uch soniya, va build'gacha bormay to'xtatadi. To'rtinchi tuzoq: faylning o'zi."
   ]
  ]
 },
 "16": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4 — qaysi satr xato?",
  "title": "Bu ci.yml bilan push qildik — run qizil, lekin ichida bitta qadam ham yo'q: «workflow file issue». Sababchi satrni toping",
  "q": "Uch tuzoqni ko'rdingiz, to'rtinchisini o'zingiz topasiz. Uchinchi tekshiruv. Bu ci yml bilan push qildik: run qizil, lekin ichida bitta qadam ham yo'q, GitHub workflow file issue dedi. YAML'da bitta ro'yxatning elementlari bir ustunda turadi. Ro'yxat yettinchi satrda boshlandi, keyingi element boshqa ustundan boshlanadi. Birinchi buzilgan satrni bosing.",
  "ok": "To'g'ri. Sakkizinchi satr qo'shnisidan ikki probel o'ngda boshlanadi: YAML uni ro'yxat elementi emas, oldingi elementning davomi deb o'qiydi va tushunmaydi. GitHub bunday faylni yurgizmaydi: run ro'yxatda qizil, lekin ichida job yo'q, qadam yo'q, log yo'q, faqat workflow file issue. Ekranda tuzatilgan: hamma chiziqcha bir chuqurlikda. Pastda ikkinchi fayl xatosi: runs on yo'q.",
  "okShort": "8-satr 2 probel o'ngda — YAML tushunmadi. Fayl xatosida job yo'q, qadam yo'q, log yo'q.",
  "hint": "- uses va - run chiziqchalari bir ustunda turishi kerak. Qaysi biri surilgan?",
  "task": "Qoida: YAML'da bitta ro'yxatning elementlari (<code>- </code>) bir ustunda turadi. Ro'yxat 7-satrda boshlandi; keyingi element boshqa ustundan boshlanadi — GitHub aynan shu satrni ko'rsatadi. <b>Birinchi buzilgan satrni bosing.</b>"
 },
 "17": {
  "type": "Lesson",
  "kicker": "5-bosqich · mashina farqi",
  "title": "Haqiqiy topilma: toza clone'da yashil edi, birinchi run'da npm ci qizil — Missing: webpack@5.112.2 from lock file; sabab — runner'da Node 22, mashinada Node 24",
  "seg": [
   [
    "a",
    "Birinchi run'imiz aslida <b>qizil edi</b>: <code>npm ci</code> — <code>Missing: webpack@5.112.2 from lock file</code>",
    "Endi haqiqiy topilma. Bu darsni tayyorlashda birinchi run qizil chiqdi. Npm si ay qadami: missing webpack from lock file. Lokalda esa to'rtinchi ekranda o'sha lock bilan npm si ay yashil edi. Bir xil kod, bir xil lock, boshqa natija. Menda ishlaydi, lekin lentada yo'q."
   ],
   [
    "b",
    "Farq: <b>mashinada Node 24 va npm 11, runner'da Node 22 va npm 10</b> — npm 10 lock'ni boshqacha o'qiydi",
    "Ikki mashinani yonma-yon qo'yamiz. Sizniki: node yigirma to'rt, npm o'n bir. Runner: ci yml'da node version yigirma ikki yozilgan edi, u bilan npm o'n keladi. Npm o'n lock faylning bir yozuvini, peer paketni, boshqacha o'qiydi va yo'q deb hisoblaydi."
   ],
   [
    "c",
    "Isbot lokalda: <b>npm 10 bilan <code>npm ci</code> — o'sha xato</b>; demak sabab kod emas, npm versiyasi",
    "Isbot: o'z mashinamizda npx bilan npm o'nni chaqirib npm si ay yurgizdik: aynan o'sha xato, missing webpack. Demak, sabab kodda ham, lock'da ham emas: lentadagi Node, demak npm, mashinadagidan boshqa. Lokalda yashil, lentada qizil bo'lsa, birinchi shuni solishtiring."
   ],
   [
    "d",
    "Xulosa: <b><code>node-version</code> — <code>node --version</code> raqamingiz</b>; 22 → 24 qilindi, run yashil",
    "Xulosa: ci yml'dagi node version mashinangizdagi node version bilan bir xil bo'lsin. Yigirma ikkini yigirma to'rtga o'zgartirdik, push, run yashil. Shuning uchun sakkizinchi ekrandagi faylda yigirma to'rt. Endi AI yozgan workflow'larni ko'ramiz: ikkalasi ham shu tuzoqqa tushdi."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI",
  "title": "Yangi ko'nikma davomi: ikki AI'ga bitta vazifa ikki xil topshiriq bilan — oddiysida versiya va tekshiruvlar tushib qoldi; endi o'qiymiz, keyin lentada sinaymiz",
  "seg": [
   [
    "a",
    "Yana AI bosqichi: <b>workflow'ni AI yozadi, siz qabul qilasiz</b> — bitta vazifa, ikki topshiriq",
    "Jest darslaridagi kabi oxirgi bosqich AI bilan. Biz ikki xil AI'ga bitta vazifani ikki xil topshiriq bilan berdik: OrderBotNest uchun GitHub Actions workflow. Har AI loyihaning alohida nusxasida ishladi."
   ],
   [
    "b",
    "Ikki topshiriq: <b>oddiy</b> — «testlar yursin»; <b>CI tilida</b> — lock bo'yicha o'rnatish, tur tekshiruvi, test, build, Node mashinadagidek",
    "Birinchi topshiriq oddiy: bu NestJS loyihasi uchun GitHub Actions workflow yozib ber, har push'da testlar yursin. Ikkinchisi CI tilida: kutubxonalar lock fayl bo'yicha aynan o'rnatilsin, tur tekshiruvi, testlar, build, Node versiyasi mening mashinamdagi bilan bir xil bo'lsin. Buyruqlar nomi aytilmagan."
   ],
   [
    "c",
    "Oddiy: <b><code>node-version: 22</code>, <code>tsc</code> va <code>build</code> yo'q</b> · CI tilida: <b>Node 24.18 — <code>node -v</code> ni o'zi yurgizdi</b>, to'rt bosqich",
    "Natija. Oddiy topshiriqda ikkalasi to'g'ri ko'rinadigan fayl yozdi: checkout, setup node, npm si ay, npm test. Lekin node version yigirma ikki, mashinani so'ramadi, tsc ham, build ham yo'q. CI tilidagi topshiriqda ikkalasi node minus v ni o'zi yurgizib, yigirma to'rt nuqta o'n sakkiz yozdi, to'rt bosqichning hammasi bor."
   ],
   [
    "d",
    "Xulosa: <b>to'g'ri ko'ringan fayl hali tekshiruv emas</b> — lentaga qo'yib ko'ramiz",
    "Xulosa: to'g'ri ko'ringan workflow hali tekshiruv emas. To'rttala faylni OrderBotNest'ning sinov tarmog'iga push qildik. CI tilidagilar birinchi urinishda yashil, run yigirma ikki va yigirma uch. Oddiy topshiriqdagilar qanday chiqqanini keyingi ekranda ko'ramiz."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Ikkala AI workflow'i lentada qizil — npm ci, o'sha Missing: webpack… from lock file; faqat node-version tuzatilsa yashil, lekin tur xatosi baribir o'tadi",
  "seg": [
   [
    "a",
    "Run 19 va 20: <b>ikkalasi qizil, <code>npm ci</code> qadamida</b> — 17-ekrandagi o'sha xato",
    "Ikkala run ham qizil, ikkalasi ham npm si ay qadamida: missing webpack from lock file. O'n yettinchi ekrandagi tuzoq: node version yigirma ikki, npm o'n, lock boshqacha o'qildi. AI buni bilishi mumkin emas edi: u sizning mashinangizni ko'rmaydi."
   ],
   [
    "b",
    "Faqat bitta raqam: <b>22 → 24 — run 21 yashil</b>, <code>npm ci</code> ✓, <code>npm test</code> ✓; qadam nomi hali «Node.js 22»",
    "Birinchi AI faylida faqat bitta raqamni o'zgartirdik: node version yigirma to'rt. Push: run yashil, npm si ay o'tdi, npm test yigirma besh passed. Qadam nomi hali Node js yigirma ikki o'rnatish deb turibdi: nom emas, raqam ishlaydi. Bitta raqam, qizildan yashilga."
   ],
   [
    "c",
    "Lekin: <b><code>tsc</code> yo'q — 15-ekrandagi tur xatosi bu lentada yashil qoladi</b>; CI tilidagilarda — tur tekshiruvida qizil",
    "Lekin yashil hali to'liq emas. Bu workflow'da tsc yo'q: o'n beshinchi ekrandagi tur xatosini push qilsangiz, run yashil qoladi, yolg'on yashil. Build ham yo'q: yig'ilmaydigan kod yashil o'tadi. CI tilidagi ikki workflow'da tsc bor: lokal lentada shu xato tur tekshiruvida qizil bo'ldi."
   ],
   [
    "d",
    "Xulosa: AI workflow'ini <b>to'rt savol bilan</b> qabul qiling: checkout · <code>node-version</code> meniki · <code>npm ci</code> · <code>tsc</code> va <code>build</code>",
    "Xulosa: AI yozgan workflow'ni to'rt savol bilan qabul qiling. Checkout bormi. Node version mening mashinamdagi bilan bir xilmi. Npm si ay'mi, install emasmi. Tsc va build qadamlari bormi. To'rttasiga ha bo'lsa, push qiling va run'ni ko'ring. Endi tekshirib olaylik."
   ]
  ]
 },
 "20": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4 — qaysi satr sabab?",
  "title": "Run 19 qizil: npm ci — Missing: webpack… from lock file. 1-AI faylining qaysi satri sabab?",
  "q": "AI workflow'larini lentada ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. Bu birinchi AI yozgan test yml, github papkasidagi workflows ichida. U o'zgartirilmasdan push qilinganda run o'n to'qqiz qizil bo'ldi, npm si ay qadamida: missing webpack from lock file. Mashinangizda Node yigirma to'rt. Qaysi satr sabab? O'sha satrni bosing.",
  "ok": "To'g'ri. O'n yettinchi satr: node version yigirma ikki. Runner'da Node yigirma ikki va npm o'n, lock esa npm o'n birda yozilgan, npm si ay uni boshqacha o'qiydi. Faqat shu raqamni yigirma to'rtga o'zgartirdik: run yigirma bir yashil. Lekin tsc va build qadamlari hali yo'q, tur xatosi yashil o'tadi. Demak, versiya mashinangizdagi bilan bir xil, keyin to'rt savolning qolgani.",
  "okShort": "17-satr: <code>node-version: 22</code> — runner'da npm 10, lock npm 11 da yozilgan → <code>npm ci</code> ✗. <code>24</code> bilan run 21 yashil. <code>tsc</code> va <code>build</code> qadamlari hali yo'q (19-ekrandagi to'rt savol).",
  "hint": "Xato npm ci qadamida, lekin sababi undan oldin: qaysi satr runner'dagi Node'ni, demak npm'ni tanlaydi?",
  "task": "1-AI yozgan <code>test.yml</code> o'zgartirilmasdan push qilindi: run 19 qizil, «Kutubxonalarni o'rnatish» qadamida <code>npm error Missing: webpack@5.112.2 from lock file</code>. Mashinangizda <code>node --version</code> → <code>v24.18.0</code>, lock shu Node'dagi npm bilan yozilgan (17-ekran). <b>Qaysi satr sabab? Bosing.</b>"
 },
 "21": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "O'z AI'ingizga workflow yozdiring, to'rt savol bilan tuzating, push — yashil; keyin tur xatosi bilan push — qizil bo'lsin",
  "seg": [
   [
    "a",
    "Endi siz: AI'ga <b>aniq shartli prompt</b> — OrderBotNest uchun workflow",
    "Endi navbat sizga. O'z AI'ingizga OrderBotNest uchun workflow yozdirasiz, promptni pastdagi tugma bilan nusxalaysiz. Keyin to'rt savol bilan tekshirib, o'z reponingizga push qilasiz. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: prompt va <b>to'rt savol</b> — checkout · <code>node-version</code> meniki · <code>npm ci</code> · <code>tsc</code> va <code>build</code>",
    "Birinchi qadamda promptni berasiz. Ikkinchisida faylni to'rt savol bilan o'qiysiz: checkout bormi, node version mashinangizdagi raqammi, npm si ay'mi, tsc va build qadamlari bormi. Yetishmaganini qo'lda qo'shing yoki AI'dan so'rang."
   ],
   [
    "c",
    "3–4-qadam: <b>push — yashil; tur xatosi bilan push — <code>tsc</code> qizil</b>, tiklash; isbot — qizil run'ning qadam nomi",
    "Uchinchi qadamda push: run yashil bo'lishi kerak. To'rtinchisida user service ts'ning o'n oltinchi satrida string'ni olib tashlab push qilasiz: run qizil, tsc qadamida, test skipped. Tiklab push, yashil. Isbot maydoniga qizil run'da qaysi qadam qizarganini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz AI yozgan workflow'ni to'rt savol bilan qabul qilgansiz va lenta tur xatosini ham ushlashini o'zingiz ko'rgansiz."
   ]
  ],
  "steps": [
   {
    "t": "Prompt",
    "cmds": [
     "yuqoridagi prompt — o'z AI'ingizga (<node --version raqamingiz> o'rniga o'z raqamingiz)"
    ],
    "exp": ".github/workflows/ci.yml"
   },
   {
    "t": "To'rt savol",
    "cmds": [
     "checkout@v4 bor",
     "node-version = node --version",
     "npm ci (install emas)",
     "npx tsc --noEmit va npm run build qadamlari bor — yetishmasa qo'shing"
    ],
    "exp": "4 ✓"
   },
   {
    "t": "Push — yashil",
    "cmds": [
     "git add .github && git commit -m \"ci: AI workflow\" && git push mine HEAD:main"
    ],
    "exp": "run ✓ (checkout · setup-node · ci · tsc · test · build)"
   },
   {
    "t": "Tur xatosi — qizil",
    "cmds": [
     "src/api/user/user.service.ts 16-satr String(from.id) → from.id",
     "commit, push",
     "keyin git checkout -- src/api/user/user.service.ts, commit, push"
    ],
    "exp": "run ✗: npx tsc --noEmit ✗ · npm test skipped → keyin run ✓"
   }
  ],
  "proof": {
   "label": "4-qadamdagi qizil run'da qizargan qadam nomi",
   "placeholder": "masalan: npx tsc --noEmit",
   "re": "tsc",
   "flags": "i",
   "wrong": "Qizil run'ni oching: qaysi qadam qizil? Uning nomini yozing (tsc bo'lishi kerak)."
  },
  "trouble": [
   [
    "npm ci qizil, Missing: … from lock file",
    "node-version mashinangizdan boshqa — 2-savol (17-ekran)"
   ],
   [
    "4-qadamda run yashil",
    "tsc qadami yo'q yoki npm testdan keyin turibdi — npx tsc --noEmit npm cidan keyin, npm testdan oldin"
   ],
   [
    "Run qizil, job yo'q (workflow file issue)",
    "YAML surilish — - uses va - run bir ustunda (16-ekran)"
   ],
   [
    "AI npm install yozdi",
    "npm ci ga almashtiring (14-ekran)"
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · CD",
  "title": "Lenta dist yig'di — lekin node dist/main toza mashinada darhol yiqiladi: DATABASE_URL topilmadi. CD shu yerdan boshlanadi: secret, server, chiqarish — keyingi darslar",
  "seg": [
   [
    "a",
    "Lenta <code>dist</code> yig'di — <b><code>node dist/main</code> toza mashinada yiqiladi</b>: <code>DATABASE_URL topilmadi</code>",
    "CI tugadi: dist papkasi tayyor. Endi uni ishga tushirib ko'raylik, toza mashinada: node dist main. Darhol xato: DATABASE URL topilmadi, env'ga Postgres manzilini yozing. Lokalda env faylingiz bor, lentada yo'q, va bo'lmasligi ham kerak: parol commit'ga kirmaydi."
   ],
   [
    "b",
    "CD: <b>tekshirilgan paketni chiqarish</b> — Delivery: odam tugmani bosadi; Deployment: lenta o'zi",
    "Mana CD'ning chegarasi. Continuous Delivery: lenta paketni tayyorlab qo'yadi, odam chiqar tugmasini bosadi. Continuous Deployment: yashil bo'lsa, lenta o'zi serverga chiqaradi. Ikkalasiga ham uch narsa kerak: maxfiy qiymatlar, server va chiqarish buyrug'i."
   ],
   [
    "c",
    "Kerak: <b><code>DATABASE_URL</code> va <code>BOT_TOKEN</code> — GitHub Secrets</b>; server; chiqarish buyrug'i",
    "Maxfiy qiymatlar GitHub Secrets'da saqlanadi, ci yml ularni nom bilan oladi, qiymatini hech kim ko'rmaydi. Server, bot qayerda yuradi. Va chiqarish buyrug'i. Bularning har biri alohida mavzu, bugungi dars emas."
   ],
   [
    "d",
    "Xulosa: <b>bugun CI to'liq, CD chegarasi aniq</b>; secrets va run'ni o'qish — keyingi mentor darsida",
    "Xulosa: bugun CI to'liq: har push'da to'rt qadam, yashil yoki qizil. CD'ning chegarasini ko'rdingiz: paket bor, lekin maxfiy qiymatlarsiz yurmaydi. Keyingi mentor darsida GitHub Actions'ga chuqurroq kiramiz: run'ni o'qish, secrets, cache. Hozir esa sinfga tayyorgarlik."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m4c-01 · «CI/CD nima va nega kerak»",
  "title": "O'quvchi darsi: aeroport lentasi — chamadon, Yig'ish, Skaner, O'lcham ramkasi, O'rash, Uchirish; siz bilgan to'rt qadamning rasmli varianti",
  "seg": [
   [
    "a",
    "m4c-01 — 20 ekran: <b>aeroport lentasi, besh nuqta</b>; o'quvchi <code>ci.yml</code> bo'shliqlarini to'ldiradi",
    "Endi sinfga tayyorgarlik. O'quvchi darsi m4c-01, yigirma ekran. Metafora aeroport lentasi: chamadon bu kod, besh nuqta: yig'ish, skaner, o'lcham ramkasi, o'rash, uchirish. O'quvchi ci yml'dagi uch bo'shliqni to'ldiradi va amaliyotda o'z reposiga ci yml yozadi."
   ],
   [
    "b",
    "O'quvchi so'zlari: <b>Yig'ish — <code>npm install</code>, Skaner — <code>npm test</code>, start signali — <code>on: push</code></b>",
    "O'quvchi so'zlari: yig'ish bu npm install, skaner npm test, o'lcham ramkasi eslint, o'rash build, uchirish deploy. Start signali on push, yo'l xaritasi ci yml, lenta mashinasi runner. Qizil chiroq, lenta to'xtaydi, bu chiqish kodi. Sinfda so'zni atamasi bilan birga ayting."
   ],
   [
    "c",
    "Siz qo'shasiz: <b><code>checkout</code> satri — o'quvchi <code>ci.yml</code>ida yo'q</b>; <code>npm ci</code> sababi; bitta haqiqiy run",
    "Darsga siz qo'shadigan narsalar. O'quvchi darsidagi ci yml'da checkout satri yo'q: amaliyotda bitta qator qo'shing, deb ayting, aks holda uning run'i o'n uchinchi ekrandagi xato bilan qizaradi. Npm si ay'ning sababini bir gapda ayting. Va bitta haqiqiy run'ni ekranda ko'rsating."
   ],
   [
    "d",
    "Xulosa: o'quvchi «run yo'q» desa — <b>papka yo'li va push</b>; pastda uch vaziyat va savollar",
    "Xulosa: o'quvchi Actions'da run yo'q desa, avval fayl yo'lini va push'ni tekshiring. Package json topilmadi chiqsa, checkout. Workflow file issue, YAML. Pastda uch vaziyat va o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Sizda npm test yashil, hamkorda qizil. CI buni qanday hal qiladi?",
    "o": [
     "Hamkorga sizning node_modulesingizni yuboradi",
     "Har push'da toza mashinada bir xil buyruqlarni yurgizadi",
     "Testlarni GitHub'ga ko'chiradi — lokalda npm test endi yurmaydi",
     "Qizil testni avtomatik tuzatib qo'yadi"
    ],
    "c": 1,
    "e": "Toza mashina — hammaga bir xil javob.",
    "s": 2
   },
   {
    "q": "Lentada tsc qadami chiqish kodi 2 berdi. npm test qadami?",
    "o": [
     "Yuradi — tur xatosi testga aloqasi yo'q",
     "Yuradi, lekin natijasi run holatiga hisobga olinmaydi",
     "«Skipped» — birinchi qizil qadamdan keyin yurmaydi",
     "Yuradi, run sariq bo'lib kutadi"
    ],
    "c": 2,
    "e": "Nol emas — lenta to'xtaydi.",
    "s": 11
   },
   {
    "q": "Toza clone'da npm test: sh: 1: jest: not found, kod 127. Sabab?",
    "o": [
     "node_modules yo'q — o'rnatish qadami yurmagan",
     "Jest package.jsonda yo'q — devDependenciesga qo'shish kerak",
     "Node versiyasi eski — Jest yangi",
     "Test fayllari yo'q — Jest topmadi"
    ],
    "c": 0,
    "e": "Lentada birinchi qadam — npm ci.",
    "s": 5
   },
   {
    "q": "ci.ymlda actions/checkout satri yo'q. Lentada nima bo'ladi?",
    "o": [
     "YAML xatosi — GitHub faylni qabul qilmaydi",
     "setup-node kodni o'zi olib keladi, yashil",
     "npm ci qizil — «lock yo'q», chunki papka bo'sh",
     "Run ochiladi, lekin hech qaysi qadam yurmaydi"
    ],
    "c": 2,
    "e": "Runner bo'sh papkadan boshlaydi.",
    "s": 13
   },
   {
    "q": "package.jsonda versiyani qo'lda o'zgartirdingiz, lock eskicha. Lentada npm ci?",
    "o": [
     "O'rnatadi — package.json ustun",
     "Lock'ni o'zi yangilab o'rnatadi",
     "Qizil — «in sync» emas, mos kelmaydi",
     "O'rnatadi, lekin terminalda ogohlantirish yozadi"
    ],
    "c": 2,
    "e": "npm ci lock'dan aynan; mos kelmasa — qizil.",
    "s": 14
   },
   {
    "q": "Tur xatosi bor, ci.ymlda tsc qadami yo'q, testlar yashil. Run?",
    "o": [
     "Qizil — npm test tur xatosini ko'radi va to'xtaydi",
     "Yashil — lenta so'ralmagan narsani tekshirmaydi",
     "Qizil — setup-node turni tekshiradi",
     "Sariq — GitHub ogohlantiradi, kutadi"
    ],
    "c": 1,
    "e": "Yolg'on yashil — tsc qadamini qo'shing.",
    "s": 15
   },
   {
    "q": "Lokalda npm ci yashil, lentada Missing: webpack… from lock file. Birinchi nimani solishtirasiz?",
    "o": [
     "package.jsondagi webpack satrini",
     "Lock faylning hajmini",
     "node-version va node --version raqamini",
     "npm test natijasini lokalda va lentada solishtirasiz"
    ],
    "c": 2,
    "e": "Runner'dagi npm boshqa — lock'ni boshqacha o'qiydi.",
    "s": 17
   },
   {
    "q": "AI workflow: checkout, node-version: 22, npm install, npm test. Nima yetishmaydi?",
    "o": [
     "Hech narsa — to'rt qadam yetarli",
     "permissions — usiz run ochilmaydi",
     "Ikkinchi job — testlar va build alohida job'larda bo'lsin",
     "Versiya meniki, npm ci, tsc va build qadamlari"
    ],
    "c": 3,
    "e": "To'rt savol: checkout · versiya · ci · tsc/build.",
    "s": 19
   }
  ]
 },
 "25": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};
