# 3-dars «Loyiha kuni: jonli dashboard» — yakuniy matn

Fayl: `src/8-Modull/LiveDashboardLesson.jsx` · 12 ekran (8 ekran + 3 amaliyot bloki + kartochkalar) · Keyingi dars: «Ikki variantdan qaysi biri yaxshiroq ishlaydi?»
Holat: 06.10.2026 — kodga mos

## 0 · Kirish — «Oxirgi 5 daqiqada: 3»
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: «Oxirgi 5 daqiqada: 3» — bu raqam nimani sanaydi?
- Mentor: «Maydon» egasi saytdagi raqamlarni bitta sahifada ko'radi — bunday sahifa dashboard (holat paneli) deyiladi. Uch javobdan bittasini tanlang.
- Maket (chap) — brauzer `maydon-….netlify.app/dashboard`:
  - Maydon · dashboard · hozir 18:45
  - Oxirgi 5 daqiqada: 3
  - Bugun: ochdi 14 → vaqtni tanladi 9 → band qildi 3
  - Oxirgi hodisalar (javob tanlangach ochiladi; «3» dan uchta yashil qatorga chiziq tortiladi):
    - `3f2c…` · 18:44 · `band-qildi`
    - `a91e…` · 18:43 · `vaqt-tanladi`
    - `c07b…` · 18:41 · `ochdi`
    - `e58d…` · 18:36 · `ochdi` — 5 daqiqadan oldin — sanalmaydi
- Savol: Sizningcha, qaysi biri?
  - Shu payt sahifani ochib o'tirgan uch kishi
  - ✔ Shu 5 daqiqada hodisa yuborgan uch brauzer
  - Shu 5 daqiqada band qilgan uch o'yinchi
- Javob izohlari:
  - 2-variant: Aynan! Bu raqam — oxirgi 5 daqiqada hodisa yuborgan turli brauzerlar. Ochiq sahifani Backend ko'rmaydi.
  - 1-variant: Qiziq fikr! Ochiq sahifani Backend ko'rmaydi. Bu raqam — oxirgi 5 daqiqada hodisa yuborgan turli brauzerlar.
  - 3-variant: Qiziq fikr! Band qilganlar «band qildi» qadamida. Bu raqam — 5 daqiqada hodisa yuborgan turli brauzerlar.
- Tugma: Davom etish

## 1 · Bugun quramiz
- Eyebrow: Reja
- Sarlavha: Dars oxirida «Maydon» dashboard'i jonli ishlaydi.
- Mentor: Talabni siz yozasiz, agent dashboard'ni yig'adi. «Maydon» — namuna: har amaliyot oxirida shu talabni o'z MVP'ingiz uchun ham yozasiz.
- Yorliq (chap): Dars oxirida — brauzer `maydon-….netlify.app/dashboard`:
  - Maydon · dashboard
  - Oxirgi 5 daqiqada: 3 (bir marta o'zi yangilanadi: 3 → 4)
  - Bugun: ochdi 14 (→ 15) → vaqtni tanladi 9 → band qildi 3
  - Yangilandi: 18:45:05
- Yorliq (o'ng): Bugungi 3 qadam
  1. Backend bugungi raqamlarni egaga token bilan beradi
  2. Dashboard raqamlari sahifani yangilamasdan o'zgaradi
  3. Dashboard internetda: sinfdosh kirsa, raqam oshadi
- Pastki qator: repo `maydon` · boshlang'ich holat `m10-dars-03-start` · namuna `m10-dars-03-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Har qadamda nimani sanaymiz?
- Eyebrow: Tushuncha · sanoq
- Sarlavha: O'yinchi uch katakni bosdi. Dashboard nechta desin?
- Mentor: Umami'da `vaqt-tanladi` har bosishda oshardi; o'yinchi bo'lib bo'sh kataklarni bosing.
- Avval o'zingiz belgilab ko'ring: «Vaqtni tanladi» nechta bo'lsin? · Bitta · Ikkita · Uchta
  - Tanlangach (ixcham qator): Taxminingiz · «Vaqtni tanladi» nechta bo'lsin? · <tanlov>
- Chap — o'yinchi telefoni: Maydon · ‹ Bugun › · 16:00 · 17:00 · 18:00 · 19:00 · 20:00 · 21:00 (bo'sh kataklar)
- O'ng — jadval `hodisalar` (nom · brauzer_id · yaratilgan):
  - ochdi · 3f2c… · 18:40:02
  - har bosishda yangi qator: vaqt-tanladi · 3f2c… · 18:40:15 / 18:40:19 / 18:40:24
- Ikki sanoq (har biri: ochdi · vaqtni tanladi · band qildi):
  - Har qator sanalsa: ochdi 1 · vaqtni tanladi 0 → 1 → 2 → 3 · band qildi 0 — oxirida: Bosishlar sanaldi: vaqt tanlaganlar ochganlardan ko'p.
  - Turli brauzerlar sanalsa: ochdi 1 · vaqtni tanladi 0 → 1 · band qildi 0 — oxirida (✓): Turli brauzerlar sanaldi: har qadamda bitta.
- Natija:
  - Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: <tanlov> · haqiqatda: bitta — qator uchta, brauzer bitta)
  - Har qatorda brauzer ID bor: u bitta brauzerni ajratadi, odamning ismini bildirmaydi.
  - Bu dashboard'da har qadam — turli brauzerlar soni. Shunda qadamlarni foiz bilan mazmunliroq solishtira olamiz.
- Shundan keyin dashboard maketida uch qadam ostida: har qadamda — turli brauzerlar soni
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Kataklarni bosing (N/3) → Davom etish

## 3 · Amaliyot 1 — Backend raqamlarni beradi, dashboard ko'rsatadi
- Eyebrow: Amaliyot 1 · Backend → dashboard
- Sarlavha: Dashboard bugungi raqamlarni parol bilan ko'rsatsin.
- Mentor: Talab tayyor — siz `{qanday sanasin}` joyini yozasiz; «1 · Ochish»dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; bajarilgani ✓ bilan yopiladi, ↻ — Qaytarish):
  1. Ochish — Antigravity'da `maydon` papkasini oching. Birinchi terminalda: `cd backend`, `npm run start:dev`. Ikkinchisida: `cd web`, `npm run dev`.
     `backend/.env` dagi `EGA_PAROLI` va `JWT_SECRET` ega sahifasi uchun yozilgan — dashboard o'sha parol bilan ochiladi.
  2. Prompt — `{qanday sanasin}` joyiga har hodisa qanday sanalishini yozing (uch katak bosilgan mashqni eslang), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi («Siz → Antigravity» · Nusxalash):
       - Qayerda: Backend'da yangi yo'l GET /hodisalar/sanoq?kun= (kun — sana, masalan 2026-10-05); saytda yangi /dashboard sahifasi (web/).
       - Nima qilsin: Backend shu kun uchun hodisalar jadvalidagi ochdi, vaqt-tanladi, band-qildi hodisalarining har biri uchun {qanday sanasin}; hodisa bo'lmasa — 0. Kun Toshkent vaqti bilan.
       - Yana hozir bersin: oxirgi 5 daqiqada hodisa yuborgan turli brauzerlar soni.
       - Bu yo'l tokensiz javob bermasin — GET /bandlar dagi himoya (EgaGuard) bilan.
       - /dashboard /ega dagidek parol so'rasin (POST /kirish → token), keyin bugungi raqamlarni ko'rsatsin: «Oxirgi 5 daqiqada» va uch qadam — ochdi → vaqtni tanladi → band qildi.
       - Token /ega dagidek faqat ochiq sahifada tursin.
       - Nima buzilmasin: POST /hodisalar va hodisalar jadvalining ustunlari, /ega va o'yinchi sahifasi; /dashboard ochilganda hodisa yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam (bosilsa ochiladi): «turli brauzerlar sonini bersin (bir brauzer necha marta yozsa ham, bitta sanalsin)»
  3. Ishga tushirish — Backend terminali o'zi qayta yukladi, sayt o'zi yangilandi, xato yo'q.
     - Xato izohi: Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. Brauzerda tekshirish — talabning har qatorini tekshiring:
     (1) `localhost:3000/hodisalar/sanoq?kun=` ga bugungi sanani qo'shib oching — raqamlar emas, `401` chiqsin: tokensiz yopiq.
     (2) `localhost:5173/dashboard` — parol bilan kiring: «Oxirgi 5 daqiqada» va uch qadam ko'rinadi.
     (3) Inkognito oyna oching (Chrome va Edge'da Ctrl+Shift+N, Mac'da Cmd+Shift+N) — sayt uni yangi brauzer deb ko'radi. Unda `localhost:5173` ni oching va ikki xil bo'sh katakni bosing.
     Dashboard'ni yangilang (parol so'ralsa — kiriting): «Oxirgi 5 daqiqada», «ochdi» va «vaqtni tanladi» bittadan oshgan — ikki bosish, bitta brauzer.
     Mos kelmagan qatorni uch qism bilan agentga yozing.
  5. O'z g'oyangiz — shu promptni o'z MVP'ingiz uchun yozing: dashboard qaysi uch qadamni sanasin va uni kim ko'rsin? Uch qatorni to'ldiring.
     - Forma: Qayerda: … · Nima qilsin: … · Nima buzilmasin: … · Nusxalash («Bajardim» uchala qator yozilgach ochiladi)
- Yorliq (o'ngda): kutilgan natija · namuna: Maydon
  - Brauzer `localhost:5173/dashboard`: Maydon · dashboard · Parol · Kirish → (parol yozilgach) Oxirgi 5 daqiqada: 3 · Bugun: ochdi 14 → vaqtni tanladi 9 → band qildi 3 · har qadamda — turli brauzerlar soni
  - Sizda raqamlar boshqacha — o'z bosishlaringiz sanaladi.
  - Ikkinchi brauzer `localhost:3000/hodisalar/sanoq?kun=2026-10-05`: 401 · Unauthorized
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-03-start`
- Hammasi bajarilgach: Dashboard bugungi raqamlarni ko'rsatadi, Backend ularni token bilan beradi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: Bugun hali kirmagan o'yinchi saytni telefon va laptopdan ochdi. «Ochdi» nechtaga oshadi?
  - Bittaga — brauzerlar bir odamniki
  - ✔ Ikkitaga — har brauzer alohida
  - Nolga — hali katak bosilmagan
  - Bilib bo'lmaydi — ism yozilmagan
- Javob izohlari:
  - To'g'ri: Telefon va laptop — ikki brauzer, ikkalasining ID si boshqa.
  - 1-variant: Odam bitta — rost. Dashboard esa nimani ajratadi?
  - 3-variant: «Ochdi» sahifa ochilganda yoziladi, bosishni kutmaydi.
  - 4-variant: Sanash uchun ism kerak emas — jadvalda nima turardi?
- Test ekranlarining umumiy yozuvlari (4 va 7-ekranlarda bir xil):
  - Natija sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · (jonli darsda) Javobingiz qabul qilindi → Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <variant>
  - Jonli darsda savol ostida: Jonli dars — bitta urinish, o'ylab bosing!
  - Xato javobdan keyin havola: Qisqa takrorlash — mavzuni yana bir ko'rish
  - Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 5 · Raqam o'zi qanday yangilanadi?
- Eyebrow: Tushuncha · yangilanish
- Sarlavha: Yangi o'yinchi kirdi. Dashboard buni qachon ko'radi?
- Mentor: Telefonda o'yinchi bo'lib saytni oching va dashboard raqami qachon o'zgarishini kuzating.
- Avval o'zingiz belgilab ko'ring: O'yinchi saytni ochdi. Dashboard'dagi raqam qachon o'zgaradi? · Shu soniyaning o'zida · 5 soniya ichida · Ega sahifani yangilaganda
  - Tanlangach (ixcham qator): Taxminingiz · <savol> · <tanlov>
- Chap — o'yinchi telefoni: avval yopiq (ilova belgisi «Maydon») va tugma «Saytni ochish»; ochilgach Maydon · ‹ Bugun › · 16:00 … 21:00, birinchi o'zgarish ko'ringach 18:00 bosiladi
- O'rta — Backend qutisi: Backend · `POST /hodisalar` · `GET /hodisalar/sanoq` (qulf); hodisa kelganda «+1 qator»
- O'ng — dashboard maketi `maydon-….netlify.app/dashboard` (birinchi harakatdan keyin burchakda taymer 5 → 0): Maydon · dashboard · Oxirgi 5 daqiqada 3 → 4 · Bugun: ochdi 14 → 15 → vaqtni tanladi 9 → 10 → band qildi 3 · har qadamda — turli brauzerlar soni
- Konvert yozuvlari: `POST /hodisalar · ochdi` · `GET /hodisalar/sanoq` · javob · `POST /hodisalar · vaqt-tanladi`
- Joriy qator (ikkinchi bosishdan keyin): Sayt Backend'dan qayta-qayta so'raydi — botdagi polling kabi.
- Natija:
  - Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: <tanlov> · haqiqatda: keyingi so'rovda — odatda 5 soniya ichida)
  - Sayt Backend'dan qayta-qayta so'raydi — botdagi polling kabi.
  - Bu dashboard'da Backend o'zi yubormaydi: sayt har 5 soniyada so'raydi, raqam shuncha kechikishi mumkin.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Telefonda bosing (N/2) → Davom etish

## 6 · Amaliyot 2 — raqamlar o'zi yangilanadi
- Eyebrow: Amaliyot 2 · har 5 soniyada so'rov
- Sarlavha: Dashboard raqamlari sahifani yangilamasdan o'zgarsin.
- Mentor: Endi «Nima qilsin» qatorini o'zingiz yozasiz, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. Ochish — ikkala terminal ishlayapti. `localhost:5173/dashboard` ga parol bilan kiring: raqamlar hali sahifa yangilangandagina o'zgaradi.
  2. Prompt — `{nima qilsin}` qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi («Siz → Antigravity» · Nusxalash):
       - Qayerda: /dashboard sahifasi (web/).
       - Nima qilsin: {nima qilsin}
       - Nima buzilmasin: parol bilan kirish, «Oxirgi 5 daqiqada» va uch qadam, GET /hodisalar/sanoq dagi himoya; /ega va o'yinchi sahifasi. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam (bosilsa ochiladi): Nima qilsin: kirgan zahoti raqamlarni bir marta so'rasin, keyin har 5 soniyada `GET /hodisalar/sanoq` dan token bilan qayta so'rab yangilasin; oldingi so'rov hali tugamagan bo'lsa, yangisini ustma-ust yubormasin. Javob `401` bo'lsa (token eskirgan) — so'rov to'xtasin, parol formasi qaytsin.
  3. Ishga tushirish — sayt o'zi yangilandi, terminalda xato yo'q.
     - Xato izohi: Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. Brauzerda tekshirish — dashboard ochiq tursin, uni yangilamang. Hamma inkognito oynalarni yoping va yangisini oching — u yana yangi brauzer bo'ladi.
     Unda `localhost:5173` ni oching va bo'sh katakni bosing. Dashboard'ga qayting: keyingi so'rovdan keyin «Oxirgi 5 daqiqada», «ochdi» va «vaqtni tanladi» o'zi oshadi (tarmoqqa qarab biroz kechroq bo'lishi mumkin).
     Mos kelmasa — ko'rganingizni uch qism bilan agentga yozing.
  5. O'z g'oyangiz — shu promptni o'z MVP'ingiz uchun yozing: dashboard raqamlari necha soniyada bir yangilansin? Uch qatorni to'ldiring.
     - Forma: Qayerda: … · Nima qilsin: … · Nima buzilmasin: … · Nusxalash
- Yorliq (o'ngda): kutilgan natija · namuna: Maydon
  - Brauzer `localhost:5173/dashboard` (burchakda taymer 5 → 0): Maydon · dashboard · Oxirgi 5 daqiqada: 3 → 4 · Bugun: ochdi 14 → 15 → vaqtni tanladi 9 → 10 → band qildi 3 · har qadamda — turli brauzerlar soni
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-03-done`
- Hammasi bajarilgach: Raqamlar har 5 soniyada o'zi yangilanadi — sahifani yangilash shart emas.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Dashboard raqamlari sahifa yangilanmaguncha o'zgarmayapti. Agentga nima yozasiz?
  - Dashboard'ni boshidan boshqacha qilib yoz
  - Hodisalarni Database'ga tezroq yozadigan qil
  - Dashboard'ni tokensiz ham ochiladigan qil
  - ✔ Raqamlarni har 5 soniyada qayta so'rab tur
- Javob izohlari:
  - To'g'ri: Ish aniq: sayt raqamlarni o'zi qayta so'raydigan bo'ladi.
  - 1-variant: Talab juda keng: qaysi ish o'zgarishi aytilmagan.
  - 2-variant: Hodisa yozilgan — sahifa uni qayta so'ramayapti.
  - 3-variant: Token yangilanishga xalaqit bermaydi — himoya qolsin.
- Umumiy yozuvlar — 4-ekrandagidek.

## 8 · Amaliyot 3 — dashboard internetda, sinfdosh bilan tekshirish
- Eyebrow: Amaliyot 3 · internetda tekshirish
- Sarlavha: Dashboard internetda: sinfdosh kirsa, raqam oshsin.
- Mentor: Uch qatorning hammasi sizdan, namuna «Yordam»da; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. Ochish — ikkala terminal ishlayapti, dashboard raqamlari o'zi yangilanyapti.
  2. Prompt — vazifa: uch qadam ostida oxirgi javob kelgan vaqt chiqsin — «Yangilandi: 18:45:05». Uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi («Siz → Antigravity» · Nusxalash):
       - Qayerda: {qayerda}
       - Nima qilsin: {nima qilsin}
       - Nima buzilmasin: {nima buzilmasin}
     - Yordam (bosilsa ochiladi):
       - Qayerda: `/dashboard` sahifasi, uch qadam ostida.
       - Nima qilsin: Backend'dan oxirgi javob kelgan vaqtni «Yangilandi: 18:45:05» ko'rinishida yozsin; har yangi javobda vaqt yangilansin.
       - Nima buzilmasin: har 5 soniyalik so'rov, parol bilan kirish, `/ega` va o'yinchi sahifasi. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. Ishga tushirish — laptopda «Yangilandi» vaqti har 5 soniyada o'zgaradi.
     Keyin `git add .`, `git commit -m "dashboard"`, `git push` — Render va Netlify kodni GitHub'dan olib, o'zi yangilanadi (bir necha daqiqa).
     - Xato izohi: Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. Internetda tekshirish — Netlify manzilingizga `/dashboard` qo'shib oching (`….netlify.app/dashboard`) va ega paroli bilan kiring (Render'dagi `EGA_PAROLI`).
     Sinfdoshingiz telefonida Netlify manzilingizni ochib, bo'sh katakni bossin: keyingi so'rovdan keyin «Oxirgi 5 daqiqada» oshadi, «Yangilandi» vaqti yangilanadi; sinfdosh saytingizni bugun birinchi marta ochgan bo'lsa — «ochdi» va «vaqtni tanladi» ham oshadi.
     Bepul Backend uxlab qolgan bo'lsa, birinchi javob kechikishi mumkin — taxminan bir daqiqagacha.
     Laptopdagi tekshiruvlaringiz ham shu Database'ga yozilgan — ular ham raqamlarda ko'rinadi. Netlify yoki Render yangilanmasa — tekshiruvni laptopda inkognito oyna bilan qiling, push'ni mentor bilan ko'rasiz.
  5. O'z g'oyangiz — shu promptni o'z MVP'ingiz uchun yozing: egaga dashboard'da yana qaysi bitta qator kerak? Uch qatorni to'ldiring.
     - Forma: Qayerda: … · Nima qilsin: … · Nima buzilmasin: … · Nusxalash
- Yorliq (o'ngda): kutilgan natija · namuna: Maydon
  - Chapda sinfdosh telefoni `maydon-….netlify.app`: Maydon · ‹ Bugun › · 18:00 tanlangan
  - O'ngda brauzer `maydon-….netlify.app/dashboard` (burchakda taymer 5 → 0): Maydon · dashboard · Oxirgi 5 daqiqada: 3 · Bugun: ochdi 14 → vaqtni tanladi 9 → band qildi 3 · har qadamda — turli brauzerlar soni · Yangilandi: 18:45:05 (har javobda +5 soniya)
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-03-done`
- Hammasi bajarilgach: Dashboard internetda ishlayapti: sinfdosh kirsa, raqam keyingi so'rovda oshadi.
  - Izoh: «Yangilandi» — Backend'dan oxirgi javob kelgan vaqt. U so'rov javob olganini aytadi, raqam to'g'riligini emas.
- Blok ostida: Render va Netlify o'zingizniki — o'tgan moduldagi deploy'dan.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 9 · Natijalar (podium) — jonli reyting

## 10 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.
- Karta ostida (birinchi bosishgacha): Kartani bosing — javob ochiladi
- Kartochkalar — «Kartochkalar» bo'limida (12 ta)
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun
- Eyebrow: Yakun
- Belgi: ✓ Loyiha kuni tugadi · N/2 to'g'ri
- Sarlavha: Dashboard jonli: har raqamni tushunib o'qiysiz.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Endi siz bilasiz:
  - Bu darsda dashboard talabida uch qaror bor: nimani sanash, kim ko'rishi, qancha tez-tez yangilanishi.
  - Har qadamda turli brauzerlar sanalsa, qadamlarni bir-biri bilan solishtirsa bo'ladi.
  - «Oxirgi 5 daqiqada» — oxirgi 5 daqiqada hodisa yuborgan turli brauzerlar; ochiq sahifani Backend ko'rmaydi.
  - Sayt raqamlarni har 5 soniyada so'raydi, Backend ularni token bilan beradi.
- Nishonlaringiz — N/3 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Keyingi dars — «Ikki variantdan qaysi biri yaxshiroq ishlaydi?»: tugma matnining ikki variantini solishtirasiz, natijasi shu dashboard'da ko'rinadi.
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Count Right — Har qadamda brauzerlarni to'g'ri sanadingiz (4-ekran, 1-savol)
- Auto Update — To'xtagan yangilanishga aniq talab tanladingiz (7-ekran, 2-savol)
- Live Board — Uch amaliyot blokini oxirigacha bajardingiz (8-ekran, A3 oxirgi «Bajardim»)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Yuqori paneldagi hisoblagich: N/3
- Yakun ekranida: Nishonlaringiz — N/3

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Har qadamda — turli brauzerlar soni»
   - `vaqt-tanladi · 3f2c… ×3` · Uch qator — Bitta brauzer uch marta bosdi.
   - `brauzer_id` · Brauzer ID — Bitta brauzerni ajratadi, odamning ismini bildirmaydi.
   - `vaqtni tanladi 1` · Dashboard — Uch bosish ham bitta brauzer bo'lib sanaladi.
   - Sinfga savol: Nega dashboard bosishlarni emas, brauzerlarni sanaydi?
2. 2-savol (7-ekran) — «Raqamlarni sayt o'zi so'raydi»
   - `setInterval(sora, 5000)` · Taymer — Sayt har 5 soniyada so'rov yuboradi.
   - `GET /hodisalar/sanoq?kun=` · So'rov — Token bilan ketadi, raqamlar qaytadi.
   - `401` · Token eskirdi — So'rov to'xtaydi, parol formasi qaytadi.
   - Sinfga savol: Raqamlar o'zi yangilanmasa, agentga qaysi qatorni yozasiz?

## Jonli viktorina (12 savol)
Lobby: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM — Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!
O'quvchi yozuvlari: Mentor testni boshlashini kuting… (yakkaxon: ▶ Boshlash) · Savol N/12 · Javob qabul qilindi — natijani kuting… · Savol N/12 — natija · Vaqt tugadi — 0 ball. Tezroq bo'ling! · Adashdingiz — 0 ball. Keyingisida olasiz! · Siz hozir: N-o'rin · Test yakunlandi! · (yakkaxon) ball · N/12 to'g'ri · eng uzun streak · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · (jonli dars tugasa) Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish · Arenani yopish

1. Dashboard (holat paneli) nima?
   - ✔ Kerakli raqamlarni bir sahifada ko'rsatadigan sahifa
   - O'yinchi bo'sh vaqtni ko'rib, band qiladigan sahifa
   - Har hodisa bitta qator bo'lib yoziladigan jadval
   - Backend'ni laptopda ishga tushiradigan buyruq
2. Bu darsda «Oxirgi 5 daqiqada» raqami nimani sanaydi?
   - Bugun saytni bir marta bo'lsa ham ochgan brauzerlarni
   - ✔ Oxirgi 5 daqiqada hodisa yuborgan turli brauzerlarni
   - Shu daqiqada sahifasi ochiq turgan hamma odamlarni
   - Bugun maydonda vaqt band qilgan hamma o'yinchilarni
3. Bitta brauzer uch katakni bosdi. «Vaqtni tanladi» nechtaga oshadi?
   - Uchtaga — har bosish bittadan sanaladi
   - Nolga — u hali hech narsa band qilmadi
   - ✔ Bittaga — uch bosish ham bitta brauzer
   - Ikkitaga — birinchi bosish sanalmaydi
4. Nega dashboard har qadamda turli brauzerlarni sanaydi?
   - Shunda raqamlar kattaroq va ishonchli ko'rinadi
   - Shunda Backend so'rovga tezroq javob beradi
   - Shunda Database'da kamroq joy egallanadi
   - ✔ Shunda qadamlar bir o'lchovda solishtiriladi
5. Dashboard raqamlarni qanday yangilaydi?
   - ✔ Sayt har 5 soniyada Backend'dan so'raydi
   - Ega har safar F5 tugmasini bosib turadi
   - Database raqamlarni sahifaga o'zi yuboradi
   - Umami raqamlarni dashboard'ga ko'chirib beradi
6. `GET /hodisalar/sanoq` ga tokensiz so'rov kelsa-chi?
   - Bugungi raqamlarni to'liq qaytarib beradi
   - ✔ 401 qaytaradi va raqamlarni bermaydi
   - «Oxirgi 5 daqiqada» raqamini qaytaradi, xolos
   - Parol so'raydigan sahifani o'zi ochadi
7. Sinfdosh saytni yopdi. Backend uni qachondan sanamaydi?
   - Sahifani yopgan soniyaning o'zidayoq
   - Ertaga, yangi kun boshlanganda
   - ✔ Oxirgi hodisasidan 5 daqiqa o'tgach
   - Ega dashboard'ni yangilagan paytda
8. Ega dashboard'ni ochdi. «Oxirgi 5 daqiqada» oshadimi?
   - Ha — har ochilgan sahifa sanaladi
   - Ha — ega ham saytga kirgan odam
   - Yo'q — ega paroli sanoqni to'xtatadi
   - ✔ Yo'q — dashboard hodisa yozmaydi
9. Brauzer ID nimani bildiradi?
   - ✔ Bitta brauzerni, odamning ismini emas
   - O'yinchining ismi va telefon raqamini
   - Saytga kirgan odamning yoshi va shahrini
   - Ega paroli bilan berilgan tokenni
10. Dashboard'dagi «Yangilandi» vaqti har 5 soniyada o'zgaryapti. Bu nimani bildiradi?
    - Saytga har 5 soniyada yangi o'yinchi kiryapti
    - ✔ Backend har so'rovga javob berib turibdi
    - Token eskirdi, parolni yana kiritish kerak
    - Raqamlar har yangilanishda bittaga oshyapti
11. Vaqtni tanladi 9, band qildi 3. Necha foizi band qildi?
    - Taxminan 3 foizi
    - Taxminan 6 foizi
    - ✔ Taxminan 33 foizi
    - Taxminan 300 foizi
12. Agent «Tayyor» dedi. Sanoq to'g'riligini qanday tekshirasiz?
    - Agentdan «to'g'rimi?» deb yana bir so'raysiz
    - Raqamlar katta chiqsa, to'g'ri deb olasiz
    - Kodni o'qimasdan keyingi talabga o'tasiz
    - ✔ Inkognito oynada bosib, raqamni kuzatasiz

## Kartochkalar
Oyna: Takrorlash — kartochkalar. Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N. Tugmalar: ✗ Takrorlash · ✓ Bildim.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Dashboard (holat paneli) nima? | Kerakli raqamlarni bir sahifada ko'rsatadigan sahifa | «Maydon» da — `/dashboard`, egaga parol bilan |
| «Oxirgi 5 daqiqada» raqami bu dashboard'da nimani sanaydi? | Oxirgi 5 daqiqada hodisa yuborgan turli brauzerlarni | Ochiq sahifani Backend ko'rmaydi — kelgan hodisani ko'radi |
| Saytni ochib, 6 daqiqa hech narsa bosmagan odam «Oxirgi 5 daqiqada» sanog'ida bormi? | Yo'q | U 5 daqiqa ichida hodisa yubormagan |
| Bitta brauzer uch katakni bossa, «vaqtni tanladi» nechtaga oshadi? | Bittaga | Har qadamda turli brauzerlar soni |
| Nega bosishlar emas, turli brauzerlar sanaladi? | Qadamlarni solishtirish uchun | Bosishlar sanalsa, keyingi qadam oldingisidan ko'p chiqishi mumkin |
| Telefon va laptopdan kirgan bitta o'yinchi nechta brauzer? | Ikkita | Brauzer ID odamni emas, brauzerni ajratadi |
| Dashboard raqamlari qanday yangilanadi? | Sayt har 5 soniyada Backend'dan so'raydi | Botdagi polling kabi: qayta-qayta so'rash |
| Nega har soniyada emas, 5 soniyada so'raladi? | Bu MVP'da 5 soniya tanlandi | Raqam tez yangilanadi, Backend'ga esa har soniyada so'rov ketmaydi |
| Backend sahifaga o'zi yuboradigan usul bormi? | Bor, lekin bu dashboard'da ishlatilmadi | Har 5 soniyalik so'rov — sodda yo'l |
| `GET /hodisalar/sanoq` tokensiz nima qaytaradi? | 401 | Himoya `GET /bandlar` dagi bilan bir xil |
| Token eskirsa, dashboard nima qiladi? | So'rovni to'xtatib, parol so'raydi | Ega tokeni 12 soat amal qiladi |
| Tekshiruvda inkognito oyna nima uchun kerak bo'ldi? | Saytga yangi brauzer bo'lib kirish uchun | Unda brauzer ID yangi — raqamlar bittaga oshadi |

- Hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash

## Yakun
- Dars 11-ekran bilan tugaydi (uyga vazifa kartasi yo'q — loyiha kuni, ish repo'da).
- Keyingi dars — «Ikki variantdan qaysi biri yaxshiroq ishlaydi?»: tugma matnining ikki variantini solishtirasiz, natijasi shu dashboard'da ko'rinadi.
