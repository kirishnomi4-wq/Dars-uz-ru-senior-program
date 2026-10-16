# 1-Modul m1-11 «Netlify va deploy» — yakuniy matn

Fayl: `src/1-Modull/DeployLesson.jsx` · 11 ekran · Oldingi dars: «Git va GitHub» (m1-09); sayt ipi — CSS Praktika (m1-10, `ccDemoDay`) · Keyingi: Demo Day (havola `ccPitch3.link`)
Holat: 2026-10-16 — kodga mos (F-1015-328…330 dan keyin). `lessonId` = `netlify-deploy-v19` (LMS kaliti, o'zgarmagan) · oldingi 17 ekranli: `arxiv/F-1015-deploy-oldin/`

## 0 · Kirish
- Eyebrow: Kirish · Sarlavha: Saytingiz faqat kompyuteringizda turibdi. Do'stingizga qanday ko'rsatasiz?
- Mentor: Uch javobdan bittasini tanlang.
- Chapda maket: «💻 Mening kompyuterim» (localhost:5500 — sayt ochiladi) / «📱 Do'stimning telefoni» (Bu sahifa ochilmadi · manzil topilmadi)
- «Sizningcha qaysi biri?» (ballsiz):
  - Sayt faylini Telegram orqali yuboraman
  - ✔ Saytni internetga chiqarib, havolasini yuboraman
  - Do'stim mening kompyuterimga kelib ko'radi
- Javob: «Javob — ikkinchisi. Sayt internetga chiqsa, bitta havola yetadi: do'stingiz uni telefonida ochadi. Bugun saytingizni davom ettirasiz va shunday havola olasiz.»

## 1 · Reja
- Eyebrow: Reja · Sarlavha: Bugun nima qilamiz?
- Mentor: Dars oxirida saytingiz internetda turadi — havolasini istagan odamga yubora olasiz.
- Karta «Avval tayyorlaning»: 1. CSS Praktikada boshlagan mening-saytim papkangizni VS Code'da oching. · 2. index.html da Go Live — bosh sahifangiz ochilsin. · 3. Boshqa oynada gemini.google.com'ni oching.
- 3 karta: ⭐ Saytingizni davom ettirasiz — qolgan sahifalar va animatsiya → 🌐 Netlify bilan tanishasiz — saytlar internetda shu yerda turadi → 🚀 Saytingizni internetga chiqarasiz — havolasini do'stlaringizga yuborasiz
- Faqat mentorga: ~40 daqiqa — saytni davom ettirish (1-qadam), ~30 daqiqa — Netlify va deploy (2–3-qadam).
- Tugma: Boshlaymiz →

## 2 · Amaliyot 1 — sahifalar (apages)
- Eyebrow: Amaliyot 1 · sahifalar · Sarlavha: Saytingizga qolgan sahifalarni qo'shing.
- Mentor: Bosh sahifangiz tayyor. Endi saytingizda yana qaysi sahifalar bo'lishini o'ylang: har biriga nom va bitta gap yozing — unda nima turadi. Masalan, to'garak sayti uchun: Jadval, Ustozlar, Aloqa.
- Forma «Saytingiz»: Loyihangiz nomi (CSS Praktikadan tayyor keladi — masalan: To'garak jadvali) · 2 / 3 / 4-sahifa: nomi + nima bo'ladi
  (masalan: Jadval — har kunning to'garaklari va vaqti · Ustozlar — har ustoz, uning to'garagi va xonasi · Aloqa — telefon, manzil va ish vaqti) · izoh: 1-sahifa — bosh sahifangiz, u tayyor.
  - Tugma: Hamma qatorni to'ldiring → Saqlash → yig'iladi (nom + 4 sahifa ro'yxati: «Bosh sahifa — tayyor», …) + «Tahrirlash».
- «Prompt tayyor — endi Gemini orqali quring.» · Prompt:
```
Saytimni davom ettiramiz. Loyiham — «{nom}». Bosh sahifa (index.html) va style.css tayyor, ular quyida.
Yana 3 sahifa qo'sh, har biri alohida .html fayl:
– «{2-sahifa}» — {mazmuni};
– «{3-sahifa}» — {mazmuni};
– «{4-sahifa}» — {mazmuni};
Fayl nomlari lotin harflarida, kichik harf, bo'sh joysiz bo'lsin (masalan: jadval.html).
Har sahifada bosh sahifadagi menyu va footer bir xil tursin; menyuda hamma sahifa bo'lsin, index.html dagi menyuni ham yangila.
Yangi sahifalar ham shu style.css ga ulansin va shu dizaynda bo'lsin; kerak bo'lsa style.css ga yangi qoidalar qo'sh.
Har faylni alohida, to'liq yoz va tepasiga fayl nomini yoz.
Mana kodim: {index.html va style.css kodini shu yerga qo'ying}
```
- O'ngda «Qadamlar»: 1. Sahifalaringizni yozing va «Saqlash»ni bosing — prompt tayyor bo'ladi. · 2. «Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi {…} o'rniga index.html va style.css kodingizni qo'ying. ·
  3. mening-saytim papkasida Gemini aytgan nomlar bilan yangi fayllar yarating, kodlarni qo'ying; index.html ni ham yangisiga almashtiring, Ctrl+S. ·
  4. Live Server'da menyudagi har havolani bosing: sahifa ochiladimi, dizayni bir xilmi? Ochilmasa, Gemini'ga yozing: «… sahifasi ochilmayapti, menyudagi havolani tuzat».

## 3 · Amaliyot 2 — animatsiya (aanim)
- Eyebrow: Amaliyot 2 · animatsiya · Sarlavha: Saytingizni jonlantiring.
- «Animatsiya» (bittasi): Silliq paydo bo'lish — bo'limlar pastdan suzib chiqadi · Jonli kartalar — sichqoncha kelsa ko'tariladi · Harakatdagi fon — bosh qism ranglari oqadi · Yozuv terilishi — sarlavha harfma-harf yoziladi
  - izoh: Bittasini tanlang — o'ngdagi namunada ko'rasiz, keyin prompt ochiladi. / Bosib ko'ring — namunada qayta o'ynaydi.
- O'ngda «Saytingiz · namuna» — o'quvchining CSS Praktikadagi uslubida, tanlangan animatsiya jonli · ostida: Animatsiya — faqat CSS: HTML o'zgarmaydi. · keyin «Qadamlar · 3 ▾» tugmasi.
- Prompt: «Saytimga animatsiya qo'sh — faqat style.css'ni o'zgartir, HTML'ni o'zgartirma, bor dizaynimni buzma. {tanlangan animatsiya tavsifi} @keyframes va transition bilan yoz. Harakatni yoqtirmaydiganlar uchun @media (prefers-reduced-motion: reduce) ichida animatsiya o'chsin. O'zgargan style.css ni to'liq qaytar. Mana kodim: {…}»
  - Tavsiflar: paydo — hero va kartalar pastdan suzib chiqsin (20px, 0.6 s, kechikib) · karta — kartaga kelganda 6px ko'tarilsin, soya kattalashsin; tugmalar biroz kattalashsin (0.3 s) · fon — hero foni ikki rangli gradient, sekin oqsin (200%, 8 s) · yozuv — sarlavha harfma-harf (2.5 s), oxirida kursor miltillasin
- Qadamlar: 1. «Promptni nusxalash» → Gemini'ga qo'ying, {…} o'rniga index.html va style.css. · 2. Javobdagi kodni style.css ga qo'ying (bor kod o'rniga), Ctrl+S. · 3. Live Server'da sahifani yangilang (F5): animatsiya o'ngdagi namunadagidek ishlayaptimi? Yana birini qo'shmoqchi bo'lsangiz — boshqasini tanlab, promptni yana yuboring.

## 4 · Amaliyot 3 — scroll (ascroll)
- Eyebrow: Amaliyot 3 · scroll · Sarlavha: Sayt pastga aylantirilganda jonlansin.
- «Scroll effekti» (bittasi): Scroll'da paydo bo'lish — bo'limlar yonidan suzib chiqadi · Rang almashuvchi fon — pastga tushgan sari fon o'zgaradi · O'qish chizig'i — tepadagi chiziq to'lib boradi · Parallaks — rasm matndan sekinroq siljiydi
  - izoh: Namuna o'zi aylanadi — sichqoncha bilan o'zingiz ham aylantiring.
- O'ngda «Saytingiz · namuna» (o'zi sekin aylanadi; effekt jonli) · ostida: Bu effekt — faqat CSS: Chrome va Edge'da ishlaydi. · «Qadamlar · 3 ▾».
- Prompt: «Saytimga scroll animatsiyasini qo'sh — faqat style.css'ni o'zgartir, HTML'ni o'zgartirma, JavaScript ishlatma, bor dizaynimni buzma. {effekt tavsifi — animation-timeline: view() / scroll()} Harakatni yoqtirmaydiganlar uchun @media (prefers-reduced-motion: reduce) ichida animatsiya o'chsin. O'zgargan style.css ni to'liq qaytar. Mana kodim: {…}»
- Qadamlar: 1. nusxalash → Gemini, {…} o'rniga kod · 2. style.css ga, Ctrl+S · 3. Saytni Chrome'da oching va sekin pastga aylantiring: effekt namunadagidek ishlayaptimi? Ishlamasa, Gemini'ga yozing: «scroll animatsiyasi ishlamayapti, tuzat».

## 5 · Netlify (s1)
- Eyebrow: Netlify · Sarlavha: Sayt papkangiz internetda qayerda yashaydi?
- Mentor: Sayt papkangizni doimo yonib turadigan begona kompyuterga qo'yish kerak. Shunday kompyuter Netlify'da turadi: u papkani oladi va sizga havola beradi. Tugmani bosing.
- Yo'l (▶ Boshlash): 📁 Sayt papkangiz (index.html, style.css) → 🌐 Netlify (hech qachon o'chmaydigan kompyuter) → 🔗 Havola (saytingiz barchaga ochiladi)
- Xulosa: Netlify uchun alohida parol o'ylab topmaysiz — u yerga GitHub hisobingiz bilan kiriladi. GitHub sizda bor: Git darsida ochgansiz.
- Tugma: Yo'lni ko'rsating → Davom etish

## 6 · Tekshiruv · 1-savol (s2, ballik)
- Netlify nima qiladi? — ✔ Sayt papkangizni internetda saqlaydi va havola beradi · Kodni chiroyli ranglar bilan bezaydi · Internet tezligini oshiradi · Telefonga o'yin o'rnatadi
- Izohlar: to'g'ri — Netlify fayllarni doimo yonib turgan kompyuterda saqlaydi. · B — Kodni chiroyli bezash — CSS ishi, Netlify'niki emas. · C — Netlify internet tezligiga ta'sir qilmaydi. · D — Netlify'ning telefon o'yinlariga aloqasi yo'q.
- Qisqa takrorlash «Netlify — saytning internetdagi joyi»: Netlify nima qiladi? · Kompyuteringiz va Netlify farqi · Adashtirmang! (Netlify bezamaydi — CSS bezaydi)

## 7 · Amaliyot · Netlify (sdrop)
- Eyebrow: Amaliyot · Netlify · Sarlavha: Saytingizni internetga chiqaring.
- Mentor: Saytni internetga chiqarish deploy deyiladi. Netlify'ga GitHub bilan kirasiz va sayt papkasini sudrab tashlaysiz.
- «✅ Kompyuteringizda bajaring» (bittalab, ✓ Bajardim; chapda har qadam maketi):
  1. Brauzerda netlify.com saytini oching — Manzilni qo'lda yozing — bu rasmiy sayt.
  2. «Log in» → «Log in with GitHub», keyin GitHub sahifasida «Authorize Netlify» — Alohida parol o'ylab topmaysiz: GitHub hisobingiz yetadi.
  3. Netlify'dagi Projects sahifasining eng pastiga tushing — U yerda sayt papkasini tashlash uchun katta maydon turadi. (Bajarolmadim: app.netlify.com/drop)
  4. mening-saytim papkasini shu maydonga sudrab tashlang — Papkaning o'zini tashlang, ichidagi fayllarni birma-bir emas.
  5. Havola chiqadi — uni nusxalang va bosib, saytingiz ochilishini tekshiring — Havola oxiri .netlify.app bo'ladi.
- Keyin: «Netlify bergan havola: https://….netlify.app» → Saqlash · Bu havola Demo Day darsida kerak bo'ladi.

## 8 · Yakuniy savol (s12, ballik)
- Do'stingiz saytingizni telefonida ochishi uchun unga nima yuborasiz? — index.html faylini · Sayt papkasini arxiv qilib · GitHub parolimni · ✔ Netlify bergan havolani
- Izohlar: to'g'ri — Sayt internetda — do'stingizga havolaning o'zi yetadi. · A — Bitta fayl do'stning telefonida sayt bo'lib ochilmaydi. · B — Arxivni ochish uchun kompyuter kerak. · C — Parol hech qachon hech kimga yuborilmaydi.

## 9 · Natijalar
Podium — jonli reyting · yorliqlar: Netlify vazifasi · Havola (yakuniy)

## Nishonlar
- Host Pick! — Netlify nima qilishini aniqladingiz (1-savol)
- Ship It! — Saytni do'stingizga qanday ulashishni bildingiz (yakuniy savol)
- Level Up! — Deploy darsini yakunladingiz (yakun ekrani)

## Jonli viktorina (12 savol, o'zgarmagan)
1. Netlify nima qiladi? — ✔ Sayt papkasini internetda saqlab, havola beradi · Kodni chiroyli ranglar bilan bezaydi · Internet tezligini oshiradi · Telefonni zaryadlaydi
2. AI bergan bosh sahifa faylini qaysi nom bilan saqlaysiz? — style.css · ✔ index.html · rasm.jpg · netlify.txt
3. Saytni internetga chiqarish qanday ataladi? — Nusxalash · Restart · ✔ Deploy · Zoom
4. Netlify'ga qanday kiriladi? — Yangi parol o'ylab topib · SMS kod bilan · Bank kartasi bilan · ✔ GitHub hisobi bilan
5. Bugun saytni Netlify'ga qanday qo'ydik? — Telegram orqali yuborib · Elektron pochtaga yozib · ✔ Sayt papkasini sudrab tashlab · Flesh kartaga yozib
6. Saytni o'zgartirdingiz. Internetdagi versiya qanday yangilanadi? — ✔ Papkani Netlify'ga qayta sudrab tashlayman · Havolani o'chirib qayta yozaman · Kompyuterni o'chirib yoqaman · O'z-o'zidan, hech narsa qilmayman
7. Deploydan keyin Netlify sizga nima beradi? — Yangi kompyuter · ✔ Sayt havolasini · Yangi parol · Bepul internet
8. Do'stingiz saytni telefonida ochishi uchun unga nima yuborasiz? — index.html faylini · GitHub parolimni · Sayt papkasini arxiv qilib · ✔ Sayt havolasini
9. Sayt sahifalari bir-biriga nima orqali ulanadi? — ✔ Menyudagi havolalar orqali · Rasmlar orqali · Parol orqali · Fayl hajmi orqali
10. AI'ga sayt topshirig'ini yozganda nima ko'rsatiladi? — Faqat sevimli rang · Faqat ism · ✔ Sahifalar ro'yxati va shartlar · Hech narsa
11. Sayt telefonda ham chiroyli chiqishi uchun AI topshirig'iga nima yozasiz? — Hamma sahifa bitta faylda bo'lsin · Rasm umuman qo'yma · Faqat kompyuter uchun qil · ✔ Telefonda ham, kompyuterda ham chiroyli ko'rinsin
12. Deploydan keyin saytni kim ko'ra oladi? — Faqat men, o'z kompyuterimda · ✔ Havolani bilgan har kim · Faqat mentor · Faqat GitHub xodimlari

> ⚠️ Mavzu tekshiruvi (F-1015-331): **11-savol** olingan «AI topshirig'i» ekraniga tayanadi (u yerdagi 5-shart) — darsda endi yo'q. **10-savol** a1 promptiga hali mos (sahifalar ro'yxati + shartlar).
> Almashtirish — foydalanuvchi qarori bilan (to'g'ri javob o'rni 3 qolsin: 3/3/3/3).

## Kartochkalar
Yo'q — foydalanuvchi qarori F-1015-329.

## Yakun
- Eyebrow: Tayyor · «Dars tugadi» · «{N}/2 to'g'ri» · Sarlavha: Saytingiz endi internetda.
- CODE STRIKE (arena)
- «Endi siz bilasiz»: Netlify sayt papkasini internetda saqlaydi va havola beradi · Saytga Gemini bilan qolgan sahifalarni qo'shish va menyuni ulash · Saytni CSS animatsiya va scroll effekti bilan jonlantirish · Netlify'ga GitHub hisobi bilan kirish · Papkani sudrab tashlab deploy qilish va havolani olish
- Uyga vazifa (Amaliy topshiriqni bajarish →) «🔗 Sizning havolangiz» — saqlangan havola, so'ng:
  - Saytni tugating — hamma sahifa ochilsin, menyu ishlasin
  - Matnni tekshiring — har gap loyihangiz haqida bo'lsin
  - Saytni yangilang — Netlify'da saytingiz nomini bosing, Deploys bo'limini oching va o'zgargan papkani o'sha yerga qayta sudrab tashlang
  - Havolani yuboring — platformadagi vazifa-savoliga va do'stlaringizga
  - Bu havola Demo Day repetitsiyasida ham kerak bo'ladi.
- LMS uy vazifasi (HOMEWORK, type text): «Saytingizni tugatib, havolasini yuboring» — o'zgarmagan.
- Nishonlaringiz — 3 ta · Tugmalar: Orqaga · Qaytadan · Yakunlash ✓

## Sinovlar (16.10)
gates 10/12 (tell/emoji — eski versiyada aynan shu, KATTA F-1015-306) · `seans-vositalar/sinov/tekshir-m111.mjs` **52/52** · navtest2 11 ekran · mentor (amaliyotlar ochiq, test yopiq) ·
`ru-m111.mjs` 11 ekran toza · smoke-onfinished-all `--lang both --seal` (natija scratchpad'da) **2/2**.
