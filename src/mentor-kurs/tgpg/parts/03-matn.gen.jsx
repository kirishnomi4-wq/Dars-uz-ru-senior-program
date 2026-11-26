
// ============================================================
//  TgPg MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/tgpg-matn.py (manba: 17-TgPg-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Telegraf + PostgreSQL",
  "title": "Tayyor buyurtma boti bor. Uni AI bilan PostgreSQL'ga ko'chiramiz — bosqichma-bosqich va har qadamni tekshirib",
  "seg": [
   [
    "a",
    "Telegraf bilan bot yozishni bilasiz — bugun <b>bot ma'lumotini PostgreSQL'da saqlaymiz</b>",
    "Assalomu alaykum. Telegraf bilan bot yozishni, buyruq va inline tugmalarni videodarslarda ko'rgansiz. Bugun keyingi qadam: bot ma'lumotini PostgreSQL'da saqlaymiz. Shunda server qayta ishga tushsa ham savat, buyurtma va telefon raqami yo'qolmaydi."
   ],
   [
    "b",
    "Loyiha tayyor: <b>katalog, savat, buyurtma va admin</b> — Nest va Telegraf'da",
    "Loyiha noldan yozilmaydi. GitHub'da tayyor buyurtma boti bor: katalog, savat, buyurtma va admin paneli, NestJS va Telegraf'da. U to'liq ishlaydi, faqat hamma ma'lumot xotirada turadi. Siz uni clone qilib, kamchiligini o'z ko'zingiz bilan ko'rasiz."
   ],
   [
    "c",
    "Kodni AI yozadi, siz <b>bosqichlab boshqarasiz va har bosqichni tekshirasiz</b>",
    "Kodni AI yozadi: Antigravity, Claude Code, Codex yoki Copilot, qaysi biri bo'lsa ham. Sizning ishingiz boshqarish: ishni to'rt bosqichga bo'lasiz, har biriga prompt yozasiz va natijani o'zingiz tekshirasiz. Biz buni ikki xil AI bilan haqiqatan qilib ko'rdik, ekrandagi javoblar o'sha yurgizishlardan."
   ],
   [
    "d",
    "Olti bosqich, to'rt amaliyot; oxirida <b>ikki ekran sinfga tayyorgarlik</b>. Shoshilmang",
    "Dars olti bosqichdan iborat, to'rtta amaliyotda AI bilan o'zingiz ishlaysiz. Oxirgi ikki ekran sinfga tayyorgarlik: o'quvchi darsi xaritasi va o'quvchilar xato qiladigan joylar. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · loyiha va muammo",
  "title": "Loyiha besh moduldan iborat: telegram, catalog, user, cart va order",
  "seg": [
   [
    "a",
    "Bot buyruqlari bitta faylda: <b><code>telegram.service.ts</code> — siz bilgan Telegraf handler'lari</b>",
    "Loyihani Explorer'da ochamiz. Bot buyruqlari bitta faylda: telegram service. Ichida siz bilgan Telegraf handler'lari turadi: bot start, bot command catalog va bot action. Tugmalar keyboards faylida, bot matnlari texts faylida."
   ],
   [
    "b",
    "Logika to'rt Service'da: <b>katalog, foydalanuvchi, savat va buyurtma</b> — har biri o'z modulida",
    "Handler'lar logikani o'zi yozmaydi, Service'ga beradi. Loyihada to'rtta Service bor: catalog mahsulotlar va omborni boshqaradi, user foydalanuvchi va uning state'ini, cart savatni, order buyurtmani. Har biri o'z modulida, Nest ularni telegram service'ga inject qiladi."
   ],
   [
    "c",
    "Mijoz yo'li: <b>katalog → savat → telefon → buyurtma</b>, keyin admin tasdiqlaydi",
    "Mijoz yo'lini ko'ramiz. Aziza katalogni ochadi, mahsulotlar ikkitadan sahifada. Tugmani bosib savatga qo'shadi, buyurtma beradi, bot telefon so'raydi. Raqam kelgach buyurtma yaratiladi va adminga xabar ketadi. Admin Jasur buyurtmani tasdiqlaydi, Azizaga xabar boradi."
   ],
   [
    "d",
    "Xulosa: bot to'liq ishlaydi, lekin <b>hamma ma'lumot <code>Map</code> va massivda</b> turibdi",
    "Xulosa: bot to'liq ishlaydi, admin roli ham bor. Lekin Service'larni ochsangiz, foydalanuvchilar Map'da, savatlar Map'da, buyurtmalar oddiy massivda turibdi. Bu ma'lumot qayerda yashashini keyingi ekranda ko'ramiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · ichida",
  "title": "Map Node jarayonining xotirasida yashaydi: jarayon to'xtasa — u ham yo'qoladi",
  "seg": [
   [
    "a",
    "1-jarayonda hammasi bor: <b>buyurtma #1, savatda Sichqoncha, Azizaning telefoni</b>",
    "Birinchi jarayonda bot ishlayapti. Aziza buyurtma berdi, raqami bir, jami ikki yuz yigirma ming so'm. Admin uni tasdiqladi. Keyin Aziza savatga yana Sichqoncha qo'shdi. Telefoni ham botda saqlangan."
   ],
   [
    "b",
    "Server qayta ishga tushdi: <b>savat bo'sh, buyurtma yo'q</b>, telefon yana so'raladi",
    "Endi serverni to'xtatib, qayta ishga tushiramiz. Aziza savatni ochadi: savat bo'sh. Admin buyurtmalarni ko'radi: hozircha buyurtma yo'q. Telefon raqami ham yo'qoldi, keyingi buyurtmada bot uni yana so'raydi. Xato xabari chiqmadi, ma'lumot shunchaki yo'q."
   ],
   [
    "c",
    "Sabab: <code>Map</code> — <b>jarayon xotirasidagi obyekt</b>; jarayon bilan birga tug'iladi va o'ladi",
    "Sababi oddiy. Map Node jarayonining operativ xotirasidagi obyekt. Jarayon ishga tushganda u bo'sh yaratiladi, jarayon to'xtaganda xotira bo'shaydi. Hosting serverni har deploy'da qayta ishga tushiradi, ya'ni haqiqiy botda bu kuniga bir necha marta bo'ladi."
   ],
   [
    "d",
    "Xulosa: <b>saqlanishi kerak bo'lgan har narsa bazaga</b> — beshta ma'lumot ro'yxati",
    "Xulosa: restartdan keyin qolishi kerak bo'lgan har narsa bazada turishi kerak. Botda bunday ma'lumot beshta: mahsulot va ombor, foydalanuvchi va uning roli, telefon va state, savat, buyurtma. Bugun shu beshtasini PostgreSQL'ga ko'chiramiz."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 5",
  "title": "Katalog kodda yozilgan massiv, ombordagi son ham shu massivda. Restartdan keyin Kolonka qoldig'i nechta bo'ladi?",
  "q": "Xotirani ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Katalog kodda yozilgan massiv, ombordagi son ham shu massivda turadi. Aziza ikkita Kolonka oldi, qoldiq sakkiz bo'ldi. Server qayta ishga tushsa, Kolonka qoldig'i nechta bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Massiv kodda yozilgan, jarayon ishga tushganda u yana koddagi qiymat bilan yaratiladi: o'n. Ya'ni restart buyurtmani o'chirdi va omborni ham o'n ga qaytardi. Ikkalasi bir-biriga mos, faqat noto'g'ri. Demak, xotiradagi ma'lumot har restartda kod yozilgan boshlang'ich qiymatiga qaytadi.",
  "okShort": "Massiv koddan qayta yaratiladi — <code>stock: 10</code>. Buyurtma yo'qoldi, ombor ham qaytdi.",
  "hint": "Massiv qayerda yozilgan — kodda yoki bazada? Jarayon ishga tushganda kod massivga qaysi qiymatni beradi?",
  "demak": "Xotiradagi ma'lumot har restartda koddagi boshlang'ich qiymatga qaytadi.",
  "correct": 1,
  "opts": [
   "8 — server oxirgi qiymatni eslab qoladi",
   "10 — massiv koddan qaytadan yaratiladi",
   "0 — RAM bo'shaydi, massiv ham bo'sh qoladi",
   "Server xato beradi — ombor sinxron emas"
  ],
  "wrong": {
   "0": "Eslab qolish uchun disk kerak; Map va massiv faqat RAM'da.",
   "2": "Xotira bo'shaydi, lekin massiv kodda yozilgan — u qayta yaratiladi.",
   "3": "Restart xato emas: server odatdagidek ko'tariladi."
  }
 },
 "5": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 4",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "Loyihani o'z kompyuteringizda ishga tushiring va restartda nima yo'qolishini ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: loyihani clone qilasiz, <b>o'z botingiz tokeni bilan</b> ishga tushirasiz",
    "Endi navbat sizga. Loyihani clone qilasiz va o'z botingiz bilan ishga tushirasiz. Token uchun BotFather'da yangi sinov boti oching, videodarsdagi kabi. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: clone, <code>tgpg-start</code> tegi, <code>npm install</code>, <code>.env</code> — <b>token va o'z id'ingiz</b>",
    "Birinchi qadamda reponi clone qilib, tgpg start tegiga o'tasiz va npm install qilasiz. Ikkinchisida env example'dan env fayl yasaysiz: bot token va admin uchun o'z Telegram id'ingiz. Id'ni userinfobot'dan olasiz."
   ],
   [
    "c",
    "3–4-qadam: bot oqimi, keyin restart; isbot — <b>restartdan keyin <code>/cart</code> javobi</b>",
    "Uchinchi qadamda Telegram'da start, catalog, ikki mahsulot va buyurtmani sinaysiz, admin sifatida orders'ni ko'rasiz. To'rtinchisida savatga mahsulot qo'shib, serverni Ctrl C bilan to'xtatib qayta yoqasiz. Isbot maydoniga cart buyrug'iga kelgan javobni yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin loyiha kompyuteringizda ishlaydi va qaysi ma'lumot restartda yo'qolishini o'zingiz ko'rgansiz."
   ]
  ],
  "steps": [
   {
    "t": "Clone",
    "cmds": [
     "git clone https://github.com/Azizbekcrypto/OrderBotNest.git",
     "cd OrderBotNest",
     "git checkout tgpg-start",
     "npm install"
    ],
    "exp": "added … packages"
   },
   {
    "t": ".env — BOT_TOKEN (BotFather) va ADMIN_TELEGRAM_IDS (@userinfobot) yozing, keyin ishga tushiring",
    "cmds": [
     "cp .env.example .env",
     "npm run start:dev"
    ],
    "exp": "Server 3000-portda ishlayapti · Telegram bot ulandi"
   },
   {
    "t": "Bot oqimi — Telegram'da: /start → /catalog → ▶ → mahsulot → /cart → «✅ Buyurtma berish» → telefon → /orders",
    "cmds": [
     "/start",
     "/catalog",
     "/orders"
    ],
    "exp": "«Buyurtma #1 qabul qilindi!» · admin tugmalari"
   },
   {
    "t": "Restart — savatga mahsulot qo'shing, serverni to'xtatib qayta yoqing, Telegram'da /cart va /orders",
    "cmds": [
     "Ctrl+C",
     "npm run start:dev",
     "npm run smoke -- restart"
    ],
    "exp": "«Savat bo'sh…» · «Hozircha buyurtma yo'q.» · NATIJA: 0/3"
   }
  ],
  "proof": {
   "label": "Restartdan keyin /cart ga kelgan javob",
   "placeholder": "bot javobini nusxalang",
   "re": "savat\\s+bo.?sh",
   "flags": "i",
   "wrong": "Restartdan keyin savat ochilganmi? Server Ctrl+C bilan to'xtab, qayta yoqilganini tekshiring."
  },
  "trouble": [
   [
    "BOT_TOKEN topilmadi",
    ".env yo'q yoki bo'sh — cp .env.example .env, token yozing"
   ],
   [
    "Server … ishlayapti va Telegram ulanmadi: 401: Unauthorized",
    "token noto'g'ri; server ishlaydi, bot javob bermaydi — BotFather'dan qayta oling"
   ],
   [
    "409: Conflict: terminated by other getUpdates request",
    "shu token bilan ikkinchi nusxa ishlayapti — eski terminalni to'xtating (⚠ Telegram hujjatidan, sinalmagan — haqiqiy token kerak)"
   ],
   [
    "/orders → «faqat admin uchun»",
    "ADMIN_TELEGRAM_IDS da boshqa id — @userinfobot'dagi raqamni yozing"
   ],
   [
    "EADDRINUSE :::3000",
    "port band — eski server; Ctrl+C yoki .env da PORT=3001"
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · reja va prompt",
  "title": "Beshta ma'lumot — to'rt bosqich: har bosqichdan keyin tekshiruv va commit",
  "seg": [
   [
    "a",
    "Ishni <b>to'rt bosqichga</b> bo'lamiz: ulanish va katalog, foydalanuvchi, savat, buyurtma",
    "Beshta ma'lumotni bir yo'la ko'chirmaymiz. Ishni to'rt bosqichga bo'lamiz: avval bazaga ulanish va katalog, keyin foydalanuvchi va uning state'i, keyin savat, oxirida buyurtma va tranzaksiya. Tartib bog'liqlikka qarab: savat foydalanuvchi va mahsulotga, buyurtma hammasiga tayanadi."
   ],
   [
    "b",
    "Har bosqichdan keyin: <b>build, restart, psql — keyin commit</b>",
    "Har bosqichdan keyin to'xtaymiz va tekshiramiz: loyiha build bo'ladimi, restartdan keyin nima qoladi, PostgreSQL terminalida jadval qanday. Hammasi to'g'ri bo'lsa, commit qilamiz. Keyingi bosqich xato qilsa, oxirgi ishlagan joyga qaytish oson bo'ladi."
   ],
   [
    "c",
    "Bir gapli promptda AI <b>1145 qatorni bir yo'la</b> o'zgartirdi — buni ko'rib chiqib bo'lmaydi",
    "Nega bosqichlab? Biz sinab ko'rdik. AI'ga bir gapli prompt berdik: katalogni PostgreSQL'ga ko'chir. U faqat katalogni emas, hammasini ko'chirdi: yigirma ikki fayl, ming bir yuz qirq besh yangi qator. Kod ishladi, lekin bunday o'zgarishni mentor o'qib chiqa olmaydi, xato bo'lsa qayerdaligini topa olmaydi."
   ],
   [
    "d",
    "Xulosa: <b>bitta prompt — bitta bosqich</b>, natijani tekshirmaguncha keyingisiga o'tmaymiz",
    "Xulosa: bitta prompt, bitta bosqich. Bosqich kichik bo'lsa, AI javobini o'qiysiz, diffni ko'rasiz va xatoni darhol topasiz. Tekshirmaguncha keyingi promptni yozmang. Endi promptning o'zini qanday yozishni ko'ramiz."
   ]
  ]
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · reja va prompt",
  "title": "Yaxshi prompt beshta qismdan iborat: kontekst, maqsad, shartlar, chegara va javob",
  "seg": [
   [
    "a",
    "Birinchi qism — <b>kontekst</b>: loyiha nima va hozir qanday ishlaydi",
    "Promptning birinchi qismi kontekst: loyiha nima va hozir qanday ishlaydi. AI loyihani o'qiy oladi, lekin sizning maqsadingizni bilmaydi. Shuning uchun bitta gap yetadi: bu NestJS va Telegraf'dagi buyurtma boti, hamma ma'lumot xotirada, bosqichma-bosqich PostgreSQL'ga ko'chiramiz."
   ],
   [
    "b",
    "Ikkinchi va uchinchi qism — <b>bitta bosqich maqsadi va qat'iy shartlar</b>",
    "Ikkinchi qism maqsad: faqat shu bosqich, bizda ulanish va katalog. Uchinchisi qat'iy shartlar: manzil env'dan o'qilsin, synchronize ishlatilmasin, jadval migratsiya bilan yaratilsin, stock manfiy bo'lmasin, seed ikkinchi marta takror qo'shmasin. Har shart keyin tekshiriladigan narsa."
   ],
   [
    "c",
    "To'rtinchi va beshinchi qism — <b>nimaga tegmaslik va javobda nima bo'lishi</b>",
    "To'rtinchi qism chegara: user, savat va buyurtma servislariga hali tegma. Beshinchisi javob: qaysi fayllar o'zgardi, qanday ishga tushirish va PostgreSQL terminalida nimani tekshirish. Shu qism AI'ni o'z ishini tushuntirishga majburlaydi, siz esa tekshirish ro'yxatini tayyor olasiz."
   ],
   [
    "d",
    "Xulosa: har shart — <b>keyin tekshiriladigan bitta band</b>; tekshirib bo'lmaydigan shart yozilmaydi",
    "Xulosa: prompt beshta qismdan iborat. Har shartni keyin tekshirish mumkin bo'lsin: stock manfiy bo'lmasin degan shartni PostgreSQL terminalida minus bir yozib tekshirasiz. Chiroyli qilib yoz degan shartni tekshirib bo'lmaydi, uni yozmang."
   ]
  ]
 },
 "8": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 5",
  "title": "Ikki AI'ga bir xil vazifa berildi. Qaysi natijani ko'rib chiqib, commit qilish mumkin?",
  "q": "Prompt qolipini ko'rdingiz, endi tekshirib olaylik. Ikkinchi tekshiruv. Ikki AI'ga bir xil vazifa berildi: katalogni bazaga ko'chirish. Ekranda ikkala prompt, o'zgarish hajmi va AI javobidan parcha. Qaysi natijani ko'rib chiqib, commit qilish mumkin? Variantni tanlang.",
  "ok": "To'g'ri. B faqat katalogni ko'chirdi va boshqa servislarga nega tekkanini o'zi aytdi: async bo'lgani uchun await kerak edi. Bu asosli va tekshirish oson. A ham ishladi, lekin so'ralmagan to'rt bosqichni bir yo'la qildi va buni aytmadi. Demak, commit qilinadigan natija hajmi siz so'ragan bosqichga teng bo'ladi.",
  "okShort": "B — so'ralgan bosqich, chetga chiqish aytilgan. A — 1145 qator, so'ralmagan ish, aytilmagan.",
  "hint": "Qaysi AI faqat so'ralgan ishni qildi? Qaysi biri qayerda chetga chiqqanini aytdi?",
  "demak": "Commit qilinadigan o'zgarish hajmi siz so'ragan bosqichga teng bo'ladi.",
  "correct": 2,
  "opts": [
   "A — hammasini bir yo'la qilgan, vaqt tejaldi",
   "Ikkalasi bir xil — ikkalasi ham ishlaydi",
   "B — faqat so'ralgan bosqich, chetini aytgan",
   "Hech biri — AI kodini commit qilib bo'lmaydi"
  ],
  "wrong": {
   "0": "Ko'p ish — ko'p ko'rib chiqish: 1145 qatorda xatoni topish qiyin.",
   "1": "Ishlashi yetmaydi: siz har qatorga javob berasiz.",
   "3": "Commit qilinadi — o'qib, tekshirib bo'lgandan keyin."
  }
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · ulanish va katalog · ichida",
  "title": "Entity jadvalni tasvirlaydi, migratsiya uni yaratadi, migrations jadvali nima yurganini eslaydi",
  "seg": [
   [
    "a",
    "Entity — <b>jadvalning kod ko'rinishi</b>: klass, ustunlar decorator bilan",
    "Birinchi bosqich ichida nima bo'lishini ko'ramiz. TypeORM'da jadval entity klassi bilan tasvirlanadi: Entity decorator jadval nomini, Column decorator har ustunni beradi. Siz bilgan Mongoose'da bu schema edi."
   ],
   [
    "b",
    "Migratsiya — <b>jadvalni yaratadigan SQL fayli</b>; <code>synchronize</code> o'chiq",
    "Jadvalni entity emas, migratsiya yaratadi. Migratsiya oddiy SQL fayli: up metodida create table, down metodida drop table. Synchronize false, ya'ni TypeORM jadvalni o'zi o'zgartirmaydi. Mongoose'da migratsiya yo'q edi, chunki kolleksiyada ustun qoidasi yo'q. PostgreSQL'da qoida bor, uni fayl bilan o'zgartiramiz."
   ],
   [
    "c",
    "<code>migrations</code> jadvali — <b>qaysi fayl yurganini eslaydi</b>; server ko'tarilganda yurmagani o'zi yuradi",
    "Migratsiya yurgach, TypeORM migrations jadvaliga bitta qator yozadi: fayl nomi va vaqti. Server har ko'tarilganda shu jadvalga qaraydi va faqat yurmagan migratsiyani yurgizadi, bu migrations run true sozlamasi. Ikkinchi ishga tushirishda hech narsa takrorlanmaydi."
   ],
   [
    "d",
    "Xulosa: jadvalni o'zgartirish — <b>yangi migratsiya fayli</b>, eskisi tahrirlanmaydi",
    "Xulosa: entity jadvalni kodda tasvirlaydi, migratsiya uni bazada yaratadi, migrations jadvali qaysi fayl yurganini eslaydi. Keyin ustun qo'shmoqchi bo'lsangiz, yangi migratsiya yozasiz. Yurgan migratsiyani tahrirlash foyda bermaydi: baza uni qayta yurgizmaydi."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · ulanish va katalog",
  "title": "AI javobini uch qismga ajrating: nima o'zgardi, qayerda chetga chiqdi, qanday tekshiriladi",
  "seg": [
   [
    "a",
    "Birinchi: <b>o'zgargan fayllar ro'yxatini <code>git diff --stat</code> bilan</b> solishtiring",
    "AI ishini tugatdi va javob yozdi. Uni uch qismga ajratib o'qing. Birinchisi: qaysi fayllar o'zgardi. AI'ning ro'yxatini git diff stat bilan solishtiring. Bu safar ro'yxat mos keldi: entity, migratsiya, seed, config va catalog service."
   ],
   [
    "b",
    "Ikkinchi: <b>«chetga chiqdim» qismini</b> toping va sababini baholang",
    "Ikkinchisi: AI qayerda chetga chiqdi. Biz user, savat va buyurtmaga tegma degan edik. AI order va telegram servislarini o'zgartirgan va buni ochiq yozgan: catalog service endi async, chaqiruvlarga await kerak. Sabab asosli. Agar sabab yozilmagan bo'lsa, diffdan o'zingiz qidirasiz."
   ],
   [
    "c",
    "Uchinchi: tekshirish buyruqlarini <b>o'zingiz yurgizing</b> — AI'ning «sinadim» degan gapi isbot emas",
    "Uchinchisi: tekshirish. AI o'zim sinadim deydi, lekin bu isbot emas. Buyruqlarni o'zingiz yurgizing. Seed birinchi marta olti mahsulot qo'shdi, ikkinchi marta nol. Backslash d products'da UNIQUE va CHECK bor. Build toza."
   ],
   [
    "d",
    "Xulosa: o'qing, solishtiring, yurgizing — <b>shundan keyin commit</b>",
    "Xulosa: AI javobi uch qismdan o'qiladi: fayllar, chetga chiqish va tekshiruv. Fayllarni diff bilan solishtirasiz, chetga chiqish sababini baholaysiz, tekshiruvni o'zingiz yurgizasiz. Hammasi to'g'ri bo'lsa, commit qilasiz. Lekin bu bosqichda yana bitta yashirin muammo bor, uni keyingi ekranda ko'ramiz."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · ichida",
  "title": "Katalog bazada, buyurtma xotirada: restartdan keyin buyurtma yo'qoldi, ombor esa kamayib qoldi",
  "seg": [
   [
    "a",
    "1-bosqichdan keyin bot ishlaydi: <b>katalog bazadan, buyurtma esa hali xotirada</b>",
    "Birinchi bosqich tayyor, testlar toza. Endi bot oqimini restart bilan sinaymiz. Aziza buyurtma berdi: bitta klaviatura va ikkita kolonka. Ombor bazada kamaydi. Buyurtmaning o'zi esa hali xotiradagi massivda, chunki uni to'rtinchi bosqichda ko'chiramiz."
   ],
   [
    "b",
    "Restart: <b>buyurtma yo'qoldi, ombor esa 7 va 8 da qoldi</b>",
    "Serverni qayta ishga tushiramiz. Admin buyurtmalarni ochadi: hozircha buyurtma yo'q. PostgreSQL terminalida esa klaviatura yetti, kolonka sakkiz. Ya'ni mahsulot ombordan ketgan, lekin uni kim olgani haqida hech qanday yozuv yo'q. Bu xato xabari bermaydigan, eng yomon turdagi buzilish."
   ],
   [
    "c",
    "Sabab: <b>bir ish ikki joyda yozildi</b> — biri doimiy, biri vaqtinchalik",
    "Sababi: bitta sotuv ikki joyga yozildi. Ombordan ayirish bazaga, buyurtma esa xotiraga. Restart xotirani o'chirdi, bazaga tegmadi. Tekshiruv buni ko'rsatdi, chunki biz faqat build emas, restart bilan butun oqimni sinadik."
   ],
   [
    "d",
    "Xulosa: <b>oraliq bosqichni prodga chiqarmang</b>; har bosqichdan keyin restart bilan sinang",
    "Xulosa: bosqichma-bosqich ko'chirishda oraliq vaziyat bo'ladi, unda ma'lumot ikki joyda yashaydi. Oraliq bosqichni ishlab turgan botga chiqarmang, avval hamma bosqichni tugating. Har bosqichdan keyin restart bilan to'liq oqimni sinang: buni build ham, AI'ning o'z testlari ham ushlamaydi."
   ]
  ]
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 4",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "Ulanish, migratsiya va katalog — o'z AI'ingiz bilan, keyin o'zingiz tekshirasiz",
  "seg": [
   [
    "a",
    "Endi siz: <b>1-promptni o'z AI'ingizga</b> berasiz va natijani tekshirasiz",
    "Endi navbat sizga. Birinchi promptni o'z AI'ingizga berasiz: Antigravity, Claude Code yoki boshqasi. AI javobi bizdagidan boshqacha bo'ladi, bu normal. Tekshiruv bir xil. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: baza, prompt, <b>AI javobini uch qismga ajratib o'qish</b>",
    "Birinchi qadamda PostgreSQL terminalida shop bazasini yaratasiz va env faylga database url yozasiz. Ikkinchisida promptni nusxalab AI'ga berasiz, javobini o'qiysiz: fayllar, chetga chiqish va tekshirish buyruqlari."
   ],
   [
    "c",
    "3–4-qadam: seed ikki marta va <code>\\d products</code>; isbot — <b>ikkinchi seed'dan keyingi mahsulotlar soni</b>",
    "Uchinchi qadamda seed'ni ikki marta yurgizasiz va backslash d products bilan CHECK borligini ko'rasiz. To'rtinchisida stock'ni minus bir qilib ko'rasiz: xato chiqishi kerak. Isbot maydoniga select count'dan chiqqan sonni yozing. Hammasi to'g'ri bo'lsa, commit qiling."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin botingiz katalogni PostgreSQL'dan o'qiydi va siz AI ishini o'zingiz tekshirgan bo'lasiz."
   ]
  ],
  "steps": [
   {
    "t": "Baza — PostgreSQL terminalida yarating, manzilini .env ga yozing",
    "cmds": [
     "psql -U postgres",
     "CREATE DATABASE shop;",
     "DATABASE_URL=postgresql://postgres:<parol>@localhost:5432/shop"
    ],
    "exp": "CREATE DATABASE"
   },
   {
    "t": "Prompt — 1-promptni AI'ga bering, javobni uch qismga ajratib o'qing: fayllar · chetga chiqish · tekshirish",
    "cmds": [
     "git diff --stat"
    ],
    "exp": "ro'yxat diff bilan mos"
   },
   {
    "t": "Seed va jadval",
    "cmds": [
     "npm run seed ×2",
     "psql -U postgres -d shop",
     "\\d products",
     "SELECT * FROM migrations;"
    ],
    "exp": "2-marta 0 qo'shildi · CHECK (stock >= 0) · 1 qator"
   },
   {
    "t": "Qoida va commit",
    "cmds": [
     "UPDATE products SET stock = -1 WHERE id = 1;",
     "SELECT count(*) FROM products;",
     "git add -A && git commit -m \"1-bosqich: katalog\""
    ],
    "exp": "violates check constraint · 6"
   }
  ],
  "proof": {
   "label": "SELECT count(*) FROM products; natijasi",
   "placeholder": "natijadagi sonni yozing",
   "re": "^\\s*6\\s*$",
   "flags": "",
   "wrong": "Seed ikki marta yurdi — takror qo'shmaganmi? 12 chiqsa, seed takrorlanmaslik shartini AI bajarmagan: unga shu haqida yozing."
  },
  "trouble": [
   [
    "count = 12",
    "seed takror qo'shdi — AI'ga: «seed ikkinchi marta yurganda takror qo'shmasin, ON CONFLICT (name) DO NOTHING»"
   ],
   [
    "UPDATE xatosiz o'tdi",
    "CHECK yo'q — \\d products; AI'ga: «stock uchun bazada CHECK (stock >= 0) bo'lsin, yangi migratsiya bilan»"
   ],
   [
    "relation \"products\" does not exist",
    "migratsiya yurmagan — serverni bir marta ishga tushiring yoki npm run migration:run"
   ],
   [
    "Unable to connect to the database. Retrying (1)... va error: database \"shop\" does not exist",
    "1-qadam: CREATE DATABASE shop;"
   ],
   [
    "Unable to connect to the database. Retrying (1)... va error: password authentication failed for user \"postgres\"",
    ".env dagi parol — PostgreSQL-1 da qo'ygan parolingiz"
   ],
   [
    "npm error Missing script: \"seed\"",
    "AI seed'ni boshqa nom bilan yozgan yoki migratsiya ichiga qo'ygan — javobidan qidiring (2-tajribada shunday bo'ldi)"
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · foydalanuvchi, state, savat · ichida",
  "title": "Telegram id INTEGERga sig'maydi — BIGINT kerak; lekin BIGINT kodga matn bo'lib keladi",
  "seg": [
   [
    "a",
    "Azizaning id'si 5 123 456 789 — <b><code>INTEGER</code> chegarasidan katta</b>, shuning uchun <code>BIGINT</code>",
    "Ikkinchi bosqich: foydalanuvchilar. Birinchi tuzoq id'da. Telegram id ikki milliard bir yuz qirq yetti milliondan katta bo'lishi mumkin, bu integer'ning chegarasi. Azizaning id'si besh milliarddan oshadi. Shuning uchun ustun big int bo'ladi. Ikkala AI ham big int tanladi."
   ],
   [
    "b",
    "Lekin node-pg va TypeORM <code>BIGINT</code> ustunini kodga <b>matn qilib qaytaradi</b>: <code>\"5123456789\"</code>",
    "Ikkinchi tuzoq ko'rinmaydi. Big int JavaScript'ning oddiy sonidan katta bo'lishi mumkin, shuning uchun pg kutubxonasi uni matn qilib qaytaradi. TypeORM ham xuddi shunday. Matn bilan son uch tenglik bilan solishtirilsa, false chiqadi. Siz bilgan Mongoose'da bu son edi va true chiqardi."
   ],
   [
    "c",
    "Ikki to'g'ri yo'l: <b>ustun turi <code>string</code></b> yoki <b>transformer bilan <code>number</code></b>",
    "Ikki to'g'ri yo'l bor. Birinchisi: entity'da telegram id'ni string deb yozish va har joyda matn bilan ishlash. Ikkinchisi: transformer bilan bazadan kelganda songa aylantirish. Telegram id ellik ikki bitdan oshmaydi, JavaScript soni uni sig'diradi. Bizdagi tayyor kod birinchi yo'lni, AI ikkinchisini tanladi. Ikkalasi ishlaydi."
   ],
   [
    "d",
    "Xulosa: entity'dagi <b>id turini va solishtirishni</b> diffdan albatta tekshiring",
    "Xulosa: Telegram id uchun big int, va kodda u matnmi yoki sonmi, buni bilib turing. AI kodini ko'rganda ikki joyga qarang: migratsiyada ustun turi big int'mi, entity'da qaysi tur va qayerda uch tenglik bilan solishtirilgan."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "Mijoz tugmani ikki marta tez bosdi: avval qidirib keyin qo'shish ikki qator ochishi mumkin — ON CONFLICT bitta so'rovda hal qiladi",
  "seg": [
   [
    "a",
    "Savatda bitta mahsulot — bitta qator: <b><code>UNIQUE (user_id, product_id)</code></b>",
    "Uchinchi bosqich: savat. Bitta mijozda bitta mahsulot faqat bitta qator bo'ladi, qayta qo'shilsa qty bittaga oshadi. Bu qoidani kod ham, baza ham ushlaydi: cart items jadvalida user id va product id juftligi UNIQUE."
   ],
   [
    "b",
    "Avval qidirib keyin qo'shish — <b>ikki tez bosishda ikkalasi «yo'q» ko'radi</b>",
    "Oddiy yo'l: avval select bilan qidirish, yo'q bo'lsa insert. Lekin mijoz tugmani ikki marta tez bossa, ikki so'rov bir vaqtda qidiradi va ikkalasi ham yo'q deb ko'radi. Biz yigirma marta sinadik: o'n to'qqiz marta savatda ikki qator paydo bo'ldi. UNIQUE bo'lsa, ikkinchisi duplicate key xatosini oladi."
   ],
   [
    "c",
    "<code>ON CONFLICT … DO UPDATE</code> — <b>bitta so'rov</b>: yo'q bo'lsa qo'shadi, bor bo'lsa oshiradi",
    "Yechim bitta so'rov: insert on conflict do update. Qator yo'q bo'lsa qo'shiladi, bor bo'lsa qty bittaga oshadi. Baza buni o'zi navbatga qo'yadi. Siz bilgan Mongoose'da bu upsert edi, lekin u ham unique index bo'lmasa ikki hujjat ochdi. Ikkala AI ham to'g'ri yo'lni tanladi."
   ],
   [
    "d",
    "Xulosa: <b>qidirib qo'shish</b> ko'rsangiz, <code>UNIQUE</code> va <code>ON CONFLICT</code> borligini tekshiring",
    "Xulosa: avval qidirib keyin qo'shish bir mijozda ishlaydi, lekin tez bosishda buziladi. AI kodida shunday joy ko'rsangiz, ikki narsani tekshiring: jadvalda UNIQUE qoidasi bormi va so'rov on conflict bilanmi. Foydalanuvchida ham xuddi shu qoida: start ikki marta bosilsa ham bitta qator."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · foydalanuvchi, state, savat",
  "title": "WAITING_PHONE bazada: bot telefon so'radi, server qayta ishga tushdi — raqam kelganda bot uni taniydi",
  "seg": [
   [
    "a",
    "State — <b>bot mijoz haqida eslab qolgan bosqich</b>: <code>IDLE</code> yoki <code>WAITING_PHONE</code>",
    "State'ni ko'ramiz. State bot foydalanuvchi haqida eslab qolgan ma'lumot: qaysi qadamda turgani. Bizning botda ikkita: IDLE, ya'ni oddiy, va WAITING PHONE, ya'ni telefon kutilmoqda. Mijoz buyurtma berishni bosganda state WAITING PHONE bo'ladi."
   ],
   [
    "b",
    "Restartdan keyin raqam keldi — <b>bot uni telefon deb tanidi</b>, «Tushunmadim» demadi",
    "Bobur buyurtma berishni bosdi, bot telefon so'radi. Shu payt server qayta ishga tushdi. Bobur raqamini yozdi. State bazada bo'lgani uchun bot raqamni telefon deb tanidi va buyurtmani yaratdi. State xotirada bo'lganda bot tushunmadim degan bo'lardi."
   ],
   [
    "c",
    "Ikkinchi va uchinchi bosqichdan keyin <b>state ham, savat ham</b> restartdan o'tdi",
    "Bu natija uchinchi bosqichdan keyin chiqdi. Ikkinchi bosqichdan keyin bot telefonni tanigan, lekin savat bo'sh edi, chunki savat hali xotirada edi. Bu yana oraliq vaziyat. Uchinchi bosqichdan keyin savat ham bazada, buyurtma raqami bir bo'lib yaratildi."
   ],
   [
    "d",
    "Xulosa: state'ni sinash uchun <b>restartni suhbat o'rtasida</b> qiling",
    "Xulosa: state'ni oddiy sinov ushlamaydi, chunki bitta jarayonda hamma narsa ishlaydi. Restartni suhbat o'rtasida qiling: bot savol berdi, server qayta yondi, keyin javob yozing. Bot davom etsa, state bazada."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 5",
  "title": "Admin tekshiruvi xom so'rov natijasi bilan yozilgan: rows[0].telegram_id !== 111. Jasur (id 111) /orders bosdi. Nima bo'ladi?",
  "q": "Big int'ni ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Admin tekshiruvi xom so'rov bilan yozilgan: bazadan telegram id olinadi va bir yuz o'n birga teng emasmi deb solishtiriladi. TypeScript xato bermadi. Jasurning id'si haqiqatan bir yuz o'n bir. U orders bosdi. Nima bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Bazadan telegram id matn bo'lib keladi, bir yuz o'n bir qo'shtirnoq ichida. Matn bilan son hech qachon teng emas, shuning uchun Jasur admin bo'lmay qoladi. Xato xabari yo'q, bot faqat admin uchun deydi. Demak, big int ustunini solishtirishdan oldin turini bir xil qiling: matn bilan matn yoki son bilan son.",
  "okShort": "<code>\"111\" !== 111</code> → <code>true</code>: admin tekshiruvi o'tmaydi, xato yo'q.",
  "hint": "Bazadan telegram_id qaysi turda keladi? === turi har xil qiymatlarga nima deydi?",
  "demak": "<code>BIGINT</code> ustunini solishtirishdan oldin ikki tomonning turi bir xil bo'lsin.",
  "correct": 3,
  "opts": [
   "Jasur buyurtmalarni ko'radi — id 111 to'g'ri",
   "Server ishga tushmaydi — tsc turni rad etadi",
   "Baza xato beradi — id matn bilan so'raldi",
   "«faqat admin uchun» chiqadi — \"111\" !== 111"
  ],
  "wrong": {
   "0": "Bazadan matn keladi: \"111\" — son emas.",
   "1": "Server ishlaydi va tsc ham xato bermaydi: raw (ichida ds.query) natijasi any. Entity'dagi string bilan solishtirilganda esa tsc TS2367 beradi — sinadik.",
   "2": "Baza so'rovni bajardi; solishtirish JavaScript'da."
  }
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 4",
  "eyebrow": "Hozir o'zingizda · 25 daqiqa",
  "title": "Foydalanuvchi, state va savat — ikki prompt, har biridan keyin restart",
  "seg": [
   [
    "a",
    "Endi siz: <b>ikki prompt, ikki commit</b> — foydalanuvchi va state, keyin savat",
    "Endi ikkita bosqichni o'zingiz qilasiz: foydalanuvchi va state, keyin savat. Har promptdan keyin tekshiruv va commit. Yigirma besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: 2-prompt, javobni o'qish, <b><code>\\d users</code> — id turi <code>bigint</code></b>",
    "Birinchi qadamda ikkinchi promptni AI'ga berasiz va javobni uch qismga ajratib o'qiysiz. Ikkinchisida backslash d users bilan telegram id turini ko'rasiz: big int bo'lishi kerak. Entity'da tur qanday ekaniga ham qarang."
   ],
   [
    "c",
    "3–4-qadam: 3-prompt, keyin <b>suhbat o'rtasida restart</b>; isbot — <code>state</code> ustuni",
    "Uchinchi qadamda uchinchi promptni berasiz. To'rtinchisida savatga mahsulot qo'shib, buyurtma berishni bosasiz, bot telefon so'raydi. Shu payt PostgreSQL terminalida users jadvalidan state'ni ko'ring va isbot maydoniga yozing. Keyin restart qilib raqam yuboring: bot buyurtma yaratishi kerak."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin botingiz foydalanuvchini, state'ni va savatni bazada saqlaydi va siz buni restart bilan isbotlagansiz."
   ]
  ],
  "steps": [
   {
    "t": "2-prompt — AI'ga bering, javobni uch qismga ajratib o'qing",
    "cmds": [
     "git diff --stat"
    ],
    "exp": "yangi migratsiya, birinchisi o'zgarmagan"
   },
   {
    "t": "users — /start ni ikki marta bosing, tekshiring, commit qiling",
    "cmds": [
     "\\d users",
     "SELECT telegram_id, count(*) FROM users GROUP BY 1;"
    ],
    "exp": "bigint · har id 1 marta"
   },
   {
    "t": "3-prompt — AI'ga bering; Telegram'da bitta mahsulotni 3 marta bosing; tekshirib commit qiling",
    "cmds": [
     "\\d cart_items",
     "SELECT * FROM cart_items;"
    ],
    "exp": "UNIQUE · bitta qator, qty 3"
   },
   {
    "t": "Restart — «✅ Buyurtma berish» bosing; telefon so'ralganda state'ni ko'ring; serverni qayta yoqib raqam yuboring",
    "cmds": [
     "SELECT state FROM users WHERE telegram_id = <id>;",
     "Ctrl+C",
     "npm run start:dev"
    ],
    "exp": "WAITING_PHONE · «Buyurtma #… qabul qilindi!»"
   }
  ],
  "proof": {
   "label": "Telefon so'ralgan paytdagi state qiymati",
   "placeholder": "psql natijasini yozing",
   "re": "WAITING_PHONE",
   "flags": "i",
   "wrong": "Buyurtma berishni bosgandan keyin, raqam yozishdan oldin tekshiring. IDLE chiqsa — state bazaga yozilmagan: AI'ga state'ni bazada saqlash shartini qayta yozing."
  },
  "trouble": [
   [
    "telegram_id — integer",
    "AI turni noto'g'ri tanladi — yangi migratsiya: ALTER COLUMN … TYPE BIGINT; katta id'da terminalda value \"5123456789\" is out of range for type integer, bot «Tushunmadim» deydi"
   ],
   [
    "/start ikki marta — ikki qator",
    "UNIQUE yo'q — AI'ga: «telegram_id takrorlanmasin, bazada ham»"
   ],
   [
    "duplicate key value violates unique constraint",
    "avval qidirmasdan qo'shilyapti — ON CONFLICT (14-ekran)"
   ],
   [
    "Restartdan keyin «Tushunmadim»",
    "state bazaga yozilmagan yoki o'qilmayapti — SELECT state …"
   ],
   [
    "Restartdan keyin «Savat bo'sh»",
    "savat hali xotirada — 3-prompt bajarilganmi"
   ],
   [
    "Admin /orders — «faqat admin uchun»",
    "\"111\" === 111 (16-ekran) — tur"
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · buyurtma · ichida",
  "title": "Buyurtma uch ish: ombordan ayirish, buyurtma yozish, savatni tozalash — yo hammasi, yo hech biri",
  "seg": [
   [
    "a",
    "Buyurtma <b>uch jadvalga tegadi</b>: <code>products</code>, <code>orders</code> va <code>cart_items</code>",
    "To'rtinchi bosqich: buyurtma. Bitta buyurtma uch jadvalga tegadi: products'dan ombor ayiriladi, orders va order items'ga buyurtma yoziladi, cart items'dan savat o'chiriladi. PostgreSQL-2 da ikki jadval bitta ish ekranini ko'rgansiz, bu o'shaning o'zi, faqat kod ichida."
   ],
   [
    "b",
    "TypeORM <code>transaction</code> — <b><code>START TRANSACTION</code> … <code>COMMIT</code></b> — SQL logda ko'rinadi",
    "Kodda bu dataSource transaction. Ichidagi hamma so'rov bitta tranzaksiyada yuradi. SQL logni yoqsangiz, uning o'zini ko'rasiz: start transaction, ikkita update, ikkita insert, delete va commit. Bu PostgreSQL terminalidagi begin va commit'ning aynan o'zi."
   ],
   [
    "c",
    "Birortasi yiqilsa — <b><code>ROLLBACK</code></b>: ombor, buyurtma va savat o'zgarmaydi",
    "Ichida bitta so'rov yiqilsa, TypeORM rollback qiladi. Ombor ham, buyurtma ham, savat ham o'zgarmaydi. Biz buni ataylab sinadik: order items'ga yozishda xato beradigan trigger qo'ydik. Bot buyurtma berilmadi dedi, ombor sakkiz va o'nda, buyurtma nol, savat joyida qoldi."
   ],
   [
    "d",
    "Xulosa: bitta ishning <b>hamma so'rovi bitta tranzaksiyada</b>; SQL log — isbot",
    "Xulosa: bir nechta jadvalga tegadigan bitta ish bitta tranzaksiyada bo'ladi. AI tranzaksiya qildim desa, SQL logni yoqib ko'ring: start transaction va commit orasida hamma so'rov bormi. Bu tekshiruv bir daqiqa oladi."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Omborda bitta Planshet, ikki mijoz bir vaqtda «Buyurtma berish» bosdi: bittasiga sotiladi, ikkinchisi aniq xabar oladi",
  "seg": [
   [
    "a",
    "Sinov: omborda <b>bitta Planshet qoldi, ikki tranzaksiya bir vaqtda</b> boshlanadi",
    "Endi eng og'ir sinov. Omborda bitta Planshet qoldi. Aziza va Bobur bir vaqtda buyurtma berishni bosadi. Ikki tranzaksiya bir vaqtda boshlanadi va ikkalasi ham Planshet qatoriga yetib boradi."
   ],
   [
    "b",
    "Birinchi tranzaksiya qatorni <b>qulflaydi</b>, ikkinchisi u tugashini kutadi",
    "Birinchi tranzaksiya Planshet qatorini qulflaydi. Bizdagi kodda bu select for update, AI kodida update where stock katta yoki teng qty. Ikkinchi tranzaksiya shu qatorga yetganda kutadi. Birinchisi commit qilgach, ikkinchisi yangi qoldiqni ko'radi: nol."
   ],
   [
    "c",
    "Natija: <b>bitta sotildi, ombor 0</b>, Bobur aniq xabar oldi, savati saqlandi",
    "Natija: Azizaga sotildi, ombor nol, manfiy emas. Bobur aniq xabar oldi: Planshet, omborda faqat nol ta qoldi. Uning tranzaksiyasi rollback bo'ldi, savati saqlanib qoldi. Biz bu sinovni o'zimizdagi kod va AI kodi bilan yurgizdik, natija bir xil."
   ],
   [
    "d",
    "Xulosa: «ortiqcha sotilmasin» sharti <b>faqat bir vaqtdagi ko'p mijoz sinovi bilan</b> tekshiriladi",
    "Xulosa: bitta mijoz bilan bu xato hech qachon ko'rinmaydi, faqat bir vaqtdagi ikki so'rov bilan. Ikki mijoz ham kam: tranzaksiya tez tugaydi va qulfsiz kod ham ko'pincha to'g'ri chiqadi. Shuning uchun smoke beshta mijozni uch raund yurgizadi. Qulf bo'lmasa nima bo'lishini keyingi ekranda ko'ramiz."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz",
  "title": "Qulfsiz «o'qi, tekshir, yoz»: hamma tranzaksiya qoldiq 1 ni ko'radi — bitta Planshet besh kishiga sotiladi, CHECK ham ushlamaydi",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>lock</code> ustiga bosing",
    "Buyurtma ishlaydi, race sinovi ham toza. Endi ataylab buzamiz, chunki AI'lar ko'pincha aynan shunday yozadi. Buzishni o'zingiz qilasiz: order service'ning o'ttiz uchinchi satrida lock yonib turibdi, ustiga bosing: qulf olib tashlanadi.",
    "<b>order.service.ts</b> 33-satridagi <b><code>lock: { mode: 'pessimistic_write' }</code></b> ustiga bosing — qulf olib tashlanadi, o'qish oddiy <code>findOneBy</code> bo'ladi."
   ],
   [
    "a",
    "Qulf yo'q: qatorni <b>qulfsiz o'qiymiz</b>, qoldiqni kodda hisoblab, yangisini yozamiz",
    "Qulfni olib tashladingiz. Endi mahsulot oddiy find bilan o'qiladi, qoldiq yetadimi deb kodda tekshiriladi, yangi qoldiq hisoblanib save qilinadi. AI'lar ko'pincha aynan shunday yozadi, ko'rinishi to'g'ri."
   ],
   [
    "b",
    "Besh tranzaksiya <b>bir vaqtda «qoldiq 1» ni ko'radi</b> — hammasi tekshiruvdan o'tadi",
    "Besh mijoz bir vaqtda bosadi. Hamma tranzaksiya qoldiqni o'qiydi: bir. Hammasi yetadi deb hisoblaydi va nolni yozadi. Biz buni besh raund yurgizdik: to'rt raundda bitta Planshet besh kishiga sotildi. Birinchi raundda tasodifan bittaga, shuning uchun bir marta sinash yetmaydi."
   ],
   [
    "c",
    "<code>CHECK (stock &gt;= 0)</code> <b>ushlamaydi</b>: yozilgan qiymat 0, manfiy emas",
    "Baza qoidasi ham yordam bermaydi. Check stock katta yoki teng nol faqat manfiy qiymatni rad etadi. Har tranzaksiya nol yozdi, nol esa ruxsat etilgan. Ya'ni bu vaziyatda xato xabari yo'q, faqat bitta ortiqcha buyurtma bor."
   ],
   [
    "d",
    "Tuzatish ikki xil: <b>qulf bilan o'qish</b> yoki <b>bitta <code>UPDATE … WHERE</code></b> — yana 1 sotildi",
    "Tuzatish ikki xil. Birinchisi: o'qishda qulf, find'ga lock pessimistic write qo'shiladi, ikkinchi tranzaksiya kutadi. Ikkinchisi: hisobni bazaga berish, update stock minus qty where stock katta yoki teng qty. Race qayta yurgizildi: besh raundda ham bitta sotildi, ombor nol. Demak, qoldiqni kodda hisoblab yozish qulfsiz ishlamaydi."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "CHECK rad etgandan keyin o'sha tranzaksiyada yana so'rov: «current transaction is aborted» — PG-2 dagi shop=!# kod ichida",
  "seg": [
   [
    "a",
    "Bu xatoni <b>biz o'zimiz qildik</b>: loyihani yozayotganda birinchi kod shunday edi",
    "Bu xatoni AI emas, biz o'zimiz qildik: tayyor loyihani yozayotganda birinchi kod shunday edi. Fikr to'g'ri ko'ringan: avval ayiramiz, check rad etsa, mahsulotni qayta o'qib, mijozga qancha qolganini aytamiz."
   ],
   [
    "b",
    "<code>CHECK</code> rad etdi — keyingi <code>SELECT</code> <b>«transaction is aborted»</b> oldi",
    "Mijoz to'rtta Planshet so'radi, uchta bor edi. Update check'ga urildi. Keyin kod qoldiqni bilish uchun select qildi va xato oldi: current transaction is aborted. Mijozga esa tushunarsiz inglizcha xabar ketdi."
   ],
   [
    "c",
    "PostgreSQL qoidasi: tranzaksiyada xato chiqqandan keyin <b>faqat <code>ROLLBACK</code> yordam beradi</b>",
    "Bu PostgreSQL-2 dagi undov belgili prompt'ning o'zi. Tranzaksiya ichida bitta xato bo'lsa, rollback'gacha hamma so'rov rad etiladi. Kodda ham shunday: xatodan keyin shu tranzaksiyada hech narsa so'rab bo'lmaydi."
   ],
   [
    "d",
    "Tuzatish: <b>avval tekshirish, keyin yozish</b>; <code>CHECK</code> — oxirgi qo'riqchi",
    "Tuzatish: tekshiruvni update'dan oldinga oldik. Qatorni qulf bilan o'qiymiz, yetmasa xabarni o'sha yerda beramiz. Check esa oxirgi qo'riqchi bo'lib qoladi: kod xato qilsa ham ombor manfiy bo'lmaydi. Demak, tranzaksiya ichida xatoni ushlab, so'rovni davom ettirib bo'lmaydi."
   ]
  ]
 },
 "22": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 5 — qaysi satr xato?",
  "title": "Bitta Planshet besh kishiga sotildi. Xato satrni toping",
  "q": "Buzishni ko'rdingiz, endi o'zingiz toping. To'rtinchi tekshiruv. Besh mijoz oxirgi Planshetni bir vaqtda oldi va besh buyurtma yaratildi. Bu bo'lakda bitta satr qatorni qulfsiz o'qiydi. O'sha satrni bosing.",
  "ok": "To'g'ri. Find one by qatorni qulfsiz o'qiydi, shuning uchun hamma tranzaksiya bir xil qoldiqni ko'radi. Tekshiruv va hisob to'g'ri, lekin ular eski qiymat ustida ishlaydi. Ekranda tuzatilgan kod: lock pessimistic write, race'da bitta sotildi. Demak, ikki mijoz xatosida avval qoldiq qayerda o'qilganini qidiring.",
  "okShort": "<code>findOneBy</code> — qulfsiz o'qish: hamma tranzaksiya qoldiq 1 ni ko'radi. <code>lock: pessimistic_write</code> bilan qolganlari navbat kutadi.",
  "hint": "Tekshiruv satri to'g'ri hisoblaydi — lekin qaysi qiymat ustida? O'sha qiymat qaysi satrda va qanday o'qilgan?",
  "task": "Qoida: tranzaksiya ichida o'qilgan qoldiq boshqa tranzaksiya uni o'zgartirmasligi uchun qulflanadi — yoki hisob bitta <code>UPDATE … WHERE</code> ichida bo'ladi. Bu bo'lakda bitta satr qatorni qulfsiz o'qiydi. <b>O'sha satrni bosing.</b>"
 },
 "23": {
  "type": "Practice",
  "kicker": "Amaliyot 4 / 4",
  "eyebrow": "Hozir o'zingizda · 25 daqiqa",
  "title": "Buyurtma tranzaksiyada — va besh mijoz oxirgi mahsulotni oladi",
  "seg": [
   [
    "a",
    "Oxirgi bosqich: <b>4-prompt</b>, SQL log va ko'p mijoz sinovi",
    "Oxirgi bosqich: buyurtmalarni bazaga ko'chirasiz. Keyin uchta tekshiruv: SQL logda tranzaksiya, ko'p mijoz sinovi va bekor qilish. Yigirma besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: 4-prompt, javob, <b>SQL logda <code>START TRANSACTION</code> … <code>COMMIT</code></b>",
    "Birinchi qadamda to'rtinchi promptni AI'ga berib, javobni uch qismga ajratib o'qiysiz. Ikkinchisida env'da db logging true qilib, bitta buyurtma berasiz va terminalda start transaction va commit orasidagi so'rovlarni ko'rasiz."
   ],
   [
    "c",
    "3–4-qadam: <b>ko'p mijoz sinovi</b> va bekor qilish; isbot — ikkinchi mijozga kelgan xabar",
    "Uchinchi qadamda smoke skriptini race rejimida yurgizasiz: besh mijoz bitta Planshetni bir vaqtda oladi. To'rtinchisida admin sifatida buyurtmani ikki marta bekor qilasiz: ombor bir marta qaytishi kerak. Isbot maydoniga ikkinchi mijozga kelgan xabarni yozing. Hammasi to'g'ri bo'lsa, commit."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin botingizning hamma ma'lumoti PostgreSQL'da va ortiqcha sotilmasligini o'zingiz isbotlagansiz."
   ]
  ],
  "steps": [
   {
    "t": "4-prompt — AI'ga bering, javobni o'qing, yangi jadvallarni ko'ring",
    "cmds": [
     "git diff --stat",
     "\\d orders",
     "\\d order_items"
    ],
    "exp": "yangi migratsiya · texts.ts/keyboards.ts o'zgarmagan"
   },
   {
    "t": "SQL log — .env ga qo'shing (AI boshqa nom bergan bo'lsa — javobidan), Telegram'da buyurtma bering",
    "cmds": [
     "DB_LOGGING=true"
    ],
    "exp": "START TRANSACTION … COMMIT"
   },
   {
    "t": "Besh mijoz",
    "cmds": [
     "npm run smoke -- race (vaqtinchalik bazada, sizning bazangiz o'zgarmaydi)"
    ],
    "exp": "✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0"
   },
   {
    "t": "Bekor — admin sifatida /orders da «❌ Bekor» ni ikki marta bosing, qoldiqni ko'ring, commit",
    "cmds": [
     "SELECT stock FROM products WHERE name = 'Planshet';"
    ],
    "exp": "1-chi «Bekor qilingan», 2-chi «allaqachon bekor qilingan» · 1"
   }
  ],
  "proof": {
   "label": "Ikkinchi mijozga kelgan xabar",
   "placeholder": "smoke natijasidan nusxalang",
   "re": "omborda\\s+faqat\\s+0\\s+ta",
   "flags": "i",
   "wrong": "Ikkalasiga ham \"qabul qilindi\" chiqdimi? Unda qulf yo'q — 20-ekran: place ichida qoldiq qanday o'qilganini qarang."
  },
  "trouble": [
   [
    "✗ ortiqcha sotilmadi (masalan 5/0)",
    "qulfsiz o'qish (20, 22-ekran) — AI'ga: «qatorni FOR UPDATE bilan qulfla yoki UPDATE … WHERE stock >= qty»"
   ],
   [
    "current transaction is aborted xatosi",
    "xatodan keyin tranzaksiyada so'rov (21-ekran) — tekshiruv UPDATEdan oldin"
   ],
   [
    "Bekor 2 marta — ombor 2 ga oshdi",
    "bekor qilishda buyurtma qatori qulflanmagan yoki status tekshirilmagan — AI'ga shu haqida"
   ],
   [
    "SQL logda START TRANSACTION yo'q",
    "so'rovlar tranzaksiyasiz — dataSource.transaction"
   ],
   [
    "smoke — Missing script",
    "AI package.json dagi smoke qatorini o'chirgan — git checkout tgpg-start -- scripts/smoke.js va qatorni qaytaring"
   ]
  ]
 },
 "24": {
  "type": "Lesson",
  "kicker": "5-bosqich · xulosa",
  "title": "Har bosqichdan keyin beshta tekshiruv: diff, build, restart, psql va ko'p mijoz",
  "seg": [
   [
    "a",
    "Birinchi ikki tekshiruv: <b>diff hajmi va build</b> — so'ralgan ish va toza kompilyatsiya",
    "To'rt bosqichni o'tdingiz. Endi tekshiruvlarni bitta ro'yxatga yig'amiz, chunki ular har bosqichda bir xil. Birinchisi diff: o'zgarish hajmi so'ralgan bosqichga tengmi. Ikkinchisi build: loyiha xatosiz kompilyatsiya bo'ladimi."
   ],
   [
    "b",
    "Uchinchi va to'rtinchi: <b>restart va PostgreSQL terminali</b> — ma'lumot qayerda yashaydi",
    "Uchinchisi restart: suhbat o'rtasida serverni qayta yoqing va nima qolganini ko'ring. Oraliq vaziyat va state faqat shu bilan ko'rinadi. To'rtinchisi PostgreSQL terminali: backslash d bilan ustun turlari va qoidalar, select bilan haqiqiy qatorlar."
   ],
   [
    "c",
    "Beshinchi: <b>bir vaqtdagi ko'p mijoz</b> — smoke bizning kodimizda ham xato topdi",
    "Beshinchisi bir vaqtdagi ko'p mijoz: buni smoke'ning race rejimi qiladi. U bizning o'z kodimizda ham xato topdi: admin bekorni bir vaqtda ikki marta bossa, ombor ikki marta qaytardi. Buyurtma qatori qulflanmagan edi, tuzatdik. Ikki AI'ning kodi bu sinovdan o'tdi."
   ],
   [
    "d",
    "Xulosa: AI'ning <b>«sinadim» degan gapi — tekshiruv emas</b>; besh band — sizning qo'lingizda",
    "Xulosa: ikki tajribada AI kodni ko'pincha to'g'ri yozdi. Lekin so'ralmagan ishni qildi, oraliq vaziyatni sezmadi, bir marta haqiqiy Telegram'ga so'rov yubordi. Buni AI aytmadi, tekshiruv topdi. Besh band har bosqichda sizning qo'lingizda, keyin commit."
   ]
  ]
 },
 "25": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m5-04 · «Bot eslab qoladi»",
  "title": "O'quvchi darsi: bitta users jadvali, Neon va uch qatorli prompt — siz bilgan yo'lning kichik varianti",
  "seg": [
   [
    "a",
    "m5-04 — 20 ekran: o'quvchi boti <b>ismni eslab qoladi</b>, bitta <code>users</code> jadvali",
    "Endi sinfga tayyorgarlik, ikki ekran. O'quvchi darsi m5-04, yigirma ekran. O'quvchi boti ismni eslab qolishi kerak: bitta users jadvali, unda telegram id big int, ism va holat ustunlari, ya'ni name va state. Siz bugun beshta jadval bilan ishladingiz, bu uning kichik varianti."
   ],
   [
    "b",
    "Amaliyot: <b>Neon va Antigravity</b>, <code>synchronize: true</code> — migratsiyasiz",
    "O'quvchi amaliyotida baza internetdagi Neon'da, ulanish manzili oxirida sslmode require turadi. Kodni Antigravity uch qatorli prompt bilan yozadi. Jadvalni synchronize true o'zi yaratadi, migratsiya yo'q. O'quv loyiha uchun bu yetadi, siz farqini bilasiz."
   ],
   [
    "c",
    "Siz qo'shasiz: <b><code>\\d users</code> — <code>bigint</code></b>, ikki marta <code>/start</code>, restart suhbat o'rtasida",
    "Darsga siz qo'shadigan narsalar: AI yozgandan keyin o'quvchi bilan backslash d users'ni ko'ring, telegram id big int bo'lsin. Start'ni ikki marta bosib, qator bitta qolganini ko'rsating. Restartni ism so'ralgan paytda qiling: bot davom etsa, state bazada."
   ],
   [
    "d",
    "Xulosa: darsdan oldin — <b>Neon akkaunti, BotFather sinov boti</b>, <code>dars-03-done</code> ishga tushgan",
    "Xulosa: darsdan oldin uch narsani tekshiring: har o'quvchida Neon akkaunti ochiladi, BotFather'da sinov boti bor, va dars uchdagi bot ishlab turibdi. Vaqt bo'yicha taklif: amaliyotga eng ko'p vaqt bering, Neon va token bosqichida ko'pchilik xato qiladi."
   ]
  ]
 },
 "26": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "To'rtta vaziyat va tayyor javoblar — hammasini bugun o'zingiz ko'rdingiz",
  "seg": [
   [
    "a",
    "Darsda albatta chiqadigan to'rt vaziyat — <b>ikkitasi xabar bilan, ikkitasi xabarsiz</b>",
    "Endi o'quvchi darsida albatta chiqadigan to'rtta vaziyatni ko'ramiz. Ikkitasi xabar bilan keladi, ikkitasi xabarsiz. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman."
   ],
   [
    "b",
    "401 va <code>DATABASE_URL topilmadi</code> — <b>xabardan darhol taniladi</b>",
    "Birinchisi: server ishlayapti deydi, lekin bot javob bermaydi, terminalda to'rt yuz bir. Token noto'g'ri. Ikkinchisi: server umuman yonmaydi, database url topilmadi. Env fayli yo'q yoki manzil yozilmagan."
   ],
   [
    "c",
    "Ism unutildi va katta id — <b>restart va <code>\\d users</code> bilan</b> topiladi",
    "Uchinchisi xabarsiz: restartdan keyin bot ismni yana so'raydi. State bazaga yozilmayapti, users jadvaliga qarang. To'rtinchisi: terminalda out of range for type integer yoki ikkinchi start'da duplicate key. Ustun turi va avval qidirish bormi, shuni tekshiring."
   ],
   [
    "d",
    "Xulosa: o'quvchi «AI yozdi, ishlayapti» desa — <b>restart va ikki marta <code>/start</code></b> qildiring",
    "Xulosa va usul: o'quvchi AI yozdi, ishlayapti desa, ikki narsani o'zi qilsin: restartni suhbat o'rtasida va start'ni ikki marta. Javobni darhol aytmang, natijani birga ko'ring. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "27": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Bot savat va buyurtmani Mapda saqlaydi. Server qayta ishga tushdi. Nima bo'ladi?",
    "o": [
     "Savat va buyurtma yo'qoladi, xato chiqmaydi",
     "Server xato beradi — Map ichi buzilgan",
     "Hammasi joyida qoladi — Map diskka yoziladi",
     "Faqat buyurtma qoladi — u alohida massivda"
    ],
    "c": 0,
    "e": "Map — jarayon xotirasida.",
    "s": 3
   },
   {
    "q": "AI'ga bir gapli prompt: «Katalogni ko'chir». U 22 fayl, 1145 qatorni o'zgartirdi, kod ishlaydi. To'g'ri qadam?",
    "o": [
     "Darhol commit — kod ishlayapti, shu yetadi",
     "Bekor qilib, bitta bosqichli prompt berish",
     "AI'ni almashtirib, xuddi shu promptni berish",
     "Hech narsa — 1145 qator ham oddiy hajm"
    ],
    "c": 1,
    "e": "Commit qilinadigan hajm — so'ralgan bosqich.",
    "s": 6
   },
   {
    "q": "Katalog bazada, buyurtma hali xotirada. Buyurtmadan keyin restart. Natija?",
    "o": [
     "Hammasi joyida — katalog bazada saqlangan",
     "Ikkalasi yo'qoladi — restart bazani tozalaydi",
     "Buyurtma yo'qoladi, ombor esa kamayib qoladi",
     "Server yonmaydi — baza va xotira mos emas"
    ],
    "c": 2,
    "e": "Oraliq vaziyat: bir ish ikki joyda.",
    "s": 11
   },
   {
    "q": "Yurgan migratsiyaga ustun qo'shib tahrirladingiz, server qayta yondi. Ustun paydo bo'ladimi?",
    "o": [
     "Ha — migratsiya har restartda qayta yuradi",
     "Ha — synchronize ustunni o'zi qo'shadi",
     "Server xato beradi — fayl o'zgargani uchun",
     "Yo'q — u yurgan, yangi migratsiya kerak"
    ],
    "c": 3,
    "e": "Migratsiya bir marta yuradi.",
    "s": 9
   },
   {
    "q": "Bazadan telegram_id keldi, user.telegram_id === 111 false chiqdi, id esa 111. Sabab?",
    "o": [
     "BIGINT bazadan matn bo'lib keladi: \"111\"",
     "Id noto'g'ri — Telegram boshqa id bergan",
     "Baza ulanmagan — qiymat undefined keldi",
     "=== katta sonlarda doim false beradi"
    ],
    "c": 0,
    "e": "node-pg bigintni matn qaytaradi.",
    "s": 13
   },
   {
    "q": "Mijoz tugmani ikki marta tez bosdi, savatda ikki bir xil qator paydo bo'ldi. Nima yetishmayapti?",
    "o": [
     "Tranzaksiya — ikki bosish ketma-ket emas",
     "UNIQUE (user_id, product_id) + ON CONFLICT",
     "BIGINT — id sig'magani uchun ikki qator",
     "Migratsiya — savat jadvali eskirib qolgan"
    ],
    "c": 1,
    "e": "Avval qidirib qo'shish — ikki so'rov ikkalasi «yo'q» ko'radi.",
    "s": 14
   },
   {
    "q": "Bitta Planshet, besh mijoz bir vaqtda; kod: findOneBy → if (stock < qty) → save. CHECK (stock >= 0) bor. Natija?",
    "o": [
     "Faqat biriga — CHECK qolganlarini to'xtatadi",
     "CHECK xato beradi — ombor manfiy bo'ladi",
     "Bir nechtasiga sotiladi, ombor 0, xato yo'q",
     "Deadlock — tranzaksiyalar bir-birini kutadi"
    ],
    "c": 2,
    "e": "Har biri 0 yozdi — manfiy emas (sinovda 5 tasiga).",
    "s": 20
   },
   {
    "q": "Tranzaksiyada CHECK xato berdi, kod shu tranzaksiyada SELECT qildi. Nima chiqadi?",
    "o": [
     "Oddiy natija — SELECT alohida ishlaydi",
     "Baza o'zi COMMIT qiladi va natija beradi",
     "0 rows — jadval bo'shab qoladi",
     "current transaction is aborted xatosi"
    ],
    "c": 3,
    "e": "Xatodan keyin faqat ROLLBACK.",
    "s": 21
   }
  ]
 },
 "28": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};
