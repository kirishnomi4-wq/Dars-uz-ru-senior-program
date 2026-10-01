# 5-Modul (LMS: 7-Modul) · 7-dars «Loyiha kuni: bot + DB + AI» — reja va ekranma-ekran so'zlar

Fayl: `src/5-Modull/BotFullProjectLesson.jsx` · 20 ekran · faqat o'zbekcha matn
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi
- **Hook:** Botjon hamma buyumlari bilan zo'r ishlaydi, lekin u o'quvchining laptopida yashaydi. Kechqurun laptop yopildi, 02:14 da mijoz yozdi va javob kelmadi. O'quvchi «▶ Tunda mijoz yozdi» tugmasini bosadi, keyin «Nega Botjon javob bermadi?» savoliga uchta variantdan birini tanlaydi (ball yo'q).
- **Markaziy o'yin/mexanika:** to'rtta markaziy ekran bor. #1 — uch vazifaga to'g'ri buyumni ulab, to'liq Botjonni yig'adi. #2 — kalit sinovi: kalit ochiq qolsa nima bo'lishini ko'radi, keyin uni qayerda saqlashni tanlaydi (.env). #3 — aloqa usuli: o'zi-so'rab-turish yoki qo'ng'iroq, ikkalasini ko'rib kichik bot uchun birini tanlaydi. #4 — ko'chirishdan oldingi 3 bandni «To'g'ri / Xato» deb belgilaydi.
- **Asosiy metafora:** 💻 laptop — vaqtinchalik joy (yopilsa Botjon jim qoladi) ↔ 🏠 doimiy joy (server) — doim yoqilgan kompyuter. Kodni u yerga qo'yish «ko'chirish» (deploy) deyiladi. Qolgan buyumlar modul lug'atidan: 🔑 kalit · 📋 varaq · 📓 daftar (DB) · 🧭 maslahatchi (AI).
- **Yakun:** final ekranda ko'chirish tartibi 5 qadamdan yig'iladi (Qur → Lokal test → .env sozla → Ko'chir → 24/7 jonli). Keyin amaliyot keladi: ko'chirish rejasi, 5 bosqich. Undan keyin podium, 12 kartochka va yakun ekrani: 5 xulosa, uyga vazifa «Yig'ing / Ko'chiring / Sinang».

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — laptop yopildi | hook | tugmani bosadi, Botjon nega jim qolganini tanlaydi | — |
| 1 | Reja | qoida | natija-chat + jihozlar paneli + bugungi 4 qadam | — |
| 2 | To'liq Botjon — 4 buyum | tushuncha | kalit / varaq / daftar / maslahatchi kartalarini bosib eslaydi | — |
| 3 | Laptop yoki doimiy joy | tushuncha | ikkala joyda «tun»ni ko'radi | — |
| 4 | 1-savol | test | buyurtmani ertaga eslab qolish qaysi buyum ishi | ✅ |
| 5 | Markaziy #1 — Botjonni yig'ish | markaziy | 3 vazifaga to'g'ri buyumni ulaydi | 🏅 |
| 6 | Kompyuter o'chdi | tushuncha | laptopni o'chiradi, ikki Botjonni solishtiradi | — |
| 7 | Markaziy #2 — Kalit sinovi | markaziy | ochiq kalit xavfini ko'radi → kalit joyini tanlaydi | 🏅 |
| 8 | 2-savol | test | doimiy joy Botjonga nima beradi | ✅ |
| 9 | Markaziy #3 — Aloqa usuli | markaziy | o'zi-so'rab-turish / qo'ng'iroqni ko'radi → birini tanlaydi | 🏅 |
| 10 | 3-savol | test | polling va webhook farqi | ✅ |
| 11 | Markaziy #4 — Tekshiruv | markaziy | 3 bandni «To'g'ri / Xato» deb belgilaydi | 🏅 |
| 12 | To'liq Botjon tunda | case | 03:00 dagi buyurtma suhbatini qadam-baqadam ochadi | — |
| 13 | 2 amaliy nuqta | tushuncha | yiqilmaslik qoidasi + kuzatish, «Tushundim» bosadi | — |
| 14 | 4-savol | test | laptop o'chgan, Botjon nega javob beryapti | ✅ |
| 15 | Ko'chirish tartibi | yakuniy | 5 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 16 | Amaliyot · Doimiy joy | praktika | ko'chirish rejasining 5 bosqichini belgilaydi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 xulosa + uyga vazifa + arena + nishonlar | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta (4, 8, 10, 14, 15; 15-ekranda uni ochadigan tugma yo'q); nishonlar — 4 ta (5, 7, 9, 11-ekranlar).

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
Botjon (bot) · to'liq Botjon — 4 buyum · 🔑 kalit (token) · 📋 qoidalar varag'i / varaq · 📓 daftar (DB) · 🧭 maslahatchi (AI) ·
💻 laptop — vaqtinchalik joy · 🏠 doimiy joy (server) — doim yoqilgan kompyuter · ko'chirish (deploy) · qulfli tortma (.env) ·
o'zi-so'rab-turish (polling) · qo'ng'iroq (webhook) · yiqilmaslik qoidasi / oxirgi qator (fallback) · kuzatib turish · 24/7 jonli · jihozlar paneli

---

## 0 · Kirish — laptop yopildi  `[736]`
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: **Botjoningiz zo'r ishlayapti. Kechqurun laptopni yopdingiz — va u jim bo'ldi. Nega?**
- Mentor: Botjonda hammasi bor: 🔑 kalit, 📋 varaq, 📓 daftar, 🧭 maslahatchi. Lekin u sizning **laptopingizda** yashardi. Tugmani bosing — tunda nima bo'lishini ko'ring.
- Chat (Botjon · bot · oflayn ⚫): mijoz «02:14 — Salom, buyurtma beraman»
- Tugma: ▶ Tunda mijoz yozdi → ✓ Ko'rdingiz
- Bosilgach chatda: 💻 Laptop yopiq — Botjon oflayn · mijoz «Hali ham javob yo'q… 😕»
- Savol: **Nega Botjon javob bermadi?** (tugma bosilmaguncha xira)
  - Botjonning kodida xato paydo bo'lgan
  - Botjon laptopingizda yashardi — laptop yopilsa, u ham jim bo'ladi
  - Telegram tunda umuman ishlamaydi
- Javobdan keyin (qaysi variant tanlansa ham): Aynan! Botjon laptopda yashasa — siz uxlasangiz, u ham «uxlaydi». Bugun Botjonga **doimiy joy** beramiz: uni doim yoqilgan kompyuterga (serverga) ko'chiramiz — u 24/7 uxlamasin.
- Tugma: Davom etish

## 1 · Reja  `[778]`
- Eyebrow: Reja
- Sarlavha: **Bo'laklardan — doim yashaydigan Botjon.**
- Mentor: Bugun yangi sintaksis kam — ko'proq **yig'amiz**. Kalit, varaq, daftar, maslahatchi tayyor. Ularni birlashtiramiz va Botjonga doimiy joy beramiz — u doim jonli tursin. Yangi jihoz yondi: 🏠 **Doimiy joy**.
- Yorliq: dars oxirida — Botjon doimiy joyda, 24/7 jonli
- Chat (Botjon · bot · onlayn 🟢):
  - mijoz: 03:00 — glutensiz pizza bormi?
  - bot: Afsus, hozircha yo'q 😔 Lekin yupqa Margarita yengil bo'ladi 🌿 Saqlab qo'yaymi?
- Blok: Kalit, varaq, daftar, maslahatchi — birga ishlayapti, doimiy joyda 24/7. Mana shu to'liq mahsulotni bugun quramiz.
- Yorliq: Jihozlar paneli — bugun 🏠 doimiy joy yonadi
- Jihozlar paneli (8 ta, yonganlari birinchi 7 tasi): Javob bera oladi · Muloqot qiladi · Eslab qoladi · O'ylay boshlaydi · Ish bajaradi · Yaxshilanadi · Doim yashaydi · (yonmagan) To'liq jihozlangan
- Bugungi 4 qadam:
  1. 4 buyumni bitta Botjonga yig'amiz · *to'liq bot*
  2. Botjonga doimiy joy — server beramiz · *doimiy joy*
  3. Aloqa usuli: o'zi-so'rab-turish yoki qo'ng'iroq · *aloqa*
  4. Ko'chirish: sina → sozla → ko'chir → 24/7 jonli · *ko'chirish*
- Tugmalar (mobil): 4 qadamni ko'rish / ↩ Natijani ko'rish · Orqaga · Boshlaymiz →

## 2 · To'liq Botjon — 4 buyum  `[819]` (kartalar `[728]`)
- Eyebrow: Yig'ish · to'liq Botjon
- Sarlavha: **To'liq Botjon — 4 buyum birga ishlaydi.**
- Mentor: Har dars sizga bitta buyum berdi. Endi ularni bitta Botjonga yig'amiz. Har buyumni bosib, u nima qilishini eslang.
- Kartalar (bosilgani ✓ bilan belgilanadi):
  - **Kalit** — Botjonning kim ekanini isbotlaydigan maxfiy 🔑 kalit. Usiz Botjon Telegram bilan gaplasha olmaydi. Doimiy joyga ko'chirganda kalit **qulfli tortmaga** (.env) qo'yiladi.
  - **Qoidalar varag'i** — Tez va aniq buyruqlar shu yerda: **signal keladi → shu amalni qil**. /start, menyu, tugmalar — hammasi 📋 varaqda.
  - **Daftar (DB)** — Botjonning doimiy 📓 daftari — buyurtma, mijoz ismi, holat shu yerda saqlanadi va Botjon o'chib-yonsa ham **yo'qolmaydi**.
  - **Maslahatchi** — Erkin, kutilmagan savolga 🧭 maslahatchi (AI) o'ylab tabiiy javob yozadi — varaqda tayyor qator bo'lmagan holatlar uchun.
- Yakun (4/4 dan keyin): To'liq Botjon tayyor: oddiy buyruqqa 📋 varaq, erkin savolga 🧭 maslahatchi, eslab qolishga 📓 daftar, kirishga 🔑 kalit. Endi unga doimiy joy topamiz.
- Tugma: 4 buyumni ko'ring (0/4) → Davom etish

## 3 · Laptop yoki doimiy joy  `[851]`
- Eyebrow: Sinov · qayerda yashaydi
- Sarlavha: **Laptop yoki doimiy joy — qayerda yashasin?**
- Mentor: Botjon ikki joyda yashashi mumkin. Ikkala tugmani bosib, tunda (siz uxlaganda) nima bo'lishini solishtiring.
- Chap: 💻 laptop — vaqtinchalik joy · tugma ▶ Laptopda tunni ko'rish → ✓ Ko'rdingiz
  - Chat (bot · oflayn ⚫): «03:00 — bormisiz?» · Laptop yopiq — Botjon jim ⚫
- O'ng: 🏠 doimiy joy — doim yoqilgan · tugma ▶ Doimiy joyda tunni ko'rish → ✓ Ko'rdingiz
  - Chat (bot · onlayn 🟢): «03:00 — bormisiz?» → «Ha, men 24/7 shu yerdaman 🟢 Buyurtmani qabul qilaman!»
- Xulosa: Farqi aniq: laptop yopilsa Botjon jim, doimiy joy esa hech qachon o'chmaydi. Shuning uchun jiddiy Botjonni doimiy joyga (serverga) **ko'chiramiz**.
- Tugma: Ikkalasini sinang (0/2) → Davom etish

## 4 · 1-savol ✅  `[881]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Mijoz buyurtmasini ertasi kuni ham eslab qolish — qaysi buyum?**
  - 🧭 Maslahatchi — chunki u aqlli
  - 📋 Qoidalar varag'i — chunki u ekranda ko'rinib turadi
  - ✔ 📓 Daftar (DB) — ma'lumotni doimiy saqlaydi
  - Hech qaysi — Botjon eslab qola olmaydi
- To'g'ri: To'g'ri! Eslab qolish — 📓 daftar (DB) ishi. Maslahatchi o'ylaydi, varaq buyruq beradi, lekin ma'lumotni doimiy saqlaydigan yagona buyum — daftar.
- Xato izohlari:
  - Maslahatchi o'ylaydi, lekin o'zi hech narsani saqlamaydi. Saqlash — daftar ishi.
  - Varaq tez buyruq uchun — u ma'lumotni saqlamaydi. Bu daftar ishi.
  - (Hech qaysi) Aksincha — daftar (DB) bilan Botjon bemalol eslab qoladi. Aynan shuning uchun o'tgan darsda daftar qo'shdik.
  - (umumiy) Eslab qolish — 📓 daftar (DB) ishi.

**Test ekranlarining umumiy yozuvlari (4, 8, 10, 14):** ✓ To'g'ri javob: X — … · To'g'ri · Qaytadan urinib ko'ring · 📖 Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: ⚡ Jonli dars — bitta urinish, o'ylab bosing! · 📨 Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · Mentor hali bu sahifaga o'tmadi

## 5 · Markaziy #1 — Botjonni yig'ish 🏅  `[906]` (variantlar `[901]`)
- Eyebrow: Markaziy · #1
- Sarlavha: **To'liq Botjonni o'zingiz yig'ing.**
- Mentor: Har vazifaga to'g'ri buyumni ulang — birga qo'shilib, to'liq ishlaydigan Botjon bo'ladi. Noto'g'ri buyum ham tanlanishi mumkin — ehtiyot bo'ling.
- Vazifalar (har birida 3 variant, tanlangani ✓ yoki ✗ oladi):
  - **Tez buyruq (/start, menyu)?** — ✔ 📋 Varaq — tayyor tugmalar va qatorlar · 🧭 Maslahatchi — har safar qaytadan o'ylaydi · 📓 Daftar — faqat saqlaydi, javob bermaydi
  - **Erkin, kutilmagan savolga javob?** — 📋 Varaqdagi tayyor qator · ✔ 🧭 Maslahatchi — o'ylab tabiiy javob yozadi · 🔑 Kalit — faqat kirishni ochadi
  - **Buyurtmani ertaga ham eslab qolish?** — 🧭 Maslahatchi — u sizni eslamaydi · 📋 Varaq — bir martalik javob · ✔ 📓 Daftar (DB) — doimiy saqlaydi
- O'ng panel: yig'ilayotgan Botjon · 🤖 Botjon — «Tez buyruqqa → … . Erkin savolga → … . Eslab qolishga → … .» (tanlangan variant nomi qo'yiladi)
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Xato bo'lsa: Ba'zi buyumlar hali noto'g'ri — ✗ belgisini toping va to'g'risini ulang.
- Muvaffaqiyat: Zo'r! Har vazifa o'z buyumiga bog'landi: 📋 varaq, 🧭 maslahatchi, 📓 daftar. To'liq Botjon tayyor — endi unga doimiy joy beramiz.
- Tugma: Botjonni yig'ing → Davom etish

## 6 · Kompyuter o'chdi  `[963]`
- Eyebrow: Sinov · doimiy joy
- Sarlavha: **Kompyuterni o'chirsak — qaysi Botjon ishlaydi?**
- Mentor: Bitta Botjon laptopda, bittasi doimiy joyda yashaydi. Tugmani bosib, laptopni o'chiring — ikkalasiga nima bo'lishini ko'ring.
- Karta 1: 💻 Laptop (vaqtinchalik joy) — 🟢 Botjon ishlayapti (siz onlaynsiz) → (o'chgach) ⚫ O'chdi — Botjon ham jim!
- Karta 2: 🏠 Doimiy joy (server) — 🟢 Botjon doim onlayn — siz uxlasangiz ham 24/7 ishlaydi ✅
- Tugma: 💻 Kompyuterni o'chirish → ✓ Ko'rdingiz
- Bosilgach: Laptop o'chdi — undagi Botjon jim. Lekin **doimiy joydagi Botjon ishlayveradi**. Shuning uchun jiddiy Botjonni doimo doimiy joyga qo'yamiz.
- Izoh-karta: 🏠 Doimiy joy — Doimiy joy — doim yoqilgan kompyuter. Uni ijaraga olasiz; qaysi xizmatni tanlashni AI'dan so'rashingiz mumkin. Siz uchun muhimi — **Botjon doim jonli** turishi.
- Tugma: Kompyuterni o'chiring → Davom etish

## 7 · Markaziy #2 — Kalit sinovi 🏅  `[1003]` (variantlar `[998]`)
- Eyebrow: Markaziy · #2
- Sarlavha: **Kalit sinovi — doimiy joyga xavfsiz ko'chiring.**
- Mentor: Botjonni doimiy joyga ko'chirayapmiz. Avval tugmani bosib, 🔑 kalitni kod ichida ochiq qoldirsak nima bo'lishini ko'ring — keyin uni qayerda saqlashni tanlang.
- Kod (bot.js):
  ```js
  // 🔑 kalit ochiq kodda:
  const token = "...";                         // bosilgach: "12345:AbC-xizmat-kaliti"
  ```
- Tugma: ▶ Kalitni ochiq qoldirib ko'rish → ✓ Ko'rdingiz
- Bosilgach: ⚠️ Kalit ochiq ko'rinib qoldi! Kimdir kodni ko'rsa (masalan git'da), kalitni nusxalab, **sizning Botjoningizni boshqarib** ketishi mumkin.
- Savol: **Doimiy joyda 🔑 kalitni qayerda saqlaymiz?** (bitta urinish)
  - Kod ichida ochiq — ko'rish oson bo'lsin
  - ✔ Qulfli tortmada (.env) — kod faqat `process.env` yozuvini ko'radi
  - Mijozga chatda yuborib qo'yamiz
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi.
- To'g'ri: ✓ To'g'ri! Kalit qulfli tortmada (.env) — kod faqat \`process.env\` yozuvini ko'radi, kalitning o'zi maxfiy qoladi va git'ga tushmaydi.
- Xato: Bu xavfli — kalit oshkor bo'ladi. To'g'ri javob: kalit **qulfli tortmada (.env)** saqlanadi, kodda faqat \`process.env\` yozuvi turadi.
  (bu ikki natija matnida teskari tirnoqlar ekranda xom ko'rinadi — oxiridagi belgilarga qarang)
- Tugma: Kalitni to'g'ri joylang → Davom etish

## 8 · 2-savol ✅  `[1047]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **🏠 Doimiy joy (server) Botjonga nima beradi?**
  - ✔ 24/7 ishlashni — siz uxlasangiz ham u jonli qoladi
  - Botni chiroyliroq rangga bo'yaydi
  - Butun uy uchun internetni tezlashtiradi
  - Kodni o'zi to'liq yozib beradi, endi sizga kod yozish kerak emas
- To'g'ri: To'g'ri! Doimiy joy — doim yoqilgan kompyuter. Botjonni u yerga ko'chirsangiz, u siz uxlaganda ham, laptopingiz o'chganda ham 24/7 jonli ishlaydi.
- Xato izohlari: Rangga aloqasi yo'q — doimiy joy Botjonni doim jonli ushlab turadi, xolos. · Uy internetiga aloqasi yo'q — bu Botjonning yashash joyi. · Kodni siz (AI yordamida) yozasiz; doimiy joy shuni doim jonli ishlatib turadi. · (umumiy) Doimiy joy Botjonni 24/7 jonli ishlatadi.

## 9 · Markaziy #3 — Aloqa usuli 🏅  `[1071]` (demo `[1067]`)
- Eyebrow: Markaziy · #3
- Sarlavha: **Botjon xabarni qanday oladi — 2 usul.**
- Mentor: Yangi xabar kelganini Botjon ikki yo'l bilan biladi. Ikkala tugmani bosib, farqni ko'ring — keyin kichik do'kon boti uchun qaysi soddaroq ekanini tanlang.
- Tugmalar: O'zi-so'rab-turish · Qo'ng'iroq
- 🔁 o'zi-so'rab-turish (chat holati: «polling»):
  - Botjon: yangi xabar bormi? → Telegram: yo'q. → Botjon: yangi xabar bormi? → Telegram: ha, bitta bor! → Botjon javob beradi
- 🔔 qo'ng'iroq (chat holati: «webhook»):
  - Telegram: xabar bor! 🔔 → Botjon: qabul qildim, darhol javob beraman
- Tanlov (ikkalasi ko'rilgach, bitta urinish): 🔁 O'zi-so'rab-turish ✔ · 🔔 Qo'ng'iroq
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi.
- To'g'ri: ✓ To'g'ri! Kichik bot uchun o'zi-so'rab-turish (polling) soddaroq — hech qanday maxsus sozlash kerak emas. Foydalanuvchi ko'paysa, qo'ng'iroqqa (webhook) o'tasiz.
- Qo'ng'iroq tanlansa: Qo'ng'iroq (webhook) tezroq, lekin qo'shimcha sozlash talab qiladi. Kichik bot uchun soddaroq yo'l — o'zi-so'rab-turish (polling).
- Tugma: Ikkalasini sinab ko'ring → Davom etish

## 10 · 3-savol ✅  `[1117]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **O'zi-so'rab-turish va qo'ng'iroq — asosiy farqi nima?**
  - O'zi-so'rab-turish botni ancha chiroyliroq va zamonaviyroq qiladi, qo'ng'iroq esa yo'q
  - Ikkalasi mutlaqo bir xil, hech qanday farqi yo'q
  - Qo'ng'iroq faqat kechasi ishlaydi, kunduzi ishlamaydi
  - ✔ O'zi-so'rab-turishda Botjon tinmay so'raydi, qo'ng'iroqda Telegram xabar beradi
- To'g'ri: To'g'ri! O'zi-so'rab-turishda (polling) Botjon Telegram'dan tinmay «yangi xabar bormi?» deb so'raydi. Qo'ng'iroqda (webhook) esa Telegram yangi xabar kelganda Botjonga o'zi «xabar bor!» deb bildiradi.
- Xato izohlari: Ko'rinishga aloqasi yo'q — farq xabarni qanday olishida. · Farqi bor: kim tashabbus qiladi — Botjonmi (so'raydi) yoki Telegrammi (xabar beradi). · Ikkalasi ham istalgan vaqtda ishlaydi — farq vaqt emas, usulda. · (umumiy) Polling — Botjon so'raydi; webhook — Telegram o'zi xabar beradi.

## 11 · Markaziy #4 — Ko'chirishdan oldin tekshiruv 🏅  `[1142]` (bandlar `[1137]`)
- Eyebrow: Markaziy · #4
- Sarlavha: **Ko'chirishdan oldin — tekshiruv.**
- Mentor: Botjonni doimiy joyga ko'chirishdan oldin 3 ta band bor. Har birini o'qib, u **to'g'ri qoidami** yoki **xato** ekanini belgilang.
- Yorliq: ko'chirishga tayyorlik ro'yxati · har bandda: ✅ To'g'ri · ❌ Xato (bitta urinish)
  - 🔑 kalit qulfli tortmada (.env), ochiq kodda emas — ✔ To'g'ri
  - Kod laptopda sinalmagan — to'g'ridan-to'g'ri ko'chiraveramiz — ✔ Xato
  - Doimiy joy (server) doim yoqilgan — 24/7 jonli turadi — ✔ To'g'ri
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi.
- Hammasi to'g'ri: ✓ Ajoyib! Kodni ko'chirishdan oldin **albatta laptopda sinash** kerak — bu «to'g'ridan-to'g'ri ko'chiraveramiz» bandi xato edi. Qolgan ikkitasi to'g'ri qoida.
- Xato bo'lsa: Diqqat: kodni **sinamasdan** ko'chirish xato — avval laptopda test qilinadi. Kalit .env'da bo'lishi va doimiy joy yoqilgan turishi esa to'g'ri qoidalar.
- Tugma: Har bandni tekshiring (0/3) → Davom etish

## 12 · To'liq Botjon tunda (case)  `[1187]`
- Eyebrow: Hayotiy · to'liq Botjon
- Sarlavha: **Doimiy joyda — Botjon tunda ham ishlaydi.**
- Mentor: Endi to'liq Botjon doimiy joyda. Tugmani bosib, tungi suhbatni davom ettiring — 🧭 maslahatchi javob beradi, 📓 daftar eslab qoladi.
- Suhbat (Botjon · bot · onlayn 🟢):
  1. mijoz «03:00 — glutensiz pizza bormi? 🌙» → bot «Salom! 🟢 Men 24/7 shu yerdaman. Afsus, glutensiz hozircha yo'q — lekin yupqa Margarita yengil bo'ladi 🌿»
  2. mijoz «Bo'ldi, Margarita olaman» → bot «Zo'r tanlov! 🎉 Margarita — 35 000 so'm. Buyurtmangizni 📓 daftarga yozib qo'ydim, ertaga ham eslayman 📝»
  3. mijoz «Rahmat! Manzil: Chilonzor» → bot «Qabul qilindi 📍 Chilonzor — daftarga qo'shdim. Buyurtmangiz yo'lga chiqadi ✅»
- Tugmalar: ▶ Tungi suhbatni boshlash · Keyingi xabar → · ✓ Botjon 24/7 ishlayapti
- Karta: 🏠 Har javob ortida — Botjon doimiy joyda (serverda) — 🧭 maslahatchi o'ylaydi, 📓 daftar buyurtmani saqlaydi. Siz uxlasangiz ham u jonli.
- Xulosa: Ko'rdingizmi? 03:00 da, siz uxlaganda ham Botjon buyurtmani qabul qildi va daftarga yozdi. To'liq mahsulot — doimiy joyda, 24/7 jonli.
- Tugma: Suhbatni davom ettiring (0/3) → Davom etish

## 13 · 2 amaliy nuqta  `[1232]`
- Eyebrow: Amalda · 2 nuqta
- Sarlavha: **Doimiy joyga qo'yishdan oldin — 2 ta amaliy nuqta.**
- Mentor: Botjon doimiy joyda 24/7 ishlaydi. Ikki narsani yodda tuting: yiqilmaslik qoidasi va kuzatish.
- Kartalar:
  - 🛟 **1. Yiqilmaslik qoidasi** — Botjon xatoga uchrasa ham **jim qolmasin**. Oxirgi qator (fallback) tayyor bo'lsin: «Uzr, birozdan keyin urinib ko'ring 🙏». Shunda mijoz javobsiz qolmaydi.
  - 📈 **2. Kuzatib turing** — Doimiy joy jonli ekanini vaqti-vaqti bilan tekshiring. Botjon to'xtab qolsa, xabar olib, qayta yoqasiz.
  - 📍 **Bugungi qoidalar — qisqacha** — 🧩 4 buyumni yig' → 🔑 kalitni .env'ga → 🏠 doimiy joyga ko'chir → 🛟 yiqilmaslik qoidasi → 📈 kuzatib tur.
- Tugma (ichkarida): Tushundim ✓ → ✓ Tushundim
- Bosilgach: Ana shu qoidalar bilan Botjon doimiy joyda ishonchli, doim jonli yordamchiga aylanadi.
- Pastki tugma: Tushundingiz ✓ → Davom etish

## 14 · 4-savol ✅  `[1258]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Laptopingiz o'chgan, lekin Botjon hali ham javob beryapti. Nega?**
  - Chunki Telegram endi botni butunlay o'zi yuritib turadi
  - ✔ Chunki Botjon doimiy joyga (serverga) ko'chirilgan
  - Chunki laptop aslida o'chmagan
  - Chunki mijoz botni o'zi ishga tushirgan
- To'g'ri: To'g'ri! Botjon doimiy joyga (serverga) ko'chirilgan — u doim yoqilgan kompyuterda yashaydi. Shuning uchun laptopingiz o'chsa ham, u 24/7 jonli ishlayveradi.
- Xato izohlari: Telegram faqat xabarlarni yetkazadi — Botjonni yuritmaydi. Uni doimiy joy (server) yuritadi. · Laptop chindan o'chgan — Botjon boshqa joyda (doimiy joyda) ishlayapti. · Mijoz botni ishga tushirmaydi. Bot doimiy joyda o'zi jonli turadi. · (umumiy) Sabab — Botjon doimiy joyga (serverga) ko'chirilgan.

## 15 · Ko'chirish tartibi ✅ (final)  `[1286]` (bo'laklar `[1278]`)
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: ko'chirish tartibini yig'ing.**
- Mentor: Botjonni doimiy joyga ko'chirishning to'g'ri tartibini eslang: avval nima quriladi, keyin nima sinaladi, oxirida nima jonli bo'ladi?
- Bo'laklar (aralash beriladi) — to'g'ri tartib:
  1. 4 buyumni bitta Botjonga yig'
  2. Laptopda sinab ko'r
  3. Kalitni .env'ga sozla
  4. Doimiy joyga ko'chir
  5. 24/7 jonli — tayyor
- Uyachalar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam
- Xato: ⚠️ Tartib xato — qayta joylang. · Tartib xato — bo'lakni bosib qaytaring va qayta joylang
- To'g'ri: ✓ Ko'chirish tartibi tayyor! · ✓ Tartib: **Qur → Lokal test → .env sozla → Ko'chir → 24/7 jonli**. Shu tartib bilan Botjon doimiy joyda ishonchli, doim jonli bo'ladi.
- Tugma: Tartibni yig'ing → Davom etish

## 16 · Amaliyot · Doimiy joy  `[2112]` (shablon `[1984]`)
- Eyebrow: Amaliyot · Doimiy joy · joy: «kompyuteringizda»
- Sarlavha: **Botjoningizni doimiy joyga ko'chirish rejasini yozing**
- Mentor: Bu topshiriqni **o'z kompyuteringizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: O'z Botjoningiz (yoki istalgan loyiha) uchun ko'chirish rejasini tayyorlang: 4 buyumni tekshiring, kalitni qulfli tortmaga (.env) ko'chiring, kodni laptopda sinang va doimiy joyni tanlang. Har bosqichni bajarib, belgilab boring.
- Bosqichlar — belgilab boring:
  1. To'liq Botjonning 4 buyumi borligini tekshiring: 🔑 kalit, 📋 varaq, 📓 daftar, 🧭 maslahatchi
  2. 🔑 kalitni qulfli tortmaga (`.env`) ko'chiring — kodda faqat `process.env` qolsin
  3. Kodni o'z laptopingizda ishga tushirib, sinab ko'ring
  4. Doimiy joy (hosting xizmati)ni tanlang va uni AI'dan so'rab aniqlang
  5. Yiqilmaslik qatorini (fallback) qo'shing: xato bo'lsa ham Botjon jim qolmasin
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.» · pastki: Avval bajaring → Davom etish
- Mentor ko'rinishida: 👀 Kim bajardi — N/M · Yuklanmoqda… · Hali hech kim qo'shilmagan.

## 17 · Natijalar (podium)  `[1859]`
- Eyebrow: Natijalar · Sarlavha: **Kim g'olib?**
- Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.
- Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin (X/5 to'g'ri) · 🏆 To'liq reyting
- Savol yorliqlari: 1 — To'liq bot · 2 — Doimiy joy · 3 — Aloqa usuli · 4 — Nega jonli · 5 — Ko'chirish tartibi

## 18 · Takrorlash (kartochkalar)  `[2140]` (kartalar `[2126]`)
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| To'liq Botjonning 4 buyumi qaysilar? | 🔑 kalit, 📋 varaq, 📓 daftar, 🧭 maslahatchi | har buyum bitta ishni bajaradi |
| Buyurtmani ertaga ham eslab qolish qaysi buyumning ishi? | 📓 daftar | daftar (DB) ma'lumotni doimiy saqlaydi |
| Erkin savolga o'ylab javob berish qaysi buyumning ishi? | 🧭 maslahatchi | oddiy buyruqqa esa 📋 varaq javob beradi |
| Botjon laptopda yashasa, laptopni yopganingizda nima bo'ladi? | Botjon jim qoladi | laptop — vaqtinchalik joy |
| Doim yoqilgan, o'chmaydigan kompyuter qanday ataladi? | Doimiy joy | server: Botjon u yerda tunu-kun ishlaydi |
| Kodni laptopdan doimiy joyga qo'yish nima deyiladi? | Ko'chirish | deploy — shundan keyin bot 24/7 jonli |
| Botjon Telegram'dan tinmay «yangi xabar bormi?» deb so'rasa, bu qaysi usul? | O'zi-so'rab-turish | polling — sodda, kichik bot uchun |
| Telegram yangi xabarni Botjonga o'zi bildirsa, bu qaysi usul? | Qo'ng'iroq | webhook — tezroq, foydalanuvchi ko'p bo'lganda |
| Kichik Botjon uchun qaysi aloqa usuli soddaroq? | O'zi-so'rab-turish | foydalanuvchi ko'paysa, qo'ng'iroqqa o'tasiz |
| Doimiy joyda 🔑 kalit qayerda saqlanadi? | .env faylda | bu qulfli tortma: kalit ochiq yotmaydi |
| Xato bo'lganda ham Botjon jim qolmasligi uchun nima qo'shiladi? | Yiqilmaslik qatori | fallback — zaxira javob har doim chiqadi |
| Kodni ko'chirishdan oldin oxirgi qadam qaysi? | Laptopda sinash | lokal test: xatolar shu yerda topiladi |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 19 · Yakun  `[2153]`
- Eyebrow: Tayyor · belgi: ✓ Botjon endi doim yashaydi
- Sarlavha: **Botjoningiz endi laptopda emas — doimiy joyda, 24/7 jonli.** (yonida ball halqasi)
- Jonli viktorina tugmasi (CodeStrike) · ⏳ Mentorni kuting
- Endi siz bilasiz:
  - To'liq Botjon — 4 buyum birga: 🔑 kalit, 📋 varaq, 📓 daftar (DB), 🧭 maslahatchi (AI)
  - 🏠 Doimiy joy (server) — doim yoqilgan kompyuter; Botjon u yerda 24/7 uxlamaydi
  - Ko'chirish (deploy): laptopda sina → 🔑 kalitni .env'ga sozla → doimiy joyga ko'chir → jonli
  - Aloqa usuli: o'zi-so'rab-turish (polling) — sodda, kichik botga; qo'ng'iroq (webhook) — tez, ko'p foydalanuvchiga
  - Yiqilmaslik qoidasi (fallback) — Botjon xato bo'lsa ham jim qolmasin: oxirgi qator tayyor tursin
- Uyga vazifa tugmasi: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda: amaliyot · loyiha · mashq · natija)
- 📝 Uyga vazifa:
  - **Yig'ing** — o'z Botjoningiz uchun 4 buyumni bitta joyga yig'ing va laptopda ishga tushiring
  - **Ko'chiring** — 🔑 kalitni .env'ga qo'ying, doimiy joy (hosting) tanlang va Botjonni u yerga ko'chiring
  - **Sinang** — laptopingizni o'chiring va Botjon 24/7 jonli ekanini o'z ko'zingiz bilan ko'ring
- 🚀 Keyingi dars — Botjon to'liq jihozlanadi: barcha buyumlar bilan yakuniy AI-loyihani boshdan-oxir quramiz! ⭐
- 🏅 Nishonlaringiz — N/4 (olinmagani 🔒)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** 🧩 Assemble Master — To'liq Botjonni o'zingiz yig'dingiz · 🔑 Key Master — Kalitni qulfli tortmaga (.env) qo'ydingiz · 🔔 Link Master — Botjonga to'g'ri aloqa usulini tanladingiz · ✅ Check Master — Ko'chirishdan oldin tekshiruvni bajardingiz
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Nishon birinchi urinish uchun edi. · Yangi nishon · bosib davom eting

**Qisqa takrorlash oynalari (5):** (sarlavha «📖 Qayta tushuntirish», har oxirgi kartada «🗣️ Sinfga savol:», tugmalar ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz)
1. (4-ekran) To'liq Botjon — 4 buyum birga: Har buyum — bitta ish (To'liq Botjon 4 buyumdan: 🔑 kalit (kim ekanini isbotlaydi), 📋 varaq (tez buyruqlar), 📓 daftar (eslab qoladi), 🧭 maslahatchi (erkin savolga o'ylab javob).) · Eslab qolish — daftar ishi (Buyurtmani ertaga ham eslab qolish kerak bo'lsa, bu **📓 daftar (DB)** ishi — u ma'lumotni doimiy saqlaydi.) · Birga ishlaydi (Oddiy buyruqqa 📋 varaq, erkin savolga 🧭 maslahatchi, eslab qolishga 📓 daftar — birgalikda to'liq mahsulot.) — Sinfga savol: Buyurtmani ertaga ham eslab qolish qaysi buyumning ishi?
2. (8-ekran) Doimiy joy — server: Laptop — vaqtinchalik (Botjon laptopingizda yashasa, siz laptopni yopganda u ham **jim bo'ladi**.) · Doimiy joy — o'chmaydi (Doimiy joy (server) — doim yoqilgan kompyuter. Botjonni u yerga ko'chirsangiz, u **24/7** ishlaydi.) · Ko'chirish — deploy (Kodni laptopdan doimiy joyga qo'yish — «ko'chirish» deyiladi.) — Sinfga savol: Nega jiddiy Botjon laptopda emas, doimiy joyda yashashi kerak?
3. (10-ekran) Aloqa usuli — o'zi-so'rab-turish yoki qo'ng'iroq: O'zi-so'rab-turish (Botjon tinmay so'raydi: «yangi xabar bormi?» — sodda, kichik Botjon uchun qulay.) · Qo'ng'iroq (Telegram yangi xabar kelganda Botjonga o'zi «xabar bor!» deb qo'ng'iroq qiladi — tezroq, ko'p foydalanuvchi uchun.) · Kichikdan boshlang (Boshida o'zi-so'rab-turish yetarli; foydalanuvchi ko'paysa qo'ng'iroqqa o'tasiz.) — Sinfga savol: Kichik Botjon uchun qaysi usul soddaroq?
4. (14-ekran) Nega serverda 24/7 jonli: Siz uxlaysiz — Botjon yo'q (Botjon laptopda bo'lsa, siz uxlaganda u ham javob berolmaydi.) · Doimiy joy uxlamaydi (Doimiy joy (server) hech qachon o'chmaydi — Botjon u yerdan **tunu-kun** javob beradi.) · Shuning uchun ko'chiramiz (Botni doimiy joyga ko'chirish — uni 24/7 jonli qilishning yagona yo'li.) — Sinfga savol: Laptop o'chgani bilan Botjon ishlayotgani nimadan?
5. (15-ekran, ochadigan tugma yo'q) Ko'chirish tartibi: Avval — qurish va sinash (Birinchi kodni yozasiz (4 buyum) va uni **laptopda sinab** ko'rasiz.) · Keyin — kalitlarni sozlash (Doimiy joyda 🔑 kalit va sozlamalar **qulfli tortmaga** (.env) qo'yiladi.) · Eng oxiri — ko'chirish va jonli (Kod doimiy joyga ko'chiriladi va Botjon 24/7 jonli bo'ladi.) + chizma: 🔧 Qur → 🧪 Lokal test → 🔑 .env sozla → 🚚 Ko'chir → 🌐 24/7 jonli — Sinfga savol: Nega ko'chirishdan oldin laptopda sinaymiz?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. To'liq ishlaydigan Botjonda nechta asosiy buyum bor? Bitta — faqat 🧭 maslahatchi · ✔ To'rtta — 🔑 kalit, 📋 varaq, 📓 daftar, 🧭 maslahatchi · Ikkita — 🔑 kalit va 📋 varaq · Umuman buyum kerak emas — Telegram bularning barchasini o'zi bajaradi
2. Buyurtmani ertaga ham eslab qolish — qaysi buyum ishi? 🔑 kalit · 📋 qoidalar varag'i · 🧭 maslahatchi · ✔ 📓 daftar (DB)
3. «Ko'chirish» (deploy) nima degani? ✔ Kodni doimiy joyga (serverga) qo'yish · Botni butunlay o'chirib qo'yish · Eski 🔑 kalitni yangisiga almashtirib qo'yish · Yangi mijoz qo'shish
4. 🏠 Doimiy joy (server) — bu nima? Sizning laptopingiz · Telegram kanali · ✔ Doim yoqilgan kompyuter — o'chmaydi · Buyurtma bergan mijozning shaxsiy telefoni
5. Botjonni laptopdan doimiy joyga ko'chirsak, nima o'zgaradi? Botjon sezilarli darajada sekinroq ishlaydigan bo'lib qoladi · ✔ Botjon 24/7 jonli bo'ladi — siz uxlasangiz ham ishlaydi · Botjon faqat kunduzi ishlaydi · Hech narsa — hammasi avvalgidek qoladi
6. 🔑 kalit doimiy joyda qayerda saqlanadi? ✔ Qulfli tortmada (.env) — maxfiy, kodda ochiq emas · To'g'ridan-to'g'ri ochiq kodda, hamma ko'radigan joyda · Mijozga chatda yuboriladi · Hech qayerda saqlanmaydi
7. O'zi-so'rab-turish (polling)da tashabbusni kim qiladi? Mijozning o'zi to'g'ridan-to'g'ri Botjonga murojaat qiladi · Telegram — yangi xabar kelganda Botjonga o'zi darhol xabar beradi · Doimiy joy (server) · ✔ Botjon — u tinmay «yangi xabar bormi?» deb so'raydi
8. Qo'ng'iroq (webhook)da kim xabar beradi? Botjonning o'zi tinmay «yangi xabar bormi?» deb so'rab turadi · ✔ Telegram — yangi xabar kelganda Botjonga o'zi bildiradi · Mijoz to'g'ridan-to'g'ri · Hech kim — o'zi sodir bo'ladi
9. Kichik do'kon boti uchun qaysi aloqa usuli soddaroq? Qo'ng'iroq (webhook) · Ikkala usul ham umuman kerak bo'lmaydigan narsa · ✔ O'zi-so'rab-turish (polling) · Hech qaysi ishlamaydi
10. Kodni doimiy joyga ko'chirishdan oldin nima qilish kerak? 🔑 kalitni ochiq kodga ko'chirib yozib qo'yish · Hech narsa, to'g'ridan-to'g'ri ko'chiraveramiz · Laptopni butunlay o'chirib qo'yish · ✔ Kodni laptopda sinab ko'rish
11. Botjon xatoga uchrasa ham jim qolmasligi uchun nima tayyorlanadi? ✔ Oxirgi qator (fallback): «birozdan keyin urinib ko'ring» · Xato chiqqan zahoti Botni butunlay o'chirib, keyin qaytadan yoqish · 🔑 kalitni yangilash · Hech narsa tayyorlash shart emas — Botjon o'zi to'xtab qoladi
12. Laptop o'chgan, lekin Botjon javob beryapti. Sababi? Laptop aslida umuman o'chmagan bo'lishi kerak · Telegram botni endi o'zi yuritadi · ✔ Botjon doimiy joyga (serverga) ko'chirilgan · Mijoz botni o'zi ishga tushirgan

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **0-ekran (hook):** qaysi variant tanlansa ham «Aynan! Botjon laptopda yashasa…» chiqadi. «Kodida xato paydo bo'lgan» yoki «Telegram tunda umuman ishlamaydi»ni tanlagan o'quvchi ham «Aynan!» degan javobni oladi.
- **1-ekran, jihozlar paneli:** 8 ta jihozdan 7 tasi yonadi, ular orasida «Ish bajaradi» va «Yaxshilanadi» ham bor. Modul tartibida bu mavzular keyinroq keladi: 9 «Fikr va iteratsiya», 10 «AI-agent yaratish». Panel nomlari 1-darsdagidan ham farq qiladi (1-dars: Kalit · Qoidalar varag'i · Tugmalar · Konvert (ctx) · Holat daftari · … · AI yordamchi).
- **4-ekran, «Hech qaysi» variantining xato izohi:** «Aynan shuning uchun o'tgan darsda daftar qo'shdik». Daftar (DB) 4-darsda («Stateful logika + PostgreSQL») qo'shilgan, o'tgan dars esa 6 «Bot ichida AI».
- **19-ekran, keyingi dars:** «Keyingi dars — Botjon to'liq jihozlanadi: … yakuniy AI-loyihani boshdan-oxir quramiz!». App.jsx tartibida keyingi dars 8 «Botingizni ishlatgan odamdan nimani so'raysiz?» (PM).
- **15-ekran (final) + 18-ekran, kartochka 12:** Mentor «avval nima quriladi, keyin nima sinaladi, oxirida nima jonli bo'ladi?» deydi. Bu gap 5 o'rindan 3 tasini (1, 2, 5) oldindan aytib qo'yadi. Tartibning o'zi 1-ekranning 4-qadamida ham ochiq yozilgan («sina → sozla → ko'chir → 24/7 jonli»). Kartochka 12 («Kodni ko'chirishdan oldin oxirgi qadam qaysi? → Laptopda sinash») finalga zid: finalda sinash bilan ko'chirish orasida «Kalitni .env'ga sozla» turadi.
- **7-ekran:** ikkala natija matnida (to'g'ri va xato) `process.env` teskari tirnoqlari bilan xom ko'rinadi, chunki bu matnlar kod-formatlashdan o'tmaydi. Variant tugmalarida esa kod sifatida to'g'ri chiqadi. Bundan tashqari, «git'da» / «git'ga tushmaydi» izohsiz: git bu darsda ochilmagan.
- **Hosting (6, 16, 19-ekranlar):** darsda na xizmat nomi, na ko'chirish qadamlari bor. Bor-yo'g'i shu gaplar bor: «Uni ijaraga olasiz; qaysi xizmatni tanlashni AI'dan so'rashingiz mumkin» (6) va «Doimiy joy (hosting xizmati)ni tanlang va uni AI'dan so'rab aniqlang» (16). Uyga vazifa esa haqiqiy ko'chirishni so'raydi: «Botjonni u yerga ko'chiring… laptopingizni o'chiring…». Matndagi ma'lumot bilan o'quvchi buni bajara olmaydi. App.jsx'da nom «bot + DB + AI», tavsif «to'liq ishlaydigan bot + hosting», lekin DB va AI darsda faqat eslatiladi. 16-ekran sarlavhasi «rejasini yozing» deydi, bosqichlari esa bajarishni so'raydi («ko'chiring», «ishga tushirib, sinab ko'ring»).
- **Bir narsaning bir necha nomi / izohsiz inglizcha:** 1-darsda fallback «mos qator topilmasa» holati uchun edi. Bu darsda u «xatoga uchrasa» ma'nosida ishlatiladi va uch xil nomlanadi: «Yiqilmaslik qoidasi» (13, 19) · «Yiqilmaslik qatori» (16, kartochka 11) · «Oxirgi qator (fallback)» (13, arena 11). 1-darsda Botjon «xizmat oynasi»dan so'rardi, bu yerda Telegram'dan so'raydi (9). 6-ekranda laptop va «kompyuter» aralashib ketgan: sarlavha «Kompyuterni o'chirsak», tugma «💻 Kompyuterni o'chirish», Mentor esa «laptopni o'chiring» deydi. Holbuki doimiy joy ham «doim yoqilgan kompyuter». Izohsiz qolganlar: «polling»/«webhook» (9-ekran chat holati), «Lokal test» (15), «DB», nishon nomlari (Assemble / Key / Link / Check Master). «Daftar» so'zini 1-dars MD'sida taqiq deb belgilagan edim, bu darsda u DB metaforasi bo'lib deyarli har ekranda turibdi.
