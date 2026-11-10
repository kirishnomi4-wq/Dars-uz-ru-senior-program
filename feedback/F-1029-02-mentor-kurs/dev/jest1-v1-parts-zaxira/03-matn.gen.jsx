
// ============================================================
//  JEST-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/jest1-matn.py (manba: 10-Jest1-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Jest",
  "title": "Kodni o'zgartirdingiz. Hisob hali ham to'g'rimi — buni test aytadi.",
  "seg": [
   [
    "a",
    "Kod o'zgarganda eski hisoblar buzilmaganini har safar <b>qo'lda tekshirib bo'lmaydi</b>",
    "Assalomu alaykum. Loyihada kod har kuni o'zgaradi. Har o'zgarishdan keyin eski hisoblar buzilmaganini qo'lda tekshirib bo'lmaydi: beshta hisob bo'lsa ham, ellikta bo'lsa ham. Bu ishni kompyuterga topshirish mumkin. Bu unit-test deyiladi, uni Jest ishga tushiradi."
   ],
   [
    "b",
    "Bugun o'quvchi reposida <b>birinchi testni yozasiz</b> va natijasini o'qiysiz",
    "Bugun Nest darslaridagi o'quvchi reposida birinchi testni yozasiz. Misol o'quvchi darsidagi aynan funksiya: KitobShop'dagi buyurtma summasi. Test yashil bo'lganda va qizil bo'lganda terminal nima deyishini o'qishni o'rganasiz."
   ],
   [
    "c",
    "Testni ataylab buzamiz: <b>yolg'on yashil</b> va <b>noto'g'ri qizil</b> — ikkalasini tanib olasiz",
    "Keyin testni ataylab buzamiz. Ba'zi test hech narsani tekshirmasa ham yashil bo'ladi, ba'zisi kod to'g'ri bo'lsa ham qizil. O'quvchi AI'dan test so'raydi, shuning uchun bu ikkisini tanish sizga albatta kerak."
   ],
   [
    "d",
    "Olti bosqich, to'rt amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Oxirida sinfdagi sozlash tuzoqlarini va o'quvchi darsini qanday o'tishni ko'ramiz. Dars olti bosqichdan iborat, to'rtta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · unit-test",
  "title": "Funksiya kirishni oladi, natija qaytaradi — test shu juftni tekshiradi",
  "seg": [
   [
    "a",
    "O'quvchi darsi funksiyani <b>mashina</b> deb tushuntiradi: kirish beriladi, natija chiqadi",
    "Testga o'tishdan oldin funksiyaga boshqacha qaraymiz. O'quvchi darsi uni mashina deb tushuntiradi: kirish berasiz, u natija qaytaradi. orderTotal'ga narx va soni beriladi, u summani qaytaradi. Masalan, o'n ming va ikkini bersak, natija yigirma ming bo'ladi."
   ],
   [
    "b",
    "Unit-test — shu juftni yozib qo'yish: <b>«shu kirishga aynan shu chiqish»</b>",
    "Unit-test shu juftni yozib qo'yadi: shu kirishga aynan shu chiqish bo'lishi kerak. Bir marta yoziladi va har safar bitta buyruq bilan tekshiriladi. Unit bitta bo'lak degani: test bitta funksiyani bazasiz va serversiz sinaydi."
   ],
   [
    "c",
    "Funksiyaning o'zi uch satr: <b><code>src/order.ts</code></b> — narx ko'paytirish soni",
    "Funksiyaning o'zi uch satr, o'quvchi reposida src papkasidagi order ts faylida turadi. U narxni soniga ko'paytiradi. Hozir bu oddiy, lekin keyinroq ichiga chegirma yoki soliq qo'shilsa, test eski hisoblar buzilmaganini aytadi."
   ],
   [
    "d",
    "Xulosa: unit-test — bitta funksiya, bitta kirish, <b>bitta kutilgan natija</b>",
    "Xulosa: unit-test bitta funksiyani alohida sinaydi. Unda uch narsa bor: kirish, kutilgan natija va ularni solishtiradigan bitta tasdiq. Kutilgan natijani bugun etalon deb ataymiz, o'quvchi darsida u etalon kartochkasi."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · unit-test",
  "title": "package.jsondagi jest bo'limi: src ichida, nomi .spec.ts",
  "seg": [
   [
    "a",
    "Nest loyihasi Jest bilan birga yaratiladi — o'quvchi reposida u <b>allaqachon sozlangan</b>",
    "Avval yaxshi xabar: Nest loyihasi Jest bilan birga yaratiladi. O'quvchi reposining package json faylida test buyrug'i ham, jest bo'limi ham tayyor. Hech narsa o'rnatish shart emas, npm install yetarli."
   ],
   [
    "b",
    "Uch satr muhim: <code>rootDir</code> — <b><code>src</code></b>, <code>testRegex</code> — <b><code>.spec.ts</code></b>, <code>transform</code> — <code>ts-jest</code>",
    "Jest bo'limida uchta satr muhim. Birinchisi root dir src: Jest faqat src papkasi ichini qaraydi. Ikkinchisi test regex: fayl nomi spec ts bilan tugashi kerak. Uchinchisi transform ts jest: TypeScript faylni Jest tushunadigan ko'rinishga o'tkazadi."
   ],
   [
    "c",
    "Hozir <code>npm test</code> — <b><code>No tests found</code></b>: repoda hali birorta test yo'q",
    "Hozir npm test qilsak, Jest no tests found deydi, ya'ni test topilmadi, chiqish kodi esa bir. Jest o'ttiz yettita faylni ko'rdi, lekin ularning hech biri spec ts emas. Bu xato emas: o'quvchi birinchi testini yozmaguncha shunday bo'ladi."
   ],
   [
    "d",
    "Xulosa: test fayli — <b><code>src/</code> ichida</b> va nomi <code>.spec.ts</code> bilan tugaydi",
    "Xulosa: o'quvchi reposida Jest tayyor, faqat ikki shart bor. Test fayli src papkasi ichida turadi va nomi spec ts bilan tugaydi. Bu ikki shartdan biri buzilsa, Jest testni ko'rmaydi. Sinfdagi eng ko'p savol aynan shu."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "O'quvchi order.spec.ts yozdi va npm test qildi — No tests found. Birinchi nimani tekshirasiz?",
  "q": "Jest sozlamasini ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. O'quvchi order spec ts faylini yozdi va npm test qildi, javob esa no tests found bo'ldi. Fayl ichidagi kod to'g'ri. Birinchi nimani tekshirasiz? Variantni tanlang.",
  "ok": "To'g'ri, birinchi navbatda faylning joyini tekshirasiz. Sinab ko'rdik: xuddi shu fayl loyiha ildizida tursa, Jest uni ko'rmaydi va no tests found deydi, chunki root dir src. Fayl src ichiga ko'chirilsa, test topiladi. Nomi ham muhim: order test ts bo'lsa ham topilmaydi. Demak, no tests found chiqsa, avval test fayli src ichida turganini va nomi spec ts bilan tugashini tekshiring.",
  "okShort": "<code>rootDir: src</code> — <code>src/</code>dan tashqaridagi fayl ko'rinmaydi. Nomi ham: <code>.test.ts</code> emas, <code>.spec.ts</code>.",
  "hint": "Xabar «test topilmadi» deyapti, «xato» emas. Jest testni qayerdan va qaysi nom bilan qidiradi?",
  "correct": 2,
  "opts": [
   "npm install qayta qilinsin",
   "expect to'g'ri yozilganmi",
   "Fayl qayerda turibdi — src/ ichidami",
   "Jest versiyasi"
  ],
  "wrong": {
   "0": "Jest o'rnatilmagan bo'lsa jest: not found chiqardi, No tests found emas.",
   "1": "expect xato bo'lsa test topilib, FAIL bo'lardi.",
   "3": "Versiya topish qoidasiga ta'sir qilmaydi — qoida package.jsonda."
  }
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · birinchi test",
  "title": "order.spec.ts — to'rt qism: import, describe, it, expect",
  "seg": [
   [
    "a",
    "Test fayli <b>funksiya yonida</b>: <code>order.ts</code> — <code>order.spec.ts</code>, ikkalasi <code>src/</code> ichida",
    "Test fayli funksiyaning yonida turadi: order ts yonida order spec ts. Birinchi qatordagi import funksiyani test fayliga olib kiradi. Jest bu faylni nomidan topadi va ichidagi testlarni ishga tushiradi."
   ],
   [
    "b",
    "<code>describe</code> — <b>guruh</b>: bitta funksiyaning testlari bir joyda, nomi bilan",
    "Describe bitta funksiyaning hamma testlarini guruhlaydi. Uning birinchi argumenti guruh nomi: orderTotal. Natijada shu nom ko'rinadi, shuning uchun qaysi funksiya xato berganini darhol bilasiz."
   ],
   [
    "c",
    "<code>it</code> — <b>bitta holat</b>, nomi oddiy gap bilan: «2 kitob narxini hisoblaydi»",
    "It bitta holatni sinaydi. Nomi oddiy gap bilan yoziladi: ikki kitob narxini hisoblaydi. Test qizil bo'lganda aynan shu gap chiqadi, shuning uchun nom tushunarli bo'lishi kerak."
   ],
   [
    "d",
    "<code>expect(result).toBe(20000)</code> — <b>tasdiq</b>: natija etalonga teng bo'lishi shart",
    "Eng muhim qator shu: expect, result, to be yigirma ming. Bu tasdiq: natija aynan yigirma ming bo'lishi kerak. Tepadagi qator funksiyani chaqiradi, bu qator tekshiradi. Tayyorlash, chaqirish, tekshirish: o'quvchi darsida bu uch qadam deyiladi."
   ],
   [
    "e",
    "Xulosa: <code>describe</code> — kim sinaladi, <code>it</code> — qaysi holat, <b><code>expect</code> — nima kutiladi</b>",
    "Xulosa: describe qaysi funksiya sinalayotganini aytadi, it qaysi holatni, expect esa nima kutilayotganini. Testda haqiqatan tekshiradigan yagona qator expect. Uchinchi bosqichda ko'rasiz: expect'ni unutgan test hech narsani tekshirmaydi."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · birinchi test",
  "title": "PASS src/order.spec.ts — fayl, guruh, holat va jami",
  "seg": [
   [
    "a",
    "<code>npm test</code> — <code>package.json</code>dagi <code>jest</code> buyrug'i: <b>fayl topildi va yurdi</b>",
    "Testni yozdik, endi npm test buyrug'ini beramiz. Bu package json'dagi jest buyrug'ini ishga tushiradi. Birinchi yashil satrda PASS va fayl yo'li turibdi: src order spec ts. Fayl topildi va undagi hamma test o'tdi."
   ],
   [
    "b",
    "Ostida guruh nomi va holat: <code>orderTotal</code> → <b><code>✓ 2 kitob narxini hisoblaydi</code></b>",
    "Uning ostida describe nomi, orderTotal, yozilgan, undan pastda esa belgi bilan it nomi: ikki kitob narxini hisoblaydi, ikki millisekundda. Nomlar aynan siz yozgan gaplar, shuning uchun ular tushunarli yozilishi kerak."
   ],
   [
    "c",
    "Pastda jami: <code>Test Suites</code> — fayllar, <code>Tests</code> — <b><code>it</code>lar soni</b>",
    "Eng pastda jami turadi. Test suites fayllar sonini aytadi: bitta fayl, u o'tdi. Tests esa it'lar sonini aytadi: bitta. Testlar ko'paygach, sinfda o'quvchi bilan shu ikki satrga qaraysiz: nechta o'tdi, nechta yiqildi."
   ],
   [
    "d",
    "Xulosa: PASS — fayl va holatlar o'tdi; <code>Tests:</code> satri — <b>nechta <code>it</code> tekshirildi</b>",
    "Xulosa: PASS fayl va undagi hamma holat o'tganini bildiradi. Tests satri nechta it tekshirilganini aytadi. Lekin diqqat: PASS faqat expect'lar to'g'ri bo'lsa ma'noli. Buni uchinchi bosqichda isbotlaymiz."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "O'quvchi reposida order.ts va order.spec.ts",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi reposida birinchi testni yozib, <b>yashil PASS</b>'ni ko'rasiz",
    "Endi navbat sizga. O'quvchi reposida birinchi testni yozasiz. Nest darsidagi repo sizda bo'lsa, o'shani oching; bo'lmasa clone va npm install qiling. Bunga o'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>npm test</code> — avval <b><code>No tests found</code></b>, keyin <code>src/order.ts</code>",
    "Birinchi qadamda hech narsa yozmasdan npm test qiling va no tests found chiqishini ko'ring. Ikkinchisida src papkasida order ts faylini ochib, uch satrli funksiyani yozing."
   ],
   [
    "c",
    "3–4-qadam: <code>src/order.spec.ts</code> va <code>npm test</code>; isbot — <b><code>Tests:</code> satri</b>",
    "Uchinchi qadamda uning yonida order spec ts faylini oching va kodni nusxalamasdan o'zingiz yozing. To'rtinchisida npm test qiling. Isbot maydoniga natijadagi Tests satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin o'quvchi reposida sizning birinchi testingiz bor va siz PASS natijasini o'qiy olasiz."
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "* o'rniga + — Expected: 20000, Received: 10002",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi tajriba: ko'paytirish o'rniga qo'shish — <b>test buni tutadimi?</b>",
    "O'quvchi darsidagi tajribani qilamiz: funksiyada ko'paytirish o'rniga xato bilan qo'shish yozildi. Kod ishlaydi, xato bermaydi, lekin natija noto'g'ri. npm test buni tutadimi?"
   ],
   [
    "b",
    "<code>FAIL</code> va <code>●</code> satri: qaysi fayl, qaysi guruh va <b>qaysi holat yiqildi</b>",
    "Test buni tutdi: qizil FAIL chiqdi. Undan pastda nuqta bilan boshlangan satr bor: orderTotal, strelka, ikki kitob narxini hisoblaydi. U qaysi guruh va qaysi holat yiqilganini aytadi. Nomlar tushunarli bo'lsa, faylni ochmasdan ham nima buzilganini bilasiz."
   ],
   [
    "c",
    "<code>Expected</code> — etalon, <code>Received</code> — funksiya qaytargani: <b>20000 kutildi, 10002 keldi</b>",
    "Endi eng muhim ikki satr. Expected, ya'ni kutilgan qiymat yigirma ming: bu siz yozgan etalon. Received, ya'ni olingan qiymat o'n ming ikki: buni funksiya qaytardi, chunki o'n mingga ikki qo'shildi. Farqni ko'rib, xato qayerdaligini taxmin qilasiz."
   ],
   [
    "d",
    "<code>&gt;</code> belgisi va <code>order.spec.ts:6:20</code> — testdagi <b>qaysi satr yiqilganini</b> ko'rsatadi",
    "Pastda test faylining bo'lagi ko'rinadi, strelka oltinchi satrni, ya'ni expect'ni ko'rsatadi. Eng oxirida fayl, satr va ustun yozilgan: order spec ts, olti, yigirma. Diqqat: bu test yiqilgan joy, xato esa funksiyada, order ts'da. Funksiyada yana ko'paytirishni yozamiz va test yashil bo'ladi."
   ],
   [
    "e",
    "Xulosa: <b>FAIL o'qish tartibi</b> — <code>●</code> satr, <code>Expected</code>/<code>Received</code>, keyin funksiyaning o'zi",
    "Xulosa: FAIL'ni shu tartibda o'qing. Avval nuqtali satrdan qaysi holat yiqilganini o'qing. Keyin expected va received'dan nima kutilgani va nima kelganini ko'ring. Oxirida funksiyani oching. Sinfda o'quvchiga javobni aytmang, shu uch qadamni birga o'qing."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "toBe(10002) — Expected: 10002, Received: 20000: xato testning o'zida",
  "seg": [
   [
    "a",
    "Endi aksincha: funksiya to'g'ri, lekin <b>etalon xato yozildi</b> — 10002",
    "Endi aksincha: funksiya to'g'ri, unda ko'paytirish turibdi. Lekin testda etalon xato yozildi: o'n ming ikki. Bu o'quvchi darsidagi burilish: robot etalonga ishonadi."
   ],
   [
    "b",
    "FAIL: <code>Expected: 10002</code>, <code>Received: 20000</code> — o'rinlari 8-ekrandagiga <b>teskari</b>",
    "Natija yana qizil. Lekin qarang: expected o'n ming ikki, received yigirma ming. Bu sakkizinchi ekrandagiga teskari. Funksiya to'g'ri hisobladi, test noto'g'ri narsani kutdi."
   ],
   [
    "c",
    "Qizil test har doim <b>kod xato degani emas</b>: avval etalonni qo'lda tekshiring",
    "Demak qizil test har doim kod xato degani emas. Avval etalonni qo'lda hisoblang: o'n ming ko'paytirish ikki, yigirma ming. Etalon xato bo'lsa, testni tuzatasiz, kodni emas. Aks holda o'quvchi to'g'ri kodni buzib qo'yadi."
   ],
   [
    "d",
    "Xulosa: FAIL'da — <b>kim xato</b>: funksiyami yoki etalonmi? Etalonni qo'lda hisoblang",
    "Xulosa: FAIL chiqqanda birinchi savol: kim xato, funksiyami yoki etalonmi. Etalonni qo'lda hisoblang. Etalon to'g'ri bo'lsa, funksiyani tuzating. Noto'g'ri bo'lsa, testni tuzating."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "console.log bor, expect yo'q — test hech narsani tekshirmay yashil bo'ldi",
  "seg": [
   [
    "a",
    "Eng xavfli test — <code>expect</code>siz: natija chiqariladi, lekin <b>solishtirilmaydi</b>",
    "Endi eng xavfli holat. Testda expect o'rniga console log yozildi: natija ekranga chiqadi, lekin hech narsa bilan solishtirilmaydi. AI ham, o'quvchi ham buni ko'p qiladi."
   ],
   [
    "b",
    "Natija: <code>console.log 20000</code> va yashil PASS — test <b>hech narsani tekshirmadi</b>",
    "Natijada terminalga console log orqali yigirma ming chiqdi va yashil PASS turibdi. Ikki kitob narxini hisoblaydi degan holat ham tasdiq belgisi bilan. Lekin bu test hech narsani tekshirmadi. Funksiya bir million qaytarsa ham yashil bo'lardi."
   ],
   [
    "c",
    "Jest qoidasi: <code>it</code> ichida xato chiqmasa — holat o'tdi; tekshiruvni <b>faqat <code>expect</code></b> qiladi",
    "Nega yashil? Jest uchun qoida oddiy: it ichida xato chiqmasa, holat o'tdi. Xato chiqaradigan narsa faqat expect: natija etalonga teng bo'lmasa, u FAIL beradi. Expect yo'q bo'lsa, yiqilish ham yo'q."
   ],
   [
    "d",
    "Xulosa: har <code>it</code>da kamida bitta <code>expect</code> — aks holda <b>PASS yolg'on</b>",
    "Xulosa: har it ichida kamida bitta expect bo'lishi shart. Sinfda yashil natijaga ishonishdan oldin it ichiga qarang: expect bormi? O'quvchi darsida buni yolg'on test deyishadi."
   ]
  ]
 },
 "11": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Bu test doim yashil — hech narsani tekshirmaydi",
  "q": "Yolg'on testni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Qoidani eslang: test natijani etalon bilan solishtirishi kerak. Bu testda solishtirish yo'q, u doim yashil. Tekshiruv o'rnida turgan satrni bosing.",
  "ok": "To'g'ri. Oltinchi satr console log: natijani faqat chiqaradi. Uning o'rnida expect, result, to be yigirma ming bo'lishi kerak. Ekranda tuzatilgan holat: endi funksiya buzilsa, test qizil bo'ladi. Demak, har it ichida natijani etalon bilan solishtiradigan expect bo'lishi shart.",
  "okShort": "6-satr: <code>console.log</code> faqat chiqaradi. O'rniga <code>expect(result).toBe(20000)</code>.",
  "hint": "Import, describe va funksiyani chaqirish — kerakli qismlar. Natija bilan nima qilinayotganiga qarang: solishtiriladimi yoki faqat chiqariladimi?",
  "task": "Qoida: test natijani etalon bilan solishtirishi kerak — <code>expect(…).toBe(…)</code>. Bu testda solishtirish yo'q, u doim PASS beradi. <b>Tekshiruv o'rnida turgan satrni bosing.</b>"
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Kodni, etalonni va expectni buzing — natijani o'qing",
  "seg": [
   [
    "a",
    "Endi siz: o'z testingizni <b>uch xil buzasiz</b> va har natijani o'qiysiz",
    "Endi o'z testingizni uch xil buzasiz. Bunga o'n daqiqa ketadi. Har buzishdan keyin npm test va natijani ovoz chiqarib o'qing, sinfda xuddi shunday qilasiz."
   ],
   [
    "b",
    "1–2-qadam: funksiyada <code>+</code> — <b>FAIL</b>; tuzatib, etalonni 10002 qiling — FAIL",
    "Birinchi qadamda order ts'da ko'paytirish o'rniga qo'shish yozing va FAIL'ni ko'ring. Received qiymatini eslab qoling. Ikkinchisida funksiyani tuzatib, testdagi etalonni o'n ming ikki qiling: yana FAIL chiqadi, lekin qiymatlar teskari bo'ladi."
   ],
   [
    "c",
    "3–4-qadam: <code>expect</code> o'rniga <code>console.log</code> — PASS; tiklang; isbot — 1-qadamdagi <b><code>Received</code></b>",
    "Uchinchi qadamda expect o'rniga console log yozing: test yashil bo'ladi, lekin yolg'on. To'rtinchisida testni asl holiga qaytaring. Isbot maydoniga birinchi qadamdagi received qiymatini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz FAIL'ning ikki xilini va yolg'on PASS'ni o'z ko'zingiz bilan ko'rdingiz."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · chegara",
  "title": "Aynan 100 000 — >= va > farqi faqat chegarada ko'rinadi",
  "seg": [
   [
    "a",
    "O'quvchi uyga vazifasi: <b>100 000 dan</b> — yetkazish bepul, kam bo'lsa — 15 000",
    "Chegara shartini qayerda ko'ramiz? O'quvchining uyga vazifasida, delivery fee funksiyasida. Buyurtma yuz ming va undan ko'p bo'lsa, yetkazish bepul, kam bo'lsa o'n besh ming. Funksiya bir satrdan iborat, unga uchta test yozamiz: yuz ellik ming, aynan yuz ming va to'qson to'qqiz ming uchun."
   ],
   [
    "b",
    "Uch test va jami 4 o'tdi; ikki fayl bo'lsa nomlar faqat <b><code>--verbose</code></b> bilan chiqadi",
    "npm test qilamiz: ikki fayl, order va delivery, to'rtta test, hammasi yashil. Diqqat: fayl ikkita bo'lsa, Jest test nomlarini ko'rsatmaydi, faqat PASS va fayl. Nomlarni ko'rish uchun npx jest minus minus verbose."
   ],
   [
    "c",
    "<code>&gt;=</code> o'rniga <code>&gt;</code> — faqat <b>«aynan 100 000» qizil</b>: <code>Expected: 0</code>, <code>Received: 15000</code>",
    "Endi kichik xato qilamiz: katta yoki teng o'rniga faqat katta yozamiz. Yuz ellik ming ham, to'qson to'qqiz ming ham o'zgarmadi, ular yashil. Faqat aynan yuz ming qizil bo'ldi: nol kutilgan edi, o'n besh ming keldi. Shu test bo'lmaganda, bu xatoni hech kim sezmasdi."
   ],
   [
    "d",
    "Xulosa: shartli funksiyada uch test — chegaradan yuqori, <b>aynan chegara</b>, chegaradan past",
    "Xulosa: shart bor joyda kamida uchta test. Biri chegaradan yuqori, biri aynan chegarada, biri chegaradan past. Aynan chegara eng muhimi, xato ko'pincha shu yerda yashiringan. O'quvchi vazifasini tekshirganda shu uchta test bormi, shunga qarang."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · chegara",
  "title": "AI'ning testiga ikki savol: expect bormi? Etalon to'g'rimi?",
  "seg": [
   [
    "a",
    "O'quvchi darsida AI beshta test yozadi — ulardan <b>faqat ikkitasi haqiqiy</b>",
    "O'quvchi darsida AI orderTotal uchun beshta test yozadi. O'quvchi ulardan haqiqiylarini tanlaydi. Bugun ko'rgan ikki xatoni endi AI testlarida qidiramiz."
   ],
   [
    "b",
    "Birinchi savol: <b><code>expect</code> bormi?</b> Yo'q bo'lsa — test doim yashil",
    "Birinchi savol: testda expect bormi? Ikkita testda u yo'q: birida funksiya faqat chaqiriladi, birida console log turibdi. Ikkalasi ham doim yashil bo'ladi, o'ninchi ekrandagidek."
   ],
   [
    "c",
    "Ikkinchi savol: <b>etalon to'g'rimi?</b> Qo'lda hisoblang — 10002 noto'g'ri",
    "Ikkinchi savol: etalon to'g'rimi? Qo'lda hisoblaymiz: o'n ming ko'paytirish ikki yigirma ming bo'ladi, besh ming ko'paytirish uch esa o'n besh ming. O'n ming ikki degan etalon noto'g'ri, bu test to'g'ri kodni qizil qiladi."
   ],
   [
    "d",
    "Xulosa: AI test yozadi — o'quvchi har biriga <b>ikki savol</b> beradi",
    "Xulosa: AI test yozishi mumkin, lekin har testga ikki savol beriladi: expect bormi va etalon qo'lda hisoblaganda to'g'rimi. Sinfda bu qoidani doskaga yozing, o'quvchi uni har AI testida ishlatsin."
   ]
  ]
 },
 "15": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "FAIL · Expected: 10002 · Received: 20000. orderTotal(10000, 2). Kim xato?",
  "q": "FAIL o'qishni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi testi qizil: expected o'n ming ikki, received yigirma ming. Funksiyaga o'n ming va ikki berilgan. Kim xato? Variantni tanlang.",
  "ok": "To'g'ri, xato etalonda. Funksiya yigirma ming qaytardi, bu to'g'ri: o'n ming ko'paytirish ikki. Test o'n ming ikki kutgan, etalon xato. Testni tuzatasiz, kodga tegmaysiz. Demak, FAIL chiqqanda avval etalonni qo'lda hisoblang, keyin kodga qarang.",
  "okShort": "<code>Received: 20000</code> — to'g'ri hisob. <code>Expected: 10002</code> — etalon xato. Testni tuzating.",
  "hint": "Received — funksiya qaytargan qiymat. Uni qo'lda hisoblaganingiz bilan solishtiring.",
  "correct": 1,
  "opts": [
   "Funksiya — + yozilgan",
   "Etalon — 10000 × 2 = 20000, test 10002 kutgan",
   "Jest — versiya eski",
   "Hech kim — qayta npm test"
  ],
  "wrong": {
   "0": "+ bo'lsa Received: 10002 bo'lardi — bu yerda Received 20000.",
   "2": "Jest faqat solishtiradi; versiya natijani o'zgartirmaydi.",
   "3": "Kod va test o'zgarmasa, natija ham o'zgarmaydi."
  }
 },
 "16": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Uch test va chegara xatosi",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi uyga vazifasini o'zingiz qilasiz — uch test va <b>bitta chegara xatosi</b>",
    "Endi o'quvchi uyga vazifasini o'zingiz qilasiz: delivery fee funksiyasiga uchta test yozasiz, keyin chegarani ataylab buzasiz. Bunga o'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>delivery.ts</code> va <code>delivery.spec.ts</code> — uch <code>it</code>, <code>npm test</code> — <b>4 passed</b>",
    "Birinchi qadamda src papkasida delivery ts faylini yozasiz. Ikkinchisida delivery spec ts faylida uchta it yozasiz: yuz ellik ming, aynan yuz ming va to'qson to'qqiz ming uchun. npm test to'rtta yashil test ko'rsatadi."
   ],
   [
    "c",
    "3–4-qadam: <code>&gt;=</code> → <code>&gt;</code>, <code>npm test</code>; isbot — <b>qizil testning nomi</b>",
    "Uchinchi qadamda katta yoki teng o'rniga faqat katta yozib, npm test qilasiz. To'rtinchisida qaysi test qizil bo'lganini nuqtali satrdan o'qib, isbot maydoniga yozasiz. Keyin funksiyani tiklang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, chegaradagi xatoni faqat aynan chegara uchun yozilgan test tutishini o'zingiz ko'rdingiz."
   ]
  ]
 },
 "17": {
  "type": "Lesson",
  "kicker": "5-bosqich · tuzoqlar",
  "title": "Uch tuzoq: src/dan tashqari, .test.ts, npm ci",
  "seg": [
   [
    "a",
    "Sinfda test yozilgan, lekin ishlamaydi — sabab ko'pincha <b>koddan tashqarida</b>",
    "Sinfda eng ko'p vaqt test kodiga emas, sozlashga ketadi. Uchta tuzoqni oldindan bilsangiz, ularni bir daqiqada tuzatasiz."
   ],
   [
    "b",
    "Fayl loyiha ildizida yoki nomi <code>.test.ts</code> — ikkalasida <b><code>No tests found</code></b>",
    "Birinchi va ikkinchi tuzoq fayl joyi va nomida. Sinab ko'rdik: test fayli loyiha ildizida tursa, Jest no tests found deydi. Nomi order test ts bo'lsa ham shu javob chiqadi. Xabardagi test regex satri shuni aytadi: nol mos fayl."
   ],
   [
    "c",
    "<code>npm ci</code> bu repoda yiqiladi — lock fayl sinxron emas; <b><code>npm install</code> ishlaydi</b>",
    "Uchinchi tuzoq: ba'zi o'quvchi npm ci deb yozadi. Bu repoda u yiqiladi: package json va lock fayl sinxron emas. Npm install ishlaydi. Bu repo muallifining kamchiligi, o'quvchining xatosi emas."
   ],
   [
    "d",
    "Xulosa: <code>No tests found</code> — <b>joy va nom</b>; <code>npm ci</code> xatosi — <code>npm install</code>",
    "Xulosa: no tests found ko'rsangiz, fayl joyi va nomini tekshiring, src ichida va spec ts. Npm ci yiqilsa, npm install qiling. Ikkalasi ham kodda emas, sozlamada."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · tuzoqlar",
  "title": "Bo'sh loyihada darsdagi ikki buyruq yetmaydi: to'rt xato ketma-ket",
  "seg": [
   [
    "a",
    "O'quvchi Nest emas, oddiy loyihada sinasa — <b>darsdagi buyruqlar yetmaydi</b>",
    "Ba'zi o'quvchi testni Nest emas, oddiy bo'sh loyihada sinaydi. O'quvchi darsida ikki qadam bor: npm i minus D jest ts jest va test: jest. Sinab ko'rdik: bo'sh loyihada bu yetmaydi, to'rtta xato ketma-ket chiqadi."
   ],
   [
    "b",
    "1-xato: <b><code>Must use import to load ES Module</code></b> — Jest TypeScript'ni o'qishni bilmaydi",
    "Birinchi xato: must use import to load ES module. Jest TypeScript faylni o'qishni bilmaydi, unga sozlama kerak. Yechim: npx ts jest config init, u jest config faylini yaratadi."
   ],
   [
    "c",
    "2-xato: <code>Cannot find name 'describe'</code> — <code>@types/jest</code> kerak; 3-xato: <b>TypeScript 6 yoki 7</b>",
    "Ikkinchi xato: cannot find name describe, chunki Jest turlari yo'q. Yechim types jest va typescript paketlarini o'rnatish. Lekin shunda uchinchi xato chiqadi: eng yangi TypeScript o'rnatiladi. Alohida o'rnatilsa yettinchi, boshqa paketlar bilan birga oltinchi. Ikkalasida ham ts jest ishlamaydi."
   ],
   [
    "d",
    "Yechim: <b><code>typescript@5</code></b> — bo'sh loyiha ham yashil: <code>PASS ./order.spec.ts</code>",
    "Yechim: typescript beshinchi versiyasini o'rnatish. Shundan keyin bo'sh loyiha ham yashil. Jami uchta qo'shimcha buyruq kerak bo'ldi: config init, types jest va typescript besh. Nest loyihasida bularning hammasi tayyor."
   ],
   [
    "e",
    "Xulosa: test — <b>Nest loyihasida</b>; bo'sh loyihada — <code>config:init</code>, <code>@types/jest</code>, <code>typescript@5</code>",
    "Xulosa: sinfda testni o'quvchi reposida yozdiring, u yerda hammasi tayyor. O'quvchi baribir bo'sh loyihada sinasa, uchta buyruq: ts jest config init, types jest va typescript besh. Oltinchi va yettinchi TypeScript bilan ts jest hozircha ishlamaydi."
   ]
  ]
 },
 "19": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "Bo'sh loyiha: The TypeScript compiler \"typescript\" (version 7.0.2) does not expose … required by ts-jest. Nima qilasiz?",
  "q": "Zanjirni ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. O'quvchi bo'sh loyihada TypeScript o'rnatdi va xabar oldi: TypeScript yettinchi versiya ts jest uchun kerakli qismni bermaydi. Nima qilasiz? Variantni tanlang.",
  "ok": "To'g'ri. Ts jest hozircha TypeScript beshinchi versiyasi bilan ishlaydi. Typescript besh o'rnatilgach, sinab ko'rdik, test yashil. Nest reposida TypeScript besh allaqachon turibdi, shuning uchun u yerda bu xato chiqmaydi. Demak, ts jest bilan TypeScript beshinchi versiyasi ishlatiladi.",
  "okShort": "<code>typescript@5</code> → <code>PASS</code>. Nest reposida TypeScript 5.9 allaqachon bor.",
  "hint": "Xabar versiya haqida: qaysi versiya ts-jest bilan ishlaydi?",
  "correct": 3,
  "opts": [
   "ts-jestni o'chirish",
   "npm ci",
   "Test faylini .js qilish",
   "npm i -D typescript@5"
  ],
  "wrong": {
   "0": "ts-jestsiz Jest TypeScript faylni o'qiy olmaydi — birinchi xatoga qaytasiz.",
   "1": "npm ci lock fayldagi versiyani qayta o'rnatadi, yangisini tanlamaydi — sinab ko'rdik, versiya o'zgarmadi.",
   "2": ".js nomida Jest TypeScript'ni o'qiy olmaydi — sinab ko'rdik: Jest encountered an unexpected token."
  }
 },
 "20": {
  "type": "Practice",
  "kicker": "Amaliyot 4 / 4",
  "eyebrow": "Hozir o'zingizda · 5 daqiqa",
  "title": "Fayl joyi va nomi — ikki tuzoqni qo'l bilan ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: sinfdagi eng ko'p savolni o'zingiz chiqarasiz — <b><code>No tests found</code></b>",
    "Oxirgi amaliyot qisqa, besh daqiqalik. Sinfdagi eng ko'p uchraydigan xabarni, no tests found'ni, o'zingiz chiqarasiz."
   ],
   [
    "b",
    "1–2-qadam: <code>order.spec.ts</code>ni <b>loyiha ildiziga</b> ko'chiring — <code>No tests found</code>",
    "Birinchi qadamda order spec ts'ni src'dan loyiha ildiziga ko'chirib, importni moslang. Ikkinchisida npm test qiling: no tests found chiqadi. Xabardagi testRegex satrini o'qing."
   ],
   [
    "c",
    "3–4-qadam: <code>src/</code>ga qaytarib, nomini <b><code>.test.ts</code></b> qiling; isbot — xabarning birinchi satri",
    "Uchinchi qadamda faylni src'ga qaytaring, lekin nomini order test ts qiling: yana no tests found chiqadi. To'rtinchisida nomini spec ts'ga qaytaring, test yashil bo'ladi. Isbot maydoniga xabarning birinchi satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, sinfda no tests found chiqsa, siz sababini fayl joyi va nomidan darhol topasiz."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4b-01 · «Unit-test: Jest»",
  "title": "m4b-01: Jestbot, varaqa va etalon — amaliyot o'quvchi loyihasida",
  "seg": [
   [
    "a",
    "m4b-01 — 21 ekran: ko'p qismida o'quvchi <b>Jestbot</b> bilan o'ynaydi, terminalni amaliyotda ko'radi",
    "Endi o'quvchi darsini ko'ramiz: m4b-01, unda yigirma bir ekran bor. Ko'p qismida o'quvchi Jestbot degan robot bilan ishlaydi: varaqa yig'adi, etalon qo'yadi, kodni buzadi. Haqiqiy terminalni u faqat amaliyotda, o'z loyihasida ko'radi."
   ],
   [
    "b",
    "Yozish bloki: o'quvchi darsi haqiqiy chiqishni ko'rsatmaydi — siz <b>6-ekrandagini ko'rsatasiz</b>",
    "Yozish blokida o'quvchi darsi natijani kartochka bilan ko'rsatadi, haqiqiy terminal chiqishini emas. Siz proyektorda oltinchi ekrandagi haqiqiy PASS'ni ko'rsating: fayl, guruh, holat va jami."
   ],
   [
    "c",
    "Buzish bloki: FAIL o'qish tartibi va <b>«kim xato» savoli</b> — ikkalasi sizdan",
    "Buzish blokida o'quvchi expected va received'ni ko'radi. Siz o'qish tartibini o'rgatasiz: avval nuqtali satr, keyin expected va received, oxirida funksiya. Va har FAIL'da savol: kim xato, kodmi yoki etalonmi."
   ],
   [
    "d",
    "Xulosa: amaliyot oldidan — repo <code>npm install</code> bilan, test <b><code>src/</code> ichida</b>, nomi <code>.spec.ts</code>",
    "Xulosa: amaliyot oldidan uch narsani tekshiring. Repo npm install bilan o'rnatilgan, test fayli src ichida, nomi spec ts bilan tugaydi. Vaqt, taklif: to'qson daqiqaning yigirma beshi amaliyotga, chunki sozlashda vaqt ketadi."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "title": "O'quvchi darsidagi so'zlar: Jestbot, robot papkasi, sinov varaqasi, etalon kartochkasi",
  "seg": [
   [
    "a",
    "O'quvchi darsi testni <b>robot misolida</b> tushuntiradi — siz har so'zni atamasi bilan birga aytasiz",
    "Endi o'quvchi darsida qanday so'zlar ishlatilishini ko'ramiz. AI Startup kursidagi o'quvchi darsi testni robot misolida tushuntiradi, robotning ismi Jestbot. Siz har so'zni ham, uning atamasini ham bilasiz va sinfda ikkalasini birga aytasiz."
   ],
   [
    "b",
    "Papka — <code>describe</code>, varaqa — <code>it</code>, <b>etalon kartochkasi — <code>expect</code></b>",
    "Robot papkasi bu describe: u qaysi mashina sinalayotganini aytadi. Sinov varaqasi bu it: u nima tekshirilishini aytadi. Etalon kartochkasi bu expect: u qanday natija kutilishini aytadi. Mashina esa funksiyaning o'zi."
   ],
   [
    "c",
    "Yolg'on test va uch qadam — o'quvchi bularni so'z bilan ham, <b>kodda ham taniydi</b>",
    "Yolg'on test deganda etalon kartochkasi yo'q yoki noto'g'ri test tushuniladi. Uch qadam esa tayyorlash, chaqirish va tekshirish. O'quvchi bularni kodda ham tanishi kerak, shuning uchun har so'zni ekrandagi kod satri bilan ko'rsating."
   ],
   [
    "d",
    "Xulosa: «etalon kartochkasi, ya'ni <code>expect</code>» — so'zni <b>kod satri bilan birga</b> ko'rsating",
    "Xulosa: so'zlarni birga ayting, masalan etalon kartochkasi, ya'ni expect, va o'sha satrni ko'rsating. Metafora testni tushuntiradi, lekin terminaldagi so'zlar inglizcha: PASS, FAIL, expected, received."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "title": "Darsdagi o'rnatish qadami Nest reposida keraksiz, lekin zararsiz",
  "seg": [
   [
    "a",
    "O'quvchi darsi Jest'ni o'rnatishni buyuradi — Nest reposida u <b>allaqachon bor</b>",
    "O'quvchi darsining beshinchi ekrani Jest'ni o'rnatishni buyuradi: npm i minus D jest ts jest va test: jest. Nest reposida ikkalasi allaqachon bor. O'quvchi «nega o'rnatyapmiz, bor-ku?» desa, javob tayyor bo'lsin."
   ],
   [
    "b",
    "Sinab ko'rdik: faqat versiyalar ko'tarildi, testlar yashil — <b>zarari yo'q</b>",
    "Sinab ko'rdik: buyruqdan keyin jest va ts jest kichik versiyaga ko'tarildi, testlar yashil qoldi. Zarari yo'q. Ikkinchi qism, test: jest, package json'da allaqachon shunday yozilgan."
   ],
   [
    "c",
    "Tavsiya: o'quvchi buyruqni bajarsin, siz <b>«Nest buni oldindan qo'ygan»</b> deb izohlang",
    "Tavsiya: o'quvchi buyruqni bajaraversin, zarar yo'q. Siz bir gap qo'shing: Nest loyihasi Jest'ni oldindan qo'ygan, bu buyruq uni yangilaydi. O'quvchi bo'sh loyihada qilsa, o'n sakkizinchi ekrandagi zanjir."
   ],
   [
    "d",
    "Xulosa: Nest reposida — zararsiz; bo'sh loyihada — <b>yetarli emas</b>",
    "Xulosa: darsdagi o'rnatish qadami Nest reposida zararsiz, bo'sh loyihada esa yetarli emas. Shuning uchun sinfda testni o'quvchi reposida yozdiring."
   ]
  ]
 },
 "24": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfda",
  "title": "Olti holat va tayyor javoblar",
  "seg": [
   [
    "a",
    "Sinfda albatta chiqadigan <b>olti holat</b> — hammasini bugun o'zingiz ko'rdingiz",
    "Endi sinfda albatta chiqadigan oltita holatni ko'ramiz. Hammasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman."
   ],
   [
    "b",
    "Topilmadi va o'rnatish — joy, nom va <b><code>npm install</code></b>",
    "Birinchi holat no tests found: fayl joyi va nomini tekshiring. Ikkinchisi: npm ci yiqilsa, npm install qiling."
   ],
   [
    "c",
    "Yolg'on yashil, qizil to'g'ri kod va chegara — <code>expect</code>, etalon, <b>uch test</b>",
    "Uchinchisi: test yashil, lekin ichida expect yo'q. To'rtinchisi: test qizil, lekin kod to'g'ri, bunda etalonni qo'lda hisoblang. Beshinchisi: faqat aynan chegaradagi test qizil, shuning uchun har shartga uchta test yoziladi."
   ],
   [
    "d",
    "Xulosa: bo'sh loyiha — o'quvchi reposiga qaytaring; avval <b>xabarni birga o'qing</b>",
    "Oltinchisi bo'sh loyihadagi xatolar zanjiri: eng tez yo'l testni o'quvchi reposida yozdirish. Xulosa va usul bitta: javobni darhol aytmang, terminaldagi xabarni o'quvchi bilan birga o'qing. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "25": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "O'quvchi reposida Jest test faylini qayerdan qidiradi?",
    "o": [
     "butun loyihadan, istalgan nom",
     "src/ ichidan, nomi .spec.ts",
     "test/ papkasidan",
     "faqat package.json yonidan"
    ],
    "c": 1,
    "e": "rootDir: src, testRegex: .*\\.spec\\.ts$.",
    "s": 3
   },
   {
    "q": "Testda expect yo'q, faqat console.log(result). Natija?",
    "o": [
     "PASS — hech narsa tekshirilmadi",
     "FAIL",
     "No tests found",
     "SyntaxError"
    ],
    "c": 0,
    "e": "it ichida xato tashlanmasa — o'tdi.",
    "s": 10
   },
   {
    "q": "Expected: 20000 · Received: 10002. Nima bo'lgan?",
    "o": [
     "Etalon xato",
     "Jest eskirgan",
     "Funksiya noto'g'ri hisobladi (+)",
     "Test topilmadi"
    ],
    "c": 2,
    "e": "Received — funksiya qaytargan; 10000 + 2.",
    "s": 8
   },
   {
    "q": "Expected: 10002 · Received: 20000, orderTotal(10000, 2). Nima qilasiz?",
    "o": [
     "Funksiyani o'zgartiraman",
     "npm install",
     "Testni o'chiraman",
     "Etalonni 20000 ga tuzataman"
    ],
    "c": 3,
    "e": "Funksiya to'g'ri — etalon xato.",
    "s": 9
   },
   {
    "q": "deliveryFee: >= o'rniga > yozildi. Qaysi test qizil?",
    "o": [
     "aynan 100 000",
     "150 000",
     "99 000",
     "hammasi"
    ],
    "c": 0,
    "e": "Farq faqat chegarada.",
    "s": 13
   },
   {
    "q": "O'quvchi npm ci qildi — in sync xatosi. Nima deysiz?",
    "o": [
     "Jest'ni qayta o'rnating",
     "npm install qiling",
     "Repoyni o'chiring",
     "Node'ni yangilang"
    ],
    "c": 1,
    "e": "Lock fayl sinxron emas — npm install.",
    "s": 17
   },
   {
    "q": "Bo'sh loyiha: TypeScript 7.0.2 — does not expose … required by ts-jest. Yechim?",
    "o": [
     "ts-jestni o'chirish",
     "npm ci",
     "npm i -D typescript@5",
     "faylni .js qilish"
    ],
    "c": 2,
    "e": "ts-jest TypeScript 5 bilan ishlaydi (6 va 7 bilan — yo'q).",
    "s": 18
   },
   {
    "q": "AI 5 ta test yozdi. Har biriga qaysi ikki savol?",
    "o": [
     "Tezmi va qisqami?",
     "Nomi inglizchami?",
     "Nechta satr?",
     "expect bormi va etalon to'g'rimi?"
    ],
    "c": 3,
    "e": "Yolg'on testning ikki turi.",
    "s": 14
   }
  ]
 },
 "26": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};
