# 1-dars «Mahsulotingizni bir sahifada qanday tanishtirasiz?» — yakuniy matn

Fayl: `src/10-Modull/PmLandingLesson.jsx` · 16 ekran · Keyingi dars: «WebSocket: ekran o'zi yangilanadigan ulanish»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — brauzer maketidagi lending (manzil qatori `maydon-jamoa-….netlify.app`): tepada kichik nom «Maydon Jamoa» (o'z rangida) · sarlavha · sarlavha osti · asosiy tugma · telefon maketi va yonida uch foyda · pastda «Qanday qo'shilaman» bo'limi.
Mentor lendingi: nom — Maydon Jamoa · sarlavha — Mahalla futboliga jamoani bir joyda yig'ing · sarlavha osti — O'yinni e'lon qiling — kim qo'shilgani va kim aniq kelishi ko'rinib turadi. · asosiy tugma — Qo'shilmoqchiman.
Uch foyda (katta yozuv, ostida funksiya qatori): Bir bosishda jamoadasiz — Har o'yin alohida kartada: «Qo'shilaman» ni bosasiz. · Nechta odam yig'ilganini so'rab o'tirmaysiz — Kartada ko'rinadi: 8 / 10. · Kim aniq kelishini o'yindan oldin bilasiz — O'yin kuni har kim «Kelaman» ni bosadi.
«Qanday qo'shilaman» bo'limi: Hozircha o'rnatish havolasi yo'q.
Telefon maketi: «Maydon Jamoa» · O'yinlar · Shanba · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · «Qo'shilaman» (4-ekranda O'yin ekrani: «‹ O'yinlar», «Shanba, 18:00», «Mahalla maydoni», «8 / 10»; o'yin kuni — «Kelaman»).

## 0 · Kirish
- Eyebrow: Kirish
- Sarlavha: Mahsulotingizni bir sahifada *qanday tanishtirasiz?*
- Mentor: Mahsulotni hali ko'rmagan odam shu sahifani ochdi: sizningcha, unga birinchi nima yetishmaydi?
- Maket (chap): brauzer oynasi — sahifada katta yozuv o'rnida faqat nom «Maydon Jamoa», ostida matnsiz tugma va telefon maketi (O'yinlar ekrani); sarlavha joyi bo'sh. Sahifa oldida odam silueti, pufagida «?».
- Variantlar (ballsiz):
  - Chiroyli rasm va yorqin ranglar
  - Kim uchun va nima foyda ekani
  - Hamma funksiyalarning ro'yxati
- Javob izohlari:
  - «Kim uchun va nima foyda ekani» tanlansa: **Aynan!** Sahifada hozir nom va telefon bor — bu kim uchun va nima foyda berishi yozilmagan.
  - «Chiroyli rasm va yorqin ranglar» tanlansa: **Qiziq fikr!** Rasm sahifani bezaydi, lekin undan bu kim uchun va nima foyda berishi bilinmaydi.
  - «Hamma funksiyalarning ro'yxati» tanlansa: **Qiziq fikr!** Funksiyalar ham yoziladi, lekin sahifada avval bu kim uchun ekani aytilishi kerak.
- Tanlangandan keyin sahifadagi bo'sh sarlavha qatori halqa bilan ajraladi (matn yozilmaydi).
- Tugma: Bittasini tanlang → Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun mahsulotingizni tanishtiradigan *sahifa yozasiz.*
- Mentor: 11-Modulda mahsulotingizni qurdingiz va sinadingiz. Bugungi matnni o'zingiz yozasiz, kodini esa agent yig'adi.
- Chap — yorliq: Dars oxirida: sarlavha, foyda va bitta tugma · kulrang teg `lending`
  - Vizual bir marta o'zi yoziladi: brauzer oynasida navbat bilan — Maydon Jamoa · sarlavha · tugma · telefon (Maydon Jamoa · 8 / 10) · yonida uch qator «foyda»; oxirida manzil qatorida qulf belgisi va `….netlify.app`
- Reja:
  1. Sahifaning birinchi qatorini yozishni bilib olasiz · sarlavha
  2. Funksiyani odamga beradigan foydaga aylantirasiz · foyda
  3. Instagram nimadan boshlanganini ko'rasiz · voqea
  4. Sahifani sherigingiz bilan sinab, internetga chiqarasiz · sinov
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Sarlavha
- Eyebrow: Tushuncha · sarlavha
- Sarlavha: Sahifaning birinchi qatoriga *nima yoziladi?*
- Mentor: Sarlavhaning so'zlari 11-Moduldagi PRD dan olinadi: o'ngdagi savollarni birma-bir bosing.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): Sarlavha yozilgach, «Maydon Jamoa» nomi qanday turadi?
  - Sahifadan olib tashlanadi
  - Tepada kichik bo'lib turadi
  - Eng katta yozuv bo'lib qoladi
  - Tanlangach ixcham qator: Sarlavha yozilgach, «Maydon Jamoa» nomi qanday turadi? · Taxminingiz: <tanlov>
- Chapda — brauzer maketi (0-ekrandagi qoralama: nom katta, sarlavha qatori bo'sh, tugma, telefon).
- O'ngda — karta «11-Moduldan · PRD» (teg: Mentor misoli):
  - **Muammo:** O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.
  - **Kim uchun:** Mahalladagi mini-futbol o'yinchilari: tashkilotchi — o'yinni e'lon qiladi, o'yinchi — o'yinga qo'shiladi.
  - **Yechim:** Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.
  - Karta ostida savol-tugmalar (faqat joriysi yoqilgan, halqada): Kim uchun? · Nima foyda? · Qanday qilib?
- Savollar tartib bilan bosiladi:
  1. Kim uchun? — PRD da «Mahalladagi mini-futbol o'yinchilari» ajraladi; nom kichrayib tepaga ko'chadi, sarlavha qatoriga «Mahalla futboliga» yoziladi; yorliq: kim uchun
  2. Nima foyda? — PRD da «jamoaga yetarli odam yig'ishda» ajraladi; sarlavha to'liq: Mahalla futboliga jamoani bir joyda yig'ing; yorliq: kim uchun · nima foyda
  3. Qanday qilib? — PRD da Yechim qatori ajraladi; sarlavha ostiga yoziladi: O'yinni e'lon qiling — kim qo'shilgani va kim aniq kelishi ko'rinib turadi.; yorliq: sarlavha osti
- Uchala savoldan keyin maket ostida yorliq «lending»: Mahsulotni bitta sahifada tanishtiradigan sayt — lending deyiladi.
- Ipucha (harakatsizlikda): O'ngdagi yoqilgan savolni bosing — sahifada nima o'zgarishini ko'ring.
- Xulosa (birinchi qatori — taxmin natijasi): Taxminingiz to'g'ri chiqdi ✓ yoki Taxminingiz ✕ — aslida: tepada kichik bo'lib turadi
  - Bizda sarlavha ikki savolga javob beradi: kim uchun va nima foyda. Nom esa tepada kichik turadi.
- Tugadi: savol-tugmalar yo'qoladi, PRD kartasi ixcham qatorga yig'iladi, brauzer maketi butun enga.
- Tugmalar: Orqaga · Savollarni bosing (N/3) → Davom etish

## 3 · 1-savol
- Eyebrow: Tekshiruv · sarlavha
- Savol: Sinf uy vazifalari sayti. Qaysi sarlavhada *kim uchun va foyda* bor?
  - «Vazifalar» — zamonaviy va qulay yangi sayt
  - ✔ Sinfdoshlar, uy vazifasini bir joyda ko'ring
  - Fanlar, jadval, fayllar va izohlar bo'limi
  - React va NestJS'da qurilgan tezkor yangi sayt
- Javob izohlari:
  - To'g'ri: Kim uchun — sinfdoshlar; foyda — vazifa bir joyda ko'rinadi.
  - A: Nom va sifat bor, lekin sayt kim uchun ekani yozilmagan.
  - C: Bu bo'limlar ro'yxati — odam nima olishi ko'rinmaydi.
  - D: Texnologiya quruvchiga muhim; odam undan nima oladi?
  - Umumiy: Ikki savolni bering: kim uchun? nima foyda?
- Javob topilgach (savol ostida kichik sahifa): sarlavha «Sinfdoshlar, uy vazifasini bir joyda ko'ring» — «Sinfdoshlar» ostida yorliq «kim uchun», «bir joyda ko'ring» ostida «nima foyda».
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: B — <variant> · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 4 · Funksiyadan foydaga
- Eyebrow: Tushuncha · foyda
- Sarlavha: Funksiya odamga *nima beradi?*
- Mentor: Telefonda ajralib turgan funksiyaga qarang va u odamga nima berishini o'ngdagi kartadan tanlang.
- Chip qatori (joriysi ajralgan, o'tgani ✓): 1 «Qo'shilaman» · 2 «8 / 10» · 3 «Kelaman» · 4 Eslatma
- Chapda — kattalashgan telefon «Maydon Jamoa» (O'yin ekrani: ‹ O'yinlar · Shanba, 18:00 · Mahalla maydoni · 8 / 10 · tugma «Qo'shilaman»; 3-kartada o'yin kuni — «Kelaman»). Joriy funksiya halqada. Telefon yonida yozilgan juftliklar ro'yxati: funksiya — ingichka chiziq — foyda.
- O'ngda — bitta karta (yorliq: funksiya):
  1. «Qo'shilaman» tugmasi
     - ✔ bir bosishda jamoadasiz
     - bosilsa ro'yxatga yozadi
     - Backend'ga so'rov yuboradi
  2. «8 / 10» soni
     - qo'shilganlar va kerakli odam soni yoziladi
     - ✔ nechta odam yig'ilganini so'rab o'tirmaysiz
     - son har qo'shilishda bittaga oshib boradi
  3. «Kelaman» belgisi
     - belgi faqat o'yin kuni ekranda paydo bo'ladi
     - bosilganda tasdiq Backend'ga yozib qo'yiladi
     - ✔ kim aniq kelishini o'yindan oldin bilasiz
  4. O'yindan oldin eslatma (yorliq: roadmap: keyinroq · ostida kulrang: ilovada hali yo'q)
     - Sahifaga yoziladi
     - ✔ Hozircha yozilmaydi
- Xato izohi: 1–3-kartada — Bu funksiya nima qilishi — odam nima olishi emas. · 4-kartada — Ilovada eslatma hali yo'q — telefonga qarang.
- Yordam (xatodan keyin): 1–3-kartada — Shu funksiya tufayli o'yinchi nimani qilmay qo'yadi yoki nimani biladi? · 4-kartada — Sahifani o'qigan odam ilovani ochganda shu narsani topadimi?
- To'g'ri tanlov: foyda kartadan telefon yonidagi ro'yxatga uchadi (masalan: «Qo'shilaman» tugmasi — bir bosishda jamoadasiz), chip ✓, keyingi karta kiradi.
- Birinchi juftlikdan keyin ro'yxat ustida yorliq «foyda»: Funksiya odamga nima berishi — foyda deyiladi.
- 4-karta: «Eslatma» chipi kulrang qutiga tushadi, yorliq: hali yo'q.
- To'rttala kartadan keyin: telefon brauzer maketidagi joyiga qaytadi, juftliklar sahifadagi uch foyda bo'lib joylashadi; «Eslatma» chipi sahifadan tashqarida kulrang qoladi (hali yo'q).
  - Mentor sahifasida har foyda katta yozilgan, ostida — uni beradigan funksiya.
- Xulosa: Bu misolda sahifaga funksiya nomi emas, uning foydasi yozildi — hali yo'q eslatma esa yozilmadi.
- Tugmalar: Orqaga · Funksiyalarni oching (N/4) → Davom etish

## 5 · 2-savol
- Eyebrow: Tekshiruv · funksiya va foyda
- Savol: To'garaklar sayti xaritani ko'rsatadi. Qaysi gap *foydani* aytadi?
  - Xarita manzillarni Database'dan oladi
  - Xarita telefon ekraniga moslashtirilgan
  - Tugma bilan xaritani kattalashtirasiz
  - ✔ Yaqin to'garakni xaritadan tez topasiz
- Javob izohlari:
  - To'g'ri: Bu gap odam nima olishini aytadi: yaqin to'garakni topadi.
  - A: Bu sayt qanday ishlashi — odam nima olishi emas.
  - B: Bu sayt qanday qurilgani; odam undan nima oladi?
  - C: Bu funksiyaning o'zi: kattalashtirish nima beradi?
  - Umumiy: Funksiya tufayli odam nimaga erishadi — shuni qidiring.
- Javob topilgach (savol ostida juftlik qatori): to'garaklar xaritasi — yaqin to'garakni tez topasiz
- Javob kartasi va tugmalar — 3-ekrandagidek (To'g'ri javob: D — <variant>).

## 6 · Asosiy tugma
- Eyebrow: Tushuncha · tugma
- Sarlavha: Tugma odamni *qayerga olib boradi?*
- Mentor: Ilovani o'rnatish havolasi hali yo'q, sahifada esa tugma bor: uni bosib ko'ring.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): «Qo'shilmoqchiman» bosilganda nima ochiladi?
  - Hech narsa ochilmaydi
  - Shu sahifadagi bo'lim
  - Boshqa sayt — ilova do'koni
  - Tanlangach ixcham qator: «Qo'shilmoqchiman» bosilganda nima ochiladi? · Taxminingiz: <tanlov>
- Chapda — brauzer maketi, to'liq Mentor lendingi; «Qo'shilmoqchiman» tugmasi halqada.
- O'ngda — kichik karta: Umami · tugma bosilishi: 0
- Tugma bosilgach:
  - sahifa pastga suriladi, «Qanday qo'shilaman» bo'limi ochiladi: Hozircha o'rnatish havolasi yo'q.
  - Umami soni 0 → 1, ostida `qoshilmoqchiman`
  - tugma ustida yorliq «asosiy tugma»: Sahifadagi odamni bitta harakatga chaqiradigan tugma — asosiy tugma. 2-Modulda buni CTA deb atagansiz.
  - Umami kartasi ostida trek tugmalari: Mobil trek · Web-trek (Web-trek halqada)
- «Web-trek» bosilsa: sahifa tepaga qaytadi, tugma yana halqada; bosilganda manzil qatori `….netlify.app` ga almashadi, kulrang qator: web-trekda tugma saytni ochadi. Umami soni bu yerda ham oshadi.
- Xulosa (birinchi qatori — taxmin natijasi): Taxminingiz to'g'ri chiqdi ✓ yoki Taxminingiz ✕ — aslida: shu sahifadagi bo'lim
  - Bizda lending uch bo'lakdan iborat: sarlavha, uchta foyda va bitta asosiy tugma. U bor narsaga olib boradi.
- Tugadi (web-trek ham bosilgach): trek tugmalari yo'qoladi; sahifa to'liq, tugma ustida yorliq, Umami kartasi ixcham.
- Tugmalar: Orqaga · Tugmani bosing → Davom etish

## 7 · Instagram
- Eyebrow: Biznes olamidan
- Sarlavha: Instagram *nimadan boshlangan?*
- Nuqtalar qatori: Instagram · N/3
- Brend tanishtiruvi (1/3 da): Instagram — rasm va video ulashiladigan ilova.
- 1/3 — Burbn
  - Mentor: Burbn — Instagram asoschilarining birinchi ilovasi. Unda qayerdaligini belgilash, rejalar va rasm bor edi: funksiya ko'p, lekin uni hech kim ishlatmagan.
  - Sahna: telefon, tepada nom «Burbn»; menyuda uch qator — Belgilash · Rejalar · Rasm
  - Bashorat (yorliq: Instagram · 1/3): Asoschilar funksiyalar bilan nima qilgan?
    - Yana funksiya qo'shgan
    - Hammasini qoldirgan
    - Ko'pini olib tashlagan
    - Tanlangach ixcham qator: Asoschilar funksiyalar bilan nima qilgan? · Taxminingiz: <tanlov>
- 2/3 — Yoqqani qoldi
  - Mentor: Asoschilar odamlarga yoqqanidan boshqa hammasini olib tashlagan. Qolgani — rasm, filtr va izohlar.
  - Sahna: «Belgilash» va «Rejalar» so'nib chiqib ketadi; «Rasm» kattalashib o'rtaga chiqadi, ostida filtr doiralari va izoh qatori.
- 3/3 — Instagram
  - Mentor: Instagram shunday tug'ilgan. 2010-yil oktabr — birinchi kuni 25 000 ta ro'yxatdan o'tish.
  - Sahna: nom «Burbn» → Instagram; yonida: 2010-yil oktabr · birinchi kuni: 25 000 ro'yxatdan o'tish (son sanab o'sadi); kulrang qator: Shu voqeaning soni — sizga maqsad emas.
- Xulosa (3/3 dan keyin; birinchi qatori — taxmin natijasi): Taxminingiz to'g'ri chiqdi ✓ yoki Taxminingiz ✕ — aslida: ko'pini olib tashlagan
  - Bu voqeada hamma funksiya oldinga chiqarilmagan. Lendingda ham — muhim foydalar va bitta tugma.
- Tugmalar: Orqaga · Voqea davomi (N/3) → Davom etish

## 8 · 3-savol
- Eyebrow: Tekshiruv · Instagram'dagidek
- Savol: Sahifaga hamma funksiyani yozmoqchisiz. Instagram voqeasi *nimani eslatadi?*
  - ✔ Odamlarga yoqqan bittasini oldinga chiqarishni
  - Funksiya ko'p bo'lsa, odam ham ko'p kelishini
  - Birinchi kunning o'zida juda ko'p odam kelishini
  - Rasm va filtr har bir mahsulotga kerakligini
- Javob izohlari:
  - To'g'ri: Bu voqeada ko'p funksiyadan odamlarga yoqqani qoldi.
  - B: Burbn'da funksiya ko'p edi — uni kim ishlatgan edi?
  - C: Bu shu voqeaning soni — sahifangizga qoida emas.
  - D: Bu Instagram'da qolgani; sizda odamlarga nima yoqdi?
  - Umumiy: Asoschilar ko'p funksiya bilan nima qilganini eslang.
- Javob topilgach (savol ostida kichik telefon): bitta «Rasm» kartasi.
- Javob kartasi va tugmalar — 3-ekrandagidek (To'g'ri javob: A — <variant>).

## 9 · Sahifa matni
- Eyebrow: Mustaqil ish · sahifa matni
- Sarlavha: Sahifangiz matnini *bo'lakma-bo'lak* yozing.
- Mentor: Muammo gapingiz va yechimingiz 11-Moduldan keldi — ularga qarab avval sarlavhani yozing.
  - 11-Modul ma'lumoti bo'lmasa: Avval muammo gapingiz va yechimingizni bir qatordan yozing, keyin sarlavhaga o'ting.
- Tepada — ixcham qator «11-Moduldan · PRD» (bosilsa ochiladi): Muammo: <muammo gapingiz> · Kim uchun: <…> · Yechim: <…> · Uchta asosiy funksiya: <…>
  - Ma'lumot bo'lmasa — ikki maydon: «Muammo gapi — kim nimadan qiynaladi?» · «Yechim — mahsulot nima qiladi?»
- Chapda — o'quvchi sahifasi brauzer maketida, yozilgani sari to'lib boradi; tepada yorliq: Sahifam · n / 4. Nom bo'lmasa — kulrang «mahsulot nomi».
- O'ngda — bitta karta (joriy bo'lak), belgi hisoblagichi bilan:
  - (nom bo'lmasa, birinchi) Mahsulot nomi · 40 belgigacha
  1. Sarlavha · 1 / 4 — Kim uchun va nima foyda? · «Bir qator, odamga qaratib» · 60 belgigacha
  2. Sarlavha osti · 2 / 4 — Bu qanday bo'ladi? · «Bir gap» · 110 belgigacha
  3. Uch foyda · 3 / 4 — bittadan: Foyda N / 3 — ikki maydon: «Foyda — odam nima oladi?» (50) · «Funksiya qatori — qaysi funksiya beradi?» (70); ostida kulrang: Faqat hozir ishlaydigan funksiyaning foydasi. Saqlanganlar tepada ixcham ✓ qator (foyda · funksiya qatori) — bosilsa qayta ochiladi.
  4. Asosiy tugma · 4 / 4 — Odam nima qiladi? · «Bir-uch so'z» · 24 belgigacha
  - Tugmalar: Yordam · Saqlash
- Yordam (bo'lakka qarab):
  - Sarlavha: Mentor misolida: «Mahalla futboliga jamoani bir joyda yig'ing» — odamga qaratib yozilgan.
  - Sarlavha osti: Mentor misolida: «O'yinni e'lon qiling — kim qo'shilgani va kim aniq kelishi ko'rinib turadi.»
  - Uch foyda: Mentor misolida: «Nechta odam yig'ilganini so'rab o'tirmaysiz», ostida «Kartada ko'rinadi: 8 / 10.» — avval odam nima oladi, keyin qaysi funksiya beradi.
  - Asosiy tugma: Mentor misolida: «Qo'shilmoqchiman» — odam o'z nomidan aytadigan bitta so'z.
- Tekshiruv izohlari (maydon ostida):
  - Bu bo'lak bo'sh — sahifada joyi ko'rinmay qoladi.
  - Bu nomga o'xshaydi: kim uchun va nima foyda?
  - Bu umumiy so'z — odam aynan nima oladi?
  - Hali yo'q narsa bo'lsa — sahifaga yozilmaydi.
  - Bu funksiya nomi — u odamga nima beradi?
  - Bu foyda yuqorida bor — boshqasini yozing.
  - Tugma yozuvi qisqa bo'lsin: bir-uch so'z.
  - Sahifaga telefon va akkaunt nomi yozilmaydi.
  - Yumshoq izohdan keyin kulrang qator: Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- «Saqlash» → matn sahifadagi o'z joyiga uchadi, hisoblagich n / 4 o'sadi, keyingi karta kiradi. To'rttala bo'lakdan keyin: to'liq sahifa, har bo'lak yonida ✎ (bosilsa o'sha bo'lak qayta ochiladi).
- Xulosa: Sahifangiz matni tayyor: sarlavha, uch foyda va bitta asosiy tugma.
- Tugmalar: Orqaga · Yana N ta bo'lak yozing → Davom etish

## 10 · Besh soniyalik sinov
- Eyebrow: Juftlikda ish (yakka rejimda: Mustaqil ish)
- Sarlavha: Sherigingiz 5 soniyada *nimani tushunadi?* (yakka rejimda: 5 soniyadan keyin sahifadan *nima esda qoladi?*)
- Mentor: Ekranni sherigingizga buring va «5 soniyani boshlash»ni bosing — keyin unga uch savol berasiz.
  - Yakka rejimda: Sahifangizni 5 soniya ko'ring, keyin uch savolga ekranga qaramasdan, yoddan javob yozing.
- Chip qatori: 1 Ko'rsatish · 2 So'rash · 3 Solishtirish (yakka: 1 Ko'rish · 2 Yozish · 3 Solishtirish)
- 1-qism: o'quvchi sahifasi parda ostida; tugma: 5 soniyani boshlash → parda ko'tariladi, sanoq 5 → 0, parda tushadi. Kulrang qator: 5 soniya — shu mashqning qoidasi.
- 2-qism: uch savol bittadan — Bu nima? · Kim uchun? · Bu yerda nima qilish mumkin?
  - Maydon: «U nima dedi?» (yakka: «Nima esda qoldi?») · tugmalar: Javob bermadi (yakka: Eslay olmadim) · Saqlash
  - Kulrang qator (juftlikda): Sherigingiz ismini yozmang — faqat javobini.
  - Yozilgan javoblar ixcham ro'yxatda (savol — javob; javob bo'lmasa —).
- 3-qism: tugma Ochish → parda ko'tariladi; uch javob pufak bo'lib, sahifadagi o'z bo'lagiga ingichka chiziq bilan ulanadi (Bu nima? va Kim uchun? — sarlavha · Bu yerda nima qilish mumkin? — asosiy tugma). Har biri ostida: Mos keldi · Mos kelmadi.
  - Kulrang qator: Bu mashqda: javob mos kelmasa, chiziq ko'rsatgan bo'lakni qayta ko'rasiz.
  - «Mos kelmadi» bosilsa — bo'lak yonida ✎ (bosilsa 9-ekran o'sha bo'lagi ochiladi).
- Uchalasidan keyin sahifa ostida yorliq «besh soniyalik sinov»: Sherik sahifani 5 soniya ko'rib, nima va kim uchun ekanini aytdi — besh soniyalik sinov shu.
  - Yakka rejimda yorliq «mashq»: Sherik bilan qilinsa, bu — besh soniyalik sinov; hozirgisi — mashq: sahifani o'zingiz bilasiz.
- Xulosa (tanlovga qarab):
  - uchalasi «Mos keldi»: Bu sinovda sherigingiz uch savolga ham sahifadagidek javob berdi. Bitta sinov — kuzatuv, isbot emas.
  - kamida bittasi «Mos kelmadi»: N ta javob sahifaga mos kelmadi — o'sha bo'lakni qayta o'qing. Bitta sinov — kuzatuv, isbot emas.
  - yakka rejim: Bu mashq edi: sahifani o'zingiz bilasiz. Sinov — uni hali ko'rmagan odam bilan, uyga vazifada.
- Tugmalar: Orqaga · Solishtiring (N/3) → Davom etish

## 11 · Sahifa internetga
- Eyebrow: Amaliyot · lending
- Sarlavha: Sahifangizni yig'ing va *internetga chiqaring.*
- Mentor: Sahifa matni tayyor — endi agent uni sahifaga aylantiradi; «1 · Ochish»dan boshlang.
- Mentor ostida ixcham qator: Sahifam · n / 4 (o'quvchi sahifasi)
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; bajarilgani bir qatorga yig'iladi, «Qaytarish» bilan qaytadi):
  1. Ochish — Antigravity'da o'z repo'ngizni oching. Terminalda `git status` — o'zgargan fayl yo'q bo'lsin; ro'yxatda `.env` ko'rinmasin (ko'rinsa — avval `.gitignore` ga qo'shing).
     - Trek tanlanmagan bo'lsa: Mobil ilova · Sayt
  2. Prompt — talabning matn qatorlari mustaqil ishingizdan to'ldirilgan (tahrirlash mumkin). Qalin ikki joyni o'zingiz yozing — kulrang namunaga qarang, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     ```
     Qayerda: repo ildizida yangi `lending/` papkasi — `index.html` va `style.css`. Boshqa papkalarga tegma.
     Nima qilsin: bitta sahifali statik sayt — oddiy HTML va CSS, yig'ish buyrug'isiz. Matnni aynan shunday yoz, bitta so'zini ham o'zgartirma:
     nom — «{mahsulot nomi}» · sarlavha — «{sarlavha}» · sarlavha osti — «{sarlavha osti}» ·
     uch foyda, har biri katta yozuv va ostida bitta qator — «{1-foyda}», ostida «{1-funksiya qatori}» · «{2-foyda}», ostida «{2-funksiya qatori}» · «{3-foyda}», ostida «{3-funksiya qatori}» · asosiy tugma — «{tugma yozuvi}».
     Tugma bosilganda: {tugma ochadigan joy}
     Sahifada mahsulot maketi bo'lsin — HTML va CSS bilan chizilgan, surat emas: {maketda nima ko'rinadi}. Sahifa adaptiv: telefon kengligida bir ustun.
     Nima buzilmasin: boshqa papkalar o'zgarmasin. Sahifada forma va kiritish maydoni bo'lmasin — ism, telefon, email so'ralmaydi. O'zgargan fayllarni ayt.
     ```
     (`{…}` joylari o'quvchining 9-ekrandagi matni bilan to'ldiriladi; ✎ — tahrirlash.)
     - `{tugma ochadigan joy}` — masalan: sahifa pastidagi «Qanday qo'shilaman» bo'limi; bo'lim matni: «Hozircha o'rnatish havolasi yo'q.» (web-trekda: masalan: saytim — https://….netlify.app)
     - `{maketda nima ko'rinadi}` — masalan: «O'yinlar» ekrani, namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10» — namuna ma'lumot, haqiqiy odamlar emas
     - Yordam (bosilsa ochiladi) — Mentor misoli:
       ```
       Qayerda: repo ildizida yangi `lending/` papkasi — `index.html` va `style.css`. Boshqa papkalarga tegma.
       Nima qilsin: bitta sahifali statik sayt — oddiy HTML va CSS, yig'ish buyrug'isiz. Matnni aynan shunday yoz, bitta so'zini ham o'zgartirma:
       nom — «Maydon Jamoa» · sarlavha — «Mahalla futboliga jamoani bir joyda yig'ing» · sarlavha osti — «O'yinni e'lon qiling — kim qo'shilgani va kim aniq kelishi ko'rinib turadi.» ·
       uch foyda, har biri katta yozuv va ostida bitta qator — «Bir bosishda jamoadasiz», ostida «Har o'yin alohida kartada: «Qo'shilaman» ni bosasiz.» · «Nechta odam yig'ilganini so'rab o'tirmaysiz», ostida «Kartada ko'rinadi: 8 / 10.» · «Kim aniq kelishini o'yindan oldin bilasiz», ostida «O'yin kuni har kim «Kelaman» ni bosadi.» · asosiy tugma — «Qo'shilmoqchiman».
       Tugma bosilganda sahifa pastdagi «Qanday qo'shilaman» bo'limiga o'tsin; bo'lim matni: «Hozircha o'rnatish havolasi yo'q.»
       Sahifada telefon maketi bo'lsin — HTML va CSS bilan chizilgan, surat emas: «O'yinlar» ekrani, namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10». Sahifa adaptiv: telefon kengligida bir ustun.
       Nima buzilmasin: `mobil/`, `backend/` va `prototip/` o'zgarmasin. Sahifada forma va kiritish maydoni bo'lmasin — ism, telefon, email so'ralmaydi. O'zgargan fayllarni ayt.
       ```
       Web-trekda: «Tugma bosilganda saytim ochilsin: {sayt manzili}» · «Nima buzilmasin: `prototip/` va `backend/` o'zgarmasin. …»
  3. Ishga tushirish
     - agent tugatgach `lending/index.html` ni brauzerda oching. Agentning hisobotiga emas, sahifaning o'ziga qarang: matnni mustaqil ishdagi yozuvingiz bilan so'zma-so'z solishtiring (tepadagi ixcham sahifa shu uchun turibdi).
     - `git status` — faqat `lending/` ichidagi fayllar o'zgargan. Mos kelmagan so'zni agentga bitta gap bilan yozing: «Sarlavha so'zma-so'z shunday bo'lsin: {sarlavha}. Tuzat.»
     - Keyin `git add lending/index.html lending/style.css` → `git commit -m "12-modul 1-dars: lending"` → `git push`.
     - Netlify: app.netlify.com da akkauntingizga kiring (2-Modulda ochgansiz) → yangi loyiha qo'shing («Add new project») → GitHub'dan import → o'z repo'ngiz. Sozlamada: Base directory — bo'sh (repo ildizi); Build command — bo'sh (yig'ish yo'q); Publish directory — `lending`.
     - Havola chiqadi: `….netlify.app`. Netlify sahifani chiqarguncha kutish paytida telefoningizda brauzerni ochib qo'ying. Sahifa ochilmasa — avval Netlify sozlamasida Publish directory `lending` ekanini tekshiring; keyin xato qatorini agentga yuboring (`.env` qiymatlarini emas).
     - Vaqt tugayotgan bo'lsa — push qilib qo'ying: Netlify va tekshiruv — uyga vazifa ①.
  4. Telefonda tekshirish
     - telefonda `….netlify.app` havolasini oching va talabning har qatorini tekshiring: (1) sahifa bir ustunda, matn mustaqil ishdagi bilan bir xil; (2) asosiy tugmani bosing — mobil trekda sahifa bo'limga o'tishi, web-trekda saytingiz ochilishi kerak.
     - Mos kelmagan qatorni agentga yozing. Oxirida havolani shu yerga yozing:
     - Maydon: Sahifa manzili (`https://….netlify.app`)
     - Tugma bosilishini sanash (Umami) — uyga vazifa ②: sahifa manzili endi ma'lum, Umami'da saytni shu manzil bilan qo'shasiz.
- O'ngda — kutilgan natija · namuna: Maydon Jamoa (brauzer maketi, to'liq Mentor lendingi; bir marta o'zi yuradi: «Qo'shilmoqchiman» bosiladi → sahifa «Qanday qo'shilaman» bo'limiga suriladi)
- Hammasi bajarilgach (yashil): Sahifangiz internetda: matnini va tugmasini telefonda o'zingiz tekshirdingiz.
- Pastki qator: Ortda qoldingizmi — Mentor misolini yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-01-done`
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 12 · Yakuniy savol
- Eyebrow: Yakuniy tekshiruv
- Savol: Mahsulotingizda bitta funksiya hali yo'q. Uni sahifaga *foyda qilib yozasizmi?*
  - Ha — u baribir yaqin kunlarda qo'shiladi
  - Ha — kichik harflar bilan eng pastga yozasiz
  - ✔ Yo'q — sahifaga hozir ishlaydigani yoziladi
  - Yo'q — yangi funksiya odamlarga kerak emas
- Javob izohlari:
  - To'g'ri: Sahifani o'qigan odam mahsulotda shu narsani topishi kerak.
  - A: Qo'shilguncha odam uni mahsulotda topa olmaydi.
  - B: Kichik harf ham va'da: odam uni mahsulotda topadimi?
  - D: Funksiya kerak bo'lishi mumkin — gap u hozir yo'qligida.
  - Umumiy: Sahifani o'qigan odam mahsulotda nimani topadi?
- Javob topilgach (savol ostida): «Eslatma» chipi, yonida kulrang: hali yo'q
- Javob kartasi va tugmalar — 3-ekrandagidek (To'g'ri javob: C — <variant>).

## 13 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 14 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring.*
- Birinchi bosishgacha: Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon |
|---|---|
| Lending nima? | Mahsulotni bitta sahifada tanishtiradigan sayt |
| Bizda lending qaysi uch bo'lakdan iborat? | Sarlavha, uchta foyda va bitta asosiy tugma |
| Sarlavha qaysi ikki savolga javob beradi? | Kim uchun va nima foyda |
| Funksiya bilan foydaning farqi nima? | Funksiya — mahsulot nima qilishi; foyda — u odamga nima berishi |
| Mentor misolida «8 / 10» sonining foydasi qanday yozilgan? | «nechta odam yig'ilganini so'rab o'tirmaysiz» |
| Hali qurilmagan funksiya sahifaga yoziladimi? | Yo'q: sahifaga hozir ishlaydigan narsa yoziladi |
| Asosiy tugma nima? | Sahifadagi odamni bitta harakatga chaqiradigan tugma |
| Mentor lendingida tugma bosilganda nima ochiladi? | Sahifadagi «Qanday qo'shilaman» bo'limi |
| Nega lendingda forma yo'q? | Sahifa shaxsiy ma'lumot yig'maydi: ism ham, telefon ham so'ralmaydi |
| Besh soniyalik sinovda sherikka qaysi uch savol beriladi? | Bu nima? Kim uchun? Bu yerda nima qilish mumkin? |
| Burbn'dan nima qoldi? | Rasm, filtr va izohlar — ilova Instagram bo'ldi |
| Lending telefonda qanday ko'rinadi? | Adaptiv: telefon kengligida bir ustun |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 15 · Dars yakuni
- Eyebrow: Dars yakuni
- Yuqori yorliqlar: Dars tugadi · N/4 to'g'ri
- Sarlavha (holatga qarab, yuqoridan birinchi mos kelgani):
  - sahifa manzili yozilgan va amaliyot 4/4: Sahifangizni yozdingiz va *internetga chiqardingiz.*
  - amaliyotda «Ishga tushirish» bajarilgan, manzil yo'q: Sahifa yig'ildi — *internetga chiqarish qoldi.*
  - sahifa matni 4/4, amaliyot boshlanmagan: Sahifa matni tayyor — *yig'ish qoldi.*
  - sahifa matni 1–3 bo'lak: Sahifa matni boshlandi — *qolganini yozing.*
  - hech narsa yozilmagan: Sahifa matni hali yozilmagan — *uyda yozib chiqing.*
- CODE STRIKE arenasi (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Lending — mahsulotni bitta sahifada tanishtiradigan sayt.
  - Bizda sarlavha ikki savolga javob beradi: kim uchun va nima foyda.
  - Foyda — funksiya odamga nima berishi; sahifaga hozir ishlaydigan funksiyaning foydasi yoziladi.
  - Asosiy tugma odamni bitta harakatga chaqiradi va hozir bor narsaga olib boradi.
  - Burbn'dan odamlarga yoqqani qoldi: rasm, filtr va izohlar.
- Uyga vazifa (tugma «Amaliy topshiriqni bajarish →»; bosilgach karta ochiladi):
  - Uyda nima qilasiz?
  - Kim bilan — sahifangizni hali ko'rmagan 2 kishi — uydagilar yoki do'stingiz · Nechta — 2 ta besh soniyalik sinov · Muddat — keyingi darsgacha
  1. Sahifa hali internetga chiqmagan bo'lsa — push qiling va Netlify'ga chiqaring; havolani darsdagi «Sahifa manzili» maydoniga yozing.
  2. Tugma bosilishini sanashni ulang: `cloud.umami.is` da akkauntingizga kiring (9-Modulda ochgansiz) → «Websites» → «Add website»: Name — mahsulotingiz nomi va «lending», Domain — sahifangiz manzili → «Save» → saytingiz yonidagi «Edit» → «Tracking code» dagi bir qator kodni nusxalang (u maxfiy emas — sahifa kodida hammaga ko'rinadi). Agentga: «`lending/index.html` ning `<head>` qismiga shu skriptni qo'sh: {skript}. Tugma bosilganda Umami'ga `{hodisa nomi}` hodisasi yozilsin. Umami yuklanmasa ham tugma ishlasin. Boshqa fayllarga tegma.» → push → sahifada tugmani bosing, Umami'da saytingiz sahifasini yangilang: hodisalar orasida `{hodisa nomi}` ko'rinishi kerak (reklama to'sgichi yoqilgan brauzerda yozilmasligi mumkin). Umami akkauntingiz bo'lmasa — Mentor o'z akkauntida sayt qo'shib beradi.
     (`{hodisa nomi}` o'rnida — 9-ekranda tugma yozuvidan yasalgan nom; Mentor misolida `qoshilmoqchiman`.)
  3. Sahifani o'z telefoningizda har biriga 5 soniya ko'rsating va uch savolni bering: «Bu nima?» · «Kim uchun?» · «Bu yerda nima qilish mumkin?». Javoblarni qog'ozga yozing — ismini emas, kimligini («akam», «sinfdoshim»). Havolani guruhlarga yubormang.
  4. Ikkalasi ham javob bera olmagan savol bo'lsa — o'sha bo'lakni darsdagi matnda tuzating, agentga «Sahifadagi {bo'lak} shunday bo'lsin: {yangi matn}. Tuzat.» deb yozing va push qiling — sahifa odatda o'zi yangilanadi. Ikki kishi — kuzatuv, isbot emas.
  - Keyingi dars — **«WebSocket: ekran o'zi yangilanadigan ulanish»**
- Nishonlaringiz — N/4 (to'rtta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- **Benefit Finder!** — Uch funksiyaning foydasini va hali yo'q funksiyani birinchi urinishda ajratdingiz (4-ekran, to'rt kartada birinchi urinishda)
- **Page Writer!** — Sahifangiz uchun sarlavha, uch foyda va tugma yozuvini yozdingiz (9-ekran, to'rt bo'lak saqlanganda)
- **Five Seconds!** — Sahifangizni besh soniyalik ko'rishdan keyin uch savol bilan solishtirdingiz (10-ekran, uchala solishtirishdan keyin)
- **Page Online!** — Sahifangizni internetga chiqardingiz (11-ekran, 4-qadam — sahifa manzili yozilganda)
- Nishon olinganda: Yangi nishon · nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 3-ekran (1-savol) — **Sarlavha: kim uchun va nima foyda**
   - 1 · Sarlavha — sahifaning birinchi qatori.
   - 2 · Bizda u ikki savolga javob beradi: kim uchun va nima foyda.
   - 3 · Nom, texnologiya va bo'limlar ro'yxati bu savollarga javob bermaydi.
   - Sinfga savol: «Maydon Jamoa» so'zining o'zidan kim uchun ekani ko'rinadimi?
2. 5-ekran (2-savol) — **Funksiya va foyda**
   - 1 · Funksiya — mahsulot nima qilishi.
   - 2 · Foyda — funksiya odamga nima berishi.
   - 3 · Mentor misolida: «8 / 10» soni — «nechta odam yig'ilganini so'rab o'tirmaysiz».
   - Sinfga savol: Mahsulotingizdagi bitta funksiya odamga nima beradi?
3. 8-ekran (3-savol) — **Instagram: yoqqani qoldi**
   - 1 · Burbn'da funksiya ko'p edi, uni hech kim ishlatmagan.
   - 2 · Asoschilar odamlarga yoqqanidan boshqa hammasini olib tashlagan.
   - 3 · Qolgani — rasm, filtr va izohlar: Instagram shunday tug'ilgan.
   - Sinfga savol: Sahifangiz bitta gapda nimani va'da qiladi?
4. 12-ekran (yakuniy) — **Sahifada hozir ishlaydigan narsa**
   - 1 · Sahifani o'qigan odam mahsulotni ochadi.
   - 2 · U sahifada yozilgan narsani mahsulotda topishi kerak.
   - 3 · Hali qurilmagan funksiya sahifaga yozilmaydi.
   - Sinfga savol: Mentor sahifasiga nega «eslatma» yozilmadi?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Siz hozir: N-o'rin» · «Test yakunlandi!» · mustaqil rejimda natija: N ball · N/12 to'g'ri · eng uzun streak · Qayta ishlash · mustaqil rejimda: Keyingi → · Natijani ko'rish · jonli dars tugasa: «Jonli dars yakunlandi — testni o'zingiz davom ettiring:» · Mashq rejimida davom etish

1. Sherigingiz sarlavhaga faqat mahsulot nomini yozdi. Nima yetishmaydi?
   - ✔ Kim uchun va nima foyda
   - Rang va shrift kattaligi
   - Narxi va chiqqan sanasi
   - Logotipi va nomning rangi
2. Mentor lendingida «Maydon Jamoa» nomi qayerda turadi?
   - Sarlavha o'rnida, katta yozuv
   - ✔ Sahifa tepasida, kichik yozuv
   - Faqat tugmaning ichida, qalin
   - Sahifaning eng pastida, xira
3. Kutubxona sayti kitob bor-yo'qligini ko'rsatadi. Foydasi qaysi?
   - Sayt kitob ro'yxatini saqlaydi
   - Qidiruvga kitob nomini yozasiz
   - ✔ Kutubxonaga bekorga bormaysiz
   - Ro'yxat har kuni yangilanadi
4. Mentor sahifasiga «o'yindan oldin eslatma» nega yozilmadi?
   - Eslatma o'yinchilarga yoqmagani uchun
   - Sahifada bo'sh joy qolmagani uchun
   - Eslatma juda uzun yozilgani uchun
   - ✔ Ilovada u hali qurilmagani uchun
5. Mentor lendingidagi «Qanday qo'shilaman» bo'limida hozir nima yozilgan?
   - Ilovani do'kondan yuklab olish havolasi
   - Ism va telefon raqami so'raladigan forma
   - O'yinlar ro'yxati va «8 / 10» sonlari
   - ✔ Hozircha o'rnatish havolasi yo'qligi
6. Sahifangizda «Batafsil», «Yozilish» va «Bog'lanish» tugmalari bor. Bu darsda nima qilasiz?
   - ✔ Bitta asosiy tugmani qoldirasiz
   - Uchalasini bir qatorga terasiz
   - Yana bitta yangi tugma qo'shasiz
   - Tugmalarni kichikroq qilib qo'yasiz
7. Asoschilar Burbn'da qaysi funksiyalarni qoldirgan?
   - Eng qiyin qurilganlarini
   - ✔ Odamlarga yoqqanlarini
   - O'zlariga yoqqanlarini
   - Oxirgi qo'shilganlarini
8. Instagram voqeasidagi «25 000» soni sizga nimani bildiradi?
   - Birinchi kun uchun eng kam natijani
   - Har lending yetishi kerak bo'lgan sonni
   - ✔ Shu voqeaning sonini, sizga maqsad emas
   - Sahifa sarlavhasiga yoziladigan sonni
9. Sahifangizga ism va telefon uchun forma qo'ymoqchisiz. Bu darsda qanday qilinadi?
   - Forma asosiy tugmaning ostiga qo'yiladi
   - Formada faqat telefon raqami so'rab olinadi
   - ✔ Forma qo'yilmaydi: sahifa ma'lumot olmaydi
   - Forma faqat mobil trekdagi sahifada bo'ladi
10. Besh soniyalik sinovda sherigingiz «Kim uchun?» savoliga javob bera olmadi. Qaysi bo'lakni qayta o'qiysiz?
    - Uchta foyda qatorini
    - Tugmaning yozuvini
    - Sahifaning manzilini
    - ✔ Sahifa sarlavhasini
11. Agent sahifani yig'di. Matnni qanday tekshirasiz?
    - ✔ Yozganingiz bilan so'zma-so'z solishtirib
    - Agentning yozgan hisobotini o'qib chiqib
    - Sahifa brauzerda ochilganiga qarab qo'yib
    - Papkadagi fayllar sonini sanab chiqib
12. Tugma nechta marta bosilganini qayerdan bilasiz?
    - Netlify'dagi sayt sozlamalaridan
    - ✔ Umami'dagi hodisalar ro'yxatidan
    - GitHub'dagi commit ro'yxatidan
    - Telefondagi brauzer tarixidan

## Kartochkalar
14-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 15-ekrandagi 5 qator.
- Keyingi dars — «WebSocket: ekran o'zi yangilanadigan ulanish».
