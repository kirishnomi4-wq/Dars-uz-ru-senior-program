
// ============================================================
//  PG-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/pg2-matn.py (manba: 08-PostgreSQL2-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · PostgreSQL",
  "title": "Jadval tayyor. Endi uni boshqaramiz — PostgreSQL terminalida va Express ichida",
  "seg": [
   [
    "a",
    "PostgreSQL-1 da jadval yaratdingiz — bugun undagi ma'lumotni <b>to'rt buyruq bilan boshqarasiz</b>",
    "Assalomu alaykum. Oldingi darsda PostgreSQL'ni o'rnatdingiz, jadval yaratdingiz va bog'ladingiz. Bugun jadvaldagi ma'lumotni boshqaramiz: qo'shish, ko'rish, o'zgartirish va o'chirish. Buni CRUD deyishadi, uning nimaligini keyingi ekranda aniq ko'ramiz."
   ],
   [
    "b",
    "Avval buyruqlar terminalda — va har birining <b>ichida nima bo'lishi</b>: son, tartib, tranzaksiya",
    "Avval buyruqlarni terminalda qo'lda yozamiz va har birining ichida nima bo'lishini ko'ramiz: javobdagi son nimani sanaydi, nega qatorlar tartibi o'zgaradi, tranzaksiya ichida baza nima qiladi. Misolimiz kichik do'kon: klaviatura, sichqoncha, quloqchin, kolonka."
   ],
   [
    "c",
    "Keyin o'sha so'rovlar Express ichida: <b><code>Pool</code> nima, nega <code>$1</code></b>, server nega 500 beradi",
    "Keyin xuddi shu so'rovlarni Express serveri ichiga qo'yamiz. Pool nimaligini, nega qiymatlar dollar bir bilan berilishini, server qachon va nega besh yuz qaytarishini o'zingiz sinab ko'rasiz. Serverni ataylab buzamiz va tuzatamiz. Keyin AI yozgan SQL'ni bazada tekshiramiz."
   ],
   [
    "d",
    "Yetti bosqich, to'rt amaliyot; oxirida <b>ikki ekran sinfga tayyorgarlik</b>. Shoshilmang",
    "Dars yetti bosqichdan iborat, orasida to'rtta amaliyot bor. Oxirgi ikki ekran sinfga tayyorgarlik: o'quvchi darslari xaritasi va o'quvchilar xato qiladigan joylar. Shoshilmang: har ekranni boshidan eshitish va matnini o'qish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD terminalida",
  "title": "CRUD — ma'lumot bilan qilinadigan to'rt amal: bazada buyruq, serverda endpoint",
  "seg": [
   [
    "a",
    "CRUD — to'rtta inglizcha so'zning <b>bosh harfi</b>: yaratish, o'qish, o'zgartirish, o'chirish",
    "Bugungi darsning poydevori bitta so'z: CRUD. Bu to'rtta inglizcha so'zning bosh harfi: Create, Read, Update va Delete, ya'ni yaratish, o'qish, o'zgartirish va o'chirish. Har qanday ilova ma'lumot bilan aynan shu to'rt ishni qiladi: onlayn do'kon ham, Telegram ham."
   ],
   [
    "b",
    "PostgreSQL'da har amalning <b>o'z buyrug'i bor</b>: <code>INSERT</code>, <code>SELECT</code>, <code>UPDATE</code>, <code>DELETE</code>",
    "PostgreSQL'da har amalning o'z buyrug'i bor: insert, select, update va delete. Siz bilgan Mongoose'da bular create, find, updateOne va deleteOne edi. Ma'nosi bir xil, faqat yozilishi boshqa. Har buyruqdan keyin baza qisqa javob qaytaradi, masalan update bir. Mongo'da uning o'rnida matchedCount bir chiqardi."
   ],
   [
    "c",
    "Serverda xuddi shu to'rt amal <b>endpoint bo'ladi</b>: <code>POST</code>, <code>GET</code>, <code>PUT</code>, <code>DELETE</code>",
    "Serverda xuddi shu to'rt amal endpoint bo'ladi. Yaratish POST, o'qish GET, o'zgartirish PUT, o'chirish DELETE. Har endpoint ichida o'sha SQL buyrug'i turadi. Javobda status chiqadi: yaratilganda ikki yuz bir, qolganlarida ikki yuz."
   ],
   [
    "d",
    "Xulosa: har amalning bazada <b>bitta buyrug'i</b>, serverda bitta endpoint'i bor",
    "Xulosa: CRUD to'rtta amal. Har amalning PostgreSQL'da bitta buyrug'i va serverda bitta endpoint'i bor. Bugun avval buyruqlarni terminalda qo'lda yozamiz va ichini ko'ramiz, keyin xuddi shularni Express serveri ichiga qo'yamiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD terminalida",
  "title": "products — to'rt ustun, to'rt mahsulot; id ni baza o'zi beradi",
  "seg": [
   [
    "a",
    "Mongo'da baza va kolleksiya o'zi paydo bo'lardi — bu yerda <b>avval <code>CREATE DATABASE</code>, keyin jadval</b>",
    "Siz bilgan Mongoose'da connect yetardi: baza ham, kolleksiya ham birinchi create'da o'zi paydo bo'lardi. PostgreSQL'da avval create database bilan baza, keyin create table bilan jadval yaratiladi. Jadval products, to'rt ustun: id o'zi o'sadi, name matn, price va stock butun son. Hozircha ustunlarda qoida yo'q, bu ataylab."
   ],
   [
    "b",
    "Bitta <code>INSERT</code> bilan to'rt qator; javob <code>INSERT 0 4</code> — <b>oxirgi raqam qo'shilgan qatorlar soni</b>",
    "Bitta insert bilan to'rtta mahsulot qo'shamiz. Baza javobi insert, nol, to'rt. Oxirgi raqam nechta qator qo'shilganini aytadi. O'rtadagi nol eski versiyalardan qolgan, u hech narsani bildirmaydi, unga qaramang."
   ],
   [
    "c",
    "<code>SELECT *</code> — hamma ustun; <code>id</code> larni biz yozmadik, <b>baza o'zi berdi</b>: <code>SERIAL</code>",
    "Select yulduzcha hamma ustunni ko'rsatadi. id ustunini biz yozmadik, baza o'zi bir, ikki, uch, to'rt deb berdi. Buni serial qiladi: ichida alohida hisoblagich bor, har yangi qatorga keyingi sonni beradi. Qator o'chirilsa ham hisoblagich orqaga qaytmaydi."
   ],
   [
    "d",
    "Xulosa: jadval tayyor — <b>hech qanday qoidasiz</b>; baza faqat yozilgan qoidani qo'riqlaydi",
    "Xulosa: bazangizda to'rt mahsulotli do'kon bor. Bitta narsani eslab qoling: bu jadvalda hozircha not null ham, boshqa qoida ham yo'q. Baza faqat yozilgan qoidani qo'riqlaydi. Nima bo'lishini uchinchi bosqichda o'z ko'zingiz bilan ko'rasiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD terminalida",
  "title": "WHERE — minglab qatordan faqat keraklisi",
  "seg": [
   [
    "a",
    "Hamma ustun kerak bo'lmasa — <code>SELECT</code>dan keyin <b>faqat kerakli ustunlar</b> yoziladi",
    "Jadval bor, endi undan o'qiymiz. Hamma ustun kerak bo'lmasa, select'dan keyin faqat keraklisini yozasiz: nom va narx. Ma'lumot o'zgarmaydi, select faqat ko'rsatadi."
   ],
   [
    "b",
    "<code>WHERE price &lt; 100000</code> — yuz mingdan arzonlari: <b>uchta mahsulot</b>",
    "Minglab mahsulotdan faqat keraklisini olish uchun where yoziladi. Narxi yuz mingdan kam bo'lganlarini so'raymiz: sichqoncha, quloqchin va kolonka, uchta qator. Where har qatorni shartga solishtiradi va faqat to'g'ri chiqqanlarini qaytaradi. Mongoose'da bu find ichidagi dollar lt shart edi."
   ],
   [
    "c",
    "<code>WHERE stock &lt; 6</code> — tugayotgan mahsulot: <b>faqat quloqchin</b>",
    "Ikkinchi filtr qoldig'i oltidan kam, ya'ni tugayotgan mahsulotlarni topadi. Natijada faqat quloqchin chiqdi, undan beshta qolgan. Do'kon menejeri aynan shu so'rov bilan nimani buyurtma qilishni biladi."
   ],
   [
    "d",
    "Xulosa: <code>SELECT</code> faqat o'qiydi; <b><code>WHERE</code> qatorlarni tanlaydi</b> — <code>UPDATE</code> va <code>DELETE</code>da ham aynan shu",
    "Xulosa: select hech narsani o'zgartirmaydi, faqat o'qiydi. Where qaysi qatorlar kerakligini aytadi. Keyingi ekranda update va delete'ni ko'rasiz: ularda ham aynan shu where ishlaydi, faqat endi u qaysi qatorlar o'zgarishini hal qiladi."
   ]
  ]
 },
 "5": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD terminalida",
  "title": "UPDATE 1, DELETE 1, UPDATE 0 — javobdagi son nechta qator tegilganini aytadi",
  "seg": [
   [
    "a",
    "Klaviatura arzonladi: <code>UPDATE … WHERE id = 1</code> — javob <b><code>UPDATE 1</code></b>, bitta qator",
    "Klaviatura narxi to'qson to'qqiz mingga tushdi. Buyruq: update products set price, where id bir. Baza javobi update bir: bitta qator o'zgardi. Javobdagi son doim nechta qator tegilganini aytadi, bu update'da ham, delete'da ham shunday."
   ],
   [
    "b",
    "Quloqchin sotuvdan chiqdi: <code>DELETE … WHERE id = 3</code> — <b><code>DELETE 1</code></b>",
    "Quloqchin sotuvdan chiqdi, uni o'chiramiz: delete from products, where id uch. Baza javobi delete bir. Qator butunlay ketdi, uning id'si esa qayta ishlatilmaydi."
   ],
   [
    "c",
    "Bunday <code>id</code> yo'q bo'lsa — <b>xato emas</b>, <code>UPDATE 0</code> va <code>DELETE 0</code>",
    "To'qson to'qqizinchi mahsulotni o'zgartirib ko'ramiz. Xato chiqmaydi, javob update nol. Delete ham nol qaytaradi. Baza «bunday qator yo'q» demaydi: where hech qaysi qatorga mos kelmadi, shuning uchun hech narsaga tegmadi. Mongo'dagi matchedCount nol ham xuddi shu. Bu xato emas, bu javob."
   ],
   [
    "d",
    "<code>RETURNING</code> — baza o'zgargan <b>qatorning o'zini qaytaradi</b>; mos qator bo'lmasa <code>(0 rows)</code>",
    "Bitta klaviatura sotildi: qoldiqni bittaga kamaytiramiz. Yangi qoldiq nechta bo'lganini siz hisoblamaysiz, buyruq oxiriga returning yozasiz va baza o'zgargan qatorni qaytaradi: klaviatura, yetti. To'qson to'qqizinchi id bilan returning nol qator beradi. Serverda aynan shu returning ishlatiladi."
   ],
   [
    "e",
    "Xulosa: har <code>UPDATE</code> va <code>DELETE</code>dan keyin <b>javobdagi sonni o'qing</b>",
    "Xulosa: update va delete'dan keyin javobdagi sonni o'qing. Bir bo'lsa, kutganingiz bo'ldi. Nol bo'lsa, where hech narsaga mos kelmadi. Kutilmagan katta son bo'lsa, where noto'g'ri yoki umuman yozilmagan. Buni ikkinchi bosqichda xavfsiz ko'ramiz."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "1-bosqich · ichida nima bo'ladi",
  "title": "UPDATEdan keyin qator joyi o'zgardi — baza yangilangan qatorni yangi joyga yozadi",
  "seg": [
   [
    "a",
    "<code>SELECT *</code> — Klaviatura <b>ro'yxat oxiriga tushdi</b>. Bu xato emas, lekin sababini bilish kerak",
    "Oldingi ekrandagi buyruqlardan keyin select qilamiz va natijaga qarang: uchta mahsulot qoldi, klaviatura esa birinchi emas, oxirida turibdi. Bu xato emas. Lekin «tasodif» deb qo'ya qolmaymiz: nega shunday bo'lganini bilish kerak, chunki bu savol albatta beriladi."
   ],
   [
    "b",
    "Sabab: PostgreSQL yangilangan qatorni <b>joyida o'zgartirmaydi</b> — yangi nusxasini bo'sh joyga yozadi",
    "Sabab bazaning ichida. PostgreSQL update'da qatorni joyida o'zgartirmaydi: eski nusxani «eskirgan» deb belgilaydi, yangisini fayldagi bo'sh joyga, bu yerda oxiriga yozadi. Eski nusxa keyinroq tozalanadi. Select yulduzcha esa qatorlarni fayldagi tartibda o'qiydi."
   ],
   [
    "c",
    "Isbot: <code>ctid</code> — qatorning fayldagi manzili; Klaviatura endi <code>(0,6)</code>: <b>ikki o'zgarish — ikki yangi nusxa</b>",
    "Buni ko'rsa bo'ladi. Har qatorning ctid degan yashirin ustuni bor: bu uning fayldagi manzili, sahifa va o'rin. Select ctid qilsak, klaviatura nol vergul olti, ya'ni oltinchi o'rinda. Klaviatura ikki marta o'zgardi: avval narxi, keyin qoldig'i. Har safar baza yangi nusxa yozdi: beshinchi, keyin oltinchi o'rinda. Shuning uchun u oxirida chiqdi."
   ],
   [
    "d",
    "Xulosa: tartib kerak bo'lsa — <b><code>ORDER BY id</code></b>; usiz tartib hech qachon kafolatlanmaydi",
    "Xulosa: order by yozilmasa, baza qatorlarni fayldagi tartibda beradi, bu tartib esa har update'dan keyin o'zgarishi mumkin. Tartib kerak bo'lsa, oxiriga order by id yoziladi, shunda klaviatura yana birinchi. «Mahsulot o'rni o'zgardi» degan savolning javobi shu: order by yo'q edi."
   ]
  ]
 },
 "7": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 5",
  "title": "Buyruq xatosiz o'tdi, javob UPDATE 0. Bu nimani bildiradi?",
  "q": "Javobdagi sonni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Ekrandagi terminalda to'qson to'qqizinchi mahsulot narxi o'zgartirilmoqchi bo'ldi. Xato yo'q, javob: update nol. Bu nimani bildiradi? Variantni tanlang.",
  "ok": "To'g'ri. Where id to'qson to'qqiz hech qanday qatorga mos kelmadi, shuning uchun nol qator o'zgardi. Baza buni xato deb hisoblamaydi. Ishonch hosil qilish uchun select bilan bunday id bor-yo'qligini tekshiring, ekranda shu select turibdi. Demak, update nol xato emas: where hech qaysi qatorga mos kelmaganini bildiradi.",
  "okShort": "<code>UPDATE 0</code> — <code>WHERE</code> hech bir qatorga mos kelmadi. Xato emas: <code>SELECT … WHERE id = 99</code> ham bo'sh qaytaradi.",
  "hint": "Javobdagi son nimani sanaydi? WHERE qaysi qatorni topishi kerak edi?",
  "demak": "<code>UPDATE 0</code> xato emas: <code>WHERE</code> hech qaysi qatorga mos kelmaganini bildiradi.",
  "correct": 0,
  "opts": [
   "id = 99 yo'q — WHERE hech qatorga mos kelmadi",
   "Narxni o'zgartirishga foydalanuvchida ruxsat yo'q",
   "Jadval bo'shab qoldi — qator o'chirildi",
   "Narx o'zgardi, lekin hali COMMIT bo'lmadi"
  ],
  "wrong": {
   "1": "Ruxsat yo'q bo'lsa ERROR:  permission denied for table products chiqardi; bu yerda xato yo'q.",
   "2": "Jadval joyida: UPDATE 0 hech narsani o'chirmaydi.",
   "3": "Tranzaksiyasiz UPDATE darhol saqlanadi; son esa nechta qator tegilganini aytadi."
  }
 },
 "8": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 4",
  "eyebrow": "Hozir o'zingizda · 10–15 daqiqa",
  "title": "shop bazasi va CRUD — to'rt buyruq, har javobdagi son",
  "seg": [
   [
    "a",
    "Endi siz: <b>o'z bazangizda</b> jadval, to'rt mahsulot, ikki filtr, narx va o'chirish",
    "Endi navbat sizga. O'z bazangizda shu ishlarni qilasiz: jadval yaratasiz, to'rt mahsulot qo'shasiz, ikki filtr yozasiz, keyin narxni o'zgartirib, bitta mahsulotni o'chirasiz. Bunga o'n-o'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–3-qadam: baza, jadval, mahsulotlar va <b>ikki filtr</b>",
    "Birinchi qadamda shop bazasi va products jadvalini yaratasiz. Ikkinchisida to'rtta mahsulotni bitta insert bilan qo'shasiz va javobdagi to'rtni ko'rasiz. Uchinchisida ikkita filtr yozasiz: arzonlarini va tugayotganlarini. Har buyruqdan keyin javob satrini o'qing."
   ],
   [
    "c",
    "4-qadam: narx va o'chirish; isbot — <b>oxirgi <code>SELECT</code>dagi qatorlar soni</b>",
    "To'rtinchi qadamda klaviatura narxini o'zgartiring, quloqchinni o'chiring va select yulduzcha qiling. Klaviatura qayerda turganiga e'tibor bering. Isbot maydoniga oxirgi select natijasi ostidagi qatorlar sonini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz CRUD'ning to'rt buyrug'ini o'z bazangizda yozgan va har javobdagi sonni o'qigan bo'lasiz."
   ]
  ],
  "steps": [
   {
    "t": "Baza va jadval",
    "cmds": [
     "psql -U postgres",
     "CREATE DATABASE shop;",
     "\\c shop",
     "CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, price INTEGER, stock INTEGER);"
    ],
    "exp": "CREATE DATABASE · CREATE TABLE"
   },
   {
    "t": "Mahsulotlar",
    "cmds": [
     "INSERT INTO products (name, price, stock) VALUES ('Klaviatura', 120000, 8), ('Sichqoncha', 75000, 15), ('Quloqchin', 95000, 5), ('Kolonka', 50000, 10);"
    ],
    "exp": "INSERT 0 4"
   },
   {
    "t": "Filtrlar",
    "cmds": [
     "SELECT * FROM products WHERE price < 100000;",
     "SELECT * FROM products WHERE stock < 6;"
    ],
    "exp": "3 qator · 1 qator (Quloqchin)"
   },
   {
    "t": "Narx va o'chirish",
    "cmds": [
     "UPDATE products SET price = 99000 WHERE id = 1;",
     "DELETE FROM products WHERE id = 3;",
     "SELECT * FROM products;"
    ],
    "exp": "UPDATE 1 · DELETE 1 · (3 rows), Klaviatura oxirida"
   }
  ],
  "proof": {
   "label": "Oxirgi SELECT * natijasidagi qatorlar soni",
   "placeholder": "natija ostidagi sonni yozing",
   "re": "^\\s*\\(?\\s*3\\b",
   "flags": "",
   "wrong": "To'rt mahsulotdan bittasi o'chirilgach nechta qoladi? Natija ostidagi qavsdagi sonni yozing."
  },
  "trouble": [
   [
    "ERROR:  database \"shop\" already exists",
    "baza oldin yaratilgan — \\c shop"
   ],
   [
    "ERROR:  relation \"products\" does not exist",
    "boshqa bazadasiz (prompt postgres=#) — \\c shop"
   ],
   [
    "INSERT 0 4 ikki marta",
    "mahsulotlar ikki marta qo'shilgan — id lar 1–8; 4-qadamda idni SELECT bo'yicha tanlang"
   ],
   [
    "UPDATE 0 / DELETE 0",
    "bunday id yo'q — avval SELECT * bilan idni ko'ring"
   ],
   [
    "Klaviatura oxirida",
    "xato emas — 6-ekran: ORDER BY id bilan tartiblang"
   ],
   [
    "ERROR:  syntax error at or near \"…\"",
    "^ ko'rsatgan joydan oldin vergul, qavs yoki tirnoq tushib qolgan"
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "2-bosqich · tranzaksiya",
  "title": "WHERE unutilsa — UPDATE 3, DELETE 3. Xavfsiz sinash: BEGIN … ROLLBACK",
  "seg": [
   [
    "a",
    "<code>WHERE</code>'siz <code>UPDATE</code> yoki <code>DELETE</code> — <b>hamma qator</b>. Buni ko'rish kerak, lekin bazani buzmasdan",
    "Javobdagi son kutilmagan katta bo'lsa, where yo'q edi, degandim. Buni o'z ko'zingiz bilan ko'rishingiz kerak, lekin bazani buzmasdan. Usul: avval begin, ya'ni tranzaksiya ochamiz. Undan keyingi hamma narsa vaqtincha bo'ladi."
   ],
   [
    "b",
    "<code>WHERE</code>'siz <code>UPDATE</code> — <code>UPDATE 3</code>: <b>hamma mahsulot to'qson to'qqiz ming</b>",
    "Begin'dan keyin where'siz update. Baza javobi update uch. Select qilsak, hamma mahsulot to'qson to'qqiz ming so'm: sichqoncha ham, kolonka ham. Bitta unutilgan where butun narx ro'yxatini buzdi. Mongo'dan kelganlar aynan shu yerda xato qiladi: u yerda updateOne bitta hujjatga tegardi, bu yerda where yo'q bo'lsa hamma qator o'zgaradi."
   ],
   [
    "c",
    "<code>WHERE</code>'siz <code>DELETE</code> — <code>DELETE 3</code>, <b>jadval bo'sh</b>",
    "Undan ham yomoni where'siz delete. Baza javobi delete uch, select esa nol qator qaytaradi. Haqiqiy do'konda bu butun katalog yo'qolgani. Lekin biz tranzaksiya ichidamiz."
   ],
   [
    "d",
    "<code>ROLLBACK</code> — hammasi joyida: <b>tranzaksiya ichidagi o'zgarish bekor bo'ldi</b>",
    "Endi rollback yozamiz va select qilamiz: uchala mahsulot joyida, narxlari ham eski. Tranzaksiya ichida qilingan hamma narsa bekor bo'ldi. PostgreSQL-1 da tranzaksiya do'konni himoya qilgan edi, bu yerda u sizning sinov maydoningiz."
   ],
   [
    "e",
    "Xulosa: xavfli <code>UPDATE</code>/<code>DELETE</code>ni avval <b><code>BEGIN</code> ichida sinang</b>, <code>SELECT</code> bilan ko'ring",
    "Xulosa: xavfli update yoki delete'ni avval begin ichida yurgizing, select bilan natijani ko'ring. To'g'ri bo'lsa commit, noto'g'ri bo'lsa rollback. Bu bitta qator, lekin butun jadvalni saqlab qoladi. Keyingi ekranda tranzaksiya ichida baza aslida nima qilishini ko'ramiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "2-bosqich · ichida nima bo'ladi",
  "title": "Har buyruq o'zi saqlanadi; BEGINdan keyin — faqat sizning seansingizda, COMMITgacha",
  "seg": [
   [
    "a",
    "Oddiy holatda PostgreSQL <b>autocommit</b>da: har buyruq bajarilishi bilan saqlanadi",
    "Oddiy holatda PostgreSQL autocommit rejimida ishlaydi: har buyruq bajarilishi bilan darhol saqlanadi, uni qaytarib bo'lmaydi. Birinchi bosqichdagi update va delete'lar aynan shunday saqlandi. Shuning uchun where'siz delete haqiqiy bazada halokat."
   ],
   [
    "b",
    "<code>BEGIN</code>dan keyin prompt <code>shop=*#</code> — <b>yulduzcha: tranzaksiya ochiq</b>, o'zgarish faqat sizga ko'rinadi",
    "Begin yozganingizda prompt o'zgaradi: teng, yulduzcha, panjara. Yulduzcha tranzaksiya ochiqligini bildiradi. Endi o'zgarishlar faqat sizning seansingizda ko'rinadi. Sinab ko'rdik: A seansida klaviaturaga chegirma qildik, sakson to'qqiz ming. B seansi hali to'qson to'qqiz mingni ko'radi. Commit'dan keyingina B yangi narxni ko'rdi."
   ],
   [
    "c",
    "Tranzaksiya ichida xato chiqsa — prompt <code>shop=!#</code>: <b>aborted</b>, keyingi buyruqlar rad etiladi",
    "Tranzaksiya ichida biror buyruq xato bersa, prompt undov belgisiga o'zgaradi va baza «current transaction is aborted» deydi: keyingi buyruqlar bajarilmaydi, hatto oddiy select ham. Bu holatdan faqat rollback chiqaradi. Commit yozsangiz ham baza rollback qiladi, javobida shunday yozadi."
   ],
   [
    "d",
    "Xulosa: <code>BEGIN</code> — vaqtincha, <code>COMMIT</code> — saqla, <code>ROLLBACK</code> — bekor; <b><code>!#</code> ko'rsangiz — <code>ROLLBACK</code></b>",
    "Xulosa: begin'dan keyin hamma narsa vaqtincha va faqat sizga ko'rinadi, commit saqlaydi, rollback bekor qiladi. Promptdagi yulduzcha tranzaksiya ochiqligini, undov belgisi xato bo'lganini aytadi. Undov belgisini ko'rsangiz, boshqa buyruq yozmang: rollback."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "2-bosqich · ichida nima bo'ladi",
  "title": "Sotuv — ikki buyruq: qoldiqni kamaytirish va buyurtma yozish. Yo ikkalasi, yo hech biri",
  "seg": [
   [
    "a",
    "Do'konga qoida va ikkinchi jadval: <b><code>CHECK (stock &gt;= 0)</code></b> va <code>orders</code> — buyurtmalar",
    "Tranzaksiya faqat sinov uchun emas. Do'konga qoida qo'shamiz: qoldiq manfiy bo'lmasin, check stock katta yoki teng nol. Va ikkinchi jadval: orders, buyurtmalar: qaysi mahsulot, nechta va qachon. Created at ustuniga default now yozdik, vaqtni baza o'zi qo'yadi."
   ],
   [
    "b",
    "Bitta sotuv — ikki buyruq: <code>UPDATE</code> qoldiqni kamaytiradi, <code>INSERT</code> buyurtma yozadi — <b><code>BEGIN … COMMIT</code> ichida</b>",
    "Bitta sichqoncha sotildi. Bu ikki buyruq: qoldiqni bittaga kamaytirish va buyurtma yozish. Ikkalasi begin va commit orasida. Returning qoldiq o'n to'rt bo'lganini, buyurtma esa bir raqam va vaqt bilan yozilganini ko'rsatdi. Commit'dan keyin ikkalasi ham saqlandi."
   ],
   [
    "c",
    "O'n ikki kolonka so'raldi, bor-yo'g'i o'nta: <b><code>CHECK</code> rad etdi</b>, tranzaksiya aborted — <code>ROLLBACK</code>",
    "Endi o'n ikkita kolonka so'raldi, omborda o'nta. Buyurtma yozildi, keyin update qoldiqni minus ikki qilmoqchi bo'ldi. Check rad etdi: new row violates check constraint stock nonneg. Tranzaksiya aborted. Rollback qilamiz: buyurtma ham yo'qoldi, qoldiq ham o'nta. Yolg'on buyurtma qolmadi."
   ],
   [
    "d",
    "Xulosa: bir ishga tegishli buyruqlar <b>bitta tranzaksiyada</b>; qoida bazada bo'lsa, yarim ish qolmaydi",
    "Xulosa: bir ishga tegishli buyruqlar bitta tranzaksiyada bo'ladi: yo hammasi saqlanadi, yo hech biri. Buni atomik deyishadi. Qoida bazaning o'zida bo'lsa, kod xato qilsa ham yarim ish qolmaydi. PostgreSQL-1 dagi «oxirgi telefon» masalasining javobi aynan shu: tranzaksiya va qoida."
   ]
  ]
 },
 "12": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 5",
  "title": "BEGIN; → DELETE FROM products; (DELETE 3) → ROLLBACK;. Endi SELECT * FROM products; nima qaytaradi?",
  "q": "Tranzaksiya ichini ko'rdingiz, tekshirib olaylik. Ikkinchi tekshiruv. Ekranda: begin, where'siz delete, javob delete uch, keyin rollback. Endi select qilsak, jadvalda nima bor? Variantni tanlang.",
  "ok": "To'g'ri. Delete tranzaksiya ichida edi, rollback uni bekor qildi. Uchala mahsulot joyida, ekranda select shuni ko'rsatdi. Commit yozilmaguncha hech qanday o'zgarish saqlanmaydi. Demak, begin va rollback xavfli buyruqni bazani buzmasdan sinash imkonini beradi.",
  "okShort": "<code>ROLLBACK</code> — tranzaksiya ichidagi hamma o'zgarish bekor: uch qator joyida.",
  "hint": "ROLLBACK tranzaksiya ichidagi o'zgarishlar bilan nima qiladi?",
  "demak": "<code>COMMIT</code> yozilmaguncha tranzaksiya ichidagi o'zgarish saqlanmaydi; <code>ROLLBACK</code> hammasini bekor qiladi.",
  "correct": 2,
  "opts": [
   "Nol qator — DELETE 3 allaqachon bajarilgan",
   "Faqat bitta qator — oxirgisi qaytib keladi",
   "Uchalasi — ROLLBACK o'chirishni bekor qildi",
   "ERROR — o'chirilgan jadvaldan o'qib bo'lmaydi"
  ],
  "wrong": {
   "0": "DELETE 3 tranzaksiya ichida edi va COMMIT qilinmadi.",
   "1": "ROLLBACK bitta qatorni emas, butun tranzaksiyani bekor qiladi.",
   "3": "DELETE qatorlarni o'chiradi, jadvalni emas; jadval doim joyida."
  }
 },
 "13": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 4",
  "eyebrow": "Hozir o'zingizda · 5–10 daqiqa",
  "title": "WHERE'siz UPDATEni xavfsiz sinang — promptdagi yulduzchani kuzating",
  "seg": [
   [
    "a",
    "Endi siz: <code>WHERE</code>'siz <code>UPDATE</code>ni o'z bazangizda, lekin <b>tranzaksiya ichida</b> qilasiz",
    "Endi o'zingiz: where'siz update'ni o'z bazangizda qilasiz, lekin tranzaksiya ichida. Bunga besh-o'n daqiqa ketadi. Bundan keyin har xavfli buyruqni shu usulda sinaysiz."
   ],
   [
    "b",
    "1–2-qadam: <code>BEGIN</code> (prompt <code>shop=*#</code>), <code>WHERE</code>'siz <code>UPDATE</code> va <code>SELECT</code> — <b>hamma narx bir xil</b>",
    "Birinchi qadamda begin yozasiz va promptda yulduzcha paydo bo'lganini ko'rasiz. Ikkinchisida where'siz update qilib, select bilan hamma narx bir xil bo'lganini ko'rasiz. Commit yozmang."
   ],
   [
    "c",
    "3–4-qadam: <code>ROLLBACK</code> va <code>SELECT</code>; isbot — <b>klaviaturaning narxi</b>",
    "Uchinchi qadamda rollback yozasiz, prompt oddiy holatga qaytadi. To'rtinchisida yana select qilasiz. Isbot maydoniga klaviaturaning hozirgi narxini yozing, rollback'dan keyingisini."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz where'siz update qanday xavfli ekanini ko'rdingiz va rollback bilan hammasini qaytarishni o'rgandingiz."
   ]
  ],
  "steps": [
   {
    "t": "Tranzaksiya",
    "cmds": [
     "BEGIN;"
    ],
    "exp": "BEGIN · prompt shop=*#"
   },
   {
    "t": "WHERE'siz",
    "cmds": [
     "UPDATE products SET price = 1;",
     "SELECT * FROM products;"
    ],
    "exp": "UPDATE 3 · hamma narx 1"
   },
   {
    "t": "Bekor",
    "cmds": [
     "ROLLBACK;"
    ],
    "exp": "ROLLBACK · prompt shop=#"
   },
   {
    "t": "Tekshirish",
    "cmds": [
     "SELECT * FROM products;"
    ],
    "exp": "narxlar eski"
   }
  ],
  "proof": {
   "label": "ROLLBACKdan keyingi Klaviatura narxi",
   "placeholder": "klaviatura narxini yozing",
   "re": "^\\s*99\\s?000\\s*$",
   "flags": "",
   "wrong": "ROLLBACKdan keyin narx 1-amaliyotdagidek bo'ladi. SELECT natijasidan Klaviatura qatorini o'qing."
  },
  "trouble": [
   [
    "WARNING:  there is no transaction in progress (ROLLBACK'da)",
    "BEGIN yozilmagan — o'zgarish allaqachon saqlangan; narxlarni 1-amaliyotdagi UPDATElar bilan tiklang"
   ],
   [
    "narx 120000",
    "1-amaliyotning 4-qadami (99 000) bajarilmagan — 1-amaliyotni tugating"
   ],
   [
    "prompt shop=!#",
    "tranzaksiya ichida xato bo'ldi — ROLLBACK; yozing (10-ekran)"
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "3-bosqich · baza qo'riqlaydi",
  "title": "Nomsiz mahsulot xato bermay saqlandi — qoidani o'zimiz qo'shamiz, baza rad eta boshlaydi",
  "seg": [
   [
    "a",
    "Nomsiz <code>INSERT</code> — <code>INSERT 0 1</code>, <b>xato yo'q</b>: jadvalda <code>NOT NULL</code> yo'q edi",
    "Uchinchi bosqich: baza qanday qo'riqlaydi. Nomsiz mahsulot qo'shamiz: faqat narx va qoldiq. Xato chiqmadi, insert nol bir. Where name is null bilan qidirsak, beshinchi qator: nomi bo'sh. Baza faqat yozilgan qoidani qo'riqlaydi, biz esa qoida yozmagan edik."
   ],
   [
    "b",
    "<code>NOT NULL</code> qo'shmoqchimiz — baza rad etdi: <b>ustunda bo'sh qiymat bor</b>. Avval tozalaymiz, keyin qoida",
    "Endi qoida qo'shamiz: alter table, name set not null. Baza rad etdi: column name contains null values. Mantiqli: bo'sh nom bor ekan, qoidani qo'yib bo'lmaydi. Nomsiz qatorni o'chiramiz va qoidani qayta qo'shamiz. Endi nomsiz insert xato beradi: violates not-null constraint."
   ],
   [
    "c",
    "<code>DEFAULT 0</code> — berilmagan qoldiq nol bo'ladi; <b><code>UNIQUE</code></b> — ikkinchi «Kolonka» rad etiladi",
    "Yana ikki qoida. Default: stock berilmasa nol bo'lsin, planshet nol qoldiq bilan saqlandi. Unique: nom takrorlanmasin. Ikkinchi kolonka qo'shmoqchi bo'lsak, baza duplicate key value deydi va qaysi qiymat takrorlanganini aytadi."
   ],
   [
    "d",
    "Xulosa: <code>\\d products</code> — hamma qoida bir joyda; <b>qoida bazada bo'lsa</b>, xatoni kod emas, baza ushlaydi",
    "Xulosa: backslash d products jadvalning hamma qoidasini ko'rsatadi: not null, default, unique, check va tashqi kalit. Qoida bazada bo'lsa, xatoni kod emas, baza ushlaydi, va har xabar ichida qoidaning nomi turadi. Keyingi ekranda shu xabarlarni o'qishni mashq qilamiz."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "3-bosqich · baza qo'riqlaydi",
  "title": "Beshta xato — har birida xabarning o'zi nimani tuzatishni aytadi",
  "seg": [
   [
    "a",
    "<code>relation \"product\" does not exist</code> — jadval nomi: <b>bitta <code>s</code> yetmaydi</b>",
    "Endi eng ko'p uchraydigan xatolar. Birinchisi jadval nomida: products o'rniga product yozilgan. Baza relation product does not exist deydi. Relation — bazaning jadvalga beradigan nomi. Jadval bor, faqat nomi bitta harfga farq qiladi."
   ],
   [
    "b",
    "<code>column \"narx\" does not exist</code> — ustun nomi; <code>HINT</code> esa <b>noto'g'ri ustunni taklif qiladi</b>",
    "Ikkinchisi ustun nomida: narx deb yozilgan. Baza column narx does not exist deydi, ostida hint: perhaps you meant name. Diqqat: hint taxmin qiladi va bu yerda adashgan, kerakli ustun price. Hint'ga emas, backslash d ga ishoning."
   ],
   [
    "c",
    "Son o'rniga matn va tushib qolgan qiymat — <code>invalid input syntax</code>, <b><code>more target columns</code></b>",
    "Uchinchisi: narx ustuniga arzon degan so'z yozilgan, baza invalid input syntax for type integer deydi. To'rtinchisi: uchta ustun yozilgan, qiymat esa ikkita, baza insert has more target columns than expressions deydi. Ikkalasida ham strelka xato joyni ko'rsatadi."
   ],
   [
    "d",
    "O'zbekcha apostrof satrni yopadi: <code>syntax error at or near \"yinchoq\"</code> — <b>ikki marta yoziladi</b>",
    "Beshinchisi, o'zbekcha matnda eng ko'p uchraydigani: apostrof. O'yinchoq so'zidagi apostrof matnni erta yopib qo'yadi, baza yinchoq so'zida adashadi. Tuzatish: so'z ichidagi apostrof ikki marta yoziladi, saqlanganda bitta bo'ladi."
   ],
   [
    "e",
    "Xulosa: xabar ichidagi nomni <b><code>\\d products</code></b> bilan solishtiring; <code>^</code> xato joyni ko'rsatadi",
    "Xulosa: bu xatolarning hammasida xabar ichida nom yoki qiymat turadi. Uni jadval tuzilishi bilan solishtiring, backslash d products. Strelka xato joyni ko'rsatadi. Apostrof uchun bitta qoida: so'z ichidagi apostrof ikki marta."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 5",
  "title": "VALUES ('O'yinchoq', 30000, 4) → syntax error at or near \"yinchoq\". Tuzatish qaysi?",
  "q": "Xabarlarni o'qidingiz, tekshirib olaylik. Uchinchi tekshiruv. Ekranda o'yinchoq degan mahsulot qo'shilmoqchi, baza syntax error, yinchoq so'zida deydi. Nima bo'ldi va tuzatish qaysi? Variantni tanlang.",
  "ok": "To'g'ri. SQL'da matn bir tirnoq ichida, so'z ichidagi apostrof uni erta yopadi. Ikki marta yozilsa, baza uni bitta apostrof deb tushunadi. Ekranda tuzatilgan insert: mahsulot o'yinchoq nomi bilan saqlandi. Demak, SQL matnidagi har apostrof ikki marta yoziladi.",
  "okShort": "<code>'O''yinchoq'</code> — so'z ichidagi apostrof ikki marta. Saqlanganda bitta bo'ladi: <code>O'yinchoq</code>.",
  "hint": "Matn qaysi belgi bilan boshlanib, qaysi belgi bilan tugaydi? Apostrof shu belgining o'zi.",
  "demak": "SQL matnidagi apostrof ikki marta yoziladi: <code>'O''yinchoq'</code>.",
  "correct": 1,
  "opts": [
   "Nomni kirillda yozish — apostrof kerak emas",
   "Apostrofni ikki marta yozish: 'O''yinchoq'",
   "Nomni qo'shtirnoqqa olish: \"O'yinchoq\"",
   "name ustunini VARCHAR emas, TEXT qilish"
  ],
  "wrong": {
   "0": "Muammo harfda emas, apostrofda: u matnni erta yopyapti.",
   "2": "Qo'shtirnoq SQL'da ustun yoki jadval nomi uchun — sinab ko'rdik: column \"O'yinchoq\" does not exist.",
   "3": "Ustun turi bu xatoga aloqasiz: xato matn yozilishida."
  }
 },
 "17": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express · ichida nima bo'ladi",
  "title": "Pool — ulanishlar to'plami: yaratilganda ulanmaydi, birinchi so'rovda ulanadi, keyin shu ulanishni qayta ishlatadi",
  "seg": [
   [
    "a",
    "Express'da bazaga <code>pg</code> paketi orqali boriladi; kod tepasida <b><code>new Pool({ user, password, database, host, port })</code></b>",
    "Terminalda qilganlaringizni endi server ichiga ko'chiramiz. Node'da PostgreSQL bilan pg paketi gaplashadi. Kodning tepasida pg'dan Pool olinadi va unga foydalanuvchi, parol, baza nomi, host va port beriladi. Pool so'zi «hovuz», ya'ni ulanishlar to'plami degani. Nega to'plam, hozir ko'rasiz."
   ],
   [
    "b",
    "O'lchab ko'rdik: <code>Pool</code> yaratilganda ulanish <b>nol</b>; birinchi so'rovda ulanadi, keyingi so'rovlar o'sha ulanishda",
    "Buni o'lchab ko'rdik. Pool yaratilgan zahoti ulanishlar soni nol: u hali bazaga bormagan. Birinchi so'rovda ulanadi. Keyin yana ikki so'rov yubordik: bazadagi jarayon raqami, pid, uchalasida bir xil, faol ulanish bitta. Ya'ni Pool har so'rovga yangi ulanish ochmaydi, borini qayta ishlatadi."
   ],
   [
    "c",
    "Nega muhim: ulanish ochish qimmat; va <b>xato faqat birinchi so'rovda</b> — parol xato bo'lsa ham server «ishlayapti» deydi",
    "Bu ikki narsani tushuntiradi. Birinchisi: bazaga ulanish qimmat ish, shuning uchun uni bir marta ochib, qayta ishlatish to'g'ri. Ikkinchisi: Pool yaratilganda ulanmagani uchun parol xato bo'lsa ham server xatosiz ishga tushadi, xato faqat birinchi so'rovda chiqadi. Sinab ko'rdik: xato parol bilan Pool yaratildi, xato yo'q; birinchi so'rovda password authentication failed."
   ],
   [
    "d",
    "Xulosa: <code>Pool</code> bir marta sozlanadi, <b>birinchi so'rovda ulanadi</b>, ulanishni qayta ishlatadi; «server ishlayapti» — baza haqida emas",
    "Xulosa: Pool bir marta sozlanadi, birinchi so'rovda ulanadi va ulanishni qayta ishlatadi. Terminaldagi «server ishlayapti» faqat Express haqida, baza haqida hech narsa demaydi. Buni beshinchi bosqichda, ulanish xatolarida yana ko'rasiz. Endi Pool orqali birinchi so'rovni yuboramiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express",
  "title": "pool.query so'rovni bazaga olib boradi; javobda rows — qatorlar, rowCount — terminaldagi son",
  "seg": [
   [
    "a",
    "<code>GET /api/cars</code>: <code>pool.query('SELECT * FROM cars')</code> — <b>natijaning <code>rows</code> qismi</b> <code>res.json</code> bilan qaytadi",
    "GET api cars endpoint'i. Pool query select'ni bazaga olib boradi. Natija obyektida bir nechta narsa bor, bizga ikkitasi kerak: rows, ya'ni qatorlar massivi, va rowCount. Rows res json bilan qaytariladi. Postman'da ikki yuz va uchta mashina. Bu terminaldagi select'ning o'zi, faqat javob JSON ko'rinishida."
   ],
   [
    "b",
    "<code>rowCount</code> — terminaldagi <code>UPDATE 1</code> ning o'zi: o'lchadik, <b><code>WHERE id = 99</code> → <code>rowCount: 0</code></b>, <code>rows: []</code>",
    "Rowcount nechta qator tegilganini aytadi, bu terminaldagi update bir yoki select'dagi qatorlar sonining o'zi. Sinab ko'rdik: shop bazasida where price kichik yuz ming bilan rowcount uch. Update where id to'qson to'qqiz bilan rowcount nol va rows bo'sh massiv. Birinchi bosqichdagi update nol aynan shu yerga keladi."
   ],
   [
    "c",
    "<code>async</code>/<code>await</code> va <code>try</code>/<code>catch</code>: so'rov kutiladi; xato bo'lsa <b>status 500 va xato matni</b>",
    "Pool query va'da qaytaradi, shuning uchun await bilan kutiladi, funksiya esa async. Hammasi try ichida. Xato bo'lsa catch ishlaydi: server besh yuz status va xato matnini qaytaradi. Beshinchi bosqichda xatolarning hammasini aynan shu catch orqali ko'rasiz."
   ],
   [
    "d",
    "Xulosa: <b><code>Pool</code> → <code>pool.query</code> → <code>rows</code> / <code>rowCount</code> → <code>res.json</code></b> — so'rov serverdan bazaga shu to'rt qadamda boradi",
    "Xulosa: so'rov serverdan bazaga to'rt qadamda boradi. Pool ulanadi, pool query so'rov yuboradi, natijadan rows yoki rowcount olinadi, res json javob qaytaradi. Keyingi ekranda qolgan uch endpoint: ularda ham shu to'rt qadam, faqat SQL boshqa."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express",
  "title": "Uch yozuvchi endpoint — uch SQL buyruq; javob statusi va rowCount bilan",
  "seg": [
   [
    "a",
    "<code>POST</code> — <code>INSERT … RETURNING *</code>: <b>yangi qator javobda</b>, status 201",
    "GET o'qiydi, qolgan uchtasi yozadi. POST'da insert, oxirida returning yulduzcha, birinchi bosqichda ko'rgansiz: baza yangi qatorni, id bilan, qaytaradi. Shu qator rows nol bo'lib javobga ketadi. Status ikki yuz bir, ya'ni yaratildi. Chevrolet Spark to'rtinchi id bilan qo'shildi."
   ],
   [
    "b",
    "<code>is_rented: null</code> — <code>POST</code>da berilmagan ustun bo'sh qoldi: <b>jadvalda <code>DEFAULT</code> yo'q</b>",
    "Javobga qarang: is rented null. POST'da bu ustun berilmadi, jadvalda esa default qiymat yo'q. Uchinchi bosqichni eslang: baza faqat yozilgan qoidani bajaradi. Yechim jadvalda: alter table, is rented set default false. Shunda yangi mashina doim bo'sh deb yoziladi."
   ],
   [
    "c",
    "<code>PUT</code> — <code>UPDATE … WHERE id = $2</code>, <code>DELETE</code> — <code>WHERE id = $1</code>: 200; <b><code>rowCount</code> nol bo'lsa — 404</b>",
    "PUT ikkinchi mashina narxini yangiladi, ikki yuz va yangilangan qator. DELETE birinchi mashinani o'chirdi. Ikkalasida where bor, id URL'dan keladi. To'qson to'qqizinchi mashina: baza update nol qaytaradi, xato emas. Bu namunada kod rowcount nolmi deb tekshiradi va to'rt yuz to'rt beradi: mashina topilmadi. Rowcount'siz javob ikki yuz bo'lardi, ya'ni yolg'on «o'zgardi»."
   ],
   [
    "d",
    "Xulosa: GET — 200, POST — 201, PUT/DELETE — 200, <b>topilmasa — 404</b>, xato — 500; 404 ni <code>rowCount</code> hal qiladi",
    "Xulosa: GET ikki yuz, POST ikki yuz bir, PUT va DELETE ikki yuz; qator topilmasa to'rt yuz to'rt, xato bo'lsa besh yuz. To'rt yuz to'rtni kim hal qiladi? Rowcount, ya'ni terminaldagi update nol. Endi eng muhim savol: nega qiymatlar dollar bir bilan beriladi."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express · ichida nima bo'ladi",
  "title": "Yopishtirilgan SQL: 1 OR 1=1 — uchala mashina o'chdi. $1 bilan — 500, jadval joyida",
  "seg": [
   [
    "a",
    "Qiymatni SQL matniga yopishtirish: <code>'… WHERE id = ' + req.params.id</code> — <b>ishlaydi, lekin</b>",
    "Kodda qiymatni SQL matniga qo'shib yuborish oson: where id teng, plyus, req params id. Oddiy so'rovda bu ishlaydi: delete api cars bir, birinchi mashina o'chadi. Muammo shundaki, URL'dagi matn SQL'ning bir qismiga aylanadi. Sinab ko'rdik."
   ],
   [
    "b",
    "URL'ga <code>1 OR 1=1</code> yozildi — so'rov «hammasi» bo'lib qoldi: <b><code>deleted: 3</code></b>, jadval bo'sh",
    "URL'da id o'rniga bir or bir teng bir yubordik. Yopishtirilgan satr shunday SQL bo'ldi: where id bir, yoki bir teng bir. Bir teng bir doim to'g'ri. Javob ikki yuz, deleted uch: jadval bo'sh qoldi. Buni SQL injection deyishadi, va buni istalgan foydalanuvchi brauzerdan qila oladi."
   ],
   [
    "c",
    "<code>$1</code> bilan xuddi shu so'rov: qiymat alohida boradi — <b><code>invalid input syntax for type integer</code></b>, 500, jadval joyida",
    "Endi dollar bir bilan: pool query'ning ikkinchi argumenti massiv, qiymat shu massivda, SQL matniga kirmaydi. Baza bir or bir teng bir'ni son sifatida o'qishga urinadi va rad etadi: invalid input syntax for type integer. Besh yuz, lekin jadval joyida, uchala mashina bor."
   ],
   [
    "d",
    "Xulosa: foydalanuvchidan kelgan har qiymat <b><code>$1, $2</code> bilan</b>, SQL matniga hech qachon yopishtirilmaydi",
    "Xulosa: foydalanuvchidan kelgan har qiymat dollar bir, dollar ikki bilan beriladi, SQL matniga hech qachon yopishtirilmaydi. Bu uslub masalasi emas, xavfsizlik masalasi: bitta plyus belgisi butun jadvalni o'chirishga yo'l ochadi. Endi serverni o'zingiz ko'tarasiz."
   ]
  ]
 },
 "21": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 4",
  "eyebrow": "Hozir o'zingizda · 15–20 daqiqa",
  "title": "car_rental va server.js — o'z serveringiz, Postman bilan sinov",
  "seg": [
   [
    "a",
    "Endi siz: jadval qo'lda, server — <b>namunadan yoki Gemini bilan</b>, sinov Postman'da",
    "Endi o'zingiz server ko'tarasiz. Jadvalni terminalda qo'lda yozasiz. Server kodini namunadan yozing yoki Gemini'dan oling: Express, pg, to'rt endpoint, qiymatlar dollar bir bilan. O'n besh-yigirma daqiqa."
   ],
   [
    "b",
    "1–2-qadam: <code>car_rental</code> va <code>cars</code>; papka, <b><code>express</code> va <code>pg</code></b>",
    "Birinchi qadamda car rental bazasi va cars jadvalini yaratib, uchta mashina qo'shasiz. Ikkinchisida avto ijara server papkasini ochib, npm init qilasiz va express bilan pg paketlarini o'rnatasiz."
   ],
   [
    "c",
    "3–4-qadam: <code>server.js</code>, <code>node server.js</code>, Postman; isbot — <b><code>POST</code> javobining statusi</b>",
    "Uchinchi qadamda server js faylini yozasiz, unga parolingizni qo'yib, node server js bilan ishga tushirasiz. To'rtinchisida Postman'da GET va POST yuborasiz. Isbot maydoniga POST javobining statusini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Beshinchi bosqichda bu xatolarning hammasini ataylab chiqarib tuzatamiz. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizda ishlab turgan server bor va siz uni Postman bilan sinagan bo'lasiz."
   ]
  ],
  "steps": [
   {
    "t": "Jadval",
    "cmds": [
     "CREATE DATABASE car_rental;",
     "\\c car_rental",
     "CREATE TABLE cars (id SERIAL PRIMARY KEY, model TEXT, daily_price INTEGER, year INTEGER, is_rented BOOLEAN);",
     "INSERT … ('Chevrolet Cobalt', 280000, 2022, false), …"
    ],
    "exp": "INSERT 0 3"
   },
   {
    "t": "Loyiha",
    "cmds": [
     "mkdir avto-ijara-server",
     "cd avto-ijara-server",
     "npm init -y",
     "npm install express pg"
    ],
    "exp": "added … packages"
   },
   {
    "t": "Server — server.js: «Kodni ochish» (namuna) yoki Gemini (Express + pg, to'rt endpoint, $1, topilmasa 404); parolni yozing",
    "cmds": [
     "node server.js"
    ],
    "exp": "Server 3000-portda ishlayapti"
   },
   {
    "t": "Postman",
    "cmds": [
     "GET localhost:3000/api/cars",
     "POST localhost:3000/api/cars body { \"model\": \"Chevrolet Spark\", \"daily_price\": 190000, \"year\": 2021 }"
    ],
    "exp": "200 · 3 mashina · POST — id bilan"
   }
  ],
  "proof": {
   "label": "POST javobining statusi",
   "placeholder": "Postman ko'rsatgan statusni yozing",
   "re": "^\\s*201\\b",
   "flags": "",
   "wrong": "Muvaffaqiyatli POST statusi uch xonali son. Postman'da javob ustida yozilgan."
  },
  "trouble": [
   [
    "500 password authentication failed for user \"postgres\"",
    "PASSWORD — o'rnatishda berilgan parol (24-ekran)"
   ],
   [
    "500 client password must be a string",
    "parol bo'sh / process.env o'qilmagan (24-ekran)"
   ],
   [
    "500 database \"…\" does not exist",
    "DATABASE nomi xato yoki baza yaratilmagan (24-ekran)"
   ],
   [
    "500 {\"error\":\"\"}",
    "PostgreSQL ishlamayapti — console.error(err) bilan ECONNREFUSED ko'rinadi (24-ekran)"
   ],
   [
    "500 Cannot destructure property 'model' of 'req.body'",
    "app.use(express.json()) yo'q (23-ekran)"
   ],
   [
    "500 column \"price\" of relation \"cars\" does not exist",
    "kodda ustun nomi xato (22-ekran)"
   ],
   [
    "kod o'zgardi, javob o'zgarmadi",
    "eski server ishlab turibdi — 25-ekran"
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz va tuzatamiz",
  "title": "column \"price\" of relation \"cars\" does not exist — kodda price, jadvalda daily_price",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>daily_price</code> ustiga bosing",
    "Server ishlaydi, to'rt so'rov ham ishlaydi. Endi ataylab buzamiz, chunki o'quvchining Gemini'si aynan shu xatolarni qiladi. Buzishni o'zingiz qilasiz: server js'ning o'ttiz oltinchi satrida daily price yonib turibdi, ustiga bosing.",
    "<b>server.js</b> 36-satridagi <b><code>daily_price</code></b> ustiga bosing — Gemini yozgandek <b><code>price</code></b> bo'ladi."
   ],
   [
    "a",
    "Birinchi buzish — Gemini'ning odatiy xatosi: <code>INSERT</code>da <b>ustun nomini o'zi o'ylab topadi</b>, <code>price</code>",
    "Daily price o'rniga price bo'ldi. Bu Gemini'ning eng ko'p uchraydigan xatosi: insert'da ustun nomini jadvaldan emas, o'z taxminidan oladi. Serverni ishga tushiramiz: xato yo'q, server ishlayapti deb yozadi. Xato faqat POST yuborilganda chiqadi."
   ],
   [
    "b",
    "POST → 500, xabarda jadval va ustun: <b><code>\"price\"</code> · <code>\"cars\"</code></b>",
    "POST yuboramiz, javob besh yuz. Xabarni o'qiymiz: column price of relation cars does not exist. Ustun price, jadval esa cars. Relation so'zi uchinchi bosqichdan tanish: bu jadval. Xabar nimani tuzatishni o'zi aytdi."
   ],
   [
    "c",
    "Tuzatish: kodda <code>daily_price</code> — serverni <b>qayta ishga tushirib</b>, POST → 201",
    "Jadval tuzilishiga qaraymiz: ustun daily price. Kodda tuzatamiz, serverni to'xtatib, qayta ishga tushiramiz. POST yuboramiz: javob ikki yuz bir, yangi mashina id bilan qaytdi."
   ],
   [
    "d",
    "Xulosa: 500 bo'lsa — <code>error</code> matnidagi nomni <b><code>\\d cars</code></b> bilan solishtiring; kod o'zgarsa server qayta",
    "Xulosa: besh yuz chiqsa, xato matnini o'qing, ichida ustun va jadval nomi bor. Uni terminaldagi backslash d cars bilan solishtiring. Kod o'zgargandan keyin serverni albatta qayta ishga tushiring, aks holda eski kod ishlayveradi."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz va tuzatamiz",
  "title": "Cannot destructure property 'model' of 'req.body' — so'rov tanasi o'qilmagan",
  "seg": [
   [
    "x",
    "Ikkinchi buzish ham <b>sizda</b>: kodda yonib turgan <code>app.use(express.json())</code> ustiga bosing",
    "Ikkinchi buzish ham sizda. Gemini ba'zan bitta satrni unutadi. Server js'ning o'n sakkizinchi satrida app use express json yonib turibdi, ustiga bosing: satr o'chadi.",
    "<b>server.js</b> 18-satridagi <b><code>app.use(express.json())</code></b> ustiga bosing — satr o'chadi."
   ],
   [
    "a",
    "Satr o'chdi: <code>app.use(express.json())</code> yo'q — <b>server baribir ishga tushadi</b>",
    "Satrni o'chirdingiz. Server xatosiz ishga tushadi, GET ham ishlaydi. Muammo faqat tanasi bor so'rovlarda."
   ],
   [
    "b",
    "POST → 500: <code>req.body</code> — <b><code>undefined</code></b>, <code>model</code>ni olib bo'lmaydi",
    "POST yuboramiz, javob besh yuz. Xabar shunday: cannot destructure property model of req body as it is undefined. Ya'ni req body umuman yo'q: Express so'rov tanasini o'qimagan, chunki JSON'ni o'qiydigan qism ulanmagan."
   ],
   [
    "c",
    "Tuzatish: satr qaytariladi, <code>app</code> yaratilgandan keyin, <b>endpoint'lardan oldin</b> — POST → 201",
    "Tuzatish uchun app use express json satrini app yaratilgandan keyin, endpoint'lardan oldin qaytaramiz. Tartib muhim: bu satr har so'rovdan oldin ishlaydi. Server qayta ishga tushadi, POST ikki yuz bir."
   ],
   [
    "d",
    "Xulosa: <code>req.body</code> <code>undefined</code> bo'lsa — birinchi qaraladigan joy <b><code>express.json()</code></b>",
    "Xulosa: req body undefined degan xato chiqsa, birinchi qaraladigan joy app use express json. GET ishlab, POST va PUT ishlamasa ham shu satr. Bitta satr, lekin usiz tanasi bor hech bir so'rov ishlamaydi."
   ]
  ]
 },
 "24": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz va tuzatamiz",
  "title": "Server «ishlayapti» deydi — parol, baza va PostgreSQL xatosi birinchi so'rovda chiqadi",
  "seg": [
   [
    "a",
    "<code>Pool</code> darhol ulanmaydi (17-ekran): server ishga tushadi, <b>xato birinchi so'rovda</b>",
    "Pool ekranida ko'rgan edingiz: Pool server ishga tushganda bazaga ulanmaydi, birinchi so'rovda ulanadi. Shuning uchun parol xato bo'lsa ham terminalda server ishlayapti deb yoziladi. «Server ishlayapti, lekin besh yuz» degan holatda xabarni o'qing: to'rt xil bo'ladi."
   ],
   [
    "b",
    "Parol xato — <code>password authentication failed</code>; parol bo'sh — <b><code>client password must be a string</code></b>",
    "Parol xato bo'lsa: password authentication failed for user postgres. Parol umuman berilmasa, masalan process env'dan o'qilmagan bo'lsa: client password must be a string. Ikkinchisi g'alati ko'rinadi, lekin ma'nosi oddiy: parol o'zgaruvchisi bo'sh."
   ],
   [
    "c",
    "Baza nomi xato — <code>database \"carrental\" does not exist</code>: <b>pastki chiziq tushib qolgan</b>",
    "Baza nomida pastki chiziq tushib qolsa: database carrental does not exist. Baza bor, faqat nomi car pastki chiziq rental. Terminaldagi backslash l bilan aniq nomni ko'ring."
   ],
   [
    "d",
    "PostgreSQL o'chiq — xato matni bo'sh; <b><code>console.error(err)</code></b> — <code>ECONNREFUSED</code> ko'rinadi",
    "Eng chalkashi: PostgreSQL ishlamasa, javob besh yuz, lekin error bo'sh, terminalda ham bo'sh qator. Sinab ko'rdik: console error'ga err message emas, err'ning o'zini bersak, ECONNREFUSED chiqadi, ya'ni ulanish rad etildi. Yechim: PostgreSQL'ni ishga tushiring."
   ],
   [
    "e",
    "Xulosa: «ishlayapti» — faqat Express; <b>baza xatosini birinchi so'rov va terminal aytadi</b>",
    "Xulosa: terminaldagi ishlayapti degan satr faqat Express haqida. Bazaga ulanish birinchi so'rovda tekshiriladi. Xabar bo'sh bo'lsa, console error'ga butun xatoni bering. PostgreSQL'ni ishga tushirish: Windows'da Services, Mac'da Postgres.app."
   ]
  ]
 },
 "25": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz va tuzatamiz",
  "title": "Ikkinchi node server.js ham «ishlayapti» deydi — javobni esa eski server beradi",
  "seg": [
   [
    "a",
    "Eng chalkash holat: <b>«kodni tuzatdim, hech narsa o'zgarmadi»</b>",
    "Eng chalkash holat: kodni tuzatasiz, serverni yana ishga tushirasiz, lekin javob o'zgarmaydi. Sabab ko'pincha bitta: birinchi server boshqa terminalda hali ishlab turibdi."
   ],
   [
    "b",
    "Sinab ko'rdik: ikkinchi server ham «ishlayapti» deb yozdi va <b>xato bermay chiqib ketdi</b>",
    "Sinab ko'rdik. Birinchi server ishlab turganda ikkinchi oynada node server js. Kutganimiz port band degan xato edi. Haqiqatda ikkinchi server ham ishlayapti deb yozdi va xato bermay chiqib ketdi. So'rovlarga birinchi, eski server javob beradi."
   ],
   [
    "c",
    "Sabab Express 5 da: xato <code>listen</code> callback'iga beriladi, <b>namunadagi callback uni o'qimaydi</b>",
    "Sabab Express beshinchi versiyasida: listen xatoni callback'ga beradi. Gemini yozgan callback esa xatoni o'qimaydi, faqat ishlayapti deb chiqaradi. Callback xatoni o'qisa, address already in use chiqadi va server to'xtaydi. Bu namuna kodidagi kamchilik, Express'niki emas."
   ],
   [
    "d",
    "Xulosa: <b>bitta loyiha — bitta terminal</b>; qayta ishga tushirishdan oldin <code>Ctrl+C</code>",
    "Xulosa: bitta loyiha uchun bitta terminal. Qayta ishga tushirishdan oldin Ctrl C bilan eski serverni to'xtating. Javob o'zgarmasa, birinchi savol: boshqa terminalda server ochiq qolmadimi?"
   ]
  ]
 },
 "26": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 5 — qaysi satr xato?",
  "title": "POST 500: column \"price\" of relation \"cars\" does not exist. Xato satrni toping",
  "q": "Buzishni ko'rdingiz, endi o'zingiz toping. To'rtinchi tekshiruv. Jadval ustunlarini eslang: id, model, daily price, year, is rented. Bu POST bo'lagida bitta satr jadvalda yo'q ustunni so'rayapti. O'sha satrni bosing.",
  "ok": "To'g'ri. O'ttiz oltinchi satrda insert'da price yozilgan, jadvalda esa daily price. O'ttiz to'rtinchi satrdagi daily price faqat JavaScript o'zgaruvchisi, baza uni ko'rmaydi, u SQL matnidagi nomni ko'radi. Ekranda tuzatilgan holat: daily price, POST ikki yuz bir. Demak, besh yuz chiqsa, SQL matnidagi har nomni jadval ustunlari bilan solishtiring.",
  "okShort": "36-satr: SQL'da <code>price</code> — jadvalda <code>daily_price</code>. 34-satrdagi <code>daily_price</code> — JS o'zgaruvchisi, baza ko'rmaydi.",
  "hint": "Baza JavaScript o'zgaruvchilarini ko'rmaydi — faqat qo'shtirnoq ichidagi SQL matnini. O'sha matndagi ustun nomlarini qidiring.",
  "task": "Qoida: SQL'dagi ustun nomlari jadvaldagi bilan aynan bir xil bo'ladi — <code>cars</code>: <code>id, model, daily_price, year, is_rented</code>. Bu POST bo'lagida bitta satr jadvalda yo'q ustunni so'rayapti. <b>O'sha satrni bosing.</b>"
 },
 "27": {
  "type": "Practice",
  "kicker": "Amaliyot 4 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Ikki buzish, ikki tuzatish — o'z serveringizda",
  "seg": [
   [
    "a",
    "Endi siz: o'z serveringizda ikkita xatoni <b>ataylab chiqarasiz va tuzatasiz</b>",
    "Oxirgi amaliyot: o'z serveringizda ikkita xatoni ataylab chiqarasiz va tuzatasiz. O'n daqiqa. Bu xatolar haqiqiy loyihada ham chiqadi; ularni bir marta o'zingiz chiqarsangiz, keyin xabardan darhol taniysiz."
   ],
   [
    "b",
    "1–2-qadam: <code>price</code> xatosi — 500, <b>xabarni o'qing</b>, tuzating, 201",
    "Birinchi qadamda insert'dagi daily price'ni price qilib, serverni qayta ishga tushirasiz va POST yuborasiz. Ikkinchisida xabarni o'qib, xatoni tuzatasiz va qayta ishga tushirasiz: javob ikki yuz bir bo'lishi kerak."
   ],
   [
    "c",
    "3–4-qadam: eski serverni yopmasdan yangisini yoqing; isbot — <b>500 xabarining matni</b>",
    "Uchinchi qadamda birinchi server ishlab turganda ikkinchi terminalda yana node server js qilasiz va ishlayapti satrini ko'rasiz. To'rtinchisida ikkalasini ham Ctrl C bilan to'xtatasiz. Isbot maydoniga birinchi qadamdagi besh yuz xabarini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, bu ikki xato chiqqanda siz ularni birinchi marta ko'rayotgan bo'lmaysiz va xabardan sababini darhol topasiz."
   ]
  ],
  "steps": [
   {
    "t": "Buzish",
    "cmds": [
     "server.js: INSERT INTO cars (model, price, year)",
     "Ctrl+C",
     "node server.js",
     "Postman POST"
    ],
    "exp": "500 column \"price\" of relation \"cars\" does not exist"
   },
   {
    "t": "Tuzatish",
    "cmds": [
     "price → daily_price",
     "Ctrl+C",
     "node server.js",
     "POST"
    ],
    "exp": "201"
   },
   {
    "t": "Ikki server",
    "cmds": [
     "1-terminal ishlab turibdi",
     "2-terminalda node server.js"
    ],
    "exp": "ikkinchisi ham «Server 3000-portda ishlayapti»"
   },
   {
    "t": "To'xtatish",
    "cmds": [
     "ikkala terminalda Ctrl+C"
    ],
    "exp": "Postman: GET — javob yo'q (server yo'q)"
   }
  ],
  "proof": {
   "label": "1-qadamdagi 500 xabari",
   "placeholder": "Postman'dagi error matnini qo'ying",
   "re": "column\\s+\"?price\"?\\s+of relation\\s+\"?cars\"?\\s+does not exist",
   "flags": "i",
   "wrong": "Xabar to'liq bo'lsin: qaysi ustun va qaysi jadval (of relation …). Postman'dagi error qiymatini nusxalang."
  },
  "trouble": [
   [
    "1-qadamda 201",
    "server qayta ishga tushmagan — eski kod ishlayapti (25-ekran)"
   ],
   [
    "column \"price\" does not exist (of relationsiz)",
    "SELECT/UPDATEda xato qilingan — INSERTdagi ustunni o'zgartiring"
   ],
   [
    "3-qadamda listen EADDRINUSE: address already in use :::3000",
    "sizning server.jsingizda callback xatoni o'qiydi (Gemini boshqacha yozgan) — bu yaxshi; ikkala terminalni ham to'xtating"
   ],
   [
    "4-qadamda javob bor",
    "yana bir terminal ochiq qolgan — hammasini Ctrl+C"
   ]
  ]
 },
 "28": {
  "type": "Lesson",
  "kicker": "7-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m4-06 · m4-08",
  "title": "Ikki o'quvchi darsi: nimani ko'radi, siz nimani qo'shasiz, nimaga tayyor turasiz",
  "seg": [
   [
    "a",
    "m4-06 (21 ekran): do'kon tugmalar bilan, amaliyotda — <b>haqiqiy PostgreSQL terminali</b>; jadval bugungi <code>products</code> ning o'zi",
    "Endi sinfga tayyorgarlik, ikki ekran. Birinchi o'quvchi darsi m4-06, yigirma bir ekran: o'quvchi do'konni tugmalar bilan boshqaradi, insert, select, where, update, delete. Jadval bugun siz yaratgan products'ning aynan o'zi. Amaliyotda esa u haqiqiy PostgreSQL terminalida yoki VS Code'da AI bilan o'z do'konini yaratadi, shuning uchun PostgreSQL har kompyuterda ishlab turishi shart. AI yozgan buyruqni oltinchi bosqichdagidek tekshirasiz."
   ],
   [
    "b",
    "m4-08 (9 ekran): <code>cars</code> jadvali qo'lda, <code>server.js</code> Gemini'dan, Postman bilan sinov — <b>bugungi serveringizning o'zi</b>",
    "Ikkinchisi m4-08, AvtoIjara, to'qqiz ekran: o'quvchi cars jadvalini terminalda o'zi yozadi, server kodini Gemini'dan oladi, Postman bilan sinaydi va AI xatosini topadi. Bu bugun siz ko'targan serverning o'zi. Farqi: o'quvchi Pool'ning ichini, tranzaksiyani va injection'ni bilmaydi, siz bilasiz."
   ],
   [
    "c",
    "Siz qo'shasiz: javobdagi son · <code>BEGIN … ROLLBACK</code> · <code>ORDER BY</code> · apostrof · <code>NOT NULL</code> · <b><code>HINT</code> ham adashadi</b>; to'rt farqni oldindan ayting",
    "Darsga siz qo'shadigan narsalar: har update'dan keyin javobdagi sonni so'rang, where'siz update'ni proyektorda begin ichida ko'rsating, order by va apostrofni ayting, o'z do'konini yaratayotganda not null'ni maslahat bering, hint ham adashishini eslating. To'rt farqni oldindan ayting: darsdagi xato matni qisqa, Gemini har kimga boshqacha kod yozadi, POST'dan keyin is rented null, port band bo'lsa ham «ishlayapti»."
   ],
   [
    "d",
    "Xulosa: darsdan oldin — har kompyuterda PostgreSQL va Postman, <b>sinf paroli</b>, bitta loyiha — bitta terminal; vaqt amaliyotga",
    "Xulosa: darsdan oldin uch narsani tekshiring: har kompyuterda PostgreSQL terminali ochiladi va Postman o'rnatilgan, sinf paroli hammaga ma'lum, qoida: bitta loyiha, bitta terminal. Vaqt bo'yicha taklif: m4-06 da to'qson daqiqaning yigirma beshi amaliyotga, m4-08 da qirqi server va Postman'ga, chunki o'quvchilar eng ko'p xato qiladigan joy shu."
   ]
  ]
 },
 "29": {
  "type": "Lesson",
  "kicker": "7-bosqich · sinfga tayyorgarlik",
  "title": "Olti holat va tayyor javoblar — hammasini bugun o'zingiz ko'rdingiz",
  "seg": [
   [
    "a",
    "Darsda albatta chiqadigan olti holat — <b>hammasini bugun o'zingiz ko'rdingiz</b>",
    "Ikki o'quvchi darsini bilasiz. Endi darsda albatta chiqadigan oltita holatni ko'ramiz. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman."
   ],
   [
    "b",
    "Nom xatosi va apostrof — <b><code>\\d</code> bilan solishtiring</b>, apostrof ikki marta",
    "Birinchi holat jadval yoki ustun nomidagi xato: xabar ichidagi nomni backslash d bilan solishtiring, hint'ga ishonmang. Ikkinchisi apostrof: u ikki marta yoziladi."
   ],
   [
    "c",
    "<code>WHERE</code>'siz va ulanish xatolari — <b><code>BEGIN</code>, parol va bo'sh xabar</b>",
    "Uchinchisi where'siz update yoki delete: uning oldi begin bilan olinadi. To'rtinchisi parol yoki baza nomidagi xato: uni Pool sozlamalarida qidiring. Beshinchisi: xabar bo'sh bo'lsa, console error'ga butun xatoni bering va PostgreSQL'ni tekshiring."
   ],
   [
    "d",
    "Xulosa: o'zgarmasa — ikkinchi terminal; <b>xabarni o'quvchi bilan birga o'qing</b>, javobni darhol aytmang",
    "Oltinchisi: o'quvchi «o'zgarmadi» desa, ikkinchi terminalda eski server qolganini tekshiring. Xulosa va usul bitta: javobni darhol aytmang, xabarni o'quvchi bilan birga o'qing. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "30": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "UPDATE products SET price = 99000; — WHERE yo'q. Javob?",
    "o": [
     "UPDATE 1 — faqat birinchi qator o'zgaradi",
     "ERROR — WHERE'siz UPDATE taqiqlangan",
     "UPDATE 3 — hamma qator yangi narxni oldi",
     "UPDATE 0 — shart yo'q, hech narsa"
    ],
    "c": 2,
    "e": "WHERE'siz — jadvaldagi hamma qator.",
    "s": 9
   },
   {
    "q": "BEGIN; → DELETE FROM products; → ROLLBACK; → SELECT *. Natija?",
    "o": [
     "Hamma mahsulot joyida — DELETE bekor bo'ldi",
     "(0 rows) — DELETE allaqachon diskka yozilgan",
     "Faqat birinchi qator qaytib keladi, xolos",
     "ERROR — ROLLBACK'dan keyin jadval yopiq"
    ],
    "c": 0,
    "e": "ROLLBACK tranzaksiyani bekor qiladi.",
    "s": 12
   },
   {
    "q": "Tranzaksiya ichida buyruq xato berdi, prompt shop=!#. Endi SELECT 1; yozsangiz?",
    "o": [
     "Oddiy ishlaydi — xato o'tib ketgan",
     "current transaction is aborted xatosi",
     "Baza o'zi COMMIT qilib, natija beradi",
     "Prompt o'zi oddiy holatga qaytadi"
    ],
    "c": 1,
    "e": "Aborted holat: ROLLBACKgacha hamma buyruq rad etiladi.",
    "s": 10
   },
   {
    "q": "UPDATEdan keyin SELECT * da qator ro'yxat oxiriga tushdi. Sabab?",
    "o": [
     "Bu xato — qator buzilgan, qayta yozing",
     "id o'zgardi — UPDATE yangi id berdi",
     "Tranzaksiya yopilmagan — qator vaqtincha",
     "ORDER BY yo'q — tartib kafolatlanmaydi"
    ],
    "c": 3,
    "e": "ctid o'zgardi; tartib ORDER BY bilan.",
    "s": 6
   },
   {
    "q": "new Pool({…}) yaratildi, parol xato. Server ishga tushganda nima bo'ladi?",
    "o": [
     "Darhol xato beradi, server tushadi",
     "Server yonadi, xato birinchi so'rovda",
     "Pool to'g'ri parolni o'zi topib oladi",
     "Hech qachon xato chiqmaydi — parol keshda"
    ],
    "c": 1,
    "e": "Pool birinchi so'rovda ulanadi.",
    "s": 17
   },
   {
    "q": "Server «ishlayapti», GET ishlaydi, POST — Cannot destructure property 'model' of 'req.body'. Sabab?",
    "o": [
     "Parol xato — baza so'rovni rad etdi",
     "Jadval yo'q — INSERT bajarilmadi",
     "Port band — POST boshqa serverga ketdi",
     "express.json() ulanmagan — tana bo'sh"
    ],
    "c": 3,
    "e": "req.body o'qilmagan.",
    "s": 23
   },
   {
    "q": "POST 500, {\"error\":\"\"}, terminalda bo'sh qator. Birinchi qadam?",
    "o": [
     "Serverni o'chirib, qaytadan yoqib ko'rish",
     "Gemini'dan butunlay yangi kod so'rash",
     "console.error(err) bilan xatoni ko'rish",
     "npm install bilan paketlarni yangilash"
    ],
    "c": 2,
    "e": "Bo'sh xabar — ECONNREFUSED yashiringan.",
    "s": 24
   },
   {
    "q": "'DELETE … WHERE id = ' + req.params.id va URL 1 OR 1=1. Nima bo'ladi?",
    "o": [
     "Hamma qator o'chadi va javob 200 qaytadi",
     "Baza bunday so'rovni rad etadi — 500",
     "404 — 1 OR 1=1 degan id topilmadi",
     "Faqat birinchi mashina o'chadi, qolgani qoladi"
    ],
    "c": 0,
    "e": "Yopishtirilgan matn SQL bo'ldi; $1 bilan — 500, jadval joyida.",
    "s": 20
   }
  ]
 },
 "31": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};
