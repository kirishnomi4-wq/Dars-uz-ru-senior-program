# 5-Modul (LMS: 7-Modul) · 11-dars «Botingiz yaxshi ishlayotganini qaysi raqam aytadi?» — reja va ekranma-ekran so'zlar

Fayl: `src/pm/PmMetricsLesson.jsx` · 18 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook (0):** «Botingizga odamlar /start bosib kelyapti.» O'quvchi bot yaxshi ishlayotganini qaysi raqamga qarab bilishini tanlaydi: jami /start bosganlar yoki bugun yozganlar. Ikkala tanlovga bir xil javob keladi: jami soni faqat o'sadi, bugungi son har kuni o'zgaradi.
- **Markaziy mexanika:** «ikki dushanba» — o'quvchi ikkala kunga /stat yuboradi. Jami 100 dan 120 ga o'sgan, lekin uchta raqam (bugun kelganlar, kechagilardan qaytgani, keragini olganlar) tushgan. Keyin uch raqamning nomi ochiladi, foiz 100 katakli to'rda hisoblanadi, bir kunlik bot yozuvidan sanaladi («bir odam bir marta»).
- **Asosiy ip:** o'quvchining o'z Telegram-boti va unga keladigan odamlar. Bitta tashqi keys bor: Booking.com (har o'zgarishni odamlarning bir qismida sinaydi, 2017-yilda 1000 dan ortiq sinov).
- **Yakun:** o'quvchi o'z botiga to'rt raqam yozadi (⭐ bosh raqam, uch yordamchi raqam). Keyin VS Code'da `/stat` buyrug'ini qo'shadi, bosh raqamni yoddan aytadi. Yakun sarlavhasi: «Botingizning bosh raqami tanlandi».

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — qaysi raqam | hook | ikki raqamdan birini tanlaydi (jami / bugun) | — |
| 1 | Maqsad | qoida | /stat pufagida to'rt «?» qatorini ko'radi | — |
| 2 | Ikki gap | tushuncha | fikr va sanaladigan raqam kartalarini ochadi → «metrika» | — |
| 3 | 1-savol | test | qaysi javobni sanab tekshirib bo'ladi | ✅ |
| 4 | Ikki dushanba | markaziy | /stat yuboradi → bashorat → yana 3 raqamni so'raydi | — |
| 5 | Uch nom | tushuncha | pufakdagi qatorlarni bosib, nomlarini ochadi | — |
| 6 | 2-savol | test | kechagilardan bugun kelganlar — qaysi raqam | ✅ |
| 7 | Foiz | markaziy | A/B holatni tanlaydi → ikkala foizni hisoblaydi | — |
| 8 | 3-savol | test | qaysi kunda foiz katta | ✅ |
| 9 | Booking.com | case | 6 bosqichli voqea, 2 ta bashorat | — |
| 10 | To'rt raqam | amaliyot | o'z botining 4 raqamini bittalab yozadi | — |
| 11 | Bot yozuvi | amaliyot | yozuvdan 3 savol bo'yicha odamlarni sanaydi | — |
| 12 | Koding · /stat | praktika | kod-savol → bot.js ga /stat buyrug'ini yozadi | — |
| 13 | 4-savol (yakuniy) | test | /stat javobidan bot qanday ishlayotganini aytadi | ✅ (final) |
| 14 | Mustahkamlash | refleksiya | bosh raqamni ovoz chiqarib aytadi + bir qator yozadi | — |
| 15 | Natijalar | podium | shaxsiy natija / jonli reyting | — |
| 16 | Takrorlash | kartochkalar | 10 ta kartochka | — |
| 17 | Yakun | xulosa | 4 xulosa, arena, nishonlar, uyga vazifa tugmasi | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol. «Qayta tushuntirish» oynalari (RECAPS) — 4 ta, faqat mentor test ekranida ochadi. Nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
metrika (sanab tekshirib bo'ladigan raqam) · fikr ↔ raqam · jami (faqat o'sadi) · bugun kelganlar (DAU) ·
kechagilardan qaytgani / qaytganlar foizi (retention) · keragini olganlar / bosh raqam (North Star) · /stat ·
ikki dushanba · yuzta odamga keltirish (foiz) · bot yozuvi · «bir odam bir marta» · «nima bo'lganda sanaladi» · sinov (Booking)

---

## 0 · Kirish — qaysi raqam  `[662]`
- Eyebrow: Kirish · botingiz
- Sarlavha: **Bot yaxshi ishlayotganini qaysi raqamga qarab bilasiz?**
- Mentor: Botingizga odamlar /start bosib kelyapti.
- Tanlov:
  - 🔢 Jami nechta odam /start bosganiga
  - 🙋 Bugun nechta odam botga yozganiga
- Javobdan keyin (ikkala tanlovda bir xil): Ikkalasi ham botingizda bor raqam. Lekin jami soni faqat o'sadi: bot bir hafta jim tursa ham u kamaymaydi. Bugungi son esa har kuni o'zgaradi — darsda ikkalasini yonma-yon qo'yib ko'rasiz.
- Jonli darsda: ovozlar diagrammasi (har variant nechta ovoz olgani)
- Tugma: Bittasini tanlang → Davom etish
- Mentorga eslatma (faqat mentor): Ovozlar bo'linadi — ikkalasi ham halol javob. «Faqat o'sadi» degan joyda to'xtang va so'rang: bot bir hafta jim tursa, jami soni nima bo'ladi?

## 1 · Maqsad  `[733]`
- Eyebrow: Maqsad
- Sarlavha: **Bugun botingiz uchun to'rt raqam tanlaysiz.**
- Mentor: Bittasi — eng muhimi, uchtasi — unga yordam beradi. Pufakdagi to'rt qatorning ikkitasini dars oxirida botingiz /stat buyrug'i bilan o'zi sanaydigan bo'ladi.
- Vizual: Telegram-suhbat — siz «/stat» → bot javobi o'z-o'zidan yoziladi: ⭐ ? · 🔢 ? · 🔢 ? · 🔢 ?
  - 10-ekran to'ldirilgan bo'lsa, qatorlar o'quvchining o'z nomlari bilan chiqadi: ⭐ (bosh raqam) · 🙋 · ↩️ · 🔢 — har birida «?»
- Tugmalar: Orqaga · Boshlaymiz →
- Mentorga eslatma (faqat mentor): Pufak yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.

## 2 · Ikki gap  `[764]`
- Eyebrow: Muhokama · ikki gap
- Sarlavha: **Qaysi gapni tekshirib ko'rsa bo'ladi?**
- Mentor: Botingiz haqida ikki gap — ikkala kartani bosing.
- Kartalar (bosilsa ochiladi, qayta bosilsa yopiladi):
  - 💬 **«Botim juda yaxshi ishlayapti»** — Buni sanab bo'lmaydi: har kim «yaxshi»ni o'zicha tushunadi
  - 🔢 **«Bugun botga 12 odam yozdi»** — Buni sanasa bo'ladi: bot yozuvidan 12 ta ekanini tekshirasiz
- Xulosa: **Bot haqida sanab tekshirib bo'ladigan raqam metrika deyiladi.** So'z «metr» dan olingan — o'lchash degani.
- Tugma: Yana N kartani oching → Davom etish
- Mentorga eslatma (faqat mentor): Kimdir «metrika — guvohnoma-ku» desa: so'z bir xil, ma'no boshqa — bu yerda o'lchash.

## 3 · 1-savol ✅  `[806]`
- Eyebrow: Tekshiruv · sanab bo'ladigan raqam
- Savol: **🤖 Mentor botingiz haqida so'radi. Qaysi javobni sanab tekshirib bo'ladi?**
  - Botimni hamma juda yaxshi ko'radi
  - ✔ Bugun botdan 9 odam javob oldi
  - Botim sinfdagi eng qulay bot
- To'g'ri: 9 odamni botning yozuvidan birma-bir sanab tekshirasiz — «yaxshi ko'radi», «qulay» esa har kimda boshqacha.
- Xato izohlari:
  - (A) «Yaxshi ko'radi» — fikr: har kim uni o'zicha tushunadi, uni sanab bo'lmaydi.
  - (C) «Eng qulay» — fikr: kimgadir qulay, kimgadir yo'q. Bunday gapni sanab tekshirib bo'lmaydi.
  - (umumiy) Sanab tekshirib bo'ladigan gapda son bo'ladi va uni bot yozuvidan topasiz.
- Test ekranlarining umumiy yozuvlari: Javobni tanlang · To'g'ri · Qaytadan urinib ko'ring · jonlida: «⚡ Jonli dars — bitta urinish, o'ylab tanlang!» · «📨 Javobingiz qabul qilindi» / «Hozir to'g'ri javobni bilib olasiz.» · «To'g'ri javob: B — …»

## 4 · Ikki dushanba (markaziy)  `[836]`
- Eyebrow: Amaliyot · ikki dushanba
- Sarlavha: **/stat yuboring va ikki dushanbani solishtiring.**
- Mentor (boshida): Ikki dushanba, bitta bot — avval «/stat» tugmasini bosing.
- Ikki ustun: **O'tgan dushanba** · **Bu dushanba** — har birida Telegram-suhbat (boshida «· · ·»)
- Tugma: /stat → ikkala suhbatda bot: 👥 Jami: 100 · 👥 Jami: 120
- Bashorat: **Faqat shu raqamga qarab: bot yaxshilandimi?**
  - 📈 Ha — 20 odam qo'shildi
  - 🤔 Bu raqamdan bilib bo'lmaydi
- Tanlovdan keyin: Tanlovingiz yozildi. Endi botdan yana uch raqamni so'rang.
- So'rash tugmalari (bosilganda ikkala suhbatga qator qo'shiladi, ostida izoh chiqadi):
  - + Bugun kelganlar → 🙋 Bugun kelganlar: 18 / 6 — *Bu dushanba botga uch barobar kam odam yozdi: 18 emas, 6*
  - + Kechagilardan qaytgani → ↩️ Kechagilardan qaytgani: 20 dan 9 / 8 dan 1 — *O'tgan safar kechagi 20 odamdan 9 tasi qaytgan edi, bu safar 8 tadan 1 tasi*
  - + Keragini olganlar → ✅ Keragini olganlar: 15 / 4 — *Botdan kerakli javob olganlar ham kamaydi: 15 tadan 4 taga*
- 40 soniya harakatsiz tursa: 💡 Tugmalarni bosing va ikki suhbatni yonma-yon o'qing.
- Xulosa: **Jami 100 dan 120 ga o'sdi — qolgan uch raqam esa tushdi.** Jami soni faqat o'sadi, shuning uchun bot qanday ishlayotganini u aytmaydi. Buni qolgan uchtasi aytadi.
- Tugma: ① «/stat» buyrug'ini yuboring → ② Savolga javob bering → ③ Yana N raqamni so'rang → Davom etish
- Jonlida o'quvchiga: 👥 Sinfda: N bajardi · ✏️ N hali bajarmoqda
- Mentorga eslatma (faqat mentor): «Jami 120 — ko'payibdi!» degan ovozlar chiqadi. Shunda o'ng pufakdagi qolgan qatorlarni birga o'qing — xulosani bolalar o'zi aytsin. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 5 · Uch nom  `[944]`
- Eyebrow: Muhokama · uch nom
- Sarlavha: **Har raqam qaysi savolga javob beradi?**
- Mentor: Har qatorni birma-bir bosing.
- Chapda: «Bu dushanba» — /stat → 👥 Jami: 120 · 🙋 Bugun kelganlar: 6 · ↩️ Kechagilardan qaytgani: 8 dan 1 · ✅ Keragini olganlar: 4
- Qator bosilsa o'ngda karta ochiladi:
  - 👥 Jami: 120 → Bu raqam faqat o'sadi — u hech bir savolga javob bermaydi.
  - 🙋 → «Botga bugun odam keldimi?» · **Bugun kelganlar** · Bugun botga yozgan yoki tugma bosgan odamlar — har biri bir marta sanaladi. · Inglizchasi: **DAU** («kunlik faol foydalanuvchilar»)
  - ↩️ → «Odamlar botga qaytyaptimi?» · **Qaytganlar foizi** · Kecha kelgan har yuzta odamdan nechtasi bugun ham keldi — shu **qaytganlar foizi**. · Inglizchasi: **retention**
  - ✅ → «Bot odamga keragini berdimi?» · **Bosh raqam** · Botning eng muhim raqami. Shuning uchun uni **bosh raqam** deymiz. · Inglizchasi: **North Star** («Shimol yulduzi»)
- Xulosa: **Bot qanday ishlayotganini jami emas, shu uch raqam aytadi.**
- Tugma: Yana N qatorni oching → Davom etish

## 6 · 2-savol ✅  `[1002]`
- Eyebrow: Tekshiruv · qaysi raqam
- Savol: **🤖 Kecha 10 odam keldi. Ulardan 3 tasi bugun ham keldi. Bu qaysi raqam haqida?**
  - Bugun kelganlar soni
  - Botning bosh raqami
  - ✔ Qaytganlar foizi
- To'g'ri: Kechagi odamlardan bugun ham kelganlari sanalyapti — o'ndan uchtasi.
- Xato izohlari:
  - (A) Bugun kelganlar — bugun botga yozgan hamma odam. Bu yerda esa faqat kechagilardan kelganlar sanalyapti.
  - (B) Bosh raqam odam keragini olganini sanaydi. Bu yerda esa kechagi odamlar qaytgani sanalyapti.
  - (umumiy) Kechagi odamlardan bugun ham kelganlar — qaytganlar.

## 7 · Foiz (markaziy)  `[1028]`
- Eyebrow: Amaliyot · foiz
- Sarlavha: **Qaysi holat yaxshiroq: 8 odam yoki 4 odam?**
- Mentor (holatga qarab):
  - boshida: Avval A yoki B ni tanlang — keyin foizni hisoblaymiz.
  - tanlagach: Odam soni har kuni har xil — shuning uchun har yuztadan nechtasi qaytishini sanaymiz. Bu — foiz.
  - tugagach: Foiz — har yuzta odamdan nechtasi qaytgani.
- Tanlov: **Qaysi holatda odamlar botga yaxshiroq qaytdi?** — A · B
- Holatlar (har birida 100 katakli to'r):
  - **A** — Dushanba 40 odam keldi, seshanba ulardan 8 tasi qaytdi → [Foizni hisoblash] → 8 ÷ 40 × 100 = **20** · yuzta odamdan 20 tasi
  - **B** — Payshanba 10 odam keldi, juma ulardan 4 tasi qaytdi → [Foizni hisoblash] → 4 ÷ 10 × 100 = **40** · yuzta odamdan 40 tasi
  - tanlovdan oldin tugma yozuvi: Avval yuqorida tanlang
- Xulosa: **8 odam 4 tadan ko'p, lekin foiz B da ikki barobar katta: 40 va 20.** Odam soni har xil bo'lsa — foizni solishtiring.
- Tugma: ① Qaysi holat yaxshiroq — tanlang → ② Yana N holatda foizni hisoblang → Davom etish
- Mentorga eslatma (faqat mentor): Ko'pchilik «A — 8 odam qaytdi» deb tanlaydi. Hisobni bolalar o'zi ochsin, keyin so'rang: 40 kishilik va 10 kishilik guruhni qanday solishtiramiz? Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 8 · 3-savol ✅  `[1096]`
- Eyebrow: Tekshiruv · foiz
- Savol: **🤖 Bir kuni 20 odamdan 5 tasi qaytdi, boshqa kuni 6 odamdan 3 tasi. Qaysi kunda foiz katta?**
  - ✔ Ikkinchi kunda — 6 odamdan 3 tasi
  - Birinchi kunda — 20 odamdan 5 tasi
  - Ikkala kunda teng — har kuni qaytgan bor
- To'g'ri: Yuzta odamga keltirilsa, ikkinchi kunda 50, birinchisida 25 odam qaytgan bo'lardi.
- Xato izohlari:
  - (B) 5 ta 3 tadan ko'p, lekin guruhlar har xil: 20 odamdan 5 tasi — yuztadan 25, 6 odamdan 3 tasi — yuztadan 50.
  - (C) Ikkala kunda ham odam qaytgan, lekin foizlari har xil: 25 va 50.
  - (umumiy) Guruhlar har xil kattalikda — foizni solishtiring.

## 9 · Booking.com (case)  `[1134]`
- Eyebrow: ⚡ Haqiqiy voqea
- Sarlavha: **Biznes olamidan mashhur voqea.**
- Bosqichlar (6 ta; yorliq: «🏨 Booking.com · N / 6»):
  1. 🏨 **Joy band qilinadigan sayt** — Booking.com — mehmonxonada yoki ijara uyda oldindan joy band qilinadigan sayt. U yerda deyarli har bir o'zgarish — tugma rangi, matn, sahifadagi bo'limlar tartibi — **hammaga birdan ko'rsatilmaydi**.
  2. 🎲 Avval o'zingiz belgilab ko'ring · **Yangi tugma rangi avval kimga ko'rsatiladi?**
     - 🌍 Saytdagi hamma odamga birdan · ✔ 👥 Odamlarning bir qismiga · 🏢 Faqat kompaniya xodimlariga
     - Topsa: 🎯 Topdingiz! Odamlarning bir qismiga · Topmasa: Aslida: odamlarning bir qismiga
  3. 👥 **Ikki guruh — ikki raqam** — Yangi rangni odamlarning bir qismi ko'radi, qolganlari eskisini ko'rib turadi. Keyin **ikki guruhning raqamlari solishtiriladi**.
  4. 🎲 **Kompaniya 2017-yilda bir vaqtda nechta shunday sinov o'tkazishini aytgan?**
     - 🔢 10 dan ortiq · 🔢 100 dan ortiq · ✔ 🔢 1000 dan ortiq
     - Topsa: 🎯 Topdingiz! 1000 dan ortiq · Topmasa: Aslida: 1000 dan ortiq
  5. 🔢 **Mingta sinov bir vaqtda** — Kompaniya 2017-yilda ochiq aytgan: bir vaqtda **1000 dan ortiq sinov** o'tkaziladi. Mingta sinovni chamalab hal qilib bo'lmaydi — har birida raqamlar solishtiriladi.
  6. (ko'prik) Botingizga yangi tugma qo'shsangiz ham shu savol chiqadi: bot yaxshi bo'ldimi? Buni bilish uchun eng muhim raqamni o'zgarishdan **oldin** tanlab qo'yasiz — botingizning bosh raqamini.
- Nuqtalar: «Avval shu bosqichni tugating»
- Tugma: 🎲 Avval javobingizni belgilang / Keyingi bosqich (N/6) → Davom etish
- Mentorga eslatma (faqat mentor): Booking qaysi raqamga qaraganini bank aytmaydi — o'zingizdan qo'shmang. Sinovning nomini va usulini ochmang: u keyinroq alohida dars.

## 10 · To'rt raqam (amaliyot)  `[1231]`
- Eyebrow: Mustaqil ish · to'rt raqam
- Sarlavha: **Botingiz nimani sanaydi?**
- Tasma (8-darsda javoblar yozilgan bo'lsa): 🎙 Eshitganingiz: … · … · …
- Mentor (boshida): 8-dars javoblari bo'lsa — «Uch odamdan eshitganingizni raqamda yozing.» · bo'lmasa — «Bot odamga nima berganini raqamda yozing.»
- Qadamlar: ⭐ Bosh raqam · 🙋 Bugun kelganlar · ↩️ Qaytganlar foizi · 🔢 O'z raqamingiz
- Kartani to'ldirish:
  - (faqat 4-karta) nom maydoni: «Masalan: Menyu bosganlar»
  - Nimani sanaydi: (oldindan yozilgan: 🙋 — «bugun botga yozgan yoki tugma bosgan odamlar» · ↩️ — «kecha kelganlardan bugun ham kelganlar, foizda») · bo'sh joyda: «Nimani sanaysiz?» / 4-kartada «Masalan: «Menyu» tugmasini bosgan odamlar»
  - Nima bo'lganda sanaladi: /start bosilganda · xabar kelganda · tugma bosilganda · bot javob yuborganda (tahrirlashda yonida kod: = bot.start · = bot.on('text') · = bot.hears · = ctx.reply)
  - Tugma: Saqlash → / ✓ Yangilash
- Yetishmasa: 🤔 Nimani sanashini yozing. · 🤔 Raqamingizga qisqa nom bering. · 🤔 Bu raqam allaqachon yozilgan — boshqasini tanlang. · 🤔 Nima bo'lganda sanalishini tanlang — kamida bittasini.
- Saqlagach: ✅ {belgi} {nom} yozildi: «{nimani sanaydi}» — bot uni {tanlangan holatlar, «yoki» bilan} sanaydi.
- Topshiriq paneli: 🎯 Topshiriq · **To'rt raqam** · ○ Bosh raqam — keragini olganlar · ○ «Nima bo'lganda» tanlangan · ○ 4-raqam takrorlanmaydi
- 💡 Yordam: Botingiz odamga nima beradi? Odam shuni olsa — **bitta sanaladi**. Bosh raqam shu.
- Tugagach: ⭐ Botingizning to'rt raqami (ro'yxat, ✎ Tahrirlash) · ⭐ Qo'shimcha: Bugungi haqiqiy sonni ham yozing: bugun botingizga nechta odam keldi — terminaldagi yozuvlardan sanang.
- Yakun: ✅ To'rt raqamingiz yozildi — har birida nima bo'lganda sanalishi tanlangan
- Tugma: ① ⭐ Bosh raqamni yozing → ② Yana N raqamni yozing → Davom etish
- Mentorga eslatma (faqat mentor): «Odamlar mamnun» deb yozganlarga bitta savol: buni bot qaysi xabardan biladi? Javob topilmasa — raqam emas, fikr yozilgan. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 11 · Bot yozuvi (amaliyot)  `[1410]`
- Eyebrow: Tekshiruv · bot yozuvi
- Sarlavha: **Botning bir kunlik yozuvidan uch raqamni sanang.**
- Mentor: Har qator — botga kelgan bitta xabar yoki botning javobi. Savolga mos qatorlarni bosing: bir odam bir marta sanaladi.
- Yozuv: **🗒 Seshanba · bot yozuvi**
  1. 08:40 👤 Kamola — /start bosdi
  2. 08:40 🤖 bot → Kamola — ✅ kerakli javobni yubordi
  3. 09:15 👤 Otabek — «salom» deb yozdi
  4. 09:15 🤖 bot → Otabek — 🤷 «Tushunmadim» dedi
  5. 12:02 👤 Kamola — tugma bosdi
  6. 12:02 🤖 bot → Kamola — ✅ kerakli javobni yubordi
  7. 16:30 👤 Bekzod — tugma bosdi
  8. 16:30 🤖 bot → Bekzod — ✅ kerakli javobni yubordi
  9. 18:10 👤 Sevara — /start bosdi
  10. 18:10 🤖 bot → Sevara — 👋 salom berdi
- Savollar («🎯 Savol N / 3» · «Belgilandi: N» · [Tekshirish]):
  1. 🙋 **Bugun kelganlar — kimlar botga keldi?** (to'g'risi: Kamola, Otabek, Bekzod, Sevara)
     - To'g'ri: ✅ Bugun 4 odam keldi: Kamola ikki marta yozdi, lekin bir marta sanaladi.
     - Xato: Bu qatorni bot yozgan — odam emas. · {Ism} allaqachon sanalgan — bir odam bir marta. · 💡 Bu odamning ismi yuqoriroqda ham bormi?
  2. ⭐ **Bosh raqam — kim keragini oldi?** (faqat bot qatorlari; to'g'risi: Kamola, Bekzod)
     - To'g'ri: ✅ Keragini 2 odam oldi: Kamola va Bekzod.
     - Xato: Otabek javob oldi, lekin keragini emas — bu raqamga qo'shilmaydi. · Salom — hali odamga kerakli javob emas. · {Ism} allaqachon sanalgan — bir odam bir marta. · 💡 Bu odamning ismi yuqoriroqda ham bormi?
  3. ↩️ **Qaytganlar — kechagilardan kim bugun ham keldi?** (faqat odam qatorlari) · tasma: Kecha kelganlar: Kamola · Otabek · Dilshod · Madina (to'g'risi: Kamola, Otabek)
     - To'g'ri: ✅ Kecha kelgan 4 odamdan 2 tasi bugun ham keldi — qaytganlar foizi 50 foiz.
     - Xato: {Ism} allaqachon sanalgan — bir odam bir marta. · Bu ism kechagi ro'yxatda bormi? · 💡 Bu ism kechagi ro'yxatda bormi?
  - Tugmalar: Keyingi savol ▸ / Natijani ko'rish ▸
  - Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Xulosa: **🙋 Bugun kelganlar: 4 · ↩️ Qaytganlar foizi: 50 foiz · ⭐ Bosh raqam: 2** — Bir kunning o'zidan uch xil raqam chiqdi — har biri boshqa savolga javob beradi.
- Tugma: Yana N savolni tekshiring → Davom etish
- Mentorga eslatma (faqat mentor): Eng ko'p adashiladigan joy — Kamolaning ikkinchi qatori va Otabek: u keldi va qaytdi, lekin keragini olmadi. Uchala raqam har xil chiqishi — darsning o'zi. Juftlikda: sherigingizning ⭐ bosh raqamini o'qing va so'rang: «Bot buni qaysi xabardan biladi?» Javob topilmasa — karta birga qayta yoziladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 12 · Koding · /stat (praktika)  `[1566]`
- Eyebrow: Koding · ⌨️ VS Code
- Sarlavha: **Botingiz raqamlarni o'zi aytadigan /stat buyrug'ini yozamiz.**
- 1-bosqich — Mentor: Avval bitta savol — keyin kod yoziladi.
  - Savol: 🔎 `bot.command('stat', …)` qachon ishlaydi?
    - ✔ Odam botga /stat deb yozganda · Bot ishga tushgan zahoti · Odam har qanday xabar yozganda
  - Xato bo'lsa: 🤔 **bot.command** faqat o'z nomi bilan kelgan buyruqqa javob beradi: **'stat'** — demak **/stat**.
- 2-bosqich — Mentor: Yozuvdan qo'lda sanaganingizni endi botingiz o'zi sanaydi. Kodni bot.js faylingizga, bot.launch() qatoridan oldin yozing.
  - Yopilgan savol: ✓ bot.command('stat', …) — odam botga /stat deb yozganda
  - **Bot nima javob bersin:** 1) Bot /stat ga javob berdi · 2) Bugun 3, qaytgan 2 · 3) Foiz 40% chiqdi
  - VS Code oynasi: ⌨️ bot.js · 🔒 qo'lda yoziladi (kod nusxalanmaydi — «Kod nusxalanmaydi — o'zingiz terib yozasiz»)
  ```js
  // bot.js — bot.launch() qatoridan OLDIN qo'shing.
  // Har qator: kim (telegram_id) qaysi kuni botga keldi.
  // Hozircha ro'yxatni qo'lda yozdik — keyin u bazadan keladi.
  const kelishlar = [
    // kun: 1 — kecha, kun: 2 — bugun
    { telegram_id: 101, kun: 1 }, { telegram_id: 102, kun: 1 },
    { telegram_id: 103, kun: 1 }, { telegram_id: 104, kun: 1 },
    { telegram_id: 105, kun: 1 },
    { telegram_id: 101, kun: 2 }, { telegram_id: 104, kun: 2 },
    { telegram_id: 106, kun: 2 }, { telegram_id: 101, kun: 2 },
    { telegram_id: 104, kun: 2 },
  ];

  function stat(kelishlar, bugun) {
    // Kechagi odamlar — tayyor: bir odam bir marta
    // includes — ro'yxatda bormi? push — ro'yxatga qo'shadi
    const kechagilar = [];
    for (const k of kelishlar) {
      if (k.kun === bugun - 1 && !kechagilar.includes(k.telegram_id)) {
        kechagilar.push(k.telegram_id);
      }
    }

    // 1) Bugungi odamlarni xuddi shunday yig'ing
    const bugungilar = [];

    // 2) Bugungilardan nechtasi kechagilar ichida bor?
    let qaytgan = 0;

    // 3) Foiz: qaytgan ÷ kechagilar soni × 100 (kecha 5 kishi: 2 ÷ 5 × 100 = 40)
    let foiz = 0;

    return { bugun: bugungilar.length, qaytgan: qaytgan, foiz: foiz };
  }

  bot.command('stat', (ctx) => {
    const s = stat(kelishlar, 2);
    ctx.reply('👥 Bugun: ' + s.bugun + '\n↩️ Qaytgan: ' + s.qaytgan + '\n📈 Foiz: ' + s.foiz + '%');
  });
  ```
  - Kutilgan bot javobi (Telegram, «Bajardim» bosilguncha xira): /stat → 👥 Bugun: 3 · ↩️ Qaytgan: 2 · 📈 Foiz: 40%
  - 💡 Yordam:
    - Kechagilarni yig'adigan uch qatorga qarang: bugungilar uchun ulardan **faqat bitta shart** farq qiladi.
    - 🛟 Bot ishga tushmasa — faylning oxiriga **console.log(stat(kelishlar, 2));** yozing va terminalda **node bot.js** bilan natijani ko'ring. Terminalda 3 · 2 · 40 chiqsa — vazifa bajarilgan.
    - ⭐ Qo'shimcha: javobga to'rtinchi qator qo'shing — kechagi odamlar soni. Shunda 40 foiz qayerdan chiqqani ko'rinadi: kecha 5 kishi kelgan, 2 tasi qaytgan.
  - Tugma: ✅ Bajardim — bot /stat ga javob berdi → ✓ Bajarildi
  - Yakka rejimda: ✓ Bu mashqni sinfda bajarganman — davom etish →
- Tugma (pastda): 🔒 Avval kod-savolini yeching → ② Kodni yozing va «Bajardim» tugmasini bosing → Davom etish
- Mentorga eslatma (faqat mentor): Eng foydali xato — bir odamni ikki marta sanash (101 bugun ikki marta keldi). Bot ishga tushmasa — zaxira-yo'l: console.log bilan terminalda tekshirish. «Bot javob yuborganda» chipi — xuddi shu ctx.reply. Kod 10 daqiqada yoziladi; ulgurmaganlar uyga qisqa variantni oladi. Bu ishni o'quvchilar bajaradi, siz kuzatasiz; «Davom etish» siz uchun ochiq.

## 13 · 4-savol ✅ (yakuniy)  `[1681]`
- Eyebrow: Yakuniy tekshiruv
- Savol: **🤖 /stat javobi: jami 300, bugun 6, qaytganlar foizi 5. Bot qanday ishlayapti?**
  - Jamiga qarang: 300 — bot o'syapti
  - ✔ Foizga qarang: 5 — odamlar deyarli qaytmayapti
  - Bugungiga qarang: 6 — bot har kuni ishlaydi
- To'g'ri: Jami soni faqat o'sadi. Yuzta odamdan atigi 5 tasi qaytadi — odamlar botda qolmayapti.
- Xato izohlari:
  - (A) Jami soni faqat o'sadi — bot yomonlashsa ham u kamaymaydi. Odamlar qaytyaptimi, buni foiz aytadi.
  - (C) 6 — faqat bugun kelganlar soni. Odamlar qaytyaptimi — buni foiz aytadi: yuztadan atigi 5 tasi.
  - (umumiy) Faqat jamiga qarab bot haqida xulosa qilinmaydi.

## 14 · Mustahkamlash (refleksiya)  `[1744]`
- Eyebrow: Mustahkamlash · 2 qadam
- Sarlavha: **Botingizning bosh raqamini yoddan ayta olasizmi?**
- Mentor: Ekranga qaramay ayting: botingizning bosh raqami nima va u nima bo'lganda sanaladi?
- 1-qadam: 🗣 Avval ovoz chiqarib o'zingizga ayting (yakka) / Sherigingizga ayting (jonli)
  - Yakka: ▶ 30 soniyani boshlash · ⏹ To'xtatish · ✓ Vaqt tugadi — aytib bo'ldingiz. Barakalla! · ↻ Yana 30 soniya
  - Jonli: Har biringizga 30 soniyadan — avval A, keyin B. · ▶ 1 daqiqani boshlash · Hozir A gapiradi / keyin — B navbati / oxirgi navbat · ✓ Vaqt tugadi — ikkalangiz ham aytib bo'ldingiz. Barakalla! · ↻ Yana 1 daqiqa
- 2-qadam: ✍️ Endi bir qator yozing — maydon: «Bosh raqamim — ..., u ... bo'lganda sanaladi»
- Yozgach: ✓ Endi botingiz haqida «yaxshi ishlayapti» emas, raqam aytasiz. · 🎯 Bugungi qoida: faqat jamiga qarab bot haqida xulosa qilinmaydi.
- Tugma: Davom etish
- Mentorga eslatma (faqat mentor): Uchdan biri «nima bo'lganda sanaladi»ni aytolmasa — bot yozuvi ekranini qayta oching va ✅ qatorlarni birga sanang.

## 15 · Natijalar (podium)  `[2418]`
- Eyebrow: Natijalar · Sarlavha: **Bugungi natijangiz** (jonlida: **Bugungi g'oliblarimiz**)
- Yakka: ball-halqa + 🏅 Nishonlar · «Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruh reytingi va 🥇🥈🥉 eng yaxshi uchtalik (podium) chiqadi.»
- Jonli: Natijalar kelmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin (N/4 to'g'ri) · 🏆 To'liq reyting
- Savol yorliqlari: 1 — Sanab bo'ladigan raqam · 2 — Qaysi raqam · 3 — Foiz · 4 — Yakuniy savol
- Mentorga eslatma (faqat mentor): G'oliblarni nomlab tabriklang — arena yakun sahifasida ochiladi.

## 16 · Takrorlash (kartochkalar)  `[1836]`
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Metrika nima? | Bot haqida sanab tekshirib bo'ladigan raqam | — |
| Qaysi raqam faqat o'sadi va nega u yetmaydi? | Jami /start bosganlar — bot yomonlashsa ham kamaymaydi | — |
| «Bugun kelganlar» nimani sanaydi? | Bugun botga yozgan yoki tugma bosgan odamlarni — bir odam bir marta | — |
| Odam qachon «qaytgan» deb sanaladi? | Kecha kelgan odam bugun ham kelsa — u qaytgan deb sanaladi | — |
| Qaytganlar foizi qanday hisoblanadi? | Qaytganlar sonini kechagi odamlar soniga bo'lib, 100 ga ko'paytiriladi (inglizcha: retention) | — |
| Nega odam soni emas, foiz solishtiriladi? | Guruhlar har xil kattalikda — foiz ularni yuzta odamga keltiradi | — |
| Bosh raqam nimani sanaydi? | Bot nechta odamga keragini berganini (inglizcha: North Star) | — |
| Bot «Tushunmadim» desa, bosh raqamga qo'shiladimi? | Yo'q — odam javob oldi, lekin keragini emas | — |
| Booking yangi o'zgarishni qanday sinaydi? | Avval odamlarning bir qismiga ko'rsatadi; 2017-yilda bir vaqtda 1000 dan ortiq sinov o'tkazgan | — |
| /stat buyrug'i nimani aytadi? | Bugun kelganlar, qaytganlar soni va ularning foizi | — |

(Kartochkalarda alohida izoh qatori yo'q.)
- Tugmalar: ↻ O'rganilmoqda · ✓ Bildim · ✗ Takrorlash · 🎉 Hammasini bilasiz! · 10/10 karta yodlandi · ↻ Qaytadan takrorlash · Davom etish

## 17 · Yakun  `[2514]`
- Eyebrow: Dars yakuni · ✓ Dars tugadi
- Sarlavha: **Botingizning bosh raqami tanlandi.** (yonida ball-halqa)
- Arena tugmasi: CodeStrike · 12 SAVOL · 15 SONIYA · 🏆 PODIUM (jonlida kutganda: ⏳ Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Bot haqida sanab tekshirib bo'ladigan raqam metrika deyiladi.
  - Jami soni faqat o'sadi — bot qanday ishlayotganini u aytmaydi.
  - Kecha kelgan har yuzta odamdan nechtasi bugun ham keldi — shu qaytganlar foizi.
  - Bosh raqam — bot nechta odamga keragini berganini sanaydi.
- 🏅 Nishonlaringiz — N/4 (nishon nomi + tavsif)
- 📝 Uyga vazifa · Amaliy topshiriqni bajarish → (bosilsa uy vazifasi kartasi ochiladi — PM uy vazifasi, MD'ga kiritilmadi)
- Keyingi dars matni: bu darsda **yo'q** (yakun sahifasida «🚀 Keyingi dars» bloki yo'q).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Mentorga eslatma (faqat mentor): Arena tugagach podium — g'oliblarni nomlab tabriklang. Uy-vazifa: kod topshirig'ini sinfda tugatganlarga to'liq variant, ulgurmaganlarga qisqa. Boti kam odam yig'gan bolalar sinfdoshining botida sanaydi — qoida o'sha. Tekshirishda: har kun uchun raqamlar yozilganmi, qaytganlar foizi foizda hisoblanganmi, bosh raqam qaysi bot-javobidan sanalgani yozilganmi.

---

## Qo'shimcha matnlar

**Nishonlar (4):** 🗓 Two Mondays! — Ikki dushanbani to'rt raqamda solishtirdingiz · ⭐ Star Picker! — Botingizga bosh raqam va uch raqam yozdingiz · 🧮 Fair Counter! — Yozuvdan har odamni bir martadan sanadingiz · 🤖 Stat Command! — Botingizga /stat buyrug'ini qo'shdingiz
Nishon beriladigan ekranlar: 4 · 10 · 11 · 12. Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Yangi nishon · bosib davom eting · 🏅 Nishonlar — N/4

**Qayta tushuntirish oynalari (RECAPS, 4 ta — faqat mentor test ekranida ochadi; «📖 Qayta tushuntirish» · «🗣️ Sinfga savol:» · ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz):**
1. (3-ekran) Sanab tekshiriladigan raqam: 🔢 Metrika nima — Bot haqida sanab tekshirib bo'ladigan raqam **metrika** deyiladi. · 💬 Fikr raqam emas — «Juda yaxshi ishlayapti», «qulay» — bu fikr. Har kim uni o'zicha tushunadi, uni sanab bo'lmaydi. · 🔎 Yozuvdan tekshiring — «Bugun 12 odam yozdi» degan gapni bot yozuvidan birma-bir sanab tekshirasiz. · Sinfga savol: «Botim foydali» va «bugun 5 odam tugma bosdi» — qaysi birini sanab tekshirsa bo'ladi?
2. (6-ekran) Uch raqam — uch savol: 🙋 Bugun kelganlar — Bu raqam bitta savolga javob beradi: **botga bugun odam keldimi?** · ↩️ Qaytganlar foizi va bosh raqam — Qaytganlar foizi — **odamlar botga qaytyaptimi?** Bosh raqam — **bot odamga keragini berdimi?** · 👥 Jami-chi? — Jami soni faqat o'sadi — u bu savollarning hech biriga javob bermaydi. · Sinfga savol: Kecha 20 odam keldi, bugun ulardan 6 tasi yana keldi. Bu qaysi raqam haqida?
3. (8-ekran) Foizda solishtiring: 🧮 Foizni qanday topamiz — Qaytganlar sonini kechagi odamlar soniga bo'lib, **100 ga ko'paytiring**. · ⚖️ Guruhlar har xil bo'lsa — Odam soni har xil bo'lsa — qaytganlar sonini emas, **foizni solishtiring**. · 💯 Yuzta odamga keltiring — Foiz aytadi: yuzta odam kelganda ulardan nechtasi qaytgan bo'lardi. · Sinfga savol: Bir kuni 50 odamdan 10 tasi qaytdi, boshqa kuni 5 odamdan 2 tasi. Qaysi kunda foiz katta?
4. (13-ekran) Faqat jamiga qaramang: 👥 Jami soni — Jami soni **faqat o'sadi** — bot yomonlashsa ham kamaymaydi. · ↩️ Odamlar qaytyaptimi — Odamlar botda qolyaptimi — buni **qaytganlar foizi** aytadi. · ⭐ Bosh raqam — Bot nechta odamga keragini bergani — botingizning eng muhim raqami. · Sinfga savol: /stat javobi: jami 500, qaytganlar foizi 3. Bot haqida nima deysiz?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Metrika qanday raqam? ✔ Sanab tekshirib bo'ladigan raqam · Bot haqidagi yaxshi fikr · Botning chiroyli nomi · Mentor qo'ygan baho
2. Qaysi raqam faqat o'sadi? Bugun kelganlar · Qaytganlar foizi · Bosh raqam · ✔ Jami /start bosganlar
3. Kamola bugun botga 3 marta yozdi. «Bugun kelganlar» soniga nechta qo'shiladi? 3 ta · 2 ta · ✔ 1 ta · 0 ta
4. Kecha 10 odam keldi, bugun ulardan 5 tasi qaytdi. Qaytganlar necha foiz? 5 foiz · ✔ 50 foiz · 10 foiz · 15 foiz
5. «Botga bugun odam keldimi?» — bu savolga qaysi raqam javob beradi? Jami /start bosganlar · ✔ Bugun kelganlar · Qaytganlar foizi · Bosh raqam
6. Bosh raqam nimani sanaydi? ✔ Keragini olgan odamlarni · Botga kelgan hamma odamni · Botdagi tugmalar sonini · Bot yozgan xabarlar sonini
7. Guruhlar har xil kattalikda bo'lsa, nimani solishtirasiz? Qaytgan odamlar sonini · Kelgan odamlar sonini · ✔ Qaytganlar foizini · Jami /start sonini
8. Bot «Tushunmadim» deb javob berdi. Bu bosh raqamga qo'shiladimi? Ha — bot javob yubordi · Ha — odam botga yozdi · Yo'q — odam /start bosmagan · ✔ Yo'q — odam keragini olmadi
9. Booking yangi o'zgarishni avval kimga ko'rsatadi? ✔ Odamlarning bir qismiga · Faqat o'z xodimlariga · Hamma odamga birdan · Faqat eski mijozlarga
10. Booking.com 2017-yilda bir vaqtda nechta sinov o'tkazgan? 10 dan ortiq · 100 dan ortiq · ✔ 1000 dan ortiq · Bittadan, navbat bilan
11. Qaytganlar foizi qaysi savolga javob beradi? Bugun nechta odam keldi? · ✔ Kechagilar bugun ham keldimi? · Bot odamga keragini berdimi? · Jami nechta odam yig'ildi?
12. /stat buyrug'ini qayerga yozdingiz? users jadvaliga · Telegram kanaliga · BotFather'ga · ✔ bot.js faylingizga

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **Keyingi dars bilan ustma-ust:** 12-dars «Kecha kelgan odam bugun ham keldimi?» (App.jsx: «kelganlar va qaytganlar — ikki xil son»). Uning mavzusi shu darsda allaqachon to'liq o'tiladi: 5, 6, 7, 8, 11, 12-ekranlar, kartochka 4–5, arena 4 va 11-savollar («Kechagilar bugun ham keldimi?»). Dars ko'chirilgandan keyin ikki dars bir mavzuni takrorlaydi.
- **Modul tartibiga zid ishora (faqat mentor):** 9-ekran eslatmasi — «Sinovning nomini va usulini ochmang: u keyinroq alohida dars.» 11-darsdan keyin sinov haqida dars yo'q (12 — qaytganlar, 13 — zaxira, 14 — Demo Day).
- **«Keyin bazadan keladi» (12-ekran kodi):** «Hozircha ro'yxatni qo'lda yozdik — keyin u bazadan keladi.» PostgreSQL 4-darsda (va 7-darsda) o'tilgan, ya'ni baza allaqachon bor. Bu ishora eski joyidan (8-Modul) qolgan bo'lishi mumkin.
- **Bir belgi — ikki ma'no:** 👥 4, 5-ekranlarda va RECAPS 2/4 da «Jami»ni bildiradi. 12-ekrandagi bot javobida esa «👥 Bugun: 3» (boshqa hamma joyda bugun kelganlar belgisi 🙋).
- **Inglizcha nishon nomlari:** «Two Mondays!», «Star Picker!», «Fair Counter!», «Stat Command!» (nishon oynasi, 15 va 17-ekran). Tavsiflari o'zbekcha, nomlari inglizcha.
- **«retention» izohsiz:** DAU va North Star'ning qavsda izohi bor, «retention»niki yo'q (5-ekran «Inglizchasi: retention», kartochka 5).
- **Test shaklidan topiladi:** 3-ekranda son bor yagona variant to'g'ri («Bugun botdan 9 odam javob oldi»), qolgan ikkitasi ochiq fikr («juda yaxshi ko'radi», «eng qulay»). Javobni o'qimasdan ham topsa bo'ladi.
- **«chip»** — 12-ekran mentor eslatmasi: «"Bot javob yuborganda" chipi» (faqat mentor ko'radi). Lug'atda taqiqlangan so'z.
