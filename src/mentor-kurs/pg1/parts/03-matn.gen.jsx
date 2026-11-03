
// ============================================================
//  PG-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/pg1-matn.py (manba: 06-PostgreSQL1-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · PostgreSQL",
  "title": "Siz Mongo'ni bilasiz. Bugun o'sha blog PostgreSQL'da.",
  "seg": [
   [
    "a",
    "Siz Mongo'da blog yozgansiz — bugun <b>xuddi shu blogni PostgreSQL'da</b> quramiz",
    "Assalomu alaykum. Siz MongoDB bilan, Mongoose orqali ishlagansiz: modellar, ref, populate. AI Startup kursidagi o'quvchilar PostgreSQL bilan ishlaydi. Bugun siz bilgan narsadan boshlaymiz: Mongo'dagi oddiy blogni olamiz va uni PostgreSQL'da qaytadan quramiz."
   ],
   [
    "b",
    "Dars oxirida PostgreSQL sizda ishlaydi, <b>ikki jadval va JOIN</b> o'z qo'lingizda",
    "Dars oxirida PostgreSQL kompyuteringizda o'rnatilgan bo'ladi. Ikki bog'langan jadvalni o'zingiz yaratasiz, baza qaytargan xatolarni o'qiysiz va JOIN bilan ikki jadvalni bitta javobda ko'rasiz."
   ],
   [
    "c",
    "O'quvchi darsidagi «oxirgi telefon»ni ikki oynada <b>o'z ko'zingiz bilan</b> ko'rasiz",
    "O'quvchi darsida bitta telefonni ikki kishi bir vaqtda sotib olmoqchi bo'ladigan misol bor. Uni gap bilan emas, ikkita terminal oynasida o'zingiz sinab ko'rasiz va nima uni saqlab qolishini aniq bilasiz."
   ],
   [
    "d",
    "Sinf kompyuterlariga PostgreSQL'ni <b>siz o'rnatasiz</b> — o'quvchi darsida bu qism yo'q",
    "Yana bir muhim narsa: o'quvchi darslarida PostgreSQL'ni o'rnatish o'rgatilmaydi. Sinf kompyuterlariga uni siz o'rnatasiz, keyingi darslar shunga tayanadi. Buni ham, o'quvchi darsini qanday o'tishni ham oxirgi bosqichda ko'ramiz."
   ],
   [
    "e",
    "Olti bosqich, to'rt amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Dars olti bosqichdan iborat, orasida to'rtta amaliyot bor, ularni o'z kompyuteringizda qilasiz. Shoshilmang: har ekranni boshidan eshitish va matnini o'qish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · Mongo bilan solishtirish",
  "title": "SQL va NoSQL: bitta ma'lumot ikki xil shaklda saqlanadi",
  "seg": [
   [
    "a",
    "Bazalar ikki katta oilaga bo'linadi: SQL va NoSQL — <b>farqi ma'lumot shaklida</b>",
    "Mongo'ni PostgreSQL bilan solishtirishdan oldin bitta asosiy farqni aniq ko'rib olamiz. Bazalar ikki katta oilaga bo'linadi: SQL va NoSQL. MongoDB NoSQL bazasi, PostgreSQL esa SQL bazasi. Ularning asosiy farqi ma'lumot qanday shaklda saqlanishida."
   ],
   [
    "b",
    "MongoDB'da har yozuv — <b>jingalak qavs ichidagi hujjat</b>, hujjatlar <code>collection</code>ga yig'iladi",
    "Chapda MongoDB. Bu yerda har bir yozuv hujjat, inglizchasi document: jingalak qavs ichida maydon va qiymat, masalan username, ali. Hujjatlar collection'ga yig'iladi. Qarang: vali'ning hujjatida shahar degan qo'shimcha maydon bor, ali'nikida yo'q. Mongo buni qabul qiladi: hujjatlar har xil shaklda bo'lishi mumkin."
   ],
   [
    "c",
    "PostgreSQL'da ma'lumot jadvalda: <b>tepada ustunlar, har yozuv bitta qator</b>",
    "O'ngda o'sha ma'lumot PostgreSQL'da. Bu yerda ma'lumot jadvalda, inglizchasi table. Tepada ustunlar, ya'ni column: id va username. Har bir yozuv bitta qator, ya'ni row: bir, ali. Har qatorda ustunlar bir xil. Shaharni yozib ko'rdik: jadvalda bunday ustun yo'q, shuning uchun PostgreSQL xato berdi."
   ],
   [
    "d",
    "SQL — <b>jadvalga so'rov yozish tili</b>; NoSQL — «SQL emas», hujjat bilan ishlaydi",
    "Endi nomlarning ma'nosi. SQL bu jadvalga so'rov yozish tili: select, insert, update. Ekranda shunday so'rov: ikkinchi foydalanuvchining username'ini so'radik, javob vali. PostgreSQL shu tilda ishlagani uchun SQL bazasi deyiladi. NoSQL esa «SQL emas» degani: MongoDB jadval o'rniga hujjat bilan ishlaydi."
   ],
   [
    "e",
    "Xulosa: Mongo — <code>collection</code> va hujjat, PostgreSQL — <b>jadval, ustun va qator</b>",
    "Xulosa: MongoDB'da ma'lumot hujjat ko'rinishida turadi va hujjatlar collection'ga yig'iladi. PostgreSQL'da ma'lumot jadvalda: ustunlar va qatorlar. Demak, Mongo'dagi bitta hujjat PostgreSQL'dagi bitta qatorga, hujjatdagi maydon esa ustunga to'g'ri keladi. Darsning qolgan hammasi shu farqdan kelib chiqadi."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · Mongo bilan solishtirish",
  "title": "Mongo'dagi blog: ikki model, bitta ref, bitta populate",
  "seg": [
   [
    "a",
    "Boshlanish nuqtasi — <b>siz bilgan Mongo</b>: ikki model, foydalanuvchi va uning posti",
    "Shakldagi farqni ko'rdik, endi uni tanish koddan boshlab ochamiz. Ekranda Mongoose'dagi oddiy blog: ikkita model. User'da faqat username, Post'da muallif va izoh. Bu kodni haqiqiy MongoDB'da yurgizib ko'rdik."
   ],
   [
    "b",
    "Post'dagi <code>author</code> — ObjectId va <b><code>ref: 'User'</code></b>: post shu foydalanuvchiga bog'langan",
    "Post modelidagi author maydoniga qarang: turi ObjectId, yonida ref, User. Ya'ni postda foydalanuvchining o'zi emas, faqat uning id'si saqlanadi, ref esa bu id qaysi modelga tegishli ekanini aytadi."
   ],
   [
    "c",
    "<code>populate('author')</code> id o'rniga <b>butun foydalanuvchi hujjatini</b> javobga qo'yib beradi",
    "populate so'rov paytida shu id bo'yicha foydalanuvchini topadi va javobga qo'yib beradi. Terminalga qarang: author ichida endi id emas, butun hujjat, username ali."
   ],
   [
    "d",
    "Xulosa: <code>ref</code> — bog'lanish, <code>populate</code> — birlashtirish; PostgreSQL'da <b>ikkalasi ham bor</b>",
    "Xulosa: Mongo'da bog'lanish ikki qismdan iborat. ref ikki modelni bog'laydi, populate ularni bitta javobda birlashtiradi. PostgreSQL'da ham xuddi shu ikki qism bor, faqat nomlari boshqa. Lekin avval Mongo xato bermay o'tkazib yuboradigan ikki holatni ko'raylik."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "1-bosqich · Mongo bilan solishtirish",
  "title": "Mongo ikki holatda xato bermaydi: yo'q muallif va har xil hujjat",
  "seg": [
   [
    "a",
    "Mongo'da tartibni kim saqlaydi? <b>Ikki tajriba</b> bilan tekshirib ko'ramiz",
    "Mongo'da bog'lanish bor ekan. Endi savol: bu bog'lanishni kim qo'riqlaydi? Ikkita tajriba qildik. Ikkalasida ham MongoDB xato bermadi, va aynan shu xato bermaslik PostgreSQL bilan asosiy farq."
   ],
   [
    "b",
    "Mavjud bo'lmagan muallifga post saqlandi, <code>populate</code> esa <b><code>author: null</code></b> qaytardi",
    "Birinchi tajriba: postni bazada yo'q foydalanuvchining id'si bilan yaratdik. Mongo uni saqladi, xato yo'q. populate qilganda esa author null bo'lib chiqdi. Ya'ni muallifi yo'q post bazada turibdi va bu haqda hech qanday xato chiqmadi."
   ],
   [
    "c",
    "Sxemani chetlab yozilgan hujjat <b>boshqa maydonlar bilan</b> o'sha kolleksiyaga tushdi",
    "Ikkinchi tajriba: Mongoose sxemasini chetlab, kolleksiyaning o'ziga boshqa maydonli hujjat yozdik: muallif, matn va like. Bu boshqa skript yoki boshqa xizmat yozganday holat. Kolleksiya uni ham qabul qildi: endi bitta posts ichida har xil shakldagi hujjatlar."
   ],
   [
    "d",
    "Xulosa: Mongo'da tartibni Mongoose kodi saqlaydi, PostgreSQL'da — <b>bazaning o'zi</b>",
    "Xulosa: oddiy holatda, alohida tekshiruv yozilmagan bo'lsa, Mongo'da tartibni sizning kodingiz, Mongoose sxemasi saqlaydi. Kodni chetlab o'tgan yozuvni baza qabul qiladi. PostgreSQL'da qoida jadvalning o'zida yoziladi va uni hech kim chetlab o'ta olmaydi. Buni uchinchi bosqichda sinab ko'ramiz."
   ]
  ]
 },
 "5": {
  "type": "Lesson",
  "kicker": "1-bosqich · Mongo bilan solishtirish",
  "title": "Siz bilgan har so'zning PostgreSQL'dagi jufti",
  "seg": [
   [
    "a",
    "Har Mongo tushunchasining PostgreSQL'da <b>jufti bor</b> — lug'atni bir marta ko'rib olamiz",
    "Mongo qayerda xato bermasligini ko'rdik. Endi lug'at: siz bilgan har so'zning PostgreSQL'dagi jufti. Bu lug'at sinfda ham kerak bo'ladi, chunki o'quvchi darsi ham jadval va hujjatni solishtiradi."
   ],
   [
    "b",
    "Collection — jadval, document — qator, maydon esa <b>turi aniq ustun</b>",
    "Collection jadval bo'ladi, document jadvaldagi bitta qator. Maydon ustun bo'ladi, lekin bitta farq bor: ustunning turi oldindan yoziladi, son yoki matn. Jadvaldagi har qatorda ustunlar bir xil."
   ],
   [
    "c",
    "<code>_id</code> o'rnida o'zi o'sadigan raqam, <code>ref</code> — <b>tashqi kalit</b>, <code>populate</code> — <b><code>JOIN</code></b>",
    "Mongo'dagi id o'rnida PostgreSQL'da odatda o'zi o'sadigan raqam: bir, ikki, uch. ref'ning jufti tashqi kalit, inglizchasi foreign key: posts jadvalidagi user id ustuni users jadvaliga ishora qiladi. populate'ning jufti esa JOIN."
   ],
   [
    "d",
    "Mongoose sxemasi kodda turadi, <code>CREATE TABLE</code> esa jadval qoidasini <b>bazaning o'ziga</b> yozadi",
    "Eng katta farq shu qatorda. Mongoose sxemasi sizning kodingizda turadi. CREATE TABLE esa jadvalni va uning qoidalarini bazaning o'ziga yozadi: bo'sh bo'lmasin, takrorlanmasin, muallif mavjud bo'lsin. mongosh o'rnida esa PostgreSQL terminali, uning dastur nomi psql."
   ],
   [
    "e",
    "Xulosa: tushunchalar deyarli bir xil — farq <b>qoidalar qayerda turishida</b>",
    "Xulosa: tushunchalarning ko'pi sizga tanish, faqat nomi boshqa. Asosiy farq qoidalar qayerda turishida: Mongo'da kodda, PostgreSQL'da jadvalda. O'quvchi «Mongo'dagi populate qani?» desa, javob: JOIN. Tekshirib olaylik."
   ]
  ]
 },
 "6": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Mongo'da ref ham, populate ham bor edi. PostgreSQL'da populate o'rnida qaysi biri?",
  "q": "Lug'atni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Mongo'da ikki narsa bor edi: ref bog'laydi, populate esa so'rov paytida birlashtiradi. PostgreSQL'da populate'ning ishini qaysi biri qiladi? Variantni tanlang.",
  "ok": "To'g'ri, JOIN. U so'rov paytida ikki jadvalni ulaydi va bitta javob beradi, populate kabi. REFERENCES esa ref'ning jufti: u faqat bog'lanishni belgilaydi va qo'riqlaydi, javobga hech narsa qo'shmaydi. Demak, PostgreSQL'da bog'lanishni REFERENCES belgilaydi, ikki jadvalni bitta javobga esa JOIN birlashtiradi.",
  "okShort": "<code>JOIN</code> — so'rov paytida ulaydi (populate). <code>REFERENCES</code> — bog'lanishni belgilaydi va qo'riqlaydi (ref).",
  "hint": "So'rov paytida ishlaydigan va ikki jadvalni bitta javobga yig'adigan buyruqni qidiring.",
  "correct": 2,
  "opts": [
   "REFERENCES users(id)",
   "SERIAL PRIMARY KEY",
   "JOIN … ON …",
   "CREATE TABLE"
  ],
  "wrong": {
   "0": "Bu refning jufti: bog'lanishni belgilaydi, lekin so'rov natijasini birlashtirmaydi.",
   "1": "Bu _idning jufti: qatorning raqami.",
   "3": "Bu Schemaning jufti: jadval va uning qoidalarini yaratadi."
  }
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · o'rnatish",
  "title": "Windows: postgresql.org → o'rnatuvchi → parol, port, PATH",
  "seg": [
   [
    "a",
    "Mongo bilan solishtirdik — endi o'rnatamiz; Windows yo'li <b>rasmiy saytdan</b> boshlanadi",
    "Tushunchalar tayyor, endi PostgreSQL'ni o'rnatamiz. Avval Windows, keyingi ekranda macOS. Sizda qaysi bo'lishidan qat'i nazar ikkalasini ham ko'ring: sinf kompyuterlari boshqacha bo'lishi mumkin. Windows'da postgresql org saytidagi download sahifasidan rasmiy o'rnatuvchi olinadi, eng yangi barqaror versiyasi o'n sakkiz."
   ],
   [
    "b",
    "Komponentlar: Server, pgAdmin va <b>Command Line Tools kerak</b>, Stack Builder kerak emas",
    "Komponentlar oynasida to'rtta band bor. Server, ya'ni bazaning o'zi. pgAdmin, grafik oyna, ixtiyoriy. Command Line Tools: PostgreSQL terminali shu yerda, u albatta kerak. Stack Builder qo'shimcha dasturlar uchun, bizga kerak emas."
   ],
   [
    "c",
    "<b>Parolni yozib qo'ying</b>: o'quvchi keyingi darslarda aynan shu parolni so'raydi",
    "Keyin parol: bu postgres foydalanuvchisining paroli. Uni albatta yozib qo'ying, o'quvchi keyingi darslarda PostgreSQL terminalini ochganda va loyiha sozlamasida aynan shu parolni so'raydi. Port besh ming to'rt yuz o'ttiz ikki, o'zgartirmang. Qolgan oynalarni o'zgartirmasdan o'tkazing."
   ],
   [
    "d",
    "O'rnatuvchi <b>PATH'ga qo'shmaydi</b>: <code>bin</code> papkasini qo'lda qo'shing yoki SQL Shell'ni oching",
    "Muhim joy: o'rnatuvchi psql buyrug'ini PATH'ga qo'shmaydi. Shuning uchun terminalda psql yozilsa, Windows uni tanimaydi. Ikki yo'l bor: PostgreSQL'ning bin papkasini Path'ga qo'shib, terminalni yangidan ochish, yoki Start menyusidan SQL Shell, ya'ni PostgreSQL terminalini ochish."
   ],
   [
    "e",
    "Xulosa: Windows'da <b>uch narsani tekshiring</b> — parol yozilgan, port 5432, PATH'da <code>bin</code>",
    "Xulosa: Windows'da o'rnatgandan keyin uch narsani tekshiring. Parol yozib qo'yilgan, port besh ming to'rt yuz o'ttiz ikki, va bin papkasi Path'da. Sinfda eng ko'p uchraydigan muammo uchinchisi bo'ladi: psql buyrug'i tanilmaydi."
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "2-bosqich · o'rnatish",
  "title": "macOS: Postgres.app — Initialize, PATH va parolsiz postgres",
  "seg": [
   [
    "a",
    "Mac'da eng sodda yo'l — <b>Postgres.app</b>: dastur, server va <code>psql</code> bitta faylda",
    "Windows'ni ko'rdik, endi macOS. Mac uchun eng sodda yo'l Postgres.app. Bu bitta dastur: ichida server ham, PostgreSQL terminali ham bor. postgresapp com saytidan yuklab olinadi va Applications papkasiga ko'chiriladi."
   ],
   [
    "b",
    "Dasturni ochib <b>Initialize</b> bosiladi — server ishga tushadi, port yana 5432",
    "Dasturni ochib, Initialize tugmasini bosasiz. Server ishga tushadi, port yana besh ming to'rt yuz o'ttiz ikki. Parol so'ralmaydi: o'z kompyuteringizdan parolsiz ulanasiz. Postgres.app postgres foydalanuvchisini ham o'zi yaratadi."
   ],
   [
    "c",
    "Terminal <code>psql</code>ni topishi uchun <b>bitta PATH buyrug'i</b>, keyin terminalni yangidan oching",
    "Terminal psql buyrug'ini topishi uchun rasmiy saytda bitta buyruq bor, u Postgres.app papkasini PATH'ga qo'shadi. Uni bir marta yurgizasiz, kompyuter parolingizni so'raydi. Keyin terminalni yopib, yangidan oching."
   ],
   [
    "d",
    "Homebrew bilan o'rnatilsa <b><code>postgres</code> roli yo'q</b> — <code>createuser -s postgres</code> bilan tuzatiladi",
    "Ehtiyot bo'ling: ba'zi mentorlar Homebrew bilan o'rnatadi. U holda server bazaga sizning Mac foydalanuvchi nomingiz bilan kiradi, postgres degan foydalanuvchi bo'lmaydi. Sinab ko'rdik: psql minus U postgres xato beradi. Tuzatish bitta buyruq: createuser minus s postgres. Shundan keyin ulanish ishlaydi."
   ],
   [
    "e",
    "Xulosa: Mac'da Postgres.app; Homebrew bo'lsa — avval <b><code>postgres</code> foydalanuvchisini yarating</b>",
    "Xulosa: Mac'da Postgres.app'ni o'rnating, Initialize bosing va PATH buyrug'ini yurgizing. Homebrew bilan o'rnatilgan bo'lsa, createuser minus s postgres yozing. O'quvchi darslari psql minus U postgres buyrug'ini kutadi, shuning uchun bu foydalanuvchi har kompyuterda bo'lishi shart."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "2-bosqich · ulanish",
  "title": "psql -U postgres: parol, prompt, birinchi so'rov",
  "seg": [
   [
    "a",
    "O'rnatildi — endi ulanamiz: <code>psql</code> siz bilgan <b><code>mongosh</code> kabi</b> buyruq oynasi",
    "PostgreSQL o'rnatildi, endi unga ulanamiz. PostgreSQL terminali, dastur nomi psql, mongosh kabi: terminalda bazaga buyruq yozasiz, javob shu yerda chiqadi. Buyruq: psql minus U postgres, ya'ni postgres foydalanuvchisi nomidan."
   ],
   [
    "b",
    "Windows parol so'raydi; yozayotganda ekranda <b>belgi chiqmaydi</b> — bu normal",
    "Windows'da parol so'raladi, o'rnatishda yozgan parolingiz. Diqqat: yozayotganingizda ekranda hech qanday belgi chiqmaydi, yulduzcha ham. Bu normal, yozib Enter bosing. Mac'da Postgres.app bilan parol so'ralmaydi. Kirgach prompt chiqadi: postgres, panjara. Bu siz hozir postgres bazasidasiz degani."
   ],
   [
    "c",
    "Har buyruq <b>nuqta-vergul bilan</b> tugaydi; unutilsa prompt <code>postgres-#</code> bo'lib kutadi",
    "Birinchi so'rov: select version. Har SQL buyrug'i nuqta-vergul bilan tugaydi. Unutsangiz, PostgreSQL terminali xato bermaydi, prompt'dagi panjara oldida tire paydo bo'ladi va davomini kutadi. Shunchaki nuqta-vergul yozib Enter bosing. Sinfda bu eng ko'p beriladigan savol."
   ],
   [
    "d",
    "<code>\\l</code> — <b>bazalar ro'yxati</b>: <code>postgres</code> va ikki shablon; <code>\\q</code> — PostgreSQL terminalidan chiqish",
    "Teskari chiziqcha bilan boshlanadigan buyruqlar PostgreSQL terminalining o'zi uchun, ularga nuqta-vergul kerak emas. Teskari chiziqcha l bazalar ro'yxatini ko'rsatadi: postgres va ikkita template, ya'ni shablon. Shablonlarga tegmaysiz. Teskari chiziqcha q PostgreSQL terminalidan chiqaradi."
   ],
   [
    "e",
    "Xulosa: prompt <b>qaysi bazada turganingizni</b> aytadi; SQL — nuqta-vergul bilan, <code>\\</code> buyruqlari — usiz",
    "Xulosa: prompt'ga doim qarang, u qaysi bazada turganingizni aytadi. SQL buyrug'i nuqta-vergul bilan tugaydi, teskari chiziqchali buyruqlar esa usiz. Endi o'zingiz o'rnatib, ulanib ko'ring."
   ]
  ]
 },
 "10": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 4",
  "eyebrow": "Hozir o'zingizda · 15–20 daqiqa",
  "title": "PostgreSQL'ni o'rnating va psql bilan ulaning",
  "seg": [
   [
    "a",
    "Endi siz: PostgreSQL'ni <b>o'z kompyuteringizga</b> o'rnatib, birinchi so'rovni yurgizasiz",
    "Endi navbat sizga: PostgreSQL'ni o'z kompyuteringizga o'rnatasiz. To'rt qadam, o'n besh-yigirma daqiqa. Windows bo'lsa yettinchi ekrandagi yo'l, Mac bo'lsa sakkizinchi ekrandagi yo'l."
   ],
   [
    "b",
    "1–2-qadam: o'rnatish va PATH; <b>parolni yozib qo'ymasdan</b> oldinga o'tmang",
    "Birinchi: o'rnatish. Windows'da parolni albatta yozib qo'ying. Ikkinchi: PATH. Windows'da bin papkasini Path'ga qo'shing, Mac'da rasmiy buyruqni yurgizing, keyin terminalni yangidan oching."
   ],
   [
    "c",
    "3–4-qadam: <code>psql -U postgres</code>, <code>SELECT version();</code>; isbot — <b>natija qatorining boshi</b>",
    "Uchinchi: psql minus U postgres bilan ulaning. To'rtinchi: select version so'rovini yurgizing va teskari chiziqcha l bilan bazalarni ko'ring. Isbot maydoniga version natijasini nusxalang, PostgreSQL so'zidan boshlab."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Biror narsa boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing: yechimlar oynasi ochiladi, sinf kompyuterlarida ham aynan shu holatlar chiqadi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin PostgreSQL kompyuteringizda o'rnatilgan va siz unga terminaldan ulana olasiz."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · jadval va bog'lanish",
  "title": "CREATE DATABASE blog → \\c blog → users jadvali",
  "seg": [
   [
    "a",
    "Ulandik — endi o'quvchi amaliyotidagi namuna: <code>users</code> va <code>posts</code>, <b>ikki bog'langan jadval</b>",
    "PostgreSQL terminali ishlayapti. Endi Mongo'dagi blogni PostgreSQL'da quramiz. Namuna tasodifiy emas: o'quvchi m4-03 amaliyotida qog'ozda aynan shu ikki jadvalni yozadi, users va posts. Siz ularni haqiqiy bazada yaratasiz."
   ],
   [
    "b",
    "Mongo'da baza o'zi paydo bo'lardi, bu yerda avval <b><code>CREATE DATABASE</code></b>, keyin <code>\\c</code>",
    "Mongo'da baza birinchi yozuvda o'zi paydo bo'lardi. PostgreSQL'da uni avval yaratasiz: create database blog. Keyin teskari chiziqcha c blog bilan unga o'tasiz. Prompt'ga qarang: endi postgres emas, blog."
   ],
   [
    "c",
    "<code>users</code>: <code>id</code> <b>o'zi o'sadi</b> va takrorlanmaydi, <code>username</code> <b>bo'sh bo'lmaydi</b> va takrorlanmaydi",
    "Birinchi jadval users. id ustuni serial primary key: raqam o'zi o'sadi va hech qachon takrorlanmaydi. username matn, yonida ikki qoida: not null, ya'ni bo'sh bo'lmaydi, va unique, ya'ni ikki foydalanuvchida bir xil nom bo'lmaydi."
   ],
   [
    "d",
    "Yozishda ikki xato tez-tez chiqadi: <b>jadval allaqachon bor</b> va <b>tushib qolgan vergul</b>",
    "Qo'lda yozganda ikki xato tez-tez chiqadi. Jadval allaqachon bor bo'lsa, already exists: demak siz uni oldin yaratgansiz. Vergul tushib qolsa, syntax error, va PostgreSQL terminali strelka bilan qaysi so'z oldida xato borligini ko'rsatadi. Vergulni qo'yib, buyruqni qayta yurgizasiz."
   ],
   [
    "e",
    "Xulosa: baza avval yaratiladi; <code>syntax error</code> bo'lsa — <b>strelka ko'rsatgan so'zdan oldin</b> qarang",
    "Xulosa: PostgreSQL'da baza oldin yaratiladi va unga teskari chiziqcha c bilan o'tiladi. Ustunning turi va qoidalari jadval bilan birga yoziladi. Syntax error chiqsa, strelka ko'rsatgan so'zdan oldingi joyni tekshiring, odatda u yerda vergul yo'q."
   ]
  ]
 },
 "12": {
  "type": "Lesson",
  "kicker": "3-bosqich · jadval va bog'lanish",
  "title": "REFERENCES users(id) — Mongo'dagi ref, lekin bazaning o'zida",
  "seg": [
   [
    "a",
    "<code>users</code> jadvali tayyor. Endi ikkinchi jadval — <code>posts</code>: har post <code>user_id</code> orqali <b>muallifiga bog'lanadi</b>",
    "users jadvali tayyor. Endi ikkinchi jadvalni yaratamiz: postlar saqlanadigan posts jadvali. Har postda muallifning id'si saqlanadi, xuddi Mongo'dagi author kabi. Farqi user id qatorining oxirida: references users id. Bu tashqi kalit: user id ustunida faqat users jadvalida bor id turishi mumkin."
   ],
   [
    "b",
    "<code>\\d posts</code> — jadval tuzilishi; pastda baza o'zi nom bergan <b>tashqi kalit qatori</b>",
    "Teskari chiziqcha dt jadvallar ro'yxatini, teskari chiziqcha d posts esa jadval tuzilishini ko'rsatadi: ustunlar, turlari, bo'sh bo'la oladimi. Eng pastda Foreign-key constraints qatori. Nomini baza o'zi berdi: jadval, ustun va fkey. Bu nomni keyin xato xabarida ko'rasiz."
   ],
   [
    "c",
    "Uch foydalanuvchi va uch post qo'shildi: <code>INSERT 0 3</code> — oxirgi raqam <b>qatorlar soni</b>",
    "Endi ma'lumot. Uch foydalanuvchi: ali, vali va sardor. Uch post: ikkitasi ali'niki, bittasi vali'niki. sardor'ning posti yo'q, bu to'rtinchi bosqichda kerak bo'ladi. Javobdagi insert, nol, uch: oxirgi raqam qo'shilgan qatorlar soni."
   ],
   [
    "d",
    "Boshqa bazada tursangiz jadval «yo'q» bo'ladi: prompt'ga qarang va <b><code>\\c blog</code></b> qiling",
    "Sinfda eng ko'p chiqadigan xatolardan biri. O'quvchi PostgreSQL terminalini qayta ochadi va darhol select qiladi: relation posts does not exist. Jadval bor, faqat u postgres bazasida turibdi. Prompt'ga qarang: postgres. Teskari chiziqcha c blog qilinsa, o'sha so'rov uchala postni ko'rsatadi."
   ],
   [
    "e",
    "Xulosa: tashqi kalit bog'lanishni <b>bazaga yozadi</b>; <code>does not exist</code> bo'lsa — avval prompt",
    "Xulosa: references bog'lanishni bazaning o'ziga yozadi, Mongo'dagi ref'dan farqi shu. Teskari chiziqcha d bilan istalgan jadval tuzilishini ko'rasiz. Relation does not exist chiqsa, jadvalni qayta yaratishga shoshilmang: avval prompt'dagi baza nomini tekshiring."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "3-bosqich · jadval va bog'lanish",
  "title": "Mongo xato bermagan joyda PostgreSQL ERROR beradi",
  "seg": [
   [
    "a",
    "Mongo'dagi ikki tajribani PostgreSQL'da takrorlaymiz — xabarni <b>uch savol bilan</b> o'qiymiz",
    "To'rtinchi ekranda Mongo yo'q muallifga postni xato bermay saqlagan edi. Endi o'sha tajribalarni PostgreSQL'da qilamiz. Har xato xabarini uch savol bilan o'qiymiz: qaysi jadval, qaysi qoida va qaysi qiymat. To'rtta xato bor, hammasini haqiqiy bazada oldik."
   ],
   [
    "b",
    "Bo'sh <code>username</code> va takrorlangan <code>ali</code>: <b><code>NOT NULL</code></b> va <b><code>UNIQUE</code></b> rad etdi",
    "Birinchi ikkitasi oddiy. Bo'sh username: users jadvali, not null qoidasi, yozuv saqlanmadi. Yana ali: unique qoidasi, detail qatorida aniq qiymat, ali allaqachon bor. Mongo'da bu qoidalar Mongoose sxemasida edi, bu yerda jadvalning o'zida."
   ],
   [
    "c",
    "Yo'q muallifga post: Mongo saqlagan edi, PostgreSQL <b>tashqi kalit bilan rad etdi</b>",
    "Endi asosiysi: to'qson to'qqizinchi foydalanuvchiga post. Mongo buni xato bermay saqlagan edi. PostgreSQL rad etdi. O'qiymiz: jadval posts, qoida posts user id fkey, ya'ni tashqi kalit, qiymat esa detail qatorida: user id to'qson to'qqiz users jadvalida yo'q."
   ],
   [
    "d",
    "Teskari tomoni ham qo'riqlanadi: <b>posti bor foydalanuvchini</b> o'chirib bo'lmaydi",
    "Tashqi kalit teskari tomondan ham ishlaydi. ali'ni o'chirib ko'rdik: rad etildi, chunki uning postlari bor. Detail qatori aytadi: id bir hali ham posts jadvalidan ishora qilinmoqda. Ya'ni bazada egasiz post qolmaydi."
   ],
   [
    "e",
    "Xulosa: xabarda jadval, qoida nomi va <b><code>DETAIL</code>dagi qiymat</b> — sababi shu uchtasida",
    "Xulosa: PostgreSQL'da qoida buzilsa, yozuv saqlanmaydi va xabar sababni o'zi aytadi. O'quvchi xato ko'rsatsa, uchta savol bilan birga o'qing: qaysi jadval, qoida nomi va detail qatoridagi qiymat. Javob deyarli doim detail qatorida."
   ]
  ]
 },
 "14": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "O'quvchi DELETE FROM users WHERE id = 1; yozdi va shu xabarni oldi. Nega?",
  "q": "Xatolarni o'qishni ko'rdingiz, endi o'zingiz o'qing. Ikkinchi tekshiruv. O'quvchi birinchi foydalanuvchini o'chirmoqchi bo'ldi va ekrandagi xabarni oldi. Uch savolni eslang: qaysi jadval, qaysi qoida, qaysi qiymat. Nega o'chmadi? Variantni tanlang.",
  "ok": "To'g'ri. Qoida posts user id fkey, tashqi kalit. Detail qatori aytadi: id bir hali ham posts jadvalidan ishora qilinmoqda, ya'ni bu foydalanuvchining postlari bor. Baza egasiz post qoldirmaydi. Demak, foydalanuvchini o'chirish kerak bo'lsa, avval uning postlari, keyin uning o'zi o'chiriladi.",
  "okShort": "<code>posts_user_id_fkey</code>: <code>Key (id)=(1)</code> hali <code>posts</code>da bor — avval postlar, keyin foydalanuvchi.",
  "hint": "Xabardagi qoida nomini va DETAIL qatorini o'qing: qaysi jadval hali bu foydalanuvchiga ishora qilyapti?",
  "correct": 0,
  "opts": [
   "Bu foydalanuvchining postlari bor — posts unga ishora qiladi",
   "users jadvali blog bazasida yo'q",
   "id = 1 bo'lgan foydalanuvchi topilmadi",
   "DELETE uchun boshqa foydalanuvchining paroli kerak"
  ],
  "wrong": {
   "1": "Jadval yo'q bo'lsa xabar relation \"users\" does not exist bo'lardi.",
   "2": "Topilmasa xato bo'lmaydi: DELETE 0. Bu yerda baza qoida nomini aytyapti.",
   "3": "Xabarda parol haqida hech narsa yo'q. Qoida nomini o'qing."
  }
 },
 "15": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 4",
  "eyebrow": "Hozir o'zingizda · 10–15 daqiqa",
  "title": "blog bazasi: users, posts va tashqi kalit",
  "seg": [
   [
    "a",
    "Endi siz: <code>blog</code> bazasini va ikki bog'langan jadvalni <b>o'zingiz yaratasiz</b>",
    "Endi o'zingiz qilasiz: blog bazasi, users va posts jadvallari, keyin ma'lumot. Besh qadam, o'n-o'n besh daqiqa. Buyruqlarni nusxalash mumkin, lekin har birini o'qib, nima qilishini aytib ko'ring."
   ],
   [
    "b",
    "1–4-qadam: baza, ikki jadval va ma'lumot; har buyruqdan keyin <b>javob satrini tekshiring</b>",
    "Birinchi: baza va teskari chiziqcha c. Ikkinchi va uchinchi: users, keyin posts. Tartib muhim: posts users'ga ishora qiladi, shuning uchun users birinchi. To'rtinchi: uch foydalanuvchi va uch post."
   ],
   [
    "c",
    "5-qadam: tashqi kalit xatosini <b>o'zingiz chiqaring</b>; isbot — <code>\\d posts</code>dagi kalit qatori",
    "Beshinchi: to'qson to'qqizinchi foydalanuvchiga post yozib, tashqi kalit xatosini o'zingiz chiqaring va detail qatorini o'qing. Isbot maydoniga teskari chiziqcha d posts natijasidagi Foreign-key qatorini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Beshala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizda ikki bog'langan jadval bor va baza noto'g'ri yozuvni o'zi rad etishini o'z ko'zingiz bilan ko'rasiz."
   ]
  ]
 },
 "16": {
  "type": "Lesson",
  "kicker": "4-bosqich · JOIN",
  "title": "JOIN … ON users.id = posts.user_id — PostgreSQL'dagi populate",
  "seg": [
   [
    "a",
    "Ikki jadval bog'langan — endi «har post muallifi bilan» <b>bitta javobda</b> kerak",
    "Ikki jadval bor va ular bog'langan. Endi Mongo'dagi populate kabi natija kerak: har post yonida muallifning nomi. PostgreSQL'da buni bitta so'rov qiladi, JOIN."
   ],
   [
    "b",
    "<code>FROM posts</code> — asosiy jadval, <code>JOIN users</code> — qo'shiladigan, <b><code>ON</code></b> — qaysi ustun qaysiga teng",
    "So'rovni bo'lakma-bo'lak o'qiymiz. Select qaysi ustunlar kerakligini aytadi: muallif nomi va izoh. From posts, asosiy jadval. Join users, unga qo'shiladigan jadval. On satri esa eng muhimi: users jadvalidagi id posts'dagi user id'ga teng bo'lsin. Natija uch qator, har post o'z muallifi bilan."
   ],
   [
    "c",
    "<code>sardor</code> ko'rinmadi: posti yo'q; <b><code>LEFT JOIN</code></b> juftsiz foydalanuvchini ham chiqaradi",
    "Natijada sardor yo'q, chunki uning posti yo'q. JOIN faqat jufti topilgan qatorlarni chiqaradi. Hamma foydalanuvchi kerak bo'lsa, users'dan boshlaymiz va left join yozamiz. Endi to'rt qator, sardor'ning izohi bo'sh."
   ],
   [
    "d",
    "O'quvchi darsida JOIN — «ikki jadvalni id orqali bog'lash»; siz <b><code>ON</code> satrini</b> ko'rsatasiz",
    "O'quvchi darsida JOIN kodsiz ko'rsatiladi: ikki jadvalni id orqali bog'lash. Sinfda o'quvchi so'rasa, siz aynan shu on satrini ko'rsatasiz: qaysi jadvalning qaysi ustuni qaysisiga teng. Xatoning ko'pi ham shu satrda bo'ladi."
   ],
   [
    "e",
    "Xulosa: <code>JOIN</code> — juftlari borlar, <code>LEFT JOIN</code> — chapdagining hammasi; tekshiruv <b><code>ON</code> satrida</b>",
    "Xulosa: JOIN faqat jufti borlarni chiqaradi, left join esa chapdagi jadvalning hamma qatorini. On satrida tashqi kalit, user id, boshqa jadvalning id'siga tenglanadi. Bu satr xato yozilsa nima bo'lishini keyingi tekshiruvda ko'rasiz."
   ]
  ]
 },
 "17": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4 — qaysi satr xato?",
  "title": "So'rov xatosiz ishladi, lekin «Bugun Nest o'rgandim»ni vali yozgandek chiqdi",
  "q": "JOIN'ni ko'rdingiz, endi xato topamiz. Uchinchi tekshiruv. Bu so'rov xato bermadi, baza javob qaytardi. Lekin natija noto'g'ri: «Bugun Nest o'rgandim» ali'niki, bu yerda esa vali'niki bo'lib chiqqan. Qoidani eslang: on satri tashqi kalitni tenglaydi. Xato satrni bosing.",
  "ok": "To'g'ri. Uchinchi satrda users id posts'ning o'z id'siga tenglangan, tashqi kalitga emas. Baza xato bermaydi, chunki ikkalasi ham son: u shunchaki birinchi postni birinchi foydalanuvchiga, ikkinchisini ikkinchisiga ulaydi. Ekranda tuzatilgan holat: posts user id, va natija to'g'ri. Demak, on satrida doim tashqi kalit ustuni turadi, ya'ni posts user id.",
  "okShort": "3-satr: <code>posts.id</code> — postning raqami, muallif emas. Xato chiqmaydi, lekin natija noto'g'ri. Tuzatildi: <code>posts.user_id</code>.",
  "hint": "1- va 2-satr nimani va qayerdan olishni aytadi. Ikki jadval qaysi ustunlar bo'yicha ulanayotganini qidiring.",
  "task": "Qoida: <code>ON</code> satri <code>posts</code>dagi tashqi kalitni — <code>user_id</code>ni — <code>users.id</code>ga tenglaydi. Bu so'rov xato bermadi, lekin natija noto'g'ri: ikkinchi postni ali yozgan, natijada esa vali. <b>Xato satrni bosing.</b>"
 },
 "18": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "JOIN, xato ON va LEFT JOIN — o'z bazangizda",
  "seg": [
   [
    "a",
    "Endi siz: o'z <code>blog</code> bazangizda uch so'rovni yurgizasiz va <b>natijalarni solishtirasiz</b>",
    "Endi o'z blog bazangizda uchta so'rov yurgizasiz. O'n daqiqa. Har birining natijasini oldingisi bilan solishtiring: qaysi qatorlar bor, qaysi biri yo'q va nega."
   ],
   [
    "b",
    "1–2-qadam: to'g'ri <code>JOIN</code>, keyin <code>ON</code>ni <b>ataylab buzing</b> va natijani solishtiring",
    "Birinchi: to'g'ri JOIN, uch qator. Ikkinchi: on satrida user id o'rniga id yozing. Xato chiqmaydi, lekin mualliflar almashadi. Buni o'z ko'zingiz bilan ko'ring, sinfda o'quvchiga aynan shuni ko'rsatasiz."
   ],
   [
    "c",
    "3–4-qadam: <code>LEFT JOIN</code> va sardor; isbot — natija ostidagi <b>qatorlar soni</b>",
    "Uchinchi: left join, users'dan boshlab. sardor bo'sh izoh bilan chiqishi kerak. To'rtinchi: natija ostida qavs ichida qatorlar soni yozilgan. Isbot maydoniga left join natijasidagi qatorlar sonini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, JOIN natijasining to'g'riligini on satri hal qiladi: xato on xato bermaydi, lekin mualliflarni almashtirib yuboradi."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · ishonchlilik",
  "title": "Bitta telefon, ikki xaridor: ikkinchisi kutadi va UPDATE 0 oladi",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi eng esda qoladigan misol: <b>bitta telefon, ikki xaridor</b> bir lahzada",
    "Endi o'quvchi darsidagi eng esda qoladigan misol. Do'konda bitta telefon qoldi, ikki kishi bir lahzada sotib olish tugmasini bosdi. O'quvchi darsi aytadi: SQL uni faqat bittasiga sotadi. Biz buni ikkita PostgreSQL terminali oynasida haqiqatan sinab ko'rdik."
   ],
   [
    "b",
    "<code>products</code> jadvali: <code>stock</code> — qoldiq, <b><code>CHECK (stock &gt;= 0)</code></b> — manfiy bo'lishi taqiq",
    "Avval jadval: products. Nomi va stock, ya'ni omborda nechta qolgani. stock yonida check qoidasi: qoldiq noldan kichik bo'lmasin. Telefondan bitta."
   ],
   [
    "c",
    "1-xaridor telefonni oldi, tranzaksiya hali ochiq; 2-xaridorning so'rovi <b>kutib turibdi</b>",
    "Birinchi xaridor: begin, keyin update: stock'ni bittaga kamaytir, faqat stock noldan katta bo'lsa. Javob: qoldiq nol, update bir. Tranzaksiya hali yopilmagan. Bir soniyadan keyin ikkinchi xaridor xuddi shu update'ni yuboradi. U javob olmaydi, kutib turadi: birinchi xaridor bu qatorni band qilgan."
   ],
   [
    "d",
    "1-xaridor <code>COMMIT</code> qildi — 2-xaridor darhol <b><code>UPDATE 0</code></b>: telefon tugagan",
    "Uchinchi soniyada birinchi xaridor commit qiladi. Shu zahoti ikkinchi xaridorning so'rovi davom etadi, shartni qayta tekshiradi: stock endi nol, noldan katta emas. Javob: nol qator, update nol. Ilova shu nolni ko'rib «Kechirasiz, mahsulot tugagan» deydi. Oxirida stock nol, telefon bitta sotildi."
   ],
   [
    "e",
    "Xulosa: telefonni so'rovdagi <b>shart va qator qulfi</b> saqladi; <code>CHECK</code> — ikkinchi himoya",
    "Xulosa: telefonni ikki narsa saqladi. Birinchisi so'rovdagi shart, stock noldan katta. Ikkinchisi qator qulfi: ikkinchi xaridor birinchisini kutdi. Shart yozilmasa, check qoidasi to'xtatadi: sinab ko'rdik, qoldiq minus bir bo'ladigan update rad etildi."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "5-bosqich · ishonchlilik",
  "title": "Tranzaksiya: buyurtma va ombor birga yoziladi — yoki birortasi ham yozilmaydi",
  "seg": [
   [
    "a",
    "Haqiqiy do'konda sotish <b>ikki ish</b>: buyurtma yoziladi va ombor kamayadi",
    "Oxirgi telefonni bitta update himoya qildi. Lekin haqiqiy do'konda sotish ikki ish: orders jadvaliga buyurtma yoziladi va products'da qoldiq kamayadi. Biri bajarilib, ikkinchisi bajarilmasa, bazada yolg'on paydo bo'ladi: buyurtma bor, telefon esa omborda turibdi."
   ],
   [
    "b",
    "<code>BEGIN</code> ichida buyurtma yozildi, ombor esa <b><code>CHECK</code> bilan rad etildi</b> — telefon allaqachon tugagan",
    "Telefon allaqachon sotilgan, stock nol. vali uchun ikkala ishni bitta tranzaksiyada qilamiz. Begin, buyurtma yozildi, insert bir. Keyin ombor: check qoidasi rad etdi, qoldiq minus bir bo'lardi."
   ],
   [
    "c",
    "<code>COMMIT</code> yozildi, lekin baza <b><code>ROLLBACK</code></b> qildi: <code>orders</code> bo'sh, yarim ish saqlanmadi",
    "Endi commit yozamiz. Lekin javobga qarang: commit emas, rollback. Tranzaksiya ichida xato bo'lgani uchun baza hammasini bekor qildi. orders jadvali bo'sh: vali'ning buyurtmasi ham saqlanmadi. Bu hammasi yoki hech narsa degani."
   ],
   [
    "d",
    "Halol solishtirish: oxirgi telefonni <b>Mongo ham bittaga sotdi</b>, farq — bir nechta jadvalda",
    "Endi halol solishtirish. Oxirgi telefonni MongoDB'da ham sinadik: shartli update bilan u ham bittaga sotdi, chunki bitta hujjatni o'zgartirish Mongo'da ham bo'linmaydi. Farq bir nechta hujjatda: oddiy o'rnatilgan MongoDB serverida tranzaksiya ishlamadi. PostgreSQL'da esa bir nechta jadval oddiy o'rnatishda ham bitta tranzaksiyada."
   ],
   [
    "e",
    "Xulosa: bir nechta jadval birga o'zgarsa — <code>BEGIN … COMMIT</code>; xato bo'lsa <b>hammasi bekor</b>",
    "Xulosa: bir nechta jadval birga o'zgarishi kerak bo'lsa, ularni begin va commit orasiga olasiz. Ichida bitta xato bo'lsa, baza hammasini bekor qiladi. O'quvchi darsi oxirgi telefonni tranzaksiya deb atagan, bu soddalashtirish: buni yigirma yettinchi ekranda ko'ramiz."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "5-bosqich · ishonchlilik",
  "title": "jsonb ustuni: har qatorda har xil maydon — jadval ichida",
  "seg": [
   [
    "a",
    "Mongo'da har hujjat har xil edi — PostgreSQL'da ham <b>shunday ustun bor</b>",
    "O'quvchi darsida PostgreSQL'ning yana bir afzalligi aytiladi: JSON ham saqlaydi. To'rtinchi ekranda Mongo'da har hujjat har xil bo'lishini ko'rgan edik. PostgreSQL'da ham shunday joy bor: jsonb turidagi ustun."
   ],
   [
    "b",
    "<code>ALTER TABLE</code> bilan <b><code>extra JSONB</code></b> ustuni qo'shildi — eski qatorlar bo'sh qoladi",
    "products jadvaliga alter table bilan extra degan ustun qo'shamiz, turi jsonb. Jadval o'zgardi, telefon qatorida bu ustun bo'sh."
   ],
   [
    "c",
    "Futbolkada rang va o'lcham, quloqchinda rang va bluetooth — <b>bitta jadvalda</b>",
    "Ikki mahsulot qo'shamiz. Futbolkada rang va o'lcham, quloqchinda rang va bluetooth. Maydonlar har xil, lekin ikkalasi bitta jadvalda. Nom va qoldiq esa oddiy ustunlarda, ularning qoidalari joyida qoladi."
   ],
   [
    "d",
    "<b>JSON ichidagi maydon bo'yicha</b> qidirish mumkin: rangi qora mahsulot — futbolka",
    "JSON ichidagi maydon bo'yicha qidirish ham mumkin. Strelka va ikki burchak qavs bilan rang maydonining matnini olamiz va qora rangni qidiramiz. Javob: futbolka."
   ],
   [
    "e",
    "Xulosa: asosiy maydon — ustun va qoida bilan, <b>erkin qo'shimcha</b> — <code>jsonb</code>da",
    "Xulosa: muhim va hamma qatorda bor maydon oddiy ustunda turadi, qoidasi bilan. Har mahsulotda har xil bo'ladigan qo'shimcha esa jsonb'da. O'quvchi «PostgreSQL JSON ham saqlaydi» degan gapni so'rasa, aynan shu misolni ko'rsating."
   ]
  ]
 },
 "22": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "BEGIN → buyurtma yozildi → ombor CHECK xatosi → COMMIT. orders jadvalida nima bor?",
  "q": "Tranzaksiyani ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Tranzaksiya ichida buyurtma yozildi, insert bir, keyin ombor check qoidasi bilan rad etildi va commit yozildi. orders jadvalida nima qoldi? Variantni tanlang.",
  "ok": "To'g'ri, hech narsa. Tranzaksiya ichida xato bo'lgani uchun commit'ga baza rollback deb javob berdi va hammasini bekor qildi. insert bir chiqqan edi, lekin u hali tasdiqlanmagan edi. orders bo'sh, nol qator. Demak, tranzaksiya ichida bitta xato bo'lsa, undagi hamma o'zgarish bekor bo'ladi.",
  "okShort": "<code>COMMIT</code> → <code>ROLLBACK</code>: xatoli tranzaksiya to'liq bekor. <code>orders</code> — <code>(0 rows)</code>.",
  "hint": "Xatoli tranzaksiyada COMMIT nima deb javob berishini eslang — 20-ekranning 3-qadami.",
  "correct": 1,
  "opts": [
   "vali'ning buyurtmasi, chunki INSERT 0 1 chiqqan edi",
   "Hech narsa: baza hammasini bekor qildi, ROLLBACK",
   "Buyurtma va stock = -1",
   "Buyurtma bor, lekin COMMIT xato beradi"
  ],
  "wrong": {
   "0": "INSERT 0 1 tranzaksiya ichida edi va tasdiqlanmagan. COMMITning javobiga qarang.",
   "2": "CHECK qoidasi -1 ni rad etdi — bunday qator yozilmaydi.",
   "3": "COMMIT xato bermaydi, javobi boshqa so'z. U nima deydi?"
  }
 },
 "23": {
  "type": "Practice",
  "kicker": "Amaliyot 4 / 4",
  "eyebrow": "Hozir o'zingizda · 10–15 daqiqa",
  "title": "Oxirgi telefonni ikki terminal oynasida o'zingiz soting",
  "seg": [
   [
    "a",
    "Endi siz: <b>ikki terminal oynasini</b> yonma-yon ochib, oxirgi telefonni o'zingiz sotasiz",
    "Oxirgi amaliyot, eng qiziqarlisi. Ikkita terminal oynasini yonma-yon oching, ikkalasida PostgreSQL terminalini ochib, teskari chiziqcha c blog yozing. Biri birinchi xaridor, ikkinchisi ikkinchi xaridor. O'n-o'n besh daqiqa."
   ],
   [
    "b",
    "1–2-qadam: <code>products</code> va bitta telefon; 1-oynada <code>BEGIN</code> va <code>UPDATE</code>, <b><code>COMMIT</code>siz</b>",
    "Birinchi: products jadvali va bitta telefon. Ikkinchi: birinchi oynada begin, keyin update. Qoldiq nol bo'ladi. Muhim: commit'ni hali yozmang, tranzaksiya ochiq tursin."
   ],
   [
    "c",
    "3–4-qadam: 2-oyna kutadi, 1-oynada <code>COMMIT</code>; isbot — <b>2-oynadagi oxirgi satr</b>",
    "Uchinchi: ikkinchi oynada xuddi shu update'ni yuboring. U javob bermaydi, kutib turadi. To'rtinchi: birinchi oynada commit yozing va ikkinchi oynaga qarang. Isbot maydoniga ikkinchi oynada chiqqan oxirgi satrni yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Beshinchi qadam ixtiyoriy, jsonb. To'rtta majburiy katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, oxirgi telefonni shart va tranzaksiya saqlab qoladi: ikkinchi xaridor kutadi va hech narsa olmaydi."
   ]
  ]
 },
 "24": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "title": "Sinf kompyuterlari: har birida psql -U postgres ochilsin",
  "seg": [
   [
    "a",
    "O'zingizda ishladi — endi sinf: o'quvchi kompyuterlariga PostgreSQL'ni <b>siz o'rnatasiz</b>",
    "Mavzuni o'zingiz qo'l bilan o'tdingiz. Endi sinf. O'quvchi darslarida PostgreSQL'ni o'rnatish hech qayerda o'rgatilmaydi: m4-08 darsi psql minus U postgres buyrug'ini va o'rnatishda berilgan parolni tayyor deb kutadi. Shuning uchun sinf kompyuterlariga uni siz o'rnatasiz."
   ],
   [
    "b",
    "m4-03 kodsiz — PostgreSQL m4-06 dan kerak; o'rnatishni <b>m4-03 dan keyin, m4-06 dan oldin</b> qiling",
    "Vaqti: m4-03 kodsiz dars, unda baza kerak emas. m4-06 da o'quvchi so'rov yozishni boshlaydi. Demak, o'rnatishni m4-03 va m4-06 orasida qiling. Har kompyuterga yettinchi va sakkizinchi ekrandagi yo'l bilan, PATH'ni unutmang."
   ],
   [
    "c",
    "Hamma kompyuterda <b>bitta parol</b>: o'quvchi uni loyiha sozlamasiga yozadi",
    "Parol hamma kompyuterda bir xil bo'lsin va o'quvchilarga aytiladi, chunki keyingi darslarda u loyihaning env faylida kerak. Bir fakt: kursdagi Nest loyihasining env example faylida parol password deb yozilgan. Sinf paroli shu bo'lsa, o'quvchi faylni o'zgartirmaydi."
   ],
   [
    "d",
    "Har kompyuterda <b>bitta buyruq bilan</b> tekshiring — kompyuterni qayta yoqqandan keyin ham",
    "Tekshiruv har kompyuterda bitta buyruq: psql minus U postgres, minus c va select version. PostgreSQL versiyasi chiqsa, kompyuter tayyor. Kompyuterni qayta yoqib, yana bir marta tekshiring: server o'zi ishga tushishi kerak."
   ],
   [
    "e",
    "Xulosa: m4-06 dan oldin <b>har kompyuterda</b> — o'rnatish, PATH, bitta parol, tekshiruv buyrug'i",
    "Xulosa: m4-06 dan oldin har sinf kompyuterida to'rt narsa. PostgreSQL o'rnatilgan, psql buyrug'i PATH'da, parol hammada bir xil va tekshiruv buyrug'i qayta yoqilgandan keyin ham versiyani ko'rsatadi. Xato chiqsa, birinchi amaliyotdagi jadval sizga yordam beradi."
   ]
  ]
 },
 "25": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4-03 · «SQL vs NoSQL — nega PostgreSQL»",
  "title": "m4-03: kodsiz dars — siz bugun hammasini qo'l bilan qildingiz",
  "seg": [
   [
    "a",
    "m4-03 kodsiz: o'quvchi jadval va hujjatni ko'radi, lekin <b><code>psql</code> ochmaydi</b>",
    "Endi o'quvchi darsi, m4-03, yigirma bir ekran. U kodsiz: o'quvchi jadval va hujjatni ko'radi, solishtiradi, tanlaydi, lekin PostgreSQL terminalini ochmaydi. Siz bugun hammasini qo'l bilan qildingiz, shuning uchun har blokda bitta qo'shimcha gapingiz bor."
   ],
   [
    "b",
    "Kirish va shakl: <b>«ikkalasi ham to'g'ri»</b>, keyin jadval va hujjat farqi",
    "Dars savol bilan boshlanadi: SQL ko'rinishimi yoki NoSQL? To'g'ri javob: ikkalasi ham, vazifaga bog'liq. Keyin ikki tur va shakl: o'quvchi kartalarni jadval ustunlariga joylaydi. Siz qo'shasiz: jadvalda ustun turi oldindan yoziladi, hujjatda esa maydon erkin."
   ],
   [
    "c",
    "Kuchlar bloki — siz bugun ko'rgan <b>JOIN va oxirgi telefon</b>; chat esa NoSQL kuchi",
    "Uchinchi blok sizga eng tanish: JOIN, oxirgi telefon va chat oqimi. O'quvchi JOIN'ni id orqali bog'lash deb ko'radi, siz on satrini aytasiz. Chat misolida NoSQL kuchi: juda ko'p oddiy xabar, bog'lanish kam. Buni inkor qilmang, bu to'g'ri."
   ],
   [
    "d",
    "Qaror ko'rsatkichi <b>to'rtta savoldan iborat</b>; amaliyotda o'quvchi o'z loyihasi uchun bazani tanlaydi",
    "To'rtinchi va beshinchi blokda o'quvchi qaror qabul qilishni o'rganadi. Qaror ko'rsatkichi to'rtta savoldan iborat: ma'lumot bog'langanmi, shakli qat'iymi, xato qimmatga tushadimi va ulkan, oddiy, tez saqlash kerakmi. Keyin nega PostgreSQL tanlanganini va AI tavsiyasini loyihaga moslashtirishni ko'radi. Amaliyotda o'quvchi o'z loyihasi uchun bazani tanlaydi va ikki jadvalni qog'ozda yozadi: namunasi siz bugun yaratgan users va posts."
   ],
   [
    "e",
    "Xulosa: o'quvchi tanlashni o'rganadi, siz har gapni <b>bazada ko'rsata olasiz</b>",
    "Xulosa: m4-03 da o'quvchi tanlashni o'rganadi, kod yozmaydi. Vaqt, taklif: to'qson daqiqa. Kirish va shakl yigirma, kuchlar yigirma besh, qaror va nega PostgreSQL yigirma, mustahkamlash va amaliyot yigirma, yakun besh. Kuchli o'quvchi so'rasa, bugungi PostgreSQL terminalingizni ochib ko'rsating."
   ]
  ]
 },
 "26": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "title": "O'quvchi darsi atamalarni kundalik so'zlar bilan tushuntiradi — siz ularni atama bilan bog'laysiz",
  "seg": [
   [
    "a",
    "O'quvchi darsi atamalarni kundalik so'zlar bilan tushuntiradi, siz esa <b>ikkalasini birga aytasiz</b>",
    "Endi o'quvchi darsida qanday so'zlar ishlatilishini ko'ramiz. AI Startup kursidagi o'quvchi darsi atamalarni kundalik so'zlar bilan tushuntiradi: jadval o'rniga Excel jadvali, hujjat o'rniga papkadagi qog'ozlar. Siz ikkalasini bilasiz va sinfda birga aytasiz: avval o'quvchi darsidagi so'z, keyin haqiqiy atama."
   ],
   [
    "b",
    "Jadval — <b>Excel jadvali</b>, hujjat — <b>papkadagi turli qog'ozlar</b>",
    "Jadval Excel jadvaliga o'xshaydi: har qatorda bir xil ustunlar. Hujjat esa papkadagi turli qog'ozlar kabi: har birida o'z maydonlari, jingalak qavs ichida. MongoDB va Firebase o'quvchi darsida hujjatli baza misoli."
   ],
   [
    "c",
    "O'quvchi darsida JOIN — «id orqali bog'lash», oxirgi telefon esa <b>«SQL nazorati»</b> deb ataladi",
    "O'quvchi darsida JOIN ikki jadvalni id orqali bog'lash deb tushuntiriladi. Oxirgi telefon misoli esa SQL nazorati deb ataladi, uning atamasi tranzaksiya. Darsdagi qaror ko'rsatkichi to'rtta savoldan iborat: ma'lumot bog'langanmi, shakli qat'iymi, xato qimmatga tushadimi va ulkan, oddiy, tez saqlash kerakmi. O'quvchi shu to'rt savolni yodda tutishi kerak."
   ],
   [
    "d",
    "Xulosa: <b>avval o'quvchining so'zi, keyin atama</b> — «Excel jadvaliga o'xshaydi, ya'ni table»",
    "Xulosa: sinfda so'zlarni juft qilib ayting, masalan: Excel jadvaliga o'xshaydi, buning atamasi table, har qator bitta yozuv. O'xshatish vazifani tushuntiradi. Farqini esa siz ko'rsatasiz: Excel qoidani tekshirmaydi, PostgreSQL esa bo'sh nomni ham, yo'q muallifni ham rad etadi."
   ]
  ]
 },
 "27": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfda",
  "title": "Ikki soddalashtirish va o'quvchining besh savoli — tayyor javoblar",
  "seg": [
   [
    "a",
    "Darsning ikki joyi <b>soddalashtirilgan</b> — sinovda ko'rganingiz bilan solishtiramiz",
    "Oxirgi tayyorgarlik. O'quvchi darsida ikki joy soddalashtirilgan. Bu xato emas, o'smir uchun shunday aytilgan. Lekin siz haqiqatni bilishingiz kerak, chunki kuchli o'quvchi albatta so'raydi."
   ],
   [
    "b",
    "Oxirgi telefon: darsda «tranzaksiya», aslida <b>shart va qulf</b> — Mongo ham bittaga sotdi",
    "Birinchisi oxirgi telefon. Darsda uni SQL nazorati, tranzaksiya saqlaydi deyiladi. Sinovda ko'rdingiz: telefonni so'rovdagi shart va qator qulfi saqladi, Mongo ham bittaga sotdi. Darsdagi gap yetarli. So'rashsa ayting: baza shartni qayta tekshiradi, ikkinchi xaridor kutadi."
   ],
   [
    "c",
    "NoSQL'da bog'lash bor, lekin uni baza emas, <b>kod qo'riqlaydi</b>",
    "Ikkinchisi: darsda NoSQL'da hujjatlarni bog'lash qiyin deyiladi. Aslida bog'lash bor, populate'ni o'zingiz bilasiz. Farqi boshqa joyda: Mongo yo'q muallifni xato bermay saqladi. Sinfda shunday ayting: bog'lash mumkin, lekin to'g'riligini kod saqlaydi, baza emas."
   ],
   [
    "d",
    "O'quvchining <b>besh savoli</b>: Mongo, MySQL, Excel, Firebase va qisqa <code>id</code>",
    "Pastda o'quvchining besh savoliga tayyor javoblar bor: Mongo yomonmi, MySQL'dan farqi, Excel'ning o'zi emasmi, Firebase nima va nega id qisqa. Kartani bosib o'qing. Eng ko'p beriladigani Excel haqidagi savol."
   ],
   [
    "e",
    "Xulosa: <b>Mongo'ni yomonlamang</b> — tanlov to'rt savol bilan, farqni bazada ko'rsating",
    "Xulosa: sinfda Mongo'ni yomonlamang, o'zingiz ko'rdingiz, u ko'p narsani qila oladi. Tanlovni doim qaror ko'rsatkichining to'rt savoli bilan asoslang. Farqni so'z bilan emas, PostgreSQL terminalida ko'rsating: yo'q muallifga post yozing va xabarni birga o'qing."
   ]
  ]
 },
 "28": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Mongo'dagi populate() PostgreSQL'da nima bilan qilinadi?",
    "o": [
     "REFERENCES",
     "JOIN … ON …",
     "CREATE TABLE",
     "SERIAL"
    ],
    "c": 1,
    "e": "JOIN so'rov paytida ikki jadvalni ulaydi; REFERENCES — refning jufti.",
    "s": 5
   },
   {
    "q": "Mac'da psql -U postgres → role \"postgres\" does not exist. Nima qilasiz?",
    "o": [
     "createuser -s postgres",
     "Parolni qayta kiritaman",
     "Postgres.app'ni qayta Initialize qilaman",
     "CREATE DATABASE postgres;"
    ],
    "c": 0,
    "e": "Homebrew bilan o'rnatilgan: superuser — Mac foydalanuvchisi, postgres roli yo'q.",
    "s": 8
   },
   {
    "q": "usersda 99-foydalanuvchi yo'q. INSERT INTO posts (user_id, izoh) VALUES (99, '…'); nima qaytaradi?",
    "o": [
     "INSERT 0 1, muallif bo'sh",
     "usersga 99 qo'shiladi",
     "Tashqi kalit xatosi, post saqlanmaydi",
     "NOT NULL xatosi"
    ],
    "c": 2,
    "e": "posts_user_id_fkey: Key (user_id)=(99) is not present in table \"users\".",
    "s": 13
   },
   {
    "q": "Prompt postgres=#. SELECT * FROM posts; → relation \"posts\" does not exist, lekin jadvalni yaratgansiz. Nima qilasiz?",
    "o": [
     "Jadvalni qayta yarataman",
     "Serverni qayta ishga tushiraman",
     "Parolni tekshiraman",
     "\\c blog"
    ],
    "c": 3,
    "e": "Jadval blog bazasida; prompt boshqa bazani ko'rsatyapti.",
    "s": 12
   },
   {
    "q": "Postsiz foydalanuvchi ham natijada chiqishi kerak. Qaysi so'rov?",
    "o": [
     "FROM users LEFT JOIN posts ON …",
     "FROM posts JOIN users ON …",
     "JOINsiz SELECT * FROM users, posts",
     "ON satrini olib tashlash"
    ],
    "c": 0,
    "e": "LEFT JOIN chapdagi jadvalning hamma qatorini chiqaradi; sardor — bo'sh izoh bilan.",
    "s": 16
   },
   {
    "q": "1-xaridor BEGIN + UPDATE … WHERE stock > 0 qildi, COMMIT hali yo'q. 2-xaridor xuddi shu UPDATEni yubordi. Nima bo'ladi?",
    "o": [
     "Darhol UPDATE 1, telefon ikkalasiga",
     "Kutadi, 1-xaridor COMMITdan keyin UPDATE 0",
     "Darhol CHECK xatosi",
     "stock = -1 bo'ladi"
    ],
    "c": 1,
    "e": "Qator band — 2-xaridor kutadi, keyin shartni qayta tekshiradi: stock 0.",
    "s": 19
   },
   {
    "q": "Tranzaksiya ichida xato chiqdi, keyin COMMIT; yozildi. psql nima deb javob beradi?",
    "o": [
     "COMMIT",
     "ERROR",
     "Hech narsa",
     "ROLLBACK"
    ],
    "c": 3,
    "e": "Xatoli tranzaksiya bekor qilinadi: COMMIT; → ROLLBACK, orders bo'sh.",
    "s": 20
   },
   {
    "q": "O'quvchi: «NoSQL zamonaviyroq, onlayn do'konimga MongoDB olaman». Nima deysiz?",
    "o": [
     "To'g'ri, NoSQL yangiroq",
     "MongoDB sekin, olmang",
     "4 savol: buyurtma, mahsulot, to'lov bog'langan, xato qimmat — PostgreSQL",
     "Farqi yo'q, istaganini oling"
    ],
    "c": 2,
    "e": "Tanlov modaga emas, vazifaga qarab; do'konda 3 mezon SQL tomonda.",
    "s": 27
   }
  ]
 },
 "29": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};
