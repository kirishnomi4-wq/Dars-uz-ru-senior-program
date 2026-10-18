# 2-dars «Hodisalar tizimi: har harakat jadvalga yoziladi» — yakuniy matn

Fayl: `src/8-Modull/EventTrackingLesson.jsx` · 18 ekran · Keyingi dars: «Loyiha kuni: jonli dashboard»
Holat: 06.10.2026 — kodga mos

## 0 · Kirish — band bor, Umami'da yo'q
- Eyebrow: Dars · kirish
- Sarlavha: Band yozildi, Umami esa ko'rmadi. Nega?
- Mentor: O'tgan darsda bosh raqamni tanladingiz — haftada band qilingan vaqtlar. Shu telefonda «Maydon»ni oching va 18:00 ni band qiling.
- Maket — o'yinchi telefoni, manzil qatorida yorliq: Reklama to'sgichi: yoqilgan
  - Telefon bosh ekrani: Maydon (ilova belgisi) → ochilgach: Maydon · Bugun · kataklar 16:00 · 17:00 · 18:00 · 19:00 · 20:00 · 21:00
  - 18:00 bosilgach forma: Ism — Ali · Telefon — +998 90 000 00 01 · tugma: Band qilish → ✓ Band qilish
- Band qilingach telefon yonida ikki hisoblagich (konvert `POST /bandlar` uchadi):
  - Maydon jadvali: +1 band ✓
  - Umami (to'sgich belgisi bilan): 0
- Variantlar (band qilinmaguncha xira, ballsiz):
  - Umami son ko'rsatishga ulgurmadi
  - ✔ Bu telefonda Umami skripti ishlamadi
  - Band qilganda internet uzilib qoldi
- Javob izohlari:
  - 1-variant: **Qiziq fikr!** Kutsangiz ham son o'zgarmaydi: bu telefondan Umami'ga hech narsa kelmadi.
  - 2-variant: **Aynan!** Bu misolda reklama to'sgichi Umami skriptini to'sdi. Band esa Backend orqali Database'ga yozildi.
  - 3-variant: **Qiziq fikr!** Internet uzilsa, band ham yozilmasdi. Band esa jadvalda turibdi.
- Javobdan keyin: hisoblagichlar ostida bo'sh jadval kartasi `hodisalar` paydo bo'ladi.
- Tugma: Bittasini tanlang → Davom etish

## 1 · Reja
- Eyebrow: Reja
- Sarlavha: Bugun «Maydon» uch hodisani o'z jadvaliga yozadi.
- Mentor: Umami qoladi — yonida o'z jadvalimiz paydo bo'ladi. Kodning bir qismini Antigravity yozadi, uch chaqiruvni esa o'zingiz yozasiz.
- Chap yorliq: Dars oxirida — «Maydon» shunday yozadi
- Chap — «Hodisalar chizmasi», bir marta o'zi o'ynaydi:
  - Telefon ustida yorliq: Sayt · React `hodisaYoz`
  - Yo'lak: `POST /hodisalar` (band paytida `POST /bandlar`) · chetda kulrang Umami tuguni
  - O'ngda: Backend · NestJS (✓ 201) → Database · PostgreSQL: bandlar +1 band ✓ · jadval `hodisalar` (`id · nom · yaratilgan`)
  - Qatorlar: `1 · ochdi · 16:02` · `2 · vaqt-tanladi · 16:03` · `3 · band-qildi · 16:03`
- O'ng — qadamlar:
  - 01 · Harakat saytdan hodisa bo'lib chiqadi · `hodisa`
  - 02 · Backend hodisa nomini tekshiradi · `Backend`
  - 03 · Hodisa jadvalga ismsiz yoziladi · `Database`
  - 04 · Uch hodisa Umami bilan solishtiriladi · `uch hodisa`
- Pastki qator: repo `maydon` · boshlanish `m10-dars-02-start` · tayyor namuna `m10-dars-02-done`
- Tugmalar: Orqaga · Boshlaymiz

## 2 · Bitta bosish jadvalga
- Eyebrow: Tushuncha · hodisa
- Sarlavha: Bitta bosish jadvalga qanday yetib boradi?
- Mentor: Odam qaysi qadamda to'xtaganini ko'rish uchun har harakat yozib boriladi. Uch harakatni navbat bilan bajaring va chizmaga qarang.
- Bashorat (yorliq: Avval o'zingiz belgilab ko'ring): Uch harakatdan keyin `hodisalar` jadvalida nechta qator bo'ladi? · Bitta · Ikkita · Uchta
  - Tanlangach ixcham qator: Taxminingiz · savol · tanlov
- Chizma — 1-ekrandagidek (telefon · Backend · NestJS · Database · PostgreSQL · `hodisalar` · Umami), qatorlar bo'sh.
- Tugma telefon ostida (navbat bilan, N/3): Saytni oching 1/3 → 18:00 ni tanlang 2/3 → Band qiling 3/3
  - Har bosishda konvert telefondan Backend'ga uchadi, Backend ✓ 201, jadvalga qator tushadi: `1 · ochdi · 16:02` · `2 · vaqt-tanladi · 16:03` · `3 · band-qildi · 16:03`; Umami'ga alohida kulrang nuqta.
  - 3-qadamda avval `POST /bandlar` → bandlar +1 band ✓, keyin `band-qildi`.
- Joriy qator (birinchi qatordan keyin): Umami ochilishni o'zi yozardi. O'z jadvalimizga esa ochilish ham nom bilan keladi — `ochdi`.
- Natija bloki:
  - Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: uchta)
  - Jadvaldagi har qator — bitta hodisa.
  - Biz tanlagan uch harakatni sayt Backend'ga yuboradi; so'rov o'tsa, Backend jadvalga bitta qator yozadi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Harakatlarni bajaring (N/3) → Davom etish

## 3 · 1-savol
- Eyebrow: Mashq · 1-savol
- Savol: O'yinchi 18:00 ni tanladi. `vaqt-tanladi` jadvalga qanday yetadi?
  - Sayt uni to'g'ridan Database'ga yozadi
  - ✔ Sayt yuboradi, Backend jadvalga yozadi
  - Umami uni jadvalga o'zi ko'chirib qo'yadi
  - Backend uni saytdan o'zi so'rab oladi
- Javob izohlari:
  - To'g'ri: Sayt `POST /hodisalar` yuboradi, Database'ga esa faqat Backend yozadi.
  - 1-variant: `DATABASE_URL` Backend'da — sayt Database'ni ko'rmaydi.
  - 3-variant: Umami o'z hisobiga yozadi — bizning jadvalga tegmaydi.
  - 4-variant: Backend kutib turadi — hodisani sayt o'zi yuboradi.
  - Umumiy: Database'ga faqat Backend yozadi.
- Test ekranlarining umumiy yozuvlari (3, 5, 7, 10-ekranlarda bir xil):
  - Natija sarlavhasi: To'g'ri · Qaytadan urinib ko'ring · (jonli darsda) Javobingiz qabul qilindi → Hozir to'g'ri javobni bilib olasiz. · To'g'ri javob: <harf> — <variant>
  - Jonli darsda savol ostida: Jonli dars — bitta urinish, o'ylab bosing!
  - Xato javobdan keyin havola: Qisqa takrorlash — mavzuni yana bir ko'rish
  - Tugmalar: Orqaga · To'g'ri javobni toping (jonli darsda: Javob tanlang) → Davom etish

## 4 · Nom tekshiruvi
- Eyebrow: Tushuncha · Backend tekshiruvi
- Sarlavha: Nomi xato yozilgan hodisa jadvalga kiradimi?
- Mentor: Sayt kodida bitta harf adashsa, hodisa boshqa nom bilan keladi. Har so'rovni Backend'ga yuboring va jadvalga qarang.
- Bashorat: Sayt `Band qildi` deb yuborsa, nima bo'ladi? · Jadvalga yoziladi · Backend rad etadi
- Telefon ekranida bitta so'rov (navbat bilan): Maydon · `hodisaYoz('ochdi')` · POST /hodisalar · 1 / 5
  - So'rovlar tartibi: `ochdi` · `Band qildi` · `vaqt-tanladi` · `vaqt_tanladi` · `band-qildi`
  - Tugma telefon ostida: Yuborish 1/5 … 5/5
- Backend · NestJS tuguni ichida nomlar ro'yxati: `ochdi` · `vaqt-tanladi` · `band-qildi`
  - Nom ro'yxatda bo'lsa: ✓ 201, `hodisalar` ga qator tushadi (`16:21`, `16:22`, `16:23`)
  - Nom ro'yxatda bo'lmasa: 400, konvert qaytadi, Backend ostida sabab:
    - `Band qildi` — Ro'yxatda yo'q: katta harf va bo'sh joy.
    - `vaqt_tanladi` — Ro'yxatda yo'q: chiziqcha o'rniga pastki chiziq.
- Yuborilganlar qatori (chizma ostida): `ochdi` ✓ · `Band qildi` ✗ · `vaqt-tanladi` ✓ · `vaqt_tanladi` ✗ · `band-qildi` ✓
- Joriy qator (birinchi 400 dan keyin): Nom ro'yxatda bo'lmasa, Backend 400 qaytaradi — so'rov rad etiladi.
- Beshtasi yuborilgach Backend tugunida kalit: Tekshiruv: yoqilgan ↔ Tekshiruv: o'chirilgan · ostida: faqat shu maketda
  - O'chirilganda: nomlar ro'yxati kulrang, rad etilgan ikki so'rov qayta boradi va jadvalga qizg'ish qator bo'lib tushadi; jadval ostida sanoq: `ochdi` 1 · `vaqt-tanladi` 1 · `vaqt_tanladi` 1 · `band-qildi` 1 · `Band qildi` 1
  - Qayta yoqilsa — qizg'ish qatorlar o'chadi.
- Natija bloki:
  - Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: rad etildi)
  - «Maydon» Backend'i faqat shu uchta nomni qabul qiladi. Shunda bitta harakat ikki xil nom bilan sanalmaydi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → So'rovlarni yuboring (N/5) → Tekshiruvni o'chirib ko'ring → Davom etish

## 5 · 2-savol
- Eyebrow: Mashq · 2-savol
- Savol: Sayt `Band-qildi` deb yubordi. Backend nima qiladi?
  - Nomni o'zi tuzatib, jadvalga yozib qo'yadi
  - Yangi hodisa sifatida jadvalga qo'shadi
  - ✔ 400 bilan rad etadi, qator yozilmaydi
  - Saytni to'xtatib, xato sahifasini ochadi
- Javob izohlari:
  - To'g'ri: Ro'yxatda kichik harfli `band-qildi` bor — katta harfli nom rad etiladi.
  - 1-variant: Backend nomni tuzatmaydi — faqat ro'yxat bilan solishtiradi.
  - 2-variant: Yangi nom yozilsa, bitta harakat ikki xil sanaladi.
  - 4-variant: Backend saytni to'xtatmaydi — so'rovni oladi yoki rad etadi.
  - Umumiy: Backend nomni ro'yxat bilan solishtiradi.
- Umumiy yozuvlar va tugmalar — 3-ekrandagidek.

## 6 · Brauzer ID
- Eyebrow: Tushuncha · brauzer ID
- Sarlavha: Qaysi brauzer ochganini qanday ajratamiz?
- Mentor: Ism va telefonni hodisaga yozmaymiz — sahifani ochgan odam ularni hali bermagan. Uch harakatni bajaring va jadvalning yangi ustuniga qarang.
- Bashorat: 1-telefonda sahifa yangilansa, jadval uni yangi brauzer deb yozadimi? · Ha, yangi brauzer · Yo'q, o'sha brauzer
- Chapda ikki telefon (yorliqlar: 1-telefon · 2-telefon), har birining ichida pastki qator: Brauzer xotirasi (localStorage) — `maydon-brauzer: bo'sh`
  - 1-telefon ostida: Ochish 1/3 → Yangilash 2/3 → ✓ Yangilandi
  - 2-telefon ostida: Ochish 3/3 → ✓ Ochildi
- O'ngda jadval `hodisalar`: `id · nom · brauzer_id · yaratilgan` (yangi ustun `brauzer_id` ajralib turadi)
  - Ochish → xotirada `maydon-brauzer: 7f3a…` → qator `1 · ochdi · 7f3a… · 16:10`
  - Yangilash → o'sha `7f3a…` → qator `2 · ochdi · 7f3a… · 16:11`
  - 2-telefonda ochish → `maydon-brauzer: c91e…` → qator `3 · ochdi · c91e… · 16:12`
- Joriy qator (birinchi qatordan keyin): Brauzerni ajratadigan tasodifiy harf va raqamlar **brauzer ID** deyiladi. U odamning ismini ham, telefonini ham bildirmaydi.
- Natija bloki:
  - Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: o'sha brauzer)
  - Brauzer ID brauzer xotirasida turadi: sahifa yangilansa ham o'zgarmaydi, boshqa brauzerda yangisi olinadi.
  - Brauzer ID odamni emas, brauzerni ajratadi: bitta odam ikki telefonda — ikki brauzer.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Uchalasini bajaring (N/3) → Davom etish

## 7 · 3-savol
- Eyebrow: Mashq · 3-savol
- Savol: Bitta o'yinchi telefonda ham, laptopda ham ochdi. Nechta brauzer ID?
  - ✔ Ikkita — har brauzerda o'z ID si
  - Bitta — chunki ochgan odam bitta
  - Bitta — Backend ID larni bog'laydi
  - Hech qancha — u hali band qilmagan
- Javob izohlari:
  - To'g'ri: Brauzer ID odamni emas, brauzerni ajratadi — har brauzer o'z ID sini saqlaydi.
  - 2-variant: Brauzer ID ismni bilmaydi — odamni qayerdan taniydi?
  - 3-variant: Backend kelgan ID ni yozadi, ikkisini bog'lamaydi.
  - 4-variant: Brauzer ID sahifa ochilganda olinadi — band shart emas.
  - Umumiy: Har brauzer o'z ID sini saqlaydi.
- Umumiy yozuvlar va tugmalar — 3-ekrandagidek.

## 8 · Uch chaqiruv: hodisa qayerda yoziladi
- Eyebrow: Kod yozish · uch hodisa
- Sarlavha: Uch hodisani to'g'ri joyda yozadigan kod yozamiz.
- Mentor: `hodisaYoz` tayyor — uni qayerda chaqirishni siz tanlaysiz. Kodni o'zingiz terib yozasiz: qo'lda yozganda o'rganiladi.
- Chap — vazifa (bajarilgach raqamlar ✓ ga almashadi):
  1. Faylning boshiga yozing: `hodisaYoz('ochdi')`
  2. Katak bosilganda, `tanla(...)` dan keyin: `hodisaYoz('vaqt-tanladi')`
  3. `hodisaYoz('band-qildi')` ni band saqlangan joyga yozing — ikkala tekshiruvdan keyin (faqat 201 da).
- Vazifa ostida mini-telefon (Maydon) va uch qator (kirishda navbat bilan yonadi):
  1. sahifa ochildi · `ochdi`
  2. katak bosildi · `vaqt-tanladi`
  3. band saqlandi (201) · `band-qildi`
- Tugma: Yordam → Nom qo'shtirnoq ichida, kichik harf va chiziqcha bilan yoziladi. `band-qildi` tekshiruvlardan oldin tursa, saqlanmagan urinish ham sanaladi.
- O'ng — `app.js` (o'qish uchun; uch joy 1–3 belgisi bilan):

```js
// 1) sahifa ochildi — shu yerga

document.querySelectorAll('.katak').forEach(function (k) {
  k.addEventListener('click', function () {
    tanla(k.dataset.soat)
    // 2) shu yerga
  })
})

document.querySelector('#band').addEventListener('click', async function () {
  const javob = await saqla(tanlangan)
  if (javob.status === 409) {
    xabar('Bu vaqt band')
    return
  }
  if (javob.status !== 201) {
    xabar("Band qilib bo'lmadi")
    return
  }
  // 3) shu yerga
  xabar('Band qilindi: ' + tanlangan)
})
```

- Tugma: Kompilyatorni ochish · ostida: Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.
- Kompilyator oynasi:
  - Sarlavha: Kod yozish · app.js — uch hodisani to'g'ri joyda yozing
  - Fayllar: `app.js` (o'quvchi yozadi) · `index.html` (tayyor qism: sarlavha Maydon · kataklar 18:00 · 19:00 · 20:00 · tugma Band qilish · «hodisalar (namuna)» ro'yxati · izoh «Bu oynada jadval o'rniga ro'yxat»; ichida `maydon.js — tayyor qism, o'zgarmaydi`, namuna: 19:00 — 409, 20:00 — 500, boshqasi — 201)
  - Shartlar:
    - Sahifa ochilganda ochdi bir marta yozilsin.
    - Katak bosilganda vaqt-tanladi yozilsin.
    - Band saqlanmasa (409 yoki boshqa xato), band-qildi yozilmasin.
    - Band saqlanganda band-qildi bir marta yozilsin.
  - Shartlar bajarilgach — Davom etish (kompilyator yopiladi, o'ngda o'quvchi yozgan kod ko'rinadi).
- Bajarilgach: Hodisa harakat bo'lgan joyda yoziladi; `band-qildi` — faqat band saqlangandan keyin.
- Tugmalar: Orqaga · Kodni yozing → Davom etish

## 9 · Qator yoki brauzer
- Eyebrow: Tushuncha · sanoq
- Sarlavha: Qatorlarni sanaysizmi yoki brauzerlarni?
- Mentor: «Birinchi odam kirganda nimani ko'rasiz?» darsida uch son uch xil usulda sanalgan edi. Ikki usulni sinab, qaysi biri uch qadamni bir xil sanashini ko'ring.
- Bashorat: Bitta brauzerdan uchta katak tanlandi. «Vaqtni tanladi» qadamida u necha marta sanalsin? · Uch marta · Bir marta
- Chapda jadval `hodisalar` (`id · nom · brauzer_id`, har brauzer o'z rangida):

```
1 · ochdi        · 7f3a…
2 · ochdi        · c91e…
3 · vaqt-tanladi · 7f3a…
4 · ochdi        · e05b…
5 · vaqt-tanladi · 7f3a…
6 · ochdi        · 7f3a…
7 · vaqt-tanladi · c91e…
8 · vaqt-tanladi · 7f3a…
9 · band-qildi   · 7f3a…
```

- O'ngda uch hisoblagich: ochdi → vaqtni tanladi → band qildi (sonlar «?»)
- Ikki tugma (bashoratdan keyin, sinalgani ✓ bilan): Qatorlarni sanash · Turli brauzerlarni sanash
  - Qatorlarni sanash → qatorlar birma-bir sanaladi: 4 · 4 · 1
  - Turli brauzerlarni sanash → takror qatorlar kulrang bo'ladi: 3 · 2 · 1
- Ikkala usul sinalgach SQL kartasi:

```sql
SELECT nom, COUNT(DISTINCT brauzer_id)
FROM hodisalar
GROUP BY nom;
```

  - Ostida: Har hodisa nomi uchun takrorlanmagan brauzer ID lar sonini sanaydi.
- Natija bloki:
  - Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: bir marta)
  - Bu darsda sanoq sharti — har qadamda turli brauzerlar soni.
  - Qatorlar bitta brauzerni bir necha marta sanaydi. O'z jadvalimizdagi uch qadam bitta sanoq qoidasida bo'ladi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Ikki usulni sinang (N/2) → Davom etish

## 10 · 4-savol
- Eyebrow: Mashq · 4-savol
- Savol ustida jadval `hodisalar` (`id · nom · brauzer_id`): `1 · vaqt-tanladi · 7f3a…` · `2 · vaqt-tanladi · c91e…` · `3 · vaqt-tanladi · 7f3a…` · `4 · vaqt-tanladi · 7f3a…` · `5 · vaqt-tanladi · e05b…`
- Savol: Jadvalga qarang. «Vaqtni tanladi» qadamida nechta brauzer sanaladi?
  - Beshta — har qator bitta brauzer
  - Bitta — eng ko'p bosgan brauzer
  - Ikkita — faqat takrorlangan ID lar
  - ✔ Uchta — har brauzer bir marta
- Javob izohlari:
  - To'g'ri: Uch xil ID bor: `7f3a…` uch marta kelgan bo'lsa ham, bir marta sanaladi.
  - 1-variant: `7f3a…` uch marta keldi — bu uch brauzermi?
  - 2-variant: Bir brauzer ko'p bosgani boshqalarini o'chirmaydi.
  - 3-variant: Bir marta kelgan ID ham — alohida brauzer.
  - Umumiy: Har brauzer bir marta sanaladi.
- Umumiy yozuvlar va tugmalar — 3-ekrandagidek.

## 11 · Bir kun, ikki tizim
- Eyebrow: Tajriba · ikki tizim
- Sarlavha: Ikki tizim nega bir xil son bermadi?
- Mentor: Mentor misolida «Maydon»ning bir kuni ikki tizimda sanaldi. Kunni boshlang va har brauzer qayerga yetib borishiga qarang.
- Bashorat: Saytni ochganlarni qaysi tizim ko'proq sanaydi? · Umami · O'z jadvalimiz · Ikkalasi teng
- Chapda telefon (Sayt · React `hodisaYoz`): Maydon · 0 / 36 brauzer · tugma telefon ichida: Kunni boshlang
- O'ngda ikki hisoblagich, har biriga telefondan yo'lak:
  - Umami · Visitors (Umami sessiyalari) — 0 · ostida: Umami: o'z usuli bilan
  - O'z tizimimiz · `ochdi`, turli brauzer ID — 0 · ostida: biz: brauzer xotirasidagi ID
- Kunni boshlang → brauzerlar birin-ketin kiradi: telefondagi son 36 gacha o'sadi, har brauzerdan ikki nuqta — Umami'ga va Backend'ga. Ba'zi brauzerlarda manzil qatorida «Reklama to'sgichi: yoqilgan» chiqadi, ularning Umami nuqtasi yetmaydi; Umami yo'lagida yorliq: to'sgich · N.
- Yakunda: Umami 31 · o'z tizimimiz 36 · to'sgich · 5
- Natija bloki:
  - Taxminingiz to'g'ri chiqdi (yoki: Taxminingiz: … · haqiqatda: o'z jadvalimiz)
  - Ikki tizim brauzerni turlicha taniydi: Umami — o'z usuli bilan, biz — brauzer ID bilan. Shuning uchun sonlar teng bo'lishi shart emas.
  - O'z jadvalimizda qoida aniq: har hodisada turli brauzer ID lar. Farq sabablaridan biri — reklama to'sgichi.
- Tugmalar: Orqaga · Avval o'zingiz belgilab ko'ring → Kunni boshlang → Davom etish

## 12 · Yakuniy · band qilish tartibi
- Eyebrow: Yakuniy · tartib
- Sarlavha: Bitta band qilish jadvalga qanday yetadi?
- Mentor: Bo'laklarni sodir bo'lish tartibida joylang.
- Oltita uya — raqam va «bu yerga qo'ying».
- Bo'laklar (bu yerda to'g'ri tartibda; ekranda aralash; sudrash yoki bosish):
  1. O'yinchi «Band qilish»ni bosadi
  2. Sayt `POST /bandlar` yuboradi
  3. Backend bandni `bandlar` ga saqlaydi
  4. Sayt `band-qildi` ni brauzer ID bilan yuboradi
  5. Backend hodisa nomini tekshiradi
  6. `hodisalar` jadvaliga yangi qator tushadi
- Hamma uya to'lib tartib xato bo'lsa: Tartib xato — bo'lakni bosib qaytaring.
- Yechilgach: Avval band yuboriladi va saqlanadi, keyin hodisa yuboriladi, tekshiriladi va yoziladi.
  - Oldin xato bo'lgan bo'lsa, havola: Qisqa takrorlash — mavzuni yana bir ko'rish
- Tugmalar: Orqaga · Tartibni yig'ing → Davom etish

## 13 · Amaliyot 1 — `hodisalar` jadvali va `POST /hodisalar`
- Eyebrow: Amaliyot 1 · Backend → Database
- Sarlavha: Backend hodisani qabul qilib, jadvalga yozsin.
- Mentor: Kodni Antigravity yozadi — jadvalni va 400 ni esa siz terminal va Neon'da tekshirasiz. **«1 · Ochish»**dan boshlang.
- Qadamlar (bittadan ochiladi, har birida «Bajardim», bajarilgani bir qatorga yig'iladi, «Qaytarish» bilan qaytadi):
  1. Ochish — Antigravity'da `maydon` papkasini oching. Terminalda `cd backend`, keyin `npm run start:dev`; brauzerda `localhost:3000` — «Maydon Backend ishlayapti».
  2. Prompt — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · tugma: Nusxalash → ✓ Nusxalandi):
       - Qayerda: backend/ — band.entity.ts va bandlar.controller.ts dagidek.
       - Nima qilsin: hodisalar jadvali — id, nom (matn), brauzer_id (matn), yaratilgan. POST /hodisalar { nom, brauzer_id } ni olsin: nom faqat ochdi, vaqt-tanladi yoki band-qildi, brauzer_id — satr, 1–64 belgi; aks holda 400. To'g'ri bo'lsa, jadvalga bitta qator yozsin.
       - Nima buzilmasin: bandlar jadvali va boshqa yo'llar o'zgarmasin. O'zgargan fayllarni ayt.
  3. Ishga tushirish — Backend terminali o'zi qayta ishga tushadi, xato yo'q. Antigravity'ga yozing: «`POST /hodisalar` ga ikki so'rov yuborib tekshir: `ochdi` va `Band qildi`, `brauzer_id` — `tekshiruv`. Qaytgan sonlarni ayt.» Kutilgani: `201` va `400`.
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. Neon'da tekshirish — Neon'dagi SQL Editor'da: `SELECT * FROM hodisalar;` — bitta qator: `ochdi · tekshiruv`, `Band qildi` qatori yo'q. Agent nima desa ham, jadval shuni ko'rsatsin. So'ng tekshiruv qatorini o'chiring: `DELETE FROM hodisalar WHERE brauzer_id = 'tekshiruv';` — jadval bo'sh, sayt yozishga tayyor.
  5. O'z g'oyangiz — qavs ichini o'z loyihangiz bilan to'ldiring, «Nusxalash»ni bosing va saqlab qo'ying — uyda o'z papkangizda yuborasiz:
     - Uch hodisa nomi formasi (1 · 2 · 3; namuna: ochdi · vaqt-tanladi · band-qildi; xato nom — qizil ramka). Ostida: Uch hodisa — loyihangizdagi uch qadam; oxirgisi — bosh raqam hodisasi. Umami darsida saqlangan hodisa nomi bo'lsa, o'rtadagi qadamga o'zi qo'yiladi.
     - Prompt qutisi:
       - Qayerda: {loyiha papkasi}/backend.
       - Nima qilsin: hodisalar jadvali — id, nom, brauzer_id, yaratilgan. POST /hodisalar: nom faqat {uch hodisa nomi} dan biri, brauzer_id — satr, 1–64 belgi; aks holda 400.
       - Nima buzilmasin: boshqa jadvallar va yo'llar o'zgarmasin. O'zgargan fayllarni ayt.
     - Uch nom to'g'ri yozilmaguncha «Bajardim» ishlamaydi; yozilgach `{uch hodisa nomi}` o'rniga «<1-nom>, <2-nom> yoki <3-nom>» qo'yiladi.
- Yorliq (o'ngda): kutilgan natija · namuna: Maydon
- Kutilgan natija:
  - Antigravity · terminal: `POST /hodisalar · ochdi → 201` · `POST /hodisalar · Band qildi → 400`
  - Neon · SQL Editor: `SELECT * FROM hodisalar;` → `id · nom · brauzer_id · yaratilgan` · `1 · ochdi · tekshiruv · …`
- Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-02-start`
- Bajarilgach: Backend hodisani qabul qiladi: to'g'ri nom — jadvalga, xato nom — 400.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 14 · Amaliyot 2 — sayt uch hodisani yuboradi
- Eyebrow: Amaliyot 2 · sayt → hodisalar
- Sarlavha: Sayt uch hodisani o'z jadvalimizga yuborsin.
- Mentor: Yuborish funksiyasini Antigravity yozadi, uni qayerda chaqirishni — siz. **«1 · Ochish»**dan boshlang.
- Qadamlar:
  1. Ochish — Backend terminali ishlab tursin. Ikkinchi terminalda `cd web`, keyin `npm run dev`; brauzerda `localhost:5173` — kataklar chiqsin.
  2. Prompt — «Nusxalash»ni bosing va Antigravity'ga yuboring:
     - Prompt qutisi (Siz → Antigravity · tugma: Nusxalash → ✓ Nusxalandi):
       - Qayerda: yangi fayl web/src/hodisa.js; Backend manzili — api.js dagi API.
       - Nima qilsin: hodisaYoz(nom) POST /hodisalar ga { nom, brauzer_id } yuborsin. brauzer_id — localStorage'dagi maydon-brauzer; yo'q bo'lsa tasodifiy ID yaratib, shu kalitga saqlasin.
       - Nima buzilmasin: ism va telefon yuborilmasin; so'rov o'tmasa ham sayt ishlayversin, foydalanuvchiga xato ko'rsatilmasin — konsolda ogohlantirish qolsin. Boshqa fayllarga tegma — chaqiruvlarni men yozaman.
     - Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  3. Uch chaqiruv — qo'lda (nusxa tugmasi yo'q):
     - `web/src/main.jsx` — tepaga `import { hodisaYoz } from './hodisa.js'`; `const egami = …` dan keyin: `if (!egami) hodisaYoz('ochdi')` — `/ega` sahifasi o'yinchi emas, sanalmaydi.
     - `web/src/App.jsx` — tepaga o'sha import; `tanla` funksiyasi ichida: `hodisaYoz('vaqt-tanladi')`; `saqlandi` funksiyasi ichida (u band muvaffaqiyatli saqlangandan keyingina chaqiriladi), Umami'ning `band-qildi` chaqiruvi yonida: `hodisaYoz('band-qildi')`.
     - Saqlang — sayt o'zi yangilanadi.
  4. Ikki tizimda tekshirish —
     - avval Neon'dagi SQL Editor'da `SELECT nom, COUNT(DISTINCT brauzer_id) FROM hodisalar GROUP BY nom;` ni ishga tushirib, sonlarni yozib oling (bo'sh bo'lsa — 0).
     - Saytda bo'sh vaqtni tanlang va band qiling (ism va telefon — namuna), SQL'ni qayta ishga tushiring: yangi brauzer bo'lsa uch nom ham oshadi. Umami'da «Events» bo'limida `vaqt-tanladi` va `band-qildi` ham oshdi.
     - Keyin inkognito oynada (Chrome va Edge: Ctrl+Shift+N, Mac — Cmd+Shift+N) saytni oching va bitta vaqtni tanlang. SQL'ni qayta ishga tushiring: `ochdi` va `vaqt-tanladi` yana bittaga oshdi — yangi brauzer.
     - Aniq son emas, oshgani muhim: jadvalda oldingi urinishlar qolgan bo'lishi mumkin. Umami'da Visitors o'zgarmasligi mumkin — u brauzerni o'z usuli bilan taniydi. Jadvalda hech narsa yo'q bo'lsa — Backend terminali ishlayotganini tekshiring.
  5. O'z g'oyangiz — qavs ichini to'ldiring, «Nusxalash» — uyda o'z loyihangizda yuborasiz:
     - Prompt qutisi:
       - Qayerda: {loyiha papkasi}/web — yangi fayl hodisa.js.
       - Nima qilsin: hodisaYoz(nom) POST /hodisalar ga { nom, brauzer_id } yuborsin; brauzer_id — localStorage'dagi {loyiha nomi}-brauzer (yo'q bo'lsa tasodifiy ID).
       - Nima buzilmasin: ism va telefon yuborilmasin; so'rov o'tmasa ham sayt ishlayversin, konsolda ogohlantirish qolsin. Chaqiruvlarni ({uch hodisa nomi}) men yozaman.
- Yorliq (o'ngda): kutilgan natija · namuna: Maydon
- Kutilgan natija:
  - Neon · SQL Editor: `SELECT nom, COUNT(DISTINCT brauzer_id) FROM hodisalar GROUP BY nom;`

    | nom | oldin | band qilgach | inkognitodan keyin |
    |---|---|---|---|
    | ochdi | 0 | 1 | 2 |
    | vaqt-tanladi | 0 | 1 | 2 |
    | band-qildi | 0 | 1 | 1 |

    Ostida: toza jadvalda; sizda oldingi urinishlar bilan boshqacha bo'lishi mumkin
  - Umami · Events: `vaqt-tanladi` 2 · `band-qildi` 1
- Ortda qoldingizmi — mentor bilan: `git fetch https://github.com/Azizbekcrypto/maydon --tags` · `git checkout -f m10-dars-02-done`
- Bajarilgach: Uch hodisa o'z jadvalimizga yoziladi — Umami ham yozishda davom etadi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish

## 15 · Natijalar (podium) — jonli reyting

## 16 · Takrorlash
- Eyebrow: Takrorlash
- Sarlavha: O'zingizni sinab ko'ring.
- Kartochkalar (12 ta, «Kartochkalar» bo'limida); birinchi bosishgacha karta ostida: Kartani bosing — javob ochiladi
- Jonli dars davomida o'quvchiga bu ekran ko'rsatilmaydi — 15-ekrandan to'g'ri Yakunga o'tadi.
- Tugmalar: Orqaga · Yakunlash →

## 17 · Yakun
- Eyebrow: Tayyor
- Belgi: ✓ Uch hodisa jadvalda · N/5 to'g'ri
- Sarlavha: Hodisalar tizimi ishlayapti: uch hodisa jadvalda.
- Bugungi asosiy fikr: Hodisalar o'z jadvalimizda turgani uchun uch qadamni bitta qoida bilan sanaymiz: har qadamda turli brauzerlar soni.
- Jonli viktorina tugmasi: CODE STRIKE · kutish holatida: Mentorni kuting
- Karta «Endi siz bilasiz»:
  - Sayt hodisani Backend'ga yuboradi; so'rov o'tsa, Backend uni `hodisalar` jadvaliga bitta qator qilib yozadi.
  - «Maydon» Backend'i faqat uchta nomni qabul qiladi, boshqa nomga 400 qaytaradi.
  - Brauzer ID brauzerni ajratadi va odamning ismini ham, telefonini ham bildirmaydi.
  - `band-qildi` faqat band saqlangandan keyin yoziladi.
  - O'z jadvalimizda har qadamda turli brauzerlar sanaladi; Umami brauzerni boshqacha taniydi, shuning uchun farq tabiiy.
- Uyga vazifa tugmasi: Uyga vazifa · Amaliy topshiriqni bajarish → (fonda so'zlar: hodisa · hodisalar · brauzer ID · POST /hodisalar)
- Bosilgach karta «Uyda nima qilasiz?» (kim uchun — o'z loyihangiz · nechta — 3 hodisa · muddat — keyingi darsgacha):
  1. **Backend** — A1 dagi «O'z g'oyangiz» promptini loyihangizda yuboring: hodisalar jadvali va POST /hodisalar paydo bo'lsin.
  2. **Sayt** — A2 dagi promptni yuboring va uch chaqiruvni qo'lda yozing — har biri harakat bo'lgan joyda.
  3. **Ikki tizim** — push qiling, internetdagi saytingizni ikki kishi ochsin. Neon'dagi sanoqni Umami bilan solishtiring va farqni bir gapda yozing.
  - Izoh: Keyingi dars — **«Loyiha kuni: jonli dashboard»**. Talabni siz yozasiz, agent dashboard'ni (holat panelini) yig'adi: jadvaldagi hodisalar bir sahifada ko'rinadi.
- Nishonlaringiz — N/5 (olingan nishonda nomi va tavsifi, olinmaganida faqat nomi)
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Nishonlar
- Event Path — Hodisa jadvalga Backend orqali borishini bildingiz (3-ekran, 1-savol)
- Name Guard — Xato nomli hodisa nega yozilmasligini bildingiz (5-ekran, 2-savol)
- Two Browsers — Brauzer ID odamni emas, brauzerni ajratishini bildingiz (7-ekran, 3-savol)
- True Count — Har qadamda turli brauzerlarni sanadingiz (10-ekran, 4-savol)
- Own Events — Ikki amaliyot blokini oxirigacha bajardingiz (14-ekran, Amaliyot 2 — oxirgi «Bajardim»; bonus)
- Test nishonlari faqat birinchi urinishda to'g'ri javob uchun beriladi.
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting
- Yakun ekranida: Nishonlaringiz — N/5

## Qisqa takrorlash oynalari
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · oxirgi kartada: ✓ Tushunarli — davom etamiz

1. 1-savol (3-ekran) — «Hodisa Backend orqali yoziladi»
   - `hodisaYoz('vaqt-tanladi')` — Sayt harakatni yuboradi — POST /hodisalar.
   - `DATABASE_URL` — Backend'da turadi — Database'ga faqat Backend yozadi.
   - `hodisalar` — Jadvaldagi har qator — bitta hodisa.
   - Sinfga savol: Nega sayt Database'ga o'zi yozmaydi?
2. 2-savol (5-ekran) — «Uchta nom, boshqasi — 400»
   - `['ochdi', 'vaqt-tanladi', 'band-qildi']` — Backend'dagi ro'yxat — faqat shu nomlar yoziladi.
   - `400` — Nom ro'yxatda yo'q — so'rov rad etiladi, qator yozilmaydi.
   - `Band qildi` — Ro'yxat bo'lmasa — bitta harakat ikki nom bilan sanalardi.
   - Sinfga savol: Backend nomni nega o'zi tuzatmaydi?
3. 3-savol (7-ekran) — «Brauzer ID brauzerni ajratadi»
   - `maydon-brauzer` — Brauzer xotirasida turadi — sahifa yangilansa ham o'sha.
   - `7f3a… · c91e…` — Boshqa brauzer — boshqa ID.
   - `brauzer_id` — Ism ham, telefon ham yo'q — odamni emas, brauzerni ajratadi.
   - Sinfga savol: Bitta odam uch qurilmadan kirsa, nechta brauzer ID bo'ladi?
4. 4-savol (10-ekran) — «Turli brauzerlar soni»
   - `vaqt-tanladi · 7f3a…` — Uch marta kelsa ham — bir marta sanaladi.
   - `COUNT(DISTINCT brauzer_id)` — Takrorlanmagan brauzer ID lar soni.
   - `3 · 2 · 1` — Uch qadam bitta qoida bilan — sonlar bir o'lchovda.
   - Sinfga savol: Qatorlarni sanasak, qaysi qadamdagi to'xtash yashirinib qoladi?
5. Yakuniy (12-ekran, xato bo'lgandan keyin) — «Avval band, keyin hodisa»
   - `POST /bandlar` — Sayt bandni yuboradi, Backend saqlaydi.
   - `hodisaYoz('band-qildi')` — Saqlangandan keyin hodisa yuboriladi.
   - `201` — Nom to'g'ri — hodisalar ga qator tushadi.
   - Sinfga savol: band-qildi 409 tekshiruvidan oldin yuborilsa nima bo'ladi?

## Jonli viktorina (12 savol)
Lobby: CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM. Reytingdagi savol yorliqlari (dars testlari): 1 — Hodisa Backend orqali · 2 — Xato nom · 3 — Ikki brauzer · 4 — Turli brauzerlar · Yakuniy — band qilish tartibi
1. Hodisa nima?
   - ✔ Analitikaga yoziladigan bitta harakat
   - Database'dagi bitta yangi jadval ustuni
   - Saytdagi bitta bosiladigan katta tugma
   - Backend'dagi bitta yangi so'rov yo'li
2. `hodisalar` jadvalidagi bitta qator nimani bildiradi?
   - Bitta brauzerni
   - ✔ Bitta hodisani
   - Bitta o'yinchini
   - Bitta kunni
3. Sahifa ochilishini o'z jadvalimizga kim yuboradi?
   - Umami skripti uni o'zi yozib beradi
   - Database uni o'zi qo'shib qo'yadi
   - ✔ Sayt ochdi nomi bilan yuboradi
   - Backend har daqiqada o'zi qo'shadi
4. Hodisaga nega telefon raqami yozilmaydi?
   - Telefon raqami jadvalga sig'maydi
   - Backend raqamni o'qiy olmaydi
   - Umami raqamni o'zi yashiradi
   - ✔ Ochganlar hali raqam bermagan
5. Brauzer ID qayerda saqlanadi?
   - ✔ Brauzer xotirasida, localStorage'da
   - `bandlar` jadvalining alohida ustunida
   - Umami hisobidagi sayt sozlamalarida
   - Backend'dagi `.env` faylining ichida
6. O'yinchi sahifani yangiladi. Brauzer ID nima bo'ladi?
   - Har safar yangi ID olinadi
   - ✔ O'sha ID o'zgarmay qoladi
   - Telefon raqamiga almashadi
   - Backend uni o'chirib yuboradi
7. `band-qildi` qachon yuboriladi?
   - «Band qilish» bosilishi bilan
   - Forma ochilgan zahoti
   - ✔ Band saqlangandan keyin
   - Ega ro'yxatni ochganda
8. `COUNT(DISTINCT brauzer_id)` nimani sanaydi?
   - Jadvaldagi hamma qatorlar sonini
   - Turli hodisa nomlari sonini
   - Bo'sh vaqt kataklari sonini
   - ✔ Har xil brauzerlar sonini
9. Qatorlarni sanasak, qanday xato chiqadi?
   - ✔ Bir brauzer bir necha marta sanaladi
   - Band qilganlar umuman sanalmaydi
   - Umami sonlari ikki baravar bo'ladi
   - Bo'sh kataklar ham qator bo'lib qoladi
10. Umami 31, jadval 36. Bu nimani bildiradi?
   - Jadval xato — uni tuzatish kerak
   - ✔ Ikki tizim har xil usulda sanaydi
   - Umami xato — uni olib tashlaymiz
   - Besh kishi saytni ikki marta ochgan
11. Mentor misolida reklama to'sgichi nimani to'sdi?
   - `POST /bandlar` so'rovini
   - Saytdagi vaqt kataklarini
   - ✔ Umami skriptini
   - Brauzer xotirasini
12. Hodisalarni nega o'z Database'imizga ham yozamiz?
   - Umami endi umuman kerak emas
   - Sayt shunda tezroq ochiladi
   - Backend shunda hech uxlamaydi
   - ✔ Sonlarni o'zimiz sanay olamiz

Arena yozuvlari (o'quvchida, umumiy shablon): Tezroq to'g'ri bossangiz — ko'proq ball. Ketma-ket to'g'ri javoblar bonus beradi! · Mentor testni boshlashini kuting… · Javob qabul qilindi — natijani kuting… · Adashdingiz — 0 ball. Keyingisida olasiz! · Vaqt tugadi — 0 ball. Tezroq bo'ling! · Test yakunlandi! · eng uzun streak · ↻ Testni qayta ishlash — mashq (jadvalga yozilmaydi) · (jonli dars tugasa) Jonli dars yakunlandi — testni o'zingiz davom ettiring: · Mashq rejimida davom etish

## Kartochkalar
Oyna: Takrorlash — kartochkalar. Hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N. Tugmalar: ✗ Takrorlash · ✓ Bildim.

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Hodisa nima? | Analitikaga yoziladigan bitta harakat | Bizda — hodisalar jadvalidagi bitta qator |
| «Maydon»ning uch hodisasi qaysi? | ochdi · vaqt-tanladi · band-qildi | Uch qadam: ochdi, vaqtni tanladi, band qildi |
| Hodisa saytdan jadvalga qanday yetadi? | Sayt POST /hodisalar yuboradi, Backend jadvalga yozadi | Umami o'z hisobiga alohida yozadi |
| Nega o'z jadvalimizda sahifa ochilishi ham nom oladi? | Unga hech narsa o'zi yozilmaydi | Umami'da ochilish avtomatik yozilardi |
| Backend qaysi hodisa nomlarini yozadi? | Faqat uchtasini | Boshqa nom — 400, qator yozilmaydi |
| Nomlar ro'yxati nega kerak? | Bitta harakat ikki nom bilan sanalmasligi uchun | Masalan, Band qildi va band-qildi |
| Brauzer ID nima? | Bitta brauzerni ajratadigan tasodifiy harf va raqamlar | Ismni ham, telefonni ham bildirmaydi |
| Brauzer ID qayerda saqlanadi? | Brauzer xotirasida (localStorage) | Kalit maydon-brauzer — yangilansa ham o'sha |
| Bitta odam ikki telefonda ochsa, nechta brauzer ID bo'ladi? | Ikkita | Brauzer ID odamni emas, brauzerni ajratadi |
| band-qildi qachon yoziladi? | Band saqlangandan keyin | 409 qaytsa, yozilmaydi |
| Har qadamda nimani sanaymiz? | Turli brauzerlar sonini | COUNT(DISTINCT brauzer_id) |
| Umami va jadval soni nega farq qiladi? | Ikki tizim har xil usulda sanaydi | Sabablardan biri — reklama to'sgichi |

- Hammasi bilinganda: Hammasini bilasiz! · N/N atama yodlandi · ↻ Qaytadan takrorlash

## Yakun
Dars yakuni — 17-ekranda. Bugungi asosiy fikr: Hodisalar o'z jadvalimizda turgani uchun uch qadamni bitta qoida bilan sanaymiz: har qadamda turli brauzerlar soni.
Keyingi dars — «Loyiha kuni: jonli dashboard»: jadvaldagi hodisalar bir sahifada ko'rinadi.
