# 7-dars «50 foydalanuvchiga qanday yetasiz?» — yakuniy matn

Fayl: `src/10-Modull/PmFiftyUsersLesson.jsx` · 12 ekran · Keyingi dars: «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — «Ishga tushirish yo'li»: chapda maket (chat oynasi · brauzer oynasi · telefon «Maydon Jamoa»), o'ngda jadval yoki sanoq kartalari. Mentor misoli (dars bo'yi bir xil):

- Lending (brauzer, manzil `maydon-jamoa-….netlify.app`): Maydon Jamoa · sarlavha «Mahalla futboliga jamoani bir joyda yig'ing» · tugma «Qo'shilmoqchiman» · bo'lim «Qanday qo'shilaman»: Hozircha o'rnatish havolasi yo'q.
- Lending, havola qo'yilgach: «Qanday qo'shilaman» — Android: ilovani o'rnatish · iPhone: brauzerda ochish · ostida ikki kulrang qator: Android o'rnatishda ogohlantirish ko'rsatadi — ilova do'kondan emas, to'g'ridan-to'g'ri o'rnatiladi. · iPhone'da eslatma hozircha yo'q. · sahifa pastida «Maxfiylik siyosati»
- Chat oynasi: «Mahalla futbol guruhi» · 60 a'zo (2-bosqichda — «Maktab chati», tepasida «chat egasidan ruxsat ✓»)
- Birinchi post (6-darsdagi, chatda eski pufak): Mahalla futbolchilari, Shanba o'yiniga kim kelishini bitta joyda ko'rish uchun «Maydon Jamoa» ilovasini qurdim: o'yin e'lon qilinadi, «Qo'shilaman» bosiladi, nechta odam yig'ilgani ko'rinib turadi. Ilova ishlayapti, o'rnatish havolasi hozircha yo'q — sahifasini ko'ring: maydon-jamoa-….netlify.app
- Ikkinchi post: Maydon Jamoa chiqdi. Shanba, 18:00 o'yini ilovada turibdi — «Qo'shilaman» ni bosing, nechta odam yig'ilgani ko'rinadi. Android va iPhone uchun havola: {lending manzili}
- Telefon «Maydon Jamoa» ekranlari: «Ro'yxatdan o'tish» (Ism · Telefon yoki Login · Parol · tugma «Ro'yxatdan o'tish») · «O'yinlar» (Shanba · Shanba, 18:00 · Mahalla maydoni · 8 / 10) · «O'yin» (‹ O'yinlar · Shanba, 18:00 · Mahalla maydoni · 8 / 10 · tugma «Qo'shilaman» → «Qo'shildingiz») · «E'lon berish» (Shanba, 18:00 · Mahalla maydoni · 0 / 10 · havola ›) · akkaunt: «Hisobdan chiqish» · «Hisobni o'chirish» → «Rostdan o'chirasizmi?»
- Forma ostidagi gap: Ism — o'yinchilar ko'radigan nom, familiya shart emas. Loginni boshqa o'yinchilar ko'rmaydi.

Mentor rejasi (jadval ustunlari: Bosqich · Kanal · Nima yuboriladi · Kutilgan son · Qachon; ostida 0…50 chizig'i, yorliq «Mentorning taxmini»):

| Bosqich | Kanal | Nima yuboriladi | Kutilgan son | Qachon |
|---|---|---|---|---|
| 1 | sinf chati va mahalla futbol guruhi | ikkinchi post («ilova chiqdi») | 20 | ishga tushirish kuni |
| 2 | maktab chati (parallel sinflar; chat egasidan ruxsat) | post — birinchi qatori parallel sinflarga moslab | 35 | birinchi hafta |
| 3 | har o'yin e'loni bilan birga havola: tashkilotchilar xohlasa o'z jamoasiga yuboradi | lending havolasi | 50 | har yangi e'londa |

Ikki sanoq kartasi (ishga tushirish kuni): Ro'yxatdan o'tgan: 20 · Asosiy harakatni qilgan: 8.

Maxfiylik sahifasi (brauzer `…/maxfiylik.html`):
- Maydon Jamoa · maxfiylik siyosati
- **Qaysi ma'lumot?** Ro'yxatdan o'tishda — ism, login va parol; parolning o'zi saqlanmaydi, o'rnida undan yasalgan satr (hash) turadi. Telefon raqami so'ralmaydi. Ilovada qadamlar sanaladi — ism va loginsiz, qurilma ID bilan. Lendingda Umami tashrif va tugma bosilishini sanaydi — unga ism va login yuborilmaydi.
- **Nima uchun?** Ism — o'yindagi o'yinchilar bir-birini tanishi uchun. Login va parol — hisobga kirish uchun. Qadamlar sanog'i — ilovaning qaysi joyi tushunarsizligini bilish uchun.
- **Kim ko'radi?** Ism — shu o'yindagi o'yinchilar. Loginni boshqa o'yinchilar ko'rmaydi. Database'ni faqat ilova egasi ko'radi.
- **Qancha saqlanadi?** Hisob — o'zingiz o'chirguningizcha: ilovada «Hisobni o'chirish» bor. Qadamlar yozuvi — 60 kun.

## 0 · Kirish
- Eyebrow: Kirish
- Sarlavha: 50 foydalanuvchiga *qanday yetasiz?*
- Mentor: Mentor misolida birinchi postdan keyin odamlar lendingga kirib tugmani bosdi, ilova esa hali ularga yuborilmagan. Ikki javobdan birini tanlang.
- Maket: brauzer — Mentor lendingi (sarlavha, «Qo'shilmoqchiman», «Qanday qo'shilaman»: Hozircha o'rnatish havolasi yo'q.)
  - Oyna ostida mono qator: Umami (Mentor misolida · postdan keyingi kun): tashriflar 31 · «Qo'shilmoqchiman» 17
- Variantlar:
  - Havolani hoziroq hamma tanishlarimga yuboraman
  - Avval reja tuzaman: kimga, nimani va qachon
- Javob (birinchisi tanlansa): **Qiziq fikr!** Tanishlardan boshlash mumkin — rejada ham shunday. Yuborishdan oldin esa uch narsa tekshiriladi.
- Javob (ikkinchisi tanlansa): **Aynan!** Reja kimga, nimani va qachon yuborishni aytadi. Yuborishdan oldin esa uch narsa tekshiriladi.
- Tanlovdan keyin lendingda «Qanday qo'shilaman» bo'limi halqaga kiradi, yonida uchta bo'sh uya (?)
- Tugma: Bittasini tanlang → Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun reja tuzib, ilovangizni *yuborishga tayyorlaysiz.*
- Mentor: 6-darsda kanallarni tanlab birinchi postni yubordingiz — bugun o'sha kanallarga ilovaning o'zi boradi. Kodni agent yozadi, qaror va tekshiruv — sizdan.
- Chap — yorliq «yig'ish rejasi va ishga tushirish»; vizual bir marta o'zi yuradi: 1-bosqich · 2-bosqich · 3-bosqich (sonsiz) → Mahalla futbol guruhi · post → lending · Qo'shilmoqchiman → Maydon Jamoa · Ro'yxatdan o'tish → Maydon Jamoa · O'yinlar
- Reja:
  1. 50 foydalanuvchiga uch bosqichli reja tuzasiz · reja
  2. Ro'yxatdan o'tishda faqat keraklisini so'raysiz · ma'lumot
  3. Ilovada qadamlar sanashini yoqasiz · o'lchov
  4. Havolani lendingga qo'yib, post yuborasiz · havola
- Pastki qator: repo `maydon-jamoa` · boshlang'ich holat `m12-dars-07-start` · namuna `m12-dars-07-done` — amaliyotlarni o'z mahsulotingizda bajarasiz.
- Pastki qator 2 (web-trek tanlanmagan bo'lsa): Uyda tayyorlagan o'rnatish faylingiz eski ro'yxatdan o'tish ekrani bilan — uni odamlarga yubormang: yangisi Amaliyot 1 oxirida tayyorlanadi. Hali sozlamagan bo'lsangiz — hozir terminalda: `npm install --global eas-cli` · `eas login` · `eas build:configure` (agentga: «`eas.json` ga `preview` profili: Android uchun `buildType` — `apk`; `env` da `EXPO_PUBLIC_API_URL` — Render manzili»), keyin reja bilan davom eting.
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Mentor rejasi
- Eyebrow: Tushuncha · reja
- Sarlavha: 50 kishi bitta *postdan keladimi?*
- Mentor (bosqichga qarab):
  - bashoratgacha: Avval javobingizni belgilang, keyin Mentor rejasini bo'lakma-bo'lak oching.
  - 1/3–3/3: Keyingi bo'lakni ochish uchun «Keyingi bosqich»ni bosing.
  - 3/3 dan keyin: Rejadagi sonlar — kutilgan sonlar; haqiqiysini ko'rish uchun «Ishga tushirish kuni»ni bosing.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): «Ilova chiqdi» postidan keyin Mentor nechta kishi kutyapti? · 20 kishi · 35 kishi · 50 kishi
  - Tanlangach qator: «Ilova chiqdi» postidan keyin Mentor nechta kishi kutyapti? · Taxminingiz: …
- Chapda chat oynasi «Mahalla futbol guruhi · 60 a'zo» (ichida birinchi post) · o'ngda reja jadvali (qatorsiz) va 0…50 chizig'i
- «Keyingi bosqich N/3» bosilganda jadvalga navbatdagi qator kiradi (yuqoridagi Mentor rejasi), chiziqda son belgisi, yorliq «Mentorning taxmini»:
  - 1/3: chatga ikkinchi post pufagi kiradi
  - 2/3: chat — «Maktab chati», «chat egasidan ruxsat ✓», kulrang pufak: post — birinchi qatori parallel sinflarga moslab
  - 3/3: chat o'rnida telefon — «E'lon berish», e'lon kartasidan «havola ›» uchadi
- 3/3 dan keyin qator: Bu darsda rejaning har bo'lagi bosqich deyiladi: unda kanal, nima yuborilishi, kutilgan son va qachon yoziladi.
- «Ishga tushirish kuni» bosilganda: chiziqda haqiqiy 20; 2 va 3-qatorlar kulrang, yorliq «hali boshlanmagan»; ikki sanoq kartasi sanab o'sadi:
  - Ro'yxatdan o'tgan: 20 — 11 tasi — sinfdosh, 9 tasi — mahalla futbol guruhidan · namuna va tekshiruv akkauntlarisiz
  - Asosiy harakatni qilgan: 8 — hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan
- Xulosa: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz ✕ — aslida: 20 kishi — 35 va 50 keyingi bosqichlarda kutilyapti) · Bu misolda 20 — taxmin; kunning oxirida ikki son sanaldi: ro'yxatdan o'tgan va asosiy harakatni qilgan. · Bu misolda taxmin va haqiqiy son teng chiqdi — sizda farq qilishi mumkin.
- Tugmalar: Orqaga · Avval belgilang → Keyingi bosqich (N/3) → Ishga tushirish kuni → Davom etish

## 3 · 1-savol
- Eyebrow: Tekshiruv · kutilgan son
- Savol: Rejada 2-bosqich yonida «35» turibdi. Bu son *nimani bildiradi?*
  - Maktab chatida shuncha kishi borligini
  - Shuncha kishi allaqachon ro'yxatdan o'tganini
  - ✔ Shuncha kishi yig'ilishi kutilayotganini
  - Shuncha kishi postni o'qishi aniq bo'lganini
- Javob izohlari:
  - To'g'ri: Rejadagi son — taxmin, haqiqiysi keyin sanaladi.
  - A: Chatdagi odamlar soni — boshqa son. Rejada nima yoziladi?
  - B: 2-bosqich hali boshlanmagan. Sanalgan son qayerda turadi?
  - D: Post nechta kishiga yetishi oldindan aniq emas.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 4 · Uch tekshiruv
- Eyebrow: Tushuncha · yuborishdan oldin
- Sarlavha: Havolani yuborishdan oldin *nimani tekshirasiz?*
- Mentor (bosqichga qarab):
  - bashoratgacha: Avval javobingizni belgilang, keyin yangi o'yinchi yo'lini bosib chiqing.
  - 1/3: Yangi o'yinchi ro'yxatdan o'tmoqchi — formadagi yonib turgan qatorni bosing.
  - 2/3: 10-Modulda saytdagi qadamlarni sanagansiz, ilovada esa hali sanalmaydi — «Sanashni yoqish»ni bosing.
  - 3/3: Oxirgisi — lendingdagi «Qo'shilmoqchiman»ni bosing: odam ilovaga qanday yetadi?
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): Mentor ilovasi hoziroq yuborilsa, nechta narsa yetmay qoladi? · Hech narsa · Bitta narsa · Uchta narsa
  - Tanlangach qator: Mentor ilovasi hoziroq yuborilsa, nechta narsa yetmay qoladi? · Taxminingiz: …
- Bashoratgacha faqat telefon «Ro'yxatdan o'tish» (Ism · Telefon · Parol); tanlangach o'ngda «Yuborishdan oldin» jadvali (N / 3), qatorlari navbat bilan kiradi:

| | Savol | Hozir | Qayerda |
|---|---|---|---|
| Ma'lumot | faqat kerakli minimum so'raladimi? | hozir: telefon so'raladi ✗ | Amaliyot 1 |
| O'lchov | qadamlar sanaladimi? | hozir: sanalmaydi ✗ | Amaliyot 1 |
| Havola | odam ilovani qanday ochadi? | hozir: havola yo'q ✗ | Amaliyot 2 |

- Nuqtalar (tartib bilan, bittasi halqada):
  1. «Telefon» qatori bosilsa — qator silkinadi, ostida yorliq «SMS yuborilmaydi — raqam kerak emas»; jadvalga «Ma'lumot» qatori.
     - Qator: Ro'yxatdan o'tishda o'zingiz tanlagan nom login deyiladi — loginni boshqa o'yinchilar ko'rmaydi.
  2. Telefon «O'yinlar», ostida to'rt yorliq: ochdi · ro'yxatdan o'tdi · qo'shildi · kelishini tasdiqladi (har birida ?) va tugma «Sanashni yoqish». Bosilsa — yangi o'yinchi yo'li o'zi o'ynaydi («O'yinlar» → «Ro'yxatdan o'tish» (Login bilan) → «O'yin», «Qo'shildingiz»), yorliqlarda 1 · 1 · 1 · 0, ostida mono qator `ochdi · k3f9…`; jadvalga «O'lchov» qatori.
     - Qator: Qurilma ID — tasodifiy harf va raqamlar: bitta qurilmadagi ilovani ajratadi, odamning ismini ham, loginini ham bildirmaydi.
     - Izoh: 10-Moduldagi brauzer ID ning ilovadagi ko'rinishi; har qadamda turli qurilmalar soni sanaladi.
  3. Brauzer — lending, «Qo'shilmoqchiman» halqada. Bosilsa — sahifa «Qanday qo'shilaman» bo'limiga suriladi, «Hozircha o'rnatish havolasi yo'q.» qizil yonadi, o'rniga ikki havola va ikki kulrang qator kiradi; jadvalga «Havola» qatori.
     - Qator: Mentor misolida Android'ga APK — o'rnatiladigan ilova fayli — boradi; iPhone'da ilovaning brauzer ko'rinishi ochiladi.
- Xulosa: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz ✕ — aslida: uchta narsa — ma'lumot, o'lchov, havola) · Bu misolda uchalasi ham tayyor emas edi: telefon so'ralardi, qadamlar sanalmasdi, havola yo'q edi.
- Tugadi: maket yig'iladi, «Yuborishdan oldin» jadvali butun enga (3 / 3)
- Tugmalar: Orqaga · Avval belgilang → Yo'lni bosib chiqing (N/3) → Davom etish

## 5 · O'z rejangiz
- Eyebrow: Mustaqil ish
- Sarlavha: Sizning rejangizda qaysi *uch bosqich bor?*
- Mentor: Har bosqichga kanal, nima yuborilishi, kutilgan son va vaqtni yozing — kanallar 6-darsdagi tanlovingizdan olindi.
  - (6-darsdagi kanallar saqlanmagan bo'lsa: Har bosqichga kanal, nima yuborilishi, kutilgan son va vaqtni yozing — kanalni o'zingiz yozasiz.)
- Kirish qatori: Kanal — faqat o'zingiz a'zo bo'lgan joy yoki tanish doira; guruhga — egasidan ruxsat so'rab.
- Qadamlar: 1-bosqich · 2-bosqich · 3-bosqich (bir vaqtda bitta karta)
- Karta (yorliq: N-bosqich · N / 3):
  - 6-darsdagi kanallaringiz — tugmalar (bosilsa «Kanal»ga yoziladi)
  - Kanal (ipucha: Qayerga yuborasiz?) — ruxsati hali so'ralgan kanal tanlansa, ostida kulrang: avval ruxsat so'rang
  - Nima yuboriladi (ipucha: Post, havola yoki boshqa narsa)
  - Kutilgan son — jami (yonida kulrang yorliq: taxminim)
  - Qachon · Bugun · Shu hafta · Keyinroq
  - Tugmalar: Qo'shish (qayta ochilgan kartada — Saqlash) · Yordam
- «Qo'shish» bosilganda karta ixcham qatorga uchadi: ✓ N · kanal · nima · son · qachon (bosilsa — tahrirlash); tepada 0…{eng katta son} chizig'i, yorliq «taxminim». 3/3 dan keyin tugma «Saqlash».
- Yordam (bosilsa ochiladi): Mentor rejasi: 1-bosqich — sinf chati va mahalla futbol guruhi, ikkinchi post, jami 20 · 2-bosqich — maktab chati (chat egasidan ruxsat bilan), jami 35 · 3-bosqich — tashkilotchilar xohlasa o'z jamoasiga havola yuboradi, jami 50. Sonlar — Mentorning taxmini; sizning mahsulotingizda boshqa bo'ladi. Yangi kanal bo'lmasa — 3-bosqich oldingi kanallarda davom etishi mumkin.
- Tekshiruv:
  - bo'sh kanal: Qayerga yuborasiz — shuni yozing.
  - bo'sh «Nima yuboriladi»: Nima yuborasiz — shuni yozing.
  - son yo'q: Nechta kishi kutyapsiz — son yozing.
  - son oldingi bosqichdagidan kam (ixcham qator ostida): Bu son — jami: oldingi bosqichdagidan kam bo'lmaydi.
  - kanalda xavfli so'z (ixcham qator ostida): Bu kanal xavfsizlik qoidalariga to'g'ri keladimi?
  - 3-bosqich soni 50 dan kam (ixcham qator ostida): Bu moduldagi mashq maqsadi — 50. Yana kanal bormi?
- Saqlangach: reja jadvali (Bosqich · Kanal · Nima yuboriladi · Kutilgan son · Qachon; har qator yonida ✎), ostida chiziq «taxminim»
  - Xulosa: Rejangiz saqlandi: uch bosqich, kanal va kutilgan son bilan. Haqiqiy sonni dars oxirida sanaysiz.
- Mentor ekranida forma o'rnida — Mentor rejasi (yuqoridagi jadval) va chiziq «Mentorning taxmini».
- Tugmalar: Orqaga · Bosqichlarni yozing (N/3) → Davom etish

## 6 · Amaliyot 1
- Eyebrow: Amaliyot 1 · ma'lumot va o'lchov
- Sarlavha: Ilovangiz keraklisini so'rasin, *qadamlarni sanasin.*
- Mentor: Talab tayyor — qavs ichiga mahsulotingiz qadamlarini yozasiz, oxirida o'rnatish fayli tayyorlana boshlaydi. «1 · Ochish»dan boshlang.
  - bo'limlar orasida: Keyingi bo'lim — «N · <bo'lim nomi>»: bajarib, «Bajardim»ni bosing.
  - blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Trekingiz: Mobil trek · Web-trek (trek hali tanlanmagan bo'lsa)
- Bo'limlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: o'zgargan fayl yo'q, `.env` ro'yxatda ko'rinmaydi.
     - Ro'yxatdan o'tish formangizni oching va har qatorga savol bering: mahsulot shusiz ishlaydimi? Mentor misolida telefon raqami kerak emas — SMS yuborilmaydi; talab uni login bilan almashtiradi. Sizning mahsulotingizda nima ortiqcha ekanini o'zingiz hal qilasiz — uni promptdagi birinchi qavsga yozasiz.
     - Keyin mahsulotingizda odam ochgandan asosiy harakatgacha bosib o'tadigan qadamlarni yozib oling — uchtadan beshtagacha. Mentor misolida to'rtta: ochdi · ro'yxatdan o'tdi · qo'shildi · kelishini tasdiqladi.
     - 10-Moduldagi hodisalar tizimi — jadval, `POST /hodisalar`, `hodisaYoz` — bugun final mahsulotingizga ko'chadi.
  2. **Prompt** — `{qadamlar}` qavsini to'ldiring (kulrang namunaga qarang), «Nusxalash»ni bosing, Antigravity'ga yuboring. `{lending manzili}` 1-darsdagi yozuvingizdan o'zi qo'yiladi (yo'q bo'lsa — o'zingiz yozasiz):
     - Prompt qutisi (Siz → Antigravity · ✎ · Nusxalash):
       > Qayerda: ro'yxatdan o'tish va kirish — ilova ekranlari, Backend yo'llari va foydalanuvchilar jadvali; Backend'da yangi `hodisalar` jadvali va `POST /hodisalar`; ilovada yangi `hodisaYoz(nom)` funksiyasi.
       > Nima qilsin: 1) ro'yxatdan o'tishda mahsulotga kerak bo'lmagan shu ma'lumot so'ralmasin: {ortiqcha ma'lumot}. Kirish uchun alohida nom kerak bo'lsa — login: odam o'zi tanlagan nom (3–20 belgi, harf va raqam, takrorlanmaydi); login band bo'lsa — «Bu login band»; kirish — login va parol bilan.
       > Forma ostiga gap: «Ism — o'yinchilar ko'radigan nom, familiya shart emas. Loginni boshqa o'yinchilar ko'rmaydi.» va «Maxfiylik siyosati» havolasi — {lending manzili}/maxfiylik.html (sahifani keyin qo'shaman).
       > 2) Foydalanuvchilar jadvaliga `namuna` (rost yoki yolg'on) va `yaratilgan` (ro'yxatdan o'tgan vaqt) ustunlarini qo'sh. Mavjud akkauntlar o'chmasin. Avval menga ro'yxat ko'rsat: har akkaunt, unga beriladigan login va olib tashlanadigan ustunlar — qaysilari namuna ekanini men aytaman va «Davom et» deyman; shundan keyingina namunalarga `namuna = true`, `yaratilgan` — hozirgi vaqt, keraksiz ustunni olib tashla; parollar o'zgarmasin. Forma orqali ro'yxatdan o'tgan har yangi akkaunt — `namuna = false`.
       > 3) «Hisobdan chiqish» yoniga «Hisobni o'chirish»: avval «Rostdan o'chirasizmi?» deb so'rasin; tasdiqlansa shu akkaunt o'chsin — `DELETE` faqat `WHERE` bilan, shu akkaunt `id` si bo'yicha. Unga tegishli qaysi yozuvlar o'chishi va qaysilari qolishini avval menga ro'yxat qilib ko'rsat — men tasdiqlagach bajar.
       > 4) Qadamlar sanog'i: `hodisalar` jadvali (`id`, `nom`, `qurilma_id`, `yaratilgan`); `POST /hodisalar { nom, qurilma_id }` — `nom` faqat «Qadamlar» qatoridagi nomlardan biri, aks holda `400`. Ilovada `hodisaYoz(nom)`: qurilma ID — birinchi ochilishda yaratiladigan tasodifiy harf va raqamlar, qurilmada saqlanadi. Qadamlar: {qadamlar}. Har hodisa ish muvaffaqiyatli tugagandan keyin yozilsin; ilovaning bitta ochilishiga bitta hodisa. 60 kundan eski hodisalar o'chirilsin — Backend ishga tushganda va keyin har 24 soatda, `WHERE` bilan.
       > Nima buzilmasin: hodisa bilan ism, login va token yuborilmasin — faqat qadam nomi va qurilma ID; so'rov o'tmasa ham ilova ishlayversin, foydalanuvchiga xato ko'rsatilmasin. Qolgan ekranlar va yo'llar avvalgidek ishlasin, boshqa odamlarning yozuvlari o'chmasin. `.env` ga tegma. Tekshiruv uchun akkaunt yaratsang — `namuna = true` bilan, `id` larini ayt va ishdan keyin faqat shularni o'chir. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Joy yonidagi kulrang namunalar:
       - {ortiqcha ma'lumot} — masalan: telefon raqami (SMS yuborilmaydi); hech biri ortiqcha bo'lmasa — «yo'q».
       - {qadamlar} — masalan: ilova ochilganda — `ochdi`; ro'yxatdan o'tganda — `royxatdan-otdi`; asosiy harakatdan keyin — … Bu kursda nomlar kichik harf va chiziqcha bilan, bo'lib o'tgan ish ma'nosida.
     - Yordam (bosilsa ochiladi; yorliq «Mentor misoli»):
       > Qayerda: `mobil/` — «Ro'yxatdan o'tish» va «Kirish» ekranlari, «Hisobdan chiqish» turgan joy; `backend/` — `POST /royxat`, `POST /kirish`, `oyinchilar` jadvali; yangi `hodisalar` jadvali va `POST /hodisalar`; `mobil/` da yangi `hodisaYoz(nom)`.
       > Nima qilsin: 1) telefon raqami so'ralmasin. `oyinchilar` da `telefon` o'rniga `login`: 3–20 belgi, harf va raqam, noyob. `POST /royxat { ism, login, parol }`, `POST /kirish { login, parol }`; login band bo'lsa — `409` «Bu login band».
       > Forma ostiga: «Ism — o'yinchilar ko'radigan nom, familiya shart emas. Loginni boshqa o'yinchilar ko'rmaydi.» va «Maxfiylik siyosati» havolasi — {lending manzili}/maxfiylik.html.
       > 2) `oyinchilar` ga `namuna` (rost yoki yolg'on) va `yaratilgan` ustunlari. Mavjud akkauntlar o'chmasin. Avval ro'yxatni ko'rsat: har akkaunt va unga ismidan beriladigan login (`ali` kabi, kichik harf; takrorlansa oxiriga raqam); men «Davom et» deganimdan keyin hammasiga `namuna = true`, `yaratilgan` — hozirgi vaqt, `telefon` ustunini qiymatlari bilan olib tashla; parollar o'zgarmasin. `POST /royxat` har doim `namuna = false` yozsin.
       > 3) «Hisobdan chiqish» yoniga «Hisobni o'chirish»: «Rostdan o'chirasizmi?» deb so'rasin; tasdiqlansa shu akkaunt va uning `ishtirokchilar` dagi yozuvlari o'chsin — `DELETE` faqat `WHERE oyinchi_id = …` bilan; o'yindan chiqqandagi kabi son yangilansin. U e'lon qilgan o'yinlar o'chmasin — tashkilotchisi bo'sh qolsin; bunday o'yinlar ro'yxatda va «O'yin» ekranida xatosiz ko'rinsin. «Hisobdan chiqish» va «Hisobni o'chirish» da shu telefondagi rejalashtirilgan eslatmalar bekor bo'lsin.
       > 4) `hodisalar` jadvali — `id`, `nom` (matn), `qurilma_id` (matn), `yaratilgan`. `POST /hodisalar { nom, qurilma_id }`: `nom` faqat `ochdi`, `royxatdan-otdi`, `qoshildi` yoki `tasdiqladi`, aks holda `400`. Ilovada `hodisaYoz(nom)`: qurilma ID — birinchi ochilishda yaratiladigan tasodifiy harf va raqamlar, qurilmada saqlanadi.
       > To'rt joyda chaqirilsin: ilova ochilganda (bitta ochilishga bitta) — `ochdi`; ro'yxatdan o'tish muvaffaqiyatli bo'lganda — `royxatdan-otdi`; «Qo'shilaman» muvaffaqiyatli bo'lganda — `qoshildi`; «Kelaman» muvaffaqiyatli bo'lganda — `tasdiqladi`. 60 kundan eski hodisalar o'chirilsin — Backend ishga tushganda va keyin har 24 soatda, `WHERE` bilan.
       > Nima buzilmasin: o'yinlar, qo'shilish, tasdiq, chiqish, navbat, real vaqt ulanishi va eslatma avvalgidek ishlasin; hodisa bilan ism, login va token yuborilmasin; so'rov o'tmasa ham ilova ishlayversin. `.env` ga tegma. Tekshiruv uchun akkaunt yaratsang — `namuna = true` bilan, `id` larini ayt va ishdan keyin faqat shularni o'chir. Boshqa joyga tegma, o'zgargan fayllarni ayt.
       - Ilovangizda ro'yxatdan o'tish yo'q bo'lsa — 1, 2 va 3-bandni o'chiring, 4-band qoladi. Qaysi ma'lumot ortiqcha ekanini birinchi qavsga o'zingiz yozasiz — login ham faqat kerak bo'lsa.
       - Web-trek: «qurilma ID» o'rnida brauzer ID — 10-Moduldagidek (`brauzer_id`, brauzer xotirasida); «Hisobni o'chirish» — saytdagi akkaunt bo'limida; qadamlar — saytingizdagi 3–5 qadam.
  3. **Ishga tushirish** — agent avval ikki ro'yxatni ko'rsatadi: akkauntlar (beriladigan login, olib tashlanadigan ustun) va hisob o'chirilganda nima o'chishi. Tekshirib, qaysilari namuna ekanini ayting va «Davom et» deb yozing — agent taxmin qilmaydi.
     - `git diff`: o'zgarish agent aytgan fayllardami. Keyin `git status` → har faylni `git add <fayl>` bilan → `git commit -m "7-dars: login, hisobni o'chirish, qadamlar sanog'i"` → `git push`;
     - Render sahifangizda yangi deploy tugashini kuting (bir necha daqiqa cho'zilishi mumkin). Mobil trekda `npx expo start`, QR'ni Expo Go bilan oching (bitta Wi-Fi; bo'lmasa `--tunnel`); web-trekda `npm run dev`.
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — agent nima desa ham, o'zingiz tekshiring:
     - (1) «Hisobdan chiqish» → «Ro'yxatdan o'tish»: telefon so'ralmaydi, forma ostida gap va «Maxfiylik siyosati» havolasi bor (sahifaning o'zi Amaliyot 2 da qo'shiladi). Ism `tekshiruv`, login `tekshiruv1` bilan ro'yxatdan o'ting — bu tekshiruv akkaunti, haqiqiy odamniki emas.
     - O'sha login bilan yana urinib ko'ring: «Bu login band» chiqishi kerak. Keyin asosiy harakatni qiling (Mentor misolida — «Qo'shilaman»).
     - (2) Neon SQL Editor'da: `SELECT login, namuna FROM oyinchilar;` → «Run»: siz namuna degan akkauntlar yonida `true`, `tekshiruv1` yonida `false` bo'lishi kerak. So'ng `SELECT nom, COUNT(DISTINCT qurilma_id) FROM hodisalar GROUP BY nom;` — bosib o'tgan har qadam yonida 1.
     - (3) «Hisobni o'chirish» → «Rostdan o'chirasizmi?» → tasdiqlang. `SELECT * FROM oyinchilar WHERE login = 'tekshiruv1';` — javob bo'sh bo'lishi kerak; tekshiruv akkaunti o'zini o'chirdi, qo'lda `DELETE` yozmaysiz.
     - Tekshiruv hodisalari: `SELECT DISTINCT qurilma_id FROM hodisalar;` — hozircha faqat o'z qurilmangiz; uni nusxalab: `DELETE FROM hodisalar WHERE qurilma_id = '{qurilma ID}';` — jadval bo'sh, o'lchov odamlar uchun tayyor.
     - Belgilang (o'zingiz): Ma'lumot: (1) va (3) o'tdi · O'lchov: (2) o'tdi («Bajardim» «Ma'lumot» belgisidan keyin ochiladi)
     - (mobil trek) Mobil trekda — o'rnatish faylini tayyorlash (oxirgi ish; faqat (1) o'tgandan keyin): `eas.json` dagi `preview` profilida `env` → `EXPO_PUBLIC_API_URL` bormi? Bo'lmasa agentga: «`eas.json` dagi `preview` profiliga `env` qo'sh: `EXPO_PUBLIC_API_URL` — qiymati `mobil/.env` dagidek (u maxfiy emas). Boshqa qiymat qo'shma.»
     - (mobil trek) Keyin `cd mobil` → `eas build -p android --profile preview`. Terminal fayl tayyor bo'lishini kutib turadi — kutish shart emas: u bergan sahifa havolasini saqlab qo'ying va Amaliyot 2 ga o'ting (Mentor misolida navbat ≈25 daqiqa bo'lgan; sizda boshqacha bo'lishi mumkin).
     - (mobil trek) Keyin ilovada xato topilib tuzatilsa — fayl qayta tayyorlanadi: tayyor fayl o'zi yangilanmaydi.
- O'ng tomon — kutilgan natija · namuna: Maydon Jamoa (bir marta o'zi yuradi):
  - telefon «Ro'yxatdan o'tish» — Ism · Login · Parol · tugma · forma ostidagi gap · «Maxfiylik siyosati» → keyingi kadr: «Hisobdan chiqish» · «Hisobni o'chirish» → «Rostdan o'chirasizmi?»
  - karta «Neon · SQL Editor»: `SELECT login, namuna FROM oyinchilar;` · ali · true · tekshiruv1 · false · `SELECT nom, COUNT(DISTINCT qurilma_id) …` · ochdi 1 · royxatdan-otdi 1 · qoshildi 1
  - (mobil trek) terminal: `eas build -p android --profile preview` · navbatda · sahifa havolasi
- Bajarilgach: Ilovangiz faqat keraklisini so'raydi va qadamlarni sanaydi; o'rnatish fayli navbatda. (web-trekda: Saytingiz faqat keraklisini so'raydi va qadamlarni sanaydi.)
- Ulgurmasangiz: Vaqt tugayaptimi — push'dan keyin avval (1) ni tekshiring (ro'yxatdan o'tish, «Bu login band», asosiy harakat); o'tsa — o'rnatish faylini boshlang, (2)–(3) — navbat paytida. Xato topilsa — fayl qayta tayyorlanadi. Agent ishi tugamagan bo'lsa — fayl, havola va post uyga qoladi (yakun shuni aytadi).
- Web-trek: o'sha talab — «ilova» o'rnida saytingiz, qurilma ID o'rnida brauzer ID; ishga tushirish `npm run dev`, tekshirish — brauzerda; o'rnatish fayli yo'q — 4-bo'lim (3) dan keyin «Bajardim».
- Pastki qator: Ortda qoldingizmi — Mentor misolini alohida papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-07-done` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — qanday ishlashini ko'rasiz, o'z repo'ngizdagi bo'limni shunga qarab qaytarasiz (`mobil/.env` ga o'z Render manzilingizni yozasiz; o'rnatish faylini o'z Expo akkauntingizda tayyorlaysiz).
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 7 · Amaliyot 2
- Eyebrow: Amaliyot 2 · siyosat va havola
- Sarlavha: Siyosat saytda, *havola lendingda tursin.*
- Mentor: Endi «Nima uchun» qatorini o'zingiz yozasiz — har ma'lumot nega kerakligini siz bilasiz; «1 · Ochish»dan boshlang. (bo'limlar orasida va blok tugagach — 6-ekrandagidek)
- Trekingiz: Mobil trek · Web-trek (trek hali tanlanmagan bo'lsa)
- Bo'limlar:
  1. **Ochish** — Amaliyot 1 push qilingan, mobil trekda o'rnatish fayli navbatda. Ilovangiz so'raydigan har ma'lumot uchun bitta gap tayyorlang: u nima uchun kerak. Siyosatning qolgan uch javobini agent koddan topadi, siz tekshirasiz.
  2. **Prompt** — «Nima uchun» qatorini o'zingiz yozing, «Nusxalash»ni bosing, Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · ✎ · Nusxalash):
       > Qayerda: `lending/` — yangi `maxfiylik.html` va «Qanday qo'shilaman» bo'limi; ilovaning brauzer ko'rinishi; Backend — qaysi manzillardan so'rov qabul qilinishi.
       > Nima qilsin: 1) `lending/maxfiylik.html` — maxfiylik siyosati, to'rt savol: qaysi ma'lumot · nima uchun · kim ko'radi · qancha saqlanadi. «Qaysi ma'lumot», «kim ko'radi» va «qancha saqlanadi» javoblarini koddan top va qaysi faylga qarab yozganingni ayt; kodda yo'q narsani yozma — koddan bilib bo'lmaydigan joyni (masalan, Database'ni kim ko'radi) «[savol]» deb qoldir, uni men yozaman.
       > Nima uchun: {nima uchun}
       > 2) Ilova brauzerda ham ochilsin (`npx expo export -p web`, natija `dist` papkasida): brauzerda token `localStorage` da saqlansin, eslatma brauzerda rejalashtirilmasin; `public/_redirects` fayliga `/*    /index.html   200`. Brauzer uchun paket yetishmasa — `npx expo install` bilan qo'sh va qaysi paket ekanini ayt.
       > 3) «Qanday qo'shilaman» bo'limiga ikki havola tayyorla: «Android: ilovani o'rnatish» va «iPhone: brauzerda ochish» — manzillarni keyin aytaman. Ostiga ikki qator: «Android o'rnatishda ogohlantirish ko'rsatadi — ilova do'kondan emas, to'g'ridan-to'g'ri o'rnatiladi.» va «iPhone'da eslatma hozircha yo'q.» Manzili hali yo'q havola o'rnida eski qator qolsin.
       > Nima buzilmasin: telefondagi ilova avvalgidek ishlasin — token telefonda oldingi joyida, eslatma telefonda ishlayversin; lending sarlavhasi, foydalar, «Qo'shilmoqchiman» tugmasi va Umami o'zgarmasin. `.env` ga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam (bosilsa ochiladi; yorliq «Mentor misoli»):
       - Nima uchun: Ism — o'yindagi o'yinchilar bir-birini tanishi uchun. Login va parol — hisobga kirish uchun. Qadamlar sanog'i — ilovaning qaysi joyi tushunarsizligini bilish uchun.
       - Web-trek: 2 va 3-bandlarni o'chiring — lendingdagi asosiy tugma saytingizga olib boradi (1-darsdan shunday).
  3. **Ishga tushirish**
     - (mobil trek) mobil trekda: `cd mobil` → `npx expo export -p web` → `dist` papkasini Netlify'ga yangi sayt qilib chiqaring (9-Modulda sayt chiqargansiz; buyruq bilan: `netlify deploy --prod --dir dist` — `--prod` siz sinov manzili chiqadi).
     - (mobil trek) Manzil chiqqach, agentga: «Brauzer ko'rinishi manzili: {manzil}. Backend shu manzildan so'rovlarni qabul qilsin (`WEB_ORIGIN`); lendingdagi «iPhone: brauzerda ochish» — shu manzil.»
     - Keyin `git status` → `git add <fayl>` → `git commit -m "7-dars: maxfiylik siyosati va brauzer ko'rinishi"` → `git push` — Render va lending yangilanadi (bir necha daqiqa cho'zilishi mumkin).
     - Tekshiring: lendingdan «Maxfiylik siyosati»ni oching — to'rt savolga javob bormi; har gapni agent ko'rsatgan fayl bilan solishtiring. Kodga mos kelmagan gapni agentga yozing: «Shu gap kodga mos emas: {gap}. Tuzat.» Agent «[savol]» qoldirgan joylarni o'zingiz yozing (Mentor misolida: «Database'ni faqat ilova egasi ko'radi.» — buni Mentor biladi, kod aytmaydi).
     - (mobil trek) Telefon brauzerida brauzer ko'rinishi manzilini oching: «Kirish» va «O'yinlar» ko'rinishi kerak. Ko'rinmasa — iPhone qatori eski matn bilan qoladi, Android yo'li ishlayveradi; xato qatorini agentga yuboring (`.env` qiymatlarini emas).
     - Kulrang qator: Bu sahifa yuridik hujjat emas — u ilovangiz haqiqatda nima qilishini aytadi.
     - Xato bo'lsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Havola va post** — tartib bilan; ulgurmaganingiz uyga qoladi:
     - **(1) O'rnatish fayli**
       - (mobil trek) terminal bergan sahifani oching. Fayl tayyor bo'lsa, havolasini agentga: «Android havolasi: {APK havolasi}. Lendingdagi «Android: ilovani o'rnatish» shu manzilga olib borsin.» → `git push`.
       - (mobil trek) Telefonda lendingni oching: «Qo'shilmoqchiman» → «Android: ilovani o'rnatish» — fayl yuklanadi, o'rnatishda ogohlantirish chiqishi kerak. Havolani boshqa telefonda yoki brauzerning yashirin oynasida ham oching — fayl Expo akkauntisiz yuklanishi kerak; yuklanmasa, havolani lendingda qoldirmang va xato qatorini agentga yuboring.
       - (mobil trek) Tanlang: Android havolasi lendingda · Fayl hali navbatda — (ikkinchisida havola va post uyga qoladi). Havola faqat Amaliyot 1 dagi «Ma'lumot» belgisi qo'yilgan ilova uchun qo'yiladi.
       - (web-trek) lendingdagi asosiy tugma saytingiz manziliga olib borishini tekshirib, «havola lendingda» deb belgilaysiz. · Havola lendingda
     - **(2) Post**
       - (havola lendingda bo'lsa) — 6-darsdagi postingiz shu yerda (to'rt qator: kim uchun · nima foyda · bitta harakat · halol holat); «bitta harakat» va «halol holat» qatorlarini bugungi holatga moslang: nima tayyor — shuni yozing. Havola oxiriga kanal belgisi (`?kanal=sinf`).
       - Post maydoni (yorliq: post · Nusxalash; bo'sh bo'lsa ipucha: kim uchun · nima foyda · bitta harakat · halol holat)
       - Xavfsizlik ro'yxati (6-darsdagi olti band, so'zma-so'z — belgilab chiqing):
         - 1) «Faqat o'zim a'zo bo'lgan joyga yuboraman.»
         - 2) «Guruhga yuborishdan oldin egasidan ruxsat so'radim.»
         - 3) «Postda familiya, maktab raqami, telefon va uy manzili yo'q.»
         - 4) «Postni yuborishdan oldin ota-onamga ko'rsatdim.»
         - 5) «Bitta xabarni ko'p guruhga tashlamayman, notanish odamga shaxsiy xabar yozmayman.»
         - 6) «Soxta akkaunt va sotib olingan obunachi ishlatmayman.»
         - Ro'yxat ostida: Uchrashuv taklifi kelsa — faqat kattalar bilan. Yangi akkaunt ochish shart emas.
       - Sinf chatiga: postni Mentorga ko'rsating, u aytsa yuboring (2-band shu bilan; ota-ona bandi — sinf chati uchun shart emas). Mahalla guruhi kabi boshqa kanalga — uyda, ota-onangizga ko'rsatib va guruh egasining ruxsati bilan.
       - Tanlang: Yuborildi · Uyda yuboraman («Yuborildi» havola lendingda bo'lganda ochiladi)
       - Yordam (bosilsa ochiladi; yorliq «Mentor misoli»): Maydon Jamoa chiqdi. Shanba, 18:00 o'yini ilovada turibdi — «Qo'shilaman» ni bosing, nechta odam yig'ilgani ko'rinadi. Android va iPhone uchun havola: {lending manzili}
     - **(3) Sanoq**
       - dars oxirida. Neon SQL Editor'da: `SELECT COUNT(*) FROM oyinchilar WHERE namuna = false;` → «Run» — ro'yxatdan o'tganlar (namuna va tekshiruv akkauntlarisiz).
       - Asosiy harakat — agentga: «Neon SQL Editor uchun bitta `SELECT` yoz, o'zing ishga tushirma: `namuna = false` akkauntlardan nechtasi {asosiy harakat — masalan: hozir kamida bitta o'yinda qatnashayotgan yoki o'yin e'lon qilgan}. Jadvallarni o'zgartirma.» — SQL'ni o'qib, «Run».
       - `tekshiruv1` qolgan bo'lsa — avval «Hisobni o'chirish» bilan o'chiring. Sonlarni kiriting:
       - Hozirgacha ro'yxatdan o'tgan · shundan sinfdosh (ipucha: bilsangiz — ixtiyoriy) · Asosiy harakatni qilgan
       - Son kiritilgach: sana o'zi yoziladi: <bugungi sana>
- O'ng tomon — kutilgan natija · namuna: Maydon Jamoa (bir marta o'zi yuradi):
  - brauzer `…/maxfiylik.html` — maxfiylik sahifasi (yuqorida, to'rt savol) → keyingi kadr: lending «Qanday qo'shilaman» — ikki havola, ikki kulrang qator, pastda «Maxfiylik siyosati»
  - ikki sanoq kartasi: Ro'yxatdan o'tgan: 20 — 11 tasi sinfdosh · Asosiy harakatni qilgan: 8
  - kulrang qator: sonlar Mentor misolidan — sizda boshqacha bo'ladi.
- Bajarilgach (holatga qarab):
  - havola lendingda va «Yuborildi»: Siyosat saytda, havola lendingda, post yuborildi.
  - havola lendingda, post yuborilmagan: Siyosat saytda, havola lendingda. Postni ota-onangizga ko'rsatib yuborasiz.
  - havola yo'q: Siyosat saytda. Android havolasi va post — fayl tayyor bo'lgach, uyda.
- Ulgurmasangiz: Siyosat sahifasi push qilinsa yetadi — brauzer ko'rinishi, havola va post uyga qoladi; yakun sarlavhasi nima qolganini aytadi.
- Web-trek: brauzer ko'rinishi va o'rnatish fayli yo'q — 3-bo'limda faqat siyosat; 4-bo'lim (1) da lendingdagi asosiy tugma saytingiz manziliga olib borishini tekshirib, «havola lendingda» deb belgilaysiz; `hodisaYoz` — Amaliyot 1 da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 8 · Yakuniy savol
- Eyebrow: Yakuniy tekshiruv
- Savol ustida: ikki kichik sanoq kartasi — Ro'yxatdan o'tgan: ? · Asosiy harakatni qilgan: ?
- Savol: Jadvalda 14 akkaunt: 3 tasi namuna va tekshiruv, 6 tasi sinfdosh. *Qanday aytasiz?*
  - ✔ 11 kishi, shundan sinfdoshlar alohida aytiladi
  - 14 kishi, shundan sinfdoshlar alohida aytiladi
  - 5 kishi, chunki sinfdoshlar sanoqqa kirmaydi
  - 11 kishi, sinfdoshlarni aytish shart emas
- Javob izohlari:
  - To'g'ri: Namuna va tekshiruv sanalmaydi; sinfdoshlar — alohida.
  - B: Namuna va tekshiruv akkauntlari haqiqiy foydalanuvchimi?
  - C: Sinfdoshlar ham ro'yxatdan o'tgan. Ular qanday aytiladi?
  - D: Son to'g'ri. Nechtasi sinfdosh — eshitgan odam biladimi?
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 9 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 10 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring.*
- Birinchi bosishgacha: Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon | Orqadagi izoh |
|---|---|---|
| Bu darsda 50 foydalanuvchiga reja nechta bosqichdan iborat? | Uchta: har bosqichda kanal, nima yuboriladi, kutilgan son va qachon | Bu kurs qolipi; boshqa rejada bosqichlar soni boshqa bo'lishi mumkin |
| Rejadagi kutilgan son nima? | Taxmin: shuncha kishi yig'ilishi kutilyapti | Haqiqiy son ishga tushirilgandan keyin sanaladi |
| Qaysi ikki son yonma-yon aytiladi? | Ro'yxatdan o'tgan va asosiy harakatni qilgan | Mentor misolida ishga tushirish kuni: 20 va 8 |
| Sinfdoshlar sanoqqa kiradimi? | Ha, lekin alohida aytiladi | Mentor misolida: 20 kishi, 11 tasi — sinfdosh |
| Namuna va tekshiruv akkauntlari sanaladimi? | Yo'q | Mentor misolida ular `namuna` belgisi bilan ajratiladi; soxta akkaunt ham yo'q |
| Havola yuborishdan oldin bu darsda qaysi uch narsa tekshiriladi? | Ma'lumot, o'lchov va havola | Faqat kerakli minimum so'raladimi, qadamlar sanaladimi, odam ilovani qanday ochadi |
| Login nima? | Ro'yxatdan o'tishda o'zingiz tanlagan nom | Mentor misolida telefon raqami so'ralmaydi — SMS yuborilmaydi |
| Qurilma ID nima? | Tasodifiy harf va raqamlar: bitta qurilmadagi ilovani ajratadi | Odamning ismini ham, loginini ham bildirmaydi |
| Mentor misolida ilova qaysi to'rt qadamni sanaydi? | Ochdi, ro'yxatdan o'tdi, qo'shildi, kelishini tasdiqladi | Har qadamda turli qurilmalar soni |
| APK nima? | Android telefonga o'rnatiladigan ilova fayli | O'rnatishda ogohlantirish chiqadi: ilova do'kondan emas |
| Brauzer ko'rinishi nima? | Mobil ilovaning brauzerda ochiladigan ko'rinishi | Mentor misolida iPhone'li foydalanuvchilar uchun; unda eslatma hozircha yo'q |
| «Hisobni o'chirish» bosilsa nima o'chadi? | Akkaunt va uning qatnashuv yozuvlari | Siyosatdagi «o'chirish» gapi kodda bor |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni
- Eyebrow: Dars yakuni
- Belgi: Dars tugadi · N/2 to'g'ri
- Sarlavha (holatga qarab):
  - ma'lumot, o'lchov, havola belgilangan va post yuborilgan: Ilovangiz *odamlarga yuborildi.*
  - ma'lumot, o'lchov, havola belgilangan, post yuborilmagan: Havola tayyor — *post yuborish qoldi.*
  - ma'lumot belgilangan, havola yoki o'lchov yo'q: Ilova tayyor — *havola va post qoldi.*
  - reja saqlangan, ma'lumot belgilanmagan: Reja tayyor — *uch tekshiruv qoldi.*
  - reja saqlanmagan: Reja hali yozilmagan — *uch bosqichni yozing.*
- CODE STRIKE arenasi: 12 SAVOL · 15 SONIYA · PODIUM (jonli darsda mentor boshlaguncha: Mentorni kuting)
- Endi siz bilasiz:
  - Rejadagi kutilgan son — taxmin; haqiqiy son Database'dan sanaladi.
  - Ikki son yonma-yon aytiladi: ro'yxatdan o'tgan va asosiy harakatni qilgan.
  - Sinfdoshlar sanaladi, lekin alohida aytiladi; namuna va tekshiruv akkauntlari sanalmaydi.
  - Login — ro'yxatdan o'tishda o'zingiz tanlagan nom; telefon raqami mahsulotga kerak bo'lmasa, so'ralmaydi.
  - Qurilma ID bitta qurilmadagi ilovani ajratadi, odamning ismini ham, loginini ham bildirmaydi.
- Uyga vazifa · Amaliy topshiriqni bajarish → (ochilganda karta):
  - Uyda nima qilasiz?
  - Kim bilan: ota-onangiz va 1-bosqichdagi kanallar · Nechta: 1-bosqich to'liq · Muddat: keyingi darsgacha
  - ① Havola lendingda bo'lgach, postni olti bandli ro'yxat bo'yicha tekshiring, ota-onangizga ko'rsating va 1-bosqichdagi kanallarga yuboring (guruhga — egasidan ruxsat so'rab). Uchrashuv taklifi kelsa — faqat kattalar bilan.
  - ② Kechqurun Neon'da ikki sonni qayta sanang — hozirgacha ro'yxatdan o'tgan (`namuna = false`; sinfdoshlarni bilsangiz — alohida) va asosiy harakatni qilgan — va sanasi bilan yozib oling.
  - ③ (darsda qolgan ish bo'lsa) Darsda qolgan qismni tugating: qadamlar sanog'ini tekshiring · siyosat sahifasini kod bilan solishtiring · brauzer ko'rinishini chiqaring · o'rnatish fayli tayyor bo'lgach, Android havolasini lendingga qo'ying (holatga qarab — faqat qolganlari).
  - Keyingi dars — **«Foydalanuvchilar qaysi qadamda to'xtab qolyapti?»**
- Nishonlaringiz — N/4 (to'rtta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Nishonlar
- **Estimate Spotter!** — Rejadagi son taxmin ekanini birinchi urinishda topdingiz (3-ekran, birinchi urinishda to'g'ri)
- **Stage Planner!** — 50 foydalanuvchiga uch bosqichli rejangizni yozdingiz (5-ekran, «Saqlash»)
- **Data Minimum!** — Ro'yxatdan o'tishda faqat keraklisini qoldirib, qadamlar sanog'ini yoqdingiz (6-ekran, oxirgi «Bajardim»)
- **Launch Ready!** — Maxfiylik siyosatini saytga chiqarib, ikki sonni sanadingiz (7-ekran, oxirgi «Bajardim»)
- Yuqoridagi hisoblagich: N/4 (bosilsa: Badges — N/4 va to'rtta nishon nomi)
- Nishon olinganda: Yangi nishon · nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 3-ekran (1-savol) — **Kutilgan son**
   - 1 · Bu darsda reja uch bosqichdan iborat: kanal, nima yuboriladi, kutilgan son, qachon.
   - 2 · Kutilgan son — taxmin: shuncha kishi yig'ilishi kutilyapti.
   - 3 · Haqiqiy son ishga tushirilgandan keyin Database'dan sanaladi.
   - Sinfga savol: Rejadagi son bilan sanalgan son farq qilsa, qaysi biri o'zgaradi?
2. 8-ekran (yakuniy savol) — **Halol sanoq**
   - 1 · Ikki son yonma-yon aytiladi: ro'yxatdan o'tgan va asosiy harakatni qilgan.
   - 2 · Namuna va tekshiruv akkauntlari sanalmaydi.
   - 3 · Sinfdoshlar sanaladi, lekin alohida aytiladi.
   - Sinfga savol: Nega sinfdoshlar alohida aytiladi?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Qayta ishlash

1. Mentor rejasida 1-bosqich qayerdan boshlanadi?
    - ✔ Sinf chati va mahalla futbol guruhidan
    - Shahar bo'yicha katta futbol kanalidan
    - Notanish odamlarga shaxsiy xabardan
    - Sotib olingan obunachilar ro'yxatidan
2. Mentor misolida «asosiy harakatni qilgan» kim?
    - Ilovani telefoniga o'rnatib ochgan odam
    - ✔ O'yinga qo'shilgan yoki e'lon bergan odam
    - Lendingdagi tugmani bir marta bosgan odam
    - Postni o'qib, do'stiga yuborgan odam
3. Mentor nega telefon raqamini so'ramaydigan qildi?
    - Raqamni yozish uzoq vaqt oladi
    - Raqamni hamma yoddan bilmaydi
    - ✔ Mahsulotga raqam kerak emas
    - Raqam Database'ga sig'maydi
4. Bitta o'yinchi ilovani ikki telefonda ochdi. `ochdi` da nechta qurilma?
    - Bitta, chunki login bir xil
    - Bitta, chunki ism bir xil
    - Uchta, chunki uch marta ochdi
    - ✔ Ikkita, chunki ikki qurilma
5. Haqiqiy «ro'yxatdan o'tgan» soni qayerdan olinadi?
    - ✔ Database'dan, so'rov bilan
    - Rejada yozilgan kutilgan sondan
    - Lendingdagi tashriflar sonidan
    - Guruhdagi hamma a'zolar sonidan
6. «Hisobni o'chirish» tasdiqlansa nima bo'ladi?
    - Akkaunt qoladi, faqat parol o'chadi
    - ✔ Akkaunt va qatnashuv yozuvlari o'chadi
    - Ilova telefondan o'zi o'chib ketadi
    - Hamma o'yinchilarning akkaunti o'chadi
7. Maxfiylik sahifasidagi gapni nima bilan solishtirasiz?
    - Agentning hisoboti bilan
    - Boshqa ilova sahifasi bilan
    - ✔ Ilovangizning kodi bilan
    - Lending sarlavhasi bilan
8. Mentor misolida brauzer ko'rinishida hozircha nima yo'q?
    - O'yinlar ro'yxati
    - Qo'shilish tugmasi
    - Ro'yxatdan o'tish
    - ✔ O'yin eslatmasi
9. Agentga xato yuborganda nimani yuborasiz?
    - ✔ Xato chiqqan qatorning o'zini
    - `.env` faylidagi hamma qiymatni
    - Tokenni va xato chiqqan qatorni
    - Maxfiy kalitni va butun kodni
10. Guruhga post yuborishdan oldin nima qilasiz?
    - Yangi akkaunt ochib olasiz
    - ✔ Guruh egasidan ruxsat so'raysiz
    - Postni o'nta guruhga tashlaysiz
    - Postga telefon raqam qo'shasiz
11. `ochdi` hodisasi bilan Backend'ga nima boradi?
    - Hodisa nomi va o'yinchi logini
    - O'yinchi ismi va qurilma ID
    - ✔ Hodisa nomi va qurilma ID
    - O'yinchi logini va parol hash
12. Sinf chatidan keyin 12 kishi ro'yxatdan o'tdi, rejada 20 edi. Nima qilasiz?
    - Soxta akkaunt ochib, 20 ga yetkazasiz
    - O'zingiz yana sakkiz marta ro'yxatdan o'tasiz
    - Postni notanish guruhlarga tashlaysiz
    - ✔ Sonni yozib, keyingi bosqichga o'tasiz

## Kartochkalar
10-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 11-ekrandagi 5 qator.
- Keyingi dars — «Foydalanuvchilar qaysi qadamda to'xtab qolyapti?».
