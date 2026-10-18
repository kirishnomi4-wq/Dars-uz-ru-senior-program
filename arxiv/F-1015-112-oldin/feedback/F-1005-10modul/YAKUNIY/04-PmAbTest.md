# 4-dars «Ikki variantdan qaysi biri yaxshiroq ishlaydi?» — yakuniy matn

Fayl: `src/8-Modull/PmAbTestLesson.jsx` · 12 ekran · Keyingi dars: «Kiberxavfsizlik: zaiflikni topib yopamiz»
Holat: 06.10.2026 — kodga mos

Dars bo'yi bitta maket — «Maydon» sayti ochilgan o'yinchi telefoni: Maydon · Bugun · vaqt kataklari 16:00 · 17:00 · 18:00 · 19:00 · 20:00 · 21:00 ·
forma «Bugun · 18:00–19:00» · Ism · Telefon · tugma. Tugmaning ikki matni: A — «Band qilish», B — «18:00 ni band qilish».
Telefon ostidagi mini uch qadam: ochdi · vaqtni tanladi · band qildi.
Barcha ekranlarda: telefonda Mentor yig'iladi — «Mentor · ko'rsatmani ochish ▾»; jonli darsda Mentor hali o'tmagan sahifada «Davom etish» o'rnida izoh: Mentor hali bu sahifaga o'tmadi.

## 0 · Kirish
- Eyebrow: «Maydon» tugmasi
- Sarlavha: **Ikki variantdan qaysi biri yaxshiroq ishlaydi?**
- Mentor: Mentor misolida «Maydon» formasidagi tugma ikki xil yozildi. O'yinchi bo'lib ikkalasiga qarang va bittasini tanlang.
- Maket (chap): ikki telefon yonma-yon — chapda tugma «Band qilish», o'ngda «18:00 ni band qilish» (telefonning o'zini ham bosish mumkin)
- Tanlov (2 ta):
  - Chapdagi tugma
  - O'ngdagi tugma
- Tanlovdan keyin: tanlangan telefon ajraladi, ikkala telefon ostida «band qildi: ?», ular orasida katta «?»
- Javob (ikkalasida bir xil): Ikkalasi ham bo'lishi mumkin. Qaysi birida ko'proq o'yinchi band qilishini taxmin emas, raqam ko'rsatadi.
- Jonli darsda: sinf ovozlari — har variant va ovozlar soni
- Tugma: Bittasini tanlang → Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: **Bugun «Maydon»da tugmaning yangi matni ishga tushadi.**
- Mentor: Bugungi misol — «Maydon» OKR'idagi tajriba: tugmada tanlangan soat. Kodni Antigravity yozadi, raqamlarni dashboard ko'rsatadi.
- Chap yorliq: Dars oxirida: gipoteza va A/B test — B varianti bugun ishga tushadi
- Chap maket (o'zi bir marta o'ynaydi): kulrang doiralar tepadan kirib, ikki telefon tomoniga bo'linadi; chap telefonda «Band qilish», o'ngda «18:00 ni band qilish»; ostida mini uch qadam (ochdi · vaqtni tanladi · band qildi) — raqamsiz, kulrang chiziq
- O'ng (raqam · matn · teg):
  - 01 · Tajribani tekshirsa bo'ladigan gapga aylantirasiz · `gipoteza`
  - 02 · Odamlarni ikki guruhga bo'lishni o'rganasiz · `A/B test`
  - 03 · «Maydon»da tugmaning yangi matnini ishga tushirasiz · `variant`
  - 04 · Ikki guruh foizini dashboard'da solishtirasiz · `foiz`
- Pastki qator: repo `maydon` · boshlang'ich holat `m10-dars-04-start` · tayyor namuna `m10-dars-04-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Gipoteza
- Eyebrow: Tushuncha · taxmin
- Sarlavha: **Tajribani tekshirsa bo'ladigan gapga aylantiring.**
- Mentor: Tajriba gapi nimani kutishni aytmaydi — har bo'lakda bittasini tanlang.
- Chap — o'yinchi telefoni: tugma «Band qilish» (yorliq «hozir»), yonida «yangi» · «18:00 ni band qilish»; ostida mini uch qadam, «vaqtni tanladi → band qildi» oralig'ida «?»
- O'ng — karta (yorlig'i «tajriba», to'rt bo'lak tanlangach — «gipoteza»):
  - Agar … — ✓ tugmada tanlangan soatni yozsak · OKR'dagi tajriba
  - … o'zgaradi — joriy qator, javoblar:
    - sayt yaxshiroq bo'ladi — telefon: uch ustun ustida «?», pufak «Qayerda yaxshiroq?» · Xato: Yaxshiroq — qayerda? O'yinchi nimani boshqacha qiladi?
    - ✔ vaqtni tanlaganlardan ko'proq o'yinchi band qiladi — telefon: «band qildi» ustuni ustida ↑
    - saytni ko'proq odam ochadi — telefon: «ochdi» ustuni yonadi, forma yo'q (faqat kataklar) · Xato: Tugma vaqt tanlangandan keyin chiqadi — ochishga tegmaydi.
  - chunki … — javoblar:
    - agent tugma matnini tez o'zgartira oladi — pufak «Bu menga nima beradi?» · Xato: Bu biz uchun qulay. O'yinchi nega ko'proq band qiladi?
    - ✔ o'yinchi qaysi vaqtni band qilayotganini tugmaning o'zida ko'radi — pufak «18:00 — men tanlagan vaqt»
  - Raqam — javoblar:
    - saytni ochganlar soni — «ochdi» ustuni o'chadi · Xato: Ochganlar hali tugmani ko'rmagan.
    - ✔ vaqtni tanlaganlardan band qilganlar foizi — oraliqdagi «?» o'rnida «foiz»
    - haftada band qilingan vaqtlar — ustunlar ustida kalendar · Izoh (xato rangisiz): Bandlar ham o'zgarishi mumkin, lekin tugmaga eng yaqin raqam — vaqt tanlaganlardan band qilganlar foizi.
- Karta ostida (tanlanguncha): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. (xatodan keyin: Nishon birinchi urinish uchun edi.)
- Ipucha (uzoq harakatsizlikda): Joriy qatordagi javoblarni o'qing — qaysi biri o'yinchi haqida?
- Uch bo'lak tanlangach:
  - Izoh: «Agar … qilsak, … o'zgaradi, chunki …» shaklidagi tekshiriladigan taxmin gipoteza deyiladi.
  - To'liq gap: Agar **tugmada tanlangan soatni yozsak**, **vaqtni tanlaganlardan ko'proq o'yinchi band qiladi**, chunki **o'yinchi qaysi vaqtni band qilayotganini tugmaning o'zida ko'radi**. Raqam: **vaqtni tanlaganlardan band qilganlar foizi**.
  - Xulosa: **Gipoteza nimani o'zgartirishimizni, qanday natija va nega kutayotganimizni, qaysi raqamga qarashimizni aytadi.**
  - Izoh: «Chunki» — nega shunday kutayotganimiz. A/B test raqam o'zgardimi — shuni ko'rsatadi, sababni o'zi isbotlamaydi.
- Tugmalar: Orqaga · Bo'laklarni tanlang (N/3) → Davom etish

## 3 · 1-savol
- Eyebrow: Tekshiruv · qaysi raqam
- Savol ustida: telefonning yuqori qismi — «‹ Bugun ›» strelkalari kattalashgan, vaqt kataklari, yorliq «yangi»
- Savol: **Kun strelkalarini kattalashtirdingiz. Unga eng yaqin raqam qaysi?**
  - A — Vaqtni tanlaganlardan band qilganlar foizi
  - B — Haftada band qilingan vaqtlar soni
  - ✔ C — Ochganlardan vaqtni tanlaganlar foizi
  - D — Dashboard'dagi «Oxirgi 5 daqiqada» raqami
- Javob izohlari:
  - To'g'ri: Strelka vaqt tanlashdan oldin — o'sha qadam foizi o'zgaradi.
  - A: Bu tugma qadami — strelka undan oldin turadi.
  - B: Bandlar ham o'zgarishi mumkin — lekin strelkadan uzoqroq.
  - D: Bu raqam oxirgi 5 daqiqani sanaydi — qadamni emas.
  - Umumiy: Strelka qaysi qadamda? Shu qadamning raqamini toping.
- Yozuvlar (3 va 8-ekran uchun bir xil): To'g'ri · Qaytadan urinib ko'ring · To'g'ri javob: X · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish
- Jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz.
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 4 · Booking.com
- Eyebrow: Biznes olamidan
- Sarlavha: **Booking.com bir vaqtda nechta tekshiruv o'tkazgan?** («Booking.com» — o'z rangida, to'q ko'k)
- Yorliq va nuqtalar: Booking.com · N/5 — besh nuqta
- Mentor (har bosqichda almashadi):
  - 1/5: Booking.com — mehmonxonada yoki ijara uyda oldindan joy band qilinadigan sayt. «Maydon» kabi, u ham band qilish uchun qurilgan. Kompaniyaning o'zi aytishicha, saytdagi deyarli har o'zgarish (tugma rangi, matn, bo'limlar tartibi) avval foydalanuvchilarning bir qismida tekshiriladi.
  - 2/5 va 4/5 (belgilanguncha): Avval o'zingiz belgilab ko'ring. · belgilangach — oldingi bosqich gapi
  - 3/5: Odamlarning bir qismi A ni, qolgani B ni ko'radi, keyin raqamlar solishtiriladi. A — hozirgi variant, B — yangi. Bunday tekshiruv **A/B test** deyiladi.
  - 5/5: Kompaniyaning 2017-yildagi chiqishlariga ko'ra, saytda bir vaqtda 1000 dan ortiq A/B test o'tkazilgan. «Maydon»da hozircha bitta: tugma matni.
- Bosqichlar (karta: bosqich nomi + sahna — `booking.com` brauzer oynasi, chizilgan, logotipsiz):
  1. **Hammaga birdan emas** — odam-belgilari saytga oqadi, bir qismi ajralib turadi
  2. Bashorat — **Qolganlar shu paytda nimani ko'radi?**
     - Yopiq sahifani
     - ✔ Hozirgi sahifani
     - Ikkalasini navbat bilan
     - Natija qatori: Taxminingiz: … · haqiqatda: **hozirgi sahifani** (to'g'ri bo'lsa: Taxminingiz to'g'ri chiqdi: **hozirgi sahifani**)
  3. **Ikki guruh — bir vaqtda** — ikki guruh yonma-yon, oynalar ustida «A · hozirgi» va «B · yangi», ostida ikki «?»
  4. Bashorat — **2017-yilda Booking.com bir vaqtda nechta A/B test o'tkazgan?**
     - 10 dan ortiq
     - 100 dan ortiq
     - ✔ 1000 dan ortiq
  5. **Bir vaqtda — 1000 dan ortiq** — ko'p kichik A/B juftliklari to'ri, son «1000+» gacha sanaydi (ostida: A/B test bir vaqtda · 2017); keyin ikki telefon «A · Maydon» va «B · Maydon» (A — «Band qilish», B — «18:00 ni band qilish»)
- Xulosa (5/5 dan keyin): Taxminingiz: … · haqiqatda: **1000 dan ortiq** (to'g'ri bo'lsa: Taxminingiz to'g'ri chiqdi: **1000 dan ortiq**) · Booking.com'da yangi o'zgarish avval foydalanuvchilarning bir qismida tekshiriladi, keyin ikki guruh solishtiriladi.
- Bashorat oynasi yorlig'i: Booking.com · N/5 · belgilangach ixcham qator: Taxminingiz · savol · javob
- Tugmalar: Orqaga · Avval belgilang → Keyingi bosqich (N/5) → Davom etish

## 5 · Ikki guruh
- Eyebrow: Tushuncha · ikki guruh
- Sarlavha: **Qaysi o'yinchi A ni, qaysi biri B ni ko'radi?**
- Mentor: Sinfdoshlar bugun «Maydon»ni telefonida ochadi — ularni ikki guruhga bo'lish kerak. Har usulni sinab, maketga qarang.
- Chap maket: tepada kirish oqimi va ajratgich, pastda ikki telefon — «A» (Band qilish) va «B» (18:00 ni band qilish)
- O'ng — bashorat (yorliq: Avval o'zingiz belgilab ko'ring): **Nechta usulda guruhlarni to'g'ri solishtirsa bo'ladi?**
  - ✔ Bittasida
  - Ikkitasida
  - Uchalasida
  - Belgilangach ixcham qator: Taxminingiz · savol · javob
- Usul tugmalari (bashoratdan keyin ochiladi; har biri sinab ko'riladi, maket o'sha usul bilan yuradi):
  1. Bu hafta hammaga B, keyin o'tgan hafta bilan solishtirish — ajratgich o'rnida «O'tgan hafta · A» va «Bu hafta · B», «Bu hafta»ga «Mahalla chatida e'lon» tushadi; B telefoni ostida «?» va ↑, pufak «Foiz o'zgardi — tugmadanmi, e'londanmi?» · Xato: Bu hafta e'lon ham chiqdi — farq qayerdan kelgani noma'lum.
  2. Har ochilishda tasodifiy — brauzer eslab qolmaydi — bitta brauzer `c2a8…` sahifani yangilaydi (↻), har safar boshqa telefonga tushadi va ikkala tomonda qoladi; pufak «Qaysi tugmani ko'rib band qildim?» · Xato: Bitta brauzer ikkala guruhga tushdi — qaysi biriga sanaysiz?
  3. ✔ Birinchi kirishda tasodifiy — keyin brauzer eslab qoladi — brauzerlar birin-ketin kiradi va A yoki B tomoniga o'tadi (4 va 3); `c2a8…` yangilasa ham B da qoladi (✓); yorliq «bir vaqtda · har brauzer o'z variantida»
- Sinab bo'lingan usul belgisi: 1 va 2 — ✕, 3 — ✓
- Ipucha (uzoq harakatsizlikda): Hali bosilmagan usulni sinab ko'ring — maketda nima o'zgarishini kuzating.
- Uch usul sinalgach (usullar o'ngda ixcham qoladi, ostida xulosa):
  - Taxminingiz to'g'ri chiqdi: **bittasida**. (aks holda: Taxminingiz: … · haqiqatda: **bittasida**)
  - Tasodifiy bo'lishda guruhlar teng chiqmasligi mumkin — shuning uchun foiz solishtiriladi.
  - Bu testda A va B bir vaqtda ishlaydi, har brauzer esa birinchi olgan variantida qoladi.
- Tugmalar: Orqaga · Avval belgilang → Usullarni sinab ko'ring (N/3) → Davom etish

## 6 · Amaliyot 1 — variant va tugma matni
- Eyebrow: Amaliyot 1 · variant
- Sarlavha: **Brauzer B ni olsa, tugmada tanlangan soat chiqsin.**
- Mentor: Talab tayyor — siz `{qachon va qanday olsin}` joyini yozasiz; **«1 · Ochish»**dan boshlang.
- Mentor ostida (5-qadamda gipoteza saqlangach): Gipotezam · Agar … · Raqam: …
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. Ochish — Antigravity'da `maydon` papkasini oching. Birinchi terminalda `cd backend`, `npm run start:dev`; ikkinchisida `cd web`, `npm run dev`. Brauzerda `localhost:5173` — kataklar chiqsin.
  2. Prompt — `{qachon va qanday olsin}` joyiga brauzer variantni qachon va qanday olishini yozing (uch usulli mashqni eslang), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       ```
       Qayerda: Backend'da hodisalar jadvali va POST /hodisalar; saytda web/src/hodisa.js va «Band qilish» tugmasi (web/src/BandForma.jsx).
       Nima qilsin: hodisalar ga variant ustunini qo'sh: A yoki B, eski qatorlarda bo'sh. Brauzer variantni {qachon va qanday olsin}; variant localStorage'dagi maydon-variant da tursin.
       hodisaYoz har hodisaga variant ni qo'shib yuborsin. Tugma matni: A — «Band qilish», B — tanlangan soat bilan, masalan «18:00 ni band qilish».
       Nima buzilmasin: uch hodisa va brauzer ID, band qilish va «Bu vaqt band» xabari, /ega va /dashboard. Boshqa joyga tegma, o'zgargan fayllarni ayt.
       ```
     - Yordam (bosilsa ochiladi): «birinchi kirishda A yoki B ni teng ehtimol bilan olsin va keyin o'zgartirmasin»
  3. Ishga tushirish — Backend terminali o'zi qayta yukladi (yangi ustun ham o'zi qo'shiladi), sayt o'zi yangilandi, xato yo'q.
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. Brauzerda tekshirish — talabning har qatorini tekshiring: (1) `localhost:5173` da bo'sh katakni bosing: forma ostidagi tugmada «Band qilish» yoki siz bosgan soat bilan matn. Sahifani yangilang (F5) va yana bosing — matn o'sha: variant eslab qolindi. (2) Hamma inkognito oynalarni yoping va yangisini oching (Chrome va Edge: Ctrl+Shift+N, Mac — Cmd+Shift+N) — sayt uni yangi brauzer deb ko'radi va variantni qaytadan beradi. O'sha matn yana chiqishi ham to'g'ri — tasodif. Ikkala matnni sinfdoshlar telefonida ko'rasiz (Amaliyot 2). (3) Neon SQL Editor'da: `SELECT nom, brauzer_id, variant FROM hodisalar ORDER BY yaratilgan DESC LIMIT 6;` — yangi qatorlarda `variant` A yoki B, bitta brauzer ID ning hamma qatorida bir xil. Mos kelmagan qatorni uch qism bilan agentga yozing. Hammasi mos bo'lsa: `git add .`, `git commit -m "A/B variant"`, `git push` — Render va Netlify kodni GitHub'dan olib, o'zi yangilanadi (bir necha daqiqa).
  5. O'z g'oyangiz — loyihangiz uchun gipoteza yozing. Javoblaringiz ostidagi promptning qavslariga o'zi qo'yiladi — «Nusxalash», uyda o'z loyihangizda yuborasiz.
     - Kirish qatori (1-darsda OKR tajribasi yozilgan bo'lsa): Siz yozgan tajriba: {tajriba} · {N}-asosiy natija bilan tekshiriladi: {asosiy natija}
     - Forma — bo'laklar bittadan (tepada «Gipotezam» va 1–4 raqamlari, tayyori ✓, N/4):
       - Agar … qilsak — «Nima o'zgartirasiz?» (tajriba yozilgan bo'lsa, uning matni oldindan turadi; yo'q bo'lsa savol: Loyihangizda qaysi bitta o'zgarishni sinab ko'rasiz?)
       - … o'zgaradi — «Odamlar nimani boshqacha qiladi?»
       - chunki … — «Nega shunday deb o'ylaysiz?»
       - Raqam — «Qaysi raqamga qaraysiz?» (OKR bo'lsa, ostida: OKR'ingizdagi asosiy natija: {asosiy natija})
       - Tugma: Keyingisi → · oxirgisida: Gapni yig'ish →
     - Tekshiruv yozuvlari:
       - Bu bo'lak bo'sh — uni ham yozing.
       - Yaxshiroq — qayerda? Odamlar nimani boshqacha qiladi?
       - Qanday sanaysiz? Masalan: «… foizi» yoki «… soni».
     - To'liq gap: Agar {agar}, {o'zgaradi}, chunki {chunki}. Raqam: {raqam}. · Tugma: Saqlash → ✓ Saqlandi
     - Saqlangach prompt qutisi (Siz → Antigravity · Nusxalash):
       ```
       Qayerda: {loyiha papkasi} — hodisa yuboradigan funksiya va {o'zgarish joyi}.
       Nima qilsin: brauzer birinchi kirishda A yoki B ni tasodifiy olsin va eslab qolsin; har hodisaga variant qo'shilsin. A — hozirgidek, B — gipotezam bo'yicha: «Agar {agar}».
       Nima buzilmasin: hozirgi hodisalar va asosiy sahifa. Boshqa joyga tegma, o'zgargan fayllarni ayt.
       ```
     - Prompt ostida: Loyihangizda hodisa yuboradigan funksiya hali bo'lmasa — promptni saqlab qo'ying.
     - «Bajardim» — gipoteza saqlangach ochiladi
- kutilgan natija · namuna: Maydon:
  - ikki telefonning pastki qismi: `localhost:5173` — «Band qilish» · inkognito oyna — «18:00 ni band qilish» (forma «Bugun · 18:00–19:00», Ism, Telefon)
  - Neon · SQL Editor — nom · brauzer_id · variant: vaqt-tanladi · 9e07… · B · ochdi · 9e07… · B · vaqt-tanladi · b41d… · A · ochdi · b41d… · A
  - Sizda variant boshqacha chiqishi mumkin — u tasodifiy.
- Hammasi bajarilgach: Har brauzer o'z variantini oldi: B da tugmada tanlangan soat chiqadi.
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-04-start` (.env fayllaringiz o'zgarmaydi)
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · Amaliyot 2 — dashboard'da A va B, sinfdoshlar ochadi
- Eyebrow: Amaliyot 2 · dashboard va sinfdoshlar
- Sarlavha: **Dashboard A va B foizini yonma-yon ko'rsatsin.**
- Mentor: Endi «Nima qilsin» qatorini o'zingiz yozasiz, namuna «Yordam»da; **«1 · Ochish»**dan boshlang.
- Mentor ostida (Amaliyot 1 da gipoteza saqlangan bo'lsa): Gipotezam · Agar … · Raqam: …
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. Ochish — ikkala terminal ishlayapti. `localhost:5173/dashboard` ga ega paroli bilan kiring: «Oxirgi 5 daqiqada» va uch qadam bor, A va B hali yo'q.
  2. Prompt — `{nima qilsin}` qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       ```
       Qayerda: Backend'da GET /hodisalar/sanoq; saytda /dashboard sahifasi (web/).
       Nima qilsin: {nima qilsin}
       Nima buzilmasin: «Oxirgi 5 daqiqada» va uch qadam, har 5 soniyalik so'rov, parol bilan kirish va POST /hodisalar. Boshqa joyga tegma, o'zgargan fayllarni ayt.
       ```
     - Yordam (bosilsa ochiladi): «Nima qilsin: sanoq javobiga `variantlar` qo'shilsin — A va B uchun `vaqt-tanladi`, `band-qildi` (shu kun, turli brauzerlar soni) va `foiz` (band qildi / vaqtni tanladi × 100, butun songa yaxlitlab; hech kim tanlamagan bo'lsa — 0). Dashboard uch qadam ostida A va B ni yonma-yon ko'rsatsin.»
  3. Ishga tushirish — laptopda dashboard'da A va B qatori chiqdi. Keyin `git add .`, `git commit -m "A/B dashboard"`, `git push` — Render va Netlify o'zi yangilanadi (bir necha daqiqa).
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. Sinfdoshlar bilan tekshirish — Netlify manzilingizni (`….netlify.app`) 3–4 sinfdoshingizga bering: ular telefonida ochib, o'zi xohlagan vaqtni tanlasin; band qilish-qilmasligini o'zi hal qiladi (ism va telefon — namuna). Telefonlarni yonma-yon qo'ying: tugmada ikki xil matn chiqishi mumkin. Siz `….netlify.app/dashboard` da ega paroli bilan kuzating: A va B qatori keyingi so'rovdan keyin yangilanadi. Bepul Backend uxlab qolgan bo'lsa, birinchi javob kechikishi mumkin — taxminan bir daqiqagacha. Netlify yoki Render yangilanmasa — tekshiruvni laptopda inkognito oyna bilan qiling, push'ni mentor bilan ko'rasiz.
  5. O'z g'oyangiz — shu promptni o'z loyihangiz uchun yozing: dashboard gipotezangizdagi raqamni A va B uchun ko'rsatsin. Qavslarni to'ldiring, «Nusxalash» — uyda yuborasiz.
     - Forma: Gipotezangizdagi raqam — «Qaysi raqamga qaraysiz?» (Amaliyot 1 dagi «Raqam» o'zi qo'yiladi) · Nima buzilmasin — «Hozir ishlayotgan qaysi joyga tegilmasin?»
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       ```
       Qayerda: {loyiha papkasi} — dashboard yoki ega ko'radigan sahifa.
       Nima qilsin: A va B uchun {gipotezangizdagi raqam} yonma-yon chiqsin; har variantda turli brauzerlar sanalsin.
       Nima buzilmasin: {nima buzilmasin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.
       ```
     - «Bajardim» — ikkala maydon yozilgach ochiladi
- kutilgan natija · namuna: Maydon — brauzer oynasi `maydon-….netlify.app/dashboard`:
  - Maydon · dashboard
  - tepada kulrang: Oxirgi 5 daqiqada · ochdi · vaqtni tanladi · band qildi
  - A/B test · tugma matni — ustunlar: vaqtni tanladi · band qildi · foiz
    - A · Band qilish — 9 · 3 · 33%
    - B · 18:00 ni band qilish — 8 · 4 · 50%
  - har variantda — turli brauzerlar soni · Sizda raqamlar boshqacha — o'z tekshiruv bosishlaringiz ham sanaladi.
  - Izoh: A ning foizi faqat A ni ko'rgan brauzerlardan, B niki — faqat B ni ko'rganlardan chiqadi.
  - Izoh: 17 ta brauzer xulosa uchun kam — bu ishga tushirish mashqi.
- Hammasi bajarilgach: B varianti sinfdoshlarga ketdi, dashboard A va B foizini ko'rsatadi.
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-04-done` (Render va Netlify o'zingizniki — o'tgan moduldagi deploy'dan)
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 8 · 2-savol
- Eyebrow: Yakuniy tekshiruv
- Savol ustida: dashboard'ning A/B qismi — A/B test · tugma matni · A · Band qilish — 9 · 3 · 33% · B · 18:00 ni band qilish — 8 · 4 · 50%
- Savol: **B ning foizi yuqori. Endi nima qilasiz?**
  - A — B yutdi — hammaga B ni qo'yamiz
  - ✔ B — Ma'lumot hali kam — test davom etadi
  - C — Guruhlar teng emas — test noto'g'ri
  - D — A yaxshiroq — vaqt tanlaganlar ko'p
- Javob izohlari:
  - To'g'ri: 17 ta brauzer xulosa uchun kam — bu ishga tushirish mashqi.
  - A: B oldinda — rost. Lekin 17 ta brauzer xulosaga yetadimi?
  - C: Tasodifiy bo'lishda 9 va 8 — tabiiy, foiz solishtiriladi.
  - D: Vaqt tanlash tugmadan oldin — gipotezadagi raqam qaysi?
  - Umumiy: Nechta brauzer bor? Shu son xulosaga yetadimi?
- Yozuvlar va tugmalar — 3-ekrandagidek

## 9 · Natijalar (podium)
Natijalar (podium) — jonli reyting

## 10 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.**
- Kartochkalar — 12 ta (jadval «Kartochkalar» bo'limida); birinchi bosishgacha ostida: Kartani bosing — javob ochiladi
- Yozuvlar: ↻ O'rganilmoqda · N · ✓ Bildim · N · tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni
- Eyebrow: Tayyor
- Yorliqlar: Dars tugadi · N/2 to'g'ri
- Sarlavha: **Gipoteza endi raqam bilan tekshirilmoqda.**
- Bugungi asosiy fikr: Gipoteza qaysi raqamga qarashni oldindan aytadi, A/B test shu raqamni ikki guruhda bir vaqtda solishtiradi.
- Gipoteza saqlangan bo'lsa: Gipotezam · Agar … · Raqam: …
- Jonli viktorina tugmasi: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · kutish holatida: Mentorni kuting
- Endi siz bilasiz
  - Bu misolda raqam — o'zgarishga eng yaqin qadamning foizi.
  - A va B bir vaqtda ishlasa, boshqa vaqtga xos o'zgarishlar kamroq aralashadi.
  - Bizning testda har brauzer variantni tasodifiy oladi va o'sha variantda qoladi.
  - Tasodifiy bo'lishda guruhlar teng chiqmasligi mumkin, shuning uchun foiz solishtiriladi.
  - 17 ta brauzer xulosa uchun kam: bugungi test — ishga tushirish mashqi.
- Tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda: gipoteza · A/B test · variant · foiz)
- Keyingi dars (uy vazifasi kartasida) — **«Kiberxavfsizlik: zaiflikni topib yopamiz»**.
- Nishonlaringiz — N/4 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Yuqoridagi hisoblagich: N/4
- **Hypothesis Builder!** — Gipotezaning uch bo'lagini birinchi urinishda to'g'ri tanladingiz (2-ekran)
- **Right Number!** — O'zgarish tegadigan raqamni birinchi urinishda topdingiz (3-ekran)
- **Patient Tester!** — 17 ta brauzerdan chiqqan raqamdan shoshilib xulosa chiqarmadingiz (8-ekran)
- **B Launched!** — B variantingiz sinfdoshlarga ketdi (7-ekran, oxirgi «Bajardim»)
- Nishon yozuvlari (2-ekranda): Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi.
- Nishon olinganda: Yangi nishon · <nishon nomi> · <tavsif> · bosib davom eting

## Qisqa takrorlash oynalari
- Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish
1. (3-ekran) **Eng yaqin raqam**
   1. O'zgarish qaysi qadamda? — Bu misolda o'zgarish qaysi qadamda turganini toping: kun strelkalari — **vaqt tanlashdan oldin**.
   2. O'sha qadamning foizi — Raqam — o'sha qadamning foizi: **ochganlardan vaqtni tanlaganlar**.
   3. Tugma — keyingi qadam — Tugma matni esa keyingi qadamga tegadi: **vaqtni tanlaganlardan band qilganlar**.
   - Sinfga savol: Formadagi «Ism» qatorini olib tashlasak, qaysi raqamga qaraysiz?
2. (8-ekran) **17 ta brauzer**
   1. A guruhi — A: 9 tadan 3 — **taxminan 33 foiz**.
   2. B guruhi — B: 8 tadan 4 — **50 foiz**.
   3. Xulosa hali erta — 17 ta brauzer xulosa uchun kam — **test davom etadi**, raqam kuzatiladi.
   - Sinfga savol: B oldinda. Nega hali hammaga B ni qo'ymaymiz?

## Jonli viktorina (12 savol)
1. Gipoteza qaysi shaklda yoziladi?
   - ✔ Agar … qilsak, … o'zgaradi, chunki …
   - … ni qilamiz, chunki bu juda yaxshi g'oya
   - Hozir … ta bor, oy oxirida … taga yetsin
   - Avval … ni qilamiz, keyin … ni ko'ramiz
2. «Maydon» gipotezasida «chunki» qismi qaysi?
   - Tugmada tanlangan soatni yozsak
   - ✔ O'yinchi tanlagan vaqtini tugmada ko'radi
   - Vaqtni tanlaganlardan ko'proq o'yinchi band qiladi
   - Vaqtni tanlaganlardan band qilganlar foizi
3. «Band qilish» tugmasi qaysi qadamdan keyin chiqadi?
   - Sahifa ochilgandan keyin
   - Band qilib bo'lgandan keyin
   - ✔ Vaqtni tanlagandan keyin
   - Parolni kiritgandan keyin
4. A/B testda variant A qaysi biri?
   - Yangi, sinab ko'riladigan variant
   - Ega o'zi tanlagan eng yaxshisi
   - Dashboard'da birinchi turgani
   - ✔ Hozirgi, o'zgarmagan variant
5. Nega A va B bir vaqtda ishlaydi?
   - ✔ Boshqa vaqtning farqi aralashmasligi uchun
   - Backend'ga kamroq so'rov kelishi uchun
   - O'yinchi ikkalasini solishtirishi uchun
   - Dashboard'dagi raqamlar tezroq chiqishi uchun
6. Bizning testda brauzer variantni qachon oladi?
   - Har safar sahifa yangilanganda
   - ✔ Birinchi kirganda, bir marta
   - Band qilish tugmasini bosganda
   - Ega dashboard'ni ochgan paytda
7. Brauzer sahifani yangilaganda A ni ham, B ni ham ko'rdi. Muammo nima?
   - Tugma matni juda uzun bo'lib qoldi
   - Backend hodisani qabul qilmay qo'ydi
   - ✔ Uni qaysi guruhga sanash noma'lum
   - Brauzer ID har safar yangilanadi
8. A — 9 tadan 3, B — 8 tadan 4. B ning foizi qancha?
   - 4 foiz
   - 33 foiz
   - 12 foiz
   - ✔ 50 foiz
9. Guruhlar 9 va 8 chiqdi. Bu nimani bildiradi?
   - ✔ Tasodifiy bo'lishda bu tabiiy hol
   - Bo'lish noto'g'ri, qayta boshlash kerak
   - B guruhidagi tugma kamroq yoqqan
   - Kimdir ikki marta sanalib qolgan
10. 2017-yilda Booking.com bir vaqtda nechta A/B test o'tkazgan?
    - 10 dan ortiq
    - ✔ 1000 dan ortiq
    - 100 dan ortiq
    - 5000 dan ortiq
11. Hodisa qaysi variantdan kelganini Backend qanday biladi?
    - Brauzer ID ning birinchi harfidan
    - Hodisa yozilgan soat va daqiqadan
    - ✔ Hodisa bilan kelgan variantdan
    - Ega sahifasidagi bandlar ro'yxatidan
12. Gipotezada «sayt yaxshiroq bo'ladi» deyilgan. Nima yetishmaydi?
    - Qancha vaqt kutish kerakligi
    - Saytga nechta odam kirishi
    - Kodni kim yozishi kerakligi
    - ✔ Qaysi raqam o'zgarishi

Arena yozuvlari: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · O'quvchilar kutilmoqda… · Mentor testni boshlashini kuting… · ▶ Testni boshlash · ▶ Boshlash · Savol N/12 · Javob qabul qilindi — natijani kuting… · Savol N/12 — natija · +N ball · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling! · Siz hozir: N-o'rin · Keyingi → · Natijani ko'rish · Test yakunlandi! · ball · N/12 to'g'ri · eng uzun streak · ↻ Qayta ishlash · Siz — N-o'rin · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish · Arenani yopish

## Kartochkalar

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Gipoteza nima? | «Agar … qilsak, … o'zgaradi, chunki …» shaklidagi tekshiriladigan taxmin | Yoniga qaysi raqamga qarashingiz yoziladi |
| «Maydon» gipotezasi qanday? | Agar tugmada tanlangan soatni yozsak, vaqtni tanlaganlardan ko'proq o'yinchi band qiladi | Chunki o'yinchi qaysi vaqtni band qilayotganini tugmaning o'zida ko'radi |
| Gipotezadagi «chunki» nima uchun kerak? | O'zgarish odamga nega ta'sir qilishini aytadi | Sabab ham taxmin — uni raqam tekshiradi |
| Tugma matni o'zgarsa, qaysi raqamga qaraysiz? | Vaqtni tanlaganlardan band qilganlar foiziga | Tugma vaqt tanlangandan keyin chiqadi |
| A/B test nima? | Odamlarning bir qismi A ni, qolgani B ni ko'radi, keyin raqamlar solishtiriladi | A — hozirgi variant, B — yangi |
| Nega hammaga B ni ko'rsatib, o'tgan hafta bilan solishtirmaymiz? | Haftalar orasida boshqa narsa ham o'zgaradi | Masalan, mahalla chatida e'lon chiqadi |
| Bizning testda brauzer variantni qanday oladi? | Birinchi kirishda tasodifiy, keyin eslab qoladi | `maydon-variant` — sahifa yangilansa ham o'sha variant |
| Bitta o'yinchi telefon va laptopdan kirsa, qaysi variantni ko'radi? | Har brauzerda alohida — ikki xil bo'lishi mumkin | Variant brauzerga beriladi, odamga emas |
| Guruhlar 9 va 8 chiqsa, nimani solishtirasiz? | Har guruhdagi foizni | Tasodifiy bo'lishda guruhlar teng chiqmasligi mumkin |
| A — 9 tadan 3, B — 8 tadan 4. Xulosa chiqarasizmi? | Hali yo'q: 17 ta brauzer xulosa uchun kam | Bu — ishga tushirish mashqi |
| Booking.com o'zgarishni qanday tekshiradi? | Avval foydalanuvchilarning bir qismida, A/B test bilan | 2017-yilda bir vaqtda 1000 dan ortiq A/B test (kompaniya chiqishlari) |
| Hodisa qaysi variantdan kelganini Backend qanday biladi? | hodisaYoz har hodisaga variant ni qo'shadi | `hodisalar` jadvalida `variant` ustuni |

## Yakun
- Dars nomi: Ikki variantdan qaysi biri yaxshiroq ishlaydi?
- Bugungi asosiy fikr: Gipoteza qaysi raqamga qarashni oldindan aytadi, A/B test shu raqamni ikki guruhda bir vaqtda solishtiradi.
- Saqlanadigan natija: o'quvchi gipotezasi (Agar · o'zgaradi · chunki · Raqam) — Amaliyot 1 da saqlanadi, Amaliyot 2 va yakunda «Gipotezam» qatori bo'lib qaytadi.
- Keyingi dars — «Kiberxavfsizlik: zaiflikni topib yopamiz».
