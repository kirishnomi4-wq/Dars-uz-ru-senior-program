# 2-dars «WebSocket: ekran o'zi yangilanadigan ulanish» — yakuniy matn

Fayl: `src/10-Modull/WebSocketBasicsLesson.jsx` · 20 ekran · Keyingi dars: «Ekran o'zi yangilanishi uchun nimani yozasiz?»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — ikki telefon va Backend sahnasi: chapda «1-telefon · siz», o'rtada **Backend** tuguni (ichida «Database: N»), o'ngda «2-telefon · boshqa o'yinchi». Telefon tepasida «Maydon Jamoa» nomi.
Namuna o'yin (dars bo'yi bir xil): Shanba, 18:00 · Mahalla maydoni · 8 / 10.
O'yin ekrani: «‹ O'yinlar», «Shanba, 18:00», «Mahalla maydoni», «8 / 10», 10 ta doira, «Qo'shilaman» (bosilgach — «Qo'shildingiz»). O'yinlar ekrani: sarlavha «O'yinlar», yonida ulanish belgisi, «Shanba» kuni ostida o'yin kartasi.
Ulanish belgisi uch holatda: «Ulangan» (yashil nuqta) · «Ulanmoqda…» · «Ulanmagan» (kulrang).
Chiziq bo'ylab uchadigan konvertlar yorlig'i: so'rov · javob · `oyin-ozgardi`.

## 0 · Kirish
- Eyebrow: Dars · kirish
- Sarlavha: Sizning ekraningizda nega hali *«8 / 10»* turibdi?
- Mentor: Maydon Jamoa 11-Modul oxiridagi holatda: ikkinchi telefonda «Qo'shilaman» ni bosing va birinchisiga qarang.
  - variantlar ochilgach: Endi o'ngdagi javoblardan birini tanlang.
- Maket: ikki telefon yonma-yon — «1-telefon · siz» va «2-telefon · boshqa o'yinchi», ikkalasida O'yin ekrani («8 / 10», «Qo'shilaman»); 2-telefondagi «Qo'shilaman» halqada.
  - «Qo'shilaman» (2-telefon) → 2-telefonda «9 / 10», tugma «Qo'shildingiz»; 1-telefonda «8 / 10» qoladi, bir ozdan keyin son yonida yorliq «eski».
- Variantlar (bosilmaguncha xira, ballsiz):
  - Backend yangi sonni hali bilmaydi
  - Ilova Backend'dan qayta so'ramadi
  - Ikkinchi telefon sizga yubormadi
- Javob izohlari:
  - «Ilova Backend'dan qayta so'ramadi» tanlansa: **Aynan!** 11-Modulda ilova so'raganda yangilanadi: ekran ochilganda va pastga tortib yangilaganda.
  - «Backend yangi sonni hali bilmaydi» tanlansa: **Qiziq fikr!** Backend biladi: qo'shilish Database'ga yozildi. Ilova esa undan hali qayta so'ramadi.
  - «Ikkinchi telefon sizga yubormadi» tanlansa: **Qiziq fikr!** Telefonlar bir-birini tanimaydi: ikkalasi ham sonni faqat Backend'dan so'raydi.
- Javobdan keyin: telefonlar orasida Backend tuguni paydo bo'ladi («Database: 9»); 2-telefon chizig'i bir marta yonib so'nadi, 1-telefon chizig'i ustida «?».
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun mahsulotingiz *Backend'ga ulanib turadi*.
- Mentor: Har qadamni avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingizda qilasiz. Backend bugun hali xabar yubormaydi — bugungi ish ulanish va sxema.
- Chap — Dars oxirida: 1-telefon (O'yinlar ekrani, belgi «Ulanmoqda…» → chiziq chiziladi va ochiq qoladi, ustida «ochiq» → belgi «Ulangan») va Backend; telefon ostida: README.md · «Real vaqt» · 5 qator
- Reja:
  1. Ekran nega o'zi yangilanmasligini ko'rish · so'rov
  2. Ochiq turadigan ulanish va undan keladigan xabar · doimiy ulanish, hodisalar
  3. Ilovani Backend'ga ulash, belgini tekshirish · ulanish
  4. Mahsulotingiz uchun sxema yozish · real vaqt oqimi sxemasi
- Pastki qator: o'z repo'ngiz — ulanish va `README.md` «Real vaqt» · Mentor misoli `maydon-jamoa` · tayyor holat `m12-dars-02-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · So'rov va javob
- Eyebrow: Tushuncha · so'rov
- Sarlavha: So'rov bo'lmasa, Backend *nima qila oladi*?
- Mentor (qadamga qarab):
  - boshida: Backend tugunidagi «1-telefonga yuborish» ni bosib ko'ring, keyin birinchi telefonni pastga torting.
  - taxmin tanlangach: Backend tugunidagi «1-telefonga yuborish» ni bosing.
  - 1-qadamdan keyin: Yetib bormadi: 1-telefon so'ramagan. Endi 1-telefonni pastga torting yoki undagi «↓ Pastga torting» ni bosing.
  - tugagach: Son faqat ilova so'raganda yangilandi — «Davom etish» ni bosing.
- Bashorat (Avval o'zingiz belgilab ko'ring): Backend yangi sonni birinchi telefonga o'zi yubora oladimi? · Ha, istagan payt · Yo'q, faqat so'rovga javoban
  - Tanlangach ixcham qator: savol · tanlov
- Sahna: 1-telefon «8 / 10» (yorliq «eski») · Backend («Database: 9»; ichida tugma «1-telefonga yuborish», yonida qadam: 1 Yuborib ko'ring) · 2-telefon «9 / 10», «Qo'shildingiz»
  - «1-telefonga yuborish» → konvert Backend'dan chiqadi va yo'l boshida to'xtab orqaga qaytadi; Backend ichida: so'rov yo'q — yo'l yopiq; chiziqda ✕. 1-telefonda tugma «↓ Pastga torting», yonida qadam: 2 Pastga torting
  - Pastga tortish → konvert «so'rov» Backend'ga boradi, «javob» qaytadi → «8» → «9», «eski» yo'qoladi
- Natija: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz ✕ — aslida: yo'q, faqat so'rovga javoban)
- Xulosa: 11-Modulda yo'l faqat so'rov paytida ochiladi: ilova so'ramasa, Backend unga hech narsa yubora olmaydi.
- Tugma: Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish

## 3 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: 11-Modulda ilova yangi sonni Backend'dan *qachon* olardi?
  - Database'da son o'zgargan paytda
  - ✔ Backend'ga so'rov yuborgan paytda
  - Boshqa o'yinchi qo'shilgan paytda
  - Ilova ekranda ochiq turgan paytda
- Javob izohlari:
  - To'g'ri: So'rov bo'lmasa, Backend'dan ilovaga yo'l ochilmaydi — javob faqat so'rovga keladi.
  - A: Database o'zgardi — lekin ilovaga yo'lni kim ochadi?
  - C: Qo'shilish Backend'ga yetdi; sizning ilovangizga-chi?
  - D: Ochiq turgan ekranda son eski qoldi — nimadir yetmadi.
  - Umumiy: Javob faqat so'rovga keladi.
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: B — <variant> · jonli darsda: Jonli dars — bitta urinish, o'ylab bosing! · Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 4 · Ochiq turadigan ulanish
- Eyebrow: Tushuncha · ulanish
- Sarlavha: Ulanish ochiq tursa, *nima o'zgaradi*?
- Mentor: 10-Modulda dashboard Backend'dan qayta-qayta so'rardi — bugun boshqa yo'l: birinchi telefonda Maydon Jamoa'ni oching.
- Bashorat (Avval o'zingiz belgilab ko'ring): Ulanish ochiq turganda Backend ilovaga qachon xabar yubora oladi? · Faqat ilova so'raganda · Har 5 soniyada · Istagan payt
- Sahna: 1-telefon — bosh ekran, ilova belgisi «Maydon Jamoa» (halqada; qadam: 1 Ilovani oching) · Backend («Database: 8») · 2-telefon — O'yin ekrani, «Qo'shilaman»
  - Ilova belgisi → O'yin ekrani ochiladi: «so'rov» borib, «javob» qaytadi, «8 / 10»; chiziq chiziladi va ochiq qoladi, ustida «ochiq»
  - Nom qatori: Ilova bilan Backend orasida ochiq turadigan ulanish — **doimiy ulanish**.
  - «Qo'shilaman» (2-telefon; qadam: 2 Ikkinchi telefonda qo'shiling) → «Database: 9», 2-telefonda «9 / 10»; Backend'dan ochiq chiziq bo'ylab konvert `oyin-ozgardi` o'zi 1-telefonga keladi va chetida yopiq turadi — yorliq «ochilmagan»
  - Nom qatori: Doimiy ulanishni beradigan texnologiya — **WebSocket**.
- Natija: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz ✕ — aslida: istagan payt)
- Xulosa: Ulanish ochiq turganda ikkalasi istagan payt xabar yubora oladi: Backend ilova so'rashini kutmaydi.
- Tugma: Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish

## 5 · Konvert ichida nima bor
- Eyebrow: Tushuncha · hodisa
- Sarlavha: Backend yuborgan xabarda *nima bor*?
- Mentor: Birinchi telefon chetidagi konvertni bosib oching.
  - konvert ochilgach: Ichida son yo'q: «Qayta so'rash» ni bosing.
- Bashorat (Avval o'zingiz belgilab ko'ring): Konvert ichida nima bor? · Faqat qaysi o'yin o'zgargani · O'yinning yangi soni · O'yinlarning to'liq ro'yxati
- Sahna: 1-telefon «8 / 10», chetida yopiq konvert «ochilmagan» (halqada) · Backend («Database: 9») · 2-telefon «9 / 10»; 1-telefon ostida tugma «Qayta so'rash» (konvert ochilguncha xira)
  - Konvert → ochiladi: nomi `oyin-ozgardi` · ma'lumoti `{ oyinId: 1, sabab: 'qoshildi' }`; son o'zgarmaydi
  - Nom qatori: Ulanish orqali yuboriladigan nomli xabar — **hodisa**: nomi va ma'lumoti bor.
  - «Qayta so'rash» → konvert `GET /oyinlar` Backend'ga boradi, «Database: 9» bir lahza yonadi, «javob» qaytadi → «8» → «9»
- Natija: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz ✕ — aslida: faqat qaysi o'yin o'zgargani va sababi)
- Xulosa: Bu misolda hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi.
- Izoh: Haqiqiy sonni ilova Backend'dan qayta oladi; Backend uchun manba — Database.
- Tugma: Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/2) → Davom etish

## 6 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Mentor misolida `oyin-ozgardi` hodisasi ilovaga *nimani* olib keladi?
  - O'yinning yangi sonini va ro'yxatini
  - Qo'shilgan o'yinchining ismini
  - O'yinlarning yangilangan ro'yxatini
  - ✔ Qaysi o'yin o'zgargani va sababini
- Javob izohlari:
  - To'g'ri: Hodisada `oyinId` va `sabab` bor; yangi sonni ilova `GET /oyinlar` dan qayta so'raydi.
  - A: Konvertni ochganingizda ichida son bormidi?
  - B: Hodisada ism yo'q edi: unda ikki maydon bor.
  - C: Ro'yxat katta, hodisa esa qisqa — ikki maydon.
  - Umumiy: Hodisada ikki maydon bor: `oyinId` va `sabab`.
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: D — <variant>
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 7 · Kim ulanayotgani
- Eyebrow: Tushuncha · token
- Sarlavha: Backend kim ulanayotganini *qayerdan biladi*?
- Mentor: Mentor misolida ulanishni socket.io kutubxonasi ochadi — avval «Tokensiz ulanish» ni, keyin «Token bilan ulanish» ni bosing.
- Bashorat (Avval o'zingiz belgilab ko'ring): Ulanayotgan ilova Backend'ga o'zi haqida nimani yuboradi? · Hech narsa · Tokenni · Ism va parolni
- Sahna: 1-telefon (O'yinlar ekrani, belgi joyi — kulrang nuqta) · Backend
- Ostida ikki ustun:
  - Chap — tugmalar «Tokensiz ulanish» (halqada) · «Token bilan ulanish»; kod kartasi `mobil/src/ulanish.ts`:
```js
import { io } from 'socket.io-client';

const ulanish = io(BACKEND_MANZILI, {
  auth: { token },
});
```
    - karta ostida: `BACKEND_MANZILI` — `.env` dagi `EXPO_PUBLIC_API_URL` (web-trekda `VITE_API_URL`); `token` — kirishda saqlangan token.
  - O'ng — kod kartasi `backend` · gateway — Backend'da ulanishlarni qabul qiladigan klass:
```js
@WebSocketGateway()
export class OyinlarGateway {
  handleConnection(ulanish: Socket) {
    const token = ulanish.handshake.auth.token;
    if (!tokenYaroqli(token)) ulanish.disconnect();
  }
}
```
- «Tokensiz ulanish» → ilova kartasida `auth: {},`; konvert «tokensiz» Backend'ga boradi → gateway'dagi `if (!tokenYaroqli(token)) ulanish.disconnect();` qatori qizil; Backend ichida: token yo'q — yopdi; chiziq uziladi → belgi «Ulanmagan»
- «Token bilan ulanish» → `auth: { token },` qatori yonadi; konvert «token» → tekshiruv qatori yashil ✓; Backend ichida: token yaroqli ✓; chiziq ochiq qoladi → belgi «Ulangan»
- Nom qatori (ikkalasidan keyin): socket.io — doimiy ulanish bilan ishlashni osonlashtiradigan kutubxona; u imkon bo'lsa WebSocket orqali ulanadi. Ilovada `socket.io-client`, Backend'da NestJS gateway.
- Natija: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz ✕ — aslida: tokenni)
- Xulosa: Bu misolda ilova ulanayotganda tokenni yuboradi; Backend shu paytda tekshiradi va yaroqsiz bo'lsa yopadi.
- Izoh: Token yopiq so'rovlardagidek ishlatiladi, lekin bu yerda u ulanish ochilayotganda tekshiriladi.
- Tugma: Avval o'zingiz belgilab ko'ring → Ikkalasini sinab ko'ring (N/2) → Davom etish

## 8 · 3-savol
- Eyebrow: Mashq · 3-savol
- Savol: Mentor misolida ilova yaroqsiz token bilan ulanmoqchi. Backend *nima qiladi*?
  - ✔ Ulanishni yopadi, hodisa yubormaydi
  - Ulanishni ochadi, hodisa yubormaydi
  - Ulanishni ochadi, parolni so'raydi
  - Ulanishni yopadi, yangi token beradi
- Javob izohlari:
  - To'g'ri: Ulanish ochilayotganda token yaroqsiz bo'lsa, Backend uni yopadi.
  - B: Yaroqsiz tokendan keyin Backend kodida qaysi qator ishladi?
  - C: Parol faqat kirishda yoziladi; ulanishda so'ralmaydi.
  - D: Yangi token faqat «Kirish» ekranida olinadi.
  - Umumiy: Yaroqsiz tokenda Backend ulanishni yopadi.
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: A — <variant>
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 9 · Tinglovchi
- Eyebrow: Kod yozish · tinglovchi
- Sarlavha: Hodisa kelganda sonni qayta so'raydigan *kod yozamiz*.
- Mentor: Hodisa kelganda ishlaydigan kod tinglovchi deyiladi. Uni o'zingiz terib yozasiz: qo'lda yozganda o'rganiladi.
- Vazifa (bajarilgan band oldida ✓):
  1. `ulanish.on('oyin-ozgardi', …)` bilan tinglovchi yozing.
  2. Tinglovchi ichida `korsat()` ni chaqiring — son qayta so'ralsin.
  3. Natija oynasida «Boshqa o'yinchi qo'shildi» ni bosing: «Yangilash» ni bosmasdan son 8 dan 9 ga o'tsin.
- Tugmalar: Yordam · Bajardim (shartlar bajarilgach ochiladi)
  - Yordam: Shakli 11-Moduldagi `yangila.addEventListener('click', korsat)` kabi: avval hodisa nomi qo'shtirnoqda, keyin ishlaydigan funksiya. Son o'zgarmasa — nom `oyin-ozgardi` deb, chiziqcha bilan yozilganini tekshiring.
- O'ng — tugma «Kompilyatorni ochish», ostida: Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.
  - Natija oynasi: Natija · Shanba, 18:00 · Mahalla maydoni · «… / 10» · tugma «Boshqa o'yinchi qo'shildi» · Kelgan hodisa: hali yo'q (bosilgach: Kelgan hodisa: oyin-ozgardi {"oyinId":1,"sabab":"qoshildi"}; son «8» → «9» → «10»)
- Kod oynasi sarlavhasi: app.js — hodisa kelganda qayta so'rang
  - `app.js` (o'quvchi yozadi):
```js
const son = document.querySelector('.son');
const yangila = document.querySelector('.yangila');
function korsat() {
  son.textContent = sora();
}
korsat();
// 11-Modul: tugma bosilganda so'raydi
yangila.addEventListener('click', korsat);

// Bugun: hodisa kelganda so'rang.
// 1) ulanish.on bilan 'oyin-ozgardi' ga tinglovchi yozing — shu yerda
```
  - `index.html` (tayyor):
```html
<div class="oyin">
  <p>Shanba, 18:00 · Mahalla maydoni</p>
  <p class="hisob"><span class="son">…</span> / 10</p>
  <button class="yangila">Yangilash</button>
</div>
<button class="boshqa">Boshqa o'yinchi qo'shildi</button>
<p class="kelgan">Kelgan hodisa: hali yo'q</p>
```
  - `namuna.js` (tayyor):
```js
// Backend va ulanish o'rnida NAMUNA (haqiqiy Backend emas):
// son shu faylda turadi, hodisani
// «Boshqa o'yinchi qo'shildi» tugmasi yuboradi.
let qoshilgan = 8;
function sora() {
  return qoshilgan;
}

const tinglovchilar = [];
const ulanish = {
  on: function (nom, kod) {
    tinglovchilar.push({ nom: nom, kod: kod });
  },
};

document.querySelector('.boshqa').addEventListener('click', function () {
  if (qoshilgan >= 10) return;
  qoshilgan = qoshilgan + 1;
  const malumot = { oyinId: 1, sabab: 'qoshildi' };
  document.querySelector('.kelgan').textContent =
    'Kelgan hodisa: oyin-ozgardi ' + JSON.stringify(malumot);
  tinglovchilar.forEach(function (t) {
    if (t.nom === 'oyin-ozgardi') t.kod(malumot);
  });
});
```
  - Shartlar:
    1. ulanish.on('oyin-ozgardi', …) bilan tinglovchi yozing. — `ulanish.on` `'oyin-ozgardi'` nomi bilan chaqirilsin.
    2. Tinglovchi ichida korsat() ni chaqiring — son qayta so'ralsin. — Hodisa kelganda `korsat` ishlasin: son 8 dan 9 ga o'tsin.
- Bajardim'dan keyin:
  - Xulosa: Bu kodda son uch paytda so'raladi: sahifa ochilganda, «Yangilash» bosilganda va hodisa kelganda.
  - Izoh: Bu oynada `ulanish` — namuna: haqiqiy Backend emas, hodisani tugma yuboradi.
- Tugma: Avval bajaring → Davom etish

## 10 · Ulanish belgisi
- Eyebrow: Tushuncha · ulanish holati
- Sarlavha: Ulanish uzilsa, o'yinchi buni *qayerdan biladi*?
- Mentor: Doimiy ulanish ham uziladi — birinchi telefonda uchish rejimini yoqing va tepadagi belgiga qarang.
- Bashorat (Avval o'zingiz belgilab ko'ring): Uchish rejimida belgi nimani ko'rsatadi? · «Ulangan» · «Ulanmoqda…» · «Ulanmagan»
- Sahna: 1-telefon — O'yinlar ekrani, belgi «Ulangan», telefon tepasida uchish rejimi tugmasi (samolyot) · Backend («Database: 8»; ostida tugma «Token: yaroqli») · 2-telefon — O'yin ekrani, «Qo'shilaman». Qadam belgilari:
  1. Uchish rejimini yoqing → chiziq uziladi (↻), belgi «Ulanmoqda…»
  2. Ikkinchi telefonda qo'shiling → 2-telefonda «9 / 10», «Database: 9»; konvert `oyin-ozgardi` uzilgan joyda so'nadi, yorliq «kelmadi»; 1-telefonda «8 / 10»
  3. Uchish rejimini o'chiring → chiziq qayta tiklanadi, belgi «Ulangan»; «8 / 10» yonida «eski bo'lishi mumkin»
  4. Tokenni yaroqsiz qiling («Token: yaroqli» → «Token: yaroqsiz») → chiziq yopiladi, belgi «Ulanmagan»
- Tugagach telefon ostida uch belgi: Ulangan · Ulanmoqda… · Ulanmagan
- Nom qatori: Uch belgi — uch ulanish holati: ulangan, ulanmoqda, ulanmagan.
- Natija: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz ✕ — aslida: «Ulanmoqda…»)
- Xulosa: Ulangan — hodisalar keladi; ulanmoqda — ilova o'zi urinmoqda; ulanmagan — ilova urinmayapti.
- Izoh: Ulanish qaytgani son to'g'rilandi degani emas: bu misolda uzilishdagi hodisa keyin kelmaydi.
- Tugma: Avval o'zingiz belgilab ko'ring → Qadamlarni bajaring (N/4) → Davom etish

## 11 · 4-savol
- Eyebrow: Mashq · 4-savol
- Savol: «Ulanmoqda…» paytida boshqa o'yinchi qo'shildi. Ekraningizda *nima bo'ladi*?
  - Hodisa keladi, son o'zi yangilanadi
  - Hodisa kutib turadi, keyin keladi
  - ✔ Hodisa kelmaydi, son eski qoladi
  - Hodisa keladi, ilova yopilib qoladi
- Javob izohlari:
  - To'g'ri: Ulanish uzilgan paytda bo'lgan hodisa bu misolda keyin ham kelmaydi — son eski qoladi.
  - A: Ulanish uzilgan — hodisa qaysi yo'ldan kelardi?
  - B: Bu misolda Backend uzilgan ilova uchun hodisani saqlamaydi.
  - D: Ilova ishlayveradi: belgi o'zgaradi, ekran yopilmaydi.
  - Umumiy: Uzilish paytidagi hodisa kelmaydi.
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: C — <variant>
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 12 · Mentor sxemasi
- Eyebrow: Tushuncha · sxema
- Sarlavha: Kim nima qilsa, *kimning ekrani* o'zgaradi?
- Mentor: Har o'zgarish uchun Backend yuboradigan hodisaning sababini tanlang — qator jadvalga tushadi.
- Bashorat (Avval o'zingiz belgilab ko'ring): Besh xil o'zgarish uchun Mentor nechta hodisa nomi yozgan? · Bitta · Uchta · Beshta
- Chap — 1-telefon (joriy qatorga mos joy belgilangan: «8 / 10» · «Kelishini tasdiqladi: 7 / 9» · «Navbatda: 0» · O'yinlar ro'yxati)
- O'ng — jadval «Mentor sxemasi» · N / 5; ustunlar: Real vaqt nuqtasi · Kim nima qiladi · Hodisa · Kim oladi · Ekranda nima o'zgaradi
- Ostida karta (bittadan): «Kim nima qiladi» matni va besh sabab: `qoshildi` · `chiqdi` · `tasdiqladi` · `navbatga-yozildi` · `elon-berildi`
  1. o'yinchi «Qo'shilaman» ni bosadi — ✔ `qoshildi`
  2. o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa) — ✔ `chiqdi`
  3. o'yinchi «Kelaman» ni bosadi — ✔ `tasdiqladi`
  4. o'yinchi navbatga yoziladi — ✔ `navbatga-yozildi`
  5. tashkilotchi o'yin e'lon qiladi — ✔ `elon-berildi`
  - To'g'ri sabab → konvert `oyin-ozgardi · <sabab>` telefonga keladi → `GET /oyinlar` borib-qaytadi → telefondagi joy o'zgaradi → qator jadvalga tushadi
  - Boshqa sabab: Sabab o'yinchi nima qilganini aytadi — kartani qayta o'qing.
- Jadval qatorlari (to'lgach):

| Real vaqt nuqtasi | Kim nima qiladi | Hodisa | Kim oladi | Ekranda nima o'zgaradi |
|---|---|---|---|---|
| «8 / 10» va qo'shilganlar ro'yxati | o'yinchi «Qo'shilaman» ni bosadi | `oyin-ozgardi` · sabab `qoshildi` | hamma ulangan ilova | «8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi |
| «8 / 10» va qo'shilganlar ro'yxati | o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa) | `oyin-ozgardi` · sabab `chiqdi` | hamma ulangan ilova | son va ro'yxat yangilanadi |
| «Kelaman» belgilari | o'yinchi «Kelaman» ni bosadi | `oyin-ozgardi` · sabab `tasdiqladi` | hamma ulangan ilova | «Kelishini tasdiqladi: 7 / 9» → «8 / 9» |
| «Navbatda: N» | o'yinchi navbatga yoziladi | `oyin-ozgardi` · sabab `navbatga-yozildi` | hamma ulangan ilova | «Navbatda: 1» |
| o'yinlar ro'yxati | tashkilotchi o'yin e'lon qiladi | `oyin-ozgardi` · sabab `elon-berildi` | hamma ulangan ilova | ro'yxatda yangi karta |

- Nom qatori: Kim nima qilganda qaysi hodisa kimga borishi va ekranda nima o'zgarishi yozilgan jadval — **real vaqt oqimi sxemasi**.
- Natija: Taxminingiz to'g'ri chiqdi ✓ (yoki: Taxminingiz ✕ — Mentor misolida: bitta — `oyin-ozgardi`, besh sabab bilan)
- Xulosa: Mentor misolida bitta hodisa besh sabab bilan keladi; har qatorda kim olishi va nima o'zgarishi yozilgan.
- Izoh: Sxema — reja: hodisalar hali yuborilmaydi; Mentorning sodda variantida ular hamma ulangan ilovaga boradi.
- Tugma: Avval o'zingiz belgilab ko'ring → Qatorlarni to'ldiring (N/5) → Davom etish

## 13 · O'z sxemangiz
- Eyebrow: Mustaqil ish · sxema
- Sarlavha: Mahsulotingiz uchun *real vaqt oqimi sxemasini* yozing.
- Mentor: 11-Modulda README'ga yozgan real vaqt nuqtalaringizdan boshlang: har nuqtaga bitta qator.
- Bitta katta karta — besh maydon (raqam va savol maydon ichida):
  1. Qaysi joy boshqa odam tufayli o'zgaradi?
  2. Kim nima qiladi?
  3. Qaysi hodisa? Nomi · sababi
  4. Hodisani kim oladi?
  5. Ekranda nima o'zgaradi?
- Karta ostida: Qator tayyor · Bekor qilish (qator bor bo'lsa) · Yordam
- Karta yopilgach: tepada ixcham qatorlar (✓ nuqta · hodisa · ekranda); tugmalar: Saqlash · + Yana qator (5 tagacha) · Yordam
- Yordam:
  - Mentor misoli: 1 «8 / 10» va qo'shilganlar ro'yxati · 2 o'yinchi «Qo'shilaman» ni bosadi · 3 oyin-ozgardi · sabab qoshildi · 4 hamma ulangan ilova · 5 «8 / 10» o'rniga «9 / 10»
  - Bu kursda hodisa nomi kichik harf va chiziqcha bilan, bo'lib o'tgan ish ma'nosida yoziladi: `oyin-ozgardi`. Bitta nom va bir necha sabab ham, har o'zgarishga alohida nom ham bo'ladi — qaror sizniki.
  - Mahsulotingizda boshqa odam o'zgartiradigan joy bo'lmasa — o'zingiz ikkinchi qurilmada o'zgartiradigan ma'lumotni oling: telefonda qo'shdingiz, kompyuterda ko'rinsin.
- Shart xabari: Kamida bitta qator kerak; har qatorda beshta katak to'lsin.
- Saqlagach: Sxema · N qator ✓
- Xulosa: Sxemangiz saqlandi — amaliyotda u README'ga ko'chiriladi.
- Tugma: Saqlang → Davom etish

## 14 · Hodisa yo'li
- Eyebrow: Yakuniy · tartib
- Sarlavha: O'zgarish sizning ekraningizga *qaysi tartibda* yetadi?
- Mentor: Bo'laklarni bajariladigan tartibda joylang.
- Bo'laklar (to'g'ri tartib; ekranda aralash), uyalarda raqam va «bu yerga qo'ying»:
  1. Ilova Backend'ga token bilan ulanadi
  2. Boshqa o'yinchi «Qo'shilaman» ni bosadi
  3. Backend qo'shilishni Database'ga yozib tugatadi
  4. Backend `oyin-ozgardi` hodisasini yuboradi
  5. Ilova `GET /oyinlar` dan qayta so'raydi
  6. Ekraningizda «9 / 10» ko'rinadi
- Xato: Tartib mos emas — bo'lakni bosib qaytaring.
- Yechilgach: Bu misolda avval Database'dagi o'zgarish tugaydi, keyin hodisa yuboriladi — ilova yangi sonni oladi.
  - Oldin xato bo'lgan bo'lsa: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: Avval bo'laklarni joylang → Davom etish

## 15 · Amaliyot 1 — ilova Backend'ga ulanadi
- Eyebrow: Amaliyot 1 · o'z repo'ngiz
- Sarlavha: Mahsulotingiz Backend'ga ulansin va *belgi ko'rsatsin*.
- Mentor: Talab tayyor — ikki joyni o'z mahsulotingiz bilan to'ldirasiz; «1 · Ochish»dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Trek saqlanmagan bo'lsa: Trekingiz: Mobil trek · Web-trek
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching (11-Modul oxiridagi holat: kirish ishlaydi, ro'yxat Backend'dan keladi). Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin; ko'rinsa, agentga: «`.env` fayllarini `.gitignore` ga qo'sh.»
     - Mobil trekda `cd mobil`, `npx expo start` ishlab tursin va ilova telefoningizda ochiq bo'lsin; web-trekda saytingiz Netlify'da ochiq tursin.
     - Belgi turadigan ekranni tanlang: Mentor misolida — «O'yinlar» (eng ko'p ochiladigan ekran); mahsulotingizda — foydalanuvchi eng ko'p vaqt o'tkazadigan ekran.
  2. **Prompt** — qavslarni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash), mobil trek:
       > Qayerda: `backend/` — yangi gateway (NestJS, socket.io: `@nestjs/websockets` va `@nestjs/platform-socket.io`); `mobil/` — yangi fayl `src/ulanish.ts` (`socket.io-client`) va {belgi turadigan ekran}.
       > Nima qilsin: ilova kirgandan keyin Backend'ga bir marta ulansin va ulanayotganda tokenni yuborsin (`auth`); manzil — `EXPO_PUBLIC_API_URL`. Backend tokenni ulanish ochilayotganda tekshirsin: token yo'q yoki yaroqsiz bo'lsa — ulanishni yopsin. Ilova tokenni o'qib bo'lgandan keyingina ulansin. `README.md` «Stek» qatoriga socket.io ni qo'sh.
       > {belgi turadigan ekran} tepasida ulanish belgisi tursin: ulangan — «Ulangan»; ulanish yo'q va ilova o'zi ulanishga urinayotgan bo'lsa — «Ulanmoqda…»; urinmayotgan bo'lsa — «Ulanmagan». «Hisobdan chiqish»da ulanish yopilsin; qayta kirilganda yangi token bilan ulansin. Ekran qayta ochilganda ulanish tinglovchilari ko'payib ketmasin.
       > Hozircha hech qanday hodisa yuborilmasin va tinglanmasin — faqat ulanish va belgi.
       > Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` fayllariga tegma. Paket kerak bo'lsa — `mobil/` da faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Web-trekda:
       > Qayerda: `backend/` — yangi gateway (NestJS, socket.io: `@nestjs/websockets` va `@nestjs/platform-socket.io`); gateway'da brauzer uchun CORS: faqat `WEB_ORIGIN` dagi manzilga ruxsat; `prototip/` — yangi fayl `src/ulanish.js` (`socket.io-client`) va {belgi turadigan sahifa}.
       > Nima qilsin: sayt kirgandan keyin Backend'ga bir marta ulansin va ulanayotganda tokenni yuborsin (`auth`); manzil — `VITE_API_URL`; token `localStorage` dan. Backend tokenni ulanish ochilayotganda tekshirsin: token yo'q yoki yaroqsiz bo'lsa — ulanishni yopsin. Sayt tokenni o'qib bo'lgandan keyingina ulansin. `README.md` «Stek» qatoriga socket.io ni qo'sh.
       > {belgi turadigan sahifa} tepasida ulanish belgisi tursin: ulangan — «Ulangan»; ulanish yo'q va sayt o'zi ulanishga urinayotgan bo'lsa — «Ulanmoqda…»; urinmayotgan bo'lsa — «Ulanmagan». «Hisobdan chiqish»da ulanish yopilsin; qayta kirilganda yangi token bilan ulansin. Sahifa qayta ochilganda ulanish tinglovchilari ko'payib ketmasin.
       > Hozircha hech qanday hodisa yuborilmasin va tinglanmasin — faqat ulanish va belgi.
       > Nima buzilmasin: {avvalgidek ishlashi kerak bo'lgan ishlar} avvalgidek ishlasin; «Yangilash» tugmasi qolsin. `.env` fayllariga tegma. Paket kerak bo'lsa — `npm install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Bo'sh qavs yonida kulrang namuna:
       - {belgi turadigan ekran} — masalan: «O'yinlar» ekrani (`src/app/index.tsx`)
       - {belgi turadigan sahifa} — masalan: «O'yinlar»
       - {avvalgidek ishlashi kerak bo'lgan ishlar} — masalan: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat (PRD saqlangan bo'lsa, qavs funksiyalaringiz bilan to'ldirilgan)
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `backend/` — yangi gateway (NestJS, socket.io: `@nestjs/websockets` va `@nestjs/platform-socket.io`); `mobil/` — yangi fayl `src/ulanish.ts` (`socket.io-client`) va «O'yinlar» ekrani (`src/app/index.tsx`).
       > Nima qilsin: ilova kirgandan keyin Backend'ga bir marta ulansin va ulanayotganda tokenni yuborsin (`auth`); manzil — `EXPO_PUBLIC_API_URL`. Backend tokenni ulanish ochilayotganda tekshirsin: token yo'q yoki yaroqsiz bo'lsa — ulanishni yopsin. Ilova tokenni o'qib bo'lgandan keyingina ulansin. `README.md` «Stek» qatoriga socket.io ni qo'sh.
       > «O'yinlar» ekrani tepasida ulanish belgisi tursin: ulangan — «Ulangan»; ulanish yo'q va ilova o'zi ulanishga urinayotgan bo'lsa — «Ulanmoqda…»; urinmayotgan bo'lsa — «Ulanmagan». «Hisobdan chiqish»da ulanish yopilsin; qayta kirilganda yangi token bilan ulansin. Ekran qayta ochilganda ulanish tinglovchilari ko'payib ketmasin.
       > Hozircha hech qanday hodisa yuborilmasin va tinglanmasin — faqat ulanish va belgi.
       > Nima buzilmasin: kirish, e'lon berish, qo'shilish, tasdiq, chiqish va navbat avvalgidek ishlasin; pastga tortib yangilash qolsin. `.env` fayllariga tegma. Paket kerak bo'lsa — `mobil/` da faqat `npx expo install` bilan. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; har faylni `git add <fayl>` bilan qo'shing, `git commit -m "ulanish"`, `git push`.
     - Render Backend'ning yangi versiyasini chiqaradi — Render sahifasida tugashini kuting (bir necha daqiqa cho'zilishi mumkin).
     - Mobil trekda `npx expo start` ishlab tursin: Expo Go ilovani odatda o'zi qayta yuklaydi (bo'lmasa — terminalda `r`). Web-trekda push'dan keyin Netlify saytni odatda o'zi yangilaydi.
     - Kutayotganda agentdan yozgan kodidagi ikki joyni ko'rsatishni so'rang — darsda ko'rgan `auth` va tokenni tekshiradigan qatorni o'z loyihangizda topasiz:
       > Yozgan fayllaringda ikki joyni fayl nomi va qator raqami bilan ko'rsat: ilovada tokenni yuboradigan `auth` qatori va Backend gateway'ida tokenni tekshiradigan qator.
       > Har biri nima qilishini bitta gap bilan ayt. Kodni o'zgartirma.
     - Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Telefonda tekshirish** — talabingizning har gapini bajarib ko'ring. Mentor misolida:
     - (1) Ilovani oching (kirgan holda): «O'yinlar» tepasida belgi «Ulangan» bo'lishi kerak. Bo'lmasa — bir daqiqagacha kuting: Render'ning bepul xizmati uxlab qolgan bo'lsa, birinchi ulanish cho'ziladi.
     - (2) Telefonda uchish rejimini yoqing: belgi «Ulanmoqda…» ga o'tishi kerak — darhol o'zgarmasligi mumkin: uzilishni aniqlash vaqt oladi (bir daqiqagacha). Uchish rejimini o'chiring: belgi «Ulangan» ga qaytishi kerak, odatda bir necha soniyada.
     - (3) Avvalgi ishlar: ro'yxatni pastga torting, bitta o'yinga qo'shilib ko'ring — avvalgidek ishlasin.
     - (4) Agentga yozing: «Backend'ga tokensiz ulanib ko'r va nima bo'lganini ayt.» Kutilgani — ulanish yopildi. Agent javobi — uning so'zi; belgini esa o'zingiz ko'rdingiz.
     - Mos kelmagan gapni agentga yozing: «{nima} talabdagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
     - Web-trekda: saytingizni telefon brauzerida oching va uchish rejimini telefonda yoqasiz — kompyuterda Wi-Fi'ni o'chirish dars sahifasini ham uzadi.
- O'ng — kutilgan natija · namuna: Maydon Jamoa: telefon (Expo Go; O'yinlar, belgi «Ulangan» → uchish rejimi, «Ulanmoqda…» → «Ulangan»; web-trekda brauzer oynasi `….netlify.app`) va fayllar: `backend/src/…gateway.ts` yangi · `mobil/src/ulanish.ts` yangi · `mobil/src/app/index.tsx` o'zgardi · `README.md` «Stek»: + socket.io (web-trekda `prototip/src/ulanish.js` yangi)
- Ostida: Ortda qoldingizmi — Mentor misolini yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m12-dars-02-done` — `backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozing.
- Ulgurmasangiz: Render kutishi cho'zilsa — 4-qadam uyga vazifaning 1-bandi; 3-qadamdan keyin «Davom etish» ochiladi — 2-amaliyotga o'ting.
- Hammasi bajarilgach: Mahsulotingiz Backend'ga ulangan: belgi ulanish holatini ko'rsatadi.
  - Izoh: Render'da yangi versiya chiqqanda ulanish uziladi — belgi bir lahza «Ulanmoqda…» bo'ladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 16 · Amaliyot 2 — sxema README'da
- Eyebrow: Amaliyot 2 · o'z repo'ngiz
- Sarlavha: Sxemangizni README'ga yozdiring va *tekshiring*.
- Mentor: Sxemani siz yozgansiz — agent faqat ko'chiradi, siz solishtirasiz; «1 · Ochish»dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Qadamlar:
  1. **Ochish** — `README.md` ni oching: «Arxitektura» bo'limida 11-Modulda yozilgan real vaqt nuqtalaringiz turibdi. Mustaqil ishdagi sxemangiz pastdagi talabga o'zi qo'yilgan — o'qib chiqing.
     - Sxemada odamlar roli bilan yoziladi (o'yinchi, tashkilotchi) — ism va boshqa shaxsiy ma'lumot README'ga yozilmaydi.
  2. **Prompt** — qatorlarni tekshiring (tahrirlasangiz bo'ladi), oxirgi qavsni o'zingiz yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: `README.md` — yangi «Real vaqt» bo'limi, «Arxitektura» bo'limidan keyin.
       > Nima qilsin: pastdagi qatorlarni besh ustunli jadval qilib yoz: real vaqt nuqtasi · kim nima qiladi · hodisa · kim oladi · ekranda nima o'zgaradi. So'zlarimni o'zgartirma, qator va hodisa qo'shma.
       > {sxema qatorlari} (mustaqil ishdagi sxemangiz saqlangan bo'lsa — har qator: nuqta | kim nima qiladi | hodisa | kim oladi | ekranda nima o'zgaradi)
       > Jadval ostiga bitta qator yoz: {hozirgi holat}
       > Nima buzilmasin: faqat `README.md`; boshqa bo'lim va fayllarga tegma. O'zgargan fayllarni ayt.
     - Bo'sh qavs yonida kulrang namuna:
       - {sxema qatorlari} — masalan: «8 / 10» va qo'shilganlar ro'yxati | o'yinchi «Qo'shilaman» ni bosadi | oyin-ozgardi · sabab qoshildi | hamma ulangan ilova | «8 / 10» → «9 / 10»
       - {hozirgi holat} — masalan: Hozircha faqat ulanish va belgi bor — hodisalar hali yuborilmaydi.
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `README.md` — yangi «Real vaqt» bo'limi, «Arxitektura» bo'limidan keyin.
       > Nima qilsin: pastdagi qatorlarni besh ustunli jadval qilib yoz: real vaqt nuqtasi · kim nima qiladi · hodisa · kim oladi · ekranda nima o'zgaradi. So'zlarimni o'zgartirma, qator va hodisa qo'shma.
       > «8 / 10» va qo'shilganlar ro'yxati | o'yinchi «Qo'shilaman» ni bosadi | oyin-ozgardi · sabab qoshildi | hamma ulangan ilova | «8 / 10» → «9 / 10», ro'yxatda yangi o'yinchi
       > «8 / 10» va qo'shilganlar ro'yxati | o'yinchi o'yindan chiqadi (navbatdagi kirsa — shu hodisa) | oyin-ozgardi · sabab chiqdi | hamma ulangan ilova | son va ro'yxat yangilanadi
       > «Kelaman» belgilari | o'yinchi «Kelaman» ni bosadi | oyin-ozgardi · sabab tasdiqladi | hamma ulangan ilova | «Kelishini tasdiqladi: 7 / 9» → «8 / 9»
       > «Navbatda: N» | o'yinchi navbatga yoziladi | oyin-ozgardi · sabab navbatga-yozildi | hamma ulangan ilova | «Navbatda: 1»
       > o'yinlar ro'yxati | tashkilotchi o'yin e'lon qiladi | oyin-ozgardi · sabab elon-berildi | hamma ulangan ilova | ro'yxatda yangi karta
       > Jadval ostiga yoz: `oyin-ozgardi` — `{ oyinId, sabab }`. Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi. Hozircha faqat ulanish va belgi bor — hodisalar hali yuborilmaydi.
       > Nima buzilmasin: faqat `README.md`; boshqa bo'lim va fayllarga tegma. O'zgargan fayllarni ayt.
  3. **Ko'rish** — `README.md` da «Real vaqt» bo'limi: jadval va ostidagi qator. Agent boshqa faylni ham o'zgartirgan bo'lsa: «Faqat README.md ni o'zgartir, qolganini qaytar.»
  4. **Tekshirish va GitHub** — har qatorni o'zingiz yozgani bilan solishtiring: beshta katak so'zma-so'z mosmi · agent qator yoki hodisa qo'shmaganmi · ostidagi qator hozirgi holatni aytadimi.
     - Farq bo'lsa, agentga: «{qaysi qator} men yozgandek emas: {qanday bo'lsin}. Faqat README.md ni o'zgartir.»
     - Mos bo'lsa — `git status`: o'zgargan fayl faqat `README.md`; `git add README.md`, `git commit -m "real vaqt sxemasi"`, `git push`. GitHub'da repo sahifasini yangilang — «Real vaqt» bo'limi ko'rinadi.
     - `git push` xato bersa — xato qatorini agentga yuboring (token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
- O'ng — kutilgan natija · namuna: Maydon Jamoa: `maydon-jamoa` · `README.md` — «Real vaqt»; sarlavha **Real vaqt**, besh ustunli jadval (12-ekrandagi besh qator), ostida: `oyin-ozgardi` — `{ oyinId, sabab }`. Hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi. Hozircha faqat ulanish va belgi bor — hodisalar hali yuborilmaydi.
- Ulgurmasangiz: bu blok uyga vazifaning 1-bandi — sxema darsda saqlangan.
- Hammasi bajarilgach: Sxemangiz README'da: har qatorini o'zingiz tekshirdingiz.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.
- Birinchi bosishgacha: Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon | Izoh |
|---|---|---|
| 11-Modulda ilova yangi sonni qachon olardi? | Ekran ochilganda va pastga tortib yangilaganda | Ilova so'ramasa, Backend o'zi yubora olmaydi |
| Doimiy ulanish nima? | Ilova bilan Backend orasida ochiq turadigan ulanish | Ikkalasi istagan payt xabar yubora oladi |
| WebSocket nima? | Doimiy ulanishni beradigan texnologiya | 10-Modulda sayt qayta-qayta so'rardi (polling) — bu boshqa yo'l |
| socket.io nima? | Doimiy ulanish bilan ishlashni osonlashtiradigan kutubxona | Imkon bo'lsa WebSocket orqali ulanadi; ilovada `socket.io-client` |
| Hodisa nima? | Ulanish orqali yuboriladigan nomli xabar | Nomi va ma'lumoti bor: `oyin-ozgardi` · `{ oyinId, sabab }` |
| Mentor misolida hodisa nimani aytadi? | Qaysi o'yin o'zgargani va sababini | Yangi holatni ilova Backend'dan qayta so'raydi |
| Tinglovchi nima? | Hodisa kelganda ishlaydigan kod | `ulanish.on('oyin-ozgardi', korsat)` |
| Ilova Backend'ga nima bilan ulanadi? | Token bilan | Token yo'q yoki yaroqsiz bo'lsa — Backend ulanishni yopadi |
| Ulanish belgisi qaysi uch holatni ko'rsatadi? | «Ulangan», «Ulanmoqda…», «Ulanmagan» | Mentor misolida — «O'yinlar» ekrani tepasida |
| «Ulanmoqda…» paytida bo'lgan hodisa nima bo'ladi? | Bu misolda kelmaydi | Pastga tortib yangilash shuning uchun qoladi |
| Real vaqt oqimi sxemasida qaysi besh ustun bor? | Nuqta · kim nima qiladi · hodisa · kim oladi · ekranda nima o'zgaradi | Mentor misolida besh qator, bitta hodisa nomi |
| Real vaqt nima? | O'zgarish bo'lgan zahoti ekranda ko'rinishi | Amalda — odatda bir necha soniyada; ulanish uzilsa, kechikadi |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Dars yakuni
- Eyebrow: Tayyor
- Yuqori yorliq: ✓ Ulanish va sxema tayyor (ikkala amaliyot bajarilgan bo'lsa; aks holda yorliq yo'q) · N/5 to'g'ri
- Sarlavha (holatga qarab):
  - ikkala amaliyot bajarilgan: Mahsulotingiz Backend'ga ulangan, sxema README'da.
  - faqat 1-amaliyot: Mahsulotingiz ulangan — sxemani README'ga yozish qoldi.
  - 1-amaliyot bajarilmagan, sxema saqlangan: Sxemangiz tayyor — ulanishni tugatish qoldi.
  - hech biri: Ulanish hali tugamagan — qadamlarni uyda tugating.
- CODE STRIKE arenasi (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - So'rov–javobda ilova so'ramasa, Backend unga hech narsa yubora olmaydi.
  - Doimiy ulanish ochiq turadi: ilova ham, Backend ham istagan payt xabar yubora oladi.
  - Bu misolda hodisa o'zgarish bo'lganini aytadi; yangi holatni ilova Backend'dan qayta so'raydi.
  - Ilova token bilan ulanadi; ulanish uzilishi mumkin — belgi uch holatdan birini ko'rsatadi.
  - Real vaqt oqimi sxemasi: kim nima qilganda qaysi hodisa kimga boradi va ekranda nima o'zgaradi.
- Uyga vazifa (tugma «Amaliy topshiriqni bajarish →»):
  - Kim uchun — o'z mahsulotingiz · Muddat — keyingi darsgacha
  1. **Tugatish** — darsda ulgurmagan qadamlarni bajaring: mahsulotingizda belgi «Ulangan» bo'lsin, README'da «Real vaqt» bo'limi tursin.
  2. **Tekshirish** — uyda uchish rejimini yana bir marta yoqib o'chiring: belgi uch holatdan qaysilarini ko'rsatdi? Kutilganidan farq bo'lsa — nima qilganingiz va nima ko'rganingizni bir qator yozib qo'ying.
  3. **Sxema** — mahsulotingizning har ekranini ochib chiqing: boshqa odam tufayli o'zgaradigan yana joy bormi? Sxemada 5 tadan kam qator bo'lsa — darsdagi sxema kartasiga va README'ga qo'shing.
  - Keyingi dars — **«Ekran o'zi yangilanishi uchun nimani yozasiz?»**: sxemangizdagi hodisalar talabga aylanadi.
- Nishonlaringiz — N/4 (to'rtta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Nishonlar
- **Event Reader** — Hodisa nimani olib kelishini topdingiz (6-ekran, birinchi urinishda to'g'ri)
- **Token Gate** — Yaroqsiz tokenda Backend nima qilishini bildingiz (8-ekran, birinchi urinishda to'g'ri)
- **Line Check** — Uzilish paytidagi hodisa kelmasligini topdingiz (11-ekran, birinchi urinishda to'g'ri)
- **Stay Connected** — Ikkala amaliyot blokini oxirigacha bajardingiz (16-ekran, oxirgi «Bajardim»; bonus)
- Nishon olinganda: nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 3-ekran (1-savol) — **Backend faqat so'rovga javob beradi**
   - 1 · Ilova so'raydi — Backend javob beradi.
   - 2 · So'rov bo'lmasa, Backend'dan ilovaga yo'l ochilmaydi.
   - 3 · Shuning uchun 11-Modulda son ekran ochilganda va pastga tortganda yangilanadi.
   - Sinfga savol: Ekran bir soat ochiq tursa-yu, hech kim uni tortmasa, son nima bo'ladi?
2. 6-ekran (2-savol) — **Hodisa aytadi, ilova so'raydi**
   - `oyin-ozgardi` · Hodisaning nomi bor
   - `{ oyinId: 1, sabab: 'qoshildi' }` · Ma'lumotida ikki maydon
   - `GET /oyinlar` · Yangi sonni ilova qayta so'raydi
   - Sinfga savol: Hodisa sonning o'zini olib kelsa, nima noqulay bo'lishi mumkin edi?
3. 8-ekran (3-savol) — **Ulanish token bilan**
   - `auth: { token }` · Ilova ulanayotganda tokenni yuboradi
   - `handleConnection(ulanish)` · Backend tokenni tekshiradi
   - `ulanish.disconnect()` · Token yaroqsiz bo'lsa, ulanish yopiladi
   - Sinfga savol: Token tekshirilmasa, kimlar ulana olardi?
4. 11-ekran (4-savol) — **Uch ulanish holati**
   - 1 · Ulangan — hodisalar keladi.
   - 2 · Ulanmoqda — ulanish yo'q, ilova o'zi ulanishga urinmoqda; shu payt bo'lgan hodisalar kelmaydi.
   - 3 · Ulanmagan — ilova urinmayapti.
   - Sinfga savol: Belgi yana «Ulangan» bo'ldi. Ekrandagi son yangimi — buni qanday bilasiz?
5. 14-ekran (yakuniy) — **Hodisa yo'li**
   - 1 · Ulanish · 2 · Bosish · 3 · Database'ga yozuv
   - `oyin-ozgardi` · 4 · Backend hodisa yuboradi
   - 5 · Ilova qayta so'raydi · 6 · «9 / 10» ko'rinadi
   - Sinfga savol: Backend hodisani Database'ga yozishdan oldin yuborsa, ilova qaysi sonni oladi?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Qayta ishlash · mustaqil rejimda: Keyingi → · Natijani ko'rish · jonli dars tugasa: «Jonli dars yakunlandi — testni o'zingiz davom ettiring:» · Mashq rejimida davom etish

1. Qayta-qayta so'rashda yangi son qachon ko'rinadi?
   - ✔ Keyingi so'rov yuborilganda
   - Database o'zgargan zahoti
   - Backend hodisa yuborganda
   - Ulanish qayta tiklanganda
2. Doimiy ulanishni kim ochadi?
   - Backend — ilovaga o'zi ulanadi
   - ✔ Ilova — Backend'ga ulanadi
   - Database — ikkalasiga ulanadi
   - Ikkinchi telefon — ulab beradi
3. WebSocket nima beradi?
   - Parolni tekshiradigan token
   - O'yinlar saqlanadigan jadval
   - ✔ Ochiq turadigan doimiy ulanish
   - Telefonga o'rnatiladigan fayl
4. Hodisaning qaysi ikki qismi bor?
   - Sarlavhasi va rasmi
   - Manzili va paroli
   - Jadvali va ustuni
   - ✔ Nomi va ma'lumoti
5. Hodisada `sabab: 'chiqdi'` nimani bildiradi?
   - ✔ O'yinchi o'yindan chiqdi
   - Ilova hisobdan chiqdi
   - Ulanish uzilib qoldi
   - Backend o'chib qoldi
6. Hodisa kelgach, Mentor ilovasi yangi sonni qayerdan oladi?
   - Hodisaning ma'lumotidan
   - ✔ Backend'dan qayta so'rab
   - Telefon xotirasidan
   - Ikkinchi telefondan
7. `ulanish.on('oyin-ozgardi', korsat)` qatori nima qiladi?
   - Hodisani Backend'ga qaytarib yuboradi
   - Ulanishni butunlay yopib qo'yadi
   - ✔ Hodisa kelganda `korsat` ni ishlatadi
   - Tugma bosilganda `korsat` ni ishlatadi
8. Backend ulanayotgan ilovani nimadan taniydi?
   - Yuborgan ismidan
   - Yozgan parolidan
   - Telefon rusumidan
   - ✔ Yuborgan tokenidan
9. Belgi «Ulanmagan». Bu nimani bildiradi?
   - ✔ Ilova ulanishga urinmayapti
   - Ilova qayta urinib turibdi
   - Hodisalar kelib turibdi
   - Backend sonni yangilayapti
10. Uchish rejimi o'chirildi. socket.io nima qiladi?
    - Foydalanuvchidan parol so'raydi
    - ✔ O'zi qayta ulanishga urinadi
    - Ilovani yopib, qayta ochadi
    - Hodisalarni Database'ga yozadi
11. Sxemadagi «Kim oladi» ustuni nimani aytadi?
    - Tugmani kim bosganini
    - Kodni kim yozib berganini
    - ✔ Hodisa kimga borishini
    - E'lonni kim berganini
12. Mentor sxemasida `elon-berildi` sababi qachon yuboriladi?
    - Yangi o'yinchi qo'shilganda
    - O'yinchi navbatga yozilganda
    - O'yinchi kelishini tasdiqlaganda
    - ✔ Tashkilotchi o'yin e'lon qilganda

## Kartochkalar
18-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 19-ekrandagi 5 qator.
- Keyingi dars — «Ekran o'zi yangilanishi uchun nimani yozasiz?».
