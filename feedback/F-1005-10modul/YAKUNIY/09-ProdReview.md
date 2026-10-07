# 9-dars «Loyiha kuni: prodga ko'tarish — 2-qism» — yakuniy matn

Fayl: `src/8-Modull/ProdReviewLesson.jsx` · 12 ekran (8 ekran + 3 amaliyot bloki + kartochkalar) · Keyingi dars: «Bir yilda nimalarni qurdingiz?»
Holat: 06.10.2026 — kodga mos

## 0 · Kirish — sinfdosh «Nega?» deb yozdi
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: Sinfdosh kodingizga «Nega?» deb yozdi. Nima deysiz?
- Mentor: Boshqa odam kodni o'qib izoh yozishi code review deyiladi. Uch variantdan bittasini tanlang.
- Maket (chap) — PR sahifasi: manzil `github.com/…/maydon/pull/1` · Prod ro'yxati: chegara, xato holatlari, A/B yakuni #1 · Open · `main` ← `prod` · Conversation · Files changed
  - Fayl `backend/src/app.module.ts`:
    ```js
    + ThrottlerModule.forRoot({
    +   throttlers: [{ ttl: 60_000, limit: 60 }],
    ```
  - Ikkinchi qator ostida izoh — sinfdosh: Nega chegara Backend'da? Saytda tugma bir daqiqaga o'chsa, Backend'ga keraksiz so'rov bormaydi.
  - Ostida bo'sh javob joyi (uzuq chiziq); variant tanlangach javob — muallif: **Sabab:** so'rovni saytsiz ham, to'g'ridan Backend'ga yuborsa bo'ladi; chegara Backend'da tursa, Backend'ga kelgan har so'rovga ishlaydi. · Qaror: qoldi
- Savol: Sizningcha, qaysi biri?
  - Agent shunday yozgan, men tegmaganman
  - ✔ So'rovni saytsiz ham yuborsa bo'ladi
  - Mayli, aytganingizdek saytga ko'chiraman
- Javob izohlari:
  - 2-variant: **Aynan!** Bu — qaror sababi: so'rovni saytsiz ham yuborsa bo'ladi, chegara esa Backend'ga kelgan har so'rovga ishlaydi.
  - 1-variant: **Qiziq fikr!** Kodni agent yozgan bo'lsa ham, qaror sizniki. Sabab: so'rovni saytsiz ham yuborsa bo'ladi.
  - 3-variant: **Qiziq fikr!** Rozi bo'lishdan oldin sababni o'ylang: so'rovni saytsiz ham yuborsa bo'ladi.
- Tugma: Bittasini tanlang → Davom etish

## 1 · Bugun quramiz
- Eyebrow: Reja
- Sarlavha: Dars oxirida ko'rib chiqilgan kod internetga chiqadi.
- Mentor: Kodni sinfdosh o'qiydi, kamchilikni agent tuzatadi, qarorni esa siz tushuntirasiz. «Maydon» — namuna: har amaliyot oxirida shu ishni o'z eng yaxshi loyihangiz uchun ham yozasiz.
- Chap — yorliq: Dars oxirida · PR maketi (Prod ro'yxati: chegara, xato holatlari, A/B yakuni #1 · Open · `main` ← `prod` · Conversation), bir marta o'zi yuradi:
  - `web/src/BandForma.jsx` — **Joy:** tugma matni, endi hamma B ni ko'radi · javob: Qaror: qoldi
  - `backend/src/app.module.ts` — **Joy:** so'rovlar chegarasi Backend'da · javob: Qaror: qoldi
  - `web/src/App.jsx` — **Joy:** `/ega` dagi bandlar ro'yxati (`web/src/Ega.jsx`) · javob: Qaror: tuzataman · ✓ Tuzatildi
  - Oxirida holat belgisi «Open» → «Merged»
- O'ng — 3 qadam:
  - 01 · O'tgan darsdagi o'zgarishlar sinfdoshga ko'rsatiladi
  - 02 · Code review: har qarorni tushuntirasiz
  - 03 · Topilgan kamchilik tuzatilib, kod birlashtiriladi
- Pastki qator: repo `maydon` · boshlang'ich holat `m10-dars-09-start` · namuna `m10-dars-09-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · O'zgarish internetga qanday chiqadi?
- Eyebrow: Tushuncha · Pull Request
- Sarlavha: O'zgarish internetdagi saytga qanday yetib boradi?
- Mentor: O'zgarishni birlashtirishdan oldin ko'rsatish so'rovi Pull Request (PR) deyiladi — ikki yo'lni ham bosib ko'ring.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): O'tgan darsdagi so'rovlar chegarasi hozir qayerda ishlayapti?
  - Hech qayerda · Faqat laptopda · Laptopda ham, internetda ham
  - Tanlangach ixcham qator: Taxminingiz · savol · tanlov
- Chap — telefon (ega sahifasi): `maydon-….netlify.app/ega` · Maydon · ega · ‹ Shanba › · Shanba · bandlar · ro'yxat: 17:00 · 20:00
- O'ng — tarmoq chizmasi: `prod` (uch nuqta) · laptopda ishlayapti · `main` · Render · Netlify
- Ikki yo'l tugmasi:
  - ▶ To'g'ridan `main` ga push → nuqtalar `main` ga o'tadi, Render · Netlify yonadi, ega sahifasidagi ro'yxat joyi bo'sh qoladi (qizil) → natija: ✗ Hech kim o'qimadi — kamchilik internetga chiqdi.
  - ▶ PR orqali birlashtirish → PR kartasi (Pull Request · Files changed · `web/src/App.jsx` `+{kechikdi && (…)}`), sinfdosh izohi «`/ega` da-chi?», `prod` da yangi nuqta «tuzatish», «Merge pull request» bosiladi → ega sahifasi: Bandlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin. → ro'yxat (yashil) → natija: ✓ Sinfdosh o'qidi — kamchilik birlashtirishdan oldin tuzatildi.
- Natija bloki: ✓ Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: faqat laptopda — `prod` hali birlashtirilmagan)
- Xulosa: Bu repo'da sayt `main` dan chiqadi. PR'da kod oldindan o'qiladi, kamchilikni ertaroq ko'rish mumkin.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikki yo'lni bosing (N/2) → Davom etish

## 3 · Amaliyot 1 — PR ochiladi, sabab sizdan
- Eyebrow: Amaliyot 1 · Pull Request
- Sarlavha: PR oching: har o'zgarish yonida sababi tursin.
- Mentor: Nima o'zgarganini agent kod farqidan o'qiy oladi, nega — faqat siz bilasiz; **«1 · Ochish»**dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. Ochish — Antigravity'da `maydon` papkasini oching. Terminalda: `git checkout prod` (`git branch` — `* prod`), keyin `git push -u origin prod` — `prod` GitHub'dagi repo'ngizda ham bo'lsin.
     Brauzerda o'z repo'ngizni oching (`github.com/{login}/maydon`) → «Pull requests» → «New pull request».
     Repo fork bo'lgani uchun «base repository» asosiy repo'ni (`Azizbekcrypto/maydon`) ko'rsatadi — uni o'z repo'ngizga almashtiring. Keyin base: `main`, compare: `prod`.
     Pastda o'zgargan fayllar chiqadi.
  2. Prompt — talabning uch qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       ```
       Qayerda: {qayerda}
       Nima qilsin: {nima qilsin}
       Nima buzilmasin: {nima buzilmasin}
       ```
     - Yordam (bosilsa ochiladi):
       - Qayerda: `main` va `prod` tarmoqlari farqi (`git diff main...prod`).
       - Nima qilsin: har o'zgarish uchun bitta qator yozsin — nima o'zgardi va qaysi faylda. Sababini yozmasin.
       - Nima buzilmasin: hech qaysi faylni o'zgartirma, commit qilma — ro'yxatni faqat menga yoz.
  3. Solishtirish — agent ro'yxatini GitHub'dagi o'zgargan fayllar bilan solishtiring: har qator kodda bormi, tushib qolgan fayl yo'qmi. Kodda yo'q qatorni o'chiring.
     Keyin «Sabab» va «Qanday tekshirdim» bo'limlarini o'zingiz yozing. Agentdan sabab so'rasangiz, uning gapini kod bilan solishtiring: faqat o'zingiz tekshirgan sababni yozasiz.
     - Prompt qutisi (Shablon → PR tavsifi · Nusxalash):
       ```
       ## Nima o'zgardi
       - {o'zgarish} — {fayl}
       ## Sabab
       - {o'zgarish}: {nega shunday qildingiz}
       ## Qanday tekshirdim
       - {nima qildingiz va nima ko'rdingiz}
       ```
  4. PR ochish — «Create pull request» → sarlavha (masalan: `Prod ro'yxati: chegara, xato holatlari, A/B yakuni`) → tavsifga shablonni qo'ying → yana «Create pull request».
     PR havolasini sinfdoshingizga Telegram'da yuboring. PR ostida Netlify'ning «Deploy Preview» qatori chiqishi mumkin — bu alohida manzil, bugun kerak emas.
     - Xato izohi: PR `Azizbekcrypto/maydon` da ochilib qolsa — uni «Close pull request» bilan yoping va 1-qadamdagi «base repository»ni qayta tanlang.
  5. O'z g'oyangiz — shu tavsifni o'tgan darsda tanlagan eng yaxshi loyihangiz uchun yozing: unda nima o'zgardi va nega? Uch qatorni to'ldiring.
     - Forma: Nima o'zgardi: … · Sabab: … · Qanday tekshirdim: … · Nusxalash («Bajardim» uchala qator yozilgach ochiladi)
- Kutilgan natija · namuna: Maydon — PR maketi (Prod ro'yxati: chegara, xato holatlari, A/B yakuni #1 · Open · `main` ← `prod` · Conversation):
  ```
  Nima o'zgardi
  - So'rovlar chegarasi: POST /bandlar, POST /kirish, POST /hodisalar — backend/
  - Xato va kutish holatlari — web/
  - A/B yakuni: hamma B ni ko'radi («18:00 ni band qilish») — web/src/BandForma.jsx
  - README — olti qism — README.md
  Sabab
  - Chegara: parolni qayta-qayta taxmin qilishni va soxta bandlarni sekinlatadi
  - Kutish holati: Backend kechiksa yoki javob bermasa — o'yinchi kutishni bilsin, sayt o'zi qayta so'raydi
  - B: kuzatilgan foiz yuqoriroq (A — 42 tadan 12, B — 40 tadan 17); 82 ta brauzer hali kam — hozircha qoladi, kuzatiladi
  Qanday tekshirdim
  - Laptopda noto'g'ri parolni ketma-ket yozdim — chegara ishladi
  - Backend'ni to'xtatdim — «Vaqtlar yuklanmoqda…», bir daqiqadan keyin «Qayta urinish» chiqdi
  ```
- Hammasi bajarilgach: PR ochildi: har o'zgarish yonida sababi bor, havola sinfdoshingizda.
- Pastki qator: Ortda qoldingizmi — **faqat mentor bilan** (`-f` `prod` dagi commitlaringizni o'chiradi): `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f -B prod m10-dars-09-start` · `git push -f -u origin prod`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: PR ochiq turibdi, `prod` ga yana push qildingiz. Internetdagi sayt-chi?
  - Yangilanadi, chunki yangi push qilindi
  - To'xtaydi, chunki PR birlashtirilmagan
  - ✔ Eskicha qoladi, chunki main o'zgarmadi
  - Yangilanadi, chunki PR ochiq turibdi
- Javob izohlari:
  - To'g'ri: Push PR'ga qo'shildi; sayt `main` dan chiqadi — u o'zgarmadi.
  - 1-variant: Push `prod` ga ketdi. Sayt qaysi tarmoqdan chiqadi?
  - 2-variant: Ishlab turgan sayt `main` dan. U o'zgardimi?
  - 4-variant: PR — ko'rsatish so'rovi. U `main` ni o'zgartiradimi?
- Test yozuvlari (4 va 7-ekran uchun bir xil): To'g'ri · Qaytadan urinib ko'ring · birinchi urinish xato bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi · Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: C — …
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish · Mentor o'tmagan bo'lsa: Mentorni kuting (izoh: Mentor hali bu sahifaga o'tmadi)

## 5 · Kamchilik izohga aylanadi
- Eyebrow: Tushuncha · izoh va javob
- Sarlavha: Sinfdosh topgan kamchilik qanday izohga aylanadi?
- Mentor: Izohni o'qigan muallif nimani tuzatishni bilishi kerak — «Joy» qatoridan boshlab har qatorga bitta bo'lak tanlang.
- Chap — telefon (ega sahifasi): `maydon-….netlify.app/ega` · Maydon · ega · ‹ Shanba › · Shanba · bandlar · ro'yxat joyi bo'sh
- O'ng — PR maketi (Prod ro'yxati: chegara, xato holatlari, A/B yakuni #1 · Open · `main` ← `prod` · Files changed), fayl `web/src/App.jsx`:
  ```js
  + {kechikdi && (
  +   <p className="xabar">Vaqtlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.</p>
  ```
  - Sinfdoshning xom izohi: Bu yer yomon, qayta yozing.
- Pastda bitta katta karta — navbatdagi qator va ikki bo'lak (tanlangan to'g'ri bo'lak izohga uchadi, telefon javob beradi):
  - Joy: ✓ `/ega` dagi bandlar ro'yxati (`Ega.jsx`) · Siz yozgan hamma kod — xato: Hamma kod — qaysi qator tuzatiladi?
  - Nega muhim: ✓ Backend kechiksa, ro'yxat bo'sh — ega «band yo'q» deb o'ylaydi · Siz bu yerni o'ylamasdan yozgansiz — xato: Bu odam haqida. Kodda nima bo'ladi? (telefonda ro'yxat joyi qizil, yonida «40 soniya»)
  - Taklif: ✓ O'yinchi sahifasidagi «yuklanmoqda» holati bu yerda ham bo'lsin · Keyingi safar e'tiborliroq bo'ling — xato: Bu maslahat odamga. Kodda nima qilinadi? (telefonda: Bandlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.)
  - Javob: ✓ Sabab: tekshirdim, shunday — holat faqat o'yinchi sahifasida edi. Qaror: tuzataman. · Siz tushunmabsiz, kod to'g'ri ishlaydi. — xato: Bu sinfdosh haqida. Kod haqida nima dedingiz?
- Yig'ilgan izoh (sinfdosh): **Joy:** `/ega` dagi bandlar ro'yxati (`web/src/Ega.jsx`) · **Nega muhim:** Backend kechiksa, ro'yxat joyi bo'sh turadi — ega «band yo'q» deb o'ylashi mumkin · **Taklif:** o'yinchi sahifasidagi «yuklanmoqda» holatini bu yerga ham qo'shing
- Javob (muallif): **Sabab:** tekshirdim, shunday — holat faqat o'yinchi sahifasiga qo'shilgan edi. · Qaror: tuzataman
- Natija bloki: Qattiq izoh ham hurmatli bo'ladi, agar u kodga qaratilsa.
- Xulosa: Izohda joy, nega muhimligi va taklif bor, javobda — qaror sababi. Ikkalasi odamga emas, kodga qaratilgan.
- Tugmalar: Orqaga · Izohni yig'ing (N/4) → Davom etish

## 6 · Amaliyot 2 — juftlikda code review
- Eyebrow: Amaliyot 2 · code review
- Sarlavha: Sinfdosh PR'ini o'qing, o'zingiznikiga javob bering.
- Mentor: Juftlikda ikki PR bor: birini siz o'qiysiz, ikkinchisiga siz javob berasiz; **«1 · Ochish»**dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. Ochish — sinfdoshingiz yuborgan PR havolasini oching → «Files changed». Har faylni oxirigacha o'qing, o'qib bo'lgan faylga «Viewed» belgisini qo'ying.
     Uch savol bilan o'qing: tavsifdagi sabab kodga mosmi? Xato bo'lsa, o'yinchi yoki ega nimani ko'radi? Maxfiy kalit (`JWT_SECRET`, `EGA_PAROLI`, `EGA_2FA_KALITI`) kodda ochiq turibdimi?
  2. Izoh — kamida ikkita izoh yozing: savol, taklif yoki haqiqiy kamchilik bo'lishi mumkin — kamchilik bo'lmasa, uni o'ylab topmang. Qator yonidagi ko'k «+» belgisini bosing va izohning uch qatorini yozing (bu darsdagi qolip; savol bo'lsa — «Taklif» o'rniga savolingiz).
     Birinchi izohdan keyin «Start a review», keyingisida «Add review comment».
     - Prompt qutisi (Siz → GitHub izohi · Nusxalash):
       ```
       Joy: {qaysi qator}
       Nega muhim: {bu kimga va nima xalaqit beradi}
       Taklif: {nima qilish kerak}
       ```
     - Yordam (bosilsa ochiladi):
       - Joy: `/ega` dagi bandlar ro'yxati (`web/src/Ega.jsx`).
       - Nega muhim: Backend kechiksa, ro'yxat joyi bo'sh turadi — ega «band yo'q» deb o'ylashi mumkin.
       - Taklif: o'yinchi sahifasidagi «yuklanmoqda» holatini bu yerga ham qo'shing.
  3. Yuborish — «Review changes» → bitta umumiy gap yozing → «Comment» → «Submit review». Izohlaringiz sinfdoshingizga shundan keyin ko'rinadi.
  4. Javob — o'z PR'ingizga qayting: sinfdoshingizning har izohi ostiga javob yozing — **Sabab** va **Qaror** (qoldi yoki tuzataman). Tuzatish kerak bo'lgan kamchilik topilgan bo'lsa — 3-amaliyotda uni tuzatasiz; topilmagan bo'lsa — Mentor bergan kamchilikni (`/ega` yuklanish holati) tuzatasiz.
     Sababini bilmasangiz — kodni o'qing; agentdan so'rasangiz, uning gapini kod bilan solishtiring. «Agent shunday yozgan» — javob emas.
     - Yordam (bosilsa ochiladi):
       - Sabab: so'rovni saytsiz ham, to'g'ridan Backend'ga yuborsa bo'ladi; chegara Backend'da tursa, Backend'ga kelgan har so'rovga ishlaydi. Qaror: qoldi.
       - Sabab: tekshirdim, shunday — holat faqat o'yinchi sahifasiga qo'shilgan edi. Qaror: tuzataman.
  5. O'z g'oyangiz — eng yaxshi loyihangizda sinfdosh qaysi qaroringizni so'rashi mumkin? Uch qatorni yozing.
     - Forma: Savol: … · Sabab: … · Qaror: … · Nusxalash («Bajardim» uchala qator yozilgach ochiladi)
- Kutilgan natija · namuna: Maydon — PR maketi (Prod ro'yxati: chegara, xato holatlari, A/B yakuni #1 · Conversation · Files changed · sinfdosh · review · Comment), uch izoh-suhbat:
  - `web/src/BandForma.jsx` · Qaror: qoldi — **Joy:** tugma matni, endi hamma B ni ko'radi · **Nega muhim:** A va B farqi kichik ko'rinadi · **Taklif:** qaysi raqamlarga tayanganingizni yozing
  - `backend/src/app.module.ts` · Qaror: qoldi — **Joy:** so'rovlar chegarasi Backend'da · **Nega muhim:** chegara saytda bo'lsa, Backend'ga keraksiz so'rov bormaydi · **Taklif:** tugma bir daqiqaga o'chsin
  - `web/src/App.jsx` · Qaror: tuzataman — **Joy:** `/ega` dagi bandlar ro'yxati (`web/src/Ega.jsx`) · **Nega muhim:** Backend kechiksa, ro'yxat joyi bo'sh turadi — ega «band yo'q» deb o'ylashi mumkin · **Taklif:** o'yinchi sahifasidagi «yuklanmoqda» holatini bu yerga ham qo'shing
- Hammasi bajarilgach: Review yuborildi, har izohga sabab bilan javob berildi.
- Pastki qator: Ortda qoldingizmi — **faqat mentor bilan** (`-f` `prod` dagi commitlaringizni o'chiradi): `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f -B prod m10-dars-09-start` · `git push -f -u origin prod` · (PR'ni mentor bilan ochasiz)
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Sinfdosh: «Bu qatorni nega qo'shdingiz?» Kodni agent yozgan. Nima qilasiz?
  - ✔ Kodni o'qib tekshiraman, keyin sababni yozaman
  - «Agent shunday yozgan» deb javobga yozib qo'yaman
  - Agentdan so'rab, javobini tekshirmay qo'yaman
  - Izohni javobsiz qoldirib, PR'ni birlashtiraman
- Javob izohlari:
  - To'g'ri: Qaror sizniki: sababni kodda tekshirib, o'zingiz yozasiz.
  - 2-variant: Sinfdosh agentdan emas, sizdan so'radi. Sabab qani?
  - 3-variant: Agent taxmin qilishi mumkin. Uning gapi kodga mosmi?
  - 4-variant: Savol ochiq qoldi. Birlashtirishdan oldin nima kerak?
- Test yozuvlari: 4-ekrandagidek.
- Tugmalar: Orqaga · To'g'ri javobni toping → Davom etish

## 8 · Amaliyot 3 — tuzatish va birlashtirish
- Eyebrow: Amaliyot 3 · tuzatish va «Merge»
- Sarlavha: Kamchilikni tuzating, keyin PR'ni birlashtiring.
- Mentor: Tuzatish ham `prod` ga push qilinadi — PR o'zi yangilanadi; **«1 · Talab»**dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. Talab — «tuzataman» degan izoh uchun talabning uch qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       ```
       Qayerda: {qayerda}
       Nima qilsin: {nima qilsin}
       Nima buzilmasin: {nima buzilmasin}
       ```
     - Yordam (bosilsa ochiladi):
       - Qayerda: `/ega` sahifasidagi bandlar ro'yxati (`web/src/Ega.jsx`).
       - Nima qilsin: ro'yxat 5 soniyada kelmasa yoki so'rov o'tmasa, «Bandlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin.» chiqsin. So'rov o'tmasa — 5 soniyadan keyin qayta so'rasin; oldingi so'rov tugamasdan yangisi ketmasin. Bir daqiqadan keyin ham bo'lmasa — «Bandlarni yuklab bo'lmadi» va «Qayta urinish» tugmasi. O'yinchi sahifasidagi qayta so'rash kodini qayta ishlat.
       - Nima buzilmasin: parol va kod bilan kirish, `401` da parol formasi qaytishi, o'yinchi sahifasi. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  2. Tekshirish — agentning hisobotiga emas, haqiqiy o'zgarishga qarang: `git diff` — faqat `web/src/Ega.jsx` o'zgarganmi.
     Keyin `localhost:5173/ega` ga kiring. Backend terminalida Ctrl+C bilan uni to'xtating va kunni almashtiring («›»): «Bandlar yuklanmoqda…» chiqadi.
     Bu tekshiruvda Backend umuman javob bermaydi; sekin javob holati o'tgan darsdagi sahnada ko'rilgan.
     Shu daqiqa ichida Backend'ni qayta yoqing (`npm run start:dev`) — sahifani yangilamasangiz ham ro'yxat o'zi chiqadi.
     - Xato izohi: Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  3. Push — repo ildizida `REVIEW.md` yarating (shablon) va izoh-javoblarni yozing. Keyin `git status` — o'zgargan fayllar: agent aytgan ro'yxat va `REVIEW.md`; shularni `git add` bilan qo'shing, `git commit -m "review: /ega yuklanish holati, REVIEW.md"`, `git push` — yangi commit PR'da ko'rinadi.
     «tuzataman» degan izoh ostiga «Tuzatildi» deb yozing.
     - Prompt qutisi (Shablon → REVIEW.md · Nusxalash):
       ```
       # REVIEW — {loyiha nomi} · PR #{raqam} (prod → main)
       Ko'rib chiqdi: {sinfdoshingizning GitHub logini}
       | № | Joy | Izoh | Sabab (nega shunday qildim) | Qaror |
       |---|---|---|---|---|
       | 1 | {fayl va qator} | {izoh} | {sabab} | qoldi / tuzatildi |
       ```
  4. Birlashtirish — sinfdoshingiz yangi commitni ko'rib, «Review changes» → «Approve» → «Submit review» qiladi. Bu repo'da «Approve» birlashtirish uchun shart emas — u tuzatishni qayta ko'rganining belgisi.
     Sinfdosh ulgurmasa yoki GitHub ochilmasa — mentor ko'rib, «ko'rdim» izohini qoldiradi. Siz suhbatlarni «Resolve conversation» bilan yopasiz.
     Birlashtirishdan oldin «Files changed»ga qarang: Database jadvali fayli (`….entity.ts`) o'zgarmagan bo'lsin. O'zgargan bo'lsa — birlashtirmang, mentorga ayting.
     Keyin PR pastida «Merge pull request» → «Confirm merge». Render va Netlify `main` dan oladi — bir necha daqiqada internetdagi sayt yangilanadi.
     Netlify manzilingizga `/ega` qo'shib oching va kiring — bandlar ro'yxati chiqadi. Bepul Backend uxlab qolgan bo'lsa, birinchi so'rov kechikishi mumkin — taxminan bir daqiqagacha.
     Netlify yoki Render yangilanmasa — tekshiruvni laptopda qiling, deploy'ni mentor bilan ko'rasiz.
  5. O'z g'oyangiz — eng yaxshi loyihangizda code review topishi mumkin bo'lgan bitta kamchilik uchun talab yozing. Uch qatorni to'ldiring.
     - Forma: Qayerda: … · Nima qilsin: … · Nima buzilmasin: … · Nusxalash («Bajardim» uchala qator yozilgach ochiladi)
- Kutilgan natija · namuna: Maydon:
  - PR maketi: Prod ro'yxati: chegara, xato holatlari, A/B yakuni #1 · Merged · `main` ← `prod` · Conversation
  - Telefon (ega sahifasi): `maydon-….netlify.app/ega` · Maydon · ega · ‹ Shanba › · Shanba · bandlar · Bandlar yuklanmoqda — bu bir daqiqagacha cho'zilishi mumkin. → ro'yxat 17:00 · 20:00 (yashil)
  - Fayl-karta `REVIEW.md`:
    ```
    # REVIEW — Maydon · PR #1 (prod → main)
    Ko'rib chiqdi: sinfdosh
    1 web/src/BandForma.jsx, tugma · qoldi
      Nega B qoldi? Farq kichik ko'rinadi
      A — 42 tadan 12, B — 40 tadan 17; 82 ta brauzer hali kam — hozircha B, kuzatamiz
    2 backend, so'rovlar chegarasi · qoldi
      Saytda tugma bir daqiqaga o'chsa-chi?
      So'rovni saytsiz ham yuborsa bo'ladi; chegara Backend'ga kelgan har so'rovga ishlaydi
    3 web/src/Ega.jsx, bandlar · ✓ tuzatildi
      Backend kechiksa, ro'yxat bo'sh — «yuklanmoqda» holati kerak
      Tekshirdim, shunday: holat faqat o'yinchi sahifasida edi
    ```
- Hammasi bajarilgach: Kamchilik tuzatildi, PR birlashtirildi — ko'rib chiqilgan kod internetda.
- Pastki qator: Ortda qoldingizmi — **faqat mentor bilan** (`-f` `prod` dagi commitlaringizni o'chiradi): `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f -B prod m10-dars-09-done` · `git push -f -u origin prod` · (`REVIEW.md` ni o'z izohlaringiz bilan almashtiring; Render va Netlify o'zingizniki — o'tgan moduldagi deploy'dan)
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 9 · Natijalar (podium) — jonli reyting

## 10 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.
- Kartochkalar — 12 ta (matni «Kartochkalar» bo'limida); birinchi bosishgacha ostida: Kartani bosing — javob ochiladi
- Yozuvlar: ↻ O'rganilmoqda · N · ✓ Bildim · N · tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 11 · Yakun — keyingi dars
- Eyebrow: Yakun
- Belgi: ✓ Loyiha kuni tugadi · N/2 to'g'ri
- Sarlavha: PR birlashtirildi — har qaror sababi bilan yozilgan.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Endi siz bilasiz:
  - Bu repo'da `prod` dagi o'zgarish PR orqali birlashtirilgach internetga chiqadi.
  - Yaxshi izohda joy, nega muhimligi va taklif bor.
  - Izoh odamga emas, kodga qaratiladi.
  - Javobda qaror sababi yoziladi, kerak bo'lsa tuzatish ham.
  - Kodni agent yozgan bo'lsa ham, sababni kodda tekshirib, o'zingiz yozasiz.
- Nishonlaringiz — N/3 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Keyingi dars — **«Bir yilda nimalarni qurdingiz?»**: yil bo'yi qurgan loyihalaringizni vaqt chizig'iga qo'yasiz, «Maydon» — oxirgisi.
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Yuqoridagi hisoblagich: N/3
- **Branch Aware** — Sayt main dan chiqishini, push PR'ga qo'shilishini bildingiz (4-ekran, 1-savol)
- **Own Answer** — Sababni kodda tekshirib, o'zingiz yozishni tanladingiz (7-ekran, 2-savol)
- **Merged** — PR'ni code review'dan keyin birlashtirdingiz (8-ekran, amaliyot tugagach)
- Nishon olinganda: nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
- Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 4-ekran — Sayt `main` dan chiqadi
   - `base: main ← compare: prod` · PR — `prod` dagi o'zgarish `main` ga birlashtirishga so'raladi.
   - `git push` · PR ochiq — Yangi commit PR'ga qo'shiladi, sayt o'zgarmaydi.
   - `Merge pull request` · Birlashtirish — `main` o'zgaradi, Render va Netlify yangilanadi.
   - Sinfga savol: O'tgan darsdagi chegara nega hali internetda ishlamayapti?
2. 7-ekran — Sabab — sizdan
   - `git diff` · Kod — Sabab kodda tekshiriladi.
   - `Sabab:` · Javob — Nega shunday qilganingizni aytadi.
   - `Qaror: qoldi / tuzataman` · Qaror — O'zgarmaydi yoki tuzatiladi.
   - Sinfga savol: «Agent shunday yozgan» nega javob emas?

## Jonli viktorina (12 savol)
- Tugma (Yakun ekranida): CODE STRIKE · kutish holatida: Mentorni kuting
- Lobby: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · Mentor testni boshlashini kuting…
- Javobdan keyin: Javob qabul qilindi — natijani kuting… · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling!
- Oxirida: Test yakunlandi! · Siz hozir: N-o'rin · ball · to'g'ri · eng uzun streak · jonli dars tugagan bo'lsa: Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish
- Arena fonidagi so'zlar: Pull Request · code review · main · prod · Files changed · Merge pull request · REVIEW.md · /ega · Approve · Joy · Nega muhim · Taklif · Netlify · Maydon

1. Pull Request (PR) nima?
   - ✔ O'zgarishni birlashtirishdan oldin ko'rsatish so'rovi
   - Kodni internetga chiqaradigan, terminaldagi buyruq
   - Asosiy repo'dan o'zingizga nusxa oladigan GitHub tugmasi
   - Sinfdosh kodning bir qatoriga yozgan bitta izohi
2. Code review nima?
   - O'zgarishni main'ga birlashtirish tugmasi
   - ✔ Boshqa odam kodni o'qib izoh yozishi
   - Agent kodni o'zi o'qib tuzatib qo'yishi
   - Saytni telefonda ochib tekshirib ko'rish
3. Bu repo'da Netlify qaysi tarmoqdan (branch) yangilanadi?
   - prod'dan, har push qilinganda
   - Ochiq PR'ning o'zidan, har safar
   - ✔ main'dan, PR birlashtirilgach
   - Laptopdagi web/ papkasidan
4. PR ochiq. prod'ga yana push qildingiz. Nima bo'ladi?
   - Internetdagi sayt shu zahoti yangilanadi
   - PR yopilib, o'rniga yangisi ochiladi
   - Push rad etiladi, chunki PR ochiq
   - ✔ Yangi commit PR'ning o'ziga qo'shiladi
5. Yaxshi izoh qaysi uch qismdan iborat?
   - ✔ Joy, nega muhim, taklif
   - Ism, sana va qo'yilgan baho
   - Fayl, tarmoq va commit nomi
   - Savol, javob va olingan ball
6. Qaysi izoh kodga qaratilgan?
   - «Siz bu yerni umuman o'ylamasdan yozgansiz»
   - ✔ «Ro'yxat yuklanguncha xabar yo'q, qo'shing»
   - «Keyingi safar ancha e'tiborliroq bo'ling»
   - «Sizga bu mavzuni qaytadan o'qish kerak»
7. Sinfdosh taklifiga rozi emassiz. Nima yozasiz?
   - «Yo'q» deb yozib, suhbatni yopib qo'yasiz
   - Javobsiz qoldirib, PR'ni birlashtirasiz
   - ✔ Sababni yozib, «qoldi» deb javob berasiz
   - Taklifni o'ylab ko'rmasdan qabul qilasiz
8. Kodni agent yozgan. Sinfdosh «Nega?» dedi. Nima qilasiz?
   - «Agent shunday yozgan» deb yozasiz
   - Agent gapini tekshirmasdan qo'yasiz
   - Izohni javobsiz yopib qo'yasiz
   - ✔ Kodni tekshirib, sababni yozasiz
9. PR tavsifidagi «Sabab» bo'limini kim yozadi?
   - ✔ Kod muallifi, o'zingiz
   - Agent, kod farqiga qarab
   - Izoh yozadigan sinfdosh
   - GitHub o'zi, avtomatik
10. Izohlar «Submit review»dan oldin kimga ko'rinadi?
   - Faqat PR'ni ochgan muallifga
   - ✔ Faqat izohni yozgan odamga
   - Repo'ni ochgan har qanday odamga
   - Mentor va PR muallifiga
11. Maydon PR'ida nega B varianti qoldi?
   - B tugmasining matni chiroyliroq ko'rindi
   - Sinfdoshlar B ni ko'proq maqtab yozdi
   - ✔ Hozircha B foizi yuqoriroq chiqdi
   - A ni Netlify ko'rsatmay qo'ygan edi
12. Kamchilik tuzatildi, sinfdosh «Approve» berdi. Keyin-chi?
   - PR'ni yopib, o'rniga yangisini ochasiz
   - main'ga kodni qo'lda ko'chirib qo'yasiz
   - prod'ni o'chirib, kodni qaytadan yozasiz
   - ✔ PR'ni birlashtirib, saytni tekshirasiz

## Kartochkalar

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Pull Request (PR) nima? | O'zgarishni birlashtirishdan oldin ko'rsatish so'rovi | «Maydon» da — `prod` dan `main` ga |
| Code review nima? | Boshqa odam kodni o'qib izoh yozishi | Izoh savol ham bo'lishi mumkin; har review kamchilik topmaydi |
| Tarmoq (branch) nima? | Repo'dagi alohida yo'l: o'zgarishlar main ga tegmasdan shu yerda yig'iladi | «Maydon» da — `prod`; PR bilan `main` ga birlashtiriladi |
| PR ochiq turganda `prod` ga push qilsangiz nima bo'ladi? | Yangi commit PR'ga qo'shiladi | Internetdagi sayt `main` birlashtirilguncha o'zgarmaydi |
| Yaxshi izoh qaysi uch qismdan iborat? | Joy, nega muhim, taklif | «Bu yer yomon» da joy ham, sabab ham yo'q |
| Izoh kimga qaratiladi? | Kodga, odamga emas | «Siz o'ylamay yozgansiz» o'rniga — qator va sabab |
| Yaxshi javobda nima bo'ladi? | Qaror sababi, kerak bo'lsa — tuzatish | Qaror: qoldi yoki tuzataman |
| Taklifga rozi bo'lmasangiz, nima yozasiz? | Sababini | Chegara Backend'da qoldi: so'rovni saytsiz ham yuborsa bo'ladi |
| Kodni agent yozgan. Sinfdosh «Nega?» desa-chi? | Kodni tekshirib, sababni o'zingiz yozasiz | Agentdan so'rasangiz ham, uning gapini kod bilan solishtirasiz |
| PR tavsifining qaysi bo'limini agent yozib bera olmaydi? | «Sabab» bo'limini | Nima o'zgarganini agent kod farqidan o'qiy oladi |
| Maydon PR'ida nega B qoldi? | B'da band qilganlar foizi yuqoriroq chiqdi | Hozircha qoladi — isbot emas: 82 ta brauzer hali kam, raqam kuzatiladi |
| PR'ni birlashtirish uchun nima bosiladi? | «Merge pull request», keyin «Confirm merge» | Shundan keyin Render va Netlify `main` dan yangilanadi |

## Yakun
- Natija: PR birlashtirildi — har qaror sababi bilan yozilgan.
- Uyga vazifa yo'q (loyiha kuni).
- Keyingi dars — «Bir yilda nimalarni qurdingiz?»: yil bo'yi qurgan loyihalaringizni vaqt chizig'iga qo'yasiz, «Maydon» — oxirgisi.
