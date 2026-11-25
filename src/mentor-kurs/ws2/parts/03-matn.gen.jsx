
// ============================================================
//  WebSocket-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/ws2-matn.py (manba: 21-WS2-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · WebSocket",
  "title": "Panel «o'zi yangilanadi» deydi. Server qayta yonsa yoki tarmoq uzilsa ham shundaymi? Bugun buzib tekshiramiz va tuzatamiz",
  "seg": [
   [
    "a",
    "Server qayta yondi — <b>server o'chiq paytda berilgan buyurtma ham panelda</b>",
    "Assalomu alaykum. Oldingi darsda OrderBotNest'ga jonli panel qildik. Bugun undan qiyinroq savol: server qayta yonsa yoki tarmoq uzilsa, panel hamma buyurtmani ko'rsatadimi? Ekranda dars oxiridagi natija: server o'chiq paytda berilgan buyurtma ham sariq bo'lib chiqqan."
   ],
   [
    "b",
    "Avval <b>umumiy tushuncha</b>: socket.io nimani o'zi tiklaydi, nimani yo'q",
    "Avval umumiy tushuncha: socket.io qayta ulanishda nimani o'zi tiklaydi va nimani tiklamaydi. Keyin panelning o'zi yangilanadi degan gapini da'vo deb olamiz va uni ataylab buzamiz, buzish yozuvi bilan."
   ],
   [
    "c",
    "Keyin <b>takror tinglovchi, tarmoq va tiklash</b>; oxirida AI va sinf",
    "Uchinchi bosqichda tuzatishdagi tuzoqni ko'ramiz: bitta hodisaga bir necha so'rov. To'rtinchisida tarmoq uzilishi va socket.io'ning tiklash sozlamasi. Beshinchisida ikki AI tuzatishini haqiqiy bazada sinaymiz. Oxirida sinfga tayyorgarlik."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot; kerak: <b>WebSocket-1 dagi panel, bot va Postgres</b>",
    "Dars olti bosqich, uchta amaliyot. Oldingi darsdagi OrderBotNest nusxangiz kerak: panel, bot tokeni va Postgres. Buzishni o'z noutbukingizda, brauzer va telefon bilan qilasiz. Shoshilmang, har ekranni boshidan eshitish mumkin. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "socket.io ulanishni o'zi tiklaydi — lekin bu yangi ulanish. Uzilish paytida yuborilgan hodisa unga kelmaydi: server hodisani faqat hozir ulanganlarga beradi",
  "seg": [
   [
    "a",
    "Qayta ulanish — <b>socket.io'ning tayyor xizmati</b>: uzildi, urinadi, o'zi ulanadi",
    "Oldingi darsda ko'rgansiz: server o'chsa klient transport close, keyin bir necha marta xhr poll error, server yongach o'zi connect. Hech kim hech narsa bosmadi. Ekranda bugungi tajribadan o'sha terminal. Savol: uzilish paytida nima bo'lgan edi?"
   ],
   [
    "b",
    "Lekin bu <b>yangi ulanish</b>: uzilish paytidagi hodisa unga kelmaydi",
    "Qayta ulanish bu yangi ulanish. Server order changed'ni faqat hozir ulangan panellarga yuboradi va hech qayerda saqlamaydi. Uzilish paytida buyurtma tushsa, hodisa hech kimga yetmaydi. Panel qayta ulanadi, belgi yashil, lekin ro'yxat eski qoladi."
   ],
   [
    "c",
    "Tiklanadi: <b>ulanish va tinglovchilar</b>; tiklanmaydi: o'tib ketgan hodisa va serverdagi xona",
    "Nima tiklanadi: ulanishning o'zi, token har ulanishda qayta yuboriladi, tinglovchilar klientda turadi. Nima tiklanmaydi: uzilish paytidagi hodisa va serverning shu ulanishga bog'lagan narsasi, masalan xona. Xonani o'quvchi darsida ko'ramiz."
   ],
   [
    "d",
    "Xulosa: ro'yxat <b>bazada</b>; har qayta ulanishda panel uni qayta so'rashi kerak",
    "Xulosa: hodisa faqat nimadir o'zgardi deydi, haqiqiy ro'yxat bazada. Uzilishdan keyin panel nima o'tkazib yuborganini bilmaydi, demak ro'yxatni qayta so'rashi kerak. Hozirgi panel buni qilmaydi. Buni isbotlash uchun avval uni buzamiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "README: «ro'yxat o'zi yangilanadi». Bu da'vo — tekshirilmagan. Tekshiruv — buzib ko'rish va har urinishni to'rt ustunli yozuv bilan qayd qilish",
  "seg": [
   [
    "a",
    "README <b>«o'zi yangilanadi»</b> deydi — oddiy holatda to'g'ri, chekka holatda tekshirilmagan",
    "OrderBotNest README'sida yozilgan: ro'yxat o'zi yangilanadi. Oddiy holatda bu to'g'ri, oldingi darsda ko'rdik. Lekin server qayta yonsa yoki tarmoq uzilsa? Bu tekshirilmagan. O'quvchi darsida bunday gap da'vo deyiladi: aytilgan, isbotlanmagan."
   ],
   [
    "b",
    "Buzish yozuvi: <b>nima qildim · nima kutdim · nima bo'ldi → belgi</b>",
    "Tekshiruv bu buzib ko'rish. Har urinish bir qator: qaysi usul, nima qildim, nima kutdim, nima bo'ldi va belgi: buzildi yoki buzilmadi. Nima bo'ldi ustuniga taxmin emas, ekranda ko'rgan narsa yoziladi. O'quvchi darsidagi BUZISH fayli aynan shu ustunlar."
   ],
   [
    "c",
    "Panel uchun <b>uch usul</b>: server qayta yonadi, brauzer Offline, tarmoq uziladi",
    "Panel uchun uch usul. Birinchisi: server qayta ishga tushadi, deploy yoki xato. Ikkinchisi: brauzerning tarmog'i o'chadi, buni DevTools bilan qilasiz. Uchinchisi: panel boshqa kompyuterda, ular orasidagi tarmoq uziladi. Har birida o'sha paytda buyurtma tushadi."
   ],
   [
    "d",
    "Xulosa: belgi <b>shu kompyuterda, shu urinishda</b> — «buzilmadi» isbot emas",
    "Xulosa: buzildi belgisi muammo borligini ko'rsatadi. Buzilmadi esa faqat shu kompyuterda, shu urinishda degani, isbot emas. Bugun shunday urinishni ko'rasiz: xato bor, lekin o'sha safar yuz bermagan. Birinchi usuldan boshlaymiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "2-bosqich · yo'qolgan buyurtma",
  "title": "Panel va terminal klienti ochiq; server to'xtadi; o'chiq paytda Bobur botga yozgan; server yondi — belgi «Ulangan», ro'yxatda faqat #1, bazada esa #2 bor",
  "seg": [
   [
    "a",
    "Panel ochiq, <b>#1 ko'rindi</b>; server terminalida Ctrl+C — belgi «Ulanmoqda…»",
    "Tajriba haqiqiy server, baza va brauzerda. Panel ochiq, Bobur birinchi buyurtmani berdi, panelda birinchi qator chiqdi. Endi server terminalida Ctrl C. Panel darhol ulanmoqda, ro'yxat ekranda qoladi. Shu payt Bobur botga yana buyurtma yozdi."
   ],
   [
    "b",
    "Server yondi — <b>bot navbatdagi buyurtmani darhol bajardi</b>: <code>Buyurtma #2 qabul qilindi!</code>",
    "Serverni qayta yoqdik. Server logiga qarang: ishga tushishi bilan bot Bobur yozgan xabarni bajardi, buyurtma ikki qabul qilindi. Panel ulandi satri esa undan keyin. Ya'ni hodisa yuborilgan paytda hech qaysi panel ulanmagan edi."
   ],
   [
    "c",
    "Panel: <b>belgi «Ulangan», ro'yxatda faqat #1</b>; terminal klientida ham hodisa yo'q",
    "Panelga qarang: belgi ulangan, yashil. Ro'yxatda esa faqat birinchi buyurtma. Terminal klienti ham qayta ulandi, lekin order changed kelmadi. Admin ekranga ishonadi va ikkinchi buyurtmani ko'rmaydi. Sahifani yangilasa chiqadi, lekin admin buni bilmaydi."
   ],
   [
    "d",
    "Xulosa: <b>bazada 2 ta, panelda 1 ta</b> — README'dagi da'vo buzildi",
    "Xulosa: bazada ikki buyurtma, panelda bitta, belgi esa hammasi joyida deydi. Bu eng yomon holat: xato ko'rinmaydi. Buzish yozuviga birinchi qator: server qayta yondi, kutdim ikkinchi buyurtma, bo'ldi faqat birinchi, belgi buzildi."
   ]
  ]
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · ichida",
  "title": "Server o'chiq paytda Telegram xabarni saqlab turadi; bot ishga tushishi bilan uni oladi. Panel esa 1–5 soniyada qayta urinadi — ko'pincha kech qoladi, ba'zan ulguradi",
  "seg": [
   [
    "a",
    "Server o'chiq paytda <b>Telegram xabarni saqlab turadi</b>; bot yongach birinchi ishi — navbat",
    "Nega shunday bo'ldi? Telegram server o'chiq paytdagi xabarlarni saqlab turadi. Telegram service faylida on module init ichida bot launch: bot ishga tushishi bilan navbatdagi xabarlarni oladi va darhol bajaradi. Bu bir soniyaga yetmaydi."
   ],
   [
    "b",
    "Panel esa <b>1–5 soniyada qayta urinadi</b> — hodisa ketganda u hali ulanmagan",
    "Panel esa uzilishdan keyin bir soniya, keyin ikki, to'rt, eng ko'pi besh soniya kutib qayta urinadi. Server yongan payt bilan panelning keyingi urinishi orasida bot buyurtmani bajarib, hodisani yuborib bo'ladi. Hodisa nolta panelga ketdi."
   ],
   [
    "c",
    "Ba'zan <b>panel ulguradi</b> — o'sha urinishda xato yuz bermaydi",
    "Lekin har safar emas. AI nusxasini sinaganimizda bir urinishda panel buyurtmadan oldin ulanib ulgurdi va hodisa oddiy yo'l bilan keldi. O'sha urinishda xato umuman yuz bermadi, demak u hech narsani tekshirmadi. Buyurtmachi aytgan ba'zan so'zi shu."
   ],
   [
    "d",
    "Demak, sabab: <b>hodisa vaqtga bog'liq</b>; ro'yxat esa bazada — uni vaqtdan qat'i nazar so'rash kerak",
    "Demak, sabab: hodisa kelishi vaqtga bog'liq, kim tezroq. Buni tezlik bilan yutib bo'lmaydi. Ro'yxat esa bazada, u vaqtga bog'liq emas. Panel ulanishi bilan uni qayta so'rasa, kim tez bo'lganining farqi qolmaydi. Avval yana bir usul: brauzer tarmog'ini o'chiramiz."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · yo'qolgan buyurtma",
  "title": "DevTools → Network → Offline: 6 soniyada belgi o'zgarmadi, hodisa Online'da keldi — buzilmadi. 60 soniyada — yarim daqiqadan keyin «Ulanmoqda…», Online'dan keyin ro'yxat eski — buzildi",
  "seg": [
   [
    "a",
    "Offline <b>DevTools'da bir tugma</b>: Network → No throttling o'rniga Offline",
    "Ikkinchi usulni o'z noutbukingizda qilasiz. Brauzerda F12, Network bo'limi, yuqoridagi No throttling ro'yxatidan Offline. Sahifaning tarmog'i o'chadi, server va bot esa ishlab turadi. Shu paytda telefondan buyurtma berasiz."
   ],
   [
    "b",
    "6 soniya: <b>belgi o'zgarmadi</b>, hodisa Online bo'lganda keldi — buzilmadi",
    "Birinchi urinish: olti soniya Offline, shu payt buyurtma. Belgi ulangan bo'lib turdi. Online qilgan zahoti order changed keldi va ro'yxat yangilandi. Brauzer ochiq ulanishni yopmadi, kadrni ushlab turdi. Belgi buzilmadi, faqat shu urinishda."
   ],
   [
    "c",
    "60 soniya: <b>yarim daqiqadan keyin «Ulanmoqda…»</b>; Online'da kechikkan kadr keldi, lekin tashlandi",
    "Ikkinchi urinish: bir daqiqa. O'ttiz uchinchi soniyada belgi ulanmoqda bo'ldi: ping kelmadi, klient ulanishni o'zi uzdi. Online qildik: kechikkan kadr brauzerga keldi, lekin socket.io uni yopilgan ulanishniki deb tashladi va yangidan ulandi. Ro'yxat so'ralmadi."
   ],
   [
    "d",
    "Xulosa: Offline <b>ping vaqtidan uzun bo'lsa buziladi</b> — 45 soniyadan ko'p kuting",
    "Xulosa: belgi ulangan, ro'yxatda birinchi, bazada ikkinchi ham bor. Buzildi. Ping qoidasini oldingi darsda ko'rgansiz: yigirma besh va yigirma. Amaliyotda Offline'ni belgi ulanmoqda bo'lguncha ushlab turing, aks holda buzilmadi chiqadi."
   ]
  ]
 },
 "7": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Server qayta yondi. Belgi «Ulangan». Bazada #2 bor, panelda yo'q, terminal klientiga ham order-changed kelmadi. Asosiy sabab nima?",
  "q": "Ikki usulda buzilishni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Server qayta yondi, belgi ulangan, bazada ikkinchi buyurtma bor, panelda yo'q. Server logida buyurtma panel ulanishidan oldin. Asosiy sabab nima? Variantni tanlang.",
  "ok": "To'g'ri. Server logida buyurtma ikki qabul qilindi, panel ulandi esa keyin. Order changed shu paytda ulangan panellarga ketdi, ular esa nol. Socket.io bunday hodisani saqlamaydi va qayta ulangan panelga bermaydi. Demak, belgi ulangan bo'lsa ham, uzilishdan keyingi ro'yxatga ishonib bo'lmaydi.",
  "okShort": "Hodisa 0 panelga ketdi — server saqlamaydi, qayta ulanganga bermaydi.",
  "hint": "Server logida «Buyurtma #2» va «panel ulandi» qaysi tartibda?",
  "demak": "Uzilish paytidagi hodisa yo'qoladi; qayta ulangan panel nimani o'tkazib yuborganini bilmaydi.",
  "correct": 1,
  "opts": [
   "Bot #2 ni bazaga yozmagan — tranzaksiya qaytarilgan",
   "Hodisa panel ulanmasdan oldin ketgan, server uni saqlamaydi",
   "Panel tokeni eskirgan, server hodisani rad etgan",
   "socket.io hodisani navbatga qo'ygan, keyingisi bilan keladi"
  ],
  "wrong": {
   "0": "Bazada 2 ta — buyurtma yozilgan (psql).",
   "2": "Token to'g'ri: panel ulandi, belgi «Ulangan».",
   "3": "Navbat yo'q: keyingi hodisa faqat o'zi keladi, eskisi bilan emas."
  }
 },
 "8": {
  "type": "Lesson",
  "kicker": "2-bosqich · yo'qolgan buyurtma",
  "title": "ws2-done: connect ichida yukla() — birinchi va har qayta ulanishda ro'yxat bazadan; alohida yukla() chaqiruvlari olib tashlandi. O'sha tajriba: #2 sariq",
  "seg": [
   [
    "a",
    "<code>admin.html</code>, <code>ulan()</code>: <b><code>connect</code> ichida <code>holatQoy</code> va <code>yukla()</code></b> — ikki satr",
    "Tuzatish kichik. Public papkasidagi admin html, ulan funksiyasi. Connect bo'lganda faqat belgini qo'yardik. Endi ichida yukla ham chaqiriladi. Connect birinchi ulanishda ham, har qayta ulanishda ham ishlaydi, demak har safar ro'yxat bazadan keladi."
   ],
   [
    "b",
    "Alohida <b><code>yukla()</code> chaqiruvlari olib tashlandi</b>: ro'yxat ikki joyda — <code>connect</code> va hodisa",
    "Kirish tugmasi va sahifa ochilishidagi alohida yukla chaqiruvlarini olib tashladik, aks holda ochilishda ro'yxat ikki marta so'raladi. Endi faqat ikki joy: connect va order changed. Noto'g'ri tokenda ham ishlaydi: bir lahza connect, so'rov, token noto'g'ri."
   ],
   [
    "c",
    "O'sha tajriba: <b>#2 sariq</b>; terminal klienti ham <code>GET … → 2 ta, eng yangisi #2</code>",
    "To'rtinchi ekrandagi tajribani tuzatilgan kodda qaytardik. Server yongach belgi ulangan va ro'yxatda ikkinchi buyurtma, sariq. Terminal klientiga ham shu qo'shildi: connect'dan keyin get admin orders, nechta va eng yangisi. Amaliyotda isbot shu satr bo'ladi."
   ],
   [
    "d",
    "Xulosa: <b>Offline 60 soniya ham</b> takrorlanmadi — bitta tuzatish ikki usulni yopdi",
    "Xulosa: bir daqiqalik Offline ham tuzatilgan kodda qaytarildi: Online'dan keyin ikkinchi buyurtma chiqdi. Buzish yozuvida ikkala qatorga: tuzatish qilindi, qayta tekshiruvda takrorlanmadi. Server kodi o'zgarmadi, testlar o'ttiz ikki, smoke to'qqizdan to'qqiz."
   ]
  ]
 },
 "9": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "ws2-start da panelni Offline bilan buzing (belgi «Ulanmoqda…» bo'lguncha), telefondan buyurtma bering; keyin ws2-done da xuddi shu usul bilan qayta tekshiring",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>ws2-start</code>, DevTools Offline va telefon</b> — o'z noutbukingizda",
    "Endi navbat sizga. OrderBotNest papkangizda ws2 start tegiga o'tasiz, panelni ochasiz va brauzer tarmog'ini o'chirasiz. Telefoningizdan botga buyurtma berasiz va Online qilasiz. Keyin ws2 done'da xuddi shunday. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>teg, server, panel; Offline — belgi «Ulanmoqda…» bo'lguncha</b>, keyin buyurtma",
    "Birinchi qadamda teg va server, brauzerda localhost uch ming admin. Ikkinchisida F12, Network, Offline va kuting: belgi ulanmoqda bo'lishi kerak, qirq besh soniyagacha. Shundan keyin telefondan buyurtma, Telegram'da buyurtma qabul qilindi chiqadi."
   ],
   [
    "c",
    "3–4-qadam: <b>Online — ro'yxatda yo'q</b>; <code>ws2-done</code> da qayta — chiqadi; isbot — buyurtma raqami",
    "Uchinchi qadamda Online: belgi ulangan, lekin yangi buyurtma ro'yxatda yo'q. Buzildi. To'rtinchisida ws2 done tegi, server qayta, xuddi shu usul: endi Online'dan keyin buyurtma sariq bo'lib chiqadi. Isbot maydoniga o'sha buyurtma raqamini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz panelning da'vosini o'zingiz buzgansiz va tuzatishni o'sha usul bilan tekshirgansiz."
   ]
  ],
  "steps": [
   {
    "t": "Teg va panel",
    "cmds": [
     "git fetch --tags",
     "git checkout ws2-start",
     "npm run start:dev",
     "brauzer: http://localhost:3000/admin"
    ],
    "exp": "belgi «Ulangan», ro'yxat"
   },
   {
    "t": "Offline",
    "cmds": [
     "F12 → Network → «No throttling» → «Offline»",
     "belgi «Ulanmoqda…» bo'lguncha kuting",
     "telefondan botga buyurtma"
    ],
    "exp": "Telegram: Buyurtma #… qabul qilindi!"
   },
   {
    "t": "Online",
    "cmds": [
     "«Offline» → «No throttling»"
    ],
    "exp": "belgi «Ulangan», yangi buyurtma ro'yxatda YO'Q (F5 bilan chiqadi)"
   },
   {
    "t": "Qayta tekshiruv",
    "cmds": [
     "git checkout ws2-done",
     "server qayta",
     "1–3-qadam yana"
    ],
    "exp": "Online'dan keyin yangi buyurtma sariq"
   }
  ],
  "proof": {
   "label": "ws2-done da Online'dan keyin chiqqan buyurtma raqami",
   "placeholder": "masalan: #7",
   "re": "#?\\s*\\d+",
   "flags": "",
   "wrong": "ws2-done da Online'dan keyin ro'yxatda chiqqan sariq qatorning raqamini yozing."
  },
  "trouble": [
   [
    "ws2-start da ham buyurtma chiqdi",
    "Offline qisqa bo'lgan — belgi «Ulanmoqda…» bo'lmaguncha buyurtma bermang (6-ekran: 6 s da buzilmaydi)"
   ],
   [
    "Belgi «Ulanmoqda…» bo'lmayapti",
    "Offline yoqilmagan yoki boshqa vkladkada — sahifaning o'z DevTools'ida yoqing; 45 s gacha kuting"
   ],
   [
    "Online'dan keyin ham «Ulanmoqda…»",
    "server to'xtagan — server terminalini tekshiring"
   ],
   [
    "ws2-done da ham ro'yxatda yo'q",
    "sahifa eski — server qayta ishga tushganmi, F5 bilan bir marta yangilang, keyin qayta sinang"
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · takror tinglovchi",
  "title": "Sodda «tuzatish»: hammasini connect ichiga. Birinchi ulanishda ishlaydi; har qayta ulanishdan keyin bitta hodisaga 2, keyin 3 GET — va sariq belgi yo'qoladi",
  "seg": [
   [
    "a",
    "Sodda tuzatish: <b>tinglovchi ham <code>connect</code> ichiga</b> — «har ulanishda hammasini sozlaymiz»",
    "Endi tuzatishdagi tuzoq. Sodda yo'l: har ulanishda hammasini qaytadan sozlaymiz, tinglovchini ham connect ichiga ko'chiramiz. Kod chiroyli ko'rinadi va birinchi ulanishda to'g'ri ishlaydi. Sinaymiz: server ikki marta qayta yonadi, har safar keyin bitta buyurtma."
   ],
   [
    "b",
    "Network: <b>bitta hodisaga 1, keyin 2, keyin 3 <code>GET</code></b>",
    "Brauzerning Network ro'yxatiga qarang. Birinchi buyurtmaga bitta get admin orders. Bir qayta ulanishdan keyin bitta buyurtmaga ikkita. Ikkinchi qayta ulanishdan keyin uchta. Har qayta ulanishda yana bitta tinglovchi qo'shilgan, hodisa bitta, ishlovchi uchta."
   ],
   [
    "c",
    "Ko'rinadigan belgi: <b>sariq qator yo'qoldi</b> — ikki javobdan ikkinchisi «yangi emas» deydi",
    "Bu faqat ortiqcha so'rov emas. Chapda xato nusxa: ikkinchi buyurtma sariq emas. O'ngda to'g'ri kod: sariq. Ikki so'rov bir vaqtda ketadi, birinchi javob qatorni yangi deb chizadi va eng katta raqamni eslaydi, ikkinchisi esa uni endi yangi emas deb chizadi."
   ],
   [
    "d",
    "Demak, sabab: <b><code>connect</code> har ulanishda ishlaydi</b> — tinglovchi bir marta, tashqarida",
    "Demak, sabab: connect birinchi ulanishda ham, har qayta ulanishda ham ishlaydi. Ichidagi on har safar yangi tinglovchi qo'shadi, eskisi o'chmaydi. Qoida: connect ichida faqat qayta so'rash, tinglovchi esa bir marta, tashqarida. Ws2 done'da shunday, izoh bilan."
   ]
  ]
 },
 "11": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Bu panelda server ikki marta qayta yongandan keyin bitta buyurtmaga uchta GET /admin/orders ketadi. Sababchi satrni toping",
  "q": "Tuzoqni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu panelda server ikki marta qayta yongandan keyin bitta buyurtmaga uchta so'rov ketadi. Bo'lakda bitta satr har ulanishda yangi tinglovchi qo'shadi. O'sha satrni bosing.",
  "ok": "To'g'ri. Bu satr connect ichida, connect esa har qayta ulanishda ishlaydi. Ikki qayta ulanishdan keyin uchta tinglovchi, bitta hodisaga uchta so'rov va sariq belgi yo'qoladi. Yukla chaqiruvining o'zi to'g'ri: qayta so'rash connect ichida bo'lishi kerak. Demak, connect ichidagi on, tuzoq.",
  "okShort": "<code>connect</code> ichidagi <code>ulanish.on(…)</code> — har qayta ulanishda yana bitta tinglovchi.",
  "hint": "connect ichida qaysi satr har safar yangi narsa qo'shadi, qaysi biri faqat bir ish qiladi?",
  "task": "Qoida: <code>connect</code> har qayta ulanishda ishlaydi — ichida faqat <b>bir martalik ish</b> bo'ladi. Bu bo'lakda bitta satr har ulanishda <b>yangi tinglovchi qo'shadi</b>. <b>O'sha satrni bosing.</b>"
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "Tinglovchini ataylab connect ichiga ko'chiring, serverni ikki marta qayta yoqing, bitta buyurtma bering va Network'da GET larni sanang; keyin qaytaring",
  "seg": [
   [
    "a",
    "Endi siz: <b>tinglovchini ataylab <code>connect</code> ichiga</b> ko'chirasiz va sanaysiz",
    "Endi navbat sizga. Ws2 done'dagi admin html'da tinglovchini ataylab connect ichiga ko'chirasiz, serverni ikki marta qayta yoqasiz va bitta buyurtma berasiz. Brauzerning Network ro'yxatida so'rovlarni sanaysiz. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>tinglovchini ko'chiring</b>, F12 → Network, filtr <code>orders</code>",
    "Birinchi qadamda order changed satrini connect ichiga, yukla'dan keyin ko'chirasiz va saqlaysiz. Ikkinchisida panelni qayta oching, F12, Network, filtrga orders deb yozing. Faqat get admin orders qatorlari qoladi."
   ],
   [
    "c",
    "3–4-qadam: <b>server ikki marta qayta, keyin bitta buyurtma</b> — nechta <code>GET</code>; isbot — son",
    "Uchinchi qadamda server terminalida ikki marta Ctrl C va qayta yoqish, har safar belgi ulangan bo'lguncha kuting. Keyin Network'ni tozalang va telefondan bitta buyurtma. To'rtinchisida sanang va kodni qaytaring. Isbot maydoniga so'rovlar sonini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz takror tinglovchini so'rovlar sonidan taniysiz."
   ]
  ],
  "steps": [
   {
    "t": "Buzish",
    "cmds": [
     "public/admin.html: ulanish.on('order-changed', () => yukla()); → connect ichiga, yukla(); dan keyin"
    ],
    "exp": "saqlandi"
   },
   {
    "t": "Network",
    "cmds": [
     "brauzer: panel → F5",
     "F12 → Network → filtr orders"
    ],
    "exp": "birinchi ochilishda bitta orders"
   },
   {
    "t": "Ikki qayta yonish",
    "cmds": [
     "server: Ctrl+C → npm run start:dev (×2, har safar belgi «Ulangan»)",
     "Network → 🚫 tozalash",
     "telefondan bitta buyurtma"
    ],
    "exp": "yangi qator chiqdi"
   },
   {
    "t": "Sanash va qaytarish",
    "cmds": [
     "Network'dagi orders soni",
     "git checkout -- public/admin.html"
    ],
    "exp": "3 ta GET; kod qaytdi"
   }
  ],
  "proof": {
   "label": "Bitta buyurtmadan keyingi GET /admin/orders soni",
   "placeholder": "masalan: 3",
   "re": "^\\D*3\\D*$",
   "flags": "",
   "wrong": "Ikki qayta yonishdan keyin bitta buyurtmaga nechta orders so'rovi ketdi? Uchta bo'lishi kerak — Network'ni buyurtmadan oldin tozalang."
  },
  "trouble": [
   [
    "2 ta GET",
    "server bir marta qayta yongan yoki ikkinchi safar belgi «Ulangan» bo'lishini kutmadingiz"
   ],
   [
    "1 ta GET",
    "sahifa eski kodda — admin.html saqlandimi; F5 bilan yangilang"
   ],
   [
    "Network'da orders yo'q",
    "filtr boshqa yoki Network ochilishidan oldingi so'rovlar — sahifani DevTools ochiq holda yangilang"
   ],
   [
    "Sariq belgi baribir bor",
    "so'rovlar ketma-ket qaytgan — sanash isbot uchun yetarli"
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · tarmoq va tiklash",
  "title": "Hayotda server Render'da, panel do'kon kompyuterida: ular orasidagi tarmoq uziladi, server va bot ishlayveradi. Proksi bilan modellashtirdik: ws2-start — ro'yxat bo'sh, ws2-done — #1",
  "seg": [
   [
    "a",
    "Haqiqiy do'konda <b>server Render'da, panel do'konda</b>: tarmoq ular orasida uziladi",
    "Uchinchi usul. Haqiqiy do'konda server Render kabi joyda, panel do'kon kompyuterida. Do'konda Wi-Fi uzilsa, server va bot ishlayveradi, mijozlar buyurtma beradi, panel esa tarmoqsiz. Buni oralig'iga proksi qo'yib modellashtirdik: proksini kesamiz."
   ],
   [
    "b",
    "<code>ws2-start</code>: tarmoq qaytdi — <b>«Ulangan», ro'yxat bo'sh</b>, bazada #1",
    "Eski kodda: tarmoq uzildi, belgi darhol ulanmoqda, chunki ulanish yopildi. Shu payt Bobur buyurtma berdi. Tarmoq qaytdi, belgi ulangan, ro'yxatda esa hali buyurtma yo'q. Bazada birinchi buyurtma bor. Xuddi server qayta yongandagi holat."
   ],
   [
    "c",
    "<code>ws2-done</code>: <b><code>connect</code> dan keyin <code>GET</code> — #1 ro'yxatda</b>",
    "Tuzatilgan kodda o'sha qadamlar: tarmoq qaytgach connect, darhol get admin orders va ro'yxatda birinchi buyurtma. Bitta tuzatish uchala usulni yopdi: server qayta yonishi, brauzer Offline va tarmoq uzilishi."
   ],
   [
    "d",
    "Xulosa: usul uch xil, <b>sabab bitta</b> — qayta ulanish yangi ulanish, hodisa o'tib ketgan",
    "Xulosa: usul uch xil, sabab bitta: qayta ulanish yangi ulanish va uzilish paytidagi hodisa o'tib ketgan. Bu tuzatish mijoz tomonda. Savol tug'iladi: server o'zi o'tkazib yuborilganini qayta bera olmaydimi? Socket.io'da shunday sozlama bor."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "Gateway'ga connectionStateRecovery — qisqa uzilishdan keyin o'tkazilgan hodisalar qayta keladi (recovered=true). Lekin klient oldin hodisa olmagan bo'lsa va server qayta yonganda — yo'q",
  "seg": [
   [
    "a",
    "socket.io sozlamasi: <b><code>connectionStateRecovery</code></b> — uzilgan ulanishning holatini 2 daqiqa saqlaydi",
    "Socket.io'da connection state recovery sozlamasi bor. Gateway dekoratoriga qo'shamiz, ikki daqiqa. Server uzilgan ulanishning holatini va shu vaqtda yuborilgan hodisalarni xotirada saqlaydi. Klient qaytib kelsa, socket recovered true va o'tkazilgan hodisalar keladi."
   ],
   [
    "b",
    "Tarmoq uzildi, shu payt #3 — qaytganda <b>#3 keldi, <code>recovered=true</code></b>, id o'sha",
    "Tajriba: klient ikkinchi buyurtma hodisasini oldi, keyin tarmoq uzildi, shu payt uchinchi buyurtma. Tarmoq qaytdi: avval order changed uch keldi, keyin connect, recovered true, ulanish raqami ham o'sha. Haqiqatan ishlaydi, panel qayta so'ramasa ham."
   ],
   [
    "c",
    "Lekin: <b>oldin hodisa olmagan klient</b> va <b>server qayta yonishi</b> — <code>recovered=false</code>",
    "Ikki holatda ishlamadi. Birinchisi: klient uzilishdan oldin hali birorta hodisa olmagan edi, recovered false, o'tkazilgan buyurtma kelmadi. Ikkinchisi: server qayta yondi, recovered false, navbatdagi buyurtma kelmadi. Saqlangan holat server xotirasida edi, server bilan yo'qoldi."
   ],
   [
    "d",
    "Xulosa: tiklash — <b>qo'shimcha</b>; <code>connect</code> da qayta so'rash — majburiy",
    "Xulosa: tiklash qisqa tarmoq uzilishida yordam beradi. Server qayta yonishi esa eng ko'p uchraydigan holat: deploy, xato. U yerda faqat qayta so'rash ishlaydi. Shuning uchun ws2 done'da gateway o'zgarmadi. Tiklashni qo'shsangiz, qayta so'rash baribir qoladi."
   ]
  ]
 },
 "15": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "Gateway'da connectionStateRecovery yoqilgan, panel connect da qayta so'ramaydi. Deploy: server qayta yondi, o'chiq paytda Bobur buyurtma bergan. Panel uni ko'radimi?",
  "q": "Tiklashni ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Gateway'da tiklash yoqilgan, panel esa connect'da qayta so'ramaydi. Deploy bo'ldi, server qayta yondi, o'chiq paytda Bobur buyurtma bergan. Panel uni ko'radimi? Variantni tanlang.",
  "ok": "To'g'ri. Tiklash uzilgan ulanishlarning holatini server jarayonining xotirasida saqlaydi. Server qayta yonganda jarayon yangi, xotira bo'sh: recovered false, navbatdagi buyurtma hodisasi qaytmaydi. Ikki daqiqa muddati bu yerda yordam bermaydi. Demak, deploy va xatodan keyin faqat qayta so'rash ishlaydi.",
  "okShort": "Holat server xotirasida — server qayta yonsa yo'qoladi: <code>recovered=false</code>.",
  "hint": "Tiklash ma'lumotni qayerda saqlaydi — bazada, faylda yoki jarayon xotirasida?",
  "demak": "Tiklash server xotirasida: deploy va qayta yonishdan keyin yo'q — qayta so'rash majburiy.",
  "correct": 2,
  "opts": [
   "Ha — tiklash o'tkazilgan hamma hodisani qaytaradi",
   "Ha, agar server 2 daqiqada yongan bo'lsa",
   "Yo'q — saqlangan holat server xotirasida edi",
   "Yo'q — tiklash faqat polling transportida ishlaydi"
  ],
  "wrong": {
   "0": "Faqat shu server jarayoni saqlagan hodisalarni; yangi jarayonda ular yo'q.",
   "1": "Muddat emas, xotira: jarayon yangi bo'lsa, bir soniyada yongan ham tiklamaydi.",
   "3": "Transportga bog'liq emas — 07 da websocket bilan tikladi."
  }
 },
 "16": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "ws2-done da terminal klientini oching, serverni qayta yoqing — qayta ulanishdan keyingi GET satrini toping; o'z BUZISH.md yozuvingizga uch urinishni yozing",
  "seg": [
   [
    "a",
    "Endi siz: <b>terminal klienti va o'z buzish yozuvingiz</b>",
    "Endi navbat sizga. Ws2 done'da terminal klientini ochib, serverni qayta yoqasiz va klient ro'yxatni qayta so'raganini ko'rasiz. Keyin o'z buzish yozuvingizni yozasiz: bugungi uch urinish. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b><code>npm run live</code>, server Ctrl+C va qayta</b> — <code>connect</code>, keyin <code>GET … → N ta</code>",
    "Birinchi qadamda ikkinchi terminalda npm run live: connect va get admin orders, nechta va eng yangisi. Ikkinchisida server terminalida Ctrl C, klientda transport close va xhr poll error, keyin server yoqiladi va yana connect, get satri."
   ],
   [
    "c",
    "3–4-qadam: <b><code>BUZISH.md</code> — uch qator</b>, <code>ws2-done</code> dagi namuna bilan solishtiring; isbot — <code>GET</code> satri",
    "Uchinchi qadamda o'z papkangizda BUZISH fayli: birinchi va ikkinchi amaliyotdagi urinishlar va bugungi qayta yonish. To'rtinchisida ws2 done'dagi namuna bilan solishtirasiz. Isbot maydoniga qayta ulanishdan keyingi get satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz qayta ulanishni terminaldan tekshirasiz va buzish yozuvini o'zingiz yozasiz."
   ]
  ],
  "steps": [
   {
    "t": "Klient",
    "cmds": [
     "git checkout ws2-done",
     "server",
     "ikkinchi terminal: npm run live"
    ],
    "exp": "connect · ulangan · GET /admin/orders → N ta, eng yangisi #…"
   },
   {
    "t": "Qayta yonish",
    "cmds": [
     "server: Ctrl+C",
     "5 s",
     "npm run start:dev"
    ],
    "exp": "klientda transport close → xhr poll error → connect → yana GET … → N ta"
   },
   {
    "t": "Yozuv",
    "cmds": [
     "BUZISH.md: №",
     "Usul",
     "Nima qildim",
     "Nima kutdim",
     "Nima bo'ldi",
     "Belgi — 3 qator"
    ],
    "exp": "uch qator, «Nima bo'ldi» da ko'rganingiz"
   },
   {
    "t": "Solishtirish",
    "cmds": [
     "git show ws2-done:BUZISH.md"
    ],
    "exp": "ustunlar bir xil, belgi «buzildi / buzilmadi»"
   }
  ],
  "proof": {
   "label": "Qayta ulanishdan keyingi GET satri",
   "placeholder": "masalan: 14:05:31 GET /admin/orders → 7 ta, eng yangisi #7",
   "re": "GET \\/admin\\/orders → \\d+ ta",
   "flags": "",
   "wrong": "Klient terminalida qayta connect dan keyingi GET /admin/orders → … ta satrini nusxalang."
  },
  "trouble": [
   [
    "connect bor, GET satri yo'q",
    "ws2-start dagi klient — git checkout ws2-done"
   ],
   [
    "GET /admin/orders → 401",
    "klient tokeni .env dagi ADMIN_PANEL_TOKEN bilan bir xil emas"
   ],
   [
    "connect_error: xhr poll error to'xtamaydi",
    "server ishga tushmadi — server terminalidagi xatoni o'qing"
   ],
   [
    "fetch is not defined",
    "Node 18 dan eski — node -v, kursdagi Node 24"
   ]
  ]
 },
 "17": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI",
  "title": "Ikki AI'ga buyurtmachining shikoyati, ishorasiz. Ikkalasi sababni to'g'ri topdi — connect da yukla() — va ikkalasi o'zicha «eski javob yangisini bosmasin» himoyasini qo'shdi",
  "seg": [
   [
    "a",
    "Yana AI bosqichi: <b>AI tuzatadi, siz qabul qilasiz</b> — shikoyat bilan, ishorasiz",
    "Beshinchi bosqich, AI. Ikki AI'ga buyurtmachining shikoyatini berdik, xuddi admin aytgandek: ba'zan yangi buyurtma ko'rinmaydi, belgi ulangan, sahifani yangilasam chiqadi. Connect ham, qayta so'rash ham aytilmagan. Kuchli va kuchsizroq model."
   ],
   [
    "b",
    "Prompt — <b>bir gap</b>: belgi «Ulangan», buyurtma yo'q, sahifani yangilasam chiqadi",
    "Prompt bitta gap, ekranda aynan. Sizga o'quvchi yoki do'kon egasi xuddi shunday yozadi. Bunday xabardan sababni topish uchun AI kodni o'qishi va qayta ulanish nima qilishini bilishi kerak."
   ],
   [
    "c",
    "Ikkalasi: <b><code>connect</code> da <code>yukla()</code></b> va o'zicha <b>so'rov raqami</b> — kech kelgan eski javob chizilmasin",
    "Ikkalasi sababni to'g'ri topdi va bizdagi tuzatishni yozdi: connect ichida yukla. Ikkalasi o'zicha yana bir himoya qo'shdi: so'rovga raqam, faqat oxirgisining javobi chiziladi. Ikki so'rov bir vaqtda ketsa, kech kelgan eski ro'yxat yangisini bosmasin. Tinglovchini hech biri connect ichiga ko'chirmadi."
   ],
   [
    "d",
    "Lekin ikkalasi <b>haqiqiy bazasiz</b> sinagan: biri JSON fayl bilan, biri jsdom'da",
    "Ikkalasi o'zi sinadi: birinchisi Chrome'da, baza o'rniga JSON fayl bilan, ikkinchisi brauzer o'rniga jsdom'da. Ikkinchisi sinov papkasini loyihadan tashqarida ochdi, shartda esa faqat shu papka edi. Endi ularni haqiqiy bazada, bizning tajriba bilan sinaymiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Haqiqiy PostgreSQL va brauzerda, buyurtma panel ulanishidan oldin: ikkalasida #2 sariq. Qabul — to'rt savol: qayerda so'raydi · tinglovchi nechta · xato haqiqatan yuz berdimi · nima ortiqcha qo'shildi",
  "seg": [
   [
    "a",
    "Haqiqiy bazada: <b>ikkalasida #2 sariq</b>, hodisa panelga kelmagan — tuzatish ishladi",
    "Ikkala AI nusxasini to'rtinchi ekrandagi tajriba bilan sinadik, haqiqiy Postgres va Chrome'da. Buyurtma ataylab panel ulanishidan oldin. Ikkalasida server yongach ikkinchi buyurtma sariq. Hodisa panelga kelmagan, demak ro'yxatni aynan qayta so'rash chiqardi."
   ],
   [
    "b",
    "So'rov raqami: <b>to'g'ri himoya</b>, lekin bizning tajribalarda bu holat chiqmadi",
    "Qo'shimcha himoya: har so'rovga raqam, javob kelganda raqam eng oxirgisi bo'lmasa, chizilmaydi. Mantiq to'g'ri, ortiqcha zarar yo'q. Lekin bizning tajribalarda javoblar tartibi buzilmadi, birinchi AI buni sekinlashtirilgan server bilan ko'rsatgan. Qabul qilsa bo'ladi, asosiy tuzatish emas."
   ],
   [
    "c",
    "Diqqat: <b>bir urinishda panel ulgurdi</b> — o'sha «o'tdi» hech narsani isbotlamaydi",
    "Eng muhim saboq. AI nusxasini birinchi sinaganimizda panel buyurtmadan oldin ulanib ulgurdi, hodisa oddiy yo'l bilan keldi. Ro'yxat to'g'ri edi, lekin xato umuman yuz bermagan. Eski kod ham o'tardi. Shuning uchun logda hodisa kelmaganini ko'rib, keyin qayta sinadik."
   ],
   [
    "d",
    "Xulosa: AI tuzatishiga <b>to'rt savol</b>: qayerda so'raydi · tinglovchi nechta · xato yuz berdimi · nima ortiqcha",
    "Xulosa: AI'ning qayta ulanish tuzatishiga to'rt savol. Ro'yxat connect'da so'raladimi. Tinglovchi bitta, tashqaridami. Sinovda xato haqiqatan yuz berdimi, ya'ni eski kod o'sha sinovda yiqilganmi. Va nima ortiqcha qo'shildi, kerakmi. Bu safar ikkalasi o'tdi."
   ]
  ]
 },
 "19": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "AI: «Sinadim — server qayta yondi, panel #2 ni ko'rsatdi». Panel logida qayta ulanishdan keyin kadr keldi … \"orderId\":2 bor. Bu sinov nimani isbotlaydi?",
  "q": "AI tuzatishlarini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. AI aytdi: sinadim, server qayta yondi, panel ikkinchi buyurtmani ko'rsatdi. Panel logida esa qayta ulanishdan keyin ikkinchi buyurtma hodisasi kelgan. Bu sinov nimani isbotlaydi? Variantni tanlang.",
  "ok": "To'g'ri. Hodisa kelgan bo'lsa, panel qayta ulanib ulgurgan va oddiy tinglovchi ro'yxatni yangilagan. Eski, tuzatilmagan kod ham shu sinovdan o'tardi. Sinov xatoni tekshirishi uchun eski kod unda yiqilishi kerak. Demak, avval eski kodda buzildi'ni ko'ring, keyin tuzatilganda takrorlanmadi'ni.",
  "okShort": "Hodisa kelgan — xato yuz bermagan; eski kod ham o'tardi. Sinov avval eski kodni yiqitsin.",
  "hint": "Shu sinovni tuzatilmagan kodda yurgizsak, natija boshqacha bo'larmidi?",
  "demak": "Sinov xatoni tekshiradi, agar eski kod unda yiqilsa; hodisa kelgan urinish — isbot emas.",
  "correct": 3,
  "opts": [
   "Tuzatish ishlaydi — panel #2 ni ko'rsatdi",
   "Xato tuzatilmagan — hodisa ikki marta kelgan, GET ham ikki",
   "Server o'zgargan — endi hodisa saqlanadi",
   "Hech narsani — bu urinishda xato yuz bermagan"
  ],
  "wrong": {
   "0": "Ko'rsatdi, lekin hodisa ham kelgan — eski kod ham ko'rsatardi.",
   "1": "Logda bitta kadr; GET soni oddiy.",
   "2": "Server kodiga tegilmagan — diff-stat: faqat admin.html (va README)."
  }
 },
 "20": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m10-05 · «Ulanish uzilsa: buzamiz va tuzatamiz»",
  "title": "O'quvchi darsi: agent «uchala chekka holatni bajardim» degan — o'quvchi Maydon Jamoa'da uch usul bilan buzadi, yozadi va tuzattiradi",
  "seg": [
   [
    "a",
    "m10-05 — 19 ekran: <b>agent «bajardim» degan</b> — o'quvchi buni da'vo deb tekshiradi",
    "Endi sinfga tayyorgarlik. O'quvchi darsi m10-05, o'n to'qqiz ekran. Maydon Jamoa'da agent uchala chekka holatni bajardim degan. O'quvchi buni da'vo deb oladi va uch usul bilan buzadi: internetni uzish, fonga olish va Backend'ning yangi versiyasi."
   ],
   [
    "b",
    "Uch muammo: <b>son eski · jonli xabar ikki marta · «Hozir ko'ryapti» kam</b>",
    "O'quvchi uchta muammoni topadi. Son eski: siz bugun ko'rgan uzilishdagi hodisa. Jonli xabar ikki marta: takror tinglovchi, o'quvchi kodida u boshidan connect ichida. Hozir ko'ryapti kam: xona. OrderBotNest'da bunday muammo yo'q, uni o'quvchi kodida ko'ramiz."
   ],
   [
    "c",
    "Bloklar: <b>og'ir joy — 9-ekran kod oynasi va ikki amaliyot</b>",
    "Bloklar jadvaliga qarang. Og'ir joy to'qqizinchi ekrandagi kod oynasi va ikki amaliyot. Uchinchi, beshinchi, yettinchi ekranlarga ortiqcha vaqt bermang. Har blokda siz qo'shadigan narsa o'ng ustunda: bugungi ekran raqami."
   ],
   [
    "d",
    "Xulosa: o'quvchi yozuvida <b>«Nima bo'ldi» — ko'rgani</b>, taxmin emas; vaqtning ko'pi amaliyotga",
    "Xulosa: vaqtning ko'pi ikki amaliyotga. O'quvchi yozuvida nima bo'ldi qatori ekranda ko'rgani bo'lsin, taxmin emas. Tuzatishdan keyin xuddi shu usul bilan qayta buzsin. Ikki teg: o'n ikkinchi modul beshinchi dars start va done."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "Ilova o'yin ekranini ochganda xonaga kiradi; uzilganda server uni hamma xonadan chiqaradi; qayta ulanish xonaga o'zi qaytmaydi — ikkinchi telefonda «Hozir ko'ryapti: 1»",
  "seg": [
   [
    "a",
    "Xona: ilova o'yin ekranini ochganda <b><code>oyin-ochildi</code></b> — server uni o'yin xonasiga qo'shadi",
    "Uchinchi muammo OrderBotNest'da yo'q, chunki bizning panel hammaga bitta hodisa oladi. Maydon Jamoa'da esa o'yin ekrani ochilganda ilova oyin ochildi yuboradi, server uni o'sha o'yin xonasiga qo'shadi. Hozir ko'ryapti soni xonadagi ulanishlar."
   ],
   [
    "b",
    "Uzilganda ulanish <b>hamma xonadan chiqadi</b>; qayta ulanish o'zi qaytmaydi — Vali'da «1»",
    "Backend yangi versiyasi chiqdi, Ali qayta ulandi. Lekin yangi ulanish hech qaysi xonada emas: eski ulanish bilan birga xonadan chiqib ketgan. Vali o'yinni ochdi va hozir ko'ryapti bir ko'rindi, ikki emas. Ikkinchi ekranda aytgan narsa: serverdagi xona tiklanmaydi."
   ],
   [
    "c",
    "Tuzatish <b><code>connect</code> ichida</b>: qayta so'rash va ochiq o'yin xonasiga qayta kirish",
    "O'quvchi loyihasidagi tuzatish ulanish ts faylida, connect ichida ikki ish: qayta so'rash va ochiq o'yin bo'lsa, xonaga qayta kirish. Tinglovchi esa tashqariga chiqarilgan. Natija: ikkala telefonda ikki. Backend o'zgarmagan."
   ],
   [
    "d",
    "Xulosa: <code>connect</code> ichida <b>faqat bir martalik ish</b>: qayta so'rash, xonaga qaytish; tinglovchi — tashqarida",
    "Xulosa: uchala muammo bitta joyda, connect atrofida. Ichida faqat har ulanishda bir marta qilinadigan ish: qayta so'rash va xonaga qaytish. Tinglovchi bir marta, tashqarida. Siz bugun ikkitasini OrderBotNest'da qo'lingiz bilan qildingiz, uchinchisi shu qolipning davomi."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "A1: uch usul — uchish rejimi, fonga olish, Render'da qayta chiqarish; o'zgarishni agent boshqa akkauntdan qiladi. A2: yozuv bilan tuzattirish va xuddi shu usul bilan qayta tekshirish",
  "seg": [
   [
    "a",
    "A1 da kod yozilmaydi: <b>o'zgarishni agent boshqa akkauntdan</b> qiladi, kuzatish — o'quvchida",
    "O'quvchi amaliyotining birinchi bloki. Kod yozilmaydi: o'quvchi ilovani buzadi, o'zgarishni esa agent boshqa akkauntdan qiladi, siz bugun telefondan buyurtma berganingizdek. Kuzatish va yozuv o'quvchida."
   ],
   [
    "b",
    "Uchish rejimi — <b>bir daqiqa kutish</b>; siz buni Offline 60 soniyada ko'rdingiz",
    "Birinchi usul uchish rejimi va o'quvchi darsi bir daqiqagacha kuting deydi. Siz sababini bilasiz: ping qoidasi, Offline olti soniyada buzilmadi, bir daqiqada buzildi. O'quvchi erta qaytsa, buzilmadi yozadi va bu ham natija, lekin xato yashirin qoladi."
   ],
   [
    "c",
    "Render'da qayta chiqarish — <b>sizdagi server qayta yonishi</b>; bir necha daqiqa cho'zilishi mumkin",
    "Uchinchi usul Render'da qo'lda qayta chiqarish, siz bugun serverni qayta yoqqaningiz bilan bir xil. Faqat Render'da bu bir necha daqiqa cho'zilishi mumkin. Biz Render'ni sinamadik, tugma nomi o'quvchi darsida rasmiy hujjatdan olingan."
   ],
   [
    "d",
    "Xulosa: A2 da <b>agentning «tuzatdim»i ham da'vo</b> — xuddi shu usul bilan qayta buziladi",
    "Xulosa: ikkinchi blokda o'quvchi yozuvni agentga beradi va tuzattiradi. Agentning tuzatdim degani ham da'vo. Siz bugun ko'rdingiz: AI sinagan urinishda xato yuz bermagan bo'lishi mumkin. O'quvchi buzildi belgili urinishlarni xuddi shu usul bilan qaytarsin."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "Olti holat, har biri o'z belgisi bilan — va o'quvchi so'raydigan to'rt savol",
  "seg": [
   [
    "a",
    "Birinchi uchtasi — <b>uch muammo</b>: son eski, xabar ikki marta, son kam",
    "Sinfda uchraydigan olti holat. Birinchi uchtasi o'quvchi darsidagi uch muammo. Belgi ulangan, son eski: qayta so'rash yo'q. Jonli xabar ikki marta: tinglovchi connect ichida. Hozir ko'ryapti kam: xonaga qayta kirish yo'q."
   ],
   [
    "b",
    "Qolgan uchtasi: <b>hammasi «buzilmadi», Render uzoq, agent «tuzatdim»</b>",
    "To'rtinchisi: hamma urinish buzilmadi. Uchish rejimi qisqa bo'lgan yoki Expo Go ilovani qayta yuklagan, bu ham natija. Beshinchisi: Render qayta chiqishi bir necha daqiqa. Oltinchisi: agent tuzatdim dedi, uni xuddi shu usul bilan qayta tekshirish kerak."
   ],
   [
    "c",
    "O'quvchi savollari: <b>nega tuzatamiz, server qayta bermaydimi, ikki marta nima yomon, Backend</b>",
    "O'quvchi savollariga tayyor javoblar pastda, bosib oching: socket.io o'zi qayta ulansa nega tuzatamiz, server o'tkazilganni qayta bera olmaydimi, tinglovchi ikki marta bo'lsa nima yomon, Backend'ni tuzatish kerakmi."
   ],
   [
    "d",
    "Xulosa: har <b>«bajardim» va «tuzatdim»</b> dan keyin — xuddi shu usul bilan qayta buzish",
    "Xulosa va usul: o'quvchi yoki agent bajardim, tuzatdim desa, u bilan birga xuddi shu buzish usulini qaytaring va yozuvdagi nima bo'ldi qatoriga qarang. Shu bilan sinfga tayyorsiz. Endi o'zingizni tekshiring."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "socket.io qayta ulanganda nimani o'zi tiklaydi?",
    "o": [
     "Ulanishni — o'tkazilgan hodisalarni emas",
     "Ulanishni va o'tkazilgan hamma hodisani",
     "Faqat hodisalarni, ulanishni sahifa yangilaydi",
     "Hech narsani — admin sahifani qayta ochadi"
    ],
    "c": 0,
    "e": "Qayta ulanish — yangi ulanish.",
    "s": 2
   },
   {
    "q": "Ulanish yo'q paytda yuborilgan order-changed nima bo'ladi?",
    "o": [
     "Navbatda turadi va qayta ulanganda keladi",
     "Keyingi hodisa bilan birga keladi",
     "Hech kimga yetmaydi va keyin ham kelmaydi",
     "Bazaga yoziladi, panel uni o'zi o'qiydi"
    ],
    "c": 2,
    "e": "server.emit — faqat ulanganlarga.",
    "s": 2
   },
   {
    "q": "Tuzatish qayerda va qanday?",
    "o": [
     "Gateway'da — hodisani bazaga saqlash",
     "admin.html — connect ichida yukla()",
     "Botda — hodisani ikki marta yuborish",
     "Panelda — sahifani har 3 s yangilash"
    ],
    "c": 1,
    "e": "Har ulanishda ro'yxat bazadan.",
    "s": 8
   },
   {
    "q": "Tinglovchi connect ichida. Server ikki marta qayta yondi. Bitta buyurtmada nima bo'ladi?",
    "o": [
     "Hodisa umuman kelmaydi — tinglovchi yo'q",
     "Ulanish yopiladi va qayta ochilmaydi",
     "Token qayta so'raladi, admin qayta kiradi",
     "Uchta GET ketadi, sariq belgi yo'qoladi"
    ],
    "c": 3,
    "e": "Har qayta ulanishda yana bitta tinglovchi.",
    "s": 10
   },
   {
    "q": "DevTools Offline 6 soniya, shu payt buyurtma. Natija?",
    "o": [
     "Buzilmadi — kadr Online'da keldi, ro'yxat yangi",
     "Buzildi — hodisa yo'qoldi, ro'yxat eski",
     "Belgi darhol «Ulanmagan» bo'ldi, qayta urinmadi",
     "Sahifa o'zi qayta yuklandi va ro'yxat yangilandi"
    ],
    "c": 0,
    "e": "Brauzer ochiq ulanishni yopmadi.",
    "s": 6
   },
   {
    "q": "DevTools Offline 60 soniya. Nega buziladi?",
    "o": [
     "Brauzer bir daqiqadan keyin sahifani o'zi yopadi",
     "Ping kelmaydi — klient uzadi, kadr tashlanadi",
     "Server 60 s dan keyin tokenni bekor qiladi",
     "Offline paytida bot buyurtma olmaydi"
    ],
    "c": 1,
    "e": "25 + 20 s qoidasi.",
    "s": 6
   },
   {
    "q": "connectionStateRecovery qachon yordam bermaydi?",
    "o": [
     "Qisqa tarmoq uzilishida — ikki daqiqagacha",
     "Websocket transportida — polling'da ishlaydi",
     "Server qayta yonganda — holat xotirada edi",
     "Klient uzilishdan oldin hodisa olgan bo'lsa"
    ],
    "c": 2,
    "e": "Tiklash — server jarayoni xotirasida.",
    "s": 14
   },
   {
    "q": "AI «sinadim, o'tdi» dedi. Nimani tekshirasiz?",
    "o": [
     "Testlar soni oshdimi va hammasi yashil chiqdimi",
     "Diff qisqami — kam fayl o'zgarganmi",
     "AI kuchli modelmi — javobiga ishonsa bo'ladimi",
     "Sinovda eski kod yiqildimi — xato yuz berdimi"
    ],
    "c": 3,
    "e": "Hodisa kelgan urinish — isbot emas.",
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
