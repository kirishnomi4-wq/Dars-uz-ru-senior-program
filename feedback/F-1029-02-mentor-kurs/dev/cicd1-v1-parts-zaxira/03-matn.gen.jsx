
// ============================================================
//  CI/CD-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd1-matn.py (manba: 14-CICD1-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · CI/CD",
  "title": "Testlar bor. Ularni har push'da kim yurgizadi?",
  "seg": [
   [
    "a",
    "Testlarni har safar qo'lda yurgizish shart emas — <b>buni lenta qiladi</b>",
    "Assalomu alaykum. Jest darslarida test yozdingiz va har safar npm test'ni o'zingiz yurgizdingiz. Bugun buni har push'da avtomatik qiladigan lentani ko'ramiz: CI/CD."
   ],
   [
    "b",
    "Avval tushuncha, keyin o'quvchi reposini <b>lentadan qo'lda o'tkazamiz</b>",
    "Avval tushunchani ko'ramiz: CI nima va CD nima. Keyin o'quvchi reposini toza papkada lentadan qo'lda o'tkazamiz va qaysi qadamda qizil bo'lishini ko'ramiz."
   ],
   [
    "c",
    "Keyin <code>ci.yml</code> faylini o'qiymiz va uni <b>ataylab buzib</b>, xabarlarni ko'ramiz",
    "Keyin lenta faylini, ci yml'ni o'qiymiz, uni ataylab buzamiz va xabarlarni ko'ramiz. Oxirida chiqarish turlarini va o'quvchi darsini ko'ramiz."
   ],
   [
    "d",
    "Olti bosqich, uch amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Dars olti bosqichdan iborat, uchta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · tushuncha",
  "title": "Har push'dan keyin besh qadam: o'rnatish, test, lint, build, chiqarish",
  "seg": [
   [
    "a",
    "Qo'lda: har push'dan keyin <b>besh buyruqni</b> o'zingiz, tartib bilan yurgizasiz",
    "Kod yozildi va push qilindi. Endi qo'lda besh ish qilinadi: paketlarni o'rnatish, testlarni yurgizish, kod yozilish qoidasini tekshirish, build va saytni chiqarish. Bularning hammasi har push'da, tartib bilan qilinadi."
   ],
   [
    "b",
    "Muammo: sekin, zerikarli va bir kuni <b>bittasini unutasiz</b>",
    "Muammo shu: bu sekin va zerikarli. Bir kuni shoshilib testni tashlab ketasiz, buzuq kod foydalanuvchiga chiqadi. O'quvchi darsi ham aynan shu holatdan boshlanadi."
   ],
   [
    "c",
    "Lenta — xuddi shu besh qadamni har push'da <b>o'zi bajaradi</b>",
    "Lenta, inglizchasi pipeline, xuddi shu qadamlarni har push'da o'zi bajaradi. Yangi buyruq yo'q: lentada sizning terminalingizdagi buyruqlar yuradi."
   ],
   [
    "d",
    "Xulosa: lenta yangi narsa emas — <b>terminal buyruqlarini avtomatik</b> va tartib bilan yurgizadi",
    "Xulosa: lenta yangi narsa emas. U terminal buyruqlarini avtomatik va har safar bir xil tartibda yurgizadi. O'quvchi darsida bu nuqtalar aeroport nomlari bilan atalgan, ularni oxirida ko'ramiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · tushuncha",
  "title": "Continuous Integration: har kimning kodi umumiy repoga qo'shiladi va tekshiriladi",
  "seg": [
   [
    "a",
    "CI — Continuous Integration: kod umumiy repoga qo'<b>shilishi bilan tekshiriladi</b>",
    "Lenta har push'da aylanadi, demak avval push'ning o'zi. CI bu Continuous Integration, ya'ni uzluksiz birlashtirish. Har kim o'z kompyuterida yozadi, push qiladi, kod umumiy repoga qo'shiladi va shu zahoti tekshiriladi."
   ],
   [
    "b",
    "Tekshirishni hech kim so'ramaydi: lentani <b>push'ning o'zi</b> darhol boshlab beradi",
    "Tekshirishni hech kim so'ramaydi va hafta oxirini kutmaydi. Push'ning o'zi lentani boshlaydi. Kuniga o'n marta push bo'lsa, lenta o'n marta aylanadi."
   ],
   [
    "c",
    "Hamma <b>bir xil sharoitda</b>: «mening kompyuterimda ishlayapti» muammosi tugaydi",
    "Eng muhimi: hammaning kodi bir xil toza mashinada sinaladi. Vali uyida ishlagan, lentada qizil bo'lsa, xato uyidagi sozlamada yashiringan bo'ladi."
   ],
   [
    "d",
    "Xulosa: CI har push'ni <b>bir xil toza sharoitda</b>, darhol tekshiradi",
    "Xulosa: CI har push'ni darhol va bir xil toza sharoitda tekshiradi. Toza sharoit nimani anglatishini keyingi ekranda ko'ramiz, chunki o'quvchi reposidagi ko'p qizillar shundan keladi."
   ]
  ]
 },
 "4": {
  "type": "Lesson",
  "kicker": "1-bosqich · tushuncha",
  "title": "Lenta mashinasi har safar bo'sh papkadan boshlaydi va chiqish kodiga qaraydi",
  "seg": [
   [
    "a",
    "Lenta mashinasi — GitHub'dagi <b>toza kompyuter</b>, sizniki emas",
    "Lenta qayerda yuradi? GitHub'dagi alohida kompyuterda, inglizchasi runner. Hozir ubuntu latest degani Ubuntu yigirma to'rt, unda Node yigirma ikki o'rnatilgan. Sizning kompyuteringiz o'chiq bo'lsa ham ishlaydi."
   ],
   [
    "b",
    "Har safar <b>bo'sh papka</b>: <code>node_modules</code> ham, <code>.env</code> ham yo'q",
    "Har safar bo'sh papkadan boshlaydi. Sizning node modules papkangiz ham, env faylingiz ham u yerda yo'q. Shuning uchun lentada o'rnatish qadami albatta bor."
   ],
   [
    "c",
    "Har buyruq <b>chiqish kodi</b> qaytaradi: 0 — yashil, 1 — qizil",
    "Lenta qanday biladi: o'tdimi yoki yo'qmi? Har buyruq tugaganda bitta son qaytaradi, uni chiqish kodi deyishadi. Test yashil bo'lsa nol, qizil bo'lsa bir. Lenta faqat shu songa qaraydi."
   ],
   [
    "d",
    "Xulosa: lenta = <b>toza papka</b> + sizning buyruqlaringiz + <b>chiqish kodi</b>",
    "Xulosa: lenta bu toza papka, sizning buyruqlaringiz va chiqish kodi. Nol bo'lmagan kod chiqqan qadamdan keyin lenta to'xtaydi. Endi buni tekshirib olaylik."
   ]
  ]
 },
 "5": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Lentada npm test chiqish kodi 1 qaytardi. Keyin nima bo'ladi?",
  "q": "Lenta mashinasini ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Lentada npm test chiqish kodi bir qaytardi. Keyin nima bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Bir qizil degani. Lenta shu qadamda to'xtaydi, build ham, chiqarish ham yurmaydi. Foydalanuvchi eski, ishlayotgan saytni ko'radi, buzuq yuk uchmaydi. Demak, nol bo'lmagan chiqish kodi chiqqan joyda lenta to'xtaydi va keyingi qadamlar yurmaydi.",
  "okShort": "Kod 1 — qizil: lenta to'xtaydi, buzuq yuk chiqmaydi.",
  "hint": "Chiqish kodi 0 emas — qizil. Qizil qadamdan keyin lenta nima qiladi?",
  "correct": 2,
  "opts": [
   "Lenta davom etadi, build va chiqarish ham yuradi",
   "Lenta xatoni o'zi tuzatadi",
   "Lenta to'xtaydi, keyingi qadamlar yurmaydi, eski sayt joyida qoladi",
   "Sayt o'chib qoladi"
  ],
  "wrong": {
   "0": "Davom etsa, tekshirilmagan kod chiqadi — lenta buning teskarisi uchun bor.",
   "1": "Lenta kod yozmaydi: tuzatish dasturchining ishi.",
   "3": "Chiqarish yurmagani uchun eski versiya joyida qoladi."
  }
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · o'quvchi reposi",
  "title": "CI andozalarining o'rnatish buyrug'i — npm ci. O'quvchi reposida u yiqiladi",
  "seg": [
   [
    "a",
    "Endi o'quvchi reposini lentadagidek o'tkazamiz: <b>toza clone</b>, toza muhit",
    "Endi o'quvchi reposini lentadagidek o'tkazamiz: GitHub'dan yangi clone, toza papka, toza muhit. Lentaning birinchi qadami paketlarni o'rnatish."
   ],
   [
    "b",
    "GitHub'ning tayyor Node.js andozasida ham <code>npm ci</code> turadi — u <b>lock faylga qat'iy</b> amal qiladi",
    "GitHub Actions'dagi tayyor Node.js andozasini tanlasangiz ham, o'rnatish buyrug'i npm ci bo'ladi. U package lock fayliga qat'iy amal qiladi: ikkala fayl mos bo'lmasa, hech narsa o'rnatmaydi."
   ],
   [
    "c",
    "O'quvchi reposida lock fayl eskirgan: <code>npm ci</code> — <b><code>in sync</code> xatosi</b>, kod 1",
    "O'quvchi reposida lock fayl eskirgan: unda yangi paketlar yo'q. Natijada in sync xatosi chiqadi, chiqish kodi bir. Lenta birinchi qadamdayoq qizil bo'ladi, test'gacha yetmaydi."
   ],
   [
    "d",
    "Xulosa: o'quvchi reposida o'rnatish — <b><code>npm install</code></b>; <code>npm ci</code> bilan lenta qizil",
    "Xulosa: bu repoda o'rnatish qadami npm install bo'lsin. U ishlaydi va yetti yuz ellik to'qqiz paketni o'rnatadi. Jest birinchi darsida ham shu sabab bilan npm install ishlatgan edik."
   ]
  ]
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · o'quvchi reposi",
  "title": "Test fayli yo'q repoda npm test — No tests found, kod 1",
  "seg": [
   [
    "a",
    "Ikkinchi qadam — test. O'quvchi reposida hali <b>bitta ham test yo'q</b>",
    "Ikkinchi qadam testlar. Toza clone'da o'quvchi reposida bitta ham test fayli yo'q: testlarni o'quvchi o'zi qo'shadi."
   ],
   [
    "b",
    "<code>No tests found, exiting with code 1</code> — lenta buni <b>qizil deb biladi</b>",
    "Natijada no tests found, exiting with code one chiqadi. Jest testni topmasa, chiqish kodi bir bilan tugaydi. Lenta buni xato deb biladi va to'xtaydi."
   ],
   [
    "c",
    "Jest-1 dagi <code>order.spec.ts</code> qo'shilgach — <b>PASS va kod 0</b>",
    "Jest birinchi darsidagi order spec faylini qo'shamiz. Natijada PASS chiqadi: bitta test o'tdi, chiqish kodi nol. Endi lenta keyingi qadamga o'tadi."
   ],
   [
    "d",
    "Xulosa: lentaga test qadami qo'yishdan oldin repoda <b>kamida bitta test</b> bo'lsin",
    "Xulosa: lentaga test qadamini qo'yishdan oldin repoda kamida bitta test bo'lsin. Aks holda lenta birinchi kundanoq qizil bo'ladi. Sinfda bu o'quvchilarda albatta chiqadi."
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "2-bosqich · o'quvchi reposi",
  "title": "npm run build yashil. && zanjiri — lenta qoidasining o'zi",
  "seg": [
   [
    "a",
    "Uchinchi qadam — build: <code>nest build</code>, <b>xatosiz, kod 0</b>",
    "Uchinchi qadam build. Nest build TypeScript'ni JavaScript'ga aylantiradi. O'quvchi reposida xatosiz o'tadi, chiqish kodi nol."
   ],
   [
    "b",
    "<code>&amp;&amp;</code> — oldingi buyruq <b>yashil bo'lsagina</b> keyingisi yuradi",
    "Lenta qoidasini terminalda ko'rish mumkin. Buyruqlar orasidagi ikki ampersand shuni bildiradi: oldingi buyruq nol qaytarsagina keyingisi yuradi. Uch buyruqni shunday ulaymiz, oxiriga esa uchirish so'zini chiqaradigan buyruq qo'yamiz."
   ],
   [
    "c",
    "Test qizil — build ham, «UCHIRISH» ham <b>yurmadi</b>; test yashil — hammasi yurdi",
    "Kodni ataylab buzdik: test qizil bo'ldi, build yurmadi, uchirish yozuvi chiqmadi, chiqish kodi bir. Tuzatgandan keyin hammasi yurdi va oxirida uchirish chiqdi. Lenta aynan shunday ishlaydi."
   ],
   [
    "d",
    "Xulosa: lenta — <code>&amp;&amp;</code> bilan ulangan buyruqlar; <b>birinchi qizilda to'xtaydi</b>",
    "Xulosa: lentani ikki ampersand bilan ulangan buyruqlar deb tasavvur qiling. Birinchi qizil qadamda to'xtaydi. Endi buni o'zingiz yurgizasiz."
   ]
  ]
 },
 "9": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Toza clone'da uch qadam va && zanjiri",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi reposini toza papkada <b>lentadagidek</b> o'tkazasiz",
    "Endi navbat sizga. O'quvchi reposini yangi papkaga clone qiling va lentadagidek uch qadamdan o'tkazing. Bunga o'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: clone va <code>npm ci</code> — <b><code>in sync</code></b> xatosini ko'ring, keyin <code>npm install</code>",
    "Birinchi qadamda reponi yangi papkaga clone qilasiz. Ikkinchisida avval npm ci qilib, in sync xatosini o'qiysiz, keyin npm install qilasiz."
   ],
   [
    "c",
    "3–4-qadam: <code>order</code> fayllari va zanjir; isbot — <b>oxirgi satr</b>",
    "Uchinchi qadamda Jest birinchi darsidagi ikki order faylini qo'shasiz. To'rtinchisida zanjirni yurgizasiz. Isbot maydoniga oxirgi satrni yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz o'quvchi reposi qaysi qadamda qizil bo'lishini va qanday tuzatilishini o'z qo'lingiz bilan ko'rdingiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · ci.yml",
  "title": "ci.yml: qachon (on), qayerda (runs-on), nima (steps)",
  "seg": [
   [
    "a",
    "Lenta qayerda yoziladi: repodagi <b><code>.github/workflows/ci.yml</code></b> faylida, GitHub uni o'zi topadi",
    "Lenta qayerda yoziladi? Repodagi nuqta github, workflows papkasidagi yml faylida. GitHub shu papkani o'zi topadi. O'quvchi darsida bu fayl yo'l xaritasi deyiladi."
   ],
   [
    "b",
    "<code>on: push</code> — <b>qachon</b>: har push'da lenta o'zi boshlanadi",
    "Birinchi qator on push lenta qachon boshlanishini aytadi: har push'da u o'zi boshlanadi. Bu start signali."
   ],
   [
    "c",
    "<code>runs-on</code> — <b>qaysi mashinada</b>; <code>steps</code> — <b>qaysi buyruqlar</b>, yuqoridan pastga",
    "Runs on qaysi mashinada yurishini aytadi: ubuntu latest. Steps esa qaysi buyruqlar yurishini aytadi: har chiziqcha bitta qadam, ular yuqoridan pastga bajariladi. Surilish muhim: har qator kimning ichida turganini ko'rsatadi."
   ],
   [
    "d",
    "Xulosa: <code>on</code> · <code>runs-on</code> · <code>steps</code> — o'quvchi darsidagi <b>uch bo'shliq</b> aynan shular",
    "Xulosa: faylning asosi uchta: on, runs on va steps. O'quvchi darsida aynan shu uch joy bo'sh qoldirilgan va o'quvchi to'ldiradi. Lekin bu faylda bitta muhim qadam yetishmaydi, uni keyingi ekranda ko'ramiz."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · ci.yml",
  "title": "Rasmiy tahlilchi «xato yo'q» deydi — lekin mashinadagi papka bo'sh",
  "seg": [
   [
    "a",
    "Faylni GitHub'ning rasmiy tahlilchisida tekshirdik: u <b>«xato yo'q»</b> deb javob berdi",
    "O'quvchi darsidagi faylni GitHub'ning rasmiy tahlilchisida tekshirdik. Natija: xato yo'q, ya'ni fayl to'g'ri yozilgan. Lekin yozilishi to'g'ri degani, ishlaydi degani emas."
   ],
   [
    "b",
    "Lenta mashinasi bo'sh papkada: repodagi kodni <b><code>actions/checkout</code></b> olib keladi",
    "Eslang: mashina bo'sh papkadan boshlaydi. Repodagi kodni u yerga olib keladigan qadam actions checkout. Hujjati shunday deydi. O'quvchi faylida bu qadam yo'q."
   ],
   [
    "c",
    "Checkout'siz <code>npm install</code> — <b><code>Could not read package.json</code></b>",
    "Bo'sh papkada npm install'ni yurgizdik va could not read package json xatosini oldik. Package json yo'q, chunki kod kelmagan. GitHub'da ham sinadik: checkout'siz lentada xuddi shu xato, lenta qizil."
   ],
   [
    "d",
    "Xulosa: har lentaning birinchi qadami — kodni olib keladigan <b><code>actions/checkout</code></b>",
    "Xulosa: har lentaning birinchi qadami actions checkout. O'quvchilarga checkout m4c-03 da o'rgatiladi, amaliyot esa m4c-01 da. Shuning uchun amaliyotda bu qatorni o'zingiz qo'shtirasiz."
   ]
  ]
 },
 "12": {
  "type": "Lesson",
  "kicker": "3-bosqich · ci.yml",
  "title": "Checkout, Node, install, test, build — besh qadam, tahlilchida xatosiz",
  "seg": [
   [
    "a",
    "<code>uses</code> — <b>tayyor qadam</b>: checkout kodni olib keladi, setup-node Node'ni o'rnatadi",
    "Checkout kerakligini ko'rdik, endi to'liq fayl. Unda uses bilan yozilgan ikki yangi qadam bor: bular boshqalar yozib qo'ygan tayyor qadamlar. Checkout kodni olib keladi. Setup node kerakli Node versiyasini o'rnatadi, bu yerda yigirma ikki."
   ],
   [
    "b",
    "<code>run</code> — <b>sizning buyruqlaringiz</b>: <code>npm install</code>, <code>npm test</code>, <code>npm run build</code>",
    "Qolgan qadamlar run bilan yoziladi, ular sizning buyruqlaringiz: npm install, npm test va npm run build. Bular amaliyotda terminalda yurgizgan uchta buyrug'ingiz."
   ],
   [
    "c",
    "Versiyalar: hozir checkout va setup-node — <b>v7</b>; o'quvchi darsida <b>v4</b> yozilgan",
    "Endi versiyalar haqida. GitHub'da hozirgi so'nggi versiya yettinchi. O'quvchi m4c-03 darsida to'rtinchi versiya yozilgan. To'rtinchisi ham ishlaydi, lekin GitHub har safar eskirgan deb ogohlantiradi. Shuning uchun yettinchisini tavsiya qilamiz."
   ],
   [
    "d",
    "Xulosa: bu fayl o'quvchi reposi uchun — <b>lint qadamisiz</b>, sababini 15-ekranda ko'ramiz",
    "Xulosa: o'quvchi reposi uchun shu besh qadam yetadi. Lint qadami ataylab yo'q, sababini o'n beshinchi ekranda ko'ramiz. Fayl tahlilchida xatosiz."
   ]
  ]
 },
 "13": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Fayl to'g'ri yozilgan, lekin o'quvchi reposida lenta birinchi run qadamida qizil",
  "q": "Faylni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu fayl yozilishi bo'yicha to'g'ri, lekin o'quvchi reposida lenta birinchi buyruqdayoq qizil. Shu satrni bosing.",
  "ok": "To'g'ri. O'n birinchi satr, npm ci. O'quvchi reposida lock fayl eskirgan, npm ci in sync xatosi bilan to'xtaydi. Bu repoda npm install yozamiz. Ekranda tuzatilgan holat. Demak, lock fayli eskirgan repoda lentaning o'rnatish qadami npm install bo'ladi.",
  "okShort": "11-satr: <code>npm ci</code> — lock sinxron emas. Bu repoda <code>npm install</code>.",
  "hint": "Lentaning birinchi buyrug'i qaysi? Toza clone'da u nima degan edi (6-ekran)?",
  "task": "Bu <code>ci.yml</code> tahlilchida xatosiz. Lekin o'quvchi reposida lenta birinchi buyruqdayoq qizil bo'ladi. <b>Shu satrni bosing.</b>"
 },
 "14": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "O'z reposingizga lenta: push va Actions'ni kuzatish",
  "seg": [
   [
    "a",
    "Endi siz: o'z GitHub reposingizga lenta qo'shasiz va <b>birinchi yashilni</b> ko'rasiz",
    "Endi o'z reposingizga lenta qo'shasiz. Jest darslaridagi repo bo'lsa yaxshi, unda testlar bor. Bunga o'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>.github/workflows/ci.yml</code> — tavsiya fayl; <b>commit va push</b>",
    "Birinchi qadamda nuqta github, workflows papkasida ci yml faylini yaratasiz: o'n ikkinchi ekrandagi fayl. Ikkinchisida commit va push qilasiz."
   ],
   [
    "c",
    "3–4-qadam: Actions bo'limi, qadamlar ro'yxati; isbot — <code>npm test</code> qadamidagi <b><code>Tests:</code> satri</b>",
    "Uchinchi qadamda GitHub'da Actions bo'limini ochib, lentani kuzatasiz. To'rtinchisida npm test qadamini ochib, Tests satrini isbot maydoniga nusxalaysiz."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin sizning reposingizda har push'da o'zi yuradigan lenta bor."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "O'quvchi darsidagi «O'lcham ramkasi» — o'quvchi reposida lint 46 error",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi lentada lint nuqtasi bor — o'quvchi reposida <b>sinab ko'rdik</b>",
    "O'quvchi darsidagi lentada o'lcham ramkasi bor, ya'ni lint: kod yozilish qoidasi. O'quvchi reposida npm run lint'ni yurgizdik."
   ],
   [
    "b",
    "Natija: <b>46 error</b>, chiqish kodi 1 — lint qadami qo'yilsa, lenta har safar qizil",
    "Natijada qirq olti error chiqdi, chiqish kodi bir. Repoda yozilish qoidasi buzilgan joylar ko'p. Lentaga lint qadami qo'yilsa, u har safar qizil bo'ladi, kod ishlasa ham."
   ],
   [
    "c",
    "Diqqat: skriptda <code>--fix</code> bor — u <b>14 faylni o'zgartirib</b> qo'ydi",
    "Yana bir narsa: o'quvchi reposidagi lint skriptida fix bor. U o'n to'rt faylni o'zi o'zgartirib qo'ydi. Lentada fayl o'zgartiradigan buyruq bo'lmasligi kerak."
   ],
   [
    "d",
    "Xulosa: bu repoda lint — <b>alohida ish</b>; lentaga test va build yetadi",
    "Xulosa: bu repoda lint alohida ish, avval xatolar tozalanadi. Hozircha lentaga test va build yetadi. O'quvchi lint haqida so'rasa, shu raqamni ayting."
   ]
  ]
 },
 "16": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "* o'rniga +: lentada FAIL, build yurmaydi",
  "seg": [
   [
    "a",
    "Jest-1 dagi buzish: <b><code>price + quantity</code></b> — lentada nima bo'ladi?",
    "Jest birinchi darsidagi buzishni lentada ko'ramiz: ko'paytirish o'rniga qo'shish yozamiz va push qilamiz."
   ],
   [
    "b",
    "Test qadami qizil: Expected 20000, <b>Received 10002</b>, kod 1",
    "Test qadami qizil: expected yigirma ming, received o'n ming ikki, chiqish kodi bir. Jest birinchi darsidagi xabarning o'zi, faqat endi u lenta logida."
   ],
   [
    "c",
    "Build va chiqarish kulrang — yurmadi; foydalanuvchi <b>eski saytni</b> ko'radi",
    "Keyingi qadamlar, build ham, chiqarish ham, yurmadi. Buzuq kod foydalanuvchiga yetmadi, eski versiya ishlab turibdi. Dasturchi qizilni ko'radi va tuzatadi."
   ],
   [
    "d",
    "Xulosa: qizil lenta — yomon emas; u xatoni foydalanuvchidan <b>oldin ushladi</b>",
    "Xulosa: qizil lenta yomon narsa emas. U xatoni foydalanuvchidan oldin ushladi. O'quvchiga shuni ayting: qizil, lenta ishlayapti degani."
   ]
  ]
 },
 "17": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "on: once, runs-on yo'q, surilish — uch xato va ularning xabari",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi noto'g'ri variantlar: <code>once</code>, <code>my-laptop</code> — <b>tahlilchida sinadik</b>",
    "O'quvchi darsida noto'g'ri variantlar bor: once, my laptop. Ularni va o'quvchilar ko'p qiladigan xatolarni rasmiy tahlilchida sinadik."
   ],
   [
    "b",
    "<code>on: once</code> — <b><code>Unexpected value</code></b>; <code>runs-on</code> yo'q — <b><code>Required property is missing</code></b>",
    "On once yozilsa, tahlilchi unexpected value deydi, ya'ni kutilmagan qiymat. Runs on qatori bo'lmasa, required property is missing deydi, ya'ni majburiy qator yetishmaydi. Ikkalasida ham qator raqami ko'rsatiladi."
   ],
   [
    "c",
    "Surilish xatosi — xabar tushunarsiz, lekin <b>qator raqami to'g'ri</b>",
    "Eng ko'p uchraydigani surilish: bitta chiziqcha boshqa joyga siljigan. Uning xabari tushunarsiz: block sequence, implicit map key. Lekin qator raqami to'g'ri ko'rsatiladi, o'sha qatorga qarang."
   ],
   [
    "d",
    "Xulosa: YAML xabarida avval <b>qator raqamini</b> o'qing, keyin surilishni solishtiring",
    "Xulosa: YAML xatosida avval qator raqamini o'qing, keyin o'sha qatorning surilishini yuqoridagi qator bilan solishtiring. GitHub'da bunday faylda lenta darhol qizil bo'ladi, ichida qadam ham, log ham yo'q. GitHub sahifasida surilish xatosi umumiy yaml syntax xabari bo'lib chiqadi va qator raqami blok boshini ko'rsatishi mumkin."
   ]
  ]
 },
 "18": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "O'quvchi: «Lentam birinchi qadamda qizil: npm ci can only install packages when … in sync». Sabab?",
  "q": "Buzishlarni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi lentasi birinchi qadamda qizil, xabarda in sync. Sabab nima? Variantni tanlang.",
  "ok": "To'g'ri. Lock fayl package json'ga mos emas, npm ci bunday holatda hech narsa o'rnatmaydi. O'quvchi reposida aynan shunday. Yechim: npm install yozish yoki lock faylni yangilab push qilish. Demak, in sync xatosi chiqsa, sabab kodda emas, lock faylda.",
  "okShort": "<code>in sync</code> — lock fayl mos emas: <code>npm install</code> yoki lock'ni yangilash.",
  "hint": "Xabardagi ikki fayl nomini o'qing: qaysi ikki fayl mos emas?",
  "correct": 1,
  "opts": [
   "Testlar yiqildi",
   "Lock fayl package.jsonga mos emas — bu repoda npm install",
   "Checkout qadami yo'q",
   "GitHub ishlamayapti"
  ],
  "wrong": {
   "0": "Test'gacha yetmadi: xato o'rnatish qadamida.",
   "2": "Checkout'siz xabar boshqacha: Could not read package.json.",
   "3": "Xabar npm'dan keldi va sababini aniq aytyapti."
  }
 },
 "19": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Ataylab buzing, qizil lentani o'qing, tuzating",
  "seg": [
   [
    "a",
    "Endi siz: kodni ataylab buzasiz va lentaning qizilini <b>o'z ko'zingiz bilan</b> ko'rasiz",
    "Oxirgi amaliyot: kodni ataylab buzasiz va lentaning qizilini o'zingiz ko'rasiz. Bunga o'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>*</code> o'rniga <code>+</code>, push — <b>Actions'da qizil</b>",
    "Birinchi qadamda order ts'da ko'paytirish o'rniga qo'shish yozasiz. Ikkinchisida commit va push qilib, Actions'da lenta qizil bo'lishini kutasiz."
   ],
   [
    "c",
    "3–4-qadam: qizil qadamdagi <code>Received</code>, keyin tuzatish va yashil; isbot — <b><code>Received</code> qiymati</b>",
    "Uchinchi qadamda qizil qadamni ochib, received qiymatini o'qiysiz. To'rtinchisida xatoni tuzatib, push qilasiz va yashil lentani ko'rasiz. Isbot maydoniga received qiymatini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz qizil lentaning logini o'qib, xatoni tuzatib, lentani yana yashilga qaytardingiz."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "5-bosqich · CD",
  "title": "CD — tekshirilgan yukni chiqarish: tasdiq bilan yoki o'zi",
  "seg": [
   [
    "a",
    "CI tekshiradi; CD — tekshiruvdan o'tgan yukni foydalanuvchiga <b>chiqaradi</b>",
    "Lentamiz kodni build'gacha tekshirdi, bu CI. CD esa tekshiruvdan o'tgan yukni chiqaradi. O'quvchi darsida ikki rejim bor va ular faqat oxirgi qadamda farq qiladi."
   ],
   [
    "b",
    "Continuous Delivery — hammasi tayyor, lekin chiqarishni <b>odam tasdiqlaydi</b>",
    "Continuous Delivery, ya'ni yetkazishda lenta oxirigacha yetadi va yuk tayyor turadi. Chiqarishni mas'ul odam tasdiqlaydi. Pul o'tkazish ilovasi kabi joylarda shunday."
   ],
   [
    "c",
    "Continuous Deployment — hamma qadam yashil bo'lsa, <b>o'zi chiqaradi</b>",
    "Continuous Deployment'da esa hamma qadam yashil bo'lsa, hech kimdan so'ramay o'zi chiqaradi. Chiqarish uchun parol va kalitlar kerak, ular faylda emas, GitHub Secrets'da saqlanadi."
   ],
   [
    "d",
    "Xulosa: Delivery — <b>tasdiq bilan</b>, Deployment — <b>o'zi</b>; chiqarishni kursda keyin qilamiz",
    "Xulosa: Delivery'da chiqarishni odam tasdiqlaydi, Deployment'da lenta o'zi chiqaradi. Bugun lentamiz build'da tugaydi. Haqiqiy chiqarishni o'quvchilar loyiha kunlarida qiladi."
   ]
  ]
 },
 "21": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "Pul o'tkazish ilovasi: har yangilanishni mas'ul xodim ko'rib chiqadi. Qaysi rejim?",
  "q": "Chiqarish rejimlarini ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Pul o'tkazish ilovasida har yangilanishni mas'ul xodim ko'rib chiqadi. Qaysi rejim mos? Variantni tanlang.",
  "ok": "To'g'ri, Delivery. Tekshiruvni lenta qiladi, chiqarishni xodim tasdiqlaydi. Deployment bo'lsa, xodim ko'rib chiqishga ulgurmaydi. Demak, chiqarishni odam tasdiqlasa Delivery, lenta o'zi chiqarsa Deployment.",
  "okShort": "Delivery: lenta tekshiradi, xodim tasdiqlaydi.",
  "hint": "Shartdagi kalit so'z: «ko'rib chiqadi». Qaysi rejimda tasdiq bor?",
  "correct": 0,
  "opts": [
   "Delivery — tekshiruvdan keyin tasdiq bilan chiqadi",
   "Deployment — o'zi chiqadi",
   "Lentasiz — hammasi qo'lda",
   "Faqat CI, chiqarish umuman yo'q"
  ],
  "wrong": {
   "1": "Tasdiqsiz chiqsa, xodim ko'rishga ulgurmaydi.",
   "2": "Tekshiruvni lenta qilsa ham bo'ladi — faqat chiqarish tasdiq bilan.",
   "3": "Ilova yangilanishi baribir chiqishi kerak."
  }
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4c-01 · «CI/CD nima va nega kerak»",
  "title": "m4c-01: aeroport lentasi, chamadon va yo'l xaritasi",
  "seg": [
   [
    "a",
    "m4c-01 — 21 ekran: <b>aeroport lentasi</b>, chamadon va yo'l xaritasi",
    "Endi o'quvchi darsini ko'ramiz: m4c-01, unda yigirma bir ekran bor. Darsda kod chamadonga, lenta aeroport lentasiga, ci yml esa yo'l xaritasiga o'xshatiladi. Lentada beshta nuqta bor: yig'ish, skaner, o'lcham ramkasi, o'rash va uchirish."
   ],
   [
    "b",
    "Amaliyotdagi <code>ci.yml</code>da <b>checkout yo'q</b> — o'quvchilarga bu qatorni qo'shtiring",
    "Eng muhim ogohlantirish: amaliyotdagi ci yml'da checkout yo'q. Uni yozmasa, lenta qizil bo'ladi. O'quvchilarga birinchi qadam sifatida actions checkout'ni qo'shtiring va o'rnatishni npm install bilan qoldiring."
   ],
   [
    "c",
    "O'quvchi lentasida lint nuqtasi bor — o'quvchi reposida u qizil, <b>oldindan ayting</b>",
    "Lenta o'yinida lint nuqtasi bor. O'quvchi uni lentaga qo'shmoqchi bo'lsa, oldindan ayting: bu repoda lint qirq olti error beradi."
   ],
   [
    "d",
    "Xulosa: vaqt — amaliyotga ko'proq; har o'quvchi Actions'da <b>bitta yashil</b> ko'rsin",
    "Xulosa: vaqt bo'yicha taklif, to'qson daqiqaning o'ttizini amaliyotga bering. Har o'quvchi Actions'da bitta yashil lentani o'z ko'zi bilan ko'rsin, qolgani shundan keyin oson."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfda",
  "title": "Lenta nuqtalari — buyruqlar; olti holat va tayyor javoblar",
  "seg": [
   [
    "a",
    "O'quvchi darsi aeroport so'zlarini ishlatadi — siz <b>buyruqni birga aytasiz</b>",
    "Xaritani ko'rdingiz, endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz. O'quvchi darsi aeroport so'zlarini ishlatadi: yig'ish, skaner, o'rash. Siz har so'z bilan buyruqni birga ayting: skaner, ya'ni npm test."
   ],
   [
    "b",
    "<b>Uch xabar uch sabab</b>: <code>Could not read package.json</code>, <code>in sync</code>, <code>No tests found</code>",
    "Endi sinfda albatta chiqadigan holatlar. Birinchi uchtasi xabardan taniladi. Could not read package json chiqsa, checkout yo'q. In sync chiqsa, sabab npm ci. No tests found chiqsa, repoda test yo'q."
   ],
   [
    "c",
    "Lint 46 error, YAML qator raqami, Actions bo'sh — sababi <b>bir qarashda</b>",
    "Lint qirq olti error bersa, uni lentadan olib turing. YAML xatosida avval qator raqamini o'qing. Actions bo'limi bo'sh bo'lsa, papka nomi noto'g'ri yozilgan."
   ],
   [
    "d",
    "Xulosa: lenta logini o'quvchi bilan <b>birga o'qing</b> — qaysi qadam qizil, keyin xabar",
    "Xulosa va usul bitta: javobni darhol aytmang, lenta logini o'quvchi bilan birga o'qing. Avval qaysi qadam qizil ekanini toping, keyin uning xabarini o'qing. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Lenta qadam qizilligini nimadan biladi?",
    "o": [
     "chiqish kodi 0 emas",
     "log uzunligi",
     "vaqt",
     "fayl hajmi"
    ],
    "c": 0,
    "e": "0 — yashil, boshqasi — qizil.",
    "s": 4
   },
   {
    "q": "Lenta mashinasi har safar qanday papkadan boshlaydi?",
    "o": [
     "sizning papkangizdan",
     "bo'sh papkadan",
     "oldingi lentadan",
     "node_modules bilan"
    ],
    "c": 1,
    "e": "Shuning uchun checkout va install kerak.",
    "s": 4
   },
   {
    "q": "O'quvchi reposida npm ci nima beradi?",
    "o": [
     "PASS",
     "No tests found",
     "in sync xatosi, kod 1",
     "759 paket"
    ],
    "c": 2,
    "e": "Lock fayl eskirgan.",
    "s": 6
   },
   {
    "q": "Test fayli yo'q repoda npm test?",
    "o": [
     "PASS",
     "build yuradi",
     "hech narsa",
     "No tests found, kod 1"
    ],
    "c": 3,
    "e": "Lenta qizil.",
    "s": 7
   },
   {
    "q": "ci.ymlda actions/checkout yo'q bo'lsa?",
    "o": [
     "papka bo'sh — Could not read package.json",
     "tahlilchi xato beradi",
     "lenta yuradi",
     "testlar o'tadi"
    ],
    "c": 0,
    "e": "Tahlilchi xato bermaydi — yozilishi to'g'ri.",
    "s": 11
   },
   {
    "q": "O'quvchi reposida lint qadami lentada?",
    "o": [
     "yashil",
     "46 error — qizil",
     "yurmaydi",
     "faqat ogohlantirish"
    ],
    "c": 1,
    "e": "--fix ham 14 faylni o'zgartiradi.",
    "s": 15
   },
   {
    "q": "npm test && npm run build, test qizil — build?",
    "o": [
     "yuradi",
     "yarim yuradi",
     "yurmaydi",
     "ikki marta yuradi"
    ],
    "c": 2,
    "e": "&& — oldingisi yashil bo'lsa.",
    "s": 8
   },
   {
    "q": "Har yangilanish tasdiq bilan chiqadi — bu?",
    "o": [
     "Deployment",
     "CI",
     "lentasiz",
     "Delivery"
    ],
    "c": 3,
    "e": "Delivery — tasdiq bilan.",
    "s": 20
   }
  ]
 },
 "25": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};
