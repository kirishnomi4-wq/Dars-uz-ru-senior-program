# 9-dars «Loyiha kuni: foydalanuvchini qaytaradigan eslatma» — yakuniy matn

Fayl: `src/10-Modull/RetentionDayLesson.jsx` · 12 ekran · Keyingi dars: «50 foydalanuvchiga yetdingizmi?»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — ikki telefon va Backend: chapda «1-telefon · siz», o'rtada Backend tuguni («Backend», ichida «Database: N»), o'ngda «2-telefon · boshqa o'yinchi». Telefon bilan Backend orasida chiziq; konvert chiziq bo'ylab uchadi (yorlig'i — «so'rov», «javob» yoki hodisa nomi `oyin-ozgardi`, so'rov `GET /oyinlar`).
Telefon ramkasi tepasida «Maydon Jamoa» nomi. Namuna o'yin: Shanba, 18:00 · Mahalla maydoni · 7 / 10 (kerak — 10).
Telefon ekranlari: **O'yinlar** — sarlavha «O'yinlar», yonida ulanish belgisi «Ulangan» (ochilayotganda «Ulanmoqda…»), o'yin kartasi (Shanba, 18:00 · Mahalla maydoni · 7 / 10) · **O'yin** — «Shanba, 18:00», «Mahalla maydoni», «7 / 10», «Qo'shilaman» (bosilgach — «Qo'shildingiz») · **ilova yopiq** — telefon qulf ekrani (qulf belgisi; eslatma kartalari shu yerga tushadi).
Jonli xabar — ilova ichida, ekran tepasida: «Maydon Jamoa» + «Shanba, 18:00 — 2 joy qoldi»; bir necha soniyadan keyin yo'qoladi. Eslatma — qulf ekranida: «Maydon Jamoa» + matn (uch kunlik eslatma: «Hafta oxiriga o'yin bormi? E'lonlarni ko'ring»).

## 0 · Kirish
- Eyebrow: Loyiha kuni · kirish
- Sarlavha: Ilovani ochmay qo'ygan o'yinchiga *nima ko'rinadi*?
- Mentor:
  - boshida: Mentor misolida ilovani ochgan qurilmalarning ko'pi keyingi ikki kunda uni yana ochmadi — avval javobni tanlang.
  - javobdan keyin: 7-Modulda bot uchun sanagan qaytganlar foizini bu yerda qurilmalar bo'yicha ko'rasiz; «Davom etish»ni bosing.
- Maket: telefon, ustida yorliq «o'yinchi · ilova yopiq» — qulf ekrani (bo'sh).
- Telefon ostida hisoblagich, ustida «Mentor misolida»:
  - 1–3-kun · ilovani ochgan qurilmalar — 46 (to'liq ustun)
  - 4–5-kun · ulardan yana ochgani — 17 (qisqa ustun)
- Variantlar (ballsiz):
  - Ilova ichidagi jonli xabar
  - Telefon ekraniga chiqqan eslatma
  - O'zi yangilangan o'yinlar ro'yxati
- Javob izohlari:
  - «Telefon ekraniga chiqqan eslatma» tanlansa: **Aynan!** Ilova yopiq bo'lsa, ichidagi narsa ko'rinmaydi. Telefon ekraniga esa eslatma chiqa oladi.
  - «Ilova ichidagi jonli xabar» tanlansa: **Qiziq fikr!** Jonli xabar ilova ochiq paytda chiqadi. Ilova yopiq bo'lsa, uni hech kim ko'rmaydi.
  - «O'zi yangilangan o'yinlar ro'yxati» tanlansa: **Qiziq fikr!** Ro'yxat ilova ochiq turganda yangilanadi. Ilovani ochmagan odam uni ko'rmaydi.
- Javobdan keyin: qulf ekraniga eslatma kartasi tushadi — «Maydon Jamoa» · «Hafta oxiriga o'yin bormi? E'lonlarni ko'ring»; hisoblagich ostida qator: qaytganlar foizi — **taxminan 37%** · shu 46 qurilma bo'yicha sanalgan
- Tugma: Davom etish

## 1 · Bugun quramiz
- Eyebrow: Reja
- Sarlavha: Bugun ilovangizga *qaytaradigan eslatma* qo'shasiz.
- Mentor: Hodisadan eslatmagacha bo'lgan yo'lni uch blokda qurasiz — talabni siz yozasiz, namuna «Yordam»da turadi.
- Chap — Dars oxirida: «1-telefon · siz» bir marta o'zi yuradi: «O'yinlar» (Ulangan · Shanba, 18:00 · Mahalla maydoni · 7 / 10) → «8 / 10», tepada jonli xabar «Shanba, 18:00 — 2 joy qoldi» → xabar yo'qoladi → qulf ekrani → eslatma «Maydon Jamoa · Hafta oxiriga o'yin bormi? E'lonlarni ko'ring» → eslatma bosiladi → «O'yinlar» ochiladi → telefon ostida: eslatmadan ochdi · **+1**
- Reja:
  1. Ilova ochiq: foydali jonli xabar
  2. Ilova yopiq: oldindan qo'yilgan eslatma
  3. Eslatmadan ochilganlar sanaladi
- Pastki qator: o'z repo'ngiz · Mentor misoli `maydon-jamoa` · boshlang'ich teg `m12-dars-09-start` · namuna `m12-dars-09-done`
- Pastki qator 2: «Maydon Jamoa» — namuna; amaliyotlarni o'z mahsulotingizda bajarasiz. Web-trekda 2-amaliyotda «Siz yo'q paytingizda» qatori quriladi.
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Yopiq ilova nimani biladi?
- Eyebrow: Tushuncha · ochiq va yopiq ilova
- Sarlavha: Yopiq ilova boshqa odamning *o'zgarishini biladimi*?
- Mentor (bosqichga qarab):
  - bashoratgacha: Avval taxminingizni belgilang, keyin ikkinchi telefonda «Qo'shilaman»ni bosing.
  - 1-harakatdan keyin: Xabar uchun yangi hodisa kerak bo'lmadi — endi birinchi telefonda «Ilovani yopish»ni, keyin ikkinchisida «E'lon berish»ni bosing.
  - 2-harakatdan keyin: Endi birinchi telefonda «Ilovani ochish»ni bosing.
  - tugagach: Uchala harakat tugadi — natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, yorliq «Avval o'zingiz belgilab ko'ring»): Ilova yopiq paytda yangi o'yin e'lon qilindi. Siz buni qachon bilasiz? · Shu zahoti — telefon ekranida · Ilovani o'zingiz ochganingizda
  - Tanlangach ixcham qator: Taxminingiz · savol · tanlangan variant
- Sahna:
  - 1-telefon · siz — «O'yinlar»: Ulangan · Shanba, 18:00 · Mahalla maydoni · 7 / 10; telefon ostida tugma «Ilovani yopish» (yopilgach — «Ilovani ochish»)
  - Backend — «Database: 7»
  - 2-telefon · boshqa o'yinchi — «O'yin»: Shanba, 18:00 · Mahalla maydoni · 7 / 10 · «Qo'shilaman»; telefon ostida tugma «E'lon berish»
- Harakatlar:
  1. «Qo'shilaman» (2-telefon) → konvert «so'rov» Backend'ga → «Database: 8», 2-telefonda «8 / 10» va «Qo'shildingiz» → konvert `oyin-ozgardi` 1-telefonga → konvert `GET /oyinlar` Backend'ga → «javob» qaytadi → 1-telefonda «8 / 10», tepada jonli xabar «Shanba, 18:00 — 2 joy qoldi» (bir necha soniyadan keyin yo'qoladi).
  2. «Ilovani yopish» (1-telefon) → qulf ekrani, chiziq xira → «E'lon berish» (2-telefon) → konvert «so'rov» Backend'ga → Backend ichida qator «+1 o'yin» → 1-telefon ostida kulrang yorliq: jonli xabar ko'rinmadi
  3. «Ilovani ochish» (1-telefon) → «O'yinlar», belgi «Ulanmoqda…» → «Ulangan» → konvert `GET /oyinlar` → «javob» → ro'yxat tepasida yangi karta: Yakshanba, 18:00 · Maktab maydoni · 0 / 10
- Joriy qator: Bu ilovada yopiq telefonga faqat ilova oldindan qo'ygan eslatma chiqadi.
- Natija qatori: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz ✕ — aslida: ilovani o'zingiz ochganingizda)
- Xulosa: Bu misolda jonli xabar faqat ochiq ilovada ko'rinadi: yopiq ilova o'zgarishni ochilgandagina ko'radi.
- Tugmalar: Orqaga · Avval taxminingizni belgilang → Harakatlarni navbat bilan bajaring (N/3) → Davom etish

## 3 · Amaliyot 1 — jonli xabar
- Eyebrow: Amaliyot 1 · ilova ochiq
- Sarlavha: Ilova ochiq paytda *foydali jonli xabar* chiqsin.
- Mentor: Talabni uch qatorda o'zingiz yozasiz, Mentor namunasi «Yordam» ortida; «1 · Ochish»dan boshlang.
  - Bandlar orasida: Keyingi bo'lim — «N · <band>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Trek tanlanmagan bo'lsa (mentor ostida): Trekingiz: Mobil trek · Web-trek
- Bandlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching — 8-darsda to'xtagan joyingizdan. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin. Mobil trekda `npx expo start` ishlab tursin, ilova telefoningizda ochiq bo'lsin; web-trekda saytingiz ochiq tursin.
     - Ikki savolga javob toping: ilova ochiq turganda foydalanuvchi qaysi o'zgarishni bilsa, biror ish qiladi? Xabarda nima yoziladi? (Mentor misolida: o'zi qo'shilmagan o'yinda bir yoki ikki joy qolsa — «Shanba, 18:00 — 2 joy qoldi».)
     - Mahsulotingizda shunday o'zgarish bo'lmasa — 4-darsdagi jonli xabarlaringizdan birini foydaliroq qiling: matni foydalanuvchiga keyin nima qilishini aytsin.
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Vazifa: Ilova ochiq turganda foydalanuvchi o'zi uchun foydali o'zgarishni jonli xabarda ko'radi — ism yo'q, o'z harakati uchun emas.
     - Prompt qutisi (Siz → Antigravity · Nusxalash; bosilgach — ✓ Nusxalandi; uch joy to'lmaguncha tugma yopiq):
       > Qayerda: {qayerda}
       > Nima qilsin: {nima qilsin}
       > Nima buzilmasin: {nima buzilmasin}
       > Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `mobil/` — jonli xabarlar (4-darsda qurilgan joy) va «O'yinlar» ekrani.
       > Nima qilsin: `oyin-ozgardi` kelib, ilova `GET /oyinlar` ni qayta so'ragach, o'yinchi qo'shilmagan o'yinda bir yoki ikki joy qolgan bo'lsa, jonli xabar chiqsin: «{kun}, {soat} — {N} joy qoldi» (masalan, «Shanba, 18:00 — 2 joy qoldi»).
       > Joy soni — kerak bo'lganlar minus qo'shilganlar. Yangi hodisa qo'shma: son qayta so'ralgan javobdan olinsin. Ilova ochiq turgan davrda bir o'yinda bir xil son uchun xabar bir marta chiqsin.
       > Nima buzilmasin: 4-darsdagi jonli xabarlar (ular faqat menga tegishli o'yin uchun) va «Hozir ko'ryapti» avvalgidek; xabarda ism yo'q; o'yinchining o'z harakati uchun xabar chiqmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
       - Web-trekda (mobil trek tanlanmagan bo'lsa): Web-trekda: «Qayerda» qatorida ilova o'rniga sayt papkangizdagi jonli xabarlar va o'yinlar sahifasi turadi; xabar «Xabarlar» tasmasiga ham tushadi (4-darsdagidek), qolgani o'sha.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "jonli xabar: joy qoldi"`, `git push`.
     - Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`). Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.
     - Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — talabingizning har qatorini ko'ring:
     - (1) Ilovangiz ochiq tursin. O'zgarishni boshqa akkaunt qilsin: sherigingiz o'z akkauntidan — ilovangiz o'rnatilgan telefonida yoki brauzer ko'rinishida (web-trekda — kompyuterdagi ikkinchi oynada, ikkinchi akkaunt bilan).
     - Sherik bo'lmasa — agent: tekshiruv akkauntlari ochadi (namuna ma'lumot bilan, `namuna = true`), ular nomidan so'rov yuboradi va qaysi akkaunt, qaysi `id` ekanini aytadi.
     - Mentor misolida: siz qo'shilmagan, uch joy qolgan o'yin kerak — sherik unga qo'shiladi. Bunday o'yin bo'lmasa, agentga: «Men qo'shilmagan bitta o'yinni tanla. Tekshiruv uchun yangi akkauntlar och (namuna ism va login bilan, haqiqiy emas, `namuna = true`) va ular nomidan qo'shilish so'rovlarini bittadan yubor, uch joy qolganda to'xta. Qaysi akkauntlar va qaysi o'yin `id` si ekanini ayt.» Sherik bo'lmasa — «ikki joy qolganda to'xta».
     - Telefoningizda son o'zgarishi va jonli xabar chiqishi kerak. Chiqmasa — nima kutganingiz va nima ko'rganingizni agentga yozing.
     - (2) «Nima buzilmasin» qatoringizni tekshiring (Mentor misolida: shu o'yinga o'zingiz qo'shiling — sizga xabar chiqmasligi kerak).
     - (3) Agent tekshiruv akkauntlari ochgan bo'lsa — agentga: «Faqat hozir yaratgan tekshiruv akkauntlari va yozuvlarini — aytgan `id` laring bo'yicha — o'chir.» Agentning «bajardim» degani — uning so'zi; xabarni esa o'zingiz ko'rdingiz.
- O'ng — kutilgan natija · namuna: Maydon Jamoa (bir marta o'zi yuradi):
  - mobil: telefon (Expo Go) — «O'yinlar»: Ulangan · Shanba, 18:00 · Mahalla maydoni · 7 / 10 → «8 / 10», tepada jonli xabar «Shanba, 18:00 — 2 joy qoldi»
  - web-trekda: brauzer oynasi `….netlify.app` — «Maydon Jamoa», «O'yinlar», Shanba, 18:00 · Mahalla maydoni · 7 / 10 → 8 / 10; sahifa tepasida xabar «Shanba, 18:00 — 2 joy qoldi» va «Xabarlar» tasmasida o'sha xabar
- Ostida (4-band bajarilguncha): Ulgurmasangiz: tekshiruv akkauntlarini o'chirishni dars oxiriga qoldiring. Xabar chiqishini o'zingiz ko'rmasdan 2-amaliyotga o'tmang — keyin qaysi o'zgarish buzganini ajratish qiyin bo'ladi.
- Ostida: Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-09-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — qanday ishlashini ko'rasiz, o'z repo'ngizdagi ishni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).
- Hammasi bajarilgach: Ilova ochiq turganda foydalanuvchi o'zi uchun foydali o'zgarishni ko'radi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish (faqat 4-band «Bajardim»idan keyin)

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: Mentor ilovasi yopiq. «2 joy qoldi» xabari o'yinchiga *chiqadimi*?
  - Chiqadi — jonli xabar telefon ekranida ko'rinadi
  - ✔ Chiqmaydi — jonli xabar ochiq ilovada chiqadi
  - Chiqadi — ilova uni yopiq paytda ham oladi
  - Chiqmaydi — bu xabar faqat tashkilotchiga chiqadi
- Javob izohlari:
  - To'g'ri: Jonli xabar faqat ochiq ilovada ko'rinadi.
  - A: Jonli xabar ilova ichida chiqadi. Ilova yopiq bo'lsa-chi?
  - C: Ilova yopiq bo'lsa, jonli xabarni kim ko'radi?
  - D: Mentor misolida bu xabar o'yinga qo'shilmaganlarga chiqadi.
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: B — <variant> · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Jonli darsda savol ustida: Jonli dars — bitta urinish, o'ylab bosing!
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 5 · Qaysi eslatma foydali?
- Eyebrow: Tushuncha · foydali eslatma
- Sarlavha: Telefon ekraniga *qanday eslatma* chiqsin?
- Mentor (bosqichga qarab):
  - bashoratgacha: Mentor misolida eslatmaning to'rtta matni bor — avval taxminingizni belgilang.
  - matnlar paytida: Matnni «Qoidadan o'tkazish» bilan tekshiring va o'ngdagi uch katakni kuzating.
  - to'rttasidan keyin: Endi telefon ostidagi «Eslatmalar» o'chirgichini bosing.
  - tugagach: Natijani taxminingiz bilan solishtiring.
- Bashorat (ballsiz, yorliq «Avval o'zingiz belgilab ko'ring»): To'rt matndan nechtasi qoidadan o'tadi? · Bittasi · Ikkitasi · Uchtasi
- Chap: telefon, ustida yorliq «o'yinchi · ilova yopiq» va hisoblagich «Bu hafta: 0 / 2»; qulf ekraniga matn kartasi bittadan tushadi, ustida «Matn N / 4» (2-kartada: «Matn 2 / 4 · 4-darsdagi o'yin eslatmasi»). Telefon ostida tugma «Qoidadan o'tkazish» va o'chirgich «Eslatmalar» (yoqiq; to'rt matngacha xira).
- O'ng: tekshiruv kartasi «Foydali eslatma», ostida «bu kursda · rejalashtirilgan eslatma uchun» — uch katak:
  - O'z ishiga tegishli, foydasi aniq
  - Rost: ilova buni oldindan biladi
  - Bosim, qo'rqitish, uyaltirish yo'q
- Matnlar (shu tartibda; har birida «Qoidadan o'tkazish» → uch katakka ✓ yoki ✕ navbat bilan):
  1. Sizni sog'indik! Maydon Jamoa'ga qayting → ✕ · ✓ · ✕ — qizil qator: Foyda aytilmagan — faqat bosim.
  2. Bugun, 18:00 · Mahalla maydoni → ✓ · ✓ · ✓ — karta qulf ekranida qoladi, «Bu hafta: 1 / 2»
  3. Yangi o'yin e'lon qilindi: qo'shiling → ✓ · ✕ · ✓ — qizil qator: Yopiq ilova yangi e'lonni bilmaydi.
  4. Hafta oxiriga o'yin bormi? E'lonlarni ko'ring → ✓ · ✓ · ✓ — karta qoladi, «Bu hafta: 2 / 2»
- To'rttasidan keyin hisoblagich ostida: Hafta to'ldi: ilova bu hafta o'zidan yangi eslatma qo'shmaydi.
- «Eslatmalar» o'chirgichi bosiladi → o'chadi → qulf ekranidagi ikki karta so'nadi, «Bu hafta: 0 / 2», «Hafta to'ldi» qatori yo'qoladi
- Joriy qator: O'chirgich foydalanuvchida: o'chirsa, rejalashtirilgan eslatmalar bekor bo'ladi.
- Natija qatori: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz ✕ — aslida: ikkitasi)
- Xulosa: Bu kursda eslatma o'z ishiga tegishli, rost va bosimsiz; hafta ikkitaga to'lsa, ilova o'zidan qo'shmaydi.
- Tugmalar: Orqaga · Avval taxminingizni belgilang → Matnni tekshiring (N/4) → O'chirgichni bosing → Davom etish

## 6 · Amaliyot 2 — ilova yopiq paytdagi eslatma
- Eyebrow: Amaliyot 2 · ilova yopiq
- Sarlavha: Ilova yopiq bo'lsa ham *foydali eslatma* chiqsin.
- Mentor: Eslatma matnini uch katak bilan o'zingiz tekshirib yozing; «1 · Ochish»dan boshlang.
  - Bandlar orasida: Keyingi bo'lim — «N · <band>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Bandlar:
  1. **Ochish** — o'z repo'ngiz, 1-amaliyotdan keyingi kod. 4-darsdagi eslatma qayerda qo'yilganini agentdan so'rang yoki faylni oching. Ikki savolga javob toping: ilovani bir necha kun ochmagan foydalanuvchiga nima foydali? Ilova buni oldindan biladimi?
     - Matningizni oldingi mashqdagi uch katak bilan tekshiring. Mentor misolida bitta eslatma: ilova oxirgi ochilgandan uch kun o'tib, soat 17:00 da — «Hafta oxiriga o'yin bormi? E'lonlarni ko'ring».
     - U ilovani uch kun ochmagan odamga chiqadi: har kuni ochadigan odamga umuman chiqmaydi.
     - Haftalik chegara: shu haftada (dushanbadan yakshanbagacha) ilovaning ikkita eslatmasi bo'lsa — 4-darsdagi o'yin eslatmasi ham sanaladi — bu eslatma qo'yilmaydi.
     - Mahsulotingizda foydalanuvchining vaqti ma'lum ishi bo'lsa (masalan, topshirish muddati) — eslatmani shunga bog'lash mumkin; bo'lmasa — Mentor misolidagidek: bir necha kun ochilmaganda, taklif shaklida.
     - Web-trekda: sayt yopiq bo'lsa, xabar kelmaydi — brauzer eslatmasi alohida sozlashni talab qiladi. Bugun sahifa ochilganda «Xabarlar» tasmasi tepasida «Siz yo'q paytingizda: …» qatori quriladi.
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Vazifa: Ilova o'zi oldindan bitta eslatma qo'yadi — ilovani bir necha kun ochmagan foydalanuvchiga; u ilova bilgan narsani aytadi va hafta ikkitaga to'lgan bo'lsa qo'yilmaydi.
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: {qayerda}
       > Nima qilsin: {nima qilsin}
       > Nima buzilmasin: {nima buzilmasin}
       > Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `mobil/` — eslatmalar (4-darsda `expo-notifications` qo'shilgan joy) va ilova ochiladigan joy.
       > Nima qilsin: ilova har ochilganda oldingi uch kunlik eslatma bekor qilinsin va yangisi uch kundan keyin soat 17:00 ga qo'yilsin: sarlavha «Maydon Jamoa», matn «Hafta oxiriga o'yin bormi? E'lonlarni ko'ring». Faqat hisobga kirgan foydalanuvchiga qo'yilsin.
       > Haftalik chegara: o'sha haftada (dushanbadan yakshanbagacha) ilovaning ikkita eslatmasi bo'lsa — o'yin eslatmasi ham sanalsin — uch kunlik eslatma qo'yilmasin. O'yinga qo'shilgan yoki o'yindan chiqqandan keyin ham shuni qayta hisobla.
       > Qo'yilgan eslatmalarning vaqti telefonda saqlansin — hisob shundan olinsin.
       > Nima buzilmasin: 4-darsdagi o'yin eslatmasi va ruxsat so'rash avvalgidek; hisobdan chiqilganda bu eslatma ham bekor bo'lsin; brauzer ko'rinishida eslatma qo'yilmasin, u yerda ilova ishlayversin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
       - Web-trekda (mobil trek tanlanmagan bo'lsa): Web-trekda: «Qayerda» — sayt papkangizdagi «Xabarlar» tasmasi va o'yinlar sahifasi (Backend o'zgarmaydi); «Nima qilsin» — sayt o'zingizga tegishli o'yinlarning oxirgi ko'rsatilgan holatini (qo'shilganlar soni va sizning holatingiz) brauzerda saqlasin; keyingi ochilishda yangi javobni saqlangani bilan solishtirsin va tasma tepasida bitta qator ko'rsatsin: «Siz yo'q paytingizda: {N} ta o'yiningizda o'zgarish bo'ldi»; farq bo'lmasa — qator chiqmasin.
  3. **Ishga tushirish** — `git status` → `git add <fayl>` → `git commit -m "qaytaradigan eslatma"` → `git push`. Mobil trekda Expo Go'da tekshirasiz — rejalashtirilgan eslatma Expo Go'da ham ishlaydi.
     - Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi; Backend o'zgarmagan — Render kutilmaydi.
     - Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** (web-trekda — **Tekshirish**) — test holatida tekshirasiz:
     - (1) Agentga: «Test holati: uch kunlik eslatmani bir daqiqadan keyinga qo'y, haftalik chegarani vaqtincha o'chir. Qaysi qatorlarni o'zgartirganingni ayt.» Ilovani oching va yoping — bugun yopiq holatni tekshirasiz.
     - Bir daqiqadan keyin qulf ekranida eslatma chiqishi kerak. Chiqmasa — ruxsatni tekshiring: ruxsat bermagan bo'lsangiz — telefon sozlamalaridan yoqiladi.
     - (2) Ilovani ochib yoping va bir daqiqa o'tmasdan yana ochib yoping — eslatma bitta chiqishi kerak, ikkita emas: oldingisi bekor bo'ladi.
     - (3) Haftalik chegara bugun telefonda tekshirilmaydi — buning uchun bir hafta kerak. Agentdan qaysi qator buni tekshirishini so'rang va o'sha qatorni o'zingiz o'qing: bu — kodni o'qish, telefondagi tekshiruv emas.
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Yozgan fayllaringda haftalik chegarani tekshiradigan qatorni fayl nomi va qator raqami bilan ko'rsat.
       > Kodni o'zgartirma.
     - (4) Agentga: «Test holatini olib tashla: vaqt va haftalik chegara avvalgidek bo'lsin.» `git status` va `git diff` da test holatidan o'zgarish qolmaganini ko'ring; tekshiruvda tuzatilgan joy bo'lsa — `git add <fayl>` → commit → `git push`.
     - Web-trekda: saytingizni yoping; sherigingiz o'z akkauntidan (yoki agent) sizning o'yiningizda o'zgarish qilsin; saytni qayta oching — «Siz yo'q paytingizda» qatorida son bo'lishi kerak. Hech narsa o'zgarmagan bo'lsa — qator chiqmasligi kerak.
- O'ng — kutilgan natija · namuna: Maydon Jamoa (bir marta o'zi yuradi):
  - mobil: telefon, ustida yorliq «test holati: bir daqiqa» — qulf ekraniga eslatma tushadi: «Maydon Jamoa · Hafta oxiriga o'yin bormi? E'lonlarni ko'ring»
  - web-trekda: brauzer oynasi `….netlify.app` — «Xabarlar», ostida qator «Siz yo'q paytingizda: 2 ta o'yiningizda o'zgarish bo'ldi», tasmada «Shanba, 18:00 · Mahalla maydoni»
- Ostida (3-band bajarilguncha): Ulgurmasangiz: haftalik chegarani 3-amaliyotdan keyin qo'shing; test holatini olib tashlashni o'tkazib yubormang.
- Hammasi bajarilgach (trekka qarab):
  - mobil: Ilova yopiq paytda eslatma chiqdi; qayta ochilganda oldingisi bekor bo'ldi. · kulrang qator: Haftalik chegara — kodda bor, telefonda tekshirilmagan. · izoh: Eslatmani ilovaning o'zi qo'ygan: u faqat ilova oxirgi ochilganda bilgan narsani aytadi.
  - web-trekda: Sayt qayta ochilganda o'zgargan o'yinlaringiz soni ko'rindi. · izoh: Qator hozirgi holati oxirgi ko'rganingizdan farq qiladigan o'yinlarni sanaydi — oradagi har o'zgarishni emas.
- Tugmalar: Orqaga · Avval bajaring → Davom etish (3-band «Bajardim»idan keyin)

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Qaysi eslatma darsdagi *uch katakdan* o'tadi?
  - «Hamma o'ynayapti, faqat siz yo'qsiz!»
  - «Kecha beshta yangi o'yin e'lon qilindi»
  - ✔ «Ertaga o'yiningiz bor: Shanba, 18:00»
  - «Bugun ochmasangiz, o'yinsiz qolasiz»
- Javob izohlari:
  - To'g'ri: O'z o'yini, aniq vaqt — ilova buni oldindan biladi.
  - A: Bu gap uyaltiradi. O'yinchiga qanday foyda bor?
  - B: Yopiq ilova kechagi e'lonlarni qayerdan biladi?
  - D: Bu gap qo'rqitadi. Foyda qayerda?
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: C — <variant> · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Jonli darsda savol ustida: Jonli dars — bitta urinish, o'ylab bosing!
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 8 · Amaliyot 3 — sanoq va o'chirgich
- Eyebrow: Amaliyot 3 · o'lchov va nazorat
- Sarlavha: Eslatmadan ochilganlar sanalsin, *o'chirgich bo'lsin*.
- Mentor: Eslatma bosilib nechta qurilmada ilova ochilganini sanoq ko'rsatadi; «1 · Ochish»dan boshlang.
  - Bandlar orasida: Keyingi bo'lim — «N · <band>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Mentor ostida bitta qator: 8-darsdagi qadamlaringiz: **{nom son · …}** ({sana}; mashq bo'lsa — kulrang «mashq sonlari») · 8-darsdagi qadamlar saqlanmagan bo'lsa: 8-darsdagi sanoq sahifangizni oching.
- Bandlar:
  1. **Ochish** — sanoq sahifangizni oching (8-dars, kalit bilan): qadamlar qatorlari turibdi. Bugun ularning ostiga yangi qator qo'shiladi — eslatma bosilib ilova ochilgan qurilmalar soni.
     - Bu son eslatma bosilganini aytadi; eslatma bo'lmasa ham ochgan bo'larmidi — buni aytmaydi.
     - O'chirgich qayerda turishini o'ylang (Mentor misolida — «Hisobdan chiqish» yonida, nomi «Eslatmalar»; sozlama ekani ko'rinib tursin — chiqish tugmasiga o'xshamasin).
     - Web-trekda: sanoq yozuvi `xabardan-ochdi` — «Siz yo'q paytingizda» qatori bosilib o'yin ochilganda (sahifa ochilishining o'zi emas); o'chirgich nomi «Xabarlar».
  2. **Prompt** — uch qatorni o'zingiz yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Vazifa: Eslatma bosilib ilova ochilganda sanoq yozuvi qo'shiladi; foydalanuvchi eslatmalarni o'zi o'chira oladi.
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: {qayerda}
       > Nima qilsin: {nima qilsin}
       > Nima buzilmasin: {nima buzilmasin}
       > Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `mobil/` — ilova ochiladigan joy, eslatmalar va «Hisobdan chiqish» turgan joy; `backend/` — `POST /hodisalar` va `GET /hodisalar/sanoq`; `lending/sanoq.html`, `lending/maxfiylik.html`.
       > Nima qilsin: ilovaning istalgan eslatmasi (o'yin eslatmasi ham, uch kunlik ham) bosilib ilova ochilganda `hodisaYoz('eslatmadan-ochdi')` chaqirilsin — ilova fonda bo'lsa ham, butunlay yopiq bo'lsa ham; bitta bosishga bitta yozuv.
       > `POST /hodisalar` qabul qiladigan nomlarga `eslatmadan-ochdi` qo'shilsin. `GET /hodisalar/sanoq` javobiga va sanoq sahifasiga qadamlar ostida yangi qator: «eslatmadan ochdi» — turli qurilmalar soni.
       > «Hisobdan chiqish» yonida «Eslatmalar» o'chirgichi bo'lsin — sozlama ko'rinishida, chiqish tugmasidan ajralib tursin; sukutda yoqiq, tanlov telefonda saqlansin. O'chirilsa — rejalashtirilgan hamma eslatma bekor qilinsin va yangisi qo'yilmasin.
       > Yoqilsa — hozirgi ma'lumotdan kerakli eslatmalar qaytadan qo'yilsin: men qo'shilgan, hali boshlanmagan o'yinlar uchun o'yin eslatmasi (bir soatdan kam qolgan bo'lsa — yo'q) va uch kunlik eslatma; o'tib ketgan o'yin uchun qo'yilmasin.
       > Telefonda eslatmalarga ruxsat berilmagan bo'lsa, o'chirgich ostida qator chiqsin: «Telefon sozlamalarida eslatmalarga ruxsat berilmagan».
       > `lending/maxfiylik.html` dagi «qaysi ma'lumot» javobiga bitta gap qo'sh: «Ilova eslatmadan ochilgani ham qurilma ID bilan sanaladi.»
       > Nima buzilmasin: to'rt qadam sanog'i avvalgidek; sanoq sahifasi faqat kalit bilan ochilsin; sanoq yozuvida ism, login va token bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
       - Web-trekda (mobil trek tanlanmagan bo'lsa): Web-trekda: nom `xabardan-ochdi` — faqat «Siz yo'q paytingizda» qatori bosilib o'yin ochilganda; o'chirgich «Xabarlar» — o'chirilsa qator chiqmaydi, tanlov brauzerda saqlanadi; qolgani o'sha.
  3. **Ishga tushirish** — `git status` → `git add <fayl>` → `git commit -m "eslatma sanog'i va o'chirgich"` → `git push`. Backend o'zgardi — Render sahifangizda yangi deploy tugashini kuting (bir necha daqiqa cho'zilishi mumkin); kutayotganda agent yozgan fayldan o'chirgich eslatmalarni bekor qiladigan qatorni toping.
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Yozgan fayllaringda o'chirgich eslatmalarni bekor qiladigan qatorni fayl nomi va qator raqami bilan ko'rsat.
       > Kodni o'zgartirma.
     - Lending sahifalari ham o'zgardi — Netlify'dagi lending saytingiz yangilanganini 1-darsdagi yo'l bilan tekshiring.
     - Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — talabingizning har qatorini ko'ring:
     - (1) Agentga: «Test holati: uch kunlik eslatmani bir daqiqadan keyinga qo'y, haftalik chegarani vaqtincha o'chir.» Ilovani oching va butunlay yoping (oxirgi ilovalar ro'yxatidan ham). Eslatma chiqqach uni bosing — ilova ochilishi kerak.
     - Eslatma chiqmasa — ilovani yopmasdan telefonni qulflab, qayta urinib ko'ring va qaysi holatda ishlaganini yozib qo'ying.
     - (2) Sanoq sahifangizga qarang — «eslatmadan ochdi» qatorida 1 qurilma chiqishi kerak. Bitta ochilish ikki yozuv beradi: `ochdi` (har ochilishda) va `eslatmadan-ochdi` (eslatma orqali ochilgani) — bu xato emas.
     - Sanoq sahifasi hali yo'q bo'lsa — Neon SQL Editor'da: `SELECT COUNT(DISTINCT qurilma_id) FROM hodisalar WHERE nom = 'eslatmadan-ochdi';` → «Run».
     - (3) «Eslatmalar»ni o'chiring va ilovani yoping — bir daqiqadan keyin eslatma chiqmasligi kerak. Ilovani ochib, o'chirgichni yoqing va yana yoping — eslatma chiqishi kerak; bu safar uni bosmang, surib tashlang.
     - (4) Tekshiruv yozuvlarini haqiqiy sanoqdan chiqaring. Neon SQL Editor'da: `SELECT id, yaratilgan FROM hodisalar WHERE nom = 'eslatmadan-ochdi' ORDER BY yaratilgan;` → «Run» — har bosishingizga bitta qator bo'lishi kerak, ikkita emas.
     - Ro'yxatda faqat bugun o'zingiz bosgan vaqtdagi qatorlar bo'lishi kerak; boshqa qator bo'lsa — unga tegmang. Agentga: «`hodisalar` jadvalidan faqat shu `id` li tekshiruv yozuvlarini o'chir: {id lar}.» Sanoq sahifasida qator 0 ga qaytadi.
     - (5) Agentga: «Test holatini olib tashla: vaqt va haftalik chegara avvalgidek bo'lsin.» `git status` va `git diff` da test holatidan o'zgarish qolmaganini ko'ring; tekshiruvda tuzatilgan joy bo'lsa — `git add <fayl>` → commit → `git push`.
     - Web-trekda: «Siz yo'q paytingizda» qatorini bosing — sanoq sahifasida «xabardan ochdi» qatorida 1 qurilma chiqishi kerak; «Xabarlar»ni o'chirib, saytni qayta oching — qator chiqmasligi kerak; tekshiruv yozuvlarini xuddi shunday o'chiring (nom — `xabardan-ochdi`).
     - Oxirida (mobil trek): odamlardagi ilova uchun yangi o'rnatish fayli kerak — `eas build -p android --profile preview`. Navbatni kutmang: «Bajardim»ni bosing va davom eting.
     - Fayl dars oxirigacha tayyor bo'lsa — lendingdagi «Android: ilovani o'rnatish» havolasini almashtiring; bo'lmasa — keyingi dars boshida.
- O'ng — kutilgan natija · namuna: Maydon Jamoa (bir marta o'zi yuradi):
  - mobil: telefon (Expo Go) — qulf ekranidagi eslatma «Maydon Jamoa · Hafta oxiriga o'yin bormi? E'lonlarni ko'ring» bosiladi → «O'yinlar» (Ulangan · Shanba, 18:00 · Mahalla maydoni · 8 / 10), ostida sozlama: «Eslatmalar» o'chirgichi (yoqiq) · «Hisobdan chiqish»
  - sanoq sahifasi (brauzer oynasi `…/sanoq.html`): ochdi · ro'yxatdan o'tdi · qo'shildi · kelishini tasdiqladi; ostida yangi qator yashil yonadi: eslatmadan ochdi · 1 qurilma; yorliq: Mentorning o'z telefoni — tekshiruv; keyin o'chiriladi
  - web-trekda: brauzer oynasi — «Siz yo'q paytingizda: 2 ta o'yiningizda o'zgarish bo'ldi» qatori bosiladi, yonida «Xabarlar» o'chirgichi (yoqiq); sanoq sahifasida yangi qator: xabardan ochdi · 1 qurilma
- Ostida (3-band bajarilguncha): Ulgurmasangiz: sanoq qatori va o'chirgich birinchi; maxfiylik gapini dars oxirida, o'rnatish faylini keyingi dars boshida bajaring. Tekshiruv yozuvlarini o'chirishni o'tkazib yubormang.
- Hammasi bajarilgach: Eslatmadan ochilganlar sanaladi; foydalanuvchi eslatmalarni o'zi o'chira oladi.
  - mobil trekda izoh: APK o'zi yangilanmaydi: eski faylni o'rnatganlarda bugungi eslatma yangisini o'rnatgandan keyin paydo bo'ladi.
  - mobil trekda blok ostida ikki tugma (bittasi tanlanadi): Havola almashtirildi · Fayl navbatda
- Tugmalar: Orqaga · Avval bajaring → Davom etish (3-band «Bajardim»idan keyin)

## 9 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 10 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.
- Birinchi bosishgacha: Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon | Izoh |
|---|---|---|
| Qaytganlar foizi nima? | Bir davrda ochganlardan keyingi davrda ham ochganlari foizi | Inglizchasi: retention. 7-Modulda bot uchun sanagansiz |
| Mentor misolida qaytganlar foizi qancha chiqdi? | 46 qurilmadan 17 tasi yana ochdi — taxminan 37% | Shu 46 qurilmaning sanalgan soni; nega qaytmagani bundan bilinmaydi |
| Ilova ochiq bo'lsa, boshqa odamning o'zgarishi qanday ko'rinadi? | Son o'zi yangilanadi; foydali joyda jonli xabar chiqadi | Hodisa ulanish orqali keladi |
| Ilova yopiq bo'lsa, boshqa odamning o'zgarishi jonli xabar bo'lib ko'rinadimi? | Yo'q | Ilova ochilganda yangi sonni ro'yxatda ko'radi |
| «2 joy qoldi» xabari uchun yangi hodisa kerakmi? | Yo'q — ilova qayta so'ragan sondan o'zi hisoblaydi | Mentor misolida; o'yinga qo'shilmaganlarga chiqadi |
| Rejalashtirilgan eslatmani kim qo'yadi? | Ilovaning o'zi, oldindan | Shuning uchun u ilova bilgan narsani aytadi |
| Nega uch kunlik eslatma «yangi o'yin chiqdi» demaydi? | Yopiq ilova yangi e'lonni bilmaydi | Shuning uchun taklif qiladi: «Hafta oxiriga o'yin bormi?» |
| Bu kursda foydali eslatma qanday bo'ladi? | O'z ishiga tegishli, rost va bosimsiz | Hafta ikkitaga to'lsa, ilova o'zidan qo'shmaydi; o'chirgich bor |
| «Eslatmalar» o'chirilsa, nima bo'ladi? | Rejalashtirilgan eslatmalar bekor bo'ladi | Tanlov foydalanuvchida |
| Mentor misolida uch kunlik eslatma kimga chiqadi? | Ilovani uch kun ochmagan odamga | Har kuni ochadigan odamga umuman chiqmaydi |
| Mentor misolida `eslatmadan-ochdi` nimani sanaydi? | Eslatma bosilib ilova ochilgan qurilmalarni | Istalgan eslatma; eslatmasiz ham ocharmidi — buni aytmaydi |
| Ilova o'zgarsa, APK o'rnatganlarga yangi eslatma qanday yetadi? | Yangi o'rnatish fayli orqali | APK o'zi yangilanmaydi |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni
- Eyebrow: Yakun
- Yuqori yorliq: ✓ Uch blok bajarildi (faqat uchala blok bajarilganda) · N/2 to'g'ri
- Sarlavha (holatga qarab):
  - uchala blok bajarilgan (mobil trek): Eslatmangiz tekshirildi va endi sanaladi.
  - uchala blok bajarilgan (web-trek): «Siz yo'q paytingizda» qatori tayyor va sanaladi.
  - Amaliyot 1 va 2 bajarilgan: Ikki blok tayyor — sanoq va o'chirgich qoldi.
  - faqat Amaliyot 1 bajarilgan: Jonli xabar ishlaydi — yopiq paytdagi qism qoldi.
  - boshqa bloklar boshlangan, lekin tugamagan: Qaytarish ishi hali tugamagan — qolgan bloklarni tugating.
  - hech biri boshlanmagan: Qaytarish ishi hali yozilmagan — uch blokni bajaring.
- Mobil trekda, Amaliyot 3 da «Fayl navbatda» tanlangan bo'lsa: kulrang yorliq «O'rnatish fayli navbatda» · Fayl tayyor bo'lgach, lendingdagi havolani keyingi dars boshida almashtirasiz.
- CODE STRIKE arenasi (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Qaytganlar foizi — bir davrda ilovani ochganlardan keyingi davrda ham ochganlari foizi.
  - Jonli xabar ilova ochiq paytda chiqadi; yopiq ilovada u ko'rinmaydi.
  - Rejalashtirilgan eslatmani ilovaning o'zi qo'yadi — u faqat oldindan bilgan narsani aytadi.
  - Bu kursda eslatma o'z ishiga tegishli, rost va bosimsiz; hafta ikkitaga to'lsa, ilova o'zidan yangisini qo'shmaydi; o'chirgich foydalanuvchida.
  - Sanoq eslatma bosilib ilova ochilganini ko'rsatadi; eslatma bo'lmasa ham ochgan bo'larmidi — buni aytmaydi.
- Keyingi dars — **«50 foydalanuvchiga yetdingizmi?»**: Mentor tekshiruvi: metrika hisoboti va zaxira reja.
- Nishonlaringiz — N/4 (to'rtta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Nishonlar
- **Open Line** — Jonli xabar faqat ochiq ilovada chiqishini topdingiz (4-ekran, birinchi urinishda to'g'ri)
- **Fair Reminder** — Uch katakdan o'tadigan eslatmani tanladingiz (7-ekran, birinchi urinishda to'g'ri)
- **Reminder Set** — Ilova yopiq paytdagi eslatmani qurib, tekshirdingiz (6-ekran, oxirgi «Bajardim»; bonus)
- **Come Back** — Eslatmadan ochilishni sanab, o'chirgichni tekshirdingiz (8-ekran, oxirgi «Bajardim»; bonus)
- Nishon olinganda: nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 4-ekran (1-savol) — **Jonli xabar faqat ochiq ilovada ko'rinadi**
   - 1 · Ilova ochiq: hodisa keladi, jonli xabar chiqadi.
   - 2 · Ilova yopiq: jonli xabar ko'rinmaydi.
   - 3 · Ilova ochilganda — yangi sonni ro'yxatda ko'radi.
   - Sinfga savol: Yopiq ilovaning telefon ekraniga nima chiqa oladi?
2. 7-ekran (2-savol) — **Foydali eslatmaning uch katagi**
   - 1 · O'z ishiga tegishli, foydasi aniq.
   - 2 · Rost: ilova buni oldindan biladi.
   - 3 · Bosim, qo'rqitish, uyaltirish yo'q.
   - Sinfga savol: «Sizni sog'indik!» qaysi katakdan o'tmaydi?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Qayta ishlash · mustaqil rejimda: Keyingi → · Natijani ko'rish · jonli dars tugasa: «Jonli dars yakunlandi — testni o'zingiz davom ettiring:» · Mashq rejimida davom etish

1. Mentor misolida 46 qurilmadan 17 tasi yana ochdi. Bu nima?
   - ✔ Qaytganlar foizini beradigan son
   - Ro'yxatdan o'tgan odamlarning soni
   - Eslatmani bosib ochganlar soni
   - O'yinga qo'shilgan o'yinchilar soni
2. Web-trekda sayt yopiq. O'yinchiga xabar yetadimi?
   - Yetadi — brauzer xabarni o'zi ko'rsatadi
   - ✔ Yetmaydi — u qaytganda o'zgarishni ko'radi
   - Yetadi — Backend saytni o'zi ochib beradi
   - Yetmaydi — sayt xabarni umuman ko'rsatmaydi
3. «2 joy qoldi» uchun Mentor Backend'i qaysi hodisani yuboradi?
   - Yangi `joy-qoldi` degan hodisani
   - Joy sonining o'zini alohida hodisada
   - ✔ Odatdagi `oyin-ozgardi` hodisasini
   - Har soniyada yangilangan sonni
4. «2 joy qoldi» xabari Mentor misolida kimga chiqadi?
   - Shu o'yinga qo'shilgan hammaga
   - O'yinni e'lon qilgan tashkilotchiga
   - «Qo'shilaman»ni bosgan o'yinchiga
   - ✔ Shu o'yinga qo'shilmagan o'yinchiga
5. Rejalashtirilgan eslatmani kim qo'yadi?
   - ✔ Ilovaning o'zi — oldindan, telefonda
   - Backend — boshqa o'yinchi qo'shilganda
   - Tashkilotchi — o'yin e'lon qilganda
   - Telefon — har kuni ertalab o'zicha
6. Nega uch kunlik eslatma «Yangi o'yin chiqdi» demaydi?
   - Matn juda uzun bo'lib qoladi
   - ✔ Yopiq ilova yangi e'lonni bilmaydi
   - Yangi o'yinlar juda kam bo'ladi
   - Bunday matnni telefon ko'rsatmaydi
7. Mentor misolida shu hafta ikkita o'yin eslatmasi bor. Uch kunlik eslatma-chi?
   - Baribir qo'yiladi — uchinchi bo'lib
   - O'yin eslatmasining o'rniga qo'yiladi
   - ✔ Bu hafta u umuman qo'yilmaydi
   - Ikki marta qo'yiladi — har o'yinga
8. Foydalanuvchi «Eslatmalar»ni o'chirsa, nima bo'ladi?
   - Ilova telefondan ruxsatni qayta so'raydi
   - Faqat ertangi kungi eslatma o'z joyida qoladi
   - Ilova hisobdan o'zi chiqib, yopiladi
   - ✔ Rejalashtirilgan eslatmalar bekor bo'ladi
9. Test holati nima uchun kerak?
   - ✔ Eslatmani bir daqiqada ko'rib tekshirish uchun
   - Eslatmani foydalanuvchilarga tezroq yuborish uchun
   - Haftalik chegarani butunlay olib tashlash uchun
   - Ruxsat so'raydigan oynani o'chirib qo'yish uchun
10. Mentor misolida `eslatmadan-ochdi` qachon yoziladi?
    - Eslatma telefon ekraniga chiqqanda
    - ✔ Eslatma bosilib ilova ochilganda
    - Ilova eslatmani rejalashtirganda
    - Eslatma o'yindan oldin bekor bo'lganda
11. Sinfda eslatmani o'zingiz bosib tekshirdingiz. Bu yozuv nima bo'ladi?
    - Haqiqiy foydalanuvchi bo'lib sanaladi
    - Tekshiruv bo'lgani uchun yozilmaydi
    - ✔ Tekshirgach, sanoqdan o'chiriladi
    - Ikki qurilma bo'lib sanoqda qoladi
12. Ilova o'zgardi. Eski APK o'rnatganlarda bugungi eslatma bormi?
    - Bor — APK o'zi yangilanib qoladi
    - Yo'q — eslatma faqat iPhone'da ishlaydi
    - Bor — Render yangi versiyani yuboradi
    - ✔ Yo'q — yangi faylni o'rnatishlari kerak

## Kartochkalar
10-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 11-ekrandagi 5 qator.
- Keyingi dars — «50 foydalanuvchiga yetdingizmi?».
