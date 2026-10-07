# 13-Modul — nima mumkin emas (umumiy qonun fayllaridan, MD yozishdan oldin)

Manbalar: `QOIDALAR.md` (reestr, ID lar) · `konveyer/QURISH_KARTASI.md` · `MATN_ETALONI.md` (lug'at) · `MATN_KORPUS.md` · `PM_Prompt_v8.md` (keys banki) · `PM_DARS_ETALON.md` · `til-lint-rules.json` ·
foydalanuvchining saqlangan qarorlari (`GATE_M_JAVOB.md`) · 12-Modul `00-TAQIQLAR.md` (asos) va 12 ta `NN-FILTR.md`. 07.10.2026 yig'ildi.
Bu ro'yxat — qisqa eslatma; ziddiyat bo'lsa manba fayl to'g'ri. `npm run lint:til` ko'p so'zni o'zi ushlaydi — lekin bu yerdagi ko'p band skriptga ko'rinmaydi.

## 0. Foydalanuvchining qat'iy qonunlari (05.10) — MD da ham
- Har ekranda keyingi bosiladigan joy ko'rinadi; bashorat tanlangach yopilmaydi — ixcham qator bo'lib natijagacha turadi. MD da har harakatli ekranga «Harakat → Vizual o'zgarish», Mentor gapi aynan shu harakatni aytadi.
- Kartochkalar — alohida ekran (podium → kartochkalar → yakun): Mentor yo'q, karta ostida «Kartani bosing — javob ochiladi», tugma «Yakunlash →».
- Brend yoki mahsulot nomi — o'z rangida, tanish maketda (telefon, brauzer, chat), jonli sahnada; matnli karta rad. Logotip chizilmaydi. «Maydon Jamoa» — telefon maketida; Click, Payme, Telegram Premium — o'z rangida, tanish maketda (ilova ekrani, chat), logotipsiz.
- Agent MD matnini o'zboshimcha o'zgartirmaydi — kerak bo'lsa «MD ga taklif» deb yozadi (bu quruvchiga; MD yozuvchi esa har so'zni o'zi aniq yozadi).
- O'ylab topilgan qahramon yo'q — vazifani Mentor beradi; odamlar roli bilan: o'yinchi, tashkilotchi (Mentor misolida «1-tashkilotchi», «2-tashkilotchi» — tartib raqami, ism emas), sinfdosh, sherik, guruh egasi, ota-ona.
- Jonli ekran (10-Modul SABOQ 19–31, 12-Modul SABOQ E 40–55): telefon maketi chapda, ekranda ≤3 blok, bo'sh ustun yo'q, yakuniy holat ixcham, ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta), maketda hech narsa kesilmaydi.

## 1. Pul — bu modulning eng qat'iy chegarasi (Qaror-0 5, 6)
- **Real pul yo'q.** Faqat test rejim — «mashq to'lov». Hech bir ekranda, promptda, maketda, saqlash kalitida «haqiqiy to'lov qabul qiling», «kartangizni ulang», «pulni hisobingizga oling» yo'q.
- **Karta ma'lumoti hech qayerda:** karta raqami, amal qilish muddati, CVV, SMS kod — maketda ham, namuna sifatida ham, test karta raqami sifatida ham yozilmaydi va chizilmaydi. «Mashq to'lov» sahifasi karta so'ramaydi.
- **Maxfiy kalit faqat `.env` da:** `TOLOV_KALITI`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_SIR` va oldingilari (`DATABASE_URL`, `JWT_SECRET`, `SANOQ_KALITI`) — agentga yuborilmaydi, kodga, repo'ga, skrinshotga, postga yozilmaydi; `.env` `git status` da ko'rinmasligi tekshiriladi. Imzo serverda hisoblanadi — kalit brauzerga chiqmaydi.
- **«Mashq to'lov» Payme yoki Click ko'rinishini va nomini taqlid qilmaydi** (nomi — «Mashq to'lov»). Payme va Click — faqat maketda, o'z rangida, «bu xizmat shunday ishlaydi» deb, rasmiy faktdan.
- **Har to'lov ekranida test belgisi:** to'lov taklifi ekranida «Test rejim: pul yechilmaydi», «mashq to'lov» sahifasida «Bu sahifa — mashq. Karta so'ralmaydi, pul yechilmaydi.»
- **Real ishga tushirish — bu kursda emas:** bir gap — «Real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT bilan; bu kursda emas.» (FK 27-modda). O'smirga yuridik maslahat berilmaydi; «qonunga to'liq mos», «yurist tekshirgan» — yo'q.
- **Narx — «Mentorning taxmini»:** 10 000, 15 000, 3 oy, 60 000 — taxmin yorlig'i bilan; o'quvchiga «shuncha qo'ying» deyilmaydi. Komissiya (Click, Payme) — aytilmaydi (rasmiy manba yo'q). Dollar → so'm — sana va kurs bilan (07.10.2026, 11 790,79).
- **Pul suhbati va tasdiq — bosimsiz:** ko'ndirish, «hozir olmasangiz qimmatlashadi», «hamma oldi», «do'stingni taklif qil — sovg'a» yo'q; tasdiq — yozma javob, real pul emas; o'quvchi o'zi yoki sinfdosh-o'yinchi «tasdiq» yozmaydi; soxta tasdiq — Mentor tekshiruvida «tuzatish».
- **Mukofot — pul emas:** taklif uchun Pro'ning bepul haftasi; pul, chegirma, keshbek, sovg'a yo'q.

## 2. Mazmun va halollik
- Bankdan tashqari keys, raqam, sana, manba — **yo'q** (PM-016). Keyslar — tayanch 5-bo'lim, faqat o'sha darsga berilgani (2 — K2, 11 — K17); Mentor gapida bank so'zi aynan; natija va sabab qo'shilmaydi. Raqam yilsiz aytilmaydi. Mashhur kompaniyalar (Dropbox, Uber va b.) bankda yo'q — tilga olinmaydi.
- Mentor raqamlari — faqat tayanch 1.13 dan va «Mentor misolida» deb; statistika yoki tadqiqot deb aytilmaydi (T-043). Kutilgan son yoki taxmin — «Mentorning taxmini» yorlig'i bilan.
- **Da'vo isbot emas:** «to'lov ishlaydi», «tuzatildi», «yetkazadi» — fakt va qayta tekshiruv natijasi bilan («Tuzatish qilindi» — ish fakti; «qayta tekshiruvda takrorlanmadi» — natija). Agentning «bajardim» degani — tekshirilmagan da'vo.
- Kichik son umumiy xulosa qilinmaydi: 3 suhbat, 3 tasdiq, 5 javob, 7 taklif — «kichik son: … haqida dalil, isbot emas». Har xil o'lchovdagi sonlar (qurilma · hisob · tashrif · odam) ayirilmaydi.
- Qat'iy gaplar yo'q: «har doim», «hech qachon», «darhol», «darrov», «albatta», «100%», «bir zumda», «kafolat» (T-020). To'lov haqida ham: «to'lov o'tadi» emas — «o'tishi kerak — tekshiring»; «xabar keladi» emas — «odatda keladi; kelmasa xizmat qayta yuboradi».
- Soddalashtirish yolg'on model yasamaydi (T-045): webhook xabari bir marta kelmasligi mumkin (takror); imzo — xabar xizmatdan kelganini ko'rsatadi, to'lov to'g'riligini emas; test rejim — real to'lovning aynan nusxasi emas («haqiqiy xizmatda sahifa va xabar boshqa kompaniya serverida»);
  Telegram bot odamga birinchi bo'lib yozolmaydi; tasdiq — sotuv emas; Pro avtomatik yangilanmaydi.
- Tashqi xizmat (Click, Payme, Stripe, Render, Netlify, Neon, Expo, EAS, Telegram, Umami, GitHub) imkoniyati, narxi, limiti, tugma va menyu nomlari taxmin qilinmaydi (P-028): tayanch 6 yoki rasmiy hujjat (havola va sana MD «Manbalar»ida); bo'lmasa — umumiy so'z + «Shubhali joylar».
  Har tashqi qadamda xato yo'li bitta gap, ayb da'vosisiz (12-Modul 9.34 e: «xatongiz emas», «sizda emas» yo'q — aniq keyingi qadam).
- Real kompaniya ichki qarorini da'vo qilmaydi (PM-018); keysdagi katta son o'quvchiga me'yor qilib qo'yilmaydi («15 mln», «1 mlrd» — maqsad emas).
- Lending, oferta, to'lov taklifi ekrani va postda faqat hozir ishlaydigan narsa yoziladi; va'da («tez orada», «yaqinda», «keyingi oyda Pro'ga yangi funksiya») — yo'q.

## 3. O'smir xavfsizligi va maxfiylik (real odamlar bilan ishlaydigan darslar: 6, 9, 10; Telegram — 8)
- Suhbat va tasdiq — faqat tanish doira: 11-Modulda intervyu bergan odamlar, sinfdosh, ota-ona, mahalla guruhidagi tanish (guruh egasining ruxsati bilan). Notanishga shaxsiy xabar yozilmaydi; uchrashuv taklifi kelsa — faqat kattalar bilan; ota-ona xabardor.
- Yozuvlarda, kalitlarda, skrinshotda, public repo'da: ism, familiya, maktab raqami, telefon, uy manzili, Telegram nomi va chat raqami — yo'q; odam — roli bilan («tashkilotchi», «sinfdosh»).
- Sinfda kim nechta suhbat qilgani yoki kim to'lashga rozi bo'lgani qo'l ko'tartirib sanalmaydi (12-Modul 9.39 e). Sinf chatiga bir xil 12–15 xabar yuborilmaydi.
- Telegram bot: faqat o'zi «Start» ni bosgan odamga yozadi; «o'chirish» bir bosishda; haftasiga ko'pi bilan ikkita xabar; Telegram chat raqami maxfiylik siyosatida aytiladi va o'chirilganda o'chadi; Telegram yosh chegarasi aytilmaydi.
- Taklif havolasi — tanish doiraga; spam, bir xabarni ko'p guruhga tashlash, notanishlarga yuborish — yo'q (12-Modul xavfsizlik ro'yxati, olti band).
- Agentga xato yuborilganda `.env` qiymatlari, token va kalitlar yuborilmaydi. «Buzish» (5, 12-darslar) — faqat **o'z mahsulotida**, «mashq to'lov» tugmalari bilan; boshqa odamning sayti yoki xizmati tekshirilmaydi; hujum usuli o'rgatilmaydi.

## 4. Misol-ip va odamlar
- Bir dars — bitta misol-ip «Maydon Jamoa» (P-001); ikkinchi misol faqat qisqa mashq yoki testda (P-002), u ham o'smir tanigan olamdan (uy vazifalari ilovasi, kitob almashish, to'garak sayti — 12-Modul testlaridagi kabi).
- O'quvchining o'z mahsuloti — uning ishi; Mentor misoli namuna, umumiy qolip emas: model, narx, Pro, bloklar, xabar turlari — «Mentor misolida». O'quvchi mahsulotida mos qism bo'lmasa nima qilishi «Ochish» qadamida yoziladi.
- Metafora — ko'pi bilan bitta, bir marta, «…ga o'xshatish mumkin» shaklida (T-016), o'smir har kuni ko'radigan narsadan, mexanikasi haqiqatga mos (T-017). Tayanchda metafora yo'q — MD qo'shmoqchi bo'lsa «TAYANCHGA SAVOL» ga yozadi.
  Taqiq obrazlar: «voronka», «quvur», «tomir», «miya», «yurak», «sehr», «oltin tuxum», «pul daraxti».
- Misol o'smir oxirgi haftada ko'rgan yuzadan (T-046): Telegram, sinf chati, mahalla, futbol, telefon hisobini to'ldirish (Payme — 9-Modulda ko'rgan); gazeta, ofis, bank krediti, rus realiyasi yo'q.

## 5. So'z va ohang
- Siz-forma hamma joyda (tugma, yorliq, zanjir ham — T-071/073). Istisno: agentga beriladigan prompt matni (T-002) va olam ichidagi matn — chat xabari, Telegram xabari, tasdiq gapi, suhbatdagi odam gapi (T-008).
- **Taqiq so'zlar** (T-021, T-022, lint): «sir», «sehr», «mo'jiza», «professional», «mohiyat», «loyqa», «pardoz»; sifatlar «buzuq», «buzilgan», «g'alati», «chalkash», «chala», «shunchaki», «foydasiz», «mezon»; kitobiy «chora», «nolish».
  5, 12-darslarda «buzamiz», «buzildi / buzilmadi», «buzish yozuvi» — dars atamasi (ruxsat); «buzuq to'lov», «buzilgan Backend» — yo'q.
- Kantselyarit, sheva, registr — 12-Modul TAQIQLAR 4 dagidek («ushbu», «hisoblanadi» bog'lama, «amalga oshiriladi» · «-votti» · «zo'r», «qoyil»). Maqtov: «Yaxshi!», «To'g'ri!», «Ajoyib!».
- Belgi-formula (≠, =, →, +, ×, ÷) o'quvchi izohida va test variantida yo'q — to'liq gap (T-035). Hisob kod oynasida va maketda ko'rinadi; matnda — so'z bilan («60 000 ni 12 ga bo'lsak»).
- «Daftaringiz» yo'q · «o'z so'zingiz bilan» → «ekranga qaramasdan, yoddan» · «taxmin qiling» → «Avval o'zingiz belgilab ko'ring» · «Xato — 0 ball» → «Adashdingiz — 0 ball» · «Kodda xato» → «Kod ishlamadi» · «kompilyator» → «kod oynasi».
- «Keyingi darsda …» va'dasi ekranda yo'q — kelajak faqat uyga vazifa muddatida va yakundagi «Keyingi dars — «…»» qatorida (T-038). 14-Modul, bitiruv himoyasi, Demo Day, investorlar — o'quvchi matnida va'da qilinmaydi (faqat O'qituvchi eslatmasida).
- Ichki kodlar o'quvchi matnida yo'q: A1/A2/A3, `m11-04`, «Modul 13», K2, K17, «keys» (ekran yorlig'ida — «Biznes olamidan»), «pilot», «CAC», «LTV», «paywall», «sandbox», «freemium», «referal», «idempotentlik» (inglizchasi — faqat kartochkada bir marta).
- Modul raqami o'quvchi matnida — LMS raqami («12-Modulda», «7-Modulda»); moslik jadvali tayanch boshida. Shubha bo'lsa — raqamsiz («oldingi modulda»).
- Dasturda inglizcha turgan nom tarjima qilinmaydi (T-033): webhook, Click, Payme, Telegram, Render, Netlify, Neon, Expo, BotFather, Umami. Qisqartma birinchi ko'rinishda ochiladi (T-036): B2B, YaTT, APK.
- **Lug'at — shu modul juftliklari** (to'lig'i tayanch 2-bo'lim «Ishlatilmaydi» ustunida): CAC → **jalb qilish narxi** · LTV → **foydalanuvchi keltiradigan pul** · freemium → **bepul asos va pullik qo'shimcha** · subscription → **pullik obuna** · paywall → **to'lov taklifi ekrani** ·
  checkout → **to'lov sahifasi** · callback, notifikatsiya → **to'lov xabari** (texnik nomi webhook) · signature → **imzo** · idempotency, dublikat → **takror xabar** · failed payment → **rad etilgan to'lov** · sandbox → **test rejim** · referral, invite → **taklif havolasi** · bonus, sovg'a → **mukofot** ·
  push, rassilka → **Telegram xabari** · predzakaz → **yozma tasdiq** · stabilizatsiya → **barqarorlik tekshiruvi** · bug-list → **XATOLAR.md** · user → **foydalanuvchi**.
- **Bitta darsda bitta ma'no (T-015):** «obuna» — doim «pullik obuna» (kanal obunasi bilan aralashmasin) · «tasdiq» — 9-darsda «yozma tasdiq»; «kelishini tasdiqladi» — qadam nomi · «tranzaksiya» — 2-darsda model nomi; Database tranzaksiyasi o'quvchi matnida yo'q ·
  «test» — ballik savol yoki «test rejim»; «sinov» — faqat real odam · «xabar» — har darsda birinchi uchrashganda to'liq nomi bilan (to'lov xabari · Telegram xabari · jonli xabar) · «qiymat» — faqat 4-dars usuli · «hodisa» — analitika ma'nosida, kam.
- **Lint soxta signali:** qonun nomi to'liq yozilsa «fuqaro» qoidasi error beradi — MD da «FK 369-modda» va manba havolasi (`lex.uz/docs/-111189`); o'quvchi matnida — «qonunda …» yoki «O'zbekiston qonunchiligida …» + havola «Manbalar»da (MEXANIZM-TAKLIF).

## 6. Ekran tuzilishi
- Sarlavha ≤55 belgi, bitta qator; savol yoki harakat; sahna sharti Mentor'ga (P-010); yangi atama PM darsi sarlavhasida yo'q (T-011) — «oferta», «jalb qilish narxi», «to'lov xabari», «taklif havolasi» sarlavhaga o'tilgandan keyin chiqadi.
- Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi (T-072), «Bu…», «Hammasini…» bilan boshlanmaydi, ekranda ko'rinib turganini ta'riflamaydi (T-029, T-047).
- Hook javobi ≤120 belgi, «Aynan!» / «Qiziq fikr!» bilan (kurs qonuni T-028, T-067 — tashqi auditda olib tashlash taklifi rad etiladi); hook javobi Mentor gapida oldindan aytilmaydi (P-016). Sof so'rovnoma hookda — `correct: false` hammaga (J-026).
- Reja ekrani — natija va'dasi, savol emas; App.jsx `sub` bilan mos (P-014, P-015).
- Bir ekran — bir ish (P-008); tushuncha-ekranda bitta harakat → vizual o'zgaradi; «bos → matn-karta» taqiq (P-067); bitta kerakli vizual (P-052). Pul darslarida vizual — telefon (to'lov taklifi ekrani) ↔ brauzer (to'lov sahifasi) ↔ Backend; xabar konvert bo'lib uchadi.
- Matn mexanika xulosasini oldindan aytmaydi (P-036); xulosa ≤110; xato izohi ≤60; yakun fe'li ko'nikmani nomlaydi (T-049). Miqdor ekranda bir marta (P-062).
- Ballik testlar ketma-ket turmaydi (P-012). O'quvchi ko'radigan matnda emoji yo'q (arena, nishon medali, podium — mustasno). Ovoz (audio) matni yozilmaydi.
- Ekran soni: PM (keys bilan) ≈15–16 · keyssiz PM 12 (1-dars kod oynasi bilan 13–14) · TEX 18–20 · PM+PRAKT 12 · loyiha kuni 12; `.homework.jsx` yo'q.
- **Kod:** NestJS kodi darsda — o'qiladigan qisqa bo'lak + chizilgan maket; kod oynasida faqat brauzerda ishlaydigan JS (namuna obyekt — «haqiqiy Backend emas» izohi bilan). Kod oynasi sarlavhasi — «…digan kod yozamiz» oilasi (PM-015).

## 7. Testlar, kartochkalar, nishonlar
- Savol ≤12 so'z, o'quvchiga qaratilgan (S-001); bitta himoyalanadigan to'g'ri javob (S-002). Variantlar uzunligi teng (±15%); to'g'ri javob yolg'iz eng uzun emas; kalit so'z, tire, strelka, qavs faqat to'g'rida emas. Inkor-savol yo'q.
- Distraktor ishonarli va darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas (S-004). **Haqiqiy hayotda rost bo'lib qolishi mumkin bo'lgan distraktor yo'q** — ayniqsa Click, Payme, Stripe, Telegram va keys haqida. Uchala noto'g'ri variant bitta turkumdan bo'lmaydi.
- To'g'ri izoh — bitta qisqa gap, «To'g'ri!» so'zisiz; xato izohi javobni aytmaydi (S-010). Ball beriladigan matnda atama izohsiz qolmaydi (S-020). Savoldagi son kalitda takrorlanmaydi (S-019).
- Kartochka `front` — to'liq savol, «?» bilan; 10–12 ta. Takrorlash oynasi — 3 karta, PM darsida raqam (S-026). Arena 12 savol, to'g'ri javob o'rni A/B/C/D har biri 3 marta; arena savoli ekran testining nusxasi emas.
- Nishonlar 4 ta, nomi qisqa inglizcha, tavsifi o'zbekcha siz-formada, qilingan ishni aytadi va da'vo qilmaydi («Pul topdingiz» emas); tekin bonus ko'pi bilan bitta. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q.

## 8. Ma'lum ziddiyatlar va ochiq joylar (foydalanuvchiga ko'rsatiladi, agent o'zi hal qilmaydi)
- **Dastur so'zi «Click / Payme / Stripe test mode to'liq» (5-dars)** — Qaror-0 5 bilan «mashq to'lov»ga almashgan: Stripe O'zbekistonda yo'q, Payme/Click test kaliti yuridik shaxsda. Darsda halol aytiladi; real xizmat — maket va rasmiy fakt.
- **«test rejim» (13-Modul) va «test holati» (12-Modul 4-darsi)** — o'zbekchada ikki so'z, ruschada 12-Modulda ikkalasi «тестовый режим». 13-Modulda «test holati» ishlatilmaydi.
- **«tranzaksiya»** — 2-darsda model nomi; 11-Modul 14-darsida Database tranzaksiyasi. 5-darsdagi «bitta tranzaksiyada» — faqat Mentor Yordami va REPO da.
- **Telegram yosh chegarasi** — rasmiy matnda hududimiz uchun topilmagan; darsda aytilmaydi. 8-darsda bot — 7-Modulda o'quvchi qurgan bot bo'lishi mumkin.
- **K2 Telegram Premium** — Telegram ham 8-darsda asbob (bot). 2-darsdan keyin keys tilga olinmaydi; 8-darsda Telegram — asbob sifatida (PM-016: kundalik ilova boshqa PM darsida bosh-misol emas).
