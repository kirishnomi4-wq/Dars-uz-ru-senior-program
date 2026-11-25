
// ============================================================
//  WebSocket-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/wh-matn.py (manba: 21-WS2-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Webhook",
  "title": "Mijoz to'lov qildi. Server buni kimdan biladi? Bugun to'lov xabarini qabul qilamiz: imzo, takror va rad",
  "seg": [
   [
    "a",
    "Mijoz to'ladi — <b>panelda «To'landi» o'zi chiqdi</b>; xabarni to'lov xizmati yubordi",
    "Assalomu alaykum. OrderBotNest'da buyurtma bor, endi unga onlayn to'lov qo'shamiz. Ekranda dars oxiridagi natija: birinchi buyurtma to'landi, ikkinchisi rad etildi, panel buni o'zi ko'rsatdi. Bu xabarni mijoz ham, bot ham emas, to'lov xizmati yubordi."
   ],
   [
    "b",
    "Avval <b>umumiy tushuncha</b>: kim kimga yuboradi va nega mijozning gapi dalil emas",
    "Avval umumiy tushuncha: to'lov xabari kimdan kimga boradi va nega mijozning to'ladim degani dalil emas. Keyin imzo: manzil ochiq bo'lgani uchun soxta xabarni qanday ajratamiz."
   ],
   [
    "c",
    "Keyin <b>takror, rad va to'rt buzilish</b>; oxirida AI va sinf",
    "Uchinchi bosqichda bitta xabar ikki marta kelsa va to'lov rad etilsa nima bo'ladi. To'rtinchisida to'rtta xatoni ataylab yasaymiz. Beshinchisida ikki AI yozgan webhook'ni haqiqiy bazada sinaymiz. Oxirida sinfga tayyorgarlik."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot; kerak: <b>WebSocket-2 dagi OrderBotNest va Postgres</b>",
    "Dars olti bosqich, uchta amaliyot. Oldingi darsdagi OrderBotNest nusxangiz va Postgres kerak. Haqiqiy to'lov xizmatiga ulanmaymiz, karta yozilmaydi: xizmat o'rnida loyihadagi kichik skript ishlaydi. Shoshilmang, har ekranni boshidan eshitish mumkin. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "To'lov xizmati natijani serverga o'zi yuboradi — bu webhook. Mijoz yoki ilovaning «to'ladim»i dalil emas: dalil faqat xizmatning imzoli xabari",
  "seg": [
   [
    "a",
    "Mijoz kartani xizmatga beradi; <b>xizmat natijani serverga o'zi yuboradi</b>",
    "Mijoz kartani bizga emas, to'lov xizmatiga beradi: Payme, Click kabi. Pul o'tdimi, buni xizmat biladi. Keyin xizmat bizning server manziliga o'zi so'rov yuboradi: shu buyurtma to'landi. Bu so'rov webhook deyiladi."
   ],
   [
    "b",
    "Mijozning <b>«to'ladim»i dalil emas</b>: skrinshotni har kim yasaydi",
    "Nega botga to'ladim tugmasini qo'ymaymiz? Chunki mijozning gapi yoki skrinshoti dalil emas, uni har kim yasaydi. Ilovaning o'zi ham dalil emas. Dalil faqat xizmatning xabari, va u imzolangan bo'lishi kerak."
   ],
   [
    "c",
    "WebSocket'da server panelga o'zi yuborardi; <b>webhook'da xizmat serverga o'zi yuboradi</b>",
    "Oldingi darslarni eslang: WebSocket'da server panelga o'zi xabar berardi. Webhook xuddi shunday, faqat yo'nalish boshqa: tashqi xizmat bizning serverga o'zi yuboradi. Server so'ramaydi, kutadi. Shuning uchun manzil internetda ochiq turadi."
   ],
   [
    "d",
    "Xulosa: xabar — <b>JSON tana va imzo sarlavhasi</b>; to'rt maydon",
    "Xulosa: xabar oddiy POST so'rov. Tanada to'rt maydon: to'lov raqami, buyurtma raqami, holat va summa. Sarlavhada imzo. Manzil ochiq bo'lgani uchun imzo kerak, uni keyingi bosqichda ochamiz. Avval boshlang'ich tegda nima bo'lishini ko'ramiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "wh-start da xizmat xabar yubordi — Cannot POST /payments/webhook, 404. Buyurtma bazada «NEW» qoldi: server to'lov bo'lganini bilmaydi",
  "seg": [
   [
    "a",
    "<code>wh-start</code> da xizmat yubordi — <b><code>Cannot POST /payments/webhook</code>, 404</b>",
    "Boshlang'ich tegda tajriba: Bobur buyurtma berdi, to'lov xizmati xuddi haqiqiydek xabar yubordi. Server javobi to'rt yuz to'rt: Cannot POST payments webhook. Bunday manzil yo'q."
   ],
   [
    "b",
    "Bazada buyurtma <b>«NEW» qoldi</b> — server to'lov bo'lganini bilmaydi",
    "Bazaga qarang: buyurtma yangi holatda qoldi. Pul o'tgan, lekin server bilmaydi, panel ham bilmaydi. Haqiqiy xizmat bunday javobdan keyin bir necha marta qayta urinadi, keyin taslim bo'ladi."
   ],
   [
    "c",
    "Manzil qo'shsak — u <b>internetda ochiq</b>: har kim POST yubora oladi",
    "Manzil qo'shamiz, lekin bir narsani tushunib oling: u internetda ochiq turadi. Xizmat ham, istalgan odam ham unga so'rov yubora oladi. Ochiq manzilga to'landi deb yozish juda oson bo'lib qoladi."
   ],
   [
    "d",
    "Xulosa: kerak — <b>manzil, imzo va bir martalik yozuv</b>",
    "Xulosa: bizga uch narsa kerak. Manzil, ya'ni POST payments webhook. Imzo, xabar haqiqatan xizmatdanmi. Va bir martalik yozuv: bitta to'lov ikki marta kelsa ham bir marta yoziladi. Imzodan boshlaymiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "2-bosqich · imzo",
  "title": "signature.ts: xizmat va server bitta maxfiy kalitni biladi; imzo = HMAC-SHA256(xom tana, kalit). Server qayta hisoblaydi va timingSafeEqual bilan solishtiradi",
  "seg": [
   [
    "a",
    "Kalit <b>faqat ikki tomonda</b>: to'lov xizmatida va bizning <code>.env</code> da",
    "Imzo qanday ishlaydi? To'lov xizmati bilan biz bitta maxfiy kalitni bilamiz: u xizmat kabinetida va bizning env faylimizda. Boshqa hech kim bilmaydi. Xizmat har xabar uchun shu kalit bilan imzo hisoblaydi va sarlavhaga yozadi."
   ],
   [
    "b",
    "<code>sign()</code>: <b>HMAC-SHA256 — xom tana va kalitdan</b> 64 belgili hex",
    "Src, api, payment papkasidagi signature ts faylini oching. Sign funksiyasi: create hmac sha256, kalit bilan, tananing o'zi, hex. Natija oltmish to'rt belgili satr. Tanada bitta harf o'zgarsa, imzo butunlay boshqacha chiqadi."
   ],
   [
    "c",
    "Tekshiruv: <b>kalit bo'sh, tana yoki sarlavha yo'q — darhol rad</b>",
    "Is valid signature funksiyasi avval uch holatni rad etadi: kalit bo'sh, tana yo'q yoki sarlavha yo'q. Kalit bo'sh bo'lsa ayniqsa xavfli: bo'sh kalit bilan imzoni har kim hisoblay oladi. Shuning uchun bo'sh kalit — hech qanday xabar qabul qilinmaydi."
   ],
   [
    "d",
    "Xulosa: solishtirish <b><code>timingSafeEqual</code></b> — javob vaqtidan imzoni taxmin qilib bo'lmaydi",
    "Xulosa: server imzoni o'zi qayta hisoblaydi va kelgani bilan solishtiradi. Oddiy teng belgisi emas, timing safe equal: u har doim bir xil vaqtda solishtiradi, javob tezligidan imzoni bo'lakma-bo'lak topib bo'lmaydi. Uzunlik farq qilsa, darhol yo'q."
   ]
  ]
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · imzo",
  "title": "payment.controller.ts: avval imzo (401), keyin maydonlar (400), keyin yozuv. Imzo req.rawBody dan — shuning uchun main.ts da rawBody: true",
  "seg": [
   [
    "a",
    "<code>webhook()</code>: <b>birinchi qator — imzo</b>; noto'g'ri bo'lsa 401 va boshqa hech narsa",
    "Payment controller ts faylida webhook funksiyasi. Birinchi ish imzo: req raw body, sarlavhadagi imzo va env'dagi kalit. Mos kelmasa, logga ogohlantirish va to'rt yuz bir. Funksiya shu yerda tugaydi, bazaga hech narsa yetib bormaydi."
   ],
   [
    "b",
    "Keyin <b>maydonlar (400)</b>, keyin <b>yozuv</b>: <code>parsePayment</code>, <code>record</code>",
    "Imzo to'g'ri bo'lsa, maydonlar: parse payment to'lov raqami, buyurtma raqami, holat va summani tekshiradi, xato bo'lsa to'rt yuz. Faqat shundan keyin record, ya'ni yozuv. Javob: ok va duplicate, takrormi yoki yo'q."
   ],
   [
    "c",
    "<code>main.ts</code>: <b><code>rawBody: true</code></b> — imzo baytlardan hisoblanadi",
    "Muhim satr main ts faylida: Nest factory create, raw body true. Nest odatda tanani JSON obyektga aylantiradi va xom baytlarni tashlab yuboradi. Imzo esa aynan o'sha baytlardan hisoblangan. Raw body true bo'lsa, ular req raw body'da saqlanadi."
   ],
   [
    "d",
    "Xulosa: tartib — <b>imzo, maydonlar, yozuv</b>; buzilsa nima bo'lishini 4-bosqichda ko'ramiz",
    "Xulosa: uch qadam, shu tartibda. Imzo, maydonlar, yozuv. Imzo yozuvdan oldin, aks holda soxta xabar ham bazaga yetib boradi. Server logida yangi yo'l va raw body ko'rinadi. To'rtinchi bosqichda shu tartibni buzib ko'ramiz."
   ]
  ]
 },
 "6": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Kimdir ochiq manzilga X-Signature siz xabar yubordi: «#1 to'landi, 120 000». Bu controller nima qiladi?",
  "q": "Controller'ni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Kimdir ochiq manzilga imzosiz xabar yubordi: birinchi buyurtma to'landi, bir yuz yigirma ming. Bu controller nima qiladi? Variantni tanlang.",
  "ok": "To'g'ri. Imzo birinchi qadam: sarlavha yo'q, demak is valid signature yo'q deydi va controller to'rt yuz bir tashlaydi. Parse payment ham, record ham chaqirilmaydi, bazaga hech narsa yetmaydi. Demak, imzosiz xabar maydonlari to'g'ri bo'lsa ham, uning mazmuniga qaralmaydi.",
  "okShort": "Imzo — birinchi: yo'q bo'lsa 401, <code>record</code> chaqirilmaydi.",
  "hint": "webhook() dagi birinchi if nima qiladi va undan keyin nima chaqiriladi?",
  "demak": "Imzo yozuvdan oldin: imzosiz xabar mazmuniga qaralmaydi — 401, qator yo'q.",
  "correct": 2,
  "opts": [
   "Yozadi, lekin holatni «tekshirilmagan» deb belgilaydi",
   "Maydonlarni tekshiradi, to'g'ri bo'lsa yozadi",
   "401 qaytaradi va hech narsa yozmaydi",
   "Xizmatdan imzoni so'rab qayta yuborishini kutadi"
  ],
  "wrong": {
   "0": "Imzosiz xabar umuman yozilmaydi — «tekshirilmagan» holati ham yo'q.",
   "1": "Maydonlarga imzodan keyin yetiladi; imzo yo'q — undan nariga o'tilmaydi.",
   "3": "Server hech narsa kutmaydi: javob 401, xabar tashlanadi."
  }
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · imzo",
  "title": "Soxta to'lov xizmati (npm run pay) xabarni xuddi haqiqiydek imzolab yuboradi: 200, payments da qator, payment_status = paid — panelda «To'landi» o'zi chiqdi",
  "seg": [
   [
    "a",
    "<code>npm run pay</code>: <b>xizmat qiladigan ishni qiladi</b> — tanani kalit bilan imzolab yuboradi",
    "Haqiqiy to'lov xizmatiga ulanmaymiz, uning o'rniga loyihada kichik skript bor: scripts, pay js. U xizmat qiladigan ishni qiladi: buyurtma summasini oladi, tanani env'dagi kalit bilan imzolaydi va webhook manziliga yuboradi."
   ],
   [
    "b",
    "Javob <b>200, <code>duplicate: false</code></b>; server logida to'lov satri",
    "Ishga tushiramiz: npm run pay, birinchi buyurtma. Yuborilgan tana va imzoning boshi ko'rinadi. Javob ikki yuz, ok true, duplicate false. Server logida: to'lov raqami, buyurtma bir, paid, bir yuz yigirma ming."
   ],
   [
    "c",
    "Bazada: <b><code>payments</code> da qator, <code>payment_status = paid</code></b>",
    "Bazaga qarang: payments jadvalida bitta qator, xizmatning to'lov raqami bilan. Orders jadvalida payment status paid. Ikkalasi bitta tranzaksiyada yozildi: yoki ikkalasi, yoki hech biri."
   ],
   [
    "d",
    "Xulosa: panel <b><code>order-changed</code> 'payment'</b> bilan o'zi yangilandi",
    "Xulosa: panelda to'lov ustuni chiziqchadan to'landi'ga o'zgardi, sahifa yangilanmadi. Tranzaksiya tugagach server order changed yubordi, sabab payment. WebSocket darsidagi qoida shu yerda ham ishladi. Endi buni o'zingiz qilasiz."
   ]
  ]
 },
 "8": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "wh-done tegida .env ga kalit yozing, serverni ishga tushiring, telefondan buyurtma bering va npm run pay bilan to'lang — panelda «To'landi»",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>wh-done</code> tegi, kalit, server va <code>npm run pay</code></b>",
    "Endi navbat sizga. OrderBotNest papkangizda wh done tegiga o'tasiz, env fayliga to'lov kalitini yozasiz, serverni ishga tushirasiz va telefondan buyurtma berasiz. Keyin npm run pay bilan to'laysiz. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>teg, <code>.env</code> da <code>PAYMENT_WEBHOOK_SECRET</code></b>, server — logda <code>/payments/webhook</code>",
    "Birinchi qadamda git fetch va checkout. Ikkinchisida env'ga payment webhook secret qatori: uzun tasodifiy satr, uni hech kimga bermaysiz. Server ishga tushganda migratsiya o'zi yuradi, logda payments webhook yo'li chiqishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <b>telefondan buyurtma, <code>npm run pay -- &lt;raqam&gt;</code></b>; isbot — javob satri",
    "Uchinchi qadamda brauzerda panel va telefondan botga buyurtma. To'rtinchisida ikkinchi terminalda npm run pay, buyurtma raqami bilan. Panelda to'landi chiqadi. Isbot maydoniga ikki yuz javob satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz botingizga to'lov xabarini qabul qiladigan manzil qo'shgansiz."
   ]
  ],
  "steps": [
   {
    "t": "Teg",
    "cmds": [
     "git fetch --tags",
     "git checkout wh-done",
     "npm install"
    ],
    "exp": "added … packages yoki up to date"
   },
   {
    "t": "Kalit va server",
    "cmds": [
     ".env ga PAYMENT_WEBHOOK_SECRET=<uzun tasodifiy satr>",
     "npm run start:dev"
    ],
    "exp": "Mapped {/payments/webhook, POST} route"
   },
   {
    "t": "Buyurtma",
    "cmds": [
     "brauzer: http://localhost:3000/admin",
     "telefon: botga buyurtma"
    ],
    "exp": "panelda yangi qator, «To'lov» — «—»"
   },
   {
    "t": "To'lov",
    "cmds": [
     "ikkinchi terminal: npm run pay -- <buyurtma raqami>"
    ],
    "exp": "← 200 {\"ok\":true,\"duplicate\":false} · panelda «To'landi»"
   }
  ],
  "proof": {
   "label": "npm run pay javob satri",
   "placeholder": "masalan: ← 200 {\"ok\":true,\"duplicate\":false}",
   "re": "200 \\{\"ok\":true,\"duplicate\":false\\}",
   "flags": "",
   "wrong": "npm run pay -- <raqam> dan keyingi ← 200 … satrini aynan nusxalang."
  },
  "trouble": [
   [
    "← 401 … imzo noto'g'ri",
    "server .env ni o'qimagan (kalit qo'shilgach qayta ishga tushiring) yoki skript va serverda kalit boshqa"
   ],
   [
    "GET /admin/orders → 401",
    ".env da ADMIN_PANEL_TOKEN yo'q — skript summani panel yo'lidan oladi"
   ],
   [
    "#… oxirgi 20 buyurtma ichida yo'q",
    "buyurtma raqami noto'g'ri — paneldagi # ustuniga qarang"
   ],
   [
    "relation \"payments\" does not exist",
    "server wh-done dan oldingi dist bilan — npm run start:dev ni qayta ishga tushiring"
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · takror va rad",
  "title": "Imzosiz xabar ham, boshqa kalit bilan imzolangani ham — 401, payments da yangi qator yo'q; server logida ikkita ogohlantirish",
  "seg": [
   [
    "a",
    "Imzosiz: <b><code>X-Signature</code> yo'q — 401</b>; tana to'g'ri bo'lsa ham",
    "Endi ochiq manzilga begona xabarlar. Birinchisi imzosiz: tana xuddi haqiqiydek, birinchi buyurtma to'landi, summa to'g'ri. Javob to'rt yuz bir, imzo noto'g'ri. Mazmuni to'g'ri bo'lsa ham, imzosiz xabarga ishonilmaydi."
   ],
   [
    "b",
    "Boshqa kalit: <b>imzo bor, lekin kalit boshqa — 401</b>",
    "Ikkinchisi ayyorroq: imzo bor, oltmish to'rt belgi, faqat boshqa kalit bilan hisoblangan. Kalitni bilmagan odam shunday qiladi. Server o'z kaliti bilan hisoblaydi, natija mos kelmaydi, yana to'rt yuz bir."
   ],
   [
    "c",
    "Server logida <b>ikki ogohlantirish</b>; <code>payments</code> da yangi qator yo'q",
    "Server logida ikkita ogohlantirish: imzo noto'g'ri, xabar rad etildi. Bazada payments qatorlari soni o'zgarmadi. Hujum bo'lsa ham, logdan ko'rinadi, ma'lumot buzilmaydi."
   ],
   [
    "d",
    "Xulosa: imzoni <b>faqat kalit egasi yasaydi</b>; kalit sirligi — butun himoya",
    "Xulosa: to'g'ri imzoni faqat kalitni bilgan yasaydi. Demak himoyaning hammasi kalit sirligida. Kalit env faylida va hosting sozlamasida, kodda ham, git'da ham, chatda ham emas. Endi xizmatning o'zi ikki marta yuborsa nima bo'lishini ko'ramiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · takror va rad",
  "title": "Xizmat javobni olmasa, xabarni qayta yuboradi: ikkinchisi 200 { duplicate: true }, qator bitta — bir vaqtda kelsa ham. Rad etilgan to'lov ham yoziladi",
  "seg": [
   [
    "a",
    "Javob yo'qolsa <b>xizmat qayta yuboradi</b>: ikkinchisi <code>duplicate: true</code>",
    "Haqiqiy xizmat javobimizni olmasa, masalan tarmoq uzilsa, xuddi shu xabarni qayta yuboradi. Npm run pay, ikki rejimi: birinchisi duplicate false, ikkinchisi duplicate true. Server logida: takror, yozilmadi. Javob baribir ikki yuz, aks holda xizmat qayta urinaveradi."
   ],
   [
    "b",
    "<code>ON CONFLICT (payment_id) DO NOTHING</code> — <b>bir vaqtda kelgan ikki xabar ham bitta qator</b>",
    "Payment service faylida insert, on conflict payment id do nothing, returning. Payment id noyob, takrorda hech narsa qaytmaydi va biz duplicate deymiz. Ikki xabar bir vaqtda kelganini ham sinadik: biri yozildi, biri takror, bazada bitta qator. Avval qidirib keyin yozsak, bu joyda ikkala so'rov ham o'tib ketishi mumkin edi."
   ],
   [
    "c",
    "Rad: <b><code>status: 'failed'</code> ham yoziladi</b> — «to'lovim qayerda?» savoliga javob",
    "Ikkinchi buyurtma, karta rad etdi: xabar baribir keladi va yoziladi, holat failed. Nega yozamiz? Mijoz to'lovim qayerda desa, admin ko'radi: urinish bo'lgan, rad etilgan. Hech narsa yozmasak, bu savolga javob yo'q."
   ],
   [
    "d",
    "Xulosa: panelda <b>«To'landi» va «Rad etildi»</b>; to'langani «rad» ga tushmaydi",
    "Xulosa: panelda ikkala holat, sahifa yangilanmadi. Yana bir qoida servisda: buyurtma allaqachon to'langan bo'lsa, keyingi rad xabari uni rad'ga tushirmaydi. Smoke shuni ham tekshiradi. Endi bu uchtasini o'zingiz sinaysiz."
   ]
  ]
 },
 "11": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "npm run pay ning to'rt rejimi: ikki marta, imzosiz, soxta, rad — har birining javobi va bazadagi natijasini ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: <b>to'rt rejim</b> — xizmat ikki marta yuborsa, begona yuborsa, karta rad etsa",
    "Endi navbat sizga. Npm run pay'ning to'rt rejimini sinaysiz: ikki marta, imzosiz, soxta kalit va rad. Har birida javobni va bazani ko'rasiz. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b><code>ikki</code>, keyin <code>imzosiz</code> va <code>soxta</code></b> — <code>duplicate: true</code> va 401",
    "Birinchi qadamda ikki rejimi: ikkinchi javobda duplicate true. Ikkinchisida imzosiz va soxta: ikkalasi to'rt yuz bir, server terminalida ogohlantirish. Bazada payments jadvalini oching, qatorlar soni o'zgarmaganini ko'ring."
   ],
   [
    "c",
    "3–4-qadam: <b>yangi buyurtma va <code>rad</code></b>; panelda «Rad etildi»; isbot — takror javobi",
    "Uchinchi qadamda yangi buyurtma va rad rejimi: panelda rad etildi. To'rtinchisida payments jadvalida to'lovlar va holatlar. Isbot maydoniga ikki rejimidagi duplicate true satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz takror, begona va rad xabarlarni o'zingiz sinab ko'rgansiz."
   ]
  ],
  "steps": [
   {
    "t": "Takror",
    "cmds": [
     "npm run pay -- <raqam> ikki"
    ],
    "exp": "2-javob ← 200 {\"ok\":true,\"duplicate\":true}"
   },
   {
    "t": "Begona",
    "cmds": [
     "npm run pay -- <raqam> imzosiz",
     "npm run pay -- <raqam> soxta"
    ],
    "exp": "ikkalasi ← 401, serverda imzo noto'g'ri"
   },
   {
    "t": "Rad",
    "cmds": [
     "telefondan yangi buyurtma",
     "npm run pay -- <yangi raqam> rad"
    ],
    "exp": "← 200, panelda «Rad etildi»"
   },
   {
    "t": "Baza",
    "cmds": [
     "psql: SELECT payment_id, order_id, status FROM payments;"
    ],
    "exp": "takror bitta qator, imzosiz/soxta yo'q, rad bor"
   }
  ],
  "proof": {
   "label": "ikki rejimining ikkinchi javobi",
   "placeholder": "masalan: ← 200 {\"ok\":true,\"duplicate\":true}",
   "re": "\"duplicate\":true",
   "flags": "",
   "wrong": "npm run pay -- <raqam> ikki dagi ikkinchi ← 200 … satrini qo'ying — unda \"duplicate\":true."
  },
  "trouble": [
   [
    "Ikkala javob duplicate: false",
    "payments.payment_id da UNIQUE yo'q — migratsiya yurmagan; serverni qayta ishga tushiring, \\d payments"
   ],
   [
    "imzosiz ham 200",
    "server eski kodda yoki tartib buzilgan — git status, git checkout wh-done"
   ],
   [
    "rad → 400 summa mos emas",
    "buyurtma raqami boshqa (summa boshqa buyurtmaniki)"
   ],
   [
    "Panelda «To'lov» ustuni yo'q",
    "sahifa eski — F5"
   ]
  ]
 },
 "12": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "Imzo baytlardan: xizmat JSON'ni bo'sh joy bilan yuborsa, xom tanadan hisoblagan kod qabul qiladi, JSON.stringify(body) dan hisoblagani rad etadi. rawBody o'chsa — haqiqiy to'lov ham 401",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>req.rawBody</code> ustiga bosing",
    "Endi to'rtta xatoni ataylab yasaymiz, birinchisini o'zingiz qilasiz. Payment controller ts'da imzo req raw body'dan hisoblanyapti, raw body yonib turibdi, ustiga bosing: imzo JSON stringify body'dan hisoblanadi.",
    "<b>payment.controller.ts</b>dagi <b><code>req.rawBody</code></b> ustiga bosing — imzo <code>JSON.stringify(body)</code> dan hisoblanadi."
   ],
   [
    "a",
    "Sodda xato: imzoni <b><code>JSON.stringify(body)</code> dan</b> hisoblash — «baribir o'sha ma'lumot-ku»",
    "Imzo endi xom tanadan emas, JSON stringify body'dan hisoblanadi. Bu juda keng tarqalgan xato. Ma'lumot baribir o'sha, deb o'ylaysiz. Bizning skript bo'sh joysiz yuboradi, shuning uchun bu kod u bilan ishlaydi."
   ],
   [
    "b",
    "Xizmat <b>bo'sh joy bilan</b> yubordi: to'g'ri kod 200, xato kod 401",
    "Lekin xizmat JSON'ni bo'sh joylar bilan yuborsa-chi? Imzo aynan shu baytlardan. To'g'ri kod qabul qildi, ikki yuz. Stringify qilgan kod esa obyektni qayta yozdi, bo'sh joylar yo'qoldi, imzo mos kelmadi, to'rt yuz bir. Haqiqiy to'lov rad etildi."
   ],
   [
    "c",
    "<code>main.ts</code> da <b><code>rawBody</code> yo'q</b>: <code>req.rawBody</code> bo'sh — haqiqiy to'lov ham 401",
    "Ikkinchi xato: main ts'dan raw body true olib tashlandi. Server logida create, ikkinchi argumentsiz. Npm run pay to'g'ri kalit bilan yuboradi, javob baribir to'rt yuz bir, bazada nol qator. Req raw body umuman yo'q, imzoni solishtiradigan narsa yo'q."
   ],
   [
    "d",
    "Demak, sabab: imzo <b>baytlardan</b>; xom tanani faqat <code>rawBody: true</code> saqlaydi",
    "Demak, sabab bitta: imzo matn ma'nosidan emas, aniq baytlardan hisoblanadi. Nest tanani o'qib, obyektga aylantiradi va baytlarni tashlaydi. Ularni faqat raw body true saqlaydi. Har ikki xatoda belgi bir xil: haqiqiy, to'g'ri imzoli to'lov to'rt yuz bir oladi."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "Yozuvni imzodan oldin qo'ysak: imzosiz xabar 401 oladi — lekin payments da qator bor va panelda «To'landi». Javob to'g'ri, bazada esa yolg'on",
  "seg": [
   [
    "x",
    "Uchinchi xato eng xavflisi — <b>uni ham o'zingiz qilasiz</b>: <code>record</code> satri ustiga bosing",
    "Uchinchi xato eng xavflisi, uni ham o'zingiz qilasiz. Controller'da yozuv satri yonib turibdi, ustiga bosing: u imzo tekshiruvidan oldinga ko'chadi.",
    "<b>payment.controller.ts</b>dagi <b><code>this.payments.record</code></b> ustiga bosing — yozuv imzo tekshiruvidan oldinga ko'chadi."
   ],
   [
    "a",
    "Uchinchi xato: <b><code>record</code> imzo tekshiruvidan oldin</b> — «avval yozib olay, keyin tekshiraman»",
    "Tartib almashdi: avval parse va record, keyin imzo. Kod ishlaydi, testlarsiz ko'rinmaydi. Imzosiz xabar yuboramiz."
   ],
   [
    "b",
    "Javob <b>401</b>: tashqaridan qaraganda hammasi to'g'ri",
    "Javob to'rt yuz bir, imzo noto'g'ri. Xabar yuborgan odam rad etildim deb o'ylaydi, server logida ham ogohlantirish. Tashqaridan qaraganda himoya ishlayapti."
   ],
   [
    "c",
    "Bazada <b><code>paid</code></b>, panelda <b>«To'landi»</b> — imzosiz xabar ishini qildi",
    "Lekin bazaga qarang: payments'da qator, buyurtma paid. Panelda ham to'landi, sahifa o'zi yangilandi. Yozuv tranzaksiyasi to'rt yuz birdan oldin tugagan. Admin buyurtmani yetkazib beradi, pul esa yo'q."
   ],
   [
    "d",
    "Demak, sabab: <b>401 yozilganni qaytarmaydi</b>; imzo — eng birinchi qadam",
    "Demak, sabab: to'rt yuz bir faqat javob, u bazaga yozilganni qaytarmaydi. Shuning uchun imzo eng birinchi qadam, hech qanday yozuvdan oldin. Bunday xatoni ko'z bilan topish qiyin, uni test ushlaydi, uchinchi amaliyotda ko'rasiz."
   ]
  ]
 },
 "14": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Bu controller imzosiz xabarga 401 qaytaradi, lekin buyurtma «to'landi» bo'lib qoladi. Joyida turmagan satrni toping",
  "q": "Tartib buzilishini ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu controller imzosiz xabarga to'rt yuz bir qaytaradi, lekin buyurtma to'landi bo'lib qoladi. Bo'lakda bitta satr imzodan oldin bazaga yozadi. O'sha satrni bosing.",
  "ok": "To'g'ri. Record chaqiruvi imzo tekshiruvidan oldin turibdi: tranzaksiya tugab, buyurtma paid bo'ladi, keyin imzo tekshirilib to'rt yuz bir qaytadi. Parse payment ham oldin, lekin u bazaga yozmaydi. Demak, javob kodiga emas, bazaga qarab tekshiring: yozuvni imzodan keyinga qo'ying.",
  "okShort": "<code>record(p)</code> imzodan oldin — yozuv bo'ladi, keyin 401. 401 yozilganni qaytarmaydi.",
  "hint": "Qaysi satr bazaga yozadi va u isValidSignature dan oldinmi, keyinmi?",
  "task": "Qoida: bazaga yozadigan chaqiruv <b>imzo tekshiruvidan keyin</b> turadi. Bu bo'lakda bitta satr imzodan <b>oldin bazaga yozadi</b>. <b>O'sha satrni bosing.</b>"
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "To'rtinchi xato — kalit .env da bo'sh: server ishga tushganda ogohlantiradi va har xabar 401. Imzo to'g'ri bo'lsa ham, summa yoki maydon xato — 400 va qator yo'q",
  "seg": [
   [
    "a",
    "Kalit bo'sh: server <b>ishga tushganda ogohlantiradi</b>",
    "To'rtinchi xato: env faylida payment webhook secret bo'sh qoldi, masalan hostingda qo'shish esdan chiqdi. Server ishga tushganda logda ogohlantirish: kalit bo'sh, har to'lov xabari to'rt yuz bir bilan rad etiladi. Bu satrni ishga tushirish logida qidiring."
   ],
   [
    "b",
    "Har xabar <b>401</b>, qator yo'q — bo'sh kalit bilan imzoni har kim yasardi",
    "Npm run pay ham bo'sh kalit bilan imzolaydi, server baribir to'rt yuz bir beradi. Bu ataylab shunday: bo'sh kalit bilan hisoblangan imzoni har kim hisoblay oladi. Bo'sh kalitni qabul qilish manzilni himoyasiz qoldirish bilan bir xil."
   ],
   [
    "c",
    "Imzo to'g'ri, lekin <b>summa mos emas yoki holat noma'lum — 400</b>",
    "Imzo to'g'ri bo'lsa ham hamma narsa yozilavermaydi. Summa bir ming ikki yuz, buyurtma esa bir yuz yigirma ming: to'rt yuz, summa mos emas. Holat ok deb kelsa: to'rt yuz, paid yoki failed. Ikkalasida bazada nol qator."
   ],
   [
    "d",
    "Xulosa: kalit — <b><code>.env</code> va hostingda</b>; kodda, git'da, chatda — yo'q",
    "Xulosa va kalit qoidalari. Kalit faqat env faylida va hosting sozlamasida. Git'ga tushmaydi, kodga yozilmaydi, AI'ga yoki chatga berilmaydi. Tushib qolsa, xizmat kabinetida darhol almashtiriladi. Endi tekshirib olaylik."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "Hostingda PAYMENT_WEBHOOK_SECRET qo'shilmay qoldi. Nega server bunday holatda imzoni umuman tekshirib o'tirmay, har xabarni rad etadi?",
  "q": "Kalitni ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Hostingda kalit qo'shilmay qoldi. Server bunday holatda imzoni umuman tekshirmay, har xabarni rad etadi. Nega? Variantni tanlang.",
  "ok": "To'g'ri. HMAC bo'sh kalit bilan ham hisoblanadi, xato chiqmaydi. Lekin bo'sh kalitni hamma biladi: istalgan odam to'g'ri ko'rinadigan imzo yasaydi va to'landi deb yozadi. Shuning uchun bo'sh kalit, darhol rad, va ishga tushganda ogohlantirish. Demak, kalitning yo'qligi ham xato, uni qabul qilib bo'lmaydi.",
  "okShort": "Bo'sh kalit — hammaga ma'lum kalit: imzoni har kim yasaydi. Shuning uchun darhol 401.",
  "hint": "Bo'sh kalitni kim biladi?",
  "demak": "Bo'sh kalit — himoya yo'q degani: server uni qabul qilmaydi va ishga tushganda aytadi.",
  "correct": 1,
  "opts": [
   "Bo'sh kalit bilan HMAC hisoblab bo'lmaydi, kod xato tashlaydi",
   "Bo'sh kalit bilan to'g'ri imzoni har kim hisoblay oladi",
   "Kalit bo'lmasa to'lov xizmati xabar yubormaydi",
   "Bo'sh kalitda server to'xtaydi, xatoni ko'rish qiyin"
  ],
  "wrong": {
   "0": "Hisoblanadi — createHmac bo'sh kalit bilan ham ishlaydi; muammo xavfsizlikda.",
   "2": "Xizmat o'z kabinetidagi kalit bilan yuboradi; bizdagi bo'sh kalitni bilmaydi.",
   "3": "Server to'xtamaydi — ishlaydi va logda ogohlantiradi."
  }
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "Controller'da record ni imzodan oldinga ko'chiring, npm test ni yurgizing — uchta test qizil bo'lishi kerak; keyin kodni qaytaring",
  "seg": [
   [
    "a",
    "Endi siz: tartibni <b>ataylab buzasiz</b> va testlar ushlashini ko'rasiz",
    "Endi navbat sizga. Payment controller'da tartibni ataylab buzasiz: parse va record'ni imzo tekshiruvidan oldinga ko'chirasiz. Keyin testlarni yurgizasiz va qaysilari qizarishini ko'rasiz. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>ikki satrni yuqoriga</b> ko'chiring; <code>npm test -- payment.controller</code>",
    "Birinchi qadamda const p va const r satrlarini if'dan yuqoriga ko'chirib saqlaysiz. Ikkinchisida npm test, payment controller. Uchta test qizil: imzosiz, boshqa kalit va tana o'zgargan. Ular servis chaqirilmasligini tekshiradi."
   ],
   [
    "c",
    "3–4-qadam: <b>qizil test nomlarini</b> o'qing; <code>git checkout</code> bilan qaytaring; isbot — natija satri",
    "Uchinchi qadamda qizil testlarning nomini o'qing: hammasi yozuvga yetmaslik haqida. To'rtinchisida git checkout bilan faylni qaytarib, testlarni yana yurgizasiz, hammasi yashil. Isbot maydoniga qizil natijadagi Tests satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz bilasiz: ko'z bilan ko'rinmaydigan xatoni to'g'ri yozilgan test ushlaydi."
   ]
  ],
  "steps": [
   {
    "t": "Buzish",
    "cmds": [
     "src/api/payment/payment.controller.ts: const p = parsePayment(body); va const r = await this.payments.record(p); → if ( dan oldinga"
    ],
    "exp": "saqlandi"
   },
   {
    "t": "Testlar",
    "cmds": [
     "npm test -- payment.controller"
    ],
    "exp": "FAIL · ✕ imzosiz — 401, yozuvga yetmaydi"
   },
   {
    "t": "O'qish",
    "cmds": [
     "qizil testlar nomi"
    ],
    "exp": "3 ta: imzosiz · boshqa kalit · tana o'zgargan"
   },
   {
    "t": "Qaytarish",
    "cmds": [
     "git checkout -- src/api/payment/payment.controller.ts",
     "npm test"
    ],
    "exp": "Tests: 48 passed"
   }
  ],
  "proof": {
   "label": "Qizil natijadagi Tests: satri",
   "placeholder": "masalan: Tests: 3 failed, 3 passed, 6 total",
   "re": "3 failed",
   "flags": "",
   "wrong": "Buzilgan kod bilan npm test -- payment.controller dagi Tests: … satrini qo'ying — unda 3 failed."
  },
  "trouble": [
   [
    "Hammasi yashil",
    "fayl saqlanmagan yoki satrlar if ichiga tushgan — git diff"
   ],
   [
    "Cannot find name 'p'",
    "const p record dan keyin qolgan — avval parsePayment, keyin record"
   ],
   [
    "6 tadan ko'p test qizil",
    "if bloki buzilgan (qavs) — git checkout bilan qaytarib qayta urining"
   ],
   [
    "npm test umuman ishlamaydi",
    "npm install qilinmagan (wh-done da yangi paket yo'q, lekin node_modules kerak)"
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI",
  "title": "Ikki AI'ga xizmat hujjatidagi kabi qisqa talab: «POST, JSON, HMAC-SHA256, X-Signature, kalit .env da». Ikkalasi xom tana, timingSafeEqual va takrorni o'zi qildi",
  "seg": [
   [
    "a",
    "Yana AI bosqichi: <b>AI webhook yozadi, siz qabul qilasiz</b> — qisqa talab bilan",
    "Beshinchi bosqich, AI. Ikki AI'ga to'lov xizmati hujjatidagi kabi qisqa talab berdik: POST, JSON, HMAC SHA256, X Signature sarlavhasi, kalit env'da. Xom tana, takror, tartib, summa haqida bir so'z yo'q. Kuchli va kuchsizroq model."
   ],
   [
    "b",
    "Prompt — <b>to'rt maydon va imzo</b>; qolganini AI o'zi o'ylashi kerak",
    "Prompt ekranda aynan. To'lov raqami, buyurtma raqami, holat, summa va imzo. Bunday talabdan to'g'ri webhook chiqishi uchun AI bugun siz o'rgangan hamma narsani o'zi bilishi kerak: baytlar, takror, tartib, summa."
   ],
   [
    "c",
    "Ikkalasi: <b>xom tana, <code>timingSafeEqual</code>, takror</b>; farq — summa va takror javobida",
    "Ikkalasi ham raw body'ni yoqdi, timing safe equal ishlatdi, payment id'ni noyob qildi. Birinchisi ancha chuqur: sha256 old qo'shimchasini ham qabul qiladi, summa mos kelmasa alohida holat. Ikkinchisi summa farq qilsa ham to'landi deydi, faqat logga yozadi."
   ],
   [
    "d",
    "AI-2 o'zi aytdi: <b>«summa farq qilsa — 200, siz hal qiling»</b>; AI-1 — doiradan chiqqanini",
    "Ikkinchi AI'ning javobida halol jumla bor: summa farq qilsa xabar qabul qilinadi, siz hal qiling. Ya'ni qaror sizda. Birinchisi esa bir marta papkasidan tashqariga fayl ko'chirib, o'chirganini aytdi. Endi ikkalasini haqiqiy bazada sinaymiz."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Haqiqiy PostgreSQL bilan yetti sinov: imzo, takror, bo'sh joyli JSON, bir vaqtda — ikkalasi o'tdi. Summa 1 200 (buyurtma 120 000): AI-1 «Summa mos emas», AI-2 «To'landi»",
  "seg": [
   [
    "a",
    "Haqiqiy bazada: imzo, takror, bo'sh joyli JSON, bir vaqtda — <b>ikkalasi to'g'ri</b>",
    "Ikkala nusxani haqiqiy Postgres bilan, bizning sinovlar bilan tekshirdik. To'g'ri imzo ikki yuz, takror bitta qator, imzosiz va qisqa imzo to'rt yuz bir, bo'sh joyli JSON qabul, bir vaqtda ikki xabar bitta qator. Bu qismda ikkalasi to'g'ri."
   ],
   [
    "b",
    "Summa 1 200, buyurtma 120 000: <b>AI-2 panelda «To'landi»</b>, AI-1 «Summa mos emas»",
    "Beshinchi sinov: imzo to'g'ri, lekin summa bir ming ikki yuz, buyurtma esa bir yuz yigirma ming. Ikkinchi AI'da panel to'landi deydi, admin yetkazib beradi. Birinchisida summa mos emas holati: to'lov yozildi, lekin admin farqni ko'radi."
   ],
   [
    "c",
    "Halol solishtiruv: <b>bu yerda AI-1 bizdan yaxshiroq</b> — pul o'tgan bo'lsa, yozuv yo'qolmaydi",
    "Halol solishtiramiz. Bizning kod bunday xabarga to'rt yuz qaytaradi va yozmaydi. Lekin pul haqiqatan o'tgan bo'lishi mumkin, yozuv esa yo'q. Birinchi AI yozib, alohida belgilaydi. Bu yerda u bizdan yaxshiroq, uyga vazifada shuni qilasiz."
   ],
   [
    "d",
    "Xulosa: AI webhook'iga <b>to'rt savol</b>: baytlarmi · tartib · takror · summa",
    "Xulosa: AI yozgan webhook'ga to'rt savol. Imzo xom baytlardanmi. Imzo yozuvdan oldinmi. Takror va bir vaqtda kelgan xabar bitta qatormi. Summa buyurtma bilan solishtiriladimi. Javobni kodda va haqiqiy bazada tekshiring."
   ]
  ]
 },
 "20": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "2-AI panelida: #2 «To'landi · 1 200 so'm», buyurtma esa 120 000 so'm. Server logida faqat ogohlantirish. Bu yerda nima xavf?",
  "q": "AI webhook'larini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. Ikkinchi AI panelida buyurtma to'landi, bir ming ikki yuz so'm, buyurtma esa bir yuz yigirma ming. Server logida faqat ogohlantirish. Bu yerda nima xavf? Variantni tanlang.",
  "ok": "To'g'ri. Admin logni emas, panelni ko'radi, panel esa to'landi deydi. Buyurtma yetkaziladi, pulning yuzdan biri kelgan. Imzo to'g'ri, xabar haqiqiy: masalan, xizmat summani tiyinda yuborgan. Demak, summa buyurtma jami bilan solishtiriladi va mos kelmasa, alohida ko'rinadigan holat bo'ladi.",
  "okShort": "Panel «To'landi» — admin yetkazadi, pul 1 %. Summani jami bilan solishtiring.",
  "hint": "Admin qayerga qaraydi — logga yoki panelga? Imzo nimani isbotlaydi?",
  "demak": "Imzo xabar haqiqiyligini isbotlaydi, summaning to'g'riligini emas — summa alohida tekshiriladi.",
  "correct": 0,
  "opts": [
   "Admin buyurtmani to'liq to'langan deb yetkazib yuboradi",
   "Xavf yo'q — log ogohlantiryapti, admin uni baribir har kuni o'qiydi",
   "Imzo buzilgan — demak xabar soxta bo'lishi mumkin",
   "Takror xabar keyin ikkinchi qatorni ham yozib qo'yadi"
  ],
  "wrong": {
   "1": "Admin panelga qaraydi, logga emas — ogohlantirish ko'rinmaydi.",
   "2": "Imzo to'g'ri — xabar haqiqiy; muammo summada (masalan, tiyinda yuborilgan).",
   "3": "Takror bu yerda yo'q — ikkala AI ham bitta qator yozadi."
  }
 },
 "21": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m11-03 · «Webhook: to'lov Backend'ga qanday yetib keladi»",
  "title": "O'quvchi darsi: Maydon Jamoa'da Pro obuna, test rejim — siz bugun OrderBotNest'da qilgan xabar, imzo, takror va radning o'zi",
  "seg": [
   [
    "a",
    "m11-03 — 20 ekran: <b>Maydon Jamoa, Pro obuna, test rejim</b> — pul yechilmaydi",
    "Endi sinfga tayyorgarlik. O'quvchi darsi m11-03, yigirma ekran. Misol Maydon Jamoa: o'yin tashkilotchisi Pro obuna uchun to'laydi, o'ttiz kun, o'n ming so'm. Hammasi test rejimda, karta so'ralmaydi, pul yechilmaydi."
   ],
   [
    "b",
    "O'quvchi ham <b>xabar, imzo, takror va rad</b>; amaliyotda agent bilan o'z Backend'i",
    "O'quvchi darsidagi yo'l siznikidek: to'lov xabari, imzo, takror, rad va to'lov oqimi sxemasi. Amaliyotda o'quvchi o'z Backend'iga webhook qo'shadi, agent bilan, keyin mashq sahifasida uch tekshiruv. Kalit faqat env va Render'da."
   ],
   [
    "c",
    "Bloklar: <b>og'ir joy — 8-ekran kod oynasi va ikki amaliyot</b>",
    "Bloklar jadvaliga qarang. Og'ir joy sakkizinchi ekrandagi kod oynasi va ikki amaliyot, har birida Render'da yangi versiya kutiladi. Har blokda siz qo'shadigan narsa o'ng ustunda, bugungi ekran raqami bilan."
   ],
   [
    "d",
    "Xulosa: repo <b><code>m13-dars-03-done</code></b>: <code>POST /tolov/webhook</code>, <code>X-Imzo</code>, <code>TOLOV_KALITI</code>",
    "Xulosa: o'quvchi loyihasi maydon jamoa, o'n uchinchi modul uchinchi dars done tegi. Manzil tolov webhook, imzo X Imzo sarlavhasida, kalit TOLOV KALITI. Nomlar o'zbekcha, qoidalar siz bugun ko'rgandek. Keyingi ekranda o'quvchi so'zlari."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "O'quvchi tilida: to'lov xabari, imzo, kalit, takror — va «Mashq to'lov» sahifasining to'rt tugmasi; tartib buzilganda o'quvchi loyihasida ham 401, lekin qator yozilgan",
  "seg": [
   [
    "a",
    "O'quvchi so'zlari: <b><code>X-Imzo</code>, <code>TOLOV_KALITI</code>, <code>takror: true</code></b> — siznikining o'zbekcha nomi",
    "O'quvchi darsidagi so'zlar: to'lov xabari, imzo X Imzo sarlavhasida, kalit TOLOV KALITI, takror xabarga javob takror true. Siz bilgan narsalar, faqat nomlar o'zbekcha. O'quvchi aytganda, yonida OrderBotNest nomini ayting."
   ],
   [
    "b",
    "«Mashq to'lov» sahifasi: <b>to'rt tugma</b> — xizmat o'rnida Backend'ning o'zi",
    "O'quvchida npm run pay o'rniga sahifa bor: mashq to'lov. Karta so'ralmaydi, pul yechilmaydi. To'rt tugma: to'lash, rad etish, ikki marta yuborish, imzosiz yuborish. Siz bugun skriptning xuddi shu to'rt rejimini sinadingiz."
   ],
   [
    "c",
    "Tugmalar: <b>«To'lash» 200, «Imzosiz» 401</b> — o'quvchi loyihasida haqiqiy Backend bilan",
    "Bu chiqishlar o'quvchi loyihasining haqiqiy Backend'idan: to'lash, ikki yuz ok. Imzosiz, to'rt yuz bir, imzo mos emas. Sinfda o'quvchi shu ikki javobni ko'rishi kerak."
   ],
   [
    "d",
    "Xulosa: o'quvchida ham <b>tartib buzilsa 401, lekin qator yozilgan</b> — 13-ekrandagi xato",
    "Xulosa va ogohlantirish. O'quvchi loyihasida ham tekshiruv tartibini buzib ko'rdik: imzosiz to'rt yuz bir, lekin to'lovlar jadvalida qator. Agent kodni yozganda o'quvchi javob kodiga emas, jadvalga qarasin."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "401 bo'lsa — kalit, rawBody, tartib; qolganida javob matnini o'qing: olti holat va o'quvchi so'raydigan to'rt savol",
  "seg": [
   [
    "a",
    "Birinchi uchtasi — <b>401 bilan bog'liq</b>: kalit, <code>rawBody</code>, tartib",
    "Sinfda uchraydigan olti holat. Birinchi uchtasi imzo bilan bog'liq. Hamma xabar to'rt yuz bir: kalit bo'sh yoki Render'dagisi boshqa. Haqiqiy to'lash ham to'rt yuz bir: raw body yoqilmagan. Javob to'rt yuz bir, lekin jadvalda qator: tartib buzilgan."
   ],
   [
    "b",
    "Qolgan uchtasi: <b>ikki qator, 400 va <code>.env</code> Git'da</b>",
    "To'rtinchisi: ikki marta tugmasi ikki qator yozdi, to'lov raqami noyob emas. Beshinchisi: to'rt yuz, javob matnida qaysi maydon xato yozilgan. Oltinchisi: env fayl Git'ga tushib qolgan, bunda kalitlar darhol almashtiriladi."
   ],
   [
    "c",
    "O'quvchi savollari: <b>Payme, takrorga 200, rad, kalitni agentga berish</b>",
    "O'quvchi savollariga tayyor javoblar pastda, bosib oching: Payme ulasam bo'ladimi, nega takrorga ham ikki yuz, nega rad yoziladi va kalitni agentga bersam bo'ladimi."
   ],
   [
    "d",
    "Xulosa: 401 da <b>kalit → <code>rawBody</code> → tartib</b>; jadvalga qarang, javobga emas",
    "Xulosa va usul: javob to'rt yuz bir bo'lsa, shu tartibda tekshiring: kalit, raw body, keyin tekshiruv tartibi. Har doim jadvalga qarang, faqat javob kodiga emas. Shu bilan sinfga tayyorsiz. Endi o'zingizni tekshiring."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Mijoz to'laganini server nimadan biladi?",
    "o": [
     "Mijoz yuborgan to'lov skrinshotidan",
     "Botdagi «To'ladim» tugmasi bosilganidan",
     "To'lov xizmatining imzoli xabaridan",
     "Admin panelda qo'ygan belgidan"
    ],
    "c": 2,
    "e": "Dalil — faqat xizmatning imzoli xabari.",
    "s": 2
   },
   {
    "q": "Imzo nimadan hisoblanadi?",
    "o": [
     "Xom tana va maxfiy kalitdan",
     "JSON obyekt va buyurtma raqamidan",
     "Sarlavhalar va IP manzildan",
     "Summa va vaqt belgisidan"
    ],
    "c": 0,
    "e": "HMAC — baytlar va kalitdan.",
    "s": 4
   },
   {
    "q": "main.ts da rawBody: true yo'q. Nima bo'ladi?",
    "o": [
     "Imzosiz xabarlar ham o'tib ketadi",
     "Haqiqiy to'lov ham 401 oladi",
     "Takror xabarlar ikki marta yoziladi",
     "Server umuman ishga tushmaydi"
    ],
    "c": 1,
    "e": "Imzoni solishtiradigan bayt yo'q.",
    "s": 12
   },
   {
    "q": "Imzosiz xabar 401 oldi, lekin buyurtma «To'landi». Sabab?",
    "o": [
     "Kalit .env faylida bo'sh qolib ketgan",
     "main.ts da rawBody yoqilmagan",
     "timingSafeEqual ishlatilmagan",
     "Yozuv imzo tekshiruvidan oldin"
    ],
    "c": 3,
    "e": "401 yozilganni qaytarmaydi.",
    "s": 13
   },
   {
    "q": "Xizmat bitta xabarni ikki marta yubordi. Server nima qiladi?",
    "o": [
     "Ikkinchisiga 409 qaytaradi",
     "Ikkala marta yozadi",
     "200 duplicate, qator bitta",
     "Ikkinchisiga 401 qaytaradi"
    ],
    "c": 2,
    "e": "payment_id noyob, ON CONFLICT.",
    "s": 10
   },
   {
    "q": "Karta rad etildi, xizmat xabar yubordi. Nima qilinadi?",
    "o": [
     "Yoziladi, holati failed",
     "Tashlab yuboriladi, chunki pul o'tmagan",
     "400 qaytariladi",
     "Buyurtma o'chiriladi"
    ],
    "c": 0,
    "e": "«To'lovim qayerda?» ga javob.",
    "s": 10
   },
   {
    "q": ".env da kalit bo'sh. Server nima qiladi?",
    "o": [
     "Imzoni tekshirmay hammasini qabul qiladi",
     "Ogohlantiradi va har xabarni rad etadi",
     "Umuman ishga tushmaydi",
     "Kalitni xizmatdan o'zi so'raydi"
    ],
    "c": 1,
    "e": "Bo'sh kalitni hamma biladi.",
    "s": 15
   },
   {
    "q": "AI webhook'i 1 200 so'mlik to'lovni 120 000 so'mlik buyurtmaga «To'landi» dedi. To'g'ri qaror?",
    "o": [
     "Ishlayapti, imzo to'g'ri — shundayligicha qabul qilish",
     "Faqat logni o'qib turish",
     "Imzoni uzunroq qilish",
     "Summani jami bilan solishtirib ajratish"
    ],
    "c": 3,
    "e": "Imzo summani isbotlamaydi.",
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
