
// ============================================================
//  Jest-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/jest1-matn.py (manba: 10-Jest1-mentor-v2.md, M41)
//  QO'LDA TAHRIRLANMAYDI: matn MD'da o'zgaradi, keyin skript qayta yurgiziladi.
// ============================================================
const MDT = {
 "1": {
  "type": "Lesson",
  "kicker": "Kirish",
  "eyebrow": "Mentor kursi · Jest",
  "title": "OrderBotNest'ga birinchi testlarni yozamiz: avval o'zingiz, keyin AI yozgan testni tekshirasiz",
  "seg": [
   [
    "a",
    "Buyurtma boti ishlaydi — bugun uning <b>qoidalarini test bilan qo'riqlaymiz</b>",
    "Assalomu alaykum. O'tgan darsda buyurtma botini PostgreSQL'ga ko'chirdingiz. Bugun uning qoidalarini test bilan qo'riqlaymiz: narx qanday yoziladi, admin qaysi tugmani ko'radi, katalogning oxirgi sahifasida nima bo'ladi. Ekranda natija: o'nta test, yarim soniyada."
   ],
   [
    "b",
    "Avval testni o'zingiz yozasiz, <b>FAIL va PASS'ni o'qishni</b> o'rganasiz",
    "Avval testni qo'lda yozasiz va Jest javobini o'qishni o'rganasiz. Birinchi testning o'zi kutilmagan narsani ko'rsatadi: kod to'g'ri ishlaydi, test qizil, ikki qator esa bir xil ko'rinadi. Sababini darsda bilib olasiz."
   ],
   [
    "c",
    "Keyin testni AI yozadi, siz <b>uni buzib tekshirasiz</b>",
    "Keyin testni AI yozadi. Biz buni ikki xil AI bilan haqiqatan qilib ko'rdik. Ikkalasi o'ttizdan ortiq test yozdi, hammasi yashil. Lekin kodni ataylab buzganimizda ba'zi buzilishlarni hech bir test sezmadi. Shu tekshiruv usulini o'rganasiz."
   ],
   [
    "d",
    "Olti bosqich, uchta amaliyot; oxirida <b>ikki ekran sinfga tayyorgarlik</b>",
    "Dars olti bosqichdan iborat, uchta amaliyotda o'zingiz ishlaysiz. Oxirgi ikki ekran sinfga tayyorgarlik: o'quvchi darsi xaritasi va o'quvchilar xato qiladigan joylar. Shoshilmang, har ekranni boshidan eshitish mumkin, dars qayerda to'xtaganingizni eslab qoladi. Boshlaymiz."
   ]
  ]
 },
 "2": {
  "type": "Lesson",
  "kicker": "1-bosqich · nega va qayerda",
  "title": "Smoke butun botni tekshiradi, unit-test — bitta qoidani: biri ikkinchisining o'rnini bosmaydi",
  "seg": [
   [
    "a",
    "Telegraf+PG darsida <b>smoke butun botni tekshirdi</b>: baza, restart va besh mijoz",
    "Telegraf va PostgreSQL darsida smoke skriptini yurgizgansiz. U butun botni tekshiradi: alohida baza ochadi, serverni qayta yoqadi, besh mijozni bir vaqtda yuboradi. Javobi bitta: bot ishlayaptimi yoki yo'q."
   ],
   [
    "b",
    "Unit-test esa <b>bitta funksiyani bitta qoida bilan</b> tekshiradi",
    "Unit-test boshqacha. U bitta funksiyani chaqiradi va bitta qoidani tekshiradi: masalan, katalogning oxirgi sahifasida o'ng strelka chiqmasin. Smoke buni sezmaydi, chunki bot baribir ishlaydi. Unit-test esa xato qaysi funksiyada va qaysi qatorda ekanini aytadi."
   ],
   [
    "c",
    "Testda <b>Telegram ham, baza ham yo'q</b> — u bot yoki sayt ekanini bilmaydi",
    "Endi loyihaning o'zini oching: Telegraf va PostgreSQL darsidagi OrderBotNest papkasini VS Code'da oching. Ekranda bugun yozadigan test: u src, api, telegram papkasidagi texts ts faylidan faqat som funksiyasini import qiladi. Telegram, baza va env fayli kerak emas, env faylisiz o'nta test yarim soniyada o'tdi. Shuning uchun bot ham, sayt ham bir xil sinaladi."
   ],
   [
    "d",
    "Xulosa: smoke — <b>«ishlayaptimi»</b>, unit-test — «shu qoida buzilmadimi»",
    "Xulosa: smoke ishlayaptimi degan savolga javob beradi, unit-test esa shu qoida buzilmadimi degan savolga. Bugun unit-test yozamiz. Saytning so'rov va javobini sinash Jest ikkinchi darsida bo'ladi."
   ]
  ]
 },
 "3": {
  "type": "Lesson",
  "kicker": "1-bosqich · ichida",
  "title": "Jest sozlamasi package.jsonda tayyor: fayl src/ ichida, nomi .spec.ts bilan tugaydi",
  "seg": [
   [
    "a",
    "Loyihada <b>test yozish uchun hamma narsa tayyor</b>: Jest, ts-jest va sozlama",
    "Avval Jest testni qayerdan qidirishini ko'ramiz. VS Code'da OrderBotNest papkasining ildizidagi package json faylini oching. O'n to'rtinchi satrda test buyrug'i: jest. Pastroqda, qirq beshinchi satrdan, jest bo'limi boshlanadi. Nest loyihasida jest va ts jest paketlari allaqachon o'rnatilgan, hech narsa o'rnatmaysiz."
   ],
   [
    "b",
    "Ikki satr hal qiladi: <b><code>rootDir: src</code> va <code>testRegex</code> — <code>.spec.ts</code></b>",
    "Jest bo'limida ikki satr hal qiladi: ellik birinchi va ellik ikkinchi. Root dir src: Jest faqat src papkasi ichini ko'radi. Test regex: fayl nomi spec ts bilan tugashi kerak. Ellik to'rtinchi satrdagi transform ts jest esa TypeScript faylni JavaScript'ga aylantirib beradi."
   ],
   [
    "c",
    "<b>VS Code terminalida <code>npm test</code></b>: hozir test fayli yo'q — <code>No tests found</code>",
    "Endi VS Code'da Terminal menyusidan yangi terminal oching, u OrderBotNest papkasida ochiladi, va npm test yozing. Loyihada hali bitta ham test fayli yo'q, shuning uchun Jest no tests found deydi va bir kodi bilan chiqadi, ya'ni xato. Pastda: yigirma yetti fayl ko'rildi, test regex'ga nol mos keldi."
   ],
   [
    "d",
    "Xulosa: <code>No tests found</code> chiqsa — <b>fayl joyi va nomini</b> tekshiring",
    "Xulosa: no tests found ko'rsangiz, kodni emas, fayl joyi va nomini tekshiring. Sinab ko'rdik: nomi test ts bo'lsa ham, fayl src'dan tashqarida tursa ham, aynan shu xabar chiqadi."
   ]
  ]
 },
 "4": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 1",
  "eyebrow": "Tekshiruv · 1 / 4",
  "title": "Test fayli test/texts.spec.ts da — loyiha ildizidagi test papkasida. npm test nima deydi?",
  "q": "Jest qayerdan qidirishini ko'rdingiz, endi tekshirib olaylik. Birinchi tekshiruv. Test fayli nomi to'g'ri, spec ts bilan tugaydi. Lekin u src ichida emas, loyiha ildizidagi test papkasida turibdi. Npm test nima deydi? Variantni tanlang.",
  "ok": "To'g'ri. Root dir src bo'lgani uchun Jest test papkasiga umuman qaramaydi. Sinab ko'rdik: no tests found va bir kodi. Import xatosi chiqishi uchun Jest faylni ochishi kerak edi, u esa faylni ko'rmadi. Demak, test fayli src ichida, sinaladigan faylning yonida turadi.",
  "okShort": "<code>rootDir: src</code> — <code>test/</code> ko'rinmaydi: <code>No tests found</code>.",
  "hint": "rootDir qaysi papkani ko'rsatadi? Fayl o'sha papka ichidami?",
  "demak": "Test fayli <code>src/</code> ichida, sinaladigan faylning yonida turadi.",
  "correct": 2,
  "opts": [
   "PASS — fayl nomi .spec.ts bilan tugaydi",
   "Cannot find module — import yo'li buzildi",
   "No tests found — fayl src/ dan tashqarida",
   "PASS — Jest test/ papkasini o'zi qidiradi"
  ],
  "wrong": {
   "0": "Nom to'g'ri, lekin joy rootDir dan tashqarida.",
   "1": "Import xatosi uchun Jest faylni ochishi kerak — u faylni ko'rmadi.",
   "3": "Nest'ning e2e testlari uchun alohida sozlama kerak; bu loyihada u yo'q."
  }
 },
 "5": {
  "type": "Lesson",
  "kicker": "2-bosqich · birinchi test",
  "title": "Test — uch qismli kod: qaysi funksiya, qaysi vaziyat va qanday natija kutiladi",
  "seg": [
   [
    "a",
    "Birinchi test uchun <b><code>som</code> funksiyasini</b> olamiz: u narxni so'mda yozadi",
    "Birinchi test uchun eng oddiy funksiyani olamiz. VS Code'da src, api, telegram papkasidagi texts ts faylini oching: to'rtinchi satrda som funksiyasi. U sonni oladi va bot matni uchun so'mda yozadi, bir yuz yigirma ming bir yuz yigirma ming so'm bo'ladi. Bot har narxni shu funksiya bilan chiqaradi."
   ],
   [
    "b",
    "Test fayli <b>yonida turadi</b>: <code>texts.ts</code> uchun — <code>texts.spec.ts</code>",
    "Test faylini shu telegram papkasining o'zida, texts ts yonida yaratasiz: Explorer'da papkani o'ng tugma bilan bosib, New File, nomi texts spec ts. Nomi spec ts bilan tugashi shart. Birinchi satrda funksiyani import qilamiz. Telegraf ham, baza ham import qilinmaydi."
   ],
   [
    "c",
    "<code>describe</code> — funksiya, <code>it</code> — vaziyat, <b><code>expect … toBe</code> — kutilgan natija</b>",
    "Keyingi uch qism. Describe som: bu testlar qaysi funksiya haqida. It: bitta vaziyat, nomi oddiy gap bilan yoziladi. Ichida expect: som bir yuz yigirma ming natijasi to be ichidagi etalonga teng bo'lsin. Etalon — kutilgan qiymat, uni qo'lda yozamiz."
   ],
   [
    "d",
    "Xulosa: <b>funksiyani chaqirish, etalon bilan solishtirish</b> — har test shu ikki qadam",
    "Xulosa: har test ikki qadamdan iborat: funksiyani chaqirasiz va natijani qo'lda yozilgan etalon bilan solishtirasiz. Endi testni yurgizamiz: VS Code terminalida npm test, ikki chiziqcha va texts. Fayl nomini qo'shsak, faqat shu test fayli yuradi."
   ]
  ]
 },
 "6": {
  "type": "Lesson",
  "kicker": "2-bosqich · birinchi test",
  "title": "Test qizil: Expected va Received bir xil ko'rinadi, lekin Jest ularni teng demayapti",
  "seg": [
   [
    "a",
    "FAIL'ni <b>yuqoridan pastga</b> o'qiymiz: avval qaysi test yiqildi",
    "Terminalda npm test, ikki chiziqcha va texts yozdik: test qizil. FAIL'ni yuqoridan pastga o'qiymiz. Nuqtali satr qaysi test yiqilganini aytadi: som guruhidagi bir yuz yigirma ming testi. Testlar ko'p bo'lsa, birinchi shu satrni qidirasiz."
   ],
   [
    "b",
    "Keyin ikki satr: <b><code>Expected</code> — etalon, <code>Received</code> — funksiya qaytargani</b>",
    "Keyingi ikki satr asosiysi. Expected — siz test faylida yozgan matn. Received — som funksiyasi haqiqatda qaytargan matn. Jest sonni emas, shu ikki matnni solishtiradi va ular teng bo'lmasa, test yiqiladi. Lekin qarang: ikkala qator bir xil, bir yuz yigirma ming so'm."
   ],
   [
    "c",
    "Pastda <b>satr raqami</b>: <code>texts.spec.ts:5:25</code> — beshinchi satr, <code>toBe</code> belgisi",
    "Pastda kod bo'lagi: katta belgisi va strelka xato bo'lgan joyni ko'rsatadi, test faylining beshinchi satri, to be. Eng oxirgi qatorda fayl nomi va satr raqami yana yozilgan. VS Code'da texts spec ts faylining aynan shu satrini ochasiz."
   ],
   [
    "d",
    "Demak, sabab bitta joyda: <b>bo'sh joy ikki matnda har xil belgi</b>",
    "Demak, sabab bitta joyda: bir yuz yigirma va ming orasidagi bo'sh joy. Siz klaviaturada oddiy probel yozdingiz, som esa ko'zga ko'rinmaydigan boshqa belgi qo'ydi. Ekranda ikkalasi bir xil ko'rinadi, Jest uchun esa har xil. Keyingi ekranda ikki matnni belgima-belgi solishtirib, shu belgini o'z ko'zingiz bilan ko'rasiz."
   ]
  ]
 },
 "7": {
  "type": "Lesson",
  "kicker": "2-bosqich · ichida",
  "title": "toLocaleString minglarni oddiy probel bilan emas, bo'linmas probel bilan ajratadi",
  "seg": [
   [
    "a",
    "<code>toBe</code> <b>belgi-belgi solishtiradi</b>: bitta belgi farq qilsa — teng emas",
    "Endi sababini aniqlaymiz. To be ikki matnni belgi-belgi solishtiradi, Jest buni Object is deb yozadi. Ekranda ikki qator: yuqorida Expected, siz yozgan matn, pastda Received, som qaytargan matn. Belgilarni birma-bir taqqoslaymiz: bir, ikki, nol, keyin bo'sh joy."
   ],
   [
    "b",
    "To'rtinchi belgida farq: <b><code>0020</code> — oddiy probel, <code>00a0</code> — bo'linmas probel</b>",
    "Mana farq, to'rtinchi belgida. Expected'da oddiy probel, kodi nol nol ikki nol. Received'da nol nol a nol: bo'linmas probel. Ekranda u oddiy probeldek ko'rinadi, lekin boshqa belgi. Uni to locale string qo'ydi, rus tili qoidasi bo'yicha. Qolgan hamma belgi bir xil, ular yashil."
   ],
   [
    "c",
    "Etalonni <b><code>\\u00a0</code> bilan ochiq yozamiz</b> — endi test yashil va o'qiladi",
    "Kod to'g'ri: bo'linmas probel raqamni Telegram xabarida ikki qatorga bo'lib yubormaydi. Shuning uchun etalonni tuzatamiz va belgini ochiq yozamiz: backslash u, nol nol a nol. Ikkinchi testni kichik son uchun qo'shdik. Ikkalasi yashil."
   ],
   [
    "d",
    "Xulosa: birinchi testning o'zi <b>kod haqida bilmagan narsangizni</b> ko'rsatdi",
    "Xulosa: birinchi testning o'zi siz bilmagan narsani ko'rsatdi. Expected va received bir xil ko'rinsa, ko'rinmas belgini qidiring. Etalonga belgini ochiq yozing, ko'zga ko'rinmaydigan belgining o'zini emas: keyingi odam uni oddiy probel deb o'ylaydi."
   ]
  ]
 },
 "8": {
  "type": "Practice",
  "kicker": "Amaliyot 1 / 3",
  "eyebrow": "Hozir o'zingizda · 10 daqiqa",
  "title": "Birinchi testni o'zingiz yozing: avval qizilni ko'ring, keyin sababini topib yashil qiling",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>jest1-start</code> tegida</b> birinchi test faylini yozasiz",
    "Endi navbat sizga. Telegraf va PostgreSQL darsidagi OrderBotNest papkasini ochasiz va jest bir start tegiga o'tasiz. Env fayli va baza kerak emas. O'n daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: teg, fayl va <b>oddiy probelli etalon</b> — FAIL'ni o'zingiz ko'ring",
    "Birinchi qadamda git fetch va checkout bilan tegga o'tasiz, npm test no tests found deydi. Ikkinchisida texts spec ts faylini yozasiz, etalonni klaviaturadagi oddiy probel bilan. Npm test texts: qizil, ikki qator bir xil."
   ],
   [
    "c",
    "3–4-qadam: <b><code>\\u00a0</code></b> bilan tuzatish va ikkinchi test; isbot — <code>Tests:</code> satri",
    "Uchinchi qadamda etalonga backslash u nol nol a nol yozasiz. To'rtinchisida besh yuz uchun ikkinchi testni qo'shasiz. Isbot maydoniga oxirgi natijaning tests satrini nusxalang."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz test yozasiz, FAIL'ni o'qiysiz va ko'rinmas belgini topasiz."
   ]
  ],
  "steps": [
   {
    "t": "Teg",
    "cmds": [
     "git fetch --tags",
     "git checkout jest1-start",
     "npm test"
    ],
    "exp": "No tests found, exiting with code 1"
   },
   {
    "t": "Test — oddiy probel bilan",
    "cmds": [
     "src/api/telegram/texts.spec.ts (5-ekrandagi kod)",
     "npm test -- texts"
    ],
    "exp": "FAIL · Expected: \"120 000 so'm\" · Received: \"120 000 so'm\""
   },
   {
    "t": "Tuzatish",
    "cmds": [
     "etalon \"120\\u00a0000 so'm\"",
     "npm test -- texts"
    ],
    "exp": "PASS"
   },
   {
    "t": "Ikkinchi test",
    "cmds": [
     "it('kichik sonda probel yo\\'q', …) — som(500) → \"500 so'm\""
    ],
    "exp": "Tests: 2 passed, 2 total"
   }
  ],
  "proof": {
   "label": "Oxirgi natijaning Tests: satri",
   "placeholder": "Tests: … qatorini nusxalang",
   "re": "Tests:\\s+2 passed,\\s+2 total",
   "flags": "",
   "wrong": "Ikkala test yashilmi? npm test -- texts natijasidagi Tests: qatorini qo'ying."
  },
  "trouble": [
   [
    "error: pathspec 'jest1-start' did not match",
    "teglar olinmagan — git fetch --tags, keyin checkout"
   ],
   [
    "Your local changes … would be overwritten by checkout",
    "Telegraf+PG darsidagi o'z o'zgarishlaringiz — git stash yoki commit, keyin checkout"
   ],
   [
    "2-qadamda PASS",
    "etalonni nusxa bilan qo'ydingiz — belgi ham ko'chdi; probelni klaviaturadan qayta yozing"
   ],
   [
    "Cannot find module './texts'",
    "fayl src/api/telegram/ da emas — texts.ts yoniga ko'chiring"
   ],
   [
    "No tests found",
    "nomi .spec.ts emas yoki src/ dan tashqarida (3–4-ekran)"
   ]
  ]
 },
 "9": {
  "type": "Lesson",
  "kicker": "3-bosqich · yolg'on testlar",
  "title": "expectsiz test har doim yashil: u funksiyani chaqiradi, lekin hech narsani tekshirmaydi",
  "seg": [
   [
    "a",
    "Test yozishni bildingiz — endi <b>testning o'zi qanday aldashini</b> ko'ramiz",
    "Test yozishni bildingiz. Endi testning o'zi qanday aldashini ko'ramiz. Ekranda shu telegram papkasidagi yolgon spec ts fayli. Birinchi tur yolg'on test: unda expect yo'q, faqat console log. Bunday test ko'pincha qo'lda tekshirib ko'rish paytida qoladi."
   ],
   [
    "b",
    "Jest natijani chop etdi va <b>PASS dedi</b> — hech narsa solishtirilmadi",
    "Natija: terminalda Jest qiymatni chop etdi va PASS dedi. Lekin hech narsa solishtirilmadi. Jest uchun qoida oddiy: it ichida xato tashlanmasa, test o'tdi. Xatoni faqat expect tashlaydi."
   ],
   [
    "c",
    "Xulosa: har <code>it</code> ichida <b>kamida bitta <code>expect</code></b> bo'lsin — aks holda u test emas",
    "Xulosa: har it ichida kamida bitta expect bo'lishi kerak, aks holda u test emas, faqat chaqiruv. Bunday test topish oson: console log bor, expect yo'q. Ikkinchi tur esa ancha yashirin, uni keyingi ekranda ko'ramiz."
   ]
  ]
 },
 "10": {
  "type": "Lesson",
  "kicker": "3-bosqich · ichida",
  "title": "Etalonni kodning o'zidan yasasangiz, kod buzilganda etalon ham buziladi — test yashil qoladi",
  "seg": [
   [
    "a",
    "Ikki test savat matnini tekshiradi: <b>biri etalonni <code>som</code>dan oladi, biri qo'lda</b>",
    "Ikkinchi tur. Telegram papkasidagi savat spec ts faylida ikkita test bor, ikkalasi savat matnidagi jami qatorini qidiradi. Birinchisida etalon som funksiyasining o'zidan yasalgan, ikkinchisida qo'lda yozilgan. Chizmaga qarang: hozir som to'g'ri, ikkala etalon ham yuz ming so'm, ikkalasi yashil."
   ],
   [
    "b",
    "Kodni buzamiz: <b>narx endi «100,000» ko'rinishida</b> — bot noto'g'ri yozadi",
    "Endi kodni ataylab buzamiz. Texts ts faylining to'rtinchi satrida, som funksiyasida rus tili o'rniga ingliz tili qoidasini qo'yamiz. Endi bot narxni vergul bilan yozadi: yuz ming emas, yuz, vergul, ming. Mijoz uchun bu boshqa son. Testlarni yurgizamiz."
   ],
   [
    "c",
    "Koddan olingan etalon <b>buzilgan <code>som</code> bilan birga o'zgardi</b> — test yashil",
    "Chizmaga qarang. Som endi yuz, vergul, ming deydi. Birinchi testning etaloni ham som'dan yasaladi, ya'ni u ham yuz, vergul, ming bo'ldi: ikki tomon birga buzildi va test yashil qoldi. Qo'lda yozilgan etalon o'zgarmadi, shuning uchun ikkinchi test qizil."
   ],
   [
    "d",
    "Xulosa: <b>etalon qo'lda yoziladi</b> — sinalayotgan funksiya etalonda ishlatilmaydi",
    "Xulosa: etalon qo'lda yoziladi. Sinalayotgan funksiya etalonni yasashda ishlatilmaydi. Testda dollar va qavs ichida shu funksiya chaqirilgan bo'lsa, bu ogohlantirish belgisi. Endi buni bitta kod bo'lagida o'zingiz topasiz."
   ]
  ]
 },
 "11": {
  "type": "LineCheck",
  "kicker": "Tekshiruv 2",
  "eyebrow": "Tekshiruv · 2 / 4 — qaysi satr xato?",
  "title": "Bu test som buzilganda ham yashil qoladi. Sababchi satrni toping",
  "q": "Yolg'on testni ko'rdingiz, endi o'zingiz toping. Ikkinchi tekshiruv. Bu test buyurtma qabul qilingan xabarini tekshiradi. Som buzilganda ham u yashil qoladi. Bitta satr etalonni som funksiyasining o'zidan yasaydi. O'sha satrni bosing.",
  "ok": "To'g'ri. Shu satrda etalon som'ning o'zidan yasaladi, shuning uchun som buzilsa, etalon ham u bilan birga buziladi. Ekranda tuzatilgan satr: etalon qo'lda, bo'linmas probel bilan. Endi som buzilsa, test qizaradi. Demak, etalonda sinalayotgan funksiya chaqirilgan satrni qidiring.",
  "okShort": "<code>${som(50000)}</code> — etalon koddan: <code>som</code> buzilsa, ikkala tomon birga buziladi. Qo'lda yozilgan <code>\"Jami: 50\\u00a0000 so'm\"</code> buzilishni ushlaydi.",
  "hint": "Qaysi satrda etalon qo'lda yozilmagan, funksiya chaqiruvidan yasalgan?",
  "task": "Qoida: etalon qo'lda yoziladi, sinalayotgan funksiya etalonda chaqirilmaydi. Bu testda bitta satr etalonni <code>som</code> ning o'zidan yasaydi. <b>O'sha satrni bosing.</b>"
 },
 "12": {
  "type": "Lesson",
  "kicker": "4-bosqich · statuslar va chegara",
  "title": "Buyurtma to'rt statusdan o'tadi — har statusga admin ko'radigan tugmalar uchun bitta test",
  "seg": [
   [
    "a",
    "Admin har buyurtma ostida <b>statusiga qarab tugma</b> ko'radi",
    "Endi admin tugmalarini sinaymiz. Telegraf va PostgreSQL darsidan bilasiz: buyurtma to'rt statusdan o'tadi. Yangi buyurtma ostida tasdiqlash va bekor tugmalari, tasdiqlanganida yetkazildi va bekor. Yetkazilgan yoki bekor qilingan buyurtmada tugma yo'q."
   ],
   [
    "b",
    "Bu qoida <b>bitta funksiyada</b>: <code>orderKeyboard</code> — buyurtma kiradi, klaviatura chiqadi",
    "Bu qoida bitta funksiyada yozilgan: src, api, telegram papkasidagi keyboards ts faylida, o'ttiz yettinchi satrdan, order keyboard. Unga buyurtma beriladi, u Telegraf klaviaturasini qaytaradi yoki undefined. Tugma bosilganda bot callback satrini oladi: status, buyurtma raqami va yangi status."
   ],
   [
    "c",
    "Har statusga <b>bitta <code>it</code></b>: ikki tugma, ikki tugma, <code>toBeUndefined</code>",
    "Test fayli yonida: keyboards spec ts. Har statusga bitta it yozamiz. Beshinchi satrdagi buttons yordamchisi klaviaturadan faqat tugma matni va callback'ni oladi. O'ttiz birinchi satrdagi testda to be undefined: yetkazilgan va bekor qilingan buyurtmada klaviatura yo'q. Terminalda uchala test yashil."
   ],
   [
    "d",
    "Xulosa: <b>har status — bitta vaziyat</b>; bittasi tushib qolsa, o'sha qoida qo'riqlanmaydi",
    "Xulosa: statuslar jadvali bo'lsa, har qatori bitta test bo'ladi. To'rtta status uchun uchta test yozdik, oxirgisida ikkita expect. Birorta status tushib qolsa, o'sha qoida himoyasiz qoladi. Yordamchida nega to equal ishlatilganini keyingi ekranda bilib olasiz."
   ]
  ]
 },
 "13": {
  "type": "Lesson",
  "kicker": "4-bosqich · ichida",
  "title": "Ikki massiv bir xil ko'rinsa ham toBe FAIL beradi: u ichini emas, aynan bitta massivmi — shuni tekshiradi",
  "seg": [
   [
    "a",
    "Bir xil massiv, ikki solishtirish: <b><code>toBe</code> qizil, <code>toEqual</code> yashil</b>",
    "Bir xil ikki massivni ikki usulda solishtiramiz. To be qizil, to equal yashil. Jest xabari ham shuni aytadi: received bir xil satrga aylanadi, lekin to be uni teng demaydi va to strict equal'ni taklif qiladi."
   ],
   [
    "b",
    "<code>toBe</code> — <b>aynan bitta obyektmi</b>; <code>toEqual</code> — ichidagi qiymatlar tengmi",
    "Sababi bunday. Satr va son uchun to be qiymatni solishtiradi. Massiv va obyekt uchun esa u ikkalasi xotirada aynan bitta obyektmi, shuni tekshiradi. Kodda ikki marta yozilgan massiv ikki xil obyekt. To equal esa ichini bittalab solishtiradi."
   ],
   [
    "c",
    "Telegraf tugmaga <b><code>hide: false</code> qo'shadi</b> — shuning uchun yordamchi kerak bo'ldi",
    "Klaviaturada yana bir nozik joy bor. Telegraf har tugmaga hide false maydonini o'zi qo'shadi, kodimizda u yozilmagan. Klaviaturani to'liq solishtirsak, etalonga ham shu maydonni yozishga to'g'ri keladi. Shuning uchun yordamchi faqat matn va callback'ni oladi."
   ],
   [
    "d",
    "Xulosa: <b>son va satr — <code>toBe</code>, massiv va obyekt — <code>toEqual</code></b>",
    "Xulosa: son va satr uchun to be, massiv va obyekt uchun to equal ishlating. Kutubxona qo'shadigan maydonlar testni ortiqcha og'irlashtirsa, solishtirishdan oldin kerakli qismini ajratib oling."
   ]
  ]
 },
 "14": {
  "type": "Lesson",
  "kicker": "4-bosqich · statuslar va chegara",
  "title": "Bekor qilingan buyurtmaga yana tugma chiqdi — test qaysi qoida buzilganini aniq aytadi",
  "seg": [
   [
    "x",
    "Endi <b>o'zingiz buzasiz</b>: kodda yonib turgan <code>CANCELLED</code> sharti ustiga bosing",
    "Testlar yashil. Endi kodni ataylab buzamiz, chunki shartdan bitta status tushib qolishi juda oson. Buzishni o'zingiz qilasiz: keyboards ts faylining o'ttiz to'qqizinchi satrida bekor qilingan status sharti yonib turibdi, ustiga bosing.",
    "<b>keyboards.ts</b> 39-satridagi <b><code>|| o.status === 'CANCELLED'</code></b> ustiga bosing — bu bo'lak shartdan o'chadi."
   ],
   [
    "a",
    "Shartdan <b><code>CANCELLED</code> tushib qoldi</b>: kod ishlaydi, server ham xato bermaydi",
    "Bekor qilingan status shartdan tushib qoldi. Bot ishlaydi, server ham xato bermaydi. Lekin admin bekor qilingan buyurtma ostida yana yetkazildi va bekor tugmalarini ko'radi. Testni yurgizamiz."
   ],
   [
    "b",
    "Uchtadan bitta test qizil: <b><code>toBeUndefined</code> kutildi, lekin klaviatura keldi</b>",
    "Uchta testdan bittasi qizil. Nuqtali satr qoidani aytadi: yetkazilgan va bekor qilingan, tugma yo'q. Received qatorida undefined o'rniga klaviatura keldi, ichida yetkazildi va bekor tugmalari. Katta belgisi o'ttiz uchinchi satrda: bekor qilingan status."
   ],
   [
    "c",
    "Xulosa: <b>test nomi qoidani aytadi</b> — FAIL'dan qaysi qoida buzilgani darhol ko'rinadi",
    "Xulosa: test nomini qoida sifatida yozing, masalan «bekor qilingan, tugma yo'q». Shunda FAIL'ning birinchi satridan qaysi qoida buzilganini darhol bilasiz. Shartni tiklaymiz, test yana yashil."
   ]
  ]
 },
 "15": {
  "type": "Lesson",
  "kicker": "4-bosqich · statuslar va chegara",
  "title": "Xato ko'pincha chegarada: birinchi, oxirgi va yagona sahifa uchun alohida test",
  "seg": [
   [
    "a",
    "Katalog ikkitadan sahifada: <b>◀ birinchi sahifada yo'q, ▶ oxirgisida yo'q</b>",
    "Katalogga o'tamiz. Mahsulotlar ikkitadan sahifada ko'rsatiladi. Birinchi sahifada chap strelka yo'q, oxirgisida o'ng strelka yo'q, o'rtada ikkalasi bor. Mahsulot ikkitadan kam bo'lsa, sahifa bitta va strelka umuman yo'q."
   ],
   [
    "b",
    "To'rt vaziyat — to'rt test: <b>birinchi, o'rta, oxirgi va yagona sahifa</b>",
    "Shu to'rt vaziyatga to'rtta test yozamiz: birinchi, o'rtadagi, oxirgi va yagona sahifa. Keyboards spec ts faylining qirq birinchi satridagi nav yordamchisi klaviaturadan faqat strelkalar qatorini oladi. Beshinchi test tugagan mahsulotni tekshiradi: uni bosib bo'lmaydi."
   ],
   [
    "c",
    "Kichikdan katta o'rniga <b>kichik yoki teng</b>: o'rtadagi sahifa buni sezmaydi",
    "Kodni buzamiz: keyboards ts faylining yigirma birinchi satrida kichik belgisi o'rniga kichik yoki teng. Endi oxirgi sahifada ham o'ng strelka chiqadi. Natija: ikkita test qizil, oxirgi va yagona sahifa. O'rtadagi sahifa testi yashil qoldi, chunki u chegarada emas. Jest farqni plyus belgisi bilan ko'rsatdi."
   ],
   [
    "d",
    "Xulosa: <b>har shartga chegara testi</b> — chegarasiz testlar bu xatoni ko'rmaydi",
    "Xulosa: har shartning chegarasiga alohida test yozing: birinchi, oxirgi va yagona sahifa. Faqat o'rtadagi sahifani sinasangiz, bu xato yashirin qoladi. Kichik va kichik yoki teng farqi faqat chegarada ko'rinadi."
   ]
  ]
 },
 "16": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 3",
  "eyebrow": "Tekshiruv · 3 / 4",
  "title": "Faqat ikki test bor: «birinchi sahifa» va «o'rtadagi sahifa». Kodda page <= pages - 1 yozildi. npm test nima deydi?",
  "q": "Chegarani ko'rdingiz, endi tekshirib olaylik. Uchinchi tekshiruv. Faqat ikki test bor: birinchi sahifa va o'rtadagi sahifa. Kodda kichik yoki teng yozildi, ya'ni oxirgi sahifada ham o'ng strelka chiqadi. Npm test nima deydi? Variantni tanlang.",
  "ok": "To'g'ri. Birinchi va o'rtadagi sahifada o'ng strelka baribir bor, xato faqat oxirgi sahifada ko'rinadi. Sinab ko'rdik: to'rt test bilan ikkitasi qizardi, oxirgi va yagona sahifa. Bu ikkisi bo'lmasa, test yashil, xato esa kodda. Demak, yashil test faqat sinalgan vaziyatlar haqida gapiradi.",
  "okShort": "Ikkala test chegarada emas — PASS. Xatoni faqat oxirgi va yagona sahifa testlari ushlaydi.",
  "hint": "< va <= qaysi page qiymatida har xil natija beradi? O'sha qiymat testlarda bormi?",
  "demak": "Yashil test faqat sinalgan vaziyatlar haqida gapiradi.",
  "correct": 0,
  "opts": [
   "Ikkalasi PASS — xato faqat oxirgi sahifada",
   "Ikkalasi FAIL — strelka qoidasi buzildi",
   "«o'rtadagi sahifa» FAIL — u ▶ ni ikki marta oladi",
   "TypeScript xato — <= bu yerda ishlamaydi"
  ],
  "wrong": {
   "1": "Birinchi sahifada ▶ to'g'ri chiqadi — xato u yerda ko'rinmaydi.",
   "2": "O'rtada ▶ baribir bor — < ham, <= ham bir xil natija beradi.",
   "3": "<= — to'g'ri TypeScript; xato mantiqda."
  }
 },
 "17": {
  "type": "Practice",
  "kicker": "Amaliyot 2 / 3",
  "eyebrow": "Hozir o'zingizda · 15 daqiqa",
  "title": "Admin tugmalari va katalog uchun testlar yozing, keyin kodni bir marta buzib qizilni ko'ring",
  "seg": [
   [
    "a",
    "Endi siz: <b><code>keyboards.spec.ts</code></b> — statuslar va katalog chegarasi",
    "Endi navbat sizga. Keyboards uchun test faylini yozasiz: admin tugmalari va katalog sahifalari. Ekrandagi testlarni nusxalamang, o'zingiz yozing: etalonni har safar o'zingiz o'ylab chiqasiz. O'n besh daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: <b>har status va to'rt sahifa</b> uchun test; hammasi yashil",
    "Birinchi qadamda order keyboard uchun har statusga test yozasiz. Ikkinchisida catalog keyboard uchun birinchi, oxirgi va yagona sahifa testlari. Npm test keyboards: hammasi yashil bo'lishi kerak."
   ],
   [
    "c",
    "3–4-qadam: kodni <b>ataylab buzing</b>, qizilni ko'ring va tiklang; isbot — qizil test nomi",
    "Uchinchi qadamda keyboards faylida bitta shartni buzing: bekor qilingan status yoki kichik yoki teng. Qaysi test qizarganini ko'ring. To'rtinchisida kodni git checkout bilan tiklang. Isbot maydoniga qizargan test nomini yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz har status va chegaraga test yozasiz va uning xatoni ushlashini o'zingiz isbotlagansiz."
   ]
  ],
  "steps": [
   {
    "t": "orderKeyboard",
    "cmds": [
     "src/api/telegram/keyboards.spec.ts — NEW, CONFIRMED, DELIVERED / CANCELLED",
     "npm test -- keyboards"
    ],
    "exp": "3 ta ✓"
   },
   {
    "t": "catalogKeyboard",
    "cmds": [
     "birinchi",
     "oxirgi",
     "yagona sahifa (0, 3",
     "2, 3",
     "0, 1)"
    ],
    "exp": "Tests: … passed"
   },
   {
    "t": "Buzish",
    "cmds": [
     "keyboards.ts 39-satrdan o.status === 'CANCELLED' shartini o'chiring yoki 21-satrda < → <=",
     "npm test -- keyboards"
    ],
    "exp": "✕ oxirgi sahifada ▶ yo'q yoki ✕ yetkazilgan va bekor qilingan — tugma yo'q"
   },
   {
    "t": "Tiklash",
    "cmds": [
     "git checkout -- src/api/telegram/keyboards.ts",
     "npm test"
    ],
    "exp": "hammasi ✓"
   }
  ],
  "proof": {
   "label": "3-qadamda qizargan (✕) testning nomi — buyruq emas",
   "placeholder": "masalan: oxirgi sahifada ▶ yo'q",
   "re": "(bekor|oxirgi|bitta|yagona|cancel)",
   "flags": "i",
   "wrong": "Bu yerga buyruqni emas, terminalda ✕ belgisi yonidagi test nomini yozing, masalan: oxirgi sahifada ▶ yo'q."
  },
  "trouble": [
   [
    "toBe bilan serializes to the same string",
    "massiv — toEqual (13-ekran)"
   ],
   [
    "Etalonda hide: false yo'q — FAIL",
    "Telegraf qo'shadi: faqat text va callback_datani ajrating yoki toMatchObject"
   ],
   [
    "3-qadamda hammasi ✓",
    "buzgan shartingizga test yo'q — o'sha vaziyatga test qo'shing (16-ekran)"
   ]
  ]
 },
 "18": {
  "type": "Lesson",
  "kicker": "5-bosqich · AI testi",
  "title": "Yangi ko'nikma: AI yozgan testni qabul qilish — avval ikki AI tajribasi",
  "seg": [
   [
    "a",
    "Yangi bosqich, yangi ko'nikma: <b>testni AI yozadi, siz uni qabul qilasiz</b>",
    "Endi yangi bosqich boshlanadi va u boshqa ko'nikma. To'rt bosqichda testni o'zingiz yozdingiz va FAIL'ni o'qishni o'rgandingiz. Ishda esa testni ko'pincha AI yozadi. Sizning ishingiz endi yozish emas, qabul qilish: AI yozgan test haqiqatan xatoni ushlaydimi. Buni ikki xil AI bilan haqiqiy tajribada ko'ramiz."
   ],
   [
    "b",
    "Prompt bitta gap: <b>«test yozib ber, yashil bo'lsin»</b> — mentor odatda shunday yozadi",
    "Tajriba bunday edi. Biz ikki xil AI'ga bir xil oddiy prompt berdik: texts va keyboards uchun jest testlar yozib ber, npm test yashil bo'lsin. Ataylab qisqa, chunki mentor ko'pincha shunday yozadi. Har AI loyihaning alohida nusxasida ishladi."
   ],
   [
    "c",
    "Ikkalasi <b>faqat ikki test fayl qo'shdi</b>, kodga tegmadi: 36 va 33 test, hammasi yashil",
    "Natija yaxshi ko'rinadi. Ikkalasi faqat ikkita test fayl qo'shdi, kodga tegmadi, git diff stat buni tasdiqlaydi. Birinchisi o'ttiz olti, ikkinchisi o'ttiz uchta test yozdi, hammasi yashil. Ikkalasi bo'linmas probelni ham o'zi sezdi."
   ],
   [
    "d",
    "Lekin probelni <b>ikki xil hal qildi</b>: biri almashtiradi, biri ko'rinmas belgini qo'ydi",
    "Lekin probelni ikki xil hal qildi. Birinchisi solishtirishdan oldin bo'linmas probelni oddiysiga almashtiradi va yana bir belgi haqida yozdi: Node versiyasiga qarab u boshqa belgi bo'lishi mumkin. Bizdagi Node'da bunday emas, sinab ko'rdik. Ikkinchisining etalonida esa ko'rinmas belgining o'zi turibdi, yettinchi ekrandagi tuzoq."
   ],
   [
    "e",
    "Xulosa: <b>«hammasi yashil» — tekshiruv emas</b>; testning o'zini tekshirish kerak",
    "Xulosa: ikki AI ham va'dasini bajardi, testlar yashil. Lekin yashil test yaxshi test degani emas. AI aytgan gapni ham tekshiramiz. Testning o'zi xatoni ushlaydimi, buni bilishning bitta ishonchli usulini keyingi ekranda ko'rasiz."
   ]
  ]
 },
 "19": {
  "type": "Lesson",
  "kicker": "5-bosqich · ichida",
  "title": "Test to'plamini kodni buzib tekshiramiz: qizarmasa — o'sha buzilish himoyasiz",
  "seg": [
   [
    "a",
    "Usul oddiy: <b>kodni ataylab buzing</b> va nechta test qizarganini sanang",
    "Usul oddiy: kodni ataylab buzing va nechta test qizarganini sanang. Bitta ham qizarmasa, o'sha buzilish himoyasiz. Biz beshta buzish oldik: narx formati, savatdagi narx, bekor qilingan buyurtma tugmasi, oxirgi sahifa va status matni. Uchala to'plamni sinadik."
   ],
   [
    "b",
    "Bizning <b>o'n testimiz ikki buzilishni sezmadi</b>: matnlarni sinamaganmiz",
    "Avval o'zimiznikini tan olamiz. Bizning o'nta testimiz ikki buzilishni sezmadi: savatdagi narx va status matni. Sababi oddiy: texts faylidan faqat som'ni sinaganmiz. Test yo'q joy himoyasiz."
   ],
   [
    "c",
    "36 test <b>status matni o'zgarganini sezmadi</b>: <code>toBeTruthy</code> faqat «bormi» deydi",
    "O'ttiz olti testli to'plam ham status matni o'zgarganini sezmadi. Uning testi faqat har status uchun qandaydir matn borligini tekshiradi, to be truthy bilan. Matn o'zgarsa ham test yashil. Ikkinchi to'plamda esa som buzilganda o'ttiz uchdan faqat bittasi qizardi: etaloni koddan olingan testlar."
   ],
   [
    "d",
    "Xulosa: <b>test soni sifat emas</b> — qaysi buzilishni ushlashi sifat",
    "Xulosa: test soni sifat emas. O'ttiz olti test ham bitta buzilishni o'tkazib yubordi. Sifat — test qaysi buzilishni ushlashi. AI test yozgandan keyin uch to'rt joyda kodni buzib ko'ring. Qizarmagan joyga test qo'shing."
   ]
  ]
 },
 "20": {
  "type": "MCRetry",
  "kicker": "Tekshiruv 4",
  "eyebrow": "Tekshiruv · 4 / 4",
  "title": "AI testi: for (const s of all) expect(STATUS_UZ[s]).toBeTruthy(). Kimdir CANCELLED matnini «Bekor qilingan» dan «Yangi» ga o'zgartirdi. Test nima deydi?",
  "q": "Buzib tekshirishni ko'rdingiz, endi tekshirib olaylik. To'rtinchi tekshiruv. AI testi har bir status matnini, bekor qilinganini ham, to be truthy bilan tekshiradi. Kimdir matnni xato bilan yangi deb o'zgartirdi: mijoz bekor qilingan buyurtmasini yangi deb ko'radi. Test nima deydi? Variantni tanlang.",
  "ok": "To'g'ri. To be truthy faqat qiymat bo'sh emasligini tekshiradi. Yangi degan matn ham bo'sh emas, shuning uchun test yashil. Mijoz esa noto'g'ri status ko'radi. Etalonni aniq yozsangiz, test qizaradi. Demak, to be truthy qiymat borligini tekshiradi, to'g'riligini emas.",
  "okShort": "«Yangi» matni ham bo'sh emas — PASS. Statusning to'liq matnini kutgan aniq <code>toBe</code> buni ushlaydi.",
  "hint": "toBeTruthy qaysi qiymatlarda FAIL beradi? «Yangi» matni shulardan birimi?",
  "demak": "<code>toBeTruthy</code> qiymat borligini tekshiradi, to'g'riligini emas.",
  "correct": 1,
  "opts": [
   "FAIL — toBeTruthy matn o'zgarganini sezadi",
   "PASS — toBeTruthy faqat bo'sh emasmi deydi",
   "TypeScript xato — status matni turi o'zgardi",
   "FAIL — ikki status endi bir xil matnda"
  ],
  "wrong": {
   "0": "toBeTruthy matnni etalon bilan solishtirmaydi — faqat bo'sh emasmi.",
   "2": "Ikkalasi ham string — turi o'zgarmadi.",
   "3": "Test matnlarni bir-biri bilan solishtirmaydi — faqat har biri bo'sh emasmi."
  }
 },
 "21": {
  "type": "Practice",
  "kicker": "Amaliyot 3 / 3",
  "eyebrow": "Hozir o'zingizda · 20 daqiqa",
  "title": "O'z AI'ingizga aniq shartli prompt bering, keyin to'rt tekshiruv va uchta buzish",
  "seg": [
   [
    "a",
    "Endi siz: AI'ga <b>shartlari aniq prompt</b> berasiz — <code>texts.ts</code> dagi buyurtma matnlari uchun",
    "Endi navbat sizga. O'z AI'ingizga test yozdirasiz, lekin bu safar shartlari aniq prompt bilan. Mavzu: texts faylidagi savat va buyurtma matnlari. Promptni pastdagi tugma bilan nusxalaysiz. Yigirma daqiqa ketadi."
   ],
   [
    "b",
    "1–2-qadam: prompt va <b>diff — faqat <code>.spec.ts</code></b>, etalonda <code>${…}</code> yo'q",
    "Birinchi qadamda promptni berasiz. Ikkinchisida natijani tekshirasiz: git diff stat'da faqat spec fayl bo'lsin, har it'da expect bo'lsin, etalonda dollar va qavs ichida funksiya chaqirilmasin."
   ],
   [
    "c",
    "3–4-qadam: <b>uchta buzish</b> — hammasi qizarsin; isbot — qizarmagan buzish yoki «hammasi»",
    "Uchinchi qadamda kodni uch joyda navbat bilan buzasiz: narx formati, savatdagi narx va status matni. Har biridan keyin npm test, keyin git checkout. Qizarmagan joy bo'lsa, AI'dan o'sha joyga test so'rang. Isbot maydoniga natijani yozing."
   ],
   [
    "d",
    "Boshqacha chiqsa, <b>«Boshqacha chiqdimi?»</b> tugmasini bosing — yechimlar oynasi ochiladi",
    "Boshqacha chiqsa, «Boshqacha chiqdimi» tugmasini bosing. To'rtala katakcha va isbot bo'lmasa, Davom ochilmaydi. Demak, shu amaliyotdan keyin siz AI yozgan testni soniga qarab emas, buzib tekshirib qabul qilasiz."
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
     "har itda expect",
     "etalonda ${som( yoki ${STATUS_UZ yo'q",
     "grep -c 'u00a0' src/api/telegram/texts.spec.ts — 0 dan katta (escape matni bor)"
    ],
    "exp": "4 ✓"
   },
   {
    "t": "Uch buzish",
    "cmds": [
     "texts.ts: 'ru-RU' → 'en-US'",
     "(i.price ?? i.product.price) → i.product.price",
     "'❌ Bekor qilingan' → '🆕 Yangi' — har biridan keyin npm test va git checkout -- src/api/telegram/texts.ts"
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
   "placeholder": "masalan: uchalasi qizardi · yoki: savatdagi narx — avval qizarmadi, test qo'shdim",
   "re": "(qizar|fail|✕|uchala|hammasi|test qo'sh)",
   "flags": "i",
   "wrong": "Har buzishdan keyin npm test natijasini yozing."
  },
  "trouble": [
   [
    "git diff --stat da texts.ts ham bor",
    "AI kodni o'zgartirdi — git checkout -- src/api/telegram/texts.ts, promptdagi «Tegma» bandini takrorlang"
   ],
   [
    "Etalonda ${som(…)} qoldi",
    "AI shartni bajarmadi — o'sha satrlarni qo'lda yozing (10-ekran)"
   ],
   [
    "AI «\\u00a0 bilan ochiq yozdim» dedi, grep -c 'u00a0' → 0",
    "faylda ko'rinmas belgining o'zi — ikkala AI'da ham shunday chiqdi (p2/XULOSA); qatorlarni qo'lda \\u00a0 bilan yozing, keyin npm test"
   ],
   [
    "Savatdagi narx buzilishida hammasi ✓",
    "price (buyurtma paytidagi narx) va product.price har xil bo'lgan test yo'q — ikkalasini farqli qilib test so'rang"
   ],
   [
    "sed yoki tahrirdan keyin fayl o'zgarmadi",
    "qo'lda tahrir qiling va saqlang (VS Code'da nuqta — saqlanmagan)"
   ]
  ]
 },
 "22": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "eyebrow": "m4b-01 · «Unit-test: Jest»",
  "title": "O'quvchi darsi: KitobShop sayti, bitta orderTotal funksiyasi va Jestbot — siz bilgan yo'lning kichik varianti",
  "seg": [
   [
    "a",
    "m4b-01 — 21 ekran: <b>KitobShop sayti</b>, <code>orderTotal</code> — narx ko'paytirish son",
    "Endi sinfga tayyorgarlik, ikki ekran. O'quvchi darsi m4b-01, yigirma bir ekran. Misol — KitobShop sayti: order total funksiyasi narxni songa ko'paytiradi. Ya'ni bot emas, sayt. Lekin describe, it va expect xuddi bugungidek, chunki test faqat funksiyani chaqiradi."
   ],
   [
    "b",
    "O'quvchi darsi <b>Jestbot robot</b> misolida tushuntiradi — siz so'zni atamasi bilan aytasiz",
    "O'quvchi darsi testni robot misolida tushuntiradi, robotning ismi Jestbot. Robot papkasi bu describe, sinov varaqasi bu it, etalon kartochkasi bu expect. Sinfda ikkalasini birga ayting: etalon kartochkasi, ya'ni expect, va o'sha satrni ko'rsating."
   ],
   [
    "c",
    "Siz qo'shasiz: <b>haqiqiy FAIL, kim xato, chegara va buzib ko'rish</b>",
    "Darsga siz qo'shadigan narsalar: o'quvchi darsi natijani kartochkada ko'rsatadi, siz proyektorda haqiqiy FAIL'ni o'qib bering. Har FAIL'da savol bering: kim xato, kodmi yoki etalonmi. Uyga vazifadagi delivery fee'da aynan chegara qiymatini sinattiring. Test yashil bo'lsa, kodni bir marta buzdiring."
   ],
   [
    "d",
    "Xulosa: amaliyot oldidan — <b>test <code>src/</code> ichida, nomi <code>.spec.ts</code></b>, <code>npm install</code> qilingan",
    "Xulosa: amaliyot oldidan uch narsani tekshiring. Repo npm install bilan o'rnatilgan, test fayli src ichida, nomi spec ts bilan tugaydi. Vaqt bo'yicha taklif: to'qson daqiqaning yigirma beshi amaliyotga, chunki sozlashda vaqt ketadi."
   ]
  ]
 },
 "23": {
  "type": "Lesson",
  "kicker": "6-bosqich · sinfga tayyorgarlik",
  "title": "Beshta vaziyat va tayyor javoblar — to'rttasini bugun o'zingiz ko'rdingiz",
  "seg": [
   [
    "a",
    "Sinfda albatta chiqadigan beshta vaziyat — <b>to'rttasi bugun sizda ham chiqdi</b>",
    "Endi o'quvchi darsida albatta chiqadigan beshta vaziyatni ko'ramiz. To'rttasini bugun o'zingiz ko'rdingiz, shuning uchun qisqa aytaman. Beshinchisi o'quvchi reposiga xos."
   ],
   [
    "b",
    "Topilmadi va <code>npm ci</code> — <b>joy, nom va <code>npm install</code></b>",
    "Birinchisi no tests found: fayl joyi va nomini tekshiring. Ikkinchisi o'quvchi reposiga xos: npm ci yiqiladi, chunki package json va lock fayl sinxron emas. Npm install qiling. Bu repo kamchiligi, o'quvchining xatosi emas."
   ],
   [
    "c",
    "Yolg'on yashil va bir xil ko'ringan FAIL — <b><code>expect</code>, qo'lda etalon, <code>toEqual</code></b>",
    "Uchinchisi: test yashil, lekin expect yo'q yoki etalon koddan olingan. To'rtinchisi: qatorlar bir xil, test qizil: ko'rinmas belgi yoki massivni to be bilan solishtirish. Beshinchisi bo'sh loyiha: eng tez yo'l testni o'quvchi reposida yozdirish."
   ],
   [
    "d",
    "Xulosa: o'quvchi «AI yozdi, yashil» desa — <b>bitta joyni buzdiring</b>",
    "Xulosa va usul: o'quvchi AI test yozdi, hammasi yashil desa, kodda bitta joyni o'zi buzsin va test qizarishini ko'rsin. Javobni darhol aytmang, terminaldagi xabarni birga o'qing. Pastda o'quvchi savollariga tayyor javoblar bor."
   ]
  ]
 },
 "24": {
  "type": "Screen27",
  "kicker": "O'z-sinov",
  "title": "Sakkiz savol. Bitta urinish. Oltitasi — o'tdingiz",
  "final": [
   {
    "q": "package.json: rootDir: \"src\", testRegex: \".*\\\\.spec\\\\.ts$\". Fayl src/order.test.ts. npm test?",
    "o": [
     "No tests found — nomi .spec.ts emas",
     "PASS — Jest .test.ts ni ham oladi",
     "Cannot find module — order topilmadi",
     "PASS — rootDir: src bo'lgani yetadi"
    ],
    "c": 0,
    "e": "Nomi .spec.ts emas.",
    "s": 3
   },
   {
    "q": "Expected: \"120 000 so'm\" · Received: \"120 000 so'm\" — test FAIL. Birinchi qadam?",
    "o": [
     "Jest'ni qayta o'rnatib, yana yurgizish",
     "Belgilar kodini chiqarib solishtirish",
     "Testni o'chirib, qo'lda tekshirib ko'rish",
     "toBe o'rniga toBeTruthy qo'yish"
    ],
    "c": 1,
    "e": "toBe belgi-belgi solishtiradi: U+00A0.",
    "s": 7
   },
   {
    "q": "it ichida faqat console.log(som(120000)). Natija?",
    "o": [
     "FAIL — expect yo'qligi xato sanaladi",
     "No tests found — bo'sh it sanalmaydi",
     "PASS — Jest hech narsani solishtirmadi",
     "SyntaxError — testda console.log taqiq"
    ],
    "c": 2,
    "e": "Xatoni faqat expect tashlaydi.",
    "s": 9
   },
   {
    "q": "Etalon: ` Jami: ${som(100000)} . som` buzildi. Test?",
    "o": [
     "FAIL — som buzilgani darhol sezildi",
     "TypeScript xato — shablon satr noto'g'ri",
     "Cannot find module — som import bo'lmadi",
     "PASS — etalon ham u bilan birga buzildi"
    ],
    "c": 3,
    "e": "Etalon qo'lda yoziladi.",
    "s": 10
   },
   {
    "q": "expect(buttons).toBe([['◀', '1/3']]) — massivlar bir xil, lekin FAIL. Sabab?",
    "o": [
     "toBe bitta obyektni kutadi — toEqual kerak",
     "Massivdagi strelka belgisi boshqa kodda",
     "Jest eskirgan — massivni solishtira olmaydi",
     "Emoji'lar massivda boshqacha saqlanadi"
    ],
    "c": 0,
    "e": "serializes to the same string.",
    "s": 13
   },
   {
    "q": "Testlar faqat birinchi va o'rtadagi sahifani sinaydi, kodda <= xato. Natija?",
    "o": [
     "Ikkalasi FAIL — <= hamma sahifani buzadi",
     "Ikkalasi PASS — xato chegarada yashirin",
     "O'rtadagisi FAIL — u ▶ ni ikki marta oladi",
     "TypeScript xato — <= sonlar uchun emas"
    ],
    "c": 1,
    "e": "Yashil test faqat sinalgan vaziyat haqida.",
    "s": 16
   },
   {
    "q": "AI 36 test yozdi, hammasi yashil. Qabul qilishdan oldin eng ishonchli tekshiruv?",
    "o": [
     "Test sonini sanab, 30 dan ko'pligini ko'rish",
     "Testlarni qayta yurgizib, yana yashil ko'rish",
     "Kodni 3 joyda buzib, test qizarishini ko'rish",
     "AI'dan «hammasini tekshirdingmi» deb so'rash"
    ],
    "c": 2,
    "e": "Son emas — ushlagan buzilish.",
    "s": 19
   },
   {
    "q": "expect(STATUS_UZ.CANCELLED).toBeTruthy(), matn «Yangi» ga o'zgardi. Test?",
    "o": [
     "FAIL — matn «bekor» emas, «yangi» bo'ldi",
     "No tests found — STATUS_UZ topilmadi",
     "TypeScript xato — matn turi o'zgardi",
     "PASS — toBeTruthy faqat bo'sh emasmi"
    ],
    "c": 3,
    "e": "toBeTruthy — bormi, to'g'rimi emas.",
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
