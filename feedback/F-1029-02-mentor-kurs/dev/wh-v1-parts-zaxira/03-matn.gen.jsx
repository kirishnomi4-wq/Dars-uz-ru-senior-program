
// ============================================================
//  WEBHOOK MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/wh-matn.py (manba: 23-WH-mentor-v1.md)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Webhook",
  "title": "To'lov o'tdi. Backend buni kimdan biladi?",
  "seg": [
   [
    "a",
    "To'lov o'tganini Backend ilovadan emas, <b>to'lov xizmatidan biladi</b> — bugun shu yo'l",
    "Assalomu alaykum. Ulanish darslaridan keyin endi pul. Tashkilotchi Pro uchun to'ladi. Backend buni kimdan biladi? Ilovadan emas, to'lov xizmatining o'zidan. Bugun shu yo'l."
   ],
   [
    "b",
    "Avval xabar va imzo: kim yuboradi va <b>soxtasi qanday to'xtatiladi</b>",
    "Avval to'lov xabari: kim kimga yuboradi. Keyin imzo: manzil ochiq bo'lsa, soxta xabar qanday to'xtatiladi."
   ],
   [
    "c",
    "Keyin takror, rad va kalit — hammasi o'quvchi loyihasida, <b>haqiqiy yurgizilgan</b>",
    "Keyin takror xabar, rad etilgan to'lov va maxfiy kalit. Hammasini o'quvchilar loyihasida haqiqiy yurgizdik. Pul yechilmaydi, bu mashq."
   ],
   [
    "d",
    "To'rt bosqich, uch amaliyot. <b>Shoshilmang</b>: ustoz gapirib bo'lgach Davom ochiladi",
    "Dars to'rt bosqichdan iborat, uchta amaliyot bor. Shoshilmang: ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · xabar",
  "title": "Ilova sahifani ochadi, xizmat Backend'ga yozadi: POST /tolov/webhook",
  "seg": [
   [
    "a",
    "To'lov oqimida <b>to'rt ishtirokchi</b>: ilova, tashkilotchi, xizmat, Backend",
    "Avval kim kimga nima yuborishini ko'raylik. O'quvchi README'sidagi rejada to'rt qator: ilova, tashkilotchi, to'lov xizmati va Backend."
   ],
   [
    "b",
    "Ilova faqat sahifani ochadi; karta ma'lumoti <b>faqat xizmatda</b>",
    "Ilova faqat to'lov sahifasini ochadi. Tashkilotchi o'sha sahifada to'laydi yoki rad etadi. Karta ma'lumoti faqat xizmatda, Backend uni ko'rmaydi."
   ],
   [
    "c",
    "Natijani xizmat Backend'ga <b>o'zi yuboradi</b> — bu to'lov xabari, texnik nomi webhook",
    "Natijani esa xizmat Backend manziliga o'zi yuboradi. Bu to'lov xabari, texnik nomi webhook. Telegram ham yangi xabarni bot manziliga xuddi shunday yuboradi."
   ],
   [
    "d",
    "Xulosa: «to'landi» degan gap — faqat xizmatdan; ilovaning gapi <b>dalil emas</b>",
    "Xulosa: to'landi degan gapni Backend faqat xizmatdan qabul qiladi. Ilovaning gapi dalil emas, uni har kim yuborishi mumkin."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · xabar",
  "title": "«Mashq to'lov» — xizmat o'rnida, Backend'ning o'zida; karta so'ralmaydi",
  "seg": [
   [
    "a",
    "Haqiqiy to'lov xizmati yo'q — uning o'rnida <b>mashq sahifasi</b>, Backend'ning o'zida",
    "Yo'lni ko'rdik, endi uni sinaydigan joy. Kursda haqiqiy to'lov xizmati yo'q, pul yechilmaydi. Uning o'rnida mashq sahifasi turibdi, uni Backend'ning o'zi beradi."
   ],
   [
    "b",
    "<b>To'rt tugma</b>: to'lash, rad etish, ikki marta va imzosiz yuborish",
    "To'rt tugma: to'lash, rad etish, ikki marta yuborish va imzosiz yuborish. Har biri bitta haqiqiy holatni chaqiradi."
   ],
   [
    "c",
    "Tugma bosilsa Backend xabarni imzolab, o'z <b><code>POST /tolov/webhook</code></b> iga yuboradi",
    "Tugma bosilganda Backend xabarni yasaydi, maxfiy kalit bilan imzolaydi va o'zining webhook manziliga haqiqiy so'rov qiladi. Kalit brauzerga chiqmaydi."
   ],
   [
    "d",
    "Xulosa: «To'lash» → <b><code>200 {\"ok\":true}</code></b>, jadvalda bitta qator",
    "Xulosa: to'lash bosildi, javob ikki yuz, ok true. Jadvalda bitta qator paydo bo'ldi. Endi shu yo'lni qadam-baqadam ochamiz."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Ilova Backend'ga «to'landi» deb yozdi. Pro'ni ochamizmi?",
  "q": "Xabar yo'lini ko'rdingiz, tekshirib olaylik. Birinchi tekshiruv. Ilova Backend'ga to'landi deb yozdi. Pro'ni ochamizmi? Variantni tanlang.",
  "ok": "To'g'ri. Ilovaning gapini har kim yasashi mumkin. Dalil faqat xizmatning imzoli xabari. Token esa faqat kim yozayotganini aytadi, to'laganini emas. Demak, to'lov faqat xizmatning imzoli xabari kelganda tasdiqlanadi.",
  "okShort": "Yo'q — dalil faqat imzoli xizmat xabari.",
  "hint": "To'lov o'tganini kim aniq biladi?",
  "correct": 2,
  "opts": [
   "Ha — ilova bilgan",
   "Ha, agar summa to'g'ri bo'lsa",
   "Yo'q — faqat imzoli xizmat xabari dalil",
   "Ha, token bilan kelgan bo'lsa"
  ],
  "wrong": {
   "0": "Ilova so'rovini har kim yasaydi.",
   "1": "Summani ham yozish mumkin.",
   "3": "Token — kim, to'lov emas."
  }
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · imzo",
  "title": "X-Imzo = HMAC SHA-256 (xom tana, TOLOV_KALITI) — 64 belgi",
  "seg": [
   [
    "a",
    "Manzil internetda ochiq — <b>begona odam</b> ham «to'landi» deb yuborishi mumkin",
    "To'lov xabarini kim yuborganini Backend qanday biladi? Webhook manzili internetda ochiq, begona odam ham unga to'landi deb yozishi mumkin. Shuning uchun imzo kerak."
   ],
   [
    "b",
    "Imzo — tana va maxfiy kalitdan <b>HMAC</b>: kalitni faqat xizmat va Backend biladi",
    "Imzo xabar matni va maxfiy kalitdan hisoblanadi, HMAC SHA-256. Kalitni faqat ikki tomon biladi: xizmat va Backend. Natija oltmish to'rt belgi."
   ],
   [
    "c",
    "Backend xuddi shunday hisoblaydi va solishtiradi: avval shakl, keyin <b><code>timingSafeEqual</code></b>",
    "Backend xuddi shu hisobni o'zi qiladi va sarlavhadagi imzo bilan solishtiradi. Avval shaklini tekshiradi, keyin timing safe equal bilan solishtiradi."
   ],
   [
    "d",
    "Xulosa: kalitsiz to'g'ri imzo yasab bo'lmaydi; kalit bo'sh bo'lsa — <b>hech bir xabar o'tmaydi</b>",
    "Xulosa: kalitni bilmasdan to'g'ri imzo yasab bo'lmaydi. Kalit bo'sh bo'lsa, hech bir xabar qabul qilinmaydi. Bu ataylab shunday yozilgan."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · imzo",
  "title": "Imzosiz, abc, boshqa kalit, summasi o'zgargan — hammasi 401, jadvalda 0",
  "seg": [
   [
    "a",
    "Imzosiz va <code>X-Imzo: abc</code> — <b>401 «Imzo mos emas»</b>",
    "Imzoni ko'rdik, endi uni buzib sinaymiz. Imzosiz xabar: to'rt yuz bir, imzo mos emas. Abc degan imzo bilan ham to'rt yuz bir, shakli noto'g'ri."
   ],
   [
    "b",
    "<b>Boshqa kalit</b> bilan imzolangan — 401: kalitni bilmasa, imzo mos kelmaydi",
    "Boshqa kalit bilan to'g'ri shakldagi imzo: yana to'rt yuz bir. Kalitni bilmagan odam mos imzo yasay olmaydi."
   ],
   [
    "c",
    "To'g'ri imzo, lekin <b>summa 10 000 dan 1 ga o'zgartirilgan</b> — 401",
    "Eng qiziq holat: imzo to'g'ri kalit bilan, lekin keyin summa o'n mingdan birga o'zgartirildi. Yana to'rt yuz bir: imzo butun matndan hisoblangan."
   ],
   [
    "d",
    "Xulosa: to'rtala soxta xabar 401; jadvalda <b>bitta ham yozuv yo'q</b>",
    "Xulosa: to'rtala soxta xabar to'rt yuz bir oldi va jadvalga bitta ham qator yozilmadi. Imzo tekshiruvi eng birinchi turgani uchun."
   ]
  ]
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · imzo",
  "title": "Ma'nosi bir xil, bo'sh joyi boshqa JSON — 401; rawBody yo'q bo'lsa haqiqiy to'lov ham 401",
  "seg": [
   [
    "a",
    "Imzo matndan hisoblanadi: bo'sh joyli JSON — <b>boshqa matn</b>, 401",
    "Soxta xabarlar to'xtadi. Endi nozik joy: imzo matnning har bir belgisidan hisoblanadi. Ma'nosi bir xil, lekin bo'sh joylari boshqa JSON, to'rt yuz bir oldi."
   ],
   [
    "b",
    "Shuning uchun Backend so'rovning xom tanasidan hisoblaydi — <b><code>rawBody: true</code></b>",
    "Shuning uchun Backend imzoni so'rovning xom tanasidan, kelgan baytlardan hisoblaydi. NestJS'da buning uchun main ts da raw body true yoziladi."
   ],
   [
    "c",
    "<code>rawBody</code> olib tashlandi — <b>haqiqiy «To'lash» ham 401</b>",
    "Sinab ko'rdik: raw body olib tashlandi. Natija: mashq sahifasidagi haqiqiy to'lash ham to'rt yuz bir oldi. Backend xom tanani ko'rmaydi, imzo hech qachon mos kelmaydi."
   ],
   [
    "d",
    "Xulosa: o'quvchi «hamma xabar 401» desa — <b>avval kalit, keyin <code>rawBody</code></b>",
    "Xulosa: o'quvchi hamma xabar to'rt yuz bir desa, avval env'dagi kalitni, keyin main ts dagi raw body'ni tekshiring."
   ]
  ]
 },
 "8": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Imzosiz xabar 401 oldi — lekin jadvalda yangi qator paydo bo'ldi",
  "q": "Tartib qanchalik muhimligini endi o'zingiz topasiz. Ikkinchi tekshiruv. Imzosiz xabar to'rt yuz bir oldi, lekin jadvalda yangi qator paydo bo'ldi. O'rni noto'g'ri turgan satrni bosing.",
  "ok": "To'g'ri. Oltinchi satr: imzo tekshiruvi yozuvdan keyin turibdi. Xabar avval jadvalga yozildi, keyin rad etildi. Imzo birinchi tursa, soxta xabar hech narsaga tegmaydi. Demak, imzo tekshiruvi jadvalga yozishdan oldin turishi shart.",
  "okShort": "6-satr: imzo yozuvdan keyin — 401 qaytdi, lekin qator yozilib bo'ldi.",
  "hint": "Javob 401 bo'lishidan oldin qaysi satr jadvalga yozib ulgurdi?",
  "task": "Qoida: tartib — <b>avval imzo</b>, keyin maydonlar, takror va yozuv. Bu kodda imzosiz xabar <code>401</code> oldi, lekin <code>tolovlar</code> da yangi <code>tolandi</code> qatori bor. <b>O'rni noto'g'ri turgan satrni bosing.</b>"
 },
 "9": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "m13-dars-03-done: kalit, start, mashq sahifasi — To'lash va Rad etish",
  "seg": [
   [
    "a",
    "Endi siz: o'quvchi loyihasining to'lov yo'lini <b>o'z kompyuteringizda</b> yurgizasiz",
    "Imzo va tartibni ko'rdingiz, endi navbat sizga. O'quvchi loyihasining to'lov yo'lini o'z kompyuteringizda yurgizasiz. O'n besh daqiqa."
   ],
   [
    "b",
    "1–2-qadam: <code>m13-dars-03-done</code>, <code>npm ci</code>, <code>.env</code> da <b><code>TOLOV_KALITI</code></b>, start",
    "Birinchi: m13 dars uch done tegi va npm ci. Ikkinchi: env fayliga tasodifiy kalit yozing, buyrug'i tayyor. Kalitni hech kimga ko'rsatmang. Keyin npm run start."
   ],
   [
    "c",
    "3–4-qadam: <b>ro'yxat (login)</b>, mashq sahifasi — To'lash va Rad etish; isbot — sahifadagi satr",
    "Uchinchi: ro'yxatdan o'ting, bu tegda login bilan. To'rtinchi: brauzerda mashq sahifasi, to'lash va rad etish. Isbot maydoniga rad etish satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin o'quvchi loyihasining to'lov yo'li sizning kompyuteringizda ishlaydi va siz to'lash va rad etish javoblarini o'zingiz ko'rgan bo'lasiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · takror",
  "title": "Bir xil xabar ikki marta: ok, keyin takror — jadvalda bitta qator",
  "seg": [
   [
    "a",
    "Javob yo'qolsa xizmat o'sha xabarni qayta yuboradi — Backend uni <b>ikkinchi marta yozmasin</b>",
    "Imzo o'tdi, endi boshqa xavf. Javob yo'qolsa, xizmat o'sha xabarni qayta yuboradi. Backend uni ikkinchi marta yozmasligi kerak, aks holda Pro ikki marta uzayadi."
   ],
   [
    "b",
    "«Ikki marta yuborish»: birinchisi <code>ok</code>, ikkinchisi <b><code>takror</code></b> — ikkalasi 200",
    "Ikki marta yuborish tugmasi: birinchi javob ok, ikkinchisi takror. Ikkalasi ham ikki yuz, xizmat qayta yubormasin. Jadvalda bitta qator."
   ],
   [
    "c",
    "Bir vaqtda ikki xabar — tekshiruvdan ikkalasi o'tadi, <b>noyoblik ikkinchisini to'xtatadi</b>",
    "Ikki xabar aynan bir vaqtda kelsa, ikkalasi tekshiruvdan o'tib ketadi, PostgreSQL logida buni ko'rdik. Lekin to'lov raqami noyob: ikkinchisini baza to'xtatadi va kod uni ham takror deb qaytaradi."
   ],
   [
    "d",
    "Xulosa: takrorning <b>ikki himoyasi</b> — oldindan tekshiruv va jadvaldagi noyob raqam",
    "Xulosa: takrordan ikki himoya bor. Avval to'lov raqami tekshiriladi, oxirgi himoya esa bazadagi noyob ustun."
   ]
  ]
 },
 "11": {
  "type": "Lesson",
  "kicker": "3-bosqich · takror",
  "title": "To'lov o'tmasa ham xabar keladi: holat: rad yoziladi, hech narsa ochilmaydi",
  "seg": [
   [
    "a",
    "To'lov o'tmasa ham xizmat xabar yuboradi — <b>holat <code>rad</code></b>",
    "Takrorni ko'rdik, endi to'lov o'tmagan holat. Xizmat bunda ham xabar yuboradi, faqat holat rad. Backend uni ham qabul qiladi."
   ],
   [
    "b",
    "Rad ham yoziladi — tashkilotchi «to'lovim qayerda?» desa, <b>javob jadvalda</b>",
    "Rad ham jadvalga yoziladi. Tashkilotchi to'lovim qayerda desa, javob shu yerda: urinish bo'lgan, lekin o'tmagan."
   ],
   [
    "c",
    "<b>Pro hali ochilmaydi</b> — README: «Pro va ilova hali o'zgarmaydi»",
    "Ehtiyot bo'ling: o'quvchi darsidagi sxemada Backend Pro muddatini uzaytiradi deb yozilgan. Bu reja. Repo'da hozir faqat yozuv bor, Pro hali o'zgarmaydi."
   ],
   [
    "d",
    "Xulosa: rad — yoziladigan natija; bugungi qurilgan qism — <b>qabul va yozuv</b>",
    "Xulosa: rad ham yoziladigan natija. Bugun qurilgan qism: xabarni qabul qilish va yozish. Pro'ni ochish keyingi ish."
   ]
  ]
 },
 "12": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "Xizmat bir xil xabarni ikkinchi marta yubordi. Backend nima qaytaradi?",
  "q": "Takrorni ko'rdingiz, tekshirib olaylik. Uchinchi tekshiruv. Xizmat bir xil xabarni ikkinchi marta yubordi. Backend nima qaytaradi? Variantni tanlang.",
  "ok": "To'g'ri. Backend ikki yuz va takror true qaytaradi, jadvalga hech narsa yozilmaydi. Agar xato kodi qaytsa, xizmat xabarni yana va yana yuboraveradi. Demak, takror xabarga ham muvaffaqiyat javobi qaytariladi, faqat yozuv takrorlanmaydi.",
  "okShort": "<code>200 { takror: true }</code> — xizmat qayta yubormasin.",
  "hint": "Javob 200 bo'lmasa xizmat nima qiladi?",
  "correct": 3,
  "opts": [
   "409 — bu to'lov bor",
   "500 — noyoblik xatosi",
   "200 va ikkinchi qator",
   "200 { takror: true } — yozuvsiz"
  ],
  "wrong": {
   "0": "Xizmat yana yuboradi.",
   "1": "Kod uni takror qiladi (10-ekran).",
   "2": "Raqam noyob."
  }
 },
 "13": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 5 daqiqa",
  "title": "Mashq sahifasida «Ikki marta yuborish» va «Imzosiz yuborish»",
  "seg": [
   [
    "a",
    "Endi siz: <b>takror va imzosiz</b> xabarni o'z sahifangizda ko'rasiz",
    "Takror va soxta xabarni ko'rdingiz, endi o'zingiz bosasiz. Besh daqiqa. O'sha mashq sahifasi ochiq."
   ],
   [
    "b",
    "1–2-qadam: «Ikki marta yuborish», «Imzosiz yuborish»; isbot — <b>ikkinchi javob</b>",
    "Birinchi: ikki marta yuborish, ikkinchi satrga qarang. Ikkinchi: imzosiz yuborish, to'rt yuz bir. Isbot maydoniga ikki marta yuborishning ikkinchi satrini qo'ying."
   ],
   [
    "c",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. Ikkala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz takror xabar va imzosiz xabarga Backend qanday javob berishini o'z sahifangizda ko'rgan bo'lasiz."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "3-bosqich · kalit",
  "title": "TOLOV_KALITI — .env va Render'da; agentga, chatga, README'ga yozilmaydi",
  "seg": [
   [
    "a",
    "Kalit kimda bo'lsa, o'sha <b>«to'landi» xabarini yasay oladi</b>",
    "Imzo kalitga tayanadi. Demak kalit kimda bo'lsa, o'sha to'landi xabarini yasay oladi. Shuning uchun u faqat env faylida va Render sozlamasida turadi."
   ],
   [
    "b",
    "O'quvchi darsi: kalit agentga, chatga, README'ga va <b>skrinshotga yozilmaydi</b>",
    "O'quvchi darsi qat'iy: kalit agentga, chatga, README'ga va skrinshotga yozilmaydi. Agent faqat uning nomini biladi."
   ],
   [
    "c",
    "<code>.env</code> bo'sh qolsa — <b>har xabar 401</b>: «To'lash» ham o'tmaydi",
    "Sinfdagi tez-tez holat: env'da kalit bo'sh. Natija: mashq sahifasidagi to'lash ham to'rt yuz bir. Kod buni ataylab qiladi."
   ],
   [
    "d",
    "Xulosa: <code>git ls-files backend/.env</code> bo'sh bo'lsin; kalit chiqib qolsa — <b>yangisi</b>",
    "Xulosa: git ls files bilan env Git'da yo'qligini tekshiring. Kalit qayerdadir ko'rinib qolsa, yangisi qo'yiladi, eskisi ishlatilmaydi."
   ]
  ]
 },
 "15": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "main.ts dan rawBody ni olib tashlang — keyin qaytaring",
  "seg": [
   [
    "a",
    "Endi siz: xom tana o'qilmasa nima bo'lishini <b>o'zingiz buzib ko'rasiz</b>",
    "Oxirgi amaliyot: xom tanani o'zingiz buzasiz. O'n daqiqa. Sinfda hamma xabar to'rt yuz bir desa, sababni tez topasiz."
   ],
   [
    "b",
    "1–2-qadam: <code>main.ts</code> da <b><code>{ rawBody: true }</code></b> ni o'chiring, qayta start, «To'lash»",
    "Birinchi: main ts da raw body true qismini o'chiring va Backend'ni qayta yoqing. Ikkinchi: mashq sahifasida to'lash."
   ],
   [
    "c",
    "3–4-qadam: 401 ni ko'ring, qaytaring — <b>yana 200</b>; isbot — buzilgan javob",
    "Uchinchi: to'rt yuz bir chiqdi, imzo mos emas. To'rtinchi: raw body'ni qaytaring, qayta start, to'lash, ikki yuz. Isbot maydoniga to'rt yuz birli satrni qo'ying."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing, yechimlar oynasi ochiladi. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz raw body bo'lmasa haqiqiy to'lov ham to'rt yuz bir olishini o'zingiz buzib ko'rgan bo'lasiz."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "O'quvchi .env ga TOLOV_KALITI ni yozmagan. Mashq sahifasida «To'lash» nima beradi?",
  "q": "Kalitni ko'rdingiz, tekshirib olaylik. To'rtinchi tekshiruv. O'quvchi env fayliga kalitni yozmagan. Mashq sahifasida to'lash nima beradi? Variantni tanlang.",
  "ok": "To'g'ri, to'rt yuz bir. Kod kalit bo'sh bo'lsa hech bir xabarni qabul qilmaydi. Backend esa ishlab turadi, shuning uchun sabab darrov ko'rinmaydi. Demak, hamma xabar to'rt yuz bir olsa, avval env faylidagi kalitni tekshiring.",
  "okShort": "<code>401</code> — kalit bo'sh: hech bir xabar o'tmaydi.",
  "hint": "imzo.ts da kalit bo'sh bo'lsa nima qaytadi?",
  "correct": 1,
  "opts": [
   "200 — kalitsiz ham ishlaydi",
   "401 — kalit bo'sh bo'lsa hech bir xabar qabul qilinmaydi",
   "500 — Backend yiqiladi",
   "Backend ishga tushmaydi"
  ],
  "wrong": {
   "0": "Bo'sh kalit — hech narsa o'tmaydi (14-ekran).",
   "2": "Yiqilmaydi, 401.",
   "3": "Ishga tushadi; JWT_SECRET bo'lmasa boshqa gap."
  }
 },
 "17": {
  "type": "Lesson",
  "kicker": "4-bosqich · o'quvchi darsini o'tish",
  "eyebrow": "m11-03 · «Webhook: to'lov Backend'ga qanday yetib keladi»",
  "title": "m11-03: xabar, imzo, takror, rad va sxema",
  "seg": [
   [
    "a",
    "m11-03 — <b>20 ekran</b>: xabar, imzo, takror, rad va to'lov oqimi sxemasi",
    "Hammasini o'zingiz yurgizdingiz, endi o'quvchi darsi: m11-03, yigirma ekran. Xabar, imzo, takror, rad, test rejim va to'lov oqimi sxemasi."
   ],
   [
    "b",
    "<b>Og'ir qism</b> — 8-ekran kod oynasi va ikki blok; har blokda Render kutiladi",
    "O'quvchi darsi o'zi ogohlantiradi: og'ir qism sakkizinchi ekrandagi kod oynasi va ikki blok, har birida Render'da yangi versiya kutiladi. Uchinchi va o'n ikkinchi ekranlarga ortiqcha vaqt bermang."
   ],
   [
    "c",
    "<b>Pul chegarasi</b>: hech kim haqiqiy xizmatga ulanmaydi, karta yozilmaydi",
    "Pul chegarasi qat'iy: darsda hech kim haqiqiy to'lov xizmatiga ro'yxatdan o'tmaydi, karta yozmaydi. O'quvchi Payme ulasam bo'ladimi desa, o'n birinchi ekrandagi javobni o'qing."
   ],
   [
    "d",
    "Xulosa: A1 da <b>kalit gigiyenasi</b>, A2 da uch tekshiruv — Render'da <code>RENDER_EXTERNAL_URL</code>",
    "Xulosa: birinchi blokda kalit gigiyenasini kuzating, ikkinchisida uch tekshiruvni. Render'da mashq sahifasi o'z manzilini o'zi topadi, biz buni sinamadik."
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "4-bosqich · sinfda",
  "title": "Xabar, imzo, takror — va olti holat",
  "seg": [
   [
    "a",
    "O'quvchi «to'lov xabari», «imzo», «takror» deydi — siz <b>koddagi joyini</b> bilasiz",
    "Xaritani ko'rdingiz. Endi o'quvchi darsida ishlatiladigan so'zlarni ko'ramiz: to'lov xabari, imzo va kalit, takror xabar va test rejim. Siz har birining kodda qayerda turishini bilasiz."
   ],
   [
    "b",
    "Birinchi uchta holat — <b>401 bilan bog'liq</b>: kalit, <code>rawBody</code>, tartib",
    "Endi sinfda uchraydigan olti holatni ko'ramiz. Birinchi uchtasi imzo bilan bog'liq. Hamma xabar to'rt yuz bir olsa, kalit bo'sh. Haqiqiy to'lash ham to'rt yuz bir olsa, raw body yoqilmagan. Javob to'rt yuz bir, lekin jadvalga qator yozilgan bo'lsa, tekshiruv tartibi buzilgan."
   ],
   [
    "c",
    "Qolgan uchtasi: ro'yxatda <b><code>login</code></b>, noto'g'ri <code>oyinchi</code>, <code>.env</code> Git'da",
    "To'rtinchi holat: ro'yxat to'rt yuz qaytaradi, chunki bu tegda login maydoni kerak. Beshinchi holat: manzildagi oyinchi qiymati noto'g'ri. Oltinchi holat: env fayli Git'ga tushib qolgan, bunda kalitlar darhol almashtiriladi."
   ],
   [
    "d",
    "Xulosa: 401 bo'lsa — kalit, <code>rawBody</code>, tartib; qolganida — <b>xabar matnini o'qing</b>",
    "Xulosa va usul: javob to'rt yuz bir bo'lsa, shu tartibda tekshiring: kalit, raw body, keyin tekshiruv tartibi. Qolgan holatlarda javob matnini o'quvchi bilan birga o'qing."
   ]
  ]
 },
 "19": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "To'lov o'tganini Backend kimdan biladi?",
    "o": [
     "to'lov xizmati xabaridan",
     "ilovadan",
     "tashkilotchidan",
     "README'dan"
    ],
    "c": 0,
    "e": "Ilovaning gapi dalil emas.",
    "s": 2
   },
   {
    "q": "Imzo nimadan hisoblanadi?",
    "o": [
     "faqat summadan",
     "xom tana va maxfiy kalitdan",
     "tokendan",
     "to'lov raqamidan"
    ],
    "c": 1,
    "e": "HMAC SHA-256.",
    "s": 5
   },
   {
    "q": "Summasi o'zgartirilgan xabar (imzo eski)?",
    "o": [
     "200",
     "400",
     "401 — imzo mos emas",
     "500"
    ],
    "c": 2,
    "e": "Imzo butun matndan.",
    "s": 6
   },
   {
    "q": "rawBody: true yo'q bo'lsa?",
    "o": [
     "hech narsa o'zgarmaydi",
     "faqat soxtasi o'tadi",
     "Backend yonmaydi",
     "haqiqiy to'lov ham 401"
    ],
    "c": 3,
    "e": "Xom tana yo'q.",
    "s": 7
   },
   {
    "q": "Imzo tekshiruvi qayerda turadi?",
    "o": [
     "eng birinchi",
     "yozuvdan keyin",
     "takrordan keyin",
     "oxirida"
    ],
    "c": 0,
    "e": "Aks holda soxta xabar yoziladi.",
    "s": 8
   },
   {
    "q": "Ikkinchi bir xil xabarga javob?",
    "o": [
     "409",
     "200 { takror: true }",
     "500",
     "200 va yangi qator"
    ],
    "c": 1,
    "e": "Xizmat qayta yubormasin.",
    "s": 10
   },
   {
    "q": "Rad etilgan to'lov xabari?",
    "o": [
     "e'tiborsiz qoldiriladi",
     "401",
     "yoziladi, hech narsa ochilmaydi",
     "Pro ochiladi"
    ],
    "c": 2,
    "e": "«To'lovim qayerda?»",
    "s": 11
   },
   {
    "q": "TOLOV_KALITI qayerda turadi?",
    "o": [
     "README'da",
     "agent promptida",
     "kodda",
     ".env va Render'da"
    ],
    "c": 3,
    "e": "Kalit — dalil yasash huquqi.",
    "s": 14
   }
  ]
 },
 "20": {
  "type": "Screen28",
  "kicker": "Yakun",
  "title": "Endi siz bilasiz"
 }
};
