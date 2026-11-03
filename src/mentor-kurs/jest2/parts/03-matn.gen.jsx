
// ============================================================
//  JEST-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/jest2-matn.py (manba: 12-Jest2-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Jest",
  "title": "Test to'g'ri kirishni sinadi. Noto'g'ri kirish-chi?",
  "seg": [
   [
    "a",
    "Jest-1 da to'g'ri kirishni sinadingiz — bugun <b>noto'g'ri kirishni sinaymiz</b>",
    "Assalomu alaykum. Jest birinchi darsida orderTotal'ni oddiy kirish bilan sinadingiz: o'n ming va ikki. Lekin haqiqiy do'konda mijoz nol yozadi, minus yozadi, raqam o'rniga so'z yozadi. Bugun aynan shu noto'g'ri kirishni sinaymiz."
   ],
   [
    "b",
    "Himoyasiz funksiya xato bermaydi, balki <b>noto'g'ri natija qaytaradi</b>",
    "Avval ko'ramiz: himoyasiz funksiya noto'g'ri kirishda xato bermaydi, balki noto'g'ri natija qaytaradi. Keyin funksiyaga himoya qo'yamiz va bu himoyani test bilan tekshiramiz."
   ],
   [
    "c",
    "Xato tashlaydigan funksiyani sinash yo'li boshqacha — uni <b>ataylab buzamiz</b>",
    "Xato tashlaydigan funksiyani sinash yo'li boshqacha, va o'quvchilar aynan shu yerda adashadi. Uni uch xil buzamiz. Keyin TypeScript tuzog'ini va o'quvchining uyga vazifasini ko'ramiz."
   ],
   [
    "d",
    "Olti bosqich, to'rt amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Dars olti bosqichdan iborat, to'rtta amaliyot bor. Shoshilmang: har ekranni boshidan eshitish mumkin. Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · edge",
  "title": "Oddiy yo'l — 2 kitob. Chegaradagi qiymatlar — 0, manfiy, 1",
  "seg": [
   [
    "a",
    "<b>Happy path</b> — hamma narsa rejadagidek: mijoz to'g'ri ma'lumot kiritadi",
    "Ikki so'zdan boshlaymiz. Birinchisi happy path, ya'ni oddiy yo'l: hamma narsa rejadagidek, mijoz ikki kitob oladi. Jest birinchi darsida aynan shuni sinadingiz."
   ],
   [
    "b",
    "<b>Edge case</b> — chegaradagi qiymat: 0, manfiy va eng kichik haqiqiy qiymat 1",
    "Ikkinchisi edge case, ya'ni chegara holati: oddiy qiymatlarning chetida turgan qiymatlar. Masalan nol dona, minus bir dona va eng kichik haqiqiy buyurtma, ya'ni bir dona. Xatolar ko'pincha aynan shu chetlarda yashiringan."
   ],
   [
    "c",
    "<b>Noto'g'ri tur</b> ham edge case: raqam o'rniga so'z yoki bo'sh qiymat",
    "Chegara holatining yana bir turi noto'g'ri ma'lumot: raqam o'rniga ikki degan so'z yoki umuman bo'sh qiymat, ya'ni null. Formada xato bo'lsa, server aynan shunday ma'lumot olishi mumkin."
   ],
   [
    "d",
    "Xulosa: har funksiya uchun — bitta oddiy holat va <b>bir nechta chegara holati</b>",
    "Xulosa: har funksiya uchun bitta oddiy holat va bir nechta chegara holati. O'quvchi darsi shunday deydi: chegara nol bilan bir orasida. Endi himoyasiz funksiya bu holatlarda nima qilishini ko'ramiz."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · edge",
  "title": "Himoyasiz price * quantity: xato yo'q — natija noto'g'ri",
  "seg": [
   [
    "a",
    "Nol dona — 0 so'm: <b>bepul buyurtma</b>, xato yo'q",
    "Himoyasiz funksiyani chaqiramiz. Nol dona bersak, natija nol so'm bo'ladi: bepul buyurtma, va hech qanday xato yo'q. Funksiya o'z ishini qildi: o'n ming ko'paytirish nol."
   ],
   [
    "b",
    "Minus bir — minus o'n ming: <b>do'kon mijozga pul to'laydimi?</b>",
    "Minus bir dona bersak, natija minus o'n ming: ya'ni do'kon mijozga pul to'lashi kerak. Yana xato yo'q. Bir dona esa to'g'ri hisoblanadi, o'n ming. Demak, chegara nol bilan bir orasida."
   ],
   [
    "c",
    "So'z — NaN, null — 0: eng xavflisi, chunki <b>hech kim sezmaydi</b>",
    "Ikki degan so'z bersak, natija NaN, ya'ni not a number, son emas. Null esa nolga aylanadi: yana bepul buyurtma. O'quvchi darsi bu haqda «hech kim sezmaydi» deydi. Eng xavflisi shu: dastur ishlayveradi, xato hech qayerda chiqmaydi."
   ],
   [
    "d",
    "Xulosa: himoyasiz funksiya noto'g'ri kirishda xato bermaydi, balki <b>noto'g'ri ishlaydi</b>",
    "Xulosa: himoyasiz funksiya noto'g'ri kirishda xato bermaydi, balki noto'g'ri ishlaydi. To'g'ri yo'l: noto'g'ri kirishni darhol rad etish, ya'ni xato tashlash. Buni ikkinchi bosqichda qilamiz."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Himoyasiz orderTotal(10000, -1) nima qaytaradi?",
  "q": "Yashirin buzilishni ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Funksiyada hech qanday himoya yo'q, faqat narx ko'paytirish soni. Unga minus bir dona berildi. Nima qaytadi? Variantni tanlang.",
  "ok": "To'g'ri, minus o'n ming. Funksiya shunchaki ko'paytiradi, manfiy son uni to'xtatmaydi. Xato yo'q, natija esa noto'g'ri: do'kon mijozga pul to'laydigan bo'ldi. Demak, himoyasiz funksiya noto'g'ri kirishda xato bermaydi, balki noto'g'ri hisoblaydi, shuning uchun himoya kerak.",
  "okShort": "−10000 — xato yo'q, lekin natija noto'g'ri. Himoya (guard) kerak.",
  "hint": "Funksiya faqat ko'paytiradi: 10000 × (−1) = ?",
  "correct": 1,
  "opts": [
   "Error — manfiy son taqiqlangan",
   "−10000 — xato yo'q, lekin natija noto'g'ri",
   "0",
   "NaN"
  ],
  "wrong": {
   "0": "Xato tashlash uchun funksiyada throw bo'lishi kerak — himoyasiz funksiyada yo'q.",
   "2": "0 ni 0 dona beradi; −1 da natija manfiy.",
   "3": "NaN — son bo'lmagan kirishda ('ikki'); −1 esa son."
  }
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · guard",
  "title": "toThrow() kutdi — Received function did not throw",
  "seg": [
   [
    "a",
    "<b>Test avval yoziladi</b>: «0 dona — xato bo'lishi kerak», funksiya hali himoyasiz",
    "Avval test yozamiz: nol dona va minus bir dona xato bo'lishi kerak. Funksiya hali himoyasiz. Expect ichida yangi narsa bor: to throw, ya'ni xato tashlashi kerak. Uning yozilishini sakkizinchi ekranda batafsil ko'ramiz."
   ],
   [
    "b",
    "Natija: <b>ikki edge testi qizil</b>, happy path yashil",
    "npm test qilamiz: oddiy holat yashil, ikki chegara holati qizil. Fayl bitta bo'lgani uchun test nomlari ko'rinadi: belgi bilan o'tganlari, iks bilan yiqilganlari."
   ],
   [
    "c",
    "<code>Received function did not throw</code> — <b>funksiya xato tashlamadi</b>",
    "Xabarni o'qiymiz: received function did not throw. Bu funksiya xato tashlamadi degani, test esa buni kutgan edi. Bu FAIL'da expected va received raqami yo'q, chunki solishtirilgan narsa xato bo'ldi."
   ],
   [
    "d",
    "Xulosa: <code>did not throw</code> — funksiyada <b>himoya yo'q yoki shart noto'g'ri</b>",
    "Xulosa: did not throw ko'rsangiz, sabab ikkitadan biri. Yo funksiyada himoya umuman yo'q, yo shart bu qiymatni o'tkazib yubordi. Ikkinchisini o'ninchi ekranda ko'ramiz."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · guard",
  "title": "Funksiya boshida shart: noto'g'ri bo'lsa — xato, to'g'ri bo'lsa — hisob",
  "seg": [
   [
    "a",
    "Guard — funksiya boshidagi himoya: <b>avval shart, keyin xato, keyin hisob</b>",
    "Did not throw, chunki himoya yo'q. Endi uni qo'yamiz. Himoya, inglizchasi guard, funksiyaning boshida turadi. Uning tartibi uch qadamdan iborat: avval shart, keyin xato tashlash, keyin oddiy hisob. O'quvchi darsida bu tartibni bloklardan yig'adi."
   ],
   [
    "b",
    "Shart <b>uchta tekshiruv</b>: son emasmi, NaN'mi, nol yoki manfiymi",
    "Shartda uchta tekshiruv bor: quantity son emasmi, NaN emasmi va nol yoki undan kichikmi. Biri to'g'ri bo'lsa, funksiya to'xtaydi. Matn ham, minus ham, nol ham shu yerda ushlanadi."
   ],
   [
    "c",
    "<code>throw new Error('…')</code> — <b>funksiyani to'xtatadi</b>, xabar sababni aytadi",
    "Throw new error funksiyani shu joyda to'xtatadi, return'gacha bormaydi. Xabarni tushunarli yozing, masalan: quantity musbat raqam bo'lsin. Keyin testda aynan shu xabarni tekshirish mumkin."
   ],
   [
    "d",
    "Natija: <b>beshala test yashil</b> — happy, 1 dona, 0, manfiy va matn",
    "npm test qilamiz: beshala test yashil. Ikki dona va bir dona hisoblanadi, nol, minus va matn esa xato beradi. Bir dona testi muhim: himoya to'g'ri buyurtmani to'sib qo'ymaganini ko'rsatadi."
   ],
   [
    "e",
    "Xulosa: guard qo'yilgach — xato holatlari ham, <b>eng kichik to'g'ri holat ham</b> sinaladi",
    "Xulosa: guard qo'yilgach ikki tomon sinaladi. Noto'g'ri kirish xato beradi, eng kichik to'g'ri kirish hisoblanadi. Faqat birini sinasangiz, himoya juda qattiq yoki juda yumshoq bo'lib qolganini bilmaysiz."
   ]
  ]
 },
 "7": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 4",
  "eyebrow": "Hozir o'zingizda · 10–15 daqiqa",
  "title": "Avval qizil edge testlari, keyin guard va yashil",
  "seg": [
   [
    "a",
    "Endi siz: avval edge testlarini yozasiz va <b>qizilni ko'rasiz</b>, keyin himoya qo'yasiz",
    "Endi navbat sizga. Jest birinchi darsidagi order fayllarini oching. Avval edge testlarini yozasiz va qizilni ko'rasiz, keyin himoya qo'yasiz. Bunga o'n-o'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: 0 va manfiy uchun <code>toThrow</code> testlari — <b><code>did not throw</code></b>",
    "Birinchi qadamda nol va minus bir uchun ikkita test yozasiz: expect ichida o'ralgan funksiya va to throw. Ikkinchisida npm test qilib, did not throw xabarini o'qiysiz."
   ],
   [
    "c",
    "3–4-qadam: guard va 1 dona testi; isbot — <b><code>Tests:</code> satri</b>",
    "Uchinchi qadamda funksiya boshiga himoya qo'yasiz. To'rtinchisida bir dona va matn testlarini qo'shib, npm test qilasiz. Isbot maydoniga Tests satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz test avval qizil, himoyadan keyin yashil bo'lishini o'z kodingizda ko'rdingiz."
   ]
  ]
 },
 "8": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "expect(orderTotal(10000, 0)).toThrow() — test xatoning o'zi bilan qulaydi",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi savol: qaysi yozuv to'g'ri — <b>o'ralganmi yoki o'ralmaganmi?</b>",
    "O'quvchi darsida savol bor: qaysi yozuv to'g'ri? Expect ichida funksiyani to'g'ridan-to'g'ri chaqirishmi yoki strelkali funksiya ichiga o'rashmi? Sinab ko'ramiz: o'rashni olib tashlaymiz."
   ],
   [
    "b",
    "O'ralmagan: funksiya expect'dan oldin ishlaydi va <b>xato testni qulatadi</b>",
    "O'ralmagan holatda funksiya expect'ga yetmasdan ishlaydi va xato tashlaydi. Expect uni tutishga ulgurmaydi. Natijada test qizil, lekin xabarda expected va received yo'q, funksiyaning o'z xatosi turibdi: quantity musbat raqam bo'lsin."
   ],
   [
    "c",
    "Belgi: FAIL xabarida <code>at orderTotal (order.ts:…)</code> — xato <b>funksiya ichidan uchdi</b>",
    "Qanday tanib olasiz: FAIL xabarida expect so'zi yo'q, o'rniga sizning xato xabaringiz va at orderTotal, order ts, uchinchi satr. Ya'ni xato test ichida tutilmadi, funksiyadan to'g'ridan-to'g'ri uchib chiqdi."
   ],
   [
    "d",
    "Xulosa: xato kutilsa — funksiya <b><code>() =&gt;</code> ichida</b>; aks holda test o'zi qulaydi",
    "Xulosa: xato kutilayotgan bo'lsa, funksiya doim strelka ichiga o'raladi. Shunda Jest uni o'zi chaqiradi va xatoni tutadi. O'quvchi darsida bu o'rab berish deyiladi."
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "Expected substring va Received message — xato bor, lekin boshqa xato",
  "seg": [
   [
    "a",
    "<code>toThrow()</code> faqat «xato bo'ldimi» deydi — <code>toThrow('matn')</code> <b>qaysi xato ekanini</b> tekshiradi",
    "O'rash bilan xato tutildi. Endi qaysi xato tutilganini tekshiramiz. Bo'sh to throw faqat xato bo'ldimi, shuni tekshiradi. Qavs ichiga matn yozilsa, xabar shu matnni o'z ichiga olishi kerak. Bu muhim: funksiya boshqa sabab bilan yiqilsa ham bo'sh to throw yashil bo'lardi."
   ],
   [
    "b",
    "Xabar mos emas: <code>Expected substring</code> — kutilgani, <b><code>Received message</code></b> — kelgani",
    "Testda narx xato deb yozdik, funksiya esa quantity musbat raqam bo'lsin deydi. Natija qizil: expected substring, ya'ni kutilgan bo'lak, va received message, ya'ni kelgan xabar. Bu Jest birinchi darsidagi expected va received'ning xato uchun ko'rinishi."
   ],
   [
    "c",
    "Xulosa: xabarni tekshiring — u xato <b>qaysi shartdan kelganini</b> aytadi",
    "Xulosa: xato kutilgan joyda xabarni ham tekshiring. Bir funksiyada bir nechta himoya bo'lsa, xabar qaysi biri ishlaganini aytadi. Sinfda buni o'quvchiga ko'rsating: xabar aniq yozilsa, test ham aniq bo'ladi."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · buzamiz",
  "title": "Shartsiz throw — oddiy holat ham qizil; < 0 — nol o'tib ketadi",
  "seg": [
   [
    "a",
    "O'quvchi darsidagi tuzoq: <code>throw</code> bor, lekin <b><code>if</code> yo'q</b> — har chaqiriq xato beradi",
    "O'quvchi darsida bloklarni yig'ishda tuzoq bor: throw qo'yilgan, lekin shart yo'q. Sinab ko'rdik: endi funksiya har chaqiriqda xato beradi."
   ],
   [
    "b",
    "Natija: xato testlari yashil, lekin <b>happy va 1 dona — qizil</b>",
    "Natija avvaliga g'alati ko'rinadi: xato kutgan testlar yashil, lekin ikki dona va bir dona qizil. Shuning uchun oddiy holat testi kerak: u himoya juda qattiq bo'lib qolganini ushlaydi."
   ],
   [
    "c",
    "<code>&lt;= 0</code> o'rniga <code>&lt; 0</code> — faqat <b>«0 dona» testi qizil</b>: <code>did not throw</code>",
    "Ikkinchi buzish yumshoqroq: kichik yoki teng o'rniga faqat kichik yozamiz. Minus ham, matn ham ushlanadi, lekin nol o'tib ketadi. Faqat nol dona testi qizil, xabari did not throw. Bu Jest birinchi darsidagi chegara xatosining aynan o'zi."
   ],
   [
    "d",
    "Xulosa: happy testi himoyaning <b>qattiqligini</b>, edge testi <b>yumshoqligini</b> ushlaydi",
    "Xulosa: ikki xil test ikki xil xatoni ushlaydi. Oddiy holat testi himoya juda qattiq bo'lsa qizil bo'ladi. Chegara testi esa himoyada teshik bo'lsa qizil bo'ladi. Ikkalasi ham kerak."
   ]
  ]
 },
 "11": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "0 dona — xato qizil: Received function did not throw",
  "q": "Buzishlarni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Nol dona testi qizil: did not throw. Qoida: nol dona ham noto'g'ri buyurtma. Nolni o'tkazib yuborgan satrni bosing.",
  "ok": "To'g'ri. Ikkinchi satrda faqat kichik yozilgan: nol noldan kichik emas, shuning uchun shart o'tkazib yuboradi. Kichik yoki teng bo'lsa, nol ham ushlanadi. Ekranda tuzatilgan holat, beshala test yashil. Demak, chegara shartida kichik yoki teng yoziladi, aks holda nol o'tib ketadi.",
  "okShort": "2-satr: <code>quantity &lt; 0</code> — 0 o'tadi. To'g'risi <code>quantity &lt;= 0</code>.",
  "hint": "Xato qaysi qiymatda: 0. Qaysi satr qiymatni tekshiradi va 0 uchun nima qaytaradi?",
  "task": "Qoida: 0 dona ham noto'g'ri buyurtma — guard uni ushlashi kerak. Bu funksiyada <code>orderTotal(10000, 0)</code> xato tashlamadi. <b>0 ni o'tkazib yuborgan satrni bosing.</b>"
 },
 "12": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 4",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "() =>siz, noto'g'ri xabar va < 0",
  "seg": [
   [
    "a",
    "Endi siz: o'z testingizni <b>uch xil buzasiz</b> va har xabarni o'qiysiz",
    "Endi o'z testingizni uch xil buzasiz. Bunga o'n daqiqa ketadi. Har buzishdan keyin npm test qilib, xabarni o'qing."
   ],
   [
    "b",
    "1–2-qadam: <b><code>() =&gt;</code>ni olib tashlang</b>, keyin <code>toThrow</code>ga boshqa xabar yozing",
    "Birinchi qadamda nol dona testida strelkani olib tashlang: test funksiyaning o'z xatosi bilan qulaydi. Keyin strelkani qaytaring. Ikkinchisida matn testida to throw ichiga narx xato deb yozing va received message'ni o'qing."
   ],
   [
    "c",
    "3–4-qadam: guardda <code>&lt; 0</code>, keyin tiklang; isbot — <b><code>Received message</code> satri</b>",
    "Uchinchi qadamda guardda kichik yoki teng o'rniga faqat kichik yozing: did not throw chiqadi. To'rtinchisida hammasini tiklang. Isbot maydoniga ikkinchi qadamdagi received message satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, xato kutiladigan testdagi uch xil xabarni endi bir qarashda ajrata olasiz."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · tuzoqlar",
  "title": "orderTotal(10000, 'ikki'): npm test yuradi, VS Code esa TS2345",
  "seg": [
   [
    "a",
    "O'quvchi darsi <code>'ikki'</code> va <code>null</code>ni sinaydi — <b>TypeScript faylda</b> bu nima bo'ladi?",
    "O'quvchi darsida ikki degan so'z va null bilan sinash bor. Lekin test fayli TypeScript: funksiya son kutadi. Sinab ko'rdik, natija kutilmagan."
   ],
   [
    "b",
    "<code>npm test</code> <b>turlarni tekshirmaydi</b>: test yuradi, <code>Received: NaN</code>",
    "Npm test turlarni tekshirmaydi: o'quvchi reposining sozlamasida isolated modules yoqilgan, shuning uchun ts jest faylni tekshirmasdan o'tkazadi. Test yuradi: matn NaN beradi, null esa nol."
   ],
   [
    "c",
    "VS Code esa <b>qizil chizadi</b>: <code>TS2345: Argument of type 'string' is not assignable…</code>",
    "Shu fayl VS Code'da qizil chiziq bilan ko'rinadi. Tsc buyrug'i ham shuni aytadi: string turidagi argument number'ga mos emas, null ham mos emas. O'quvchi qizilni ko'radi, lekin test baribir ishlayveradi va u adashadi."
   ],
   [
    "d",
    "Xulosa: noto'g'ri turni ataylab sinashda — <b><code>'ikki' as any</code></b>; qizil chiziq yo'qoladi",
    "Xulosa: noto'g'ri turni ataylab sinamoqchi bo'lsangiz, as any yozing: ikki as any. TypeScript'ga bu ataylab ekanini aytasiz, qizil chiziq yo'qoladi. Sinab ko'rdik, guard bilan bu test yashil."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · tuzoqlar",
  "title": "Ikki test fayli bo'lsa — faqat PASS fayl; nomlar --verbose bilan",
  "seg": [
   [
    "a",
    "Bitta faylda Jest har test nomini ko'rsatadi — ikkinchi fayl qo'shilganda <b>ko'rsatmaydi</b>",
    "Endi kichik, lekin sinfda albatta chiqadigan holat. Fayl bitta bo'lsa, Jest har test nomini ko'rsatadi. Ikkinchi test fayli qo'shilganda faqat PASS va fayl nomi qoladi. O'quvchi «testlarim qayoqqa ketdi?» deydi."
   ],
   [
    "b",
    "Testlar joyida — jami soni o'zgarmadi; nomlarni ko'rish uchun <b><code>npx jest --verbose</code></b>",
    "Testlar joyida: pastdagi jami o'n bir. Nomlarni ko'rish uchun npx jest minus minus verbose qiling. Shunda har fayl ostida nomlar va belgilar chiqadi."
   ],
   [
    "c",
    "Xulosa: nom ko'rinmasa — <b>xato emas</b>; jami sonni va <code>--verbose</code>ni ko'rsating",
    "Xulosa: nomlar ko'rinmasa, bu xato emas. Avval jami songa qarang, kerak bo'lsa verbose bilan yurgizing. FAIL bo'lganda esa qizil test nomi baribir chiqadi."
   ]
  ]
 },
 "15": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "O'quvchi: «Received function did not throw chiqdi». Bu nima degani?",
  "q": "Tuzoqlarni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. O'quvchi testi qizil: received function did not throw. Bu nima degani? Variantni tanlang.",
  "ok": "To'g'ri. Funksiya xato tashlamadi, test esa kutgan edi. Sabab ikkita: guard umuman yo'q yoki shart bu qiymatni o'tkazib yubordi, masalan nol. Funksiyani oching va shu qiymat bilan shartni qo'lda tekshiring. Demak, did not throw — himoya yo'qligi yoki shart teshikligi haqida xabar.",
  "okShort": "Funksiya xato tashlamadi: guard yo'q yoki shart qiymatni o'tkazdi.",
  "hint": "«did not throw» — so'zma-so'z: funksiya … qilmadi.",
  "correct": 0,
  "opts": [
   "Funksiya xato tashlamadi — guard yo'q yoki shart bu qiymatni o'tkazdi",
   "Funksiya xato tashladi, lekin boshqa xabar bilan",
   "Test fayli topilmadi",
   "() => yozilmagan"
  ],
  "wrong": {
   "1": "Boshqa xabar bo'lsa Expected substring / Received message chiqadi.",
   "2": "Fayl topilmasa No tests found bo'ladi.",
   "3": "() =>siz test funksiyaning o'z xatosi bilan qulaydi — did not throw emas."
  }
 },
 "16": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 4",
  "eyebrow": "Hozir o'zingizda · 5–10 daqiqa",
  "title": "Qizil chiziq, lekin test yuradi — o'zingiz ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: TypeScript tuzog'ini <b>o'z ko'zingiz bilan</b> ko'rasiz — VS Code va terminal",
    "Endi TypeScript tuzog'ini o'zingiz ko'rasiz. Bunga besh-o'n daqiqa ketadi. VS Code'ni ham, terminalni ham kuzating."
   ],
   [
    "b",
    "1–2-qadam: guardni vaqtincha oling, <code>'ikki'</code> testi — VS Code qizil, <b><code>npm test</code> yuradi</b>",
    "Birinchi qadamda guard satrlarini vaqtincha izohga oling. Ikkinchisida matn testidagi as any'ni olib tashlang. VS Code qizil chizadi, lekin npm test yuradi va received NaN deydi."
   ],
   [
    "c",
    "3–4-qadam: <code>as any</code> va guardni qaytaring; isbot — 2-qadamdagi <b><code>Received</code> qiymati</b>",
    "Uchinchi qadamda as any'ni qaytaring: qizil chiziq yo'qoladi. To'rtinchisida guardni qaytaring: hammasi yashil bo'ladi. Isbot maydoniga ikkinchi qadamdagi received qiymatini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, VS Code'dagi qizil chiziq va terminaldagi natija har xil narsa ekanini o'zingiz ko'rdingiz."
   ]
  ]
 },
 "17": {
  "type": "Lesson",
  "kicker": "5-bosqich · uyga vazifa misoli",
  "title": "0 va 100 — ishlaydi; −1 va 101 — xato: chegaraning ikki tomoni",
  "seg": [
   [
    "a",
    "O'quvchi uyga vazifasi: kupon — summadan foiz chegirma, <b>0 dan 100 gacha</b>",
    "Endi o'quvchining uyga vazifasi: apply coupon funksiyasi. U summadan foiz chegirma hisoblaydi. Unda ikki himoya bor: summa son bo'lishi kerak, foiz esa nol bilan yuz orasida. Sinab ko'rdik, beshta emas, oltita test chiqdi."
   ],
   [
    "b",
    "<b>Olti test</b>: oddiy (10 %), chegaralar 0 va 100, chegaradan tashqari 101 va −1, matn",
    "Oltita test bor. Oddiy holat: o'n foiz, natija to'qson ming. Chegaraning ichki tomoni, nol foiz va yuz foiz, ishlaydi. Tashqi tomoni, yuz bir va minus bir, xato beradi. Oxirgisi matn summa. Hammasi yashil: ikki fayl bilan o'n bir test."
   ],
   [
    "c",
    "<code>&gt;</code> o'rniga <code>&gt;=</code> — faqat <b>«chegara 100 %» qizil</b>, o'z xatosi bilan",
    "Endi chegara xatosini qilamiz: katta o'rniga katta yoki teng yozamiz. Natijada faqat yuz foiz testi qizil, xabari esa funksiyaning o'z xatosi: percent noldan yuzgacha bo'lsin. Yuz foiz endi taqiqlangan bo'lib qoldi."
   ],
   [
    "d",
    "Xulosa: <b>chegaraning ikki tomoni</b> — ichkarida ishlaydi (0, 100), tashqarida xato (−1, 101)",
    "Xulosa: chegaraning ikki tomonini sinang. Ichkaridagi qiymatlar, nol va yuz, ishlashi kerak. Tashqaridagilar, minus bir va yuz bir, xato berishi kerak. O'quvchi vazifasini tekshirganda shu to'rt qiymat bormi, shunga qarang."
   ]
  ]
 },
 "18": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "applyCoupon guardida percent > 100 o'rniga percent >= 100. Qaysi test qizil bo'ladi?",
  "q": "Chegarani ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. Kupon funksiyasida katta o'rniga katta yoki teng yozildi. Oltita testdan qaysi biri qizil bo'ladi? Variantni tanlang.",
  "ok": "To'g'ri, yuz foiz. Katta yoki teng bo'lsa, yuz ham taqiqlanadi va funksiya xato tashlaydi. Test esa nol natija kutgan edi. Yuz bir baribir xato beradi, u yashil qoladi. Demak, chegarani sinash uchun aynan chegaradagi qiymat testi kerak.",
  "okShort": "<code>&gt;= 100</code> — 100 ham xato; <code>chegara 100 %</code> qizil, qolgan 5 yashil.",
  "hint": "Ikki shart faqat bitta qiymatda farq qiladi — qaysi biri?",
  "correct": 2,
  "opts": [
   "101 % — xato",
   "0 %",
   "chegara 100 % — 0",
   "hammasi"
  ],
  "wrong": {
   "0": "101 ikkala shartda ham xato — test yashil qoladi.",
   "1": "0 ga bu shart tegmaydi.",
   "3": "Faqat chegaradagi qiymat farq qiladi."
  }
 },
 "19": {
  "type": "Practice",
  "kicker": "Amaliyot 4 / 4",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "O'quvchi uyga vazifasi — guard va olti test",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi uyga vazifasini o'zingiz qilasiz — <b>guard va olti test</b>",
    "Oxirgi amaliyotda o'quvchi uyga vazifasini o'zingiz qilasiz: kupon funksiyasi, ikki himoya va oltita test. Bunga o'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <code>coupon.ts</code> va <code>coupon.spec.ts</code>, <code>npm test</code> — <b>hammasi yashil</b>",
    "Birinchi qadamda coupon ts faylida ikki himoya va hisobni yozasiz. Ikkinchisida coupon spec ts faylida oltita test yozasiz. npm test qilganda hammasi yashil bo'lishi kerak."
   ],
   [
    "c",
    "3–4-qadam: <code>&gt;</code> → <code>&gt;=</code>, <b>qizil test nomini</b> o'qing; isbot — o'sha nom",
    "Uchinchi qadamda katta o'rniga katta yoki teng yozib, npm test qilasiz. To'rtinchisida qizil testning nomini nuqtali satrdan o'qib, isbot maydoniga yozasiz va funksiyani tiklaysiz."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, siz o'quvchi uyga vazifasini to'liq qildingiz va uning to'rt chegara qiymatini bilasiz."
   ]
  ]
 },
 "20": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m4b-03 · «Edge cases va error path»",
  "title": "m4b-03: shumtaka mijoz, guard va o'rash",
  "seg": [
   [
    "a",
    "m4b-03 — 21 ekran: o'quvchi <b>«shumtaka mijoz»</b> kiritgan g'alati buyurtmalarni sinaydi",
    "Endi o'quvchi darsini ko'ramiz: m4b-03, unda yigirma bir ekran bor. O'quvchi shumtaka mijoz kiritgan g'alati buyurtmalarni ko'radi, himoya yig'adi va xatoni test bilan sinashni o'rganadi."
   ],
   [
    "b",
    "Guard bloki: o'quvchi o'rashni tanlaydi — siz <b>o'ralmagan holatning xabarini</b> ko'rsatasiz",
    "Guard blokida o'quvchi to'g'ri yozuvni tanlaydi: o'ralgan funksiya. Siz proyektorda o'ralmaganini yurgizib ko'rsating: test funksiyaning o'z xatosi bilan qulaydi. Ko'rgan o'quvchi buni unutmaydi."
   ],
   [
    "c",
    "Amaliyot oldidan: <code>'ikki'</code> testida <b><code>as any</code></b> — aks holda VS Code qizil chizadi",
    "Amaliyot va uyga vazifadan oldin bitta ogohlantirish: matn testida as any yozilsin. Yozilmasa, VS Code qizil chizadi, test esa baribir yuradi va o'quvchi adashadi."
   ],
   [
    "d",
    "Xulosa: vaqt — guard va o'rashga ko'proq; uyga vazifada <b>to'rt chegara qiymati</b>",
    "Xulosa: vaqt, taklif: to'qson daqiqaning yigirma beshi guard va o'rashga, chunki eng ko'p adashish shu yerda. Uyga vazifani tekshirganda to'rt qiymatga qarang: nol, yuz, minus bir va yuz bir."
   ]
  ]
 },
 "21": {
  "type": "Lesson",
  "kicker": "6-bosqich · o'quvchi darsini o'tish",
  "title": "O'quvchi darsidagi so'zlar: shumtaka mijoz, «hech kim sezmaydi», guard bloklari, o'rab berish",
  "seg": [
   [
    "a",
    "O'quvchi darsi «shumtaka mijoz» deydi — siz <b>«edge case»</b> atamasini birga aytasiz",
    "Xaritani ko'rdingiz, endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz. O'quvchi darsi shumtaka mijoz va g'alati buyurtma deydi. Siz uning yonida atamani ham ayting: edge case, ya'ni chegara holati."
   ],
   [
    "b",
    "«Hech kim sezmaydi», kartochkada «jim buzilish» — xatosiz noto'g'ri natija; guard esa uch blok: <b>shart, xato, hisob</b>",
    "Xato chiqmasdan natija noto'g'ri bo'lgan holat haqida o'quvchi darsi «hech kim sezmaydi» deydi, kartochkasida esa «jim buzilish» deb yozilgan. Siz buni yashirin buzilish deysiz, ikkalasi bitta narsa. Guard o'quvchi darsida uch blokdan iborat: shart, xato tashlash va to'g'ri hisob. Kodda ular aynan if, throw va return."
   ],
   [
    "c",
    "Xulosa: «o'rab berish, ya'ni <code>() =&gt;</code>» — so'zni <b>kod bilan birga</b> ko'rsating",
    "Xulosa: o'rab berish deganda strelkali funksiya tushuniladi. So'zni aytganda ekranda kodni ham ko'rsating. Terminal so'zlari esa inglizcha qoladi: did not throw, received message."
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfda",
  "title": "Olti holat va tayyor javoblar",
  "seg": [
   [
    "a",
    "Sinfda albatta chiqadigan <b>olti holat</b> — hammasini bugun o'zingiz ko'rdingiz",
    "Endi sinfda albatta chiqadigan oltita holatni ko'ramiz. Hammasini bugun o'zingiz ko'rdingiz."
   ],
   [
    "b",
    "Uch xabar <b>uch sabab</b>: <code>did not throw</code>, funksiya xatosi, <code>Received message</code>",
    "Birinchi uchtasi xabardan taniladi. Did not throw chiqsa, himoya yo'q. Funksiyaning o'z xabari chiqsa, strelka yo'q. Received message chiqsa, boshqa xato tutilgan."
   ],
   [
    "c",
    "Happy qizil, <code>'ikki'</code> qizil chiziq, nomlar yo'q — shart, <b><code>as any</code></b>, <code>--verbose</code>",
    "To'rtinchisi: oddiy holat qizil bo'lsa, himoya juda qattiq. Beshinchisi: matn testida qizil chiziq bo'lsa, as any yozing. Oltinchisi: nomlar ko'rinmasa, sabab ikkita fayl."
   ],
   [
    "d",
    "Xulosa: <b>xabarni o'quvchi bilan birga o'qing</b> — har xabar boshqa sababni aytadi",
    "Xulosa va usul bitta: javobni darhol aytmang, xabarni o'quvchi bilan birga o'qing. Bu darsda har xabar boshqa sababni aytadi. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "23": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "Himoyasiz orderTotal(10000, 0) nima qaytaradi?",
    "o": [
     "Error",
     "0 — xatosiz",
     "NaN",
     "10000"
    ],
    "c": 1,
    "e": "Yashirin buzilish: bepul buyurtma.",
    "s": 3
   },
   {
    "q": "Received function did not throw nimani bildiradi?",
    "o": [
     "funksiya xato tashlamadi",
     "boshqa xabar",
     "fayl topilmadi",
     "() => yo'q"
    ],
    "c": 0,
    "e": "Guard yo'q yoki shart qiymatni o'tkazdi.",
    "s": 5
   },
   {
    "q": "Xato kutilayotgan testning to'g'ri yozuvi?",
    "o": [
     "expect(f(0)).toThrow()",
     "f(0).toThrow()",
     "expect(() => f(0)).toThrow()",
     "expect(f(0)).toBe(0)"
    ],
    "c": 2,
    "e": "Jest o'ralgan funksiyani o'zi chaqiradi.",
    "s": 8
   },
   {
    "q": "() =>siz toThrow — natija?",
    "o": [
     "PASS",
     "did not throw",
     "No tests found",
     "test funksiyaning o'z xatosi bilan qulaydi"
    ],
    "c": 3,
    "e": "Funksiya expect'dan oldin ishlaydi.",
    "s": 8
   },
   {
    "q": "Guardda <= 0 o'rniga < 0. Qaysi test qizil?",
    "o": [
     "0 dona — xato",
     "manfiy — xato",
     "2 kitob",
     "matn — xato"
    ],
    "c": 0,
    "e": "Faqat 0 da farq.",
    "s": 10
   },
   {
    "q": ".spec.tsda orderTotal(10000, 'ikki') — o'quvchi reposida nima bo'ladi?",
    "o": [
     "npm test yurmaydi",
     "VS Code qizil, test yuradi — NaN",
     "hech narsa",
     "No tests found"
    ],
    "c": 1,
    "e": "isolatedModules — ts-jest turlarni tekshirmaydi.",
    "s": 13
   },
   {
    "q": "applyCouponda > 100 o'rniga >= 100. Qaysi test qizil?",
    "o": [
     "101 %",
     "0 %",
     "chegara 100 %",
     "hammasi"
    ],
    "c": 2,
    "e": "100 ham taqiqlanadi.",
    "s": 17
   },
   {
    "q": "Kupon uchun chegaraning ikki tomoni — qaysi to'rt qiymat?",
    "o": [
     "10, 20, 30, 40",
     "1, 2, 3, 4",
     "50, 60, 70, 80",
     "0, 100, −1, 101"
    ],
    "c": 3,
    "e": "Ichkari ishlaydi, tashqari xato.",
    "s": 17
   }
  ]
 },
 "24": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};
