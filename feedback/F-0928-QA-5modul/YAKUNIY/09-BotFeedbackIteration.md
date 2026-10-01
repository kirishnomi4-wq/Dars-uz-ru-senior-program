# 9-dars «Fikr va iteratsiya» — yakuniy matn

Fayl: `src/5-Modull/BotFeedbackIterationLesson.jsx` · 20 ekran · Keyingi dars: «AI-agent yaratish»
Holat: 01.10.2026 — kodga mos

## 0 · Kirish — fikr kela boshladi
- Eyebrow: Kirish
- Sarlavha: AvtoPizza boti bir haftadan beri ishlayapti. Mijozlar fikr yoza boshladi.
- Mentor: Eng yaxshi mahsulot ham birinchi versiyada mukammal bo'lmaydi. Foydalanuvchilar uni siz o'ylamagan tomondan ishlatadi. Tugmani bosib, kelgan fikrlarni ko'ring.
- Chat (AvtoPizza · bot · onlayn):
  - mijoz: Manzilimni 2 marta so'radi
  - mijoz (tugma bosilgach, birin-ketin): Narxni ko'rsatmaydi, noqulay
  - mijoz: Glutensiz pitsa qo'shing!
  - mijoz: Tez va qulay, rahmat!
- Tugma: ▶ Mijozlar nima dedi? → ✓ Fikrlar keldi
- Savol (uchala xabardan keyin): Birinchi nima qilasiz?
  - Hech narsa: bot ishlayapti, shikoyat bo'lib turadi
  - ✔ Fikrlarni o'qib, eng ko'p takrorlanganini tuzataman
  - Botni noldan, butunlay qayta yozaman
- Javob izohlari:
  - 2-variant: **Aynan!** Birinchi versiyadan keyin ish tugamaydi: fikrlarni tinglaysiz, eng muhimini tuzatasiz va yana tinglaysiz. Shu takror **iteratsiya** deyiladi. Bugun uni boshidan oxirigacha bosib o'tamiz.
  - 1 yoki 3-variant: **Qiziq fikr!** Lekin shikoyat qilingan joy o'z-o'zidan tuzalmaydi, noldan qayta yozsangiz esa ishlab turgan qismlar ham yo'qoladi. Odatda fikrlarni tinglab, eng muhimini tuzatasiz va yana tinglaysiz. Shu takror **iteratsiya** deyiladi. Bugun uni boshidan oxirigacha bosib o'tamiz.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun: mijozlar fikridan botning yangi versiyasigacha.
- Mentor: 5-darsda botni o'zingiz test qilib, xatosini tuzatgansiz — bu ham iteratsiya edi. 8-darsda botingizni ishlatgan odamdan so'radingiz. Bugun xatoni foydalanuvchilar aytadi, siz esa qaysi birini birinchi tuzatishni tanlaysiz.
- Yorliq: dars oxirida — ikki shikoyati tuzatilgan bot: manzil bir marta so'raladi, narx ko'rinadi
- Chat (AvtoPizza · bot · onlayn):
  - mijoz: Margarita, Chilonzor 5
  - bot: Qabul qilindi: Margarita — 35 000 so'm. Manzil: Chilonzor 5.
- Bugungi 4 qadam
  1. Fikrlarni turlarga ajratish: bug, taklif, maqtov
  2. Guruhlab, ustuvorlik qo'yish: chastota va ta'sir
  3. Noaniq fikrni aniq o'zgarishga aylantirish
  4. Qayta o'lchash va keyingi iteratsiya
- Tugmalar (telefonda): 4 qadamni ko'rish · ↩ Natijani ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Fikr manbalari
- Eyebrow: Tushuncha · fikr manbalari
- Sarlavha: Fikr faqat shikoyatda emas — u 4 joydan keladi.
- Mentor: Foydalanuvchi har doim ham «menga bu yoqmadi» deb yozmaydi. Ko'pincha fikr uning **xatti-harakatida** ko'rinadi: qayerda to'xtaydi, nimani qayta so'raydi. Har manbani bosing.
- Kartalar (bosilgani ✓ bilan belgilanadi va o'ngda ochiladi, bir vaqtda bittasi):
  - **To'g'ridan-to'g'ri xabar** — Foydalanuvchi botga shikoyat yoki taklifni o'zi yozadi.
  - **Ketib qolish (drop-off)** — Ko'p odam suhbatning bir joyida to'xtab, ketib qoladi. O'sha qadamda nimadir xalaqit beryapti — sababini tekshirasiz.
  - **Takror savollar** — Bir xil savol qayta-qayta berilsa, bot biror narsani aniq ko'rsatmayapti.
  - **Xato yozuvlari (loglar)** — Bot dasturining xato yozuvlari u qayerda buzilayotganini ko'rsatadi.
- Xulosa (4/4 dan keyin): To'g'ridan-to'g'ri xabar — eng aniq, lekin kam keladi. Xatti-harakat (ketib qolish, takror savol) — ko'p, lekin yashirin. Ikkalasini ham o'qiysiz.
- Tugmalar: Orqaga · 4 manbani ko'ring (N/4) → Davom etish

## 3 · Savol berish
- Eyebrow: Tushuncha · savol berish
- Sarlavha: Qanday so'rasangiz, shunday javob olasiz.
- Mentor: 8-darsda odamdan bo'lib o'tgan ishini so'rashni o'rgandingiz. Bot ham buyurtmadan keyin mijozdan fikr so'rashi mumkin — savolni shu qoida bilan tuzasiz. Ikkala savolni bosib ko'ring.
- Kartalar (bosilgani ✓ bilan belgilanadi, izohi o'ngda ochiladi):
  - **«Botimiz yoqdimi?»** — Bo'sh savol. Javobi odatda «ha, zo'r» bo'ladi — undan nimani tuzatish kerakligi bilinmaydi.
  - **«Oxirgi buyurtmada qayerda to'xtab qoldingiz?»** — Bo'lib o'tgan ishni so'raydi, javobda aniq joy bo'ladi: «menyu tugmasini topolmadim». Tuzatishni shu javobdan boshlasa bo'ladi.
- Tugmalar: Orqaga · Ikkala savolni sinang → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Mijoz: «Bot manzilimni 2 marta so'radi». Bu qanday fikr?
  - Taklif: botda hali yo'q narsa so'ralgan
  - ✔ Bug: bot yozilgan manzilni eslab qolmagan
  - Maqtov: mijoz botdan mamnun ekanini aytgan
  - Shovqin: bunga e'tibor berish shart emas
- Javob izohlari:
  - To'g'ri: Bu bug: bot kutilgan ishni bajarmayapti — manzilni eslab qolmayapti.
  - Taklif: Taklif — botda hali yo'q narsani so'rash. Bu yerda bor narsa noto'g'ri ishlayapti, demak bu bug.
  - Maqtov: Mijoz mamnun emas: u bir narsani ikki marta yozishga majbur bo'ldi. Bu norozilik, maqtov emas.
  - Shovqin: Aksincha, bu aniq fikr: nima buzilgani aytilgan. Ko'p odam shuni yozsa, bug jiddiy.
- Test yozuvlari (4, 8, 10, 14-ekran uchun bir xil): To'g'ri · Qaytadan urinib ko'ring · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <to'g'ri variant>
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish · Mentor o'tmagan bo'lsa: Mentorni kuting (izoh: Mentor hali bu sahifaga o'tmadi)

## 5 · Chastota
- Eyebrow: Tushuncha · chastota
- Sarlavha: Bir kishi aytsa — tasodif bo'lishi mumkin. Ko'pchilik aytsa — muammo.
- Mentor: Har fikrga alohida ergashsangiz, adashasiz. Bir xil shikoyatlarni guruhlab, sanang: nechta odam shu narsani aytgan? Bu son **chastota** deyiladi. Tugmani bosing.
- Tugma: Fikrlarni guruhlash → ✓ Guruhlandi
- Ustunlar (son tugma bosilgach chiqadi):
  - Manzilni qayta so'raydi — 18
  - Narx ko'rinmaydi — 12
  - Javoblar juda uzun — 5
  - Glutensiz pitsa yo'q — 3
- Natija (bosilgach): Eng ko'p takrorlangani — **«manzilni qayta so'raydi»**: 18 kishi. Son yetmaydi — muammo odamni qanchalik qiynaganini ham ko'rasiz, buni **ta'sir** deymiz: manzil bug'i buyurtmani to'xtatadi, glutensiz pitsa yo'qligi esa faqat istak. Kam aytilgan, lekin og'ir muammo ham muhim.
- Tugmalar: Orqaga · Fikrlarni guruhlang → Davom etish

## 6 · Noaniq fikr → aniq o'zgarish
- Eyebrow: Tushuncha · aniq o'zgarish
- Sarlavha: Foydalanuvchi noaniq gapiradi — siz uni aniq vazifaga aylantirasiz.
- Mentor: «Menyu chalkash» — bu shikoyat, vazifa emas. AI yordamchi bunday gapdan to'g'ri kod yoza olmaydi. Uni aniq o'zgarishga siz aylantirasiz — kerak bo'lsa, avval odamdan aniqlashtirib so'raysiz. Har fikrni bosing.
- Fikrlar (bosilgani ✓ bilan belgilanadi; o'ngda ikki karta ochiladi: «Foydalanuvchi aytdi» va «Aniq o'zgarish»):
  - «Menyu chalkash» → Har pitsa yoniga narxi va 2–3 so'zli tavsifi qo'shilsin.
  - «Bot meni tushunmaydi» → System prompt'ga: savol noaniq bo'lsa, bot aniqlashtiruvchi savol bersin.
  - «Sekin javob beradi» → Oddiy savollarga (menyu, manzil) bot AI'siz, tugma bilan tez javob bersin.
- Tugmalar: Orqaga · 3 fikrni oching (N/3) → Davom etish

## 7 · Bir haftalik fikrlar
- Eyebrow: Markaziy · fikrlar ro'yxati
- Sarlavha: Bir haftalik fikrlar: nimani birinchi tuzatasiz?
- Mentor: Botingiz bir hafta ishladi, mijozlar 8 ta fikr yozdi. Avval ularni saralaysiz, keyin mijozlar qayerda ko'p ketib qolganini topasiz va nimani birinchi tuzatishni tanlaysiz.
- Bosqichlar bittadan ochiladi:
- **1-bosqich — kirish**
  - Yorliq: Fikrlar ro'yxati — 8 ta fikr (quyidagi jadvaldagi 8 fikr o'qish uchun ko'rinadi)
  - Tugma: ▶ Saralashni boshlash
- **2-bosqich — saralash**
  - Yorliq: Har fikrni savatga joylang
  - Ko'rsatma: Kartani sudrab savatga tashlang yoki bosib tanlang — N/8
  - Tez tanlov tugmalari: Aniq · Noaniq
  - Savatlar: **Aniq** — muammo va joyi aytilgan · **Noaniq** — avval aniqlashtirish kerak
  - Kartalar navbat bilan chiqadi; noto'g'ri savatga tashlansa, karta qaytadi va izoh chiqadi:

| Fikr | To'g'ri savat | Noto'g'ri savatga tashlansa chiqadigan izoh |
|---|---|---|
| Yaxshi bot | Noaniq | Umumiy maqtov: nimasi yaxshi ekani aytilmagan — «Nimasi yoqdi?» deb so'rash kerak. |
| Menyu tugmasini topolmadim, /start bosdim, hech narsa chiqmadi | Aniq | Aniq muammo (menyu tugmasi) va aniq joy (/start dan keyin) aytilgan — tuzatsa bo'ladi. |
| Buyurtma berdim, javob 5 daqiqada keldi | Aniq | Aniq muammo (sekinlik) va o'lchov (5 daqiqa) bor — tuzatsa bo'ladi. |
| Bot ahmoq | Noaniq | Nimasi yoqmagani aytilmagan — «Qayerda qiynaldingiz?» deb so'rash kerak. |
| Manzilni yozdim, lekin bot uni eslamadi, qaytadan so'radi | Aniq | Aniq bug: bot manzilni holatda saqlamagan, qayerda buzilgani aniq. |
| Narxni so'radim, boshqa narx aytdi | Aniq | Aniq bug: botdagi AI narxni o'zi o'ylab topgan (6-darsda buni ko'rgansiz). Qayerda xato ekani aniq. |
| Ajoyib, hammasi juda yoqdi | Noaniq | Aniq joy aytilmagan — nimasi yoqqanini so'rash kerak. |
| Boshqa bot menga ko'proq yoqadi | Noaniq | Qaysi bot, nimasi yoqqani aytilmagan — avval so'rash kerak. |

  - Oxirida: ✓ Hammasi saralandi
- **3-bosqich — voronka**
  - Yorliq: Saralash tugadi. Endi raqamlarga qaraymiz: mijozlar qayerda ketib qoladi?
  - **Voronka** — har qadamda nechta mijoz qolganini ko'rsatadi
  - Pog'onalar: 100 — /start bosdi · 40 — Menyuni ochdi · 35 — Buyurtma berdi
  - Savol: Qaysi qadamda eng ko'p odam yo'qoldi?
    - Menyuni ochdi → Buyurtma berdi · 5 kishi
    - ✔ /start bosdi → Menyuni ochdi · 60 kishi
  - Xato bosilsa: Bu yerda kam odam yo'qolgan. Ikki qadam orasidagi farqni solishtiring.
- **4-bosqich — ustuvorlik**
  - Ramka: Topdingiz: 100 kishidan **60 tasi** /start bosib, menyuni **ochmasdan** ketgan. Menyuni ochgan 40 kishidan esa faqat 5 tasi buyurtma bermagan. Aniq fikrlar ko'p, vaqt oz. Qaysi birini birinchi tuzatasiz?
    - «Bot ahmoq» sharhiga javob yozish
    - ✔ Menyu tugmasini tuzatish
- **5-bosqich — oqibat**
  - To'g'ri tanlansa: **Menyu tugmasi tuzatildi** — Bir haftadan keyin voronka: menyuni ochmasdan ketganlar endi 60 emas, **15 kishi**. · Tugma: Iteratsiyani yakunlash →
  - Xato tanlansa: **«Bot ahmoq» sharhiga javob yozildi** — Voronka o'zgarmadi: hali ham 60 kishi menyuni ochmasdan ketyapti. Bu sharhda aniq muammo yo'q edi. · Tugma: ↩ Qaytadan tanlash
- **6-bosqich — yangi fikr**
  - Yorliq: AvtoPizza botiga yangi fikr keldi
  - Chat (AvtoPizza · bot · onlayn): mijoz: Endi menyu topildi, rahmat!
  - Ramka: Bitta iteratsiya tugadi, lekin yangi fikrlar kelaveradi. Shuning uchun ish yana tinglashdan boshlanadi.
  - Tugma: ✓ Tushunarli
- Yakun (oxirida): Butun yo'lni bosib o'tdingiz: saraladingiz, voronkadan eng katta yo'qotishni topdingiz va eng ta'sirli tuzatishni tanladingiz.
- Tugmalar: Orqaga · Oxirigacha bajaring → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Vaqtingiz oz. 18 kishi manzil bug'idan (buyurtma to'xtab qoladi), 3 kishi glutensiz pitsa yo'qligidan yozdi. Birinchi nimani qilasiz?
  - Glutensiz pitsani: yangi taom ko'proq mijoz olib keladi
  - Ikkalasini birga: hech bir fikr kutib qolmasin
  - ✔ Manzil bug'ini: u ko'p odamni qattiq qiynayapti
  - Hech birini: bular oddiy shikoyat, jiddiy emas
- Javob izohlari:
  - To'g'ri: Manzil bug'i ko'p odamda (18) buyurtmani to'xtatadi — chastota ham, ta'sir ham katta.
  - Glutensiz pitsani: Yangi taom qiziq, lekin uni 3 kishi so'ragan. Bug esa 18 kishini qiynayapti — u birinchi.
  - Ikkalasini birga: Vaqt oz bo'lsa, ikkalasi ham chala chiqadi. Avval eng kattasini qiling.
  - Hech birini: Aksincha: 18 kishi bir xil shikoyat qilgan — bu jiddiy fikr. Uni birinchi tuzatasiz.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 9 · Bitta to'liq iteratsiya
- Eyebrow: Hayotiy · iteratsiya
- Sarlavha: AvtoPizza: bitta to'liq iteratsiya.
- Mentor: Hammasi birga: shikoyatdan yangi versiyagacha. Tugmani bosib, iteratsiyani boshidan oxirigacha yuring.
- Qadamlar (har bosishda bittadan ochiladi):
  1. **Tingla** — Bir haftada 38 ta shikoyat keldi.
  2. **Guruhla** — Bir xillari birlashtirildi: manzil — 18, narx — 12, uzun javob — 5, glutensiz pitsa — 3.
  3. **Tanla** — Manzil: eng ko'p odam va kuchli og'riq. Glutensiz taklif kutadi.
  4. **Tuzat** — AI yordamchiga aniq buyruq: «Manzil kelgach, uni holatga saqla va qayta so'rama». Botning ikkinchi versiyasi — v2 chiqdi.
  5. **Qayta tingla** — v2 dan keyin yana fikr yig'asiz: shikoyat kamaydimi va endi nima birinchi?
- Tugma: ▶ Tinglashni boshlash → Keyingi qadam → → ✓ Iteratsiya tugadi
- O'ng panel — yorliq: Mijoz ko'radigan chat
  - Chat (AvtoPizza · bot · onlayn), boshida: mijoz: Margarita, Chilonzor 5 · bot: Manzilingizni yuboring · mijoz: Yozgan edim: Chilonzor 5
  - 5 qadamdan keyin: mijoz: Margarita, Chilonzor 5 · bot: Qabul qilindi: Margarita. Manzil: Chilonzor 5.
- Tugmalar: Orqaga · Iteratsiyani yuriting (N/5) → Davom etish

## 10 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: 100 foydalanuvchidan bittasi faqat o'ziga kerak bo'lgan narsani so'radi. Nima qilasiz?
  - ✔ Ko'pchilikka keraklisini qilaman, bu so'rov kutadi
  - Darrov qo'shaman: har bir so'rov bajarilishi shart
  - U foydalanuvchini bloklayman: u xalaqit beryapti
  - Hamma so'rovni navbati bilan, istisnosiz qo'shaman
- Javob izohlari:
  - To'g'ri: Vaqtni ko'pchilikka ta'sir qiladigan ishga sarflaysiz — tor so'rov kutadi.
  - Darrov qo'shaman: Har so'rovni qo'shsangiz, bot chalkashib ketadi va ko'pchilik uchun yomonlashadi.
  - Bloklayman: Foydalanuvchini bloklash — fikrdan qochish. Xushmuomalalik bilan «hozir emas» deyish kifoya.
  - Hamma so'rovni: Hammasini qo'shsangiz, bot ortiqcha og'irlashadi. Qaysi birini qilishni o'zingiz tanlaysiz.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 11 · 3 tuzoq
- Eyebrow: Ehtiyot · tuzoqlar
- Sarlavha: Fikrni qo'llashda 3 ta tuzoq bor.
- Mentor: Fikrni tinglash yaxshi, lekin uni noto'g'ri qo'llash botni buzadi. Mana 3 ta ko'p uchraydigan xato. Har birini bosing.
- Kartalar (bosilgani ✓ bilan belgilanadi va o'ngda ochiladi, bir vaqtda bittasi):
  - **Bir kishi — hamma emas** — Bir kishining taklifini darrov qo'shmang. Jiddiy bug'ni esa bir kishi aytsa ham tekshiring.
  - **Hamma taklifni qo'shish** — Har taklifni qo'shsangiz, bot og'irlashadi va chalkashadi. Botning asosiy ishida qoling.
  - **Maqtovni o'tkazib yuborish** — Aniq maqtov («tez yetkazdi») nima yaxshi ishlayotganini aytadi. Tuzatayotganda o'shani buzib qo'ymang.
- Xulosa (3/3 dan keyin): Fikr yo'l ko'rsatadi, lekin buyruq emas: uni saralab, o'lchab qo'llaysiz.
- Tugmalar: Orqaga · 3 tuzoqni ko'ring (N/3) → Davom etish

## 12 · Qayta o'lchash
- Eyebrow: O'lchash · natija
- Sarlavha: Tuzatdingiz — lekin ishladimi? Qayta o'lchaysiz.
- Mentor: Tuzatish — hali taxmin. Ishladimi — **qayta o'lchab** bilasiz: v2 chiqqandan keyin o'sha shikoyat kamaydimi? Tugmani bosing.
- Karta: «Manzilni qayta so'raydi» shikoyati
  - v1 (oldin) — 18
  - v2 (keyin) — ? → (bosilgach) 1
- Tugma: ▶ Yangi fikrlarni o'lchash → ✓ O'lchandi
- Natija (bosilgach): Shikoyat 18 dan 1 ga tushdi — tuzatish **ishladi**. Endi ro'yxat boshida **«narx ko'rinmaydi»** (12 kishi) — keyingi iteratsiya shu bilan boshlanadi.
- Tugmalar: Orqaga · Natijani tekshiring → Davom etish

## 13 · Aniq prompt yig'ing
- Eyebrow: Amaliyot · aniq prompt
- Sarlavha: «Narx ko'rinmaydi» — promptni o'zingiz yig'ing.
- Mentor: Sababi: buyurtma tasdiqlanganda bot narxni yozmaydi. AI yordamchiga (sinfda — gemini.google.com) prompt uch qismdan yig'iladi. Har qismga bittadan tanlang.
- Qismlar (navbat bilan; xato tanlangani ✕ oladi):
  1. Qayerda?
     - Butun botda
     - ✔ bot.js dagi buyurtma tasdig'i xabarida
     - Menyu tugmasida
  2. Nima o'zgarsin?
     - Narxlarni pasaytir
     - Tasdiq xabarini qisqartir
     - ✔ Tasdiq xabariga taom nomi va narxini qo'sh
  3. Nima buzilmasin?
     - ✔ Manzil bir marta so'ralishi o'zgarmasin
     - Menyu tugmalari olib tashlansin
     - Botni noldan qayta yoz
- Xato tanlansa (variantlar ostida):
  - Butun botda: Muammo faqat tasdiq xabarida — butun botni o'zgartirish shart emas.
  - Menyu tugmasida: Narx menyuda bor — yo'qolgani tasdiq xabarida.
  - Narxlarni pasaytir: Narx to'g'ri, faqat ko'rinmayapti.
  - Tasdiq xabarini qisqartir: Xabar qisqa emas — unda narx yo'q.
  - Menyu tugmalari olib tashlansin: Tugmalar ishlayapti — ularni olib tashlash yangi muammo.
  - Botni noldan qayta yoz: Ishlab turgan qismlar ham yo'qoladi.
- Bajarilgan qism qatori: ✓ **Qayerda** — bot.js dagi buyurtma tasdig'i xabarida ↻ · ✓ **Nima o'zgarsin** — Tasdiq xabariga taom nomi va narxini qo'sh ↻ · ✓ **Nima buzilmasin** — Manzil bir marta so'ralishi o'zgarmasin ↻
- O'ng panel — yig'ilayotgan prompt (tanlanmagan qism o'rnida «…»): bot.js dagi buyurtma tasdig'i xabarida narx yo'q. Tasdiq xabariga taom nomi va narxini qo'sh. Manzil bir marta so'ralishi o'zgarmasin.
- Tugma (uch qism tayyor bo'lgach): ▶ AI'ga yuborish → ✓ Tuzatildi
- Natija (yuborilgach) — yorliq: v3 — tuzatilgandan keyin
  - Chat (AvtoPizza · bot · onlayn): mijoz: Margarita, Chilonzor 5 · bot: Qabul qilindi: Margarita — 35 000 so'm. Manzil: Chilonzor 5.
- Tugmalar: Orqaga · Promptni yig'ing → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Eng katta shikoyatni tuzatib, yangi versiyani chiqardingiz. Endi nima qilasiz?
  - Ish tugadi: bot endi mukammal, fikr kerak emas
  - Qolgan hamma kodni ham birdaniga qayta yozaman
  - Fikr yig'ishni to'xtataman: ular faqat shovqin
  - ✔ Tuzatish ishladimi, yangi fikrlardan tekshiraman
- Javob izohlari:
  - To'g'ri: Har tuzatishdan keyin yana tinglaysiz — keyingi iteratsiya shundan boshlanadi.
  - Ish tugadi: Mukammal mahsulot bo'lmaydi: ehtiyojlar o'zgaradi, yangi muammolar chiqadi. Tinglashda davom eting.
  - Qayta yozaman: Hammasini birdan qayta yozish xavfli: ishlab turgan qismlar ham buzilishi mumkin. Yaxshilash bittadan, o'lchab boriladi.
  - To'xtataman: Tinglashni to'xtatsangiz, tuzatish ishladimi — bilmay qolasiz.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 15 · Iteratsiyani yig'ing (final)
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Oxirgi qadam: iteratsiya qadamlarini to'g'ri tartibda yig'ing.
- Mentor: Bo'laklarni sudrab to'g'ri tartibga qo'ying.
- Bo'laklar (aralash beriladi) — to'g'ri tartib:
  1. Tingla
  2. Guruhla
  3. Tanla
  4. Tuzat
  5. Qayta tingla
- Joylar: 1-qadam · 2-qadam · 3-qadam · 4-qadam · 5-qadam (bo'sh joyda: bu yerga qo'ying)
- Javob izohlari:
  - To'g'ri: ✓ Iteratsiya tayyor: **tingla → guruhla → tanla → tuzat → qayta tingla**. Keyin hammasi yangi fikrlar bilan yana boshlanadi.
  - Xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
  - Birinchi urinish xato bo'lgan bo'lsa (to'g'ri yig'ilgach): Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Iteratsiyani yig'ing → Davom etish

## 16 · Amaliyot · fikrlar ro'yxati
- Eyebrow: Amaliyot · fikrlar ro'yxati
- Sarlavha: O'z botingiz uchun fikrlar ro'yxatini tuzing
- Mentor: Bu topshiriqni **o'z kompyuteringizda** bajaring. Har qadamni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — Mentor kuzatib turadi.
- TOPSHIRIQ: Botingizga keladigan 5 ta fikrni matn fayliga yozing (masalan, `fikrlar.txt`), ularni aniq va noaniqqa ajrating va qaysi birini birinchi tuzatishni tanlang. Bugun kod yozmaysiz — faqat fikrlarni tahlil qilasiz.
- Qadamlar (navbat bilan; bajarilgani ✓ bilan qatorga yig'iladi, ↻ bilan qayta ochiladi):
  1. 5 ta fikr yozing: 8-darsda odamdan eshitgan javoblaringizdan yoki o'zingiz o'ylab (masalan: «tugma ishlamadi», «rahmat, ajoyib»).
  2. Har fikrni aniq yoki noaniq deb belgilang; noaniqiga aniqlashtiruvchi savol yozing.
  3. Aniqlari ichidan eng ko'p aytiladigan (chastota) va eng qiynaydiganini (ta'sir) toping.
  4. Shu fikrni bitta aniq o'zgarishga aylantiring.
  5. Aniq o'zgarishni AI uchun bitta gaplik prompt qilib yozing.
- Tugma (har qadamda): Bajardim
- Hammasi bajarilgach: ✓ Bajarildi — Mentorni kuting · Vazifa bajarildi. Mentor tekshirib, keyingi qadamga o'tkazadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- 18-ekran · Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.

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

- Yozuvlar: ↻ O'rganilmoqda · N · ✓ Bildim · N · tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Oxirida: ✓ Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun
- 19-ekran · Eyebrow: Tayyor
- Belgi: ✓ Botingizni yaxshiladingiz
- Sarlavha: Endi botingiz foydalanuvchi bilan birga o'sadi. (yonida ball halqasi)
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Endi siz bilasiz
  - Mahsulot bir versiya bilan tugamaydi — iteratsiya bilan yaxshilanib boradi
  - Aniq fikrda muammo va joy bor; noaniq fikrni avval aniqlashtirasiz
  - Qaysi birini birinchi tuzatish — chastota va ta'sirga qarab; «hozir emas» deyish ham qaror
  - Voronkadan eng katta yo'qotishni topib, o'sha qadamni birinchi tuzatasiz
  - Tuzatgandan keyin qayta o'lchaysiz — keyingi iteratsiya shundan boshlanadi
- Tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda: amaliyot · loyiha · mashq · natija)
- Uyga vazifa (bosilgach):
  - **Yig'ing** — botingizni kamida 3 kishiga sinatib ko'ring va 8-darsdagidek bo'lib o'tgan ishini so'rab, fikrlarini yozib oling
  - **Tanlang** — chastota va ta'sirga qarab qaysi birini birinchi tuzatishni belgilang
  - **Aylantiring** — eng muhim fikrni AI uchun aniq promptga aylantiring
- Keyingi dars — **«AI-agent yaratish».** Botga maqsad berasiz — keyingi qadamni u o'zi tanlab, asbob chaqiradi: masalan, buyurtmani bazaga saqlaydi.
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Yuqoridagi hisoblagich: Nishonlar — N/4
- **Feedback Sorter** — Aniq va noaniq fikrlarni birinchi urinishda to'g'ri saraladingiz (7-ekran)
- **Funnel Reader** — Voronkadagi eng katta yo'qotishni topdingiz (7-ekran)
- **Right Fix First** — Eng ta'sirli tuzatishni birinchi tanladingiz (7-ekran)
- **Full Iteration** — Iteratsiya qadamlarini birinchi urinishda to'g'ri tartibladingiz (15-ekran)
- Nishon olinganda: <nishon nomi> · <tavsif> · bosib davom eting

## Qisqa takrorlash oynalari
- Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. Fikr turlari — har biri o'z ishini talab qiladi (4-ekran)
   - 1 · Bug — tuzatiladi — «Bot manzilimni qayta so'radi» — bot **kutilgan ishni** bajarmayapti.
   - 2 · Taklif — o'ylab ko'riladi — Botda hali yo'q narsa so'ralsa, uni **darrov qo'shmaysiz**.
   - 3 · Maqtov — saqlanadi — Aniq maqtov nima yaxshi ishlayotganini ko'rsatadi, tuzatishda uni **buzmang**.
   - Sinfga savol: «Bot manzilimni 2 marta so'radi» — bu qanday fikr?
2. Ustuvorlik — chastota va ta'sir (8-ekran)
   - 1 · Bitta shikoyat — tasodif bo'lishi mumkin — Bir kishi aytgan narsaga **darrov ergashmang**.
   - 2 · Ko'pchilik va og'riq — birinchi — Eng ko'p odam aytgan **va** eng qattiq qiynagan muammo birinchi tuzatiladi.
   - 3 · «Hozir emas» ham qaror — Vaqt oz — kam ta'sirli fikrga **«hozir emas»** deyish botning asosiy ishini saqlaydi.
   - Sinfga savol: Nega hamma fikrni birdan qila olmaymiz?
3. Fokus — kimga foyda beradi (10-ekran)
   - 1 · Bir kishi — hamma emas — Bitta o'ziga xos so'rov **kamdan-kam** ko'pchilikka foyda beradi.
   - 2 · Hamma taklifni qo'shmang — Har taklifni qo'shsangiz, bot **chalkashadi va og'irlashadi**.
   - 3 · Ko'pchilikka foyda — birinchi — Vaqtni **ko'pchilikka ta'sir qiladigan** ishga sarflaysiz.
   - Sinfga savol: 100 kishidan bittasi tor so'rov aytsa — nima qilamiz?
4. Iteratsiya — tuzatishdan keyin ham davom etadi (14-ekran)
   - 1 · Tuzatish — taxmin — Ishladimi-yo'qmi, buni **qayta o'lchash** ko'rsatadi.
   - 2 · Qayta o'lchaysiz — Versiya chiqqach, o'sha shikoyat **kamaydimi** — tekshirasiz.
   - 3 · Keyingi iteratsiya — Tuzatgandan keyin ham **tinglashda davom etasiz** — bot shunday yaxshilanib boradi.
   - Sinfga savol: Eng katta shikoyatni tuzatdingiz — endi nima?
5. Iteratsiya — tartib muhim (15-ekran)
   - 1 · Avval — tingla — Mijozlar fikrini **yig'asiz**, hali hech narsani tuzatmaysiz.
   - 2 · Guruhla, keyin tanla — Bir xil fikrlarni **birlashtirasiz**, so'ng chastota va ta'sirga qarab **tanlaysiz**.
   - 3 · Tuzat va qayta tingla — Tuzatgandan keyin yana **tinglaysiz** — keyingi iteratsiya shu yerdan boshlanadi.
   - Chizma: Tingla → Guruhla → Tanla → Tuzat → Qayta tingla
   - Sinfga savol: Nega «tuzat» eng oxirgi qadam emas?

## Jonli viktorina (12 savol)
- Tugma (Yakun ekranida): CODE STRIKE · kutish holatida: Mentorni kuting
- Arena fonidagi so'zlar: iteratsiya · v2 · bug · taklif · chastota · ta'sir · voronka · ↻ · fikr

1. Foydalanuvchi: «/start bosdim, menyu tugmasi chiqmadi». Bu qanday fikr?
   - Maqtov: mijoz botdan mamnun
   - ✔ Bug: aniq joy va muammo bor
   - Taklif: yangi narsa so'ralgan
   - Shovqin: e'tibor shart emas
2. «Yaxshi bot» degan fikr nega kam foydali?
   - Chunki bu salbiy fikr
   - Chunki maqtov kam uchraydi
   - Chunki botni yomon ko'rsatadi
   - ✔ Chunki aniq joy aytilmagan
3. 18 kishi bir xil shikoyat qildi, 1 kishi boshqa narsani aytdi. Qaysi birini birinchi ko'rib chiqasiz?
   - ✔ 18 kishinikini: ko'pchilik aytgan
   - 1 kishinikini: u eng birinchi yozgan
   - Ikkalasini ham bir vaqtning o'zida
   - Hech birini: bular shunchaki hissiyot
4. Qaysi tuzatishni birinchi qilishni nimaga qarab tanlaysiz?
   - Eng jahl bilan yozilgan fikrga qarab
   - Eng birinchi kelgan fikrga qarab
   - ✔ Ko'p aytilgani va qattiq qiynaganiga
   - O'zimga eng qiziq tuyulganiga qarab
5. Voronkada eng katta yo'qotish qayerda ko'rinadi?
   - Eng ko'p odam turgan birinchi qadamda
   - ✔ Odam soni eng ko'p kamaygan joyda
   - Bot eng sekin javob bergan joyda
   - Eng ko'p maqtov kelgan qadamda
6. Menyu tugmasi tuzatilgach, menyuni ochmasdan ketganlar 60 dan 15 ga tushdi. Bu nimani bildiradi?
   - Tuzatish ishlamadi, hamma ketyapti
   - Sonlar tasodifiy, xulosa chiqmaydi
   - Botda yana yangi bug paydo bo'ldi
   - ✔ Tuzatish ishladi, muammo kamaydi
7. «Bot ahmoq» sharhiga javob yozish nega eng ta'sirli tuzatish emas?
   - ✔ Unda nimani tuzatish kerakligi yo'q
   - Bunday sharhga javob yozib bo'lmaydi
   - Uni yozgan odam botni ishlatmagan
   - Javob yozish juda ko'p vaqt oladi
8. 100 kishidan bittasi faqat o'ziga kerak narsani so'radi. Nima qilasiz?
   - Darrov qo'shaman: har so'rov bajarilsin
   - U foydalanuvchini botdan bloklayman
   - ✔ Avval ko'pchilikka keraklisini qilaman
   - Hamma so'rovni navbati bilan qo'shaman
9. Tuzatishdan keyin nima qilasiz?
   - Hech narsa: tuzatish albatta ishlaydi
   - ✔ Qayta o'lchayman: shikoyat kamaydimi
   - Darhol yana katta o'zgarish qilaman
   - Fikr yig'ishni butunlay to'xtataman
10. Botingizning birinchi versiyasi chiqdi. Ish tugadimi?
    - ✔ Yo'q: bot fikr bilan yaxshilanib boradi
    - Ha: birinchi versiya — tayyor mahsulot
    - Testlarning hammasi o'tib bo'lsa — tugadi
    - Bir hafta shikoyat kelmasa — tugadi
11. Noaniq fikr («menyu chalkash») aniq o'zgarishdan nimasi bilan farq qiladi?
    - Farqi yo'q, ikkalasi bir xil ishlatiladi
    - Noaniq fikr odatda yolg'on bo'ladi
    - Aniq o'zgarishni faqat dasturchi tushunadi
    - ✔ Fikr shikoyat, aniq o'zgarish esa vazifa
12. Aniq maqtovni («tez va qulay, rahmat!») nega e'tiborsiz qoldirmaysiz?
    - Chunki maqtovni ham tuzatish kerak
    - Chunki maqtov yozganga chegirma beriladi
    - ✔ Chunki u nima yaxshi ishlashini aytadi
    - Chunki maqtovda eng ko'p bug bo'ladi
