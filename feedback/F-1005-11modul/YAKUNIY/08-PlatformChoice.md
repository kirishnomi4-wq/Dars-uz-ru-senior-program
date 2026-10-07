# 8-dars «Arxitektura va platforma: web yoki mobil ilova» — yakuniy matn

Fayl: `src/9-Modull/PlatformChoiceLesson.jsx` · 20 ekran · Keyingi dars: «React Native va Expo: prototip telefonda»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — «Maydon Jamoa chizmasi»: chapda telefon (yoki brauzer oynasi), o'rtada Backend tuguni, o'ngda Database tuguni (uch jadval kartasi).
Telefon ekranlari: O'yinlar (o'yin kartalari) · O'yin («‹ O'yinlar» · kun va soat · maydon · «8 / 10» · qo'shilganlar doiralari · «Qo'shilaman») · E'lon berish (Kun · Soat · Maydon · Nechta odam · «Yuborish»).
So'rov yo'lida konvert yuradi, yorlig'ida bir so'z: «e'lon», «so'rov», «javob».
Namuna o'yinlar (dars bo'yi bir xil):
- Shanba, 18:00 · Mahalla maydoni · 8 / 10
- Shanba, 20:00 · Maktab maydoni · 6 / 10
- Yakshanba, 10:00 · Park maydoni · 4 / 8
- Yakshanba, 17:00 · Mahalla maydoni · 9 / 10

## 0 · Kirish — ilova va sayt
- Eyebrow: Dars · kirish
- Sarlavha: Ilovada qo'shilgan o'yinchini *sayt qanday ko'rdi?*
- Mentor (boshida): Maydon Jamoa ilova ham, sayt ham bo'lishi mumkin — ilovada «Qo'shilaman» ni bosing, keyin saytni yangilang.
- Mentor (sayt yangilangach): Endi javoblardan birini tanlang.
- Maket (ikki maket yonma-yon):
  - telefon, ustida yorliq «ilova» — Maydon Jamoa, O'yin ekrani: ‹ O'yinlar · Shanba, 18:00 · Mahalla maydoni · 8 / 10 · qo'shilganlar doiralari · Qo'shilaman
  - brauzer oynasi, ustida yorliq «sayt» — o'sha O'yin sahifasi, «8 / 10»; manzil qatorida ↻ Yangilash (telefonda «Qo'shilaman» bosilgach faollashadi)
  - «Qo'shilaman» bosilgach: telefonda son 8 → 9, tugma «Qo'shildingiz»; brauzerda «8 / 10» qoladi. «Yangilash» bosilgach brauzerda ham «9 / 10».
- Sizningcha, qaysi biri? (variantlar sayt yangilangach ochiladi)
  - Ilova saytga xabar yubordi
  - Ikkalasi bitta joydan so'radi
  - Sayt telefondan o'qib oldi
- Javob izohlari:
  - «Ikkalasi bitta joydan so'radi» tanlansa: **Aynan!** Bu misolda o'yinlar bitta Backend va Database'da turadi — ilova ham, sayt ham shu yerdan so'raydi.
  - «Ilova saytga xabar yubordi» tanlansa: **Qiziq fikr!** Ilova saytni tanimaydi: ikkalasi ham o'yinlarni bitta Backend'dan so'raydi.
  - «Sayt telefondan o'qib oldi» tanlansa: **Qiziq fikr!** Telefon o'chiq bo'lsa ham, sayt shu sonni Backend'dan olishi mumkin — demak, u boshqa joydan oladi.
- Javobdan keyin: ikki maket ostida chizma chiqadi — ikkalasidan chiziq bitta Backend tuguniga, undan Database tuguniga; yorliqlar «ilova · ?» va «sayt · ?».
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun qismlarni chizib, *sayt yoki ilovani* tanlaysiz.
- Mentor: Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingiz uchun README'ga yozdirasiz.
- Chap — Dars oxirida: Maydon Jamoa chizmasi tayyor holatda — telefon «ilova · Expo» → «Backend · NestJS» → «Database · Neon» (uch jadval); telefonda uchta real vaqt nuqtasi; ostida: mobil — o'yinchi maydonda, qo'lida telefon
- Bugungi 4 qadam:
  1. Qismlarni chizish · qismlar
  2. Jadvallar va ustunlar · oyinlar
  3. Real vaqt nuqtalarini topish · real vaqt nuqtalari
  4. Platforma va stekni tanlash · stek — asoslangan tanlov
- Pastki qator: o'z repo'ngiz — `README.md` «Arxitektura» · Mentor misoli `maydon-jamoa` · tayyor holat `m11-dars-08-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Uch qism
- Eyebrow: Tushuncha · qismlar
- Sarlavha: E'lon yo'lida *har qism nima qiladi?*
- Mentor: Avval tashkilotchi telefonida «Yuborish» ni bosing, keyin o'yinchi telefonida «O'yinlar» ni oching.
- Bashorat (Avval o'zingiz belgilab ko'ring): E'lonni qaysi qism saqlaydi? · Ilova · Backend · Database
  - Tanlangach ixcham qator: Taxminingiz · savol · tanlov
- Chap — ikki telefon:
  - «tashkilotchi» — E'lon berish: Kun Yakshanba · Soat 10:00 · Maydon Park maydoni · Nechta odam 8 · Yuborish
  - «o'yinchi» — O'yinlar ro'yxati: Shanba, 18:00 · 8 / 10 — Shanba, 20:00 · 6 / 10 — Yakshanba, 17:00 · 9 / 10
- O'ng — chizma: Backend → Database. Qadamlar: 1 · E'lonni yuboring · 2 · Ro'yxatni oching
  - «Yuborish» → konvert «e'lon» Backend'ga (ichida «to'liqmi? ✓») → Database'ga («+1 e'lon»)
  - «O'yinlar» → konvert «so'rov» telefon → Backend → Database → «javob» qaytadi; ro'yxatga yangi karta: Yakshanba, 10:00 · Park maydoni · 0 / 8
  - Tugunlar ostida: ko'rsatadi · tekshiradi · saqlaydi
- Nom qatori: Qismlar va ular orasidagi so'rovlar chizilgan bu rasm — Maydon Jamoa chizmasi (arxitektura).
- Natija: «Taxminingiz to'g'ri chiqdi» yoki «Taxminingiz: … · haqiqatda: Database»
  - Bu misolda ham 9-Moduldagidek uch qism: ilova ko'rsatadi, Backend tekshiradi, Database saqlaydi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish

## 3 · Uch jadval
- Eyebrow: Tushuncha · jadvallar
- Sarlavha: Maydon Jamoa ma'lumotlari *qaysi jadvallarda* turadi?
- Mentor: Har bo'lak uchun uni saqlaydigan jadvalni bosing.
- Bashorat (Avval o'zingiz belgilab ko'ring): Maydon Jamoa'ga nechta jadval kerak? · Bitta · Uchta · Oltita
- Chap — telefon: joriy bo'lakka mos joy belgilanadi (E'lon berish · Ro'yxatdan o'tish: Ism · Telefon · Parol · O'yin ekranidagi qo'shilganlar).
- O'ng — Database: uch jadval kartasi `oyinchilar` · `oyinlar` · `ishtirokchilar`; `id` va `yaratilgan` ustunlari yonida: Database o'zi to'ldiradi
- Bo'laklar (bittadan chiqadi; hisoblagich «Joylandi: N / 6»):
  1. Kun, soat va maydon → `oyinlar`: `kun` · `soat` · `maydon`
  2. Nechta odam kerak → `oyinlar`: `kerak`
  3. Ism, telefon va parol → `oyinchilar`: `ism` · `telefon` · `parol_hash`
  4. O'yinni kim e'lon qilgani → `oyinlar`: `tashkilotchi_id`
  5. Kim qaysi o'yinga qo'shilgani → `ishtirokchilar`: `oyin_id` · `oyinchi_id`
  6. Qo'shildi, keladi, navbatda yoki chiqdi → `ishtirokchilar`: `holat`
- Boshqa jadval bosilsa:
  1. Kun va soat — o'yinniki, odamniki emas.
  2. Nechta odam kerakligini e'lon aytadi — u o'yinniki.
  3. Ism va parol — odamniki; u ko'p o'yinga qo'shiladi.
  4. E'lon bergan odam — o'yinning bir ma'lumoti.
  5. Bitta o'yinchi ko'p o'yinga qo'shiladi — alohida jadval.
  6. Holat har o'yinda boshqacha — u qo'shilishniki.
- `parol_hash` yonida: hash — paroldan yasalgan satr: undan parolni qaytarib bo'lmaydi
- Joriy qator: Boshqa jadvaldagi qatorni ko'rsatadigan ustun bog'lovchi ustun deyiladi; bu darsda ularning nomi `_id` bilan tugaydi.
- Natija: «Taxminingiz to'g'ri chiqdi» yoki «Taxminingiz: … · haqiqatda: Uchta»
  - Bu misolda uch jadval: kim — `oyinchilar`, qaysi o'yin — `oyinlar`, kim qaysi o'yinda — `ishtirokchilar`.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Bo'laklarni joylang (N/6) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: O'yin kartasida «8 / 10». 8 *qaysi jadvaldan* sanaladi?
  - `oyinlar` — o'yin qatoridagi son ustunidan
  - `oyinchilar` — ro'yxatdan o'tgan hamma odamdan
  - ✔ `ishtirokchilar` — shu o'yinga qo'shilganlardan
  - `oyinlar` — `kerak` ustunidagi qiymatdan
- Javob izohlari:
  - To'g'ri: 8 — shu o'yinga qo'shilganlar qatorlari, 10 esa `oyinlar` dagi `kerak` ustuni.
  - A: `oyinlar` da qo'shilganlar soni uchun ustun yo'q.
  - B: `oyinchilar` — hamma odam, bu o'yinga qo'shilmaganlar ham.
  - D: `kerak` — 10, ya'ni nechta odam kerakligi.
  - Umumiy: 8 — shu o'yinga qo'shilganlar qatorlari.
- Barcha testlarda umumiy yozuvlar: Javob tanlang → Davom etish · xato bo'lsa «Qaytadan urinib ko'ring» (tugma: To'g'ri javobni toping) · xato qilgan o'quvchiga: «Qisqa takrorlash — mavzuni yana bir ko'rish» · jonli darsda: «Jonli dars — bitta urinish, o'ylab bosing!» · «Javobingiz qabul qilindi» · «Hozir to'g'ri javobni bilib olasiz.» · xato qotsa: «To'g'ri javob: …»

## 5 · Boshqa odam o'zgartiradigan joylar
- Eyebrow: Tushuncha · real vaqt
- Sarlavha: Boshqa odam sabab *qaysi ma'lumot* o'zgaradi?
- Mentor: Ekran ochiq turibdi — har bo'lak uchun tanlang: «Ma'lumoti o'zgaradi» yoki «O'zgarmaydi».
- Chap — telefon «1-telefon · siz», O'yin ekrani: Shanba, 18:00 · Mahalla maydoni · 8 / 10 · qo'shilganlar doiralari · Qo'shilaman (joriy bo'lak belgilanadi; 4-bo'lakda — o'yin kuni, doiralarda «Kelaman» belgilari)
- Bo'laklar (bittadan; hisoblagich «Topildi: N / 3»), har birida ikki tugma — Ma'lumoti o'zgaradi · O'zgarmaydi:
  1. «8 / 10»
  2. «Shanba, 18:00 · Mahalla maydoni»
  3. Qo'shilganlar doiralari
  4. O'yin kunidagi «Kelaman» belgilari
- «O'zgarmaydi» to'g'ri bo'lgan joyda yorliq: e'londa yozilgan
- Adashganda: Kimdir qo'shilsa yoki tasdiqlasa, bu ma'lumot o'zgaradi. · Kun, soat va maydonni tashkilotchi e'londa yozgan.
- Nom qatori: Ekran ochiq turganda boshqa odam tufayli ma'lumoti o'zgarishi mumkin bo'lgan joy — real vaqt nuqtasi.
- Natija: Bu misolda uchta real vaqt nuqtasi: «8 / 10», qo'shilganlar va «Kelaman» belgilari.
- Tugmalar: Orqaga · Bo'laklarni saralang (N/4) → Davom etish

## 6 · Ekran qachon yangilanadi
- Eyebrow: Tajriba · so'rov
- Sarlavha: O'yinchi qo'shilsa, ekraningizdagi *son o'zgaradimi?*
- Mentor: Ikkinchi telefonda «Qo'shilaman» ni bosing va birinchisiga qarang.
- Bashorat (Avval o'zingiz belgilab ko'ring): Birinchi telefonda «8 / 10» qachon «9 / 10» bo'ladi? · O'zi, o'sha soniyada · Ilova qayta so'raganda
- Chap — ikki telefon: «1-telefon · siz» va «2-telefon · boshqa o'yinchi», ikkalasida Shanba, 18:00 · 8 / 10
- O'ng — chizma: Backend → Database (`ishtirokchilar`, «Shanba 18:00: 8 qator»). Qadamlar: 1 · Qo'shiling (2-telefon) · 2 · Pastga torting (1-telefon)
  - 2-telefonda «Qo'shilaman» → Backend («joy bormi? ✓») → `ishtirokchilar` ga yangi qator (9 qator) → 2-telefonda «9 / 10»; 1-telefonda «8 / 10» qoladi, yorliq «eski»
  - 1-telefonni pastga torting (yoki «Yangilash» tugmasi) → so'rov → javob → «9 / 10»
- Natija: «Taxminingiz to'g'ri chiqdi» yoki «Taxminingiz: … · haqiqatda: ilova qayta so'raganda»
  - Bu modulda ilova so'raganda yangilanadi: ekran ochilganda va pastga tortib yangilaganda.
  - Ekran o'zi yangilanadigan yo'llardan biri — WebSocket; roadmap'da u keyinroq ufqda, 12-Modulda.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Ekran ochiq. Uch o'yinchi «Kelaman» ni bosdi. Tashkilotchi *qachon ko'radi?*
  - ✔ Ekranni pastga tortib yangilaganda
  - Har bosishda o'sha soniyaning o'zida
  - Faqat o'yin tugaganidan keyin
  - O'yinchilar unga xabar yozganda
- Javob izohlari:
  - To'g'ri: Bu modulda ilova so'raganda yangilanadi: ekran ochilganda yoki pastga tortilganda.
  - B: Ekran o'zi yangilanishi — keyinroq ufqda, bu modulda emas.
  - C: Belgilar Database'da allaqachon bor — so'rash yetadi.
  - D: Xabar shart emas — belgilar Database'ga yozilgan.
  - Umumiy: Bu modulda ilova so'raganda yangilanadi.

## 8 · «Yangilash» bilan so'rash
- Eyebrow: Kod yozish · so'rov
- Sarlavha: Sonni qayta so'rab ko'rsatadigan *kod yozamiz*.
- Mentor: Kod oynasida telefon yo'q — pastga tortish o'rnida «Yangilash» tugmasi; ikki qatorni o'zingiz terib yozasiz, qo'lda yozganda o'rganiladi.
- Chap — vazifa:
  1. Sahifa ochilganda `korsat()` ni bir marta chaqiring.
  2. `yangila` tugmasi bosilganda `korsat` ishlasin: `addEventListener('click', …)`.
  3. Natija oynasida «Yangilash» ni ikki marta bosing — son 8 dan oshib borsin.
- Yordam (tugma): Son «…» bo'lib qolsa, `korsat();` qatori oxirida qavslar borligini tekshiring. Tugma ishlamasa — `addEventListener` ga `korsat` qavssiz beriladi.
- Tugma: Bajardim (ikki shart bajarilgach ochiladi)
- O'ng: Kompilyatorni ochish — Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.
  - Natija oynasi: Shanba, 18:00 · Mahalla maydoni · «… / 10» · Yangilash (shartlar bajarilgach: 8 → 9 → 10)
- Kod oynasi: app.js — ochilganda va «Yangilash» da so'rang
```html
<div class="oyin">
  <p>Shanba, 18:00 · Mahalla maydoni</p>
  <p class="hisob"><span class="son">…</span> / 10</p>
  <button class="yangila">Yangilash</button>
</div>
```
```js
// Backend o'rnida namuna (haqiqiy Backend emas):
// har so'rov navbatdagi javobni oladi —
// so'rovlar orasida boshqa o'yinchilar qo'shilgandek
let qoshilgan = 8;
function sora() {
  const javob = qoshilgan;
  if (qoshilgan < 10) qoshilgan = qoshilgan + 1;
  return javob;
}

const son = document.querySelector('.son');
const yangila = document.querySelector('.yangila');
function korsat() {
  son.textContent = sora();
}
// 1) sahifa ochilganda korsat() ni shu yerda chaqiring
// 2) «Yangilash» bosilganda korsat ishlasin — shu yerda
```
  - Shartlar: `korsat()` sahifa ochilganda bir marta chaqirilsin. · `yangila` ga `click` bilan `korsat` ulansin.
- Bajarilgach: Son ochilganda bir marta, keyin har «Yangilash» da so'raladi; so'ralmasa, eskisi turadi.
  - Telefon ilovasida «Yangilash» o'rnida — ro'yxatni pastga tortish.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 9 · 3-savol
- Eyebrow: Mashq · 3-savol
- Savol: «Yangilash» bosilganda son yangilansin. *Qaysi qatorni* qo'shasiz?
  - `son.addEventListener('click', korsat)`
  - `yangila.addEventListener('click', sora)`
  - `yangila.addEventListener('load', korsat)`
  - ✔ `yangila.addEventListener('click', korsat)`
- Javob izohlari:
  - To'g'ri: Tugma bosilganda `korsat` ishlaydi: u so'raydi va javobni ekranga yozadi.
  - A: `son` — yozuv, uni hech kim bosmaydi.
  - B: `sora` javob oladi, lekin ekranga yozmaydi.
  - C: `load` — ochilish hodisasi, tugma bosilishi emas.
  - Umumiy: Tugmaga `korsat` ulanadi.

## 10 · To'rt savol
- Eyebrow: Tushuncha · platforma
- Sarlavha: Maydon Jamoa *sayt bo'lsinmi yoki ilova?*
- Mentor: To'rt savolga Maydon Jamoa misolida javob bering — har javob bitta signal: qaysi tomonga tortadi?
- Bashorat (Avval o'zingiz belgilab ko'ring): Maydon Jamoa uchun qaysi biri? · Sayt — brauzerda · Ilova — telefonda
- Chap — telefon «ilova · ?»: Maydon Jamoa O'yinlar ro'yxati (to'rt namuna o'yin)
- O'ng — ikki ustun: web · mobil, o'rtada «teng». Ostida savol-karta bittadan:
  1. Foydalanuvchi signali · Foydalanuvchi mahsulotni qayerda ochadi? — ✔ Maydonda va yo'lda, telefonda (mobil) · Uyda, kompyuterda → O'yinchi o'yin oldidan maydonda — qo'lida telefon.
  2. Foydalanuvchi signali · Telefonning o'z imkoniyati kerakmi — kamera, joylashuv yoki telefonga keladigan eslatma? — ✔ Ha — o'yindan oldin eslatma (mobil; ostida: Mobil tomonga tortadi — web'da umuman yo'q degani emas.) · Yo'q — hammasi ekranda → PRD dagi «Keyin» ro'yxatida eslatma bor.
  3. Foydalanuvchi signali · Odamlar uni hech narsa o'rnatmasdan havoladan darhol ochishi muhimmi? — ✔ Ha — e'lonni Telegram guruhiga tashlash (web) · Yo'q — hech kim ulashmaydi → Hozir o'yinchilar Telegram guruhida yig'ilishadi.
  4. Qurish sharti · Qaysi stekni yaxshiroq bilasiz? — Hech birini → Kursda React'da ham, React Native'da ham yozgansiz. · ✔ Ikkalasini — React va React Native (teng)
- 4/4 dan keyin: mobil ustuni belgilanadi, telefon yorlig'i «ilova · mobil»; asos qatori: Mobil — o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak.
- Nom qatori: Mahsulot qayerda ishlashi platforma deyiladi: web — brauzerdagi sayt, mobil — telefon ilovasi.
- Natija: «Taxminingiz to'g'ri chiqdi» yoki «Taxminingiz: … · Mentor misolida: ilova — telefonda»
  - Bu misolda hal qiluvchi signal — o'yinchi maydonda, qo'lida telefon; havoladan ochish web tomonda qoldi.
  - Signallar sanalmaydi: asos qaysi signal muhimroq ekanini aytadi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Savollarga javob bering (N/4) → Davom etish

## 11 · 4-savol
- Eyebrow: Mashq · 4-savol
- Savol: Foydalanuvchilar mahsulotni kompyuterda ochadi, havola ulashadi. *Qaysi platforma?*
  - Mobil — telefon ko'pchilikning cho'ntagida
  - ✔ Web — kompyuterda ochiladi, havola ulashiladi
  - Web — sayt ilovadan chiroyliroq ko'rinadi
  - Mobil — eslatma telefonga kelishi mumkin
- Javob izohlari:
  - To'g'ri: Kompyuterda ochiladi va havola bilan ulashiladi — ikkala javob web tomonga tortadi.
  - A: Telefon bor, lekin bu odamlar mahsulotni kompyuterda ochadi.
  - C: Ko'rinish to'rt savolga kirmaydi.
  - D: Savolda eslatma kerak deyilmagan.
  - Umumiy: Ikkala javob web tomonga tortadi.

## 12 · Trek va stek
- Eyebrow: Tushuncha · stek
- Sarlavha: Web yoki mobil: *qaysi qism* boshqa texnologiyada?
- Mentor: Tanlangan platformadagi yo'lingiz trek deyiladi — mobil trek yoki web-trek; ikkalasini almashtirib ko'ring.
- Tugmalar: mobil trek · web-trek · hisoblagich «Ko'rildi: N / 2»
- Chizma: telefon (O'yinlar ro'yxati), Backend, Database
  - mobil trek: yorliq «ilova · Expo (React Native)», ostida «telefonda — Expo Go orqali»; Backend — NestJS · Render; Database — Neon (PostgreSQL)
  - web-trek: ramka brauzer oynasiga aylanadi, yorliq «sayt · React (Vite)», ostida «Netlify»; Backend va Database yonida: o'zgarmadi ✓
- Nom qatori: Birga ishlaydigan texnologiyalar to'plami — stek; 9-Modulda Maydon uchun ham stek tanlagansiz.
- Natija: Bu modulda trek faqat birinchi qismni almashtiradi: Backend va Database ikkala trekda bir xil.
  - Stek tanish bo'lsa, agent yozgan kodni o'zingiz tekshirasiz.
- Tugmalar: Orqaga · Ikki trekni ko'ring (N/2) → Davom etish

## 13 · Mahsulotingiz platformasi
- Eyebrow: Mustaqil ish · platforma
- Sarlavha: Mahsulotingiz uchun *platformani tanlang*
- Mentor: To'rt savolga o'z mahsulotingiz uchun javob bering, keyin trekni tanlab, asosini bir gapda yozing.
- Tepada qadamlar: 1 · 2 · 3 · 4 · Hal qiluvchi · Trek · Asos. Bir vaqtda bitta karta; o'ngda kichik ustunlar web · teng · mobil.
  1. Foydalanuvchi signali · 1 / 4 — Foydalanuvchingiz mahsulotni qayerda ochadi? · Yo'lda yoki ko'chada, telefonda · Uyda yoki darsda, kompyuterda · Ikkalasida ham
  2. Foydalanuvchi signali · 2 / 4 — Telefonning o'z imkoniyati kerakmi — kamera, joylashuv yoki eslatma? · Ha, kerak · Yo'q, kerak emas
  3. Foydalanuvchi signali · 3 / 4 — Odamlar uni hech narsa o'rnatmasdan havoladan ochishi muhimmi? · Ha, muhim · Unchalik emas
  4. Qurish sharti · 4 / 4 — Qaysi stekni yaxshiroq bilasiz? · React — sayt · React Native — ilova · Ikkalasini
  5. Hal qiluvchi — Qaysi signal qaroringizga eng ko'p ta'sir qiladi? (to'rt javobingizdan bir yoki ikkitasini bosasiz)
  6. Trek — Web-trek · Mobil trek
  7. Asos — Nega shu platforma? Bir gapda (masalan: o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak)
- Yordam (tugma): Bir savol boshqa tomonga tortsa, asosda mahsulotingiz uchun qaysi savol muhimroq ekanini yozing.
- Tugma: Saqlash · to'ldirilmagan bo'lsa: Javoblar, hal qiluvchi signal va asos kerak.
- Saqlangach: Platforma · mobil trek (yoki web-trek) · asos ✓
  - Platformangiz va asosingiz saqlandi — amaliyotda README'ga shu yoziladi.
- Tugmalar: Orqaga · Saqlang → Davom etish

## 14 · Qo'shilish yo'li (final)
- Eyebrow: Yakuniy · tartib
- Sarlavha: Qo'shilish boshqa telefonga *qaysi tartibda* yetadi?
- Mentor: Bo'laklarni bajariladigan tartibda joylang.
- Bo'laklar (ekranda aralash; to'g'ri tartib):
  1. O'yinchi «Qo'shilaman» ni bosadi
  2. Ilova Backend'ga so'rov yuboradi
  3. Backend o'yinda joy borligini tekshiradi
  4. Database `ishtirokchilar` ga qator yozadi
  5. Boshqa o'yinchi ekranni pastga tortadi
  6. Uning ekranida «9 / 10» ko'rinadi
- Uyalar: raqam va «bu yerga qo'ying»
- Xato: Tartib xato — bo'lakni bosib qaytaring.
- Yechilgach: Qo'shilish uch qismdan o'tadi; boshqa telefon uni qayta so'raganda ko'radi.
  - Oldin xato bo'lgan bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Davom etish

## 15 · Amaliyot 1 — README: qismlar va jadvallar
- Eyebrow: Amaliyot 1 · o'z repo'ngiz
- Sarlavha: README'ga chizma va *jadvallarni yozdiring*.
- Mentor: Hamma qadamni o'z mahsulotingiz bilan qilasiz, o'ngda — namuna; «1 · Ochish»dan boshlang.
  - Keyingi qadamlarda: Keyingi qadam — «N · …»: bajarib, «Bajardim»ni bosing. · Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — 7-darsdagi repo papkangizni Antigravity'da oching: `README.md` da talab va wireframe surati turibdi.
     - Papka bu kompyuterda yo'q bo'lsa — terminalda `git clone https://github.com/{login}/{repo}.git` · `cd {repo}`.
  2. **Prompt** — qavslarning bir qismi mustaqil ishdagi tanlovingiz va PRD'ingizdan to'ldirilgan; tekshiring, bo'sh qavsni o'zingiz yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - (tanlov va PRD saqlanmagan bo'lsa:) qavslarni o'z mahsulotingiz bilan to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Siz → Antigravity:
       > Qayerda: `README.md` — yangi «Arxitektura» bo'limi.
       > Nima qilsin: chizmani matn bilan chiz — uch qism va strelkalar: {ilova yoki sayt} → Backend → Database.
       > Asosiy funksiyalar: {uchta asosiy funksiya}. Saqlanadigan ma'lumotlar: {saqlanadigan ma'lumotlar}. Shular uchun Database jadvallarini yoz: har jadval nomi, ustunlari va har ustun nima saqlashi. Bog'lovchi ustunlar qaysi jadvalga bog'langanini yoz.
       > Nima buzilmasin: kod va papkalarga tegma — faqat `README.md` dagi yangi bo'lim. O'zgargan fayllarni ayt.
     - Qavslar yonida: masalan: ilova (Expo) · masalan: o'yin e'loni va qo'shilish; o'yin kuni tasdiq; chiqish va navbat · masalan: o'yinchilar; o'yinlar; kim qaysi o'yinga qo'shilgani
     - Yordam (tugma) — Mentor misolidagi to'liq talab:
       > Qayerda: `README.md` — yangi «Arxitektura» bo'limi.
       > Nima qilsin: chizmani matn bilan chiz — uch qism va strelkalar: ilova (Expo) → Backend → Database.
       > Asosiy funksiyalar: o'yin e'loni va qo'shilish; o'yin kuni tasdiq; chiqish va navbat. Saqlanadigan ma'lumotlar: o'yinchilar; o'yinlar; kim qaysi o'yinga qo'shilgani. Shular uchun Database jadvallarini yoz: har jadval nomi, ustunlari va har ustun nima saqlashi. Bog'lovchi ustunlar qaysi jadvalga bog'langanini yoz.
       > Nima buzilmasin: kod va papkalarga tegma — faqat `README.md` dagi yangi bo'lim. O'zgargan fayllarni ayt.
     - Tugma: Nusxalash → ✓ Nusxalandi
  3. **Ko'rish** — Antigravity'da `README.md` ni oching: «Arxitektura» bo'limida chizma va jadvallar bor. Agent boshqa faylni ham o'zgartirgan bo'lsa: «Faqat README.md ni o'zgartir, qolganini qaytar.»
  4. **Tekshirish** — har funksiyangizni oling va README'dan toping: u qaysi jadvalga nima yozadi? Talabning har qatori:
     - qayerda — o'zgargan fayl faqat `README.md`
     - nima qilsin — chizmada uch qism, har jadvalda ustunlar va izohi, bog'lovchi ustunlar bog'langan jadvali bilan, siz yozgan har ma'lumot jadvalda bor
     - nima buzilmasin — kod o'zgarmagan
     - Funksiya joy topmasa, agentga: «{funksiya} uchun jadvalda joy yo'q: {nima saqlansin}. Faqat README.md ni o'zgartir.»
- O'ng — kutilgan natija · namuna: Maydon Jamoa (README ko'rinishi):
  - Arxitektura
  - `ilova (Expo) → Backend (NestJS) → Database (Neon)`
  - `oyinchilar` — `id` · `ism` · `telefon` · `parol_hash`
  - `oyinlar` — `id` · `kun` · `soat` · `maydon` · `kerak` · `tashkilotchi_id` → `oyinchilar`
  - `ishtirokchilar` — `oyin_id` → `oyinlar` · `oyinchi_id` → `oyinchilar` · `holat` · `yaratilgan`
- Hammasi bajarilgach: README'da chizma va jadvallar: har funksiya o'z joyini oldi.
- Pastki qator: Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-08-done` — `README.md` dagi «Arxitektura» bo'limi. O'z README'ngizni shunga qarab to'ldirasiz.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 16 · Amaliyot 2 — README: real vaqt, platforma, stek va GitHub
- Eyebrow: Amaliyot 2 · o'z repo'ngiz
- Sarlavha: Real vaqt nuqtalari va platformani *README'ga qo'shing*.
- Mentor (platforma saqlangan bo'lsa): Platforma tanlovingiz allaqachon talabda — real vaqt nuqtalarini o'zingiz yozasiz; «1 · Ochish»dan boshlang.
- Mentor (saqlanmagan bo'lsa): Platforma va real vaqt nuqtalarini o'zingiz yozasiz; «1 · Ochish»dan boshlang.
- Qadamlar:
  1. **Ochish** — `README.md` ochiq, «Arxitektura» bo'limi ko'rinib turibdi. Prototipingizning eng ko'p ishlatiladigan ekranini eslang: unda boshqa odam nimani o'zgartiradi?
  2. **Prompt** — qavsni to'ldiring, platforma qatorini tekshiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Siz → Antigravity:
       > Qayerda: `README.md` — «Arxitektura» bo'limining oxiri.
       > Nima qilsin: «Real vaqt nuqtalari» kichik bo'limi: {real vaqt nuqtalari}; har biriga yoz: ilova uni {qachon so'raydi} so'raydi, ekran o'zi yangilanishi hozircha yo'q.
       > «Platforma» kichik bo'limi: {platforma va asos}. «Stek» kichik bo'limi: {ilova yoki sayt texnologiyasi}; Backend — NestJS va TypeORM, Render; Database — Neon (PostgreSQL).
       > Nima buzilmasin: faqat `README.md`; boshqa bo'lim va fayllarga tegma. O'zgargan fayllarni ayt.
     - Qavslar yonida: masalan: «8 / 10», qo'shilganlar ro'yxati, «Kelaman» belgilari · masalan: mobil — o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak
     - {qachon so'raydi} va {ilova yoki sayt texnologiyasi} trekdan yoziladi: mobil — ekran ochilganda va pastga tortib yangilaganda · ilova — Expo (React Native), telefonda Expo Go orqali; web — sahifa ochilganda va «Yangilash» bosilganda · sayt — React (Vite), Netlify (trek saqlanmagan bo'lsa — ikkalasi «masalan» bo'lib turadi)
     - Yordam (tugma) — Mentor misolidagi to'liq talab:
       > Qayerda: `README.md` — «Arxitektura» bo'limining oxiri.
       > Nima qilsin: «Real vaqt nuqtalari» kichik bo'limi: «8 / 10», qo'shilganlar ro'yxati, o'yin kunidagi «Kelaman» belgilari; har biriga yoz: ilova uni ekran ochilganda va pastga tortib yangilaganda so'raydi, ekran o'zi yangilanishi hozircha yo'q.
       > «Platforma» kichik bo'limi: mobil — o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak. «Stek» kichik bo'limi: ilova — Expo (React Native), telefonda Expo Go orqali; Backend — NestJS va TypeORM, Render; Database — Neon (PostgreSQL).
       > Nima buzilmasin: faqat `README.md`; boshqa bo'lim va fayllarga tegma. O'zgargan fayllarni ayt.
  3. **Ko'rish** — `README.md` da «Arxitektura» bo'limi to'liq: chizma · jadvallar · real vaqt nuqtalari · platforma · stek.
  4. **Tekshirish va GitHub** — talabning har qatori: har real vaqt nuqtasi yonida qachon so'rashi yozilgan · platforma va asos — siz saqlagandek · stek trekingizga mos · boshqa fayl o'zgarmagan.
     - Hammasi mos bo'lsa — repo papkasida `git status`: o'zgargan fayl faqat `README.md` bo'lsin; keyin `git add README.md`, `git commit -m "arxitektura va platforma"`, `git push`.
     - GitHub'da repo sahifasini yangilang — README'da «Arxitektura» bo'limi ko'rinadi. `git push` xato bersa: «Shu xato chiqdi: {xato}. Tuzat.»
- O'ng — kutilgan natija · namuna: Maydon Jamoa (README davomi):
  - Arxitektura · `ilova (Expo) → Backend (NestJS) → Database (Neon)`
  - **Real vaqt nuqtalari** — «8 / 10» · qo'shilganlar ro'yxati · «Kelaman» belgilari — ekran ochilganda va pastga tortib yangilaganda so'raydi
  - **Platforma** — mobil: o'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak
  - **Stek** — Expo (React Native) · NestJS + TypeORM, Render · Neon (PostgreSQL)
  - GitHub ko'rinishi: maydon-jamoa · `README.md` — «Arxitektura»
- Hammasi bajarilgach: README'da arxitektura to'liq: real vaqt nuqtalari, platforma va stek GitHub'da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.
- Birinchi bosishgacha: Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon | Izoh |
|---|---|---|
| Bu misolda qaysi uch qism bor? | Ilova, Backend va Database | Ilova ko'rsatadi, Backend tekshiradi, Database saqlaydi |
| Chizma (arxitektura) nimani ko'rsatadi? | Qismlar va ular orasidagi so'rovlar | Jadvallar — Database ostida |
| Maydon Jamoa'da qaysi uch jadval bor? | oyinchilar, oyinlar, ishtirokchilar | Kim · qaysi o'yin · kim qaysi o'yinda |
| «Qo'shilaman» bosilsa, qaysi jadvalga qator tushadi? | ishtirokchilar | `holat` — `qoshildi` |
| Bog'lovchi ustun nima? | Boshqa jadvaldagi qatorni ko'rsatadigan ustun | Masalan, `oyin_id` — `oyinlar` dagi o'yin |
| Real vaqt nuqtasi nima? | Ekran ochiq turganda boshqa odam tufayli ma'lumoti o'zgarishi mumkin bo'lgan joy | «8 / 10», qo'shilganlar, «Kelaman» belgilari |
| Bu modulda ilova qachon so'raydi? | Ekran ochilganda va pastga tortib yangilaganda | O'zi yangilanishi — 12-Modulda (WebSocket) |
| Kod oynasida «Yangilash» ga `korsat` qanday ulanadi? | yangila.addEventListener('click', korsat) | Telefonda — ro'yxatni pastga tortish |
| Platforma tanlovidagi to'rt savol qaysilar? | Qayerda ochadi · telefon imkoniyati · havola bilan ulashish · qaysi stek tanish | Natija: web yoki mobil + bir gapli asos |
| Mentor misolida platforma qaysi va nega? | Mobil | O'yinchi maydonda, qo'lida telefon; eslatma telefonga kelishi kerak |
| Stek nima? | Birga ishlaydigan texnologiyalar to'plami | Mobil trekda: Expo · NestJS · Neon |
| Bu modulda trek almashsa, qaysi qism o'zgaradi? | Faqat ilova yoki sayt | Backend va Database ikkala trekda bir xil |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Dars yakuni
- Eyebrow: Yakun
- Belgi (holatga qarab): ✓ Arxitektura tayyor (Amaliyot 2 bajarilgan) · ✓ Chizma tayyor (faqat Amaliyot 1) · belgisiz (Amaliyot 1 bajarilmagan) · N/5 to'g'ri
- Sarlavha (holatga qarab): Chizma tayyor, platforma asos bilan tanlandi. · Chizma tayyor — README ning qolgani uyda. · Platforma tanlandi — README uyda yoziladi.
- Bugungi asosiy fikr: Chizma qismlar, jadvallar va real vaqt nuqtalarini ko'rsatadi; bu modulda platforma faqat foydalanuvchi ochadigan qismni tanlaydi — Backend va Database ikkala trekda bir xil.
- CODE STRIKE arenasi: 12 SAVOL · 15 SONIYA · PODIUM (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Bu misolda uch qism: ilova ko'rsatadi, Backend tekshiradi, Database saqlaydi.
  - Funksiyalar qaysi ma'lumot saqlanishini ko'rsatadi; har qo'shilish — `ishtirokchilar` dagi bitta qator.
  - Real vaqt nuqtasi — ekran ochiq turganda boshqa odam tufayli ma'lumoti o'zgarishi mumkin bo'lgan joy.
  - Bu modulda ekran ochilganda va pastga tortib yangilaganda so'raydi.
  - Platforma signallar va asos bilan tanlanadi; bu modulda Backend va Database ikkala trekda bir xil.
- Uyga vazifa (Kim uchun — o'z mahsulotingiz · muddat — keyingi darsgacha):
  - **Tugatish** — README'dagi «Arxitektura» bo'limi to'liq bo'lsin: chizma, jadvallar, real vaqt nuqtalari, platforma va stek; GitHub'ga yuborilgan bo'lsin.
  - **Tekshirish** — PRD'dagi uchala funksiyani oling: har biri qaysi jadvalga nima yozadi? Joy topilmasa — agent bilan README'ga ustun qo'shing.
  - **Asos** — mahsulotingiz foydalanuvchisidan bitta odamga birinchi savolni bering: u mahsulotni qayerda ochardi? Javobi asosingizga zid bo'lsa — to'rt savolni qayta ko'ring; trek yoki asos o'zgarsa, darsdagi platforma kartasida ham, README'da ham yangilang.
- Keyingi dars — **«React Native va Expo: prototip telefonda»**: platforma tanlandi, endi prototipni shu platformada telefonda ochish navbati.
- Nishonlaringiz — N/4 (to'rtta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Nishonlar
- **Count Rows** — «8» qatorlardan sanalishini bildingiz (4-ekran, 1-savol)
- **Ask Again** — Ekran so'raganda yangilanishini bildingiz (7-ekran, 2-savol)
- **Platform Call** — Platformani to'rt savol bilan tanladingiz (11-ekran, 4-savol)
- **Architecture Ready** — Ikkala amaliyot blokini oxirigacha bajardingiz (16-ekran, oxirgi «Bajardim»)
- Yuqoridagi hisoblagich: Nishonlar — N/4
- Nishon olinganda: Yangi nishon · nomi va tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 4-ekran (1-savol) — **8 qatorlardan sanaladi**
   - Har qo'shilish — `ishtirokchilar` dagi bitta qator · `oyin_id · oyinchi_id · holat`
   - Shu o'yinga qo'shilganlar sanaladi — 8 · `holat: qoshildi`
   - 10 — `oyinlar` dagi `kerak` ustuni · `kerak: 10`
   - Sinfga savol: O'yinchi o'yindan chiqsa, «8 / 10» qanday o'zgaradi?
2. 7-ekran (2-savol) — **Ekran so'raganda yangilanadi**
   - 1 · Ekran ochilganda ilova Backend'dan so'raydi.
   - 2 · Pastga tortib yangilaganda yana so'raydi.
   - 3 · Ekran o'zi yangilanishi (WebSocket) — keyinroq ufqda, 12-Modulda.
   - Sinfga savol: Tashkilotchi ekranni yangilamasa, «Kelaman» belgilarini qachon ko'radi?
3. 9-ekran (3-savol) — **Tugmaga `korsat` ulanadi**
   - Ochilganda bir marta so'raladi · `korsat();`
   - Tugma bosilganda yana so'raladi · `yangila.addEventListener('click', korsat)`
   - `korsat` so'raydi va ekranga yozadi · `son.textContent = sora();`
   - Sinfga savol: `korsat()` ni ochilganda chaqirmasak, ekranda nima turadi?
4. 11-ekran (4-savol) — **To'rt savol**
   - 1 · Qayerda ochadi: yo'lda telefonda yoki uyda kompyuterda.
   - 2 · Telefon imkoniyati kerakmi · 3 · Havola bilan ulashish muhimmi.
   - 4 · Qaysi stekni yaxshiroq bilasiz — natija: web yoki mobil + bir gapli asos.
   - Sinfga savol: Savollar ikki tomonga tortsa, qanday tanlaysiz?
5. 14-ekran (final) — **Qo'shilish yo'li**
   - 1 · Bosish · 2 · So'rov · 3 · Backend tekshiradi
   - 4 · Database `ishtirokchilar` ga qator yozadi
   - 5 · Boshqa telefon pastga tortadi · 6 · «9 / 10» ko'rinadi
   - Sinfga savol: 5-qadam bo'lmasa, boshqa o'yinchi nimani ko'radi?

Podium savol yorliqlari: 1 — «8 / 10» qayerdan · 2 — «Kelaman» qachon ko'rinadi · 3 — «Yangilash» qatori · 4 — Platforma tanlovi · Yakuniy — qo'shilish yo'li

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Qayta ishlash

1. Maydon Jamoa'da yangi e'lonni qaysi qism saqlaydi?
   - ✔ Database — jadval qatorida
   - Backend — o'z kodi ichida
   - Ilova — telefon xotirasida
   - Telegram — guruh xabarida
2. Bitta o'yinchi ko'p o'yinga qo'shiladi. Bu qayerda yoziladi?
   - `oyinchilar` dagi bitta ustunda
   - ✔ `ishtirokchilar` dagi qatorlarda
   - `oyinlar` dagi bitta ustunda
   - Telefondagi o'yinlar ro'yxatida
3. `tashkilotchi_id` ustuni nimani ko'rsatadi?
   - O'yinga qo'shilgan o'yinchini
   - O'yin qaysi maydonda ekanini
   - ✔ O'yinni kim e'lon qilganini
   - Nechta o'yinchi kerakligini
4. Qaysi biri real vaqt nuqtasi?
   - O'yinning kuni va soati
   - O'yin maydonining nomi
   - E'lon berish formasi
   - ✔ Qo'shilganlar ro'yxati
5. Bu modulda ilova qachon Backend'dan so'raydi?
   - ✔ Ochilganda va pastga tortilganda
   - Faqat ilova birinchi o'rnatilgan kuni
   - Faqat telefon qayta yoqilganda
   - Har daqiqada o'zi, so'ramasdan
6. Kodda `korsat()` nega sahifa ochilganda chaqiriladi?
   - Tugma o'zi bosilib qolmasligi uchun
   - ✔ Son birinchi marta so'ralishi uchun
   - `sora` funksiyasi o'chib qolmasligi uchun
   - Sahifa tezroq ochilib ketishi uchun
7. Platforma nima?
   - Backend turadigan internet xizmati
   - Ekranlarning qog'ozdagi chizmasi
   - ✔ Mahsulot web yoki mobilda ishlashi
   - Database'dagi jadvallar to'plami
8. Foydalanuvchi mahsulotni yo'lda, telefonda ochadi. Bu javob qaysi tomonga tortadi?
   - Web tomoniga
   - Ikkalasiga teng
   - Hech qaysisiga
   - ✔ Mobil tomoniga
9. Havola bilan tez ulashish muhim. Bu javob qaysi tomonga tortadi?
   - ✔ Web tomoniga
   - Mobil tomoniga
   - Hech qaysisiga
   - Ikkalasiga teng
10. Mentor misolida platforma nega mobil?
    - Ilova saytdan chiroyliroq ko'rinadi
    - ✔ O'yinchi maydonda, qo'lida telefon
    - Faqat React Native tanish bo'lgan
    - Telegram guruhiga havola tashlanadi
11. Stek nima?
    - Mahsulot ochiladigan platforma
    - PRD dagi funksiyalar ro'yxati
    - ✔ Birga ishlaydigan texnologiyalar
    - Ilova ekranlari va tugmalari
12. Web-trekdan mobil trekka o'tsangiz, nima o'zgaradi?
    - Backend va Database ikkalasi
    - Faqat Database jadvallari
    - Uchala qism birdaniga almashadi
    - ✔ Foydalanuvchi ochadigan qism

## Kartochkalar
18-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 19-ekrandagi 5 qator.
- Keyingi dars — «React Native va Expo: prototip telefonda».
