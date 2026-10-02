# 6-Modul (LMS: 8-Modul) · 4-dars «AI-agent nima» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/AgentArchitectureLesson.jsx` · 20 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi

- **Hook (0-ekran):** «Shaharga kirdingiz» — bitta iltimos: «do'stimga sovg'a top, 200 minggacha, tez yetkazilsin». O'quvchi tugmani bosib ikki javobni solishtiradi: ma'lumot byurosi faqat variantlarni aytadi, detektiv-agent o'zi topib, band qilib, yetkazishni rasmiylashtiradi. Keyin «asosiy farq nimada?» deb tanlaydi.
- **Markaziy mexanika:** detektiv dvigateli — kuzat → xulosa → harakat sikli (5-ekran) va ruxsatnomalar (tool) orqali shahar idoralariga ulanish (6–7-ekran); keyin o'quvchi o'zi 4 vazifaga «byuro yoki detektiv» qarorini beradi (10-ekran) va yo'qolgan yuk case'ini qadam-baqadam kuzatadi (12-ekran).
- **Asosiy metafora:** shahar. Oddiy AI = ma'lumot byurosi (gapiradi), agent = detektiv (bajaradi), tool = ruxsatnoma, tizim qismlari = idoralar (arxiv = DB, ekspert = API, aloqa = xabar), cheklov = vakolat chegarasi (order/guardrail).
- **Yakun:** detektiv ish oqimini tartibda yig'ish (15-ekran, final) → loyihangizga agent loyihalash amaliyoti → podium → 12 kartochka → xulosa; keyingi dars — Claude Skills.

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — ikki xizmat | hook | ikki javobni ochadi, asosiy farqni tanlaydi | — |
| 1 | Reja | qoida | detektiv arxitekturada + bugungi 4 qadam | — |
| 2 | Byuro vs detektiv | tushuncha | 4 jihatni (Nima u? · Necha qadam? · Shahar bilan? · Qachon?) bosib solishtiradi | — |
| 3 | Bir vazifa, ikki yo'l | tushuncha | ikki yondashuvni ishga tushiradi: 1 qadam vs ko'p qadam | — |
| 4 | 1-savol | test | byuro so'rovga javoban nima qiladi | ✅ |
| 5 | Detektiv dvigateli | tushuncha | kuzat → xulosa → harakat bosqichlarini yoqadi | — |
| 6 | Ruxsatnoma nima | tushuncha | ruxsatnoma ta'rifi + 3 ruxsatnoma tizimga qanday ulanadi | — |
| 7 | Detektiv tizimda | tushuncha | 3 ruxsatnomani (Arxiv · Ekspert · Aloqa) bosib ochadi | — |
| 8 | 2-savol | test | detektiv shaharga qanday ta'sir qiladi | ✅ |
| 9 | Qachon detektiv | qoida | «byuro yetadi» vs «detektiv qachon kerak» | — |
| 10 | Byuro yoki detektiv | amaliyot | 4 vazifaga to'g'ri xizmatni tanlaydi | — |
| 11 | 3-savol | test | bitta manzilni ko'rsatish — byuro yoki detektiv | ✅ |
| 12 | Shahar detektivi | case | «yo'qolgan yuk» vazifasini 7 qadamda kuzatadi | — |
| 13 | Vakolat chegarasi | tushuncha | cheklangan ruxsatnoma + tasdiq; keyingi dars e'loni | — |
| 14 | 4-savol | test | agent arxitekturada qayerda yashaydi | ✅ |
| 15 | Detektiv oqimi | yakuniy | 5 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 16 | Amaliyot · dizayn | praktika | loyihasiga detektiv-agent loyihalaydi (5 bosqich) | — |
| 17 | Natijalar | podium | jonli reyting | — |
| 18 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 19 | Yakun | xulosa | 5 ta xulosa + uyga vazifa | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta; nishonlar — 4 ta.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
shahar · ma'lumot byurosi (oddiy AI) · detektiv / detektiv-agent (AI-agent) · maqsad / vazifa · qadam · sikl / aylana / dvigatel / oqim ·
kuzat → xulosa → harakat · ruxsatnoma (tool) · idora · arxiv (DB) · ekspert (API) · aloqa (xabar) · tizim komponenti · backend / frontend ·
fuqaro · vakolat chegarasi (order, guardrail) · ortiqcha murakkablik · avtonom

---

## 0 · Kirish — ikki xizmat  `[715]`
- Eyebrow: Dars · kirish
- Sarlavha: **Shaharga kirdingiz. Bitta iltimos: «do'stimga sovg'a top, 200 minggacha, tez yetkazilsin». Ikki xil *xizmat*.**
- Mentor: O'tgan darslarda AI maslahatchisini ko'rdik. Endi savol: AI tizimda qanday turlarda bo'ladi? Tugmani bosing — bir iltimosga ma'lumot byurosi va detektiv qanday javob berishini solishtiring.
- Karta 1: 💬 Ma'lumot byurosi (faqat javob) → (bosgach) «Mana mos variantlar: quloqchin (180k), powerbank (150k). O'zingiz tanlab buyurtma bering.»
- Karta 2: 🕵️ Detektiv-agent (ishni bajaradi) → (bosgach) «Topdim ✓ band qildim ✓ tez yetkazishni rasmiylashtirdim ✓ — 35 daqiqada yetkaziladi.»
- Tugma: ▶ Ikki javobni ko'rish → ✓ Solishtirildi
- Savol: **Asosiy farq nimada?** (tugma bosilmaguncha xira)
  - Detektiv chiroyliroq gapiradi
  - Detektiv o'zi qadamlar qo'yib, shahar idoralari bilan ishlab, ishni bajardi
  - Hech farqi yo'q — ikkalasi bir xil
- Javobdan keyin (qaysi variant tanlansa ham bir xil): Aynan! Ma'lumot byurosi — **maslahatchi** (faqat javob). **Detektiv-agent** — tizimning aqlli **komponenti**: o'zi qadamlar qo'yib, ruxsatnomalar (arxiv, aloqa) orqali ishni bajaradi. Bugun agentning arxitekturadagi o'rnini ko'ramiz.
- Tugma: Davom etish

## 1 · Reja  `[762]`
- Eyebrow: Reja
- Sarlavha: **Detektiv-agent — tizimning *aqlli komponenti*.**
- Mentor: Avvalgi darslarda AI'ni **ko'rdingiz**. Bugun boshqa savol — arxitektura savoli: agent tizimda **qayerda turadi**, oddiy AI'dan farqi nima va **qachon** uni tanlaysiz.
- Yorliq: dars oxirida — detektivni arxitekturada joylaysiz
- Sxema: 📁 Arxiv · 🔬 Ekspert · 📡 Aloqa ← 🕵️ Detektiv
- Blok: Detektiv-agent — backend ichidagi aqlli komponent. Ruxsatnomalar orqali tizimning boshqa qismlariga «qo'l» cho'zadi.
- Bugungi 4 qadam:
  1. Ma'lumot byurosi vs detektiv — tizim nuqtai nazaridan · *farq*
  2. Detektiv dvigateli: kuzat → xulosa → harakat · *sikl*
  3. Ruxsatnomalar — detektivni tizimga ulaydi (arxiv/ekspert/aloqa) · *ulanish*
  4. Qachon detektiv, qachon byuro; vakolat chegarasi · *qaror*
- Tugmalar (telefonda): 4 qadamni ko'rish / ↩ Natijani ko'rish · Boshlaymiz →

## 2 · Byuro vs detektiv  `[802]`
- Eyebrow: Tushuncha · farq
- Sarlavha: ***Ma'lumot byurosi* — gapiradi. *Detektiv* — bajaradi.**
- Mentor: Ma'lumot byurosi — call-markaz kabi: savol berasiz, javob oladi, tamom. Detektiv — tergovchi kabi: maqsad berasiz, u o'zi qadamlar qo'yib bajaradi. Har jihatni bosing.
- Jihatlar (bosilganda ikki karta: 💬 Ma'lumot byurosi · 🕵️ Detektiv):
  - **Nima u?** — byuro: ma'lumot byurosi — savol berasiz, javob oladi · detektiv: detektiv — maqsad berasiz, o'zi ishlaydi
  - **Necha qadam?** — byuro: bir martalik (savol → javob) · detektiv: ko'p qadam — maqsadga yetguncha yuradi
  - **Shahar bilan?** — byuro: shaharga chiqmaydi — faqat gapiradi · detektiv: ruxsatnomalar orqali idoralarga kiradi (arxiv, ekspert, aloqa)
  - **Qachon?** — byuro: oddiy, bir martalik ish (tarjima, manzil) · detektiv: ko'p qadamli maqsad (ishni boshdan-oxir hal qil)
- Xulosa (4/4 dan keyin): Bir jumla: **byuro gapiradi (bir marta), detektiv ishni qiladi (sikl + ruxsatnomalar).** Ikkalasi ham foydali — har biri o'z o'rnida.
- Tugma: 4 farqni ko'ring (0/4) → Davom etish

## 3 · Bir vazifa, ikki yo'l  `[838]`
- Eyebrow: Animatsiya · bir vazifa, ikki yo'l
- Sarlavha: **Bitta vazifa — byuro *1 qadam*, detektiv *ko'p qadam*.**
- Mentor: Mana vizual farq: byuro bitta javob qaytaradi va to'xtaydi. Detektiv esa sikl bo'ylab bir nechta amal qiladi — shahar idoralari orqali ishga ta'sir o'tkazadi. Tugmani bosing.
- Tugma: ▶ Ikki yondashuvni ishga tushir → ✓ Ko'rsatildi
- Chap: 💬 Byuro — bir qadam · (bosilmaguncha) «Tugmani bosing →» · (bosgach) «Mana variantlar: …» → tugadi. · belgi: 1 qadam · faqat matn
- O'ng: 🕵️ Detektiv — sikl + ruxsatnomalar · belgi: ↻ loop
  - amal 1 — Arxivni tekshirdi — mos yozuv bormi?
  - amal 2 — Kerakli idoraga bordi va band qildi
  - amal 3 — Aloqa idorasidan tez yetkazishni rasmiylashtirdi
  - tayyor — Maqsad bajarildi
- Xulosa: Detektiv 3 ta amal qildi va tizimga ta'sir o'tkazdi. Byuro esa faqat gapirdi. Mana arxitektura farqi.
- Tugma: Farqni ko'ring → Davom etish

## 4 · 1-savol ✅  `[882]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Ma'lumot byurosi (agent emas) so'rovga javoban nima *qiladi*?**
  - Shahar bo'ylab yurib, idoralarga kirib ishni bajaradi
  - ✔ Bitta javob beradi va to'xtaydi — o'zi bormaydi
  - Arxivga to'g'ridan-to'g'ri yangi yozuv qo'shib qo'yadi
  - Hech narsa — u faqat detektiv ichida ishlay oladi
- To'g'ri: To'g'ri! Ma'lumot byurosi — funksiya kabi: savolga javob beradi va to'xtaydi. Tizimga (arxiv/idora) o'zi ta'sir qilmaydi. Ko'p qadamli, tizim bilan ishlaydigan vazifa uchun detektiv-agent kerak.
- Xato izohlari:
  - Yurib, idoralarga kirib ish bajarish — bu detektiv (agent) ishi. Byuro faqat javob beradi.
  - Byuro o'zi arxivga yozmaydi — u faqat ma'lumot aytadi. Yozish ruxsatnoma orqali agent ishi.
  - Byuro mustaqil ishlatiladi — detektiv shart emas. U bitta javob qaytaradi.
  - (umumiy) Byuro bitta javob beradi va to'xtaydi.

## 5 · Detektiv dvigateli  `[905]`
- Eyebrow: Ichki dvigatel
- Sarlavha: **Detektivning ichida *dvigatel*: kuzat → xulosa → harakat.**
- Mentor: Detektivni «aqlli» qiladigan ichki dvigatel shu. U maqsadga yetguncha aylanadi: kuzatadi, xulosa qiladi, harakat qiladi — yana kuzatadi. Tugmani bosib bosqichlarni yoqing.
- Sxema: Kuzat — Xulosa — Harakat · ↺ qayta
- Tugma: ▶ Dvigatelni yoqish → Keyingi qadam → → ✓ Tugadi
- Bosqich izohlari (navbat bilan):
  1. Kuzat: detektiv joyni kuzatadi, dalil yig'adi (arxiv, guvoh).
  2. Xulosa: dalillardan keyingi qadamni tanlaydi (qaysi ruxsatnoma?).
  3. Harakat: ruxsatnoma orqali idoraga borib amal qiladi — tizimga ta'sir o'tadi.
- Blok: 🔁 **Nega sikl?** — Har harakatdan keyin detektiv natijani ko'radi va keyingi qadamni tanlaydi — maqsad bajarilguncha. Mana shu sikl agentni avtonom qiladi.
- Xulosa: Bu dvigatel — detektiv komponentining ichida. Tashqaridan siz unga maqsad va ruxsatnomalar berasiz, qolganini o'zi qiladi.
- Tugma: Dvigatelni ko'ring (0/3) → Davom etish

## 6 · Ruxsatnoma nima  `[946]`
- Eyebrow: Ulanish · ruxsatnomalar
- Sarlavha: **Detektiv shaharga *ruxsatnomalar* orqali ta'sir qiladi.**
- Mentor: Detektivning «qo'llari» — bu ruxsatnomalar (toollar). Va eng muhimi: **ruxsatnomalar — bu sizning tizimingizning qismlari**: arxiv so'rovi (DB), ekspert chaqiruvi (API), aloqa xabari (bot). Tugmani bosing.
- Blok: 🗝️ **Ruxsatnoma nima?** — Ruxsatnoma (tool) — detektiv chaqira oladigan funksiya. U orqali agent tizimning boshqa komponentlariga (idoralarga) ta'sir qiladi.
- Tugma: Ruxsatnomalar tizimga qanday ulanadi? → ✓ Ko'rdingiz
- Bosgach (3 karta):
  - **Arxiv ruxsatnomasi:** Detektiv arxivga kirib eski yozuvlarni o'qiydi — bu sizning ma'lumot bazasi (DB) so'rovingiz (tool).
  - **Ekspert ruxsatnomasi:** Detektiv laboratoriyaga dalilni topshirib tahlil so'raydi — bu tashqi xizmat/API chaqiruvi (tool).
  - **Aloqa ruxsatnomasi:** Detektiv shtabga xabar yuboradi — bu xabar yuborish funksiyasi (tool).
- Xulosa: Demak detektiv yangi tizim emas — u mavjud idoralaringizni (arxiv/ekspert/aloqa) ruxsatnoma orqali ishlatadi. U — aqlli muvofiqlashtiruvchi.
- Tugma: Ruxsatnoma nima? → Davom etish

## 7 · Detektiv tizimda  `[976]`
- Eyebrow: Arxitektura · agent o'rni
- Sarlavha: **Detektiv — markazda, *qo'llari* shahar idoralariga cho'ziladi.**
- Mentor: Mana detektivning arxitekturadagi o'rni: u backend ichida turadi va har ruxsatnoma orqali tizimning bir qismiga (idoraga) ulanadi. Har ruxsatnomani bosib, detektiv u bilan nima qilishini ko'ring.
- Sxema: 🕵️ Detektiv → Arxiv · Ekspert · Aloqa
- Tugmalar: Arxiv · Ekspert · Aloqa → bosilganda «<Nom> ruxsatnomasi» + 6-ekrandagi o'sha izoh (aynan bir xil matn)
- Xulosa (3/3 dan keyin): Detektiv — bitta komponent, lekin uchta ruxsatnoma orqali butun tizim bilan ishlaydi. Qancha ruxsatnoma bersangiz — shuncha ish qila oladi (ehtiyot bo'lib).
- Tugma: 3 ruxsatnomani oching (0/3) → Davom etish

## 8 · 2-savol ✅  `[1015]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Detektiv-agent shaharga qanday *ta'sir* qiladi?**
  - O'z-o'zidan, hech qanday ruxsatnomasiz
  - Faqat gapirib — boshqa hech narsa qilmasdan
  - ✔ Ruxsatnomalar orqali — arxiv, ekspert va aloqaga
  - To'g'ridan-to'g'ri fuqaroning uyiga kirib olib
- To'g'ri: To'g'ri! Detektivning amallari — ruxsatnomalar orqali. Ruxsatnomalar esa sizning tizimingizning qismlari: arxiv so'rovi (DB), ekspert chaqiruvi (API), aloqa xabari (bot). Agent ularni qaysi tartibda ishlatishni o'zi tanlaydi.
- Xato izohlari:
  - Ruxsatnomalar — siz yozgan oddiy funksiyalar. Agent faqat qaysi birini ishlatishni tanlaydi.
  - Faqat gapirish — bu ma'lumot byurosi. Detektiv ruxsatnomalar orqali real amal qiladi.
  - Detektiv ekranni yoki uyni o'zi o'zgartirmaydi — u ruxsatnomalar (arxiv/ekspert/aloqa) orqali tizimga ta'sir qiladi.
  - (umumiy) Detektiv ruxsatnomalar orqali (arxiv/ekspert/aloqa) amal qiladi.

## 9 · Qachon detektiv  `[1038]`
- Eyebrow: Qaror · qachon detektiv
- Sarlavha: **Qachon detektiv, qachon *byuro*?**
- Mentor: Detektiv kuchli, lekin har joyga kerak emas. Oddiy ish uchun ma'lumot byurosi yetadi — detektiv ortiqcha murakkablik. Tugmani bosib, qoidani ko'ring.
- Blok: 💬 **Byuro yetadi — qachon?** — Bir martalik, aniq ish: tarjima, matn yozish, manzil, savolga javob. Tizim bilan ko'p qadamli ishlash shart emas.
- Tugma: Detektiv qachon kerak? → ✓ Ko'rdingiz
- Bosgach: 🕵️ **DETEKTIV — QACHON** — Ko'p qadamli, maqsadga yo'naltirilgan, tizim bilan ishlaydigan vazifa: shikoyatni to'liq hal qil, ma'lumot yig'ib qaror qil, o'zi bir necha amal bajar.
- Xulosa: Qoida: **bir qadam → byuro; ko'p qadamli maqsad → detektiv.** Keraksiz joyda detektiv chaqirish — ortiqcha murakkablashtirish.
- Tugma: Qoidani ko'ring → Davom etish

## 10 · Byuro yoki detektiv (amaliyot)  `[1066]`
- Eyebrow: Mashq · qaysi birini
- Sarlavha: **Har vazifaga: *byuro* yoki *detektiv*?**
- Mentor: Endi o'zingiz qaror qiling. Har vazifani o'qing: u bir martalik ishmi (byuro) yoki ko'p qadamli, tizim bilan ishlaydigan maqsadmi (detektiv)?
- Karta: 🧩 Vazifa N/4 · yorliq: qaysi birini chaqirasiz?
- Tugmalar: 💬 Ma'lumot byurosi · bir martalik | 🕵️ Detektiv · ko'p qadamli maqsad
- Vazifalar (✔ to'g'risi):
  1. Bitta manzilni xaritada ko'rsat — ✔ byuro
  2. Yo'qolgan odamni top: guvohlarni so'ra, arxivni tekshir, joylarni aylanib chiq — ✔ detektiv
  3. Bugungi ob-havoni bir jumlada ayt — ✔ byuro
  4. Fuqaro shikoyatini boshidan oxirigacha hal qil: tekshir, idoralarga murojaat qil, javob yetkaz — ✔ detektiv
- Xato bosilsa: Qaytadan o'ylang: bu bir martalik ishmi yoki ko'p qadamli maqsadmi?
- Yakun: Hammasi to'g'ri! Endi vazifaga qarab to'g'ri vositani tanlay olasiz — bu arxitektorning muhim qarori.
- Tugma: Tanlang (0/4) → Davom etish

## 11 · 3-savol ✅  `[1104]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Bitta manzilni xaritada *ko'rsatish* kerak. Byuro yoki detektiv?**
  - ✔ Ma'lumot byurosi — bir martalik, aniq ish
  - Detektiv — u har doim byurodan yaxshiroq ishlaydi
  - Ikkalasini birga chaqirib, javobni solishtirish
  - Hech qaysi — bu ular bajaradigan ish emas
- To'g'ri: To'g'ri! Manzil ko'rsatish — bitta qadamli, aniq vazifa. Ma'lumot byurosi yetarli. Bunga detektiv chaqirish — keraksiz murakkablik. To'g'ri vositani tanlash muhim.
- Xato izohlari:
  - Detektiv har doim yaxshi emas — bir qadamli ish uchun u ortiqcha. Manzilga byuro yetadi.
  - Ikkalasini birga — keraksiz. Sodda ishni sodda vosita bilan qiling.
  - Bu aniq byuro ishi — bir martalik javob. Detektiv shart emas.
  - (umumiy) Bir martalik ishga ma'lumot byurosi yetadi.

## 12 · Shahar detektivi (case)  `[1127]`
- Eyebrow: Hayotiy · shahar detektivi
- Sarlavha: **Shahar detektivi — vazifadan *natijagacha* o'zi.**
- Mentor: Mana detektiv arxitekturada ish boshida: bitta vazifa oladi va ruxsatnomalar orqali shahar idoralarini boshqarib, ishni bajaradi. Tugmani bosib, qadamlarni kuzating.
- Tugma: ▶ Detektivga vazifa berish → Keyingi qadam → → ✓ Vazifaga yetildi
- Qadamlar (har biri bosilganda chiqadi; yorliq har qatorda «tayyor» bo'lib chiqadi — pastdagi belgilarga qarang):
  1. Vazifa: «Yo'qolgan yukni top va egasiga qaytar.»
  2. Kuzat: detektiv arxivga kirib so'nggi yozuvlarni o'qidi (ruxsatnoma: arxiv).
  3. Xulosa: yuk B-manzilda — o'sha yerni tekshirish kerak.
  4. Harakat: B-manzilga bordi, yukni topdi ✅ (ruxsatnoma orqali amal).
  5. Xulosa: endi egasiga xabar berish kerak.
  6. Harakat: aloqa idorasidan egasiga xabar yubordi 📨✅.
  7. Vazifa bajarildi. Detektiv 2 ta ruxsatnomani ishlatib, ishni o'zi hal qildi.
- Blok: 🗝️ **Ishlatilgan ruxsatnomalar** — hali yo'q / «N ta ruxsatnoma ishlatildi (arxiv, aloqa) — har biri tizimga ta'sir qildi.»
- Xulosa: Siz faqat vazifa berdingiz. Detektiv kuzat→xulosa→harakat sikli bilan ruxsatnomalarni ishlatib, ishni bajardi. Mana detektivning arxitekturadagi kuchi.
- Tugma: Detektivni kuzating (0/7) → Davom etish

## 13 · Vakolat chegarasi  `[1162]`
- Eyebrow: Ehtiyot · vakolat chegarasi
- Sarlavha: **Detektiv *amal qiladi* — demak vakolat chegarasi kerak.**
- Mentor: Byuro faqat gapirgani uchun xavfsiz. Detektiv esa real amal qiladi (arxivga yozadi, pul, xabar) — shuning uchun unga vakolat chegarasi (order) beriladi. Tugmani bosing.
- Blok: 🕵️ **Detektiv backend ichida** — Arxitekturada detektiv — backend komponenti. U faqat siz bergan ruxsatnomalarga ega; bermagan ishingizni qila olmaydi.
- Tugma: Qanday chegara? → ✓ Tushundim
- Bosgach:
  - 🧾 **Cheklangan ruxsatnomalar:** faqat kerakli ruxsatnomalarni bering (o'chirish/to'lovni — yo'q).
  - ✋ **Tasdiq:** xavfli amaldan oldin odam tasdig'ini so'rasin (order kerak).
- Blok: 📍 **KEYINGI DARS** — Agent va AI xulqini qanday **aniq shakllantirish** mumkin? Buni **Claude Skills** bilan qilamiz — keyingi darsda.
- Tugma: Nega chegara? → Davom etish

## 14 · 4-savol ✅  `[1193]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Detektiv-agent arxitekturada *qayerda* yashaydi va nima bilan amal qiladi?**
  - Frontendda — chunki uni har bir fuqaro ko'radi
  - Arxiv (baza) ichida — chunki hujjatlar bilan ishlaydi
  - Tizimdan tashqarida — butunlay mustaqil dastur
  - ✔ Backend ichidagi komponent — ruxsatnomalar orqali ta'sir qiladi
- To'g'ri: To'g'ri! Detektiv-agent — backend ichidagi aqlli komponent. U mustaqil dastur emas; tizimning bir qismi va faqat siz bergan ruxsatnomalar (arxiv/ekspert/aloqa) orqali boshqa komponentlarga ta'sir qiladi.
- Xato izohlari:
  - Detektiv fuqaroga ko'rinmaydi — u sahna ortida (backend) ishlaydi. Frontend faqat natijani ko'rsatadi.
  - Detektiv arxiv (baza) ichida emas — u backendda turadi va arxivni ruxsatnoma sifatida ishlatadi.
  - Detektiv tizimdan tashqarida emas — u tizimning komponenti, ruxsatnomalar orqali ulangan.
  - (umumiy) Detektiv — backend komponenti, ruxsatnomalar orqali amal qiladi.

## 15 · Detektiv oqimi ✅ (final)  `[1216]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: detektiv ish oqimini *to'g'ri tartibda* yig'ing.**
- Mentor: Detektiv vazifani qanday bajaradi? Eslang: vazifa → tizimdan o'qiydi (kuzat) → ruxsatnoma tanlaydi (xulosa) → idoraga boradi (harakat) → natijani ko'rib qaytadi. Bo'laklarni to'g'ri tartibda joylang.
- Yorliq: detektiv oqimi (siz yig'yapsiz)
- Bo'laklar (aralash): Vazifa · Kuzat · Xulosa · Harakat · Natijani ko'r
- Uyachalar (bo'sh uyada ko'rinadigan yozuv, 1→5): Vazifa bosqichi · Kuzat bosqichi · Xulosa bosqichi · Harakat bosqichi · Natijani ko'r bosqichi
- Xato: ⚠️ Tartib xato — qayta joylang. · Tartib xato — bo'lakni bosib qaytaring va qayta joylang
- Tayyor: ✓ Oqim tayyor — detektiv dvigateli!
- Blok: 🔁 **Nega tartib muhim?** — Detektiv avval kuzatmasa — xulosa qila olmaydi; xulosasiz — harakat qilolmaydi. Har qadam oldingisiga tayanadi, so'ng aylana qaytadan boshlanadi.
- Xulosa: ✓ Oqim tayyor: **Vazifa → Kuzat → Xulosa → Harakat → Natijani ko'r** (maqsadga yetguncha qayta aylanadi). Mana detektivning ishlash dvigateli.
- Havola: 📖 Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: Oqimni yig'ing → Davom etish

## 16 · Amaliyot · dizayn  `[2014]`
- Eyebrow: Amaliyot · dizayn · joy: «loyihangizda»
- Sarlavha: **Loyihangizga detektiv-agent loyihalang**
- Mentor: Bu topshiriqni o'z loyihangizda bajaring. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: Kelajakdagi loyihangizni o'ylang. Unda qaysi vazifa ko'p qadamli — biror maqsadni o'zi boshdan-oxir hal qilishi kerak? O'sha — detektiv-agentga nomzod. Uni tanlab, qaysi ruxsatnomalar (idoralar) kerakligini va vakolat chegarasini yozing.
- Bosqichlar — belgilab boring:
  1. Loyihangizdagi ko'p qadamli bitta vazifani tanlang (masalan: shikoyatni boshdan-oxir hal qilish)
  2. Bu vazifani detektiv-agentga bering — maqsadni bir jumlada yozing
  3. Agentga qaysi 2-3 ruxsatnoma kerak: arxiv (DB)? ekspert (API)? aloqa (xabar)?
  4. Har ruxsatnoma uchun bir qatorda yozing: agent u bilan nima qiladi
  5. Vakolat chegarasini belgilang: agent NIMA qila OLMASLIGI kerak (xavfli amal)?
- Tugmalar: ✅ Bajardim → ✓ Bajarildi — ustozni kuting · «Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.» · Avval bajaring → Davom etish

## 17 · Natijalar (podium)  `[1766]`
- Umumiy shablon: **Kim g'olib?** · Natijalar · «Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.» · Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · 🏆 To'liq reyting

## 18 · Takrorlash (kartochkalar)  `[2042]`
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni *sinab ko'ring*.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Maqsad berilsa, o'zi ko'p qadam qo'yadigan dastur qanday ataladi? | AI-agent | Detektiv — ishni oxirigacha olib boradi |
| Oddiy AI bir savoldan keyin nima qiladi? | Javob berib to'xtaydi | Ma'lumot byurosi — faqat gapiradi, amal qilmaydi |
| Agentning qaror sikli qaysi uch qadamdan iborat? | Kuzat, xulosa, harakat | Har harakatdan keyin natijani ko'radi |
| Agent chaqira oladigan funksiya nima deyiladi? | Tool | Ruxsatnoma — idoraga kirib amal qilish huquqi |
| Agent eski yozuvlarni o'qishi uchun qaysi tool kerak? | Bazaga so'rov | Arxiv idorasi — bu database tool |
| Agent tashqi xizmatdan tahlil so'rasa, bu qaysi tool? | API tool | Ekspert idorasi — javobni qaytaradi |
| Agent maqsadga yetmasa nima qiladi? | Siklni qaytadan boshlaydi | Aylana maqsad bajarilguncha davom etadi |
| Agent nimalarni qila olishini kim belgilaydi? | Siz — vakolat chegarasi bilan | Guardrail xavfli amallarni cheklaydi |
| Agent tizimga qanday ta'sir o'tkazadi? | Faqat tool orqali | Siz bermagan amalni qila olmaydi |
| Agent arxitekturaning qaysi qismida yashaydi? | Backend | Sahna ortida — fuqaro uni ko'rmaydi |
| Oddiy tarjima ishiga agent kerakmi? | Yo'q, byuro yetadi | Bu bir qadamli aniq vazifa |
| Oddiy ishga agent qo'yish qanday xato deyiladi? | Ortiqcha murakkablik | Bir qadamli ishga byuro yetardi |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 19 · Yakun  `[2055]`
- Eyebrow: Tayyor · belgi: ✓ Agentning o'rnini tushundingiz
- Sarlavha: **Detektiv-agent — tizimning *aqlli komponenti*.**
- Endi siz bilasiz:
  - Oddiy AI — ma'lumot byurosi (bir javob); agent — detektiv (maqsad sari sikl)
  - Detektiv dvigateli: kuzat → xulosa → harakat (maqsadga yetguncha)
  - Ruxsatnomalar (tool) agentni tizimga ulaydi: arxiv (DB), ekspert (API), aloqa (xabar)
  - Arxitekturada detektiv — backend komponenti, ruxsatnomalar orqali amal qiladi
  - Bir qadamli ish → byuro; ko'p qadamli maqsad → detektiv; xavfli amalga vakolat chegarasi
- Uyga vazifa (tugma: Uyga vazifa · Amaliy topshiriqni bajarish →):
  - **Toping** — loyihangizda qaysi vazifa ko'p qadamli? O'sha — detektiv-agentga nomzod
  - **Ruxsatnomalar** — o'sha agent qaysi idoralarga kiradi: arxiv (DB)? ekspert (API)? aloqa?
  - **Chegara** — agent NIMA qila olmasligi kerak? Vakolat chegarasini yozing
- 🚀 Keyingi dars — Claude Skills: AI va agent xulqini aniq shakllantirish.
- ⏳ Mentorni kuting · 🏅 Nishonlaringiz — N/4 · Qaytadan · Yakunlash ✓

---

## Qo'shimcha matnlar

**Nishonlar (4):** 🕵️ The Agent — Ma'lumot byurosi ↔ detektiv farqini ajratdingiz (4-ekran) · 🗝️ Access Pass — Detektiv ruxsatnomalar bilan ishlashini bildingiz (8-ekran) · 📜 With a Warrant — Detektivning vakolat chegarasini tushundingiz (14-ekran) · 🔁 Mission Loop — Detektiv ish oqimini to'g'ri tartibda yig'dingiz (15-ekran)

**Qisqa takrorlash oynalari (5):**
1. (4-ekran) Byuro javob beradi, detektiv ishni bajaradi: 💬 Ma'lumot byurosi — Oddiy AI — ma'lumot byurosi: bitta savolga bitta javob beradi va to'xtaydi. · 🕵️ Detektiv — Agent — detektiv: maqsad oladi, shahar bo'ylab yurib, o'zi ko'p qadam qo'yadi. · 🎯 Farq — amal — Byuro faqat gapiradi; detektiv esa tizimga ta'sir o'tkazadi — ishni bajaradi. · Sinfga savol: Byuro va detektiv o'rtasidagi asosiy farq nima?
2. (8-ekran) Ruxsatnoma — detektivning qo'li: 🗝️ Ruxsatnoma nima? — Detektiv idoraga ruxsatnoma bilan kiradi — bu sizning tizim funksiyangiz (tool). · 📁 Idoralar — Arxiv (DB), ekspert (API), aloqa (xabar) — har biriga alohida ruxsatnoma. · ⚡ Amal ruxsatnoma orqali — Agent faqat siz bergan ruxsatnomalar orqali amal qiladi — boshqasini qila olmaydi. · Sinfga savol: Detektiv shaharga qanday amal qiladi?
3. (11-ekran) Qachon byuro, qachon detektiv: 1️⃣ Bir qadamli ish — Aniq, bir martalik vazifa (tarjima, manzil) — byuro yetadi. · 🔁 Ko'p qadamli maqsad — Ko'p qadamli, tizim bilan ishlaydigan maqsad — detektiv kerak. · ⚖️ To'g'ri vosita — Oddiy ishga detektiv chaqirish — ortiqcha murakkablik. · Sinfga savol: Nega har ishga agent kerak emas?
4. (14-ekran) Detektiv — backend komponenti: 🏢 Backendda turadi — Detektiv-agent — backend ichidagi aqlli komponent, mustaqil dastur emas. · 🗝️ Ruxsatnomalar bilan — U ruxsatnomalar (DB/API/xabar) orqali tizimning boshqa qismlariga ta'sir qiladi. · 🙈 Fuqaroga ko'rinmaydi — Agent sahna ortida ishlaydi — frontend faqat natijani ko'rsatadi. · Sinfga savol: Agent arxitekturada qayerda yashaydi?
5. (15-ekran) Detektiv oqimi — tartib muhim: 🎯 Avval — vazifa — Hammasi vazifadan boshlanadi: agentga maqsad beriladi. · 👁️ Kuzat → xulosa → harakat — Agent kuzatadi, xulosa qiladi (qaysi ruxsatnoma?), so'ng harakat qiladi. · 🔁 Natijani ko'r → qayta — Amaldan keyin natijani ko'radi — maqsad tugamasa qayta kuzatadi. (Vazifa → Kuzat → Xulosa → Harakat → Natija) · Sinfga savol: Nega agent aylanada ishlaydi?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Oddiy AI (ma'lumot byurosi) va agent (detektiv) o'rtasidagi asosiy farq nima? ✔ Byuro javob berib to'xtaydi; detektiv o'zi ko'p qadam qo'yadi · Detektiv ancha chiroyliroq va odob bilan gapiradi · Byuro har doim detektivdan ancha tezroq ishlaydi · Ular o'rtasida umuman hech qanday farq yo'q
2. Agentning qaror sikli qanday nomlanadi? Kirish → ishlov → chiqish · Boshlash → kutish → tugatish · ✔ Kuzat → xulosa → harakat · Savol → o'ylash → javob
3. «Tool» (ruxsatnoma) — detektiv tilida nima? Detektivning shahardagi laqabi · ✔ Idoraga kirib amal qilish huquqi · Shahar ko'chalari xaritasi · Byuroning telefon raqami
4. Detektiv arxivga kirib yozuvlarni o'qishi — bu qaysi tool? ✔ Ma'lumot bazasi (DB) so'rovi · Foydalanuvchining kirish paroli · Ekran rasmini olish · Video faylni ijro etish
5. Bir martalik, aniq ish (masalan tarjima) uchun nima yetadi? Bunga ham albatta agent kerak · Hech qaysi biri to'g'ri emas · Ikkalasini birga chaqirish · ✔ Ma'lumot byurosi (oddiy AI) yetadi
6. Ko'p qadamli, tizim bilan ishlaydigan maqsad uchun nima kerak? Bir javoblik ma'lumot byurosi · Oddiy chiziqli skript · Faqat frontend qismi · ✔ Detektiv-agent (avtonom)
7. Detektiv-agent arxitekturada qayerda turadi? Frontendda, fuqaro ko'radigan joyda · ✔ Backend ichidagi komponent · Baza (arxiv) ichida · Tizimdan butunlay tashqarida
8. Agent tizimga qanday amal qiladi? O'z-o'zidan, hech qanday kodsiz · ✔ Ruxsatnomalar (tool) orqali: DB/API · Faqat gapirib, amalsiz holda · Ekranni o'zi chizib qo'yib
9. Nega agentga vakolat chegarasi (guardrail) kerak? ✔ U real amal qiladi — xavflisini cheklash kerak · Chunki u juda sekin ishlaydi va kuttiradi · Chunki u juda ko'p xotira egallaydi · Aslida bunday chegara kerak emas
10. Agentni «avtonom» qiladigan narsa nima? Juda katta xotira hajmi · Chiroyli va zamonaviy interfeys · ✔ Maqsadga yetguncha aylanadigan sikl · Juda tez internet aloqasi
11. Har vazifaga agent chaqirish nima deb ataladi? Bu eng to'g'ri yechim hisoblanadi · Resurslarni to'g'ri tejash usuli · Tizimni optimallashtirish usuli · ✔ Ortiqcha murakkablashtirish (keraksiz murakkablik)
12. Detektiv ish oqimining to'g'ri tartibi qanday? Harakat → kuzat → xulosa → vazifa → natija · Xulosa → harakat → natija → kuzat → vazifa · ✔ Vazifa → kuzat → xulosa → harakat → natija · Natija → vazifa → harakat → xulosa → kuzat

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **12-ekran ko'rinishda buzuq:** qadamlarda `ico` yo'q — har bir qadam yorlig'i «tayyor» bo'lib chiqadi (vazifa/kuzat/xulosa/harakat o'rniga), «Ishlatilgan ruxsatnomalar» esa oxirgacha «hali yo'q» deb turadi, 7-qadam esa «2 ta ruxsatnomani ishlatib» deydi — o'zaro zid.
- **15-ekran (final) javobi ochiq turibdi:** bo'sh uyachalarda tartib bilan «Vazifa bosqichi · Kuzat bosqichi · … · Natijani ko'r bosqichi» yozilgan, Mentor ham butun tartibni aytib beradi — o'quvchi faqat nomlarni moslaydi.
- **0-ekran:** qaysi variant tanlansa ham «Aynan!» chiqadi; to'g'ri variant eng uzuni. Ssenariy (sovg'a sotib olish) detektiv metaforasiga unchalik mos emas.
- **Inglizcha/texnik so'zlar izohsiz:** «call-markaz» (2), «↻ loop» (3), «toollar»/«tool» (6, kartochkalar), «order» (13 — o'zbekcha «order» boshqa ma'noni beradi), «guardrail» (viktorina 9, kartochka 8), «database tool», «API tool» (kartochkalar), «Claude Skills» (13, 19), nishon nomlari inglizcha (The Agent, Access Pass, With a Warrant, Mission Loop). «backend/frontend», «DB», «API» dars bo'yi ochilmaydi.
- **Bir narsa — ko'p nom:** sikl · aylana · dvigatel · oqim (5, 15); ruxsatnoma = tool = funksiya = idora = komponent; aloqa ruxsatnomasi 6-ekran Mentorida «aloqa xabari (bot)», kartada «xabar yuborish funksiyasi». Viktorina 12 va takrorlash 5 da oxirgi bosqich «Natija», 15-ekranda «Natijani ko'r». Lug'atda: SHAHAR metaforasida «Ekspert-byuro» = AI deb yozilgan, bu darsda esa «Ekspert» = API, «byuro» = oddiy AI — to'qnashuv bo'lishi mumkin.
- **«avtonom» izohsiz** (5-ekran, viktorina 6 va 10) — lug'at bo'yicha birinchi ko'rinishda «mustaqil» gloss kerak; «muvofiqlashtiruvchi» (6) — qiyin so'z; «hisoblanadi» (viktorina 11, noto'g'ri variant) — kantselyarit.
- **Nishon mos emas:** «With a Warrant — vakolat chegarasini tushundingiz» 14-ekranga (agent qayerda yashaydi) bog'langan; vakolat chegarasi 13-ekranda, u ballik emas.
- **Sotilgan testlar / g'alati jumlalar:** 14-ekran va viktorina 6, 11 da to'g'ri javob eng uzuni yoki qavsli; 12-ekran tugmasi «✓ Vazifaga yetildi» va Mentor «arxitekturada ish boshida» — g'alati ifoda; 13-ekran «(arxivga yozadi, pul, xabar)» — ro'yxat chala; «Keyingi dars» e'loni 13-ekranda ham, 19-ekranda ham takrorlanadi.
