# 14-Modul (LMS) «Bitiruvchi va mahsulot tezligi» — modul tayanchi (08.10.2026, F-1008-554)

> MD agentlari faqat shu fayl, `00-TAQIQLAR.md`, `00-NOMLAR.md`, `MD_AGENT_TOPSHIRIQ.md` va o'z darsi qatori bo'yicha yozadi. Bu yerda yo'q narsa to'qilmaydi — «TAYANCHGA SAVOL» bo'limiga yoziladi.
> ⚠️ **TAXMIN:** Qaror-0 (`qaror-0.json`, sahifa https://claude.ai/artifact/MxCJubQJFcREWw42QYvH5x) — kechasi hamma savolga tavsiya (A) olingan; foydalanuvchi ertalab tasdiqlaydi. Tayanchda TAXMIN ga tayangan joy `(Tn)` bilan, MD da `<!-- TAXMIN Tn -->` bilan belgilanadi.
> Manba: `00-MANBA.md` (dastur, 13-Moduldan holat, faktlar). Poydevor: 13-Modul tayanchi (`feedback/F-1007-13modul/00-MODUL-TAYANCH.md`) — atamalar, sinflar, kelishuvlar shu yerdan davom etadi.

## 1. Misol-ip — «Maydon Jamoa» hakamlar oldida

### 1.0 Boshlanish nuqtasi (13-Moduldan, teg `m13-dars-12-done`) va 14-Modulda nima o'zgaradi
- **Mahsulot** (o'zgarmaydi): «Maydon Jamoa» — mahalladagi mini-futbol uchun jamoa yig'adigan mobil ilova; tashkilotchi o'yin e'lon qiladi, o'yinchilar «Qo'shilaman» ni bosadi; e'londa «8 / 10». Rollar ismsiz: **tashkilotchi** · **o'yinchi**.
  Muammo gapi (so'zma-so'z, 11-Modul): «O'yinchilar o'yindan oldin jamoaga yetarli odam yig'ishda va kim aniq kelishini bilishda qiynaladi.» Namuna o'yin — **Shanba, 18:00 · Mahalla maydoni · 8 / 10**.
- **13-Modul oxirida bor:** lending · real vaqt · «Hozir ko'ryapti» · eslatmalar · login · tashkilotchi uchun **Pro** (30 kunlik pullik obuna, «Doimiy o'yin») — test rejimda, real pul yo'q · `lending/oferta.html` · Telegram xabari · taklif havolasi va mukofot · `XATOLAR.md` · Android APK + iPhone brauzer ko'rinishi.
- **14-Modulda kod o'zgarishi faqat 3, 4, 6, 7-darslarda** (tezlik, sayqal, demo tayyorgarligi, demo tekshiruvi tuzatishlari). **Yangi funksiya qo'shilmaydi** — modul mahsulotni himoyaga tayyorlaydi.
- **Mentor misoli ham, o'quvchi ham** — o'z final mahsuloti bilan (11–13-Modul), o'z trekida (`pm-m9d8-platforma`: web yoki mobil). Mentor misoli — namuna, majburiy shakl emas.

### 1.1 Investorga pitch tuzilmasi (1-dars, PM, K12) — T1, T2, T3, T18
- **Final pitch — olti bo'lak** (bo'lak nomlari — atoqli, o'zgarmaydi): **Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam**. «Yechim» ichida jonli demo; «Raqamlar» — dasturdagi «Metrikalar» (12-Modul pitchidagi bo'lak nomi saqlanadi).
  12-Modul besh bo'lagidan farqi: **Bozor** va **Jamoa** qo'shiladi; «Jonli demo» «Yechim» ichiga kiradi; pitchdan keyin — **savol-javob**. Vaqt — 5 daqiqa (Demo Day 8: «5 daqiqa pitch + Q&A», dastur).
- **K12 Airbnb pitch deck** (bank so'zi aynan, raqamsiz): «Investorlar uchun birinchi taqdimot — o'nga yaqin oddiy slayd: muammo → yechim → bozor → mahsulot → jamoa. Eng ko'p tahlil qilinadigan pitchlardan biri, ochiq turadi.» (T18; dasturdagi «YC Demo Day tahlili» o'rniga).
- **Mentor pitchining qoralamasi (1-darsda yoziladi; keyin 5, 8, 13-darslarda tuzatiladi):**
  · Muammo: «O'yinchilar jamoaga odam yig'ishda qiynaladi.» + dalil «Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.» (12-Modul pitchi aynan — kalit ≤160; 9.2) ·
  · Bozor (T2): «Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.» — **yangi son yo'q** ·
  · Yechim: «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.» + jonli demo (1 daqiqa) ·
  · Raqamlar: «51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi. 3 tashkilotchi Pro'ga yozma tasdiq berdi — bu hali to'lov emas.» (halol gap — 12-Modul naqshi) ·
  · Jamoa: «Men — g'oya, mahsulot va kod (agent bilan). Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.» — yolg'on rol yo'q ·
  · Keyingi qadam (T3): «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinayman. Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.» — **pul (investitsiya summasi) so'ralmaydi**.
- **O'quvchi:** o'z pitchining olti bo'lagini yozadi — `pm-m10d12-pitch` (12-Modul besh bo'lagi) bor bo'lsa, Muammo, Yechim, Raqamlar, Keyingi qadam oldindan to'ldiriladi; Bozor va Jamoa — yangi. **Bittadan karta** (SABOQ E 53). Saqlanadi `pm-m12d1-pitch`.
- Sonlar faqat o'z mahsulotidan (12-Modul `pm-m10d10-hisobot`, 13-Modul `pm-m11d9-tasdiq`); bozor uchun tashqi son — manbasi va sanasi bilan, yo'q bo'lsa — «hali tekshirilmagan».

### 1.2 Mahsulot hikoyasi (2-dars, PM, K19)
- **Hikoya — bitta odam, bitta lahza, o'zgarish:** «Shanba, 18:00. Maydonda 8 kishi, yana 2 kishi kelmadi — o'yin bo'lmadi.» → ilova → «Endi tashkilotchi juma kuni ko'radi: 9 / 10, bitta joy bo'sh.» Funksiyalar ro'yxati («ilovada 12 ta funksiya bor») — hikoya emas.
- **Hikoya pitchning qayerida:** Muammo bo'lagi lahza bilan boshlanadi; Yechim — o'sha lahza qanday o'zgargani; Raqamlar — shunday lahzalar nechta.
- **K19 Apple iPhone** (bank so'zi, raqamsiz; taqdimot sanasi 9.01.2007): «Jobs iPhone'ni "uch qurilma bittada" deb taqdim etdi» (so'z 11-Modul `PmPrototypePitchLesson` dagidek; K19 o'quvchiga tanish — bugungi burchak: hikoya chizig'i) — xususiyatlar ro'yxati o'rniga bitta hikoya chizig'i (T18).
- **O'zini videoga yozish** (dastur natijasi): o'quvchi telefonida pitchning birinchi daqiqasini (hikoya qismi) yozadi va **o'zi bir marta ko'radi**, uch savol bilan: hikoya lahza bilan boshlandimi · funksiyalar ro'yxati yo'qmi · 1 daqiqaga sig'dimi. Video telefonda qoladi — hech qayerga yuklanmaydi (T12 qoidasi). Saqlanadi `pm-m12d2-hikoya` (matn va tekshiruv javoblari; video fayl emas).

### 1.3 Mahsulot tezligi (3-dars, TEX — modul cho'qqisi) — T5, T6
- **Nima o'lchanadi (T5):** web (lending + sayt yoki iPhone brauzer ko'rinishi) — **Lighthouse**, Performance bahosi, mobil rejim, **oldin/keyin**; mobil trek — **Expo Atlas** bilan yuklanadigan kod hajmi (bundle) oldin/keyin + brauzer ko'rinishiga Lighthouse.
- **Lighthouse** (rasmiy, 6-bo'lim): baho 0–100 (0–49 qizil · 50–89 to'q sariq · 90–100 yashil); bahoga kiradi: LCP (eng katta element ko'rinish vaqti) 25% · TBT (sahifa javob bermagan vaqt) 30% · CLS (sahifa siljishi) 25% · FCP 10% · Speed Index 10%. Darsda uchtasi tushuntiriladi: **LCP · CLS · TBT**; qolganlari — nomi bilan.
- **Ikki tuzatish:** 1) rasmlar — o'lcham (kerakdan katta rasm kichraytiriladi), `width`/`height` (siljish yo'qoladi), **pastdagi** rasmga `loading="lazy"` (birinchi ekrandagi, LCP rasmiga emas — rasmiy ogohlantirish) · 2) keraksiz kutubxona yoki fayl (bundle'dan) — agent ro'yxat ko'rsatadi, o'quvchi tanlaydi.
- **Mentor misolining sonlari — yo'q (T6):** MD da «⛔ pilotda o'lchanadi» belgisi; sahnadagi sonlar — «misol uchun» deb belgilangan **umumiy ko'rinish** emas, `{…}` joy; «qur» da haqiqiy o'lchov yoziladi.
- **Halol:** Lighthouse bahosi har o'lchashda biroz farq qiladi — oldin va keyin bir xil sharoitda (bir sahifa, mobil rejim) o'lchanadi; baho 100 bo'lishi shart emas («extremely challenging» — rasmiy); «tezlashtirildi» faqat oldin/keyin soni bilan aytiladi.
- **Amaliyot (repo bloki, 3 blok):** A1 o'lchash (oldin; `TEZLIK.md` ga yozuv) · A2 ikki tuzatish (agent bilan, talab: qayerda · nima qilsin · nima buzilmasin) · A3 qayta o'lchash (keyin) va yangi versiya. Saqlanadi `pm-m12d3-tezlik`.

### 1.4 Loyiha kuni: demo uchun sayqal (4-dars, AI-PRAKT) — T7
- **Demo yo'lidagi uch joy** (hakam ko'radigan 1–2 daqiqa): 1) **bosish javobi** — «Qo'shilaman» bosilganda tugma darhol holatini o'zgartiradi (kutish belgisi), ikki marta bosilmaydi · 2) **yuklanish holati** — «O'yinlar» yuklanayotganda bo'sh ekran o'rniga kulrang kartalar (joy egallovchi) · 3) **muvaffaqiyat** — qo'shilgach «8 / 10» → «9 / 10» kichik animatsiya.
- 9-Moduldan farqi: u yerda animatsiya qoidalari o'rganilgan; bu yerda — faqat demo yo'li, yangi funksiya yo'q. `prefers-reduced-motion` — animatsiya o'chadi, holat qoladi.
- **Uch blok:** A1 bosish javobi · A2 yuklanish holati · A3 muvaffaqiyat + reduced-motion tekshiruvi + yangi versiya. Har blok: talab → tekshirish (o'quvchi o'zi) → «Bajardim». Repo `m14-dars-04-done`. Kalit yo'q (repo natijasi).

### 1.5 Pitch mashqi 1 — guruh fidbeki (5-dars, PM) — T11
- 3–4 kishilik guruh: har kim olti bo'lakli pitchini aytadi (taymer 5:00); tinglovchilar **baholash varag'i** (12-Modul atamasi): har bo'lakka ✓/✗ + izoh + **bitta hakam savoli**.
- Natija — **tuzatishlar ro'yxati, 3 band** (varaqdagi ✗ lardan; «qaysi bo'lak · nima o'zgaradi»). Qattiq, lekin hurmatli fidbek: bo'lak haqida, odam haqida emas.
- **Mentor misoli** (yangi tafsilot, faqat shu yerda): Mentor pitchiga varaq — ✗ ikki joyda: Bozor («60 kishi kim — o'yinchimi, guruhmi?») · Raqamlar («tasdiq — to'lovmi?»); hakam savoli: «Nega maydon egalari bunga pul to'lamaydi?».
- Yakka rejim (guruh bo'lmasa): o'zini yozib, varaqni o'zi to'ldiradi — yakun shuni rost aytadi. Saqlanadi `pm-m12d5-varaq`.

### 1.6 Demoga tayyorgarlik (6-dars, TEX; loyiha kuni shakli — T9) — T8, T10
- **Demo qayerda (T8):** laptopdagi brauzerda (web-trek — sayt; mobil trek — brauzer ko'rinishi) proyektorga; telefon — ikkinchi qurilma (ikkinchi o'yinchi). **B reja** — 60 soniyalik ekran videosi (11-Modulda o'tilgan). Demo oldidan Backend'ni **uyg'otish** — bitta so'rov (Render bepul xizmati 15 daqiqa so'rovsiz uxlaydi, uyg'onishi ≈1 daqiqa — rasmiy).
- **Demo stsenariysi** — 5 qadam, 60–90 soniya (Mentor: kirish → «O'yinlar» → o'yinga qo'shilish → ikkinchi telefonda son o'zgaradi → «Hozir ko'ryapti»).
- **Risklar ro'yxati** — har risk + B yo'l: internet yo'q · Backend uxlagan · login esdan chiqdi · ro'yxat bo'sh (namuna ma'lumot — 12-Modul `namuna`) · ikki marta bosish.
- **«Yangi funksiya to'xtatildi»** (dasturdagi «feature freeze»): teg `m14-demo` — shundan keyin faqat tuzatish; o'quvchi matnida «yangi funksiya to'xtatildi».
- **Uch blok:** A1 stsenariy va risklar · A2 B reja (video, uyg'otish, namuna akkaunt) · A3 teg va bitta to'liq **demo o'tishi** (taymer). Saqlanadi `pm-m12d6-demo`.

### 1.7 Investor ko'zi bilan: demo tekshiruvi (7-dars, PM+PRAKT) — T10
- **Nazariya:** investor demoda nimaga qaraydi — ishlaydimi (jonli), tushunarlimi (bir lahza), buzilsa nima bo'ladi. Demo-risklar ro'yxati (dastur): **tarmoq uzilishi · bo'sh ma'lumot · ikki marta bosish**.
- **A1 — buzish:** o'quvchi uch usulda buzadi, har biri **buzish yozuvi** (12-Modul atamasi: nima qildim · nima kutdim · nima bo'ldi); buzilsa — agent tuzatadi, «Tuzatish qilindi», qayta tekshiruv.
- **A2 — uch demo o'tishi:** demo boshidan oxirigacha 3 marta, xatosiz; bittasida B reja (video) ishga tushiriladi va ochiladi.
- **Mentor misoli natijasi — ⛔ pilotda** («qur» da haqiqiy buzish natijasi yoziladi; MD da kutilgan natija «buzilishi mumkin» deb, son va sabab to'qilmaydi). Saqlanadi `pm-m12d7-tekshiruv`.

### 1.8 Final pitch — taymer va savol-javob (8-dars, PM) — T11
- 5-dars tuzatishlari qo'llangan pitch → taymer 5:00 → **savol-javob mashqi**: 3 hakam savoli, har biriga ≤1 daqiqa javob; javob — son yoki fakt bilan, bilmasa «tekshirib aytaman».
- Hakam savollari banki (Mentor misoli): «Bu son qayerdan va nimani sanaydi?» (12-Modul zal savoli) · «Odamlar hozir bu ishni nima bilan qiladi?» · «Keyingi olti oyda nima qilasiz?».
- Saqlanadi `pm-m12d8-final` (vaqt, uch savol va javob qisqasi, tuzatilgan bo'laklar).

### 1.9 Video-portfolio (9-dars, TEX; loyiha kuni shakli — T9) — T12
- **3 daqiqa, uch bo'lak:** kimman (bir gap; ism ixtiyoriy) · nima qurdim (ekran yozuvi: jonli demo) · qanday ishlayman (bitta qaror va uning sababi).
- **Qoida (T12):** yuz va ism — ixtiyoriy; ommaviy joylanmaydi — fayl yoki «faqat havola bilan» ko'rinadigan joy; ota-ona roziligi; ekranda maxfiy kalit, `.env`, login, boshqa odamlarning ma'lumoti ko'rinmaydi.
- Ekran yozish vositasi — umumiy so'z («kompyuteringizdagi ekran yozish vositasi»); aniq dastur va menyu nomi — ⛔ pilotda tekshiriladi.
- **Uch blok:** A1 ssenariy (uch bo'lak) · A2 yozish · A3 tekshirish (maxfiy narsa ko'rinmaydi, 3 daqiqaga sig'adi) va havola. Saqlanadi `pm-m12d9-video` (havola **saqlanmaydi** — faqat `bor: bool`).

### 1.10 Birinchi buyurtma va stajirovka (10-dars, PM) — T13
- **Xalqaro saytlar** (Upwork kabi): «odatda 18 yoshdan; shartini ota-ona bilan saytning o'zidan o'qing» — rasmiy matn bu tunda tekshirilmadi (MANBA 5), aniq yosh da'vo qilinmaydi.
- **Bugun — lokal birinchi buyurtma rejasi:** kim (tanish do'kon, maktab, to'garak) · nima (lending yoki bot — kursda qurilgan narsa) · qachon gaplashaman; pul va kelishuv — ota-ona orqali.
- **Ikki kompaniyaga stajirovka xati** (shablon): kimman · nima qurdim (video-portfolio — havola bo'lsa) · nima so'rayman (stajirovka yoki maslahat); yuborish — uyda, ixtiyoriy. Spam yo'q (bitta kompaniyaga bitta xat).
- Saqlanadi `pm-m12d10-ish`.

### 1.11 Xalqaro dasturlar (11-dars, PM) — T14
- **Diamond Challenge** (rasmiy, 08.10): 14–18 yoshli 2–4 o'quvchidan iborat jamoa · 21 yoshdan katta maslahatchi · butun dunyo · ikki yo'nalish (Business Innovation, Social Innovation) · topshirish muddati **14.01.2027** · finalistlar 09.03.2027 · Summit 29–30.04.2027.
  «Boshlangan ariza» = konsept qoralamasi (pitchdan: muammo · kim uchun · yechim) + jamoa va maslahatchi kim bo'lishi; ro'yxatdan o'tish — uyda, maslahatchi bilan.
- **YC — halol:** rasmiy FAQ da yosh yozilmagan; asoschilar batch davomida va keyin to'liq vaqt ishlashi kutiladi; Early Decision — o'qishni tugatmoqchi talabalar uchun → «maktab o'quvchisi uchun bugungi yo'l emas; universitet yillarida».
- **Lokal grantlar** — nom aytilmaydi (tekshirilmadi); «tashkilotchi bilan aniqlanadi».
- Kafolat yo'q («qabul qilinasiz» deyilmaydi). Saqlanadi `pm-m12d11-dastur`.

### 1.12 Keyingi olti oy — Mentor bilan yakkama-yakka (12-dars, PM) — T15
- **Uch yo'nalish:** mahsulot (davom ettiraman / to'xtataman + sabab) · ko'nikma (nima o'rganaman) · ish (buyurtma, stajirovka yoki dastur — 10, 11-darsdan). Har yo'nalishga oylik bitta maqsad (o'quvchi matnida «oylik maqsad» — «nishon» o'yin nishoni bilan to'qnashadi; 12-dars TS3, 08.10) va **birinchi qadam sanasi**.
- 13-Modul refleksiyasi (`pm-m11d11-refleksiya`) o'qiladi — «Keyingi 4 haftada nima qilaman?» javobi shu yerga ko'chadi.
- Farqi: 11-Modul 15-dars — Demo Day oldidan reja va risklar · 12-Modul 11-dars — pitch da'volari · 13-Modul 11-dars — ortga qarash · **bu dars — oldinga qarash**. Mentor bilan 10 daqiqa. Saqlanadi `pm-m12d12-reja`.
- Mentor misoli: «Mahsulot — davom ettiraman: uch tashkilotchi bilan "Doimiy o'yin"ni sinayman. Ko'nikma — Backend testlari. Ish — Diamond Challenge'ga jamoa bilan konsept.» (yangi tafsilot — faqat shu dars).

### 1.13 Demo Day'ga tayyormisiz? — general repetitsiya (13-dars, PM) — T11, T17
- **Demo Day 8 formatida to'liq o'tish:** pitch 5:00 (jonli demo ichida) + savol-javob (3 savol) → **hakam varag'i** (Mentor va mehmon; 5-darsdagi baholash varag'idan farqi — butun chiqish: vaqt, demo ishladi/B reja, savollarga javob).
- Demo oldidan: Backend uyg'otildi · B reja video ochiladi · namuna akkaunt · telefon zaryadi.
- Keyingi qator — «Zaxira dars: zalni tayyorlash» (`comp` siz); Demo Day 8 — 16-qator. Saqlanadi `pm-m12d13-repetitsiya`.

### 1.14 Mentor misolining sonlari — bitta jadval (14-Modul; boshqa son yo'q)
| Dars | Son | Manba |
|---|---|---|
| 1, 5, 8, 13 (pitch) | 51 foydalanuvchi (11 sinfdosh, 7 taklif havolasidan) · 6 tashkilotchi · 3 yozma tasdiq (15 000 — 2, 10 000 — 1) · mahalla futbol guruhi — 60 kishi · qaytganlar 61 dan 26 (43%) · narx 15 000 so'm / 30 kun | 13-Modul 1.13, 12-Modul 1.13 |
| 1 (Muammo) | 5 o'yinchidan 4 tasi | 12-Modul pitchi |
| 3 | Lighthouse va bundle — **⛔ pilotda o'lchanadi** | — |
| 6 | demo 5 qadam, 60–90 soniya · B reja video 60 soniya | Mentor rejasi |
| 7 | buzish natijalari — **⛔ pilotda** | — |
Har xil o'lchovdagi sonlar (qurilma · hisob · odam) bir-biridan ayirilmaydi va qo'shilmaydi. Pro'ni yoqqanlar, Telegram'ni ulaganlar soni **yo'q** — to'qilmaydi.

## 2. Atamalar (bir ma'no — bir so'z; T19)
Oldingi modullardan o'zgarmaydi: pitch · zal · zal savoli · baholash varag'i · repetitsiya · taymer · fidbek · bosh raqam · metrika · muammo gapi · da'vo · dalil · halol gap · jonli demo · B reja · buzish yozuvi · «Tuzatish qilindi» · tekshirish (o'z ishi) · sinov (faqat real odam bilan) · talab · agent · prompt · trek · deploy · APK · brauzer ko'rinishi · Pro · test rejim · tasdiq (yozma) · taklif havolasi · yakkama-yakka · roadmap · maxfiy kalit · shaxsiy ma'lumot.
| So'z | Ma'nosi | Ishlatilmaydi |
|---|---|---|
| pitch bo'laklari | **Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam** — atoqli nomlar (1-dars) | Metrikalar (bo'lak nomi sifatida), «Keyin», «Jonli demo» (alohida bo'lak) |
| bozor | mahsulotga muhtoj odamlar va biz bilgan ularning soni (1-dars) | TAM/SAM/SOM, «bozor hajmi» (manbasiz) |
| Jamoa (bo'lak) | mahsulotni kim qilayotgani (1-dars, 9.4) — bo'lak nomi doim bosh harf bilan yoki «Jamoa bo'lagi»; «jamoa» prozada futbol ma'nosida ishlatilmaydi («Maydon Jamoa» — nom) | team (prozada), «komanda» |
| so'rov (aniq so'rov) | Keyingi qadam bo'lagidagi bitta aniq iltimos: tanishtirish · maslahat · sinash joyi (1-dars); Mentor gapi «Sizdan bitta so'rov: …» — «Yordam» (tugma) bilan aralashmaydi | «yordam» (bu ma'noda), investitsiya so'rovi |
| savol-javob | pitchdan keyin hakamlarning savollari va javoblar; kartochkada bir marta «inglizchasi: Q&A» | Q&A (prozada), «intervyu» |
| hakam · hakam varag'i | 1-darsda: «Pitchni baholaydigan odam — investor yoki tadbirkor — hakam deyiladi.» (9.12; «Demo Day» so'zisiz — 9.13) · uning varag'i (13-dars) | jyuri, komissiya |
| hikoya | **9-Modulda o'tilgan** («bitta real odam bilan bo'lib o'tgan ish», `PmUserStoryPitchLesson`); 2-darsda kengayadi: «Mahsulot hikoyasi — bitta odam, bitta lahza va mahsulot bilan kelgan o'zgarish»; kartochkada bir marta «inglizchasi: storytelling» (08.10 03:58, 2-dars TS1) | storytelling (prozada), «sarguzasht» |
| tezlik · Lighthouse bahosi | mahsulot qanchalik tez ochilishi va javob berishi · Lighthouse'ning 0–100 bahosi (Performance) | performance (prozada), «optimizatsiya» (yolg'iz) |
| yuklanadigan kod hajmi | ilova ochilganda yuklanadigan kod hajmi; kartochkada «inglizchasi: bundle» | bundle (prozada), «paket» |
| keyin yuklash | ekrandan tashqaridagi rasm faqat kerak bo'lganda yuklanadi (`loading="lazy"`); kartochkada «inglizchasi: lazy load» | lazy load (prozada), «dangasa yuklash» |
| sayqal | demo yo'lidagi kichik o'zgarishlar: bosish javobi, yuklanish holati, muvaffaqiyat (4-dars) | polish (prozada), «bezak» |
| joy egallovchi | yuklanayotganda ma'lumot o'rnida turadigan kulrang shakl (4-dars) | skeleton (prozada) |
| demo stsenariysi · demo o'tishi | demoda bosiladigan qadamlar ro'yxati · demoni boshidan oxirigacha bir marta ko'rsatish (6, 7, 13) — T10 | progon, «sinov progoni», «demo-test» (prozada) |
| yangi funksiya to'xtatildi | demodan oldin faqat tuzatish qilinadigan holat; teg `m14-demo`; kartochkada «inglizchasi: feature freeze» | feature freeze (prozada), «muzlatish» |
| demo tekshiruvi | o'quvchi demoni ataylab buzib tekshiradi (7-dars) — «tekshirish» (o'z ishi), «sinov» emas | demo-test (prozada), «stress-test» |
| video-portfolio | o'zi va mahsuloti haqida 3 daqiqalik video (9-dars) | rezyume-video, «reels» |
| frilans · buyurtma · buyurtmachi | buyurtma bilan ishlash · bajariladigan ish · ish beradigan odam yoki kompaniya (10-dars) | zakaz, klient (bu ma'noda) |
| stajirovka | kompaniyada o'qib ishlash davri (10-dars); «amaliyot» — dars ichidagi amaliyot bloki, ishlatilmaydi | amaliyot (bu ma'noda), intern |
| xalqaro dastur · ariza · maslahatchi | startap tanlovi yoki akseleratori · topshiriladigan anketa · jamoaga yordam beradigan katta yoshli odam (11-dars) | akselerator (prozada, birinchi uchrashuvdan keyin), mentor (maslahatchi ma'nosida) |
| olti oylik reja | uch yo'nalish, oylik maqsad va birinchi qadam sanasi (12-dars) | «hayot rejasi», «karyera rejasi», «oylik nishon» (o'yin nishoni bilan to'qnashadi) |
**Bir darsda bir ma'no (T-015):** «demo» — jonli demo (pitch ichida) yoki demo stsenariysi; «tekshiruv» — o'quvchining o'z tekshiruvi; «sinov» — faqat real odam bilan (5, 8, 13-darsdagi guruh va mehmon — «tinglovchi», «hakam», sinov emas).

## 3. Repo — Mentor misoli `maydon-jamoa` (davomi) va o'quvchining o'z repo'si (T4)
- **Mentor repo'si:** `github.com/Azizbekcrypto/maydon-jamoa` (faqat «qur» da, buyruq bilan). Teglar `m14-dars-NN-start` / `-done` (`yechim` tarmog'ida); **`m14-dars-01-start` = `m13-dars-12-done`**.
- **O'quvchi:** o'z final repo'sida, o'z trekida. «Ortda qoldingizmi» — darsda bir marta, birinchi blokda: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `git checkout -f m14-dars-NN-done` — o'z repo'sidan tashqarida, yangi papkada.
- **Push odati** (13-Modul): `git status` — o'zgargan fayllar agent ro'yxati bilan bir xil, `.env` yo'q; `git add <fayl>`.
| Teg | Dars | Repo holati |
|---|---|---|
| `m14-dars-01…02-done` | 1, 2 · PM | = `-start` |
| `m14-dars-03-done` | 3 · tezlik | rasmlar (o'lcham, `width`/`height`, pastdagilarga `loading="lazy"`) · keraksiz kutubxona olib tashlangan · `TEZLIK.md` (oldin/keyin) |
| `m14-dars-04-done` | 4 · sayqal | bosish javobi · joy egallovchi kartalar · qo'shilish animatsiyasi + reduced-motion |
| `m14-dars-05-done` | 5 · PM | = `04-done` |
| `m14-dars-06-done` | 6 · demo | `DEMO.md` (stsenariy, risklar, B reja) · teg `m14-demo` · demo videosi repo'da emas |
| `m14-dars-07-done` | 7 · tekshiruv | buzish natijasida tuzatishlar (⛔ pilot) · `XATOLAR.md` ga qator |
| `m14-dars-08…13-done` | PM, video | = `07-done` (video va xatlar repo'ga yozilmaydi) |

## 4. Darslar — qisqa topshiriq (ekranlar soni majburiy; T9)
| № | Kalit · fayl | Tip | Ekran | Keys | Natija (dastur) | Kalit (yozadi) | O'qiydi |
|---|---|---|---|---|---|---|---|
| 1 | m12-01 · `PmInvestorPitch` | PM | 16 | K12 | pitch qoralamasi (olti bo'lak) | `pm-m12d1-pitch` | `pm-m10d12-pitch`, `pm-m10d10-hisobot`, `pm-m11d9-tasdiq` |
| 2 | m12-02 · `PmStoryPitch` | PM | 15 | K19 | hikoya + o'zini videoga yozish | `pm-m12d2-hikoya` | `pm-m12d1-pitch` |
| 3 | m12-03 · `ProductSpeed` | Kod (TEX) | 19 | — | oldin/keyin o'lchov | `pm-m12d3-tezlik` | `pm-m9d8-platforma` |
| 4 | m12-04 · `PolishDay` | Proyekt | 12 | — | demo yo'li sayqallangan | — (repo) | `pm-m9d8-platforma` |
| 5 | m12-05 · `PmPitchTraining` | PM | 12 | — | tuzatishlar ro'yxati (3) | `pm-m12d5-varaq` | `pm-m12d1-pitch`, `pm-m12d2-hikoya` |
| 6 | m12-06 · `DemoPrep` | Kod (TEX, loyiha kuni shakli) | 12 | — | repetitsiya qilingan demo | `pm-m12d6-demo` | `pm-m9d8-platforma` |
| 7 | m12-07 · `PmDemoTest` | PM (PM+PRAKT) | 12 | — | 3 demo o'tishi xatosiz + B reja | `pm-m12d7-tekshiruv` | `pm-m12d6-demo` |
| 8 | m12-08 · `PmFinalPitch` | PM | 12 | — | final pitch | `pm-m12d8-final` | `pm-m12d1-pitch`, `pm-m12d5-varaq` |
| 9 | m12-09 · `VideoPortfolio` | Kod (TEX, loyiha kuni shakli) | 12 | — | video-portfolio | `pm-m12d9-video` | `pm-m12d2-hikoya` |
| 10 | m12-10 · `PmFreelance` | PM | 12 | — | buyurtma rejasi + 2 xat | `pm-m12d10-ish` | `pm-m12d9-video` |
| 11 | m12-11 · `PmPrograms` | PM | 12 | — | 1 dastur + boshlangan ariza | `pm-m12d11-dastur` | `pm-m12d1-pitch` |
| 12 | m12-12 · `PmNextSteps` | PM | 12 | — | olti oylik reja | `pm-m12d12-reja` | `pm-m11d11-refleksiya`, `pm-m12d10-ish`, `pm-m12d11-dastur` |
| 13 | m12-13 · `PmDressRehearsal` | PM | 12 | — | to'liq o'tish + hakam varag'i | `pm-m12d13-repetitsiya` | `pm-m12d8-final`, `pm-m12d6-demo` |
Ekran naqshlari: PM 16/15 — QKirish · QReja · QTushuncha/QVoqea · QTest × 3–4 · QMustaqil · final test · podium · kartochkalar · yakun · PM 12 — 12-Modul 11-dars shakli ·
TEX 19 — texnik dars + repo bloki (13-Modul 3-dars shakli) · loyiha kuni / TEX loyiha kuni shakli 12 — 8 ekran + 3 blok + kartochkalar · PM+PRAKT 12 — nazariya → 2 amaliyot bloki → yakuniy test → podium → kartochkalar → yakun.
«Keyingi dars» zanjiri — `00-NOMLAR.md` dagi nomlar aynan; 13-darsdan keyin — «Zaxira dars: zalni tayyorlash».

## 5. Keyslar — faqat K1–K19 banki (T18)
- 1-dars — **K12 Airbnb pitch deck** (bosh-keys; 10-Modulda ham bosh-keys bo'lgan — boshqa modul, ruxsat) · 2-dars — **K19 Apple iPhone** (taqdimot, 2007). Boshqa darslar keyssiz. Bank so'zi aynan; raqam qo'shilmaydi; YC Demo Day videosi ishlatilmaydi.

## 6. Tekshirilgan faktlar (08.10.2026; iqtiboslar — `00-MANBA.md` 5)
Lighthouse 10 vaznlari va ranglari · Expo Atlas (SDK 51+) buyruqlari · `loading="lazy"` qoidasi va LCP ogohlantirishi · Render bepul xizmati uxlashi (06.10) · Diamond Challenge shartlari va 2027 sanalari · YC FAQ (yosh yo'q, to'liq vaqt) va Early Decision (talabalar).
**Qo'shimcha (08.10 03:59; 11-dars agenti rasmiy sahifani qayta ochgan, iqtiboslar — `11-PmPrograms-v3.md` «Manbalar»):** Diamond Challenge — ariza ingliz tilida («All submissions are to be written in English») · birinchi bosqich — 3–5 betlik yozma g'oya va 60 soniyalik tanishtiruv videosi («The video is strictly limited to 60 seconds» — 04:00 da o'zim qayta tekshirdim) · «Any Idea, Any Team, Any Country», onlayn qatnashish ham bor · YC — «The batch takes place in-person in San Francisco». Sovrin fondi va qatnashish puli o'quvchi matnida aytilmaydi. diamondchallenge.org/faq — 404 (maslahatchi kim bo'lishi — rasmiy matn topilmadi).
**Tekshirilmagan (darsda da'vo qilinmaydi):** Upwork yosh chegarasining rasmiy matni (sahifa 403) · lokal grantlar · ekran yozish vositalarining nomi va menyusi · telefonni proyektorga ulash · Mentor misolining Lighthouse/bundle sonlari va buzish natijalari (⛔ pilot).

## 7. Oldindan tuzatiladigan sinflar (12-Modul 12 + 13-Modul 9 Filtr faylidan; 13-Modul tayanchi 7 — kuchda; MD yozishda BIRINCHI KUNDANOQ)
Har MD oxirida agent shu ro'yxatni band-ma-band belgilaydi (`[x]` + ekran yoki `[—]` + sabab).
1. **90 daqiqa — reja, o'lchov emas** — A-bo'limda vaqt taqsimoti; har blokda «Ulgurmasangiz»; ⛔ «qur» pilotida taymer; «sig'adi» deyilmaydi.
2. **Tekshirilmagan tashqi qadam — «qur» darvozasi** — Lighthouse sonlari, ekran yozish vositasi, proyektor, sayt shartlari — «pilotda sinaladi»; tugma/menyu nomi — 6-bo'limdan yoki umumiy so'z.
3. **Saqlash kaliti — shartnoma** (8-bo'lim): maydon nimani saqlashi, tipi (`bool | null` — uch holat), real/mashq (`tur`), son yolg'iz emas; dars boshqa darsning kalitiga yozmaydi; ism, telefon, havola (video), xat matnidagi kompaniya xodimi ismi yozilmaydi.
4. **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor misolida …», «bu mashqda …»; olti bo'lak, uch yo'nalish — o'quvchi uchun tayanch, majburiy shakl emas.
5. **Kafolat va sabab da'vosi yo'q** — «tezlashdi» faqat oldin/keyin soni bilan; «demo buzilmaydi», «qabul qilinasiz», «investor pul beradi» yo'q; «tuzatildi» → «Tuzatish qilindi» + «qayta tekshiruvda takrorlanmadi».
6. **Yakun, «Bajardim», nishon — faqat rost holatda** — yakun sarlavhasi 3–5 holatli (hech narsa qilinmagan holat ham — SABOQ E 54); guruh bo'lmagan yakka rejim rost aytiladi.
7. **Ta'rif sanaladigan va amaliyotga mos** — Lighthouse metrikasi nimani o'lchashi aniq; «tez» — baho va metrika bilan.
8. **Test: bitta himoyalanadigan javob** — distraktor turkumi bir xil emas; ikkinchi variant ham to'g'ri bo'lib qolmasin.
9. **Real odamlar xavfsizligi** — guruh fidbeki odam haqida emas, bo'lak haqida; hakamlar ismsiz; xat — spam emas; video — ixtiyoriy yuz/ism, ommaviy emas, ota-ona roziligi; buyurtmada pul — ota-ona orqali; o'quvchi Mentor nomidan tasdiqlamaydi.
10. **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — demo tekshiruvida o'quvchi buzadi, agent tuzatadi; tekshiruv akkauntini agent ochadi va `id` bo'yicha o'chiradi.
11. **Web-trek teng yo'l** — har amaliyotda web va mobil yo'l; web usuli to'qilmaydi.
12. **Mentor misoli ichki izchil** — pitch bo'laklari 1, 5, 8, 13-darslarda bir xil (tuzatilgani — tuzatish bilan); keyingi darsning natijasi oldindan ochilmaydi.
13. **O'quvchi talabida Mentorning qarori yo'q** — `{…}` joyida o'quvchi; koddan bilinmaydigan — «[savol]»; qaytarib bo'lmaydigan o'zgarish — agent ro'yxat ko'rsatadi, o'quvchi «Davom et».
14. **Uyga vazifa yengil va aniq** — loyiha kunida «uyda» yo'q; ixtiyoriy narsa majburiydek aytilmaydi.
15. **Ayb da'vosi yo'q** — «bu sizning xatongiz emas» o'rniga aniq keyingi qadam.
16. **Kelajak va'dasi yo'q** — pitch va video «tez orada chiqadi» demaydi; «Keyingi qadam» — reja sifatida, va'da emas.
17. **(14-Modulga xos) Pul va investitsiya:** o'smir investitsiya summasi so'ramaydi (T3); Pro — test rejimda; «tasdiq — to'lov emas» pitchda ham.
18. **(14-Modulga xos) Yosh va rasmiy shartlar:** xalqaro sayt va dastur shartlari — faqat 6-bo'limdagi rasmiy faktlar; tekshirilmagani «shartini saytning o'zidan o'qing» deb.
+ **Tashqi auditda har safar RAD etilganlar** (13-Modul tayanchi 7, qayta ochilmaydi): hookdagi «Aynan!» / «Qiziq fikr!» (T-028, T-067) · yakundagi «Keyingi dars — «…»» qatori (P-023, T-075) · Reja sarlavhasi — natija-gap (P-014) · ekranga qo'shimcha blok (P-008, ≤3 blok) · bank so'zini yumshatish · tasdiqlangan qarorlar.
+ **12-Modul SABOQ E (foydalanuvchi didi, «qur» uchun MD da hisobga olinadi):** har variantning o'z chegarasi · maketda hech narsa kesilmaydi · taxmin qatori yashil xulosa ichida · yorliq input ichida · ko'p maydonli forma — bittadan karta · yakun standart («Bugungi asosiy fikr» yo'q).

## 8. Darslar orasida saqlanadigan natija (kalit `pm-m12dN-<nima>`)
Qoida: dars oldingi dars natijasini o'qiydi; yo'q bo'lsa — o'quvchi o'zi yozadi. Kod oynasi qoralamasi — `pm-m12dN-code`. Shaxsiy ma'lumot (ism, telefon, video havolasi, kompaniya xodimi ismi) hech bir kalitga yozilmaydi. Har yozuvda `savedAt`.
⚠️ 2–13-darslar sxemalari — pilotlardan keyin (9-bo'lim) aniqlashtiriladi; pilot kalitlari (1, 3, 7) — shu holicha majburiy.
| Kalit | Yozadi | O'qiydi | Tarkib |
|---|---|---|---|
| `pm-m12d1-pitch` | 1 | 2, 5, 8, 11, 13 | `{ bolaklar: { muammo, bozor, yechim, raqamlar, jamoa, keyingi } (har biri: gap ≤160 yoki `null` — yozilmagan), manba: '12-modul' \| 'yangi', savedAt }` (`manba: '12-modul'` — oldindan qo'yilgan bo'lsa, o'quvchi o'zgartirgan bo'lsa ham) |
| `pm-m12d2-hikoya` | 2 | 5, 9 | `{ kim, lahza, ozgarish, video: { yozildi: bool \| null, lahzaBilan: bool \| null, royxatYoq: bool \| null, vaqtgaSigdi: bool \| null }, savedAt }` |
| `pm-m12d3-tezlik` | 3 | 6 | `{ trek: 'web' \| 'mobil', oldin: { baho: n \| null, lcp (soniya), cls (birliksiz), tbt (ms), bundleKb (kB): n \| null }, keyin: { … }, tuzatishlar: [string] (≤2, A1 4-qadamda tanlanadi), savedAt }` — `baho`, `lcp`, `cls`, `tbt` — **lending** (ikkala trekda), `bundleKb` — **ilova** (mobil — Expo Atlas, web — `npm run build`) (9.5) |
| `pm-m12d5-varaq` | 5 | 8 | `{ tur: 'guruh' \| 'yakka', varaq: [{ bolak, belgi: '✓' \| '✗' \| null, izoh }], hakamSavoli, tuzatishlar: [{ bolak, nima }] (3), savedAt }` |
| `pm-m12d6-demo` | 6 | 7, 13 | `{ stsenariy: [string] (5), risklar: [{ risk, bYol }], video: bool \| null, uygotish: bool \| null, teg: bool \| null, otishVaqt: n \| null, savedAt }` |
| `pm-m12d7-tekshiruv` | 7 | 13 | `{ urinishlar: [{ usul: 'tarmoq' \| 'bosh' \| 'ikki', qildim, kutdim, boldi, buzildi: bool \| null, tuzatishQilindi: bool, qayta: 'takrorlanmadi' \| 'takrorlandi' \| null }], otishlar: [bool \| null] (3), bReja: bool \| null, savedAt }` (`qayta` — 9.8) |
| `pm-m12d8-final` | 8 | 13 | `{ vaqt: n (soniya), savollar: [{ savol, javob }] (3), tuzatildi: [bolak], savedAt }` |
| `pm-m12d9-video` | 9 | 10 | `{ bolaklar: { kim, nima, qanday }, bor: bool \| null, tekshiruv: { maxfiyYoq: bool \| null, sigdi: bool \| null }, savedAt }` — havola saqlanmaydi |
| `pm-m12d10-ish` | 10 | 12 | `{ buyurtma: { kim (rol), nima, qachon }, xatlar: [{ kompaniyaTuri, soroq }] (2), yuborildi: n \| null, savedAt }` |
| `pm-m12d11-dastur` | 11 | 12 | `{ dastur: 'diamond' \| 'boshqa' \| null, jamoa: n \| null, maslahatchi: bool \| null, qoralama: { muammo, kimUchun, yechim }, royxat: bool \| null, savedAt }` |
| `pm-m12d12-reja` | 12 | — | `{ yonalishlar: [{ tur: 'mahsulot' \| 'konikma' \| 'ish', nishonlar: [string] (≤6), birinchiQadam, sana }], savedAt }` |
| `pm-m12d13-repetitsiya` | 13 | — | `{ vaqt: n, demo: 'ishladi' \| 'b-reja' \| 'ishlamadi' \| null, savollar: n, varaq: [{ band, belgi }], savedAt }` |

## 9. To'lqin kelishuvlari (pilot MD lardan — 2-to'lqin uchun MAJBURIY; 08.10, F-1008-556)
Pilotlar: `01-PmInvestorPitch-v3.md` · `03-ProductSpeed-v3.md` · `07-PmDemoTest-v3.md` (o'z auditi — `NN-OZ-AUDIT.md`). Ziddiyat bo'lsa — shu bo'lim to'g'ri.
1. **Pitch vaqt taqsimoti (5:00, bu mashqda):** Muammo 40 · Bozor 30 · Yechim (jonli demo bilan) 90 · Raqamlar 60 · Jamoa 30 · Keyingi qadam 50 soniya — taymer chizig'i (12-Modul `TaymerChiziq`) 5, 8, 13-darslarda shu bo'laklar bilan.
2. **Mentor pitchining olti gapi** — tayanch 1.1 aynan (Muammo — 12-Modul pitchidagi qisqa gap + dalil). 5, 8, 13-darslarda tuzatilgan bo'lak — tuzatish bilan aytiladi (yangi son yo'q).
3. **Hakam savollari (`HAKAM_SAVOL`, bitta manba; kurs savollari, real hakam gapi emas):** Muammo — «Bu muammo borligini qayerdan bilasiz?» · Bozor — «Bu mahsulot yana qancha odamga kerak?» · Yechim — «Mahsulot nima qiladi?» ·
   Raqamlar — «Bu son qayerdan va nimani sanaydi?» · Jamoa — «Buni kim qilyapti?» · Keyingi qadam — «Endi nima qilasiz?». 8-dars savol-javob mashqi va 13-dars shulardan oladi (+ tayanch 1.8 dagi «Odamlar hozir bu ishni nima bilan qiladi?»).
4. **Jamoa va so'rov atamalari** — 2-bo'lim jadvali (yangi qatorlar). Mentor gapi: «Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.»
5. **3-dars o'lchovi:** Lighthouse — **lending** (ikkala trekda bir xil; rasmlar shu yerda); yuklanadigan kod hajmi — **ilova** (mobil — Expo Atlas, web — `npm run build`, Vite chiqishidagi `.js` fayllar). Ilova sahifasining Lighthouse o'lchovi — uyga vazifa. Lighthouse sozlamasi yozuvi — «Mobile rejimi» (UI so'zi; «mobil trek» bilan aralashmasin).
   6-dars `pm-m12d3-tezlik` ni shu ma'noda o'qiydi (demo stsenariysida «lending tez ochiladi» — o'lchangan bo'lsa).
6. **Demo ikkinchi qurilmasi:** telefon brauzerida (mobil trekda — brauzer ko'rinishi), APK yoki Expo Go emas — tuzatishdan keyin bitta qayta eksport ikkala ekranni yangilaydi (07 TS 4). 6-dars stsenariysi va 13-dars shunga mos.
7. **Demo tekshiruvi usullari (7-dars):** tarmoq uzilishi — **telefonda** (uchish rejimi; laptop internetini uzish dars sahifasini ham uzadi) · bo'sh ma'lumot — tekshiruv akkaunti e'lon qilgan yangi o'yin «Juma, 18:00 · Mahalla maydoni · 0 / 10» (13-Modul tekshiruv o'yini; haqiqiy ro'yxatga tegilmaydi) · ikki marta bosish — «Qo'shilaman».
8. **`pm-m12d7-tekshiruv.urinishlar[].qayta`** — qayta tekshiruv natijasi kalitda (13-dars o'qiydi); 07 MD shunga tuzatildi.
9. **B reja:** ikkinchi demo o'tishida (oxirgi o'tish jonli); B reja gapi (Mentor misolida): «Internet uzildi — shu demoning 60 soniyalik videosini ko'rsataman.» — 6-dars B reja blokida va 13-darsda aynan.
10. **«Xatosiz» o'tish** — demo stsenariysining beshala qadami rejadagidek o'tdi; vaqt belgi emas. Har urinish va o'tishdan keyin demo holati boshiga qaytariladi (Mentor misolida — o'yindan chiqish, yana «8 / 10») — 6-dars stsenariysida «boshiga qaytarish» tayyorlov qatori.
11. **`XATOLAR.md` ga «## Demo tekshiruvi» bo'limi** (7-dars) — 13-Modul 12-darsi shakli (usul · natija · holat).
12. **«hakam» 1-darsda tug'iladi** (ta'rif: «Pitchni baholaydigan odam — investor yoki tadbirkor — hakam deyiladi.»); keyingi darslarda glosssiz.
13. **«Demo Day» o'quvchi matnida** — faqat 13-darsda (Demo Day formatidagi repetitsiya) va yakundagi «Keyingi dars» qatorida emas; 1–12-darslarda — «hakamlar oldida chiqish» (T-038: kelajak va'dasi yo'q). **Istisno (08.10 04:07, 12-dars TS9):** 12-dars yakunidagi «Keyingi dars» qatori — 13-dars nomi App.jsx dagidek aynan («Demo Day'ga tayyormisiz?», P-015); mazmuni va'da qilinmaydi.
14. **12-Modul o'sish grafigi** pitch qoralamasiga kirmaydi (matn bo'laklari); 5, 8, 13-darslarda ham grafik qaytmaydi — Raqamlar bo'lagi gap bilan.
15. **Kod oynasi va namuna o'lchamlari** (3-dars): rasm o'lchami 180 × 320 va lendingdagi pastki ikki rasm — sahna namunasi, Mentor lendingining haqiqiy o'lchami emas (⛔ «qur» da moslanadi).

**2-to'lqin kelishuvlari (08.10 04:05, F-1008-557; manba — `2TOLQIN-OZ-AUDIT.md`):**
16. **Mentor pitchining tuzatilishi — bitta manba:** 5-dars `MENTOR_TUZATISH` (Bozor — «60 kim ekanini aytaman: mahalla futbol guruhi a'zolari» · Raqamlar — «Tasdiq nima ekanini aytaman: yozma javob, pul emas» · Keyingi qadam — «Ilova maydon egalariga xizmat qilmasligini aytaman»);
    tuzatilgan uch bo'lak matni — 8-dars TS3 (Keyingi qadam so'rovi: «… sizdan bitta so'rov: ular bilan tanishtiring» — GATE M). 13-darsda Mentor chiqishi — shu holat (pitch matni o'quvchi ekranida yo'q).
17. **Mentor pitchining yozma matni** — 1.1 aynan (5-darsda ham); 2-darsdagi lahza — faqat 2-dars hikoya mashqida; 8, 13 — 16 dagi tuzatilgan holat.
18. **Ikki so'z, ikki ma'no:** «demo yo'li» — mahsulotda demo o'tadigan ekranlar (joy; 4, 6, 7, 13) · «demo stsenariysi» — shu yo'ldagi yozilgan qadamlar (matn; 6, 7, 13). «B yo'l» — riskka oldindan tayyorlangan ish (6) · «B reja» — faqat B reja videosi (9.9).
19. **Namuna akkaunt** — 6-darsda ikkita (laptop va telefon), `namuna = true`, o'chirilmaydi; 4-dars namuna yozuvi va 9-dars videosi shundan. **Tekshiruv akkaunti** (7-dars) — boshqa narsa, tekshiruvdan keyin o'chiriladi.
20. **Dars raqami o'quvchi matnida** — ruxsat («6-darsdagi demo stsenariysi»; 12-Modul kodi naqshi «4-darsdagi …»); modul raqami — LMS bo'yicha; kod raqami (`m12-NN`) — yo'q.
21. **Ikkinchi misol olami** (test va qisqa mashq, P-002) — kitob almashish ilovasi (1, 6, 7, 8, 13-darslar) · uy vazifalari ilovasi (4-dars).
22. **9–12-darslar Mentor misollari** — 9-dars `MENTOR_SSENARIY` (A-4) · 10-dars buyurtma rejasi va ikki xat (A-6) · 11-dars `MENTOR_KONSEPT` (A-6); 12-dars uch yo'nalishi shulardan olinadi.
23. **Nishon nomi** — PM darslarida «!» bilan, Kod darslarida «!» siz (12-Modul, 13-Modul naqshi).
24. **Kalit qo'shimchalari (8-bo'limga «qur» oldidan):** `pm-m12d5-varaq.vaqt: n | null` · `pm-m12d8-final` + `vaqt: n | null`, `tur: 'sherik' | 'yakka'`, `bolaklar`, `savollar[].id` (bankdan bo'lsa) · `pm-m12d13-repetitsiya` — 13-dars TS1 · `pm-m12d11-dastur` tiplari — 11-dars TS7 · uzunliklar — 2-dars TS10, 9-dars TS4, 10-dars TS6. 9-dars `bor === true` → 10-darsda «Ota-onangiz rozi bo'lsa, video havolasini uyda qo'shasiz.»

## 10. Ruscha lug'at (6-RU bosqichi uchun; 13-Modul tayanchi 10 + 12-Modul `QURUVCHI_TOPSHIRIQ_3.md` — kuchda)
| uz | ru | izoh |
|---|---|---|
| pitch · zal · baholash varag'i · repetitsiya · taymer | питч · зал · лист оценки · репетиция · таймер | 12-Modul kodi |
| pitch bo'laklari: Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam | Проблема · Рынок · Решение · Цифры · Команда · Следующий шаг | «Цифры» — 12-Modul ru («Raqamlar»); yangilari — RU bosqichida o'lchanadi |
| «Yordam» · «Bajardim» · «Davom etish» · «Ortda qoldingizmi» | «Подсказка» · «Готово» · «Продолжить» · «Отстали?» | 13-Modul lug'ati |
| jonli demo · B reja · buzish yozuvi · «Tuzatish qilindi» | живое демо · запасной план · запись поломки · «Исправление сделано» | 11, 12-Modul |
| hikoya | история | 9-Modul `PmUserStoryPitchLesson` (08.10) |
| **Yangi (o'lchanmagan — RU bosqichida tasdiqlanadi):** savol-javob · hakam · tezlik · yuklanadigan kod hajmi · keyin yuklash · sayqal · joy egallovchi · demo stsenariysi · demo o'tishi · yangi funksiya to'xtatildi · demo tekshiruvi · video-portfolio · frilans · stajirovka · xalqaro dastur · maslahatchi | вопросы и ответы · судья · скорость · объём загружаемого кода · отложенная загрузка · шлифовка · заглушка · сценарий демо · прогон демо · заморозка новых функций · проверка демо · видео-портфолио · фриланс · стажировка · международная программа · наставник команды | taklif; «наставник» Mentor bilan aralashmasin — RU da qaror |
