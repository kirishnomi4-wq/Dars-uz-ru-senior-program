# 11-dars «Loyiha kuni: 1-asosiy funksiya» — yakuniy matn

Fayl: `src/9-Modull/FeatureOneLesson.jsx` · 12 ekran · Keyingi dars: «Loyiha kuni: 2-asosiy funksiya»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — «Funksiya sahnasi»: chapda telefon «Maydon Jamoa» (Expo Go), o'ngda Backend qutisi va Database · Neon kartasi; konvert — so'rov.
Telefon ekranlari:
- **O'yinlar** — sarlavha «O'yinlar», o'yin kartalari: kun va soat · maydon · «8 / 10» (A1 gacha — «10 kishi kerak»); to'lgan kartada kun yonida «to'ldi».
- **O'yin** — «‹ O'yinlar» · kun va soat · maydon · son · qo'shilganlar doiralari (ismsiz; o'quvchining doirasi ostida «Siz») · tugma «Qo'shilaman» / «Qo'shildingiz» (o'chiq) / «O'yin to'ldi».
- **E'lon berish** — sarlavha «E'lon berish», maydonlar: Kun `Yakshanba` · Soat `19:00` · Maydon `Maktab maydoni` · Nechta odam `10` · tugma «Yuborish».

Backend qutisi: `maydon-jamoa-….onrender.com · Render` · yo'llar `GET /oyinlar` · `POST /oyinlar` · `POST /oyinlar/:id/qoshilish`.
Namuna o'yinlar (dars bo'yi bir xil):
- Shanba, 18:00 · Mahalla maydoni · 8 / 10
- Shanba, 20:00 · Maktab maydoni · 6 / 10
- Yakshanba, 10:00 · Park maydoni · 4 / 8
- Yakshanba, 17:00 · Mahalla maydoni · 9 / 10
- Mentor misolidagi yangi e'lon: Yakshanba, 19:00 · Maktab maydoni · 0 / 10 (ro'yxatda eng tepada)

## 0 · Kirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: Tugmani ikki marta bossangiz, *«8 / 10» nima bo'ladi*?
- Mentor:
  - boshida: Mentor misolida agentga PRD dagi funksiya gapi o'zi yuborildi — agent «Tayyor» dedi. O'yinchi «Qo'shilaman»ni ikki marta bosmoqchi: avval javobni tanlang.
  - javobdan keyin: «Davom etish»ni bosing — bugungi rejani ko'rasiz.
- Maket (chap): telefon «Maydon Jamoa» — O'yin ekrani: «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · 8 / 10 · 8 ta to'la doira va 2 bo'sh joy · «Qo'shilaman».
- Yonida agent chati (Antigravity):
  - Siz: O'yin e'loni va qo'shilishni qur: tashkilotchi e'lon beradi, o'yinchi «Qo'shilaman»ni bosadi, «8 / 10» o'zgaradi.
  - Agent: Tayyor!
- Savol (variantlar guruhi halqada, ballsiz): Sizningcha, qaysi biri?
  - «9 / 10» — bitta o'yinchi faqat bitta joy oladi
  - «10 / 10» — har bosish yana bitta joy qo'shadi
  - «8 / 10» — ikkinchi bosish birinchisini bekor qiladi
- Javob tanlangach: telefonda «Qo'shilaman» ikki marta bosiladi → «8 / 10» → «9 / 10» → «10 / 10»; ikki yangi doira ostida «Siz», ikkalasi qizil, ostida qator: bitta o'yinchi — ikki joy. Agent chatida PRD gapi ostida uzuq chiziqli qator: ikki marta bosilsa — ?
- Javob izohlari:
  - «10 / 10» — har bosish… tanlansa: **Aynan!** Bu misolda PRD gapida ikki marta bosish aytilmagan edi. Agent har bosishni yangi joy deb sanadi.
  - «9 / 10» — bitta o'yinchi… tanlansa: **Qiziq fikr!** Shunday bo'lishi kerak edi, lekin PRD gapida bu holat yo'q. Agent har bosishni yangi joy deb sanadi.
  - «8 / 10» — ikkinchi bosish… tanlansa: **Qiziq fikr!** Bu misolda ikkinchi bosish ham joy qo'shdi: PRD gapida bu holat aytilmagan edi.
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Dars oxirida *birinchi funksiya* telefonda ishlaydi.
- Mentor: Roadmap'dagi birinchi funksiya — talabni siz yozasiz, kodni agent yozadi. Mentor misoli — o'yin e'loni va qo'shilish, siz esa o'z funksiyangizni qurasiz.
- Chap — Dars oxirida: Funksiya sahnasi bir marta o'zi yuradi: E'lon berish ekranida «Yuborish» bosiladi → konvert `POST /oyinlar` (token bilan) Backend'ga, so'ng Database'dagi `oyinlar` ga → O'yinlar ekranida yangi karta «Yakshanba, 19:00 · Maktab maydoni · 0 / 10» → Shanba 18:00 kartasi → O'yin ekrani: «Qo'shilaman» bosiladi → `POST /oyinlar/:id/qoshilish` → `ishtirokchilar` → «9 / 10», «Siz», tugma «Qo'shildingiz» → O'yinlar ro'yxati pastga tortiladi → `GET /oyinlar` → Yakshanba 17:00 kartasi «10 / 10», kun yonida «to'ldi» (ajralib turadi) → O'yin ekrani: tugma o'rnida «O'yin to'ldi». O'ngda Backend qutisi va Database · Neon (`oyinchilar` · `oyinlar` · `ishtirokchilar`).
- O'ng — Bugungi 3 qadam:
  1. E'lon berish: yangi o'yin ro'yxatda chiqadi
  2. Qo'shilish: «8 / 10» Backend'dan keladi
  3. Yangilash: to'lgan o'yinda «O'yin to'ldi»
- Pastki qator: repo `maydon-jamoa` · boshlang'ich holat `m11-dars-11-start` · namuna `m11-dars-11-done`
- Ostida: «Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda, roadmap'ingizdagi birinchi funksiya bilan bajarasiz.
- Tugmalar: Orqaga · Boshlaymiz

## 2 · E'lon kimniki bo'ladi?
- Eyebrow: Tushuncha · e'lon
- Sarlavha: Formada «kim» qatori yo'q. *E'lon kimniki bo'ladi*?
- Mentor:
  - boshida: Avval taxminingizni belgilang, keyin telefonda «Yuborish»ni bosing.
  - birinchi yuborishdan keyin: Endi xuddi shu e'lonni tokensiz yuborib ko'ring — Backend nima qilishini kuzating.
  - tugagach: Ikkala yuborish tugadi — natijani taxminingiz bilan solishtiring.
- Taxmin kartasi (halqada, ballsiz) — Avval o'zingiz belgilab ko'ring: Backend e'lon egasini qayerdan biladi?
  - Telefon raqamidan
  - So'rovdagi tokendan
  - Tanlangach ixcham qator: Taxminingiz · savol · tanlangan variant
- Chap — telefon (ustida yorliq «kirgan: Ali»): E'lon berish ekrani, forma to'ldirilgan; «Yuborish» taxmindan keyin halqada.
- O'ng — Backend qutisi va Database · Neon:
  - `oyinchilar` (id · ism): 1 · Namuna tashkilotchi · 2 · Ali
  - `oyinlar` (id · kun · soat · maydon · kerak · tashkilotchi_id): to'rt qator (2026-10-10 18:00 · 2026-10-10 20:00 · 2026-10-11 10:00 · 2026-10-11 17:00), `tashkilotchi_id` — 1
- «Yuborish» bosilgach: konvert `POST /oyinlar { kun, soat, maydon, kerak }` (yonida `token`) Backend'ga → Backend qutisida `token` → `oyinchilar · 2`, `2 · Ali` qatori yonadi → `oyinlar` ga yangi qator: 5 · 2026-10-11 · 19:00 · Maktab maydoni · 10 · 2; yonida yorliq: tokendan — formada yo'q → telefon O'yinlar ekraniga qaytadi, tepada yangi karta «Yakshanba, 19:00 · Maktab maydoni · 10 kishi kerak».
- Telefon ostida ikkinchi tugma (halqada): Tokensiz yuborish → konvert tokensiz ketadi → Backend qutisida qizil `401` → telefonda qator `401 · Unauthorized`, forma joyida qoladi → `oyinlar` o'zgarmaydi, ostida: yangi qator yo'q.
- Natija:
  - Taxminingiz: <tanlangan> · haqiqatda: **so'rovdagi tokendan** (to'g'ri bo'lsa: ✓ Taxminingiz to'g'ri chiqdi)
  - Backend tokendan kirgan o'yinchini taniydi va e'lon egasini shundan yozadi.
  - Xulosa: E'lon Database'ga yoziladi, egasini Backend tokendan oladi. Formada «kim» so'ralmaydi.
- Tugadi: harakat paneli yopiladi; telefon (O'yinlar) va `oyinlar` jadvalidagi yangi qator butun enga, `tashkilotchi_id` katagi ajralib turadi.
- Tugma: Avval taxminingizni belgilang → Ikkala yuborishni bosing (N/2) → Davom etish

## 3 · Amaliyot 1 — e'lon berish
- Eyebrow: Amaliyot 1 · e'lon berish
- Sarlavha: Funksiyangizning *birinchi qismi* telefonda ishlasin.
- Mentor: Uch qatorni o'zingiz yozasiz — har qator ostida kulrang savol, Mentor misoli «Yordam»da; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching (10-darsdagi holat: kirish ishlaydi, asosiy ro'yxat Backend'dan keladi).
     - Roadmap'ingizdagi birinchi funksiya: «<6-darsdagi roadmap'dan>» (bo'lmasa — `{1-funksiya}` qatori) (6-darsdagi roadmap'dan; bo'lmasa — shu qatorga o'zingiz yozing).
     - Uni uch blokda qurasiz; Mentor misolida: 1 — e'lon berish (ro'yxatga yangisi qo'shiladi) · 2 — qo'shilish (asosiy harakat) · 3 — ekran yangilanishi.
     - Funksiyangizda yangisini qo'shish bo'lmasa — bu blokda uning birinchi ko'rinadigan qismini quring.
  2. **Prompt** — vazifa: funksiyangizning birinchi qismi ishlasin va natijasi ro'yxatda chiqsin (Mentor misolida — tashkilotchi o'yin e'lon qiladi, e'lon ro'yxatda chiqadi). Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash — uch qator to'lgach):
       > Qayerda: {qayerda}
       > Nima qilsin: {nima qilsin}
       > Nima buzilmasin: {nima buzilmasin}
       > Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Qatorlar ostida kulrang savollar:
       - Qayerda — Qaysi ekran, qaysi tugma va Backend'da qaysi yo'l?
       - Nima qilsin — Bosilganda nima bo'lsin — Backend'da va ekranda? Qachon bo'lmasin?
       - Nima buzilmasin — Oldin ishlagan qaysi narsa joyida qolsin?
     - Yordam (tugma, ochiladi) — Mentor misolidagi to'liq talab (trek tanlanmagan bo'lsa yorliq «mobil trek»; web-trekda faqat web gapi):
       > Qayerda: `mobil/` — «E'lon berish» ekrani (`src/app/elon.tsx`) va «O'yinlar» (`src/app/index.tsx`); `backend/` — yangi yo'l `POST /oyinlar`.
       > Nima qilsin: «Yuborish» bosilganda kun, soat, maydon va nechta odam kerakligi token bilan `POST /oyinlar` ga ketsin. Backend e'lonni `oyinlar` ga yozsin; tashkilotchi — token egasi, formada «kim» so'ralmasin.
       > Maydonlardan biri bo'sh bo'lsa — Backend yozmasin (`400`), ilova nima yetmaganini aytsin. Yuborilgach «O'yinlar» ochilsin, yangi o'yin ro'yxatda tursin.
       > Nima buzilmasin: kirish, «O'yinlar» ro'yxati, «O'yin» ekrani va animatsiyalar.
       > Boshqa joyga tegma, o'zgargan fayllarni ayt.
       - Web-trekda: forma `prototip/` dagi e'lon sahifasida, so'rov `VITE_API_URL` dagi Backend'ga, token `localStorage` dan; foydalanuvchi matni sahifaga HTML bo'lib chiqmasin (10-darsdagidek).
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "e'lon berish"`, `git push`.
     - Render yangi deploy qiladi — xizmatingizning Deploys sahifasida tugashini kuting.
     - Mobil trekda `npx expo start` ishlab tursin: fayl o'zgarsa, Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`). (web-trekda ko'rinmaydi)
     - Web-trekda push'dan keyin Netlify o'zi yangilanadi. (mobil trekda ko'rinmaydi)
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabingizning har gapini telefonda bajarib ko'ring. Mentor misolida:
     - (1) «E'lon berish»da formani to'ldirib yuboring — «O'yinlar» tepasida yangi o'yin chiqsin.
     - (2) Bitta maydonni bo'sh qoldirib yuboring — ilova nima yetmaganini aytsin, ro'yxatga bo'sh e'lon qo'shilmasin.
     - (3) Neon'dagi SQL Editor'da `SELECT * FROM oyinlar ORDER BY yaratilgan DESC;` — birinchi qator sizning e'loningiz, `tashkilotchi_id` to'ldirilgan.
     - Mos kelmagan gapni uch qism bilan agentga yozing.
- O'ng — kutilgan natija · namuna: Maydon Jamoa (kadrlar bir marta o'zi yuradi):
  - telefon: E'lon berish (forma to'ldirilgan) → «Yuborish» bosiladi → O'yinlar: Yakshanba, 19:00 · Maktab maydoni · 10 kishi kerak (yangi) · Yakshanba, 17:00 · Mahalla maydoni · 10 kishi kerak · Yakshanba, 10:00 · Park maydoni · 8 kishi kerak · Shanba, 20:00 · Maktab maydoni · 10 kishi kerak · Shanba, 18:00 · Mahalla maydoni · 10 kishi kerak
  - Neon · SQL Editor: `SELECT * FROM oyinlar ORDER BY yaratilgan DESC;` · `oyinlar` — id 5 · kun 2026-10-11 · soat 19:00 · maydon Maktab maydoni · kerak 10 · tashkilotchi_id 2 (ajratilgan)
- Ostida: Ortda qoldingizmi — Mentor misolini oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m11-dars-11-done` — qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).
- Hammasi bajarilgach: Birinchi qism ishlaydi: natija Database'ga yoziladi va ro'yxatda chiqadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: Agent e'lon formasiga «Tashkilotchi» maydonini qo'shdi. *Agentga nima yozasiz*?
  - Maydonni qoldir, ismni o'yinchi o'zi yozsin
  - Maydonni majburiy qil, bo'sh yuborilmasin
  - ✔ Maydonni olib tashla, egasini tokendan ol
  - Tokenni olib tashla, egasini formadan ol
- Javob izohlari:
  - To'g'ri: Backend egasini tokendan oladi — formada «kim» so'ralmaydi.
  - A: Ismni har kim istaganicha yozadi. Egasi qayerdan keladi?
  - B: Bo'sh forma — boshqa holat. Bu maydonning o'zi kerakmi?
  - D: Tokensiz Backend kim yuborganini bilmaydi.
- Tugma (javobgacha): To'g'ri javobni toping
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: C — <variant> · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 5 · Ekrandagi son eskirgan bo'lsa
- Eyebrow: Tushuncha · to'lgan o'yin
- Sarlavha: Ekranda «9 / 10», *o'yin esa to'lgan* bo'lsa-chi?
- Mentor:
  - boshida: Ikki o'yinchi bitta o'yinni ochib turibdi — avval taxminingizni belgilang, keyin 2-telefonda «Qo'shilaman»ni bosing.
  - 2-telefon qo'shilgach: Endi talab qatorlarini bittadan tekshiring — «Tekshirish»ni bosing va 1-telefonni kuzating.
  - tugagach: Ikkala qator tekshirildi — natijani taxminingiz bilan solishtiring.
- Taxmin kartasi (halqada, ballsiz) — Avval o'zingiz belgilab ko'ring: Ilova to'lgan o'yinda tugmani yashirsa, 1-telefon qo'shila oladimi?
  - Qo'shila olmaydi
  - Qo'shila oladi
  - Tanlangach ixcham qator: Taxminingiz · savol · tanlangan variant
- Chap — ikki telefon yonma-yon, yorliqlar «1-telefon · o'yinchi» va «2-telefon · o'yinchi»; ikkalasida O'yin ekrani: «Yakshanba, 17:00» · «Mahalla maydoni» · 9 / 10 · 9 doira va 1 bo'sh joy · «Qo'shilaman» (2-telefonda halqada).
- O'ng — Backend qutisi (`POST /oyinlar/:id/qoshilish`) va Database · Neon: Yakshanba 17:00 · qo'shilganlar · katta son 9 / 10 · `ishtirokchilar`.
- 2-telefonda «Qo'shilaman» bosilgach: konvert Backend'ga → Database sanog'i «10 / 10» → 2-telefonda «10 / 10», tugma «Qo'shildingiz» → 1-telefon o'zgarmaydi: «9 / 10» va «Qo'shilaman», son ostida kulrang yorliq: oxirgi so'rovdagi son.
- Talab qatorlari bittadan, katta karta (yorliq «Qator N / 2», tugma «Tekshirish»):
  1. Nima qilsin: o'yin to'lsa, ilova «Qo'shilaman»ni yashirsin.
     - «Tekshirish» → 1-telefonda «Qo'shilaman» bosiladi → Database sanog'i «11 / 10» (qizil) → 1-telefonda «11 / 10», doiralar chegaradan chiqadi → karta ✗: Ekrandagi son eskirgan edi — ilova bilmadi. → sahna qaytadi (Database «10 / 10»).
  2. Nima qilsin: o'yin to'lsa, Backend qo'shmasin, ilova «O'yin to'ldi» desin.
     - «Tekshirish» → 1-telefonda «Qo'shilaman» bosiladi → Backend qutisida belgi: 10 / 10 — to'lgan → javob konverti `409 · O'yin to'ldi` qaytadi → 1-telefonda «10 / 10», tugma o'rnida «O'yin to'ldi» → karta ✓: Backend Database'ga qaradi.
  - Tekshirilgan qatorlar kartadan tepada ixcham turadi (✗ / ✓ va qator matni).
- Natija:
  - Taxminingiz: <tanlangan> · haqiqatda: **qo'shila oladi — ekranida hali «9 / 10» edi** (to'g'ri bo'lsa: ✓ Taxminingiz to'g'ri chiqdi)
  - Telefon sonni oxirgi so'raganda olgan — boshqa o'yinchi undan keyin qo'shilgan bo'lishi mumkin.
  - Xulosa: Telefondagi son eskirgan bo'lishi mumkin. To'lgan o'yinni Backend tekshiradi, ilova «O'yin to'ldi» deydi.
- Tugadi: harakat paneli yopiladi; ikki telefon (1-telefonda «O'yin to'ldi») va Database sanog'i «10 / 10» butun enga.
- Tugma: Avval taxminingizni belgilang → 2-telefonda qo'shiling → Qatorlarni tekshiring (N/2) → Davom etish

## 6 · Amaliyot 2 — qo'shilish
- Eyebrow: Amaliyot 2 · qo'shilish
- Sarlavha: Asosiy harakat ishlasin, *natija Database'da qolsin*.
- Mentor: Endi talabga bo'lmasligi kerak bo'lgan holatni ham yozasiz, namuna «Yordam»da; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Qadamlar:
  1. **Ochish** — e'lon berish ishlayapti. Funksiyangizning asosiy harakatini toping: foydalanuvchi ro'yxatdagi biriga nima qiladi? (Mentor misolida — o'yinchi o'yinga qo'shiladi.)
     - Qachon bu harakat bo'lmasligi kerak? (Mentor misolida — o'yin to'lgan yoki o'yinchi oldin qo'shilgan.)
  2. **Prompt** — vazifa: asosiy harakat ishlasin, natija Database'da qolsin; bo'lmasligi kerak bo'lgan holatda Backend yozmasin, ilova nima bo'lganini aytsin. Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi va kulrang savollar — 3-ekrandagidek (Qayerda · Nima qilsin · Nima buzilmasin · Boshqa joyga tegma, o'zgargan fayllarni ayt.)
     - Yordam — Mentor misolidagi to'liq talab:
       > Qayerda: `backend/` — yangi yo'l `POST /oyinlar/:id/qoshilish` va `GET /oyinlar`; `mobil/` — «O'yin» ekrani (`src/app/oyin/[id].tsx`) va «O'yinlar» kartalari.
       > Nima qilsin: «Qo'shilaman» bosilganda token bilan `POST /oyinlar/:id/qoshilish` ketsin; Backend `ishtirokchilar` ga `qoshildi` qatorini yozsin.
       > O'yin to'lgan bo'lsa yoki bu o'yinchi oldin qo'shilgan bo'lsa — yozmasin, `409` va xabar qaytarsin: «O'yin to'ldi» yoki «Siz bu o'yinga qo'shilgansiz»; ilova shu xabarni ko'rsatsin.
       > Bitta o'yinchi bitta o'yinda bir marta yozilsin — Database qoidasi bilan ham.
       > `GET /oyinlar` har o'yinga qo'shilganlar sonini va o'yinchining o'zi qo'shilganini bersin: kartada va «O'yin» ekranida «8 / 10» shu sondan chiqsin, qo'shilgan o'yinda tugma «Qo'shildingiz» (o'chiq).
       > Tekshirish uchun 9 ta namuna o'yinchi qo'sh (kirgan o'yinchi ular qatorida bo'lmasin) va ulardan qo'shilishlar: Shanba 18:00 ga 8, Shanba 20:00 ga 6, Yakshanba 10:00 ga 4, Yakshanba 17:00 ga 9 — bitta namuna o'yinchi bir necha o'yinda bo'lishi mumkin; bor bo'lsa, qayta qo'shma.
       > Nima buzilmasin: kirish, e'lon berish va «8 / 10» animatsiyasi.
       > Boshqa joyga tegma, o'zgargan fayllarni ayt.
       - Web-trekda: tugma va son `prototip/` dagi o'yin sahifasida, so'rov `VITE_API_URL` dagi Backend'ga, token `localStorage` dan — Backend qismi ikkala trekda bir xil.
  3. **Ishga tushirish** — `git status` → har faylni `git add <fayl>` → `git commit -m "qo'shilish"` → `git push`; Render'da yangi deploy tugashini kuting (Deploys sahifasi).
     - Expo Go ilovani odatda o'zi qayta yuklaydi, bo'lmasa — `r` (web-trekda — Netlify).
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabingizning har gapini telefonda bajarib ko'ring. Mentor misolida:
     - (1) Shanba 18:00 dagi o'yinga qo'shiling — «8 / 10» → «9 / 10», tugma «Qo'shildingiz».
     - (2) Terminalda `r` ni bosing (web-trekda sahifani yangilang) — «9 / 10» va «Qo'shildingiz» joyida.
     - (3) Yakshanba 10:00 dagi «Qo'shilaman»ni tez ikki marta bosing — «4 / 8» → «5 / 8»: son faqat bittaga oshsin.
     - (4) To'lgan o'yin — test holati: Neon'dagi SQL Editor'da kerakli odam sonini vaqtincha kamaytirasiz. `SELECT id, soat, maydon, kerak FROM oyinlar;` — Shanba 20:00 ning `id` sini toping, `UPDATE oyinlar SET kerak = 6 WHERE id = …;` → telefonda Shanba 20:00 dagi «Qo'shilaman»ni bosing — ilova «O'yin to'ldi» desin, son oshmasin. So'ng qaytaring: `UPDATE oyinlar SET kerak = 10 WHERE id = …;`
     - O'z mahsulotingizda bo'lmasligi kerak bo'lgan holatni ham shunday yarating va tekshiring. Mos kelmagan gapni uch qism bilan agentga yozing.
- O'ng — kutilgan natija · namuna: Maydon Jamoa:
  - telefon: O'yin (Shanba, 18:00 · Mahalla maydoni) «8 / 10» · «Qo'shilaman» bosiladi → «9 / 10», yangi doira ostida «Siz», tugma «Qo'shildingiz» → test holati (telefon ustida yorliq): O'yin (Shanba, 20:00 · Maktab maydoni) «6 / 6» · tugma o'rnida «O'yin to'ldi»
  - Neon · SQL Editor: `ishtirokchilar` — oyin_id 1 · oyinchi_id 2 · holat qoshildi
- Hammasi bajarilgach: Asosiy harakat ishlaydi: natija Database'da qoladi, bo'lmasligi kerak bo'lgan holatda Backend yozmaydi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Ekranda «7 / 8». Oxirgi joyni boshqa o'yinchi oldi. *Bossangiz nima bo'lishi kerak*?
  - Backend qo'shadi, ilova «8 / 8» ni ko'rsatadi
  - Backend qo'shadi, ilova «9 / 8» ni ko'rsatadi
  - Ilova qo'shmaydi, tugmani o'zi yashirib qo'yadi
  - ✔ Backend qo'shmaydi, ilova «O'yin to'ldi» deydi
- Javob izohlari:
  - To'g'ri: Backend Database'ga qaraydi — ekrandagi son eskirgan edi.
  - A: Database'da o'yin to'lgan edi. Backend yana qo'shsinmi?
  - B: Bu — talabda aytilmagan holat. Kim tekshirishi kerak edi?
  - C: Ekranda «7 / 8» turibdi — ilova joy bor deb biladi.
- Tugma (javobgacha): To'g'ri javobni toping
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: D — <variant> · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 8 · Amaliyot 3 — yangilash
- Eyebrow: Amaliyot 3 · yangilash
- Sarlavha: Ro'yxat yangilansin: *Database'dagi o'zgarish ko'rinsin*.
- Mentor: Oxirgi blok — ekran Database bilan bir xil bo'lsin, keyin butun funksiyani tekshirasiz; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Qadamlar:
  1. **Ochish** — qo'shilish ishlayapti. 8-darsda `README.md` ga yozgan real vaqt nuqtangizni toping: ekranda boshqa foydalanuvchi tufayli o'zgaradigan joy (Mentor misolida — «8 / 10»).
  2. **Prompt** — vazifa: shu joy ekran ochilganda va pastga tortilganda (web-trekda — «Yangilash» bosilganda) Backend'dan qayta kelsin; bo'lmasligi kerak bo'lgan holat ekranda oldindan ko'rinsin. Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi va kulrang savollar — 3-ekrandagidek.
     - Yordam — Mentor misolidagi to'liq talab:
       > Qayerda: `mobil/` — «O'yinlar» (`src/app/index.tsx`) va «O'yin» (`src/app/oyin/[id].tsx`) ekranlari.
       > Nima qilsin: ikkala ekran ochilganda va pastga tortilganda ma'lumotni `GET /oyinlar` dan qayta olsin.
       > O'yin to'lgan bo'lsa — kartada son yonida «to'ldi», «O'yin» ekranida «Qo'shilaman» o'rnida «O'yin to'ldi» tursin.
       > Nima buzilmasin: e'lon berish, qo'shilish, «Qo'shildingiz» va animatsiyalar.
       > Boshqa joyga tegma, o'zgargan fayllarni ayt.
       - Web-trekda: pastga tortish o'rniga «Yangilash» tugmasi — ro'yxat va o'yin sahifasi ochilganda va shu tugma bosilganda `GET /oyinlar` dan qayta olinsin.
  3. **Ishga tushirish** — trekka qarab bitta gap:
     - mobil: bu blokda Backend o'zgarmaydi: Expo Go ilovani odatda o'zi qayta yuklaydi, bo'lmasa — `r`.
     - web: bu blokda Backend o'zgarmaydi: web-trekda — `git push`, Netlify saytni o'zi yangilaydi.
     - trek tanlanmagan: bu blokda Backend o'zgarmaydi: Expo Go ilovani odatda o'zi qayta yuklaydi, bo'lmasa — `r`; web-trekda — `git push`, Netlify saytni o'zi yangilaydi.
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari va tokenni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — butun funksiyani tekshiring. Mentor misolida:
     - (1) Test holati: Neon'dagi SQL Editor'da siz qo'shilmagan Yakshanba 17:00 da kerakli sonni 9 ga tushiring: `UPDATE oyinlar SET kerak = 9 WHERE id = …;` → telefonda «O'yinlar»ni pastga torting (web-trekda — «Yangilash») — kartada «9 / 9 · to'ldi», «O'yin» ekranida «Qo'shilaman» o'rnida «O'yin to'ldi».
     - (2) Qaytaring: `UPDATE oyinlar SET kerak = 10 WHERE id = …;` → yana pastga torting — «9 / 10» va «Qo'shilaman» qaytdi.
     - (3) Uch blok talablarining har gapini yana bir marta bajaring: e'lon berish, qo'shilish, ikki marta bosish.
     - Oxirida `git status` → `git add <fayl>` → `git commit -m "yangilash"` → `git push`.
- O'ng — kutilgan natija · namuna: Maydon Jamoa:
  - telefon: O'yinlar pastga tortilmoqda (tepada aylanuvchi belgi): Yakshanba, 19:00 · 0 / 10 · Yakshanba, 17:00 · 9 / 10 · Yakshanba, 10:00 · 5 / 8 · Shanba, 20:00 · 6 / 10 · Shanba, 18:00 · 9 / 10 → Yakshanba, 17:00 kartasi «9 / 9», kun yonida «to'ldi» (ajratilgan) → O'yin (Yakshanba, 17:00 · Mahalla maydoni) «9 / 9» · tugma o'rnida «O'yin to'ldi»
  - Neon · SQL Editor · test holati: `UPDATE oyinlar SET kerak = 9 WHERE id = 4;`
- Hammasi bajarilgach: Birinchi funksiya ishlaydi: ekran yangilanadi, to'lgan holat oldindan ko'rinadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 9 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 10 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.
- Birinchi bosishgacha (karta halqada): Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon | Izoh |
|---|---|---|
| Roadmap'dagi funksiyani agentga qanday berasiz? | Uch qatorli talab qilib: qayerda, nima qilsin, nima buzilmasin | Bu darsda uchala qatorni o'zingiz yozdingiz |
| PRD gapining o'zi agentga yuborilsa, nima bo'lishi mumkin? | Aytilmagan holatni agent o'zi taxmin qiladi | Mentor misolida: ikki marta bosilganda «10 / 10» |
| E'lon egasini Backend qayerdan oladi? | So'rovdagi tokendan | Formada «kim» so'ralmaydi |
| Ilova qayta yuklansa, yangi e'lon nega yo'qolmaydi? | U Database'ga yozilgan | 7-darsdagi prototipda e'lon faqat ochiq sahifada edi |
| «8 / 10» dagi 8 qayerdan keladi? | Database'dagi qo'shilganlar sonidan | Backend sanaydi — telefon o'zi qo'shib qo'ymaydi |
| Bir o'yinchi «Qo'shilaman»ni ikki marta bossa, nima bo'lishi kerak? | Son bittaga oshadi | Backend ikkinchisiga `409` qaytaradi |
| Nega to'lgan o'yinni faqat ilova tekshirsa yetmaydi? | Ekrandagi son eskirgan bo'lishi mumkin | Siz bosguncha boshqa o'yinchi qo'shilgan bo'lishi mumkin |
| To'lgan o'yinda «Qo'shilaman» o'rnida nima turadi? | «O'yin to'ldi» | Backend ham bu o'yinga qo'shmaydi |
| Boshqa telefondagi «8 / 10» qachon yangilanadi? | Ekran ochilganda yoki pastga tortilganda | «8 / 10» — real vaqt nuqtasi |
| Backend o'zgarishi telefonga qachon yetadi? | Push'dan keyin Render yangi deploy'ni tugatgach | Xizmatning Deploys sahifasida ko'rinadi |
| To'lgan o'yinni bitta telefon bilan qanday tekshirasiz? | Neon'dagi SQL Editor'da test holati bilan | Kerakli sonni vaqtincha kamaytirasiz, keyin qaytarasiz |
| Agent «Tayyor» desa, ishni qanday tekshirasiz? | Talabning har gapini telefonda bajarib ko'rib | Agent talabga tayanib quradi, taxmin qilishi mumkin |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni
- Eyebrow: Yakun
- Yuqori yorliq: ✓ Birinchi funksiya ishlaydi (faqat 3-amaliyot bajarilganda; aks holda yorliq yo'q) · N/2 to'g'ri
- Sarlavha (bloklar holatiga qarab):
  - 3-amaliyot bajarilgan: Birinchi funksiya ishlayapti: talabni siz yozdingiz.
  - 2-amaliyotgacha: Asosiy harakat ishlaydi — yangilanish qoldi.
  - faqat 1-amaliyot: Birinchi qism ishlaydi — asosiy harakat qoldi.
  - hech biri bajarilmagan: Birinchi funksiya boshlandi — qolgan qadamni tugating.
- CODE STRIKE arenasi (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Roadmap'dagi funksiyani uch qatorli talabga aylantirib, o'zingiz yozasiz.
  - Talabda aytilmagan holatni agent o'zi taxmin qilishi mumkin — uni talabda yozasiz.
  - E'lon egasini Backend tokendan oladi, «8 / 10» esa Database'dan sanaladi.
  - Ekrandagi son eskirgan bo'lishi mumkin: to'lgan o'yinni Backend tekshiradi.
- Keyingi dars — **«Loyiha kuni: 2-asosiy funksiya»**: roadmap'dagi ikkinchi funksiya.
- Nishonlaringiz — N/3 (uchta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Nishonlar
- **Right Owner** — E'lon egasi tokendan olinishini topdingiz (4-ekran, 1-savol, birinchi urinishda to'g'ri)
- **Full Game** — To'lgan o'yinni Backend tekshirishini topdingiz (7-ekran, 2-savol, birinchi urinishda to'g'ri)
- **First Feature** — Uch amaliyot blokini oxirigacha bajardingiz (8-ekran, oxirgi «Bajardim»; bonus)
- Nishon olinganda: nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 4-ekran (1-savol) — **E'lon egasi — tokendan**
   - `POST /oyinlar` · E'lon — Kun, soat, maydon va odam soni Backend'ga ketadi.
   - `Authorization: Bearer <token>` · Token — So'rov bilan birga kim yuborgani ham keladi.
   - `tashkilotchi_id` · Egasi — Backend uni tokendan yozadi, formadan emas.
   - Sinfga savol: Formaga «Tashkilotchi» maydoni nega kerak emas?
2. 7-ekran (2-savol) — **To'lgan o'yinni Backend tekshiradi**
   - `9 / 10` · Ekran — Telefon oxirgi so'ralgan sonni ko'rsatadi.
   - `POST /oyinlar/:id/qoshilish` · Backend — Database'dagi sonni ko'rib, o'yin to'lganini biladi.
   - `409 · O'yin to'ldi` · Javob — Backend qo'shmaydi, ilova xabarni ko'rsatadi.
   - Sinfga savol: Ekranda joy bor edi — nega qo'shila olmadingiz?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Qayta ishlash · mustaqil rejimda: Keyingi → · Natijani ko'rish · jonli dars tugasa: «Jonli dars yakunlandi — testni o'zingiz davom ettiring:» · Mashq rejimida davom etish

1. Roadmap'dagi funksiyani agentga qanday berasiz?
   - ✔ Uch qatorli talab qilib, o'zingiz yozib
   - Roadmap qatorini o'zgartirmay, o'zini
   - PRD ning hamma bo'limini birdaniga yuborib
   - Faqat funksiya nomini, qisqa qilib yozib
2. Talabda ikki marta bosish aytilmagan. Agent nima qilishi mumkin?
   - Tugmani ekrandan butunlay olib tashlaydi
   - ✔ Bu holatni o'zicha taxmin qilib quradi
   - Funksiyani umuman qurmasdan qoldiradi
   - Ilovani boshidan to'liq qayta yozadi
3. Formada «kim» yo'q. E'lon egasi qayerdan olinadi?
   - Telefon raqamidan, so'rovdagi
   - Ilova ustidagi ism yozuvidan
   - ✔ So'rov bilan kelgan tokendan
   - Database'dagi oxirgi qatordan
4. Ilova qayta yuklandi. Yangi e'lon nega yo'qolmadi?
   - Telefon xotirasiga yozilgani uchun
   - Agent uni namunaga qo'shgani uchun
   - Expo Go uni o'zida saqlagani uchun
   - ✔ U Database'ga yozilgani uchun
5. «8 / 10» dagi 8 qayerdan keladi?
   - ✔ Database'dagi qo'shilganlar sonidan
   - Telefonda bosilgan tugmalar sanog'idan
   - Prototipdagi namuna fayl raqamidan
   - Tashkilotchi formaga yozgan sondan
6. Bir o'yinchi «Qo'shilaman»ni ikki marta bosdi. Nima bo'lishi kerak?
   - Son ikkiga oshadi, ikkala joy ham olinadi
   - ✔ Son bittaga oshadi, ikkinchisi yozilmaydi
   - Son o'zgarmaydi, ikkala bosish ham bekor
   - O'yin o'chadi, qayta e'lon kerak bo'ladi
7. Ekranda «9 / 10», o'yin esa to'lgan. Nega shunday?
   - Backend sonni noto'g'ri sanab qo'ygan
   - Database'ga qo'shilganlar yozilmagan
   - ✔ Ekranda oxirgi so'ralgan son turibdi
   - Agent ekranni noto'g'ri qurib qo'ygan
8. To'lgan o'yinga qo'shmaslikni qayerda tekshirish kerak?
   - Ilovada, tugmani ekrandan yashirib
   - Talabda, agent o'zi bilsin deb
   - Neon'da, har kuni qo'lda sanab
   - ✔ Backend'da, Database'ga qarab
9. Backend to'lgan o'yinga qo'shmadi. Ilova nima ko'rsatadi?
   - ✔ «O'yin to'ldi» degan xabarni
   - «11 / 10» degan yangi sonni
   - Yozuvsiz, bo'sh qolgan ekranni
   - «Kirish» ekranini qayta ochib
10. Boshqa telefondagi «8 / 10» qachon yangilanadi?
   - Har soniyada o'zi, hech narsa so'ramasdan
   - ✔ Ekran ochilganda yoki pastga tortilganda
   - Faqat ilova qayta o'rnatilgandan keyin
   - Tashkilotchi o'yinga ruxsat berganda
11. Backend o'zgardi. Telefonda u qachon ishlaydi?
   - Agent «Tayyor» deb javob berishi bilan
   - `git commit` qilinishi bilan, push'siz
   - ✔ Push'dan keyin Render yangilangach
   - Telefon o'chib, qayta yoqilgandan keyin
12. Agent «Tayyor» dedi. Keyin nima qilasiz?
   - Shu zahoti keyingi blokka o'tasiz
   - Agentdan yana bir bor so'rab ko'rasiz
   - README'ga «tayyor» deb yozib qo'yasiz
   - ✔ Talabning har gapini tekshirasiz

## Kartochkalar
10-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 11-ekrandagi 4 qator.
- Keyingi dars — «Loyiha kuni: 2-asosiy funksiya».
