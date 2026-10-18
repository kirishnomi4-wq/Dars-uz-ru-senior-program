# 2-dars «Botingizni birinchi kim ochadi?» — yakuniy matn

Fayl: `src/5-Modull/PmLesson19.jsx` · 16 ekran · Keyingi dars: «Telegram Bot API + tugmalar»
Holat: 04.10.2026 — kodga mos

## 0 · Kirish — nechta bot
- Eyebrow: Kirish · botlar
- Sarlavha: Telegram'da hozir *nechta* botni ishlatasiz?
- Mentor: Bu savolda xato javob yo'q: o'zingizda qanday bo'lsa, shuni tanlang.
- Variantlar:
  - Bir nechtasi bor — kimdir aytgani uchun ochganman
  - Yo'q shekilli — o'zim hech qachon qidirmaganman
- Javob izohlari:
  - 1-variant tanlansa: Demak, botni siz ham kimdir aytgani uchun ochgansiz — ko'pchilik shunday ochadi. 1-darsda ochgan botingizni ham kimdir aytmaguncha hech kim topmaydi. Bugun kimga aytishni rejalashtiramiz.
  - 2-variant tanlansa: Demak, bot o'zi sizga kelmagan: kimdir aytmasa, odam botni qidirmaydi. 1-darsda ochgan botingizni ham kimdir aytmaguncha hech kim topmaydi. Bugun kimga aytishni rejalashtiramiz.
- Jonli darsda: ikkala variant yonida sinf ovozlari foizi (N%)
- Tugma: Bittasini tanlang → Davom etish

## 1 · Maqsad
- Eyebrow: Maqsad
- Sarlavha: Botingizni birinchi *kim ishlatadi?*
- Mentor: O'tgan darsda botingizni @BotFather'da ro'yxatdan o'tkazdingiz, kodini esa keyingi darsda yozasiz. Bugun birinchi yigirmata foydalanuvchingiz keladigan uchta guruhni yozasiz.
- Namuna: uchta guruh
  - O'yin guruhi → birga o'ynaydiganlar · 12
  - Kursdoshlar → kursda haftada uch marta ko'rishadiganlar · 6
  - Qo'shnilar → bir hovlidagilar · 4
  - Jami: 22 odam (har qator chiqqanda o'sadi: 12 → 18 → 22)
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Ikki holat
- Eyebrow: Muhokama · ikki holat
- Sarlavha: Bot tayyor bo'ldi — endi u *kimga* kerak?
- Mentor: Tasavvur qiling: botingizning kodi yozilgan, tugmalar ishlayapti. Ikki kartani bosib solishtiring.
- Kartalar (bosilguncha «· · ·»):
  - **Bot tayyor** — Buyruqlar ishlaydi, javob keladi. Lekin uni hali hech kim ochmagan: bot bo'sh turibdi.
  - **Botni odam ishlatdi** — Kimdir botni ochdi, /start bosdi va javob oldi.
- Xulosa (ikkala karta ochilgach): **Botingizni birinchi bo'lib ishlatadigan odamlar — birinchi foydalanuvchilar.** Ularni bot o'zi olib kelmaydi: har biriga siz aytasiz. Bugungi maqsad — yigirmata: bir-ikki odam fikr aytishga kam, yuztasiga esa bittalab aytib chiqa olmaysiz.
- Tugma: Yana N kartani oching → Davom etish

## 3 · 1-savol
- Eyebrow: Tekshiruv · bot va odam
- Savol: Bot bir hafta ishlab turdi, siz hech kimga aytmadingiz. Nechta odam yozdi?
  - Bir nechta — Telegram botni o'zi ko'rsatadi
  - ✔ Hech kim — uni topadigan odam bo'lmadi
  - Ko'p — bot qidiruvda birinchi chiqadi
- Javob izohlari:
  - To'g'ri: Bot o'zi odam olib kelmaydi — birinchi odamlarga siz aytasiz.
  - A: Telegram yangi botni hech kimga tavsiya qilmaydi: uni nomini bilgan odamgina qidirib topadi.
  - C: Qidiruvda chiqish uchun ham kimdir botni izlashi kerak. Siz aytmagan botni kim izlaydi?
- Barcha testlarda umumiy yozuvlar: Javobni tanlang → Davom etish · javobdan keyin «To'g'ri» yoki «Qaytadan urinib ko'ring» · jonli darsda: «Jonli dars — bitta urinish, o'ylab bosing.» · «Javobingiz qabul qilindi» · «Hozir to'g'ri javobni bilib olasiz.» · xato bo'lsa: «To'g'ri javob: B — Hech kim — uni topadigan odam bo'lmadi»

## 4 · Odamlar xaritasi
- Eyebrow: Sinov · odamlar xaritasi
- Sarlavha: Sizni *o'rab* turgan odamlar kimlar?
- Mentor: Markazda siz turasiz, halqalarda — atrofingizdagi odamlar: ichkarida tanishlar, tashqarida notanishlar. Avval uchala halqani oching.
- Xarita: markazda «siz», atrofida 1 · 2 · 3 halqa
- Halqalar (ochilguncha «· · ·»):
  - 1 Har kuni ko'rishadiganlar **12 odam** — Sinfdoshlar, qo'shnilar, to'garakdagilar. Ismingizni biladi.
  - 2 Ba'zan ko'rishadiganlar **40 odam** — Maktabdagi tanishlar. Yuzingizdan taniydi.
  - 3 Sizni tanimaydiganlar **300 odam** — Katta Telegram guruhlaridagi odamlar. Sizni bilmaydi.
- Uchalasi ochilgach: ✓ Uch halqa ochildi · 12 · 40 · 300
- Bir hafta: Har halqaga bir hafta bering: bot haqida faqat o'sha halqadagilarga aytasiz. Qaysi biridan boshlaysiz?
  - Tugmalar: 1 Har kuni ko'rishadiganlarga · 2 Ba'zan ko'rishadiganlarga · 3 Sizni tanimaydiganlarga
  - Hafta ketayotganda: Bir hafta o'tmoqda…
  - 40 soniya kutsa: Qolgan halqalarga ham bir hafta bering.
- Natija-qatorlari:
  - 1 — **9 → 17 odam.** 9 odam ishlatdi, yana 8 odam qo'shildi.
  - 2 — **6 → 8 odam.** 6 odam ishlatdi, yana 2 odam qo'shildi.
  - 3 — **4 → 4 odam.** 4 odam ishlatdi, yangi qo'shilgan yo'q.
- Xulosa (uchalasi tugagach): **Sizni taniydigan, bir-birini tez-tez ko'radigan odamlar — tanish guruh.** Bitta odam botni ochadi → yonidagilar ko'radi → ular ham ochadi. Birinchi foydalanuvchilar shunday guruhlardan keladi.
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- Tugma: Uch halqani oching (0/3) → Har halqaga bir hafta bering (0/3) → Davom etish

## 5 · 2-savol
- Eyebrow: Tekshiruv · tanish va notanish
- Savol: Bot havolasini 15 tanishingizga va 500 notanishga yubordingiz. Ertasiga botga ko'proq odam qaysi tomondan keladi?
  - ✔ O'n beshtasidan — ular havolani yonidagilarga ko'rsatadi
  - Besh yuztasidan — havolani ko'rgan odam ko'proq bo'ladi
  - Ikkalasidan teng — havola ikkalasiga ham yetib bordi
- Javob izohlari:
  - To'g'ri: Tanishlar havolani ochib, yonidagilarga ko'rsatadi; notanishlarda u odatda qolib ketadi.
  - B: Havolani ko'rgan odam ko'p, lekin ular sizni tanimaydi — ko'pchiligi uni ochmaydi ham.
  - C: Havola ikkalasiga ham yetdi. Farqi shunda: tanishlar uni yonidagilarga ko'rsatadi, notanishlar esa odatda ko'rsatmaydi.

## 6 · Bitta sayt tarixi
- Eyebrow: Biznes olamidan
- Sarlavha: Bu sayt birinchi foydalanuvchilarini *qayerdan* olgan?
- Bosqichlar (har kartada «n / 5»):
  1. **2004-yil** — AQShdagi bitta universitetda oddiy sayt ochildi. Unga **faqat o'sha universitet talabalari** yozila olardi.
  2. Avval o'zingiz belgilab ko'ring · 2 / 5 — **Sayt faqat bitta universitetda ochiq edi. Sizningcha, u yerda qanday tarqaldi?**
     - Sekin — har kim o'zi qidirib topdi
     - ✔ Tez — u yerda hamma bir-birini tanirdi
     - Tarqalmadi — odam soni kam edi
     - Topsa: Topdingiz: tez — u yerda hamma bir-birini tanirdi.
     - Adashsa: Adashdingiz — asl javob: tez, u yerda hamma bir-birini tanirdi.
  3. **Keyin boshqa universitetlar** — Sayt boshqa universitetlarga birin-ketin ochildi, 2005-yilda — maktablarga ham.
  4. Avval o'zingiz belgilab ko'ring · 4 / 5 — **Sayt butun dunyoga qachon ochilgan?**
     - O'sha yilning o'zida
     - ✔ Ikki yarim yildan keyin
     - Bir necha oydan keyin
     - Topsa: Topdingiz: ikki yarim yildan keyin, 2006-yilda.
     - Adashsa: Adashdingiz — asl javob: ikki yarim yildan keyin, 2006-yilda.
  5. **Bu sayt — Facebook** — Bu voqeada odam soni emas, odamlarning bir-birini tanishi ish bergan. Sizda ham shunday guruhlar bor — bitta savoldan keyin ularni yozasiz.
- Ochilmagan bosqich nuqtasi ustida: Avval shu bosqichni tugating
- Tugma: Keyingi bosqich (1/5) … Keyingi bosqich (4/5) · bashoratda: Avval o'zingiz belgilang · oxirida: Davom etish

## 7 · 3-savol
- Eyebrow: Tekshiruv · bitta universitet
- Savol: Sayt bitta universitetda tez tarqaldi. Buni nima tezlashtirdi?
  - Saytda odam soni ko'p edi: butun shahar yozila olardi
  - Sayt birinchi kundan butun dunyo uchun ochiq turardi
  - ✔ Yangilik ertasiga darsda yonma-yon o'tirganlarga yetardi
- Javob izohlari:
  - To'g'ri: Saytga faqat o'sha universitetdagilar kira olardi, ular esa bir-birini har kuni ko'rardi.
  - A: Odam soni emas: saytga faqat o'sha universitetdagilar yozila olardi, butun shahar emas.
  - B: Butun dunyo uchun sayt ikki yarim yildan keyin ochilgan — birinchi kuni emas.

## 8 · Uchta guruh
- Eyebrow: Mustaqil ish
- Sarlavha: Uchta *guruhingizni* yozing.
- Mentor: Tanish guruhni eslang: sizni taniydigan, bir-birini tez-tez ko'radigan odamlar.
- Qadam-doiralar: 1-guruh · 2-guruh · 3-guruh (saqlangani ✓)
- Maydonlar: «Qaysi guruh?» · «Unda kimlar bor?» · «Nechta?» odam
- Javob-qatorlari:
  - son o'rniga matn yozilsa: Nechta odam? Sonini yozing.
  - «hamma / odamlar / do'stlar / yoshlar / bolalar / hech kim» yozilsa: Aniqroq yozing: guruhda kimlar bor — sinfdoshlarmi, qo'shnilarmi, to'garakdagilarmi?
  - son 100 dan katta bo'lsa: Bu guruhda odam ko'p. Ularning nechtasi sizni taniydi? O'sha sonni yozing.
  - hammasi joyida: Guruh, kimlar va odam soni yozildi — saqlashingiz mumkin.
- Tugma yonida nima yetishmaydi: guruh nomi yozilmagan / kimlar borligi yozilmagan / odam soni yozilmagan
- Tugmalar: ✓ Saqlash · tahrirda: ✓ Yangilash
- Uchtasi yozilgach ro'yxat: **Uchta guruhingiz** · **guruh nomi** → kimlar → N odam · tahrirlash belgisi ✎ (ustida: Tahrirlash)
- O'ng panel — Topshiriq:
  - ○ / ✓ Har guruhda odam soni · Har guruhda kimlar borligi
  - Hozircha: N odam → uchtasi yozilgach: Jami: N odam
  - Jami 20 dan kam bo'lsa: Yigirmaga yetmadi — bu ham natija. Kod yozganingizda u yana nechta odam kerakligini sanab beradi.
- Yordam (bosilganda ochiladi): Bu odamlarni haftada necha marta ko'rasiz? · Ular sizni ismingiz bilan biladimi?
- Qo'shimcha (bosilganda ochiladi): Odam soni eng ko'p guruhingizni oling. Agar ularning yarmi botni ochmasa, uchala guruhdan jami nechta odam qoladi? Javobni ovoz chiqarib ayting.
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- Tugma: Birinchi guruhingizni yozing → Yana N guruh qoldi → Davom etish

## 9 · To'rt guruh
- Eyebrow: Sinov · to'rt guruh
- Sarlavha: Yigirmata odamni iloji boricha *kam guruhdan* yig'ing.
- Mentor (faqat topshiriq bosqichida): To'rt guruh bor. Bittasini bosing — o'sha guruhdan nechta odam botni ishlatgani ko'rinadi.
- Hisoblagich: Yig'ildi · N / 20
- Topshiriq: Har odam botga uch qadamda keladi: eshitdi → ochdi → ishlatdi. Yigirmaga yetguncha guruh tanlang.
- Tugma: To'rt guruhni ko'rish ▸
- Nishon qatori: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · xatodan keyin: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Kartalar (bosilgach uch qadam ochiladi):
  - **Sinfdoshlar** · 26 odam · har kuni ko'rishadi → eshitdi 26 · ochdi 18 · ishlatdi 13
  - **Notanish odamlar guruhi** · 1200 odam · umuman ko'rishmaydi → eshitdi 1200 · ochdi 46 · ishlatdi 2
  - **To'garakdagilar** · 11 odam · haftada uch marta ko'rishadi → eshitdi 11 · ochdi 9 · ishlatdi 7
  - **E'lon taxtasini o'qiydiganlar** · 300 odam · faqat o'tib ketayotganda ko'rishadi → eshitdi 300 · ochdi 12 · ishlatdi 1
- Sabab-qatorlari (bosilgan karta ichida, uch qadam tagida):
  - Sinfdoshlar: biri ochdi, yonidagilarga ko'rsatdi.
  - Notanish odamlar guruhi: sizni tanimaydi, ochib yopib qo'ydi.
  - To'garakdagilar: haftada uch marta uchrashadi, bir-biriga eslatadi.
  - E'lon taxtasini o'qiydiganlar: o'qidi va o'tib ketdi, eslatadigan odam yo'q.
- Yordam (birinchi kam natijadan keyin chiqadi): Ikki savol bering: bu odamlar bir-birini taniydimi? · Ular bir-birini haftada necha marta ko'radi?
- Yakun (20 ga yetgach): N odam ikkita guruhdan yig'ildi — sinfdoshlar 13, to'garakdagilar 7 (son so'zi bosilgan guruhlarga qarab: bitta / ikkita / uchta / to'rtta; 1200 odamli guruh bosilgan bo'lsa oxirida: · 1200 odamdan atigi 2 tasi)
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- Tugma: Topshiriqni o'qing → Bitta guruhni bosing → Yigirmagacha N odam qoldi → Davom etish

## 10 · Koding
- Eyebrow: Koding · kod oynasi
- Sarlavha: Odamlarni sanaydigan *kod* yozamiz.
- 1-bosqich — kod-savol:
  - Mentor: Avval bitta savol, keyin kodni yozasiz.
  - Qoida: Kod uchta guruhning odam sonini qo'shadi. Jami 20 dan kam bo'lsa — «Yana ... odam kerak», aks holda — «Yigirmata odam bor» deb yozadi.
  - Savol: Uchta guruhda 13, 7 va 4 odam bor. Kod nima chiqaradi?
    - Jami: 24 odam · Yana 4 odam kerak
    - ✔ Jami: 24 odam · Yigirmata odam bor
    - Jami: 20 odam · Yigirmata odam bor
  - Xato bosilsa: Ikki narsani alohida sanang: uchta son qo'shilsa nechta bo'ladi va u yigirmadan kammi?
- 2-bosqich — kod:
  - Mentor: Uchta guruhingiz kodda ro'yxat bo'lib turibdi. Sizga sanash va bitta shart qoladi.
  - Yechilgan savol: ✓ 13 + 7 + 4 = 24 — yigirmadan kam emas
  - Kod nima chiqarsin:
    1. Har guruh uchun bitta qator chiqadi
    2. Jami son chiqadi
    3. Oxirgi qator: yigirmaga yetdi yoki yana nechta odam kerak
  - Yordam (bosilganda ochiladi): Qatorni `console.log(...)` ekranga chiqaradi. Bittasidan boshlang: `console.log(guruhlar[0].nom)`. · Ishlagach, shu guruhning sonini `jami` ga qo'shing. · Qo'shimcha: eng ko'p odam beradigan guruhning nomini alohida qatorda chiqaring.
  - Uchta guruh — bitta hisob · Tugma: Kod oynasini ochish → bajarilgach: ↻ Kod oynasini qayta ochish · Bajarildi — xohlasangiz kodni yana o'zgartirib ko'ring
  - Faqat mustaqil rejimda: ✓ Bu kodni sinfda yozganman →
  - Bajarilgach: Kod uchta guruhni sanab berdi: jami son va yigirma sharti chiqdi.
  - Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- Kod oynasi:
  - Eyebrow: Koding · odamlarni sanaymiz
  - Sarlavha: Odamlarni sanaydigan kod
  - Fayl: yigirma.js · bo'sh qatordagi yozuv: // shu guruh uchun bitta qator chiqaring
  - Topshiriq: Ro'yxat bo'ylab yuring: console.log ichida guruh nomi va odam soni, sonni **jami** ga qo'shing, oxirida — «Yigirmata odam bor» yoki «Yana ... odam kerak».
  - Shartlar: Har guruh uchun bitta qator chiqadi · Jami son chiqadi · Oxirgi qator: yigirmaga yetdi yoki yana nechta odam kerak
- Boshlang'ich kod — 8-ekranda uchta guruh saqlangan bo'lsa (ro'yxat o'quvchining guruhlaridan):
```js
// yigirma.js — birinchi yigirmata foydalanuvchini sanaydigan kod
// Ro'yxat siz yozgan uchta guruhdan to'ldirildi.
const guruhlar = [
  { nom: "<1-guruh>", nechta: <son> },
  { nom: "<2-guruh>", nechta: <son> },
  { nom: "<3-guruh>", nechta: <son> }
];

let jami = 0;

for (let i = 0; i < guruhlar.length; i++) {
  // 1) shu guruh uchun bitta qator chiqaring: console.log ichida guruh nomi va nechta odam
  // 2) jami ga shu guruhning odam sonini qo'shing
}

// 3) jami 20 dan kam bo'lsa: "Yana ... odam kerak"
//    aks holda:              "Yigirmata odam bor"
```
- Boshlang'ich kod — 8-ekranda guruh saqlanmagan bo'lsa: o'sha kod, faqat 2-qator va ro'yxat boshqa:
```js
// Ro'yxatda namunadagi uchta guruh turibdi.
const guruhlar = [
  { nom: "O'yin guruhi", nechta: 12 },
  { nom: "Kursdoshlar", nechta: 6 },
  { nom: "Qo'shnilar", nechta: 4 }
];
```
- Tekshiruv xabarlari (shart bajarilmasa):
  - Uchala guruh nomi uchta alohida qatorda chiqsin — har guruh uchun console.log yozing
  - jami ga har guruhning sonini qo'shing va oxirida uni chiqaring
  - Oxirgi shart: kam bo'lsa "Yana ... odam kerak", aks holda "Yigirmata odam bor"
- Tugma: Avval kod-savolini yeching → Kodni yozing → Davom etish

## 11 · 4-savol (yakuniy)
- Eyebrow: Yakuniy tekshiruv
- Savol: Bot havolasi 900 notanish odamga yuborildi. Ertasiga nechta odam botni ishlatadi?
  - Yigirmatadan ko'p — havolani ochadigan odam ko'p chiqadi
  - ✔ Bir-ikki odam — ochganlar ham ishlatmay qo'yadi
  - Hech kim — bunday havolani odamlar ochmaydi
- Javob izohlari:
  - To'g'ri: Notanish odam botni odatda ochib ko'radi va yopib qo'yadi.
  - A: Ochganlar bo'ladi, lekin ishlatmay qo'yadi: notanish odam botni odatda ochib ko'radi va yopadi.
  - C: Havola yetib bordi, ochganlar ham bo'ldi — gap ochgandan keyin nima bo'lishida.

## 12 · Yoddan ayting
- Eyebrow: Mustahkamlash · 2 qadam
- Sarlavha: Tanish guruhingizni *yoddan* ayta olasizmi?
- Mentor: Ekranga qaramasdan ikki narsani ayting: guruh nomi va undagi odamlar bir-birini haftada necha marta ko'radi.
- 1-qadam: Ovoz chiqarib ayting (mustaqil) / Sherigingizga ayting (jonli)
  - Mustaqil: 30 soniyani boshlash → Hozir ovoz chiqarib ayting · ekranga qaramasdan → ✓ Vaqt tugadi — aytib bo'ldingiz. · ↻ Yana 30 soniya
  - Jonli: Har biringizga 30 soniyadan — avval A, keyin B. · 1 daqiqani boshlash → Hozir A gapiradi · keyin — B navbati / oxirgi navbat → ✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. · ↻ Yana 1 daqiqa
  - Vaqt ketayotganda: To'xtatish
  - Vaqt tugagach 1-qadam yig'iladi: ✓ Aytdingiz · ↻ Yana 30 soniya (jonlida: ↻ Yana 1 daqiqa)
- 2-qadam: Endi bir qator yozing · maydon: «Tanish guruhim — ..., ularni haftada ... marta ko'raman»
- Yozgach: ✓ Endi bilasiz: botni qurish — ishning yarmi, birinchi foydalanuvchilarni o'zingiz olib kelasiz.
- Tugma: Davom etish

## 13 · Natijalar (podium) — jonli reyting


## 14 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.

| Old tomon | Orqa tomon |
|---|---|
| Birinchi foydalanuvchilar kimlar? | Botingizni birinchi bo'lib ishlatadigan odamlar |
| Tanish guruh nima? | Sizni taniydigan, bir-birini tez-tez ko'radigan odamlar |
| Tanish guruhda xabar nega tez tarqaladi? | Bittasi aytsa, qolganlar ham eshitadi |
| Katta guruhda odam ko'p — nega ishlatgani kam? | Ular sizni tanimaydi |
| Botga birinchi odamlarni kim olib keladi? | Siz aytasiz — bot o'zi olib kelmaydi |
| Bitta guruh haqida nimalarni yozib qo'yasiz? | Guruh nomi, unda kimlar borligi va odam soni |
| Odam botga kelguncha qaysi uch qadamdan o'tadi? | Eshitdi, ochdi, ishlatdi |
| Facebook sayti qayerdan boshlangan? | Bitta universitetdan — boshqalar yozila olmasdi |
| Facebook butun dunyo uchun qachon ochilgan? | Ikki yarim yildan keyin — 2006-yilda |
| Facebook voqeasida nima ish bergan? | Odam soni emas, odamlarning bir-birini tanishi |

- Tugmalar: ↻ O'rganilmoqda · N · ✓ Bildim · N · karta ag'darilgach: ✗ Takrorlash · ✓ Bildim
- Oxirida: Hammasini bilasiz! · 10/10 karta yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Davom etish

## 15 · Yakun
- Eyebrow: Dars yakuni
- Belgi: ✓ Dars tugadi
- Sarlavha: Uchta *guruhingizni* yozdingiz.
- Natija halqasi: N/4 to'g'ri javob
- Bugungi asosiy fikr — Birinchi foydalanuvchilar tanish guruhlardan keladi.
- CODE STRIKE arenasi: 12 SAVOL · 15 SONIYA · PODIUM (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Botingizni birinchi bo'lib ishlatadigan odamlar — birinchi foydalanuvchilar.
  - Sizni taniydigan, bir-birini tez-tez ko'radigan odamlar — tanish guruh.
  - Tanish guruhda bitta odam botni ochsa, xabar qolganlarga ham yetadi.
  - Birinchi foydalanuvchilarni bot emas, siz olib kelasiz.
- Nishonlaringiz — N/4 (to'rtta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Keyingi dars — **«Telegram Bot API + tugmalar»**. 1-darsda ochgan botingizga birinchi kodni yozasiz: /start buyrug'i va menyu tugmalari.
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- **Circle Explorer** — Uch halqani ochib solishtirdingiz (4-ekran)
- **Three Groups** — Uchta guruhni kimlar borligi va odam soni bilan yozdingiz (8-ekran)
- **First Twenty** — Yigirmata odamni ikki guruhdan yig'dingiz (9-ekran)
- **Head Counter** — Kodingiz uchta guruhdagi odamlarni sanab berdi (10-ekran)
- Yuqoridagi hisoblagich: Nishonlar — N/4
- Nishon olinganda: nomi, tavsifi va «bosib davom eting»

## Qisqa takrorlash oynalari
Jonli darsda Mentor ekranidan ochiladi. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. 3-ekran (1-savol) — **Birinchi foydalanuvchilarni siz olib kelasiz**
   - 1 · Birinchi foydalanuvchilar — Botingizni birinchi bo'lib ishlatadigan odamlar.
   - 2 · Bot o'zi olib kelmaydi — Bot bo'sh turganda uni hech kim ko'rmaydi. Birinchi odamlarning **har biriga siz aytasiz**.
   - 3 · Tayyor bo'lgani yetmaydi — Buyruqlar ishlashi — ishning yarmi. Ikkinchi yarmi: botni odam ochib ishlatishi.
   - Sinfga savol: Oxirgi botni siz kimning gapidan keyin ochgansiz?
2. 5-ekran (2-savol) — **Tanish guruhdan ko'p foydalanuvchi keladi**
   - 1 · Tanish guruh — Sizni taniydigan, bir-birini tez-tez ko'radigan odamlar.
   - 2 · Xabar o'zi yuradi — Tanish guruhda bitta odam aytsa, **qolganlar ham eshitadi** va ko'pincha o'zlari ham ochadi.
   - 3 · Katta guruh — Katta guruhda odam ko'p, lekin ular sizni tanimaydi: xabar odatda bitta odamda qolib ketadi.
   - Sinfga savol: Sizni ismingiz bilan taniydigan odamlar qaysi guruhingizda ko'p?
3. 7-ekran (3-savol) — **Facebook bitta universitetdan boshlagan**
   - 1 · 2004-yil — Sayt **bitta universitetda** ochildi: boshqalar ro'yxatdan o'ta olmasdi.
   - 2 · Dunyoga chiqish — Butun dunyo uchun sayt **2006-yilda, ikki yarim yil o'tib** ochildi; ungacha boshqa universitetlar va maktablarga birin-ketin ochildi.
   - 3 · Nima ish bergan — Odam soni emas, odamlarning bir-birini tanishi ish bergan.
   - Sinfga savol: Sizda universitet yo'q. Uning o'rniga qaysi guruhingiz bor?
4. 11-ekran (4-savol) — **Katta guruhdan foydalanuvchi kam chiqadi**
   - 1 · Xabar yetadi — Katta guruhda xabar ko'p odamga yetadi, lekin **ochib ishlatadigani kam qoladi**.
   - 2 · Yigirma qayerdan — Yigirmata foydalanuvchi ikki-uchta tanish guruhdan keladi, bitta katta guruhdan emas.
   - 3 · Uch qadam — Odam botga uch qadamda keladi: eshitdi, ochdi, ishlatdi. Har qadamda odam kamayadi.
   - Sinfga savol: Qaysi qadamda eng ko'p odam yo'qoladi?

## Jonli viktorina (12 savol)
1. Birinchi foydalanuvchilar kimlar?
   - ✔ Botni birinchi bo'lib ishlatadigan odamlar
   - Botni yaratishga yordam bergan odamlar
   - Botga faqat bir marta yozgan odamlar
   - Bot haqida faqat eshitgan odamlar
2. Botga birinchi odamlarni kim olib keladi?
   - Telegram — u yangi botlarni hammaga aytib turadi
   - Qidiruv — bot qidiruvda o'zi yuqoriga chiqadi
   - Bot — u yozilgan kuni odamlarni chaqiradi
   - ✔ Siz — birinchi odamlarga o'zingiz aytasiz
3. Tanish guruhda xabar nega tez tarqaladi?
   - Chunki u yerda odam soni eng ko'p
   - Chunki xabarni u yerda bot o'zi aytadi
   - ✔ Chunki u yerdagilar bir-birini tez-tez ko'radi
   - Chunki u yerdagilar bir-birini izlab yuradi
4. Uch halqadan qaysi biri ko'proq odam berdi?
   - Sizni tanimaydiganlar halqasi
   - ✔ Har kuni ko'rishadiganlar halqasi
   - Ba'zan ko'rishadiganlar halqasi
   - Uchala halqa ham bir xil odam berdi
5. Katta guruhda odam ko'p — nega ishlatgani kam?
   - Chunki katta guruhda bot ochilmaydi
   - ✔ Chunki u yerdagilar sizni tanimaydi
   - Chunki xabar u yerga umuman yetmaydi
   - Chunki bot u yerda sekin ochiladi
6. Xabar qaysi guruhdan tez tarqaladi?
   - ✔ Har kuni ko'rishadigan guruhdan — ular bir-biriga aytadi
   - Har kuni ko'rishadigan guruhdan — odam soni ko'p
   - Bir-birini tanimaydigan guruhdan — odam soni ko'p
   - Bir-birini tanimaydigan guruhdan — ular bir-biriga aytadi
7. Odam botga kelguncha qaysi uch qadamdan o'tadi?
   - Qidirdi, topdi, yozdi
   - Ochdi, ishlatdi, eshitdi
   - ✔ Eshitdi, ochdi, ishlatdi
   - Ko'rdi, yozdi, o'chirdi
8. Facebook sayti 2004-yilda qayerda ochilgan?
   - Butun dunyoda — istagan odam yozila olardi
   - Ikki shaharda — ikkita katta maktabda
   - Uchta shaharda — har birida bitta joyda
   - ✔ Bitta universitetda — faqat o'z talabalariga
9. Facebook butun dunyo uchun qachon ochilgan?
   - ✔ Oradan ikki yarim yil o'tgach
   - Birinchi kunidan boshlab
   - Bir necha oydan keyin
   - O'sha yilning oxirida
10. Facebook voqeasida nima ish bergan?
    - Saytning tez ochilishi
    - Saytga yozilgan odamlar soni
    - ✔ Odamlarning bir-birini tanishi
    - Saytdagi tugmalarning ko'pligi
11. Qaysi biri tanish guruh?
    - Bir mahallada yashaydigan, lekin bir-birini tanimaydigan odamlar
    - ✔ Har kuni ko'rishadigan sinfdoshlaringiz
    - Siz kuzatadigan kanalning 5000 obunachisi
    - Bekatda avtobus kutayotgan odamlar
12. Uchta guruh yozganda har guruh haqida nimalarni yozasiz?
    - Guruh nomi va undagi odamlarning yoshi
    - Faqat odam soni — qolgani kerak emas
    - Guruh nomi, admini va ochilgan kuni
    - ✔ Guruh nomi, kimlar borligi va odam soni
