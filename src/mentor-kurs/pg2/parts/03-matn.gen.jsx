
// ============================================================
//  PG-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/pg2-matn.py (manba: 08-PostgreSQL2-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · PostgreSQL",
  "title": "Jadval tayyor. Endi uni boshqaramiz — PostgreSQL terminalida va Express ichida.",
  "seg": [
   [
    "a",
    "PostgreSQL-1 da jadval yaratdingiz — bugun undagi ma'lumotni <b>to'rt buyruq bilan boshqaramiz</b>",
    "Assalomu alaykum. Oldingi darsda PostgreSQL'ni o'rnatdingiz, jadval yaratdingiz va bog'ladingiz. Bugun jadvaldagi ma'lumotni boshqaramiz: qo'shish, ko'rish, o'zgartirish va o'chirish. Buni CRUD deyishadi, uning nimaligini keyingi ekranda aniq ko'ramiz."
   ],
   [
    "b",
    "Avval PostgreSQL terminalida qo'lda: o'quvchi m4-06 dagi <b>do'konning o'zi bilan</b>",
    "Avval bu buyruqlarni PostgreSQL terminalida qo'lda yozamiz. Misol o'quvchi m4-06 darsidagi do'konning aynan o'zi: klaviatura, sichqoncha, quloqchin. Sinfda o'quvchi ekranda ko'radigan narsani siz bazada ko'rgan bo'lasiz."
   ],
   [
    "c",
    "Keyin o'sha so'rovlar <b>Express ichida</b> — o'quvchi m4-08 da AvtoIjara serverini quradi",
    "Keyin xuddi shu so'rovlarni Express serveri ichiga qo'yamiz. O'quvchi m4-08 darsida AvtoIjara uchun server quradi, kodini Gemini yozadi. Siz bu serverni o'zingiz ishga tushirasiz, ataylab buzasiz va tuzatasiz."
   ],
   [
    "d",
    "Olti bosqich, to'rt amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Dars olti bosqichdan iborat, orasida to'rtta amaliyot bor. Oxirida ikki o'quvchi darsini qanday o'tishni ko'ramiz. Shoshilmang: har ekranni boshidan eshitish va matnini o'qish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD PostgreSQL terminalida",
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
    "PostgreSQL'da har amalning o'z buyrug'i bor. Yaratish insert, o'qish select, o'zgartirish update, o'chirish esa delete. Har buyruqdan keyin baza qisqa javob qaytaradi, masalan insert nol bir yoki update bir. Bu javobni o'qishni bugun alohida o'rganamiz."
   ],
   [
    "c",
    "Serverda xuddi shu to'rt amal <b>endpoint bo'ladi</b>: <code>POST</code>, <code>GET</code>, <code>PUT</code>, <code>DELETE</code>",
    "Serverda xuddi shu to'rt amal endpoint bo'ladi. Yaratish POST, o'qish GET, o'zgartirish PUT, o'chirish DELETE. Har endpoint ichida o'sha SQL buyrug'i turadi. Postman javobida esa status chiqadi: yaratilganda ikki yuz bir, qolganlarida ikki yuz."
   ],
   [
    "d",
    "Xulosa: har amalning bazada bitta buyrug'i, serverda <b>bitta endpoint'i bor</b>",
    "Xulosa: CRUD to'rtta amaldan iborat. Har amalning PostgreSQL'da bitta buyrug'i va serverda bitta endpoint'i bor. Demak, bugun avval buyruqlarni PostgreSQL terminalida qo'lda yozamiz, keyin xuddi shularni Express serveri ichiga qo'yamiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD PostgreSQL terminalida",
  "title": "products — o'quvchi darsidagi jadval aynan",
  "seg": [
   [
    "a",
    "O'quvchi m4-06 da <b>shu jadvalni ko'radi</b>: id, nom, narx va qoldiq",
    "Jadvaldan boshlaymiz. O'quvchi m4-06 darsida aynan shu jadvalni ko'radi. Uning nomi products, unda to'rtta ustun bor: id o'zi o'sadi, nomi matn, narxi va qoldig'i esa butun son. Siz shop degan bazada uni PostgreSQL terminalida yaratasiz."
   ],
   [
    "b",
    "Bitta <code>INSERT</code> bilan uch qator; javobdagi oxirgi raqam — <b>qo'shilgan qatorlar soni</b>",
    "Bitta insert bilan uchta mahsulot qo'shamiz, xuddi o'quvchi darsidagidek. Baza javobi insert, nol, uch. Oxirgi raqam nechta qator qo'shilganini aytadi. Keyin to'rtinchi mahsulotni qo'shamiz: Mishka, narxi ellik ming so'm."
   ],
   [
    "c",
    "<code>SELECT *</code> — hamma ustun; <code>id</code> larni biz yozmadik, <b>baza o'zi berdi</b>",
    "Select yulduzcha hamma ustunni ko'rsatadi. id ustunini biz yozmadik, baza o'zi bir, ikki, uch, to'rt deb berdi. O'quvchi «id'ni qayerdan oldik?» desa, javob shu: serial."
   ],
   [
    "d",
    "Xulosa: jadval va ma'lumot o'quvchi darsidagidek — lekin ustunlarda <b><code>NOT NULL</code> yo'q</b>",
    "Xulosa: bazangizda o'quvchi darsidagi do'konning aynan o'zi bor. Bitta narsani eslab qoling: bu jadvalda not null qoidasi yo'q. Nima bo'lishini uchinchi bosqichda ko'ramiz."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD PostgreSQL terminalida",
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
    "Minglab mahsulotdan faqat keraklisini olish uchun where yoziladi. Narxi yuz mingdan kam bo'lganlarini so'raymiz: sichqoncha, quloqchin va mishka, ya'ni uchta qator. O'quvchi darsida bu filtr tugma bilan, siz esa uni so'rovda yozdingiz."
   ],
   [
    "c",
    "<code>WHERE stock &lt; 6</code> — tugayotgan mahsulot: <b>faqat quloqchin</b>",
    "Ikkinchi filtr qoldig'i oltidan kam, ya'ni tugayotgan mahsulotlarni topadi. Natijada faqat quloqchin chiqdi, undan beshta qolgan. Do'kon menejeri aynan shu so'rov bilan nimani buyurtma qilishni biladi."
   ],
   [
    "d",
    "Xulosa: <code>SELECT</code> faqat o'qiydi; <b><code>WHERE</code> qatorlarni tanlaydi</b>",
    "Xulosa: select hech narsani o'zgartirmaydi, faqat o'qiydi. Where qaysi qatorlar kerakligini aytadi. Bu ikkisini yaxshi tushungan o'quvchi update va delete'ni ham oson tushunadi, chunki ularda ham aynan shu where ishlaydi."
   ]
  ]
 },
 "5": {
  "type": "Lesson",
  "kicker": "1-bosqich · CRUD PostgreSQL terminalida",
  "title": "UPDATE 1, DELETE 1 — javobdagi son nechta qator tegilganini aytadi",
  "seg": [
   [
    "a",
    "Klaviatura arzonladi: <code>UPDATE … WHERE id = 1</code> — javob <b><code>UPDATE 1</code></b>, bitta qator",
    "O'quvchi darsidagi voqea: klaviatura narxi to'qson to'qqiz mingga tushdi. Buyruq shunday: update, set price, where id bir. Baza javobi update bir, ya'ni bitta qator o'zgardi. Javobdagi son doim nechta qator tegilganini aytadi."
   ],
   [
    "b",
    "Quloqchin sotuvdan chiqdi: <code>DELETE … WHERE id = 3</code> — <b><code>DELETE 1</code></b>",
    "Quloqchin sotuvdan chiqdi, uni o'chiramiz: delete from products, where id uch. Baza javobi delete bir. Endi select bilan jadvalni ko'ramiz."
   ],
   [
    "c",
    "Diqqat: Klaviatura ro'yxat oxiriga tushdi — <code>ORDER BY</code> bo'lmasa <b>tartib kafolatlanmaydi</b>",
    "Natijaga qarang: klaviatura birinchi emas, oxirida turibdi. Bu xato emas. Order by yozilmasa, baza qatorlarni istalgan tartibda qaytarishi mumkin. Sinfda o'quvchi «mahsulot o'rni o'zgardi» desa, javob shu. Tartib kerak bo'lsa, oxiriga order by id yoziladi."
   ],
   [
    "d",
    "Bunday <code>id</code> yo'q bo'lsa — <b>xato emas</b>, <code>UPDATE 0</code> va <code>DELETE 0</code>",
    "To'qson to'qqizinchi mahsulotni o'zgartirib ko'ramiz. Xato chiqmaydi, javob update nol. Delete ham nol qaytaradi. Baza «bunday qator yo'q» deb aytmaydi, shunchaki hech narsaga tegmaydi. Shuning uchun javobdagi sonni o'qish kerak."
   ],
   [
    "e",
    "Xulosa: har <code>UPDATE</code> va <code>DELETE</code>dan keyin <b>javobdagi sonni o'qing</b>",
    "Xulosa: update va delete'dan keyin javobdagi sonni o'qing. Bir bo'lsa, kutganingiz bo'ldi. Nol bo'lsa, where hech narsaga mos kelmadi. Kutilmagan katta son bo'lsa, where noto'g'ri yoki umuman yozilmagan. Buni keyingi bosqichda ko'ramiz."
   ]
  ]
 },
 "6": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "O'quvchi: «UPDATE products SET price = 1 WHERE id = 99; yozdim — xato chiqmadi, UPDATE 0». Nima bo'ldi?",
  "q": "Javobdagi sonni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. O'quvchi to'qson to'qqizinchi mahsulot narxini o'zgartirmoqchi bo'ldi. Xato yo'q, javob: update nol. Nima bo'ldi? Variantni tanlang.",
  "ok": "To'g'ri. Where id to'qson to'qqiz hech qanday qatorga mos kelmadi, shuning uchun nol qator o'zgardi. Baza buni xato deb hisoblamaydi. O'quvchiga ayting: avval select bilan bunday id bor-yo'qligini tekshirsin. Demak, update nol xato emas: bu where hech qaysi qatorga mos kelmaganini bildiradi.",
  "okShort": "<code>UPDATE 0</code> — <code>WHERE</code> hech bir qatorga mos kelmadi. Xato emas: avval <code>SELECT … WHERE id = 99</code> bilan tekshiring.",
  "hint": "Javobdagi son nimani sanaydi? WHERE qaysi qatorni topishi kerak edi?",
  "correct": 0,
  "opts": [
   "id = 99 qator yo'q — WHERE hech narsaga mos kelmadi",
   "Narxni o'zgartirishga ruxsat yo'q",
   "Jadval bo'shab qoldi",
   "Narx o'zgardi, lekin hali saqlanmadi"
  ],
  "wrong": {
   "1": "Ruxsat yo'q bo'lsa ERROR:  permission denied for table products chiqardi; bu yerda xato yo'q.",
   "2": "Jadval joyida: UPDATE 0 hech narsani o'chirmaydi.",
   "3": "Tranzaksiyasiz UPDATE darhol saqlanadi; son esa nechta qator tegilganini aytadi."
  }
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 4",
  "eyebrow": "Hozir o'zingizda · 10–15 daqiqa",
  "title": "shop bazasi va CRUD — o'quvchi darsidagi to'rt voqea",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi darsidagi to'rt voqeani <b>o'z bazangizda bajarasiz</b>",
    "Endi navbat sizga. O'quvchi darsidagi to'rt voqeani o'z bazangizda bajarasiz: jadval yaratasiz, mahsulot qo'shasiz, filtrlaysiz, keyin narxni o'zgartirib, bitta mahsulotni o'chirasiz. Bunga o'n-o'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–3-qadam: baza, jadval, mahsulotlar va <b>ikki filtr</b>",
    "Birinchi qadamda shop bazasi va products jadvalini yaratasiz. Ikkinchisida to'rtta mahsulot qo'shasiz. Uchinchisida ikkita filtr yozasiz: arzonlarini va tugayotganlarini. Har buyruqdan keyin javob satrini o'qing."
   ],
   [
    "c",
    "4-qadam: narx va o'chirish; isbot — oxirgi <code>SELECT</code>dagi <b>qatorlar soni</b>",
    "To'rtinchi qadamda klaviatura narxini o'zgartiring va quloqchinni o'chiring, keyin select yulduzcha. Isbot maydoniga oxirgi select natijasi ostidagi qatorlar sonini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz CRUD'ning to'rt buyrug'ini o'z bazangizda yozgan va har javobdagi sonni o'qigan bo'lasiz."
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "2-bosqich · xavfsiz sinash",
  "title": "WHERE unutilsa — UPDATE 3, DELETE 3. Xavfsiz sinash: BEGIN … ROLLBACK",
  "seg": [
   [
    "a",
    "O'quvchi darsi ogohlantiradi: <code>WHERE</code>'siz — <b>hamma qator</b>. Buni xavfsiz ko'ramiz",
    "O'quvchi darsida qizil ogohlantirish bor: update yoki delete'da where unutilsa, hamma qator o'zgaradi. Siz buni o'z ko'zingiz bilan ko'rishingiz kerak, lekin bazani buzmasdan. Usul: avval begin, ya'ni tranzaksiya ochamiz."
   ],
   [
    "b",
    "<code>WHERE</code>'siz <code>UPDATE</code> — <b><code>UPDATE 3</code></b>: hamma mahsulot to'qson to'qqiz ming",
    "Begin'dan keyin where'siz update. Baza javobi update uch. Select qilsak, hamma mahsulot to'qson to'qqiz ming so'm: sichqoncha ham, mishka ham. Mana o'quvchi darsidagi ogohlantirishning o'zi."
   ],
   [
    "c",
    "<code>WHERE</code>'siz <code>DELETE</code> — <code>DELETE 3</code>, <b>jadval bo'sh</b>",
    "Undan ham yomoni where'siz delete. Baza javobi delete uch, select esa nol qator qaytaradi. Haqiqiy do'konda bu butun katalog yo'qolgani."
   ],
   [
    "d",
    "<code>ROLLBACK</code> — <b>hammasi joyida</b>: tranzaksiya ichidagi o'zgarish bekor bo'ldi",
    "Endi rollback yozamiz va select qilamiz: uchala mahsulot joyida, narxlari ham eski. Tranzaksiya ichida qilingan hamma narsa bekor bo'ldi. PostgreSQL-1 da tranzaksiya do'konni himoya qilgan edi, bu yerda u sizning sinov maydoningiz."
   ],
   [
    "e",
    "Xulosa: xavfli <code>UPDATE</code>/<code>DELETE</code>ni avval <b><code>BEGIN</code> ichida sinang</b>, <code>SELECT</code> bilan ko'ring",
    "Xulosa: xavfli update yoki delete'ni avval begin ichida yurgizing, select bilan natijani ko'ring. To'g'ri bo'lsa commit, noto'g'ri bo'lsa rollback. Sinfda o'quvchiga ham shuni o'rgating: bu bitta qator, lekin butun jadvalni saqlab qoladi."
   ]
  ]
 },
 "9": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "BEGIN; → DELETE FROM products; (DELETE 3) → ROLLBACK; → SELECT * FROM products;. Nima chiqadi?",
  "q": "Xavfsiz sinashni ko'rdingiz, tekshirib olaylik. Ikkinchi tekshiruv. Begin, where'siz delete, javob delete uch. Keyin rollback va select. Jadvalda nima bor? Variantni tanlang.",
  "ok": "To'g'ri. Delete tranzaksiya ichida edi, rollback uni bekor qildi. Uchala mahsulot joyida. Commit yozilmaguncha o'zgarish saqlanmaydi. Demak, begin va rollback xavfli buyruqni bazani buzmasdan sinash imkonini beradi.",
  "okShort": "<code>ROLLBACK</code> — tranzaksiya ichidagi hamma o'zgarish bekor: uch qator joyida.",
  "hint": "ROLLBACK tranzaksiya ichidagi o'zgarishlar bilan nima qiladi?",
  "correct": 2,
  "opts": [
   "Nol qator — DELETE 3 bajarilgan edi",
   "Faqat bitta qator — oxirgisi qaytadi",
   "Uchala mahsulot — ROLLBACK o'chirishni bekor qildi",
   "ERROR — o'chirilgan jadvaldan o'qib bo'lmaydi"
  ],
  "wrong": {
   "0": "DELETE 3 tranzaksiya ichida edi va COMMIT qilinmadi.",
   "1": "ROLLBACK bitta qatorni emas, butun tranzaksiyani bekor qiladi.",
   "3": "DELETE qatorlarni o'chiradi, jadvalni emas; jadval doim joyida."
  }
 },
 "10": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 4",
  "eyebrow": "Hozir o'zingizda · 5–10 daqiqa",
  "title": "WHERE'siz UPDATEni xavfsiz sinang",
  "seg": [
   [
    "a",
    "Endi siz: <code>WHERE</code>'siz <code>UPDATE</code>ni o'z bazangizda, lekin <b>tranzaksiya ichida</b> qilasiz",
    "Endi o'zingiz: where'siz update'ni o'z bazangizda qilasiz, lekin tranzaksiya ichida. Bunga besh-o'n daqiqa ketadi. Bu mashqni sinfda o'quvchilarga ham ko'rsatasiz."
   ],
   [
    "b",
    "1–2-qadam: <code>BEGIN</code>, <code>WHERE</code>'siz <code>UPDATE</code> va <code>SELECT</code> — <b>hamma narx bir xil</b>",
    "Birinchi qadamda begin yozasiz. Ikkinchisida where'siz update qilib, select bilan hamma narx bir xil bo'lganini ko'rasiz. Commit yozmang."
   ],
   [
    "c",
    "3–4-qadam: <code>ROLLBACK</code> va <code>SELECT</code>; isbot — <b>klaviaturaning narxi</b>",
    "Uchinchi qadamda rollback yozasiz, to'rtinchisida yana select qilasiz. Isbot maydoniga klaviaturaning hozirgi narxini yozing, rollback'dan keyingisini."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz where'siz update qanday xavfli ekanini ko'rdingiz va rollback bilan hammasini qaytarishni o'rgandingiz."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · xatolar",
  "title": "Beshta xato — har birini xabarning o'zi aytadi",
  "seg": [
   [
    "a",
    "AI xatosi o'quvchi darsida bor: <code>product</code> — <b>bitta <code>s</code> yetmaydi</b>, jadval «yo'q»",
    "Endi sinfda chiqadigan xatolar. Birinchisi o'quvchi darsida ham bor: AI products o'rniga product deb yozgan. Baza relation product does not exist deb javob beradi. Jadval bor, faqat nomi bitta harfga farq qiladi."
   ],
   [
    "b",
    "Ustun nomi xato: <code>narx</code> — <code>HINT</code> esa <b>noto'g'ri ustunni taklif qiladi</b>",
    "Ikkinchisi ustun nomida. O'quvchi narx deb yozdi. Baza column narx does not exist deb javob beradi, ostida esa hint: perhaps you meant name. Diqqat: hint taxmin qiladi va bu yerda adashgan, kerakli ustun price. Hint'ni emas, jadval tuzilishini teskari chiziqcha d bilan tekshiring."
   ],
   [
    "c",
    "Son o'rniga matn va tushib qolgan qiymat — <b><code>invalid input syntax</code></b>, <code>more target columns</code>",
    "Uchinchisi: narx ustuniga arzon degan so'z yozilgan, baza invalid input syntax for type integer deydi. To'rtinchisi: uchta ustun yozilgan, qiymat esa ikkita, baza insert has more target columns than expressions deydi. Ikkalasida ham strelka xato joyni ko'rsatadi."
   ],
   [
    "d",
    "O'zbekcha apostrof satrni yopadi: <code>syntax error at or near \"yinchoq\"</code> — <b>ikki marta yoziladi</b>",
    "Beshinchisi, o'zbek sinfida eng ko'p uchraydigani: apostrof. O'yinchoq so'zidagi apostrof satrni yopib qo'yadi, baza yinchoq so'zida adashadi. Tuzatish: apostrofni ikki marta yozish. Shunda mahsulot saqlanadi."
   ],
   [
    "e",
    "Xulosa: xabar ichidagi nomni <b>jadval tuzilishi bilan solishtiring</b> — <code>\\d products</code>",
    "Xulosa: bu xatolarning hammasida xabar ichida nom yoki qiymat turadi. Uni jadval tuzilishi bilan solishtiring, teskari chiziqcha d products. Apostrof uchun bitta qoida: so'z ichidagi apostrof ikki marta yoziladi."
   ]
  ]
 },
 "12": {
  "type": "Lesson",
  "kicker": "3-bosqich · xatolar",
  "title": "Qoida yozilmagan bo'lsa, baza qo'riqlamaydi: nomsiz mahsulot xato bermay saqlandi",
  "seg": [
   [
    "a",
    "PostgreSQL-1 da baza bo'sh nomni rad etgan edi — bu jadvalda esa <b>xato yo'q</b>",
    "PostgreSQL-1 da bo'sh username'ni baza rad etgan edi. Bu jadvalda sinab ko'ramiz: nomsiz mahsulot qo'shamiz. Xato chiqmadi, baza javobi insert nol bir."
   ],
   [
    "b",
    "<code>WHERE name IS NULL</code> — <b>bo'sh nomli qator</b> do'kon katalogida turibdi",
    "Where name is null bilan qidiramiz. Beshinchi qator chiqdi: nomi bo'sh, narxi o'ttiz ming. Saytda bu nomsiz mahsulot bo'lib chiqadi."
   ],
   [
    "c",
    "Sabab: o'quvchi darsidagi jadvalda <code>NOT NULL</code> yo'q — baza <b>faqat yozilgan qoidani</b> qo'riqlaydi",
    "Sabab jadvalning o'zida: o'quvchi darsidagi products'da not null yo'q. Baza faqat yozilgan qoidani qo'riqlaydi. PostgreSQL-1 dagi «baza o'zi tekshiradi» degan gap qoida yozilgandagina to'g'ri."
   ],
   [
    "d",
    "Xulosa: o'quvchi darsini o'zgartirmaysiz, lekin o'z jadvalida <b><code>NOT NULL</code> yozishni</b> maslahat berasiz",
    "Xulosa: o'quvchi darsidagi jadvalni o'zgartirmaysiz, u sodda bo'lishi uchun shunday. Lekin amaliyotda o'quvchi o'z do'koni jadvalini yaratadi. O'shanda maslahat bering: nom va narxga not null yozsin."
   ]
  ]
 },
 "13": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "O'quvchi VALUES ('O'yinchoq', 30000, 4) yozdi va syntax error at or near \"yinchoq\" oldi. Nima deysiz?",
  "q": "Xatolarni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi o'yinchoq degan mahsulot qo'shmoqchi, baza syntax error, yinchoq so'zida. Unga nima deysiz? Variantni tanlang.",
  "ok": "To'g'ri. SQL'da matn bir tirnoq ichida, so'z ichidagi apostrof uni erta yopadi. Ikki marta yozilsa, baza uni bitta apostrof deb tushunadi va mahsulot o'yinchoq nomi bilan saqlanadi. Demak, SQL matnidagi har bir apostrof ikki marta yoziladi.",
  "okShort": "<code>'O''yinchoq'</code> — so'z ichidagi apostrof ikki marta. Saqlanganda bitta bo'ladi: <code>O'yinchoq</code>.",
  "hint": "Matn qaysi belgi bilan boshlanib, qaysi belgi bilan tugaydi? Apostrof shu belgining o'zi.",
  "correct": 1,
  "opts": [
   "Mahsulot nomini lotincha emas, kirillda yozing",
   "So'z ichidagi apostrofni ikki marta yozing: 'O''yinchoq'",
   "Nomni qo'shtirnoqqa oling: \"O'yinchoq\"",
   "name ustunining turini VARCHAR qiling"
  ],
  "wrong": {
   "0": "Muammo harfda emas, apostrofda: u matnni erta yopyapti.",
   "2": "Qo'shtirnoq SQL'da ustun yoki jadval nomi uchun — sinab ko'rdik: column \"O'yinchoq\" does not exist.",
   "3": "Ustun turi bu xatoga aloqasiz: xato matn yozilishida."
  }
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express",
  "title": "m4-08: cars jadvali o'quvchining o'zi yozadi, server.js ni Gemini",
  "seg": [
   [
    "a",
    "PostgreSQL terminalidagi CRUD endi <b>server ichida</b>: o'quvchi m4-08 da AvtoIjara uchun quradi",
    "PostgreSQL terminalida qo'lda qildingiz, endi xuddi shu so'rovlar server ichida. O'quvchi m4-08 darsida avval cars jadvalini PostgreSQL terminalida o'zi yozadi: model, kunlik narx, yil va ijaradami. Keyin server kodini Gemini yozadi."
   ],
   [
    "b",
    "<code>Pool</code> — bazaga ulanish sozlamalari: foydalanuvchi, parol, baza nomi <b>bir joyda</b>",
    "Kodning tepasida pg paketidan Pool olinadi. Unga foydalanuvchi, parol, baza nomi, host va port beriladi. Parolni o'quvchi o'zi yozadi, PostgreSQL o'rnatilganda berilgan parol. Shuning uchun sinf paroli hammada bir xil bo'lsa, ishingiz oson."
   ],
   [
    "c",
    "<code>GET /api/cars</code>: <code>pool.query</code> so'rovni bazaga olib boradi, <b><code>rows</code></b> — javobga ketadi",
    "Endi GET api cars endpoint'i. Pool query select'ni bazaga olib boradi, natijaning rows qismi, ya'ni qatorlar, res json bilan qaytadi. Postman'da ikki yuz va uchta mashina. Bu PostgreSQL terminalidagi select'ning o'zi, faqat javob JSON ko'rinishida."
   ],
   [
    "d",
    "Xatoda <code>catch</code>: <b>status 500 va xato matni</b> — o'quvchi uni Postman'da ko'radi",
    "Pastda catch turibdi: xato bo'lsa, server besh yuz status va xato matnini qaytaradi. Bu muhim: sinfdagi xatolarning ko'pini o'quvchi aynan shu javobda ko'radi. Beshinchi bosqichda shu yo'l bilan buzamiz."
   ],
   [
    "e",
    "Xulosa: <code>Pool</code> → <code>pool.query</code> → <code>rows</code> → <code>res.json</code> — <b>server bazaga shu yo'l bilan ulanadi</b>",
    "Xulosa: so'rov serverdan bazaga to'rt qadamda boradi. Pool ulanadi, pool query so'rov yuboradi, rows qatorlarni oladi, res json javob qaytaradi. O'quvchi darsidagi test savoli ham shu haqda: serverni bazaga pool query ulaydi."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express",
  "title": "To'rt endpoint — to'rt SQL buyruq; javob statusi bilan",
  "seg": [
   [
    "a",
    "<code>POST</code> — <code>INSERT … RETURNING *</code>: yangi qator javobda, <b>status 201</b>",
    "GET o'qiydi, qolgan uchtasi yozadi. POST'da insert, oxirida returning yulduzcha: baza yangi qatorni, id bilan, qaytaradi. Status ikki yuz bir, ya'ni yaratildi. Chevrolet Spark to'rtinchi id bilan qo'shildi."
   ],
   [
    "b",
    "<code>is_rented: null</code> — <code>POST</code>da berilmagan ustun bo'sh qoladi, <b><code>DEFAULT</code> yo'q</b>",
    "Javobga qarang: is rented null. POST'da bu ustun berilmadi, jadvalda esa default qiymat yo'q. Sinfda o'quvchi «nega null?» desa, javob shu. Kerak bo'lsa, jadvalda default false yoziladi."
   ],
   [
    "c",
    "<code>PUT</code> — <code>UPDATE … WHERE id = $2</code>, <code>DELETE</code> — <code>WHERE id = $1</code>: <b>200</b>",
    "PUT ikkinchi mashina narxini yangiladi, ikki yuz va yangilangan qator. DELETE birinchi mashinani o'chirdi, ikki yuz. Ikkalasida ham where bor, faqat id endi URL'dan keladi."
   ],
   [
    "d",
    "Yo'q <code>id</code>: kod <code>rowCount</code>ni tekshiradi va 404 qaytaradi — bu namunaning <b>to'g'ri qarori</b>",
    "To'qson to'qqizinchi mashina: to'rt yuz to'rt, mashina topilmadi. Nega? Baza update nol qaytaradi, xato emas. Bu namunada kod rowCount nolmi deb tekshiradi va to'rt yuz to'rt beradi. To'g'ri qaror: aks holda o'quvchi ikki yuz ko'rib, «o'zgardi» deb o'ylaydi. Gemini buni har doim ham yozmaydi."
   ],
   [
    "e",
    "Xulosa: GET — 200, POST — 201, PUT/DELETE — 200, <b>topilmasa — 404</b>, xato — 500",
    "Xulosa: GET ikki yuz, POST ikki yuz bir, PUT va DELETE ikki yuz qaytaradi; qator topilmasa to'rt yuz to'rt, xato bo'lsa besh yuz. Har biri PostgreSQL terminalidagi bitta buyruq. Javobdagi son, ya'ni rowCount, PostgreSQL terminalidagi update bir yoki update nol'ning o'zi."
   ]
  ]
 },
 "16": {
  "type": "Lesson",
  "kicker": "4-bosqich · Express",
  "title": "Yopishtirilgan SQL: 1 OR 1=1 — uchala mashina o'chdi. $1 bilan — 500, jadval joyida",
  "seg": [
   [
    "a",
    "O'quvchi testida savol bor: «Nega <code>$1</code>?». <b>Sinab ko'rdik</b> — javob ekranda",
    "O'quvchi darsining testida savol bor: nega dollar bir ishlatamiz? Javob: matn kod bo'lib qolmasin. Bu quruq gap emas, sinab ko'rdik. Delete'da id'ni SQL matniga to'g'ridan-to'g'ri yopishtirdik."
   ],
   [
    "b",
    "URL'ga <code>1 OR 1=1</code> yozildi — so'rov «hammasi» bo'lib qoldi: <b><code>deleted: 3</code></b>",
    "Endi URL'da id o'rniga bir or bir teng bir yuborildi. Yopishtirilgan satr shunday SQL bo'ldi: where id bir, yoki bir teng bir. Bir teng bir doim to'g'ri. Javob ikki yuz, deleted uch, ya'ni jadval bo'sh qoldi. Buni SQL injection deyishadi."
   ],
   [
    "c",
    "<code>$1</code> bilan xuddi shu so'rov: <code>invalid input syntax for type integer</code> — 500, <b>jadval joyida</b>",
    "Endi dollar bir bilan. Qiymat SQL matniga kirmaydi, alohida beriladi. Baza bir or bir teng bir'ni son sifatida o'qishga urinadi va rad etadi: invalid input syntax for type integer. Besh yuz, lekin jadval joyida, uchala mashina bor."
   ],
   [
    "d",
    "Xulosa: qiymat doim <b><code>$1, $2</code> bilan</b> — Gemini promptida ham shunday yozilgan",
    "Xulosa: foydalanuvchidan kelgan har qiymat dollar bir, dollar ikki bilan beriladi. O'quvchi darsidagi Gemini promptida ham shunday talab bor: qiymatlarni SQL matniga yopishtirma. Gemini boshqacha yozsa, o'quvchi buni tekshirishi kerak, siz esa shu misolni ko'rsatasiz."
   ]
  ]
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 4",
  "eyebrow": "Hozir o'zingizda · 15–20 daqiqa",
  "title": "car_rental va server.js — o'quvchi m4-08 dagi ish",
  "seg": [
   [
    "a",
    "Endi siz: m4-08 dagi ishni <b>o'zingiz qilasiz</b> — jadval qo'lda, server Gemini bilan yoki namunadan",
    "Endi o'zingiz qilasiz, o'quvchi m4-08 da qiladigan ishni. Jadvalni PostgreSQL terminalida qo'lda yozasiz. Server kodini o'quvchi promptlari bilan Gemini'dan oling yoki namunani o'zingiz yozing. O'n besh-yigirma daqiqa."
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
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Beshinchi bosqichda bu xatolarning hammasini buzib ko'ramiz. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizda o'quvchi m4-08 da quradigan server ishlab turadi va siz uni Postman bilan sinagan bo'lasiz."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz",
  "title": "column \"price\" of relation \"cars\" does not exist — kodda price, jadvalda daily_price",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi AI xatosini o'zimiz takrorlaymiz: <b><code>INSERT</code>da <code>price</code></b>",
    "Buzishni o'quvchi darsidagi xatodan boshlaymiz. Gemini insert'da daily price o'rniga price yozgan. Serverni ishga tushiramiz: xato yo'q, server ishlayapti deb yozadi. Xato faqat POST yuborilganda chiqadi."
   ],
   [
    "b",
    "POST → 500, xabarda <b>jadval va ustun</b>: <code>\"price\"</code> · <code>\"cars\"</code>",
    "POST yuboramiz, javob besh yuz. Xabarni o'qiymiz: column price of relation cars does not exist. Ustun price, jadval esa cars. O'quvchi darsida xabar qisqaroq yozilgan, haqiqiysi shu, relation cars bilan."
   ],
   [
    "c",
    "Tuzatish: kodda <code>daily_price</code> — serverni qayta ishga tushirib, <b>POST → 201</b>",
    "Jadval tuzilishiga qaraymiz: ustun daily price. Kodda tuzatamiz, serverni to'xtatib, qayta ishga tushiramiz. POST yuboramiz: javob ikki yuz bir, yangi mashina id bilan qaytdi."
   ],
   [
    "d",
    "Xulosa: 500 bo'lsa — <code>error</code> matnidagi nomni <b><code>\\d cars</code> bilan solishtiring</b>",
    "Xulosa: besh yuz chiqsa, xato matnini o'qing, ichida ustun va jadval nomi bor. Uni PostgreSQL terminalidagi teskari chiziqcha d cars bilan solishtiring. Kod o'zgargandan keyin serverni albatta qayta ishga tushiring."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz",
  "title": "Cannot destructure property 'model' of 'req.body' — so'rov tanasi o'qilmagan",
  "seg": [
   [
    "a",
    "Bitta satrni olib tashlaymiz: <code>app.use(express.json())</code> — <b>server baribir ishga tushadi</b>",
    "Endi ikkinchi buzish. Gemini ba'zan bitta satrni unutadi: app use express json. Shu satrni olib tashlaymiz. Server xatosiz ishga tushadi, GET ham ishlaydi. Muammo faqat tanasi bor so'rovlarda."
   ],
   [
    "b",
    "POST → 500: <code>req.body</code> — <b><code>undefined</code></b>, <code>model</code>ni olib bo'lmaydi",
    "POST yuboramiz, javob besh yuz. Xabar shunday: cannot destructure property model of req body as it is undefined. Ya'ni req body umuman yo'q: Express so'rov tanasini o'qimagan, chunki json'ni o'qiydigan qism ulanmagan."
   ],
   [
    "c",
    "Tuzatish: satr qaytariladi, <code>app</code> yaratilgandan keyin — <b>POST → 201</b>",
    "Tuzatish uchun app use express json satrini app yaratilgandan keyin, endpoint'lardan oldin qaytaramiz. Server qayta ishga tushadi, POST ikki yuz bir."
   ],
   [
    "d",
    "Xulosa: <code>req.body</code> <code>undefined</code> bo'lsa — birinchi qaraladigan joy <b><code>express.json()</code></b>",
    "Xulosa: req body undefined degan xato chiqsa, birinchi qaraladigan joy app use express json. GET ishlab, POST va PUT ishlamasa ham shu satr. O'quvchi darsidagi Gemini promptining birinchi bandi aynan shu."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz",
  "title": "Server «ishlayapti» deydi — parol, baza va PostgreSQL xatosi birinchi so'rovda chiqadi",
  "seg": [
   [
    "a",
    "<code>Pool</code> darhol ulanmaydi: server ishga tushadi, <b>xato birinchi so'rovda</b>",
    "Parol xatosini ko'rdik, endi uning g'alati tomoni. Pool server ishga tushganda bazaga ulanmaydi, birinchi so'rovda ulanadi. Shuning uchun parol xato bo'lsa ham terminalda server ishlayapti deb yoziladi. O'quvchi «server ishlayapti, lekin besh yuz» desa, xabarni o'qing."
   ],
   [
    "b",
    "Parol xato — <b><code>password authentication failed</code></b>; parol bo'sh — <b><code>client password must be a string</code></b>",
    "Parol xato bo'lsa: password authentication failed for user postgres. Parol umuman berilmasa, masalan process env'dan o'qilmagan bo'lsa: client password must be a string. Ikkinchisi g'alati ko'rinadi, lekin ma'nosi oddiy: parol o'zgaruvchisi bo'sh."
   ],
   [
    "c",
    "Baza nomi xato — <code>database \"carrental\" does not exist</code>: <b>pastki chiziq tushib qolgan</b>",
    "Baza nomida pastki chiziq tushib qolsa: database carrental does not exist. Baza bor, faqat nomi car pastki chiziq rental. PostgreSQL terminalidagi teskari chiziqcha l bilan aniq nomni ko'ring."
   ],
   [
    "d",
    "PostgreSQL o'chiq — xato matni bo'sh; <code>console.error(err)</code> — <b><code>ECONNREFUSED</code> ko'rinadi</b>",
    "Eng chalkashi: PostgreSQL ishlamasa, javob besh yuz, lekin error bo'sh, terminalda ham bo'sh qator. Sinab ko'rdik: console error'ga err message emas, err'ning o'zini bersak, ECONNREFUSED chiqadi, ya'ni ulanish rad etildi. Yechim: PostgreSQL'ni ishga tushiring."
   ],
   [
    "e",
    "Xulosa: «ishlayapti» — <b>faqat Express</b>; baza xatosini birinchi so'rov va terminal aytadi",
    "Xulosa: terminaldagi ishlayapti degan satr faqat Express haqida. Bazaga ulanish birinchi so'rovda tekshiriladi. Xabar bo'sh bo'lsa, console error'ga butun xatoni bering. PostgreSQL'ni ishga tushirish: Windows'da Services, Mac'da Postgres.app."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "5-bosqich · buzamiz",
  "title": "Ikkinchi node server.js ham «ishlayapti» deydi — javobni esa eski server beradi",
  "seg": [
   [
    "a",
    "Sinfdagi eng chalkash holat: «kodni tuzatdim, <b>hech narsa o'zgarmadi</b>»",
    "Sinfdagi eng chalkash holat: o'quvchi kodni tuzatadi, serverni yana ishga tushiradi, lekin javob o'zgarmaydi. Sabab ko'pincha bitta: birinchi server boshqa terminalda hali ishlab turibdi."
   ],
   [
    "b",
    "Sinab ko'rdik: ikkinchi server ham «ishlayapti» deb yozdi va <b>xato bermay chiqib ketdi</b>",
    "Sinab ko'rdik. Birinchi server ishlab turganda ikkinchi oynada node server js. Kutganimiz port band degan xato edi. Haqiqatda ikkinchi server ham ishlayapti deb yozdi va xato bermay chiqib ketdi. So'rovlarga birinchi, eski server javob beradi."
   ],
   [
    "c",
    "Sabab Express 5 da: xato <code>listen</code> callback'iga beriladi, namunadagi <b>callback uni o'qimaydi</b>",
    "Sabab Express beshinchi versiyasida: listen xatoni callback'ga beradi. Gemini yozgan callback esa xatoni o'qimaydi, faqat ishlayapti deb chiqaradi. Bu namuna kodidagi kamchilik, Express'niki emas, lekin sinfda aynan shunday ko'rinadi."
   ],
   [
    "d",
    "Xulosa: bitta loyiha — <b>bitta terminal</b>; qayta ishga tushirishdan oldin <code>Ctrl+C</code>",
    "Xulosa: sinfda qoida qo'ying, bitta loyiha uchun bitta terminal. Qayta ishga tushirishdan oldin Ctrl C bilan eski serverni to'xtating. O'quvchi «o'zgarmadi» desa, birinchi savol: boshqa terminalda server ochiq qolmadimi?"
   ]
  ]
 },
 "22": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4 — qaysi satr xato?",
  "title": "POST 500: column \"price\" of relation \"cars\" does not exist. Xato satrni toping",
  "q": "Buzishni ko'rdingiz, endi o'zingiz toping. To'rtinchi tekshiruv. Jadval ustunlarini eslang: id, model, daily price, year, is rented. Bu POST bo'lagida bitta satr jadvalda yo'q ustunni so'rayapti. O'sha satrni bosing.",
  "ok": "To'g'ri. To'rtinchi satrda insert'da price yozilgan, jadvalda esa daily price. Uchinchi satrdagi daily price faqat JavaScript o'zgaruvchisi, baza uni ko'rmaydi, u SQL matnidagi nomni ko'radi. Ekranda tuzatilgan holat: daily price, POST ikki yuz bir. Demak, besh yuz chiqsa, SQL matnidagi har nomni jadval ustunlari bilan solishtiring.",
  "okShort": "4-satr: SQL'da <code>price</code> — jadvalda <code>daily_price</code>. 3-satrdagi <code>daily_price</code> — JS o'zgaruvchisi, baza ko'rmaydi.",
  "hint": "Baza JavaScript o'zgaruvchilarini ko'rmaydi — faqat qo'shtirnoq ichidagi SQL matnini. O'sha matndagi ustun nomlarini qidiring.",
  "task": "Qoida: SQL'dagi ustun nomlari jadvaldagi bilan aynan bir xil bo'ladi — <code>cars</code>: <code>id, model, daily_price, year, is_rented</code>. Bu POST bo'lagida bitta satr jadvalda yo'q ustunni so'rayapti. <b>O'sha satrni bosing.</b>"
 },
 "23": {
  "type": "Practice",
  "kicker": "Amaliyot 4 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Ikki buzish, ikki tuzatish — o'z serveringizda",
  "seg": [
   [
    "a",
    "Endi siz: o'z serveringizda ikkita xatoni <b>ataylab chiqarasiz va tuzatasiz</b>",
    "Oxirgi amaliyot: o'z serveringizda ikkita xatoni ataylab chiqarasiz va tuzatasiz. O'n daqiqa. Sinfda xuddi shu xatolar chiqqanda, ularni birinchi marta ko'rayotgan bo'lmaysiz."
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
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, sinfda bu ikki xato chiqqanda siz ularni birinchi marta ko'rayotgan bo'lmaysiz va xabardan sababini darhol topasiz."
   ]
  ]
 },
 "24": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4-06 · «PostgreSQL so'rovlar — CRUD + AI bilan»",
  "title": "m4-06: o'quvchi do'konni tugmalar bilan boshqaradi, amaliyotda — haqiqiy PostgreSQL terminalida",
  "seg": [
   [
    "a",
    "m4-06 da o'quvchi do'konni tugmalar bilan boshqaradi — amaliyotda esa <b>haqiqiy PostgreSQL terminali</b>",
    "Endi o'quvchi darslarini ko'ramiz. Birinchisi m4-06, unda yigirma bir ekran bor. Ko'p qismida o'quvchi do'konni tugmalar bilan boshqaradi: insert, select, where, update, delete. Lekin amaliyotda u haqiqiy PostgreSQL terminali yoki VS Code'da AI bilan o'z do'koni jadvalini yaratadi. Demak bu darsda PostgreSQL har kompyuterda ishlab turishi shart."
   ],
   [
    "b",
    "CRUD bloki — siz bugun qo'lda qilgan ish; har <code>UPDATE</code>da <b>javobdagi sonni so'rang</b>",
    "CRUD bloki siz bugun qo'lda qilgan ishning o'zi. Qo'shimcha gapingiz: javobdagi son va begin, rollback. O'quvchi where'siz update'ni faqat ogohlantirishda ko'radi, siz uni proyektorda xavfsiz ko'rsating."
   ],
   [
    "c",
    "AI bloki: o'quvchi AI yozgan SQL'ni tekshiradi — sizning misollaringiz <code>product</code> va <b>noto'g'ri <code>HINT</code></b>",
    "AI bloki: o'quvchi AI yozgan SQL'ni tekshirishni o'rganadi, o'quvchi darsidagi misol product xatosi. Sizda yana bir misol bor: hint ham adashadi. Xulosa bitta: AI yozadi, o'quvchi tekshiradi."
   ],
   [
    "d",
    "Xulosa: amaliyot oldidan har kompyuterda <b>PostgreSQL terminali ochilishini</b> tekshiring; apostrof va <code>NOT NULL</code>ni ayting",
    "Xulosa: amaliyot oldidan har kompyuterda PostgreSQL terminali ochilishini tekshiring. O'quvchi o'z do'konini yaratayotganda ikki narsani ayting: so'z ichidagi apostrof ikki marta yoziladi, nom va narxga not null qo'yiladi. Vaqt, taklif: to'qson daqiqaning yigirma beshi amaliyotga."
   ]
  ]
 },
 "25": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4-08 · «Praktika: Backend CRUD — AvtoIjara»",
  "title": "m4-08: jadval qo'lda, server Gemini bilan — darsdagi to'rt farqni oldindan biling",
  "seg": [
   [
    "a",
    "m4-08 — <b>to'qqiz ekran</b>: jadvalni o'quvchi yozadi, serverni Gemini, Postman bilan sinaladi",
    "Ikkinchi dars m4-08, AvtoIjara, unda to'qqiz ekran bor. O'quvchi cars jadvalini PostgreSQL terminalida o'zi yozadi, server kodini Gemini'dan oladi, Postman bilan sinaydi va AI xatosini topadi. Siz bugun xuddi shuni qildingiz."
   ],
   [
    "b",
    "Farq 1: darsdagi xato matni qisqartirilgan; Farq 2: Gemini kodi <b>har kimda boshqacha</b>",
    "Darsdagi to'rt farqni oldindan biling. Birinchisi: xato matni darsda qisqaroq, haqiqiysida relation cars ham bor. Ikkinchisi: Gemini har o'quvchiga boshqacha kod yozadi. Topilmasa nima qaytishi, bitta yoki ikkita satr har xil bo'ladi. Promptdagi talablar bajarilganini tekshiring, satrma-satr bir xillikni emas."
   ],
   [
    "c",
    "Farq 3: <code>is_rented</code> — <code>null</code>; Farq 4: <b>port band bo'lsa ham «ishlayapti»</b>",
    "Uchinchisi: POST'dan keyin is rented null chiqadi, chunki u berilmaydi. To'rtinchisi: ikki terminalda ikki server ochilsa, xato chiqmaydi, eski server javob beradi. Ikkalasini ham o'quvchilarga oldindan ayting."
   ],
   [
    "d",
    "Xulosa: darsdan oldin — parol, Postman va <b>bitta terminal qoidasi</b>",
    "Xulosa: m4-08 dan oldin uch narsani tayyorlang. Sinf paroli hammaga ma'lum, Postman o'rnatilgan, va qoida: bitta loyiha, bitta terminal. Vaqt, taklif: to'qson daqiqaning qirqi server va Postman'ga, chunki eng ko'p qoqiladigan joy shu."
   ]
  ]
 },
 "26": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfda",
  "title": "Olti holat va tayyor javoblar",
  "seg": [
   [
    "a",
    "Sinfda albatta chiqadigan <b>olti holat</b> — hammasini bugun o'zingiz ko'rdingiz",
    "Ikki o'quvchi darsini bilasiz. Endi sinfda albatta chiqadigan oltita holatni ko'ramiz. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman."
   ],
   [
    "b",
    "Nom xatosi va apostrof — <code>\\d</code> bilan solishtiring, <b>apostrof ikki marta</b>",
    "Birinchi holat jadval yoki ustun nomidagi xato: xabar ichidagi nomni teskari chiziqcha d bilan solishtiring, hint'ga ishonmang. Ikkinchisi apostrof: u ikki marta yoziladi."
   ],
   [
    "c",
    "<code>WHERE</code>'siz va ulanish xatolari — <code>BEGIN</code>, parol va <b>bo'sh xabar</b>",
    "Uchinchisi where'siz update yoki delete: uning oldi begin bilan olinadi. To'rtinchisi parol yoki baza nomidagi xato: uni Pool sozlamalarida qidiring. Beshinchisi: xabar bo'sh bo'lsa, console error'ga butun xatoni bering va PostgreSQL'ni tekshiring."
   ],
   [
    "d",
    "Xulosa: o'zgarmasa — ikkinchi terminal; avval <b>xabarni o'quvchi bilan birga o'qing</b>",
    "Oltinchisi: o'quvchi «o'zgarmadi» desa, ikkinchi terminalda eski server qolganini tekshiring. Xulosa va usul bitta: javobni darhol aytmang, xabarni o'quvchi bilan birga o'qing. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "27": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "UPDATE products SET price = 99000; — WHERE yo'q. Javob?",
    "o": [
     "UPDATE 1",
     "ERROR",
     "UPDATE 3 — hamma qator",
     "UPDATE 0"
    ],
    "c": 2,
    "e": "WHERE'siz — jadvaldagi hamma qator.",
    "s": 8
   },
   {
    "q": "BEGIN; → DELETE FROM products; → ROLLBACK; → SELECT *. Natija?",
    "o": [
     "Hamma mahsulot joyida",
     "(0 rows)",
     "Faqat birinchi qator",
     "ERROR"
    ],
    "c": 0,
    "e": "ROLLBACK tranzaksiyani bekor qiladi.",
    "s": 8
   },
   {
    "q": "WHERE id = 99 — bunday qator yo'q. UPDATE javobi?",
    "o": [
     "ERROR: not found",
     "UPDATE 0",
     "UPDATE 1",
     "DELETE 0"
    ],
    "c": 1,
    "e": "Mos qator yo'q — 0, xato emas.",
    "s": 5
   },
   {
    "q": "VALUES ('O'yinchoq', 30000, 4) → syntax error. Tuzatish?",
    "o": [
     "\"O'yinchoq\"",
     "VARCHAR qilish",
     "Kirillda yozish",
     "'O''yinchoq'"
    ],
    "c": 3,
    "e": "So'z ichidagi apostrof ikki marta.",
    "s": 11
   },
   {
    "q": "Express'da bazaga SQL nima bilan yuboriladi?",
    "o": [
     "pool.query(sql, [qiymatlar])",
     "res.json",
     "app.listen",
     "console.log"
    ],
    "c": 0,
    "e": "Pool — server bazaga shu yo'l bilan ulanadi.",
    "s": 14
   },
   {
    "q": "Server «ishlayapti», GET ishlaydi, POST — Cannot destructure property 'model' of 'req.body'. Sabab?",
    "o": [
     "Parol xato",
     "app.use(express.json()) yo'q",
     "Jadval yo'q",
     "Port band"
    ],
    "c": 1,
    "e": "req.body o'qilmagan.",
    "s": 19
   },
   {
    "q": "POST 500, {\"error\":\"\"}, terminalda bo'sh qator. Birinchi qadam?",
    "o": [
     "Serverni o'chirish",
     "Gemini'dan yangi kod",
     "console.error(err) — butun xatoni ko'rish",
     "npm install"
    ],
    "c": 2,
    "e": "Bo'sh xabar — ECONNREFUSED yashiringan.",
    "s": 20
   },
   {
    "q": "O'quvchi: «Kodni tuzatdim, node server.js qildim — javob o'zgarmadi». Birinchi savolingiz?",
    "o": [
     "Gemini'dan qayta so'radingmi?",
     "Bazani o'chirdingmi?",
     "Postman yangilandimi?",
     "Boshqa terminalda server ochiq qolmadimi?"
    ],
    "c": 3,
    "e": "Express 5 da ikkinchi server ham «ishlayapti» deydi.",
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
