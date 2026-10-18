# 4c-Modul m4c-04 «Loyiha kuni — to'liq lentani qurish» — yakuniy matn

Fayl: `src/4c-Modull/FullPipelineProjectLesson.jsx` · 8 ekran · Oldingi: «GitHub Actions — yo'l xaritasini yozish» (m4c-03) · Keyingi: «AI bilan lentani boshqarish» (m4c-05)
Ip: KitobShop (m4a-04 da qurilgan Nest backend, GitHub'da) → bugun unga haqiqiy CI lenta (GitHub Actions) ulanadi: ci.yml nusxalanadi, push, Actions'da 5 nuqta, README'ga TABLO · Haqiqiy ish: a2 (04/08) · Uchirish — maket
Holat: 2026-10-18 03:xx — kodga mos (F-1015-354 tungi qurish 21 → 8 ekran → 393 kirish javobi → **402 o'lik kod (−376 qator)** → **403 03/08 xira slotlar** → **404 yakun 3 band**; foydalanuvchi «rozimab taklifing ham maqul»). `lessonId: cicd-full-pipeline-4c-03-v18`.
Zaxira: `arxiv/F-1015-402-oldin/` (3225 qator, o'lik kod bilan) · `…403-oldin/` · `…404-oldin/`. Qurish: `qurish/f402.py` … `f404.py` (har biri bir marta). O'lik-kod tahlili: `qurish/olik_ekran_tahlil.py <jsx>` (faqat o'qiydi).

## 0 · Kirish (hook, ballsiz)
- Sarlavha: 1- va 2-darsda nuqtalarni va yo'l xaritasini o'rgandingiz. Bugun — **loyiha kuni**: hammasini o'zingiz birlashtirasiz.
- Mentor: Endi sizning navbatingiz. Bitta real loyihaga — 5 nuqtali to'liq lentani, boshidan oxirigacha, o'zingiz quramiz. Avval qo'lda qanchalik og'ir ekanini eslab ko'ring.
- Chapda terminal «5 nuqtani qo'lda tekshirish» + tugma «▶ 5 nuqtani qo'lda ishga tushirish» → 5 buyruq birma-bir, «✓ 5 buyruq, qo'lda, har push'da qaytadan» · «Birontasini unutsangiz, xato tekshirilmagan yuk yo'lovchiga chiqib ketishi mumkin. Buni to'liq avtomatlashtirsak-chi?»
- O'ngda «Bugun nima qilamiz?»: Har safar 5 nuqtani qo'lda, birma-bir o'zim tekshiraman · ✔ Bugun to'liq LENTA quraman — push qilsam, qolgani o'zi ishlaydi · Faqat Uchirish nuqtasini tekshiraman, qolganini o'tkazib yuboraman.
- Javob (216-qonun, F-393): a «Qo'lda — bittasini unutsangiz, yuk tekshirilmay uchadi.» · b «Aynan!» · c «Qolgan 4 nuqta tekshirilmay qoladi.» + «Bugun 5 nuqtani bitta LENTAga birlashtiramiz.»
- Tugma «Davom etish».

## 1 · Reja
- Sarlavha: KitobShop'ga **haqiqiy lenta**.
- Mentor: Bugun KitobShop'ga lenta ulaysiz: har `git push`'dan keyin GitHub o'zi yig'adi, testlarni yurgizadi, o'lchaydi va o'raydi — repo sahifasida yashil yoki qizil TABLO chiqadi. ✈️ Uchirish bu darsda maketda ko'rsatiladi.
- «Avval tayyorlaning · 3 qadam» (oyna): 1. «Praktika — KitobShop backend» darsidagi KitobShop GitHub'da bo'lsin: `git push` qilingan, repo sahifasi ochiladi. · 2. Kompyuteringizda `npm test` («Unit-test: Jest» darsidagi testlar) va `npm run lint` yashil o'tadimi? · 3. Copilot Chat ochiq bo'lsin — qizil jurnal chiqsa, undan so'raysiz.
- Chapda «Dars oxirida · GitHub Actions»: KitobShop · Actions, «CI passing», 5 nuqta: 📦 Yig'ish npm ci 14s · 🔍 Skaner npm test 9s · 📐 O'lcham ramkasi npm run lint 4s · 🎁 O'rash npm run build 11s · ✈️ Uchirish deploy maket.
- O'ngda «Bugungi 3 blok»: 01 5 nuqtani tizish (o'zingiz) · 02 KitobShop'ga ci.yml va push (GitHub Actions) · 03 Qizil jurnaldan sabab (siz).
- Tugma «Boshlaymiz».

## 2 · Amaliyot 1 · Lenta quruvchisi (s6, nishonli, F-1015-403)
- Sarlavha: Bo'sh yo'l xaritasidan **siz** to'liq lenta quring.
- Mentor: Avval 4 ta xato ssenariysini ko'ring — nima buzilishi mumkinligini biling. Keyin 5 nuqtani **to'g'ri tartibda** tizib, push qiling.
- Chapda «Xato ssenariylari» (4 karta, bosilganda izoh): **Nuqta tushib qolsa** — Masalan O'lcham ramkasi umuman yozilmasa — qoidaga zid kod hech kim tomonidan tutilmay to'g'ridan-to'g'ri o'tib ketadi. · **Tartib teskari bo'lsa** — Uchirish Skanerdan OLDIN tursa — tekshirilmagan buzuq yuk yo'lovchiga chiqib ketishi mumkin. · **on: yozilmasa** — START SIGNALI bo'lmasa, lenta push qilinganda ham umuman aylanmaydi. · **Seyf ulanmasa** — Uchirish nuqtasiga maxfiy kalit ulanmasa, deploy 401 xatosi bilan yiqiladi — token yo'q.
- O'ngda boshidanoq «Lenta tartibi»: 5 xira bo'sh slot (ipuchalar: avval nima yig'iladi · keyin nima skanerlanadi · keyin o'lcham qanday tekshiriladi · keyin qanday o'raladi · eng oxiri qanday uchadi) + «avval chapdagi 4 ssenariyni ko'ring ←». 4 ssenariy ko'rilgach — haqiqiy quruvchi: bo'laklarni bosish/sudrash, «Tartib to'g'ri! Endi push qiling.» → «▶ git push» → lenta aylanadi, jurnal yoziladi → «To'liq lenta ishladi — 5 nuqta yashil, samolyot uchdi, TABLO yashil. Loyihangiz o'zi yetkazildi.»
- Birinchi urinishda to'g'ri tartib — nishon «Pipeline Architect» 🏗️.
- Tugma: «Avval 4 ssenariyni ko'ring» → «5 nuqtani tizing» → «Lentani yig'ib push qiling» → «Lenta aylanmoqda…» → «Davom etish».

## 3 · Amaliyot 2 · GitHub Actions — ci.yml + push (a2, haqiqiy ish, nishonli)
- Sarlavha: KitobShop'ga **ci.yml** qo'shing.
- Mentor: Yo'l xaritasi — bitta fayl: `on: push` START SIGNALI, ostida nuqtalar tartib bilan. Push qilib ko'ring: nuqtalar birma-bir yonadi. Keyin xato kiritib ko'ring — bitta nuqta qizarsa, undan keyingilari o'tkazib yuboriladi.
- Chapda tugmalar «git push» · «+ Lint xatosini kiritish» (→ «✓ Kodda lint xatosi bor»), Actions maketi (5 nuqta, CI …/passing/failing), «Actions · lenta jurnali» (lenta boshlandi … Uchirish o'tkazib yuborildi / Uchirish — maket).
- O'ngda `.github/workflows/ci.yml` (Nusxalash): name: CI · on: push · jobs: lenta: runs-on: ubuntu-latest · steps: checkout@v4 · setup-node@v4 (node 22) · npm ci # Yig'ish · npm test # Skaner · npm run lint # O'lcham ramkasi · npm run build # O'rash · # Uchirish — bu darsda maketda.
- «Qadamlar · 5» (oyna): 1. KitobShop'da `.github/workflows/ci.yml` faylini yarating va nusxani qo'ying. · 2. `package.json` da `test`, `lint`, `build` skriptlari borligini tekshiring. · 3. `git add .` → `git commit -m "CI lenta"` → `git push`. · 4. GitHub → Actions: nuqtalar yashil bo'ldimi? Qizil bo'lsa — jurnalni oching (keyingi amaliyot). · 5. README.md ga TABLO: `![CI](https://github.com/LOGIN/REPO/actions/workflows/ci.yml/badge.svg)`.
- «Davom etish»da nishon «First Flight» ✈️ (BLOK_ACH).

## 4 · Amaliyot 3 · Lenta jurnali (s3, nishonli)
- Sarlavha: TABLO **qizil**. Sababni jurnaldan toping.
- Mentor: Push qildingiz, lekin TABLO qizil chiqdi. Taxmin qilmang — **LENTA JURNALI**ni o'qing. Qaysi nuqtada ✗ turibdi? O'sha qatorni bosing.
- Jurnal (5 qator, bosiladi): 📦 Yig'ish — npm install ✓ 12s · 🔍 Skaner — npm test ✓ 8s · 📐 O'lcham ramkasi — eslint . **✗ 1s Error: Unexpected token** · 🎁 O'rash — o'tkazib yuborildi · ✈️ Uchirish — o'tkazib yuborildi.
- To'g'ri qator: «O'lcham ramkasi nuqtasida xato bor edi — shu sabab O'rash va Uchirish o'tkazib yuborildi (skip). Nuqta tuzatilgach, qolganlar davom etadi.» Qator ✓ 2s ga aylanadi. Nishon «Black Box» 📼.
- Maslahat (2-urinish): «💡 Jurnalni yuqoridan pastga o'qing: ✓ — nuqta o'tdi, — — o'tkazib yuborildi. O'tkazib yuborilganlar qaysi nuqtadan KEYIN boshlangan?»
- Tugma «Sababni jurnaldan toping» → «Davom etish».

## 5 · Test (s12, ballli, nishonli)
- «Yakuniy savol»: TABLO qizil bo'lib qolsa, birinchi navbatda nima qilinadi? — Repozitoriyning o'zi butunlay o'chirilib, yangidan boshlab loyiha qurilyapti · ✔ Jurnal o'qilib sabab topiladi, kerak bo'lsa eski yukka qaytariladi · Hech narsa qilinmaydi, o'z-o'zidan tuzalib ketadi · Faqat TABLO rangini qo'lda yashilga o'zgartiriladi.
- Izohlar: ✔ «Sabab jurnalda, eski yuk esa yo'lovchini kuttirmaydi.» · «Repozitoriyni o'chirish shart emas — sabab bitta joyda.» · «O'z-o'zidan tuzalmaydi — yo'lovchi buzuq yukni olaveradi.» · «TABLO rangini lenta natijasi belgilaydi, qo'lda emas.» Maslahat: «Qizil TABLO'da birinchi qaysi joyga qaraysiz?»
- Eslatma (RECAPS[5]): «Qizil TABLO — jurnal va eski yukni qaytarish». Nishon «Boarding Complete» 🛬.

## 6 · Podium
- «Kim g'olib?» — N/1; mustaqil rejim izohi. Tugma «Davom etish».

## 7 · Yakun (s14, F-1015-404)
- Chiplar: «✓ To'liq lentani qurdingiz» · «N/1 to'g'ri». Sarlavha: Loyihangiz endi **o'zi uchadi**. Code Strike banneri.
- «Endi siz bilasiz»: To'liq lentani 5 nuqtada qurdingiz: Yig'ish → Skaner → O'lcham ramkasi → O'rash → Uchirish · Tartib va START SIGNALI (on: push) nega muhimligini bilasiz · Seyf ulanmasa Uchirish 401 bilan yiqiladi — maxfiy kalit lentaga seyfdan beriladi · Bitta nuqta qizarsa keyingilari o'tkazib yuboriladi — lenta xatoni o'tkazmaydi · Muammo chiqsa — jurnalni o'qib, kerak bo'lsa eski yukni qaytarasiz · TABLO repo sahifasida yashil yoki qizil — lenta holatini bir qarashda ko'rasiz.
- «Uyga vazifa» kapsulasi: **Ulang** — darsda ulgurmagan bo'lsangiz, KitobShop'ga ci.yml qo'shib push qiling · **Kuzating** — Actions bo'limida barcha nuqta yashil bo'lishini tasdiqlang · **Ko'rsating** — TABLONI README.md ga qo'yib, mentorga repo havolasini yuboring.
- «🚀 Endi siz istalgan loyihaga to'liq lentani o'zingiz ulay olasiz!»
- «🏅 Nishonlaringiz» (4: Black Box · Pipeline Architect · First Flight · Boarding Complete) · Arena (12 savol) · tugmalar «Qaytadan» · «Modulni yakunlash ✓».

## Arena (12 savol, to'g'risi ✔)
1. To'liq lentada 5 nuqta qaysi tartibda ishlaydi? — ✔ Yig'ish, Skaner, O'lcham ramkasi, O'rash, Uchirish
2. `on: push` yozuvi lentada nima vazifani bajaradi? — ✔ Push bo'lganda lentani avtomatik ishga tushiradi
3. O'lcham ramkasi nuqtasi lentadan olib tashlansa nima bo'ladi? — ✔ Kod qoidaga zid yozilsa ham hech kim tutmaydi
4. Tartib teskari bo'lib, ✈️ Uchirish 🔍 Skanerdan OLDIN tursa nima bo'ladi? — ✔ Tekshirilmagan buzuq yuk yo'lovchiga chiqib ketadi
5. Maxfiy kalitni ci.yml faylida qanday ishlatamiz? — ✔ `${{ secrets.NOM }}` orqali SEYFdan xavfsiz olamiz
6. Sinov reysi (staging) nima uchun kerak? — ✔ Haqiqiy yo'lovchisiz, xatolarni oldindan sinash uchun
7. Production (haqiqiy reys) sinov reysidan nimasi bilan farq qiladi? — ✔ U yerda haqiqiy yo'lovchi (foydalanuvchi) bor
8. Yangi versiya production'da xato chiqarsa, tezkor yechim nima? — ✔ Eski yukni qaytarish (rollback)
9. Eski yukni qaytarish (rollback) qachon eng to'g'ri qaror bo'ladi? — ✔ Yangi versiya productionda muammo chiqarganda
10. TABLO (status badge) repo sahifasida nimani ko'rsatadi? — ✔ Lenta hozir yashilmi yoki qizilmi ekanini
11. LENTA JURNALIDA qizil chiroq ko'rinsa, birinchi navbatda nima qilinadi? — ✔ Jurnal o'qilib, qaysi nuqta va nega to'xtaganini topiladi
12. Bitta yo'l xaritasida ikkita mustaqil nuqta parallel ishlasa, ular bir-biriga qanday ta'sir qiladi? — ✔ Mustaqil — biri yiqilsa, ikkinchisi baribir davom etadi
- Eslatma: 6–7 (staging/production) va 5 (secrets) arena savollari m4c-01…03 darslarida o'tilgan atamalarga tayanadi — praktikada ekran yo'q, lekin arena modul-mikro doirasi. Qoldirildi.

## Sinov
`node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m4c04.mjs <OUT>` — 23/23 · `ru-m4c04.mjs` toza · `npm run lint:jsx` toza (18.10 03:xx). `npm run gates` — ❌ 9 (tell QUIZ #5/#7/#8/#12; emoji RECAP-konst, POINTS, CI_NUQTA, LOG_LINES, QUIZ_BANK) — hammasi F-354 dan oldingi bloklar, zaxirada ham 9.
