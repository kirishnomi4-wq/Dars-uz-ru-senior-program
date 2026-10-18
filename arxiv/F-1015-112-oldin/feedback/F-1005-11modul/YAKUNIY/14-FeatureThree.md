# 14-dars «Loyiha kuni: 3-asosiy funksiya» — yakuniy matn

Fayl: `src/9-Modull/FeatureThreeLesson.jsx` · 12 ekran · Keyingi dars: «Roadmap bo'yicha qayerdasiz?»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — «O'yin sahnasi»: chapda telefon(lar) «Maydon Jamoa», o'ngda Backend qutisi va «Database · `ishtirokchilar`» jadvali.
Telefonda «O'yin» ekrani: «‹ O'yinlar» · «Yakshanba, 17:00» · «Mahalla maydoni» · katta son «N / 10» · ismsiz doiralar · «Navbatda: N» · holat yozuvi «Navbatdasiz» · pastda tugmalar:
«Qo'shilaman» · «Qo'shildingiz» (o'chiq) · «O'yin to'ldi» (o'chiq) · «Navbatga yozilish» · «O'yindan chiqish». Telefon ustida yorliq (masalan «1-telefon · qo'shilgan o'yinchi»).
Tasdiq oynasi: «Rostdan chiqasizmi?» · Yo'q · Ha. Eski javobni ko'rsatayotgan telefon ustida kulrang yorliq «eski holat».
Backend qutisi: yo'llar `POST …/qoshilish` · `POST …/navbat` · `POST …/chiqish`; so'rov kartalari «joy bormi? · 9 / 10 — bor» (✓ / ✕); qulf «bitta ish»; eshik oldidagi so'rov «kutyapti».
Jadval ustunlari: o'yinchi · holat · yozilgan vaqti. So'rov — uchadigan konvert (yorlig'ida yo'l yoki javob: `POST /oyinlar/4/navbat`, `201 · navbatda`, `409 · O'yin to'ldi`).

## 0 · Kirish — kela olmaydigan o'yinchi
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: Qo'shilgan o'yinchi kela olmasa, *joyi nima bo'ladi*?
- Mentor:
  - boshida: 1-telefondagi o'yinchi Yakshanba 17:00 dagi o'yinga qo'shilgan, lekin endi kela olmaydi. 2-telefondagi o'yinchi shu o'yinda o'ynamoqchi — avval javobni tanlang.
  - javobdan keyin: «Davom etish»ni bosing — bugungi rejani ko'rasiz.
- Maket: ikki telefon yonma-yon — «1-telefon · qo'shilgan o'yinchi» va «2-telefon · yangi o'yinchi»; ikkalasida «‹ O'yinlar» · «Yakshanba, 17:00» · «Mahalla maydoni» · «10 / 10» · o'nta doira.
  1-telefonda «Qo'shildingiz» (o'chiq), 2-telefonda «O'yin to'ldi» (o'chiq).
- Savol: Sizningcha, qaysi biri?
  - Joy bo'shaydi — o'yin kuni «Kelaman» bosilmaydi
  - Joy band qoladi — ilovada o'yindan chiqish yo'q
  - Joy band qoladi — tashkilotchi buni bilmaydi
- Javob izohlari (ballsiz):
  - «Joy band qoladi — ilovada o'yindan chiqish yo'q» tanlansa: **Aynan!** Ilovada o'yindan chiqish yo'li yo'q: joy band turadi, o'ynamoqchi bo'lgan o'yinchi esa «O'yin to'ldi»ni ko'radi.
  - «Joy bo'shaydi — o'yin kuni «Kelaman» bosilmaydi» tanlansa: **Qiziq fikr!** «Kelaman» bosilmasa, tashkilotchi buni ko'radi, lekin joy band turaveradi. O'yindan chiqish yo'li yo'q.
  - «Joy band qoladi — tashkilotchi buni bilmaydi» tanlansa: **Qiziq fikr!** O'yin kuni tashkilotchi kim tasdiqlaganini ko'radi. Lekin joyni bo'shatadigan tugma ilovada yo'q.
- Tanlangandan keyin: 1-telefonda barmoq «Qo'shildingiz»ni bosadi — tugma bir lahza silkinadi, boshqa tugma yo'q; 2-telefon ostida kulrang yorliq «o'ynamoqchi edi — joy yo'q edi»;
  telefonlar ostida kadr «Yakshanba, 17:00 · maydonda» — o'nta o'rin, to'qqiztasida odam, bittasi bo'sh; yorliq «bu misolda: 10 kishi kerak edi — 9 kishi keldi».
- Tugma: Davom etish

## 1 · Bugun quramiz
- Eyebrow: Reja
- Sarlavha: Dars oxirida *uchinchi funksiya* telefonda ishlaydi.
- Mentor: Bugun roadmap'dagi uchinchi funksiyani qurasiz — talabning uch qatorini har blokda o'zingiz yozasiz. Mentor misolida bu funksiya — o'yindan chiqish va navbat.
- Chap — Dars oxirida: ikki telefon («1-telefon · qo'shilgan o'yinchi» — «Qo'shildingiz»; «2-telefon · yangi o'yinchi» — «O'yin to'ldi»), «10 / 10»; bir marta o'zi yuradi:
  2-telefonda «O'yin to'ldi» o'rnida «Navbatga yozilish» → 1-telefonda «Qo'shildingiz» ostida «O'yindan chiqish» → ikkala telefonda «Navbatda: 0». Tugmalar bosilmaydi.
- O'ng — Bugungi 3 qadam:
  1. Backend yangi harakatni Database'ga yozadi
  2. Ikki so'rov bir lahzada kelsa ham yozuv to'g'ri qoladi
  3. Funksiya telefonda ishlaydi, oldingi ikkitasi ham
- Pastki qator: repo `maydon-jamoa` · boshlang'ich holat `m11-dars-14-start` · namuna `m11-dars-14-done`
- «Maydon Jamoa» — namuna; amaliyotlarni roadmap'ingizdagi uchinchi funksiyada bajarasiz: **«{nom}»**. (roadmap'da nom bo'lmasa — qator nuqta bilan tugaydi)
- Tugmalar: Orqaga · Boshlaymiz

## 2 · O'yindan chiqish va navbat
- Eyebrow: Tushuncha · chiqish va navbat
- Sarlavha: O'yinchi chiqsa, bo'shagan joyni *kim oladi*?
- Mentor:
  - taxmingacha: O'yin to'ldi — avval taxminingizni belgilang, keyin tugmalarni tartib bilan bosing.
  - harakat paytida: Keyingi tugmani bosing va `ishtirokchilar` jadvalida nima o'zgarishini kuzating.
  - tugagach: Uchala qadam tugadi — natijani taxminingiz bilan solishtiring.
- Taxmin kartasi (halqada, ballsiz) — Avval o'zingiz belgilab ko'ring: Navbatda odam bor. Bir o'yinchi chiqsa, kartada qaysi son? · 9 / 10 · 10 / 10
  - Tanlangach ixcham qator natijagacha turadi: Taxminingiz · savol · tanlov
- Chap: ikki telefon — «1-telefon · qo'shilgan o'yinchi» («Qo'shildingiz», «O'yindan chiqish») va «2-telefon · yangi o'yinchi» («Navbatga yozilish»); ikkalasida «10 / 10» · «Navbatda: 0».
  Tugmalar telefonlarning o'zida, tartib bilan halqada: «Navbatga yozilish» (2-telefon) → «O'yindan chiqish» (1-telefon) → «↓ Pastga tortib yangilash» (2-telefon ekrani ustida).
- O'ng: Backend — `POST …/navbat` · `POST …/chiqish`; Database · `ishtirokchilar` (o'yinchi · holat · yozilgan vaqti): 1-telefon o'yinchisi · `qoshildi` · 2026-10-09 18:10 · yana 9 ta · `qoshildi`.
- Harakatlar:
  - «Navbatga yozilish» → konvert `POST /oyinlar/4/navbat` → jadvalga yangi qator «2-telefon o'yinchisi · `navbatda` · 2026-10-09 19:42» → javob `201 · navbatda` →
    2-telefonda «Navbatdasiz», «Navbatda: 1» va «O'yindan chiqish».
  - «O'yindan chiqish» → oyna «Rostdan chiqasizmi?» · Yo'q · Ha («Ha» bosiladi) → konvert `POST /oyinlar/4/chiqish` → Backend'da «bitta ish» qulfi yopiladi →
    1-qator `chiqdi`, navbatdagi qator `qoshildi` → qulf ochiladi → javob `201 · chiqdi` → 1-telefonda «10 / 10», doiralardan biri kulrang bo'lib, o'rniga yangisi yonadi, tugma — «Navbatga yozilish»;
    2-telefon ustida yorliq «eski holat».
  - «↓ Pastga tortib yangilash» → aylanish belgisi → konvert `GET /oyinlar` → 2-telefonda «Qo'shildingiz», «O'yindan chiqish», «Navbatda: 0», yangi doira; «eski holat» yo'qoladi.
- Joriy qator (ikkinchi tugmadan keyin): Navbat tartibi — yozilgan vaqti: birinchi yozilgan birinchi qo'shiladi.
- Natija (yashil blok):
  - «10 / 10» tanlangan bo'lsa: ✓ Taxminingiz to'g'ri chiqdi
  - «9 / 10» tanlangan bo'lsa: Taxminingiz: 9 / 10 · haqiqatda: **«10 / 10» — joyni navbatdagi oldi**
  - Navbat tartibi — yozilgan vaqti: birinchi yozilgan birinchi qo'shiladi.
  - Qo'shilgan o'yinchi chiqsa, joyni navbatdagi birinchi o'yinchi oladi. U buni ekranni yangilaganda ko'radi.
- Tugma: Avval taxminingizni belgilang → Tugmalarni tartib bilan bosing (N/3) → Davom etish

## 3 · Amaliyot 1 — Backend: yangi harakat Database'ga
- Eyebrow: Amaliyot 1 · Backend
- Sarlavha: Uchinchi funksiyaning *Backend qismi* ishlasin.
- Mentor: Uch qatorni o'zingiz yozasiz, Mentor misoli «Yordam»da; «1 · Ochish»dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Blok tepasida: Uchinchi funksiyangiz: **{nom}** (roadmap'dan); nom bo'lmasa — bitta qatorli maydon, ichida kulrang: Roadmap'ingizdagi uchinchi funksiya nomi
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching (13-darsdagi holat). Terminalda `cd backend`, `npm run start:dev` — xato yo'q.
     - `README.md` dagi arxitekturaga qarang: funksiyangiz qaysi jadvalga nima yozadi? Oldingi ikki funksiyadan biri tugamagan bo'lsa — avval uni tugating.
     - Funksiyangiz Database'ga yozmasa (masalan, faqat ko'rsatadi) — bu blokda u ishlatadigan Backend yo'lini quring.
  2. **Prompt** — vazifa: funksiyangizga kerak Backend qismi ishlasin; harakat yangi holatni saqlasa — Database'ga yozilsin. Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash; uch qator to'lmaguncha tugma o'chiq; bosilgach — ✓ Nusxalandi):
       > Qayerda: {qayerda}
       > Nima qilsin: {nima qilsin}
       > Nima buzilmasin: {nima buzilmasin}
       > Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Har joy ostida kulrang savol:
       - {qayerda} — qaysi papka, qaysi yo'l va jadval?
       - {nima qilsin} — foydalanuvchi nima qiladi, jadvalga nima yoziladi?
       - {nima buzilmasin} — qaysi yo'llar va ustunlar o'zgarmasin?
     - Yordam (ochiladigan) — Mentor misoli:
       > Qayerda: `backend/` — yangi yo'llar `POST /oyinlar/:id/navbat` va `POST /oyinlar/:id/chiqish`, ikkalasi token bilan; jadval `ishtirokchilar`.
       > Nima qilsin: `navbat` — o'yin to'lgan bo'lsa, o'yinchini `navbatda` holatida yozsin; to'lmagan bo'lsa — `409`.
       > `chiqish` — qo'shilgan yoki navbatdagi o'yinchini `chiqdi` qilsin. Qo'shilgan o'yinchi chiqsa va navbatda odam bo'lsa, navbatga eng birinchi yozilgan o'yinchi `qoshildi` bo'lsin.
       > `GET /oyinlar` har o'yinda `navbatda` (navbatdagilar soni) va `menNavbatdaman` ni ham bersin.
       > Nima buzilmasin: `POST /oyinlar`, `…/qoshilish` va `…/tasdiq` yo'llari, «8 / 10» hisobi va jadval ustunlari. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — Backend terminali o'zi qayta yuklanadi, xato yo'q. Antigravity'ga yozing: «Yangi yo'llarni tekshir: tekshiruv uchun yangi yozuvlar yarat, ularning `id` larini ayt, so'rov yubor va har biri nima qaytarganini ayt.»
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Neon'da tekshirish** — talabning har qatorini tekshiring:
     - (1) Agent aytgan javoblar talabingizdagidek.
     - (2) Neon'dagi SQL Editor'da funksiyangiz yozadigan jadvalni oching — agent aytgan o'zgarish jadvalda ham bor. Agent nima desa ham, jadval shuni ko'rsatsin.
     - (3) Antigravity'ga yozing: «Faqat hozir yaratgan tekshiruv yozuvlarini — aytgan `id` laring bo'yicha — o'chir.» — jadvalda ular qolmasin, boshqa qatorlar joyida. Mos kelmagan qatorni uch qism bilan agentga yozing.
- O'ng — kutilgan natija · namuna: Maydon Jamoa:
  - Antigravity: `tekshiruv o'yini id 5 · 2 kishi kerak` · `o'yinchi 1, 2 · qoshilish → 201` · `o'yinchi 3 · navbat → 201 · navbatda` · `o'yinchi 1 · chiqish → 201 · chiqdi` · `o'yinchi 3 → qoshildi`
  - Neon · SQL Editor: `SELECT oyinchi_id, holat FROM ishtirokchilar WHERE oyin_id = 5;` → `1 · chiqdi` · `2 · qoshildi` · `3 · qoshildi`
  - Ostida: `5` — Mentor misolidagi tekshiruv o'yini; sizda — agent aytgan `id`.
- Ostida: Ortda qoldingizmi — Mentor misolini oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m11-dars-14-done` — qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.
- Hammasi bajarilgach: Backend yangi harakatni Database'ga yozadi. Bu misolda chiqqan o'yinchining joyini navbatdagi oldi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: «10 / 10», navbatda ikki kishi. Ikki o'yinchi chiqdi. *Kartada nima?*
  - 10 / 10 · navbatda: 2
  - 9 / 10 · navbatda: 1
  - ✔ 10 / 10 · navbatda: 0
  - 8 / 10 · navbatda: 2
- Javob izohlari:
  - To'g'ri: Ikki joy bo'shadi — ularni navbatdagi ikkala o'yinchi oldi.
  - A: Joylar to'ldi. Ularni kim oldi — navbatga qarang.
  - B: Navbatda odam kutyapti, joy esa bo'sh turibdi.
  - D: Navbatda odam bo'lsa, bo'shagan joy bo'sh qolmaydi.
  - Umumiy: Navbatga qarang.
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: C — 10 / 10 · navbatda: 0 · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 5 · Oxirgi joyga ikki so'rov
- Eyebrow: Tushuncha · bir vaqtda bosish
- Sarlavha: Oxirgi joyni ikki kishi bir vaqtda bossa, *nima bo'ladi*?
- Mentor:
  - taxmingacha: Ikkala telefonda «9 / 10» — bitta joy qoldi; avval taxminingizni belgilang.
  - birinchi tugma paytida: «Bir vaqtda bosish»ni bosing va Backend'ga kelgan ikki so'rovni kuzating.
  - birinchi natijadan keyin: Bu talabda shu holat yozilmagan edi — qatorni talabga qo'shing.
  - uchinchi tugma paytida: Agent qaytadan qurdi — «Yana bir vaqtda bosish»ni bosing.
  - tugagach: Ikkala urinish tugadi — natijani taxminingiz bilan solishtiring.
- Taxmin kartasi (halqada, ballsiz) — Avval o'zingiz belgilab ko'ring: Ikkalasi bir lahzada bossa, nechta o'yinchi qo'shiladi? · Bittasi · Ikkalasi
  - Tanlangach ixcham qator natijagacha turadi: Taxminingiz · savol · tanlov
- Chap: ikki telefon — «1-telefon · yangi o'yinchi» va «2-telefon · yangi o'yinchi»; ikkalasida «9 / 10» va «Qo'shilaman».
- O'ng: Backend — `POST …/qoshilish`; Database · `ishtirokchilar` (o'yinchi · holat): 9 ta · `qoshildi`.
- Ostida — talab kartasi (yorliq «talab — bu qatorsiz»): Qayerda: `…/qoshilish` · Nima qilsin: to'lmagan o'yinga qo'shsin · Nima buzilmasin: «8 / 10» hisobi; yonida harakat tugmasi (bittadan, halqada).
- Harakatlar:
  - «Bir vaqtda bosish» → ikki telefondan ikki konvert `POST …/qoshilish` → Backend'da ikki so'rov kartasi «joy bormi? · 9 / 10 — bor» (ikkalasida ✓) →
    jadvalga ikki qator «1-telefon o'yinchisi · `qoshildi`», «2-telefon o'yinchisi · `qoshildi`» → javob `201` → ikkala telefonda «Qo'shildingiz» va qizil «11 / 10». Backend ostida: Ikki so'rov ham «joy bor» deb ko'rdi.
  - Yangi qator kartasi: Ikki kishi bir vaqtda bosganda ham bitta joyga ikki odam yozilmasin. · tugma «Talabga qo'shish» → qator talab kartasiga uchib tushadi (yorliq — «talab») →
    «agent qaytadan quryapti…» → holat qaytadi: ikkala telefonda «9 / 10» va «Qo'shilaman», jadvaldagi ikki qator o'chadi.
  - «Yana bir vaqtda bosish» → ikki konvert → Backend'da «bitta ish» qulfi yopiladi, 1-so'rov «joy bormi? · 9 / 10 — bor» (✓), ikkinchisi eshik oldida «kutyapti» →
    jadvalga bitta qator → javob `201` → 1-telefonda «Qo'shildingiz», «10 / 10» → qulf ochiladi → 2-so'rov «joy bormi? · 10 / 10 — yo'q» (✕) → javob `409 · O'yin to'ldi` →
    2-telefonda «10 / 10», «O'yin to'ldi» va «Navbatga yozilish». Backend ostida: Ikkinchi so'rov birinchisi tugashini kutdi.
- Natija (yashil blok):
  - Taxminingiz: <tanlov> · haqiqatda: **qatorsiz — ikkalasi, qator bilan — bittasi**
  - Bu misolda Backend joyni tekshirish va yozishni bitta ish qilib bajaradi: ikkinchi so'rov kutib turadi.
  - Tekshirish va yozish bitta ish bo'lsa, oxirgi joy bitta odamga tegadi. Buni talabda o'zingiz yozasiz.
- Tugma: Avval taxminingizni belgilang → Tugmalarni tartib bilan bosing (N/3) → Davom etish

## 6 · Amaliyot 2 — bir vaqtda bosish
- Eyebrow: Amaliyot 2 · bir vaqtda bosish
- Sarlavha: Ikki kishi bir vaqtda bossa ham, *yozuv to'g'ri qolsin*.
- Mentor: Funksiyangizga ikki so'rov bir lahzada kelsa nima buzilishi mumkin — talabni shunga yozing; «1 · Ochish»dan boshlang.
  - Qadamlar orasida va blok tugagach — 3-ekrandagidek.
- Qadamlar:
  1. **Ochish** — Backend laptopda ishlab tursin. Funksiyangizda ikki holatni o'ylab ko'ring: bitta odam tugmani ikki marta tez bossa · ikki odam bir lahzada bossa.
     - Qaysi yozuv ikki marta tushishi yoki chegaradan oshishi mumkin? Funksiyangiz umumiy ma'lumotga yozmasa — tez ikki marta bosishda nima buzilishi mumkinligini toping; hech narsa buzilmasa — Mentor bilan funksiyangizga mos boshqa tekshiruvni tanlang.
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi — 3-ekrandagidek (Qayerda: {qayerda} · Nima qilsin: {nima qilsin} · Nima buzilmasin: {nima buzilmasin} · Boshqa joyga tegma, o'zgargan fayllarni ayt.)
     - Har joy ostida kulrang savol:
       - {qayerda} — qaysi yo'llar?
       - {nima qilsin} — ikki so'rov bir lahzada kelsa, nima bo'lsin?
       - {nima buzilmasin} — qaysi javoblar va sonlar o'zgarmasin?
     - Yordam (ochiladigan) — Mentor misoli:
       > Qayerda: `backend/` — `POST /oyinlar/:id/qoshilish`, `…/navbat` va `…/chiqish`.
       > Nima qilsin: ikki kishi bir vaqtda bosganda ham bitta joyga ikki odam yozilmasin: joyni tekshirish va yozish bitta ish bo'lsin, shu payt boshqa so'rov kutib tursin.
       > Chiqqan o'yinchining joyini navbatdagi shu ishning ichida olsin. Bitta o'yinchi bir o'yinga ikki marta yozilmasin.
       > Nima buzilmasin: yo'llarning javoblari va «8 / 10» hisobi. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — Backend terminali o'zi qayta yuklanadi, xato yo'q. Antigravity'ga yozing: «Birga yuboriladigan so'rovlar bilan tekshir: yangi tekshiruv yozuvi yarat (`id` sini ayt), oxirgi joyga beshta so'rovni birga yubor. Qaysi usul bilan yuborganingni va har javobni ayt.»
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Neon'da tekshirish** — talabning har qatorini tekshiring:
     - (1) Agent javobida beshtadan faqat bittasi o'tgan, qolganlari rad etilgan.
     - (2) Neon'dagi SQL Editor'da jadvalingizni oching — tekshiruv yozuvlari soni chegaradan oshmagan, bitta odam ikki marta yozilmagan. Agent nima desa ham, jadval shuni ko'rsatsin.
     - (3) Antigravity'ga yozing: «Faqat hozir yaratgan tekshiruv yozuvlarini — aytgan `id` laring bo'yicha — o'chir.» Mos kelmagan qatorni uch qism bilan agentga yozing.
- O'ng — kutilgan natija · namuna: Maydon Jamoa:
  - Antigravity: `tekshiruv o'yini id 6 · 2 kishi kerak · 1 joy qoldi` · `5 so'rov birga (Promise.all)` · `1 → 201 · qoshildi` · `4 → 409 · O'yin to'ldi`
  - Neon · SQL Editor: `SELECT holat, COUNT(*) FROM ishtirokchilar WHERE oyin_id = 6 GROUP BY holat;` → `qoshildi · 2`
  - Ostida: oldin 1 + yangi 1; `6` — Mentor misolida, sizda — agent aytgan `id`.
- Hammasi bajarilgach: Ikki so'rov bir lahzada kelsa ham, yozuv to'g'ri qoladi. Bu misolda oxirgi joy bitta odamga tegdi.
- Ostida (blok tugagach): Qo'lda bosilganda so'rovlar bir lahzaga kamdan-kam tushadi — shuning uchun agent so'rovlari bilan tekshirasiz.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Oxirgi joyga ikki kishi yozildi: «11 / 10». *Talabga nima qo'shasiz?*
  - ✔ Ikki kishi bir vaqtda bossa ham, joy bittasiga tegsin
  - Tugma bir soniya o'chib tursin — bir vaqtda bosilmasin
  - O'yin to'lganda «Qo'shilaman» tugmasi ko'rinmasin
  - Ortiqcha o'yinchini tashkilotchi o'zi chiqarib yuborsin
- Javob izohlari:
  - To'g'ri: Ikkala so'rov Backend'ga keladi — joyni u bittaga beradi.
  - B: Tugma bitta telefonda o'chadi — so'rovlar ikki telefondan.
  - C: Bosilgan payt ikkala telefonda ham «9 / 10» edi.
  - D: Ikkalasi «Qo'shildingiz»ni ko'rgan — qaysi biri chiqadi?
  - Umumiy: So'rovlar qayerga kelishiga qarang.
- Javob kartasi — 4-ekrandagidek (To'g'ri javob: A — Ikki kishi bir vaqtda bossa ham, joy bittasiga tegsin).
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 8 · Amaliyot 3 — ilova: telefonda, oldingi funksiyalar bilan
- Eyebrow: Amaliyot 3 · ilova
- Sarlavha: Uchinchi funksiya *telefonda ishlasin*, oldingilari ham.
- Mentor: Endi «Nima buzilmasin» qatoriga oldingi ikki funksiyangizni yozing; «1 · Ochish»dan boshlang.
  - Qadamlar orasida va blok tugagach — 3-ekrandagidek.
- Qadamlar (trek — 8-darsdagi tanlovdan: mobil yoki web; tanlov bo'lmasa ikkala qator ham ko'rinadi):
  1. **Ochish** — ilova papkangizni oching. Ikkinchi akkaunt tayyorlang: o'zingizda «Hisobdan chiqish»dan keyin namuna ism va boshqa namuna telefon bilan ro'yxatdan o'ting (yoki sinfdoshingiz telefonida — 12-darsdagidek) — funksiyani ikki foydalanuvchi bilan tekshirasiz.
  2. **Prompt** — vazifa: funksiyangiz ilovada ko'rinsin va Backend'dagi yangi yo'llarni chaqirsin. Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi — 3-ekrandagidek.
     - Har joy ostida kulrang savol:
       - {qayerda} — qaysi ekran va qaysi tugma?
       - {nima qilsin} — bosilganda nima bo'ladi, ekranda nima ko'rinadi?
       - {nima buzilmasin} — oldingi ikki funksiya va animatsiyalar
     - Yordam (ochiladigan) — Mentor misoli (mobil trekda yorliq «Mentor misoli», boshqa holatda «Mentor misoli · mobil trek»):
       > Qayerda: `mobil/` — «O'yin» ekrani (`src/app/oyin/[id].tsx`) va «O'yinlar» kartasi.
       > Nima qilsin: o'yin to'lgan bo'lsa, «O'yin to'ldi» o'rnida «Navbatga yozilish» tugmasi bo'lsin — `POST /oyinlar/:id/navbat`; navbatdagi o'yinchi «Navbatdasiz» yozuvini ko'rsin.
       > Qo'shilgan va navbatdagi o'yinchida «O'yindan chiqish» tugmasi bo'lsin — `POST /oyinlar/:id/chiqish`, bosilganda «Rostdan chiqasizmi?» deb so'rasin.
       > «O'yinlar» kartasida «Navbatda: N» chiqsin. «O'yin» ekranida ham pastga tortilsa, o'yin qayta so'ralsin.
       > Nima buzilmasin: e'lon berish, «Qo'shilaman», o'yin kunidagi «Kelaman», kun sarlavhalari va animatsiyalar. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam ostida (mobil trek bo'lmasa) — web-trek: Web-trekda: «Qayerda» — o'yin sahifasi; pastga tortish o'rniga «Yangilash» tugmasi — sahifa ochilganda va shu tugma bosilganda so'raladi, «Rostdan chiqasizmi?» — brauzer oynasida.
  3. **Ishga tushirish** — (a) Backend'ni yangilang: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "uchinchi funksiya"`, `git push`. Render push'dan keyin Backend'ni o'zi qayta deploy qiladi — Render'dagi xizmatingizda yangi deploy tugashini kuting.
     - (b) Mobil trekda: `npx expo start`, QR'ni telefonda Expo Go bilan oching; QR ochilmasa — telefon va laptop bitta Wi-Fi'dami? Bo'lmasa: `npx expo start --tunnel`. (web-trekda ko'rinmaydi)
     - Web-trekda: push'dan keyin Netlify saytni o'zi yangilaydi. (mobil trekda ko'rinmaydi)
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabning har qatorini tekshiring:
     - (1) Funksiyangizni ikki akkaunt bilan bajaring; ikkinchisida ekranni pastga torting (web-trekda sahifani yangilang) — o'zgarish u yerda ham ko'rinsin.
     - (2) Oldingi ikki funksiyangizni bir marta bajaring — avvalgidek ishlasin.
     - (3) Bepul Backend uxlab qolgan bo'lsa, birinchi javob bir daqiqagacha kechikishi mumkin. Oxirida yangi o'zgarish bo'lsa: `git status` → `git add <fayl>` → commit → `git push`.
- O'ng — kutilgan natija · namuna: Maydon Jamoa (telefon maketi, kadrlar bir marta o'zi almashadi):
  1. «2-akkaunt · O'yinlar»: sarlavha «O'yinlar»; «Shanba» — 18:00 · Mahalla maydoni · 8 / 10 · 20:00 · Maktab maydoni · 6 / 10; «Yakshanba» — 10:00 · Park maydoni · 4 / 8 · 17:00 · Mahalla maydoni · 10 / 10 · Navbatda: 1
  2. «2-akkaunt»: «O'yin» ekrani — «10 / 10» · «Navbatda: 1» · «Navbatdasiz» · «O'yindan chiqish»
  3. «1-akkaunt»: «Qo'shildingiz» · «O'yindan chiqish» · oyna «Rostdan chiqasizmi?» — «Ha» bosiladi
  4. «2-akkaunt»: ekran pastga tortiladi (aylanish belgisi)
  5. «2-akkaunt»: «Navbatda: 0» · yangi doira · «Qo'shildingiz» · «O'yindan chiqish»
- Hammasi bajarilgach: Uchinchi funksiya telefonda ishlaydi, oldingi ikkitasi ham joyida.
- Ostida (blok tugagach): Navbatdagi o'yinchi qo'shilganini ekranni yangilaganda ko'radi. Eslatma Mentor roadmap'ida «keyinroq».
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 9 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 10 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.
- Birinchi bosishgacha: Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon | Izoh |
|---|---|---|
| Mentor misolida uchinchi funksiya qaysi? | O'yindan chiqish va navbat | Chiqqan o'yinchining joyi bo'shaydi, to'lgan o'yinda navbatga yoziladi |
| Ilovada o'yindan chiqish yo'li bo'lmasa, nima bo'ladi? | Kela olmaydigan o'yinchining joyi band turadi | O'ynamoqchi bo'lgan odam «O'yin to'ldi»ni ko'radi |
| To'lgan o'yinda «O'yin to'ldi» o'rnida qaysi tugma chiqadi? | «Navbatga yozilish» | Bosilsa, o'yinchi `navbatda` holatida yoziladi |
| Qo'shilgan o'yinchi chiqsa, bo'shagan joyni kim oladi? | Navbatga birinchi yozilgan o'yinchi | Navbat bo'sh bo'lsa — joy bo'sh qoladi, «Qo'shilaman» qaytadi |
| Navbatdagi o'yinchi qo'shilganini qachon ko'radi? | Ekranni ochganda yoki pastga tortib yangilaganda | Navbat holati — real vaqt nuqtasi: bu modulda ilova uni ekran ochilganda va pastga tortilganda so'raydi |
| `ishtirokchilar` jadvalida o'yinchi qaysi holatlarda turadi? | `qoshildi`, `keladi`, `navbatda`, `chiqdi` | `keladi` — o'yin kuni «Kelaman»ni bosgani |
| Oxirgi joyga ikki so'rov bir lahzada kelsa, nima bo'lishi mumkin? | Ikkalasi «joy bor» deb ko'radi va ikkalasi yoziladi | Bu misolda talabda yozilmagan edi — «11 / 10» bo'ldi |
| Backend oxirgi joyni bitta odamga qanday beradi? | Joyni tekshirish va yozishni bitta ish qiladi | Shu payt ikkinchi so'rov kutib turadi. 5-Modulda bu nazorat tranzaksiya deb atalgan |
| 9-Moduldagi katakdan bugungi joyning farqi nima? | Katak bitta edi, joylar esa son bilan | «9 / 10» da ikki so'rov ham «joy bor» deb ko'rishi mumkin |
| Bir lahzadagi ikki so'rovni qanday tekshirasiz? | Agentga bir vaqtda bir nechta so'rov yubortirasiz | Qo'lda bosilganda so'rovlar bir lahzaga kamdan-kam tushadi; jadvalni Neon'da ko'rasiz |
| Uchinchi funksiya talabida «Nima buzilmasin»ga nima yoziladi? | Oldingi ikki funksiya | Mentor misolida: e'lon berish, «Qo'shilaman», «Kelaman» |
| Backend o'zgargach, telefondagi ilova uni qachon ko'radi? | `git push` dan keyin, Render yangilagach | Render push'dan keyin xizmatni o'zi qayta deploy qiladi |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun — keyingi dars
- Eyebrow: Yakun
- Yuqori yorliq: ✓ Uchinchi funksiya tayyor (faqat 3-amaliyot bajarilgan bo'lsa) · N/2 to'g'ri
- Sarlavha (bloklar holatiga qarab):
  - 3-amaliyot bajarilgan: Uchinchi funksiya tayyor: oldingilari bilan ishlaydi.
  - 2-amaliyotgacha: Backend qismi tayyor — telefondagi qismi qoldi.
  - faqat 1-amaliyot: Backend harakati ishlaydi — bir vaqtda bosish qoldi.
  - hech biri bajarilmagan: Uchinchi funksiya boshlandi — qolgan qadamni tugating.
- CODE STRIKE arenasi (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Qo'shilgan o'yinchi chiqsa, bo'shagan joyni navbatga birinchi yozilgan o'yinchi oladi.
  - Navbatdagi o'yinchi qo'shilganini ekranni yangilaganda ko'radi.
  - Oxirgi joy bitta odamga tegishi uchun Backend tekshirish va yozishni bitta ish qiladi.
  - Uchinchi funksiyaning «Nima buzilmasin» qatorida oldingi ikki funksiya turadi.
- Keyingi dars — **«Roadmap bo'yicha qayerdasiz?»**: Mentor bilan yakkama-yakka: risklar va tuzatilgan reja.
- Nishonlaringiz — N/3 (uchta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Nishonlar
- **Queue Keeper** — Bo'shagan joyni navbatdagi olishini topdingiz (4-ekran, 1-savol, birinchi urinishda to'g'ri)
- **Last Seat** — Oxirgi joyni himoya qiladigan talab qatorini topdingiz (7-ekran, 2-savol, birinchi urinishda to'g'ri)
- **Third Feature** — Uch amaliyot blokini oxirigacha bajardingiz (8-ekran, oxirgi «Bajardim»; bonus)
- Nishon olinganda: nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 4-ekran (1-savol) — **Joy bo'shasa, navbatdagi oladi**
   - `POST /oyinlar/:id/navbat` · Navbat — To'lgan o'yinda o'yinchi `navbatda` bo'lib yoziladi.
   - `POST /oyinlar/:id/chiqish` · O'yindan chiqish — Qo'shilgan o'yinchi `chiqdi` bo'ladi, joy bo'shaydi.
   - `holat: 'qoshildi'` · Navbatdagi — Navbatga birinchi yozilgan o'yinchi bo'shagan joyni oladi.
   - Sinfga savol: Navbatda ikki kishi turibdi. Bitta joy bo'shasa, qaysi biri oladi?
2. 7-ekran (2-savol) — **Oxirgi joy — bitta odamga**
   - `9 / 10` · Ikki so'rov — Bir lahzada kelsa, ikkalasi ham «joy bor» deb ko'rishi mumkin.
   - `409 · O'yin to'ldi` · Bitta ish — Ikkinchi so'rov kutadi, keyin joy qolmaganini ko'radi.
   - `Nima qilsin: …` · Talab — «Ikki kishi bir vaqtda bosganda ham bitta joyga ikki odam yozilmasin.»
   - Sinfga savol: Nega tugmani yashirish oxirgi joyni himoya qilmaydi?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Qayta ishlash · mustaqil rejimda: Keyingi → · Natijani ko'rish · jonli dars tugasa: «Jonli dars yakunlandi — testni o'zingiz davom ettiring:» · Mashq rejimida davom etish

1. Qo'shilgan o'yinchi kela olmaydi. Ilovada nima qiladi?
   - ✔ «O'yindan chiqish»ni bosadi
   - «Kelaman»ni bosmay kutadi
   - Tashkilotchiga xabar yozadi
   - Ilovani telefondan o'chiradi
2. To'lgan o'yinda o'ynamoqchisiz. Nimani bosasiz?
   - «Qo'shilaman»ni qayta bosaman
   - ✔ «Navbatga yozilish»ni bosaman
   - «Kelaman»ni o'yin kuni bosaman
   - «E'lon berish»ni yangidan bosaman
3. Bo'shagan joyni kim oladi?
   - Ekranni birinchi yangilagan o'yinchi
   - Tashkilotchi o'zi tanlagan o'yinchi
   - ✔ Navbatga birinchi yozilgan o'yinchi
   - Navbatga oxirgi yozilgan o'yinchi
4. Navbat bo'sh, «10 / 10». Bir o'yinchi chiqdi — kartada nima?
   - 10 / 10 va «O'yin to'ldi»
   - 9 / 10 va «O'yin to'ldi»
   - 10 / 10 va «Qo'shilaman»
   - ✔ 9 / 10 va «Qo'shilaman»
5. Navbatdagi o'yinchi qo'shilganini qachon ko'radi?
   - ✔ Ekranni ochganda yoki yangilaganda
   - Tashkilotchi unga qo'ng'iroq qilganda
   - O'yin kuni maydonga borgan paytda
   - Navbatga yozilgan paytning o'zida
6. Jadvalda navbatdagi o'yinchi qanday turadi?
   - `qoshildi` holatida, ro'yxatning oxirida
   - ✔ `navbatda` holatida, yozilgan vaqti bilan
   - `chiqdi` holatida, joy bo'shashini kutib
   - Alohida `navbat` jadvalida, o'z raqami bilan
7. Backend o'zgardi. Telefondagi ilova uni qachon ko'radi?
   - Laptopda `npm run start:dev` qilgach
   - Telefonda Expo Go'ni qayta o'rnatgach
   - ✔ Push'dan keyin Render yangilagach
   - Neon'da jadvalni qayta ochib ko'rgach
8. Talabda «bir vaqtda» yo'q. Ikki kishi oxirgi joyni bosdi — nima bo'lishi mumkin?
   - Ikkalasi ham rad etiladi, joy qoladi
   - Ilova ikkinchi bosishni o'zi o'chiradi
   - Tashkilotchiga ikkalasidan xabar boradi
   - ✔ Ikkalasi yoziladi, «11 / 10» bo'ladi
9. Backend oxirgi joyni bitta odamga qanday beradi?
   - ✔ Tekshirish va yozishni bitta ish qiladi
   - Ikkalasini yozib, keyin birini o'chiradi
   - Yaqinroq telefonning so'rovini tanlaydi
   - Ikkala so'rovni ham rad etib qaytaradi
10. «Bitta ish» paytida ikkinchi so'rov nima qiladi?
    - Birinchisidan oldin o'zi yoziladi
    - ✔ Kutib turadi, keyin javob oladi
    - Yo'qolib ketadi, javob kelmaydi
    - Birinchisi bilan birga yoziladi
11. Bir lahzadagi ikki so'rovni qanday tekshirasiz?
    - Ikki telefondan qo'lda bir vaqtda bosib
    - Bitta telefondan ikki marta tez bosib
    - ✔ Agentga bir vaqtda so'rov yubortirib
    - Neon'da jadvalni qo'lda o'zgartirib
12. Uchinchi funksiyada «Nima buzilmasin»ga nima yoziladi?
    - Faqat yangi funksiyaning o'z tugmalari
    - `README.md` va `.gitignore` fayllari
    - Render va Neon xizmatlaridagi sozlamalar
    - ✔ Oldingi ikki funksiyangiz va yo'llari

Fon so'zlari: navbat · chiqish · `navbatda` · `qoshildi` · `409` · `chiqdi` · Backend · «10 / 10» · bitta ish · Database · Render · Maydon Jamoa

## Kartochkalar
10-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 11-ekrandagi 4 qator.
- Keyingi dars — «Roadmap bo'yicha qayerdasiz?».
