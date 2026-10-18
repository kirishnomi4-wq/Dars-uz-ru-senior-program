# 5-dars «Ulanish uzilsa: buzamiz va tuzatamiz» — yakuniy matn

Fayl: `src/10-Modull/BreakAndFixLesson.jsx` · 19 ekran · Keyingi dars: «Birinchi foydalanuvchilar sizni qayerdan topadi?»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — «Maydon Jamoa» sahnasi: chapda «1-telefon · siz», o'rtada Backend («Database: 8»), o'ngda «2-telefon · boshqa o'yinchi»; telefonlar Backend bilan chiziq orqali ulangan (chiziq ustida «ochiq»).
Telefondagi «O'yin» ekrani: «‹ O'yinlar» va ulanish belgisi · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · qo'shilganlar doiralari (10 ta joy) · «Hozir ko'ryapti: N» · tugma «Qo'shilaman» (bosilgach — «Qo'shildingiz»).
Ulanish belgisi uch holatda: «Ulangan» · «Ulanmoqda…» · «Ulanmagan». Telefon holat qatorida samolyot tugmasi (uchish rejimi) bor ekranlarda u nom yonida turadi.
Jonli xabar (telefon ekrani tepasida): «Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10». Backend'dan telefonga uchadigan konvert yorlig'i — `oyin-ozgardi`.
Buzish yozuvi kartasi: usul nomi, uch qator «Nima qildim» · «Nima kutdim» · «Nima bo'ldi», belgi: «buzildi» · «buzilmadi» · «tuzatish qilindi» · «qayta tekshiruvda takrorlanmadi» · «qayta tekshiruvda yana buzildi».
Uch buzish usuli (tartib o'zgarmaydi): 1 · Internetni uzish · 2 · Fonga olib qaytarish · 3 · Backend'ning yangi versiyasi.

Mentor misolining buzish yozuvi (9, 11, 14, 15-ekranlarda bir xil):
- 1 · Internetni uzish — Nima qildim: Uchish rejimini yoqdim; belgi «Ulanmoqda…» bo'lgach agent tekshiruv akkauntidan «Shanba, 18:00» ga qo'shildi; keyin uchish rejimini o'chirdim. · Nima kutdim: Belgi «Ulangan» bo'lgach, «9 / 10» ko'rinadi. · Nima bo'ldi: Belgi «Ulangan», lekin «8 / 10» qoldi. · buzildi
- 2 · Fonga olib qaytarish — Nima qildim: Boshqa ilovaga o'tdim; shu payt agent tekshiruv akkauntidan qo'shildi; bir daqiqadan keyin qaytdim. · Nima kutdim: Qaytganimda «9 / 10» ko'rinadi. · Nima bo'ldi: Qaytganimda «9 / 10», belgi «Ulangan». · buzilmadi
- 3 · Backend'ning yangi versiyasi — Nima qildim: Render'da Backend'ni qayta chiqardim; belgi yana «Ulangan» bo'lgach, ikkinchi telefonda o'yinni ochdim va agent tekshiruv akkauntidan qo'shildi. · Nima kutdim: Bitta jonli xabar; ikkinchi telefonda «Hozir ko'ryapti: 2». · Nima bo'ldi: Jonli xabar ikki marta chiqdi; ikkinchi telefonda «Hozir ko'ryapti: 1». · buzildi

Tushuncha ekranlarida (2, 4, 6, 9, 11) umumiy tartib: tepada bashorat (yorliq «Avval o'zingiz belgilab ko'ring», tanlangach ixcham qator bo'lib natijagacha turadi), qadam belgilari tugma yonida, oxirida yashil quti — natija qatori («Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: …»), xulosa va izoh. Pastki tugma: Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/…) → Davom etish.
Test ekranlarida (3, 5, 7, 10) javobdan keyingi sarlavha: To'g'ri · Qaytadan urinib ko'ring · jonli darsda: Javobingiz qabul qilindi · urinish tugasa: To'g'ri javob: <harf> — <variant>.

## 0 · Kirish
- Eyebrow: Dars · kirish
- Sarlavha: Ulanish uzilsa ham ishlashini *qanday bilasiz*?
- Mentor:
  - boshida: Mentor misolida agent talabdagi uch chekka holatni «bajardim» dedi — ikkinchi telefonda «Qo'shilaman» ni bosing.
  - variantlar ochilgach: Endi o'ngdagi javoblardan birini tanlang.
- Maket: tepada agent chati pufagi — Antigravity: Tayyor! Talabdagi uchala chekka holatni bajardim.
- Ostida ikki telefon (ikkalasida belgi «Ulangan», «8 / 10», «Hozir ko'ryapti: 2»): 1-telefonda «Qo'shildingiz», 2-telefonda «Qo'shilaman» (halqada); pastda Backend «Database: 8».
- «Qo'shilaman» bosilgach: 2-telefonda «9 / 10», «Qo'shildingiz»; «Database: 9»; konvert `oyin-ozgardi` 1-telefonga keladi → «9 / 10» va tepada bitta jonli xabar: Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10. Shundan keyin variantlar faollashadi (oldin xira).
- Variantlar (ballsiz):
  - Hozir ishladi — uzilishda ham ishlaydi
  - Internetni o'zim uzib, natijaga qarayman
  - Agent «bajardim» dedi — shuning o'zi yetadi
- Javob izohlari:
  - «Internetni o'zim uzib, natijaga qarayman» tanlansa: **Aynan!** Chekka holat oddiy paytda ko'rinmaydi. Uni o'zingiz yuzaga keltirasiz va nima bo'lganiga qaraysiz.
  - «Hozir ishladi — uzilishda ham ishlaydi» tanlansa: **Qiziq fikr!** Hozir internet bor edi. Talabdagi chekka holat esa uzilishda bo'ladi — uni hali hech kim ko'rmadi.
  - «Agent «bajardim» dedi — shuning o'zi yetadi» tanlansa: **Qiziq fikr!** Agentning «bajardim» degani — da'vo. Natijani o'zingiz ko'rmaguningizcha, u tekshirilmagan.
- Javobdan keyin agent pufagi ostida kulrang yorliq: da'vo · tekshirilmagan
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun ilovangizni *buzib ko'rasiz va tuzatasiz*.
- Mentor: Avval Maydon Jamoa'da uch muammoni topib, sababini ko'rasiz. Keyin xuddi shuni o'z ilovangizda qilasiz.
- Chap — Dars oxirida: buzish yozuvi kartasi, qatorlar navbat bilan chiqadi — 1 Internetni uzish · 2 Fonga olib qaytarish · 3 Backend'ning yangi versiyasi (har birida bo'sh belgi joyi); ostida `BUZISH.md`
- O'ng — reja:
  1. Internet uzilganda nima ko'rinmay qolishini topish · uzilish
  2. Bitta o'zgarish nega ikki marta chiqishini bilish · takror hodisa
  3. Qayta ulangan ilova o'yin xonasiga qaytishi · qayta ulanish
  4. O'z ilovangizni buzish, tuzatish va qayta tekshirish · uchta muammo
- Pastki qator: o'z repo'ngiz — `BUZISH.md` va tuzatishlar · Mentor misoli `maydon-jamoa` · boshlanish `m12-dars-05-start` · namuna `m12-dars-05-done`
- Kulrang qator: Mentor misolida `m12-dars-05-start` — agent «bajardim» deganidan keyingi kod; muammolar shu darsda topiladi.
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Internet uzilsa
- Eyebrow: Tushuncha · uzilish
- Sarlavha: Internet qaytgach, ekranda *qaysi son* turadi?
- Mentor: Birinchi telefonda uchish rejimini yoqing va qadamlarni tartib bilan bajaring.
- Bashorat: Belgi yana «Ulangan» bo'lgach, birinchi telefonda qaysi son turadi? · «8 / 10» · «9 / 10»
- Sahna: 1-telefon (belgi «Ulangan», «8 / 10», «Qo'shildingiz», holat qatorida samolyot) · Backend «Database: 8» · 2-telefon («8 / 10», «Qo'shilaman»).
- Qadamlar:
  1. Uchish rejimini yoqing — samolyot bosilgach chiziq uziladi (boshida ↻), 1-telefonda belgi «Ulanmoqda…».
  2. Ikkinchi telefonda qo'shiling — «Qo'shilaman» → 2-telefonda «9 / 10», «Database: 9»; konvert `oyin-ozgardi` uzilgan joyda so'nadi, yonida yorliq «kelmadi»; 1-telefonda «8 / 10».
  3. Uchish rejimini o'chiring — ↻ chiziqni tiklaydi, belgi «Ulangan»; 1-telefonda «8 / 10» qoladi, yonida yorliq «eski»; «Database: 9» bir lahza yonadi.
- Nom qatori (3/3 dan keyin): Ilovaning chekka holatini ataylab yuzaga keltirib tekshirish — **buzish**.
- Natija qatori: Taxminingiz to'g'ri chiqdi ✓ · yoki: Taxminingiz ✕ — aslida: «8 / 10» — eski son
- Xulosa: Bu misolda uzilish paytida yuborilgan hodisa keyin kelmadi: belgi «Ulangan», son esa eski.
- Izoh: Tuzatish: qayta ulanganda ro'yxat Backend'dan qayta so'raladi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish

## 3 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: Internet qaytdi, belgi «Ulangan», son esa eski. *Nega?*
  - Backend qo'shilishni hali yozmagan edi
  - Ilova hodisani ikki marta sanagan edi
  - ✔ Uzilishdagi hodisa keyin kelmagan edi
  - Belgi ulanishni xato ko'rsatgan edi
- To'g'ri javob izohi: Bu misolda Backend uzilgan ilova uchun hodisani saqlamaydi — qayta ulangach ham u kelmaydi.
- Xato izohlari:
  - «Backend qo'shilishni hali yozmagan edi»: Sahnada «Database: 9» edi — qo'shilish yozilgan.
  - «Ilova hodisani ikki marta sanagan edi»: Ikki marta sanash uchun hodisa avval kelishi kerak.
  - «Belgi ulanishni xato ko'rsatgan edi»: Ulanish haqiqatan tiklangan — belgi to'g'ri edi.
  - boshqa holatda: Uzilish paytida yuborilgan hodisa keyin kelmaydi.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 4 · Qayta ulanish
- Eyebrow: Tushuncha · qayta ulanish
- Sarlavha: Qayta ulanganda *qaysi kod* yana ishlaydi?
- Mentor: Backend tugunidagi «Yangi versiya» ni bosing va telefon ostidagi kodning yonadigan qatorlariga qarang.
- Bashorat: Qayta ulangach, bitta qo'shilishga nechta jonli xabar chiqadi? · Bitta · Ikkita · Uchta
- Sahna: 1-telefon (belgi «Ulangan», «8 / 10») · Backend «Database: 8», ichida tugma «Yangi versiya» · 2-telefon («8 / 10», «Qo'shilaman»).
- Telefon ostida kod kartasi — Mentor ilovasi · `m12-dars-05-start`:
```js
ulanish.on('connect', () => {
  ulanish.on('oyin-ozgardi', () => {
    korsat();
    jonliXabar();
  });
});
```
  Ostida: Tinglovchilar: 1
- Qadamlar:
  1. Yangi versiya — Backend'da qator «yangi versiya ishga tushmoqda…»; ikkala chiziq uziladi, belgi «Ulanmoqda…», chiziqda urinish nuqtalari; keyin chiziq tiklanadi, belgi «Ulangan»; kod kartasida `ulanish.on('connect', …)`, so'ng ichidagi `ulanish.on('oyin-ozgardi', …)` qatori yonadi; «Tinglovchilar: 2».
     Nom qatori: Uzilgan ulanishni qayta tiklash — **qayta ulanish**: socket.io bunga o'zi urinadi, odatda bir necha soniyada.
  2. Ikkinchi telefonda qo'shiling — konvert `oyin-ozgardi` 1-telefonga keladi; ichki tinglovchi qatori ikki marta yonadi; 1-telefonda «9 / 10» va tepada jonli xabar ikki marta: Shanba, 18:00 — yana bir o'yinchi qo'shildi: 9 / 10
     Nom qatori: Bitta o'zgarish ilovaga ikki marta ta'sir qilishi — **takror hodisa**.
- Natija qatori: Taxminingiz to'g'ri chiqdi ✓ · yoki: Taxminingiz ✕ — aslida: ikkita
- Xulosa: `connect` ichidagi kod qayta ulanishda ham ishlaydi: tinglovchi uning ichida bo'lsa, yana bittasi qo'shiladi.
- Izoh: Tuzatish: tinglovchi bir marta qo'shiladi — `connect` dan tashqarida.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish

## 5 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Mentor misolida qayta ulangach jonli xabar ikki marta chiqdi. *Nega?*
  - ✔ Tinglovchi har ulanishda yana qo'shilgan
  - Backend bitta hodisani ikki marta yuborgan
  - Ikkinchi telefon tugmani ikki marta bosgan
  - Ilova ikkita alohida ulanish ochib qo'ygan
- To'g'ri javob izohi: `connect` qayta ulanishda ham ishlaydi — ichidagi tinglovchi har safar yana qo'shiladi.
- Xato izohlari:
  - «Backend bitta hodisani ikki marta yuborgan»: Sahnada Backend'dan nechta konvert chiqdi?
  - «Ikkinchi telefon tugmani ikki marta bosgan»: Ikkinchi telefonda bitta bosish bo'ldi — konvert ham bitta.
  - «Ilova ikkita alohida ulanish ochib qo'ygan»: Muammo ulanishlar sonida emas — tinglovchi qayta qo'shilgan.
  - boshqa holatda: `connect` ichidagi tinglovchi har qayta ulanishda yana qo'shiladi.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 6 · Xonaga qaytish
- Eyebrow: Tushuncha · xona
- Sarlavha: Qayta ulangan ilova *o'yin xonasida* bormi?
- Mentor: Avval «Yangi versiya» ni bosing, keyin ikkinchi telefonda o'yinni oching.
- Bashorat: Ikkinchi telefon o'yinni ochganda «Hozir ko'ryapti» nechani ko'rsatadi? · 0 · 1 · 2
- Sahna: 1-telefon (belgi «Ulangan», «8 / 10», «Hozir ko'ryapti: 1») · Backend «Database: 8», ostida «Xona `oyin-1`: 1» (bitta nuqta — 1-telefon ulanishi) va tugma «Yangi versiya» · 2-telefon — «O'yinlar» ro'yxati: «Shanba» ostida karta «Shanba, 18:00 · Mahalla maydoni · 8 / 10».
- Qadamlar:
  1. Yangi versiya — chiziqlar uziladi; nuqta xonadan chiqib ketadi: «Xona `oyin-1`: 0»; belgi «Ulanmoqda…» → ↻ → «Ulangan»; yangi ulanish Backend yonida, xonadan tashqarida turadi.
  2. Ikkinchi telefonda o'yinni oching — karta bosilgach «O'yin» ekrani ochiladi; konvert `oyin-ochildi` Backend'ga → «Xona `oyin-1`: 1» (2-telefon nuqtasi) → konvert `korayotganlar-ozgardi` 2-telefonga → 2-telefonda «Hozir ko'ryapti: 1»; 1-telefondagi «Hozir ko'ryapti: 1» yonida yorliq «eski».
- Natija qatori: Taxminingiz to'g'ri chiqdi ✓ · yoki: Taxminingiz ✕ — aslida: 1
- Xulosa: Uzilganda ulanish xonadan chiqdi; bu misolda qayta ulangan ilova xonaga o'zi qaytib kirmadi.
- Izoh: Tuzatish: qayta ulanganda ilova ochiq turgan o'yin xonasiga qayta kiradi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish

## 7 · 3-savol
- Eyebrow: Mashq · 3-savol
- Savol: Qayta ulangach «Hozir ko'ryapti» ekraningizni sanamadi. *Nega?*
  - Backend uzilgan ulanishni xonada qoldirgan
  - Ilova qayta ulangach o'yin ekranini yopgan
  - Ikkinchi telefon o'yin xonasidan chiqqan
  - ✔ Yangi ulanish o'yin xonasiga kirmagan
- To'g'ri javob izohi: Uzilganda ulanish xonadan chiqadi; bu misolda yangi ulanish xonaga o'zi kirmaydi.
- Xato izohlari:
  - «Backend uzilgan ulanishni xonada qoldirgan»: Uzilganda ulanish xonadan o'zi chiqadi.
  - «Ilova qayta ulangach o'yin ekranini yopgan»: Sahnada o'yin ekrani ochiq turgan edi.
  - «Ikkinchi telefon o'yin xonasidan chiqqan»: Ikkinchi telefon xonaga endi kirdi — u sanaldi.
  - boshqa holatda: Qayta ulangan ilova xonaga o'zi qaytib kirmaydi.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 8 · Tinglovchi bir marta
- Eyebrow: Kod yozish · tinglovchi
- Sarlavha: Tinglovchini bir marta qo'shadigan *kod yozamiz*.
- Mentor: Agent tinglovchini `connect` ichiga yozgan. Uni tashqariga chiqaring — `connect` ichida faqat qayta so'rash qolsin.
- Chap — vazifa (bajarilgan band oldida ✓):
  1. `ulanish.on('oyin-ozgardi', …)` ni `connect` ichidan tashqariga chiqaring — u bir marta qo'shilsin.
  2. `connect` ichida faqat `korsat()` tursin — qayta ulanganda son qayta so'ralsin.
  3. Natija oynasida: «Internetni uzish» → «Boshqa o'yinchi qo'shildi» → «Internetni qaytarish». Son «9 / 10» bo'lsin; yana «Boshqa o'yinchi qo'shildi» — bitta jonli xabar.
- Yordam (ochiladigan): Ikki `ulanish.on` bir-birining ichida turmaydi: ikkalasi ham qatorning eng chap chetidan boshlanadi. Jonli xabar ikki marta chiqsa — `oyin-ozgardi` tinglovchisi hali `connect` ichida.
- Tugma: Bajardim (ikki shart bajarilgach ochiladi)
- O'ng — tugma «Kompilyatorni ochish», ostida: Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.
- O'ng — Natija oynasi (shartlar bajarilgach faol, navbatdagi tugma halqada): belgi «Ulanmoqda…» / «Ulangan» · Shanba, 18:00 · Mahalla maydoni · «… / 10» · jonli xabarlar · tugmalar «Internetni uzish» · «Internetni qaytarish» · «Boshqa o'yinchi qo'shildi»
- Kod oynasi: eyebrow «Kod yozish» · sarlavha «app.js — tinglovchi bir marta, connect ichida qayta so'rash» · fayllar:
  - `app.js` (o'quvchi yozadi; boshlang'ich kod):
```js
const son = document.querySelector('.son');
const xabarlar = document.querySelector('.xabarlar');
function korsat() {
  son.textContent = sora();
}
function jonliXabar() {
  const p = document.createElement('p');
  p.textContent = "Shanba, 18:00 — yana bir o'yinchi qo'shildi: " + sora() + ' / 10';
  xabarlar.appendChild(p);
}
korsat();

// Agent yozgan kod: tinglovchi connect ichida qo'shilgan.
ulanish.on('connect', function () {
  ulanish.on('oyin-ozgardi', function () {
    korsat();
    jonliXabar();
  });
});
```
  - `index.html`:
```html
<p class="belgi">Ulanmoqda…</p>
<div class="oyin">
  <p>Shanba, 18:00 · Mahalla maydoni</p>
  <p class="hisob"><span class="son">…</span> / 10</p>
</div>
<div class="xabarlar"></div>
<button class="uzish">Internetni uzish</button>
<button class="qaytar">Internetni qaytarish</button>
<button class="boshqa">Boshqa o'yinchi qo'shildi</button>
```
  - `namuna.js` (o'qish uchun):
```js
// Backend va ulanish o'rnida NAMUNA (haqiqiy Backend emas):
// son shu faylda turadi; uchta tugma internetni uzadi, qaytaradi va hodisa yuboradi.
let qoshilgan = 8;
let ulangan = false;
function sora() {
  return qoshilgan;
}

const tinglovchilar = [];
const ulanish = {
  on: function (nom, kod) {
    tinglovchilar.push({ nom: nom, kod: kod });
  },
};
function yubor(nom, malumot) {
  tinglovchilar.forEach(function (t) {
    if (t.nom === nom) t.kod(malumot);
  });
}
function ulan() {
  ulangan = true;
  document.querySelector('.belgi').textContent = 'Ulangan';
  yubor('connect');
}
document.querySelector('.uzish').addEventListener('click', function () {
  ulangan = false;
  document.querySelector('.belgi').textContent = 'Ulanmoqda…';
});
document.querySelector('.qaytar').addEventListener('click', function () {
  if (!ulangan) setTimeout(ulan, 1000);
});
document.querySelector('.boshqa').addEventListener('click', function () {
  if (qoshilgan >= 10) return;
  qoshilgan = qoshilgan + 1;
  if (ulangan) yubor('oyin-ozgardi', { oyinId: 1, sabab: 'qoshildi' });
});

setTimeout(ulan, 500);
```
- Kod oynasidagi talablar: ulanish.on('oyin-ozgardi', …) ni connect ichidan tashqariga chiqaring — u bir marta qo'shilsin. · connect ichida faqat korsat() tursin — qayta ulanganda son qayta so'ralsin.
- Shart xabarlari: 'oyin-ozgardi' tinglovchisi bir marta qo'shilsin. · Qayta ulangach son o'zi «9 / 10» bo'lsin.
- «Bajardim» dan keyin:
  - Xulosa: Bu kodda tinglovchi bir marta qo'shiladi; `connect` esa har ulanishda sonni qayta so'raydi.
  - Izoh: Bu oynada `ulanish` — namuna: haqiqiy Backend emas, uzilishni tugma qiladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 9 · Uch usul va buzish yozuvi
- Eyebrow: Tushuncha · buzish yozuvi
- Sarlavha: Uch usuldan qaysilari *Mentor ilovasini buzadi*?
- Mentor:
  - boshida: Har urinishni bosing: kutilgani bilan bo'lganini solishtirib, belgi qo'ying.
  - uch urinishdan keyin: Uch urinish yozildi — pastdagi xulosaga qarang.
- Bashorat: Uch usuldan nechtasi Mentor ilovasini buzadi? · Bittasi · Ikkitasi · Uchalasi
- Chap — 1-telefon (belgi «Ulangan», «8 / 10»): urinishga qarab o'zgaradi — 1: samolyot yonadi, belgi «Ulanmoqda…», keyin «Ulangan», son «8 / 10» qoladi · 2: ekranni boshqa ilova (nomsiz kulrang oyna) yopadi, keyin «O'yin» qaytadi, «9 / 10» · 3: belgi «Ulanmoqda…» → «Ulangan», «9 / 10» va tepada ikkita jonli xabar.
- O'ng — tepada ixcham chiziq 1 · 2 · 3 (joriy usul nomi bilan); ostida buzish yozuvi kartasi (bittadan): usul nomi, «Nima qildim» · «Nima kutdim» · «Nima bo'ldi» (avval «…»), tugma «Urinishni ko'rish».
- «Urinishni ko'rish» → telefon usulni o'ynaydi → kartada Mentor yozuvining qatorlari yoziladi → tugmalar «Buzildi» · «Buzilmadi».
  - To'g'ri belgi: karta ixcham qatorga yig'iladi («N · usul · belgi»), keyingi urinish ochiladi.
  - Boshqa belgi: karta silkinadi va qator: Kutilgani bilan bo'lganini yana bir solishtiring.
  - 2-urinish kartasida kichik kulrang qator: Shu telefonda, shu urinishda.
- Nom qatori (3/3 dan keyin): Har urinishga uch qator — nima qildim, nima kutdim, nima bo'ldi: **buzish yozuvi**.
- Natija qatori: Taxminingiz to'g'ri chiqdi ✓ · yoki: Taxminingiz ✕ — Mentor misolida: ikkitasi — fonga olish buzmadi
- Xulosa: Mentor misolida uch urinishdan ikkitasi buzildi; «buzilmadi» ham natija — u ham yoziladi.
- Izoh: Buzib tekshirishni faqat o'z ilovangizda qilasiz. Boshqa odamning ilovasi yoki sayti tekshirilmaydi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Urinishlarni ko'ring (N/3) → Davom etish

## 10 · 4-savol
- Eyebrow: Mashq · 4-savol
- Savol: Kutganingiz bilan bo'lgani bir xil chiqdi. Yozuvga *nima qo'yasiz*?
  - «Tuzatish qilindi» — muammo yo'q
  - ✔ «Buzilmadi» — bu ham natija
  - Hech narsa — yozuv kerak emas
  - «Buzildi» — chunki tekshirdim
- To'g'ri javob izohi: Kutilgani bo'lsa — «buzilmadi»: qaysi usul ilovani buzmagani ham yoziladi.
- Xato izohlari:
  - «Tuzatish qilindi» — muammo yo'q: «Tuzatish qilindi» faqat kod o'zgarganda qo'yiladi.
  - «Hech narsa — yozuv kerak emas»: Yozuvsiz qaysi usul bajarilgani unutiladi.
  - «Buzildi» — chunki tekshirdim: «Buzildi» kutilgani bo'lmaganda qo'yiladi.
  - boshqa holatda: Kutilgani bo'lsa — «buzilmadi».
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 11 · Tuzatish qilindi va takrorlanmadi
- Eyebrow: Tushuncha · qayta tekshiruv
- Sarlavha: Agent «tuzatdim» desa, buni *qanday bilasiz*?
- Mentor: Avval yozuvni agentga yuboring, keyin «buzildi» belgili ikki urinishni o'sha usul bilan qaytaring.
- Bashorat: Tuzatishni qanday tekshirasiz? · Agentning so'zidan · Koddagi o'zgarishdan · O'sha usul bilan qayta buzib
- Chap — 1-telefon (belgi «Ulangan», «8 / 10») va Backend «Database: 8».
- O'ng — Antigravity chati, ostida uchta raqamli tugma: 1 Yozuvni yuborish · 2 Qayta: internetni uzish · 3 Qayta: yangi versiya; pastda buzish yozuvi (ixcham): 1 · Internetni uzish · buzildi · 2 · Fonga olib qaytarish · buzilmadi · 3 · Backend'ning yangi versiyasi · buzildi
- Qadamlar:
  1. Yozuvni yuborish — chatda:
     - Siz: 1 va 3-urinish talabdagidek emas — yozuvim pastda. Tuzat, har muammoning sababini bir gap bilan ayt.
     - Antigravity: Tuzatdim: qayta ulanganda ro'yxat qayta so'raladi, tinglovchi bir marta qo'shiladi, ilova xonaga qayta kiradi.
     - 1 va 3-qator yonida belgi «tuzatish qilindi». Nom qatori: **«Tuzatish qilindi»** — kodda o'zgartirish qilindi: bu ish fakti.
  2. Qayta: internetni uzish — samolyot, belgi «Ulanmoqda…», konvert uzilgan joyda so'nadi; ↻ dan keyin «Ulangan» va «8 / 10» → «9 / 10»; 1-qator yonida «qayta tekshiruvda takrorlanmadi».
  3. Qayta: yangi versiya — belgi «Ulanmoqda…» → «Ulangan»; Backend'da qator «ikkinchi telefonda o'yin ochildi · agent qo'shildi»; konvert keladi → «9 / 10», bitta jonli xabar, «Hozir ko'ryapti: 2»; 3-qator yonida «qayta tekshiruvda takrorlanmadi».
- Natija qatori: Taxminingiz to'g'ri chiqdi ✓ · yoki: Taxminingiz ✕ — aslida: o'sha usul bilan qayta buzib
- Xulosa: «Tuzatish qilindi» — ish qilindi; «qayta tekshiruvda takrorlanmadi» — o'sha usul bilan ko'rilgan natija.
- Izoh: Qayta tekshiruvda yana buzilsa — shuni yozib, yozuvni agentga qayta berasiz.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/3) → Davom etish

## 12 · Buzish rejangiz
- Eyebrow: Mustaqil ish · kutish
- Sarlavha: Har usuldan oldin *nima kutishingizni* yozing.
- Mentor: Talabingizdagi chekka holatlardan boshlang: har usulga bittasini tanlang.
- Tepada ixcham chiziq: 1 Internetni uzish · 2 Fonga olib qaytarish · 3 Backend'ning yangi versiyasi (tayyori oldida ✓ va «Nima kutaman» ning qisqa boshi).
- Bir vaqtda bitta karta: «N / 3 · <usul>», uch maydon:
  1. Nima qilaman — oldindan yozilgan, tahrirlanadi:
     - Internetni uzish: Uchish rejimini yoqaman; belgi «Ulanmoqda…» bo'lgach boshqa akkaunt o'zgarish qiladi; keyin o'chiraman.
     - Fonga olib qaytarish: Boshqa ilovaga o'taman; shu payt boshqa akkaunt o'zgarish qiladi; bir daqiqadan keyin qaytaman.
     - Backend'ning yangi versiyasi: Render'da Backend'ni qayta chiqaraman; belgi «Ulangan» bo'lgach, boshqa akkaunt o'zgarish qiladi.
  2. Talabingizdagi chekka holat — 3-darsdagi talabingiz chekka holatlari tugma bo'lib chiqadi, oxirida «O'zim yozaman»; talab yo'q bo'lsa — bo'sh qator (ichida: Talabingizdagi chekka holat).
  3. Nima kutaman — bo'sh qator, ichida: Ekranda aniq nima ko'rinishi kerak?
- Tugmalar: Keyingi usul (uchinchi kartada — Saqlash) · Yordam
- Yordam (ochiladigan):
  - Kutishni ekranda ko'rinadigan narsa bilan yozing: son, belgi, jonli xabar, «Hozir ko'ryapti». «To'g'ri ishlaydi» deb yozilsa, keyin solishtirib bo'lmaydi.
  - Mahsulotingizda jonli xabar yoki «Hozir ko'ryapti» bo'lmasa — real vaqt nuqtangizdagi son yoki ro'yxatni yozing. «Hozir ko'ryapti» ni faqat ikkinchi ekran bo'lsa (sherik telefoni) tekshira olasiz.
  - Mentor misoli · 3 masalan: Belgi «Ulangan» bo'lgach, «9 / 10» ko'rinadi.
- «Nima kutaman» bo'sh bo'lsa: «Nima kutaman» bo'sh — ekranda nima ko'rinishini yozing.
- Saqlagach: bitta ixcham qator «Buzish rejasi · 3 usul ✓» va xulosa: Kutishingiz yozildi — amaliyotda har urinishdan keyin nima bo'lganini yoniga yozasiz.
- Tugmalar: Orqaga · Saqlang → Davom etish

## 13 · Buzishdan qayta tekshiruvgacha (final)
- Eyebrow: Yakuniy · tartib
- Sarlavha: Buzishdan qayta tekshiruvgacha *qaysi tartibda*?
- Mentor: Bo'laklarni bajariladigan tartibda joylang.
- Bo'laklar (ekranda aralash; uyalarda raqam va «bu yerga qo'ying»). To'g'ri tartib:
  1. Talabdagi chekka holatdan nima kutishingizni yozasiz
  2. Ilovani bitta usul bilan buzasiz
  3. Nima bo'lganini yozib, belgi qo'yasiz
  4. Yozuvni agentga berasiz
  5. Agent o'zgartirish qilgach, «tuzatish qilindi» deb belgilaysiz
  6. O'sha usul bilan qayta buzib, natijani yozasiz
- Xato: Tartib mos emas — bo'lakni bosib qaytaring.
- Yechilgach: Bu darsda kutish buzishdan oldin yoziladi — shunda natija bilan solishtirsa bo'ladi.
  - Oldin xato bo'lgan bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Avval bo'laklarni joylang → Davom etish

## 14 · Amaliyot 1 — ilovangizni buzing
- Eyebrow: Amaliyot 1 · o'z mahsulotingiz
- Sarlavha: Mahsulotingizni uch usul bilan buzing va *yozib boring*.
- Mentor: Kod yozilmaydi: agent faqat boshqa akkaunt nomidan o'zgarish qiladi, kuzatish va yozuv — sizda; «1 · Ochish»dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Trek tanlanmagan bo'lsa, blok tepasida: Trekingiz: · Mobil trek · Web-trek
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — ilovangiz telefonda ochiq va kirgan holda bo'lsin (mobil trekda: `cd mobil`, `npx expo start`, Expo Go). Real vaqt nuqtangiz turgan ekranni oching — Mentor misolida «O'yin»: belgi «Ulangan» bo'lishi kerak.
     - Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin. **Buzish faqat o'z ilovangizda: boshqa odamning ilovasi yoki sayti tekshirilmaydi.**
     - Sherik bo'lsa — uning telefonida ham shu ekran ochiq tursin (web havola yoki Android'dagi Expo Go; Expo akkauntingiz ma'lumoti berilmaydi).
     - Web-trekda: saytingizni telefon brauzerida oching — uchish rejimi telefonda yoqiladi (kompyuterda Wi-Fi'ni o'chirish dars sahifasini ham uzadi); «ilovani yopib qayta ochish» o'rniga — sahifani yangilang.
  2. **Prompt** — qavsni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: `backend/` — faqat o'qish uchun, kod va fayllarni o'zgartirma; Database'da — faqat o'zing yaratadigan tekshiruv akkaunti va yozuvi.
       > Nima qilsin: tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas) va shu akkaunt nomidan {boshqa akkaunt qiladigan o'zgarish} so'rovini tayyorla, lekin yuborma. «Yubor» desam — yubor va qaysi akkaunt, qaysi `id` ekanini ayt. «O'chir» desam — faqat o'sha `id` dagi yozuvni o'chir.
       > Nima buzilmasin: kod, `.env` va boshqa yozuvlarga tegma; haqiqiy odamning akkauntidan foydalanma.
     - Bo'sh qavs yonida kulrang namuna: {boshqa akkaunt qiladigan o'zgarish} — masalan: «Shanba, 18:00» o'yiniga qo'shilish (`POST /oyinlar/1/qoshilish`)
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `backend/` — faqat o'qish uchun, kod va fayllarni o'zgartirma; Database'da — faqat o'zing yaratadigan tekshiruv akkaunti va yozuvi.
       > Nima qilsin: tekshiruv uchun yangi akkaunt och (namuna ism va raqam bilan, haqiqiy emas) va shu akkaunt nomidan «Shanba, 18:00» o'yiniga qo'shilish (`POST /oyinlar/1/qoshilish`) so'rovini tayyorla, lekin yuborma. «Yubor» desam — yubor va qaysi akkaunt, qaysi `id` ekanini ayt. «O'chir» desam — faqat o'sha `id` dagi yozuvni o'chir.
       > Nima buzilmasin: kod, `.env` va boshqa yozuvlarga tegma; haqiqiy odamning akkauntidan foydalanma.
  3. **Buzish** — uch usul, bittadan; har urinishdan oldin ilovani yopib qayta oching. Har urinishdan keyin yozuv kartasida «Nima bo'ldi» qatorini yozing va «Buzildi» yoki «Buzilmadi» ni tanlang; keyin agentga «O'chir» deng va ro'yxatni pastga torting — son boshidagidek bo'lishi kerak.
     - O'zgarishni boshqa akkaunt qiladi: sherik o'z telefonida yoki web-trekda o'zingiz kompyuterdagi yashirin oynada (11-Moduldagi ikkinchi namuna akkaunt bilan; keyin o'zgarishni o'zingiz qaytarasiz), bo'lmasa — agent («Yubor»).
     - (1) Internetni uzish — uchish rejimini yoqing va belgi «Ulanmoqda…» bo'lishini kuting (bir daqiqagacha). Keyin o'zgarish qilinsin; bo'lgach uchish rejimini o'chiring. Belgi «Ulangan» bo'lgach, ekranga qarang.
     - (2) Fonga olib qaytarish — boshqa ilovaga o'ting va o'zgarish qilinsin. Bir daqiqadan keyin ilovaga qayting va ekranga qarang.
     - (3) Backend'ning yangi versiyasi — ilova ochiq tursin. Render sahifasida Backend xizmatingizni oching: «Manual Deploy» → «Deploy latest commit». Belgi «Ulanmoqda…» ga o'tib, yana «Ulangan» bo'lishi kerak — bu bir necha daqiqa cho'zilishi mumkin; kutayotganda 1 va 2-urinish yozuvini qayta o'qing. «Ulangan» bo'lgach, o'zgarish qilinsin va ekranga qarang (sherik bo'lsa — uning telefonidagi «Hozir ko'ryapti» ga ham).
     - Bugun Backend kodi o'zgarmaydi, shuning uchun Render'da qo'lda qayta chiqarasiz. 11-Moduldagi sozlamada `backend/` ichidagi o'zgarish push qilinsa, Render yangi versiyani odatda o'zi ishga tushiradi.
     - Yozuv kartasi (bittadan): «N / 3 · <usul>» · Nima qildim · Nima kutdim (12-ekrandan, tahrirlanadi) · Nima bo'ldi (ichida: masalan: Belgi «Ulangan», lekin «8 / 10» qoldi.) · tugmalar «Buzildi» · «Buzilmadi» («Nima bo'ldi» yozilgach ochiladi). Yozilganlari ixcham qator bo'lib tepada turadi: ✓ N · <usul> · belgi (bosib tahrirlanadi).
     - Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Nima bo'lganini ayt.»
     - Bu qadamdagi «Bajardim» uch yozuv yozilguncha yopiq.
  4. **Tekshirish** — uch yozuvni o'qing: «Nima bo'ldi» — ekranda ko'rganingiz, taxmin emas; har belgi «Nima kutdim» bilan solishtirilgan. Agentga yozing: «Tekshiruv akkauntini ham `id` si bo'yicha o'chir. Yaratgan akkaunt va yozuvlaringning `id` larini ayt: hammasi o'chdimi?»
     - Agent javobi — uning so'zi; ilovada son boshidagidek bo'lishi kerak — buni o'zingiz ko'rasiz.
- O'ng — kutilgan natija · namuna: Maydon Jamoa: mobil trekda — telefon (ustida «Expo Go»; «Shanba, 18:00», «8 / 10», belgi «Ulangan»); web-trekda — brauzer oynasi `….netlify.app`: Maydon Jamoa · O'yinlar · belgi «Ulangan» · Shanba, 18:00 · Mahalla maydoni · 8 / 10. Ostida Mentor buzish yozuvining uch kartasi (uch qator va belgi: buzildi · buzilmadi · buzildi).
- Ostida: Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-05-start` (faqat shu yangi papkada — buyruq papkadagi o'zgarishlarni o'chiradi) — agent «bajardim» deganidan keyingi kod; qanday ishlashini ko'rasiz, o'z repo'ngizdagi qadamni shunga qarab qaytarasiz (`backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz).
- Blok tugaguncha: Ulgurmasangiz: Render'da qayta chiqarish cho'zilsa — 3-usul uyga vazifaning 1-bandi; 1 va 2-urinishdan keyin «Davom etish» ochiladi — 2-amaliyotga o'ting. Blok uchala usul va 4-qadamdan keyin bajarilgan sanaladi.
- Hammasi bajarilgach (holatga qarab):
  - kamida bitta «buzildi»: Uch usul bajarildi va yozildi: topilgan muammolar keyingi blokda tuzatiladi.
  - hammasi «buzilmadi»: Uch usul bajarildi: mahsulotingiz buzilmadi — bu ham natija.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 15 · Amaliyot 2 — tuzating va qayta tekshiring
- Eyebrow: Amaliyot 2 · o'z repo'ngiz
- Sarlavha: Topilgan muammolarni tuzating va *qayta tekshiring*.
- Mentor: Yozuvingizni agentga so'zma-so'z berasiz: tuzatishni u qiladi, natijani esa siz tekshirasiz; «1 · Ochish»dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Trek tanlanmagan bo'lsa, blok tepasida: Trekingiz: · Mobil trek · Web-trek
- Qadamlar:
  1. **Ochish** — 1-amaliyotdagi yozuvingiz pastdagi talabga o'zi qo'yilgan — «buzildi» belgili urinishlarni o'qib chiqing. Ilovangiz telefonda ochiq tursin (mobil trekda `npx expo start` ishlab tursin).
     - Hech biri «buzildi» bo'lmasa — 2 va 3-qadamni o'tkazib yuboring: 4-qadamda faqat `BUZISH.md` yoziladi.
  2. **Prompt** — qavslarni tekshiring (tahrirlasangiz bo'ladi), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: buzish yozuvidagi muammoga tegishli fayllar — avval sababini top, keyin faqat kerakli joyni o'zgartir.
       > Nima qilsin: pastdagi buzish yozuvida «buzildi» belgili har urinishni tuzat: ilova «Nima kutdim» qatoridagidek ishlasin. Har muammoning sababini bir gap bilan ayt va qaysi faylni o'zgartirganingni ayt.
       > {buzish yozuvi}
       > Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - {buzish yozuvi} o'rnida — 1-amaliyotdagi «buzildi» belgili har urinish bitta qatorda: «N · <usul>. Nima qildim: … Nima kutdim: … Nima bo'ldi: …»
     - {avvalgidek ishlashi kerak bo'lgan ishlar} — 3-darsdagi talabingizdan oldindan yoziladi; bo'lmasa yonida kulrang namuna: masalan: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat; «Hozir ko'ryapti» va jonli xabar
     - Web-trekda oxirgi qator: Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; «Yangilash» tugmasi qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `mobil/` — ulanish fayli va real vaqt ekranlari. Backend'ga tegma.
       > Nima qilsin: pastdagi buzish yozuvida «buzildi» belgili har urinishni tuzat: ilova «Nima kutdim» qatoridagidek ishlasin. Har muammoning sababini bir gap bilan ayt.
       > 1 · Internetni uzish. Nima qildim: Uchish rejimini yoqdim; belgi «Ulanmoqda…» bo'lgach agent tekshiruv akkauntidan «Shanba, 18:00» ga qo'shildi; keyin uchish rejimini o'chirdim. Nima kutdim: Belgi «Ulangan» bo'lgach, «9 / 10» ko'rinadi. Nima bo'ldi: Belgi «Ulangan», lekin «8 / 10» qoldi.
       > 3 · Backend'ning yangi versiyasi. Nima qildim: Render'da Backend'ni qayta chiqardim; belgi yana «Ulangan» bo'lgach, ikkinchi telefonda o'yinni ochdim va agent tekshiruv akkauntidan qo'shildi. Nima kutdim: Bitta jonli xabar; ikkinchi telefonda «Hozir ko'ryapti: 2». Nima bo'ldi: Jonli xabar ikki marta chiqdi; ikkinchi telefonda «Hozir ko'ryapti: 1».
       > Nima buzilmasin: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Web-trekda Yordam: Qayerda: `prototip/` — ulanish fayli va real vaqt sahifalari. Backend'ga tegma. · Nima buzilmasin: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; «Yangilash» tugmasi qolsin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q. Agent aytgan sabablarni o'qing — ular uning so'zi; natijani 4-qadam ko'rsatadi.
     - Mobil trekda Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`). Web-trekda: `git add <fayl>` → `git commit -m "qayta ulanish tuzatishi"` → `git push` — Netlify saytni odatda o'zi yangilaydi.
     - Agent `backend/` ni ham o'zgartirgan bo'lsa — ikkala trekda shu fayllarni `git push` qiling va Render'da yangi versiya tugashini kuting.
     - Agent har muammo uchun qaysi faylni o'zgartirganini aytgan va u `git status` da ko'ringan bo'lsa, o'sha urinishga «Tuzatish qilindi» ni belgilang — bu ish fakti: kodda o'zgartirish qilindi; to'g'riligini 4-qadam ko'rsatadi.
     - Agentdan o'zgartirgan kodidagi ikki joyni ko'rsatishni so'rang — darsda ko'rgan `connect` va tinglovchini o'z loyihangizda topasiz:
       > O'zgartirgan fayllaringda ikki joyni fayl nomi va qator raqami bilan ko'rsat: `connect` ichidagi kod va `oyin-ozgardi` tinglovchisi qo'shiladigan qator.
       > Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     - «buzildi» belgili har urinish uchun: «N · <usul>» va tugma «Tuzatish qilindi» (bosilgach ✓).
     - Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Qayta tekshirish va GitHub** — «buzildi» belgili har urinishni o'sha usul bilan qaytaring (ilovani yopib oching, agentga «Yubor», keyin «O'chir»). Tanlang: «Qayta tekshiruvda takrorlanmadi» · «Qayta tekshiruvda yana buzildi».
     - Har «buzildi» urinish uchun: «N · <usul>» va tugmalar «Qayta tekshiruvda takrorlanmadi» · «Qayta tekshiruvda yana buzildi».
     - Yana buzilsa — agentga: «{usul} qayta tekshiruvda yana buzildi: {nima bo'ldi}. Tuzat.» va o'sha usulni yana bir marta qaytaring; qolgani — uyda.
     - Keyin agentga:
       > `BUZISH.md` yarat: pastdagi yozuvimni so'zma-so'z ko'chir — har urinishning uch qatori, belgisi, tuzatish va qayta tekshiruv natijasi. Boshqa faylga tegma.
       > {to'liq yozuv: har urinish bitta qatorda — «N · <usul>. Nima qildim: … Nima kutdim: … Nima bo'ldi: … · buzildi / buzilmadi · tuzatish qilindi · qayta tekshiruvda takrorlanmadi / qayta tekshiruvda yana buzildi / qayta tekshiruv — hali yo'q»}
     - `BUZISH.md` ni yozuvingiz bilan solishtiring; mos bo'lsa — `git status` → `git add BUZISH.md` va tuzatilgan fayllar (`git add .` emas) → `git commit -m "buzish va tuzatish"` → `git push`.
     - `git push` xato bersa — xato qatorini agentga yuboring (token va kalitlarni emas).
- O'ng — kutilgan natija · namuna: Maydon Jamoa: Mentor buzish yozuvining uch kartasi (1 · buzildi · tuzatish qilindi · qayta tekshiruvda takrorlanmadi · 2 · buzilmadi · 3 · buzildi · tuzatish qilindi · qayta tekshiruvda takrorlanmadi); fayllar: `mobil/src/ulanish.ts` o'zgardi · `mobil/src/app/index.tsx` o'zgardi · `mobil/src/app/oyin/[id].tsx` o'zgardi · `BUZISH.md` yangi; GitHub oynasi `github.com/…/maydon-jamoa`: `maydon-jamoa` · `BUZISH.md`.
- 4-qadamgacha: Ulgurmasangiz: 3-usulning qayta tekshiruvi — uyda; `BUZISH.md` bugun yozilsa, shu urinish qatorida «qayta tekshiruv — hali yo'q» turadi.
- Hammasi bajarilgach (holatga qarab):
  - hammasi takrorlanmadi: Tuzatish qilindi va qayta tekshirildi: yozuvingiz `BUZISH.md` da.
  - yana buzilgani bor: Tuzatish qilindi, bitta urinish yana buzildi — uyda davom etasiz.
  - hech biri buzilmagan: Yozuvingiz `BUZISH.md` da: uch usul ilovangizni buzmadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 16 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 17 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.
- Birinchi bosishgacha: Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon | Izoh |
|---|---|---|
| Buzish nima? | Ilovaning chekka holatini ataylab yuzaga keltirib tekshirish | Bu darsda — faqat o'z ilovangizda, uch usul bilan |
| Uch buzish usuli qaysilar? | Internetni uzish, fonga olib qaytarish, Backend'ning yangi versiyasi | Mentor misolida ikkitasi ilovani buzdi |
| Buzish yozuvida qaysi uch qator bor? | Nima qildim, nima kutdim, nima bo'ldi | Oxirida belgi: buzildi yoki buzilmadi |
| «Nima kutdim» qachon yoziladi? | Buzishdan oldin | Shunda natija bilan solishtirsa bo'ladi |
| Uzilish paytida yuborilgan hodisa nima bo'ladi? | Bu misolda keyin ham kelmaydi | Tuzatish: qayta ulanganda ro'yxat qayta so'raladi |
| Qayta ulanish nima? | Uzilgan ulanishni qayta tiklash | socket.io bunga o'zi urinadi — odatda bir necha soniyada |
| `connect` ichidagi kod qachon ishlaydi? | Birinchi ulanishda va har qayta ulanishda | Shuning uchun tinglovchi uning tashqarisida qo'shiladi |
| Takror hodisa nima? | Bitta o'zgarish ilovaga ikki marta ta'sir qilishi | Mentor misolida — jonli xabar ikki marta chiqdi |
| Ulanish uzilsa, xonada nima bo'ladi? | Ulanish xonadan chiqadi | Mentor misolida qayta ulangach ilova o'yin xonasiga qayta kiradi |
| «Tuzatish qilindi» nimani bildiradi? | Kodda o'zgartirish qilingani — bu ish fakti | Natijani qayta tekshiruv ko'rsatadi |
| «Qayta tekshiruvda takrorlanmadi» qachon yoziladi? | O'sha usul bilan qayta buzib ko'rilganda muammo chiqmasa | Shu telefonda, shu urinishda — hamma telefon uchun isbot emas |
| Agentning «bajardim» degani nima? | Da'vo — hali tekshirilmagan | Natijani o'zingiz buzib ko'rib bilasiz |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 18 · Dars yakuni
- Eyebrow: Tayyor
- Yuqori yorliq: ✓ `BUZISH.md` tayyor (faqat birinchi yoki ikkinchi sarlavha holatida va 2-amaliyot bajarilgan bo'lsa) · N/5 to'g'ri
- Sarlavha (holatga qarab):
  - ikkala amaliyot bajarilgan, har tuzatilgan urinish qayta tekshiruvda takrorlanmagan: Topilgan muammolar tuzatildi va qayta tekshirildi.
  - uch urinish ham «buzilmadi»: Uch usul bajarildi — mahsulotingiz buzilmadi.
  - «tuzatish qilindi» bor, qayta tekshiruv to'liq emas: Tuzatish qilindi — qayta tekshirish qoldi.
  - «buzildi» yozilgan, tuzatish hali yo'q: Muammolar yozildi — tuzatish qoldi.
  - yozuv to'liq emas: Buzish boshlandi — qolgan usullarni uyda bajaring.
  - hech bir urinish yozilmagan: Buzish yozuvi hali yozilmagan — usullarni uyda bajaring.
- CODE STRIKE arenasi (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Chekka holat oddiy paytda ko'rinmaydi — uni ataylab yuzaga keltirib tekshirasiz.
  - Bu misolda uzilish paytida yuborilgan hodisa keyin kelmaydi, shuning uchun qayta ulanganda ro'yxat qayta so'raladi.
  - `connect` ichidagi kod har qayta ulanishda ishlaydi, shuning uchun tinglovchi uning tashqarisida bir marta qo'shiladi.
  - Uzilganda ulanish xonadan chiqadi; Mentor misolida tuzatishdan keyin qayta ulangan ilova o'yin xonasiga qayta kiradi.
  - «Tuzatish qilindi» — ish fakti; «qayta tekshiruvda takrorlanmadi» — o'sha usul bilan ko'rilgan natija.
- Uyga vazifa (tugma «Amaliy topshiriqni bajarish →»):
  - kim uchun — o'z ilovangiz · nechta — uch usul · muddat — keyingi darsgacha
  1. **Tugatish** — darsda ulgurmagan usulni bajaring va yozing (ko'pincha — Render'da qayta chiqarish); «buzildi» bo'lsa — yozuvni agentga bering va o'sha usul bilan qayta tekshiring.
  2. **Yana bir marta** — bugun natijasi kutganingizdan boshqacha chiqqan yoki qayta tekshiruvi tugamagan usulni ertaga yana bajaring: natija o'shandaymi? Farq bo'lsa, `BUZISH.md` ga yangi urinish qo'shing.
  3. **Talab** — bugun topilgan har muammo talabingizdagi chekka holatlar ro'yxatida bormi? Yo'q bo'lsa — README'dagi «Real vaqt» bo'limiga bitta chekka holat qo'shing.
  - Keyingi dars — **«Birinchi foydalanuvchilar sizni qayerdan topadi?»**
- Nishonlaringiz — N/4 (to'rtta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Nishonlar
- **Lost Event** — Uzilish paytidagi hodisa nega kelmasligini topdingiz (3-ekran, birinchi urinishda to'g'ri)
- **Once Only** — Ikki jonli xabarning sababini topdingiz (5-ekran, birinchi urinishda to'g'ri)
- **Room Return** — Qayta ulangan ilova xonaga nega qaytmaganini bildingiz (7-ekran, birinchi urinishda to'g'ri)
- **Break & Fix** — Ikkala amaliyot blokini oxirigacha bajardingiz (15-ekran, oxirgi «Bajardim»; bonus)
- Nishon olinganda: nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 3-ekran (1-savol) — **Uzilishdagi hodisa keyin kelmaydi**
   - 1 · Uchish rejimida ulanish uziladi.
   - 2 · Shu payt yuborilgan hodisa bu misolda keyin ham kelmaydi.
   - 3 · Tuzatish: qayta ulanganda ro'yxat Backend'dan qayta so'raladi.
   - Sinfga savol: Belgi «Ulangan» — ekrandagi son yangi ekanini qanday bilasiz?
2. 5-ekran (2-savol) — **`connect` har qayta ulanishda ishlaydi**
   - Birinchi ulanishda ishlaydi · `ulanish.on('connect', …)`
   - Qayta ulanishda ham ishlaydi · ichidagi tinglovchi yana qo'shiladi
   - Tinglovchi tashqarida — bir marta · `ulanish.on('oyin-ozgardi', …)`
   - Sinfga savol: Ilova uch marta qayta ulansa, bitta qo'shilishga nechta jonli xabar chiqardi?
3. 7-ekran (3-savol) — **Xonaga qaytish**
   - Uzilganda ulanish xonadan chiqadi · `Xona oyin-1: 0`
   - Qayta ulanish — yangi ulanish: xonaga o'zi kirmaydi
   - Tuzatish: ochiq o'yin xonasiga qayta kiradi · `oyin-ochildi`
   - Sinfga savol: Xonaga qaytmagan ilova qaysi sonni olmay qoladi?
4. 10-ekran (4-savol) — **Buzish yozuvi**
   - 1 · Nima qildim
   - 2 · Nima kutdim
   - 3 · Nima bo'ldi → belgi: buzildi yoki buzilmadi
   - Sinfga savol: Nega «Nima kutdim» buzishdan oldin yoziladi?
5. 13-ekran (final) — **Buzishdan qayta tekshiruvgacha**
   - 1 · Kutish yoziladi, keyin ilova buziladi
   - 2 · Yozuv agentga beriladi — o'zgartirish qilingach «tuzatish qilindi»
   - 3 · O'sha usul bilan qayta — «qayta tekshiruvda takrorlanmadi»
   - Sinfga savol: Agent «tuzatdim» dedi, siz qayta tekshirmadingiz. Yozuvda nima turadi?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Qayta ishlash · mustaqil rejimda: Keyingi → · Natijani ko'rish · jonli dars tugasa: «Jonli dars yakunlandi — testni o'zingiz davom ettiring:» · Mashq rejimida davom etish

1. Uchish rejimi yoqilsa, ulanish nima bo'ladi?
   - ✔ Uziladi, ilova qayta urinadi
   - Ochiq qoladi, hodisa kutadi
   - Yopiladi, ilova urinmaydi
   - Tiklanadi, son o'zi yangilanadi
2. Tarmoq uzilsa, socket.io sukutda necha marta urinadi?
   - Bir marta, keyin to'xtaydi
   - ✔ Ulanguncha urinaveradi
   - Uch marta, keyin to'xtaydi
   - Faqat tugma bosilganda
3. `connect` ichidagi kod qachon ishlaydi?
   - Faqat ilova eng birinchi ulanganda
   - Faqat Backend hodisa yuborganda
   - ✔ Har ulanishda, qayta ulanganda ham
   - Faqat ilova yopilib qolganda
4. Takror hodisa nima?
   - Ikki o'yinda bir vaqtdagi o'zgarish
   - Ikki telefondagi bir xil son
   - Bir o'yinchining ikki akkaunti
   - ✔ Bitta o'zgarishning ikki ta'siri
5. Qayta ulanganda Mentor ilovasi ro'yxatni nega qayta so'raydi?
   - ✔ Uzilishda kelmagan o'zgarish uchun
   - Belgini «Ulangan» qilish uchun
   - Tinglovchini yana qo'shish uchun
   - Hodisani Backend'dan qayta olish uchun
6. Buzish yozuvida qaysi uch qator bor?
   - Kim bosdi, qachon va qayerda
   - ✔ Nima qildim, kutdim, bo'ldi
   - Usul, telefon, versiya
   - Muammo, sabab, tuzatish
7. Agent «tuzatdim» dedi, qayta tekshirmadingiz. Yozuvda nima turadi?
   - «Takrorlanmadi» — agent aytdi
   - «Buzilmadi» — endi hammasi ishlaydi
   - ✔ «Tuzatish qilindi» — tekshirilmagan
   - Hech narsa — agent o'zi biladi
8. Tuzatishni qaysi usul bilan qayta tekshirasiz?
   - Hali bajarilmagan yangi usul bilan
   - Agent yozgan javobni o'qib chiqib
   - Faqat koddagi o'zgarishni o'qib
   - ✔ Muammo chiqqan usulning o'zi bilan
9. Render yangi versiyani ishga tushirsa, ochiq ulanishlar nima bo'ladi?
   - ✔ Uziladi, ilovalar qayta urinadi
   - Ochiq qoladi, hech narsa sezilmaydi
   - Faqat yangi ilovalar uziladi
   - Database ularni saqlab turadi
10. socket.io'dagi xona qayerda turadi?
    - Ilovaning o'zida
    - ✔ Backend'ning o'zida
    - Database jadvalida
    - Telefon sozlamasida
11. Mentor misolida fonga olish urinishi nima ko'rsatdi?
    - Son eskicha qolib ketdi
    - Jonli xabar ikki marta chiqdi
    - ✔ Buzilmadi, son yangi edi
    - Ilova yopilib, qayta ochildi
12. Kimning ilovasini buzib tekshirasiz?
    - Sinfdoshingizning ilovasini
    - Mashhur ilovalardan birini
    - Istalgan ochiq saytni
    - ✔ O'zingizning ilovangizni

## Kartochkalar
17-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 18-ekrandagi 5 qator.
- Keyingi dars — «Birinchi foydalanuvchilar sizni qayerdan topadi?».
