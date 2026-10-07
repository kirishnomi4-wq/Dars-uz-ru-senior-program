# 7-dars «Jonli prototip: qog'ozdan bosiladigan ekrangacha» — yakuniy matn

Fayl: `src/9-Modull/LivePrototypeLesson.jsx` · 20 ekran · Keyingi dars: «Arxitektura va platforma: web yoki mobil ilova»
Holat: 07.10.2026 — kodga mos

Darsning bitta vizuali — «Maydon Jamoa» telefoni uch holatda: qog'oz (qalam chizig'i) · prototip (toza, namuna ma'lumot) · jonli (animatsiya bilan).
Uch ekran: **O'yinlar** · **O'yin** · **E'lon berish**. Namuna ma'lumot (dars bo'yi bir xil):
- Shanba, 18:00 · Mahalla maydoni · 8 / 10
- Shanba, 20:00 · Maktab maydoni · 6 / 10
- Yakshanba, 10:00 · Park maydoni · 4 / 8
- Yakshanba, 17:00 · Mahalla maydoni · 9 / 10

O'yinlar ekrani: sarlavha «O'yinlar», to'rt o'yin kartasi (kun, soat, maydon, «8 / 10»), pastda «E'lon berish». O'yin ekrani: «‹ O'yinlar», «Shanba, 18:00», «Mahalla maydoni», «8 / 10», qo'shilganlar doiralari (10 ta joy), «Qo'shilaman» (bosilgach — «Qo'shildingiz», yangi doira ostida «Siz»). E'lon berish ekrani: «‹ O'yinlar», «E'lon berish», maydonlar Kun · Soat · Maydon · Nechta odam, «Yuborish».

## 0 · Kirish
- Eyebrow: Dars · kirish
- Sarlavha: O'yin kartasini bosdingiz — *nega hech narsa ochilmadi?*
- Mentor: PRD dagi birinchi funksiyani agentga bitta gapda berdik — agent qurgan ekranda Shanba 18:00 dagi o'yin kartasini bosing.
- Maket: telefon «Maydon Jamoa» — agent qurgan bitta uzun ekran: tepada forma (Kun · Soat · Maydon · Nechta odam · «Yuborish»), pastda to'rt o'yin kartasi (kun, soat, «8 / 10», maydon), har kartada «Qo'shilaman»; Shanba 18:00 kartasi halqada.
- Yonida agent chati:
  - Siz: PRD dagi o'yin e'loni va qo'shilish funksiyasini ilova qilib ber.
  - Antigravity: Tayyor! Ilova ochiladi.
- Kartani bosgach (kulrang qator): O'yin ekrani yo'q — kim qo'shilgani ko'rinmaydi
- Variantlar (karta bosilmaguncha xira, ballsiz):
  - Agent kodni hali oxirigacha yozmagan
  - O'yin ekranini hech kim chizmagan
  - Telefon bosilganini sezmay qoldi
- Javob izohlari:
  - «O'yin ekranini hech kim chizmagan» tanlansa: **Aynan!** Bu misolda PRD da nima qilinishi yozilgan, ekranlar esa chizilmagan — ekranlar tuzilishini agent o'zi tanladi.
  - «Agent kodni hali oxirigacha yozmagan» tanlansa: **Qiziq fikr!** Agent «Tayyor!» dedi va kod ishlayapti — lekin O'yin ekrani umuman yo'q.
  - «Telefon bosilganini sezmay qoldi» tanlansa: **Qiziq fikr!** Bosish ishladi — lekin kartaga hech qanday ekran ulanmagan.
- Tanlangandan keyin (ikkinchi kulrang qator): PRD: nima qilinadi ✓ · ekranlar: chizilmagan
- Tugma: Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun qog'ozdan *bosiladigan ekrangacha* borasiz.
- Mentor: Avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingiz uchun o'z repo'ngizda qilasiz.
- Chap — Dars oxirida: telefon bir marta o'zi o'ynaydi: O'yin ekrani qog'oz holatida → prototip holati → «Qo'shilaman» bosiladi → «8» → «9» (jonli)
- Reja:
  1. Qog'ozda ekranlarni chizish · wireframe
  2. Surat bilan talab yozish · talab
  3. Agent qurgan ekranlarni qog'ozdagi bilan solishtirish · prototip
  4. Uch animatsiya qo'shish · Motion
- Pastki qator: o'z repo'ngiz — bugun ochasiz · Mentor misoli `maydon-jamoa` · tayyor holat `m11-dars-07-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Funksiyadan ekranlarga
- Eyebrow: Tushuncha · ekranlar
- Sarlavha: Bitta funksiya *qaysi ekranlarga* bo'linadi?
- Mentor: Roadmap'dagi birinchi funksiya — o'yin e'loni va qo'shilish: avval gapni tanlang, so'ng mos ekranni bosing.
- Chap — karta «O'yin e'loni va qo'shilish», to'rt gap-tugma:
  1. Tashkilotchi kun, soat, maydon va nechta odamni yozadi
  2. O'yinchi kun bo'yicha o'yinlarni ko'radi
  3. O'yinchi bitta o'yinni ochib, kim qo'shilganini ko'radi
  4. O'yinchi «Qo'shilaman» ni bosadi va «8 / 10» o'zgaradi
- O'ng — qog'ozda uch bo'sh telefon ramkasi: O'yinlar · O'yin · E'lon berish. Hisoblagich: Joylandi: N / 4
  - To'g'ri ramka: gap ramkaga uchib kiradi va qalam chizig'idagi bo'lakka aylanadi; joylangan gap oldida ✓
  - Boshqa ramka: Bu ish boshqa ekranda bajariladi.
  - 4/4 da ramkalar orasida strelkalar chiziladi
- Xulosa: Bu misolda funksiya gaplari O'yinlar, O'yin va E'lon berish ekranlariga bo'lindi.
- Tugma: Gaplarni joylang (N/4) → Davom etish

## 3 · Qog'ozga nima tushadi?
- Eyebrow: Tushuncha · wireframe
- Sarlavha: O'yinlar ekrani *qog'ozda* qanday chiziladi?
- Mentor: Har bo'lak uchun tanlang: «Qog'ozga» yoki «Chizilmaydi».
- Bo'lak-karta bittadan (N / 6), tugmalar: Qog'ozga · Chizilmaydi
  1. «O'yinlar» sarlavhasi — ✔ Qog'ozga
  2. O'yin kartasi: kun, soat, maydon, «8 / 10» — ✔ Qog'ozga
  3. «E'lon berish» tugmasining joyi — ✔ Qog'ozga
  4. Kartadan O'yin ekraniga strelka — ✔ Qog'ozga
  5. Tugmaning yashil rangi — ✔ Chizilmaydi
  6. Sarlavhaning shrifti — ✔ Chizilmaydi
- Xato izohlari:
  - 1–4 da «Chizilmaydi»: Busiz ekranda qayerda nima turishi noma'lum qoladi.
  - 5–6 da «Qog'ozga»: Qog'ozdagi chizma rangsiz — bu keyin tanlanadi.
- O'ng — qog'ozda O'yinlar ekrani: «Qog'ozga» tanlangan bo'lak qalam bilan chiziladi (kartalarda «Sh 18:00 · Mahalla 8 / 10»; strelka «→ O'yin»); ostida kulrang ustun «Chizilmaydi». Hisoblagich: Saralandi: N / 6
- Nom qatori: Ekranning qog'ozdagi bunday sodda chizmasi **wireframe** deyiladi: qayerda nima turadi.
- Xulosa: Bugungi wireframe joyni va o'tishni ko'rsatadi: kartalar, tugmalar, strelkalar; rang va shrift tanlanmaydi.
- Tugma: Bo'laklarni saralang (N/6) → Davom etish

## 4 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: Wireframe chizyapsiz. *Unga nima kiradi?*
  - «Qo'shilaman» tugmasining rangi
  - ✔ «Qo'shilaman» tugmasining joyi
  - «O'yinlar» sarlavhasining shrifti
  - «Maydon Jamoa» logotipining shakli
- Javob izohlari:
  - To'g'ri: Wireframe qayerda nima turishini ko'rsatadi — rang va shrift keyin tanlanadi.
  - A: Bugungi wireframe'da rang tanlanmaydi — faqat joy.
  - C: Shrift — ko'rinish; wireframe uni ko'rsatmaydi.
  - D: Logotip chizilmaydi: wireframe sodda shakllardan iborat.
  - Umumiy: Wireframe qayerda nima turishini ko'rsatadi.
- Javob kartasi sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · urinish tugagach: To'g'ri javob: B — <variant> · jonli darsda: Javobingiz qabul qilindi — Hozir to'g'ri javobni bilib olasiz.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 5 · O'z mahsulotingiz qog'ozda
- Eyebrow: Mustaqil ish · qog'ozda
- Sarlavha: Mahsulotingiz ekranlarini *qog'ozga chizing*
- Mentor: Ekranni Figma kabi dasturda ham chizish mumkin, bugun esa qog'oz va qalam yetadi — shu chizmadan prototip quramiz. Har ekranni chizgach, uni shu yerga yozing.
- Tepada: Qaysi funksiya ekranlarini chizasiz?
  - PRD saqlangan bo'lsa — 5-darsdagi funksiyalaringiz (uch tugma, bittasini tanlaysiz)
  - Saqlanmagan bo'lsa — Birinchi funksiyangizni bir gapda yozing (masalan: o'yin e'loni va qo'shilish)
- Taymer: 15:00 · Taymerni boshlash; vaqt tugasa: Vaqt tugadi — chizganingizni yozing
- Doiralar 1 · 2 · 3 (3-doira ostida: kerak bo'lsa), har birida forma:
  - Ekran nomi (masalan: O'yinlar)
  - Unda nima turadi (masalan: o'yinlar ro'yxati, har kartada soat)
  - Asosiy tugma va u qaysi ekranni ochadi (masalan: karta → O'yin)
- Yonida kichik qog'oz: yozilgan ekran nomlari, ichidagi narsa va tugma; tugma yozilsa keyingi ramkaga strelka
- Tugmalar: Yordam · Saqlash
  - Yordam: Qaysi ekranlar kerakligini bilmasangiz, funksiyangiz gaplarini oling: kim nima qiladi va bu qaysi ekranda bo'ladi?
  - Shart xabari: Kamida ikki ekranning nomi va tugmasini yozing.
- Saqlagach: Ekranlar · N · ✓ · ekran nomlari strelka bilan
- Xulosa: Wireframe'ingiz tayyor. Uni telefoningiz bilan suratga oling — amaliyotda kerak bo'ladi.
- Tugma: Saqlang → Davom etish

## 6 · Bosiladi, lekin saqlamaydi
- Eyebrow: Tushuncha · prototip
- Sarlavha: Bosiladigan ekranlar uchun *Backend kerakmi?*
- Mentor: Bu misolda Maydon Jamoa ekranlari namuna ma'lumot bilan qurilgan — «Qo'shilaman» ni bosing, keyin sahifani yangilang.
- Bashorat (Avval o'zingiz belgilab ko'ring): Sahifa yangilansa, nima ko'rinadi? · «8 / 10» · «9 / 10»
  - Tanlangach ixcham qator: Taxminingiz · savol · tanlov
- Chap — telefon (prototip, O'yin ekrani), ustida brauzer qatori va tugma «↻ Yangilash» («Qo'shilaman» dan keyin faollashadi)
- O'ng — fayl `prototip/src/namuna.js`:
```js
export const oyinlar = [
  { kun: 'Shanba', soat: '18:00', maydon: 'Mahalla maydoni', qoshilgan: 8, kerak: 10 },
  // … yana 3 ta o'yin
];
```
  - Ostida: Backend — yo'q · Database — yo'q
  - «Qo'shilaman» dan keyin: «9 / 10», tugma «Qo'shildingiz»; fayl yonida: fayl o'zgarmadi
  - «Yangilash» dan keyin: ekran qayta chiziladi — yana «8 / 10», «Qo'shilaman»; `qoshilgan: 8` bir marta yonadi
- Nom qatori: Bosiladigan, lekin hali haqiqiy ma'lumotsiz ekranlar **prototip** deyiladi.
- Natija: Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: «9 / 10» · haqiqatda: 8 / 10)
- Xulosa: Bu prototip bosiladi, lekin ma'lumotni saqlamaydi: ma'lumot `namuna.js` da, Backend yo'q.
- Tugma: Avval taxminingizni belgilang → Qo'shiling va yangilang (N/2) → Davom etish

## 7 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Prototipda yangi o'yin e'lon qildingiz. Sahifa yangilansa, *e'lon nima bo'ladi?*
  - Ro'yxatda qoladi — Database'ga yozildi
  - Ro'yxatda qoladi — brauzer eslab qoldi
  - ✔ Yo'qoladi — namuna boshidan ochiladi
  - Hammaga ko'rinadi — Backend yubordi
- Javob izohlari:
  - To'g'ri: Bu prototip ma'lumotni saqlamaydi: yangilanganda ro'yxat `namuna.js` dan qayta ochiladi.
  - A: Bu prototipda Database yo'q — e'lon hech qayerga yozilmadi.
  - B: Bu prototipda brauzerga hech narsa yozilmaydi.
  - D: Prototipda Backend yo'q — e'lonni hech kim olmaydi.
  - Umumiy: Bu prototip ma'lumotni saqlamaydi.
- Javob kartasi — 4-ekrandagidek.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 8 · Wireframe'dan talabga
- Eyebrow: Tushuncha · talab
- Sarlavha: Wireframe suratidan tashqari *agentga nima yoziladi?*
- Mentor: Har qator uchun bittasini tanlang va agent nima qurishini ko'ring.
- Chap — kichik surat `wireframe.jpg` va talabning uch qismi (bittadan):
  1. Qayerda: Loyihada · ✔ `prototip/` papkasida
     - «Loyihada»: Joy aytilmasa, agent fayllarni boshqa joyga qo'yishi mumkin.
  2. Nima qilsin: Chiroyli ilova qilsin · ✔ Uch ekran suratdagidek, namuna ma'lumot bilan, bosiladi
     - «Chiroyli ilova qilsin»: Ish aniq aytilmasa, agent bo'sh joyni o'zi to'ldirishi mumkin.
  3. Nima buzilmasin: Hech narsa yozilmagan · ✔ Haqiqiy ma'lumot va Backend yo'q
     - «Hech narsa yozilmagan»: Aytilmasa, agent Backend ham qurib ketishi mumkin.
- Vizual — telefon (avval qog'ozdagi `wireframe.jpg`, «Nima qilsin» tanlangach agent qurgan ekranlar) va repo daraxti `maydon-jamoa/` · `README.md` · `wireframe.jpg`:
  - «Loyihada» → ildizga `src/`, `index.html`, `package.json` sochiladi · aniq → `prototip/` ✓
  - «Chiroyli ilova qilsin» → telefonda Kirish (Telefon · Parol), Chat («Kim keladi?» · «Men» · «Yana ikki kishi kerak») ekranlari · aniq → O'yinlar, O'yin, E'lon berish
  - «Hech narsa yozilmagan» → daraxtda `backend/`
- 3/3 dan keyin talab qutisi: Qayerda: `prototip/` papkasi. Nima qilsin: wireframe suratidagidek uch ekran — O'yinlar, O'yin, E'lon berish; namuna ma'lumot bilan; ekranlar bosiladi. Nima buzilmasin: haqiqiy ma'lumot va Backend yo'q.
- Nom qatori: Uch qatorli bu matn — 9-Moduldagi **talab**; wireframe surati unga ilova.
- Xulosa: Surat ekranlarni ko'rsatadi, talab esa joyni, ishni va nimaga tegmaslikni aytadi.
- Tugma: Uch qismni tanlang (N/3) → Davom etish

## 9 · 3-savol
- Eyebrow: Mashq · 3-savol
- Savol: Talabning «nima buzilmasin» qatoriga *nimani yozasiz?*
  - ✔ Haqiqiy ma'lumot va Backend bo'lmasin
  - Uch ekran wireframe suratidagidek bo'lsin
  - Hamma fayl `prototip/` papkasida tursin
  - Ekranlar bir-biriga bosib o'tilsin
- Javob izohlari:
  - To'g'ri: Bu qator agentga nimaga tegmaslikni aytadi: bugun haqiqiy ma'lumot ham, Backend ham yo'q.
  - B: Bu — «nima qilsin» qatori: ekranlar qanday bo'lishi.
  - C: Bu — «qayerda» qatori: fayllar qaysi papkada.
  - D: Bu ham «nima qilsin» qatorida: ekranlar bosilishi.
  - Umumiy: Bu qator agentga nimaga tegmaslikni aytadi.
- Javob kartasi — 4-ekrandagidek.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 10 · Agent qurganini tekshirish
- Eyebrow: Tekshirish
- Sarlavha: Agent qurgan ekranlar *wireframe'ga mosmi?*
- Mentor: Agent ba'zi joyni taxmin qilishi mumkin — tepada bor, pastda yo'q bo'lakni bosing.
- Tepada — wireframe (qog'oz, uch ekran), pastda — agent qurgan prototip (uch ekran). Hisoblagich: Farq: N / 3
- Uch farq (topilgani qizil belgi, prototipda bo'sh joy), har biri «Tuzatish talabi» qutisiga qator bo'lib tushadi:
  - O'yinlar kartalariga «8 / 10»
  - O'yin ekraniga qo'shilganlar
  - E'lon berish formasiga «Nechta odam»
- Bor bo'lakni bossa: Bu joy ekranda bor — boshqasini qidiring.
- 3/3 da quti: `prototip/`: wireframe'dagidek qilinsin — O'yinlar kartalariga «8 / 10», O'yin ekraniga qo'shilganlar, E'lon berish formasiga «Nechta odam» qo'shilsin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  - Keyin prototipda yetishmagan bo'laklar paydo bo'ladi, belgilar yashilga o'tadi
- Xulosa: Agent qurganini wireframe bilan solishtirasiz; farqlarni bitta tuzatish talabida yuborasiz.
- Tugma: Farqlarni toping (N/3) → Davom etish

## 11 · Uch animatsiya
- Eyebrow: Tushuncha · jonli prototip
- Sarlavha: Animatsiya prototipga *nima qo'shadi?*
- Mentor: 9-Modulda Maydon kataklariga animatsiya yozgansiz, usullari o'sha — har kalitni yoqing va telefonda tekshirib ko'ring.
- Chap — uch kalit (bittadan faollashadi). Hisoblagich: Tekshirildi: N / 3
  1. Karta kichrayib qaytadi · `transform` + `transition`
  2. Son kattalashib, silliq qaytadi · `transition`
  3. Ekranlar silliq almashadi · Motion
- O'ng — telefon (O'yinlar ekrani), ustida yorliq «prototip»: kalit yoqilgach o'sha joy halqada — kartani, «Qo'shilaman» ni, «‹ O'yinlar» ni bosib tekshirasiz; 3/3 da yorliq «jonli prototip»
- Nom qatori: Animatsiyasi bor prototipni bu kursda **jonli prototip** deymiz.
- Xulosa: Uch animatsiya o'yinchiga javob beradi: bosildi, son o'zgardi, yangi ekran ochildi.
- Tugma: Uch kalitni tekshiring (N/3) → Davom etish

## 12 · Son silliq yangilanadi
- Eyebrow: Kod yozish · son
- Sarlavha: «9 / 10» ni *silliq ko'rsatadigan* kod yozamiz.
- Mentor: Shu animatsiyani kod oynasida CSS bilan o'zingiz terib yozasiz — nusxalab bo'lmaydi: qo'lda yozganda o'rganiladi.
- Vazifa:
  1. `.son` qoidasiga qo'shing: `transition: transform 0.3s;`
  2. `.son.yangi` qoidasini yozing: `transform: scale(1.3);`
  3. Natija oynasida «Qo'shilaman» ni bosing — son kattalashib, silliq qaytsin.
- Tugmalar: Yordam · Bajardim (kod oynasidan qaytgach ochiladi)
  - Yordam: Son kattalashmasa, `.son.yangi` da ikki klass orasida bo'sh joy yo'qligini va `0.3s` da «s» harfi borligini tekshiring.
- O'ng — `style.css` ko'rinishi va tugma «Kompilyatorni ochish»; ostida: Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.
- Kod oynasi: style.css — sonni silliq kattalashtiring
  - `style.css` (o'quvchi yozadi):
```css
.son {
  display: inline-block;
  /* 1) transition shu yerga */
}
/* 2) .son.yangi qoidasi shu yerga */
```
  - `index.html` (tayyor):
```html
<div class="oyin">
  <p>Shanba, 18:00 · Mahalla maydoni</p>
  <p class="hisob"><span class="son">8</span> / 10</p>
  <button class="tugma">Qo'shilaman</button>
</div>
```
  - `app.js` (tayyor):
```js
const son = document.querySelector('.son');
const tugma = document.querySelector('.tugma');
tugma.addEventListener('click', () => {
  son.textContent = 9;
  son.classList.add('yangi');
  setTimeout(() => son.classList.remove('yangi'), 300);
  tugma.disabled = true;
  tugma.textContent = "Qo'shildingiz";
});
```
  - Shart xabarlari: `.son` dagi `transition` da `transform` va vaqt bo'lsin. · `.son.yangi` ichida `transform: scale(1.3)` bo'lsin.
- Bajarilgach: o'ngda «Natija oynasi» — o'quvchining kodi bilan o'yin qatori, «Qo'shilaman» bosilsa son kattalashib qaytadi
- Xulosa: Son almashganda bir lahza kattalashib qaytadi — o'yinchi «9 / 10» bo'lganini sezadi.
- Tugma: Kodni yozing → Davom etish

## 13 · 4-savol
- Eyebrow: Mashq · 4-savol
- Savol: «Qo'shilaman» bosilganda son sakrab kattalashadi. *Nimani qo'shasiz?*
  - `.son` ga `transition: opacity 0.3s`
  - `.tugma` ga `transition: transform 0.3s`
  - `.son.yangi` ga `transform: scale(1)`
  - ✔ `.son` ga `transition: transform 0.3s`
- Javob izohlari:
  - To'g'ri: `transition` `.son` da tursa, son silliq kattalashadi va silliq qaytadi.
  - A: `opacity` shaffoflikni silliq qiladi, o'lcham esa sakraydi.
  - B: Bu tugmaga vaqt beradi — son esa sakrashda qoladi.
  - C: `scale(1)` o'lchamni o'zgartirmaydi — son kattalashmaydi.
  - Umumiy: `transition` `.son` da tursin.
- Javob kartasi — 4-ekrandagidek.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish

## 14 · Qog'ozdan jonli prototipgacha
- Eyebrow: Yakuniy · tartib
- Sarlavha: Qog'ozdan jonli prototipgacha *qaysi tartibda* borasiz?
- Mentor: Bo'laklarni bajariladigan tartibda joylang.
- Bo'laklar (to'g'ri tartib):
  1. Qog'ozda ekranlarni chizish
  2. Surat bilan talab yozish
  3. Agent qurgan ekranlarni qog'ozdagi bilan solishtirish
  4. Uch animatsiya qo'shish
- Uyalar: bu yerga qo'ying
- Xato: Tartib xato — bo'lakni bosib qaytaring.
- Yechilgach: Avval qog'oz va talab, keyin tekshirish; animatsiya ekranlar to'g'ri bo'lgandan keyin qo'shiladi.
- Xatodan keyin: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugma: Avval bo'laklarni joylang → Davom etish

## 15 · Amaliyot 1 — repo va bosiladigan ekranlar
- Eyebrow: Amaliyot 1 · o'z repo'ngiz
- Sarlavha: Repo oching va ekranlaringizni *bosiladigan qiling*.
- Mentor: Hamma qadamni o'z mahsulotingiz bilan qilasiz, o'ngda — namuna; **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — GitHub'da o'ng yuqoridagi «+» ni bosing va «New repository» ni tanlang. «Repository name» — mahsulotingiz nomi, lotin harfida, bo'sh joysiz
     - masalan: maydon-jamoa
     - Public; README qo'shishni yoqing; «Create repository». Nom band desa — oxiriga raqam qo'shing.
     - Kulrang: Repo ochiq — unga telefon raqami, manzil kabi shaxsiy ma'lumot yozmang.
     - Terminalda: `git clone https://github.com/{login}/{repo}.git` · `cd {repo}` — papkani Antigravity'da oching.
     - Wireframe suratini telefoningizdan kompyuterga o'tkazing va repo papkasiga `wireframe.jpg` nomi bilan qo'ying. 5-darsda yozgan `PRD.md` ni ham shu papkaga ko'chiring.
  2. **Prompt** — kulrang: Prototip brauzerda quriladi; telefon ko'rinishi — kichik ekranda tekshirish uchun, final platforma hali tanlanmagan.
     - qavslar mustaqil ishdagi yozuvingizdan to'ldirilgan; tekshiring, bo'sh qavsni yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: `prototip/` papkasi — yangi React + Vite loyihasi; `README.md`.
       > Nima qilsin: `wireframe.jpg` dagi ekranlar — {ekranlar va ulardagi narsalar}. Ma'lumot `prototip/src/namuna.js` da: {namuna ma'lumot}.
       > Ekranlar bir-biriga bosib o'tilsin: {qaysi tugma qaysi ekranni ochadi}. `README.md` ga shu talabni va `wireframe.jpg` suratini qo'sh.
       > Nima buzilmasin: haqiqiy ma'lumot va Backend yo'q — hammasi faqat ochiq sahifada. `prototip/` va `README.md` dan tashqariga tegma, o'zgargan fayllarni ayt.
     - Bo'sh qavs yonida kulrang namuna:
       - {ekranlar va ulardagi narsalar} — masalan: O'yinlar — o'yin kartalari: kun, soat, maydon, «8 / 10»; O'yin — qo'shilganlar, «Qo'shilaman»; E'lon berish — forma
       - {namuna ma'lumot} — masalan: 4 ta o'yin, Shanba va Yakshanba
       - {qaysi tugma qaysi ekranni ochadi} — masalan: karta → O'yin, «E'lon berish» → forma; «Qo'shilaman» sonni bittaga oshirsin
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `prototip/` papkasi — yangi React + Vite loyihasi; `README.md`.
       > Nima qilsin: `wireframe.jpg` dagi ekranlar — O'yinlar: o'yin kartalari, har birida kun, soat, maydon, «8 / 10», pastda «E'lon berish»; O'yin: «‹ O'yinlar», kun, soat, maydon, «8 / 10», qo'shilganlar (10 ta joy, ismsiz doiralar), «Qo'shilaman»;
       > E'lon berish: kun, soat, maydon, nechta odam, «Yuborish». Ma'lumot `prototip/src/namuna.js` da: 4 ta o'yin, Shanba va Yakshanba.
       > Ekranlar bir-biriga bosib o'tilsin: karta → O'yin, «E'lon berish» → E'lon berish, «Yuborish» → O'yinlar; «Qo'shilaman» sonni bittaga oshirsin. `README.md` ga shu talabni va `wireframe.jpg` suratini qo'sh.
       > Nima buzilmasin: haqiqiy ma'lumot va Backend yo'q — hammasi faqat ochiq sahifada. `prototip/` va `README.md` dan tashqariga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — terminalda `cd prototip`, `npm install`, `npm run dev` — xato yo'q. Brauzerda terminal ko'rsatgan manzilni oching (odatda `localhost:5173`).
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — telefon ko'rinishi: F12, keyin Ctrl+Shift+M (Mac: Cmd+Option+I, keyin Cmd+Shift+M). Talabning har qatorini tekshiring:
     - qayerda — repo'da `prototip/` papkasi bor, `README.md` da talab va surat
     - nima qilsin — har tugma kerakli ekranni ochadi, ekranlar wireframe suratingizdagidek
     - nima buzilmasin — `backend/` papkasi yo'q, sahifa yangilansa namuna boshidan ochiladi.
     - Farq bo'lsa, agentga: «{nima} wireframe'dagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- O'ng — kutilgan natija · namuna: Maydon Jamoa: telefon (prototip; O'yinlar, O'yin, E'lon berish navbat bilan almashadi) va repo daraxti `maydon-jamoa/` · `README.md` · `PRD.md` · `wireframe.jpg` · `prototip/` › `src/namuna.js`
- Ostida: Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-07-done`, keyin `prototip/` da `npm install`, `npm run dev`. Qanday ishlashini ko'rasiz va o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.
- Hammasi bajarilgach: Repo ochildi, ekranlar bosiladi va wireframe bilan bir xil.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 16 · Amaliyot 2 — uch animatsiya va GitHub
- Eyebrow: Amaliyot 2 · jonli prototip
- Sarlavha: Prototipingizga *uch animatsiya* qo'shing.
- Mentor: Animatsiyani agent yozadi, talabni siz berasiz — **«1 · Ochish»**dan boshlang.
  - Qadamlar orasida: Keyingi qadam — «N · <qadam>»: bajarib, «Bajardim»ni bosing.
  - Blok tugagach: Blok tugadi — «Davom etish»ni bosing.
- Qadamlar:
  1. **Ochish** — `prototip/` ishlab tursin (`npm run dev`), brauzerda telefon ko'rinishi ochiq.
  2. **Prompt** — qavslarni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · Nusxalash):
       > Qayerda: `prototip/` — `motion` paketini o'rnat.
       > Nima qilsin: {bosiladigan karta yoki tugma} bosilganda kichrayib qaytsin — `transform` va `transition`, 0,15 soniya. {o'zgaradigan son yoki yozuv} o'zgarganda bir lahza kattalashib, 0,3 soniyada silliq qaytsin.
       > Ekrandan ekranga o'tish Motion bilan silliq bo'lsin — 0,3 soniya.
       > Nima buzilmasin: ekranlar, namuna ma'lumot va bosish yo'llari o'zgarmasin; qurilmada harakat kamaytirilgan bo'lsa, kichrayish va surilish bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     - Bo'sh qavs yonida kulrang namuna:
       - {bosiladigan karta yoki tugma} — masalan: o'yin kartasi
       - {o'zgaradigan son yoki yozuv} — masalan: «8 / 10» dagi son
     - Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
       > Qayerda: `prototip/` — `motion` paketini o'rnat.
       > Nima qilsin: o'yin kartasi bosilganda kichrayib qaytsin — `transform` va `transition`, 0,15 soniya. «8 / 10» dagi son o'zgarganda bir lahza kattalashib, 0,3 soniyada silliq qaytsin.
       > Ekrandan ekranga o'tish Motion bilan silliq bo'lsin — 0,3 soniya.
       > Nima buzilmasin: ekranlar, namuna ma'lumot va bosish yo'llari o'zgarmasin; qurilmada harakat kamaytirilgan bo'lsa, kichrayish va surilish bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — sahifa o'zi yangilandi, terminalda xato yo'q.
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — talabning har qatori: bosiladigan joy kichrayib qaytadimi · son yoki yozuv kattalashib qaytadimi · ekranlar silliq almashadimi · ekranlar va bosish yo'llari o'sha-o'shami.
     - Hammasi mos bo'lsa — GitHub'ga: repo papkasida `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil bo'lsin; shularni qo'shing:
     - `git add README.md PRD.md wireframe.jpg prototip`, `git commit -m "jonli prototip"`, `git push`. GitHub'da repo sahifasini yangilang — README'da talab va wireframe surati ko'rinadi.
     - `git push` xato bersa: «Shu xato chiqdi: {xato}. Tuzat.»
- O'ng — kutilgan natija · namuna: Maydon Jamoa: telefon (jonli, o'zi aylanadi: karta bosiladi va kichrayib qaytadi → O'yin ekrani silliq kiradi → «Qo'shilaman» → «8» → «9» kattalashib qaytadi → ro'yxat silliq qaytadi) va GitHub sahifasi: `maydon-jamoa` · `README.md` · Talab · `wireframe.jpg` surati
- Hammasi bajarilgach: Prototip jonli: karta, son va ekranlar bosishga javob beradi; README'da talab va surat.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 17 · Natijalar (podium) — jonli reyting
Natijalar (podium) — jonli reyting

## 18 · Kartochkalar
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni *sinab ko'ring*.
- Birinchi bosishgacha: Kartani bosing — javob ochiladi

| Old tomon | Orqa tomon | Izoh |
|---|---|---|
| Wireframe nima? | Ekranning qog'ozdagi sodda chizmasi | Qayerda nima turadi |
| Wireframe'ga nima chizilmaydi? | Rang, shrift va logotip | Ular wireframe'dan keyin tanlanadi |
| Bu misolda o'yin e'loni funksiyasi qaysi ekranlarga bo'lindi? | O'yinlar, O'yin va E'lon berish | Har gap — o'zi bajariladigan ekranda |
| Prototip nima? | Bosiladigan, lekin hali haqiqiy ma'lumotsiz ekranlar | Ma'lumot — `namuna.js` da |
| Prototipda sahifa yangilansa, «9 / 10» nima bo'ladi? | «8 / 10» ga qaytadi | Bu prototip ma'lumotni saqlamaydi |
| Talab qaysi uch qatordan iborat? | Qayerda · nima qilsin · nima buzilmasin | Wireframe surati — talabga ilova |
| Bu darsda «nima buzilmasin» qatoriga nima yoziladi? | Haqiqiy ma'lumot va Backend yo'q | Prototip Backend'siz ishlaydi |
| Agent «Tayyor!» degach nima qilasiz? | Bosib, wireframe bilan solishtiraman | Farqlar — bitta tuzatish talabida |
| Bu kursda jonli prototip nima? | Animatsiyasi bor prototip | Karta, son va ekranlar orasidagi o'tish |
| Son silliq kattalashib qaytishi uchun `.son` ga nima yoziladi? | `transition: transform 0.3s;` | `.son.yangi` da — `transform: scale(1.3)` |
| Bu prototipda ekrandan ekranga silliq o'tishni nima qiladi? | Motion | Paket `motion` — 9-Modulda tanishgansiz |
| GitHub'da yangi repo qayerdan ochiladi? | «+» → «New repository» | Keyin kompyuterga `git clone` |

- Tugmalar: O'rganilmoqda · N · Bildim · N · karta ag'darilgach: Takrorlash · Bildim
- Oxirida: Hammasini bilasiz! · 12/12 atama yodlandi · Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Dars yakuni
- Eyebrow: Yakun
- Yuqori yorliq: ✓ Jonli prototip tayyor (2-amaliyot bajarilgan bo'lsa) · ✓ Prototip bosiladi (faqat 1-amaliyot) · 1-amaliyot bajarilmagan bo'lsa yorliq yo'q · N/5 to'g'ri
- Sarlavha (holatga qarab):
  - 2-amaliyot bajarilgan: Qog'ozdagi ekranlaringiz endi *bosiladi va jonli*.
  - faqat 1-amaliyot: Bosiladigan prototipingiz tayyor — *animatsiya uyda*.
  - 1-amaliyot bajarilmagan: Prototip boshlandi — *qolgan qadamlar uyda*.
- Bugungi asosiy fikr: Qog'ozdagi wireframe ekranni agentga aniq ko'rsatadi; namuna ma'lumot va animatsiya uni Backend'siz bosiladigan, jonli prototipga aylantiradi.
- CODE STRIKE arenasi (jonli darsda mentor boshlaguncha: Mentorni kuting)
- ✓ Endi siz bilasiz:
  - Wireframe — ekranning qog'ozdagi sodda chizmasi: qayerda nima turadi.
  - Talab uch qatordan iborat: qayerda, nima qilsin, nima buzilmasin; wireframe surati unga ilova.
  - Bu prototip bosiladi, lekin ma'lumotni saqlamaydi: ma'lumot namuna, Backend yo'q.
  - Agent qurganini wireframe bilan solishtirib, farqlarni bitta tuzatish talabida yuborasiz.
  - Uch animatsiya prototipni jonli qiladi: karta, son va ekranlar orasidagi o'tish.
- Uyga vazifa (tugma «Amaliy topshiriqni bajarish →»):
  - Kim uchun — o'z mahsulotingiz · Muddat — keyingi darsgacha
  1. **Tugatish** — darsda ulgurmagan qadamlarni o'z repo'ngizda bajaring: ekranlar bosilsin, uch animatsiya ishlasin.
  2. **README** — `README.md` da talab va wireframe surati tursin, GitHub'ga yuborilgan bo'lsin.
  3. **Tekshirish** — prototipni telefon ko'rinishida bosib chiqing: wireframe'dagi har tugma kerakli ekranni ochadimi?
  - Keyingi dars — **«Arxitektura va platforma: web yoki mobil ilova»**: prototip tayyor, endi uning ortida qanday qismlar turishi va qaysi platforma kerakligi navbati.
- Nishonlaringiz — N/4 (to'rtta nishon nomi va tavsifi — «Nishonlar» bo'limida)
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Nishonlar
- **Paper First** — Wireframe'ga nima kirishini topdingiz (4-ekran, birinchi urinishda to'g'ri)
- **Sample Data** — Prototip nimani saqlamasligini bildingiz (7-ekran, birinchi urinishda to'g'ri)
- **Clear Request** — Talabning «nima buzilmasin» qatorini topdingiz (9-ekran, birinchi urinishda to'g'ri)
- **Live Prototype** — Ikkala amaliyot blokini oxirigacha bajardingiz (16-ekran, oxirgi «Bajardim»; bonus)
- Nishon olinganda: nomi · tavsifi · bosib davom eting

## Qisqa takrorlash oynalari
Xato javobdan keyin o'quvchi «Qisqa takrorlash — mavzuni yana bir ko'rish» bilan ochadi; jonli darsda Mentor ekranidan. Yorliq: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz · Yopish

1. 4-ekran (1-savol) — **Wireframe — joy, rang emas**
   - 1 · Wireframe — ekranning qog'ozdagi sodda chizmasi: qayerda nima turadi.
   - 2 · Qog'ozga sarlavha, kartalar, tugmaning joyi va ekranlar orasidagi strelka chiziladi.
   - 3 · Rang, shrift va logotip chizilmaydi — ular keyin tanlanadi.
   - Sinfga savol: «Qo'shilaman» qayerda turishini qog'ozda qanday ko'rsatasiz?
2. 7-ekran (2-savol) — **Prototip saqlamaydi**
   - `qoshilgan: 8, kerak: 10` · Ma'lumot namuna fayldan keladi
   - «Qo'shilaman» dan keyin «9 / 10» faqat ochiq sahifada turadi — `src/namuna.js` o'zgarmaydi
   - `prototip/src/namuna.js` · Yangilansa, namuna boshidan ochiladi — yana «8 / 10»
   - Sinfga savol: Sahifa yangilanganda «8 / 10» qayerdan keladi?
3. 9-ekran (3-savol) — **Talabning uch qatori**
   - `prototip/` · Qayerda — papka
   - `wireframe.jpg` · Nima qilsin — wireframe suratidagidek uch ekran, namuna ma'lumot bilan, bosiladi
   - `backend/ yo'q` · Nima buzilmasin — haqiqiy ma'lumot va Backend yo'q
   - Sinfga savol: «Nima buzilmasin» qatori bo'lmasa, agent nima qilishi mumkin?
4. 13-ekran (4-savol) — **Son silliq qaytadi**
   - `.son.yangi { transform: scale(1.3); }` · Son kattalashadi
   - `.son { transition: transform 0.3s; }` · O'zgarishga vaqt beriladi
   - `setTimeout(…, 300)` · `transition` `.son` da — o'sishda ham, qaytishda ham silliq
   - Sinfga savol: `transition` faqat `.son.yangi` da tursa, qaytishda nima bo'ladi?
5. 14-ekran (yakuniy) — **Qog'ozdan jonli prototipgacha**
   - 1 · 2 · Qog'ozda ekranlarni chizish · Surat bilan talab yozish
   - 3 · Agent qurgan ekranlarni qog'ozdagi bilan solishtirish
   - 4 · Uch animatsiya qo'shish
   - Sinfga savol: Nega animatsiya ekranlar tekshirilgandan keyin qo'shiladi?

## Jonli viktorina (12 savol)
Arena: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · «Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi!» · «Mentor testni boshlashini kuting…» · «Javob qabul qilindi — natijani kuting…» · «Adashdingiz — 0 ball. Keyingisida olasiz!» · «Vaqt tugadi — 0 ball. Tezroq bo'ling!» · «Test yakunlandi!» · Qayta ishlash · mustaqil rejimda: Keyingi → · Natijani ko'rish · jonli dars tugasa: «Jonli dars yakunlandi — testni o'zingiz davom ettiring:» · Mashq rejimida davom etish

1. Wireframe nimani ko'rsatadi?
   - ✔ Ekranda qayerda nima turishini
   - Tugmalar qaysi rangda bo'lishini
   - Sarlavha qaysi shriftda yozilishini
   - Ma'lumot qayerda saqlanishini
2. Tashkilotchi kun va soatni qaysi ekranda yozadi?
   - O'yinlar ekranida
   - ✔ E'lon berish ekranida
   - O'yin ekranida
   - Kirish ekranida
3. Prototip qanday ekranlar?
   - Do'konga chiqqan birinchi versiya
   - Qog'ozdagi rangsiz, sodda chizma
   - ✔ Bosiladigan, lekin haqiqiy ma'lumotsiz
   - Backend va Database'ning to'liq chizmasi
4. Prototipdagi o'yinlar ro'yxati qayerdan keladi?
   - Database'dagi `oyinlar` jadvalidan
   - Backend'dagi yo'ldan
   - Telegram guruhidan
   - ✔ `namuna.js` faylidan
5. Bu darsda talabning «qayerda» qatoriga nima yoziladi?
   - ✔ `prototip/` papkasi
   - Telefon ekrani
   - GitHub sahifasi
   - `backend/` papkasi
6. Wireframe surati talabda nimaga kerak?
   - Agentga ekran ranglarini tanlab beradi
   - ✔ Ekranlar qanday joylashganini ko'rsatadi
   - Agentga Backend'ni ulashga yordam beradi
   - Talabning uch qatori o'rniga yuboriladi
7. Agent «Tayyor!» dedi. Keyin nima qilasiz?
   - Tekshirmasdan, uni GitHub'ga yuboraman
   - Talabni boshidan qayta yozaman
   - ✔ Bosib, wireframe bilan solishtiraman
   - Avval uch animatsiyani qo'shaman
8. Uchta farq topdingiz. Agentga qanday yozasiz?
   - Loyihani o'chirib, boshidan yozdiraman
   - Faqat eng kattasini yozaman
   - Hech narsa — agent o'zi topadi
   - ✔ Uchalasini bitta tuzatish talabida
9. Jonli prototip qanday prototip?
   - ✔ Animatsiyasi bor prototip
   - Telefonga o'rnatilgan prototip
   - Backend'ga ulangan prototip
   - Rangli chizilgan prototip
10. Karta bosilganda kichrayib qaytishi uchun nima kerak?
    - `transition` va `font-size`
    - ✔ `transform` va `transition`
    - `initial` va `exit`
    - `display` va `width`
11. Bu prototipda ekrandan ekranga silliq o'tishni nima qiladi?
    - `:active` holati
    - `scale(1.3)` qiymati
    - ✔ Motion kutubxonasi
    - `setTimeout` funksiyasi
12. GitHub'dagi repo'ni kompyuterga qaysi buyruq ko'chiradi?
    - `git push`
    - `git commit`
    - `git status`
    - ✔ `git clone`

## Kartochkalar
18-ekrandagi jadval (12 ta karta).

## Yakun
- Endi siz bilasiz — 19-ekrandagi 5 qator.
- Keyingi dars — «Arxitektura va platforma: web yoki mobil ilova».
