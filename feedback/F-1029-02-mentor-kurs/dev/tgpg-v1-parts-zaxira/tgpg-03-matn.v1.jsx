
// ============================================================
//  TELEGRAF+PG MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/tgpg-matn.py (manba: 17-TgPg-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Telegraf",
  "title": "Bot javob beradi. Lekin bir daqiqa oldingi gapni eslaydimi?",
  "seg": [
   [
    "a",
    "Telegraf'ni bilasiz — bugun botga xotira beramiz: <b>state bazada</b>",
    "Assalomu alaykum. Telegraf'ni bilasiz: handler, reply, BotFather. Bugun botga xotira beramiz: suhbat qaysi bosqichda ekanini bot eslab qolsin, server qayta ishga tushsa ham."
   ],
   [
    "b",
    "Avval state'siz bot, keyin xotiradagi state va <b>nega u yo'qoladi</b>",
    "Avval state'siz bot qanday adashishini ko'ramiz. Keyin state'ni dastur xotirasida saqlaymiz va qayta ishga tushirganda nima bo'lishini ko'ramiz."
   ],
   [
    "c",
    "Keyin PostgreSQL'da state, uni <b>ataylab buzamiz</b> va o'quvchi reposini ishga tushiramiz",
    "Keyin state'ni PostgreSQL'ga ko'chiramiz, uni ataylab buzamiz va o'quvchi reposini o'z kompyuteringizda ishga tushiramiz."
   ],
   [
    "d",
    "Olti bosqich, uch amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Dars olti bosqichdan iborat, uchta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · state",
  "title": "«Pepperoni» — «Tushunmadim»: bot o'z savolini eslamaydi",
  "seg": [
   [
    "a",
    "O'quvchi darsi shu suhbatdan boshlanadi: bot savol beradi, <b>javobni tushunmaydi</b>",
    "O'quvchi darsi shu suhbatdan boshlanadi. Aziza pitsa buyurtma qilmoqchi. Bot qaysi pitsa deb so'raydi, Aziza pepperoni deydi, bot esa tushunmadim deydi."
   ],
   [
    "b",
    "Har xabar alohida keladi: handler <b>oldingi xabarni bilmaydi</b>",
    "Nega? Telegraf'da har xabar alohida keladi va handler faqat shu xabarni ko'radi. Pepperoni so'zi kelganda bot o'zi pitsa so'raganini bilmaydi."
   ],
   [
    "c",
    "Javob matnlari <b>haqiqiy Telegraf</b> handler'idan — Telegram oynasi esa maket",
    "Ekrandagi javoblar haqiqiy Telegraf handler'idan olingan. Telegram serveriga ulanmadik: xabarni kod bilan berdik va botning javobini ushladik. Chat oynasi esa maket."
   ],
   [
    "d",
    "Xulosa: state'siz bot har xabarni <b>birinchi xabardek</b> ko'radi — suhbat qayerdaligini bilmaydi",
    "Xulosa: state'siz bot har xabarni birinchi xabardek ko'radi. Suhbat qayerda turganini biladigan yozuv kerak. Uni state deymiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · state",
  "title": "state[chat.id]: bot savolini eslab qoldi — suhbat davom etdi",
  "seg": [
   [
    "a",
    "State'siz botdan keyin eng oddiy yechim: <b>state'ni obyektda saqlash</b>",
    "Eng oddiy yechim: state'ni oddiy obyektda saqlash. Kalit chat id, qiymat suhbat bosqichi, masalan waiting pizza."
   ],
   [
    "b",
    "Har xabarda bot <b>avval state'ga qaraydi</b>, keyin javob beradi va state'ni o'zgartiradi",
    "Endi har xabarda bot avval state'ga qaraydi. Pitsa kutayotgan bo'lsa, kelgan so'z pitsa nomi. Javob beradi va state'ni waiting size qiladi."
   ],
   [
    "c",
    "Natija: «Pepperoni — yaxshi tanlov!», xotirada esa state <b><code>WAITING_SIZE</code></b> bo'ldi",
    "Natija: pepperoni, yaxshi tanlov, qaysi o'lchamda. Suhbat davom etdi. Xotirada esa Azizaning state'i: waiting size."
   ],
   [
    "d",
    "Xulosa: state bilan bot suhbatni davom ettiradi — lekin bu state <b>dastur xotirasida</b> turibdi",
    "Xulosa: state bilan bot suhbatni davom ettiradi. Lekin bu obyekt dastur xotirasida, RAM'da turibdi. Keyingi ekranda botni qayta ishga tushiramiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "1-bosqich · state",
  "title": "Bot qayta ishga tushdi — «Katta» ga «Salom! Qaysi pitsa?»",
  "seg": [
   [
    "a",
    "Server vaqti-vaqti bilan <b>qayta ishga tushadi</b>: yangi versiya yoki nosozlikdan keyin",
    "Bot serveri vaqti-vaqti bilan qayta ishga tushadi: yangi versiya chiqqanda yoki nosozlikdan keyin. Biz ham botni to'xtatib, qayta ishga tushirdik."
   ],
   [
    "b",
    "Aziza «Katta» deb yozdi — bot uni <b>yangi mijozdek</b> kutib oldi",
    "Aziza o'lchamni yozdi: katta. Bot esa salom, qaysi pitsa deydi. Obyekt bo'sh boshlandi, Azizaning state'i yo'q, bot uni yangi mijoz deb o'yladi."
   ],
   [
    "c",
    "RAM — dastur yashaganicha; jarayon tugasa, <b>obyekt ham yo'qoladi</b>",
    "Sabab: obyekt dastur xotirasida, jarayon tugasa u ham yo'qoladi. O'quvchi darsi buni ikki quti bilan ko'rsatadi: dastur xotirasi vaqtinchalik, PostgreSQL doimiy."
   ],
   [
    "d",
    "Xulosa: qayta ishga tushirishdan keyin faqat <b>bazaga yozilgan state</b> qoladi",
    "Xulosa: qayta ishga tushirishdan keyin faqat bazaga yozilgan state qoladi. Shuning uchun haqiqiy botda state PostgreSQL'da turadi."
   ]
  ]
 },
 "5": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Bot qayta ishga tushdi. Qaysi state saqlanib qoladi?",
  "q": "Qayta ishga tushirishni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Bot qayta ishga tushdi. Qaysi state saqlanib qoladi? Variantni tanlang.",
  "ok": "To'g'ri, PostgreSQL'dagisi. Baza ma'lumotni diskka yozadi, bot qayta ishga tushsa ham u joyida. Obyekt va o'zgaruvchi dastur xotirasida, ular yo'qoladi. Demak, bot qayta ishga tushgandan keyin ham kerak bo'ladigan state bazaga yoziladi.",
  "okShort": "PostgreSQL — diskda, qoladi. Obyekt — RAM'da, yo'qoladi.",
  "hint": "Qaysi biri diskka yoziladi?",
  "correct": 1,
  "opts": [
   "Koddagi obyektga yozilgan state",
   "PostgreSQL'dagi users jadvaliga yozilgan state",
   "Handler ichidagi o'zgaruvchi",
   "Hech qaysi"
  ],
  "wrong": {
   "0": "Obyekt RAM'da: qayta ishga tushganda bo'sh boshlanadi (4-ekran).",
   "2": "Handler o'zgaruvchisi keyingi xabargacha ham yashamaydi.",
   "3": "Bazaga yozilgani qoladi."
  }
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · alohida",
  "title": "Bitta tanlov o'zgaruvchisi: Aziza Jasurning Margaritasini oldi",
  "seg": [
   [
    "a",
    "Bitta mijoz bilan ishladi — endi <b>ikki mijoz</b> bir vaqtda yozadi",
    "Bitta mijoz bilan state ishladi. Lekin botga bir vaqtda o'nlab odam yozadi. O'quvchi darsidagi vaziyat: Aziza va Jasur."
   ],
   [
    "b",
    "State bitta umumiy o'zgaruvchida: har yangi xabar oldingisining <b>ustiga yozadi</b>",
    "Bu kodda tanlov bitta umumiy o'zgaruvchida, hamma uchun bitta. Aziza pepperoni yozdi, keyin Jasur margarita yozdi va uning ustiga yozildi."
   ],
   [
    "c",
    "Aziza «Katta» deydi — bot <b>«Buyurtma: Margarita, katta»</b> javobini beradi",
    "Aziza katta deb yozdi va javob oldi: buyurtma margarita, katta. Aziza margarita so'ramagan. Xato hech qayerda chiqmadi, buyurtma xato bermay aralashdi."
   ],
   [
    "d",
    "Xulosa: umumiy o'zgaruvchi — ikki mijozning suhbati <b>xato bermay aralashadi</b>",
    "Xulosa: umumiy o'zgaruvchida ikki mijozning suhbati xato bermay aralashadi. Har mijozning state'i alohida turishi kerak."
   ]
  ]
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · alohida",
  "title": "Har mijozning state'i o'z chat.id si ostida: obyekt kaliti yoki jadval qatori",
  "seg": [
   [
    "a",
    "Har mijozning Telegram raqami bor: shaxsiy chatda u <b><code>ctx.chat.id</code></b>",
    "Aralashmaslik uchun har mijozni raqami bilan ajratamiz. Telegram'da har mijozning raqami bor, shaxsiy chatda u ctx chat id."
   ],
   [
    "b",
    "3-ekrandagi obyekt shunday edi: kalit — <code>chat.id</code>, har mijozga <b>o'z state'i</b>",
    "Uchinchi ekrandagi obyekt aynan shunday edi: kalit chat id, qiymat state. Azizaning state'i Jasurnikiga tegmaydi."
   ],
   [
    "c",
    "Bazada ham xuddi shu: har mijozga <b>bitta qator</b>, <code>telegram_id</code> ustuni bilan topiladi",
    "Bazada ham xuddi shunday: users jadvalida har mijozga bitta qator. Bot qatorni telegram id ustuni bilan topadi."
   ],
   [
    "d",
    "Xulosa: sessiya — bitta mijozning alohida state'i; kaliti — <b><code>chat.id</code></b>",
    "Xulosa: bitta mijozning alohida state'i sessiya deyiladi, uning kaliti chat id. O'quvchi darsi shu so'zni ishlatadi."
   ]
  ]
 },
 "8": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "Umumiy tanlov: Aziza «Pepperoni», Jasur «Margarita», Aziza «Katta». Azizaga qanday javob keladi?",
  "q": "Aralashishni ko'rdingiz, tekshirib olaylik. Ikkinchi tekshiruv. Tanlov bitta umumiy o'zgaruvchida. Aziza pepperoni, Jasur margarita, keyin Aziza katta deb yozdi. Azizaga qanday javob keladi? Variantni tanlang.",
  "ok": "To'g'ri, margarita. Jasurning xabari umumiy o'zgaruvchining ustiga yozildi. Xato chiqmaydi, shuning uchun bunday xatoni sezish qiyin. Demak, har mijozning state'i uning chat id'si bo'yicha alohida saqlanishi kerak.",
  "okShort": "Margarita — Jasurniki ustiga yozildi, xato chiqmadi.",
  "hint": "Oxirgi marta tanlov ga kim yozdi?",
  "correct": 2,
  "opts": [
   "«Buyurtma: Pepperoni, katta»",
   "Xato chiqadi, bot to'xtaydi",
   "«Buyurtma: Margarita, katta»",
   "Bot javob bermaydi"
  ],
  "wrong": {
   "0": "Pepperoni Jasurning xabarida ustidan yozildi.",
   "1": "Kod to'g'ri ishlaydi — faqat state umumiy.",
   "3": "Handler javob beradi, lekin noto'g'ri pitsa bilan."
  }
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · PostgreSQL",
  "title": "telegram_id BIGINT NOT NULL UNIQUE: Telegram raqami 32 bitga sig'maydi",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi jadval: har mijoz — <b>bitta qator</b>, state'i shu qatorda",
    "Endi state'ni PostgreSQL'ga ko'chiramiz. O'quvchi darsidagi jadval: users. Har mijoz bitta qator, uning ismi va state'i shu qatorda."
   ],
   [
    "b",
    "<code>telegram_id</code> — <code>BIGINT</code>: Telegram hujjati raqam <b>32 bitdan katta</b> bo'lishi mumkin deydi",
    "Telegram id ustuni big int. Nega oddiy int emas? Telegram Bot API hujjati aytadi: bu raqam o'ttiz ikki bitdan katta bo'lishi mumkin. Oddiy int esa o'ttiz ikki bit."
   ],
   [
    "c",
    "<code>NOT NULL UNIQUE</code> — har mijozga <b>faqat bitta qator</b>, ikkinchisini baza o'zi rad etadi",
    "Not null unique: raqamsiz qator yo'q va bitta mijozga faqat bitta qator. Ikkinchi qatorni baza o'zi rad etadi, buni o'n beshinchi ekranda ko'ramiz."
   ],
   [
    "d",
    "Xulosa: jadval tayyor — <code>telegram_id</code> bilan qator topiladi, <code>state</code> ustunida <b>suhbat bosqichi</b>",
    "Xulosa: jadval tayyor. Telegram id bilan mijozning qatori topiladi, state ustunida suhbat bosqichi turadi."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · PostgreSQL",
  "title": "Har xabarda: avval o'qish, yangi mijozga INSERT, keyin yangi state UPDATE bilan",
  "seg": [
   [
    "a",
    "Har xabarda birinchi ish — <b>SELECT</b>: bu mijozning qatori bormi, state'i qanday",
    "Bazali bot har xabarda birinchi bo'lib o'qiydi: select, telegram id shu raqam bo'lgan qator. Qator bor bo'lsa, state ma'lum."
   ],
   [
    "b",
    "Qator yo'q bo'lsa — yangi mijoz: <b>INSERT</b>, state <code>WAITING_NAME</code>, «Ismingiz nima?»",
    "Qator topilmasa, bu yangi mijoz. Insert bilan qator qo'shamiz, state waiting name. Javob: ismingiz nima."
   ],
   [
    "c",
    "State <code>WAITING_NAME</code> bo'lsa — kelgan matn ism: <b>UPDATE</b>, state <code>READY</code>",
    "Keyingi xabarda state waiting name bo'lsa, kelgan matn ism. Update bilan ismni yozamiz va state'ni tayyor qilamiz."
   ],
   [
    "d",
    "Xulosa: SELECT → (yo'q bo'lsa INSERT) → javob → UPDATE; <b>tartibni almashtirib</b> bo'lmaydi",
    "Xulosa: avval select, yo'q bo'lsa insert, keyin javob va update. O'quvchi darsida bu tartib bo'laklardan yig'iladi: update select'dan oldin bo'lsa, bot state'ni bilmay turib yozib yuboradi."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · PostgreSQL",
  "title": "Bot qayta ishga tushdi — «Yana salom, Aziza!», Jasur o'z joyidan davom etdi",
  "seg": [
   [
    "a",
    "4-ekrandagi sinovni takrorlaymiz: bot to'xtaydi va <b>qayta ishga tushadi</b>",
    "To'rtinchi ekrandagi sinovni bazali bot bilan takrorlaymiz. Aziza ismini aytdi, Jasur esa endigina start bosdi. Botni to'xtatib, qayta ishga tushiramiz."
   ],
   [
    "b",
    "Aziza /start — <b>«Yana salom, Aziza!»</b>: ism bazadan o'qildi",
    "Aziza start bosdi: yana salom, Aziza. Bot ismni bazadan o'qidi, qayta ishga tushirish hech narsani o'chirmadi."
   ],
   [
    "c",
    "Jasur ismini yozdi — bot uni ism deb tushundi, chunki <b>state bazada qolgan</b>",
    "Jasur qayta ishga tushgandan keyin ismini yozdi. Bot uni ism deb tushundi, chunki uning state'i, waiting name, bazada qolgan edi."
   ],
   [
    "d",
    "Xulosa: state bazada — qayta ishga tushirish ham, ikki mijoz ham <b>muammo emas</b>",
    "Xulosa: state bazada bo'lsa, qayta ishga tushirish ham, ikki mijoz ham muammo emas. Endi buni o'z botingizda qilasiz."
   ]
  ]
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "O'z botingiz: users jadvali, ism va qayta ishga tushirish",
  "seg": [
   [
    "a",
    "Endi siz: kichik bot yasaysiz, u ismingizni <b>bazada eslab qoladi</b>",
    "Endi navbat sizga. Kichik bot yasaysiz, u ismingizni bazada eslab qoladi. Baza: PostgreSQL birinchi darsda o'rnatgan PostgreSQL'ingiz. O'n besh daqiqa."
   ],
   [
    "b",
    "1–2-qadam: jadval va bot fayli — <b>BotFather tokeni</b>, lokal baza",
    "Birinchi: PostgreSQL terminalida botdb bazasi va users jadvali. Ikkinchi: yangi papka, telegraf va pg paketlari, bot js fayli. Token BotFather'dan, o'zingiz bilasiz."
   ],
   [
    "c",
    "3–4-qadam: /start va ism, keyin <b>Ctrl+C</b> va qayta ishga tushirish; isbot — javob matni",
    "Uchinchi: botni yoqing, start bosing, ismingizni yozing. To'rtinchi: Ctrl C bilan to'xtating, yana yoqing, start bosing. Isbot maydoniga botning javobini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin botingiz ismingizni bazada saqlaydi va qayta ishga tushgandan keyin ham uni eslab qoladi."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "telegram_id INTEGER — ERROR: integer out of range",
  "seg": [
   [
    "a",
    "Birinchi buzish: o'quvchi <code>BIGINT</code> o'rniga odatdagi <b><code>INTEGER</code></b> yozadi",
    "Birinchi buzish, sinfda albatta chiqadi. O'quvchi yoki AI telegram id uchun big int emas, odatdagi integer yozadi."
   ],
   [
    "b",
    "Katta raqamli mijoz yozdi — <b><code>integer out of range</code></b>, qator saqlanmadi",
    "Besh milliard bilan boshlanadigan raqamli mijoz yozdi. Natija: integer out of range. Qator saqlanmadi va bot bu mijozga javob bera olmaydi."
   ],
   [
    "c",
    "Kichik raqamli akkaunt bilan sinasa — hammasi ishlaydi, <b>xato keyin chiqadi</b>",
    "Xavfli tomoni: o'quvchining o'z akkaunti eski bo'lsa, raqami kichik va hammasi ishlaydi. Xato boshqa mijoz kelganda chiqadi. Tuzatish: ustun big int."
   ],
   [
    "d",
    "Xulosa: <code>telegram_id</code> — <b>doim <code>BIGINT</code></b>; <code>INTEGER</code> bilan xato yangi mijozda chiqadi",
    "Xulosa: telegram id doim big int. Tuzatilgan jadvalda shu raqam saqlandi, to'qqizinchi ekrandagi jadval aynan shunday."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "node-pg BIGINTni matn qaytaradi: '5123456789' === 5123456789 — false",
  "seg": [
   [
    "a",
    "Ikkinchi tuzoq: bazadan o'qilgan <code>telegram_id</code> <b>son emas, matn</b>",
    "Ikkinchi tuzoq yashirinroq. Bazadan o'qilgan telegram id son emas, matn bo'lib keladi. Node pg big int'ni JavaScript soniga aylantirmaydi."
   ],
   [
    "b",
    "Natija: <code>===</code> bilan solishtirish <b><code>false</code></b> — masalan admin tekshiruvi ishlamaydi",
    "Natija: uch tenglik bilan ctx chat id ga solishtirsangiz, false. Masalan, admin raqamini shunday tekshirsa, bot adminni tanimaydi va xato chiqmaydi."
   ],
   [
    "c",
    "O'quvchi reposida entity'da <code>telegram_id: string</code> — <b>muallif buni bilgan</b>",
    "O'quvchi reposida entity'da telegram id string deb yozilgan, servisda esa raqam string'ga aylantirib qidiriladi. Bu to'g'ri qaror: TypeORM ham big int'ni matn qaytaradi."
   ],
   [
    "d",
    "Xulosa: bazadagi <code>telegram_id</code> — matn; solishtirishdan oldin <b><code>Number()</code></b> yoki <b><code>String()</code></b>",
    "Xulosa: bazadan kelgan telegram id matn. Solishtirishdan oldin ikkalasini bir turga keltiring: Number yoki String. Tuzatilganda natija true."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "Ikkinchi /start'da yana INSERT — duplicate key value violates unique constraint",
  "seg": [
   [
    "a",
    "Uchinchi buzish: /start har safar INSERT qiladi, <b>SELECT yo'q</b>",
    "Uchinchi buzish: o'quvchi start handler'ida faqat insert yozadi, avval select qilmaydi. Birinchi start ishlaydi."
   ],
   [
    "b",
    "Ikkinchi /start — <code>duplicate key … already exists</code>: <b>UNIQUE uni to'xtatdi</b>",
    "Ikkinchi start'da baza rad etadi: duplicate key, already exists. To'qqizinchi ekrandagi unique aynan shu yerda ishladi: bitta mijozga ikkita qator bo'lmaydi."
   ],
   [
    "c",
    "Xabar <b><code>DETAIL</code></b> qatorida: qaysi ustun va qaysi raqam takrorlandi",
    "Xabarni o'qing: detail qatorida qaysi ustun va qaysi raqam takrorlangani yozilgan. Telegram id, besh milliard bir yuz yigirma uch million. Demak, kodda select yo'q."
   ],
   [
    "d",
    "Xulosa: tuzatish — <b>avval SELECT</b>, qator topilsa INSERT qilinmaydi",
    "Xulosa: tuzatish o'ninchi ekrandagi oqim: avval select, topilsa insert qilinmaydi. Tuzatilgan bot ikkinchi start'ga yana salom deydi."
   ]
  ]
 },
 "16": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4 — qaysi satr xato?",
  "title": "Yangi mijoz yozdi — ERROR: integer out of range",
  "q": "Buzishlarni ko'rdingiz, endi o'zingiz toping. Uchinchi tekshiruv. Yangi mijoz yozdi va baza integer out of range dedi. Sabab bo'lgan satrni bosing.",
  "ok": "To'g'ri, uchinchi satr. Integer o'ttiz ikki bit, Telegram raqami esa undan katta bo'lishi mumkin. Big int bo'lsa saqlanadi, tuzatilgan jadval ekranda ko'rinib turibdi. Demak, Telegram raqami saqlanadigan ustun doim big int bo'ladi.",
  "okShort": "3-satr: <code>INTEGER</code> — 32 bit. To'g'risi <code>BIGINT</code>.",
  "hint": "Xabar raqam turidan: qaysi satr raqamni saqlaydi?",
  "task": "Qoida: Telegram raqami 32 bitdan katta bo'lishi mumkin. Bu jadvalda yangi mijozning raqami saqlanmadi: <code>integer out of range</code>. <b>Shu xatoga sabab bo'lgan satrni bosing.</b>"
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "INTEGER va takror INSERT — xabarlarni o'z bazangizda o'qing",
  "seg": [
   [
    "a",
    "Endi siz: o'z bazangizda <b>ikki xatoni ataylab</b> chiqarasiz va xabarlarni o'qiysiz",
    "Endi o'z bazangizda ikki xatoni ataylab chiqarasiz. O'n daqiqa. Har xabarni o'qing, o'quvchi aynan shularni ko'rsatadi."
   ],
   [
    "b",
    "1–2-qadam: <code>INTEGER</code> jadval va katta raqam — <b><code>integer out of range</code></b>",
    "Birinchi: botdb'da integer ustunli sinov jadvali. Ikkinchi: besh milliard bilan boshlanadigan raqamni qo'shing va xabarni o'qing."
   ],
   [
    "c",
    "3–4-qadam: <code>users</code> ga <b>takror INSERT</b>, keyin sinov jadvalini o'chirish; isbot — xabar",
    "Uchinchi: users jadvalingizga o'z raqamingizni yana bir marta insert qiling, duplicate key chiqadi. To'rtinchi: sinov jadvalini o'chiring. Isbot maydoniga ikkinchi qadamdagi xatoni yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz integer out of range va duplicate key xabarlarini o'z bazangizda ko'rgan bo'lasiz va o'quvchida chiqqanda darhol taniysiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi reposi",
  "title": "TelegramBotNest: entity, topOrYarat va state — xuddi shu oqim, TypeORM bilan",
  "seg": [
   [
    "a",
    "O'quvchi amaliyoti TelegramBotNest reposida: AI shu kodni yozadi, tayyor yechim <b><code>dars-04-done</code></b>",
    "O'quvchi amaliyoti TelegramBotNest reposida. O'quvchi AI'ga prompt beradi, tayyor yechim esa dars to'rt done tegida. Shu kodni ochamiz."
   ],
   [
    "b",
    "Entity: <code>telegram_id</code> — <b><code>bigint</code></b>, <code>unique</code>; <code>state</code> — default <code>'yangi'</code>",
    "Entity'da telegram id big int va unique, ism bo'sh bo'lishi mumkin, state boshida yangi. Jadvalni TypeORM o'zi yaratadi, synchronize yoqilgan."
   ],
   [
    "c",
    "<b><code>topOrYarat</code></b> — SELECT va kerak bo'lsa INSERT; handler state'ga qarab javob beradi",
    "Top yoki yarat: avval qidiradi, topilmasa qator qo'shadi. Handler esa state'ga qaraydi: ism kutilmoqda bo'lsa, matnni ism qiladi. O'ninchi ekrandagi oqimning o'zi."
   ],
   [
    "d",
    "Xulosa: shu kodni <b>haqiqiy PostgreSQL</b> bilan yurgizdik — qayta ishga tushgach «Yana salom»",
    "Xulosa: shu repo kodini haqiqiy PostgreSQL bilan yurgizdik. Qayta ishga tushgandan keyin yana salom, Aziza. Ikki mijoz alohida qoldi."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi reposi",
  "title": "«Server ishlayapti», lekin «Telegram ulanmadi: 401» — bot javob bermaydi",
  "seg": [
   [
    "a",
    "Sinfda eng ko'p chiqadigan vaziyat: o'quvchi <b>«bot javob bermayapti»</b> deydi",
    "Repo kodini ko'rdik, endi sinfda eng ko'p chiqadigan vaziyat. O'quvchi bot javob bermayapti deydi. Terminalda server ishlayapti yozuvi turibdi."
   ],
   [
    "b",
    "Ikki satrni o'qing: server ishlaydi, Telegram esa <b><code>401: Unauthorized</code></b>",
    "Ikki satrni birga o'qing. Server uch ming portda ishlayapti, lekin Telegram ulanmadi, to'rt yuz bir. Token noto'g'ri: server ishlaydi, bot esa javob bermaydi. Biz soxta token bilan sinadik."
   ],
   [
    "c",
    "<code>.env</code> yo'q bo'lsa server umuman yonmaydi: <b><code>DATABASE_URL topilmadi</code></b>",
    "Env fayli yo'q bo'lsa, server umuman yonmaydi: database url topilmadi. Bu xabarni repo muallifi o'zi yozgan, nima qilishni ham aytadi."
   ],
   [
    "d",
    "Xulosa: «bot javob bermaydi» bo'lsa — avval <b>«Telegram bot ulandi»</b> satri bormi, qarang",
    "Xulosa: bot javob bermasa, terminalda Telegram bot ulandi satrini qidiring. Yo'q bo'lsa, uning o'rnidagi xato sababni aytadi. Repo README'sida xatolar jadvali ham bor."
   ]
  ]
 },
 "20": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "dars-04-done ni o'z kompyuteringizda: lokal baza, o'z tokeningiz",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi yechimini <b>o'z kompyuteringizda</b> ishga tushirasiz",
    "Oxirgi amaliyot: o'quvchi yechimini o'z kompyuteringizda ishga tushirasiz. Neon o'rniga lokal PostgreSQL. O'n besh daqiqa."
   ],
   [
    "b",
    "1–2-qadam: clone, <code>dars-04-done</code>, <code>npm ci</code>; <code>.env</code> — <b>token va lokal baza</b>",
    "Birinchi: clone, dars to'rt done, npm ci. Ikkinchi: env fayli: o'z tokeningiz va lokal bazaning manzili. Bazani avval yarating."
   ],
   [
    "c",
    "3–4-qadam: /start, ism, qayta ishga tushirish; isbot — reponing <b><code>holat</code> ustuni</b>",
    "Uchinchi: npm run start, Telegram'da start va ismingiz. To'rtinchi: qayta ishga tushiring, yana start. Isbot maydoniga PostgreSQL terminalidagi holat ustuni qiymatini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin o'quvchi yechimi sizning kompyuteringizda ishlaydi va siz uning state'ini bazadan o'qiy olasiz."
   ]
  ]
 },
 "21": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "Terminal: «Server 3000-portda ishlayapti» va «Telegram ulanmadi: 401: Unauthorized». Sabab?",
  "q": "Repo xatolarini ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Server ishlayapti, lekin Telegram ulanmadi, to'rt yuz bir. Sabab nima? Variantni tanlang.",
  "ok": "To'g'ri, token. To'rt yuz bir, ruxsat yo'q: Telegram tokenni tanimadi. Server va baza ishlayapti, shuning uchun server ishlayapti yozuvi bor. Tokenni BotFather'dan qayta nusxalang. Demak, server ishga tushgan, lekin bot javob bermasa, birinchi navbatda tokenni tekshiring.",
  "okShort": "401 — token noto'g'ri; server va baza ishlayapti.",
  "hint": "401 — kim kimni tanimadi?",
  "correct": 3,
  "opts": [
   "PostgreSQL ishlamayapti",
   "Port 3000 band",
   "users jadvali yo'q",
   "BOT_TOKEN noto'g'ri"
  ],
  "wrong": {
   "0": "Baza ishlamasa server yonmaydi.",
   "1": "Port band bo'lsa «Server ishlayapti» chiqmaydi.",
   "2": "TypeORM jadvalni o'zi yaratadi (synchronize)."
  }
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m5-04 · «Bot eslab qoladi»",
  "title": "m5-04: AvtoPizza, ikki quti va users jadvali",
  "seg": [
   [
    "a",
    "m5-04 — 21 ekran: <b>AvtoPizza bot</b>, ikki quti va <code>users</code> jadvali",
    "Endi o'quvchi darsi, m5-04, yigirma bir ekran. AvtoPizza bot, Aziza va Jasur, dastur xotirasi va PostgreSQL qutilari, users jadvali."
   ],
   [
    "b",
    "O'quvchi amaliyoti Neon'da: <code>DATABASE_URL</code> oxiridagi <b><code>sslmode=require</code></b> o'chirilmasligi kerak",
    "O'quvchi amaliyoti Neon'da, internetdagi bepul bazada. Ulanish manzili oxiridagi sslmode require qolishi kerak, repo kodi shunga qarab ssl yoqadi. Neon'ni biz sinamadik."
   ],
   [
    "c",
    "AI kod yozadi: <code>telegram_id</code> turi va <b>SELECT borligini</b> o'quvchi bilan birga tekshiring",
    "Kodni AI yozadi. Siz ikki narsani o'quvchi bilan birga tekshiring: telegram id big int'mi va start'da avval qidirish bormi. Sinfdagi xatolarning ko'pi shu ikkisidan."
   ],
   [
    "d",
    "Xulosa: vaqt — ikki mijoz va qayta ishga tushirishni <b>sinfda jonli</b> ko'rsating",
    "Xulosa: vaqt, taklif: ikki mijoz va qayta ishga tushirishni sinfda jonli ko'rsating, ikki telefon yoki ikki akkaunt bilan. O'quvchi aralashishni o'z ko'zi bilan ko'rsin."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfda",
  "title": "State, sessiya, stateful bot — va olti vaziyat",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi so'zlar: state, sessiya, stateful bot — siz <b>inglizchasini birga</b> aytasiz",
    "Xaritani ko'rdingiz. Endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz: state, sessiya va stateful bot. O'quvchi shu so'zni aytganda, siz inglizchasini ham ayting: state va stateful."
   ],
   [
    "b",
    "Uch state xabarsiz yoki xabar bilan: <b>unutish, aralashish</b>, <code>integer out of range</code>",
    "Endi sinfda uchraydigan olti state'ni ko'ramiz. Birinchi ikkisida xato xabari chiqmaydi: bot ismni unutadi yoki ikki mijozning buyurtmasi aralashadi. Uchinchisida baza integer out of range xatosini beradi."
   ],
   [
    "c",
    "Qolgan uchtasi <b>xabardan taniladi</b>: <code>duplicate key</code>, <code>401</code>, <code>DATABASE_URL topilmadi</code>",
    "To'rtinchi vaziyat: duplicate key xatosi, sababi kodda select yo'q. Beshinchi vaziyat: to'rt yuz bir, ya'ni token noto'g'ri. Oltinchi vaziyat: database url topilmadi, bunda env fayli yo'q yoki o'qilmagan."
   ],
   [
    "d",
    "Xulosa: xato chiqmasa — state <b>qayerda saqlanayotganiga</b> qarang",
    "Xulosa va usul: xato chiqmagan state'lar eng qiyin. O'quvchi bilan birga state qayerda saqlanayotganiga qarang: obyektdami, bazadami. Pastda savollarga tayyor javoblar."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "State'siz bot «Pepperoni» ni nega tushunmadi?",
    "o": [
     "oldingi xabarni bilmaydi",
     "internet sekin",
     "token xato",
     "Telegram aralashtirdi"
    ],
    "c": 0,
    "e": "Har xabar alohida keladi.",
    "s": 2
   },
   {
    "q": "Obyektdagi state bot qayta ishga tushgach?",
    "o": [
     "saqlanadi",
     "yo'qoladi",
     "bazaga o'tadi",
     "ikki baravar bo'ladi"
    ],
    "c": 1,
    "e": "RAM — jarayon bilan birga.",
    "s": 4
   },
   {
    "q": "Umumiy tanlov bilan Aziza nima oladi?",
    "o": [
     "o'z buyurtmasini",
     "xato",
     "Jasurning pitsasini",
     "javob yo'q"
    ],
    "c": 2,
    "e": "Ustiga yozildi, xatosiz.",
    "s": 6
   },
   {
    "q": "State qaysi kalit bilan ajratiladi?",
    "o": [
     "ism",
     "vaqt",
     "token",
     "chat.id"
    ],
    "c": 3,
    "e": "Raqam takrorlanmaydi.",
    "s": 7
   },
   {
    "q": "Har xabarda birinchi SQL?",
    "o": [
     "SELECT",
     "INSERT",
     "UPDATE",
     "DELETE"
    ],
    "c": 0,
    "e": "Avval state'ni o'qish.",
    "s": 10
   },
   {
    "q": "telegram_id INTEGER — katta raqamda?",
    "o": [
     "saqlanadi",
     "integer out of range",
     "matn bo'ladi",
     "duplicate key"
    ],
    "c": 1,
    "e": "Telegram id 32 bitdan katta bo'lishi mumkin.",
    "s": 13
   },
   {
    "q": "node-pg'dan kelgan telegram_id turi?",
    "o": [
     "number",
     "boolean",
     "string (matn)",
     "object"
    ],
    "c": 2,
    "e": "=== bilan solishtirish false.",
    "s": 14
   },
   {
    "q": "«Server ishlayapti», «Telegram ulanmadi: 401» — sabab?",
    "o": [
     "baza",
     "port",
     "jadval",
     "token"
    ],
    "c": 3,
    "e": "401 — token tanilmadi.",
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
