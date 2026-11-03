
// ============================================================
//  WEBSOCKET-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/ws1-matn.py (manba: 19-WS1-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · WebSocket",
  "title": "Vali qo'shildi. Ali'ning ekrani buni qachon biladi?",
  "seg": [
   [
    "a",
    "Ekran o'zi yangilanishi uchun <b>Backend o'zi xabar yuborishi</b> kerak — bugun shuni ko'ramiz",
    "Assalomu alaykum. Maydon Jamoa ilovasida Vali o'yinga qo'shildi. Ali'ning ekrani buni qachon biladi? Bugun Backend o'zi xabar yuboradigan doimiy ulanishni ko'ramiz."
   ],
   [
    "b",
    "Avval <b>so'rov va ulanish farqi</b>, keyin gateway va token",
    "Avval oddiy so'rov va doimiy ulanish farqi. Keyin Backend'dagi gateway: ulanishni kim qabul qiladi va tokenni qanday tekshiradi."
   ],
   [
    "c",
    "Keyin uch holat va hodisa — hammasi o'quvchi loyihasida, <b>haqiqiy yurgizilgan</b>",
    "Keyin ulanishning uch holati va hodisa. Hammasini o'quvchilar loyihasi maydon jamoa'da haqiqiy yurgizdik, sizda ham shunday bo'ladi."
   ],
   [
    "d",
    "Besh bosqich, uch amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Dars besh bosqichdan iborat, uchta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · ulanish",
  "title": "Vali qo'shildi (201) — Ali'da son eski, faqat pastga tortsa yangilanadi",
  "seg": [
   [
    "a",
    "O'quvchilar 11-Modulda qurgan ilova: son <b>faqat so'rov bilan</b> keladi",
    "Savoldan boshlaymiz: hozir ilova sonni qanday oladi? Maydon Jamoa'ni o'quvchilar o'n birinchi modulda qurgan. Ilova so'raydi, Backend javob beradi. Ali ekranni ochdi: to'qqizdan o'n."
   ],
   [
    "b",
    "Vali qo'shildi — Backend biladi, lekin Ali'ga <b>yubora olmaydi</b>",
    "Vali o'yinga qo'shildi, Backend ikki yuz bir qaytardi va bazada son o'zgardi. Lekin Ali so'ramagan, demak unga yo'l yopiq. Ali'ning ekranida to'qqiz qoldi."
   ],
   [
    "c",
    "Ali pastga tortdi — <b>yangi so'rov</b>, yangi son: o'n",
    "Ali pastga tortdi, ya'ni yangi so'rov yubordi va o'nni oldi. So'ramaguncha yangi son kelmaydi. O'quvchi darsi shu holatdan boshlanadi."
   ],
   [
    "d",
    "Xulosa: so'rov–javobda yo'l <b>faqat ilova so'raganda</b> ochiladi — Backend kutadi",
    "Xulosa: so'rov va javobda yo'l faqat ilova so'raganda ochiladi. Backend o'zi xabar yubora olmaydi. Buning uchun ochiq turadigan yo'l kerak."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · ulanish",
  "title": "Ilova bir marta ulanadi — yo'l ochiq turadi, ikkala tomon yuboradi",
  "seg": [
   [
    "a",
    "Doimiy ulanish: ilova bir marta ulanadi va <b>yo'l ochiq qoladi</b>",
    "Yo'l faqat so'rovda ochilsa, Backend Ali'ga yetolmaydi. Demak ochiq turadigan yo'l kerak. Doimiy ulanishda ilova bir marta ulanadi va yo'l ochiq qoladi, ikkala tomon istagan payt yuboradi."
   ],
   [
    "b",
    "socket.io — kutubxona: imkon bo'lsa <b>WebSocket orqali</b> ulanadi",
    "O'quvchi loyihasida ulanishni socket io kutubxonasi ochadi. Imkon bo'lsa WebSocket orqali ulanadi. Haqiqiy yurgizishda transport websocket chiqdi."
   ],
   [
    "c",
    "Ilovada bitta qator: <code>io(manzil, { auth: { token } })</code> — <b>token ulanishda</b> yuboriladi",
    "Ilova tomonida asosiy qator bitta: io, Backend manzili va auth ichida token. Token so'rov sarlavhasida emas, ulanish ochilayotganda yuboriladi."
   ],
   [
    "d",
    "Xulosa: doimiy ulanish — ochiq yo'l; Backend xabarni <b>o'zi yubora oladi</b>",
    "Xulosa: doimiy ulanish ochiq yo'l, Backend xabarni o'zi yubora oladi. Lekin u yo'lni kimga ochadi? Buni gateway hal qiladi."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Ulanish ochiq turibdi. Backend ilovaga qachon xabar yubora oladi?",
  "q": "Doimiy ulanishni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Ulanish ochiq turibdi. Backend ilovaga qachon xabar yubora oladi? Variantni tanlang.",
  "ok": "To'g'ri. Ulanish ochiq turganda Backend xabarni istagan paytda yuboradi. So'rov va javobda esa Backend faqat ilova so'raganda javob beradi. Demak, doimiy ulanishning asosiy farqi shu: Backend birinchi bo'lib yoza oladi.",
  "okShort": "Ochiq ulanishda — istagan payt, so'rovsiz.",
  "hint": "Ochiq yo'l — kim uchun ochiq?",
  "correct": 3,
  "opts": [
   "Faqat ilova so'raganda",
   "Faqat ilova ochilganda",
   "Har daqiqada bir marta",
   "Istagan payt — so'rovni kutmaydi"
  ],
  "wrong": {
   "0": "Bu so'rov–javob (2-ekran).",
   "1": "Ochilganda faqat ulanadi; xabar keyin ham keladi.",
   "2": "Jadval yo'q — o'zgarish bo'lganda."
  }
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · gateway",
  "title": "Gateway: token yo'q yoki yaroqsiz — disconnect() va return",
  "seg": [
   [
    "a",
    "Gateway — Backend'da <b>ulanishlarni qabul qiladigan klass</b>, HTTP bilan bitta portda",
    "Ilova token bilan ulanishni ko'rdik. Endi Backend tomoni: bu ulanishni kim qabul qiladi? Gateway. Bu NestJS klassi, HTTP server bilan bitta portda turadi. O'quvchi loyihasida u oyinlar gateway."
   ],
   [
    "b",
    "<code>handleConnection</code> — har ulanishda ishlaydi: token <b><code>handshake.auth</code></b> dan olinadi",
    "Handle connection har yangi ulanishda ishlaydi. Token handshake auth ichidan olinadi, ya'ni ilova io'ga bergan auth."
   ],
   [
    "c",
    "Token yo'q yoki yaroqsiz — <b><code>ulanish.disconnect()</code></b> va <b><code>return</code></b>",
    "Token JWT kaliti bilan tekshiriladi, yopiq so'rovlardagi kabi. Yo'q yoki yaroqsiz bo'lsa, Backend ulanishni yopadi va funksiyadan chiqadi."
   ],
   [
    "d",
    "Xulosa: token har so'rovda emas — <b>ulanish ochilayotganda</b> bir marta tekshiriladi",
    "Xulosa: bu yerda token har so'rovda emas, ulanish ochilayotganda bir marta tekshiriladi. Yaroqli bo'lsa, o'yinchi id ulanishga yozib qo'yiladi."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · gateway",
  "title": "Klient bir lahza «ulangan», keyin io server disconnect — «ulanmagan»",
  "seg": [
   [
    "a",
    "Token bilan ulandik: Backend terminalida <b>«ulandi: o'yinchi 11»</b> chiqdi",
    "Gateway kodini o'qidik, endi uni haqiqiy yurgizib sinaymiz. Avval token bilan ulandik. Backend terminalida yozuv chiqdi: ulandi, o'yinchi o'n bir. Bu Ali, u ro'yxatdan o'tgan va kirgan."
   ],
   [
    "b",
    "Tokensiz: klient <b>bir lahza «ulangan»</b> bo'ladi, keyin Backend yopadi",
    "Endi tokensiz. Qiziq tomoni: klient bir lahza ulangan bo'ladi, chunki ulanish ochilib bo'lgan. Keyin Backend tekshiradi va yopadi: io server disconnect."
   ],
   [
    "c",
    "<b><code>active=false</code></b> — ilova o'zi qayta urinmaydi: belgi «Ulanmagan»",
    "Active false: Backend yopgan ulanishga socket io o'zi qayta urinmaydi. Ilovadagi belgi ulanmagan bo'ladi. Soxta token bilan ham aynan shunday."
   ],
   [
    "d",
    "Xulosa: tokensiz ulanish bir lahza ochiladi va <b>darhol yopiladi</b> — ilova «Ulanmagan»",
    "Xulosa: tokensiz yoki soxta token bilan ulanish bir lahza ochiladi va darhol yopiladi. Sinfda belgi bir lahza yashil bo'lib o'chsa, sabab shu."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "maydon-jamoa backend'i lokal: ro'yxat, kirish, token bilan ulanish",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi loyihasining backend'ini <b>o'z kompyuteringizda</b> ishga tushirasiz",
    "Token bilan va tokensiz ulanishni ko'rdingiz, endi navbat sizga. Maydon jamoa backend'ini o'z kompyuteringizda ishga tushirasiz va Node'dagi kichik klient bilan ulanasiz. O'n besh daqiqa."
   ],
   [
    "b",
    "1–2-qadam: clone, <b><code>m12-dars-02-done</code></b>, <code>npm ci</code>; keyin baza, <code>.env</code> va ishga tushirish",
    "Birinchi: clone, m12 dars ikki done tegi, keyin backend papkasida npm ci. Ikkinchi: lokal PostgreSQL'da maydon jamoa bazasi, env fayli namunadan, keyin npm run start."
   ],
   [
    "c",
    "3–4-qadam: ro'yxat va kirish, keyin klient bilan ulanish; isbot — <b>Backend terminalidagi satr</b>",
    "Uchinchi: curl bilan ro'yxat va kirish, token olinadi. To'rtinchi: klient bilan ulanish. Isbot maydoniga Backend terminalidagi ulandi satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin o'quvchi loyihasining backend'i sizning kompyuteringizda ishlaydi va siz unga token bilan ulangan bo'lasiz."
   ]
  ]
 },
 "8": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Tokensiz ulanishda Backend «ulandi: o'yinchi null» deb yozdi",
  "q": "Gateway'ni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Tokensiz ulanish yopildi, lekin Backend terminali ulandi, o'yinchi null dedi. Funksiya to'xtashi kerak bo'lgan satrni bosing.",
  "ok": "To'g'ri. Beshinchi satr: disconnect'dan keyin return yo'q. Ulanish yopildi, lekin funksiya davom etib, yolg'on yozuv qoldirdi. Return qo'shilsa, tokensiz ulanish yozilmaydi. Demak, ulanishni yopgan satrdan keyin funksiya return bilan to'xtashi kerak.",
  "okShort": "5-satrdan keyin <code>return</code> yo'q — funksiya davom etdi, <code>ulandi: o'yinchi null</code>.",
  "hint": "Ulanish yopilgandan keyin qaysi satrlar baribir ishladi?",
  "task": "Qoida: token yaroqsiz bo'lsa, ulanish yopiladi va funksiya <b>shu yerda to'xtaydi</b>. Bu kodda tokensiz ulanish yopildi, lekin Backend terminalida <code>ulandi: o'yinchi null</code> chiqdi. <b>Funksiya to'xtashi kerak bo'lgan satrni bosing.</b>"
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · holat",
  "title": "Ulangan · Ulanmoqda · Ulanmagan — farq active da",
  "seg": [
   [
    "a",
    "Doimiy ulanish ham uziladi — ilova <b>uch holatni</b> ko'rsatadi",
    "Ulanish ochildi va token tekshirildi. Lekin u doim ochiq turadimi? Yo'q: internet yo'qoladi, Backend qayta ishga tushadi. Shuning uchun ilovada belgi bor va u uch holatni ko'rsatadi."
   ],
   [
    "b",
    "Ulangan — hodisalar keladi; ulanmoqda — socket.io <b>o'zi qayta urinmoqda</b>",
    "Ulangan: yo'l ochiq, hodisalar keladi. Ulanmoqda: yo'l yo'q, lekin socket io o'zi qayta urinyapti. O'quvchi kodi buni active qiymatidan biladi."
   ],
   [
    "c",
    "Ulanmagan — <b>hech kim urinmayapti</b>: Backend yopgan yoki ilova o'zi yopgan",
    "Ulanmagan: hech kim urinmayapti. Backend yopgan, masalan token yaroqsiz, yoki ilovaning o'zi yopgan, masalan hisobdan chiqilgan."
   ],
   [
    "d",
    "Xulosa: «Ulanmoqda» — o'tib ketadi; «Ulanmagan» — <b>kimdir nimadir qilishi kerak</b>",
    "Xulosa: ulanmoqda o'tib ketadigan holat, kutish kifoya. Ulanmagan esa harakat talab qiladi: qayta kirish yoki tokenni yangilash."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · holat",
  "title": "transport close → «Ulanmoqda»: urinish har 5 soniya, Backend yongach o'zi «Ulangan»",
  "seg": [
   [
    "a",
    "Backend'da Ctrl+C: klientda <b><code>transport close</code></b>, <code>active=true</code> — belgi «Ulanmoqda»",
    "Uch holatni nazariyada ko'rdik, endi ulanmoqda holatini haqiqiy chaqiramiz. Backend terminalida Ctrl C bosdik. Klient darhol sezdi: transport close, active true. Belgi ulanmoqda."
   ],
   [
    "b",
    "socket.io o'zi qayta urinadi: avval tez, keyin <b>har 5 soniyada</b>",
    "Keyin socket io o'zi qayta urinadi: avval bir-ikki soniyada, keyin har besh soniyada. Har urinishda connect error, lekin belgi ulanmoqda'da qoladi."
   ],
   [
    "c",
    "Backend yondi — keyingi urinishda o'zi «Ulangan»: <b>5 soniyagacha kechikadi</b>",
    "Backend qayta yondi, klient esa keyingi urinishda o'zi ulandi. Hech kim hech narsa bosmadi. Faqat kechikish bor: Backend tayyor bo'lgach, besh soniyagacha."
   ],
   [
    "d",
    "Xulosa: Backend qayta yonsa, <b>ilova o'zi qaytadi</b> — bir necha soniya sariq normal",
    "Xulosa: Backend qayta ishga tushsa, ilova o'zi qaytadi. O'quvchi belgi bir necha soniya sariq turdi desa, bu xato emas: navbatdagi urinishni kutyapti."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · holat",
  "title": "Javob yo'q, ulanish yopilmagan — socket.io buni 45 soniyada sezdi",
  "seg": [
   [
    "a",
    "O'quvchi darsida telefonda uchish rejimi yoqiladi — belgi <b>darhol o'zgarmasligi mumkin</b>",
    "Backend o'chganda klient darhol sezdi. Uchish rejimida esa unday emas. O'quvchi darsi ogohlantiradi: belgi darhol o'zgarmasligi mumkin, bir daqiqagacha. Nega? Sinab ko'rdik."
   ],
   [
    "b",
    "Ulanish yopilmasa, klient faqat <b>«ping» javobi</b> kelmaganidan biladi",
    "Backend'ni muzlatdik: ulanish yopilmadi, faqat javob kelmaydi. Uchish rejimida ham shunday. Klient buni faqat ping javobi kelmaganidan biladi."
   ],
   [
    "c",
    "45 soniyada <b><code>ping timeout</code></b>: 25 soniya oraliq va 20 soniya kutish",
    "Natija: qirq besh soniyada ping timeout. Socket io standarti: yigirma besh soniya oraliq va yigirma soniya kutish. Backend qaytgach esa darhol ulangan."
   ],
   [
    "d",
    "Xulosa: «uchish rejimi» belgisi <b>45 soniyagacha</b> kech qoladi — bu normal",
    "Xulosa: uchish rejimida belgi qirq besh soniyagacha kech qoladi. O'quvchi «belgi o'zgarmadi» desa, bir daqiqa kutishni ayting."
   ]
  ]
 },
 "12": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "Token yaroqsiz, Backend ulanishni yopdi. Belgi qaysi holatda qoladi?",
  "q": "Uch holatni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. Token yaroqsiz, Backend ulanishni yopdi. Ilovadagi belgi qaysi holatda qoladi? Variantni tanlang.",
  "ok": "To'g'ri, ulanmagan. Backend o'zi yopgan ulanishga socket io qayta urinmaydi, active qiymati false bo'ladi. O'quvchi qayta kirib, yangi token olishi kerak. Demak, Backend o'zi yopgan ulanish o'z-o'zidan tiklanmaydi.",
  "okShort": "Ulanmagan — <code>io server disconnect</code>, <code>active=false</code>.",
  "hint": "Ulanishni kim yopdi — Backend'mi yoki tarmoq?",
  "correct": 2,
  "opts": [
   "Ulangan",
   "Ulanmoqda — ilova o'zi qayta urinadi",
   "Ulanmagan — Backend yopgan ulanishga qayta urinilmaydi",
   "Belgi yo'qoladi"
  ],
  "wrong": {
   "0": "Bir lahza bo'ladi, keyin yopiladi (6-ekran).",
   "1": "Bu Backend o'chganda (10-ekran).",
   "3": "Belgi doim bor — uch holatdan biri."
  }
 },
 "13": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Backend'ni to'xtating va yoqing — klient nima deydi",
  "seg": [
   [
    "a",
    "Endi siz: Backend'ni <b>o'zingiz to'xtatib</b>, klientning holatlarini kuzatasiz",
    "Holatlarni ekranda ko'rdingiz, endi ularni o'zingiz chaqirasiz. O'n daqiqa. Bir terminalda Backend, ikkinchisida klient."
   ],
   [
    "b",
    "1–2-qadam: klient ulangan; Backend'ni <b>Ctrl+C</b> bilan to'xtating — «ulanmoqda»",
    "Birinchi: klientni token bilan yoqing, ulangan. Ikkinchi: Backend terminalida Ctrl C. Klientda ulanmoqda va sababini o'qing."
   ],
   [
    "c",
    "3–4-qadam: Backend'ni yoqing — o'zi «ulangan»; isbot — <b>uzilish sababi</b>",
    "Uchinchi: Backend'ni qayta yoqing, klient o'zi ulanadi. To'rtinchi: tokensiz sinab ko'ring, ulanmagan. Isbot maydoniga ikkinchi qadamdagi uzilish sababini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz Backend o'chganda va qayta yonganda klient qanday holatlardan o'tishini o'z ko'zingiz bilan ko'rgan bo'lasiz."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · hodisa",
  "title": "oyin-ozgardi { oyinId, sabab }: nima o'zgardi — son esa qayta so'raladi",
  "seg": [
   [
    "a",
    "Repo'ning keyingi tegida Backend o'zi hodisa yuboradi: <b><code>oyin-ozgardi</code></b>",
    "Ulanish tayyor, endi undan nima keladi. O'quvchi repo'sining keyingi tegida Backend hodisa yuboradi: oyin ozgardi. Vali qo'shildi, Ali'ga darhol keldi."
   ],
   [
    "b",
    "Konvertda faqat <code>oyinId</code> va <code>sabab</code> — <b>yangi son yo'q</b>",
    "Hodisa ichida faqat ikki narsa: qaysi o'yin va sabab, qo'shildi. Yangi son yo'q. O'quvchi darsi buni konvert deydi: ichida son yo'q."
   ],
   [
    "c",
    "Ali hodisani olgach <b>o'zi qayta so'radi</b>: 6 / 10 dan 7 / 10",
    "Ali hodisani olgach o'zi qayta so'radi va yettini oldi. Qiziq tomoni: hodisa Valining o'z javobidan ham oldin yetib keldi."
   ],
   [
    "d",
    "Xulosa: hodisa «nima o'zgardi» deydi — haqiqiy son Backend'dan <b>qayta olinadi</b>",
    "Xulosa: hodisa faqat nima o'zgarganini aytadi, haqiqiy son Backend'dan qayta olinadi. Shunda ikki kishi birdan qo'shilsa ham son adashmaydi."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · hodisa",
  "title": "O'quvchi darsi bugun faqat ulanish va belgini yozadi — hodisa yuborilmaydi",
  "seg": [
   [
    "a",
    "<code>m12-dars-02-done</code> gateway izohi: <b>«hozircha hech qanday hodisa yuborilmaydi»</b>",
    "Hodisani m12 dars uch tegida ko'rdik. Lekin ehtiyot bo'ling: o'quvchi darsining tayyor holati m12 dars ikki done. U yerda gateway izohi aniq: hozircha hech qanday hodisa yuborilmaydi."
   ],
   [
    "b",
    "O'quvchi tinglovchini <b>namuna oynada</b> yozadi — u yerda hodisani tugma yuboradi",
    "O'quvchi darsida tinglovchi yoziladi: ulanish on, oyin ozgardi. Lekin bu namuna oynada, u yerda hodisani tugma yuboradi, haqiqiy Backend emas."
   ],
   [
    "c",
    "O'quvchi telefonida bugun son o'zi o'zgarmaydi — <b>bu xato emas</b>",
    "Shuning uchun bugun o'quvchi telefonida son o'zi o'zgarmaydi, faqat belgi. O'quvchi «ekran yangilanmadi» desa, bu xato emas: hodisa repo'ning keyingi tegida qo'shiladi."
   ],
   [
    "d",
    "Xulosa: bugungi natija — <b>ulanish va belgi</b>; hodisa — m12-03 tegida",
    "Xulosa: bugungi o'quvchi natijasi ulanish va belgi. Hodisa m12 dars uch tegida. Ikkalasini ham o'zingiz yurgizib ko'rdingiz."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "Ali'ga oyin-ozgardi {\"oyinId\":2,\"sabab\":\"qoshildi\"} keldi. Ilova keyin nima qiladi?",
  "q": "Hodisani ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Ali'ga oyin ozgardi keldi: o'yin ikki, sabab qo'shildi. Ilova keyin nima qiladi? Variantni tanlang.",
  "ok": "To'g'ri. Hodisada son yo'q, ilova uni Backend'dan qayta so'raydi. O'zi bittaga oshirsa, ikki kishi birdan qo'shilganda son adashadi. Demak, hodisa faqat nima o'zgarganini aytadi, yangi sonni ilova Backend'dan oladi.",
  "okShort": "Qayta so'raydi: son Backend'dan, hodisadan emas.",
  "hint": "Konvert ichida son bormi?",
  "correct": 0,
  "opts": [
   "GET /oyinlar bilan sonni qayta so'raydi",
   "Sonni o'zi bittaga oshiradi",
   "Butun sahifani qayta yuklaydi",
   "Keyingi hodisani kutadi"
  ],
  "wrong": {
   "1": "Ikki kishi birdan qo'shilsa adashadi.",
   "2": "Faqat son so'raladi.",
   "3": "Bu hodisada ham son yo'q."
  }
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "m12-dars-03-done: Vali qo'shilsa — Ali'ga hodisa keladi",
  "seg": [
   [
    "a",
    "Endi siz: repo'ning keyingi tegida hodisani <b>o'z ko'zingiz bilan</b> ko'rasiz",
    "Hodisa kelgach ilova nima qilishini bildingiz. Oxirgi amaliyot: repo'ning keyingi tegida hodisani o'z ko'zingiz bilan ko'rasiz. O'n daqiqa."
   ],
   [
    "b",
    "1–2-qadam: <b><code>m12-dars-03-done</code></b>, <code>npm ci</code> va start; Vali uchun ikkinchi akkaunt",
    "Birinchi: m12 dars uch done tegiga o'ting, npm ci va start. Ikkinchi: Vali uchun ikkinchi akkaunt, ro'yxat va kirish."
   ],
   [
    "c",
    "3–4-qadam: Ali ulanadi, Vali qo'shiladi; isbot — <b>hodisa satri</b>",
    "Uchinchi: Ali'ni klient bilan ulang. To'rtinchi: Vali bilan bitta o'yinga qo'shiling. Isbot maydoniga Ali'ga kelgan hodisa satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz bir o'yinchi qo'shilganda ikkinchisiga hodisa qanday kelishini o'z terminalingizda ko'rgan bo'lasiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m10-02 · «WebSocket: ekran o'zi yangilanadigan ulanish»",
  "title": "m10-02: yo'l, konvert, belgi va sxema",
  "seg": [
   [
    "a",
    "m10-02 — <b>20 ekran</b>: Maydon Jamoa, yo'l, konvert va belgi",
    "O'zingiz hammasini yurgizdingiz, endi o'quvchi darsi: m10-02, yigirma ekran. Maydon Jamoa misoli: yopiq va ochiq yo'l, konvert, token bilan ulanish, tinglovchi, belgi va real vaqt sxemasi."
   ],
   [
    "b",
    "Darsning <b>og'ir qismi</b> — 9-ekran kod oynasi va A1: Backend, ilova va Render",
    "O'quvchi darsi o'zi ogohlantiradi: og'ir qism to'qqizinchi ekrandagi kod oynasi va birinchi amaliyot: Backend, ilova va Render. Ikkinchi, to'rtinchi, beshinchi ekranlarga ortiqcha vaqt bermang."
   ],
   [
    "c",
    "A1 da Render uyg'onishi va uchish rejimi kechikadi — <b>oldindan ayting</b>",
    "Birinchi amaliyotda ikki kechikish bor. Render'ning bepul xizmati uxlagan bo'lsa, birinchi ulanish cho'ziladi. Uchish rejimida belgi qirq besh soniyagacha kech qoladi. Oldindan ayting."
   ],
   [
    "d",
    "Xulosa: vaqt — <b>A1 ga ko'proq</b>; belgi va ulanish ishlasa, dars maqsadi bajarilgan",
    "Xulosa: vaqtning ko'pini birinchi amaliyotga bering. Belgi ulangan ko'rsatsa va uchish rejimida o'zgarsa, darsning maqsadi bajarilgan."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · o'quvchi darsini o'tish",
  "title": "README «Real vaqt»: besh ustun — nuqta, kim nima qiladi, hodisa, kim oladi, ekranda",
  "seg": [
   [
    "a",
    "O'quvchi ikkinchi amaliyotda o'z mahsuloti uchun <b>shu jadvalni</b> yozadi",
    "Xaritada oxirgi blok sxema edi, uni ochamiz. Ikkinchi amaliyotda o'quvchi o'z mahsuloti uchun shu jadvalni yozadi. Maydon Jamoa'dagi namuna besh qator."
   ],
   [
    "b",
    "Har qator: qaysi joy, kim nima qiladi, qaysi hodisa, kim oladi, <b>ekranda nima o'zgaradi</b>",
    "Har qatorda besh ustun: real vaqt nuqtasi, kim nima qiladi, hodisa nomi va sababi, kim oladi va ekranda nima o'zgaradi. Bitta hodisa, besh xil sabab."
   ],
   [
    "c",
    "Hodisa nomi — kichik harf va chiziqcha, <b>bo'lib o'tgan ish</b>: <code>oyin-ozgardi</code>",
    "Kurs qoidasi: hodisa nomi kichik harf va chiziqcha bilan, bo'lib o'tgan ish ma'nosida: oyin ozgardi. O'quvchi «o'yinni yangila» deb yozsa, shu qoidani eslating."
   ],
   [
    "d",
    "Xulosa: sxema — reja; repo m12-03 da hodisalar <b>aynan shu jadvaldagidek</b> yuboriladi",
    "Xulosa: sxema reja. Repo'ning keyingi tegida Backend aynan shu besh sabab bilan hodisa yuboradi, buni o'n to'rtinchi ekranda ko'rdingiz."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "5-bosqich · sinfda",
  "title": "Yo'l, konvert, belgi — va olti holat",
  "seg": [
   [
    "a",
    "O'quvchi darsi yo'l va konvert deydi — siz <b>atamani birga</b> aytasiz",
    "Xaritani ko'rdingiz. Endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz: yopiq va ochiq yo'l, konvert, belgi va tinglovchi. O'quvchi shu so'zni aytganda, siz yonida atamasini ham ayting: ochiq yo'l bu doimiy ulanish, konvert esa hodisa."
   ],
   [
    "b",
    "Uch holat <b>belgidan taniladi</b>: kulrang, sariq-yashil, o'zgarmagan belgi",
    "Endi sinfda uchraydigan olti holatni ko'ramiz. Birinchi uchtasini ilovadagi belgidan tanish mumkin. Belgi bir lahza yashil bo'lib, keyin kulrang bo'lsa, Backend tokenni qabul qilmagan va o'quvchi qayta kirishi kerak. Belgi sariqdan yashilga o'tsa, Backend qayta yongan, bu normal. Uchish rejimida belgi darrov o'zgarmasa, qirq besh soniyagacha kuting."
   ],
   [
    "c",
    "Qolgan uchtasi: son o'zgarmadi, Render cho'zildi, <b>«o'yinchi null»</b>",
    "To'rtinchi holat: son o'zi o'zgarmadi. Bu xato emas, o'quvchining shu darsida hodisa hali qo'shilmagan. Beshinchi holat: birinchi ulanish uzoq cho'zildi, chunki Render'dagi server uxlab qolgan, bir daqiqa kuting. Oltinchi holat: Backend terminalida o'yinchi null chiqdi, sababi kodda return yo'q, buni sakkizinchi ekranda ko'rgansiz."
   ],
   [
    "d",
    "Xulosa: avval belgiga, keyin <b>Backend terminaliga</b> qarang — sabab shu ikkisida",
    "Xulosa va usul: avval belgiga, keyin Backend terminaliga o'quvchi bilan birga qarang. Sabab deyarli doim shu ikkisidan birida ko'rinadi. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "21": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "So'rov–javobda Vali qo'shilsa, Ali'ning soni?",
    "o": [
     "so'ramaguncha eski",
     "o'zi yangilanadi",
     "xato chiqadi",
     "nol bo'ladi"
    ],
    "c": 0,
    "e": "Yo'l faqat so'rovda ochiladi.",
    "s": 2
   },
   {
    "q": "Token qachon tekshiriladi?",
    "o": [
     "har hodisada",
     "ulanish ochilayotganda",
     "har daqiqada",
     "hech qachon"
    ],
    "c": 1,
    "e": "handleConnection.",
    "s": 5
   },
   {
    "q": "Tokensiz ulanishda klient nima ko'radi?",
    "o": [
     "hech narsa",
     "faqat ulangan",
     "bir lahza ulangan, keyin io server disconnect",
     "ping timeout"
    ],
    "c": 2,
    "e": "Ulanish ochiladi va yopiladi.",
    "s": 6
   },
   {
    "q": "Backend o'chsa belgi?",
    "o": [
     "ulangan",
     "ulanmagan",
     "yo'qoladi",
     "ulanmoqda — o'zi qayta urinadi"
    ],
    "c": 3,
    "e": "transport close, active=true.",
    "s": 10
   },
   {
    "q": "«Uchish rejimi»ni socket.io qachon sezadi?",
    "o": [
     "~45 s (ping)",
     "darhol",
     "5 daqiqa",
     "hech qachon"
    ],
    "c": 0,
    "e": "25 s + 20 s.",
    "s": 11
   },
   {
    "q": "Token yaroqsiz, Backend yopdi — belgi?",
    "o": [
     "ulanmoqda",
     "ulanmagan",
     "ulangan",
     "sariq"
    ],
    "c": 1,
    "e": "active=false.",
    "s": 12
   },
   {
    "q": "oyin-ozgardi ichida nima bor?",
    "o": [
     "yangi son",
     "butun ro'yxat",
     "oyinId va sabab",
     "token"
    ],
    "c": 2,
    "e": "Son qayta so'raladi.",
    "s": 14
   },
   {
    "q": "m12-dars-02-done da Vali qo'shilsa Ali'ga?",
    "o": [
     "hodisa",
     "xato",
     "yangi son",
     "hech narsa — hodisa hali yo'q"
    ],
    "c": 3,
    "e": "Hodisa m12-03 da.",
    "s": 15
   }
  ]
 },
 "22": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};
