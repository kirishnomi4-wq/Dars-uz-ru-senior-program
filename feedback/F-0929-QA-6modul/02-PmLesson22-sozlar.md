# 6-Modul (LMS: 8-Modul) · 2-dars «Bitta gapni uch kishi bir xil tushunadimi?» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/PmLesson22.jsx` · 16 ekran · faqat o'zbekcha matn
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook (0-ekran):** Basseynga bordingiz — guruh to'lib qolgan, bekorga qaytdingiz. Siz «Joy band qiladigan ilova kerak» dedingiz — uch dasturchi shu gapdan uch xil ilova qurdi. O'quvchi sababini ikki variantdan tanlaydi («Gap juda qisqa aytilgan» / «Har kim boshqacha tushungan»); ikkalasiga bir xil javob: sabab — gap og'izda qoldi.
- **Markaziy mexanika (4-ekran):** uch dasturchi nima qurganini ochadi → murabbiyga to'rt savolni o'zi beradi (Nima qiynayapti? · Kim qiynalyapti? · Nima quriladi? · Qaysi son o'zgaradi?) → javoblar varaqning to'rt katagiga yoziladi → endi uch dasturchi bir xil narsa quradi. Shundan keyin atama tug'iladi: **PRD**.
- **Asosiy metafora:** bitta varaq — to'rt katak (Muammo · Kim · Yechim · O'lchov); misol-ip — basseyn guruhiga yozilish; haqiqiy voqea — Geyts va Allen, Altair, 1975.
- **Yakun:** o'quvchi o'z mini-do'koni uchun to'rt katakni yozadi, uch tayyor varaqdan javobsiz katakni topadi, VS Code'da bo'sh katakni topadigan funksiya yozadi; yakunda arena, nishonlar va uy vazifasi (varaqni bir odamga o'qib berish).

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — basseyn | hook | nega uch xil ilova chiqqanini tanlaydi | — |
| 1 | Maqsad | qoida | bo'sh varaq (to'rt katak) chizilishini ko'radi | — |
| 2 | Og'zaki vs yozilgan | tushuncha | ikki kartani ochib solishtiradi | — |
| 3 | 1-savol | test | og'zaki gapdan keyin birinchi nima qilinadi | ✅ |
| 4 | Bitta varaq (yadro) | markaziy | uch ilovani ochadi → murabbiyga 4 savol → varaq to'ladi → qayta quriladi → PRD | — |
| 5 | 2-savol | test | «Qaysi son o'zgaradi?» katagiga qaysi qator tushadi | ✅ |
| 6 | Haqiqiy voqea — Microsoft | case | 7 bosqichli hikoya + 2 bashorat | — |
| 7 | 3-savol | test | til nega birinchi urinishda ishladi | ✅ |
| 8 | Mustaqil ish · bir varaq | amaliyot | o'z mini-do'koni uchun 4 katakni yozadi | — |
| 9 | Tekshiruv · uch varaq | amaliyot | har varaqda javobsiz katakni topadi (yoki «yo'q») | — |
| 10 | Koding · VS Code | praktika | savol-darvoza → `yozilmaganKataklar` funksiyasini yozadi | — |
| 11 | 4-savol (yakuniy) | test | «Kim» katagi bo'sh qolsa dasturchi nima qiladi | ✅ (final) |
| 12 | Mustahkamlash · 2 qadam | refleksiya | qaysi katak qiyin bo'lganini aytadi va yozadi | — |
| 13 | Natijalar | podium | natija / jonli reyting | — |
| 14 | Takrorlash | kartochkalar | 10 ta kartochka | — |
| 15 | Dars yakuni | xulosa | 4 xulosa + arena + nishonlar + uy vazifasi | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qayta tushuntirish» oynalari (RECAPS) — 4 ta; nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
og'zaki gap · yozilgan qator · bitta (bir) varaq · to'rt katak · Muammo (Nima qiynayapti?) · Kim (Kim qiynalyapti?) ·
Yechim (Nima quriladi?) · O'lchov (Qaysi son o'zgaradi?) · javobsiz katak · bo'sh katak · murabbiy · uch dasturchi ·
bekorga qaytish · mini-do'kon · PRD (mahsulot talablari varag'i) · Geyts va Allen · Altair · BASIC · ko'rsatuv kuni

---

## 0 · Kirish — basseyn  `[677]`
- Eyebrow: Kirish · basseyn
- Sarlavha: **Uch dasturchi bitta gapni eshitdi — nega uch xil ilova chiqdi?**
- Mentor: Basseynga bordingiz — guruh to'lib qolgan, bekorga qaytdingiz.
- Karta: 🗣 «Joy band qiladigan ilova kerak», dedingiz.
- Tanlov:
  - 🗣 Gap juda qisqa aytilgan
  - 🧠 Har kim boshqacha tushungan
- Javobdan keyin (ikkalasiga bir xil): Ikkalasi ham bo'ladi. Sabab esa bitta: gap **og'izda** qoldi. Og'zaki aytilgan gapni har kim o'zicha tushunadi. Bugun shu gapni bitta varaqqa tushirasiz.
- Jonli darsda: sinf ovozlari foizi (har variant bo'yicha) · yorliq «Sinf natijasi»
- Tugma: Bittasini tanlang → Davom etish

## 1 · Maqsad  `[748]`
- Eyebrow: Maqsad
- Sarlavha: **Bugun mini-do'koningiz uchun bitta varaq to'ldirasiz.**
- Mentor: To'rt katak, har birida bitta qator.
- Vizual: «Bo'sh varaq» — to'rt katak chizilib chiqadi (ichi bo'sh «· · ·»):
  - 🔴 Muammo — Nima qiynayapti?
  - 👤 Kim — Kim qiynalyapti?
  - 🛠 Yechim — Nima quriladi?
  - 📊 O'lchov — Qaysi son o'zgaradi?
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Og'zaki vs yozilgan  `[764]`
- Eyebrow: Muhokama · bitta gap
- Sarlavha: **Og'zaki aytilgan gap va yozilgan qator — farqi nimada?**
- Mentor: Bitta gap ikki ko'rinishda turibdi. Ikkala kartani bosib solishtiring.
- Kartalar (bosilganda ochiladi, qayta bosilsa yopiladi):
  - 🗣 **Og'zaki aytilgan** — Gap aytilib bo'lgach yo'qoladi. Qolgan bo'sh joyni har kim o'z boshida to'ldiradi
  - 📄 **Varaqqa yozilgan** — Gap joyida qoladi. Uch kishi ham bir xil qatorni o'qiydi
- Xulosa (ikkalasi ochilgach): **Og'zaki aytilgan gapni har kim o'zicha tushunadi — yozilgan qatorni hamma bir xil o'qiydi.** · Shuning uchun ish kod bilan emas, yozilgan qator bilan boshlanadi.
- Tugma: 👆 Yana N kartani oching → Davom etish

## 3 · 1-savol ✅  `[805]`
- Eyebrow: Tekshiruv · yozilgan qator
- Savol: **Nima kerakligini sizga og'zaki aytishdi. Ish boshlashdan oldin birinchi nima qilasiz?**
  - Eshitganimni yodda saqlab, kod yozaman
  - ✔ Eshitganimni qatorga yozib olaman
  - Qatorni ish tugagach yozib qo'yaman
- To'g'ri: Yozilgan qator hammada bir xil turadi, og'zaki gap esa har kimning boshida boshqacha.
- Xato izohlari:
  - (A) Yodda saqlangan gap ham og'izda qolgani bilan bir xil — boshqa odam uni boshqacha tushunadi.
  - (C) Ish tugagach yozilgan qator kech qoladi: kim nima qurishini oldindan bilmaydi.
  - (umumiy) Avval eshitganingiz qatorga yoziladi — yozilgan qatorni hamma bir xil o'qiydi.
- Tugma: Javobni tanlang · 📖 Qayta tushuntirish (RECAPS 1)

## 4 · Bitta varaq (markaziy)  `[839]`
- Eyebrow: Sinov · bitta varaq
- Sarlavha: **To'rt savolni bering va varaqni to'ldiring.**
- Mentor: Murabbiyga har savolni bering — javob o'z katagiga yozilib chiqadi.
- Chap blok: 🏊 Basseyn murabbiysi — «Basseynga joy band qiladigan ilova kerak.»
- ① Tugma: ▶ Uch dasturchi nima qurdi? → ochiladi:
  - 📞 Basseynning telefon raqami va manzili — *Ilova ochildi. Joy bormi — bilinmadi*
  - 🏊 Suzish guruhlari ro'yxati va rasmlari — *Ilova ochildi. Joy bormi — bilinmadi*
  - 🕐 Bo'sh joy ko'rinadi, lekin band qilib bo'lmaydi — *Joy ko'rindi. Borsangiz band bo'lib qolishi mumkin*
  - Yakun qatori: Uchalasi ham ishladi. Bekorga qaytish esa kamaymadi.
- ② 🙋 Murabbiydan so'rang — 4 savol-tugma: Nima qiynayapti? · Kim qiynalyapti? · Nima quriladi? · Qaysi son o'zgaradi?
- Varaq «Basseyn ilovasi» — javoblar katakka yoziladi:
  - 🔴 Muammo — Odamlar kelib, guruh to'lib qolganini ko'radi va bekorga qaytadi
  - 👤 Kim — Haftada ikki marta suzishga keladiganlar
  - 🛠 Yechim — Bo'sh joyni ko'rsatib, joyni band qiladigan ilova
  - 📊 O'lchov — Bekorga qaytish 10 tadan 2 taga tushsin
- Ipucha (42 soniyadan keyin): 🤔 Murabbiydan yana bitta savol so'rang.
- ③ Tugma: ▶ Endi nima qurishadi? → uchta bir xil karta: «Bo'sh joy ko'rinadi» · «Joy band qilinadi»
- Natija: ✅ Bitta varaq — uchta bir xil natija.
- Atama (oxirgi qator): Kod yozishdan oldin to'ldiriladigan shu bitta varaq — **PRD**. Uch harf uchta inglizcha so'zning boshi: Product Requirements Document — mahsulot talablari varag'i.
- Pastki tugma bosqichlari: ① Uch dasturchining ishini oching → ② Murabbiydan savol so'rang (N/4) → ③ Endi nima qurishini oching → Davom etish

## 5 · 2-savol ✅  `[962]`
- Eyebrow: Tekshiruv · o'lchov katagi
- Savol: **«Qaysi son o'zgaradi?» katagiga qaysi qator yozilishi mumkin?**
  - ✔ Kunda 30 odam joy band qiladi
  - Uch murabbiy ham ilovadan mamnun
  - Ilova ikki barobar qulay bo'ladi
- To'g'ri: Bu katakda sanab bo'ladigan son turadi; qulaylikni ham, mamnunlikni ham sanab bo'lmaydi.
- Xato izohlari:
  - (B) «Uch murabbiy» o'zgaradigan son emas, mamnunlikni esa sanab bo'lmaydi.
  - (C) «Ikki barobar qulay» ni sanab bo'lmaydi — qulaylikni o'lchaydigan son yo'q.
  - (umumiy) Bu katakda sanab bo'ladigan son turadi: nechta, necha daqiqa yoki necha kun.

## 6 · Haqiqiy voqea — Microsoft (case)  `[1029]` (slaydlar `[1000]`)
- Eyebrow: 💾 Haqiqiy voqea
- Sarlavha: **Microsoft qanday boshlandi?**
- Bosqichlar (hisoblagich «💾 Haqiqiy voqea · N / 7»):
  1. 📰 **1975-yil** — Ikki yigit — Bill Geyts va Pol Allen — jurnalda yangi kompyuter haqida o'qib qoldi. Uning nomi Altair edi.
     - Rasm: ALTAIR 8800 · 1975 · lampochkalar va tumblerlar · «ekran ham, klaviatura ham yo'q — faqat kichik kalitlar va lampochkalar»
  2. 🔮 Bashorat (🎲 Avval o'zingiz belgilab ko'ring): **Ular kompaniyaga qo'ng'iroq qilib «bizda shu kompyuter uchun til bor» dedi. Odam kompyuterga buyruqni shu til bilan yozadi. O'sha paytda til qay holatda edi?**
     - 📦 Tayyor turgan edi · 🧩 Yarmi yozilgan edi · ✔ 📄 Hali yozilmagan edi
     - Topsa: 🎯 Topdingiz! Hali yozilmagan edi · Topmasa: Adashdingiz — asl javob: hali yozilmagan edi
  3. 📞 **Telefon qo'ng'irog'i** — Ular Altairni chiqargan kompaniyaga qo'ng'iroq qilib aytdi: «Bizda shu kompyuter uchun BASIC tili bor». BASIC — o'sha tilning nomi. O'sha paytda bu til hali yozilmagan edi.
  4. 🗓 **Bir necha hafta** — Qo'ng'iroqdan keyin ular tilni bir necha haftada yozdi.
  5. 🔮 Bashorat: **Sizningcha, ular tilni qayerda sinab ko'rishdi?**
     - 🏠 Do'kondan Altair olib, uyda · 🏭 Zavodga borib, o'sha yerda · ✔ 🚫 Altairga umuman tegmasdan
     - Topsa: 🎯 Topdingiz! Altairga umuman tegmasdan · Topmasa: Adashdingiz — asl javob: Altairga umuman tegmasdan
  6. 💾 **Ko'rsatuv kuni** — Ular haqiqiy Altairga bir marta ham tegmagan edi — ko'rsatuv **birinchi urinishdayoq** ishladi. Microsoft shundan boshlandi.
  7. 🧭 **Ish bitta gapdan boshlandi** — Ular ishni bitta gapdan boshladi: nima qurilishi va qaysi kompyuter uchun ekani o'sha gapda aytilgan edi. Sizning varag'ingiz — o'sha gapning to'rt katakka yozilgan shakli. Buni kod emas, mahsulotni o'ylaydigan odam yozadi.
- Tugmalar: Avval o'zingiz belgilang · Keyingi bosqich (N/7) → Davom etish · nuqtalar: «N-bosqich» / «Avval shu bosqichni tugating»

## 7 · 3-savol ✅  `[1097]`
- Eyebrow: Tekshiruv · ko'rsatuv kuni
- Savol: **Geyts va Allen Altairga bir marta ham tegmadi. Til nega baribir ishladi?**
  - Ular Altairni oldindan sinab ko'rgan edi
  - Kompaniya tayyor tilni ularga bergan edi
  - ✔ Nima kerakligi telefonda aniq aytilgan edi
- To'g'ri: Nima qurilishi va qaysi kompyuter uchun ekani telefonda aytilgan edi. Shuning uchun ko'rsatuv birinchi urinishdayoq ishladi.
- Xato izohlari:
  - (A) Ular Altairni umuman ko'rmagan edi — sinab ko'rishning iloji yo'q edi.
  - (B) Tilni kompaniya emas, Geyts va Allen o'zlari yozdi.
  - (umumiy) Nima kerakligi telefonda aniq aytilgan edi — shuning uchun til birinchi urinishdayoq ishladi.

## 8 · Mustaqil ish · bir varaq  `[1124]`
- Eyebrow: Mustaqil ish · bir varaq
- Sarlavha: **Mini-do'koningiz uchun bir varaq to'ldiring.**
- Mentor: Har katakning bitta savoli bor — javobini bitta qatorda yozing.
- Qadamlar (to'rt doira): 1 Muammo · 2 Kim · 3 Yechim · 4 O'lchov (yozilgani ✓)
- Maydon placeholder'lari: 🔴 Muammo — odamni nima qiynayapti? · 👤 Kim — Kim qiynalyapti? · 🛠 Yechim — Nima quriladi? · 📊 O'lchov — Qaysi son o'zgaradi?
- Javob-qatorlari (yozayotganda):
  - 🤔 Qisqa qoldi: to'liq gap bilan yozing.
  - 🤔 Bu hali muammo emas. Odam nimadan qiynalyapti — shuni yozing. *(Muammo: faqat «yaxshi/qulay/chiroyli…»)*
  - 🤔 «Hamma» — bu kim? Yoshi, joyi yoki ishi bilan ayting. *(Kim: faqat «hamma/foydalanuvchilar/odamlar»)*
  - 🤔 Bu qator yuqorida turibdi. Bu yerda nima QURILISHI yoziladi. *(Yechim = Muammo bilan bir xil)*
  - 🤔 Bu katakda son bo'lishi kerak: nechta, necha daqiqa yoki necha kun. *(O'lchov: son yo'q)*
  - ✅ Qatoringizda son bor — o'zgarishni shu sondan bilib olasiz.
  - ✅ Qator to'liq — endi saqlashingiz mumkin.
- Tugma: ✓ Saqlash / ✓ Yangilash · yonida: «qator yozilmagan» / «qator takrorlandi»
- O'ng blok: 🎯 Sizning varag'ingiz — 🔴 Muammo · 👤 Kim · 🛠 Yechim · 📊 O'lchov (✓)
- 💡 Yordam: Ikki savol bering: kimdir shu ishdan qiynalyaptimi? Qiynalgani sonda ko'rinadimi? Javoblar ikki katakni to'ldiradi.
- ⭐ Qo'shimcha: Varag'ingizni ovoz chiqarib o'qing — to'rt qator bitta ish haqida gapiryaptimi?
- To'rttasi yozilgach: varaq «Sizning varag'ingiz» ochiladi · ✎ Katakni bosib qatorini qayta yozishingiz mumkin. · ✅ To'rt katak ham yozildi — varaq saqlandi
- Pastki tugma: ① Birinchi katakni yozing → ② Yana N katak qoldi → Davom etish

## 9 · Tekshiruv · uch varaq  `[1289]` (varaqlar `[1260]`)
- Eyebrow: Tekshiruv · uch varaq
- Sarlavha: **Qaysi varaqda javobsiz katak bor — qaysisida yo'q?**
- Mentor: Endi o'sha to'rt savolni basseyn ilovasining boshqa uch varag'ida qo'llaysiz. Qatori o'z savoliga javob bermaydigan katakni bosing; to'rttasi ham javob bersa — «Javobsiz katak yo'q» tugmasini.
- Tugma (har varaq ostida): Bu varaqda javobsiz katak yo'q
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
- **1-varaq 📅 Murabbiy uchun kunlik ro'yxat** (✔ javobsiz: Yechim)
  - Muammo: Murabbiy kim kelishini kun boshida bilmaydi · Kim: Basseynda ishlaydigan uch murabbiy · Yechim: Murabbiyning ishini oson qiladigan ilova · O'lchov: Bilmay qolgan kun 5 tadan 1 taga tushadi
  - Izoh: ✅ «Ishini oson qiladigan ilova» — nima qurilishi hali aytilmagan. To'g'ri qator: «Har murabbiyga kunlik ro'yxatni ko'rsatadigan sahifa».
- **2-varaq 🔔 Mashg'ulotdan oldin eslatma** (✔ javobsiz: Kim)
  - Muammo: Odam o'zi band qilgan vaqtni o'tkazib yuboradi · Kim: Hamma foydalanuvchilar · Yechim: Vaqtdan 15 daqiqa oldin xabar yuboradigan bot · O'lchov: O'tkazib yuborilgan vaqt 12 tadan 3 taga tushadi
  - Izoh: ✅ «Hamma foydalanuvchilar» — bu kim? Yoshi, joyi yoki ishi bilan aytilsa katak yoziladi: «Joyni band qilib, boshqa ishga ketadiganlar».
- **3-varaq 🏊 Guruh tanlash** (✔ javobsiz katak yo'q)
  - Muammo: Odam o'zi xohlagan guruhga tusholmaydi · Kim: Bitta murabbiyga o'rganib qolganlar · Yechim: Joy band qilayotganda guruhni tanlaydigan ro'yxat · O'lchov: O'z guruhini tanlaganlar 10 tadan 7 taga chiqadi
  - Izoh: ✅ To'rt katak ham o'z savoliga javob berdi: nima qiynayotgani, kim qiynalayotgani, nima qurilishi va qaysi son o'zgarishi yozilgan.
- Xato bo'lsa:
  - (katak bosilsa) 🤔 Bu katak o'z savoliga javob berib turibdi. Qolgan kataklarni savoli bilan qo'shib o'qing.
  - («yo'q» bosilsa) 🤔 Bitta katakning qatori o'z savoliga javob bermayapti — yana bir marta o'qib chiqing.
  - 💡 Yordam: Har katakni o'z savoli bilan qo'shib o'qing: qatori shu savolga javob beryaptimi?
  - 2 xatodan keyin: 🤔 Yechim katagida nima QURILISHI, Kim katagida ANIQ odamlar, O'lchov katagida esa SON turishi kerak.
  - Nishon: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Tugmalar: Keyingi varaq → / ✓ Tekshiruvni yakunlash
- Yakun ro'yxati: «📅 Murabbiy uchun kunlik ro'yxat — Yechim katagi javobsiz» · «🔔 … — Kim katagi javobsiz» · «🏊 Guruh tanlash — to'rt katak ham javob berdi»
- Natija: ✅ 2 varaqda javobsiz katak topdingiz — 1 varaqda to'rt katak ham o'z savoliga javob berdi
- Pastki tugma: ② N-varaqni o'qing (N/3 tekshirildi) → ① Keyingi varaqqa o'ting / ① Tekshiruvni yakunlang → Davom etish

## 10 · Koding · VS Code  `[1500]` (kod `[1415]`)
- Eyebrow: Koding · 📄 VS Code
- Sarlavha: **Bo'sh katakni topadigan kod yozamiz.**
- **1-bosqich (savol-darvoza):**
  - Mentor: Avval bitta savol — keyin kod yoziladi.
  - Savol: 🔢 **Qaysi katakda son bo'lishi shart?** — Muammo katagida · ✔ O'lchov katagida · Kim katagida
  - Xato bo'lsa: 🤔 Katakning savolini o'qing: qaysi biri «Qaysi son o'zgaradi?» deb so'raydi?
  - Pastki tugma: 🔒 Avval kod-savolini yeching
- **2-bosqich (kod):**
  - Mentor: Qatorning ma'nosini odam o'qiydi, kod esa umuman yozilmagan katakni topadi. Kodda har varaq shunday turadi: katak nomi, yonida uning qatori.
  - Belgi: ✓ Son **O'lchov** katagida turadi
  - 📤 Kutilgan uch natija: `varaq1 → ["olchov"]` · `varaq2 → ["muammo", "kim"]` · `varaq3 → ["yechim"]`
  - Shartlar: 1) Funksiya ro'yxat (massiv) qaytaradi · 2) Bo'sh katakning nomi ro'yxatga tushadi
  - 💡 Yordam: Bitta katakdan boshlang: `varaq1.olchov` bo'shmi? Ishlagach qolgan uchtasiga o'ting. · ⭐ Qo'shimcha: `tayyormi(varaq)` funksiyasini qo'shing — bo'sh katak bo'lmasa `true`, aks holda `false` qaytarsin.
  - Muharrir: 📄 varaq.js · 🔒 qo'lda yoziladi (hover: «Kod nusxalanmaydi — o'zingiz terib yozasiz») · bo'lak-tugmalari: ① Uch varaq · ② Funksiya
  - Boshlang'ich kod:
    ```js
    // Bir varaq — to'rt katak
    const NOMLAR = ["muammo", "kim", "yechim", "olchov"];

    const varaq1 = {
      muammo: "Odamlar kelib, guruh to'lib qolganini ko'radi",
      kim: "Haftada ikki marta suzishga keladiganlar",
      yechim: "Bo'sh joyni ko'rsatib, joy band qiladigan ilova",
      olchov: ""
    };

    const varaq2 = {
      muammo: "",
      kim: "",
      yechim: "Kunlik ro'yxatni ko'rsatadigan sahifa",
      olchov: "Bilmay qolgan kun 5 tadan 1 taga tushadi"
    };

    const varaq3 = {
      muammo: "Odam band qilgan vaqtini o'tkazib yuboradi",
      kim: "Joyni band qilib, boshqa ishga ketadiganlar",
      yechim: "",
      olchov: "O'tkazib yuborish 12 tadan 3 taga tushadi"
    };

    function yozilmaganKataklar(varaq) {
      const natija = [];
      // NOMLAR bo'ylab yuring: qiymati bo'sh bo'lsa, nomni natija ro'yxatiga qo'shing
      return natija;
    }

    console.log(yozilmaganKataklar(varaq1));
    console.log(yozilmaganKataklar(varaq2));
    console.log(yozilmaganKataklar(varaq3));
    ```
  - Terminal: ⌨ TERMINAL · `$ node varaq.js ⏎`
  - Izoh: VS Code — kod yoziladigan dastur. Natijani ko'rish uchun uning terminal oynasida `node varaq.js` yozib, Enter bosasiz.
  - Tugmalar: ✅ VS Code'da yozdim — uch natija to'g'ri chiqdi → ✓ Bajarildi · (yakka rejimda) ✓ Bu kodni sinfda yozganman — davom etish →
  - Pastki tugma: Kodni yozing va tugmani bosing → Davom etish

## 11 · 4-savol (yakuniy) ✅  `[1773]`
- Eyebrow: Yakuniy tekshiruv
- Savol: **Varaqning «Kim qiynalyapti?» katagi bo'sh qoldi. Dasturchi endi nima qiladi?**
  - Ishni to'xtatib, kod yozmaydi
  - ✔ O'zi tanlagan odamga quradi
  - Boshqa uch katakni qayta yozadi
- To'g'ri: Bo'sh katak dasturchini to'xtatmaydi, u katakni o'zicha yozadi. Shuning uchun to'rttasi ham yoziladi.
- Xato izohlari:
  - (A) Ish to'xtamaydi: varaqsiz ham quriladi — faqat kim uchun qurilgani boshqa odam tanlaydi.
  - (C) Qolgan kataklar joyida turibdi — dasturchi bo'sh qolgan katakni o'zicha yozadi.
  - (umumiy) Bo'sh katakni dasturchi o'zicha yozadi — shuning uchun to'rttasi ham yoziladi.

## 12 · Mustahkamlash · 2 qadam  `[1667]`
- Eyebrow: Mustahkamlash · 2 qadam
- Sarlavha: **Qaysi katak eng qiyin bo'ldi?**
- Mentor: Nega aynan shu katak? Avval ovoz chiqarib o'zingizga ayting, so'ng bir qatorda yozing. *(jonlida: «…Avval sherigingizga ayting…»)*
- 1-qadam: 🗣 Ayting *(jonlida: Sherigingizga ayting)*
  - Yakka: ▶ 30 soniyani boshlash → «Hozir ayting» · ⏹ To'xtatish → ✓ Vaqt tugadi — aytib bo'ldingiz. Barakalla! · ↻ Yana 30 soniya
  - Jonli (juftlik): Har biringizga 30 soniyadan — avval A, keyin B. · ▶ 1 daqiqani boshlash → «Hozir A gapiradi · keyin — B navbati» → «oxirgi navbat» → ✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla! · ↻ Yana 1 daqiqa
- 2-qadam: ✍️ Yozing — placeholder: «... katagi qiyin bo'ldi, chunki ...»
- Yozgach: ✓ Endi siz qaysi katak ko'proq o'ylashni so'rashini bilasiz — keyingi varaqda o'sha katakdan boshlaysiz. · 🎯 Bugungi qoida: yozilgan qatorni hamma bir xil o'qiydi
- Tugma: Davom etish

## 13 · Natijalar (podium)  `[2365]`
- Eyebrow: Natijalar · Sarlavha: **Bugungi natijangiz** (jonlida: **Bugungi g'oliblarimiz**)
- Yakka: 🏅 Nishonlar · Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruh reytingi va 🥇🥈🥉 eng yaxshi uchtalik (podium) chiqadi.
- Jonli: Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin (N/4 to'g'ri) · 🏆 To'liq reyting
- Savol yorliqlari: 1 — Yozilgan qator · 2 — O'lchov katagi · 3 — Ko'rsatuv kuni · 4 — Yakuniy savol

## 14 · Takrorlash (kartochkalar)  `[1761]` (kartalar `[1749]`)
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Og'zaki aytilgan gap bilan yozilgan qatorning farqi nima? | Og'zaki gapni har kim o'zicha tushunadi — yozilgan qatorni hamma bir xil o'qiydi | — |
| PRD nima? | Kod yozishdan oldin to'ldiriladigan bitta varaq | — |
| PRD ning to'rt katagi qaysi? | Muammo · Kim · Yechim · O'lchov | — |
| «Muammo» katagida nima turadi? | Odamni nima qiynayotgani | — |
| «Kim» katagida nima turadi? | Qiynalayotgan odamlarning aniq guruhi | — |
| «Yechim» katagida nima turadi? | Nima qurilishi | — |
| «O'lchov» katagida nima turadi? | O'zgarishi kerak bo'lgan son | — |
| Bitta katak bo'sh qolsa nima bo'ladi? | Dasturchi uni o'zicha yozadi | — |
| Geyts va Allen tilni qachon yozgan? | Telefonda aytilgandan keyin, bir necha haftada | — |
| PRD ning inglizcha to'liq nomi qanday? | Product Requirements Document — mahsulot talablari varag'i | — |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · ✓ Bildim · N · Hammasini bilasiz! · 10/10 karta yodlandi · ↻ Qaytadan takrorlash · Davom etish

## 15 · Dars yakuni  `[2463]`
- Eyebrow: Dars yakuni · ✓ Dars tugadi
- Sarlavha: **Mini-do'koningiz uchun bir varaq to'ldirdingiz.** (yonida ball-halqa N/4)
- Bugungi asosiy fikr — Og'zaki gap har kimning boshida boshqacha turadi, yozilgan qator esa hammada bitta bo'lib qoladi.
- CodeStrike arena tugmasi: 12 SAVOL · SONIYA · 🏆 PODIUM (jonlida o'quvchiga: ⏳ Mentorni kuting)
- Endi siz bilasiz:
  - Og'zaki aytilgan gapni har kim o'zicha tushunadi — yozilgan qatorni hamma bir xil o'qiydi.
  - Kod yozishdan oldin to'ldiriladigan bitta varaq — PRD.
  - To'rt katak: muammo, kim, yechim, o'lchov.
  - Bo'sh qolgan katakni dasturchi o'zicha yozadi.
- 🏅 Nishonlaringiz — N/4
- Uyga vazifa (katta tugma): Uyga vazifa · Amaliy topshiriqni bajarish → (oyna, ✕ Yopish)
  - 📝 Uyda nima qilasiz? — Uyda varag'ingizni bir odamga o'qib berasiz — u qayta so'ragan katakni yangidan yozasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.
  - Variantlar: To'liq · ~20 daqiqa · Qisqa · ~10 daqiqa · (tanlanmaguncha) 👆 Avval variantni tanlang — topshiriq-karta shunga moslashadi.
  - 🗂 Topshiriq kartasi · TO'LIQ — Nechta: 4 ta katak · Muddat: keyingi darsgacha
    1. Varag'ingizni uydagi yoki sinfdagi bir odamga o'qib bering
    2. U qayta so'ragan katakni belgilang
    3. O'sha katakning qatorini yangidan yozing
  - 🗂 Topshiriq kartasi · QISQA — Nechta: 1 ta katak · Muddat: keyingi darsgacha
    1. O'lchov katagingizdagi sonni topib oling
    2. Uni qayerdan bilib olishingizni o'ylang
    3. Javobni bitta qatorda yozing
- Keyingi dars haqida matn yo'q.
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** 🙋 Right Question! — To'rt savolni murabbiydan o'zingiz so'radingiz (4-ekran) · 📄 One Pager! — To'rt katakni ham to'ldirdingiz (8-ekran) · 🔎 Sharp Eye! — Uch varaqni ham to'g'ri o'qib chiqdingiz (9-ekran) · ⌨️ Code Check! — Kod endi bo'sh katakni o'zi topadi (10-ekran)
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Yangi nishon: … · bosib davom eting

**Qayta tushuntirish oynalari (RECAPS, 4):**
1. (3-ekran) Yozilgan qator hammada bir xil: 🗣 Og'zaki gap va yozilgan qator — Og'zaki aytilgan gapni har kim o'zicha tushunadi — yozilgan qatorni hamma bir xil o'qiydi. · 📄 Ish qayerdan boshlanadi — Shuning uchun ish kod bilan emas, yozilgan qator bilan boshlanadi. · 🙋 Buni bugun ham sinab ko'ring — Og'zaki topshiriqni eshitgan odam uni bir qatorda yozib olsa, keyin qaytib o'qiydi. · Sinfga savol: Bugun kimdir sizga og'zaki topshiriq berdimi — uni qanday yozib olardingiz?
2. (5-ekran) O'lchov katagida son turadi: 📊 Katakning savoli — Bu katak bitta savolga javob beradi: «Qaysi son o'zgaradi?» · 🚫 Sanab bo'lmaydigan qator — Qulaylikni ham, mamnunlikni ham sanab bo'lmaydi — shuning uchun ular bu katakka tushmaydi. · 🔢 Sonni qayerdan olasiz — Son bugun qanchaligini bilsangiz, ertaga qancha bo'lganini ham ko'rasiz. · Sinfga savol: Bugun sanab ko'rsangiz bo'ladigan qaysi son bor?
3. (7-ekran) Avval aytilgan, keyin yozilgan: 📞 Ish bitta gapdan boshlandi — Geyts va Allen ishni bitta gapdan boshladi: nima qurilishi va qaysi kompyuter uchun ekani o'sha gapda aytilgan edi (1975). · 💾 Ko'rsatuv kuni — Hech qachon ko'rmagan kompyuter uchun yozilgan til birinchi urinishdayoq ishladi. · 🧭 Gap oldin turadi — Nima qurilishi oldindan aytilsa, ish boshlanmasdan turib ham aniq bo'ladi. · Sinfga savol: Sizning varag'ingizda nima qurilishi qaysi katakda turibdi?
4. (11-ekran) Bo'sh katakni dasturchi o'zicha yozadi: 📝 Bo'sh katak ishni to'xtatmaydi — U jimgina boshqa odam tomonidan to'ldiriladi — dasturchi o'zi tanlagan odamga quradi. · ✅ Shuning uchun to'rttasi ham yoziladi — To'rt katak to'lsa, qurilgan narsa siz o'ylagan narsa bo'lib chiqadi. · 🧑‍💻 Varaqni kim to'ldiradi — Buni kod emas, mahsulotni o'ylaydigan odam yozadi. · Sinfga savol: Qaysi katagingiz eng bo'sh turibdi — nega?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Sinfdoshingizga loyiha g'oyangizni og'zaki aytdingiz. Nima xavfi bor? ✔ U g'oyani o'zicha tushunib, boshqa narsa qiladi · U g'oyani eshitib, darrov yoqtirib qoladi · U g'oyani eslab qolishga ko'p vaqt sarflaydi · U g'oyani qog'ozga yozib berishni so'raydi
2. Dasturchi «menga PRD bering» dedi. U nimani so'rayapti? Ilovaning tayyor kodini · Ishning narxi yozilgan qog'ozni · Ilova ekranlarining rasmini · ✔ To'rt katak to'ldirilgan varaqni
3. «Odam qaysi kuni yozilganini eslay olmaydi» — qaysi katakka tushadi? Kim katagiga · Yechim katagiga · ✔ Muammo katagiga · O'lchov katagiga
4. «Kim qiynalyapti?» katagida qaysi qator to'g'ri yozilgan? Ilovadan foydalanadigan hamma odam · ✔ Ertalabki mashg'ulotga qatnaydiganlar · Ilovani to'lab beradigan tashkilot · Kodni yozadigan dasturchilar guruhi
5. Yechim katagiga qaysi qator tushadi? Zamonaviy va tez ishlaydigan ilova · ✔ Qatnash kunlarini belgilaydigan sahifa · Ikki hafta ichida tugatiladigan ish · JavaScript tilida yoziladigan kod
6. O'lchov katagi nima uchun kerak? ✔ Ish natija berganini sanab ko'rsatadi · Ilova narxini oldindan hisoblab beradi · Dasturchilar sonini aniqlab beradi · Ish necha kun davom etishini aytadi
7. O'lchov katagi to'ldirilmasa, nima yo'qoladi? Ishni boshlash imkoni yo'qoladi · Varaqning boshqa uch katagi · ✔ Ish natija berdimi degan javob · Dasturchiga to'lanadigan haq
8. Varaq to'ldirilgandan keyin uch dasturchi nima qurdi? Har biri o'zicha boshqa narsa qurdi · Uchalasi ham ishni boshlay olmadi · Ikkitasi qurdi, uchinchisi qura olmadi · ✔ Uchalasi ham bir xil ekran qurdi
9. Geyts va Allen ishni qanday tartibda qildi? ✔ Avval nima qurishini aytdi, keyin yozdi · Avval tilni yozdi, keyin qo'ng'iroq qildi · Avval Altairni sotib oldi, keyin yozdi · Avval sinovdan o'tkazdi, keyin va'da berdi
10. Til hali yozilmagan payt ular nima qildi? Altairni sotib olib, uyga olib keldi · Kompaniyaga tilni pochtada yubordi · ✔ Kompaniyaga qo'ng'iroq qilib gapirdi · Jurnalga maqola yozib chiqardi
11. Varaq qachon tayyor bo'ladi? Kamida ikkita katagi yozilganda · ✔ Har katakda savolga aniq javob bo'lganda · Kod bilan birga topshirilganda · Uzun gaplar bilan to'ldirilganda
12. Varaq to'ldirilmasa, qaror kimning qo'liga o'tadi? Ilovani ochgan odamning · Basseyn murabbiysining · Sinov o'tkazadigan odamning · ✔ Kod yozadigan dasturchining

*(Har ekrandagi «🧑‍🏫 Mentorga eslatma» — faqat mentor ekranida ko'rinadi, o'quvchi ko'rmaydi; bu MD'ga kiritilmadi.)*

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **Gapni kim aytgani ikki xil** — 0-ekranda «Joy band qiladigan ilova kerak», **dedingiz** (o'quvchi aytadi); 4-ekranda xuddi shu gapni **Basseyn murabbiysi** aytadi va savollar ham murabbiyga beriladi.
- **Sub'ekt chalkash:** «Buni **kod emas**, mahsulotni o'ylaydigan odam yozadi» — 6-ekran 7-bosqich va RECAPS 4 · kod hech narsa yozmaydi (lug'atdagi «hikoyalarni kod yozib beradi» sinfi).
- **Tushunarsiz jumla:** 11-ekran A-xato izohi «varaqsiz ham quriladi — faqat kim uchun **qurilgani** boshqa odam tanlaydi» (grammatika buzilgan; «kim uchun qurilishini … tanlaydi» bo'lishi kerak). RECAPS 4: «U jimgina boshqa odam tomonidan to'ldiriladi» — majhul, og'ir.
- **Inglizcha izohsiz:** nishon nomlari «Right Question! · One Pager! · Sharp Eye! · Code Check!» · 10-ekran «⌨ TERMINAL», `node`, «Koding» eyebrow'i.
- **«sessiya»** — 13-ekran «Bu sessiyaga hali hech kim qo'shilmagan» · lug'at: sessiya → dars.
- **Kantselyarit-oilasi:** 12-ekran eyebrow «Mustahkamlash» (lug'at: «mustahkamlanadi» → «esida mahkam qoladi»).
- **Bir narsaning ikki nomi:** «bitta varaq» (1, 4-ekran) ↔ «bir varaq» (8, 15-ekran, 10-kod izohi); «javobsiz katak» (9) ↔ «bo'sh katak» (10, 11) — farqi 9-ekranda aytilmaydi, faqat kod izohida.
- **Katak savoli nomlanishi:** 8-ekranda Muammo placeholder'i «odamni nima qiynayapti?», boshqa hamma joyda «Nima qiynayapti?»; 7-savolda (3-test) to'g'ri javob eng uzun va yagona «aniq» so'zli variant — biroz «sotilib» qoladi.
