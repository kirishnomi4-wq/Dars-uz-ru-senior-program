# 3-dars «Ekran o'zi yangilanishi uchun nimani yozasiz?» — yakuniy matn

Fayl: `src/10-Modull/PmRealtimeSpecLesson.jsx` · 12 ekran · Keyingi dars: «Loyiha kuni: jonli xabar va eslatma»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — «Talab va telefon»: chapda telefon (ramkada «Maydon Jamoa» nomi o'z rangida; holat qatorida samolyot belgisi — uchish rejimi; pastda bosh ekran chizig'i) va yonida Backend tuguni («Backend» · «Database: 8»), ular orasida chiziq; o'ngda talab varag'i «Mentor talabi · Maydon Jamoa» (Qayerda · Nima qilsin · Nima buzilmasin). Konvertlar: «so'rov», «javob» va hodisa `oyin-ozgardi`.
Telefon ekranlari: **O'yinlar** — sarlavha «O'yinlar», yonida ulanish belgisi («Ulangan» · «Ulanmoqda…» · «Ulanmagan»), kun «Shanba», karta «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10». **O'yin** — «‹ O'yinlar», «Shanba, 18:00», «Mahalla maydoni», «8 / 10», 10 joy doiralari, «Qo'shilaman» (bosilgach — «Qo'shildingiz»). Bosh ekran — «Maydon Jamoa» belgisi.

Mentor talabi (dars bo'yi bir xil):
- **Qayerda:** `backend/` — 2-darsdagi gateway va o'yin o'zgaradigan besh yo'l; `mobil/` — ulanish fayli, «O'yinlar» va «O'yin» ekranlari.
- **Nima qilsin:**
  - 1 · Hodisalar (har qator: Kim nima qiladi · Hodisa · Kim oladi · Ekranda nima o'zgaradi):
    - o'yinchi «Qo'shilaman» ni bosadi · `oyin-ozgardi` · sabab `qoshildi` · hamma ulangan ilova · «8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi
    - o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa) · sabab `chiqdi` · hamma ulangan ilova · son va ro'yxat yangilanadi
    - o'yinchi «Kelaman» ni bosadi · sabab `tasdiqladi` · hamma ulangan ilova · «Kelishini tasdiqladi: 7 / 9» → «8 / 9»
    - o'yinchi navbatga yoziladi · sabab `navbatga-yozildi` · hamma ulangan ilova · «Navbatda: 1»
    - tashkilotchi o'yin e'lon qiladi · sabab `elon-berildi` · hamma ulangan ilova · ro'yxatda yangi karta
  - 2 · Ulanish holatlari:
    - Ulangan — belgi «Ulangan», o'zgarishlar o'zi ko'rinadi.
    - Ulanmoqda — belgi «Ulanmoqda…», ro'yxat ekranda qoladi (eskirgan bo'lishi mumkin).
    - Ulanmagan — belgi «Ulanmagan», pastga tortib yangilash ishlaydi.
  - 3 · Kam uchraydigan vaziyatlar → 4-ekrandan keyin «Chekka holatlar»:
    - Internet uzilib qaytsa — ro'yxat yangi holatni ko'rsatsin.
    - Bitta o'zgarish ekranni bir marta yangilasin — ulanish qayta tiklangandan keyin ham.
    - Ilova boshqa ekranda yoki fonda turganda o'zgarish bo'lsa — «O'yinlar»ga qaytganda yangi holat ko'rinsin.
- **Nima buzilmasin:** Kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin.

## 0 · Kirish
- Eyebrow: Kirish
- Sarlavha: Ekran o'zi yangilanishi uchun *nimani yozasiz?*
- Mentor: 2-darsda ilovangiz Backend'ga ulandi, sxemangiz ham tayyor — agentga nima yozishingizni tanlang.
- Maket: ikki telefonli sahna — «1-telefon · siz» va «2-telefon · boshqa o'yinchi», ikkalasida O'yin ekrani («Shanba, 18:00» · «Mahalla maydoni» · «8 / 10»); o'rtada Backend («Database: 8»), 1-telefon bilan ochiq chiziq.
- Sahna ostida quti «Agentga talab» — miltillovchi kursor; tanlangan gap qutiga harfma-harf yoziladi, ostida uchta «?» uya.
- Variantlar (ballsiz):
  - «Ro'yxat o'zi yangilansin» degan bitta gapni
  - Sxemadagi har hodisani alohida qator qilib
  - Hodisalarni va ulanish uzilgandagi ekranni
- Javob izohlari:
  - «Hodisalarni va ulanish uzilgandagi ekranni» tanlansa: **Aynan!** Hodisalar va uzilishdagi ekran — talabning ikki bo'limi. Yana bitta bo'lim bor, uni ham ochasiz.
  - «Sxemadagi har hodisani alohida qator qilib» tanlansa: **Qiziq fikr!** Hodisalar — talabning bir qismi. Ulanish uzilganda ekranda nima turishini ham agent bilishi kerak.
  - «Ro'yxat o'zi yangilansin» degan bitta gapni» tanlansa: **Qiziq fikr!** Bitta gapda qaysi o'zgarish va qaysi ekran ekani yozilmagan — bu agentning tanloviga qoladi.
- Tugma: Bittasini tanlang → Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun agentga talab yozasiz va *natijani tekshirasiz.*
- Mentor: 2-darsdagi sxemangiz bugun talabga aylanadi. Kodni agent yozadi, qaror va tekshiruv — sizdan.
- Chap — kulrang yorliq: real vaqt talabi: hodisalar, ulanish holatlari, chekka holatlar
  - vizual bir marta o'zi yuradi: talab varag'ida «Nima qilsin» ostida uch bo'sh bo'lim uyasi (1 · 2 · 3) birma-bir chiqadi → telefonda («O'yinlar», belgi «Ulangan») «8 / 10» → «9 / 10»
- Reja:
  1. Mentor talabini bo'lim-bo'lim ko'rasiz · talab
  2. Kam uchraydigan vaziyatlarni ko'rasiz · chekka holatlar
  3. O'z mahsulotingiz uchun talab yozasiz · real vaqt talabi
  4. Agent quradi, siz telefonda tekshirasiz · tekshirish
- Pastki qator: repo `maydon-jamoa` · boshlang'ich holat `m12-dars-03-start` · namuna `m12-dars-03-done` — amaliyotlarni o'z mahsulotingizda bajarasiz.
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Mentor talabi
- Eyebrow: Tushuncha · talab
- Sarlavha: Mentor talabida real vaqt uchun *nima yozilgan?*
- Mentor (bosqichga qarab):
  - javob belgilanmaguncha: Avval javobingizni belgilang, keyin Mentor talabini bo'lim-bo'lim oching.
  - 1 va 2-bo'lim oldidan: Varaqdagi «Keyingi bo'lim»ni bosing — telefon shu bo'limni ko'rsatadi.
  - 3-bo'lim oldidan: Oxirgi bo'limni oching — uning qatorlari hozircha bo'sh.
  - uch bo'lim ochilgach: 11-Modulda PRD yozgansiz — u nima qurilishini aytadi; real vaqt talabi esa o'zgarish qanday ko'rinishini.
- Bashorat (yorliq «Avval o'zingiz belgilab ko'ring», ballsiz): Agentga faqat «ro'yxat o'zi yangilansin» deb yozilsa, nechta narsa uning tanloviga qoladi? · Hech narsa · Bir-ikkitasi · Ko'p narsa
  - tanlangach ixcham qator: savol · Taxminingiz: <tanlov>
- Vizual: chapda telefon «O'yinlar» (belgi «Ulangan», karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10») va Backend («Database: 8»); o'ngda talab varag'i «Mentor talabi · Maydon Jamoa» — boshida kulrang: Qayerda (Mentor talabidagi qator) · Nima qilsin: uch bo'sh uya (1 · 2 · 3) · Nima buzilmasin (Mentor talabidagi qator). Varaq ostida tugma «Keyingi bo'lim N/3».
- Har bosish:
  1. Backend'da «Database: 9» → konvert `oyin-ozgardi · qoshildi` telefonga uchadi → telefondan «so'rov» borib, «javob» qaytadi → kartada «9 / 10». Varaqda **1 · Hodisalar**: o'yinchi «Qo'shilaman» ni bosadi · `oyin-ozgardi` · sabab `qoshildi` · hamma ulangan ilova · «8 / 10» → «9 / 10» — ostida kulrang: + yana 4 qator — 2-darsdagi sxemadan
  2. Belgi ketma-ket: «Ulangan» → «Ulanmoqda…» (chiziq uzilgan) → «Ulanmagan» (chiziq yo'q, telefonda «↓») → yana «Ulangan»; har almashganda varaqda **2 · Ulanish holatlari** ning mos qatori yonadi (uch qator — Mentor talabidagidek).
  3. **3 · Kam uchraydigan vaziyatlar** — sarlavha va uchta bo'sh qator.
- Nom qatori (uch bo'lim ochilgach): Talabning real vaqt funksiyasi uchun uch bo'limi — **real vaqt talabi**.
- Xulosa:
  - «Ko'p narsa» tanlangan bo'lsa: Taxminingiz to'g'ri chiqdi ✓; boshqasi: Taxminingiz ✕ — aslida: Mentor talabida ko'p narsa yozilgan — yozilmasa, ular agentning tanloviga qolardi
  - Bu darsda real vaqt talabi uch bo'limdan iborat va «Nima qilsin» qatorini aniq qiladi.
- Tugadi: varaq butun enga (to'liq: Qayerda · Nima qilsin, uch bo'lim · Nima buzilmasin).
- Tugma: Avval belgilang → Keyingi bo'lim (N/3) → Davom etish

## 3 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol ustida kichik varaq «Mentor talabi · Maydon Jamoa» — Nima qilsin: 1 · Hodisalar; jadval: Kim nima qiladi · Hodisa · Kim oladi · Ekranda nima o'zgaradi — o'yinchi «Qo'shilaman» ni bosadi · `oyin-ozgardi` · sabab `qoshildi` · hamma ulangan ilova · «8 / 10» → «9 / 10»
- Savol: Talabda faqat Hodisalar bo'limi yozilgan. Bu talab *nimani aytmaydi?*
  - Hodisa qachon yuborilishini
  - Hodisani qaysi ilovalar olishini
  - Ulanish bor paytdagi o'zgarishni
  - ✔ Ulanish yo'q paytdagi ekranni
- To'g'ri izohi: Ulanish yo'q paytdagi ekranni Hodisalar bo'limi aytmaydi.
- Xato izohlari:
  - «Hodisa qachon yuborilishini»: Hodisalar qatorining birinchi katagiga qarang.
  - «Hodisani qaysi ilovalar olishini»: Qatordagi «Kim oladi» katagi nimani aytadi?
  - «Ulanish bor paytdagi o'zgarishni»: Bu qatorning oxirgi katagida yozilgan.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 4 · Kam uchraydigan vaziyatlar
- Eyebrow: Tushuncha · vaziyat
- Sarlavha: Ekran qachon kutilganidek *yangilanmaydi?*
- Mentor (bosqichga qarab):
  - javob belgilanmaguncha: Avval javobingizni belgilang, keyin uch vaziyatni birma-bir ko'ring.
  - 1-vaziyat: Birinchi telefonda uchish rejimini yoqing — shu payt boshqa o'yinchi qo'shiladi.
  - 2-vaziyat: Ulanish qayta tiklangan — ikkinchi telefonda «Qo'shilaman» ni bosing.
  - 3-vaziyat: Birinchi telefonda ilovani fonga olib keting — pastdagi bosh ekran chizig'ini bosing.
  - uch vaziyatdan keyin: Talab har vaziyatda nima bo'lishi kerakligini aytadi — qanday qilish agentning tanloviga qoladi.
- Bashorat (ballsiz): Internet bir necha soniyaga uzilib qaytdi. Shu payt bo'lgan qo'shilish birinchi telefonda qachon ko'rinadi? · O'sha zahoti · Ulanish qaytganda · Pastga tortganda
- Vizual: sahna tepasida kulrang yorliq «Vaziyat N/3 · shunday bo'lishi mumkin»; ikki telefonli sahna — 1-telefon «O'yinlar» (belgi «Ulangan», «8 / 10»), o'rtada Backend («Database: 8»), 2-telefon «O'yin» («Qo'shilaman»); o'ngda varaq «Mentor talabi · Maydon Jamoa» — «3 · Kam uchraydigan vaziyatlar», uchta bo'sh qator.
- Vaziyatlar:
  1. Samolyot (1-telefon) → belgi «Ulanmoqda…», chiziq uzilgan; 2-telefonda qo'shilish → «Database: 9», 2-telefonda «9 / 10»; konvert `oyin-ozgardi` uzilgan joyda so'nadi — yorliq «kelmadi»; keyin uchish rejimi o'chadi, belgi «Ulangan»; 1-telefonda «8 / 10» va kulrang «eski». Varaqqa 1-qator: Internet uzilib qaytsa — ro'yxat yangi holatni ko'rsatsin.
  2. 1-telefon chizig'i bir lahza uzilib tiklanadi — yorliq «qayta tiklangan». «Qo'shilaman» (2-telefon) → «Qo'shildingiz», «9 / 10», «Database: 9»; bitta konvert `oyin-ozgardi` 1-telefonga keladi → ketma-ket ikki «so'rov» — «javob», «9 / 10» ikki marta yonadi; telefon ostida «so'rov: 2». Varaqqa 2-qator: Bitta o'zgarish ekranni bir marta yangilasin — ulanish qayta tiklangandan keyin ham.
  3. Bosh ekran chizig'i (1-telefon) → 1-telefon bosh ekranda; 2-telefonda qo'shilish → «Database: 9»; «Maydon Jamoa» belgisi halqada → bosilsa ilova ochiladi: «O'yinlar»da «8 / 10» va «eski». Varaqqa 3-qator: Ilova boshqa ekranda yoki fonda turganda o'zgarish bo'lsa — «O'yinlar»ga qaytganda yangi holat ko'rinsin.
- Nom qatori (uch vaziyatdan keyin; bo'lim sarlavhasi «Kam uchraydigan vaziyatlar» → «Chekka holatlar»): Kam uchraydigan, lekin bo'ladigan vaziyat — **chekka holat**: talabda unda nima bo'lishi yoziladi.
- Xulosa:
  - «Pastga tortganda» tanlangan bo'lsa: Taxminingiz to'g'ri chiqdi ✓; boshqasi: Taxminingiz ✕ — bu misolda: pastga tortganda — talabda bu vaziyat hali yozilmagan edi
  - Bu misolda uchta chekka holat yozildi: har qatorda vaziyat va unda nima bo'lishi kerakligi bor.
  - Talabga yozilgan chekka holat — agentga topshiriq, bajarilgan ish emas.
- Tugadi: «Chekka holatlar» bo'limi uch qatori bilan butun enga.
- Tugma: Avval belgilang → Vaziyatni ko'ring (N/3) → Davom etish

## 5 · O'z talabingiz
- Eyebrow: Mustaqil ish
- Sarlavha: Mahsulotingiz uchun *real vaqt talabini* yozing.
- Mentor: Bo'limlarni birma-bir to'ldiring — hodisalar 2-darsdagi sxemangizdan olindi.
  - 2-darsdagi sxema saqlanmagan bo'lsa: Bo'limlarni birma-bir to'ldiring — sxemangiz saqlanmagan, hodisa qatorlarini o'zingiz yozasiz.
- Tepada ixcham chiziq: 1 · Hodisalar · 2 · Ulanish holatlari · 3 · Chekka holatlar (tayyor bo'limda — «· N qator»; bosilsa, bo'lim qayta ochiladi). Bir vaqtda bitta karta: «N · <bo'lim> · N / 3».
- **Karta 1 · Hodisalar** — Bugun qaysi qatorlarni qurasiz? Belgilang.
  - 2-darsdagi sxema qatorlari (har biri: nuqta · hodisa · ekranda), har birida belgilash katagi; sukutda hammasi belgilangan.
  - sxema yo'q bo'lsa: to'rt maydon — Kim nima qiladi · Hodisa nomi va sababi · Kim oladi · Ekranda nima o'zgaradi; tugmalar: Qator tayyor · Bekor qilish · Qator qo'shish (ko'pi bilan beshta qator) · Yordam
- **Karta 2 · Ulanish holatlari** — Har holatda foydalanuvchi nimani ko'radi? Uch maydon, yonida belgi: «Ulangan» · «Ulanmoqda…» · «Ulanmagan»; ichida kulrang: Belgi va ekranda nima turadi?
- **Karta 3 · Chekka holatlar** — Vaziyatni va unda nima bo'lishini yozing. Ikki maydon (kulrang: Vaziyat — nima bo'lsin), «Yana qator» bilan uchinchisi.
- Tugmalar: Keyingi bo'lim (3-kartada — Saqlash) · Yordam
- Tekshiruv yozuvlari:
  - Kamida bitta hodisa qatorini belgilang.
  - Bu holatda foydalanuvchi nimani ko'rishini yozing.
  - Kamida ikkita chekka holat yozing.
  - Vaziyatdan keyin unda nima bo'lishini yozing. — ostida: Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam (bosilsa ochiladi): **Mentor talabidan** — Mentor talabidagi uch holat qatori va uch chekka holat qatori (qo'shtirnoqda).
  - Mentor misolidagi uch vaziyat — internet uzilib qaytishi, ulanish qayta tiklanishi, ilova fonda turishi — ulanishi bor ilovada bo'lishi mumkin: sizning ilovangizda har birida nima bo'lishi kerak?
  - Web-trekda: «fonda» o'rniga — sayt brauzerning boshqa oynasida turganda; «pastga tortib yangilash» o'rniga — «Yangilash» tugmasi.
- «Saqlash»dan keyin — o'quvchining varag'i «Mening talabim»:
  - Qayerda: Backend — 2-darsdagi gateway va ma'lumot o'zgaradigan yo'llar; ilova — ulanish fayli va shu ma'lumotni ko'rsatadigan ekranlar.
  - Nima qilsin: 1 · Hodisalar (N qator) · 2 · Ulanish holatlari (belgi va o'quvchi yozgani) · 3 · Chekka holatlar; har bo'lim yonida ✎
  - Nima buzilmasin: kulrang «Amaliyot 2 da yozasiz»
  - Xulosa: Real vaqt talabingiz saqlandi: hodisalar, ulanish holatlari va chekka holatlar bilan.
- Tugma: Bo'limlarni to'ldiring (N/3) → Davom etish

## 6 · Amaliyot 1 — hodisalar
- Eyebrow: Amaliyot 1 · hodisalar
- Sarlavha: Ro'yxat pastga tortmasdan *o'zi yangilansin.*
- Mentor: Talab tayyor — Hodisalar qatorlari talabingizdan olindi, o'qib chiqing; «1 · Ochish»dan boshlang.
  - bo'laklar orasida: Keyingi bo'lak — «N · <bo'lak>»: bajarib, «Bajardim»ni bosing.
  - blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Trek tanlanmagan bo'lsa (blok tepasida): Trekingiz: · Mobil trek · Web-trek
- Bo'laklar (har birida «Bajardim»):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: o'zgargan fayl yo'q, `.env` ro'yxatda ko'rinmaydi (ko'rinsa, agentga: «`.env` fayllarini `.gitignore` ga qo'sh.»).
     - Ilovangizni telefonda oching: belgi «Ulangan» bo'lishi kerak. Belgi yo'q bo'lsa — 2-darsdagi ulanish hali qurilmagan: avval o'sha darsning birinchi amaliyotini tugating.
  2. **Prompt** — «Hodisalar» qatorlarini o'qib chiqing (tahrirlasa bo'ladi), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · ✎ · Nusxalash, bosilgach — ✓ Nusxalandi):
       > Qayerda: Backend — 2-darsdagi gateway va ma'lumot o'zgaradigan yo'llar; ilova — ulanish fayli va shu ma'lumotni ko'rsatadigan ekranlar.
       > Nima qilsin: shu hodisalarni qur (har qator: kim nima qiladi | hodisa | kim oladi | ekranda nima o'zgaradi):
       > {hodisalar}
       > Backend o'zgarishni Database'ga yozib tugatgandan keyin hodisani yuborsin; hodisada faqat o'zgargan yozuvning `id` si va sababi bo'lsin. Ilova hodisa kelganda shu qatorning «ekranda nima o'zgaradi» qismidagi ma'lumotni Backend'dan qayta so'rasin; bitta hodisa ochiq ekranni bir marta yangilasin.
       > Nima buzilmasin: avvalgi ekranlar va yo'llar avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - `{hodisalar}` o'rnida — 5-ekranda saqlangan hodisa qatorlari; saqlanmagan bo'lsa kulrang namuna: masalan: o'yinchi «Qo'shilaman» ni bosadi | oyin-ozgardi · sabab qoshildi | hamma ulangan ilova | «8 / 10» o'rniga «9 / 10»
     - Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt):
       > Qayerda: `backend/` — 2-darsdagi gateway va o'yin o'zgaradigan besh yo'l: `POST /oyinlar`, `POST /oyinlar/:id/qoshilish`, `POST /oyinlar/:id/tasdiq`, `POST /oyinlar/:id/chiqish`, `POST /oyinlar/:id/navbat`; `mobil/` — `src/ulanish.ts`, «O'yinlar» va «O'yin» ekranlari.
       > Nima qilsin: shu hodisalarni qur (har qator: kim nima qiladi | hodisa | kim oladi | ekranda nima o'zgaradi):
       > o'yinchi «Qo'shilaman» ni bosadi | oyin-ozgardi · sabab qoshildi | hamma ulangan ilova | «8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi
       > o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa) | oyin-ozgardi · sabab chiqdi | hamma ulangan ilova | son va ro'yxat yangilanadi
       > o'yinchi «Kelaman» ni bosadi | oyin-ozgardi · sabab tasdiqladi | hamma ulangan ilova | «Kelishini tasdiqladi: 7 / 9» → «8 / 9»
       > o'yinchi navbatga yoziladi | oyin-ozgardi · sabab navbatga-yozildi | hamma ulangan ilova | «Navbatda: 1»
       > tashkilotchi o'yin e'lon qiladi | oyin-ozgardi · sabab elon-berildi | hamma ulangan ilova | ro'yxatda yangi karta
       > Backend o'zgarishni Database'ga yozib tugatgandan keyin `oyin-ozgardi` ni yuborsin — faqat `{ oyinId, sabab }`. Ilova hodisa kelganda `GET /oyinlar` ni qayta so'rasin va ochiq ekranni yangilasin; bitta hodisadan keyin `GET /oyinlar` bir marta so'ralsin — «O'yinlar» va «O'yin» shu javobdan o'qisin.
       > Nima buzilmasin: Kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
       - kulrang: Web-trek: «Qayerda» — `prototip/` — `src/ulanish.js` va ma'lumot ko'rsatadigan sahifalar; «Nima buzilmasin» — «… «Yangilash» tugmasi qolsin».
  3. **Ishga tushirish** — `git status`: o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing → `git commit -m "real vaqt: hodisalar"` → `git push`.
     - Render Backend'ning yangi versiyasini chiqaradi — Render sahifasida tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Kutayotganda agent o'zgartirgan fayllardan ikki joyni toping: Backend hodisani yuboradigan qator va ilovadagi tinglovchi (`ulanish.on(…)`).
     - Xabar qutisi (Nusxalash):
       > O'zgartirgan fayllaringda ikki joyni fayl nomi va qator raqami bilan ko'rsat: Backend `oyin-ozgardi` hodisasini yuboradigan qator va ilovadagi tinglovchi `ulanish.on(…)`.
       > Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     - Yangi versiya chiqqanda ulanish uziladi: belgi bir lahza «Ulanmoqda…» bo'lib, odatda bir necha soniyada «Ulangan» ga qaytadi. Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`); web-trekda Netlify saytni odatda o'zi yangilaydi.
     - Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — agent nima desa ham, o'zingiz ko'ring. Avval belgi «Ulangan» ekanini ko'ring (Mentor misolida — «O'yinlar» tepasida), keyin o'zgarish ko'rinadigan ekranni oching (Mentor misolida — «O'yin», «Shanba, 18:00»); ekranga tegmang.
     - O'zgarishni boshqa akkaunt qiladi.
     - (web-trek) Web-trekda — o'zingiz: kompyuterda saytingizni yashirin oynada oching, 11-Modulda yaratgan ikkinchi namuna akkauntingiz bilan kiring, o'zgarishni qiling, keyin qaytaring — telefon brauzerida son «Yangilash»ni bosmasdan o'zgarishi kerak.
     - (mobil trek) Mobil trekda — agent (uch xabar):
       - (1) Agentga («Nusxalash»):
         > Tekshiruv uchun ilovaning ro'yxatdan o'tish yo'li bilan yangi akkaunt och — namuna ism va namuna raqam bilan, haqiqiy emas. Shu akkaunt nomidan Render'dagi Backend'ga so'rov yubor: {o'zgarish}. Akkaunt va yaratgan yozuvlaringning `id` larini ayt.
         - kulrang namuna: masalan: Shanba, 18:00 o'yiniga (`oyinId: 1`) qo'shilish.
         - Telefonga qarang: son pastga tortmasdan o'zgarishi kerak — odatda bir necha soniyada.
       - (2) Mahsulotingizda o'zgarishni qaytaradigan yo'l bo'lsa (Mentor misolida — o'yindan chiqish), agentga:
         > Endi o'sha akkaunt nomidan Render'dagi Backend'ga o'zgarishni qaytaradigan so'rovni yubor.
         - — son yana o'zi o'zgarishi kerak.
       - (3) Agentga:
         > Faqat hozir yaratgan tekshiruv akkauntini va yozuvlarini — aytgan `id` laring bo'yicha — o'chir.
     - Son o'zgarmasa — belgi turgan ekranga qaytib, belgiga qarang. «Ulangan» bo'lsa, agentga: «Tekshiruv so'rovidan keyin telefonda son o'zgarmadi: {nima ko'rdim}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
     - (mobil trek) Agent Render'ga so'rov yubora olmasa yoki juftlikda ishlasangiz: sinfdoshingiz telefonida ilovangizni oching (Android'dagi Expo Go), o'zingiz 11-Modulda yaratgan ikkinchi namuna akkaunt bilan kiring va o'zgarishni sinfdoshingiz qilsin, keyin qaytarsin. Expo akkauntingiz ma'lumotini bermang.
- O'ng tomon — kutilgan natija · namuna: Maydon Jamoa (bir marta o'zi yuradi):
  - telefon «Expo Go» — O'yin ekrani «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» → konvert `oyin-ozgardi` → «9 / 10» → konvert → «8 / 10»
  - Agent javobi: Akkaunt: tekshiruv akkaunti (namuna) · O'yin: `oyinId: 1` · akkaunt va yozuv `id` lari aytildi → Akkaunt va yozuvlar o'chirildi: aytilgan `id` lar
  - fayllar: `backend/` — gateway va besh yo'l · o'zgardi · `mobil/src/ulanish.ts` · o'zgardi · «O'yinlar», «O'yin» ekranlari · o'zgardi
- Hammasi bajarilgach: Ro'yxat pastga tortmasdan yangilandi — buni telefonda o'zingiz ko'rdingiz.
- Ulgurmasangiz: `git push` qilib, «3 · Ishga tushirish»gacha yeting va davom eting — telefonda tekshirish uyga qoladi, yakun nima qolganini aytadi.
- Ortda qoldingizmi — Mentor misolini alohida papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-03-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — qanday ishlashini ko'rasiz, o'z repo'ngizdagi bo'limni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · Amaliyot 2 — holatlar va README
- Eyebrow: Amaliyot 2 · holatlar va README
- Sarlavha: Ulanish holatlari ekranda, talab *README'da bo'lsin.*
- Mentor: Endi «Nima buzilmasin» qatorini o'zingiz yozasiz — qolgani talabingizdan olindi; «1 · Ochish»dan boshlang.
  - bo'laklar orasida: Keyingi bo'lak — «N · <bo'lak>»: bajarib, «Bajardim»ni bosing.
  - blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Trek tanlanmagan bo'lsa (blok tepasida): Trekingiz: · Mobil trek · Web-trek
- Bo'laklar (har birida «Bajardim»):
  1. **Ochish** — Amaliyot 1 `git push` qilingan, Render'da yangi versiya chiqqan. Ilovangizda belgi turgan ekranni oching. Pastdagi talabda ulanish holatlari va chekka holatlaringiz turibdi — o'qib chiqing.
  2. **Prompt** — «Nima buzilmasin» qatorini o'zingiz yozing: qaysi ishlar avvalgidek qolishi kerak (kulrang namunaga qarang), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Maydon: Nima buzilmasin
     - Prompt qutisi (Siz → Antigravity · ✎ · Nusxalash, bosilgach — ✓ Nusxalandi):
       > Qayerda: ulanish belgisi turgan ekran (2-darsda qo'yilgan); `README.md` — «Real vaqt» bo'limi.
       > Nima qilsin: ulanish holatlari — har holatda foydalanuvchi shuni ko'rsin:
       > Ulangan — {ulangan}
       > Ulanmoqda — {ulanmoqda}
       > Ulanmagan — {ulanmagan}
       > Chekka holatlar — har birida shunday bo'lsin:
       > {chekka holatlar}
       > `README.md` «Real vaqt» bo'limiga, jadvaldan keyin, ikki bo'lim qo'sh: «Ulanish holatlari» va «Chekka holatlar» — so'zlarimni o'zgartirma.
       > Nima buzilmasin: {nima buzilmasin} `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - `{ulangan}`, `{ulanmoqda}`, `{ulanmagan}`, `{chekka holatlar}` o'rnida — 5-ekranda yozilganlar (chekka holatlar raqamlangan: «1) …»); `{nima buzilmasin}` yonida kulrang namuna: masalan: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin.
     - Yordam (bosilsa ochiladi — Mentor misolidagi to'liq prompt):
       > Qayerda: `mobil/` — «O'yinlar» ekrani (`src/app/index.tsx`), ulanish belgisi shu yerda; `README.md` — «Real vaqt» bo'limi.
       > Nima qilsin: ulanish holatlari — har holatda foydalanuvchi shuni ko'rsin:
       > Ulangan — belgi «Ulangan», o'zgarishlar o'zi ko'rinadi.
       > Ulanmoqda — belgi «Ulanmoqda…», ro'yxat ekranda qoladi (eskirgan bo'lishi mumkin).
       > Ulanmagan — belgi «Ulanmagan», pastga tortib yangilash ishlaydi.
       > Chekka holatlar — har birida shunday bo'lsin:
       > 1) Internet uzilib qaytsa — ro'yxat yangi holatni ko'rsatsin.
       > 2) Bitta o'zgarish ekranni bir marta yangilasin — ulanish qayta tiklangandan keyin ham.
       > 3) Ilova boshqa ekranda yoki fonda turganda o'zgarish bo'lsa — «O'yinlar»ga qaytganda yangi holat ko'rinsin.
       > `README.md` «Real vaqt» bo'limiga, jadvaldan keyin, ikki bo'lim qo'sh: «Ulanish holatlari» va «Chekka holatlar» — so'zlarimni o'zgartirma.
       > Nima buzilmasin: Kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
       - kulrang: Web-trek: «Qayerda» — `prototip/` dagi belgi turgan sahifa; «Ulanmagan» qatorida va «Nima buzilmasin» da — «Yangilash» tugmasi ishlaydi.
  3. **Ishga tushirish** — `git diff` — o'zgarish agent aytgan fayllardami; keyin `git status` → har faylni `git add <fayl>` bilan → `git commit -m "real vaqt: ulanish holatlari, README"` → `git push`. Render'da yangi versiya chiqishini kuting (bir necha daqiqa cho'zilishi mumkin).
     - Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabingizdagi har holatni ko'ring:
     - (1) Belgi «Ulangan» — ekran talabingizdagidek bo'lishi kerak.
     - (2) Uchish rejimini yoqing: belgi «Ulanmoqda…» ga o'tishi kerak — darhol o'zgarmasligi mumkin: uzilishni aniqlash vaqt oladi (bir daqiqagacha). Ekranda talabingizda yozilgan narsa turishi kerak (Mentor misolida — ro'yxat joyida qoladi).
     - (3) Uchish rejimini o'chiring: belgi «Ulangan» ga qaytishi kerak, odatda bir necha soniyada. Pastga torting — ro'yxat yangilanishi kerak.
     - (4) «Ulanmagan» ni telefonda chaqirish qiyin. Agentga yozing:
       > Belgi qachon «Ulanmagan» bo'ladi va o'shanda ekranda nima turadi? Kodning qaysi fayli va qatori?
       - — javobni talabingizdagi qator bilan solishtiring. Bu — agentning so'zi va kod qatori: telefonda bu holatni ko'rmadingiz.
     - (5) GitHub'da `README.md` ni oching: «Real vaqt» bo'limida ikki yangi bo'lim bor, so'zlaringiz o'zgarmagan.
     - Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
     - kulrang: Agent chekka holatlarni «bajardim» desa — bu hali uning so'zi: bugun siz ulanish holatlarini va README'ni tekshirdingiz.
     - (web-trek) Web-trekda: saytingizni telefon brauzerida oching va uchish rejimini telefonda yoqing — kompyuterda Wi-Fi'ni o'chirish dars sahifasini ham uzadi; «Ulanmagan» qatorida — «Yangilash» tugmasi.
- O'ng tomon — kutilgan natija · namuna: Maydon Jamoa (bir marta o'zi yuradi):
  - telefon «Expo Go» — «O'yinlar»: belgi «Ulangan» → samolyot yoqilgan: «Ulanmoqda…», karta joyida → «Ulangan» → «↓», ro'yxat yangilandi
  - README ko'rinishi: `README.md` · **Real vaqt** (besh hodisa qatori: kim nima qiladi · oyin-ozgardi · sabab) · **Ulanish holatlari** (uch qator — Mentor talabidagidek) · **Chekka holatlar** (uch qator — Mentor talabidagidek)
- Hammasi bajarilgach: Ulanish holatlari talabingizdagidek; talab README'da — chekka holatlar bilan birga.
- Ulgurmasangiz: Prompt yuborilgan va `git push` qilingan bo'lsa — telefonda tekshirishni uyda qilasiz; yakun nima qolganini aytadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 8 · Yakuniy savol
- Eyebrow: Yakuniy savol
- Savol ustida kichik varaq «Mentor talabi · Maydon Jamoa»: 1 · Hodisalar · 2 · Ulanish holatlari · 3 · Chekka holatlar — 3 qator
- Savol: Agent «talabdagi hammasi tayyor» dedi. Bugungi tekshiruvda *nima ko'riladi?*
  - Internet uzilib qaytgach son yangilanganini
  - ✔ Tekshiruv so'rovidan keyin son o'zgarganini
  - Bitta o'zgarish bir marta yangilanganini
  - Ilova fondan qaytganda yangi son turganini
- To'g'ri izohi: Bu ko'rildi; chekka holatlar esa bugun tekshirilmadi.
- Xato izohlari:
  - «Internet uzilib qaytgach son yangilanganini»: Bu chekka holat — bugun u faqat talabga yozildi.
  - «Bitta o'zgarish bir marta yangilanganini»: Bu ham chekka holat. Bugun uni telefonda ko'rdingizmi?
  - «Ilova fondan qaytganda yangi son turganini»: Fondan qaytish — chekka holat: bugun faqat yozildi.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 9 · Natijalar (podium)
- Eyebrow: Natijalar
- Natijalar (podium) — jonli reyting
- Tugma: Davom etish

## 10 · Takrorlash
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring.*
- Birinchi bosishgacha: Kartani bosing — javob ochiladi
- 12 karta — «Kartochkalar» bo'limida.
- Tugmalar: ↻ O'rganilmoqda · ✓ Bildim · karta ag'darilgach: ✗ Takrorlash · ✓ Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni
- Eyebrow: Dars yakuni
- Yuqori yorliqlar: ✓ Dars tugadi · N/2 to'g'ri
- Sarlavha (holatga qarab):
  - ikkala amaliyot bajarilgan: Talab yozildi, tekshiruvda *ro'yxat o'zi yangilandi.*
  - faqat 1-amaliyot: Ro'yxat o'zi yangilandi — *holatlar bo'limi qoldi.*
  - faqat 2-amaliyot: Holatlar tayyor — *ro'yxatni tekshirish qoldi.*
  - talab saqlangan, amaliyotlar bajarilmagan: Talab tayyor — *agentga berib, tekshirish qoldi.*
  - talab saqlanmagan: Talab hali yozilmagan — *uyda yozib chiqing.*
- CODE STRIKE arenasi (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Hodisalar bo'limida kim nima qilganda qaysi hodisa kimga borishi va ekranda nima o'zgarishi yoziladi.
  - Ulanish holatlari bo'limida har holatda foydalanuvchi nimani ko'rishi yoziladi.
  - Chekka holat — kam uchraydigan, lekin bo'ladigan vaziyat; talabda unda nima bo'lishi yoziladi.
  - Talabda yozilmagan joy agentning tanloviga qoladi.
  - Agent yaratgan tekshiruv yozuvlari faqat u aytgan `id` lar bo'yicha o'chiriladi.
- Uyga vazifa (tugma «Amaliy topshiriqni bajarish →») — karta **Uyda nima qilasiz?**
  - Kim uchun: o'z mahsulotingiz · Muddat: keyingi darsgacha
  1. Darsda qolgan qismni tugating: Amaliyot 1 ni telefonda tekshiring · Amaliyot 2 ni bajaring. (faqat bajarilmagan amaliyot nomi; ikkalasi bajarilgan bo'lsa band yo'q)
  2. Uchish rejimini yana bir marta yoqib-o'chiring: belgi va ekran talabingizdagidek bo'ldimi? Farq bo'lsa — nima qildingiz va nima ko'rdingiz, bir qator yozib qo'ying.
  3. Talabingizda ikkita chekka holat bo'lsa — ilovangiz uchun uchinchisini o'ylab, darsdagi talabingizga va README'dagi «Chekka holatlar» bo'limiga qo'shing — bu talab: kod hali o'zgarmaydi. (talabda uchta chekka holat bo'lsa band yo'q)
  - Keyingi dars — **«Loyiha kuni: jonli xabar va eslatma»**
- Nishonlaringiz — N/4 (to'rtta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- **Gap Finder!** — Talab nimani aytmasligini birinchi urinishda topdingiz (3-ekran, birinchi urinishda to'g'ri)
- **Brief Writer!** — Mahsulotingiz uchun uch bo'limli real vaqt talabini yozdingiz (5-ekran, «Saqlash»)
- **Live List!** — Ro'yxat pastga tortmasdan yangilanganini telefonda ko'rdingiz (6-ekran, oxirgi «Bajardim»; bonus)
- **State Check!** — Ulanish holatlarini telefonda tekshirib, talabni README'ga yozdirdingiz (7-ekran, oxirgi «Bajardim»; bonus)
- Nishon olinganda: nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 3-ekran (1-savol) — **Talabning bo'limlari**
   - 1 · Hodisalar: kim nima qilganda qaysi hodisa kimga boradi, ekranda nima o'zgaradi.
   - 2 · Ulanish holatlari: har holatda foydalanuvchi nimani ko'radi.
   - 3 · Talabda yozilmagan joy agentning tanloviga qoladi.
   - Sinfga savol: Internet uzilganda ekranda nima turishini kim hal qiladi — siz yoki agent?
2. 8-ekran (yakuniy savol) — **Bugun nima tekshirildi**
   - 1 · Tekshiruv so'rovidan keyin son pastga tortmasdan o'zgardi.
   - 2 · Uchish rejimida belgi va ekran talabdagidek.
   - 3 · Chekka holatlar talabga yozildi — bugun tekshirilmadi.
   - Sinfga savol: Agent «hammasi tayyor» desa, nimaga ishonasiz: uning so'zigami yoki telefondagi songami?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Qayta ishlash · mustaqil rejimda: Keyingi → · Natijani ko'rish · jonli dars tugasa: «Jonli dars yakunlandi — testni o'zingiz davom ettiring:» · Mashq rejimida davom etish

1. Mentor misolida Backend hodisani qachon yuboradi?
   - ✔ Database'dagi o'zgarish tugagach
   - Database'dagi o'zgarishdan oldin
   - Ilova ochilib, so'rov kelganda
   - O'yinchi ro'yxatni tortganda
2. Mentor misolida «Ulanmoqda…» paytida ro'yxat nima bo'ladi?
   - Ekrandan o'chadi, bo'sh joy qoladi
   - ✔ Ekranda qoladi, eskirishi mumkin
   - O'zi har soniyada yangilanib turadi
   - O'rnida xato oynasi chiqib turadi
3. Belgi «Ulanmagan». Mentor misolida ro'yxatni qanday yangilaysiz?
   - Ilovani o'chirib qayta o'rnatasiz
   - Backend'ni qayta ishga tushirasiz
   - ✔ Ekranni pastga tortib yangilaysiz
   - Database'da sonni o'zgartirasiz
4. Qaysi biri chekka holat?
   - O'yinchi «Qo'shilaman» tugmasini bosdi
   - Tashkilotchi yangi o'yin e'lon qildi
   - O'yinchi o'yin kuni «Kelaman» ni bosdi
   - ✔ Qo'shilish paytida internet uzildi
5. Talabdagi chekka holat qatori nimani aytadi?
   - ✔ Vaziyatni va unda nima bo'lishini
   - Vaziyatni va uni kim yaratganini
   - Vaziyatni va qaysi faylda turishini
   - Vaziyatni va necha marta bo'lganini
6. Ulanish yo'q paytda o'yinchi qo'shildi. Bu misolda hodisa keyin keladimi?
   - Ha, ulanish qaytgach o'zi keladi
   - ✔ Yo'q, qayta ulanganda kelmaydi
   - Ha, Backend uni saqlab turadi
   - Yo'q, uni ikkinchi telefon oladi
7. Mentor misolida ilova fondan qaytganda nima ko'rinishi kerak?
   - Oxirgi ko'rilgan eski son
   - Bo'sh ro'yxat, kutish yozuvi
   - ✔ O'yinlarning yangi holati
   - Ulanish belgisi, ro'yxatsiz
8. Mobil trekda tekshiruv so'rovini kim yuboradi?
   - Notanish odam, o'z telefonidan
   - Tashkilotchi, o'z akkauntidan
   - Ilovaning o'zi, har daqiqada
   - ✔ Agent, tekshiruv akkauntidan
9. Tekshiruvdan keyin agent yaratgan yozuvlar qanday o'chiriladi?
   - ✔ Faqat agent aytgan id lar bo'yicha
   - Jadvaldagi hamma yozuvlar bilan birga
   - Ilova qayta ishga tushganda o'zi
   - Oxirgi o'nta yozuv bilan birdaniga
10. Real vaqt talabi PRD'dan farqli ravishda nimani aytadi?
    - Mahsulot aynan kim uchun qurilishini
    - ✔ O'zgarish ekranda qanday ko'rinishini
    - Bosh raqam qanday va qachon sanalishini
    - Mahsulot qaysi muammoni hal qilishini
11. Bitta qo'shilish ekranni ikki marta yangiladi. Talabning qaysi qismi bu haqda?
    - Hodisalar bo'limidagi qator
    - Ulanish holatlari qatori
    - ✔ Chekka holatlardagi qator
    - «Nima buzilmasin» qatori
12. Web-trekda belgi «Ulanmagan». Ro'yxat nima bilan yangilanadi?
    - Sahifani yopib qo'yish bilan
    - Agentga talab yozish bilan
    - Backend'ni o'chirish bilan
    - ✔ «Yangilash» tugmasi bilan

## Kartochkalar
10-ekrandagi jadval (12 ta karta).

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Real vaqt talabi nima? | Talabning real vaqt funksiyasi uchun uch bo'limi | Bu darsda: hodisalar, ulanish holatlari, chekka holatlar |
| Hodisalar bo'limining har qatorida nima bor? | Kim nima qiladi, qaysi hodisa, kim oladi, ekranda nima o'zgaradi | 2-darsdagi real vaqt oqimi sxemasidan |
| Ulanish holatlari bo'limida nima yoziladi? | Har holatda foydalanuvchi nimani ko'rishi | Uch holat: ulangan, ulanmoqda, ulanmagan |
| Chekka holat nima? | Kam uchraydigan, lekin bo'ladigan vaziyat | Talabda unda nima bo'lishi yoziladi |
| Talabda yozilmagan joy kimning tanloviga qoladi? | Agentning | Shuning uchun ulanish holatlari ham yoziladi |
| Mentor misolida «Ulanmoqda…» paytida ekranda nima turadi? | Ro'yxat ekranda qoladi | Eskirgan bo'lishi mumkin |
| Mentor misolida «Ulanmagan» bo'lsa, nima ishlaydi? | Pastga tortib yangilash | Web-trekda — «Yangilash» tugmasi |
| Mentor talabida internet uzilib qaytsa, nima bo'lishi kerak? | Ro'yxat yangi holatni ko'rsatishi kerak | Bu misolda uzilish paytidagi hodisa keyin kelmaydi |
| PRD va real vaqt talabining farqi nimada? | PRD nima qurilishini aytadi; real vaqt talabi — o'zgarish qanday ko'rinishini | Bu kursdagi bo'linish; PRD — 11-Modul 5-darsida |
| Agent «chekka holatlarni bajardim» desa, bu nima? | Hali agentning so'zi | Talabda yozilgani — bajarilgani emas |
| Bugun ro'yxat o'zi yangilanishi qanday tekshirildi? | Boshqa akkaunt o'zgarish qildi | Mobil trekda — agent, web-trekda — o'zingiz; son pastga tortmasdan o'zgardi |
| Agent yaratgan tekshiruv yozuvlari qanday o'chiriladi? | Faqat u aytgan `id` lar bo'yicha | Umumiy «hammasini o'chir» buyrug'i berilmaydi |

## Yakun
- Endi siz bilasiz — 11-ekrandagi 5 qator.
- Keyingi dars — «Loyiha kuni: jonli xabar va eslatma».
