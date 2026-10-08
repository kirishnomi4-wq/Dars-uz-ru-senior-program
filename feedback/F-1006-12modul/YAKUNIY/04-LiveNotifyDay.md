# 4-dars «Loyiha kuni: jonli xabar va eslatma» — yakuniy matn

Fayl: `src/10-Modull/LiveNotifyDayLesson.jsx` · 12 ekran · Keyingi dars: «Ulanish uzilsa: buzamiz va tuzatamiz»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — real vaqt sahnasi: chapda «1-telefon · siz», o'rtada Backend tuguni («Backend», ichida «Database: N» va xona doirasi `oyin-1` — ichida ulanish nuqtalari), o'ngda «2-telefon · boshqa o'yinchi». Telefon bilan Backend orasida chiziq; hodisa konverti chiziq bo'ylab uchadi (yorlig'i — hodisa nomi va ma'lumoti yoki «so'rov» / «javob»).
Telefon ramkasi tepasida «Maydon Jamoa» nomi. Namuna o'yin (dars bo'yi bir xil): Shanba, 18:00 · Mahalla maydoni · 8 / 10.
Telefon ekranlari: **O'yin** — «‹ O'yinlar», «Shanba, 18:00», «Mahalla maydoni», «8 / 10», «Hozir ko'ryapti: N», «Qo'shilaman» (bosilgach — «Qo'shildingiz»), «O'yindan chiqish» · **O'yinlar** — sarlavha «O'yinlar», «Shanba», o'yin kartasi (Shanba, 18:00 · Mahalla maydoni · 8 / 10) · **ilova yopiq** — telefon ekrani: soat, «Shanba», «Maydon Jamoa» ilova belgisi.
Jonli xabar — ilova ichida, tepada: «Maydon Jamoa» + xabar matni; bir necha soniyadan keyin yo'qoladi. Eslatma — telefon ekranida: «Maydon Jamoa» · «Bugun, 18:00 · Mahalla maydoni».
Jonli xabar matnlari (Mentor misoli):
- Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10
- Shanba, 18:00 — joy bo'shadi: 8 / 10
- Shanba, 18:00 — o'yin to'ldi: 10 / 10
- Shanba, 18:00 — kelishini tasdiqladi: 8 / 9
- Navbatdan o'yinga o'tdingiz: Shanba, 18:00

## 0 · Kirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: Ilovani yopgan bo'lsangiz, o'yinni sizga *kim eslatadi*?
- Mentor:
  - boshida: Mentor misolida siz Shanba 18:00 dagi o'yinga qo'shilgansiz, telefon esa cho'ntakda — avval javobni tanlang.
  - javobdan keyin: Telefon ekraniga qarang, keyin «Davom etish»ni bosing.
- Maket: «1-telefon · siz» — ilova yopiq: soat «16:59», «Shanba», «Maydon Jamoa» ilova belgisi. Telefon ostida kichik karta: Shanba, 18:00 · **Qo'shildingiz**
- Variantlar (ballsiz):
  - Backend — o'yindan oldin telefonga yozadi
  - Ilova — qo'shilganda vaqtini oldindan qo'yadi
  - Hech kim — ilovani o'zingiz ochib ko'rasiz
- Javob izohlari:
  - «Ilova — qo'shilganda vaqtini oldindan qo'yadi» tanlansa: **Aynan!** Bu misolda ilova «Qo'shilaman» bosilganda eslatmani o'yindan bir soat oldinga qo'yib qo'yadi.
  - «Backend — o'yindan oldin telefonga yozadi» tanlansa: **Qiziq fikr!** Backend yuboradigan eslatma ham bor, u alohida sozlashni talab qiladi. Bu misolda vaqtni ilova qo'yadi.
  - «Hech kim — ilovani o'zingiz ochib ko'rasiz» tanlansa: **Qiziq fikr!** 11-Modulda shunday edi: roadmap'da eslatma keyinroqqa qoldirilgan. Bugun u quriladi.
- Javobdan keyin: soat «16:59» → «17:00», ekran tepasidan eslatma tushadi: «Maydon Jamoa» · «Bugun, 18:00 · Mahalla maydoni»; eslatmadan «Qo'shildingiz» kartasiga uzuq chiziq, ustida yorliq: qo'shilganda qo'yilgan
- Tugma: Davom etish

## 1 · Bugun quramiz
- Eyebrow: Reja
- Sarlavha: Dars oxirida ilovangiz *foydalanuvchini xabardor qiladi*.
- Mentor: Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingizda qurasiz. Talabni har blokda ko'proq o'zingiz yozasiz.
- Chap — Dars oxirida: telefon bir marta o'zi yuradi: «O'yin» (Shanba, 18:00 · Mahalla maydoni · 8 / 10 · «Hozir ko'ryapti: 2») → tepada jonli xabar «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10», kartada «9 / 10» → xabar yo'qoladi → ilova yopiladi: «16:59» → «17:00», eslatma «Maydon Jamoa · Bugun, 18:00 · Mahalla maydoni»
- Reja:
  1. O'yin ekrani: hozir u nechta qurilmada ochiq
  2. Ilova ochiq: o'zgarish tepada qisqa xabar bo'lib chiqadi
  3. Ilova yopiq: o'yindan bir soat oldin telefonga eslatma
- Pastki qator: repo `maydon-jamoa` · boshlang'ich holat `m12-dars-04-start` · namuna `m12-dars-04-done`
- Pastki qator 2: «Maydon Jamoa» — namuna; bloklarni o'z mahsulotingizda bajarasiz. Web-trekda 3-qadamda — saytdagi «Xabarlar» tasmasi.
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Xona
- Eyebrow: Tushuncha · xona
- Sarlavha: O'yin ekrani hozir *nechta qurilmada* ochiq?
- Mentor (bosqichga qarab):
  - bashoratgacha: Avval taxminingizni belgilang, keyin 2-telefonda Shanba 18:00 o'yinini oching.
  - 1-harakatdan keyin: Endi 2-telefonda «‹ O'yinlar» ni bosib, ro'yxatga qayting.
  - tugagach: Natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, yorliq «Avval o'zingiz belgilab ko'ring»): 2-telefon o'yinni ochsa, 1-telefondagi son nima bo'ladi? · O'zgarmaydi · Pastga tortganda o'zgaradi · O'zi 2 ga o'tadi
- Sahna (ikkala telefon Backend'ga ulangan):
  - 1-telefon · siz — «O'yin»: «‹ O'yinlar» · Shanba, 18:00 · Mahalla maydoni · 8 / 10 · «Hozir ko'ryapti: 1» · «Qo'shildingiz»
  - Backend — «Database: 8», xona doirasi `oyin-1`, ichida bitta nuqta
  - 2-telefon · boshqa o'yinchi — «O'yinlar»: Shanba 18:00 kartasi
  - Qadam belgilari: 1 O'yinni oching · 2 Ro'yxatga qayting
- Harakatlar:
  1. Karta (2-telefon) → 2-telefonda «O'yin» ochiladi → konvert `oyin-ochildi` · `{ oyinId: 1 }` Backend'ga → xonaga ikkinchi nuqta kiradi → ikki konvert `korayotganlar-ozgardi` · `{ oyinId: 1, soni: 2 }` ikkala telefonga → ikkalasida «Hozir ko'ryapti: 2».
     Nom qatori: Backend'dagi ulanishlar guruhi — **xona**: hodisa faqat shu guruhdagilarga boradi.
  2. «‹ O'yinlar» (2-telefon) → konvert `oyin-yopildi` · `{ oyinId: 1 }` → nuqta xonadan chiqadi → konvert `korayotganlar-ozgardi` · `{ oyinId: 1, soni: 1 }` faqat 1-telefonga → «Hozir ko'ryapti: 1»; 2-telefon chizig'i yonida kulrang yorliq: xonada emas
- Natija qatori: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz ✕ — aslida: o'zi 2 ga o'tadi)
- Xulosa: Bu misolda son — o'yin ekranini hozir ochib turgan ulanishlar: odamlar emas, ochiq ekranlar sanaladi.
- Izoh qatori: Bu son Database'da yo'q — shuning uchun bu hodisa sonning o'zini olib keladi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish

## 3 · Amaliyot 1 — «Hozir ko'ryapti»
- Eyebrow: Amaliyot 1 · hozir ko'ryapti
- Sarlavha: Ilovangizda «Hozir ko'ryapti» *soni ko'rinsin*.
- Mentor: Talab tayyor — bitta joyga qaysi ekran sanalishini yozasiz; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Trek tanlanmagan bo'lsa (mentor ostida): Trekingiz: Mobil trek · Web-trek
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching (3-darsdagi holat: ilova Backend'ga ulangan, ro'yxat o'zi yangilanadi). Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin.
     - Mobil trekda `cd mobil`, `npx expo start` ishlab tursin va ilova telefoningizda ochiq bo'lsin; web-trekda saytingiz Netlify'da ochiq tursin.
     - Sanaladigan ekranni tanlang: Mentor misolida — «O'yin» ekrani, har o'yinga alohida xona. Mahsulotingizda bitta yozuv uchun alohida ochiladigan ekran bo'lmasa — eng ko'p ochiladigan ekranni oling: unda bitta xona bo'ladi. Mahsulotingizni bir vaqtda bitta odam ishlatsa — son sizning ochiq qurilmalaringizni sanaydi (masalan, telefon va kompyuter).
  2. **Prompt** — qavsni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash; bosilgach — Nusxalandi):
       > Qayerda: `backend/` — 2-darsdagi gateway; `mobil/` — `src/ulanish.ts` va {sanaladigan ekran}.
       > Nima qilsin: {sanaladigan ekran} ochilganda ilova Backend'ga hodisa yuborsin va Backend shu ulanishni xonaga qo'shsin; ekran yopilganda — xonadan chiqarsin. Ekran har yozuv uchun alohida ochilsa — har yozuvning o'z xonasi bo'lsin.
       > Xonadagi ulanishlar soni o'zgarsa, Backend shu xonaga yangi sonni yuborsin — ulanish uzilganda ham; ekranda «Hozir ko'ryapti: N» tursin, N ga o'zim ham kiraman. Ism ko'rsatilmasin — faqat son.
       > Nima buzilmasin: {buzilmasin}; ro'yxat o'zi yangilanishi, ulanish belgisi va ekranni kim ko'ra olishi avvalgidek qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Bo'sh qavs yonida kulrang namuna:
       - {sanaladigan ekran} — masalan: «O'yin» ekrani (`src/app/oyin/[id].tsx`)
       - {buzilmasin} — 3-darsdagi talabingizdan oldindan yozilgan (tahrirlasa bo'ladi); bo'lmasa: masalan: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `backend/` — 2-darsdagi gateway; `mobil/` — `src/ulanish.ts` va «O'yin» ekrani (`src/app/oyin/[id].tsx`).
       > Nima qilsin: har o'yinga alohida xona — `oyin-{id}`. «O'yin» ekrani ochilganda ilova `oyin-ochildi` (`{ oyinId }`) yuborsin va Backend shu ulanishni o'sha xonaga qo'shsin; ekran yopilganda — `oyin-yopildi`, xonadan chiqarsin.
       > Xonadagi ulanishlar soni o'zgarsa, Backend shu xonaga `korayotganlar-ozgardi` (`{ oyinId, soni }`) yuborsin — ulanish uzilganda ham; «O'yin» ekranida «Hozir ko'ryapti: N» tursin, N ga o'zim ham kiraman. Ism ko'rsatilmasin — faqat son.
       > Nima buzilmasin: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash, ro'yxat o'zi yangilanishi va ulanish belgisi qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
       - Web-trekda (mobil trek tanlanmagan bo'lsa): Web-trekda: «Qayerda» — `prototip/` dagi `src/ulanish.js` va sanaladigan sahifa; Backend qismi ikkala trekda bir xil, «Hozir ko'ryapti» sahifada turadi.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "hozir ko'ryapti"`, `git push`.
     - Render Backend'ning yangi versiyasini chiqaradi — tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Kutayotganda agent yozgan fayllardan ikki joyni toping: Backend'da ulanishni xonaga qo'shadigan qator va yangi son yuboriladigan qator.
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Yozgan fayllaringda ikki joyni fayl nomi va qator raqami bilan ko'rsat: Backend'da ulanishni xonaga qo'shadigan qator va xonaga yangi sonni yuboradigan qator.
       > Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     - Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`); web-trekda `git push` dan keyin Netlify saytni odatda o'zi yangilaydi.
     - Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabingizning har gapini bajarib ko'ring. Mentor misolida:
     - (1) Render tugagach, ilovada «O'yin» ekranini qaytadan oching (Shanba, 18:00): «Hozir ko'ryapti: 1» bo'lishi kerak — bu sizning ekraningiz.
     - (2) Ikkinchi ulanish. **Web-trekda — o'zingiz:** shu sahifani kompyuterda ikkinchi oynada oching — telefonda son 2 ga o'tishi kerak; oynani yoping — yana 1. **Mobil trekda — sherik:** uning telefonidan shu o'yinni oching (Android'dagi Expo Go; Expo akkaunti ma'lumoti boshqaga berilmaydi), keyin yoping.
     - Sherik bo'lmasa — agentga yozing: «Tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas), shu akkaunt nomidan Backend'ga ikkinchi ulanish och, shu o'yin ekrani ochilgandek hodisa yubor va 30 soniyadan keyin ulanishni yop. Keyin akkauntni `id` si bo'yicha o'chir. Qaysi akkaunt va qaysi o'yin `id` sini ishlatganingni ayt. Boshqa yozuv yaratma.» — son odatda bir necha soniyada 2 ga, 30 soniyadan keyin yana 1 ga o'tishi kerak.
     - (3) Avvalgi ishlar: ro'yxatni pastga torting, ulanish belgisiga qarang — avvalgidek ishlasin.
     - Agentning «ulanish ochdim» degani — uning so'zi; son o'zgarganini esa o'zingiz ko'rdingiz. Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
     - Web-trekda: saytingizni telefon brauzerida oching; ikkinchi ulanish — kompyuterdagi ikkinchi oyna.
- O'ng — kutilgan natija · namuna: Maydon Jamoa: telefon (Expo Go) — «O'yin» (Shanba, 18:00 · Mahalla maydoni · 8 / 10): «Hozir ko'ryapti: 1» → «2» → «1»; web-trekda — brauzer oynasi `….netlify.app`, sahifada o'sha yozuv.
  - Fayl kartasi: `backend/src/…gateway.ts` o'zgardi · `mobil/src/ulanish.ts` o'zgardi · `mobil/src/app/oyin/[id].tsx` o'zgardi (web-trekda: `backend/src/…gateway.ts` o'zgardi · `prototip/src/ulanish.js` o'zgardi)
- Ostida: Ulgurmasangiz: Render kutishi cho'zilsa — 3-qadamdan keyin «Davom etish» ochiladi: Amaliyot 2 ga o'ting. 4-qadamni Amaliyot 2 tekshiruvi bilan birga qilib, shu yerga qaytib «Bajardim»ni bosasiz — blok shundan keyin bajarilgan sanaladi.
- Ostida: Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-04-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).
- Hammasi bajarilgach: «Hozir ko'ryapti» ishlaydi: ochiq ekranlar sanaladi, ism ko'rinmaydi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: Bitta o'yinchi o'yinni telefoni va planshetida ochdi. «Hozir ko'ryapti» *qanchaga oshadi*?
  - Bittaga — bitta odam bir marta sanaladi
  - ✔ Ikkiga — har ochiq ekran alohida sanaladi
  - Oshmaydi — bu son Database'dan keladi
  - Ikkiga — ikkala qurilma o'yinga qo'shiladi
- Javob izohlari:
  - To'g'ri: Ochiq ekranlar sanaladi: ikki qurilma — ikki ulanish.
  - A: Son odamlarni sanaydimi yoki ochiq ekranlarni?
  - C: Bu son Database'da bormidi? Uni kim sanaydi?
  - D: O'yinni ochish va «Qo'shilaman»ni bosish — bir ishmi?
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: B — <variant> · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 5 · Ochiq va yopiq ilova
- Eyebrow: Tushuncha · ochiq va yopiq
- Sarlavha: Ilova ochiq va yopiq: o'zgarish sizga *qanday yetadi*?
- Mentor (bosqichga qarab):
  - bashoratgacha: Avval taxminingizni belgilang, keyin 2-telefonda «Qo'shilaman»ni bosing.
  - 1-harakatdan keyin: Endi 1-telefondagi «Ilovani yopish»ni bosing.
  - 2-harakatdan keyin: 2-telefonda «O'yindan chiqish»ni bosing va 1-telefonga qarang.
  - 3-harakatdan keyin: Endi «17:00 ga o'tkazish»ni bosing va 1-telefonga qarang.
  - tugagach: Natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, yorliq «Avval o'zingiz belgilab ko'ring»): Ilova yopiq paytda joy bo'shasa, bu telefoningizda ko'rinadimi? · Ha, telefon ekranida chiqadi · Yo'q, ko'rinmaydi
- Sahna:
  - 1-telefon · siz — «O'yinlar»: Shanba, 18:00 · Mahalla maydoni · 8 / 10; ostida tugma «Ilovani yopish»
  - Backend — «Database: 8»; tepasida soat «16:59» va tugma «17:00 ga o'tkazish»
  - 2-telefon · boshqa o'yinchi — «O'yin»: «Qo'shilaman»
  - Qadam belgilari: 1 Qo'shiling · 2 Ilovani yoping · 3 O'yindan chiqing · 4 Soatni suring
- Harakatlar:
  1. «Qo'shilaman» (2-telefon) → konvert «so'rov» Backend'ga → «Database: 9» → konvert `oyin-ozgardi` · `qoshildi` 1-telefonga → «so'rov» / «javob» → 1-telefon tepasida jonli xabar: «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10», bir necha soniyadan keyin yo'qoladi; kartada «9 / 10».
     Nom qatori: Ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar — **jonli xabar**.
  2. «Ilovani yopish» → 1-telefon: soat «16:59», «Shanba», «Maydon Jamoa» ilova belgisi; chiziq xira tortadi. 2-telefonda «O'yindan chiqish».
  3. «O'yindan chiqish» (2-telefon) → «Database: 8»; 1-telefonda hech narsa o'zgarmaydi, yonida kulrang yorliq: jonli xabar ko'rinmadi
  4. «17:00 ga o'tkazish» → soat «17:00» → 1-telefonga eslatma tushadi: «Maydon Jamoa» · «Bugun, 18:00 · Mahalla maydoni», ostida yorliq: qo'shilganda ilova qo'ygan
     Nom qatori: Telefon ekraniga ilova yopiq bo'lsa ham chiqadigan xabar — **eslatma**; ilova uni oldindan qo'ygan bo'lsa — **rejalashtirilgan eslatma**.
- Tugagach: Backend'dan 1-telefonga nuqtali kulrang yo'l, yorlig'i: Backend yuboradigan eslatma
- Natija qatori: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz ✕ — aslida: yo'q, joy bo'shagani yopiq ilovada ko'rinmadi)
- Xulosa: Ilova ochiq bo'lsa — jonli xabar; yopiq bo'lsa, bu misolda faqat ilova oldindan qo'ygan eslatma chiqadi.
- Izoh qatori: Backend yuboradigan eslatma ham bor — u bu modulda qurilmaydi: Google yoki Apple xizmati va alohida sozlash kerak.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/4) → Davom etish

## 6 · Amaliyot 2 — jonli xabar
- Eyebrow: Amaliyot 2 · jonli xabar
- Sarlavha: Ochiq ilovada o'zgarish *jonli xabar* bo'lib chiqsin.
- Mentor: Endi «Nima qilsin» qatorini o'zingiz yozasiz — qaysi o'zgarishda qanday xabar chiqishini siz tanlaysiz; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Trek tanlanmagan bo'lsa (mentor ostida): Trekingiz: Mobil trek · Web-trek
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — `README.md` dagi «Real vaqt» bo'limini oching: har qatorda kim nima qiladi va ekranda nima o'zgaradi. Foydalanuvchining o'ziga tegishli o'zgarishlarni belgilang — ular jonli xabarga arziydi. Har o'zgarish jonli xabarga arzimaydi: foydalanuvchi darhol bilishi kerak bo'lganini tanlang — qolganlari ekranda jimgina yangilanadi.
     - Mentor misolida — beshta: yana bir o'yinchi qo'shildi · joy bo'shadi · o'yin to'ldi · kelishini tasdiqladi (faqat tashkilotchiga) · navbatdan o'yinga o'tdingiz.
     - Talabdagi «Yana» qatorida Mentor misolining uch qoidasi tayyor turibdi: faqat o'ziga tegishli yozuv uchun · o'z harakati uchun emas · ismsiz. Mahsulotingizga mos kelmasa, tahrirlang.
  2. **Prompt** — «Nima qilsin» qatorini o'zingiz yozing (yonida kulrang namuna), «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: `mobil/` — 3-darsdagi hodisa tinglovchisi (`src/ulanish.ts`) va hamma ekranlar tepasidagi umumiy joy.
       > Nima qilsin: {nima qilsin}
       > Yana: {yana}
       > Nima buzilmasin: {nima buzilmasin}
     - Bo'sh qavs yonida kulrang namuna: {nima qilsin} — masalan: menga tegishli o'yinga yana bir o'yinchi qo'shilsa — «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10»
     - Oldindan yozilgan (tahrirlasa bo'ladi):
       - {yana} — jonli xabar ekran tepasida bir necha soniya tursin va o'zi yo'qolsin. Faqat menga tegishli yozuv uchun chiqsin; o'zim qilgan harakat uchun chiqmasin; xabarda ism bo'lmasin. Qaysi xabar chiqishini hodisadan keyin qayta so'ralgan javobni oldingisi bilan solishtirib tanla; o'z harakatimni javobdagi menga tegishli maydonlar o'zgarganidan bil, hodisaga yangi maydon qo'shma.
       - {nima buzilmasin} — «Hozir ko'ryapti», ro'yxat o'zi yangilanishi va ulanish belgisi avvalgidek ishlasin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam (ochiladigan) — Mentor misolidagi qator:
       > Nima qilsin: `oyin-ozgardi` kelib, ilova `GET /oyinlar` dan qayta so'ragach, yangi javobni oldingisi bilan solishtirsin. O'yin menga tegishli bo'lsa (qo'shilganman, navbatdaman yoki o'zim e'lon qilganman — buning uchun `GET /oyinlar` javobiga `menTashkilotchiman` qo'sh) — jonli xabar chiqsin:
       > qo'shilganlar ko'paysa — «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10», o'yin to'lsa — «Shanba, 18:00 — o'yin to'ldi: 10 / 10» · kamaysa — «Shanba, 18:00 — joy bo'shadi: 8 / 10» ·
       > tasdiqlaganlar ko'paysa (faqat tashkilotchiga) — «Shanba, 18:00 — kelishini tasdiqladi: 8 / 9» · men navbatdan o'yinga o'tsam — «Navbatdan o'yinga o'tdingiz: Shanba, 18:00». Kun, soat va sonlar — o'sha o'yindan.
       > Son o'zgarmasa (chiqqan o'rniga navbatdagi kirdi) — boshqalarga xabar chiqmasin. `menQoshilganman`, `menNavbatdaman` yoki `menTasdiqlaganman` o'zgargan bo'lsa — bu mening harakatim, xabar chiqmasin (navbatdan o'tish bundan mustasno). Hodisaga yangi maydon qo'shma.
       - Web-trekda (mobil trek tanlanmagan bo'lsa): Web-trekda: «Qayerda» — `prototip/` dagi tinglovchi (`src/ulanish.js`) va sahifa tepasi; jonli xabar sahifa tepasida chiqadi, qolgani bir xil.
  3. **Ishga tushirish** — `git status` → har faylni `git add <fayl>` bilan → `git commit -m "jonli xabar"` → `git push`. Agent Backend'ni ham o'zgartirgan bo'lsa — Render'da yangi versiya tugashini kuting.
     - Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — `r`); web-trekda — Netlify.
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabingizning har gapini bajarib ko'ring. Mentor misolida (siz Shanba 18:00 o'yiniga qo'shilgansiz; ilova «O'yinlar»da ochiq tursin):
     - (1) Agentga: «Tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas) va shu akkaunt nomidan Shanba 18:00 o'yiniga qo'shilish so'rovini yubor. Akkaunt va yangi yozuv `id` sini ayt.» → ekran tepasida «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10» bir necha soniya chiqishi kerak.
     - (2) Agentga: «O'sha tekshiruv akkauntini men qo'shilmagan o'yinga ham qo'sh, `id` sini ayt.» → jonli xabar chiqmasligi kerak: o'yin sizga tegishli emas.
     - (3) O'zingiz boshqa o'yinga qo'shiling → jonli xabar chiqmasligi kerak: bu sizning harakatingiz.
     - Tozalash: agentga — «Tekshiruvda yaratgan akkaunt va yozuvlaringni aytgan `id` lari bo'yicha o'chir.» Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
     - Amaliyot 1 ning 4-qadamini qoldirgan bo'lsangiz — shu yerda tekshiring.
- O'ng — kutilgan natija · namuna: Maydon Jamoa: telefon (Expo Go) — «O'yinlar» → tepada jonli xabar «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10» → xabar yo'qoladi, kartada «9 / 10»; web-trekda — brauzer oynasi, sahifa tepasida o'sha xabar.
  - Fayl kartasi (mobil): `mobil/src/ulanish.ts` o'zgardi · `mobil/src/app/_layout.tsx` o'zgardi
- Ostida: Ulgurmasangiz: vaqt tugayaptimi — (1) ni tekshirib, `git push` qiling va Amaliyot 3 ga o'ting; (2) va (3) ni oxirida tekshirib, shu yerga qaytib «Bajardim»ni bosasiz — blok shundan keyin bajarilgan sanaladi.
- Hammasi bajarilgach: Jonli xabar ishlaydi: faqat sizga tegishli o'zgarishda va ismsiz chiqadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Mentor misolida ilova yopiq, o'yiningizga yangi o'yinchi qo'shildi. *Nima bo'ladi*?
  - Eslatma keladi, uni Backend o'zi yuboradi
  - Jonli xabar keladi, ilova ochilganda
  - Eslatma keladi, uni ilova qo'ygan
  - ✔ Hech narsa kelmaydi, ochganda ko'rasiz
- Javob izohlari:
  - To'g'ri: Yopiq ilovada boshqa odam qilgan o'zgarish ko'rinmaydi.
  - A: Bu misolda Backend yuboradigan eslatma qurilganmi?
  - B: Jonli xabar qaysi paytda chiqadi — ilova ochiq turgandami?
  - C: Ilova eslatmani qachon qo'yadi — kim qo'shilganda?
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: D — <variant> · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 8 · Amaliyot 3 — eslatma (web-trekda — «Xabarlar» tasmasi)
- Eyebrow (trekka qarab): Amaliyot 3 · eslatma · web-trekda: Amaliyot 3 · xabarlar tasmasi
- Sarlavha (trekka qarab): Ilova yopiq bo'lsa ham, kerakli payt *eslatma chiqsin*. · web-trekda: Sayt ochiq paytdagi xabarlar *tasmada tursin*.
- Mentor: Oxirgi blokda uch qatorni o'zingiz yozasiz — har qator ostida kulrang savol, Mentor misoli «Yordam»da; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Trek tanlanmagan bo'lsa (mentor ostida): Trekingiz: Mobil trek · Web-trek
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — eslatma nima uchun kerakligini toping: foydalanuvchi o'z ishini qachon unutishi mumkin? Mentor misolida — o'yinga qo'shilgan o'yinchi o'yin vaqtini unutmasin: eslatma o'yindan bir soat oldin.
     - Ikki halol chegara: eslatma faqat shu telefonda qilingan ishdan qo'yiladi — boshqa telefondan kirilsa, u yerda eslatma yo'q. Telefonda eslatmalar o'chirilgan bo'lsa — chiqmaydi.
     - Web-trekda bu blokda — «Xabarlar» tasmasi: sahifa ochiq paytda kelgan oxirgi beshta jonli xabar. Sayt yopiq bo'lsa, xabar kelmaydi — brauzer eslatmasi alohida sozlashni talab qiladi.
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: {qayerda}
       > Nima qilsin: {nima qilsin}
       > Nima buzilmasin: {nima buzilmasin}
       > Eslatma — `expo-notifications` bilan (`npx expo install expo-notifications`); `README.md` «Stek» qatoriga qo'sh. Ruxsatni birinchi marta so'ra (Android'da avval eslatma kanalini yarat); ruxsat berilmasa — ilova ishlayversin, eslatma qo'yilmasin. (web-trekda bu qator yo'q)
       > Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Qatorlar ostidagi kulrang savollar:
       - {qayerda} — Qaysi ekranda, qaysi tugma bosilganda qo'yiladi va qachon bekor bo'ladi?
       - {nima qilsin} — Qachon chiqsin va unda nima yozilsin? Qachon qo'yilmasin?
       - {nima buzilmasin} — Oldin ishlagan qaysi narsa joyida qolsin?
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab (mobil trek):
       > Qayerda: `mobil/` — «O'yin» ekranidagi «Qo'shilaman» va «O'yindan chiqish» (`src/app/oyin/[id].tsx`).
       > Nima qilsin: «Qo'shilaman» muvaffaqiyatli bo'lganda ilova eslatmani o'yindan bir soat oldinga rejalashtirsin: sarlavha «Maydon Jamoa», matn «Bugun, 18:00 · Mahalla maydoni» (soat va maydon — o'sha o'yindan).
       > O'yinga bir soatdan kam qolgan bo'lsa — rejalashtirmasin. «O'yindan chiqish» bosilganda shu o'yinning eslatmasi bekor bo'lsin. Bitta o'yinga bitta eslatma: qayta rejalashtirilsa — eskisi bekor bo'lsin. Ilova ochiq paytga to'g'ri kelsa ham, eslatma ko'rinsin.
       > Nima buzilmasin: qo'shilish, chiqish, navbat, jonli xabar va «Hozir ko'ryapti» avvalgidek ishlasin.
       > Eslatma — `expo-notifications` bilan (`npx expo install expo-notifications`); `README.md` «Stek» qatoriga qo'sh. Ruxsatni birinchi marta so'ra (Android'da avval eslatma kanalini yarat); ruxsat berilmasa — ilova ishlayversin, eslatma qo'yilmasin.
       > Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam — web-trekda (web trekda faqat shu; trek tanlanmagan bo'lsa — mobil misol ostida):
       > Qayerda: `prototip/` — sahifadagi yangi «Xabarlar» tasmasi.
       > Nima qilsin: sahifa ochiq paytda chiqqan har jonli xabar tasmaga ham yozilsin: oxirgi beshtasi, eng yangisi tepada. Sahifa yangilansa — tasma bo'sh boshlanadi.
       > Nima buzilmasin: jonli xabar, «Hozir ko'ryapti» va «Yangilash» tugmasi avvalgidek ishlasin.
  3. **Ishga tushirish** — bu blokda Backend o'zgarmaydi, Render kutilmaydi. Mobil trekda paket qo'shilgach terminalda `r` — Expo Go ilovani qayta yuklaydi (bo'lmasa — `npx expo start` ni qayta ishga tushiring); web-trekda — `git push`, Netlify saytni odatda o'zi yangilaydi.
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — Mentor misolida, test holati bilan:
     - (1) Agentga: «Test holati: eslatma «Qo'shilaman» bosilgandan bir daqiqa keyin chiqsin — vaqtincha. Faqat shu vaqtni o'zgartir va qaysi qatorni o'zgartirganingni ayt.»
     - (2) Siz qo'shilmagan o'yinga qo'shiling. Birinchi marta ilova ruxsat so'raydi — ruxsat bering. Ilovani yoping va bir daqiqa kuting: telefon ekranida «Maydon Jamoa» eslatmasi chiqishi kerak, soati va maydoni — o'sha o'yinniki. Test holatida «Bugun» so'zi kunga mos kelmasligi mumkin — soat va maydonni tekshiring.
     - (3) Yana bir o'yinga qo'shiling, bir daqiqa o'tmasdan «O'yindan chiqish»ni bosing va ilovani yoping: bir daqiqadan keyin eslatma chiqmasligi kerak.
     - (4) Agentga: «Test holatini qaytar: eslatma o'yindan bir soat oldin.» Agent aytgan qatorda vaqt qaytganini ko'ring.
     - Eslatma chiqmasa — avval telefon sozlamasini tekshiring: ruxsat bermagan bo'lsangiz, u yerdan yoqiladi.
     - Oxirida: `git status` → `git add <fayl>` → `git commit -m "eslatma"` → `git push`.
     - Web-trekda: agentga — «Tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas) va shu akkaunt nomidan menga tegishli yozuvda ikki o'zgarish qil, `id` larini ayt.» → tasmada ikki qator, eng yangisi tepada; sahifani yangilang — tasma bo'sh; keyin agent akkaunt va yozuvlarni aytgan `id` lari bo'yicha o'chiradi.
- O'ng — kutilgan natija · namuna: Maydon Jamoa:
  - mobil: telefon (Expo Go) — «O'yin», «Qo'shilaman» → ruxsat oynasi (kulrang chizma) → «Qo'shildingiz», «9 / 10» → ilova yopiq, soat «17:00», eslatma «Maydon Jamoa · Bugun, 18:00 · Mahalla maydoni»
  - Fayl kartasi: `mobil/src/app/oyin/[id].tsx` o'zgardi · `mobil/package.json` + expo-notifications · `README.md` «Stek»: + expo-notifications
  - web-trekda: brauzer oynasi — sahifada «Xabarlar» tasmasi, ikki qator (eng yangisi tepada): «Shanba, 18:00 — joy bo'shadi: 8 / 10» · «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10»
- Ostida: Ulgurmasangiz: vaqt tugasa — yakun ekrani nima qolganini aytadi; Amaliyot 1 dagi «Ortda qoldingizmi» qatori bilan Mentor misolini ochib, qolgan qadamni o'z repo'ngizda tugatasiz.
- Hammasi bajarilgach (trekka qarab): Eslatma test holatida chiqdi, chiqilganda bekor bo'ldi: talabni o'zingiz yozdingiz. · web-trekda: Tasma ishlaydi: sahifa ochiq paytdagi xabarlar turadi, talabni o'zingiz yozdingiz.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 9 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 10 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.
- Birinchi bosishgacha: Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon | Izoh |
|---|---|---|
| Xona nima? | Backend'dagi ulanishlar guruhi | Hodisa faqat shu guruhdagilarga boradi; Mentor misolida har o'yinning xonasi — `oyin-{id}` |
| «Hozir ko'ryapti» nimani sanaydi? | Ekranni hozir ochib turgan ulanishlarni | Bitta odam ikki qurilmada — ikkita; ism ko'rsatilmaydi |
| Nega `korayotganlar-ozgardi` sonning o'zini olib keladi? | Bu son Database'da yo'q | U faqat Backend xotirasidagi ulanishlardan sanaladi |
| Jonli xabar nima? | Ilova ochiq turganda ekran tepasida bir necha soniya chiqadigan qisqa xabar | Mentor misolida: «Shanba, 18:00 — joy bo'shadi: 8 / 10» |
| Mentor misolida jonli xabar kimga chiqadi? | O'yin o'ziga tegishli bo'lgan o'yinchiga: qo'shilgan, navbatda turgan yoki e'lon qilgan | O'z harakati uchun chiqmaydi; ism yo'q |
| Eslatma nima? | Telefon ekraniga chiqadigan xabar | Ilova yopiq bo'lsa ham chiqadi |
| Rejalashtirilgan eslatma nima? | Ilova o'zi oldindan vaqtini belgilab qo'ygan eslatma | Mentor misolida — «Qo'shilaman» bosilganda, o'yindan bir soat oldinga |
| Backend yuboradigan eslatma nima? | Hodisa bo'lganda Backend telefonga yuboradigan eslatma | Inglizchasi: push notification. Alohida sozlash kerak, Expo Go'da ishlamaydi; bu modulda qurilmaydi |
| Mentor misolida ilova yopiq paytda joy bo'shasa, nima bo'ladi? | Telefonga hech narsa kelmaydi | Ilova ochilganda yangi son Backend'dan so'raladi |
| Eslatmaga ruxsat berilmasa, nima bo'ladi? | Ilova ishlayveradi, eslatma chiqmaydi | Ruxsat telefon sozlamalaridan yoqiladi |
| Bu darsda test holati nima? | Eslatma vaqtini vaqtincha bir daqiqadan keyinga qo'yish | Tekshirgach, vaqt qaytariladi |
| «Xabarlar» tasmasi nima? | Web-trekda sahifa ochiq paytda kelgan oxirgi beshta jonli xabar | Sayt yopiq bo'lsa, xabar kelmaydi — brauzer eslatmasi alohida sozlashni talab qiladi |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni
- Eyebrow: Yakun
- Yuqori yorliq: ✓ Uch qism ishlaydi (faqat uchala blok bajarilganda) · N/2 to'g'ri
- Sarlavha (holatga qarab):
  - uchala blok bajarilgan: Uch qism ishlayapti: oxirgi talabni o'zingiz yozdingiz.
  - Amaliyot 1 va 2 bajarilgan, 3 yo'q — mobil: Jonli xabar ishlaydi — eslatma qoldi. · web-trekda: Jonli xabar ishlaydi — «Xabarlar» tasmasi qoldi.
  - Amaliyot 1 bajarilgan, 2 yo'q: «Hozir ko'ryapti» ishlaydi — jonli xabar qoldi.
  - Amaliyot 1 bajarilmagan, 2 yoki 3 bajarilgan: «Hozir ko'ryapti»ni telefonda tekshirish qoldi.
  - hech biri: Loyiha kuni hali tugamagan — qolgan qadamni tugating.
- CODE STRIKE arenasi (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Xona — Backend'dagi ulanishlar guruhi: hodisa faqat shu guruhdagilarga boradi.
  - «Hozir ko'ryapti» ochiq ekranlarni sanaydi, odamlarni emas.
  - Mentor misolida jonli xabar faqat o'yinchiga tegishli o'zgarishda va ismsiz chiqadi.
  - Eslatmani tekshirish uchun test holatida vaqt vaqtincha qisqartiriladi, keyin qaytariladi.
  - Agent «bajardim» desa ham, talabning har gapini telefonda o'zingiz tekshirasiz.
- Keyingi dars — **«Ulanish uzilsa: buzamiz va tuzatamiz»**.
- Nishonlaringiz — N/4 (to'rtta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Nishonlar
- **Open Screens** — Ochiq ekranlar sanalishini birinchi urinishda topdingiz (4-ekran, birinchi urinishda to'g'ri)
- **Open or Closed** — Yopiq ilovaga nima yetmasligini birinchi urinishda topdingiz (7-ekran, birinchi urinishda to'g'ri)
- **Live Message** — Jonli xabar talabini yozib, telefonda tekshirdingiz (6-ekran, oxirgi «Bajardim»)
- **Heads Up** — Eslatmani (web-trekda — tasmani) telefonda tekshirdingiz (8-ekran, oxirgi «Bajardim»; bonus)
- Nishon olinganda: nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 4-ekran (1-savol) — **Ochiq ekranlar sanaladi**
   - `oyin-ochildi` · Ekran ochildi — ilova o'yin xonasiga kiradi.
   - `oyin-{id}` · Xonada — shu o'yin ekrani ochiq ulanishlar.
   - `{ oyinId, soni }` · Backend xonadagi ulanishlarni sanab, sonni o'zi yuboradi.
   - Sinfga savol: Telefoningiz va sinfdoshingiz telefonida bir xil o'yin ochiq. Son nechta bo'ladi va nega?
2. 7-ekran (2-savol) — **Ochiq ilova — jonli xabar, yopiq — eslatma**
   - `oyin-ozgardi` · Ilova ochiq — hodisa keladi, tepada jonli xabar chiqadi.
   - ilova yopiq · Boshqa odam qilgan o'zgarish jonli xabar bo'lib ko'rinmaydi.
   - `scheduleNotificationAsync` · Eslatmani ilova o'zi oldindan qo'yadi, Backend emas.
   - Sinfga savol: Ilova yopiq paytda o'yinchi joy bo'shaganini qanday bilishi mumkin edi?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Qayta ishlash · mustaqil rejimda: Keyingi → · Natijani ko'rish · jonli dars tugasa: «Jonli dars yakunlandi — testni o'zingiz davom ettiring:» · Mashq rejimida davom etish

1. Mentor misolida `korayotganlar-ozgardi` kimlarga boradi?
   - ✔ Shu o'yin xonasidagi ulanishlarga
   - Hamma ulangan ilovalarga birdaniga
   - O'yinni e'lon qilgan tashkilotchiga
   - Database'dagi hamma o'yinchilarga
2. Siz «O'yinlar» ekranidasiz, kimdir o'yinni ochdi. Sizga yangi son keladimi?
   - Ha — hamma ulangan ilovaga boradi
   - ✔ Yo'q — siz o'yin xonasida emassiz
   - Ha — ro'yxatdagi har kartaga boradi
   - Yo'q — son Database'dan olinadi
3. Boshqa telefonda o'yin ekrani yopildi. Sizdagi «Hozir ko'ryapti» nima bo'ladi?
   - O'zgarmaydi, pastga tortish kerak
   - Nolga tushadi, xona yopilib qoladi
   - ✔ Bittaga kamayadi, hodisa o'zi keladi
   - Bittaga oshadi, yana bir ekran ochildi
4. Nega «Hozir ko'ryapti» sonini hodisaning o'zi olib keladi?
   - Son juda tez o'zgarib turadi
   - Ilova so'rov yubora olmaydi
   - Backend shunday tezroq ishlaydi
   - ✔ Bu son Database'da saqlanmaydi
5. Ilova ochiq. O'yiningizda joy bo'shadi. Nima ko'rasiz?
   - ✔ Ekran tepasida qisqa jonli xabar
   - Telefon ekranida eslatma kartasi
   - Hech narsa, ro'yxatni yangilash kerak
   - Ilova o'zi yopilib, qayta ochiladi
6. O'zingiz «Qo'shilaman»ni bosdingiz. Mentor misolida jonli xabar chiqadimi?
   - Ha — har bir qo'shilish uchun chiqadi
   - ✔ Yo'q — o'z harakatingiz uchun chiqmaydi
   - Ha — ismingiz bilan birga tepada chiqadi
   - Yo'q — jonli xabar tashkilotchiga chiqadi
7. Rejalashtirilgan eslatmani kim qo'yadi?
   - Backend, hodisa bo'lgan zahoti yuborib
   - Tashkilotchi, o'yinni e'lon qilgan paytda
   - ✔ Ilovaning o'zi, vaqtini oldindan belgilab
   - Telefon, har kuni bir xil soatda o'zi
8. Mentor misolida eslatma qachon chiqishi kerak?
   - O'yin boshlanadigan daqiqaning o'zida
   - Qo'shilgan zahoti, faqat bir marta
   - O'yindan bir kun oldin, kechqurun
   - ✔ O'yin boshlanishidan bir soat oldin
9. Mentor misolida «O'yindan chiqish» bosildi. Eslatma nima bo'ladi?
   - ✔ Bekor qilinadi, endi chiqmaydi
   - Baribir o'z vaqtida chiqadi
   - Boshqa o'yinga ko'chib o'tadi
   - Tashkilotchiga yuborib qo'yiladi
10. Backend yuboradigan eslatma uchun nima kerak?
    - Expo Go va telefondagi eslatma ruxsati
    - ✔ Google yoki Apple xizmati va sozlash
    - Ochiq ulanish va Backend'dagi xona
    - `expo-notifications` paketining o'zi
11. Mentor misolida eslatmaga ruxsat berilmadi. Nima bo'ladi?
    - Ilova ochilmaydi, eslatma chiqadi
    - Ilova ishlaydi, eslatma ham chiqadi
    - ✔ Ilova ishlaydi, eslatma chiqmaydi
    - Ilova yopiladi, ruxsat qayta so'raladi
12. Web-trekda uchinchi amaliyotda nima quriladi?
    - Brauzer eslatmasi, alohida sozlab
    - Telefonga yuboriladigan SMS xabar
    - Har daqiqada sahifani yangilash
    - ✔ Sahifadagi «Xabarlar» tasmasi

## Kartochkalar
10-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 11-ekrandagi 5 qator.
- Keyingi dars — «Ulanish uzilsa: buzamiz va tuzatamiz».
