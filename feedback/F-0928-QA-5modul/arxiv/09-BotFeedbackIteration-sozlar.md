# 5-Modul (LMS: 7-Modul) · 9-dars «Fikr va iteratsiya» — reja va ekranma-ekran so'zlar

Fayl: `src/5-Modull/BotFeedbackIterationLesson.jsx` · 20 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook:** AvtoPizza boti ishlayapti, mijozlardan fikr kela boshladi. O'quvchi «▶ Mijozlar nima dedi?» tugmasini bosib 4 fikrni ochadi (manzilni 2 marta so'radi · narx ko'rinmaydi · glutensiz pizza · «tez va qulay, rahmat»), keyin 3 variantdan «eng to'g'ri qadam»ni tanlaydi.
- **Markaziy o'yin (7-ekran):** 📔 tilaklar daftaridagi 8 yozuvni 🟢 qimmatli / ⚪ foydasiz savatlarga saralaydi → voronkada (100 → 40 → 35) eng ko'p odam yo'qolgan qadamni topadi → nimani birinchi tuzatishni tanlaydi (menyu tugmasi yoki «Bot ahmoq»ga javob) → oqibatni ko'radi → aylanani yopadi.
- **Asosiy metafora:** yaxshilash aylanasi (Tingla → Guruhla → Tanla → Tuzat → Qayta tingla) = iteratsiya. Fikrlar yoziladigan joy — 📔 tilaklar daftari (1-ekranda «mehmonlar kitobi»), o'quvchi — «restoran egasi» / «direktor», AI — «Maslahatchi (AI)».
- **Yakun:** 15-ekranda aylananing 5 bo'lagini to'g'ri tartibga sudraydi, keyin o'z boti uchun 5 ta xayoliy fikrdan tilaklar daftarini tuzadi. Keyingi dars — AI-agent.

---

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — fikr kela boshladi | hook | 4 fikrni ochadi, «eng to'g'ri qadam»ni tanlaydi | — |
| 1 | Reja | qoida | yaxshilangan bot natijasi + bugungi 4 qadam | — |
| 2 | Fikr manbalari | tushuncha | 4 manbani bosib o'qiydi | — |
| 3 | Savol berish | tushuncha | «Yoqdimi?» va «Qayerda qiynaldingiz?» — ikkalasini sinaydi | — |
| 4 | 1-savol | test | «manzilni 2 marta so'radi» — qanday fikr | ✅ |
| 5 | Pattern · chastota | tushuncha | shikoyatlarni guruhlaydi (ustunlar chiqadi) | — |
| 6 | Noaniq → aniq | tushuncha | 3 noaniq fikrni aniq o'zgarishga «tarjima» qiladi | — |
| 7 | Tilaklar daftari | markaziy o'yin | saralash → voronka → birinchi tuzatish → oqibat → aylana | — (nishonlar) |
| 8 | 2-savol | test | 18 kishilik bug yoki 3 kishilik taklif — birinchi nima | ✅ |
| 9 | AvtoPizza aylanasi | case | aylananing 4 qadamini birma-bir ochadi | — |
| 10 | 3-savol | test | 100 dan 1 kishining tor so'rovi | ✅ |
| 11 | 3 tuzoq | tushuncha | 3 tuzoqni bosib o'qiydi | — |
| 12 | Qayta o'lchash | tushuncha | v1 va v2 shikoyat sonini solishtiradi | — |
| 13 | Buyruq bering | amaliyot | «narx ko'rinmaydi» → AI prompti → v3 | — |
| 14 | 4-savol | test | tuzatib, versiya chiqargandan keyin nima | ✅ |
| 15 | Aylanani yig'ing | yakuniy | 5 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 16 | Amaliyot · tilaklar daftari | praktika | o'z boti uchun 5 fikr yozadi, saralaydi, prompt yozadi | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 ta xulosa + uyga vazifa + keyingi dars | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta; nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
fikr · 📔 tilaklar daftari (1-ekranda «mehmonlar kitobi») · restoran egasi / direktor · Botjon · signal (bu darsda = fikr-belgisi) ·
buzuq (bug) / taklif / maqtov · triaj (turlarga ajratish) · pattern (ko'pchilik aytgan) · chastota × ta'sir · ustuvorlik (prioritet) ·
🟢 qimmatli / ⚪ foydasiz · hisob-kitob (voronka) · tiqilib qolish (drop-off) · aniq o'zgarish · Maslahatchi (AI) · prompt ·
«hozir emas» · scope shishishi · yaxshilash aylanasi (Tingla → Guruhla → Tanla → Tuzat → Qayta tingla) · iteratsiya · v1 / v2 / v3 · qayta o'lchash

---

## 0 · Kirish — fikr kela boshladi  `[876]`
- Eyebrow: Loyiha · kirish
- Sarlavha: **Botingiz jonli, mijozlar foydalanyapti. Endi fikr kela boshladi. Nima qilasiz?**
- Mentor: Eng yaxshi mahsulot ham birinchi versiyada mukammal emas. Foydalanuvchilar uni siz ko'rmagan tomondan ishlatadi. Tugmani bosib, kelgan fikrlarni ko'ring.
- Chat (AvtoPizza · bot · onlayn): mijoz «Manzilimni 2 marta so'radi 😤» → tugma bosilgach yana: «Narxni ko'rsatmaydi, noqulay» · «Glutensiz pizza qo'shing!» · «Tez va qulay, rahmat! 🍕»
- Tugma: ▶ Mijozlar nima dedi? → ✓ Fikrlar keldi
- Savol (tugma bosilmaguncha xira): **Eng to'g'ri qadam qaysi?**
  - Hech narsa — bot ishlayapti, shikoyat normal holat
  - Fikrlarni tinglab, eng ko'p og'ritganini tuzataman va yana so'rayman
  - Hammasini darrov noldan qayta yozaman
- Javobdan keyin (qaysi variant tanlansa ham bir xil): Aynan! Mahsulot hech qachon «tayyor» bo'lmaydi — u **iteratsiya** qiladi. Bugun fikrni tinglab, saralab, eng muhimini tuzatib, yana tinglashni o'rganamiz.
- Tugma: Davom etish

## 1 · Reja  `[920]`
- Eyebrow: Reja
- Sarlavha: **Siz — restoran egasisiz, 📔 fikr — mehmonlar kitobi.**
- Mentor: Eslang: siz o'zingiz test qilib bug topardingiz (oldingi darslar). Bugun boshqacha — **foydalanuvchilar** muammoni aytadi, siz saralab, eng muhimini tuzatasiz. Yangi mahorat: chalkash fikrni aniq vazifaga aylantirish.
- Blok: dars oxirida — yaxshilangan bot
  - Chat (AvtoPizza): mijoz «Margarita, Chilonzor 5» → bot «Qabul qilindi ✅ Margarita (45 000 so'm) · Chilonzor 5 📍 — manzilni qayta so'ramayman 😊»
  - Izoh: Mijozlar shikoyat qilgan narsalar tuzatildi: manzil bir marta so'raladi, narx ko'rinadi. Mahsulot yaxshilandi.
- Jihozlar paneli — bugun 📔 yangi uyacha yonadi: Kalit va qoidalar varag'i · Tugmalar va konvert · Holat daftari · Yo'l-yo'riq va yo'riqnoma · Vositalar · Tilaklar daftari (shu 6 tasi yonadi) · Loyiha · AI yordamchi
- Bugungi 4 qadam:
  1. Fikrni tinglash va turlarga ajratish (triaj) · *tingla*
  2. Guruhlab, ustuvorlik qo'yish (chastota × ta'sir) · *tanla*
  3. Noaniq fikrni aniq o'zgarishga aylantirish · *tuzat*
  4. Qayta tinglash — yaxshilash aylanasi · *sikl*
- Tugmalar: 4 qadamni ko'rish / ↩ Natijani ko'rish (faqat telefonda) · Boshlaymiz →

## 2 · Fikr manbalari  `[960]`
- Eyebrow: Tushuncha · manba
- Sarlavha: **Fikr faqat shikoyatda emas — 4 manbadan keladi.**
- Mentor: Foydalanuvchi har doim ham «menga bu yoqmadi» deb yozmaydi. Ko'pincha fikr **xatti-harakatda** ko'rinadi — qayerda to'xtaydi, nimani qayta so'raydi. Har manbani bosing.
- Kartalar (bosilganda o'ngda ochiladi):
  - **To'g'ridan xabar** — Foydalanuvchi botga to'g'ridan-to'g'ri shikoyat yoki taklif yozadi — eng aniq signal.
  - **Tiqilib qolish** — Ko'p odam suhbatning bir joyida to'xtab, ketib qoladi (drop-off). Demak o'sha qadam chalkash.
  - **Takror savollar** — Bir xil savol qayta-qayta berilsa — bot biror narsani aniq ko'rsatmayapti.
  - **Xatolar / loglar** — Serverdagi xato yozuvlari — qayerda bot buzilayotganini ko'rsatadi (texnik signal).
- Xulosa (4 tasi ko'rilgach): To'g'ridan xabar — eng aniq, lekin kam. Xatti-harakat (drop-off, takror) — ko'p va yashirin. Yaxshi direktor ikkalasini ham o'qiydi.
- Tugma: 4 manbani ko'ring (0/4) → Davom etish

## 3 · Savol berish  `[991]`
- Eyebrow: Tushuncha · savol berish
- Sarlavha: **Qanday so'rasangiz — shunday javob olasiz.**
- Mentor: Botjon mijozdan fikr so'rashi mumkin. Lekin savolning shakli javob sifatini belgilaydi. Ikkalasini sinab ko'ring.
- Kartalar:
  - **«Yoqdimi?»** — Umumiy savol — odatda umumiy javob keladi: «yaxshi», «zo'r». Bu javobda tuzatish uchun hech qanday aniq ma'lumot yo'q.
  - **«Qayerda qiynaldingiz?»** — Aniq savol — aniq javob keladi: «menyu tugmasini topolmadim». Bu javobni to'g'ridan-to'g'ri tuzatish uchun ishlatsa bo'ladi.
- Xulosa: Aniq savol — aniq javob. Botjonga fikr so'ratganda ham, o'zingiz o'qiganda ham shu qoida ishlaydi.
- Tugma: Ikkala savolni sinang → Davom etish

## 4 · 1-savol ✅  `[1028]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **«Bot manzilimni 2 marta so'radi» — bu qanday fikr?**
  - Taklif — hozir yo'q narsa so'ralgan, direktor buni qaror qiladi
  - ✔ Buzuq (bug) — Botjon holatni eslamagan, tuzatish kerak
  - Maqtov — mijoz botdan mamnun ekanini bildiradi
  - Ahamiyatsiz shovqin — e'tibor berilmasligi kerak
- To'g'ri: To'g'ri! Bu bug — Botjon kutilgan ishni bajarmayapti (holatni eslamayapti). Har fikr boshqa harakat talab qiladi: bug → tuzat, taklif → qaror qil, maqtov → saqla. Turini to'g'ri aniqlash — birinchi qadam.
- Xato izohlari:
  - (Taklif) Taklif — bu hozir yo'q narsani so'rash. Bu yerda mavjud narsa noto'g'ri ishlayapti — demak bug.
  - (Maqtov) Maqtov ijobiy fikr. «So'radi 😤» — bu norozilik, ya'ni buzuq xatti-harakat (bug).
  - (Shovqin) Aksincha — bu aniq signal: ko'p odam shunday desa, jiddiy bug. E'tibor berish kerak.
  - (umumiy) Bu bug — Botjon kerakli ishni qilmayapti.

## 5 · Pattern · chastota  `[1047]`
- Eyebrow: Pattern · chastota
- Sarlavha: **Bitta shikoyat — tasodif. Ko'pchilik aytsa — pattern.**
- Mentor: Har bir fikrga alohida ergashsangiz — adashasiz. Bir xil shikoyatlarni **guruhlang** va sanang: nechta odam shu narsadan shikoyat qildi? Tugmani bosing.
- Ustunlar (son tugma bosilgach chiqadi): Manzilni qayta so'raydi — 18 · Narx ko'rinmaydi — 12 · Javoblar juda uzun — 5 · Glutensiz yo'q — 3
- Tugma: 📊 Fikrlarni guruhlash → ✓ Guruhlandi
- Natija: Pattern aniq: **«manzilni qayta so'raydi»** — 18 kishi. Bu eng ko'p og'ritgan narsa. Eng baland ustun yo'lni ko'rsatadi.
- Qo'shimcha izoh: Faqat son emas — keyinroq **ta'sir**ni ham qo'shamiz. Ba'zan kam, lekin og'riqli shikoyat ham muhim.
- Tugma: Fikrlarni guruhlang → Davom etish

## 6 · Noaniq → aniq  `[1082]`
- Eyebrow: Tarjima · aniqlik
- Sarlavha: **Foydalanuvchi noaniq gapiradi — siz aniq vazifaga aylantirasiz.**
- Mentor: «Menyu chalkash» — bu shikoyat, vazifa emas. Maslahatchi (AI) bunga to'g'ri kod yoza olmaydi. Direktor sifatida uni aniq o'zgarishga aylantirasiz. Har noaniq fikrni bosing.
- Juftliklar (chapda noaniq fikr → bosilganda o'ngda: «🗣 Foydalanuvchi (noaniq)» va «🎯 ANIQ O'ZGARISH»):
  - «Menyu chalkash» → Har pizza yoniga narx va 2-3 so'z tavsif qo'sh.
  - «Bot meni tushunmaydi» → Yo'riqnomaga: noaniq savolda aniqlovchi savol ber.
  - «Sekin javob beradi» → Oddiy savollarni tugma bilan, AI'siz tez javob ber.
- Xulosa: Har noaniq shikoyat ortida aniq o'zgarish bor. Uni siz topasiz — Maslahatchi (AI) esa shu aniq vazifani bajaradi.
- Tugma: 3 fikrni tarjima qiling (0/3) → Davom etish

## 7 · Tilaklar daftari (markaziy o'yin)  `[1117]`
- Eyebrow: Markaziy · tilaklar daftari
- Sarlavha: **Tilaklar daftarini o'qing — u eng qimmatli buyumingiz.**
- Mentor: Botingiz bir hafta ishladi. Mijozlar 📔 tilaklar daftariga fikr yozib qoldirdi. Avval saralaymiz, keyin qayerda eng ko'p odam ketib qolganini topamiz, so'ng nimani birinchi tuzatishni tanlaymiz.
- **1-bosqich — kirish:** 📔 Tilaklar daftari — 8 ta yozuv (8 yozuv ko'rinadi) · Tugma: ▶ Saralashni boshlash
- **2-bosqich — saralash:** 🟢 Qimmatli / ⚪ Foydasiz — har kartani savatga joylang
  - Ko'rsatma: 👆 Kartani sudrab savatga tashlang (yoki bosib, tez tanlang) — 0/8 · tez tanlov tugmalari: 🟢 Qimmatli · ⚪ Foydasiz
  - Savatlar: 🟢 Qimmatli — aniq muammo + qayerda · ⚪ Foydasiz — hissiyot, dalilsiz · oxirida: ✓ Hammasi saralandi

| Yozuv | To'g'ri savat | Noto'g'ri savatga tashlansa chiqadigan izoh |
|---|---|---|
| Yaxshi bot 👍 | ⚪ | Umumiy maqtov — qaysi qism yaxshi ekani aniq emas, tuzatish uchun ishlatib bo'lmaydi. |
| Menyu tugmasini topolmadim, /start bosdim, hech narsa chiqmadi | 🟢 | Aniq muammo (menyu tugmasi) va aniq joy (/start dan keyin) ko'rsatilgan — tuzatish mumkin. |
| Buyurtma berdim, javob 5 daqiqada keldi | 🟢 | Aniq muammo (sekinlik) va o'lchov (5 daqiqa) bor — tuzatish mumkin. |
| Bot ahmoq | ⚪ | Hissiyot, dalilsiz — qaysi qism yoqmagani noma'lum, tuzatishga yaramaydi. |
| Manzilni yozdim, lekin bot uni eslamadi, qaytadan so'radi | 🟢 | Aniq bug — bot holatni eslab qolmagan, qayerda buzilgani aniq. |
| Narxni so'radim, boshqa narx aytdi | 🟢 | Aniq bug — maslahatchi (AI) narxni o'ylab topgan, qayerda xato ekani aniq. |
| Zo'r, hammasi judayam yoqdi ✨ | ⚪ | Umumiy hayajon — aniq joy yoki muammo ko'rsatilmagan. |
| Bot ba'zan tushunarsiz javob beradi | ⚪ | «Ba'zan» — qachon, qayerda ekani noaniq, tuzatishga yetarli emas. |

- **3-bosqich — voronka:** Saraladingiz! Endi hisob-kitobga qaraymiz — mijozlar qayerda ko'p ketib qoladi?
  - 📊 Hisob-kitob (voronka): 100 — /start bosdi · 40 — Menyuni ochdi · 35 — Buyurtma berdi
  - Savol: **Qaysi qadamda eng ko'p odam yo'qoldi?**
    - ✔ /start bosdi → Menyuni ochdi · 60 kishi
    - Menyuni ochdi → Buyurtma berdi · 5 kishi
  - Xato bosilsa: Bu yerda kam odam yo'qolgan. Ustunlarni solishtirib, eng katta farqni toping.
- **4-bosqich — ustuvorlik:** Topdingiz — **60 kishi** menyuni ochgandan keyin ketib qolgan. Qimmatli fikrlar ko'p, vaqt oz. Qaysi birini birinchi tuzatasiz?
  - ✔ Menyu tugmasini tuzatish
  - «Bot ahmoq» sharhiga javob yozish
- **5-bosqich — oqibat:**
  - To'g'ri tanlansa: ✅ Menyu tugmasi tuzatildi — Yangi versiya chiqdi. Voronkada 60 kishidan endi faqat **15 tasi** ketib qolyapti. Aniq oqibat! · Tugma: Aylanani yopish →
  - Xato tanlansa: ❌ «Bot ahmoq» ga javob yozildi — Voronka o'zgarmadi — hali ham 60 kishi menyudan keyin ketib qolyapti. Bu fikr aniq muammo ko'rsatmagan edi. · Tugma: ↩ Qaytadan tanlash
- **6-bosqich — aylana:** 📔 Tilaklar daftariga yangi yozuv keldi
  - Chat («Tilaklar daftari»): «Endi menyu topildi, rahmat! 🎉»
  - Aylana yopildi — lekin yangi fikr baribir keladi. Yaxshilash — bir marta emas, **AYLANA**: tingla → guruhla → tanla → tuzat → yana tingla.
  - Tugma: ✓ Tushunarli
- Yakun: Butun yo'lni bosib o'tdingiz: saraladingiz, voronkani topdingiz, eng ta'sirlisini tuzatdingiz — va aylana yana boshlandi.
- Tugma: Daftarni oxirigacha o'qing → Davom etish

## 8 · 2-savol ✅  `[1244]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Vaqtingiz cheklangan. 18 kishi manzil bug'idan, 3 kishi glutensiz taklifidan gapirdi. Birinchi nima?**
  - Glutensiz pizzani — yangi narsa har doim qiziqroq va e'tirof keltiradi
  - Ikkalasini bir vaqtda — hech narsani kechiktirmaslik kerak
  - ✔ Manzil bug'ini — ko'p kishi va kuchli og'riq (chastota × ta'sir eng yuqori)
  - Hech narsani — fikrlar shunchaki shikoyat, jiddiy emas
- To'g'ri: To'g'ri! Cheklangan resursda eng katta ta'sir beradigan ishni tanlaysiz: ko'p odam (18) + kuchli og'riq = manzil bug'i. Glutensiz taklif kutadi. Bu — har mahsulotda ishlaydigan ustuvorlik qoidasi.
- Xato izohlari:
  - (Glutensiz) «Qiziqroq» — bu sizning hissingiz, foydalanuvchi og'rig'i emas. 18 kishilik bug 3 kishilik taklifdan ustun.
  - (Ikkalasi) Cheklangan vaqtda hammasini birdan qilsangiz — hech biri sifatli chiqmaydi. Avval eng kattasini.
  - (Hech narsa) Aksincha — 18 kishilik takroriy shikoyat juda jiddiy signal. Uni birinchi tuzatasiz.
  - (umumiy) Eng ko'p + eng og'riqlisini birinchi: manzil bug'i.

## 9 · AvtoPizza aylanasi (case)  `[1263]`
- Eyebrow: Hayotiy · yaxshilash aylanasi
- Sarlavha: **AvtoPizza — bitta to'liq aylana.**
- Mentor: Mana hammasi birga: chalkash fikrdan yaxshilangan mahsulotgacha. Tugmani bosib, aylanani boshidan oxirigacha yuring.
- Qadamlar (har bosishda bittadan ochiladi):
  1. **Tingla** — 18 kishi: «manzilni qayta so'raydi». Eng ko'p shikoyat — bu birinchi.
  2. **Tanla** — Chastota yuqori + og'riq kuchli → ustuvor #1. Glutensiz taklif kutadi.
  3. **Tuzat** — Maslahatchiga (AI) aniq buyruq: manzilni bir marta so'ra, holatni TAYYOR qil, narxni ko'rsat. v2 chiqdi.
  4. **Qayta tingla** — Yangi fikr: shikoyat 18 → 1. Ishladi! Endi «narx» tepaga chiqdi — keyingi aylana.
- 🍕 Mijoz tomonidan (chat AvtoPizza):
  - Oldin: mijoz «Margarita, Chilonzor 5» → bot «Manzilingizni yuboring 📍» → mijoz «Men aytdim — Chilonzor 5 😤»
  - 4 qadamdan keyin: mijoz «Margarita, Chilonzor 5» → bot «Qabul qilindi ✅ Margarita (45 000) · Chilonzor 5 📍»
- Tugma: ▶ Tinglashni boshlash → Keyingi qadam → → ✓ Aylana tugadi
- Xulosa: v1 da bot manzilni qayta so'radi; v2 da — bir marta, narx bilan. Bitta aylana mahsulotni sezilarli yaxshiladi.
- Tugma: Aylanani yuriting (0/4) → Davom etish

## 10 · 3-savol ✅  `[1305]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **100 foydalanuvchidan 1 tasi juda o'ziga xos narsa so'radi (faqat unga kerak). Nima qilasiz?**
  - ✔ Ko'pchilikka foyda beradigan fikrlarga e'tibor beraman; bitta tor so'rovga «hozir emas» deyish ham qaror
  - Darrov qo'shaman — har bir foydalanuvchining so'rovi bajarilishi shart
  - O'sha foydalanuvchini bloklayman — u xalaqit beradi
  - Hamma so'rovni navbat bilan, istisnosiz qo'shaman
- To'g'ri: To'g'ri! Cheklangan vaqtni ko'pchilikka ta'sir qiladigan ishlarga sarflaysiz. Bitta tor so'rovga «yo'q» yoki «hozir emas» deyish — e'tiborsizlik emas, balki mahsulot fokusini saqlash. Bu — har joyda kerakli qaror.
- Xato izohlari:
  - (Darrov qo'shaman) Har so'rovni qo'shsangiz — bot chalkashadi va ko'pchilik uchun yomonlashadi. Fokus muhim.
  - (Bloklayman) Foydalanuvchini bloklash — fikrdan qochish. To'g'ri yo'l — xushmuomala «hozir emas» deyish.
  - (Istisnosiz) Istisnosiz qo'shish — scope shishishi. Direktor tanlaydi, hammasini emas.
  - (umumiy) Ko'pchilikka foydani ustun qo'yib, tor so'rovga «hozir emas» deysiz.

## 11 · 3 tuzoq  `[1324]`
- Eyebrow: Ehtiyot · tuzoqlar
- Sarlavha: **Fikrni qo'llashning 3 tuzog'i.**
- Mentor: Fikrni tinglash yaxshi — lekin uni noto'g'ri qo'llash mahsulotni buzadi. Mana 3 ta keng tarqalgan xato. Har birini bosing.
- Kartalar:
  - **Bitta odam = hammasi** — Bir kishi so'radi deb darrov qo'shmang. Pattern (ko'pchilik) qidiring.
  - **Scope shishishi** — Har taklifni qo'shsangiz — bot og'irlashadi, chalkashadi. Asosiy ishda qoling.
  - **Maqtovni e'tiborsiz** — Maqtov — nima ishlayotganini aytadi. Tuzatishda o'shani buzib qo'ymang.
- Xulosa: Fikr — yo'l-yo'riq, buyruq emas. Direktor uni saralab, o'lchab, sifatni saqlab qo'llaydi.
- Tugma: 3 tuzoqni ko'ring (0/3) → Davom etish

## 12 · Qayta o'lchash  `[1360]`
- Eyebrow: O'lchash · natija
- Sarlavha: **Tuzatdingiz — lekin ishladimi? Qayta o'lchaysiz.**
- Mentor: Tuzatish — taxmin. U haqiqatan yordam berdimi, buni faqat **yangi fikr** aytadi. Versiya chiqargach, o'sha shikoyat kamaydimi — tekshirasiz. Tugmani bosing.
- Blok: 📊 «Manzilni qayta so'raydi» shikoyati — v1 (oldin): 18 · v2 (keyin): 18 → tugmadan keyin 1
- Tugma: ▶ Yangi fikrlarni o'lchash → ✓ O'lchandi
- Natija: Shikoyat 18 dan 1 ga tushdi — fix **ishladi**. Agar tushmaganida, boshqa sabab izlardik. O'lchamasangiz — tuzatish ko'r-ko'rona bo'ladi.
- 🔁 AYLANA DAVOM ETADI: Endi yangi ro'yxatda **«narx ko'rinmaydi»** tepaga chiqdi. Demak keyingi aylana — o'sha. Yaxshilash hech qachon tugamaydi.
- Tugma: Natijani tekshiring → Davom etish

## 13 · Buyruq bering (amaliyot)  `[1395]`
- Eyebrow: Amaliyot · buyruq bering
- Sarlavha: **«Narx ko'rinmaydi» fikrini AI promptiga aylantiring.**
- Mentor: «Narx» endi navbatdagi ustuvor fikr. Sababi (siz topasiz): buyurtma tasdiqlanganda narx umuman ko'rinmaydi. Endi buni Maslahatchiga (AI) aniq buyruq qilib beramiz. Tugmani bosing.
- 🎯 Aniq o'zgarish: Buyurtma tasdiqlanganda tasdiq xabariga taom nomini va narxini ham qo'sh.
- 📝 tuzatish prompti: Botda kamchilik bor: buyurtma tasdiqlanganda narx ko'rsatilmaydi. Tasdiq xabarida taom nomi, narxi va manzilni ko'rsat.
- Tugma: ▶ Maslahatchi tuzatdi — natijani ko'r → ✓ Tuzatildi
- Natija: ✓ tuzatilgandan keyin (v3) · chat AvtoPizza: mijoz «Margarita, Chilonzor 5» → bot «Qabul qilindi ✅ Margarita (45 000 so'm) · Chilonzor 5 📍»
- Xulosa: Endi narx ham ko'rinadi. Aniq fikr → aniq prompt → aniq tuzatish — bu ko'nikma har fikr uchun ishlaydi.
- Tugma: Maslahatchiga buyuring → Davom etish
- (Bu ekranda o'quvchi hech narsa yozmaydi yoki tanlamaydi — faqat bitta tugma bosadi.)

## 14 · 4-savol ✅  `[1429]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Eng katta shikoyatni tuzatib, yangi versiyani chiqardingiz. Endi nima?**
  - Loyiha tugadi — bot endi mukammal, fikr kerak emas
  - Qolgan hamma narsani ham birdan qayta yozaman
  - Foydalanuvchilarni tinglashni to'xtataman — ortiqcha shovqin
  - ✔ Qayta tinglayman: fix ishladimi tekshiraman va yangi fikrlarni yig'aman — aylana davom etadi
- To'g'ri: To'g'ri! Mahsulot hech qachon «tayyor» bo'lmaydi. Har tuzatishdan keyin qayta tinglaysiz: ishladimi va keyin nima muhim. Tingla → tuzat → qayta tingla — bu doimiy aylana, har muvaffaqiyatli mahsulotda shunday.
- Xato izohlari:
  - (Loyiha tugadi) Hech bir mahsulot «mukammal» emas — ehtiyojlar o'zgaradi, yangi muammolar chiqadi. Tinglashni davom ettiring.
  - (Qayta yozaman) Hammasini birdan qayta yozish — xavfli va keraksiz. Yaxshilash bittadan, o'lchab boriladi.
  - (To'xtataman) Tinglashni to'xtatsangiz — mahsulot foydalanuvchidan uzoqlashadi. Fikr — eng qimmatli manba.
  - (umumiy) Qayta tinglaysiz — aylana davom etadi.

## 15 · Aylanani yig'ing ✅ (final)  `[1459]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: yaxshilash aylanasini to'g'ri tartibda yig'ing.**
- Mentor: Fikrdan yaxshilangan mahsulotgacha yo'l: tinglaysiz, guruhlaysiz, ustuvor tanlaysiz, tuzatasiz — va yana tinglaysiz. Bo'laklarni sudrab to'g'ri tartibga joylang.
- Bo'laklar: Tingla · Guruhla · Tanla · Tuzat · Qayta tingla
- Uyachalar: birinchi nima qilinadi · keyin nima qilinadi · keyin nima qilinadi · keyin nima qilinadi · eng oxiri nima qilinadi
- To'g'ri: ✓ To'g'ri: Tingla → Guruhla → Tanla → Tuzat → Qayta tingla.
- Xato: ⚠️ Tartib xato — qayta joylang. · Tartib xato — bo'lakni bosib qaytaring va qayta joylang
- Yakun: ✓ Aylana tayyor: **Tingla → Guruhla → Tanla → Tuzat → Qayta tingla** → va yana boshlanadi ↻. Mahsulot doim yaxshilanadi.
- Havola (birinchi urinishda xato bo'lsa): 📖 Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: Aylanani yig'ing → Davom etish

## 16 · Amaliyot · tilaklar daftari  `[2287]` (shablon `[2159]`)
- Eyebrow: Amaliyot · tilaklar daftari
- Sarlavha: **O'z botingiz uchun tilaklar daftarini tuzing**
- Mentor: Bu topshiriqni **o'z tilaklar daftarida** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: 5 ta xayoliy foydalanuvchi fikrini o'ylab yozing, ularni 🟢 qimmatli / ⚪ foydasiz deb saralang va chastota × ta'sir bo'yicha qaysi birini birinchi tuzatishni tanlang. Hali kod yozmaysiz — faqat fikrni tahlil qilasiz.
- Bosqichlar — belgilab boring:
  1. 5 ta xayoliy foydalanuvchi fikrini yozing (masalan: «tugma ishlamadi», «rahmat, zo'r»)
  2. Har fikrni 🟢 qimmatli yoki ⚪ foydasiz deb saralang
  3. Qimmatli fikrlar orasida qaysi biri eng ko'p (chastota) va eng og'riqli (ta'sir) ekanini toping
  4. Eng ustuvor fikrni bitta aniq o'zgarishga aylantiring
  5. Aniq o'zgarishni bir gapda AI promptiga yozing
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.» · Avval bajaring → Davom etish

## 17 · Natijalar (podium)  `[2034]`
- Sarlavha: **Kim g'olib?** · Natijalar
- Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi. (+ ball halqasi «N/5 to'g'ri javob»)
- Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin (N/5 to'g'ri) · 🏆 To'liq reyting · savol yorliqlari: 1 — Fikr turi · 2 — Ustuvorlik · 3 — Fokus · 4 — Iteratsiya · 5 — Aylana tartibi

## 18 · Takrorlash (kartochkalar)  `[2315]` (kartalar `[2301]`)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Mahsulot qachon «tayyor» bo'ladi? | Hech qachon | U iteratsiya qiladi: chiqadi, fikr yig'adi va yana yaxshilanadi |
| Kelgan fikrlarni turlarga ajratish qanday ataladi? | Triaj | Buzuq (bug), taklif va maqtov — uchtasi uch xil signal |
| «Bot manzilimni ikki marta so'radi» — bu qanday signal? | Buzuq (bug) | Bot kutilgan ishni bajarmayapti — bunisi darhol tuzatiladi |
| Mijoz hozir yo'q narsani so'rasa, bu qanday fikr? | Taklif | Uni birdan qo'shmaysiz — o'ylab qaror qilasiz |
| Maqtovni nega diqqat bilan o'qiysiz? | Nima yaxshi ishlayotganini ko'rsatadi | Tuzatish paytida o'sha joyni buzib qo'ymaslik kerak |
| Qimmatli fikr foydasizidan nimasi bilan farq qiladi? | Aniq muammo va joyi bor | Foydasiz fikr — dalilsiz hissiyot |
| Qaysi tuzatishni birinchi qilishni nimaga qarab tanlaysiz? | Chastota va ta'sirga qarab | Nechta odam aytgan va muammo qanchalik og'ritgan |
| Bitta odamning shikoyati nega hali pattern emas? | Tasodif bo'lishi mumkin | Bir xil gap ko'p takrorlansa — o'shanda pattern |
| Ko'p odam suhbatning bir joyida to'xtab ketib qolsa, buni nima deymiz? | Drop-off | Demak, o'sha qadam chalkash — buni hisob-kitob ko'rsatadi |
| Kam odamga kerak bo'lgan taklifga nima deyish to'g'ri? | «Hozir emas» | Bu e'tiborsizlik emas — fokusni saqlash |
| AI yordamchiga topshirishdan oldin noaniq shikoyatni nimaga aylantirasiz? | Aniq o'zgarishga | Masalan: tasdiq xabariga taom nomi va narxini qo'sh |
| Tuzatishni chiqargandan keyin nima qilasiz? | Qayta tinglash va o'lchash | O'sha shikoyat kamaydimi — tekshirasiz, aylana yangidan boshlanadi |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 19 · Yakun  `[2328]`
- Eyebrow: Tayyor · belgi: ✓ Mahsulotni yaxshiladingiz
- Sarlavha: **Endi botingiz foydalanuvchi bilan birga o'sadi.** (+ ball halqasi «N/5 to'g'ri javob»; CodeStrike arena tugmasi · ⏳ Mentorni kuting)
- Endi siz bilasiz:
  - Mahsulot hech qachon «tayyor» emas — u iteratsiya qiladi
  - Fikrni saralash (triaj): qimmatli fikrda aniq muammo va joy bor, foydasiz fikr — hissiyot, dalilsiz
  - Ustuvorlik = chastota × ta'sir; «hozir emas» deyish ham qaror
  - Voronkada eng katta yo'qotish qayerda ekanini topib, o'sha qadamni birinchi tuzatasiz
  - Tuzatgandan keyin qayta o'lchaysiz — aylana: tingla → tuzat → qayta tingla
- Uyga vazifa tugmasi: Uyga vazifa · Amaliy topshiriqni bajarish → (tugma ichida suzib yuruvchi so'zlar: amaliyot · loyiha · mashq · natija)
- 📝 Uyga vazifa (bosilgach):
  - **Yig'ing** — botingiz uchun 5 ta xayoliy foydalanuvchi fikrini yozing va ularni 🟢 qimmatli / ⚪ foydasiz deb saralang
  - **Tanlang** — chastota × ta'sir bo'yicha qaysi birini birinchi tuzatishni belgilang
  - **Aylantiring** — eng muhim fikrni aniq AI promptiga aylantiring
- 🚀 Keyingi dars — AI-agent: bu yaxshilash aylanasini endi botning O'ZIga beramiz.
- 🏅 Nishonlaringiz — N/4 · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** 📡 Signal Finder — Qimmatli va foydasiz fikrlarni to'g'ri saraladingiz · 🔻 Funnel Reader — Voronkadagi eng katta yo'qotishni topdingiz · 🎯 Right Fix First — Eng ta'sirli tuzatishni birinchi tanladingiz · 🔁 Loop Closer — Aylanani yopib, yangi versiyani chiqardingiz
Nishon yozuvlari: yuqori panelda «🏅 Badges — N/4» · nishon chiqqanda «bosib davom eting». (Birinchi uchtasi 7-ekranda, «Loop Closer» 15-ekranda beriladi.)

**Test ekranlarining umumiy yozuvlari:** To'g'ri · Qaytadan urinib ko'ring · ✓ To'g'ri javob: X — … · ⚡ Jonli dars — bitta urinish, o'ylab bosing! · 📨 Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · 📖 Qisqa takrorlash — mavzuni yana bir ko'rish

**Qisqa takrorlash oynalari (5)** (sarlavha «📖 Qayta tushuntirish», tugmalar ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz):
1. (4-ekran) Fikr turlari — har biri boshqa signal: 🐞 Buzuq — darhol tuzat: «Bot manzilimni qayta so'radi» — bu **buzuq xatti-harakat**, Botjon kutilgan ishni bajarmayapti. · 💡 Taklif — qaror qilinadi: Hozir yo'q narsa so'ralsa — bu **taklif**, direktor uni birdan qo'shmaydi, o'ylab qaror qiladi. · 👍 Maqtov — saqlanadi: Maqtov nima yaxshi ishlayotganini ko'rsatadi — tuzatishda uni **buzib qo'ymaslik** kerak. · 🗣️ Sinfga savol: «Bot manzilimni 2 marta so'radi» qanday signal?
2. (8-ekran) Ustuvorlik — chastota × ta'sir: 📊 Bitta shikoyat — tasodif: Bitta odam aytgan narsaga darrov ergashmang — bu **pattern** emas, tasodif bo'lishi mumkin. · 🎯 Ko'pchilik + og'riq = birinchi: Eng ko'p odam aytgan **va** eng ko'p og'ritgan narsa — birinchi tuzatiladigan narsa. · 🛑 «Yo'q» deyish ham qaror: Vaqt cheklangan — kam ta'sirli fikrga **«hozir emas»** deyish e'tiborsizlik emas, fokusni saqlash. · Sinfga savol: Nega hamma fikrni birdan qila olmaymiz?
3. (10-ekran) Fokus — kimga foyda beradi: 🙋 Bitta odam — hammaning ovozi emas: Bitta o'ziga xos so'rov — **kamdan-kam** ko'pchilikka foyda beradi. · 📦 Scope shishmasin: Har taklifni qo'shsangiz — bot **chalkashadi va og'irlashadi**. Asosiy ishda qoling. · ✅ Ko'pchilikka foyda — ustuvor: Cheklangan vaqtni **ko'pchilikka ta'sir qiladigan** ishga sarflaysiz. · Sinfga savol: 100 dan 1 tasi tor so'rov aytsa — nima qilamiz?
4. (14-ekran) Iteratsiya — hech qachon tayyor emas: 🔧 Tuzatish — taxmin: Har tuzatish — bu **taxmin**. Ishladimi yo'qmi, buni faqat yangi fikr ko'rsatadi. · 📈 Qayta o'lchaysiz: Versiya chiqargach, o'sha shikoyat **kamaydimi** — tekshirasiz, ko'r-ko'rona ishonmaysiz. · ↻ Sikl davom etadi: Tuzatgandan keyin ham tinglashni **to'xtatmaysiz** — mahsulot doim yaxshilanadi. · Sinfga savol: Eng katta shikoyatni tuzatdingiz — endi nima?
5. (15-ekran) Yaxshilash aylanasi — tartib muhim: 👂 Avval — tingla: Birinchi qadam — mijozlar fikrini **yig'ish**, hali hech narsani tuzatmaysiz. · 🗂️ Guruhla, keyin tanla: Bir xil fikrlarni **birlashtirasiz**, so'ng chastota × ta'sir bo'yicha **tanlaysiz**. · 🔧 Tuzat va qayta tingla: Tuzatgandan so'ng yana **tinglaysiz** — aylana shu yerdan yana boshlanadi. (👂 Tingla → 🗂️ Guruhla → 🎯 Tanla → 🔧 Tuzat → 🔁 Qayta tingla) · Sinfga savol: Nega «tuzat» eng oxirgi qadam emas?

**Jonli viktorina (12 savol, 15 soniya, to'g'risi ✔):**
1. Foydalanuvchi «menyu tugmasini topolmadim» dedi. Bu qanday fikr? Maqtov — botdan mamnunligini bildiradi · ✔ Buzuq (bug) yoki chalkashlik — aniq joy va muammo ko'rsatilgan · Taklif — hozir yo'q narsa so'ralgan · Ahamiyatsiz shovqin — e'tibor berish shart emas
2. «Yaxshi bot 👍» degan fikr nega kam foydali? Chunki u salbiy fikr hisoblanadi · Chunki juda uzun yozilgan · Chunki botni yomon ko'rsatadi · ✔ Chunki aniq muammo yoki joy ko'rsatilmagan
3. 18 kishi bitta shikoyat qildi, 1 kishi boshqasini aytdi. Qaysi biri ko'proq pattern? ✔ 18 kishilik shikoyat — ko'pchilik aytgan, pattern kuchli · 1 kishilik shikoyat — kamdan-kam, demak muhimroq · Ikkalasi teng ahamiyatga ega · Sonlar ahamiyatsiz, faqat hissiyot muhim
4. Ustuvorlik (prioritet) formulasi qanday hisoblanadi? Faqat chastota — ko'p aytilgani birinchi · Faqat ta'sir — kam aytilsa ham og'riqli bo'lsa birinchi · ✔ Chastota × ta'sir — ikkalasi birga hisoblanadi · Fikr kelgan tartib bo'yicha — birinchi kelgan birinchi
5. Voronkada (funnel) eng katta yo'qotish qayerda ko'rinadi? Foydalanuvchi soni eng ko'p bo'lgan qadamda · ✔ Bir qadamdan ikkinchisiga o'tishda odam soni eng ko'p kamaygan joyda · Botning javob tezligi eng past bo'lgan joyda · Eng ko'p maqtov kelgan qadamda
6. Menyu tugmasi tuzatilgach, 60 kishidan 15 tasi ketib qoldi. Bu nimani bildiradi? Tuzatish ishlamadi — hali ham hammasi ketib qolyapti · Sonlar tasodifiy — hech narsa xulosa qilib bo'lmaydi · Endi yana yangi bug paydo bo'ldi · ✔ Tuzatish ishladi — muammo sezilarli kamaydi
7. «Bot ahmoq» sharhiga alohida javob yozish nega eng ta'sirli tuzatish emas? ✔ Chunki aniq muammo ko'rsatilmagan — nimani tuzatishni bilib bo'lmaydi · Chunki bu sharh juda uzun · Chunki foydalanuvchi noto'g'ri yozgan · Chunki bunday sharh hech qachon kelmaydi
8. 100 dan 1 tasi juda o'ziga xos, faqat unga kerakli narsa so'radi. Nima qilish kerak? Darrov qo'shish — har so'rov bajarilishi shart · Foydalanuvchini bloklash · ✔ Ko'pchilikka foyda beradiganga ustuvorlik berib, tor so'rovga «hozir emas» deyish · Hech qanday tartibsiz, navbat bilan qo'shish
9. Tuzatishdan keyin nima qilish kerak? Hech narsa — tuzatish har doim ishlaydi deb ishonish kerak · ✔ Qayta o'lchash — o'sha shikoyat kamaydimi tekshirish · Darhol yana boshqa katta o'zgarish qilish · Fikr yig'ishni to'xtatish, chunki hammasi tuzatildi
10. Mahsulot qachon «tayyor» bo'ladi? ✔ Hech qachon — u doim yaxshilanadi (iteratsiya) · Birinchi versiyada — keyin o'zgartirish shart emas · Faqat testlar 100% o'tganda · Mijozlar hech qachon shikoyat qilmaganda
11. Noaniq fikr («menyu chalkash») bilan aniq o'zgarish o'rtasidagi farq nima? Farqi yo'q, ikkalasi ham bir xil ishlatiladi · Noaniq fikr har doim yolg'on bo'ladi · Aniq o'zgarish faqat dasturchiga kerak, fikr kerak emas · ✔ Aniq o'zgarish AI bajara oladigan konkret vazifa, noaniq fikr esa shunchaki shikoyat
12. Maqtovni («tez va qulay, rahmat!») nima uchun e'tiborsiz qoldirmaslik kerak? Chunki maqtovni har doim tuzatish kerak · Chunki maqtov ko'pchilik uchun muhim emas · ✔ Chunki u nima yaxshi ishlayotganini ko'rsatadi — tuzatishda uni buzib qo'ymaslik kerak · Chunki maqtov har doim yolg'on bo'ladi

Arena shablon yozuvlari (umumiy): SAVOL · SONIYA · Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar 🔥 bonus beradi! · ▶ Boshlash · Adashdingiz — 0 ball. Keyingisida olasiz! 💪 · 🏆 Test yakunlandi! · eng uzun streak · ↻ Qayta ishlash · Arenani yopish

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **7-ekran, voronka mantig'i:** hisob-kitob 100 (/start bosdi) → 40 (Menyuni ochdi) — ya'ni 60 kishi menyuni OCHMASDAN ketgan (menyu tugmasini topolmagan). Matn esa «60 kishi menyuni ochgandan keyin ketib qolgan» (4-bosqich) va «hali ham 60 kishi menyudan keyin ketib qolyapti» (xato oqibat) deydi — son va gap bir-biriga zid.
- **Ekranlar orasidagi ziddiyat:** 9-ekranda v2 allaqachon «narxni ko'rsat» buyrug'i bilan chiqadi va xulosa «v2 da — bir marta, narx bilan» deydi (chatda 45 000). Lekin shu ekranning 4-qadami, 12-ekran va 13-ekran narxni keyingi aylana deb v3 da tuzatadi. Yana biri: 6-ekranda «Bot meni tushunmaydi» — aniq vazifaga aylanadigan fikr, 7-ekranda esa shunga o'xshash «Bot ba'zan tushunarsiz javob beradi» ⚪ foydasiz savatga tushadi.
- **0-ekran:** qaysi variant tanlansa ham (hatto «Hech narsa…» yoki «Hammasini darrov noldan qayta yozaman») javob «Aynan!» bilan boshlanadi.
- **15-ekran (final):** Mentor javob tartibini to'liq aytib qo'yadi: «tinglaysiz, guruhlaysiz, ustuvor tanlaysiz, tuzatasiz — va yana tinglaysiz». 7-ekrandagi yakun gapi ham xuddi shu tartibni beradi.
- **To'g'ri javob uzunligi bilan «sotilib» qolgan testlar:** 10-ekran (✔ 104 belgi, qolganlari 49–70) va 14-ekran (✔ 92, qolganlari 45–60) — to'g'ri javob boshqalardan ancha uzun. 8-ekranda ✔ variantda darsning kalit formulasi «chastota × ta'sir» turibdi, boshqa variantlarda yo'q. Arenada 12 savoldan 8 tasida (1, 2, 3, 5, 7, 8, 11, 12) ✔ eng uzun variant.
- **«daftar» taqiqlangan so'z** — darsning markaziy buyumi «📔 Tilaklar daftari» (1, 7, 16, 19-ekran, eyebrow, nav tugmasi «Daftarni oxirigacha o'qing», jihozlar paneli) va panelda «Holat daftari». Bitta narsaning bir necha nomi ham bor: 1-ekranda «mehmonlar kitobi» va «restoran egasi», boshqa joylarda «tilaklar daftari» va «direktor» (2, 6, 10, 11-ekran, RECAPS); AI esa «Maslahatchi (AI)» (6, 9, 13-ekran) va «AI yordamchi» (1-ekran paneli, 11-kartochka).
- **Izohsiz so'zlar:** «iteratsiya» 0-ekranda birinchi marta izohsiz keladi (MATN_ETALONI: «yaxshilash aylanasi» glossi bilan ochilsin; bu gloss faqat 1-ekrandagi 4-qadamda bilvosita bor). Inglizcha: «fix» (12-ekran «fix ishladi», 14-ekran ✔ variant), «scope shishishi» (10-ekran izohi, 11-ekran, RECAPS 3), «pattern» (5-ekran eyebrow va sarlavhada, «ko'pchilik» gloss faqat 11-ekranda), «v1/v2/v3», «streak», «Badges», nishon nomlari. Kantselyarit: arena 2-savol variant «salbiy fikr hisoblanadi».
- **1- va 8-dars bilan bog'lanish:** 1-darsda «signal» = botga kelgan xabar/buyruq; bu darsda «signal» = fikr-belgisi (2-ekran «eng aniq signal», 4-ekran izohi, RECAPS 1 sarlavhasi, 3-kartochka, «Signal Finder»). 3-ekran («Yoqdimi?» / «Qayerda qiynaldingiz?») 8-dars (PM, `PmLesson20.jsx` — «Botim yoqdimi?» savoli) mavzusini takrorlaydi. 1-ekran Mentori esa «oldingi darslar»da faqat o'zingiz test qilganingizni eslatadi, 8-darsga bog'lanmaydi.
