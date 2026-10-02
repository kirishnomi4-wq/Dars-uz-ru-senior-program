# 6-Modul (LMS: 8-Modul) · 5-dars «Claude Skills — nima» — YANGI MATN (v2)

Fayl: `src/6-Modull/ClaudeSkillsLesson.jsx` · 20 ekran · faqat o'zbekcha
Eski matn: `05-ClaudeSkills-sozlar.md`. Har ekran ostida `✎` — nima o'zgargani.
Fidbek: qator yoniga `>> ...` yozing.
⚠️ To'g'ri javob O'RNI o'zgarmaydi (s4=4-variant, s8=1, s10=3, s14=4; arena kaliti o'zgarmaydi) — faqat matn.

---

## A. Claude Skills — texnik jihatdan to'g'ri tayanch (dars bo'yi shu)

1. **Skill** — bitta aniq vazifani qanday bajarishni tushuntiradigan, **qayta ishlatiladigan yozma yo'riqnoma**. U papkada saqlanadi: asosiy fayl — `SKILL.md`, kerak bo'lsa yonida qo'shimcha fayllar ham bo'ladi (namunalar, skriptlar).
2. **SKILL.md = frontmatter + body.** Frontmatter — fayl boshida, ikki `---` orasida; ikki majburiy maydon: `name` (kichik harflar, raqam va defis) va `description` (nima qiladi **va** qachon ishlatiladi). Body — qadamlar va misol.
3. **Claude Skill'ni qanday ishlatadi:** oldindan faqat har bir Skill'ning `name` va `description`'ini ko'rib turadi. Vazifa shu Skill'ga mos deb topsa, `SKILL.md`'ning to'liq matnini o'qiydi; qo'shimcha fayllarni faqat kerak bo'lganda ochadi (*progressive disclosure*).
4. **Qarorni Claude qiladi** — bu qat'iy mexanizm emas. Aniq description Skill'ni to'g'ri paytda ishlatish **ehtimolini** oshiradi.
5. **Natija:** Skill natijani **bir xil uslubga yaqinlashtiradi**, lekin AI har safar so'zma-so'z bir xil yozmaydi.

**Metafora:** faqat «yo'riqnoma / qo'llanma» (2-ekranda bir marta — xodim uchun qo'llanma). «Super-kuch kartasi, qahramon, jihozlash, kuch yonadi» — olib tashlanadi.
**Markaziy o'yin saqlanadi, lekin to'g'ri ma'noda:** o'quvchi «Claude o'rnida» description'larga qarab Skill tanlaydi — Claude aynan shunday ishlaydi.

---

## 0 · Kirish — har safar boshqacha  `[742]`
- Eyebrow: Dars · kirish
- Sarlavha: **AI'dan «mahsulot tavsifi yoz» dedingiz. Har safar boshqacha chiqyapti. Nega?**
- Mentor: O'tgan darsda agentga maqsad va asboblar berdik. Lekin AI'ga ishni *qanday* bajarishni ham tushuntirish kerak. Tugmani bosing — muammoni ko'ring.
- Blok: ❌ Yo'riqnomasiz — har safar har xil · 1-marta: «Bu ajoyib mahsulot bo'lib, sizga juda yoqadi va...» (uzun) · 2-marta: «Hamyon. Narxi 120000.» (quruq)
- Tugma: ▶ Ikki marta so'rab ko'rish → ✓ Muammoni ko'rdingiz
- Savol: **AI har safar sizga kerakli uslubda yozishi uchun nima qilasiz?**
  - Har safar uzun ko'rsatmani qaytadan yozaman
  - Ko'rsatmani bir marta yozib, saqlab qo'yaman
  - Iloji yo'q — AI har doim har xil yozadi
- Javob — 2-variant: **Aynan!** Shunday saqlangan yozma yo'riqnomani Claude'da **Skill** deyishadi. Uni bir marta yozasiz, keyin Claude shu vazifada yo'riqnomaga qarab ishlaydi — natija siz xohlagan uslubga yaqin chiqadi. Bugun tayyor Skill'ni o'qib, tahlil qilamiz.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Lekin har safar qaytadan yozish shart emas, «iloji yo'q» ham emas. Ko'rsatmani bir marta yozib, saqlab qo'yish mumkin — Claude'da buni **Skill** deyishadi. Bugun tayyor Skill'ni o'qib, tahlil qilamiz.

✎ 🔴 FAKT: «AI maslahatchini o'tgan darsda ko'rdik» → o'tgan dars agent haqida edi · «Bir marta yozasiz — AI har safar **aynan** shunga amal qiladi» → «uslubga yaqin chiqadi» (AI har safar so'zma-so'z bir xil yozmaydi) · to'g'ri variantda «(Skill)» so'zi javobni ochib qo'yardi — olib tashlandi · javob tanlovga qarab ikki xil

## 1 · Reja  `[784]`
- Sarlavha: **AI'ga saqlanadigan yo'riqnoma beramiz: Claude Skill.**
- Mentor: Skill — AI uchun qayta ishlatiladigan yozma yo'riqnoma. Bir xil ishni qayta-qayta qilayotgan bo'lsangiz, uni qanday bajarish kerakligini Skill qilib yozib qo'yasiz. Bugun tayyorini o'qib, qanday tuzilganini ko'ramiz.
- SKILL.md — o'zgarmaydi (texnik jihatdan to'g'ri: `name` kichik harf va defis bilan, `description` nima va qachon ekanini aytadi, body'da qadamlar va misol bor)
- Bugungi 4 qadam:
  1. Skill nima — AI uchun yozma yo'riqnoma · *tushuncha*
  2. SKILL.md tuzilishi: frontmatter + body · *tuzilish*
  3. Claude Skill'ni qanday tanlaydi va ochadi · *ishlash*
  4. Tayyor Skill'ni tahlil qilish · *tahlil*

✎ «Skill — bu zamonaviy va juda foydali narsa», «AI-ishchingizga» olib tashlandi · markaziy jumla qo'yildi

## 2 · Skill — yozma yo'riqnoma  `[819]`
- Sarlavha: **Skill — AI uchun yozma yo'riqnoma.**
- Mentor: Yangi xodimni tasavvur qiling: unga «bizda bu ish shunday qilinadi» degan qo'llanma berasiz. Skill — xuddi shunday qo'llanma, faqat AI uchun. Tugmani bosing.
- Blok: 📋 **Skill nima?** — Bitta aniq vazifani qanday bajarishni tushuntiradigan yozma yo'riqnoma. U papkada saqlanadi: asosiy fayl — `SKILL.md`; kerak bo'lsa, yonida qo'shimcha fayllar ham turadi (namunalar, skriptlar).
- Misollar: 🎵 **Musiqachiga:** nota — har ijroda kuy tanish chiqadi · 🧑‍💼 **Xodimga:** ish qo'llanmasi — «bizda shunday qilinadi» · 🤖 **AI'ga:** Skill — vazifani siz xohlagandek bajarish yo'riqnomasi
- Xulosa: Farqi: oddiy so'rov (prompt) — bir martalik gap; Skill — saqlanadigan, qayta ishlatiladigan yo'riqnoma. Endi uning ichini ochamiz.

✎ «muayyan» → «bitta aniq» · Skill = papka (SKILL.md + kerak bo'lsa boshqa fayllar) aniq aytildi

## 3 · SKILL.md tuzilishi  `[853]`
- Sarlavha: **SKILL.md'ning ikki asosiy qismi bor: frontmatter va body.**
- Mentor: Mana mini-do'kon uchun haqiqiy Skill. Yuqorida — frontmatter, ya'ni Skill haqida qisqa ma'lumot. Pastda — body, ya'ni asosiy yo'riqnoma. Frontmatter ichidagi description qatori alohida muhim, shuning uchun uni ham alohida ko'ramiz. Har birini bosing.
- Bo'limlar:
  - **Frontmatter** `--- name / description ---` — Skill haqida qisqa ma'lumot. Faylning eng yuqorisida, ikki `---` chiziq orasida turadi. Ichida ikki majburiy maydon bor: `name` — nomi (kichik harflar va defis, masalan `mahsulot-tavsifi`) va `description`.
  - **description** `description: ...` — Skill nima qiladi va qachon ishlatiladi. Claude Skill'ni tanlashda asosan shu qatorga qaraydi.
  - **Body** `# qadamlar + misol` — asosiy yo'riqnoma: AI bajaradigan qadamlar va misol. Claude Skill'ni ishlatishga qaror qilganda shu qismni to'liq o'qiydi.
- Xulosa: Oddiy matn fayl. Frontmatter Claude'ga «bu Skill nima va qachon kerak» deydi, body esa «ishni qanday bajarish»ni.
- Tugma: Uchalasini oching (0/3) → Davom etish

✎ 🔴 Sarlavha «3 qismi bor», Mentor «ikki qismdan iborat» deb bir-biriga zid edi → «ikki asosiy qism», description — frontmatter ichidagi qator · `name` qoidasi qo'shildi (7-darsda o'zi yozadi) · «Claude buni DOIM ko'radi» → 5-ekranga, aniq shaklda · «pasport» olib tashlandi

## 4 · 1-savol ✅  `[1068]`
- Savol: **Skill Claude'ning ishiga qanday ta'sir qiladi?**
  - Claude'ni shunchaki tezroq ishlashga majbur qiladi
  - Claude modelini boshqa, kuchliroq modelga almashtiradi
  - Claude'ni internetga ulab, yangi ma'lumot beradi
  - ✔ Vazifani qanday bajarish kerakligini aniq ko'rsatadi
- To'g'ri: To'g'ri! Skill modelni o'zgartirmaydi — u Claude'ga shu vazifani qanday bajarishni aniq ko'rsatadi. Shuning uchun takroriy vazifalarda natija bir xil uslubga yaqin chiqadi.
- Xato izohlari:
  - Skill tezlik haqida emas — u ishni qanday bajarishni aniqlashtiradi.
  - Skill modelni almashtirmaydi — o'sha Claude yo'riqnomaga qarab ishlaydi.
  - Skill o'zi internetga ulamaydi — u yozma yo'riqnoma.
  - (umumiy) Skill Claude'ga vazifani qanday bajarishni ko'rsatadi.

✎ 🔴 To'g'ri javobda darsda hali tushuntirilmagan «Super-kuch kartasi» bor edi va u eng uzun variant edi → javobni ochib qo'yardi · variantlar tenglashtirildi

## 5 · description  `[888]`
- Eyebrow: Frontmatter · description
- Sarlavha: **description — Claude'ga kerakli Skill'ni topishga yordam beradigan qator.**
- Mentor: Claude'da o'nlab Skill bo'lishi mumkin. U qaysi birini ishlatishni qayerdan biladi? Asosan description'dan. Tugmani bosing.
- Karta «description»: Mini-do'kon mahsulotlari uchun qisqa sotuvchi tavsif yozish. Mahsulot nomi berilganda ishlatiladi.
- Tugma: Nega muhim? → ✓ Ko'rdingiz
- Ochilgach:
  - 🔍 **Nima va qachon:** «qisqa sotuvchi tavsif yozish» — Skill nima qiladi; «mahsulot nomi berilganda» — qachon ishlatiladi.
  - 💡 **Claude qanday tanlaydi:** Claude oldindan faqat har bir Skill'ning nomi va description'ini ko'rib turadi. Vazifa shu description'ga mos deb topsa, Skill'ning to'liq matnini ochadi.
- Xulosa: Noaniq description → Claude Skill'ni kerakli paytda ishlatmasligi yoki noo'rin ishlatishi mumkin. Aniq description → to'g'ri paytda ishlatilish ehtimoli oshadi. Skill'ning ishga tushishini inglizcha **trigger** deyishadi.

✎ «eng muhim qator» → «Skill'ni topishga yordam beradigan qator» (body ham muhim) · «DOIM faqat… (arzon)… faqat vazifa mos kelganda yuklanadi» → Claude'ning qarori sifatida, qat'iy mexanizm emas · «arzon» olib tashlandi (11-ekranda nega kerakligi tushuntiriladi) · «trigger» shu yerda bir marta izohlandi — 7-darsda izohsiz ishlatiladi

## 6 · Body — aniq qadamlar  `[921]`
- Sarlavha: **Body — AI bajaradigan aniq qadamlar va misol.**
- Mentor: Body — Skill'ning asosiy yo'riqnomasi: qadamma-qadam ko'rsatma va misol. Qadamlar qancha aniq bo'lsa, natija shuncha bir xil chiqadi. Tugmani bosing.
- Fayl «SKILL.md (body)» — o'zgarmaydi
- Tugma: Nega bunday aniq? → ✓ Ko'rdingiz
- Ochilgach:
  - 🔢 **Raqamlangan qadamlar:** tartibni aniq ko'rsatadi — AI biror qadamni tashlab ketish ehtimoli kamayadi.
  - ✨ **Misol:** kutilgan natija qanday ko'rinishini ko'rsatadi — AI nimaga intilishni yaxshiroq tushunadi.
- Xulosa: Noaniq body («yaxshi tavsif yoz») → har xil natija. Aniq qadamlar + misol → natija bir xil uslubga yaqin.

✎ «AI ularni aniq bajaradi — hech narsa tashlab ketmaydi» (kafolat berib bo'lmaydi) → «ehtimoli kamayadi» · «Misol — AI uchun eng kuchli ko'rsatma» → «kutilgan natijani ko'rsatadi»

## 7 · Skill'ni tanlang (markaziy o'yin, nishon)  `[1094]`
- Eyebrow: Markaziy · Skill'ni tanlash
- Sarlavha: **Avval Skill'siz sinang, keyin Claude o'rnida to'g'ri Skill'ni tanlang.**
- Mentor: Skill'siz Claude umumiy javob beradi — avval shuni ko'ring. Keyin Claude o'rnida bo'ling: uchta Skill'ning description'iga qarab, vazifaga mosini tanlang.
- Vazifa: «Charm hamyon uchun sotuvchi tavsif yoz»
- Blok: ❌ **Skill'siz — umumiy javob** → «Bu yuqori sifatli charm hamyon zamonaviy dizayni bilan ajralib turadi va uzoq muddat xizmat qiladi...» (uzun, narxsiz)
- Tugma: ▶ Skill'siz sinab ko'rish → ✓ Sinadingiz
- Yorliq: vazifaga mos Skill'ni tanlang (har birida description ko'rinadi)
  - ✔ `mahsulot-tavsifi` — mahsulot uchun qisqa sotuvchi tavsif yozish
  - `mijoz-xati` — mijozga rasmiy xat yozish
  - `hisobot-sql` — sotuv hisoboti uchun SQL yozish
- Xato: Bu Skill'ning description'i boshqa ishga mos. Vazifa — mahsulot tavsifi. Mos Skill'ni tanlang.
- To'g'ri: ✅ **Skill bilan** — «Yengil va pishiq charm hamyon 👜 Kundalik uchun ideal. Atigi 120 000 so'm — Savatga qo'shing!» Bir xil AI, bir xil vazifa — lekin Skill natijani siz yozgan qoidalarga moslab berdi.
- Tugma: Avval Skill'siz sinang → To'g'ri Skill'ni tanlang → Davom etish

✎ «Qahramonni kartasiz sinang, kartani jihozlang» → «Claude o'rnida Skill tanlang». O'yin o'zgarmaydi, lekin endi to'g'ri ma'noni o'rgatadi: Skill'ni odam «jihozlamaydi», Claude uni description'ga qarab o'zi tanlaydi. Har tugma ostiga description qo'shildi — tanlash aynan shunga qarab bo'ladi

## 8 · 2-savol ✅  `[1151]`
- Savol: **SKILL.md'dagi description nima uchun kerak?**
  - ✔ Claude Skill'ni qaysi vazifada ishlatishni bilishi uchun
  - Skill faylini chiroyli va bezakli ko'rsatish uchun
  - Faqat odam o'qishi uchun — Claude uni ko'rmaydi
  - Qaysi AI modeli ishlashini tanlab berish uchun
- To'g'ri: To'g'ri! Claude har bir Skill'ning description'ini oldindan ko'rib turadi va vazifa unga mos kelsa, o'sha Skill'ni ochadi. Description noaniq bo'lsa, Skill kerakli paytda ishlamasligi yoki noo'rin ishlashi mumkin.
- Xato izohlari:
  - description bezak emas — Claude shunga qarab Skill'ni tanlaydi.
  - Aksincha — Claude description'ni oldindan ko'rib turadi.
  - description modelni tanlamaydi — u Skill qachon kerakligini aytadi.
  - (umumiy) description — Skill qaysi vazifada kerakligini bildiradi.

✎ To'g'ri javob eng uzun va yagona «mos kelsa / yonadi» so'zli variant edi → tenglashtirildi · «kartaning qachon yonadi maydoni» → oddiy ta'rif

## 9 · Skill va system prompt  `[961]`
- Eyebrow: Farq · Skill va system prompt
- Sarlavha: **Skill system prompt'dan nimasi bilan farq qiladi?**
- Mentor: Bot darslarida system prompt'ni ko'rgansiz — botga har suhbatda beriladigan doimiy ko'rsatma. Skill boshqacha: u faqat kerakli vazifada ochiladi. Tugmani bosing.
- Blok «system prompt»: Har suhbatda doim yoqilgan ko'rsatma — AI qanday ohangda gapirishini belgilaydi. «Sen samimiy yordamchisan.»
- Tugma: Skill-chi? → ✓ Ko'rdingiz
- Ochilgach 📋 **Skill:** Bitta aniq vazifa uchun yo'riqnoma — faqat o'sha vazifa kelganda ochiladi. Skill'lar ko'p bo'lishi mumkin, har biri o'z ishi uchun.
- Xulosa: Sodda: **system prompt — AI umuman qanday tutishini belgilaydi (doim); Skill — AI bitta ishni qanday bajarishini belgilaydi (kerak bo'lganda).** Ikkalasi birga ishlaydi.

✎ 🔴 FAKT: «Modul 8'da system prompt'ni ko'rdik» — system prompt bot darslarida («Bot ichida AI») o'tilgan; modul raqami o'quvchiga chalkash → «Bot darslarida» · «doimiy shaxs», «kerakda», «muayyan» → sodda so'zlar

## 10 · 3-savol ✅  `[1171]`
- Savol: **Skill'ning to'liq matni (body) qachon o'qiladi?**
  - Har bir so'rovda — hamma Skill doim to'liq ochiq
  - Faqat kechasi yoki belgilangan vaqtda
  - ✔ Claude vazifa shu Skill'ga mos deb topganda
  - Hech qachon — Claude faqat Skill nomini ko'radi
- To'g'ri: To'g'ri! Claude oldindan faqat nom va description'ni ko'radi. To'liq matnni esa vazifa shu Skill'ga mos deb topgandagina o'qiydi. Buni **progressive disclosure** (bosqichma-bosqich ochish) deyishadi.
- Xato izohlari:
  - Hamma Skill'ni har so'rovda to'liq o'qish AI'ning ish joyini bekorga to'ldirardi. Faqat keraklisi ochiladi.
  - Vaqtga bog'liq emas — vazifa mos kelishiga bog'liq.
  - Body ham o'qiladi — lekin faqat kerak bo'lganda. Aks holda Skill foydasiz bo'lardi.
  - (umumiy) Body Claude vazifa mos deb topganda o'qiladi.

✎ To'g'ri javob eng uzuni edi va «kuch yonadi» metaforasi bor edi → tenglashtirildi · «arzon», «qimmat» → 11-ekrandagi aniq tushuntirish

## 11 · Faqat kerakli Skill ochiladi  `[991]`
- Eyebrow: Tushuncha · Skill'ning ochilishi
- Sarlavha: **Claude faqat kerakli Skill'ni ochadi.**
- Mentor: Claude'da uchta Skill bor. U oldindan faqat ularning nomi va description'ini ko'rib turadi. Vazifa kelganda — mosini to'liq ochadi. Tugmani bosing.
- Vazifa: 📩 «Charm hamyon uchun tavsif yoz» · Tugma: ▶ Vazifani yuborish → ✓ Skill ochildi
- Yorliq: Claude'dagi Skill'lar — `mahsulot-tavsifi` (ochildi ✓) · `mijoz-xati` (yopiq) · `hisobot-sql` (yopiq)
- Xulosa: Faqat **mahsulot-tavsifi** ochildi — uning description'i vazifaga mos keldi. Qolganlari yopiq qoldi. Nega bu muhim? AI bir vaqtda cheklangan hajmdagi matnni o'qiy oladi — buni **kontekst oynasi** deyishadi. Keraksiz Skill'lar ochilmagani uchun bu joy muhim ishga qoladi.

✎ «Animatsiya · yuklanish» (ichki yorliq ekranga chiqib qolgan edi) → «Tushuncha · Skill'ning ochilishi» · «tez va arzon» → nega kerakligining haqiqiy sababi (kontekst oynasi) · «skilllar javoni» → «Claude'dagi Skill'lar»

## 12 · Skill'ni tahlil  `[1032]`
- Sarlavha: **Bu Skill yaxshimi? O'zingiz tahlil qiling.**
- Mentor: Yaxshi Skill'ni yomonidan ajratish — muhim mahorat: 7-darsda o'zingiz yozasiz. 3 mezon bo'yicha tekshiring.
✎ 🔴 FAKT (razrabotkada topildi, F-0929-25): «keyingi darsda» → «7-darsda» — keyingi dars 6-dars (PM); Skill yozish 7-darsda. ru ham shunday — RU bosqichida tuzatiladi
- Mezonlar:
  - **description aniqmi?** — Ha: «mahsulot tavsifi yozish, mahsulot nomi berilganda» — nima va qachon ekanini aytadi.
  - **Qadamlar aniqmi?** — Ha: 3 jumla, ohang, narx, yakun. AI taxmin qilishi kamayadi.
  - **Misol bormi?** — Ha: bitta tayyor misol. Misol AI'ga kutilgan natijani yaxshiroq tushunishga yordam beradi.
- Xulosa (katta formula): **Yaxshi Skill = aniq description + aniq qadamlar + yaxshi misol.** Shu uchtasi bo'lsa, natija siz kutganga ancha yaqin chiqadi. 7-darsda o'zingiz shunday yozasiz.

✎ «Claude adashmaydi», «AI uni xatosiz bajaradi» (kafolat) → «ehtimoli», «ancha yaqin» · formula ajratib ko'rsatildi (auditda ham eng kuchli joy deb topilgan)

## 13 · Bu Skill qaysi vazifada ishlaydi (nishon)  `[1197]`
- Eyebrow: Amaliy · qaysi vazifada
- Sarlavha: **Bu Skill qaysi vazifada ishga tushadi?**
- Mentor: Skill'ning description'i: «mahsulot uchun qisqa sotuvchi tavsif yozish, mahsulot nomi berilganda». Claude o'rnida bo'ling: uch vazifadan qaysi biri shu Skill'ni ochadi?
- Karta: 📄 `mahsulot-tavsifi` · description — Mini-do'kon mahsuloti uchun qisqa sotuvchi tavsif yozish. Mahsulot nomi berilganda ishlatiladi.
- Variantlar:
  - «Mijozga rasmiy uzr xati yoz» → Bu — xat vazifasi. description mos kelmaydi, shuning uchun bu Skill ochilmaydi.
  - ✔ «Yangi krossovka uchun sotuvchi tavsif yoz»
  - «Sotuv hisobotini SQL'da chiqar» → Bu — hisobot vazifasi, unga boshqa Skill kerak. description mos kelmaydi.
- To'g'ri: ✅ To'g'ri! Vazifa description'ga mos — Claude shu Skill'ni ochadi. Aniq description Skill'ni kerakli paytda ishlatishga yordam beradi.

✎ «Kuch qaysi vaziyatda yonadi», «to'g'ri trigger» (izohsiz) → sodda sarlavha

## 14 · 4-savol ✅  `[1239]`
- Savol: **Bir xil vazifani AI'ga qayta-qayta tushuntiryapsiz. Eng yaxshi yechim qaysi?**
  - Har safar qo'lda, boshidan tushuntiraveraman
  - AI'dan bu vazifada butunlay voz kechaman
  - Kuchliroq, qimmatroq AI modelini olaman
  - ✔ Yo'riqnomani bir marta yozib, saqlab qo'yaman
- To'g'ri: To'g'ri! Takrorlanadigan vazifa — Skill uchun eng yaxshi nomzod. Yo'riqnomani bir marta SKILL.md'ga yozasiz, keyin Claude shu vazifada unga qarab ishlaydi. Vaqt tejaladi, natija bir xil uslubga yaqin chiqadi.
- Xato izohlari:
  - Qo'lda qayta-qayta tushuntirish — vaqt isrofi, natija ham har xil.
  - Voz kechish — yechim emas.
  - Muammo model kuchida emas — sizga bir xil uslub kerak. Buni saqlangan yo'riqnoma (Skill) beradi.
  - (umumiy) Takrorlanadigan vazifaga — Skill yozish.

✎ To'g'ri javobda yagona «SKILL.md» so'zi va eng uzun matn bor edi → tenglashtirildi

## 15 · Tartibni yig'ing ✅ (final)  `[1259]`
- Sarlavha: **Oxirgi qadam: Skill qanday ishga tushishini to'g'ri tartibda yig'ing.**
- Mentor: Vazifa kelganda Skill qanday ishga tushadi? Bo'laklarni to'g'ri tartibda joylang.
- Bo'laklar: Vazifa keladi · description mos keladi · Skill ochiladi · Yo'riqnomaga amal qilinadi · Natija
- Joylar: har katakda raqam (1…5) + «bu yerga qo'ying»
✎ QAROR F-0929-27 (29.09, foydalanuvchi Q1-B): katak izohi «bu yerga qo'ying» — katakda raqam allaqachon bor, «1 · 1-qadam» takrorlanardi; joylashuv ikki ustun (kataklar chapda, bo'laklar o'ngda)
- Xato: ⚠️ Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- To'g'ri (bir marta): ✓ Tartib tayyor: **Vazifa → description mos → Skill ochiladi → Yo'riqnomaga amal → Natija**. Claude Skill'ni shu tartibda ishlatadi.

✎ 🔴 Mentor gapi butun tartibni aytib qo'yardi («vazifa keladi → description mos → …») — olib tashlandi (1, 3, 4-darslardagi xato bilan bir xil) · to'g'ri javob matni ikki marta chiqardi → bir marta · uch xil xato-yozuv → bitta · «Karta yuklanadi», «Izchil natija» → «Skill ochiladi», «Natija»

## 16 · Amaliyot · reja  `[2151]`
- Sarlavha: **O'z SKILL.md faylingiz rejasini tuzing**
- Mentor: Bu topshiriqni qog'ozda yoki kompyuteringizda bajaring. Har bosqichni bajarib, belgilab boring. Tugagach «Bajardim» tugmasini bosing — ustoz kuzatib turadi.
- Topshiriq: Kundalik takrorlanadigan bitta vazifangizni tanlang va unga SKILL.md rejasini yozing. Hali faylni yaratmaysiz — faqat uning qismlarini rejalashtirasiz.
- Bosqichlar:
  1. Takrorlanadigan bitta vazifani tanlang (masalan: qisqa mahsulot tavsifi yozish)
  2. `name` bering — kichik harflar va defis bilan (masalan: `mahsulot-tavsifi`)
  3. `description` yozing — Skill nima qiladi va qachon ishlatiladi
  4. Body: 3–5 ta aniq qadam yozing
  5. Oxiriga bitta tayyor misol qo'shing — kutilgan natija qanday ko'rinishini ko'rsatsin

✎ «super-kuch kartasi», «karta QACHON yonadi (eng muhim qator)» → texnik nomlar · `name` qoidasi qo'shildi

## 17 · Natijalar (podium)  `[1897]` — o'zgarmaydi (umumiy shablon)

## 18 · Takrorlash (kartochkalar)  `[2179]`

| Old tomon | Orqa | Izoh |
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

✎ «super-kuch kartasi», «pasport», «arzon: ikki qator, xolos», «eng muhim qator» olib tashlandi · qo'shildi: `name` qoidasi, «description'da nima yoziladi»

## 19 · Yakun  `[2192]`
- Sarlavha: **Endi AI'ga aniq, saqlanadigan yo'riqnoma bera olasiz.**
- Endi siz bilasiz:
  - Skill — AI uchun qayta ishlatiladigan yozma yo'riqnoma (asosiy fayli — SKILL.md)
  - Tuzilishi: frontmatter (name + description) + body (qadamlar + misol)
  - Claude oldindan faqat nom va description'ni ko'radi; to'liq matnni vazifa mos kelganda ochadi
  - description aniq bo'lsa, Skill kerakli paytda ishlaydi
  - Yaxshi Skill = aniq description + aniq qadamlar + yaxshi misol
- Uyga vazifa:
  - **O'qing** — shu darsdagi yoki internetdagi bitta SKILL.md'ni o'qing
  - **Tahlil** — description aniqmi? qadamlar aniqmi? misol bormi?
  - **Rejalashtiring** — loyihangizda qaysi takrorlanadigan vazifaga Skill kerak?
- 🚀 Keyingi dars — «Ilova o'zi qaror qilsa, kimga tegadi?». Mini-do'koningizda ilova o'zi qilmaydigan ishlarni va ular kimga tegishini yozasiz.
✎ 🔴 FAKT (razrabotkada, F-0929-25): keyingi dars 6-dars (PM), Skill yozish emas — 6-dars v2 kirishidan olindi

✎ «kontekst-injiniring» (izohsiz) keyingi dars e'lonidan olib tashlandi — 7-darsning o'zida tushuntiriladi

---

## Qo'shimcha matnlar

**Nishonlar (4)** — inglizcha nom qoladi, «karta» nomlari mavzuga moslanadi:
- 🎯 **Right Skill** — vazifaga mos Skill'ni description'dan topdingiz (7)
- ⚡ **Right Trigger** — Skill qaysi vazifada ishga tushishini to'g'ri tanladingiz (13)
- 🔀 **Before/After** — Skill'siz va Skill bilan farqni ko'rdingiz (7, bonus)
- 🏆 **Skill Flow** — Skill ishlash tartibini to'g'ri yig'dingiz (15)

**Qisqa takrorlash oynalari (5):**
1. (4) **Skill — yozma yo'riqnoma:** Skill Claude'ga bitta vazifani qanday bajarishni ko'rsatadi. · Model o'zgarmaydi — o'sha Claude yo'riqnomaga qarab ishlaydi. · Natija bir xil uslubga yaqinlashadi. · Sinfga savol: Skill oddiy so'rovdan (prompt) nimasi bilan farq qiladi?
2. (8) **description — qachon kerak:** Claude oldindan faqat nom va description'ni ko'radi. · Vazifa mos kelsa — Skill ochiladi. · Noaniq description → Skill kerakli paytda ishlamasligi mumkin. · Sinfga savol: Nega description aniq bo'lishi kerak?
3. (10) **Progressive disclosure:** To'liq matn faqat vazifa mos kelganda ochiladi. · Qolgan Skill'lar yopiq qoladi — kontekst oynasi band bo'lmaydi. · Har so'rovda hammasini ochish — joyni bekorga to'ldirardi. · Sinfga savol: Body qachon o'qiladi?
4. (14) **Takror vazifa → Skill:** Yo'riqnomani bir marta yozasiz. · Claude shu vazifada unga qarab ishlaydi. · Qayta-qayta tushuntirish kerak bo'lmaydi. · Sinfga savol: Qanday vazifa Skill uchun eng mos?
5. (15) **Skill ishlash tartibi:** Avval vazifa keladi. · description mos keladi → Skill ochiladi → yo'riqnomaga amal qilinadi. · Oxirida natija. (📩 Vazifa → 🔍 description → 📂 Skill → ✅ Amal → ✨ Natija) · Sinfga savol: Nega tartib muhim?

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Claude Skill nima? Kuchliroq AI modelining nomi · Internetdan ma'lumot oladigan qidiruv · ✔ AI uchun qayta ishlatiladigan yo'riqnoma · Dasturning ikonka (belgi) fayli
2. SKILL.md qaysi ikki qismdan iborat? ✔ Frontmatter va body · Rasm va ovoz fayllari · Parol va foydalanuvchi nomi · Server va baza manzili
3. description nima uchun kerak? Skill'ni chiroyli ko'rsatish uchun · AI modelini almashtirish uchun · Faqat odam o'qishi uchun · ✔ Skill qachon kerakligini aytish uchun
4. Skill body'sida odatda nima bo'ladi? Faqat Skill nomi · ✔ Aniq qadamlar va misol · Foydalanuvchi paroli · AI modelining versiyasi
5. Progressive disclosure nima? Hamma Skill doim to'liq ochiq turadi · Skill faqat kechasi ishlaydi · Skill AI'ni tezlashtiradi · ✔ To'liq matn kerak bo'lganda ochiladi
6. Claude oldindan nimani ko'rib turadi? ✔ Skill'lar nomi va description'ini · Har bir Skill'ning butun matnini · Foydalanuvchining eski suhbatlarini · Kompyuterdagi barcha fayllarni
7. Skill oddiy so'rov (prompt)dan nimasi bilan farq qiladi? Skill — bir martalik gap · ✔ Skill saqlanadi va qayta ishlatiladi · Skill modelni kuchaytiradi · Skill internetga ulaydi
8. Yaxshi Skill'ning belgisi qaysi? Uzun, chalkash matn · Faqat bitta so'z · ✔ Aniq description, qadamlar va misol · Rangli bezaklar va emoji
9. Qanday vazifa Skill uchun eng mos? ✔ Qayta-qayta bajariladigan vazifa · Bir marta bo'ladigan tasodifiy ish · Faqat rasm chizish · Faqat o'yin o'ynash
10. Skill natijaga qanday ta'sir qiladi? Natijani har safar tasodifiy qiladi · Hech qanday ta'sir qilmaydi · AI'ni sekinlashtiradi · ✔ Natijani siz yozgan uslubga yaqinlashtiradi
11. System prompt va Skill farqi qaysi? Ikkalasi ham aynan bir xil narsa · System prompt faqat kechasi ishlaydi · ✔ System prompt — doim; Skill — kerak bo'lganda · Skill — eng kuchli AI modelining nomi
12. Noaniq description qanday oqibatga olib keladi? Skill ancha tezroq ishlaydi · ✔ Skill kerakli paytda ishlamasligi mumkin · AI modeli o'zi o'zgarib qoladi · Internet aloqasi uziladi

✎ 1, 3, 9, 11-savollarda to'g'ri javob eng uzuni yoki qavsli edi → tenglashtirildi · «super-kuch kartasi», «karta yonadi» olib tashlandi · 10-savol «izchil va standartingizda» → «uslubga yaqinlashtiradi»

---

## B. Rad etilgan taklif
- **Hook uchun «Bu variant emas. Qayta o'ylab ko'ring»** — rad. Hook ballsiz va bir martalik ekran. Bizning qoida (1-darsda tasdiqlangan): to'g'ri javobga «Aynan!», boshqasiga «Qiziq fikr!» + tushuntirish. Bola uyaltirilmaydi, xato ham «to'g'ri» deyilmaydi.
- **Progressive disclosure'ni «Biroz chuqurroq» qutisiga chiqarish** — rad. Bu Skill'larning asosiy ishlash tamoyili va description nega muhimligining sababi. Ustiga 10-ekrandagi ballik test aynan shu haqida. Qisqartirmadim — so'zlarini soddalashtirdim.
