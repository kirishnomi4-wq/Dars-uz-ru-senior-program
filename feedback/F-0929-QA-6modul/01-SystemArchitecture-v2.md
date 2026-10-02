# 6-Modul (LMS: 8-Modul) · 1-dars «Komponentlardan tizim» — YANGI MATN (v2)

Fayl: `src/6-Modull/SystemArchitectureLesson.jsx` · 19 ekran · faqat o'zbekcha
Eski matn: `01-SystemArchitecture-sozlar.md` (solishtirish uchun). Har ekran ostida `✎` — nima o'zgargani qisqa.
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach, dars shu holatga keltiriladi.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti) — faqat matn.

---

## A. Shu darsdan boshlab qo'llanadigan qoidalar (keyingi 13 dars uchun namuna)

1. **Asosiy nom — texnik atama:** Frontend · Backend · Database · API · so'rov (request) · javob (response).
   Metafora faqat yordamchi: tushuncha birinchi marta chiqqanda bir marta, «…ga o'xshatish mumkin» shaklida. Keyin ishlatilmaydi.
2. **Bir tushuncha — bir nom:** odam = **foydalanuvchi** (umumiy); do'kon misolida xarid qiluvchi = **mijoz** (rol); «fuqaro» — yo'q · Backend texnologiyasi = **Node.js (NestJS)** · «idora/bino» = **qism** ·
   «darvoza» = **kirish yo'li** · «ariza» = **so'rov**.
3. **Qat'iy gap yumshatiladi:** «hech qachon / faqat / har doim» o'rniga «bizning tizimda», «odatda», «doimiy saqlamaydi».
4. **Qiyin so'zlar:** slot → joy · skelet → tuzilma · capstone → «13-dars, Loyiha kuni» · reyestr → yo'q (Database yetadi) ·
   pattern → o'chirilmaydi (3-dars nomi shu), izoh bilan: «sinab ko'rilgan usul» (tayyor kod emas).
5. **Test:** variantlar taxminan bir xil uzunlikda. Har xato variant ham ishonarli sabab bilan yoziladi (faqat to'g'ri javobda sabab bo'lmasin).
6. **Hook:** to'g'ri javobga «Aynan!»; boshqa javoblarga neytral «Qiziq fikr!» — bola uyaltirilmaydi, xato ham «to'g'ri» deyilmaydi.

---

## Darsning ipi
- **Hook:** oddiy onlayn xarid sayti → «Ortida nima bor?» → 5 qism ochiladi → «Sayt aslida nima?».
- **Asosiy model (dars bo'yi bitta):** Foydalanuvchi → Frontend → Backend → Database → ekranda natija.
- **Tajribalar:** so'rov yo'li (3) · sahifani yangilash (6) · qismni o'chirish (9) · ko'p kirish yo'li (10) · yakuniy tartiblash (15).
- **Yakun:** o'z loyihasining chizmasi (uyga vazifa) · keyingi dars — PM: «Bitta gapni uch kishi bir xil tushunadimi?».

---

## 0 · Kirish  `[731]`
- Eyebrow: Modul · kirish
- Sarlavha: **Oddiy onlayn xarid sayti ortida nechta qism ishlayapti?**
- Mentor: Foydalanuvchi faqat sahifani ko'radi: mahsulotlar, narxlar, «Savatga» tugmasi. Lekin uning ortida bir nechta qism birga ishlaydi. Tugmani bosing — sahifa ortini ochamiz.
- Sayt-maket: 📱 Telefon — 2 500 000 · 🎧 Quloqchin — 300 000 · «Savatga»
- Tugma: ▶ Ortida nima bor? → ✓ Ochildi
- Ochilgach: ⬇️ ortida: 5 ta qism · Frontend · Backend · Database · AI · Bot
- Savol: **Sayt aslida nima?**
  - Bitta narsa — shunchaki «sayt»
  - Bir nechta qism birga ishlaydigan tizim
  - Faqat dizayn va rasmlar
- Javob — 2-variant: **Aynan!** Sayt — bu tizim: Frontend, Backend, Database, AI va Bot birga ishlaydi. Bugun har birining vazifasini va ular qanday bog'lanishini ko'ramiz.
- Javob — 1 yoki 3-variant: **Qiziq fikr!** Ekranda haqiqatan bitta sahifa ko'rinadi. Lekin uning ortida 5 ta qism birga ishlaydi: Frontend, Backend, Database, AI va Bot. Bugun har birini ko'ramiz.
- Tugma: Davom etish

✎ «idoralar shahri» o'rniga «qism/tizim» · javob tanlovga qarab ikki xil (oldin hammasiga «Aynan!»)

## 1 · Reja  `[777]`
- Eyebrow: Reja
- Sarlavha: **Qismlarni bitta tizim sifatida ko'ramiz.**
- Mentor: Oldingi modullarda har bir qismni alohida o'rgandingiz: React, Node.js, PostgreSQL, AI va bot. Bugun ularni bir-biriga ulab, bitta tizim sifatida ko'rasiz va chizasiz. Buni arxitektura deyishadi.
- Blok: Dars oxirida shu chizmani o'zingiz yig'asiz → Foydalanuvchi · Frontend · Backend · Database · Ekranda natija
  - Deyarli har bir real ilova shu tuzilmada ishlaydi. Oldingi modullarda qurgan qismlaringiz shu chizmada birlashadi.
- Bugungi 4 qadam:
  1. Tizimning 5 qismi — har biri nima qiladi · *qismlar*
  2. So'rov qanday yuradi (Frontend → Backend → Database) · *yo'l*
  3. Ko'p kirish yo'li, bitta tizim (web, bot, mobil) · *kirish yo'llari*
  4. O'z loyihangiz arxitekturasini chizish · *chizma*
- Tugmalar: 4 qadamni ko'rish / ↩ Chizmani ko'rish · Boshlaymiz →

✎ «Modul bo'ylab o'rgandingiz» → «Oldingi modullarda» (React 3-Modulda, Node 4-Modulda, bot 5-Modulda o'tilgan — bu modulda emas) · «skeleti» → «tuzilmada»

## 2 · 5 qism  `[815]`
- Eyebrow: Tushuncha · 5 qism
- Sarlavha: **Tizimda 5 qism bor: uchtasi asosiy, ikkitasi qo'shimcha.**
- Mentor: Asosiy uchlik — Frontend, Backend va Database. AI va Bot ularga qo'shiladi. Esda qolishi oson bo'lsin deb har bir qismni bitta oddiy narsaga o'xshatamiz. Har birini bosing.
- Kartalar (yuqorida 3 ta asosiy, pastda 2 ta qo'shimcha):
  - **Frontend** · React — Foydalanuvchi ko'radigan qism: sahifa, tugmalar, savat. Ma'lumotni ko'rsatadi va foydalanuvchi bosgan tugmalarni qabul qiladi. *Uni do'konning peshtog'iga o'xshatish mumkin.*
  - **Backend** · Node.js (NestJS) — Tizimning boshqaruv qismi. So'rovlarni qabul qiladi, qoidalar va hisob-kitoblarni bajaradi, Database bilan ishlaydi. *Uni boshqaruv markaziga o'xshatish mumkin.*
  - **Database** · PostgreSQL — Ma'lumotni doimiy saqlaydigan joy: mahsulotlar, buyurtmalar, foydalanuvchilar. Sahifani yangilasangiz ham ma'lumot saqlanib qoladi. *Uni arxivga o'xshatish mumkin.*
  - **AI** · Claude · *qo'shimcha* — Tavsiya beradi, savollarga javob yozadi. Backend uni kerak bo'lganda chaqiradi. *Uni maslahatchiga o'xshatish mumkin.*
  - **Bot** · Telegram · *qo'shimcha* — Tizimga yana bir kirish yo'li. Foydalanuvchi Telegram orqali buyurtma beradi, bot esa o'sha Backend va Database bilan ishlaydi.
- Xulosa (5/5 dan keyin): 5 qism — bitta tizim. Hech biri yolg'iz ishlamaydi. Endi ular bir-biri bilan qanday bog'lanishini ko'ramiz.
- Tugma: 5 qismni oching (N/5) → Davom etish

✎ Texnik nom asosiy, metafora bir marta «o'xshatish mumkin» · 3+2 guruhlash (kichik joylashuv o'zgarishi) · «Server o'chsa ham qoladi» → «Sahifani yangilasangiz ham saqlanib qoladi» · «reyestr» olib tashlandi

## 3 · So'rovning yo'li  `[847]`
- Eyebrow: Animatsiya · so'rovning yo'li
- Sarlavha: **Tugma bosilganda so'rov shu yo'l bilan yuradi.**
- Mentor: Foydalanuvchi «Savatga» tugmasini bosdi. Keyin nima bo'ladi? Tugmani bosib, so'rov bir qismdan ikkinchisiga qanday o'tishini kuzating.
- Yo'l: Foydalanuvchi · Frontend · Backend · Database · Ekranda natija
- Qadamlar:
  1. Foydalanuvchi «Savatga» tugmasini bosdi.
  2. Frontend Backend'ga so'rov (request) yubordi.
  3. Backend so'rovni qabul qildi va tekshirdi.
  4. Database buyurtmani saqladi.
  5. Backend javob (response) qaytardi — ekran yangilandi ✅
- Tugma: ▶ So'rovni yuborish → Keyingi qadam → → ✓ Yo'l tugadi
- Xulosa: To'liq yo'l: **Foydalanuvchi → Frontend → Backend → Database → ekran**. Har bir qism zanjirning bitta halqasi. Bittasi ishlamasa, zanjir uziladi.
- Tugma: Yo'lni kuzating (N/5) → Davom etish

✎ «arizaning sayohati / fuqaro / idora» → «so'rov (request) / foydalanuvchi / qism» · request va response shu yerda birinchi marta nomi bilan beriladi

## 4 · 1-savol ✅  `[883]`
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Mahsulotlar, buyurtmalar va foydalanuvchilar qayerda doimiy saqlanadi?**
  - Frontend'da — foydalanuvchi ularni ko'radi
  - Backend'da — so'rovlar shu yerdan o'tadi
  - AI'da — u hamma savolga javob beradi
  - ✔ Database'da — sahifa yangilansa ham qoladi
- To'g'ri: To'g'ri! Doimiy ma'lumot Database'da (PostgreSQL) saqlanadi. Frontend ma'lumotni ko'rsatadi, Backend uni tekshirib Database'ga yozadi, saqlash esa Database'ning vazifasi.
- Xato izohlari:
  - Frontend ma'lumotni ko'rsatadi, lekin doimiy saqlamaydi: sahifa yangilansa, ekrandagi ma'lumot yo'qolishi mumkin.
  - Backend so'rovni tekshiradi va Database'ga yozadi, lekin ma'lumotni o'zi doimiy saqlamaydi.
  - AI maslahat beradi, lekin ma'lumotni saqlamaydi.
  - (umumiy) Doimiy ma'lumot Database'da (PostgreSQL) saqlanadi.

✎ Har variantda ishonarli sabab — oldin faqat to'g'ri javobda aniq sabab bor edi («chunki u aqlli» kabi bo'sh sabablar olib tashlandi)

## 5 · Frontend ↔ Backend  `[903]`
- Eyebrow: Chegara · Frontend ↔ Backend
- Sarlavha: **Eng muhim chegara: Frontend va Backend.**
- Mentor: Boshida ko'pchilik shu ikkisini adashtiradi. Frontend foydalanuvchiga ko'rsatadi, Backend qoidalarni bajaradi. Har birini bosing.
- Kartalar (Nima qiladi / Nima qilmaydi):
  - **Frontend** — Qiladi: sahifa, tugma va savatni ko'rsatadi, foydalanuvchi bosgan tugmani qabul qiladi. / Qilmaydi: muhim ma'lumotni doimiy saqlamaydi, narx va to'lov qoidalarini hal qilmaydi.
  - **Backend** — Qiladi: narxni hisoblaydi, so'rovni tekshiradi, Database'ga yozadi. / Qilmaydi: foydalanuvchiga ko'rinmaydi — orqa tomonda ishlaydi.
- Xulosa: Qoida: ko'rinadigan qism — Frontend; qoidalar, hisob-kitob va Database bilan ishlash — Backend. Ular **API** orqali bog'lanadi: API — Frontend so'rov yuboradigan va Backend javob qaytaradigan yo'l.
- Tugma: Ikkalasini oching (N/2) → Davom etish

✎ «ma'lumotni saqlamaydi, qaror qilmaydi» → «muhim ma'lumotni doimiy saqlamaydi, narx va to'lov qoidalarini hal qilmaydi» · API birinchi marta izoh bilan

## 6 · Database — xotira  `[942]`
- Eyebrow: Qism · Database
- Sarlavha: **Database — tizimning xotirasi. Usiz hech narsa eslab qolinmaydi.**
- Mentor: Ma'lumot Database'ga yozilmasa, sahifani yangilaganingizda yo'qoladi. Tugmani bosib, ikki holatni solishtiring.
- Ikki quti:
  - ❌ Database'siz (faqat Frontend) — 🛒 Savat: Telefon, Quloqchin → 💨 Savat bo'sh — yangilaganda hammasi yo'qoldi!
  - ✅ Database bilan (PostgreSQL) — 🛒 Savat: Telefon, Quloqchin — yangilangandan keyin ham joyida
- Tugma: 🔄 Sahifani yangilash → ✓ Yangilandi
- Natija: Ko'rdingizmi? Database'ga yozilgan ma'lumot qoladi, faqat ekranda turgani yo'qoladi. Shuning uchun muhim ma'lumot doim Database'ga yoziladi.
- Qo'shimcha: Database — doimiy xotira. Frontend — vaqtinchalik ko'rinish. Backend ma'lumotni ular orasida tashiydi.
- Tugma: Sahifani yangilang → Davom etish

✎ «Arxiv / reyestr / peshtoq» → texnik nomlar (tajriba o'zgarmaydi — auditda eng yaxshi deb topilgan)

## 7 · AI va Bot  `[979]`
- Eyebrow: Qo'shimcha qismlar · AI va Bot
- Sarlavha: **AI va Bot — tizimga qo'shiladigan qismlar.**
- Mentor: Asosiy uchlik (Frontend, Backend, Database) ustiga AI va Bot qo'shiladi. Muhimi: ikkalasi ham o'sha Backend'ga ulanadi — alohida tizim qurilmaydi. Har birini bosing.
- Kartalar:
  - **AI** — Maslahat beradi: «Telefonga g'ilof ham olasizmi?», qidiruvdagi savolga javob yozadi. Backend AI'ni kerak bo'lganda chaqiradi.
  - **Bot** — Yana bir kirish yo'li: foydalanuvchi Telegram orqali ham buyurtma beradi. Bot o'sha Backend va Database bilan ishlaydi.
- Xulosa: AI va Bot — qo'shimcha qismlar. Ularsiz ham tizim ishlaydi, ular esa uni qulayroq qiladi. Ikkalasi ham bitta Backend'ga ulanadi.
- Tugma: Ikkalasini oching (N/2) → Davom etish

✎ «Ekspert-byuro / Ikkinchi darvoza / tajribani boyitadi» → «AI / Bot / qulayroq qiladi»

## 8 · 2-savol ✅  `[1015]`
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Foydalanuvchi «Savatga» bosdi. So'rov qaysi yo'l bilan boradi?**
  - ✔ Frontend → Backend → Database, javob orqaga qaytadi
  - Frontend → Database, Backend'ni chetlab o'tadi
  - Frontend ichida qoladi, hech qayerga chiqmaydi
  - Database → Backend → Frontend, teskari yo'nalishda
- To'g'ri: To'g'ri! So'rov Frontend'dan Backend'ga, undan Database'ga boradi; javob esa shu yo'l bilan ekranga qaytadi. Bizning tizimda Frontend Database bilan to'g'ridan ishlamaydi — hamma so'rov Backend orqali o'tadi.
- Xato izohlari:
  - Bizning tizimda Frontend Database'ga to'g'ridan ulanmaydi: so'rovni Backend tekshiradi, parol va qoidalar ham Backend'da turadi.
  - So'rov Frontend ichida qolsa, hech narsa saqlanmaydi. U Backend va Database'ga borishi kerak.
  - Yo'nalish teskari: avval Frontend so'rov yuboradi, keyin Backend va Database ishlaydi. Javob esa orqaga qaytadi.
  - (umumiy) Frontend → Backend → Database, javob orqaga qaytadi.

✎ «har doim Hokimlik orqali» → «bizning tizimda … Backend orqali» + nega (parol va qoidalar Backend'da)

## 9 · Qismni o'chiring (tajriba)  `[1035]`
- Eyebrow: Tajriba · qismni o'chiring
- Sarlavha: **Bitta qismni o'chirsangiz, nima buziladi?**
- Mentor: Har bir qism nega kerakligini bilishning eng yaxshi yo'li — uni o'chirib ko'rish. Har birini bosing va tizim qanday to'xtashini ko'ring.
- Sxema: Frontend · Backend · Database (o'chirilgani ❌)
- Tugmalar → oqibat:
  - **Database'ni o'chirish** — Ma'lumot hech qayerda saqlanmaydi: sahifa yangilansa, savat va buyurtmalar yo'qoladi.
  - **Backend'ni o'chirish** — Frontend so'rov yuboradi, lekin javob kelmaydi. Sahifa ochiladi, ammo mahsulotlar yuklanmaydi va tugmalar ishlamaydi.
  - **Frontend'ni o'chirish** — Foydalanuvchi hech narsa ko'rmaydi. Backend ishlab turibdi, lekin unga kirish yo'li yo'q.
- Xulosa: Uchala asosiy qism ham kerak: Frontend ko'rsatadi, Backend boshqaradi, Database eslab qoladi. Bittasi yo'qolsa, tizim ishlamaydi.
- Tugma: 3 qismni sinab ko'ring (N/3) → Davom etish

✎ «bino/idora» → «qism» · Backend oqibati aniqlashtirildi (oldin «hech narsa ishlamaydi» — aslida sahifa ochiladi, ma'lumot kelmaydi)

## 10 · Ko'p kirish yo'li  `[1070]`
- Eyebrow: Tizim · ko'p kirish yo'li
- Sarlavha: **Bitta Backend va Database — kirish yo'llari esa ko'p.**
- Mentor: Bu juda muhim g'oya: foydalanuvchi tizimga turli yo'llar bilan kirishi mumkin — web sayt, bot yoki mobil ilova orqali. Lekin hammasi bitta Backend va Database'ga ulanadi. Har birini bosing.
- Xarita: Web sayt · Telegram bot · Mobil ilova → ⚙️ Backend · 🗄️ Database
- Kartalar:
  - **Web sayt** — Frontend (React), brauzerda ochiladi.
  - **Telegram bot** — chat orqali buyurtma beriladi.
  - **Mobil ilova** — React Native, telefonda ishlaydi.
- Xulosa: Backend va Database'ni bir marta qurasiz, keyin ularga turli kirish yo'llarini ulaysiz. Mobil ilovani shu modulning 9–11-darslarida quramiz.
- Tugma: 3 kirish yo'lini oching (N/3) → Davom etish

✎ 🔴 FAKT: «Mobil ilovani keyingi modulda quramiz» → «shu modulning 9–11-darslarida» (React Native aynan shu modulda) · takror olib tashlandi (oldin karta va xulosada ikki marta)

## 11 · 3-savol ✅  `[1109]`
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Web sayt va bot bir xil buyurtmalarni ko'rishi uchun nima qilinadi?**
  - Har biri uchun alohida Database quriladi
  - Ma'lumot har biriga qo'lda ko'chiriladi
  - ✔ Ikkalasi bitta Backend va Database'ga ulanadi
  - Buning iloji yo'q — ular alohida ishlaydi
- To'g'ri: To'g'ri! Web va bot — ikki xil kirish yo'li, lekin ikkalasi bitta Backend va Database'ga ulanadi. Shuning uchun bir joyda berilgan buyurtma boshqasida ham ko'rinadi. Mobil ilova ham xuddi shunday ulanadi.
- Xato izohlari:
  - Alohida Database bo'lsa, ma'lumot bo'linib ketadi. To'g'risi — bitta umumiy Backend va Database.
  - Qo'lda ko'chirish sekin va xatoga olib keladi. Bitta umumiy Database'ga ulansa, ma'lumot o'zi bir xil bo'ladi.
  - Aksincha, bu oson: ikkala kirish yo'lini bitta Backend'ga ulaysiz.
  - (umumiy) Bitta Backend va Database — ko'p kirish yo'li.

## 12 · To'liq tizim (case)  `[1129]`
- Eyebrow: Hayotiy · to'liq tizim
- Sarlavha: **Bitta buyurtma — butun tizim birga ishlaydi.**
- Mentor: Mana hammasi birga: web va bot orqali kelgan buyurtmalar bitta Database'ga yoziladi, AI esa tavsiya beradi. Tugmani bosib, tizim qanday ishlashini qadam-baqadam kuzating.
- Qadamlar:
  1. Birinchi foydalanuvchi saytda «Telefon»ni savatga qo'shdi → Frontend Backend'ga so'rov yubordi.
  2. Backend so'rovni qabul qildi va buyurtmani Database'ga yozdi 🗄️✅
  3. Ikkinchi foydalanuvchi Telegram botga «Telefon buyuraman» deb yozdi.
  4. Bot ham o'sha Backend'ga ulandi → buyurtma o'sha Database'ga yozildi 🗄️✅
  5. AI ikkala foydalanuvchiga ham «G'ilof ham olasizmi?» deb tavsiya berdi.
  6. Ikki kirish yo'li, bitta tizim — hamma buyurtma bitta Backend va Database'da.
- Yon karta: 🗺️ Tizim xaritasi — 🖥️ Web · 🤖 Bot → ⚙️ Backend · 🗄️ Database
- Tugma: ▶ Buyurtmani boshlash → Keyingi qadam → → ✓ Tizim ishladi
- Xulosa: Ikki foydalanuvchi, ikki kirish yo'li, bitta Database. Shu tizimni 13-darsda — «Loyiha kuni»da to'liq qurasiz.
- Tugma: Tizimni kuzating (N/6) → Davom etish

✎ «capstone» → «13-darsda — Loyiha kuni» · «DARVOZA / O'SHA» katta harflar olib tashlandi

## 13 · Chizma  `[1175]`
- Eyebrow: Amalda · chizma
- Sarlavha: **Kod yozishdan oldin tizim chizmasini chizing.**
- Mentor: Tajribali dasturchi avval qog'ozda yoki AI bilan tizim chizmasini chizadi: qaysi qismlar bor va ular qanday bog'lanadi. Mana shu chizma arxitektura deyiladi. Tugmani bosing.
- Chizma (`arxitektura.txt`):
  ```
  // onlayn xarid sayti tizimi
  Foydalanuvchi
     ↓
  Frontend (React)
     ↓ ↑  API (so'rov / javob)
  Backend (Node.js · NestJS) ── AI
     ↓ ↑
  Database (PostgreSQL)
  ```
- Tugma: Nega chizma muhim? → ✓ Tushundim
- Ochilgach:
  - 🗺️ **Aniqlik:** qaysi qism nima qilishini oldindan bilasiz
  - 🤝 **Muloqot:** jamoaga yoki AI'ga tizimni tushuntira olasiz
  - 🐞 **Xato:** muammo qaysi qismda ekanini tezroq topasiz
- 📍 3-DARSDA: Tizimni tuzishning sinab ko'rilgan usullari bor — ularni **arxitektura patternlari** deyishadi (masalan, MVC va mikroservis). 3-darsda shularni o'rganamiz.
- Tugma (pastki): Nega chizma muhim? → Davom etish

✎ 🔴 FAKT: «KEYINGI DARS: pattern» → «3-DARSDA» (keyingi, 2-dars — PM darsi) · 🔴 chizmada «Nest», 2-ekranda «Node» edi → ikkalasida «Node.js (NestJS)» · «bosh me'mor ishi» olib tashlandi · uch xil tugma nomi → bitta

## 14 · 4-savol ✅  `[1216]`
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Web tizimingizga mobil ilova qo'shmoqchisiz. Eng kam ish bilan qanday qilasiz?**
  - Hammasini noldan: yangi Frontend, Backend, Database
  - Mobil ilova uchun alohida Database quraman
  - Iloji yo'q — mobil ilova butunlay boshqa narsa
  - ✔ Mobil Frontend yozib, bor Backend'ga ulayman
- To'g'ri: To'g'ri! Backend va Database tayyor — ular har qanday kirish yo'li bilan ishlaydi. Mobil ilova — yana bir Frontend (React Native), u o'sha Backend'ga ulanadi. Arxitekturani tushunsangiz, ish ancha kamayadi.
- Xato izohlari:
  - Backend va Database'ni qayta yozish shart emas — ular tayyor. Faqat yangi Frontend qo'shasiz.
  - Alohida Database ma'lumotni bo'lib yuboradi. Mobil ilova o'sha umumiy Database bilan ishlashi kerak.
  - Aksincha — mobil ilova ham yana bir Frontend. Shu modulning 9–11-darslarida aynan shuni qilamiz.
  - (umumiy) Yangi Frontend yozib, mavjud Backend va Database'ga ulaysiz.

✎ To'g'ri javob qisqartirildi (oldin eng uzuni edi) · 🔴 FAKT: «keyingi modulda» → «shu modulning 9–11-darslarida»

## 15 · Yo'lni yig'ing ✅ (final)  `[1236]`
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Oxirgi qadam: ma'lumot yo'lini to'g'ri tartibda yig'ing.**
- Mentor: Foydalanuvchi tugmani bosganda ma'lumot qayerdan qayerga boradi? Bo'laklarni to'g'ri joyiga qo'ying.
- Bo'laklar: Foydalanuvchi · Frontend · Backend · Database · Ekranda natija
- Joy izohlari: tugmani bosadi · ko'rsatadi va so'rov yuboradi · tekshiradi va hisoblaydi · doimiy saqlaydi · javob ekranga qaytadi · «bu yerga qo'ying»
- Xato: ⚠️ Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- To'g'ri: ✓ Yo'l tayyor: **Foydalanuvchi → Frontend → Backend → Database → ekran**. Real ilovada ma'lumot shu yo'l bilan yuradi.
- Havola: 📖 Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: Yo'lni yig'ing → Davom etish

✎ 🔴 Oldin Mentor javobni o'zi aytib qo'ygan edi («Tartibni eslang: foydalanuvchi → peshtoq → …») — final test o'z-o'zidan yechilardi, olib tashlandi · «slot» → «joy» · ikki xil xato-yozuv → bitta

## 16 · Natijalar (podium)  `[1805]` — o'zgarmaydi
Umumiy shablon (barcha darslarda bir xil): Kim g'olib? · Siz mustaqil rejimdasiz… · Natijalar yuklanmoqda…

## 17 · Takrorlash (kartochkalar)  `[2073]`
- Sarlavha: **O'zingizni sinab ko'ring.**

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Foydalanuvchi ko'radigan qism qanday ataladi? | Frontend | Sahifa, tugmalar, rasmlar |
| So'rovni qabul qilib, qoidalarni bajaradigan qism qaysi? | Backend | So'rovni tekshiradi, hisoblaydi, Database'ga yozadi |
| Mahsulot va buyurtmalar qayerda doimiy saqlanadi? | Database | Sahifa yangilansa ham yo'qolmaydi |
| Frontend va Backend qaysi yo'l orqali gaplashadi? | API | So'rov boradi, javob qaytadi |
| Tugma bosilganda Backend'ga yuboriladigan xabar nima deyiladi? | So'rov (request) | Frontend'dan Backend'ga boradi |
| Backend so'rovga qaytaradigan natija nima deyiladi? | Javob (response) | O'sha yo'l bilan ekranga qaytadi |
| «Savatga» bosilganda so'rov qaysi yo'l bilan boradi? | Frontend → Backend → Database | Javob keyin orqaga qaytadi |
| Bizning tizimda Frontend nega Database'ga to'g'ridan ulanmaydi? | Xavfsizlik uchun | Parol va qoidalar Backend'da turadi |
| AI tizimda nima qiladi? | Maslahat beradi | Uni Backend chaqiradi |
| Web sayt va Telegram bot bitta tizim bo'la oladimi? | Ha | Ikkalasi bitta Backend va Database'ga ulanadi |
| Tayyor tizimga mobil ilova qanday qo'shiladi? | Yangi Frontend yozib | Backend'ni qaytadan qurish shart emas |
| Ma'lumot yo'li kimdan boshlanadi? | Foydalanuvchidan | U tugmani bosadi, keyin so'rov yo'lga chiqadi |

✎ «Request / Response» endi darsda ham shu nom bilan o'tilgan (3-ekran) · metafora izohlari texnik izohga almashdi

## 18 · Yakun  `[2086]`
- Eyebrow: Tayyor · belgi: ✓ Tizimni ko'ra boshladingiz
- Sarlavha: **Endi sayt siz uchun bitta sahifa emas — yaxlit tizim.**
- Endi siz bilasiz:
  - Real ilova — bir nechta qism birga ishlaydigan tizim
  - 5 qism: Frontend, Backend, Database — asosiy; AI va Bot — qo'shimcha
  - Ma'lumot yo'li: Foydalanuvchi → Frontend → Backend → Database → ekran
  - Bitta Backend va Database, ko'p kirish yo'li (web, bot, mobil)
  - Kod yozishdan oldin tizim chizmasini (arxitekturani) chizish kerak
- Uyga vazifa:
  - **Chizing** — o'z loyihangiz arxitekturasini chizing: unda qaysi qismlar bor?
  - **Yo'l** — bitta amal uchun (masalan, «buyurtma berish») so'rov yo'lini chizib chiqing
  - **Kirish yo'llari** — loyihangizga qaysilari kerak: web, bot, mobil?
- 🚀 Keyingi dars — **Bitta gapni uch kishi bir xil tushunadimi?** Kod yozishdan oldin g'oyani bitta varaqqa yozishni o'rganamiz.
- Arena tugmasi · ⏳ Mentorni kuting · 🏅 Nishonlaringiz — N/4 · Qaytadan · Yakunlash ✓

✎ 🔴 FAKT: «Keyingi dars — Arxitektura patternlari» → haqiqiy keyingi dars (2-dars, PM) · «qaysi 5 idora bor?» → «qaysi qismlar bor?» (har loyihada 5 ta bo'lishi shart emas)

---

## Qo'shimcha matnlar

**Nishonlar (4)** — inglizcha nom qoladi (qoida), lekin «shahar» nomlari mavzuga moslanadi:
- 🗄️ **Data Keeper** — Database doimiy xotira ekanini topdingiz
- 🛣️ **Request Route** — so'rovning to'g'ri yo'lini bildingiz
- 🌐 **One Backend** — ko'p kirish yo'li, bitta tizim — g'oyani tushundingiz
- 📱 **New Door** — tizimga yangi kirish yo'li (mobil) qo'shdingiz

**Qisqa takrorlash oynalari (5):**
1. (4) **Database — doimiy saqlash joyi:** Database eslab qoladi — mahsulot, buyurtma va foydalanuvchilar Database'da doimiy saqlanadi. · Frontend ko'rsatadi — sahifa yangilansa, faqat ekranda turgan ma'lumot yo'qoladi. · Backend tashiydi — so'rovni tekshirib Database'ga yozadi, lekin o'zi doimiy saqlamaydi. · Sinfga savol: Mahsulot va buyurtmalar aslida qayerda saqlanadi?
2. (8) **So'rovning yo'li:** Frontend'dan boshlanadi — foydalanuvchi tugmani bosadi, Frontend Backend'ga so'rov yuboradi. · Backend Database bilan ishlaydi — so'rovni qabul qiladi, Database'ga yozadi yoki o'qiydi. · Javob orqaga qaytadi — natija o'sha yo'l bilan ekranga qaytadi; bizning tizimda Frontend Database'ga to'g'ridan bormaydi. · Sinfga savol: «Savatga» bosilganda so'rov qaysi yo'l bilan boradi?
3. (11) **Ko'p kirish yo'li — bitta tizim:** Har biri alohida kirish — web sayt, Telegram bot, mobil ilova. · Markaz bitta — hammasi bitta Backend va Database'ga ulanadi. · Ma'lumot umumiy — bir joyda berilgan buyurtma boshqasida ham ko'rinadi. · Sinfga savol: Web va bot bir xil buyurtmani qanday ko'radi?
4. (14) **Yangi kirish yo'li — kam ish:** Backend tayyor — Backend va Database har qanday kirish yo'li bilan ishlaydi. · Mobil — yana bir Frontend — mobil ilova (React Native) o'sha Backend'ga ulanadi. · Arxitektura vaqt tejaydi — tizimni tushunsangiz, ish ancha kamayadi. · Sinfga savol: Mavjud tizimga mobil ilovani qanday qo'shasiz?
5. (15) **Ma'lumot yo'li — tartib muhim:** Avval foydalanuvchi — u tugmani bosadi. · Keyin Backend va Database — so'rov Frontend'dan Backend'ga, undan Database'ga boradi. · Oxirida natija — javob eng oxirida ekranga qaytadi. · Sinfga savol: Nega bizning tizimda so'rov to'g'ridan Database'ga bormaydi?

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi):**
1. Mahsulot, buyurtma va foydalanuvchilar qayerda doimiy saqlanadi? ✔ Database'da · Frontend'da · Backend'da · AI'da
2. Frontend asosan nima qiladi? Ma'lumotni doimiy saqlaydi · Narx va to'lovni hisoblaydi · ✔ Foydalanuvchiga ma'lumotni ko'rsatadi · Database'ga to'g'ridan yozadi
3. «Savatga» bosilganda so'rov qaysi yo'l bilan boradi? Frontend → Database, Backend'siz · Frontend ichida qoladi · ✔ Frontend → Backend → Database, javob orqaga · Database → Backend → Frontend
4. Bizning tizimda Frontend nega Database'ga to'g'ridan ulanmaydi? Database juda sekin ishlaydi · ✔ Xavfsizlik uchun — Backend orqali o'tadi · Ular boshqa tilda yozilgan · Buni texnik jihatdan qilib bo'lmaydi
5. Backend'ning asosiy vazifasi nima? Sahifa dizaynini chizadi · Foydalanuvchiga to'g'ridan ko'rinadi · Faqat matnni tarjima qiladi · ✔ Qoidalarni bajaradi, Database'ga yozadi
6. Web sayt va Telegram bot bir xil buyurtmalarni qanday ko'radi? ✔ Bitta Backend va Database'ga ulanadi · Har biriga alohida Database quriladi · Ma'lumot qo'lda ko'chiriladi · Buning umuman iloji yo'q
7. «Ko'p kirish yo'li, bitta tizim» nimani anglatadi? Har kirish yo'liga alohida tizim kerak · Bitta kirish yo'li hamma uchun yetadi · Faqat web sayt bo'lishi mumkin · ✔ Web, bot, mobil — bitta Backend'ga
8. Database o'chirilsa nima bo'ladi? Hech narsa o'zgarmaydi · ✔ Ma'lumot saqlanmaydi, yo'qoladi · Faqat sahifa ranglari o'chadi · Tizim tezroq ishlay boshlaydi
9. Mavjud tizimga mobil ilova qo'shishning eng oson yo'li? Hammasini noldan qayta yozish · ✔ Yangi Frontend yozib, Backend'ga ulash · Mobil uchun alohida Database qurish · Buning umuman iloji yo'q
10. AI tizimda qanday rol o'ynaydi? Ma'lumotni doimiy saqlaydi · Barcha qarorlarni yolg'iz qiladi · ✔ Maslahat va tavsiya beradi · Sahifani foydalanuvchiga ko'rsatadi
11. Ma'lumot qaysi tartibda yuradi? Database → Backend → Frontend → ekran → foydalanuvchi · Backend → Database → Frontend → foydalanuvchi → ekran · Frontend → Database → Backend → foydalanuvchi → ekran · ✔ Foydalanuvchi → Frontend → Backend → Database → ekran
12. Kod yozishdan oldin arxitekturani chizish nega foydali? ✔ Qaysi qism nima qilishini aniqlaydi · Kodni o'zi avtomatik yozib beradi · Serverni ancha tezlashtiradi · Sahifa dizaynini chiroyli qiladi

---

## B. Bu darsdan tashqariga chiqadigan narsalar (hozir tegilmaydi)
- **«eng uzun streak»** (arena yakuni) va **«sessiya»** (podium) — barcha darslarda bir xil shablon → `KATTA_TOZALASH.md` ga yoziladi.
- **Qonun o'zgaradi:** `MATN_ETALONI.md` 142-qator («Backend = Hokimlik, SHAHAR mapping») — yangi qoida A-1 bilan almashadi.
  Shahar metaforasi yana **3, 8, 13-darslarda** bor → ular ham shu qoida bilan ko'riladi.
