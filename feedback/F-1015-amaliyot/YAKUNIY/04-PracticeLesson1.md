# 2-Modul m2-08 «Praktika 1 — Saytni jonlantiramiz» — yakuniy matn

Fayl: `src/2-Modull/PracticeLesson1.jsx` · 9 ekran · Oldingi darslar: JS (o'zgaruvchi, if/else, sikl, funksiya) va «Dekompozitsiya» · Keyingi: «Praktika 2 — AI bilan tez sayt»
Ip: o'quvchining Demo Day sayti (`mening-saytim`, m1-11 da Netlify'ga chiqqan) · AI: Gemini + GitHub Copilot (Antigravity — 18+, ishlatilmaydi)
Holat: 2026-10-16 — kodga mos (F-1015-332…334 dan keyin). `lessonId` = `practice-01-jonlantirish-v18` (o'zgarmagan) · oldingi 19 ekranli: `arxiv/F-1015-practice1-oldin/` (F-1016-01 bilan)

## 0 · Kirish (o'zgarmagan)
- Eyebrow: Kirish · Sarlavha: Chiroyli sayt, lekin tugma bosilsa — hech nima bo'lmaydi
- Mentor: Mana siz qurgan sayt — chiroyli ko'rinadi. Like tugmasini kamida 3 marta bosing va diqqat qiling: nima o'zgaryapti? Hech narsa! Hozircha bu sayt jonsiz — bosasiz, lekin u javob bermaydi, xuddi devordagi rasmdek qotib turadi.
- Chapda «Sizning saytingiz»: Salom! Bu mening birinchi saytim. Yoqsa, like bosing. · «Like · 0» → «{N}-marta bosildi, son hali 0. Hech nima bo'lmadi.»
- 3 marta bosilgach «Nega tugma ishlamayapti?» (ballsiz): ✔ JavaScript yo'q — sayt reaksiya qila olmaydi · Internet sekin, shuning uchun ishlamayapti · Tugma chiroyli emas, shuning uchun bosilmaydi
- Javob (216-qonun, F-1015-394): JavaScript yo'q → «Aynan!» · internet → «Internet emas — saytda JavaScript yo'q.» · tugma chiroyli emas → «Tugma chiroyli — lekin unga JavaScript kerak.» + «Bugun saytga JavaScript qo'shamiz — tugma bosilganda ishlaydi.»

## 1 · Reja
- Eyebrow: Reja · Sarlavha: Bugun saytingizga JavaScript qo'shasiz.
- Mentor: Bu — Netlify'ga chiqargan saytingiz. Bugun u bosishga javob beradigan bo'ladi: kodni Gemini va Copilot yozadi, bittasini o'zingiz yozasiz.
- «Avval tayyorlaning · 3 qadam ▾» (ochiladigan; ochilmaguncha «nafas oladi»):
  1. VS Code'da mening-saytim papkangizni oching, index.html da Go Live.
  2. Copilot'ni o'rnating: chap paneldagi Extensions belgisi → qidiruvga «GitHub Copilot» → Install → GitHub hisobingiz bilan kiring.
  3. Boshqa oynada gemini.google.com'ni oching.
  - Tayyor bo'lsa — «Boshlaymiz».
- «Dars oxirida · namuna» — jonli sayt (Tungi rejim, Like, tabrik) · «Bugungi 3 blok»: 01 Tungi rejim (Gemini · if/else) · 02 Like sanagich (Copilot · click) · 03 10 like — tabrik (o'zingiz · if)
- Tugma: Boshlaymiz

## 2 · Amaliyot 1 · Gemini — tungi rejim (a1)
- Sarlavha: Saytingizga tungi rejim tugmasini qo'shing.
- Prompt (Promptni nusxalash):
```
Saytimga tungi rejim tugmasini qo'sh: menyu yonida «Tungi rejim» tugmasi bo'lsin.
Bosilsa sahifa qorong'i bo'lsin (to'q fon, och matn), yana bosilsa yorug'ga qaytsin; tugma yozuvi ham almashsin.
JavaScript'ni alohida script.js fayliga yoz va index.html oxirida ula. Qorong'i ranglarni style.css ga .tungi klassi bilan qo'sh.
Bor matnlarimni o'zgartirma. O'zgargan fayllarni to'liq qaytar.
Mana kodim: {index.html va style.css kodini shu yerga qo'ying}
```
- O'ngda «Kutilgan natija · bosib ko'ring» — namuna-saytda «Tungi rejim» ↔ «Kunduzgi rejim» ishlaydi · ostida: Gemini javobida if / else ni toping — u hozirgi rejimga qarab qaysi biriga o'tishni tanlaydi.
- «Qadamlar · 3 ▾»: 1. «Promptni nusxalash» → gemini.google.com'ga qo'ying, {…} o'rniga index.html va style.css. · 2. Javobdagi kodlarni fayllarga qo'ying: index.html va style.css ni almashtiring, yangi script.js yarating, Ctrl+S. · 3. Live Server'da tugmani bosing: sayt qorong'i bo'ldimi, yana bosilsa qaytdimi? Ishlamasa, Gemini'ga yozing: «tugma bosilsa hech narsa bo'lmayapti, tuzat».
- «Davom etish» — nishon Code It!

## 3 · Amaliyot 2 · Copilot — like (a2)
- Sarlavha: Like tugmasi bosilgan sari son oshsin.
- Mentor: Bu safar promptni Gemini'ga emas — Copilot'ga yozasiz: u VS Code ichida, siz yozgan izohdan kodni o'zi taklif qiladi.
- Nusxa bloklari: «1 · index.html ga» `<button id="like">Like</button> <span id="son">0</span>` · «2 · script.js oxiriga» `// like tugmasi bosilsa son 1 ga oshsin`
- Qadamlar: 1. index.html da tugma va son uchun joy yozing (pastdagi qatorni nusxalang) — masalan, bosh qismdagi tugmalar yoniga. · 2. script.js oxiriga izohni qo'ying va Enter bosing. · 3. Kulrang taklif chiqadi — o'qing, to'g'ri bo'lsa Tab bilan qabul qiling. Ctrl+S, brauzerda 3 marta bosing: son 3 bo'ldimi?
- «Taklif chiqmadimi?»: Izohdan keyin Enter'ni yana bir bosing. Baribir chiqmasa — Copilot'ga kirganingizni tekshiring (pastki chiziqdagi Copilot belgisi) yoki shu izohni Gemini'ga yuboring.
- O'ngda namuna (Like + son) · ostida: Copilot let son = 0 va click hodisasini yozadi — o'zgaruvchi va hodisa JS darslaridagi bilan bir xil.
- «Davom etish» — nishon Nice Logic!

## 4 · Amaliyot 3 · AI'siz — 10 like tabrik (a3)
- Sarlavha: 10 like bo'lsa, tabrik yozuvi chiqsin.
- Mentor: Bu safar kodni AI yozmaydi — o'zingiz. Shart (if) JS darsidagi o'sha.
- Qadamlar: 1. script.js da son oshadigan qatorni toping (son = son + 1 yoki son++). · 2. Undan keyin o'zingiz shart yozing: son 10 ga teng bo'lsa — sahifada «Rahmat! 10 like» yozuvi chiqsin. · 3. Ctrl+S — brauzerda 10 marta bosib tekshiring.
- Qolip: `if (son === …) { … }` · «Qiynalyapsizmi?»: `if (son === 10) { alert("Rahmat! 10 like"); }`
- O'ngda namuna — 10 marta bosilsa «Rahmat! 10 like» · ostida: Shart (if) son 10 ga teng bo'lsagina ishlaydi.
- «Davom etish» — nishon It's Alive!

## 5 · Yakuniy · amaliy — «Oxirgi sinov» (s15, yagona ballik; F-1016-01 mentor tuzatishi bilan, o'zgarmagan)
- Sarlavha: Oxirgi sinov: tugmani o'zingiz to'g'ri jonlantiring
- Mentor: Maqsad: "Tugma bosilganda sahifa rangi o'zgarsin." To'g'ri HODISA va to'g'ri REAKSIYAni tanlang. Ikkalasi to'g'ri bo'lsa — tugma saytda haqiqatan ishlay boshlaydi.
- 1. Qaysi HODISA? — ✔ Bosilganda (click) · Hover · Aylantirilganda · 2. Qaysi REAKSIYA? — ✔ Rangni o'zgartir · Sahifani o'chir · Hech narsa
- Kod oynasi: tugma.onclick / onmouseover / onscroll = () => { … } · tugma tanlovgacha «🔒 Avval tanlang», keyin har juftlik haqiqatdagidek ishlaydi (9/9 sinovda).
- To'g'ri juftlik: «Mukammal! Bosish hodisasi va rangni o'zgartirish reaksiyasi birga — tugma jonlandi. Siz uni o'zingiz jonlantirdingiz.»

## 6 · Amaliyot 4 — yana bitta vosita (a4)
- Sarlavha: Saytingizga yana bitta jonli vosita qo'shing.
- «Vosita» (bittasi): Ochiladigan menyu — bosilsa ochiladi, yana bosilsa yopiladi · Jonli salom — ism yozilsa salom o'zgaradi · Forma tekshiruvi — bo'sh yuborilsa ogohlantiradi
- O'ngda «Saytingiz · sinab ko'ring» — tanlangan vosita namunada ishlaydi · «Qadamlar · 3 ▾».
- Prompt: «{vosita tavsifi} JavaScript'ni script.js ga qo'sh (bor kodimni o'chirma), kerakli HTML va CSS'ni ham qo'sh. Bor matnlarimni o'zgartirma. O'zgargan fayllarni to'liq qaytar. Mana kodim: {index.html, style.css va script.js kodini shu yerga qo'ying}»
- Qadamlar: 1. nusxalash → Gemini, {…} o'rniga uchala fayl · 2. kodlarni almashtiring, Ctrl+S · 3. Live Server'da sinab ko'ring: namunadagidek ishlayaptimi? Yana birini qo'shmoqchi bo'lsangiz — boshqasini tanlab, promptni yana yuboring.

## 7 · Natijalar
Podium — jonli reyting · yorliq: Tugmani jonlantirish

## Nishonlar
Code It! (a1) · Nice Logic! (a2) · It's Alive! (a3) · Level Up! (yakun)

## Jonli viktorina (12 savol, o'zgarmagan — hammasi dars mavzusiga mos)
1. HTML va CSS saytga nima beradi? — ✔ Tashqi ko'rinish · Jonlilik va reaksiya · Internet tezligi · Ma'lumotlar bazasi
2. Saytga jon (interaktivlik) kiritadigan til qaysi? — HTML · CSS · ✔ JavaScript · Word
3. «Hodisa» (event) nima? — Saytning tashqi rangi · Yuklangan fayl nomi · Internet ulanish tezligi · ✔ Foydalanuvchining harakati
4. Jonlantirishning to'g'ri ketma-ketligi qaysi? — O'zgarish → Hodisa → Reaksiya · ✔ Hodisa → Reaksiya → O'zgarish · Reaksiya → Hodisa → O'zgarish · Faqat o'zgarish
5. Tugmani bosish qaysi hodisaga misol? — input · hover · ✔ click · scroll
6. Matn maydoniga yozish qaysi hodisa? — ✔ input · click · hover · load
7. son = 0 bo'lsa, tugma 3 marta bosilsa (son = son + 1) natija? — 0 · 1 · ✔ 3 · 33
8. Sayt nechta like borligini nimada eslab qoladi? — Rasm faylida · URL manzilda · CSS faylida · ✔ O'zgaruvchida
9. Tungi/kunduzgi rejim tugmasi asosan nimani o'zgartiradi? — Internet tezligini · ✔ Ranglar va mavzuni · Fayl nomlarini · Server manzilini
10. «Ko'rsat / yashir» tugmasi nimani boshqaradi? — ✔ Element ko'rinishini · Internet ulanishini · Shriftni yuklashni · Domen manzilini
11. Forma tekshiruvida bo'sh maydon uchun nima ishlatiladi? — Rang o'zgarishi · ✔ if/else sharti · Rasm qo'shish · Video ijrosi
12. «Jonli salom» — ism yozilganda o'zgarishi uchun kerak bo'lgan hodisa? — click · hech qaysi · hover · ✔ input

## Kartochkalar
Yo'q — foydalanuvchi qarori F-1015-332.

## Yakun
- Eyebrow: Tayyor · «1-praktika tugadi» · «{N}/1 to'g'ri» · Sarlavha: Statik saytni jonli saytga aylantirdingiz
- CODE STRIKE (arena)
- «Endi siz bilasiz»: Asosiy qoida: HODISA → REAKSIYA → O'ZGARISH · Tungi rejim — if / else hozirgi holatga qarab tanlaydi · Copilot: izoh yozasiz → taklifni Tab bilan qabul qilasiz · Shartni o'zingiz yozdingiz: if (son === 10) · JavaScript alohida script.js faylida yashaydi
- Uyga vazifa (bitta tugma) «Saytingizni jonlantiring:»: Yana bitta vosita — 4-amaliyotda tanlamagan vositalardan birini Copilot yoki Gemini bilan qo'shing · Saytni yangilang — Netlify'da saytingiz nomini bosing, Deploys bo'limini oching va papkani qayta sudrab tashlang · Havolani yuboring — platformadagi vazifa-savoliga · Keyingi dars — Praktika 2: AI bilan tez sayt.
- Nishonlaringiz · Kalit so'zlar: Interaktivlik · Hodisa (event) · Reaksiya · click · input · hover · Copilot — VS Code ichidagi AI: siz yozgan izohdan kod taklif qiladi
- Tugmalar: Orqaga · Qaytadan · Yakunlash

## Sinovlar (16.10)
gates 10/12 (tell 2 / emoji 2 — eski versiyada aynan) · `sinov/tekshir-m208.mjs` **37/37** · `sinov/s15-m208.mjs` 9/9 · navtest2 9 ekran · mentor · `ru-m208.mjs` 9 ekran toza ·
smoke-onfinished-all `--lang both --seal` (natija scratchpad'da) **2/2**.
