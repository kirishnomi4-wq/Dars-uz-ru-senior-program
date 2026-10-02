# 6-Modul (LMS: 8-Modul) · 6-dars «Ilova o'zi qaror qilsa, kimga tegadi?» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/PmLesson23.jsx` · 16 ekran · faqat o'zbekcha matn
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi
- **Hook (0-ekran):** «Ilova so'ramay qaror qilsa, sizga qanday tuyulgan?» — o'quvchi ikki tanlovdan birini bosadi (qulay / yoqmagan); ikkalasida ham bir xil xulosa ochiladi: farq bitta savolda — «shu qaror kimga tegadi».
- **Markaziy mexanika (4-ekran, «oqibat-ko'zgusi»):** do'kon ilovasining uch ishi (mijozga javob · mahsulot tavsifi · tushunarsiz manzilli buyurtma); har birida «🤖 AI o'zi qiladi» / «🙋 odam» tugmasi, o'ngda shu qaror tegadigan odam 🔴/⚪ bilan chiqadi; so'ng uch ishdan bittasini odamga qaytaradi.
- **Asosiy tushuncha:** chegara — ilova qaysi ishni o'zi qilmasligini oldindan hal qilgan qaror; u ilovani to'xtatmaydi, bitta ishni odamdan o'tkazadi. Olam: mini-do'kon + do'konning boti.
- **Yakun:** o'quvchi mini-do'koniga «…maydi» shaklida 3 chegara + har biriga bitta aniq odam yozadi, bot qarorlarini odamlarga qo'shadi, `chegaraKerak()` funksiyasini yozadi; yakunda CodeStrike arena + uyga vazifa (yana bitta chegara).

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — so'ramay qilingan ish | hook | qulay / yoqmagan — bittasini tanlaydi | — |
| 1 | Maqsad | qoida | 3 ta «qaror → odam» qatori o'zi yozilib chiqadi | — |
| 2 | Ikki karta | tushuncha | «Ilova so'raydi» / «Ilova o'zi qiladi» kartalarini ochadi → xulosa | — |
| 3 | 1-savol | test | uch do'kondan qaysi birida chegara bor | ✅ |
| 4 | Qaror va odam (oqibat-ko'zgusi) | markaziy | 3 ishda «AI o'zi qiladi» → kim jabr ko'radi → bittasini odamga qaytaradi | ishtirok |
| 5 | 2-savol | test | chegara birinchi navbatda qaysi ishga | ✅ |
| 6 | Haqiqiy holat — bitta qator | case | AI-ilova pastidagi qatorni bashorat qiladi (5 bosqich) | — |
| 7 | 3-savol | test | chegara qaysi ikki qadam orasida | ✅ |
| 8 | Uch chegara | amaliyot | o'z mini-do'koniga 3 chegara + odam yozadi | ishtirok |
| 9 | Do'konning boti | amaliyot | 4 bot qarorini jabr ko'radigan odamga qo'shadi | ishtirok |
| 10 | Koding | koding | darvoza-savol → kompilyatorda `chegaraKerak()` yozadi | ishtirok |
| 11 | 4-savol (yakuniy) | test | hamma ishga chegara qo'yilsa nima bo'ladi | ✅ (final) |
| 12 | Mustahkamlash | refleksiya | 30 s ovoz chiqarib aytadi + bir qator yozadi | — |
| 13 | Natijalar | podium | natija / jonli reyting | — |
| 14 | Takrorlash | kartochkalar | 10 ta kartochka | — |
| 15 | Yakun | xulosa | 4 xulosa + arena + nishonlar + uyga vazifa | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 4 ta (3/5/7/11-ekranlar); nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
chegara · qaror · kimga tegadi · jabr ko'radi · ilova so'raydi / ilova o'zi qiladi · AI yozadi, odam o'qib chiqadi · do'kon egasi · mini-do'kon · do'konning boti · bitta aniq odam (guruh emas) · «…maydi» shakli · agent · vakolat chegarasi · mahsulotni o'ylaydigan odam

---

## 0 · Kirish — so'ramay qilingan ish  `[650]`
- Eyebrow: Kirish · so'ramay qilingan ish
- Sarlavha: **Ilova so'ramay qaror qilsa, sizga qanday tuyulgan?**
- Mentor: Ba'zan ilova o'zi tanlab qo'yadi, o'zi xabar yuboradi, o'zi obunani uzaytiradi.
- Tanlovlar:
  - 🙂 Qulay bo'lgan — vaqtimni tejadi
  - 😕 Yoqmagan — o'zim tanlamoqchi edim
- Javobdan keyin (ikkalasida bir xil): Ikkalasi ham bo'ladi: ba'zi ishni ilova o'zi qilsa qulay, ba'zisini odam o'zi qilmoqchi. Farq bitta savolda: **shu qaror kimga tegadi**. Bugun shu savolni quradigan mini-do'koningizga berasiz.
- Jonli darsda: ovoz-diagrammasi (har variant foizi) · «Jonli natija»
- Tugma: Bittasini tanlang → Davom etish
- Mentor-eslatma (faqat mentor): Ovozlar bo'linadi — ikkala tomonning ham hayotiy dalili bor. Shu bo'linishning o'zi darsga eshik: qulaylik ham rost, so'ramaslik ham rost. Javobni oldindan aytmang.

## 1 · Maqsad  `[727]`
- Eyebrow: Maqsad
- Sarlavha: **Bugun mini-do'koningiz uchun uchta qaror yozasiz.**
- Mentor: Har qator — ilova o'zi qilmaydigan ish va bu qaror tegadigan odam.
- Blok «🛒 Mini-do'kon» (qatorlar bittalab yozilib chiqadi, har biri ✅):
  1. Narxni o'zi o'zgartirmaydi → Eski narxni ko'rgan mijoz
  2. Sharhni o'zi o'chirmaydi → Sharh yozgan mijoz
  3. Buyurtmani o'zi to'lovga yubormaydi → Hali o'ylab turgan mijoz
- Tugma: Boshlaymiz →
- Mentor-eslatma: Ro'yxat yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.

## 2 · Ikki karta  `[755]`
- Eyebrow: Muhokama · ikki karta
- Sarlavha: **Ilova o'zi qaror qilsa, kimga tegadi?**
- Mentor: Ilovaning har ishi oxirida bitta odam turadi. Ikki kartani bosib solishtiring.
- Kartalar (yopiq holatda «· · ·»):
  - 🙋 **Ilova so'raydi** — Avval odamdan so'raydi, keyin qiladi — xato bo'lsa odam to'xtatadi
  - 🤖 **Ilova o'zi qiladi** — So'ramay qiladi — tez bo'ladi, lekin xato bo'lsa hech kim to'xtatmaydi
- Ikkalasi ochilgach — xulosa:
  - **Ilova qaysi ishni o'zi qilmasligini oldindan hal qilasiz — shu qaror chegara.**
  - Agent — o'rningizga ish qiladigan dastur. O'tgan darsda unga **bitta joyda** vakolat chegarasi qo'ygan edingiz; bugun butun mini-do'koningizga chegara qo'yasiz.
  - Tugma: ◂ Kartalarga qaytish
- Tugma: 👆 Yana N kartani oching → Davom etish

## 3 · 1-savol ✅  `[811]`
- Eyebrow: Tekshiruv · qaysi do'konda
- Savol: **Uchala do'konda ham mijozga AI javob yozadi. Qaysi birida chegara bor?**
  - Javobni AI yozib, o'zi yuboradigan do'konda
  - ✔ Javobni AI yozib, egasi yuboradigan do'konda
  - Javobni AI ikki marta yozadigan do'konda
- To'g'ri: Chegara AI ni to'xtatmaydi, uni odamdan o'tkazadi.
- Xato izohlari:
  - (1-variant) Bu yerda javob hech kimdan o'tmaydi: AI yozdi va o'zi yubordi.
  - (3-variant) Ikki marta yozilgan javob ham AI niki — uni o'qib chiqadigan odam yo'q.
  - (umumiy) Chegara AI ni to'xtatmaydi, uni odamdan o'tkazadi.
- Tugma: Javobni tanlang

## 4 · Qaror va odam (oqibat-ko'zgusi, markaziy)  `[855]`
- Eyebrow: Sinov · qaror va odam
- Sarlavha: **Har ishda «AI o'zi qiladi» tugmasini bosing va kimga tegishini ko'ring.**
- Mentor (boshida): Ilovaning uch ishi, har birida ikki tanlov. Har tanlovda shu qaror tegadigan odam chiqadi.
- Ishlar (har birida ikki tugma: 🤖 / 🙋):
  - 💬 **Mijozning savoliga javob** — 🤖 AI o'zi yozib yuboradi · 🙋 Javobni do'kon egasi o'qib chiqadi
  - ✍️ **Mahsulot tavsifi (sayt sahifasidagi matn)** — 🤖 AI yozib, saytga o'zi chiqaradi · 🙋 Do'kon egasi o'qib, keyin chiqaradi
  - 🚫 **Tushunarsiz manzilli buyurtma** — 🤖 Ilova o'zi bekor qiladi · 🙋 Ilova mijozdan so'raydi
- O'ng panel izohi: 🔴 — bu qaror shu odamning kunini buzadi: u jabr ko'radi · ⚪ — bu qaror uning kunini buzmaydi
- Bo'sh holat: Ishlardan birida tugmani bosing — bu yerda odam paydo bo'ladi
- Odam-kartalari (🔴 AI tanlansa / ⚪ odam tanlansa):
  - Javob → «Zaryadlagich qo'shib berasizmi?» deb so'ragan mijoz · 🔴 AI «qo'shib beramiz» deb yozdi; quti ochilganda zaryadlagich yo'q edi · ⚪ Do'kon egasi o'qib chiqdi — xato mijozga yetib bormadi
  - Tavsif → Tavsifni o'qib olgan mijoz · 🔴 Tavsifda «suvga chidaydi» deb turgan edi; quloqchin yomg'irda ishlamay qoldi · ⚪ Do'kon egasi o'qib chiqdi — xato mijozga yetib bormadi
  - Buyurtma → Manzilini qisqa yozgan mijoz · 🔴 Buyurtmasi bekor bo'ldi; u kechgacha kutib o'tirdi · ⚪ Ilova so'radi — mijoz manzilini to'g'irladi
- Uchalasi «odam» qilinsa: Uchala ishni ham do'kon egasi o'qisa, har buyurtma uni kutib turadi — do'kon to'xtab qoladi. Faqat bittasi odamda qolsin, qolgan ikkitasini AI qilaversin.
- 2-bosqich savoli: Hamma ishni odam o'qib chiqa olmaydi: uch ishdan faqat **bittasi** odamdan o'tadi. Qay birini odamga qaytarasiz? · (tugmalar = uch ish nomi)
- Tanlovga javob:
  - Javob: ✅ Endi xato javob mijozga yetib bormaydi. Qolgan ikki ishni AI o'zi qilaveradi — do'kon sekinlashmadi.
  - Tavsif: Bu ham chegara. Lekin tavsif bir marta yoziladi, mijoz savoli esa har kuni keladi — xato javob ham har kuni takrorlanadi.
  - Buyurtma: Bu ham chegara. Lekin bekor qilishdan oldin ilova mijozdan so'raydi — u yerda odam bor. Xato javobni esa hech kim o'qimaydi.
  - Har birida: ✅ Buni o'zingiz topdingiz: chegara ilovani to'xtatmaydi — bitta ishni odamga qaytaradi · ↻ Boshqasini tanlash
- Yordam (40 s dan keyin): 💡 Yana bir kartada «AI o'zi qiladi» tugmasini bosing.
- Qutqaruv (115 s dan keyin): Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq.
- Tugma: ① Yana N ishda «AI o'zi qiladi» tugmasini bosing → ② Bitta ishni odamga qaytaring → Davom etish
- Mentor-eslatma: Bolalar uchala tugmani ham «odam o'qiydi» holatiga o'tkazib qo'yadi — bu eng foydali xato. Ekranning o'zi to'xtatadi; siz so'rang: har buyurtma do'kon egasini kutib tursa, do'kon ishlaydimi? Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 5 · 2-savol ✅  `[955]`
- Eyebrow: Tekshiruv · chegara qayerga
- Savol: **Chegara birinchi navbatda qaysi ishga qo'yiladi?**
  - Ilova mijozdan so'rab qiladigan ishga
  - Do'kon egasi o'zi qo'lda qiladigan ishga
  - ✔ Ilova o'zi qilib qo'yadigan ishga
- To'g'ri: So'ralgan ishni odam to'xtata oladi; ilova o'zi qiladigan ishni esa hech kim to'xtatmaydi.
- Xato izohlari:
  - (1) So'rab qilingan ishda odam allaqachon turibdi — u xatoni ko'rib to'xtatadi.
  - (2) Qo'lda qilinadigan ishni odam boshidan oxirigacha o'zi bajaradi.
  - (umumiy) Chegara ilova o'zi qilib qo'yadigan ishga qo'yiladi.

## 6 · Haqiqiy holat — bitta qator (case)  `[992]`
- Eyebrow: 📱 Haqiqiy holat
- Sarlavha: **Telefoningizda har kuni ko'radigan bitta qator**
- Bosqichlar (hisoblagich «📱 Haqiqiy holat · N / 5»):
  1. 💬 **Telefoningizda AI bilan yozishadigan ilova bor** — Savol yozasiz — javob bir necha soniyada keladi.
  2. 📄 **Ekranning pastida kichkina bitta qator turadi** — Kulrang, mayda harflar bilan yozilgan — uni bosib ham bo'lmaydi. Qaysi savol yozsangiz ham o'sha qator yo'qolmaydi.
  3. 🎲 Avval o'zingiz belgilab ko'ring · **Sizningcha, o'sha qator u yerda nima uchun turadi?**
     - 🏷 Ilovani yozganlarning nomi ko'rinib tursin
     - 🔢 Javob necha so'z bo'lgani ko'rinib tursin
     - ✔ 🔎 O'qigan odam javobni tekshirib ko'rsin
     - Topsa: 🎯 Topdingiz! O'qigan odam javobni tekshirib ko'rsin
     - Topmasa: Adashdingiz — asl javob: o'qigan odam javobni tekshirib ko'rsin
  4. ✅ **O'sha qatorda nima yozilgan** — Taxminan shunday: «AI xato qilishi mumkin — muhim narsani tekshiring». Javobni AI yozdi, javobga ishonadigan esa **odam**.
  5. (ko'prik) Demak AI javob yozadi, tekshirishni odam qiladi — buni ilovaning o'zi ochiq yozib qo'ygan. Quradigan mini-do'koningizda ham shu savol turadi: qaysi ishni AI o'zi qilaversin, qaysi biri odamdan o'tsin. **Bu qarorni ilova emas, mahsulotni o'ylaydigan odam qiladi** — ya'ni siz.
- Tugma: Keyingi bosqich (N/5) · Avval o'zingiz belgilang → Davom etish · nuqta ustida: Avval shu bosqichni tugating
- Mentor-eslatma: Hozir telefonini ochib ko'rmoqchi bo'lganlar bo'ladi — ruxsat bering, bu darsning eng foydali o'ttiz soniyasi.

## 7 · 3-savol ✅  `[1067]`
- Eyebrow: Tekshiruv · chegara qaysi oraliqda
- Savol: **✍️ AI mahsulot tavsifini yozdi. Chegara qaysi ikki qadam orasiga qo'yiladi?**
  - ✔ Yozilgandan keyin, saytga chiqishdan oldin
  - Saytga chiqqandan keyin, mijoz o'qishidan oldin
  - Mijoz o'qigandan keyin, buyurtma berishdan oldin
- To'g'ri: AI yozadi, odam o'qib chiqadi. Xato tavsif saytga chiqmasdan turib tutiladi.
- Xato izohlari:
  - (2) Saytga chiqqan tavsifni mijoz istalgan payt ochadi — tekshirishga ulgurilmaydi.
  - (3) Mijoz o'qib bo'lgan bo'lsa, xato tavsif unga allaqachon yetib borgan.
  - (umumiy) AI yozadi, odam o'qib chiqadi — chegara shu ikkovining orasida turadi.

## 8 · Uch chegara (mustaqil ish)  `[1105]`
- Eyebrow: Mustaqil ish · uch chegara
- Sarlavha: **Mini-do'koningizga uchta chegara yozing.**
- (agar 2-darsdagi varaq saqlangan bo'lsa) 📄 O'z varag'ingizdan: {kim} uchun — {yechim} · Bu — shu modulda quradigan mini-do'koningiz. Unga uchta chegara yozasiz.
- Mentor: Har ishga bitta savol bering: ilova buni o'zi qilsa, kim jabr ko'radi?
- Qadamlar: 1-chegara · 2-chegara · 3-chegara
- Yozuv joylari: «Ilova qaysi ishni o'zi qilmaydi?» · «Bu qaror kimga tegadi?» · tugma Saqlash → / ✓ Yangilash
- Jonli javob-qatorlari:
  - 🤔 Juda qisqa qoldi — ilova aynan qaysi ishni o'zi qilmasligini yozing.
  - 🤔 Bu ish yuqorida allaqachon yozilgan — boshqa ishni oling.
  - 🤔 Chegara — ilova nima **qilmasligi**. «…maydi» shaklida yozing.
  - 🤔 Bu hali bitta odam emas. Qaysi mijoz? O'sha paytda u nima qilayotgan edi? (faqat «hamma / mijozlar / odamlar…» yozilsa)
  - 🤔 Uchala qator bitta odamga tegyapti — do'konda boshqa odam ham bor.
  - ✅ Ish ham, odam ham yozildi.
- 🎯 Topshiriq: **Har chegarada bitta aniq odam** · belgilar: Uchta chegara yozilgan · «…maydi» bilan tugaydi · Bitta aniq odam
- 💡 Yordam: Ikki savol bering: ilova buni so'ramay qilsa nima bo'ladi? Bu bitta odamning kuniga qanday tushadi?
- ⭐ Qo'shimcha: Ilova o'zi qilaversa ham bo'ladigan bitta ishni toping. Nega unga chegara kerak emas — bir qatorda yozing. · yozuv joyi: «Qaysi ish va nega chegarasiz qolaveradi?»
- Uchtasi yozilgach: 🛒 Mini-do'koningizning uch chegarasi (ro'yxat, ✎ Tahrirlash) · ✅ Uch chegarangiz yozildi — har birida jabr ko'radigan bitta odam turibdi
- Tugma: ① Birinchi chegarani yozing va saqlang → ② Yana N chegara yozing → Davom etish
- Mentor-eslatma: «Ilova hech qanday xato qilmasin» degan qatorlar chiqadi — bu eng foydali xato. Javob-qatori uni tutadi, siz so'rang: bu qaysi ISH haqida? Baholash mezoni bitta: qator «…maydi» bilan tugaydimi va yonida bitta aniq odam turibdimi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 9 · Do'konning boti (juftlash)  `[1264]`
- Eyebrow: Tekshiruv · do'konning boti
- Sarlavha: **Har qarorni jabr ko'radigan odamga qo'shing.**
- Mentor: Uch chegarangiz tayyor — endi shu savolni do'konning botiga beramiz. Avval bot o'zi qiladigan ishni, so'ng shu qaror tegadigan odamni bosing.
- Qarorlar (chap) → to'g'ri odam — sabab (juftlangach chiqadi):
  - 🌙 Buyurtma tasdig'ini kechasi soat ikkida yuboradi → Telefonini yostiq yonida qoldiradigan mijoz — Xabar ertalab ham yetardi — uyqusi bo'lindi
  - 🔁 Javob kelmasa, har o'n daqiqada qayta yozadi → Dars paytida telefonini o'chirib qo'yadigan mijoz — Darsdan chiqqanda telefoni bir xil xabarlarga to'lib ketgan edi
  - 🧹 Bir hafta javob bermagan buyurtmani o'zi bekor qiladi → Kasal bo'lib yotib qolgan mijoz — Tuzalib qaraganda buyurtmasi bekor bo'lgan edi
  - 🏷 Chegirma xabarini faqat ko'p buyurtma berganlarga yuboradi → Birinchi marta buyurtma bergan mijoz — Chegirma bo'lganini umuman bilmadi
- Odamlar (o'ng, aralash tartibda): Dars paytida telefonini o'chirib qo'yadigan mijoz · Birinchi marta buyurtma bergan mijoz · Telefonini yostiq yonida qoldiradigan mijoz · Kasal bo'lib yotib qolgan mijoz
- Xabarlar:
  - Qaror tanlanmay odam bosilsa: 👆 Avval bitta qarorni bosing.
  - Xato juftlik: 🤔 Bu odam ham bot bilan uchrashadi — lekin boshqa paytda. Qaysi qaror aynan shu paytga tushadi?
  - 💡 Yordam (birinchi xatodan keyin): Ikki savol bering: bu odam qaysi paytda telefoniga qaray oladi? / Bot undan nimani kutyapti?
  - 4-juftlik o'zi qo'shiladi (uchtasi topilgach)
  - Yakun: ✅ To'rtala qarorni ham bot o'zi qildi — to'rtala odam ham buni so'ramagan edi
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Mentor rejimi: 🙈 Javoblar «Natijani ochish»da ko'rinadi — proyektorda oldindan ochilmaydi. · Natijani ochish
- Tugma: Yana N juftlikni tuzing → Davom etish
- Mentor-eslatma: Eng ko'p adashiladigan joy — ikkinchi va uchinchi juftlik: ikkalasida ham mijoz botga javob bermaydi. Farq nega javob bermaganida: biri darsda, biri kasal. Ish-tartibi: juftlikda ishlating — har o'quvchi sherigining uch chegarasini o'qib, har biriga «bu qaror kimga tegadi?» deb so'raydi; odam nomlanmasa, qator qayta yoziladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 10 · Koding  `[1446]`
- Eyebrow: Koding · 🛠 kod oynasi
- Sarlavha: **Chegara kerak ishlarni topadigan kod yozamiz.**
- 1-bosqich — Mentor: Kodda ish ikki shartga tekshiriladi. Avval bitta savolga javob bering.
  - 🔎 **Vakolat chegarasi qo'yilgan agent ishni bajarishdan oldin nima qiladi?**
    - ✔ 🙋 Odamdan tasdiq so'raydi
    - 🔁 Ishni ikki marta bajaradi
    - 📓 Xabarni jurnalga yozib qo'yadi
  - Xato bosilsa: 🤔 Bu ish boshlangandan keyin bo'ladi. Agent ishni boshlashdan oldin kimga murojaat qiladi?
- 2-bosqich — Mentor: Hozirgina har qarorni odamiga qo'shdingiz — endi o'sha ishni kod bajaradi. Bot o'zi qiladimi — endi **oziQiladi** qiymati, qaror tegadigan odam esa **tegadi** qiymati.
  - ✓ Belgilandi: 🙋 Odamdan tasdiq so'raydi
  - **Kod nima qilsin:** 1) Do'kon ro'yxatidan `javobYozish` qaytdi · 2) Do'kon ro'yxatidan `buyurtmaBekor` qaytdi, `hisobotYigish` esa qaytmadi · 3) Bot ro'yxatidan faqat `kechasiXabar` qaytdi
  - 💡 Yordam: Bitta ishdan boshlang: `javobYozish` ni ilova o'zi qiladimi? Bu ish odamga tegadimi? Ikkalasi ham ha bo'lsa — nomi ro'yxatga tushadi. / ⭐ Qo'shimcha: `narxOzgartirish` ishining `oziQiladi` qiymatini `true` ga o'zgartiring va do'kon ro'yxati endi nima berishini ko'ring.
  - 🛒 Ikki ro'yxat — bitta funksiya · Kod yoziladigan oyna: chapda kod, o'ngda natija. · 🛠 Kompilyatorni ochish / ↻ Kompilyatorni qayta ochish · Bajarildi — xohlasangiz kodni yana sayqallang
  - Yakka rejimda: ✓ Bu kodni sinfda yozganman →
  - Bajarilgach: ✅ Uchala shart bajarildi — kod endi chegara kerak ishlarni o'zi topadi
- Kompilyator: sarlavha «Chegara kerak ishlarni toping» · Eyebrow «Koding · chegara kerak ishlar»
  - Topshiriq: Funksiya ilova **o'zi qiladigan** va **odamga tegadigan** ishlarning nomini qaytarsin. Pastdagi `console.log` ikki ro'yxatning natijasini ko'rsatadi.
  - Boshlang'ich kod (`app.js`):
  ```js
  // Har ish uchun ikki qiymat: ilova buni o'zi qiladimi va bu ish kimga tegadi
  // tegadi: "" — bu ish hech kimga tegmaydi (do'konning ichki ishi)
  const dokonIshlari = [
    { nom: "javobYozish",     oziQiladi: true,  tegadi: "mijoz" },
    { nom: "narxOzgartirish", oziQiladi: false, tegadi: "mijoz" },
    { nom: "buyurtmaBekor",   oziQiladi: true,  tegadi: "mijoz" },
    { nom: "hisobotYigish",   oziQiladi: true,  tegadi: "" }
  ];

  const botIshlari = [
    { nom: "kechasiXabar",  oziQiladi: true,  tegadi: "mijoz" },
    { nom: "adminXabar",    oziQiladi: true,  tegadi: "" },
    { nom: "chegirmaXabar", oziQiladi: false, tegadi: "mijoz" }
  ];

  function chegaraKerak(ishlar) {
    // Ilova o'zi qiladigan va odamga tegadigan ishlarning nomini qaytaring
    return [];   // <- bu joyni siz to'ldirasiz
  }

  console.log(chegaraKerak(dokonIshlari));
  console.log(chegaraKerak(botIshlari));
  ```
  - Placeholder: // ikki shartga ham mos ishlarning nomini yig'ib qaytaring
  - Tekshiruv xabarlari (shart bajarilmasa):
    1. javobYozish ni ilova o'zi qiladi va u mijozga tegadi — nomi ro'yxatga tushsin
    2. hisobotYigish hech kimga tegmaydi (tegadi bo'sh) — u ro'yxatga tushmasin
    3. Bot ro'yxatida ikki shartga ham mos ish bitta
- Tugma: ① Javobni belgilang → ② Kodni yozing → Davom etish
- Mentor-eslatma: Kod — oqibat ekranidagi ishning to'g'ridan-to'g'ri tarjimasi, shuni ochiq ayting: qo'lda bosgan tugma endi obyektdagi ikki qiymat. Kod shu oynada yoziladi — 10 daqiqa yetadi; ulgurmagan o'quvchi uyga qisqa variantni oladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 11 · 4-savol ✅ (yakuniy)  `[1718]`
- Eyebrow: Yakuniy tekshiruv
- Savol: **Do'kon egasi hamma ishga chegara qo'ydi. Endi nima bo'ladi?**
  - Xatolar kamayadi, ish tezligi esa o'zgarmaydi
  - ✔ Har ish do'kon egasi o'qiguncha turib qoladi
  - Do'kon egasi faqat eng muhim ishlarni o'qiydi
- To'g'ri: Do'kon to'xtab qoladi. Shuning uchun chegara faqat odamga eng og'ir tegadigan ishga qo'yiladi.
- Xato izohlari:
  - (1) Xatolar kamayadi, lekin tezlik tushadi: har ish do'kon egasini kutadi.
  - (3) Chegara hamma ishga qo'yilgan — demak do'kon egasi eng muhimini emas, har bir ishni o'qiydi.
  - (umumiy) Hamma ishga chegara qo'ysangiz, har ish do'kon egasi o'qiguncha turib qoladi.

## 12 · Mustahkamlash  `[1619]`
- Eyebrow: Mustahkamlash · 2 qadam
- Sarlavha: **Uch chegarangizni yoddan ayta olasizmi?**
- Mentor: Ekranga qaramasdan javob bering: ilova qaysi ishni o'zi qilmaydi va bu kimga tegadi?
- 1-qadam: 🗣 Ovoz chiqarib ayting: qaysi ish va qaysi odam (jonlida: Sherigingizga ayting: qaysi ish va qaysi odam)
  - Yakka: 30 soniya — ovoz chiqarib o'zingizga ayting. · ▶ 30 soniyani boshlash · Hozir ovoz chiqarib ayting · ✓ Vaqt tugadi — aytib bo'ldingiz. Barakalla! · ↻ Yana 30 soniya
  - Juftlikda: Har biringizga 30 soniyadan — avval A, keyin B. · ▶ 1 daqiqani boshlash · Hozir A gapiradi · keyin — B navbati · oxirgi navbat · ✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla! · ↻ Yana 1 daqiqa · ⏹ To'xtatish
- 2-qadam: ✍️ Endi bir qator yozing · yozuv joyi: «Ilova ... ni o'zi qilmaydi, bu qaror ... ga tegadi» · ✓ Yozildi!
- Tugma: Davom etish
- Mentor-eslatma: Uchdan biri odamni nomlay olmasa — oqibat ekranini qayta oching va o'ng tomondagi kartani birga o'qing.

## 13 · Natijalar (podium)  `[2307]`
- Eyebrow: Natijalar · Sarlavha: **Bugungi natijangiz** (jonlida: **Bugungi g'oliblarimiz**)
- Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruh reytingi va 🥇🥈🥉 eng yaxshi uchtalik (podium) chiqadi. · Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · 🏆 To'liq reyting · 🏅 Nishonlar
- Savol yorliqlari: 1 — Qaysi do'konda chegara · 2 — Chegara qaysi ishga · 3 — Chegaraning joyi · 4 — Yakuniy savol

## 14 · Takrorlash (kartochkalar)  `[1706]`
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Chegara nima? | Ilova qaysi ishni o'zi qilmasligini oldindan hal qilasiz — shu qaror | — |
| Chegara birinchi navbatda qaysi ishga qo'yiladi? | Ilova o'zi qilib qo'yadigan ishga | — |
| Chegara yozishdan oldin qaysi savol beriladi? | Bu qaror kimga tegadi? | — |
| Jabr ko'radigan odam qanday yoziladi? | Bitta aniq odam bo'lib — «hamma» deb emas | — |
| AI yozgan tavsif saytga chiqishidan oldin nima bo'ladi? | Do'kon egasi o'qib chiqadi | — |
| Hamma ishga chegara qo'yilsa nima bo'ladi? | Har ish do'kon egasi o'qiguncha turib qoladi — do'kon to'xtaydi | — |
| Bot tasdiqni kechasi yuborsa, kim jabr ko'radi? | Telefonini yostiq yonida qoldiradigan mijoz | — |
| AI javobni mijozga o'zi yozib yuborsa, kim jabr ko'radi? | «Zaryadlagich qo'shib berasizmi?» deb so'ragan mijoz | — |
| Ilovaning qarorini kim qiladi? | Mahsulotni o'ylaydigan odam | — |
| Agentga qo'yilgan chegara nima deb ataladi? | Vakolat chegarasi — inglizcha kitoblarda «guardrails» deb yoziladi | — |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · 🎉 Hammasini bilasiz! · N/N karta yodlandi · ↻ Qaytadan takrorlash · Davom etish

## 15 · Yakun  `[2404]`
- Eyebrow: Dars yakuni · ✓ Dars tugadi
- Sarlavha: **Uchta chegarangiz yozildi.** (+ ball-halqasi)
- CodeStrike arena tugmasi (jonlida: ⏳ Mentorni kuting)
- Endi siz bilasiz:
  - Ilova qaysi ishni o'zi qilmasligini oldindan hal qilasiz — shu qaror chegara.
  - Chegara ilova o'zi qilib qo'yadigan ishga qo'yiladi.
  - Har qaror bitta aniq odamga tegadi — chegara o'sha odamni himoya qiladi.
  - Chegarani ilova emas, mahsulotni o'ylaydigan odam qo'yadi — ya'ni siz.
- 🏅 Nishonlaringiz — N/4
- Uyga vazifa (kapsula «Uyga vazifa · Amaliy topshiriqni bajarish →», ichida):
  - 📝 Uyda nima qilasiz? — Uyda ro'yxatingizni davom ettirasiz: mini-do'koningizning yana bir ishini topib, chegarasini va bu qaror kimga tegishini yozasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.
  - Variantlar: To'liq · ~20 daqiqa · Qisqa · ~10 daqiqa · (tanlanmaguncha: 👆 Avval variantni tanlang — topshiriq-karta shunga moslashadi.)
  - 🗂 Topshiriq kartasi — TO'LIQ: Nechta — 1 ta yangi chegara · Muddat — navbatdagi darsgacha · 1) Mini-do'koningizning yana bir ishini toping 2) Chegarani «…maydi» shaklida yozing 3) Yoniga jabr ko'radigan bitta odamni qo'ying
  - QISQA: Nechta — 1 ta belgilash · 1) Uch chegarangizni qayta o'qing 2) Eng aniq odamni aytadiganini belgilang 3) Sababini bir gap bilan yozing
- Keyingi dars matni — **yo'q** (bu ekranda «Keyingi dars» qatori yozilmagan)
- Tugmalar: Qaytadan · Yakunlash ✓ · Yopish
- Mentor-eslatma: Arena tugagach podium — g'oliblarni nomlab tabriklang. Uy-vazifa: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa. Muddat — navbatdagi darsgacha. Tekshirishda bitta savolga qarang: qatorda bitta aniq odam nomlanganmi?

---

## Qo'shimcha matnlar

**Nishonlar (4):** 🪞 Mirror Check! — Qaror kimga tegishini o'zingiz ko'rdingiz (4-ekran) · ✍️ Rule Maker! — Uch chegarani odami bilan yozdingiz (8) · 🔗 Pair Finder! — To'rt qarorni odamiga qo'shdingiz (9) · 🛠 Limit Coder! — Chegara kerak ishlarni kod bilan topdingiz (10)
Nishon yozuvlari: Yangi nishon · bosib davom eting

**Qisqa takrorlash oynalari (4):**
1. (3-ekran) Chegara — oldindan qilingan qaror: ⚖️ Chegara nima — Ilova qaysi ishni **o'zi qilmasligini** oldindan hal qilasiz — shu qaror chegara. · 🙋 Chegara ilovani to'xtatmaydi — U bitta ishni ilovadan olib, **odamga qaytaradi**. Qolgan ishlarni ilova avvalgidek o'zi qilaveradi. · 🛒 Do'konda buni qanday ko'rasiz — Javobni AI yozadi, yuborishdan oldin uni **do'kon egasi o'qiydi** — ish AI da qoldi, qaror odamda. · Savol: Do'koningizda qaysi ish odamdan o'tishi kerak?
2. (5) Chegara o'zi qiladigan ishga qo'yiladi: 🙋 So'ralgan ishni odam to'xtata oladi — Ilova avval so'rasa, xato javob **odamning oldida** to'xtaydi — chegara u yerda allaqachon bor. · 🤖 O'zi qilingan ishni hech kim to'xtatmaydi — Ilova so'ramay qilsa, ish to'g'ri mijozga boradi. Shuning uchun chegara **birinchi navbatda** shunday ishga qo'yiladi. · 🔎 Bitta savol yetadi — Har ishga bitta savol bering: buni ilova **o'zi qiladimi**? Ha bo'lsa — shu ishga qarang. · Savol: Do'konda ilova o'zi qiladigan yana qaysi ish bor?
3. (7) AI yozadi, odam o'qib chiqadi: 📱 Ilovaning o'zi yozib qo'ygan — AI bilan yozishadigan ilova ekranining pastiga o'sha qatorni **o'zi** yozib qo'ygan: javobni tekshirib ko'ring. · ⏱ Chegara qayerga tushadi — U **AI yozgan payt** bilan **mijoz o'qigan payt** orasiga tushadi — shu oraliqda odam javobni ko'rib chiqadi. · 🛒 Tavsif ham shunday — AI tavsifni yozadi, do'kon egasi o'qiydi, keyin tavsif saytga chiqadi. · Savol: Xato tavsif qaysi qadamda tutiladi?
4. (11) Har qaror bitta odamga tegadi: 🎯 Chegarani qaysi ish oladi — Chegara **odamga eng og'ir tegadigan** ishga qo'yiladi — hamma ishga emas. · 🛑 Hamma ishga qo'ysangiz — Har ish do'kon egasi o'qiguncha turib qoladi — **do'kon to'xtaydi**. Chegara tanlab qo'yiladi. · 🙋 Odam nomlangan bo'lsin — Har chegarada bitta aniq odam turadi: «buyurtma bergan mijoz», «manzilini qisqa yozgan mijoz». · Savol: Uch chegarangizdan qay biri eng aniq odamni aytadi?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Chegara nima? ✔ Ilova qaysi ishni o'zi qilmasligi haqidagi qaror · Ilova qaysi ishni birinchi bo'lib o'zi qilishi haqidagi qaror · Ilova qaysi mijozga xabar yuborishi haqidagi qaror · Ilova qaysi sahifani o'zi ochmasligi haqidagi qaror
2. Ilova so'raydigan ish bilan o'zi qiladigan ishning farqi nimada? So'ralgan ish odamga tezroq yetib boradi · O'zi qiladigan ishda odam kamroq xato qiladi · So'ralgan ishni ilova ikki marta bajaradi · ✔ So'ralgan ishni odam to'xtata oladi
3. Do'kon egasi kuniga faqat bitta ishni o'zi o'qib chiqa oladi. Qaysi ishni tanlagani to'g'ri? Mijozga o'zi qo'ng'iroq qiladigan ishni · Ilova mijozdan so'rab bajaradigan ishni · ✔ Ilova hech kimdan so'ramay bajaradigan ishni · Ilova hech qachon bajarmaydigan ishni
4. Ilova mijozning savatidan mahsulotni o'zi olib tashlasa, kim jabr ko'radi? Do'konga tovar keltirib beradigan sotuvchi · ✔ Savatni to'ldirib, to'lovga o'tayotgan mijoz · Do'kon saytini yasab bergan dasturchi · Mijozlar buyurtmasini omborda yig'adigan xodim
5. Tavsif hech kim o'qimay saytga chiqsa, nima bo'ladi? Mijoz tavsifni saytda umuman ko'rmay qoladi · ✔ Xato tavsifni mijoz o'qib, ishonib qoladi · Sayt tavsifni o'zi qayta yozib chiqadi · Mijozning buyurtmasi o'z-o'zidan bekor bo'ladi
6. Buyurtmani ilova o'zi bekor qilsa, kim jabr ko'radi? ✔ Manzilini qisqa yozib yuborgan mijoz · Buyurtmani mijozga yetkazadigan haydovchi · Do'konga tovar keltiradigan sotuvchi · Mijozlar to'lovini hisoblab boradigan xodim
7. Ilova kech qolgan buyurtmaning yetkazish vaqtini o'zi o'zgartirib qo'ydi. Bu ishga nega chegara kerak? Ilova vaqtni tez-tez o'zgartirsa, sayt sekinlashadi · Yangi vaqt do'kon ro'yxatida ikki marta yoziladi · ✔ Yangi vaqtga ishonib kutgan mijoz aldanib qoladi · Vaqt o'zgargani do'kon hisobotiga tushmay qoladi
8. Bot tasdiq xabarini kechasi soat ikkida yuborsa, kim jabr ko'radi? Ertalab ishga shoshib chiqadigan mijoz · Kechasi do'konni yopib ketgan do'kon egasi · Buyurtmani ertalab mijozga olib chiqadigan haydovchi · ✔ Telefonini o'chirmasdan uxlaydigan mijoz
9. Bir hafta telefoniga qaray olmagan mijozga botning qaysi qarori tegdi? ✔ Bot buyurtmani o'zi bekor qilib yubordi · Bot tasdiq xabarini o'zi kechasi yubordi · Bot mahsulot tavsifini o'zi qayta yozdi · Bot chegirmani ko'p buyurtma berganlarga yubordi
10. Do'konga endi qo'shilgan mijoz chegirmadan bexabar qoldi. Botning qaysi qarori shunga olib keldi? Tasdiq xabarini kechasi soat ikkida yuborishi · Javob kelmagan buyurtmani o'zi bekor qilishi · ✔ Chegirmani faqat ko'p buyurtma berganlarga yuborishi · Javob kelmaguncha har o'n daqiqada yozib turishi
11. Do'kon egasi endi har bir buyurtmani o'zi o'qib chiqishga majbur. Sabab nima? AI javoblari mijozlarga to'g'ridan-to'g'ri ketgan · ✔ Do'kondagi hamma ishga chegara qo'yib chiqilgan · Bot kechalari umuman ishlamay qo'ygan · Chegirma xabari hamma mijozlarga yuborilgan
12. Ilovaga yangi ish qo'shilmoqchi: mijozga tabrikni o'zi yuborish. Chegara kerakmi — buni kim hal qiladi? Ilovaning o'zi sinab hal qiladi · Tabrik keladigan mijozning o'zi · Ilovaga kod yozgan dasturchi · ✔ Mahsulotni o'ylaydigan odam

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **Bitta narsa ikki xil nomlangan:** «kimga tegadi» va «kim jabr ko'radi» bir ekranda almashib keladi (4, 8, 9, 14-ekranlar). 8-ekranda sarlavha «Bu qaror kimga tegadi?», Mentor esa «kim jabr ko'radi?» deydi.
- **Bir odam har joyda boshqa nom bilan:** 9-ekrandagi «Telefonini yostiq yonida qoldiradigan mijoz» arena 8-savolida «Telefonini o'chirmasdan uxlaydigan mijoz» bo'lib ketgan; «Birinchi marta buyurtma bergan mijoz» (9) arena 10-savolida «Do'konga endi qo'shilgan mijoz» bo'lgan.
- **Oldingi darsga tayangan savol:** 10-ekrandagi darvoza-savol «Vakolat chegarasi qo'yilgan agent… nima qiladi?» va 2-ekran xulosasi («O'tgan darsda… vakolat chegarasi qo'ygan edingiz») o'tgan darsni eslashni talab qiladi, bu darsning o'zida esa ochilmagan. Variantdagi «jurnalga yozib qo'yadi» nimani anglatishi ham tushuntirilmagan.
- **Izohsiz inglizcha so'z:** «guardrails» (14-ekran, 10-kartochka). «AI», «agent» (2-ekranda izohi bor), nishon nomlari (Mirror Check! va h.k.) va 10-ekrandagi «Kompilyatorni ochish»: kompilyatorga alohida qavs-izoh yo'q, faqat yonidagi «Kod yoziladigan oyna: chapda kod, o'ngda natija» jumlasi tushuntiradi.
- **Qiyin o'qiladigan jumlalar:** 10-ekran Mentori «Bot o'zi qiladimi — endi **oziQiladi** qiymati, qaror tegadigan odam esa **tegadi** qiymati» · 0-ekran «Bugun shu savolni quradigan mini-do'koningizga berasiz».
- **Takrorlangan matn:** «Ilova qaysi ishni o'zi qilmasligini oldindan hal qilasiz — shu qaror chegara» so'zma-so'z 5 joyda turibdi: 2-ekran xulosasi, 1-takrorlash oynasi, 1-kartochka, yakun, arena 1-savoli. Mentor-eslatmalardagi «Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq» ham 4 marta takrorlanadi.
- **Yakun ekrani:** «Keyingi dars» qatori yo'q. Sarlavha «Uchta chegarangiz yozildi.» faylda `tr()` ga o'ralmagan (ruscha rejimda ham o'zbekcha chiqadi — texnik belgi).
- **Test «sotilib» qolmagan:** 3/5/7/11-ekranlarda to'g'ri javob uzunligi boshqa variantlar bilan teng yoki qisqaroq. 4-ekranning 2-bosqichi ballsiz, lekin amalda test kabi ishlaydi: faqat «javob» to'liq ✅ oladi, qolgan ikkitasiga «Bu ham chegara. Lekin…» chiqadi.
