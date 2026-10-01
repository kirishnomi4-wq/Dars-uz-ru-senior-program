# 5-Modul (LMS: 7-Modul) · 2-dars «Botingizni birinchi kim ochadi?» — reja va ekranma-ekran so'zlar

Fayl: `src/5-Modull/PmLesson19.jsx` · 16 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi (ikkinchi raqam — matn turgan ma'lumot-ro'yxati).
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook:** 0-ekranda «Telegramda hozir nechta botni ishlatasiz?» savoli. O'quvchi ikki javobdan birini tanlaydi (ikkalasi ham to'g'ri), keyin bitta xulosani o'qiydi: botni ko'pincha kimdir aytgani uchun ochamiz, sizning botingiz haqida birinchi odamlarga o'zingiz aytasiz.
- **Markaziy o'yin/mexanika:** 4-ekran «odamlar xaritasi»: uch halqani ochadi va har biriga bir hafta beradi (natijalar 17 / 8 / 4 odam). 9-ekran «to'rt joy»: joylarni bosib, har biri uch qadamdan (eshitdi → ochdi → ishlatdi) o'tganini ko'radi va yigirmata odam yig'adi.
- **Asosiy metafora/atamalar:** «birinchi yigirma» (botni birinchi ishlatadigan yigirmata odam) va «zich joy» (odamlar bir-birini har kuni ko'radigan joy). Haqiqiy misol — Facebook bitta universitetdan boshlangan.
- **Yakun:** o'quvchi o'zining uchta joyini yozadi (8), ularni kodda sanaydi (10) va darsni bitta gap yopadi: «Birinchi yigirma zich joydan yig'iladi.»

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — nechta bot | hook | 2 javobdan birini tanlaydi, keyin xulosani o'qiydi | — |
| 1 | Maqsad | qoida | uch joyli namuna-ro'yxat o'zi yozilib chiqadi (jami 22) | — |
| 2 | Ikki holat | tushuncha | «Bot tayyor» / «Botni odam ishlatdi» kartalarini ochadi → «birinchi yigirma» | — |
| 3 | 1-savol | test | hech kimga aytilmagan bot bir haftada nechta odam oladi | ✅ |
| 4 | Odamlar xaritasi | markaziy | 3 halqani ochadi, har biriga bir hafta beradi → «zich joy» | — |
| 5 | 2-savol | test | 15 tanish va 500 notanish — kim ko'proq javob beradi | ✅ |
| 6 | Facebook | case | 7 bosqich, 2 bashorat | — |
| 7 | 3-savol | test | sayt bitta universitetda nega tez tarqaldi | ✅ |
| 8 | Uch joy | amaliyot (yozish) | 3 joy yozadi: nomi · kimlar bor · nechta odam | — |
| 9 | To'rt joy | markaziy o'yin | 4 joydan tanlab 20 odam yig'adi (eshitdi → ochdi → ishlatdi) | — |
| 10 | Koding | koding | kod-savol → kompilyatorda `yigirma.js` | — |
| 11 | 4-savol | test (yakuniy) | 900 notanishga yuborilgan havola | ✅ (final) |
| 12 | Yoddan ayting | refleksiya | ovoz chiqarib aytadi (30 s / juftlikda 1 daqiqa) + bir qator yozadi | — |
| 13 | Natijalar | podium | jonli reyting / shaxsiy natija | — |
| 14 | Takrorlash | kartochkalar | 10 ta kartochka | — |
| 15 | Yakun | xulosa | asosiy fikr, 4 xulosa, arena, nishonlar, uyga vazifa tugmasi | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qayta tushuntirish» oynalari (RECAPS) — 4 ta; nishonlar — 4 ta.
Amaliy ekranlar (4, 8, 9, 10) test emas: bajarilgani belgilanadi.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
birinchi yigirma · zich joy · joy (kodda `joylar`) · halqa (① har kuni ko'rishadiganlar · ② ba'zan ko'rishadiganlar · ③ sizni tanimaydiganlar) ·
bir hafta · tanish / notanish · katta guruh / katta joy · uch qadam: eshitdi → ochdi → ishlatdi · «o'zimizniki» · joyma-joy ·
jami · «Yigirmata odam bor» / «Yana ... odam kerak»

---

## 0 · Kirish — nechta bot  `[659 · 653]`
- Eyebrow: Kirish · botlar
- Sarlavha: **Telegramda hozir *nechta* botni ishlatasiz?**
- Mentor: Bittasi ham esingizga kelmasligi mumkin — ikkala javob ham to'g'ri.
- Variantlar:
  - 🤖 Bir-ikkitasi bor — kimdir aytgani uchun ochganman
  - 🔎 Yo'q shekilli — o'zim hech qachon qidirmaganman
- Javobdan keyin (ikkala variantda bir xil): Ikkalasi ham bo'ladi. Botni ko'pincha qidirib emas, kimdir aytgani uchun ochamiz. Siz quradigan bot haqida ham birinchi odamlarga kimdir aytishi kerak — o'sha odam siz bo'lasiz.
- Jonli darsda: ikkala variant bo'yicha sinf ovozlari foizda chiqadi.
- Tugma: Bittasini tanlang → Davom etish

## 1 · Maqsad  `[736 · 730]`
- Eyebrow: Maqsad
- Sarlavha: **Bugun birinchi yigirma odam keladigan *uch joyni* yozasiz.**
- Mentor: Bu modulda botingizni qurasiz — bugun uni birinchi ishlatadigan odamlarni topamiz.
- Namuna-ro'yxat (qatorlar o'zi yozilib chiqadi): **🗂 Odamlar to'planadigan uch joyingiz**
  - 🎮 O'yin guruhi → birga o'ynaydiganlar · 12
  - 👪 Qarindoshlar → bayramda ko'rishadiganlar · 6
  - 🏠 Qo'shnilar → bir ko'chadagilar · 4
  - Jami: 22 odam
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Ikki holat  `[766 · 762]`
- Eyebrow: Muhokama · ikki holat
- Sarlavha: **Bot tayyor bo'ldi — endi u *kimga* kerak?**
- Mentor: Tasavvur qiling: kod yozilgan, tugmalar ishlayapti. Ikki kartani bosib solishtiring.
- Kartalar (bosilguncha «· · ·», qayta bosilsa yopiladi):
  - 🤖 **Bot tayyor** — Buyruqlar ishlaydi, javob keladi. Lekin uni hali hech kim ochmagan — bot bo'sh turibdi
  - 👥 **Botni odam ishlatdi** — Kimdir ochdi, yozdi, javob oldi
- Xulosa (ikkalasi ochilgach): **Botingizni birinchi bo'lib ishlatadigan yigirmata odam — birinchi yigirma.** Ularni bot o'zi olib kelmaydi: har biriga siz aytasiz.
- Tugma: 👆 Yana N kartani oching → Davom etish

## 3 · 1-savol ✅  `[815]`
- Eyebrow: Tekshiruv · bot va odam
- Mentor: — (bu ekranda yo'q)
- Savol: **Bot bir hafta ishlab turdi, siz hech kimga aytmadingiz. Nechta odam yozdi?**
  - Bir nechta — Telegram botni o'zi ko'rsatadi
  - ✔ Hech kim — uni topadigan odam bo'lmadi
  - Ko'p — bot qidiruvda birinchi chiqadi
- To'g'ri: Bot o'zi odam olib kelmaydi. Birinchi odamlarga siz aytasiz, keyin ular boshqasiga aytadi.
- Xato izohlari:
  - (A) Telegram yangi botlarni hech kimga ko'rsatib yurmaydi — bot shunchaki ro'yxatda turadi.
  - (C) Qidiruvda chiqish uchun ham botni kimdir izlashi kerak. Uni izlash kimning xayoliga keladi?
  - (umumiy) Botni topadigan odam bo'lmasa, hech kim yozmaydi.
- Barcha testlarda umumiy yozuvlar: Javobni tanlang → Davom etish · to'g'ri bo'lsa «To'g'ri», xato bo'lsa «Qaytadan urinib ko'ring» · jonli darsda: «⚡ Jonli dars — bitta urinish, o'ylab bosing!» · «📨 Javobingiz qabul qilindi» · «Hozir to'g'ri javobni bilib olasiz.» · «To'g'ri javob: B — …»

## 4 · Odamlar xaritasi (markaziy)  `[865 · 843]`
- Eyebrow: Sinov · odamlar xaritasi
- Sarlavha: **Sizni *o'rab* turgan odamlar kimlar?**
- Mentor: Markazda siz turasiz. Halqa — atrofingizdagi odamlar doirasi: ichkarida yaqinlar, tashqarida notanishlar.
- Xarita: markazda «🙋 siz», atrofida ①②③ halqalar (nuqtalar = odamlar)
- 1-bosqich — halqalarni ochish (ochilguncha «· · ·»):
  - ① **Har kuni ko'rishadiganlar** · 12 odam — Sinfdoshlar, to'garakdagilar, qo'shnilar. Ular sizni ismingiz bilan biladi
  - ② **Ba'zan ko'rishadiganlar** · 40 odam — Boshqa sinflar, maktabdagi tanishlar. Sizni yuzdan taniydi
  - ③ **Sizni tanimaydiganlar** · 300 odam — Katta guruhlardagi begona odamlar. Sizni umuman bilmaydi
- 2-bosqich — 🗓 Bir hafta: **Bir hafta vaqtingiz bor. Bot haqida qaysi halqadagilarga aytasiz?**
  - Tugmalar: ① Har kuni ko'rishadiganlarga · ② Ba'zan ko'rishadiganlarga · ③ Sizni tanimaydiganlarga
  - Hafta ketayotganda: 🗓 Bir hafta o'tmoqda…
  - 40 soniya kutsa: 🤔 Boshqa halqaga ham bir hafta berib, natijani solishtiring.
- Natija-qatorlari:
  - ① Bir hafta ichida 9 odam ishlatdi. Ular yonidagilarga ko'rsatdi — yana 8 odam qo'shildi. Jami 17.
  - ② Bir hafta ichida 6 odam ishlatdi. Yana qo'shilgani — 2 odam. Jami 8.
  - ③ Bir hafta ichida 4 odam ishlatdi. Yana qo'shilgani yo'q. Jami 4.
- Xulosa (uchalasi tugagach): **Odamlar bir-birini har kuni ko'radigan joy — zich joy.** Zich joyda bitta odam botni ochsa, qolganlari ko'radi va o'zlari ham ochadi. Birinchi yigirma shunday joydan yig'iladi.
- Tugma: ① Uch halqani oching (0/3) → ② Har halqaga bir hafta bering (0/3) → Davom etish

## 5 · 2-savol ✅  `[1015]`
- Eyebrow: Tekshiruv · tanish va notanish
- Mentor: — (bu ekranda yo'q)
- Savol: **Xabarni 15 tanishga va 500 notanishga yubordingiz. Ertasiga ko'proq javob qayerdan keladi?**
  - ✔ O'n beshtasidan — ular xabarni yonidagiga ko'rsatadi
  - Besh yuztasidan — xabarni ko'rgan odam ko'p bo'ladi
  - Ikkalasidan teng — xabar ikkalasiga ham yetdi
- To'g'ri: Har kuni ko'rishadiganlar xabarni yonidagiga ko'rsatadi; notanishlar orasida u bitta odamda qolib ketadi.
- Xato izohlari:
  - (B) Xabarni ko'rgan odam ko'p, lekin ular sizni tanimaydi — xabar o'sha yerda to'xtaydi.
  - (C) Xabar ikkalasiga ham yetdi. Farqi shunda: tanishlar uni yonidagiga ko'rsatadi, notanishlar esa yo'q.
  - (umumiy) Tanishlar tomonidan ko'proq odam yozadi — ular bir-birini ko'rib turadi.

## 6 · Facebook (case)  `[1084 · 1036]`
- Eyebrow: 👥 Biznes olamidan · Facebook
- Sarlavha: **Bu sayt birinchi odamlarni *qayerdan* olgan?**
- Mentor: — (bu ekranda yo'q)
- Bosqichlar (har kartada «n / 7»):
  1. 🎓 **2004-yil** — Bitta universitetda oddiy sayt ochildi. Unga **faqat o'sha universitet talabalari** yozila olardi — boshqalar ro'yxatdan o'ta olmasdi.
  2. 🎲 Avval o'zingiz belgilab ko'ring · **Sayt faqat bitta universitetda ochiq edi. Sizningcha, u yerda qanday tarqaldi?**
     - 🐢 Sekin — har kim o'zi qidirib topdi · ✔ ⚡ Tez — u yerda hamma o'ziniki edi · 🚫 Tarqalmadi — odam soni kam edi
     - Topsa: 🎯 Topdingiz! Tez — u yerda hamma o'ziniki edi · Adashsa: Adashdingiz — asl javob: tez, u yerda hamma o'ziniki edi
  3. 🔥 **Sayt tez tarqaldi** — Universitetdagilar uni «o'zimizniki» deb ishlata boshladi.
  4. 🎲 Avval o'zingiz belgilab ko'ring · **Sayt butun dunyoga qachon ochilgan?**
     - 📅 O'sha yilning o'zida ochilgan · ✔ 🗓 Ikki yildan keyin ochilgan · ⏳ Bir necha oydan keyin ochilgan
     - Topsa: 🎯 Topdingiz! Ikki yildan keyin ochilgan · Adashsa: Adashdingiz — asl javob: ikki yildan keyin ochilgan
  5. 🏫 **Keyin boshqa universitetlar** — Sayt boshqa universitetlarga ochildi — bittalab, joyma-joy.
  6. 🌍 **Butun dunyoga** — Butun dunyoga sayt ikki yil o'tib ochildi. Bugun uni **Facebook** nomi bilan bilamiz. Bu voqeada odam soni emas — odamlarning bir-birini tanishi ish bergan.
  7. 🌉 (ko'prik) — Facebook birinchi odamlarni butun dunyodan qidirmagan — bitta zich joydan boshlagan, keyin joyma-joy kengaygan. Sizda ham shunday joylar bor. Endi ularni o'zingiz yozasiz.
- Nuqtalar ustida: Avval shu bosqichni tugating
- Tugma: Keyingi bosqich (1/7) … · bashoratda «Avval o'zingiz belgilang» → oxirida Davom etish

## 7 · 3-savol ✅  `[1147]`
- Eyebrow: Tekshiruv · bitta joydan
- Mentor: — (bu ekranda yo'q)
- Savol: **Sayt bitta universitetda tez tarqaldi. Buni nima tezlashtirdi?**
  - Saytda odam soni ko'p edi: butun shahar yozila olardi
  - Sayt birinchi kundan butun dunyo uchun ochiq turardi
  - ✔ Yangilik ertasiga darsda yonma-yon o'tirganlarga yetardi
- To'g'ri: Saytga faqat o'sha universitetdagilar kira olardi, ular esa bir-birini har kuni ko'rardi.
- Xato izohlari:
  - (A) Odam soni emas: saytga faqat o'sha universitetdagilar yozila olardi, butun shahar emas.
  - (B) Butun dunyoga sayt ikki yildan keyin ochilgan — birinchi kuni emas.
  - (umumiy) Sabab bitta: u yerdagilar bir-birini kunda ko'rardi — yangilikni yonidagiga aytardi.

## 8 · Uch joy (yozish)  `[1186]`
- Eyebrow: Mustaqil ish · uch joy
- Sarlavha: **Uchta *joyingizni* yozing.**
- Mentor: Zich joyni eslang: odamlar bir-birini har kuni ko'radigan joy.
- Qadam-doiralar: 1-joy · 2-joy · 3-joy
- Maydonlar: «Qaysi joy?» · «U yerda kimlar bor?» · «Nechta?» + odam
- Javob-qatorlari (bloklamaydi):
  - son o'rniga matn: 🤔 Nechta odam? Sonini yozing.
  - «hamma / odamlar / do'stlar / yoshlar / bolalar / hech kim» yozilsa: 🤔 Bu hali javob emas. U yerda kimlar bor: sinfdoshlarmi, qo'shnilarmi, to'garakdagilarmi? Shuni yozing.
  - son 100 dan katta: 🤔 Bu joyda odam ko'p. Ularning nechtasi sizni taniydi? O'sha sonni yozing.
  - hammasi joyida: ✅ Bu joydagi odamlarni siz o'zingiz taniysiz.
- Tugma yonida nima yetishmaydi: joy nomi yozilmagan / kimlar borligi yozilmagan / odam soni yozilmagan
- Tugmalar: ✓ Saqlash · (tahrirda) ✓ Yangilash · ✎ Tahrirlash
- Uchtasi yozilgach ro'yxat: **🗂 Uch joyingiz** · 📍 **joy** → kimlar → N odam ✎
- O'ng panel — 🎯 Topshiriq: 📍 1-joy · 📍 2-joy · 📍 3-joy
  - Belgilar: ○/✓ Uchta joy yozilgan · Har joyda odam soni · Har joyda kimlar borligi
  - Hozircha: N odam → Jami: N odam
  - Jami 20 dan kam bo'lsa: Yigirmaga yetmadi — ✎ tugmasini bosib biror joydagi odam sonini qayta sanang.
- 💡 Yordam: Bu odamlarni haftada necha marta ko'rasiz? · Ular sizni ismingiz bilan biladimi?
- ⭐ Qo'shimcha: Odam soni eng ko'p joyingizni oling. Agar ularning yarmi botni ochmasa, uchala joydan jami nechta odam qoladi? Javobni ovoz chiqarib ayting.
- Yakun: ✅ Uch joyingiz saqlandi — har birida kimlar borligi va odam soni bor
- Tugma: ① Birinchi joyingizni yozing → ② Yana N joy qoldi → Davom etish

## 9 · To'rt joy (markaziy o'yin)  `[1359 · 1341]`
- Eyebrow: Tekshiruv · to'rt joy
- Sarlavha: **Yigirmata odamni *yig'ing*.**
- Mentor (faqat topshiriq bosqichida): To'rt joy bor. Bittasini tanlang — undan nechta odam botni ochib ishlatgani ko'rinadi.
- Hisoblagich: Yig'ildi · N / 20
- Topshiriq: Yigirmaga yetguncha davom eting. Har joy uch qadamdan o'tadi: eshitdi → ochdi → ishlatdi. · Tugma: To'rt joyni ko'rish ▸
- Legenda (ish bosqichida): 👥 Nechta odam ko'radi · 🔁 Odamlar qanchalik tez-tez ko'rishadi
- Nishon-qatori: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Kartalar (bosilgach: eshitdi · ochdi · ishlatdi):
  - 🏫 **Sinfdoshlar guruhi** · 👥 26 · 🔁 har kuni ko'rishadi → eshitdi 26 · ochdi 18 · ishlatdi 13
  - 🌐 **Notanish odamlar guruhi** · 👥 1200 · 🔁 umuman ko'rishmaydi → eshitdi 1200 · ochdi 46 · ishlatdi 2
  - 🏀 **To'garakdagilar** · 👥 11 · 🔁 haftada uch marta ko'rishadi → eshitdi 11 · ochdi 9 · ishlatdi 7
  - 📌 **Maktab e'lonlar taxtasi** · 👥 300 · 🔁 faqat o'tib ketayotganda ko'rishadi → eshitdi 300 · ochdi 12 · ishlatdi 1
- Sabab-qatorlari (bosilgan har joy uchun):
  - 🏫 13 Biri ochdi, yonidagilarga ko'rsatdi
  - 🌐 2 Sizni tanimaydi — ochib, yopib qo'ydi
  - 🏀 7 Haftada uch marta uchrashadi — bir-biriga eslatadi
  - 📌 1 O'qidi va o'tib ketdi — eslatadigan odam yo'q
- 💡 Yordam (faqat kam natijadan keyin chiqadi): Ikki savol bering: bu odamlar bir-birini taniydimi? · Ular bir-birini haftada necha marta ko'radi?
- Yakun (20 ga yetgach): bosilgan joylar tasmasi «🏫 Sinfdoshlar guruhi +13 …» va
  ✅ {N} odam {ikkita/uchta/to'rtta} joydan yig'ildi — sinfdoshlar guruhi 13, to'garakdagilar 7 … (1200 lik guruh bosilgan bo'lsa: · 1200 odamdan atigi 2 tasi)
- Tugma: ① Topshiriqni o'qing → ② Bitta joyni bosing → ③ Yigirmagacha N odam qoldi → Davom etish

## 10 · Koding  `[1558 · 1516]`
- Eyebrow: Koding · 🛠 kod oynasi
- Sarlavha: **Odamlarni sanaydigan *kod* yozamiz.**
- 1-bosqich (kod-savol):
  - Mentor: Avval bitta savol — keyin kod yoziladi.
  - Savol: **🔎 Uch joyda 13, 7 va 4 odam bor. Kod nima chiqaradi?**
    - Jami: 24 odam · Yana 4 odam kerak
    - ✔ Jami: 24 odam · Yigirmata odam bor
    - Jami: 20 odam · Yigirmata odam bor
  - Xato bosilsa: 🤔 Ikki narsani alohida sanang: uchta son qo'shilsa nechta bo'ladi va u yigirmadan kammi?
- 2-bosqich (kod):
  - Mentor: Uchta joyingiz kodda ro'yxat bo'lib turibdi. Sizga sanash va bitta shart qoladi.
  - Yig'ilgan savol: ✓ 13 + 7 + 4 = 24 — yigirmadan kam emas
  - **Kod nima chiqarsin:** 1. Har joy uchun bitta qator chiqadi · 2. Jami son chiqadi · 3. Oxirgi qator: yigirmaga yetdi yoki yana nechta odam kerak
  - 💡 Yordam: Qatorni `console.log(...)` ekranga chiqaradi. Bittasidan boshlang: `console.log(joylar[0].joy)`. · Ishlagach, shu joyning sonini `jami` ga qo'shing. · ⭐ Qo'shimcha: eng ko'p odam beradigan joyning nomini alohida qatorda chiqaring.
  - 🧮 Uch joy — bitta hisob · Tugma: 🛠 Kompilyatorni ochish → (keyin) ↻ Kompilyatorni qayta ochish · «Bajarildi — xohlasangiz kodni yana sayqallang»
  - Faqat mustaqil rejimda: ✓ Bu kodni sinfda yozganman →
  - Bajarilgach: ✅ Kod uch joyni sanab berdi — jami son va yigirma sharti chiqdi
- Kompilyator ichida: Eyebrow «Koding · odamlarni sanaymiz» · Sarlavha **Odamlarni sanaydigan kod** · fayl `yigirma.js` · bo'sh qatordagi yozuv «// shu joy uchun bitta qator chiqaring»
  - Topshiriq: Ro'yxat bo'ylab yuring: console.log ichida joy nomi va odam soni, sonni **jami** ga qo'shing, oxirida — «Yigirmata odam bor» yoki «Yana ... odam kerak».
- Boshlang'ich kod (ro'yxat o'quvchining 8-ekrandagi uch joyidan to'ldiriladi):
  ```js
  // yigirma.js — birinchi yigirmani sanaydigan kod
  // Ro'yxat siz yozgan uch joydan to'ldirildi.
  const joylar = [
    { joy: "<1-joy>", nechta: <son> },
    { joy: "<2-joy>", nechta: <son> },
    { joy: "<3-joy>", nechta: <son> }
  ];

  let jami = 0;

  for (let i = 0; i < joylar.length; i++) {
    // 1) shu joy uchun bitta qator chiqaring: console.log ichida joy nomi va nechta odam
    // 2) jami ga shu joyning odam sonini qo'shing
  }

  // 3) jami 20 dan kam bo'lsa: "Yana ... odam kerak"
  //    aks holda:              "Yigirmata odam bor"
  ```
- Tekshiruv xabarlari (shart bajarilmasa):
  - Uchala joy nomi uchta alohida qatorda chiqsin — har joy uchun console.log yozing
  - jami ga har joyning sonini qo'shing va oxirida uni chiqaring
  - Oxirgi shart: kam bo'lsa "Yana ... odam kerak", aks holda "Yigirmata odam bor"
- Tugma: ① Avval kod-savolini yeching → ② Kodni yozing → Davom etish

## 11 · 4-savol ✅ (final)  `[1834]`
- Eyebrow: Yakuniy tekshiruv
- Mentor: — (bu ekranda yo'q)
- Savol: **Bot havolasi 900 notanish odamga yuborildi. Ertasiga nechta odam botni ishlatadi?**
  - Yigirmatadan ko'p — havolani ochadigan odam ko'p chiqadi
  - ✔ Bir-ikki odam — ochganlari ham ishlatib ketmaydi
  - Hech kim — bunday havolani odamlar ochmaydi
- To'g'ri: Notanish odam botni ochadi va yopib qo'yadi. Yigirmata odam zich joydan yig'iladi.
- Xato izohlari:
  - (A) Ochgan odam bo'ladi, lekin ishlatib ketmaydi: notanish odam botni ochib, yopib qo'yadi.
  - (C) Havola yetib bordi, ochganlar ham bo'ldi — gap ochgandan keyin nima bo'lishida.
  - (umumiy) Katta joydan bir-ikki odam qoladi — qolganlari ochsa ham ishlatmaydi.

## 12 · Yoddan ayting (refleksiya)  `[1730]`
- Eyebrow: Mustahkamlash · 2 qadam
- Sarlavha: **Uch joyingizni *yoddan* ayta olasizmi?**
- Mentor: Ekranga qaramay javob bering: eng zich joyingiz qaysi va u yerdagi odamlar bir-birini haftada necha marta ko'radi?
- 1-qadam: 🗣 Ovoz chiqarib ayting: joy va necha marta (mustaqil) / 🗣 Sherigingizga ayting: joy va necha marta (jonli)
  - Mustaqil: ▶ 30 soniyani boshlash → «Hozir ovoz chiqarib ayting · ekranga qaramasdan» → ✓ Vaqt tugadi — aytib bo'ldingiz. Barakalla! · ↻ Yana 30 soniya
  - Jonli: Har biringizga 30 soniyadan — avval A, keyin B. · ▶ 1 daqiqani boshlash → «Hozir A gapiradi · keyin — B navbati» / «oxirgi navbat» → ✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla! · ↻ Yana 1 daqiqa · ⏹ To'xtatish
- 2-qadam: ✍️ Endi bir qator yozing · maydon: «Eng zich joyim ... , ularni haftada ... marta ko'raman»
- Yozgach: ✓ Endi siz botni qurib qo'yib ketmaysiz — birinchi odamlarni o'zingiz olib kelasiz. · 🎯 Bugungi qoida: birinchi yigirma zich joydan yig'iladi
- Tugma: Davom etish

## 13 · Natijalar (podium)  `[2422]`
- Eyebrow: Natijalar · Sarlavha: **Bugungi *natijangiz*** (mustaqil) / **Bugungi *g'oliblarimiz*** (jonli)
- Mustaqil: N/4 to'g'ri javob · 🏅 Nishonlar · «Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruhning natijalari va 🥇🥈🥉 eng yaxshi uchtalik chiqadi.»
- Jonli: Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · 🥇🥈🥉 · Siz — N-o'rin (N/4 to'g'ri) · 🏆 Barcha natijalar

## 14 · Takrorlash (kartochkalar)  `[1823 · 1811]`
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni *sinab ko'ring*.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Birinchi yigirma nima? | Botingizni birinchi bo'lib ishlatadigan yigirmata odam | — |
| Zich joy nima? | Odamlar bir-birini har kuni ko'radigan joy | — |
| Zich joyda xabar nega tez tarqaladi? | Bittasi aytsa, qolganlari eshitadi | — |
| Katta guruhda odam ko'p — nega ishlatgani kam? | Ular sizni tanimaydi | — |
| Botga birinchi odamlarni kim olib keladi? | Siz aytasiz — bot o'zi olib kelmaydi | — |
| Bitta joy haqida nimalarni yozib qo'yasiz? | Joy nomi, u yerda kimlar borligi va odam soni | — |
| Odam botga kelguncha qaysi uch qadamdan o'tadi? | Eshitdi, ochdi, ishlatdi | — |
| Facebook sayti qayerdan boshlangan? | Bitta universitetdan — boshqalar yozila olmasdi | — |
| Facebook butun dunyoga qachon ochilgan? | Ikki yildan keyin | — |
| Facebook voqeasida nima ish bergan? | Odam soni emas, odamlarning bir-birini tanishi | — |

(Bu darsda kartalarda izoh qatori yo'q.)
- Tugmalar: ↻ O'rganilmoqda · N · ✓ Bildim · N · ✗ Takrorlash · ✓ Bildim · 🎉 Hammasini bilasiz! · 10/10 karta yodlandi · ↻ Qaytadan takrorlash · Davom etish

## 15 · Yakun  `[2518]`
- Eyebrow: Dars yakuni · ✓ Dars tugadi
- Sarlavha: **Uchta *joyingizni* yozdingiz.** (yonida N/4 to'g'ri javob halqasi)
- Bugungi asosiy fikr — **Birinchi yigirma zich joydan yig'iladi.**
- ⚔️ CODE STRIKE arenasi tugmasi (jonli darsda mentor boshlaguncha: ⏳ Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Botingizni birinchi bo'lib ishlatadigan yigirmata odam — birinchi yigirma.
  - Odamlar bir-birini har kuni ko'radigan joy — zich joy.
  - Zich joyda bitta odam aytsa, qolganlari eshitadi.
  - Birinchi odamlarni bot emas, siz olib kelasiz.
- 🏅 Nishonlaringiz — N/4 (quyida «Qo'shimcha matnlar»)
- Uyga vazifa · Amaliy topshiriqni bajarish → (PM uy vazifasi — mazmuni bu MD'ga kiritilmadi)
- Keyingi dars haqida matn: yo'q
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** 🎯 Map Pro! — Uch halqani ochib solishtirdingiz (4) · 🗂 My Plan! — Uchta joyni odam soni bilan yozdingiz (8) · 👥 20 Done! — Yigirmata odamni to'g'ri joylardan yig'dingiz (9) · 🧮 Code Master! — Kodingiz uch joyni sanab berdi (10)
Nishon yozuvlari: 🏅 Nishonlar — N/4 · 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. (faqat 9-ekranda) · Yangi nishon · bosib davom eting

**Qayta tushuntirish oynalari (RECAPS, 4)** — «📖 Qayta tushuntirish», 3-kartada «🗣️ Sinfga savol:»:
1. (3-savol) **Birinchi odamlarni siz olib kelasiz:** Birinchi yigirma — Botingizni birinchi bo'lib ishlatadigan yigirmata odam — birinchi yigirma. · Bot o'zi olib kelmaydi — Bot bo'sh turganda uni hech kim ko'rmaydi. Birinchi odamlarning har biriga siz aytasiz. · Tayyor bo'lgani yetmaydi — Buyruqlar ishlashi — ishning yarmi. Ikkinchi yarmi: botni odam ochib ishlatishi. · Sinfga savol: Oxirgi botni siz kimning gapidan keyin ochgansiz?
2. (5-savol) **Zich joy ko'p odam beradi:** Zich joy — Odamlar bir-birini har kuni ko'radigan joy — zich joy. · Xabar o'zi yuradi — Zich joyda bitta odam aytsa, qolganlari eshitadi va o'zlari ham ochadi. · Katta guruh — Katta guruhda odam ko'p, lekin ular sizni tanimaydi: xabar bitta odamda qolib ketadi. · Sinfga savol: Sizni ismingiz bilan taniydigan odamlar qayerda ko'p?
3. (7-savol) **Facebook bitta joydan boshlagan:** 2004-yil — Sayt bitta universitetda ochildi: boshqalar ro'yxatdan o'ta olmasdi. · Dunyoga chiqish — Butun dunyoga sayt ikki yildan keyin ochildi — avval joyma-joy kengaydi. · Nima ish bergan — Odam soni emas — odamlarning bir-birini tanishi ish bergan. · Sinfga savol: Sizning universitetingiz yo'q. Uning o'rniga qaysi joyingiz bor?
4. (11-savol) **Katta joy odam bermaydi:** Xabar yetadi — Katta joyda xabar ko'p odamga yetadi, lekin ochib ishlatadigani kam qoladi. · Yigirma qayerdan — Yigirmata odam ikki-uchta zich joydan yig'iladi — bitta katta guruhdan emas. · Uch qadam — Odam botga uch qadamda keladi: eshitdi, ochdi, ishlatdi. Har qadamda odam kamayadi. · Sinfga savol: Qaysi qadamda eng ko'p odam yo'qoladi?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Birinchi yigirma nima? ✔ Botni birinchi ishlatadigan yigirmata odam · Botga bir marta xabar yozgan yigirmata odam · Bot bir kunda javob bergan yigirmata xabar · Botni qidiruvdan izlab topgan yigirmata odam
2. Botga birinchi odamlarni kim olib keladi? Telegram — u yangi botlarni hammaga aytib turadi · Qidiruv — bot qidiruvda o'zi yuqoriga chiqadi · Bot — u yozilgan kuni odamlarni chaqiradi · ✔ Siz — birinchi odamlarga o'zingiz aytasiz
3. Zich joyda xabar nega tez tarqaladi? Chunki u yerda odam soni eng ko'p · Chunki xabarni u yerda bot o'zi aytadi · ✔ Chunki bittasi aytsa, qolganlari eshitadi · Chunki u yerdagilar bir-birini izlaydi
4. Uch halqadan qaysi biri ko'proq odam berdi? Sizni tanimaydiganlar halqasi · ✔ Har kuni ko'rishadiganlar halqasi · Ba'zan ko'rishadiganlar halqasi · Uchala halqa ham bir xil odam berdi
5. Katta guruhda odam ko'p — nega ishlatgani kam? Chunki katta guruhda bot ochilmaydi · ✔ Chunki u yerdagilar sizni tanimaydi · Chunki xabar u yerga umuman yetmaydi · Chunki bot u yerda sekin ochiladi
6. Xabar qaysi joydan tez tarqaladi? ✔ Har kuni ko'rishadigan joydan — ular bir-biriga aytadi · Har kuni ko'rishadigan joydan — odam soni ko'p · Bir-birini tanimaydigan joydan — odam soni ko'p · Bir-birini tanimaydigan joydan — ular bir-biriga aytadi
7. Odam botga kelguncha qaysi uch qadamdan o'tadi? Qidirdi, topdi, yozdi · Ochdi, ishlatdi, eshitdi · ✔ Eshitdi, ochdi, ishlatdi · Ko'rdi, yozdi, o'chirdi
8. Facebook sayti 2004-yilda qayerda ochilgan? Butun dunyoda — istagan odam yozila olardi · Ikki shaharda — ikkita katta maktabda · Uchta shaharda — har birida bitta joyda · ✔ Bitta universitetda — o'sha talabalarga
9. Facebook butun dunyoga qachon ochilgan? ✔ Oradan ikki yil o'tgach · Birinchi kunidan boshlab · Bir necha oydan keyin · O'sha yilning oxirida
10. Facebook voqeasida nima ish bergan? Saytning tez ochilishi · Saytga yozilgan odamlar soni · ✔ Odamlarning bir-birini tanishi · Saytdagi tugmalarning ko'pligi
11. Zich joy qanday joy? Zich joy — har kuni ko'p odam yig'iladigan joy · ✔ Zich joy — odamlar bir-birini har kuni ko'radi · Zich joy — odamlar bir-birini ko'rmaydigan joy · Zich joy — xabar o'zi tarqalmaydigan joy
12. Uchta joy yozganda har joyda nimalarni yozasiz? Joy nomi va u yerdagi odamlarning yoshi · Faqat odam soni — qolgani kerak emas · Joy nomi va u yerga borish yo'li · ✔ Joy nomi, kimlar borligi va odam soni

(Mentorga eslatmalar (📋 Eslatma) MD'ga kiritilmadi — ularni o'quvchi ko'rmaydi.)

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **KOD · 10-ekran** — 8-ekranda uch joy saqlanmagan bo'lsa (jonli darsda o'tkazib yuborilsa, mentor ekranida), boshlang'ich kod 1-ekrandagi namunadan olinadi, lekin joy nomi obyekt bo'lib ketadi: kodda `joy: {"uz":"O'yin guruhi","ru":"Игровая группа"}` ko'rinadi (ruscha matn bilan), yuqoridagi izoh esa «Ro'yxat siz yozgan uch joydan to'ldirildi» deydi `[1564 · 1519]`
- **6-ekran** — eyebrow «👥 Biznes olamidan · Facebook» birinchi kartadayoq nomni aytib qo'yadi. Sarlavha esa uni «Bu sayt…» deb yashiradi, nom 6-bosqichda ochiladi
- **10-ekran** — bitta narsa ikki xil nomlangan: eyebrow «kod oynasi», tugma «🛠 Kompilyatorni ochish / ↻ Kompilyatorni qayta ochish» («kompilyator» izohsiz; lug'atda: kompilyator → kod oynasi). Shu turdan: 13-ekran «Bu sessiyaga…» (lug'atda: sessiya → dars)
- **12-ekran** — sarlavha «Uch joyingizni yoddan ayta olasizmi?», lekin Mentor, 1-qadam va maydon bitta joyni so'raydi («eng zich joyingiz qaysi…», «Eng zich joyim ...»). O'quvchi uchtasini aytishi kerakmi yoki bittasini — noaniq
- **9-ekran** — legendada «👥 Nechta odam ko'radi» va «🔁 Odamlar qanchalik tez-tez ko'rishadi» yonma-yon turadi: birida «ko'radi» (xabarni), birida «ko'rishadi» (bir-birini), nimani ko'rishi esa aytilmagan. Topshiriqdagi «Har joy uch qadamdan o'tadi» jumlasida qadamdan joy emas, odam o'tadi (RECAPS 4: «Odam botga uch qadamda keladi»)
- **9-ekran** — nishon sharti «Birinchi urinishda to'g'ri bajarsangiz» deydi, lekin topshiriq sinov kabi berilgan («Bittasini tanlang — … ko'rinadi»). Birinchi bo'lib 1200 yoki 300 kishilik joy bosilsa, «20 Done!» nishoni yo'qoladi, qaysi tanlov «xato» ekani esa oldindan aytilmaydi
- **1-ekran** — maqsad-namunada «👪 Qarindoshlar → bayramda ko'rishadiganlar» turibdi, ya'ni har kuni ko'rilmaydigan joy. Dars qoidasi esa «birinchi yigirma zich joydan yig'iladi» (zich joy = har kuni ko'radigan). Namunaga qarab yozgan o'quvchi aynan shu turdagi joyni tanlashi mumkin
- **Arena 11-savol** «Zich joy qanday joy?» — uchta xato variant «… joy» so'zi bilan tugaydi, faqat to'g'ri javob («odamlar bir-birini har kuni ko'radi») boshqa shaklda. To'g'ri javobni shaklidan topish mumkin (3 ga 1)
