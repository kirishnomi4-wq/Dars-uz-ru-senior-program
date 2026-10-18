# 5-dars «Claude Skills — nima» — yakuniy matn

Fayl: `src/6-Modull/ClaudeSkillsLesson.jsx` · 20 ekran · Keyingi dars: «Ilova o'zi qaror qilsa, kimga tegadi?»
Holat: 05.10.2026 — kodga mos

## 0 · Kirish — har safar boshqacha
- Eyebrow: Dars · kirish
- Sarlavha: AI mahsulot tavsifini har safar boshqacha yozadi. Nega?
- Mentor: O'tgan darsda agentga maqsad va asboblar berdik. Lekin AI'ga ishni **qanday** bajarishni ham tushuntirish kerak. Tugmani bosing — muammoni ko'ring.
- Karta — Yo'riqnomasiz — har safar har xil:
  - tugma bosilguncha: …
  - tugma bosilgach:
    - 1-marta: «Bu ajoyib mahsulot bo'lib, sizga juda yoqadi va...» (uzun)
    - 2-marta: «Hamyon. Narxi 120000.» (quruq)
- Tugma: ▶ Ikki marta so'rab ko'rish → ✓ Muammoni ko'rdingiz
- Savol (tugma bosilgach faollashadi): AI har safar sizga kerakli uslubda yozishi uchun nima qilasiz?
  - Har safar uzun ko'rsatmani qaytadan yozaman
  - ✔ Ko'rsatmani bir marta yozib, saqlab qo'yaman
  - Iloji yo'q — AI har doim har xil yozadi
- Javob izohlari:
  - 2-variant: Aynan! Shunday saqlangan yozma yo'riqnomani Claude'da **Skill** deyishadi. Uni bir marta yozasiz, keyin Claude shu vazifada yo'riqnomaga qarab ishlaydi — natija siz xohlagan uslubga yaqin chiqadi. Bugun tayyor Skill'ni o'qib, tahlil qilamiz.
  - 1- va 3-variant: Qiziq fikr! Lekin har safar qaytadan yozish shart emas, «iloji yo'q» ham emas. Ko'rsatmani bir marta yozib, saqlab qo'yish mumkin — Claude'da buni **Skill** deyishadi. Bugun tayyor Skill'ni o'qib, tahlil qilamiz.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: AI'ga saqlanadigan yo'riqnoma beramiz: Claude Skill.
- Mentor: Skill — AI uchun **qayta ishlatiladigan yozma yo'riqnoma**. Bir xil ishni qayta-qayta qilayotgan bo'lsangiz, uni qanday bajarish kerakligini Skill qilib yozib qo'yasiz. Bugun tayyorini o'qib, qanday tuzilganini ko'ramiz.
- Chap — yorliq «dars davomida — shu Skill'ni o'qiymiz» · Kod oynasi «SKILL.md»:
```md
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

Misol: "Yengil charm hamyon Kundalik uchun ideal.
Atigi 120 000 so'm — Savatga qo'shing!"
```
- O'ng — Bugungi 4 qadam
  1. Skill nima — AI uchun yozma yo'riqnoma · tushuncha
  2. SKILL.md tuzilishi: frontmatter + body · tuzilish
  3. Claude Skill'ni qanday tanlaydi va ochadi · ishlash
  4. Tayyor Skill'ni tahlil qilish · tahlil
- Tugmalar (telefonda): 4 qadamni ko'rish · ↩ Skill'ni ko'rish
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Skill nima
- Eyebrow: Tushuncha · Skill
- Sarlavha: Skill — AI uchun yozma yo'riqnoma.
- Mentor: Yangi xodimni tasavvur qiling: unga «bizda bu ish shunday qilinadi» degan qo'llanma berasiz. Skill — xuddi shunday qo'llanma, faqat AI uchun. Tugmani bosing.
- Karta — Skill nima?: Bitta aniq vazifani qanday bajarishni tushuntiradigan yozma yo'riqnoma. U papkada saqlanadi: asosiy fayl — `SKILL.md`; kerak bo'lsa, yonida qo'shimcha fayllar ham turadi (namunalar, skriptlar).
- Tugma: Hayotdan misol? → ✓ Ko'rdingiz
- O'ng (tugma bosilgach):
  - **Musiqachiga:** nota — har ijroda kuy tanish chiqadi
  - **Xodimga:** ish qo'llanmasi — «bizda shunday qilinadi»
  - **AI'ga:** Skill — vazifani siz xohlagandek bajarish yo'riqnomasi
- Xulosa: Farqi: oddiy so'rov (prompt) — bir martalik gap; Skill — saqlanadigan, qayta ishlatiladigan yo'riqnoma. Endi uning ichini ochamiz.
- Tugmalar: Orqaga · Misolni ko'ring → Davom etish

## 3 · SKILL.md tuzilishi
- Eyebrow: Tuzilish · SKILL.md
- Sarlavha: SKILL.md qanday tuzilgan?
- Mentor: Mana mini-do'kon uchun haqiqiy Skill. Yuqorida — **frontmatter**: Skill haqida qisqa ma'lumot. Pastda — **body**: asosiy yo'riqnoma. Frontmatter ichidagi description qatorini alohida ko'ramiz. Har birini bosing.
- Kod oynasi «SKILL.md» — 1-ekrandagi fayl
- Qismlar (bosilgani ✓ bilan belgilanadi; o'ngda karta ochiladi, nomi yonida kod belgisi):
  - **Frontmatter** · `--- name / description ---` — Skill haqida qisqa ma'lumot. Faylning eng yuqorisida, ikki `---` chiziq orasida turadi. Ichida ikki majburiy maydon bor: `name` — nomi (kichik harflar va defis, masalan `mahsulot-tavsifi`) va `description`.
  - **description** · `description: ...` — Skill nima qiladi va qachon ishlatiladi. Claude Skill'ni tanlashda asosan shu qatorga qaraydi.
  - **Body** · `# qadamlar + misol` — Asosiy yo'riqnoma: AI bajaradigan qadamlar va misol. Claude Skill'ni ishlatishga qaror qilganda shu qismni to'liq o'qiydi.
- Xulosa (3/3 dan keyin): Oddiy matn fayl. Frontmatter Claude'ga «bu Skill nima va qachon kerak» deydi, body esa «ishni qanday bajarish»ni.
- Tugmalar: Orqaga · Uchalasini oching (N/3) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Skill Claude'ning ishiga qanday ta'sir qiladi?
  - Claude'ni shunchaki tezroq ishlashga majbur qiladi
  - Claude modelini boshqa, kuchliroq modelga almashtiradi
  - Claude'ni internetga ulab, yangi ma'lumot beradi
  - ✔ Vazifani qanday bajarish kerakligini aniq ko'rsatadi
- Javob izohlari:
  - To'g'ri: To'g'ri! Skill modelni o'zgartirmaydi — u Claude'ga shu vazifani qanday bajarishni aniq ko'rsatadi. Shuning uchun takroriy vazifalarda natija bir xil uslubga yaqin chiqadi.
  - 1-variant: Skill tezlik haqida emas — u ishni qanday bajarishni aniqlashtiradi.
  - 2-variant: Skill modelni almashtirmaydi — o'sha Claude yo'riqnomaga qarab ishlaydi.
  - 3-variant: Skill o'zi internetga ulamaydi — u yozma yo'riqnoma.
- Test yozuvlari (4, 8, 10, 14-ekran uchun bir xil): To'g'ri · Qaytadan urinib ko'ring · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <to'g'ri variant>
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish · Mentor o'tmagan bo'lsa: Mentorni kuting (izoh: Mentor hali bu sahifaga o'tmadi)

## 5 · description
- Eyebrow: Frontmatter · description
- Sarlavha: description bo'yicha Claude kerakli Skill'ni topadi.
- Mentor: Claude'da o'nlab Skill bo'lishi mumkin. U qaysi birini ishlatishni qayerdan biladi? Asosan **description**'dan. Tugmani bosing.
- Karta «description»: Mini-do'kon mahsulotlari uchun qisqa sotuvchi tavsif yozish. Mahsulot nomi berilganda ishlatiladi.
- Tugma: Nega muhim? → ✓ Ko'rdingiz
- O'ng (tugma bosilgach):
  - **Nima va qachon:** «qisqa sotuvchi tavsif yozish» — Skill nima qiladi; «mahsulot nomi berilganda» — qachon ishlatiladi.
  - Karta — Claude qanday tanlaydi: Claude oldindan faqat har bir Skill'ning nomi va description'ini ko'rib turadi. Vazifa shu description'ga mos deb topsa, Skill'ning to'liq matnini ochadi.
- Xulosa: Noaniq description → Claude Skill'ni kerakli paytda ishlatmasligi yoki noo'rin ishlatishi mumkin. Aniq description → to'g'ri paytda ishlatilish ehtimoli oshadi. Skill'ning ishga tushishini inglizcha **trigger** deyishadi.
- Tugmalar: Orqaga · Nega muhim? → Davom etish

## 6 · Body
- Eyebrow: Body · yo'riqnoma
- Sarlavha: Body — AI bajaradigan aniq qadamlar va misol.
- Mentor: Qadamlar qancha aniq bo'lsa, natija shuncha bir xil chiqadi. Tugmani bosing.
- Kod oynasi «SKILL.md (body)»:
```md
# Mahsulot tavsifi yozish
1. Aniq 3 jumla yoz.
2. Iliq, do'stona ohang, 1 ta emoji.
3. Materiali / asosiy ustunligini ayt.
4. Narxni eslat.
5. Oxirida: "Savatga qo'shing!"

Misol: "Yengil charm hamyon Kundalik uchun ideal.
Atigi 120 000 so'm — Savatga qo'shing!"
```
- Tugma: Nega bunday aniq? → ✓ Ko'rdingiz
- O'ng (tugma bosilgach):
  - **Raqamlangan qadamlar:** tartibni aniq ko'rsatadi — AI biror qadamni tashlab ketish ehtimoli kamayadi.
  - **Misol:** kutilgan natija qanday ko'rinishini ko'rsatadi — AI nimaga intilishni yaxshiroq tushunadi.
- Xulosa: Noaniq body («yaxshi tavsif yoz») → har xil natija. Aniq qadamlar + misol → natija bir xil uslubga yaqin.
- Tugmalar: Orqaga · Qadamlarni o'qing → Davom etish

## 7 · Claude o'rnida — Skill tanlash
- Eyebrow: Markaziy · Skill'ni tanlash
- Sarlavha: Claude o'rnida bo'ling
- Mentor: Avval Skill'siz javobni ko'ring — u umumiy chiqadi. Keyin uchta Skill'ning description'iga qarab, vazifaga mosini tanlang.
- Karta «vazifa»: «Charm hamyon uchun sotuvchi tavsif yoz»
- Chap — Skill'siz — umumiy javob:
  - tugma bosilguncha: …
  - tugma bosilgach: «Bu yuqori sifatli charm hamyon zamonaviy dizayni bilan ajralib turadi va uzoq muddat xizmat qiladi...» (uzun, narxsiz)
- Tugma: ▶ Skill'siz sinab ko'rish → ✓ Sinadingiz
- O'ng — yorliq «vazifaga mos Skill'ni tanlang» (Skill'siz sinagandan keyin faollashadi; har variantda nomi va description'i):
  - ✔ `mahsulot-tavsifi` — mahsulot uchun qisqa sotuvchi tavsif yozish
  - `mijoz-xati` — mijozga rasmiy xat yozish
  - `hisobot-sql` — sotuv hisoboti uchun SQL yozish
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
  - xatodan keyin: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Xato bo'lsa: Bu Skill'ning description'i boshqa ishga mos. Vazifa — mahsulot tavsifi. Mos Skill'ni tanlang.
- To'g'ri — karta «Skill bilan»: «Yengil va pishiq charm hamyon Kundalik uchun ideal. Atigi 120 000 so'm — Savatga qo'shing!» Bir xil AI, bir xil vazifa — lekin Skill natijani siz yozgan qoidalarga moslab berdi.
- Tugmalar: Orqaga · Avval Skill'siz sinang → To'g'ri Skill'ni tanlang → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: SKILL.md'dagi description nima uchun kerak?
  - ✔ Claude Skill'ni qaysi vazifada ishlatishni bilishi uchun
  - Skill faylini chiroyli va bezakli ko'rsatish uchun
  - Faqat odam o'qishi uchun — Claude uni ko'rmaydi
  - Qaysi AI modeli ishlashini tanlab berish uchun
- Javob izohlari:
  - To'g'ri: To'g'ri! Claude har bir Skill'ning description'ini oldindan ko'rib turadi va vazifa unga mos kelsa, o'sha Skill'ni ochadi. Description noaniq bo'lsa, Skill kerakli paytda ishlamasligi yoki noo'rin ishlashi mumkin.
  - 2-variant: description bezak emas — Claude shunga qarab Skill'ni tanlaydi.
  - 3-variant: Aksincha — Claude description'ni oldindan ko'rib turadi.
  - 4-variant: description modelni tanlamaydi — u Skill qachon kerakligini aytadi.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 9 · Skill va system prompt
- Eyebrow: Farq · Skill va system prompt
- Sarlavha: Skill system prompt'dan nimasi bilan farq qiladi?
- Mentor: Bot darslarida system prompt'ni ko'rgansiz — botga har suhbatda beriladigan doimiy ko'rsatma. Skill boshqacha: u faqat kerakli vazifada ochiladi. Tugmani bosing.
- Karta — system prompt: Har suhbatda doim yoqilgan ko'rsatma — AI qanday ohangda gapirishini belgilaydi. «Sen samimiy yordamchisan.»
- Tugma: Skill-chi? → ✓ Ko'rdingiz
- Karta (tugma bosilgach) — Skill: Bitta aniq vazifa uchun yo'riqnoma — faqat o'sha vazifa kelganda ochiladi. Skill'lar ko'p bo'lishi mumkin, har biri o'z ishi uchun.
- Xulosa: Sodda: **system prompt — AI umuman qanday tutishini belgilaydi (doim); Skill — AI bitta ishni qanday bajarishini belgilaydi (kerak bo'lganda).** Ikkalasi birga ishlaydi.
- Tugmalar: Orqaga · Farqni ko'ring → Davom etish

## 10 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Skill'ning to'liq matni (body) qachon o'qiladi?
  - Har bir so'rovda — hamma Skill doim to'liq ochiq
  - Faqat kechasi yoki belgilangan vaqtda
  - ✔ Claude vazifa shu Skill'ga mos deb topganda
  - Hech qachon — Claude faqat Skill nomini ko'radi
- Javob izohlari:
  - To'g'ri: To'g'ri! Claude oldindan faqat nom va description'ni ko'radi. To'liq matnni esa vazifa shu Skill'ga mos deb topgandagina o'qiydi. Buni progressive disclosure (bosqichma-bosqich ochish) deyishadi.
  - 1-variant: Hamma Skill'ni har so'rovda to'liq o'qish AI'ning ish joyini bekorga to'ldirardi. Faqat keraklisi ochiladi.
  - 2-variant: Vaqtga bog'liq emas — vazifa mos kelishiga bog'liq.
  - 4-variant: Body ham o'qiladi — lekin faqat kerak bo'lganda. Aks holda Skill foydasiz bo'lardi.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 11 · Skill'ning ochilishi
- Eyebrow: Tushuncha · Skill'ning ochilishi
- Sarlavha: Claude faqat kerakli Skill'ni ochadi.
- Mentor: Claude'da uchta Skill bor. U oldindan faqat ularning nomi va description'ini ko'rib turadi. Vazifa kelganda — mosini to'liq **ochadi**. Tugmani bosing.
- Karta: Vazifa: **«Charm hamyon uchun tavsif yoz»**
- Tugma: ▶ Vazifani yuborish → ✓ Skill ochildi
- O'ng — yorliq «Claude'dagi Skill'lar» (har kartada nomi va description'i):
  - `mahsulot-tavsifi` — mahsulot uchun qisqa sotuvchi tavsif yozish · ▸ 3 jumla, iliq ohang, narx, «Savatga qo'shing!»
  - `mijoz-xati` — mijozga rasmiy xat yozish
  - `hisobot-sql` — sotuv hisoboti uchun SQL yozish
  - Yuborilgach: mahsulot-tavsifi — ochildi ✓ · qolgan ikkitasi xira — yopiq
- Xulosa (yuborilgach): Faqat **mahsulot-tavsifi** ochildi — uning description'i vazifaga mos keldi. Qolganlari yopiq qoldi. Nega bu muhim? AI bir vaqtda cheklangan hajmdagi matnni o'qiy oladi — buni **kontekst oynasi** deyishadi. Keraksiz Skill'lar ochilmagani uchun bu joy muhim ishga qoladi.
- Tugmalar: Orqaga · Vazifani yuboring → Davom etish

## 12 · Tayyor Skill tahlili
- Eyebrow: Tahlil · tayyor Skill
- Sarlavha: Bu Skill yaxshimi? O'zingiz tahlil qiling.
- Mentor: Yaxshi Skill'ni yomonidan ajratish — muhim mahorat: 7-darsda o'zingiz yozasiz. 3 mezon bo'yicha tekshiring.
- Kod oynasi «SKILL.md» — 1-ekrandagi fayl
- Mezonlar (bosilgani ✓ bilan belgilanadi; o'ngda javob ochiladi):
  - **description aniqmi?** — Ha: «mahsulot tavsifi yozish, mahsulot nomi berilganda» — nima va qachon ekanini aytadi.
  - **Qadamlar aniqmi?** — Ha: 3 jumla, ohang, narx, yakun. AI taxmin qilishi kamayadi.
  - **Misol bormi?** — Ha: bitta tayyor misol. Misol AI'ga kutilgan natijani yaxshiroq tushunishga yordam beradi.
- Xulosa (3/3 dan keyin): **Yaxshi Skill = aniq description + aniq qadamlar + yaxshi misol.** Shu uchtasi bo'lsa, natija siz kutganga ancha yaqin chiqadi. 7-darsda o'zingiz shunday yozasiz.
- Tugmalar: Orqaga · Tahlil qiling (N/3) → Davom etish

## 13 · Qaysi vazifada ishga tushadi
- Eyebrow: Amaliy · qaysi vazifada
- Sarlavha: Bu Skill qaysi vazifada ishga tushadi?
- Mentor: Skill'ning description'i: «mahsulot uchun qisqa sotuvchi tavsif yozish, mahsulot nomi berilganda». Claude o'rnida bo'ling: uch vazifadan qaysi biri shu Skill'ni ochadi?
- Karta «mahsulot-tavsifi · description»: Mini-do'kon mahsulotlari uchun qisqa sotuvchi tavsif yozish. Mahsulot nomi berilganda ishlatiladi.
- Vazifalar (yonida «+»; to'g'risi tanlangach «✓»):
  - «Mijozga rasmiy uzr xati yoz»
  - ✔ «Yangi krossovka uchun sotuvchi tavsif yoz»
  - «Sotuv hisobotini SQL'da chiqar»
- Nishon sharti: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.
  - xatodan keyin: Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.
- Javob izohlari:
  - 1-variant: Bu — xat vazifasi. description mos kelmaydi, shuning uchun bu Skill ochilmaydi.
  - 3-variant: Bu — hisobot vazifasi, unga boshqa Skill kerak. description mos kelmaydi.
  - To'g'ri: To'g'ri! Vazifa description'ga mos — Claude shu Skill'ni ochadi. Aniq description Skill'ni kerakli paytda ishlatishga yordam beradi.
- Tugmalar: Orqaga · Mos vazifani tanlang → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Bir xil vazifani AI'ga qayta-qayta tushuntiryapsiz. Eng yaxshi yechim qaysi?
  - Har safar qo'lda, boshidan tushuntiraveraman
  - AI'dan bu vazifada butunlay voz kechaman
  - Kuchliroq, qimmatroq AI modelini olaman
  - ✔ Yo'riqnomani bir marta yozib, saqlab qo'yaman
- Javob izohlari:
  - To'g'ri: To'g'ri! Takrorlanadigan vazifa — Skill uchun eng yaxshi nomzod. Yo'riqnomani bir marta SKILL.md'ga yozasiz, keyin Claude shu vazifada unga qarab ishlaydi. Vaqt tejaladi, natija bir xil uslubga yaqin chiqadi.
  - 1-variant: Qo'lda qayta-qayta tushuntirish — vaqt isrofi, natija ham har xil.
  - 2-variant: Voz kechish — yechim emas.
  - 3-variant: Muammo model kuchida emas — sizga bir xil uslub kerak. Buni saqlangan yo'riqnoma (Skill) beradi.
- Test yozuvlari va tugmalar — 4-ekrandagidek.

## 15 · Yakuniy — tartibni yig'ing
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Skill qanday ishga tushadi?
- Mentor: Vazifa kelgan paytdan boshlang. Bo'laklarni to'g'ri tartibda joylang.
- Bo'laklar (aralash beriladi) — to'g'ri tartib:
  1. Vazifa keladi
  2. description mos keladi
  3. Skill ochiladi
  4. Yo'riqnomaga amal qilinadi
  5. Natija
- Joylar: 1 · 2 · 3 · 4 · 5 (bo'sh joyda: bu yerga qo'ying)
- To'g'ri yig'ilgach: ✓ Tartib tayyor: **Vazifa → description mos → Skill ochiladi → Yo'riqnomaga amal → Natija**. Claude Skill'ni shu tartibda ishlatadi.
  - birinchi urinish xato bo'lgan bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish
- Xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## 16 · Amaliyot · reja
- Eyebrow: Amaliyot · reja
- Sarlavha: O'z SKILL.md faylingiz rejasini tuzing
- Mentor: Bu topshiriqni **qog'ozda yoki kompyuteringizda** bajaring. Har bosqichni bajarib, belgilab boring. Tugagach **«Bajardim»** tugmasini bosing — ustoz kuzatib turadi.
- TOPSHIRIQ: Kundalik takrorlanadigan bitta vazifangizni tanlang va unga SKILL.md rejasini yozing. Hali faylni yaratmaysiz — faqat uning qismlarini rejalashtirasiz.
- Bosqichlar — belgilab boring (bosilgani ✓ bilan belgilanadi):
  1. Takrorlanadigan bitta vazifani tanlang (masalan: qisqa mahsulot tavsifi yozish)
  2. `name` bering — kichik harflar va defis bilan (masalan: `mahsulot-tavsifi`)
  3. `description` yozing — Skill nima qiladi va qachon ishlatiladi
  4. Body: 3–5 ta aniq qadam yozing
  5. Oxiriga bitta tayyor misol qo'shing — kutilgan natija qanday ko'rinishini ko'rsatsin
- Tugma: Yana N qadam → Bajardim → ✓ Bajarildi — ustozni kuting
- Bajarilgach (yashil): Zo'r! Vazifani bajardingiz. Ustoz tekshirib, keyingi qadamga o'tkazadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium)
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Claude Skill nima? | AI uchun qayta ishlatiladigan yozma yo'riqnoma | Bitta aniq vazifani qanday bajarishni tushuntiradi |
| Skill'ning asosiy fayli qanday nomlanadi? | SKILL.md | Papkada turadi; yonida qo'shimcha fayllar bo'lishi mumkin |
| SKILL.md qaysi ikki qismdan iborat? | Frontmatter va body | Frontmatter — qisqa ma'lumot, body — yo'riqnoma |
| Frontmatter faylning qayerida turadi? | Eng yuqorida, ikki --- chiziq orasida | Ichida name va description bo'ladi |
| name qanday yoziladi? | Kichik harflar va defis bilan | Masalan: mahsulot-tavsifi |
| Claude oldindan nimani ko'rib turadi? | Har Skill'ning nomi va description'i | To'liq matnni kerak bo'lganda ochadi |
| description'da nima yoziladi? | Skill nima qiladi va qachon ishlatiladi | Claude Skill'ni shunga qarab tanlaydi |
| Body ichida nima bo'ladi? | Aniq qadamlar va misol | Misol kutilgan natijani ko'rsatadi |
| To'liq body qachon o'qiladi? | Claude vazifa mos deb topganda | Qolgan Skill'lar yopiq qoladi |
| Faqat kerakli Skill'ning ochilishi qanday ataladi? | Progressive disclosure | Bosqichma-bosqich ochish — kontekst oynasi band bo'lmaydi |
| System prompt va Skill farqi? | System prompt — doim; Skill — kerak bo'lganda | System prompt umumiy ohangni, Skill bitta ishni belgilaydi |
| Qanday vazifa Skill uchun eng mos? | Takrorlanadigan vazifa | Bir marta yozasiz, ko'p marta ishlatasiz |

- Yozuvlar: ↻ O'rganilmoqda · N · ✓ Bildim · N · tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Skill o'qishni o'rgandingiz (yonida: N/5 to'g'ri)
- Sarlavha: Endi AI'ga aniq, saqlanadigan yo'riqnoma bera olasiz.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Endi siz bilasiz
  - Skill — AI uchun qayta ishlatiladigan yozma yo'riqnoma (asosiy fayli — SKILL.md)
  - Tuzilishi: frontmatter (name + description) + body (qadamlar + misol)
  - Claude oldindan faqat nom va description'ni ko'radi; to'liq matnni vazifa mos kelganda ochadi
  - description aniq bo'lsa, Skill kerakli paytda ishlaydi
  - Yaxshi Skill = aniq description + aniq qadamlar + yaxshi misol
- Tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda: amaliyot · loyiha · mashq · natija)
- Uyga vazifa (bosilgach):
  - **O'qing** — shu darsdagi yoki internetdagi bitta SKILL.md'ni o'qing
  - **Tahlil** — description aniqmi? qadamlar aniqmi? misol bormi?
  - **Rejalashtiring** — loyihangizda qaysi takrorlanadigan vazifaga Skill kerak?
  - Keyingi dars — «Ilova o'zi qaror qilsa, kimga tegadi?». Mini-do'koningizda ilova o'zi qilmaydigan ishlarni va ular kimga tegishini yozasiz.
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Yuqoridagi hisoblagich: N/4 · bosilganda: Badges — N/4 (har nishon nomi; olinmagani qulf bilan)
- **Right Skill** — Vazifaga mos Skill'ni description'dan topdingiz (7-ekran)
- **Right Trigger** — Skill qaysi vazifada ishga tushishini to'g'ri tanladingiz (13-ekran)
- **Before/After** — Skill'siz va Skill bilan farqni ko'rdingiz (7-ekran, bonus: to'g'ri Skill tanlanganda)
- **Skill Flow** — Skill ishlash tartibini to'g'ri yig'dingiz (15-ekran)
- Nishon olinganda: <nishon nomi> · <tavsif> · bosib davom eting
- Nishon yozuvlari (7, 13-ekran): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi — endi bemalol to'g'risini toping.

## Qisqa takrorlash oynalari
- Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. Skill — yozma yo'riqnoma (4-ekran)
   - Vazifani ko'rsatadi — Skill Claude'ga bitta vazifani **qanday bajarishni** ko'rsatadi.
   - Model o'zgarmaydi — Model o'zgarmaydi — o'sha Claude **yo'riqnomaga qarab** ishlaydi.
   - Uslubga yaqin natija — Natija **bir xil uslubga** yaqinlashadi.
   - Sinfga savol: Skill oddiy so'rovdan (prompt) nimasi bilan farq qiladi?
2. description — qachon kerak (8-ekran)
   - Oldindan ko'rinadi — Claude oldindan faqat nom va **description**'ni ko'radi.
   - Mos kelsa — ochiladi — Vazifa mos kelsa — Skill **ochiladi**.
   - Aniq bo'lishi kerak — Noaniq description → Skill kerakli paytda ishlamasligi mumkin.
   - Sinfga savol: Nega description aniq bo'lishi kerak?
3. Progressive disclosure (10-ekran)
   - Faqat mos Skill ochiladi — To'liq matn faqat vazifa **mos kelganda** ochiladi.
   - Joy bo'sh qoladi — Qolgan Skill'lar yopiq qoladi — **kontekst oynasi** band bo'lmaydi.
   - Hammasi birdaniga emas — Har so'rovda hammasini ochish — joyni bekorga to'ldirardi.
   - Sinfga savol: Body qachon o'qiladi?
4. Takror vazifa → Skill (14-ekran)
   - Bir marta yozasiz — Yo'riqnomani **bir marta** yozasiz.
   - Claude unga qarab ishlaydi — Claude shu vazifada **unga qarab** ishlaydi.
   - Vaqt tejaladi — Qayta-qayta tushuntirish kerak bo'lmaydi.
   - Sinfga savol: Qanday vazifa Skill uchun eng mos?
5. Skill ishlash tartibi (15-ekran)
   - Avval — vazifa — Avval **vazifa keladi**.
   - Keyin — mos Skill — description mos keladi → Skill **ochiladi** → yo'riqnomaga amal qilinadi.
   - Oxirida — natija — Oxirida natija.
     - Chizma: Vazifa → description → Skill → Amal → Natija
   - Sinfga savol: Nega tartib muhim?

## Jonli viktorina (12 savol)
- Tugma (Yakun ekranida): CODE STRIKE · kutish holatida: Mentorni kuting
- Arena fonidagi so'zlar: SKILL.md · description · trigger · name · body · frontmatter · Skill'siz→Skill · progressive · kontekst · uslub

1. Claude Skill nima?
   - Kuchliroq AI modelining nomi
   - Internetdan ma'lumot oladigan qidiruv
   - ✔ AI uchun qayta ishlatiladigan yo'riqnoma
   - Dasturning ikonka (belgi) fayli
2. SKILL.md qaysi ikki qismdan iborat?
   - ✔ Frontmatter va body
   - Rasm va ovoz fayllari
   - Parol va foydalanuvchi nomi
   - Server va Database manzili
3. description nima uchun kerak?
   - Skill'ni chiroyli ko'rsatish uchun
   - AI modelini almashtirish uchun
   - Faqat odam o'qishi uchun
   - ✔ Skill qachon kerakligini aytish uchun
4. Skill body'sida odatda nima bo'ladi?
   - Faqat Skill nomi
   - ✔ Aniq qadamlar va misol
   - Foydalanuvchi paroli
   - AI modelining versiyasi
5. Progressive disclosure nima?
   - Hamma Skill doim to'liq ochiq turadi
   - Skill faqat kechasi ishlaydi
   - Skill AI'ni tezlashtiradi
   - ✔ To'liq matn kerak bo'lganda ochiladi
6. Claude oldindan nimani ko'rib turadi?
   - ✔ Skill'lar nomi va description'ini
   - Har bir Skill'ning butun matnini
   - Foydalanuvchining eski suhbatlarini
   - Kompyuterdagi barcha fayllarni
7. Skill oddiy so'rov (prompt)dan nimasi bilan farq qiladi?
   - Skill — bir martalik gap
   - ✔ Skill saqlanadi va qayta ishlatiladi
   - Skill modelni kuchaytiradi
   - Skill internetga ulaydi
8. Yaxshi Skill'ning belgisi qaysi?
   - Uzun, chalkash matn
   - Faqat bitta so'z
   - ✔ Aniq description, qadamlar va misol
   - Ko'p rangli bezaklar va emoji
9. Qanday vazifa Skill uchun eng mos?
   - ✔ Qayta-qayta bajariladigan vazifa
   - Bir martagina bo'ladigan tasodifiy ish
   - Faqat rasm chizish
   - Faqat o'yin o'ynash
10. Skill natijaga qanday ta'sir qiladi?
    - Natijani har safar tasodifiy qiladi
    - Hech qanday ta'sir qilmaydi
    - AI'ni sekinlashtiradi
    - ✔ Natijani siz yozgan uslubga yaqinlashtiradi
11. System prompt va Skill farqi qaysi?
    - Ikkalasi ham aynan bir xil narsa
    - System prompt faqat kechasi ishlaydi
    - ✔ System prompt — doim; Skill — kerak bo'lganda
    - Skill — eng kuchli AI modelining nomi
12. Noaniq description qanday oqibatga olib keladi?
    - Skill ancha tezroq ishlaydi
    - ✔ Skill kerakli paytda ishlamasligi mumkin
    - AI modeli o'zi o'zgarib qoladi
    - Internet aloqasi uziladi
- Arena yozuvlari: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · O'quvchilar kutilmoqda… · Mentor testni boshlashini kuting… · ▶ Boshlash · Savol N/12 · Javob qabul qilindi — natijani kuting… · Savol N/12 — natija · +N ball · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling! · Siz hozir: N-o'rin · Keyingi → · Natijani ko'rish · Test yakunlandi! · N ball · N/12 to'g'ri · eng uzun streak N · ↻ Qayta ishlash · Siz — N-o'rin · N ball · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish · Arenani yopish
