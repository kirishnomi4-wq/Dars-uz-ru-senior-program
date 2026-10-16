# 2-Modul m2-09 «Praktika 2 — AI bilan tez sayt» — yakuniy matn

Fayl: `src/2-Modull/PracticeLesson2.jsx` · 9 ekran · Oldingi: «Praktika 1 — Saytni jonlantiramiz» (Copilot o'rnatilgan) · Keyingi: «PERN Stack», keyin «Praktika 3»
Ip: o'quvchi o'zi tanlagan mavzuga promo sahifa (`promo` papkasi) · AI: Gemini + Copilot (Antigravity ishlatilmaydi)
Holat: 2026-10-16 — kodga mos (F-1015-336…339 dan keyin). `lessonId` = `practice-02-ai-promo-v18` (o'zgarmagan) · oldingi 19 ekranli: `arxiv/F-1015-practice2-oldin/`

## 0 · Kirish
- Eyebrow: Kirish · Sarlavha: AI'ga shunchaki «sayt yasab ber» desangiz — nima chiqadi?
- Mentor: Shu qisqa buyruqni AI'ga yuboring va natijaga qarang — kutganingizday chiqdimi?
- «Sizning buyrug'ingiz»: Menga sayt yasab ber. · Tugma: AI'ga yuborish → o'ngda bo'sh, tasodifiy natija («Mavzu va uslubni aytmadingiz — o'zim to'ldirdim», «Rangni o'zim tanladim!») · «So'zma-so'z bajardim — lekin kam aytdingiz!»
- «Nega natija bunchalik bo'sh?» (ballsiz): ✔ AI nima xohlayotganimni bilmadi — juda kam tushuntirdim · AI buzilgan, shuning uchun bo'sh chiqdi · Internet sekin bo'lgani uchun
- Javob: «To'g'ri! / Aslida, AI tez, lekin o'ylaganingizni o'qiy olmaydi. Aniq aytsangiz — aniq natija.»

## 1 · Reja
- Sarlavha: Bugun AI'ga aniq prompt yozishni o'rganasiz.
- Mentor: Promo sahifa — biror tadbir yoki o'yinni tanishtirib, odamlarni chaqiradigan bitta sahifa. Bugun o'zingiz tanlagan mavzuga shunday sahifa qurasiz. Yaxshi prompt 4 qismdan iborat — ularni o'ngda ko'rasiz.
- «Avval tayyorlaning · 3 qadam ▾» (yopiq, ochilmaguncha «nafas oladi»): 1. Ish stolida promo papkasini yarating va VS Code'da oching; ichida index.html va style.css, Go Live. · 2. Boshqa oynada gemini.google.com'ni oching. · 3. Copilot yoqilganini tekshiring — VS Code pastki chizig'ida Copilot belgisi bor.
- Chapda «Dars oxirida · namuna» (Maktab futbol turniri, Qoidalar bilan) · o'ngda bitta karta (namuna bilan bir balandlikda): «Yaxshi prompt — 4 qism»: mavzu · uslub · rang · bo'limlar | «Bugungi 4 blok»: 01 Promo sahifa (Gemini · 4 qism) · 02 Yaxshilash (Gemini · aniq so'rov) · 03 Yangi bo'lim (Copilot) · 04 Wow effekt (Gemini · JavaScript)

## 2 · Amaliyot 1 · 4 qism (a1)
- Sarlavha: Promo sahifangizni bitta aniq prompt bilan quring.
- Forma: 1 · Mavzu — kim uchun, nima (misollar: Maktab futbol turniri · O'yin klubi · Kibersport turniri) · 2 · Uslub: Zamonaviy · Quvnoq · Sodda · 3 · Rang: Ko'k · Yashil · To'q sariq · Binafsha · 4 · Bo'limlar — tugma yozuvi · 3 ta karta — vergul bilan
  - Tugma: 4 qismni to'ldiring → Saqlash → yig'iladi («Sizning 4 qismingiz») + Tahrirlash.
- O'ngda «Natija · yozganingizdan quriladi» — maket jonli; yetishmagan qism «?», «rang aytilmadi» / «uslub aytilmadi» · ostida: Qaysi qism yetishmasa, sahifada «?» bo'lib turadi — AI uni o'zi to'ldiradi.
- Prompt:
```
{mavzu} uchun promo sahifa yasa.
Uslubi {uslub}, asosiy rang {rang}.
Sahifada: katta sarlavha, «{tugma}» tugmasi va 3 ta karta — {kartalar}.
index.html va style.css'ni alohida, to'liq yoz.
```
- «Qadamlar · 4 ▾»: 4 qismni yozing va «Saqlash»ni bosing · «Promptni nusxalash» → gemini.google.com · Javobdagi kodlarni promo papkasidagi index.html va style.css ga qo'ying, Ctrl+S · Live Server'da solishtiring: mavzu — sarlavhada, rang — tugmada, bo'limlar — kartalarda bormi?
- «Davom etish» — nishon Prompt Pro

## 3 · Amaliyot 2 · iteratsiya (a2)
- Sarlavha: Natijani aniq so'rab yaxshilang. · Mentor: Birinchi natija kamdan-kam mukammal bo'ladi. Bitta so'rov — bitta o'zgarish: shunda AI nimani o'zgartirganini darrov ko'rasiz.
- «Bitta kamchilik»: Nima yoqmadi? (masalan: tugma juda kichik) · Qanday bo'lsin? (masalan: kattaroq va to'q yashil bo'lsin) → «Prompt tayyor — Gemini'ga yuboring.» → «Keyingi kamchilik» («Yaxshilandi: N»)
- Prompt: «Sahifamni yaxshila — faqat shu joyni o'zgartir, qolganiga tegma. Yoqmagani: …. Qanday bo'lsin: …. O'zgargan faylni to'liq qaytar. Mana kodim: {index.html va style.css kodini shu yerga qo'ying}»
- «Sahifangizni tekshiring»: Sarlavha mavzuingizni aytyaptimi? · Tugma ko'zga tashlanadimi? · 3 karta bir qatordami? · Rang hamma joyda bir xilmi? · Oynani toraytiring: telefonda sig'adimi?
- «Qadamlar»: Ro'yxat bo'yicha … bitta kamchilikni tanlang · Uni aniq yozing: «rang» emas — «tugma rangi to'q yashil bo'lsin» · nusxalash → Gemini, Ctrl+S · «Keyingi kamchilik» — va yana. Kamida ikki marta.
- «Davom etish» — nishon Iterator

## 4 · Amaliyot 3 · Copilot (a3)
- Sarlavha: Copilot bilan sahifaga yangi bo'lim qo'shing. · Mentor: Izoh yozasiz — bo'limni Copilot taklif qiladi. Taklifni qabul qilish yoki o'zgartirish — sizning qaroringiz.
- Nusxa «index.html ga — kartalardan keyin»: `<!-- qoidalar bo'limi: sarlavha va 3 bandli ro'yxat -->`
- Qadamlar: izohni qo'ying, Enter · kulrang taklifni o'qing, to'g'ri bo'lsa Tab · Ctrl+S — brauzerda tekshiring; qoidalar mavzuingizga mos bo'lmasa, o'zingiz tuzating · «Taklif chiqmadimi?»
- O'ngda — o'quvchining sahifasi + «Qoidalar» bo'limi. · «Davom etish» — nishon Ship It!

## 5 · Topshirish (s7, yagona ballik; kalit B)
- O'yin promo sahifasi uchun qaysi so'rov eng aniq? — «Menga biror sayt qilib ber, chiroyli bo'lsin» · ✔ «Ko'k, zamonaviy o'yin sahifasi: tugma va 3 karta» · «Chiroyli, zamonaviy va yorqin sahifa qilib ber» · «O'yin haqida sahifa kerak, hammasini o'zing tanla»
- Izohlar: to'g'ri — Unda to'rt qism bor: mavzu, uslub, rang va bo'limlar. · A — Mavzu ham, rang ham aytilmagan. · C — Uslub bor, lekin mavzu va bo'limlar yo'q. · D — Tanlovni AI'ga berdingiz — natija tasodifiy.
- Nishon Best Brief (birinchi urinish to'g'ri bo'lsa) · Qisqa takrorlash: «Qaysi buyruq eng yaxshi?» (3 karta)

## 6 · Amaliyot 4 · wow effekt (a4)
- Sarlavha: Sahifangizga AI bilan «wow» effekt qo'shing. · Mentor: Bunday effektni qo'lda yozish uzoq vaqt oladi — AI uni bir necha soniyada yozadi. Sizning ishingiz — uni aniq tasvirlash.
- «Effekt» (bittasi; namunada jonli): Taymer — boshlanishigacha qolgan vaqt · Konfetti — tugma bosilsa sochiladi · Uchar zarrachalar — bosh qism orqasida suzadi · 3D kartalar — sichqoncha ostida egiladi
- Prompt: «Promo sahifamga effekt qo'sh. {effekt tavsifi} JavaScript'ni alohida script.js fayliga yoz va index.html oxirida ula; kerakli CSS'ni style.css ga qo'sh. Bor matn va dizaynimni buzma. Harakatni yoqtirmaydiganlar uchun @media (prefers-reduced-motion: reduce) da animatsiya o'chsin. O'zgargan fayllarni to'liq qaytar. Mana kodim: {…}»
- «Qadamlar · 3 ▾»: nusxalash → Gemini · kodlarni fayllarga, script.js bo'lmasa — yarating, Ctrl+S · Live Server'da sinab ko'ring; yoqmasa — Gemini'ga aniq yozing; yana birini qo'shmoqchi bo'lsangiz, boshqasini tanlang.

## 7 · Natijalar — podium (yorliq: Eng aniq so'rov)

## Nishonlar
Prompt Pro (a1) · Iterator (a2) · Ship It! (a3) · Best Brief (s7)

## Jonli viktorina (12 savol; 3 tasida «ingredient/stil» → «qism/uslub», 8-savolda «minimal» → «sodda»; to'g'ri o'rinlar o'zgarmagan)
1. Vibecoding'da asosiy qoida qaysi? — AI hammasini o'zi hal qiladi · Kod yozish shart emas · ✔ AI tezlik beradi — sifatni siz ta'minlaysiz · Faqat ingliz tili kerak
2. «Prompt» nima? — Saytning rangi · Internet brauzeri · Fayl kengaytmasi · ✔ AI'ga beriladigan buyruq/ko'rsatma
3. Yaxshi promptning 4 qismi qaysi? — ✔ Mavzu, uslub, rang, bo'limlar · Ism, yosh, shahar, maktab · HTML, CSS, JS, PHP · Sarlavha, rasm, video, audio
4. «Menga sayt yasab ber» — bu qanaqa prompt? — Aniq va sifatli · ✔ Noaniq — bo'sh natija beradi · Eng yaxshi variant · To'liq, to'rt qismli prompt
5. Yaxshi prompt yomonidan nimasi bilan farq qiladi? — Uzunroq bo'ladi · Faqat inglizcha · ✔ Aniq tafsilot beradi · Hech qanday farqi yo'q
6. AI natijani birinchi urinishda yoqmasa, to'g'ri yo'l qaysi? — Tashlab ketish · Xafa bo'lish · Qo'lda qayta yozish · ✔ Qayta, aniqroq so'rash (iteratsiya)
7. «Iteratsiya» nima? — Saytni o'chirish · ✔ Qadam-baqadam qayta so'rab yaxshilash · Rasmni kesish · Domen sotib olish
8. Promptdagi «uslub» qismi nimani belgilaydi? — Qanaqa sahifa (mavzu) · Asosiy rang · ✔ Sahifa qanday ko'rinishda (zamonaviy/sodda) · Qaysi bo'limlar bo'lishi
9. AI yasagan saytni chiqargach eng muhim qadam? — Darhol nashr qilish · Faylni o'chirish · Hech nima qilmaslik · ✔ Natijani tekshirish (xatosini topish)
10. Promo sahifada odatda nima bo'ladi? — ✔ Katta sarlavha, tavsif, tugma, kartalar · Faqat bo'sh ekran · Faqat matn fayli · Excel jadval
11. «Ko'k rangli, zamonaviy o'yin promo — sarlavha, tugma, 3 karta» — bu prompt qanaqa? — Noaniq · ✔ 4 qismli, aniq va yaxshi · Juda qisqa va foydasiz · Faqat rang haqida
12. Nega AI'ga aniq buyruq berish muhim? — ✔ AI miyani o'qiy olmaydi — aniq aytsangiz aniq natija · Aniqlik natijaga ta'sir qilmaydi · AI faqat rasm chizadi · Buyruq qancha qisqa, shuncha yaxshi

## Kartochkalar
Yo'q — foydalanuvchi qarori F-1015-336.

## Yakun
- «Endi siz bilasiz»: AI tezlik beradi — sifatni siz ta'minlaysiz · Yaxshi prompt = 4 qism: mavzu, uslub, rang, bo'limlar · Iteratsiya — bitta so'rov, bitta o'zgarish · Copilot taklifini o'qib, keyin qabul qilasiz · Murakkab effektni AI yozadi — siz uni aniq tasvirlaysiz
- Uyga vazifa «VS Code'da, o'z kompyuteringizda:»: Ikkinchi promo sahifa — boshqa mavzuga 4 qismli prompt bilan yangi sahifa quring · Ikki marta yaxshilang — har safar bitta aniq so'rov bilan · Netlify'ga chiqaring — papkani tashlang va havolani platformadagi vazifa-savoliga yuboring

## Sinovlar (16.10)
gates 10/12 (tell 15 / emoji 2 — eski versiyada aynan) · `sinov/tekshir-m209.mjs` **39/39** · `teng-m209.mjs` (karta balandligi 373 = 373) · navtest2 · mentor · `ru-m209.mjs` 9 ekran toza ·
smoke-onfinished-all `--lang both --seal` (natija scratchpad'da) **2/2**.
