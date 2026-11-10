
// ============================================================
//  WebSocket-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/ws1-matn.py (manba: 19-WS1-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · WebSocket",
  "title": "Do'kon admini kompyuterda panelni ochib qo'yadi: bot buyurtma olsa, yangi qator sahifani yangilamasdan o'zi paydo bo'ladi — bugun shuni qilamiz",
  "seg": [
   [
    "a",
    "Bot buyurtma oladi — <b>panel sahifani yangilamasdan o'zi ko'rsatadi</b>",
    "Assalomu alaykum. OrderBotNest'da hozir admin yangi buyurtmani faqat Telegram xabaridan biladi. Bugun do'kon uchun jonli panel qilamiz: kompyuterda ochiq turadigan sahifa. Mijoz botda buyurtma bersa, panelda yangi qator o'zi paydo bo'ladi. Ekranda dars oxiridagi natija, haqiqiy brauzerdan."
   ],
   [
    "b",
    "Avval <b>umumiy tushuncha</b>: so'rov–javob, doimiy ulanish va socket.io",
    "Avval umumiy tushuncha: oddiy so'rov–javob bilan panel nega o'zi yangilanmaydi, doimiy ulanish nima va socket.io nima qiladi. Keyin serverda gateway yozamiz: ulanishlarni qabul qiladigan klass, token bilan."
   ],
   [
    "c",
    "Keyin <b>hodisa, panel sahifasi va uch ulanish holati</b>; oxirida AI va sinf",
    "Uchinchi bosqichda hodisani yuboramiz va panel sahifasini o'qiymiz. To'rtinchisida server o'chsa yoki javob bermasa panel nima ko'rsatishini ko'ramiz. Beshinchisida ikki AI yozgan panelni haqiqiy bazada sinaymiz. Oxirida sinfga tayyorgarlik."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot; kerak: <b>TgPg darsidagi bot token va Postgres</b>",
    "Dars olti bosqich, uchta amaliyot. Telegraf darsida yaratgan bot tokeningiz va Postgres bazangiz kerak bo'ladi: panelni o'z telefoningizdan buyurtma berib sinaysiz. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "Oddiy HTTP'da server faqat so'ralganda javob beradi: panel so'ramasa, Bobur bergan buyurtmani bilmaydi — ekran eski qoladi",
  "seg": [
   [
    "a",
    "Panel <b><code>GET /admin/orders</code> so'radi — bo'sh</b>; keyin Bobur botda buyurtma berdi",
    "Bizda oddiy yo'l bor: get admin orders, token bilan. Panel so'radi, javob bo'sh ro'yxat. Shu paytda mijoz Bobur botda buyurtma berdi: bot buyurtma bir qabul qilindi dedi. Panel buni biladimi? Yo'q, u faqat so'raganda javob oladi."
   ],
   [
    "b",
    "Ikkinchi so'rovda <b>buyurtma bor</b> — lekin panel o'zi so'ramaguncha ekran eski edi",
    "Ikkinchi so'rov: endi ro'yxatda birinchi buyurtma, Bobur, Klaviatura. Ma'lumot bazada birinchi so'rovdan keyin darhol paydo bo'lgan, lekin panel so'ramaguncha ekran eski turdi. So'rov–javobda server o'zi gapira olmaydi."
   ],
   [
    "c",
    "Ikki yo'l: <b>har necha soniyada qayta so'rash (polling)</b> yoki doimiy ulanish",
    "Ikki yo'l bor. Birinchisi: panel har uch soniyada qayta so'raydi, buni polling deyishadi. Oddiy, lekin ko'pincha javob o'zgarmagan bo'ladi va kechikish qoladi. Ikkinchisi: panel bir marta ulanadi, ulanish ochiq turadi, server o'zgarish bo'lganda o'zi xabar beradi."
   ],
   [
    "d",
    "Xulosa: so'rov–javobda <b>server o'zi gapirmaydi</b>; jonli panel uchun doimiy ulanish kerak",
    "Xulosa: oddiy HTTP'da server faqat so'ralganda javob beradi, tokensiz so'rovga esa to'rt yuz bir. Panel o'zi yangilanishi uchun server o'zi gapira olishi kerak. Buning uchun doimiy ulanish, keyingi ekranda uning kutubxonasi."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "socket.io — doimiy ulanish kutubxonasi: avval oddiy HTTP so'rovlar (polling), keyin WebSocket'ga o'tadi; server va klient istalgan payt hodisa yuboradi",
  "seg": [
   [
    "a",
    "socket.io klienti ulanadi: <b>avval <code>polling</code>, bir lahzada <code>websocket</code></b>",
    "OrderBotNest'da buning uchun socket.io ishlatamiz. Terminal klientini ishga tushirdik: npm run live. Avval ulanmoqda, keyin connect, transport polling: oddiy HTTP so'rovlar. Bir lahzadan keyin transport websocket: doimiy ulanishga o'tdi. Agar WebSocket yopiq tarmoq bo'lsa, polling'da qoladi va baribir ishlaydi."
   ],
   [
    "b",
    "Bitta port: <b>HTTP yo'llari ham, WebSocket ham <code>3100</code>da</b> — alohida server yo'q",
    "Server logiga qarang: admin va admin orders yo'llari, va server uch ming bir yuz portida. WebSocket ham shu portda, alohida server kerak emas. Nest'da buni gateway qiladi, ikkinchi bosqichda yozamiz."
   ],
   [
    "c",
    "Hodisa — <b>nomi va kichik ma'lumot</b>: <code>order-changed</code>, qaysi buyurtma va nega",
    "Doimiy ulanishda xabar hodisa deyiladi: nomi va kichik ma'lumot. Bizda bitta hodisa: order changed, ichida buyurtma raqami va sabab: yangi yoki holat. Panel uni tinglaydi va ro'yxatni qayta so'raydi."
   ],
   [
    "d",
    "Xulosa: serverda <b>gateway bo'lmasa, klient cheksiz <code>xhr poll error</code></b> — WebSocket o'zi paydo bo'lmaydi",
    "Xulosa: socket.io ikki tomon: serverda gateway, klientda kutubxona. Darsning boshlang'ich tegida gateway yo'q: klient cheksiz xhr poll error, admin sahifasi to'rt yuz to'rt. Endi gateway'ni yozamiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "2-bosqich · gateway va token",
  "title": "LiveGateway: har yangi ulanishda handleConnection — tokenni tekshiradi; noto'g'ri bo'lsa disconnect() va return; to'g'ri bo'lsa log yozadi",
  "seg": [
   [
    "a",
    "<code>src/api/live/live.gateway.ts</code>: <b><code>@WebSocketGateway()</code> — HTTP bilan bitta portda</b>",
    "OrderBotNest papkangizda src, api, live papkasini oching, live gateway ts fayli. Klass ustida WebSocket gateway dekoratori: Nest bu klassni ulanishlarni qabul qiladigan joy qiladi, HTTP bilan bitta portda. Ichida WebSocket server maydoni: hamma ulangan panellar shu orqali."
   ],
   [
    "b",
    "<code>handleConnection</code>: <b><code>handshake.auth.token</code> noto'g'ri — <code>disconnect()</code> va <code>return</code></b>",
    "Handle connection har yangi ulanishda chaqiriladi. Birinchi ish: handshake auth token, panel ulanayotganda yuborgan token. Noto'g'ri bo'lsa client disconnect, ya'ni server ulanishni yopadi, va return. To'g'ri bo'lsa client data admin true va log: panel ulandi."
   ],
   [
    "c",
    "Token qoidasi <b>bitta joyda: <code>isAdminToken</code></b> — <code>.env</code> dagi <code>ADMIN_PANEL_TOKEN</code>, bo'sh ham rad",
    "Tokenni tekshirish alohida faylda: admin token ts, is admin token funksiyasi. U env'dagi admin panel tokeni bilan solishtiradi, bo'sh tokenni ham rad etadi. Bir qoida ikki joyda ishlaydi: WebSocket ulanishida va get admin orders so'rovida."
   ],
   [
    "d",
    "Xulosa: token <b>ulanish ochilayotganda</b> tekshiriladi; <code>orderChanged</code> — hamma ulangan panelga hodisa",
    "Xulosa: token bir marta, ulanish ochilayotganda tekshiriladi, keyingi hodisalarda qayta emas. Gateway'ning ikkinchi ishi order changed funksiyasi: server emit, hamma ulangan panelga hodisa. Live module'ni telegram module'ga ulaymiz, bot shu funksiyani chaqiradi."
   ]
  ]
 },
 "5": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "npm run live -- \"\" — tokensiz ulanamiz. Gateway disconnect() qiladi. Terminal klienti nima yozadi?",
  "q": "Gateway'ni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Terminal klientini tokensiz ishga tushirdik. Gateway tokenni rad etadi va disconnect qiladi. Klient terminalida nima chiqadi? Variantni tanlang.",
  "ok": "To'g'ri. Ulanish avval ochiladi, chunki token handle connection ichida, ulanish ochilgandan keyin tekshiriladi. Shuning uchun bir lahza connect, keyin io server disconnect, active false: server yopgan ulanishga klient o'zi qayta ulanmaydi. Demak, bu holatda panel belgisi ulanmagan, sabab token.",
  "okShort": "Bir lahza <code>connect</code> → <code>io server disconnect</code>, <code>active=false</code> — server yopdi, klient urinmaydi.",
  "hint": "Token qachon tekshiriladi — ulanish ochilishidan oldinmi, keyinmi? Kim yopdi — server yoki tarmoq?",
  "demak": "<code>io server disconnect</code> — server yopdi (token); klient qayta urinmaydi — «Ulanmagan».",
  "correct": 1,
  "opts": [
   "Faqat connect_error — ulanish umuman ochilmaydi, klient qayta urinaveradi",
   "Bir lahza connect, keyin io server disconnect — klient qayta urinmaydi",
   "ulanmoqda — klient har 3 soniyada token bilan qayta ulanishga urinadi",
   "connect va ulanish ochiq qoladi, faqat hodisalar kelmaydi"
  ],
  "wrong": {
   "0": "Ulanish ochiladi: token ochilgandan keyin handleConnection da tekshiriladi.",
   "2": "Server yopgan ulanishga socket.io o'zi qayta ulanmaydi — active=false.",
   "3": "disconnect() ulanishni yopadi — ochiq qolmaydi."
  }
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · buzamiz",
  "title": "disconnect() dan keyin return yo'q: klient baribir yopildi, lekin server logi «panel ulandi» deb yozdi — log endi ishonchsiz",
  "seg": [
   [
    "a",
    "Buzamiz: <b><code>client.disconnect();</code> dan keyingi <code>return;</code> ni olib tashlaymiz</b>",
    "Endi ataylab buzamiz. Live gateway ts faylida client disconnect'dan keyingi return satrini o'chiramiz. Kichik o'zgarish, kod kompilyatsiya bo'ladi. Tokensiz klient bilan sinaymiz: npm run live, ikki qo'shtirnoq."
   ],
   [
    "b",
    "Klient: <b>o'sha natija — <code>io server disconnect</code></b>; ulanish baribir yopildi",
    "Klient terminali o'sha natijani ko'rsatadi: bir lahza connect, keyin io server disconnect, ulanmagan. Disconnect ishladi, ulanish yopildi. Klient tomondan qaraganda hech narsa o'zgarmadi."
   ],
   [
    "c",
    "Server logi: <b><code>panel ulandi</code></b> — rad etilgan klient uchun; to'g'ri kodda bu satr yo'q",
    "Lekin server logiga qarang: Live, panel ulandi. Rad etilgan, tokensiz klient uchun. To'g'ri kodda, uchinchi tajribada, bu satr umuman yo'q edi. Endi log yolg'on gapiryapti: kim ulangani haqida unga ishonib bo'lmaydi."
   ],
   [
    "d",
    "Demak, sabab: <b><code>disconnect()</code> funksiyadan chiqmaydi</b> — keyingi satrlar baribir bajariladi",
    "Demak, sabab bitta: disconnect ulanishni yopadi, lekin funksiyadan chiqmaydi. Return bo'lmasa keyingi satrlar baribir bajariladi: admin belgisi qo'yiladi, log yoziladi. Keyinroq shu yerga xona yoki ruxsat qo'shilsa, rad etilgan klient ularni oladi. Return'ni tiklaymiz."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "ws1-done tegida serverni ishga tushiring, terminal klienti bilan token, noto'g'ri token va tokensiz ulaning, server logini o'qing",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>ws1-done</code> tegi</b>, <code>.env</code> ga panel tokeni, server va klient",
    "Endi navbat sizga. OrderBotNest papkangizda ws1 done tegiga o'tasiz, env fayliga admin panel tokenini yozasiz, serverni va terminal klientini ishga tushirasiz. Ikkita terminal kerak: biri server, biri klient. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>teg, <code>npm install</code>, <code>.env</code>, <code>npm run start:dev</code></b> — logda <code>/admin</code> yo'llari",
    "Birinchi qadamda git fetch va checkout, keyin npm install: yangi paketlar bor. Ikkinchisida env'ga admin panel token qatorini qo'shasiz, o'zingiz o'ylagan so'z, va npm run start dev. Logda admin yo'llari va server porti chiqishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <b>ikkinchi terminalda <code>npm run live</code></b> — token, noto'g'ri, tokensiz; isbot — server logidagi satr",
    "Uchinchi qadamda ikkinchi terminalda npm run live: connect, websocket, server logida panel ulandi. To'rtinchisida noto'g'ri token va tokensiz: io server disconnect. Isbot maydoniga server logidagi panel ulandi satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz serverning doimiy ulanishini terminaldan tekshira olasiz."
   ]
  ],
  "steps": [
   {
    "t": "Teg",
    "cmds": [
     "git fetch --tags",
     "git checkout ws1-done",
     "npm install"
    ],
    "exp": "added … packages"
   },
   {
    "t": "Server",
    "cmds": [
     ".env ga ADMIN_PANEL_TOKEN=<o'z so'zingiz>",
     "npm run start:dev"
    ],
    "exp": "Mapped {/admin/orders, GET} · Server 3000-portda ishlayapti"
   },
   {
    "t": "Klient",
    "cmds": [
     "ikkinchi terminal: npm run live"
    ],
    "exp": "connect · ulangan · transport: websocket · serverda [Live] panel ulandi"
   },
   {
    "t": "Rad",
    "cmds": [
     "npm run live -- notogri",
     "npm run live -- \"\""
    ],
    "exp": "disconnect: io server disconnect · active=false → ulanmagan"
   }
  ],
  "proof": {
   "label": "Server logidagi «panel ulandi» satri",
   "placeholder": "masalan: LOG [Live] panel ulandi: -GKZthhgExVB6fHnAAAA",
   "re": "panel ulandi",
   "flags": "i",
   "wrong": "Server terminalida [Live] panel ulandi: … satrini toping va nusxalang."
  },
  "trouble": [
   [
    "connect_error: xhr poll error cheksiz",
    "server ishlamayapti yoki port boshqa — server terminalini tekshiring; boshqa port bo'lsa LIVE_URL=http://localhost:<port> npm run live"
   ],
   [
    "to'g'ri token bilan ham io server disconnect",
    ".env dagi token bilan klientdagi farq qiladi yoki server .env ni o'qimadi — serverni qayta ishga tushiring"
   ],
   [
    "Cannot find module 'socket.io-client'",
    "npm install qilinmagan (yangi paketlar)"
   ],
   [
    "BOT_TOKEN topilmadi",
    ".env da bot tokeni yo'q — Telegraf darsidagi tokenni yozing"
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "3-bosqich · hodisa va panel",
  "title": "Bot buyurtmani bazaga yozib bo'lgach orderChanged(order.id, 'new'); admin holatni o'zgartirgach — 'status'. Hodisada ro'yxat yo'q: panel qayta so'raydi",
  "seg": [
   [
    "a",
    "<code>telegram.service.ts</code>: <b><code>await this.orders.place(…)</code> tugagach</b> — <code>orderChanged(order.id, 'new')</code>",
    "Src, api, telegram papkasidagi telegram service ts faylini oching, place order funksiyasi. Avval await orders place: tranzaksiya, buyurtma bazaga yozildi. Faqat shundan keyin live order changed, buyurtma raqami va new. Await tufayli hodisa bazadagi buyurtmadan oldin ketmaydi."
   ],
   [
    "b",
    "Admin tugmasi: <b><code>setStatus</code> tugagach — <code>'status'</code></b> — bot kodi o'zgarmadi, bitta satr qo'shildi",
    "Admin holat tugmasini bosganda ham shu qolip: await orders set status, keyin order changed, status sababi bilan. Bot kodining qolgan qismi o'zgarmadi, ikki joyga bittadan satr qo'shildi. Mijozga Telegram xabari avvalgidek boradi."
   ],
   [
    "c",
    "Hodisada <b>faqat <code>orderId</code> va <code>reason</code></b> — panel yangi ro'yxatni <code>GET /admin/orders</code> dan so'raydi",
    "Hodisa ichida nima bor? Faqat buyurtma raqami va sabab, ro'yxat ham, mijoz telefoni ham yo'q. Panel hodisani olgach get admin orders'ni qayta so'raydi, token bilan. Ma'lumotning manbai bitta: baza. O'quvchi darsida bu konvert deyiladi."
   ],
   [
    "d",
    "Xulosa: hodisa <b>«nimadir o'zgardi»</b> deydi; ma'lumot — token bilan, so'rovda",
    "Xulosa: hodisa tranzaksiya tugagach yuboriladi va faqat nimadir o'zgardi deydi. Ma'lumot token bilan himoyalangan so'rovda keladi. Admin controller'da list funksiyasi: token tekshiriladi, oxirgi yigirma buyurtma, faqat kerakli maydonlar. Endi panel sahifasini ochamiz."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · hodisa va panel",
  "title": "public/admin.html: socket.io klienti serverning o'zidan; io({ auth: { token } }) — ulanish; uch holat; order-changed kelsa yukla()",
  "seg": [
   [
    "a",
    "<code>public/admin.html</code>: <b>socket.io klienti <code>/socket.io/socket.io.js</code> — serverning o'zi beradi</b>",
    "Public papkasidagi admin html faylini oching. Oddiy HTML sahifa, kutubxona alohida o'rnatilmaydi: socket io js faylini serverning o'zi beradi, shu manzildan. Sahifa get admin, ya'ni admin controller'ning page funksiyasi orqali ochiladi."
   ],
   [
    "b",
    "<code>ulan()</code>: <b><code>io({ auth: { token } })</code></b> — token manzilda emas, ulanish ma'lumotida",
    "Ulan funksiyasi: io, auth, token. Token manzil satriga yozilmaydi, ulanish ochilayotgan paytdagi ma'lumotda ketadi: gateway uni handshake auth'dan o'qiydi. Connect bo'lsa belgi ulangan, disconnect bo'lsa active'ga qarab ulanmoqda yoki ulanmagan."
   ],
   [
    "c",
    "Tinglovchi: <b><code>ulanish.on('order-changed', () =&gt; yukla())</code></b> — hodisadan keyin qayta so'rash",
    "Eng muhim satr: ulanish on, order changed, yukla. Hodisa kelganda yukla funksiyasi chaqiriladi: get admin orders, yangi ro'yxat. Yangi qator sariq bo'ladi: id oldingi eng kattasidan katta bo'lsa. Ro'yxat har doim bazadan, hodisadan emas."
   ],
   [
    "d",
    "Xulosa: mijoz ismi Telegram'dan keladi — <b><code>esc()</code> bilan matn sifatida</b> qo'yiladi",
    "Xulosa: panel uch ish qiladi: ulanadi, tinglaydi, qayta so'raydi. Va bitta xavfsizlik qoidasi: mijoz ismi Telegram'dan keladi, ichida HTML bo'lishi mumkin. Esc funksiyasi uni matnga aylantiradi, sahifada kod bo'lib ishlamaydi. Endi haqiqiy oqimni ko'ramiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · hodisa va panel",
  "title": "Panel ochiq; Bobur botda buyuradi — yangi qator o'zi chiqadi; admin tasdiqlaydi — holat o'zi o'zgaradi; terminal klienti ham ikkala hodisani ko'radi",
  "seg": [
   [
    "a",
    "Panel ochiq, belgi <b>«Ulangan»</b>; ro'yxatda oldingi buyurtmalar",
    "Endi hammasini birga ko'ramiz. Brauzerda admin sahifasi, token kiritildi, belgi ulangan, ro'yxatda oldingi buyurtmalar. Bu haqiqiy brauzer, haqiqiy server va baza. Telegram o'rniga smoke'dagi usul: bot kodi haqiqiy, xabar ichkaridan beriladi."
   ],
   [
    "b",
    "Bobur buyurtma berdi — <b>yangi qator sariq, sahifa yangilanmadi</b>",
    "Bobur botda Klaviatura buyurdi. Panelda eng yuqorida yangi qator, sariq rangda: yangi. Sahifa qayta ochilmadi, hech kim tugma bosmadi. Server hodisa yubordi, panel ro'yxatni qayta so'radi."
   ],
   [
    "c",
    "Admin tasdiqladi — <b>holat «Tasdiqlandi»</b>; terminal klienti ham ikki hodisani ko'rdi",
    "Admin Jasur botda tasdiqlash tugmasini bosdi. Panelda shu qatorning holati tasdiqlandi bo'ldi. O'ngda terminal klienti: ikkita order changed, birinchisi new, ikkinchisi status. Server logida esa bot xabarlari va panel ulandi satri."
   ],
   [
    "d",
    "Xulosa: bu oqim <b>lentada ham tekshiriladi</b> — smoke <code>live</code>, GitHub'da 9/9",
    "Xulosa: bot, tranzaksiya, hodisa, panel, qayta so'rash. Shu oqim smoke'ga ham qo'shildi: npm run smoke live. CI/CD darsidagi lentada smoke job Postgres bilan uni har push'da yurgizadi: GitHub'da to'qqizdan to'qqiz. Endi bitta xatoni o'zingiz topasiz."
   ]
  ]
 },
 "11": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Bu panelda belgi «Ulangan», terminal klienti order-changed ni oladi, lekin brauzerda yangi qator chiqmaydi. Sababchi satrni toping",
  "q": "Panel kodini ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu panelda belgi ulangan, terminal klienti hodisani oladi, lekin brauzerda yangi qator chiqmaydi. Bo'lakda bitta satr funksiyani chaqirmaydi, faqat qaytaradi. O'sha satrni bosing.",
  "ok": "To'g'ri. Strelka funksiya yukla'ni qaytaradi, lekin chaqirmaydi: qavs yo'q. Hodisa keladi, tinglovchi ishlaydi, get so'rovi ketmaydi, ro'yxat eski qoladi. Brauzerda o'n besh soniya kutdik, ro'yxat o'zgarmadi, terminal klienti esa ikkala hodisani ko'rdi. Demak, hodisa kelsa-yu ekran o'zgarmasa, tinglovchi ichini tekshiring.",
  "okShort": "<code>() =&gt; yukla</code> — funksiya qaytariladi, chaqirilmaydi. Hodisa keladi, <code>GET</code> ketmaydi.",
  "hint": "Qaysi satrda funksiya nomidan keyin qavs yo'q?",
  "task": "Qoida: hodisa kelganda ro'yxatni qayta so'raydigan funksiya <b>chaqirilishi</b> kerak. Bu bo'lakda bitta satr funksiyani chaqirmaydi, faqat qaytaradi. <b>O'sha satrni bosing.</b>"
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "Brauzerda /admin ni oching, telefondan botda buyurtma bering — panel o'zi yangilanadimi; keyin /orders dan tasdiqlang",
  "seg": [
   [
    "a",
    "Endi siz: <b>brauzerda panel, telefonda bot</b> — haqiqiy Telegram bilan",
    "Endi navbat sizga. Server ishlab turibdi. Brauzerda admin sahifasini ochasiz, telefoningizda botga buyurtma berasiz va panelning o'zi yangilanishini ko'rasiz. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b><code>localhost:3000/admin</code>, token</b> — belgi «Ulangan»; botda buyurtma — yangi qator",
    "Birinchi qadamda brauzerda localhost uch ming admin, tokenni kiritasiz: belgi ulangan, ro'yxat chiqadi. Ikkinchisida telefoningizdan botga start, katalog, mahsulot va buyurtma. Panelda yangi qator sariq bo'lib chiqishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <b><code>/orders</code> dan tasdiqlang</b> — holat o'zgaradi; <code>npm run smoke -- live</code>; isbot — smoke natijasi",
    "Uchinchi qadamda botda orders va tasdiqlash: paneldagi holat o'zgaradi. To'rtinchisida npm run smoke live: Telegram'siz o'sha oqim, to'rt band. Isbot maydoniga smoke'ning natija satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz botingizga jonli sayt sahifasini ulagansiz va uni o'zingiz sinagansiz."
   ]
  ],
  "steps": [
   {
    "t": "Panel",
    "cmds": [
     "brauzer: http://localhost:3000/admin → token → «Kirish»"
    ],
    "exp": "belgi «Ulangan», ro'yxat"
   },
   {
    "t": "Buyurtma",
    "cmds": [
     "telefon: botga /start → /catalog → mahsulot → /cart → «✅ Buyurtma berish»"
    ],
    "exp": "panelda yangi sariq qator"
   },
   {
    "t": "Tasdiq",
    "cmds": [
     "botda /orders → «✅ Tasdiqlash» (ADMIN_TELEGRAM_IDS da o'z id'ingiz)"
    ],
    "exp": "panelda «Tasdiqlandi»"
   },
   {
    "t": "Smoke",
    "cmds": [
     "npm run smoke -- live"
    ],
    "exp": "NATIJA: 4/4 ✓"
   }
  ],
  "proof": {
   "label": "npm run smoke -- live natija satri",
   "placeholder": "masalan: NATIJA: 4/4 ✓",
   "re": "NATIJA:\\s*4\\/4",
   "flags": "",
   "wrong": "npm run smoke -- live oxiridagi NATIJA: … satrini qo'ying — to'rt band."
  },
  "trouble": [
   [
    "Panelda «Token noto'g'ri»",
    "kiritgan so'z .env dagi ADMIN_PANEL_TOKEN bilan bir xil emas"
   ],
   [
    "Belgi «Ulanmoqda…» o'zgarmaydi",
    "server ishlamayapti yoki boshqa portda — sahifani o'sha portdan oching"
   ],
   [
    "Buyurtma Telegram'da bor, panelda yangi qator yo'q",
    "sahifa eski (ws1-done dan oldingi) — git checkout ws1-done, server qayta; konsolda xato bormi (F12)"
   ],
   [
    "/orders — «Bu buyruq faqat admin uchun»",
    ".env dagi ADMIN_TELEGRAM_IDS da o'z Telegram id'ingiz yo'q"
   ],
   [
    "smoke: baza ulanmagan — live faqat PostgreSQL bilan",
    ".env da DATABASE_URL yo'q"
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · ulanish holati",
  "title": "Panel belgisi uch holatda: hodisalar keladi · server javob bermayapti, klient o'zi urinmoqda · server yopdi, klient urinmaydi — farqni active beradi",
  "seg": [
   [
    "a",
    "«Ulangan» — <b>ulanish ochiq, hodisalar keladi</b>; ro'yxat yangi",
    "Paneldagi belgining uch holati bor. Birinchisi ulangan: ulanish ochiq, hodisalar keladi, ro'yxat yangi. Admin ekranga qarab ishonsa bo'ladi."
   ],
   [
    "b",
    "«Ulanmoqda…» — <b><code>active=true</code></b>: server javob bermayapti, klient o'zi qayta urinmoqda",
    "Ikkinchisi ulanmoqda. Ulanish uzildi, lekin socket.io o'zi qayta urinmoqda: active true. Sabab server o'chgani, internet uzilgani yoki server javob bermayotgani. Ro'yxat ekranda qoladi, lekin eskirgan bo'lishi mumkin."
   ],
   [
    "c",
    "«Ulanmagan» — <b><code>active=false</code></b>: server ulanishni yopdi (token), klient urinmaydi",
    "Uchinchisi ulanmagan: active false. Server ulanishni o'zi yopgan, bizda token noto'g'ri bo'lganda. Klient qayta urinmaydi, foydalanuvchi tokenni tuzatishi kerak. Panel buni token noto'g'ri deb ham yozadi."
   ],
   [
    "d",
    "Xulosa: holatni <b><code>disconnect</code> va <code>active</code></b> beradi; panelda bir satr",
    "Xulosa: uch holatni ikki narsa ajratadi: uzilish sababi va active. Panelda bu bitta satr: disconnect bo'lsa, active bo'lsa ulanmoqda, bo'lmasa ulanmagan. Endi server o'chib-yonganini haqiqiy terminalda ko'ramiz."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · ulanish holati",
  "title": "Server to'xtadi: transport close → klient har bir necha soniyada xhr poll error; server yondi — klient o'zi ulandi, hech kim hech narsa bosmadi",
  "seg": [
   [
    "a",
    "Server to'xtadi: <b><code>transport close</code>, <code>active=true</code></b> — belgi «Ulanmoqda…»",
    "Klient ulangan turibdi. Server terminalida Ctrl C, server to'xtadi. Klient darhol: disconnect, transport close, active true, ulanmoqda. Ulanishni tarmoq uzdi, server emas, shuning uchun klient taslim bo'lmaydi."
   ],
   [
    "b",
    "Qayta urinish: <b>har bir necha soniyada <code>xhr poll error</code></b> — oraliq tobora uzayadi",
    "Keyin har bir necha soniyada connect error, xhr poll error: klient polling bilan urinadi, server yo'q. Vaqtlarga qarang: oraliq asta uzayadi, klient serverni bombardimon qilmaydi. Panelda shu vaqt ulanmoqda."
   ],
   [
    "c",
    "Server yondi — <b>klient o'zi ulandi</b>: polling, keyin websocket",
    "Serverni qayta ishga tushirdik. Bir necha soniyadan keyin klient o'zi connect, ulangan, avval polling, keyin websocket. Hech kim sahifani yangilamadi, hech narsa bosmadi. Bu socket.io'ning tayyor xizmati."
   ],
   [
    "d",
    "Xulosa: <b>qayta ulanish o'zi</b> bo'ladi; lekin uzilish paytidagi hodisa — keyingi darsda",
    "Xulosa: server o'chib-yonsa, panel o'zi qayta ulanadi. Lekin bir savol qoldi: server o'chiq paytida buyurtma tushsa, panel uni ko'radimi? Bu keyingi WebSocket darsining mavzusi, uzilishda nima yo'qoladi. Endi qiyinroq holat: server javob bermaydi, lekin uzilmaydi."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "Server jarayonini muzlatamiz: ulanish uzilmaydi, javob ham yo'q — klient 43 soniya «ulangan» deb turadi, keyin ping timeout; sabab — 25 + 20 soniya qoidasi",
  "seg": [
   [
    "a",
    "Muzlatamiz: <b>ulanish ochiq, lekin server javob bermaydi</b> — telefon uchish rejimiga o'xshash",
    "Endi qiyinroq holat. Server jarayonini muzlatamiz: kill minus STOP. Ulanish uzilmaydi, lekin server hech narsaga javob bermaydi. Hayotda bu telefon uchish rejimida, Wi-Fi o'chganda yoki server qotib qolganda bo'ladi."
   ],
   [
    "b",
    "Klient <b>43 soniya «ulangan»</b> deb turadi — hech narsa bilmaydi",
    "Klient terminaliga qarang: hech narsa yo'q. Qirq uch soniya davomida u o'zini ulangan deb hisoblaydi. Shu vaqt panel belgisi yashil, lekin hodisalar kelmaydi. Admin ekranga ishonadi, ekran esa eskirgan."
   ],
   [
    "c",
    "Keyin <b><code>ping timeout</code></b> — socket.io har 25 s ping yuboradi, 20 s javob kutadi",
    "Keyin disconnect, ping timeout, ulanmoqda. Socket.io qoidasi: server har yigirma besh soniyada ping yuboradi va yigirma soniya javob kutadi. Javob kelmasa, ulanish o'lik deb topiladi. Shuning uchun eng uzog'i qirq besh soniya. Server davom etgach, klient darhol ulandi."
   ],
   [
    "d",
    "Demak, sabab: <b>javob yo'qligi — uzilish emas</b>; ulanish o'lganini faqat ping aniqlaydi",
    "Demak, sabab bitta: tarmoq javob bermaganda hech kim ulanish uzilganini aytmaydi. Uni faqat ping aniqlaydi, qirq besh soniyagacha kechikish bilan. Sinfda o'quvchi uchish rejimida belgi o'zgarmadi desa, kuting deng. Endi tekshirib olaylik."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "Admin noutbukida Wi-Fi o'chdi: ulanish uzilmadi, lekin paket ham o'tmaydi. Panel belgisi qachon «Ulanmoqda…» bo'ladi?",
  "q": "Muzlashni ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Admin noutbukida Wi-Fi o'chdi: ulanish uzilmadi, lekin hech narsa o'tmaydi. Panel belgisi qachon ulanmoqda bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Ulanish rasman uzilmagan, shuning uchun hech kim darhol aytmaydi. Server har yigirma besh soniyada ping yuboradi va yigirma soniya kutadi; javob kelmasa ping timeout, belgi ulanmoqda. Eng uzog'i qirq besh soniya. Demak, javob bermaydigan tarmoqni faqat ping aniqlaydi, kechikish bilan.",
  "okShort": "Javob bermaydigan tarmoq — <code>ping timeout</code>, 45 s gacha (25 + 20). Darhol emas.",
  "hint": "Ulanish o'lganini kim va qanday aniqlaydi? 15-ekrandagi 25 + 20 ni eslang.",
  "demak": "Javob bermaydigan tarmoqni faqat ping aniqlaydi: <code>ping timeout</code> — 45 s gacha.",
  "correct": 2,
  "opts": [
   "Darhol — brauzer Wi-Fi o'chganini sezib socket.io'ga aytadi",
   "Hech qachon — ulanish uzilmagani uchun belgi yashil qoladi",
   "45 soniyagacha — ping javobsiz qolgach ping timeout",
   "Keyingi hodisa kelganda — server xato qaytaradi"
  ],
  "wrong": {
   "0": "Brauzer har doim sezmaydi; socket.io pingga tayanadi.",
   "1": "Ping javobsiz qolsa, socket.io ulanishni o'zi uzadi — 45 s gacha.",
   "3": "Server hodisani yuboradi, xato qaytmaydi — paket shunchaki yetmaydi."
  }
 },
 "17": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI",
  "title": "Yangi ko'nikma davomi: ikki AI'ga bitta oddiy prompt — «jonli panel, WebSocket bilan»; ikkalasi ishlaydigan panel yozdi, ikkalasi bir xil yo'lni tanladi",
  "seg": [
   [
    "a",
    "Yana AI bosqichi: <b>panel yozdi AI, siz qabul qilasiz</b> — oddiy prompt, ishorasiz",
    "Avvalgi darslardagi kabi oxirgi bosqich AI bilan. Prompt oddiy: do'kon admini uchun jonli buyurtmalar paneli, bot buyurtma olsa yoki holat o'zgarsa, sahifa o'zi yangilansin, WebSocket bilan. Socket.io, token, hodisa tarkibi, bu so'zlar promptda yo'q."
   ],
   [
    "b",
    "Ikkalasi <b>xom <code>ws</code></b> tanladi — socket.io emas; qayta ulanishni o'zi yozdi",
    "Ikkala AI ham bir xil yo'lni tanladi: socket.io emas, xom ws kutubxonasi. Brauzerda kutubxonasiz. Ishlaydi, lekin qayta ulanish, ping, polling'ga tushish, bularni o'zi qo'lda yozgan. Shuning uchun birinchisi sakkiz yuz ellik besh satr, ikkinchisi besh yuz o'n ikki."
   ],
   [
    "c",
    "Ikkalasi tokenni o'zi qo'shdi — lekin <b>URL'da: <code>?token=</code></b>; hodisada butun buyurtma",
    "Yaxshi tomoni: promptda yo'q bo'lsa ham, ikkalasi tokenni o'zi qo'shdi, telefon raqamlari bor deb. Lekin token manzilda: savol belgisi token. Va har hodisada butun buyurtma ketadi, mijoz telefoni bilan. Ulanganda esa to'liq ro'yxat keladi."
   ],
   [
    "d",
    "Xulosa: ikkalasi <b>bazasiz, mock bilan sinagan</b> — haqiqiy bazada biz sinab ko'ramiz",
    "Xulosa: ikkala javob ham ishonchli ko'rinadi, testlari yashil. Lekin ikkalasi o'zi aytdi: Postgres yo'q edi, haqiqiy bot, baza va panel oqimi sinalmadi. Keyingi ekranda ikkalasini haqiqiy bazada, haqiqiy bot oqimi bilan sinaymiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Haqiqiy PostgreSQL bilan: ikkalasi ishladi — smoke 5/5, tokensiz yopildi, buyurtma va tasdiq keldi; to'rt joyni esa siz qaror qilasiz",
  "seg": [
   [
    "a",
    "Haqiqiy bazada: <b>ikkalasi ishladi</b> — smoke 5/5, tokensiz ulanish yopildi",
    "Ikkala nusxani haqiqiy Postgres bilan ishga tushirdik. Tsc toza, testlar yashil, smoke beshdan besh. Tokensiz ulanish yopildi: birinchisida to'rt ming to'rt yuz bir kodi, ikkinchisida bir ming sakkiz. Buni tan olamiz: AI yaxshi ishladi."
   ],
   [
    "b",
    "Bot buyurtma oldi: <b>snapshot, created, updated</b> — ichida mijoz ismi va telefoni",
    "Bot buyurtma oldi, admin tasdiqladi. Xom ws klientida uchta xabar: snapshot, nol ta; created va updated, ichida butun buyurtma: mijoz ismi, telefoni, mahsulotlar. Har ulangan panelga, har o'zgarishda. Ishlaydi, lekin telefon raqam har xabarda ketadi."
   ],
   [
    "c",
    "Farq: token <b>manzilda vs ulanish ma'lumotida</b>; hodisada <b>ma'lumot vs konvert</b>",
    "Yonma-yon qarang. Bizda token auth'da, manzilda ko'rinmaydi; AI'da savol belgisi token, manzil satrida, brauzer tarixida, server va hosting loglarida qoladi. Bizda hodisa konvert, ma'lumot token bilan so'rovda; AI'da hodisaning o'zida. Ikkala yo'l ham ishlaydi, lekin bularni siz tanlaysiz."
   ],
   [
    "d",
    "Xulosa: AI real vaqt kodiga <b>to'rt savol</b>: kutubxona · token qayerda · hodisada nima · mavjud fayllardan nima o'zgardi",
    "Xulosa, to'rt savol. Qaysi kutubxona, o'quvchi darsidagi socket.io'mi. Token qayerda, manzilda emasmi. Hodisada nima bor va uni kim oladi. Mavjud fayllardan nimasi o'zgardi: ikkalasi order service va uning testini o'zgartirgan, diff'ni o'qing. Endi tekshirib olaylik."
   ]
  ]
 },
 "19": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "AI paneli ws://…/ws/orders?token=panel-sir ga ulanadi. Ishlaydi, server tokenni tekshiradi. Bu yerda nima xavf?",
  "q": "AI panellarini ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. AI paneli tokenni manzilga qo'shib ulanadi, savol belgisi token. Server uni tekshiradi, hammasi ishlaydi. Bu yerda nima xavf? Variantni tanlang.",
  "ok": "To'g'ri. Tekshiruv ishlaydi, xavf boshqa joyda: manzil ko'p joyga yoziladi. Brauzer tarixi, server va proxy loglari, hosting monitoringi, ularning hammasida token ochiq qoladi. Socket.io'da token auth bilan, ulanish ma'lumotida ketadi. Demak, maxfiy qiymat manzilga emas, sarlavha yoki ulanish ma'lumotiga yoziladi.",
  "okShort": "Manzil loglarga va tarixga yoziladi — token u yerda ochiq qoladi. <code>auth</code> / sarlavha — xavfsizroq.",
  "hint": "Manzil satridagi matn qayerlarga yozilib qoladi?",
  "demak": "Maxfiy qiymat manzilga yozilmaydi: manzil tarix va loglarga tushadi; token — <code>auth</code> yoki sarlavhada.",
  "correct": 0,
  "opts": [
   "Token manzil bilan birga brauzer tarixi va server, proxy loglarida qoladi",
   "Hech qanday — server tokenni tekshiryapti, shu yetarli",
   "WebSocket manzildagi tokenni qabul qilmaydi, ulanish yiqiladi",
   "Token manzilda bo'lsa, server uni har hodisada qayta tekshiradi va sekinlashadi"
  ],
  "wrong": {
   "1": "Tekshiruv bor, lekin token manzil bilan loglarga yoziladi — kim o'qisa, panelga kiradi.",
   "2": "Qabul qiladi — ulanish ishladi (ws1v2-ai/ai2/04); muammo xavfsizlikda.",
   "3": "Token faqat ulanishda tekshiriladi; tezlikka ta'siri yo'q."
  }
 },
 "20": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "O'z AI'ingizga panelga yangi hodisa qo'shtiring — bekor qilingan buyurtma qizil bo'lsin; to'rt savol bilan qabul qiling, smoke bilan tekshiring",
  "seg": [
   [
    "a",
    "Endi siz: AI'ga <b>aniq shartli prompt</b> — bekor qilingan buyurtma panelda qizil",
    "Endi navbat sizga. O'z AI'ingizga panelga kichik o'zgarish qildirasiz: bekor qilingan buyurtma qatori qizil bo'lsin va panel tepasida bugungi buyurtmalar soni chiqsin. Promptni pastdagi tugma bilan nusxalaysiz. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: prompt va <b>to'rt savol</b> — kutubxona, token, hodisa, o'zgargan fayllar",
    "Birinchi qadamda promptni berasiz. Ikkinchisida natijani to'rt savol bilan o'qiysiz: socket.io qoldimi, token manzilga chiqmadimi, hodisada faqat raqam va sababmi, git diff stat'da qaysi fayllar o'zgardi."
   ],
   [
    "c",
    "3–4-qadam: <b><code>npm test</code>, <code>npm run smoke -- live</code></b>, brauzerda bekor qiling; isbot — smoke natijasi",
    "Uchinchi qadamda npm test va npm run smoke live. To'rtinchisida brauzerda panelni ochib, botda buyurtmani bekor qilasiz: qator qizil bo'lishi kerak. Isbot maydoniga smoke'ning natija satrini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz AI yozgan real vaqt kodini to'rt savol bilan qabul qilasiz."
   ]
  ],
  "steps": [
   {
    "t": "Prompt",
    "cmds": [
     "yuqoridagi prompt — o'z AI'ingizga"
    ],
    "exp": "o'zgargan fayllar ro'yxati"
   },
   {
    "t": "To'rt savol",
    "cmds": [
     "git diff --stat — faqat public/admin.html (va kerak bo'lsa admin.controller.ts)",
     "grep -n \"io(\" public/admin.html — auth: { token }",
     "grep -n \"emit\" src/api/live/live.gateway.ts — { orderId, reason }",
     "grep -n \"esc(\" public/admin.html"
    ],
    "exp": "4 ✓"
   },
   {
    "t": "Testlar",
    "cmds": [
     "npm test",
     "npm run smoke -- live"
    ],
    "exp": "Tests: 32 passed · NATIJA: 4/4 ✓"
   },
   {
    "t": "Brauzer",
    "cmds": [
     "panel ochiq → botda /orders → «❌ Bekor»"
    ],
    "exp": "qator qizil, son yangilandi"
   }
  ],
  "proof": {
   "label": "npm run smoke -- live natija satri",
   "placeholder": "masalan: NATIJA: 4/4 ✓",
   "re": "NATIJA:\\s*4\\/4",
   "flags": "",
   "wrong": "AI o'zgartirgandan keyin npm run smoke -- live yurgizing va NATIJA: … satrini qo'ying."
  },
  "trouble": [
   [
    "git diff --stat da order.service.ts yoki telegram.service.ts",
    "AI tegmasligi kerak bo'lgan faylga tegdi — git checkout -- src/api/order src/api/telegram, shartni takrorlang"
   ],
   [
    "AI ws paketini o'rnatdi",
    "«socket.io qolsin» bandini takrorlang; git checkout -- package.json package-lock.json"
   ],
   [
    "smoke live ✗ «order-changed null»",
    "hodisa tarkibi yoki nomi o'zgargan — live.gateway.ts diff'ini o'qing"
   ],
   [
    "Qator qizil emas",
    "holat CANCELLED mi? panel ro'yxatni qayta so'radimi (F12 → Network)"
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m10-02 · «WebSocket: ekran o'zi yangilanadigan ulanish»",
  "title": "O'quvchi darsi: Maydon Jamoa'dagi «8 / 10» — siz bugun panelda qilgan narsaning telefondagi varianti, socket.io bilan",
  "seg": [
   [
    "a",
    "m10-02 — 20 ekran: <b>Maydon Jamoa, «8 / 10»</b> — ikki telefon, biri eski son ko'rsatadi",
    "Endi sinfga tayyorgarlik. O'quvchi darsi m10-02, yigirma ekran. Misol Maydon Jamoa: futbol o'yiniga yozilish ilovasi. Ikki telefon: biri qo'shiladi, ikkinchisida eski sakkizdan o'n turadi. Siz bugun panelda ko'rgan muammo, telefonda."
   ],
   [
    "b",
    "O'quvchi ham <b>socket.io, token, konvert va uch belgi</b> — siz bilgan qoidalar",
    "O'quvchi darsidagi qoidalar sizniki bilan bir xil: socket.io, token ulanishda, konvert ichida son yo'q, ilova qayta so'raydi, va uch belgi. Faqat o'quvchida ilova telefon, server Render'da. Shuning uchun AI xom ws yozsa, o'quvchi darsi bilan to'qnashadi."
   ],
   [
    "c",
    "Bloklar: <b>og'ir joy — 9-ekran kod oynasi va birinchi amaliyot</b>",
    "Bloklar jadvaliga qarang. Og'ir joy to'qqizinchi ekrandagi kod oynasi va birinchi amaliyot: Backend, ilova va Render birga. Ikkinchi, to'rtinchi, beshinchi ekranlarga ortiqcha vaqt bermang. Har blokda siz qo'shadigan narsa o'ng ustunda."
   ],
   [
    "d",
    "Xulosa: repo <b><code>m12-dars-02</code> da hodisa yo'q, <code>m12-dars-03</code> da bor</b> — o'quvchi farqni ko'rsin",
    "Xulosa: o'quvchi loyihasida ikki teg muhim. Birinchisida ulanish bor, hodisa yo'q: son o'zi o'zgarmaydi, bu xato emas. Ikkinchisida hodisa bor. Sinfda ikkalasini ko'rsating: ulanish bilan hodisa alohida narsa."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "Yo'l, konvert, belgi, tinglovchi — atama bilan birga; README «Real vaqt» jadvali: OrderBotNest'da ham, Maydon Jamoa'da ham besh ustun",
  "seg": [
   [
    "a",
    "O'quvchi so'zlari: <b>ochiq yo'l — doimiy ulanish, konvert — hodisa</b>",
    "O'quvchi darsidagi so'zlar: yopiq yo'l so'rov–javob, ochiq yo'l doimiy ulanish, konvert hodisa, belgi ulanish holati, tinglovchi ulanish on. O'quvchi so'zni aytganda, siz yonida atamani ayting: konvert, ya'ni hodisa, bizda order changed."
   ],
   [
    "b",
    "README jadvali: <b>nuqta · kim nima qiladi · hodisa · kim oladi · ekranda nima</b>",
    "OrderBotNest README'sida jonli panel jadvali: real vaqt nuqtasi, kim nima qiladi, hodisa va sabab, kim oladi, panelda nima o'zgaradi. Ikki qator: yangi buyurtma va holat. O'quvchi o'z loyihasi uchun aynan shunday jadval yozadi."
   ],
   [
    "c",
    "Maydon Jamoa'da <b>besh sabab, bitta hodisa</b> — <code>oyin-ozgardi</code>",
    "Maydon Jamoa'da jadval besh qator: qo'shildi, chiqdi, tasdiqladi, navbatga yozildi, e'lon berildi. Hodisa bitta, sabablar besh. Kurs qoidasi: hodisa nomi kichik harf va chiziqcha bilan, bo'lib o'tgan ish: oyin ozgardi, order changed."
   ],
   [
    "d",
    "Xulosa: o'quvchi kodida <b>tinglovchi <code>connect</code> ichida</b> — bu keyingi darsning birinchi muammosi",
    "Xulosa va bitta ogohlantirish. O'quvchi loyihasining ulanish ts faylida hodisa tinglovchisi connect ichida qo'shiladi. Har qayta ulanishda yana bittasi qo'shiladi. Hozir ishlaydi, keyingi WebSocket darsida buni buzib ko'ramiz. Sinfda tuzatmang, belgilab qo'ying."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "Belgidan va server terminalidan sabab topiladi: oltita holat, har biri o'z xabari bilan — va o'quvchi so'raydigan to'rt savol",
  "seg": [
   [
    "a",
    "Birinchi uchtasi <b>belgidan</b> taniladi: qizil, sariq-yashil, o'zgarmagan",
    "Sinfda uchraydigan olti holat. Birinchi uchtasi belgidan taniladi. Belgi bir lahza yashil, keyin qizil: token, qayta kirish. Sariqdan yashilga: server qayta yondi, normal. Uchish rejimida belgi o'zgarmadi: qirq besh soniyagacha kuting."
   ],
   [
    "b",
    "Qolgan uchtasi: <b>son o'zgarmadi, Render cho'zildi, «null»</b> — terminaldan",
    "To'rtinchisi: son o'zi o'zgarmadi, o'quvchi hali hodisasiz tegda, xato emas. Beshinchisi: birinchi ulanish cho'zildi, Render uxlagan, bir daqiqa. Oltinchisi: server terminalida o'yinchi null, sabab return yo'q, oltinchi ekrandagi buzilish."
   ],
   [
    "c",
    "O'quvchi savollari: <b>socket.io nima, nega son yo'q, uzilgan hodisa, token muddati</b>",
    "O'quvchi savollariga tayyor javoblar pastda, bosib oching: WebSocket va socket.io farqi, nega hodisada son yo'q, uzilgan paytdagi hodisa keyin keladimi, token muddati tugasa nima bo'ladi."
   ],
   [
    "d",
    "Xulosa: <b>avval belgiga, keyin server terminaliga</b> qarang — sabab shu ikkisida",
    "Xulosa: o'quvchi ekran o'zgarmayapti desa, u bilan birga avval belgiga, keyin server terminaliga qarang. Sabab deyarli doim shu ikkisidan birida. Shu bilan sinfga tayyorsiz. Endi o'zingizni tekshiring."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Panel GET /admin/orders ni bir marta so'radi. Keyin bot buyurtma oldi. Oddiy HTTP'da panel nima biladi?",
    "o": [
     "Hech narsa — server so'ralmaguncha javob bermaydi",
     "Server javobni o'zi qayta yuboradi",
     "Brauzer o'zgarishni o'zi sezib yangilaydi",
     "HTTP ulanishi ochiq qoladi va server yangisini o'zi yuboradi"
    ],
    "c": 0,
    "e": "So'rov–javobda server o'zi gapirmaydi.",
    "s": 2
   },
   {
    "q": "Gateway tokenni qayerdan o'qiydi?",
    "o": [
     "So'rov sarlavhasidagi Authorizationdan",
     "client.handshake.auth.token — ulanish ma'lumotidan",
     "Har hodisa bilan kelgan maydondan",
     ".env dagi ADMIN_PANEL_TOKENdan — klient hech narsa yubormaydi"
    ],
    "c": 1,
    "e": "Token ulanish ochilayotganda keladi.",
    "s": 4
   },
   {
    "q": "disconnect() dan keyin return yo'q. Tokensiz klient bilan nima bo'ladi?",
    "o": [
     "Klient ulangan qoladi va keyingi hodisalarni ham oladi, token tekshirilmaydi",
     "Server xato beradi va to'xtaydi",
     "Klient yopiladi, lekin server logi «panel ulandi» yozadi",
     "Klient qayta-qayta ulanishga urinadi"
    ],
    "c": 2,
    "e": "disconnect() funksiyadan chiqmaydi.",
    "s": 6
   },
   {
    "q": "Hodisa order-changed ichida nima bor?",
    "o": [
     "Butun ro'yxat — panel to'g'ridan chizadi",
     "Mijoz ismi, telefoni va mahsulotlari — panel shundan chizadi",
     "Yangi buyurtma HTML'i — sahifaga qo'yiladi",
     "orderId va reason — panel ro'yxatni qayta so'raydi"
    ],
    "c": 3,
    "e": "Konvert: «nimadir o'zgardi».",
    "s": 8
   },
   {
    "q": "ulanish.on('order-changed', () => yukla). Hodisa keldi. Nima bo'ladi?",
    "o": [
     "Ro'yxat yangilanadi, lekin biroz kechikib",
     "Tinglovchi ishlaydi, yukla chaqirilmaydi — ro'yxat eski",
     "Brauzer konsolida xato chiqadi",
     "Hodisa tinglovchiga umuman yetib kelmaydi — server yubormaydi"
    ],
    "c": 1,
    "e": "Qavssiz — funksiya qaytariladi.",
    "s": 11
   },
   {
    "q": "Server to'xtadi. Klient nima ko'radi?",
    "o": [
     "io server disconnect — qayta urinmaydi",
     "ping timeout — 45 soniya kutadi, keyin o'zi qayta ulanadi",
     "transport close, active=true — o'zi qayta urinadi",
     "Hech narsa — ulanish o'zi yopilmaydi"
    ],
    "c": 2,
    "e": "Tarmoq uzdi — klient taslim bo'lmaydi.",
    "s": 14
   },
   {
    "q": "Wi-Fi o'chdi, ulanish rasman uzilmadi. Belgi qachon o'zgaradi?",
    "o": [
     "Darhol — brauzer socket.io'ga aytadi",
     "Hech qachon — uzilish bo'lmagani uchun",
     "Keyingi buyurtmada — server xato qaytaradi",
     "45 soniyagacha — ping timeout bilan"
    ],
    "c": 3,
    "e": "25 + 20 s qoidasi.",
    "s": 15
   },
   {
    "q": "AI paneli …/ws/orders?token=… ga ulanadi va ishlaydi. Asosiy savol?",
    "o": [
     "Token manzilda — tarix va loglarga yoziladi",
     "Ishlayapti — demak qabul qilsa bo'ladi",
     "ws sekin — socket.io tezroq ishlaydi",
     "Manzil uzun — brauzer uni qisqartirib, tokenni kesib yuboradi"
    ],
    "c": 0,
    "e": "Maxfiy qiymat manzilga yozilmaydi.",
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
