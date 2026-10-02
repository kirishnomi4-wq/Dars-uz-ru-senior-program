# 6-Modul (LMS: 8-Modul) · 1-dars «Komponentlardan tizim» — reja va ekranma-ekran so'zlar

Fayl: `src/6-Modull/SystemArchitectureLesson.jsx` · 19 ekran · faqat o'zbekcha matn (ruschasi keyin, o'zbekcha tasdiqlangach)
Ekran raqami = darsdagi tartib (0 dan). `[qator]` = fayldagi joy, tuzatishda kerak bo'ladi.
Fidbek yozish: har qator yoniga yoki ekran oxiriga `>> ...` deb yozing.

---

## Darsning ipi
- **Hook (0-ekran):** oddiy onlayn xarid sayti (Telefon 2 500 000 · Quloqchin 300 000 · «Savatga» tugmasi) ko'rsatiladi; o'quvchi «▶ Ortida nima bor?» ni bosib «pardani ko'taradi» — 5 ta idora chiqadi, keyin «Sayt aslida nima?» savoliga javob tanlaydi (har qanday javob qabul qilinadi).
- **Markaziy mexanika:** «arizaning sayohati» — tugma bosilganda ariza Foydalanuvchi → Peshtoq → Hokimlik → Arxiv → Ekranda natija bo'ylab qadam-baqadam yuradi (3-ekran), oxirida o'quvchi shu oqimni sudrab tartiblaydi (15-ekran). Oraliqda: bosib-ochiladigan kartalar, «sahifani yangilash» tajribasi, «binoni o'chir» tajribasi.
- **Asosiy metafora:** mahsulot = idoralar shahri: Peshtoq (Frontend) · Hokimlik (Backend) · Arxiv (Database) · Ekspert-byuro (AI) · Ikkinchi darvoza (Bot); yo'llar = API; «ko'p darvoza — bitta shahar».
- **Yakun:** 5 xulosa, uyga vazifa (o'z loyihasi arxitekturasini chizish), keyingi dars — arxitektura patternlari (MVC, mikroservis).

## Dars rejasi (oqim)

| # | Ekran | Turi | Nima qiladi o'quvchi | Ball |
|---|---|---|---|---|
| 0 | Kirish — sayt ortida nima bor | hook | pardani ko'taradi, «Sayt aslida nima?» ni tanlaydi | — |
| 1 | Reja | qoida | yakuniy chizma + bugungi 4 qadam | — |
| 2 | 5 idora | tushuncha | 5 idora tugmasini bosib o'qiydi | — |
| 3 | Arizaning sayohati | tushuncha (animatsiya) | arizani idoradan idoraga yuboradi (5 qadam) | — |
| 4 | 1-savol | test | ma'lumot qayerda doimiy saqlanadi | ✅ |
| 5 | Peshtoq ↔ Hokimlik | tushuncha | ikki qismni bosib «qiladi / qilmaydi»ni o'qiydi | — |
| 6 | Arxiv — xotira | tajriba | sahifani yangilaydi, arxivli/arxivsiz holatni solishtiradi | — |
| 7 | Ekspert-byuro + darvoza | tushuncha | AI va Bot kartasini ochadi | — |
| 8 | 2-savol | test | «Savatga» bosilganda ariza yo'li | ✅ |
| 9 | Binoni o'chir | tajriba | Arxiv / Hokimlik / Peshtoqni o'chirib oqibatini ko'radi | — |
| 10 | Ko'p darvoza | tushuncha | Web / Telegram bot / Mobil darvozani ochadi | — |
| 11 | 3-savol | test | web va bot bir xil buyurtmani qanday ko'radi | ✅ |
| 12 | To'liq shahar | case | 6 qadamli buyurtma voqeasini ochadi | — |
| 13 | Chizma | amaliyot (namuna) | arxitektura.txt chizmasini ko'radi, «nega muhim» ni ochadi | — |
| 14 | 4-savol | test | mobil ilovani eng kam ish bilan qo'shish | ✅ |
| 15 | Oqimni yig'ing | yakuniy | 5 bo'lakni sudrab tartiblaydi | ✅ (final) |
| 16 | Natijalar | podium | jonli reyting | — |
| 17 | Takrorlash | kartochkalar | 12 ta kartochka | — |
| 18 | Yakun | xulosa | 5 xulosa + uyga vazifa + arena | — |

Qo'shimcha: jonli viktorina (arena) — 12 savol; «Qisqa takrorlash» oynalari — 5 ta; nishonlar — 4 ta. Amaliyot (praktika) ekrani bu darsda YO'Q.

**Dars bo'yi takrorlanadigan asosiy so'zlar (metafora-lug'at):**
shahar · idora · Peshtoq (Frontend) · Hokimlik (Backend) · Arxiv (Database) · Ekspert-byuro (AI) · Ikkinchi darvoza (Bot) ·
darvoza (frontend/kirish) · ariza (request) · javob (response) · yo'l (API) · oqim · fuqaro / mijoz / foydalanuvchi ·
reyestr · bino · chizma (arxitektura) · bosh me'mor · markaz (Hokimlik+Arxiv)

---

## 0 · Kirish — sayt ortida nima bor  `[731]`
- Eyebrow: Modul · kirish
- Sarlavha: **Bitta oddiy onlayn xarid sayti ortida nechta «idora» ishlayapti?**
- Mentor: Foydalanuvchi faqat chiroyli peshtoqni ko'radi. Lekin ortida butun bir shahar — bir nechta idora birga ishlaydi. Tugmani bosing — pardani ko'taramiz.
- Sayt-maket: 📱 Telefon — 2 500 000 · 🎧 Quloqchin — 300 000 · tugma «Savatga»
- Tugma: ▶ Ortida nima bor? → ✓ Parda ko'tarildi
- Bosilgandan keyin: ⬇️ ortida: 5 ta idora · yorliqlar: Frontend · Backend · Database · AI · Bot
- Savol: **Sayt aslida nima?** (parda ko'tarilmaguncha xira)
  - Bitta narsa — shunchaki «sayt»
  - Bir nechta idora bir shahar bo'lib ishlaydi — tizim
  - Faqat dizayn va rasmlar
- Javobdan keyin (qaysi variant bo'lsa ham): Aynan! Har bir mahsulot — bu **idoralar shahri**: Peshtoq (Frontend), Hokimlik (Backend), Arxiv (Database), Ekspert-byuro (AI) va Ikkinchi darvoza (Bot). Bugun ularni va orasidagi yo'llarni ko'ramiz va chizamiz.
- Tugma: Davom etish

## 1 · Reja  `[777]`
- Eyebrow: Reja
- Sarlavha: **Bo'laklarni yaxlit shahar sifatida ko'ramiz.**
- Mentor: Modul bo'ylab har bir idorani alohida o'rgandingiz: React, Node, PostgreSQL, AI, bot. Bugun ularni **birga ulab**, bitta shahar sifatida ko'rasiz va chizasiz. Bu — arxitektura fikrlash.
- Blok: dars oxirida — siz shu chizmani yig'asiz → Foydalanuvchi · Peshtoq · Hokimlik · Arxiv · Ekranda natija
  - Bu — har qanday real mahsulotning skeleti. Modul bo'ylab qurgan qismlaringiz shu shahar chizmasida birlashadi.
- Bugungi 4 qadam:
  1. Shaharning 5 idorasi — har biri nima qiladi · *idoralar*
  2. Ariza qanday oqadi (Peshtoq→Hokimlik→Arxiv) · *oqim*
  3. Ko'p darvoza, bitta shahar (web, bot, mobil) · *darvoza*
  4. O'z mahsulotingiz arxitekturasini chizish · *chizma*
- Tugmalar (mobilda): 4 qadamni ko'rish / ↩ Chizmani ko'rish · Boshlaymiz →

## 2 · 5 idora  `[815]`
- Eyebrow: Tushuncha · idoralar
- Sarlavha: **Mahsulot — bu shahardagi 5 idora kabi.**
- Mentor: Kichik shaharni tasavvur qiling: peshtoq, hokimlik, arxiv, ekspert-byuro va ikkinchi darvoza. Mahsulot ham xuddi shunday — har idora o'z ishini qiladi. Har birini bosing.
- Tugmalar → ochiladigan karta (nom · texnologiya · rol):
  - **Frontend** · Peshtoq · React — Shahar PESHTOG'I / qabulxonasi — mijoz ko'radigan yuz. Sahifa, tugma, savat. Ma'lumotni ko'rsatadi, lekin o'zi saqlamaydi.
  - **Backend** · Hokimlik · Node — HOKIMLIK / boshqaruv markazi. Arizalarni qabul qiladi, mantiqni bajaradi, arxiv bilan gaplashadi. Peshtoq ortidagi boshqaruvchi.
  - **Database** · Arxiv · PostgreSQL — Davlat ARXIVI / reyestr. Mahsulot, buyurtma, foydalanuvchilar doimiy saqlanadi. Server o'chsa ham qoladi.
  - **AI** · Ekspert-byuro · Claude — Aqlli EKSPERT-BYURO. Tavsiya beradi, savolga javob yozadi. Hokimlik uni chaqiradi.
  - **Bot** · Ikkinchi darvoza · Telegram — Ikkinchi DARVOZA. Telegram orqali ariza. O'sha Hokimlik va Arxivga ulanadi.
- Xulosa (5/5 dan keyin): 5 idora, bitta shahar. Hech biri yolg'iz ishlamaydi — ular **birga** mahsulotni tashkil qiladi. Endi ular qanday gaplashishini (yo'llarni) ko'ramiz.
- Tugma: 5 idorani oching (N/5) → Davom etish

## 3 · Arizaning sayohati  `[847]`
- Eyebrow: Animatsiya · arizaning sayohati
- Sarlavha: **Tugma bosilganda ariza shu yo'l bilan sayohat qiladi.**
- Mentor: Fuqaro «Savatga» tugmasini bosdi — keyin nima bo'ladi? Tugmani bosib, arizaning idoradan-idoraga sayohatini kuzating. Har idora o'z ishini qiladi.
- Yo'l: Foydalanuvchi · Peshtoq · Hokimlik · Arxiv · Ekranda natija
- Qadam matnlari (har bosishda bittasi):
  1. Foydalanuvchi — Fuqaro «Savatga» tugmasini bosdi.
  2. Peshtoq — Peshtoq (Frontend) arizani Hokimlikka jo'natdi.
  3. Hokimlik — Hokimlik (Backend) arizani qabul qildi va qaror qildi.
  4. Arxiv — Arxiv (Database) buyurtmani yozdi (PostgreSQL).
  5. Ekranda natija — Javob Peshtoqqa qaytdi — ekran yangilandi ✅
- Tugma: ▶ Arizani yuborish → Keyingi idora → → ✓ Sayohat tugadi
- Xulosa: To'liq sayohat: **Foydalanuvchi → Peshtoq → Hokimlik → Arxiv → ekran**. Har idora zanjirning bitta halqasi. Bittasi ishlamasa — zanjir uziladi.
- Tugma: Sayohatni kuzating (N/5) → Davom etish

## 4 · 1-savol ✅  `[883]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Mahsulot, buyurtma va foydalanuvchilar qayerda doimiy saqlanadi?**
  - Frontend (Peshtoq) — chunki mijoz uni ko'radi
  - Backend (Hokimlik) — chunki u markaz
  - AI (Ekspert-byuro) — chunki u aqlli
  - ✔ Database (Arxiv) — chunki server o'chsa ham qoladi
- To'g'ri: To'g'ri! Doimiy ma'lumot Arxivda (Database, PostgreSQL) saqlanadi. Peshtoq faqat ko'rsatadi, Hokimlik qaror qiladi va arxivga yozadi, lekin saqlash — arxivning ishi.
- Xato izohlari:
  - Peshtoq faqat ko'rsatadi — yangilansa hammasi yo'qoladi. Saqlash arxivning ishi.
  - Hokimlik qaror qiladi va arxivga yozishni boshqaradi, lekin o'zi doimiy saqlamaydi — Arxiv saqlaydi.
  - Ekspert-byuro maslahat beradi, ma'lumotni saqlamaydi. Doimiy saqlash — Arxivning ishi.
  - (umumiy) Doimiy ma'lumot Arxivda (Database, PostgreSQL).
- Test ekranlarining umumiy yozuvlari: Javob tanlang · ⚡ Jonli dars — bitta urinish, o'ylab bosing! · 📨 Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: · Qaytadan urinib ko'ring · To'g'ri javobni toping · 📖 Qisqa takrorlash — mavzuni yana bir ko'rish · Davom etish

## 5 · Peshtoq ↔ Hokimlik  `[903]`
- Eyebrow: Chegara · peshtoq ↔ hokimlik
- Sarlavha: **Eng muhim chegara: peshtoq va hokimlik.**
- Mentor: Boshlovchilar ko'p adashadi: Peshtoq (Frontend) **ko'rsatadi**, Hokimlik (Backend) **qaror qiladi**. Peshtoq mahsulotni chiroyli qiladi; hokimlik hisoblaydi va arxivga yozadi. Har birini bosing.
- Kartalar (… — qiladi / 🚫 Qilmaydi:):
  - **Frontend (Peshtoq)** — Ko'rsatadi: sahifa, tugma, savat. Fuqaro bilan to'g'ridan-to'g'ri gaplashadi. / 🚫 Ma'lumotni saqlamaydi, muhim qarorlarni qilmaydi.
  - **Backend (Hokimlik)** — Qaror qiladi: narxni hisoblaydi, arizani tekshiradi, arxivga yozadi. / 🚫 Fuqaroga ko'rinmaydi — sahna ortida ishlaydi.
- Xulosa: Qoida: ko'rinadigan narsa — Peshtoq (Frontend); qaror va saqlash — Hokimlik (Backend). Ular API (yo'llar) orqali gaplashadi.
- Tugma: Ikkalasini oching (N/2) → Davom etish

## 6 · Arxiv — xotira  `[942]`
- Eyebrow: Idora · Arxiv
- Sarlavha: **Arxiv — shaharning xotirasi. U bo'lmasa, hech narsa eslanmaydi.**
- Mentor: Tasavvur qiling: yozuv arxivga tushmasa, sahifani yangilaganda yo'qoladi. Tugmani bosib, arxiv bor va yo'q holatni solishtiring.
- Ikki quti:
  - ❌ Arxivsiz (faqat Peshtoq) — 🛒 Savat: Telefon, Quloqchin → (yangilangach) 💨 Savat bo'sh — yangilashda hammasi yo'qoldi!
  - ✅ Arxiv bilan (PostgreSQL) — 🛒 Savat: Telefon, Quloqchin — yangilashdan keyin ham joyida
- Tugma: 🔄 Sahifani yangilash → ✓ Yangilandi
- Natija: Ko'rdingizmi? Arxivga yozilgan ma'lumot qoladi, faqat ekrandagi (peshtoq) — yo'qoladi. Shuning uchun muhim narsa **doim arxivga** yoziladi.
- Qo'shimcha: Arxiv (Database) = doimiy reyestr. Peshtoq (Frontend) = vaqtinchalik ko'rinish. Hokimlik ikkisi orasida ma'lumotni tashiydi.
- Tugma: Sahifani yangilang → Davom etish

## 7 · Ekspert-byuro + ikkinchi darvoza  `[979]`
- Eyebrow: Idora · Ekspert-byuro + Darvoza
- Sarlavha: **Ekspert-byuro va ikkinchi darvoza — shaharga ulanadigan qo'shimcha idoralar.**
- Mentor: Asosiy uchlik (Peshtoq+Hokimlik+Arxiv) ustiga AI va Bot qo'shiladi. Muhimi: ikkalasi ham **o'sha Hokimlikka** ulanadi — alohida shahar emas. Har birini bosing.
- Kartalar:
  - **AI (Ekspert-byuro)** — Aqlli maslahatchi: «Telefonga g'ilof ham olasizmi?», qidiruvga javob. Hokimlik AI'ni chaqiradi.
  - **Bot (Ikkinchi darvoza)** — Qo'shimcha darvoza: fuqaro Telegram'da ham ariza beradi. Bot o'sha Hokimlik va Arxivga ulanadi.
- Xulosa: AI va Bot — «qo'shimcha». Ularsiz ham shahar ishlaydi; ular tajribani boyitadi. Ikkalasi ham markaziy Hokimlikka ulanadi.
- Tugma: Ikkalasini oching (N/2) → Davom etish

## 8 · 2-savol ✅  `[1015]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Mijoz «Savatga» bosdi. Ariza qaysi yo'l bilan boradi?**
  - ✔ Peshtoq → Hokimlik → Arxiv, javob orqaga qaytadi
  - To'g'ridan-to'g'ri Arxivga, Hokimliksiz
  - Faqat Peshtoq ichida qoladi, chiqmaydi
  - Arxiv → Hokimlik → Peshtoq (teskari)
- To'g'ri: To'g'ri! Ariza fuqarodan Peshtoq orqali Hokimlikka, undan Arxivga boradi; natija esa teskari yo'l bilan ekranga qaytadi. Peshtoq arxivga to'g'ridan ulanmaydi — har doim Hokimlik orqali.
- Xato izohlari:
  - Peshtoq xavfsizlik uchun arxivga to'g'ridan ulanmaydi — har doim Hokimlik orqali o'tadi.
  - Agar Peshtoq ichida qolsa, hech narsa saqlanmaydi. Ariza Hokimlik va Arxivga borishi kerak.
  - Yo'nalish teskari: avval Peshtoq ariza yuboradi, keyin Hokimlik va Arxiv. Javob esa orqaga qaytadi.
  - (umumiy) Peshtoq → Hokimlik → Arxiv, javob orqaga qaytadi.

## 9 · Binoni o'chir (tajriba)  `[1035]`
- Eyebrow: Tajriba · binoni o'chir
- Sarlavha: **Bitta binoni o'chirsangiz — nima buziladi?**
- Mentor: Har idora nega kerakligini bilishning eng yaxshi yo'li — uni olib tashlab ko'rish. Har bir binoni bosing va shahar qanday «to'xtashini» ko'ring.
- Sxema: Frontend · Backend · Database (o'chirilgani ❌)
- Tugmalar → oqibat («… o'chirildi»):
  - **Arxiv o'chir** — Ma'lumot hech qayerda saqlanmaydi — sahifa yangilansa savat va buyurtmalar yo'qoladi (yozuv arxivga tushmagan).
  - **Hokimlik o'chir** — Peshtoq ma'lumot ololmaydi — hech narsa ishlamaydi. Boshqaruv markazi yo'q.
  - **Peshtoq o'chir** — Fuqaro hech narsa ko'rmaydi — kirish nuqtasi yo'q. Hokimlik ishlaydi, lekin darvoza yopiq.
- Xulosa: Har bir asosiy idora kerak: Peshtoq ko'rsatadi, Hokimlik boshqaradi, Arxiv eslaydi. Bittasi yo'qolsa — shahar ishlamaydi.
- Tugma: 3 binoni sinab ko'ring (N/3) → Davom etish

## 10 · Ko'p darvoza  `[1070]`
- Eyebrow: Shahar · ko'p darvoza
- Sarlavha: **Bitta hokimlik + arxiv, lekin ko'p darvoza.**
- Mentor: Bu juda muhim g'oya: fuqaro shaharga turli darvozalardan kirishi mumkin — web, bot yoki mobil ilova. Lekin hammasi **bitta Hokimlik va Arxivga** ulanadi. Har darvozani bosing.
- Xarita: Web sayt · Telegram bot · Mobil ilova → ⚙️ Hokimlik · 🗄️ Arxiv
- Kartalar:
  - **Web sayt** — Peshtoq (React) — brauzerda ochiladi.
  - **Telegram bot** — Ikkinchi darvoza — chat orqali ariza beriladi.
  - **Mobil ilova** — React Native — telefonda. Buni keyingi modulda quramiz!
- Xulosa: Hokimlik va arxivni bir marta qurasiz; keyin har xil darvoza (web, bot, mobil) ulayversiz. Mobil ilovani keyingi modulda qo'shamiz!
- Tugma: 3 darvozani oching (N/3) → Davom etish

## 11 · 3-savol ✅  `[1109]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Web-sayt va bot bir xil buyurtmalarni ko'rishi uchun nima qilinadi?**
  - Har biriga alohida arxiv quriladi
  - Ma'lumot har biriga qo'lda nusxalanadi
  - ✔ Ikkalasi bitta Hokimlik va Arxivga ulanadi
  - Buni qilib bo'lmaydi — ular alohida
- To'g'ri: To'g'ri! Web va bot — ikki xil darvoza (frontend), lekin ikkalasi bitta Hokimlik va Arxivga ulanadi. Shuning uchun bir joyda berilgan buyurtma boshqasida ham ko'rinadi. Mobil ilova ham xuddi shunday ulanadi.
- Xato izohlari:
  - Alohida arxiv bo'lsa, ma'lumot bo'linib ketadi. To'g'risi — bitta umumiy Hokimlik+Arxiv.
  - Qo'lda nusxalash xato va imkonsiz. Bitta umumiy arxivga ulansa, avtomatik bir xil bo'ladi.
  - Aksincha — bu juda oson: bitta Hokimlik+Arxivga ikkala darvozani ulaysiz.
  - (umumiy) Bitta Hokimlik+Arxivga ulanadi — bitta shahar, ko'p darvoza.

## 12 · To'liq shahar (case)  `[1129]`
- Eyebrow: Hayotiy · to'liq shahar
- Sarlavha: **Bitta buyurtma — butun shahar birga ishlaydi.**
- Mentor: Mana hammasi birga: web va bot orqali kelgan arizalar bitta arxivda uchrashadi, ekspert-byuro tavsiya beradi. Tugmani bosib, shaharning ishlashini bosqichma-bosqich kuzating.
- Qadamlar (qadam 1…6):
  1. Web mijoz «Telefon»ni savatga qo'shdi → Peshtoq arizani Hokimlikka yubordi.
  2. Hokimlik arizani qabul qildi va Arxivga buyurtmani yozdi 🗄️✅
  3. Boshqa mijoz Telegram DARVOZA orqali «Telefon buyuraman» dedi.
  4. Bot ham O'SHA Hokimlikka ulandi → O'SHA Arxivga yozildi 🗄️✅
  5. Ekspert-byuro (AI) ikkala mijozga ham «G'ilof ham olasizmi?» deb tavsiya berdi.
  6. Bitta shahar, ikki darvoza — barchasi bitta Hokimlik+Arxivda birlashdi.
- Yon karta: 🗺️ Shahar xaritasi — 🖥️ Web · 🤖 Bot → ⚙️ Hokimlik · 🗄️ Arxiv
- Tugma: ▶ Buyurtmani boshlash → Keyingi qadam → → ✓ Shahar ishladi
- Xulosa: Ikki mijoz, ikki darvoza, bitta arxiv. Mana shuni siz yakuniy loyihada (capstone) to'liq quramiz.
- Tugma: Shaharni kuzating (N/6) → Davom etish

## 13 · Shahar chizmasi  `[1175]`
- Eyebrow: Amalda · chizma
- Sarlavha: **Kod yozishdan oldin — shahar chizmasini chizing.**
- Mentor: Tajribali dasturchi avval qog'ozda yoki AI bilan tizim chizmasini chizadi: qaysi idoralar, qanday yo'llar bilan ulanadi. Bu — bosh me'mor ishi. Tugmani bosing.
- Chizma (fayl `arxitektura.txt`):
  ```
  // mini-shahar tizimi
  Foydalanuvchi
     ↓
  Peshtoq (Frontend · React)
     ↓ ↑  yo'l (API)
  Hokimlik (Backend · Nest) ── Ekspert-byuro
     ↓ ↑
  Arxiv (Database · PostgreSQL)
  ```
- Tugma: Nega chizma muhim? → ✓ Tushundim
- Ochilgach:
  - 🗺️ **Aniqlik:** qaysi idora nima qilishini oldindan bilasiz
  - 🤝 **Muloqot:** jamoaga/AI'ga tizimni tushuntira olasiz
  - 🐞 **Xato:** muammo qaysi idorada — tezroq topasiz
- 📍 KEYINGI DARS: Bu chizmaning «nomi» bor — **arxitektura patterni** (MVC, mikroservis). Keyingi darsda o'shani o'rganamiz.
- Tugma (pastki): Nega chizamiz? → Davom etish

## 14 · 4-savol ✅  `[1216]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Web-shahringizga mobil ilova qo'shmoqchisiz. Eng kam ish bilan qanday?**
  - Hammasini noldan: yangi Peshtoq, Hokimlik va Arxiv
  - Mobil uchun alohida arxiv quraman
  - Buni qilib bo'lmaydi — mobil butunlay boshqa
  - ✔ Faqat yangi mobil Peshtoq yozib, mavjud markazga ulayman
- To'g'ri: To'g'ri! Hokimlik va Arxiv tayyor — ular har qanday darvoza bilan ishlaydi. Mobil ilova faqat yana bir Peshtoq (React Native), o'sha Hokimlikka ulanadi. Shuning uchun arxitekturani tushunish ish hajmini keskin kamaytiradi.
- Xato izohlari:
  - Hokimlik va Arxivni qayta yozish keraksiz — ular tayyor. Faqat yangi Peshtoq qo'shasiz.
  - Alohida arxiv ma'lumotni bo'lib yuboradi. Mobil o'sha umumiy arxivga ulanishi kerak.
  - Aksincha — mobil ham shunchaki yana bir Peshtoq (frontend). Keyingi modulda aynan shuni qilamiz.
  - (umumiy) Faqat yangi Peshtoq yozib, mavjud Hokimlik+Arxivga ulaysiz.

## 15 · Oqimni yig'ing ✅ (final)  `[1236]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: ma'lumot oqimini to'g'ri tartibda yig'ing.**
- Mentor: Fuqaro tugma bosganda ma'lumot qayerdan-qayerga boradi? Tartibni eslang: foydalanuvchi → peshtoq → hokimlik → arxiv → ekranda natija. Bo'laklarni to'g'ri slotlarga joylang.
- Bo'laklar: Foydalanuvchi · Peshtoq · Hokimlik · Arxiv · Ekranda natija
- Uyacha izohlari: arizani beradi · mijozga ko'rsatadi · qaror qiladi · doimiy saqlaydi · ekranga qaytadi · «bu yerga joylang»
- Xato: ⚠️ Tartib xato — qayta joylang. · Tartib xato — bo'lakni bosib qaytaring va qayta joylang
- To'g'ri: To'g'ri tartib! · To'g'ri oqim: Foydalanuvchi → Peshtoq → Hokimlik → Arxiv → ekranda natija!
- Xulosa: ✓ Oqim tayyor: **Foydalanuvchi → Peshtoq → Hokimlik → Arxiv → ekran**. Mana real mahsulotning ma'lumot yo'li.
- Havola: 📖 Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: Oqimni yig'ing → Davom etish

## 16 · Natijalar (podium)  `[1805]`
- Sarlavha: **Kim g'olib?** · Natijalar
- Siz mustaqil rejimdasiz. Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.
- Natijalar yuklanmoqda… · Bu sessiyaga hali hech kim qo'shilmagan. · Siz · -o'rin · to'g'ri · 🏆 To'liq reyting

## 17 · Takrorlash (kartochkalar)  `[2073]`
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Foydalanuvchi ko'radigan qism qanday ataladi? | Frontend | Peshtoq — sahifa, tugmalar, rasmlar |
| Qaror qiladigan va mantiqni bajaradigan qism qaysi? | Backend | Hokimlik — arizani qabul qiladi va bajaradi |
| Mahsulot va buyurtmalar qayerda doimiy saqlanadi? | Database | Arxiv — sahifa yangilansa ham yo'qolmaydi |
| Idoralar bir-biri bilan qaysi yo'l orqali gaplashadi? | API | Shahar yo'llari — qismlarni bir-biriga bog'laydi |
| Tugma bosilganda jo'natiladigan xabar nima deyiladi? | Request | Ariza — Peshtoqdan Hokimlikka boradi |
| Arizaga qaytadigan javob nima deyiladi? | Response | Javob o'sha yo'l bilan ekranga qaytadi |
| «Savatga» bosilganda ariza qaysi yo'l bilan boradi? | Peshtoq, Hokimlik, Arxiv | Javob keyin o'sha yo'l bilan orqaga qaytadi |
| Nega Peshtoq Arxivga to'g'ridan ulanmaydi? | Xavfsizlik uchun | Yo'l doim Hokimlik orqali o'tadi |
| AI (Ekspert-byuro) tizimda nima qiladi? | Maslahat beradi | Qarorni baribir Hokimlik qabul qiladi |
| Web sayt va Telegram bot bitta tizim bo'la oladimi? | Ha, bo'ladi | Ko'p darvoza — bitta Hokimlik va bitta Arxiv |
| Tayyor tizimga mobil ilova qanday qo'shiladi? | Yangi frontend yozib | Markazni qaytadan qurish shart emas |
| Ma'lumot oqimi kimdan boshlanadi? | Foydalanuvchidan | U tugmani bosadi, so'ng so'rov yo'lga chiqadi |

- Tugmalar: ✓ Bildim · ✗ Takrorlash · ↻ O'rganilmoqda · Hammasini bilasiz! · atama yodlandi · ↻ Qaytadan takrorlash · Yakunlash →

## 18 · Yakun  `[2086]`
- Eyebrow: Tayyor · belgi: ✓ Tizimni ko'ra boshladingiz
- Sarlavha: **Endi mahsulot siz uchun bitta sayt emas — yaxlit shahar.**
- Arena tugmasi (CodeStrike) · ⏳ Mentorni kuting
- Endi siz bilasiz:
  - Real mahsulot — bu idoralar shahri (komponentlar tizimi), bitta narsa emas
  - 5 idora: Peshtoq (Frontend), Hokimlik (Backend), Arxiv (Database), Ekspert-byuro (AI), Ikkinchi darvoza (Bot)
  - Ma'lumot oqimi: Foydalanuvchi → Peshtoq → Hokimlik → Arxiv → ekran
  - Bitta Hokimlik+Arxiv, ko'p darvoza (web, bot, mobil) — bitta shahar
  - Kod yozishdan oldin arxitekturani (shahar chizmasini) chizish — bosh me'mor ishi
- Uyga vazifa (tugma: Uyga vazifa · Amaliy topshiriqni bajarish →) → 📝 Uyga vazifa:
  - **Chizing** — o'z loyihangiz arxitekturasini chizing: qaysi 5 idora bor?
  - **Oqim** — bitta amal (masalan «buyurtma berish») uchun ariza yo'lini chizib chiqing
  - **Darvoza** — loyihangizga qaysi darvozalar kerak: web? bot? mobil?
- 🚀 Keyingi dars — Arxitektura patternlari: MVC va mikroservis, chizmangizning «nomi».
- 🏅 Nishonlaringiz — N/4 · Qaytadan · Yakunlash ✓
- Uyga vazifa tugmasidagi uchib yuruvchi so'zlar: amaliyot · loyiha · mashq · natija

---

## Qo'shimcha matnlar

**Nishonlar (4, nomi inglizcha):** 🏗️ City Builder — Arxiv — shahar xotirasi ekanini topdingiz · 🛣️ Request Route — Arizaning idoradan idoraga to'g'ri yo'lini bildingiz · 🌐 Shahar Online — Ko'p darvoza, bitta shahar — g'oyani tushundingiz · ⚡ Power Grid — Markazga yangi darvoza (mobil) qo'shdingiz
Nishon yozuvlari: Yangi nishon · bosib davom eting

**Qisqa takrorlash oynalari (5)** (ramka: 📖 Qayta tushuntirish · 🗣️ Sinfga savol: · ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz · Yopish):
1. (4-ekran) Arxiv — doimiy saqlash idorasi: Arxiv eslaydi — Mahsulot, buyurtma va foydalanuvchilar **Davlat arxivida** (Database) doimiy saqlanadi. · Peshtoq faqat ko'rsatadi — Frontend (peshtoq) faqat ko'rsatadi — sahifa yangilansa, ekrandagi ma'lumot yo'qoladi. · Hokimlik tashiydi — Backend qaror qiladi va arxivga yozadi, lekin o'zi doimiy saqlamaydi. · Sinfga savol: Mahsulot va buyurtmalar aslida qayerda saqlanadi?
2. (8-ekran) Arizaning yo'li — bir tomonlama tartib: Ariza peshtoqdan boshlanadi — Mijoz tugma bosadi — Frontend (peshtoq) arizani **Hokimlikka** jo'natadi. · Hokimlik arxivga boradi — Backend arizani qabul qiladi va **Arxivga** (Database) yozadi yoki o'qiydi. · Javob teskari qaytadi — Natija o'sha yo'l bilan orqaga — ekranga qaytadi. Peshtoq arxivga to'g'ridan bormaydi. · Sinfga savol: «Savatga» bosilganda ariza qaysi yo'l bilan boradi?
3. (11-ekran) Ko'p darvoza — bitta shahar: Har darvoza — alohida kirish — Web sayt, Telegram bot va mobil ilova — **uch xil darvoza** (frontend). · Markaz bitta — Hamma darvoza **bitta Hokimlik va Arxivga** ulanadi — bitta tizim. · Ma'lumot umumiy — Bir darvozada berilgan buyurtma boshqasida ham ko'rinadi. · Sinfga savol: Web va bot bir xil buyurtmani qanday ko'radi?
4. (14-ekran) Yangi darvoza qo'shish — kam ish: Markaz tayyor — Backend va Arxiv har qanday darvoza bilan ishlaydi — ularni qayta qurish shart emas. · Mobil — yana bir peshtoq — Mobil ilova shunchaki **yana bir frontend** (React Native), o'sha markazga ulanadi. · Arxitektura — vaqt tejaydi — Tizimni tushunish ish hajmini keskin kamaytiradi. · Sinfga savol: Mavjud tizimga mobil ilovani qanday qo'shasiz?
5. (15-ekran) Ma'lumot oqimi — tartib muhim: Avval — foydalanuvchi — Oqim **foydalanuvchidan** boshlanadi — u tugmani bosadi. · Keyin — markaz va arxiv — So'rov peshtoqdan Hokimlikka, undan Arxivga boradi — **tartib bilan**. · Eng oxiri — ekranda natija — Javob faqat oxirida ekranga qaytadi. (Foydalanuvchi → Peshtoq → Hokimlik → Arxiv → Natija) · Sinfga savol: Nega ma'lumot to'g'ridan arxivga bormaydi?

**Jonli viktorina (12 savol, to'g'risi ✔):**
1. Mahsulot, buyurtma va foydalanuvchilar qayerda doimiy saqlanadi? ✔ Arxivda (Database) · Peshtoqda (Frontend) · Hokimlikda (Backend) · Ekspert-byuroda (AI)
2. Peshtoq (Frontend) asosan nima qiladi? Ma'lumotni doimiy saqlaydi · Muhim qarorlarni qiladi · ✔ Mijozga ma'lumotni ko'rsatadi · Arxivga to'g'ridan yozadi
3. «Savatga» bosilganda ariza qaysi yo'l bilan boradi? To'g'ridan-to'g'ri Arxivga, Hokimliksiz · Faqat Peshtoq ichida qoladi · ✔ Peshtoq → Hokimlik → Arxiv, javob orqaga · Arxiv → Hokimlik → Peshtoq
4. Nega Peshtoq (Frontend) Arxivga to'g'ridan ulanmaydi? Chunki Arxiv juda sekin ishlaydi · ✔ Xavfsizlik uchun — Hokimlik orqali o'tadi · Chunki ular boshqa tilda yozilgan · Buni umuman qilib bo'lmaydi, imkonsiz
5. Hokimlik (Backend) asosiy vazifasi nima? Faqat rasm va dizayn chizadi · Foydalanuvchiga to'g'ridan ko'rinadi · Faqat matnni tarjima qiladi · ✔ Qaror qiladi va arxivga yozadi
6. Web-sayt va Telegram bot bir xil buyurtmalarni qanday ko'radi? ✔ Bitta Hokimlik va Arxivga ulanadi · Har biriga alohida arxiv quriladi · Ma'lumot qo'lda nusxalanadi · Buni umuman qilib bo'lmaydi
7. «Ko'p darvoza, bitta shahar» nimani anglatadi? Har darvozaga alohida shahar kerak · Bitta darvoza hamma uchun yetarli · Faqat web darvoza bo'lishi mumkin · ✔ Web, bot, mobil — bitta markaz
8. Arxiv (Database) o'chirilsa nima bo'ladi? Aslida hech narsa o'zgarmaydi · ✔ Ma'lumot saqlanmaydi, yo'qoladi · Faqat sahifa ranglari o'chadi · Tizim aksincha tezroq ishlaydi
9. Mavjud tizimga mobil ilova qo'shishning eng oson yo'li? Hammasini noldan qayta yozish · ✔ Yangi Peshtoq yozib, markazga ulash · Mobil uchun alohida arxiv qurish · Buni umuman qilib bo'lmaydi
10. AI (Ekspert-byuro) tizimda qanday rol o'ynaydi? Ma'lumotni doimiy saqlaydi · Barcha qarorlarni yakka o'zi qiladi · ✔ Maslahat va tavsiya beradi · Foydalanuvchi bilan to'g'ridan gaplashadi
11. Ma'lumot oqimi qaysi tartibda kechadi? Arxiv → Hokimlik → Peshtoq → ekran → foydalanuvchi · Hokimlik → Arxiv → Peshtoq → foydalanuvchi → ekran · Peshtoq → Arxiv → Hokimlik → foydalanuvchi → ekran · ✔ Foydalanuvchi → Peshtoq → Hokimlik → Arxiv → ekran
12. Kod yozishdan oldin arxitekturani chizish nega foydali? ✔ Qaysi idora nima qilishini aniqlaydi · Kodni o'zi avtomatik yozib beradi · Serverni ancha tezlashtiradi · Dizaynni chiroyli qiladi
Arena yakunidagi yozuvda: «eng uzun streak 🔥x…» (inglizcha so'z).

---

## Mening dastlabki belgilarim (faqat eslatma, tuzatilmagan)
Sizning auditingizga xalal bermasin deb oxiriga qo'ydim; rozi bo'lmaganini o'chirib tashlang.
- **«slot»** — 15-ekran Mentor: «Bo'laklarni to'g'ri slotlarga joylang» · lug'atda taqiqlangan (o'rniga «joyiga»)
- **«skelet»** — 1-ekran: «har qanday real mahsulotning skeleti» · lug'atda karkas ma'nosida taqiqlangan
- **Bir narsaning ikki nomi:** Backend 2-ekranda «Hokimlik · Node», 13-ekran chizmasida «Backend · Nest»; odam 3 xil nomlanadi — «fuqaro» (3, 5, 7, 15), «mijoz» (2, 8, 12), «foydalanuvchi» (0, 3, 15); idora 9-ekranda birdan «bino» bo'lib qoladi
- **Izohsiz inglizcha/qiyin so'z:** «capstone» (12), «patterni» (13, 18), «Request / Response» (17 — dars ichida faqat «ariza/javob» deyilgan), «streak» (arena), «reyestr» (2, 6), «sessiya» (16)
- **To'g'ri javob uzunligidan bilinib qoladi:** 4-savol (14-ekran) — ✔ «Faqat yangi mobil Peshtoq yozib, mavjud markazga ulayman» boshqalaridan sezilarli uzun; 1-savol (4-ekran) ham — ✔ variantdagina aniq sabab bor («server o'chsa ham qoladi»), qolganlari «chunki u markaz / aqlli»
- **Hook javobi:** 0-ekranda uch variantning qaysi biri tanlansa ham «Aynan!» chiqadi — «Faqat dizayn va rasmlar» tanlanganda ham
- **13-ekran:** bitta ekranda uch xil tugma yozuvi — «Nega chizma muhim?», «Nega chizamiz?», «✓ Tushundim»
- **Takror:** «Mobil ilovani keyingi modulda qo'shamiz/quramiz!» 10-ekranda ikki marta (karta + xulosa) ketma-ket
