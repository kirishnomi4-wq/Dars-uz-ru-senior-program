# 2-Modul m2-12 «Praktika 4 — MVP tayyor (deploy)» — yakuniy matn

Fayl: `src/2-Modull/PracticeLesson4.jsx` · 8 ekran · Oldingi: «Praktika 3 — Dekompozitsiya (mini-do'kon)» · Keyingi: 3-Modul «React nima va nima uchun?» (m3-01)
Ip: o'sha `mini-dokon` papkasi (m2-11) — savat + jami narx → xato ovi → Netlify · AI: Gemini (Antigravity ishlatilmaydi)
JS darslaridan: massiv + `push`, `length`, `for` sikli funksiyada, matn va son farqi (`"3000"` ↔ `3000`)
Holat: 2026-10-17 — kodga mos (F-1015-343 → 357 → 362…365 dan keyin; foydalanuvchi ko'rigi «ancha yaxshi», tasdiq). `lessonId` = `practice-04-mvp-deploy-v18` (o'zgarmagan)
Zaxira: 19 ekranli — `arxiv/F-1015-practice4-oldin/`. Qurish: `qurish/f343.py` (zaxiradan) → `qurish/f362.py` (362–365, joyida).
Saqlov: localStorage `ccDokon` — m2-11 dagi `katalog`, `nom`, `rejaShart` o'qiladi (yo'q bo'lsa namuna «Maktab mini-do'koni»); `havola` yoziladi.

## 0 · Kirish
- Sarlavha: Do'kon bor, lekin hech narsa sotib olib bo'lmaydi.
- Mentor: O'tgan darsdagi katalog shu. Biror kartochkadagi «Savatga» tugmasini bosing — nima bo'ladi?
- Chapda «Katalog · o'tgan darsdan» — o'quvchining katalogi (namuna: Ruchka 3 000 · Chizg'ich 4 000 · Sharbat 6 000 · Suv 3 000 · Shokolad 8 000 · Pechenye 5 000 so'm). «Savatga» bosilsa tugma silkinadi, hech narsa bo'lmaydi.
- Xabar: «Hech narsa bo'lmadi — tugma bor, lekin bosilganini hech kim eslab qolmaydi.»
- «Nima yetishmayapti?» (ballsiz): ✔ Bosilgan mahsulotni eslab qoladigan savat · Tugmaning yorqinroq rangi · Ko'proq mahsulot
- Javob (216-qonun, F-1015-393): savat → «Aynan!» · rang → «Rang bosilganni eslab qolmaydi.» · ko'proq mahsulot → «Mahsulot ko'paysa ham, bosilgani eslanmaydi.» + «Bugun JavaScript bilan savat qo'shamiz va do'konni internetga chiqaramiz.»

## 1 · Reja
- Sarlavha: Do'konni oxiriga yetkazamiz.
- Mentor: O'tgan darsda katalog, toifa tugmalari va qidiruvni qurdingiz. Bugun savat va jami narxni qo'shasiz, xatoni topib tuzatasiz va do'konni internetga chiqarasiz — dars oxirida havolani do'stingizga yuborasiz.
- «Avval tayyorlaning · 3 qadam ▾» (yumshoq ramka; bosilsa **o'rtada oyna**, ✕ / Esc / fon bilan yopiladi — F-1015-362):
  1. VS Code'da o'tgan darsdagi `mini-dokon` papkasini oching, Go Live — katalog, toifa tugmalari va qidiruv ishlayaptimi?
  2. Boshqa oynada gemini.google.com'ni oching.
  3. netlify.com'ga GitHub bilan kiring — 1-moduldagi Netlify darsidagidek.
  - «Tayyor bo'lsa — «Boshlaymiz».»
- Chapda «Dars oxirida · namuna» — `mini-dokon.netlify.app`: savat ishlaydi (Savat · N, ro'yxat, Jami, Tozalash).
- O'ngda «REJA.md · o'tgan darsdan» + «Yangisini nusxalash»:
```
## Shart (MVP)
1. Mahsulot ro'yxati ✓
2. Kartochkalar ✓
3. Toifa tugmalari ✓
4. Qidiruv ✓
## Bugun
- Savat va jami narx
- Deploy
## Keyin
Sevimli · To'lov · Akkaunt bilan kirish
```
- «Bugungi 3 blok»: 01 Savat va jami narx (Gemini) · 02 Xatoni topish (siz + Gemini) · 03 Internetga chiqarish (Netlify)

## 2 · Amaliyot 1 · Gemini — savat va jami (a1)
- Sarlavha: Savat va jami narxni qo'shing.
- Mentor: Savat — bu **massiv**: «Savatga» bosilganda mahsulot unga `push` bilan qo'shiladi. Jami — **for sikli** bilan narxlar yig'indisi. Bosib ko'ring: `script.js` oynasidagi kod har safar o'zgaradi.
  - Shu ekranda biror bosish bo'lsa Mentor gapi yig'iladi («Mentor · ko'rsatmani ochish ▾»), kompyuterda ham (F-1015-364); bosilsa ochiladi.
- Chapda «Do'kon · bosib ko'ring» — jonli do'kon (Savat · N, ro'yxat, Jami, Tozalash).
- O'ngda (yuqoridan pastga):
  - **Prompt** + «Promptni nusxalash»:
```
«Maktab mini-do'koni» do'konimga savat va jami narx qo'sh. Toifa tugmalari va qidiruv ishlashda davom etsin.
1. script.js da savat massivi bo'lsin: let savat = [];
2. Har kartochkada «Savatga» tugmasi. Bosilganda mahsulot savat.push() bilan qo'shilsin.
3. Tepada «Savat: N» — savatdagi mahsulotlar soni (savat.length).
4. jamiHisobla() funksiyasi for sikli bilan savatdagi narxlarni qo'shib, «Jami: … so'm» qatoriga yozsin. Har qo'shilganda chaqirilsin.
Har bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.
Mana kodim:
{index.html, style.css va script.js kodini shu yerga qo'ying}
```
  - Nusxalangach prompt bitta qatorga yig'iladi: «✓ Prompt nusxalandi · Ko'rish ▾» (bosilsa ochiladi); kod oynasi yuqoriga ko'tariladi (F-1015-363).
  - **«script.js · qiymatlar hozir»** — har «Savatga»/«Tozalash»da o'zgargan 3 qator va sarlavha sariq yonadi; oyna ko'rinmasa ko'rinadigan joyga suriladi:
```
// oxirgi amal
savat.push("Sharbat");
// hozir
savat = ["Ruchka", "Sharbat"];  // savat.length = 2
jami = 9000;  // for: 3000 + 6000
```
  - «Qadamlar · 4 ▾»: 1. «Savatga»ni bosing — kod oynasida savat massivi qanday o'sishini ko'ring. · 2. «Promptni nusxalash» → gemini.google.com'ga qo'ying, oxiriga `index.html`, `style.css` va `script.js` kodini qo'shing va yuboring. · 3. Javobdagi fayllarni almashtiring, `Ctrl+S`. · 4. Live Server'da 2–3 mahsulot qo'shing: soni va jami to'g'rimi? Qo'lda hisoblab solishtiring.
- Nishon «Built It!» — «Davom etish»da (bonus).

## 3 · Amaliyot 2 · xato ovi (a2)
- Sarlavha: Xatoni toping va AI'ga **aniq** ayting.
- Mentor: AI yozgan kodda ham xato bo'ladi. Bu do'konda **bitta xato** yashiringan: 2 ta mahsulot qo'shing va jamiga qarang.
- Chapda «Do'kon · bitta xato bor» → tuzatilgach «Do'kon · tuzatildi». 2 mahsulotdan keyin jami qizil: «030006000 so'm».
- O'ngda:
  - «1 · Qaysi qismda xato?» — «Avval 2 ta mahsulotni savatga qo'shing.» · Savat soni · ✔ Jami narx · Mahsulot nomi
    - Savat soni → «Soni to'g'ri: nechta qo'shsangiz, shuncha. Jamiga qarang.»
    - Jami narx → «To'g'ri: 3000 + 6000 bo'lsa, 9 000 chiqishi kerak edi. Endi kodda sababini toping — aybdor qatorni bosing.»
  - «2 · Kodda qaysi qator aybdor?» — «Koddagi qatorni bosing.»
    - 7-qator → «Qo'shish shu yerda bo'ladi va qatorning o'zi to'g'ri. Narx qanday saqlangan? Massivga qarang.»
    - ✔ 2/3-qator → «Narx **qo'shtirnoqda** — demak bu matn. Matnga «+» yopishtiradi: `0 + "3000" = "03000"`. Son bo'lsa qo'shadi: `0 + 3000 = 3000`.» + «Qo'shtirnoqni olib tashlash» → «Tuzaldi! Narx endi son, jami to'g'ri: 9 000 so'm.» (qatorlar yashil)
  - «3 · Endi o'z do'koningizni tekshiring»: Bitta mahsulotni 2 marta qo'shing — soni 2, jami 2 barobar bo'ladimi? · 2 xil mahsulot qo'shing — jamini qo'lda hisoblab solishtiring. · Toifa tugmasini yoki qidiruvni ishlatib, keyin «Savatga»ni bosing — ishlaydimi?
    - «Xato topsangiz — AI'ga aniq yozing:» · «Nima bo'ldi?» · «Nima bo'lishi kerak?» → prompt:
```
Do'konimda xato bor — faqat shu joyni tuzat, qolganiga tegma.
Nima bo'ldi: {nima bo'ldi}
Nima bo'lishi kerak: {nima bo'lishi kerak}
Xato qaysi qatorda va nega bo'lganini bir gap bilan tushuntir. O'zgargan faylni to'liq qaytar.
{script.js kodini shu yerga qo'ying}
```
  - «Qadamlar · 4 ▾»: Do'konga 2 ta mahsulot qo'shing va jamiga qarang — qaysi qismda xato? · Kodda aybdor qatorni toping va tuzating. · O'z do'koningizni ro'yxat bo'yicha tekshiring. · Xato topsangiz — ikki maydonni to'ldiring va promptni Gemini'ga yuboring. Xato bo'lmasa — keyingi qadamga o'ting.
  - **`script.js`** (9 qator) — «Jami narx» tanlangach, «Qadamlar» ostida (F-1015-365):
```
1 let mahsulotlar = [
2   { nom: "Ruchka", narx: "3000" },
3   { nom: "Sharbat", narx: "6000" },
4 ];
5 function jamiHisobla() {
6   let jami = 0;
7   for (let i = 0; i < savat.length; i++) jami = jami + savat[i].narx;
8   jamiQator.textContent = "Jami: " + jami + " so'm";
9 }
```
- Nishon «Nice Fix!» — «Davom etish»da (bonus).

## 4 · Amaliyot 3 · Netlify (a3)
- Sarlavha: Do'konni internetga chiqaring.
- Mentor: 1-moduldagi yo'l: Netlify'ga papkani sudrab tashlaysiz — havola tayyor. Havolani shu yerga qo'ying: do'konni ulashadigan karta chiqadi.
- «Netlify · 5 qadam»: netlify.com'ni oching va GitHub bilan kiring. · Projects sahifasining eng pastiga tushing — papka tashlanadigan katta maydon bor (topilmasa: app.netlify.com/drop). · `mini-dokon` papkasini shu maydonga sudrab tashlang — papkaning o'zini, fayllarni birma-bir emas. · Havola chiqadi (oxiri .netlify.app) — nusxalang va shu yerga qo'ying. · Havolani telefoningizda oching: savat va jami ishlayaptimi?
- «Netlify bergan havola» + «Havolani qo'ying» (URL tekshiruvi, `.netlify.app` eslatmasi) · «Kutilgan natija · internetda» — maket manzili havoladan.
- Saqlangach: «Do'koningiz internetda!» · Tahrirlash · havola · «Do'stingizga yuboring:» «Mening do'konim: {havola} — savatga biror narsa qo'shib ko'r!» · Xabarni nusxalash · Havolani nusxalash
- Nishon «Shipped It!» — «Davom etish»da (bonus).

## 5 · Oxirgi sinov (yagona ballik)
- Sarlavha: Oxirgi sinov: har qanday loyiha — bir xil 5 qadam
- Mentor: Mana — butun modulning siri bitta ketma-ketlikda. Do'kon, o'yin, bot — farqi yo'q: hammasi shu 5 qadam bilan quriladi. Bo'laklarni sudrab, to'g'ri tartibga qo'ying.
- Sudrash (gradient chip, ⠿): ✔ G'oyani bo'lakla (reja) → MVP'ni belgila → AI bilan qur → Natijani tekshir → Deploy qil · «Natijani tekshir»
- To'g'ri: «Mukammal! Reja → MVP → qurish → tekshirish → deploy. Bu — istalgan loyihaning universal yo'li. Siz uni egalladingiz!»
- Nishon «Master Plan!» — birinchi urinishda.

## 6 · Podium
- «Kim g'olib?» · yorliq «1 — Loyiha 5 qadami». Mustaqil rejimda: «Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.»

## 7 · Yakun
- «✓ Praktika moduli tugadi» · «N/1 to'g'ri» · Endi siz istalgan loyihani qura olasiz
- «Endi siz bilasiz»: Savat — massiv: «Savatga» bosilganda mahsulot push bilan qo'shiladi · Jami — for sikli bilan narxlar yig'indisi, funksiyada hisoblanadi · "3000" — matn, 3000 — son: matnga «+» yopishtiradi, songa qo'shadi · AI'ga xatoni aniq aytasiz: nima bo'ldi va nima bo'lishi kerak · Deploy — papkani Netlify'ga tashlab, havolani ulashish
- Uyga vazifa (VS Code'da, `mini-dokon` papkasida): «Buyurtma berish» — tugma qo'shing: bosilsa savat tozalansin va «Rahmat!» chiqsin (Gemini yoki Copilot bilan) · Bo'sh savat — savat bo'sh bo'lsa «Savat bo'sh» yozuvi chiqsin · Havolani yuboring — do'stingiz savatni sinab ko'rsin; o'zgargan papkani Netlify'ga qayta tashlang · «Esda tuting: har o'zgarishdan keyin tekshiring — keyin chiqaring.»
- Nishonlar (4): Built It! · Nice Fix! · Shipped It! · Master Plan!

## Arena (o'zgargan savollar)
- Q10 → «0 + "3000" nima beradi?» (✔ "03000" — matn, o'rin 3) · Q12 → «savat massivi bilan nima bo'ladi?» (✔ push, o'rin 1). Qolganlari o'zgarmadi.

## Sinov (17.10)
gates 10/12 (tell, emoji — eski arena/statistika, baza bilan bir xil) · `tekshir-m212` 46/46 · `ru-m212` 8/8 (oyna va yig'ilgan qator ham) · `f362-surat` 1280 + 390 · matn `sinov/uz-matn-m212.mjs` chiqishidan.
