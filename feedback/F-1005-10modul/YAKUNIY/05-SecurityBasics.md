# 5-dars «Kiberxavfsizlik: zaiflikni topib yopamiz» — yakuniy matn

Fayl: `src/8-Modull/SecurityBasicsLesson.jsx` · 18 ekran · Keyingi dars: «Foydalanuvchi sizga ma'lumotini ishonadimi?»
Holat: 06.10.2026 — kodga mos

Darsning bitta vizuali — «Xavfsizlik ro'yxati». Chapda ega sahifasi maketi (yorliq «Sayt · React `/ega`», manzil `maydon/ega`): sarlavha «Bandlar», qidiruv maydoni «Telefon raqami», tugma «Qidirish», ikki qator — **18:00 · Ali** `+998 90 000 00 01` va **17:00 · Bek** `+998 90 000 00 02`.
O'ngda uch zaiflik kartasi (har biri qizil «ochiq» → yashil «yopilgan», raqam o'rniga ✓) va to'rtinchi qator 2FA (kulrang «yo'q» → yashil «qo'shildi»):
- 1 · SQL injection — ega qidiruvi
- 2 · XSS — ro'yxatdagi ism
- 3 · Maxfiy kalit kodda — JWT_SECRET
- 2FA — ega kirishi

## 0 · Kirish
- Eyebrow: Dars · kirish
- Sarlavha: Agent qo'shgan uch o'zgarish xavfsizmi?
- Mentor: O'tgan darsda B variant («18:00 ni band qilish») ishga tushdi — A: 9 dan 3, B: 8 dan 4. Bugun ega sahifasiga qarang: Antigravity uchta o'zgarish qo'shdi.
- Chapda ega sahifasi maketi (yuqoridagidek). «Qidirish» bosilsa, maydonga `+998 90 000 00 01` yoziladi va Ali qatori ajralib chiqadi; shundan keyin o'ngdagi variantlar ochiladi (oldin xira).
- Chat «Antigravity», ikki pufak:
  - Siz: Ega sahifasini yaxshila: telefon bo'yicha qidiruv, ism qalinroq ko'rinsin, Backend kalitsiz ham ishga tushaversin.
  - Antigravity: Tayyor! Uchtasi ham ishlayapti.
- Savol (yorliq): Uchtasi ishlayapti. Xavfsizligini qayerdan bilamiz?
  - Sinab ko'rib — sahifa ochilsa, demak xavfsiz
  - ✔ Koddagi xavfli joylarni o'qib, tuzatib
  - Agentdan so'rab — u xavfsiz desa, yetadi
- Javob izohlari:
  - Birinchisi tanlansa: Qiziq fikr! Sahifa ochilgani kod xavfsizligini bildirmaydi: zaiflik oddiy ma'lumotda ko'rinmasligi mumkin.
  - Ikkinchisi tanlansa: Aynan! Bu misolda uchtasi oddiy ma'lumot bilan ishlaydi. Bu darsda zaiflikni xavfli joylarni o'qib topamiz va tuzatamiz.
  - Uchinchisi tanlansa: Qiziq fikr! Agent talabga tayanib quradi — kodni baribir o'zingiz o'qib tekshirasiz.
- Javobdan keyin chat o'rnida uch zaiflik kartasi birin-ketin chiqadi, hammasi qizil «ochiq».
- Tugma: Bittasini tanlang → Davom etish
- Barcha ekranlarda umumiy: telefonda Mentor yig'ilganda — «Mentor · ko'rsatmani ochish ▾»; jonli darsda mentor hali o'tmagan sahifada oldinga tugma o'rnida — «Mentorni kuting» (izoh: Mentor hali bu sahifaga o'tmadi)

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun ega sahifasining uch zaifligini yopasiz.
- Mentor: Har zaiflikni kodda topib, bitta o'zgarish bilan yopamiz. Oxirida ega kirishiga ikkinchi qadam — telefon ilovasidagi 6 xonali kod qo'shamiz.
- Chap yorliq: Dars oxirida — uch karta yashil, ega kirishi 2FA bilan
- Chapda ega sahifasi maketi va «Xavfsizlik ro'yxati» — bir marta o'zi o'ynaydi: uch karta birin-ketin «ochiq» → «yopilgan», keyin 2FA qatori «yo'q» → «qo'shildi», sahifada «parol + kod ✓».
- O'ngda qadamlar:
  - 01 · Qidiruv so'rovi matnni qo'shmasin · SQL injection
  - 02 · Ism kod emas, matn bo'lib chiqsin · XSS
  - 03 · Maxfiy kalit kodda turmasin · maxfiy kalitlar
  - 04 · Ega kirishiga ikkinchi qadam · 2FA
- Pastki qator: repo `maydon` · boshlanish `m10-dars-05-start` · tayyor namuna `m10-dars-05-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · SQL injection: qidiruv so'rovi
- Eyebrow: Tushuncha · SQL injection
- Sarlavha: Qidiruv so'rovi telefon matnini qanday ishlatadi?
- Mentor: Agent qidiruv so'rovini ikki xil yozishi mumkin. Ikkala ko'rinishni bosib, so'rovga nima tushishiga qarang.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): Telefon matni to'g'ridan so'rov ichiga qo'shilsa, u qanday o'qiladi?
  - Doim oddiy matn bo'lib
  - Ba'zan buyruq bo'lib
  - (tanlangach ixcham qator) Taxminingiz · <savol> · <tanlangan javob>
- Chizma: ega sahifasi (qidiruvda `+998 90 000 00 01`) → yo'lak `GET /bandlar/qidir` (javob qaytganda: javob) → o'ngda 1-karta «SQL injection — ega qidiruvi» (qizil «ochiq») va kod kartasi «Backend · NestJS» (tanlovdan oldin bo'sh).
- Yo'lakdagi ikki tugma (ko'rilgani ✓ bilan): Matnni qo'shib yasash · Parametrli so'rov
  - Matnni qo'shib yasash — kod kartasi:
    ```js
    const sql = "... WHERE telefon = '" + telefon + "'"
    db.query(sql)
    ```
    «Database'ga boradi»: `SELECT * FROM bandlar WHERE telefon = '+998 90 000 00 01'` · ostida (qizil): Telefon matni so'rovga qo'shilib ketadi — matn emas, buyruq bo'lib o'qilishi mumkin.
  - Parametrli so'rov — kod kartasi:
    ```js
    bandlar.find({
      where: { telefon }
    })
    ```
    «Database'ga boradi»: `SELECT * FROM bandlar WHERE telefon = $1` · `$1 = +998 90 000 00 01` · ostida (yashil): Telefon qiymati parametr bo'lib uzatiladi — SQL buyruq satriga qo'shilmaydi. 1-karta yashil «yopilgan».
  - Ikkala ko'rinishda ham javob qaytadi — telefonda Ali qatori topiladi.
- Natija (ikkala ko'rinish ko'rilgach):
  - Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: ba'zan buyruq bo'lib)
  - Foydalanuvchi yozgan matn Database so'roviga buyruq bo'lib qo'shilib ketishi — **SQL injection** deyiladi.
  - Qidiruv so'rovida telefon matnini qo'shmang. Parametrli so'rovda alohida uzatiladi, buyruq bo'lib o'qilmaydi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikki ko'rinishni ko'ring (N/2) → Davom etish

## 3 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: Kodda qaysi belgi SQL injection zaifligini ko'rsatadi?
  - So'rov `GET` emas, `POST` bilan yuborilgan
  - ✔ Foydalanuvchi matni so'rov satriga qo'shilgan
  - Qidiruv telefon bo'yicha, ism bo'yicha emas
  - So'rov `bandlar` jadvaliga yuborilgan
- Javob izohlari:
  - To'g'ri: Matn so'rovga qo'shilsa, u buyruq bo'lib o'qilishi mumkin — shuni parametr bilan ajratamiz.
  - 1-variant: `GET` yoki `POST` so'rov turi — zaiflik matnni qo'shishda.
  - 3-variant: Qaysi ustun bo'yicha qidirish zaiflik emas — matnni qo'shish.
  - 4-variant: Har so'rov bir jadvalga boradi — bu normal.
  - Boshqa holat: Zaiflik — matnni so'rovga qo'shishda.
- Test yozuvlari (3, 5, 7, 10-ekran uchun bir xil): To'g'ri · Qaytadan urinib ko'ring · To'g'ri javob: … · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz.
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 4 · XSS: ro'yxatdagi ism
- Eyebrow: Tushuncha · XSS
- Sarlavha: Ism ekranda matn bo'lib chiqadimi yoki kod bo'lib?
- Mentor: Agent ismni «qalinroq» ko'rsatish uchun ikki yo'ldan birini tanlagan. Ikki ko'rinishni bosib, ism qanday chiqishiga qarang.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): Ism HTML sifatida chiqarilsa, uning ichidagi belgilar nima bo'ladi?
  - Oddiy matn bo'lib ko'rinadi
  - Sahifa kodining bir qismi bo'ladi
- Chizma: ega sahifasi ← yo'lak `b.ism` ← o'ngda 2-karta «XSS — ro'yxatdagi ism» (qizil «ochiq») va kod kartasi «Sayt · Ega.jsx» (tanlovdan oldin bo'sh).
- Yo'lakdagi ikki tugma: HTML sifatida chiqarish · Oddiy matn sifatida
  - HTML sifatida chiqarish — kod kartasi: `<li dangerouslySetInnerHTML={{ __html: b.ism }} />` · maketda Ali yonida «HTML» · ostida (qizil): Ism HTML bo'lib qo'yiladi: ichidagi belgilar sahifa kodining bir qismi bo'lib ketishi mumkin.
  - Oddiy matn sifatida — kod kartasi: `<li>{b.ism}</li>` · maketda Ali yonida «matn» · ostida (yashil): React ismni matn bo'lib chiqaradi: belgilar ekranda ko'rinadi, kod bo'lib ishlamaydi. 2-karta yashil «yopilgan».
- Natija (ikkala ko'rinish ko'rilgach; kod kartasida eski HTML qatori ustidan chizilgan):
  - Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: sahifa kodi bo'ladi)
  - Foydalanuvchi yozgan matn boshqa odamning sahifasida kod bo'lib ishlab ketishi — **XSS (Cross-Site Scripting)** deyiladi.
  - Bu ro'yxatda xavf ismni HTML bo'lib chiqarishda edi. React matni sifatida chiqarsa, shu zaiflik yopiladi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikki ko'rinishni ko'ring (N/2) → Davom etish

## 5 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Ega ro'yxatidagi ismni XSS'dan qanday yopasiz?
  - Ismni Database'da katta harf bilan saqlab
  - Ismni ro'yxatdan butunlay olib tashlab
  - ✔ Ismni oddiy matn sifatida chiqarib
  - Ism uzunligini o'ttiz belgi bilan cheklab
- Javob izohlari:
  - To'g'ri: React matnni matn bo'lib chiqaradi — ichidagi belgilar kod bo'lib ishlamaydi.
  - 1-variant: Katta harf belgini kod bo'lishdan to'xtatmaydi.
  - 2-variant: Ismni olib tashlasak, ega kimligini ko'rmaydi.
  - 4-variant: Uzunlik cheklovi belgini matnga aylantirmaydi.
  - Boshqa holat: Ism oddiy matn bo'lib chiqsin.
- Tugmalar: Orqaga · To'g'ri javobni toping → Davom etish

## 6 · Maxfiy kalit kodda
- Eyebrow: Tushuncha · maxfiy kalit
- Sarlavha: Kalit topilmasa, Backend qayerdan oladi?
- Mentor: «Autentifikatsiya va .env» darsida ko'rgansiz: butun himoya maxfiy kalitga bog'liq. Agent ikki yo'ldan birini yozgan — ikkisini bosib, kalit qayerdan kelishiga qarang.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): Kalit kodda zaxira qiymat bo'lib tursa, uni kim ko'radi?
  - Faqat Backend
  - Kodni ochib ko'rgan har kim
- Chizma: ega sahifasi kirish ekrani («Ega kirishi» · Parol `••••••` · Davom etish) → yo'lak `POST /kirish` (javob qaytganda: `token`, sahifada bandlar ro'yxati) → o'ngda 3-karta «Maxfiy kalit kodda — JWT_SECRET» (qizil «ochiq») va kod kartasi «Backend · NestJS», ostida `.env` qutisi: `JWT_SECRET=…`
- Yo'lakdagi ikki tugma: Zaxira qiymat bilan · Faqat `.env` dan
  - Zaxira qiymat bilan — kod kartasi:
    ```js
    const kalit = process.env.JWT_SECRET
      || 'zaxira-kalit'
    ```
    `.env`: `JWT_SECRET=` · topilmadi · ostida (qizil): Kalit topilmasa kodda turgan qiymat ishlatiladi — kodni o'qigan har kim uni biladi.
  - Faqat `.env` dan — kod kartasi:
    ```js
    const kalit = process.env.JWT_SECRET
    if (!kalit) throw new Error("JWT_SECRET yo'q")
    ```
    `.env`: `JWT_SECRET=••••••` · ostida (yashil): Kalit faqat `.env` dan olinadi; yo'q bo'lsa Backend ishga tushmaydi. 3-karta yashil «yopilgan».
- Natija (ikkala ko'rinish ko'rilgach):
  - Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: har kim ko'radi)
  - Kalit topilmasa kodda turgan muqobil — **zaxira qiymat** deyiladi; maxfiy kalit uchun u xavfli.
  - Maxfiy kalitga zaxira qiymat yozmang. U faqat `.env` dan olinsin — yo'q bo'lsa Backend ishga tushmasin.
  - `.env` GitHub'ga chiqmaydi; prodda shu qiymatlar Render sozlamasida beriladi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikki ko'rinishni ko'ring (N/2) → Davom etish

## 7 · 3-savol
- Eyebrow: Mashq · 3-savol
- Savol: Nega `JWT_SECRET` ga kodda zaxira qiymat yozilmaydi?
  - ✔ Kodni o'qigan har kim uni ko'radi
  - Zaxira qiymat juda uzun bo'lib ketadi
  - Backend uni `.env` dan o'qiy olmaydi
  - Zaxira qiymat Database'ga yozib qo'yiladi
- Javob izohlari:
  - To'g'ri: Maxfiy kalit kodda turmasin: u faqat `.env` da bo'lsa, kodni ochgan odam ko'rmaydi.
  - 2-variant: Uzunlik muhim emas — kalit kodda ko'rinmasligi kerak.
  - 3-variant: Backend `.env` dan o'qiydi — «Autentifikatsiya va .env» darsida shunday edi.
  - 4-variant: Kalit Database'ga emas, `.env` ga yoziladi.
  - Boshqa holat: Maxfiy kalit kodda ko'rinmasin.
- Tugmalar: Orqaga · To'g'ri javobni toping → Davom etish

## 8 · Parametrli so'rovni yozamiz
- Eyebrow: Kod yozish · parametrli so'rov
- Sarlavha: Telefonni SQL'dan ajratadigan kod yozamiz.
- Mentor: Kod oynasida parametrli so'rovning bir ko'rinishini `$1` bilan yozasiz. «Maydon» repo'sida TypeORM `find({ where: { telefon } })` ham qiymatni xuddi shunday alohida uzatadi.
- Chapda vazifa (band ustiga borilsa, koddagi o'sha joy yonadi):
  1. Matn qo'shib yasalgan `const sql = ...` qatorini o'chiring.
  2. `qidir(telefon)` ichida parametrli so'rov yozing: `db('... WHERE telefon = $1', [telefon])`.
  3. Oddiy telefon bilan sinang — Ali qatori chiqsin.
- Ostida kichik ega sahifasi (qidiruvda `+998 90 000 00 01`) va uch qator (kirishda bir marta birin-ketin yonadi):
  1. eski qator o'chdi · `const sql`
  2. qiymat alohida · `$1 · [telefon]`
  3. Ali qatori chiqdi · `18:00 · Ali`
- Tugma: Yordam → Telefon matni so'rov satriga qo'shilmaydi. `$1` — so'rovdagi o'rin, qiymat alohida ro'yxatda (`[telefon]`) uzatiladi. Kodni o'zingiz terib yozasiz — qo'lda yozganda o'rganiladi.
- O'ngda `app.js` (1 va 2 raqamli belgilar — ikki izoh qatorida):
  ```js
  function qidir(telefon) {
    // Eski qator (o'chiring): matn qo'shib yasalgan
    const sql = "SELECT * FROM bandlar WHERE telefon = '" + telefon + "'"
    return db(sql)

    // Shu yerga: parametrli so'rov
  }

  document.querySelector('#qidir').addEventListener('click', function () {
    const telefon = document.querySelector('#telefon').value
    korsat(qidir(telefon))
  })
  ```
- Tugma: Kompilyatorni ochish · ostida: Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.
- Kod oynasi: eyebrow «Kod yozish» · sarlavha «app.js — qidiruvni parametrli so'rov qiling» · fayllar `app.js` (yuqoridagi kod) va `index.html`:
  ```html
  <h1>Maydon · ega</h1>
  <input id="telefon" value="+998 90 000 00 01">
  <button id="qidir">Qidirish</button>
  <ul id="natija"></ul>

  <script>
  // db.js — tayyor qism, o'zgarmaydi
  var bandlar = [
    { soat: '18:00', ism: 'Ali', telefon: '+998 90 000 00 01' },
    { soat: '17:00', ism: 'Bek', telefon: '+998 90 000 00 02' }
  ];
  // db(sql, qiymatlar) — faqat parametrli so'rovni bajaradi: $1 va qiymatlar ro'yxati
  function db(sql, qiymatlar) {
    if (String(sql).indexOf('$1') === -1 || !Array.isArray(qiymatlar)) {
      return { xabar: "So'rovni parametr bilan yozing" };
    }
    return bandlar.filter(function (b) { return b.telefon === String(qiymatlar[0]).trim(); });
  }
  // natija ro'yxatga oddiy matn bo'lib chiqadi (textContent)
  function korsat(natija) {
    var ul = document.querySelector('#natija');
    while (ul.firstChild) ul.removeChild(ul.firstChild);
    var qatorlar = Array.isArray(natija)
      ? natija.map(function (b) { return b.soat + ' · ' + b.ism + ' · ' + b.telefon; })
      : [natija && natija.xabar ? natija.xabar : 'Hech narsa topilmadi'];
    if (!qatorlar.length) qatorlar = ['Hech narsa topilmadi'];
    qatorlar.forEach(function (q) {
      var li = document.createElement('li');
      li.textContent = q;
      ul.appendChild(li);
    });
  }
  // kod oynasi shartni shu yerda sinab ko'radi
  window.addEventListener('load', function () {
    var r = null;
    try { r = qidir('+998 90 000 00 01'); } catch (e) { r = null; }
    window.natija = [Array.isArray(r) && r.length === 1 && r[0].ism === 'Ali'];
  });
  </script>
  ```
- Shartlar (kod oynasida, bajarilganda ✓):
  1. Matn qo'shib yasalgan const sql qatori qolmasin.
  2. So'rov $1 va [telefon] bilan yozilsin.
  3. Oddiy telefon bilan Ali qatori chiqsin.
- Kod oynasidan qaytilgach (vazifa bandlari ✓): Parametrli so'rovda telefon matni alohida uzatiladi — so'rovga qo'shilmaydi, buyruq bo'lib o'qilmaydi.
- Tugmalar: Orqaga · Kodni yozing → Davom etish

## 9 · Ega kirishiga ikkinchi qadam
- Eyebrow: Tushuncha · 2FA
- Sarlavha: Parol begona qo'lga o'tsa, ega sahifasini kim ochadi?
- Mentor: Hozir ega faqat parol bilan kiradi. Qadamlarni bajaring va kirishga ikkinchi qadam qo'shilsa nima o'zgarishini ko'ring.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): Paroldan tashqari telefon ilovasidagi 6 xonali kod ham so'ralsa, parolning o'zi kirishga yetadimi?
  - Ha, parol yetadi
  - Yo'q, kod ham kerak
- Chizma: chapda ikki telefon — ega sahifasi («Ega kirishi» · Parol · Davom etish) va «Telefon ilovasi» (Maydon · ega · `— — —` · 30 s); yo'lak `POST /kirish` (oxirida: `token`); o'ngda 2FA qatori (kulrang «yo'q») va kod kartasi «Backend · NestJS»: parol · `EGA_PAROLI` · ✓ · 6 xonali kod · `EGA_2FA_KALITI` · ✓ (oxirida: token →).
- Telefon ostidagi tugma (qadamlar, N/3):
  1. Parol bilan kiring — parol `••••••` yoziladi, «6 xonali kod» maydoni chiqadi, ilovada kod `284 193` ko'rinadi.
  2. Telefon ilovasidagi kodni yozing — kod maydonga tushadi, sahifa tugmasi «Kirish»; o'ngda: Parol + telefon ilovasidagi 6 xonali kod — **ikki bosqichli kirish (2FA)** deyiladi.
  3. Ichkariga kiring — sayt parol va kodni birga Backend'ga yuboradi, Backend ikkalasini ✓ qiladi, token qaytadi, sahifada bandlar ro'yxati va «parol + kod ✓»; 2FA qatori yashil «qo'shildi».
- Natija (3 qadamdan keyin):
  - Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: kod ham kerak)
  - Parol + telefon ilovasidagi 6 xonali kod — **ikki bosqichli kirish (2FA)** deyiladi.
  - Parol begona qo'lga o'tsa ham, telefon ilovasidagi kodsiz ega sahifasi ochilmaydi.
  - Token faqat Backend parolni ham, kodni ham bitta so'rovda tekshirgandan keyin beriladi.
  - Kodni Backend va telefon ilovasi bir xil maxfiy kalitdan (`EGA_2FA_KALITI`) hisoblaydi — kalit `.env` da turadi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish

## 10 · 4-savol
- Eyebrow: Mashq · 4-savol
- Savol: 2FA ega kirishini nega mustahkamlaydi?
  - Parolni telefon ilovasida saqlab qo'yadi
  - Backend'ni so'rovsiz uxlab qolishdan saqlaydi
  - Har kirishda yangi parol o'ylab topadi
  - ✔ Paroldan tashqari telefon ilovasidagi kodni so'raydi
- Javob izohlari:
  - To'g'ri: Parol begona qo'lga o'tsa ham, telefon ilovasidagi kodsiz kira bo'lmaydi.
  - 1-variant: 2FA parolni saqlamaydi — qo'shimcha kod so'raydi.
  - 2-variant: Backend uxlashi 2FA bilan bog'liq emas.
  - 3-variant: Parol o'zgarmaydi — ikkinchi qadam qo'shiladi.
  - Boshqa holat: 2FA paroldan tashqari kod so'raydi.
- Tugmalar: Orqaga · To'g'ri javobni toping → Davom etish

## 11 · Qanday tekshiramiz
- Eyebrow: Tajriba · tekshiruv
- Sarlavha: Xavfli kod olib tashlanganini qanday bilasiz?
- Mentor: Bu darsda zaiflikni hujum qilmasdan tekshiramiz: kodni o'qiymiz va saytni oddiy ma'lumot bilan sinaymiz. «Tekshiring»ni bosing va uch belgiga qarang.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): Zaiflik yopilganini qanday bilamiz?
  - Saytga hujum qilib ko'rib
  - Kodni o'qib va oddiy ma'lumot bilan sinab
- Chizma: ega sahifasi («parol + kod ✓», ostida tugma «Tekshiring») → yo'lak «oddiy ma'lumot» → o'ngda «Xavfsizlik ro'yxati» (uch karta yashil «yopilgan», 2FA «qo'shildi»), har kartada belgi va ikki yorliq:
  - SQL injection — Qidiruv so'rovida matn qo'shilmagan (parametrli) · kodni o'qidik · oddiy ma'lumot bilan to'g'ri ishlaydi
  - XSS — Ism oddiy matn bo'lib chiqadi · kodni o'qidik · oddiy ma'lumot bilan to'g'ri ishlaydi
  - Maxfiy kalit kodda — `JWT_SECRET` faqat `.env` dan · kodni o'qidik · oddiy ma'lumot bilan to'g'ri ishlaydi
- «Tekshiring» bosilsa: har belgida avval «✓ kodni o'qidik», keyin «✓ oddiy ma'lumot bilan to'g'ri ishlaydi»; sahifada qidiruv Ali qatorini topadi.
- Natija:
  - Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: kodni o'qib va sinab)
  - Bu tekshiruvni faqat o'z saytingizda qilasiz. Boshqa saytni egasining ruxsatisiz tekshirmaysiz.
  - Bugungi uch xavfli naqsh olib tashlanganini kodni o'qib va oddiy ma'lumot bilan sinab tekshirdik.
  - Bu butun sayt xavfsiz degani emas — bugun topilgan uch zaiflik haqida.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Tekshiring → Davom etish

## 12 · Yakuniy · ega kirishi 2FA bilan
- Eyebrow: Yakuniy · tartib
- Sarlavha: Ega 2FA bilan qanday kiradi?
- Mentor: Bo'laklarni sodir bo'lish tartibida joylang.
- 5 ta uya (raqam va «bu yerga qo'ying»); bo'laklar aralash (sudrash yoki bosish).
- To'g'ri tartib:
  1. Ega parolni yozadi
  2. Ega telefon ilovasidagi 6 xonali kodni yozadi
  3. Sayt parol va kodni birga Backend'ga yuboradi
  4. Backend parolni ham, kodni ham tekshiradi
  5. Ikkalasi to'g'ri bo'lsa token beriladi, ro'yxat ochiladi
- Hamma uya to'lib tartib xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring.
- Yechilgach: Token faqat Backend parolni ham, kodni ham tekshirgandan keyin beriladi.
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## 13 · Amaliyot 1 — uch zaiflikni yopamiz + 2FA kaliti
- Eyebrow: Amaliyot 1 · Backend
- Sarlavha: Uch zaiflikni yoping va 2FA kalitini qo'shing.
- Mentor: Tuzatishni Antigravity yozadi — kodni va `.env` ni esa siz o'qib tekshirasiz. **«1 · Ochish»**dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim» tugmasi):
  1. Ochish — Antigravity'da `maydon` papkasini oching. Terminalda `cd backend`, keyin `npm run start:dev`; brauzerda `localhost:3000` — «Maydon Backend ishlayapti». **Bu teg faqat laptopdagi mashq uchun: uni push qilmang va Render'ga chiqarmang — unda ataylab qoldirilgan zaifliklar bor.**
  2. Prompt — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       ```
       Qayerda: backend/ — ega qidiruvi, imzo kaliti va app.module.ts.
       Nima qilsin: (1) ega telefon qidiruvi parametrli so'rov bo'lsin (TypeORM find({ where: { telefon } })), matn qo'shib yasalgan so'rov olib tashlansin. (2) JWT_SECRET ning kodda turgan zaxira qiymati olib tashlansin — kalit faqat .env dan olinsin, yo'q bo'lsa Backend ishga tushmasin. (3) Ega kirishiga ikkinchi qadam qo'shilsin: POST /kirish parol va 6 xonali kodni birga olsin; token faqat ikkalasi Backend'da tekshirilgandan keyin berilsin; kod .env dagi EGA_2FA_KALITI dan hisoblansin.
       Nima buzilmasin: bandlar va hodisalar yo'llari, 4-darsdagi variant ustuni o'zgarmasin. O'zgargan fayllarni ayt.
       ```
  3. Ishga tushirish — `backend/.env` ga qator qo'shing: `EGA_2FA_KALITI=` va README'dagi buyruq bilan kalit yarating (kalitni telefon ilovasiga qo'shish ham README'da — bir martalik). Backend terminali o'zi qayta ishga tushadi, xato yo'q.
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. Kodni o'qib tekshirish — uch belgini o'z ko'zingiz bilan ko'ring: (1) qidiruvda matn qo'shib yasalgan so'rov yo'q, `find({ where: { telefon } })` bor; (2) kodda `|| '…'` zaxira kalit yo'q; (3) `POST /kirish` parolni ham, kodni ham tekshiradi — noto'g'ri kod bilan token yo'q (401). Agent nima desa ham, kod shuni ko'rsatsin.
  5. O'z g'oyangiz — qavs ichini o'z loyihangiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying — uyda o'z papkangizda yuborasiz:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       ```
       Qayerda: {loyiha papkasi}/backend.
       Nima qilsin: {aniq qidiruv yoki filtr} so'rovida foydalanuvchi matni SQL satriga qo'shilmasin — parametrli so'rov bo'lsin; maxfiy kalitlar faqat .env dan olinsin (zaxira qiymatsiz); {ega yoki admin} kirishida token faqat parol va 6 xonali kod birga tekshirilgandan keyin berilsin.
       Nima buzilmasin: boshqa yo'llar va jadvallar o'zgarmasin. O'zgargan fayllarni ayt.
       ```
- O'ng tomon «kutilgan natija · namuna: Maydon» — kod kartasi «Backend · NestJS»:
  ```js
  bandlar.find({ where: { telefon } })
  secret: process.env.JWT_SECRET
  totp.validate({ token: kod, window: 1 }) !== null
  POST /kirish { parol, kod } → token
  ```
  va «Xavfsizlik ro'yxati»: 1 · SQL injection — yopilgan · 2 · XSS — ochiq · 3 · Maxfiy kalit kodda — yopilgan · 2FA — qo'shildi
- Hammasi bajarilgach: Backend tayyor: qidiruv parametrli, maxfiy kalit faqat `.env` da, kirish ikki qadamli.
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-05-start`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 14 · Amaliyot 2 — ega sahifasi va push
- Eyebrow: Amaliyot 2 · sayt → push
- Sarlavha: Ega sahifasini xavfsiz qiling va push qiling.
- Mentor: Ism endi oddiy matn bo'lib chiqsin, kirishda kod so'ralsin — keyin push qilasiz. **«1 · Ochish»**dan boshlang.
- Qadamlar (har birida «Bajardim» tugmasi):
  1. Ochish — Backend terminali ishlab tursin. Ikkinchi terminalda `cd web`, keyin `npm run dev`; brauzerda `localhost:5173/ega`.
  2. Prompt — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       ```
       Qayerda: web/src/Ega.jsx — bandlar ro'yxati va kirish formasi.
       Nima qilsin: (1) ism oddiy matn sifatida chiqsin — dangerouslySetInnerHTML olib tashlansin, {b.ism} qolsin. (2) kirish formasi ikki qadamli bo'lsin: avval parol, keyin 6 xonali kod maydoni; «Kirish» parol va kodni birga POST /kirish ga yuborsin.
       Nima buzilmasin: bandlar ro'yxati va kun almashtirgichi o'zgarmasin; kirish muvaffaqiyatsiz bo'lsa ro'yxat ochilmasin va xato ko'rsatilsin. O'zgargan fayllarni ayt.
       ```
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  3. Kodni o'qib tekshirish va sinash — `Ega.jsx` da `dangerouslySetInnerHTML` yo'qligini ko'ring. Saytda parol bilan kiring: 6 xonali kod so'ralsin (telefon ilovasidagi kod). Noto'g'ri kod bilan ro'yxat ochilmasin. Oddiy ism bilan ro'yxat to'g'ri chiqsin.
  4. Push — uch zaiflik yopilgani va 2FA ishlaganiga ishonch hosil qilgach: `git add .` yoki `git add -A` bilan hammasini emas — `git status` bilan o'zgargan fayllarni ko'rib, faqat shularni qo'shing, `git commit`, `git push`. Render va Netlify push'dan keyin o'zi yangilanadi. (`.env` push qilinmaydi — `.gitignore` da.)
  5. O'z g'oyangiz — qavs ichini to'ldiring, «Nusxalash» — uyda o'z loyihangizda yuborasiz:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       ```
       Qayerda: {loyiha papkasi}/web — foydalanuvchi matni ko'rinadigan joy.
       Nima qilsin: foydalanuvchi yozgan matn oddiy matn sifatida chiqsin (HTML bo'lib emas); {ega yoki admin} kirishi ikki qadamli bo'lsin — parol va kod birga yuborilsin.
       Nima buzilmasin: qolgan sahifalar ishlayversin; kirish muvaffaqiyatsiz bo'lsa ichkari ochilmasin.
       ```
- O'ng tomon «kutilgan natija · namuna: Maydon» — ega sahifasi (bandlar ro'yxati, «parol + kod ✓», Ali yonida «matn») va oqim:
  1. parol
  2. 6 xonali kod maydoni
  3. ✓ bandlar ro'yxati — `18:00 · Ali · +998 90 000 00 01` (ism oddiy matn)
- Hammasi bajarilgach: Ega sahifasi xavfsiz: ism matn bo'lib chiqadi, kirishda kod so'raladi — endi push qilsa bo'ladi.
- Pastki qator: Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-05-done`
- Oxirgi «Bajardim»da nishon: Hardened
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 15 · Natijalar (podium) — jonli reyting

## 16 · Takrorlash
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.
- Karta ostida (birinchi bosishgacha): Kartani bosing — javob ochiladi
- Kartochkalar (12 ta):

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Zaiflik nima? | Kodda begona odam foydalanishi mumkin bo'lgan xato | Yopish — uni tuzatish |
| SQL injection nima? | Foydalanuvchi yozgan matn Database so'roviga buyruq bo'lib qo'shilib ketishi | Belgi: matn so'rov satriga qo'shilgan |
| SQL injection qanday yopiladi? | Parametrli so'rov bilan | Matn alohida uzatiladi, so'rovga qo'shilmaydi |
| XSS nima? | Foydalanuvchi yozgan matn boshqa odamning sahifasida kod bo'lib ishlab ketishi | XSS — Cross-Site Scripting |
| Bu ro'yxatdagi XSS qanday yopildi? | Ismni oddiy matn sifatida chiqarib | dangerouslySetInnerHTML o'rniga {b.ism} |
| XSS belgisi kodda qaysi? | dangerouslySetInnerHTML | Foydalanuvchi matni HTML bo'lib chiqadi |
| Maxfiy kalit qayerda turadi? | .env faylida, kodda emas | JWT_SECRET, EGA_PAROLI, EGA_2FA_KALITI |
| Zaxira qiymat nega xavfli? | Kodni o'qigan har kim kalitni ko'radi | Belgi: `\|\| '…'` maxfiy kalit yonida |
| 2FA nima? | Ikki bosqichli kirish: parol + telefon ilovasidagi 6 xonali kod | Token — Backend ikkalasini tekshirgandan keyin |
| 6 xonali kodni nima hisoblaydi? | Telefon ilovasi va Backend — bir xil kalitdan | Kod odatda 30 soniyada yangilanadi |
| Bu darsda zaiflik yopilganini qanday tekshirdik? | Kodni o'qib va saytni oddiy ma'lumot bilan sinab | Faqat o'z saytingizda; bu butun sayt xavfsizligi emas |
| EGA_2FA_KALITI qayerda saqlanadi? | .env faylida | Backend va telefon ilovasi undan bir xil kod hisoblaydi |

- Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 17 · Yakun
- Eyebrow: Tayyor
- Belgilar: ✓ Uch zaiflik yopilgan · N/5 to'g'ri
- Sarlavha: Uch zaiflik yopilgan, ega kirishi 2FA bilan.
- Qator: Bu darsda zaiflikni hujum qilmasdan, koddagi xavfli belgilarni o'qib topasiz: matn so'rovga qo'shilganmi, HTML bo'lib chiqqanmi, maxfiy kalit kodda turganmi.
- Arena tugmasi CODE STRIKE (jonli darsda: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - SQL injection — foydalanuvchi matni so'rovga qo'shilib ketishi; parametrli so'rov buni yopadi.
  - XSS — foydalanuvchi matni sahifada kod bo'lib ishlab ketishi; bu ro'yxatda ism oddiy matn bo'lib chiqqach, shu zaiflik yopildi.
  - Maxfiy kalit kodda turmasin — faqat `.env` dan olinadi, yo'q bo'lsa Backend ishga tushmaydi.
  - 2FA — parol va telefon ilovasidagi 6 xonali kod; parol begona qo'lga o'tsa ham kod kerak.
  - Zaiflikni kodni o'qib va saytni oddiy ma'lumot bilan sinab tekshiramiz — faqat o'z saytingizda.
- Katta tugma: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda suzuvchi so'zlar: SQL injection · XSS · maxfiy kalit · 2FA)
- Bosilgach karta «Uyda nima qilasiz?» (kim uchun — o'z loyihangiz · nechta — 3 zaiflik + 2FA · muddat — keyingi darsgacha):
  1. Zaifliklar — A1 dagi «O'z g'oyangiz» promptini loyihangizda yuboring: foydalanuvchi matnli so'rovlar parametrli, maxfiy kalitlar faqat `.env` da.
  2. Ism — A2 dagi promptni yuboring: foydalanuvchi yozgan matn oddiy matn bo'lib chiqsin.
  3. Ikkinchi qadam — ega yoki admin kirishiga 6 xonali kod qo'shing, kodni o'qib tekshiring va push qiling.
  - Keyingi dars — «Foydalanuvchi sizga ma'lumotini ishonadimi?». Ma'lumot sizib chiqsa nima bo'ladi: audit va maxfiylik siyosati.
- Nishonlaringiz — N/5
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- SQL Shield — SQL injection belgisini kodda topdingiz (3-ekran, 1-savol — birinchi urinishda to'g'ri)
- Clean Output — Ismni XSS'dan qanday yopishni bildingiz (5-ekran, 2-savol)
- Key Keeper — Maxfiy kalit nega kodda turmasligini bildingiz (7-ekran, 3-savol)
- Two Steps — 2FA ega kirishini nega mustahkamlashini bildingiz (10-ekran, 4-savol)
- Hardened — Ikki amaliyot blokini oxirigacha bajardingiz (14-ekran, oxirgi «Bajardim» — bonus)
- Nishon olinganda (butun ekran): <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «SQL injection belgisi»
   - `"... telefon = '" + telefon` — Matn so'rovga qo'shilgan — zaiflik shu yerda.
   - `find({ where: { telefon } })` — Parametrli so'rov — matn alohida uzatiladi.
   - `SQL injection` — Matn so'rovga buyruq bo'lib qo'shilib ketishi.
   - Sinfga savol: Matn qo'shilgan so'rov nega xavfli?
2. 2-savol (5-ekran) — «XSS yopish»
   - `dangerouslySetInnerHTML` — Ism HTML bo'lib chiqadi — zaiflik shu yerda.
   - `{b.ism}` — React matnni matn bo'lib chiqaradi — kod bo'lib ishlamaydi.
   - `XSS` — Matn boshqa odamning sahifasida kod bo'lib ishlab ketishi.
   - Sinfga savol: Ismni butunlay olib tashlasak, ega nimani yo'qotadi?
3. 3-savol (7-ekran) — «Maxfiy kalit»
   - `|| 'zaxira-kalit'` — Zaxira kalit kodda — kodni o'qigan ko'radi.
   - `process.env.JWT_SECRET` — Kalit faqat `.env` dan olinadi.
   - `if (!kalit) throw` — Kalit yo'q bo'lsa — Backend ishga tushmaydi.
   - Sinfga savol: Umami ID ham maxfiy kalitmi?
4. 4-savol (10-ekran) — «2FA»
   - `EGA_2FA_KALITI` — Backend va telefon ilovasi kodni bir xil kalitdan hisoblaydi.
   - 6 xonali kod — Telefon ilovasida ko'rinadi, odatda 30 soniyada yangilanadi.
   - parol → kod → token — Ikki qadam to'g'ri bo'lsa, token beriladi.
   - Sinfga savol: Parol begona qo'lga o'tsa, kodsiz kira bo'ladimi?
5. Yakuniy (12-ekran) — «Ega kirishi tartibi»
   - `EGA_PAROLI` — Avval parol `.env` bilan tekshiriladi.
   - `EGA_2FA_KALITI` — Keyin 6 xonali kod hisoblab solishtiriladi.
   - `token` — Ikkisi mos kelsa — token beriladi, ro'yxat ochiladi.
   - Sinfga savol: Parolni o'tkazib, to'g'ridan kodga o'tsa bo'ladimi?

## Jonli viktorina (12 savol)
Arena yozuvlari (o'quvchi ko'radigan; emoji olib tashlangan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · (jonli) Mentor testni boshlashini kuting… · (mustaqil) ▶ Boshlash · Savol N/12 · (jonli) ✔ Javob qabul qilindi — natijani kuting… · Savol N/12 — natija · +N ball · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling! · (jonli) Siz hozir: N-o'rin · (mustaqil) Keyingi → / Natijani ko'rish · Test yakunlandi! · (mustaqil) N ball · N/12 to'g'ri · eng uzun streak · ↻ Qayta ishlash · (jonli) Siz — N-o'rin · N ball · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · Arenani yopish · (dars tugagan bo'lsa) Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish

1. SQL injection nima?
   - ✔ Foydalanuvchi matni so'rovga buyruq bo'lib qo'shilishi
   - Database'dagi bitta jadvalning noto'g'ri nomlanishi
   - Backend'ning so'rovga sekin javob berishi
   - Saytning telefon raqamini xato ko'rsatishi
2. Qidiruvni SQL injection'dan nima yopadi?
   - Telefonni katta harfga aylantirish
   - ✔ Parametrli so'rov
   - Qidiruvni butunlay o'chirish
   - So'rovni `POST` bilan yuborish
3. Kodda SQL injection belgisi qaysi?
   - So'rov `bandlar` jadvaliga yuborilgani
   - Qidiruv ism emas, telefon bo'yicha ekani
   - ✔ Foydalanuvchi matni so'rov satriga qo'shilgani
   - So'rov Database'dan bitta javob qaytargani
4. XSS (Cross-Site Scripting) nima?
   - Backend'ning ikki marta ketma-ket ishga tushishi
   - Parolning sayt kodida ochiq qolib ketishi
   - Database so'rovining sezilarli sekinlashuvi
   - ✔ Foydalanuvchi matni sahifada kod bo'lib ishlashi
5. Ega ro'yxatidagi ismni XSS'dan nima yopadi?
   - ✔ Oddiy matn sifatida chiqarish
   - Ismni Database'dan o'chirish
   - Ismni katta harf qilish
   - Ism uzunligini cheklash
6. Kodda XSS belgisi qaysi?
   - Ism Database'da saqlangani (`bandlar` jadvalida)
   - ✔ Ism HTML sifatida chiqarilgani (`dangerouslySetInnerHTML`)
   - Ism ro'yxatda ko'ringani (`Ega.jsx` sahifasida)
   - Ism token bilan kelgani (`GET /bandlar` javobida)
7. Maxfiy kalit qayerda turishi kerak?
   - `app.module.ts` faylining boshida
   - Sayt kodining ichida
   - ✔ `.env` faylida, kodda emas
   - Database'dagi alohida jadvalda
8. `JWT_SECRET` ga zaxira qiymat nega yozilmaydi?
   - Backend uni o'qiy olmaydi
   - Zaxira qiymat juda uzun bo'ladi
   - Qiymat Database'ga ko'chadi
   - ✔ Kodni o'qigan har kim uni ko'radi
9. 2FA nima?
   - ✔ Parol va telefon ilovasidagi 6 xonali kod
   - Ikki xil parol bilan ketma-ket kirish
   - Parolni ikki marta, ikki joyga yozish
   - Database'ning ikki nusxasini saqlash
10. 6 xonali kodni nima hisoblaydi?
    - Faqat Backend o'zi, ilovasiz hisoblaydi
    - ✔ Telefon ilovasi va Backend bir kalitdan
    - Faqat telefon ilovasi, Backend'siz
    - Database har so'rovda yangidan yaratadi
11. Zaiflik yopilganini qanday tekshiramiz?
    - Boshqa odamning saytini sinab ko'rib
    - Agentdan so'rab, uning javobiga ishonib
    - ✔ Kodni o'qib va oddiy ma'lumot bilan sinab
    - Sahifa xatosiz ochilishini kutib turib
12. Push qachon qilinadi?
    - Zaifliklardan oldin, keyin tuzatib
    - Dars boshida, hammasidan avval
    - Agent aytganda, tekshirmasdan
    - ✔ Zaifliklar yopilgandan keyin

## Kartochkalar
16-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 17-ekrandagi 5 qator.
- Keyingi dars — «Foydalanuvchi sizga ma'lumotini ishonadimi?».
