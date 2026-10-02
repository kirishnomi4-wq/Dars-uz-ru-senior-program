# 6-Modul (LMS: 8-Modul) · 12-dars «Bugun qaysi ish boshlanadi?» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/PmLesson24.jsx` · 16 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi
- **Hook (0):** o'quvchi o'z tizimi uchun oltita yangi ish o'ylab topgan, hammasini birdan boshlab bo'lmaydi. U «eng oson» yoki «eng foydali» ishdan boshlashni tanlaydi → ikkalasi ham ishlaydi, lekin ba'zi ish bugun umuman boshlanmaydi — u boshqa narsani kutib turibdi.
- **Markaziy mexanika (4):** «Uch ufq yo'li» — sartaroshxona tizimining 6 ishini «▶ Bugun boshlash» bilan sinaydi: 3 tasi boshlanadi (✅), 3 tasi to'xtaydi (🔴) va o'zi kutgan narsa tayyor bo'ladigan ufqqa borib turadi; keyin «Oldindan to'lash»ni yaqinroq ufqqa ko'chirish savoli.
- **Asosiy metafora:** ufq (ko'z yetadigan eng olis joy) = ishlar qachon boshlanishiga qarab bo'lingan bo'lak; uch ufq — hozir · uch oydan keyin · olti oydan keyin; reja = yo'l. Keys: Tesla 2006-yilgi bir varaqli uzoq reja.
- **Yakun:** o'quvchi o'z tizimi uchun uch qatorli reja yozadi (8), yangi 6 ishni ufqqa qo'yadi (9), VS Code'da rejani ufqlarga ajratadigan kod yozadi (10). Asosiy fikr: «Ishni ufqqa bizning xohishimiz emas, uning kutayotgan narsasi qo'yadi.»

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — oltita yangi ish | hook | «eng oson» / «eng foydali» dan birini tanlaydi | — |
| 1 | Maqsad | qoida | uch qatorli reja namunasi o'zi yozilib chiqadi | — |
| 2 | Ikki xil reja | tushuncha | «Bitta ro'yxat» / «Uch bo'lakka ajratilgan» kartalarini ochadi → ufq ta'rifi | — |
| 3 | 1-savol | test | eng uzoq ufq nimani bildiradi | ✅ |
| 4 | Uch ufq yo'li | markaziy | 6 ishni bugun boshlab ko'radi, ko'chirish savoliga javob beradi | — (nishon) |
| 5 | 2-savol | test | «baho qo'yish» nega bugun boshlanmaydi | ✅ |
| 6 | Tesla (haqiqiy voqea) | case | 6 bosqichli karta + 2 bashorat | — |
| 7 | 3-savol | test | Tesla rejasiga o'xshagan uzoq reja qanday | ✅ |
| 8 | Uch ufqqa uchta ish | amaliyot (yozish) | o'z tizimi uchun har ufqqa bitta ish yozadi | — (nishon) |
| 9 | Ufqqa qo'yish | amaliyot | yangi 6 ishni ufqqa qo'yadi, sababini o'qiydi | — (nishon) |
| 10 | Koding · VS Code | koding | kod-savol → `reja.js` da ikki sikl yozadi | — (nishon) |
| 11 | 4-savol | test (yakuniy) | ishni ufqqa nima qo'yadi | ✅ (final) |
| 12 | Mustahkamlash · 2 qadam | refleksiya | 30 soniya ovoz chiqarib aytadi, bir qatorda yozadi | — |
| 13 | Natijalar | podium | jonli reyting | — |
| 14 | Takrorlash | kartochkalar | 10 ta kartochka | — |
| 15 | Yakun | xulosa | 4 xulosa + arena + uyga vazifa | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 4 ta (3/5/7/11-ekran); nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
ufq · uch ufq (hozir · uch oydan keyin · olti oydan keyin) · yaqin ufq / uzoq ufq · bo'lak · reja · uch qatorli reja · yo'l (uch ufq yo'li) · ish · boshlanadi · to'xtadi · kutadi / kutgan narsa · «buni bugun boshlab bo'ladimi?» · «nimasi hali yo'q?» · bir varaq (Tesla) · bosqich · mahsulotni o'ylaydigan odam · sartaroshxona tizimi · navbat · baho

---

## 0 · Kirish — oltita yangi ish  `[667]`
- Eyebrow: Kirish · yangi oltita ish
- Sarlavha: **Hammasi kerak — qaysinisidan boshlaysiz?**
- Mentor: Tizimingizga oltita yangi ish o'ylab topdingiz. Hammasini birdan boshlab bo'lmaydi.
- Tanlov:
  - ⚡ Eng oson ishdan — natija tez ko'rinadi
  - 🎯 Eng foydali ishdan — ko'p odamga kerak
- Javobdan keyin (ikkalasida bir xil): Ikkalasi ham ishlaydi. Lekin oltita ishning ba'zisi bugun umuman boshlanmaydi — u sizni emas, **boshqa narsani** kutib turibdi. Qaysi ish nimani kutayotganini bugun o'zingiz topasiz.
- Jonli darsda: sinf ovozlari foizi (har variant yonida %)
- Tugma: Bittasini tanlang → Davom etish
- Mentor-eslatma: Ovozlar bo'linadi — ikkala tomonning ham dalili bor. Shu bo'linishning o'zi darsga eshik: uchinchi javob bor va u ekranda ochiladi. Javobni oldindan aytmang.

## 1 · Maqsad  `[742]`
- Eyebrow: Maqsad
- Sarlavha: **Bugun har ish qachon boshlanishini yozasiz**
- Mentor: Bu — navbat ilovasining rejasi; o'z tizimingizga shunday uch qator yozasiz.
- Blok: 🛣 Uch qatorli reja (qatorlar birin-ketin yozilib, ✅ qo'yiladi)
  - Hozir → Sartaroshxona telefon raqamini qo'shamiz
  - Uch oydan keyin → Doimiy mijozga tug'ilgan kun tabrigini yuboramiz
  - Olti oydan keyin → Sartaroshlar uchun alohida kirish ochamiz
- Tugma: Boshlaymiz →
- Mentor-eslatma: Varaq yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.

## 2 · Ikki xil reja  `[769]`
- Eyebrow: Muhokama · ikki xil reja
- Sarlavha: **Oltita ish bitta ro'yxatda tursa, nima ko'rinmaydi?**
- Mentor: Sartaroshxona tizimining oltita ishi ikki xil yozilgan. Ikki kartani bosib solishtiring.
- Kartalar (yopiq: «· · ·»):
  - 📋 **Bitta ro'yxat** — Oltita ish yonma-yon turibdi — qaysi biri bugun boshlanishini hech narsa aytmaydi
  - 🛣 **Uch bo'lakka ajratilgan** — O'sha oltita ish uch bo'lakka bo'lingan: bugun boshlanadiganlar alohida, keyinroq boshlanadiganlar alohida
- Ikkalasi ochilgach (xulosa):
  - Uzoqqa qarasangiz, ko'z yetadigan eng olis joy — ufq. Rejada ham yaqini va uzog'i bor.
  - **Ishlar qachon boshlanishiga qarab bo'lingan bo'lak — ufq.** Rejada uch ufq bor: hozir · uch oydan keyin · olti oydan keyin.
- Tugma: 👆 Yana N kartani oching → Davom etish

## 3 · 1-savol ✅  `[810]`
- Eyebrow: Tekshiruv · ufq nimani aytadi
- Savol: **Rejadagi ish eng uzoq ufqqa tushdi. Bu nimani bildiradi?**
  - Ish bugun boshlanadi, olti oy davom etadi
  - ✔ Ish bugun emas, olti oydan keyin boshlanadi
  - Ish bugun boshlanadi, olti oyda tugaydi
- To'g'ri: Ufq ishning uzunligini emas, boshlanish paytini aytadi.
- Xato izohlari:
  - (1-variant) Ufq ish necha oy davom etishini aytmaydi — eng uzoq ufqdagi ish bugun boshlanmaydi.
  - (3-variant) Ufq ish qachon tugashini ham aytmaydi — u faqat qachon boshlanishini aytadi.
  - (umumiy) Ufq bitta narsani aytadi: ish qachon boshlanadi.
- Tugma: Javobni tanlang

## 4 · Uch ufq yo'li (markaziy)  `[838]`
- Eyebrow: Sinov · uch ufq yo'li
- Sarlavha: **Har ishni bugun boshlab ko'ring.**
- Mentor: Sartaroshxona tizimida oltita ish bor. Har ishning ▶ tugmasini bosing.
- Lagancha: 🧰 Sartaroshxona tizimining ishlari · har kartada «▶ Bugun boshlash»
- Ishlar va bosilgandan keyingi qator:
  - 📸 Sartarosh ishlaridan surat qo'yish → ✅ Boshlandi — suratlar sartaroshlarning telefonida bor
  - 🔔 Navbatdan bir soat oldin eslatma → ✅ Boshlandi — bot allaqachon xabar yubora oladi
  - 📍 Manzilni sahifada ko'rsatish → ✅ Boshlandi — manzillar bazada yozilgan
  - ⭐ Sartaroshga baho qo'yish → 🔴 To'xtadi — baho qo'yish uchun odam avval navbat olishi kerak. Navbat hali yo'q
  - 📆 Sartaroshning band kunlarini ko'rsatish → 🔴 To'xtadi — band kunlar real navbatlardan chiqadi. Navbat hali yo'q
  - 💳 Ilovada oldindan to'lash → 🔴 To'xtadi — pulini oldindan berish uchun odam sartaroshga ishonishi kerak. Ishonch baholardan chiqadi, baho hali yo'q
- Yo'l (uch bekat): 🟢 Hozir · 🟡 Uch oydan keyin · 🔵 Olti oydan keyin · har birida «N ta ish»
- Uzoq harakatsizlikda: 🤔 Yana bitta ishning ▶ tugmasini bosib ko'ring.
- Oltalasi bosilgach: ✅ Buni o'zingiz ko'rdingiz: ish o'zi kutgan narsa tayyor bo'lganda boshlanadi.
- Ko'chirish savoli: 💳 «Oldindan to'lash» eng uzoq ufqda turibdi. Uni «Uch oydan keyin» ufqiga ko'chirsangiz nima bo'ladi?
  - Uch oyda boshlanadi → Uch oyda birinchi baholar endi kelgan bo'ladi — odam hali notanish sartaroshga pulini oldindan bermaydi. Ish baribir to'xtaydi.
  - Baribir to'xtaydi → ✅ Shunday: ishni ufqqa bizning xohishimiz emas, uning kutayotgan narsasi qo'yadi.
- Tugma: ① Har ishning ▶ tugmasini bosing (N/6) → ② Ko'chirish savoliga javob bering → Davom etish
- Mentor paneli: 🛣 Yo'lni qurganlar
- Mentor-eslatma: Bolalar odatda uchta yashil ishni bosib to'xtaydi. To'rtinchi ish to'xtagach «nimasi yetishmayapti?» deb so'rang — kashfiyot aynan shu lahzada. Qaysi ish to'xtashini oldindan aytmang. Jonli darsda bu amaliyotni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 5 · 2-savol ✅  `[942]`
- Eyebrow: Tekshiruv · ish nimani kutadi
- Savol: **«Sartaroshga baho qo'yish» ishi nega bugun boshlanmaydi?**
  - Boshqa ishlar undan oldin qilinishi kerak
  - Uni kutayotgan odam juda kam bo'lgan
  - ✔ U kutayotgan narsa hali paydo bo'lmagan
- To'g'ri: Baho qo'yish uchun avval real navbatlar kerak, ular hali yo'q. Ish o'zi kutgan narsa tayyor bo'lganda boshlanadi.
- Xato izohlari:
  - (1) Ishlarning tartibi uni to'xtatmadi — unga kerak navbatlar hali yo'q.
  - (2) Nechta odam kutayotgani ham to'xtatmaydi — unga kerak navbatlar hali yo'q.
  - (umumiy) Ish to'xtadi, chunki u kutayotgan narsa — real navbatlar — hali paydo bo'lmagan.

## 6 · Tesla — haqiqiy voqea (case)  `[1005]` (kartalar `[979]`)
- Eyebrow: 🚗 Haqiqiy voqea
- Sarlavha: **Uzoq reja bir varaqqa sig'adimi?**
- Yil-yo'li: 2006 —— o'n yildan ortiq · ✅ Bajarilgan bosqich: hali boshlanmagan / N / 3
- Karta 1 · 📜 **2006-yil** — (varaq yopiq: «2006 · BIR VARAQ», «uch qator — bitta betda») Tesla o'zining uzoq rejasini bir varaqqa yozdi va uni hammaga **ochiq** e'lon qildi. O'shanda kompaniyaning bironta mashinasi ko'chada yurmasdi.
- Karta 2 · 🔮 bashorat («🎲 Avval o'zingiz belgilab ko'ring»): **Reja qaysi mashinadan boshlangan?**
  - 🚙 Hammabop arzon mashinadan
  - ✔ 🏎 Oz sonda chiqarilgan qimmat mashinadan
  - 🚚 Yuk tashiydigan katta mashinadan
  - Topsa: 🎯 Topdingiz! Oz sonda chiqarilgan qimmat mashinadan · Topmasa: Adashdingiz — asl javob: oz sonda chiqarilgan qimmat mashinadan
- Karta 3 · 🏎 **Birinchi bosqich** — Reja qimmat sport-mashinadan boshlandi — u juda oz sonda chiqarildi, ko'p odam uni sotib ololmasdi.
- Karta 4 · 🔮 bashorat: **Keyingi mashinani nima bilan qurgan?**
  - 🏦 Bankdan olingan qarz puli bilan
  - ✔ 💰 Birinchi mashinadan tushgan pul bilan
  - 🤝 Boshqa kompaniyaning yordami bilan
  - Topsa: 🎯 Topdingiz! Birinchi mashinadan tushgan pul bilan · Topmasa: Adashdingiz — asl javob: birinchi mashinadan tushgan pul bilan
- Karta 5 · 🚙 **Ikkinchi bosqich** — Birinchi mashinadan tushgan pulga arzonroq mashina qurildi — endi uni ko'proq odam ola oldi.
- Karta 6 · 🚗 **Uchinchi bosqich** — (varaq ochiq: 1) Qimmat mashina — oz sonda · 2) Arzonrog'i — ko'proq sonda · 3) Eng arzoni — hamma uchun · «hammaga ochiq e'lon qilindi») O'sha puldan hamma sotib oladigan arzon mashina qurildi. Bir varaqqa yozilgan reja **o'n yildan ortiq** bajarildi.
- Oxirida (ko'prik): Tesla uch bosqichni bir varaqqa yozdi va har bosqich o'zidan oldingisini kutdi. Sizning tizimingizda ham shunday: bugun boshlanadigan ish bor, kutadigan ish bor. Buni kod emas, **mahsulotni o'ylaydigan odam** hal qiladi — endi shu reja sizniki.
- Tugmalar: Avval o'zingiz belgilang · Keyingi bosqich (N/6) → Davom etish · nuqtalar «Avval shu bosqichni tugating»

## 7 · 3-savol ✅  `[1086]`
- Eyebrow: Tekshiruv · uzoq reja
- Savol: **Tesla rejasiga o'xshagan uzoq reja qanday bo'ladi?**
  - ✔ Hamma o'qiy oladigan bir varaq bo'ladi
  - Faqat o'zingiz ko'radigan yozuv bo'ladi
  - Har oy qaytadan yoziladigan ro'yxat bo'ladi
- To'g'ri: Tesla uzoq rejasini bir varaqqa yozib, hammaga ochiq qo'ygan.
- Xato izohlari:
  - (2) Reja faqat o'zingizda qolsa, hech kim yordam bera olmaydi — Tesla uni hammaga ochiq qo'ygan.
  - (3) Har oy qaytadan yozilgan ro'yxat uzoq reja emas — Tesla rejasi o'n yildan ortiq bajarildi.
  - (umumiy) Uzoq reja — hamma o'qiy oladigan bir varaq.

## 8 · Uch ufqqa uchta ish (yozish)  `[1137]`
- Eyebrow: Mustaqil ish · uch ufq
- Sarlavha: **Uch ufqqa uchta ish yozing.**
- Mentor: Har ishga bitta savol bering: buni bugun boshlab bo'ladimi?
- (Oldingi darsdan saqlangan bo'lsa) ⚖️ Oldingi darsda uchta chegara qo'ygan edingiz · [uch qator] · Rejangizdagi ish shu chegaralarni buzmasin.
- Yozish kartasi (bittadan): 🟢 Hozir / 🟡 Uch oydan keyin / 🔵 Olti oydan keyin
  - Placeholder: Bugun qaysi ish boshlanadi? · Uch oydan keyin qaysi ish boshlanadi? · Olti oydan keyin qaysi ish boshlanadi?
- Javob-qatorlari (yozayotganda):
  - 🤔 Bu ish yuqorida allaqachon yozilgan — boshqa ish yozing.
  - 🤔 Bu hali ish emas. Tizimingiz nima qilishini yozing.
  - 🤔 Bu ish nimanidir kutyapti. «Hozir» ufqiga bugun boshlanadigan ishni yozing — kutadigan ishni keyingi ufqda yozasiz.
  - 🤔 Uchalasi ham bugun boshlanadi — unda bu reja emas, bugungi ro'yxat. Kutadigan bitta ish toping.
  - ✅ Yozildi — bu ish o'z ufqida turibdi.
  - 🤔 Qisqa qoldi: ish nomini to'liq yozing.
- Tugmalar: ✓ Saqlash / ✓ Yangilash · ✎ Tahrirlash
- O'ng panel: 🎯 Uch ufqingiz (🟢 Hozir · 🟡 Uch oydan keyin · 🔵 Olti oydan keyin, ✓ bilan)
- 💡 Yordam: O'zingizga ikki savol bering: buni bugun boshlab bo'ladimi? Bo'lmasa, nimasi hali yo'q? Ikkinchi savolning javobi ufqni o'zi ko'rsatadi.
- ⭐ Qo'shimcha: «Olti oydan keyin» ishingiz nimani kutayotganini bir qatorda yozing.
- Tayyor bo'lgach: 🛣 Uch qatorli rejangiz (Hozir → … ) · ✅ Uch qatorli rejangiz saqlandi — har ish o'z ufqida turibdi
- Tugma: ① «Hozir» ufqiga bitta ish yozing → ② Yana N ufq qoldi → Davom etish
- Mentor paneli: ✍️ Uch ufqni yozganlar
- Mentor-eslatma: «Uchalasi ham bugun boshlanadi» degan rejalar chiqadi — bu eng foydali xato. Javob-qatori uni tutadi, siz muhokama qiling: unda bu reja nima? Baholash-mezoni: uchala ufqqa ham ish yozilgan · «Hozir» ishi bugun boshlanadi · uzoq ufqdagi ish nimanidir kutadi. Jonli darsda bu amaliyotni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 9 · Har ishni o'z ufqiga qo'ying  `[1281]`
- Eyebrow: Tekshiruv · yangi oltita ish
- Sarlavha: **Har ishni o'z ufqiga qo'ying.**
- Mentor: Uch qatoringiz tayyor — endi shu savolni o'sha tizimning yangi oltita ishida beramiz.
- Sahna: ✂️ Sartaroshxona tizimi ochilganiga bir necha oy bo'ldi: har kuni navbatlar tushyapti, birinchi baholar endi kelyapti. Oldida yangi oltita ish turibdi.
- Karta (N / 6) + 3 tugma: 🟢 Hozir · 🟡 Uch oydan keyin · 🔵 Olti oydan keyin
- Nishon qatori: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Ishlar → asl ufq → sabab:
  - 🔎 Ismi bo'yicha sartarosh qidirish → Hozir → Sartaroshlarning ismi bazada allaqachon yozilgan
  - ❌ Navbatni bekor qilish tugmasi → Hozir → Navbatlar tushib turibdi — bekor qilishni bugun qo'shsa bo'ladi
  - 🌙 Ilovada tungi ko'rinish → Hozir → Ilova ishlab turibdi, ranglarni bugun o'zgartirsa bo'ladi
  - 🎁 Uchinchi tashrifga chegirma → Uch oydan keyin → Uchinchi tashrif uchun odam avval uch marta kelishi kerak — ko'pchilik hozircha bir-ikki marta kelgan
  - 🏅 Sartaroshlar ro'yxati — kim ko'p maqtalgan → Uch oydan keyin → Ro'yxat baholardan tuziladi — birinchi baholar endi kelyapti, ular hali oz
  - 🏙 Boshqa shaharga ochish → Olti oydan keyin → Boshqa shaharga chiqish uchun avval bitta shaharda sartaroshlar to'lishi kerak
- Javobdan keyin:
  - To'g'ri: ✅ Shu ufqda turadi.
  - Uzoqroq qo'ysa: 🤔 Bu ish kutmaydi — unga kerak narsa allaqachon bor.
  - Yaqinroq qo'ysa: 🤔 Buni hali boshlab bo'lmaydi — nimasi yetishmayotganini o'ylab ko'ring.
  - so'ng doim: asl ufq yorlig'i + sabab-qatori
- Tugmalar: Keyingi ish → · (oxirgisida) ✓ Yo'lni ko'rish
- O'ng panel: 🎯 Oltita ish (✓ bilan) · birinchi xatodan keyin 💡 Yordam: O'zingizga ikki savol bering: buni bugun boshlab bo'ladimi? Bo'lmasa, nimasi hali yo'q?
- Yakun: yo'l (3 bekat, «N ta ish») · ✅ Yaqin ufqda ish ko'p turadi, uzoq ufqda esa oz — reja shunday ko'rinadi
- Tugma: ① Ishni o'z ufqiga qo'ying (N/6) → Davom etish
- Mentor paneli: 🧭 Oltalasini qo'yganlar
- Mentor-eslatma: Eng ko'p adashiladigan joy — «sartaroshlar ro'yxati»: baholar endi kelyapti, ular hali oz. Sabab-qatori ochilgach shuni ovoz chiqarib o'qing. Sinf ish-tartibi: har o'quvchi sherigining uch qatorini o'qib, «olti oydagi ishingiz nimani kutyapti?» deb so'raydi — javob topilmasa, ish boshqa ufqqa ko'chadi. Jonli darsda bu amaliyotni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 10 · Koding · VS Code  `[1473]` (kod `[1408]`)
- Eyebrow: Koding · ⌨️ VS Code
- Sarlavha: **Rejani ufqlarga ajratadigan kod yozamiz.**
- **1-bosqich (kod-savol):**
  - Mentor: Avval bitta savol — keyin kod yoziladi.
  - 🔎 Kod `reja[3].ufq` ni chiqarsa, terminalda nima ko'rinadi?
    - To'rtinchi ishning ish nomi
    - ✔ To'rtinchi ishning ufq nomi
    - Rejadagi ufqlarning umumiy soni
  - Xatodan keyin: 🤔 Nuqtadan keyin qaysi maydon yozilgan bo'lsa, terminalda o'sha maydonning qiymati chiqadi.
- **2-bosqich (kod):**
  - Mentor: Qo'lingiz bilan qo'ygan ishni endi kod bajaradi.
  - ✓ `reja[3].ufq` — to'rtinchi ishning ufq nomi
  - Kod nima chiqarsin: 1) Uch ufq sarlavhasi chiqadi · 2) Har sarlavha ostida o'z ishlari · 3) Ish boshqa sarlavha ostiga tushmaydi
  - Boshlang'ich kod (`reja.js`, 🔒 qo'lda yoziladi — «Kod nusxalanmaydi — o'zingiz terib yozasiz»):
  ```js
  // reja.js — sartaroshxona tizimining uch ufqli rejasi

  // Kodda ufq nomlarini qisqa yozamiz: hozir, uch-oy, olti-oy
  const reja = [
    { ish: "Sartarosh suratlari", ufq: "hozir" },
    { ish: "Eslatma xabari", ufq: "hozir" },
    { ish: "Manzilni ko'rsatish", ufq: "hozir" },
    { ish: "Sartaroshga baho qo'yish", ufq: "uch-oy" },
    { ish: "Band kunlar", ufq: "uch-oy" },
    { ish: "Oldindan to'lash", ufq: "olti-oy" },
  ];

  const ufqlar = ["hozir", "uch-oy", "olti-oy"];

  for (let i = 0; i < ufqlar.length; i++) {
    const u = ufqlar[i];   // u — shu aylanishda ochilayotgan ufq nomi
    // VAZIFA — uchala qadam shu sikl ichiga yoziladi:
    // 1) sarlavha chiqsin:  console.log("== " + u + " ==");
    // 2) ichkariga ikkinchi siklni qo'shing:
    //      for (let j = 0; j < reja.length; j++) {
    //        const r = reja[j];
    //      }
    // 3) sarlavha ostiga faqat r.ufq qiymati u ga teng
    //    bo'lgan ish tushsin:  console.log("   - " + r.ish);

    // 1 · 2 · 3-qadamni shu yerga yozing
  }
  ```
  - Terminal: `$ node reja.js`
  - Pastda: 🔒 VS Code (kod yoziladigan dastur)da o'zingiz terasiz.
  - 💡 Yordam: Avval bitta ufq nomini qo'lda chiqarib ko'ring. Ishlagach ichiga **reja** bo'yicha aylanadigan ikkinchi siklni qo'shing — har aylanishda bitta ish qo'lingizda bo'ladi. / Sikl oltala ishni ketma-ket beradi, sarlavha ostiga esa hammasi emas. Ikki qiymatni solishtiring — teng bo'lsa qavs ichidagi qator ishlaydi: `if (kun === "dushanba") { ... }`
  - ⭐ Qo'shimcha: Har ufq nomi yonida ish sonini chiqaring — `== hozir (3 ta) ==`
  - Tugmalar: ✅ Bajardim — uch sarlavha chiqdi → ✓ Bajarildi · (yakka rejimda) ✓ Sinfda bajarganman — davom etish →
- Tugma: 🔒 Avval kod-savolini yeching → ② Kodni yozing va tugmani bosing → Davom etish
- Mentor paneli: ⌨️ Kodni yozib bo'lganlar
- Mentor-eslatma: Kod — s4 va s9 dagi ishning tarjimasi, shuni ochiq ayting: bola qo'li bilan qo'ygan ish endi kodda ufq nomi bo'lib turibdi. Kod 10 daqiqada yoziladi; ulgurmagan o'quvchi uyga qisqa variantni oladi. Jonli darsda bu topshiriqni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 11 · 4-savol ✅ (yakuniy)  `[1744]`
- Eyebrow: Yakuniy tekshiruv
- Savol: **Ishni qaysi ufqqa qo'yishni nima hal qiladi?**
  - Ishni bajarish qancha vaqt olishi
  - ✔ Kerak narsa qachon tayyor bo'lishi
  - Qancha odam so'rab turgani
- To'g'ri: Odamlar soni ufqni tanlamaydi — u bitta ufq ichida qaysi ish oldin qilinishini aytadi.
- Xato izohlari:
  - (1) Ishga ketadigan vaqt ufqni tanlamaydi — ish nimani kutayotganiga qarang.
  - (3) Nechta odam so'ragani bitta ufq ichidagi tartibni aytadi — ufqni esa kerak narsaning payti hal qiladi.
  - (umumiy) Ufqni bitta narsa hal qiladi: kerak narsa qachon tayyor bo'lishi.

## 12 · Mustahkamlash · 2 qadam  `[1638]`
- Eyebrow: Mustahkamlash · 2 qadam
- Sarlavha: **Uch qatoringizni yoddan ayta olasizmi?**
- Mentor: Ekranga qaramasdan javob bering: olti oydagi ishingiz nimani kutyapti?
- 1-qadam: 🗣 Ovoz chiqarib o'zingizga ayting (yakka) / Sherigingizga ayting (jonli)
  - Taymer: ▶ 30 soniyani boshlash (yakka) / ▶ 1 daqiqani boshlash (jonli) · Gapiring / Hozir A gapiradi — keyin B navbati / oxirgi navbat · ⏹ To'xtatish
  - Jonli oldidan: Har biringizga 30 soniyadan — avval A, keyin B.
  - Tugagach: ✓ Vaqt tugadi — aytib bo'ldingiz. Barakalla! / ✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla! · ↻ Yana 30 soniya / ↻ Yana 1 daqiqa
- 2-qadam: ✍️ Endi shu javobni bir qatorda yozing · placeholder «Olti oydagi ishim ... kutyapti»
- Yozgach: ✓ Endi siz har ishga «buni bugun boshlab bo'ladimi?» degan savol bilan qaraydigan bo'ldingiz. · 🎯 Bugungi qoida: ish o'zi kutgan narsa tayyor bo'lganda boshlanadi
- Tugma: Davom etish
- Mentor-eslatma: Uchdan biri «nimani kutyapti» savoliga javob berolmasa — uch ufq yo'li ekranini qayta oching va to'xtagan uch ishni birga o'qing.

## 13 · Natijalar (podium)  `[2336]`
- Eyebrow: Natijalar · Sarlavha: **Bugungi natijangiz** (yakka) / **Bugungi g'oliblarimiz** (jonli)
- Yakka: ball-halqa + 🏅 Nishonlar · «Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruh reytingi va 🥇🥈🥉 eng yaxshi uchtalik (podium) chiqadi.»
- Jonli: Natijalar kelmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin (N/4 to'g'ri) · 🏆 To'liq reyting · savol-yorliqlari: 1 — Ufq nimani aytadi · 2 — Ish nimani kutadi · 3 — Uzoq reja · 4 — Yakuniy savol
- Mentor-eslatma: G'oliblarni nomlab tabriklang — arena yakun sahifasida ochiladi.

## 14 · Takrorlash (kartochkalar)  `[1732]` (kartalar `[1720]`)
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Ufq nima? | Ishlar qachon boshlanishiga qarab bo'lingan bo'lak | — |
| Rejada nechta ufq bor? | Uchta: hozir · uch oydan keyin · olti oydan keyin | — |
| Ishni ufqqa nima qo'yadi? | Unga kerak narsa qachon tayyor bo'lishi | — |
| Ish qachon boshlanadi? | O'zi kutgan narsa tayyor bo'lganda | — |
| «Olti oydan keyin» ufqi nimani bildiradi? | Ish olti oydan keyin boshlanadi — olti oy davom etmaydi | — |
| Qaysi ufqda ish ko'p turadi? | Eng yaqinida — «hozir» ufqida | — |
| «Hozir» ufqiga qanday ish yoziladi? | Bugun boshlanadigani — hech narsa kutmaydigani | — |
| Tesla rejasi qaysi mashinadan boshlangan? | Oz sonda chiqarilgan qimmat sport-mashinadan (2006) | — |
| Tesla keyingi mashinani nima bilan qurgan? | Birinchi mashinadan tushgan pul bilan | — |
| Nechta odam so'ragani nimani aytadi? | Bitta ufq ichida qaysi ish oldin qilinishini | — |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · N/N karta yodlandi · ↻ Qaytadan takrorlash · Davom etish

## 15 · Yakun  `[2434]`
- Eyebrow: Dars yakuni · ✓ Dars tugadi
- Sarlavha: **Uch qatorli rejangizni yozdingiz.** (+ ball-halqa)
- Bugungi asosiy fikr — Ishni ufqqa bizning xohishimiz emas, uning kutayotgan narsasi qo'yadi.
- CodeStrike arena tugmasi · ⏳ Mentorni kuting
- ✓ Endi siz bilasiz:
  - Ishlar qachon boshlanishiga qarab bo'lingan bo'lak — ufq.
  - Ish o'zi kutgan narsa tayyor bo'lganda boshlanadi.
  - Yaqin ufqda ish ko'p turadi, uzoq ufqda esa oz.
  - Uzoq rejani kod emas, mahsulotni o'ylaydigan odam yozadi.
- 🏅 Nishonlaringiz — N/4
- Uyga vazifa (kapsula: «Uyga vazifa · Amaliy topshiriqni bajarish →», ochilganda oyna):
  - 📝 Uyda nima qilasiz? — Uyda rejangizni davom ettirasiz: ufqlarga yangi ishlar qo'shasiz va uzoq ufqdagi ish nimani kutayotganini yozasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.
  - Variantlar: To'liq · ~20 daqiqa · Qisqa · ~10 daqiqa · (tanlanmaguncha) 👆 Avval variantni tanlang — topshiriq-karta shunga moslashadi.
  - 🗂 Topshiriq kartasi · TO'LIQ — Nechta: 3 ta ish · Muddat: keyingi darsgacha · 1) Uch ufqli rejangizni oching 2) Har ufqqa yana bitta ish qo'shing 3) «Olti oydan keyin» ishingiz nimani kutayotganini bir gap bilan yozing
  - 🗂 Topshiriq kartasi · QISQA — Nechta: 1 ta ish · Muddat: keyingi darsgacha · 1) Uch ufqingizdan bittasini tanlang 2) Unga yana bitta ish qo'shing 3) Nega o'sha ufqda turishini bir gap bilan yozing
- Keyingi dars matni: yo'q (bu darsda «keyingi dars» qatori yozilmagan)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Mentor-eslatma: Arena tugagach g'oliblarni nomlab tabriklang. Uy-vazifa: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa variant. Muddat — keyingi darsgacha. Tekshirishda bitta savolga qarang: uzoq ufqdagi ish nimani kutayotgani yozilganmi?

---

## Qo'shimcha matnlar

**Nishonlar (4):** Road Builder! — Uch ufq yo'lini oxirigacha yurdingiz (4) · Plan Writer! — Uch ufqqa uchta ishni yozdingiz (8) · Horizon Master! — Oltita ishni ufqlarga joyladingiz (9) · Code Planner! — Rejani kod bilan ufqlarga ajratdingiz (10)
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Yangi nishon · bosib davom eting

**Qisqa takrorlash oynalari (4):**
1. (3-ekran) Ufq ishning boshlanish paytini aytadi: 🛣 Ufq nima — Ishlar qachon boshlanishiga qarab bo'lingan bo'lak — ufq. Rejada uch ufq bor: hozir · uch oydan keyin · olti oydan keyin. · ⏱ Uzunlik emas, boshlanish — «Olti oydan keyin» degani ish olti oy davom etadi degani emas — u olti oydan keyin boshlanadi. · 🙋 Savolni ishga bering — Har ishga bitta savol: buni bugun boshlab bo'ladimi? Javob «yo'q» bo'lsa, ish uzoqroq ufqda turadi. (savol: Rejangizdagi qaysi ish bugun boshlanadi?)
2. (5-ekran) Ish kutgan narsasini kutadi: 🚦 Ish qachon boshlanadi — Ish o'zi kutgan narsa tayyor bo'lganda boshlanadi. Kutgan narsasi yo'q ish esa bugunoq boshlanadi. · ⭐ Baho real navbatlarni kutadi — Sartaroshga baho qo'yish uchun odam avval navbat olishi kerak. Navbat hali yo'q — shuning uchun ish to'xtadi. · 🔎 Nimasi yetishmayapti — To'xtagan ishga ikkinchi savol beriladi: nimasi hali yo'q? Javob ishning ufqini o'zi ko'rsatadi. (savol: Tizimingizdagi qaysi ish nimanidir kutyapti?)
3. (7-ekran) Uzoq reja bir varaqqa sig'adi: 📜 Tesla misolida — Tesla — elektr avtomobil ishlab chiqaradigan kompaniya. 2006-yilda u uch bosqichli uzoq rejasini bir varaqqa yozdi va uni hammaga ochiq e'lon qildi. · 🚗 Har bosqich oldingisini kutdi — Qimmat mashinadan tushgan pulga arzonrog'i, undan tushgan pulga eng arzoni qurildi. Reja o'n yildan ortiq bajarildi. · 📄 Reja yashirin qog'oz emas — Uzoq reja hamma ko'radigan varaq bo'ladi: unda nima bugun boshlanishi va nima keyinroq boshlanishi yozilgan. (savol: Rejangizni ochiq aytsangiz, kim yordam bera oladi?)
4. (11-ekran) Ufqni kerak narsa hal qiladi: 🧭 Joylash mezoni — Ishni ufqqa unga kerak narsaning tayyor bo'lish payti qo'yadi — bizning xohishimiz emas. · 👥 Nechta odam so'ragani — Nechta odam so'ragani bitta ufq ichida qaysi ish oldin qilinishini aytadi. Ufqni esa odamlar soni emas, kerak narsaning tayyor bo'lish payti tanlaydi. · 🛣 Rejaning shakli — Yaqin ufqda ish ko'p turadi, uzoq ufqda esa oz — reja shunday ko'rinadi. (savol: Uzoq ufqdagi ishingiz nimani kutyapti?)

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. To'garak uchun reja yozyapsiz. Ishlar nimaga qarab ufqlarga bo'linadi? ✔ Ish qachon boshlanishiga qarab · Ish qancha vaqt olishiga qarab · Ishni qancha odam so'raganiga qarab · Ishni qaysi o'quvchi boshlashiga qarab
2. Bitta yo'lda nechta ufq bo'ladi? Ikkita ufq · Beshta ufq · Oltita ufq · ✔ Uchta ufq
3. To'garak rejangizdagi ish qaysi ufqda turishini nima belgilaydi? Ishning bajarilishi necha kun olishi · Ishning qancha odamga kerak bo'lishi · ✔ Ishning kutgan narsasi qachon tayyor bo'lishi · Ishning ro'yxatga qachon qo'shilgani
4. To'garak saytida «eng yaxshi ishlar» sahifasi nega bugun boshlanmaydi? Uni yozish juda uzoq vaqt oladi · ✔ Ko'rsatadigan ishlar hali yig'ilmagan · Uni kam odam kutayotgani uchun · U rejaga keyinroq qo'shilgan
5. «Sartarosh suratlari» nega bugun boshlangan? Suratlar eng oson ish bo'lgani uchun · ✔ Suratlar allaqachon bor — hech narsa kutmaydi · Suratlarni ko'p odam kutayotgani uchun · Suratlar navbatlar to'plangach kerak bo'ladi
6. Do'stingiz «bu ish olti oydan keyin» dedi. U nimani aytdi? ✔ O'sha paytda ish boshlanadi · O'sha paytda ish tugab bo'ladi · Ish olti oy davomida qilinadi · Ish olti oydan beri kutib turibdi
7. Sinf ovoz berib, uzoq ishni «Hozir» ufqiga ko'chirdi. Nima bo'ladi? Boshlanadi — ko'pchilik shuni tanladi · Boshqa ish uning o'rniga kutib qoladi · ✔ Baribir kutadi — kerak narsa hali yo'q · Baribir boshlanadi, lekin sekinroq yuradi
8. Uch ufqli yo'l qanday ko'rinadi? Uzog'ida ish ko'p, yaqinida oz · Uchala ufqda ham ish teng bo'linadi · Faqat o'rtadagi ufqda ish to'planadi · ✔ Yaqinida ish ko'p, uzog'ida oz
9. Tesla usuli bilan reja yozsangiz, birinchi bosqich qanday bo'ladi? ✔ Eng tez boshlanadigani — u keyingisiga yo'l ochadi · Eng kattasi — uni hamma birdan ko'radi · Eng arzoni — unga pul deyarli ketmaydi · Eng qiyini — qiyin ish oldin boshlanadi
10. Tesla birinchi mashinasini sotmaganida nima bo'lardi? Reja o'zgarmasdi — ikkinchisi baribir qurilardi · Ikkinchisi bir yil oldin qurilardi · ✔ Ikkinchisiga puli bo'lmasdi — reja to'xtardi · Uchinchisi ikkinchisidan oldin qurilardi
11. Tesla uzoq rejasini kimlar ko'ra olardi? Faqat kompaniya ichidagilar · ✔ Xohlagan har bir odam · Mashina sotib olganlar · Hech kim — reja yopiq edi
12. Yangi ish qaysi ufqqa tushishini kim aytadi? Kodni yozadigan dasturchi · Ilovani yuklab olgan odam · Ma'lumotlarni saqlaydigan server · ✔ Mahsulotni o'ylaydigan odam

---

## Mening dastlabki belgilarim (qonun-ro'yxatlar bo'yicha — faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **11-ekran to'g'ri-izohi o'z javobini tushuntirmaydi:** ✔ «Kerak narsa qachon tayyor bo'lishi» tanlanganda «Odamlar soni ufqni tanlamaydi — u bitta ufq ichida…» chiqadi, ya'ni xato variant haqida gapiradi
- **Tesla izohsiz:** 6-ekranda «Tesla nima?» aytilmaydi; «elektr avtomobil ishlab chiqaradigan kompaniya» izohi faqat 7-ekranning qisqa takrorlash oynasida bor
- **Kod-atamalar izohsiz (10-ekran):** «maydon» (xatodan keyingi ipucha), «sikl» / «ikkinchi sikl», «terminal», `reja[3].ufq`, `if (… === …)` — 87-qonun bo'yicha o'tilgan bo'lsa ham, bu ekranda birorta gloss yo'q
- **Bir narsaga ikki nom:** reja = «yo'l» («uch ufq yo'li», viktorina 2 «Bitta yo'lda nechta ufq», 8 «Uch ufqli yo'l») · ufq = «bo'lak» (2-ekran, kartochka 1) · Tesla qismlari = «bosqich» — o'quvchi uchun «ufq», «bo'lak», «bosqich» aralashishi mumkin
- **Bir xil eyebrow ikki joyda:** 0-ekran «Kirish · yangi oltita ish» va 9-ekran «Tekshiruv · yangi oltita ish» — oltita ish har xil to'plam (9-ekran «yangi oltita ish» ni ikki marta aytadi: eyebrow + mentor + sahna)
- **Test «sotilishi»:** 3-ekranda ✔ variant yagona «bugun emas» deydi, qolgan ikkalasi «bugun boshlanadi» bilan boshlanadi — shakldan topiladi · 7-ekranda ✔ «bir varaq» — darsda 6-ekran bo'yi takrorlangan kalit so'z, faqat to'g'ri javobda bor
- **Nishon nomlari inglizcha izohsiz:** Road Builder! · Plan Writer! · Horizon Master! · Code Planner! (loyihadagi umumiy naqsh, lekin tarjimasiz)
- **Yakunda «keyingi dars» qatori yo'q** (boshqa darslar yakunida 🚀 Keyingi dars matni bor)
