# 14-Modul (kod: `src/12-Modull`) · 7-dars (PM + amaliyot) «Investor ko'zi bilan: demo buzilmaydimi?» — MD v3 <!-- TAXMIN T20 -->

Fayl: `src/12-Modull/PmDemoTestLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m12-07` · **12 ekran** (nazariya 6 · amaliyot bloki 2 · yakuniy savol, podium, kartochkalar, yakun — 4; PM+PRAKT shakli — tayanch 4) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Quruvchi qoidalari (12-Modul `QURUVCHI_SABOQ.md` A–E majburiy; E 40–55 qat'iy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (har variantning o'z yengil chegarasi — E 40; bitta navbatdagi tugma — halqa) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi, natijada u yashil xulosa qutisining birinchi kichik qatori (E 42) · ko'p elementli mashq ketma-ket, bir vaqtda bitta katta karta (E 53) · yorliq input ichida (E 43) · telefon maketi chapda, o'lchami barqaror (≈170×272) ·
ekranda ≤ 3 blok · maketda hech narsa kesilmaydi (E 41) · «Ortda qoldingizmi» darsda bir marta, birinchi blokda · yakun — E 50 standarti («Bugungi asosiy fikr» qutisi yakunda yo'q) · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 8-ekran — **C** (`correctIdx 2`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 472–474, grep 08.10, DE-205): `m12-06` «Demoga tayyorgarlik: risklar va B reja» → **`m12-07` «Investor ko'zi bilan: demo buzilmaydimi?»** (osti: «demo tekshiruvi: buzamiz, agent tuzatadi, uch marta to'liq o'tish», `type: 'PM'`) → `m12-08` «Final pitchingiz 5 daqiqaga tayyormi?». <!-- TAXMIN T20 -->
Tur (PM-005): aralash — PM qismi (0–5) **2-tur sof PM** (artefakt — o'z demosining uch kutishi, yozma matn; mustaqil ish majburiy — 5-ekran) + **ikki amaliyot bloki** o'quvchining o'z mahsulotida va repo'sida (6, 7-ekranlar). **Keyssiz** (tayanch 5). Kod oynasi yo'q.
⚠️ **Halollik va xavfsizlik chegarasi (TAQIQLAR 1, 2, 3; tayanch 1.7, 1.14) — har ekranga tegadi:** buzish — faqat **o'quvchining o'z mahsulotida**, faqat uch usul bilan, o'zgarishni tekshiruv akkaunti qiladi (haqiqiy foydalanuvchi hisobi ishlatilmaydi) ·
**Mentor misolining buzish natijasi to'qilmaydi** — «Nima bo'ldi», belgi, tuzatish va sabab — ⛔ «qur» pilotida, haqiqiy natijadan; MD da kutilgan natija «buzilishi ham, buzilmasligi ham mumkin» · «demo buzilmaydi», «tuzatildi», «endi ishlaydi» — yo'q: «Tuzatish qilindi» (ish fakti) va «qayta tekshiruvda takrorlanmadi» (natija) ·
yangi funksiya qo'shilmaydi (6-darsdan — «yangi funksiya to'xtatildi», teg `m14-demo`) · «sinov» so'zi yo'q — demo tekshiruvi o'quvchining o'z ishi (T10). <!-- TAXMIN T10 -->
Vaqt: ≈ 90 daqiqa (taqsimot — A-11; ⛔ reja, «qur» pilotida taymer bilan o'lchanadi).
Manba: `00-MODUL-TAYANCH.md` (1.0 · **1.6 — demo stsenariysi, risklar, B reja, uyg'otish** · **1.7 — nazariya, A1, A2, ⛔ natija — AYNAN** · 1.14 · 2 — atamalar · 3 — teg 07, `XATOLAR.md` · 4 — PM+PRAKT shakli · 6 — Render · 7 — 18 sinf · 8 — `pm-m12d6-demo`, `pm-m12d7-tekshiruv`) ·
`00-TAQIQLAR.md` (0–8) · `00-NOMLAR.md` · `MD_AGENT_TOPSHIRIQ.md` (7-qator, pilot eslatmasi 7) · 13-Modul tayanchi (1.12 — besh tekshiruv, `XATOLAR.md`; 2 — buzish yozuvi, «Tuzatish qilindi», tekshiruv akkaunti) · 12-Modul tayanchi (1.5 — buzish yozuvi; 9.28 — brauzer ko'rinishi; 9.35 — tekshiruv akkaunti; `namuna`) ·
namunalar (tuzilish va hajm; matn ko'chirilmadi): 13-Modul `07-PmTerms-v3.md` + `07-FILTR.md` (PM+PRAKT shakli, 12 ekran) · 12-Modul `05-BreakAndFix-v3.md` + `05-FILTR.md` (buzish yozuvi, «Tuzatish qilindi», qayta tekshiruv) · 13-Modul `12-StabilizeDay-v3.md` (`XATOLAR.md`, tekshiruv akkaunti, yangi funksiya qo'shilmaydi).
⚠️ Modul raqami o'quvchi matnida — LMS raqami: «12-Modulda» (buzish yozuvi), «13-Modulda» (`XATOLAR.md`), «6-darsda», «4-darsda» (shu modul). Kod raqami faqat fayl yo'lida.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Darsning bitta natijasi** (dastur: «demo-risklar chek-listi → agent bilan progon: o'quvchi buzadi (tarmoq uzilishi, bo'sh data, ikki klik), agent tuzatadi» · natija «Demo 3 progonni xatosiz o'taydi + B reja ishlaydi»; tayanch 1.7, 4):
   o'quvchi o'z demosining uch riskiga **kutish** yozadi (5-ekran) → o'z mahsulotida demoni **uch usul bilan buzadi** va har urinishni **buzish yozuvi** bilan yozadi; «Buzildi» chiqqanini agent tuzatadi — **«Tuzatish qilindi»** — va o'sha usul bilan **qayta tekshiriladi**; `XATOLAR.md` ga «Demo tekshiruvi» bo'limi (Amaliyot 1) →
   demoni boshidan oxirigacha **uch marta** o'tadi (taymer bilan), **ikkinchisida B reja** (video) ochiladi (Amaliyot 2). <!-- TAXMIN T8 -->
   Saqlanadi `pm-m12d7-tekshiruv` (A-12; 13-dars o'qiydi). Teg `m14-dars-07-done` (tayanch 3). Natija besh holatda bo'lishi mumkin (11-ekran sarlavhasi shunga qarab; ✓ va nishon — faqat birinchisida).
   «Buzilmadi» ham natija. Mentor misolining natijasi — ⛔ pilotda (tayanch 1.7, 1.14). Keyingi darslar ekranda va'da qilinmaydi (T-038).
2. **Bugungi asosiy fikr (P-013 — darsning ichki o'qi; yakunda ko'rsatilmaydi, SABOQ E 50):** Demo o'tishi oddiy sharoitni ko'rsatadi; buzilsa nima bo'lishini ataylab buzib va qayta tekshirib bilasiz. (106)
3. **O'tilgan — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - 6-dars (shu modul; tayanch 1.6): **demo stsenariysi** — demoda bosiladigan qadamlar ro'yxati (Mentor misolida 5 qadam, 60–90 soniya) · **demo o'tishi** — demoni boshidan oxirigacha bir marta ko'rsatish · **B reja** — 60 soniyalik ekran videosi · Backend'ni **uyg'otish** — demo oldidan bitta so'rov ·
     **risklar ro'yxati** (har risk + B yo'l) · **yangi funksiya to'xtatildi** — teg `m14-demo`, shundan keyin faqat tuzatish · demo qayerda: laptopdagi brauzerda (mobil trekda — brauzer ko'rinishi), telefon — ikkinchi qurilma. Kalit `pm-m12d6-demo`. <!-- TAXMIN T8 --> <!-- TAXMIN T9 --> <!-- TAXMIN T10 -->
   - 4-dars (shu modul; tayanch 1.4): **bosish javobi** — «Qo'shilaman» bosilganda tugma holatini o'zgartiradi, ikki marta bosilmaydi · **joy egallovchi** · muvaffaqiyat animatsiyasi «8 / 10» → «9 / 10». <!-- TAXMIN T7 -->
   - 12-Modul 5-darsi: **buzish yozuvi** — nima qildim · nima kutdim · nima bo'ldi → belgi **«Buzildi»** / **«Buzilmadi»** · **«Tuzatish qilindi»** (ish fakti) va **«qayta tekshiruvda takrorlanmadi»** / **«qayta tekshiruvda yana buzildi»** (natija) — alohida · kutish buzishdan **oldin** yoziladi ·
     uchish rejimi bilan internetni uzish, belgi «Ulanmoqda…» — kutish payti · **ulanish belgisi** «Ulangan» · «Ulanmoqda…» · «Ulanmagan» (12-Modul 2-darsi) · **«Hozir ko'ryapti»** (12-Modul 4-darsi).
   - 12-Modul 7-darsi va 13-Modul 12-darsi: **tekshiruv akkaunti** — agent ochadi, namuna ism va login bilan, haqiqiy emas (`namuna = true`), tekshiruvdan keyin faqat aytilgan `id` bo'yicha o'chiriladi · **`XATOLAR.md`** — topilmalar ro'yxati fayli (usul · natija · holat; qolgani «qoldi» va sababi) ·
     brauzer ko'rinishi — `npx expo export -p web` → `netlify deploy --prod --dir dist` (push'dan keyin o'zi yangilanmaydi, 12-Modul 9.28); APK o'zi yangilanmaydi.
   - 11-Modul: **agent** (Antigravity) · **prompt** · **talab** (qayerda · nima qilsin · nima buzilmasin) · `.env` · `git status` → `git add <fayl>` · Render (bepul xizmat 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa — tayanch 6) · trek (`pm-m9d8-platforma.trek`).
   - 14-Modul 1-darsi (pilot, parallel yozilmoqda): **hakam** — Demo Day'da baho beradigan odam (investor, tadbirkor) (tayanch 2; TAYANCHGA SAVOL 16). <!-- TAXMIN T19 -->
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **demo tekshiruvi** — tayanch 2: «o'quvchi demoni ataylab buzib tekshiradi». Darsdagi sodda ta'rif, so'zma-so'z: «Demoni ataylab buzib, hakam nimani ko'rishini oldindan bilish — demo tekshiruvi.»
     Tug'iladi 2-ekranda — demo o'tishi va uch savoldan keyin (`QIzoh`: «… demo tekshiruvi deyiladi»). Yakun 2-qatori va kartochka 1 — shu so'zlar (arena 1 — kim buzadi). Sarlavhalarda yo'q (T-011).
   - **uch savol** — darsdagi ko'rish usuli (tayanch 1.7: «investor demoda nimaga qaraydi»): «Mahsulot jonli ishlaydimi?» · «Nima ekani bir qarashda bilinadimi?» · «Buzilsa, ekranda nima bo'ladi?» (bitta manba `UCH_SAVOL`).
     O'quvchi matnida — «bu darsda demo uch savol bilan ko'riladi», hakamning gapi sifatida emas (TAQIQLAR 0: hakam gapi o'ylab topilmaydi; TAYANCHGA SAVOL 10).
   - **uch risk** (dasturdagi demo-risklar; tayanch 1.7): **tarmoq uzilishi** · **bo'sh ma'lumot** · **ikki marta bosish** — 4-ekranda, har biri avval hodisa qatori bilan («Zalda internet bir lahzaga uzilishi mumkin.»), keyin nomi (kulrang yorliq).
     Buzish **usuli** — o'sha riskni ataylab yuzaga keltirish (12-Modul so'zi «usul»); **urinish** — bitta usulni bir marta bajarish va yozish.
   - **kutish** — buzish yozuvining «Nima kutdim» qatori: ekranda ko'rinadigan narsa (belgi, son, yozuv, tugma). 12-Modulda o'tilgan; bugun — demo uchun, 4-ekranda (yaxshi kutish va riskning oldini olish farqi).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«demo»** — bu darsda demo stsenariysi bo'yicha ko'rsatiladigan jonli demo (o'quvchining va Mentorning). **«demo o'tishi»** — boshidan oxirigacha bir marta (T10). «progon», «sinov progoni», «demo-test», «repetitsiya» (bu ma'noda) — yo'q. <!-- TAXMIN T10 -->
   - **«demo tekshiruvi»** · **«tekshir-»** — o'quvchining o'z ishi; **«qayta tekshiruv»** — tuzatishdan keyin o'sha usul bilan. **«sinov»** — bu darsda yo'q (uyga vazifa ② dagi tanish odam ham — «ko'rsating», «so'rang»).
   - **«buzish»**, **«buzildi» / «buzilmadi»**, **«buzish yozuvi»** — dars atamasi (TAQIQLAR 5 — ruxsat); «buzuq», «buzilgan» (sifat sifatida) — yo'q.
   - **«hakam»** — Demo Day'da baho beradigan investor yoki tadbirkor; ismsiz; gapi o'ylab topilmaydi. Sarlavhada — «investor» (dars nomi), matnda — «hakam». **«sherik»** — Amaliyot 2 da hakam o'rnida o'tiradigan sinfdosh (ixtiyoriy; ismi yozilmaydi). <!-- TAXMIN T19 -->
   - **«risk»** — 6-darsdagi so'z, faqat uch risk nomi bilan; **«riskning oldini olish»** — demodan oldin qilinadigan ish (4-ekran: kutish emas). «B yo'l» (6-dars) bu darsda tilga olinmaydi — bitta so'z yetadi.
   - **«B reja»** — faqat 60 soniyalik video (tayanch 1.6); «zaxira reja» (12-Modul 10-darsida boshqa ma'no) — yo'q.
   - **«tekshiruv akkaunti»** — agent ochadigan hisob (o'quvchi matnida «hisob» UI bilan bir); **«demo hisobi»** yo'q — o'quvchining demo uchun kirgan hisobi «demo yo'lidagi hisobingiz» deb bir marta (A1 1-qadam).
   - **«Tuzatish qilindi»** — kodda o'zgartirish qilindi (ish fakti); **«qayta tekshiruvda takrorlanmadi»** / **«qayta tekshiruvda yana buzildi»** — natija; **«qoldi»** — bugun tuzatilmagan (sababi bilan). «tuzatildi», «endi ishlaydi», «isbot» — yo'q.
   - **«xatosiz»** — demo o'tishi belgisi: stsenariyning beshala qadami rejadagidek o'tdi (TAYANCHGA SAVOL 7); **«xato bilan»** — biror qadam rejadagidek bo'lmadi.
   - **Ishlatilmaydi:** server (prozada), demo-test, stress-test, progon, sinov, «test qilish», QA, bug, «tuzatildi» (belgi sifatida), performance, feature freeze, Q&A, investitsiya (summa), A1/A2, `m12-07`, «Modul 14», keys, pilot, daftar.
6. **Mentor misoli (tayanch 1.6, 1.7, 1.14 — AYNAN; o'quvchi matnida «Mentor misolida»):**
   - **Demo stsenariysi (1.6; `MENTOR_STSENARIY`, 5 qadam):** 1 Kirish · 2 «O'yinlar» (e'lon «Shanba, 18:00 · Mahalla maydoni · 8 / 10») · 3 O'yinga qo'shilish («Qo'shilaman») · 4 Ikkinchi telefonda son o'zgaradi («8 / 10» → «9 / 10») · 5 «Hozir ko'ryapti». Vaqt — 60–90 soniya (Mentor rejasi, tayanch 1.14). <!-- TAXMIN T8 -->
   - **Demo joyi (1.6, T8):** laptopdagi brauzerda Mentor ilovasining brauzer ko'rinishi (`maydon-jamoa-….netlify.app`) proyektorga · telefon — ikkinchi qurilma (ikkinchi o'yinchi). **B reja** — 60 soniyalik ekran videosi, laptopda. <!-- TAXMIN T8 -->
   - **B reja gapi (Mentor misolida; olam matni, T-008; TAYANCHGA SAVOL 6):** «Internet uzildi — shu demoning 60 soniyalik videosini ko'rsataman.» (`B_REJA_GAPI`)
   - **Mentorning buzish yozuvi (bitta manba `MENTOR_YOZUV`; «Nima qildim» va «Nima kutdim» — Mentorning o'z matni, T-008; TAYANCHGA SAVOL 1, 2; «Nima bo'ldi» va undan keyingi ustunlar — ⛔ pilot):**

   | Urinish | Nima qildim | Nima kutdim | Nima bo'ldi | Belgi | Tuzatishdan keyin |
   |---|---|---|---|---|---|
   | 1 · Tarmoq uzilishi | Telefonda «Shanba, 18:00» o'yinini ochib, uchish rejimini yoqdim; belgi «Ulanmoqda…» bo'lgach laptopda shu o'yinga qo'shildim; keyin uchish rejimini o'chirdim. | Belgi «Ulangan» bo'lgach, telefonda «9 / 10» ko'rinadi | ⛔ `{pilotda}` | ⛔ | ⛔ |
   | 2 · Bo'sh ma'lumot | Agent tekshiruv akkauntidan yangi o'yin e'lon qildi — «Juma, 18:00 · Mahalla maydoni», hali hech kim qo'shilmagan; laptopda «O'yinlar» ni yangilab, shu o'yinni ochdim. | O'yinda «0 / 10» va «Qo'shilaman» ko'rinadi, ekran oq emas | ⛔ `{pilotda}` | ⛔ | ⛔ |
   | 3 · Ikki marta bosish | Laptopda «Shanba, 18:00» o'yinida «Qo'shilaman» ni tez ikki marta bosdim. | Bitta qo'shilish: son bir marta o'zgaradi, «9 / 10» | ⛔ `{pilotda}` | ⛔ | ⛔ |

   ⛔ Yozuv «qur» pilotida Mentor repo'sida `m14-dars-07-start` (= `m14-dars-06-done`, teg `m14-demo`) bilan, laptop brauzerida va haqiqiy telefonda olinadi. «Nima bo'ldi», belgi, agentning sababi va tuzatish — **haqiqiy natijadan**; o'quv muvozanati uchun natija tanlanmaydi, sabab to'qilmaydi (tayanch 1.7, 1.14; 12-Modul 9.37 b).
   Hech biri buzilmasa — shu ham yoziladi (3-qadam yo'li «Buzildi» yo'q holatida; `-done` = `-start` + `XATOLAR.md` bo'limi). Har urinishdan keyin holat boshiga qaytariladi: 1, 3 — laptopda o'yindan chiqish («8 / 10») · 2 — agent «O'chir» bilan (TAYANCHGA SAVOL 8).
7. **Raqamlar (faqat tayanch 1.14 va oldingi darslardagi belgi sifatida):** demo — 5 qadam, 60–90 soniya · B reja — 60 soniya · namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10» → «9 / 10» · «Hozir ko'ryapti» · tekshiruv o'yini «Juma, 18:00 · Mahalla maydoni · 0 / 10» (13-Modul 12-darsidagi tekshiruv o'yini nomi; TAYANCHGA SAVOL 2) ·
   Render: 15 daqiqa, ≈1 daqiqa (rasmiy, tayanch 6). Buzish natijalari soni — **yo'q** (⛔ pilot). Boshqa son yo'q: foydalanuvchi, tashkilotchi, tasdiq sonlari bu darsda aytilmaydi (sinf 12). Testlardagi ikkinchi misolda son yo'q.
8. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** kitob almashish ilovasi (3-ekran). Metafora yo'q. Keys yo'q. Brend (Render, Netlify, Expo) — faqat 12–13-Modul so'zi bilan, amaliyotda.
9. **Xavfsizlik va halollik chegarasi (TAQIQLAR 1, 2, 3; 12-Modul 9.35 a, 9.37 g; 13-Modul 12-dars A-9):**
   - buzish — faqat o'z mahsulotida; boshqa odamning ilovasi yoki sayti tekshirilmaydi; ko'p so'rov bilan «bosish», hujum usuli — yo'q. O'quvchiga ikki marta ko'rinadi: 1-ekran kulrang qatori va Amaliyot 1 1-qadam (qalin); 4-ekran O'qituvchi eslatmasida ham;
   - o'zgarishni o'quvchining demo yo'lidagi hisobi va **tekshiruv akkaunti** qiladi; haqiqiy foydalanuvchining hisobi va yozuvlari ishlatilmaydi; tekshiruv akkaunti va uning yozuvlari Amaliyot 1 oxirida agent ko'rsatgan `id` lar bo'yicha o'chiriladi (o'quvchi «O'chir» degandan keyin);
   - sherik (hakam o'rnida) — ixtiyoriy, ismi hech qayerga yozilmaydi; uyga vazifa ② — tanish odam (ota-ona yoki sinfdosh), ismi yozilmaydi; B reja video — laptopda, hech qayerga yuklanmaydi (TAQIQLAR 1 video qoidasi);
   - `.env` qiymatlari, token va kalitlar agentga yuborilmaydi; xato chiqsa — faqat xato qatori;
   - kafolat va sabab da'vosi yo'q: agentning «tuzatdim» degani — da'vo; «Tuzatish qilindi» — ish fakti; natija — qayta tekshiruvda. Demo o'tishi xatosiz bo'lsa ham «demo buzilmaydi» deyilmaydi (8-ekran shu haqida).
10. **Kim nima yozadi (talab zinapoyasi):** 5-ekran — o'quvchi uch kutishni o'zi yozadi («Nima qilaman» — oldindan, tahrirlanadi) · **Amaliyot 1** — tekshiruv akkaunti talabi (tayyor + bitta joy `{bo'sh holat}`) · tuzatish talabi (tayyor + ikki joy, ikkalasi oldindan: `{buzish yozuvi}`, `{demo stsenariysi}`) · `XATOLAR.md` talabi (tayyor + yozuv oldindan) ·
    **Amaliyot 2** — agentsiz: o'quvchi o'zi o'tadi, belgilaydi; xato bo'lsa — Amaliyot 1 dagi tuzatish talabi. Mahsulot qarori (nima kutiladi, qaysi tugma asosiy, bo'sh holat qanday) — o'quvchida (sinf 13); agent — tekshiruv akkaunti va tuzatish (sinf 10).
11. **Vaqt (≈ 90 daqiqa; ⛔ reja — «qur» pilotida taymer bilan, o'lchanmaguncha da'vo emas):** kirish va reja (0–1) ≈ 5 · uch savol va 1-savol (2–3) ≈ 10 · uch risk (4) ≈ 6 · kutishlar (5) ≈ 7 · Amaliyot 1 ≈ 30 · Amaliyot 2 ≈ 22 · yakuniy savol, podium, kartochkalar, arena (8–11) ≈ 8 · zaxira ≈ 2.
    **Ulgurmagan o'quvchi yo'li:** Amaliyot 1 — «Davom etish» 2-qadamdan (uch urinish belgilangach) keyin ochiladi (MD qarori — SABOQ E 55); 3, 4-qadam — uyga vazifa ① · Amaliyot 2 — «Davom etish» 2-qadamdan (1-o'tish) keyin; qolgan o'tishlar — uyga vazifa ① ·
    blok bajarilgani — faqat 4-qadam «Bajardim»idan · yakun sarlavhasi holatga qarab (11-ekran). Tashqi kutish (Render yangi versiyasi, brauzer ko'rinishini qayta eksport, Netlify) dars oqimini to'xtatmaydi: kutayotganda keyingi urinish yozuvi o'qiladi.
12. **Saqlash kalitlari (tayanch 8 — pilot kaliti, shu holicha majburiy):**
    - **o'qiydi:** `pm-m12d6-demo` — `stsenariy` (5 qadam: 5-ekran kulrang qatori, Amaliyot 1 `{demo stsenariysi}`, Amaliyot 2 chap ro'yxati) · `video` (Amaliyot 2: B reja yo'li) · `uygotish` (Amaliyot 1 1-qadam kulrang qatori) <!-- TAXMIN T9 --> ·
      `pm-m9d8-platforma.trek` — yangi versiya yo'li (Amaliyot 1 3-qadam; TAYANCHGA SAVOL 12). Yo'q bo'lsa: `stsenariy` — Amaliyot 2 1-qadamda o'quvchi 5 qatorni o'zi yozadi (kulrang namuna — Mentor stsenariysi), `video` — Amaliyot 2 1-qadamda «Video bor» · «Video hali yo'q», trek — ikkala yo'l ko'rinadi.
    - **yozadi:** `pm-m12d7-tekshiruv` = `{ urinishlar: [{ usul: 'tarmoq' | 'bosh' | 'ikki', qildim, kutdim, boldi, buzildi: bool | null, tuzatishQilindi: bool, qayta: 'takrorlanmadi' | 'takrorlandi' | null }], otishlar: [bool | null] (3), bReja: bool | null, savedAt }` (tayanch 8, aynan; `qayta` — F-1008-556). Maydonlar shartnomasi:
      `urinishlar` — uchta, tartib o'zgarmaydi (`tarmoq` · `bosh` · `ikki`); `qildim`, `kutdim` — 5-ekran (Amaliyot 1 da tahrirlanadi) · `boldi` — Amaliyot 1 2-qadam (matn; `''` — urinish hali qilinmagan) ·
      `buzildi` — «Buzildi» → `true`, «Buzilmadi» → `false`, belgilanmagan → `null` · `tuzatishQilindi` — Amaliyot 1 3-qadam; faqat `buzildi === true` bo'lgan urinishda `true` bo'la oladi, boshqasida `false` ·
      `otishlar[i]` — Amaliyot 2: «Xatosiz» → `true`, «Xato bilan» → `false`, qilinmagan → `null` · `bReja` — 2-o'tishda «Video ochildi» → `true`, «Video ochilmadi» → `false`, belgilanmagan yoki video yo'q → `null` · `savedAt` — har saqlashda.
      **Qayta tekshiruv natijasi** — kalitda `urinishlar[].qayta: 'takrorlanmadi' | 'takrorlandi' | null` (tayanch 8, F-1008-556; 13-dars o'qiydi); yakun sarlavhasi va `XATOLAR.md` qavsi shundan (TAYANCHGA SAVOL 5 — kalitga qo'shish taklifi).
      Kalitga ism, sherik ismi, login, parol, `id`, video fayli va havolasi yozilmaydi. Dars boshqa darsning kalitiga yozmaydi. Kod qoralamasi kaliti yo'q (kod oynasi yo'q).
13. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › ✎ ↻ — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q; belgi-formula (→, ×, =) o'quvchi izohida va test variantida yo'q — maketda «8 / 10» → «9 / 10» o'zgarishi harakat bilan ko'rinadi.
    «Maydon Jamoa» — telefon va brauzer maketida, o'z yashil rangida (11-Modul 9.62), logotipsiz. Rang — faqat holat foni (D3): «Buzildi» — `err` · «Buzilmadi» — `ink2` · «Tuzatish qilindi» — `accent` · «qayta tekshiruvda takrorlanmadi» — `ok` · «qayta tekshiruvda yana buzildi» — `err` · «Xatosiz» — `ok` · «Xato bilan» — `err` · kutish — accent uzuq ramka (U-041).
14. **Trek (tayanch 1.6, 4):** demo ikkala trekda laptopdagi brauzerda (mobil trek — brauzer ko'rinishi, web-trek — sayt), ikkinchi qurilma — telefon brauzerida o'sha demo yo'li (TAYANCHGA SAVOL 4). PM qismi (0–5) — ikkala trekka bir xil. <!-- TAXMIN T8 -->
    Amaliyot 1 farqi — faqat 3-qadamdagi yangi versiya yo'lida: `backend/` — push, Render; mobil trek `mobil/` — brauzer ko'rinishini qayta eksport; web-trek — push, Netlify odatda o'zi yangilaydi. O'quvchi matnida «mahsulotingiz», «demongiz» (sinf 11).

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.4, 1.6, 1.7):** 4-darsda demo yo'li sayqallandi, 6-darsda demo stsenariysi, risklar va B reja yozildi, demo bir marta to'liq o'tdi. O'tish — oddiy xonada: internet bor, ma'lumot bor, tugma bir marta bosildi. Bugun — o'sha demoni hakam o'rnida ataylab buzib ko'rish, tuzatish va uch marta to'liq o'tish.
- **Dars ipi:** 0 — zalda internet uzilsa, demongiz nima ko'rsatadi? (o'z demosi) → 2 — Mentor demosi besh qadamda o'tadi: uch savoldan ikkitasiga javob bor, «buzilsa-chi?» ga yo'q → «demo tekshiruvi» → 3 — bo'sh holatni qanday bilasiz (kitob almashish ilovasi) →
  4 — uch risk: Mentor nimani kutadi (kutish va oldini olish farqi) → 5 — o'z demosining uch kutishi → Amaliyot 1 — buzish, tuzatish, qayta tekshiruv, `XATOLAR.md` → Amaliyot 2 — uch demo o'tishi, ikkinchisida B reja → 8 — yakuniy: tuzatishdan keyin demo o'tdi — ikki marta bosish ham takrorlanmaydimi? → podium → kartochkalar → yakun (holatga qarab).
- **Bitta vizual — «Demo sahnasi» (`DemoSahna`, dars bo'yi; 163/180; bitta manba `MENTOR_STSENARIY` + `MENTOR_YOZUV` + `USULLAR` + o'quvchi ma'lumoti `pm-m12d6-demo`, `pm-m12d7-tekshiruv`):** <!-- TAXMIN T8 -->
  - **telefon** (chapda, ≈170×272; yorliq ramka ustida «2-qurilma · telefon») — o'sha demo yo'li: «O'yin» ekrani — tepada ulanish belgisi (nuqta + yozuv), «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10»; holat qatorida samolyot belgisi (uchish rejimi) faqat 1-usulda. «Maydon Jamoa» nomi o'z yashil rangida.
  - **laptop brauzeri** (o'ngda, kattaroq; yorliq «laptop · proyektorga») — manzil satri `maydon-jamoa-….netlify.app`; «O'yinlar» ro'yxati yoki «O'yin» ekrani, «Qo'shilaman» tugmasi; B reja kadrida — video oynasi «60 soniya» (o'ynatish chizig'i).
  - **stsenariy chizig'i** (sahna tepasida, butun kenglikda) — besh qadam yorlig'i «1 Kirish · 2 O'yinlar · 3 Qo'shilish · 4 Ikkinchi telefon · 5 Hozir ko'ryapti» (joriy — accent, o'tgani ✓); ostida **taymer chizig'i** (12-Modul `TaymerChiziq` naqshi; yorliq «Mentor rejasi: 60–90 soniya»).
  - **buzish yozuvi kartasi** (5-ekran, bloklarning o'ng tomoni) — uch qator yorlig'i «Nima qildim» · «Nima kutdim» · «Nima bo'ldi» va belgi joyi; kutish qatori — accent uzuq ramkada; Mentor kartasida «Nima bo'ldi» — ⛔ pilot natijasi.
  - Ishlatiladi: 0 (laptop + telefon, Wi-Fi belgisi kesilgan) · 1 (tayyor holat, bir marta o'zi yuradi) · 2 (besh qadam o'tadi + savol kartasi) · 4 (risk kartasi + kutish holati) · 5 (yozuv kartasi) · 6, 7 (o'ng — kutilgan natija) · 3, 8 (javobdan keyin kichik ko'rinish).
  - Son almashganda bir lahza kattalashib qaytadi; `prefers-reduced-motion` da yurish va miltillash yo'q — holatlar birdan almashadi (DE-200). 393 kenglikda telefon brauzer ustida, o'lchami barqaror; hech narsa kesilmaydi (E 41). Vizual ⛶ ichida (q17, E 48).
- **Keyingi bosiladigan joy (E 40, qat'iy):** har bosiladigan variant va tugmaning o'z yengil accent chegarasi, yengil to'lqin navbatma-navbat 2 marta, kattalashishsiz; bitta navbatdagi tugma — halqa, to'lqin 3 marta, `scale` yo'q. `prefers-reduced-motion` da to'lqin yo'q, chegara qoladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → karta yozuv qatoriga uchadi · yangi qator ~1 s yashil yonadi · taymer chizig'i oxirigacha yuradi. Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Zalda internet uzilsa, demongiz nima ko'rsatadi?** (48)
- Mentor: 6-darsdagi demo o'tishini eslang. Endi demongizni hakam o'rnida ko'ring va bittasini tanlang. (93)
- Maket (chap; `DemoSahna` «kirish» holati): laptop brauzerida Mentor misoli — `maydon-jamoa-….netlify.app`, «O'yinlar»: «Shanba, 18:00 · Mahalla maydoni · 8 / 10»; yonida telefon (2-qurilma). Brauzer tepasida Wi-Fi belgisi — kesilgan; laptop ekrani xira, ustida «?» — nima ko'rinishi ochilmaydi.
  Ramka ustida yorliq «Mentor misoli · Maydon Jamoa».
- Variantlar (radio, o'ng; bir uzunlikda, bir shaklda — P-016):
  - Oq ekran — hech narsa ko'rinmaydi (33)
  - Eski son — o'zgarish ko'rinmaydi (32)
  - ✔ Tekshirmaganman — hali bilmayman (32)
- Javob:
  - to'g'riga: **Aynan!** Mashqda internet bor edi. Uzilsa nima ko'rinishini faqat ataylab uzib bilasiz. (85)
  - boshqasiga: **Qiziq fikr!** Shunday bo'lishi mumkin. Lekin buni qayerdan bilasiz — internetni ataylab uzib ko'rganmisiz? (104)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent chegara bilan qotadi; laptop ustidagi «?» yonida kichik yozuv «tekshirilmagan» paydo bo'ladi — qaysi variant to'g'ri bo'lishi sahnada ochilmaydi (P-036); javob qatori chiqadi.
- Ballsiz (hook; jonli darsda sinf ovozlari chizig'i — har variant va ovozlar soni; ism yo'q). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: uch variant (har birining yengil chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: Sinfdan so'rang: «Demo paytida sizda nima kutilmagan bo'lgan?» Javoblarni taxtaga yozing — ular bugungi uch riskka o'xshab chiqadi. Kim nima deganini sanamang.
✎ Hook — o'quvchining o'z demosi (6-darsdagi demo o'tishi) va zal sharoiti (P-016: aniq narsa + harakat). «Aynan!» / «Qiziq fikr!» — kurs qonuni (T-028, T-067). Payoff boshqa variantlarni yolg'onga chiqarmaydi: ular ham bo'lishi mumkin — dalil yo'q (KORPUS §119). Javob Mentor gapida aytilmaydi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun demongizni ataylab buzib tekshirasiz.** (43)
- Mentor: Mentor misoli — namuna; ikkala amaliyot — o'z mahsulotingizda, 6-darsdagi demo stsenariyingiz bo'yicha. (103)
- Chap — kulrang yorliq «demo tekshiruvi: buzamiz, agent tuzatadi, uch marta to'liq o'tish» (App.jsx osti so'zma-so'z, P-015) + ostida kulrang qator: Buzish — faqat o'z mahsulotingizda. (35)
  Vizual (`DemoSahna`, tayyor holat, bir marta o'zi yuradi — DE-200): stsenariy chizig'ining besh qadami birma-bir ✓ bo'ladi, taymer chizig'i oxirigacha yuradi; o'ngda bo'sh buzish yozuvi kartasi (uch qator yorlig'i, natija yo'q) — qaysi usul nima ko'rsatishi — 4-ekran va amaliyot kashfiyoti (P-015).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Hakam demoda nimani ko'rishini bilasiz · `uch savol`
  - 02 · Uch riskda nima kutishingizni yozasiz · `buzish yozuvi`
  - 03 · Demongizni buzasiz, agent tuzatadi · `Tuzatish qilindi`
  - 04 · Demoni uch marta to'liq o'tasiz · `B reja`
- Pastki qator (mono, kichik): repo — o'z repo'ngiz · Mentor misoli `maydon-jamoa` · namuna `m14-dars-07-done` <!-- TAXMIN T4 -->
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: Menyu ostidagi «uch marta to'liq o'tish» — Amaliyot 2: demo boshidan oxirigacha uch marta, ikkinchisida B reja. Bugun yangi funksiya qo'shilmaydi: 6-darsdan beri faqat tuzatish. Buzish — faqat o'quvchining o'z mahsulotida.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011; «demo tekshiruvi» — faqat kulrang yorliqda, App.jsx osti). Sarlavha — natija va'dasi (P-014). 02-qadam — 4, 5-ekran; 03 — Amaliyot 1; 04 — Amaliyot 2.

## 2 · Demo o'tishi nimani ko'rsatmaydi  ← QTushuncha (bashorat + demo o'tishi + 3 savol, bittadan — SABOQ 9, E 53)
- Eyebrow: Tushuncha · uch savol
- Sarlavha: **Demo o'tishi qaysi savolga javob bermaydi?** (42)
- Mentor: Demo o'tishini ishga tushiring, keyin har savol uchun tanlang: o'tishda ko'rindimi? (83)
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — o'sish tartibida): **Uch savoldan nechtasiga demo o'tishi javob beradi?** · Bittasiga · Ikkitasiga · Uchalasiga — tanlangach yopilmaydi: ixcham qator «Taxminingiz: …» natijagacha turadi; «Demo o'tishini boshlash» shundan keyin yoqiladi.
- Vizual (≤ 3 blok: sahna · savol kartasi va tugmalar · natija): **tepada** — stsenariy chizig'i va taymer · **chapda** — `DemoSahna` (laptop brauzeri + telefon) · **o'ngda** — joriy savol kartasi («Savol n / 3») va ostida ikki tugma «O'tishda ko'rindi» · «O'tishda ko'rinmadi».
- Demo o'tishi (tugma «Demo o'tishini boshlash»; Mentor stsenariysi A-6, ≈10 s animatsiya, besh qadam navbat bilan yonadi): 1 Kirish → 2 «O'yinlar» (e'lon kartasi) → 3 «Qo'shilaman» bosiladi → 4 telefonda «8 / 10» o'zi «9 / 10» bo'ladi → 5 «Hozir ko'ryapti: 2». Taymer chizig'i oxirigacha yuradi (yorliq «Mentor rejasi: 60–90 soniya»; animatsiya vaqti — son emas).
- Savol kartalari (navbat bilan; `UCH_SAVOL`):
  1. «Mahsulot jonli ishlaydimi?» ✔ O'tishda ko'rindi → 4-qadam yonadi: telefonda «9 / 10» o'zi paydo bo'ldi
  2. «Nima ekani bir qarashda bilinadimi?» ✔ O'tishda ko'rindi → 2-qadamdagi e'lon kartasi yonadi: o'yin, joy va odam soni bir qatorda
  3. «Buzilsa, ekranda nima bo'ladi?» ✔ O'tishda ko'rinmadi → stsenariy chizig'i ustida uch kulrang yorliq chiqadi: «internet bor» · «ma'lumot bor» · «tugma bir marta bosildi»
- **Harakat → Vizual o'zgarish:** «Demo o'tishini boshlash» → besh qadam navbat bilan yonadi, telefonda son o'zi o'zgaradi · «O'tishda ko'rindi» to'g'ri → sahnadagi mos qadam ~1 s accent bilan yonadi, savol kartasi kichrayib o'sha qadam ustiga ✓ bilan tushadi ·
  «O'tishda ko'rinmadi» to'g'ri → uch kulrang yorliq stsenariy ustiga tushadi · keyingi savol kartasi kiradi.
  Xato → tugma silkinadi, karta bir lahza `err` fon, bitta `QXato` (≤60; javobni aytmaydi):
  - 1-savol, «Ko'rinmadi»: 4-qadamga qarang: telefonda son nima bo'ldi? (44)
  - 2-savol, «Ko'rinmadi»: E'londa o'yin, joy va odam soni bormi? (38)
  - 3-savol, «Ko'rindi»: O'tishda internet uzildimi yoki hammasi oddiy edimi? (52)
  3/3 dan keyin: tugmalar va savol kartasi yopiladi; sahna va uch kulrang yorliq butun enga.
- Natija (bitta blok — E 42; `tugadi`: harakat paneli yopiladi, sahna butun enga, ⛶ ichida — q17/q18): yashil xulosa qutisi — birinchi kichik qator taxmin: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: ikkitasiga».
- Xulosa: Bu misolda demo o'tishi ikki savolga javob beradi. Buzilsa nima bo'lishini ataylab buzib bilasiz. (97)
- `QIzoh` (qutining oxirgi kichik qatori — E 42): Demoni ataylab buzib, hakam nimani ko'rishini oldindan bilish — demo tekshiruvi deyiladi. (89) — atama shu yerda tug'iladi (T-011)
- Tugma (pastki): Avval belgilang → Demo o'tishini boshlang → Savollarni ajrating (N/3) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Sahnadagi besh qadamdan biri shu savolga javob beradimi? (56)
- Keyingi bosiladigan joy: bashorat variantlari → «Demo o'tishini boshlash» (halqa) → ikki tugma (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Investor Eye! (uch savol birinchi urinishda).
- O'qituvchi eslatmasi: Uch savol — bu darsdagi ko'rish usuli (dasturda: investor demoda nimaga qaraydi); hakamlar boshqa savollar ham berishi mumkin. 2-savolga o'tishda o'zingiz yoki sherik javob beradi — uyga vazifa ② da tanish odamdan so'raladi.
  Demo o'tishi — oddiy sharoitda: internet bor, ma'lumot bor, tugma bir marta bosildi. Uch kulrang yorliq — 4-ekrandagi uch riskning teskarisi.
✎ Sarlavha 0-ekran savoliga javob beradi: internet uzilsa nima bo'lishi o'tishda ko'rinmaydi (T-064). Javob kaliti `[ko'rindi, ko'rindi, ko'rinmadi]` — Mentor stsenariysidan (A-6). Savollar — kurs savollari, hakam gapi emas (TAQIQLAR 0; TAYANCHGA SAVOL 10).

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: 1-savol (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Kitob almashish ilovangiz demosida «Mening kitoblarim» bo'sh bo'lsa-chi? Qanday bilasiz?** (88)
  - A — Demoni yana bir marta xuddi shunday o'taman (43)
  - ✔ B — Kitobi yo'q yangi hisob bilan ochib ko'raman (44)
  - C — Agentdan «ro'yxat to'g'rimi?» deb so'rab olaman (47)
  - D — Ro'yxatga oldindan bir nechta kitob qo'shaman (45)
- Kalit: **B** (index 1). To'rttalasi bir shaklda (birinchi shaxs fe'li bilan tugaydi); tire va qavs hech birida yo'q; uzunlik — «O'lchov»; to'g'ri javob yolg'iz eng uzun emas.
  Distraktorlar uch xil turkum (12-Modul 9.44 f): A — oddiy yo'lni takrorlash (bo'sh holat yuzaga kelmaydi) · C — agentning javobi (da'vo, ekran emas) · D — holatning oldini olish (bo'sh ro'yxat ko'rilmaydi).
- To'g'ri izohi: Bo'sh holatni ataylab yaratib, ekranni o'zingiz ko'rasiz. (57)
- Xato izohlari (≤60):
  - A: O'tishda ro'yxat to'la edi — bo'sh holat ko'rinadimi? (53)
  - C: Agent javobi — da'vo. Ekranda nima chiqishini kim ko'radi? (58)
  - D: Kitob qo'shsangiz, bo'sh ro'yxat qachon ko'rinadi? (50)
  - (umumiy) Bo'sh ro'yxatni ko'rish uchun nima qilish kerak? (48)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): kitob ilovasining telefon maketi — yangi hisob belgisi va bo'sh «Mening kitoblarim» ramkasi (uzuq chiziq), ustida accent «ekranni ko'ring».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Empty Check! — birinchi urinishda to'g'ri.
- Izoh (MD): savol ekrandan ko'chirilmaydi (§106): Mentor misoli emas, boshqa mahsulot va savol «qanday bilasiz». Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas (S-004): D hayotda foydali (oldini olish) — lekin savol «qanday bilasiz?», D bo'sh holatni ko'rsatmaydi (4-ekranda shu farq).
  Bo'sh ma'lumotning nomi bu yerda hali aytilmaydi — 4-ekranda tug'iladi; 2-ekrandagi «ma'lumot bor» yorlig'i shu holatga ko'prik. «Mening kitoblarim» — ikkinchi misolning o'z bo'limi (yangi hisobda bo'sh).

## 4 · Uch risk  ← QTushuncha (ketma-ket 3 karta — SABOQ 9, E 53)
- Eyebrow: Tushuncha · uch risk
- Sarlavha: **Buzilsa, demo nima ko'rsatishi kerak?** (37)
- Mentor: Har karta uchun Mentorning kutishini tanlang: ekranda aniq nima ko'rinadi? (74)
- Bashorat yo'q — har kartada o'quvchining o'zi tanlaydi (P-064: bashorat kuzatuv ekranida majburiy; bu darsda bashorat 2-ekranda).
- Vizual (≤ 3 blok: risk kartasi va variantlar · `DemoSahna` · yozuv kartasi): **chapda** — joriy risk kartasi («Risk n / 3»): tepada hodisa qatori (katta), ostida kulrang yorliq — risk nomi; kartada uch variant ·
  **o'ngda** — `DemoSahna` (o'sha riskning sahnasi) va ostida Mentor buzish yozuvi kartasi — «Nima kutdim» qatorlari bo'sh, accent uzuq ramkada; ustida kulrang yorliq «Mentorning kutishi — natija emas».
- Kartalar (navbat bilan; hodisa qatori → risk nomi → variantlar; ✔ matni — A-6 «Nima kutdim» aynan):
  1. Zalda internet bir lahzaga uzilishi mumkin. (43) · yorliq «tarmoq uzilishi» · sahna: telefonda samolyot belgisi, belgi «Ulanmoqda…»
     - ✔ Belgi «Ulangan» bo'lgach, telefonda «9 / 10» ko'rinadi (54)
     - Internet uzilsa ham demo hakamga yaxshi ko'rinadi (49)
     - Demodan oldin zal Wi-Fi'ini tekshirib qo'yaman (46)
  2. Yangi e'lon qilingan o'yinda hali hech kim yo'q. (48) · yorliq «bo'sh ma'lumot» · sahna: laptopda «Juma, 18:00 · Mahalla maydoni» e'loni, son joyi bo'sh
     - Yangi o'yin sahifasi chiroyli va tez ochiladi (45)
     - ✔ O'yinda «0 / 10» va «Qo'shilaman» ko'rinadi, ekran oq emas (58)
     - Demodan oldin hamma o'yinga odam qo'shib qo'yaman (49)
  3. Hayajonda tugma tez ikki marta bosilishi mumkin. (48) · yorliq «ikki marta bosish» · sahna: laptopda «Qo'shilaman» ustida ikki kichik doira (ikki bosish)
     - Tugmani sekin, bir marta bosishni mashq qilaman (47)
     - Tugma bosilganda hammasi to'g'ri ishlaydi (41)
     - ✔ Bitta qo'shilish: son bir marta o'zgaradi, «9 / 10» (51)
- **Harakat → Vizual o'zgarish:** to'g'ri variant → u kartadan yozuv kartasining «Nima kutdim» qatoriga uchadi (accent uzuq ramka, ~1 s yashil); sahnada kutilgan holat uzuq ramka ichida ko'rinadi (1 — belgi «Ulangan», «9 / 10» · 2 — «0 / 10» va «Qo'shilaman» · 3 — tugma bir marta holatini o'zgartiradi, son bir marta o'sadi); keyingi risk kartasi kiradi.
  Xato → variant silkinadi, bir lahza `err`, bitta `QXato` (≤60; javobni aytmaydi):
  - mavhum variant (1-karta 2, 2-karta 1, 3-karta 2): Buni ekranda qaysi son yoki yozuv ko'rsatadi? (45)
  - oldini olish varianti (1-karta 3, 2-karta 3, 3-karta 1): Bu — riskning oldini olish. Buzilsa, demo nima ko'rsatadi? (58)
  3/3 dan keyin: karta yopiladi, yozuv kartasi (uch «Nima kutdim» qatori, usul nomlari bilan) va sahna butun enga (⛶).
- Natija (bitta blok — E 42): yashil xulosa qutisi.
- Xulosa: Bu misolda kutish ekrandagi narsani aytadi: belgi, son yoki tugma. U buzishdan oldin yoziladi. (94)
- `QIzoh` (qutining oxirgi kichik qatori): «Yaxshi ishlaydi» deb yozilsa, keyin natija bilan solishtirib bo'lmaydi. (72)
- Tugma (pastki): Kutishlarni tanlang (N/3) → Davom etish
- Ipucha (40 s): Shu kutishni ekranga qarab tekshirsa bo'ladimi? (47)
- Keyingi bosiladigan joy: uch variant (har birining yengil chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Clear Expectation! (uch karta birinchi urinishda).
- O'qituvchi eslatmasi: Uch risk — dasturdagi demo-risklar ro'yxati. 6-darsdagi risklar ro'yxatida — risk bo'lmasligi uchun nima qilinadi; bugun — buzilganda demo nima ko'rsatishi kerak (kutish). Ikkalasi kerak, lekin bir narsa emas.
  Mentor misolining natijasi — Amaliyot 1 dan keyin; kutish — natija emas. **Buzish — faqat o'z mahsulotida:** boshqa odamning ilovasi yoki sayti buzib ko'rilmaydi.
✎ Har karta — avval hodisa, keyin nom (T-011). Distraktorlar ikki xil: mavhum (ekranda tekshirib bo'lmaydi) va oldini olish (rost va foydali, lekin kutish emas). ✔ o'rni kartalarda har xil (1, 2, 3). «darhol» yo'q — 4-darsdagi «bosish javobi» kutishda «son bir marta» bilan.

## 5 · Kutishlaringiz  ← QMustaqil (USTAXONA — ketma-ket karta, 3 qism; SABOQ 9, 13, 29, E 43, E 53)
- Eyebrow: Mustaqil ish
- Sarlavha: **Demongizda har riskdan nima kutasiz?** (36)
- Mentor: «Nima qilaman» tayyor — demo yo'lingizga moslang, «Nima kutaman»ni o'zingiz yozing. (83)
- Tepada raqamli doiralar 1/2/3 (risk nomlari: Tarmoq uzilishi · Bo'sh ma'lumot · Ikki marta bosish; joriy — accent, tayyori ✓). Ostida kulrang qator (faqat `pm-m12d6-demo.stsenariy` bo'lsa): «Demo stsenariyingiz: {1-qadam} · {2} · {3} · {4} · {5}». Kalit yo'q — qator ko'rinmaydi.
- **Bitta katta karta (joriy qism)** — ikki maydon (yorliq input ichida — raqam belgisi va qisqa savol, E 43):
  1. **Nima qilaman** — oldindan yozilgan, tahrirlanadi (bitta manba `USULLAR`):
     - tarmoq: Telefonda uchish rejimini yoqaman; demo harakatini laptopda qilaman; keyin uchish rejimini o'chiraman. (102)
     - bosh: Agent tekshiruv akkauntida hali bo'sh yozuv ochadi; uni demo yo'limda ochaman. (78)
     - ikki: Demo yo'limdagi asosiy tugmani tez ikki marta bosaman. (54)
  2. **Nima kutaman** — bo'sh; placeholder Ekranda aniq nima ko'rinadi? (28)
  Karta ostida tugmalar bir qatorda: «Keyingi risk» (asosiy; uchinchi kartada — «Saqlash») · o'ngda «Yordam».
- Yordam (bosilsa ochiladi; Mentor misolidan, A-6): Mentor misolida: (1) Belgi «Ulangan» bo'lgach, telefonda «9 / 10» ko'rinadi · (2) O'yinda «0 / 10» va «Qo'shilaman» ko'rinadi, ekran oq emas · (3) Bitta qo'shilish: son bir marta o'zgaradi, «9 / 10».
  Mahsulotingizda ulanish belgisi bo'lmasa — internet qaytgach sahifani yangilaysiz: kutish — yangi holat ko'rinadi. «Bo'sh» — demo yo'lingizdagi hali hech narsa yozilmagan joy: yangi ro'yxat, bo'sh profil, odamsiz o'yin.
- Tekshiruv (`QXato`, ≤60; «Keyingi risk» yoki «Saqlash» bosilganda):
  - «Nima kutaman» bo'sh (bloklaydi): Nima kutishingizni yozing: ekranda nima ko'rinadi? (50)
  - «yaxshi», «to'g'ri», «ishlaydi», «normal» bor va son ham, «» qo'shtirnoq ham yo'q (yumshoq): Buni ekranda qanday ko'rasiz? Son yoki yozuvni ayting. (54)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana bosing. (35)
- **Harakat → Vizual o'zgarish:** «Keyingi risk» → karta ixcham qatorga yig'ilib tepaga tushadi (risk · kutish — uzun matn qisqartiriladi, SABOQ 29); keyingi karta kiradi; «Saqlash» → uch qator bitta ixcham qator bo'ladi: «Kutishlar · 3 ✓» (SABOQ 17); o'ngdagi yozuv kartasining «Nima kutdim» qatorlariga o'quvchi matni yoziladi.
  Saqlangan qism ✎ bilan qayta ochiladi (o'sha tekshiruvlar bilan).
- Xulosa (saqlagach): Kutishlar yozildi — buzgach, nima bo'lganini shu kartalar yoniga yozasiz. (73)
- Saqlash: `pm-m12d7-tekshiruv.urinishlar` — uchta yozuv `{ usul, qildim, kutdim, boldi: '', buzildi: null, tuzatishQilindi: false, qayta: null }` (tartib: `tarmoq` · `bosh` · `ikki`); `otishlar: [null, null, null]`, `bReja: null`, `savedAt`. Kalit oldin bor bo'lsa — kartalar to'ldirilgan holda ochiladi.
- Tugma (pastki): Kutishlarni yozing (N/3) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: joriy maydon (accent chegara, to'lqin) → «Keyingi risk» / «Saqlash».
- Artefakt-strip (U-042): shu ekrandan — «Demo tekshiruvi · 3 usul» (ixcham); 6, 7-ekranlarda ko'rinadi; test, arena, podium va yakunda yo'q (E 50).
- Nishon yo'q (saqlash — Mentorga signal). Mentor rejimi: forma o'rniga Mentor yozuvining «Nima qildim» va «Nima kutdim» qatorlari (A-6). Mentor statistikasi: «Kutishlar saqlandi».
- O'qituvchi eslatmasi: 7 daqiqa. Eng ko'p xato — kutishga «ishlaydi» yozish: «Ekranda qaysi son yoki yozuv?» deb so'rang. Ikki marta bosishda — demo yo'lidagi asosiy tugma (Mentor misolida «Qo'shilaman»). Kutish buzishdan **oldin** yoziladi — natijani ko'rgach moslab qo'yilmaydi.
✎ Kutish buzishdan oldin (12-Modul 5-dars qoidasi). «Nima qilaman» — umumiy qolip emas: o'quvchi o'z demo yo'liga moslaydi (sinf 4, 13). Kalitga shaxsiy ma'lumot yozilmaydi (rol bilan: «tekshiruv akkaunti», «telefon»).

## 6 · Amaliyot 1 — buzing, tuzating, qayta tekshiring  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈30 daq)
- Eyebrow: Amaliyot 1 · o'z mahsulotingiz
- Sarlavha: **Demongizni uch usulda buzing, topilganini tuzattiring.** (54)
- Mentor: Buzish va yozuv — sizda, tuzatish — agentda; «1 · Ochish»dan boshlang. (70)
- Model (tayanch 1.7, 13-Modul 12-dars): to'rt qadamning hammasi o'quvchining o'z mahsulotida va repo'sida, o'z trekida; Mentor misoli — namuna (o'ngda kutilgan natija, `{…}` yonida kulrang «masalan: …», «Yordam»da Mentor misolidagi to'liq talab).
  Talab zinapoyasi: 1-qadam — tayyor talab + bitta joy (`{bo'sh holat}`) · 3-qadam — tayyor talab + ikki joy (ikkalasi oldindan) · 4-qadam — tayyor talab + yozuv oldindan.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — demo yo'lingizni laptop brauzerida oching (mobil trekda — brauzer ko'rinishi, web-trekda — saytingiz) va demo yo'lidagi hisobingiz bilan kiring; telefonda ham o'sha demo yo'lini brauzerda oching. <!-- TAXMIN T8 -->
     Backend'ni 6-darsdagidek bitta so'rov bilan uyg'oting. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin.
     **Buzish — faqat o'z mahsulotingizda: boshqa odamning ilovasi yoki sayti va haqiqiy foydalanuvchining hisobi ishlatilmaydi.** 6-darsdan yangi funksiya to'xtatilgan — bugun faqat tuzatish.
     Kulrang qator (faqat `pm-m12d6-demo.uygotish` `true` bo'lmasa): Backend uxlab qolgan bo'lsa, birinchi ochilish bir daqiqagacha cho'zilishi mumkin. (82)
     Keyin tekshiruv akkaunti uchun — qavsni to'ldiring (yonida kulrang namuna), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: Database — faqat o'zing ochadigan tekshiruv akkaunti va uning yozuvlari. Kod va fayllarni o'zgartirma.
     > Nima qilsin: demo tekshiruvi uchun bitta tekshiruv akkaunti och: namuna ism va login bilan, haqiqiy emas, foydalanuvchilar sanog'iga tushmaydigan. Loginini ayt. Shu akkauntdan {bo'sh holat} tayyorla. Qaysi yozuvlarni yaratganingni `id` lari bilan ayt. «O'chir» desam — faqat shu `id` lardagi yozuvlarni o'chir.
     > Nima buzilmasin: kod, `.env` va haqiqiy foydalanuvchilarning hisoblari va yozuvlariga tegma. Hech narsani tuzatma — men hozir faqat tekshiryapman. Nima o'zgartirganingni ayt.
     Qavs yonida kulrang namuna (Mentor misolidan): {bo'sh holat} — «masalan: yangi o'yin e'lon qil, hali hech kim qo'shilmagan bo'lsin».
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: Database — faqat o'zing ochadigan tekshiruv akkaunti va uning yozuvlari. Kod va fayllarni o'zgartirma.
     > Nima qilsin: demo tekshiruvi uchun bitta tekshiruv akkaunti och: namuna ism va login bilan, haqiqiy emas, `namuna = true`. Loginini ayt. Shu akkauntdan yangi o'yin e'lon qil: «Juma, 18:00 · Mahalla maydoni», hali hech kim qo'shilmagan bo'lsin. Qaysi yozuvlarni yaratganingni `id` lari bilan ayt. «O'chir» desam — faqat shu `id` lardagi yozuvlarni o'chir.
     > Nima buzilmasin: kod, `.env` va haqiqiy foydalanuvchilarning hisoblari va yozuvlariga tegma. Hech narsani tuzatma — men hozir faqat tekshiryapman. Nima o'zgartirganingni ayt.
  2. **Buzish** — chapda 5-ekrandagi uch kartangiz, bittadan (SABOQ 9, E 53): «Nima qilaman» va «Nima kutaman» — tayyor (tahrirlanadi); bajaring va **«Nima bo'ldi»** qatoriga ko'rganingizni yozing; belgi: **«Buzildi»** · **«Buzilmadi»**.
     Belgilar ostida kulrang qator: «Buzilmadi» — shu urinishda kutilgani bo'ldi; boshqa safar ham shunday degani emas. (83)
     (1) **Tarmoq uzilishi** — telefonda demo yo'lining o'sha ekranini oching va uchish rejimini yoqing (ulanish belgisi bo'lsa — «Ulanmoqda…» bo'lishini kuting, bir daqiqagacha). Laptopda demo harakatini qiling, keyin telefonda uchish rejimini o'chiring va telefonga qarang.
     (2) **Bo'sh ma'lumot** — laptopda demo yo'lini yangilang va agent tayyorlagan bo'sh yozuvni oching; ekranga qarang.
     (3) **Ikki marta bosish** — laptopda demo yo'lidagi asosiy tugmani tez ikki marta bosing; son, ro'yxat va tugmaga qarang. Birinchi safar hech narsa chiqmasa — yana bir-ikki marta qaytaring va ko'rganingizning hammasini «Nima bo'ldi» ga yozing.
     Har urinishdan keyin demo holatini boshiga qaytaring (Mentor misolida — laptopda o'yindan chiqish: yana «8 / 10»).
     Xato chiqsa — bu ham natija: uni «Nima bo'ldi» qatoriga yozing. Agentga faqat xato qatorini yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Nima bo'lganini ayt, hech narsani o'zgartirma.»
     Shart xabarlari (≤60): belgi bosilganda «Nima bo'ldi» bo'sh bo'lsa — Belgidan oldin nima ko'rganingizni yozing. (42)
  3. **Tuzatish** — «Buzildi» belgili urinish bo'lsa (hech biri bo'lmasa — bu qadamni o'tkazib yuboring: 4-qadamda faqat `XATOLAR.md`):
     qavslarni tekshiring (tahrirlasangiz bo'ladi), «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: buzish yozuvidagi muammoga tegishli fayllar — avval sababini top, keyin faqat kerakli joyni o'zgartir.
     > Nima qilsin: pastdagi yozuvda «buzildi» belgili har urinishni tuzat: demo «Nima kutdim» qatoridagidek ishlasin. Har muammoning sababini bir gap bilan ayt va qaysi faylni o'zgartirganingni ayt.
     > {buzish yozuvi}
     > Nima buzilmasin: yangi funksiya, yangi tugma yoki yangi ekran qo'shma — faqat shu muammoni tuzat. Demo stsenariysi avvalgidek ishlasin: {demo stsenariysi}. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar: {buzish yozuvi} — 2-qadam kartalaridan oldindan (faqat «Buzildi» urinishlar; har biri: «N · {usul}. Nima qildim: … Nima kutdim: … Nima bo'ldi: …») · {demo stsenariysi} — `pm-m12d6-demo.stsenariy` dan, besh qadam bir qatorda (yo'q bo'lsa — bo'sh, kulrang «masalan: kirish, o'yinlar ro'yxati, qo'shilish, ikkinchi telefonda son, "Hozir ko'ryapti"»).
     Yordam — Mentor misolidagi to'liq talab: ⛔ «qur» pilotidan keyin yoziladi — qaysi urinish buzilgani haqiqiy natijadan; shakli yuqoridagidek, `{…}` o'rnida Mentor yozuvi (A-6) va stsenariysi. Buzilgan urinish bo'lmasa — Yordamda shu qadam yo'qligi aytiladi.
     Agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; terminalda `git diff`: yangi tugma, yangi ekran yo'q. Yangi narsa bo'lsa — agentga: «{nima} — yangi funksiya. Uni olib tashla, faqat tuzatish qolsin.»
     Agent har muammo uchun qaysi faylni o'zgartirganini aytgan va u `git status` da ko'ringan bo'lsa — o'sha urinishga **«Tuzatish qilindi»** ni belgilang: bu ish fakti; to'g'riligini 4-qadam ko'rsatadi.
     `git add <fayl>` (`git add .` emas) → `git commit -m "demo tekshiruvi: tuzatish"` → `git push`. Yangi versiya — o'zgargan qismga qarab:
     `backend/` — Render'da yangi versiya (bir necha daqiqa cho'zilishi mumkin) · mobil trekda `mobil/` — brauzer ko'rinishini qayta eksport qiling (`npx expo export -p web` → `netlify deploy --prod --dir dist`) · web-trekda — push'dan keyin Netlify saytni odatda o'zi yangilaydi.
     Kutayotganda boshqa urinish yozuvini o'qing. Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Qayta tekshirish** — «Tuzatish qilindi» belgili har urinishni **o'sha usul bilan** qaytaring (demo yo'lini yangilab). Tanlang: **«Qayta tekshiruvda takrorlanmadi»** · **«Qayta tekshiruvda yana buzildi»**.
     Yana buzilsa — agentga bir marta: «{usul} qayta tekshiruvda yana buzildi: {nima bo'ldi}. Tuzat, yangi narsa qo'shma, o'zgargan fayllarni ayt.» → push → o'sha usul bilan yana bir marta. Ikkinchi marta ham buzilsa — `XATOLAR.md` da «qoldi».
     Keyin «Nusxalash» bilan Antigravity'ga:
     > Loyiha ildizidagi `XATOLAR.md` ga «## Demo tekshiruvi» bo'limini qo'sh (fayl bo'lmasa — yarat): pastdagi yozuvimni so'zma-so'z ko'chir. «Buzildi» belgili har urinish — usul nomi va uch qator: usul (nima qildim), natija (nima kutdim va nima bo'ldi), holat — men yozgandek. Oxirida bir qator: buzilmagan usullar. Faylning qolgan qismiga va boshqa fayllarga tegma.
     > {to'liq yozuv}
     `XATOLAR.md` ni yozuvingiz bilan solishtiring; mos bo'lsa — `git add XATOLAR.md` → `git commit -m "demo tekshiruvi"` → `git push`.
     Oxirida agentga: «Tekshiruv akkauntini va u yaratgan yozuvlarni `id` lari bo'yicha o'chir — faqat bugun aytgan `id` laringni. Qaysilari o'chganini ayt.» Agentning «o'chirdim» degani — uning so'zi: demo yo'lida bo'sh yozuv yo'qligini o'zingiz ko'rasiz.
     Qavs: {to'liq yozuv} — 2–4-qadamlardan oldindan (har urinish: usul, uch qator, belgi, «Tuzatish qilindi» va qayta tekshiruv natijasi yoki «qoldi — {sabab}»; sababni o'quvchi yozadi, kulrang «masalan: vaqt yetmadi»).
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (≤ 3 blok): Mentor buzish yozuvining uch kartasi (A-6): «Nima qildim» va «Nima kutdim» to'liq; «Nima bo'ldi», belgi va «Tuzatishdan keyin» — ⛔ «qur» pilotida haqiqiy natijadan (MD da `{…}`; buzilishi ham, buzilmasligi ham mumkin) ·
  ostida fayl kartasi `XATOLAR.md` — sarlavha «## Demo tekshiruvi», ichi ⛔ pilotdan (shakli — 13-Modul 12-darsidagidek: usul · natija · holat; oxirida «Buzilmagan usullar: …») · tepada kichik sahna: laptop brauzeri va telefon.
  Web-trekda: o'sha kartalar, brauzerda o'quvchi sayti `….netlify.app`.
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - «Buzildi» bor edi, hammasi «qayta tekshiruvda takrorlanmadi»: Tuzatish qilindi — qayta tekshiruvda takrorlanmadi. (51)
  - «Buzildi» yo'q edi: Uch usul tekshirildi — bu safar demo buzilmadi. (47)
  - «yana buzildi» yoki «qoldi» bor: Tuzatish qilindi — bitta urinish hali ochiq, u `XATOLAR.md` da. (63)
- Saqlanadi: `pm-m12d7-tekshiruv.urinishlar[i].qildim`, `.kutdim`, `.boldi`, `.buzildi` (2-qadam) · `.tuzatishQilindi` (3-qadam) · qayta tekshiruv — `.qayta` (4-qadam; tayanch 8, F-1008-556).
- Pastki qator (kichik; darsda bir marta — tayanch 3): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m14-dars-07-done` —
  oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi. `backend/.env` va `mobil/.env` ga o'z qiymatlaringizni yozasiz. <!-- TAXMIN T4 -->
- Ulgurmasangiz: uch urinish belgilangach (2-qadam) «Davom etish» ochiladi — Amaliyot 2 ga o'ting; 3, 4-qadam — uyga vazifa ①. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: tuzatishni agent qiladi, sababni u aytadi (sinf 13); «Tuzatish qilindi» — ish fakti, natija — 4-qadamda (sinf 5). Tekshiruv akkauntini agent ochadi va `id` bo'yicha o'chiradi (sinf 10); bo'sh holat — faqat shu akkauntda (haqiqiy yozuvga tegilmaydi).
  Tarmoq uzilishi — telefonda (uchish rejimi): laptop internetini uzish dars sahifasini ham uzadi (12-Modul 5-dars saboqi); laptopning o'zi uzilganda nima qilinishi — Amaliyot 2 dagi B reja o'tishi (TAYANCHGA SAVOL 3).
- O'qituvchi eslatmasi: Mentor misolida natija — Mentor repo'sida tekshirilgan haqiqiy yozuv (⛔ «qur»); o'quvchida boshqacha bo'lishi tabiiy. Telefon brauzeri uchish rejimidan keyin sahifani qayta yuklasa, 1-urinishda muammo ko'rinmay qolishi mumkin — urinish baribir yoziladi (Shubhali 3).
  Push'dan keyin brauzer ko'rinishi o'zi yangilanmaydi — mobil trekda qayta eksport shart, aks holda qayta tekshiruv eski kodni ko'radi.

## 7 · Amaliyot 2 — uch demo o'tishi va B reja  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈22 daq)
- Eyebrow: Amaliyot 2 · o'z demongiz
- Sarlavha: **Demoni boshidan oxirigacha uch marta o'ting.** (44)
- Mentor: Taymerni yoqib, stsenariy bo'yicha o'ting — ikkinchi o'tishda B rejaga o'tasiz; «1 · Ochish»dan boshlang. (105)
- Model: to'rt qadam o'quvchining o'z demosida; agent kerak emas (xato chiqsa — Amaliyot 1 dagi tuzatish talabi). O'ngda «kutilgan natija · namuna: Maydon Jamoa». Sherik — hakam o'rnida, ixtiyoriy.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»):
  1. **Ochish** — chapda demo stsenariyingiz (5 qadam; `pm-m12d6-demo.stsenariy` dan — kalit yo'q bo'lsa shu yerda besh qatorni yozasiz, kulrang namuna — Mentor stsenariysi). Laptopda demo yo'li ochiq, telefonda — ikkinchi qurilma. <!-- TAXMIN T8 -->
     Backend'ni yana uyg'oting — Amaliyot 1 dan keyin 15 daqiqadan ko'p o'tgan bo'lishi mumkin. B reja videosini laptopda ochishga tayyorlab qo'ying (6-darsda yozgansiz).
     Kulrang qator (`pm-m12d6-demo.video` `true` bo'lmasa — tanlov «Video bor» · «Video hali yo'q»; «yo'q» tanlansa): Video hali yo'q — ikkinchi o'tishni B rejasiz o'ting, videoni uyda yozasiz. (75)
     Sherik bo'lsa — u laptop ekraniga qarab, hakam o'rnida o'tirsin; ismi hech qayerga yozilmaydi.
  2. **1-o'tish** — «Taymer»ni bosing va stsenariy bo'yicha demo qiling; har qadamdan keyin chapdagi qadamni bosib belgilang (✓). Oxirida: **«Xatosiz»** · **«Xato bilan»** (bosilsa — «Nima bo'ldi» bir qator).
     Keyin demo holatini boshiga qaytaring (Mentor misolida — o'yindan chiqish: yana «8 / 10»).
  3. **2-o'tish — B reja bilan** — «Taymer» va stsenariy; 3-qadamga yetganda internet uzildi deb hisoblang: B reja gapini ayting va laptopda videoni oching, oxirigacha ko'rsating.
     Belgilang: **«Video ochildi»** · **«Video ochilmadi»**; o'tish: **«Xatosiz»** · **«Xato bilan»**. Mentor misolida B reja gapi: «Internet uzildi — shu demoning 60 soniyalik videosini ko'rsataman.» <!-- TAXMIN T8 -->
  4. **3-o'tish va tekshirish** — oxirgi jonli o'tish, taymer bilan; belgilang. Keyin uch qatorni o'qing: «Xato bilan» bo'lsa — o'sha qadamni buzish yozuvi bilan Amaliyot 1 dagi tuzatish talabiga bering (vaqt bo'lsa) yoki `XATOLAR.md` ga «qoldi» deb, sababi bilan yozing. «Saqlash».
  Taymer: chizig'i stsenariy ostida; o'tish vaqti ko'rinadi, lekin saqlanmaydi — «Xatosiz» vaqtga qarab emas, beshala qadam rejadagidek o'tganiga qarab belgilanadi (TAYANCHGA SAVOL 7).
  Shart xabari (≤60): «Xato bilan» bosilib, «Nima bo'ldi» bo'sh bo'lsa — Qaysi qadamda nima bo'lganini bir qatorda yozing. (49)
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (≤ 3 blok; bir marta o'zi yuradi): stsenariy chizig'i (5 qadam, A-6) va taymer chizig'i «Mentor rejasi: 60–90 soniya» · uch o'tish qatori: «1-o'tish · {⛔}» · «2-o'tish · B reja: video · {⛔}» · «3-o'tish · {⛔}» — ⛔ «qur» pilotida haqiqiy natijadan ·
  ostida B reja kadri: laptopda video oynasi «60 soniya», tepada pufak — B reja gapi (A-6).
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - uchala «Xatosiz» va «Video ochildi»: Demo uch marta xatosiz o'tdi, B reja ochildi. (45)
  - boshqasi: Uch o'tish belgilandi — xato bo'lgan joy yozuvda turibdi. (57)
- Saqlanadi: `pm-m12d7-tekshiruv.otishlar[0..2]` (2, 3, 4-qadam) · `.bReja` (3-qadam) — A-12.
- Ulgurmasangiz: 1-o'tishdan keyin (2-qadam) «Davom etish» ochiladi; qolgan o'tishlar — uyga vazifa ①. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Nishon (bonus): Three Runs! — 4-qadam «Bajardim»ida, uchala o'tish belgilangan bo'lsa (natijadan qat'i nazar — tavsif qilingan ishni aytadi; 152).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: B reja — ikkinchi o'tishda (oxirgi o'tish jonli bo'lsin; TAYANCHGA SAVOL 6). «Xatosiz» — o'quvchining o'z belgisi (sinf 10); yashil «xatosiz o'tdi» faqat uchala «Xatosiz» va video ochilganda (sinf 6). «Demo buzilmaydi» deyilmaydi (sinf 5).
- O'qituvchi eslatmasi: Har o'tishdan keyin demo holati boshiga qaytariladi (Mentor misolida — o'yindan chiqish, «8 / 10»). Taymer — mashq uchun: Mentor rejasi 60–90 soniya; oshsa — qaysi qadam cho'zilganini so'rang.
  Sherik hakam o'rnida — ixtiyoriy; kim kimdan tez o'tgani sanalmaydi. B reja videosi laptopda turadi va hech qayerga yuklanmaydi.

## 8 · Yakuniy savol  ← QTest (✔ C, `correctIdx 2`; ikki blok birga — tuzatish va demo o'tishi; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy savol (savol ustida yorliq yo'q)
- Savol: **Tuzatishdan keyin demo xatosiz o'tdi. Ikki marta bosish muammosi takrorlanmaydimi?** (82)
  - A — Takrorlanmaydi — demo boshidan oxirigacha o'tdi (47)
  - B — Takrorlanmaydi — agent qaysi faylni aytib berdi (47)
  - ✔ C — Bilmayman — tugmani yana ikki marta bosaman (43)
  - D — Muhim emas — demoda tugmani bir marta bosaman (45)
- Kalit: **C** (index 2). To'rttalasi «… — …» shaklida (tire hamma variantda); «ikki marta» — savolda va C da (kalit so'z faqat to'g'rida emas — savolning o'z so'zi); uzunlik — «O'lchov».
  Distraktorlar uch xil turkum: A — demo o'tishi (oddiy yo'l, tugma bir marta bosiladi) · B — agentning so'zi (da'vo) · D — riskni chetlab o'tish (zalda hayajon).
- To'g'ri izohi: Qayta tekshiruv o'sha usul bilan: yana ikki marta bosiladi. (59)
- Xato izohlari (≤60):
  - A: O'tishda tugma necha marta bosildi? (35)
  - B: Agentning aytgani — da'vo. Natijani kim ko'radi? (48)
  - D: Zalda hayajonda kim qanday bosishini bilasizmi? (47)
  - (umumiy) Qayta tekshiruv qaysi usul bilan qilinadi? (42)
- Javob topilgach (kichik): yozuv kartasining «3 · Ikki marta bosish» qatori yonida «qayta tekshiruv» joyi accent uzuq ramka bilan yonadi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol ekrandan ko'chirilmaydi (§106): Amaliyot 1 da qayta tekshiruv yo'li bor, savol esa demo o'tishi va qayta tekshiruv farqini so'raydi (2-ekran fikri amaliyotdan keyin). Arena 7, 8 bilan kalit ibora takrorlanmaydi (S-008).
  «Bilmayman» — halol javob: qayta tekshiruvsiz natija noma'lum (sinf 5). Savol Mentor natijasini ochmaydi — urinish sharti umumiy.

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 2 savol (3, 8); 2, 4-ekranlar — ballsiz, nishon bilan; 5, 6, 7-ekranlar «Saqlash» / «Bajardim» — Mentorga signal (`PRACTICE_BASE`, ball yo'q).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Bo'sh holatni qanday bilasiz» · 8 — «Yakuniy — qayta tekshiruv»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi (qolip; o'zgartirilmaydi)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi yengil accent chegara bilan (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha (holatga qarab — P-046, E 54; ✓ va nishon — faqat birinchi holatda; sarlavha o'quvchi qilgan ishni aytadi; ustunlik tartibi — yuqoridan):
  - Amaliyot 1 va 2 bajarilgan; har «Buzildi» urinish «qayta tekshiruvda takrorlanmadi» (yoki «Buzildi» yo'q); uchala o'tish «Xatosiz»; «Video ochildi»: **Demo uch marta xatosiz o'tdi, B reja ochildi.** (45)
  - Amaliyot 2 bajarilgan, lekin «Xato bilan» o'tish, video ochilmagan, qayta tekshiruv tugamagan yoki «qoldi» bor: **Uch o'tish belgilandi — hali tugamagan ish bor.** (47)
  - Amaliyot 1 bajarilgan, Amaliyot 2 yo'q: **Demo buzib tekshirildi — uch o'tish qoldi.** (42)
  - kamida bitta urinishda «Nima bo'ldi» yozilgan, Amaliyot 1 to'liq emas: **Buzish boshlandi — qolgan usullar va o'tishlar qoldi.** (53)
  - hech bir urinishda «Nima bo'ldi» yo'q: **Demo hali buzib tekshirilmagan — uyda boshlang.** (47)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yo'q (E 50; fikr A-2 da — darsning ichki o'qi).
- Endi siz bilasiz (T-048 — asosiy fikr so'zma-so'z takrorlanmaydi; 2-qator — ta'rif, T-042):
  - Demo o'tishi oddiy sharoitni ko'rsatadi: internet bor, ma'lumot bor, tugma bir marta bosiladi. (94)
  - Demoni ataylab buzib, hakam nimani ko'rishini oldindan bilish — demo tekshiruvi. (80)
  - Bu darsdagi uch risk — tarmoq uzilishi, bo'sh ma'lumot va ikki marta bosish. (76)
  - Kutish ekranda ko'rinadigan narsani aytadi va buzishdan oldin yoziladi. (71)
  - «Tuzatish qilindi» — ish fakti; natijani o'sha usul bilan qayta tekshiruv ko'rsatadi. (85)
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: o'z demongiz · Nechta: ikki ish · Muddat: keyingi darsgacha
  - ① Darsda qolgan ishni tugating: {holatga qarab — qolgan usullarni buzib yozing · tuzatish va qayta tekshiruvni tugating, `XATOLAR.md` ni yangilang · qolgan demo o'tishlarini taymer bilan qiling · B reja videosini yozing (kompyuteringizdagi ekran yozish vositasi bilan, 60 soniya)}. Hammasi tugagan bo'lsa ① ko'rinmaydi.
  - ② Bitta tanish odamga — ota-onangiz yoki sinfdoshingizga — demongizni bir marta ko'rsating. Undan so'rang: «Nima ekani bir qarashda bilindimi?» Bilinmagan joyni yozib qo'ying.
  - Karta ostida (bitta kulrang qator): Uning ismi hech qayerga yozilmaydi; video telefonda yoki kompyuterda qoladi. (76)
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Final pitchingiz 5 daqiqaga tayyormi?» <!-- TAXMIN T20 -->
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18). Artefakt-strip yakunda yo'q (E 50).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): uyga vazifada keyingi darslar aytilmaydi (T-038). ② — bitta tanish odam, tanish doira (TAQIQLAR 3); «sinov» so'zi o'quvchi matnida ishlatilmadi — «ko'rsating», «so'rang». ② — 2-ekrandagi ikkinchi savol (bir qarashda) real odamda. Uyga vazifa yengil: ① faqat qolgan ish bo'lsa (sinf 14).
  Yakun sarlavhalari kalitdan va dars holatidan yig'iladi: `urinishlar[].boldi`, `.buzildi`, `.tuzatishQilindi` · `urinishlar[].qayta` · Amaliyot 1 va 2 bayrog'i (4-qadam «Bajardim») · `otishlar`, `bReja` (P-046).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Investor Eye!** (2-ekran, uch savol birinchi urinishda) — Demo o'tishi javob bermaydigan savolni topdingiz (48)
- **Empty Check!** (3-ekran, 1-savol birinchi urinishda) — Bo'sh holatni qanday ko'rishni topdingiz (40)
- **Clear Expectation!** (4-ekran, uch karta birinchi urinishda) — Ekranda ko'rinadigan kutishni tanladingiz (41)
- **Three Runs!** (7-ekran, 4-qadam «Bajardim»; uchala o'tish belgilangan — bonus) — Uch demo o'tishini belgiladingiz (32)
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (Three Runs!, ish qilingan ekranda — P-048); natija «Xato bilan» bo'lsa ham beriladi (tavsif belgilashni aytadi, «xatosiz» demaydi). Yakuniy savol nishonsiz. Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 08.10 — 0).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **3 · Bo'sh holatni qanday bilasiz** — 1 Demo o'tishi oddiy sharoitda: internet bor, ma'lumot bor. · 2 Bo'sh holatni ataylab yaratasiz — masalan, yangi hisob bilan. · 3 Keyin ekranda nima chiqqanini o'zingiz ko'rasiz.
  — Sinfga savol: Demongizda qaysi joy hali bo'sh holatda ko'rilmagan?
- **8 · Qayta tekshiruv** — 1 «Tuzatish qilindi» — kodda o'zgartirish qilindi. · 2 Natijani o'sha usul bilan qayta buzib ko'rasiz. · 3 Demo o'tishida tugma bir marta bosiladi — ikki marta bosish u yerda ko'rinmaydi.
  — Sinfga savol: Ikki marta bosishni qayta tekshirish uchun nima qilasiz?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Demo tekshiruvi nima? | Demoni ataylab buzib, hakam nimani ko'rishini oldindan bilish | O'z mahsulotingizda |
| Bu darsda demo qaysi uch savol bilan ko'riladi? | Jonli ishlaydimi, bir qarashda bilinadimi, buzilsa nima bo'ladi | Uchinchisiga demo o'tishi javob bermaydi |
| Demo o'tishi nimani ko'rsatmaydi? | Buzilganda ekranda nima bo'lishini | O'tish oddiy sharoitda bo'ladi |
| Bu darsdagi uch risk qaysilar? | Tarmoq uzilishi, bo'sh ma'lumot, ikki marta bosish | Dasturdagi demo-risklar ro'yxati |
| Tarmoq uzilishini qanday buzib ko'rasiz? | Telefonda uchish rejimini yoqib, laptopda demo harakatini qilasiz | Internet qaytgach telefonga qaraysiz |
| Tekshiruv akkauntini kim ochadi? | Agent — namuna ism va login bilan, haqiqiy emas | Bo'sh holat shu hisobda tayyorlanadi |
| Yaxshi kutish nimani aytadi? | Ekranda ko'rinadigan narsani: belgi, son yoki tugma | «Yaxshi ishlaydi» — kutish emas |
| Kutish qachon yoziladi? | Buzishdan oldin | Keyin natija bilan solishtiriladi |
| Riskning oldini olish va kutishning farqi nima? | Oldini olish — demodan oldingi ish; kutish — buzilganda demo nima ko'rsatishi | Ikkalasi kerak, lekin bir narsa emas |
| «Tuzatish qilindi» nimani bildiradi? | Kodda o'zgartirish qilinganini | Natija — qayta tekshiruvda |
| Tuzatishdan keyin qanday qayta tekshirasiz? | O'sha usul bilan yana buzib ko'rasiz | Natija: takrorlanmadi yoki yana buzildi |
| Bu mashqda B reja qaysi demo o'tishida ochiladi? | Ikkinchisida, 3-qadamda | Mentor misolida — 60 soniyalik video |
- §145: har javobdagi so'z darsda bor (demo tekshiruvi — 2 · uch savol — 2 · uch risk, kutish, oldini olish — 4 · uchish rejimi, tekshiruv akkaunti, namuna ism va login, «Tuzatish qilindi», qayta tekshiruv — 6 · B reja, ikkinchi o'tish — 7).
- S-027: har old tomon — to'liq savol, «?» bilan; «ta'rif → atamani toping» shakli yo'q. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunliklar — `md07/olchov.py` (pastda «O'lchov»).
1. Demo tekshiruvida demoni kim buzadi? (2, 6)
   - ✔ A — O'quvchi o'zi, o'z mahsulotida (30)
   - B — Agent, o'quvchi so'ramasdan o'zi (32)
   - C — Sinfdosh, o'quvchining hisobidan (32)
   - D — Hakam, Demo Day kunining o'zida (31)
2. Demo besh qadamda xatosiz o'tdi. Bu nimani ko'rsatadi? (2)
   - A — Demo har sharoitda ishlashini (29)
   - ✔ B — Oddiy sharoitda demo ishlashini (31)
   - C — Agentning tuzatishi to'g'riligini (33)
   - D — Hakam pitchingizni yoqtirishini (31)
3. Ikki marta bosishni demoning qaysi joyida tekshirasiz? (4, 6)
   - A — Kirish sahifasining sarlavhasida (32)
   - B — B reja videosi ochiladigan joyda (32)
   - ✔ C — Demo yo'lidagi asosiy tugmada (29)
   - D — Darsdagi taymerning tugmasida (29)
4. «Belgi «Ulangan» bo'lgach, telefonda «9 / 10» ko'rinadi» — bu qaysi qator? (4, 5)
   - A — Buzishdan keyin ko'rilgan natija (32)
   - B — Riskning oldini olish uchun ish (31)
   - C — Demo stsenariysining bir qadami (31)
   - ✔ D — Buzishdan oldin yozilgan kutish (31)
5. Bo'sh ma'lumotni qaysi hisobda yuzaga keltirasiz? (6)
   - ✔ A — Agent ochgan tekshiruv akkauntida (33)
   - B — Eng faol foydalanuvchining hisobida (35)
   - C — Sinfdoshingizning shaxsiy hisobida (34)
   - D — Demo yo'lidagi o'z hisobingizda (31)
6. Qaysi kutishni ekranga qarab tekshirsa bo'ladi? (4)
   - A — Demo hakamga juda yaxshi ko'rinadi (34)
   - ✔ B — O'yinda «0 / 10» va tugma ko'rinadi (35)
   - C — Zal internetini oldindan tekshiraman (36)
   - D — Agent hammasini o'zi tuzatib qo'yadi (36)
7. Agent faylni o'zgartirdi, u `git status` da ko'rindi. Nima belgilaysiz? (6)
   - A — Takrorlanmadi — demo endi ishlaydi (34)
   - B — Buzilmadi — topilma yo'q bo'ldi (31)
   - ✔ C — Tuzatish qilindi — kod o'zgardi (31)
   - D — Demo tayyor — o'tish shart emas (31)
8. Qayta tekshiruvda muammo yana chiqdi. Nima qilasiz? (6)
   - A — Yozuvni o'chirib, demoni davom ettiraman (40)
   - B — Demo kuni bu qadamni hakamga ko'rsatmayman (42)
   - C — Agentdan bitta yangi funksiya so'rab olaman (43)
   - ✔ D — «Yana buzildi» deb yozib, agentga beraman (41)
9. Uch demo o'tishining birida nima mashq qilinadi? (7)
   - ✔ A — B rejaga o'tish: videoni ochish (31)
   - B — Yangi funksiyani hakamga ko'rsatish (35)
   - C — Hakamning savollariga javob berish (34)
   - D — Backend'ni Render'da qayta yozish (33)
10. Demo o'tishida B reja videosi qayerda ochiladi? (7)
    - A — Hakamning telefonida, havola orqali (35)
    - ✔ B — Demo ochiq turgan laptopning o'zida (35)
    - C — Sinf chatiga yuborilgan fayl sifatida (37)
    - D — Ikkinchi telefondagi brauzer oynasida (37)
11. Demo tekshiruvidan keyin tekshiruv akkaunti nima bo'ladi? (6)
    - A — Hakamlar uchun saqlab qo'yiladi (31)
    - B — Haqiqiy hisobga aylantiriladi (29)
    - ✔ C — `id` lari bo'yicha o'chiriladi (30)
    - D — Sinfdoshlardan biriga beriladi (30)
12. `XATOLAR.md` ga demo tekshiruvidan nima yoziladi? (6)
    - A — Faqat agent aytgan tuzatishlar (30)
    - B — Hech narsa — demo xatosiz o'tdi (31)
    - C — Faqat buzilgan va tuzatilganlar (31)
    - ✔ D — Har usul, natijasi va holati (28)
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 3-ekran (bo'sh holatni qanday bilasiz — kitob ilovasi) ↔ arena 5 (qaysi hisobda) · 8-ekran (qayta tekshiruvsiz bilinmaydi) ↔ arena 7 (qaysi belgi) va arena 8 (yana buzilsa).
- Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas (S-004), har savolda uch xil turkum: 1 — agent o'zboshimcha, boshqa odam hisobi, kech (Demo Day) · 2 — kafolat da'vosi, boshqa ish dalili, demoga aloqasiz · 3 — bosilmaydigan joy, jonli bo'lmagan joy, dars asbobi ·
  4 — natija, oldini olish, stsenariy · 5 — haqiqiy foydalanuvchi, boshqa odamning shaxsiy hisobi, o'z demo hisobi (demo buziladi) · 6 — mavhum, oldini olish, agent da'vosi · 7 — natija da'vosi, noto'g'ri belgi, o'tishni tashlash · 8 — yashirish (o'chirish), ko'rsatmaslik, yangi funksiya ·
  9 — yangi funksiya, boshqa dars (savol-javob), kod qayta yozish · 10 — hakamga havola, ommaviy chat (video qoidasi), ikkinchi qurilma · 11 — hakamga qoldirish, haqiqiy hisob, boshqa odamga berish · 12 — faqat agent so'zi, hech narsa, buzilmaganlarni yashirish.
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — demo · o'tish · risk · kutish · buzish yozuvi · B reja · taymer · Maydon Jamoa · uyga vazifa banneri — demo · o'tish · kutish. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/12-Modull/PmDemoTestLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m12d7-v1` (13-Modul naqshi `pm-m11dN-v1`), `lessonTitle` — «Investor ko'zi bilan: demo buzilmaydimi?».
2. `SCREEN_META` 12: hook · plan · concept · test · concept · practice · practice · practice · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 3: 1, 8: 2 }; `savollar: -1`, `kutish: -1` (2, 4-ekran — ballsiz, nishon bilan);
   5, 6, 7 `practice: -1`, signal `PRACTICE_BASE + ekran`. `narrow` — 3, 8, 9-ekranlar.
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18; s2 da `QBashorat` + taxmin qatori yashil xulosa qutisi ichida — E 42) · s3/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s5 `QMustaqil` · s6/s7 `QBlok` (skeletdagi `ScreenBlok` ulagichi) · s9 `QNatija` · `sflash` `QKartochka` · s11 `QYakun`.
3. **`DemoSahna`** — bitta vizual (180; qolipda yo'q, yangi): qismlar `telefon` (o'sha demo yo'li; ulanish belgisi; samolyot belgisi) · `laptop` (brauzer: manzil satri, «O'yinlar» / «O'yin» ekrani, «Qo'shilaman»; B reja kadri — video oynasi «60 soniya») · `stsenariy` (5 chip + taymer chizig'i, 12-Modul `TaymerChiziq` naqshi) · `yozuv` (buzish yozuvi kartasi: uch qator, belgi, kutish — accent uzuq ramka).
   Rejimlar: `kirish` (Wi-Fi kesilgan, «?») · `tayyor` (1-ekran) · `otish` (2-ekran: besh qadam navbat bilan; `UCH_SAVOL` natijasi bo'yicha qadam yonadi; uch kulrang yorliq) · `risk` (4-ekran: `tarmoq` | `bosh` | `ikki` kutish holati) · `natija` (6, 7-ekran o'ng tomon). Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: ds-qadam ds-tugma ds-yozuv`).
   `reduced-motion` — o'tishsiz. 393 da telefon brauzer ustida, kesilmaydi (E 41). Rangli yon chiziq yo'q.
4. **Bitta manbalar (A-6 aynan):** `MENTOR_STSENARIY` (5 qadam) · `UCH_SAVOL` (3 × `{ matn, otishda: bool, qadam }`) · `USULLAR` (3 × `{ id: 'tarmoq' | 'bosh' | 'ikki', nom, hodisa, qilaman }`) · `KUTISH_KARTALAR` (4-ekran: 3 × `{ usul, variantlar: [{ t, tur: 'togri' | 'mavhum' | 'oldini' }] }`) · `MENTOR_YOZUV` (3 × `{ usul, qildim, kutdim, boldi: null, belgi: null, keyin: null }` — ⛔ `boldi`, `belgi`, `keyin` pilotdan) · `B_REJA_GAPI` · `TEKSHIRUV_OYINI` («Juma, 18:00 · Mahalla maydoni · 0 / 10»).
   Mentor rejimi, s0, s1, s2, s4, s5 (Yordam), s6/s7 (Yordam va kutilgan natija) shulardan o'qiydi. ⛔ `MENTOR_YOZUV.boldi/belgi/keyin` va `MENTOR_XATOLAR` — «qur» pilotidan oldin bo'sh; muhrdan oldin to'ldiriladi (REPO 5).
5. **s2** — `QBashorat` (Bittasiga · Ikkitasiga · Uchalasiga) → «Demo o'tishini boshlash» (5 qadam animatsiya, ≈10 s; `reduced-motion` — birdan) → 3 savol kartasi, ikki tugma, kalit `[true, true, false]`; to'g'ri → `UCH_SAVOL[i].qadam` yonadi; `QXato` 3 turi; natijada taxmin qatori + xulosa + `QIzoh` (atama); 40 s ipucha; nishon `investorEye`.
6. **s4** — 3 risk kartasi ketma-ket, har birida 3 variant (✔ o'rni 1, 2, 3); to'g'ri → matn yozuv kartasining «Nima kutdim» qatoriga uchadi, `DemoSahna` `risk` rejimi; `QXato` 2 turi (`tur` bo'yicha); xulosa + `QIzoh`; nishon `clearExpectation`.
7. **s5** — o'qiydi `pm-m12d6-demo.stsenariy` (kulrang qator); uch qism ketma-ket (`USULLAR`), «Nima qilaman» oldindan; tekshiruv: bo'sh (bloklaydi) · mavhum so'z va son ham, qo'shtirnoq ham yo'q (yumshoq; ikkinchi bosish o'tkazadi) — **PM-108 tartibida kamida 8 namuna bilan `node` da sinaladi**
   (masalan: «Belgi «Ulangan» bo'lgach, 9 / 10» o'tadi · «yaxshi ishlaydi» yumshoq · «0 / 10 ko'rinadi» o'tadi · «to'g'ri ishlaydi» yumshoq · bo'sh bloklaydi). Saqlash → `pm-m12d7-tekshiruv` (A-12), `savedAt`. ✎ — qismni qayta ochish.
8. **s6** (`QBlok`, 4 qadam) — 1-qadamda tekshiruv akkaunti prompti (`{bo'sh holat}`, kulrang namuna) va `uygotish` kulrang qatori; 2-qadamda uch yozuv kartasi (`boldi`, `buzildi`; shart xabari); 3-qadamda tuzatish prompti — `{buzish yozuvi}` (faqat `buzildi === true`), `{demo stsenariysi}` (`pm-m12d6-demo.stsenariy` yoki bo'sh + namuna); «Tuzatish qilindi» tugmasi faqat `buzildi === true` urinishda;
   trek bo'yicha yangi versiya qatorlari (`pm-m9d8-platforma.trek`; yo'q — ikkalasi); 4-qadamda qayta tekshiruv tugmalari (`pm-m12d7-tekshiruv.urinishlar[].qayta`), `XATOLAR.md` prompti (`{to'liq yozuv}` — holatdan, «qoldi — {sabab}» o'quvchi maydoni), o'chirish gapi; «Ortda qoldingizmi» (darsda bir marta) shu blokda;
   «Davom etish» 2-qadamdan keyin (uchala `buzildi !== null`); yashil xulosa — uch holat (A1 «Hammasi bajarilgach»). Qavs — `QPrompt` atrofida o'z o'rovchisi; `src/qolip` ga tegilmaydi («qolip taklifi»).
9. **s7** (`QBlok`, 4 qadam) — chapda stsenariy ro'yxati (`pm-m12d6-demo.stsenariy` yoki o'quvchi yozgan 5 qator — dars holatida); taymer (o'tish vaqti ko'rinadi, saqlanmaydi); har o'tishda qadam belgilash ✓ va «Xatosiz» / «Xato bilan» (+ «Nima bo'ldi»); 3-qadamda «Video ochildi» / «Video ochilmadi» → `bReja`;
   `pm-m12d6-demo.video` `true` bo'lmasa — «Video bor» / «Video hali yo'q» tanlovi, «yo'q» — kulrang qator va `bReja: null`; «Davom etish» 2-qadamdan keyin; nishon `threeRuns` (uchala `otishlar[i] !== null` va 4-qadam «Bajardim»); yashil xulosa — ikki holat.
10. **Mentor rejimi:** o'quvchilar ro'yxatida faqat signallar («Kutishlar saqlandi» · Amaliyot 1, 2 «Bajardim»; `PRACTICE_BASE`); o'quvchi yozuvi va «Nima bo'ldi» matni Mentorga ham, proyektorga ham chiqmaydi (o'z mahsuloti; login yoki `id` tasodifan yozilsa ham ko'rinmasin). 0-ekrandagi sinf ovozlari — faqat variantlar soni. Kim nechta «Xatosiz» olgani sanalmaydi.
11. Testlar s3/s8 — `correctIdx` 1/2 = `INLINE_KEYS`; `RECAPS` {3, 8} (`ic` → 1/2/3 + `ask`); `Q_LABELS` {3, 8}. Savol ustida yorliq yo'q (SABOQ 6); javobdan keyingi kichik vizual — `QuestionScreen` `vizual` (SABOQ 4).
12. `ACHIEVEMENTS` 4 (`investorEye`, `emptyCheck`, `clearExpectation`, `threeRuns`) + `ACH_TRIGGERS`. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3 — arena jadvali) + `set_quiz_keys`; `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — `sflash` alohida ekranda. `SCREEN_INTENTS`.
13. s11 `QYakun`: sarlavha **besh holat** — `pm-m12d7-tekshiruv` (`urinishlar[].qayta` bilan) va blok bayroqlaridan (P-046, E 54; ustunlik tartibi — 11-ekran); `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» ko'rsatilmaydi (E 50); `uyga` — `HwCard` (Kim uchun · Nechta · Muddat + ①②; ① holatdan yig'iladi); `keyingi` — «Final pitchingiz 5 daqiqaga tayyormi?». Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
14. App.jsx `m12-07` qatoriga `comp: PmDemoTestLesson` + import — asosiy seans, «qur» bosqichida (nom va osti o'zgarmaydi — DE-205 ✓, App.jsx 473-qator). Bu agent App.jsx ga tegmaydi.
- Darvozalar: `npm run gates -- src/12-Modull/PmDemoTestLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` 0 · `lint:jsx` 0 · `stilsiz.py` · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30) · maket kesilmasligi (E 41) · haqiqiy click bilan har tugma (E 47).
  ⚠️ CSS izohida va matn konstantalarida backtik yo'q (template-satr tuzog'i, CLAUDE.md). `{…}` qavslar — matn (prompt qavsi), JSX ifodasi emas.

## REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m14-dars-07-start` = `m14-dars-06-done` (teg `m14-demo`) → `m14-dars-07-done`, tayanch 3) <!-- TAXMIN T4 -->
1. **Buzish natijasidagi tuzatishlar** — ⛔ faqat pilotda topilgan «Buzildi» urinishlar uchun, faqat tuzatish (yangi funksiya yo'q); qaysi fayl — agentning haqiqiy javobidan. Hech biri buzilmasa — kod o'zgarmaydi.
2. **`XATOLAR.md`** — «## Demo tekshiruvi» bo'limi (13-Modul 12-darsi shakli): har «Buzildi» urinish — usul · natija · holat; oxirida «Buzilmagan usullar: …». Matn — pilot yozuvidan (`MENTOR_XATOLAR`).
3. **Yangi versiya** — o'zgargan qismga qarab: `backend/` — Render · `mobil/` — brauzer ko'rinishi qayta eksport (Netlify); APK bu tegda qayta tayyorlanmaydi (demo — brauzerda; TAYANCHGA SAVOL 4).
4. **`README.md`** — «Darslar va teglar» jadvaliga 7-dars qatori.
5. ⛔ **Muhrdan oldin:** Mentor misolining uch urinishi `m14-dars-07-start` bilan laptop brauzerida (brauzer ko'rinishi) va haqiqiy telefonda bajariladi; «Nima bo'ldi», belgilar, agentning sababi, tuzatish va qayta tekshiruv — haqiqiy natijadan (A-6 jadvali, 6-ekran kutilgan natija, `MENTOR_YOZUV`, `MENTOR_XATOLAR`).
   Natija qanday chiqsa — shunday yoziladi; o'quv muvozanati uchun natija tanlanmaydi. Agent bo'sh holatni Database'da qanday tayyorlashi (yangi o'yin, `namuna = true`) va `id` bo'yicha o'chirishi — shu pilotda ko'riladi.
   Amaliyot 2: uch o'tish va B reja video Mentor laptopida — o'tish natijalari (7-ekran o'ng tomoni) pilotdan.
6. Shart: teglar kurs boshlanishidan oldin upstream'da (`yechim` tarmog'ida).

## Manbalar (08.10.2026; o'quvchiga ko'rinmaydi)
- Dars mazmuni, Mentor demo stsenariysi, risklar, B reja, ⛔ natija — `00-MODUL-TAYANCH.md` 1.6, 1.7, 1.14 (aynan); atamalar — 2; teg va `XATOLAR.md` — 3; kalitlar — 8; dastur qatori — `00-MANBA.md` 1 (7-qator: «demo-risklar chek-listi → agent bilan progon: o'quvchi buzadi (tarmoq uzilishi, bo'sh data, ikki klik), agent tuzatadi»).
- **Render** bepul xizmati: 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa — tayanch 6 va `00-MANBA.md` 5 (render.com/docs/free, 06.10.2026; 12-Modul tayanchi 6). Yangi tashqi fakt bu darsda yo'q.
- Buzish yozuvi, «Tuzatish qilindi», qayta tekshiruv, uchish rejimi va «Ulanmoqda…» kutishi — 12-Modul 5-darsi (`feedback/F-1006-12modul/05-BreakAndFix-v3.md`, 05-FILTR 6, 11, 12). Tekshiruv akkaunti va `id` bo'yicha o'chirish — 12-Modul tayanchi 9.35, 9.37 g; `namuna` ustuni — 12-Modul tayanchi 1.7.
- `XATOLAR.md` shakli va «yangi funksiya qo'shilmaydi» tekshiruvi (`git diff`) — 13-Modul 12-darsi (`12-StabilizeDay-v3.md` A-4, 2-amaliyot). Brauzer ko'rinishi qayta eksporti — 12-Modul tayanchi 9.28 (13-Modul 12-dars A-4 dagi buyruqlar).
- Uchish rejimi, telefon brauzeri — umumiy so'z; tugma va menyu nomlari yozilmadi. Ekran yozish vositasi — umumiy so'z (tayanch 1.9: aniq dastur nomi ⛔).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Mentor buzish yozuvining «Nima qildim» va «Nima kutdim» qatorlari** (A-6) — tayanchda yo'q; uch usul (1.7) va Mentor demo stsenariysi (1.6) asosida men yozdim. «Nima bo'ldi» va undan keyingilari — ⛔ pilot (tayanch 1.7).
2. **«Bo'sh ma'lumot» usuli** — tekshiruv akkaunti e'lon qilgan yangi o'yin «Juma, 18:00 · Mahalla maydoni · 0 / 10» (nomi — 13-Modul 12-darsidagi tekshiruv o'yini). Muqobil — «O'yinlar» ro'yxatining o'zi bo'sh: Database'dagi haqiqiy o'yinlarga tegish kerak bo'ladi — xavfsizlik uchun olmadim.
   O'quvchi uchun umumiy shakl: «demo yo'lidagi hali hech narsa yozilmagan joy (yangi ro'yxat, bo'sh profil, odamsiz o'yin)» — agent tekshiruv akkauntida tayyorlaydi.
3. **Tarmoq uzilishi — telefonda (uchish rejimi), laptopda emas** — laptop internetini uzish dars sahifasini ham uzadi (12-Modul 5-dars, A1 1-qadam saboqi). Laptopning o'zi uzilganda — B reja (Amaliyot 2, ikkinchi o'tish). Hook (0-ekran) laptop internetini so'raydi — javob B reja o'tishida.
4. **Ikkinchi qurilmada demo yo'li — telefon brauzerida** (mobil trekda brauzer ko'rinishi), APK yoki Expo Go emas: tuzatishdan keyin bitta qayta eksport ikkala ekranni yangilaydi, APK o'zi yangilanmaydi. 6-dars (T8: «telefon — ikkinchi qurilma») shu bilan bir bo'lishi kerak — 2-to'lqin kelishuvi. <!-- TAXMIN T8 -->
5. **`pm-m12d7-tekshiruv` da qayta tekshiruv natijasi yo'q** — taklif: `urinishlar[].qayta: 'takrorlanmadi' | 'takrorlandi' | null` (12-Modul `pm-m10d5-buzish` naqshi). Pilot kaliti «shu holicha majburiy» bo'lgani uchun qo'shmadim — natija `ccProgress` da; 13-dars uni o'qiy olmaydi. Qaror kerak.
6. **B reja — ikkinchi o'tishda, 3-qadamda** (tayanch: «bittasida»); oxirgi o'tish jonli bo'lsin. **B reja gapi** (Mentor misolida): «Internet uzildi — shu demoning 60 soniyalik videosini ko'rsataman.» — tayanchda yo'q. <!-- TAXMIN T8 -->
7. **«Xatosiz» ta'rifi** — demo stsenariysining beshala qadami rejadagidek o'tdi; vaqt (Mentor rejasi 60–90 soniya) belgi emas va saqlanmaydi (kalitda vaqt yo'q; 6-dars `otishVaqt` bor). Kerak bo'lsa — `otishlar` o'rniga `[{ xatosiz, vaqt }]`.
8. **Demo holatini boshiga qaytarish** — har urinish va o'tishdan keyin (Mentor misolida — laptopda o'yindan chiqish, yana «8 / 10»). 6-dars stsenariysida shu qadam bormi — 2-to'lqin kelishuvi.
9. **`XATOLAR.md` ga «## Demo tekshiruvi» bo'limi** — tayanch 3: «`XATOLAR.md` ga qator». Bo'lim shakli — 13-Modul 12-darsidagidek (usul · natija · holat + «Buzilmagan usullar»).
10. **Uch savol** — tayanch 1.7 «investor demoda nimaga qaraydi: ishlaydimi (jonli), tushunarlimi (bir lahza), buzilsa nima bo'ladi». O'quvchi matnida: «Mahsulot jonli ishlaydimi?» · «Nima ekani bir qarashda bilinadimi?» · «Buzilsa, ekranda nima bo'ladi?» — kurs savollari sifatida, hakam gapi emas (TAQIQLAR 0).
11. **Mustaqil ish (5-ekran)** — tayanch 4 dagi PM+PRAKT qatori «nazariya → 2 amaliyot bloki»; 13-Modul PM+PRAKT shaklida mustaqil ish bor — kutishlar shu yerda yoziladi (nazariya qismiga kiradi). 12 ekran o'zgarmadi.
12. **`pm-m9d8-platforma.trek` o'qiladi** — tayanch 4/8 da 7-dars faqat `pm-m12d6-demo` ni o'qiydi; trek — Amaliyot 1 3-qadamdagi yangi versiya yo'li uchun (tayanch 1.0: «o'z trekida»). `pm-m12d6-demo.uygotish` — 1-qadam kulrang qatori uchun.
13. **Uyga vazifa ②** — tanish odamga demoni bir marta ko'rsatish va «bir qarashda bilindimi?» savoli (2-ekrandagi ikkinchi savol). Tayanchda 7-dars uyga vazifasi yozilmagan; PM+PRAKT darsida uyga vazifa bor (13-Modul 7-dars naqshi).
14. **Tekshiruv akkaunti promptida «foydalanuvchilar sanog'iga tushmaydigan»** (o'quvchi) va «`namuna = true`» (Mentor Yordami) — 12-Modul `namuna` ustuni; o'quvchi mahsulotida ustun nomi boshqacha bo'lishi mumkin.
15. **Ikki marta bosish va 4-dars** — Mentor misolida 4-darsda «bosish javobi» qurilgan (ikki marta bosilmaydi); bugungi urinish — shuni demo sharoitida qayta ko'rish. 4-dars kodining haqiqiy holati — ⛔ pilot. <!-- TAXMIN T7 -->
16. **«hakam» — 1-darsda tug'iladi deb oldim** (tayanch 2 jadvali; 1-dars pilotda «hakam savollari»). 7-darsda glosssiz ishlatildi (0, 1, 2-ekran, arena). 1-dars MD sida tug'ilmasa — 0-ekran maketiga bitta kulrang yorliq: «hakam — Demo Day'da baho beradigan investor yoki tadbirkor». <!-- TAXMIN T19 -->
17. **Kitob almashish ilovasidagi «Mening kitoblarim»** (3-ekran, ikkinchi misol) — o'ylab topilgan bo'lim nomi (P-002: qisqa testda o'smir olamidan); 13-Modul arena 9 dagi kitob almashish ilovasi bilan bir olam.

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **90 daqiqa** — Amaliyot 1 ≈ 30 daqiqa ichida: uch urinish, tuzatish, push, Render yoki brauzer ko'rinishini qayta eksport (kutish), qayta tekshiruv, `XATOLAR.md`, tekshiruv akkauntini o'chirish. Reja — «qur» pilotida 12–15 o'quvchi bilan taymer bilan o'lchanadi; sig'masa — 4-qadam uyga (foydalanuvchi qarori).
2. ⛔ **Mentor misolining natijasi** — uch urinishdan qaysi biri buzilishi (yoki hech biri) — pilotda; testlar va xulosalar natijaga bog'lanmagan, lekin 6, 7-ekranning o'ng tomoni va REPO shu natijaga bog'liq.
3. ⛔ **Telefon brauzeri uchish rejimidan keyin sahifani qayta yuklashi** — muammo ko'rinmay qolishi mumkin (12-Modul 5-dars Shubhali 3 naqshi); pilotda haqiqiy telefonda (Android va iPhone).
4. **Ikki marta bosish** — «tez» bosish odamga bog'liq; bir urinishda chiqmasligi mumkin — matnda «yana bir-ikki marta qaytaring», ko'rilganning hammasi «Nima bo'ldi» ga yoziladi.
5. **«Bir qarashda bilinadimi?» ga o'tishda kim javob beradi** — o'quvchining o'zi yoki sherik; haqiqiy javob — tanish odamdan (uyga vazifa ②). Auditor «bu savolga o'tish javob bermaydi» deyishi mumkin — 2-ekran xato izohi e'lon kartasiga qaratadi.
6. **B reja video** — 6-darsda yozilgan bo'lishi kerak (`pm-m12d6-demo.video`); bo'lmasa — ikkinchi o'tish B rejasiz, video — uyga vazifa ①. Ekran yozish vositasining nomi aytilmaydi (tayanch 1.9, ⛔).
7. **«B reja» so'zi** — 12-Modul 10-darsida «Ishlatilmaydi» ro'yxatida edi (u yerda boshqa ma'no — «zaxira reja»); 14-Modul tayanchi 2 — o'zgarmaydigan atama (B reja — 60 soniyalik video). Bu darsda faqat video ma'nosida.
8. **Render uyqusi** — dars davomida 15 daqiqa so'rovsiz qolsa Backend yana uxlaydi; Amaliyot 2 boshida yana uyg'otish yozildi. Render interfeysi va qayta chiqarish — 12-Modul so'zi bilan, tugma nomi yozilmadi.
9. **Agent bo'sh holatni qanday tayyorlashi** — o'quvchi mahsulotida yozuv yaratish yo'li har xil (Database yoki API); prompt yaratilgan yozuvlarni `id` lari bilan aytishni so'raydi, natija — o'quvchining o'zi ko'rgani. Pilotda Mentor repo'sida.
10. **«Hech narsani tuzatma — men hozir faqat tekshiryapman»** (1-qadam prompti) — agent baribir tuzatish taklif qilishi mumkin; o'quvchi `git status` bilan ko'radi (13-Modul 12-dars naqshi).
11. **Kartochkalar ekrani sarlavhasi «O'zingizni sinab ko'ring.»** — qolip (platforma) sarlavhasi, o'zgartirilmaydi; «sinab» ildizi darsda faqat shu yerda (demo tekshiruvi matnida «sinov» yo'q). Auditor so'rasa — qolip qarori.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 18 band)
1. [x] **90 daqiqa — reja, o'lchov emas** — A-11 taqsimot va ulgurmagan yo'l (Amaliyot 1 — 2-qadamdan, Amaliyot 2 — 2-qadamdan keyin «Davom etish»); tashqi kutish oqimni to'xtatmaydi; ⛔ pilotda taymer (Shubhali 1); «sig'adi» deyilmaydi.
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — telefon brauzeri va uchish rejimi (Shubhali 3), Mentor natijasi va agentning bo'sh holati (REPO 5), ekran yozish vositasi (umumiy so'z) — ⛔; Render, Netlify, Expo — faqat 12–13-Modul so'zi va buyruqlari; tugma nomi yozilmadi.
3. [x] **Saqlash kaliti — shartnoma** — A-12: tayanch 8 sxemasi aynan, har maydon, tipi, `bool | null` uch holat, kim yozadi (5, 6, 7-ekran); qayta tekshiruv — `ccProgress` (TAYANCHGA SAVOL 5); ism, login, `id`, video yozilmaydi; boshqa darsning kaliti faqat o'qiladi.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor misolida», «Bu misolda» (2, 4-ekran xulosalari), «Bu darsda demo uch savol bilan ko'riladi» (2-ekran O'qituvchi eslatmasi, kartochka 2), «Bu mashqda» (kartochka 12); «Nima qilaman» — o'quvchi moslaydi (5-ekran).
5. [x] **Kafolat va sabab da'vosi yo'q** — «Tuzatish qilindi» + «qayta tekshiruvda takrorlanmadi» (6-ekran, 8-ekran, kartochka 10); «Buzilmadi» ostida «boshqa safar ham shunday degani emas» (6-ekran); 8-ekran — o'tish xatosiz bo'lsa ham bilinmaydi; agent «o'chirdim» — uning so'zi; Mentor sababi to'qilmadi (⛔).
6. [x] **Yakun, «Bajardim», nishon — faqat rost holatda** — yakun besh holat, «hech narsa» holati alohida (11-ekran; E 54); bloklar yashil xulosasi — holatga qarab (6-ekran — 3, 7-ekran — 2); «Three Runs!» tavsifi belgilashni aytadi; blok bajarilgani — 4-qadam «Bajardim»idan.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — «xatosiz» — beshala qadam rejadagidek (A-5, 7-ekran); kutish — ekrandagi belgi, son yoki tugma (4, 5-ekran); demo tekshiruvi ta'rifi dars bo'yi so'zma-so'z (A-4, 2-ekran, yakun, kartochka 1).
8. [x] **Test: bitta himoyalanadigan javob** — 3, 8-ekran va arena: distraktorlar uch xil turkumdan (Kalit va arena izoh qatorlari), hayotda rost bo'lib qoladigan variant yo'q (3-ekran D — oldini olish, savol «qanday bilasiz»), inkor-savol yo'q, to'g'ri javob yolg'iz eng uzun emas (O'lchov).
9. [x] **Real odamlar xavfsizligi** — buzish faqat o'z mahsulotida (1-ekran, 4-ekran eslatmasi, Amaliyot 1 1-qadam qalin); haqiqiy foydalanuvchi hisobi yo'q; sherik va tanish odam ismi yozilmaydi (7-ekran, yakun); kim kimdan tez o'tgani sanalmaydi (7-ekran eslatmasi, KOD 10).
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — buzish va belgi — o'quvchi (6-ekran 2-qadam), demo o'tishi — o'quvchi (7-ekran); agent — tekshiruv akkaunti va tuzatish; akkauntni agent ochadi va `id` bo'yicha o'chiradi (6-ekran 1, 4-qadam).
11. [x] **Web-trek teng yo'l** — demo ikkala trekda laptop brauzerida; farq — yangi versiya yo'lida (A-14, 6-ekran 3-qadam); o'quvchi matnida «mahsulotingiz», «demongiz»; web usuli to'qilmadi (Netlify — 12-Modul so'zi).
12. [x] **Mentor misoli ichki izchil** — stsenariy, B reja 60 soniya, «8 / 10» → «9 / 10» — tayanch 1.6, 1.14 aynan; kutishlar 4-ekran, 5-ekran Yordami va A-6 da so'zma-so'z bir; keyingi darslar sonlari va natijasi ochilmadi; yangi tafsilotlar — TAYANCHGA SAVOL 1, 2, 6.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — `{bo'sh holat}`, kutish, asosiy tugma — o'quvchida; koddan bilinmaydigan sabab — agentdan, o'quvchi solishtiradi; yangi narsa chiqsa — agentga «olib tashla» (`git diff`); Mentor qarorlari faqat «Yordam»da.
14. [x] **Uyga vazifa yengil va aniq** — ikki band; ① faqat qolgan ish bo'lsa; ② — bitta odam, bitta savol; muddat — keyingi darsgacha; loyiha kuni emas (PM+PRAKT).
15. [x] **Ayb da'vosi yo'q** — xato yo'li: «Shu xato chiqdi: {xato}. …», «Xato bilan» → bir qator va tuzatish yo'li; «xatongiz emas», «sizda emas» yo'q.
16. [x] **Kelajak va'dasi yo'q** — «demo buzilmaydi», «Demo Day'da ishlaydi» yo'q; keyingi darslar aytilmaydi; uyga vazifada ham.
17. [x] **Pul va investitsiya** — bu darsda pul yo'q; «investor» — faqat ko'rish usuli (uch savol); investitsiya summasi tilga olinmaydi; Pro, to'lov — demo yo'lida yo'q.
18. [—] **Yosh va rasmiy shartlar** — bu darsda xalqaro sayt va dastur yo'q; Render faqat tayanch 6 dagi rasmiy fakt bilan.
- [x] **RAD etilganlar (qayta ochilmaydi):** hookdagi «Aynan!» / «Qiziq fikr!» (0-ekran) · yakundagi «Keyingi dars — «…»» qatori (11-ekran) · Reja sarlavhasi — natija-gap (1-ekran) · ekranda ≤3 blok · keyssiz.
- [x] **12-Modul SABOQ E:** har variantning o'z chegarasi (E 40) · maketda hech narsa kesilmaydi (E 41) · taxmin qatori yashil xulosa ichida (2-ekran, E 42) · yorliq input ichida (5-ekran, E 43) · bittadan karta (2, 4, 5-ekran, Amaliyot 1 2-qadam — E 53) · yakun standarti (E 50) · sarlavha har holatda rost (E 54).

## O'lchov
`md07/olchov.py` natijasi (qavsdagi sonlar skript bilan qo'yilgan: har sanaladigan matn belgilab olinib, uzunligi avtomatik yozildi):
```
Belgilar soni — bo'shliq bilan, ** siz (Python len). Qavsdagi uzunliklar: 146 ta — hammasi skript qo'ygan, qo'lda son yozilmagan.
Sarlavhalar (yakunning 5 holati va platforma sarlavhasi bilan): 13 ta · 25–54 · ≤55
Xulosalar: 3 ta · 73–97 · ≤110
Hook javoblari: 2 ta · 85–104 · ≤120
Hook variantlari: 3 ta · 32–33
To'g'ri izohlar: 2 ta · 57–59 · ≤60
Xato izohlari, QXato, ipucha, shart xabarlari: 20 ta · 35–58 · ≤60
QIzoh qatorlari: 2 ta · 72–89 · ≤110
Kulrang qatorlar, hodisa qatorlari, bloklar yashil xulosasi, «Nima qilaman»: 17 ta · 28–102
Nishon tavsiflari: 4 ta · 32–48 · ≤48
Endi siz bilasiz: 5 ta · 71–94
Bugungi asosiy fikr (A-2): 1 ta · 106–106 · ≤110
Mentor gaplari: 0-ekran 2 gap (93) · 1-ekran 1 gap (103) · 2-ekran 1 gap (83) · 4-ekran 1 gap (74) · 5-ekran 1 gap (83) · 6-ekran 1 gap (70) · 7-ekran 1 gap (105)
Sarlavha so'zlari (4+ harf) Mentorda: 0: 0/6 · 1: 0/5 · 2: 1/6 · 4: 1/5 · 5: 1/4 · 6: 0/5 · 7: 1/5 — hech qayerda ≥50% bo'lmasligi kerak
Test savoli (3-ekran): 10 so'z (88 belgi)
Test savoli (8-ekran): 10 so'z (82 belgi)
3-ekran: 43 · ✔44 · 47 · 45 | min/max 43/47 (+9%) | o'rtachadan eng katta og'ish 5%
8-ekran: 47 · 47 · ✔43 · 45 | min/max 43/47 (+9%) | o'rtachadan eng katta og'ish 5%
  4-ekran karta 1: ✔54 · 49 · 46 | og'ish 9%
  4-ekran karta 2: 45 · ✔58 · 49 | og'ish 14%
  4-ekran karta 3: 47 · 41 · ✔51 | og'ish 12%
arena 1: ✔30 · 32 · 32 · 31 | min/max 30/32 (+7%) | o'rtachadan eng katta og'ish 4%
arena 2: 29 · ✔31 · 33 · 31 | min/max 29/33 (+14%) | o'rtachadan eng katta og'ish 6%
arena 3: 32 · 32 · ✔29 · 29 | min/max 29/32 (+10%) | o'rtachadan eng katta og'ish 5%
arena 4: 32 · 31 · 31 · ✔31 | min/max 31/32 (+3%) | o'rtachadan eng katta og'ish 2%
arena 5: ✔33 · 35 · 34 · 31 | min/max 31/35 (+13%) | o'rtachadan eng katta og'ish 7%
arena 6: 34 · ✔35 · 36 · 36 | min/max 34/36 (+6%) | o'rtachadan eng katta og'ish 4%
arena 7: 34 · 31 · ✔31 · 31 | min/max 31/34 (+10%) | o'rtachadan eng katta og'ish 7%
arena 8: 40 · 42 · 43 · ✔41 | min/max 40/43 (+7%) | o'rtachadan eng katta og'ish 4%
arena 9: ✔31 · 35 · 34 · 33 | min/max 31/35 (+13%) | o'rtachadan eng katta og'ish 7%
arena 10: 35 · ✔35 · 37 · 37 | min/max 35/37 (+6%) | o'rtachadan eng katta og'ish 3%
arena 11: 31 · 29 · ✔30 · 30 | min/max 29/31 (+7%) | o'rtachadan eng katta og'ish 3%
arena 12: 30 · 31 · 31 · ✔28 | min/max 28/31 (+11%) | o'rtachadan eng katta og'ish 7%
ARENA ✔ taqsimoti: {'A': 3, 'B': 3, 'C': 3, 'D': 3}
```

## TAXMIN belgilari
Jami 27 ta `<!-- TAXMIN Tn -->` belgisi (qavsda — nechta joyda). Qaror-0 javobi boshqacha bo'lsa — aynan shu joylar tuzatiladi.
- **T4** (3) — teglar `m14-dars-NN-start/-done`, «Ortda qoldingizmi» birinchi blokda — 1-ekran pastki qatori · 6-ekran «Ortda qoldingizmi» · REPO sarlavhasi
- **T7** (2) — 4-dars sayqali (bosish javobi — «Qo'shilaman» ikki marta bosilmaydi) — A-3 · TAYANCHGA SAVOL 15
- **T8** (11) — demo laptop brauzerida (mobil — brauzer ko'rinishi), telefon — ikkinchi qurilma, B reja — 60 soniyalik video, Backend'ni uyg'otish — A-1 · A-3 · A-6 (stsenariy, demo joyi) · A-14 · bitta vizual · 6-ekran 1-qadam · 7-ekran 1, 3-qadam · TAYANCHGA SAVOL 4, 6
- **T9** (2) — 6-dars loyiha kuni shakli → `pm-m12d6-demo` (stsenariy, video, uyg'otish) — A-3 · A-12
- **T10** (3) — «demo o'tishi» (progon o'rniga), «sinov» so'zi yo'q — sarlavha bloki (halollik qatori) · A-3 · A-5
- **T19** (3) — atamalar (hakam) — A-3 · A-5 · TAYANCHGA SAVOL 16
- **T20** (3) — dars nomlari — sarlavha qatori · menyu qatori · yakun «Keyingi dars»

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 472–474 (grep 08.10) — `m12-06` «Demoga tayyorgarlik: risklar va B reja» → **`m12-07` «Investor ko'zi bilan: demo buzilmaydimi?»** (osti «demo tekshiruvi: buzamiz, agent tuzatadi, uch marta to'liq o'tish» — 1-ekran chap yorlig'i so'zma-so'z) →
  `m12-08` «Final pitchingiz 5 daqiqaga tayyormi?» (yakundagi «Keyingi dars» qatori).
- [x] Bitta misol-ip — «Maydon Jamoa» demosi (stsenariy, B reja — tayanch 1.6; uch usul — 1.7); ikkinchi misol faqat testda (kitob almashish ilovasi — P-002); keyssiz; metafora yo'q; bitta vizual — `DemoSahna` (laptop · telefon · stsenariy chizig'i · yozuv kartasi).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (demo o'tishi + savol → qadam yonadi yoki uch kulrang yorliq), 4 (kutish → yozuv qatoriga uchadi, sahnada kutilgan holat) + 0, 5, 6, 7; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q.
- [x] O'lchov (python, `md07/olchov.py`): sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh va xato izohi ≤60 — «O'lchov» bo'limi.
- [x] Atamalar oldingi darslar bilan bir (grep, tayanch 2; A-3): buzish yozuvi, «Buzildi» / «Buzilmadi», «Tuzatish qilindi», qayta tekshiruv — 12-Modul · tekshiruv akkaunti, `XATOLAR.md` — 12, 13-Modul · demo stsenariysi, demo o'tishi, B reja, yangi funksiya to'xtatildi — 6-dars ·
  yangi: demo tekshiruvi, uch savol, uch risk — misoldan keyin, ta'rif dars bo'yi bir xil · siz-forma; tugmalar ot-shaklda yoki siz-formada («O'tishda ko'rindi», «Xatosiz», «Video ochildi», «Saqlash», «Keyingi risk»). Agentga prompt — buyruq shaklida (T-002).
- [x] Testlar: 4 variant, bir shaklda, farq ≤15% (O'lchov); to'g'ri javob yolg'iz eng uzun emas; kalit so'z faqat to'g'rida emas; inkor-savol yo'q · ✔ o'rni 3-ekran B, 8-ekran C (yangi dars) · arena A·B·C·D ×3.
- [—] Final tartib-mashqi yo'q (PM + amaliyot darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › ✎ ↻ — belgilar) · kafolat so'zlari yo'q · xulosalar «Bu misolda» bilan chegaralangan · «sinov» — o'quvchi matnida yo'q.
- [x] Ichki kodlar o'quvchi matnida yo'q (`m12-07`, «A1», «Modul 14», K-raqam, «pilot» yo'q; bloklar — «Amaliyot 1», «Amaliyot 2»; modul raqami LMS bo'yicha — «12-Modulda», «6-darsda»); «KOD» ro'yxati 14 band, REPO 6 band.
- [x] Karta T · P · S · PM: T-002 (agent promptlari) · T-008 (Mentor yozuvi, B reja gapi, tanish odamga savol — olam matni) · T-011/PM-030 (demo tekshiruvi — 2-ekran oxirida; uch risk — 4-ekranda hodisadan keyin) · T-014/T-015 (A-5) · T-016/T-017 (metafora yo'q) · T-020 · T-024 · T-029/T-047 · T-038 · T-039 («demongiz» — 6-darsda bor) ·
  T-042 · T-043 · T-045 (demo o'tishi — oddiy sharoit, yolg'on model yo'q) · T-048 · T-049 · T-052 · T-064 · T-070 · P-001 · P-002 · P-004 · P-008 · P-012 (testlar 3, 8 ketma-ket emas) · P-013 · P-014/P-015 · P-016 · P-025 · P-026 · P-028 · P-033 · P-036 · P-046 · P-048 · P-052 · P-055 · P-059 · P-062 · P-064 · P-067 ·
  S-001 · S-002/S-004/S-010 · S-006 · S-008 · S-015 · S-019 · S-020 · S-026 · S-027 · §102 · §106 · §119 · §144/§145 · PM-005 (aralash) · PM-018 · PM-021 · PM-027 · J-026 (hook ballsiz) · SABOQ 1–39, E 40–55.
- [x] Halollik va xavfsizlik (TAQIQLAR 1, 2, 3; tayanch 1.7): buzish faqat o'z mahsulotida; Mentor natijasi to'qilmadi (⛔ — A-6, 6, 7-ekran, REPO 5); tekshiruv akkaunti — `id` bo'yicha o'chiriladi; yangi funksiya qo'shilmaydi (`git diff`); sherik va tanish odam ismsiz; video hech qayerga yuklanmaydi.
- [ ] ⛔ «qur» darvozalari ochiq: Mentor natijasi (REPO 5), telefon brauzeri va uchish rejimi (Shubhali 3), 90 daqiqa (Shubhali 1) — pilot va foydalanuvchi qarori kerak; TAYANCHGA SAVOL 5 (kalitga `qayta`) — qaror kerak.
