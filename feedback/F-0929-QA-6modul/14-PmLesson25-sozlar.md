# 6-Modul (LMS: 8-Modul) · 14-dars «Raqamingiz nimani isbotlaydi?» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/PmLesson25.jsx` · 16 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook (0-ekran):** Demo Day sahnasi. Ekrandagi slaydda faqat «41» yozilgan, ostida ikki bo'sh qator. O'quvchi slayd nima qilishini tanlaydi: «ko'zga tashlanadi» yoki «savol tug'diradi». Qaysi birini tanlasa ham bir xil javob ochiladi: ikkalasi ham to'g'ri, lekin yolg'iz raqam *nimaning* 41 tasi ekanini aytmaydi.
- **Markaziy mexanika:** «gapiradigan slayd». Slaydning uch qatori (raqam · nimani sanadi · nimani ko'rsatadi) birma-bir ochiladi. Keyin ikki rost raqamdan (9 va 12) bittasi tanlanadi. So'ng o'quvchi o'z slaydini yozadi, uch juftlikda raqam tanlaydi va shu tanlovni kodda yozadi (`isbotlar` funksiyasi).
- **Asosiy metafora:** isbot (tizim odam uchun qilgan ishni sanagan raqam) va shovqin (faqat mehnatingizni sanagan raqam). Yana «raqamni gapirtirish», sahnada «bitta joy».
- **Haqiqiy voqea:** Airbnb'ning birinchi taqdimot varaqlari. Besh qadamdan faqat bittasi raqam bilan gapirgan va u uchinchi o'rinda, qiyinchilik va yechimdan keyin turgan.
- **Yakun:** «Sahnaga chiqadigan slaydingiz yozildi». Keyin arena, nishonlar va Demo Day'ga tayyorlanish uchun uy vazifasi (to'liq yoki qisqa varianti bor).

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — Demo Day sahnasi | hook | «41» slaydi nima qilishini tanlaydi (ikkala javob ham bir xil ochiladi) | — |
| 1 | Maqsad | qoida | uch qatorli namuna-slayd (8 · …) o'zi yozilib chiqadi | — |
| 2 | Ikki karta | tushuncha | «Men qilgan ish» va «Tizim odam uchun qilgan ish» kartalarini ochib solishtiradi | — |
| 3 | 1-savol | test | uch raqamdan qaysi biri tizim ishlaganini ko'rsatadi | ✅ |
| 4 | Slaydning uch qatori | markaziy | 3 qatorni birma-bir ochadi, keyin 9 va 12 dan bittasini tanlaydi | — |
| 5 | 2-savol | test | uchinchi qator nimani yozadi | ✅ |
| 6 | Haqiqiy voqea · Airbnb | case | 6 bosqich: 2 ta taxmin, besh qadam | — |
| 7 | 3-savol | test | Airbnb raqami qiyinchilik haqida nimani ko'rsatgan | ✅ |
| 8 | Mustaqil ish · uch qator | amaliyot | o'z tizimi uchun slaydning uch qatorini yozadi | — |
| 9 | Uch juftlik | praktika | 3 juftlikda slaydga chiqadigan raqamni tanlaydi | — |
| 10 | Koding | koding | isbot qoidasini tanlaydi, keyin kompilyatorda `isbotlar` funksiyasini yozadi | — |
| 11 | Yakuniy savol | test (final) | sahnaga chiqadigan raqam qanday tanlanadi | ✅ |
| 12 | Mustahkamlash | refleksiya | slaydini yoddan aytadi (taymer), bir qator yozadi | — |
| 13 | Natijalar | podium | shaxsiy natija / jonli reyting | — |
| 14 | Takrorlash | kartochkalar | 10 ta kartochka | — |
| 15 | Dars yakuni | xulosa | 4 xulosa + arena + nishonlar + uy vazifasi | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 4 ta (3/5/7/11-ekranlar); nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
sahna · Demo Day · slayd (taqdimotning bitta sahifasi) · uch qator (raqam · nimani sanadi · nimani ko'rsatadi) · isbot · shovqin · mehnat ·
tizim odam uchun qilgan / bajargan ish · odam ishini sanagan raqam · raqamni gapirtirish · ishni oxirigacha bajarish · rost raqam ·
bitta joy · juftlik · Airbnb varaqlari · raqamli qadam · qiyinchilik · yechim

---

## 0 · Kirish — Demo Day sahnasi  `[659]`
- Eyebrow: Kirish · Demo Day sahnasi
- Sarlavha: **Sahnadagi bu slayd nima qiladi?**
- Mentor: Demo Day: modul oxirida siz ham shu sahnaga chiqasiz. Ekranda bitta slayd — taqdimotning bitta sahifasi — turibdi, unda faqat 41 yozilgan.
- Slayd: 🎤 Sahna ekrani · **41** · (ikki bo'sh qator)
- Tanlov:
  - 💥 Ko'zga tashlanadi — katta raqam darrov ko'rinadi
  - ❓ Savol tug'diradi — odam «41 nima?» deb so'raydi
- Javobdan keyin (ikkalasida bir xil): Ikkalasi ham bo'ladi: katta raqam darrov ko'rinadi va savol tug'diradi. Yolg'iz raqam esa javob bermaydi — u **nimaning** 41 tasi ekanini aytmaydi. Bugun raqamni gapirtirasiz: yoniga shu savolning javobini yozasiz.
- Jonli darsda: ovozlar diagrammasi (har variant yonida son)
- Tugma: Bittasini tanlang → Davom etish
- O'qituvchi eslatmasi: Ovozlar bo'linadi — ikkala tomonning ham dalili bor. Javob ochilgach bitta savol bering: «41 nimaning 41 tasi?» — javob yo'qligi darsga eshik ochadi.

## 1 · Maqsad  `[748]`
- Eyebrow: Maqsad
- Sarlavha: **Bugun sahna uchun bitta slayd yozasiz.**
- Mentor: Pastdagi slaydni kuzating.
- Slayd (o'zi yozilib chiqadi, har qator ✅ bilan):
  1. **8** — *raqam*
  2. odam tizimdan foydalandi — *nimani sanadi*
  3. demak tizim odamlarning ishini bajarib berdi — *nimani ko'rsatadi*
- Tugmalar: Orqaga · Boshlaymiz →
- O'qituvchi eslatmasi: Uch qator yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.

## 2 · Ikki karta  `[774]`
- Eyebrow: Muhokama · ikki karta
- Sarlavha: **Qaysi raqam sahnada gapira oladi?**
- Mentor: Ikki kartada bitta tizim haqidagi oltita raqam turibdi. Bosib solishtiring.
- Kartalar (yopiq holatda «· · ·»):
  - 🔧 **Men qilgan ish** — 312 ta kod satri yozildi · 5 hafta ishlandi · 7 ta sahifa qilindi
  - 👥 **Tizim odam uchun qilgan ish** — 41 odam tizimni ochdi · 9 odam telefondan ochdi · 12 odam arizasiga javob oldi
- Ikkala karta ochilgach xulosa:
  - **Tizim odam uchun nima qilganini sanab turgan raqam — isbot.**
  - Faqat mehnatingizni sanaydigan raqam esa shovqin: u quloqni band qiladi, lekin hech narsani isbotlamaydi.
- Tugma: 👆 Yana N kartani oching → Davom etish

## 3 · 1-savol ✅  `[815]`
- Eyebrow: Tekshiruv · qaysi raqam ko'rsatadi
- Savol: **Sahnadagi slaydga uch raqam taklif qilindi. Qaysi biri tizim ishlaganini ko'rsatadi?**
  - Uch odam tizimni qurishga yordam berdi
  - ✔ Uch odam ariza yuborib javob oldi
  - Uch hafta ariza formasiga ketdi
- To'g'ri izoh: Qolgan ikkitasi tizim qanday qurilganini sanaydi.
- Xato izohlari:
  - (1) Bu uch odam tizimni qurgan — raqam yana mehnat tomonini sanadi.
  - (3) Uch hafta — ishga ketgan vaqt; u tizim odam uchun nima qilganini aytmaydi.
  - (umumiy) Tizim odam uchun nima qilganini sanagan raqam ishlaganini ko'rsatadi.
- Tugma: Javobni tanlang

## 4 · Slaydning uch qatori (markaziy)  `[848]`
- Eyebrow: Amaliyot · slaydning uch qatori
- Sarlavha: **Slaydning qatorlarini birma-bir oching.**
- Mentor: Har qatordan keyin pastdagi javob-qatorini o'qing: slayd shu payt nima aytdi?
- Qator tugmalari: 1 raqam · 2 nimani sanadi · 3 nimani ko'rsatadi (joriy qatorda «bosing»)
- Javob-qatori:
  - boshida: Birinchi qatorni oching — javob shu yerda yoziladi.
  - 1-qatordan keyin (slaydda **41**): 🤔 Slayd bitta narsa aytdi: 41. Nimaning 41 tasi ekani noma'lum.
  - 2-qatordan keyin (slaydda «odam tizimni ochdi»): 🤔 Endi ma'lum: 41 odam ochgan. Bu tizim haqida nima ko'rsatishi hali aytilmagan.
  - 3-qatordan keyin (slaydda «demak odamlar tizimni ochib ko'rgan»): ✅ Slayd to'liq gapirdi: raqam, nimani sanagani va nimani ko'rsatgani.
- 42 soniya jim tursa: 💡 Keyingi qatorni oching — slayd yana nima aytishini ko'ring.
- 2-bosqich savoli: Ikkalasi ham odam bilan bog'liq. Sahnada bitta joy bor — qaysi biri tizim ishlaganini ko'proq ko'rsatadi?
  - **9** odam tizimni telefondan ochdi → Ochish — ishning boshlanishi. Tizim ishni oxirigacha bajarganini 12 ko'rsatadi.
  - ✔ **12** odam arizasiga javob oldi → ✅ Ariza javob olgan — demak tizim ishni oxirigacha bajarib bergan.
- Xulosa: **Buni o'zingiz ko'rdingiz: raqam uch qator bilan gapiradi.** Ikkita rost raqamdan sahnaga tizim ishni oxirigacha bajarganini ko'rsatgani chiqadi.
- Tugma: ① Yana N qatorni oching → ② Ikki raqamdan bittasini tanlang → Davom etish
- Mentor paneli (jonli): 🎤 Slaydni ochganlar
- O'qituvchi eslatmasi: Bolalar uchinchi qatorni ochib to'xtaydi. Ikki raqamli savol chiqqach «endi bittasini tanlang» deb turtki bering — qaror aynan shu lahzada. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 5 · 2-savol ✅  `[970]`
- Eyebrow: Tekshiruv · uchinchi qator
- Savol: **⌨️ Slaydda raqam va u nimani sanagani turibdi. Odam yana nimani bilishi kerak?**
  - Bu raqam siz haqingizda nima deyishini
  - Bu raqamni tizim qanday sanaganini
  - ✔ Bu raqam tizim haqida nima deyishini
- To'g'ri izoh: Shu qatordan keyingina slayd to'liq gapiradi.
- Xato izohlari:
  - (1) Slayd sizni emas, tizimni tanishtiradi.
  - (2) Bu ish ichida qoladi — sahnadagi odamga kerak emas.
  - (umumiy) Uchinchi qator raqam tizim haqida nimani ko'rsatishini aytadi.

## 6 · Haqiqiy voqea · Airbnb  `[1021]`
- Eyebrow: 🏠 Haqiqiy voqea
- Sarlavha: **Bizning olamdan mashhur voqea**
- Tepada 6 ta bosqich doirasi (taxmin topilsa 🎯, topilmasa ⚪)
- 1/6 🏠 **Airbnb — odam boshqa birovning uyida ijaraga turadigan sayt** — O'z ishini birinchi marta tushuntirganda qo'lida **o'nga yaqin oddiy varaq** bor edi.
- 2/6 🎲 Avval o'zingiz belgilab ko'ring · **O'sha varaqlarning bittasi raqam bilan gapirgan. Sizningcha, u raqam nimani ko'rsatgan?**
  - 🏘 Saytda nechta uy borligini
  - ✔ 😣 Qiyinchilik qancha odamda borligini
  - 👨‍👩‍👧 Jamoada nechta odam ishlaganini
  - Topsa: 🎯 Topdingiz! Qiyinchilik qancha odamda borligini · Topmasa: Adashdingiz — asl javob: qiyinchilik qancha odamda borligini
- 3/6 📄 **Raqam qaysi varaqda turgan** — Varaqlardan biri — «yechimni qancha odam kutayotgani». Raqam o'sha yerda turgan: u **qiyinchilik qancha odamda borligini** ko'rsatgan.
- 4/6 🎲 **O'sha varaqlar besh qadamga bo'lingan. Sizningcha, raqamli qadam qayerda turgan?**
  - 1️⃣ Eng birinchi qadamda — hammasidan oldin
  - ✔ ➡️ Qiyinchilik va yechimdan keyin
  - 🔚 Eng oxirgi qadamda — jamoadan keyin
  - Topsa: 🎯 Topdingiz! Qiyinchilik va yechimdan keyin · Topmasa: Adashdingiz — asl javob: qiyinchilik va yechimdan keyin
- 5/6 🪜 **Raqamli qadam o'rtada turgan** — Besh qadam shunday bo'lgan: 1 odamlarning qiyinchiligi · 2 yechim · **3 yechimni qancha odam kutayotgani** · 4 mahsulot, ya'ni saytning o'zi · 5 jamoa — Besh qadamdan faqat bittasi raqam bilan gapirgan — u **uchinchi o'rinda**, qiyinchilik va yechimdan keyin turgan.
- 6/6 📚 **Raqam yolg'iz turmagan** — U qiyinchilikning davomi bo'lgan. O'sha varaqlar bugungacha internetda ochiq turibdi — ular eng ko'p o'rganiladigan taqdimotlardan biri.
- 7/7 (ko'prik): Airbnb varag'ida raqam yolg'iz turmagan: u qiyinchilik qancha odamda borligini ko'rsatgan. Sahnaga chiqadigan slaydingizda ham shunday bo'ladi — raqam nimani sanaganini va nimani ko'rsatishini o'zi bilan olib chiqadi. Buni kod emas, mahsulotni o'ylaydigan odam hal qiladi.
  - (Eslatma: `K12_SLIDES` da 7 element bor — hisoblagich «N / 7» ko'rsatadi.)
- Tugma: Avval o'zingiz belgilang · Keyingi bosqich (N/7) → Davom etish
- O'qituvchi eslatmasi: Bu voqeada varaqdagi raqamning nechaligi aytilmaydi — bolalar so'rasa ochiq ayting: o'sha son bizgacha yetib kelmagan, bizga qadamning o'zi muhim. Taqqoslash musobaqasiga aylantirmang.

## 7 · 3-savol ✅  `[1105]`
- Eyebrow: Tekshiruv · Airbnb varag'i
- Savol: **Airbnb varag'idagi raqam qiyinchilik haqida nimani ko'rsatgan?**
  - ✔ Qiyinchilik qancha odamda borligini
  - Qiyinchilik qanchalik qiyinligini
  - Qiyinchilik ustida qancha odam ishlaganini
- To'g'ri izoh: U qiyinchilikning kattaligini aytgan.
- Xato izohlari:
  - (2) Qiyinchilik qanchalik qiyinligi varaqda umuman aytilmagan.
  - (3) Qiyinchilik ustida ishlagan odamlar — bu jamoa qadami, raqamli qadam emas.
  - (umumiy) Raqamli qadam qiyinchilik qancha odamda borligini ko'rsatgan.

## 8 · Mustaqil ish · uch qator  `[1154]`
- Eyebrow: Mustaqil ish · uch qator
- Sarlavha: **Sahnaga chiqadigan slaydni yozing.**
- Kirish qatori: 🧭 Yo'lingizda hozir turgan ish: «[12-darsdan saqlangan ish]» *(saqlanmagan bo'lsa: Hozir turgan ish: «tizimni odamlarga ko'rsatish»)*. Tizimingiz shu ishni bajarganini qaysi raqam ko'rsatadi?
- Mentor: Uchta qatorni birma-bir to'ldiring — slayd yonma-yon yozilib boradi.
- Qadam doiralari: 1 raqam · 2 nimani sanadi · 3 nimani ko'rsatadi
- Kiritish maydoni (placeholder): Qaysi raqam sahnaga chiqadi? → Bu raqam nimani sanadi? → Bu raqam tizim haqida nima deydi?
- Tekshiruv xabarlari:
  - 1-qatorda son bo'lmasa: 🤔 Birinchi qatorga son yozing — sahnada raqam turadi.
  - 2-qatorda mehnat so'zi bo'lsa (kod, satr, hafta, soat, ekran, dastur, sahifa): 🤔 Bu raqam mehnatingizni sanabdi. Tizim odam uchun nima qilganini sanaydigan raqam toping.
  - 3-qator 2-qatorni takrorlasa: 🤔 Uchinchi qator yangi narsa aytsin: shu raqam tizim haqida nimani ko'rsatadi?
  - 3-qator «men…» bilan boshlansa: 🤔 Uchinchi qator tizim haqida gapirsin — sahnada tizim ishlagani ko'rinishi kerak.
  - Saqlangach: ✅ «raqam / nimani sanadi / nimani ko'rsatadi» qatori slaydga chiqdi.
- Tugma: Slaydga chiqarish → · (tahrirda) ✓ Yangilash
- Doimiy qator: Yo'q raqamni o'ylab topmaysiz — bor raqamni gapirtirasiz.
- O'ngda: 🎤 Sahnaga chiqadigan slaydingiz (✎ Tahrirlash)
- 🎯 Topshiriq · **Uch qator — bitta slayd** · ○/✓ Raqam yozilgan · ○/✓ Odam foydalangani sanalgan · ○/✓ Tizim haqida yangi gap
- 💡 Yordam: Sanashni ikki joydan boshlang: tizimingizni kimdir sinab ko'rgan bo'lsa — **o'sha odamlar soni**; hali sinamagan bo'lsa — **tizim bajarib bergan ishlar soni**.
- ⭐ Qo'shimcha: Ikkinchi slayd yozing: shu tizim haqidagi boshqa raqam bilan.
- Tugagach: ✅ Uch qator ham joyida: raqam, u nimani sanagani va nimani ko'rsatgani.
- Tugma: ① Sahnaga chiqadigan raqamni yozing → ② Bu raqam nimani sanaganini yozing → ③ Bu raqam nimani ko'rsatishini yozing → Davom etish
- Mentor paneli (jonli): ✍️ Slaydni yozganlar
- O'qituvchi eslatmasi: «312 ta kod satri» turidagi javoblar chiqadi — bu eng foydali xato. Javob-qatori uni tutadi, siz so'rang: shu raqam tizim odam uchun nima qilganini aytyaptimi? …

## 9 · Uch juftlik  `[1309]`
- Eyebrow: Tekshiruv · uch juftlik
- Sarlavha: **Har juftlikdan slaydga chiqadigan raqamni tanlang.**
- Mentor: Slaydingiz tayyor — endi shu qoidani uch juftlikda qo'llaymiz. Har juftlikda slaydda bitta joy bor: qaysi raqam tizim ishlaganini ko'proq ko'rsatadi?
- Hisoblagich: 1 / 3
- Juftliklar (tanlagach har kartada izoh chiqadi):
  1. 312 ta kod satri yozildi (*312 mehnatingizni sanadi*) · ✔ 41 odam tizimni ochdi (*41 tizimdan foydalangan odamlarni sanadi*)
  2. ✔ 9 odam telefondan ochdi (*9 tizim telefonda ham ishlaganini ko'rsatdi*) · 7 ta sahifa qilindi (*7 sizning ishingiz*)
  3. 41 odam tizimni ochdi (*41 ishning boshlanishini sanadi*) · ✔ 12 odam arizasiga javob oldi (*12 tizim ishni oxirigacha bajarganini sanadi*)
- Nishon qatori: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- To'g'ri: ✅ Sahnaga shu raqam chiqadi — u tizim odam uchun bajargan ishni sanadi.
- Xato: 🤔 Bu raqam ham rost, lekin sahnaga tizim odam uchun bajargan ishni sanagani chiqadi.
- Tugma: Keyingisi ▸ / Yakunlash ▸
- Birinchi xatodan keyin 💡 Yordam: Bitta savol bering: bu raqam **kimning ishini** sanadi — tizimni qurgan odamningmi, tizimdan foydalangan odamningmi?
- Tugagach: 1-juftlik *41 odam tizimni ochdi* · 2-juftlik *9 odam telefondan ochdi* · 3-juftlik *12 odam arizasiga javob oldi*
  - ✅ Sahnaga tizim odam uchun bajargan ishni sanagan raqam chiqadi — ikkala raqam ham shunday bo'lsa, tizim ishni oxirigacha bajarganini sanagani chiqadi.
- Tugma: ① Yana N juftlikda raqam tanlang / ② Keyingi juftlikka o'ting → Davom etish
- Mentor paneli (jonli): ⚖️ Juftliklarni tanlaganlar
- O'qituvchi eslatmasi: Eng ko'p adashiladigan joy — uchinchi juftlik… Juftlikda ishlating: har o'quvchi sherigining slaydini o'qib, uchinchi qatorga bitta savol beradi — «shu raqam tizim haqida nimani ko'rsatyapti?»; javob topilmasa, uchinchi qator qayta yoziladi. …

## 10 · Koding  `[1472]`
- Eyebrow: Koding · 🛠 kod oynasi
- Sarlavha: **Isbot beradigan raqamlarni ajratadigan kod yozamiz.**
- **1-bosqich (qoida):**
  - Mentor: Hozirgina uch juftlikni qo'lda ajratdingiz — endi o'sha ishni kod bajaradi. Raqamlar o'sha tizimniki.
  - 🔎 **Isbot beradigan raqam nimani sanaydi?**
    - ⏳ Tizimni qurishga ketgan umumiy vaqtni
    - ✔ 👥 Tizim odam uchun bajargan ishni
    - 📄 Tizim kodidagi satrlar sonini
  - Xato bosilsa: 🤔 Bu raqam mehnatni sanaydi. Tizim odam uchun nima qilganini sanaydigan javobni toping.
- **2-bosqich (kod):**
  - Mentor: Qo'lda bosgan tanlovingiz endi kodda bitta savolga aylanadi: bu raqam odam ishini sanadimi?
  - ✓ Isbot — tizim odam uchun bajargan ishni sanagan raqam
  - Kod nima qilsin: 1) Funksiya ro'yxat (massiv) qaytaradi · 2) Faqat odam ishini sanagan raqam tushadi · 3) Uch natija to'g'ri chiqdi
  - 💡 Yordam: Bitta yozuvdan boshlang: birinchi raqamning `sanagani` qiymati `"odam"` mi? Ishlagach qolganlariga o'ting. · ⭐ Qo'shimcha: `royxat` ga o'z tizimingizdan bitta raqam qo'shing va natijada chiqishini ko'ring.
  - 🧮 To'rt raqam — bitta kod bo'lagi · Kompilyator — kod yoziladigan oyna: chapda kod, o'ngda natija.
  - Tugma: 🛠 Kompilyatorni ochish / ↻ Kompilyatorni qayta ochish · «Bajarildi — xohlasangiz kodni yana sayqallang»
  - Yakka rejimda: ✓ Bu kodni sinfda yozganman →
  - Tugagach: ✅ Uch natija to'g'ri chiqdi — kod endi isbotlarni o'zi ajratadi
- **Kompilyator ichida:**
  - Sarlavha: app.js — isbotlar funksiyasini yakunlang
  - Topshiriq: Kodda tayyor bo'lak turibdi — `isbotlar` funksiyasi. U odam ishini sanagan raqamlarni bitta ro'yxatga yig'ib qaytarsin. Har yozuvda avval `son`, keyin uning yonidagi `nima` tursin. Pastdagi `console.log` uch natijani ko'rsatadi.
  - Bo'sh maydon placeholder: `// odam ishini sanagan raqamlarni yigib qaytaring`
  - Boshlang'ich kod:
    ```js
    // Sahnadagi tizimning raqamlari (juftliklardan tanish)
    const royxat = [
      { son: 312, nima: "kod satri yozildi",         sanagani: "mehnat" },
      { son: 41,  nima: "odam tizimni ochdi",        sanagani: "odam"   },
      { son: 5,   nima: "hafta ishlandi",            sanagani: "mehnat" },
      { son: 12,  nima: "odam arizasiga javob oldi", sanagani: "odam"   }
    ];

    function isbotlar(raqamlar) {
      // Odam ishini sanagan raqamlarni bitta royxatga toplang: avval son, keyin nima.
      return [];   // shu joyni siz yozasiz
    }

    console.log(isbotlar(royxat));
    // ["41 odam tizimni ochdi", "12 odam arizasiga javob oldi"]
    console.log(isbotlar([]));
    // []
    console.log(isbotlar([royxat[1]]));
    // ["41 odam tizimni ochdi"]
    ```
  - Tekshiruv shartlari va xato xabarlari:
    1. Funksiya ro'yxat (massiv) qaytaradi — *Funksiya ro'yxat qaytarsin — to'rt raqamdan odam ishini sanagan ikkitasi ichiga tushsin*
    2. Faqat odam ishini sanagan raqam tushadi — *Har yozuv «son bo'shliq nima» ko'rinishida bo'lsin; mehnatni sanagan raqamlar tushmasin*
    3. Uch natija to'g'ri chiqdi — *Bo'sh ro'yxat kelsa natija ham bo'sh; bitta odam-raqami kelsa faqat o'sha chiqadi*
- Tugma: ① Isbot-qoidasini belgilang → ② Kodni yozing → Davom etish
- Mentor paneli (jonli): 🛠 Kodni yozib bo'lganlar
- O'qituvchi eslatmasi: Kod — juftliklardagi ishning to'g'ridan-to'g'ri tarjimasi… Kod shu oynada yoziladi — 10 daqiqa yetadi; ulgurmagan o'quvchi uyga qisqa variantni oladi. …

## 11 · Yakuniy savol ✅ (final)  `[1750]`
- Eyebrow: Yakuniy tekshiruv
- Savol: **Sahnaga chiqadigan raqam qanday tanlanadi?**
  - Sahnada eng katta ko'ringani tanlanadi
  - ✔ Tizim odam uchun qilganini sanagani tanlanadi
  - Tizim qurilishiga odam ko'p vaqt bergani tanlanadi
- To'g'ri izoh: Katta son ham, mehnat vaqti ham o'zi hech narsani isbotlamaydi.
- Xato izohlari:
  - (1) Odamga katta ko'ringan son sahnada savol tug'diradi, lekin javob bermaydi.
  - (3) Qurilishga ketgan vaqt mehnatingizni sanaydi — u sahnada boshqa ishni bajaradi.
  - (umumiy) Tizim odam uchun bajargan ishni sanagan raqam sahnaga chiqadi.

**Test ekranlari uchun umumiy yozuvlar (3/5/7/11):** Javobni tanlang · To'g'ri · To'g'ri javob · Qaytadan urinib ko'ring · Avval natijani oching · Hozir to'g'ri javobni bilib olasiz. · 📨 Javobingiz qabul qilindi · ⚡ Jonli dars — bitta urinish · Mentor hali bu sahifaga o'tmadi · ⏳ Mentorni kuting · 📖 Qisqa takrorlash

## 12 · Mustahkamlash  `[1645]`
- Eyebrow: Mustahkamlash · 2 qadam
- Sarlavha: **Slaydingizni yoddan ayta olasizmi?**
- Mentor: Ekranga qaramasdan javob bering: qaysi raqamni sahnaga chiqarasiz va u nimani ko'rsatadi? Avval ovoz chiqarib o'zingizga *(juftlikda: sherigingizga)* ayting, so'ng shu javobni bir qatorda yozing.
- 1-qadam: 🗣 Ovoz chiqarib ayting *(juftlikda: Sherigingizga ayting)*
  - Yakka: ▶ 30 soniyani boshlash · Hozir ovoz chiqarib ayting · ⏹ To'xtatish · ✓ Vaqt tugadi — aytib bo'ldingiz. Barakalla! · ↻ Yana 30 soniya
  - Juftlik: Har biringizga 30 soniyadan — avval A, keyin B. · ▶ 1 daqiqani boshlash · Hozir A gapiradi · keyin — B navbati · oxirgi navbat · ✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla! · ↻ Yana 1 daqiqa
- 2-qadam: ✍️ Endi bir qator yozing · placeholder: «Sahnaga ... chiqadi, u ... ko'rsatadi»
- Yozgach: ✓ Endi sahnaga chiqadigan raqamingizni ham, u nimani ko'rsatishini ham yoddan aytasiz. · 🎯 Bugungi qoida: sahnaga tizim odam uchun bajargan ishni sanagan raqam chiqadi.
- Tugma: Davom etish
- O'qituvchi eslatmasi: Uchdan biri uchinchi qatorni ayta olmasa — slayd ekranini qayta oching va uchinchi qatorni birga o'qing.

## 13 · Natijalar (podium)  `[2342]`
- Eyebrow: Natijalar · Sarlavha: **Bugungi natijangiz** (jonlida: **Bugungi g'oliblarimiz**)
- Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruh reytingi va 🥇🥈🥉 eng yaxshi uchtalik (podium) chiqadi.
- Jonlida: Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin (x/4 to'g'ri) · 🏆 To'liq reyting · 🏅 Nishonlar
- Savol yorliqlari: 1 — Qaysi raqam ko'rsatadi · 2 — Uchinchi qator · 3 — Airbnb varag'i · 4 — Yakuniy savol

## 14 · Takrorlash (kartochkalar)  `[1737]`
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Isbot beradigan raqam qanday raqam? | Tizim odam uchun nima qilganini sanab turgan raqam | — |
| Shovqin nimani sanaydi? | Faqat siz qancha ishlaganingizni | — |
| Gapiradigan slaydda nechta qator bor? | Uchta: raqam, u nimani sanadi, u nimani ko'rsatadi | — |
| Uchinchi qator nima yozadi? | Raqam tizim haqida nimani ko'rsatishini | — |
| Yolg'iz raqam sahnada nima qiladi? | Savol tug'diradi, lekin javob bermaydi | — |
| Ikki rost raqamdan qaysi biri sahnaga chiqadi? | Tizim ishni oxirigacha bajarganini ko'rsatgani | — |
| Airbnb varaqlarida raqamli qadam qayerda turgan? | Qiyinchilik va yechim aytilgandan keyin | — |
| O'sha raqam nimani ko'rsatgan? | Qiyinchilik qancha odamda borligini | — |
| Sanaydigan raqam topilmasa nima qilinadi? | Yo'q raqam o'ylab topilmaydi — bor raqam olinadi | — |
| «Raqamni gapirtirish» nima demak? | Yoniga u nimani sanagani va nimani ko'rsatishini yozish | — |

- Tugmalar: ↻ O'rganilmoqda · ✓ Bildim · ✗ Takrorlash · 🎉 Hammasini bilasiz! · 10/10 karta yodlandi · ↻ Qaytadan takrorlash · Davom etish

## 15 · Dars yakuni  `[2439]`
- Eyebrow: Dars yakuni · ✓ Dars tugadi
- Sarlavha: **Sahnaga chiqadigan slaydingiz yozildi.** (+ ball halqasi)
- Arena tugmasi (CodeStrike, 12 SAVOL) · ⏳ Mentorni kuting
- Endi siz bilasiz:
  - Tizim odam uchun nima qilganini sanab turgan raqam — isbot.
  - Faqat mehnatingizni sanaydigan raqam — shovqin: u sahnada hech narsani isbotlamaydi.
  - Gapiradigan slaydda uch qator bor: raqam, u nimani sanadi, u nimani ko'rsatadi.
  - Yo'q raqamni o'ylab topmaysiz — bor raqamni gapirtirasiz.
- 🏅 Nishonlaringiz — N/4
- **Uyga vazifa** · Amaliy topshiriqni bajarish →
  - 📝 Uyda nima qilasiz? — Uyda slaydingizni sahnaga tayyorlaysiz: tizimingizdan yana bitta raqam topib, unga ham uch qator yozasiz va ikkitasidan qaysi biri sahnaga chiqishini belgilaysiz. Demo Day — modulning oxirgi darsi: mehmonlar oldida uch daqiqa gapirasiz. Qancha vaqtingiz bor — o'zingiz tanlaysiz.
  - Variantlar: To'liq · ~20 daqiqa · Qisqa · ~10 daqiqa · (tanlanmaguncha) 👆 Avval variantni tanlang — topshiriq-karta shunga moslashadi.
  - 🗂 Topshiriq kartasi · TO'LIQ / QISQA
    - Nechta: bitta slayd — uch qator va tanlov sababi / bitta qator — uchinchisi qayta yoziladi
    - Muddat: Demo Day kunigacha
    - Raqam yo'q bo'lsa: tizim bajarib bergan ishlarni sanaysiz
    - To'liq qadamlar: 1) Tizimingizdan yana bitta raqam topib, unga uch qator yozing · 2) Ikki slayddan qaysi biri sahnaga chiqishini belgilang · 3) Sababda o'sha raqam kimning ishini sanaganini yozing
    - Qisqa qadamlar: 1) Slaydingizning uchinchi qatorini ovoz chiqarib ayting · 2) Tushunarli bo'lmagan joyini belgilang · 3) O'sha qatorni qayta yozing
- Keyingi dars matni: **yo'q** (bu darsda «🚀 Keyingi dars» qatori yozilmagan)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- O'qituvchi eslatmasi: Arena tugagach g'oliblarni nomlab tabriklang. Uy-vazifa: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa variant. Muddat — Demo Day kunigacha. …

---

## Qo'shimcha matnlar

**Nishonlar (4):** 🎤 Slide Talker! — Slaydning uch qatorini o'zingiz ochdingiz (4-ekran) · 🎯 Proof Finder! — Ikki rost raqamdan isbot beradiganini topdingiz (4-ekran, birinchi tanlov) · 🖼 Stage Ready! — Sahnaga chiqadigan slaydni yozdingiz (8-ekran) · ⚖️ Number Duel! — Uch juftlikda raqamni tanladingiz (9-ekran)
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Yangi nishon: … · bosib davom eting

**Qisqa takrorlash oynalari (4):**
1. (3-ekran) Isbot — tizim odam uchun nima qilganini sanagan raqam: 👥 Isbot qanday raqam — Tizim odam uchun nima qilganini sanab turgan raqam — isbot. · 🔧 Mehnatni sanagan raqam — Faqat siz qancha ishlaganingizni sanaydigan raqam sahnada boshqa ishni bajaradi: u tizim ishlaganini ko'rsatmaydi. · 🔎 Ikki tomonni yonma-yon qo'ying — Har raqamdan bitta narsani so'rang: u kimning ishini sanadi — tizimni qurgan odamningmi, tizimdan foydalangan odamningmi?
2. (5-ekran) Slayd uch qator bilan gapiradi: 🎤 Uch qator — Slaydda uchta qator turadi: raqam, u nimani sanadi va u nimani ko'rsatadi. · ❓ Uchinchi qator bo'lmasa — Raqam va uning sanagani turadi, savol esa javobsiz qoladi: bu tizim haqida nimani ko'rsatyapti? · ✅ To'liq gapirgan slayd — Uchinchi qator yozilgach slayd to'liq gapiradi va odam qo'shimcha savol bermaydi.
3. (7-ekran) Raqam qiyinchilikning davomi: 🪜 Raqamli qadam qayerda — Airbnb varaqlarida raqamli qadam uchinchi o'rinda turgan — qiyinchilik va yechim aytilgandan keyin. · 😣 U nimani ko'rsatgan — O'sha raqam qiyinchilik qancha odamda borligini ko'rsatgan: u qiyinchilikning kattaligini aytgan. · 📚 Raqam yolg'iz turmagan — Varaq raqamni yolg'iz qoldirmagan — u oldingi ikki qadamning davomi bo'lib chiqqan.
4. (11-ekran) Sahnaga bitta raqam chiqadi: 🎯 Qaysi raqam chiqadi — Sahnaga tizim odam uchun bajargan ishni sanagan raqam chiqadi. · ⚖️ Ikkalasi ham odamniki bo'lsa — Tizim ishni oxirigacha bajarganini sanagan raqam chiqadi — ishning boshlanishini sanagani emas. · 🧭 Raqam topilmasa — Yo'q raqam o'ylab topilmaydi: tizim bajarib bergan ishlar sanaladi va o'sha son olinadi.

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Sahnaga raqam tanlayapsiz. Isbot bo'lishi uchun u nimani sanasin? ✔ Tizim odam uchun bajargan ishni · Tizimni qurishda odam sarflagan vaqtni · Tizim kodida yozilgan satrlarni · Tizim ustida ishlagan odamlar sonini
2. «28 ta rasm chizildi» qatori nimani sanaydi? Siz qurgan tizimni ochib ko'rgan odamlarni · Arizasiga javob olgan odamlarni · Tizimni telefondan ochgan odamlarni · ✔ Faqat sizning mehnatingiz qanchaligini
3. Ekranga faqat «150» yozilgan slayd chiqdi. Bu raqam nima qiladi? Tizim haqida hammasini aytib beradi · Sahnadagi odamlarni sanab turadi · ✔ Odamda savol qoldiradi, javob bermaydi · Slaydning qolgan qatorlarini o'zi to'ldiradi
4. Sahnaga slayd tayyorlayapsiz. Unda nechta qator bo'ladi? Ikkita — raqam va uning nomi · ✔ Uchta — raqam, sanagani, ko'rsatgani · To'rtta — raqam, nom, sana va xulosa · Bitta — faqat katta raqamning o'zi
5. Slaydda «120» va «odam saytdan foydalandi» bor. Endi yana nimani yozish kerak? Raqamni qaysi kuni sanab olganini · ✔ Bu raqam sayt haqida nimani aytishini · Saytning qaysi sahifasi sanoqni yuritganini · Faqat 120 raqamini yana bir marta
6. Ikki raqam ham odam ishini sanadi. Sahnadagi bitta joyni qaysi biri oladi? ✔ Tizim ishni oxiriga yetkazganini ko'rsatgani · Tizim ishni endi boshlab qo'yganini ko'rsatgani · Sahnada soni kattaroq bo'lib chiqqani · Slaydga birinchi bo'lib yozib qo'yilgani
7. «41 odam tizimni ochdi» nimani ko'rsatadi? Tizim necha hafta qurilganini · Tizimda nechta sahifa borligini · ✔ Odamlar tizimni ochib ko'rganini · Arizalarga javob berilganini
8. Airbnb besh qadamining qaysi o'rnida raqam turgan? Jamoa tanishtirilgandan keyin, oxirida · Mahsulot aytilgandan keyingi qadamda · Qiyinchilik aytilishidan oldin · ✔ Yechim aytilgandan keyingi qadamda
9. Airbnb varag'ida raqam qiyinchilik qadamiga nima qo'shgan? ✔ Uni sezgan odamlar qancha ekanini · Yechim qancha vaqtda topilganini · Saytga uy qo'ygan odamlar sonini · Jamoada ishlaganlarning ismlarini
10. Sahnada «5 hafta ishlandi» yozilgan. Nega bu isbot emas? Chunki 5 — sahna uchun juda kichik son · Chunki hafta soni doim o'zgarib turadi · ✔ Chunki u faqat sizning mehnatingizni sanaydi · Chunki bu raqamni sahnadan hech kim ko'rmaydi
11. Tizimingizni hali hech kim sinamagan. Endi nima qilinadi? Tizimga taxminiy raqam o'ylab topiladi · ✔ Tizim bajarib bergan ishlar sanaladi · Tizim haqidagi slayd raqamsiz chiqadi · Tizimga ketgan soatlar raqam o'rniga yoziladi
12. Sahnaga qaysi raqam chiqishini kim hal qiladi? Siz uchun kodni yozgan dasturchi · Sahnadagi katta ekranning o'zi · Tizim raqamni siz uchun o'zi tanlaydi · ✔ Mahsulotni o'ylaydigan odam — siz

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **«odam ishini sanagan raqam»** (10-ekran: mentor, «Kod nima qilsin», kompilyator topshirig'i; viktorina 6) — ikki xil o'qiladi: 312 ta kod satri ham «odamning ishi». Qolgan joylarda «tizim odam uchun qilgan/bajargan ish» deyilgan. Bitta narsa ikki xil nomlangan.
- **Bir qoida uch shaklda:** «tizim odam uchun **qilgan** ish» (2, 3, 11-ekran), «tizim odam uchun **bajargan** ish» (9, 10, 12, 15-ekran), «tizim **ishlaganini** ko'rsatadi» (3, 4, 9-ekran). Viktorina 6 da «oxiriga yetkazganini», 4-ekranda esa «oxirigacha bajarganini».
- **Inglizcha nishon nomlari izohsiz:** «Slide Talker!», «Proof Finder!», «Stage Ready!», «Number Duel!».
- **«sessiya»** (13-ekran: «Bu sessiyaga hali hech kim qo'shilmagan») — lug'atda «sessiya → dars» deb belgilangan.
- **«massiv», «funksiya», `console.log`, «kompilyator»** (10-ekran): «massiv» qavsda turibdi (ro'yxat), «kompilyator» izohlangan. «funksiya» va `console.log` izohsiz. Kompilyator placeholder'ida «yigib» apostrofsiz yozilgan, kod izohida esa «royxatga toplang».
- **Test sotilib qolishi mumkin:** 11-ekrandagi to'g'ri javob «Tizim odam uchun qilganini sanagani tanlanadi» dars bo'yi takrorlangan qoida-iborani aynan qaytaradi, qolgan ikki variantda bu ibora yo'q. 3-ekranda ham faqat to'g'ri variantda «javob oldi» so'zi bor, u 2-ekran kartasidan tanish.
- **1-ekran namunasi mantiqan zaif:** «8 odam tizimdan foydalandi → demak tizim odamlarning ishini bajarib berdi». 4-ekranda esa «ochish — ishning boshlanishi» deyiladi, ya'ni foydalanish hali ish bajarilgani emas. 5-ekran savoli oldidagi «⌨️» belgisi ham o'rinsiz: bu savol kod haqida emas.
- **Yakun ekranida «🚀 Keyingi dars» qatori yo'q.** Yakun sarlavhasi («Sahnaga chiqadigan slaydingiz yozildi.») `tr()` ichida emas, ya'ni ruschada ham o'zbekcha chiqadi. 6-ekranning bosqich hisoblagichi «/7» ko'rsatadi, oxirgisi ko'prik-matn.
