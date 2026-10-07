# 8-dars «Loyiha kuni: prodga ko'tarish — 1-qism» — yakuniy matn

Fayl: `src/8-Modull/ProdUpgradeLesson.jsx` · 12 ekran · Keyingi dars: «Loyiha kuni: prodga ko'tarish — 2-qism»
Holat: 06.10.2026 — kodga mos

## 0 · Kirish — Backend javob bermasa
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: Backend javob bermasa, o'yinchi saytda nimani ko'radi?
- Mentor: Tasavvur qiling: o'yinchi «Maydon»ni ochdi, Backend esa shu payt javob bermayapti. Uch javobdan bittasini tanlang.
- Maket: telefon (Sayt · React `web/`, manzil `maydon-….netlify.app`) — Maydon · ‹ Bugun › · kataklar joyi bo'sh. Telefondan `GET /vaqtlar` so'rovi Backend · NestJS qutisiga boradi va javobsiz qaytadi — qutida: javob yo'q.
- Savol: Sizningcha, qaysi biri?
  - Kataklar chiqadi, hammasi bo'sh ko'rinadi
  - ✔ «Vaqtlarni yuklab bo'lmadi» degan bitta xabar
  - Backend xatosi — kod va inglizcha matn
- Javob izohlari:
  - 2-variant: **Aynan!** Sayt bitta xabar yozadi, lekin qayta urinish tugmasi yo'q — o'yinchi nima qilishni bilmaydi.
  - 1-variant: **Qiziq fikr!** Kataklar Backend'dan keladi — javob bo'lmasa, ular chizilmaydi. Sayt bitta xabar yozadi.
  - 3-variant: **Qiziq fikr!** Sayt texnik matnni o'yinchiga ko'rsatmaydi — bitta xabar yozadi, lekin tugmasiz.
- Javobdan keyin: telefonda qizil qator «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.», ostida tugma bo'lishi kerak bo'lgan bo'sh joy; yonda karta «Maydon · prod ro'yxati»:
  - bor: ✓ HTTPS va `/health` monitoringi · ✓ Uch zaiflik yopilgan, ega kirishida 2FA · ✓ Maxfiylik siyosati va eski ma'lumotni o'chirish
  - bugun: 1 So'rovlar chegarasi · 2 Xato va kutish holatlari (ajralib turadi) · 3 A/B yakuni · 4 README — olti qism
- Tugma: Bittasini tanlang → Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun prod ro'yxatidagi to'rt ishni bajarasiz.
- Mentor: Prod ro'yxati — internetdagi loyihani foydalanuvchilar uchun ishonchliroq qiladigan ishlar ro'yxati. Har amaliyot oxirida shu ishni eng yaxshi loyihangiz uchun ham yozasiz.
- Chap — Dars oxirida: karta «Maydon · prod ro'yxati»
  - bugun (to'rt ish birin-ketin ✓ bo'ladi): So'rovlar chegarasi · Xato va kutish holatlari · A/B yakuni · README — olti qism
  - bor: ✓ HTTPS va `/health` monitoringi · ✓ Uch zaiflik yopilgan, ega kirishida 2FA · ✓ Maxfiylik siyosati va eski ma'lumotni o'chirish
  - keyin: Laptopdagi tekshiruvlar ham sanaladi · Database jadvallari kod bilan o'zi o'zgaradi (`synchronize`)
  - Karta ostida: `prod` tarmog'i · hali birlashtirilmagan
- O'ng — Bugungi 3 qadam:
  1. Backend bir manzildan kelgan ortiqcha so'rovni yozmaydi
  2. Backend kechiksa, sayt o'yinchiga kutishni aytadi
  3. A/B natijasi va README repo'da, `prod` tarmog'ida
- Pastki qator: repo `maydon` · boshlang'ich holat `m10-dars-08-start` · namuna `m10-dars-08-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Backend nechta so'rovni qabul qilsin?
- Eyebrow: Tushuncha · so'rovlar chegarasi
- Sarlavha: Backend bir daqiqada nechta so'rovni qabul qilsin?
- Mentor: Hozir Backend har so'rovni yozadi — ularni hech kim sanamaydi. Uch yo'lga so'rov yuborib, hisoblagichni kuzating.
- Avval o'zingiz belgilab ko'ring: Uchala yo'lga bir xil son qo'yilsinmi? · Ha, bitta son yetadi · Yo'q, har yo'lga o'zi (tanlangach: Taxminingiz — savol va tanlov)
- Chap: telefon (Sayt · React `web/`) — Maydon · ‹ Bugun › · kataklar 16:00 · 17:00 · 18:00 · 19:00 · 20:00 · 21:00
- Tugmalar (o'rtada): Ega kirishi · Band qilish · Sahifani ochish ×10 · ostida: so'rov — bitta IP manzildan
- O'ng: belgi «prod ro'yxati ● ○ ○ ○ So'rovlar chegarasi»; Backend · NestJS qutisi, taymer «bir daqiqa»:
  - `POST /kirish` — 0 / 5
  - `POST /bandlar` — 0 / 10
  - `POST /hodisalar` — 0 / 60
- Har bosishda so'rov yo'lga uchadi, hisoblagich oshadi. Ega kirishi bosilganda telefonda: Maydon · ega · Parol •••••• · Kirish; oltinchi so'rov qizil qaytadi, yo'lda `429`, telefonda: Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring. Band qilishda telefonda 18:00 band; Sahifani ochish bitta bosishda 10 ta so'rov yuboradi. «Bir daqiqa» tugagach hisoblagichlar noldan boshlanadi.
- Joriy qator (birinchi `429` dan keyin): `429` — «juda ko'p so'rov» javobi: Backend so'rovni yozmaydi.
- Natija (uch yo'l sinalgach):
  - ✓ Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: har yo'lga o'z soni — kirishga eng kami: u yerda parol va kod tekshiriladi)
  - `429` — «juda ko'p so'rov» javobi: Backend so'rovni yozmaydi.
  - Bu misolda har yo'lga o'z chegarasi bor: kirish — 5, band — 10, hodisa — 60. Ortig'iga `429`.
  - Chegara odamni emas, IP manzilni sanaydi: bir Wi-Fi'dagi telefonlar bitta manzil bo'lib ko'rinishi mumkin.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Uch yo'lni sinab ko'ring (N/3) → Davom etish

## 3 · Amaliyot 1 — so'rovlar chegarasi
- Eyebrow: Amaliyot 1 · so'rovlar chegarasi
- Sarlavha: Backend ortiqcha so'rovni yozmasdan, `429` qaytarsin.
- Mentor: Uch qatorni o'zingiz yozasiz, namuna «Yordam»da; **«1 · Ochish»**dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da `maydon` papkasini oching. Terminalda `git checkout -b prod` — bugungi o'zgarishlar `prod` tarmog'ida yig'iladi.
     Tarmoq (branch) — repo'dagi alohida yo'l: o'zgarishlar `main` ga tegmasdan shu yerda yig'iladi.
     Keyin ikki terminal: `cd backend`, `npm run start:dev` · `cd web`, `npm run dev`.
  2. **Prompt** — uch qatorni yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity) · Nusxalash:
       > Qayerda: {qayerda}
       > Nima qilsin: {nima qilsin}
       > Nima buzilmasin: {nima buzilmasin}
     - Yordam (bosilsa ochiladi) — namuna talab:
       > Qayerda: Backend'dagi `POST /kirish`, `POST /bandlar`, `POST /hodisalar`; saytda ega kirishi (`/ega`, `/dashboard`) va band formasi.
       > Nima qilsin: bitta IP manzildan bir daqiqada `POST /kirish` ga 5 tadan, `POST /bandlar` ga 10 tadan, `POST /hodisalar` ga 60 tadan ortiq so'rov kelsa, Backend uni yozmasin va `429` bilan «Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring.» qaytarsin; chegara so'rov ishlovidan oldin tekshirilsin. Sayt `429` kelsa, shu matnni ko'rsatsin.
       > Render'da so'rov proksi orqali keladi — IP manzilni `CF-Connecting-IP` sarlavhasidan olsin, sarlavha bo'lmasa `req.ip` dan.
       > Nima buzilmasin: boshqa yo'llar chegarasiz qolsin; `409` «Bu vaqt band», parol va 6 xonali kod tekshiruvi, hodisalar. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — Antigravity o'zgargan fayllarni aytadi: ular `backend/` va `web/` ichida bo'lsin. Backend terminali o'zi qayta yukladi, xato yo'q.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — o'z saytingizda, laptopda:
     (1) `localhost:5173/ega` — noto'g'ri parol bilan «Kirish»ni 6 marta bosing: besh marta «Parol noto'g'ri», oltinchisida «Juda ko'p urinish…».
     (2) Bir daqiqa kuting — to'g'ri parol va kod bilan kirish yana ishlaydi.
     (3) `localhost:5173` da bitta bo'sh vaqtni band qiling — band odatdagidek saqlanadi.
     Keyin `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil bo'lsin; shularni `git add` bilan qo'shing va `git commit -m "so'rovlar chegarasi"`. Mos kelmagan qatorni uch qism bilan agentga yozing.
  5. **O'z g'oyangiz** — eng yaxshi loyihangizni tanlang (ko'pincha o'tgan modulda boshlagan MVP). Unda qaysi yo'llar yozadi yoki parol tekshiradi? Shularga chegara talabini yozing.
     Forma: Loyiha nomi: … · Qayerda: … · Nima qilsin: … · Nima buzilmasin: … · Nusxalash (hammasi yozilgach ochiladi; «Bajardim» ham)
- O'ng — kutilgan natija · namuna: Maydon:
  - Belgi: prod ro'yxati ● ○ ○ ○ ✓ So'rovlar chegarasi
  - Brauzer `localhost:5173/ega`: Maydon · ega · Parol •••••• · Kirish · qizil qator: Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring.
  - Backend · NestJS: `POST /kirish` 5 / 5 · 429 · `POST /bandlar` 1 / 10 · `POST /hodisalar` 3 / 60
- Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-08-start` · `git checkout -b prod`
- Hammasi bajarilgach (yashil): Ortiqcha so'rovga Backend `429` beradi, odatdagi band esa saqlanadi. — Chegara laptopda tekshirildi; Render'dagi manzil sanog'i birlashtirilgandan keyin tekshiriladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: `POST /kirish` ga daqiqada 5 ta chegara. Oltinchi so'rovga Backend nima qaytaradi?
  - `401` — parol noto'g'ri, qayta kiriting
  - `409` — bu vaqt band, boshqasini tanlang
  - ✔ `429` — ko'p so'rov keldi, kutib turing
  - `400` — ism yozilmagan, formani to'ldiring
- Javob izohlari:
  - To'g'ri: Chegaradan oshgan so'rov tekshirilmaydi ham, yozilmaydi ham.
  - 1-variant: `401` parol tekshirilganda chiqadi. Oltinchisi-chi?
  - 2-variant: `409` band qilishda chiqadi — bu kirish yo'li.
  - 4-variant: `400` ma'lumot xato bo'lganda chiqadi — so'rov soni-chi?
- Jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · ✓ To'g'ri javob: C — `429` — ko'p so'rov keldi, kutib turing
- Mustaqil: To'g'ri · Qaytadan urinib ko'ring · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 5 · Backend kechiksa, o'yinchi nimani ko'radi?
- Eyebrow: Tushuncha · xato holatlari
- Sarlavha: Backend kechiksa, o'yinchi nima qilishini biladimi?
- Mentor: Ikki telefon bir xil holatga tushadi: chapdagisi hozirgi sayt, o'ngdagisi — prod ro'yxati bo'yicha. Backend holatini tanlab, ikkalasini solishtiring.
- Avval o'zingiz belgilab ko'ring: Backend 50 soniya kechiksa, hozirgi sayt nima qiladi? · Xabar yozib, o'zi qayta so'raydi · «Yuklanmoqda…» deb turaveradi · Sahifani o'zi yangilaydi (tanlangach: Taxminingiz — savol va tanlov)
- Chap: ikki telefon — Hozir · Prod (Maydon · ‹ Bugun › · kataklar), ostida soniya taymeri (N s); har telefon ostida uch belgi (Hozir — ✗, Prod — ✓)
- O'ng: Backend · NestJS qutisi — Backend holati:
  - Backend kechikmoqda (50 soniya)
  - Backend javob bermayapti
  - Juda ko'p urinish (`429`)
- Holatlar:
  - Backend kechikmoqda → qutida: javob kechikmoqda. Hozir: Yuklanmoqda… (50 soniya). Prod: 5-soniyada «Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» 50-soniyada qutida: so'rov o'tdi — ikkalasida kataklar.
  - Backend javob bermayapti → qutida: javob yo'q. Hozir: darhol «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.» Prod: «Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.», har 5 soniyada so'rov qayta ketadi; bir daqiqadan keyin «Vaqtlarni yuklab bo'lmadi» va «Qayta urinish» tugmasi.
  - Juda ko'p urinish → band formasi (18:00 · Ism: Ali · Telefon: +998 90 000 00 01 · Band qilish), qutida: 429. Hozir: «Band qilib bo'lmadi. Birozdan keyin urinib ko'ring.» Prod: «Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring.», ism va telefon joyida.
- Natija (uch holat ko'rilgach):
  - ✓ Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: hozirgi sayt «Yuklanmoqda…» deb turaveradi)
  - Kutishni yoki xatoni o'yinchiga aytish — kutish va xato holatlari.
  - Prod saytda o'yinchi kutishni ham, xatoni ham ko'radi va keyin nima qilishni biladi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Uch holatni tanlang (N/3) → Davom etish

## 6 · Amaliyot 2 — xato holatlari
- Eyebrow: Amaliyot 2 · xato holatlari
- Sarlavha: Backend kechiksa, sayt o'yinchiga kutishni aytsin.
- Mentor: Uch qatorni o'zingiz yozasiz, namuna «Yordam»da; **«1 · Ochish»**dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — ikkala terminal ishlayapti, siz `prod` tarmog'idasiz (`git branch` — `* prod`). `localhost:5173` da kataklar chiqadi.
  2. **Prompt** — uch qatorni yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity) · Nusxalash:
       > Qayerda: {qayerda}
       > Nima qilsin: {nima qilsin}
       > Nima buzilmasin: {nima buzilmasin}
     - Yordam (bosilsa ochiladi) — namuna talab:
       > Qayerda: o'yinchi sahifasi (`web/`) — kataklarni yuklash (`GET /vaqtlar`) va band formasi (`POST /bandlar`).
       > Nima qilsin: javob 5 soniyada kelmasa yoki so'rov o'tmasa, «Yuklanmoqda…» o'rniga «Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» chiqsin. So'rov o'tmasa — 5 soniyadan keyin qayta so'rasin; oldingi so'rov tugamasdan yangisi ketmasin. Bir daqiqadan keyin ham bo'lmasa — «Vaqtlarni yuklab bo'lmadi» va «Qayta urinish» tugmasi. Band formasi xato bersa, yozilgan ism va telefon o'chmasin.
       > Nima buzilmasin: kataklar, band qilish, «Bu vaqt band» va «Juda ko'p urinish» xabarlari, hodisalar va animatsiyalar. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — sayt o'zi yangilandi, terminalda xato yo'q.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Brauzerda tekshirish** — bu tekshiruvda Backend umuman javob bermaydi; kechikish holatini ikki telefonli sahnada ko'rdingiz. Backend terminalida Ctrl+C bosing (Backend to'xtaydi) va `localhost:5173` ni yangilang:
     (1) «Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» chiqadi.
     (2) Shu daqiqa ichida Backend'ni qayta yoqing: `npm run start:dev` — sahifani yangilamasangiz ham kataklar o'zi chiqadi.
     (3) Backend'ni yana to'xtating, sahifani yangilang va bir daqiqa kuting — «Vaqtlarni yuklab bo'lmadi» va «Qayta urinish». Backend'ni yoqib, tugmani bosing — kataklar chiqadi.
     Keyin `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil bo'lsin; shularni `git add` bilan qo'shing va `git commit -m "xato holatlari"`. Mos kelmasa — ko'rganingizni uch qism bilan agentga yozing.
  5. **O'z g'oyangiz** — loyihangizda Backend kechiksa, foydalanuvchi nimani ko'radi? U nima qilishni bilishi uchun talab yozing. Uch qatorni to'ldiring.
     Forma: Qayerda: … · Nima qilsin: … · Nima buzilmasin: … · Nusxalash (hammasi yozilgach ochiladi; «Bajardim» ham)
- O'ng — kutilgan natija · namuna: Maydon:
  - Belgi: prod ro'yxati ● ● ○ ○ ✓ Xato va kutish holatlari
  - Ikki telefon: 1 — Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin. · 2 — Vaqtlarni yuklab bo'lmadi · Qayta urinish
  - Terminal (Backend · terminal):
```
^C
$ npm run start:dev
Nest application successfully started
```
- Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-08-done` · `git checkout -b prod`
- Hammasi bajarilgach (yashil): Backend to'xtasa, o'yinchi kutishni, keyin «Qayta urinish»ni ko'radi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Backend javob bermayapti. Prod ro'yxatiga mos sayt nima qiladi?
  - ✔ Kutishni aytadi va o'zi qayta so'raydi
  - «Failed to fetch» xatosini ko'rsatadi
  - Hamma kataklarni bo'sh qilib chizadi
  - Sahifani har soniyada qayta yuklab turadi
- Javob izohlari:
  - To'g'ri: O'yinchi holatni biladi, sayt esa o'zi qayta urinadi.
  - 2-variant: Texnik matn o'yinchiga nima qilishni aytadimi?
  - 3-variant: Bo'sh kataklarni bosgan o'yinchi band qila oladimi?
  - 4-variant: Har soniyalik yuklash Backend'ga ortiqcha so'rov yuboradi.
- Jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · ✓ To'g'ri javob: A — Kutishni aytadi va o'zi qayta so'raydi
- Mustaqil: To'g'ri · Qaytadan urinib ko'ring · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 8 · Amaliyot 3 — A/B yakuni va README
- Eyebrow: Amaliyot 3 · A/B yakuni va README
- Sarlavha: A/B sonlarini sanab, qarorni README ga yozing.
- Mentor: B ishga tushgandan beri sonlarni Neon'da o'zingiz sanaysiz, qaror va README talabini ham o'zingiz yozasiz. **«1 · Ochish»**dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish — sonlar** — Neon'dagi SQL Editor'da (dashboard faqat bugunni ko'rsatadi) — «Nusxalash»:
     - Karta: Neon · SQL Editor · Nusxalash
```sql
SELECT variant,
       COUNT(DISTINCT brauzer_id) FILTER (WHERE nom = 'vaqt-tanladi') AS tanladi,
       COUNT(DISTINCT brauzer_id) FILTER (WHERE nom = 'band-qildi')  AS band_qildi
FROM hodisalar
WHERE variant IS NOT NULL AND brauzer_id <> 'tekshiruv'
GROUP BY variant
ORDER BY variant;
```
     Ikki qator chiqadi: har variantda vaqtni tanlagan va band qilgan turli brauzerlar soni — B ishga tushgandan beri. Foizni hisoblang: band qildi / tanladi.
     Laptopdagi tekshiruvlaringiz ham shu sonlarda bor — bu prod ro'yxatidagi «keyin» ishi.
  2. **Prompt** — uch qatorni yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity) · Nusxalash:
       > Qayerda: {qayerda}
       > Nima qilsin: {nima qilsin}
       > Nima buzilmasin: {nima buzilmasin}
     - Yordam (bosilsa ochiladi) — namuna talab:
       > Qayerda: o'yinchi sahifasidagi tugma matni va variant tanlash, `/dashboard` dagi A/B qismi (`web/`), `README.md`.
       > Nima qilsin: hamma o'yinchiga B matni chiqsin («18:00 ni band qilish»); variant endi tanlanmasin, yangi hodisalarga `variant` qo'shilmasin. Dashboard'da A va B o'rniga bitta foiz: bugun vaqtni tanlaganlardan band qilganlar. README ni to'ldir: ishga tushirish, `.env` nomlari (qiymatsiz), so'rovlar chegarasi, xato holatlari, A/B natijasi va qaror (foiz — shu oqimda vaqt tanlaganlardan band qilganlar), prod ro'yxati — qilingan va qolgan ishlar.
       > Nima buzilmasin: `hodisalar` jadvali va eski `variant` qiymatlari, Backend yo'llari, chegara va xato holatlari. Maxfiy kalitlarning qiymati README ga yozilmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — sayt o'zi yangilandi, xato yo'q. Keyin `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil bo'lsin; shularni `git add` bilan qo'shing, `git commit -m "A/B yakuni va README"`, `git push -u origin prod`.
     Bizning sozlamada Render va Netlify `main` dan oladi — internetdagi sayt o'zgarmaydi, `prod` hali birlashtirilmagan.
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish**
     (1) inkognito oynada `localhost:5173` — bo'sh katakni bosing: tugmada «… ni band qilish», soat bilan.
     (2) `localhost:5173/dashboard` — bitta foiz, A va B yo'q.
     (3) GitHub'da repo'ngiz → `prod` tarmog'i → `README.md`: oltita qism bor, `.env` qiymatlari yo'q — faqat nomlari.
  5. **O'z g'oyangiz** — loyihangizning prod ro'yxatini yozing: bugungi uch ish, audit natijangizdan qolgan ishlar va 4-darsdagi gipotezangiz natijasi. Uni README talabiga qo'shing.
     Forma: Loyiha: {1-amaliyotdagi loyiha nomi} · Bugungi ishlar: … · Audit natijangizdan: {6-darsda «tuzatish kerak» bo'lgan savollar} (bo'lmasa — Qolgan ishlar: …) · Gipotezangiz: «Agar {agar}, {o'zgaradi}, chunki {chunki}» · Natijasi: … (gipoteza bo'lmasa — Gipoteza va natijasi: …) · Nusxalash (hammasi yozilgach ochiladi; «Bajardim» ham)
- O'ng — kutilgan natija · namuna: Maydon (qadamga ergashadi; tugmalar: 1 Sonlar · 2 README · 3 Prod ro'yxati):
  - 1 Sonlar — Neon · SQL Editor:

    | variant | tanladi | band_qildi |
    |---|---|---|
    | A | 42 | 12 |
    | B | 40 | 17 |

    A — vaqt tanlagan 42 brauzerdan 12 tasi band qildi · taxminan 29 foiz
    B — 40 tadan 17 tasi · taxminan 43 foiz
    Mentor: Hozircha B qoladi. Farq bor, lekin 82 ta brauzer hali kam — raqamni kuzatib boramiz.
    Bu mahsulot qarori — B yaxshiroq ekanini isbotlamaydi.
  - 2 README — `maydon / README.md` · `prod`: # Ishga tushirish · # Maxfiy kalitlar (`.env`) · # So'rovlar chegarasi · # Xato holatlari · # A/B natijasi · # Prod ro'yxati
  - 3 Prod ro'yxati — karta «Maydon · prod ro'yxati»: bugungi to'rt ish ✓ (So'rovlar chegarasi · Xato va kutish holatlari · A/B yakuni · README — olti qism); bor — uch ish ✓; keyin: Laptopdagi tekshiruvlar ham sanaladi · Database jadvallari kod bilan o'zi o'zgaradi (`synchronize`)
    Izoh: Hozir jadval kodga qarab o'zi o'zgaradi. Shuning uchun eski tegdagi kodni prodga yubormaysiz — yangi ustun o'chib ketishi mumkin.
- Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-08-done` · `git checkout -b prod`
- Hammasi bajarilgach (yashil): Hozircha B qoldi, raqam kuzatiladi; README'da olti qism, hammasi `prod` tarmog'ida.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 9 · Natijalar (podium) — jonli reyting

## 10 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.
- Kartochkalar — «Kartochkalar» bo'limida (12 ta); birinchi bosishgacha ostida: Kartani bosing — javob ochiladi
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun
- Eyebrow: Yakun
- Belgi: ✓ Loyiha kuni tugadi · N/2 to'g'ri
- Sarlavha: «Maydon» prod ro'yxati bo'yicha yaxshilandi.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Endi siz bilasiz — «Yakun» bo'limidagi 4 qator
- Nishonlaringiz — N/3 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Keyingi dars qatori — «Yakun» bo'limida
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- **Rate Guard** — Ortiqcha so'rovga Backend javobini topdingiz (4-ekran, 1-savol, birinchi urinishda)
- **Clear Status** — Backend kechikkanda sayt nima qilishini tanladingiz (7-ekran, 2-savol, birinchi urinishda)
- **Prod Builder** — Uch amaliyot blokini oxirigacha bajardingiz (8-ekran, 3-amaliyotning oxirgi «Bajardim»i, bonus)
- Nishon olinganda: Yangi nishon · <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Har yo'lga o'z chegarasi»
   - `POST /kirish · 5` · Kirish — Bir daqiqada bir manzildan 5 ta so'rov, oltinchisi yozilmaydi.
   - `429` · Juda ko'p so'rov — Backend so'rovni tekshirmaydi ham, yozmaydi ham.
   - `POST /hodisalar · 60` · Hodisalar — Har ochish va bosish hodisa, shuning uchun chegara kengroq.
   - Sinfga savol: Nega uchala yo'lga bir xil son qo'yilmadi?
2. 2-savol (7-ekran) — «Kutishni aytadi, o'zi qayta so'raydi»
   - `5 s` · Kutish — Javob 5 soniyada kelmasa, sayt kutishni aytadi.
   - `5 s` · Qayta so'rash — So'rov o'tmasa, sayt o'zi qayta urinadi — oldingisi tugagach.
   - `Qayta urinish` · Tugma — Bir daqiqadan keyin ham bo'lmasa, o'yinchi o'zi bosadi.
   - Sinfga savol: «Yuklanmoqda…» deb turaveradigan sayt o'yinchiga nimani aytmaydi?

## Jonli viktorina (12 savol)
Lobby: CODE STRIKE · 12 SAVOL · 15 SONIYA · Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!
1. Prod ro'yxati nima?
   - ✔ Loyihani ishonchliroq qiladigan ishlar ro'yxati
   - MVP'ga keyinroq qo'shiladigan funksiyalar ro'yxati
   - Saytdagi hamma sahifalar manzilining ro'yxati
   - Bugun maydonda band qilingan vaqtlar ro'yxati
2. So'rovlar chegarasi nimani sanaydi?
   - Bugun saytga kirgan hamma odamlar sonini
   - ✔ Bir manzildan bir daqiqadagi so'rovlarni
   - Database'dagi barcha jadvallar qatorlarini
   - Har o'yinchining band qilgan vaqtlarini
3. Chegaradan oshgan so'rovga Backend nima qaytaradi?
   - `401` — parol noto'g'ri, qayta kiriting
   - `409` — bu vaqt band, boshqasini tanlang
   - ✔ `429` — ko'p so'rov keldi, kutib turing
   - `400` — ism yozilmagan, formani to'ldiring
4. Chegara nega saytda emas, Backend'da qo'yiladi?
   - Sayt kodi Backend'dan sekinroq ishlaydi
   - Saytda chegara uchun joy qolmagan
   - Backend kodini o'quvchi o'zgartira olmaydi
   - ✔ Hamma so'rov Backend'dan o'tadi
5. «Maydon» da qaysi yo'lga eng qattiq chegara?
   - ✔ `POST /kirish` — parol va kod tekshiriladi
   - `POST /hodisalar` — hodisa ko'p yuboriladi
   - `GET /vaqtlar` — kataklar ko'p so'raladi
   - `POST /bandlar` — band ko'p qilinadi
6. Bir Wi-Fi'dagi o'nta telefon Backend'ga qanday ko'rinishi mumkin?
   - Har biri o'z brauzer ID si bilan
   - ✔ Bitta IP manzildan kelgandek
   - Har biri alohida Render orqali
   - Netlify saytining manzilidan
7. Backend 50 soniya kechiksa, prod sayt nima qiladi?
   - «Yuklanmoqda…» deb jim turaveradi
   - Kataklarni hammasini bo'sh chizadi
   - ✔ Kutishni aytib, o'zi qayta so'raydi
   - Sahifani har soniyada qayta yangilab turadi
8. Bir daqiqadan keyin ham javob bo'lmasa, nima chiqadi?
   - Backend xatosining to'liq matni
   - Bo'sh oq sahifa, hech qanday yozuv
   - «Band qilindi» belgisi, kataklarsiz
   - ✔ Xabar va «Qayta urinish» tugmasi
9. `429` kelsa, band formasidagi ism va telefon-chi?
   - ✔ Joyida qoladi, qayta yozish shart emas
   - O'chadi, o'yinchi ikkalasini qayta yozadi
   - Egaga yuboriladi, band baribir saqlanadi
   - Ertangi kunning formasiga ko'chiriladi
10. A — 42 tadan 12, B — 40 tadan 17. Qaysi biri qoladi?
    - A — vaqt tanlaganlar ko'proq
    - ✔ B — band qilganlar foizi kattaroq
    - A — hozirgi variant, o'zgartirmaymiz
    - B — yangi tugma chiroyliroq ko'rinadi
11. Nega «B aniq yaxshi» deb xulosa qilinmaydi?
    - Foiz A da kattaroq chiqdi
    - Dashboard faqat bugunni ko'rsatadi
    - ✔ 82 ta brauzer xulosa uchun hali kam
    - SQL sonlari noto'g'ri sanaldi
12. «Maydon» sozlamasida `prod` push qilindi. Internetdagi sayt-chi?
    - Bir necha daqiqada `prod` holatiga o'tadi
    - Render uxlab qoladi — sayt ochilmaydi
    - Netlify `prod` ni alohida manzilda chiqaradi
    - ✔ O'zgarmaydi — u `main` dan yangilanadi
- Arena yozuvlari: Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · O'quvchilar kutilmoqda… · Mentor testni boshlashini kuting… · ▶ Boshlash · Savol N/12 · Javob qabul qilindi — natijani kuting… · Savol N/12 — natija · +N ball · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling! · Siz hozir: N-o'rin · Keyingi → · Natijani ko'rish · Test yakunlandi! · ball · N/12 to'g'ri · eng uzun streak xN · ↻ Qayta ishlash · Siz — N-o'rin · N ball · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish · Arenani yopish

## Kartochkalar
Oyna: hisoblagichlar ↻ O'rganilmoqda · N · ✓ Bildim · N. Tugmalar: ✗ Takrorlash · ✓ Bildim.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Prod ro'yxati nima? | Internetdagi loyihani foydalanuvchilar uchun ishonchliroq qiladigan ishlar ro'yxati | «Maydon» da bugun — to'rt ish |
| So'rovlar chegarasi nima? | Bir IP manzildan bir daqiqada nechta so'rov qabul qilinishi | Inglizcha — rate limit |
| Chegaradan oshgan so'rovga Backend nima qaytaradi? | 429 — juda ko'p so'rov | So'rov yozilmaydi |
| «Maydon» da kirish chegarasi nega eng qattiq? | Bu yo'lda parol va kod tekshiriladi | Kirish — 5, band — 10, hodisa — 60 |
| Chegara nega Backend'da qo'yiladi? | Hamma so'rov Backend'dan o'tadi | Band tekshiruvi kabi — Backend tekshiradi |
| Chegara nimani sanaydi — odamnimi, manzilnimi? | IP manzilni | Bir Wi-Fi'dagi telefonlar bitta manzil bo'lib ko'rinishi mumkin |
| Kutish holatida o'yinchi nimani ko'radi? | Kutishni aytadigan xabarni | So'rov o'tmasa, sayt qayta so'raydi — ustma-ust emas |
| Bir daqiqadan keyin ham javob bo'lmasa-chi? | «Qayta urinish» tugmasi chiqadi | O'yinchi keyin nima qilishni biladi |
| Band formasi xato bersa, ism va telefon nima bo'ladi? | Joyida qoladi | O'yinchi qayta yozmaydi |
| A/B natijasi bu misolda qanday? | A ≈ 29 foiz, B ≈ 43 foiz | Vaqt tanlagan 42 va 40 brauzer |
| Nega B qolsa ham «xulosa» deyilmaydi? | 82 ta brauzer hali kam | Hozircha B qoladi — mahsulot qarori, isbot emas |
| O'zgarishlar nega `prod` tarmog'ida turadi? | main ga tegmasdan yig'ilishi uchun | Bizning sozlamada internetdagi sayt `main` dan yangilanadi |

- Hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash

## Yakun
- Endi siz bilasiz:
  - Prod ro'yxati — internetdagi loyihani foydalanuvchilar uchun ishonchliroq qiladigan ishlar ro'yxati.
  - Bu misolda har yo'lga o'z chegarasi bor, ortiqcha so'rovga Backend `429` qaytaradi.
  - Backend kechiksa, sayt o'yinchiga kutishni aytadi va o'zi qayta so'raydi — ustma-ust emas.
  - Bu A/B da farq bor, lekin 82 ta brauzer xulosa uchun hali kam: hozircha B qoladi, raqam kuzatiladi.
- Keyingi dars — **«Loyiha kuni: prodga ko'tarish — 2-qism»**: `prod` tarmog'ini Pull Request bilan ko'rsatasiz, sinfdosh kodni o'qib izoh yozadi.
- Uyga vazifa yo'q.
