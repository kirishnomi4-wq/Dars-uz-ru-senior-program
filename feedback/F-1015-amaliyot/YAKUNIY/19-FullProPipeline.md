# 4c-Modul m4c-07 «Loyiha kuni: ishonchli lenta» — yakuniy matn (LMS 6-Modul oxirgi darsi)

Fayl: `src/4c-Modull/FullProPipelineLesson.jsx` · 7 ekran · Oldingi: «Saytingiz hozir ochilyaptimi?» (m4c-06, PM) · Keyingi: 5-Modul (LMS 7) — bu dars LMS 6-Modul (4a+4b+4c) ning oxirgisi
Ip: KitobShop lentasi (m4c-04) + Copilot bilan tuzatish (m4c-05) → bugun ci.yml ga 3 haqiqiy yaxshilash: matrix (Node 22/24), cache: npm, secrets (JWT_SECRET) · Sinov reysi va rollback — maket · Haqiqiy ish: a2 (04/07) · Nishon 3
Holat: 2026-10-18 03:xx — kodga mos (F-1015-356 tungi qurish → 393 kirish → **407 03/07 qulf-holat + 2-muhit moslik**). `lessonId: full-pro-pipeline-4c-04-v18`. O'lik ekran: 0.
Zaxira: `arxiv/F-1015-407-oldin/`. Qurish: `qurish/f407.py`.

## 0 · Kirish (hook, ballsiz)
- Sarlavha: Lentangiz yashil chiqdi — lekin productionda sayt **ishlamay qoldi**. Nega?
- Mentor: Oldingi darslarda to'liq lentani qurdingiz: **Yig'ish → Skaner → O'rash → Uchirish**. Hammasi yashil edi. Lekin production serverda boshqa muhit ishlatilar ekan. Tugmani bosing — nima bo'lganini ko'ramiz.
- Chapda «lenta jurnali»: $ npm test · ✓ testlar yashil (Node 24 muhitida) · $ deploy → production; «▶ Production serverni tekshirish» → ⚠ production Node 22'da ishlaydi · ✗ sayt production'da xato beryapti · ✓ Sabab topildi: «Lenta faqat bitta muhitda (Node 24) tekshirilgan edi. Production esa boshqa versiyada ishlar ekan — farq shu yerda chiqdi.»
- O'ngda «Bunday holatni qanday oldini olamiz?»: Productionni ham xuddi shu bitta muhitga moslab qo'yaman · ✔ Bir nechta muhitda (masalan Node 22, 24) parallel tekshiraman · E'tibor bermayman — ilgari ham baribir ishlagan edi.
- Javob (216): a «Boshqa server kelganda yana sinadi.» · b «Aynan!» · c «Unda xatoni foydalanuvchi topadi.» + «Bugun lentani bir nechta muhitda parallel tekshiramiz.»

## 1 · Reja
- Sarlavha: KitobShop lentasini **ishonchli** qilamiz.
- Mentor: KitobShop'da lenta bor va qizil testni Copilot bilan tuzatdingiz. Bugun `ci.yml` ga 3 ta haqiqiy yaxshilash qo'shasiz: ikki Node versiyasida birdan tekshirish (matrix), tez yig'ish (kesh) va maxfiy kalitni seyfdan olish (secrets). Sinov reysi va eski yukni qaytarishni maketda ko'rasiz.
- «Avval tayyorlaning · 3 qadam»: 1. «Loyiha kuni — to'liq lentani qurish» darsidagi `ci.yml` KitobShop'da bor: GitHub → Actions yashil. · 2. KitobShop'ning `.env` faylidagi `JWT_SECRET` qiymatini oching («Autentifikatsiya va .env» darsidan) — u GitHub seyfiga qo'yiladi, kodga emas. · 3. GitHub'da KitobShop repo sahifasini oching: «Settings» bo'limi ko'rinadimi?
- Chapda «Dars oxirida · GitHub Actions»: CI passing · lenta (22) Node 22 33s · lenta (24) Node 24 30s. O'ngda «Bugungi 2 blok»: 01 4 yaxshilash va eski yukni qaytarish (maket) · 02 KitobShop ci.yml: matrix, kesh, seyf (GitHub Actions).

## 2 · Amaliyot 1 · ishonchli lenta (maket) (s13, nishonli, F-1015-407)
- Sarlavha: Lentani **o'zingiz** ishonchli qiling.
- Mentor: 4 ta yaxshilashni birma-bir yoqing — har birida **oldin/keyin** farqni ko'rasiz. Hammasi yoqilgach, production'dagi buzuq yukni **qaytarasiz**.
- Chapda 4 karta «yoqish»: 🧬 **Parallel lentalar** — Oldin: 1 muhitda tekshiriladi — production'da kutilmagan xato chiqishi mumkin · Keyin: 2 muhitda (Node 22/24) parallel tekshiriladi — muammo oldindan ko'rinadi · 💨 **Yaqin javon** — Oldin: Har reysda 40 soniya install · Keyin: Kesh bilan 8 soniya install — 5 baravar tez · 🔐 **Seyf** — Oldin: Kalit ochiq matnda — repo ochiq bo'lsa ko'rinadi · Keyin: Kalit seyfda — kod ichida hech qachon ochiq yozilmaydi · 🛫 **Sinov reysi** — Oldin: To'g'ridan-to'g'ri haqiqiy reysga chiqadi · Keyin: Avval sinov reysida tekshiriladi, keyin haqiqiy reysga.
- O'ngda boshidanoq xira «Oldin / Keyin — yaxshilashni yoqing — farq shu yerda chiqadi ←»; yoqilgan har karta uchun Oldin/Keyin kartasi. 4/4 yoqilgach chapda buzuq telefon + «Eski yukni qaytarish (rollback)» → «🎉 Bir bosishda oldingi ishlaydigan yukka qaytdingiz — foydalanuvchi endi yana ishlaydigan saytni ko'radi. Lenta endi ishonchli: tez, xavfsiz, qaytariladigan.»
- Nishon «Pro Pipeline» 🏎️. Tugma «Yaxshilashlarni yoqing (N/4)» → «Eski yukni qaytaring» → «Davom etish».

## 3 · Amaliyot 2 · GitHub Actions — matrix, kesh, seyf (a2, haqiqiy ish, nishonli)
- Sarlavha: KitobShop lentasiga **matrix, kesh va seyf**.
- Mentor: `matrix` — KitobShop ikki Node versiyasida birdan tekshiriladi. `cache: npm` — ikkinchi push'dan boshlab paketlar tezroq o'rnatiladi. `env` — kalit seyfdan keladi va jurnalda *** bo'lib ko'rinadi. Ikki marta push qilib ko'ring.
- Chapda tugmalar «git push» · «+ Kalitni kodga ochiq yozish» (tuzoq: «Kalit kodda ochiq yozilsa, repo'ni ko'rgan har kim uni o'qiydi va GitHub uni yashira olmaydi. Seyfga qo'ying: `${{ secrets.JWT_SECRET }}`.»), Actions maketi lenta (22)/(24), lenta jurnali («lenta boshlandi — 2 ish birga» · «kesh topilmadi — birinchi marta saqlanadi» · 2-push: «kesh tiklandi (Cache restored)» → «Ikkinchi push: kesh tiklandi, npm ci 38s → 6s. Ikkala Node versiyasi yashil, kalit yashirin.»).
- O'ngda `.github/workflows/ci.yml` (Nusxalash): name: CI · on: push · jobs: lenta: runs-on: ubuntu-latest · strategy: matrix: node: [22, 24] · env: JWT_SECRET: ${{ secrets.JWT_SECRET }} · steps: checkout@v4 · setup-node@v4 (node-version: ${{ matrix.node }}, cache: npm) · npm ci · npm test · npm run lint · npm run build.
- «Qadamlar · 5»: 1. GitHub → KitobShop → Settings → Secrets and variables → Actions → «New repository secret»: nomi `JWT_SECRET`, qiymati — `.env` dagi qiymat. · 2. `.github/workflows/ci.yml` ni nusxa bilan almashtiring: `strategy.matrix`, `env` va `cache: npm` qo'shildi. · 3. `git add .` → `git commit -m "Ishonchli lenta"` → `git push`. · 4. Actions: ikki ish birga yonadi — «lenta (22)» va «lenta (24)». Jurnalda kalit `***` bo'lib ko'rinadi. · 5. Yana bitta kichik push (masalan README) — `setup-node` qadamida kesh tiklanadi, `npm ci` tezroq o'tadi.
- «Davom etish»da nishon «Vault Keeper» 🔐.

## 4 · Yakuniy amaliy (s15, ballli, nishonli)
- Sarlavha: Oxirgi qadam: ishonchli lentani **to'g'ri tartibda** yig'ing. Mentor: Bosqichlarni sudrab to'g'ri tartibga joylang.
- Bo'laklar: git push — kod GitHub'ga · Lenta — matrix, kesh, seyf · Staging — sinov reysi · Staging'da tekshirish · ✈️ Production — haqiqiy reys. To'g'ri: Push → Lenta → Staging → Tekshirish → Production.
- Xato: «Sinov reysisiz haqiqiy reysga chiqib ketdi! Tekshirilmagan yuk to'g'ridan-to'g'ri yo'lovchi qo'liga tushdi. Tartibni to'g'rilang.» To'g'ri: «✓ Ishonchli lenta tayyor: Push → Lenta → Staging → Tekshirish → Production. Muammo chiqsa — rollback bilan bir bosishda qaytarasiz.» «📖 Eslatma».
- Nishon «Order Matters» 🔀 (1-urinishda). Tugma «Lentani yig'ing» → «Davom etish».

## 5 · Podium — «Kim g'olib?», N/1.

## 6 · Yakun
- Chiplar: «✓ Ishonchli lentani yig'dingiz» · «N/1 to'g'ri». Sarlavha: Endi lentangiz — **tez, xavfsiz, qaytariladigan**.
- «Endi siz bilasiz»: Matrix — bitta yukni bir nechta muhitda (masalan Node versiyalarida) parallel tekshiradi · Cache — avvalgi paketlarni saqlab, keyingi reysni sezilarli tezlashtiradi · Secret — maxfiy kalitlar hech qachon ochiq yozilmaydi, faqat seyfdan chaqiriladi · Staging → Production — avval sinov reysida, keyin haqiqiy reysga chiqariladi · Rollback — production'da muammo chiqsa, bir bosishda eski yukka qaytiladi.
- «Uyga vazifa»: **Qo'shing** — darsda ulgurmagan bo'lsangiz, KitobShop ci.yml'iga matrix, kesh va seyfni qo'shib push qiling · **O'lchang** — Actions'da 1- va 2-push'dagi npm ci vaqtini solishtiring (kesh farqi) · **Tekshiring** — loyihangizda hech qanday maxfiy kalit ochiq yozilmaganini tekshiring.
- «🚀 Loyiha kuni davom etadi — endi bu ishonchli lentani o'z bitiruv loyihangizga qo'llaysiz!» · «🏅 Nishonlaringiz» (3) · Arena (12) · «Qaytadan» · «Yakunlash ✓».

## Arena (12 savol, to'g'risi ✔)
1. Parallel lentalar (matrix) nima uchun ishlatiladi? — ✔ Bir nechta muhitda (masalan, Node versiyalarida) bir vaqtda sinash uchun
2. Yaqin javon (cache) nimani tezlashtiradi? — ✔ Paketlarni qaytadan yuklamaslik orqali install bosqichini tezlashtiradi
3. Maxfiy kalitni (masalan API_KEY) yo'l xaritasiga qanday yozish xavfsiz? — ✔ Seyfga saqlab, keyin maxsus belgi orqali chaqirib ishlatiladi
4. Sinov reysi (staging) nima uchun kerak bo'ladi? — ✔ Haqiqiy reysdan oldin yo'lovchisiz alohida sinab ko'rish uchun
5. Yangi o'ralgan yuk productionda buzuq chiqdi. Eng tez yechim nima bo'ladi? — ✔ Eski yukni qaytarish (rollback) bilan oldingi versiyaga darhol qaytiladi
6. Matrix'da 2 muhitdan biri (masalan Node 22) qizil chiroq bersa nima bo'ladi? — ✔ Aynan o'sha muhit qizil ko'rinadi, qaysi sharoitda singani aniqlanadi (407: 3 muhit/Node 18 → 2 muhit/Node 22)
7. Yaqin javon (cache) qanday qilib ishlaydi? — ✔ Avvalgi reysda yuklangan paketlarni saqlab, keyin qayta ishlatiladi
8. Seyf (secrets) qayerda saqlanishi kerak bo'ladi? — ✔ Platformaning maxsus xavfsiz seyf sozlamalar bo'limida saqlanadi
9. Sinov reysi (staging) va haqiqiy reys (production) orasidagi farq nima? — ✔ Sinov reysida yo'lovchi yo'q, haqiqiy reysda esa yo'lovchi bor
10. Eski yukni qaytarish (rollback) qachon ishlatilishi kerak bo'ladi? — ✔ Yangi versiya productionda muammo chiqarganda, tez qaytish uchun
11. Parallel lentalar foydali — turli muhitda kod boshqacha ishlashi mumkinmi? — ✔ Ha, chunki turli muhitlarda kod har xil natija berishi mumkin bo'ladi
12. Ishonchli lentada to'g'ri tartib qanday bo'lishi kerak? — ✔ Avval sinov reysi (staging), so'ngra haqiqiy reys (production)

## Sinov
`node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m4c07.mjs <OUT>` — 28/28 · `ru-m4c07.mjs` toza · `npm run lint:jsx` toza (18.10 03:xx). `npm run gates` — ❌ 2 (eski, zaxirada ham 2).
