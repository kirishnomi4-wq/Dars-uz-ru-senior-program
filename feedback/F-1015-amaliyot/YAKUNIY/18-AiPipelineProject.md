# 4c-Modul m4c-05 «AI bilan lentani boshqarish» — yakuniy matn

Fayl: `src/4c-Modull/AiPipelineProjectLesson.jsx` · 7 ekran · Oldingi: «Loyiha kuni — to'liq lentani qurish» (m4c-04) · Keyingi: «Saytingiz hozir ochilyaptimi?» (m4c-06, PM) → «Loyiha kuni: ishonchli lenta» (m4c-07)
Ip: KitobShop lentasi (m4c-04 da ulangan) qizil yonadi → jurnal → Copilot Chat'dan aniq so'rov → taklifni jurnal bilan tekshirish → tuzatish → push · Haqiqiy ish: a2 (04/07) Copilot Chat «Agent» · Nishon 3
Holat: 2026-10-18 03:xx — kodga mos (F-1015-355 tungi qurish → 393 kirish javobi → **405 03/07 qulf-holat** → **406 yakun matni**; foydalanuvchi «maqul»). `lessonId: cicd-ai-pipeline-4c-05-v18`. O'lik ekran: 0 (tahlil).
Zaxira: `arxiv/F-1015-405-oldin/` · `arxiv/F-1015-406-oldin/`. Qurish: `qurish/f405.py`, `f406.py`.

## 0 · Kirish (hook, ballsiz)
- Sarlavha: Lentada qizil chiroq yondi. Jurnal **uzun va chalkash** — nima qilasiz?
- Mentor: Push qildingiz — Skaner nuqtasida qizil chiroq yondi. Lenta jurnali ochildi, lekin qatorlar juda ko'p. Yonimizda Copilot bor — u jurnalni tez o'qib, sababni ayta oladi. Bir martani sinab ko'ring.
- Chapda «LENTA JURNALI» + «▶ Jurnalni ochish»: 📦 Yig'ish ✓ · 🔍 Skaner — testlar… · «kutildi: "Ali", keldi: undefined (12-qator)» · 📐 🎁 ✈️ o'tkazib yuborildi → «✓ Jurnal ochildi · Sabab jurnalda bor — lekin uni topish vaqt oladi.»
- O'ngda «Bugun nima qilamiz?»: Butun jurnalni oxirigacha o'zim o'qib, sababni topaman · ✔ Copilot'dan aniq so'rov bilan so'rayman — lekin javobini jurnal bilan tekshiraman · Copilot'ga ishonaman va aytganini tekshirmasdan tuzataman.
- Javob (216): a «Hammasini o'zingiz o'qisangiz — sekin.» · b «Aynan!» · c «Tekshirmasangiz — xato productionga chiqadi.» + «Bugun Copilot'dan aniq so'rashni va javobini tekshirishni o'rganamiz.»
- Tugma «Davom etish».

## 1 · Reja
- Sarlavha: Copilot'ga ishonamizmi — yoki **tekshirib ishonamizmi**?
- Mentor: O'tgan darsda KitobShop'ga lenta uladingiz. Bugun u qizil yonsa nima qilishni o'rganasiz: jurnalni o'qiysiz, **Copilot Chat**'dan aniq so'raysiz va javobini jurnal bilan tekshirasiz. Copilot tez, lekin har doim to'g'ri emas — oxirgi qaror sizda.
- «Avval tayyorlaning · 3 qadam»: 1. «Loyiha kuni — to'liq lentani qurish» darsidagi `ci.yml` KitobShop'da bor: GitHub → Actions yashil. · 2. VS Code'da KitobShop'ni oching: terminalda `npm test` yashil o'tadimi? · 3. Copilot Chat'ni oching (`Ctrl+Alt+I`) va chat ostidagi ro'yxatdan «Agent» rejimini tanlang.
- Chapda «Dars oxirida · KitobShop lentasi yashil» (5 nuqta ✓). O'ngda «Bugungi 2 blok»: 01 Jurnal → so'rov → tekshirish (o'zingiz) · 02 KitobShop qizil testini tuzatish (Copilot Chat).
- Tugma «Boshlaymiz».

## 2 · Amaliyot 1 · Copilot bilan tuzatish (s9, nishonli, F-1015-405)
- Sarlavha: Qizil chiroq. Copilot'dan yordam so'rang — lekin **tekshirishni unutmang**.
- Mentor: Bu safar hammasini o'zingiz bajarasiz: jurnalni o'qing, Copilot'dan so'rang, taklifini jurnal bilan solishtirib tekshiring — **Copilot bu safar adashishi mumkin** — va to'g'ri tuzating.
- Bosqichlar (har biri bitta tugma ochadi): **Jurnal** (boshida blur-qulf, «Jurnalni ochish»): 📦 ✓ · 🔍 testlar… · «kutildi: 15000, keldi: NaN (8-qator)» · «chegirma qiymati string bilan ko'paytirilyapti» · 📐 🎁 ✈️ o'tkazib yuborildi → **So'rov** (o'ngda, jurnal ochilguncha xira): «"Ishlamayapti, nima qildim?"» → «Copilot: "Jurnalni ko'rsating — aniqroq ayting." Foydasiz javob — aniq so'rang.» · «"narx.js 8-qator — kutildi 15000, keldi NaN, sababi nima?"» → **Copilot taklifi**: «Menimcha narx manfiy son bo'lib qolgan — manfiy son tekshiruvini qo'shing.» → «Taklifni jurnal bilan solishtirish» → **Tekshirish** «Jurnalda nima deyilgan edi?»: «Copilot to'g'ri — manfiy son tekshiruvi kerak» (xato: «Jurnalda "manfiy son" haqida gap yo'q — Copilot bu safar noto'g'ri taxmin qildi.») · ✔ «Yo'q, Copilot adashgan — sabab boshqa (string × son)» → «Copilot bu safar adashdi. Haqiqiy sabab — chegirma matn ("10%") ko'rinishida…» → **Tuzatish** «Number(chegirma) bilan tuzatish» → «Tuzatildi. Endi qayta lentaga qo'ying.» → **Push** «Qayta lentaga qo'yish» → «🎉 Yashil! Copilot'ning tezligidan foydalandingiz, lekin QARORNI o'zingiz berdingiz — Copilot adashganini siz tutdingiz.»
- Nishon «Mentor Verified» 🕵️ (Copilot'ning xato taklifini tutdingiz; tuzoqqa tushsa yo'q). Tugma «Bosqichlarni bajaring» → «Davom etish».

## 3 · Amaliyot 2 · Copilot Chat — KitobShop qizil testi (a2, haqiqiy ish, nishonli)
- Sarlavha: KitobShop testini **Copilot bilan** tuzating.
- Mentor: Jurnaldagi qatorlarni promptga qo'yib, Copilot'ga yuboring. Copilot ba'zan testni javobga moslab qo'yadi — test yashil bo'ladi, lekin xato kodda qoladi. Shuning uchun har o'zgarishni «Keep» bosishdan oldin tekshirasiz.
- Chapda Actions maketi «CI failing»: ✓ npm ci · ✗ npm test — FAIL order.spec.ts · orderTotal › 2 kitob narxini hisoblaydi · Expected: 20000 · Received: 10002 · at order.spec.ts:6 · lint o'tkazib yuborildi. Pastda «Copilot · Chat · Agent» — «Promptni yuborish».
- O'ngda «Prompt · Copilot Chat» (Nusxalash): «GitHub Actions'da KitobShop testi yiqildi. Jurnal: FAIL order.spec.ts / ● orderTotal › 2 kitob narxini hisoblaydi / Expected: 20000 / Received: 10002 / at order.spec.ts:6 / Sababini top va tuzat.»
- Oqim: 1-javob «Test 20000 kutyapti, funksiya 10002 qaytaryapti. Testdagi kutilgan qiymatni yangiladim» → «Test yashil bo'ladi — lekin KitobShop endi 2 kitobga 10 002 so'm oladi. Copilot testni javobga moslab qo'ydi, xato order.ts da qoldi. «Undo» bosing.» → «✗ Rad etildi — test o'zgartirilgan edi» → «Aniqlashtiruvchi so'rovni yuborish»: «Testni o'zgartirma — test to'g'ri: 10 000 so'mlik 2 ta kitob = 20 000. Xato order.ts dagi orderTotal funksiyasida. Faqat order.ts ni tuzat.» → «Tushunarli. orderTotal'da qo'shish yozilgan — ko'paytirish kerak» → «Bu safar taklif to'g'ri: test o'zgarmadi, order.ts tuzatildi, 10000 × 2 = 20000. «Keep» bosing.» → «Lenta yashil. Copilot tez topdi, lekin noto'g'ri o'zgarishni siz to'xtatdingiz.»
- «Keep» dan oldin tekshiring (3 katak): O'zgarish `order.ts` da — `order.spec.ts` ga tegilmagan · Javob jurnaldagi Expected va Received farqini tushuntiradi · Terminalda `npm test` yashil — shundan keyin `git push`.
- «Qadamlar · 5»: 1. Mashq uchun KitobShop'dagi `order.ts` da `price * quantity` ni `price + quantity` qiling va `git push`. · 2. GitHub → Actions → qizil «npm test» → jurnaldan FAIL, Expected, Received va qator raqamini toping. · 3. Copilot Chat, «Agent» rejimi: promptni qo'ying, jurnal qatorlarini o'zingiznikiga almashtiring. · 4. Javobni tekshiruv ro'yxati bilan solishtiring. Copilot testni o'zgartirsa — «Undo» va aniqlashtiruvchi so'rov. · 5. «Keep» → terminalda `npm test` yashil → `git push` → Actions yashil.
- «Davom etish»da nishon «Log Reader» 📖.

## 4 · Yakuniy amaliy (s15, ballli, nishonli)
- Sarlavha: Oxirgi qadam: Copilot bilan tuzatish **tartibini** yig'ing.
- Mentor: Bo'laklarni sudrab to'g'ri tartibga joylang. Diqqat: agar Push'ni Tekshirishdan oldin qo'ysangiz — oqibatini ko'rasiz.
- 5 slot (1-qadam … 5-qadam), bo'laklar: Jurnalni o'zingiz o'qiysiz · Copilot'ga aniq so'rov berasiz · Taklifni jurnal bilan tekshirasiz · To'g'ri tuzatasiz · Qayta lentaga qo'yasiz. To'g'ri: Jurnal → So'rov → Tekshirish → Tuzatish → Push.
- Push tekshirishdan oldin: «Tekshirmasdan push qildingiz! Copilot'ning noto'g'ri taklifi to'g'ridan-to'g'ri productionga chiqdi. Tartibni to'g'rilang.» Eslatma: «Copilot har doim tez yordam beradi — lekin tekshirish va yakuniy qaror doim sizniki.»
- Nishon «Final Call» 🎯 (1-urinishda). Tugma «Tartibni yig'ing» → «Davom etish».

## 5 · Podium
- «Kim g'olib?» — N/1; mustaqil rejim izohi.

## 6 · Yakun (F-1015-406)
- Chiplar: «✓ Copilot bilan lentani boshqardingiz» · «N/1 to'g'ri». Sarlavha: Copilot tez, lekin oxirgi qaror va **mas'uliyat sizniki**. Code Strike banneri.
- «Endi siz bilasiz»: Lenta qizil bo'lganda jurnal sababni o'z ichiga oladi · Copilot'ga aniq so'rov — aniq javob beradi · Copilot ba'zan sababni noto'g'ri aytadi — shuning uchun taklifini tekshirasiz · Aniqlashtiruvchi so'rov (follow-up) — birinchi taklif yetarli bo'lmasa · Yakuniy qaror va push tugmasi — doim sizda.
- «Uyga vazifa»: **Sinang** — darsda ulgurmagan bo'lsangiz, KitobShop'da qizil testni Copilot Chat bilan tuzating · **Tekshiring** — taklifni jurnal/xato xabari bilan solishtiring, keyin qabul qiling · **Yozing** — Copilot qaysi holatda adashishi mumkinligini 2-3 misolda o'zingizga eslatma qiling.
- «🎉 Copilot bilan lentani boshqardingiz — tezlik undan, qaror sizdan. Keyingi darsda lentani ishonchli qilasiz.» (406: eski «4c-modulni yakunladingiz» — LMS 6-Modul = 4a+4b+4c, modul oxiri m4c-07.)
- «🏅 Nishonlaringiz» (3) · Arena (12) · «Qaytadan» · «Yakunlash ✓».

## Arena (12 savol, to'g'risi ✔)
1. Lenta jurnalida qizil chiroq yonganda birinchi navbatda nima qilasiz? — ✔ Jurnalni ochib, to'xtagan nuqtani ko'raman
2. Copilot'ga qanday so'rov eng foydali javob beradi? — ✔ Qator, kutilgan va kelgan qiymatni aytish
3. Copilot tuzatish taklif qildi. Bu nima degani? — ✔ Bu tekshirilishi kerak bo'lgan taxmin, xolos
4. Jurnalda "kutildi: Ali, keldi: undefined" degan qator nimani bildiradi? — ✔ Kutilgan va haqiqiy natija mos kelmagani
5. Copilot taklifini tekshirish uchun nimadan foydalanasiz? — ✔ Lenta jurnalidagi haqiqiy dalillardan
6. Copilot sababni noto'g'ri aytishi mumkinmi? — ✔ Ha, shuning uchun taklifni tekshirasiz
7. Aniqlashtiruvchi so'rov (follow-up) qachon kerak bo'ladi? — ✔ Taklif noaniq yoki xato bo'lganda
8. Yakuniy qarorni — tuzatishni qabul qilish yoki qilmaslikni — kim beradi? — ✔ Har doim siz — mas'uliyat sizda qoladi
9. Copilot'ning taklifi jurnaldagi sabab bilan mos kelmasa nima qilish kerak? — ✔ Taklifni rad etib, haqiqiy sababni izlash
10. Jurnal qatorida fayl nomi va qator raqami nega muhim? — ✔ Chunki ular xato qayerdaligini ko'rsatadi
11. Copilot bilan tuzatishning to'g'ri tartibi qaysi? — ✔ Jurnal, so'rov, tekshirish, tuzatish, push
12. Copilot bilan ishlashning asosiy saboqi nima? — ✔ AI tez yordam beradi, qaror sizda qoladi

## Sinov
`node feedback/F-1015-amaliyot/seans-vositalar/sinov/tekshir-m4c05.mjs <OUT>` — 29/29 · `ru-m4c05.mjs` toza · `npm run lint:jsx` toza (18.10 03:xx). `npm run gates` — ❌ 6 (eski bloklar, zaxirada ham 6).
