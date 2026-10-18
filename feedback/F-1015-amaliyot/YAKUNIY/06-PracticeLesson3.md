# 2-Modul m2-11 «Praktika 3 — Dekompozitsiya (mini-do'kon)» — yakuniy matn

Fayl: `src/2-Modull/PracticeLesson3.jsx` · 8 ekran · Oldingi: «Praktika 2 — AI bilan tez sayt» · Keyingi: «Praktika 4» (o'sha `mini-dokon` papkasi: savat + jami + deploy)
Ip: maktab mini-do'koni — jonli katalog (`mini-dokon` papkasi: REJA.md, index.html, style.css, script.js) · AI: Gemini + Copilot (Antigravity ishlatilmaydi)
JS darslaridan: massiv (mahsulotlar), `for` sikli (kartochkalar), `if` (toifa tugmalari), funksiya (qidiruv — Copilot izohdan yozadi)
Holat: 2026-10-16 — kodga mos (F-1015-340 → 341 → 342 dan keyin). `lessonId` = `practice-03-decompose-v18` (o'zgarmagan)
Zaxiralar: 19 ekranli — `arxiv/F-1015-practice3-oldin/` · 340 holati — `arxiv/F-1015-341-oldin/` · 341 holati (daqiqali a1) — `arxiv/F-1015-342-oldin/`
Saqlov: localStorage `ccDokon` — `rejaShart`, `rejaKeyin`, `rejaSaqlangan`, `nom`, `katalog` (6 qator `{ n, p, t }`), `katSaqlangan`. m2-12 shu katalogni o'qiydi.

## 0 · Kirish
- Sarlavha: To'g'ridan-to'g'ri "do'kon yasab ber" desak — nima bo'ladi?
- Mentor: Endi kichik sahifa emas, butun bir onlayn do'kon kerak. Eng oson yo'lni tanlaymiz: AI'ga rejasiz "do'kon yasab ber" deb yuboramiz. Tugmani bosing va natijaga qarang — bu yetarlimi?
- «Sizning buyrug'ingiz»: Menga onlayn do'kon yasab ber. → o'ngda chala natija (dokon.uz · Maktab do'koni: Kitob, Daftar, Ruchka, Sumka — «narx yo'q») · «Chala chiqdi — narxlar yo'q, tartib yo'q.» · ↻ Qayta yuborish
- «Nega natija chala chiqdi?» (ballsiz): ✔ Avval vazifani bo'laklab, reja tuzmadik · AI juda sekin ishlagani uchun · Kompyuter eski bo'lgani uchun
- Javob (216-qonun, F-1015-393): bo'laklamadik → «Aynan!» · AI sekin → «Tezlik emas — reja yo'q edi.» · kompyuter eski → «Kompyuter emas — reja yo'q edi.» + «Bugun katta vazifani bo'laklab, reja tuzishni o'rganamiz.»

## 1 · Reja
- Sarlavha: Do'konni qaysi qadamdan boshlaysiz?
- Mentor: Bugun maktab mini-do'konini JavaScript bilan jonlantirasiz: toifa tugmalari va qidiruv ishlaydi. AI'ni darrov ochmaymiz: avval reja tuzasiz, keyin uni qadamma-qadam qurasiz.
- «Avval tayyorlaning · 3 qadam ▾»: 1. Ish stolida mini-dokon papkasini yarating va VS Code'da oching; ichida REJA.md, index.html, style.css va script.js, Go Live. · 2. Boshqa oynada gemini.google.com'ni oching. · 3. Copilot yoqilganini tekshiring — VS Code pastki chizig'ida Copilot belgisi bor. · «Tayyor bo'lsa — «Boshlaymiz».»
- Chapda «Dars oxirida · namuna» — jonli do'kon (Maktab mini-do'koni, qidiruv, toifa tugmalari Hammasi · O'quv · Ichimlik · Shirinlik, 6 kartochka: Ruchka 3 000 · Chizg'ich 4 000 · Sharbat 6 000 · Suv 3 000 · Shokolad 8 000 · Pechenye 5 000 so'm) — bosib ko'rsa bo'ladi
- O'ngda: «Bugungi qoida» — Avval bo'laklang, keyin AI'ni oching. | «Bugungi 3 blok»: 01 Reja (o'zingiz · REJA.md) · 02 Katalog va toifa tugmalari (Gemini) · 03 Qidiruv (Copilot)

## 2 · Amaliyot 1 · AI'siz — «Do'konni yig'ing» (a1)
- Sarlavha: Bugungi do'konga 4 ta qism tanlang.
- Mentor: Bugun vaqt 4 ta qismga yetadi. Do'kon busiz ishlamaydigan 4 tasini «Shart»ga qo'ying — bu MVP. Qolgani — «Keyin».
- Taxta: «Do'kon qismlari · suring yoki bosing» — 8 qism: Mahsulot ro'yxati · Kartochkalar · Toifa tugmalari · Qidiruv · Sevimli · Savat · To'lov · Akkaunt bilan kirish
  - «Shart — bugun» (yashil, sanoq «N / 4») — 1–4 raqamli bo'sh kataklar · «Keyin» — «Kutsa bo'ladigan qismlar»
  - Sudrash (sichqoncha/barmoq) yoki qismni bosib → ustunni bosish; qism yangi joyiga uchib o'tadi.
- Mantiq:
  - Bog'liqlik (busiz ishlamaydi): Kartochkalar ← Mahsulot ro'yxati · Toifa tugmalari, Qidiruv, Sevimli, Savat ← Kartochkalar · To'lov ← Savat. Bajarilmasa qism qaytadi: «Avval «Kartochkalar» kerak — savatga nima qo'shasiz?» (savollar: kartochkaga nimani chizasiz? · tugma nimani saralaydi? · qidiruv nimani topadi? · yurakni qayerga qo'yasiz? · savatga nima qo'shasiz? · nimaning pulini to'laydi?)
  - 5-qism: «4 ta joy band — bugun shuncha ulguramiz. Avval bittasini «Keyin» ustuniga o'tkazing.»
  - «Shart»dan chiqarilsa tayanganlar ham ko'chadi: ««Toifa tugmalari», «Qidiruv» ham ko'chdi — ular «Kartochkalar»siz ishlamaydi.»
- O'ngda «Do'kon · rejangizdan quriladi»: bo'sh sahifa («Bo'sh sahifa — «Shart» ustuniga qism qo'shing») → ro'yxat → kartochkalar (sakrab) → toifa tugmalari / qidiruv (sirg'alib kiradi, ishlaydi); «Keyin»dagi qismlar maketda yo'q.
- Saqlash tugmasi: «Hamma qismni joylang — yana N ta» → ««Shart»da yana N ta bo'sh joy» → «Ro'yxat va kartochkalarsiz do'kon bo'sh» → Saqlash
- Saqlangach «Sizning rejangiz» + Tahrirlash, REJA.md maketi, «Reja tayyor — uni REJA.md ga qo'ying.», «REJA.md ni nusxalash»:
```
# Mini-do'kon — reja

## Shart (MVP)
1. Mahsulot ro'yxati
2. Kartochkalar
3. Toifa tugmalari
4. Qidiruv

## Keyin
- Sevimli
- Savat
- To'lov
- Akkaunt bilan kirish
```
  - Reja bugungi ishdan farq qilsa (toifa tugmalari yoki qidiruv yo'q): «Darsda «Toifa tugmalari» va «Qidiruv»ni quramiz — rejangizdagi boshqa qismlar keyingi darsda.»
- «Qadamlar · 3 ▾»: Har qismni «Shart» yoki «Keyin» ustuniga suring — yoki qismni bosib, keyin ustunni bosing. · «Shart»da 4 ta joy bor — do'kon qaysi qismlarsiz ishlamaydi? · «Saqlash» → «REJA.md ni nusxalash» → REJA.md ga qo'ying, Ctrl+S.
- «Davom etish» — nishon Planner!

## 3 · Amaliyot 2 · Gemini — katalog va toifa tugmalari (a2)
- Sarlavha: Katalog va toifa tugmalarini quring.
- Mentor: Gemini'ga rejangizning birinchi qismlarini berasiz: ro'yxat, kartochkalar va toifa tugmalari. Prompt JavaScript darslaridagi so'zlar bilan aytadi: massiv, for sikli, if.
- Forma: Do'kon nomi · «Mahsulotlar — nomi, narxi, toifasi (kamida 4 ta)» — 6 qator: nom, narx, toifa (O'quv · Ichimlik · Shirinlik)
  - Saqlash sharti: nom kamida 3 harf, kamida 4 to'liq qator, 2 xil toifa — aks holda «Nom va kamida 4 mahsulot, 2 xil toifa»
- O'ngda «Natija · yozganingizdan quriladi» — yetishmagan joy «? do'kon nomi», «? nomi», «? narx»; toifa tugmalari ishlaydi · «Qidiruv hali yo'q — uni keyingi qadamda Copilot bilan qo'shasiz.»
- Prompt:
```
{nom} uchun bitta sahifali do'kon yasa. index.html, style.css va script.js'ni alohida, to'liq yoz.
1. Mahsulotlar script.js da massivda tursin — har biri { nom, narx, toifa }:
- {nom}, {narx} so'm, {toifa}   (har mahsulot)
2. Kartochkalarni for sikli bilan chiz: nomi, narxi va toifasi.
3. Tepada toifa tugmalari: Hammasi, {tanlangan toifalar}. Bosilganda if bilan faqat shu toifa kartochkalari qolsin.
Hozircha faqat shu: savat va qidiruv qo'shma. Har bo'limga qisqa izoh yoz.
```
- «Qadamlar · 4 ▾»: Do'kon nomi va mahsulotlarni yozing, toifasini tanlang → «Saqlash». · «Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring. · Javobdagi uch faylni index.html, style.css va script.js ga qo'ying, Ctrl+S. · Live Server'da toifa tugmalarini bosing — kartochkalar almashadimi?
- «Davom etish» — nishon MVP!

## 4 · Amaliyot 3 · Copilot — qidiruv (a3)
- Sarlavha: Copilot bilan qidiruv qo'shing.
- Mentor: Copilot sahifangizdagi kodni o'qiydi va izohdan qidiruv funksiyasini yozadi. Nima qilishini siz aytasiz: izoh aniq bo'lsa, taklif ham aniq.
- Nusxa «1 · index.html ga — toifa tugmalari ustiga»: `<!-- qidiruv maydoni: input, id="qidiruv", placeholder "Qidirish..." -->`
- Nusxa «2 · script.js ga — oxiriga»: `// qidiruv: yozilgan so'z nomida bor mahsulotlarnigina chiz`
- Qadamlar: index.html da toifa tugmalari ustiga 1-izohni qo'ying, Enter → kulrang taklifni o'qing, Tab. · script.js oxiriga 2-izohni qo'ying, Enter → Tab. Taklif bir necha qator bo'lishi mumkin — hammasini o'qing. · Ctrl+S → qidiruvga bitta mahsulot nomining boshini yozing: faqat o'sha mahsulot qoladimi? · REJA.md da bajarilgan qismlar yoniga ✓ qo'ying.
- «Taklif chiqmadimi?»: Izohdan keyin Enter'ni yana bir bosing. Baribir chiqmasa — pastki chiziqdagi Copilot belgisini tekshiring yoki ikkala izohni Gemini'ga yuboring.
- O'ngda «Kutilgan natija · qidiruv ishlaydi» — o'quvchining katalogi + qidiruv (Copilot belgisi), topilmasa «Hech narsa topilmadi» · «Yozib ko'ring — sizning saytingiz ham shunday ishlashi kerak.»
- «Davom etish» — nishon Level Up!

## 5 · Test (s4, yagona ballik; kalit A)
- MVP nima degani? — ✔ Eng kichik, lekin ishlaydigan versiya · Eng chiroyli, jozibali dizayn · Eng qimmat, murakkab funksiya · Loyihaning oxirgi, tayyor varianti
- Izohlar: to'g'ri — MVP — ishlaydigan birinchi versiya, qolgani keyin keladi. · B — Chiroyli dizayn keyin qo'shiladi, MVP'da u asosiy emas. · C — Qimmat va murakkab funksiya MVP'ga kirmaydi. · D — MVP oxirgi emas — undan keyin ham ko'p narsa qo'shiladi.
- Nishon Architect! (birinchi urinish to'g'ri bo'lsa) · Qisqa takrorlash: «MVP — eng kichik ishlaydigan versiya» (skeytbord → samokat → velosiped → mashina)

## 6 · Natijalar — podium

## 7 · Yakun
- «3-praktika tugadi» · Endi siz ishni reja bilan boshlaysiz
- Endi siz bilasiz: Katta ishni AI'ga berishdan oldin qadamlarga bo'lasiz · MVP — vaqtga sig'adigan, lekin ishlaydigan qism; qolgani «keyin» · Ba'zi qism boshqasisiz ishlamaydi: savat — kartochkalardan keyin · Mahsulotlar massivda, kartochkalar for sikli bilan, toifa tugmalari if bilan · Copilot izohdan funksiya yozadi — nima qilishini siz aytasiz
- Uyga vazifa (VS Code'da, mini-dokon papkasida): **Sevimli** — har kartochkaga yurak tugmasi qo'shing: bosilsa to'ladi (Copilot yoki Gemini bilan) · **Savat uchun prompt** — rejangizdagi keyingi qadamga bitta aniq prompt yozib qo'ying · **Papkani saqlang** — mini-dokon keyingi darsda davom etadi · «Esda tuting: avval o'ylab bo'laklang, keyin AI'ni oching.»

## Nishonlar
Planner! (a1 — Do'kon rejasini o'zingiz tuzdingiz) · MVP! (a2 — Katalog va toifa tugmalarini qurdingiz) · Level Up! (a3 — Qidiruvni qo'shib, MVP'ni tugatdingiz) · Architect! (s4 — MVP nimaligini birinchi urinishda topdingiz)

## Jonli viktorina (12 savol; F-1015-341 da Q6 va Q11 to'g'ri variant matni yangilandi, o'rinlar o'zgarmagan)
1. Dekompozitsiya nima? — ✔ Vazifani kichik qadamlarga bo'lish · Kodni butunlay o'chirib tashlash · Sahifaga rang va shrift tanlash · Tayyor saytni serverga joylash
2. MVP nima ma'noni beradi? — Eng qimmat, murakkab versiya · ✔ Eng kichik ishlaydigan versiya · Eng chiroyli, jozibali dizayn · Loyihaning oxirgi varianti
3. AI'ni ochishdan oldin nima qilish kerak? — ✔ Rejani tuzish (bo'laklash) · Darhol 'do'kon yasab ber' deyish · Kompyuterni yangilash · Sahifa rangini tanlash
4. Mini-do'kon MVP o'zagi nimadan iborat? — Login va parol tizimi · Sun'iy intellekt chat-boti · Reklama bannerlari va aksiyalar · ✔ Mahsulotlar ro'yxati va narx
5. Do'kon qurishni qaysi qadamdan boshlaymiz? — Savatga qo'shish tugmasidan · Qidiruv oynasidan · ✔ Mahsulotlar ro'yxatidan · To'lov va bank kartasidan
6. Qaysi biri MVP uchun SHART emas (keyin qo'shiladi)? — Mahsulotlar ro'yxati · Har biriga narx · ✔ To'lov va login · Mahsulot nomi va rasmi
7. Rejani kim tuzadi? — ✔ Siz, AI'ni ochishdan oldin · AI, birinchi so'rovdan keyin · Copilot, kod yozayotganda · Hech kim, reja shart emas
8. Aniq buyruq nega muhim? — Chiroyliroq ko'rinadi · ✔ Aniq buyruq → aniq natija · Tezroq yozib bo'ladi · AI'ni ortiqcha charchatmaydi
9. Qaysi buyruq eng aniq? — Menga bir ro'yxat qilib ber · Biror yaxshi narsa qilib ber · ✔ Maktab do'koni uchun 4 mahsulotli ro'yxat · Chiroyliroq qilib yasab ber
10. To'g'ri qurilish tartibi qaysi? — Ko'rinish → narx → ro'yxat · Bezak → ro'yxat → narx · Narx → ro'yxat → login · ✔ Ro'yxat → narx → ko'rinish
11. Gemini'ga qaysi qadamni berasiz? — Butun do'konni bitta so'rovda · ✔ Rejadagi kichik bir qismni · Rejadagi eng chiroyli qadamni · Rejadagi oxirgi, «keyin» qadamni
12. «Keyin» qadamlar qachon quriladi? — MVP'dan oldin, birinchi navbatda · Hech qachon qurilmaydi · Faqat dizayn tayyor bo'lganda · ✔ MVP ishlagandan keyin

## Kartochkalar
Yo'q (praktika qolipi — F-1015-336 qarori).

## Tekshiruv (2026-10-16)
`npm run gates` 10/12 (tell, emoji — eski arena/statistika, baza bilan bir xil) · `sinov/tekshir-m211b.mjs` 46/46 · `sinov/ru-m211b.mjs` 8 ekran: xato 0, o'zbekcha qoldiq 0 · matn shu faylga `sinov/uz-matn-m211.mjs` chiqishidan olingan.
