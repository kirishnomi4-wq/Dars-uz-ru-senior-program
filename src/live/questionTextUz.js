// AVTOMATIK — scripts/savol-kalitlari.mjs --yoz (SAVOL_MATNLARI.json dan). Qo'lda tahrirlanmaydi.
// F-1109-07: RU rejimda serverga yoziladigan urinish matnini UZ-etalonga keltirish (RU_I18N_SPEC: analitika doim UZ, til — lang).
// { lessonId: { questionId: [savol_uz, [variantlar_uz…]] } } — faqat RU yuki o'zbekchadan farq qiladigan savollar.
export const QT_UZ = {
 "api-postman-04-06-v18": {
  "s12": [
   "Sayt ma'lumot kerak bo'lganda nima qiladi?",
   [
    "Bazaga to'g'ridan-to'g'ri o'zi kirib ma'lumot oladi",
    "API'ga so'rov yuboradi, server javob qaytaradi",
    "Hech kim bilan gaplashmaydi — hammasini o'zi biladi",
    "Boshqa saytdan tayyor ma'lumot nusxasini oladi"
   ]
  ],
  "s4": [
   "API nima vazifani bajaradi?",
   [
    "Saytning ranglari va shriftlarini chiroyli qilib bezaydi",
    "Server rasmlarini saqlaydigan katta papka",
    "Ikki dastur (sayt va server) gaplashadigan til va qoidalar",
    "Internet tezligini oshiradigan maxsus dastur"
   ]
  ],
  "s5b": [
   "GET method nima qiladi?",
   [
    "Mavjud ma'lumotni o'qib (olib) keladi",
    "Butunlay yangi ma'lumot qo'shib yozadi",
    "Mavjud ma'lumotni bazadan o'chiradi",
    "Serverni butunlay o'chirib qo'yadi"
   ]
  ],
  "s9": [
   "Bazaga yangi mahsulot qo'shish uchun qaysi method?",
   [
    "GET — mavjud ma'lumotni o'qib oladi",
    "DELETE — mavjud yozuvni o'chiradi",
    "PUT — mavjud yozuvni o'zgartiradi",
    "POST — yangi ma'lumot qo'shib yozadi"
   ]
  ]
 },
 "auth-env-04-07-v18": {
  "s12": [
   "Maxfiy kalitlarni (JWT_SECRET) qayerda saqlash to'g'ri?",
   [
    "To'g'ridan-to'g'ri kod ichiga yozamiz — bu eng qulay va ishonchli usul",
    "Saytning HTML sahifasiga — brauzer uni o'zi yashirib beradi",
    ".env fayliga — kod uni process.env orqali o'qiydi, GitHub'ga ketmaydi",
    "Hech qayerda saqlamaymiz — kalitsiz ham ishlayveradi"
   ]
  ],
  "s4": [
   "Login muvaffaqiyatli bo'lsa, server nima qaytaradi?",
   [
    "Token (bilaguzuk) beradi — keyingi so'rovlar uchun",
    "Parolni qaytadan so'rab, kirishni butunlay bekor qiladi",
    "Hech narsa bermaydi — parolni har safar so'rayveradi",
    "Butun ma'lumotlar bazasini yuklab yuboradi"
   ]
  ],
  "s5b": [
   "Nega birov soxta token yasab, o'zini boshqa odam qilib ko'rsata olmaydi?",
   [
    "Token juda uzun — uni to'liq ko'chirib yozib bo'lmaydi",
    "Imzo (signature) maxfiy kalit bilan yasaladi — kalitsiz to'g'ri imzo chiqmaydi",
    "Token ko'rinmaydi — uni umuman hech kim o'qiy olmaydi",
    "Server har bir berilgan tokenni bazasida eslab qolib, kelgan so'rov bilan solishtiradi"
   ]
  ],
  "s9": [
   "Himoyalangan route'ga tokensiz so'rov yuborilsa, server qaysi status qaytaradi?",
   [
    "200 OK — hammasi joyida, bemalol kiravering",
    "404 Not Found — bunday manzil serverda umuman topilmadi",
    "201 Created — mahsulot muvaffaqiyatli qo'shildi",
    "401 Unauthorized — token yo'q, kira olmaysiz"
   ]
  ]
 },
 "bot-ai-agent-05-10-v18": {
  "s10": [
   "Agentning maqsadi — buyurtmani qabul qilib, yetkazishga tayyorlash. U buyurtmani saqladi. Endi nima qiladi?",
   [
    "Mijozga «qabul qilindi» deb yozib, ishni tugatadi",
    "Mijoz keyingi buyruq yozishini kutib turadi",
    "Buyurtmani yana bir marta bazaga yozadi",
    "Natijani ko'radi va keyingi qadamni tanlaydi"
   ]
  ],
  "s14": [
   "Agent mijozning kartasidan pul yechishidan oldin nima muhim?",
   [
    "Unga hamma ishda to'liq erkinlik berib qo'yish",
    "Faqat kerakli tool'larni berish va tasdiq so'ratish",
    "Pul yechilgach, mijozga xabar yuborib qo'yish",
    "Javob berish tezligini iloji boricha oshirish"
   ]
  ],
  "s4": [
   "Botdagi AI qadamlarni o'zi tanladi: avval Pepperoni borligini tekshirdi, keyin buyurtmani bazaga yozdi, oxirida yetkazishni rejaladi. Bu qanday bot?",
   [
    "AI-bot — AI javob matnini yozib beradi",
    "Oddiy skript — bir marta ishlab, to'xtaydi",
    "AI-agent — maqsad sari tool'larni ishlatadi",
    "Handlerli bot — oldindan yozilgan javob beradi"
   ]
  ],
  "s8": [
   "AI-agent ishni qanday bajaradi?",
   [
    "Maqsadga mos tool'ni tanlab chaqiradi",
    "Faqat matn yozib beradi, ishni odam qiladi",
    "Kod yozilmasa ham, o'zi bajarib qo'yadi",
    "Oldindan belgilangan bitta amalni takrorlaydi"
   ]
  ]
 },
 "bot-ai-brain-05-04-v18": {
  "s10": [
   "Temperature baland qilib qo'yilsa, nima bo'ladi?",
   [
    "AI javobni ancha tezroq yozib beradi",
    "Javoblar har safar aynan bir xil chiqadi",
    "Bot internetni ancha ko'proq sarflaydi",
    "Javoblar har safar boshqacha bo'lishi mumkin"
   ]
  ],
  "s14": [
   "AI «Bizda ananasli pitsa bor» deb yozdi. Nima qilish kerak?",
   [
    "Ishonib, mijozga shundayligicha yuborish",
    "Menu bilan solishtirib, tekshirib ko'rish",
    "Mijozdan savolni qaytadan yozishni so'rash",
    "Botni to'xtatib, qayta ishga tushirish"
   ]
  ],
  "s4": [
   "AI'dan foydali javob olish uchun prompt qanday yozilishi kerak?",
   [
    "Iloji boricha qisqa, bir-ikki so'z bilan",
    "Katta harflar va undov belgilari bilan",
    "Kim uchun va nima kerakligini aniq aytib",
    "Bitta savolni bir necha marta takrorlab"
   ]
  ],
  "s8": [
   "Suhbat tarixi kontekst oynasiga sig'may qolsa, nima bo'ladi?",
   [
    "Eng eski xabarlar chiqadi va AI ularni ko'rmaydi",
    "AI butunlay ishlashdan to'xtab qoladi",
    "Bot yangi xabarlarni qabul qilmay qo'yadi",
    "Eski xabarlar o'zi bazaga yozilib qoladi"
   ]
  ]
 },
 "bot-intro-05-01-v18": {
  "s10": [
   "Token ochiq kodda qolib ketsa, qanday xavf bor?",
   [
    "Hech qanday xavf yo'q, uni hech kim ko'rmaydi",
    "Bot o'zi ishlashdan to'xtab qoladi",
    "Boshqa odam bot nomidan xabar yubora oladi",
    "Telegram botni darhol o'chirib qo'yadi"
   ]
  ],
  "s14": [
   "Botga bir vaqtda uch mijoz yozsa, nima bo'ladi?",
   [
    "Faqat birinchi xabarga javob berib, qolganini tashlab ketadi",
    "Xabarlarni adashtirib, hammasiga tasodifiy javob beradi",
    "Uchala xabarni bitta xabar deb qo'shib yuboradi",
    "Har xabarni alohida ko'rib, har biriga mos javob beradi"
   ]
  ],
  "s4": [
   "Bot oddiy skriptdan nimasi bilan farq qiladi?",
   [
    "Internetsiz, faqat kompyuter ichida ishlaydi",
    "Faqat bitta odam bilan gaplasha oladi",
    "Bir marta yuqoridan pastga ishlab, to'xtaydi",
    "Ishlab turadi va yangi hodisani kutadi"
   ]
  ],
  "s8": [
   "Mos handler topilmasa, bot nima qiladi?",
   [
    "Hech narsa yubormay, jim qoladi",
    "O'zicha tasodifiy javob o'ylab topadi",
    "Xabarni boshqa botga uzatib yuboradi",
    "Xato chiqarib, butunlay o'chib qoladi"
   ]
  ]
 },
 "bot-stateful-memory-05-03-v18": {
  "s10": [
   "Aziza va Bek bir vaqtda buyurtma beryapti. Ularning suhbati aralashmasligi uchun nima kerak?",
   [
    "Ikkala mijozning holatini bitta umumiy o'zgaruvchida saqlash",
    "Har mijoz uchun alohida bot ochib, alohida token berish",
    "Umumiy holatni obyektda emas, PostgreSQL'da saqlash",
    "Har mijozga alohida sessiya ochib, holatini unda saqlash"
   ]
  ],
  "s14": [
   "Mijoz birinchi marta /start bosdi, jadvalda uning qatori hali yo'q. Qaysi buyruq kerak?",
   [
    "INSERT — jadvalga yangi qator qo'shadi",
    "SELECT — mavjud qatorni o'qiydi",
    "UPDATE — mavjud qatorni o'zgartiradi",
    "DELETE — mavjud qatorni o'chiradi"
   ]
  ],
  "s4": [
   "Bot o'zi o'lcham so'radi, lekin «Katta» javobini tushunmadi. Nega?",
   [
    "Internet sekin bo'lib, xabar Bot API'ga yetmadi",
    "Mijoz juda tez yozdi, handler ulgurmay qoldi",
    "Bot holatni saqlamaydi, o'z savolini eslamaydi",
    "Telegram xabarlarni aralash tartibda yetkazdi"
   ]
  ],
  "s8": [
   "Bot serveri birdan o'chib qoldi. Qaysi holat yo'qolmaydi?",
   [
    "Koddagi oddiy JavaScript obyektiga yozilgan holat",
    "PostgreSQL'dagi users jadvaliga yozilgan holat",
    "Handler ichidagi o'zgaruvchiga yozilgan holat",
    "Hech qaysi: server o'chsa, hammasi yo'qoladi"
   ]
  ]
 },
 "css-01-v17": {
  "s4": [
   "h1 { color: red; } — bu yerda 'color' nima deb ataladi?",
   [
    "Selektor",
    "Qiymat",
    "Teg",
    "Xususiyat (property)"
   ]
  ]
 },
 "data-intro-04-01-v18": {
  "s12": [
   "comments jadvalidagi post_id ustuni nima uchun kerak?",
   [
    "Izohning rangini saqlash uchun",
    "Izohni butunlay o'chirish uchun",
    "Hech narsa uchun — shunchaki ortiqcha",
    "Izohni to'g'ri postga bog'lash uchun"
   ]
  ],
  "s4": [
   "Qaysi biri to'g'ri tartibli ma'lumot (JSON)?",
   [
    "{ \"username\": \"ali_dev\", \"title\": \"Tog' sayohati\" }",
    "{ username = ali_dev, title = Tog' sayohati, likes = 5 }",
    "{ ali_dev, tog rasm, Tog' sayohati }",
    "\"username: ali_dev, title: Tog' sayohati\""
   ]
  ],
  "s5b": [
   "Jadvalda bitta QATOR (row) nimani anglatadi?",
   [
    "Bitta ustunning nomi",
    "Butun jadvalning o'zi",
    "Bitta to'liq yozuv (post)",
    "Faqat ustun nomlari qatori"
   ]
  ],
  "s9": [
   "users va posts orasidagi bog'lanish qanday?",
   [
    "Bitta foydalanuvchi — bitta post",
    "Bitta foydalanuvchi — ko'p post (bitta → ko'p)",
    "Bog'lanish yo'q",
    "Har bir post — barcha foydalanuvchilarga tegishli"
   ]
  ]
 },
 "db-sql-nosql-04-02-v18": {
  "s12": [
   "Nega aynan PostgreSQL tanlaymiz?",
   [
    "Chunki u eng yangi va zamonaviy baza",
    "Bog'langan, ishonchli, bepul va JSON ham saqlaydi",
    "Chunki boshqa hech qanday baza yo'q",
    "Chunki u faqat kichik loyihalarga mos"
   ]
  ],
  "s4": [
   "Shakli tez-tez o'zgaradigan ma'lumot uchun qaysi tur qulayroq?",
   [
    "SQL — jadvaldagi hamma qatorda bir xil ustunlar bo'ladi",
    "Ikkalasi ham bir xil — farqi yo'q",
    "NoSQL — har hujjatda maydonlar boshqacha bo'lishi mumkin",
    "Hech biri yangi maydon qo'sha olmaydi"
   ]
  ],
  "s5b": [
   "Bir-biriga bog'liq ma'lumotlar uchun qaysi tur qulayroq?",
   [
    "SQL — bog'liq ma'lumotlarni birlashtira oladi",
    "NoSQL — har narsa alohida hujjatda saqlanadi",
    "Bog'lanish ikkalasida ham umuman yo'q",
    "Faqat qo'lda hisoblashga to'g'ri keladi"
   ]
  ],
  "s9": [
   "Bank ilovasi (pul, hisoblar, o'tkazmalar) uchun qaysi tur mos?",
   [
    "NoSQL — katta hajmli oddiy ma'lumot uchun qulay",
    "Aslida ikkalasining ham farqi yo'q",
    "Bunga hech qanday baza kerak emas",
    "SQL — ma'lumotlar bog'langan va ishonchlilik muhim"
   ]
  ]
 },
 "fullstack-connect-practice-p2-v18": {
  "s14": [
   "Ulangandan keyin katalog mashinalarni qayerdan oladi?",
   [
    "Serverdan — fetch(GET /api/cars) orqali bazadan",
    "Kodga qo'lda yozilgan const cars massivi ichidan",
    "CSS faylidan — uslublar bilan birga",
    "Hech qayerdan — katalog bo'sh qoladi"
   ]
  ]
 },
 "git-github-v19": {
  "s14": [
   "Kompyuter buzildi. Kodni yangi kompyuterda qanday qaytarasiz?",
   [
    "Brauzer tarixidan qidiraman",
    "VS Code'ni qayta o'rnataman — fayllar qaytadi",
    "Boshqa yo'l yo'q — qaytadan yozaman",
    "GitHub'dagi repodan nusxasini olaman"
   ]
  ],
  "s4": [
   "Git kompyuterda qanday ish qiladi?",
   [
    "Kodni ranglab, xatolarni belgilab beradi",
    "Kodning versiyalarini saqlaydi va eski holatiga qaytaradi",
    "Kodni brauzerda ochib beradi",
    "Saytni internetda hammaga ochadi"
   ]
  ],
  "s6": [
   "Git bilan GitHub orasidagi farq nimada?",
   [
    "Git — kompyuterdagi dastur, GitHub — kod turadigan sayt",
    "Git — sayt, GitHub — kompyuterdagi dastur",
    "Ikkalasi bir narsaning ikki nomi",
    "Git — brauzer, GitHub — kod redaktori"
   ]
  ]
 },
 "html-01-v17": {
  "s4": [
   "HTML kodini o'qib, sahifani ekranda ko'rsatadigan dastur qaysi?",
   [
    "Server",
    "Photoshop",
    "Brauzer",
    "Klaviatura"
   ]
  ]
 },
 "html-02-v16": {
  "s12": [
   "DevTools orqali matnni o'zgartirsangiz, bu o'zgarish...",
   [
    "Butun internetda, hamma uchun o'zgaradi",
    "Saytni butunlay o'chirib yuboradi",
    "Faqat sizning ekraningizda, vaqtincha bo'ladi",
    "Hech qachon ko'rinmaydi"
   ]
  ]
 },
 "html-takrorlash-01-05-v2": {
  "s4": [
   "Kod-parcha: h1 va ichida strong bo'lgan p. Brauzer nimani ko'rsatadi?",
   [
    "Katta sarlavha, ostida matn — «3 yil» qiya (kursiv) chiqadi",
    "Katta sarlavha, ostida matn — «3 yil» qalin (bold) chiqadi",
    "Hamma yozuv bir xil chiqadi, teglar ham ekranda ko'rinadi",
    "Faqat sarlavha chiqadi — pastdagi matn umuman ko'rinmaydi"
   ]
  ]
 },
 "js-cond-01-v18": {
  "s4": [
   "if blokining ichidagi kod qachon ishlaydi?",
   [
    "Doim, har safar",
    "Hech qachon",
    "Shart yolg'on (`false`) bo'lganda",
    "Shart rost (`true`) bo'lganda"
   ]
  ],
  "s5b": [
   "Shart false (yolg'on) bo'lsa, qaysi blok ishlaydi?",
   [
    "`if` bloki",
    "`else` bloki",
    "Ikkalasi",
    "Hech biri"
   ]
  ]
 },
 "js-functions-01-v18": {
  "s4": [
   "damage() deb yozsak nima bo'ladi?",
   [
    "Hech narsa — u shunchaki nom bo'lib turadi",
    "Funksiya ichidagi kod ishga tushadi (chaqiriladi)",
    "Funksiya butunlay o'chib, yo'qoladi",
    "Noldan yangi funksiya yaratiladi"
   ]
  ]
 },
 "js-intro-01-v18": {
  "s12": [
   "Bir xil amalni ko'p marta takrorlash uchun algoritmda nima ishlatamiz?",
   [
    "Shart (agar...bo'lsa)",
    "Sikl (takrorlash)",
    "Komponent (qism)",
    "Bog'lanish (aloqa)"
   ]
  ],
  "s4": [
   "Sistema nima?",
   [
    "Bo'linmaydigan, ichki qismlari yo'q yaxlit bir narsa",
    "Birga ishlaydigan komponentlar va ularning bog'lanishlari",
    "Bir-biriga hech qanday aloqasi yo'q tasodifiy narsalar",
    "Faqat kompyuterga tegishli, boshqa hech narsa emas"
   ]
  ],
  "s5b": [
   "Sistemada 'bog'lanish' nima?",
   [
    "Qismlar bir-biriga ta'sir o'tkazadigan yo'l",
    "Sistemadagi eng katta va asosiy komponent",
    "Butun sistemaga berilgan umumiy bitta nom",
    "Rejasiz yuz beradigan tasodifiy hodisa"
   ]
  ],
  "s9": [
   "'AGAR yomg'ir bo'lsa, soyabon ol' — algoritmda bu qanday qism?",
   [
    "Sikl (takrorlash)",
    "Shart (agar...bo'lsa)",
    "Komponent (qism)",
    "Bog'lanish (aloqa)"
   ]
  ]
 },
 "js-loops-01-v18": {
  "s12": [
   "friends massivida 5 ta nom bor. for (i=0; i<friends.length; i++) sikli necha marta ishlaydi?",
   [
    "4 marta",
    "5 marta",
    "6 marta",
    "Cheksiz"
   ]
  ],
  "s4": [
   "for siklida 'i++' nima vazifani bajaradi?",
   [
    "Siklni boshlang'ich qiymatini belgilaydi",
    "Har aylanishdan keyin i ni 1 ga oshiradi",
    "Siklni butunlay to'xtatib qo'yadi",
    "Yangi massiv yaratadi"
   ]
  ],
  "s9": [
   "fruits = ['olma','banan','uzum']. fruits[0] nima?",
   [
    "\"banan\"",
    "\"olma\"",
    "Xato — [0] yo'q",
    "\"uzum\""
   ]
  ]
 },
 "js-vars-01-v18": {
  "s12": [
   "Qaysi biri SON (number)?",
   [
    "\"25\"",
    "25",
    "\"yigirma\"",
    "true"
   ]
  ],
  "s4": [
   "O'zgaruvchi (variable) nima?",
   [
    "Qiymat saqlaydigan nomlangan \"quti\"",
    "Sonlar ustida hisob-kitob amali",
    "Brauzerda ochiladigan sahifa",
    "Ekranda ko'rinadigan rang turi"
   ]
  ],
  "s5b": [
   "Qiymati keyin o'zgaradigan o'zgaruvchini qaysi so'z bilan ochamiz?",
   [
    "const",
    "let",
    "number",
    "print"
   ]
  ],
  "s9": [
   "Tug'ilgan yilingiz kabi o'zgarmas qiymat uchun qaysi so'zni ishlatasiz?",
   [
    "let",
    "var",
    "const",
    "box"
   ]
  ]
 },
 "netlify-deploy-v19": {
  "s12": [
   "Do'stingiz saytingizni telefonida ochishi uchun unga nima yuborasiz?",
   [
    "`index.html` faylini",
    "Sayt papkasini arxiv qilib",
    "GitHub parolimni",
    "Netlify bergan linkni"
   ]
  ],
  "s2": [
   "Netlify nima qiladi?",
   [
    "Sayt papkangizni internetda saqlaydi va link beradi",
    "Kodni chiroyli ranglar bilan bezaydi",
    "Internet tezligini oshiradi",
    "Telefonga o'yin o'rnatadi"
   ]
  ]
 },
 "node-server-04-03-v18": {
  "s12": [
   "app.listen(3000) nima qiladi?",
   [
    "Ishlab turgan serverni butunlay o'chirib qo'yadi",
    "Yangi endpoint (eshik) yaratib, unga javob beradi",
    "Saqlangan barcha ma'lumotni o'chirib tashlaydi",
    "Serverni yoqadi va 3000-portda so'rov kuta boshlaydi"
   ]
  ],
  "s4": [
   "Node.js nima imkon beradi?",
   [
    "JavaScript'ni brauzerdan tashqarida, serverda ishlatish",
    "Faqat HTML sahifalarni chiroyli qilib yozish uchun kerak",
    "Internet tezligini oshirib, barcha saytlarni tezlatadi",
    "Rasm va videolarni tahrirlash imkonini beradi"
   ]
  ],
  "s5b": [
   "npm nima qiladi?",
   [
    "Ishlab turgan serverni butunlay o'chirib qo'yadi",
    "Tayyor paketlarni o'rnatadi, masalan express",
    "Yozib qo'ygan barcha kodingizni o'chirib tashlaydi",
    "Kompyuterni internetga ulab, aloqa o'rnatadi"
   ]
  ],
  "s9": [
   "Endpoint nima?",
   [
    "Serverni butunlay o'chirib-yoquvchi maxsus qizil tugma",
    "Barcha ma'lumotlarni saqlab turadigan katta ombor baza",
    "Serverning aniq manzili (eshik) — bir so'rovga javob beradi",
    "Brauzerning bir turi yoki eng so'nggi yangi versiyasi"
   ]
  ]
 },
 "pean-stack-01-v18": {
  "s4": [
   "Saytning foydalanuvchi ko'radigan va bosadigan qismi nima deb ataladi?",
   [
    "Backend",
    "Frontend",
    "Baza (database)",
    "Server"
   ]
  ],
  "s5b": [
   "Node.js nima qiladi?",
   [
    "Sahifani bezaydi (`CSS` kabi)",
    "`JavaScript`'ni serverda ishlatadi",
    "Rasmlarni tahrirlab beradi",
    "Internet tezligini oshiradi"
   ]
  ],
  "s9": [
   "Like, izoh va boshqa ma'lumotlar doimiy qayerda saqlanadi?",
   [
    "Brauzerda",
    "Telefon ekranida",
    "`PostgreSQL` bazasida",
    "`CSS` faylida"
   ]
  ]
 },
 "pg-crud-04-05-v18": {
  "s12": [
   "AI siz uchun SQL yozib bersa, eng to'g'ri yo'l qaysi?",
   [
    "Ko'rmasdan darrov ishga tushiraman",
    "Kodni o'qib, tekshirib, keyin ishlataman",
    "AI har doim to'g'ri yozadi — tekshirish shart emas",
    "O'chirib, hammasini qo'lda qaytadan yozaman"
   ]
  ],
  "s5b": [
   "SELECT buyrug'i nima qiladi?",
   [
    "Jadvalni butunlay o'chiradi",
    "Ustundagi narxlarni o'zgartiradi",
    "Ma'lumotni o'qib ko'rsatadi",
    "Yangi bo'sh jadval yaratadi"
   ]
  ]
 },
 "pm-m2d13-v2": {
  "s5": [
   "Pitchingizni eshitgan do'kon egasi «tushunmadim» dedi. Birinchi navbatda nimani tekshirasiz?",
   [
    "Gaplaringiz orasida faqat kod yozadigan odamlar biladigan so'zlar qolganini.",
    "Ovozingiz yetarlicha baland chiqqanini.",
    "Nutqingiz necha daqiqa davom etganini.",
    "Saytning rangi do'konga mos kelishini."
   ]
  ]
 },
 "pm-m3d10-v1": {
  "s11": [
   "Qaysi shartni tekshirib bo'ladi",
   [
    "Sayt chiroyli va zamonaviy ko'rinib turadi",
    "Bo'sh buyurtma yuborilsa, xabar chiqadi",
    "Odamlarga qulay va tushunarli bo'ladi"
   ]
  ],
  "s3": [
   "«Ishlaydi» nimani anglatadi",
   [
    "Hamma shart bajarilgan — ishni bemalol qabul qilsa bo'ladi",
    "Bitta yo'l tekshirilgan — hammasi to'g'ri kiritilganda",
    "Kodda birorta ham xato qolmagan — hammasi joyida"
   ]
  ],
  "s5": [
   "Uch shart bajarilmasa ish qabul qilinadimi",
   [
    "Ha — eng muhim shart bajarilgan",
    "Yo'q — AI hali kodni oxirigacha yozmagan",
    "Yo'q — hamma shart bajarilishi kerak"
   ]
  ],
  "s7": [
   "Nosoz o'yin eng ko'p nimani yo'qotdi",
   [
    "Odamlarning ishonchi yo'qoldi",
    "Boshqa o'yinlar sotuvi tushdi",
    "Yangi o'yinlar keyinga surildi"
   ]
  ]
 },
 "pm-m3d14-v1": {
  "s11": [
   "Bosiladigan joy qanday tanlanadi",
   [
    "Sahifada birinchi ko'ringan joy tanlanadi",
    "Ish chindan bajariladigan joy tanlanadi",
    "Eng chiroyli ko'ringan sahifa tanlanadi"
   ]
  ],
  "s5": [
   "Qaysi gap hech narsa qo'shmaydi",
   [
    "Ilgari bo'sh soatni guruhda so'rardik",
    "Mana, hozir bosdim — ro'yxatga tushdi",
    "Pastda bandlar ro'yxati turibdi"
   ]
  ]
 },
 "pm-m3d2-v3": {
  "s7": [
   "Hikoya 1: qizil tugma",
   [
    "KIM bo'lagi — foydalanuvchi turi",
    "NIMA bo'lagi — harakat",
    "NATIJA bo'lagi — real foyda"
   ]
  ],
  "s8": [
   "Hikoya 2: saytga kirish",
   [
    "Men mehmon sifatida",
    "saytga kirishni xohlayman",
    "saytga kirish uchun"
   ]
  ],
  "s9": [
   "Dark mode gapi: baho",
   [
    "Tayyor User Story — o'zgartirish shart emas",
    "Imkoniyat-so'rovi (feature request) — hali hikoya emas",
    "JTBD misoli — milkshake'dagi kabi «natija»"
   ]
  ]
 },
 "pm-m3d5-v1": {
  "s11": [
   "Vaqt teng bo'lsa qaysi ish birinchi",
   [
    "Ko'proq odam so'ragani",
    "Ro'yxatda yuqorida turgani",
    "Qilish qiziqroq bo'lgani"
   ]
  ],
  "s3": [
   "Ikki ishni qaysi savol ajratadi",
   [
    "Ishning qancha vaqt olishi",
    "Ishni kim birinchi so'ragani",
    "Ishning chiroyli ko'rinishi"
   ]
  ],
  "s5": [
   "Bo'sh joylar ishining katagi",
   [
    "🎯 Darrov qilinadi",
    "🏔 Rejaga tushadi",
    "🌱 Vaqt bo'lsa"
   ]
  ],
  "s7": [
   "Stories nega Instagram'da ko'proq ishlatildi",
   [
    "Instagram uni chiroyliroq qilib chiqargan",
    "Instagram'da reklama ko'proq ko'rsatilgan",
    "Instagram'da allaqachon odam ko'p edi"
   ]
  ]
 },
 "pm-m4a2-v1": {
  "s11": [
   "Qaysi qismni birinchi kundan kuchaytirishga arziydi",
   [
    "Saytning hamma qismini birga",
    "Hamma birdan talashadigan qismni",
    "Odam talashmasdan ko'radigan qismni"
   ]
  ],
  "s3": [
   "Qaysi kuni yuk og'ir bo'ldi",
   [
    "Hammasi kun bo'yi tarqalib kirgan kuni",
    "Hammasi 10:00 da kirgan kuni",
    "Ikkala kuni ham bir xil bo'lgan"
   ]
  ],
  "s5": [
   "Hamma birdan kirdi, qaysi qism birinchi sinadi",
   [
    "Hamma bitta narsani talashadigan qism",
    "Hamma talashmasdan bir xil sahifa ko'radigan qism",
    "Har kim har xil vaqtda ochadigan qism"
   ]
  ],
  "s7": [
   "Uzum ochilgan kuni nimasi tayyor edi",
   [
    "Chegirmalar va reklama roliklari",
    "Boshqa kompaniyalarning mashinalari",
    "Mashinalari va topshirish punktlari"
   ]
  ]
 },
 "pm-m4b2-v1": {
  "s11": [
   "Uch nosozlikdan qaysi biri birinchi tuzatiladi",
   [
    "Hammada: ilova ochilganda oq ekran chiqadi",
    "Hammada: safar cheki mayda, o'qish qiyin",
    "Ba'zilarda: eski telefonda xarita sekin ochiladi"
   ]
  ],
  "s3": [
   "Uch holatdan qaysi biri nosozlik",
   [
    "Ilova har ochilganda reklama ko'rsatadi",
    "Ilova naqd pulni olmaydi — faqat karta",
    "QR skanerlandi, skuter qulfi ochilmadi"
   ]
  ],
  "s5": [
   "Kod yozilayotganda tutilgan nosozlikdan keyin ilovaga nima bo'ladi",
   [
    "Hech kim sezmaydi — o'sha kuni tuzatiladi",
    "Sharhlarda odamlar shikoyat yoza boshlaydi",
    "Chiqarish bir necha kunga surilib ketadi"
   ]
  ],
  "s7": [
   "Cyberpunk nosozliklari qachon tutilsa eng arzon",
   [
    "Sony o'yinni do'kondan olib tashlagan kuni",
    "O'yin sotuvga chiqarilishidan oldin",
    "Birinchi sharhlar chiqqanidan bir kun oldin"
   ]
  ]
 },
 "pm-m4c2-v1": {
  "s11": [
   "Uch haftalik katta ishni qanday chiqarasiz",
   [
    "Uch hafta yasab, odamlarga hammasini birdan",
    "Har hafta odam ishlata oladigan bo'lakni",
    "Birinchi haftada eng katta bo'lakni chiqarib"
   ]
  ],
  "s3": [
   "Faqat o'z kompyuterida ishlagan tugma reliz bo'ldimi",
   [
    "Ha — kod tayyor bo'ldi, demak reliz",
    "Yo'q — odamlar hali ishlata olmaydi",
    "Yo'q — odamlarga bu o'zgarish kichkina"
   ]
  ],
  "s5": [
   "Odamlarga nima kerakligini eng erta qachon bilasiz",
   [
    "Birinchi bo'lakni odamlar ishlatgan kuni",
    "Uchala bo'lakni rejaga yozib chiqqan kuni",
    "Kod o'z kompyuteringizda ishlab turgan kuni"
   ]
  ],
  "s7": [
   "Reaksiya, stiker, kanal boshqa yozishuv ilovalarida qachon paydo bo'ldi",
   [
    "Telegramdan bir necha yil oldin",
    "Telegramdan bir necha yil keyin",
    "Telegram bilan bir kunda, birga"
   ]
  ]
 },
 "pm-m4c6-v1": {
  "s11": [
   "0,5 soniya chegarada kun bo'yi kelgan xabarlar qanday bo'ladi",
   [
    "Kam va aniq — har biri odam sezgan payt",
    "Ko'p — ko'pini hech kim sezmaydi",
    "Umuman kelmaydi — chegara juda baland"
   ]
  ],
  "s3": [
   "O'lchagichsiz sayt ochilmay qolganini kim bildi",
   [
    "Ertalab saytga kirgan siz",
    "O'sha paytda saytga kirgan odamlar",
    "Kodni chiqarishdan oldin tekshirgan lenta"
   ]
  ],
  "s5": [
   "Sahifa 8 soniyada ochilganda kirgan odam nima qildi",
   [
    "Kutib turolmadi — sahifani yopib ketdi",
    "Hech narsa sezmadi — sahifani odatdagidek o'qidi",
    "Xato yozuvini ko'rdi — sahifani qayta yukladi"
   ]
  ],
  "s7": [
   "Ikki qatorning qaysi birida xato bor",
   [
    "200 turgan qatorda — u sekinroq keldi",
    "Ikkalasida ham — vaqtlari har xil",
    "404 turgan qatorda — sahifa topilmadi"
   ]
  ]
 },
 "pm-m4d12-v1": {
  "s11": [
   "Hech qaysi gapga ulanmagan ustun nima qilinadi",
   [
    "Ustun bo'sh holida qoldiriladi",
    "Ustun sxemadan olib tashlanadi",
    "Ustun zaxira uchun saqlab turiladi"
   ]
  ],
  "s3": [
   "Ilova kim band qilganini ko'rsatishi uchun nima kerak",
   [
    "Sxemada bu ma'lumot uchun ustun bo'lishi",
    "Kutubxonachining sxemaga qarab turishi",
    "Kitobga «band» yorlig'i yopishtirilishi"
   ]
  ],
  "s5": [
   "Sxemaga yangi ustun qachon qo'shiladi",
   [
    "AI e'londa yo'q ustunni qo'shganda",
    "E'londagi bitta gap ustunsiz qolganda",
    "Kutubxonachi qo'shishni so'raganda"
   ]
  ],
  "s7": [
   "Amazon jamoasi kodni qachon yoza boshlaydi",
   [
    "G'oya aytilgan kunning o'zidayoq",
    "E'lon yozilishidan oldin",
    "E'lon odamlarni qiziqtirgach"
   ]
  ]
 },
 "pm-m4d15-v1": {
  "s11": [
   "Texnik qarorning sababi qanday aytiladi",
   [
    "Qaror odamga nima berishi aytiladi",
    "Qavat nomlari birma-bir sanab beriladi",
    "Odamga kod qatorlari ochib ko'rsatiladi"
   ]
  ],
  "s5": [
   "Telefon o'chganda band joylarni qaysi qavat ushlab qoladi",
   [
    "Yuqori qavat — sahifa",
    "O'rta qavat — server",
    "Pastki qavat — baza"
   ]
  ]
 },
 "pm-m4d2-v1": {
  "s11": [
   "Qaysi maydonni saqlashga arziydi",
   [
    "Telefondagi kontaktlar ro'yxati",
    "Qo'shiq oxirigacha tinglandimi",
    "Qo'shiq qayerda tinglandi"
   ]
  ],
  "s3": [
   "Ilova keyin yana nimani ko'rsata oladi",
   [
    "Bir marta ko'rilgan hamma narsani",
    "Eslab qolgan ma'lumotini",
    "Foydalanuvchi so'ragan hamma narsani"
   ]
  ],
  "s5": [
   "Kontaktlar saqlandi, lekin ilovada hech narsa o'zgarmadi — nega",
   [
    "Chunki bu ma'lumotdan foydali bo'lim chiqmaydi",
    "Chunki ilova buzilgan",
    "Chunki keyinroq o'zi ishlay boshlaydi"
   ]
  ],
  "s7": [
   "Netflix bosh sahifasi nimadan yig'iladi",
   [
    "Har kim ilgari ko'rgan kinolardan",
    "Eng ko'p pul ishlagan kinolardan",
    "Hamma uchun tuzilgan bitta ro'yxatdan"
   ]
  ]
 },
 "pm-m4d7-v1": {
  "s11": [
   "Parolni qaysi joydan olib tashlash kerak",
   [
    "Faqat egasi biladigan joydan",
    "Ota-onaga ketadigan xabardan",
    "Ilova so'raydigan kirish maydonidan"
   ]
  ],
  "s3": [
   "Ma'lumot qachon yopiq hisoblanadi",
   [
    "Uni yozish uchun ko'p vaqt ketganda",
    "Begona odam ko'rsa, egasi zarar ko'rganda",
    "Uni ilovada juda kam odam ochganda"
   ]
  ],
  "s5": [
   "Ism va sinf nega ochiq qoladi",
   [
    "Ular baho va paroldan kamroq joy oladi",
    "Ularni ko'rgan odam hech kimga zarar bermaydi",
    "Ular yopilsa, ilova sekin ishlab qoladi"
   ]
  ],
  "s7": [
   "Ilova nimani yig'ishini odam eng erta qachon o'qiy oladi",
   [
    "Ilovani yuklashdan oldin ham",
    "Bir oy foydalangandan keyin",
    "Ma'lumoti tarqalib ketganda"
   ]
  ]
 },
 "pm-m5d11-v1": {
  "s11": [
   "Chorshanba kuni 15 odam keldi, ulardan 4 tasi seshanba ham kelgan edi. Hisobga nimani yozasiz?",
   [
    "Chorshanba: keldi 15, qaytdi 11",
    "Chorshanba: keldi 15, qaytdi 4",
    "Chorshanba: keldi 19, qaytdi 4"
   ]
  ],
  "s3": [
   "Seshanba kuni 5 odam keldi, ulardan 3 tasi dushanba ham kelgan edi. Kim qaytgan?",
   [
    "Seshanbada kelgan besh odamning barchasi",
    "Dushanba ham, seshanba ham kelgan uch odam",
    "Dushanba kelmay, seshanba kelgan ikki odam"
   ]
  ],
  "s5": [
   "E'lon kuni 23 odam keldi, ertasiga ulardan 5 tasi qaytdi. Bu nimani ko'rsatadi?",
   [
    "Ko'p odam kelgani ko'p qaytishini bildirmaydi",
    "E'lon qaytganlar sonini ham shuncha ko'taradi",
    "Kelganlar soni ertasiga ham 23 ta bo'ladi"
   ]
  ],
  "s7": [
   "Duolingo'dagi olov belgili raqam o'sishi uchun odam nima qilishi kerak?",
   [
    "Bir kunda bir nechta dars qilishi",
    "Bir haftada bir marta dars qilishi",
    "Kun tashlamay dars qilishi"
   ]
  ]
 },
 "pm-m5d2-v1": {
  "s11": [
   "900 notanish odamga yuborilgan linkdan ertasiga nechta odam botni ishlatadi",
   [
    "Yigirmatadan ko'p — linkni ochadigan odam ko'p chiqadi",
    "Bir-ikki odam — ochganlar ham ishlatmay qo'yadi",
    "Hech kim — bunday linkni odamlar ochmaydi"
   ]
  ],
  "s3": [
   "Hech kimga aytilmagan bot bir haftada nechta odam oldi",
   [
    "Bir nechta — Telegram botni o'zi ko'rsatadi",
    "Hech kim — uni topadigan odam bo'lmadi",
    "Ko'p — bot qidiruvda birinchi chiqadi"
   ]
  ],
  "s5": [
   "Bot linki 15 tanish va 500 notanishga yuborilsa, botga ko'proq odam qaysi tomondan keladi",
   [
    "O'n beshtasidan — ular linkni yonidagilarga ko'rsatadi",
    "Besh yuztasidan — linkni ko'rgan odam ko'proq bo'ladi",
    "Ikkalasidan teng — link ikkalasiga ham yetib bordi"
   ]
  ],
  "s7": [
   "Sayt bitta universitetda nega tez tarqaldi",
   [
    "Saytda odam soni ko'p edi: butun shahar yozila olardi",
    "Sayt birinchi kundan butun dunyo uchun ochiq turardi",
    "Yangilik ertasiga darsda yonma-yon o'tirganlarga yetardi"
   ]
  ]
 },
 "pm-m5d8-v1": {
  "s11": [
   "Suhbatdoshning gapidan qaysi qator varaqqa tushadi",
   [
    "Botdagi tugmalarni ko'zga ko'rinadigan joyga qayta qo'yish kerak",
    "Kecha kechqurun botni ochdim, lekin tugmani topolmay chiqib ketdim",
    "Odamlar kechqurun botni ochadi, lekin tugmani topolmay chiqib ketadi"
   ]
  ],
  "s3": [
   "«Zo'r ekan» degan gapdan botingiz haqida nimani bilib oldingiz",
   [
    "Botda hamma narsa joyida ekanini — o'zgartirish shart emas",
    "Hech narsani — u botda qilgan biror ishini aytmadi",
    "Botni ishlatib ko'rganini — shuning uchun maqtadi"
   ]
  ],
  "s5": [
   "«Kelasi haftadan boshlab botni ishlatasizmi?» savoliga qanday javob keladi",
   [
    "Hali bo'lmagan ish haqida va'da",
    "Bo'lib o'tgan ish haqida hikoya",
    "Kuni va soati aytilgan voqea"
   ]
  ],
  "s7": [
   "Asoschilar uy egalarining oldiga borib nimani bilib oldi",
   [
    "Uy egalari narxni juda baland qo'yib yuborganini",
    "Uy egalari saytga kam kirib turishini",
    "Yomon surat qo'yilgan uy band qilinmasligini"
   ]
  ]
 },
 "pm-m6d12-v1": {
  "s11": [
   "Ishni qaysi ufqqa qo'yishni nima hal qiladi",
   [
    "Ishni bajarish qancha vaqt olishi",
    "Unga kerak narsa qachon tayyor bo'lishi",
    "Qancha odam so'rab turgani",
    "Qaysi ishni o'zimiz ko'proq xohlashimiz"
   ]
  ],
  "s3": [
   "Ish eng uzoq ufqqa tushsa, bu nimani bildiradi",
   [
    "Ish olti oy davom etadi",
    "Ish olti oydan keyin boshlanadi",
    "Ish olti oydan keyin tugaydi",
    "Ish boshqa ishlardan kam muhim"
   ]
  ],
  "s5": [
   "Sartaroshga baho qo'yish nega bugun boshlanmaydi",
   [
    "Boshqa ishlar undan oldin qilinishi kerak",
    "Uni kutayotgan odam juda kam bo'lgan",
    "Unga kerak narsa hali paydo bo'lmagan",
    "Uni qilish uchun juda ko'p vaqt ketadi"
   ]
  ],
  "s7": [
   "Tesla misolida uzoq rejaning asosiy xususiyati nima",
   [
    "Bosqichlar ketma-ket, har biri oldingisiga tayanadi",
    "Hamma bosqich bir vaqtning o'zida boshlanadi",
    "Reja har oy boshidan qaytadan yoziladi",
    "Reja yopiq: uni faqat kompaniya ichidagilar biladi"
   ]
  ]
 },
 "pm-m6d14-v1": {
  "s11": [
   "Sahnaga chiqadigan raqam qanday tanlanadi",
   [
    "Sahnada eng katta ko'rinadigani tanlanadi",
    "Foydalanuvchi olgan natijani sanagani tanlanadi",
    "Qurishga eng ko'p vaqt ketgani tanlanadi",
    "Tizimga yozilgan kod satrlarini sanagani tanlanadi"
   ]
  ],
  "s3": [
   "To'rt raqamdan qaysi biri tizim foydalanuvchiga bergan natijani ko'rsatadi",
   [
    "Uch odam tizimni qurishda qatnashdi",
    "Uch odamning arizasi oxirigacha ko'rib chiqildi",
    "Uch hafta ariza formasiga sarflandi",
    "Uch sahifa ariza formasi uchun alohida chizildi"
   ]
  ],
  "s5": [
   "Slaydda raqam va sanagani turibdi — odam yana nimani bilishi kerak",
   [
    "Bu raqam siz haqingizda nima deyishini",
    "Bu raqamni tizim qanday sanaganini",
    "Bu raqam tizim haqida nimani ko'rsatishini",
    "Bu raqam boshqa jamoalarnikidan katta ekanini"
   ]
  ],
  "s7": [
   "Airbnb varag'idagi raqam qiyinchilik haqida nimani ko'rsatgan",
   [
    "Qiyinchilik qancha odamda borligini",
    "Qiyinchilik qanchalik qiyinligini",
    "Qiyinchilik ustida qancha odam ishlaganini",
    "Qiyinchilik qancha vaqtdan beri borligini"
   ]
  ]
 },
 "pm-m6d2-v1": {
  "s11": [
   "Kim katagi bo'sh qolsa natijada nima bo'ladi",
   [
    "Ish to'xtaydi, kod umuman yozilmaydi",
    "Kim uchun qurishni AI o'zi taxmin qiladi",
    "Qolgan uch katak ham bekor bo'ladi",
    "Ilova baribir hamma odamlarga mos keladi"
   ]
  ],
  "s3": [
   "Og'zaki aytilgan gapdan keyin birinchi nima qilasiz",
   [
    "Eshitganimni yodda saqlab, kod yozaman",
    "Eshitganimni qatorga yozib olaman",
    "Qatorni ish tugagach yozib qo'yaman",
    "AI'ga eslab qolganimcha yozaman"
   ]
  ],
  "s5": [
   "«Natijani qaysi sondan bilamiz?» katagiga qaysi qator yoziladi",
   [
    "Kunda 30 odam joy band qiladi",
    "Uch murabbiy ham ilovadan mamnun",
    "Ilova ikki barobar qulay bo'ladi",
    "Ilova hammaga yoqib qoladi"
   ]
  ],
  "s7": [
   "Til nega birinchi urinishdayoq ishladi",
   [
    "Ular Altairni oldindan sinab ko'rgan edi",
    "Kompaniya tayyor tilni ularga bergan edi",
    "Nima va qaysi kompyuter uchun qurishni aniq bilishgan",
    "Ular tilni bir necha yil davomida puxta yozib chiqishgan"
   ]
  ]
 },
 "pm-m6d6-v1": {
  "s11": [
   "Do'kon egasi hamma ishga chegara qo'ydi, endi nima bo'ladi",
   [
    "Xatolar kamayadi, ish tezligi esa o'zgarmaydi",
    "Har ish do'kon egasi o'qiguncha turib qoladi",
    "Do'kon egasi faqat eng muhim ishlarni o'qiydi",
    "Mijozlar javobni avvalgidan tezroq oladi"
   ]
  ],
  "s3": [
   "Uchala do'konda ham mijozga AI javob yozadi, qaysi birida chegara bor",
   [
    "Javobni AI yozib, o'zi yuboradigan do'konda",
    "Javobni AI yozib, egasi yuboradigan do'konda",
    "Javobni AI ikki marta yozadigan do'konda",
    "Javobni AI yozib, o'zi tekshiradigan do'konda"
   ]
  ],
  "s5": [
   "Chegara birinchi navbatda qaysi ishga kerak bo'ladi",
   [
    "Ilova mijozdan so'rab qiladigan ishga",
    "Do'kon egasi o'zi qo'lda qiladigan ishga",
    "Ilova so'ramay, o'zi qiladigan ishga",
    "Ilova hisobot yig'adigan ishga"
   ]
  ],
  "s7": [
   "AI tavsif yozdi, chegara qaysi ikki qadam orasiga qo'yiladi",
   [
    "Yozilgandan keyin, saytga chiqishdan oldin",
    "Saytga chiqqandan keyin, mijoz o'qishidan oldin",
    "Mijoz o'qigandan keyin, buyurtma berishdan oldin",
    "Rasm qo'yilgach, AI yozishidan oldin"
   ]
  ]
 },
 "practice-02-ai-promo-v18": {
  "s7": [
   "O'yin promo sahifasi uchun qaysi so'rov eng aniq?",
   [
    "«Menga biror sayt qilib ber, chiroyli bo'lsin»",
    "«Ko'k, zamonaviy o'yin sahifasi: tugma va 3 karta»",
    "«Chiroyli, zamonaviy va yorqin sahifa qilib ber»",
    "«O'yin haqida sahifa kerak, hammasini o'zing tanla»"
   ]
  ]
 },
 "practice-03-decompose-v18": {
  "s4": [
   "MVP nima degani?",
   [
    "Eng kichik, lekin ishlaydigan versiya",
    "Eng chiroyli, jozibali dizayn",
    "Eng qimmat, murakkab funksiya",
    "Loyihaning oxirgi, tayyor varianti"
   ]
  ]
 },
 "react-api-get-05-v18": {
  "s12": [
   "Konsolda 404 xatosini ko'rsangiz, birinchi nimani tekshirasiz?",
   [
    "Manzilni — endpoint to'g'ri yozilganmi",
    "Kompyuterni o'chirib yoqaman",
    "React'ni qaytadan o'rnataman",
    "Hech narsani — o'zi tuzalib ketadi"
   ]
  ],
  "s4": [
   "fetch('https://robo-api.example/games') nima qiladi?",
   [
    "Saytni to'liq qaytadan yuklaydi",
    "Manzilga borib ma'lumotni olib keladi",
    "Faylni kompyuterga yuklab saqlaydi",
    "Yangi bo'sh sahifa ochadi"
   ]
  ],
  "s5b": [
   "Server javobini kodda ishlatishdan oldin nima qilamiz?",
   [
    "Hech narsa — javob darrov tayyor bo'ladi",
    "Javobni qaytadan serverga yuboramiz",
    ".json() bilan massivga aylantiramiz",
    "Ma'lumotni qo'lda ko'chirib yozamiz"
   ]
  ],
  "s9": [
   "Serverdan kelgan o'yinlar qanday qilib ekranga chiqadi?",
   [
    "Sahifani qo'lda yangilab turish kerak",
    "fetch o'zi ekranga chizib qo'yadi",
    "useEffect o'zi chizib beradi",
    "setGames state'ga yozadi — React qayta chizadi"
   ]
  ]
 },
 "react-api-post-06-v18": {
  "s12": [
   "Piggy (ID 3) ni o'chirish uchun to'g'ri so'rov qaysi?",
   [
    "DELETE /games/3",
    "DELETE /games — hammasiga yuboramiz",
    "POST /games/3",
    "GET /games/3"
   ]
  ],
  "s4": [
   "Serverga YANGI ma'lumot qo'shish uchun qaysi so'rov ishlatiladi?",
   [
    "GET — u hamma ishni qiladi",
    "POST — yangi yozuv yaratadi",
    "Sahifani yangilash kifoya",
    "DELETE — u yozuvni o'chiradi"
   ]
  ],
  "s5b": [
   "JSON.stringify(newGame) nima qiladi?",
   [
    "O'yinni darhol katalogga chizadi",
    "Obyektda xato bor-yo'qligini tekshiradi",
    "Obyektni JSON matnga aylantiradi",
    "Serverdan javob olib keladi"
   ]
  ],
  "s9": [
   "robo-api.example/games/7 — bu manzil nima degani?",
   [
    "7 ta o'yin olib keladi",
    "Katalogning 7-sahifasini ochadi",
    "7 soniya kutib turadi",
    "ID raqami 7 bo'lgan bitta o'yin"
   ]
  ]
 },
 "react-first-component-02-v18": {
  "s4": [
   "npm run dev buyrug'i nima qiladi?",
   [
    "Saytni internetga chiqarib e'lon qiladi",
    "Loyihani kompyuteringizda ishga tushiradi",
    "Koddagi xatolarni avtomatik tuzatadi",
    "React'ni loyihadan o'chirib tashlaydi"
   ]
  ],
  "s9": [
   "Props nima?",
   [
    "Komponentga uzatiladigan ma'lumot",
    "Komponentning tashqi rangi",
    "React'ni tezlashtiruvchi sozlama",
    "Brauzerga qo'shiladigan qo'shimcha dastur"
   ]
  ]
 },
 "react-intro-01-v18": {
  "s12": [
   "React Native nima imkon beradi?",
   [
    "Faqat kompyuter o'yinlarini yasash",
    "React bilimi bilan telefon ilovasi yasash",
    "Saytlarni rang bilan bezash",
    "Internetga simsiz ulanish"
   ]
  ],
  "s4": [
   "React aslida nima?",
   [
    "Yangi dasturlash tili",
    "JavaScript kutubxonasi",
    "Brauzer dasturining nomi",
    "Operatsion tizim turi"
   ]
  ],
  "s5b": [
   "Komponent nima?",
   [
    "Brauzerning ichki sozlamasi",
    "Internetni tezlashtiradigan dastur",
    "Sahifaning qayta ishlatiladigan bo'lagi",
    "Rasm va video fayllari turi"
   ]
  ],
  "s9": [
   "Virtual DOM nima qiladi?",
   [
    "Sahifani har safar to'liq qayta yuklaydi",
    "Internet ulanishini tezlashtiradi",
    "Kodni avtomatik o'zi yozib beradi",
    "Farqni topib, faqat o'zgargan joyni yangilaydi"
   ]
  ]
 },
 "react-props-reuse-04-v18": {
  "s12": [
   "GameCard o'ziga kelgan props.name'ni o'zgartira oladimi?",
   [
    "Ha — xohlagancha o'zgartiradi",
    "Yo'q — props faqat o'qiladi",
    "Faqat kichik harf bilan yozsa bo'ladi",
    "Faqat kechasi o'zgartiradi"
   ]
  ],
  "s4": [
   "App komponenti GameCard'ga ma'lumotni qanday uzatadi?",
   [
    "Atribut orqali: name=\"Doors\"",
    "Internet orqali yuboradi",
    "Fayl orqali saqlab beradi",
    "GameCard o'zi App'dan olib ketadi"
   ]
  ],
  "s5b": [
   "Props qaysi yo'nalishda oqadi?",
   [
    "Pastdan yuqoriga — boladan otaga",
    "Istalgan tomonga — yuqoriga ham, pastga ham",
    "Faqat yuqoridan pastga — otadan bolaga",
    "Props umuman oqmaydi — bir joyda turadi"
   ]
  ],
  "s9": [
   "Ro'yxatga yangi o'yin qo'shilsa nima bo'ladi?",
   [
    "Katalog kodini ham qayta yozish kerak",
    "Hech narsa — sayt eski holatda qoladi",
    "Butun katalog buzilib qoladi",
    "React yangi kartochkani o'zi chizadi"
   ]
  ]
 },
 "react-state-effect-03-v18": {
  "s12": [
   "State props'dan nimasi bilan farq qiladi?",
   [
    "Farqi yo'q — ikkalasi bir narsa",
    "State — o'z xotirasi; props — tashqaridan keladi",
    "State faqat sonlarni saqlay oladi",
    "Props ancha tezroq ishlaydi"
   ]
  ],
  "s4": [
   "useState(0) nima qaytaradi?",
   [
    "Faqat 0 sonini",
    "Juftlik: qiymat va yangilovchi funksiya",
    "Butunlay yangi komponent",
    "CSS uslublar klassini"
   ]
  ],
  "s5b": [
   "Ekranda yangi qiymat ko'rinishi uchun nima qilamiz?",
   [
    "likes = likes + 1 deb to'g'ridan-to'g'ri yozamiz",
    "Sahifani F5 tugmasi bilan yangilaymiz",
    "setLikes(likes + 1) chaqiramiz",
    "Brauzerni butunlay qayta o'rnatamiz"
   ]
  ],
  "s9": [
   "useEffect(() => {…}, []) — bo'sh massiv bilan qachon ishlaydi?",
   [
    "Har safar 👍 bosilganda",
    "Hech qachon ishlamaydi",
    "Komponent ekranga chiqqanda bir marta",
    "Faqat komponent o'chirilganda"
   ]
  ]
 },
 "vscode-start-01-v1": {
  "s11": [
   "style.css'dagi bezaklar sahifaga qaysi qator orqali ulanadi?",
   [
    "`<link rel=\"stylesheet\" href=\"style.css\">` — `head` ichida",
    "`<style src=\"style.css\">` — `body` ichida",
    "`<css file=\"style.css\">` — `head` ichida",
    "`<script href=\"style.css\">` — `body` oxirida"
   ]
  ],
  "s4": [
   "Loyihadagi fayllar ro'yxatini VS Code'ning qaysi paneli ko'rsatadi?",
   [
    "Terminal — pastdagi buyruq paneli",
    "Explorer — chapdagi fayllar paneli",
    "Extensions — qo'shimcha dasturlar paneli",
    "Status bar — pastki ko'k chiziq"
   ]
  ],
  "s8": [
   "Pastdagi «Go Live» tugmasi bosilganda nima bo'ladi?",
   [
    "Kod internetga chiqadi — hamma ko'ra oladi",
    "VS Code kodni tekshirib, xatolarni topadi",
    "HTML fayl brauzerda jonli ochiladi",
    "Fayl avtomatik saqlanib, yopiladi"
   ]
  ]
 }
};
