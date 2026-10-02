# 6-Modul (LMS: 8-Modul) · 5-dars «Claude Skills — nima» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/ClaudeSkillsLesson.jsx` · 20 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook (0-ekran):** o'quvchi AI'dan «mahsulot tavsifi yoz» deb ikki marta so'raydi — biri uzun, biri quruq chiqadi. Keyin «AI'ni har safar bir xil ishlatish-chi?» savoliga javob tanlaydi → Skill = bir marta yoziladigan yozma yo'riqnoma.
- **Markaziy o'yin (7-ekran):** «qahramon» (AI) avval kartasiz sinaladi (o'rtacha javob), keyin uch kartadan vazifaga mos «super-kuch kartasi»ni jihozlaydi → natija standartga tushadi.
- **Asosiy metafora:** ikki qatlam — boshida «AI uchun yozma yo'riqnoma / qo'llanma» (xodimga qo'llanma, musiqachiga nota), 4-ekrandan boshlab «super-kuch kartasi» (qahramon, kartani jihozlash, «kuch yonadi»). Butun dars bitta tayyor skill ustida: mini-do'kon uchun `mahsulot-tavsifi` (SKILL.md).
- **Yakun:** karta ishlash oqimini 5 bo'lakdan sudrab yig'ish (Vazifa → description mos → Karta yuklanadi → Amal → Izchil natija), keyin o'z kartasini rejalashtirish amaliyoti, podium, 12 kartochka, xulosa.

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — har safar boshqacha | hook | ikki marta so'rab ko'radi, yechim variantini tanlaydi | — |
| 1 | Reja | qoida | tayyor SKILL.md + bugungi 4 qadamni ko'radi | — |
| 2 | Skill — yozma yo'riqnoma | tushuncha | «Hayotdan misol?» bosadi (musiqachi / xodim / AI) | — |
| 3 | SKILL.md tuzilishi | tushuncha | Frontmatter / description / Body qismlarini bosib ochadi | — |
| 4 | 1-savol | test | Skill AI xulqini qanday o'zgartiradi | ✅ |
| 5 | description | tushuncha | «Description nega muhim?» bosadi | — |
| 6 | Body | tushuncha | «Nega bunday aniq?» bosadi | — |
| 7 | Kartani jihozlash | markaziy o'yin | kartasiz sinaydi → 3 kartadan mosini tanlaydi | — (nishon) |
| 8 | 2-savol | test | description nima uchun | ✅ |
| 9 | Skill vs system prompt | case | «Skill-chi?» bosib farqni ko'radi | — |
| 10 | 3-savol | test | body qachon ochiladi | ✅ |
| 11 | Faqat kerakli skill ochiladi | tushuncha | vazifa yuboradi — javondan bitta skill ochiladi | — |
| 12 | Skillni tahlil | case | 3 mezon bo'yicha tekshiradi | — |
| 13 | Kuch qaysi vaziyatda yonadi | amaliyot | 3 vazifadan kartaga mosini tanlaydi | — (nishon) |
| 14 | 4-savol | test | takror vazifaga eng yaxshi yechim | ✅ |
| 15 | Oqimni yig'ing | yakuniy | 5 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 16 | Amaliyot · reja | praktika | o'z SKILL.md rejasini yozadi, «Bajardim» | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 xulosa + uyga vazifa + arena | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta; nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
Skill · yozma yo'riqnoma / qo'llanma · super-kuch kartasi · qahramon (AI) · kartani jihozlash · kuch / karta yonadi ·
SKILL.md · frontmatter (pasport) · name · description («qachon yonadi») · body (yo'riqnoma: qadamlar + misol) ·
progressive disclosure (bosqichma-bosqich ochilish) · yuklanadi / ochiladi · izchil natija · «sizning usulingizda / standartingizda» ·
arzon · skilllar javoni · system prompt (doimiy shaxs) · takrorlanuvchi vazifa · mahsulot-tavsifi · trigger

---

## 0 · Kirish — har safar boshqacha  `[742]`
- Eyebrow: Dars · kirish
- Sarlavha: **AI'dan «mahsulot tavsifi yoz» dedingiz. Har safar boshqacha chiqyapti. Nega?**
- Mentor: AI maslahatchini o'tgan darsda ko'rdik. Lekin uni har doim SIZNING usulingizda ishlatish — alohida mahorat. Tugmani bosing — muammoni ko'ring.
- Blok: ❌ Yo'riqnomasiz — har safar har xil
  - (bosilgach) 1-marta: «Bu ajoyib mahsulot bo'lib, sizga juda yoqadi va...» (uzun)
  - 2-marta: «Hamyon. Narxi 120000.» (quruq)
- Tugma: ▶ Ikki marta so'rab ko'rish → ✓ Muammoni ko'rdingiz
- Savol: **AI'ni har safar bir xil ishlatish-chi?** (tugma bosilmaguncha xira)
  - Har safar uzun ko'rsatma yozib beraman — boshqa yo'li yo'q
  - Bir marta yozma yo'riqnoma (Skill) beraman — har safar shunga amal qiladi
  - Iloji yo'q — AI har doim har xil ishlaydi
- Javobdan keyin (qaysi variant tanlansa ham): Aynan! **Claude Skill** — AI'ga bergan yozma yo'riqnoma (qo'llanma). Bir marta yozasiz — AI har safar aynan shunga amal qiladi. Bugun tayyor skillni o'qib, tahlil qilamiz.
- Tugma: Davom etish

## 1 · Reja  `[784]`
- Eyebrow: Reja
- Sarlavha: **AI'ga qo'llanma beramiz: Claude Skill.**
- Mentor: Skill — bu zamonaviy va juda foydali narsa. Siz AI-ishchingizga bir marta aniq **yozma yo'riqnoma** berasiz, u esa har safar shunga amal qiladi. Bugun tayyorini o'qib, qanday tuzilganini tahlil qilamiz.
- Yorliq: dars davomida — shu skillni o'qiymiz
- SKILL.md (fayl ko'rinishida, darsda bir necha marta takrorlanadi):
  ```
  ---
  name: mahsulot-tavsifi
  description: Mini-do'kon mahsulotlari uchun qisqa sotuvchi tavsif yozish. Mahsulot nomi berilganda ishlatiladi.
  ---

  # Mahsulot tavsifi yozish
  1. Aniq 3 jumla yoz.
  2. Iliq, do'stona ohang, 1 ta emoji.
  3. Materiali / asosiy ustunligini ayt.
  4. Narxni eslat.
  5. Oxirida: "Savatga qo'shing!"

  Misol: "Yengil charm hamyon 👜 Kundalik uchun ideal.
  Atigi 120 000 so'm — Savatga qo'shing!"
  ```
- Bugungi 4 qadam:
  1. Skill nima — AI uchun yozma yo'riqnoma · *tushuncha*
  2. SKILL.md tuzilishi: frontmatter + body · *struktura*
  3. Skill AI xulqini qanday o'zgartiradi · *xulq*
  4. Tayyor skillni o'qish va tahlil qilish · *tahlil*
- Tugmalar (mobil): 4 qadamni ko'rish / ↩ Skillni ko'rish · Boshlaymiz →

## 2 · Skill — yozma yo'riqnoma  `[819]`
- Eyebrow: Tushuncha · skill
- Sarlavha: **Skill — AI uchun yozma yo'riqnoma.**
- Mentor: Yangi xodimni tasavvur qiling: unga «bizda ishlar shunday qilinadi» degan qo'llanma berasiz. Skill — aynan shu, lekin AI uchun. Bir marta yozasiz, qayta-qayta ishlatasiz. Tugmani bosing.
- Blok: 📋 **Skill nima?** — Bitta papkadagi `SKILL.md` fayl — AI'ga muayyan vazifani sizning usulingizda qanday bajarishni o'rgatadigan yo'riqnoma (va kerak bo'lsa, qo'shimcha fayllar).
- Tugma: Hayotdan misol? → ✓ Ko'rdingiz
- Kartalar (bosilgach):
  - 🎵 **Musiqachiga:** nota varag'i — har safar bir xil kuy chiqadi
  - 🧑‍💼 **Xodimga:** ish qo'llanmasi — «bizda shunday qilinadi»
  - 🤖 **AI'ga:** Skill — vazifani sizning usulingizda bajarish yo'riqnomasi
- Xulosa: Farqi: prompt — bir martalik gap; Skill — saqlanadigan, qayta ishlatiladigan yo'riqnoma. Endi uning ichini ochamiz.
- Tugma: Misolni ko'ring → Davom etish

## 3 · SKILL.md tuzilishi  `[853]`
- Eyebrow: Struktura · SKILL.md
- Sarlavha: **Tayyor skillni o'qiymiz: 3 qismi bor.**
- Mentor: Mana mini-do'kon uchun haqiqiy skill. Ikki qismdan iborat: **frontmatter** (pasport) va **body** (yo'riqnoma). Har qismni bosib, vazifasini oching.
- Chap: SKILL.md (1-ekrandagi fayl)
- Tugmalar-qismlar (bosib ochiladi):
  - **Frontmatter** `--- name / description ---` — Skillning «pasporti» — yuqoridagi --- orasidagi qism. Claude buni DOIM ko'radi.
  - **description** `description: ...` — Skill NIMA qiladi va QACHON ishlatiladi. Eng muhim qator — Claude shunga qarab skillni tanlaydi.
  - **Body (yo'riqnoma)** `# qadamlar + misol` — AI bajaradigan aniq qadamlar va misol. Faqat skill ishlatilganda to'liq yuklanadi.
- Xulosa: Oddiy matn fayl — lekin kuchli. Frontmatter Claude'ga «bu nima» deydi, body esa «qanday qilish»ni.
- Tugma: 3 qismni oching (0/3) → Davom etish

## 4 · 1-savol ✅  `[1068]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Skill AI xulqini qanday o'zgartiradi?**
  - AI'ni shunchaki tezroq ishlashga majbur qiladi
  - AI modelini kuchliroq modelga almashtiradi
  - AI'ni internetga ulab, yangi ma'lumot beradi
  - ✔ Super-kuch kartasini beradi — AI izchil, maxsus harakat qiladi
- To'g'ri: To'g'ri! Skill — bu super-kuch kartasi: aniq vaziyatda aniq harakat yo'riqnomasi. Vazifa unga mos kelsa, Claude karta ko'rsatmalarini o'qiydi va aynan shu bo'yicha ishlaydi — natija izchil va sizning usulingizda chiqadi.
- Xato izohlari:
  - Skill tezlik haqida emas — u xulqni (qanday bajarishni) aniqlashtiradi.
  - Skill modelni almashtirmaydi — u o'sha qahramonga aniq super-kuch kartasini beradi.
  - Internet bilan bog'liq emas — Skill bu yozma yo'riqnoma (karta).
  - (umumiy) Skill AI'ga aniq yo'riqnoma — super-kuch kartasini — yuklaydi.

## 5 · description — eng muhim qator  `[888]`
- Eyebrow: Frontmatter · description
- Sarlavha: **`description` — skillning eng muhim qatori.**
- Mentor: Claude'da o'nlab skill bo'lishi mumkin. U qaysi birini ishlatishni qayerdan biladi? Aynan **description**dan. Tugmani bosing.
- Karta «description»: Mini-do'kon mahsulotlari uchun qisqa sotuvchi tavsif yozish. Mahsulot nomi berilganda ishlatiladi.
- Tugma: Description nega muhim? → ✓ Ko'rdingiz
- Bosilgach:
  - 🔍 **Qachon:** «mahsulot nomi berilganda» — Claude shunga qarab bu skillni tanlaydi.
  - 💡 PROGRESSIVE DISCLOSURE (bosqichma-bosqich ochilish) — Claude DOIM faqat skill nomi va description'ini ko'radi (arzon). To'liq body esa faqat vazifa mos kelganda yuklanadi. Shuning uchun description aniq bo'lishi shart.
- Xulosa: Noaniq description → Claude skillni ishlatmaydi yoki noto'g'ri ishlatadi. Aniq description → to'g'ri vaqtda ishga tushadi.
- Tugma: Nega muhim? → Davom etish

## 6 · Body — aniq qadamlar  `[921]`
- Eyebrow: Body · yo'riqnoma
- Sarlavha: **Body — AI bajaradigan aniq qadamlar.**
- Mentor: Body — skillning asosiy qismi: aniq, qadam-baqadam ko'rsatma + misol. Qancha aniq bo'lsa — natija shuncha izchil chiqadi. Tugmani bosing.
- Fayl «SKILL.md (body)»:
  ```
  # Mahsulot tavsifi yozish
  1. Aniq 3 jumla yoz.
  2. Iliq ohang, 1 ta emoji.
  3. Materiali / ustunligini ayt.
  4. Narxni eslat.
  5. "Savatga qo'shing!" bilan yakunla.
  ```
- Tugma: Nega bunday aniq? → ✓ Ko'rdingiz
- Bosilgach:
  - 🔢 **Raqamlangan qadamlar:** AI ularni aniq bajaradi — hech narsa tashlab ketmaydi.
  - ✨ **Misol:** body oxiridagi namuna — AI uchun eng kuchli ko'rsatma (taqlid qiladi).
- Xulosa: Noaniq body («yaxshi tavsif yoz») → har xil natija. Aniq qadamlar + misol → izchil natija.
- Tugma: Qadamlarni o'qing → Davom etish

## 7 · Kartani jihozlash (markaziy o'yin)  `[1094]`
- Eyebrow: Markaziy · kartani jihozlash
- Sarlavha: **Qahramonni kartasiz sinang, keyin kartani jihozlang.**
- Mentor: AI — ko'p narsani biladigan qahramon, lekin kartasiz javobi «o'rtacha» chiqadi. Avval kartasiz sinab ko'ring, so'ng vazifaga MOS super-kuch kartasini jihozlang.
- Vazifa: «Charm hamyon uchun sotuvchi tavsif yoz»
- Blok: ❌ Kartasiz — o'rtacha javob → (bosilgach) «Bu yuqori sifatli charm hamyon zamonaviy dizayni bilan ajralib turadi va uzoq muddat xizmat qiladi...» (uzun, quruq, narxsiz)
- Tugma: ▶ Kartasiz sinab ko'rish → ✓ Kartasiz sinadingiz
- Yorliq: vazifaga mos kartani jihozlang
  - ✔ mahsulot-tavsifi kartasi
  - mijoz-xati kartasi
  - hisobot-sql kartasi
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / (xatodan keyin) Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Xato karta: Bu karta bu vazifaga mos emas — uning description'i boshqa ishga yonadi. Vazifa «mahsulot tavsifi» — mos kartani tanlang.
- To'g'ri: ✅ **Karta bilan — aniq, maxsus harakat** — «Yengil va pishiq charm hamyon 👜 Kundalik uchun ideal. Atigi 120 000 so'm — Savatga qo'shing!» Bir xil qahramon, bir xil vazifa — lekin karta natijani sizning standartingizga soldi.
- Tugma: Avval kartasiz sinang → To'g'ri kartani jihozlang → Davom etish

## 8 · 2-savol ✅  `[1151]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **SKILL.md'dagi `description` nima uchun?**
  - ✔ Claude shu kartani qachon ishlatishni biladi — vazifa mos kelsa yonadi
  - Skillni chiroyli va bezakli ko'rsatish uchun
  - Faqat odam o'qishi uchun — Claude uni umuman ko'rmaydi
  - AI modelini (kuchliroq/kuchsizroq) tanlash uchun
- To'g'ri: To'g'ri! description — kartaning «qachon yonadi» maydoni. Claude DOIM uni ko'radi va vazifa unga mos kelsa, kartani ishga soladi. Noaniq description → kuch noto'g'ri paytda yonadi yoki umuman yonmaydi.
- Xato izohlari:
  - description bezak emas — u Claude uchun «qachon ishlat» signali (trigger).
  - Aksincha — Claude description'ni doim o'qiydi; aynan shunga qarab kartani tanlaydi.
  - description model tanlamaydi — u kuch qachon yonishini belgilaydi.
  - (umumiy) description — Claude qachon kartani ishlatishini bildiradi.

## 9 · Skill vs system prompt (case)  `[961]`
- Eyebrow: Farq · skill vs system
- Sarlavha: **Skill — system prompt'dan farqi?**
- Mentor: Modul 8'da system prompt'ni ko'rdik (botning doimiy shaxsi). Skill biroz boshqacha — kerak bo'lganda yuklanadigan maxsus yo'riqnoma. Tugmani bosing.
- Blok «system prompt»: Doimiy shaxs/ohang — har bir javobda yoqilgan turadi. «Sen samimiy yordamchisan.»
- Tugma: Skill-chi? → ✓ Ko'rdingiz
- Bosilgach 📋 SKILL: Aniq VAZIFAGA maxsus yo'riqnoma — faqat o'sha vazifa kelganda yuklanadi. Ko'p skill bo'lishi mumkin; har biri o'z ishi uchun.
- Xulosa: Sodda: **system prompt — kim u (doimiy); skill — muayyan vazifani qanday qilish (kerakda).** Ikkalasi birga ishlaydi.
- Tugma: Farqni ko'ring → Davom etish

## 10 · 3-savol ✅  `[1171]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Kartaning to'liq kuchi (body) qachon ochiladi?**
  - Har bir so'rovda, doim — hamma karta to'liq ochiq turadi
  - Faqat tunda yoki maxsus vaqtda
  - ✔ Vazifa uning description'iga mos kelganda — kuch faqat kerakli paytda yonadi
  - Hech qachon — Claude faqat karta nomini ko'radi, ichini emas
- To'g'ri: To'g'ri! Bu — progressive disclosure. Claude doim faqat nom + description'ni ko'radi (arzon). To'liq body (kuch) esa faqat vazifa o'sha kartaga mos kelganda ochiladi. Shuning uchun yuzlab karta bo'lsa ham tizim tez ishlaydi.
- Xato izohlari:
  - Har so'rovda barcha kartalarni to'liq ochish — bekorga sekin va qimmat. Faqat mos kelgani ochiladi.
  - Vaqt bilan bog'liq emas — mos kelish (description) bilan bog'liq.
  - body ham o'qiladi — lekin faqat vazifa mos kelganda. Aks holda karta foydasiz bo'lardi.
  - (umumiy) body vazifa description'ga mos kelganda yuklanadi.

## 11 · Faqat kerakli skill ochiladi  `[991]`
- Eyebrow: Animatsiya · yuklanish
- Sarlavha: **Claude faqat kerakli skillni ochadi.**
- Mentor: Claude'da uchta skill bor. U doim faqat ularning nomi va description'ini ko'radi (arzon). Vazifa kelganda — faqat mos skill to'liq **ochiladi**. Tugmani bosing.
- Vazifa: 📩 Vazifa: **«Charm hamyon uchun tavsif yoz»**
- Tugma: ▶ Vazifani yuborish → ✓ Skill yuklandi
- Yorliq: Claude'dagi skilllar javoni
  - 📄/📂 `mahsulot-tavsifi` — mahsulot tavsifi yozish · ▸ 3 jumla, iliq ohang, narx, «Savatga qo'shing!» · (bosilgach) yuklandi ✓
  - 📄 `mijoz-xati` — mijozga rasmiy email yozish (xiralashadi)
  - 📄 `hisobot-sql` — sotuv hisoboti uchun SQL yozish (xiralashadi)
- Xulosa: Faqat **mahsulot-tavsifi** ochildi (description mos keldi). Qolganlari yopiq qoldi. Shuning uchun yuzlab skill bo'lsa ham — tez va arzon.
- Tugma: Vazifani yuboring → Davom etish

## 12 · Skillni tahlil (case)  `[1032]`
- Eyebrow: Hayotiy · skillni tahlil
- Sarlavha: **Bu skill yaxshimi? O'zingiz tahlil qiling.**
- Mentor: Yaxshi skillni yomonidan ajratish — muhim mahorat (keyingi darsda o'zingiz yozasiz). Mana mini-do'kon skilli. 3 mezon bo'yicha tekshiring.
- Chap: SKILL.md (1-ekrandagi fayl)
- Mezon-tugmalar (bosib ochiladi):
  - **description aniqmi?** — Ha — «mahsulot tavsifi yozish, mahsulot nomi berilganda» aniq aytadi qachon ishlatishni. Claude adashmaydi.
  - **Qadamlar aniqmi?** — Ha — 3 jumla, ohang, narx, yakun. AI taxmin qilmaydi — aniq bajaradi.
  - **Misol bormi?** — Ha — bitta tayyor misol. Misol AI uchun eng kuchli yo'riqnoma: u shunga taqlid qiladi.
- Xulosa: Yaxshi skill = aniq description + aniq qadamlar + misol. Bu uchtasi bo'lsa — AI uni xatosiz bajaradi. Keyingi darsda o'zingiz shunday yozasiz.
- Tugma: Tahlil qiling (0/3) → Davom etish

## 13 · Kuch qaysi vaziyatda yonadi  `[1197]`
- Eyebrow: Amaliy · to'g'ri trigger
- Sarlavha: **Kuch qaysi vaziyatda yonadi?**
- Mentor: Karta description'i «mahsulot tavsifi yozish, mahsulot nomi berilganda» deydi. Uch vazifadan qaysi biriga aynan shu karta yonishi kerak? description'ga qarab tanlang.
- Karta: 🎴 karta: mahsulot-tavsifi · description — Mini-do'kon mahsuloti uchun qisqa sotuvchi tavsif yozish. Mahsulot nomi berilganda ishlatiladi.
- Variantlar:
  - «Mijozga rasmiy uzr xati yoz» → Bu — xat vazifasi; mahsulot-tavsifi kartasi bunga yonmaydi. description mos kelmasa — karta yonmaydi.
  - ✔ «Yangi krossovka uchun sotuvchi tavsif yoz»
  - «Sotuv hisobotini SQL'da chiqar» → Bu — hisobot/SQL vazifasi; boshqa karta kerak. description mos kelmasa — karta yonmaydi.
- Nishon qoidasi: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. / Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- To'g'ri: ✅ To'g'ri! description «mahsulot tavsifi»ga mos vazifada karta yonadi. Aniq description = kuch aynan kerakli paytda ishga tushadi.
- Tugma: Kuch qaysi vaziyatda yonadi? → Davom etish

## 14 · 4-savol ✅  `[1239]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Bir xil vazifani AI'ga qayta-qayta tushuntirayapsiz. Eng yaxshi yechim?**
  - Har safar yana qo'lda, boshidan tushuntiraveraman
  - AI'dan bu vazifada butunlay voz kechaman
  - Kuchliroq (qimmatroq) AI modelini sotib olaman
  - ✔ Super-kuch kartasi (SKILL.md) yozaman — AI shunga amal qiladi
- To'g'ri: To'g'ri! Takrorlanuvchi vazifa — Skill uchun mukammal nomzod. Yo'riqnomani bir marta kartaga yozasiz, keyin AI har safar shunga amal qiladi. Vaqt tejaladi va natija izchil bo'ladi.
- Xato izohlari:
  - Qo'lda qayta-qayta tushuntirish — vaqt isrofi va natija har xil. Karta aynan shu muammoni yechadi.
  - Voz kechish — yechim emas. Karta bilan AI aynan sizga kerakli ishni qiladi.
  - Muammo model kuchida emas — sizga izchillik kerak. Buni karta beradi.
  - (umumiy) Takrorlanuvchi vazifaga — super-kuch kartasi (Skill) yozish.

## 15 · Oqimni yig'ing ✅ (final)  `[1259]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: karta qanday ishga tushishini to'g'ri tartibda yig'ing.**
- Mentor: Vazifa kelganda karta qanday yonadi? Bo'laklarni sudrab to'g'ri tartibga joylang: vazifa keladi → description mos → karta yuklanadi → yo'riqnomaga amal → izchil natija.
- Bo'laklar: Vazifa keladi · description mos · Skill yuklanadi · Yo'riqnomaga amal · Izchil natija
- Uyachalar: birinchi nima bo'ladi · keyin nima tekshiriladi · keyin nima ochiladi · keyin nima bajariladi · eng oxiri natija
- Hovuz bo'shab, tartib xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring va qayta joylang · ⚠️ Tartib xato — qayta joylang. · Tartib xato — bo'lakni bosib qaytaring va qaytadan joylang.
- To'g'ri (bo'lak ostida): ✓ To'g'ri: Vazifa → description mos → Karta yuklanadi → Amal → Izchil natija.
- Yakun bloki: ✓ Oqim tayyor: **Vazifa → description mos → Karta yuklanadi → Amal → Izchil natija**. Mana Claude Skill ishlash mexanizmi.
- Havola (xato bo'lgan bo'lsa): 📖 Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: Oqimni yig'ing → Davom etish

## 16 · Amaliyot · reja  `[2151]`
- Eyebrow: Amaliyot · reja
- Sarlavha: **O'z super-kuch kartangizni rejalashtiring**
- Mentor: Bu topshiriqni **o'z kompyuteringizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: Kundalik takrorlanadigan bitta vazifangizni tanlang va unga super-kuch kartasi (SKILL.md) rejasini yozing. Hali dasturlamaysiz — faqat kartaning maydonlarini rejalashtirasiz.
- Bosqichlar — belgilab boring:
  1. Takrorlanadigan bitta vazifani tanlang (masalan: qisqa mahsulot tavsifi yozish)
  2. Kartaga `name` bering — qisqa, aniq nom
  3. `description` yozing — karta NIMA qiladi va QACHON yonadi (eng muhim qator)
  4. Body: 3-5 ta aniq qadam yozing (AI ketma-ket bajaradigan)
  5. Oxiriga bitta tayyor MISOL qo'shing — AI shunga taqlid qiladi
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.» · Avval bajaring → Davom etish

## 17 · Natijalar (podium)  `[1897]`
- Sarlavha: **Kim g'olib?** · Natijalar
- Umumiy shablon: Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi. · Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz — N-o'rin (x/y to'g'ri) · 🏆 To'liq reyting

## 18 · Takrorlash (kartochkalar)  `[2179]`
- Eyebrow: Takrorlash · Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Claude Skill nima? | AI uchun yozma yo'riqnoma | AI'ga beriladigan super-kuch kartasi |
| Skill qaysi faylga yoziladi? | SKILL.md | Oddiy matn fayli — lekin kuchli |
| SKILL.md qaysi ikki qismdan iborat? | Frontmatter va body | Frontmatter — pasport, body — yo'riqnoma |
| Frontmatter faylning qayerida turadi? | Eng yuqorida, uchta chiziq orasida | Ichida name va description bo'ladi |
| Claude har doim nimani ko'rib turadi? | Skill nomi va description | Bu arzon: ikki qator, xolos |
| Karta qachon yonishini qaysi qator aytadi? | description | Skillning eng muhim qatori |
| Body ichida nima yozilgan bo'ladi? | Aniq qadamlar va bitta misol | Misol — AI taqlid qiladigan namuna |
| To'liq body qachon yuklanadi? | Vazifa description'ga mos kelganda | Qolgan kartalar yopiq qoladi |
| Faqat kerakli skill ochilishi qanday ataladi? | Progressive disclosure | Bosqichma-bosqich ochilish — tez va arzon |
| Skill oddiy so'rovdan nimasi bilan farq qiladi? | Saqlanadi va qayta ishlatiladi | So'rov — bir martalik gap |
| System prompt nima? | Botning doimiy shaxsi | Har javobda yoqiq turadi, skill esa kerak bo'lganda |
| Qanday vazifa Skill uchun eng mos? | Takrorlanuvchi vazifa | Bir marta yozasiz, har safar ishlatasiz |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 19 · Yakun  `[2192]`
- Eyebrow: Tayyor · Belgi: ✓ Skill o'qishni o'rgandingiz
- Sarlavha: **Endi AI'ga aniq super-kuch kartasini bera olasiz.**
- Endi siz bilasiz:
  - Skill — AI uchun yozma, qayta ishlatiladigan super-kuch kartasi (SKILL.md fayl)
  - Tuzilishi: frontmatter (name + description) + body (qadamlar + misol)
  - description — kuch qachon yonishini bildiradi (Claude doim ko'radi — eng muhim)
  - Progressive disclosure: to'liq body faqat vazifa mos kelganda ochiladi
  - Yaxshi karta = aniq description + aniq qadamlar + misol → izchil natija
- Uyga vazifa (tugma: Uyga vazifa · Amaliy topshiriqni bajarish →):
  - **O'qing** — internetdan yoki shu darsdan bitta SKILL.md ni o'qib chiqing
  - **Tahlil** — uning description aniqmi? qadamlari aniqmi? misoli bormi? — baholang
  - **Rejalashtiring** — o'z loyihangizda qaysi takrorlanuvchi vazifaga karta kerakligini yozing
- 🚀 Keyingi dars — o'z Skill'ingizni yozasiz: struktura, test va kontekst-injiniring bilan yaxshilash.
- ⏳ Mentorni kuting · 🏅 Nishonlaringiz — N/4 · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** 🎴 Power Card — Qahramonga to'g'ri kartani jihozladingiz (7) · ⚡ Right Trigger — Kuch qaysi vaziyatda yonishini to'g'ri tanladingiz (13) · 🔀 Before/After — Kartasiz va karta bilan farqni ko'rdingiz (7, bonus) · 🏆 Card Master — Skill ishlash oqimini to'g'ri tartibda yig'dingiz (15)
Nishon yozuvlari: 🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping. · Yangi nishon · bosib davom eting

**Qisqa takrorlash oynalari (5):**
1. Skill — super-kuch kartasi: Karta = aniq harakat (AI universal qahramon; Skill esa aniq vaziyatda aniq harakat beruvchi karta) · Yo'riqnoma yuklanadi (Vazifa mos kelsa, Claude karta yo'riqnomasini o'qib, aynan shu bo'yicha ishlaydi) · Natija izchil (Shuning uchun natija izchil va sizning usulingizda chiqadi) · savol: Skill oddiy so'rovdan (prompt) nimasi bilan farq qiladi?
2. description — qachon yonadi: Claude doim ko'radi (Claude DOIM faqat nom va description'ni ko'radi (arzon)) · Mos kelsa — yonadi (Vazifa description'ga mos kelsa, karta o'sha yerda ishga tushadi) · Aniq bo'lishi shart (Noaniq description → kuch noto'g'ri paytda yonadi yoki umuman yonmaydi) · savol: Nega description eng muhim qator?
3. Progressive disclosure: Faqat mos karta ochiladi (To'liq body faqat vazifa description'ga mos kelganda ochiladi) · Tez va arzon (Qolgan kartalar yopiq qoladi — yuzlab karta bo'lsa ham tizim tez ishlaydi) · Har safar hammasi emas (Har so'rovda barcha body'ni yuklash — bekorga sekin va qimmat bo'lardi) · savol: Body qachon yuklanadi?
4. Takror vazifa → karta: Bir marta yoz (Takrorlanuvchi vazifani bir marta kartaga yozasiz) · Har safar ishlat (Keyin AI har safar aynan shu kartaga amal qiladi) · Vaqt tejaladi (Qo'lda qayta-qayta tushuntirish — vaqt isrofi; karta buni yo'qotadi) · savol: Qanday vazifa Skill uchun eng mos?
5. Karta ishlash oqimi — tartib: Avval — vazifa (Birinchi qadam: vazifa keladi) · Keyin — mos va yuklash (description mos keladi, karta yuklanadi, so'ng AI amal qiladi) · Eng oxiri — natija (Izchil natija faqat amaldan keyin chiqadi) · sxema: 📩 Vazifa → 🔍 description mos → 📂 Karta → ✅ Amal → ✨ Natija · savol: Nega tartib muhim?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Claude Skill nima? Kuchliroq AI modelining nomi · Internetdan ma'lumot oladigan qidiruv · ✔ AI uchun yozma yo'riqnoma — super-kuch kartasi · Dasturning ikonka (belgi) fayli
2. SKILL.md qaysi ikki qismdan iborat? ✔ frontmatter (name + description) va body · Rasm, ovoz va video fayllari · Parol va foydalanuvchi nomi · Server va ma'lumotlar bazasi manzili
3. SKILL.md'dagi description nima uchun kerak? Skillni chiroyli ko'rsatish uchun · AI modelini almashtirish uchun · Faqat odam o'qishi uchun · ✔ Karta (kuch) qachon yonishini bildirish uchun
4. Skill body'sida odatda nima bo'ladi? Faqat skill nomi · ✔ Aniq qadamlar va bitta misol · Foydalanuvchi paroli · AI modelining versiyasi
5. Progressive disclosure nima? Barcha skill body'lari doim ochiq turadi · Skill faqat tunda ishlaydi · Skill AI'ni tezlashtiradi · ✔ To'liq body faqat vazifa mos kelganda ochiladi
6. Claude har doim nimani ko'rib turadi? ✔ Skill nomi va description'ini · Butun body'ni har safar · Foydalanuvchi tarixini · Boshqa barcha fayllarni
7. Skill oddiy so'rov (prompt)dan nimasi bilan farq qiladi? Skill faqat bir martalik gap · ✔ Skill saqlanadi va qayta ishlatiladi · Skill modelni kuchaytiradi · Skill internetga ulaydi
8. Yaxshi skillning belgisi qaysi? Uzun, chalkash va tushunarsiz matn · Faqat bitta so'zdan iborat bo'lishi · ✔ Aniq description + aniq qadamlar + misol · Chiroyli rangli bezaklar va emoji
9. Qanday vazifa Skill uchun eng mos? ✔ Takrorlanuvchi, bir xil bajariladigan vazifa · Bir martagina bo'ladigan tasodifiy ish · Faqat rasm chizish · Faqat o'yin o'ynash
10. Skill AI natijasiga qanday ta'sir qiladi? Natijani har safar tasodifiy qiladi · Hech qanday ta'sir qilmaydi · AI'ni sekinlashtiradi · ✔ Natijani izchil va standartingizda qiladi
11. System prompt va Skill farqi qaysi? Ikkalasi ham aynan bir xil narsa · System prompt faqat kechasi ishga tushadi · ✔ system prompt — doimiy shaxs; skill — kerakli yo'riqnoma · Skill — bu eng kuchliroq AI modelining nomi
12. Noaniq description qanday oqibatga olib keladi? Skill sezilarli darajada tezroq ishlaydi · ✔ Karta noto'g'ri paytda yonadi yoki yonmaydi · AI modeli o'zi o'zgarib qoladi · Internet aloqasi butunlay uziladi

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **3-ekran ichida qarama-qarshilik:** sarlavha «3 qismi bor», Mentor esa «Ikki qismdan iborat: frontmatter va body» deydi (kartochkada ham «ikki qism»)
- **Bitta narsaga ikki metafora:** 0–3, 5, 6, 9, 11, 12-ekranlarda «yozma yo'riqnoma / qo'llanma» (xodim, nota), 4, 7, 8, 10, 13–16, 19-ekranlarda «super-kuch kartasi · qahramon · jihozlash · kuch yonadi». «Super-kuch kartasi» birinchi marta 4-ekran testining to'g'ri javobida chiqadi, undan oldin tushuntirilmagan. AI yana «AI-ishchi» (1) va «xodim» (2) deb ham ataladi
- **To'g'ri javobi «sotilib» qolgan testlar:** 4-ekranda faqat to'g'ri javobda darsning o'z so'zi («super-kuch kartasi») bor va u eng uzun variant; 8 va 10-ekranlarda to'g'ri javob eng uzun va faqat unda «description / mos kelsa» bor; 14-ekranda faqat to'g'ri javobda «SKILL.md»; viktorina 1, 11-savolda ham shunday
- **Izohsiz inglizcha so'zlar:** «trigger» (8-ekran xato izohi, 13-ekran eyebrow «to'g'ri trigger»), «system prompt» (9, qisqa izoh qavsda), «frontmatter», «body», «description» (dars bo'yi inglizcha qoladi), «Farq · skill vs system» (9), viktorinada «streak», nishon nomlari inglizcha (Power Card, Right Trigger, Before/After, Card Master)
- **«arzon»** (5, 10, 11-ekranlar, kartochka) — nega arzon ekani va nima «pul» turishi aytilmagan; o'quvchi tushunmaydi
- **11-ekran eyebrow «Animatsiya · yuklanish»** — ichki ish-yorlig'i o'quvchi ekraniga chiqib qolgan
- **9-ekran «Modul 8'da system prompt'ni ko'rdik»** — o'quvchi uchun bu modul 6-Modul (LMS'da 8) — raqam chalkashishi mumkin; «muayyan» (2, 9) — kitobiy so'z
- **0-ekran:** qaysi variant tanlansa ham «Aynan!» chiqadi (hatto «Iloji yo'q — AI har doim har xil ishlaydi»); 17-ekran «Kim g'olib?» — lug'atda «Bugungi g'oliblarimiz» deb almashtirilgan
