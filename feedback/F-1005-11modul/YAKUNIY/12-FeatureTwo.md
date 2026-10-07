# 12-dars «Loyiha kuni: 2-asosiy funksiya» — yakuniy matn

Fayl: `src/9-Modull/FeatureTwoLesson.jsx` · 12 ekran · Keyingi dars: «Uch foydalanuvchidan keyin nimani tuzatasiz?»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — «Tasdiq sahnasi»: chapda «Maydon Jamoa» telefoni (O'yin ekrani), o'ngda Backend qutisi va Database jadvali.
Telefon ustida (ilova tashqarisida) ikki yorliq: rol — o'yinchi yoki tashkilotchi · «Bugun: shanba» (yoki «Bugun: juma», «Bugun: shanba, 17:00»).
O'yin ekrani: «‹ O'yinlar» · kun va soat · maydon · «9 / 10» · qo'shilganlar — ismsiz doiralar. O'yinchida tugmalar: «Qo'shildingiz» (o'chiq) yoki «Qo'shilaman» · «Kelaman» → bosilgach «Tasdiqladingiz» (o'chiq).
Rad bo'lsa tugma ostida qizil qator: «Tasdiq faqat o'yin kuni» yoki «Siz bu o'yinga qo'shilmagansiz». Tashkilotchida: «Kelishini tasdiqladi: N / 9», tasdiqlaganlar doirasi yashil, tepada tutqich «↓ torting».
Backend qutisi: «Backend», yo'l `POST /oyinlar/:id/tasdiq` (yoki `GET /oyinlar`), ikki qoida katagi «O'yin kunimi?» · «Qo'shilganmi?» (bo'sh → ✓ yoki ✕).
Database: «Database · `ishtirokchilar`», ustunlar `oyin_id` · `oyinchi_id` · `holat`. Konvert — so'rov; uzuq chiziq — so'rov yo'q.
Namuna o'yinlar:
- Shanba, 18:00 · Mahalla maydoni · 9 / 10
- Shanba, 20:00 · Maktab maydoni · 6 / 10
- Yakshanba, 10:00 · Park maydoni · 4 / 8
- Yakshanba, 17:00 · Mahalla maydoni · 9 / 10

## 0 · Kirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: Qo'shilgan o'yinchilarning hammasi *maydonga keladimi*?
- Mentor:
  - boshida: Shanba kuni soat 17:00 da tashkilotchi telefonida 18:00 dagi o'yin turibdi, to'qqiz kishi qo'shilgan — avval javobni tanlang.
  - javobdan keyin: «Davom etish»ni bosing — bugungi rejani ko'rasiz.
- Maket: telefon, ustida «tashkilotchi» · «Bugun: shanba, 17:00»; O'yin ekrani: «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · «9 / 10» · 9 ta to'la doira, 1 ta bo'sh.
- Savol: Sizningcha, qaysi biri?
  - Ha — to'qqizalasi ham o'zi bosib qo'shilgan
  - Ha — kelolmasa, ilovaning o'zida xabar beradi
  - Bilib bo'lmaydi — qo'shilish kelish degani emas
- Javob izohlari:
  - «Ha — to'qqizalasi ham o'zi bosib qo'shilgan» tanlansa: **Qiziq fikr!** Qo'shilgan kuni hamma kelmoqchi edi. O'yin kunigacha reja o'zgarishi mumkin — ilova buni ko'rsatmaydi.
  - «Ha — kelolmasa, ilovaning o'zida xabar beradi» tanlansa: **Qiziq fikr!** Ilovada bunday joy hali yo'q — tashkilotchi kim aniq kelishini ko'rmaydi.
  - «Bilib bo'lmaydi — qo'shilish kelish degani emas» tanlansa: **Aynan!** Qo'shilgan odamning rejasi o'zgarishi mumkin. Mentor intervyusida: «10 kishi kerak edi, 7 kishi keldi».
- Tanlangandan keyin: to'qqiz doirada navbat bilan «?» paydo bo'ladi; telefon ostida kulrang qator: Kelishini tasdiqladi: — / 9 · hali yo'q
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Dars oxirida roadmap'dagi *ikkinchi funksiya* ishlaydi.
- Mentor: Bugun roadmap'dagi ikkinchi funksiyani qurasiz. Mentor misolida bu — o'yin kuni tasdiq: o'yinchi «Kelaman»ni bosadi, tashkilotchi kim aniq kelishini ko'radi.
- Chap — Dars oxirida: sahna bir marta o'zi yuradi — o'yinchi telefonida «Kelaman» → konvert `POST /oyinlar/1/tasdiq` → Backend'da «O'yin kunimi?» ✓ · «Qo'shilganmi?» ✓ → `ishtirokchilar` qatori `1 · 2 · qoshildi` → `keladi` → o'yinchida «Tasdiqladingiz» → tashkilotchi telefoni pastga tortiladi, konvert `GET /oyinlar` → «Kelishini tasdiqladi: 6 / 9» → «7 / 9», yettinchi doira yashil.
- O'ng — Bugungi 3 qadam:
  1. Asosiy harakat: ruxsatni Backend beradi
  2. Natijani boshqa odam o'z telefonida ko'radi
  3. Tugma faqat ruxsat bor joyda chiqadi
- Pastki qator: repo `maydon-jamoa` · boshlang'ich holat `m11-dars-12-start` · namuna `m11-dars-12-done`
- Pastki qator 2: «Maydon Jamoa» — namuna; amaliyotlarni roadmap'ingizdagi 2-funksiya bilan, o'z mahsulotingizda bajarasiz.
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Uch «Kelaman» — qaysi biri yoziladi?
- Eyebrow: Tushuncha · ruxsat
- Sarlavha: Uch «Kelaman»dan qaysi biri *Database'ga yoziladi*?
- Mentor:
  - bashoratgacha: Ilovada «Kelaman» hozircha har o'yinda turibdi — avval taxminingizni belgilang, keyin uchala o'yinda bosing.
  - bosish navbati: Telefondagi «Kelaman»ni bosing va Backend'dagi ikki katakni kuzating.
  - o'yinlar orasida: Endi «Keyingi o'yin ›»ni bosing va u yerda ham «Kelaman»ni sinab ko'ring.
  - tugagach: Uchala bosish tugadi — natijani taxminingiz bilan solishtiring.
- Bashorat (Avval o'zingiz belgilab ko'ring): Uch bosishdan nechtasi Database'ga `keladi` yozadi? · Bittasi · Ikkitasi · Uchalasi
  - Tanlangach ixcham qator: Taxminingiz · savol · tanlov
- Chap — telefon, ustida «o'yinchi» · «Bugun: shanba» va yorliq «O'yin N / 3»; o'yinlar bittadan, «Kelaman» telefonning o'zida, keyingisi — telefon ostidagi «Keyingi o'yin ›»:
  1. «Shanba, 18:00» · «Mahalla maydoni» · «Qo'shildingiz» · «Kelaman»
  2. «Yakshanba, 10:00» · «Park maydoni» · «Qo'shildingiz» · «Kelaman»
  3. «Shanba, 20:00» · «Maktab maydoni» · «Qo'shilaman» · «Kelaman»
- O'ng — Backend: `POST /oyinlar/:id/tasdiq`, katak «O'yin kunimi?» · «Qo'shilganmi?»; Database · `ishtirokchilar`: `1 · 2 · qoshildi` · `3 · 2 · qoshildi`
- Bosishlar:
  - 1-o'yin: konvert `POST /oyinlar/1/tasdiq` → ikki katak ✓ → `1 · 2 · qoshildi` qatori `keladi` bo'ladi → telefonda «Tasdiqladingiz»
  - 2-o'yin: konvert `POST /oyinlar/3/tasdiq` → «O'yin kunimi?» ✕ → qizil konvert `403 · Tasdiq faqat o'yin kuni` → telefonda qizil qator «Tasdiq faqat o'yin kuni»; jadval o'zgarmaydi
  - 3-o'yin: konvert `POST /oyinlar/2/tasdiq` → «O'yin kunimi?» ✓ · «Qo'shilganmi?» ✕ → qizil konvert `403 · Siz bu o'yinga qo'shilmagansiz` → telefonda qizil qator «Siz bu o'yinga qo'shilmagansiz»; jadvalda yangi qator yo'q
- Natija: Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: bittasi — o'yin kuni va qo'shilgan o'yinchi)
- Joriy qator: Token bor, lekin ruxsat yo'q bo'lsa — `403`. Token yo'q bo'lsa — `401`.
- Xulosa: Ruxsatni Backend beradi: tugma noto'g'ri joyda tursa ham, Database'ga faqat ruxsat bor tasdiq yoziladi.
- Tugma: Avval taxminingizni belgilang → «Kelaman»ni bosing / «Keyingi o'yin ›»ni bosing → Davom etish

## 3 · Amaliyot 1 — harakat va ruxsat
- Eyebrow: Amaliyot 1 · harakat va ruxsat
- Sarlavha: Asosiy harakat ishlasin, *ruxsatni Backend bersin*.
- Mentor: Uch qatorning hammasi sizdan, namuna «Yordam»da; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Tepada (6-darsdagi roadmap'ingiz bo'lsa): Roadmap'ingizdagi 2-funksiya: **{nom}**
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching (11-darsdagi holat: 1-funksiya ishlaydi). 2-funksiyangiz uchun ikki savolga javob toping: foydalanuvchi nimani bosadi? Kim va qachon bosa oladi? Javoblar «Nima qilsin» qatoriga kiradi (Mentor misolida: «Kelaman» · faqat o'yin kuni, faqat qo'shilgan o'yinchi).
     - Funksiyangizda alohida qoida yoki natijani ko'radigan boshqa odam bo'lmasa — har blokda funksiyangizning mos qismini quring: harakat · natija qayerda ko'rinadi · tugma qachon chiqadi.
     - Roadmap topilmasa — maydon «2-funksiyangiz nomi» (namuna: o'yin kuni tasdiq)
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - **Vazifa:** Foydalanuvchi asosiy harakatni bajaradi; kim va qachon qila olishini Backend hal qiladi — ruxsat bo'lmasa, rad etib sababini qaytaradi. Tugma hozircha ruxsat yo'q joyda ham tursin — rad javobini ko'rasiz.
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: {qayerda}
       > Nima qilsin: {nima qilsin}
       > Nima buzilmasin: {nima buzilmasin}
     - Yordam (ochiladigan) — mobil trek:
       > Qayerda: `backend/` — yangi yo'l `POST /oyinlar/:id/tasdiq`; `mobil/` — «O'yin» ekrani (`src/app/oyin/[id].tsx`).
       > Nima qilsin: «O'yin» ekranida «Kelaman» tugmasi bo'lsin — hozircha har o'yinda. Bosilsa, Backend o'yinchining `ishtirokchilar` dagi holatini `keladi` qilsin.
       > Ruxsat faqat o'yin kuni va faqat o'yinga qo'shilgan o'yinchiga; «bugun» — Toshkent vaqti bilan. Aks holda `403` va sabab qaytarsin: «Tasdiq faqat o'yin kuni» yoki «Siz bu o'yinga qo'shilmagansiz»; ilova shu gapni tugma ostida ko'rsatsin. Tasdiqlangach tugma o'rnida «Tasdiqladingiz» (o'chiq).
       > Nima buzilmasin: «Qo'shilaman», «8 / 10» va «O'yin to'ldi» avvalgidek ishlasin; yangi yo'l ham faqat token bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam — web-trek (web-trekda yoki trek noma'lum bo'lsa): «Qayerda» qatorida ilova papkasi o'rniga sayt papkangiz va o'yin sahifasi turadi; Backend qismi o'sha.
  3. **Ishga tushirish** — `git status` (ro'yxat agent aytgani bilan bir xil, `.env` yo'q) → har faylni `git add <fayl>` → `git commit -m "2-funksiya: harakat va ruxsat"` → `git push`.
     - Render Backend'ni push'dan keyin o'zi qayta chiqaradi — Render sahifangizda yangi deploy tugashini kuting.
     - Mobil trekda: `npx expo start`, QR'ni Expo Go bilan oching; QR ochilmasa — telefon va laptop bitta Wi-Fi'dami? Bo'lmasa: `npx expo start --tunnel`.
     - Web-trekda: push — Netlify o'zi yangilanadi.
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabning har qatorini tekshiring:
     - (1) Ruxsat bor holatda asosiy harakatni bajaring — ekranda yangi holat (Mentor misolida: bugungi sana bilan e'lon berib, unga qo'shilib, «Kelaman» → «Tasdiqladingiz»).
     - (2) Neon'dagi SQL Editor'da jadvalingizni oching — sizning qatoringizda yangi holat (Mentor misolida: `SELECT oyin_id, oyinchi_id, holat FROM ishtirokchilar;` → `keladi`).
     - (3) Ruxsat yo'q holatda bosing — ilova Backend'ning sababini ko'rsatadi, jadval o'zgarmaydi. «Nima buzilmasin» qatoringizni ham tekshiring. Mos kelmagan qatorni uch qism bilan agentga yozing.
- O'ng — kutilgan natija · namuna: Maydon Jamoa: telefon («o'yinchi» · «Bugun: shanba»), kadrlar o'zi almashadi — «Shanba, 18:00» · «9 / 10» · «Qo'shildingiz» · «Kelaman» → «Tasdiqladingiz» → «Shanba, 20:00» · «6 / 10» · «Qo'shilaman» · «Kelaman» → qizil qator «Siz bu o'yinga qo'shilmagansiz»; yonida Neon · SQL Editor — Database · `ishtirokchilar`: `1 · 2 · keladi`
- Ostida: Ortda qoldingizmi — Mentor misolini oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m11-dars-12-done` — qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.
- Hammasi bajarilgach: Asosiy harakat ishlaydi; ruxsat bo'lmasa, Backend sababini qaytaradi.
- Natija ostida: Push'dan keyin Render yangi versiyani chiqarguncha eski Backend javob beradi — yangi yo'l hali yo'q.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: Tugma faqat o'yin kuni chiqsa, *Backend'dagi qoida* kerakmi?
  - Kerak emas — tugma yo'q joydan so'rov ham kelmaydi
  - Kerak — Backend tugmani o'yin kuni o'zi ko'rsatadi
  - ✔ Kerak — ilova xato ko'rsatsa ham, qoida saqlanadi
  - Kerak emas — endi ruxsatni ilovaning o'zi beradi
- Javob izohlari:
  - To'g'ri: Tugma — qulaylik; ruxsatni Backend har so'rovda beradi.
  - A: Mashqda tugma noto'g'ri joyda ham turdi — so'rov ketdi.
  - B: Tugmani ilova chizadi; Backend so'rovga javob beradi.
  - D: Ilova faqat ko'rsatadi. Database'ga kim yozadi?
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: C — <variant> · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 5 · Tashkilotchi sonni qachon ko'radi?
- Eyebrow: Tushuncha · tashkilotchi ekrani
- Sarlavha: Tashkilotchi yangi tasdiqni *qachon ko'radi*?
- Mentor:
  - bashoratgacha: Avval taxminingizni belgilang, keyin o'yinchi telefonida «Kelaman»ni bosing.
  - bashoratdan keyin: O'yinchi telefonida «Kelaman»ni bosing.
  - 1-harakatdan keyin: Endi tashkilotchi telefonida ekranni pastga torting.
  - tugagach: Ikkala harakat tugadi — natijani taxminingiz bilan solishtiring.
- Bashorat (Avval o'zingiz belgilab ko'ring): O'yinchi bosgach, tashkilotchida son qachon o'zgaradi? · Bosgan zahoti · Tashkilotchi ekranni yangilaganda · O'yin boshlanganda
  - Tanlangach ixcham qator: Taxminingiz · savol · tanlov
- Chap — ikki telefon yonma-yon («Bugun: shanba»):
  - «o'yinchi» — «Shanba, 18:00» · «Mahalla maydoni» · «Qo'shildingiz» · «Kelaman»
  - «tashkilotchi» — tutqich «↓ torting» · «Shanba, 18:00» · «9 / 10» · 9 doira (6 tasi yashil ✓) · «Kelishini tasdiqladi: 6 / 9»
- O'ng — Backend: `POST /oyinlar/:id/tasdiq` · `GET /oyinlar`; hisoblagich Database · `ishtirokchilar` · o'yin 1: `keladi` 6 · `qoshildi` 3
- Harakatlar:
  - «Kelaman» (o'yinchi): konvert `POST /oyinlar/1/tasdiq` → hisoblagich `keladi` 7 · `qoshildi` 2 → o'yinchida «Tasdiqladingiz»; tashkilotchida «6 / 9» o'zgarmaydi, oradagi uzuq chiziq ustida: so'rov yo'q
  - «↓ torting» (tashkilotchi): ekran pastga siljiydi, aylanuvchi belgi → konvert `GET /oyinlar` → javob qaytadi → «6 / 9» → «7 / 9», yettinchi doira yashil ✓
- Natija: Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: tashkilotchi ekranni yangilaganda)
- Joriy qator: 8-darsda shunday joyni real vaqt nuqtasi deb atagansiz.
- Xulosa: Bu modulda son o'zi yangilanmaydi: tashkilotchi ekranni ochganda yoki pastga tortganda keladi.
- Tugma: Avval taxminingizni belgilang → Harakatlarni navbat bilan bajaring (N/2) → Davom etish

## 6 · Amaliyot 2 — natija boshqa telefonda
- Eyebrow: Amaliyot 2 · boshqa odam ko'radi
- Sarlavha: Natijani boshqa odam *o'z telefonida* ko'rsin.
- Mentor: Uch qatorni yana o'zingiz yozasiz, tekshirishga ikkinchi foydalanuvchi kerak; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — o'z repo'ngizda 1-amaliyotdagi holat. Natijani kim va qayerda ko'radi — bir gap bilan o'ylang (Mentor misolida: tashkilotchi, «O'yin» ekranida).
     - Ikkinchi foydalanuvchi — o'z telefoningizda «Hisobdan chiqish» bilan ikkinchi akkaunt; sinfdoshingiz telefoni ham bo'ladi (web-trekda — havola, mobil trekda — Android'dagi Expo Go).
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - **Vazifa:** Harakat natijasi boshqa foydalanuvchiga ko'rinadi va ekran ochilganda yoki pastga tortilganda Backend'dan qayta olinadi.
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: {qayerda}
       > Nima qilsin: {nima qilsin}
       > Nima buzilmasin: {nima buzilmasin}
     - Yordam (ochiladigan) — mobil trek:
       > Qayerda: `backend/` — `GET /oyinlar` javobi; `mobil/` — «O'yin» ekrani.
       > Nima qilsin: `GET /oyinlar` javobida har o'yinga `tasdiqlagan` — kelishini tasdiqlaganlar soni qo'shilsin. O'yinni e'lon qilgan o'yinchi «O'yin» ekranida «Kelishini tasdiqladi: 7 / 9» ni ko'rsin — tasdiqlaganlar / qo'shilganlar; tasdiqlaganlar doirasi yashil. Ma'lumot ekran ochilganda va pastga tortilganda Backend'dan qayta olinsin.
       > Nima buzilmasin: «Kelaman» va Backend'dagi qoida avvalgidek; tasdiq soni faqat tashkilotchiga ko'rinsin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam — web-trek: pastga tortish o'rniga «Yangilash» tugmasi — ma'lumot sahifa ochilganda va shu tugma bosilganda olinadi.
  3. **Ishga tushirish** — `git status` → `git add <fayl>` → commit → `git push`; Render deploy tugashini kuting.
     - Ikkinchi akkaunt: «Hisobdan chiqish» → namuna ism va **boshqa** namuna telefon bilan ro'yxatdan o'ting (Mentor misolida `+998 90 000 00 02`; telefon takrorlansa, ro'yxatdan o'tish rad etiladi).
     - Sinfdosh telefoni bilan: web-trekda — Netlify havolangiz; mobil trekda — Android'dagi Expo Go QR'ni ochadi (bitta Wi-Fi). Expo akkauntingiz ma'lumotlarini boshqaga bermaysiz.
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Ikki foydalanuvchi bilan tekshirish** — talabning har qatorini tekshiring:
     - (1) Natijani ko'radigan — siz, harakatni bajaradigan — ikkinchi akkaunt (Mentor misolida: siz bugungi o'yinni e'lon qilasiz, ikkinchi akkaunt qo'shilib «Kelaman»ni bosadi).
     - (2) Bitta telefonda: harakatni ikkinchi akkauntda bajaring, o'z akkauntingizga qayting — ekran ochilganda yangi son. Sinfdosh telefoni bilan: ekraningiz ochiq turganda son o'zgarmaydi, pastga torting — yangi son keladi.
     - (3) «Nima buzilmasin» qatoringizni tekshiring (Mentor misolida: ikkinchi akkauntda tasdiq soni ko'rinmaydi). Sinfdosh bilan bo'lsangiz, keyin rollarni almashing.
- O'ng — kutilgan natija · namuna: Maydon Jamoa: ikki telefon («Bugun: shanba»), bir marta o'zi yuradi — «o'yinchi»: «Shanba, 18:00» · «Kelaman» → «Tasdiqladingiz» · «tashkilotchi»: «9 / 10» · «Kelishini tasdiqladi: 6 / 9» → pastga tortish → «7 / 9», yettinchi doira yashil ✓
- Hammasi bajarilgach: Ikki foydalanuvchi bilan tekshirildi: boshqa odam harakatingiz natijasini o'z ekranida ko'radi.
- Natija ostida (mobil trekda yoki trek noma'lum bo'lsa): Sinfdoshingiz telefoni ilova kodini sizning laptopingizdan oladi — o'yinlar esa Render'dagi Backend'dan.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Tashkilotchi ekrani ochiq, ikki o'yinchi tasdiqladi. U sonni *qachon ko'radi*?
  - ✔ Pastga tortganda — ilova Backend'dan qayta so'raydi
  - Bosilgan zahoti — Backend sonni telefonga o'zi yuboradi
  - Ertasi kuni — ilova kunda bir marta so'rab turadi
  - Bir soatdan keyin — Backend sonni soatda yangilaydi
- Javob izohlari:
  - To'g'ri: Tortilganda ilova so'raydi va yangi son keladi.
  - B: Bu modulda Backend telefonga o'zi xabar yubormaydi.
  - C: Ilova soatga qarab so'ramaydi. Son nimadan keyin o'zgardi?
  - D: Backend o'zi hech narsa yubormaydi. Kim so'raydi?
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: A — <variant> · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 8 · Amaliyot 3 — tugma faqat ruxsat bor joyda
- Eyebrow: Amaliyot 3 · tugma faqat kerak joyda
- Sarlavha: Tugma faqat *ruxsat bor joyda* chiqsin.
- Mentor: Uch qatorni yozasiz, Backend'dagi qoida joyida qolishi — «Nima buzilmasin» qatoriga; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — 1-amaliyotda tugma ruxsat yo'q joyda ham turgan edi. Ruxsat yo'q holatlarni sanab chiqing (Mentor misolida ikkita: o'yin bugun emas · o'yinchi qo'shilmagan).
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - **Vazifa:** Tugma faqat qoida ruxsat bergan joyda chiqadi; bajarilgan harakat holati ilova qayta ochilganda ham ko'rinadi.
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: {qayerda}
       > Nima qilsin: {nima qilsin}
       > Nima buzilmasin: {nima buzilmasin}
     - Yordam (ochiladigan) — mobil trek:
       > Qayerda: `mobil/` — «O'yin» ekrani; `backend/` — `GET /oyinlar` javobi.
       > Nima qilsin: javobda har o'yinga `menTasdiqlaganman` (kirgan o'yinchi tasdiqlaganmi) va `menTasdiqlayOlaman` qo'shilsin — Backend uni `…/tasdiq` dagi o'sha qoida bilan hisoblasin (o'yin kuni, qo'shilgan).
       > «Kelaman» faqat `menTasdiqlayOlaman` bo'lsa chiqsin — ilova sanani o'zi solishtirmasin; tasdiqlagan bo'lsa — «Tasdiqladingiz» (o'chiq), ilova qayta ochilganda ham.
       > Nima buzilmasin: Backend'dagi qoida o'chirilmasin — tugma yashirilsa ham, har so'rovga ruxsatni u bersin. «Qo'shilaman», «O'yin to'ldi» va «Kelishini tasdiqladi» avvalgidek. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam — web-trek: o'sha uch qator sayt papkangizdagi o'yin sahifasi uchun; holat sahifa yangilanganda ham ko'rinsin.
  3. **Ishga tushirish** — push → Render deploy tugashini kuting · mobil trekda `npx expo start` (QR ochilmasa — bitta Wi-Fi yoki `--tunnel`), web-trekda push — Netlify o'zi yangilanadi.
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabning har qatorini tekshiring:
     - (1) Ruxsat bor holat — tugma bor (Mentor misolida: bugungi, qo'shilgan o'yin — «Kelaman»).
     - (2) Har ruxsat yo'q holat — tugma yo'q (Mentor misolida: boshqa kungi o'yin; qo'shilmagan o'yin).
     - (3) Mobil trekda terminalda `r` ni bosing (web-trekda sahifani yangilang) — bajarilgan holat joyida turibdi. Oxirida `git status` → `git add <fayl>` → commit → `git push`.
- O'ng — kutilgan natija · namuna: Maydon Jamoa: telefon («o'yinchi») va yonida `GET /oyinlar` javobi; to'rt kadr o'zi almashadi:
  1. «Bugun: juma» — «Shanba, 18:00» · «9 / 10» · «Qo'shildingiz», «Kelaman» yo'q · `id: 1` · `menTasdiqlayOlaman: false`
  2. «Bugun: shanba» — o'sha o'yin · «Qo'shildingiz» · «Kelaman» · `menTasdiqlayOlaman: true`
  3. «Bugun: shanba» — o'sha o'yin · «Tasdiqladingiz» · `menTasdiqlayOlaman: false` · `menTasdiqlaganman: true`
  4. «Bugun: shanba» — «Shanba, 20:00» · «6 / 10» · «Qo'shilaman», «Kelaman» yo'q · `id: 2` · `menTasdiqlayOlaman: false`
- Hammasi bajarilgach: Tugma faqat ruxsat bor joyda chiqadi; bajarilgan holat qayta ochilganda ham ko'rinadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 9 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 10 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.
- Birinchi bosishgacha: Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon | Izoh |
|---|---|---|
| Ikkinchi funksiya qayerdan olinadi? | Roadmap'ingizdagi «hozir» ufqidan | Mentor misolida — o'yin kuni tasdiq |
| Mentor misolida «Kelaman»ni kim bosa oladi? | O'yinga qo'shilgan o'yinchi — faqat o'yin kuni | Shu qoida bo'yicha ruxsatni Backend beradi |
| Ruxsatni kim beradi: ilovami yoki Backend? | Backend — har so'rovda | Tugma faqat ko'rinish |
| Token bor, lekin ruxsat yo'q bo'lsa, Backend nima qaytaradi? | 403 | Token yo'q bo'lsa — `401` |
| «Kelaman» bosilganda Database'da nima o'zgaradi? | ishtirokchilar dagi holat keladi bo'ladi | Oldin `qoshildi` edi |
| «Tasdiq faqat o'yin kuni» degan javob qachon keladi? | O'yin bugun bo'lmasa | Mentor talabida «bugun» — Toshkent vaqti bilan |
| «Kelishini tasdiqladi: 7 / 9» nimani bildiradi? | Qo'shilgan to'qqiz kishidan yettitasi kelishini tasdiqladi | Mentor misolida faqat tashkilotchiga ko'rinadi |
| Tashkilotchi yangi tasdiqni qachon ko'radi? | Ekranni ochganda yoki pastga tortganda | Bu modulda son o'zi yangilanmaydi |
| Real vaqt nuqtasi nima? | Ekran ochiq turganda boshqa odam tufayli o'zgaradigan joy | 8-darsdan; tasdiq soni — shunday joy |
| Tugma yashirilsa, Backend'dagi qoida nega qoladi? | Ilova xato ko'rsatsa ham, ruxsatsiz tasdiq yozilmasin deb | «Nima buzilmasin» qatoriga yoziladi |
| Bugun o'yin bo'lmasa, tasdiqni qanday tekshirasiz? | Bugungi sana bilan yangi e'lon berasiz | 1-funksiya shu uchun ham kerak |
| Uyga sinovda siz nima qilasiz? | Vazifani o'qib berasiz va to'xtashlarni yozasiz | Tushuntirmaysiz, yordam bermaysiz |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni
- Eyebrow: Yakun
- Yuqori yorliq: ✓ 2-funksiya tayyor (faqat 3-amaliyot bajarilgan bo'lsa) · N/2 to'g'ri
- Sarlavha (holatga qarab):
  - 3-amaliyot bajarilgan: Ikkinchi funksiya tayyor: ruxsatni Backend beradi.
  - 2-amaliyotgacha: Harakat va natija ishlaydi — tugma qoidasi qoldi.
  - faqat 1-amaliyot: Harakat va ruxsat ishlaydi — natijani ko'rsatish qoldi.
  - amaliyot bajarilmagan: Ikkinchi funksiya boshlandi — qolgan qadamni tugating.
- CODE STRIKE arenasi (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Harakatga kim va qachon ruxsat olishini Backend hal qiladi.
  - Token bor, lekin ruxsat yo'q bo'lsa, Backend `403` qaytaradi.
  - Tugma yashirilsa ham, Backend'dagi qoida joyida qoladi.
  - Bu modulda boshqa odam natijani ekranni ochganda yoki pastga tortganda ko'radi.
- Uyga vazifa (tugma «Amaliy topshiriqni bajarish →»), karta «Uyda nima qilasiz?»:
  - Kim bilan — mahsulotingiz kim uchun bo'lsa, shunday odamlar · Nechta — 3 ta sinov · Muddat — keyingi darsgacha
  1. Sinov vazifasini bitta gap qilib yozing: odam nimaga erishsin — qaysi tugmani bosishni emas. Vazifa — mahsulotingizdagi asosiy ish, faqat bugungi funksiya emas. Mentor misolida: «Shanba soat 18:00 dagi o'yinga qo'shiling.»
  2. Har sinovchidan oldin «Hisobdan chiqish»ni bosing: sinovchi namuna ism va har biri boshqa namuna telefon bilan ro'yxatdan o'tadi — o'z raqamini yozmaydi. Telefoningizni bering — unga hech narsa o'rnatish shart emas; mobil trekda laptopda `npx expo start` ishlab tursin (bitta Wi-Fi).
  3. Vazifani o'qib bering va kuzating: har to'xtashni vaqti bilan qog'ozga yozing, oxirida belgilang — vazifani bajara oldimi, ha yoki yo'q. Yozuvlarni keyingi darsga olib keling.
  - Karta ostida: 9-Moduldagidek: vazifa berasiz, yo'lni tushuntirmaysiz, yechimni ko'rsatib bermaysiz va qayerda to'xtaganini yozasiz.
- Keyingi dars — **«Uch foydalanuvchidan keyin nimani tuzatasiz?»**: auditoriya bilan sinov va shu darsda tuzatish.
- Nishonlaringiz — N/3 (uchta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Nishonlar
- **Rule Keeper** — Tugma yashirilsa ham qoida Backend'da kerakligini topdingiz (4-ekran, birinchi urinishda to'g'ri)
- **Fresh Count** — Tashkilotchi yangi sonni pastga tortganda ko'rishini topdingiz (7-ekran, birinchi urinishda to'g'ri)
- **Second Feature** — Uch amaliyot blokini oxirigacha bajardingiz (8-ekran, oxirgi «Bajardim»; bonus)
- Nishon olinganda: nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 4-ekran (1-savol) — **Ruxsatni Backend beradi**
   - `POST /oyinlar/:id/tasdiq` · So'rov — O'yinchi «Kelaman»ni bosganda Backend'ga ketadi.
   - `403 · Tasdiq faqat o'yin kuni` · Rad — Ruxsat bo'lmasa, Database o'zgarmaydi.
   - `holat: keladi` · Database — Faqat ruxsat bo'lsa yoziladi.
   - Sinfga savol: Tugma noto'g'ri joyda chiqsa, Database'ga ruxsatsiz yozuv nega tushmaydi?
2. 7-ekran (2-savol) — **Son so'rov bilan keladi**
   - `POST /oyinlar/1/tasdiq` · O'yinchi — Tasdiq Database'ga yoziladi.
   - `GET /oyinlar` · Tashkilotchi — Pastga tortganda yangi son so'raladi.
   - `Kelishini tasdiqladi: 7 / 9` · Natija — Yangi son javob kelgach chiqadi.
   - Sinfga savol: Tashkilotchi ekrani ochiq tursa, son nega o'zgarmaydi?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Qayta ishlash · mustaqil rejimda: Keyingi → · Natijani ko'rish · jonli dars tugasa: «Jonli dars yakunlandi — testni o'zingiz davom ettiring:» · Mashq rejimida davom etish

1. O'yinchi «Kelaman»ni bosdi. Ruxsatni kim beradi?
   - ✔ Backend — har so'rovni qoida bilan ko'rib
   - Ilova — tugmani ko'rsatib yoki yashirib
   - Database — yangi qatorni o'zi ko'rib
   - Tashkilotchi — har tasdiqni qo'lda ko'rib
2. Token bor, lekin o'yinchi o'yinga qo'shilmagan. Backend nima qaytaradi?
   - `401` — kimligi noma'lum deb
   - ✔ `403` — bu ishga ruxsat yo'q deb
   - `201` — yangi qatorni yozib qo'yib
   - `404` — bunday yo'l topilmadi deb
3. Shanbadagi o'yinga juma kuni «Kelaman» so'rovi keldi. Nima bo'ladi?
   - Database'ga baribir `keladi` yozib qo'yiladi
   - O'yin o'zi juma kuniga ko'chadi
   - ✔ Backend rad etadi, holat o'zgarmaydi
   - Tashkilotchi uni qo'lda tasdiqlaydi
4. «Kelishini tasdiqladi: 7 / 9» da 9 nimani bildiradi?
   - Kelishini tasdiqlagan o'yinchilar
   - O'yinga kerak bo'lgan odamlar
   - Maydondagi bo'sh o'rinlar soni
   - ✔ O'yinga qo'shilgan o'yinchilar
5. Tashkilotchi ekrani ochiq. Yangi tasdiqni qanday ko'radi?
   - ✔ Ekranni pastga tortib yangilaydi
   - Ilovani telefondan o'chirib qo'yadi
   - Har o'yinchiga qo'ng'iroq qiladi
   - O'yin boshlanishini kutib turadi
6. Bu modulda tashkilotchidagi son o'zi yangilanadimi?
   - Ha — Backend uni har soniyada yuboradi
   - ✔ Yo'q — ilova so'ragandagina yangilanadi
   - Ha — o'yinchi bosgan zahoti o'zgaradi
   - Yo'q — son faqat o'yin kuni yangilanadi
7. «Kelaman» endi faqat o'yin kuni chiqadi. Backend'dagi qoida-chi?
   - O'chiriladi — endi u kerak emas
   - Ilovaga ko'chadi — endi u ruxsat beradi
   - ✔ Qoladi — har so'rovga ruxsatni u beradi
   - Database'ga ko'chadi — u eslab qoladi
8. Ekran ochiq turganda boshqa odam tufayli nima o'zgaradi?
   - «‹ O'yinlar» tugmasining joyi
   - Ilova nomi «Maydon Jamoa»
   - E'lon formasidagi «Soat» qatori
   - ✔ «Kelishini tasdiqladi» dagi son
9. Tugmani yashirganda «Nima buzilmasin»ga nima yozasiz?
   - ✔ Backend'dagi qoida o'chirilmasin
   - Tugma har o'yinda turaversin
   - Database jadvali tozalab qo'yilsin
   - Yo'l tokensiz ham ochilsin
10. Tasdiqni tekshirish kerak, lekin bugun o'yin yo'q. Nima qilasiz?
    - Backend qoidasini vaqtincha o'chirasiz
    - ✔ Bugungi sana bilan yangi e'lon berasiz
    - Telefon soatini shanbaga o'tkazasiz
    - Shanba kelguncha kutib turasiz
11. Backend o'zgarishi Render'ga qanday chiqadi?
    - Render sahifasida kodni qo'lda yozasiz
    - `npx expo start` — ilovani qayta yoqasiz
    - ✔ `git push` — Render o'zi qayta chiqaradi
    - Neon'da jadvalni qaytadan yaratasiz
12. Ikkinchi telefonda tekshirish nima uchun kerak?
    - Sizning telefoningiz tezroq ishlashi uchun
    - Expo Go yangilanib olishi uchun
    - Ikkala telefonda ekran bir xil ko'rinishi uchun
    - ✔ Natijani boshqa odam ko'rishini bilish uchun

## Kartochkalar
10-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 11-ekrandagi 4 qator.
- Keyingi dars — «Uch foydalanuvchidan keyin nimani tuzatasiz?».
