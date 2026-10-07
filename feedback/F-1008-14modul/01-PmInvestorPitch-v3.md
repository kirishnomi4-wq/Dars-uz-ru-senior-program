# 14-Modul (kod: `src/12-Modull`) · 1-dars (PM) «Investorga pitchni qanday tuzasiz?» — MD v3

Fayl: `src/12-Modull/PmInvestorPitchLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m12-01` · **16 ekran** (keysli PM — tayanch 4) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
⚠️ **TAXMIN:** Qaror-0 javobi hali yo'q — `<!-- TAXMIN Tn -->` belgili qatorlar tavsiya (A) variantga tayanadi (ro'yxat — oxirida «TAXMIN belgilari»). Javob boshqacha bo'lsa, aynan shu qatorlar tuzatiladi.
Pilot qoidalari (9-Modul SABOQ 1–18, 10-Modul SABOQ 19–31, 11-Modul SABOQ D 32–39, **12-Modul SABOQ E 40–55** — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element yengil halqa bilan, Mentor aynan shu harakatni aytadi; har variantning o'z chegarasi — E 40) · bashorat tanlangach yopilmaydi — natija yashil xulosa qutisining birinchi kichik qatori (E 42) ·
ko'p maydonli ish — bittadan karta (E 53) · yorliq input ichida (E 43) · ekranda ≤ 3 blok · telefon maketi chapda (≈170×272, o'lchami barqaror) · odamlar real ko'rinishda, ismsiz (D 36) · maketda hech narsa kesilmaydi (E 41) · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 4-ekran — **B** (`correctIdx 1`) · 6-ekran — **D** (`3`) · 8-ekran — **A** (`0`) · 12-ekran — **C** (`2`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 460–469, grep 08.10.2026, DE-205): `m11-13` «Zaxira dars» (13-Modul; `type: 'Rezerv'`, `comp` siz) → **`m12-01` «Investorga pitchni qanday tuzasiz?»** (`type: 'PM'`, `comp` hali yo'q; osti — TAYANCHGA SAVOL 1) → `m12-02` «Mahsulotingiz hikoyasini qanday aytasiz?». <!-- TAXMIN T20 -->
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn: o'quvchining o'z mahsuloti uchun olti bo'lakli pitch qoralamasi; mustaqil ish majburiy (11-ekran). Keys — **K12 Airbnb pitch deck** (tayanch 5, bank so'zi aynan, raqamsiz). <!-- TAXMIN T18 -->
**Kod ekrani yo'q** (tayanch 4: «QMustaqil — olti bo'lak bittadan karta; kod ekrani yo'q»). **REPO yo'q** (tayanch 3: `m14-dars-01-done` = `-start`).
⚠️ Bu modulning qat'iy chegarasi (TAQIQLAR 1, sinf 17): **investitsiya so'ralmaydi** — pul summasi, ulush, «investitsiya kerak» hech bir ekranda, namunada, Yordam'da yo'q; Pro — test rejimda; «yozma tasdiq — to'lov emas».
⚠️ Modul raqami o'quvchi matnida — LMS raqami («12-Moduldagi pitch», «13-Modulda»); kod raqami (`m12-01`, `src/12-Modull`) faqat fayl yo'lida. Dars raqami o'quvchi matnida yo'q. Demo Day, bitiruv himoyasi, 2-dars (hikoya) — o'quvchi matnida va'da qilinmaydi (T-038).
Manba: `00-MODUL-TAYANCH.md` (**1.0** — boshlanish · **1.1 — olti bo'lak, K12, Mentor qoralamasi AYNAN** · **1.14 — sonlar** · 2 — atamalar · 3 — repo · 4 — PM 16 naqshi · 5 — K12 · 7 — 18 sinf · 8 — `pm-m12d1-pitch`) · `00-TAQIQLAR.md` · `00-NOMLAR.md` · `00-MANBA.md` (1 — dastur 1-qator · 4 — o'tilgan atamalar · 6 — K12) · `qaror-0.json` (T1–T3, T18–T20) ·
13-Modul tayanchi (1.0, 1.13, 2, 7, 8 — `pm-m11d9-tasdiq`) va `00-TAQIQLAR.md` · 12-Modul tayanchi (1.12 — Mentorning besh bo'lakli pitchi · 116-qator — mahalla futbol guruhi · 8 — `pm-m10d12-pitch`, `pm-m10d10-hisobot`) ·
namunalar: 12-Modul `12-PmGrowthPitch-v3.md` + `12-FILTR.md` · 10-Modul `11-PmPitchRehearsal-v3.md` (K12, 4-ekran) + `11-FILTR.md` · `QURUVCHI_SABOQ.md` E 40–55 · `PM_Prompt_v8.md` K12 (228–231-qatorlar).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi** (dastur: «Pitchning birinchi chernoviki»; tayanch 1.1, 4): o'quvchi o'z mahsuloti uchun **investor pitchining qoralamasini** olti bo'lakka yozadi — **Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam** — har bo'lakka bitta-ikkita gap (≤160 belgi). <!-- TAXMIN T1 -->
   `pm-m10d12-pitch` (12-Modul besh bo'lagi) bor bo'lsa — Muammo, Yechim, Raqamlar, Keyingi qadam oldindan qo'yiladi; Bozor va Jamoa — yangi. Bittadan karta (E 53). Saqlanadi `pm-m12d1-pitch` (2, 5, 8, 11, 13-darslar o'qiydi — tayanch 8).
   Natija to'rt holatda bo'lishi mumkin (15-ekran sarlavhasi shunga qarab — sinf 6, E 54): olti bo'lak yozildi · olti bo'lak yozildi, lekin Keyingi qadamda pul yoki va'da so'zi qoldi · qisman yozildi · hech narsa yozilmagan. Belgi ✓ va nishon — faqat birinchisida.
   Faqat shu A-bo'limda (o'quvchi matnida yo'q — T-038): Mentor qoralamasi keyin 5, 8, 13-darslarda tuzatiladi (tayanch 1.1); pitch Demo Day 8 formatida — 5 daqiqa va savol-javob (dastur, `00-MANBA.md` 1).
2. **Bugungi asosiy fikr** (P-013; dars ichidagi o'q — yakunda KO'RSATILMAYDI, SABOQ E 50): Investor pitchida bozor va jamoa ham bor: har son manbasi bilan, oxirida esa pul emas — bitta aniq so'rov. (106)
3. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052; `00-MANBA.md` 4):**
   - 9–10-Modul: **pitch** · **zal** (pitchni tinglaydiganlar) · **repetitsiya** · **taymer** · **halol gap** · **baholash varag'i** · **fidbek** · **investor** — 10-Modulda Airbnb voqeasida aynan shunday ta'riflangan: «Investor — loyihaga pul tikadigan odam.» (`src/8-Modull/PmPitchRehearsalLesson.jsx` 1041; T-052 — so'zma-so'z qaytariladi).
     10-Modulda o'sha voqeada **bozor** va **jamoa** so'zlari ham chiqqan («bozor — mahsulotni ishlatishi mumkin bo'lgan odamlar qanchaligi, jamoa — loyihani qilayotgan odamlar»). Bugun ular pitch **bo'lagi** nomi bo'ladi; bozor ta'rifi — tayanch 2 dagisi (pastda, 4-band).
   - 11-Modul: **bo'lak** (pitchning qismi) · **jonli demo** · **tashkilotchi** · **o'yinchi** (rol bilan, ismsiz) · **agent** · **talab** · «Maydon Jamoa» — namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10».
   - 12-Modul: **Raqamlar** bo'lagi va besh bo'lak (Muammo · Yechim · Jonli demo · Raqamlar · Keyingi qadam) · **zal savollari** (`ZAL_SAVOL`: «Bu muammo borligini qayerdan bilasiz?» · «Mahsulot nima qiladi?» · «Bu son qayerdan va nimani sanaydi?» · «Endi nima qilasiz?») ·
     **dalil** (son yoki kuzatuv) · **metrika hisoboti** · **sanoq sahifasi** · **ro'yxatdan o'tgan** · sinfdoshlar alohida aytiladi · **mahalla futbol guruhi** (Telegram guruhi, 60 kishi — 12-Modul tayanchi 116-qator).
   - 13-Modul: **Pro** · **«Doimiy o'yin»** · **test rejim** · **yozma tasdiq** (real to'lov emas) · **taklif havolasi** · **Mentor tekshiruvi**.
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'riflar dars bo'yi so'zma-so'z (T-042):** <!-- TAXMIN T19 -->
   - **hakam** — «Pitchni baholaydigan odam — investor yoki tadbirkor — hakam deyiladi.» (2-ekran, 1-tugmadan keyin `QIzoh` — hakam savollari paydo bo'lgandan keyin). Tayanch 2: «hakam — Demo Day'da baho beradigan odam (investor, tadbirkor)»; «Demo Day» o'quvchi matnida yo'q (TAYANCHGA SAVOL 12).
   - **Bozor** (bo'lak) — «Bozor — mahsulotga muhtoj odamlar va biz bilgan ularning soni» (tayanch 2 aynan; 2-ekran, 2-tugmadan keyin `QIzoh`). **Jamoa** (bo'lak) — «Jamoa — mahsulotni kim qilayotgani» (tayanchda ta'rif yo'q — TAYANCHGA SAVOL 5).
   - **savol-javob** — «Pitch 5 daqiqa; undan keyin hakamlar savol beradi, siz javob berasiz — bu savol-javob deyiladi.» (2-ekran, 3-tugmadan keyin). Inglizchasi «Q&A» — faqat kartochkada bir marta.
   - **olti bo'lak** — «Bizda investor pitchi olti bo'lakdan iborat: Muammo, Bozor, Yechim, Raqamlar, Jamoa va Keyingi qadam.» (2-ekran xulosasi; kartochka 1; yakun) — «Bizda» — kurs qolipi, umumiy qoida emas (sinf 4; 12-Modul «Bizda 5 daqiqalik pitch…» naqshi).
   - **«hali tekshirilmagan»** (oddiy so'z, atama emas) — manbasi yo'q son o'rniga aytiladigan halol gap (5-ekran; tayanch 1.1).
   - **aniq so'rov** (oddiy so'z) — Keyingi qadamda hakamdan so'raladigan bitta narsa: tanishtirish, maslahat yoki sinash joyi; pul emas (9-ekran; TAQIQLAR 1).
   - **qoralama** (oddiy so'z, 9–13-Modul MD larida ishlatilgan) — pitchning birinchi yozma ko'rinishi.
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **Bo'lak nomlari — atoqli, bosh harf bilan** (tayanch 1.1): Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam. Dasturdagi «Metrikalar» va «Keyin» — o'quvchi matnida yo'q (faqat O'qituvchi eslatmasida bir marta). «Jonli demo» — endi alohida bo'lak emas, **Yechim bo'lagi ichida**.
   - **«jamoa» — uch joyda uchraydi (T-015 xavfi, TAYANCHGA SAVOL 6):** bo'lak nomi — har doim bosh harf bilan yoki «Jamoa bo'lagi»; mahsulot nomi — faqat qo'shtirnoqda «Maydon Jamoa»; futbol jamoasi ma'nosi — faqat Mentorning pitch gaplari ichida (olam matni, T-008: «jamoaga odam yig'ishda», «o'z jamoasiga»). Mening prozamda futbol ma'nosida «jamoa» yo'q.
   - **«slayd»** — faqat Airbnb taqdimotida (3-ekran, testlar, kartochka). Bizning pitch — **bo'lak**. **«taqdimot»** — faqat Airbnb («investorlar uchun birinchi taqdimot» — bank).
   - **«mahsulot»** — o'quvchining o'z mahsuloti (web yoki mobil — sinf 11); **«ilova»** — faqat Mentor misolida («Maydon Jamoa» — mobil ilova). Hakam savollarida — «mahsulot».
   - **«son»** — sanalgan miqdor; **«raqam»** — faqat «Raqamlar» bo'lagi nomida (12-Modul 9.43 f).
   - **«so'rov»** — Keyingi qadamdagi aniq so'rov. **«Yordam»** — faqat 11-ekrandagi tugma nomi. Mentor pitch gapidagi «Sizdan bitta so'rov: …» — olam matni (tayanch 1.1 aynan, T-008); mening izoh va testlarimda bu ma'noda «so'rov» (TAYANCHGA SAVOL 7).
   - **«hakam»** — pitchni baholaydigan odam; **«investor»** — loyihaga pul tikadigan odam (hakam bo'lishi mumkin). Sahnadagi qiyofalar — «hakam».
   - **«sinov»** — faqat real odam bilan («Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar», «Uch tashkilotchi bilan … sinayman», «sinash joyi»). **«tekshirish»** — o'z ishi. **«test»** — ballik savol yoki «test rejim».
   - **Ishlatilmaydi:** Metrikalar, Keyin (bo'lak nomi sifatida) · Q&A (prozada) · TAM/SAM/SOM · «bozor hajmi» (manbasiz) · jyuri, komissiya · «investitsiya kerak» · CTO va boshqa lavozim nomlari · startap · «sir» · «albatta» · «darrov» · «kafolat» · «eng yaxshi pitch».
6. **Mentor misoli — «Maydon Jamoa» qoralamasi (bitta manba `JAMOA_PITCH`, 180-qonun; tayanch 1.1 AYNAN, sonlar 1.14; o'quvchiga «Mentor misolida»):** <!-- TAXMIN T1, T2, T3 -->

| Bo'lak (vaqt — «bu mashqda», TAYANCHGA SAVOL 3) | Matn (o'quvchi ko'radi) | Tayanch |
|---|---|---|
| Muammo (≈40 soniya) | «O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.» (129) | 1.1 + 12-Modul 1.12 (12-Modul pitchidagi muammo gapi — TAYANCHGA SAVOL 2) |
| Bozor (≈30 soniya) | «Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.» (103) | 1.1 (T2), 1.14 |
| Yechim (≈1,5 daqiqa, jonli demo bilan) | «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.» (107) + jonli demo (≈1 daqiqa): 1-telefonda «Qo'shilaman» → 2-telefonda «8 / 10» o'rniga «9 / 10» | 1.1, 12-Modul 1.12 |
| Raqamlar (≈1 daqiqa) | «51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi. 3 tashkilotchi Pro'ga yozma tasdiq berdi — bu hali to'lov emas.» (139) | 1.1, 1.14 |
| Jamoa (≈30 soniya) | «Men — g'oya, mahsulot va kod (agent bilan). Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.» (93) | 1.1 |
| Keyingi qadam (≈50 soniya) | «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinayman. Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.» (130) | 1.1 (T3) |

   - Jami — 5 daqiqa (40 + 30 + 90 + 60 + 30 + 50 soniya); keyin savol-javob. Taqsimot — mashq uchun boshlang'ich («bu mashqda»), tayanchda yo'q (TAYANCHGA SAVOL 3).
   - **12-Moduldagi besh bo'lak (`JAMOA_PITCH_12`, 12-Modul tayanchi 1.12 aynan — 0, 2, 9-ekranlarning «oldin» holati):** Muammo — «O'yinchilar jamoaga odam yig'ishda qiynaladi.» + dalil · Yechim — yechim gapi · Jonli demo — «Qo'shilaman» → «9 / 10» ·
     Raqamlar — «44 kishidan 11 tasi — sinfdoshlarim; ikkinchi haftada o'sish sekinlashdi (18 dan keyin 6).» (sahnada — birinchi qismi «44 kishidan 11 tasi — sinfdoshlarim»: «6» Bozordagi 6 bilan aralashmasin) · Keyingi qadam — «E'lon berilgach «Havolani ulashish» tugmasi bilan tashkilotchi havolani o'z jamoasiga yuboradi — maqsad 50.»
   - **Hakam savollari (`HAKAM_SAVOL`, bitta manba — P-063; kurs savollari, real hakamning so'zi emas — TAYANCHGA SAVOL 4):** Muammo — «Bu muammo borligini qayerdan bilasiz?» · **Bozor — «Bu mahsulot yana qancha odamga kerak?»** · Yechim — «Mahsulot nima qiladi?» ·
     Raqamlar — «Bu son qayerdan va nimani sanaydi?» · **Jamoa — «Buni kim qilyapti?»** · Keyingi qadam — «Endi nima qilasiz?» (to'rttasi 12-Modul `ZAL_SAVOL` aynan; ikkitasi yangi — topshiriqdagi «bozor qancha?», «kim qiladi?» dan).
   - Mentor qoralamasi — namuna, majburiy shakl emas (sinf 4): «Mentor misolida …», «bu misolda …».
7. **Sonlar (faqat tayanch 1.14):** 5 dan 4 (Muammo dalili) · 60 (mahalla futbol guruhi) · 6 (tashkilotchilar) · 51 · 11 · 7 (foydalanuvchilar) · 3 (yozma tasdiq) · 50 (12-Moduldagi maqsad) · «8 / 10» → «9 / 10» (namuna o'yin) · 44, 18, 6 — faqat 12-Moduldagi Raqamlar gapida (oldingi holat).
   Birliklar: «kishi» — guruh a'zosi · «tashkilotchi» — ilovadagi hisob (rol) · «foydalanuvchi» — ro'yxatdan o'tgan hisob · «tasdiq» — odamning yozma javobi. **Har xil o'lchovdagi sonlar qo'shilmaydi va ayirilmaydi** (60 va 6 — 5-ekran `QIzoh`).
   Pro'ni yoqqanlar, Telegram'ni ulaganlar soni — yo'q, to'qilmaydi. Ikkinchi misol (testlar, P-002) — kitob almashish ilovasi: «maktab chatida 120 kishi» — mashq soni. Boshqa son yo'q.
8. **Keys — K12 Airbnb pitch deck (tayanch 5; bank so'zi aynan, raqamsiz; ruscha asli `PM_Prompt_v8.md` 228–231):** «Investorlar uchun birinchi taqdimot — o'nga yaqin oddiy slayd: muammo → yechim → bozor → mahsulot → jamoa. Eng ko'p tahlil qilinadigan pitchlardan biri, ochiq turadi.» <!-- TAXMIN T18 -->
   Brend izohi (S-018, 1/3 kadrda Mentor gapida; 10-Moduldagi bilan aynan): «Airbnb — begonaning uyida ijaraga turish xizmati». Nom «Airbnb» o'z rangida (#FF5A5F — 10-Modul TAYANCHGA SAVOL 9 ✅), logotip yo'q.
   **Bugungi burchak** (10-Moduldagi «tartib muammodan boshlanadi» burchagidan farqli): investorlar uchun taqdimotda muammo va yechimdan tashqari **bozor** va **jamoa** slaydi ham bor — bizning pitchga ham shu ikki bo'lak qo'shildi.
   Tartib farqi ochiq aytiladi (O'qituvchi eslatmasi): Airbnb'da bozor yechimdan keyin, bizda — muammodan keyin (kurs tartibi, dastur bo'yicha); ikkalasi ham yagona to'g'ri yo'l emas. «Mahsulot» slaydi — bizda Yechim ichidagi jonli demo.
   Bankdan tashqari fakt (yil, slaydlar soni raqam bilan, pul, real taqdimotdagi boshqa slayd nomlari) — yo'q. Distraktorlarda real taqdimotda bo'lishi mumkin bo'lgan slayd nomlari ishlatilmaydi (Shubhali joylar).
9. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✗ ✕ › — belgilar. Hakam qiyofalari, telefon, taymer chizig'i, slayd tasmasi — chizilgan (CSS/SVG), logotip yo'q. O'yin qatlami (arena, nishon medali, podium) — mustasno.
   Kafolat so'zlari yo'q: «investor pul beradi», «hakam albatta so'raydi» — yo'q; hakam savollari — «kurs savollari» (pufak), voqea emas.
10. **Xavfsizlik va pul (sinf 9, 17; TAQIQLAR 1, 3):** pitchda va kalitda ism, familiya, maktab, telefon yo'q — odamlar roli bilan («men», «sinfdoshim», «tashkilotchi»); Jamoa kartasida kulrang qator «Rol bilan yozing, ismsiz» · <!-- TAXMIN T3 -->
    Keyingi qadamda pul summasi, ulush, «investitsiya kerak» yo'q — tekshiruv yo'naltiradi, nishon berilmaydi · Pro — test rejimda; «yozma tasdiq — hali to'lov emas» (Raqamlar gapi, tekshiruv) · o'quvchi Mentor nomidan tasdiqlamaydi.
11. **Trek (sinf 11):** ikkala trekka bitta matn — «mahsulot» so'zi; Yechim ichidagi jonli demo — 12-Moduldagidek (mobil trek — ikki telefon yoki brauzer ko'rinishi; web-trek — ikki brauzer oynasi, boshqa akkaunt bilan). Trek kaliti o'qilmaydi.
12. **Kod mexanikasi:** kod ekrani yo'q (tayanch 4). Darsning o'z mexanikalari: olti bo'lakli sahna (2, 5, 7, 9) · keys tasmasi (3) · tartib-mashqi (10) · bittadan karta (11). 12-Moduldagi kod oynasi va juftlik repetitsiyasi takrorlanmaydi (5, 8-darslar ishi).
13. **Vaqt taqsimoti — 90 daqiqa (sinf 1 — reja, o'lchov emas):** kirish va reja (0, 1) ≈ 5 · olti bo'lak (2) ≈ 8 · Airbnb (3) ≈ 6 · Bozor (5) ≈ 7 · Jamoa (7) ≈ 6 · Keyingi qadam (9) ≈ 7 · to'rt ballik test (4, 6, 8, 12) ≈ 8 · Mentor qoralamasi (10) ≈ 5 ·
    o'z qoralamasi (11) ≈ 22 · podium, kartochkalar, arena, yakun (13–15) ≈ 14 → jami ≈ 88; 2 daqiqa zaxira.
    **Ulgurmasangiz:** 10-ekran — jonli darsda Mentor o'tkazishi mumkin (`optionalLive`), tartib Sahnada ochiq ko'rsatiladi · 11-ekran — olti karta to'lmasa, yozilgani saqlanadi, qolgani — uyga vazifa ①; yakun sarlavhasi «hali tugamagan» (E 54) · arena vaqti qisqarsa — kartochkalar uyda.
    ⛔ Taqsimot — reja: «qur» pilotida 12–15 o'quvchi bilan taymer (ayniqsa 11-ekran — 22 daqiqa); «sig'adi» deyilmaydi.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.0):** «Maydon Jamoa» 13-Modul oxirida — 51 foydalanuvchi, 6 tashkilotchi, test rejimdagi Pro va 3 yozma tasdiq; 12-Modulda besh bo'lakli pitch zalga aytilgan → **bugun: o'sha pitch investor uchun qayta quriladi** (yangi funksiya yo'q).
- **12-Modul ko'prigi (takrorlanmaydi):** u yerda 5 daqiqa, besh bo'lak, Raqamlar bo'lagi, o'sish grafigi, ikki qurilmali jonli demo va juftlikda baholash o'rgatilgan. Bugun — ikki yangi bo'lak (Bozor, Jamoa), jonli demo Yechim ichiga, pitchdan keyin savol-javob, Keyingi qadamda aniq so'rov.
- **Dars ipi:** 0 — besh bo'lakli pitch qaysi savolga javob topolmaydi → 2 — hakam ikki savol beradi, ikki yangi bo'lak qo'shiladi, jonli demo Yechim ichiga kiradi, 5:00 dan keyin savol-javob (atamalar «hakam», «Bozor», «Jamoa», «savol-javob») →
  3 — Airbnb: investorlar uchun taqdimotda bozor va jamoa slaydi → 4 — test → 5 — Bozorga qaysi son: manbasi bori, qolgani «hali tekshirilmagan» → 6 — test → 7 — Jamoa: bitta odam, agent — asbob, sinab ko'rganlar alohida → 8 — test →
  9 — Keyingi qadam: maqsad 50 bajarildi, yangi ish va bitta aniq so'rov, pul emas → 10 — Mentor qoralamasini tartiblaydi → 11 — o'z qoralamasini olti kartaga yozadi → 12 — yakuniy savol → podium → kartochkalar → yakun.
- **Bitta vizual — `OltiBolakSahna` (dars bo'yi, 163/180; bitta manba `JAMOA_PITCH` + `JAMOA_PITCH_12` + `HAKAM_SAVOL` + o'quvchi qoralamasi `pm-m12d1-pitch`; 12-Modul `BeshDaqiqaSahna` naqshi, dars ichida yoziladi — K-020):**
  - **chapda — telefon** (≈170×272, barqaror): «Maydon Jamoa» (nom o'z rangida, 11-Modul yashili; logotip yo'q) — «O'yin» ekrani: «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · «Qo'shilaman». Yechim joriy bo'lganda «8 / 10» → «9 / 10» (son bir lahza kattalashib, silliq qaytadi).
  - **o'ngda — bo'laklar** (ustma-ust ixcham kartalar, bir balandlikda): bo'lak nomi va 1–2 qator matn. Holatlar: bo'sh (kulrang uzuq chiziq, U-041) → joriy (accent chegara) → yozildi (matn sirg'alib kiradi, ~1 s yashil) → ✓ (hakam savoliga javob bor) → yangi (sirg'alib kiradi, accent chegara 1 s).
    Ikki ko'rinish: **besh bo'lak** (12-Modul holati) va **olti bo'lak** (bugungi). O'tish — 2-ekranda: Bozor va Jamoa kartalari orasiga sirg'alib kiradi, Jonli demo kartasi Yechim kartasi ichiga kichrayib kiradi (Yechimda kulrang yorliq «jonli demo»).
  - **bo'laklar ostida — taymer chizig'i** 0–5:00: besh bo'lakli (`[40, 20, 90, 90, 60]` s — 12-Modul) yoki olti bo'lakli (`[40, 30, 90, 60, 30, 50]` s), har bo'lak ostida nomi; 5:00 dan keyin alohida uzuq bo'lak **«savol-javob»** (o'lchami vaqtsiz, belgisiz).
  - **bo'laklar ustida — hakamlar:** uchta real ko'rinishdagi qiyofa (bosh, soch, rangli kiyim — D 36), ismsiz; bitta savol pufagi (`HAKAM_SAVOL`); bo'lak javob bersa — pufak o'rnida yashil ✓.
  - Ishlatiladi: 0 (besh bo'lak + bitta hakam) · 1 (matnsiz skelet) · 2 (besh → olti) · 5, 7, 9 (bitta bo'lak joriy, telefonsiz — SABOQ 24) · 10 (tartibdan keyin — to'liq qoralama) · 11 (o'quvchi bo'laklari) · testlar javobidan keyingi kichik vizual.
    3-ekran — o'z sahnasi `AirbnbTasma`. `prefers-reduced-motion` da harakat to'xtaydi, yakuniy holat birdan qo'yiladi. Telefon kengligida (393) bo'laklar telefon ostiga tushadi. Vizual ⛶ ichida (q17).
- **Keyingi bosiladigan joy (SABOQ 11, E 40):** har holatda bitta faol element — yengil accent halqa, to'lqin 2–3 marta; tanlov guruhida har variantning o'z chegarasi. Yoqilgan pastki tugma ham halqada.
- **Bashorat (SABOQ 11, 25, E 42):** tanlangach yo'qolmaydi — savol va tanlangan javob ixcham qator bo'lib natijagacha turadi; natija — yashil xulosa qutisining birinchi kichik qatori: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: …»; `QIzoh` — o'sha qutining oxirgi kichik qatori.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → narsa joyidan joyiga uchadi (pufak bo'lakka, son kartasi bo'lakka, gap uyaga) · yangi qator ~1 s yashil yonadi · son sanab o'sadi. Bezak-harakat (to'xtovsiz miltillash) yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Investorga pitchni qanday tuzasiz?** (34) — dars nomi (DE-205) <!-- TAXMIN T20 -->
- Mentor: Investor — loyihaga pul tikadigan odam: 12-Moduldagi besh bo'lakli pitchni u eshitsa, qaysi savolga javob topolmaydi?
- Maket (chap): `OltiBolakSahna` besh bo'lak holatida — o'quvchining `pm-m10d12-pitch.bolaklar` dan har bo'lakning birinchi qatori (yo'q bo'lsa — `JAMOA_PITCH_12`, ustida kulrang yorliq «Mentor misoli»); ostida taymer chizig'i 5:00 gacha to'lgan; ustida bitta hakam qiyofasi, pufagida «?». Telefon bu ekranda yo'q (≤ 3 blok: maket · variantlar · javob).
- Variantlar (radio, o'ng; bir uzunlikda; `HAKAM_SAVOL` dan):
  - Bu mahsulot yana qancha odamga kerak <!-- TAXMIN T1 -->
  - Bu muammo borligini qayerdan bilasiz
  - Bu son qayerdan va nimani sanaydi
- Javob — «qancha odamga»: **Aynan!** Besh bo'lakda bu savolga alohida joy yo'q — pitchga yangi bo'lak kerak.
- Javob — «muammo»: **Qiziq fikr!** Bu savolga Muammo bo'lagidagi dalil javob beradi — u besh bo'lakda bor.
- Javob — «son»: **Qiziq fikr!** Bu savolga Raqamlar bo'lagi javob beradi — u ham besh bo'lakda bor.
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan savol hakam pufagiga yoziladi va variant ixcham qator bo'lib qoladi; «muammo» yoki «son» tanlansa — mos bo'lak yashil ✓ bilan yonadi;
  «qancha odamga» tanlansa — hech bir bo'lak yonmaydi, Muammo va Yechim orasida nomsiz uzuq joy accent halqa bilan paydo bo'ladi (nomi yozilmaydi — 2-ekran kashfiyoti, P-036). Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant, har birining o'z chegarasi (navbatma-navbat to'lqin); tanlovdan keyin «Davom etish».
- O'qituvchi eslatmasi: 12-Modulda pitch zalga — sinfga aytilgan. Bugun tinglovchi — investor. «Bozor», «hakam» so'zlarini hozir aytmang — 2-ekranda o'zi chiqadi. Pitchi saqlanmagan o'quvchi Mentor misolining besh bo'lagini ko'radi.
  Sinfdan so'rang: pitchingizni eshitgan odam yana nimani bilmoqchi bo'ladi?

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun investor uchun pitch qoralamasini yozasiz.** (48)
- Mentor: 12-Moduldagi pitchingiz saqlangan bo'lsa, uning bo'laklari qoralamaga o'zi qo'yiladi.
- Chap — «Dars oxirida» + kulrang yorliq **olti bo'lak: muammo, bozor, yechim, raqamlar, jamoa, keyingi qadam** (App.jsx osti — TAYANCHGA SAVOL 1 taklifi; hozirgi App.jsx yozuvi «… metrikalar, jamoa, keyin» — KOD 12) <!-- TAXMIN T1 -->
  + vizual: Sahna skeleti — oltita nomsiz bo'lak (kulrang chiziqlar) va taymer chizig'i; chiziqlar 0.6 s oraliqda birma-bir to'q bo'ladi, oxirida taymer 5:00 gacha yuradi va yonida kichik uzuq bo'lak yonadi. Matnsiz, telefonsiz — 2-ekran kashfiyotini ochmaydi (P-015).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Investor uchun pitch qanday tuzilishini bilib olasiz · `olti bo'lak`
  - 02 · Mahsulot kimga kerakligini va uni kim qilayotganini aytishni o'rganasiz · `bozor · jamoa`
  - 03 · Pitch oxirida nima so'rashni bilib olasiz · `keyingi qadam` <!-- TAXMIN T3 -->
  - 04 · O'z mahsulotingiz uchun pitch qoralamasini yozasiz · `qoralama`
- Harakat yo'q (reja ekrani) — vizual o'zi yoziladi. Tugmalar: Orqaga · Boshlaymiz · Keyingi bosiladigan joy: «Boshlaymiz» (vizual tugagach halqada).
- Izoh (MD): sarlavhada yangi atama yo'q (T-011) — «bozor», «jamoa», «hakam» qadam matnida emas, faqat kulrang tegda. «pitchingiz» — 12-Moduldagi pitch o'quvchida bor (T-039); bo'lmasa ham dars yo'li bor (11-ekran bo'sh kartalar). Kulrang yorliq olti nomni aytadi — App.jsx bilan so'zma-so'z (P-015; 12-Modul naqshi).

## 2 · Olti bo'lak  ← QTushuncha (markaziy, ketma-ket 3 tugma)
- Eyebrow: Tushuncha · olti bo'lak
- Sarlavha: **Investor uchun pitchga nima qo'shiladi?** (39) — 0-ekran savoliga javob beradigan ekran (T-064)
- Mentor: Tugmalarni birma-bir bosing va pitch qanday o'zgarishiga qarang.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — bitta o'lchov, o'sish tartibida): **Mentor pitchiga nechta yangi bo'lak qo'shiladi?** · Bitta · Ikkita · Uchta — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi. <!-- TAXMIN T1 -->
- Vizual (`OltiBolakSahna`, besh bo'lak holati): **chapda** telefon («O'yin» ekrani) · **o'ngda** besh bo'lak — Muammo · Yechim · Jonli demo · Raqamlar · Keyingi qadam (`JAMOA_PITCH_12`, bir qatordan), ostida taymer chizig'i 0–5:00 (besh bo'lakli) · **ustida** uchta hakam qiyofasi, pufakda «?».
- Tugmalar (ixcham, bir qatorda; joriysi accent, bosilgani ✓): 1 Hakam savollari · 2 Yangi bo'laklar · 3 Besh daqiqa va savol-javob
- **Harakat → Vizual o'zgarish:**
  1. «Hakam savollari» → hakam pufaklarida ikki savol paydo bo'ladi: «Bu mahsulot yana qancha odamga kerak?» · «Buni kim qilyapti?»; besh bo'lakning hech biri yashil bo'lmaydi — pufaklar ostida kulrang «?» qoladi.
     `QIzoh`: Pitchni baholaydigan odam — investor yoki tadbirkor — hakam deyiladi. <!-- TAXMIN T19 -->
  2. «Yangi bo'laklar» → Muammo va Yechim orasiga yangi bo'lak sirg'alib kiradi — nomi **Bozor**, ichida «Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi.»; Raqamlar va Keyingi qadam orasiga — **Jamoa**, ichida «Men — g'oya, mahsulot va kod (agent bilan).»;
     har pufak o'z bo'lagi ustiga uchib, yashil ✓ bo'ladi. Jonli demo kartasi Yechim kartasi ichiga kichrayib kiradi (Yechimda kulrang yorliq «jonli demo»; telefonda «8 / 10» → «9 / 10»).
     `QIzoh`: Bozor — mahsulotga muhtoj odamlar va biz bilgan ularning soni; Jamoa — mahsulotni kim qilayotgani. <!-- TAXMIN T1 -->
  3. «Besh daqiqa va savol-javob» → taymer chizig'i olti bo'lakka qayta bo'linadi (jami 5:00, har bo'lak ostida nomi); 5:00 dan keyin alohida uzuq bo'lak **savol-javob** qo'shiladi, hakam qiyofalari shu bo'lak ustiga o'tadi, pufakda «?».
     `QIzoh`: Pitch 5 daqiqa; undan keyin hakamlar savol beradi, siz javob berasiz — bu savol-javob deyiladi. <!-- TAXMIN T1, T19 -->
  Natija (yashil xulosa qutisining birinchi kichik qatori — E 42): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: ikkita».
  Ipucha (40 s harakatsizlikda; javobni aytmaydi): Yoqilgan tugmani bosing — pitch qanday o'zgarishini ko'ring.
- Xulosa: Bizda investor pitchi olti bo'lakdan iborat: Muammo, Bozor, Yechim, Raqamlar, Jamoa va Keyingi qadam. <!-- TAXMIN T1 -->
- Tugma (pastki): Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar qatori yo'qoladi, Sahna butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy tugma (to'lqin 2–3 marta) → «Davom etish».
- O'qituvchi eslatmasi: Dasturda bo'laklar «Metrikalar» va «Keyin» deb yozilgan; bizda — 12-Moduldagi nomlar: Raqamlar va Keyingi qadam. Bozor muammodan keyin turadi: muammo kimda ekanini aytgach, ular qanchaligi aytiladi — bu kurs tartibi (Airbnb'da boshqa tartib — keyingi ekran).
  Taqsimot (bu mashqda): Muammo ≈40 s · Bozor ≈30 s · Yechim jonli demo bilan ≈1,5 daqiqa · Raqamlar ≈1 daqiqa · Jamoa ≈30 s · Keyingi qadam ≈50 s; o'quvchi pitchida boshqacha bo'lishi mumkin, jami 5 daqiqa.
  Hakam savollari — kurs savollari (12-Moduldagi zal savollari naqshi), real hakamning gapi emas. 10-Modulda Airbnb voqeasida bozor va jamoa so'zlari ko'rilgan; bugun ular pitch bo'lagi bo'ldi.

## 3 · Airbnb  ← QVoqea (PM keys K12; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **Airbnb investorlarga qanday taqdimot ko'rsatgan?** (48) <!-- TAXMIN T18 -->
- Nuqtalar (3) · yorliq **Airbnb · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 Mentor gapida, S-018): «Airbnb — begonaning uyida ijaraga turish xizmati». Nom «Airbnb» o'z rangida (#FF5A5F), logotip yo'q.
- Mentor — kadr gapini aytadi, har kadrda almashadi (≤ 2 gap; SABOQ 8). Sahnada faqat kadr nomi va jonli maket.
- Sahna (`AirbnbTasma`, chizilgan CSS/SVG; 10-Modul `PitchSahna` Airbnb holati naqshi, dars ichida): tanish taqdimot ko'rinishi — o'nga yaqin oddiy oq slayd-karta tasmasi (son yozilmaydi), tepada «Airbnb» nom-yorlig'i; zal, taymer, telefon yo'q. Bankda yo'q narsa chizilmaydi.
  - 1/3 **Investorlar uchun taqdimot** — Mentor: Airbnb — begonaning uyida ijaraga turish xizmati. Uning investorlar uchun birinchi taqdimoti — o'nga yaqin oddiy slayd.
    · sahna: oq slaydlar tasmasi birma-bir chiqadi, hammasi bo'sh.
  - 2/3 **Muammo va yechim** — Mentor: Taqdimot muammo va yechimdan boshlangan.
    · sahna: birinchi ikki slaydga nom yoziladi: «Muammo» · «Yechim»; keyingi uch slayd o'rnida kulrang «?» (sahna javobni ochmaydi — P-053 `pre` kadr).
    · bashorat (sahna ostida, bitta qator; S-015 — bitta o'lchov: o'rin, boshidan oxiriga): **Jamoa slaydi tartibda qayerda turgan?** · Boshida · O'rtasida · Oxirida — tanlangach ixcham qator natijagacha turadi. <!-- TAXMIN T18 -->
  - 3/3 **Muammodan jamoagacha** — Mentor: Tartib shunday: muammo, yechim, bozor, mahsulot, jamoa. Taqdimot ochiq turadi: u eng ko'p tahlil qilinadigan pitchlardan biri.
    · sahna: «?» o'rnida nomlar birma-bir yoziladi: «Bozor» · «Mahsulot» · «Jamoa»; «Bozor» va «Jamoa» slaydlari accent chegara bilan bir lahza ajraladi.
- Bashorat natijasi (yashil xulosa qutisining birinchi kichik qatori): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: oxirida»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Voqea davomi» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, kadr nomi va sahna almashadi (slaydlar chiqadi, nom yoziladi, «Bozor» va «Jamoa» ajraladi).
- Xulosa (3/3 dan keyin, pastda, yashil): Bu voqeada investorlar uchun taqdimotda bozor va jamoa slaydi ham bo'lgan.
- Tugma (pastki): Voqea davomi (N/3) → Davom etish
- Keyingi bosiladigan joy: «Voqea davomi» (halqada) → 2/3 da bashorat variantlari (har birining o'z chegarasi) → «Voqea davomi» → «Davom etish».
- O'qituvchi eslatmasi: Airbnb oldingi modulda ko'rilgan (taqdimot muammodan boshlanadi); bugungi savol boshqa — investorlar uchun taqdimotda yana nima bor. Tartib bizning pitchdan farq qiladi: Airbnb'da bozor yechimdan keyin, bizda — muammodan keyin;
  ikkalasi ham yagona to'g'ri yo'l emas. «Mahsulot» slaydi — bizda Yechim ichidagi jonli demo. Taqdimot internetda ochiq — vaqt bo'lsa, proyektorda bir marta varaqlab ko'rsating.
  Slaydlar soni, yil, pul, boshqa slayd nomlari aytilmaydi (bank: raqamsiz). Airbnb — misol: «hamma investor pitchi shunday» degan qoida chiqarmang.
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K12 (228–231) · tayanch 5 (o'zbekcha matn) · 10-Modul `11-PmPitchRehearsal-v3.md` 4-ekran (brend izohi, rang).

## 4 · 1-savol  ← QTest (✔ B, `correctIdx 1`; Airbnb qoidasi — zal pitchidan investor pitchiga)
- Eyebrow: Tekshiruv · Airbnb'dagidek
- Savol: **Airbnb'dagidek, zalga aytilgan pitchni investorga qanday moslaysiz?** · savol ustida yorliq yo'q (SABOQ 6) <!-- TAXMIN T1, T18 -->
  - A — Jonli demoni pitchdan olib tashlayman
  - ✔ B — Bozor va Jamoa bo'laklarini qo'shaman
  - C — Har bo'lakka uzun matn va jadval qo'shaman
  - D — Muammo bo'lagini pitch oxiriga ko'chiraman
- To'g'ri izohi: Airbnb taqdimotida ham bozor va jamoa slaydi bo'lgan.
- Xato izohlari: A — Jonli demo pitchda qoladi — u Yechim ichida. · C — Airbnb slaydlari oddiy bo'lgan, uzun emas. · D — Airbnb taqdimoti muammodan boshlangan. ·
  (umumiy) Airbnb taqdimotida qaysi slaydlar bor edi?
- Javob topilgach (QuestionScreen `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): olti bo'lak ixcham, Bozor va Jamoa accent chegara bilan bir lahza ajraladi.
- Izoh (MD): uch distraktor uch turkumda (S-004, sinf 8): A — tuzilma (demo olinadi), C — hajm (Airbnb «oddiy slayd»iga zid), D — tartib (Airbnb muammodan boshlagan). «bo'lak» B, C, D da, «qo'shaman» B va C da — kalit so'z faqat to'g'rida emas.
  Real Airbnb taqdimotidagi bankdan tashqari slaydlar (raqobat, daromad va b.) variantga olinmadi — distraktor hayotda rost bo'lib qolmasin.

## 5 · Bozor  ← QTushuncha (ketma-ket, 3 son kartasi)
- Eyebrow: Tushuncha · Bozor bo'lagi
- Sarlavha: **Bozor bo'lagiga qaysi sonlar yoziladi?** (38)
- Mentor: Son kartalarini birma-bir bosing: qaysi biri Bozor bo'lagiga tushishini ko'ring.
- Bashorat (ballsiz; S-015 — bitta o'lchov: qamrov, kichikdan kattaga): **Mentor misolida Bozorga qaysi sonlar yoziladi?** · Faqat ilovadagi sonlar · Ilova va guruhdagi sonlar · Butun shahar sonlari — tanlangach ixcham qator; kartalar shundan keyin yoqiladi.
- Vizual (keng, ≤ 3 blok; telefon bu ekranda yo'q — SABOQ 24): `OltiBolakSahna` — Bozor bo'lagi joriy (bo'sh, accent chegara), qolgan bo'laklar ixcham; ustida hakam pufagi «Bu mahsulot yana qancha odamga kerak?».
  O'ngda uchta son kartasi (har birida: son · kimlar · kulrang manba yorlig'i):
  1 «60 kishi» · mahalla futbol guruhi · manba: Telegram guruhi
  2 «6 tashkilotchi» · ilovada · manba: Database
  3 «?» · boshqa mahallalar · manba: yo'q
- **Harakat → Vizual o'zgarish:**
  1. «60 kishi» kartasi → Bozor bo'lagiga uchadi: «Mahalla futbol guruhida — 60 kishi» (ostida kulrang manba yorlig'i «Telegram guruhi»).
  2. «6 tashkilotchi» kartasi → davomiga qo'shiladi: «; ilovada — 6 tashkilotchi.» (manba «Database»).
     `QIzoh`: 60 va 6 qo'shilmaydi: biri guruhdagi odamlar, biri ilovadagi tashkilotchilar.
  3. «?» kartasi → bo'lakka uchmaydi: kartadagi «manba: yo'q» qizil chet bilan bir lahza silkinadi, so'ng Bozor bo'lagiga gap yoziladi: «Boshqa mahallalarni hali tekshirmaganmiz.»; hakam pufagi o'rnida yashil ✓.
     `QIzoh`: Manbasi yo'q son Bozorga yozilmaydi — «hali tekshirilmagan» deyiladi. <!-- TAXMIN T2 -->
  Natija (yashil xulosa qutisining birinchi kichik qatori): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: ilova va guruhdagi sonlar».
  Ipucha (40 s): Yoqilgan kartani bosing — Bozor bo'lagi qanday to'lishini ko'ring.
- Xulosa: Bu misolda Bozorda faqat manbasi bor sonlar turadi, qolgani — «hali tekshirilmagan». <!-- TAXMIN T2 -->
- Tugma (pastki): Kartalarni bosing (N/3) → Davom etish · `tugadi`: kartalar yo'qoladi, Bozor bo'lagi kattalashib fokusga keladi (DE-199); vizual ⛶ ichida.
- Keyingi bosiladigan joy: bashorat → joriy son kartasi (to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: Bozor — mahsulotga muhtoj odamlar va biz bilgan ularning soni. Raqamlar bo'lagidan farqi: Raqamlarda — mahsulot ishga tushgach nima sanalgani; Bozorda — kimga kerakligi va ular qanchaligi.
  6 tashkilotchi Bozorda ham aytiladi: Pro shular uchun (13-Modul). Tashqi son (shahar, mamlakat) — faqat manbasi va sanasi bilan; sinfda qidirib o'tirmang — uyga vazifa ②. «Bozor hajmi», TAM/SAM/SOM — bu kursda ishlatilmaydi.
  Sinfdan so'rang: sizning mahsulotingiz kimga kerak va siz ularning sonini qayerdan bilasiz?

## 6 · 2-savol  ← QTest (✔ D, `correctIdx 3`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Tekshiruv · Bozor bo'lagi
- Savol: **Kitob almashish ilovasi: shahar sonini topolmadingiz. Bozorda nima deysiz?** · savol ustida yorliq yo'q <!-- TAXMIN T2 -->
  - A — «Shahardagi minglab o'quvchiga bu kerak» deyman
  - B — «Yil oxirigacha hamma maktabga yetamiz» deyman
  - C — «Bozor haqida pitchda gapirmayman» deyman
  - ✔ D — «Chatda 120 kishi, shahar hali noma'lum» deyman
- To'g'ri izohi: Manbasi bor son aytiladi, qolgani — hali tekshirilmagan.
- Xato izohlari: A — Bu son qayerdan? Manbasiz son Bozorga yozilmaydi. · B — Bu va'da — bugun bilgan soningiz qancha? · C — Bozor bo'lagi «qancha odamga kerak?» savoliga javob. ·
  (umumiy) Mentor boshqa mahallalar haqida nima degan edi?
- Javob topilgach (kichik, savol ostida): Mentorning Bozor bo'lagi ixcham — «Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.»
- Izoh (MD): uch distraktor uch turkumda: A — manbasiz katta son (halollik), B — kelajak va'dasi (sinf 16), C — bo'lakni tashlash (tuzilma). To'rttasi ««…» deyman» shaklida; «shahar» A va D da — kalit so'z faqat to'g'rida emas.
  A — «minglab» hayotda rost bo'lishi mumkin, lekin savol sonni **topolmadingiz** deydi: manbasiz aytish — darsning qoidasi bo'yicha xato (S-004). 120 — mashq soni (P-002).

## 7 · Jamoa  ← QTushuncha (ketma-ket, 3 tugma)
- Eyebrow: Tushuncha · Jamoa bo'lagi
- Sarlavha: **Mahsulotni kim qilayotganini qanday aytasiz?** (44)
- Mentor: Tugmalarni birma-bir bosing va Jamoa bo'lagi qanday yozilishini ko'ring.
- Bashorat (ballsiz; S-015 — bitta o'lchov: son, o'sish tartibida): **Mentor misolida mahsulotni nechta odam qilyapti?** · Bitta · Uchta · Beshta — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi.
- Vizual (keng; telefonsiz): `OltiBolakSahna` — Jamoa bo'lagi joriy (bo'sh), ustida hakam pufagi «Buni kim qilyapti?»; Jamoa bo'lagi yonida bitta odam qiyofasi (rol yorlig'i hali yo'q).
- Tugmalar (ixcham, bir qatorda): 1 Kim nima qildi · 2 Agent · 3 Sinab ko'rganlar
- **Harakat → Vizual o'zgarish:**
  1. «Kim nima qildi» → Jamoa bo'lagiga yoziladi: «Men — g'oya, mahsulot va kod»; odam qiyofasi ostida uchta kichik yorliq birma-bir paydo bo'ladi: g'oya · mahsulot · kod — hammasi bitta odamda.
  2. «Agent» → gapga « (agent bilan)» qo'shiladi; qiyofa yonida kichik asbob belgisi (kulrang, odam emas) paydo bo'ladi, «kod» yorlig'iga ingichka chiziq bilan ulanadi.
     `QIzoh`: Agent — asbob, jamoa a'zosi emas: talabni Mentor yozdi, natijani o'zi tekshirdi.
  3. «Sinab ko'rganlar» → «Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.» qo'shiladi; ular Jamoa bo'lagidan tashqarida, alohida kulrang qatorda chiziladi (6 ta kichik qiyofa); hakam pufagi o'rnida yashil ✓.
     `QIzoh`: Sinab ko'rgan real odamlar ham aytiladi, lekin ular jamoa a'zosi deb aytilmaydi.
  Natija (yashil xulosa qutisining birinchi kichik qatori): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: bitta».
  Ipucha (40 s): Yoqilgan tugmani bosing — Jamoa bo'lagiga nima yozilishini ko'ring.
- Xulosa: Bu misolda Jamoa bo'lagida bitta odam: kim nima qilgani rost aytilgan, yolg'on rol yo'q.
- Tugma (pastki): Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar yo'qoladi, Jamoa bo'lagi fokusga.
- Keyingi bosiladigan joy: bashorat → joriy tugma → «Davom etish».
- O'qituvchi eslatmasi: Jamoa bo'lagida ism shart emas — «Men» yetadi. Sinfdosh yoki ota-ona yordam bergan bo'lsa — roli bilan («sinfdoshim — matnlar»), ismsiz. Yolg'iz qurgan bo'lsangiz — shuni ayting: yo'q odamlar va lavozimlar yozilmaydi.
  «Sinab ko'rganlar» — real odamlar (sinov — real odam bilan); ular jamoa a'zosi emas. Agent — asbob: talabni o'quvchi yozadi, natijani o'quvchi tekshiradi (11–13-Modul).

## 8 · 3-savol  ← QTest (✔ A, `correctIdx 0`; o'quvchining o'z holati)
- Eyebrow: Tekshiruv · Jamoa bo'lagi
- Savol: **Mahsulotni yolg'iz qurdingiz. Jamoa bo'lagida nima deysiz?** · savol ustida yorliq yo'q
  - ✔ A — «Men — g'oya va kod, agent bilan»
  - B — «Jamoamiz besh kishi, hammasi dasturchi»
  - C — «Agent — jamoamizning ikkinchi a'zosi»
  - D — «Jamoamiz kichik, lekin juda kuchli»
- To'g'ri izohi: Jamoa bo'lagida kim nima qilgani rost aytiladi.
- Xato izohlari: B — Bu odamlar yo'q — Jamoa bo'lagida faqat bor odamlar. · C — Agent — asbob, jamoa a'zosi emas. · D — Bu maqtov — kim nima qilganini ayting. ·
  (umumiy) Mentor Jamoa bo'lagida o'zini qanday aytgan edi?
- Javob topilgach (kichik, savol ostida): Mentorning Jamoa bo'lagi ixcham — «Men — g'oya, mahsulot va kod (agent bilan). Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.»
- Izoh (MD): uch distraktor uch turkumda: B — yo'q odamlar (yolg'on rol), C — asbobni a'zo qilish, D — mavhum maqtov (kim nima qilgani yo'q). Tire A va C da, «agent» A va C da — kalit so'z faqat to'g'rida emas; to'rttasi qo'shtirnoqda.

## 9 · Keyingi qadam  ← QTushuncha (ketma-ket, 3 tugma)
- Eyebrow: Tushuncha · Keyingi qadam
- Sarlavha: **Pitch oxirida hakamdan nima so'raysiz?** (38)
- Mentor: Tugmalarni birma-bir bosing va Keyingi qadam bo'lagi qanday o'zgarishini ko'ring.
- Bashorat (ballsiz; S-015 — bitta o'lchov: son): **Mentor hakamdan nechta narsa so'raydi?** · Bitta · Ikkita · Uchta — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi.
- Vizual (keng; telefonsiz): `OltiBolakSahna` — Keyingi qadam bo'lagi joriy, ichida 12-Moduldagi gap: «E'lon berilgach «Havolani ulashish» tugmasi bilan tashkilotchi havolani o'z jamoasiga yuboradi — maqsad 50.»; ustida hakam pufagi «Endi nima qilasiz?».
- Tugmalar (ixcham, bir qatorda): 1 Maqsad 50 · 2 Keyingi ish · 3 Aniq so'rov
- **Harakat → Vizual o'zgarish:**
  1. «Maqsad 50» → gap yonida hisoblagich «Foydalanuvchilar» 44 dan 51 gacha sanab o'sadi va yashil ✓ oladi; eski gap kulrang bo'lib kichrayadi va bo'lak tepasiga suriladi.
     `QIzoh`: Mentor misolida endi 51 foydalanuvchi: 12-Moduldagi qadam bajarildi, yangisi kerak.
  2. «Keyingi ish» → bo'lakka yangi gap yoziladi: «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinayman.» (ostida kulrang yorliq: «Doimiy o'yin» — Pro'dagi qulaylik).
  3. «Aniq so'rov» → qo'shiladi: «Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.»; hakam pufagi o'rnida yashil ✓. Yonida kulrang karta «Investitsiya summasi» paydo bo'ladi, ustidan chiziladi va chiqib ketadi. <!-- TAXMIN T3 -->
     `QIzoh`: Mentor misolida pul so'ralmaydi: investitsiya kompaniyaga kiritiladi, bu loyihada esa kompaniya yo'q. <!-- TAXMIN T3 -->
  Natija (yashil xulosa qutisining birinchi kichik qatori): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: bitta».
  Ipucha (40 s): Yoqilgan tugmani bosing — Keyingi qadam qanday o'zgarishini ko'ring.
- Xulosa: Bu misolda Keyingi qadam — keyingi ish va bitta aniq so'rov: pul emas, tanishtirish. <!-- TAXMIN T3 -->
- Tugma (pastki): Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar yo'qoladi, Keyingi qadam bo'lagi fokusga.
- Keyingi bosiladigan joy: bashorat → joriy tugma → «Davom etish».
- O'qituvchi eslatmasi: Aniq so'rov (bu kursda) — uch turdan bittasi: tanishtirish (kim bilan) · maslahat (nima haqida) · sinash joyi (qayerda). Pul summasi, ulush, «investitsiya kerak» — yo'q: o'smirda yuridik shaxs yo'q;
  real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT (yakka tartibdagi tadbirkor) bilan, bu kursda emas (13-Modul TAQIQLAR 1, FK 27-modda). Keyingi qadam — reja, va'da emas («tez orada», «albatta» yo'q).
  «Sinayman» — real tashkilotchilar bilan; Pro — test rejimda, real pul yo'q. 51 — 44 ga taklif havolasidan kelgan 7 qo'shilgani (bir o'lchov — ro'yxatdan o'tgan hisob); maqsad 50 ham shu o'lchovda edi.

## 10 · Mentor qoralamasi  ← QTartib (ballsiz mashq; SABOQ E 44)
- Eyebrow: Mashq · Mentor qoralamasi
- Sarlavha: **Mentor qoralamasini to'g'ri tartibga qo'ying.** (45)
- Mentor: Avval gapni tanlang, so'ng chapdagi bo'sh joyni bosing.
- Uyalar (chapda, to'liq kenglikning chap qismi — P-068): 1 · 2 · 3 · 4 · 5 · 6 — har birida kulrang «bu yerga qo'ying» (tartibni ochmaydi).
- Bo'laklar (o'ngda; oq fon, 2px accent chegara, boshida «⠿», Manrope — E 44; aralash tartib qat'iy, har bo'lakning birinchi gapi):
  - «Men — g'oya, mahsulot va kod (agent bilan).»
  - «O'yinchilar jamoaga odam yig'ishda qiynaladi.»
  - «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinayman.»
  - «Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi.»
  - «51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi.»
  - «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.»
- Xato joylash (`QXato`, ≤60): bo'lak silkinib joyiga qaytadi — Bu joyga boshqa bo'lak keladi: tartibni eslang.
- Yechilgach: har uya yonida bo'lak nomi chiqadi (Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam); Sahna butun enga — olti bo'lak Mentor qoralamasining to'liq matni bilan (A-6 jadvali), taymer chizig'i 0 dan 5:00 gacha yuradi, so'ng «savol-javob» bo'lagi yonadi. <!-- TAXMIN T1 -->
  `QIzoh` (yashil xulosa qutisining oxirgi kichik qatori): Raqamlar bo'lagidagi halol gap: 3 yozma tasdiq — bu hali to'lov emas.
- **Harakat → Vizual o'zgarish:** gapni tanlash → bo'lak accent bilan ko'tariladi; bo'sh joyni bosish → bo'lak uyaga uchadi (to'g'ri — joyida qoladi, ~1 s yashil; noto'g'ri — silkinib qaytadi); 6/6 da uyalar yoniga nomlar, Sahnada to'liq qoralama va taymer.
- Xulosa: Bu misolda olti bo'lakning har birida bitta-ikkita qisqa gap bor.
- Ballsiz (`tartib: -1`). Tugma (pastki): Gaplarni joylang (N/6) → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: birinchi bo'lak (to'lqin) → tanlangach — bo'sh uyalar (har birining o'z chegarasi) → «Davom etish».
- Nishon: Right Order! (birinchi urinishda — birorta ham noto'g'ri joylashsiz).
- O'qituvchi eslatmasi: Bo'lak nomlari uyalarda faqat yechilgandan keyin chiqadi (P-068). Mentor qoralamasi — namuna, majburiy shakl emas. Raqamlar: 51 foydalanuvchi, 11 tasi sinfdosh — alohida aytiladi;
  3 yozma tasdiq — dalil, to'lov emas; Pro'ni yoqqanlar soni yo'q — aytilmaydi.

## 11 · Pitch qoralamasi  ← QMustaqil (USTAXONA — bittadan karta, 6 bo'lak; SABOQ 9, 13, 17, 29; E 43, E 53)
- Eyebrow: Mustaqil ish
- Sarlavha: **Investor uchun pitchingizni olti bo'lakka yozing.** (49)
- Mentor (`pm-m10d12-pitch` bor): 12-Moduldagi pitchingizdan bor bo'laklar qo'yildi: har kartani tekshirib, «Saqlash»ni bosing.
  Mentor (yo'q): Har kartadagi savolga bitta-ikkita gap bilan javob bering va «Saqlash»ni bosing.
- Kirish (P-046; saqlangan narsa bo'lsa — o'zi qo'yiladi, tahrirlash mumkin; yo'q bo'lsa — bo'sh, o'quvchi o'zi yozadi):
  - `pm-m10d12-pitch.bolaklar.muammo` → Muammo: `gap` + « » + `dalil` · `.yechim` → Yechim · `.raqamlar.halolGap` → Raqamlar · `.keyingi` → Keyingi qadam. Bozor va Jamoa — bo'sh.
  - `pm-m10d10-hisobot.royxat` (`soni`, `sana`) → Raqamlar kartasida tugma «+ {soni} kishi ro'yxatdan o'tgan ({sana})»; `tuzatishQator === 'royxat'` bo'lsa — tugma yo'q (12-Modul 9.43 i naqshi).
  - `pm-m11d9-tasdiq` → `tekshiruv === 'qabul'` va `hisobga: true` tasdiqlar soni n > 0 bo'lsa — Raqamlar kartasida tugma «+ {n} yozma tasdiq — bu hali to'lov emas»; boshqa holatda tugma yo'q.
  - Kalit yo'q yoki bo'sh — o'sha karta bo'sh; `manba` — `'12-modul'` (oldindan qo'yilgan bo'lsa) yoki `'yangi'`.
- **Tepada — ixcham chiziq «Pitchim · n/6»:** bo'lak nomlari, saqlangani ✓ (bo'sh uzuq qatorlar yo'q, SABOQ 17).
- **Markazda — bitta katta karta (joriy; bo'lak tugmalari 1–6: Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam — joriysi accent, saqlangani ✓):** karta sarlavhasi — bo'lak nomi; maydon (yorliq input ichida — E 43: raqam belgisi + placeholder — hakam savoli); belgi sanog'i «n / 160»; ostida bitta kulrang qator; tugmalar bir qatorda: «Saqlash» · (bo'lakka qarab) ikkinchi tugma · o'ngda «Yordam».
  1. **Muammo** — placeholder `Bu muammo borligini qayerdan bilasiz?` · kulrang: Muammo gapi va bitta dalil: son yoki kuzatuv.
  2. **Bozor** — placeholder `Bu mahsulot yana qancha odamga kerak?` · ikkinchi tugma «Hali tekshirilmagan» → maydon oxiriga « Qolganini hali tekshirmaganman.» qo'shiladi (maydon bo'sh bo'lsa — «Sonini hali tekshirmaganman.») · kulrang: Har son manbasi bilan: guruh, chat yoki Database. <!-- TAXMIN T2 -->
  3. **Yechim** — placeholder `Mahsulot nima qiladi?` · kulrang: Jonli demo shu bo'lak ichida — 12-Moduldagidek ikki qurilmada.
  4. **Raqamlar** — placeholder `Bu son qayerdan va nimani sanaydi?` · ikkinchi tugmalar (bor bo'lsa): hisobot soni · yozma tasdiq · kulrang: Eng yangi sonni sanoq sahifasidan oling va sanasini yozing.
  5. **Jamoa** — placeholder `Buni kim qilyapti?` · kulrang: Rol bilan yozing, ismsiz: men, sinfdoshim; agent — asbob sifatida.
  6. **Keyingi qadam** — placeholder `Endi nima qilasiz?` · ikkinchi tugma «So'rov qo'shish» → maydon oxiriga « Sizdan bitta so'rov: {…}» qo'shiladi, `{…}` accent bilan ajralgan · kulrang: Keyingi ish va bitta aniq so'rov: tanishtirish, maslahat yoki sinash joyi. <!-- TAXMIN T3 -->
  «Saqlash» o'ngda (187).
- Tekshiruv (`QXato`, ≤60; javob maydon ostida; «yo'naltiradi» — ikkinchi «Saqlash» bilan o'tadi, «bloklaydi» — o'tmaydi):
  - maydon bo'sh (bloklaydi): Bu bo'lakka bitta-ikkita gap yozing.
  - 160 belgidan uzun (bloklaydi): 160 belgidan oshdi — bitta gapni qisqartiring.
  - `{…}` qolgan (bloklaydi): {…} o'rniga o'zingiznikini yozing.
  - Bozor: «minglab», «millionlab», «hamma odam», «butun shahar», «butun dunyo» (yo'naltiradi): Son qayerdan? Manbasini yozing yoki «hali tekshirilmagan».
  - Yechim: «React», «Expo», «NestJS», «Neon», «Render», «Netlify», «socket.io» (yo'naltiradi; 12-Modul `TEXNO_RE`): Bu texnologiya — mahsulot odamga nima beradi?
  - Raqamlar: «tasdiq» bor, «to'lov emas» yo'q (yo'naltiradi): Tasdiq hali to'lov emas — buni gapda ayting.
  - Jamoa: «agent» va «a'zo» birga (yo'naltiradi): Agent — asbob, jamoa a'zosi emas.
  - Keyingi qadam: «investitsiya», «pul» (alohida so'z — «pullik» emas), «so'm», «dollar», «ulush», «summa», «million», «mln» (yo'naltiradi): Bu kursda pul so'ralmaydi — bitta aniq so'rov yozing. <!-- TAXMIN T3 -->
  - Keyingi qadam: «tez orada», «albatta», «yetamiz», «aniq bo'ladi» (yo'naltiradi; 12-Modul `VADA_RE`): Bu va'da — keyingi haftada aynan nima qilasiz?
  - Yorliq (yo'naltiruvchi xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam (bo'lakka qarab bitta qator — Mentor misolidan, A-6 jadvali aynan):
  1 — Mentor misolida: «O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.»
  2 — Mentor misolida: «Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.» <!-- TAXMIN T2 -->
  3 — Mentor misolida: «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.» Jonli demo — shu gapdan keyin.
  4 — Mentor misolida: «51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi. 3 tashkilotchi Pro'ga yozma tasdiq berdi — bu hali to'lov emas.»
  5 — Mentor misolida: «Men — g'oya, mahsulot va kod (agent bilan). Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.»
  6 — Mentor misolida: «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinayman. Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.» <!-- TAXMIN T3 -->
  Har kartada oxirgi qator: Sonlaringiz kichik bo'lsa ham — o'zingizniki: o'ylab topilmaydi.
- **Harakat → Vizual o'zgarish:** ikkinchi tugma (Hali tekshirilmagan · son · So'rov qo'shish) → matn maydonga sirg'alib yoziladi; «Saqlash» → karta kichrayib tepadagi chiziqqa uchadi (bo'lak nomi yonida ~1 s yashil ✓), pastdan keyingi bo'lak kartasi kiradi;
  tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`. 6/6 da karta yopiladi; Sahna butun enga — olti bo'lak o'quvchi matni bilan (uzun matn «…» bilan qisqaradi, karta cho'zilmaydi — SABOQ 29), har bo'lakda ✎; ostida taymer chizig'i va «savol-javob» bo'lagi.
- Xulosa (o'quvchi ma'lumotidan, P-046; faqat 6/6 da): Olti bo'lak yozildi — bu pitchingizning birinchi qoralamasi.
- Tugma (pastki): Olti bo'lakni yozing (N/6) → Davom etish (jonli darsda mentor o'tkazishi mumkin — `optionalLive`).
- Keyingi bosiladigan joy: joriy maydon (accent, to'lqin) → ikkinchi tugma (2, 4, 6-kartada) → «Saqlash» (maydon yozilgach halqada).
- Artefakt-strip (U-042): shu ekrandan — «Pitchim · n/6» (ixcham); test, arena, podium va yakunda yo'q (E 50).
- Nishonlar: Six Parts! (6/6 saqlanganda) · Fresh Numbers! (Raqamlar kartasi oldindan qo'yilgan matndan o'zgartirilib yoki yangidan yozilib saqlanganda) · Clear Ask! (Keyingi qadam saqlangan matnida pul va va'da so'zlari yo'q).
- Mentor rejimi: forma o'rniga «Maydon Jamoa» qoralamasi (olti bo'lak, ochiq, A-6 jadvali); o'quvchilar o'z ekranida yozadi. Mentor statistikasi: «Olti bo'lakni yozganlar» · «Keyingi qadamda pul so'zi yo'qlar».
- O'qituvchi eslatmasi: ≈22 daqiqa. Eng ko'p xato: Bozorga manbasiz katta son · Jamoaga yo'q odamlar va lavozimlar · Keyingi qadamda pul yoki va'da. Har bo'lak — bitta-ikkita gap; ko'proq yozilsa, 5 daqiqaga og'irlashadi.
  Bozorda son bo'lmasa — «kimga kerak» va «hali tekshirilmagan» ham to'liq javob. Raqamlarda 12-Moduldagi son eski bo'lishi mumkin — bugungisini sanoq sahifasidan oling; sinfdoshlar alohida aytiladi.
  Pitch va kalitda ism, maktab, telefon yo'q. O'quvchi qoralamani hech kimga yubormaydi — bu darsda faqat yoziladi.

## 12 · Yakuniy savol  ← QTest (✔ C, `correctIdx 2`; ikki qoida birga — pul so'ralmaydi va va'da emas; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Kompaniyangiz yo'q. Keyingi qadam bo'lagida nima aytasiz?** · savol ustida yorliq yo'q <!-- TAXMIN T3 -->
  - A — Mahsulot uchun kerakli pul summasini aytaman
  - B — Tez orada hamma ishlatishini va'da qilaman
  - ✔ C — Keyingi ishni va bitta aniq so'rovni aytaman
  - D — Rahmat aytib, pitchni shu yerda tugataman
- To'g'ri izohi: Keyingi qadam — keyingi ish va bitta aniq so'rov, pul emas.
- Xato izohlari: A — Bu kursda pul so'ralmaydi — aniq so'rov aytiladi. · B — Bu va'da — keyingi haftada aynan nima qilasiz? · D — Keyingi qadam bo'sh qoldi — keyin nima qilasiz? ·
  (umumiy) Mentor Keyingi qadamda nimani aytgan edi?
- Javob topilgach (kichik, savol ostida): Mentorning Keyingi qadam bo'lagi ixcham — «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinayman. Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.»
- Izoh (MD): uch distraktor uch turkumda: A — pul (TAQIQLAR 1), B — kelajak va'dasi (sinf 16), D — bo'sh qadam. To'rttasi «…-aman» shaklida; «aytaman» A, C da, «pitch» D da — kalit so'z faqat to'g'rida emas.
  «Kompaniyangiz yo'q» — savolni o'smir holatiga bog'laydi: kattalar pitchida pul so'rash rost bo'lishi mumkin, bu holatda — yo'q (distraktor hayotda rost bo'lib qolmasin; 9-ekran `QIzoh`).

## 13 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi). Sinfda kim kimdan yaxshi pitch yozgani sanalmaydi — podium faqat test ballari (TAQIQLAR 3).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Investor uchun nima qo'shiladi · 2 — Bozorda qaysi son · 3 — Jamoa bo'lagi · 4 — Keyingi qadam

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi yengil halqa bilan ajralib turadi (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| Bizda investor pitchi qaysi olti bo'lakdan iborat? | Muammo, Bozor, Yechim, Raqamlar, Jamoa va Keyingi qadam <!-- TAXMIN T1 --> |
| 12-Moduldagi besh bo'lakli pitchga qaysi ikki bo'lak qo'shildi? | Bozor va Jamoa <!-- TAXMIN T1 --> |
| Jonli demo endi pitchning qayerida? | Yechim bo'lagi ichida <!-- TAXMIN T1 --> |
| Savol-javob pitchning qayerida bo'ladi? | 5 daqiqalik pitchdan keyin: hakamlar savol beradi, siz javob berasiz (inglizchasi: Q&A) <!-- TAXMIN T1, T19 --> |
| Hakam kim? | Pitchni baholaydigan odam: investor yoki tadbirkor <!-- TAXMIN T19 --> |
| Bozor bo'lagiga qanday son yoziladi? | Manbasi bor son; qolgani — «hali tekshirilmagan» <!-- TAXMIN T2 --> |
| Mentor misolida Bozor bo'lagida nima yozilgan? | Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi; boshqa mahallalar hali tekshirilmagan <!-- TAXMIN T2 --> |
| Nega 60 kishi va 6 tashkilotchi qo'shilmaydi? | Biri guruhdagi odamlar, biri ilovadagi tashkilotchilar: o'lchovi har xil |
| Airbnb investorlarga qanday taqdimot ko'rsatgan? | O'nga yaqin oddiy slayd: muammo, yechim, bozor, mahsulot, jamoa <!-- TAXMIN T18 --> |
| Jamoa bo'lagida nima aytiladi? | Kim nima qilgani — rost, rol bilan; agent — asbob, jamoa a'zosi emas |
| Keyingi qadamda hakamdan nima so'raladi? | Bitta aniq so'rov: tanishtirish, maslahat yoki sinash joyi — pul emas <!-- TAXMIN T3 --> |
| Nega Mentor pitchida pul so'ralmaydi? | Investitsiya kompaniyaga kiritiladi, bu loyihada esa kompaniya yo'q <!-- TAXMIN T3 --> |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (olti bo'lak — 2 · Bozor, Jamoa, jonli demo Yechim ichida — 2 · savol-javob, hakam — 2 · «hali tekshirilmagan», 60 va 6 — 5 · Airbnb — 3 · Jamoa, agent — 7 · aniq so'rov, kompaniya — 9).
- S-027: «ta'rif → atamani toping» shakli yo'q (har old tomon — to'liq savol, «?» bilan; «Hakam kim?» — atama → ta'rif). Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). Inglizchasi «Q&A» — faqat shu yerda bir marta.

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha (holatga qarab — sinf 6, E 54; belgi ✓ va nishon faqat birinchisida; o'quvchi qilgan ishni aytadi):
  - olti bo'lak saqlangan, Keyingi qadamda pul va va'da so'zlari yo'q: **Investor uchun pitch qoralamangiz yozildi.** (42)
  - olti bo'lak saqlangan, Keyingi qadamda pul yoki va'da so'zi qoldi: **Qoralama yozildi — Keyingi qadamni qayta ko'ring.** (49) <!-- TAXMIN T3 -->
  - 1–5 bo'lak saqlangan: **Pitch qoralamasi hali tugamagan: {n} / 6 bo'lak.** (48)
  - birorta bo'lak saqlanmagan: **Pitch qoralamasi hali yozilmagan.** (33)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Endi siz bilasiz (asosiy fikr bu yerda yo'q — E 50, T-048):
  - Bizda investor pitchi olti bo'lakdan iborat: Muammo, Bozor, Yechim, Raqamlar, Jamoa va Keyingi qadam. <!-- TAXMIN T1 -->
  - Bozorda manbasi bor son aytiladi, qolgani — «hali tekshirilmagan». <!-- TAXMIN T2 -->
  - Jamoa bo'lagida kim nima qilgani rost aytiladi: agent — asbob.
  - Keyingi qadamda pul emas — keyingi ish va bitta aniq so'rov aytiladi. <!-- TAXMIN T3 -->
- Uyga vazifa (`HwCard` — P-025 karta shaklida; yakunda aynan shu qadamlar): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: o'z mahsulotingiz pitchi · Nechta: 3 ish · Muddat: keyingi darsgacha
  - ① Qoralamada yozilmagan bo'lak qolgan bo'lsa — har biriga bitta-ikkita gap yozing.
  - ② Bozordagi har sonning manbasini tekshiring: guruh yoki chat a'zolari, Database. Topilmasa — «hali tekshirilmagan» deb qoldiring. <!-- TAXMIN T2 -->
  - ③ Keyingi qadamdagi so'rovni bitta gapga keltiring: kim bilan tanishtirsin, qanday maslahat yoki qayerda sinash. <!-- TAXMIN T3 -->
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Mahsulotingiz hikoyasini qanday aytasiz?»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib (E 50): belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. «Bugungi asosiy fikr» qutisi, holat chiplari, artefakt-strip — yakunda yo'q. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): «Kim uchun» — HwCard yorlig'i. Muddat «keyingi darsgacha» — keyingi dars nomi faqat «Keyingi dars» qatorida (T-038; 2-dars mazmuni va'da qilinmaydi). ① — 6/6 yozgan o'quvchiga ish yo'q (shartli). ② — tashqi son qidirish majburiy emas: «hali tekshirilmagan» — to'liq javob (sinf 14).
  Uyda qoralama hech kimga yuborilmaydi va internetga qo'yilmaydi (vazifada aytilmagan — kerak emas).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi, ≤48 belgi)
- **Right Order!** (10-ekran, birinchi urinishda) — Qoralamani birinchi urinishda tartibladingiz
- **Six Parts!** (11-ekran, 6/6 saqlanganda) — Pitch qoralamasini olti bo'lakka yozdingiz
- **Fresh Numbers!** (11-ekran, Raqamlar kartasi o'zgartirilib yoki yangidan yozilib saqlanganda) — Raqamlar bo'lagini yangilab yozdingiz
- **Clear Ask!** (11-ekran, Keyingi qadam matnida pul va va'da so'zlari yo'q) — Keyingi qadamni pul va va'dasiz yozdingiz <!-- TAXMIN T3 -->
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda; 2, 5, 7, 9-ekranlar (tugmali tushuncha) nishonsiz. Keyingi qadamda pul so'zi qolsa — Clear Ask! berilmaydi (yakun sarlavhasi ham 2-holat).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **4 · Investor uchun nima qo'shiladi** — 1 Airbnb taqdimotida muammo va yechimdan keyin bozor, mahsulot va jamoa bo'lgan. · 2 Bizning pitchga ham Bozor va Jamoa bo'laklari qo'shildi. · 3 Jonli demo pitchda qoladi — Yechim ichida. <!-- TAXMIN T1, T18 -->
  — Sinfga savol: Pitchingizdagi qaysi ikki bo'lak yangi?
- **6 · Bozorda qaysi son** — 1 Bozor — mahsulotga muhtoj odamlar va biz bilgan ularning soni. · 2 Mentor misolida: guruhda 60 kishi, ilovada 6 tashkilotchi. · 3 Manbasi yo'q son o'rniga — «hali tekshirilmagan». <!-- TAXMIN T2 -->
  — Sinfga savol: Bozoringizdagi son qayerdan olingan?
- **8 · Jamoa bo'lagi** — 1 Jamoa bo'lagida kim nima qilgani rost aytiladi. · 2 Agent — asbob, jamoa a'zosi emas. · 3 Sinab ko'rgan real odamlar ham aytiladi, lekin a'zo deb emas.
  — Sinfga savol: Mahsulotingizda kim nima qildi?
- **12 · Keyingi qadam** — 1 Keyingi qadamda — keyingi ish va bitta aniq so'rov. · 2 Mentor misolida pul so'ralmaydi: bu loyihada kompaniya yo'q. · 3 Va'da emas — aniq ish aytiladi. <!-- TAXMIN T3 -->
  — Sinfga savol: Hakamdan qanday aniq so'rov qilasiz?

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·10 · B 2·8·11 · C 3·6·12 · D 4·7·9 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Bizda Bozor qaysi bo'lakdan keyin turadi? (2) <!-- TAXMIN T1 -->
   - ✔ Muammodan keyin
   - Yechimdan keyin
   - Jamoadan keyin
   - Raqamlardan keyin
2. Mentor misolida Raqamlar bo'lagida nechta foydalanuvchi aytilgan? (10)
   - 44 foydalanuvchi
   - ✔ 51 foydalanuvchi
   - 60 foydalanuvchi
   - 6 foydalanuvchi
3. Airbnb qanday xizmat? (3) <!-- TAXMIN T18 -->
   - Shahar ichida tez taksi chaqirish xizmati
   - Internetda kitob sotib olish xizmati
   - ✔ Begonaning uyida ijaraga turish xizmati
   - Uyga tayyor ovqat yetkazish xizmati
4. Airbnb tartibida jamoa slaydi qayerda turgan? (3) <!-- TAXMIN T18 -->
   - Tartibning boshida
   - Muammo slaydidan keyin
   - Yechim slaydi ichida
   - ✔ Tartibning oxirida
5. Hakam «Buni kim qilyapti?» desa, qaysi bo'lak javob beradi? (2, 7)
   - ✔ Jamoa bo'lagi
   - Bozor bo'lagi
   - Yechim bo'lagi
   - Muammo bo'lagi
6. Mentor misolida boshqa mahallalar haqida nima deyilgan? (5) <!-- TAXMIN T2 -->
   - Ularda ham 60 kishidan bor
   - Ularga ilova kerak emas ekan
   - ✔ Ularni hali tekshirmaganmiz
   - Ularda o'yin tashkil qilinmaydi
7. Mentor Jamoa bo'lagida agentni qanday aytgan? (7)
   - Agentni jamoa a'zosi deb aytgan
   - Agentni bosh dasturchimiz deb aytgan
   - Agent haqida hech narsa demagan
   - ✔ Kodni agent bilan yozganini aytgan
8. Mentor misolida sinab ko'rganlar kimlar? (7)
   - Faqat Mentorning sinfdoshlari
   - ✔ 6 tashkilotchi va o'yinchilar
   - Investor va tadbirkorlar
   - Agent va Mentorning o'zi
9. Mentor hakamdan nima so'raydi? (9) <!-- TAXMIN T3 -->
   - Pro uchun yozma tasdiq berishlarini
   - Ilovani mahalla guruhiga ulashishni
   - Ilova uchun kerakli pul summasini
   - ✔ Maydon egalari bilan tanishtirishni
10. 12-Moduldagi «maqsad 50» nega yangilandi? (9)
    - ✔ Foydalanuvchilar 51 taga yetdi
    - Maqsad juda katta bo'lib qoldi
    - Ro'yxatdagi sonlar xato chiqdi
    - Taklif havolasi ishlamay qoldi
11. Mentor 3 yozma tasdiqni Raqamlarda qanday aytgan? (10)
    - Uch tashkilotchi Pro'ni sotib oldi
    - ✔ Yozma tasdiq bor, to'lov hali yo'q
    - Hamma tashkilotchi Pro'ga yozildi
    - Tasdiqlar pitchda umuman aytilmaydi
12. Mentor misolida Muammo dalili qayerdan olingan? (2, 10)
    - Ilovadagi 51 foydalanuvchidan
    - Mahalla futbol guruhidagi 60 kishidan
    - ✔ So'ralgan 5 o'yinchining javobidan
    - Uch tashkilotchining tasdig'idan
- Arena yozuvlari — platforma shabloni (namuna 12-Modul YAKUNIY dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — pitch, bo'lak, bozor, jamoa, hakam, investor, slayd, taymer, savol, so'rov · uyga vazifa banneri — pitch, qoralama, bozor, so'rov (faqat so'z, emojisiz).
- Izoh (MD): 2 — 44 (eski son), 60 (guruh), 6 (tashkilotchi) — darsdagi boshqa sonlar, boshqa o'lchov (sinf 7); 3 — taksi, kitob, ovqat — Airbnb xizmati emas (rost emas, S-004); 4 — 3-ekran bashorati, arena — ballik takror (ekran testi emas);
  9 — «pul summasi» — TAQIQLAR 1 ga zid variant (to'g'ri emas); 10 — 51 > 50 (bir o'lchov); 11 — «sotib oldi» — tasdiqni to'lov deb aytish; 12 — 51, 60, tasdiq — boshqa bo'laklarning sonlari.

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/12-Modull/PmInvestorPitchLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META` `pm-m12d1-v1` · «Investorga pitchni qanday tuzasiz?».
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s5/s7/s9 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3 `QVoqea` · s4/s6/s8/s12 `QTest` (`QuestionScreen` mantig'i, DE-203) · s10 `QTartib` · s11 `QMustaqil` · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`.
2. **`OltiBolakSahna`** — bitta vizual (180): telefon (`JamoaTelefon`: «O'yin» ekrani, «8 / 10» → «9 / 10» son animatsiyasi; ≈170×272 barqaror) · bo'laklar (`rejim: 'besh' | 'olti'`; holatlar: bo'sh · joriy · yozildi · ✓ · yangi; besh → olti o'tishi: Bozor va Jamoa sirg'alib kiradi, Jonli demo Yechim ichiga kichrayadi) ·
   taymer chizig'i (besh — `[40, 20, 90, 90, 60]` s; olti — `[40, 30, 90, 60, 30, 50]` s; + «savol-javob» uzuq bo'lagi) · hakamlar (3 qiyofa, real ko'rinishda, ismsiz — D 36; `HAKAM_SAVOL` pufagi / ✓) · `fokus` (bitta bo'lak joriy, qolgani ixcham; telefonsiz rejim — 5, 7, 9).
   12-Modul `BeshDaqiqaSahna` dan ko'chirilmaydi — dars ichida (K-020). Rangli yon chiziq yo'q. `reduced-motion`; 393 da bo'laklar telefon ostida. Qolip-maket izohi faylda e'lon qilinadi (`// qolip-maket: …`).
3. **`JAMOA_PITCH`** — bitta manba (A-6 aynan): `{ muammo, bozor, yechim, raqamlar, jamoa, keyingi }` (har biri — to'liq gap) + `birinchi` (har bo'lakning birinchi gapi — 10-ekran) + `vaqt: [40, 30, 90, 60, 30, 50]` · **`JAMOA_PITCH_12`** (12-Modul tayanchi 1.12 aynan: besh bo'lak, bir qatordan) ·
   **`HAKAM_SAVOL`** (6; to'rttasi 12-Modul `ZAL_SAVOL` uz/ru aynan, ikkitasi yangi) · **`BOZOR_SON`** (5-ekran: `{ son, kim, manba }` × 3; uchinchisi `son: '?'`, `manba: null`). s0, s2, s5, s7, s9, s10, s11 (Yordam, mentor rejimi) shundan o'qiydi.
4. s0: `QKirish` — javoblar «Aynan!» / «Qiziq fikr!», ballsiz (`correct: false` hammaga — J-026); maket `pm-m10d12-pitch.bolaklar` dan (yo'q bo'lsa `JAMOA_PITCH_12` + yorliq «Mentor misoli»); tanlovga qarab bo'lak ✓ yoki nomsiz uzuq joy.
5. s2: `QBashorat` (bitta · ikkita · uchta) → 3 tugma (hakam savollari + `QIzoh` · yangi bo'laklar + `QIzoh` · taymer 6 bo'lak + savol-javob + `QIzoh`); natija va `QIzoh` — yashil xulosa qutisi ichida (E 42); 40 s ipucha.
6. s3: `AIRBNB_KADR` 3 × `{ h — kadr nomi, m — Mentor gapi }` (SABOQ 8); `AirbnbTasma` (o'nga yaqin oq slayd, son yozilmaydi; nomlar 2/3 da ikkitasi, 3/3 da beshtasi; «Bozor» va «Jamoa» accent); nom «Airbnb» — `Brend` komponenti, #FF5A5F, logotip yo'q;
   bashorat 2/3 da (ballsiz, ixcham qator); tugma «Voqea davomi (N/3)»; manba izohi faylda (bank K12, 228–231).
7. s5: `BOZOR_SON` kartalari tugma sifatida (har birining o'z chegarasi — E 40); 3-karta bo'lakka uchmaydi — silkinish + gap yoziladi; `QBashorat` (qamrov); `QIzoh` ikki marta (2-, 3-kartadan keyin).
8. s7: Jamoa bo'lagi + odam qiyofasi (rol yorliqlari g'oya · mahsulot · kod) + asbob belgisi (agent) + «sinab ko'rganlar» qatori (6 kichik qiyofa, bo'lakdan tashqarida). s9: hisoblagich 44 → 51 (sanab o'sadi) · yangi gap · so'rov · «Investitsiya summasi» kartasi chizilib chiqib ketadi (son yo'q).
9. s10: `QTartib` — 6 uya (izoh «bu yerga qo'ying»), aralash tartib qat'iy `['jamoa', 'muammo', 'keyingi', 'bozor', 'raqamlar', 'yechim']`; bosib joylash (avval bo'lak, so'ng uya; sudrash ham); noto'g'ri — silkinish + `QXato`; 6/6 da uyalar yonida nomlar, Sahnada to'liq qoralama va taymer;
   nishon `rightOrder` — birinchi urinishda (xato joylash 0). Ballsiz (`tartib: -1`), `optionalLive`. ⛔ Olti uzun bo'lak 1280×800 da sig'ishi — vizual bosqichda (U-006); sig'masa — bo'laklar 2 ustun.
10. s11: 6 bosqichli forma (ketma-ket karta, E 53); o'qiydi `pm-m10d12-pitch` (`bolaklar.muammo.gap`, `.muammo.dalil`, `.yechim`, `.raqamlar.halolGap`, `.keyingi`), `pm-m10d10-hisobot` (`royxat.soni`, `royxat.sana`, `tuzatishQator`), `pm-m11d9-tasdiq` (`tekshiruv`, `tasdiqlar[].hisobga`); yo'q bo'lsa — bo'sh maydon.
    Ikkinchi tugmalar: Bozor «Hali tekshirilmagan» · Raqamlar (hisobot soni, tasdiq — faqat qiymat bor bo'lsa) · Keyingi qadam «So'rov qo'shish» (`{…}` joy; `{…}` qolsa — bloklaydi). Belgi sanog'i «n / 160».
    Tekshiruv funksiyasi (bo'sh · 160 · `{…}` · Bozor umumiy so'zlari · `TEXNO_RE` · tasdiq/«to'lov emas» · agent/a'zo · pul so'zlari · `VADA_RE`) — PM-108 tartibida kamida 10 namuna bilan `node` da sinaladi (apostrof `normT` bilan — 12-Modul naqshi).
    Artefakt-strip «Pitchim» (U-042); nishonlar `sixParts`, `freshNumbers`, `clearAsk`.
11. **Saqlash** `localStorage` `pm-m12d1-pitch` = `{ bolaklar: { muammo, bozor, yechim, raqamlar, jamoa, keyingi }, manba: '12-modul' | 'yangi', savedAt }` — har bo'lak: `string` (≤160, «Saqlash» bosilgan) yoki `null` (hali saqlanmagan — TAYANCHGA SAVOL 10);
    har «Saqlash»da o'sha bo'lak yoziladi (birlashtiriladi), `savedAt` yangilanadi. Tartib va id lar barqaror (`muammo` · `bozor` · `yechim` · `raqamlar` · `jamoa` · `keyingi`). Ism, telefon, havola hech qaysi maydonga yozilmaydi (sinf 3). Boshqa darsning kalitiga yozmaydi.
12. **App.jsx** (asosiy seans; bu agent tegmaydi): `m12-01` qatoriga `comp: PmInvestorPitchLesson` + import. **`sub` almashtirish taklifi** (TAYANCHGA SAVOL 1): «olti bo'lak: muammo, bozor, yechim, metrikalar, jamoa, keyin» → «olti bo'lak: muammo, bozor, yechim, raqamlar, jamoa, keyingi qadam» (`00-NOMLAR.md` ham).
13. Testlar s4/s6/s8/s12 — `correctIdx` 1/3/0/2 = `INLINE_KEYS`; `RECAPS` 4/6/8/12 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6). Kichik vizual — `QuestionScreen` `vizual`, javob topilgach (SABOQ 4).
    Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
14. Jonli ball: `INLINE_KEYS` = { s4: 1, s6: 3, s8: 0, s12: 2, oltiBolak: -1, airbnb: -1, bozor: -1, jamoa: -1, keyingi: -1, tartib: -1, practice: -1 }; `SCREEN_META` == screens; `SCREEN_INTENTS`.
15. `ACHIEVEMENTS` 4 (`rightOrder`, `sixParts`, `freshNumbers`, `clearAsk`) · `FLASHCARDS` 12 · s15 `RECAP` 4 band = yakundagi «Endi siz bilasiz» so'zma-so'z · «Bugungi asosiy fikr» — yakunda yo'q (E 50) ·
    yakun sarlavhasi — saqlangan bo'laklar soni va Keyingi qadam matnidan (4 holat) · `HW_TOKENS` — faqat so'z · yordam darajalari (P-033: qulf-yorliq · ipucha 40 s · rescue 110 s).
16. Uyga vazifa — `HwCard` («Kim uchun · Nechta · Muddat», 3 band, ① shartli); alohida `.homework.jsx` yo'q.
- Darvozalar: `npm run gates -- src/12-Modull/PmInvestorPitchLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).
  ⚠️ CSS izohida va kod namunasi ichida backtik yo'q (CLAUDE.md); qo'shtirnoqli gaplar (`"Doimiy o'yin"`) — JS satrida ekranlanadi.

## REPO
Amaliy blok yo'q (PM darsi, kod ekrani yo'q) — o'quvchi repo'siga ham, `maydon-jamoa` ga ham tegilmaydi. <!-- TAXMIN T4 -->

| Teg | Holat |
|---|---|
| `m14-dars-01-start` | = `m13-dars-12-done` (13-Modul barqarorlashtirish, yangi versiya) |
| `m14-dars-01-done` | = `m14-dars-01-start` (tayanch 3 jadvali) |

«Ortda qoldingizmi» bu darsda yo'q (tayanch 3: birinchi amaliy blokda — 3-dars).

## Manbalar (o'zim tekshirgan fayl va qatorlar, 08.10.2026)
- `PM_Prompt_v8.md` 228–231 (K12) — o'qidim. Ruscha asl: «Первая презентация Airbnb для инвесторов — около десятка простых слайдов: проблема → решение → рынок → продукт → команда. Один из самых разбираемых питчей, лежит в открытом доступе.» · «Цифры: Без цифр.» · «Темы: структура питча · питч инвестору · storytelling».
  Tarjima — tayanch 5 aynan. Bank qoidasi (156–161): «без цифр» — raqam qo'shilmaydi. Sarlavhadagi «питч на 10 слайдов» — o'quvchi matnida raqam bilan yozilmadi («o'nga yaqin» — bank hikoyasi so'zi).
- `feedback/F-1008-14modul/00-MODUL-TAYANCH.md` 1.0, 1.1, 1.14, 2, 3, 4, 5, 7, 8 · `00-TAQIQLAR.md` · `00-NOMLAR.md` · `00-MANBA.md` 1, 3, 4, 6 · `qaror-0.json` va `JURNAL.md` «TAXMINLAR».
- `src/App.jsx` 460 (`m11-13` «Zaxira dars»), 464–469 (`id: '12'`, `m12-01` nomi va osti, `m12-02` nomi) — grep 08.10.
- 12-Modul tayanchi 1.12 (Mentorning besh bo'lakli pitchi, zal savoli), 116-qator (mahalla futbol guruhi — Telegram guruhi, 60 kishi), 8 (`pm-m10d12-pitch`, `pm-m10d10-hisobot` sxemalari) · `src/10-Modull/PmGrowthPitchLesson.jsx` 598–606 (`ZAL_SAVOL`, `VAQT`), 1587–1600 (`MAYDON`, `TEXNO_RE`, `VADA_RE`) — o'qidim.
- 13-Modul tayanchi 1.0, 1.13, 2, 7, 8 (`pm-m11d9-tasdiq` sxemasi) · 13-Modul `00-TAQIQLAR.md` 1 (real ishga tushirish gapi, FK 27-modda).
- 10-Modul `11-PmPitchRehearsal-v3.md` 4-ekran (K12, brend izohi, #FF5A5F, bozor va jamoa so'zlari) · `src/8-Modull/PmPitchRehearsalLesson.jsx` 1041 («Investor — loyihaga pul tikadigan odam.»).
- Tashqi (internet) fakt bu darsda yo'q: K12 — faqat bank; Lighthouse, Expo, Render, Upwork, YC — tilga olinmaydi.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Menyu osti (`App.jsx` 467, `00-NOMLAR.md`):** «olti bo'lak: muammo, bozor, yechim, metrikalar, jamoa, keyin» — tayanch 2 «Metrikalar», «Keyin» ni bo'lak nomi sifatida taqiqlaydi. Reja ekranida taklif shakli: «… raqamlar, jamoa, keyingi qadam»; App.jsx — KOD 12 (asosiy seans).
2. **Mentorning Muammo gapi:** tayanch 1.1 «muammo gapi + dalil». 1.0 dagi to'liq gap (99) + dalil = 186 belgi — `pm-m12d1-pitch` chegarasidan (≤160) oshadi. 12-Modul pitchidagi qisqa gap («O'yinchilar jamoaga odam yig'ishda qiynaladi.») + dalil = 129 — shuni oldim (12-FILTR M1: pitch darsdan darsga uzilmaydi). 5, 8, 13-darslar uchun to'lqin kelishuviga.
3. **Olti bo'lak vaqt taqsimoti** (bu mashqda): Muammo 40 · Bozor 30 · Yechim jonli demo bilan 90 · Raqamlar 60 · Jamoa 30 · Keyingi qadam 50 soniya = 5:00. Tayanchda yo'q; taymer chizig'i uchun kerak (5, 8, 13-darslar ham).
4. **`HAKAM_SAVOL`:** to'rttasi 12-Modul `ZAL_SAVOL` aynan; Bozor — «Bu mahsulot yana qancha odamga kerak?», Jamoa — «Buni kim qilyapti?» (topshiriqdagi «bozor qancha?», «kim qiladi?» dan: «bozor» hali tug'ilmagan — T-011; «ilova» o'rniga «mahsulot» — web-trek). Kurs savollari, real hakam gapi emas (TAQIQLAR 0).
5. **Jamoa bo'lagi ta'rifi** tayanch 2 da yo'q: «Jamoa — mahsulotni kim qilayotgani» (10-Modul «jamoa — loyihani qilayotgan odamlar» ga yaqin). Bozor ta'rifi — tayanch 2 aynan (10-Modul ta'rifidan farqli: «biz bilgan» son).
6. **«jamoa» uch ma'noda (T-015):** bo'lak nomi · «Maydon Jamoa» · futbol jamoasi (Mentor pitch gaplarida). Yechimim: bo'lak doim bosh harf yoki «Jamoa bo'lagi»; prozada futbol ma'nosi yo'q. Tayanch 2 ga eslatma sifatida qo'shishni so'rayman.
7. **«yordam»:** Mentor gapi «Sizdan bitta so'rov: …» (tayanch 1.1 aynan) va 11-ekrandagi «Yordam» tugmasi. Izoh va testlarda — «aniq so'rov». Mentor gapini «Sizdan bitta so'rov: …» ga almashtirish — tayanch qarori.
8. **«Maqsad 50 — bajarildi»** (9-ekran): 12-Modul Keyingi qadami (maqsad 50) va tayanch 1.14 dagi 51 dan chiqardim — Keyingi qadam nega yangilanganining sababi. Yangi son yo'q; 44 → 51 hisoblagichi ikki tayanch sonidan.
9. **Pul so'ralmasligining sababi o'quvchi matnida:** «investitsiya kompaniyaga kiritiladi, bu loyihada esa kompaniya yo'q» va yakuniy test «Kompaniyangiz yo'q.» — TAQIQLAR «(o'smirda yuridik shaxs yo'q)» ning soddasi; to'liq gap (YaTT, ota-ona roziligi) — O'qituvchi eslatmasida.
10. **`pm-m12d1-pitch`:** saqlanmagan bo'lak — `null` (sxemada aytilmagan); `manba: '12-modul'` — oldindan qo'yish bo'lgan bo'lsa (hatto o'quvchi o'zgartirgan bo'lsa ham). Tasdiqlansa — tayanch 8 ga.
11. **Raqamlar bo'lagida o'sish grafigi** (12-Modul) — qoralamaga kirmaydi (matn, ≤160). 5, 8, 13-darslarda grafik pitchga qaytadimi — tayanch qarori.
12. **«Demo Day» o'quvchi matnida yo'q** (T-038 bo'yicha ehtiyot): hakam ta'rifida «investor yoki tadbirkor». Modul oxiri Demo Day 8 menyuda ko'rinadi — tilga olish mumkinmi?
13. **Reja kulrang yorlig'i** olti nomni aytadi (P-015 «App.jsx bilan so'zma-so'z») — 2-ekran kashfiyotini qisman ochadi; 12-Modul naqshi bilan qoldirdim.
14. **Agent haqidagi `QIzoh` (7-ekran):** «talabni Mentor yozdi, natijani o'zi tekshirdi» — 11–13-Modul agent bilan ishlash tartibidan (talab · tekshirish — o'quvchi ishi); Mentor misoli uchun alohida tafsilot tayanchda yo'q.
15. **TAXMIN raqamlari:** tayanchdagi `(Tn)` va `JURNAL.md` «TAXMINLAR» ro'yxati T12–T17 da bir-biridan surilgan (masalan video: tayanch 1.9 — T13, jurnal — T12; Diamond Challenge: tayanch — T15, jurnal — T14). Mening darsimdagi T1, T2, T3, T4, T18, T19, T20 — ikkalasida bir xil. Faqat ma'lumot.

## Shubhali joylar (ishonchim komil emas)
- ⛔ **«Qur» darvozasi:** 10-ekran — olti uzun bo'lak va olti uya 1280×800 da skrollsiz sig'ishi (U-006) · 11-ekran — 22 daqiqa (12–15 o'quvchi bilan taymer) · 11-ekran tekshiruv funksiyasi — `node` da namuna bilan · `pm-m11d9-tasdiq` dagi `hisobga` maydoni 13-Modul qurilgan darsida aynan shu nom bilan saqlanadimi — kodda grep (13-Modul 9-dars hali qurilmagan bo'lishi mumkin).
- **Airbnb taqdimoti:** real taqdimotda bankdan tashqari slaydlar bor (10-Modul MD manbasi: «10 yoki 14 slayd»); darsda faqat bank so'zlari. 3-ekran bashorati va arena 4 «tartibda» / «tartibning oxirida» deb bank tartibiga (besh nom) bog'landi — real taqdimotda jamoadan keyin yana slaydlar bo'lishi mumkin. Auditor ko'rsin.
- **Tartib farqi:** bizda Bozor muammodan keyin, Airbnb'da yechimdan keyin — o'quvchi «qaysi to'g'ri?» deb so'rashi mumkin; javob O'qituvchi eslatmasida (ikkalasi ham yagona yo'l emas). Arena 1 — kurs tartibi (2-ekran xulosasi).
- **«6 tashkilotchi»** uch joyda (Bozor, Jamoa — «sinab ko'rganlar», arena) — tayanch aynan; ekranda bir marta (P-052), lekin dars bo'yi takrorlanadi.
- **11-ekranda ism detektori yo'q** — ismni ishonchli aniqlab bo'lmaydi; faqat kulrang qator va Yordam. Kalitga ism tushishi mumkin — sinf 3 uchun yetarlimi?
- **Keyingi qadam pul detektori** «pul emas» degan halol gapni ham ushlaydi (yo'naltiradi, ikkinchi «Saqlash» bilan o'tadi; Clear Ask! berilmaydi). Soxta signal — qabul qildim.
- **`pm-m10d10-hisobot.royxat`** — 12-Modul sanasi: eski son (masalan 44) taklif qilinadi; sanasi tugmada ko'rinadi, kulrang qator yangisini oling deydi.
- **«investitsiya kompaniyaga kiritiladi»** — soddalashtirish (grant kabi boshqa yo'llar bor); T-045 ga yaqin. Yolg'on model emas deb oldim — auditor ko'rsin.
- **0-ekran:** hookda «Aynan!» faqat Bozor savoliga; Jamoa savoli hookda yo'q (uch variant). Ikkala yangi bo'lak 2-ekranda tug'iladi.

---

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 18 band)
1. [x] **90 daqiqa — reja** — A-13: taqsimot (≈88 + 2 zaxira), «Ulgurmasangiz» (10 `optionalLive`, 11 — saqlangani qoladi, uyga vazifa ①, yakun «hali tugamagan»), ⛔ pilotda taymer; «sig'adi» yo'q. Amaliy blok yo'q — blok-darajasidagi «Ulgurmasangiz» tegishli emas.
2. [x] **Tekshirilmagan tashqi qadam** — darsda tashqi xizmat yo'q (K12 — bank); ⛔ «qur»: 10-ekran sig'ishi, 11-ekran vaqti va detektorlar, `hisobga` maydoni (Shubhali joylar).
3. [x] **Saqlash kaliti — shartnoma** — `pm-m12d1-pitch` tayanch 8 shakli (KOD 11): `string | null`, `manba`, `savedAt`; boshqa dars kalitiga yozmaydi; o'qiydi `pm-m10d12-pitch`, `pm-m10d10-hisobot`, `pm-m11d9-tasdiq` (tuzatish olgan qiymat taklif qilinmaydi); ism, telefon, havola yo'q.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Bizda investor pitchi…» (2, 14, 15), «Bu misolda» (5, 7, 9, 10 xulosalari), «Mentor misolida» (9 `QIzoh`, 11 Yordam, arena); Airbnb — «misol, qoida emas» (3 eslatma); taqsimot «bu mashqda» (2).
5. [x] **Kafolat va sabab da'vosi yo'q** — «investor pul beradi», «hakam albatta so'raydi» yo'q; hakam savollari — kurs savollari (A-6); «bajarildi» — faqat 51 ≥ 50 fakti (9); «tasdiq — hali to'lov emas» (10, 11, arena 11).
6. [x] **Yakun, nishon — faqat rost holatda** — 15-ekran 4 holat (hech narsa yozilmagan holati bilan — E 54); ✓ va nishon faqat birinchisida; Clear Ask! va 2-holat — Keyingi qadam matnidan; Fresh Numbers! — matn o'zgarganda.
7. [x] **Ta'rif sanaladigan** — Bozor ta'rifi «biz bilgan soni» (sanaladigan, manbali); birliklar A-7 (kishi · tashkilotchi · foydalanuvchi · tasdiq); 60 va 6 qo'shilmaydi (5 `QIzoh`, kartochka 8).
8. [x] **Test: bitta himoyalanadigan javob** — s4 (tuzilma · hajm · tartib), s6 (manbasiz son · va'da · bo'lakni tashlash), s8 (yo'q odamlar · asbob-a'zo · mavhum maqtov), s12 (pul · va'da · bo'sh qadam); har testda uch turkum; s12 «Kompaniyangiz yo'q» — hayotdagi rost holat yopildi.
9. [x] **Real odamlar xavfsizligi** — Jamoa: rol bilan, ismsiz (7, 11); hakamlar ismsiz, gapi to'qilmagan (A-6); podium — faqat test ballari (13); o'quvchi qoralamani hech kimga yubormaydi (11 eslatma); Mentor nomidan tasdiq yo'q.
10. [—] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — bu darsda agent ishlamaydi va tekshiruv akkaunti yo'q; agent faqat Jamoa bo'lagidagi «asbob» sifatida tilga olinadi (7).
11. [x] **Web-trek teng yo'l** — hakam savollari va kartalar «mahsulot» so'zi bilan (A-5, A-11); Yechim kulrang qatori «12-Moduldagidek ikki qurilmada» (web — ikki brauzer oynasi); testlar ikkala trekka to'g'ri.
12. [x] **Mentor misoli ichki izchil** — Muammo va 12-Modul Keyingi qadam gaplari 12-Modul pitchi bilan bir (A-6); 14-Modul gaplari tayanch 1.1 aynan; 2, 3-dars natijasi oldindan ochilmaydi (hikoya, tezlik — tilga olinmaydi).
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — 11-ekran: Bozor va Jamoa bo'sh, `{…}` — o'quvchi to'ldiradi; Mentor gaplari faqat Yordam'da («Mentor misolida»); oldindan qo'yilgan — o'quvchining o'z 12-Modul matni.
14. [x] **Uyga vazifa yengil va aniq** — 3 ish, ① shartli, ② da «hali tekshirilmagan» — to'liq javob (tashqi qidiruv majburiy emas); muddat — keyingi darsgacha.
15. [x] **Ayb da'vosi yo'q** — xato izohlari va `QXato` lar aniq keyingi qadamni aytadi («Manbasini yozing…», «bitta aniq so'rov yozing»); «sizning xatongiz emas» yo'q.
16. [x] **Kelajak va'dasi yo'q** — 6-ekran B, 12-ekran B — va'da distraktor sifatida; 11-ekran `VADA_RE`; Keyingi qadam — «reja, va'da emas» (9 eslatma); Demo Day, 2-dars mazmuni va'da qilinmaydi.
17. [x] **Pul va investitsiya** — summa, ulush, «investitsiya kerak» hech qayerda yo'q (9-ekrandagi «Investitsiya summasi» kartasi — sonsiz, chizib chiqariladi); 11 pul detektori; s12; Pro — test rejim (9); «tasdiq — to'lov emas» (10, 11).
18. [—] **Yosh va rasmiy shartlar** — bu darsda xalqaro sayt va dastur yo'q; yosh tilga olinmaydi («o'smirda yuridik shaxs yo'q» — faqat O'qituvchi eslatmasida).
+ **RAD etilganlar saqlangan:** hookdagi «Aynan!» / «Qiziq fikr!» (0) · «Keyingi dars — «…»» qatori (15) · reja sarlavhasi — natija-gap (1) · ≤3 blok · bank so'zi yumshatilmagan (3).
+ **SABOQ E:** variant chegarasi (0, 5 kartalar) · maket kesilmaydi (10 ⛔) · taxmin qatori yashil xulosa ichida (2, 3, 5, 7, 9) · yorliq input ichida (11) · bittadan karta (11) · yakun standart, «Bugungi asosiy fikr» yo'q (15).

## O'lchov (`scratchpad/m14/md01/olchov.py` natijasi — jadval skript chiqishidan, 08.10.2026; to'liq chiqish `md01/olchov-natija.txt`)
| Nima | Soni | Eng qisqa | Eng uzun | Chegara |
|---|---|---|---|---|
| Sarlavha (0, 1, 2, 3, 5, 7, 9, 10, 11, 14, 15 ×4) | 14 | 25 | 49 | ≤55, bitta qator; yozilgan sonlar haqiqiy uzunlik bilan bir xil (skript tekshirdi) |
| Hook javobi («Aynan!» · «Qiziq fikr!» ×2, so'z bilan birga) | 3 | 78 | 83 | ≤120 |
| Hook variantlari (0) | 3 | 33 | 36 | farq 6% |
| Mentor (interaktiv ekranlar 0, 2, 5, 7, 9, 10, 11 ×2 va reja 1 — bittadan gap) | 9 | 55 | 117 | interaktivda 1 gap ✓ |
| Mentor — keys kadrlari (3: 1/3, 2/3, 3/3) | 3 | 40 | 126 | ≤2 gap ✓ (2 · 1 · 2) |
| Xulosa (2, 3, 5, 7, 9, 10, 11) | 7 | 60 | 101 | ≤110 |
| Bugungi asosiy fikr (A-2; yakunda yo'q) | 1 | 106 | 106 | ≤110 |
| `QIzoh` qatorlari (2 ×3, 5 ×2, 7 ×2, 9 ×2, 10) | 10 | 69 | 101 | bitta qator (≤110) |
| To'g'ri izohi (4, 6, 8, 12) | 4 | 47 | 59 | ≤60, «To'g'ri!» siz |
| Xato izohlari (4, 6, 8, 12 — har biri uch + umumiy) | 16 | 33 | 52 | ≤60 |
| `QXato` va tekshiruv xabarlari (10, 11) | 10 | 33 | 58 | ≤60 |
| Test variantlari — s4 (✔ B) | 4 | 37 | 42 | farq 6%; ✔ 37 (A ham 37) — yolg'iz eng uzun emas |
| s6 (✔ D) | 4 | 41 | 47 | farq 9%; ✔ 47 (A ham 47) |
| s8 (✔ A) | 4 | 33 | 40 | farq 10%; ✔ 33 — eng qisqa |
| s12 (✔ C) | 4 | 41 | 44 | farq 4%; ✔ 44 (A ham 44) |
| Test savollari (so'z) | 4 | 7 | 9 | ≤12 |
| Arena 1–12 (variantlar) | 48 | 13 (5-savol) | 41 (3-savol) | har savolda farq ≤13%; ✔ hech qayerda yolg'iz eng uzun emas |
| Arena savollari (so'z) | 12 | 3 | 9 | ≤12 |
| Nishon tavsiflari | 4 | 37 | 44 | ≤48 (§63) |

Arena ✔ taqsimoti: A — 1, 5, 10 · B — 2, 8, 11 · C — 3, 6, 12 · D — 4, 7, 9 (3/3/3/3). Ekran testlari: s4 B · s6 D · s8 A · s12 C (to'rttasi har xil o'rinda).
Mentor gaplari «Bu…», «Hammasini…» bilan boshlanmaydi, sarlavhani takrorlamaydi (qo'lda tekshirildi; 3/3 kadrdagi ikkinchi gap — «Taqdimot ochiq turadi: …»).
`npm run -s lint:til -- feedback/F-1008-14modul/01-PmInvestorPitch-v3.md` — **0 error**, 2 warn (`kirill-lotin-matnda` — «Manbalar»dagi bank K12 ning ruscha asl iqtibosi; o'quvchi matnida kirill yo'q). Oxirgi tahrirdan keyin qayta yurgizildi (Hisobotga qarang).

## TAXMIN belgilari (MD dagi `<!-- TAXMIN Tn -->` — 58 qator, 64 belgi)
| Tn | Qaror-0 savoli (tavsiya A) | Soni | Qayerda |
|---|---|---|---|
| **T1** | Olti bo'lak, 5 daqiqa + savol-javob | 17 | A-1, A-6 · 0 (hook varianti) · 1 (reja yorlig'i) · 2 (bashorat, `QIzoh` ×2, xulosa) · 4 (savol) · 10 (yechilgach) · 14 (kartochka 1–4) · 15 («Endi siz bilasiz» 1) · takrorlash 4 · arena 1 |
| **T2** | Bozorda faqat bor sonlar, «hali tekshirilmagan» | 12 | A-6 · 5 (`QIzoh`, xulosa) · 6 (savol) · 11 (Bozor kartasi, Yordam 2) · 14 (kartochka 6, 7) · 15 («Endi siz bilasiz» 2, uyga vazifa ②) · takrorlash 6 · arena 6 |
| **T3** | Keyingi qadamda pul emas — aniq so'rov | 18 | A-6, A-10 · 1 (reja 03) · 9 (so'rov qadami, `QIzoh`, xulosa) · 11 (Keyingi qadam kartasi, pul detektori, Yordam 6) · 12 (savol) · 14 (kartochka 11, 12) · 15 (2-holat, «Endi siz bilasiz» 4, uyga vazifa ③) · Clear Ask! · takrorlash 12 · arena 9 |
| **T4** | Teglar `m14-dars-NN` (PM: `-done` = `-start`) | 1 | REPO |
| **T18** | K12 Airbnb (YC Demo Day o'rniga) | 9 | sarlavha qatori (Tur) · A-8 · 3 (sarlavha, bashorat) · 4 (savol) · 14 (kartochka 9) · takrorlash 4 · arena 3, 4 |
| **T19** | Atamalar: hakam, savol-javob | 5 | A-4 · 2 (`QIzoh` hakam, savol-javob) · 14 (kartochka 4, 5) |
| **T20** | Dars nomi «Investorga pitchni qanday tuzasiz?» | 2 | sarlavha qatori (Menyu) · 0 (sarlavha) |
Javob boshqacha bo'lsa: T1 (B — besh bo'lak) → 2, 4, 10, 11, 14, 15 va arena 1 qayta yoziladi · T2 (B — tashqi son) → 5, 6 va Yordam 2 · T3 (B — summa mashq sifatida) → 9, 11, 12 va TAQIQLAR 1 ga zid, alohida qaror · T18 (B — YC) → 3, 4 va arena 3, 4.

## GATE M — o'z tekshiruvim (`konveyer/1-MD.md`)
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 460 `m11-13` «Zaxira dars» → 467 **`m12-01` «Investorga pitchni qanday tuzasiz?»** → 468 `m12-02` «Mahsulotingiz hikoyasini qanday aytasiz?» (yakun qatori). Hook sarlavhasi — dars nomi.
  Osti (`sub`) tayanch 2 bilan zid — reja yorlig'ida taklif shakli, KOD 12, TAYANCHGA SAVOL 1.
- [x] Bitta misol-ip — «Maydon Jamoa» (muammo gapi, namuna o'yin, sonlar 1.14 aynan); metafora yo'q; bitta vizual — `OltiBolakSahna` (telefon · bo'laklar · taymer · hakamlar); keys — o'z sahnasi `AirbnbTasma` (PM-028/029). Ikkinchi misol faqat testda (kitob almashish ilovasi — 6; P-002).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 5, 7, 9 (QTushuncha) + 0, 3, 10, 11; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q — har bosish bo'lakni, kartani, hisoblagichni, taymerni yoki tasmani o'zgartiradi.
- [x] O'lchov (skript): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 · to'g'ri izohi ≤60 — jadval yuqorida.
- [x] Atamalar oldingi darslar bilan bir xil: pitch, zal, repetitsiya, halol gap, baholash varag'i, investor («loyihaga pul tikadigan odam» — 10-Modul aynan) · bo'lak, jonli demo, tashkilotchi, o'yinchi, agent (11-Modul) · Raqamlar, Keyingi qadam, zal savollari, dalil, sanoq sahifasi (12-Modul) · Pro, «Doimiy o'yin», test rejim, yozma tasdiq (13-Modul).
  Yangi — hakam, Bozor, Jamoa, savol-javob — misoldan keyin (2-ekran). Siz-forma; tugmalar ot-shaklda yoki siz-formada («Saqlash», «Hali tekshirilmagan», «So'rov qo'shish», «Voqea davomi», «Yakunlash →»); Mentorning olam matni — «men» shaklida (T-008).
- [x] Testlar: 4 variant, uzunlik teng (farq ≤10%), to'g'ri javob hech qayerda yolg'iz eng uzun emas; qo'shtirnoq s6 va s8 da to'rttasida; tire s8 da A va C da; kalit so'z faqat to'g'rida emas (s4 «bo'lak», s6 «shahar», s8 «agent», s12 «aytaman»). Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [x] Final tartib-mashqi yo'q (yakuniy — `QTest`); 10-ekran `QTartib` (ballsiz): uya izohi «bu yerga qo'ying» tartibni ochmaydi, Mentor tartibni aytmaydi, nomlar faqat yechilgach (P-068).
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✗ ✕ ⠿ ⛶ — belgilar) · kafolat so'zlari yo'q: «darrov», «darhol», «har doim», «100%» — o'quvchi matnida 0; «albatta» — faqat 11-ekran detektor ro'yxatida, A-5 «Ishlatilmaydi» va A-9 manfiy misolida (MD ichki).
- [x] Ichki kodlar o'quvchi matnida yo'q (`m12-01`, «Modul 14», K12, A1, «TAXMIN», «Q&A» prozada — yo'q; «Q&A» faqat kartochkada bir marta). Keys — faqat bank matni, manba qatori bilan. «KOD» ro'yxati 16 band, REPO — yo'q (teglar jadvali).
- [x] Karta T · P · S · PM: T-008 (Mentor pitch gaplari — olam matni) · T-011/PM-030 (hakam, Bozor, Jamoa, savol-javob — misoldan keyin; sarlavhalarda yangi atama yo'q: 5, 7, 9 sarlavhalaridagi «Bozor», «Jamoa», «hakam» — 2-ekrandan keyin) ·
  T-014/T-015 (A-5: jamoa uch joyda — bosh harf; so'rov ↔ «Yordam»; slayd — faqat Airbnb; mahsulot ↔ ilova) · T-016 (metafora yo'q) · T-020 · T-029/T-047 (Mentor bashorat yorlig'ini takrorlamaydi) · T-035 (o'quvchi matnida → ÷ × yo'q — Airbnb tartibi «muammo, yechim, …» so'z bilan) ·
  T-038 (Demo Day, 2-dars — yo'q; faqat «Keyingi dars» qatori) · T-039 («pitchingiz» — 12-Modul pitchi bor bo'lsa; 11-ekran Mentori ikki variantda) · T-042 (olti bo'lak gapi so'zma-so'z: 2 xulosa, kartochka 1, yakun) · T-043 («Bu misolda», «Mentor misolida», «Bizda») ·
  T-045 («investitsiya kompaniyaga kiritiladi» — Shubhali joylar) · T-052 (investor ta'rifi aynan) · T-064 (2-ekran sarlavhasi 0-ekran savoliga javob) · P-001 · P-002 · P-008 (≤3 blok; 5, 7, 9 telefonsiz) · P-012 (testlar 4, 6, 8, 12 — ketma-ket emas) · P-013 · P-014/P-015 (reja — natija va'dasi, matnsiz skelet) ·
  P-016 · P-025 · P-033 · P-036 (0-ekranda yangi bo'lak nomi yozilmaydi) · P-046 (11 — o'quvchi kalitlaridan; yakun — saqlangan bo'laklardan) · P-052 · P-053 (3 — `pre` kadr) · P-062 (5-ekran Mentori sonni aytmaydi) · P-063 (`HAKAM_SAVOL`, `JAMOA_PITCH`) · P-064 · P-067 · P-068 ·
  S-001 (savollar 3–9 so'z) · S-002/S-004/S-010 · S-008 · S-015 (bashoratlar bir o'lchovda, o'sish tartibida; keysda bitta) · S-018 (Airbnb izohi 1/3 kadr Mentorida) · S-019 (arena 10: savolda 50, javobda 51) · S-020 · S-026 · S-027 · §144/§145 ·
  PM-005 (2-tur) · PM-017 · PM-018 (Airbnb ichki qarori da'vo qilinmaydi — faqat bank) · PM-020 («So'rov qo'shish» qo'shimchasi gapda tugal) · PM-021 · PM-027 · PM-108 (11-ekran tekshiruvi) · J-026 · SABOQ 1–31, D 36, E 40–55.
- [x] **Qaror-0 TAXMIN** — 58 qator belgilangan (yuqorida); GATE M sahifasida T1, T2, T3, T18 javobi bu darsning 2–15-ekranlariga to'g'ridan-to'g'ri tegadi.
