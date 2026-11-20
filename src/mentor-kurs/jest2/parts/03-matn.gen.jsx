
// ============================================================
//  Jest-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/jest2-matn.py (manba: 12-Jest2-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Jest",
  "title": "Bot to'g'ri kirishda ishlaydi — endi noto'g'ri kirishda to'g'ri buziladimi, shuni sinaymiz",
  "seg": [
   [
    "a",
    "Jest-1 da «ishlaydi»ni sinadingiz — bugun <b>«buzilganda to'g'ri buziladimi»</b>",
    "Assalomu alaykum. Jest birinchi darsida bot to'g'ri kirishda to'g'ri ishlashini sinadingiz. Bugun teskarisi: mijoz noto'g'ri yozganda, ombor yetmaganda bot to'g'ri buziladimi. Ekranda dars oxiridagi natija: beshta test fayli, yigirma beshta test, hammasi yashil."
   ],
   [
    "b",
    "Avval <b>umumiy tushuncha</b>: uch yo'l — happy path, edge case, error path",
    "Avval umumiy tushunchani olamiz: kodning uch yo'li bor. Happy path, ya'ni kutilgan to'g'ri kirish. Edge case, ya'ni qoidaning chegarasi. Error path, ya'ni kod ataylab xato beradigan yo'l. Bugun uchalasini botning haqiqiy joylarida ko'rasiz."
   ],
   [
    "c",
    "Telefon qoidasi, buyurtmaning uch xatosi, <b>sayt API'siga HTTP test</b>",
    "Keyin uchta haqiqiy joy: telefon raqami qoidasi, buyurtma berishdagi uchta xato va saytning API manzili. Oxirgisi Jest birinchi darsidagi savolga javob: sayt ham xuddi shunday sinaladi. Yo'lda ikkita yashirin tuzoqni ko'rasiz: ularda Jest qizil ham bermaydi."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot; oxirida <b>ikki ekran sinfga tayyorgarlik</b>",
    "Dars olti bosqichdan iborat, uchta amaliyotda o'zingiz yozasiz. Oxirgi ikki ekran sinfga tayyorgarlik: o'quvchi darsi xaritasi va o'quvchilar xato qiladigan joylar. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · umumiy tushuncha",
  "title": "Har funksiyada uch yo'l bor: kutilgan kirish, chegaradagi kirish va ataylab xato — test uchalasini sinaydi",
  "seg": [
   [
    "a",
    "Happy path — <b>kutilgan to'g'ri kirish</b>: Jest-1 ning hamma testi shu yo'lda edi",
    "Birinchi yo'l happy path: mijoz raqamni to'g'ri yozdi, omborda yetarli, buyurtma qabul qilindi. Jest birinchi darsidagi hamma test shu yo'lda edi. Haqiqiy do'konda esa mijozlarning hammasi ham to'g'ri yozmaydi."
   ],
   [
    "b",
    "Edge case — <b>qoidaning chegarasi</b>: kod xato bermaydi, lekin javob to'g'rimi?",
    "Ikkinchi yo'l edge case, ya'ni chegara. Mijoz raqamni probel bilan yozdi. Yoki raqam aynan to'qqizta, ya'ni eng qisqa ruxsat etilgani. Yoki omborda aynan ikkita bor va ikkitasi olinadi. Kod xato bermaydi, lekin javobi to'g'rimi, buni test aytadi."
   ],
   [
    "c",
    "Error path — <b>kod ataylab xato beradi</b>: qaysi xabar, keyin nima bo'lmaydi",
    "Uchinchi yo'l error path: telefon yo'q, savat bo'sh, omborda yetmaydi. Bu yerda kod ataylab xato beradi, bu to'g'ri xulq. Test xatoning o'zini kutadi: xato chiqdimi, qaysi xabar bilan, va xatodan keyin ombor o'zgarmay qoldimi."
   ],
   [
    "d",
    "Xulosa: har funksiyaga <b>uch yo'lning testi</b> — bugun uchalasini yozamiz",
    "Xulosa: bitta funksiyaga uch yo'lning testi yoziladi: kutilgan kirish, chegara va xato. Bugun telefon qoidasida chegarani, buyurtmada xato yo'lini, saytning API'sida esa so'rov va javobni sinaymiz. Telefon qoidasidan boshlaymiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "2-bosqich · telefon",
  "title": "PHONE qoidasi telegram.service.ts ichida yashirin — testdan chaqirib bo'lmaydi, shuning uchun alohida faylga chiqaramiz",
  "seg": [
   [
    "a",
    "Qoida <b><code>telegram.service.ts</code> 12-satrda</b>: <code>+</code> ixtiyoriy, 9 dan 13 tagacha raqam",
    "OrderBotNest papkangizni VS Code'da oching. Src, api, telegram papkasidagi telegram service ts faylining o'n ikkinchi satrida telefon qoidasi: regex. Plus ixtiyoriy, keyin to'qqizdan o'n uchtagacha raqam, boshqa hech narsa. Bir yuz ellik yettinchi satrda bot shu qoida bilan mijoz xabarini tekshiradi."
   ],
   [
    "b",
    "Muammo: qoida <b><code>const</code>, eksport qilinmagan</b> — test uni chaqira olmaydi",
    "Muammo shunda: qoida const, fayl ichida yashirin, eksport qilinmagan. Test uni chaqira olmaydi. Butun botni ko'tarib, Telegram xabarini soxtalashtirish esa unit-test emas. Shuning uchun qoidani alohida faylga chiqaramiz."
   ],
   [
    "c",
    "Yangi fayl <code>phone.ts</code>: <b><code>isPhone(text)</code> — bitta funksiya</b>, bot ham, test ham shuni chaqiradi",
    "Shu telegram papkasida phone ts faylini yaratamiz. Ichida ikki narsa: o'sha regex va is phone funksiyasi, u matnni oladi va true yoki false qaytaradi. Endi bot ham, test ham bitta funksiyani chaqiradi. Qoida bitta joyda yashaydi."
   ],
   [
    "d",
    "Xulosa: <b>sinamoqchi bo'lgan qoidani funksiyaga ajrating</b> — bu kodni ham tozalaydi",
    "Xulosa: sinamoqchi bo'lgan qoida service ichida yashirin bo'lsa, uni alohida funksiyaga ajrating. Telegram service endi is phone'ni import qiladi va chaqiradi. Bu testni mumkin qiladi va kodni ham tozalaydi: qoida bitta joyda. Endi qoidaning o'zini sinaymiz."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Mijoz raqamni «+998 90 123 45 67» deb yozdi. isPhone hozirgi regex bilan nima qaytaradi?",
  "q": "Qoidani ajratdik, endi tekshirib olaylik. Birinchi tekshiruv. Mijoz raqamni probellar bilan yozdi: plus to'qqiz to'qqiz sakkiz, probel, to'qson, probel va hokazo. Is phone hozirgi regex bilan nima qaytaradi? Variantni tanlang.",
  "ok": "To'g'ri. Regex'da faqat plus va raqamlar bor, probel yo'q, shuning uchun false. Trim faqat boshi va oxiridagi probelni oladi, o'rtadagini emas. Bot bu raqamni rad etadi, mijoz esa raqamni to'g'ri yozganini o'ylaydi. Demak, edge case ko'pincha qoida emas, mijozning odatidan chiqadi.",
  "okShort": "Regex'da probel yo'q → <code>false</code>. <code>trim()</code> faqat chekkadagi probelni oladi.",
  "hint": "Regex'da qaysi belgilar ruxsat etilgan? Probel ular ichidami?",
  "demak": "Edge case ko'pincha qoidadan emas, mijozning odatidan chiqadi.",
  "correct": 1,
  "opts": [
   "true — raqamlar soni to'g'ri, probel sanalmaydi",
   "false — regex'da faqat raqam va +, probel yo'q",
   "true — trim() probellarni olib tashlaydi",
   "Xato — regex matndagi probelda yiqiladi"
  ],
  "wrong": {
   "0": "Regex belgima-belgi tekshiradi: probel \\d emas.",
   "2": "trim() faqat boshidagi va oxiridagi probelni oladi, o'rtadagini emas.",
   "3": "Regex yiqilmaydi, u false qaytaradi — xato xabari yo'q."
  }
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · telefon",
  "title": "Bitta qoidaga yettita kirish: ikkita to'g'ri, to'rtta noto'g'ri va bitta chegara — it.each ularni bir jadvalda yozadi",
  "seg": [
   [
    "a",
    "<code>it.each</code> — <b>bir xil test, har xil kirish</b>: ro'yxat beriladi, Jest har biriga alohida test yasaydi",
    "Phone spec ts faylini telegram papkasida, phone ts yonida yaratamiz. Yangi narsa: it each. Unga kirishlar ro'yxati beriladi, Jest har biriga alohida test yasaydi. Birinchi ro'yxatda ikkita to'g'ri raqam: plus bilan va plussiz."
   ],
   [
    "b",
    "To'rtta noto'g'ri kirish: <b>8 ta raqam, 14 ta raqam, harf, bo'sh</b> — har birining nomi bor",
    "Ikkinchi ro'yxatda to'rtta noto'g'ri kirish: sakkizta raqam, ya'ni chegaradan bitta kam. O'n to'rtta raqam, chegaradan bitta ko'p. Harflar. Bo'sh matn. Har qatorda kirish va uning nomi: terminalda test nomi tushunarli bo'lsin."
   ],
   [
    "c",
    "Yettinchi test — mijozning odati: <b>probel bilan yozilgan raqam <code>true</code> bo'lishi kerak</b>",
    "Yettinchi test mijozning odati: probel bilan yozilgan raqam. Biz uni to'g'ri deb kutamiz, chunki bu haqiqiy raqam. VS Code terminalida npm test, ikki chiziqcha, phone. Oltita yashil, bittasi qizil: probel bilan yozilgan raqam."
   ],
   [
    "d",
    "Demak, <b>qoida mijozdan tor</b>: probel bilan yozilgan haqiqiy raqamni bot rad etadi",
    "Demak, sabab bitta joyda: qoida mijozdan tor. Mijoz probel bilan yozadi, regex esa faqat raqamlarni biladi. Test buni kod yozilgan kuniyoq ko'rsatdi, mijoz shikoyat qilguncha emas. Keyingi ekranda qoidani kengaytiramiz va yana bir chegarani ko'ramiz."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · ichida",
  "title": "Tuzatish bitta satr: tekshirishdan oldin probel va chiziqchani olib tashlaymiz — keyin test qoida nimani o'tkazib yuborishini ham ko'rsatadi",
  "seg": [
   [
    "a",
    "Tuzatish: <b><code>replace(/[\\s-]/g, '')</code></b> — probel va chiziqcha olib tashlanadi, keyin tekshiriladi",
    "Phone ts faylining to'rtinchi satrini o'zgartiramiz: trim o'rniga replace. U probel va chiziqchalarni olib tashlaydi, keyin regex tekshiradi. Mijoz qanday yozsa ham, raqamlar bir xil. Npm test phone: yettala test yashil."
   ],
   [
    "b",
    "Yana bir test: <b>9 ta nol ham <code>true</code></b> — qoida buni to'g'ri raqam deydi",
    "Endi qiziq test. To'qqizta nol: is phone nima deydi? True. Qoida bo'yicha bu to'g'ri raqam: to'qqizta raqam, boshqa hech narsa. Test yashil, lekin siz o'ylab qolasiz: haqiqatan ham to'qqizta nol telefon raqamimi?"
   ],
   [
    "c",
    "Test <b>qoidani tekshiradi, qoidaning o'zi to'g'rimi</b> — bu sizning qaroringiz",
    "Mana edge test'ning ikkinchi foydasi. Test qoidani tekshiradi, qoidaning o'zi to'g'rimi, buni test hal qilmaydi. To'qqizta nol o'tishi sizga kelishmasa, qoidani torroq yozasiz va test yana sizni qo'riqlaydi. Hozircha qoldiramiz: bot uchun yetarli."
   ],
   [
    "d",
    "Xulosa: <b>chegaradagi kirishni testga yozing</b> — u qoidani ko'zingiz oldiga olib keladi",
    "Xulosa: chegaradagi kirishni testga yozing, u qoidani ko'zingiz oldiga olib keladi. Bitta test qoidaning tor joyini topdi, probel. Boshqasi qoidaning keng joyini ko'rsatdi, to'qqizta nol. Endi shu ikkala faylni o'zingiz yozasiz."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 12 daqiqa",
  "title": "Telefon qoidasini alohida faylga chiqaring, chegara testlarini yozing va probel bilan qizilni ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>jest2-start</code> tegida</b> qoidani ajratasiz va yetti test yozasiz",
    "Endi navbat sizga. OrderBotNest papkangizda jest ikki start tegiga o'tasiz. Telegram papkasida phone ts va phone spec ts yaratasiz. Baza va token kerak emas. O'n ikki daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: teg va <b><code>phone.ts</code>, <code>it.each</code> bilan yetti test</b> — probel testi qizil",
    "Birinchi qadamda git fetch va checkout bilan tegga o'tasiz. Ikkinchisida phone ts'ga regex va is phone'ni, phone spec ts'ga it each bilan yetti testni yozasiz. Npm test phone: probel testi qizil bo'lishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <b><code>replace</code> bilan tuzatish</b>, «9 ta nol» testi; isbot — <code>Tests:</code> satri",
    "Uchinchi qadamda is phone'da trim o'rniga replace yozasiz: hammasi yashil. To'rtinchisida to'qqizta nol testini qo'shasiz va natijani ko'rasiz. Isbot maydoniga oxirgi natijaning tests satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz qoidani testga ochasiz va chegara testini yozasiz."
   ]
  ],
  "steps": [
   {
    "t": "Teg",
    "cmds": [
     "git fetch --tags",
     "git checkout jest2-start",
     "npm test"
    ],
    "exp": "Tests: 10 passed, 10 total"
   },
   {
    "t": "phone.ts + phone.spec.ts (3–5-ekrandagi kod)",
    "cmds": [
     "src/api/telegram/phone.ts",
     "src/api/telegram/phone.spec.ts",
     "npm test -- phone"
    ],
    "exp": "✕ mijoz probel bilan yozadi · Tests: 1 failed, 6 passed"
   },
   {
    "t": "Tuzatish",
    "cmds": [
     "isPhone da text.replace(/[\\s-]/g, '')",
     "npm test -- phone"
    ],
    "exp": "Tests: 7 passed, 7 total"
   },
   {
    "t": "Chegara",
    "cmds": [
     "it(\"9 ta nol ham o'tadi\") — isPhone('000000000') → true"
    ],
    "exp": "Tests: 8 passed, 8 total"
   }
  ],
  "proof": {
   "label": "Oxirgi natijaning Tests: satri",
   "placeholder": "masalan: Tests: 8 passed, 8 total",
   "re": "Tests:\\s+8 passed,\\s+8 total",
   "flags": "",
   "wrong": "Sakkizta test yashilmi? npm test -- phone natijasidagi Tests: qatorini qo'ying."
  },
  "trouble": [
   [
    "error: pathspec 'jest2-start' did not match",
    "teglar olinmagan — git fetch --tags, keyin checkout"
   ],
   [
    "2-qadamda hammasi ✓",
    "probel testi yozilmagan yoki replace allaqachon qo'yilgan — 5-ekrandagi yettinchi testni tekshiring"
   ],
   [
    "it.each da %s o'rniga undefined",
    "ro'yxat elementlari massiv emas — ['12345678', '8 ta raqam'] juftlik bo'lsin"
   ],
   [
    "Cannot find module './phone'",
    "fayl src/api/telegram/ da emas — telegram.service.ts yoniga ko'chiring"
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "3-bosqich · error path",
  "title": "Buyurtma berishda uchta xato bor: ikkitasi funksiyaning o'zida darhol, uchinchisi tranzaksiya ichida — testda bu farq hal qiluvchi",
  "seg": [
   [
    "a",
    "<code>order.service.ts</code> 24-satr: <b><code>place</code> ikki xatoni darhol otadi</b> — telefon yo'q, savat bo'sh",
    "Endi buyurtmaga o'tamiz. Src, api, order papkasidagi order service ts faylini oching, yigirma to'rtinchi satr: place funksiyasi. Yigirma besh va yigirma oltinchi satrlarda ikki tekshiruv: telefon yo'q bo'lsa xato, savat bo'sh bo'lsa xato. Ikkalasi darhol, funksiyaning o'zida otiladi."
   ],
   [
    "b",
    "Uchinchi xato <b>tranzaksiya ichida, 37-satr</b>: omborda yetmasa — promise'da otiladi",
    "Uchinchi xato o'ttiz yettinchi satrda: omborda yetmasa. Lekin u transaction ichida, ya'ni async funksiya ichida. Bu xato darhol emas, promise'da otiladi. Ekrandagi chizmaga qarang: ikki xato chapda, funksiyaning o'zida, bittasi o'ngda, promise ichida."
   ],
   [
    "c",
    "Farq nega muhim: <b>Jest'da ikkita har xil usul</b> — sinxron uchun biri, promise uchun boshqasi",
    "Bu farq test uchun hal qiluvchi. Sinxron xatoni expect, qavs ichida funksiya, to throw bilan ushlaymiz. Promise xatosini esa await expect, rejects, to throw bilan. Usulni almashtirib yuborsangiz, Jest qizil ham bermaydi, buni ikki ekrandan keyin ko'rasiz."
   ],
   [
    "d",
    "Xulosa: xatoni sinashdan oldin <b>qayerda otilishini</b> aniqlang — darholmi, promise ichidami",
    "Xulosa: xatoni sinashdan oldin uning qayerda otilishini aniqlang: funksiyaning o'zida darholmi, yoki promise ichidami. Place'da ikkala tur ham bor. Lekin testdan oldin yana bir muammo: place bazaga yozadi, bizda esa test bazasi yo'q. Keyingi ekranda shuni hal qilamiz."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · ichida",
  "title": "Unit-test bazasiz: DataSource o'rniga soxta obyekt, findOne biz aytgan mahsulotni qaytaradi — bu mock",
  "seg": [
   [
    "a",
    "<code>place</code> bazaga yozadi, test bazasi yo'q — <b>baza o'rniga mock</b>: soxta <code>manager</code>",
    "Place funksiyasi transaction ichida bazaga yozadi: find one, update, save. Unit-testda baza yo'q va kerak emas. Shuning uchun baza o'rniga mock, ya'ni soxta obyekt beramiz. Order papkasida order service spec ts faylini yaratamiz, sakkizinchi satrdan manager obyekti."
   ],
   [
    "b",
    "<code>jest.fn()</code> — <b>chaqiruvni yozib qoladigan soxta funksiya</b>; <code>transaction</code> esa mock'ni callback'ka beradi",
    "Jest fn soxta funksiya: u chaqirilganini va qanday argument bilan chaqirilganini yozib qoladi. Find one, query, save, hammasi shunday. O'n oltinchi satrda data source: uning transaction funksiyasi callback'ni darhol chaqirib, unga bizning manager'ni beradi. Place buni haqiqiy baza deb o'ylaydi."
   ],
   [
    "c",
    "<code>Test.createTestingModule</code>: <b>Nest'ga <code>DataSource</code> o'rniga mock'ni beramiz</b>, <code>OrderService</code> haqiqiy",
    "Yigirma uchinchi satrdan Nest'ning test moduli. Providers ro'yxatida order service haqiqiy, data source o'rniga esa bizning soxta obyekt. Nest uni inject qiladi, order service farqini bilmaydi. Repository ham kerak, bo'sh obyekt yetadi: place uni ishlatmaydi."
   ],
   [
    "d",
    "Xulosa: har testda <b><code>mockResolvedValue</code> bilan mahsulotni biz beramiz</b> — omborda 1 ta yoki 10 ta",
    "Xulosa: endi har testda omborni biz boshqaramiz. Mock resolved value bilan find one'ga nima qaytarishini aytamiz: omborda bitta Kolonka yoki o'nta. Baza yo'q, lekin place aynan haqiqiy kodda ishlaydi. Endi to'rtta testni yozamiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · error path",
  "title": "Sinxron xato — expect(() => …).toThrow(), promise xatosi — await expect(…).rejects.toThrow(): to'rt test, hammasi yashil",
  "seg": [
   [
    "a",
    "Sinxron xato: <b><code>expect(() =&gt; …)</code> — funksiyani o'rab beramiz</b>, Jest uni o'zi chaqiradi",
    "Birinchi ikki test sinxron xato uchun. Qarang: expect ichida funksiyani darhol chaqirmaymiz, qavs, strelka, keyin chaqiruv. Jest o'sha o'ramni o'zi chaqiradi va xatoni ushlaydi. To throw ichida xabar: telefon raqami yo'q. Xabar mos bo'lmasa, test qizil."
   ],
   [
    "b",
    "Promise xatosi: <b><code>await expect(…).rejects.toThrow()</code></b> — funksiya darhol chaqiriladi, promise kutiladi",
    "Uchinchi test promise xatosi uchun, shakli boshqa. Expect ichida place darhol chaqiriladi, o'ramsiz, chunki u promise qaytaradi. Keyin rejects: promise xato bilan tugashini kutamiz. Va boshida await: Jest natijani kutsin. Mock'da omborda bitta Kolonka, savatda ikkita."
   ],
   [
    "c",
    "To'rtinchi test — happy path: <b>omborda 10 ta, jami 100 000</b>, <code>query</code> bir marta chaqirildi",
    "To'rtinchi test happy path: omborda o'nta, buyurtma o'tadi, jami bir yuz ming so'm. Va yana bir tekshiruv: manager query bir marta chaqirildi, ya'ni update ketdi. VS Code terminalida npm test order service: to'rttala test yashil."
   ],
   [
    "d",
    "Xulosa: <b>sinxron — o'rab <code>toThrow</code>, promise — <code>rejects</code> va <code>await</code></b>; endi ikkalasini almashtirib ko'ramiz",
    "Xulosa: sinxron xatoga o'ram va to throw, promise xatosiga rejects va await. Ikkalasi yashil, lekin shakl muhim. Keyingi ikki ekranda ularni ataylab almashtiramiz va Jest nima qilishini ko'rasiz. Natija sizni hayron qoldiradi."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "Ombor xatosini toThrow bilan yozsak, Jest qizil bermaydi — jarayonning o'zi quladi, PASS ham, FAIL ham chiqmadi",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: testda yonib turgan <code>rejects</code> ustiga bosing",
    "Ombor testi to'g'ri yozilgan: await va rejects bor. Endi ataylab buzamiz. Buzishni o'zingiz qilasiz: order service spec faylining ellik birinchi satri yonib turibdi, ustiga bosing: test birinchi testdagi sinxron shaklga o'tadi.",
    "<b>order.service.spec.ts</b> 51-satridagi <b><code>await expect(…).rejects</code></b> ustiga bosing — test <code>expect(() =&gt; …).toThrow</code> shakliga o'tadi."
   ],
   [
    "a",
    "Ombor testi endi <b><code>toThrow</code> bilan</b> — sinxron shakl, promise xatosi uchun",
    "Test endi o'ram va to throw bilan, await yo'q, rejects yo'q. Ko'rinishi to'g'riga o'xshaydi: xabar ham o'sha. Npm test order service."
   ],
   [
    "b",
    "Natija: <b>PASS ham, FAIL ham yo'q</b> — terminalda xato va <code>Node.js v24.18.0</code>, jarayon quladi",
    "Natijaga qarang. PASS yo'q, FAIL yo'q, tests satri yo'q. Faqat xato: Kolonka, omborda faqat bitta qoldi, va Node versiyasi. Jest jarayonining o'zi quladi. Siz test qizil bo'ladi deb kutgan edingiz, u esa umuman natija bermadi."
   ],
   [
    "c",
    "Demak, sabab: <b><code>toThrow</code> o'ramni chaqirdi, <code>place</code> promise qaytardi, xato keyin keldi</b> — hech kim ushlamadi",
    "Demak, sabab bitta joyda. To throw o'ramni chaqirdi, place promise qaytardi, va shu paytda xato yo'q edi. Test o'tdi deb hisoblandi. Xato keyin, promise ichida otildi, uni hech kim ushlamadi, va Node butun jarayonni to'xtatdi. Bu yashirin xato: qizil emas, bo'sh."
   ],
   [
    "d",
    "Xulosa: promise xatosiga <b><code>toThrow</code> emas, <code>rejects</code></b> — aks holda Jest sizga hech narsa aytmaydi",
    "Xulosa: promise ichidagi xatoga to throw yozilmaydi, rejects yoziladi. Aks holda Jest sizga hech narsa aytmaydi, jarayon qulaydi. Sinfda o'quvchi test natijasi chiqmayapti desa, birinchi shuni so'rang: xato promise ichidami. Endi teskarisini ko'ramiz."
   ]
  ]
 },
 "12": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4",
  "title": "Telefon testini await expect(service.place(…)).rejects.toThrow() bilan yozdik. place xatoni darhol, funksiya ichida otadi. Natija?",
  "q": "Promise shaklini sinxron xatoga qo'yib ko'ramiz. Ikkinchi tekshiruv. Telefon testini rejects bilan yozdik, lekin place telefon xatosini darhol, funksiyaning o'zida otadi, promise qaytarmasdan. Npm test nima deydi? Variantni tanlang.",
  "ok": "To'g'ri. Place chaqirilganda xato darhol otildi, expect hali ishga tushmagan edi. Jest bu xatoni testning o'zi yiqildi deb hisoblaydi va FAIL beradi, xabari: telefon raqami yo'q. Bu safar natija bor, chunki xato sinxron, Jest uni ushladi. Demak, rejects faqat promise'dan keladigan xatoni ushlaydi.",
  "okShort": "Xato <code>expect</code>gacha otildi — FAIL, Jest ushladi. <code>rejects</code> faqat promise xatosi uchun.",
  "hint": "service.place(…) qachon chaqiriladi — expect ichida, rejectsdan oldin. Xato qachon otiladi?",
  "demak": "<code>rejects</code> faqat promise'dan keladigan xatoni ushlaydi; sinxron xato <code>expect</code>gacha otiladi.",
  "correct": 2,
  "opts": [
   "PASS — rejects sinxron xatoni ham ushlaydi",
   "Jarayon quladi — 11-ekrandagi kabi natija yo'q",
   "FAIL — xato expect ishga tushguncha otildi",
   "PASS — await xatoni promise'ga o'raydi"
  ],
  "wrong": {
   "0": "rejects promise kutadi; xato expect ishga tushguncha otildi.",
   "1": "Bu safar xato sinxron — Jest uni test ichida ushladi, natija bor.",
   "3": "await xatoni o'ramaydi; place chaqirilgan paytdayoq otildi."
  }
 },
 "13": {
  "type": "Lesson",
  "kicker": "3-bosqich · ichida",
  "title": "rejects to'g'ri, lekin await yo'q va xabar ataylab noto'g'ri: Jest xatoni topdi, lekin testga bog'lay olmadi — yana natija yo'q",
  "seg": [
   [
    "a",
    "Shakl deyarli to'g'ri: <code>rejects</code> bor, <b>faqat <code>await</code> yo'q</b>; xabarni ham ataylab noto'g'ri yozdik",
    "Yana bir yashirin xato, bu safar ancha nozik. Rejects bor, to throw bor, faqat boshida await yo'q. Va xabarni ataylab noto'g'ri yozdik: Planshet, to'qqizta qoldi, kodda esa Kolonka, bitta. Test qizil bo'lishi kerak. Npm test."
   ],
   [
    "b",
    "Natija: Jest farqni <b>topdi — <code>Expected</code> Planshet, <code>Received</code> Kolonka</b>, lekin PASS/FAIL yana yo'q",
    "Natijaga qarang. Jest farqni topdi: expected Planshet, received Kolonka, o'ttiz yettinchi satr. Lekin pastda yana Node versiyasi, PASS yo'q, FAIL yo'q. Jest xatoni ko'rdi, lekin uni testga bog'lay olmadi."
   ],
   [
    "c",
    "Demak, sabab: <b><code>await</code>siz test darhol tugadi</b>, promise keyin rad etildi — Jest uni qaysi testga yozishni bilmadi",
    "Demak, sabab bitta: await yo'q. Test funksiyasi promise'ni kutmasdan darhol tugadi. Promise keyin rad etildi, Jest bu xato qaysi testniki ekanini bilmadi va jarayonni to'xtatdi. Await bo'lsa, bu oddiy qizil test bo'lar edi, xabar bilan."
   ],
   [
    "d",
    "Xulosa: <b><code>rejects</code> oldida doim <code>await</code></b>; natija umuman chiqmasa — promise va <code>await</code>ni tekshiring",
    "Xulosa: rejects oldida doim await, test funksiyasi esa async. Jest natija umuman bermasa, bu kodning xatosi emas, testning shakli: promise xatosiga to throw yoki await'siz rejects. Endi shu satrni o'zingiz topasiz."
   ]
  ]
 },
 "14": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4 — qaysi satr xato?",
  "title": "Bu test faylida npm test natija bermaydi — jarayon qulaydi. Sababchi satrni toping",
  "q": "Yashirin xatoni ko'rdingiz, endi o'zingiz toping. Uchinchi tekshiruv. Bu test faylida npm test natija bermaydi, jarayon qulaydi. Bo'lakda bitta satr promise'ni kutmaydi. O'sha satrni bosing.",
  "ok": "To'g'ri. Shu satrda await yo'q: test promise'ni kutmasdan tugaydi, xato keyin keladi va Jest uni testga bog'lay olmaydi. Ekranda tuzatilgan satr: await bilan. Endi noto'g'ri xabar oddiy qizil test beradi, expected va received bilan. Demak, natija chiqmasa, avval rejects oldidagi await'ni qidiring.",
  "okShort": "<code>await</code> yo'q — test promise'ni kutmadi, jarayon quladi. <code>await</code> bilan — oddiy FAIL, <code>Expected</code>/<code>Received</code> bilan.",
  "hint": "Qaysi satr promise qaytaradi va uni kutmaydi? rejects oldida nima bo'lishi kerak?",
  "task": "Qoida: promise xatosi <code>await expect(…).rejects.toThrow()</code> bilan kutiladi. Bu bo'lakda bitta satr promise'ni kutmaydi. <b>O'sha satrni bosing.</b>"
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · chegara va «bo'lmasligi kerak»",
  "title": "Xato yo'lida test ikki narsani kutadi: xato chiqdi va ombor o'zgarmadi — not.toHaveBeenCalled()",
  "seg": [
   [
    "a",
    "Xato chiqdi — bu yarmi. <b>Xatodan keyin <code>UPDATE</code> ketmaganini</b> ham tekshiramiz",
    "Ombor testiga qaytamiz. Xato chiqdi, bu yarmi. Muhimroq savol: xatodan keyin ombor o'zgarmay qoldimi? Order service ts'da o'ttiz oltinchi satrdagi tekshiruv update'dan oldin turadi. Agar kimdir tartibni almashtirsa, xato chiqadi, lekin ombor baribir kamayadi."
   ],
   [
    "b",
    "<code>expect(manager.query).not.toHaveBeenCalled()</code> — <b>mock chaqiruvni yozib qolgan</b>, biz so'raymiz",
    "Mock bu yerda yordam beradi. Manager query jest fn, u chaqirilganini eslab qoladi. Biz so'raymiz: not to have been called, ya'ni umuman chaqirilmagan bo'lsin. Xato yo'lida bu eng muhim qator: bot xato berib, baribir omborni kamaytirmasin."
   ],
   [
    "c",
    "Happy path'da teskarisi: <b><code>toHaveBeenCalledTimes(1)</code></b> — <code>UPDATE</code> aynan bir marta ketdi",
    "Happy path testida teskarisi: to have been called times bir. Update aynan bir marta ketdi, ikki marta emas, nol marta emas. Mock bilan siz kod bazaga nima yuborganini sanaysiz: nima ketdi, nima ketmadi."
   ],
   [
    "d",
    "Xulosa: error path testi <b>ikki qismli</b>: xato chiqdi va keyingi qadam bajarilmadi",
    "Xulosa: xato yo'lining testi ikki qismli. Birinchisi: xato chiqdi, to'g'ri xabar bilan. Ikkinchisi: xatodan keyin bo'lmasligi kerak bo'lgan narsa bo'lmadi. Ikkinchisini ko'pchilik yozmaydi, aynan shu yerda bot pulni yo'qotadi. Endi chegarani buzamiz."
   ]
  ]
 },
 "16": {
  "type": "Lesson",
  "kicker": "4-bosqich · buzamiz",
  "title": "Ombor tekshiruvini <= qilsak, aynan 2 ta qolganda 2 tasini sotib bo'lmaydi — to'rt test yashil qoladi, chegara testi qizaradi",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: shartda yonib turgan <code>&lt;</code> ustiga bosing",
    "Ombor tekshiruvi to'g'ri ishlaydi. Endi chegarani buzamiz. Buzishni o'zingiz qilasiz: order service ts'ning o'ttiz oltinchi satrida kichik belgisi yonib turibdi, ustiga bosing: u kichik yoki tengga aylanadi.",
    "<b>order.service.ts</b> 36-satridagi <b><code>&lt;</code></b> ustiga bosing — <code>&lt;=</code> bo'ladi."
   ],
   [
    "a",
    "Buzildi: <b><code>&lt;</code> o'rniga <code>&lt;=</code></b> — omborda 2 ta, 2 tasini olsa, bot «faqat 2 ta qoldi» deydi",
    "Kichik endi kichik yoki teng. Omborda ikkita bo'lsa va mijoz ikkitasini olsa, bot xato beradi: faqat ikkita qoldi. Oxirgi mahsulot hech qachon sotilmaydi. Npm test order service."
   ],
   [
    "b",
    "To'rt test <b>yashil qoldi</b>: ular 1 ta va 10 ta ni sinaydi, chegarani emas",
    "To'rttala test yashil. Sababi: ombor testi bitta qolganini sinaydi, happy path o'nta. Ikkalasi chegaradan uzoqda. Kichik va kichik yoki teng farqi faqat ikki son teng bo'lganda ko'rinadi. Jest birinchi darsidagi sahifalash xatosi bilan bir xil."
   ],
   [
    "c",
    "Beshinchi test — <b>omborda aynan 2 ta, 2 tasi olinadi</b>: endi qizil, «faqat 2 ta qoldi»",
    "Beshinchi testni qo'shamiz: mock'da omborda aynan ikkita, savatda ikkita. Buyurtma o'tishi kerak, jami bir yuz ming. To'g'ri kod bilan beshtala yashil. Buzilgan kod bilan beshinchisi qizil: omborda faqat ikkita qoldi. Bitta belgi, bitta test uni ushladi."
   ],
   [
    "d",
    "Xulosa: har <b><code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code> shartiga chegara testi</b> — aynan teng bo'lgan qiymat bilan",
    "Xulosa: kodda kichik, katta, kichik yoki teng ko'rsangiz, aynan teng bo'lgan qiymat bilan test yozing. Bu test odatda eng qisqa va eng ko'p xatoni ushlaydi. Shartni tiklaymiz, beshtala yashil. Endi order service testlarini o'zingiz yozasiz."
   ]
  ]
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "Mock bilan place ning uch xatosini va chegarasini sinang, keyin kodni buzib qizilni ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>order.service.spec.ts</code></b> — mock, uch xato, chegara va bitta buzish",
    "Endi navbat sizga. Order papkasida order service spec ts yozasiz: mock, uchta xato, happy path va chegara. Ekrandagi namuna kodni ochishingiz mumkin, lekin o'zingiz yozing, nusxalamang. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>mock va to'rt test</b> — sinxron <code>toThrow</code>, promise <code>rejects</code>, <code>not.toHaveBeenCalled</code>",
    "Birinchi qadamda mock manager va test modulini yozasiz. Ikkinchisida to'rtta test: telefon va savat sinxron to throw bilan, ombor await rejects bilan va query chaqirilmaganini tekshirib, happy path jami bilan. Npm test order service: to'rttasi yashil."
   ],
   [
    "c",
    "3–4-qadam: <b>chegara testi va <code>&lt;=</code> buzish</b>; isbot — qizargan (✕) testning nomi",
    "Uchinchi qadamda chegara testini qo'shasiz: omborda aynan ikkita. To'rtinchisida order service ts'da kichikni kichik yoki tengga buzib, qaysi test qizarganini ko'rasiz va git checkout bilan tiklaysiz. Isbot maydoniga qizargan test nomini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz bazasiz xato yo'lini sinaysiz va chegara testining xatoni ushlashini o'zingiz ko'rgansiz."
   ]
  ],
  "steps": [
   {
    "t": "Mock va modul",
    "cmds": [
     "src/api/order/order.service.spec.ts — manager, dataSource, Test.createTestingModule (9-ekran)"
    ],
    "exp": "fayl tayyor"
   },
   {
    "t": "To'rt test",
    "cmds": [
     "telefon",
     "savat (toThrow)",
     "ombor (await … rejects.toThrow + not.toHaveBeenCalled)",
     "yetarli (total 100000)",
     "npm test -- order.service"
    ],
    "exp": "Tests: 4 passed, 4 total"
   },
   {
    "t": "Chegara",
    "cmds": [
     "it(\"chegara: omborda aynan 2 ta…\") — stock: 2",
     "npm test -- order.service"
    ],
    "exp": "Tests: 5 passed, 5 total"
   },
   {
    "t": "Buzish va tiklash",
    "cmds": [
     "order.service.ts 36-satr < → <=",
     "npm test -- order.service",
     "git checkout -- src/api/order/order.service.ts"
    ],
    "exp": "✕ chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi"
   }
  ],
  "proof": {
   "label": "4-qadamda qizargan (✕) testning nomi — buyruq emas",
   "placeholder": "masalan: chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi",
   "re": "(chegara|aynan 2|2 ta)",
   "flags": "i",
   "wrong": "Bu yerga buyruqni emas, terminalda ✕ yonidagi test nomini yozing, masalan: chegara: omborda aynan 2 ta."
  },
  "trouble": [
   [
    "Natija umuman yo'q, Node.js v24…",
    "promise xatosiga toThrow yoki rejects oldida await yo'q (11, 13-ekran)"
   ],
   [
    "Nest can't resolve dependencies of the OrderService (?, DataSource)… \"OrderRepository\" at index [0]",
    "providers da getRepositoryToken(Order) yo'q — bo'sh obyekt bilan qo'shing (9-ekran)"
   ],
   [
    "Received message: \"Mahsulot topilmadi: Kolonka\"",
    "mockResolvedValue shu testda yozilmagan — findOne undefined qaytardi, kod «topilmadi» dedi"
   ],
   [
    "4-qadamda hammasi ✓",
    "chegara testi stock: 2 emas — mock'da aynan 2 va savatda 2 bo'lsin"
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · HTTP va AI",
  "title": "Sayt ham shunday sinaladi: supertest server ochmasdan Nest ilovasiga so'rov yuboradi — GET / 200 va JSON, GET /nope 404",
  "seg": [
   [
    "a",
    "Jest-1 dagi savol: <b>«saytni test qila olamanmi?»</b> — ha, bitta paket: <code>supertest</code>",
    "Jest birinchi darsida savol bor edi: botni sinadim, saytni-chi? Javob: xuddi shunday, bitta qo'shimcha paket bilan. VS Code terminalida npm i minus D supertest va types supertest. Supertest server ochmasdan Nest ilovasiga so'rov yuboradi."
   ],
   [
    "b",
    "<code>app.controller.spec.ts</code>: <b>Nest ilovasini xotirada ko'taramiz</b> — <code>createNestApplication</code>, <code>app.init()</code>",
    "Src, api papkasida app controller spec ts yaratamiz. Before all'da test moduli faqat app controller bilan, keyin create nest application va init. Ilova xotirada ko'tarildi, port ochilmadi, baza yo'q. After all'da yopamiz."
   ],
   [
    "c",
    "Ikki test: <b><code>GET /</code> → 200 va <code>{ ok: true }</code></b>, <code>GET /nope</code> → 404 «Cannot GET /nope»",
    "Birinchi test: get, ildiz manzil. Status ikki yuz, tana ok true va service order bot, to equal bilan. Ikkinchisi error path: yo'q manzil. Status to'rt yuz to'rt, xabar cannot get nope. Npm test app controller: ikkalasi yashil."
   ],
   [
    "d",
    "Xulosa: <b>so'rov → status va tana</b>; bot handler'i ham, sayt route'i ham bir xil sinaladi",
    "Xulosa: HTTP test so'rov yuboradi va statusni, tanani tekshiradi. Bot handler'i ham, sayt route'i ham bitta usulda sinaladi: kirish beriladi, chiqish solishtiriladi. Kattaroq API'da shu qolip har route uchun takrorlanadi. Endi tekshirib olaylik."
   ]
  ]
 },
 "19": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "Ilovada faqat GET / route'i bor. Test GET /nope yubordi. res.status va res.body.message nima bo'ladi?",
  "q": "HTTP testni ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. Ilovada faqat bitta route bor, ildiz. Test yo'q manzilga, nope'ga so'rov yubordi. Status va xabar nima bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri. Nest yo'q manzilga o'zi to'rt yuz to'rt qaytaradi, tanasida message: cannot get nope. Bu kodingizdagi xato emas, kutilgan error path, va test uni aynan shunday kutadi. Demak, yo'q manzil beshyuz emas, to'rt yuz to'rt: mijoz xatosi, server xatosi emas.",
  "okShort": "Yo'q route → Nest'ning o'zi 404 va <code>Cannot GET /nope</code> — bu kutilgan error path.",
  "hint": "Brauzerda yo'q sahifani ochsangiz qaysi raqam chiqadi? Nest ham shuni qaytaradi.",
  "demak": "Yo'q manzil — 404, mijoz xatosi; 500 — server xatosi. Test ikkalasini farqlaydi.",
  "correct": 3,
  "opts": [
   "200 va { ok: true } — Nest ildizga yo'naltiradi",
   "500 — route topilmagani server xatosi",
   "Test yiqiladi — supertest yo'q manzilni yubormaydi",
   "404 va Cannot GET /nope — Nest'ning o'z javobi"
  ],
  "wrong": {
   "0": "Nest yo'naltirmaydi: route yo'q bo'lsa — 404.",
   "1": "500 — kod ichidagi xato; yo'q route oddiy 404.",
   "2": "supertest istalgan manzilga yuboradi; javob 404 keladi, test yiqilmaydi."
  }
 },
 "20": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI",
  "title": "Yangi ko'nikma davomi: AI edge va xato testlarini yozdi — ikki to'plam, ikkalasi yashil; endi ularni qabul qilamiz",
  "seg": [
   [
    "a",
    "Yana AI bosqichi: <b>edge va xato testlarini AI yozadi, siz qabul qilasiz</b>",
    "Jest birinchi darsidagi kabi oxirgi bosqich AI bilan. Farqi: bu safar AI happy path emas, edge va xato testlarini yozadi, ya'ni bugungi mavzuni. Biz ikki xil AI'ga bitta oddiy prompt berdik va natijani olib keldik."
   ],
   [
    "b",
    "Prompt: <b>«place va telefon tekshiruvi uchun edge case va xato testlar yoz»</b> — ishorasiz",
    "Prompt oddiy: order service'dagi place funksiyasi va telefon raqami tekshiruvi uchun edge case va xato holatlariga jest testlar yoz, npm test yashil bo'lsin. Rejects, await, chegara, mock, bu so'zlarning hech biri promptda yo'q. Har AI loyihaning alohida nusxasida ishladi."
   ],
   [
    "c",
    "Natija yaxshi: <b>50 va 42 test, kodga tegmadi</b>, <code>rejects</code> va <code>await</code> to'g'ri, «bo'lmasligi kerak» testlari bor",
    "Natija yaxshi ko'rinadi. Ikkalasi faqat test fayllarini qo'shdi, kodga tegmadi. Birinchisi ellik, ikkinchisi qirq ikkita test, hammasi yashil. Ikkalasi ham promise xatosiga rejects va await yozdi, jarayon qulamadi. Ikkalasi ham xatodan keyin update ketmaganini tekshirdi."
   ],
   [
    "d",
    "Lekin: ikkalasi <b>qoidani ajratmadi</b> va <b>probelli raqam rad etilishini «to'g'ri» deb yozdi</b>",
    "Lekin ikki narsa. Ikkalasi ham telefon qoidasini ajratmadi: uni butun handler orqali, to'rtta servisni soxtalab sinadi, birinchisida bir yuz qirq to'qqiz qator. Va ikkalasi ham probel bilan yozilgan raqam rad etilishini to'g'ri deb test qildi, biz esa buni oltinchi ekranda xato deb topgan edik."
   ],
   [
    "e",
    "Xulosa: <b>yashil hali tekshiruv emas</b>; buzib ko'ramiz — va yana bir savol: test qoidani sinaydimi, kodni muhrlaydimi",
    "Xulosa: yashil hali tekshiruv emas, keyingi ekranda beshta buzish bilan tekshiramiz. Va yangi savol tug'ildi: AI yozgan test qoidani sinaydimi, yoki kod hozir qanday ishlasa, shuni muhrlaydimi. Probelli raqam testi ikkinchisi."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Beshta buzish — uchala to'plam hammasini ushladi; oltinchi «buzilish»ni esa buzib bo'lmaydi: AI probelli raqam rad etilishini muhrlab qo'ygan",
  "seg": [
   [
    "a",
    "Beshta buzish — <b>bugungi beshta qoida</b>: regex chegarasi, <code>&lt;=</code>, tartib, xabar, bo'sh savat",
    "Beshta buzish oldik, har biri bugungi bitta qoida. Regex'da to'qqizni sakkizga. Kichikni kichik yoki tengga. Update'ni ombor tekshiruvidan oldinga. Xato xabarini o'zgartirish. Bo'sh savat tekshiruvini olib tashlash. Uchala to'plamni sinadik: bizniki va ikki AI."
   ],
   [
    "b",
    "Natija: <b>uchala to'plam beshalasini ushladi</b> — bu safar AI xato yo'lini yaxshi yozdi",
    "Natija: uchala to'plam beshala buzilishni ushladi. Bizning yigirma besh testimiz har buzilishda bittadan qizardi. Birinchi AI xabar o'zgarganda uchta, tartib buzilganda ikkita test bilan sezdi. Ikkinchi AI ham hammasini sezdi. Bu safar AI xato yo'lini yaxshi yozdi, buni tan olamiz."
   ],
   [
    "c",
    "Oltinchi «buzilish» jadvalda yo'q: <b>AI probelli raqam rad etilishini muhrladi</b> — <code>replace</code> tuzatishi uning testini qizartiradi",
    "Lekin bitta narsa jadvalga sig'maydi, chunki uni buzib bo'lmaydi: probel. Ikkala AI probelli raqam rad etilishini test qilib muhrladi. Siz oltinchi ekrandagi replace bilan tuzatsangiz, ularning testi qizaradi. Test qoidani emas, hozirgi kodni qo'riqlayapti. Mijoz odati haqida AI bilmaydi."
   ],
   [
    "d",
    "Xulosa: AI testi <b>xatoni ushlaydi, lekin hozirgi xulqni ham muhrlaydi</b> — har testdan «bu qoidami?» deb so'rang",
    "Xulosa: AI yozgan test ikki narsa qiladi. Xatoni ushlaydi, bu yaxshi. Va hozirgi xulqni, shu jumladan xatoni ham, muhrlab qo'yadi. Har testni o'qib so'rang: bu qoidami, yoki kod shunchaki hozir shunday ishlaydimi. Endi o'z AI'ingiz bilan sinab ko'rasiz."
   ]
  ]
 },
 "22": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "O'z AI'ingizga aniq shartli prompt bering, keyin to'rt tekshiruv va uchta buzish",
  "seg": [
   [
    "a",
    "Endi siz: AI'ga <b>shartlari aniq prompt</b> — <code>setStatus</code> ning xato yo'li uchun",
    "Endi navbat sizga. O'z AI'ingizga test yozdirasiz, mavzu: order service'dagi set status funksiyasi, uning xato yo'li. Promptni pastdagi tugma bilan nusxalaysiz. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: prompt va <b>to'rt tekshiruv</b> — diff, <code>await</code> + <code>rejects</code>, <code>not.toHaveBeenCalled</code>, «qoidami?»",
    "Birinchi qadamda promptni berasiz. Ikkinchisida natijani tekshirasiz: git diff stat'da faqat spec fayl, promise xatosida await va rejects, xatodan keyin increment chaqirilmaganini tekshiradigan test bor. Va har testdan so'rang: bu qoidami, yoki kod hozir shunday ishlaydimi."
   ],
   [
    "c",
    "3–4-qadam: <b>uchta buzish</b> — hammasi qizarsin; isbot — natija",
    "Uchinchi qadamda set status'ni uch joyda navbat bilan buzasiz: bekor tekshiruvini olib tashlang, increment'ni tekshiruvdan oldinga ko'chiring, xabarni o'zgartiring. Har biridan keyin npm test va git checkout. Qizarmagan joyga AI'dan test so'rang. Isbot maydoniga natijani yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz AI yozgan xato yo'li testini ikki qismi bo'yicha qabul qilasiz: xato chiqdi va keyingi qadam bo'lmadi."
   ]
  ],
  "steps": [
   {
    "t": "Prompt",
    "cmds": [
     "yuqoridagi prompt — o'z AI'ingizga",
     "npm test"
    ],
    "exp": "PASS"
   },
   {
    "t": "To'rt tekshiruv",
    "cmds": [
     "git diff --stat — faqat .spec.ts",
     "rejects oldida await",
     "expect(manager.increment).not.toHaveBeenCalled() bor",
     "har test «qoida»mi yoki «kod hozir shunday»mi — ikkinchisini belgilang"
    ],
    "exp": "4 ✓"
   },
   {
    "t": "Uch buzish",
    "cmds": [
     "order.service.ts setStatus: if (order.status === 'CANCELLED') tekshiruvini olib tashlang",
     "increment siklini tekshiruvdan oldinga ko'chiring",
     "allaqachon bekor qilingan → bekor — har biridan keyin npm test va git checkout -- src/api/order/order.service.ts"
    ],
    "exp": "har biri ✕"
   },
   {
    "t": "Qizarmagan joy",
    "cmds": [
     "AI'ga: «<buzish> ni hech bir test ushlamadi — shu qoidaga test yoz»",
     "3-qadamni qaytaring"
    ],
    "exp": "uchalasi ✕"
   }
  ],
  "proof": {
   "label": "Uch buzishning natijasi",
   "placeholder": "masalan: uchalasi qizardi · yoki: increment tartibi — avval qizarmadi, test qo'shdim",
   "re": "(qizar|fail|✕|uchala|hammasi|test qo'sh)",
   "flags": "i",
   "wrong": "Har buzishdan keyin npm test natijasini yozing."
  },
  "trouble": [
   [
    "git diff --stat da order.service.ts ham bor",
    "AI kodni o'zgartirdi — git checkout -- src/api/order/order.service.ts, «Tegma» bandini takrorlang"
   ],
   [
    "Natija umuman yo'q, Node.js v24…",
    "AI toThrow ni promise'da ishlatgan yoki await yo'q — 11, 13-ekran; satrni qo'lda tuzating"
   ],
   [
    "increment tartibi buzilishida hammasi ✓",
    "«bo'lmasligi kerak» testi yo'q — not.toHaveBeenCalled so'rang (15-ekran)"
   ],
   [
    "order.items undefined",
    "mock'dagi buyurtmada items: [] yo'q — mock'ga items bering"
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m4b-03 · «Edge cases va error path»",
  "title": "O'quvchi darsi: KitobShop orderTotal, «shumtaka mijoz» va guard — siz bilgan yo'lning kichik, bazasiz varianti",
  "seg": [
   [
    "a",
    "m4b-03 — 21 ekran: <b><code>orderTotal</code> ga guard</b>, shumtaka mijoz 0 va manfiy beradi",
    "Endi sinfga tayyorgarlik. O'quvchi darsi m4b-03, yigirma bir ekran. O'quvchi Jest birinchi darsidagi order total funksiyasiga guard qo'shadi: nol, manfiy, matn kelsa xato tashlaydi. Dars buni shumtaka mijoz misolida tushuntiradi: g'alati buyurtma beradigan mijoz. Baza yo'q, promise yo'q, hammasi sinxron."
   ],
   [
    "b",
    "O'quvchi so'zlari: <b>shumtaka — edge case, guard — <code>if</code> <code>throw</code> <code>return</code></b>, o'rab berish — <code>expect(() =&gt; …)</code>",
    "O'quvchi darsidagi so'zlar: shumtaka mijoz bu edge case. Guard bu if, throw, return. O'rab berish bu expect ichidagi qavs strelka. Kartochkadagi «jim buzilish» esa yashirin buzilish: xatosiz noto'g'ri natija. Sinfda so'zni atamasi bilan birga ayting."
   ],
   [
    "c",
    "Siz qo'shasiz: <b>ikki qismli test, <code>() =&gt;</code> siz natija, chegaraning ikki tomoni</b>",
    "Darsga siz qo'shadigan narsalar. Guard testida ikki qism: xato chiqdi va hisob bajarilmadi. O'rab bermasa nima bo'lishini bir marta haqiqiy terminalda ko'rsating: natija yo'q, bugun o'zingiz ko'rgansiz. Uyga vazifada apply coupon'ning aynan nol va aynan yuz chegaralarini sinattiring."
   ],
   [
    "d",
    "Xulosa: o'quvchi «test natijasi chiqmayapti» desa — <b><code>() =&gt;</code> yo'q</b>; pastda uch vaziyat va savollar",
    "Xulosa: o'quvchi test natijasi umuman chiqmayapti desa, birinchi expect ichidagi o'ramga qarang. Did not throw chiqsa, guard yo'q yoki shart qiymatni o'tkazgan. Pastda uch vaziyat va o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Mijoz «+998 90 123 45 67» yozdi, bot «Raqam noto'g'ri» dedi. Bu qaysi yo'l?",
    "o": [
     "Edge case — qoida mijoz odatidan tor",
     "Error path — kod ataylab xato berdi, to'g'ri",
     "Happy path — raqam to'g'ri, bot ham",
     "Xato emas — mijoz noto'g'ri yozgan"
    ],
    "c": 0,
    "e": "Haqiqiy raqam, qoida tor.",
    "s": 5
   },
   {
    "q": "const PHONE service ichida, eksport yo'q. Testda nima qilasiz?",
    "o": [
     "Butun botni ko'tarib, Telegram xabarini soxtalaymiz",
     "Qoidani alohida funksiyaga ajratib, uni sinaymiz",
     "Regex'ni testga nusxalab, o'sha yerda sinaymiz",
     "Service'ni any qilib, PHONE ga kiramiz"
    ],
    "c": 1,
    "e": "Bitta joy, bot ham test ham shuni chaqiradi.",
    "s": 3
   },
   {
    "q": "place ombor xatosini transaction ichida otadi. Qaysi shakl to'g'ri?",
    "o": [
     "expect(() => service.place(u, c)).toThrow('…') — o'ram bilan",
     "expect(service.place(u, c)).toThrow('…')",
     "await expect(service.place(u, c)).rejects.toThrow('…')",
     "expect(await service.place(u, c)).toThrow('…') — await ichida"
    ],
    "c": 2,
    "e": "Promise xatosi — rejects va await.",
    "s": 10
   },
   {
    "q": "Promise xatosiga toThrow yozildi. npm test nima ko'rsatadi?",
    "o": [
     "FAIL — xabar mos kelmadi",
     "PASS — xato ushlanmadi, test o'tdi",
     "FAIL — toThrow promise'ni darhol rad etadi",
     "Natija yo'q — jarayon quladi, Node.js v24"
    ],
    "c": 3,
    "e": "Xato promise'da, hech kim ushlamadi.",
    "s": 11
   },
   {
    "q": "expect(service.place(u, c)).rejects.toThrow('…') — await yo'q, xabar noto'g'ri. Natija?",
    "o": [
     "Natija yo'q — Jest xatoni testga bog'lay olmadi",
     "FAIL — Expected / Received farqi aniq ko'rsatiladi",
     "PASS — rejects promise'ni o'zi kutib oladi",
     "TypeScript xato — rejects oldida await shart"
    ],
    "c": 0,
    "e": "Test promise'ni kutmay tugadi.",
    "s": 13
   },
   {
    "q": "Xato yo'li testida «xato chiqdi»dan tashqari nima tekshiriladi?",
    "o": [
     "Xato necha millisekundda chiqqani — tezlik",
     "Xatodan keyin UPDATE chaqirilmagani",
     "Xato stack'ida qaysi fayl borligi",
     "Xato obyekti Error turida ekani"
    ],
    "c": 1,
    "e": "«Nima bo'lmasligi kerak» — not.toHaveBeenCalled.",
    "s": 15
   },
   {
    "q": "Mock'da omborda 1 ta va 10 ta sinalgan. Kodda < → <= buzildi. Testlar?",
    "o": [
     "Ikkalasi FAIL — chegara buzilgani uchun",
     "Ombor testi FAIL, happy PASS",
     "Ikkalasi PASS — chegara sinalmagan",
     "Natija yo'q — mock qulaydi"
    ],
    "c": 2,
    "e": "Farq faqat aynan teng bo'lganda.",
    "s": 16
   },
   {
    "q": "supertest bilan GET /nope yuborildi, route yo'q. Javob?",
    "o": [
     "500 — server route topa olmadi",
     "200 — Nest ildizga yo'naltiradi",
     "Test yiqiladi — manzil mavjud bo'lmagani uchun",
     "404 va Cannot GET /nope — Nest javobi"
    ],
    "c": 3,
    "e": "Nest'ning o'z 404 javobi — kutilgan error path.",
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
