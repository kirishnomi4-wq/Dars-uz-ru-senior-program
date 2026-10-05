# 1-dars «Komponentlardan tizim» — yakuniy matn

Fayl: `src/6-Modull/SystemArchitectureLesson.jsx` · 19 ekran · Keyingi dars: «Bitta gapni uch kishi bir xil tushunadimi?»
Holat: 05.10.2026 — kodga mos

## 0 · Kirish
- Eyebrow: Modul · kirish
- Sarlavha: Bitta xarid sayti ortida nechta qism ishlaydi?
- Mentor: Foydalanuvchi faqat sahifani ko'radi. Tugmani bosing — sahifa ortini ochamiz.
- Sayt maketi (`onlayn-xarid.uz`): onlayn-xarid · Savat 0 · Telefon 2 500 000 · Quloqchin 300 000 · tugma «Savatga»
- Tugma: ▶ Ortida nima bor? → ✓ Ochildi: ortida 5 qism
  - (bosilgach) maket o'rnida tizim xaritasi: Foydalanuvchi — sahifani ko'radi; qolgan 5 qism hali ochilmagan
- Savol (o'ng ustun; tugma bosilmaguncha variantlar xira): Sayt aslida nima?
  - Bitta narsa — shunchaki «sayt»
  - ✔ Bir nechta qism birga ishlaydigan tizim
  - Faqat dizayn va rasmlar
- Javob izohlari:
  - Ikkinchisi tanlansa: Aynan! Sayt — bu tizim: beshta qism birga ishlaydi.
  - Birinchisi yoki uchinchisi tanlansa: Qiziq fikr! Ekranda bitta sahifa, lekin ortida beshta qism birga ishlaydi.
- Tugma: Davom etish
- Barcha ekranlarda umumiy: telefonda Mentor yig'ilganda — «Mentor · ko'rsatmani ochish ▾»; jonli darsda mentor hali o'tmagan sahifada oldinga tugma o'rnida — «Mentorni kuting»

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun qismlarni bitta tizimga ulaymiz.
- Mentor: Oldingi modullarda har qismni alohida qurdingiz. Endi ularni bitta chizmada ko'ramiz — buni arxitektura deyishadi.
- Chap yorliq: Dars oxirida shu chizmani o'zingiz yig'asiz
- Tizim xaritasi (so'rov yo'l bo'ylab aylanib turadi): Foydalanuvchi — bosadi · Frontend — ko'rsatadi · Backend — hisoblaydi, tekshiradi · Database — eslab qoladi
- Izoh: So'rov yo'l bo'ylab boradi, javob yashil bo'lib qaytadi.
- O'ng yorliq: Bugungi 4 qadam
  - 01 · Tizimning 5 qismi — har biri nima qiladi · qismlar
  - 02 · So'rov qanday yuradi · so'rov yo'li
  - 03 · Ko'p kirish yo'li, bitta tizim · web · bot · mobil
  - 04 · O'z loyihangiz chizmasi · chizma
- Tugmalar: Orqaga · Boshlaymiz →

## 2 · Tushuncha · 5 qism
- Eyebrow: Tushuncha · 5 qism
- Sarlavha: Sayt ortidagi har qism nima qiladi?
- Mentor: Maketdagi narsani bosing — u qaysi qismning ishi ekanini xarita ko'rsatadi.
- Sayt maketi (`onlayn-xarid.uz`; bosiladigan 5 joy halqa bilan belgilangan): onlayn-xarid · Savat 0 · Telefon 2 500 000 · Quloqchin 300 000 · tugma «Savatga» · pufak «G'ilof ham olasizmi?» · Telegram orqali buyurtma
- Tizim xaritasi: Foydalanuvchi — bosadi; qolgan 5 qism hali ochilmagan
- Joy bosilganda xaritada o'sha qism ochiladi (nomi va vazifasi), ostida izoh:
  - Telefon kartasi → Frontend · React — ko'rsatadi
  - «Savatga» → Backend · Node.js (NestJS) — hisoblaydi, tekshiradi (maketda chiqadi: Jami: 2 800 000)
  - Savat → Database · PostgreSQL — eslab qoladi (savatda: 2)
  - «G'ilof ham olasizmi?» → AI · Claude — maslahat beradi
  - «Telegram orqali buyurtma» → Bot · Telegram — yana bir kirish yo'li
- Xulosa (5/5): Beshta qism — bitta tizim: uchtasi asosiy, AI va Bot qo'shimcha.
- Tugmalar: Orqaga · 5 qismni toping (N/5) → Davom etish

## 3 · Tajriba · so'rov yo'li
- Eyebrow: Tajriba · so'rov yo'li
- Sarlavha: «Savatga» bosilgach so'rov qayerga boradi?
- Mentor: So'rovni o'zingiz yo'naltiring: har qadamda keyingi qismni bosing.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): Frontend'dan keyin so'rov qayerga boradi?
  - Database'ga
  - Backend'ga
- (tanlangach) Karta «Qadamlar» (o'tgani ✓):
  1. Foydalanuvchi «Savatga» bosdi
  2. Frontend → Backend: so'rov
  3. Backend → Database: yozish
  4. Database → Backend: javob
  5. Backend → Frontend: ekran yangilandi
- Har to'g'ri bosishdan keyin izoh (qadam tartibida):
  1. Frontend bosishni qabul qildi.
  2. Backend so'rovni (request) qabul qildi va tekshirdi.
  3. Database buyurtmani saqladi.
  4. Database «saqlandi» deb javob qaytardi.
  5. Backend javob (response) qaytardi — savatda 1 ta.
- Tizim xaritasi: Foydalanuvchi · Frontend · Backend · Database; konvert joriy qismda turadi, keyingi qism bosiladi; Foydalanuvchi ostida «savat: 0» → oxirida «savat: 1»
- Noto'g'ri qism bosilsa (qism silkinadi), bitta qator:
  - Frontend'dan Database bosilsa: Bizning tizimda Frontend Database'ga to'g'ridan bormaydi.
  - Javob qaytayotganda: Javob ham shu yo'l bilan orqaga qaytadi.
  - Boshqa holatda: Konvert chiziq bo'ylab keyingi qismga yuradi.
- Natija qatori: Taxminingiz to'g'ri chiqdi: Frontend'dan keyin — Backend. · yoki: Taxminingiz: Database · haqiqatda: Backend
- Xulosa: So'rov Frontend → Backend → Database yuradi, javob shu yo'l bilan qaytadi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Yo'lni yuring (N/5) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Mahsulotlar, buyurtmalar va foydalanuvchilar qayerda doimiy saqlanadi?
  - Frontend'da — foydalanuvchi ularni ko'radi
  - Backend'da — so'rovlar shu yerdan o'tadi
  - AI'da — u hamma savolga javob beradi
  - ✔ Database'da — sahifa yangilansa ham qoladi
- Javob izohlari:
  - To'g'ri: To'g'ri! Doimiy ma'lumot Database'da (PostgreSQL) saqlanadi. Frontend ma'lumotni ko'rsatadi, Backend uni tekshirib Database'ga yozadi, saqlash esa Database'ning vazifasi.
  - A: Frontend ma'lumotni ko'rsatadi, lekin doimiy saqlamaydi: sahifa yangilansa, ekrandagi ma'lumot yo'qolishi mumkin.
  - B: Backend so'rovni tekshiradi va Database'ga yozadi, lekin ma'lumotni o'zi doimiy saqlamaydi.
  - C: AI maslahat beradi, lekin ma'lumotni saqlamaydi.
- Test ekranlarining umumiy yozuvlari (4, 8, 11 va 14-ekranlarda bir xil):
  - Natija sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · (jonli darsda) Javobingiz qabul qilindi → Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <variant>
  - Jonli darsda savol ostida: Jonli dars — bitta urinish, o'ylab bosing!
  - Xato javobdan keyin havola: Qisqa takrorlash — mavzuni yana bir ko'rish
  - Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 5 · Chegara · Frontend va Backend
- Eyebrow: Chegara · Frontend va Backend
- Sarlavha: Bu ishni Frontend qiladimi yoki Backend?
- Mentor: Boshida ko'pchilik shu ikkisini adashtiradi. Ishni bosing, keyin uning tomonini bosing.
- Karta «Ishlar» (joylangani ro'yxatdan chiqadi): Tugmani ko'rsatadi · Narxni hisoblaydi · Rasmni ko'rsatadi · Parolni tekshiradi · Savatni chizadi · Buyurtmani Database'ga yozadi
- Ish tanlangach: Endi tomonni bosing: brauzer yoki server.
- Ikki tomon: brauzer oynasi (`onlayn-xarid.uz`, «Frontend · brauzer») · o'rtada «API» · server qutisi («Backend · server»)
- To'g'ri joylansa, tomon o'zgaradi:
  - Frontend: Rasmni ko'rsatadi → rasm va «Telefon» · Savatni chizadi → «Savat 2» · Tugmani ko'rsatadi → «Savatga»
  - Backend — server qatorlari (joylanmagani «…»):
```
narx = 2 500 000 + 300 000
     = 2 800 000
parol tekshirildi: to'g'ri
INSERT buyurtma → Database
```
- Noto'g'ri tomon bosilsa (ish silkinadi), bitta qator:
  - Tugmani ko'rsatadi: Tugma ekranda ko'rinadi — bu Frontend ishi.
  - Narxni hisoblaydi: Narxni foydalanuvchi o'zgartira olmasin — bu Backend ishi.
  - Rasmni ko'rsatadi: Rasm ekranda ko'rinadi — bu Frontend ishi.
  - Parolni tekshiradi: Parolni brauzerda tekshirish xavfli — bu Backend ishi.
  - Savatni chizadi: Savat ekranda ko'rinadi — bu Frontend ishi.
  - Buyurtmani Database'ga yozadi: Database bilan faqat Backend gaplashadi.
- 6/6 da «API» chizig'idan so'rov boradi va javob qaytadi.
- Xulosa: Ko'rinadigani — Frontend, qoida va hisob — Backend; ular API orqali gaplashadi.
- Tugmalar: Orqaga · 6 ishni joylang (N/6) → Davom etish

## 6 · Tajriba · Database
- Eyebrow: Tajriba · Database
- Sarlavha: Sahifani yangilasangiz, savat nima bo'ladi?
- Mentor: Ikki saytni solishtiring: birida Database yo'q, birida bor.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): Ikkala saytda savat nima bo'ladi?
  - Ikkalasida ham qoladi
  - Database'sizda yo'qoladi
  - Ikkalasida ham yo'qoladi
- (tanlangach) Ikki sayt maketi yonma-yon — «Database'siz» va «Database bilan · PostgreSQL»; ikkalasida: onlayn-xarid · Savat 2 · Telefon 2 500 000 · Quloqchin 300 000 · Savatga
- Tugma: Sahifani yangilash → ikkala maket miltillab qayta yuklanadi; chapda Savat 0, o'ngda Savat 2 va «Database: savat saqlandi»
- Natija qatori: Taxminingiz to'g'ri chiqdi: Database'sizda yo'qoldi. · yoki: Taxminingiz: <tanlangan variant> · haqiqatda: Database'sizda yo'qoldi
- Xulosa: Database'ga yozilgan ma'lumot qoladi, faqat ekranda turgani yo'qoladi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Sahifani yangilang → Davom etish

## 7 · Qo'shimcha qismlar · AI va Bot
- Eyebrow: Qo'shimcha qismlar · AI va Bot
- Sarlavha: AI va Bot tizimning qaysi qismiga ulanadi?
- Mentor: Ikkala qismni xaritaga ulang va saytda nima o'zgarishini ko'ring.
- Ko'rsatma qatori: Xaritada AI yoki Bot tugunini bosing. → (tanlangach) AI tanlandi — endi u ulanadigan qismni bosing. / Bot tanlandi — endi u ulanadigan qismni bosing.
- Tizim xaritasi: Foydalanuvchi · Frontend · Backend · Database · AI · Bot
- Yonida: sayt maketi (onlayn-xarid · Savat 1 · Telefon 2 500 000 · Quloqchin 300 000 · Savatga) va Telegram chat maketi «onlayn-xarid bot» (belgi: OX):
  - Bot: Nima buyurtma qilasiz?
  - Pastki qator: Database · buyurtmalar: 1
- Backend bosilsa — chiziq yashil chiziladi:
  - AI → saytda pufak «G'ilof ham olasizmi?»
  - Bot → chatda xabar «Telefon buyuraman», Database · buyurtmalar: 2
- Frontend yoki Database bosilsa — chiziq qizil, bitta qator:
  - AI: AI'ni Backend chaqiradi — kalit va qoidalar shu yerda.
  - Bot: Bot ham Backend orqali ishlaydi — Database'ga o'zi yozmaydi.
- Xulosa: AI va Bot qo'shimcha qismlar; ikkalasi ham o'sha Backend'ga ulanadi.
- Tugmalar: Orqaga · Ikkalasini ulang (N/2) → Davom etish

## 8 · 2-savol
- Eyebrow: Mashq · 2-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Foydalanuvchi «Savatga» bosdi. So'rov qaysi yo'l bilan boradi?
  - ✔ Frontend → Backend → Database, javob orqaga qaytadi
  - Frontend → Database, Backend'ni chetlab o'tadi
  - Frontend ichida qoladi, hech qayerga chiqmaydi
  - Database → Backend → Frontend, teskari yo'nalishda
- Javob izohlari:
  - To'g'ri: To'g'ri! So'rov Frontend'dan Backend'ga, undan Database'ga boradi; javob esa shu yo'l bilan ekranga qaytadi. Bizning tizimda Frontend Database bilan to'g'ridan ishlamaydi — hamma so'rov Backend orqali o'tadi.
  - B: Bizning tizimda Frontend Database'ga to'g'ridan ulanmaydi: so'rovni Backend tekshiradi, parol va qoidalar ham Backend'da turadi.
  - C: So'rov Frontend ichida qolsa, hech narsa saqlanmaydi. U Backend va Database'ga borishi kerak.
  - D: Yo'nalish teskari: avval Frontend so'rov yuboradi, keyin Backend va Database ishlaydi. Javob esa orqaga qaytadi.
- Umumiy yozuvlar — 4-ekrandagidek.

## 9 · Tajriba · qismni o'chirish
- Eyebrow: Tajriba · qismni o'chirish
- Sarlavha: Bitta qismni o'chirsangiz, sayt nima bo'ladi?
- Mentor: Qismni o'chiring va saytga qarang.
- Karta «O'chirish kaliti»: Frontend — yoqilgan · Backend — yoqilgan · Database — yoqilgan (bosilgani: «— o'chiq»; sinalgani oldida ✓)
- Bir qatorli tizim xaritasi: Foydalanuvchi · Frontend · Backend · Database (o'chirilgan qism kulrang, chizig'i uziladi)
- Sayt maketi o'zgaradi, ostida bitta qator:
  - Frontend o'chiq → bo'sh oyna — Ko'radigan hech narsa yo'q.
  - Backend o'chiq → Yuklanmoqda… — Javob kelmayapti.
  - Database o'chiq → Savat 0 — Ma'lumot saqlanmadi: savat bo'sh.
- Xulosa (3/3, hamma qism yana yoqiladi): Uchala asosiy qism kerak: biri ko'rsatadi, biri boshqaradi, biri eslab qoladi.
- Tugmalar: Orqaga · 3 qismni sinang (N/3) → Davom etish

## 10 · Tizim · ko'p kirish yo'li
- Eyebrow: Tizim · ko'p kirish yo'li
- Sarlavha: Saytdan va botdan berilgan buyurtma qayerga tushadi?
- Mentor: Uchala kirish yo'lidan buyurtma bering va Database'ga qarang.
- Uch kirish maketi:
  - Brauzer (`onlayn-xarid.uz`): Telefon 2 500 000 · tugma «Buyurtma»
  - Telegram «onlayn-xarid bot» (belgi: OX): Nima buyurtma qilasiz? · tugma «Buyurtma» (yuborilgach xabar: Quloqchin)
  - Mobil ilova (telefon ramkasi, «onlayn-xarid»): G'ilof 90 000 · tugma «Buyurtma»
  - Bosilgan tugma: ✓ Yuborildi
- O'rtada: Backend · Node.js (NestJS) — buyurtma o'tganda yonadi
- Pastda jadval: Database · buyurtmalar · N — bo'sh paytda «hali bo'sh»; har buyurtmada yangi qator (bosilish tartibida):
  - #1 · web · Telefon
  - #2 · bot · Quloqchin
  - #3 · mobil · G'ilof
- Xulosa: Backend va Database bitta, kirish yo'llari ko'p. Mobil ilovani 9–11-darslarda quramiz.
- Tugmalar: Orqaga · 3 yo'ldan buyurtma bering (N/3) → Davom etish

## 11 · 3-savol
- Eyebrow: Mashq · 3-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Web sayt va bot bir xil buyurtmalarni ko'rishi uchun nima qilinadi?
  - Har biri uchun alohida Database quriladi
  - Ma'lumot har biriga qo'lda ko'chiriladi
  - ✔ Ikkalasi bitta Backend va Database'ga ulanadi
  - Buning iloji yo'q — ular alohida ishlaydi
- Javob izohlari:
  - To'g'ri: To'g'ri! Web va bot — ikki xil kirish yo'li, lekin ikkalasi bitta Backend va Database'ga ulanadi. Shuning uchun bir joyda berilgan buyurtma boshqasida ham ko'rinadi. Mobil ilova ham xuddi shunday ulanadi.
  - A: Alohida Database bo'lsa, ma'lumot bo'linib ketadi. To'g'risi — bitta umumiy Backend va Database.
  - B: Qo'lda ko'chirish sekin va xatoga olib keladi. Bitta umumiy Database'ga ulansa, ma'lumot o'zi bir xil bo'ladi.
  - D: Aksincha, bu oson: ikkala kirish yo'lini bitta Backend'ga ulaysiz.
- Umumiy yozuvlar — 4-ekrandagidek.

## 12 · Hayotiy · to'liq tizim
- Eyebrow: Hayotiy · to'liq tizim
- Sarlavha: Ikki foydalanuvchi — bitta tizim. Nima bo'ladi?
- Mentor: Bir xaridor saytdan, ikkinchisi botdan buyurtma beradi. Qadamlarni kuzating.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): Ikki buyurtma nechta Database'ga yoziladi?
  - Bitta
  - Ikkita
- (tanlangach) Karta «Qadamlar» (o'tgani ✓), ichida tugma: Boshlash → Keyingi qadam
  1. Saytdan buyurtma
  2. Backend yozdi
  3. Botdan buyurtma
  4. Backend yozdi
  5. AI tavsiya
  6. Natija
- Har qadamdan keyin izoh:
  1. Frontend so'rovni Backend'ga yubordi.
  2. Backend buyurtmani Database'ga yozdi.
  3. Botga «Telefon buyuraman» xabari keldi.
  4. Bot o'sha Backend orqali o'sha jadvalga yozdi.
  5. AI ikkala xaridorga «G'ilof ham olasizmi?» deb taklif qildi.
  6. Ikki kirish yo'li — bitta Backend, bitta Database.
- Tizim xaritasi (Foydalanuvchi · Frontend · Backend · Database · AI · Bot): konvert har qadamda yo'l bo'ylab sakrab yuradi; 3-qadamda Bot yonida pufak «Telefon buyuraman», 5-qadamda AI yonida «G'ilof ham olasizmi?»; oxirida hamma chiziq yashil
- Jadval: Database · buyurtmalar · N — «hali bo'sh» → #1 · web · Telefon (2-qadam) → #2 · bot · Telefon (4-qadam)
- Natija qatori: Taxminingiz to'g'ri chiqdi: bitta Database. · yoki: Taxminingiz: ikkita · haqiqatda: bitta Database
- Xulosa: Ikki kirish yo'li, bitta Database. Shu tizimni 13-darsda to'liq qurasiz.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Tizimni kuzating (N/6) → Davom etish

## 13 · Amalda · chizma
- Eyebrow: Amalda · chizma
- Sarlavha: Kod yozishdan oldin tizimni chizing.
- Mentor: Tajribali dasturchi avval chizma chizadi. Qismlarni qo'shib, ularni ulang.
- Qism tugmalari (qo'shilgani: ✓): + Foydalanuvchi · + Frontend · + Backend · + Database · + AI
- Ko'rsatma qatori: Ulash uchun xaritada ikki qismni ketma-ket bosing. → (bittasi bosilgach) <qism nomi> tanlandi — ulanadigan qismni bosing.
- Noto'g'ri ulanish (chiziq qizil): So'rov Backend orqali o'tadi.
- Chapda xarita (qo'shilgan qismlar va chiziqlar), o'ngda fayl `arxitektura.txt` — bo'sh paytda: Qism qo'shing — shu yerda yoziladi.
- Fayl har qo'shish va ulashda bir qatorga o'sadi (to'liq holati; qatorlar bajarilish tartibida):
```
[Foydalanuvchi]
[Frontend · React]
[Backend · Node.js (NestJS)]
[Database · PostgreSQL]
[AI · Claude]
Foydalanuvchi → Frontend
Frontend ↔ Backend   (API: so'rov / javob)
Backend → Database
Backend → AI
```
- Xulosa: Chizma bilan jamoaga ham, AI'ga ham tizimni bitta rasmda tushuntirasiz.
- Xulosadan keyin qator: 3-darsda tizim tuzishning sinab ko'rilgan usullarini — arxitektura patternlarini o'rganamiz.
- Tugmalar: Orqaga · Chizmani yig'ing (N/9) → Davom etish

## 14 · 4-savol
- Eyebrow: Mashq · 4-savol
- Yorliq: To'g'ri javobni tanlang
- Savol: Web tizimingizga mobil ilova qo'shmoqchisiz. Eng kam ish bilan qanday qilasiz?
  - Hammasini noldan: yangi Frontend, Backend, Database
  - Mobil ilova uchun alohida Database quraman
  - Iloji yo'q — mobil ilova butunlay boshqa narsa
  - ✔ Mobil Frontend yozib, bor Backend'ga ulayman
- Javob izohlari:
  - To'g'ri: To'g'ri! Backend va Database tayyor — ular har qanday kirish yo'li bilan ishlaydi. Mobil ilova — yana bir Frontend (React Native), u o'sha Backend'ga ulanadi. Arxitekturani tushunsangiz, ish ancha kamayadi.
  - A: Backend va Database'ni qayta yozish shart emas — ular tayyor. Faqat yangi Frontend qo'shasiz.
  - B: Alohida Database ma'lumotni bo'lib yuboradi. Mobil ilova o'sha umumiy Database bilan ishlashi kerak.
  - C: Aksincha — mobil ilova ham yana bir Frontend. Shu modulning 9–11-darslarida aynan shuni qilamiz.
- Umumiy yozuvlar — 4-ekrandagidek.

## 15 · Yakuniy · amaliy
- Eyebrow: Yakuniy · amaliy
- Sarlavha: Ma'lumot yo'lini to'g'ri tartibda yig'ing.
- Mentor: Foydalanuvchi tugmani bosganda ma'lumot qayerdan qayerga boradi? Bo'laklarni to'g'ri joyiga qo'ying.
- 5 ta uya (raqam va ishora):
  1. tugmani bosadi
  2. ko'rsatadi va so'rov yuboradi
  3. tekshiradi va hisoblaydi
  4. doimiy saqlaydi
  5. javob ekranga qaytadi
- Bo'laklar (aralash; sudrash yoki bosish): Foydalanuvchi · Frontend · Backend · Database · Ekranda natija
- To'g'ri tartib: ✔ Foydalanuvchi → Frontend → Backend → Database → Ekranda natija
- Hamma uya to'lib tartib xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring va qayta joylang.
- Yechilgach: Yo'l tayyor: Foydalanuvchi → Frontend → Backend → Database → ekran.
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Yo'lni yig'ing → Davom etish

## 16 · Natijalar (podium) — jonli reyting

## 17 · Takrorlash
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.
- Kartochkalar (12 ta):

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

- Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 18 · Yakun
- Eyebrow: Tayyor
- Belgilar: ✓ Tizimni ko'ra boshladingiz · N/5 to'g'ri
- Sarlavha: Endi sayt siz uchun bitta sahifa emas — tizim.
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Real ilova — bir nechta qism birga ishlaydigan tizim
  - 5 qism: Frontend, Backend, Database — asosiy; AI va Bot — qo'shimcha
  - Ma'lumot yo'li: Foydalanuvchi → Frontend → Backend → Database → ekran
  - Bitta Backend va Database, ko'p kirish yo'li (web, bot, mobil)
  - Kod yozishdan oldin tizim chizmasini (arxitekturani) chizish kerak
- Katta tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda suzuvchi so'zlar: amaliyot · loyiha · mashq · natija)
- Bosilgach karta «Uyga vazifa»:
  - Chizing — o'z loyihangiz arxitekturasini chizing: unda qaysi qismlar bor?
  - Yo'l — bitta amal uchun (masalan, «buyurtma berish») so'rov yo'lini chizib chiqing
  - Kirish yo'llari — loyihangizga qaysilari kerak: web, bot, mobil?
  - Keyingi dars — Bitta gapni uch kishi bir xil tushunadimi? Kod yozishdan oldin g'oyani bitta varaqqa yozishni o'rganamiz.
- Nishonlaringiz — N/4
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Data Keeper — Database doimiy xotira ekanini topdingiz (4-ekran, 1-savol — birinchi urinishda to'g'ri)
- Request Route — So'rovning to'g'ri yo'lini bildingiz (8-ekran, 2-savol)
- One Backend — Ko'p kirish yo'li, bitta tizim — g'oyani tushundingiz (11-ekran, 3-savol)
- New Door — Tizimga yangi kirish yo'li (mobil) qo'shdingiz (14-ekran, 4-savol)
- Nishon olinganda (butun ekran): <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Database — doimiy saqlash joyi»
   - Database eslab qoladi — Mahsulot, buyurtma va foydalanuvchilar Database'da doimiy saqlanadi.
   - Frontend ko'rsatadi — Sahifa yangilansa, faqat ekranda turgan ma'lumot yo'qoladi.
   - Backend tashiydi — So'rovni tekshirib Database'ga yozadi, lekin o'zi doimiy saqlamaydi.
   - Sinfga savol: Mahsulot va buyurtmalar aslida qayerda saqlanadi?
2. 2-savol (8-ekran) — «So'rovning yo'li»
   - Frontend'dan boshlanadi — Foydalanuvchi tugmani bosadi, Frontend Backend'ga so'rov yuboradi.
   - Backend Database bilan ishlaydi — So'rovni qabul qiladi, Database'ga yozadi yoki o'qiydi.
   - Javob orqaga qaytadi — Natija o'sha yo'l bilan ekranga qaytadi; bizning tizimda Frontend Database'ga to'g'ridan bormaydi.
   - Sinfga savol: «Savatga» bosilganda so'rov qaysi yo'l bilan boradi?
3. 3-savol (11-ekran) — «Ko'p kirish yo'li — bitta tizim»
   - Har biri alohida kirish — Web sayt, Telegram bot, mobil ilova — uch xil kirish yo'li.
   - Markaz bitta — Hammasi bitta Backend va Database'ga ulanadi.
   - Ma'lumot umumiy — Bir joyda berilgan buyurtma boshqasida ham ko'rinadi.
   - Sinfga savol: Web va bot bir xil buyurtmani qanday ko'radi?
4. 4-savol (14-ekran) — «Yangi kirish yo'li — kam ish»
   - Backend tayyor — Backend va Database har qanday kirish yo'li bilan ishlaydi.
   - Mobil — yana bir Frontend — Mobil ilova (React Native) o'sha Backend'ga ulanadi.
   - Arxitektura vaqt tejaydi — Tizimni tushunsangiz, ish ancha kamayadi.
   - Sinfga savol: Mavjud tizimga mobil ilovani qanday qo'shasiz?
5. Yakuniy (15-ekran) — «Ma'lumot yo'li — tartib muhim»
   - Avval foydalanuvchi — U tugmani bosadi.
   - Keyin Backend va Database — So'rov Frontend'dan Backend'ga, undan Database'ga boradi.
   - Oxirida natija — Javob eng oxirida ekranga qaytadi. · Foydalanuvchi → Frontend → Backend → Database → Natija
   - Sinfga savol: Nega bizning tizimda so'rov to'g'ridan Database'ga bormaydi?

## Jonli viktorina (12 savol)
Arena yozuvlari (o'quvchi ko'radigan; emoji olib tashlangan): Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · (jonli) Mentor testni boshlashini kuting… · (mustaqil) ▶ Boshlash · Savol N/12 · (jonli) ✔ Javob qabul qilindi — natijani kuting… · Savol N/12 — natija · +N ball · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling! · (jonli) Siz hozir: N-o'rin · (mustaqil) Keyingi → / Natijani ko'rish · Test yakunlandi! · (mustaqil) N ball · N/12 to'g'ri · eng uzun streak · ↻ Qayta ishlash · (jonli) Siz — N-o'rin · N ball · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · Arenani yopish · (dars tugagan bo'lsa) Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish

1. Mahsulot, buyurtma va foydalanuvchilar qayerda doimiy saqlanadi?
   - ✔ Database'da
   - Frontend'da
   - Backend'da
   - AI'da
2. Frontend asosan nima qiladi?
   - Ma'lumotni doimiy saqlaydi
   - Narx va to'lovni hisoblaydi
   - ✔ Foydalanuvchiga ma'lumotni ko'rsatadi
   - Database'ga to'g'ridan yozadi
3. «Savatga» bosilganda so'rov qaysi yo'l bilan boradi?
   - Frontend → Database, Backend'siz
   - Frontend ichida qoladi
   - ✔ Frontend → Backend → Database, javob orqaga
   - Database → Backend → Frontend
4. Bizning tizimda Frontend nega Database'ga to'g'ridan ulanmaydi?
   - Database juda sekin ishlaydi
   - ✔ Xavfsizlik uchun: Backend orqali o'tadi
   - Ular boshqa tilda yozilgan
   - Buni texnik jihatdan qilib bo'lmaydi
5. Backend'ning asosiy vazifasi nima?
   - Sahifa dizaynini chizadi
   - Foydalanuvchiga to'g'ridan ko'rinadi
   - Faqat matnni tarjima qiladi
   - ✔ Qoidalarni bajaradi, Database'ga yozadi
6. Web sayt va Telegram bot bir xil buyurtmalarni qanday ko'radi?
   - ✔ Bitta Backend va Database'ga ulanadi
   - Har biriga alohida Database quriladi
   - Ma'lumot qo'lda ko'chiriladi
   - Buning umuman iloji yo'q
7. «Ko'p kirish yo'li, bitta tizim» nimani anglatadi?
   - Har kirish yo'liga alohida tizim kerak
   - Bitta kirish yo'li hamma uchun yetadi
   - Faqat web sayt bo'lishi mumkin
   - ✔ Web, bot va mobil bitta Backend'ga ulanadi
8. Database o'chirilsa nima bo'ladi?
   - Hech narsa o'zgarmaydi
   - ✔ Ma'lumot saqlanmaydi, yo'qoladi
   - Faqat sahifa ranglari o'chadi
   - Tizim tezroq ishlay boshlaydi
9. Mavjud tizimga mobil ilova qo'shishning eng oson yo'li?
   - Hammasini noldan qayta yozish
   - ✔ Yangi Frontend yozib, Backend'ga ulash
   - Mobil uchun alohida Database qurish
   - Buning umuman iloji yo'q
10. AI tizimda qanday rol o'ynaydi?
    - Ma'lumotni doimiy saqlaydi
    - Barcha qarorlarni yolg'iz qiladi
    - ✔ Maslahat va tavsiya beradi
    - Sahifani foydalanuvchiga ko'rsatadi
11. Ma'lumot qaysi tartibda yuradi?
    - Database → Backend → Frontend → ekran → foydalanuvchi
    - Backend → Database → Frontend → foydalanuvchi → ekran
    - Frontend → Database → Backend → foydalanuvchi → ekran
    - ✔ Foydalanuvchi → Frontend → Backend → Database → ekran
12. Kod yozishdan oldin arxitekturani chizish nega foydali?
    - ✔ Qaysi qism nima qilishini aniqlaydi
    - Kodni o'zi avtomatik yozib beradi
    - Serverni ancha tezlashtiradi
    - Sahifa dizaynini chiroyli qiladi
