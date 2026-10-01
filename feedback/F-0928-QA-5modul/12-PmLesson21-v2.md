# 5-Modul (LMS: 7-Modul) · 12-dars «Kecha kelgan odam bugun ham keldimi?» — YANGI MATN (v2-qoralama)

Fayl: `src/5-Modull/PmLesson21.jsx` · 16 ekran · PM darsi · faqat o'zbekcha (ruschasi o'zbekcha tasdiqlangach)
Eski matn: `12-PmLesson21-sozlar.md`. Har ekran ostida **Ko'rinish** (nima qachon chiqadi, animatsiya bormi) va `✎` (nima o'zgardi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi. **KOD** — kod o'zgarishi kerak bo'lgan joy.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti: `s3:1 · s5:0 · s7:2 · s11:1` — B · A · C · B; viktorina ✔ o'rni `0·3·2·1·1·0·2·3·0·2·1·3`) — faqat matn.
Kirish: umumiy qoidalar F-0929-53…56, 1-dars v2 A-bo'limi (A8 — to'g'ri javob izohi bitta gap). PM uy vazifasi MD'ga kirmaydi (12-savol B: `HwCard` dan faqat emoji olinadi). **30.09: ChatGPT matn auditi (F-0930-109) filtrlandi** — hukmlar `JURNAL.md`.

---

## A. Qoidalar

Modul qoidalari — `01-BotIntro-v2.md` A1–A9 amal qiladi. Shu darsga xos qo'shimchalar:

| Eski (olib tashlanadi) | Yangi asosiy nom | Birinchi chiqqanda (bir marta) |
|---|---|---|
| «… qaytgan hisoblanadi» · «Kim qaytgan hisoblanadi?» | «… u bugun qaytgan odam» · «Kim qaytgan?» | — (lug'at: «X Y hisoblanadi» → «X — Y») |
| «Kecha ham kelgan» (1-ekran ustuni) | **Qaytdi** (4, 8, 11-ekran yorlig'i bilan bir nom) | — (atama 11-darsda o'tilgan) |
| «birinchi marta kelgan odam» (qaytmagan ma'nosida) | **kecha kelmagan** | — (qaytmagan odam avvalroq kelgan bo'lishi mumkin) |
| 🔥 raqam | **olov belgili raqam** | 6-ekran 3-bosqich: «ilovada bu raqam streak deb ataladi» |
| kod bo'lagi (`hisob`) | **funksiya** (`hisob` funksiyasi) | — (JS darslaridan tanish) |
| yozuv (kodda) | **obyekt** · `{ kun, kelgan, qaytgan }` | — (hisob jadvalida «qator» qoladi) |
| kompilyator · kod oynasi | **kod oynasi** | «chapda kod yozasiz, o'ngda natija chiqadi» (lug'at: kompilyator → kod oynasi) |
| «1-kundan oldingi kun yo'q» | «**hisobda** 1-kundan oldingi kun yo'q» → qaytgani **0** | 4-ekran 1-kun |
| «ulardan N tasi kecha ham kelgan edi» (4-ekran paneli) · «Ulardan nechtasi kecha ham kelgan?» (8-ekran katagi) | «ulardan N tasi **qaytdi**» · «Ulardan nechtasi **qaytdi**?» | — (ta'rif 2-ekranda; 30.09, A2) |
| «kundan kunga» | **kun sayin** (0-ekran bilan bir) | — |
| «Bugun botni ochgan hamma odam» | 11-dars ta'rifi: «bugun botga yozgan yoki tugma bosgan odamlar — har biri bir marta sanaladi» | 2-ekran |
| «8-darsda uch odamning gapini eshitgansiz» · «Eshitganingiz» | 8-darsda **bitta** odam uchta savolga javob bergan → «8-darsda odam nima deganini eshitgansiz» · tasma: «8-darsda eshitgan javoblaringiz» (8-dars atamasi) | — |

**A-12.1. Bir rang — bir ma'no (DAVOM 7).** Yashil — faqat **qaytish**: qaytgan odam (0, 4-ekran), «Qaytdi» qatori, to'g'ri qaytish kuni (9-ekran).
Kelgan odam yoki kelgan kun — och binafsha katak, binafsha ramka; bo'sh kun — fonsiz, ingichka kulrang ramka. O'quvchi belgilagan katak — to'qroq binafsha, qalin ramka. (01.10 razrabotka, F-1001-87: oq «to'lgan» katak kulrang bo'sh katakdan bo'sh bo'lib o'qilardi.)
Uzilgan kun (Duolingo chizmasi) — qizil ramka. Matnda rang nomi aytilmaydi: «to'lgan katak», «bo'sh katak».

**A-12.2. «Qaytgan» — eslatiladigan atama.** 11-darsda «kecha kelganlardan bugun ham kelganlar — qaytganlar» ta'rifi, foiz va ro'yxat solishtirish (bot yozuvi, 3-savol) bor. 11-darsdagi `/stat` kodi bugun kelganlar va bosh raqamni sanaydi; qaytganlarni kodda sanash — shu darsda, 10-ekran (23-savol A, 01.10).
Bu dars uni qayta kiritmaydi — eslatadi va yangisini qo'shadi: **bir necha kun yonma-yon**, e'lonning ikki songa ta'siri, har odamning qaytish kunlari.

**A-12.3. E'lon haqidagi xulosa — umumiy qonun emas (30.09 aniqlandi).** Darsda bitta namuna bor, undan qonun chiqarilmaydi. 4-ekranda — «bu misolda»; test (5-ekran) — namunadagi sonlarni o'qish; umumiy xulosa faqat shu: **ko'p odam kelgani — ko'p odam qaytgani degani emas** (ikki sonni birga o'qing). «qaytganlar odatda kam o'zgaradi» ham olinadi.

**A-12.4. Besh kun — namuna, uch kun — o'zingizniki (30.09).** 1-ekran Mentori buni bir gapda aytadi; 8-ekran «namunadagidek» deb bog'laydi.

---

## Darsning ipi
- **Olam (bitta):** o'quvchining o'z Telegram-boti. 4 va 9-ekranda — namuna sonlar, 8-ekranda — o'z botining sonlari.
- **Hook:** «Kecha kelgan odam bugun ham keldimi?» — bitta kun uchun javobni 11-darsda topgan; bugun — kun sayin.
- **Asosiy model (dars bo'yi bitta):** har kunda ikki son — **Keldi · Qaytdi**; qaytish ikki kunning yonma-yon turishidan ko'rinadi.
- **Oldingi bilimga ko'prik:** 11-dars (qaytganlar foizi, ikki ro'yxatni solishtirish, `/stat` — `stat` funksiyasining `for…of` + `includes` naqshi 10-ekranda takrorlanadi) · 8-dars (bitta odamning eshitgan javoblari, 8-ekran tasmasi) · JS (funksiya, obyekt, `includes`).
- **Tajribalar:** kunlarni ochish va e'lon (4) · Duolingo (6) · o'z botining uch kuni (8) · qaytish kunlarini belgilash (9) · `hisob` funksiyasi (10) · ikki sonni yoddan aytish (12).
- **Keyingi dars (App.jsx m5-12):** Zaxira dars (yetib olish / sayqallash), undan keyin m5-13 — Demo Day (jonli bot + 20 foydalanuvchi + metrika).

## Reja (oqim)

| # | Ekran | Turi | O'quvchi nima qiladi | Ball |
|---|---|---|---|---|
| 0 | Kirish — kecha kelgan odam | hook | ikki javobdan birini tanlaydi, umumiy javob ochiladi | — |
| 1 | Maqsad | qoida | uch kunlik hisob jadvalini ko'radi (kataklarda «?») | — |
| 2 | Ikki son | tushuncha | «Bugun kelganlar» / «Qaytganlar» kartalarini ochadi | — |
| 3 | 1-savol | test | seshanba kelgan 5 odamdan kim qaytgan | ✅ |
| 4 | Botingizning kunlari | markaziy | 5 kunni ochadi, 3-kundan keyin e'lon beradi, ikki qatorni kuzatadi | — |
| 5 | 2-savol | test | katta e'londan keyin ertasiga nima bo'ladi | ✅ |
| 6 | Duolingo | haqiqiy misol | 5 bosqich, 2 bashorat | — |
| 7 | 3-savol | test | olov belgili raqam qachon o'sadi | ✅ |
| 8 | Uch kun | amaliyot | o'z botining 3 kunini yozadi: keldi + qaytdi | — |
| 9 | Besh kunlik ro'yxat | amaliyot (tekshiruv) | 4 odamning qatorida qaytish kunlarini belgilaydi | — |
| 10 | Koding | koding | darvoza-savol, keyin kod oynasida `hisob` funksiyasini yozadi | — |
| 11 | 4-savol | test | chorshanba kunining hisob-qatori | ✅ (final) |
| 12 | Mustahkamlash | refleksiya | o'z hisobidagi 2-kunning ikki sonini yoddan aytadi va yozadi | — |
| 13 | Natijalar | podium | shaxsiy natija / jonli reyting | — |
| 14 | Takrorlash | kartochkalar | 10 kartochka | — |
| 15 | Yakun | xulosa | arena, 4 xulosa, nishonlar, uyga vazifa, keyingi dars | — |

---

## 0 · Kirish — kecha kelgan odam  `[664]`
- Eyebrow: Kirish · botingiz
- Sarlavha: **Kecha kelgan odam bugun ham keldimi?**
- Mentor: Botingizga bir necha kundan beri odamlar yozyapti. Shu savolga har kun uchun javob bera olasizmi?
- Tanlov (ikki tugma):
  - Ayta olaman — har kuni sanab boraman
  - Ayta olmayman — sonlarni yozib bormaganman
- Tanlagandan keyin:
  - «Ayta olaman» → Zo'r — bugun sonlaringizni jadvalga yozib, tekshirib ko'rasiz.
  - «Ayta olmayman» → Bitta kunni o'tgan darsda topgansiz — bugun kun sayin topishni o'rganasiz.
  - Ikkalasidan keyin (bitta qator): Buning uchun har kunning ikki sonini yozib boramiz: nechta odam keldi va ulardan nechtasi qaytdi.
- Sahna (so'zsiz, faqat ustun ostida «kecha» · «bugun»): chapda kechagi 6 belgi, o'ngda bugungi 5 belgi.
- Jonli darsda: har variant yonida ovozlar soni.
- Tugma: Bittasini tanlang → Davom etish

**Ko'rinish:** kirganda — sarlavha, Mentor, ikki tugma. Tanlangach: javob matni → uning ostida sahna (jonli darsda ovozlar ham).
Animatsiya: HA — bugungi 3 belgidan kechagi ustundagi o'sha odamga ingichka chiziq chiziladi va belgi yashil bo'ladi (bir marta, ~1 s): «ikkala ro'yxatda ham bor» degan bog'lanish ko'rinadi.
Olib tashlanadi: variantlar oldidagi 🟢 🤷 · sahnadagi cheksiz takrorlanuvchi yugurish/miltillash (bezak — **KOD**).

✎ 🔴 FAKT: eski javob «uni ikki kunning ro'yxatini solishtirib topasiz» — o'quvchi buni 11-darsda qilgan (ta'rif, «Kamola, Otabek» ro'yxati, `/stat`) → endi javob 11-dars ustiga quradi: bir kun emas, kun sayin · Mentor «anchadan beri bo'ldi» → hook savoliga olib keladi · «boshqa son» (nimadan boshqa — aytilmagan edi) olindi · ikki tanlov halol, to'g'ri javob yo'q — shuning uchun «Aynan!/Qiziq fikr!» emas, bitta umumiy javob (104-qonun) · «kecha / bugun» yozuvi — **KOD**
✎ 30.09 ChatGPT #2 **Qabul**: to'g'ri javob yo'q, lekin har tanlovga o'z qisqa javobi (tanlov ma'noli bo'lsin); umumiy qism bitta qatorga qisqardi (**KOD** `HOOK_OPTS` javoblari)

## 1 · Maqsad  `[753]`
- Eyebrow: Maqsad
- Sarlavha: **Bugun botingiz uchun uch kunlik hisob yozasiz.**
- Mentor: Avval besh kunlik namunani ko'rasiz, keyin jadvaldagi «?» o'rniga o'z botingizning uch kunini yozasiz.
- Jadval: ustunlar **Kun · Keldi · Qaytdi** · qatorlar 1-kun / 2-kun / 3-kun · kataklarda «?»
- Tugmalar: Orqaga · Boshlaymiz →

**Ko'rinish:** hammasi birdan (bosiladigan qism yo'q).
Animatsiya: yo'q (0-ekranda chizish bor; kataklarning birma-bir chiqishi — bezak).
Olib tashlanadi: kataklarning ketma-ket chiqish animatsiyasi (**KOD**).

✎ «Kecha ham kelgan» → «Qaytdi» (bir son — bir nom: 4, 8, 11-ekran va yakunda «Qaytdi»; atama 11-darsda o'tilgan) · «Jadvalni kuzating» → nima qilinishini aytadi (animatsiya olingach «kuzating» ma'nosiz)
✎ 30.09 ChatGPT #3 **Qabul**: 1-ekran «uch kun», 4 va 9-ekran «besh kun» — sababi aytilmagan edi → Mentor bir gapda (A-12.4) · #33 maqsadni «ikki ro'yxatni solishtirish» qilish — Qisman: sarlavha artefaktni aytadi (PM darsi — o'quvchi o'z hisobini yozadi), solishtirish shu hisobning usuli

## 2 · Ikki son  `[782]`
- Eyebrow: Tushuncha · ikki son
- Sarlavha: **Bugun kelganlarning nechtasi kecha ham kelgan edi?**
- Mentor: Ikki kartani ochib solishtiring: ular ikki xil sonni aytadi.
- Kartalar (yopiq holatda «· · ·»; bittasi ochilsa ikkinchisi yopiladi):
  - **Bugun kelganlar** — Bugun botga yozgan yoki tugma bosgan odamlar, har biri bir marta. Ulardan kim kecha ham kelganini bu son aytmaydi.
  - **Qaytganlar** — Kecha kelgan odam bugun ham kelsa — u bugun qaytgan odam. Qaytganlar bugun kelganlar ichidan sanaladi, shuning uchun bu son ulardan oshmaydi.
- Xulosa (ikkalasi ochilgach):
  - **Har kunda ikki son bor: nechta odam keldi va ulardan nechtasi qaytdi.**
  - O'tgan darsda bitta kun uchun qaytganlarni topgansiz. Bugun bir necha kunni yonma-yon qo'yib, bu ikki son kun sayin qanday o'zgarishini ko'rasiz.
- Tugma: Yana N kartani oching → Davom etish

**Ko'rinish:** hozirgidek — 2 karta, bosilgani ochiladi; xulosa 2/2 dan keyin.
Animatsiya: yo'q.
Olib tashlanadi: xulosaning «Kecha kelgan odam bugun ham kelsa — u bugun qaytgan hisoblanadi» qatori (ta'rif endi 2-kartada — bir ma'no, bir blok) · 👥 ↩️ 👆.

✎ 🔴 FAKT: «Bugun esa … qaytganlarni bittalab sanaysiz» — yangilik emas: 11-darsda qaytganlar ism bo'yicha ham, kodda ham sanalgan → farq aniq aytildi (bir necha kun) · «hisoblanadi» olindi · 2-karta nomi «Kecha ham kelganlar» → «Qaytganlar» (11-darsdan tanish nom) · «Kim birinchi marta kelganini bu son aytmaydi» → «kim kecha ham kelganini» (A-bo'lim: qaytmagan ≠ birinchi marta kelgan) · «Muhokama · ikki karta» → «Tushuncha · ikki son» · «Demak har kunda» → «Har kunda» (vergulsiz «Demak» olindi)
✎ 30.09 ChatGPT #27 **Qabul**: «botni ochgan» — 11-dars ta'rifi boshqacha («yozgan yoki tugma bosgan, bir marta») → 11-darsniki · «foizini» olindi (bu dars foiz hisoblamaydi — ChatGPT #1) · «kundan kunga» → «kun sayin» (A2) · #28 2-ekranga kecha/bugun chizmasi — Rad: 0-ekran sahnasi aynan shuni chizadi

## 3 · 1-savol ✅  `[826]`
- Eyebrow: Tekshiruv · kim qaytgan
- Savol: **Seshanba kuni 5 odam keldi, ulardan 3 tasi dushanba ham kelgan edi. Kim qaytgan?**
  - A · Seshanbada kelgan besh odamning barchasi
  - B · ✔ Dushanba ham, seshanba ham kelgan uch odam
  - C · Dushanba kelmay, seshanba kelgan ikki odam
- To'g'ri: Qaytgan — kecha ham kelgan odam: uch odam ikkala kunda ham bor.
- Xato izohlari:
  - A: Besh odam seshanba kelgan, lekin ularning hammasi dushanba ham kelgan emas.
  - C: Bu ikki odam dushanba kelmagan — shuning uchun seshanba ular qaytgan emas.
  - (umumiy) Qaytgan — kecha ham, bugun ham kelgan odam.
- Tugma va holat-yozuvlari (4 ta testda bir xil): Javobni tanlang → Davom etish · to'g'ri: «To'g'ri» · xato: «Qaytadan urinib ko'ring» + izoh
- Jonli darsda: Jonli dars — bitta urinish, o'ylab bosing. · Javobingiz qabul qilindi. Hozir to'g'ri javobni bilib olasiz. · xato bo'lsa: «To'g'ri javob: B — …» + xato izohi

**Ko'rinish:** variantlar birdan (A6 istisno). Animatsiya: yo'q.

✎ «hisoblanadi» olindi · 🔴 C izohi «ular qaytgan emas, birinchi marta kelgan» — noto'g'ri xulosa: dushanba kelmagan odam avvalroq kelgan bo'lishi mumkin → «seshanba ular qaytgan emas» · savol ikki gapga bo'lindi (sonlar aniq) · ⚡ 📨 olindi (**KOD**, `questionText` ham moslanadi)

## 4 · Botingizning kunlari (markaziy)  `[848]`
- Eyebrow: Amaliyot · besh kun
- Sarlavha: **Kunlarni oching va ikki qatorni birga kuzating.**
- Mentor (faqat boshida): Har ustun — botingizning bitta kuni, ostida esa o'sha kunning ikki soni.
- Panel sarlavhasi: **Botingizning kunlari** · rang-kaliti (CSS katakcha + yozuv): [yashil] qaytgan · [oq] qaytmagan · hisoblagich «n / 5»
- Jadval: ustunlar 1-kun … 5-kun · har ustunda odam-belgilari · qatorlar **Keldi** · **Qaytdi** (1-kunda 0)
- O'ng panel (faqat oxirgi ochilgan kun):
  1. **1-kun**: 9 odam keldi. Hisobda bundan oldingi kun yo'q — shuning uchun 1-kunning qaytgani 0.
  2. **2-kun**: 7 odam keldi — ulardan 4 tasi qaytdi.
  3. **3-kun**: 6 odam keldi — ulardan 4 tasi qaytdi.
  4. **4-kun**: 23 odam keldi — ulardan 4 tasi qaytdi.
  5. **5-kun**: 8 odam keldi — ulardan 5 tasi qaytdi.
- Sahnadagi tugma: ▶ Keyingi kun (3 marta) → Kanalga e'lon berish → (4- va 5-kun o'zi ochiladi)
  - E'lon tugmasi ostida: E'lon 4-kuni kanalga chiqadi.
  - E'londan keyin: Kunlar ketma-ket ochilmoqda.
  - E'lon bosqichida 42 soniya harakatsiz tursa: Kanalga e'lon berish tugmasini bosing.
- Yakun (5 kun ochilgach):
  - **Bu misolda e'lon kuni kelganlar 6 dan 23 ga oshdi, qaytganlar esa 4, 4, 4, 5 bo'lib qoldi.**
  - Ko'p odam kelgani — ko'p odam qaytgani degani emas: ikki qatorni birga o'qing.
- Pastdagi tugma: Yana N kunni oching → E'lon tugmasini bosing → Yana N kunni oching → Davom etish

**Ko'rinish:** hozirgidek — kunlar bittadan; e'lon tugmasi 3-kundan keyin; o'ng panelda faqat oxirgi kun; 5 kun ochilgach panel o'rnini bitta xulosa-ramkaga beradi.
Animatsiya: HA — kun ochilganda uning yashil belgilaridan chapdagi ustunga ingichka chiziq chiziladi (~0.8 s, bir marta): qaytgan odam kecha ham bor edi. 1-kunda chiziq yo'q. Belgilarning «sakrab» chiqishi (`kln-pop`) — oddiy paydo bo'lishga (**KOD**).
Olib tashlanadi: 🤖 🟩 ⬜ 👥 ↩️ 📣 💡 · tugmadagi ① ② ③ · e'lon ostidagi «ikki qatorni birga kuzating» (sarlavha bilan bir gap).

✎ 🔴 FAKT: «⬜ birinchi marta kelgan odam» → «kecha kelmagan»: masalan, 5-kuni kelgan 8 odamdan 3 tasi kecha kelmagan, lekin 2- yoki 3-kuni kelgan bo'lishi mumkin (9-ekrandagi Shohrux 3-kuni aynan shunday) · 🔴 1-kun «—» → 0 (8, 10, 14-ekran va viktorina 3-savol «0» deydi; «—» bilan viktorinadagi «hisoblab bo'lmaydi» varianti qisman to'g'ri bo'lib qolardi — **KOD** `KUNLAR[0].qaytgan`) · «Bundan oldingi kun yo'q» → «Hisobda…» (0-ekranda bot bir necha kundan beri ishlaydi) · xulosa kuzatuv sifatida o'tgan zamonda (A-12.3)
✎ 30.09 ChatGPT #10, #31 **Qabul**: «E'lon kelganlar sonini ko'tardi» — bitta namunadan umumiy qoida chiqib qolardi → «Bu misolda…» + umumiy xulosa faqat «ko'p kelgani — ko'p qaytgani emas» (A-12.3); yakun 3 gapdan 2 gapga · #5: panel «kecha ham kelgan edi» → «qaytdi», kalit «qaytgan / qaytmagan» (bir tushuncha — bir so'z, ta'rif 2-ekranda) · #6, #26 yashil ikki ma'no — 29.09 da hal qilingan (A-12.1: yashil faqat qaytish); ChatGPT'ning teskari taklifi (yashil = kelgan, ↩ = qaytish) — Rad: bizniki ham bir ma'no, ↩ emoji-belgi (A4)

## 5 · 2-savol ✅  `[975]`
- Eyebrow: Tekshiruv · ikki son
- Savol: **E'lon kuni 23 odam keldi, ertasiga ulardan 5 tasi qaytdi. Bu nimani ko'rsatadi?**
  - A · ✔ Ko'p odam kelgani ko'p qaytishini bildirmaydi
  - B · E'lon qaytganlar sonini ham shuncha ko'taradi
  - C · Kelganlar soni ertasiga ham 23 ta bo'ladi
- To'g'ri: 23 odam keldi, lekin ertasiga faqat 5 tasi qaytdi — ikki son birga o'qiladi.
- Xato izohlari:
  - B: Kelganlar 17 taga oshdi, qaytganlar esa bittaga.
  - C: Jadvalga qarang: 5-kuni 8 odam keldi — e'lon har kuni takrorlanmaydi.
  - (umumiy) Ko'p odam kelgani — ko'p odam qaytgani degani emas.

**Ko'rinish:** variantlar birdan. Animatsiya: yo'q.

✎ «odatda» qo'shildi (A3 — har e'londa shunday deb bo'lmaydi) · A va B bir shaklga («Ulardan …») · «buni kunlar ustunida» → «kunlar jadvalida»
✎ 30.09 ChatGPT #11 **Qabul**: savol bashorat edi («40 odam keldi — ertasiga nima bo'ladi?»), javobi esa bitta namunadan chiqarilgan umumiy qoida («odatda ozchiligi») → endi 4-ekrandagi sonlarni o'qish (5-kun: qaytdi 5); xato variantlar — ikki haqiqiy adashish (qaytganlar ham shuncha oshadi · kelganlar shunday qoladi); ✔ o'rni A o'sha · qisqa takrorlash 2 savoli ham shu

## 6 · Duolingo (haqiqiy misol)  `[1044]` (bosqichlar `[1016]`)
- Eyebrow: Haqiqiy misol · Duolingo
- Sarlavha: **Duolingo'dagi bitta raqam**
- Mentor: bu ekranda yo'q
- Bosqich yorlig'i: «Duolingo · N / 5» (bashoratda: «Avval o'zingiz tanlang · N / 5»)
  1. **Duolingo — til o'rgatadigan ilova.** Ekran tepasida olov belgisi va uning yonida raqam turadi. Bu raqam darslaringiz sonini emas, boshqa narsani sanaydi.
  2. Bashorat: **Olov belgili raqam nimani sanaydi?**
     - Jami yodlagan so'zlaringiz sonini
     - ✔ Ketma-ket dars qilgan kunlaringizni
     - Ilovada o'tkazgan umumiy vaqtingizni
     - Topsa: Aynan! U ketma-ket dars qilgan kunlaringizni sanaydi. · Topmasa: Qiziq fikr! Aslida u ketma-ket dars qilgan kunlaringizni sanaydi.
  3. **Raqam kunlarni sanaydi**: chizma, ikki qator (yetti kun ketma-ket — 7 · 4-kun tashlangan — 0) · Matn: Kecha ham, bugun ham dars qilgan bo'lsangiz, raqam bittaga o'sadi. Bir kunni tashlab ketsangiz, u noldan boshlanadi — o'sha kunga «muzlatish» qo'yilmagan bo'lsa. Ilovada bu raqam «streak» deb ataladi.
  4. Bashorat: **Raqam uzilib qolmasligi uchun ilova nima qiladi?**
     - Yangi darslar ro'yxatini ochadi
     - ✔ Kunlik eslatma xabarini yuboradi
     - Reklamani butunlay o'chirib qo'yadi
     - Topsa: Aynan! Ilova eslatma xabarini yuboradi. · Topmasa: Qiziq fikr! Aslida ilova eslatma xabarini yuboradi.
  5. Ko'prik: Bu raqam har kuni bitta narsani tekshiradi: kecha dars qilgan odam bugun ham qildimi. Sizning botingizda ham shu savol: kecha kelgan odam bugun ham keldimi?
- Tugmalar: Avval o'zingiz tanlang (bashorat berilguncha) · Keyingi bosqich (N/5) → Davom etish · yopiq nuqta ustida: «Avval shu bosqichni tugating»

**Ko'rinish:** hozirgidek — bosqichlar bittadan; bashorat variantlari birdan (A6 istisno); javob yozuvi tanlangach.
Animatsiya: HA — 3-bosqich chizmasi: yuqori qatorda kunlar birma-bir to'ladi, raqam 1 dan 7 gacha o'sadi; pastki qatorda 3 kun to'ladi, 4-kun qizil ramka bo'ladi va raqam 3 dan 0 ga tushadi (~1.2 s). To'lgan kun — 9-ekrandagi «kelgan kun» rangida (yashil emas, A-12.1) (**KOD**).
Olib tashlanadi: 🦉 🔮 🔥 🔔 📅 🔤 ⏱ 📚 🎁 🎲 🎯 ⚡ (chizmadagi «🔥 7 / 🔥 0» — CSS/SVG olov belgisi + raqam, **KOD**) · chizma ostidagi «bitta kun tashlandi — raqam noldan boshlanadi» (bosqich matni bilan bir ma'no) · 30.09: 5-bosqich «Eslatma va muzlatish» (eslatma — 4-bosqich javobida, muzlatish — 3-bosqichda bir qism) · 6-bosqich «Nega aynan kun» (ko'prik bilan birlashdi) · ko'prikdagi «Duolingo javobni olov belgili raqam bilan ko'rsatadi, siz esa…» (bosqich 3 bilan bir ma'no).

✎ «Bizning olamdan mashhur voqea» → «Duolingo'dagi bitta raqam» (kalka; javobni ochmaydi) · «⚡ Haqiqiy voqea» → «Haqiqiy misol» (bu voqea emas, ilovaning ishlashi) · «🔥 raqam» → «olov belgili raqam», haqiqiy nomi «streak» bir marta — javob ochilgandan keyin · 🔴 test halolligi: 2-bashoratdagi «Bepul sovg'a va ball beradi» qisman to'g'ri (Duolingo ketma-ket kunlar uchun mukofot ham beradi) → «Reklamani butunlay o'chirib qo'yadi» · «Topdingiz! / Adashdingiz — asl javob» → «Aynan! / Qiziq fikr!» (A8) · «birinchi ko'zga tashlanadigan narsa» olindi (qat'iy da'vo) · «har kuni eslatma» → «odatda har kuni» · 6- va 7-bosqich bir gapni («kecha kelgan odam bugun ham keldimi») takrorlardi — 6-bosqich Duolingo tilida qoldi · «yuboradi, va» → vergulsiz
✎ 30.09 ChatGPT #12, #14, #32 **Qabul**: 7 → 5 bosqich (8-dars Airbnb kabi; 2 bashorat qoladi — PM 33-qonun); «Bir kunni tashlasangiz — noldan» muzlatish bilan zid edi → shartli gap, muzlatish faqat shu bir qismda · «ilova har kuni eslatma yuboradi» → 4-bosqich javobida bir marta, «odatda har kuni» takrori olindi · #13 «Bizning olamdan mashhur voqea» — 29.09 da olingan

## 7 · 3-savol ✅  `[1120]`
- Eyebrow: Tekshiruv · raqam qachon o'sadi
- Savol: **Duolingo'dagi olov belgili raqam o'sishi uchun odam nima qilishi kerak?**
  - A · Bir kunda bir nechta dars qilishi
  - B · Bir haftada bir marta dars qilishi
  - C · ✔ Kun tashlamay dars qilishi
- To'g'ri: Bu raqam kunlarni sanaydi: kecha dars qilgan odam bugun ham qilsagina u o'sadi.
- Xato izohlari:
  - A: Raqam darslarni sanamaydi — bir kunda o'nta dars qilsangiz ham, u bitta kun bo'lib sanaladi.
  - B: Haftada bir marta dars qilsangiz, oradagi kunlar bo'sh qoladi va raqam noldan boshlanadi.
  - (umumiy) Raqam ketma-ket kunlarni sanaydi.

**Ko'rinish:** variantlar birdan. Animatsiya: yo'q.

✎ 🔥 → «olov belgili raqam» · «Kunini tashlamay» → «Kun tashlamay»
✎ 30.09 ChatGPT #15 — Rad: muzlatish raqamni saqlaydi, lekin o'stirmaydi; «o'sishi uchun» savoliga javob muzlatish bilan ham to'g'ri

## 8 · Uch kun (amaliyot)  `[1154]`
- Eyebrow: Mustaqil ish · uch kun
- Sarlavha: **Botingizning uch kunini yozing.**
- Tasma (8-dars yozuvlari saqlangan bo'lsa): 8-darsda eshitgan javoblaringiz: … · … · …
- Mentor (1-kunning birinchi soni yozilguncha):
  - 8-dars yozuvlari bo'lsa: 8-darsda odam nima deganini eshitgansiz — endi sonlarga qaraymiz. Namunadagidek, o'z botingizning uch kunini yozing; aniq son bo'lmasa, taxminiy son yozing.
  - bo'lmasa: Namunadagidek, o'z botingizning uch kunini yozing; aniq son bo'lmasa, taxminiy son yozing.
- Qadam-doiralar: 1-kun · 2-kun · 3-kun (yozilgani ✓)
- 1-katak: «Nechta odam keldi?»
- 1-kunning birinchi soni yozilgach: Hisobda 1-kundan oldingi kun yo'q — shuning uchun 1-kunning qaytgani 0.
- 2-katak: «Ulardan nechtasi qaytdi?»
- Xato yozuvlari:
  - Bu katakka faqat son yoziladi, masalan: 7.
  - Qaytganlar o'sha kuni kelganlardan ko'p bo'lolmaydi — ular shu kelganlar ichidan sanaladi.
- Tugma: Saqlash → (tahrirda: ✓ Yangilash) · yonida: Nechta odam kelganini yozing / Ulardan nechtasi qaytganini yozing / Qaytganlar kelganlardan oshmasin
- Saqlagach (4 soniya turadi): ✓ N-kun yozildi: X odam keldi, Y tasi qaytdi.
- Yordam: Kechagi ro'yxatni oching va bugungisi bilan solishtiring: **ikkalasida ham bor odamlar** — qaytganlar.
- Uch kun yozilgach — jadval: **Uch kunlik hisobingiz** · «N-kun · Keldi X · Qaytdi Y» + Tahrirlash
- Qo'shimcha (hisob to'lgach ochiladi): Uch kunning qaytgan sonlarini solishtiring: qaysi kuni eng ko'p odam qaytdi? O'sha kuni botingizda nima boshqacha bo'lgan bo'lishi mumkin — o'ylab ko'ring.
- Pastdagi tugma: 1-kunning ikki sonini yozing → Yana N kun yozing → Davom etish

**Ko'rinish (KOD — hozir ikki katak birdan):**
1. Kirganda: sarlavha, (tasma), Mentor, qadam-doiralar, 1-katak, Yordam.
2. 1-katak to'lgach → 2-katak chiqadi (1-kunda uning ustida «Hisobda 1-kundan oldingi kun yo'q…» izohi; Mentor pufagi o'rnini shunga beradi).
3. Saqlangach → kun ✓ bilan doiraga yig'iladi, kataklar bo'shab keyingi kun ochiladi.
4. Uch kun yozilgach → doiralar va kataklar o'rnini jadvalga beradi; Qo'shimcha shundan keyin chiqadi.

Animatsiya: yo'q.
Olib tashlanadi: Topshiriq kartasi («Uch kun — har kunda ikki son» + 3 band: saqlash tugmasi har bandni o'zi tekshiradi, uch kun yozilgach hammasi baribir ✓ bo'ladi; qadam-doiralar bilan bir ma'no) · «Uch kunlik hisobingiz yozildi — har kunda ikki son turibdi» (jadval sarlavhasi va Yakun sarlavhasi bilan bir ma'no) · 🎙 🤔 ✅ 💡 ⭐ 🗓 👥 ↩️ · ✎ belgisi → «Tahrirlash» · ① ②.

✎ 🔴 «Bu katakka son yoziladi: nechta odam kelgan bo'lsa, shuni yozing» 2-katakda ham chiqardi — u yerda noto'g'ri → umumiy gap · Mentor «Uch odamning gapini eshitgansiz — endi nechtasi qaytganini son aytadi» — ikki gap bog'lanmasdi · «taxminiy son» qo'shildi: bot har kuni kim kelganini saqlamaydi (4-darsdagi `users` jadvalida faqat `created_at`), aniq son ko'pchilikda bo'lmaydi (B-2) · «1-kundan oldingi kun yo'q» → «Hisobda…» · Qo'shimcha «bir qatorda yozing» — yozish joyi yo'q → «o'ylab ko'ring»
✎ 30.09 ChatGPT #4 **Qabul** 🔴 FAKT: «8-darsda uch odamning gapini eshitgansiz» — 8-darsda bitta odam uchta savolga javob beradi (8-dars v2, 8-ekran «yonidagi odamga») → «odam nima deganini»; tasma «Eshitganingiz» → «eshitgan javoblaringiz» (8-dars atamasi; **KOD** 🎙 ham olinadi) · #16: «Namunadagidek» — 4-ekrandagi besh kun bilan bog'landi (A-12.4) · #5: 2-katak «kecha ham kelgan» → «qaytdi» · #17: «nima boshqacha bo'lgan bo'lishi mumkin» — sabab emas, taxmin

## 9 · Besh kunlik ro'yxat (tekshiruv)  `[1331]` (qatorlar `[1312]`)
- Eyebrow: Tekshiruv · besh kun
- Sarlavha: **Har qatorda qaytish kunlarini belgilang.**
- Mentor (boshida): To'lgan katak — odam o'sha kuni kelgan. Chap yonidagi katak ham to'lgan bo'lsa, shu katakni bosing: bu — qaytish kuni.
- Panel: **Besh kunlik ro'yxat** · kalit (CSS katakcha + yozuv): [to'lgan] odam kelgan kun · [binafsha ramka] siz belgilagan kun (birinchi belgidan keyin) · [yashil] qaytish kuni (tekshiruvdan keyin) · «n / 4»
- Jadval: 1-kun … 5-kun:

| Odam | Kelgan kunlari | ✔ Qaytish kunlari | Tekshiruvdan keyingi izoh |
|---|---|---|---|
| Aziz | 1, 2, 5 | 2 | 2-kun: chap yonida 1-kun ham to'lgan — Aziz kecha ham kelgan edi. |
| Dilnoza | 2, 3, 4 | 3, 4 | 3- va 4-kun: Dilnoza uch kun ketma-ket kelgan, shuning uchun ikki qaytish kuni bor. |
| Shohrux | 1, 3, 5 | yo'q | Shohrux bir kun oralab kelgan — kelgan kunlarining birortasida ham chap yon to'lmagan. |
| Malika | 3, 4, 5 | 4, 5 | 4- va 5-kun: Malika 3-kundan boshlab uzilmay kelgan. |

- Tugmalar: Tekshirish · Bu odam qaytmagan · yonida: Qaytish kunlarini bosing yoki «Bu odam qaytmagan»ni tanlang / Endi tekshiring
- Nishon qoidasi: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · (adashgach) Nishon birinchi urinish uchun edi.
- Javob (qator izohi bilan birga):
  - to'g'ri: ✓ To'g'ri.
  - «qaytmagan» bosilgan, lekin qaytish kuni bor: Bu odam qaytgan: ikki to'lgan katak yonma-yon turgan joy bor.
  - ortiqcha kun belgilangan: Bu kunning chap yoni bo'sh — bu odam kecha kelmagan edi.
  - kam belgilangan: Yana qaytish kuni bor — chap yoni ham to'lgan katakni qidiring.
- Tugma: Keyingisi →
- Yordam (birinchi xatodan keyin chiqadi): Har katakka bitta savol bering: **chap yonidagi kun** ham to'lganmi?
- Yakun: ✓ To'rt odamdan uchtasi kamida bir marta qaytdi — jami 5 ta qaytish kuni.
- Pastdagi tugma: Yana N qatorni belgilang → Davom etish

**Ko'rinish (KOD — hozir 4 qator birdan ko'rinadi):**
1. Kirganda: kun sarlavhalari va faqat 1-qator (Aziz), Mentor, Tekshirish tugmalari.
2. Tekshirilgach → izoh chiqadi, to'g'ri qaytish kunlari yashil bo'ladi; «Keyingisi →» dan keyin qator jadvalda qoladi, keyingi qator qo'shiladi.
3. Yordam — faqat birinchi xatodan keyin. To'rt qator tugagach — bitta natija-ramka.

Animatsiya: HA — tekshiruvdan keyin har to'g'ri qaytish kunida chap katakdan shu katakka qisqa strelka chiziladi (~0.6 s): mezon «chap yonidagi kun» ko'rinadi.
Olib tashlanadi: yakundagi natija-tasma («Aziz 2-kun · Dilnoza 3-kun · 4-kun …» — jadvaldagi yashil kataklar bilan bir ma'no) · katak ichidagi 🟩 va ↩️ (rang va strelka shu ishni qiladi) · 🗓 👤 🤔 ✅ 💡 🏅 ↩︎ ▸ · ① ②.

✎ 🔴 bir rang — bir ma'no (DAVOM 7): oldin yashil = «odam kelgan kun», 0 va 4-ekranda esa yashil = «kecha ham kelgan» → 4-ekrandan keyin o'quvchi har yashil katakni «qaytgan» deb o'qirdi. Endi kelgan kun — oq katak (4-ekrandagi oddiy belgi kabi), yashil — faqat qaytish kuni; matnda «yashil» → «to'lgan» (qisqa takrorlash 4 allaqachon «to'lgan» deydi) (**KOD** `.mrk-cell.yashil`) · Shohrux izohi «hech qaysi kunning chap yoni yashil emas» aniq emas edi — 2- va 4-kunning chap yoni to'lgan, faqat u o'sha kunlari kelmagan
✎ 30.09 ChatGPT #8 **Qabul**: «uchtasi qaytdi: jami 5 ta qaytish kuni» — odam va kun aralash o'qilardi → «kamida bir marta» · yakundagi qoida gapi olindi (Mentor boshida, 15-ekranda va kartochkada bor) · #7 bu ekranning chizmasi — saqlandi

## 10 · Koding  `[1531]` (topshiriq `[1516]`)
- Eyebrow: Koding · kod oynasi
- Sarlavha: **Qaytganlarni sanaydigan kod yozamiz.**
- **1-bosqich (darvoza-savol):**
  - Mentor: O'tgan darsda qaytganlarni bitta kun uchun yozuvdan qo'lda sanadingiz. Endi ularni kod har kun uchun alohida sanaydi. Avval bitta kunni o'zingiz tekshiring.
  - Savol: Kecha kelganlar: Aziz · Dilnoza · Shohrux · Malika. Bugun kelganlar: Dilnoza · Shohrux · Nodira. Bugun nechta odam qaytdi?
    - 3 — bugungi ro'yxatdagi hamma odam
    - ✔ 2 — kecha ham ro'yxatda bo'lgan odamlar
    - 1 — kecha ro'yxatda bo'lmagan odam
  - Xato bosilsa: Bu boshqa narsani sanaydi. Kecha ham, bugun ham ro'yxatda bor odamlarni sanang.
- **2-bosqich:**
  - Mentor: Qatorlarda qo'lda qilgan ishingiz kodda bitta savolga aylanadi: bu odam kechagi ro'yxatda ham bormi?
  - Yig'ilgan qator: ✓ Qaytgan — kecha ham, bugun ham ro'yxatda bor odam
  - Kod nima qilsin: 1. Uch kun uchun uchta obyekt qaytadi · 2. Har obyektda `kun`, `kelgan`, `qaytgan` bor · 3. Har kunning qaytgani to'g'ri (1-kunda 0)
  - Yordam: Bugungilarni birma-bir oling va `kechagilar.includes(...)` bilan tekshiring — `includes` ni o'tgan darsdagi `stat` funksiyasida ishlatgansiz. · Qo'shimcha: uch kunning qaytgan sonlarini qo'shib, jami nechta qaytish bo'lganini ham chiqaring.
  - O'ng karta: **Uch kun — bitta funksiya** · Kod oynasi: chapda kod yozasiz, o'ngda natija chiqadi. · Tugma: Kod oynasini ochish (bajarilgach: ↻ Kod oynasini qayta ochish · Bajarildi — xohlasangiz kodni yana sayqallang)
  - Yakka rejimda: ✓ Bu kodni sinfda yozganman →
  - Bajarilgach: ✓ Uchta obyekt chiqdi — endi qaytganlarni kod sanaydi.
- **Kod oynasi:**
  - Eyebrow: Koding · qaytganlarni sanash · Sarlavha: **app.js — `hisob` funksiyasini yozing**
  - Topshiriq: `hisob` funksiyasi har kun uchun obyekt qaytaradi, lekin `qaytgan` hozir doim 0. Bugungilardan nechtasi kechagilar ichida borligini sanang (`includes`). Pastdagi `console.log` natijani ko'rsatadi.
  - Fayl: app.js · bo'sh fayldagi izoh: `// bugungilardan nechtasi kechagilar ichida bor?`
  - Boshlang'ich kod:
    ```js
    // kunlar — botingizning uch kuni: har kuni kim kelgani
    const kunlar = [
      { kun: 1, kelganlar: ["aziz", "dilnoza", "shohrux", "malika"] },
      { kun: 2, kelganlar: ["dilnoza", "shohrux", "nodira"] },
      { kun: 3, kelganlar: ["shohrux", "nodira", "jasur", "aziz"] },
    ];

    function hisob(kunlar) {
      const natija = [];
      for (let i = 0; i < kunlar.length; i++) {
        const bugungilar = kunlar[i].kelganlar;
        // 1-kundan oldin ro'yxat yo'q: kechagilar bo'sh qoladi
        let kechagilar = [];
        if (i > 0) kechagilar = kunlar[i - 1].kelganlar;

        // Bugungilardan nechtasi kechagilar ichida bor?
        let qaytgan = 0;

        natija.push({ kun: kunlar[i].kun, kelgan: bugungilar.length, qaytgan: qaytgan });
      }
      return natija;
    }

    console.log(hisob(kunlar));
    // [{ kun: 1, kelgan: 4, qaytgan: 0 },
    //  { kun: 2, kelgan: 3, qaytgan: 2 },
    //  { kun: 3, kelgan: 4, qaytgan: 2 }]
    ```
  - Shartlar va o'tmasa chiqadigan xabar:
    - Uch kun uchun uchta obyekt qaytadi: «Uch kunga uchta obyekt kerak — bo'sh ro'yxat o'tmaydi»
    - Har obyektda kun, kelgan, qaytgan bor: «Har obyektda kun raqami, o'sha kuni kelganlar soni va qaytganlar soni bo'lsin»
    - Har kunning qaytgani to'g'ri (1-kunda 0): «1-kundan oldin ro'yxat yo'q — uning qaytgani 0; qolgan kunlar kechagi ro'yxat bilan solishtiriladi»
- Pastdagi tugma: Qaytganlar sonini tanlang → Kodni yozing → Davom etish

**Ko'rinish:** hozirgidek — ikki bosqich navbat bilan (darvoza-savol → ✓ qatorga yig'iladi → kod qismi). Kod oynasi tugma bosilganda butun ekranda.
Animatsiya: yo'q.
Olib tashlanadi: 🛠 🔎 🤔 🧮 💡 ⭐ ✅ · ① ② · Yordamdagi «shunda butun uch kunlik natijani bitta son aytib beradi» (dars aksini o'rgatadi: bitta son yetmaydi).

✎ 🔴 3-shart: yorliq «Birinchi kunning qaytgani 0», lekin tekshiruv uchala kunni (0, 2, 2) solishtiradi — hamma kunga 0 yozgan o'quvchi «1-kun 0-ku» deb adashadi → yorliq aniq (**KOD** `KOD_TASK.requirements`) · 🔴 FAKT: «Siz qo'lda sanagan ishni endi kod bajaradi» — 11-darsda `/stat` qaytganlarni kod bilan sanagan → farq aytildi: har kun uchun alohida · kod bo'lagi → funksiya, yozuv → obyekt (A-bo'lim) · Kompilyator → kod oynasi (lug'at) · kod izohida «royxatda», «yoq» → «ro'yxatda», «yo'q» («yoq» boshqa so'z bo'lib o'qilardi; JS izohida apostrof xavfsiz) · darvoza-savolda kechagi ro'yxat to'liq berildi — o'quvchi o'zi solishtiradi (oldin javob savolning ichida edi: «Kecha ro'yxatda Dilnoza va Shohrux bor edi») · `includes` ishorasi qo'shildi (11-darsdagi `/stat` kodida ham shu)
✎ 30.09 ChatGPT #19 **Qabul**: bo'sh funksiya bir vaqtda tashqi sikl, oldingi kun, sanash va obyekt yig'ishni talab qilardi → sikl, `bugungilar` / `kechagilar` (11-dars `stat` nomlari) va `push` tayyor; o'quvchi faqat qaytganlarni sanaydi — darsning asosiy ko'nikmasi. Uchala shart o'zgarmaydi: 1 va 2 boshidanoq o'tadi, 3-si — o'quvchining ishi (**KOD** `KOD_STARTER`, `KOD_TASK.brief`) · #18 «kompilyator» — 29.09 da «kod oynasi» · 1-kun izohi endi kodda, Yordamdan olindi (bir ma'no — bir joy)
✎ 01.10 **23-savol A** (F-1001-83): 11-darsdagi /stat endi qaytganlarni sanamaydi (bugun kelganlar + bosh raqam) → Mentor «o'tgan darsda `/stat` … qaytganlarni sanadi» → «qaytganlarni … qo'lda sanadingiz»; «o'tgan darsdagi `stat` kabi» → `includes` havolasi (11-dars `stat` da `includes` bor — «bir odam bir marta»). Qaytganlarni kodda sanash endi faqat shu darsda — takror yo'qoldi.

## 11 · 4-savol ✅ (yakuniy)  `[1810]`
- Eyebrow: Yakuniy tekshiruv
- Savol: **Chorshanba kuni 15 odam keldi, ulardan 4 tasi seshanba ham kelgan edi. Hisobga nimani yozasiz?**
  - A · Chorshanba: keldi 15, qaytdi 11
  - B · ✔ Chorshanba: keldi 15, qaytdi 4
  - C · Chorshanba: keldi 19, qaytdi 4
- To'g'ri: «Qaytdi» katagiga faqat kecha ham kelganlar yoziladi: to'rt odam.
- Xato izohlari:
  - A: 11 — seshanba kelmaganlar; qaytganlar — seshanba ham kelgan 4 odam.
  - C: 4 odam shu 15 ning ichida — ularni qayta qo'shmaysiz.
  - (umumiy) «Keldi» katagiga o'sha kuni kelganlar, «Qaytdi» katagiga kecha ham kelganlar yoziladi.

**Ko'rinish:** variantlar birdan. Animatsiya: yo'q.

✎ «Nimani yozasiz?» → «Hisobga nimani yozasiz?» · «o'rni almashib ketdi» → «o'rin almashgan»
✎ 30.09 ChatGPT #21 **Qabul**: A (15/15) va C (4/15) oson edi → ikki haqiqiy adashish: 15 − 4 = 11 (qaytmaganlarni sanash) · 15 + 4 = 19 (qaytganlarni ustiga qo'shish, viktorina 4 dagi adashish); ✔ o'rni B o'sha

## 12 · Mustahkamlash  `[1705]`
- Eyebrow: Mustahkamlash · 2 qadam
- Sarlavha: **Ikki sonni yoddan ayta olasizmi?**
- Mentor: Ekranga qaramay javob bering: o'z hisobingizda 2-kuni botingizga nechta odam keldi va ulardan nechtasi qaytdi? Avval ovoz chiqarib o'zingizga ayting, keyin bir qatorda yozing. (jonli darsda: «… Avval sherigingizga ayting …»)
- 1-qadam: Ovoz chiqarib ayting (jonli: Sherigingizga ayting)
  - Yakka: ▶ 30 soniyani boshlash → taymer → ✓ Vaqt tugadi. · ↻ Yana 30 soniya · To'xtatish
  - Jonli: Har biringizga 30 soniyadan — avval A, keyin B. · ▶ 1 daqiqani boshlash · Hozir A gapiradi / keyin — B navbati / oxirgi navbat · ✓ Vaqt tugadi — ikkalangiz ham aytdingiz. · ↻ Yana 1 daqiqa · To'xtatish
- 2-qadam: Endi bir qatorda yozing · katak: «2-kun: Keldi … · Qaytdi …» (hisob jadvalidagi shakl)
- Yozgach: ✓ Endi botingizga kelgan odamlarni sanabgina qolmaysiz — ulardan nechtasi qaytganini ham bilasiz.
- Tugma: Davom etish

**Ko'rinish (KOD — hozir ikki qadam birdan):** kirganda — 1-qadam; taymer tugagach yoki to'xtatilgach 1-qadam «✓ Aytdingiz» qatoriga yig'iladi va 2-qadam chiqadi; yozgach bitta natija qatori.
Animatsiya: yo'q (taymer halqasi — vaqt ko'rsatkichi).
Olib tashlanadi: «Bugungi qoida: qaytish ikki kunning yonma-yon turishidan ko'rinadi» (9-ekran yakuni va dars yakunida bor — uchinchi takror) · 🗣 ✍️ 🎯 ⏹ · «Barakalla!» (taymer tugashi — yutuq emas).

✎ 🔴 «2-kuni botingizga» — qaysi 2-kun? 4-ekrandagi namuna (7 va 4) ham, 8-ekrandagi o'z hisobi ham «botingiz» deb berilgan → «o'z hisobingizda» (MentorNote «kunlar ekranini qayta oching» ham 8-ekranga moslanadi — **KOD**)
✎ 30.09 ChatGPT #22 **Qabul**: katak shakli hisob jadvalidagidek (Keldi · Qaytdi)

## 13 · Natijalar (podium)  `[2400]` — o'zgarmaydi
(Tizim-UI: podium belgilari va nishon medallari qoladi; «🏅 Nishonlar» yorlig'idagi belgi olinadi. «sessiya» so'zi — B-4.)

## 14 · Takrorlash (kartochkalar)  `[1797]` (kartalar `[1785]`)
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) |
|---|---|
| Qaytgan odam kim? | Kecha ham, bugun ham kelgan odam |
| Bir kunda qaysi ikki son yoziladi? | Nechta odam keldi va ulardan nechtasi qaytdi |
| Qaytganlar soni kelganlardan ko'p bo'ladimi? | Yo'q — ular shu kelganlar ichidan sanaladi |
| Qaytish nimadan ko'rinadi? | Ikki kunning yonma-yon turishidan; bitta kundan ko'rinmaydi |
| Hisobning 1-kunida qaytganlar nechta? | 0 — hisobda undan oldingi kun yo'q |
| Ko'p odam kelishi ko'p odam qaytishini bildiradimi? | Yo'q — buni «Qaytdi» soni ko'rsatadi |
| Duolingo'dagi olov belgili raqam nimani sanaydi? | Ketma-ket dars qilingan kunlarni |
| Bir kun dars qilinmasa, bu raqam nima bo'ladi? | Noldan boshlanadi (o'sha kunga muzlatish qo'yilmagan bo'lsa) |
| Uch kunlik hisobda nima yoziladi? | Har kun uchun: kun, kelganlar soni, qaytganlar soni |
| 2-kunning qaytganlari qanday topiladi? | 2-kuni kelganlardan 1-kungi ro'yxatda ham borlari sanaladi |

(Bu darsda kartochkalarda izoh qatori yo'q.)
- Tugmalar: ↻ O'rganilmoqda · N · ✓ Bildim · N · ✗ Takrorlash · ✓ Bildim · Hammasini bilasiz! · 10/10 karta yodlandi · ↻ Qaytadan takrorlash · Davom etish

Olib tashlanadi: 🎉 (yakun belgisi, **KOD**).

✎ 1-kartochka: «hisoblanadi» olindi · 2-kartochka: «kecha ham kelgan edi» → «qaytdi» (bu yerda atama allaqachon o'tilgan) · 5-kartochka: «hisobda» (A-bo'lim) · 6-kartochka: yumshatildi (A-12.3) · 7–8: 🔥 → «olov belgili raqam» · 10-kartochka: tartib aniqlandi (qaysi ro'yxatdan qaysi ro'yxatga qaraladi)
✎ 30.09: 6-kartochka — umumiy qoida («e'lon … odatda kam o'zgaradi») o'rniga A-12.3 xulosasi · 8-kartochka 6-ekran 3-bosqichi bilan bir gap · ChatGPT #32 «8–10 kartochka» — 10 ta, o'zgarmaydi

## 15 · Yakun  `[2497]`
- Eyebrow: Dars yakuni · belgi: ✓ Dars tugadi
- Sarlavha: **Uch kunlik hisobingiz yozildi.** + to'g'ri javoblar halqasi
- Arena tugmasi (jonli o'quvchida: Mentorni kuting)
- Endi siz bilasiz:
  - Kecha kelgan odam bugun ham kelsa — u bugun qaytgan odam.
  - Har kunda ikki son bor: nechta odam keldi va ulardan nechtasi qaytdi.
  - Ko'p odam kelgani — ko'p odam qaytgani degani emas: ikki sonni birga o'qing.
  - Qaytish ikki kunning yonma-yon turishidan ko'rinadi — bitta kundan emas.
- Nishonlaringiz — N/4 (nom + tavsif; olinmagani qulf belgisi bilan)
- Uyga vazifa · Amaliy topshiriqni bajarish → (ichida ochiladigan topshiriq-karta — PM uy vazifasi, MD'ga kirmaydi)
- Keyingi dars — **Zaxira dars**: ulgurmagan ishni tugatasiz va botingizni sayqallaysiz. Undan keyin — **Demo Day**: botingizni jonli ko'rsatasiz va uning raqamlarini aytasiz. Uch kunlik hisobingizni saqlang — o'sha kuni kerak bo'ladi.
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

**Ko'rinish:** hozirgidek; «Keyingi dars» qatori uyga vazifa tugmasidan keyin (**KOD** — hozir bu qator yo'q).
Animatsiya: yo'q.
Olib tashlanadi: 🏅 ⏳ (matn oldidagi) · uyga vazifa tugmasi fonidagi ✅ 🟩 (**KOD** `HW_TOKENS`).

✎ 🔴 FAKT: «Keyingi dars» qatori yo'q edi → qo'shildi (App.jsx: m5-12 Zaxira dars «yetib olish / sayqallash», m5-13 Demo Day «jonli bot + 20 foydalanuvchi + metrika») · «hisoblanadi» olindi · e'lon xulosasi yumshatildi
✎ 30.09 ChatGPT #31 **Qabul**: 3-band — umumiy qoida o'rniga A-12.3 xulosasi · #30 keyingi dars — 29.09 da qo'shilgan

---

## Qo'shimcha matnlar

**Nishonlar (4)** — nomi inglizcha qoladi, «!» olinadi (1-dars nomlari bilan bir shakl); medal belgisi — o'yin qatlami:
- **Day by Day** (hozir Day Two!) — Kunlarni ochib, ikki sonni yonma-yon kuzatdingiz (4-ekran)
- **Count Keeper** — Uch kunlik hisobingizni yozdingiz (8-ekran)
- **Two In A Row** — To'rt qatorda qaytish kunlarini birinchi urinishda to'g'ri topdingiz (9-ekran)
- **Code Counter** — Qaytganlarni kod bilan sanadingiz (10-ekran)
- Nishon yozuvlari: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Yangi nishon · bosib davom eting

✎ «Day Two!» → «Day by Day» (ekran bir necha kunni ochadi, «ikkinchi kun» haqida emas) · Two In A Row tavsifiga «birinchi urinishda» qo'shildi — nishon faqat birinchi urinishga beriladi, tavsif shuni rost aytsin

**Qisqa takrorlash oynalari (4)** — sarlavha «Qayta tushuntirish»; karta belgisi (`ic`) o'rniga raqam 1 · 2 · 3; oxirgi kartada «Sinfga savol:»; tugmalar ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz:
1. (3) **Qaytgan — kecha ham kelgan odam:** Qaytgan kim — Kecha kelgan odam bugun ham kelsa — u bugun qaytgan odam. · Kelganlar soni nimani aytmaydi — Bugun kelganlar soni bugun botni ochgan hamma odamni sanaydi: ulardan kim kecha ham kelganini bu son aytmaydi. · Ikki kunni yonma-yon qo'ying — Kechagi ro'yxatni bugungisi bilan solishtiring: ikkalasida ham bor odamlar — qaytganlar. · Sinfga savol: Seshanba kuni 5 odam keldi, ulardan 3 tasi dushanba ham kelgan edi. Kim qaytgan?
2. (5) **Ikki son bir yo'nalishda yurmaydi:** Har kunda ikki son — **nechta odam keldi** va **ulardan nechtasi qaytdi**. · Misolda — e'lon kuni kelganlar 6 dan 23 ga oshdi, qaytganlar deyarli o'zgarmadi. · Ikkovini birga o'qing — Yuqori qatorga qarab xulosa chiqarmang: pastki qator boshqa narsani aytadi. · Sinfga savol: E'lon kuni 23 odam keldi, ertasiga ulardan 5 tasi qaytdi. Bu nimani ko'rsatadi?
3. (7) **Raqam kunlarni sanaydi:** Duolingo'dagi olov belgili raqam — **ketma-ket dars qilingan kunlarni** sanaydi, darslarni ham, so'zlarni ham emas. · Bir kun tashlansa — raqam noldan boshlanadi (o'sha kunga muzlatish qo'yilmagan bo'lsa). · Nega aynan kun — Bu raqam soatlarni ham, haftalarni ham sanamaydi — faqat kunlarni. · Sinfga savol: Duolingo'dagi olov belgili raqam o'sishi uchun odam nima qilishi kerak?
4. (11) **Qaytish ikki kundan ko'rinadi:** Qaytish kuni qanday kun — **Chap yonidagi kun ham to'lgan** kun: odam kecha ham kelgan edi. · Qancha bo'lishi mumkin — Qaytganlar soni o'sha kuni kelganlardan oshmaydi — ular shu kelganlar ichidan sanaladi. · Hisob-qatori — Har kun uchun bitta qator yoziladi: kun, kelganlar soni, qaytganlar soni. · Sinfga savol: Chorshanba kuni 15 odam keldi, ulardan 4 tasi seshanba ham kelgan edi. Hisobga nimani yozasiz?

✎ «hisoblanadi» olindi · «kim birinchi marta kelganini» → «kim kecha ham kelganini» · «qanaqa» → «qanday» · 📖 🗣️ ↩️ 👥 🔎 🔢 📣 🗓 🔥 0️⃣ 📅 🟩 ⚖️ ✍️ olindi · Sinfga savol matnlari testlarning yangi matni bilan bir xil
✎ 30.09: 2-oyna — namunadagi sonlar (A-12.3), savol 5-ekranning yangi matni · 3-oyna — «Duolingo — chet tili o'rgatadigan ilova» olindi (6-ekranda aytilgan; «chet tili» / «til» — ikki shakl edi), muzlatish 6-ekrandagi shartli gap bilan · ChatGPT #29 mustaqil rejimda ham oyna ochilsin — Qabul (**KOD** 13a)

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Qaytgan odam kim? ✔ Kecha ham, bugun ham kelgan odam · Bugun birinchi marta kelgan odam · Kecha kelib, bugun kelmagan odam · Bugun ikki marta kelgan odam
2. Bir kunda qaysi ikki son yoziladi? Kelganlar va e'lonlar soni · Qaytganlar va yozilgan so'zlar soni · Kunlar va soatlar soni · ✔ Kelganlar va qaytganlar soni
3. Hisobning 1-kunida qaytganlar nechta? Shu kuni kelganlar soniga teng · Oldingi kundan ko'chirib olinadi · ✔ 0, chunki hisobda oldingi kun yo'q · Ertasi kuni kelganlar soniga teng
4. Nega qaytganlar soni o'sha kuni kelganlardan oshmaydi? Chunki bot kuniga bir marta sanaydi · ✔ Chunki qaytganlar shu kelganlar ichidan · Chunki kechagi ro'yxat o'chib ketadi · Chunki e'lon faqat kelganlarni ko'taradi
5. Misoldagi e'lon qaysi sonni ko'tardi? Faqat qaytganlar sonini · ✔ O'sha kuni kelganlar sonini · Ikkala sonni bir xil ko'tardi · Hech qaysi sonni ko'tarmadi
6. Bugun 10 odam keldi, 3 tasi kecha ham kelgan edi. Qaytganlar nechta? ✔ 3 — ikkala kunda ham kelganlar · 10 — bugun kelganlarning hammasi · 7 — kecha kelmaganlar · 13 — ikki sonning yig'indisi
7. Qaytganlarni bilish uchun nega bugun kelganlar soni yetmaydi? Chunki bir kunda kelgan odam kam bo'ladi · Chunki e'lon ikki kunda bir marta beriladi · ✔ Chunki bu son kechagi kunni ko'rsatmaydi · Chunki bu son faqat kechqurun sanaladi
8. Qaytish nimadan ko'rinadi? Bitta kunning yakka katagiga qarashdan · Ikki kunda kelganlar sonining o'sishidan · Botga yozilgan xabarlar sonidan · ✔ Kecha va bugungi ro'yxatni solishtirishdan
9. Duolingo'dagi olov belgili raqam nimani sanaydi? ✔ Ketma-ket dars qilingan kunlarni · Yodlangan so'zlarning umumiy sonini · Ilovada o'tkazilgan soatlarni · Do'stlar bilan bo'lishilgan ballarni
10. «Muzlatish» bo'lmasa, bir kun dars qilinmagach bu raqam nima bo'ladi? O'sha joyida turaveradi · Bir kunga orqaga suriladi · ✔ Yana noldan boshlanadi · Sekinroq o'sishda davom etadi
11. Odam 1, 3 va 5-kunlari kelgan. Nechta qaytish kuni bor? Uchta — uch kunda ham kelgani uchun · ✔ Birortasi ham yo'q — oldingi kun har safar bo'sh · Ikkita — 3-kun va 5-kun qaytish kuni · Bittasi — 5-kunning oldingi kuni to'lgan
12. Darsda o'z botingizning uch kunlik hisobini kim yozdi? Bot o'zi sanab yozib bordi · Mentor siz uchun yozib berdi · Telegram o'zi hisoblab berdi · ✔ O'zingiz sonlarni kiritib yozdingiz

✎ 1: «Kanalga e'lon bergan odam» ishonarsiz edi → «Bugun ikki marta kelgan odam» (tanish xato: bir kunda ikki marta = qaytgan?) ·
🔴 3: tire faqat to'g'rida edi («0 — …») → «0, chunki …»; «Hisoblab bo'lmaydi, kun tashlanadi» 4-ekrandagi «—» bilan qisman to'g'ri edi → «Ertasi kuni kelganlar soniga teng» ·
🔴 4: «Yo'q — bot ularni ikki marta sanamaydi» javobi («Yo'q») to'g'ri, faqat sababi boshqa — qisman to'g'ri → «Ha — e'lon berilgan kuni oshib ketadi» ·
🔴 5: «Ertasiga qaytganlar sonini» 4-ekran sonlari bilan qisman to'g'ri (e'londan keyin 4 → 5) → «Faqat qaytganlar sonini» ·
7: savol aniqlandi («bitta kunlik son» — qaysi son?); «Chunki bot ikki kunlik yozuvni saqlamaydi» aslida ko'p botlarda rost (B-2) → «faqat kechqurun sanaladi» ·
9–10: 🔥 → «olov belgili raqam»; 🔴 10: «O'sha joyida turaveradi» «muzlatish» bilan to'g'ri bo'lib qolardi (kartochka 8 shuni o'rgatadi) → savolga «Muzlatish bo'lmasa» qo'shildi ·
11: «Bittasi ham yo'q» → «Birortasi ham yo'q» ·
🔴 12: «Kodni yozgan dasturchi» ham to'g'ri edi (10-ekranda kodni o'quvchining o'zi yozgan), «Bot uni o'zi sanab yozib boradi» — 10-ekrandagi «kod endi o'zi sanaydi» bilan to'qnashardi → savol bugungi ishga bog'landi, variantlar: bot / Mentor / Telegram / siz
✎ 30.09 ChatGPT #24 **Qabul**: 4-savolda yagona «Yo'q —» to'g'ri javob edi (qolgan uchtasi «Ha —» — shakl javobni ochardi) → «Nega … oshmaydi?», to'rttasi «Chunki …» · 5-savol — «Misoldagi e'lon» (A-12.3) · #23 **Qabul**: 12-savol «hisobni kim yozdi?» 10-ekrandagi kod bilan ikki ma'noli edi → «o'z botingizning uch kunlik hisobini» (8-ekran); ✔ o'rinlari o'zgarmadi

---

## KOD ro'yxati (razrabotkada bajariladi — MD tasdiqlangach)
1. s0 — `HOOK_OPTS.ic` olinadi; sahna animatsiyasi bir marta (3 chiziq → yashil), `h0-run`/`h0-hit` cheksiz takrori olinadi; ustunlar ostiga «kecha» · «bugun».
2. s1 — ustun «Kecha ham kelgan» → «Qaytdi»; `s1cell` ketma-ket chiqishi olinadi; MentorNote («jadval yozilib bo'lgunicha») moslanadi.
3. s2 — `S2_CARDS.ic` olinadi, 2-karta nomi «Qaytganlar»; xulosaning 1-qatori olinadi; tugmadagi 👆.
4. s3/s5/s7/s11 — `QuestionScreen`: ⚡ 📨 olinadi; `questionText` yangi savolga moslanadi.
5. s4 — `KUNLAR[0].qaytgan` null → 0; rang-kaliti emojisiz (CSS katakcha), «birinchi marta kelgan» → «kecha kelmagan»; `YORLIQ_KELDI/QAYTDI` emojisiz; 🤖 📣 💡 va ①②③ olinadi; yashil belgidan chap ustunga chiziq (`kln-pop` o'rniga).
6. s6 — `K5_SLIDES` va chips `ic`, 🎲 🎯 🦉 ⚡ olinadi; hit/miss «Aynan!/Qiziq fikr!»; 2-bashorat 3-varianti; `StreakMock`: 🔥 → CSS/SVG olov belgisi, to'lgan kun rangi = 9-ekrandagi kelgan kun, `st-note` olinadi, kunlar to'lishi + raqam sanog'i animatsiyasi.
7. s8 — 2-katak 1-katak to'lgach chiqadi; umumiy xato yozuvi; «Topshiriq» kartasi (`wsp-task`) va `done-mini` olinadi; ✎ → «Tahrirlash»; emoji, ①②.
8. s9 — `.mrk-cell.yashil` → neytral «to'lgan» uslub, yashil faqat `.kalit`; katak ichidagi 🟩/↩️ olinadi; qatorlar navbat bilan qo'shiladi; `mrk-strip` olinadi; tekshiruvdan keyin chap katakdan strelka; `XATO_*`, `HAFTA.sabab` matnlari; ↩︎ ▸ va `AchRule` dagi 🏅 olinadi.
9. s10 — `KOD_TASK` (title, brief, requirement yorliqlari va xabarlari), `KOD_STARTER` izohlari, `GATE_ITEMS` savoli; «Kompilyator» → «Kod oynasi» (karta, tugmalar); emoji, ①②.
10. s12 — 2-qadam 1-qadamdan keyin ochiladi; `rcp-win-s` olinadi; ⏹ 🗣 ✍️ va «Barakalla!» olinadi; MentorNote 8-ekranga moslanadi.
11. s14 — `fc-done-emoji` 🎉 olinadi.
12. s15 — «Keyingi dars — …» qatori qo'shiladi; `RECAP` matni; 🏅 olinadi; `HW_TOKENS` dan ✅ 🟩 olinadi.
12a. `HwCard` (12-savol B) — faqat emoji: 📝 🗂 👆 olinadi (Botjon/daftar kodda yo'q — tekshirildi); topshiriq matniga tegilmaydi.
12b. 30.09 (ChatGPT auditi F-0930-109): s0 — har tanlovga o'z javobi + bitta umumiy qator · s4 — panel va kalit matni («qaytdi», «qaytgan / qaytmagan»), yakun 2 qator · s5 — `questionText`, variantlar va izohlar (✔ indeksi 0) · s6 — `K5_SLIDES` 7 → 5 · s8 — tasma «8-darsda eshitgan javoblaringiz» (🎙 olinadi), Mentor ikki holati, 2-katak yorlig'i · s9 — yakun matni · s10 — `KOD_STARTER` (sikl tayyor), `KOD_TASK.brief`, Yordam · s11 — A/C variantlar va izohlar · s12 — katak namunasi · `FLASHCARDS` 6, 8 · `QUIZ_BANK` 4, 5, 12 (✔ indekslari 1, 1, 3 o'zgarmaydi) · `RECAPS` 2, 3.
13a. RECAPS mustaqil rejimda ham: test ekranida birinchi xatodan keyin «Qisqa takrorlash — mavzuni yana bir ko'rish» havolasi (bot darslaridagidek; hozir oyna faqat `MentorTestStats` dan ochiladi).
13. Butun dars — `RECAPS` `ic` → raqam, 📖 🗣️ olinadi; `QZ_BG_SHAPES` dan ✅ 🟩 🗓; `StudentPracticePulse` 👥 ✏️; `ACHIEVEMENTS.name`; `FLASHCARDS`, `QUIZ_BANK` matnlari (✔ o'rni o'zgarmaydi); fayl boshidagi «ATAMA-INTIZOMI: qaytgan faqat s2 da tug'iladi» izohi yangilanadi; `npm run lint:emoji`.

---

## B. Bu darsdan tashqariga chiqadigan ishlar (hozir tegilmaydi)
1. **11- va 12-dars takrori (DAVOM 6):** «qaytgan» ta'rifi (11-dars s6), ikki ro'yxatni solishtirish («Kamola, Otabek», `[1406]`) va qaytganlarni sanaydigan kod (`stat`, `/stat`, s12) 11-darsda bor. Bu MD farqni matnda aytadi (bir necha kun, e'lon, qaytish kunlari); chuqurroq qayta taqsimlash — 11-dars v2 bilan birga, foydalanuvchi qarori. → 30.09 (ChatGPT #1, #3): 12-dars tomoni qilindi — foiz o'rgatilmaydi, «bitta kun → kun sayin», 10-ekran kodi 11-dars `stat` naqshini ko'p kunga yoyadi (sikl tayyor). 11-dars `stat` kodi ham qaytganlarni sanaydi (`kechagilar.includes`) — takrorning qolgan qismi 11-dars auditida (13-savol). → 01.10 23-savol A: 11-dars /stat bugun kelganlar + bosh raqam; qaytganlar kodi faqat shu darsda.
2. **Kunlik tashriflar botda saqlanmaydi:** 4-darsdagi `users` jadvalida faqat `created_at`; 11-darsdagi `kelishlar` qo'lda yozilgan. 8-ekrandagi o'z sonlari va uy vazifasi real ma'lumotga tayanmaydi. Taklif: Zaxira darsda (m5-12) har xabarni `kelishlar` jadvaliga yozish — Demo Day «metrika» qismi uchun ham kerak.
3. **App.jsx m5-11 `sub`** «kelganlar va qaytganlar — ikki xil son» — 11-dars ham shuni aytadi. Taklif: «kun sayin hisob: e'lon kelganlarni ko'taradi, qaytganlarni emas» (App.jsx — chegaradan tashqarida).
4. **«sessiya»** (podium) — 1-dars B-5 bilan bir sinf (KATTA_TOZALASH nomzodi).
5. **«kompilyator → kod oynasi»** — KATTA_TOZALASH F-0929-19 (47 fayl); bu darsda MD bo'yicha.
6. **RU matni** — o'zbekcha tasdiqlangach (bu darsda RU matn bor — butun dars qayta tarjima qilinadi).
7. **Qonun nomzodi:** «Dars ichida bir rang — bir ma'no: rang-kaliti bir ekranda nimani bildirsa, boshqa ekranda ham shuni» → `QONUN_NOMZODLARI.md`.

---

## Agent eslatmalari
1. **DAVOM 7 «hisoblanadi» — tekshirdim, to'g'ri:** o'quvchi ko'radigan 6 joy (s2 xulosa `[812]`, s3 savol `[829]`, qisqa takrorlash 1 karta va savoli `[276]`/`[278]`, 1-kartochka `[1786]`, yakun `[2504]`) + yashirin `questionText` `[830]` — hammasi almashtirildi.
2. **DAVOM 7 yashil — tekshirdim, to'g'ri:** CSS'da `.h0dots i.hit`, `.kln-mark.qay` = yashil (kecha ham kelgan); `.mrk-cell.yashil` = kelgan kun; Duolingo chizmasida `.st-day.on` = dars qilingan kun. Yechim — A-12.1 (yashil faqat qaytish). Matn «to'lgan katak» deydi — qisqa takrorlash 4 buni allaqachon shunday aytgan.
3. **DAVOM 6 (11/12 takror) — tekshirdim:** «O'tgan darsda … foizda» havolasi to'g'ri, lekin «Bugun esa bittalab sanaysiz» noto'g'ri. Savol: takrorni faqat matnda farqlash yetadimi (bu MD), yoki 11-darsdan ro'yxat/kod qismini olib tashlaysizmi? Mening ovim: 12-dars qolsin (e'lon, Duolingo, qaytish kunlari — yangi), 11-dars v2 da `/stat` qoladi. → 30.09: 12-dars tomoni qilindi (B-1); 11-dars tomoni — 11-dars auditida.
4. **1-ekran ustuni «Qaytdi»:** kodning «qaytgan faqat s2 da tug'iladi» qoidasi 11-dars 12-darsdan oldinga ko'chgach (F-0928-06) eskirgan — shuning uchun 0/1-ekranda «qaytdi» ishlatildi. Rozi bo'lmasangiz, 1-ekranda «Kecha ham kelgan» qoladi. → 30.09: qoladi (e'tiroz yo'q; ChatGPT #5 ham «Keldi / Qaytdi» taklif qilgan).
5. **🔴 «birinchi marta kelgan»** (4-ekran kaliti, 3-ekran C izohi) — mantiqiy xato: qaytmagan odam avvalroq kelgan bo'lishi mumkin; dars o'zi 9-ekranda (Shohrux 3-kuni) buni ko'rsatadi.
6. **Keyingi dars qatori:** Zaxira darsning o'z komponenti yo'q, shuning uchun uni Demo Day bilan birga aytdim — o'quvchi uchun aniq maqsad bor (botni ko'rsatish + raqamlar), uch kunlik hisob shunga ko'prik bo'ladi. «20 foydalanuvchi» qo'shilmadi — Demo Day tayyor bo'lmagan va 2-darsdagi 20 kishi hammada yig'ilmagan bo'lishi mumkin.
7. **Uy vazifasi:** `PmLesson21.homework.jsx` yo'q — uy vazifasi dars faylining o'zida (`HwCard` `[1846]`, 📝 🗂 👆, «Muddat: keyingi darsgacha»). Topshiriq bo'yicha MD'ga kiritilmadi. Savol: bu karta ham «PM uy vazifasi — tegilmaydi» qoidasiga kiradimi? → 30.09: 12-savol B — faqat emoji (KOD 12a).
8. **Test halolligi:** jonli viktorinada 5 ta qisman to'g'ri variant (3, 4, 5, 10, 12) va 2-bashoratda bitta tuzatildi; ✔ o'rinlari kod bilan solishtirildi (`INLINE_KEYS` = `correctIdx`, `QUIZ_BANK.correct` 3/3/3/3) — tartib o'zgarmadi.
