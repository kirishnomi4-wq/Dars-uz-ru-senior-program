# 1-Modul m1-08 «HTML Praktika — Portfolio sayt» — yakuniy matn

Fayl: `src/1-Modull/HtmlPractice.jsx` · 9 ekran · Oldingi dars: «VS Code» (m1-15) · Keyingi dars: «CSS Praktika» (m1-10, Demo Day sayti)
Holat: 2026-10-16 — kodga mos (F-1015-320…324 dan keyin). `lessonId` = `html-practice-portfolio-v2` (LMS kaliti, o'zgarmagan)

## 0 · Kirish
- Eyebrow: Loyiha kuni · kirish · Sarlavha: Bu sayt nima uchun kerak?
- Mentor: Saytga qarang va javobni tanlang.
- Chapda maket (portfolio.html, dizaynli): Aziza Karimova · Frontend dasturchi · menyu Men haqimda, Loyihalarim, Aloqa ·
  «Men haqimda» — Salom! Men HTML o'rganyapman va o'z saytimni yasayapman. · «Loyihalarim» — Birinchi HTML sahifam; Ro'yxatdan o'tish formasi; CSS bilan bezalgan kartochka ·
  «Aloqa» — Pochta · footer «Aziza Karimova, 2026»
- Savol (ballsiz, variantlar navbat bilan yonadi):
  - Narsa sotish uchun
  - ✔ O'zini va qilgan ishlarini ko'rsatish uchun
  - Yangiliklar o'qish uchun
- Javob izohlari: to'g'ri — «Aynan! Bu — portfolio: siz kimsiz, nima qildingiz, qanday bog'lanish mumkin. Bugun o'zingiznikini qurasiz.» · boshqasi — «Qiziq fikr! Bu — portfolio: …» (davomi bir xil)
- Tugma: Javobni tanlang → Davom etish

## 1 · Reja
- Eyebrow: Reja · Sarlavha: Dars oxirida portfolio sahifangiz tayyor bo'ladi.
- Mentor: Ish o'z kompyuteringizda: kodni Gemini yozadi, siz faylga qo'yasiz va Live Server'da tekshirasiz.
- Karta «Avval tayyorlaning» (mentor gapidan keyin, telefonda ham birinchi):
  1. Ish stolida portfolio papkasini yarating va VS Code'da oching.
  2. Ichida index.html va style.css yarating; index.html da ! + Tab, Go Live.
  3. Boshqa oynada gemini.google.com'ni oching.
  - Tayyor bo'lsa — «Boshlaymiz».
- Chapda «Dars oxirida · namuna» — 0-ekrandagi sayt (menyudagi «Aloqa» bir marta o'zi bosiladi va bo'limga tushadi).
- «Bugungi 3 blok»: 01 Header va «Men haqimda» (header) · 02 Menyu, loyihalar va aloqa (nav) · 03 Dizayn (style.css)
- Tugma: Boshlaymiz

## 2 · Amaliyot 1 — header, bo'lim (a1)
- Eyebrow: Amaliyot 1 · header, bo'lim · Sarlavha: O'zingiz haqingizda yozing — Gemini HTML'ni quradi.
- Forma «Siz haqingizda»:
  - Ismingiz — masalan: Aziza Karimova
  - Yo'nalishingiz — masalan: Frontend dasturchi
  - O'zingiz haqingizda 2 gap — masalan: HTML o'rganyapman. Rasm chizishni yaxshi ko'raman.
  - Tugma: Uchala qatorni to'ldiring → Saqlash. Saqlangach forma yig'iladi (ism · yo'nalish · Men haqimda: …) + «Tahrirlash».
- «Prompt tayyor — endi Gemini orqali quring.» · Prompt (Promptni nusxalash):
```
Portfolio sahifam uchun index.html'ni yozib ber.
<header> ichida: ismim — {ism} (<h1>), yo'nalishim — {yo'nalish} (<p>).
Keyin <section id="men">: sarlavha «Men haqimda» (<h2>) va shu matn: {2 gap}
style.css <link> bilan ulangan bo'lsin. Hozircha CSS yozma, faqat HTML. To'liq faylni qaytar.
```
- O'ngda «Qadamlar»:
  1. Ma'lumotlaringizni yozing va «Saqlash»ni bosing — prompt tayyor bo'ladi.
  2. «Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring.
  3. Javobdagi kodni index.html ga qo'ying (bor kod o'rniga), Ctrl+S.
  4. Live Server'da qarang: ismingiz, yo'nalishingiz va «Men haqimda» bormi? Yo'q bo'lsa, Gemini'ga aniq yozing: «… qo'shilmagan, qo'sh».
- Ostida «Kutilgan natija · namuna» — CSS'siz sahifa: header va «Men haqimda».
- «Davom etish» — nishon Built It!

## 3 · Amaliyot 2 — menyu, havola (a2)
- Eyebrow: Amaliyot 2 · menyu, havola · Sarlavha: Menyu, loyihalar va aloqa bo'limini qo'shing.
- Forma «Loyihalar va aloqa»: 1-loyiha — masalan: Birinchi HTML sahifam · 2-loyiha — masalan: Ro'yxatdan o'tish formasi · 3-loyiha — masalan: CSS bilan bezalgan kartochka · Pochtangiz — masalan: aziza@mail.uz
  - Izoh: Haqiqiy telefon raqamingiz va uy manzilingizni yozmang.
  - Tugma: To'rtala qatorni to'ldiring → Saqlash → yig'iladi (3 loyiha ro'yxati · Pochta: …) + «Tahrirlash».
- «Prompt tayyor — endi Gemini orqali quring.» · Prompt ({ism} — 1-amaliyotda yozilgani):
```
Sahifamga menyu va qolgan bo'limlarni qo'sh.
<header> ichida, yo'nalishimdan keyin <nav>: «Men haqimda» (#men), «Loyihalarim» (#loyihalar), «Aloqa» (#aloqa).
«Men haqimda»dan keyin <section id="loyihalar">: sarlavha «Loyihalarim» (<h2>) va 3 bandli ro'yxat (<ul>): {1-loyiha}; {2-loyiha}; {3-loyiha}.
Keyin <section id="aloqa">: sarlavha «Aloqa» (<h2>) va pochta havolasi: {pochta} (mailto:).
Eng oxirida <footer>: {ism}, 2026.
Bor matnlarimni o'zgartirma. To'liq index.html'ni qaytar.
Mana hozirgi kodim: {index.html kodini shu yerga qo'ying}
```
- O'ngda «Qadamlar»:
  1. Loyihalaringiz va pochtangizni yozing, «Saqlash»ni bosing — prompt tayyor bo'ladi.
  2. «Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi {…} o'rniga index.html kodingizni qo'ying.
  3. Javobdagi kodni index.html ga qo'ying (bor kod o'rniga), Ctrl+S.
  4. Menyudagi har havolani bosing: o'z bo'limiga tushadimi? Tushmasa, Gemini'ga yozing: «Aloqa bosilsa, sahifa qimirlamayapti. href va id ni tekshirib tuzat.»
- Ostida «Kutilgan natija · namuna» — CSS'siz to'liq sahifa (menyu bilan).
- «Davom etish» — nishon Tag It!

## 4 · Amaliyot 3 — dizayn (a3)
- Eyebrow: Amaliyot 3 · dizayn · Sarlavha: Sahifangizga dizayn bering.
- Karta «Rang»: Asosiy rangingiz — masalan: ko'k · izoh: Rangni so'z bilan yozing: «ko'k», «yashil». Kodini Gemini o'zi tanlaydi.
- Rang yozilgach — Prompt (Promptni nusxalash):
```
Sahifamga dizayn ber — faqat style.css'ni yoz, HTML'ni o'zgartirma.
Asosiy rang — {rang}: sarlavhalar va havolalar shu rangda.
Fon och kulrang, sahifa markazda, eni 800px dan oshmasin.
Header qorong'i, ism oq; har bo'lim oq kartochka, burchaklari yumaloq; menyu bir qatorda.
Mana kodim: {index.html kodini shu yerga qo'ying}
```
- «Qadamlar»:
  1. «Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi {…} o'rniga index.html kodingizni qo'ying.
  2. Javobdagi kodni style.css ga qo'ying, Ctrl+S.
  3. Live Server'da qarang: rang, kartochkalar, menyu — siz yozgandekmi? Mos kelmasa, Gemini'ga aniq yozing.
- O'ngda «Kutilgan natija · namuna» — dizaynli sahifa (0-ekrandagi) · ostida: HTML — sahifaning tuzilmasi, CSS — ko'rinishi.
- «Davom etish» — nishon Level Up!

## 5 · Topshirish (s5, yagona ballik)
- Eyebrow: Topshirish · Savol: Menyudagi «Aloqa» bosildi, sahifa qimirlamadi. Nima yetishmaydi? (ko'rinish — boshqa testlar bilan bir xil, F-1015-324)
- Variantlar:
  - A Menyu atrofida `<nav>` tegi yo'q
  - B «Aloqa» sarlavhasi `<h3>` bilan yozilgan
  - C Sahifa oxirida `<footer>` tegi yo'q
  - ✔ D Bo'limda `id="aloqa"` yozilmagan
- Izohlar: to'g'ri — `#aloqa` sahifadan `id="aloqa"` ni qidiradi — topmasa, joyida qoladi. · A — Havola `<nav>` ichida bo'lmasa ham ishlaydi. · B — Sarlavha o'lchami havolaga ta'sir qilmaydi. · C — Footer yo'qligi menyuga tegmaydi. · Maslahat: `#aloqa` sahifadan nimani qidirishini eslang.
- Xato javobdan keyin tugma: To'g'ri javobni toping

## 6 · Amaliyot 4 — yaxshilash (a4)
- Eyebrow: Amaliyot 4 · yaxshilash · Sarlavha: Sahifangizni tekshiring va yaxshilang.
- «Bitta kamchilik»: Nima yoqmadi? — masalan: menyu havolalari bir-biriga yopishib turibdi · Qanday bo'lsin? — masalan: havolalar orasida bo'sh joy bo'lsin
- «Prompt tayyor — Gemini'ga yuboring.» · Prompt (Promptni nusxalash):
```
Sahifamni yaxshila — faqat shu joyni o'zgartir, qolganiga tegma.
Yoqmagani: {nima yoqmadi}.
Qanday bo'lsin: {qanday bo'lsin}.
O'zgargan faylni to'liq qaytar.
Mana kodim: {index.html va style.css kodini shu yerga qo'ying}
```
- Tugma «Keyingi kamchilik» — maydonlar tozalanadi, hisob «Yaxshilandi: N».
- O'ngda «Sahifangizni tekshiring»: Menyudagi uchala havola o'z bo'limiga tushadimi? · «Pochta» bosilsa, xat oynasi ochiladimi? · Hamma matn siz haqingizdami? · Oynani toraytiring: telefonda hammasi sig'adimi? · Eng pastda footer bormi?
- «Qadamlar»:
  1. Ro'yxat bo'yicha sahifangizga qarang va bitta kamchilikni tanlang.
  2. Uni yozing — prompt yig'iladi.
  3. «Promptni nusxalash» → Gemini'ga yuboring, javobdagi kodni faylga qo'ying, Ctrl+S.
  4. «Keyingi kamchilik» — va yana. Dars oxirigacha.

## 7 · Natijalar
Natijalar (podium) — jonli reyting · savol yorlig'i: Bo'limga havola

## Nishonlar
- Built It! — Sahifa boshini va birinchi bo'limni qurdingiz
- Tag It! — Menyu havolalarini bo'limlarga uladingiz
- Level Up! — Portfolio sahifangizni oxirigacha qurdingiz

## Qisqa takrorlash oynalari
s5 «Bo'limga havola»
- `<a href="#aloqa">` — Menyudagi havola: Qaysi bo'limga tushishini # dan keyingi nom aytadi.
- `<section id="aloqa">` — Bo'limning nomi: Havoladagi nom bilan bir xil bo'lishi kerak.
- `<a href="mailto:…">` — Pochta havolasi: Xat yozish oynasini ochadi. · Savol: id ni yozish esdan chiqsa, havola bosilganda nima bo'ladi?

## Jonli viktorina (12 savol, o'zgarmagan)
CODE STRIKE
1. Portfolioda `</footer>` kabi yopuvchi teg qaysi belgi bilan boshlanadi? — \ · ! · # · ✔ /
2. Sarlavha teglari orasida eng KICHIGI qaysi? — h1 · h3 · ✔ h6 · p
3. Loyihalar ro'yxatini (nuqtali) qaysi teg boshlaydi? — ✔ ul · ol · li · a
4. Loyihalar ro'yxatida har bir loyiha qaysi tegga o'raladi? — ul · ✔ li · ol · dd
5. Aloqa havolasida manzil qaysi atributga yoziladi? — src · link · ✔ href · url
6. Sahifa `title` ichidagi matn qayerda ko'rinadi? — Sahifaning o'rtasida · ✔ Brauzer yorlig'ida · Tugmaning ustida · Hech qayerda ko'rinmaydi
7. Ko'rinmaydigan sozlamalar (`title`, `meta`) qaysi qismga yoziladi? — body · p · ✔ head · h1
8. Ismingizni QALIN (bold) qilish uchun qaysi teg? — ✔ strong · small · span · mark
9. `<!DOCTYPE html>` nimani bildiradi? — HTML faylning nomini · Sahifa tili o'zbekcha ekanini · Sahifa tugaganini · ✔ HTML5 hujjat ekanini
10. Sahifa skeletining (shablonining) to'g'ri tartibi qaysi? — head ichida html va body · body ichida head va html · title ichida head · ✔ html ichida head va body
11. Portfolio kodini o'qib, saytga aylantiradigan dastur qaysi? — Server · ✔ Brauzer · Word · Fayl menejeri
12. Yo'nalishingizni QIYA (kursiv) qilish uchun qaysi teg? — ✔ em · ul · a · h1

## Kartochkalar
Yo'q — foydalanuvchi qarori F-1015-320 (pilot naqshi; o'rniga 6-ekran «Yaxshilash»).

## Yakun
- Eyebrow: Yakun · «Loyiha kuni tugadi» · «{N}/1 to'g'ri» · Sarlavha: Portfolio sahifangiz bo'limlardan yig'ildi.
- CODE STRIKE (arena)
- «Endi siz bilasiz»: Gemini'ga sahifani qismlari bilan aniq so'raysiz: header, bo'limlar, footer · Menyu havolasini `id` orqali bo'limga ulaysiz · Dizaynni faqat `style.css` da so'raysiz — HTML o'zgarmaydi · Sahifani ro'yxat bo'yicha tekshirib, aniq so'rov bilan yaxshilaysiz
- Uyga vazifa (Amaliy topshiriqni bajarish →) «Portfolioni o'zingizniki qiling» — VS Code'da, o'z kompyuteringizda:
  1. «Men haqimda»ga yana bitta gap qo'shing — nimaga qiziqasiz
  2. «Loyihalarim»ga to'rtinchi ish qo'shing
  3. Gemini'ga bitta aniq dizayn so'rovi yozing (masalan: «Menyu havolasi ustiga sichqoncha borganda rangi o'zgarsin»), natijani tekshiring
  - Tayyor sahifaning skrinshotini platformaga yuklang.
  - Keyingi dars — CSS Praktika: Demo Day saytingizni boshlaysiz.
- Nishonlaringiz — 3 ta
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Sinovlar (16.10)
gates 12/12 · `seans-vositalar/sinov/tekshir-m108.mjs` 47/48 (❌ faqat qolip `.q-btn` kontrasti 3.28 — nazoratda) · navtest2 9 ekran · mentor (a1/a4 ochiq, s5 «Avval natijani oching») ·
`ru-m108.mjs` 9 ekran toza · ⛶ (`zoom-m108.mjs`) skrolsiz · smoke-onfinished-all `--lang both --seal` (natija scratchpad'da) **2/2**.
