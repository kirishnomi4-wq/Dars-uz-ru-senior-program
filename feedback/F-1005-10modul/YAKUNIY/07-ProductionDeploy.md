# 7-dars «Production deploy: domen, SSL, monitoring» — yakuniy matn

Fayl: `src/8-Modull/ProductionDeployLesson.jsx` · 18 ekran (12 dars ekrani + 3 amaliyot bloki + podium, takrorlash, yakun) · Keyingi dars: «Loyiha kuni: prodga ko'tarish — 1-qism»
Holat: 06.10.2026 — kodga mos

## 0 · Kirish
- Eyebrow: Dars · kirish
- Sarlavha: «Maydon» kechasi yiqilsa, buni birinchi kim biladi?
- Mentor: O'yinchilar «Maydon»ni kechasi ham ochadi, siz esa uxlaysiz. Tunni boshlang va soatga qarang.
- Tepada — soat va tun chizig'i: 22:00 … 08:00; chiziq ustida tugma: ▶ Tunni boshlang
- Ostida uch qism yonma-yon:
  - O'yinchi telefoni — yorliq «Sayt · Netlify» `maydon-x7k2p9`; manzil `maydon-x7k2p9.netlify.app`; sahifa: Maydon · Bugun · 16:00 · 17:00 · 18:00 · 19:00 · 20:00 · 21:00
  - Backend · Render → Database · Neon
  - Sizning telefoningiz — soat, «Yangi xabar yo'q»
- Tugma bosilgach soat yuradi; 23:10 da Backend · Render qizil — «javob bermayapti», soat to'xtaydi va savol ochiladi (shu paytgacha xira).
- Savol: Buni birinchi kim biladi?
  - Siz — telefoningizga xabar keladi
  - ✔ Ertalab saytni ochgan o'yinchi
  - Maydon egasi — bandlar ro'yxatidan
- Javobdan keyin soat 07:40 gacha yuradi, o'yinchi telefonida: Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring. Sizning telefoningiz jim («Yangi xabar yo'q»), ostida uzuq chiziqli bo'sh joy.
- Javob izohlari:
  - 2-variant: **Aynan!** Bu misolda «Maydon»ni hech narsa kuzatmayapti. Xatoni birinchi bo'lib ertalab sayt ochgan o'yinchi ko'radi.
  - 1-variant: **Qiziq fikr!** Bu misolda telefoningizga xabar yuboradigan hech narsa yo'q — u jim qoladi.
  - 3-variant: **Qiziq fikr!** Ega sahifasi ham o'sha Backend'dan so'raydi — ega ham uni ochgandagina ko'radi.
- Tugma: Tunni boshlang → Bittasini tanlang → Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun «Maydon»ga nom, HTTPS va monitoring berasiz.
- Mentor: Internetdagi «Maydon»ni o'yinchilar ishlatadi — bu production, qisqasi prod. Dars oxirida u yiqilsa, ogohlantirish sizga keladi.
- Chap yorliq: Dars oxirida — «Maydon» shunday ishlaydi
- Chap — maket bir marta o'zi o'ynaydi:
  - O'yinchi telefoni: «Sayt · Netlify» `maydon-mahalla` · `https://maydon-mahalla.netlify.app` — kataklar chiqadi
  - Backend · Render (`GET /` · `GET /health`) — ✓; bir lahza ✕
  - UptimeRobot — saytlarni kuzatadigan xizmat: Maydon · sayt (`maydon-mahalla.netlify.app`) — Up · Maydon · /health (`maydon-….onrender.com/health`) — Up, bir lahza Down
  - Sizning telefoningiz 23:15 — ilova: Down · Maydon · /health; keyin qator yana Up
- O'ng — 4 qadam:
  - 01 · Saytga eslab qoladigan nom · domen
  - 02 · Ulanish shifrlanganini tekshirish · SSL
  - 03 · Backend o'z holatini aytadi · /health
  - 04 · Yiqilsa, ogohlantirish keladi · monitoring
- Qator: Bepul rejalar uzluksiz ishlashni va'da qilmaydi: Render bepul xizmatni prod uchun tavsiya qilmaydi.
- Pastki qator: repo `maydon` · boshlanish `m10-dars-07-start` · tayyor namuna `m10-dars-07-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Sayt nomi va WEB_ORIGIN
- Eyebrow: Tushuncha · sayt nomi
- Sarlavha: Tasodifiy manzil o'rniga qanday nom qo'yasiz?
- Mentor: Manzil boshidagi nomni Netlify o'zi tanlagan — o'yinchi uni eslab qololmaydi. Yangi nom yozing va saytni telefonda oching.
- Avval o'zingiz belgilab ko'ring: Nom o'zgargach, saytda vaqt kataklari chiqadimi?
  - Ha, hammasi avvalgidek ishlaydi
  - Yo'q, yana nimadir yangilanadi
- Tanlangach ixcham qator: Taxminingiz · savol · tanlov (natijagacha turadi)
- Maket: o'yinchi telefoni (`https://maydon-x7k2p9.netlify.app`) → `GET /vaqtlar` → app.netlify.com kartasi → Backend · Render → Database · Neon
  - Netlify kartasi: Yangi nom yozing (1/3) · Project name — maydon-x7k2p9 (ipucha `maydon-…`) · Saqlash
  - Noto'g'ri belgi yozilsa: Faqat kichik lotin harf, raqam va chiziqcha.
  - Backend · Render: `WEB_ORIGIN` · `https://maydon-x7k2p9.netlify.app` (bosiladi) · `GET /` · `GET /health`
- Qadamlar:
  1. Yangi nom yozing → «Saqlash» — telefon manzili yangi nomga almashadi. Joriy qator: Nom o'zgarsa, manzil ham o'zgaradi.
  2. Saytni oching (2/3, telefon ostidagi tugma) — sahifada «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.»; Backend · Render qizil — «ruxsat ro'yxatida yo'q». Joriy qator: Backend'ning ruxsat ro'yxatida (CORS) hali eski manzil turibdi.
  3. `WEB_ORIGIN` ni yangilang (3/3; telefon ostidagi tugma yoki Render'dagi `WEB_ORIGIN` qatori) — qiymat yangi manzilga almashadi, tugunda «deploy…», keyin «✓ 200», telefonda kataklar chiqadi.
- Natija bloki:
  - Taxminingiz: … · haqiqatda: `WEB_ORIGIN` yangilangach chiqdi (to'g'ri bo'lsa: ✓ Taxminingiz to'g'ri chiqdi)
  - Netlify nomi o'zgarsa, manzil ham o'zgaradi. Yangi manzil Render'dagi `WEB_ORIGIN` ga yoziladi.
  - Bu manzil bepul: `….netlify.app` ning boshini o'zingiz tanlaysiz.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish

## 3 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: Netlify'da sayt nomini o'zgartirdingiz. Yana nimani yangilaysiz?
  - Netlify'dagi `VITE_API_URL` qiymatini
  - ✔ Render'dagi `WEB_ORIGIN` qiymatini
  - Render'dagi `DATABASE_URL` qiymatini
  - Saytdagi `api.js` faylidagi manzilni
- Javob izohlari:
  - To'g'ri: `WEB_ORIGIN` — Backend ruxsat beradigan sayt manzili; u yangi nom bilan bir xil bo'lsin.
  - A: `VITE_API_URL` — Render manzili, u o'zgarmadi.
  - C: `DATABASE_URL` — Neon manzili, sayt nomiga bog'liq emas.
  - D: `api.js` Render manzilini oladi — u o'zgarmadi.
  - Boshqa holatda: Backend ruxsat beradigan manzil yangilanadi.
- Test ekranlarining umumiy yozuvlari (3, 5, 7 va 9-ekranlarda bir xil):
  - Natija: To'g'ri · Qaytadan urinib ko'ring · (jonli darsda) Javobingiz qabul qilindi → Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <variant>
  - Jonli darsda savol ostida: Jonli dars — bitta urinish, o'ylab bosing!
  - Xato javobdan keyin havola: Qisqa takrorlash — mavzuni yana bir ko'rish
  - Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish · Mentor o'tmagan bo'lsa (izoh): Mentor hali bu sahifaga o'tmadi

## 4 · HTTPS va SSL
- Eyebrow: Tushuncha · HTTPS
- Sarlavha: Telefon raqami Backend'ga yetguncha kim ko'ra oladi?
- Mentor: O'yinchi bepul Wi-Fi'dan ham band qilishi mumkin — unda so'rov begona tarmoqdan o'tadi. Ikki xil manzil bilan yuborib, Wi-Fi tugunida nima ko'rinishiga qarang.
- Avval o'zingiz belgilab ko'ring: `https://` bilan yuborilsa, Wi-Fi telefon raqamini ko'radimi?
  - Ha, ko'radi
  - Yo'q, ko'rmaydi
- Maket: o'yinchi telefoni (manzil `http://maydon-mahalla.netlify.app`, yonida kulrang yorliq «faraz»; forma: 18:00 · Ism — Ali · Telefon — +998 90 000 00 01 · Band qilish) → bepul Wi-Fi → Backend · Render
- Qadamlar (telefon ostidagi tugma, N/3):
  1. `http://` bilan yuboring — `POST /bandlar` ochiq yuradi; bepul Wi-Fi tugunida: `ism: Ali · telefon: +998 90 000 00 01`
  2. `https://` bilan yuboring — konvert qulfli yuradi; Wi-Fi tugunida: `k3#9Qz…`; Backend'ga ma'lumot to'liq yetadi. Joriy qator: Yo'lda o'qib bo'lmaydigan ko'rinishga aylantirish — shifrlash. Shifrlangan ulanish HTTPS deyiladi.
  3. Manzil chetidagi belgini bosing — panel: Connection is secure · sertifikat: `*.netlify.app`
- Natija bloki:
  - Taxminingiz: … · haqiqatda: ko'rmaydi (to'g'ri bo'lsa: ✓ Taxminingiz to'g'ri chiqdi)
  - HTTPS ni yoqadigan, shu manzil uchun berilgan hujjat — SSL sertifikati.
  - HTTPS bilan ma'lumot yo'lda shifrlangan. Netlify'ning `*.netlify.app` manzilida u o'zi yoqilgan.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish

## 5 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: «Maydon» HTTPS bilan ochiladi. Bu nimani bildiradi?
  - Saytda bironta zaiflik qolmaganini
  - Sayt egasi ishonchli odam ekanini
  - Backend kechasi yiqilmasligini
  - ✔ Ma'lumot yo'lda shifrlanganini
- Javob izohlari:
  - To'g'ri: HTTPS yo'ldagi ma'lumotni shifrlaydi — saytning o'zini tekshirmaydi.
  - A: Zaiflik kodda yopiladi — HTTPS uni ko'rmaydi.
  - B: HTTPS ulanishni himoya qiladi, egasini tekshirmaydi.
  - C: Backend kechasi yiqilsa ham, manzil `https://` qoladi.
  - Boshqa holatda: HTTPS yo'ldagi ma'lumotni himoya qiladi.
- Umumiy yozuvlar — 3-ekrandagidek.

## 6 · /health — nega Database'ni so'ramaydi
- Eyebrow: Tushuncha · Backend holati
- Sarlavha: `/health` Database'ni ham so'rasa, nima bo'ladi?
- Mentor: UptimeRobot `/health` ni har 5 daqiqada so'raydi. Kalitni tanlab, oy davomida bepul Database'ga nima bo'lishiga qarang.
- Avval o'zingiz belgilab ko'ring: Har 5 daqiqada Database ham so'ralsa, bepul Neon oy oxirigacha yetadimi?
  - Ha, yetadi
  - Yo'q, oy tugamasdan to'xtaydi
- Maket: o'yinchi telefoni (kataklar), ostida tugma «Oyni boshlang» (N/2) → Backend · Render (`GET /health`; ikki kalit: `/health` Database'ni ham so'raydi · Faqat Backend javob beradi) → Database · Neon
  - Database tugunida: soddalashtirilgan hisob · 30 kunlik kalendar · chiziq · uyg'oq soatlar · N soat · bepul limit ≈ 400 soat
- Ikki holat (har biri bir marta):
  1. `/health` Database'ni ham so'raydi → «Oyni boshlang» — kunlar to'ladi, 17-kun atrofida chiziq limitga yetadi; Database qizil — «bepul limit tugadi — oy oxirigacha to'xtadi»; telefonda «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.» Joriy qator: Har so'rov Database'ni uyg'otadi. Soddalashtirilgan hisob: bepul Neon oyiga taxminan 400 soat uyg'oq turadi — oyga yetmaydi.
  2. Faqat Backend javob beradi → «Oyni boshlang» — chiziq oy oxirigacha limitdan ancha pastda qoladi.
- Ikkalasi ko'rilgach: ikki kalendar yonma-yon (`/health` Database'ni ham so'raydi · Faqat Backend javob beradi) va kod kartasi `app.controller.ts`:
  ```ts
  @Get('health')
  health() {
    return { holat: 'ok' }
  }
  ```
  Ostida: `/health` faqat Backend javob berayotganini aytadi — Database'ga so'rov yubormaydi.
- Natija bloki:
  - Taxminingiz: … · hisob bo'yicha: oy tugamasdan to'xtaydi (to'g'ri bo'lsa: ✓ Taxminingiz to'g'ri chiqdi)
  - Bizning `/health` Backend'ni aytadi, Database'ni uyg'otmaydi — monitoring bepul limitni sarflamaydi.
  - Narxi: Database to'xtasa, monitoring buni sezmaydi — buni dashboard va o'yinchi sahifasi ko'rsatadi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikki holatni ko'ring (N/2) → Davom etish

## 7 · 3-savol
- Eyebrow: Mashq · 3-savol
- Savol: UptimeRobot `/health` dan 200 oldi. Bu nimani bildiradi?
  - ✔ Backend ishlab turibdi va javob berdi
  - Database ham tekshirilib, ishlab turibdi
  - Sayt Netlify'da xatosiz ochilib turibdi
  - Ega paroli `.env` faylida to'g'ri yozilgan
- Javob izohlari:
  - To'g'ri: Bizning `/health` faqat Backend'ni aytadi — Database'ni so'ramaydi.
  - B: Bu `/health` Database'ga so'rov yubormaydi.
  - C: `/health` — Backend manzili, saytni ochmaydi.
  - D: Parolni `/health` emas, `POST /kirish` tekshiradi.
  - Boshqa holatda: `/health` Backend'ni aytadi.
- Umumiy yozuvlar — 3-ekrandagidek.

## 8 · Monitoring
- Eyebrow: Tajriba · monitoring
- Sarlavha: Sayt yiqilsa, buni siz qanday bilib qolasiz?
- Mentor: UptimeRobot — saytlarni kuzatadigan xizmat: u ikki manzilni har 5 daqiqada so'raydi. Tunni boshlang va telefoningizga qarang.
- Avval o'zingiz belgilab ko'ring: Backend javob bermasa, qaysi monitor «Down» bo'ladi?
  - Sayt monitori
  - `/health` monitori
  - Ikkalasi ham
- Maket: chapda o'yinchi telefoni (`https://maydon-mahalla.netlify.app`, kataklar) · o'rtada soat va chiziq (22:00 … 23:30), Backend · Render (✓), UptimeRobot (Maydon · sayt — `maydon-mahalla.netlify.app` · Maydon · /health — `maydon-….onrender.com/health`, ikkalasi Up) · o'ngda Sizning telefoningiz («Yangi xabar yo'q», uzuq chiziqli bo'sh joy)
- Harakat:
  1. ▶ Tunni boshlang (telefon ostida) — har 5 daqiqada qatorlarga katakcha qo'shiladi; 23:10 da Backend · Render qizil — «javob bermayapti»; `/health` qatori — Down, sayt qatori Up qoladi. Telefoningizga ikki ogohlantirish: ilova · Down · Maydon · /health va email · Down · Maydon · /health. O'yinchi telefonida — «Vaqtlarni yuklab bo'lmadi. Birozdan keyin urinib ko'ring.»
     - Joriy qator: Saytni to'xtovsiz kuzatish — monitoring. Yiqilganda keladigan xabar — ogohlantirish.
     - Ostida kulrang: «Saytingiz hozir ochilyaptimi?» darsidagi o'lchagich va signal — shu monitoring va ogohlantirish.
  2. Backend'ni tiklang — `/health` qatori yana Up, telefonga: ilova · Up · Maydon · /health; sahifada kataklar.
- Natija bloki:
  - Taxminingiz: … · haqiqatda: faqat `/health` monitori (to'g'ri bo'lsa: ✓ Taxminingiz to'g'ri chiqdi)
  - Saytni to'xtovsiz kuzatish — monitoring. Yiqilganda keladigan xabar — ogohlantirish.
  - Sayt monitori sahifani, `/health` monitori Backend'ni so'raydi. Javob bo'lmasa — ogohlantirish keladi.
  - Narxi: so'rovlar bepul Backend'ni uyg'oq tutishi mumkin — Render'ning 750 soatlik umumiy limitidan sarflanadi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Tunni boshlang → Backend'ni tiklang → Davom etish

## 9 · 4-savol
- Eyebrow: Mashq · 4-savol
- Savol ustida kichik UptimeRobot kartasi: Maydon · sayt — Up · Maydon · /health — Down
- Savol: Sayt monitori «Up», `/health` «Down». O'yinchi nimani ko'radi?
  - Sahifa umuman ochilmaydi, ekran bo'sh
  - Hamma narsa odatdagidek ishlab turibdi
  - ✔ Sahifa ochiladi, vaqtlar yuklanmaydi
  - Faqat egasining sahifasi ochilmay qoladi
- Javob izohlari:
  - To'g'ri: Sahifa Netlify'dan keladi, vaqtlar esa Backend'dan.
  - A: Sayt monitori «Up» — sahifa Netlify'dan kelyapti.
  - B: `/health` «Down» — Backend javob bermayapti.
  - D: O'yinchi sahifasi ham vaqtlarni o'sha Backend'dan oladi.
  - Boshqa holatda: Sahifa Netlify'dan, vaqtlar Backend'dan keladi.
- Umumiy yozuvlar — 3-ekrandagidek.

## 10 · O'z domeni — Mentor misoli
- Eyebrow: Mentor misoli · o'z domeni
- Sarlavha: Sotib olingan domen saytga qanday ulanadi?
- Mentor: Bugun bepul manzil yetadi, o'z domeni esa pullik — shuning uchun uni Mentor misolida ko'ramiz. Qadamlarni bajaring va brauzerdagi belgiga qarang.
- Avval o'zingiz belgilab ko'ring: Domen Netlify'ga qo'shilgach, sayt HTTPS bilan shu zahoti ochiladimi?
  - Ha, shu zahoti ochiladi
  - Yo'q, avval DNS, keyin sertifikat
- Maket: o'yinchi telefoni (manzil `www.maydon-mahalla.uz`) → DNS → app.netlify.com · Domain management (`maydon-mahalla.netlify.app` ✓) · ostida «Domen sotuvchisi paneli» — Mentor misoli · maket · vaqt tezlashtirilgan
- Qadamlar (telefon ostidagi tugma, N/3):
  1. Domenni Netlify'ga qo'shing — ro'yxatga `www.maydon-mahalla.uz` tushadi: Pending DNS verification; DNS qizil, telefonda: Saytga ulanib bo'lmadi
  2. DNS yozuvini qo'shing — sotuvchi panelida: `www` → `maydon-mahalla.netlify.app` · yozuv turi: CNAME; DNS ✓, domen qatori ✓. Joriy qator: Domen qaysi saytga olib borishini aytadigan yozuv — DNS yozuvi. DNS manzilni shu yozuvdan topadi.
  3. Sertifikatni tekshiring — Netlify kartasida: HTTPS · Let's Encrypt ✓; telefonda `https://www.maydon-mahalla.uz` — kataklar chiqadi.
- Natija bloki:
  - Taxminingiz: … · haqiqatda: avval DNS domenni Netlify'ga olib boradi, keyin sertifikat tayyorlanadi (to'g'ri bo'lsa: ✓ Taxminingiz to'g'ri chiqdi)
  - Domen qaysi saytga olib borishini aytadigan yozuv — DNS yozuvi. DNS manzilni shu yozuvdan topadi.
  - DNS domenni Netlify'ga olib borgach, Netlify sertifikatni o'zi oladi. Bunga vaqt ketishi mumkin.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish

## 11 · Yakuniy · ogohlantirish yo'li
- Eyebrow: Yakuniy · tartib
- Sarlavha: Backend to'xtasa, ogohlantirish sizga qanday yetadi?
- Mentor: Bo'laklarni sodir bo'lish tartibida joylang.
- 5 ta uya (raqam va izoh «bu yerga qo'ying»); bo'laklar aralash, sudrash yoki bosish.
- To'g'ri tartib:
  1. ✔ Backend javob bermay qoladi
  2. ✔ UptimeRobot `/health` ni so'raydi
  3. ✔ Javob kelmaydi
  4. ✔ `/health` monitori «Down» bo'ladi
  5. ✔ Email va ilovaga ogohlantirish keladi
- Hamma uya to'lib tartib xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring.
- Yechilgach: Ogohlantirish shu tartibda yetadi: Backend to'xtaydi, `/health` javob bermaydi, UptimeRobot sizga xabar beradi.
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## 12 · Amaliyot 1 — sayt nomi, WEB_ORIGIN va HTTPS
- Eyebrow: Amaliyot 1 · sayt nomi
- Sarlavha: «Maydon»ga eslab qoladigan manzil bering.
- Mentor: Bu blokda kod yo'q — sozlamani o'zingiz o'zgartirasiz, natijani telefonda tekshirasiz. **«1 · Ochish»**dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; o'tilgan qadamga «Qaytarish»):
  1. Ochish — app.netlify.com'da `maydon` loyihangizni oching. Telefonda hozirgi `….netlify.app` manzilini oching — kataklar chiqsin.
     - Xato izohi: Loyiha Netlify'da yo'q bo'lsa — `README.md` dagi «Internetga chiqarish» bo'limi bo'yicha avval chiqaring.
  2. Sayt nomi — Netlify'da loyiha nomini o'zgartirish joyini oching (hozir: «Project overview» → «Customize» → «Manage project name and cover image»). Yangi nom: `maydon-` va o'zingiz tanlagan so'z (kichik lotin harf, raqam, chiziqcha). Saqlang — manzil `https://{yangi nom}.netlify.app` bo'ladi.
     - Xato izohi: Nom band bo'lsa, Netlify uni qabul qilmaydi — oxiriga raqam qo'shing.
  3. `WEB_ORIGIN` — telefonda yangi manzilni oching: «Vaqtlarni yuklab bo'lmadi» — kutilgan holat. render.com'da Backend'ingiz → o'zgaruvchilar bo'limi («Environment») → `WEB_ORIGIN` qiymatini yangi manzilga almashtiring (`https://` bilan) → saqlash ro'yxatidan qayta deploy qiladiganini tanlang (hozir: «Save and deploy»). Deploy tugagach sahifani yangilang — kataklar chiqadi.
     - Xato izohi: Chiqmasa — `WEB_ORIGIN` dagi nom Netlify'dagi bilan harfma-harf bir xilmi, qarang.
  4. HTTPS tekshiruvi — yangi manzil `https://` bilan ochilsin. Manzil qatori chetidagi belgini bosing: brauzer ulanish xavfsiz ekanini ko'rsatsin, ogohlantirish bo'lmasin (Chrome'da masalan «Connection is secure»; boshqa brauzer va tilda yozuv boshqacha).
  5. O'z g'oyangiz — o'z MVP ingiz Netlify'da bo'lsa, uyda unga ham nom bering va Backend'ingizning ruxsat ro'yxatini (CORS) yangi manzilga moslang. Internetda bo'lmasa — «Bajardim»ni bosing.
- kutilgan natija · namuna: Maydon
  - Telefon: «Sayt · Netlify» `maydon-mahalla` · `https://maydon-mahalla.netlify.app` · Maydon · Bugun · olti katak
  - render.com · Environment: `WEB_ORIGIN` · `https://maydon-mahalla.netlify.app`
  - Connection is secure · sertifikat: `*.netlify.app` — ostida: Chrome · namuna yozuv
- Ortda qoldingizmi — mentor bilan:
  ```
  git fetch https://github.com/Azizbekcrypto/maydon --tags
  git checkout -f m10-dars-07-start
  ```
  (bu blok repo'ni o'zgartirmaydi — Netlify va Render sozlamalari o'zingizda)
- Hammasi bajarilgach: Yangi manzil ishlayapti: kataklar chiqadi, ulanish HTTPS bilan.
  - Ostida: Eski havolani kimgadir yuborgan bo'lsangiz, yangisini qayta yuboring.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 13 · Amaliyot 2 — GET /health
- Eyebrow: Amaliyot 2 · Backend holati
- Sarlavha: Backend o'z holatini `/health` da aytsin.
- Mentor: Kodni Antigravity yozadi — `ok` va to'xtagan Backend'ni esa brauzerda o'zingiz tekshirasiz. **«1 · Ochish»**dan boshlang.
- Qadamlar (har birida «Bajardim»):
  1. Ochish — Antigravity'da `maydon` papkasini oching. Terminalda `cd backend`, keyin `npm run start:dev`; brauzerda `localhost:3000` — «Maydon Backend ishlayapti».
  2. Prompt — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       ```
       Qayerda: backend/src/app.controller.ts — yangi yo'l GET /health.
       Nima qilsin: { holat: 'ok' } qaytarsin. Database'ga so'rov yubormasin — bu yo'lni UptimeRobot har 5 daqiqada so'raydi.
       Nima buzilmasin: GET / va boshqa yo'llar o'zgarmasin; javobda DATABASE_URL ham, maxfiy kalitlar ham bo'lmasin. O'zgargan fayllarni ayt.
       ```
     - Xato izohi: Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  3. Ishga tushirish — Backend o'zi qayta ishga tushadi. Brauzerda `localhost:3000/health` — `{"holat":"ok"}`. Keyin Backend terminalida Ctrl+C bosing va sahifani yangilang: Backend to'xtagan — sahifa ochilmaydi. UptimeRobot buni «Down» deb ko'radi. `npm run start:dev` — yana `ok`.
  4. Internetda tekshirish — `git status`: o'zgargan fayl — `backend/src/app.controller.ts`, agent aytgan ro'yxat bilan bir xil. `git add backend/src/app.controller.ts`, `git commit -m "health"`, `git push` — Render o'zi yangilanadi. Deploy tugagach brauzerda `https://{Render manzilingiz}/health` — `{"holat":"ok"}`. Bepul Backend uxlab qolgan bo'lsa, birinchi javob kechikishi mumkin — taxminan bir daqiqagacha.
  5. O'z g'oyangiz — qavs ichini o'z loyihangiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying — uyda o'z papkangizda yuborasiz:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       ```
       Qayerda: {loyiha papkasi}/backend — yangi yo'l GET /health.
       Nima qilsin: { holat: 'ok' } qaytarsin; Database'ga so'rov yubormasin (bepul limit).
       Nima buzilmasin: boshqa yo'llar o'zgarmasin; javobda maxfiy kalitlar bo'lmasin. O'zgargan fayllarni ayt.
       ```
- kutilgan natija · namuna: Maydon — Backend · Render · `GET /health`:
  - `localhost:3000/health` — `{"holat":"ok"}`
  - Backend to'xtatilgan: `localhost:3000/health` — Saytga ulanib bo'lmadi
  - `maydon-….onrender.com/health` — `{"holat":"ok"}`
- Ortda qoldingizmi — mentor bilan:
  ```
  git fetch https://github.com/Azizbekcrypto/maydon --tags
  git checkout -f m10-dars-07-done
  ```
  (`.env` fayllaringiz o'zgarmaydi)
- Hammasi bajarilgach: `/health` ishlayapti: Backend javob bersa — `ok`, to'xtasa — javob yo'q.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 14 · Amaliyot 3 — UptimeRobot: ikki monitor va ogohlantirish
- Eyebrow: Amaliyot 3 · monitoring
- Sarlavha: «Maydon» yiqilsa, ogohlantirish sizga kelsin.
- Mentor: UptimeRobot'ning bepul rejasi «Maydon»ga yetadi. **«1 · Ochish»**dan boshlang.
- Qadamlar (har birida «Bajardim»):
  1. Ochish — uptimerobot.com'da bepul ro'yxatdan o'ting: ogohlantirish shu emailga keladi. Telefoningizga UptimeRobot ilovasini o'rnating (Android yoki iOS) va o'sha akkaunt bilan kiring — ilova ham ogohlantirish oladigan bo'ladi.
  2. Sayt monitori — yangi monitor qo'shing («+ Add New Monitor») → turi «HTTP(s)» → URL: `https://{yangi nom}.netlify.app` → interval — 5 daqiqa → ogohlantirish: email va telefoningiz belgilangan bo'lsin → «Create monitor».
  3. `/health` monitori — xuddi shunday, URL: `https://{Render manzilingiz}/health`. Ikkala qator «Up» bo'lsin.
     - Xato izohi: «Down» bo'lsa — URL ni brauzerda ochib, `ok` qaytayotganini qarang.
  4. Ogohlantirishni tekshirish — vaqtinchalik uchinchi monitor qo'shing: URL — Render manzilingiz va oxirida `/yoq` (bunday yo'l yo'q, Backend 404 qaytaradi). U «Down» bo'lib, email va ilovaga ogohlantirish kelguncha kuting. Keyin shu monitorni o'chiring.
  5. O'z g'oyangiz — o'z MVP ingiz internetda bo'lsa, uyda unga ham ikki monitor qo'shing: sayt va Backend'ning `/health` yo'li. Bepul rejada 50 tagacha monitor bor.
- kutilgan natija · namuna: Maydon
  - Sizning telefoningiz 23:15 — ilova: Down · tekshiruv · /yoq · email: Down · tekshiruv · /yoq
  - UptimeRobot: Maydon · sayt — Up · Maydon · /health — Up · tekshiruv · /yoq — Down (yorliq: o'chiriladi)
- Ortda qoldingizmi — mentor bilan:
  ```
  git fetch https://github.com/Azizbekcrypto/maydon --tags
  git checkout -f m10-dars-07-done
  ```
  (UptimeRobot sozlamasi repo'da emas — monitorlarni o'zingiz qo'shasiz)
- Hammasi bajarilgach: Ikki monitor ishlayapti: «Maydon» yiqilsa, email va ilovaga ogohlantirish keladi.
  - Ostida: Telegram orqali ogohlantirish bepul rejada yo'q — email va telefon ilovasi yetadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 15 · Natijalar (podium) — jonli reyting

## 16 · Takrorlash
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.
- Mentor yo'q. Birinchi bosishgacha karta ostida: Kartani bosing — javob ochiladi
- Kartochkalar (12) — pastdagi «Kartochkalar» bo'limida.
- Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 17 · Yakun
- Eyebrow: Tayyor
- Belgilar: ✓ Ikki monitor ishlayapti · N/5 to'g'ri
- Sarlavha: Endi «Maydon» yiqilsa, ogohlantirish sizga keladi.
- Bugungi asosiy fikr: Monitoring saytni siz o'rningizga so'rab turadi va javob bo'lmasa sizga xabar beradi; nimani so'rashini esa bepul limitlarga qarab tanlaysiz.
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Netlify nomi o'zgarsa, manzil o'zgaradi va Render'dagi `WEB_ORIGIN` yangilanadi.
  - HTTPS bilan ma'lumot yo'lda shifrlangan — tarmoq mazmunini o'qiy olmaydi; `*.netlify.app` da Netlify uni o'zi yoqqan.
  - Bizning `/health` Backend'ni aytadi va Database'ni uyg'otmaydi — monitoring bepul limitni sarflamaydi.
  - UptimeRobot sayt va `/health` ni har 5 daqiqada so'raydi; javob bo'lmasa email va ilovaga ogohlantirish yuboradi.
  - O'z domeni DNS yozuvi bilan ulanadi; DNS tayyor bo'lgach, sertifikatni Netlify o'zi oladi.
- Katta tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda suzuvchi so'zlar: domen · HTTPS · /health · UptimeRobot) — bosilgach karta, pastdagi «Yakun» bo'limida.
- Nishonlaringiz — N/5 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- **Right Origin** — Nom o'zgargach WEB_ORIGIN ni yangilashni bildingiz (3-ekran, 1-savol — birinchi urinishda)
- **Secure Line** — HTTPS nimani himoya qilishini bildingiz (5-ekran, 2-savol)
- **Health Check** — /health javobi nimani bildirishini bildingiz (7-ekran, 3-savol)
- **Two Monitors** — Ikki monitor holatini to'g'ri o'qidingiz (9-ekran, 4-savol)
- **Night Watch** — Uch amaliyot blokini oxirigacha bajardingiz (14-ekran, oxirgi «Bajardim» — bonus)
- Nishon olinganda (butun ekran): <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Nom o'zgarsa — `WEB_ORIGIN`»
   - `maydon-mahalla.netlify.app` — Yangi nom — manzil ham yangi.
   - `WEB_ORIGIN=https://maydon-mahalla.netlify.app` — Render'da — Backend shu saytdan kelgan so'rovga ruxsat beradi.
   - `Vaqtlarni yuklab bo'lmadi` — Eski manzil qolsa — ruxsat ro'yxati (CORS) yangi saytni to'sadi.
   - Sinfga savol: Nega `VITE_API_URL` ni o'zgartirmaymiz?
2. 2-savol (5-ekran) — «HTTPS yo'lni himoya qiladi»
   - `http://` — Ochiq — yo'ldagi tarmoq matnni o'qiy oladi.
   - `https://` — Shifrlangan — yo'ldagi tarmoq mazmunini o'qiy olmaydi.
   - `*.netlify.app` — Sertifikat — Netlify HTTPS ni o'zi yoqqan.
   - Sinfga savol: HTTPS bor saytda zaiflik bo'lishi mumkinmi?
3. 3-savol (7-ekran) — «`/health` Backend'ni aytadi»
   - `{ holat: 'ok' }` — Backend javob berdi — Database so'ralmadi.
   - `≈ 400 soat` — Eng kichik o'lchamda bepul Neon oyiga taxminan shuncha uyg'oq turadi.
   - `har 5 daqiqa` — Database ham so'ralsa, u o'chishga ulgurmaydi.
   - Sinfga savol: Database to'xtasa, buni qayerdan bilamiz?
4. 4-savol (9-ekran) — «Ikki monitor»
   - `maydon-mahalla.netlify.app` — Sayt monitori — sahifa ochiladimi.
   - `/health` — Backend monitori — Backend javob beradimi.
   - `Down` — Ogohlantirish — email va telefon ilovasiga.
   - Sinfga savol: Faqat sayt monitori bo'lsa, kechasi nimani bilmay qolamiz?
5. Yakuniy (11-ekran, xatodan keyingi havola orqali) — «Ogohlantirish yo'li»
   - `Backend` — Javob bermay qoladi.
   - `/health` — Javob kelmaydi — monitor «Down».
   - `email · ilova` — Ogohlantirish sizga keladi.
   - Sinfga savol: Monitoring bo'lmasa, buni kim birinchi biladi?

## Jonli viktorina (12 savol)
- Tugma (Yakun ekranida): CODE STRIKE · kutish holatida: Mentorni kuting
- Arena fonidagi so'zlar: HTTPS · /health · UptimeRobot · Down · WEB_ORIGIN · domen · SSL · DNS · .netlify.app · Up · monitoring · bepul limit
- Arena yozuvlari (emoji olib tashlangan): Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · (jonli) Mentor testni boshlashini kuting… · (mustaqil) ▶ Boshlash · Savol N/12 · (jonli) ✔ Javob qabul qilindi — natijani kuting… · Savol N/12 — natija · +N ball · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling! · (jonli) Siz hozir: N-o'rin · (mustaqil) Keyingi → / Natijani ko'rish · Test yakunlandi! · (mustaqil) N ball · N/12 to'g'ri · eng uzun streak · ↻ Qayta ishlash · (jonli) Siz — N-o'rin · N ball · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · Arenani yopish · (dars tugagan bo'lsa) Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish

1. Netlify sayt nomi nimani o'zgartiradi?
   - ✔ Netlify manzilining boshini
   - Render'dagi Backend manzilini ham
   - Database'dagi jadvallarning nomini
   - Saytdagi «Band qilish» tugmasi matnini
2. Sayt nomi o'zgargach kataklar chiqmadi. Sabab nima?
   - Database'dagi bandlar o'chib ketgan
   - ✔ WEB_ORIGIN da eski manzil qolgan
   - Netlify DNS ni hali yangilamagan
   - Brauzer yangi nomni tanimagan
3. Render'dagi WEB_ORIGIN nima uchun kerak?
   - Database'ga ulanish manzilini saqlash
   - Ega parolini tekshirib, token berish
   - ✔ Sayt so'roviga ruxsat berish uchun
   - Monitor intervalini belgilab berish
4. Manzil https:// bilan bo'lsa, yo'ldagi Wi-Fi nimani ko'radi?
   - Ism va telefonni ochiq matnda
   - Faqat telefon raqamini ko'radi
   - Hech qanday so'rov o'tmaydi
   - ✔ O'qib bo'lmaydigan ma'lumotni
5. SSL sertifikati nima qiladi?
   - ✔ Saytda HTTPS ni yoqadi
   - Saytni tezroq ochadi
   - Database'ni himoya qiladi
   - CORS ruxsatini o'zi beradi
6. *.netlify.app manzilida HTTPS ni kim yoqadi?
   - O'quvchi sertifikat sotib oladi
   - ✔ Netlify uni o'zi yoqib qo'yadi
   - Render WEB_ORIGIN orqali yoqadi
   - UptimeRobot monitor orqali yoqadi
7. O'z domenida sertifikat qachon olinadi?
   - Domen sotib olingan zahotiyoq
   - WEB_ORIGIN yangilangan zahoti
   - ✔ DNS yozuvi to'g'ri bo'lgach
   - Birinchi monitor qo'shilgach
8. Database javob bermasa, GET / nima qaytaradi?
   - 503 — xizmat hozir ishlay olmaydi
   - 404 — bunday yo'l Backend'da yo'q
   - 401 — avval parol bilan kiring
   - ✔ 200 — «Maydon Backend ishlayapti»
9. /health nega Database'ni so'ramaydi?
   - ✔ Bepul Database limiti tugamasin
   - Database'ni Backend ko'rmaydi
   - Database javobi juda sekin keladi
   - UptimeRobot SQL'ni bilmaydi
10. Bepul UptimeRobot manzilni necha daqiqada so'raydi?
   - Har bir daqiqada
   - ✔ Har 5 daqiqada
   - Har bir soatda
   - Kuniga bir marta
11. Bepul rejada ogohlantirish qayerga keladi?
   - Telegram botiga va guruhiga
   - Tekin SMS va qo'ng'iroq bilan
   - ✔ Email va telefon ilovasiga
   - Render boshqaruv sahifasiga
12. UptimeRobot so'rovlari bepul Render'ga qanday ta'sir qiladi?
   - Backend sekinlashib qoladi
   - Render pullik bo'lib qoladi
   - Database to'lib qoladi
   - ✔ Backend uxlab qolmaydi

## Kartochkalar
16-ekran «Takrorlash» — 12 karta (old tomonida savol, ochilganda javob va izoh):

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Production (prod) nima? | Haqiqiy foydalanuvchilar ishlatadigan versiya | Bizda — internetdagi «Maydon»; bepul reja uzluksizlikni va'da qilmaydi |
| Netlify sayt nomi nimani belgilaydi? | ….netlify.app manzilining boshini | Nom o'zgarsa, manzil ham o'zgaradi |
| Sayt nomi o'zgargach Render'da nima yangilanadi? | WEB_ORIGIN | Aks holda CORS so'rovni to'sadi, kataklar chiqmaydi |
| HTTPS nimani bildiradi? | Yo'ldagi ma'lumot shifrlangan — tarmoq mazmunini o'qiy olmaydi | Zaiflikni ham, sayt egasini ham tekshirmaydi |
| SSL nima? | HTTPS ni ta'minlaydigan sertifikat | *.netlify.app da Netlify uni o'zi yoqqan |
| O'z domeni saytga qanday ulanadi? | DNS yozuvi bilan | Yozuv domenni Netlify manziliga olib boradi |
| O'z domenida sertifikatni kim oladi? | Netlify, o'zi | DNS domenni Netlify'ga olib borgach (Let's Encrypt); vaqt ketishi mumkin |
| GET /health nima qaytaradi? | { holat: 'ok' } | Database'ni so'ramaydi |
| /health nega Database'ni so'ramaydi? | Monitoring bepul Database limitini sarflamasin | Har 5 daqiqalik so'rov uni uxlatmaydi |
| Monitoring nima? | Saytni to'xtovsiz, kunu-tun kuzatish | Yiqilsa — ogohlantirish keladi |
| «Maydon» uchun nechta monitor qo'shamiz? | Ikkita: sayt va /health | Har biri 5 daqiqada so'raladi |
| UptimeRobot bepul rejada ogohlantirish qayerga keladi? | Email va telefon ilovasiga | Telegram bepul rejada yo'q |

## Yakun
17-ekrandagi «Uyga vazifa» tugmasi bosilgach ochiladigan karta:
- Uyda nima qilasiz?
- kim uchun — o'z MVP ingiz · nechta — 3 qadam · muddat — keyingi darsgacha
  1. **Manzil** — MVP ingiz internetda bo'lsa, Netlify'da unga nom bering va Backend ruxsat ro'yxatini yangilang. Internetda bo'lmasa — avval «Maydon» README'sidagi «Internetga chiqarish» yo'li bilan chiqaring.
  2. **`/health`** — Amaliyot 2 dagi «O'z g'oyangiz» promptini yuboring; `ok` ni va to'xtagan Backend'ni brauzerda tekshiring.
  3. **Monitoring** — UptimeRobot'da ikki monitor qo'shing va ogohlantirish kelishini bir marta tekshiring.
- Keyingi dars — **«Loyiha kuni: prodga ko'tarish — 1-qism»**. Eng yaxshi loyihangizni prodga tayyorlaysiz.
