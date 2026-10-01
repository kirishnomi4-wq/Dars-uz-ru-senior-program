# 5-Modul (LMS: 7-Modul) · 9-dars «Fikr va iteratsiya» — YANGI MATN (v2)

Fayl: `src/5-Modull/BotFeedbackIterationLesson.jsx` · 20 ekran · faqat o'zbekcha (ruschasi o'zbekcha tasdiqlangach)
Eski matn: `09-BotFeedbackIteration-sozlar.md`. Har ekran ostida **Ko'rinish** (nima qachon chiqadi, animatsiya bormi) va `✎` (nima o'zgardi).
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi. **KOD** — kod o'zgarishi kerak bo'lgan joy.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti: `s4:1 · s8:2 · s10:0 · s14:3 · s15` tartib; jonli viktorina ✔: `1·3·0·2·1·3·0·2·1·0·3·2`) — faqat matn.
Kirish: umumiy qoidalar F-0929-53…56, 1-dars v2 A-bo'limi (A2 — sinonim yo'q, A8 — to'g'ri javob izohi bitta gap, U1–U3) · 29.09 v2-qoralama · **30.09: ChatGPT matn auditi (F-0930-103) filtrlandi** — hukmlar `JURNAL.md` · 13-savol (tuzilma takliflari): 13-ekran — prompt yig'ish (taklif qo'llandi, ⏳ 21-savol), 3-ekran va «ikki ip» — qoldi (sabab `JURNAL.md`) · 4-savol A (ballsiz tanlov aralash).

---

## A. Qoidalar

Modul qoidalari — `01-BotIntro-v2.md` A1–A9 amal qiladi. Shu darsga xos qo'shimchalar:

**A1 (shu dars uchun qo'shimcha qatorlar).**

| Eski (olib tashlanadi) | Yangi asosiy nom | Birinchi chiqqanda (bir marta) |
|---|---|---|
| aylana · yaxshilash aylanasi · AYLANA | **iteratsiya** (bitta o'tish — «bitta iteratsiya», undan keyingisi — «keyingi iteratsiya») | 0-ekranda: «Shu takror **iteratsiya** deyiladi» (fikrni tinglash → eng muhimini tuzatish → yana tinglash). 1-ekranda 5-darsga ko'prik |
| tilaklar daftari · mehmonlar kitobi · daftar | **fikrlar ro'yxati** | — (F-0929-51) |
| restoran egasi · direktor | siz · bot egasi | — (o'quvchi — botning egasi, rol o'ynamaydi) |
| Maslahatchi (AI) — kodni tuzatadigan | **AI yordamchi** | 13-ekranda: «sinfda — gemini.google.com» |
| maslahatchi (AI) — bot ichida javob yozadigan | **botdagi AI** | 7-ekranda: 6-darsga havola |
| yo'riqnoma | **system prompt** | 6-darsda o'tilgan (6-dars v2 nomiga moslanadi, B-3) |
| signal (fikr ma'nosida) · texnik signal | **fikr** | — (A1: «signal» moduldan olingan) |
| buzuq (bug) | **bug** | oldingi modullardan tanish — qavs kerak emas |
| triaj | turlarga ajratish | — |
| pattern | ko'p takrorlangan shikoyat | — (6-Modulda «pattern» boshqa ma'noda — arxitektura) |
| scope shishishi | hamma taklifni qo'shish | — |
| fix | tuzatish | — |
| qimmatli fikr · foydasiz fikr | **aniq fikr** · **noaniq fikr** (6-ekrandagi juftlik bilan bitta nom; noaniq — tashlanmaydi, aniqlashtiriladi) | 7-ekran savatlari · 30.09 (ChatGPT #6, A2) |
| tiqilib qolish · drop-off | **ketib qolish** | 2-ekranda qavsda bir marta: «(drop-off)» |
| hisob-kitob (voronka) | **voronka** | 7-ekranda: «har qadamda nechta mijoz qolganini ko'rsatadi» |
| chastota × ta'sir | **chastota va ta'sir** | 5-ekranda: chastota — nechta odam aytgani; ta'sir — muammo qanchalik qiynagani |
| pizza | pitsa (AvtoPizza nomi qoladi) | — |

**A2 (shu dars).** Bu darsda «sikl» so'zi ishlatilmaydi: 1-darsdagi «botning ish sikli» (kutadi → hodisa → handler → javob) bilan aralashmasin. Takrorlanadigan yaxshilash — faqat «iteratsiya».

**A3 (shu dars).** «Mahsulot hech qachon tayyor bo'lmaydi», «yaxshilash hech qachon tugamaydi», «har mahsulotda», «har joyda» → «mahsulot bir versiya bilan tugamaydi», «odatda». «Darhol» → «tez».

**A4 (shu dars).** Saralash savatlari, chat nomi, tugmalar: 🟢 ⚪ 📔 📊 🎯 🗣 🍕 😤 ✅ ❌ 🔁 📝 🚀 🏅 olinadi. Savat rangi — CSS (yashil / kulrang), belgi emas.

**A5 (shu dars).** Fakt bir xil bo'lsin: Margarita — **35 000 so'm** (6- va 7-darsdagi menyu narxi). Versiyalar: v1 (manzilni qayta so'raydi) → v2 (manzil bir marta) → v3 (narx ham ko'rinadi).

---

## Darsning ipi
- **Olam (bitta):** AvtoPizza boti bir haftadan beri ishlayapti, mijozlar fikr yoza boshladi.
- **Hook:** to'rt fikr keladi (manzilni 2 marta so'radi · narx ko'rinmaydi · glutensiz pitsa · tez va qulay) → «Birinchi nima qilasiz?» → iteratsiya ta'rifi.
- **Asosiy model (dars bo'yi bitta):** iteratsiya — tingla → guruhla → tanla → tuzat → qayta tingla. Har iteratsiyadan keyin yangi versiya: v1 → v2 → v3.
- **Oldingi darslarga ko'prik:** 5-dars (botni o'zingiz test qilib, tuzatib, yana test qilgansiz) · 6-dars (botdagi AI narxni o'ylab topishi mumkin) · 8-dars (odamdan bo'lib o'tgan ishini so'rash, bo'sh savol).
- **Tajribalar:** fikr manbalari (2) · savol shakli (3) · guruhlash (5) · noaniq → aniq (6) · saralash, voronka va ustuvorlik (7) · to'liq iteratsiya v1 → v2 (9) · qayta o'lchash (12) · prompt → v3 (13) · iteratsiya tartibi (15) · o'z fikrlar ro'yxati (16).
- **Keyingi dars (App.jsx m5-10):** «AI-agent yaratish».

## Reja (oqim)

| # | Ekran | Turi | O'quvchi nima qiladi | Ball |
|---|---|---|---|---|
| 0 | Kirish — fikr kela boshladi | hook | 4 fikrni ochadi, birinchi qadamni tanlaydi | — |
| 1 | Reja | qoida | dars oxiridagi bot + bugungi 4 qadam | — |
| 2 | Fikr manbalari | tushuncha | 4 manbani bosib o'qiydi | — |
| 3 | Savol berish | tushuncha | bo'sh savol va aniq savolni sinaydi | — |
| 4 | 1-savol | test | «manzilni 2 marta so'radi» — qanday fikr | ✅ |
| 5 | Chastota | tushuncha | shikoyatlarni guruhlaydi, ustunlar o'sadi | — |
| 6 | Noaniq → aniq | tushuncha | 3 noaniq fikrning aniq o'zgarishini ochadi | — |
| 7 | Bir haftalik fikrlar | markaziy o'yin | saralash → voronka → birinchi tuzatish → oqibat → yangi fikr | — (nishonlar) |
| 8 | 2-savol | test | 18 kishilik bug yoki 3 kishilik taklif | ✅ |
| 9 | Bitta to'liq iteratsiya | hayotiy | iteratsiyaning 5 qadamini birma-bir ochadi (v1 → v2) | — |
| 10 | 3-savol | test | 100 kishidan bittasining tor so'rovi | ✅ |
| 11 | 3 tuzoq | tushuncha | 3 tuzoqni bosib o'qiydi | — |
| 12 | Qayta o'lchash | tushuncha | v1 va v2 shikoyat sonini solishtiradi | — |
| 13 | Aniq prompt yig'ing | amaliyot | «narx ko'rinmaydi» → promptni 3 qismdan yig'adi → v3 | — |
| 14 | 4-savol | test | tuzatib, versiya chiqargandan keyin nima | ✅ |
| 15 | Iteratsiyani yig'ing | yakuniy | 5 bo'lakni tartiblaydi | ✅ (final) |
| 16 | Amaliyot · fikrlar ro'yxati | praktika | o'z boti uchun 5 fikrni tahlil qiladi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 kartochka | — |
| 19 | Yakun | xulosa | 5 xulosa + uyga vazifa + keyingi dars | — |

---

## 0 · Kirish — fikr kela boshladi  `[876]`
- Eyebrow: Kirish
- Sarlavha: **AvtoPizza boti bir haftadan beri ishlayapti. Mijozlar fikr yoza boshladi.**
- Mentor: Eng yaxshi mahsulot ham birinchi versiyada mukammal bo'lmaydi. Foydalanuvchilar uni siz o'ylamagan tomondan ishlatadi. Tugmani bosib, kelgan fikrlarni ko'ring.
- Chat (AvtoPizza): mijoz «Manzilimni 2 marta so'radi» → tugma bosilgach yana: «Narxni ko'rsatmaydi, noqulay» · «Glutensiz pitsa qo'shing!» · «Tez va qulay, rahmat!»
- Tugma: ▶ Mijozlar nima dedi? → ✓ Fikrlar keldi
- Savol: **Birinchi nima qilasiz?**
  - Hech narsa: bot ishlayapti, shikoyat bo'lib turadi
  - Fikrlarni o'qib, eng ko'p takrorlanganini tuzataman
  - Botni noldan, butunlay qayta yozaman
- Javob — 2-variant: **Aynan!** Birinchi versiyadan keyin ish tugamaydi: fikrlarni tinglaysiz, eng muhimini tuzatasiz va yana tinglaysiz. Shu takror **iteratsiya** deyiladi. Bugun uni boshidan oxirigacha bosib o'tamiz.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Lekin shikoyat qilingan joy o'z-o'zidan tuzalmaydi, noldan qayta yozsangiz esa ishlab turgan qismlar ham yo'qoladi. Odatda fikrlarni tinglab, eng muhimini tuzatasiz va yana tinglaysiz. Shu takror **iteratsiya** deyiladi. Bugun uni boshidan oxirigacha bosib o'tamiz.
- Tugma: Davom etish

**Ko'rinish:** kirganda — sarlavha, Mentor, chat (faqat birinchi mijoz xabari) va tugma. Savol va variantlar hali yo'q (hozir xira bo'lib turadi).
Tugma bosilgach: uch xabar birin-ketin chiqadi → shundan keyin savol va 3 variant → tanlangach javob izohi.
Animatsiya: yo'q (xabarlarning oddiy chiqishi — chatning o'z ko'rinishi).
Olib tashlanadi: chatdagi 😤 🍕.

✎ Javob tanlovga qarab ikki xil (**KOD:** hozir uchala variantga ham «Aynan!» — «Hammasini darrov noldan qayta yozaman» ga ham) · «iteratsiya» birinchi marta izohli (hozir izohsiz, DAVOM 7) · «Mahsulot hech qachon tayyor bo'lmaydi» → «ish tugamaydi» (A3) · sarlavha va savol bir gapni aytardi («Nima qilasiz?» ikki marta) → sarlavha vaziyatni aytadi, savol — tanlovni · variantlar tenglashtirildi (to'g'risi 70 belgi, qolganlari 36–51 edi) · savol tugmadan keyin chiqadi (**KOD**) · «Botingiz jonli» → «bir haftadan beri ishlayapti» (7-ekrandagi «bir hafta» bilan bir)

## 1 · Reja  `[920]`
- Eyebrow: Reja
- Sarlavha: **Bugun: mijozlar fikridan botning yangi versiyasigacha.**
- Mentor: 5-darsda botni o'zingiz test qilib, xatosini tuzatgansiz — bu ham iteratsiya edi. 8-darsda botingizni ishlatgan odamdan so'radingiz. Bugun xatoni foydalanuvchilar aytadi, siz esa qaysi birini birinchi tuzatishni tanlaysiz.
- Yorliq: dars oxirida — ikki shikoyati tuzatilgan bot: manzil bir marta so'raladi, narx ko'rinadi
- Chat (AvtoPizza): mijoz «Margarita, Chilonzor 5» → bot «Qabul qilindi: Margarita — 35 000 so'm. Manzil: Chilonzor 5.»
- Bugungi 4 qadam:
  1. Fikrlarni turlarga ajratish: bug, taklif, maqtov
  2. Guruhlab, ustuvorlik qo'yish: chastota va ta'sir
  3. Noaniq fikrni aniq o'zgarishga aylantirish
  4. Qayta o'lchash va keyingi iteratsiya
- Tugmalar: 4 qadamni ko'rish / ↩ Natijani ko'rish (telefonda) · Boshlaymiz →

**Ko'rinish:** sarlavha + Mentor → chap tomonda yorliq va chat → o'ngda 4 qadam birma-bir chiqadi (hozirgidek). Telefonda — avval chat, tugma bilan 4 qadam.
Animatsiya: yo'q.
Olib tashlanadi: «Jihozlar paneli — bugun 📔 yangi uyacha yonadi» va 8 uyacha (qaror F-0929-63, B-1) · «Mijozlar shikoyat qilgan narsalar tuzatildi… Mahsulot yaxshilandi» kartasi (mazmuni yorliqqa o'tdi — ikki blok bir gapni aytardi).

✎ 30.09: qadam yorliqlari olindi (U1) · ChatGPT #22 (jihozlar paneli) — 29.09 da · «Siz — restoran egasisiz, 📔 fikr — mehmonlar kitobi» → atamasiz sarlavha (metafora-rol olindi, A1) · Mentor: «(oldingi darslar)» → aniq havolalar: 5-dars (test → tuzatish, 5-darsda «iteratsiya» shu ma'noda kiritilgan) va 8-dars (App.jsx m5-08 — oldingi dars) · bot xabaridagi «— manzilni qayta so'ramayman 😊» olindi (bot bunday gapirmaydi; tuzatilgani yorliqda aytiladi) · 45 000 → 35 000 so'm (A5) · «(triaj)» olindi · 4-qadam tegi «sikl» → «qayta tingla» (A2)

## 2 · Fikr manbalari  `[960]`
- Eyebrow: Tushuncha · fikr manbalari
- Sarlavha: **Fikr faqat shikoyatda emas — u 4 joydan keladi.**
- Mentor: Foydalanuvchi har doim ham «menga bu yoqmadi» deb yozmaydi. Ko'pincha fikr uning xatti-harakatida ko'rinadi: qayerda to'xtaydi, nimani qayta so'raydi. Har manbani bosing.
- Kartalar (bosilgani o'ngda ochiladi):
  - **To'g'ridan-to'g'ri xabar** — Foydalanuvchi botga shikoyat yoki taklifni o'zi yozadi.
  - **Ketib qolish (drop-off)** — Ko'p odam suhbatning bir joyida to'xtab, ketib qoladi. O'sha qadamda nimadir xalaqit beryapti — sababini tekshirasiz.
  - **Takror savollar** — Bir xil savol qayta-qayta berilsa, bot biror narsani aniq ko'rsatmayapti.
  - **Xato yozuvlari (loglar)** — Bot dasturining xato yozuvlari u qayerda buzilayotganini ko'rsatadi.
- Xulosa (4/4 dan keyin): To'g'ridan-to'g'ri xabar — eng aniq, lekin kam keladi. Xatti-harakat (ketib qolish, takror savol) — ko'p, lekin yashirin. Ikkalasini ham o'qiysiz.
- Tugma: 4 manbani ko'ring (N/4) → Davom etish

**Ko'rinish:** hozirgidek — 4 tugma; bosilgani bitta kartada ochiladi (bir vaqtda bittasi); xulosa 4/4 dan keyin.
Animatsiya: yo'q.

✎ 30.09 ChatGPT #8 **Qabul**: «demak, o'sha qadam chalkash» — sababni oldindan aytardi (tugma topilmagan, sekinlik, texnik xato bo'lishi mumkin) → «nimadir xalaqit beryapti — sababini tekshirasiz» · «eng aniq signal» / «texnik signal» → olindi (A1: «signal» moduldan olingan) · 1-kartadagi «eng aniq» xulosaga o'tdi (ikki joyda takrorlanardi) · «Tiqilib qolish» → «Ketib qolish (drop-off)» (inglizcha so'z bir marta, qavsda) · «Serverdagi» → «Bot dasturining» (bot serverda turmasligi ham mumkin) · «Yaxshi direktor ikkalasini ham o'qiydi» → «Ikkalasini ham o'qiysiz» (rol-metafora olindi)

## 3 · Savol berish  `[991]`
- Eyebrow: Tushuncha · savol berish
- Sarlavha: **Qanday so'rasangiz, shunday javob olasiz.**
- Mentor: 8-darsda odamdan bo'lib o'tgan ishini so'rashni o'rgandingiz. Bot ham buyurtmadan keyin mijozdan fikr so'rashi mumkin — savolni shu qoida bilan tuzasiz. Ikkala savolni bosib ko'ring.
- Kartalar:
  - **«Botimiz yoqdimi?»** — Bo'sh savol. Javobi odatda «ha, zo'r» bo'ladi — undan nimani tuzatish kerakligi bilinmaydi.
  - **«Oxirgi buyurtmada qayerda to'xtab qoldingiz?»** — Bo'lib o'tgan ishni so'raydi, javobda aniq joy bo'ladi: «menyu tugmasini topolmadim». Tuzatishni shu javobdan boshlasa bo'ladi.
- Tugma: Ikkala savolni sinang → Davom etish

**Ko'rinish:** hozirgidek — 2 karta; bosilgani o'ngda ochiladi.
Animatsiya: yo'q.
Olib tashlanadi: «Aniq savol — aniq javob. Botjonga fikr so'ratganda ham, o'zingiz o'qiganda ham shu qoida ishlaydi» ramkasi (sarlavhani takrorlaydi; «o'zingiz o'qiganda» — ma'nosi noaniq).

✎ 30.09 ChatGPT #10 **Rad** (13-savol bo'yicha ko'rildi): ekran 8-darsni qayta o'qitmaydi — o'sha qoidani botga qo'llaydi (bot buyurtmadan keyin o'zi fikr so'raydi), bu yangi · Botjon → bot · ekran 8-dars mavzusini qaytarardi — endi 8-darsga ko'prik: o'sha darsdagi «bo'sh savol» va «bo'lib o'tgan ishni so'rash» atamalari bilan (Agent eslatmasi 5) · «Qayerda qiynaldingiz?» → «Oxirgi buyurtmada qayerda to'xtab qoldingiz?» (8-dars qoidasiga mos savol — bo'lib o'tgan ish) · Mentordagi «savolning shakli javob sifatini belgilaydi» olindi (sarlavha shuni aytadi)

## 4 · 1-savol ✅  `[1028]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Mijoz: «Bot manzilimni 2 marta so'radi». Bu qanday fikr?**
  - Taklif: botda hali yo'q narsa so'ralgan
  - ✔ Bug: bot yozilgan manzilni eslab qolmagan
  - Maqtov: mijoz botdan mamnun ekanini aytgan
  - Shovqin: bunga e'tibor berish shart emas
- To'g'ri: Bu bug: bot kutilgan ishni bajarmayapti — manzilni eslab qolmayapti.
- Xato izohlari:
  - Taklif — botda hali yo'q narsani so'rash. Bu yerda bor narsa noto'g'ri ishlayapti, demak bu bug.
  - Mijoz mamnun emas: u bir narsani ikki marta yozishga majbur bo'ldi. Bu norozilik, maqtov emas.
  - Aksincha, bu aniq fikr: nima buzilgani aytilgan. Ko'p odam shuni yozsa, bug jiddiy.
  - (umumiy) Bu bug: bot kerakli ishni bajarmayapti.

✎ Variantlar bir xil shaklda («Tur: izoh») va tenglashtirildi — oldin qavs «(bug)» va «Botjon» faqat to'g'ri javobda edi · «direktor buni qaror qiladi» olindi · «So'radi 😤» → emojisiz · «Turini to'g'ri aniqlash — birinchi qadam» olindi (ortiqcha gap)

## 5 · Chastota  `[1047]`
- Eyebrow: Tushuncha · chastota
- Sarlavha: **Bir kishi aytsa — tasodif bo'lishi mumkin. Ko'pchilik aytsa — muammo.**
- Mentor: Har fikrga alohida ergashsangiz, adashasiz. Bir xil shikoyatlarni guruhlab, sanang: nechta odam shu narsani aytgan? Bu son **chastota** deyiladi. Tugmani bosing.
- Ustunlar (son tugma bosilgach chiqadi): Manzilni qayta so'raydi — 18 · Narx ko'rinmaydi — 12 · Javoblar juda uzun — 5 · Glutensiz pitsa yo'q — 3
- Tugma: Fikrlarni guruhlash → ✓ Guruhlandi
- Natija (bitta ramka): Eng ko'p takrorlangani — «manzilni qayta so'raydi»: 18 kishi. Son yetmaydi — muammo odamni qanchalik qiynaganini ham ko'rasiz, buni **ta'sir** deymiz: manzil bug'i buyurtmani to'xtatadi, glutensiz pitsa yo'qligi esa faqat istak. Kam aytilgan, lekin og'ir muammo ham muhim.
- Tugma: Fikrlarni guruhlang → Davom etish

**Ko'rinish:** tugma va to'rt bo'sh ustun → bosilgach ustunlar o'sadi → natija-ramka.
Animatsiya: HA — ustunlar noldan o'z soniga qarab o'sadi (~0.8 s), eng balandi rang bilan ajraladi. Son ko'pligini ko'rsatadi (mavjud `fn-fill` o'tishi).
Olib tashlanadi: ikkinchi ramka («Faqat son emas…» — natija-ramkaga qo'shildi, ekranda bitta ramka) · tugmadagi 📊.

✎ 30.09 ChatGPT #4 **Qabul**: «chastota va ta'sir» o'rgatilardi, lekin ta'sir haqida ma'lumot yo'q edi — 8-savol to'g'ri javobi «qattiq qiynayapti» deb asossiz aytardi → ta'sir shu yerda misol bilan (buyurtmani to'xtatadi / faqat istak); 8-savol shu ma'lumotga tayanadi · #7 (pattern) — 29.09 da «pattern» olingan · «pattern» → «ko'p takrorlangan shikoyat» (inglizcha so'z; 6-Modulda «pattern» boshqa ma'noda keladi) · «chastota» va «ta'sir» shu yerda izohlanadi (oldin izohsiz) · 🔴 «Bu eng ko'p og'ritgan narsa» olindi — eng ko'p aytilgan har doim eng og'riqli bo'lmaydi, ekranning o'zi keyingi gapda shuni aytadi · «Eng baland ustun yo'lni ko'rsatadi» olindi

## 6 · Noaniq → aniq  `[1082]`
- Eyebrow: Tushuncha · aniq o'zgarish
- Sarlavha: **Foydalanuvchi noaniq gapiradi — siz uni aniq vazifaga aylantirasiz.**
- Mentor: «Menyu chalkash» — bu shikoyat, vazifa emas. AI yordamchi bunday gapdan to'g'ri kod yoza olmaydi. Uni aniq o'zgarishga siz aylantirasiz — kerak bo'lsa, avval odamdan aniqlashtirib so'raysiz. Har fikrni bosing.
- Juftliklar (chapda noaniq fikr → bosilganda o'ngda «Foydalanuvchi aytdi» va «Aniq o'zgarish»):
  - «Menyu chalkash» → Har pitsa yoniga narxi va 2–3 so'zli tavsifi qo'shilsin.
  - «Bot meni tushunmaydi» → System prompt'ga: savol noaniq bo'lsa, bot aniqlashtiruvchi savol bersin.
  - «Sekin javob beradi» → Oddiy savollarga (menyu, manzil) bot AI'siz, tugma bilan tez javob bersin.
- Tugma: 3 fikrni oching (N/3) → Davom etish

**Ko'rinish:** hozirgidek — 3 qator; bosilgani o'ngda juftlik bo'lib ochiladi.
Animatsiya: yo'q.
Olib tashlanadi: «Har noaniq shikoyat ortida aniq o'zgarish bor. Uni siz topasiz — Maslahatchi (AI) esa…» ramkasi (Mentor gapini takrorlaydi) · 🗣 🎯 va bosh harfli «ANIQ O'ZGARISH».

✎ 30.09 ChatGPT #9 **Qabul**: noaniq fikrdan darrov o'zgarish chiqmasligi mumkin — «avval aniqlashtirib so'raysiz» qo'shildi (8-dars ko'nikmasi) · «Maslahatchi (AI)» → «AI yordamchi» (bu yerda kodni tuzatadigan AI; 6-darsdagi Maslahatchi — bot ichidagi AI, boshqa narsa) · «Direktor sifatida» olindi · «Yo'riqnomaga» → «System prompt'ga» (6-dars atamasi, B-3) · «Tarjima · aniqlik», «tarjima qiling» → «aniq o'zgarish», «oching» (tillararo tarjima emas) · buyruq shakli «qo'sh / ber» → «qo'shilsin / bersin» (o'quvchi hali AI'ga yozmayapti, vazifani ta'riflayapti)

## 7 · Bir haftalik fikrlar (markaziy o'yin)  `[1117]`
- Eyebrow: Markaziy · fikrlar ro'yxati
- Sarlavha: **Bir haftalik fikrlar: nimani birinchi tuzatasiz?**
- Mentor: Botingiz bir hafta ishladi, mijozlar 8 ta fikr yozdi. Avval ularni saralaysiz, keyin mijozlar qayerda ko'p ketib qolganini topasiz va nimani birinchi tuzatishni tanlaysiz.
- **1-bosqich — kirish:** Fikrlar ro'yxati — 8 ta fikr (8 yozuv o'qish uchun ko'rinadi) · Tugma: ▶ Saralashni boshlash
- **2-bosqich — saralash:** yorliq «Har fikrni savatga joylang»
  - Ko'rsatma: Kartani sudrab savatga tashlang yoki bosib tanlang — N/8 · tez tanlov tugmalari: Aniq · Noaniq
  - Savatlar: **Aniq** — muammo va joyi aytilgan · **Noaniq** — avval aniqlashtirish kerak · oxirida: ✓ Hammasi saralandi

| Fikr | To'g'ri savat (qiymati o'zgarmaydi — faqat nomi: qimmatli → aniq, foydasiz → noaniq) | Noto'g'ri savatga tashlansa chiqadigan izoh |
|---|---|---|
| Yaxshi bot | Noaniq | Umumiy maqtov: nimasi yaxshi ekani aytilmagan — «Nimasi yoqdi?» deb so'rash kerak. |
| Menyu tugmasini topolmadim, /start bosdim, hech narsa chiqmadi | Aniq | Aniq muammo (menyu tugmasi) va aniq joy (/start dan keyin) aytilgan — tuzatsa bo'ladi. |
| Buyurtma berdim, javob 5 daqiqada keldi | Aniq | Aniq muammo (sekinlik) va o'lchov (5 daqiqa) bor — tuzatsa bo'ladi. |
| Bot ahmoq | Noaniq | Nimasi yoqmagani aytilmagan — «Qayerda qiynaldingiz?» deb so'rash kerak. |
| Manzilni yozdim, lekin bot uni eslamadi, qaytadan so'radi | Aniq | Aniq bug: bot manzilni holatda saqlamagan, qayerda buzilgani aniq. |
| Narxni so'radim, boshqa narx aytdi | Aniq | Aniq bug: botdagi AI narxni o'zi o'ylab topgan (6-darsda buni ko'rgansiz). Qayerda xato ekani aniq. |
| Ajoyib, hammasi juda yoqdi | Noaniq | Aniq joy aytilmagan — nimasi yoqqanini so'rash kerak. |
| Boshqa bot menga ko'proq yoqadi *(hozir: «Bot ba'zan tushunarsiz javob beradi»)* | Noaniq | Qaysi bot, nimasi yoqqani aytilmagan — avval so'rash kerak. |

- **3-bosqich — voronka:** yorliq «Saralash tugadi. Endi raqamlarga qaraymiz: mijozlar qayerda ketib qoladi?»
  - Yorliq: **Voronka** — har qadamda nechta mijoz qolganini ko'rsatadi
  - Pog'onalar: 100 — /start bosdi · 40 — Menyuni ochdi · 35 — Buyurtma berdi
  - Savol: **Qaysi qadamda eng ko'p odam yo'qoldi?**
    - Menyuni ochdi → Buyurtma berdi · 5 kishi
    - ✔ /start bosdi → Menyuni ochdi · 60 kishi
  - Xato bosilsa: Bu yerda kam odam yo'qolgan. Ikki qadam orasidagi farqni solishtiring.
- **4-bosqich — ustuvorlik:** Topdingiz: 100 kishidan **60 tasi** /start bosib, menyuni **ochmasdan** ketgan. Menyuni ochgan 40 kishidan esa faqat 5 tasi buyurtma bermagan. Aniq fikrlar ko'p, vaqt oz. Qaysi birini birinchi tuzatasiz?
  - «Bot ahmoq» sharhiga javob yozish
  - ✔ Menyu tugmasini tuzatish
- **5-bosqich — oqibat:**
  - To'g'ri tanlansa: **Menyu tugmasi tuzatildi** — Bir haftadan keyin voronka: menyuni ochmasdan ketganlar endi 60 emas, **15 kishi**. · Tugma: Iteratsiyani yakunlash →
  - Xato tanlansa: **«Bot ahmoq» sharhiga javob yozildi** — Voronka o'zgarmadi: hali ham 60 kishi menyuni ochmasdan ketyapti. Bu sharhda aniq muammo yo'q edi. · Tugma: ↩ Qaytadan tanlash
- **6-bosqich — yangi fikr:** yorliq «AvtoPizza botiga yangi fikr keldi»
  - Chat (AvtoPizza): mijoz «Endi menyu topildi, rahmat!»
  - Ramka: Bitta iteratsiya tugadi, lekin yangi fikrlar kelaveradi. Shuning uchun ish yana tinglashdan boshlanadi.
  - Tugma: ✓ Tushunarli
- Yakun (ramka o'rnida): Butun yo'lni bosib o'tdingiz: saraladingiz, voronkadan eng katta yo'qotishni topdingiz va eng ta'sirli tuzatishni tanladingiz.
- Tugma: Oxirigacha bajaring → Davom etish

**Ko'rinish:** bosqichlar bittadan (hozirgidek, oldingi bosqich yopiladi).
Saralash (**KOD** — hozir 8 karta birdan): kartalar dasta bo'lib turadi — bitta joriy karta ochiq, yonida «3/8»; to'g'ri savatga tushgach keyingisi chiqadi; noto'g'ri savatda karta qaytadi va izoh chiqadi.
Har bosqichda bitta ramka: voronkaga o'tishdagi «Saraladingiz!» yashil ramkasi — oddiy yorliq bo'ladi (**KOD**).
Animatsiya: HA — voronka pog'onalari yuqoridan pastga birin-ketin chiziladi, kengligi soniga qarab torayadi (100 → 40 → 35, ~1 s). Qayerda ko'p odam yo'qolganini ko'rsatadi; to'g'ri javobni belgilab qo'ymaydi.
Olib tashlanadi: 📔 🟢 ⚪ 👆 📊 ✅ ❌ 🎉 ✨ 👍 · bosh harfli «AYLANA» · 6-bosqichdagi «tingla → guruhla → tanla → tuzat → yana tingla» zanjiri (15-ekran javobini oldindan aytardi; 9-ekranda qadamlar bilan o'tiladi) · chat nomi «Tilaklar daftari» (Telegram chati bunday atalmaydi).

✎ 30.09 ChatGPT #6/#18/#27 **Qabul**: «Qimmatli / Foydasiz» → «Aniq / Noaniq» — «foydasiz» fikrni tashlashga o'rgatardi; noaniq fikr ham signal, uni aniqlashtirish kerak (8-dars ko'nikmasi); 6-ekrandagi «noaniq → aniq» bilan bitta juftlik (A2). Savat qiymatlari o'zgarmadi · voronka va ustuvorlik tanlovlarida to'g'ri variant ikkinchi o'ringa (4-savol A, **KOD**) · ChatGPT #2 (voronka hisobi) — 29.09 da · #17 (o'yin uzun) — bosqichlar 29.09 da bittadan · 🔴 FAKT (DAVOM 6, tasdiqlandi): voronka 100 → 40 → 35 — 60 kishi menyuni **ochmasdan** ketgan, 5 kishi menyuni ochib, buyurtma bermagan. Matn «60 kishi menyuni ochgandan keyin ketib qolgan» [1205], «60 kishi menyudan keyin ketib qolyapti» [1221] deydi — tuzatildi; 1-fikr («Menyu tugmasini topolmadim, /start bosdim») bilan endi mos · «Yangi versiya chiqdi» → «Bir haftadan keyin voronka…» (9-ekrandagi v2 bilan versiya raqami to'qnashmasin, Agent eslatmasi 6) · «tilaklar daftari / daftarni o'qing / eng qimmatli buyumingiz» → «fikrlar ro'yxati» (F-0929-51) · 🔴 8-fikr «Bot ba'zan tushunarsiz javob beradi» 6-ekrandagi «Bot meni tushunmaydi» ga o'xshaydi — u yerda aniq vazifaga aylanadi, bu yerda «foydasiz» edi (ziddiyat) → «Boshqa bot menga ko'proq yoqadi» (savat o'zgarmaydi) · «Yaxshi bot» izohi: «umumiy maqtov» deb aniqlashtirildi — 11-ekran «maqtovni e'tiborsiz qoldirmang» bilan zid bo'lmasin (aniq maqtov ≠ umumiy maqtov) · «maslahatchi (AI)» → «botdagi AI» + 6-darsga havola · «voronka» izohlandi · «Aylanani yopish» → «Iteratsiyani yakunlash» · «Daftarni oxirigacha o'qing» → «Oxirigacha bajaring» · **KOD:** `FIX_CHOICES[].d` [872] ekranga chiqmaydi va «18+ kishi» (bu manzil shikoyati soni) deydi — olib tashlanadi

## 8 · 2-savol ✅  `[1244]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Vaqtingiz oz. 18 kishi manzil bug'idan (buyurtma to'xtab qoladi), 3 kishi glutensiz pitsa yo'qligidan yozdi. Birinchi nimani qilasiz?**
  - Glutensiz pitsani: yangi taom ko'proq mijoz olib keladi
  - Ikkalasini birga: hech bir fikr kutib qolmasin
  - ✔ Manzil bug'ini: u ko'p odamni qattiq qiynayapti
  - Hech birini: bular oddiy shikoyat, jiddiy emas
- To'g'ri: Manzil bug'i ko'p odamda (18) buyurtmani to'xtatadi — chastota ham, ta'sir ham katta.
- Xato izohlari:
  - Yangi taom qiziq, lekin uni 3 kishi so'ragan. Bug esa 18 kishini qiynayapti — u birinchi.
  - Vaqt oz bo'lsa, ikkalasi ham chala chiqadi. Avval eng kattasini qiling.
  - Aksincha: 18 kishi bir xil shikoyat qilgan — bu jiddiy fikr. Uni birinchi tuzatasiz.
  - (umumiy) Birinchi — eng ko'p odamni eng qattiq qiynayotgani: manzil bug'i.

✎ «(chastota × ta'sir eng yuqori)» qavsi va atamasi faqat to'g'ri javobda edi → olindi, izohga o'tdi · 1-variantdagi «har doim» olindi (qat'iy so'z faqat xato variantda — belgi bo'lib qolardi) · variantlar tenglashtirildi (45–52 belgi) · «Bu — har mahsulotda ishlaydigan ustuvorlik qoidasi» → yumshatildi (A3)

## 9 · Bitta to'liq iteratsiya  `[1263]`
- Eyebrow: Hayotiy · iteratsiya
- Sarlavha: **AvtoPizza: bitta to'liq iteratsiya.**
- Mentor: Hammasi birga: shikoyatdan yangi versiyagacha. Tugmani bosib, iteratsiyani boshidan oxirigacha yuring.
- Qadamlar (har bosishda bittadan ochiladi):
  1. **Tingla** — Bir haftada 38 ta shikoyat keldi.
  2. **Guruhla** — Bir xillari birlashtirildi: manzil — 18, narx — 12, uzun javob — 5, glutensiz pitsa — 3.
  3. **Tanla** — Manzil: eng ko'p odam va kuchli og'riq. Glutensiz taklif kutadi.
  4. **Tuzat** — AI yordamchiga aniq buyruq: «Manzil kelgach, uni holatga saqla va qayta so'rama». Botning ikkinchi versiyasi — v2 chiqdi.
  5. **Qayta tingla** — v2 dan keyin yana fikr yig'asiz: shikoyat kamaydimi va endi nima birinchi?
- Chat (AvtoPizza), yorliq «Mijoz ko'radigan chat»:
  - v1: mijoz «Margarita, Chilonzor 5» → bot «Manzilingizni yuboring» → mijoz «Yozgan edim: Chilonzor 5»
  - v2 (5 qadamdan keyin): mijoz «Margarita, Chilonzor 5» → bot «Qabul qilindi: Margarita. Manzil: Chilonzor 5.»
- Tugma: ▶ Tinglashni boshlash → Keyingi qadam → → ✓ Iteratsiya tugadi
- Tugma: Iteratsiyani yuriting (N/5) → Davom etish

**Ko'rinish:** qadamlar navbat bilan (hozirgidek); o'ngda v1 chati boshidan turadi, 5-qadamdan keyin v2 chatiga almashadi.
Animatsiya: yo'q (iteratsiyaning yopilishi 15-ekranda chiziladi — takrorlanmasin).
Olib tashlanadi: «v1 da bot manzilni qayta so'radi; v2 da — bir marta, narx bilan. Bitta aylana mahsulotni sezilarli yaxshiladi» ramkasi (chatning o'zi v1 → v2 ni ko'rsatadi) · 🍕 😤 ✅ 📍.

✎ 🔴 FAKT (ichki ziddiyat): v2 buyrug'ida «narxni ko'rsat» va chatda «(45 000)» bor edi, xulosa «v2 da — narx bilan» derdi; lekin shu ekranning 4-qadami, 12- va 13-ekran narxni keyingi iteratsiyada (v3) tuzatadi → v2 dan narx olindi · **KOD:** qadamlar 4 → 5 — «Guruhla» qo'shildi (15-ekran finalida 5 bo'lak, bu yerda 4 edi; 38 = 5-ekrandagi 18 + 12 + 5 + 3) · 5-qadam sonni aytmaydi — «18 → 1» 12-ekranning o'z kashfiyoti bo'lib qolsin · «holatni TAYYOR qil» → «uni holatga saqla va qayta so'rama» (4-dars atamasi, oddiyroq) · «Maslahatchiga (AI)» → «AI yordamchiga» · «v2» birinchi chiqqanda izohlandi · aylana → iteratsiya · mijoz gapidagi «-ku» — so'zlashuv; «Yozgan edim: Chilonzor 5»

## 10 · 3-savol ✅  `[1305]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **100 foydalanuvchidan bittasi faqat o'ziga kerak bo'lgan narsani so'radi. Nima qilasiz?**
  - ✔ Ko'pchilikka keraklisini qilaman, bu so'rov kutadi
  - Darrov qo'shaman: har bir so'rov bajarilishi shart
  - U foydalanuvchini bloklayman: u xalaqit beryapti
  - Hamma so'rovni navbati bilan, istisnosiz qo'shaman
- To'g'ri: Vaqtni ko'pchilikka ta'sir qiladigan ishga sarflaysiz — tor so'rov kutadi.
- Xato izohlari:
  - Har so'rovni qo'shsangiz, bot chalkashib ketadi va ko'pchilik uchun yomonlashadi.
  - Foydalanuvchini bloklash — fikrdan qochish. Xushmuomalalik bilan «hozir emas» deyish kifoya.
  - Hammasini qo'shsangiz, bot ortiqcha og'irlashadi. Qaysi birini qilishni o'zingiz tanlaysiz.
  - (umumiy) Ko'pchilikka foydali ishni birinchi qilasiz, tor so'rovga «hozir emas» deysiz.

✎ 30.09 ChatGPT #5 **Qisman**: savol taklif haqida (bitta odamning o'ziga kerak narsasi) — «kutadi» deyiladi, «foydasiz» emas; bitta odam aytgan jiddiy bug' haqidagi ehtiyot 11-ekran 1-kartasiga qo'shildi · to'g'ri javob izohi bitta gap (A8) · To'g'ri javob eng uzuni edi (104 belgi, qolganlari 49–70; DAVOM 7, tasdiqlandi) → hammasi 48–52 belgi · «hozir emas» qo'shtirnog'i faqat to'g'ri javobda edi → izohga o'tdi · «scope shishishi», «Direktor tanlaydi» → oddiy gap · «Bu — har joyda kerakli qaror» olindi (A3)

## 11 · 3 tuzoq  `[1324]`
- Eyebrow: Ehtiyot · tuzoqlar
- Sarlavha: **Fikrni qo'llashda 3 ta tuzoq bor.**
- Mentor: Fikrni tinglash yaxshi, lekin uni noto'g'ri qo'llash botni buzadi. Mana 3 ta ko'p uchraydigan xato. Har birini bosing.
- Kartalar:
  - **Bir kishi — hamma emas** — Bir kishining taklifini darrov qo'shmang. Jiddiy bug'ni esa bir kishi aytsa ham tekshiring.
  - **Hamma taklifni qo'shish** — Har taklifni qo'shsangiz, bot og'irlashadi va chalkashadi. Botning asosiy ishida qoling.
  - **Maqtovni o'tkazib yuborish** — Aniq maqtov («tez yetkazdi») nima yaxshi ishlayotganini aytadi. Tuzatayotganda o'shani buzib qo'ymang.
- Xulosa (3/3 dan keyin): Fikr yo'l ko'rsatadi, lekin buyruq emas: uni saralab, o'lchab qo'llaysiz.
- Tugma: 3 tuzoqni ko'ring (N/3) → Davom etish

**Ko'rinish:** hozirgidek — 3 tugma; bosilgani o'ngda ochiladi; xulosa 3/3 dan keyin.
Animatsiya: yo'q.

✎ «Bitta odam = hammasi» → «Bir kishi — hamma emas» (belgi o'rniga gap) · «Pattern (ko'pchilik)» → «ko'p odam aytgan shikoyat» · «Scope shishishi» → «Hamma taklifni qo'shish» · «Aniq maqtov» — 7-ekrandagi «umumiy maqtov — foydasiz» bilan zid bo'lmasin · xulosadagi «Direktor… sifatni saqlab» olindi (3-karta shuni aytadi)

## 12 · Qayta o'lchash  `[1360]`
- Eyebrow: O'lchash · natija
- Sarlavha: **Tuzatdingiz — lekin ishladimi? Qayta o'lchaysiz.**
- Mentor: Tuzatish — hali taxmin. Ishladimi — qayta o'lchab bilasiz: v2 chiqqandan keyin o'sha shikoyat kamaydimi? Tugmani bosing.
- Blok: «Manzilni qayta so'raydi» shikoyati — v1 (oldin): 18 · v2 (keyin): ? → tugmadan keyin 1
- Tugma: ▶ Yangi fikrlarni o'lchash → ✓ O'lchandi
- Natija (bitta ramka): Shikoyat 18 dan 1 ga tushdi — tuzatish ishladi. Endi ro'yxat boshida «narx ko'rinmaydi» (12 kishi) — keyingi iteratsiya shu bilan boshlanadi.
- Tugma: Natijani tekshiring → Davom etish

**Ko'rinish:** v1 ustuni (18) va bo'sh v2 ustuni «?» (**KOD:** hozir v2 bosilguncha ham qizil «18» ko'rinadi — go'yo v2 da ham 18) → tugma → natija-ramka.
Animatsiya: HA — v2 ustuni to'lib, 1 gacha qisqaradi, rangi yashil bo'ladi (~0.8 s). Kamayishni ko'rsatadi.
Olib tashlanadi: «🔁 AYLANA DAVOM ETADI … Yaxshilash hech qachon tugamaydi» ikkinchi ramkasi (natija-ramkaga qo'shildi — ekranda bitta ramka; «hech qachon» — A3) · «Agar tushmaganida… ko'r-ko'rona bo'ladi» (Mentor o'lchash sababini aytadi) · 📊.

✎ 30.09 ChatGPT #14 **Qabul**: «buni faqat yangi fikr aytadi» — ekranning o'zi sonni o'lchaydi (18 → 1) → «qayta o'lchab bilasiz» · #13 (v2 ustuni) — 29.09 da KOD · «fix ishladi» → «tuzatish ishladi» · aylana → iteratsiya · «12 kishi» qo'shildi (5-ekrandagi son — bog'lanish ko'rinsin)

## 13 · Aniq prompt yig'ing  `[1395]`
- Eyebrow: Amaliyot · aniq prompt
- Sarlavha: **«Narx ko'rinmaydi» — promptni o'zingiz yig'ing.**
- Mentor: Sababi: buyurtma tasdiqlanganda bot narxni yozmaydi. AI yordamchiga (sinfda — gemini.google.com) prompt uch qismdan yig'iladi. Har qismga bittadan tanlang.
- Qismlar (navbat bilan; ballsiz — to'g'ri variant o'rni aralash):
  1. **Qayerda?** — Butun botda · ✔ bot.js dagi buyurtma tasdig'i xabarida · Menyu tugmasida
  2. **Nima o'zgarsin?** — Narxlarni pasaytir · Tasdiq xabarini qisqartir · ✔ Tasdiq xabariga taom nomi va narxini qo'sh
  3. **Nima buzilmasin?** — ✔ Manzil bir marta so'ralishi o'zgarmasin · Menyu tugmalari olib tashlansin · Botni noldan qayta yoz
- Xato tanlansa (joriy qism ostida, bitta gap): (1) Muammo faqat tasdiq xabarida — butun botni o'zgartirish shart emas. · (1) Narx menyuda bor — yo'qolgani tasdiq xabarida. · (2) Narx to'g'ri, faqat ko'rinmayapti. · (2) Xabar qisqa emas — unda narx yo'q. · (3) Tugmalar ishlayapti — ularni olib tashlash yangi muammo. · (3) Ishlab turgan qismlar ham yo'qoladi.
- O'ngda — yig'ilayotgan prompt: «bot.js dagi buyurtma tasdig'i xabarida narx yo'q. Tasdiq xabariga taom nomi va narxini qo'sh. Manzil bir marta so'ralishi o'zgarmasin.»
- Tugma: ▶ AI'ga yuborish → ✓ Tuzatildi
- Natija: yorliq «v3 — tuzatilgandan keyin» · chat (AvtoPizza): mijoz «Margarita, Chilonzor 5» → bot «Qabul qilindi: Margarita — 35 000 so'm. Manzil: Chilonzor 5.»
- Pastki tugma: Promptni yig'ing → Davom etish

**Ko'rinish (KOD — hozir tayyor prompt va bitta tugma):** qismlar bittadan (A6): joriy qism va uning 3 varianti; to'g'ri tanlangach qism «✓ Qayerda — …» qatoriga yig'iladi va uning bo'lagi o'ngdagi promptga tushadi; uchinchisidan keyin «▶ AI'ga yuborish»; bosilgach v3 chati. Variantlar kartasi bosiladigandek (U1). Mexanika 6-darsdagi system prompt yig'ish bilan bir xil.
Animatsiya: yo'q.
Olib tashlanadi: «Aniq o'zgarish» kartasi (prompt bo'laklari shuni ko'rsatadi) · «Endi narx ham ko'rinadi. Aniq fikr → aniq prompt → aniq tuzatish…» ramkasi (chat natijani ko'rsatadi) · 🎯 📝 ✅ 📍.

✎ 30.09 13-savol (tuzilma takliflari — «ChatGPT auditidan keyin») + ChatGPT #12, #28 + 29.09 agent eslatmasi 4: ekran passiv edi (o'quvchi bitta tugma bosardi, «Amaliyot» nomi to'g'ri kelmasdi) → prompt uch qismdan yig'iladi: qayerda · nima o'zgarsin · nima buzilmasin (11-ekrandagi 3-tuzoq bilan bog'lanadi); 16-ekrandagi o'z promptiga ko'prik bo'ladi · ⏳ 21-savol: bu o'zgarish tasdiqlansin (ekran soni o'zgarmaydi, KOD kattaroq) · 29.09: 45 000 → 35 000 so'm (A5), «Maslahatchi» → «AI yordamchi» + gemini.google.com

## 14 · 4-savol ✅  `[1429]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Eng katta shikoyatni tuzatib, yangi versiyani chiqardingiz. Endi nima qilasiz?**
  - Ish tugadi: bot endi mukammal, fikr kerak emas
  - Qolgan hamma kodni ham birdaniga qayta yozaman
  - Fikr yig'ishni to'xtataman: ular faqat shovqin
  - ✔ Tuzatish ishladimi, yangi fikrlardan tekshiraman
- To'g'ri: Har tuzatishdan keyin yana tinglaysiz — keyingi iteratsiya shundan boshlanadi.
- Xato izohlari:
  - Mukammal mahsulot bo'lmaydi: ehtiyojlar o'zgaradi, yangi muammolar chiqadi. Tinglashda davom eting.
  - Hammasini birdan qayta yozish xavfli: ishlab turgan qismlar ham buzilishi mumkin. Yaxshilash bittadan, o'lchab boriladi.
  - Tinglashni to'xtatsangiz, tuzatish ishladimi — bilmay qolasiz.
  - (umumiy) Yangi fikrlarni yig'ib, tuzatish ishladimi — tekshirasiz.

✎ To'g'ri javob eng uzuni edi (92 belgi, qolganlari 45–60; DAVOM 7, tasdiqlandi) va unda «fix», «aylana davom etadi» bor edi → 45–48 belgi, atamasiz · «Mahsulot hech qachon tayyor bo'lmaydi», «doimiy aylana, har muvaffaqiyatli mahsulotda» → yumshatildi (A3) · «Fikr — eng qimmatli manba» olindi

## 15 · Iteratsiyani yig'ing ✅ (final)  `[1459]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: iteratsiya qadamlarini to'g'ri tartibda yig'ing.**
- Mentor: Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Bo'laklar: Tingla · Guruhla · Tanla · Tuzat · Qayta tingla
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam · «bu yerga qo'ying»
- To'g'ri (bitta ramka): ✓ Iteratsiya tayyor: tingla → guruhla → tanla → tuzat → qayta tingla. Keyin hammasi yangi fikrlar bilan yana boshlanadi.
- Xato (bitta yozuv): Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Havola (birinchi urinishda xato bo'lsa): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: Iteratsiyani yig'ing → Davom etish

**Ko'rinish:** final — bo'laklar hammasi birdan (A6 istisnosi). To'g'ri yig'ilgach bitta natija-ramka, havola uning ichida.
Animatsiya: HA — to'g'ri yig'ilgach 5-qadamdan 1-qadamga qaytuvchi strelka chiziladi (keyingi iteratsiya boshlanadi); faqat to'g'ri javobdan keyin.
Olib tashlanadi: ikkinchi natija-ramka («✓ Aylana tayyor: … va yana boshlanadi ↻. Mahsulot doim yaxshilanadi» — `dd-done` bilan bir ma'no) · ikkinchi xato yozuvi («⚠️ Tartib xato — qayta joylang» — pastdagi yozuv bilan bir ma'no) · 📖.

✎ 🔴 Mentor «tinglaysiz, guruhlaysiz, ustuvor tanlaysiz, tuzatasiz — va yana tinglaysiz» → olindi: javob tartibini to'liq aytib qo'yardi (DAVOM 7, tasdiqlandi) · joy izohlari («birinchi nima qilinadi», «eng oxiri nima qilinadi») → «1-qadam…» · yaxshilash aylanasi → iteratsiya · «Mahsulot doim yaxshilanadi» olindi (A3)

## 16 · Amaliyot · fikrlar ro'yxati  `[2287]` (shablon `[2159]`)
- Eyebrow: Amaliyot · fikrlar ro'yxati · joy: «kompyuteringizda»
- Sarlavha: **O'z botingiz uchun fikrlar ro'yxatini tuzing**
- Mentor: Bu topshiriqni o'z kompyuteringizda bajaring. Har qadamni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — Mentor kuzatib turadi.
- Topshiriq: Botingizga keladigan 5 ta fikrni matn fayliga yozing (masalan, `fikrlar.txt`), ularni aniq va noaniqqa ajrating va qaysi birini birinchi tuzatishni tanlang. Bugun kod yozmaysiz — faqat fikrlarni tahlil qilasiz.
- Qadamlar:
  1. 5 ta fikr yozing: 8-darsda odamdan eshitgan javoblaringizdan yoki o'zingiz o'ylab (masalan: «tugma ishlamadi», «rahmat, ajoyib»).
  2. Har fikrni aniq yoki noaniq deb belgilang; noaniqiga aniqlashtiruvchi savol yozing.
  3. Aniqlari ichidan eng ko'p aytiladigan (chastota) va eng qiynaydiganini (ta'sir) toping.
  4. Shu fikrni bitta aniq o'zgarishga aylantiring.
  5. Aniq o'zgarishni AI uchun bitta gaplik prompt qilib yozing.
- Tugmalar: Bajardim → ✓ Bajarildi — Mentorni kuting · «Vazifa bajarildi. Mentor tekshirib, keyingi qadamga o'tkazadi.»

**Ko'rinish (KOD):** qadamlar bittadan: joriy qadam to'liq; bajarilganlari `✓` bilan bitta qatorga yig'iladi; keyingilari hali ko'rinmaydi (hozir 5 qadam birdan va istalgan tartibda belgilanadi).
Animatsiya: yo'q.

✎ «o'z tilaklar daftarida bajaring» → «o'z kompyuteringizda» (F-0929-51; «daftar» yo'q, joy aniq) · 8-darsga ko'prik: fikrni o'ylab topish o'rniga, bor bo'lsa, odamdan eshitgan javob ishlatiladi · «ustoz» → «Mentor» · «Zo'r!» · 🟢 ⚪ ✅ olindi · «Bosqichlar — belgilab boring» → «Qadamlar»

## 17 · Natijalar (podium)  `[2034]` — o'zgarmaydi
(Tizim-UI: podium belgilari qoladi. «sessiya» so'zi — B-7.)
- Savol yorliqlari: 1 — Fikr turi · 2 — Ustuvorlik · 3 — Fokus · 4 — Tuzatishdan keyin · 5 — Iteratsiya tartibi

✎ «4 — Iteratsiya» → «4 — Tuzatishdan keyin» (4-savol shu haqda) · «5 — Aylana tartibi» → «5 — Iteratsiya tartibi»

## 18 · Takrorlash (kartochkalar)  `[2315]` (kartalar `[2301]`)
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Fikr yig'ish → tuzatish → yangi versiya → yana fikr yig'ish. Bu takror nima deyiladi? | Iteratsiya | Har iteratsiyada bot biroz yaxshilanadi |
| Fikrlar qaysi uch turga ajratiladi? | Bug, taklif, maqtov | Har turi o'z ishini talab qiladi: tuzatish, o'ylab ko'rish, saqlash |
| «Bot manzilimni ikki marta so'radi» — bu qanday fikr? | Bug | Bot kutilgan ishni bajarmayapti — tuzatish kerak |
| Mijoz botda hali yo'q narsani so'rasa, bu qanday fikr? | Taklif | Uni darrov qo'shmaysiz — o'ylab ko'rib qaror qilasiz |
| Aniq maqtovni nega diqqat bilan o'qiysiz? | Nima yaxshi ishlayotganini ko'rsatadi | Tuzatayotganda o'sha joyni buzib qo'ymaslik kerak |
| Aniq fikr noaniqdan nimasi bilan farq qiladi? | Unda muammo va joy aytilgan | Noaniq fikrni avval aniqlashtirasiz |
| Qaysi tuzatishni birinchi qilishni nimaga qarab tanlaysiz? | Chastota va ta'sirga | Nechta odam aytgan va muammo qanchalik qiynagan |
| Har qadamda nechta mijoz qolganini ko'rsatadigan chizma nima? | Voronka | Eng katta yo'qotish — ikki qadam orasidagi eng katta farq |
| Ko'p odam suhbatning bir joyida to'xtab, ketib qolsa, buni nima deymiz? | Ketib qolish (drop-off) | O'sha qadamda nimadir xalaqit beradi — sababini tekshirasiz |
| Kam odamga kerak bo'lgan taklifga nima deysiz? | «Hozir emas» | Bu e'tiborsizlik emas — botning asosiy ishini saqlash |
| AI yordamchiga berishdan oldin noaniq shikoyatni nimaga aylantirasiz? | Aniq o'zgarishga | Masalan: tasdiq xabariga taom nomi va narxi qo'shilsin |
| Tuzatishni chiqargandan keyin nima qilasiz? | Qayta o'lchaysiz | O'sha shikoyat kamaydimi — tekshirasiz; keyingi iteratsiya shundan boshlanadi |

- Tugmalar: o'zgarmaydi (✓ Bildim · ✗ Takrorlash · ↻ …)

✎ 1-kartochka: «Mahsulot qachon tayyor bo'ladi? — Hech qachon» → javobi «Iteratsiya» (atama yodlanadi; «hech qachon» — A3) · 2-kartochka: «Triaj» → «Bug, taklif, maqtov» (izohsiz chet so'z javobda turardi; «signal» olindi) · 3-kartochka «darhol» olindi · 8-kartochka «Bitta odamning shikoyati nega hali pattern emas?» → «Voronka» (voronka markaziy o'yinda bor, kartochkada yo'q edi; «bir kishi» g'oyasi 10-kartochkada) · «Drop-off» → «Ketib qolish (drop-off)»

## 19 · Yakun  `[2328]`
- Eyebrow: Tayyor · belgi: ✓ Botingizni yaxshiladingiz
- Sarlavha: **Endi botingiz foydalanuvchi bilan birga o'sadi.**
- Endi siz bilasiz:
  - Mahsulot bir versiya bilan tugamaydi — iteratsiya bilan yaxshilanib boradi
  - Aniq fikrda muammo va joy bor; noaniq fikrni avval aniqlashtirasiz
  - Qaysi birini birinchi tuzatish — chastota va ta'sirga qarab; «hozir emas» deyish ham qaror
  - Voronkadan eng katta yo'qotishni topib, o'sha qadamni birinchi tuzatasiz
  - Tuzatgandan keyin qayta o'lchaysiz — keyingi iteratsiya shundan boshlanadi
- Uyga vazifa · Amaliy topshiriqni bajarish →
- Uyga vazifa:
  - **Yig'ing** — botingizni kamida 3 kishiga sinatib ko'ring va 8-darsdagidek bo'lib o'tgan ishini so'rab, fikrlarini yozib oling
  - **Tanlang** — chastota va ta'sirga qarab qaysi birini birinchi tuzatishni belgilang
  - **Aylantiring** — eng muhim fikrni AI uchun aniq promptga aylantiring
- Keyingi dars — **«AI-agent yaratish».** Botga maqsad berasiz — keyingi qadamni u o'zi tanlab, asbob chaqiradi: masalan, buyurtmani bazaga saqlaydi.
- Arena tugmasi · Mentorni kuting · Nishonlaringiz — N/4 · Qaytadan · Yakunlash ✓

Olib tashlanadi: 🚀 📝 ⏳ 🏅 (matn oldidagi).

✎ 🔴 FAKT: «Keyingi dars — AI-agent: bu yaxshilash aylanasini endi botning O'ZIga beramiz» → 10-dars bunday qilmaydi: u agentni (maqsad, asboblar, chegara) va «idrok → qaror → amal» siklini o'rgatadi, hook — «buyurtmani yubordim» degan, lekin saqlamagan AI-bot (10-dars MD, ipi) · RECAP: «hech qachon tayyor emas» → «bir versiya bilan tugamaydi»; «(triaj)» va «aylana: tingla → tuzat → qayta tingla» olindi · Uyga vazifa amaliyotni (16-ekran) so'zma-so'z takrorlardi → «Yig'ing» endi haqiqiy odamlardan fikr (8-dars ko'nikmasi) · «xayoliy» olindi · 30.09 (10-dars auditi, A15): «AI faqat javob yozadi; agent ishni bajaradi» → «keyingi qadamni o'zi tanlaydi» (4-darsdagi oddiy bot ham bazaga yozadi)

---

## Qo'shimcha matnlar

**Nishonlar (4)** — nomi inglizcha qoladi (qoida), mavzuga moslanadi; medal belgisi — o'yin qatlami:
- **Feedback Sorter** (hozir Signal Finder) — Aniq va noaniq fikrlarni birinchi urinishda to'g'ri saraladingiz
- **Funnel Reader** — Voronkadagi eng katta yo'qotishni topdingiz
- **Right Fix First** — Eng ta'sirli tuzatishni birinchi tanladingiz
- **Full Iteration** (hozir Loop Closer) — Iteratsiya qadamlarini birinchi urinishda to'g'ri tartibladingiz
- Nishon yozuvlari: yuqori panelda «Nishonlar — N/4» · nishon chiqqanda «bosib davom eting». (Birinchi uchtasi 7-ekranda, to'rtinchisi 15-ekranda.)

✎ «Signal» nomdan olindi (A1) · 🔴 FAKT: Loop Closer tavsifi «Aylanani yopib, yangi versiyani chiqardingiz» — nishon 15-ekran finalida (tartibni birinchi urinishda to'g'ri yig'ish) beriladi, u yerda versiya chiqarilmaydi → tavsif harakatga moslandi · «Badges» → «Nishonlar»

**Test ekranlarining umumiy yozuvlari:** To'g'ri · Qaytadan urinib ko'ring · ✓ To'g'ri javob: X — … · Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · Qisqa takrorlash — mavzuni yana bir ko'rish
(⚡ 📨 📖 olinadi.)

**Qisqa takrorlash oynalari (5)** — karta belgisi (`ic`) o'rniga raqam 1 · 2 · 3 (kodsiz dars — U3); sarlavha «Qayta tushuntirish»:
1. (4) **Fikr turlari — har biri o'z ishini talab qiladi:** Bug — tuzatiladi: «Bot manzilimni qayta so'radi» — bot kutilgan ishni bajarmayapti. · Taklif — o'ylab ko'riladi: botda hali yo'q narsa so'ralsa, uni darrov qo'shmaysiz. · Maqtov — saqlanadi: aniq maqtov nima yaxshi ishlayotganini ko'rsatadi, tuzatishda uni buzmang. · Sinfga savol: «Bot manzilimni 2 marta so'radi» — bu qanday fikr?
2. (8) **Ustuvorlik — chastota va ta'sir:** Bitta shikoyat — tasodif bo'lishi mumkin: bir kishi aytgan narsaga darrov ergashmang. · Ko'pchilik va og'riq — birinchi: eng ko'p odam aytgan va eng qattiq qiynagan muammo birinchi tuzatiladi. · «Hozir emas» ham qaror: vaqt oz — kam ta'sirli fikrga «hozir emas» deyish botning asosiy ishini saqlaydi. · Sinfga savol: Nega hamma fikrni birdan qila olmaymiz?
3. (10) **Fokus — kimga foyda beradi:** Bir kishi — hamma emas: bitta o'ziga xos so'rov kamdan-kam ko'pchilikka foyda beradi. · Hamma taklifni qo'shmang: har taklifni qo'shsangiz, bot chalkashadi va og'irlashadi. · Ko'pchilikka foyda — birinchi: vaqtni ko'pchilikka ta'sir qiladigan ishga sarflaysiz. · Sinfga savol: 100 kishidan bittasi tor so'rov aytsa — nima qilamiz?
4. (14) **Iteratsiya — tuzatishdan keyin ham davom etadi:** Tuzatish — taxmin: ishladimi-yo'qmi, buni qayta o'lchash ko'rsatadi. · Qayta o'lchaysiz: versiya chiqqach, o'sha shikoyat kamaydimi — tekshirasiz. · Keyingi iteratsiya: tuzatgandan keyin ham tinglashda davom etasiz — bot shunday yaxshilanib boradi. · Sinfga savol: Eng katta shikoyatni tuzatdingiz — endi nima?
5. (15) **Iteratsiya — tartib muhim:** Avval — tingla: mijozlar fikrini yig'asiz, hali hech narsani tuzatmaysiz. · Guruhla, keyin tanla: bir xil fikrlarni birlashtirasiz, so'ng chastota va ta'sirga qarab tanlaysiz. · Tuzat va qayta tingla: tuzatgandan keyin yana tinglaysiz — keyingi iteratsiya shu yerdan boshlanadi. (chizma: Tingla → Guruhla → Tanla → Tuzat → Qayta tingla) · Sinfga savol: Nega «tuzat» eng oxirgi qadam emas?

✎ «har biri boshqa signal», «buzuq xatti-harakat», «Botjon», «direktor», «pattern», «Scope shishmasin», «hech qachon tayyor emas», «Sikl davom etadi» → A1 bo'yicha · 🐞 💡 👍 🗣️ 📊 🎯 🛑 🙋 📦 ✅ 🔧 📈 ↻ 👂 🗂️ 🔁 olindi (chizmadagi ham)

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Foydalanuvchi: «/start bosdim, menyu tugmasi chiqmadi». Bu qanday fikr? Maqtov: mijoz botdan mamnun · ✔ Bug: aniq joy va muammo bor · Taklif: yangi narsa so'ralgan · Shovqin: e'tibor shart emas
2. «Yaxshi bot» degan fikr nega kam foydali? Chunki bu salbiy fikr · Chunki maqtov kam uchraydi · Chunki botni yomon ko'rsatadi · ✔ Chunki aniq joy aytilmagan
3. 18 kishi bir xil shikoyat qildi, 1 kishi boshqa narsani aytdi. Qaysi birini birinchi ko'rib chiqasiz? ✔ 18 kishinikini: ko'pchilik aytgan · 1 kishinikini: u eng birinchi yozgan · Ikkalasini ham bir vaqtning o'zida · Hech birini: bular shunchaki hissiyot
4. Qaysi tuzatishni birinchi qilishni nimaga qarab tanlaysiz? Eng jahl bilan yozilgan fikrga qarab · Eng birinchi kelgan fikrga qarab · ✔ Ko'p aytilgani va qattiq qiynaganiga · O'zimga eng qiziq tuyulganiga qarab
5. Voronkada eng katta yo'qotish qayerda ko'rinadi? Eng ko'p odam turgan birinchi qadamda · ✔ Odam soni eng ko'p kamaygan joyda · Bot eng sekin javob bergan joyda · Eng ko'p maqtov kelgan qadamda
6. Menyu tugmasi tuzatilgach, menyuni ochmasdan ketganlar 60 dan 15 ga tushdi. Bu nimani bildiradi? Tuzatish ishlamadi, hamma ketyapti · Sonlar tasodifiy, xulosa chiqmaydi · Botda yana yangi bug paydo bo'ldi · ✔ Tuzatish ishladi, muammo kamaydi
7. «Bot ahmoq» sharhiga javob yozish nega eng ta'sirli tuzatish emas? ✔ Unda nimani tuzatish kerakligi yo'q · Bunday sharhga javob yozib bo'lmaydi · Uni yozgan odam botni ishlatmagan · Javob yozish juda ko'p vaqt oladi
8. 100 kishidan bittasi faqat o'ziga kerak narsani so'radi. Nima qilasiz? Darrov qo'shaman: har so'rov bajarilsin · U foydalanuvchini botdan bloklayman · ✔ Avval ko'pchilikka keraklisini qilaman · Hamma so'rovni navbati bilan qo'shaman
9. Tuzatishdan keyin nima qilasiz? Hech narsa: tuzatish albatta ishlaydi · ✔ Qayta o'lchayman: shikoyat kamaydimi · Darhol yana katta o'zgarish qilaman · Fikr yig'ishni butunlay to'xtataman
10. Botingizning birinchi versiyasi chiqdi. Ish tugadimi? ✔ Yo'q: bot fikr bilan yaxshilanib boradi · Ha: birinchi versiya — tayyor mahsulot · Testlarning hammasi o'tib bo'lsa — tugadi · Bir hafta shikoyat kelmasa — tugadi
11. Noaniq fikr («menyu chalkash») aniq o'zgarishdan nimasi bilan farq qiladi? Farqi yo'q, ikkalasi bir xil ishlatiladi · Noaniq fikr odatda yolg'on bo'ladi · Aniq o'zgarishni faqat dasturchi tushunadi · ✔ Fikr shikoyat, aniq o'zgarish esa vazifa
12. Aniq maqtovni («tez va qulay, rahmat!») nega e'tiborsiz qoldirmaysiz? Chunki maqtovni ham tuzatish kerak · Chunki maqtov yozganga chegirma beriladi · ✔ Chunki u nima yaxshi ishlashini aytadi · Chunki maqtovda eng ko'p bug bo'ladi

✎ 30.09 ChatGPT #19 **Qisman**: 1-savol «Menyu tugmasini topolmadim» bug emas, noqulaylik ham bo'lishi mumkin edi → «/start bosdim, menyu tugmasi chiqmadi» (aniq bug; ✔ o'rni o'sha); fikr turlari (bug · taklif · maqtov) o'zgarmadi · 🔴 To'g'ri javob eng uzuni edi — 12 savoldan 8 tasida (1, 2, 3, 5, 7, 8, 11, 12; eng og'irlari: 8-savol ✔ 81 belgi, qolganlari 24–46 · 11-savol ✔ 84, qolganlari 36–55 · 12-savol ✔ 86, qolganlari 38–41; DAVOM 7, tasdiqlandi) → hamma variantlar 21–42 belgi, to'g'risi endi eng uzuni emas ·
🔴 6-savol: «60 kishidan 15 tasi ketib qoldi» → «menyuni ochmasdan ketganlar 60 dan 15 ga tushdi» (7-ekran fakti) ·
4-savol: «Faqat ta'sir — kam aytilsa ham og'riqli bo'lsa birinchi» distraktori qisman to'g'ri (5-ekranning o'zi «ba'zan kam, lekin og'riqli shikoyat ham muhim» deydi) → «Eng jahl bilan yozilganiga qarab»; «Ustuvorlik (prioritet) formulasi qanday hisoblanadi?» → oddiy savol (kantselyarit) ·
3-savol: «1 kishilik shikoyat — kamdan-kam, demak muhimroq» — 5-ekran izohiga yaqin (qisman to'g'ri) → «u eng birinchi yozgan» ·
10-savol: «Hech qachon — u doim yaxshilanadi (iteratsiya)» — qavs va atama faqat to'g'rida, «hech qachon» (A3) → savol qayta tuzildi ·
2-savol: «salbiy fikr hisoblanadi» (kantselyarit) va «juda uzun yozilgan» (ishonarsiz) almashtirildi · 7-savol: «bunday sharh hech qachon kelmaydi» — darsning o'zi uni ko'rsatadi, ishonarsiz → almashtirildi · 🔥 bonus va «streak» — arena shablonida (B-7)

---

## KOD ro'yxati (razrabotkada bajariladi — MD tasdiqlangach)
1. s0 — savol va variantlar tugma bosilgandan keyin chiqadi; javob izohi tanlovga qarab ikki xil («Aynan!» / «Qiziq fikr!»), ikkalasida ham iteratsiya izohi.
2. s1 — `GearPanel` va «Jihozlar paneli» yorlig'i olinadi (B-1); `sk-info` kartasi olinadi, mazmuni `flow-label` ga; bot xabari yangilanadi; 4-qadam tegi «qayta tingla».
3. s3 — xulosa `frame-success` olinadi; 2-karta yorlig'i va matni yangilanadi.
4. s5 — ikki ramka (`frame-success` + `sk-info`) bitta ramkaga; tugmadagi 📊 olinadi.
5. s6 — xulosa ramkasi olinadi; `🗣` / `🎯 ANIQ O'ZGARISH` yorliqlari.
6. s7 — voronka/ustuvorlik/oqibat matnlari (🔴 FAKT); saralash kartalari bittadan (dasta); c8 matni; voronkaga o'tishdagi yashil ramka → yorliq; 6-bosqich chat nomi «AvtoPizza»; `FIX_CHOICES[].d` olinadi; voronka pog'onalari chizilish animatsiyasi; nav yorlig'i.
7. s9 — `STAGES` 4 → 5 («Guruhla» qo'shiladi, `N/5`); 4-qadam va v2 chatidan narx olinadi; xulosa ramkasi olinadi.
8. s12 — v2 ustuni bosilguncha «?» (bo'sh); ikki ramka (`frame-success` + `agent-card`) → bitta.
9. s13 — prompt matni; v3 chatida 35 000 so'm; xulosa ramkasi olinadi; tugma yorliqlari.
10. s15 — Mentor tartibni aytmaydi; slot yorliqlari «1-qadam…»; ikki natija (`dd-done` + `frame-success`) → bitta, takrorlash havolasi uning ichida; ikki xato yozuvi (`dd-wrong` + `dd-pool-empty`) → bitta; to'g'ri yig'ilgach qaytuvchi strelka.
11. s16 — `ScreenLivePractice` checklist navbat bilan (bu darsdagi nusxa); `place` «kompyuteringizda»; «ustoz» → «Mentor».
12. s17 — `Q_LABELS` 14 va 15.
13. s19 — `RECAP`, `HOMEWORK`, keyingi dars qatori.
13a. 30.09: s7 savat nomlari «Aniq / Noaniq» va izohlar; voronka va ustuvorlik tanlovlarida to'g'ri variant 2-o'rin (4-savol A) · s13 — prompt yig'ish mexanikasi (6-dars system prompt yig'ishi naqshi; 21-savol A — 01.10 tasdiqlandi) · s5 natija, s8 savol (ta'sir ma'lumoti) · test izohlari bitta gap (A8) · U1 (qadam teglari olinadi, bosiladigan kartalarda `›` / `✓`) · `Q_LABELS` o'zgarmaydi.
14. Butun dars — emoji A4 bo'yicha (`npm run lint:emoji`): chat pufakchalari, tugmalar, savatlar, `TgChat` sarlavhasidagi 🤖 va standart nom «Botjon» → «AvtoPizza»; `RECAPS` `ic` → raqam; `ACHIEVEMENTS` `name`/`desc`; «Badges» → «Nishonlar»; `QZ_BG_SHAPES` suzuvchi so'zlari (triaj, prioritet, drop-off, 📔 ❌ ✅ 🎯 → iteratsiya, chastota, ta'sir, voronka, bug, taklif); test matnlari (✔ o'rni o'zgarmaydi).

---

## B. Bu darsdan tashqariga chiqadigan ishlar (hozir tegilmaydi)
1. **Jihozlar paneli (`GearPanel`)** — ✅ qaror F-0929-63 (1-dars v2 B-1): bu darsda ham olinadi (KOD 2). `GEAR_SLOTS` dagi «Holat daftari», «Tilaklar daftari», «Kalit va qoidalar varag'i» ham shu bilan ketadi.
2. **5-dars v2:** 9-dars 1-ekrani «5-darsda test → tuzatish → yana test — bu ham iteratsiya edi» deydi. 5-darsda «iteratsiya» shu ma'noda kiritilgan (kartochka va jonli viktorina 11-savol) — 5-dars v2 bu atamani saqlasin; 5-dars finalidagi «Iteratsiya» bo'lagi ham 9-dars bilan bir ma'noda.
3. **6-dars v2:** 9-dars 6-ekranda «system prompt» (6-darsda hozir «yo'riqnoma»), 7-ekranda «botdagi AI narxni o'zi o'ylab topgan» (6-darsdagi o'ylab topish) ishlatiladi. 6-dars v2 nomlari boshqacha bo'lsa — 9-darsga ham ko'chiriladi. «Maslahatchi» nomi 6-darsda qolsa ham, 9-darsda kod tuzatadigan AI — «AI yordamchi» (boshqa narsa).
4. **8-dars v2:** 9-dars 3-ekrani, amaliyoti va uyga vazifasi 8-darsdagi «bo'sh savol» va «bo'lib o'tgan ishni so'rash» ga tayanadi. 8-dars v2 atamani o'zgartirsa — 9-darsga ham.
5. **Margarita narxi** — 6- va 7-darsda 35 000 so'm, 9-darsda 45 000 edi → 9-dars 35 000 ga moslandi. 3, 4, 10-darslarda narx chiqsa, ham shu son.
6. **10-dars:** 9-dars yakuni endi 10-dars mazmunini to'g'ri aytadi. 10-dars 0-ekranidagi «O'tgan darsni eslang: AI-bot…» 9-darsga emas, 6-darsga havola bo'lishi kerak (10-dars MD eslatmasida bor). 10-dars 19-ekrani «keyingi dars — fidbek» deydi — u 9-dars, o'tib bo'lgan (10-dars MD).
7. **Arena va podium shabloni** (barcha darslarda bir xil): «🔥 bonus», «Keyingisida olasiz! 💪», «🏆 Test yakunlandi!», «eng uzun streak», «sessiya» → KATTA_TOZALASH nomzodi (umumiy — yozilmaydi; 1-dars v2 B-5).
8. **RU matni** — o'zbekcha tasdiqlangach.

---

## Agent eslatmalari
1. **DAVOM 6 (7-ekran voronka) — tekshirdim, xato tasdiqlandi:** `FUNNEL_STEPS` [865] 100 / 40 / 35; «ochgandan keyin» [1205], «menyudan keyin» [1221], arena 6-savol [1606]. Tuzatildi: 60 kishi menyuni ochmasdan ketgan, 5 kishi menyuni ochib buyurtma bermagan. `FIX_CHOICES[0].d` [872] «18+ kishi» ham xato, lekin ekranga chiqmaydi (KOD 6 — olinadi).
2. **DAVOM 7 (9-dars bandlari) — hammasi tasdiqlandi:** «iteratsiya» 0-ekranda izohsiz [912]; s10 ✔ 104 belgi (qolganlari 49–70), s14 ✔ 92 (45–60); arenada 12 savoldan 8 tasida ✔ eng uzun (8, 11, 12 — eng og'iri); 15-ekran Mentori tartibni to'liq aytadi. Hammasi tenglashtirildi. ✔ o'rinlari manba bilan solishtirildi: `INLINE_KEYS` [290] = `correctIdx` (s4:1, s8:2, s10:0, s14:3), `QUIZ_BANK.correct` = 1·3·0·2·1·3·0·2·1·0·3·2 — MD'da ✔ aynan shu o'rinlarda; variant tartibi o'zgarmagan, 7-ekrandagi ikki tanlov va savat qiymatlari ham o'zgarmagan.
3. **Qo'shimcha topilgan ichki ziddiyatlar (tuzatildi):** 9-ekranda v2 narx bilan, 12–13-ekranda esa narx v3 da tuzatiladi · 6-ekrandagi «Bot meni tushunmaydi» aniq vazifaga aylanadi, 7-ekrandagi shunga o'xshash fikr «foydasiz» edi · 11-ekran «maqtovni e'tiborsiz qoldirmang», 7-ekran «Yaxshi bot — foydasiz» → «aniq / umumiy maqtov» farqi · 9-ekranda 4 qadam, finalda 5 bo'lak → 9-ekranga «Guruhla» (KOD 7) · Loop Closer tavsifi final harakatiga mos emas edi.
4. ~~Savol: 13-ekran~~ → 30.09: prompt yig'ish qo'llandi (21-savol bilan tasdiqlanadi). v2 da eyebrow «Hayotiy» qilindi. Promptni o'quvchi o'zi 3 bo'lakdan (qayerda · nima o'zgarsin · nima buzilmasin) yig'adigan qilish mumkin — ekran soni o'zgarmaydi, lekin KOD kattaroq. Foydalanuvchi qarori.
5. **Savol:** 3-ekran 8-dars mavzusini qaytaradi («Botim yoqdimi?»). Ekran olib tashlanmadi — 8-darsga ko'prik qilib qayta yozildi. Takror sifatida ko'rilsa, uni boshqa mazmunga almashtirish — qaror.
6. **Ikki misol-ip, bitta olam:** 0/5/9/12/13-ekranda manzil → narx (v1 → v2 → v3), 7-ekranda menyu tugmasi va voronka. Versiya raqami to'qnashmasin deb 7-ekrandan «yangi versiya chiqdi» olindi. Ikkalasini bitta ipga birlashtirish (masalan, voronka ham manzil qadamini ko'rsatsin) — tuzilma o'zgarishi, qaror kerak.
7. **«×» belgisi** («chastota × ta'sir») olindi → «chastota va ta'sir»: darsda son bilan ko'paytirish yo'q, o'smir uni arifmetika deb o'qiydi. Formula shaklini saqlash kerak bo'lsa — qaytariladi.
8. **Hook (0-ekran):** to'g'ri variant eng uzuni edi (70 belgi, qolganlari 36–51) — tenglashtirildi. Hook ball bermaydi, lekin A8 ruhi shu.
