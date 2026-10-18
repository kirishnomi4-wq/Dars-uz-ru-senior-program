# 4-Modul m4-14 «Praktika: Feedback bilan yaxshilash — AvtoStoyanka» — yakuniy matn

Fayl: `src/4-Modull/FullstackFeedbackLesson.jsx` · 8 ekran · Oldingi: «Praktika: Loyiha kuni — AvtoStoyanka» (m4-13) · Keyingi: 4a-Modul «Nest arxitektura — tirik ko'rish» (m4a-01). 4-MODUL FINALI.
Ip: AvtoStoyanka paneli (o'tgan darsda qurilgan) → Demo Day'da sinfdosh sinaydi → fikr → saralash → upgrade (Gemini) · AI: Gemini (a3)
Holat: 2026-10-18 00:2x — kodga mos (F-1015-351 tungi qurish → 393 kirish javobi → **397 doska ekrani**; foydalanuvchi «yopamz narmalne», tasdiq). `lessonId` = `fullstack-feedback-p4-v18` (o'zgarmagan). «Mustaqil ish» yo'q.
Zaxira: `arxiv/F-1015-fullstackfeedback-oldin/` (351 dan oldin, 21 ekran) · `arxiv/F-1015-397-oldin/` (397 dan oldin). Qurish: `qurish/f351.py` + blok → 393 → `qurish/f397.py`.

## 0 · Kirish (Demo Day, hook, ballsiz)
- Sarlavha: Siz qurdingiz — lekin u boshqaga **qulaymi**?
- Mentor: Demo Day: sinfdoshingiz panelni sinab ko'ryapti. Band joyni bossa nima bo'larkin? Bitta **band (🟥)** joyni bosib ko'ring — uning o'rnida.
- Chapda «Sinfdosh panelni sinayapti»: qorovul paneli; band joy bosilsa darrov bo'shaydi → sinfdosh so'zi: 😳 «Voy! Shoshib bosdim — joy darrov bo'shab ketdi, 'rostdanmi?' ham demadi. To'lovni ham yozmadim shekilli...»
- O'ngda savol «Panel tayyor edi — endi nima qilamiz?»: Hech narsa — sinfdosh shoshib bosgan, panel aybdor emas · ✔ Foydalanuvchidan fikr olib, yaxshilash kerak · Band joylarni bosib bo'lmaydigan qilib qo'yish
- Javob (216-qonun): a «Sinfdosh aybdor emas — panel bir bosishda chiqarib yubordi.» · b «Aynan!» · c «Taqiqlash yechim emas — chiqarish baribir kerak.» + «Bugun sinfdoshlardan fikr yig'ib, panelni yaxshilaymiz.»
- Tugma «Davom etish».

## 1 · Reja
- Sarlavha: Ko'rsating, fikr oling, **yaxshilang**.
- Mentor: Biz o'z ishimizga juda yaqinmiz — kamchilikni ko'pincha boshqa odam topadi. Bugun panelingizni **haqiqiy sinfdoshingizga** beradi, uning fikrini yozasiz, eng muhimini tanlaysiz va Gemini bilan yaxshilaysiz.
- «Avval tayyorlaning · 3 qadam ▾» (oyna): 1. O'tgan darsdagi AvtoStoyanka ishlab tursin: `node server.js` (:3000) va `npm run dev` (:5173). · 2. Yoningizdagi sinfdosh bilan juft bo'ling — bir-biringizning panelini sinaysiz. · 3. Boshqa oynada gemini.google.com'ni oching. · «Tayyor bo'lsa — «Boshlaymiz».»
- Chapda «Dars oxirida · yangilangan panel» (dashboard qatori bilan, tushum 30 000).
- O'ngda «Yaxshilash sikli»: Ko'rsat → Fikr ol → Sarala → Yaxshila → Qayta sina. «Bugungi 3 blok»: 01 Fikr yig'ish (sinfdosh) · 02 Saralash: foyda va mehnat (o'zingiz) · 03 Upgrade (Gemini).
- Tugma «Boshlaymiz».

## 2 · Amaliyot 1 · sinfdosh bilan — fikr yig'ish (a1)
- Sarlavha: Sinfdoshingizdan **fikr** yig'ing.
- Mentor: Panelingizni sinfdoshingizga bering — 2 daqiqa qorovul bo'lib ishlatsin, siz jim kuzating. Keyin uchta savol bering va javobini yozing. «Zo'r ekan» — yoqimli, lekin **aniq fikr** nima qilishni aytadi.
- Chapda «3 ta savol»: 1. Qayerda qiynaldingiz yoki adashdingiz? · 2. Nima yetishmadi — nimani ko'rmoqchi edingiz? · 3. Qaysi tugma yoki yozuv tushunarsiz? · «Aniq yoki umumiy?»: ✓ «Chiqarganda so'ramadi — adashib bosdim» · ✗ «Zo'r ekan», «Yomon».
- O'ngda 3 karta «1-fikr / 2-fikr / 3-fikr» — maydon «Sinfdosh nima dedi?»; yozilgach «✓ Aniq» / «✗ Umumiy» belgisi; umumiy bo'lsa: «Qayta so'rang: «Nima qilsa yaxshi bo'ladi?» — javobni shu yerga yozing.» Saqlov `ccStoyankaFikr` (a3 promptiga o'tadi).
- «Davom etish»da nishon «Shipper!» 🚀.

## 3 · Amaliyot 2 · saralash — Foyda / Mehnat doskasi (s5, nishonli, F-1015-397)
- Sarlavha: Avval **qaysi birini** qilamiz?
- Mentor: Demo Day'dan **4 fikr** keldi — hammasini birdan qilib bo'lmaydi. Bu — **ustuvorlik doskasi**: **foyda** (qancha naf beradi) va **mehnat** (qancha ish talab qiladi). Har fikr-kartani o'z katagiga **sudrang** (yoki kartani bosing, keyin katakni). Noto'g'ri katak nima bo'lishini ko'rsatadi.
- Chapda «Fikr-kartalar» (nom + sinfdosh gapi): 1 **Tasdiq** — Band joyni bosgan zahoti chiqib ketdi — 'rostdanmi?' deb so'ramadi · 2 **Dashboard** — Nechta joy bo'sh, nechtasi band — darrov ko'rinmadi · 3 **Narx** — Narx 10 000 da qotib qolgan — o'zgartirib bo'lmaydi · 4 **Joylar** — Stoyanka kattalashdi — 8 joy yetmaydi. «🏅 Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki.»
- O'ngda «Foyda / Mehnat doskasi (Impact / Effort)»: ustunlar Kam mehnat · Ko'p mehnat; qatorlar Ko'p foyda · Kam foyda. Kataklar (nom + izoh): **Avval shu** — ko'p foyda · kam mehnat (✔ Tasdiq, Dashboard) · **Rejaga ol** — ko'p foyda · ko'p mehnat (✔ Narx) · **Oson, keyin** — kam foyda · kam mehnat (✔ Joylar) · **Shart emas** — kam foyda · ko'p mehnat.
- Noto'g'ri katak — karta silkinib qaytadi + oqibat (CONSEQ), masalan: «Narxni o'zgartirish ancha ish talab qiladi — «⭐ Avval shu» emas. U «Rejaga ol».»
- Hammasi joylangach: «Hammasi joylandi! **⭐ Avval shu** katagidagilar — **Tasdiq** va **Dashboard** — ko'p foyda, kam mehnat. Shulardan boshlaymiz.» Nishon «Prioritizer!» 🎯 (birinchi urinish). Eslatma (RECAPS): «Zo'r!» yetarli emas · Foydali fikr — aniq · Amalga oshsa bo'ladigan · Foyda / Mehnat doskasi · «Avval shu» katagi · Eng qiyini avval — xato · Narx allaqachon bor.
- Tugma: «Fikrlarni saralang (N/4)» → «Davom etish».

## 4 · Amaliyot 3 · Gemini — upgrade (a3)
- Sarlavha: Panelni **yaxshilang**.
- Mentor: Saralashdan keyin uchta upgrade qoldi: **chiqishda tasdiq, dashboard va narx sozlamasi**. Ularni yoqib-o'chirib, farqni ko'ring. Prompt sinfdoshingizning aniq fikrlarini ham o'z ichiga oladi.
- Chapda almashtirgichlar «✓ Tasdiq · ✓ Dashboard · + Narx sozlamasi» + jonli panel (dashboard: 6 Bo'sh · 2 Band · 20 000 Tushum; tasdiq yoqilsa chiqarishda «Rostdan chiqarilsinmi?» — «Bekor qilish» / «Ha, chiqarilsin»; narx sozlamasi — yon panel «Narx, so'm») + kod oynasi «avto-stoyanka · oxirgi amal».
- O'ngda PromptKarta («Promptni nusxalash»; 1-amaliyotdagi «aniq» fikrlar «Sinfdoshlarim yana shuni aytdi:» qatoriga avtomatik qo'shiladi):
```
AvtoStoyanka panelimni (React, avto-stoyanka) sinfdoshlar fikri bo'yicha yaxshila. Faqat shu o'zgarishlarni qil, qolganiga tegma:
1. Chiqarishdan oldin confirm("Rostdan chiqarilsinmi?") — «Bekor qilish» bosilsa hech narsa o'zgarmasin.
2. Tepada dashboard: bo'sh joylar, band joylar va bugungi tushum — yirik raqamlar bilan.
3. Narx sozlamasi: qorovul narxni o'zgartira olsin. Serverga (avto-stoyanka-server) sozlamalar jadvali (narx INTEGER) va GET/PUT /api/narx qo'sh; chiqishda tolov shu narxdan olinsin.
Sinfdoshlarim yana shuni aytdi:
- {1-amaliyotdagi aniq fikrlar}
Har o'zgarishga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.
Mana kodim:
{panel fayllari va server.js kodini shu yerga qo'ying}
```
- Izoh: «1-amaliyotda «aniq» deb belgilangan fikrlar promptga shu yerda qo'shiladi.»
- «Qadamlar · 4 ▾»: 1. Chapda upgrade'larni yoqib, panelni sinab ko'ring. · 2. «Promptni nusxalash» — unda sinfdoshingizning aniq fikrlari ham bor → gemini.google.com, oxiriga kodni qo'shing. · 3. Fayllarni almashtiring, serverni qayta ishga tushiring (`node server.js`), `Ctrl+S`. · 4. Panelni o'sha sinfdoshga qayta bering — endi qulaymi? Bu — siklning oxirgi qadami.
- «Davom etish»da nishon «Configurator!» ⚙️.

## 5 · Yakuniy · amaliy (s16, ballik, final)
- Sarlavha: Oxirgi qadam: chiqishda **tasdiqni** o'zingiz yozing.
- Mentor: Birinchi upgrade — chiqishda "Rostdan chiqarilsinmi?". Buni brauzerning tayyor **tasdiq funksiyasi** qiladi: foydalanuvchidan **Ha / Yo'q** so'raydi. Ha bo'lsa chiqaradi. Bo'sh joyga shu funksiya nomini yozing.
- Chapda VS Code (5 qator): `function chiqar(id) {` · `  if ( ` [maydon «…»] `('Rostdan chiqarilsinmi?') ) {` · `    // PUT /api/sessiyalar/:id` · `  }` · `}`. Teg «1 tasdiq funksiyasi» (✓ bo'ladi). To'g'ri: `confirm` yoki `confirm()`. Javobdan keyin: «✓ Mukammal! Endi chiqarishdan oldin panel so'raydi — tasodifiy o'chirish yo'q. Sinfdosh topgan muammo hal!»
- O'ngda (javobdan keyin) «natija — panelda»: oyna «Rostdan chiqarilsinmi?» · «A2 (01A123BC) chiqariladi.» · «Bekor» / «Ha, chiqarilsin».
- Tugma: «Tasdiqni o'zingiz yozing» → «Davom etish». Nishon «Guardian!» 🛡️.

## 6 · Podium (spodium)
- Standart: sinf natijalari / yakka rejim.

## 7 · Yakun (s17) — modul finali
- Chiplar: «✓ 4-modul yakunlandi» · «N/1 to'g'ri». Sarlavha: Siz endi **fullstack quruvchisiz**.
- «Endi siz bilasiz»: Mahsulotni qurib, foydalanuvchiga ko'rsatib, fikr olish · Aniq fikr (feedback) — umumiy maqtov emas · Saralash: Foyda / Mehnat doskasida ko'p foyda + kam mehnat avval · Upgrade: tasdiq, dashboard, sozlamalar (narx UPDATE, joylar soni) · 4-MODUL: baza → server → ulanish → loyiha → yaxshilash.
- «Uyga vazifa» kapsulasi: **Fikr yig'ing** — o'z loyihangizni 2-3 kishiga ko'rsatib, aniq fikr so'rang · **Saralang** — fikrlarni foyda/mehnat bo'yicha tartiblang · **Bitta upgrade** — eng yuqorisini AI bilan tuzating va qayta ko'rsating.
- «Backend modulini tamomladingiz: baza, server, fullstack ulanish va mahsulotni yaxshilash — hammasi sizning qo'lingizda!»
- «🏅 Nishonlaringiz» · Arena (12 savol) · tugmalar «Qaytadan» · «Yakunlash ✓».

## Arena (12 savol, to'g'risi ✔)
1. Qaysi fikr eng foydali? — ✔ «Chiqishda tasdiq yo'q» — aniq muammo
2. «Zo'r ekan!» nega yetarli fikr emas? — ✔ Nimani yaxshilashni aytmaydi
3. «Yoqmadi» ni foydali fikrga qanday aylantiramiz? — ✔ Aniq muammoni so'raymiz: nima chalkash edi?
4. Doskaning qaysi katagidagi ishni avval qilamiz? — ✔ Ko'p foyda + kam mehnat
5. «Eng qiyinini avval qilamiz» nega xato? — ✔ Ko'p vaqt oladi, natija kech ko'rinadi
6. Ko'p foyda beradigan, lekin katta ish qayerga? — ✔ «Rejaga ol» — keyin bajaramiz
7. Band joyni tasodifan chiqarishni nima to'xtatadi? — ✔ Chiqishda tasdiq (confirm)
8. Bo'sh/band/tushumni bir qarashda ko'rsatadigan upgrade? — ✔ Dashboard (holat paneli)
9. Narx va joylar sonini qorovul o'zi sozlashi uchun? — ✔ Sozlamalar (Settings) paneli
10. Mavjud narxni o'zgartirish uchun qaysi SQL amali? — ✔ UPDATE — mavjud qatorni o'zgartiradi
11. UPDATE va INSERT farqi nimada? — ✔ UPDATE mavjudni o'zgartiradi, INSERT yangi qo'shadi
12. Mahsulotni yaxshilash sikli qanday? — ✔ Qurish → ko'rsatish → fikr olish → saralash → upgrade

## Sinov
`node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m414.mjs <OUT>` — 27/27 · `ru-m414.mjs` toza · `npm run lint:jsx` toza (18.10 00:15). `npm run gates` — 10/12 (tell QUIZ #7 tire, emoji CONSEQ/GuardPanel — eski bloklar, zaxirada ham).
