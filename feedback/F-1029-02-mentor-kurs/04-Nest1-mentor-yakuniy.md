# Nest-1 mentor darsi — yakuniy MD (koddan)

> **Manba-haqiqat — kod** (`src/mentor-kurs/parts/03–07`, ruscha `08-ru.jsx`). Bu fayl `dev/nest1-md.py` bilan avtomatik chiqarilgan — qo'lda tahrirlamang; kod o'zgarsa skriptni qayta yurgizing.
> Dars: «NestJS arxitekturasi: Module, Controller, Service» · ID `mentor-nest-01-arxitektura-v1` · 39 ekran · UZ + RU · platforma fayli `tayyor/NestArchMentorLesson.oz.jsx`.

---

## 1 · Siz Express'ni bilasiz. Endi Nest.  ← `Lesson` (`Screen1`)
- Kicker: `Kirish` · Eyebrow: Mentor kursi · NestJS
- Reja: Nega Nest · Uch bo'lak: Controller · Service · Module · Dependency Injection · cars route'larini quramiz · Buzamiz va xatoni o'qiymiz · Amaliyot (to'rt bo'lak) · O'quvchi darsini o'tish
1. **Express bilimingiz ustiga Nest qo'yamiz: u Express'ni bekor qilmaydi, tartib beradi**
   Ovoz: «Assalomu alaykum. Siz Express bilan server yozgansiz: route ochgansiz, so'rovni qabul qilgansiz, javob qaytargansiz. Bugun shu bilimingiz ustiga NestJS qo'yamiz. Nest Express'ni bekor qilmaydi, aksincha, uning ustiga tartib o'rnatadi.»
2. **Dars oxirida bo'sh papkadan ishlaydigan server qurib bo'lasiz**
   Ovoz: «Dars oxirida siz bo'sh papkadan boshlab mashinalar ro'yxatini qaytaradigan server qurasiz.»
3. **Nest xato xabarini o'qiy olasiz: qaysi klass, qaysi dependency yetishmayapti, qaysi fayl**
   Ovoz: «Nest'ning xato xabarlarini o'qiy olasiz: qaysi klassda xato, qaysi dependency yetishmayapti va qaysi faylni ochish kerak.»
4. **O'quvchi darsidagi har so'z nimani anglatishini bilib olasiz**
   Ovoz: «Va o'quvchi darsida qaysi so'z nimani anglatishini bilasiz.»
5. **Yetti bosqich. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi**
   Ovoz: «Dars yetti bosqichdan iborat. Shoshilmang: har ekranda ovozni o'chirish, ekranni boshidan eshitish va to'liq matnini o'qish mumkin. Ustoz gapirib bo'lgach, Davom tugmasi ochiladi. Bosing, boshlaymiz.»

---

## 2 · Express: tanish manzara va og'riq  ← `Lesson` (`Screen2`)
- Kicker: `1-bosqich · Nega Nest`
1. **Tanish manzara: butun Express server bitta `server.js` faylida**
   Ovoz: «Avval sizga tanish narsadan boshlaymiz, Express'dan. Mana tanish manzara: butun server bitta server js faylida.»
2. **`GET /cars` kelsa, mashinalar ro'yxatini qaytaramiz**
   Ovoz: «cars route'iga GET kelsa, ro'yxatni qaytaramiz.»
3. **`GET /cars/:id` kelsa, bitta mashinani qidiramiz, topilmasa 404**
   Ovoz: «cars path'idan keyin id kelsa, bittasini qidiramiz, topilmasa to'rt yuz to'rt.»
4. **`POST /cars` yangisini qo'shadi. Hammasi 20 qator — muammo yo'q**
   Ovoz: «POST kelsa, yangisini qo'shamiz. Hammasi yigirma qator, hammasi ko'z oldingizda. Bu bosqichda hech qanday muammo yo'q.»
5. **Loyiha o'sib 1240 qatorga yetdi (shartli misol) — login qayerdaligini qidirasiz**
   Ovoz: «Muammo loyiha o'sganda boshlanadi. Foydalanuvchilar qo'shildi, kirish va ro'yxatdan o'tish qo'shildi, buyurtmalar, to'lov, fayl yuklash. Mana shartli misol, haqiqiy loyiha emas: fayl ming ikki yuz qirq qator deylik. Login qayerda edi? Qidirasiz.»
6. **Xulosa: bitta route'da hamma ish — sinab bo'lmaydi, ikki kishi to'qnashadi. Nest shu og'riq uchun**
   Ovoz: «Xulosa: bitta route ichida ham so'rovni o'qish, ham tekshirish, ham bazaga yozish bor. Shu bo'lakni alohida sinab bo'lmaydi, chunki u route'dan ajralmagan. Ikki kishi bir faylda ishlasa, har kuni to'qnashuv. Siz buni his qilgansiz. Nest aynan shu og'riq uchun yaratilgan. O'quvchi darsi ham aynan shu misoldan boshlanadi.»

---

## 3 · Nest nima beradi: majburiy tartib  ← `Lesson` (`Screen3`)
- Kicker: `1-bosqich · Nega Nest`
1. **Express'da har jamoa papkalarni o'zicha bo'ladi — yangi odam qaytadan o'rganadi**
   Ovoz: «Xo'sh, og'riqni ko'rdik: hamma narsa bitta faylda. Tajribali Express dasturchi bunga nima qiladi? Faylni bo'ladi: routes papkasi, controllers papkasi, services papkasi. Lekin har jamoa buni o'zicha qiladi, yangi odam kelganda tartibni qaytadan o'rganadi.»
2. **Nest tartibni majburiy qiladi: uch bo'lak — Controller, Service, Module**
   Ovoz: «Nest shu tartibni majburiy va bir xil qiladi. U uchta bo'lakka nom beradi: Controller, Service, Module.»
3. **Har Nest loyihasida bo'laklar bir joyda, bir nomda — Toshkentda yozilganini Berlin bir daqiqada tushunadi**
   Ovoz: «Har Nest loyihasida ular bir xil joyda, bir xil nomda turadi. Shuning uchun Toshkentdagi jamoa yozgan loyihani Berlindagi dasturchi ochsa, qayerda nima turganini bir daqiqada topadi.»
4. **Xulosa: Nest ichida o'sha Express ishlaydi — bilganingiz bekor bo'lmaydi, ustiga tartib qo'shiladi**
   Ovoz: «Xulosa va muhim fakt: Nest ichida o'sha Express ishlaydi. So'rovni haqiqatda Express qabul qiladi, Nest esa uni to'g'ri bo'lakka yo'naltiradi. Demak siz bilgan hech narsa bekor bo'lmaydi.»

---

## 4 · TypeScript va decorator: @ belgisi  ← `Lesson` (`Screen4`)
- Kicker: `1-bosqich · Nega Nest`
1. **TypeScript — tiplari bor JavaScript: JavaScript bilsangiz, o'qiy olasiz**
   Ovoz: «Nest kodini ochishdan oldin bitta yangi narsani bilib olaylik, aks holda kod sizga begona ko'rinadi. Nest loyihalari TypeScript'da yoziladi. TypeScript bu JavaScript'ning o'zi, faqat tiplari bor: string, number va shunga o'xshash. Siz JavaScript bilsangiz, TypeScript'ni o'qiy olasiz.»
2. **Yangi narsa: @ (kuchukcha) bilan boshlanadigan satr — decorator**
   Ovoz: «Lekin bitta yangi narsa bor, u bilan ko'p uchrashasiz: kuchukcha belgisi bilan boshlanadigan satrlar. Masalan, Controller decorator'i, qavsda cars. Bu decorator deyiladi.»
3. **Decorator Nest'ga aytadi: bu klass Controller, bu metod GET'ni qabul qiladi**
   Ovoz: «Decorator klass yoki metodning tepasiga yoziladi va Nest'ga xabar beradi: bu klass Controller, uning path'i cars. Get decorator'i esa metod ustida turadi: GET so'rov kelsa, shu metod.»
4. **Xulosa: decorator kod bajarmaydi, belgi qo'yadi — belgi yo'q bo'lsa, Nest klassni tanimaydi**
   Ovoz: «Xulosa: decorator kodni bajarmaydi, u belgi qo'yadi. Nest ishga tushganda shu belgilarni o'qib, hamma bo'lakni joyiga qo'yadi. Shuni eslab qoling: decorator yo'q bo'lsa, Nest o'sha klassni tanimaydi. Beshinchi bosqichda buni ataylab buzib, xatosini ham ko'ramiz.»

---

## 5 · Tirik loyiha: nest new nimani yaratdi  ← `Lesson` (`Screen5a`)
- Kicker: `2-bosqich · Uch bo'lak`
1. **`nest new cars-api` yaratgan loyiha: src ichida to'rtta asosiy fayl**
   Ovoz: «Endi tayyorsiz: decorator'ni bilasiz, uch bo'lakning nomini bilasiz. Haqiqiy loyihaga qaraymiz. nest new cars-api buyrug'i mana shu papka va fayllarni yaratdi, xuddi VS Code'ning chap panelida ko'rganingizdek. Bizga kerakli hamma narsa src papkasida: to'rtta asosiy fayl.»
2. **main.ts ilovani ishga tushiradi — boshqa hech narsa qilmaydi**
   Ovoz: «main ts: ilovani ishga tushiradi, boshqa hech narsa qilmaydi.»
3. **app.module.ts — ro'yxat: Nest shunga qarab hamma narsani yig'adi**
   Ovoz: «app module ts: ro'yxat. Nest shu ro'yxatga qarab hamma narsani yig'adi.»
4. **app.controller.ts so'rovni qabul qiladi va javobni qaytaradi**
   Ovoz: «app controller ts: so'rovni qabul qiladi va javobni qaytaradi.»
5. **app.service.ts ishni bajaradi; spec fayllar — avtomatik test, bugun tegmaymiz**
   Ovoz: «app service ts: ishni bajaradi. spec bilan tugaydigan fayllar avtomatik testlar, ularni Jest ishga tushiradi. Bugun ularga tegmaymiz. package json'da npm buyruqlari turadi, start dev ham shu yerda.»
6. **Xulosa: uch bo'lak, uch rang — ko'k Controller · yashil Service · sariq Module**
   Ovoz: «Xulosa: loyihada uch turdagi bo'lak bor, har biri o'z faylida. Uchta rangni eslab qoling: ko'k Controller, yashil Service, sariq Module. Dars davomida har kod yonida shu Explorer turadi va qaysi faylda ekaningizni ko'rsatib boradi. Keyingi ekranda siz ham shu loyihani o'zingizda yaratib qo'yasiz.»

---

## 6 · Nest'ni o'rnating, loyihani boshlab qo'ying  ← `Practice` (`ScreenP0`)
- Kicker: `Amaliyot 1 / 4` · Eyebrow: Hozir o'zingizda · 3–5 daqiqa (o'rnatish fonda)
1. **Endi siz: Nest'ni o'rnatib, loyihani yaratishni boshlab qo'yasiz**
   Ovoz: «Endi navbat sizga. Hozirgina ko'rgan loyihani o'zingizda yaratib qo'yasiz: uchta qadam. O'rnatish bir-uch daqiqa oladi, kutmaysiz, Davom bosib darsni davom ettirasiz, loyiha fonda o'rnatiladi.»
2. **1-qadam: Node versiyasi 20 yoki undan yuqori bo'lishi shart**
   Ovoz: «Birinchi: node versiyasini tekshiring. Nest o'n birinchi versiya Node yigirma yoki undan yuqorisini talab qiladi. Past bo'lsa, jadvaldagi yo'l bilan yangilang.»
3. **2-qadam: Nest CLI'ni o'rnating, versiyasini isbot maydoniga yozing**
   Ovoz: «Ikkinchi: Nest CLI'ni global o'rnating va versiyasini tekshiring. Chiqqan raqamni pastdagi isbot maydoniga yozing.»
4. **3-qadam: `nest new cars-api` — o'rnatish fonda, kutmasdan davom eting**
   Ovoz: «Uchinchi: nest new cars-api. Paket menejeri so'ralsa npm'ni tanlang. O'rnatish boshlangach, kutmang: katakchani belgilang va Davom bosing.»
5. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Biror narsa boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing: yechimlar oynasi ochiladi, xato va yechimi o'sha yerda. Uchala katakcha belgilanmaguncha va isbot to'g'ri yozilmaguncha Davom tugmasi ochilmaydi. Demak, shu amaliyotdan keyin kompyuteringizda Nest o'rnatilgan va yangi loyiha yaratilmoqda.»
- Qadamlar:
  1. **Node** — `node --version` → kutilgan: v20 yoki undan yuqori (Nest 11 talabi)
  2. **Nest CLI** — `npm i -g @nestjs/cli` · `nest --version` → kutilgan: 11.x.x
  3. **Loyiha — boshlab qo'ying** — `nest new cars-api` → kutilgan: paket menejeri: npm · o'rnatish 1–3 daqiqa — kutmang, Davom bosing
- «Boshqacha chiqdimi?» jadvali:
  - `node: v18 yoki past` → nodejs.org dan LTS (20+) o'rnating, terminalni qayta oching, node --version ni qaytaring
  - `nest: command not found` → CLI o'rnatilmagan yoki terminal yangilanmagan: 2-qadamni qaytaring, terminalni qayta oching
  - `npm install uzoq / xato` → internetni tekshiring; nest new --skip-install, keyin papkada npm install
- Isbot: Isbot: nest --version nima chiqardi? (placeholder: «terminalda chiqqan raqamni yozing»)

---

## 7 · Bitta so'rovning yo'li  ← `Lesson` (`Screen5b`)
- Kicker: `2-bosqich · Uch bo'lak`
1. **Brauzer `localhost:3000` manziliga GET so'rov yubordi**
   Ovoz: «Loyihangiz fonda o'rnatilayotganda, fayllar bir-biri bilan qanday ishlashini ko'raylik. Buning eng yaxshi yo'li, bitta so'rovning yo'lini kuzatish. Brauzer localhost uch ming manziliga GET so'rov yubordi.»
2. **So'rovni AppController qabul qildi — unda GET uchun metod bor**
   Ovoz: «So'rovni AppController qabul qildi, chunki unda GET uchun metod bor. U app controller ts faylida yashaydi, nomi qutining pastida.»
3. **Controller javobni o'zi o'ylamaydi — AppService'dan so'raydi**
   Ovoz: «Controller o'zi javob o'ylab topmaydi, u AppService'dan so'raydi. Service Hello World matnini qaytaradi.»
4. **Controller Service bergan matnni brauzerga qaytardi**
   Ovoz: «Controller shu matnni brauzerga yuboradi. Brauzerda Hello World chiqadi.»
5. **AppModule ikkalasini ro'yxatda ushlaydi — Nest shunga qarab yig'adi**
   Ovoz: «AppModule esa bu ikkalasini bitta ro'yxatda ushlab turadi, Nest shu ro'yxatga qarab ularni yig'adi.»
6. **Xulosa: yo'l doim shu — so'rov → Controller → Service → javob**
   Ovoz: «Xulosa: har so'rov bir xil yo'l bosadi. So'rov, Controller, Service, javob. Module esa bu bo'laklarni ro'yxatda ushlaydi. Bu yo'lni dars davomida ko'p marta ko'rasiz. Keyingi uch ekranda har faylni ochib, satrma-satr o'qiymiz.»

---

## 8 · Controller — so'rovni qabul qiladi  ← `Lesson` (`Screen6`)
- Kicker: `2-bosqich · Controller`
1. **`@Controller()` qavsi bo'sh — bu Controller'ning path'i root (`/`)**
   Ovoz: «So'rov yo'lidagi birinchi bekat Controller edi. So'rov aynan shu faylga keladi, shuning uchun undan boshlaymiz. Mana app controller ts. To'rtinchi satrda Controller decorator'i, qavsi bo'sh. Demak bu Controller'ning path'i root. Qavsga cars yozsak, uning hamma metodlari cars path'i bilan boshlanadi.»
2. **Decorator ostida oddiy TypeScript klass: AppController**
   Ovoz: «Keyin oddiy klass: AppController. Uni Controller qilgan narsa ustidagi decorator.»
3. **Konstruktor aytadi: «menga AppService kerak» — qanday kelishi 14-ekranda**
   Ovoz: «Konstruktorda bitta satr bor: unda AppService nomli bo'lak so'raladi. Buni hozircha shunday tushuning: bu Controller'ga AppService kerak. Qanday kelishini o'n to'rtinchi ekranda ko'ramiz.»
4. **`private readonly` parametr o'zi klass maydoniga aylanadi — `this.appService` tayyor**
   Ovoz: «Bir TypeScript qisqa yozuvi: konstruktor parametri oldida private readonly tursa, u avtomatik klassning maydoni bo'ladi. JavaScript'da this nuqta appService teng appService deb yozardingiz, bu yerda o'sha satr yozilmaydi, u o'zi bajariladi.»
5. **`@Get()` metod ustida: GET so'rov kelsa, shu metodni chaqir**
   Ovoz: «Pastda Get decorator'i. U metod ustida turibdi va aytyapti: GET so'rov kelsa, shu metodni chaqir. Express'dagi app get bilan bir xil ma'no, faqat endi metodning ustida.»
6. **Metod ichida bitta ish: Service'ni chaqirib, natijani qaytarish**
   Ovoz: «Metod ichida bitta ish: Service'ning metodini chaqirib, natijasini qaytarish.»
7. **Xulosa: Controller'da logika yozilmaydi — so'rovni oldi, Service'ni chaqirdi, javobni qaytardi**
   Ovoz: «Xulosa: Controller'da logika yozilmaydi. U so'rovni oldi, kerakli Service'ni chaqirdi, javobni qaytardi. Controller shunday bo'lishi kerak: logika Service'da, Controller faqat ulaydi.»

---

## 9 · Service — ishni bajaradi  ← `Lesson` (`Screen7`)
- Kicker: `2-bosqich · Service`
1. **`@Injectable()` — «bu klassni kerakli joyga inject qilish mumkin»**
   Ovoz: «Controller so'rovni oldi va ishni Service'ga uzatdi. Demak keyingi bekat Service, uni ochamiz: app service ts. Ustida Injectable decorator'i. Bu so'z inglizcha, inject qilish mumkin degani: Nest'ga aytadi, shu klassni kerak bo'lgan joyga inject qilsa bo'ladi.»
2. **Haqiqiy ish Service'da: narx hisobi, qoida tekshiruvi, bazaga yozish**
   Ovoz: «Ichida getHello metodi, u Hello World qaytaradi. Hozir bu juda kichkina, lekin qoida katta loyihada ham o'zgarmaydi: haqiqiy ish Service'da bo'ladi. Narxni hisoblash, qoidani tekshirish, bazaga yozish, hammasi shu yerda.»
3. **Service'da `req` ham, `res` ham yo'q — shuning uchun serversiz sinaladi**
   Ovoz: «Bir narsaga e'tibor bering: Service so'rov haqida hech narsa bilmaydi. Unda req ham, res ham yo'q. Shuning uchun uni alohida sinash oson: test fayli metodni chaqiradi va natijani kutilgan qiymat bilan solishtiradi, server ishga tushirilmaydi.»
4. **Xulosa: bitta Service'ni HTTP Controller ham, Telegram bot ham ishlatadi**
   Ovoz: «Va shuning uchun bitta Service'ni ikki joy ishlatishi mumkin: HTTP Controller ham, Telegram bot ham. Xulosa: ish Service'da, Controller faqat uni so'rovga ulaydi.»

---

## 10 · Module — ro'yxat  ← `Lesson` (`Screen8`)
- Kicker: `2-bosqich · Module`
1. **`@Module` ichida uchta ro'yxat: imports · controllers · providers**
   Ovoz: «Controller ham, Service ham tayyor. Lekin Nest ularning borligini qayerdan biladi? Javob uchinchi faylda, Module'da. app module ts: Module decorator'i va ichida uchta ro'yxat.»
2. **`controllers` — Controller'lar, `providers` — Nest yaratadigan Service'lar**
   Ovoz: «controllers: shu modulga tegishli Controller'lar. providers: shu modul yaratib beradigan narsalar, hozircha bu Service'lar. provider so'zini eslab qoling, Nest Service'ni shunday ataydi.»
3. **`imports` — boshqa modullar. Nest faqat ro'yxatdagini ko'radi**
   Ovoz: «imports: boshqa modullar, hozir bo'sh. Module hech qanday ish qilmaydi, u ro'yxat. Lekin bu ro'yxat hal qiluvchi: Nest faqat shu yerda yozilgan narsani ko'radi.»
4. **Fayl bor, lekin ro'yxatda yo'q — Nest uchun u yo'q**
   Ovoz: «Controller yozib, uni controllers ro'yxatiga qo'shmasangiz, u yo'qdek. Service yozib, providers'ga qo'shmasangiz, Nest uni inject qila olmaydi.»
5. **Xulosa: AppModule tepada, qolgan modullar unga `imports` orqali ulanadi**
   Ovoz: «Loyihada bir nechta modul bo'ladi: cars uchun, users uchun, orders uchun. Hammasining tepasida AppModule turadi va qolganlarini imports orqali o'ziga ulaydi. Xulosa: Module ish qilmaydi, lekin u ro'yxat bo'lgani uchun xatolarning ko'pi aynan shu faylda tuzatiladi.»

---

## 11 · main.ts va terminaldagi ishga tushish satrlari  ← `Lesson` (`Screen9`)
- Kicker: `2-bosqich · main.ts`
1. **`main.ts` bosh modulni Nest'ga beradi — Nest hammasini yig'adi**
   Ovoz: «Uch bo'lakni ko'rdik. Endi ular qanday ishga tushadi? Hammasi main ts dan boshlanadi. Birinchi satr: Nest'ga bosh modulni beramiz. U modul ro'yxatini o'qiydi, Service'larni yaratadi, Controller'larni ulaydi.»
2. **Port 3000 tinglanadi. Terminalda: `npm run start:dev`**
   Ovoz: «Keyin uch ming portni tinglaydi, Express'dagi kabi. Endi terminalga qarang, npm run start dev yozdik.»
3. **Terminal: dependencies initialized — ro'yxatdagi hamma narsa yaratildi**
   Ovoz: «Birinchi satr: Nest ilovasi ishga tushmoqda. Ikkinchi: AppModule'ning dependency'lari tayyor, ya'ni ro'yxatdagi hamma narsa yaratildi.»
4. **Terminal: Mapped {/, GET} — root path'ga GET route'i ulandi**
   Ovoz: «Keyin: AppController topildi va unga root path berildi. Mapped satri: root path'ga GET route'i ulandi. Va oxirgisi: ilova muvaffaqiyatli ishga tushdi.»
5. **Odat: route ishlamasa — avval terminaldagi Mapped satrini qidiring**
   Ovoz: «Bu satrlarni o'qishni odat qiling. Keyinchalik biror route ishlamasa, birinchi qiladigan ishingiz terminaldagi shu satrlarga qarash bo'ladi: Mapped satri bormi, yo'qmi.»
6. **Xulosa: main.ts → modul → Controller → brauzerda Hello World!**
   Ovoz: «Brauzerda localhost uch ming, javob: Hello World. Xulosa: main ts bosh modulni beradi, Nest ro'yxatdan hamma bo'lakni yig'adi va route'larni ulaydi, terminal esa nima ulanganini aytib turadi.»

---

## 12 · Ishga tushiring va terminalni o'qing  ← `Practice` (`ScreenP1`)
- Kicker: `Amaliyot 2 / 4` · Eyebrow: Hozir o'zingizda · 3–5 daqiqa
1. **1-amaliyotdagi loyihangiz o'rnatildi — endi uni ishga tushirasiz**
   Ovoz: «Yana navbat sizga. Birinchi amaliyotda boshlab qo'ygan loyihangiz o'rnatilib bo'lgan bo'lsa kerak. Uch qadam: ishga tushirasiz, terminaldagi satrlarni o'qiysiz, brauzerda ko'rasiz.»
2. **1-qadam: papkaga kirib `npm run start:dev` yozing**
   Ovoz: «Birinchi: papkaga kiring va npm run start dev yozing.»
3. **2-qadam: terminalda Mapped satrini toping va isbot maydoniga qo'ying**
   Ovoz: «Ikkinchi: terminalda Mapped satrini toping va uni aynan nusxalab, pastdagi isbot maydoniga qo'ying.»
4. **3-qadam: brauzerda `localhost:3000` — Hello World! chiqsin**
   Ovoz: «Uchinchi: brauzerda localhost uch ming, Hello World ni ko'ring.»
5. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Uchala katakcha belgilanmaguncha va isbot to'g'ri qo'yilmaguncha Davom ochilmaydi. Demak, shu amaliyotdan keyin loyihangiz ishga tushgan va siz terminaldagi Mapped satrlarini o'qiy olasiz.»
- Qadamlar:
  1. **Ishga tushirish** — `cd cars-api` · `npm run start:dev` → kutilgan: oxirida «Nest application successfully started»
  2. **Terminal** — kutilgan: Mapped {/, GET} route satri — nusxalab isbot maydoniga qo'ying
  3. **Brauzer** — kutilgan: localhost:3000 → Hello World!
- «Boshqacha chiqdimi?» jadvali:
  - `nest new hali tugamagan` → Terminalda «Successfully created project» chiqishini kuting; 5 daqiqadan oshsa — internet yoki npm install uzoq (--skip-install, keyin npm install)
  - `EADDRINUSE :::3000` → 3000-portda boshqa server ochiq: uni yoping yoki PORT=3001 npm run start:dev
  - `Mapped satri yo'q, xato bor` → Xato matnini o'qing: qizil TypeScript xatosi bo'lsa fayl:satr ko'rsatilgan; nest new tugamagan bo'lsa kuting
- Isbot: Isbot: terminaldagi Mapped satrini nusxalang (placeholder: «terminaldagi satrni shu yerga qo'ying»)

---

## 13 · Mashina narxiga chegirma hisoblaydigan kodni qayerga yozasiz?  ← `MCRetry` (`Screen10`)
- Ovoz (savol): «Uch bo'lakni ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Faraz qiling, mashina narxiga chegirma hisoblash kerak. Bu kod qayerga yoziladi? Variantni tanlang.»
  A) Controller metodi ichiga
  B) Service metodi ichiga  ✔
  C) AppModule ichiga
  D) main.ts ichiga
  - A noto'g'ri: Controller'da logika yozilmaydi: u so'rovni oladi va Service'ga uzatadi, hisoblamaydi.
  - C noto'g'ri: Module ro'yxat, unda ish bajaradigan kod yozilmaydi.
  - D noto'g'ri: main.ts faqat ilovani ishga tushiradi.
- To'g'ri javobdan keyin (ovoz): «To'g'ri, Service. Hisob, qoida va bazaga murojaat Service'da turadi. Controller faqat so'rovni oladi va Service'ni chaqiradi. Shunda chegirmani serversiz ham sinab ko'rish mumkin. Demak, biznes logika qayerda turadi deb so'ralsa, javob doim Service.»
- Ekranda: Service: hisob, qoida, baza — shu yerda. Controller faqat oladi va chaqiradi.

---

## 14 · Service Controller'ga qanday keladi  ← `Lesson` (`Screen11`)
- Kicker: `3-bosqich · Dependency Injection`
1. **Konstruktorda «menga AppService kerak» — lekin uni hech kim `new` bilan yaratmagan**
   Ovoz: «Tekshiruvda Controller Service'ni chaqiradi dedik. Lekin Controller Service'ni qayerdan oladi? Shu savol bilan Controller faylidagi konstruktorga qaytamiz. Bu yerda yozilgan: menga AppService kerak. Lekin butun loyihada new AppService degan satr yo'q. Unda Service qayerdan keladi? Shu ekranda aynan shuni qadam-baqadam ko'ramiz.»
2. **Express'da o'zingiz yaratardingiz: `require` + `new`, har faylda qaytadan**
   Ovoz: «Express'da buni o'zingiz qilardingiz: require qilib, new bilan yaratib, har kerakli faylda qaytadan. Uchta faylga kerak bo'lsa, uch marta. Nest'da bu ish sizdan olingan.»
3. **1-qadam: Nest ishga tushganda app.module.ts'dagi `providers`'ni o'qiydi**
   Ovoz: «Birinchi qadam. Server ishga tushganda Nest app module ts faylini ochadi va providers ro'yxatini o'qiydi: unda AppService turibdi.»
4. **2-qadam: Nest AppService'dan bitta instance yaratib, o'zida saqlaydi**
   Ovoz: «Ikkinchi qadam. Nest AppService'dan bitta instance yaratadi va o'zida saqlab qo'yadi. Bu ombor Nest konteyneri deyiladi.»
5. **3-qadam: konstruktordagi tip `AppService` — Nest shu instance'ni konstruktorga beradi**
   Ovoz: «Uchinchi qadam. Nest AppController'ni yaratayotib uning konstruktoriga qaraydi: parametrning tipi AppService. Tip buyurtma varaqasi kabi ishlaydi: Nest konteynerdan aynan shu tipdagi instance'ni olib, konstruktorga beradi. Endi this appService tayyor.»
6. **Bu usulning nomi: Dependency Injection — dependency'ni inject qilish**
   Ovoz: «Bu usul Dependency Injection deyiladi, dependency'ni inject qilish. Dependency, chunki Controller Service'siz ishlay olmaydi. Inject, chunki uni siz emas, Nest tashqaridan olib kelib beradi.»
7. **Foyda: bitta instance, testda soxtasini berish mumkin, Controller manbani bilmaydi**
   Ovoz: «Nega bu yaxshi? Birinchidan, butun loyihada bitta instance. Ikkinchidan, testda haqiqiy Service o'rniga soxtasini berish mumkin, Controller buni sezmaydi. Uchinchidan, Controller Service qayerdan kelganini bilishi shart emas.»
8. **Xulosa: siz ikki ish qilasiz — providers'ga yozasiz, konstruktorda so'raysiz**
   Ovoz: «Xulosa. Sizning ishingiz ikkita: Service'ni modulning providers ro'yxatiga yozish va kerakli joyda konstruktorda so'rash. Yaratish va inject qilishni Nest qiladi. Ikkalasidan biri unutilsa nima bo'lishini beshinchi bosqichda ataylab buzib ko'ramiz.»

---

## 15 · CLI bilan cars modulini yaratamiz  ← `Lesson` (`Screen12`)
- Kicker: `4-bosqich · CLI`
1. **Birinchi buyruq: `nest g module cars` — g = generate, ya'ni yaratish**
   Ovoz: «Asoslar tayyor: uch bo'lakni va Dependency Injection'ni bilasiz. Endi o'zimiz quramiz. Mashinalar uchun alohida modul kerak. Nest CLI buni uch buyruq bilan yaratadi. Birinchisi: nest g module cars. g bu generate, yaratish.»
2. **CLI bosh modulga o'zi kirib, `imports`'ga CarsModule'ni qo'shdi — UPDATE**
   Ovoz: «Natija ikki satr: CREATE, cars module yaratildi, va UPDATE, app module o'zgartirildi. Ikkinchi satrga e'tibor bering: CLI bosh modulga o'zi kirib, imports ro'yxatiga CarsModule'ni qo'shib qo'ydi. Qo'l bilan qilsangiz, aynan shuni unutasiz.»
3. **`nest g controller cars` — Controller yaratildi va controllers'ga yozildi**
   Ovoz: «Ikkinchi buyruq: nest g controller cars. no-spec qo'shimchasi test faylini yaratma degani: bu darsda testlar bilan ishlamaymiz, fayllar kamroq bo'lsin. Controller yaratildi va cars modulining controllers ro'yxatiga yozildi.»
4. **`nest g service cars` — Service yaratildi va providers'ga yozildi**
   Ovoz: «Uchinchi buyruq: nest g service cars. Service yaratildi va providers ro'yxatiga yozildi.»
5. **Xulosa: 3 buyruq — 3 CREATE, 3 UPDATE. CLI nima qilganini biling, buzilsa qo'lda tuzatasiz**
   Ovoz: «Xulosa: uch buyruq, oltita o'zgarish va hamma ro'yxat to'g'ri. Chapdagi Explorer'da cars papkasi va uch yangi fayl paydo bo'ldi. CLI'ga ishonish mumkin, lekin u nima qilganini bilish shart, chunki buzilganda qo'l bilan tuzatasiz.»

---

## 16 · CLI yaratgan fayllar bo'sh: path bor, route yo'q  ← `Lesson` (`Screen13`)
- Kicker: `4-bosqich · bo'sh fayllar`
1. **cars.module.ts: ikkala ro'yxatni CLI o'zi to'ldirdi**
   Ovoz: «CLI uch faylni yaratdi va ro'yxatlarga yozdi. Ichida nima bor? Birma-bir ochamiz. Birinchisi cars module ts: controllers ro'yxatida CarsController, providers ro'yxatida CarsService. Ikkalasini CLI o'zi yozdi.»
2. **O'ylab ko'ring: shu fayllar bilan server ishga tushsa, `/cars` nima qaytaradi?**
   Ovoz: «Boshqa fayllarni ochishdan oldin o'ylab ko'ring. CLI hozirgina yaratgan Controller va Service bilan serverni ishga tushirsak, cars route'i nima qaytaradi? Uchta variantdan birini bosing.»
   O'ylab ko'ring: CLI yaratgan fayllar bilan server nima qiladi? — Xato bilan yiqiladi / Ishga tushadi, /cars → 404 / Ishga tushadi, /cars → 200, bo'sh ro'yxat (to'g'ri: Ishga tushadi, /cars → 404)
3. **cars.controller.ts: decorator bor, lekin klass ichi bo'sh — birorta metod yo'q**
   Ovoz: «Endi cars controller ts. Controller decorator'i bor, qavsda cars. Lekin klassning ichi bo'sh: Get ham, Post ham, birorta metod yo'q.»
4. **cars.service.ts: `@Injectable()` bor, ichi ham bo'sh**
   Ovoz: «cars service ts ham xuddi shunday: Injectable decorator'i bor, ichi bo'sh.»
5. **Terminalda `CarsController {/cars}` bor, lekin Mapped satri yo'q**
   Ovoz: «Serverni ishga tushiramiz. Terminalda yangi satr bor: CarsController, qavs ichida cars path'i. Nest Controller'ni ko'rdi va unga path berdi. Lekin Mapped satri yo'q, chunki route metoddan paydo bo'ladi, metod esa yo'q.»
6. **Brauzerda `/cars` → 404: eshik bor, ichida hech kim yo'q**
   Ovoz: «Brauzerda cars route'ini ochsak: to'rt yuz to'rt, Cannot GET cars. Bu xato emas, bu tabiiy holat: eshik bor, ichida hech kim yo'q.»
7. **Xulosa: path'ni Controller beradi, route'ni metod beradi — endi avval Service, keyin Controller**
   Ovoz: «Xulosa: path'ni Controller decorator'i beradi, route'ni esa metod va uning ustidagi Get yoki Post beradi. Metod yo'q ekan, Mapped ham yo'q, javob to'rt yuz to'rt. Keyingi ikki ekranda fayllarni to'ldiramiz: avval ishni bajaradigan Service, keyin uni chaqiradigan Controller.»

---

## 17 · Service: ro'yxat va uch metod  ← `Lesson` (`Screen14`)
- Kicker: `4-bosqich · Service`
1. **`Car` interfeysi — mashinaning shakli: id, brand, model, price (bazadagi jadval emas)**
   Ovoz: «Fayllar bo'sh, route yo'q. Tartib bo'yicha avval ishni bajaradigan bo'lakni, Service'ni to'ldiramiz. cars service ts. Avval Car interfeysi: mashinada id, brand, model va price bo'ladi. Interface TypeScript'ning shakl tavsifi, bazadagi jadval emas, hozircha shunchaki shakl.»
2. **Ro'yxat hozircha xotirada: Malibu va K5 — bu darsda baza kerak emas**
   Ovoz: «Keyin ro'yxat: ikkita mashina, Chevrolet Malibu va Kia K5, narxi million so'mda. Baza hali yo'q, ma'lumot xotirada turibdi, bu dars uchun yetarli.»
3. **`findAll` hammasini qaytaradi, `findOne` id bo'yicha bittasini qidiradi**
   Ovoz: «findAll ro'yxatni qaytaradi. findOne id bo'yicha qidiradi.»
4. **Topilmasa NotFoundException tashlaydi — Nest uni o'zi 404 javobga aylantiradi**
   Ovoz: «Topilmasa, NotFoundException tashlaydi. Bu Nest'ning tayyor xatosi: siz uni tashlaysiz, Nest uni o'zi to'rt yuz to'rt javobga aylantiradi, statusi va xabari bilan. Express'da buni qo'lda, status to'rt yuz to'rt va json deb yozardingiz.»
5. **Xulosa: `create` qo'shadi, Service'da esa so'rov haqida bitta so'z yo'q**
   Ovoz: «create yangi mashinani ro'yxatga qo'shadi va qaytaradi. Qavsdagi Omit Car vergul id, TypeScript yozuvi: Car'ning id'siz shakli, chunki id'ni biz o'zimiz beramiz. Xulosa: bu faylda so'rov haqida bitta so'z ham yo'q, req ham, res ham yo'q. Faqat mashinalar va ular bilan ishlaydigan uch metod. Shuning uchun uni Controller ham, Telegram bot ham ishlata oladi.»

---

## 18 · Controller: uch route  ← `Lesson` (`Screen15`)
- Kicker: `4-bosqich · Controller`
1. **`@Controller('cars')`: hamma metod /cars bilan boshlanadi; konstruktor CarsService so'raydi**
   Ovoz: «Service tayyor: mashinalar ro'yxati va uchta metod. Endi Service'ni so'rovga ulaydigan bo'lakni, Controller'ni yozamiz. cars controller ts. Controller decorator'i, qavsda cars: hamma metod cars path'i bilan boshlanadi. Konstruktor: menga CarsService kerak.»
2. **Bo'sh `@Get()` = GET /cars → Service'ning findAll'i chaqiriladi**
   Ovoz: «Get decorator'i bo'sh: GET cars. Metod Service'ning findAll'ini chaqiradi.»
3. **`@Get(':id')` = GET /cars/5; `@Param('id')` — Express'dagi req.params.id, qiymati matn**
   Ovoz: «Get decorator'i ikki nuqta id bilan: cars path'idan keyin raqam, masalan cars besh. Param decorator'i Express'dagi req params id ning o'zi, faqat decorator orqali olinadi. URL'dan kelgan qiymat har doim matn, shuning uchun Number bilan raqamga o'tkazamiz.»
4. **`@Post()` = POST /cars; `@Body()` — req.body, express.json ulash shart emas**
   Ovoz: «Post decorator'i: POST cars. Body decorator'i Express'dagi req body. Nest'da express json ni qo'lda ulash shart emas, u ichida yoqilgan.»
5. **Xulosa: uch metod bir shaklda — so'rovdan olinadi, Service chaqiriladi, natija qaytariladi**
   Ovoz: «Xulosa: uchala metod ham bir xil shaklda. So'rovdan kerakli qism olinadi, Service metodi chaqiriladi, natija qaytariladi. Controller'da if yo'q, hisob yo'q, baza yo'q. Chapdagi jadval Express'dagi tanish yozuvlarning Nest'dagi o'rnini ko'rsatadi.»

---

## 19 · Bu Controller ishlaydi, lekin bitta satr noto'g'ri faylda turibdi  ← `LineCheck` (`ScreenLC1`)
- Shart: Qoida: Controller faqat so'rovdan oladi, Service'ni chaqiradi va natijani qaytaradi — **hisob qilmaydi**. Bu Controller'da bitta satr hisob qilyapti. **O'sha satrni bosing.**
- Ovoz (savol): «Controller'ni yozdik, endi o'zingiz tekshiring. Ikkinchi tekshiruv. Qoidani eslang: Controller faqat so'rovdan oladi, Service'ni chaqiradi va natijani qaytaradi, hisob qilmaydi. Ekrandagi Controller ishlaydi, lekin bitta satr hisob qilyapti. O'sha satrni bosing.»
- To'g'ri satr (0 dan): 10
- Yo'llanma (noto'g'ri bosilsa): Bu satr Controller'ning o'z ishi: so'rovdan olish, Service'ni chaqirish yoki qaytarish. Narxni o'zgartirib, hisob qilayotgan satrni qidiring.
- To'g'ri javobdan keyin (ovoz): «To'g'ri. O'n birinchi satr narxga chegirma hisoblayapti. Ishlaydi, lekin bu biznes logika, u Service'ga tegishli: Controller'da tursa, uni alohida sinab bo'lmaydi va Telegram bot shu chegirmani ololmaydi. Ekranda tuzatilgan holat ko'rinib turibdi: hisob Service'ning findOne metodiga ko'chdi, Controller'da yana bitta satr qoldi. Demak, Controller'da hisob ko'rsangiz, uni Service'ga ko'chirish kerak.»
- Ekranda: 11-satr: chegirma hisobi — biznes logika, u Service'ga tegishli. Tuzatildi: hisob cars.service.ts → findOne'ga ko'chdi, Controller'da yana bitta satr.

---

## 20 · Terminal va javoblar  ← `Lesson` (`Screen16`)
- Kicker: `4-bosqich · ishga tushdi`
1. **Terminalda uchta Mapped satri — uchala route ulangan**
   Ovoz: «Service ham, Controller ham tayyor. Endi eng qiziq joyi: serverni ishga tushirib, haqiqiy so'rov yuboramiz. Server ishga tushdi. Terminalda uchta yangi Mapped satri: cars GET, cars id GET, cars POST. Uchala route ulangan. Endi so'rov yuboramiz.»
2. **`GET /cars` → 200: JSON'ni Nest o'zi yasadi, stringify yozilmadi**
   Ovoz: «GET cars: ikki yuz va ikki mashinalik ro'yxat, JSON ko'rinishida. Biz JSON stringify yozmadik, Nest obyektni o'zi JSON qiladi.»
3. **`GET /cars/1` → 200 va bitta mashina — Malibu**
   Ovoz: «GET cars bir: ikki yuz va Malibu.»
4. **`GET /cars/99` → 404: bizning NotFoundException, Nest xabar bilan qaytardi**
   Ovoz: «GET cars to'qson to'qqiz: to'rt yuz to'rt va xabar, Car with id 99 not found. Bu bizning NotFoundException, Nest uni shu ko'rinishga keltirdi: message, error, statusCode.»
5. **`POST /cars` → 201 Created — bu status kodini Nest o'zi qo'ydi**
   Ovoz: «POST cars bilan Cobalt yuboramiz: ikki yuz bir Created va yangi mashina, id uch. E'tibor bering, biz ikki yuz birni yozmadik. Nest POST uchun uni o'zi qo'yadi, Express'da ikki yuz bo'lardi.»
6. **Bo'sh `POST {}` ham 201 — Nest kiruvchi ma'lumotni o'zi tekshirmaydi**
   Ovoz: «Yana bir sinov: bo'sh POST yuboramiz, ichida hech narsa yo'q. Nest baribir ikki yuz bir qaytaradi va faqat id to'rt bo'lgan mashina yaratadi. Nest kiruvchi ma'lumotni o'zi tekshirmaydi, siz aytmaguncha.»
7. **Aytish usuli — DTO + ValidationPipe: bo'sh so'rovga Nest o'zi 400 qaytaradi**
   Ovoz: «Aytish usuli DTO: alohida klassda brand matn va majburiy, price raqam deb yoziladi, ValidationPipe yoqiladi. Shunda bo'sh so'rovga Nest o'zi to'rt yuz, Bad Request qaytaradi. Bu darsda uni yozmaymiz, lekin o'quvchi so'rasa, javobingiz shu.»
8. **Xulosa: JSON, 201 va 404 xabarini Nest o'zi qiladi — beshala tugmani bosib ko'ring**
   Ovoz: «Xulosa: Nest JSON'ni, POST uchun ikki yuz birni va xato xabarini o'zi qiladi, kiruvchi ma'lumotni tekshirishni esa siz aytmaguncha qilmaydi. Endi beshala tugmani o'zingiz bosib, har javobni o'qing. Davom besh tugmadan keyin ochiladi.»

---

## 21 · Kodimiz hozirgi holatda. GET /cars/abc so'rovi kelsa, javob qanday bo'ladi?  ← `MCRetry` (`Screen17`)
- Ovoz (savol): «Javoblarni ko'rdik. Endi bir qadam oldinga o'ylaymiz. Uchinchi tekshiruv, o'ylab ko'ring. Kimdir cars path'idan keyin abc deb yubordi. Kodimiz hozirgi holatda. Javob qanday bo'ladi?»
  A) 200 va bo'sh obyekt — mashina yo'q
  B) 500 Internal server error — Service yiqildi
  C) 404 va «Car with id NaN not found»  ✔
  D) 400 Bad Request — id son emas
  - A noto'g'ri: find hech narsa topmasa undefined qaytaradi, bizning kod esa bu holatda xato tashlaydi.
  - B noto'g'ri: Besh yuz faqat biz kutmagan xato bo'lganda chiqadi; bu yerda xatoni o'zimiz NotFoundException bilan tashladik.
  - D noto'g'ri: To'rt yuzni hech kim qaytarmaydi, chunki tekshiruv yozilmagan.
- To'g'ri javobdan keyin (ovoz): «To'g'ri: to'rt yuz to'rt va Car with id NaN not found. Number abc natijasi NaN, bunday id'li mashina yo'q, shuning uchun findOne NotFoundException tashlaydi. Ishlaydi, lekin foydalanuvchi NaN so'zini ko'rmasligi kerak. Id ParseIntPipe bilan olinsa, abc kelganda Nest o'zi to'rt yuz, Bad Request qaytaradi. Demak, Nest kiruvchi ma'lumotni siz pipe bilan aytmaguncha tekshirmaydi.»
- Ekranda: 404, «Car with id NaN not found»: Number('abc') = NaN → findOne topmaydi → NotFoundException. Tekshiruv yo'q; @Param('id', ParseIntPipe) yozilsa — 400 «Validation failed (numeric string is expected)» (sinab ko'rilgan).

---

## 22 · cars modulini quring  ← `Practice` (`ScreenP2`)
- Kicker: `Amaliyot 3 / 4` · Eyebrow: Hozir o'zingizda · 10–15 daqiqa
1. **Endi siz: cars modulini o'z loyihangizda to'rt qadamda qurasiz**
   Ovoz: «Yana navbat sizga. Hozirgina ko'rgan cars modulini o'z loyihangizda qurasiz: to'rt qadam, o'n-o'n besh daqiqa.»
2. **1-qadam: uch CLI buyrug'i — terminalda 3 CREATE, 3 UPDATE chiqsin**
   Ovoz: «Birinchi: uch buyruq bilan modul, controller va service yarating. Terminalda uchta CREATE va uchta UPDATE chiqishi kerak.»
3. **2-qadam: Service kodini nusxalang — qadam ichidagi «Kodni ochish» tugmasida**
   Ovoz: «Ikkinchi: Service'ni darsdagi kod bilan to'ldiring. Ikkinchi qadam ichida Kodni ochish tugmasi bor, kod o'sha yerda, nusxalab qo'ying.»
4. **3-qadam: Controller'ni o'zingiz yozing — namunani ko'rasiz, lekin nusxalanmaydi**
   Ovoz: «Uchinchi: Controller'ni o'zingiz yozing, yigirma qator. Namuna uchinchi qadam ichidagi Kodni ochish tugmasida ko'rinadi, lekin nusxalanmaydi, ataylab. Decorator va konstruktorni qo'lingiz his qilsin. Terminalda uchta Mapped satri chiqsin.»
5. **4-qadam: to'rtta so'rov — javoblar 200 · 200 · 404 · 201 bo'lsin**
   Ovoz: «To'rtinchi: brauzer yoki Postman bilan to'rtta so'rovni yuboring va javoblarni darsdagi bilan solishtiring: ikki yuz, ikki yuz, to'rt yuz to'rt, ikki yuz bir. cars to'qson to'qqiz javobidagi xabarni isbot maydoniga yozing.»
6. **Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**
   Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha belgilanmaguncha va isbot to'g'ri yozilmaguncha Davom ochilmaydi. Demak, shu amaliyotdan keyin sizda o'zingiz qurgan cars moduli bor va u so'rovlarga javob beradi.»
- Qadamlar:
  1. **cars moduli** — `nest g module cars` · `nest g controller cars --no-spec` · `nest g service cars --no-spec` → kutilgan: 3 CREATE, 3 UPDATE
  2. **Service — nusxalang** — kutilgan: cars.service.ts — «Kodni ochish» → «nusxalash», faylga qo'ying
  3. **Controller — o'zingiz yozing** — kutilgan: cars.controller.ts — 20 qator, namunani «Kodni ochish»da ko'ring (nusxalanmaydi) · terminalda 3 ta Mapped {/cars…}
  4. **So'rovlar** — kutilgan: GET /cars · /cars/1 · /cars/99 · POST /cars → 200 · 200 · 404 · 201
- «Boshqacha chiqdimi?» jadvali:
  - `Qizil TypeScript xatosi (fayl:satr)` → Nusxalashda satr tushib qolgan: ko'rsatilgan satrni «Kodni ochish»dagi kod bilan solishtiring
  - `Cannot GET /cars` → Terminalda Mapped {/cars…} bormi? Yo'q bo'lsa app.module.ts → imports: [CarsModule]
  - `POST da body undefined` → Postman'da Body → raw → JSON tanlanganmi? Content-Type: application/json
- Isbot: Isbot: GET /cars/99 javobidagi message maydoni (placeholder: «javobdagi message matnini yozing»)
- «Kodni ochish»: namuna kodlar (`code`), Explorer — `tree` (butun loyiha, faqat amaliyot fayllari bosiladi)

---

## 23 · Buzamiz 1: providers bo'sh  ← `Lesson` (`Screen18`)
- Kicker: `5-bosqich · buzamiz 1`
1. **Ataylab buzamiz: `cars.module.ts`'da providers bo'sh qoldi**
   Ovoz: «Ishlaydigan modulimiz bor. Endi uni ataylab buzamiz, chunki o'quvchilaringiz aynan shu xatolarni qiladi, siz esa ularni o'qiy olishingiz kerak. Birinchi holat: cars module da providers ro'yxatidan CarsService'ni o'chirdik.»
2. **Server yiqildi. 1-bo'lak — qaysi klass? CarsController; `(?)` — topilmagan dependency o'rni**
   Ovoz: «Serverni ishga tushiramiz, u yiqiladi. Xabarni uch bo'lakka bo'lib o'qiymiz. Birinchi bo'lak, qaysi klass: Nest CarsController'ning dependency'larini topa olmadi. Qavsdagi so'roq belgisi topilmagan dependency'ning o'rni.»
3. **2-bo'lak — qaysi dependency yetishmayapti? CarsService, konstruktordagi 0-argument**
   Ovoz: «Ikkinchi bo'lak, qaysi dependency yetishmayapti: nolinchi argument, ya'ni konstruktordagi birinchi parametr, CarsService.»
4. **3-bo'lak — qaysi fayl? CarsModule, ya'ni `cars.module.ts`**
   Ovoz: «Uchinchi bo'lak, qaysi faylni ochamiz: Nest CarsModule'da qidirdi va topmadi, demak cars module ts fayli. Mana, uch savolga javob bor: qaysi klass, qaysi dependency, qaysi fayl.»
5. **Pastda Nest yechimni o'zi taklif qiladi: CarsService shu modulda bormi?**
   Ovoz: «Pastda Nest o'zi yechimlarni sanaydi. Ikkinchisi bizning holat: CarsService provider bo'lsa, u shu modulda bormi? Yo'q, biz uni o'chirganmiz.»
6. **Tuzatamiz: `providers: [CarsService]` qaytdi — server ishga tushdi**
   Ovoz: «Tuzatamiz: cars module ts faylini ochib, providers ro'yxatiga CarsService'ni qaytaramiz va saqlaymiz. start dev serverni o'zi qayta yuklaydi: terminalda Mapped satrlari va successfully started.»
7. **Xulosa: «can't resolve dependencies» ko'rsangiz — modul faylini oching, providers'ni tekshiring**
   Ovoz: «Xulosa: bu Nest'dagi eng ko'p uchraydigan xato. Xabarni uch savol bilan o'qiysiz: qaysi klass, qaysi dependency, qaysi fayl. Javob esa doim modul faylida: yetishmayotgan Service providers ro'yxatiga yoziladi.»

---

## 24 · Buzamiz 2: imports'da CarsModule yo'q  ← `Lesson` (`Screen19`)
- Kicker: `5-bosqich · buzamiz 2`
1. **Ataylab buzamiz: `app.module.ts`'ning `imports`'idan CarsModule olindi**
   Ovoz: «Birinchi xatoni o'qidik va tuzatdik. Ikkinchi holat boshqacha: bu safar server yiqilmaydi, va aynan shuning uchun xavfli. app module da imports ro'yxatidan CarsModule'ni olib tashladik.»
2. **O'ylab ko'ring: server xato bilan yiqiladimi yoki ishga tushadimi?**
   Ovoz: «O'ylab ko'ring: serverni ishga tushirsak, xato chiqib yiqiladimi, yoki ishga tushadimi?»
   O'ylab ko'ring: Server nima qiladi? — Xato bilan yiqiladi / Ishga tushadi (to'g'ri: Ishga tushadi)
3. **Server ishga tushdi — «successfully started», xato yo'q**
   Ovoz: «Server ishga tushdi, muvaffaqiyatli deb yozdi, hamma narsa yaxshidek. Xato yo'q.»
4. **Lekin `/cars` → 404, root path esa ishlaydi**
   Ovoz: «Lekin cars route'ini so'rasak, to'rt yuz to'rt, Cannot GET cars. Root path esa ishlaydi.»
5. **AppModule CarsModule'ni ulamadi — Nest cars papkasini umuman o'qimadi. Bu yashirin xato**
   Ovoz: «Nima bo'ldi? AppModule CarsModule'ni ulamadi, shuning uchun Nest cars papkasini umuman o'qimadi. Xato yo'q, chunki Nest uchun u modul shunchaki yo'q. Bu yashirin xato, eng xavflisi.»
6. **Topish yo'li: terminalda CarsController satri ham, Mapped ham yo'q**
   Ovoz: «Buni qanday topasiz? Terminalga qarang: CarsController satri yo'q, cars uchun Mapped satri yo'q. Terminaldagi satrlarni o'qishni odat qiling degan edim, sabab mana shu.»
7. **Tuzatamiz: `imports: [CarsModule]` qaytdi — Mapped satrlari qaytib keldi**
   Ovoz: «Tuzatamiz: app module ts faylida imports ro'yxatiga CarsModule'ni qaytaramiz. Server qayta yuklanadi va terminalda CarsController hamda uchta Mapped satri qaytib keladi. cars route'i yana ishlaydi.»
8. **Xulosa: 404 bo'lsa-yu kod to'g'ri ko'rinsa — avval terminaldagi Mapped, keyin imports**
   Ovoz: «Xulosa: route to'rt yuz to'rt bersa va kodingiz to'g'ri ko'rinsa, avval terminalda Mapped satrini qidiring, keyin bosh modulning imports ro'yxatini tekshiring.»

---

## 25 · Buzamiz 3: Controller decorator'i yo'q  ← `Lesson` (`Screen20`)
- Kicker: `5-bosqich · buzamiz 3`
1. **Ataylab buzamiz: `@Controller('cars')` o'chirildi, klass qoldi — server yiqiladi**
   Ovoz: «Yashirin xatoni ko'rdik. Uchinchi holat decorator haqida: to'rtinchi ekranda aytgan qoidani endi amalda ko'ramiz. cars controller da Controller decorator'ini o'chirdik, klass joyida qoldi. Server yiqiladi.»
2. **Xabar: «invalid controller» — belgi yo'q, lekin controllers ro'yxatida turibdi**
   Ovoz: «Xabar: noto'g'ri controller aniqlandi. CarsController'da Controller decorator'i yo'q, lekin u qaysidir modulning controllers ro'yxatida turibdi.»
3. **4-ekrandagi qoida ishladi: belgi bo'lmasa, Nest klassni tanimaydi**
   Ovoz: «Nest aniq aytyapti: siz uni ro'yxatga yozgansiz, lekin klassda belgi yo'q. Decorator'lar ekranida aytganimni eslang: belgi bo'lmasa, Nest klassni tanimaydi.»
4. **Tuzatamiz: decorator qaytdi — server ishga tushdi, Mapped satrlari joyida**
   Ovoz: «Tuzatish bitta satr: decorator'ni qaytaramiz. Server qayta yuklanadi, terminalda Mapped satrlari va successfully started.»
5. **Xulosa: «invalid controller» — birinchi satr tushib qolgan, decorator'ni qaytaring**
   Ovoz: «Xulosa: invalid controller xabarini ko'rsangiz, xabarda aytilgan klassning ustiga qarang. O'quvchilar buni ko'pincha kodni qo'lda ko'chirganda, birinchi satrni tushirib qoldirganda qiladi.»

---

## 26 · Buzamiz 4: Injectable decorator'i yo'q  ← `Lesson` (`Screen21`)
- Kicker: `5-bosqich · buzamiz 4`
1. **Ataylab buzamiz: `cars.service.ts`'dan `@Injectable()` o'chirildi**
   Ovoz: «Controller decorator'siz Nest klassni tanimadi. Service'da ham shundaymi? To'rtinchi holat: cars service dan Injectable decorator'ini o'chirdik. Service'ning o'zida konstruktor yo'q, u hech kimga bog'liq emas.»
2. **O'ylab ko'ring: `@Injectable()`'siz `/cars` ishlaydimi?**
   Ovoz: «O'ylab ko'ring: serverni ishga tushirsak, cars route'i ishlaydimi?»
   O'ylab ko'ring: Injectable decorator'siz /cars ishlaydimi? — Ha, ishlaydi / Yo'q, xato chiqadi (to'g'ri: Ha, ishlaydi)
3. **Ishlayapti! CarsService hech kimga bog'liq emas — Nest uni oddiy yaratdi**
   Ovoz: «Kutilmagan natija: hammasi ishlayapti, cars route'i ikki yuz qaytaryapti. Nega? CarsService'ning o'zining konstruktorida hech qanday dependency yo'q. Nest uni dependency'siz yaratib qo'ya oldi.»
4. **`@Injectable()` Nest'ga aytadi: konstruktorga qarab, nima kerakligini aniqla**
   Ovoz: «Injectable aslida Nest'ga shuni aytadi: bu klassning konstruktoriga qarab, unga nima kerakligini aniqlang. Belgi bo'lmasa, Nest konstruktorga qaramaydi.»
5. **Dependency qo'shsak: server ishga tushadi, lekin so'rovda 500 — bu yashirin xato**
   Ovoz: «Endi sinab ko'ramiz: shu Injectable'siz Service'ga dependency qo'shamiz, konstruktorida PricingService so'raladi. Natija kutilmagan: server xatosiz ishga tushadi, Mapped satrlari joyida. Lekin cars so'rovi besh yuz qaytaradi, terminalda TypeError: undefined ning withDiscount xossasini o'qib bo'lmaydi. Nest dependency'ni inject qilmadi va xato ham bermadi, maydon bo'sh qoldi. Bu yashirin xato: ishga tushishda emas, birinchi so'rovda chiqadi.»
6. **Tuzatamiz: `@Injectable()` qaytdi — PricingService inject qilindi, `/cars` → 200**
   Ovoz: «Tuzatamiz: Injectable decorator'ini qaytaramiz. PricingService modulning providers ro'yxatida turibdi. Endi Nest konstruktorga qaraydi, PricingService'ni inject qiladi va cars so'rovi yana ikki yuz qaytaradi.»
7. **Xulosa: `@Injectable()` har Service'ga yoziladi, hozir kerak bo'lmasa ham**
   Ovoz: «Xulosa va qoida: Injectable har Service'ga yoziladi, hozir kerak bo'lmasa ham. O'quvchi men o'chirdim, ishlayapti, demak kerak emas desa, siz nega kerakligini tushuntira olasiz: dependency paydo bo'lganda xato ishga tushishda emas, so'rov paytida chiqadi, uni topish qiyin.»

---

## 27 · Server yiqiladi: «can't resolve dependencies of the OrdersController»  ← `LineCheck` (`ScreenLC2`)
- Shart: Qoida: Controller — `controllers`'da, Service — `providers`'da. Bu modulda bitta narsa **noto'g'ri ro'yxatga** yozilgan. **O'sha satrni bosing.**
- Ovoz (savol): «To'rt xato holatini ko'rdingiz, endi o'zingiz toping. To'rtinchi tekshiruv. Bu modul bilan server yiqiladi: OrdersController'ning dependency'si topilmadi deydi. Qoidani eslang: Controller controllers ro'yxatida, Service providers ro'yxatida. Bitta narsa noto'g'ri ro'yxatda. O'sha satrni bosing.»
- To'g'ri satr (0 dan): [7, 8]
- Yo'llanma (noto'g'ri bosilsa): Bu satr o'z joyida. Har narsa o'z ro'yxatidami: Controller controllers'da, Service providers'da? Nomi Service bilan tugaydigan narsani qidiring.
- To'g'ri javobdan keyin (ovoz): «To'g'ri. PaymentService bu Service, lekin u controllers ro'yxatiga yozilgan, providers'da esa yo'q. Ekranda tuzatilgan holat ko'rinib turibdi: sakkizinchi satrda faqat OrdersController qoldi, PaymentService to'qqizinchi satrga, providers'ga ko'chdi. Endi Nest uni yaratadi va OrdersController'ga inject qiladi. Demak, Service doim providers ro'yxatiga yoziladi, controllers'ga emas.»
- Ekranda: PaymentService — Service, u providers'da bo'lishi kerak. Tuzatildi: controllers: [OrdersController] · providers: [OrdersService, PaymentService].

---

## 28 · Xatoning ikki turi: Error va HttpException  ← `Lesson` (`Screen22`)
- Kicker: `5-bosqich · xato turi`
1. **Ataylab buzamiz: `findOne`'da NotFoundException o'rniga oddiy Error tashladik**
   Ovoz: «Hozirgacha xatolar server ishga tushayotganda chiqdi. Oxirgi holat boshqa: server ishlayapti, xato so'rov paytida tashlanadi. Qaysi status qaytadi? cars service ts ichidagi findOne'da NotFoundException o'rniga oddiy Error tashladik, matni topilmadi.»
2. **Javob 500, «topilmadi» matni yo'qoldi — Nest kutilmagan xatoni yashiradi**
   Ovoz: «Javob: besh yuz, Internal server error. Bizning topilmadi matnimiz yo'qoldi. Nest kutilmagan xatoni foydalanuvchiga ko'rsatmaydi, bu to'g'ri: ichki tafsilot tashqariga chiqmasligi kerak.»
3. **HttpException oilasini Nest taniydi: to'g'ri status va xabar bilan qaytaradi**
   Ovoz: «NotFoundException esa Nest'ning HttpException oilasidan. Nest uni taniydi va to'g'ri status bilan, xabari bilan qaytaradi.»
4. **Oila: 400 BadRequest · 401 Unauthorized · 403 Forbidden · 404 NotFound**
   Ovoz: «Oilada boshqalari ham bor: BadRequest to'rt yuz, noto'g'ri ma'lumot. Unauthorized to'rt yuz bir, kirish qilinmagan. Forbidden to'rt yuz uch, ruxsat yo'q. NotFound to'rt yuz to'rt, topilmadi.»
5. **Tuzatamiz: `Error` → `NotFoundException` — javob yana 404 va xabar**
   Ovoz: «Tuzatamiz: findOne'dagi oddiy Error'ni NotFoundException'ga almashtiramiz. Endi cars to'qson to'qqiz so'roviga yana to'rt yuz to'rt va Car with id 99 not found xabari keladi.»
6. **Xulosa: o'quvchi «nega 500?» desa — «qanday xato tashladingiz?» deb so'rang va almashtiring**
   Ovoz: «Xulosa va sinfdagi qoida: foydalanuvchi bilishi kerak bo'lgan xato HttpException oilasi bilan tashlanadi, qolgani besh yuz bo'lib qoladi va xabari yashiriladi. O'quvchi nega besh yuz chiqyapti desa, birinchi savolingiz: qanday xato tashladingiz? Oddiy Error bo'lsa, mos HttpException'ga almashtirasiz: topilmasa NotFound, ma'lumot noto'g'ri bo'lsa BadRequest.»

---

## 29 · Bu o'quvchingizning loyihasi. Qaysi faylni ochasiz va nimani tuzatasiz?  ← `MCRetry` (`Screen23`)
- Ovoz (savol): «Oxirgi tekshiruv, sinfdagi haqiqiy holat. Beshinchi tekshiruv. Ekrandagi xabarni o'qing. Bu sizning emas, o'quvchingizning loyihasi, u yordam so'radi. Qaysi faylni ochasiz va nimani tuzatasiz?»
  A) orders.controller.ts — konstruktordan OrdersService'ni o'chirish
  B) orders.module.ts — providers'ga PaymentService qo'shish  ✔
  C) app.module.ts — imports'ga OrdersController qo'shish
  D) payment.service.ts — Controller decorator'i qo'shish
  - A noto'g'ri: OrdersService topilgan, muammo unda emas.
  - C noto'g'ri: Controller imports'ga yozilmaydi, imports faqat modullar uchun.
  - D noto'g'ri: Controller decorator'i Service'ga qo'yilmaydi; bu xabar PaymentService modul ro'yxatida yo'qligini aytyapti.
- To'g'ri javobdan keyin (ovoz): «To'g'ri: orders module faylida providers ro'yxatiga PaymentService qo'shiladi. Xabarda hamma narsa yozilgan: klass OrdersController, dependency PaymentService, index nol, fayl OrdersModule. Qavsda so'roq belgisi birinchi o'rinda turibdi, OrdersService esa ikkinchi o'rinda topilgan. Ekranda tuzatilgan fayl: PaymentService qo'shildi va server ishga tushdi. Demak, so'roq belgisi turgan o'rindagi dependency yetishmayapti.»
- Ekranda: orders.module.ts → providers: [OrdersService, PaymentService]. Klass: OrdersController · dependency: PaymentService, index [0] · fayl: orders.module.ts.

---

## 30 · O'zingiz buzing va tuzating  ← `Practice` (`ScreenP3`)
- Kicker: `Amaliyot 4 / 4` · Eyebrow: Hozir o'zingizda · 5 daqiqa
1. **Endi siz buzasiz: ikki holat — xatoni o'z ko'zingiz bilan o'qiysiz**
   Ovoz: «Oxirgi amaliyot: endi siz buzasiz. Ikki holat, besh daqiqa. Maqsad xatoni o'z ko'zingiz bilan ko'rish va o'qish.»
2. **1-qadam: `providers`'ni bo'shating, xabardan qaysi klass · qaysi dependency · qaysi fayl'ni toping, qaytaring**
   Ovoz: «Birinchi: cars module da providers ro'yxatini bo'shating, serverni ishga tushiring, xabardan qaysi klass, qaysi dependency va qaysi fayl ekanini toping. Topgan uchta javobingizni, klass, dependency va faylni, vergul bilan isbot maydoniga yozing, keyin providers'ni qaytaring.»
3. **2-qadam: `imports`'dan CarsModule'ni oling — terminalda qaysi satr yo'qolganini toping**
   Ovoz: «Ikkinchi: app module da imports'dan CarsModule'ni olib tashlang. Server ishga tushadi. Terminalda qaysi satr yo'qolganini toping, cars route'ini so'rang, keyin qaytaring.»
4. **3-qadam: hammasini qaytaring — terminalda 3 ta Mapped, `/cars/99` → 404**
   Ovoz: «Uchinchi: hammasini qaytaring va tekshiring. Terminalda yana uchta Mapped satri bo'lsin, cars to'qson to'qqiz so'rovi to'rt yuz to'rt va xabar qaytarsin. Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Uchala katakcha va isbot to'g'ri bo'lmaguncha Davom ochilmaydi. Demak, endi siz Nest xabaridan klass, dependency va faylni o'zingiz topa olasiz.»
- Qadamlar:
  1. **providers bo'sh** — kutilgan: «Nest can't resolve dependencies of the CarsController (?)» → klass · dependency · fayl → providers: [CarsService] qaytaring
  2. **imports'da CarsModule yo'q** — kutilgan: server ishga tushadi · terminalda CarsController satri YO'Q · GET /cars → 404 → imports: [CarsModule] qaytaring
  3. **Qaytaring va tekshiring** — kutilgan: terminalda yana 3 ta Mapped {/cars…} · GET /cars/99 → 404 «Car with id 99 not found»
- «Boshqacha chiqdimi?» jadvali:
  - `Qaytardim, baribir xato` → Faylni saqladingizmi? start:dev saqlashda o'zi qayta yuklaydi; terminalda yangi satrlarni kuting
  - `Boshqa xato chiqdi` → Xabarni uch savol bilan o'qing: qaysi klass · qaysi dependency · qaysi fayl. Potential solutions ro'yxati yechimni aytadi
- Isbot: Isbot: 1-qadam xabaridan — qaysi klass, qaysi dependency, qaysi fayl? (vergul bilan) (placeholder: «klass, dependency, fayl»)

---

## 31 · O'quvchi clone qiladigan loyiha  ← `Lesson` (`Screen25a`)
- Kicker: `7-bosqich · o'quvchi darsini o'tish`
1. **O'quvchi noldan yozmaydi: GitHub'dan tayyor loyihani clone qilib, ishga tushiradi**
   Ovoz: «Siz Nest'ni o'zingiz qurdingiz va o'zingiz buzdingiz. Endi darsning asosiy maqsadiga o'tamiz: bu mavzuni o'quvchiga o'tish. Avval o'quvchi darsiga qaraymiz, chunki u bu mavzuni boshqacha ko'radi. O'quvchi noldan yozmaydi: GitHub'dan tayyor loyihani clone qiladi, IntroNestArxitechture, va uni ishga tushiradi.»
2. **Loyiha kattaroq: `api` · `core` · `common` · `infrastructure` papkalari**
   Ovoz: «Loyiha kattaroq: api, core, common, infrastructure papkalari.»
3. **Yashil — bugun kod bilan ko'rdingiz: admin module, controller, service — bizning cars'ning o'zi**
   Ovoz: «Yashil belgilangan joylarni siz bugun kod bilan ko'rdingiz: admin module, admin controller, admin service va bosh modul. Ular aynan bizning cars fayllarimiz, faqat admin uchun va kattaroq. Darsda ularni kodi bilan ko'rsatasiz.»
4. **Sariq — Entity · DTO · Repository: o'quvchi so'rasa, bir gapda tushuntirasiz**
   Ovoz: «Sariq joylar: entity, dto va repository. O'quvchi darsida ular nomi va vazifasi bilan chiqadi, so'rasa bir gapda tushuntirasiz. Entity, bazadagi jadval shakli: TypeORM shu klassdan jadval yasaydi.»
5. **DTO — kiruvchi ma'lumot shakli, Repository — bazaga yozish va o'qish**
   Ovoz: «DTO, kiruvchi ma'lumot shakli: majburiy maydonlar va tiplar shu yerda tekshiriladi. Repository, bazaga yozish va o'qish metodlari: Service bazaga shu orqali murojaat qiladi. Ularning kodini kursdagi keyingi mentor darslarida to'liq o'rganasiz, hozir bir gap yetarli.»
6. **Kulrang — auth, Guard, BaseService, filter, config: nom va vazifa, bittadan gap**
   Ovoz: «Kulrang joylar. Auth moduli kirish va ro'yxatdan o'tishni qiladi. Guard so'rov Controller'ga yetguncha tokenni tekshiradi, yaroqsiz bo'lsa to'xtatadi. BaseService hamma Service uchun tayyor CRUD metodlari, admin service undan meros oladi. Token, kirgan foydalanuvchining ruxsatnomasi. successRes, hamma javob bir xil shaklda qaytishi uchun yordamchi.»
7. **Ehtiyot joy: server `api/app.service.ts`'da ishga tushadi — nomi Service, lekin Service emas**
   Ovoz: «Bitta ehtiyot joy: bu loyihada server main ts'da emas, api papkasidagi app service ts faylida ishga tushadi. Nomi app service, lekin u Service emas, serverni ishga tushiradigan klass. O'quvchi so'rasa, shuni ayting.»
8. **Xavotir olmang: bu loyihaning o'ziga xos joylarini keyingi mentor darsida clone qilib ko'rasiz**
   Ovoz: «Xavotir olmang: bu loyihaning o'ziga xos joylarini, route'lar api v1 bilan boshlanishini, xato javobining shaklini va BaseService'ni keyingi mentor darsida clone qilib, o'zingiz ko'rasiz. O'quvchi darsida esa shu gaplar yetarli.»
9. **Xulosa: strukturadagi har rangli joy uchun bitta tayyor gapingiz bor**
   Ovoz: «Xulosa: yashil fayllarni kod bilan ko'rsatasiz, sariq va kulranglarni bittadan gap bilan tushuntirib, darsga qaytasiz. O'quvchi darsi bu fayllarning kodini ochmaydi, shuning uchun bitta gap yetarli.»

---

## 32 · O'quvchi darsining tili: restoran  ← `Lesson` (`Screen25b`)
- Kicker: `7-bosqich · o'quvchi darsini o'tish`
1. **O'quvchi darsi restoran tilida gapiradi: ofitsiant, oshpaz, omborchi…**
   Ovoz: «Loyihaning fayllarini ko'rdik. Endi o'quvchi shu fayllarni qanday so'zlar bilan eslashini bilib olaylik. O'quvchi darsi restoran tilida gapiradi: Controller ofitsiant, Service oshpaz, Repository omborchi, Guard nazoratchi, Module shtat jadvali. O'quvchi shu so'zlarda o'ylaydi.»
2. **O'quvchi «oshpaz» desa — siz Service ekanini bilasiz va faylni ko'rsatasiz**
   Ovoz: «Siz endi ikkala tilni bilasiz: o'quvchi oshpaz desa, siz Service ekanini bilasiz va to'g'ri faylni ko'rsatasiz. Darsda ikkala so'zni birga ayting: oshpaz, ya'ni Service.»
3. **Xulosa: metafora vazifani tushuntiradi, kodni emas — ikkala so'zni birga ayting**
   Ovoz: «Xulosa va bitta ogohlantirish: metafora vazifani tushuntiradi, kodni emas. O'quvchi ofitsiant oshxonaga kirmaydi deganda, Controller Service'ni chaqiradi, lekin ichida hisob qilmaydi degan ma'noni tushunsin. Shu chegarani siz ushlab turasiz.»

---

## 33 · O'quvchi darsining xaritasi: 6 blok, 22 ekran  ← `Lesson` (`ScreenR1`)
- Kicker: `7-bosqich · o'tish rejasi` · Eyebrow: m4a-01 · «Nest arxitektura — tirik ko'rish»
1. **O'quvchi darsi m4a-01: 6 blok, 22 ekran — har blokda siz nima deysiz**
   Ovoz: «Loyihani ham, o'quvchi tilini ham bilasiz. Endi o'quvchi darsining o'zini ekranma-ekran ko'ramiz, chunki siz uni o'tasiz. Yigirma ikki ekran, oltita blok. Har blok uchun o'quvchi nima qiladi va siz nima deysiz.»
2. **1-blok · kirish: o'quvchi ham o'sha og'riqdan boshlaydi — Nest nomini erta aytmang**
   Ovoz: «Birinchi blok, kirish: o'quvchi ming ikki yuz qirq qatorli faylni ko'radi va tayyor loyihani clone qilish rejasini oladi. Siz buni shu darsning boshida ko'rdingiz. Nest nomini erta aytmang, avval og'riq.»
3. **2-blok · clone va ishga tushirish: eng ko'p vaqt shu yerda ketadi**
   Ovoz: «Ikkinchi blok, clone va ishga tushirish: git clone, npm install, env fayli, start dev. Eng ko'p vaqt shu yerda ketadi. Hammaning serveri ishlamaguncha oldinga o'tmang.»
4. **3-blok · Swagger va papka strukturasi: «ofitsiant» so'zi shu yerda kiradi**
   Ovoz: «Uchinchi blok: Swagger'da eshiklarni ko'radi, keyin papka strukturasini. Ofitsiant so'zi shu yerda kiradi. Strukturada module, controller, service fayllarini o'zingiz ko'rsating.»
5. **4-blok · buyurtma yo'li: bizning so'rov yo'li + Guard va Repository**
   Ovoz: «To'rtinchi blok, buyurtma yo'li: o'quvchi nazoratchi, ofitsiant, oshpaz, omborchi, lagan tartibini sudrab teradi. Bu bizning so'rov yo'li ekranimiz, faqat ikki bekat ko'p: Guard tokenni tekshiradi, Repository bazaga yozadi. Har biriga bitta gap yetarli.»
6. **5-blok · qatlamlar: Entity, DTO, BaseService — har biriga bir gap, chuqur emas**
   Ovoz: «Beshinchi blok, qatlamlar: Entity, DTO, BaseService, Module va besh qadam tartibi. Chuqur emas, har biriga bir gap. Entity, jadval shakli. DTO, kiruvchi ma'lumot shakli, noto'g'ri bo'lsa to'rt yuz. BaseService, tayyor CRUD metodlari. Module, ro'yxat. Xavotir olmang: Entity, DTO va Repository'ni kursdagi keyingi mentor darslarida to'liq, kodi bilan o'rganasiz. O'quvchi darsining bu blokida esa bir gap yetarli.»
7. **6-blok · AI bilan qurish va debugging: Controller'da hisob bo'lmaydi qoidasi ishlaydi**
   Ovoz: «Oltinchi blok: o'quvchi AI'ga beshta faylni yozdiradi, keyin yakuniy debugging, xato qatorni topib olib tashlaydi, so'ng amaliy topshiriq va arena. Debugging ekranida siz bugun o'rgangan qoida ishlaydi: Controller'da hisob bo'lmaydi.»
8. **Xulosa: eng ko'p kuch — 2-blok (server) va 6-blok (debugging)**
   Ovoz: «Xulosa: oltita blokdan ikkitasi sizdan eng ko'p kuch talab qiladi. Ikkinchisi, chunki hammaning serveri ishlashi kerak. Oltinchisi, chunki debugging'da bugungi qoidani o'quvchi o'zi topishi kerak.»

---

## 34 · O'quvchilar xato qiladigan 6 joy  ← `Lesson` (`ScreenR2`)
- Kicker: `7-bosqich · o'tish rejasi` · Eyebrow: m4a-01 · darsda nima bo'ladi
1. **Sinfda albatta uchraydigan 6 holat — har biriga tayyor javobingiz bo'lsin**
   Ovoz: «Rejani bilasiz. Endi reja buziladigan joylarni ko'raylik: darsda albatta uchraydigan oltita holat. Har biriga tayyor javobingiz bo'lsin.»
2. **1 · `git clone` ishlamaydi → zaxira: GitHub'dan ZIP yuklab olish**
   Ovoz: «Birinchi: git clone ishlamaydi. Git o'rnatilmagan yoki internet yo'q. Zaxira: GitHub'dan ZIP yuklab olib ochish. Darsdan oldin o'zingiz bir marta clone qilib ko'ring.»
3. **2 · `npm install` uzoq yoki xato → 2–5 daqiqa normal, Node 20+**
   Ovoz: «Ikkinchi: npm install uzoq yoki xato. Ikki-besh daqiqa normal. Xato bo'lsa Node versiyasini tekshiring, yigirma yoki undan yuqori bo'lsin, node modules papkasini o'chirib qayta urining.»
4. **3 · `.env` yo'q yoki PostgreSQL ishlamaydi → server yiqiladi**
   Ovoz: «Uchinchi, eng muhimi: env fayli yaratilmagan. Loyiha PostgreSQL'ga ulanadi. Bazaning manzili bo'lmasa yoki PostgreSQL ishlamasa, server ishga tushmaydi: Unable to connect to the database. Keyingi ekranda shu xatoning to'rt ko'rinishini o'qiymiz.»
5. **4 · port 3000 band → oldingi serverni yoping yoki boshqa port bering**
   Ovoz: «To'rtinchi: port uch ming band. Oldingi dars serveri ochiq qolgan. Uni yoping yoki boshqa port bilan ishga tushiring.»
6. **5 · «can't resolve» → o'quvchi bilan birga o'qing, javobni aytmang**
   Ovoz: «Beshinchi: can't resolve dependencies xatosi. Siz endi o'qiy olasiz: qaysi klass, qaysi dependency, qaysi fayl. O'quvchi bilan birga terminaldagi xabarni o'qing, javobni aytmang, savol bering: qaysi fayl, qaysi ro'yxat.»
7. **6 · «Nega Express emas?» → bitta gap: tartib kerak, ichida o'sha Express**
   Ovoz: «Oltinchi: nega Express emas degan savol yoki metafora chalkashuvi. Bitta gap: katta loyihada tartib kerak, Nest tartibni majburiy qiladi, ichida o'sha Express. Metafora chalkashsa lug'atga qaytaring.»
8. **Ogohlantirish: o'quvchi loyihasida route'lar `/api/v1` bilan boshlanadi — prefiks unutilsa 404**
   Ovoz: «Yana bitta ogohlantirish: o'quvchi loyihasida hamma route api v1 bilan boshlanadi, admin emas, api v1 admin. Prefiks unutilsa to'rt yuz to'rt chiqadi. Bu loyihani keyingi mentor darsida to'liq, clone qilib ko'rasiz.»
9. **Xulosa: darsdan oldin loyihani o'zingiz bir marta ko'taring — o'quvchilar xato qiladigan joyni oldindan bilasiz**
   Ovoz: «Xulosa: bu holatlarning ko'pi darsning birinchi yigirma daqiqasida chiqadi. Shuning uchun darsdan oldin loyihani o'zingiz bir marta clone qilib, env bilan ishga tushirib ko'ring: qayerda qoqilish mumkinligini o'zingiz his qilasiz.»

---

## 35 · Baza ulanmadi: to'rt xabar, to'rt sabab  ← `Lesson` (`ScreenRdb`)
- Kicker: `7-bosqich · o'tish rejasi` · Eyebrow: m4a-01 · sinfda eng ko'p chiqadigan xato
1. **O'quvchi loyihasi PostgreSQL'ga ulanadi — sinfdagi 1-xato shu, sabab doim 2-satrda**
   Ovoz: «Oldingi ekrandagi uchinchi holatni, env va PostgreSQL'ni, alohida ko'ramiz, chunki sinfda eng ko'p vaqt shunga ketadi. Bugun to'rt Nest xatosini o'rgandingiz. Lekin sinfda eng ko'p chiqadigani boshqa: o'quvchi loyihasi PostgreSQL'ga ulanadi, va ulanish ko'pincha birinchi urinishda bo'lmaydi. Xabar har doim bir xil boshlanadi: Unable to connect to the database, Retrying. Sabab esa ikkinchi satrda. To'rtta haqiqiy holat.»
2. **1 · ECONNREFUSED → PostgreSQL ishlamayapti: PostgreSQL'ni ishga tushiring**
   Ovoz: «Birinchi: connect ECONNREFUSED, manzil va port. Demak shu portda hech kim javob bermayapti: PostgreSQL ishlamayapti yoki env faylida port noto'g'ri. Yechim: PostgreSQL'ni ishga tushiring. Windows'da Services oynasida postgresql'ni Start qilasiz, Mac va Linux'da jadvaldagi buyruq bilan. Keyin portni tekshiring.»
3. **2 · client password must be a string → .env yo'q: `cp .env.example .env`**
   Ovoz: «Ikkinchi, eng chalg'ituvchisi: client password must be a string. Bu parol noto'g'ri degani emas. Parol umuman yo'q, undefined: env fayli yo'q. O'quvchi loyihasida tayyor namuna bor, env example fayli. Yechim bitta: shu namunadan nusxa olib, env faylini yaratish, ichidagi parolni o'ziniki bilan almashtirish va serverni qayta ishga tushirish. Sinfda buni hammaga birinchi bo'lib ayting.»
4. **3 · password authentication failed → .env'dagi parol noto'g'ri: o'z parolingizni yozing**
   Ovoz: «Uchinchi: password authentication failed for user. Bu endi haqiqatan parol yoki foydalanuvchi nomi noto'g'ri. Sinfda bu tez-tez chiqadi, chunki env example'dagi parol shunchaki password so'zi. Yechim: DEV DB URL ichiga o'quvchining o'z PostgreSQL parolini yozish.»
5. **4 · database … does not exist → baza yaratilmagan: `createdb`**
   Ovoz: «To'rtinchi: database, nomi, does not exist. Ulanish bor, parol ham to'g'ri, lekin PostgreSQL'da bunday nomli baza yo'q: uni hali hech kim yaratmagan. O'quvchi loyihasida nom DEV DB URL oxirida, nestarxitechture. Yechim: shu nom bilan bazani yaratish.»
6. **Xulosa: «Unable to connect» → kodga tegmang — 2-satrni o'qing, .env va PostgreSQL'ni tekshiring**
   Ovoz: «TypeORM o'n marta qayta urinadi, keyin server yiqiladi. Xulosa va qoida: Unable to connect ko'rsangiz, kodga tegmang, muammo kodda emas. Ikkinchi satrni o'qing, env faylini va PostgreSQL'ni tekshiring. Bu to'rt xabar eslatmada ham bor.»

---

## 36 · Vaqt rejasi va uch qoida  ← `Lesson` (`ScreenR3`)
- Kicker: `7-bosqich · o'tish rejasi` · Eyebrow: m4a-01 · 90 daqiqa (taklif)
1. **Taklif: 90 daqiqa, oltita bo'lak — sinfingizga qarab o'zgartirasiz**
   Ovoz: «O'quvchilar xato qiladigan joylarni va ularning yechimini bilasiz. Endi vaqtni rejalaymiz. Taklif qilingan vaqt rejasi: to'qson daqiqa, oltita bo'lak. Bu taklif, sinfingizga qarab o'zgartirasiz.»
2. **0–30: kirish va clone — hammada server ishlaguncha oldinga o'tmang**
   Ovoz: «Birinchi o'ttiz daqiqa: kirish va clone. Eng xavfli bo'lak clone va ishga tushirish, shuning uchun unga yigirma daqiqa.»
3. **30–60: Swagger, papkalar xaritasi, buyurtma yo'li va uchta test**
   Ovoz: «O'ttizdan oltmishgacha: Swagger, bino xaritasi, buyurtma yo'li va uchta test.»
4. **60–90: qatlamlar, AI bilan qurish, debugging va arena**
   Ovoz: «Oltmishdan to'qsongacha: qatlamlar, AI bilan qurish, yakuniy debugging va arena.»
5. **Xulosa — uch qoida: server avval · ikki so'z birga · xabarni birga o'qish**
   Ovoz: «Xulosa: uch qoida. Birinchi: hammaning serveri ishlamaguncha oldinga o'tmang. Ikkinchi: metafora va atamani birga ayting, oshpaz, ya'ni Service. Uchinchi: xato chiqsa terminaldagi xabarni o'quvchi bilan birga o'qing, javobni aytmang.»

---

## 37 · O'quvchi so'raydigan savollar  ← `Lesson` (`Screen26`)
- Kicker: `7-bosqich · savollar`
1. **Darsda sizga beriladigan 6 savol va tayyor javoblar**
   Ovoz: «Dars rejasi tayyor. Oxirgi tayyorgarlik: o'quvchi sizga beradigan savollar. Ular taxminan shular bo'ladi.»
2. **1 · «Nega Express emas?» → katta loyihada tartib kerak, ichida o'sha Express**
   Ovoz: «Birinchisi: nega Express emas, Nest? Javob: loyiha katta bo'lganda tartib kerak, Nest tartibni majburiy qiladi, ichida esa o'sha Express.»
3. **2 · «Decorator nima?» → klass ustidagi belgi: Nest'ga «bu nima»ligini aytadi**
   Ovoz: «Ikkinchisi: decorator nima? Klass yoki metod ustidagi belgi, Nest'ga shu narsa nima ekanini aytadi.»
4. **3 · «providers nima?» → modul yaratib beradigan narsalar, asosan Service'lar**
   Ovoz: «Uchinchisi: providers nima? Shu modul yaratib beradigan narsalar, asosan Service'lar.»
5. **4 · «Nega alohida Service?» → alohida sinash va qayta ishlatish uchun**
   Ovoz: «To'rtinchisi: Service'ni nega alohida qildik? Alohida sinash va qayta ishlatish uchun, Controller'da esa logika qolmaydi.»
6. **5 · «Nest tezroqmi?» → yo'q, ichida Express; Nest tezlik emas, tartib beradi**
   Ovoz: «Beshinchisi: Nest tezmi? Yo'q, tezlik bir xil, chunki ichida Express. Nest tezlik emas, tartib beradi.»
7. **6 · «Injectable'siz ishlayapti-ku?» → hozircha; dependency qo'shilsa — yashirin xato, 500**
   Ovoz: «Oltinchisi: Injectable'ni o'chirdim, ishlayapti. Dependency'si bo'lmagani uchun; dependency paydo bo'lganda server ishga tushadi, lekin so'rovda besh yuz, yashirin xato. Shuning uchun doim yoziladi.»
8. **Xulosa: javob bera olmagan savolingiz bo'lsa — darsdagi o'sha ekranga qayting**
   Ovoz: «Xulosa: bu oltita javob sizda tayyor bo'lsin. Har kartani bosib, javobni o'zingiz yana o'qing. O'zingiz javob bera olmaydigan savol bo'lsa, darsdagi o'sha ekranga qayting.»

---

## 38 · O'z-sinov — 8 savol  ← `Maxsus` (`Screen27`)
- O'z-sinov: 8 savol, bitta urinish, 6+ — o'zlashtirildi; noto'g'ri savoldan ko'rsatilgan ekranga qaytiladi.
  1. Nest ichida so'rovni haqiqatda qaysi kutubxona qabul qiladi?
     A) Nest'ning o'z HTTP serveri
     B) Express (platform-express)  ✔
     C) Node http moduli bevosita
     D) Har doim Fastify
     Izoh: Nest Express ustidagi qatlam; Fastify'ga almashtirish mumkin, lekin standart Express. · ekran 3
  2. @Controller('cars') va @Get(':id') birga qaysi path'ni ochadi?
     A) /cars?id=5
     B) /id/cars
     C) /cars/5  ✔
     D) /:id/cars
     Izoh: Controller prefiksi + metod yo'li. · ekran 18
  3. POST metodida status yozilmagan. Nest nima qaytaradi?
     A) 200
     B) 201  ✔
     C) 204
     D) 202
     Izoh: Nest POST uchun 201 ni o'zi qo'yadi. · ekran 20
  4. «Nest can't resolve dependencies of the X (?)» — so'roq belgisi nimani bildiradi?
     A) Noma'lum modul — import yo'q
     B) Topilmagan argumentning o'rni  ✔
     C) Sintaksis xatosi — qavs yopilmagan
     D) Route yo'q — Controller bo'sh
     Izoh: Qavs ichida konstruktor argumentlari, ? — topilmagani. · ekran 23
  5. Server «successfully started», /cars 404, terminalda Mapped {/cars…} yo'q. Eng ehtimoliy sabab?
     A) CarsModule AppModule imports'ida yo'q  ✔
     B) Injectable yo'q — CarsService ulanmagan
     C) Port band — server boshqa portda
     D) Service'da xato — u 404 qaytaradi
     Izoh: Yashirin xato: modul ulanmagan, Nest papkani o'qimagan. · ekran 24
  6. Service ichida throw new Error('x'). Mijozga nima boradi?
     A) 404 va «x»
     B) 500 Internal server error  ✔
     C) 400
     D) Hech narsa, server yiqiladi
     Izoh: Oddiy Error → 500, xabar yashiriladi. · ekran 28
  7. Yangi xabar: «Nest can't resolve dependencies of the UsersService (?, JwtService). Please make sure that the argument ConfigService at index [0] is available in the UsersModule module.» Nima qilasiz?
     A) users.module.ts — providers'ga ConfigService  ✔
     B) users.service.ts — konstruktordan JwtService'ni o'chirish
     C) app.module.ts — controllers'ga UsersService qo'shish
     D) UsersService'ga @Injectable() qo'shish
     Izoh: Klass: UsersService · dependency: ConfigService, index [0] · fayl: users.module.ts (UsersModule). JwtService topilgan (ikkinchi o'rin), muammo unda emas. · ekran 23
  8. orders.module.ts: controllers: [OrdersController], providers: [] — OrdersController konstruktorida OrdersService so'ralgan. Server nima qiladi?
     A) Ishga tushadi, /orders → 404 qaytadi
     B) Yiqiladi: can't resolve dependencies (?)  ✔
     C) Ishga tushadi, /orders → 500 qaytadi
     D) Yiqiladi: invalid controller detected
     Izoh: providers bo'sh → Nest OrdersService'ni topa olmaydi → ishga tushishda yiqiladi (1-buzish bilan bir xil). · ekran 23

---

## 39 · Yakun: xulosa, uyga vazifa, eslatma  ← `Maxsus` (`Screen28`)
1. [a] **Barakalla! Siz darsni yaxshi o'rgandingiz — bugungi darsni bir qarashda yig'amiz**
   Ovoz: «Barakalla! Siz darsni yaxshi o'rgandingiz. Endi bugun o'rganganlaringizni bir qarashda yig'amiz.»
2. [a] **Dars oxiriga yetdingiz — sinovni qayta topshirishni maslahat beraman**
   Ovoz: «Dars oxiriga yetdingiz. Yakuniy sinovdan olti ball kerak edi, yakunlashdan oldin sinovni qayta topshirishni maslahat beraman. Hozir esa bugungi darsni bir qarashda yig'amiz.»
3. [b1] **Nest — Express ustidagi majburiy tartib**
   Ovoz: «Birinchi: Nest bu Express ustidagi majburiy tartib. Ichida o'sha Express ishlaydi.»
4. [b2] **Controller so'rovni oladi, Service'ni chaqiradi, javobni qaytaradi — logika yozilmaydi**
   Ovoz: «Ikkinchi: Controller so'rovni oladi, Service'ni chaqiradi va javobni qaytaradi. Unda hisob yo'q.»
5. [b3] **Service ishni bajaradi va so'rov haqida bilmaydi**
   Ovoz: «Uchinchi: Service ishni bajaradi va so'rov haqida hech narsa bilmaydi. Shuning uchun uni alohida sinash va qayta ishlatish oson.»
6. [b4] **Module — ro'yxat: Nest faqat ro'yxatdagini ko'radi**
   Ovoz: «To'rtinchi: Module ro'yxat. Nest faqat ro'yxatda yozilganini ko'radi.»
7. [b5] **Dependency Injection: providers'ga yozasiz, konstruktorda so'raysiz — Nest inject qiladi**
   Ovoz: «Beshinchi: Dependency Injection. Siz Service'ni providers'ga yozasiz va konstruktorda so'raysiz, yaratib inject qilishni Nest qiladi.»
8. [b6] **Nest xatosi o'qiladi: qaysi klass · qaysi dependency · qaysi fayl**
   Ovoz: «Va eng muhimi: Nest xatosi o'qiladi. Xabarda qaysi klass, qaysi dependency yetishmayapti va qaysi faylni ochish kerakligi yozilgan, javob esa ko'pincha modul faylida.»
9. [hw] **Uyga vazifa: cars-api'ga `users` modulini o'zingiz qo'shing va GitHub'ga chiqaring**
   Ovoz: «Uyga vazifa. cars api loyihangizga users modulini shu darsdagi usulda qo'shing: uchta CLI buyrug'i, Service'da foydalanuvchilar ro'yxati va findAll, findOne, create metodlari, topilmasa NotFoundException. Controller'da uchta route. Keyin bir marta ataylab buzing, masalan providers'ni bo'shating, xabarni o'qing va tuzating. Tayyor loyihani GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying.»
10. [c] **Eslatmani oling: buyruqlar, xatolar, qoidalar va uyga vazifa — bir sahifada**
   Ovoz: «Pastda bir sahifalik eslatma: buyruqlar, to'rt Nest xatosi, baza ulanish xatolari, qoidalar, o'quvchi darsi lug'ati va uyga vazifa. Nusxalab yoki yuklab oling, o'quvchi darsini o'tayotganda yoningizda tursin.»
11. [z] **Rahmat! Darsni yakunlash tugmasini bosing**
   Ovoz: «Rahmat. Darsni yakunlash tugmasini bosing, dars tugallangan deb belgilanadi.»
- Uyga vazifa:
  1. users moduli — `nest g module users` · `nest g controller users --no-spec` · `nest g service users --no-spec`
  2. Service: foydalanuvchilar ro'yxati + findAll, findOne, create; topilmasa NotFoundException
  3. Controller: GET /users · GET /users/:id · POST /users — terminalda 3 ta Mapped
  4. Bir marta ataylab buzing (providers'ni bo'shating), xabarni o'qing, tuzating
  5. GitHub'ga chiqaring va repo linkini platformadagi uyga vazifangizga qo'ying — `git add . && git commit -m "users moduli"` · `git push`
- Eslatma (.md, yuklab olinadi):

```markdown
# Nest-1 — mentor eslatmasi
## Buyruqlar
npm i -g @nestjs/cli · nest new cars-api · npm run start:dev
nest g module cars · nest g controller cars --no-spec · nest g service cars --no-spec
## Uch bo'lak
Controller — so'rovni oladi, Service'ni chaqiradi, qaytaradi (logika yozilmaydi)
Service — ish: hisob, qoida, baza; req/res yo'q; @Injectable()
Module — ro'yxat: imports · controllers · providers; ro'yxatda yo'q = Nest uchun yo'q
## Dependency Injection
constructor(private readonly carsService: CarsService) — siz yaratmaysiz, Nest providers'dan yaratib beradi (1 instance)
## 4 xato
1 «can't resolve dependencies of the X (?) … argument Y at index [0] … in the Z module» → Z modulining providers'iga Y
2 server ishga tushdi, /cars 404, terminalda Mapped {/cars…} yo'q → AppModule imports: [CarsModule]
3 «invalid controller … does not have the @Controller() decorator» → decorator'ni qaytaring
4 @Injectable'siz ishlaydi (dependency yo'q) → dependency qo'shilsa: server ishga tushadi, so'rovda 500 TypeError (yashirin xato) → baribir yoziladi
## Baza ulanmadi (o'quvchi loyihasi, TypeORM — «Unable to connect to the database. Retrying (1)…», 10 urinish, keyin yiqiladi)
connect ECONNREFUSED 127.0.0.1:5432 → PostgreSQL'ni ishga tushiring (Windows: Services → postgresql; Mac: brew services start postgresql; Linux: sudo systemctl start postgresql)
SASL … client password must be a string → .env yo'q: cp .env.example .env, parolni o'zingiznikiga almashtiring
password authentication failed for user → .env.example'dagi parol «password» — DEV_DB_URL'ga o'z parolingiz
database "…" does not exist → createdb -U postgres nestarxitechture (nom — DEV_DB_URL oxirida)
## Yordam
Hech biri mos kelmasa: skrinshot + xato matni → mentor-kurs Telegram guruhi
## Xato turi
HttpException oilasi (NotFound 404, BadRequest 400, Unauthorized 401, Forbidden 403) → status + xabar · oddiy Error → 500, xabar yashirin
## Javoblar
GET /cars 200 · GET /cars/1 200 · GET /cars/99 404 · POST /cars 201 (o'zi) · /cars/abc → 404 «NaN» (tekshiruv yo'q; @Param('id', ParseIntPipe) yoki DTO + ValidationPipe → 400)
## O'quvchi darsi tili
ofitsiant=Controller · oshpaz=Service · omborchi=Repository · javon chizmasi=Entity · anketa=DTO · nazoratchi=Guard · shtat jadvali=Module
## Uch qoida (dars o'tishda)
hammada server ishlaguncha oldinga o'tmang · «oshpaz, ya'ni Service» · xato chiqsa terminaldagi xabarni birga o'qing, javobni aytmang
## Uyga vazifa
cars-api'ga users moduli: nest g module/controller/service users · Service: ro'yxat + findAll/findOne/create, topilmasa NotFoundException · Controller: GET /users · GET /users/:id · POST /users · bir marta ataylab buzing (providers bo'sh) va tuzating · GitHub'ga push → repo linki platformadagi uyga vazifaga
```

